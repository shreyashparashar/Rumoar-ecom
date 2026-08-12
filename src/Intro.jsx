import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { reduced } from "./lib.jsx";
import { WHISPER } from "./data.js";

/* ===========================================================================
   THE KING OF HEARTS

   A real court card, built the way a court card is actually built: a mirrored
   half-figure split across the horizontal centre line, with the index in
   opposite corners so it reads the same whichever way up it is dealt.

   The index is R, not K. That is the whole joke, and it is why the R is set
   at 54px on a 250-wide card — bigger than a real index would ever be — and
   repeated on the shield at the king's chest. Three R's, no explanation.

   Drawn as flat geometry rather than illustration: crown, collar, robe panels,
   blade. Symmetrical, heraldic, no crosshatching and no hand-drawn wobble.
   =========================================================================== */
function KingFace() {
  /* Half the figure. Rendered once upright and once rotated 180° about the
     card's centre, which is what makes a court card a court card.

     Proportions are the thing that decides whether this reads as a playing
     card or as clip art: the figure fills its panel edge to edge, the crown
     is wider than the face, and the robe reaches the mirror line so the two
     halves meet at a hem rather than floating apart. The sceptre is drawn
     first and offset left so the robe covers its base and it never crosses
     the face — centred, it read as a bar through the king's head. */
  const Half = () => (
    <g>
      {/* ——— sceptre, behind everything ——— */}
      <path d="M84 178 L84 64" stroke="#26262B" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="84" cy="58" r="5" fill="#F5C518" stroke="#26262B" strokeWidth="1.6" />

      {/* ——— crown ——— */}
      <path d="M92 78 L98 56 L112 70 L125 49 L138 70 L152 56 L158 78 Z"
        fill="#D8232F" stroke="#26262B" strokeWidth="1.9" strokeLinejoin="round" />
      <rect x="90" y="77" width="70" height="11" rx="3" fill="#D8232F" stroke="#26262B" strokeWidth="1.9" />
      <circle cx="98" cy="54" r="3.6" fill="#F5C518" stroke="#26262B" strokeWidth="1.5" />
      <circle cx="125" cy="47" r="4.2" fill="#F5C518" stroke="#26262B" strokeWidth="1.5" />
      <circle cx="152" cy="54" r="3.6" fill="#F5C518" stroke="#26262B" strokeWidth="1.5" />
      <circle cx="125" cy="83" r="3.1" fill="#F5C518" />

      {/* ——— hair, framing the face in the suit colour ——— */}
      <path d="M100 88 Q97 116 106 132 L113 132 Q103 116 106 90 Z"
        fill="#D8232F" stroke="#26262B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M150 88 Q153 116 144 132 L137 132 Q147 116 144 90 Z"
        fill="#D8232F" stroke="#26262B" strokeWidth="1.6" strokeLinejoin="round" />

      {/* ——— face ——— */}
      <path d="M104 88 L146 88 L146 113 Q125 130 104 113 Z"
        fill="#F2DCC4" stroke="#26262B" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M112 100 L119 100 M131 100 L138 100"
        stroke="#26262B" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M125 100 L125 108" stroke="#26262B" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M125 112 Q116 116 111 109" stroke="#26262B" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M125 112 Q134 116 139 109" stroke="#26262B" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M110 116 Q125 133 140 116" stroke="#26262B" strokeWidth="1.9" fill="none" strokeLinecap="round" />

      {/* ——— collar, notched ——— */}
      <path d="M98 130 L152 130 L161 148 L89 148 Z"
        fill="#FCFBF9" stroke="#26262B" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M118 130 L125 140 L132 130" fill="none" stroke="#26262B" strokeWidth="1.6" strokeLinejoin="round" />

      {/* ——— robe, split down the middle and reaching the mirror line.

           A single black trapezoid here is what turned the two mirrored
           halves into one black hexagon in the centre of the card. Splitting
           it heraldically — one half suit-red, one half ink — is both what a
           real court card does and what breaks the blob back into a figure. */}
      <path d="M89 148 L125 148 L125 178 L79 178 Z"
        fill="#D8232F" stroke="#26262B" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M125 148 L161 148 L171 178 L125 178 Z"
        fill="#26262B" stroke="#26262B" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M89 148 L161 148 L171 178 L79 178 Z"
        fill="none" stroke="#26262B" strokeWidth="1.8" strokeLinejoin="round" />

      {/* ——— the shield: the R again, on his chest ——— */}
      <path d="M110 152 L140 152 L140 167 Q125 176 110 167 Z"
        fill="#FCFBF9" stroke="#26262B" strokeWidth="1.7" strokeLinejoin="round" />
      <text x="125" y="167" textAnchor="middle" fontFamily="Bodoni Moda, Didot, Georgia, serif"
        fontSize="18" fontWeight="700" fill="#D8232F">R</text>
    </g>
  );

  /* The corner index. R over a heart, set large — this is the element the
     whole intro is building toward, so it is oversized on purpose. */
  const Index = () => (
    <g>
      <text x="28" y="58" textAnchor="middle" fontFamily="Bodoni Moda, Didot, Georgia, serif"
        fontSize="58" fontWeight="700" fill="#D8232F">R</text>
      <path d="M28 68 C28 63.5 21 61 21 68 C21 74 28 78.5 28 78.5 C28 78.5 35 74 35 68 C35 61 28 63.5 28 68 Z"
        fill="#D8232F" />
    </g>
  );

  return (
    <svg viewBox="0 0 250 350" role="img" aria-label="The King of Hearts, indexed R">
      <rect width="250" height="350" rx="14" fill="#FCFBF9" />
      <rect x="7" y="7" width="236" height="336" rx="9" fill="none" stroke="#D8232F" strokeWidth="1.2" opacity=".5" />
      <rect x="70" y="44" width="110" height="268" rx="4" fill="none" stroke="#26262B" strokeWidth="1.1" opacity=".28" />

      <Half />
      <g transform="rotate(180 125 178)"><Half /></g>
      {/* the centre line, which is what sells it as a real court card */}
      <line x1="70" y1="178" x2="180" y2="178" stroke="#26262B" strokeWidth="1.1" opacity=".28" />

      <Index />
      <g transform="rotate(180 125 178)"><Index /></g>
    </svg>
  );
}

/* ===========================================================================
   THE INTRO

   A deck is riffled three times, fanned, squared, and the top card is turned
   over. The whisper types underneath from the first frame — the two run
   simultaneously, not in sequence, so the copy is finished by the time the
   card lands rather than making the visitor wait through it.

   Skippable from 700ms by click, key or the button. Shown once per browser
   session: a returning visitor who is three clicks from checkout should not
   have to watch a card trick again.
   =========================================================================== */
const CARDS = 24;

export default function Intro({ onDone }) {
  const root = useRef(null);
  const deck = useRef(null);
  const flip = useRef(null);
  const sheen = useRef(null);
  const tl = useRef(null);
  const done = useRef(false);

  const [line, setLine] = useState("");
  const [gone, setGone] = useState(false);
  const [skippable, setSkippable] = useState(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    tl.current?.kill();
    setGone(true);
    /* the unlock has to outlast the fade, or the page scrolls up behind a
       still-visible overlay */
    setTimeout(() => onDone?.(), 900);
  }, [onDone]);

  /* ——— the shuffle ——— */
  useEffect(() => {
    if (reduced()) { finish(); return; }
    const el = deck.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".card-back-n", el);
      const hero = flip.current;

      /* a real deck is never perfectly square */
      gsap.set(cards, {
        x: () => gsap.utils.random(-1.5, 1.5),
        y: (i) => -i * 0.35,
        rotate: () => gsap.utils.random(-1.4, 1.4),
        transformOrigin: "50% 50%",
      });
      gsap.set(hero, { autoAlpha: 0, rotateY: 0, scale: 1 });

      const t = gsap.timeline({ onComplete: finish });

      /* ——— 1. three riffles ———
         Each riffle splits the deck, throws the halves apart, and interleaves
         them back. The stagger is what makes it read as cards rather than as
         two blocks: they arrive one after another, fast, from alternating
         sides. */
      for (let r = 0; r < 3; r++) {
        const spread = 78 - r * 16;                 // tighter every pass
        t.to(cards, {
          x: (i) => (i % 2 ? -spread : spread),
          y: (i) => -i * 0.35 + (i % 2 ? -7 : 7),
          rotate: (i) => (i % 2 ? -9 : 9),
          duration: 0.17,
          ease: "power2.out",
          stagger: { each: 0.004, from: "center" },
        })
          .to(cards, {
            x: () => gsap.utils.random(-2, 2),
            y: (i) => -i * 0.35,
            rotate: () => gsap.utils.random(-2, 2),
            duration: 0.21,
            ease: "power3.inOut",
            stagger: { each: 0.007, from: "random" },
          }, ">-0.02");
      }

      /* ——— 2. the fan ———
         One arc across the table, held for a beat, then squared up. This is
         the moment the deck stops being a blur and reads as many cards. */
      t.to(cards, {
        x: (i) => (i - CARDS / 2) * 9,
        y: (i) => Math.abs(i - CARDS / 2) * 2.4 - 10,
        rotate: (i) => (i - CARDS / 2) * 2.6,
        duration: 0.5,
        ease: "power3.out",
        stagger: { each: 0.008, from: "start" },
      }, ">0.02")
        .to(cards, {
          x: 0, y: (i) => -i * 0.35, rotate: () => gsap.utils.random(-1, 1),
          duration: 0.42,
          ease: "power3.inOut",
          stagger: { each: 0.006, from: "end" },
        }, ">0.16");

      /* ——— 3. the turn ———
         The deck drops away downward while the top card lifts, turns over and
         settles. Nothing crossfades: the card is genuinely rotated, so the
         back leaves as the face arrives. */
      t.to(cards, {
        y: 240, autoAlpha: 0, rotate: () => gsap.utils.random(-16, 16),
        duration: 0.6, ease: "power2.in", stagger: { each: 0.012, from: "start" },
      }, ">0.05")
        .set(hero, { autoAlpha: 1 }, "<")
        .fromTo(hero,
          { rotateY: 0, scale: 1, y: 0 },
          { rotateY: 180, scale: 1.06, y: -14, duration: 0.95, ease: "power3.inOut" }, "<0.1")
        .to(hero, { scale: 1, y: 0, duration: 0.5, ease: "power2.out" }, ">-0.12");

      /* the sheen travels the face once, as it settles */
      t.fromTo(sheen.current,
        { opacity: 0, xPercent: -120 },
        { opacity: 1, xPercent: 120, duration: 0.85, ease: "power2.inOut" }, ">-0.45")
        .set(sheen.current, { opacity: 0 });

      t.to({}, { duration: 0.62 });          // hold on the card
      tl.current = t;
    }, root);

    return () => ctx.revert();
  }, [finish]);

  /* ——— the whisper, running alongside from the first frame ——— */
  useEffect(() => {
    if (reduced()) return;
    let dead = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const type = async (s, sp) => {
      for (let i = 1; i <= s.length; i++) {
        if (dead || done.current) return;
        setLine(s.slice(0, i));
        await wait(sp);
      }
    };
    const erase = async (s, sp) => {
      for (let i = s.length; i >= 0; i--) {
        if (dead || done.current) return;
        setLine(s.slice(0, i));
        await wait(sp);
      }
    };

    (async () => {
      await wait(240);
      if (dead || done.current) return;
      setSkippable(true);
      await type(WHISPER[0], 26);
      await wait(620);
      await erase(WHISPER[0], 10);
      await wait(170);
      await type(WHISPER[1], 26);
    })();

    return () => { dead = true; };
  }, []);

  /* skip on any click or key, once the copy has had a moment to appear */
  useEffect(() => {
    if (!skippable) return;
    const key = (e) => {
      if (e.key === "Tab") return;             // tabbing away is not skipping
      finish();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [skippable, finish]);

  if (reduced()) return null;

  return (
    <div ref={root} className={`intro ${gone ? "gone" : ""} ${skippable ? "can-skip" : ""}`}
      onClick={finish} role="presentation">
      <div className="deck" ref={deck}>
        {Array.from({ length: CARDS }, (_, i) => (
          <div key={i} className="card card-back card-back-n" />
        ))}

        {/* the hero card: two faces on one turning plane */}
        <div className="flip" ref={flip}>
          <div className="card card-back" />
          <div className="card card-face">
            <KingFace />
            <span className="card-sheen" ref={sheen} />
          </div>
        </div>
      </div>

      <div className="whisper">
        <p aria-live="polite">{line}<i /></p>
      </div>

      <button className="intro-skip" onClick={finish}>Skip</button>
    </div>
  );
}
