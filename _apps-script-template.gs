/****************************************************************
 * BUKUTOPIA — backend API (Google Apps Script)
 * ---------------------------------------------------------------
 * Turns a Google Sheet into the database + API for the public
 * catalogue (customer) and the back office (operator).
 *
 * TWO TIERS OF ACTIONS:
 *  - PUBLIC (no token): checkAvailability, signup, login, createOrder,
 *    getOrder. Used by the public catalogue. Customer-scoped only.
 *  - ADMIN (token required): readAll, upsert, delete, setSetting,
 *    confirmPayment, setOrderStatus. Used by the back office only.
 *
 * SETUP (one time):
 *  1. Google Sheet ▸ make a "Catalogue" tab, File ▸ Import ▸ Upload
 *     bukutopia-books.csv (Replace current sheet).
 *  2. Extensions ▸ Apps Script ▸ paste ALL of this file ▸ Save.
 *  3. Change TOKEN below to your own long secret.
 *  4. Run "setup" once (toolbar ▸ Run, approve permissions).
 *     This creates Customers, Orders and Settings tabs and installs
 *     the hourly auto-cancel trigger.
 *  5. Deploy ▸ New deployment ▸ Web app:
 *       Execute as: Me   ·   Who has access: Anyone
 *     Copy the /exec URL into admin.js (API_URL) and catalogue.js (API_URL).
 *
 * When you change this file, re-Deploy (Manage deployments ▸ edit ▸
 * Version: New version ▸ Deploy) so the live URL updates.
 ****************************************************************/

var TOKEN = "__BUKUTOPIA_TOKEN__";   // <-- CHANGE THIS, and match it in admin.js

var TABS = {
  Catalogue: ["series","title","isbn","color","age","audience","price","author","available","series_description","book_description","copiesTotal","copiesAvailable"],
  Customers: ["id","name","child","whatsapp","address","deposit","joinDate","status","passHash","salt"],
  Orders:    ["id","createdAt","accountId","customer","whatsapp","child","titles","isbns","numBooks","type","amount","status","paymentStatus","expiresAt","dateSent","dueDate","returnedDate","receipt","notes"],
  Settings:  ["key","value"],
  Messages:  ["at","phone","direction","text","orderId"]
};
var DEFAULT_SETTINGS = [
  ["deposit", 60],
  ["periodDays", 30],
  ["lateFeePerBookPerMonth", 8],
  ["daysPerLatePeriod", 30],
  ["extensionPerBook", 6],
  ["maxBooks", 4],
  ["paymentCutoff", "the same day, 9pm"]
];

/* ========================= setup ========================= */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(TABS[name]);
    else ensureColumns(sh, TABS[name]);   // add any new columns to existing tabs
  });
  var set = ss.getSheetByName("Settings");
  var have = {}; sheetObjects("Settings").forEach(function (r) { have[r.key] = true; });
  DEFAULT_SETTINGS.forEach(function (r) { if (!have[r[0]]) set.appendRow(r); });
  installAutoCancelTrigger();
  installReminderTrigger();
  try { SpreadsheetApp.getUi().alert("Bukutopia setup complete. Now Deploy ▸ New deployment ▸ Web app."); } catch (e) {}
}

// add missing header columns to an existing sheet (non-destructive)
function ensureColumns(sh, cols) {
  var head = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(String);
  cols.forEach(function (c) {
    if (head.indexOf(c) === -1) { sh.getRange(1, head.length + 1).setValue(c); head.push(c); }
  });
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Bukutopia")
    .addItem("Run auto-cancel now", "autoCancelStaleOrders")
    .addItem("Send due reminders now", "sendDueReminders")
    .addItem("Install auto-cancel + reminders", "installTriggers")
    .addToUi();
}

/* ========================= routing ========================= */
function doGet(e) {
  // WhatsApp webhook verification (Meta Cloud API)
  if (e && e.parameter && e.parameter["hub.mode"]) {
    if (e.parameter["hub.verify_token"] === waCfg().WA_VERIFY) return ContentService.createTextOutput(e.parameter["hub.challenge"]);
    return ContentService.createTextOutput("forbidden");
  }
  // PUBLIC read: catalogue only (no customer or order data).
  return json({ ok: true, catalogue: sheetObjects("Catalogue"), settings: publicSettings() });
}

function doPost(e) {
  var b = {};
  try { b = JSON.parse(e.postData.contents || "{}"); } catch (err) {}
  var a = b.action;

  // ---- WhatsApp inbound webhook (Meta Cloud API, no token) ----
  if (b.object === "whatsapp_business_account" || (b.entry && !a)) { handleWaWebhook(b); return json({ ok: true }); }

  // ---- PUBLIC actions (no token) ----
  if (a === "checkAvailability") return json(checkAvailability(b.isbns || []));
  if (a === "signup")           return json(signup(b));
  if (a === "login")            return json(login(b));
  if (a === "createOrder")      return json(createOrder(b));
  if (a === "getOrder")         return json(getOrder(b));

  // ---- ADMIN actions (token required) ----
  if (b.token !== TOKEN) return json({ error: "Unauthorized" });
  if (a === "readAll")        return json({ ok: true, data: readAll() });
  if (a === "upsert")         { upsert(b.sheet, b.record); return json({ ok: true, data: readAll() }); }
  if (a === "delete")         { remove(b.sheet, b.id);    return json({ ok: true, data: readAll() }); }
  if (a === "setSetting")     { setSetting(b.key, b.value); return json({ ok: true, data: readAll() }); }
  if (a === "confirmPayment") { confirmPayment(b.id);     return json({ ok: true, data: readAll() }); }
  if (a === "setOrderStatus") { setOrderStatus(b.id, b.status, b.fields || {}); return json({ ok: true, data: readAll() }); }
  if (a === "sendWhatsApp")   return json(sendWhatsApp(b.to, b.text, b.orderId));

  // back-compat: plain upsert/delete with token but no recognised action
  return json({ error: "Unknown action" });
}

/* ========================= public: availability ========================= */
function checkAvailability(isbns) {
  var cat = catalogueByIsbn();
  var unavailable = [], available = [];
  isbns.forEach(function (isbn) {
    var row = cat[String(isbn)];
    available_(row) ? available.push(isbn) : unavailable.push(isbn);
  });
  return { ok: true, available: available, unavailable: unavailable };
}
function available_(row) {
  if (!row) return false;
  var av = String(row.available || "").toLowerCase();
  if (av === "no" || av === "false" || av === "0" || av === "out") return false;
  var ca = row.copiesAvailable;
  if (ca === "" || ca === null || ca === undefined) return true;  // blank = unlimited
  return Number(ca) > 0;
}

/* ========================= public: accounts ========================= */
function normPhone(p) { return String(p || "").replace(/[^0-9]/g, ""); }
function hashPass(passcode, salt) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ":" + String(passcode));
  return Utilities.base64Encode(raw);
}
function findCustomerByPhone(phone) {
  phone = normPhone(phone);
  var all = sheetObjects("Customers");
  for (var i = 0; i < all.length; i++) if (normPhone(all[i].whatsapp) === phone) return all[i];
  return null;
}
function isFirstOrderFor(accountId) {
  var orders = sheetObjects("Orders");
  for (var i = 0; i < orders.length; i++) {
    if (String(orders[i].accountId) === String(accountId) && String(orders[i].status) !== "Cancelled") return false;
  }
  return true;
}

function signup(b) {
  var phone = normPhone(b.whatsapp);
  if (!b.name || !phone || !b.passcode) return { error: "Please fill in name, WhatsApp number and a passcode." };
  if (String(b.passcode).length < 4) return { error: "Passcode must be at least 4 characters." };
  if (findCustomerByPhone(phone)) return { error: "An account with this number already exists. Please log in." };
  var salt = Utilities.getUuid();
  var rec = {
    id: Utilities.getUuid(), name: b.name, child: b.child || "", whatsapp: phone,
    address: b.address || "", deposit: setN("deposit", 60), joinDate: todayStr(),
    status: "Active", passHash: hashPass(b.passcode, salt), salt: salt
  };
  upsert("Customers", rec);
  return { ok: true, accountId: rec.id, name: rec.name, isFirstOrder: true };
}

function login(b) {
  var c = findCustomerByPhone(b.whatsapp);
  if (!c) return { error: "No account found for this number. Please create one." };
  if (hashPass(b.passcode, c.salt) !== String(c.passHash)) return { error: "Wrong passcode." };
  return { ok: true, accountId: c.id, name: c.name, isFirstOrder: isFirstOrderFor(c.id) };
}

function authAccount(b) {                 // re-auth used by createOrder
  var c = findCustomerByPhone(b.whatsapp);
  if (!c) return null;
  if (hashPass(b.passcode, c.salt) !== String(c.passHash)) return null;
  return c;
}

/* ========================= public: orders ========================= */
function createOrder(b) {
  var c = authAccount(b);
  if (!c) return { error: "Please log in again to place this order." };
  var items = b.items || [];
  if (!items.length) return { error: "Your list is empty." };
  var maxB = setN("maxBooks", 4);
  if (items.length > maxB) return { error: "Up to " + maxB + " books per order. Please remove a few." };

  // re-check availability and reserve copies
  var avail = checkAvailability(items.map(function (it) { return it.isbn; }));
  if (avail.unavailable.length) return { error: "unavailable", unavailable: avail.unavailable };

  var first = isFirstOrderFor(c.id);
  var amount = first ? setN("deposit", 60)
                     : items.reduce(function (s, it) { return s + (Number(it.price) || 0); }, 0);
  var now = new Date();
  var expires = new Date(now.getTime() + 24 * 3600 * 1000);
  var rec = {
    id: Utilities.getUuid(), createdAt: now.toISOString(), accountId: c.id,
    customer: c.name, whatsapp: c.whatsapp, child: c.child || "",
    titles: items.map(function (it) { return it.title; }).join("; "),
    isbns: items.map(function (it) { return it.isbn; }).join("; "),
    numBooks: items.length, type: first ? "deposit" : "amount", amount: amount,
    status: "Pending payment", paymentStatus: "Unpaid", expiresAt: expires.toISOString(),
    dateSent: "", dueDate: "", returnedDate: "", receipt: "", notes: ""
  };
  upsert("Orders", rec);
  adjustCopies(items.map(function (it) { return it.isbn; }), -1);   // reserve
  return { ok: true, order: {
    id: rec.id, type: rec.type, amount: rec.amount, numBooks: rec.numBooks,
    titles: rec.titles, status: rec.status, expiresAt: rec.expiresAt, firstOrder: first
  }};
}

function getOrder(b) {
  var orders = sheetObjects("Orders");
  for (var i = 0; i < orders.length; i++) {
    if (String(orders[i].id) === String(b.orderId) && normPhone(orders[i].whatsapp) === normPhone(b.whatsapp)) {
      var o = orders[i];
      return { ok: true, order: {
        id: o.id, status: o.status, paymentStatus: o.paymentStatus, amount: o.amount,
        type: o.type, titles: o.titles, expiresAt: o.expiresAt, dueDate: o.dueDate
      }};
    }
  }
  return { error: "Order not found." };
}

/* ========================= admin: order lifecycle ========================= */
function confirmPayment(id) {
  patchOrder(id, { paymentStatus: "Confirmed", status: "Paid" });
}
function setOrderStatus(id, status, fields) {
  var patch = { status: status };
  ["dateSent","dueDate","returnedDate","notes","receipt","paymentStatus"].forEach(function (k) {
    if (fields[k] !== undefined) patch[k] = fields[k];
  });
  var o = findOrder(id);
  patchOrder(id, patch);
  // return reserved copies to inventory when an order ends without the books going out for good
  if (o && (status === "Cancelled" || status === "Returned")) adjustCopies(splitIsbns(o.isbns), +1);
}

/* ========================= auto-cancel ========================= */
function installAutoCancelTrigger() {
  var has = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === "autoCancelStaleOrders"; });
  if (!has) ScriptApp.newTrigger("autoCancelStaleOrders").timeBased().everyHours(1).create();
}
function autoCancelStaleOrders() {
  var sh = sheet("Orders"); if (!sh) return;
  var data = sh.getDataRange().getValues(); var head = data[0].map(String);
  var iStatus = head.indexOf("status"), iPay = head.indexOf("paymentStatus"),
      iExp = head.indexOf("expiresAt"), iIsbn = head.indexOf("isbns");
  var now = new Date();
  for (var r = 1; r < data.length; r++) {
    if (String(data[r][iStatus]) === "Pending payment" && String(data[r][iPay]) !== "Confirmed") {
      var exp = data[r][iExp] ? new Date(data[r][iExp]) : null;
      if (exp && now > exp) {
        sh.getRange(r + 1, iStatus + 1).setValue("Cancelled");
        adjustCopies(splitIsbns(data[r][iIsbn]), +1);
      }
    }
  }
}

/* ========================= inventory ========================= */
function adjustCopies(isbns, delta) {
  if (!isbns || !isbns.length) return;
  var sh = sheet("Catalogue"); if (!sh) return;
  var data = sh.getDataRange().getValues(); var head = data[0].map(String);
  var iIsbn = head.indexOf("isbn"), iCa = head.indexOf("copiesAvailable");
  if (iIsbn < 0 || iCa < 0) return;
  var want = {}; isbns.forEach(function (x) { want[String(x).trim()] = true; });
  for (var r = 1; r < data.length; r++) {
    if (want[String(data[r][iIsbn]).trim()]) {
      var ca = data[r][iCa];
      if (ca === "" || ca === null) continue;   // blank = unlimited, leave alone
      var next = Math.max(0, Number(ca) + delta);
      sh.getRange(r + 1, iCa + 1).setValue(next);
    }
  }
}
function splitIsbns(s) { return String(s || "").split(";").map(function (x) { return x.trim(); }).filter(String); }

/* ========================= sheet helpers ========================= */
function sheet(name) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); }
function todayStr() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"); }
function setN(key, def) { var v = parseFloat(readSettings()[key]); return isNaN(v) ? def : v; }

function sheetObjects(name) {
  var sh = sheet(name); if (!sh || sh.getLastRow() < 2) return [];
  var v = sh.getDataRange().getValues(); var head = v[0].map(function (h) { return String(h).trim(); });
  return v.slice(1).filter(function (r) { return r.join("") !== ""; }).map(function (r) {
    var o = {}; head.forEach(function (h, i) { o[h] = r[i]; }); return o;
  });
}
function catalogueByIsbn() { var m = {}; sheetObjects("Catalogue").forEach(function (r) { m[String(r.isbn).trim()] = r; }); return m; }
function readSettings() { var s = {}; sheetObjects("Settings").forEach(function (r) { s[r.key] = r.value; }); return s; }
function publicSettings() {
  var s = readSettings(), out = {};
  ["deposit","periodDays","maxBooks","extensionPerBook","paymentCutoff"].forEach(function (k) { out[k] = s[k]; });
  return out;
}
function readAll() {
  var msgs = sheetObjects("Messages"); msgs = msgs.slice(Math.max(0, msgs.length - 80));
  return {
    catalogue: sheetObjects("Catalogue"),
    customers: sheetObjects("Customers").map(function (c) { delete c.passHash; delete c.salt; return c; }),
    orders: sheetObjects("Orders"),
    messages: msgs,
    settings: readSettings()
  };
}
function findOrder(id) { var all = sheetObjects("Orders"); for (var i = 0; i < all.length; i++) if (String(all[i].id) === String(id)) return all[i]; return null; }
function patchOrder(id, patch) {
  var sh = sheet("Orders"); if (!sh) return;
  var data = sh.getDataRange().getValues(); var head = data[0].map(String);
  var iId = head.indexOf("id");
  for (var r = 1; r < data.length; r++) {
    if (String(data[r][iId]) === String(id)) {
      Object.keys(patch).forEach(function (k) { var c = head.indexOf(k); if (c >= 0) sh.getRange(r + 1, c + 1).setValue(patch[k]); });
      return;
    }
  }
}

function upsert(name, rec) {
  var sh = sheet(name);
  var head = sh.getDataRange().getValues()[0].map(function (h) { return String(h).trim(); });
  var keyCol = (name === "Catalogue") ? "isbn" : "id";
  var ki = head.indexOf(keyCol);
  var row = head.map(function (h) { return rec[h] !== undefined ? rec[h] : ""; });
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][ki]) === String(rec[keyCol]) && rec[keyCol] !== "") {
      // preserve existing values for any columns not supplied in rec
      for (var c = 0; c < head.length; c++) if (rec[head[c]] === undefined) row[c] = data[i][c];
      sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sh.appendRow(row);
}
function remove(name, id) {
  var sh = sheet(name);
  var head = sh.getDataRange().getValues()[0].map(function (h) { return String(h).trim(); });
  var keyCol = (name === "Catalogue") ? "isbn" : "id";
  var ki = head.indexOf(keyCol);
  var data = sh.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) if (String(data[i][ki]) === String(id)) sh.deleteRow(i + 1);
}
function setSetting(key, value) {
  var sh = sheet("Settings"); var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) if (String(data[i][0]) === String(key)) { sh.getRange(i + 1, 2).setValue(value); return; }
  sh.appendRow([key, value]);
}

/* ========================= WhatsApp (Meta Cloud API) =========================
 * Credentials live in Project Settings -> Script properties (keys):
 *   WA_TOKEN    = permanent access token   WA_PHONE_ID = phone number ID
 *   WA_VERIFY   = a webhook verify token you choose
 * See WHATSAPP-SETUP.md. Until set, sends are skipped (logged as out-skipped).
 */
function installTriggers() { installAutoCancelTrigger(); installReminderTrigger(); }
function waCfg() { return PropertiesService.getScriptProperties().getProperties() || {}; }

function sendWhatsApp(to, text, orderId) {
  var c = waCfg(); to = normPhone(to);
  if (!c.WA_TOKEN || !c.WA_PHONE_ID || !to) { logMessage(to, "out-skipped", text, orderId); return { error: "WhatsApp not configured (set Script properties)" }; }
  var url = "https://graph.facebook.com/v20.0/" + c.WA_PHONE_ID + "/messages";
  var payload = { messaging_product: "whatsapp", to: to, type: "text", text: { preview_url: false, body: String(text || "") } };
  var res = UrlFetchApp.fetch(url, { method: "post", contentType: "application/json",
    headers: { Authorization: "Bearer " + c.WA_TOKEN }, payload: JSON.stringify(payload), muteHttpExceptions: true });
  logMessage(to, "out", text, orderId);
  return { ok: res.getResponseCode() < 300, code: res.getResponseCode(), body: res.getContentText().slice(0, 200) };
}

function logMessage(phone, dir, text, orderId) {
  var sh = sheet("Messages");
  if (!sh) { sh = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Messages"); sh.appendRow(TABS.Messages); }
  sh.appendRow([new Date().toISOString(), normPhone(phone), dir, String(text || ""), orderId || ""]);
}

// Inbound webhook: log each message and attach it to the sender's most recent order
function handleWaWebhook(b) {
  try {
    (b.entry || []).forEach(function (en) {
      (en.changes || []).forEach(function (ch) {
        var v = ch.value || {};
        (v.messages || []).forEach(function (m) {
          var from = normPhone(m.from);
          var text = m.text ? m.text.body : ("[" + (m.type || "message") + "]");
          var ord = latestOrderFor(from);
          logMessage(from, "in", text, ord ? ord.id : "");
          if (ord) patchOrder(ord.id, {
            receipt: (ord.receipt ? ord.receipt + " | " : "") + text,
            paymentStatus: (String(ord.paymentStatus) === "Unpaid" ? "Submitted" : ord.paymentStatus)
          });
        });
      });
    });
  } catch (e) { logMessage("", "error", String(e)); }
}
function latestOrderFor(phone) {
  var os = sheetObjects("Orders").filter(function (o) { return normPhone(o.whatsapp) === normPhone(phone); });
  os.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
  return os[0] || null;
}

function installReminderTrigger() {
  var has = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === "sendDueReminders"; });
  if (!has) ScriptApp.newTrigger("sendDueReminders").timeBased().atHour(9).everyDays(1).create();
}
function sendDueReminders() {
  var orders = sheetObjects("Orders");
  var cutoff = setS("paymentCutoff", "the same day, 9pm");
  var today = new Date(); today.setHours(0, 0, 0, 0);
  orders.forEach(function (o) {
    if ((o.status === "Out" || o.status === "Extended") && o.dueDate) {
      var due = new Date(o.dueDate); due.setHours(0, 0, 0, 0);
      var days = Math.round((due - today) / 86400000);
      if (days === 2 || days === 0) {
        var when = days === 0 ? "today" : "in 2 days";
        sendWhatsApp(o.whatsapp, "Hi " + o.customer + "! 🌸 Reminder: your Bukutopia books (" + o.titles + ") are due back " + when + " (" + o.dueDate + "). Reply to extend (RM" + setN("extensionPerBook", 6) + "/book) or arrange a return. 📚", o.id);
      }
    }
    if (o.status === "Pending payment" && String(o.paymentStatus) !== "Confirmed" && o.expiresAt) {
      var hoursLeft = (new Date(o.expiresAt) - new Date()) / 3600000;
      if (hoursLeft > 0 && hoursLeft <= 6) {
        sendWhatsApp(o.whatsapp, "Hi " + o.customer + "! 🌸 Your Bukutopia order (" + o.titles + ") is still reserved. Please complete payment of RM" + o.amount + " by " + cutoff + " to confirm — otherwise it'll be released. Thank you! 📚", o.id);
      }
    }
  });
}

function json(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
