import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { asset } from "./data.js";
import { Reveal, reduced, go, money } from "./lib.jsx";

/* ===========================================================================
   §1  THE GLYPHS

   One abstract mark per product line — a single continuous stroke that folds
   differently for each. They are not drawings of the objects: a line drawing
   of a wallet next to a photograph of a wallet would just be a worse
   photograph. They are the thread motif, knotted six ways, which is the
   brand's actual argument rendered as ornament.
   =========================================================================== */
const GLYPH = {
  Carry: "M20 62 C20 30 52 18 78 34 C104 50 90 84 60 84 C30 84 20 66 44 52 C68 38 96 52 96 76",
  Time: "M58 18 C88 18 104 44 96 68 C88 92 52 98 32 80 C12 62 22 28 52 24 M58 40 L58 62 L78 70",
  Wear: "M28 34 C56 14 96 30 96 58 C96 86 56 100 32 82 C8 64 22 38 52 44 C82 50 84 78 60 82",
  See: "M12 58 C34 26 86 26 108 58 C86 90 34 90 12 58 M60 42 C69 42 76 49 76 58 C76 67 69 74 60 74 C51 74 44 67 44 58 C44 49 51 42 60 42",
  Trace: "M60 96 C34 96 24 76 34 56 C42 40 60 34 60 16 C60 34 78 40 86 56 C96 76 86 96 60 96",
  All: "M20 58 C20 30 52 18 78 34 C104 50 90 84 60 84",
};

/* ===========================================================================
   §2  THE PLATE

   Renders the photograph when the manifest has one and a composed empty state
   when it does not. The empty state is deliberately designed — piece number,
   material, and the line's glyph — because a store with no photography still
   has to be presentable to a client. It is not a grey box with "image" in it.
   =========================================================================== */
export function Plate({ p, className = "", eager = false }) {
  const src = asset(p.img);
  return (
    <div className={`plate ${className}`}>
      {src ? (
        <img src={src} alt={p.name} loading={eager ? "eager" : "lazy"} decoding="async" />
      ) : (
        <>
          <svg className="plate-glyph" viewBox="0 0 120 110" aria-hidden="true">
            <path d={GLYPH[p.line] || GLYPH.All} />
          </svg>
          <div className="plate-e">
            <span className="plate-n num">{p.n}</span>
            <span className="plate-m">{p.material}</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ===========================================================================
   §3  THE PRODUCT CARD
   =========================================================================== */
export function ProductCard({ p, onAdd, delay = 0, eager = false }) {
  return (
    <Reveal delay={delay}>
      <article className="pcard">
        {/* the quick-add lives inside .pshot with the plate, so it lands over
            the photograph rather than over the blurb below it */}
        <div className="pshot">
          <a href={`#/piece/${p.id}`} aria-label={`${p.name} — ${money(p.price)}`}>
            <Plate p={p} eager={eager} />
          </a>
          <div className="quick">
            <button onClick={() => onAdd(p)}>Add — {money(p.price)}</button>
          </div>
        </div>
        <div>
          <p className="pline">{p.line}</p>
          <div className="phead" style={{ marginTop: 6 }}>
            <a href={`#/piece/${p.id}`}><h3 className="pname">{p.name}</h3></a>
            <p className="pprice num">
              {p.was ? <span className="pwas">{money(p.was)}</span> : null}
              {money(p.price)}
            </p>
          </div>
          <p className="pblurb" style={{ marginTop: 8 }}>{p.blurb}</p>
        </div>
      </article>
    </Reveal>
  );
}

/* ===========================================================================
   §4  THE THREAD

   Nine pieces, one line that visits every one of them. Carried over from the
   research site, where it was the single ornament worth keeping: it is the
   difference between a catalogue and a wardrobe, stated without a sentence.

   The line draws itself in on scroll, then a highlight travels it forever.
   =========================================================================== */
const NODES = [
  [26, 74], [62, 42], [104, 78], [146, 40], [188, 76],
  [228, 44], [266, 80], [306, 46], [344, 72],
];

/** Catmull-Rom through the nodes, converted to cubic béziers. A polyline
    through nine points reads as a chart; a smooth curve reads as a thread. */
function smooth(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6}` +
      ` ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6}` +
      ` ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function Thread({ label = "nine pieces · one unbroken thread" }) {
  const root = useRef(null);
  const d = smooth(NODES);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const core = el.querySelector(".th-core");
      const shade = el.querySelector(".th-shade");
      const nodes = el.querySelectorAll(".th-node");
      const len = core.getTotalLength();

      gsap.set([core, shade], { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(nodes, { scale: 0, transformOrigin: "center" });

      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        gsap.to([core, shade], { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.08 });
        gsap.to(nodes, { scale: 1, duration: 0.42, ease: "power3.out", stagger: 0.07, delay: 0.45 });
      }, { threshold: 0.3 });
      io.observe(el);
      return () => io.disconnect();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <figure ref={root} style={{ margin: 0 }}>
      <svg className="thread" viewBox="0 0 370 120" aria-hidden="true">
        <path className="th-shade" d={d} transform="translate(3,5)" />
        <path className="th-core" d={d} />
        {NODES.map(([x, y], i) => (
          <circle key={i} className="th-node" cx={x} cy={y} r="4.5" />
        ))}
      </svg>
      <figcaption className="threadcap">{label}</figcaption>
    </figure>
  );
}

/* ===========================================================================
   §5  THE TOAST
   Announced politely rather than assertively: adding to a cart is not an
   emergency, and an assertive live region interrupts a screen reader
   mid-sentence to say so.
   =========================================================================== */
export function Toast({ msg, onView }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!msg) { setShow(false); return; }
    setShow(true);
    const t = setTimeout(() => setShow(false), 3200);
    return () => clearTimeout(t);
  }, [msg]);

  /* The live region has to stay mounted for a screen reader to announce into
     it — mounting a region and filling it in the same tick is the classic way
     to get silence. The visible pill is what comes and goes. */
  return (
    <div className={`toast ${show && msg ? "show" : ""}`} role="status" aria-live="polite"
      aria-hidden={!msg}>
      <span>{msg}</span>
      {msg ? (
        <button className="link" style={{ color: "inherit", opacity: .75 }} onClick={onView}>
          View bag
        </button>
      ) : null}
    </div>
  );
}

/* ===========================================================================
   §6  SMALL SHARED BITS
   =========================================================================== */
export function Stock({ n }) {
  if (n <= 0) return <span className="stock low"><i />Sold out</span>;
  if (n <= 10) return <span className="stock low"><i />Only {n} left</span>;
  return <span className="stock"><i />In stock</span>;
}

export function Qty({ value, onChange, max = 99 }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(value - 1)} aria-label="Decrease quantity">−</button>
      <span className="num" aria-live="polite">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max} aria-label="Increase quantity">+</button>
    </div>
  );
}

export function Crumb({ trail }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 22 }}>
      <ol style={{ display: "flex", gap: 9, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
        {trail.map((t, i) => (
          <li key={i} style={{ display: "flex", gap: 9, alignItems: "center" }}>
            {t.to ? (
              <button className="lb" style={{ color: "var(--ink-3)" }}
                onClick={() => go(t.to)}>{t.label}</button>
            ) : <span className="lb" style={{ color: "var(--ink)" }}>{t.label}</span>}
            {i < trail.length - 1 ? <span className="lb" aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
