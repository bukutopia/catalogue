/* ============================================================
   BUKUTOPIA CATALOGUE — configuration
   1) WHATSAPP_NUMBER: full international format, digits only.
   2) SHEET_CSV_URL: leave "" to use the built-in list below,
      or paste a published Google Sheet CSV link.
   ------------------------------------------------------------
   Per-book model: each series holds a `books` list, and every
   book can carry its own ISBN (for its own cover) and its own
   description. The card cover switches to the selected book's
   cover; pick 2+ in a series and it shows the first book's cover
   on a little stack. Series still without per-book data fall back
   to a shared series cover (series `isbns`).
   ============================================================ */
const WHATSAPP_NUMBER = "60185738843";
const SHEET_CSV_URL   = "";
/* Paste your Apps Script Web app URL (ends with /exec) to turn on accounts,
   live availability and real orders. Leave "" to fall back to a simple
   WhatsApp order message (no accounts) until the backend is deployed. */
const API_URL = "https://script.google.com/macros/s/AKfycbyVHxD4ZJXuUwvp8Q0q5JnMFCGmF2Rqwb2BwUJTjNaJyhq14pqXWwLP2_klILWRR2g/exec";
const MAX_BOOKS       = 4;
/* Payment QR shown at checkout. Put your DuitNow/Maybank QR image in this
   folder (and in the GitHub repo) named exactly payment-qr.png. */
const PAYMENT_QR_URL  = "payment-qr.png?v=2";
const PAYEE_NAME      = "Bukutopia · Maybank";

/* Bukutopia brand-kit cover-box tints (soft pink, mint, cream, blue, yellow, coral) */
const SERIES_COLORS = {
  pink:["#fae4df","#f6cfc6"], green:["#e5f2f1","#cfe8e4"], blue:["#dce6f3","#bccde4"],
  orange:["#f9e7cc","#f3d9b0"], purple:["#f9e7cc","#f3d9b0"], yellow:["#ffe9a3","#ffd96b"],
  teal:["#e5f2f1","#cfe8e4"], red:["#f7d2c6","#f0ad97"], navy:["#dce6f3","#bccde4"],
  rose:["#fae4df","#f6cfc6"], plum:["#e5f2f1","#cfe8e4"]
};

/* Extra styles for the per-book list + stacked cover (injected on load
   so we don't have to touch index.html). */
const PILOT_CSS = `
.cover-stack{position:relative;display:inline-block;max-width:82%;line-height:0}
.cover-stack .cover-img{position:relative;z-index:3;display:block;height:auto;width:auto;max-height:186px;max-width:100%}
.cover-stack .sl{position:absolute;inset:0;border-radius:6px;box-shadow:0 7px 16px rgba(16,49,96,.22)}
.cover-stack .sl1{transform:translate(7px,9px) rotate(2.5deg);background:#efe7d8;z-index:2}
.cover-stack .sl2{transform:translate(13px,17px) rotate(5deg);background:#e0d4bd;z-index:1}
.stack-count{position:absolute;left:11px;top:11px;background:var(--navy);color:#fff;font-weight:800;
  font-size:11px;padding:5px 9px;border-radius:999px;z-index:4;box-shadow:var(--shadow-sm)}
.book{border-bottom:1px dashed var(--line);padding:8px 0}
.book:last-child{border-bottom:none}
.book-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.book-toggle{background:none;border:none;font-family:inherit;font-weight:700;font-size:13.5px;
  color:var(--navy);text-align:left;cursor:pointer;padding:0;flex:1;line-height:1.35}
.book-toggle .car{color:var(--coral-dark);font-weight:800;margin-right:3px}
.book-title{font-weight:700;font-size:13.5px;color:var(--navy);flex:1;line-height:1.35}
.book-desc{display:none;font-size:12.5px;color:#52627a;margin:7px 2px 2px;line-height:1.55}
.book.open .book-desc{display:block}
.remove-all{width:100%;margin-top:7px;border:1.5px solid #e5dcc9;background:#fff;color:#103160;
  font-weight:700;font-size:13px;border-radius:999px;padding:9px;cursor:pointer;transition:.15s}
.remove-all:hover{border-color:#e9755c;color:#c0503a}
.remove-all[hidden]{display:none}
`;

/* ---- Built-in catalogue ----
   Pilot series (Supercute, Sophie Mouse) carry per-book isbn + desc.
   The rest keep a shared series cover + titles for now. */
const DEFAULT_BOOKS = [
  {series:"Supercute", color:"pink", age:"5 – 7", audience:"Girls", price:10, author:"Pip Bird",
   desc:"Humorous chapter books about friendship and adventure in the magical World of Cute — perfect for readers moving from picture books to early chapter books.",
   books:[
     {title:"Best Friends Forever", isbn:"9780755501243", coverurl:"covers/9780755501243.jpg", desc:"Lucky the Lunacorn is taking part in the annual Cutest of the Cute competition, up against some seriously talented contestants. With her glowing horn and her best friends cheering her on, can she stay true to herself and still have fun? A sparkly, feel-good start to the series."},
     {title:"The Sleepover Surprise", isbn:"9780755501267", coverurl:"covers/9780755501267.jpg", desc:"Sammy the Sloth is having a sleepover at the museum, complete with treasure hunts and midnight feasts. But when someone starts sabotaging the fun, it's up to Sammy and his friends to sniff out the troublemaker before the whole night is ruined."},
     {title:"Fun in the Sun", isbn:"9780755501281", coverurl:"covers/9780755501281.jpg", desc:"Everyone in Marshmallow Meadow is getting ready for a very special picnic, and Micky the Mini Pig is baking treats for all. When his recipe turns out to be missing one magic ingredient, the friends set off to find it — and run into a whole lot of trouble along the way."},
     {title:"The Adventure School", isbn:"9780755501304", coverurl:"covers/9780755501304.jpg", desc:"At Adventure School the Super Cutes learn all about caring for the natural world — but there's one pupil who'd rather not care about anything: Clive, the spoilt little chihuahua. Can the friends help him discover that looking after others is the cutest thing of all?"},
     {title:"The Kindness Carousel", isbn:"9780008512453", coverurl:"covers/9780008512453.jpg", desc:"A brand-new funfair has rolled into the World of Cute and the friends can't wait to try every ride — except the spooky Ghost Train. When their nerves start to get the better of them, the Super Cutes learn that a little kindness, and a lot of teamwork, makes everything less scary."},
     {title:"The Seaside Rescue", isbn:"9780008512484", coverurl:"covers/9780008512484.jpg", desc:"A summer storm leaves a trail of chaos along the beach, and poor Sol the Sailor Seal has lost his treasured compass. The Super Cutes pull together to set things ship-shape again and help their friend — proving the best rescues are always done as a team."}
   ]},
  {series:"Sophie Mouse", color:"green", age:"5 – 7", audience:"Girls", price:10, author:"Poppy Green",
   desc:"Sophie Mouse lives in Silverlake Forest, goes to school and has gentle adventures about friendship and kindness, with beautiful whimsical illustrations on every page.",
   books:[
     {title:"A New Friend", isbn:"9781481428323", coverurl:"covers/9781481428323.jpg", desc:"There's a new pupil in Sophie Mouse's class — and he's a snake! Everyone is too nervous to go near Owen, but Sophie decides to look past first impressions. A gentle story about kindness and giving new friends a chance."},
     {title:"The Emerald Berries", isbn:"9781481428354", coverurl:"covers/9781481428354.jpg", desc:"Sophie and her friend Hattie Frog head out to gather emerald berries to mix into beautiful green paint. But the best berries grow far from home, and getting to them — and back again safely — turns into a bigger adventure than they bargained for."},
     {title:"Forget-Me-Not Lake", isbn:"9781481429993", coverurl:"covers/9781481429993.jpg", desc:"Summer has arrived in the forest and Sophie can't wait to swim at Forget-Me-Not Lake with her friends. When she realises she never actually learned how to swim, she's afraid of being left out — until her friends show her what real friendship looks like."},
     {title:"Looking for Winston", isbn:"9781481430036", coverurl:"covers/9781481430036.jpg", desc:"Sophie's little brother Winston only wants to help build a fort at Butterfly Brook, but Sophie tells him he's too little to join in. When she changes her mind and goes to find him, Winston has vanished — and Sophie must search the whole forest to bring him home."}
   ]},
  {series:"Press Start!", color:"blue", age:"5 – 7", audience:"Everyone", price:8, author:"Thomas Flintham", isbns:["9781338034721","9781338239102"],
   desc:"Sunny Zaki jumps into his favourite video games with Super Rabbit Boy. It's just like playing the game yourself — only it's a book!",
   books:[
     {title:"Game Over, Super Rabbit Boy!", isbn:"9781338034721", coverurl:"covers/9781338034721.jpg", desc:"In his very first adventure, brave Super Rabbit Boy must rescue his friend Singing Dog from the wicked King Viking. Every time he fails, he just presses start and tries again — like a video game you can read!"},
     {title:"Super Rabbit Boy Powers Up!", isbn:"9781338034738", coverurl:"covers/9781338034738.jpg", desc:"King Viking builds a machine to make his robots unbeatable, so Super Rabbit Boy sets off to power up too. A fast, funny dash through a world of jumps, traps and bosses."},
     {title:"Super Rabbit Racers!", isbn:"9781338034776", coverurl:"covers/9781338034776.jpg", desc:"It's race day in Animal Town, but King Viking is determined to cheat his way to the finish line. Super Rabbit Boy revs up to win fair and square."},
     {title:"Super Rabbit Boy vs Super Rabbit Boss!", isbn:"9781338034752", coverurl:"covers/9781338034752.jpg", desc:"King Viking builds a robot copy of our hero — Super Rabbit Boss — to cause trouble. Now the real Super Rabbit Boy must out-jump his own double."},
     {title:"Super Rabbit Boy Blasts Off!", isbn:"9781338239621", coverurl:"covers/9781338239621.jpg", desc:"King Viking heads into space, so Super Rabbit Boy blasts off after him. A cosmic adventure full of alien worlds and tricky levels."},
     {title:"The Super Side-Quest Test!", isbn:"9781338239782", coverurl:"covers/9781338239782.jpg", desc:"Super Rabbit Boy takes on a string of tricky side-quests to prove he's a true hero. Can he pass every test King Viking throws at him?"},
     {title:"Robo-Rabbit Boy, Go!", isbn:"9781338239812", coverurl:"covers/9781338239812.jpg", desc:"When Super Rabbit Boy is captured, it's up to a little robot version of himself to save the day. A pint-sized hero powers up for a big rescue."},
     {title:"Super Rabbit Boy's Time Jump!", isbn:"9781338568967", coverurl:"covers/9781338568967.jpg", desc:"King Viking invents a time machine and scrambles the past, present and future. Super Rabbit Boy jumps through time to put everything right."},
     {title:"Super Rabbit All-Stars!", isbn:"9781338239843", coverurl:"covers/9781338239843.jpg", desc:"Super Rabbit Boy gathers a team of all-star friends for a championship showdown against King Viking's crew. Teamwork is the ultimate power-up."},
     {title:"Super Rabbit Boy's Team-Up Trouble!", isbn:"9781338568998", coverurl:"covers/9781338568998.jpg", desc:"Super Rabbit Boy must learn to work alongside an unlikely partner to beat King Viking's newest scheme. Two heroes are better than one — if they can stop squabbling."},
     {title:"Super Cheat Codes and Secret Modes!", isbn:"9781338569025", coverurl:"covers/9781338569025.jpg", desc:"King Viking discovers secret cheat codes that bend the rules of the game world. Super Rabbit Boy has to play smart to win without cheating."},
     {title:"Super Rabbit Boy World!", isbn:"9781338569056", coverurl:"covers/9781338569056.jpg", desc:"A brand-new game world opens up, packed with fresh levels and hidden surprises. Super Rabbit Boy explores it all to stop King Viking's latest plot."},
     {title:"Super King Viking Land!", isbn:"9781338828757", coverurl:"covers/9781338828757.jpg", desc:"King Viking builds his very own theme-park world full of traps. Super Rabbit Boy must survive every ride and attraction to save his friends."},
     {title:"Super Rabbit Boy vs the Mega Mole Gigabot!", isbn:"9781546110439", coverurl:"covers/9781546110439.jpg", desc:"King Viking unleashes a giant mole robot that's burrowing chaos everywhere. Super Rabbit Boy digs deep to defeat the Gigabot."},
     {title:"Super Rabbit Girl Between the Worlds", isbn:"9781546183570", desc:"Super Rabbit Girl takes the lead, leaping between game worlds to stop King Viking once and for all. A high-speed adventure starring a brand-new hero."}
   ]},
  {series:"The Hundred-Mile-an-Hour Dog", color:"orange", age:"7 – 9", audience:"Everyone", price:10, author:"Jeremy Strong",
   desc:"Streaker is a rocket on four legs with a woof attached. Ordinary boy Trevor and his unbelievably fast dog cause non-stop, laugh-out-loud chaos.",
   books:[
     {title:"The Hundred-Mile-An-Hour Dog", isbn:"9780141322346", coverurl:"covers/9780141322346.jpg", desc:"Trevor's dog Streaker is less a pet and more a rocket on four legs. With a bet riding on it he has until the end of the holidays to teach her to behave — but training a hundred-mile-an-hour whirlwind to sit still is easier said than done."},
     {title:"Return of the Hundred-Mile-An-Hour Dog", isbn:"9780141322353", coverurl:"covers/9780141322353.jpg", desc:"Streaker is back and faster than ever, and this time she lands Trevor in a mountain of mud and mayhem. When she has to stay out of trouble to help at the mayor's big event, disaster is only a wagging tail away."},
     {title:"Wanted! The Hundred-Mile-An-Hour Dog", isbn:"9780141324401", coverurl:"covers/9780141324401.jpg", desc:"Streaker's latest hobby is pinching food, and now there are 'WANTED' posters all over town. With a determined dog-catcher on her trail, Trevor and his friend Tina race to clear her name."},
     {title:"Lost! The Hundred-Mile-An-Hour Dog", isbn:"9780141323251", coverurl:"covers/9780141323251.jpg", desc:"Streaker bolts after a pie-stealing robber and vanishes for miles — REALLY lost this time. Trevor sets off on a frantic, funny chase to track down his unstoppable dog and bring her home."},
     {title:"Christmas Chaos for the Hundred-Mile-An-Hour Dog", isbn:"9780141325002", coverurl:"covers/9780141325002.jpg", desc:"Something mysterious has happened to Streaker's puppies, and Trevor turns detective to find them. But with Streaker causing havoc everywhere she goes, can he crack the case before Christmas?"},
     {title:"The Hundred-Mile-An-Hour Dog Goes for Gold!", isbn:"9780141339962", coverurl:"covers/9780141339962.jpg", desc:"The Animal Games are coming to town — show-jumping for rabbits, discus for dogs — so naturally Streaker has to enter. Mum reckons a carrot is more obedient, but Trevor is sure his rocket-powered dog can go for GOLD."},
     {title:"Kidnapped: The Hundred-Mile-An-Hour Dog's Sizzling Summer", isbn:"9780141344195", coverurl:"covers/9780141344195.jpg", desc:"On a summer campsite Streaker finds a partner-in-crime — a dog named Pascal — and the trouble doubles. When pets start mysteriously disappearing, Streaker is suddenly on the trail of a real kidnapper."}
   ]},
  {series:"The Bolds", color:"purple", age:"7 – 10", audience:"Everyone", price:10, author:"Julian Clary",
   desc:"A family of hyenas disguise themselves as humans called the Bolds — living in a suburban house and hiding their animal features for hilarious adventures.",
   books:[
     {title:"The Bolds", isbn:"9781783443055", coverurl:"covers/9781783443055.jpg", desc:"The Bolds look like a perfectly ordinary suburban family — except they're really hyenas, tucking their tails into their trousers and giggling at their own jokes. Keeping their animal secret among the humans makes for warm, hilarious chaos."},
     {title:"The Bolds to the Rescue", isbn:"9781783443802", coverurl:"covers/9781783443802.jpg", desc:"The Bolds can never resist helping an animal in need, so their house soon overflows with unexpected guests — including a runaway crocodile. As the menagerie grows, so does the risk of their furry secret getting out."}
   ]},
  {series:"Captain Underpants", color:"yellow", age:"7 – 10", audience:"Everyone", price:10, author:"Dav Pilkey",
   desc:"The silliest superhero ever! George and Harold hypnotise their grumpy principal, who becomes the enthusiastic, dim-witted Captain Underpants.",
   books:[
     {title:"The Adventures of Captain Underpants", isbn:"9780545499088", coverurl:"covers/9780545499088.jpg", desc:"Fourth-graders George and Harold love a good prank, so when they hypnotise their grumpy headteacher Mr Krupp, they accidentally turn him into Captain Underpants — a caped hero in his pants. Their very first comic springs to ridiculous life."},
     {title:"Attack of the Talking Toilets", isbn:"9780545599320", desc:"George and Harold's latest comic comes true when an army of talking toilets tries to gobble up the whole school. Only Captain Underpants — and a lot of toilet paper — can save the day."},
     {title:"Invasion of the Incredibly Naughty Cafeteria Ladies from Outer Space", isbn:"9780545694704", desc:"Strange new lunch ladies arrive with an out-of-this-world plan to turn the pupils into zombie nerds. It is up to George, Harold and Captain Underpants to foil the alien menu."},
     {title:"The Perilous Plot of Professor Poopypants", isbn:"9780545871877", desc:"A brilliant but very touchy inventor decides to get revenge on everyone who ever laughed at his silly name. Captain Underpants must stop Professor Poopypants before the whole world is renamed."},
     {title:"The Wrath of the Wicked Wedgie Woman", isbn:"9781338216233", desc:"When mean Ms Ribble becomes a waistband-snapping super-villain, Captain Underpants finally meets his match. George and Harold scramble to rescue their underwear-clad hero."},
     {title:"The Big, Bad Battle of the Bionic Booger Boy, Part 1", isbn:"9781338271492", desc:"A school science experiment goes horribly, snottily wrong and a monstrous booger creature is born. Part one of a gloriously gross two-part showdown."},
     {title:"The Big, Bad Battle of the Bionic Booger Boy, Part 2", isbn:"9781338271508", desc:"The sneezy saga continues as the Robo-Boogers return for revenge. George, Harold and Captain Underpants must clean up the mess once and for all."},
     {title:"The Preposterous Plight of the Purple Potty People", isbn:"9781338271515", coverurl:"covers/9781338271515.jpg", desc:"A trip through a time-and-space portal lands the boys in a parallel world full of evil versions of themselves. Captain Underpants faces his most preposterous adventure yet."},
     {title:"The Terrifying Return of Tippy Tinkletrousers", isbn:"9781338347210", coverurl:"covers/9781338347210.jpg", desc:"Professor Poopypants is back — now as the time-travelling Tippy Tinkletrousers — and he wants to erase George and Harold from history. A wibbly-wobbly time-travel romp."},
     {title:"The Revolting Revenge of the Radioactive Robo-Boxers", isbn:"9781338347234", desc:"The time-twisting chaos rolls on as giant robotic pants threaten the future. Captain Underpants leaps in for another rescue."},
     {title:"The Tyrannical Retaliation of the Turbo Toilet 2000", isbn:"9781338347241", desc:"The biggest, baddest talking toilet of them all returns for revenge. George, Harold and their hero face a flush-tastic final battle."},
     {title:"The Sensational Saga of Sir Stinks-a-Lot", isbn:"9781338347258", desc:"In the grand finale, a smelly new villain and a horde of monsters descend on the school. The boys and Captain Underpants take one last stand to save the day."}
   ]},
  {series:"Charlotte's Web", color:"teal", age:"9 – 12", audience:"Everyone", price:10, author:"E. B. White",
   desc:"A classic tale of friendship between a pig named Wilbur and a wise barn spider, Charlotte, who hatches a clever plan to save his life.",
   books:[
     {title:"Charlotte's Web", isbn:"9780064410939", coverurl:"covers/9780064410939.jpg", desc:"When a runt piglet named Wilbur is saved from the chop, he finds an unlikely best friend in Charlotte, a wise grey barn spider. To save his life, Charlotte spins words of praise into her web — a tender classic about friendship, loyalty and the cycle of life."}
   ]},
  {series:"Enid Blyton Mysteries (The Find-Outers)", color:"red", age:"9 – 12", audience:"Everyone", price:10, author:"Enid Blyton", isbns:["9781405270334","9780749745257"],
   desc:"Five friends and their dog Buster solve village mysteries in Peterswood, always outsmarting the bumbling local policeman, Mr Goon.",
   books:[
     {title:"The Mystery of the Burnt Cottage", isbn:"9781405270334", coverurl:"covers/9781405270334.jpg", desc:"When a cottage burns down in Peterswood, five children and their dog Buster turn detective for the very first time. The Find-Outers race to beat bumbling policeman Mr Goon to the culprit."},
     {title:"The Mystery of the Disappearing Cat", isbn:"9781405272261", desc:"A prize-winning Siamese cat vanishes into thin air, and the Find-Outers are on the case. Cue clues, disguises and another win over poor Mr Goon."},
     {title:"The Mystery of the Secret Room", isbn:"9781405272278", desc:"The children discover a mysterious locked room in an empty house and set out to uncover its secret. Another twisty Peterswood puzzle for the young detectives."},
     {title:"The Mystery of the Spiteful Letters", isbn:"9781405203968", desc:"Nasty anonymous letters are upsetting the whole village, and the Find-Outers vow to unmask the writer. A clever case of handwriting, suspects and red herrings."},
     {title:"The Mystery of the Missing Necklace", isbn:"9781405272292", desc:"A valuable necklace goes missing and Fatty's talent for disguise is put to the test. The Find-Outers follow the trail of a gang of jewel thieves."},
     {title:"The Mystery of the Hidden House", isbn:"9781405272308", desc:"A lonely, hidden house holds a secret the children are determined to crack. Plenty of suspense and laughs as they investigate."},
     {title:"The Mystery of the Pantomime Cat", isbn:"9781405272315", desc:"A theatre robbery and a missing pantomime-cat costume set the Find-Outers a brand-new puzzle. Lights, clues and another triumph over Mr Goon."},
     {title:"The Mystery of the Invisible Thief", isbn:"9781405272325", desc:"Strange thefts with no visible culprit baffle Peterswood — but not the Find-Outers. They follow giant footprints to a very surprising answer."},
     {title:"The Mystery of the Vanished Prince", isbn:"9781405272339", desc:"A visiting prince disappears and the children dive into a case full of disguises and double-crosses. Fatty's detective skills shine brightest yet."},
     {title:"The Mystery of the Strange Bundle", isbn:"9781405272346", desc:"A mysterious bundle and a string of odd clues lead the Find-Outers on another tangled hunt. Can they crack it before Mr Goon muddles everything?"},
     {title:"The Mystery of Holly Lane", isbn:"9781405272353", coverurl:"covers/9781405272353.jpg", desc:"A blind old man, a hidden fortune and a knot of clues make Holly Lane the Find-Outers' next challenge. Sharp detective work all round."},
     {title:"The Mystery of Tally-Ho Cottage", isbn:"9781405204040", desc:"Stolen goods and suspicious neighbours surround Tally-Ho Cottage. The children — and Buster — sniff out the truth."},
     {title:"The Mystery of the Missing Man", isbn:"9781405272377", desc:"The Find-Outers help track down a wanted man, working (reluctantly) alongside the police. A faster-paced, higher-stakes case."},
     {title:"The Mystery of the Strange Messages", isbn:"9781405272384", desc:"Mr Goon receives odd, threatening notes and — for once — turns to the children for help. The Find-Outers set about decoding the strange messages."},
     {title:"The Mystery of Banshee Towers", isbn:"9781405204071", coverurl:"covers/9781405204071.jpg", desc:"In their final case, the Find-Outers investigate eerie goings-on and a possible art theft at spooky Banshee Towers. One last clever adventure."}
   ]},
  {series:"Diary of a Wimpy Kid", color:"navy", age:"9 – 12", audience:"Everyone", price:10, author:"Jeff Kinney", isbns:["9780141324906","9780810993136"],
   desc:"The illustrated diary of Greg Heffley, a self-centred middle-schooler stumbling through popularity, friendship and family drama.",
   books:[
     {title:"The Ugly Truth", isbn:"9780141335445", coverurl:"covers/9780141335445.jpg", desc:"Greg is being pushed to grow up — new responsibilities, awkward changes and the dreaded school 'maturity' talk. Growing up, it turns out, is no fun at all."},
     {title:"Cabin Fever", isbn:"9780141343006", coverurl:"covers/9780141343006.jpg", desc:"A massive snowstorm traps Greg and his family indoors over the holidays, just as he's in trouble for something he didn't quite do. Cooped-up chaos ensues."},
     {title:"The Third Wheel", isbn:"9780141345901", coverurl:"covers/9780141345901.jpg", desc:"With a school dance looming, Greg navigates the baffling world of crushes and dates — and somehow ends up the odd one out. A funny look at first romance."},
     {title:"Hard Luck", isbn:"9780141353074", coverurl:"covers/9780141353074.jpg", desc:"Greg's luck has run out: best friend Rowley has a new girlfriend, leaving Greg on his own. He starts letting a Magic 8-Ball make all his decisions, with disastrous results."},
     {title:"The Long Haul", isbn:"9780141357805", coverurl:"covers/9780141357805.jpg", desc:"A family road trip meant to be fun turns into a comedy of errors — wrong turns, a runaway pig and one motel mishap after another."},
     {title:"Old School", isbn:"9780141364728", desc:"Greg's town goes 'back to basics' and ditches technology, and his mum signs him up for a rustic school camp. Roughing it is much harder than it looks."},
     {title:"Double Down", isbn:"9780141373232", coverurl:"covers/9780141373232.jpg", desc:"Greg dreams up a get-rich scheme to make a scary video game, but his mum wants him doing wholesome activities instead. His two worlds hilariously collide."},
     {title:"The Getaway", isbn:"9780141385259", coverurl:"covers/9780141385259.jpg", desc:"The Heffleys escape winter for a tropical resort, hoping for relaxation — but sunburn, dodgy food and family squabbles turn paradise into chaos."},
     {title:"The Meltdown", isbn:"9781419736421", coverurl:"covers/9781419736421.jpg", desc:"When snow shuts the school, an epic neighbourhood snowball war breaks out. Greg and Rowley must pick a side to survive the big freeze."},
     {title:"Wrecking Ball", isbn:"9781419739033", coverurl:"covers/9781419739033.jpg", desc:"An unexpected windfall lets the Heffleys renovate their home — but the building work uncovers far more trouble than anyone bargained for."},
     {title:"The Deep End", isbn:"9781419748684", desc:"A family camping trip in a cramped RV goes off the rails when storms and a flooded site leave the Heffleys stranded. Wet, wild and very wimpy."},
     {title:"Big Shot", isbn:"9781419749155", desc:"Greg reluctantly gets roped into basketball, determined to prove he can be a sports star despite zero talent. A slam-dunk of sporty disasters."},
     {title:"Diper Överlöde", isbn:"9781419762949", coverurl:"covers/9781419762949.jpg", desc:"Greg's brother Rodrick chases rock-and-roll fame with his band Löded Diper, and Greg gets pulled into the madness. Can the band ever hit the big time?"},
     {title:"Diary of an Awesome Friendly Kid", isbn:"9781419740275", coverurl:"covers/9781419740275.jpg", desc:"Rowley Jefferson tells the story his way — a cheerful, sweetly clueless companion to Greg's diaries. The same world seen through his best friend's eyes."}
   ]},
  {series:"Dork Diaries", color:"rose", age:"10 – 12", audience:"Girls", price:10, author:"Rachel Renée Russell", isbns:["9781416980063","9781847387516"],
   desc:"Nikki Maxwell's doodle-filled diary navigates middle school, mean girls, BFF drama and first crushes.",
   books:[
     {title:"Tales from a Not-So-Fabulous Life", isbn:"9781416980063", desc:"Nikki Maxwell starts at a posh new school where she feels like a total dork, especially next to mean queen-bee Mackenzie. Through her doodle-filled diary she slowly finds her feet — and real friends in Chloe and Zoey."},
     {title:"Party Time", isbn:"9781416980087", coverurl:"covers/9781416980087.jpg", desc:"Nikki juggles a big school dance, a babysitting disaster and Mackenzie's scheming all at once. Friendship and laughs win the day."},
     {title:"Pop Star", isbn:"9781442411906", desc:"Nikki's secret musical talent lands her band a shot at the spotlight — if Mackenzie doesn't sabotage it first. Stage fright, crushes and big dreams."},
     {title:"Skating Sensation", isbn:"9781471144752", coverurl:"covers/9781471144752.jpg", desc:"An ice-skating fundraiser puts Nikki and her friends on the rink, with Mackenzie out to spoil it. Can the team pull off a winning routine?"},
     {title:"Dear Dork", isbn:"9781471144769", desc:"Nikki takes over the school newspaper's advice column, dishing out tips to everyone else while her own life gets messier than ever."},
     {title:"Holiday Heartbreak", isbn:"9781471144776", desc:"A Valentine's dance brings crushes, jealousy and a fresh dose of Mackenzie drama. Nikki navigates the most nerve-wracking holiday of the year."},
     {title:"TV Star", isbn:"9781471117671", desc:"A reality-TV crew descends on Nikki's life and the cameras catch every embarrassing moment. Fame is far more awkward than it looks."},
     {title:"Once Upon a Dork", isbn:"9781471122774", desc:"A bump on the head sends Nikki into a fairy-tale dream where her friends and enemies play storybook roles. A funny, twisty fantasy detour."},
     {title:"Drama Queen", isbn:"9781471117718", desc:"Told partly through Mackenzie's own diary, this one gives a hilarious peek at the queen bee's side of the story."},
     {title:"Puppy Love", isbn:"9781471144585", desc:"Nikki rescues a litter of stray puppies and tries to find them homes — all while keeping it secret from her parents. Heart-melting chaos."},
     {title:"Frenemies Forever", isbn:"9781471158049", desc:"Nikki and Mackenzie are forced to team up, testing whether two sworn enemies could ever actually become friends."},
     {title:"Crush Catastrophe", isbn:"9781471167751", desc:"A new boy and a tangle of mixed signals turn Nikki's love life upside down. Crushes, texts and total confusion."},
     {title:"Birthday Drama!", isbn:"9781471172779", coverurl:"covers/9781471172779.jpg", desc:"Nikki's dream birthday party threatens to become a disaster as plans — and Mackenzie — keep getting in the way. Can she save the big day?"},
     {title:"Spectacular Superstar", isbn:"9781471172809", desc:"Nikki's many talents are put to the test as she chases a once-in-a-lifetime opportunity. The spotlight has never felt so wobbly."},
     {title:"I Love Paris!", isbn:"9781471196836", desc:"A school trip to Paris should be a dream — until Mackenzie tags along and the mishaps pile up. Romance, fashion and dork-tastic adventures abroad."},
     {title:"How to Dork Your Diary", isbn:"9780857073525", desc:"A fun how-to companion in which Nikki shows readers how to keep their very own dork diary. Tips, doodles and behind-the-scenes giggles."}
   ]},
  {series:"The Train to Impossible Places", color:"plum", age:"10 – 14", audience:"Everyone", price:10, author:"P. G. Bell",
   desc:"Suzy discovers a magical troll-operated train running through her house and becomes a postie for the Impossible Postal Express, delivering parcels across magical worlds.",
   books:[
     {title:"The Train to Impossible Places", isbn:"9781984848741", coverurl:"covers/9781984848741.jpg", desc:"When a troll-driven delivery train comes thundering through her living room, Suzy Smith can't resist climbing aboard. She becomes the newest 'postie' for the Impossible Postal Express, whisking parcels across magical worlds — and into a dangerous mystery."},
     {title:"The Great Brain Robbery", isbn:"9781250190055", coverurl:"covers/9781250190055.jpg", desc:"Suzy is back on the Impossible Postal Express, but the magical mail service is in danger and a sinister plot threatens everyone aboard. To save her friends she must outwit a villain who's stealing the cleverest minds in the Union of Impossible Places."},
     {title:"Delivery to the Lost City", isbn:"9781250190079", coverurl:"covers/9781250190079.jpg", desc:"The Express must return one very overdue library book — except the book is alive, brimming with dangerous magic, and the world it belongs to has vanished. Suzy and her friends will need all their ingenuity to find a lost city before the magic runs wild."}
   ]}
];

/* ============================================================ */
let BOOKS = [];
const cart = new Set();
function saveCart(){try{localStorage.setItem("bk_cart",JSON.stringify([...cart]));}catch(e){}}
function loadCart(){try{const a=JSON.parse(localStorage.getItem("bk_cart")||"[]");if(Array.isArray(a)){const valid=new Set();(BOOKS||[]).forEach(x=>(x.books||[]).forEach(b=>valid.add(x.series+" :: "+b.title)));a.forEach(k=>{if(valid.has(k))cart.add(k);});}}catch(e){}}
function saveSession(){try{session?localStorage.setItem("bk_session",JSON.stringify(session)):localStorage.removeItem("bk_session");}catch(e){}}
function loadSession(){try{const x=JSON.parse(localStorage.getItem("bk_session")||"null");if(x&&x.whatsapp)session=x;}catch(e){}}
const stickyCover = {};   // series name -> clicked title (the locked cover)

function normalize(list){
  return list.map(s=>{
    const books = (s.books && s.books.length)
      ? s.books.map(b=>({title:b.title, isbn:b.isbn||"", desc:b.desc||"", coverurl:b.coverurl||""}))
      : (s.titles||[]).map(t=>({title:t, isbn:"", desc:"", coverurl:""}));
    return {...s, books, titles:books.map(b=>b.title)};
  });
}

function parseCSV(text){
  const rows=[]; let row=[], field="", q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){field+='"';i++;} else q=false; } else field+=c; }
    else{ if(c==='"')q=true; else if(c===','){row.push(field);field="";}
      else if(c==='\n'){row.push(field);rows.push(row);row=[];field="";}
      else if(c!=='\r')field+=c; }
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  return rows;
}
function booksFromCSV(text){
  // Supports BOTH one-row-per-book sheets (a "title" column, grouped by "series")
  // and older one-row-per-series sheets (a "titles" list).
  const rows=parseCSV(text).filter(r=>r.some(c=>c.trim()!==""));
  if(!rows.length) return [];
  let hi=rows.findIndex(r=>r.map(c=>c.trim().toLowerCase()).includes("series"));
  if(hi<0) hi=0;
  const head=rows[hi].map(h=>h.trim().toLowerCase());
  const idx=n=>head.indexOf(n);
  const perBook = idx("title")>=0;
  const order=[], map={};
  rows.slice(hi+1).forEach(r=>{
    const g=n=>{const i=idx(n);return i>=0?(r[i]||"").trim():"";};
    const series=g("series"); if(!series) return;
    if(!map[series]){
      const av=g("available").toLowerCase();
      map[series]={ series, color:(g("color")||"teal").toLowerCase(), age:g("age"),
        audience:g("audience")||"Everyone", price:parseFloat(g("price"))||0, author:g("author"),
        available: av===""? true : !(av==="no"||av==="false"||av==="0"||av==="out"),
        desc:g("series_description")||g("description")||g("desc")||"",
        coverurl:g("series_coverurl")||"",
        isbns:(g("isbns")||"").split(/\s*;\s*/).filter(Boolean),
        titles:[], books:[] };
      order.push(series);
    }
    const o=map[series];
    if(perBook){
      const title=g("title");
      if(title) o.books.push({ title, isbn:g("isbn"),
        desc:g("book_description")||g("description")||"", coverurl:g("coverurl") });
    }else{
      (g("titles")||"").split(/\s*;\s*/).filter(Boolean).forEach(t=>o.titles.push(t));
    }
  });
  return order.map(s=>map[s]);
}

const grid=document.getElementById("grid");
const empty=document.getElementById("empty");

function coverStyle(color){
  const c=SERIES_COLORS[color]||SERIES_COLORS.teal;
  return `background:linear-gradient(135deg,${c[0]},${c[1]})`;
}
function coverSrcs(s, book){
  if(book && book.coverurl){
    const a=[book.coverurl];
    if(book.isbn){ const loc="covers/"+book.isbn+".jpg"; if(loc!==book.coverurl) a.push(loc); }
    return a;
  }
  if(book && book.isbn) return [`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`];
  if(s.coverurl) return [s.coverurl];
  return (s.isbns||[]).map(i=>`https://covers.openlibrary.org/b/isbn/${i}-L.jpg?default=false`);
}
function coverFallback(img){
  const left=(img.dataset.srcs||"").split("|").filter(Boolean);
  if(left.length){ img.dataset.srcs=left.slice(1).join("|"); img.src=left[0]; }
  else{ const st=img.closest(".cover-stack")||img; st.style.display="none";
        const ph=st.parentNode.querySelector(".cover-ph"); if(ph)ph.style.display="flex"; }
}
window.coverFallback=coverFallback;

const GAL_CSS = `
.look-inside{background:none;border:none;color:var(--coral-dark);font-weight:800;font-size:12px;cursor:pointer;padding:2px 0 0;font-family:inherit}
.look-inside:hover{text-decoration:underline}
.bk-gal{position:fixed;inset:0;background:rgba(16,49,96,.82);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.bk-gal-inner{position:relative;max-width:92vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:10px}
.bk-gal-inner img{max-width:88vw;max-height:78vh;border-radius:8px;background:#fff;box-shadow:0 14px 40px rgba(0,0,0,.45)}
.bk-gal-cap{color:#fff;font-weight:700;font-size:14px;text-align:center}
.bk-gal-x{position:absolute;top:-14px;right:-6px;background:#fff;border:none;border-radius:50%;width:34px;height:34px;font-size:16px;font-weight:900;cursor:pointer;color:var(--navy)}
.bk-gal-prev,.bk-gal-next{position:fixed;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.92);border:none;width:46px;height:46px;border-radius:50%;font-size:26px;font-weight:900;cursor:pointer;color:var(--navy)}
.bk-gal-prev{left:14px}.bk-gal-next{right:14px}
.cov-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:5;background:rgba(255,255,255,.92);border:none;width:30px;height:30px;border-radius:50%;font-size:19px;font-weight:900;line-height:1;cursor:pointer;color:var(--navy);box-shadow:0 2px 8px rgba(16,49,96,.28);display:flex;align-items:center;justify-content:center;padding:0}
.cov-nav:hover{background:#fff}
.cov-prev{left:8px}.cov-next{right:8px}
.cov-count{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);z-index:5;background:rgba(16,49,96,.78);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px}
`;
function openGallery(isbn){
  let book=null;
  for(let i=0;i<BOOKS.length;i++){const f=(BOOKS[i].books||[]).find(x=>String(x.isbn)===String(isbn));if(f){book=f;break;}}
  if(!book||!book.images||!book.images.length)return;
  const imgs=book.images; let idx=0;
  const ov=document.createElement("div"); ov.className="bk-gal";
  function draw(){ ov.innerHTML='<div class="bk-gal-inner"><button class="bk-gal-x" aria-label="Close">✕</button><img src="'+escAttr(imgs[idx])+'" alt="'+escAttr(book.title)+'"><div class="bk-gal-cap">'+esc(book.title)+' — '+(idx+1)+'/'+imgs.length+'</div></div>'+(imgs.length>1?'<button class="bk-gal-prev" aria-label="Previous">‹</button><button class="bk-gal-next" aria-label="Next">›</button>':''); }
  draw();
  ov.addEventListener("click",e=>{ const t=e.target;
    if(t===ov||t.classList.contains("bk-gal-x")){ ov.remove(); return; }
    if(t.classList.contains("bk-gal-next")){ idx=(idx+1)%imgs.length; draw(); }
    else if(t.classList.contains("bk-gal-prev")){ idx=(idx-1+imgs.length)%imgs.length; draw(); }
  });
  document.body.appendChild(ov);
}
window.openGallery=openGallery;
function galNav(btn,dir){
  const cover=btn.closest(".cover"); if(!cover)return;
  const img=cover.querySelector(".cover-img"); if(!img)return;
  const list=(img.getAttribute("data-gallery")||"").split("|").filter(Boolean); if(list.length<2)return;
  let i=parseInt(img.getAttribute("data-gidx")||"0",10)||0;
  i=(i+dir+list.length)%list.length;
  img.setAttribute("data-gidx",String(i)); img.setAttribute("data-srcs",""); img.onerror=null;
  img.src=list[i];
  const c=cover.querySelector(".cov-count"); if(c)c.textContent=(i+1)+" / "+list.length;
}
window.galNav=galNav;

function esc(s){return (s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function escAttr(s){return esc(s).replace(/"/g,"&quot;");}

function selectedBooks(s){
  const prefix=s.series+" :: ";
  const sel=[...cart].filter(k=>k.startsWith(prefix)).map(k=>k.slice(prefix.length));
  return s.books.filter(b=>sel.includes(b.title));
}

function coverInner(s, book, stacked, count){
  const srcs=coverSrcs(s, book);
  const sold = s.available===false ? `<span class="soldout">Coming soon</span>` : "";
  const ph=`<div class="cover-ph"${srcs.length?"":' style="display:flex"'}><svg class="fl ph-fl"><use href="#sprig"/></svg><div class="ph-name">${esc(s.series)}</div></div>`;
  const gallery = (book && book.images && book.images.length>1 && !stacked) ? book.images : null;
  const img=srcs.length
    ? `<div class="cover-stack">${stacked?'<div class="sl sl2"></div><div class="sl sl1"></div>':''}<img class="cover-img" src="${escAttr(srcs[0])}" data-srcs="${escAttr(srcs.slice(1).join("|"))}"${gallery?` data-gallery="${escAttr(gallery.join("|"))}" data-gidx="0"`:""} alt="${escAttr(book?book.title:s.series)} cover" loading="lazy" onerror="coverFallback(this)"></div>`
    : "";
  const nav = gallery ? `<button class="cov-nav cov-prev" onclick="galNav(this,-1)" aria-label="Previous page">‹</button><button class="cov-nav cov-next" onclick="galNav(this,1)" aria-label="Next page">›</button><span class="cov-count">1 / ${gallery.length}</span>` : "";
  const badge = (stacked && count) ? `<span class="stack-count">${count} books added</span>` : "";
  return `${badge}${img}${nav}${ph}<span class="price">RM${s.price}/book</span>${sold}`;
}
// Resting cover when not hovering: 2+ ADDED -> stacked (first book on top);
// else the clicked/sticky book; else the first book.
function restingState(s){
  const sel=selectedBooks(s);
  if(sel.length>=2) return {book:s.books[0], stacked:true, count:sel.length};
  const stick = stickyCover[s.series] ? s.books.find(b=>b.title===stickyCover[s.series]) : null;
  return {book: stick||s.books[0], stacked:false, count:0};
}

function card(s){
  const avail = s.available!==false;
  const bookRows = s.books.map(b=>{
    const key=s.series+" :: "+b.title;
    const bAvail=(s.available!==false)&&(b.available!==false);
    const on=cart.has(key);
    const lbl=!bAvail?"Unavailable":(on?"Added ✓":"+ Add");
    const titleEl = b.desc
      ? `<button class="book-toggle"><span class="car">▸</span>${esc(b.title)}</button>`
      : `<span class="book-title">${esc(b.title)}</span>`;
    const descEl = b.desc ? `<div class="book-desc">${esc(b.desc)}</div>` : "";
    return `<div class="book${on?' sel':''}" data-title="${escAttr(b.title)}">
      <div class="book-row">${titleEl}
        <button class="add-btn${on?' added':''}" data-key="${escAttr(key)}" ${bAvail?"":"disabled"}>${lbl}</button>
      </div>${descEl}</div>`;
  }).join("");

  const author = s.author? `<div class="author">by ${esc(s.author)}</div>` : "";
  const rs=restingState(s);
  return `<div class="card" data-series="${escAttr(s.series)}">
    <div class="cover" style="${coverStyle(s.color)}">${coverInner(s,rs.book,rs.stacked,rs.count)}</div>
    <div class="card-body">
      <h3 class="series-name">${esc((s.series&&String(s.series).trim())?s.series:((s.books&&s.books[0]&&s.books[0].title)||s.title||""))}</h3>
      <div class="meta">
        <span class="tag age">Ages ${esc(s.age)}</span>
        <span class="tag num">${s.books.length} ${s.books.length===1?"book":"books"}</span>
      </div>
      ${author}
      <p class="desc">${esc(s.desc)}</p>
      <button class="titles-toggle">▸ See ${s.books.length} ${s.books.length===1?"title":"titles"}</button>
      <div class="titles">${bookRows}</div>
    </div>
  </div>`;
}

function applyFilters(){
  const q=document.getElementById("search").value.trim().toLowerCase();
  const age=document.getElementById("age").value;
  const avail=document.getElementById("avail").value;
  return BOOKS.filter(s=>{
    if(avail==="yes" && s.available===false) return false;
    if(age && s.age!==age) return false;
    if(q){
      const hay=(s.series+" "+s.author+" "+s.desc+" "+s.books.map(b=>b.title+" "+b.desc).join(" ")).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}
function render(){
  const list=applyFilters();
  document.getElementById("count").textContent=`${list.length} of ${BOOKS.length} series shown`;
  if(!list.length){grid.innerHTML="";empty.style.display="block";return;}
  empty.style.display="none";
  grid.innerHTML=list.map(card).join("");
  list.forEach((s,ci)=>{
    const cardEl=grid.children[ci];
    const coverEl=cardEl.querySelector(".cover");
    const setCover=(book,stacked,count)=>{ coverEl.innerHTML=coverInner(s,book,stacked,count); };
    const restore=()=>{ const r=restingState(s); setCover(r.book,r.stacked,r.count); };
    // expand/collapse the whole title list
    const tt=cardEl.querySelector(".titles-toggle");
    tt.addEventListener("click",()=>{
      const open=tt.nextElementSibling.classList.toggle("open");
      tt.textContent=open?"▾ Hide titles":("▸ See "+s.books.length+" titles");
    });
    // per-book: hover previews the cover, click locks it (and toggles the blurb)
    cardEl.querySelectorAll(".book").forEach(bookEl=>{
      const book=s.books.find(b=>b.title===bookEl.dataset.title);
      if(!book) return;
      // hover anywhere on the row (incl. the Added button) previews the cover
      bookEl.addEventListener("mouseenter",()=>setCover(book,false,0));
      bookEl.addEventListener("mouseleave",restore);
      const titleEl=bookEl.querySelector(".book-toggle,.book-title");
      if(titleEl){
        titleEl.addEventListener("click",()=>{
          stickyCover[s.series]=book.title; restore();   // click locks the cover
          if(titleEl.classList.contains("book-toggle")){
            const open=bookEl.classList.toggle("open");
            const car=titleEl.querySelector(".car"); if(car)car.textContent=open?"▾":"▸";
          }
        });
      }
    });
    cardEl.querySelectorAll(".add-btn").forEach(btn=>btn.addEventListener("click",()=>{
      const key=btn.dataset.key; cart.has(key)?cart.delete(key):cart.add(key);
      updateCart(); refreshCard(cardEl,s);
    }));
    const rmAll=cardEl.querySelector(".remove-all");
    if(rmAll)rmAll.addEventListener("click",()=>{
      s.books.forEach(b=>cart.delete(s.series+" :: "+b.title)); updateCart(); refreshCard(cardEl,s);
    });
  });
}
// Update one card's buttons + cover in place (so expanded series/blurbs don't collapse)
function refreshCard(cardEl, s){
  cardEl.querySelectorAll(".book").forEach(bookEl=>{
    const on=cart.has(s.series+" :: "+bookEl.dataset.title);
    bookEl.classList.toggle("sel", on);
    const bk=(s.books||[]).find(x=>x.title===bookEl.dataset.title)||{};
    const btn=bookEl.querySelector(".add-btn");
    if(btn){ const bAvail=(s.available!==false)&&(bk.available!==false); btn.disabled=!bAvail; btn.classList.toggle("added", on&&bAvail); btn.textContent=!bAvail?"Unavailable":(on?"Added ✓":"+ Add"); }
  });
  const rm=cardEl.querySelector(".remove-all");
  if(rm) rm.hidden = selectedBooks(s).length===0;
  const coverEl=cardEl.querySelector(".cover");
  if(coverEl){ const r=restingState(s); coverEl.innerHTML=coverInner(s,r.book,r.stacked,r.count); }
}
function refreshAllCards(){
  [...grid.querySelectorAll(".card")].forEach(cardEl=>{
    const s=BOOKS.find(x=>x.series===cardEl.dataset.series);
    if(s) refreshCard(cardEl,s);
  });
}
function toggle(key){ cart.has(key)?cart.delete(key):cart.add(key); updateCart(); refreshAllCards(); }

const cartbar=document.getElementById("cartbar");
function updateCart(){
  const n=cart.size;
  cartbar.classList.toggle("show",n>0);
  const over=n>MAX_BOOKS;
  document.getElementById("cartCount").innerHTML = over
    ? `${n} books selected <span class="cart-warn">(max ${MAX_BOOKS} per name — remove ${n-MAX_BOOKS})</span>`
    : `${n} ${n===1?"book":"books"} selected`;
  document.getElementById("cartTitles").textContent=[...cart].map(k=>k.split(" :: ")[1]).join(", ");
  const btn=document.getElementById("btnOrder");
  if(btn){ btn.disabled=false; btn.style.opacity=1; btn.style.cursor="pointer";
    btn.title=over?`Tap to trim to ${MAX_BOOKS} books`:""; }
  const badge=document.getElementById("navCartCount");
  if(badge){ badge.textContent=n; badge.hidden = n===0; }
  saveCart();
}
document.getElementById("btnClear").addEventListener("click",()=>{cart.clear();updateCart();refreshAllCards();});

/* ===================== Checkout flow (Ordering process) =====================
   Implements process-flows.html Flow 1. See SYSTEM-DESIGN.md §5.
   Steps: review → availability → account → confirm → pay (24h). */
const CHECKOUT_CSS=`
#coModal .co-h{font-family:'Playfair Display',serif;font-size:21px;color:#103160;margin:0 0 4px}
#coModal .co-sub{color:#7c879b;font-size:13.5px;margin:0 0 14px;line-height:1.5}
#coModal .co-list{max-height:180px;overflow:auto;margin:0 0 6px}
#coModal .co-li{padding:7px 0;border-bottom:1px dashed #eadfca;font-size:14px;color:#243447}
#coModal .co-li span{color:#9a8a72;font-weight:600}
#coModal label{display:block;font-size:12.5px;color:#5a6b7a;margin:9px 0 3px;font-weight:600}
#coModal input{width:100%;padding:10px 12px;border:1px solid #e0d6c2;border-radius:9px;font:inherit;font-size:14px}
#coModal .co-note{background:#fff8e6;border:1px solid #f1d889;border-radius:9px;padding:11px 13px;font-size:13px;color:#5a4a2a;margin:12px 0}
#coModal .co-err{color:#c0392b;font-size:13px;margin:8px 0 0;min-height:16px}
#coModal .co-row{display:flex;gap:10px;margin-top:14px;position:sticky;bottom:-26px;background:#fff;padding:12px 0;box-shadow:0 -8px 12px -8px rgba(16,49,96,.18);z-index:2}
#coModal .co-tabs{display:flex;gap:8px;margin:2px 0 6px}
#coModal .co-tab{flex:1;padding:9px;border:1px solid #e0d6c2;border-radius:9px;background:#fff;font:inherit;font-weight:700;color:#103160;cursor:pointer}
#coModal .co-tab.on{background:#103160;color:#fff;border-color:#103160}
#coModal .co-big{font-size:26px;font-weight:800;color:#103160;margin:2px 0}\n#coModal .co-confirm{background:#fff8e6;border:1px solid #f1d889;border-radius:9px;padding:11px 13px;font-size:13px;color:#5a4a2a;margin:10px 0 0;line-height:1.55}\n#coModal .co-confirm[hidden]{display:none}
#coModal .co-pick{display:flex;align-items:flex-start;gap:9px;padding:8px 0;border-bottom:1px dashed #eadfca;font-size:14px;color:#243447;cursor:pointer}
#coModal .co-pick input{margin-top:3px;width:17px;height:17px;accent-color:#103160;flex:0 0 auto}
#coModal .co-pickcount{font-size:13px;font-weight:700;color:#103160;margin:8px 0 0}
#coModal .co-pickcount.over{color:#c0503a}
#coModal .co-forgot{display:inline-block;margin-top:9px;font-size:12.5px;font-weight:700;color:#e9755c;text-decoration:underline;cursor:pointer}
#coModal .co-forgot:hover{color:#d15e45}
#coModal{position:relative}
#coModal .co-x{position:absolute;top:8px;right:10px;width:30px;height:30px;border:none;background:none;font-size:17px;line-height:1;color:#9aa6b8;cursor:pointer;border-radius:8px}
#coModal .co-x:hover{background:#f1ece2;color:#103160}`;

const modalBg=document.getElementById("modalBg");
const coModal=document.getElementById("coModal");
function closeCheckout(){modalBg.classList.remove("show");}
// Clicking the dimmed backdrop no longer closes the modal — prevents losing entered details by accident. Use the ✕ or Cancel/Back.
window.closeCheckout=closeCheckout;
document.getElementById("btnOrder").addEventListener("click",openCheckout);

let session=null;     // {accountId, whatsapp, passcode, name, firstOrder}
let coItems=[];       // [{key,series,title,isbn,price}]
let PUBLIC_SETTINGS={deposit:60,maxBooks:4};   // refreshed from backend on load

const waNum=()=>WHATSAPP_NUMBER.replace(/[^0-9]/g,"");
const money=n=>"RM"+(Math.round(Number(n)*100)/100);
function cartItems(){
  return [...cart].map(key=>{
    const [series,title]=key.split(" :: ");
    const s=BOOKS.find(x=>x.series===series)||{};
    let isbn=""; if(s.books){const b=s.books.find(bk=>bk.title===title); if(b)isbn=b.isbn||"";}
    return {key,series,title,isbn,price:Number(s.price)||0};
  });
}
async function apiPub(action,payload){
  const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify(Object.assign({action},payload||{}))});
  return r.json();
}
function show(html){coModal.innerHTML='<button type="button" class="co-x" aria-label="Close" onclick="closeCheckout()">✕</button>'+html;modalBg.classList.add("show");}

// --- Service area gate + out-of-area lead capture ---
var COVERED_AREAS=["fennel","capers","brightton"]; // address must contain one of these (case-insensitive); "brightton" also matches "D'Brightton"
function inServiceArea(addr){addr=String(addr||"").toLowerCase();return COVERED_AREAS.some(function(k){return addr.indexOf(k)>=0;});}
var OUT_OF_AREA_MSG="Sorry, we don't cover your area just yet 💛 We've saved your details and will message you the moment we do.";
async function captureLead(name,phone,addr){try{await apiPub("waitlist",{name:name||"",whatsapp:phone,address:addr});}catch(e){}}

// Suggest a correction when the email domain looks like a typo of a common provider (e.g. gmil.com → gmail.com).
function emailDomainSuggestion(email){
  email=String(email||"").trim().toLowerCase();
  var at=email.lastIndexOf("@"); if(at<1) return null;
  var domain=email.slice(at+1); if(!domain) return null;
  var popular=["gmail.com","googlemail.com","hotmail.com","outlook.com","live.com","yahoo.com","ymail.com","icloud.com","me.com","aol.com","protonmail.com","proton.me","msn.com","hotmail.co.uk","yahoo.co.uk"];
  if(popular.indexOf(domain)>=0) return null; // already a known-good domain
  var typos={"gmial.com":"gmail.com","gmil.com":"gmail.com","gmai.com":"gmail.com","gmaill.com":"gmail.com","gmail.co":"gmail.com","gmail.con":"gmail.com","gmail.cm":"gmail.com","gmail.om":"gmail.com","gnail.com":"gmail.com","gamil.com":"gmail.com","gmali.com":"gmail.com","hotmial.com":"hotmail.com","hotmal.com":"hotmail.com","hotmai.com":"hotmail.com","hotmail.co":"hotmail.com","hotmail.con":"hotmail.com","hotnail.com":"hotmail.com","hormail.com":"hotmail.com","yaho.com":"yahoo.com","yahooo.com":"yahoo.com","yahoo.co":"yahoo.com","yhoo.com":"yahoo.com","yahooo.co":"yahoo.com","outlok.com":"outlook.com","outloo.com":"outlook.com","outlook.co":"outlook.com","iclod.com":"icloud.com","icoud.com":"icloud.com","iclould.com":"icloud.com"};
  if(typos[domain]) return email.slice(0,at+1)+typos[domain];
  function lev(a,b){var m=a.length,n=b.length,i,j,d=[];for(i=0;i<=m;i++)d[i]=[i];for(j=0;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a.charAt(i-1)===b.charAt(j-1)?0:1));return d[m][n];}
  var best=null,bestD=99;
  for(var p=0;p<popular.length;p++){var dd=lev(domain,popular[p]);if(dd<bestD){bestD=dd;best=popular[p];}}
  if(best&&bestD<=1) return email.slice(0,at+1)+best; // one-character-off from a popular domain
  return null;
}

function stepTrimCart(){
  function draw(){
    const n=cart.size, ok=n>=1&&n<=MAX_BOOKS;
    const rows=[...cart].map(key=>{
      const [series,title]=key.split(" :: ");
      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px dashed #eadfca">
        <span style="font-size:14px;color:#243447;font-weight:600">${esc(title)} <span style="color:#9a8a72;font-weight:500">\u2014 ${esc(series)}</span></span>
        <button class="co-trim-x" data-key="${escAttr(key)}" aria-label="Remove" style="flex:0 0 auto;width:30px;height:30px;border-radius:50%;border:1.5px solid #e9c4bb;background:#fff;color:#c0503a;font-size:18px;font-weight:800;cursor:pointer;line-height:1">\u00d7</button>
      </div>`;
    }).join("");
    show(`<h3 class="co-h">Your rental list</h3>
      <p class="co-sub">You've picked ${n} book${n===1?"":"s"}. Rentals are up to ${MAX_BOOKS} per registered name \u2014 tap \u00d7 to remove the ones you don't want.</p>
      <div class="co-list">${rows}</div>
      <div class="co-pickcount ${n>MAX_BOOKS?"over":""}">${n} of ${MAX_BOOKS} selected${n>MAX_BOOKS?" \u2014 remove "+(n-MAX_BOOKS)+" more":""}</div>
      <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Keep browsing</button>
        <button class="btn-wa" id="coNext" style="flex:1.4;justify-content:center">Check out</button></div>`);
    coModal.querySelectorAll(".co-trim-x").forEach(b=>b.onclick=()=>{ cart.delete(b.dataset.key); updateCart(); refreshAllCards(); if(cart.size===0){closeCheckout();return;} draw(); });
    coModal.querySelector("#coBack").onclick=closeCheckout;
    const nb=coModal.querySelector("#coNext");
    nb.onclick=()=>{ if(cart.size<1)return;
      if(cart.size>MAX_BOOKS){ const over=cart.size-MAX_BOOKS; alert("You can rent up to "+MAX_BOOKS+" books per registered name. 📚\n\nPlease remove "+over+" book"+(over===1?"":"s")+" to continue."); return; }
      coItems=cartItems(); if(!API_URL){legacyWhatsApp();return;} stepReview(); };
  }
  draw();
}
function openCheckout(){
  if(cart.size===0)return;
  if(cart.size>MAX_BOOKS){ stepTrimCart(); return; }
  coItems=cartItems();
  if(!API_URL){legacyWhatsApp();return;}
  stepReview();
}

/* fallback used until the backend URL is set */
function legacyWhatsApp(){
  let msg="Hi Bukutopia! 📚 I'd like to rent these books:\n";
  coItems.forEach((it,i)=>{msg+=`${i+1}. ${it.title} (${it.series})\n`;});
  msg+="\nCould you check availability for me? Thank you!";
  const num=waNum();
  if(num.length<8){alert("Order message:\n\n"+msg);return;}
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`,"_blank");
}

function liRows(){return coItems.map(it=>`<div class="co-li">${esc(it.title)} <span>— ${esc(it.series)}</span></div>`).join("");}

var pendingAuthMode="login"; // which tab the "Almost there" screen opens on, set by the book-list gate
function stepReview(){
  // Logged-in customers keep the simple review + checkout.
  if(session){
    show(`<h3 class="co-h">Your book list</h3>
      <p class="co-sub">${coItems.length} of ${MAX_BOOKS} books.</p>
      <div class="co-list">${liRows()}</div>
      <div class="co-row">
        <button class="btn-clear" id="coBack" style="flex:1">Keep browsing</button>
        <button class="btn-wa" id="coNext" style="flex:1.4;justify-content:center">Check out</button>
      </div>`);
    coModal.querySelector("#coBack").onclick=closeCheckout;
    coModal.querySelector("#coNext").onclick=stepAvailability;
    return;
  }
  // Not logged in → gate on login / sign up.
  show(`<h3 class="co-h">Your book list</h3>
    <p class="co-sub">Please log in to proceed:</p>
    <div class="co-list">${liRows()}</div>
    <div class="co-row">
      <button class="btn-clear" id="coSignup" style="flex:0 0 calc(50% - 5px);box-sizing:border-box;justify-content:center">New? Sign up</button>
      <button class="btn-wa" id="coLogin" style="flex:0 0 calc(50% - 5px);box-sizing:border-box;justify-content:center">Log in</button>
    </div>
    <div style="text-align:right;margin-top:2px"><a class="co-forgot" href="#" onclick="stepForgot();return false;">Forgot password?</a></div>`);
  coModal.querySelector("#coSignup").onclick=()=>{pendingAuthMode="signup";stepAvailability();};
  coModal.querySelector("#coLogin").onclick=()=>{pendingAuthMode="login";stepAvailability();};
}

// Forgot-password: enter email address, we email a reset link to it.
function stepForgot(){
  show(`<h3 class="co-h">We're here to help</h3>
    <p class="co-sub">Enter your email address and we'll send a password reset link to your address.</p>
    <label>Email address</label><input id="f_remail" type="email" inputmode="email" placeholder="you@example.com">
    <div class="co-err" id="coErr"></div>
    <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Cancel</button>
      <button class="btn-wa" id="coGo" style="flex:1.4;justify-content:center">Submit</button></div>`);
  const err=coModal.querySelector("#coErr");
  coModal.querySelector("#coBack").onclick=stepAccount;
  coModal.querySelector("#coGo").onclick=async()=>{
    const email=(coModal.querySelector("#f_remail").value||"").trim();
    if(!email||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){err.textContent="Please enter a valid email address.";return;}
    err.textContent="Sending…";
    let res;
    try{ res=await apiPub("requestReset",{email:email}); }catch(e){ err.textContent="Couldn't connect. Please try again."; return; }
    if(res&&res.error){ err.textContent=res.error; return; }
    show(`<h3 class="co-h">Check your email 📧</h3>
      <p class="co-sub">We've just sent a password reset link. It's valid for 30 minutes — please check your inbox (and spam folder).</p>
      <div class="co-row"><button class="btn-wa" id="coBack" style="flex:1;justify-content:center">Done</button></div>`);
    coModal.querySelector("#coBack").onclick=stepAccount;
  };
}
window.stepForgot=stepForgot;

function markBookUnavailable(isbn,key){
  const title=key?String(key).split(" :: ")[1]:"";
  for(const s of (BOOKS||[])){ if(!s.books)continue;
    const b=s.books.find(x=>(isbn&&String(x.isbn)===String(isbn))||(title&&x.title===title));
    if(b){ b.available=false; cart.delete(s.series+" :: "+b.title); break; }
  }
  updateCart();
}
async function stepAvailability(){
  show(`<h3 class="co-h">Processing Order</h3><p class="co-sub">One moment please.</p>`);
  const isbns=coItems.map(it=>it.isbn).filter(Boolean);
  let res={};
  try{ res = isbns.length? await apiPub("checkAvailability",{isbns}) : {ok:true,unavailable:[]}; }
  catch(e){ res={error:"network"}; }
  if(res.error){
    show(`<h3 class="co-h">Couldn't reach us 📡</h3>
      <p class="co-sub">We couldn't check availability just now. Please try again in a moment.</p>
      <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Back</button>
      <button class="btn-wa" id="coRetry" style="flex:1.4;justify-content:center">Try again</button></div>`);
    coModal.querySelector("#coBack").onclick=stepReview;
    coModal.querySelector("#coRetry").onclick=stepAvailability; return;
  }
  const un=new Set(res.unavailable||[]);
  if(un.size){
    const removed=coItems.filter(it=>un.has(it.isbn));
    removed.forEach(it=>cart.delete(it.key));
    coItems=coItems.filter(it=>!un.has(it.isbn));
    updateCart();render();
    const rows=removed.map(it=>`<div class="co-unavail">
      <div class="co-unavail-info"><span class="co-unavail-title">${esc(it.title)}</span>
        <span class="co-unavail-msg">Uh oh, someone ordered this book moments before you. Please select another book.</span></div>
      <button class="co-unavail-swap" title="Pick a replacement" data-isbn="${escAttr(it.isbn)}" data-key="${escAttr(it.key)}">🔁</button>
    </div>`).join("");
    show(`<h3 class="co-h">A book just went out 😢</h3>
      <p class="co-sub">${coItems.length?`Tap 🔁 to swap an unavailable book for another, or continue with your remaining ${coItems.length}.`:`Tap 🔁 to head back and pick a replacement.`}</p>
      <div class="co-list">${rows}</div>
      <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Back to catalogue</button>${coItems.length?`<button class="btn-wa" id="coNext" style="flex:1.4;justify-content:center">Continue with ${coItems.length}</button>`:""}</div>`);
    const back=()=>{ closeCheckout(); const b=document.getElementById("books"); if(b)b.scrollIntoView({behavior:"smooth"}); };
    coModal.querySelector("#coBack").onclick=back;
    const nx=coModal.querySelector("#coNext"); if(nx)nx.onclick=stepAccount;
    coModal.querySelectorAll(".co-unavail-swap").forEach(btn=>btn.onclick=()=>{ markBookUnavailable(btn.dataset.isbn, btn.dataset.key); render(); back(); });
    return;
  }
  stepAccount();
}

function stepAccount(){
  if(session){return stepConfirm();}
  let mode=(typeof pendingAuthMode!=="undefined"&&pendingAuthMode==="signup")?"signup":"login";
  show(`<h3 class="co-h">Almost there</h3>
    <p class="co-sub">Log in or create your account to place the order.</p>
    <div class="co-tabs"><button class="co-tab ${mode==="login"?"on":""}" id="tabLogin">I have an account</button>
      <button class="co-tab ${mode==="signup"?"on":""}" id="tabSignup">Create account</button></div>
    <div id="coForm"></div><div class="co-confirm" id="coConfirm" hidden></div><div class="co-err" id="coErr"></div>
    <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Back</button>
      <button class="btn-wa" id="coGo" style="flex:1.4;justify-content:center">Continue</button></div>`);
  const form=coModal.querySelector("#coForm"), err=coModal.querySelector("#coErr");
  const loginForm=`<label>WhatsApp number</label><input id="f_phone" inputmode="numeric" placeholder="60123456789"><div style="font-size:11px;color:#7c879b;margin-top:3px">Non-Malaysian number? Add your country code (example 44…).</div>
    <label>Password</label><input id="f_pass" type="password" placeholder="Your password">
    <a class="co-forgot" href="#" onclick="stepForgot();return false;">Forgot password?</a>`;
  const signupForm=`<label>Your name</label><input id="f_name" placeholder="Full name">
    <label>WhatsApp number</label><input id="f_phone" inputmode="numeric" placeholder="60123456789"><div style="font-size:11px;color:#7c879b;margin-top:3px">Non-Malaysian number? Add your country code (example 44…).</div>
    <label>Email</label><input id="f_email" type="email" inputmode="email" placeholder="you@example.com">
    <label>Delivery address</label><input id="f_addr" placeholder="Unit, building, street address, postcode">
    <label>Choose a password</label><input id="f_pass" type="password" placeholder="At least 4 characters">
    <label>Confirm password</label><input id="f_pass2" type="password" placeholder="Re-enter your password">`;
  function paint(){form.innerHTML=mode==="login"?loginForm:signupForm;err.textContent="";}
  paint();
  coModal.querySelector("#tabLogin").onclick=()=>{mode="login";coModal.querySelector("#tabLogin").classList.add("on");coModal.querySelector("#tabSignup").classList.remove("on");paint();};
  coModal.querySelector("#tabSignup").onclick=()=>{mode="signup";coModal.querySelector("#tabSignup").classList.add("on");coModal.querySelector("#tabLogin").classList.remove("on");paint();};
  coModal.querySelector("#coBack").onclick=stepReview;
  const goBtn=coModal.querySelector("#coGo"), confBox=coModal.querySelector("#coConfirm");
  let confirmed=false;
  function resetConfirm(){confirmed=false;goBtn.textContent="Continue";if(confBox){confBox.hidden=true;confBox.innerHTML="";}}
  form.addEventListener("input",resetConfirm);   // editing any field re-arms the double-check
  coModal.querySelector("#tabLogin").addEventListener("click",resetConfirm);
  coModal.querySelector("#tabSignup").addEventListener("click",resetConfirm);
  goBtn.onclick=async()=>{
    const g=id=>{const el=coModal.querySelector(id);return el?el.value.trim():"";};
    const phone=g("#f_phone"), pass=g("#f_pass"), pass2=g("#f_pass2");
    const name=mode==="signup"?g("#f_name"):"", addr=mode==="signup"?g("#f_addr"):"", email=mode==="signup"?g("#f_email"):"";
    const probs=[];
    if(mode==="signup"&&!name)probs.push("Please enter your name.");
    if(!phone)probs.push("Please enter your WhatsApp number.");
    if(mode==="signup"){
      if(!email)probs.push("Please enter your email.");
      else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))probs.push("Please enter a valid email address.");
      else { if(emailDomainSuggestion(email))probs.push("Please check your email again."); }
      if(!addr)probs.push("Please enter your delivery address.");
    }
    if(!pass)probs.push(mode==="signup"?"Please choose a password.":"Please enter your password.");
    else if(mode==="signup"&&pass.length<4)probs.push("Password must be at least 4 characters.");
    if(mode==="signup"&&pass&&pass.length>=4&&pass!==pass2)probs.push("Passwords don't match.");
    const areaNote=(mode==="signup"&&addr&&!inServiceArea(addr))?"Heads up: we don't deliver to your area just yet — you can still sign up and we'll notify you when we do.":"";
    if(probs.length){ err.innerHTML=probs.map(esc).join("<br>")+(areaNote?'<br>'+esc(areaNote):""); return; }
    err.innerHTML=areaNote?esc(areaNote):"";  // all fields valid: clear errors, keep the out-of-area heads-up
    if(mode==="signup" && !confirmed){  // returning users (login) skip the double-check and log in straight away
      // Always show the double-check box for sign-ups. (Duplicate number/email is caught on submit below.)
      err.innerHTML=areaNote?esc(areaNote):"";
      confBox.hidden=false;
      confBox.innerHTML=`<b>Please double-check these are correct 👇</b><br>📱 WhatsApp: <b>${esc(phone)}</b>`+
        (mode==="signup"?`<br>✉️ Email: <b>${esc(email)}</b><br>📦 Delivery address: <b>${esc(addr)}</b>`:"")+
        `<br><span style="color:#7c879b">We'll deliver here and message you on this number.</span>`;
      confirmed=true; goBtn.textContent="Yes, that's correct"; return;
    }
    err.textContent="Please wait…";
    try{
      let res;
      if(mode==="login") res=await apiPub("login",{whatsapp:phone,passcode:pass});
      else res=await apiPub("signup",{name,email,whatsapp:phone,address:addr,passcode:pass});
      if(res.error){err.textContent=res.error;resetConfirm();return;}
      session={accountId:res.accountId,whatsapp:res.whatsapp||phone,passcode:pass,name:res.name,firstOrder:res.isFirstOrder};session.outOfArea=(mode==="signup"?!inServiceArea(addr):(res.address?!inServiceArea(res.address):false));session.hasPending=!!(res.pending&&res.pending.length);saveSession();
      updateNavAuth();
      // New sign-up from an area we don't serve yet: capture the lead, drop their book picks,
      // and show a friendly "we'll notify you" message instead of the order/deposit screen.
      if(mode==="signup" && !inServiceArea(addr)){ try{apiPub("waitlist",{name:name,whatsapp:phone,address:addr});}catch(e){} cart.clear();updateCart();render(); stepSignupOutOfArea(); return; }
      if(mode==="login" && res.pending && res.pending.length) startMerge(res.pending);
      else stepConfirm();
    }catch(e){err.textContent="Couldn't connect. Please try again.";resetConfirm();}
  };
}

// Resolve a stored {isbn,title} to a full catalogue item (series + price from BOOKS)
function resolveItem(isbn, title){
  isbn=String(isbn||"");
  for(const s of BOOKS){
    if(!s.books) continue;
    const b=s.books.find(bk=>(isbn&&bk.isbn===isbn)||(title&&bk.title===title));
    if(b) return {key:s.series+" :: "+b.title, series:s.series, title:b.title, isbn:b.isbn||"", price:Number(s.price)||0};
  }
  return title?{key:title, series:"", title:title, isbn:isbn, price:0}:null;
}
// Returning customer with an unpaid pending order: combine its books with the new cart
// and let them untick down to the max before continuing.
function startMerge(pendingRaw){
  const resolved=(pendingRaw||[]).map(p=>resolveItem(p.isbn,p.title)).filter(Boolean);
  const map=new Map();
  [...coItems, ...resolved].forEach(it=>{ if(!it)return; const k=it.isbn||it.title; if(!map.has(k))map.set(k,it); });
  const combined=[...map.values()];
  if(combined.length<=MAX_BOOKS){ coItems=combined; return stepConfirm(); }
  stepChoose(combined);
}
function stepChoose(items){
  function draw(){
    const n=items.filter(it=>it._keep!==false).length;
    const ok=n>=1 && n<=MAX_BOOKS;
    const rows=items.map((it,i)=>`<label class="co-pick"><input type="checkbox" data-i="${i}" ${it._keep!==false?"checked":""}><span>${esc(it.title)} <span style="color:#9a8a72;font-weight:600">\u2014 ${esc(it.series)}</span></span></label>`).join("");
    show(`<h3 class="co-h">Pick your final ${MAX_BOOKS} \ud83d\udcda</h3>
      <p class="co-sub">You had an earlier order that wasn't paid yet, so we've combined both lists. Untick the books you don't want until you're down to ${MAX_BOOKS}.</p>
      <div class="co-list">${rows}</div>
      <div class="co-pickcount ${n>MAX_BOOKS?"over":""}">${n} of ${MAX_BOOKS} selected${n>MAX_BOOKS?" \u2014 untick "+(n-MAX_BOOKS)+" more":""}</div>
      <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Back</button>
        <button class="btn-wa" id="coNext" style="flex:1.4;justify-content:center" ${ok?"":"disabled"}>Next</button></div>`);
    coModal.querySelectorAll("input[type=checkbox]").forEach(cb=>cb.onchange=()=>{ items[+cb.dataset.i]._keep=cb.checked; draw(); });
    coModal.querySelector("#coBack").onclick=stepReview;
    const nb=coModal.querySelector("#coNext");
    nb.onclick=()=>{ if(!ok)return; coItems=items.filter(it=>it._keep!==false); stepConfirm(); };
  }
  draw();
}

async function stepConfirm(){
  // Per-account limit: count books already out (Paid/Packed/Out/Extended) and block early if this order would exceed the max.
  let outstanding=0;
  try{
    const mo=await apiPub("myOrders",{whatsapp:session.whatsapp,passcode:session.passcode});
    if(mo&&mo.orders){ const act={"Paid":1,"Packed":1,"Out":1,"Extended":1};
      outstanding=mo.orders.reduce((s,o)=>s+(act[o.status]?(parseInt(o.numBooks,10)||0):0),0); }
  }catch(e){}
  if(outstanding+coItems.length>MAX_BOOKS){
    const left=Math.max(0,MAX_BOOKS-outstanding);
    show(`<h3 class="co-h">You've reached your book limit 📚</h3>
      <p class="co-sub">You have already rented ${outstanding} book${outstanding===1?"":"s"} with us. You can rent up to ${MAX_BOOKS} at a time${left>0?` — so there's room for ${left} more right now`:""}. Please adjust cart before checkout.</p>
      <div class="co-row"><button class="btn-wa" id="coBack" style="flex:1;justify-content:center">Back to my cart</button></div>`);
    coModal.querySelector("#coBack").onclick=()=>stepTrimCart();
    return;
  }
  const total=coItems.reduce((s,it)=>s+it.price,0);
  const first=session.firstOrder;
  const amount=first?Number(PUBLIC_SETTINGS.deposit||60):total;
  show(`<h3 class="co-h">Hi ${esc(session.name||"there")} 👋</h3>
    <p class="co-sub">${coItems.length} book(s) — ${coItems.map(i=>esc(i.title)).join(", ")}</p>
    ${first
      ? `<div class="co-note"><b>First order</b> — your first month rental is on us. You pay only the <b>RM${PUBLIC_SETTINGS.deposit||60} refundable deposit</b> to get started.</div><div class="co-big">${money(amount)} <span style="font-size:13px;color:#7c879b;font-weight:600">refundable deposit</span></div>`
      : `<div class="co-note">Returning order — pay the rental total below.</div><div class="co-big">${money(amount)}</div>`}
    <div class="co-err" id="coErr"></div>
    <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Back</button>
      <button class="btn-wa" id="coPlace" style="flex:1.4;justify-content:center">Place order</button></div>`);
  coModal.querySelector("#coBack").onclick=stepReview;
  coModal.querySelector("#coPlace").onclick=async()=>{
    const err=coModal.querySelector("#coErr"); err.textContent="Placing your order…";
    try{
      const res=await apiPub("createOrder",{whatsapp:session.whatsapp,passcode:session.passcode,
        items:coItems.map(it=>({isbn:it.isbn,title:it.title,price:it.price}))});
      if(res.error){
        if(res.error==="unavailable"){err.textContent="";stepAvailability();return;}
        err.textContent=res.error;return;
      }
      cart.clear();updateCart();render();
      if(res.outOfArea){ stepOutOfArea(res.order); return; }
      stepPay(res.order);
    }catch(e){err.textContent="Couldn't place the order. Please try again.";}
  };
}

function stepSignupOutOfArea(){
  show(`<h3 class="co-h">You're on the list! 💛</h3>
    <p class="co-sub">📚 Thanks for signing up! We've got all your details and will let you know as soon as Bukutopia is available in your area. In the meantime, feel free to explore!</p>
    <div class="co-row"><button class="btn-wa" id="coBack" style="flex:1;justify-content:center">Got it</button></div>`);
  coModal.querySelector("#coBack").onclick=closeCheckout;
}
function stepOutOfArea(order){
  show(`<h3 class="co-h">You're on the list! 💛</h3>
    <p class="co-sub">📚 Thanks for signing up! We've got all your details and will let you know as soon as Bukutopia is available in your area. In the meantime, feel free to explore!</p>
    <div class="co-row"><button class="btn-wa" id="coBack" style="flex:1;justify-content:center">Got it</button></div>`);
  coModal.querySelector("#coBack").onclick=closeCheckout;
}
function stepPay(order){
  const ref=order.ref||(order.orderNo?String(order.orderNo).padStart(4,"0"):String(order.id).slice(0,4).toUpperCase());
  const deposit=order.type==="deposit";
  const typeText=deposit?"refundable deposit only, first month free rental":"rental checkout";
  const tpl=(typeof SITE_MSGS!=="undefined"&&SITE_MSGS.checkout)?SITE_MSGS.checkout
    :"Hi Bukutopia! 📚 Order {ref} — {titles}. I'm paying {amount} ({type}). My payment receipt is attached. 🙏";
  const msg=tpl.replace(/\{ref\}/g,ref).replace(/\{titles\}/g,order.titles).replace(/\{amount\}/g,money(order.amount)).replace(/\{type\}/g,typeText);
  const link=`https://wa.me/${waNum()}?text=${encodeURIComponent(msg)}`;
  show(`<h3 class="co-h">Order placed — ref ${ref} 🎉</h3>
    <p class="co-sub">To complete checkout, please pay and send us your receipt on WhatsApp <b>within 24 hours</b>. Unpaid orders are released automatically after that.</p>
    <div style="text-align:center;margin:4px 0 10px">
      <div class="co-big">${money(order.amount)}</div>
      <img src="${PAYMENT_QR_URL}" alt="Payment QR" style="width:210px;height:210px;object-fit:contain;border:1px solid #eadfca;border-radius:12px;padding:8px;background:#fff"
        onerror="this.style.display='none';document.getElementById('qrFallback').style.display='block'">
      <div id="qrFallback" style="display:none;font-size:13px;color:#5a4a2a;background:#fff8e6;border:1px solid #f1d889;border-radius:9px;padding:11px 13px">Pay by DuitNow to <b>${esc(PAYEE_NAME)}</b>, then send your receipt below.</div>
      <div style="font-size:12.5px;color:#7c879b;margin-top:6px">Scan with any banking app · ${esc(PAYEE_NAME)}</div>
    </div>
    <div class="co-note"><b>1.</b> Scan the QR and pay ${money(order.amount)}.<br>
      <b>2.</b> Tap the button below and attach your receipt screenshot.<br>
      <b>3.</b> We'll confirm, pack your books and arrange delivery. 📦</div>
    <div class="co-row"><a class="btn-wa" id="coWa" href="${link}" target="_blank" style="flex:1;justify-content:center;text-decoration:none">Send receipt on WhatsApp</a></div>`);
  coModal.querySelector("#coWa").onclick=()=>{setTimeout(closeCheckout,400);};
  if(session){ session.hasPending=true; saveSession(); } updateNavAuth();
}

/* ===================== Top nav: Rental cart + Login / My account ===================== */
const navCart=document.getElementById("navCart");
const navLogin=document.getElementById("navLogin");

function updateNavAuth(){
  if(!navLogin)return;
  const pend=!!(session&&session.hasPending);
  if(session){ navLogin.innerHTML="👤 "+esc(session.name?String(session.name).split(" ")[0]:"My account")+(pend?' <span class="nav-dot" title="Unfinished order — payment pending"></span>':""); navLogin.classList.add("me"); }
  else { navLogin.textContent="Login"; navLogin.classList.remove("me"); }
  const ic=document.getElementById("navLoginIcon");
  if(ic){ ic.style.position="relative"; let d=ic.querySelector(".nav-dot"); if(pend){ if(!d){ d=document.createElement("span"); d.className="nav-dot"; ic.appendChild(d); } } else if(d){ d.remove(); } }
}
if(navCart) navCart.addEventListener("click",e=>{e.preventDefault();openCart();});
if(navLogin) navLogin.addEventListener("click",e=>{e.preventDefault();openAccount();});

// Rental cart link → open checkout (or a friendly empty state).
function openCart(){
  if(cart.size===0){
    show(`<h3 class="co-h">Your rental cart is empty 🛒</h3>
      <p class="co-sub">Browse the collection and tap <b>Add</b> on up to ${MAX_BOOKS} books, then come back here to check out.</p>
      <div class="co-row"><button class="btn-wa" id="coClose" style="flex:1;justify-content:center">Browse books</button></div>`);
    coModal.querySelector("#coClose").onclick=()=>{closeCheckout();location.hash="#books";};
    return;
  }
  openCheckout();
}

// Login link → My account if signed in, else the login/signup form.
function openAccount(){
  if(!API_URL){
    show(`<h3 class="co-h">Accounts coming soon</h3>
      <p class="co-sub">Online accounts aren't switched on yet. For now, add your books and order on WhatsApp.</p>
      <div class="co-row"><button class="btn-wa" id="coClose" style="flex:1;justify-content:center">OK</button></div>`);
    coModal.querySelector("#coClose").onclick=closeCheckout; return;
  }
  if(session) return myAccountPanel();
  accountForm(()=>{ updateNavAuth(); myAccountPanel(); });
}

// Standalone login/signup form (separate from the checkout copy so either can change freely).
function accountForm(onSuccess){
  show(`<h3 class="co-h">Your account</h3>
    <p class="co-sub">Log in to see your orders, or create an account.</p>
    <div class="co-tabs"><button class="co-tab on" id="tabLogin">I have an account</button>
      <button class="co-tab" id="tabSignup">Create account</button></div>
    <div id="coForm"></div><div class="co-confirm" id="coConfirm" hidden></div><div class="co-err" id="coErr"></div>
    <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Close</button>
      <button class="btn-wa" id="coGo" style="flex:1.4;justify-content:center">Continue</button></div>`);
  let mode="login";
  const form=coModal.querySelector("#coForm"), err=coModal.querySelector("#coErr"), confBox=coModal.querySelector("#coConfirm"), goBtn=coModal.querySelector("#coGo");
  let confirmed=false;
  function resetConfirm(){confirmed=false;goBtn.textContent="Continue";if(confBox){confBox.hidden=true;confBox.innerHTML="";}}
  form.addEventListener("input",resetConfirm);
  const loginForm=`<label>WhatsApp number</label><input id="f_phone" inputmode="numeric" placeholder="60123456789"><div style="font-size:11px;color:#7c879b;margin-top:3px">Non-Malaysian number? Add your country code (example 44…).</div>
    <label>Password</label><input id="f_pass" type="password" placeholder="Your password">
    <a class="co-forgot" href="#" onclick="stepForgot();return false;">Forgot password?</a>`;
  const signupForm=`<label>Your name</label><input id="f_name" placeholder="Full name">
    <label>WhatsApp number</label><input id="f_phone" inputmode="numeric" placeholder="60123456789"><div style="font-size:11px;color:#7c879b;margin-top:3px">Non-Malaysian number? Add your country code (example 44…).</div>
    <label>Email</label><input id="f_email" type="email" inputmode="email" placeholder="you@example.com">
    <label>Delivery address</label><input id="f_addr" placeholder="Unit, building, street address, postcode">
    <label>Choose a password</label><input id="f_pass" type="password" placeholder="At least 4 characters">
    <label>Confirm password</label><input id="f_pass2" type="password" placeholder="Re-enter your password">`;
  function paint(){form.innerHTML=mode==="login"?loginForm:signupForm;err.textContent="";}
  paint();
  coModal.querySelector("#tabLogin").onclick=()=>{mode="login";coModal.querySelector("#tabLogin").classList.add("on");coModal.querySelector("#tabSignup").classList.remove("on");resetConfirm();paint();};
  coModal.querySelector("#tabSignup").onclick=()=>{mode="signup";coModal.querySelector("#tabSignup").classList.add("on");coModal.querySelector("#tabLogin").classList.remove("on");resetConfirm();paint();};
  coModal.querySelector("#coBack").onclick=closeCheckout;
  goBtn.onclick=async()=>{
    const g=id=>{const el=coModal.querySelector(id);return el?el.value.trim():"";};
    const phone=g("#f_phone"), pass=g("#f_pass"), pass2=g("#f_pass2");
    const name=mode==="signup"?g("#f_name"):"", addr=mode==="signup"?g("#f_addr"):"", email=mode==="signup"?g("#f_email"):"";
    const probs=[];
    if(mode==="signup"&&!name)probs.push("Please enter your name.");
    if(!phone)probs.push("Please enter your WhatsApp number.");
    if(mode==="signup"){
      if(!email)probs.push("Please enter your email.");
      else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))probs.push("Please enter a valid email address.");
      else { if(emailDomainSuggestion(email))probs.push("Please check your email again."); }
      if(!addr)probs.push("Please enter your delivery address.");
    }
    if(!pass)probs.push(mode==="signup"?"Please choose a password.":"Please enter your password.");
    else if(mode==="signup"&&pass.length<4)probs.push("Password must be at least 4 characters.");
    if(mode==="signup"&&pass&&pass.length>=4&&pass!==pass2)probs.push("Passwords don't match.");
    const areaNote=(mode==="signup"&&addr&&!inServiceArea(addr))?"Heads up: we don't deliver to your area just yet — you can still sign up and we'll notify you when we do.":"";
    if(probs.length){ err.innerHTML=probs.map(esc).join("<br>")+(areaNote?'<br>'+esc(areaNote):""); return; }
    err.innerHTML=areaNote?esc(areaNote):"";  // all fields valid: clear errors, keep the out-of-area heads-up
    if(mode==="signup" && !confirmed){  // show the double-check box for every sign-up (duplicates caught on submit)
      confBox.hidden=false;
      confBox.innerHTML=`<b>Please double-check these are correct 👇</b><br>📱 WhatsApp: <b>${esc(phone)}</b><br>✉️ Email: <b>${esc(email)}</b><br>📦 Delivery address: <b>${esc(addr)}</b><br><span style="color:#7c879b">We'll deliver here and message you on this number.</span>`;
      confirmed=true; goBtn.textContent="Yes, that's correct"; return;
    }
    err.textContent="Please wait…";
    try{
      const res = mode==="login"
        ? await apiPub("login",{whatsapp:phone,passcode:pass})
        : await apiPub("signup",{name,email,whatsapp:phone,address:addr,passcode:pass});
      if(res.error){err.textContent=res.error;resetConfirm();return;}
      session={accountId:res.accountId,whatsapp:res.whatsapp||phone,passcode:pass,name:res.name,firstOrder:res.isFirstOrder};session.outOfArea=(mode==="signup"?!inServiceArea(addr):(res.address?!inServiceArea(res.address):false));session.hasPending=!!(res.pending&&res.pending.length);saveSession();
      // First-time sign-up from an area we don't serve yet: capture the lead and show the waitlist message.
      if(mode==="signup" && !inServiceArea(addr)){ try{apiPub("waitlist",{name:name,whatsapp:phone,address:addr});}catch(e){} updateNavAuth(); stepSignupOutOfArea(); return; }
      onSuccess();
    }catch(e){err.textContent="Couldn't connect. Please try again.";}
  };
}

function statusBadge(o){
  const s=o.status, paid=String(o.paymentStatus)==="Confirmed";
  let bg="#eef2f7",fg="#5a6b7a",label=(s==="Out")?"Delivered":s;
  if(s==="Pending payment"){ bg="#fff3d6"; fg="#8a6d1e"; label=paid?"Paid — processing":"Awaiting payment"; }
  else if(s==="Paid"||s==="Packed"){ bg="#dceaff"; fg="#1c4b8a"; }
  else if(s==="Out"||s==="Extended"){ bg="#d9f2e2"; fg="#1d6b3e"; }
  else if(s==="Returned"){ bg="#e7e0f4"; fg="#5a3f8a"; }
  else if(s==="Cancelled"||s==="Lost/Damaged"){ bg="#f4e0e0"; fg="#9a3a3a"; }
  return `<span style="background:${bg};color:${fg};font-weight:800;font-size:11.5px;padding:3px 9px;border-radius:999px;white-space:nowrap">${esc(label)}</span>`;
}

function fmtDate(d,withTime){
  try{ const dt=new Date(d); if(isNaN(dt))return String(d);
    const o={year:"numeric",month:"short",day:"numeric"}; if(withTime){o.hour="2-digit";o.minute="2-digit";}
    return dt.toLocaleDateString(undefined,o);
  }catch(e){return String(d);}
}

// "My account" — the customer's orders and their live status.
async function myAccountPanel(){
  show(`<h3 class="co-h">Hi ${esc(session.name||"there")} 👋</h3><p class="co-sub">Loading your orders…</p>`);
  let res={};
  try{ res=await apiPub("myOrders",{whatsapp:session.whatsapp,passcode:session.passcode}); }
  catch(e){ res={error:"network"}; }
  const orders=res.orders||[];
  const active=orders.filter(o=>o.status!=="Cancelled");
  if(session){ session.hasPending=active.some(o=>o.status==="Pending payment"&&String(o.paymentStatus)!=="Confirmed"); saveSession(); updateNavAuth(); }
  let listHtml;
  if(res.error){ listHtml=`<p class="co-sub">We couldn't load your orders just now. Please try again in a moment.</p>`; }
  else if(active.length===0){ listHtml=`<div class="co-note">✨ A world of stories awaits! Add up to ${MAX_BOOKS} books and check out to start your BUKUTOPIA journey!</div>`; }
  else {
    listHtml=active.map(o=>{
      const ref=String(o.id).slice(0,4).toUpperCase();
      const pendingUnpaid=o.status==="Pending payment" && String(o.paymentStatus)!=="Confirmed";
      const meta=(o.status==="Out"||o.status==="Extended")
        ? (o.dueDate?`Due back ${fmtDate(o.dueDate)}`:"")
        : pendingUnpaid ? `Pay ${money(o.amount)} within 24h${o.expiresAt?" · by "+fmtDate(o.expiresAt,true):""}` : "";
      return `<div class="co-li" style="display:block">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <b style="color:#103160">#${ref}</b> ${statusBadge(o)}</div>
        <div style="margin:3px 0 0">${esc(o.titles||"")}</div>
        ${meta?`<div style="color:#7c879b;font-size:12.5px;margin-top:2px">${esc(meta)}</div>`:""}
        ${pendingUnpaid?`<button class="btn-wa pay-again" data-id="${o.id}" style="margin-top:7px;padding:7px 12px;font-size:12.5px;justify-content:center">Pay / send receipt</button>`:""}
      </div>`;
    }).join("");
  }
  show(`<h3 class="co-h">Hi ${esc(session.name||"there")} 👋</h3>
    <p class="co-sub">${active.length?`Your ${active.length} order(s):`:"Your account"}</p>
    <div class="co-list">${listHtml}</div>
    <div class="co-row"><button class="btn-clear" id="coLogout" style="flex:1">Log out</button>
      <button class="btn-wa" id="coClose" style="flex:1.4;justify-content:center">Let's go</button></div>`);
  coModal.querySelector("#coClose").onclick=closeCheckout;
  coModal.querySelector("#coLogout").onclick=()=>{ session=null; saveSession(); updateNavAuth(); closeCheckout(); };
  coModal.querySelectorAll(".pay-again").forEach(b=>b.onclick=()=>{
    const o=orders.find(x=>String(x.id)===b.dataset.id);
    if(o) stepPay({id:o.id,ref:o.ref,orderNo:o.orderNo,titles:o.titles,amount:o.amount,type:o.type});
  });
}

/* ===================== Search autocomplete ===================== */
const AC_CSS = `
.search .ac-list{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#fff;border:1px solid #e0d6c2;border-radius:12px;
  box-shadow:0 14px 30px rgba(16,49,96,.18);max-height:330px;overflow:auto;z-index:55;display:none;padding:5px}
.search .ac-list.on{display:block}
.ac-item{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:9px;cursor:pointer;font-size:14px;color:#243447}
.ac-item.active,.ac-item:hover{background:#f3efe4}
.ac-ico{font-size:15px;flex:0 0 auto;line-height:1}
.ac-main{flex:1;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#103160}
.ac-main b{color:#e9755c}
.ac-sub{color:#9a8a72;font-size:12px;font-weight:600;white-space:nowrap;flex:0 0 auto;max-width:44%;overflow:hidden;text-overflow:ellipsis}
.ac-empty{padding:12px 12px;color:#9a8a72;font-size:13px}
.nav-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#e9755c;margin-left:4px;vertical-align:middle;animation:bkblink 1.1s infinite}
@keyframes bkblink{0%,100%{opacity:1}50%{opacity:.15}}
.nav-icon .nav-dot{position:absolute;top:-3px;right:-3px;margin:0;box-shadow:0 0 0 2px #fff}
.co-unavail{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px dashed #eadfca}
.co-unavail-info{flex:1;min-width:0}
.co-unavail-title{display:block;font-weight:700;color:#aab0bb;text-decoration:line-through;font-size:14px}
.co-unavail-msg{display:block;color:#c0503a;font-size:12.5px;margin-top:3px;line-height:1.4}
.co-unavail-swap{flex:0 0 auto;width:38px;height:38px;border-radius:10px;border:1.5px solid #e0d6c2;background:#fff;cursor:pointer;font-size:17px;line-height:1}
.co-unavail-swap:hover{border-color:#e9755c;background:#fff5f2}`;

function acHighlight(text,q){
  const t=String(text);
  if(!q) return esc(t);
  const i=t.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return esc(t);
  return esc(t.slice(0,i))+"<b>"+esc(t.slice(i,i+q.length))+"</b>"+esc(t.slice(i+q.length));
}
// Suggestions built from AVAILABLE series + titles only (skips "Coming soon").
function acSuggestions(){
  const out=[], seen=new Set();
  (BOOKS||[]).forEach(s=>{
    if(s.available===false) return;
    const sk="s|"+String(s.series||"").toLowerCase();
    if(s.series&&String(s.series).trim()&&!seen.has(sk)){ seen.add(sk); out.push({label:s.series, sub:s.author?("by "+s.author):"series", type:"series", q:s.series}); }
    (s.books||[]).forEach(b=>{
      const tk="t|"+String(b.title).toLowerCase();
      if(!seen.has(tk)){ seen.add(tk); out.push({label:b.title, sub:s.series, type:"title", q:b.title}); }
    });
  });
  return out;
}
function setupAutocomplete(){
  const input=document.getElementById("search");
  if(!input) return;
  const wrap=input.closest(".search")||input.parentElement;
  if(!wrap) return;
  let list=document.getElementById("acList");
  if(!list){ list=document.createElement("div"); list.id="acList"; list.className="ac-list"; list.setAttribute("role","listbox"); wrap.appendChild(list); }
  let items=[], active=-1, all=acSuggestions();
  function close(){ list.classList.remove("on"); list.innerHTML=""; items=[]; active=-1; }
  function paintActive(){ [...list.querySelectorAll(".ac-item")].forEach((el,i)=>el.classList.toggle("active",i===active)); const el=list.querySelectorAll(".ac-item")[active]; if(el)el.scrollIntoView({block:"nearest"}); }
  function choose(i){ const m=items[i]; if(!m)return; input.value=m.q; close(); render(); const b=document.getElementById("books"); if(b)b.scrollIntoView({behavior:"smooth",block:"start"}); }
  function refresh(){
    const q=input.value.trim().toLowerCase();
    if(q.length<1){ close(); return; }
    if(!all.length) all=acSuggestions();
    const starts=[], contains=[];
    for(const s of all){
      const l=s.label.toLowerCase();
      if(l.startsWith(q)) starts.push(s);
      else if(l.includes(q)||s.sub.toLowerCase().includes(q)) contains.push(s);
      if(starts.length+contains.length>60) break;
    }
    items=starts.concat(contains).slice(0,8);
    if(!items.length){ close(); return; }
    list.innerHTML=items.map((m,i)=>`<div class="ac-item" role="option" data-i="${i}"><span class="ac-ico">${m.type==="series"?"\u{1F4DA}":"\u{1F4D6}"}</span><span class="ac-main">${acHighlight(m.label,input.value.trim())}</span><span class="ac-sub">${esc(m.sub)}</span></div>`).join("");
    list.classList.add("on"); active=-1;
    list.querySelectorAll(".ac-item").forEach(el=>el.addEventListener("mousedown",e=>{ e.preventDefault(); choose(+el.dataset.i); }));
  }
  input.addEventListener("input",refresh);
  input.addEventListener("focus",()=>{ if(input.value.trim())refresh(); });
  input.addEventListener("keydown",e=>{
    if(!list.classList.contains("on")) return;
    if(e.key==="ArrowDown"){ e.preventDefault(); active=Math.min(active+1,items.length-1); paintActive(); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); active=Math.max(active-1,0); paintActive(); }
    else if(e.key==="Enter"){ if(active>=0){ e.preventDefault(); choose(active); } }
    else if(e.key==="Escape"){ close(); }
  });
  document.addEventListener("click",e=>{ if(!wrap.contains(e.target)) close(); });
  setupAutocomplete.refreshSource=()=>{ all=acSuggestions(); };
}

function buildFilters(){
  const ages=[...new Set(BOOKS.map(s=>s.age))].filter(a=>a!==undefined&&a!=="").sort((a,b)=>parseInt(a)-parseInt(b));
  const ageSel=document.getElementById("age");
  ageSel.innerHTML='<option value="">All ages</option>';
  ages.forEach(a=>ageSel.insertAdjacentHTML("beforeend",`<option value="${a}">Ages ${a}</option>`));
}
function _ne(v){return v!=null && String(v).trim()!=="";}
function _av(v){var a=String(v==null?"":v).trim().toLowerCase();if(a==="")return true;return !(a==="no"||a==="false"||a==="0"||a==="out"||a==="n");}
// Overlay edits made in the back office (Google Sheet) onto the built-in catalogue.
// Existing books are matched by ISBN and updated in place; new books/series are appended.
// Only non-empty sheet values override, so the curated copy never gets wiped.
function mergeSheetCatalogue(rows){
  if(!Array.isArray(rows)||!rows.length||typeof BOOKS==="undefined"||!BOOKS) return false;
  var byName={}; BOOKS.forEach(function(s){byName[s.series]=s;});
  var haveIsbn={}; BOOKS.forEach(function(s){(s.books||[]).forEach(function(b){if(b.isbn)haveIsbn[String(b.isbn).trim()]=1;});});
  var meta={};
  rows.forEach(function(r){
    var series=String(r.series||"").trim(); if(!series) return;
    var m=meta[series]||(meta[series]={});
    if(_ne(r.series_description)) m.desc=String(r.series_description).trim();
    if(_ne(r.price)&&!isNaN(parseFloat(r.price))) m.price=parseFloat(r.price);
    if(_ne(r.age)) m.age=String(r.age).trim();
    if(_ne(r.audience)) m.audience=String(r.audience).trim();
    if(_ne(r.author)) m.author=String(r.author).trim();
    if(_ne(r.color)) m.color=String(r.color).trim().toLowerCase();
    if(_ne(r.available)) m.available=_av(r.available);
    var isbn=String(r.isbn||"").trim();
    var s=byName[series];
    var b=(s&&isbn)?s.books.find(function(x){return String(x.isbn).trim()===isbn;}):null;
    if(b){
      if(_ne(r.imgCover)) b.coverurl=String(r.imgCover).trim();
      if(_ne(r.title)) b.title=String(r.title).trim();
      if(_ne(r.book_description)) b.desc=String(r.book_description).trim();
      b.available=_av(r.available);
    } else if(isbn && _ne(r.title) && !haveIsbn[isbn]){
      var nb={title:String(r.title).trim(),isbn:isbn,desc:_ne(r.book_description)?String(r.book_description).trim():"",coverurl:_ne(r.imgCover)?String(r.imgCover).trim():"",available:_av(r.available)};
      if(!s){
        s={series:series,color:(_ne(r.color)?String(r.color).trim().toLowerCase():"teal"),age:String(r.age||"").trim(),audience:String(r.audience||"Everyone").trim(),price:parseFloat(r.price)||0,author:String(r.author||"").trim(),available:_av(r.available),desc:_ne(r.series_description)?String(r.series_description).trim():"",isbns:[],books:[],titles:[]};
        byName[series]=s; BOOKS.push(s);
      }
      s.books.push(nb); s.titles.push(nb.title); haveIsbn[isbn]=1;
    }
  });
  Object.keys(meta).forEach(function(name){
    var s=byName[name]; if(!s) return; var m=meta[name];
    if(m.desc!=null)s.desc=m.desc; if(m.price!=null)s.price=m.price;
    if(m.age!=null)s.age=m.age; if(m.audience!=null)s.audience=m.audience;
    if(m.author!=null)s.author=m.author; if(m.color!=null)s.color=m.color;
    if(m.available!=null)s.available=m.available;
  });
  return true;
}
// Build the ENTIRE public catalogue from the Google Sheet (back office = source of truth).
// Falls back to DEFAULT_BOOKS only when the sheet is empty/unreachable. Add/edit/delete
// in the back office all reflect here, because the list is rebuilt from the sheet each load.
var SITE_BANNERS={announce:"",heroes:[]};
var SITE_HOW={eyebrow:"",heading:"",steps:[]};
var SITE_FAQ={eyebrow:"",heading:"",items:[]};
var SITE_MSGS={checkout:""};
var HERO_FILES=["Hero%20June%201.jpg?v=1"]; /* full-res repo file overrides the back-office upload. Set to [] to let the back office (Settings > Homepage banners) drive the hero instead. */
var ANNOUNCE_FILE="Aannouncement_July.jpg?v=1";
function buildBooksFromSheet(rows){
  if(!Array.isArray(rows)||!rows.length) return [];
  SITE_BANNERS={announce:"",heroes:[]};
  SITE_HOW={eyebrow:"",heading:"",steps:[]};
  SITE_FAQ={eyebrow:"",heading:"",items:[]};
  SITE_MSGS={checkout:""};
  var order=[], map={};
  rows.forEach(function(r){
    var series=String(r.series||"").trim();
    var isbn=String(r.isbn||"").trim();
    if(series==="__SITE__" || /^__(banner|how|faq|msg)_/.test(isbn)){
      var _v=_ne(r.imgCover)?String(r.imgCover).trim():"";
      var _t=_ne(r.title)?String(r.title).trim():"";
      var _d=_ne(r.book_description)?String(r.book_description).trim():"";
      var _sd=_ne(r.series_description)?String(r.series_description).trim():"";
      if(/^__banner_announce__$/.test(isbn)) SITE_BANNERS.announce=_v;
      else if(/^__banner_hero(\d*)__$/.test(isbn)){ var _m=isbn.match(/^__banner_hero(\d*)__$/); var _n=_m[1]?parseInt(_m[1],10):1; SITE_BANNERS.heroes[_n-1]=_v; }
      else if(isbn==="__how_head__"){ SITE_HOW.eyebrow=_sd; SITE_HOW.heading=_d; }
      else if(/^__how_[1-4]__$/.test(isbn)){ var _hm=isbn.match(/^__how_([1-4])__$/); SITE_HOW.steps[parseInt(_hm[1],10)-1]={title:_t,desc:_d}; }
      else if(isbn==="__faq_head__"){ SITE_FAQ.eyebrow=_sd; SITE_FAQ.heading=_d; }
      else if(/^__faq_[1-8]__$/.test(isbn)){ var _fm=isbn.match(/^__faq_([1-8])__$/); SITE_FAQ.items[parseInt(_fm[1],10)-1]={q:_t,a:_d}; }
      else if(isbn==="__msg_checkout__"){ SITE_MSGS.checkout=_d; }
      return;
    }
    if(!_ne(r.title) && !isbn) return;
    var key=series || ("__single__"+isbn);
    if(!map[key]){
      map[key]={ series:series, color:"teal", age:"", audience:"Everyone",
        price:0, author:"", available:true, desc:"", isbns:[], books:[], titles:[] };
      order.push(key);
    }
    var s=map[key];
    if(_ne(r.series_description)) s.desc=String(r.series_description).trim();
    if(_ne(r.age)) s.age=String(r.age).trim();
    if(_ne(r.color)) s.color=String(r.color).trim().toLowerCase();
    if(_ne(r.audience)) s.audience=String(r.audience).trim();
    if(_ne(r.author)) s.author=String(r.author).trim();
    if(_ne(r.price)&&!isNaN(parseFloat(r.price))) s.price=parseFloat(r.price);
    if(_ne(r.title)){
      var cover = _ne(r.imgCover) ? String(r.imgCover).trim() : (isbn?("covers/"+isbn+".jpg"):"");
      var ca = r.copiesAvailable;
      var inStock = (ca===""||ca===null||ca===undefined) ? true : (Number(ca)>0);
      var bAvail = _av(r.available) && inStock;
      var imgs=[]; if(cover) imgs.push(cover);
      ["imgBack","imgInside1","imgInside2","imgInside3"].forEach(function(k){ if(_ne(r[k])) imgs.push(String(r[k]).trim()); });
      s.books.push({ title:String(r.title).trim(), isbn:isbn,
        desc:_ne(r.book_description)?String(r.book_description).trim():"",
        coverurl:cover, available:bAvail, images:imgs });
      s.titles.push(String(r.title).trim());
    }
  });
  var list=order.map(function(k){ return map[k]; }).filter(function(s){ return s.books.length; });
  list.forEach(function(s){ s.available = s.books.some(function(b){ return b.available!==false; }); });
  return list;
}
async function loadPublicSettings(){
  if(!API_URL)return;
  try{const r=await fetch(API_URL);const d=await r.json();
    if(d&&d.settings)PUBLIC_SETTINGS=Object.assign(PUBLIC_SETTINGS,d.settings);
    if(d&&Array.isArray(d.catalogue)&&d.catalogue.length){
      var built=buildBooksFromSheet(d.catalogue);
      if(built.length){ BOOKS=built; try{buildFilters();}catch(e){} try{render();}catch(e){} }
      try{applyBanners();}catch(e){}
      try{applyHow();}catch(e){}
      try{applyFaq();}catch(e){}
    }
  }catch(e){}
}
function applyBanners(){
  var a=document.getElementById("sbAnn"),ai=document.getElementById("sbAnnImg");
  if(a&&ai){ var _ann=(typeof ANNOUNCE_FILE!=="undefined"&&ANNOUNCE_FILE)?ANNOUNCE_FILE:SITE_BANNERS.announce; if(_ann){ ai.src=_ann; a.style.display="block"; } else { a.style.display="none"; } }
  var hero=document.getElementById("sbHero");
  if(!hero) return;
  var imgs=(typeof HERO_FILES!=="undefined"&&HERO_FILES.length)?HERO_FILES.slice():(SITE_BANNERS.heroes||[]).filter(function(u){return u;});
  if(!imgs.length){ hero.style.display="none"; hero.innerHTML=""; return; }
  hero.style.display="block";
  if(imgs.length===1){ hero.innerHTML='<a href="#books" class="hc-slide on"><img src="'+escAttr(imgs[0])+'" alt="New arrivals"></a>'; return; }
  var slides=imgs.map(function(u,i){return '<a href="#books" class="hc-slide'+(i===0?" on":"")+'"><img src="'+escAttr(u)+'" alt="Banner '+(i+1)+'"></a>';}).join("");
  var dots=imgs.map(function(u,i){return '<span class="hc-dot'+(i===0?" on":"")+'" data-i="'+i+'"></span>';}).join("");
  hero.innerHTML='<div class="hc">'+slides+'<button class="hc-prev" aria-label="Previous banner">‹</button><button class="hc-next" aria-label="Next banner">›</button><div class="hc-dots">'+dots+'</div></div>';
  var root=hero.querySelector(".hc"), n=imgs.length, idx=0, timer=null;
  var slideEls=root.querySelectorAll(".hc-slide"), dotEls=root.querySelectorAll(".hc-dot");
  function go(i){ idx=((i%n)+n)%n; for(var k=0;k<n;k++){ slideEls[k].classList.toggle("on",k===idx); dotEls[k].classList.toggle("on",k===idx);} }
  function start(){ stop(); timer=setInterval(function(){go(idx+1);},5000); }
  function stop(){ if(timer){clearInterval(timer);timer=null;} }
  root.querySelector(".hc-prev").addEventListener("click",function(e){e.preventDefault();e.stopPropagation();go(idx-1);start();});
  root.querySelector(".hc-next").addEventListener("click",function(e){e.preventDefault();e.stopPropagation();go(idx+1);start();});
  for(var di=0;di<dotEls.length;di++){ (function(el){el.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();go(parseInt(el.getAttribute("data-i"),10));start();});})(dotEls[di]); }
  root.addEventListener("mouseenter",stop); root.addEventListener("mouseleave",start);
  start();
}
window.applyBanners=applyBanners;
function applyHow(){
  if(SITE_HOW.eyebrow){var e=document.getElementById("howEyebrow");if(e)e.textContent=SITE_HOW.eyebrow;}
  if(SITE_HOW.heading){var hd=document.getElementById("howHeading");if(hd)hd.textContent=SITE_HOW.heading;}
  for(var i=0;i<4;i++){ var s=SITE_HOW.steps[i]; if(!s)continue;
    if(s.title){var t=document.getElementById("howT"+(i+1));if(t)t.textContent=s.title;}
    if(s.desc){var dn=document.getElementById("howD"+(i+1));if(dn)dn.textContent=s.desc;}
  }
}
window.applyHow=applyHow;
function applyFaq(){
  if(SITE_FAQ.eyebrow){var e=document.getElementById("faqEyebrow");if(e)e.textContent=SITE_FAQ.eyebrow;}
  if(SITE_FAQ.heading){var hd=document.getElementById("faqHeading");if(hd)hd.textContent=SITE_FAQ.heading;}
  for(var i=0;i<8;i++){ var it=SITE_FAQ.items[i]; if(!it)continue;
    if(it.q){var q=document.getElementById("faqQ"+(i+1));if(q)q.textContent=it.q;}
    if(it.a){var an=document.getElementById("faqA"+(i+1));if(an)an.textContent=it.a;}
  }
}
window.applyFaq=applyFaq;
async function init(){
  document.head.insertAdjacentHTML("beforeend","<style>"+PILOT_CSS+CHECKOUT_CSS+AC_CSS+GAL_CSS+"</style>");
  loadPublicSettings();
  const note=document.getElementById("srcnote");
  if(SHEET_CSV_URL){
    try{
      const res=await fetch(SHEET_CSV_URL);
      const parsed=booksFromCSV(await res.text());
      if(parsed.length){BOOKS=normalize(parsed);note.textContent="Catalogue loaded live from Google Sheets.";}
      else throw new Error("empty");
    }catch(e){BOOKS=normalize(DEFAULT_BOOKS);note.textContent="Showing built-in catalogue.";}
  }else{BOOKS=normalize(DEFAULT_BOOKS);}
  loadSession();loadCart();buildFilters();render();updateCart();updateNavAuth();
  setupAutocomplete();
}
["search","age","avail"].forEach(id=>document.getElementById(id).addEventListener("input",render));
init();
