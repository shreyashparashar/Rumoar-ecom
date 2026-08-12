/* ===========================================================================
   §1  MEDIA MANIFEST — the only block you edit when photography arrives

   Every product below has an `img` field. It is `null` today, and while it is
   null the product renders a designed plate instead of a broken <img>: the
   piece number, the name, and its material set on a tinted field. That is a
   deliberate state, not a placeholder apology — the store is presentable to a
   client with no photography at all.

   To drop real photography in, put the files in `public/assets/products/` and
   change one line per product:

       img: null                    →    img: "products/wallet.jpg"

   Nothing else changes. <Plate> detects the file and swaps itself out.
   Shoot 4:5 portrait, 1600px on the long edge, on a light ground.
   =========================================================================== */
/* import.meta.env.BASE_URL is whatever `base` resolved to in vite.config.js,
   with a trailing slash. Using it here rather than a literal "/assets/" is
   what lets the same build work at a domain root and inside a GitHub Pages
   subpath — a hardcoded absolute path would 404 on Pages. */
export const MEDIA_BASE = `${import.meta.env.BASE_URL}assets/`;
export const asset = (p) => (p ? `${MEDIA_BASE}${p}` : null);

/* ===========================================================================
   §2  THE PIECES

   Six of the nine. The wardrobe system the research argued for: objects a man
   is read by before he speaks, priced where the research found the gap —
   above the ₹1,500 mass floor, below the ₹15,000 import ceiling, which is the
   band nobody in India currently builds a coherent system inside.

   `thread` is the sentence that connects the piece back to the system. It is
   the reason this is a wardrobe and not a catalogue, so every piece has one.
   =========================================================================== */
export const PRODUCTS = [
  {
    id: "signal-wallet",
    n: "01",
    name: "The Signal Wallet",
    line: "Carry",
    price: 3200,
    was: null,
    img: null,
    blurb: "Six cards, folded notes, nothing else. Sized to disappear in a trouser pocket and to be read correctly when it comes out.",
    thread: "The first object most men buy with their own money. It should not be the last one they think about.",
    material: "Full-grain vegetable-tanned leather",
    spec: [
      ["Material", "Full-grain vegetable-tanned calf"],
      ["Lining", "Unlined, skived edge"],
      ["Capacity", "6 cards · folded notes"],
      ["Dimensions", "108 × 88 mm closed"],
      ["Hardware", "None"],
      ["Made in", "Chennai, India"],
    ],
    colours: [
      { id: "ink", name: "Ink", hex: "#15151A" },
      { id: "oxblood", name: "Oxblood", hex: "#5C1A1E" },
      { id: "tan", name: "Raw Tan", hex: "#B07C4F" },
    ],
    care: "It will darken where you hold it. That is the point — a year in, no two are the same. Keep it dry; condition it twice a year with a neutral cream.",
    stock: 24,
    tags: ["Everyday", "Leather"],
  },
  {
    id: "quiet-hours",
    n: "02",
    name: "Quiet Hours",
    line: "Time",
    price: 12900,
    was: 14500,
    img: null,
    blurb: "A 38mm field watch with the numerals taken off. What is left is a dial that tells you the time and tells the room nothing else.",
    thread: "A glance at the time is a glance at the plan. The watch is the only object here that is read while it is being used.",
    material: "Brushed 316L steel, sapphire crystal",
    spec: [
      ["Case", "38 mm brushed 316L steel"],
      ["Crystal", "Flat sapphire, AR-coated"],
      ["Movement", "Miyota 9039 automatic"],
      ["Reserve", "42 hours"],
      ["Water", "10 ATM"],
      ["Strap", "20 mm, quick-release"],
    ],
    colours: [
      { id: "slate", name: "Slate", hex: "#2B2F36" },
      { id: "bone", name: "Bone", hex: "#E8E4DC" },
      { id: "ember", name: "Ember", hex: "#8E1B22" },
    ],
    care: "Automatic — it runs on the way you move. Left still for two days it stops; a dozen turns of the crown wakes it. Service at five years.",
    stock: 8,
    tags: ["Automatic", "Steel"],
  },
  {
    id: "rumour-chain",
    n: "03",
    name: "The Rumour Chain",
    line: "Wear",
    price: 4600,
    was: null,
    img: null,
    blurb: "A 2.4mm curb chain, weighted to sit rather than swing. Wedding-season fluent, Tuesday-appropriate.",
    thread: "The piece that does the most work at the fewest occasions — and the one Indian menswear has priced worst.",
    material: "Rhodium-finished sterling silver",
    spec: [
      ["Material", "925 sterling silver"],
      ["Finish", "Rhodium, brushed"],
      ["Gauge", "2.4 mm curb"],
      ["Length", "500 mm · 550 mm"],
      ["Clasp", "Push-lock, signed"],
      ["Weight", "18 g"],
    ],
    colours: [
      { id: "silver", name: "Rhodium", hex: "#C6C8CC" },
      { id: "onyx", name: "Black Rhodium", hex: "#26262B" },
    ],
    care: "Silver tarnishes; that is chemistry, not a defect. The cloth in the box brings it back in about a minute.",
    stock: 41,
    tags: ["Sterling", "Everyday"],
  },
  {
    id: "eclipse",
    n: "04",
    name: "Eclipse",
    line: "See",
    price: 5400,
    was: null,
    img: null,
    blurb: "A flat-top acetate frame cut narrow enough for an Indian face and dark enough to end a conversation.",
    thread: "Confidence at arm's length. The only piece in the system that changes how much of you the room gets.",
    material: "Italian acetate, CR-39 lenses",
    spec: [
      ["Frame", "Mazzucchelli acetate, 6 mm"],
      ["Lens", "CR-39, category 3"],
      ["UV", "400 nm, full block"],
      ["Width", "142 mm temple to temple"],
      ["Bridge", "Raised, Asian fit"],
      ["Hinge", "Five-barrel, riveted"],
    ],
    colours: [
      { id: "black", name: "Ink", hex: "#141418" },
      { id: "tortoise", name: "Tortoise", hex: "#6B4526" },
      { id: "smoke", name: "Smoke", hex: "#4A4A52" },
    ],
    care: "Two hands off, never one — single-handed removal is what loosens a hinge. The pouch is not optional.",
    stock: 17,
    tags: ["Acetate", "Asian fit"],
  },
  {
    id: "courier",
    n: "05",
    name: "The Courier",
    line: "Carry",
    price: 6800,
    was: null,
    img: null,
    blurb: "A sling built around a 11-inch tablet, a charger and a paperback. The young man's briefcase, without the apology.",
    thread: "The bag men actually carry, finally built like it matters instead of being sold as a gym afterthought.",
    material: "Waxed 14oz cotton canvas, leather trim",
    spec: [
      ["Shell", "14 oz waxed cotton canvas"],
      ["Trim", "Vegetable-tanned leather"],
      ["Capacity", "4.5 L"],
      ["Fits", "Up to 11-inch tablet"],
      ["Strap", "Webbing, 700–1250 mm"],
      ["Hardware", "Solid brass, YKK Excella"],
    ],
    colours: [
      { id: "field", name: "Field Olive", hex: "#3F4436" },
      { id: "ink", name: "Ink", hex: "#1A1A1F" },
      { id: "sand", name: "Sand", hex: "#A8977E" },
    ],
    care: "The wax will crease and lighten along the folds. Re-wax when it stops beading, roughly once a year.",
    stock: 12,
    tags: ["Waxed canvas", "Brass"],
  },
  {
    id: "ember-01",
    n: "06",
    name: "Ember 01",
    line: "Trace",
    price: 4200,
    was: null,
    img: null,
    blurb: "Cardamom over cedar and a long smoke finish. Built to be noticed at conversational distance and nowhere further.",
    thread: "Invisible detail, visible status. The only piece in the system that arrives before you do.",
    material: "Eau de parfum, 18% concentration",
    spec: [
      ["Concentration", "Eau de parfum, 18%"],
      ["Top", "Green cardamom, pink pepper"],
      ["Heart", "Atlas cedar, orris"],
      ["Base", "Birch tar, tonka, vetiver"],
      ["Volume", "50 ml"],
      ["Longevity", "6–8 hours"],
    ],
    colours: [{ id: "50ml", name: "50 ml", hex: "#8E1B22" }],
    care: "Heat and sunlight are what kill a fragrance. Keep the box; it is not packaging, it is the shade.",
    stock: 30,
    tags: ["18% EDP", "50 ml"],
  },
];

export const byId = (id) => PRODUCTS.find((p) => p.id === id) || null;

/* ===========================================================================
   §3  COPY
   =========================================================================== */
export const WHISPER = [
  "Every story starts with a whisper.",
  "Every great brand starts as a rumour.",
];

export const LINES = ["All", "Carry", "Time", "Wear", "See", "Trace"];

/* The four words the research site ran down its right-hand edge. They are the
   argument compressed to four nouns, so they stay. */
export const CREED = ["Identity", "Status", "Belonging", "Confidence"];

export const PROMISES = [
  ["Made in India", "Chennai, Kolkata and Jaipur. Named workshops, not a sourcing story."],
  ["Thirty nights", "Carry it properly. If it hasn't earned its place, send it back."],
  ["Repaired, not replaced", "Every piece is built to be opened. We fix ours for as long as you own them."],
  ["Free shipping over ₹2,000", "Two to four days across India. Tracked from the workshop door."],
];
