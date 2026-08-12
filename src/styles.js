/* ===========================================================================
   RUMOAR — the stylesheet

   Injected once at runtime from a template string rather than imported as a
   .css file. Same reason the research site did it: the tokens and the
   components that consume them stay in one codebase with no build-order
   question, and there is exactly one place to look for a colour.

   Scoped under `.ru` throughout, so nothing here can leak into an embed.
   =========================================================================== */
export const CSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   §1  TOKENS
   Carried from the research site. The red is the brand; it is not up for
   redesign. Light is the default — the store is looked at in daylight, on a
   phone, usually one-handed — and night is a deliberate act performed with a
   physical lamp rather than a system preference.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru{
  /* TYPE — two families on a contrast axis, not two neighbouring sans faces.
     Archivo carries every piece of interface; Bodoni carries the moments
     where the brand speaks in its own voice. */
  --font-body:'Archivo','Inter',-apple-system,system-ui,sans-serif;
  --font-display:'Bodoni Moda',Didot,Georgia,serif;

  --paper:#FFFFFF; --paper-2:#FAFAFB; --paper-3:#F2F2F5;
  --ink:#0B0B0D;                       /* 19.6:1 on paper                  */
  --ink-2:#44444D;                     /* 9.4:1  — body copy               */
  --ink-3:#6E6E79;                     /* 4.9:1  — the floor, still passes */
  --line:#E6E6EB; --line-2:#D3D3DA;
  --mark:#D8232F; --mark-deep:#A5121C; --mark-soft:#F4DBDD;
  --ok:#0A7D5A;

  /* z-index, named. Never a bare 9999 anywhere in this file. */
  --z-grain:1; --z-lamp:40; --z-nav:60; --z-scrim:80; --z-panel:90; --z-intro:120;

  --micro:170ms; --ui:380ms; --content:760ms; --cine:1300ms;
  --ez:cubic-bezier(.22,.68,.16,1);
  --ez-out:cubic-bezier(.16,1,.3,1);   /* quint-out — no bounce, no elastic */

  --gut:clamp(14px,1.8vw,26px);
  --marg:clamp(22px,5vw,84px);
  --rad:12px;                          /* cards top out here. Never 24+.    */

  color-scheme:light;
  font-family:var(--font-body);
  color:var(--ink);background:var(--paper);
  transition:background 700ms var(--ez),color 700ms var(--ez);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  scrollbar-gutter:stable;
  position:relative;overflow-x:clip;
}

/* NIGHT — the lamp is off. Not a system toggle: an act. */
.ru.night{
  --paper:#0A0A0E; --paper-2:#101015; --paper-3:#17171E;
  --ink:#F4F3F1;                       /* 17.8:1 on the night ground       */
  --ink-2:#B8B7BE;                     /* 9.1:1                            */
  --ink-3:#8A8A95;                     /* 5.0:1 — still passes at night    */
  --line:#22222A; --line-2:#31313B;
  --mark:#FF3B47; --mark-deep:#FF6B74; --mark-soft:#3A1216;
  --ok:#35C79A;
  color-scheme:dark;
}

.ru *,.ru *::before,.ru *::after{box-sizing:border-box}
.ru p{margin:0}
.ru h1,.ru h2,.ru h3,.ru h4{margin:0;font-weight:700;line-height:1.02}
.ru button{font-family:inherit;border:0;background:none;color:inherit;cursor:pointer;padding:0}
.ru a{color:inherit;text-decoration:none}
.ru img,.ru video,.ru canvas,.ru svg{display:block}
.ru input,.ru select,.ru textarea{font-family:inherit;font-size:1rem;color:inherit}
.ru :focus-visible{outline:2px solid var(--mark);outline-offset:3px;border-radius:3px}

/* Selection has to invert against whatever sits under it. Hard-coding white
   text here is the bug that makes every selected word vanish at night. */
.ru ::selection{background:var(--ink);color:var(--paper)}
.ru ::-moz-selection{background:var(--ink);color:var(--paper)}
/* the intro is dark in BOTH light levels, so it always takes the night rule */
.ru .intro ::selection{background:#F4F3F1;color:#0A0A0E}

.ru .grain{position:fixed;inset:0;z-index:var(--z-grain);pointer-events:none;
  opacity:.028;mix-blend-mode:multiply;background-size:128px 128px}
.ru.night .grain{opacity:.05;mix-blend-mode:screen}

/* ═══════════════════════════════════════════════════════════════════════════
   §2  TYPE SCALE
   Display tracking bottoms out at -.03em. Tighter than that and the letters
   touch, which reads as cramped rather than designed. The hero ceiling is
   5.4rem — above ~6rem a page is shouting, not typesetting.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .mega{font-size:clamp(2.4rem,6.4vw,5.4rem);line-height:.94;letter-spacing:-.03em;
  font-weight:700;text-wrap:balance;overflow-wrap:break-word}
.ru .big{font-size:clamp(1.85rem,4vw,3.4rem);line-height:1;letter-spacing:-.028em;
  font-weight:700;text-wrap:balance;overflow-wrap:break-word}
.ru .mid{font-size:clamp(1.25rem,2.1vw,1.9rem);line-height:1.14;letter-spacing:-.022em;
  font-weight:700;text-wrap:balance}
.ru .h3{font-size:clamp(1rem,1.2vw,1.16rem);font-weight:700;letter-spacing:-.015em;line-height:1.3}
.ru .body{font-size:clamp(.95rem,1vw,1.04rem);line-height:1.62;color:var(--ink-2);
  font-weight:500;max-width:68ch;text-wrap:pretty}
.ru .lede{font-size:clamp(1.02rem,1.2vw,1.2rem);line-height:1.54;color:var(--ink-2);
  font-weight:500;max-width:56ch;text-wrap:pretty}
.ru .serif{font-family:var(--font-display);font-weight:400;letter-spacing:0}
.ru .it{font-style:italic}
.ru .mk{color:var(--mark)}
.ru .num{font-variant-numeric:tabular-nums lining-nums}

/* The label. One deliberate system mark, used on section openers only —
   never stacked above every heading on the page. */
.ru .lb{font-family:var(--font-body);font-size:.7rem;letter-spacing:.18em;
  text-transform:uppercase;color:var(--ink-3);font-weight:700}

/* ═══════════════════════════════════════════════════════════════════════════
   §3  LAYOUT
   The margin floor is generous on purpose: the research site ran its columns
   to within 14px of a fixed edge rail and every line looked clipped.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .wrap{width:100%;padding-inline:var(--marg);margin-inline:auto;max-width:1680px}
.ru .g{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gut)}
@media(max-width:900px){.ru .g{grid-template-columns:repeat(6,1fr)}}
@media(max-width:560px){.ru .g{grid-template-columns:repeat(2,1fr)}}
.ru .sec{padding-block:clamp(64px,10vw,148px)}
.ru .sec-tight{padding-block:clamp(44px,6vw,88px)}
.ru .rule{height:1px;background:var(--line);border:0;margin:0}

/* REVEAL.
   The hidden state lives on .rv.armed, not on .rv. JavaScript adds the
   'armed' class on mount, so the hidden state only ever exists in a browser
   that is
   actually running the observer that will later clear it. Without JS — a
   crawler, a reader mode, a renderer that never fires IntersectionObserver —
   the element is simply visible, which is the whole point: a reveal is an
   enhancement on top of readable content, never the thing that makes content
   readable. */
.ru .rv{transition:opacity var(--content) var(--ez-out),transform var(--content) var(--ez-out)}
.ru .rv.armed{opacity:0;transform:translateY(20px)}
.ru .rv.armed.in{opacity:1;transform:none}

.ru .lines .lm>span{transition:transform var(--cine) var(--ez-out)}

.ru .lines .lm{display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
.ru .lines .lm>span{display:block}
.ru .lines.armed .lm>span{transform:translateY(105%)}
.ru .lines.armed.in .lm>span{transform:none}

/* ═══════════════════════════════════════════════════════════════════════════
   §4  CONTROLS
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-size:.76rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  padding:16px 30px;border-radius:100px;white-space:nowrap;
  transition:background var(--ui) var(--ez),color var(--ui) var(--ez),
             border-color var(--ui) var(--ez),opacity var(--ui) var(--ez)}
.ru .btn-solid{background:var(--ink);color:var(--paper)}
.ru .btn-solid:hover{background:var(--mark)}
.ru .btn-mark{background:var(--mark);color:#fff}
.ru .btn-mark:hover{background:var(--mark-deep)}
.ru .btn-line{border:1px solid var(--line-2);color:var(--ink)}
.ru .btn-line:hover{border-color:var(--ink);background:var(--ink);color:var(--paper)}
.ru .btn[disabled]{opacity:.4;cursor:not-allowed}
.ru .btn-sm{padding:11px 20px;font-size:.68rem}
.ru .btn-full{width:100%}
.ru .mag{display:inline-flex;will-change:transform}
.ru .mag-l{display:inline-flex;align-items:center;gap:10px;will-change:transform}

.ru .link{position:relative;font-weight:600;padding-bottom:2px}
.ru .link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:right;
  transition:transform var(--ui) var(--ez)}
.ru .link:hover::after{transform:scaleX(1);transform-origin:left}

.ru .tag{display:inline-flex;align-items:center;padding:6px 11px;border-radius:100px;
  background:var(--paper-3);color:var(--ink-2);font-size:.65rem;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase}

/* ═══════════════════════════════════════════════════════════════════════════
   §5  THE INTRO — the deck
   Dark in both light levels. The deck shuffles; the whisper types underneath
   at the same time; the King of Hearts resolves out of the shuffle.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .intro{position:fixed;inset:0;z-index:var(--z-intro);background:#08080C;
  display:grid;grid-template-rows:1fr auto;place-items:center;overflow:hidden;
  transition:opacity 900ms var(--ez),visibility 900ms}
.ru .intro.gone{opacity:0;visibility:hidden;pointer-events:none}

/* the felt: a single soft pool of light on a dark table, nothing more */
.ru .intro::before{content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse 62% 52% at 50% 42%,rgba(216,35,47,.16),transparent 70%)}
.ru .intro::after{content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse 40% 34% at 50% 40%,rgba(255,255,255,.07),transparent 72%)}

.ru .deck{position:relative;z-index:2;width:min(64vw,290px);aspect-ratio:5/7;
  perspective:1400px;transform:translateY(-2vh)}
.ru .card{position:absolute;inset:0;border-radius:14px;backface-visibility:hidden;
  transform-style:preserve-3d;will-change:transform,opacity;
  box-shadow:0 18px 40px rgba(0,0,0,.5)}

/* card backs — the deck being shuffled */
.ru .card-back{background:
  repeating-linear-gradient(45deg,rgba(255,255,255,.055) 0 6px,transparent 6px 12px),
  linear-gradient(160deg,var(--mark-deep),#7C0C14 62%,#5E070E);
  border:1px solid rgba(255,255,255,.16)}
.ru .card-back::after{content:"R";position:absolute;inset:0;display:grid;place-items:center;
  font-family:var(--font-display);font-size:2.6rem;font-weight:700;font-style:italic;
  color:rgba(255,255,255,.2)}

/* the hero card: two faces on one turning plane. The container is what
   rotates; each face hides its own back, so at 180° the back is gone and the
   face is present without anything crossfading. */
.ru .flip{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}
.ru .flip .card-face{transform:rotateY(180deg)}

/* the face — the King */
.ru .card-face{background:#FCFBF9;border:1px solid rgba(0,0,0,.14);overflow:hidden}
.ru .card-face svg{width:100%;height:100%}

/* the sheen that travels the face once it lands */
.ru .card-sheen{position:absolute;inset:0;border-radius:14px;pointer-events:none;
  background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.55) 50%,transparent 62%);
  opacity:0;mix-blend-mode:overlay}

/* the whisper, running underneath the whole time */
.ru .whisper{position:relative;z-index:3;text-align:center;padding:0 6vw
  calc(env(safe-area-inset-bottom,0px) + clamp(52px,9vh,96px));
  min-height:5.2em;display:flex;flex-direction:column;justify-content:flex-end;gap:14px}
.ru .whisper p{font-family:var(--font-display);color:#F4F3F1;font-weight:400;
  font-size:clamp(1.02rem,2.7vw,1.72rem);line-height:1.45;letter-spacing:.004em;
  min-height:1.45em;text-wrap:balance}
.ru .whisper i{display:inline-block;width:2px;height:.92em;background:var(--mark);
  margin-left:5px;vertical-align:-.1em;animation:blink 1s steps(2) infinite}
@keyframes blink{50%{opacity:0}}

.ru .intro-skip{position:absolute;z-index:4;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);
  left:50%;transform:translateX(-50%);font-size:.62rem;font-weight:700;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(244,243,241,.5);padding:10px 16px;
  opacity:0;transition:opacity 600ms var(--ez)}
.ru .intro.can-skip .intro-skip{opacity:1}
.ru .intro-skip:hover{color:#F4F3F1}

/* ═══════════════════════════════════════════════════════════════════════════
   §6  NAV
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .nav{position:fixed;top:0;left:0;right:0;z-index:var(--z-nav);
  background:var(--paper);border-bottom:1px solid transparent;
  transition:border-color var(--ui) var(--ez),background var(--ui) var(--ez),
             transform var(--ui) var(--ez)}
.ru .nav.stuck{border-bottom-color:var(--line)}
.ru .nav.hide{transform:translateY(-100%)}
.ru .navin{display:flex;align-items:center;gap:clamp(14px,2.4vw,34px);
  height:clamp(60px,7vh,74px);padding-inline:var(--marg)}
.ru .wordmark{font-family:var(--font-body);font-weight:700;font-size:1.06rem;
  letter-spacing:.16em;margin-right:auto}
.ru .wordmark b{color:var(--mark);font-weight:700}
.ru .navlinks{display:flex;gap:clamp(12px,1.8vw,26px);align-items:center}
.ru .navlink{font-size:.74rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ink-2);transition:color var(--micro) var(--ez)}
.ru .navlink:hover,.ru .navlink.on{color:var(--ink)}
.ru .navlink.on{color:var(--mark)}
@media(max-width:820px){.ru .navlinks{display:none}}

.ru .cartbtn{position:relative;display:flex;align-items:center;gap:9px;
  padding:10px 17px;border-radius:100px;border:1px solid var(--line-2);
  font-size:.7rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
  transition:border-color var(--micro) var(--ez),background var(--micro) var(--ez)}
.ru .cartbtn:hover{border-color:var(--ink)}
.ru .cartbtn .cnt{display:grid;place-items:center;min-width:20px;height:20px;padding:0 6px;
  border-radius:100px;background:var(--mark);color:#fff;font-size:.66rem;line-height:1}
.ru .cartbtn.bump{animation:bump 460ms var(--ez-out)}
@keyframes bump{0%{transform:none}32%{transform:scale(1.13)}100%{transform:none}}

.ru .menubtn{display:none;width:40px;height:40px;place-items:center;border-radius:100px;
  border:1px solid var(--line-2)}
@media(max-width:820px){.ru .menubtn{display:grid}}
.ru .menubtn i{display:block;width:16px;height:1.5px;background:currentColor;position:relative}
.ru .menubtn i::before,.ru .menubtn i::after{content:"";position:absolute;left:0;
  width:16px;height:1.5px;background:currentColor}
.ru .menubtn i::before{top:-5px}.ru .menubtn i::after{top:5px}

/* mobile sheet */
.ru .msheet{position:fixed;inset:0;z-index:var(--z-panel);background:var(--paper);
  display:flex;flex-direction:column;padding:var(--marg);gap:6px;
  transform:translateY(-100%);transition:transform var(--ui) var(--ez-out)}
.ru .msheet.open{transform:none}
.ru .msheet a,.ru .msheet button{text-align:left;padding:16px 0;font-size:1.5rem;
  font-weight:700;letter-spacing:-.02em;border-bottom:1px solid var(--line)}

/* ═══════════════════════════════════════════════════════════════════════════
   §7  HERO
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .hero{padding-top:clamp(96px,15vh,168px);padding-bottom:clamp(46px,7vh,84px)}
.ru .hero-t{grid-column:1/9}
@media(max-width:900px){.ru .hero-t{grid-column:1/-1}}
.ru .hero .lede{margin-top:clamp(20px,3vh,30px)}
.ru .hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:clamp(26px,4vh,42px)}
.ru .hero-side{grid-column:10/13;align-self:end;display:flex;flex-direction:column;gap:18px}
@media(max-width:900px){.ru .hero-side{grid-column:1/-1;margin-top:34px}}
.ru .hero-side dl{display:grid;gap:14px;margin:0}
.ru .hero-side div{display:flex;justify-content:space-between;gap:16px;
  padding-bottom:12px;border-bottom:1px solid var(--line)}
.ru .hero-side dt{font-size:.72rem;font-weight:700;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink-3)}
.ru .hero-side dd{margin:0;font-size:.82rem;font-weight:700;text-align:right}

/* the four words, running the width of the page */
.ru .creedbar{border-block:1px solid var(--line);overflow:hidden;padding-block:15px}
.ru .creedtrack{display:flex;gap:0;width:max-content;
  animation:slide 44s linear infinite;will-change:transform}
.ru .creedtrack span{font-family:var(--font-display);font-size:clamp(.95rem,1.5vw,1.3rem);
  font-style:italic;color:var(--ink-3);padding-inline:clamp(18px,2.4vw,38px);white-space:nowrap}
.ru .creedtrack span::after{content:"·";margin-left:clamp(18px,2.4vw,38px);color:var(--mark)}
@keyframes slide{to{transform:translateX(-50%)}}
.ru .creedbar:hover .creedtrack{animation-play-state:paused}

/* ═══════════════════════════════════════════════════════════════════════════
   §8  PRODUCT PLATE & GRID
   The grid is deliberately not six identical tiles: the first piece on the
   shop index runs double-width, which is what makes it read as a considered
   window rather than a search result page.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(258px,1fr));
  gap:clamp(18px,2.4vw,38px) var(--gut)}
.ru .grid.feature>*:first-child{grid-column:span 2}
@media(max-width:700px){.ru .grid.feature>*:first-child{grid-column:span 1}}

.ru .pcard{position:relative;display:flex;flex-direction:column;gap:14px;text-align:left}
.ru .plate{position:relative;width:100%;aspect-ratio:4/5;border-radius:var(--rad);
  overflow:hidden;background:var(--paper-3);
  transition:background var(--ui) var(--ez)}
.ru .grid.feature>*:first-child .plate{aspect-ratio:8/5}
@media(max-width:700px){.ru .grid.feature>*:first-child .plate{aspect-ratio:4/5}}
.ru .plate img{width:100%;height:100%;object-fit:cover}
.ru .pcard:hover .plate{background:var(--mark-soft)}

/* the designed empty state — a plate with no photograph is still composed */
.ru .plate-e{position:absolute;inset:0;display:flex;flex-direction:column;
  justify-content:space-between;padding:clamp(16px,2.2vw,26px)}
.ru .plate-n{font-family:var(--font-display);font-size:clamp(3.4rem,9vw,6.2rem);
  line-height:.8;color:var(--ink);opacity:.09;font-weight:700;letter-spacing:-.02em;
  transition:opacity var(--ui) var(--ez),color var(--ui) var(--ez)}
.ru .pcard:hover .plate-n{opacity:.2;color:var(--mark)}
.ru .plate-m{font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:var(--ink-3);max-width:22ch;line-height:1.5}
.ru .plate-glyph{position:absolute;top:50%;left:50%;width:44%;
  transform:translate(-50%,-50%);opacity:.16;
  transition:opacity var(--ui) var(--ez),transform var(--cine) var(--ez-out)}
.ru .pcard:hover .plate-glyph{opacity:.3;transform:translate(-50%,-50%) rotate(-4deg)}
.ru .plate-glyph path,.ru .plate-glyph circle{stroke:var(--ink);fill:none;
  stroke-width:1.4;vector-effect:non-scaling-stroke}

.ru .phead{display:flex;justify-content:space-between;align-items:baseline;gap:14px}
.ru .pname{font-size:1.02rem;font-weight:700;letter-spacing:-.015em}
.ru .pprice{font-size:.95rem;font-weight:700;white-space:nowrap}
.ru .pwas{font-size:.8rem;color:var(--ink-3);text-decoration:line-through;margin-right:7px;
  font-weight:600}
.ru .pline{font-size:.72rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--ink-3)}
.ru .pblurb{font-size:.88rem;line-height:1.55;color:var(--ink-2);font-weight:500;max-width:44ch}

/* the quick-add, revealed on the plate.
   BUG WAS HERE: this was absolute against .pcard, which is the whole card —
   plate AND the name/price/blurb underneath it. So "bottom:12px" put the
   button over the last line of body copy instead of over the photograph.
   It is now positioned against .pshot, a wrapper that contains only the
   plate. */
.ru .pshot{position:relative;display:block}
.ru .quick{position:absolute;left:12px;right:12px;bottom:12px;opacity:0;
  transform:translateY(9px);transition:opacity var(--ui) var(--ez),transform var(--ui) var(--ez-out)}
.ru .pcard:hover .quick,.ru .pcard:focus-within .quick{opacity:1;transform:none}
@media(pointer:coarse){.ru .quick{opacity:1;transform:none}}
.ru .quick button{width:100%;background:var(--ink);color:var(--paper);
  padding:13px;border-radius:100px;font-size:.68rem;font-weight:700;letter-spacing:.13em;
  text-transform:uppercase;transition:background var(--micro) var(--ez)}
.ru .quick button:hover{background:var(--mark)}

/* ═══════════════════════════════════════════════════════════════════════════
   §9  FILTERS
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ru .fbtn{padding:10px 18px;border-radius:100px;border:1px solid var(--line);
  font-size:.7rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
  color:var(--ink-2);transition:all var(--micro) var(--ez)}
.ru .fbtn:hover{border-color:var(--ink-3);color:var(--ink)}
.ru .fbtn.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}

/* ═══════════════════════════════════════════════════════════════════════════
   §10  PRODUCT DETAIL
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .pdp{padding-top:clamp(92px,13vh,140px)}
.ru .pdp-media{grid-column:1/7}
.ru .pdp-info{grid-column:8/13;position:sticky;top:clamp(88px,12vh,116px);align-self:start}
@media(max-width:900px){
  .ru .pdp-media,.ru .pdp-info{grid-column:1/-1}
  .ru .pdp-info{position:static}
}
.ru .pdp-media .plate{aspect-ratio:4/5;border-radius:var(--rad)}
.ru .pdp-price{display:flex;align-items:baseline;gap:12px;margin-top:14px}
.ru .pdp-price b{font-size:1.5rem;font-weight:700}
.ru .swatches{display:flex;gap:10px;flex-wrap:wrap}
.ru .sw{width:38px;height:38px;border-radius:100px;border:1px solid var(--line-2);
  position:relative;transition:transform var(--micro) var(--ez)}
.ru .sw::after{content:"";position:absolute;inset:-4px;border-radius:100px;
  border:1.5px solid transparent;transition:border-color var(--micro) var(--ez)}
.ru .sw:hover{transform:scale(1.06)}
.ru .sw.on::after{border-color:var(--ink)}
.ru .qty{display:inline-flex;align-items:center;border:1px solid var(--line-2);
  border-radius:100px;overflow:hidden}
.ru .qty button{width:42px;height:46px;font-size:1.05rem;font-weight:700;
  transition:background var(--micro) var(--ez)}
.ru .qty button:hover{background:var(--paper-3)}
.ru .qty span{min-width:34px;text-align:center;font-weight:700;font-size:.95rem}
.ru .stock{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;
  font-weight:700;color:var(--ink-2)}
.ru .stock i{width:7px;height:7px;border-radius:100px;background:var(--ok);flex:0 0 auto}
.ru .stock.low i{background:var(--mark)}

/* the spec table — a table, because it is tabular data */
.ru .spec{width:100%;border-collapse:collapse;margin-top:6px}
.ru .spec th,.ru .spec td{text-align:left;padding:13px 0;border-bottom:1px solid var(--line);
  font-size:.87rem;vertical-align:top}
.ru .spec th{font-weight:700;color:var(--ink-3);width:42%;font-size:.72rem;
  letter-spacing:.11em;text-transform:uppercase;padding-right:16px}
.ru .spec td{font-weight:600;color:var(--ink)}

/* accordion */
.ru .acc{border-top:1px solid var(--line)}
.ru .acc:last-of-type{border-bottom:1px solid var(--line)}
.ru .acc summary{display:flex;justify-content:space-between;align-items:center;gap:16px;
  padding:19px 0;cursor:pointer;font-size:.86rem;font-weight:700;list-style:none}
.ru .acc summary::-webkit-details-marker{display:none}
.ru .acc summary i{position:relative;width:13px;height:13px;flex:0 0 auto}
.ru .acc summary i::before,.ru .acc summary i::after{content:"";position:absolute;
  background:currentColor;transition:transform var(--ui) var(--ez)}
.ru .acc summary i::before{left:0;top:6px;width:13px;height:1.5px}
.ru .acc summary i::after{left:6px;top:0;width:1.5px;height:13px}
.ru .acc[open] summary i::after{transform:scaleY(0)}
.ru .acc-body{padding-bottom:22px}

/* ═══════════════════════════════════════════════════════════════════════════
   §11  CART & PANELS
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .scrim{position:fixed;inset:0;z-index:var(--z-scrim);background:rgba(6,6,10,.42);
  opacity:0;transition:opacity var(--ui) var(--ez);backdrop-filter:blur(2px)}
.ru .scrim.open{opacity:1}

.ru .panel{position:fixed;top:0;right:0;bottom:0;z-index:var(--z-panel);
  width:min(94vw,442px);background:var(--paper);display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform var(--ui) var(--ez-out);
  box-shadow:-16px 0 44px rgba(0,0,0,.14)}
.ru .panel.open{transform:none}
.ru .panel-h{display:flex;align-items:center;justify-content:space-between;gap:16px;
  padding:22px var(--gut) 18px;border-bottom:1px solid var(--line)}
.ru .panel-b{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:var(--gut)}
.ru .panel-f{border-top:1px solid var(--line);padding:var(--gut);display:grid;gap:13px}
.ru .x{width:38px;height:38px;display:grid;place-items:center;border-radius:100px;
  border:1px solid var(--line);transition:background var(--micro) var(--ez)}
.ru .x:hover{background:var(--paper-3)}

.ru .li{display:grid;grid-template-columns:74px 1fr;gap:15px;padding-block:17px;
  border-bottom:1px solid var(--line)}
.ru .li:last-child{border-bottom:0}
.ru .li-p{aspect-ratio:4/5;border-radius:8px;background:var(--paper-3);overflow:hidden;
  display:grid;place-items:center}
.ru .li-p img{width:100%;height:100%;object-fit:cover}
.ru .li-p b{font-family:var(--font-display);font-size:1.35rem;color:var(--ink);opacity:.24}
.ru .li-n{font-size:.9rem;font-weight:700;line-height:1.28}
.ru .li-m{font-size:.74rem;color:var(--ink-3);font-weight:600;margin-top:3px}
.ru .li-r{display:flex;justify-content:space-between;align-items:center;margin-top:11px;gap:12px}
.ru .li-x{font-size:.72rem;font-weight:700;color:var(--ink-3);letter-spacing:.06em}
.ru .li-x:hover{color:var(--mark)}

.ru .tot{display:flex;justify-content:space-between;font-size:.88rem;font-weight:600;
  color:var(--ink-2)}
.ru .tot.grand{font-size:1.12rem;font-weight:700;color:var(--ink);
  padding-top:13px;border-top:1px solid var(--line)}

.ru .empty{display:grid;place-items:center;gap:16px;text-align:center;
  padding:clamp(40px,9vh,80px) 10px;color:var(--ink-3)}

/* ═══════════════════════════════════════════════════════════════════════════
   §12  CHECKOUT
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .co{padding-top:clamp(92px,13vh,140px)}
.ru .co-form{grid-column:1/8}
.ru .co-sum{grid-column:9/13;position:sticky;top:clamp(88px,12vh,116px);align-self:start;
  background:var(--paper-2);border:1px solid var(--line);border-radius:var(--rad);
  padding:clamp(18px,2.4vw,28px)}
@media(max-width:900px){
  .ru .co-form,.ru .co-sum{grid-column:1/-1}
  .ru .co-sum{position:static;margin-top:30px}
}
.ru .field{display:grid;gap:7px;margin-bottom:17px}
.ru .field label{font-size:.72rem;font-weight:700;letter-spacing:.11em;
  text-transform:uppercase;color:var(--ink-2)}
.ru .field input,.ru .field select{width:100%;padding:14px 15px;border-radius:9px;
  border:1px solid var(--line-2);background:var(--paper);
  transition:border-color var(--micro) var(--ez)}
.ru .field input::placeholder{color:var(--ink-3)}
.ru .field input:focus{border-color:var(--ink);outline:none}
.ru .field.bad input,.ru .field.bad select{border-color:var(--mark)}
.ru .err{font-size:.75rem;font-weight:600;color:var(--mark)}
.ru .row2{display:grid;grid-template-columns:1fr 1fr;gap:var(--gut)}
@media(max-width:560px){.ru .row2{grid-template-columns:1fr}}

.ru .paybox{border:1px solid var(--line);border-radius:var(--rad);overflow:hidden}
.ru .payopt{display:flex;align-items:center;gap:13px;padding:16px 17px;cursor:pointer;
  border-bottom:1px solid var(--line);transition:background var(--micro) var(--ez)}
.ru .payopt:last-child{border-bottom:0}
.ru .payopt:hover{background:var(--paper-2)}
.ru .payopt input{accent-color:var(--mark);width:17px;height:17px;flex:0 0 auto}
.ru .payopt b{font-size:.88rem;font-weight:700}
.ru .payopt span{font-size:.76rem;color:var(--ink-3);font-weight:600;display:block;margin-top:2px}

/* ═══════════════════════════════════════════════════════════════════════════
   §13  EDITORIAL
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .quote{padding-block:clamp(64px,11vw,150px);text-align:center}
.ru .quote p{font-family:var(--font-display);font-weight:400;font-style:italic;
  font-size:clamp(1.55rem,4.4vw,3.1rem);line-height:1.24;letter-spacing:-.01em;
  max-width:20ch;margin-inline:auto;text-wrap:balance}

/* the thread — nine pieces, one line that visits every one of them */
.ru .thread{width:100%;max-width:420px}
.ru .thread path{fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}
.ru .th-core{stroke:var(--mark);stroke-width:2}
.ru .th-shade{stroke:var(--ink);stroke-width:2;opacity:.13}
.ru .th-node{fill:var(--paper);stroke:var(--ink);stroke-width:1.5}
.ru .threadcap{font-size:.68rem;font-weight:700;letter-spacing:.19em;text-transform:uppercase;
  color:var(--ink-3);margin-top:18px;text-align:center}

.ru .promises{display:grid;grid-template-columns:repeat(auto-fit,minmax(228px,1fr));
  gap:clamp(22px,3vw,44px)}
.ru .promise h3{font-size:.95rem;font-weight:700;margin-bottom:9px}
.ru .promise p{font-size:.84rem;line-height:1.55;color:var(--ink-2);font-weight:500}

/* ═══════════════════════════════════════════════════════════════════════════
   §14  FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .foot{border-top:1px solid var(--line);padding-block:clamp(46px,7vw,84px)}
.ru .foot-g{display:grid;grid-template-columns:1.6fr 1fr 1fr 1.4fr;gap:clamp(24px,3vw,48px)}
@media(max-width:820px){.ru .foot-g{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.ru .foot-g{grid-template-columns:1fr}}
.ru .foot h4{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink-3);margin-bottom:15px}
.ru .foot ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.ru .foot li a,.ru .foot li button{font-size:.86rem;font-weight:600;color:var(--ink-2);
  transition:color var(--micro) var(--ez)}
.ru .foot li a:hover,.ru .foot li button:hover{color:var(--mark)}
.ru .sub{display:flex;gap:8px;margin-top:12px}
.ru .sub input{flex:1;min-width:0;padding:13px 15px;border-radius:100px;
  border:1px solid var(--line-2);background:var(--paper)}
.ru .sub input:focus{border-color:var(--ink);outline:none}
.ru .foot-b{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  margin-top:clamp(34px,5vw,62px);padding-top:22px;border-top:1px solid var(--line);
  font-size:.74rem;color:var(--ink-3);font-weight:600}

/* ═══════════════════════════════════════════════════════════════════════════
   §15  THE LAMP
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .lamp{position:fixed;top:0;right:clamp(16px,4vw,58px);z-index:var(--z-lamp);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;color:var(--ink)}
.ru .lamp .cord{width:1px;height:clamp(28px,5vh,52px);background:var(--line-2)}
.ru .lamp .fix{position:relative;width:52px;color:var(--ink);opacity:.5;
  transition:opacity var(--ui) var(--ez)}
.ru.night .lamp .fix{opacity:.82}
.ru .lamp .bulb{fill:var(--line-2);transition:fill 700ms var(--ez)}
.ru.night .lamp .bulb{fill:#FFD9A0}
.ru .lamp .beam{position:absolute;top:64%;left:50%;width:190px;height:230px;
  transform:translateX(-50%);pointer-events:none;opacity:0;
  background:radial-gradient(ellipse 50% 60% at 50% 0%,rgba(255,200,130,.2),transparent 70%);
  transition:opacity 900ms var(--ez)}
.ru.night .lamp .beam{opacity:1}
.ru .lamp .pull{pointer-events:auto;display:grid;place-items:center;padding:8px 14px 16px}
.ru .lamp .pull i{display:block;width:1px;height:clamp(20px,3.4vh,34px);background:var(--line-2)}
.ru .lamp .pull b{display:block;width:9px;height:9px;border-radius:100px;background:var(--ink-3);
  margin-top:-1px;transition:transform var(--micro) var(--ez),background var(--micro) var(--ez)}
.ru .lamp .pull:hover b{transform:translateY(3px);background:var(--mark)}
@media(max-width:700px){.ru .lamp{display:none}}

/* ═══════════════════════════════════════════════════════════════════════════
   §16  TOAST
   ═══════════════════════════════════════════════════════════════════════════ */
/* BUG WAS HERE: the resting position was translateY(120%) — 120% of the
   toast's OWN height. An empty toast is about 40px tall, so "off screen"
   moved it 48px down and left a small black pill parked over the bottom of
   every page. It now also fades and is taken out of the accessibility tree
   and hit-testing when it has nothing to say. */
.ru .toast{position:fixed;left:50%;bottom:26px;z-index:var(--z-panel);
  transform:translate(-50%,calc(100% + 40px));opacity:0;visibility:hidden;
  background:var(--ink);color:var(--paper);
  padding:14px 24px;border-radius:100px;font-size:.8rem;font-weight:700;
  display:flex;align-items:center;gap:11px;white-space:nowrap;max-width:92vw;
  pointer-events:none;
  transition:transform var(--ui) var(--ez-out),opacity var(--ui) var(--ez),
             visibility var(--ui);
  box-shadow:0 12px 32px rgba(0,0,0,.22)}
.ru .toast.show{transform:translate(-50%,0);opacity:1;visibility:visible;
  pointer-events:auto}

.ru .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
  clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* the keyboard entry point */
.ru .skip{position:fixed;top:9px;left:9px;z-index:var(--z-intro);padding:12px 19px;
  border-radius:100px;background:var(--ink);color:var(--paper);font-size:.68rem;
  font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  transform:translateY(-180%);transition:transform var(--ui) var(--ez)}
.ru .skip:focus-visible{transform:none}

/* ═══════════════════════════════════════════════════════════════════════════
   §17  REDUCED MOTION
   Not a courtesy. Every animation above needs a resting state that is a
   crossfade or nothing at all — and every reveal has to end up visible even
   if its observer never fires.
   ═══════════════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion:reduce){
  .ru *,.ru *::before,.ru *::after{
    animation-duration:1ms!important;animation-iteration-count:1!important;
    transition-duration:130ms!important;scroll-behavior:auto!important}
  .ru .rv.armed{opacity:1;transform:none}
  .ru .lines.armed .lm>span{transform:none}
  .ru .creedtrack{animation:none}
  .ru .quick{opacity:1;transform:none}
  .ru .lamp .fix{transform:none!important}
}
`;
