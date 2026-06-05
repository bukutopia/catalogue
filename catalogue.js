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
const WHATSAPP_NUMBER = "60129359787";
const SHEET_CSV_URL   = "";
/* Paste your Apps Script Web app URL (ends with /exec) to turn on accounts,
   live availability and real orders. Leave "" to fall back to a simple
   WhatsApp order message (no accounts) until the backend is deployed. */
const API_URL = "https://script.google.com/macros/s/AKfycbyVHxD4ZJXuUwvp8Q0q5JnMFCGmF2Rqwb2BwUJTjNaJyhq14pqXWwLP2_klILWRR2g/exec";
const MAX_BOOKS       = 4;
/* Payment QR shown at checkout. Put your DuitNow/Maybank QR image in this
   folder (and in the GitHub repo) named exactly payment-qr.png. */
const PAYMENT_QR_URL  = "payment-qr.png";
const PAYEE_NAME      = "Justin Tiew Senn · Maybank";

const SERIES_COLORS = {
  pink:["#f7b8c4","#ef94a6"], green:["#bfe3cf","#8fccb0"], blue:["#bcd9e8","#8fb9d6"],
  orange:["#ffd49a","#f6a85f"], purple:["#cdbef0","#a98fdf"], yellow:["#ffe48f","#ffd21f"],
  teal:["#bfe6e1","#8fcfc7"], red:["#f2a79a","#e9755c"], navy:["#5b7fb0","#103160"],
  rose:["#f9cdd8","#f3a9bd"], plum:["#c3aee0","#9576c4"]
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
  if(book && book.coverurl) return [book.coverurl];
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
  const img=srcs.length
    ? `<div class="cover-stack">${stacked?'<div class="sl sl2"></div><div class="sl sl1"></div>':''}<img class="cover-img" src="${escAttr(srcs[0])}" data-srcs="${escAttr(srcs.slice(1).join("|"))}" alt="${escAttr(book?book.title:s.series)} cover" loading="lazy" onerror="coverFallback(this)"></div>`
    : "";
  const badge = (stacked && count) ? `<span class="stack-count">${count} books added</span>` : "";
  return `<svg class="fl watermark"><use href="#leaf"/></svg>${badge}${img}${ph}<span class="price">RM${s.price}/book</span>${sold}`;
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
    const on=cart.has(key);
    const lbl=on?"Added ✓":"+ Add";
    const titleEl = b.desc
      ? `<button class="book-toggle"><span class="car">▸</span>${esc(b.title)}</button>`
      : `<span class="book-title">${esc(b.title)}</span>`;
    const descEl = b.desc ? `<div class="book-desc">${esc(b.desc)}</div>` : "";
    return `<div class="book${on?' sel':''}" data-title="${escAttr(b.title)}">
      <div class="book-row">${titleEl}
        <button class="add-btn${on?' added':''}" data-key="${escAttr(key)}" ${avail?"":"disabled"}>${lbl}</button>
      </div>${descEl}</div>`;
  }).join("");

  const author = s.author? `<div class="author">by ${esc(s.author)}</div>` : "";
  const rs=restingState(s);
  return `<div class="card">
    <div class="cover" style="${coverStyle(s.color)}">${coverInner(s,rs.book,rs.stacked,rs.count)}</div>
    <div class="card-body">
      <h3 class="series-name">${esc(s.series)}</h3>
      <div class="meta">
        <span class="tag age">Ages ${esc(s.age)}</span>
        <span class="tag aud">${esc(s.audience)}</span>
        <span class="tag num">${s.books.length} ${s.books.length===1?"book":"books"}</span>
      </div>
      ${author}
      <p class="desc">${esc(s.desc)}</p>
      <button class="titles-toggle">▸ See ${s.books.length} ${s.books.length===1?"title":"titles"}</button>
      <div class="titles">${bookRows}</div>
      <div class="card-foot">
        <button class="add-all" ${avail?"":"disabled"}>${avail?"Add whole series to list":"Coming soon"}</button>
      </div>
    </div>
  </div>`;
}

function applyFilters(){
  const q=document.getElementById("search").value.trim().toLowerCase();
  const age=document.getElementById("age").value;
  const aud=document.getElementById("aud").value;
  const avail=document.getElementById("avail").value;
  return BOOKS.filter(s=>{
    if(avail==="yes" && s.available===false) return false;
    if(age && s.age!==age) return false;
    if(aud && s.audience!==aud && s.audience!=="Everyone") return false;
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
    cardEl.querySelectorAll(".add-btn").forEach(btn=>btn.addEventListener("click",()=>toggle(btn.dataset.key)));
    cardEl.querySelector(".add-all").addEventListener("click",()=>{
      s.books.forEach(b=>cart.add(s.series+" :: "+b.title));
      updateCart();render();
    });
  });
}
function toggle(key){ cart.has(key)?cart.delete(key):cart.add(key); updateCart(); render(); }

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
  if(btn){ btn.disabled=over; btn.style.opacity=over?.55:1; btn.style.cursor=over?"not-allowed":"pointer";
    btn.title=over?`Remove ${n-MAX_BOOKS} book(s) to check out`:""; }
}
document.getElementById("btnClear").addEventListener("click",()=>{cart.clear();updateCart();render();});

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
#coModal .co-row{display:flex;gap:10px;margin-top:14px}
#coModal .co-tabs{display:flex;gap:8px;margin:2px 0 6px}
#coModal .co-tab{flex:1;padding:9px;border:1px solid #e0d6c2;border-radius:9px;background:#fff;font:inherit;font-weight:700;color:#103160;cursor:pointer}
#coModal .co-tab.on{background:#103160;color:#fff;border-color:#103160}
#coModal .co-big{font-size:26px;font-weight:800;color:#103160;margin:2px 0}`;

const modalBg=document.getElementById("modalBg");
const coModal=document.getElementById("coModal");
function closeCheckout(){modalBg.classList.remove("show");}
modalBg.addEventListener("click",e=>{if(e.target===modalBg)closeCheckout();});
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
function show(html){coModal.innerHTML=html;modalBg.classList.add("show");}

function openCheckout(){
  if(cart.size===0)return;
  if(cart.size>MAX_BOOKS){
    show(`<h3 class="co-h">Just a little too many 📚</h3>
      <p class="co-sub">You've picked ${cart.size} books. Rentals are up to ${MAX_BOOKS} books per registered name — please remove ${cart.size-MAX_BOOKS} to check out.</p>
      <div class="co-row"><button class="btn-wa" id="coClose" style="flex:1;justify-content:center">Back to my list</button></div>`);
    coModal.querySelector("#coClose").onclick=closeCheckout; return;
  }
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

function stepReview(){
  show(`<h3 class="co-h">Your book list</h3>
    <p class="co-sub">${coItems.length} of ${MAX_BOOKS} books. We'll check they're all available, then set up your order.</p>
    <div class="co-list">${liRows()}</div>
    <div class="co-row">
      <button class="btn-clear" id="coBack" style="flex:1">Keep browsing</button>
      <button class="btn-wa" id="coNext" style="flex:1.4;justify-content:center">Check out</button>
    </div>`);
  coModal.querySelector("#coBack").onclick=closeCheckout;
  coModal.querySelector("#coNext").onclick=stepAvailability;
}

async function stepAvailability(){
  show(`<h3 class="co-h">Checking availability…</h3><p class="co-sub">One moment please.</p>`);
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
    if(coItems.length===0){
      show(`<h3 class="co-h">Those have just gone out 😢</h3>
        <p class="co-sub">Sorry, ${removed.map(r=>esc(r.title)).join(", ")} ${removed.length>1?"are":"is"} no longer available. Please pick something else.</p>
        <div class="co-row"><button class="btn-wa" id="coClose" style="flex:1;justify-content:center">Back to catalogue</button></div>`);
      coModal.querySelector("#coClose").onclick=closeCheckout; return;
    }
    show(`<h3 class="co-h">A couple just went out</h3>
      <p class="co-sub">We removed: ${removed.map(r=>esc(r.title)).join(", ")}. The rest are available — continue with these ${coItems.length}?</p>
      <div class="co-list">${liRows()}</div>
      <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Edit list</button>
      <button class="btn-wa" id="coNext" style="flex:1.4;justify-content:center">Continue</button></div>`);
    coModal.querySelector("#coBack").onclick=closeCheckout;
    coModal.querySelector("#coNext").onclick=stepAccount; return;
  }
  stepAccount();
}

function stepAccount(){
  if(session){return stepConfirm();}
  show(`<h3 class="co-h">Almost there</h3>
    <p class="co-sub">Log in or create your account to place the order.</p>
    <div class="co-tabs"><button class="co-tab on" id="tabLogin">I have an account</button>
      <button class="co-tab" id="tabSignup">Create account</button></div>
    <div id="coForm"></div><div class="co-err" id="coErr"></div>
    <div class="co-row"><button class="btn-clear" id="coBack" style="flex:1">Back</button>
      <button class="btn-wa" id="coGo" style="flex:1.4;justify-content:center">Continue</button></div>`);
  let mode="login";
  const form=coModal.querySelector("#coForm"), err=coModal.querySelector("#coErr");
  const loginForm=`<label>WhatsApp number</label><input id="f_phone" inputmode="numeric" placeholder="60123456789">
    <label>Passcode</label><input id="f_pass" type="password" placeholder="Your passcode">`;
  const signupForm=`<label>Your name</label><input id="f_name" placeholder="Full name">
    <label>WhatsApp number</label><input id="f_phone" inputmode="numeric" placeholder="60123456789">
    <label>Delivery address</label><input id="f_addr" placeholder="Unit, street, postcode">
    <label>Choose a passcode</label><input id="f_pass" type="password" placeholder="At least 4 characters">`;
  function paint(){form.innerHTML=mode==="login"?loginForm:signupForm;err.textContent="";}
  paint();
  coModal.querySelector("#tabLogin").onclick=()=>{mode="login";coModal.querySelector("#tabLogin").classList.add("on");coModal.querySelector("#tabSignup").classList.remove("on");paint();};
  coModal.querySelector("#tabSignup").onclick=()=>{mode="signup";coModal.querySelector("#tabSignup").classList.add("on");coModal.querySelector("#tabLogin").classList.remove("on");paint();};
  coModal.querySelector("#coBack").onclick=stepReview;
  coModal.querySelector("#coGo").onclick=async()=>{
    const g=id=>{const el=coModal.querySelector(id);return el?el.value.trim():"";};
    const phone=g("#f_phone"), pass=g("#f_pass");
    if(!phone||!pass){err.textContent="Please fill in your number and passcode.";return;}
    err.textContent="Please wait…";
    try{
      let res;
      if(mode==="login") res=await apiPub("login",{whatsapp:phone,passcode:pass});
      else res=await apiPub("signup",{name:g("#f_name"),whatsapp:phone,address:g("#f_addr"),passcode:pass});
      if(res.error){err.textContent=res.error;return;}
      session={accountId:res.accountId,whatsapp:phone,passcode:pass,name:res.name,firstOrder:res.isFirstOrder};
      stepConfirm();
    }catch(e){err.textContent="Couldn't connect. Please try again.";}
  };
}

function stepConfirm(){
  const total=coItems.reduce((s,it)=>s+it.price,0);
  const first=session.firstOrder;
  const amount=first?Number(PUBLIC_SETTINGS.deposit||60):total;
  show(`<h3 class="co-h">Hi ${esc(session.name||"there")} 👋</h3>
    <p class="co-sub">${coItems.length} book(s) — ${coItems.map(i=>esc(i.title)).join(", ")}</p>
    ${first
      ? `<div class="co-note"><b>First order</b> — your first month is on us. You pay only the <b>RM${PUBLIC_SETTINGS.deposit||60} refundable deposit</b> to get started.</div><div class="co-big">${money(amount)} <span style="font-size:13px;color:#7c879b;font-weight:600">refundable deposit</span></div>`
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
      stepPay(res.order);
    }catch(e){err.textContent="Couldn't place the order. Please try again.";}
  };
}

function stepPay(order){
  const ref=String(order.id).slice(0,8).toUpperCase();
  const deposit=order.type==="deposit";
  const msg=`Hi Bukutopia! 📚 Order ${ref} — ${order.titles}. I'm paying ${money(order.amount)} `+
    `(${deposit?"refundable deposit, first month free":"rental checkout"}). My payment receipt is attached. 🙏`;
  const link=`https://wa.me/${waNum()}?text=${encodeURIComponent(msg)}`;
  show(`<h3 class="co-h">Order placed — ref ${ref} 🎉</h3>
    <p class="co-sub">To complete checkout, pay and send us your receipt on WhatsApp <b>within 24 hours</b>. Unpaid orders are released automatically after that.</p>
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
    <div class="co-row"><button class="btn-clear" id="coClose" style="flex:1">Done</button>
      <a class="btn-wa" id="coWa" href="${link}" target="_blank" style="flex:1.5;justify-content:center;text-decoration:none">Send receipt on WhatsApp</a></div>`);
  coModal.querySelector("#coClose").onclick=closeCheckout;
  coModal.querySelector("#coWa").onclick=()=>{setTimeout(closeCheckout,400);};
}

function buildFilters(){
  const ages=[...new Set(BOOKS.map(s=>s.age))].sort((a,b)=>parseInt(a)-parseInt(b));
  const auds=[...new Set(BOOKS.map(s=>s.audience))].filter(a=>a!=="Everyone").sort();
  const ageSel=document.getElementById("age");
  ages.forEach(a=>ageSel.insertAdjacentHTML("beforeend",`<option value="${a}">Ages ${a}</option>`));
  const audSel=document.getElementById("aud");
  auds.forEach(a=>audSel.insertAdjacentHTML("beforeend",`<option value="${a}">${a}</option>`));
}
async function loadPublicSettings(){
  if(!API_URL)return;
  try{const r=await fetch(API_URL);const d=await r.json();
    if(d&&d.settings)PUBLIC_SETTINGS=Object.assign(PUBLIC_SETTINGS,d.settings);}catch(e){}
}
async function init(){
  document.head.insertAdjacentHTML("beforeend","<style>"+PILOT_CSS+CHECKOUT_CSS+"</style>");
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
  buildFilters();render();updateCart();
}
["search","age","aud","avail"].forEach(id=>document.getElementById(id).addEventListener("input",render));
init();
