import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

/* ===========================================================================
   §1  THE FRAME LOOP
   One requestAnimationFrame for the whole application. Every component that
   needs per-frame work subscribes to this instead of starting its own loop —
   twelve components each calling rAF is twelve separate callbacks the browser
   has to schedule, and they drift out of phase with each other.
   =========================================================================== */
const subs = new Set();
let looping = false, prev = 0;

function tick(now) {
  const dt = Math.min((now - prev) / 1000, 0.05);   // cap: a backgrounded tab
  prev = now;                                       // must not resume with a
  for (const fn of subs) fn(dt);                    // multi-second delta
  if (subs.size) requestAnimationFrame(tick);
  else looping = false;
}

export function useFrame(cb) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const f = (dt) => ref.current(dt);
    subs.add(f);
    if (!looping) { looping = true; prev = performance.now(); requestAnimationFrame(tick); }
    return () => { subs.delete(f); };
  }, []);
}

/* ===========================================================================
   §2  MATH & ENVIRONMENT
   =========================================================================== */
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Frame-rate-independent easing. A plain `cur += (target-cur) * 0.1` moves
    twice as fast on a 120Hz screen as on a 60Hz one; this does not. */
export const damp = (cur, target, lambda, dt) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const money = (n) => "₹" + n.toLocaleString("en-IN");

/* ===========================================================================
   §3  SCROLL
   =========================================================================== */
/** Measures on resize only — never per frame, which would thrash layout —
    then drives `apply(p)` with a damped 0→1 progress every frame. */
export function useScene(ref, apply, lambda = 7) {
  const box = useRef({ top: 0, h: 0 });
  const v = useRef(0);
  const fn = useRef(apply);
  fn.current = apply;

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      box.current = { top: r.top + window.scrollY, h: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("load", measure);
    return () => { ro.disconnect(); window.removeEventListener("load", measure); };
  }, [ref]);

  useFrame((dt) => {
    const { top, h } = box.current;
    if (!h) return;
    const vh = window.innerHeight, y = window.scrollY;
    const target = clamp((y + vh - top) / (h + vh));
    v.current = reduced() ? target : damp(v.current, target, lambda, dt);
    fn.current(v.current, dt);
  });
}

export const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });

/* ===========================================================================
   §4  REVEAL PRIMITIVES

   IMPORTANT: every reveal here starts from a *visible* default and is only
   transformed once observed. Gating visibility on a class that a transition
   must add is the classic way to ship a blank page — transitions do not run
   in background tabs or headless renderers, so the content never appears.
   `.rv` therefore sets opacity and transform, and `.rv.in` clears them; if
   the observer never fires, a `@media (prefers-reduced-motion)` rule and the
   no-JS fallback both leave the content on screen.
   =========================================================================== */
export function Reveal({ children, delay = 0, className = "", style, as: T = "div" }) {
  const ref = useRef(null);
  const [seen, set] = useState(false);
  /* `armed` is what turns the hidden state on, and it is only ever set from
     inside a browser that has an IntersectionObserver to turn it off again.
     Setting it in the initialiser rather than in an effect means it is true
     on the very first client paint, so there is no flash of visible content
     before it hides. */
  const [armed, arm] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || typeof IntersectionObserver === "undefined") { set(true); return; }
    arm(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (set(true), io.disconnect()),
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    /* Failsafe. Some renderers resize to full height to capture a page and
       never dispatch the callback; printing does the same. Anything still
       unrevealed after this simply appears — worse animation, never a blank
       section. */
    const bail = setTimeout(() => set(true), 4000);
    return () => { io.disconnect(); clearTimeout(bail); };
  }, []);

  return (
    <T ref={ref} className={`rv ${armed ? "armed" : ""} ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </T>
  );
}

/** A headline that rises out of its own baseline, line by line. Each line
    lives in a mask with room underneath for descenders — without that padding
    the tails of g, y and p are sliced off by the overflow. */
export function Lines({ lines, className = "big", delay = 0, stagger = 90, style, as: T = "h2" }) {
  const ref = useRef(null);
  const [seen, set] = useState(false);
  const [armed, arm] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || typeof IntersectionObserver === "undefined") { set(true); return; }
    arm(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (set(true), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    const bail = setTimeout(() => set(true), 4000);
    return () => { io.disconnect(); clearTimeout(bail); };
  }, []);
  return (
    <T ref={ref} className={`${className} lines ${armed ? "armed" : ""} ${seen ? "in" : ""}`} style={style}>
      {lines.map((l, i) => (
        <span className="lm" key={i}>
          <span style={{
            transitionDelay: `${delay + i * stagger}ms`,
            color: l.dim ? "var(--ink-3)" : l.mark ? "var(--mark)" : undefined,
          }}>{l.t ?? l}</span>
        </span>
      ))}
    </T>
  );
}

/** A control that leans toward the cursor before you reach it. The label
    moves less than the shell, which is what reads as the surface having
    thickness. Desktop pointer only, and off entirely under reduced motion. */
export function Magnetic({ as: T = "button", strength = 0.3, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || window.matchMedia("(pointer:coarse)").matches) return;
    const label = el.querySelector(".mag-l");
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) * 1.5;
      if (dist > reach) return;
      const f = 1 - dist / reach;
      /* Hard cap. Whatever strength is passed, the control never leaves its
         own neighbourhood — a magnetic button that outruns the cursor is a
         bug, not a flourish. */
      const CAP = 22;
      const mx = gsap.utils.clamp(-CAP, CAP, dx * strength * f);
      const my = gsap.utils.clamp(-CAP, CAP, dy * strength * f);
      gsap.to(el, { x: mx, y: my, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      if (label) gsap.to(label, { x: mx * 0.4, y: my * 0.4, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    };
    const out = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
      if (label) gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    };
    window.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", out);
    return () => { window.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", out); };
  }, [strength]);
  return <T ref={ref} className={`mag ${className}`} {...rest}><span className="mag-l">{children}</span></T>;
}

/* ===========================================================================
   §5  FOCUS MANAGEMENT
   Any panel that covers the page has to take the keyboard with it. Without
   this, tabbing out of an open cart walks invisibly through the page behind
   it — the single most common accessibility failure in commerce UI.
   =========================================================================== */
export function useFocusTrap(active, ref, onClose) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const opener = document.activeElement;

    const focusables = () => el.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusables()[0];
    /* defer: the panel is mid-transition on the frame it mounts, and Safari
       refuses to focus an element it still considers invisible */
    const t = setTimeout(() => first?.focus(), 60);

    const key = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose?.(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", key);
      /* return the keyboard to whatever opened the panel, not to <body> */
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [active, ref, onClose]);
}

/** Locks the page behind an overlay without the layout shifting.
    Setting overflow:hidden removes the scrollbar, which widens the page by
    its width and makes everything jump left. Padding the gap back on is the
    fix. */
export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/* ===========================================================================
   §6  ROUTING
   A hash router in twenty lines. This site has six views and no server, so
   pulling in a routing library would be more configuration than code.
   Hash rather than history means it also works on a static host with no
   rewrite rules — open dist/index.html from a file:// path and it still runs.
   =========================================================================== */
export function useHashRoute() {
  const read = () => {
    const raw = (window.location.hash || "#/").replace(/^#/, "");
    const [path, q] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    return { view: parts[0] || "home", param: parts[1] || null, query: new URLSearchParams(q || "") };
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      /* A new view starts at the top. Without this the reader lands
         mid-page, because the browser keeps the previous scroll offset when
         only the hash changed. */
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export const go = (to) => { window.location.hash = to; };

/* ===========================================================================
   §7  SMALL SHARED PIECES
   =========================================================================== */
export const LB = ({ children, style, className = "" }) =>
  <p className={`lb ${className}`} style={style}>{children}</p>;

/** The grain. A single tiling noise texture over the whole page, generated
    once at runtime rather than shipped as a PNG. It is what stops large flat
    fields of white and red reading as flat vector colour. */
export function Grain() {
  const [uri, setUri] = useState(null);
  useEffect(() => {
    if (reduced()) return;
    const S = 128;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(S, S);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 120 + Math.random() * 135;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    setUri(c.toDataURL("image/png"));
  }, []);
  if (!uri) return null;
  return <div className="grain" aria-hidden="true" style={{ backgroundImage: `url(${uri})` }} />;
}

/** The lamp. Night mode as an object you pull rather than a switch you flip —
    carried over from the research site, because it is the one piece of
    furniture the brand already owns. */
export function Lamp({ night, onPull }) {
  const fix = useRef(null);
  const pull = useCallback(() => {
    if (!reduced() && fix.current) {
      /* the fixture takes the tug and settles: the weight is the detail that
         makes it read as an object rather than a button */
      gsap.fromTo(fix.current, { rotate: -4.5 },
        { rotate: 0, duration: 1.4, ease: "elastic.out(1,.28)" });
    }
    onPull();
  }, [onPull]);

  return (
    <div className="lamp">
      <i className="cord" />
      <div className="fix" ref={fix}>
        <svg viewBox="0 0 140 96" aria-hidden="true">
          <path d="M70,6 L70,18" stroke="currentColor" strokeWidth="4" />
          <path d="M34,58 Q34,22 70,20 Q106,22 106,58 Z" fill="currentColor" />
          <rect x="30" y="56" width="80" height="7" rx="3.5" fill="currentColor" />
          <circle className="bulb" cx="70" cy="76" r="13" />
        </svg>
        <i className="beam" />
      </div>
      <button className="pull" onClick={pull} aria-pressed={!night}
        aria-label={night ? "Turn the lamp on — daylight" : "Turn the lamp off — night"}>
        <i /><b />
      </button>
    </div>
  );
}
