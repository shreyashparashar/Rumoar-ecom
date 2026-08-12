import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSS } from "./styles.js";
import {
  useFrame, reduced, go, useHashRoute, Grain, Lamp,
  useFocusTrap, useBodyLock, money, scrollToTop,
} from "./lib.jsx";
import { LINES } from "./data.js";
import { CartProvider, useCart } from "./cart.jsx";
import { Toast, Qty } from "./parts.jsx";
import Intro from "./Intro.jsx";
import { Home, Shop as ShopView, Product, System, Checkout, Done } from "./views.jsx";

/* ===========================================================================
   §1  NAV
   Hides on the way down and returns on the way up. The threshold is 8px of
   travel, not 1 — without it a trackpad's sub-pixel jitter flickers the bar
   on and off while the page is standing still.
   =========================================================================== */
function Nav({ onCart, count, route }) {
  const [stuck, setStuck] = useState(false);
  const [hide, setHide] = useState(false);
  const [menu, setMenu] = useState(false);
  const [bump, setBump] = useState(false);
  const lastY = useRef(0);
  const seen = useRef(count);

  useFrame(() => {
    const y = window.scrollY;
    setStuck((s) => (s === y > 12 ? s : y > 12));
    const dy = y - lastY.current;
    if (Math.abs(dy) > 8) {
      const next = dy > 0 && y > 220 && !menu;
      setHide((h) => (h === next ? h : next));
      lastY.current = y;
    }
  });

  /* the bag reacts when something lands in it */
  useEffect(() => {
    if (count > seen.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 480);
      seen.current = count;
      return () => clearTimeout(t);
    }
    seen.current = count;
  }, [count]);

  useBodyLock(menu);

  const nav = (to) => { setMenu(false); go(to); };

  return (
    <>
      <nav className={`nav ${stuck ? "stuck" : ""} ${hide ? "hide" : ""}`} aria-label="Primary">
        <div className="navin">
          <button className="wordmark" onClick={() => { go("/"); scrollToTop(); }}
            aria-label="RUMOAR — home">RUMOA<b>R</b></button>

          <div className="navlinks">
            <button className={`navlink ${route.view === "shop" ? "on" : ""}`} onClick={() => nav("/shop")}>Shop</button>
            <button className={`navlink ${route.view === "system" ? "on" : ""}`} onClick={() => nav("/system")}>The system</button>
            <button className="navlink" onClick={() => nav("/shop")}>Journal</button>
          </div>

          <button className={`cartbtn ${bump ? "bump" : ""}`} onClick={onCart}
            aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
            Bag {count > 0 ? <span className="cnt num">{count}</span> : null}
          </button>

          <button className="menubtn" onClick={() => setMenu(true)} aria-label="Open menu"><i /></button>
        </div>
      </nav>

      <div className={`msheet ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span className="wordmark">RUMOA<b>R</b></span>
          <button className="x" onClick={() => setMenu(false)} aria-label="Close menu">✕</button>
        </div>
        <button onClick={() => nav("/shop")} tabIndex={menu ? 0 : -1}>Shop</button>
        <button onClick={() => nav("/system")} tabIndex={menu ? 0 : -1}>The system</button>
        <button onClick={() => nav("/")} tabIndex={menu ? 0 : -1}>Home</button>
        <button onClick={() => { setMenu(false); onCart(); }} tabIndex={menu ? 0 : -1}>
          Bag {count > 0 ? `(${count})` : ""}
        </button>
      </div>
    </>
  );
}

/* ===========================================================================
   §2  THE BAG
   =========================================================================== */
function CartPanel({ open, onClose }) {
  const { lines, subtotal, shipping, total, setQty, remove, freeOver } = useCart();
  const ref = useRef(null);
  useFocusTrap(open, ref, onClose);
  useBodyLock(open);

  const away = Math.max(0, freeOver - subtotal);

  return (
    <>
      <div className={`scrim ${open ? "open" : ""}`} onClick={onClose}
        style={{ pointerEvents: open ? "auto" : "none" }} aria-hidden="true" />
      <aside ref={ref} className={`panel ${open ? "open" : ""}`}
        role="dialog" aria-modal="true" aria-label="Your bag" aria-hidden={!open}>
        <div className="panel-h">
          <div>
            <h2 className="h3">Your bag</h2>
            <p className="li-m">{lines.length ? `${lines.length} line${lines.length === 1 ? "" : "s"}` : "Empty"}</p>
          </div>
          <button className="x" onClick={onClose} aria-label="Close bag" tabIndex={open ? 0 : -1}>✕</button>
        </div>

        <div className="panel-b">
          {lines.length === 0 ? (
            <div className="empty">
              <p className="mid" style={{ color: "var(--ink)" }}>Nothing yet.</p>
              <p className="body" style={{ textAlign: "center", fontSize: ".88rem" }}>
                Six pieces, and they all agree with each other.
              </p>
              <button className="btn btn-solid btn-sm" tabIndex={open ? 0 : -1}
                onClick={() => { onClose(); go("/shop"); }}>Shop the six</button>
            </div>
          ) : (
            <>
              {away > 0 ? (
                <p className="li-m" style={{ marginBottom: 14 }}>
                  <b style={{ color: "var(--mark)" }}>{money(away)}</b> more for free shipping.
                </p>
              ) : (
                <p className="li-m" style={{ marginBottom: 14, color: "var(--ok)", fontWeight: 700 }}>
                  Free shipping unlocked.
                </p>
              )}
              {lines.map((l) => (
                <div className="li" key={`${l.id}:${l.colour}`}>
                  <div className="li-p"><b>{l.product.n}</b></div>
                  <div>
                    <p className="li-n">{l.product.name}</p>
                    <p className="li-m">{l.colourName}</p>
                    <div className="li-r">
                      <Qty value={l.qty} max={l.product.stock}
                        onChange={(q) => setQty(l.id, l.colour, q)} />
                      <span className="num" style={{ fontWeight: 700, fontSize: ".88rem" }}>{money(l.sub)}</span>
                    </div>
                    <button className="li-x" style={{ marginTop: 9 }}
                      tabIndex={open ? 0 : -1}
                      onClick={() => remove(l.id, l.colour)}>Remove</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="panel-f">
            <p className="tot"><span>Subtotal</span><span className="num">{money(subtotal)}</span></p>
            <p className="tot"><span>Shipping</span>
              <span className="num">{shipping === 0 ? "Free" : money(shipping)}</span></p>
            <p className="tot grand"><span>Total</span><span className="num">{money(total)}</span></p>
            <button className="btn btn-mark btn-full" tabIndex={open ? 0 : -1}
              onClick={() => { onClose(); go("/checkout"); }}>Checkout</button>
            <button className="link" style={{ fontSize: ".78rem", color: "var(--ink-3)" }}
              tabIndex={open ? 0 : -1} onClick={onClose}>Keep looking</button>
          </div>
        ) : null}
      </aside>
    </>
  );
}

/* ===========================================================================
   §3  FOOTER
   =========================================================================== */
function Footer() {
  const [mail, setMail] = useState("");
  const [sent, setSent] = useState(false);

  const sub = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) return;
    setSent(true);
    setMail("");
  };

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-g">
          <div>
            <p className="wordmark" style={{ fontSize: "1.3rem" }}>RUMOA<b>R</b></p>
            <p className="body" style={{ fontSize: ".86rem", marginTop: 14, maxWidth: "34ch" }}>
              Nine pieces for the wardrobe Indian menswear never got round to
              building. Six of them are live.
            </p>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              {LINES.filter((l) => l !== "All").map((l) => (
                <li key={l}><button onClick={() => go("/shop")}>{l}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>House</h4>
            <ul>
              <li><button onClick={() => go("/system")}>The system</button></li>
              <li><button onClick={() => go("/shop")}>Journal</button></li>
              <li><button onClick={() => go("/system")}>Workshops</button></li>
              <li><button onClick={() => go("/system")}>Repairs</button></li>
            </ul>
          </div>

          <div>
            <h4>The rumour</h4>
            <p className="body" style={{ fontSize: ".86rem" }}>
              One letter a month. The next three pieces, before anyone else.
            </p>
            <form className="sub" onSubmit={sub}>
              <input type="email" value={mail} onChange={(e) => setMail(e.target.value)}
                placeholder="you@example.com" aria-label="Email address" required />
              <button className="btn btn-solid btn-sm" type="submit">Join</button>
            </form>
            <p className="body" aria-live="polite"
              style={{ fontSize: ".78rem", marginTop: 10, color: sent ? "var(--ok)" : "var(--ink-3)" }}>
              {sent ? "You're on the list." : "No noise. Unsubscribe in one click."}
            </p>
          </div>
        </div>

        <div className="foot-b">
          <span>© {new Date().getFullYear()} RUMOAR · Made in India</span>
          <span>A demonstration store. No payment is processed.</span>
        </div>
      </div>
    </footer>
  );
}

/* ===========================================================================
   §4  THE APP
   =========================================================================== */
function App() {
  const route = useHashRoute();
  const cart = useCart();

  /* The intro runs once per browser session. Somebody three clicks from
     checkout should not have to sit through a card trick to get back. */
  const [intro, setIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    if (reduced()) return false;
    try { return sessionStorage.getItem("rumoar.intro") !== "seen"; } catch { return true; }
  });

  const [night, setNight] = useState(false);
  const [bag, setBag] = useState(false);
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState(null);

  /* style injection: one <style> for the app's lifetime */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-rumoar", "");
    tag.textContent = CSS;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* the scroll lock belongs to the intro, and is released by JS — never left
     to a CSS class alone, or a failed boot leaves the page frozen */
  useEffect(() => {
    document.body.classList.toggle("intro-lock", intro);
    return () => document.body.classList.remove("intro-lock");
  }, [intro]);

  const introDone = useCallback(() => {
    setIntro(false);
    try { sessionStorage.setItem("rumoar.intro", "seen"); } catch { /* private mode */ }
  }, []);

  const add = useCallback((p, colour, qty = 1) => {
    const c = colour || p.colours[0].id;
    cart.add(p.id, c, qty);
    setToast(`${p.name} added`);
  }, [cart]);

  const view = () => {
    switch (route.view) {
      case "shop": return <ShopView onAdd={add} />;
      case "piece": return <Product id={route.param} onAdd={add} />;
      case "system": return <System />;
      case "checkout": return <Checkout onPlaced={(o) => { setOrder(o); cart.clear(); go("/done"); }} />;
      case "done": return <Done order={order} />;
      default: return <Home onAdd={add} />;
    }
  };

  return (
    <div className={`ru ${night ? "night" : ""}`}>
      <a className="skip" href="#main">Skip to content</a>
      <Grain />

      {intro ? <Intro onDone={introDone} /> : null}

      <Nav onCart={() => setBag(true)} count={cart.count} route={route} />
      <Lamp night={night} onPull={() => setNight((n) => !n)} />

      <main id="main">{view()}</main>

      <Footer />
      <CartPanel open={bag} onClose={() => setBag(false)} />
      <Toast msg={toast} onView={() => { setToast(""); setBag(true); }} />
    </div>
  );
}

export default function Root() {
  return <CartProvider><App /></CartProvider>;
}
