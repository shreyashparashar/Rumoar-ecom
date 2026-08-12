import React, { useState, useMemo, useRef } from "react";
import { PRODUCTS, byId, LINES, CREED, PROMISES } from "./data.js";
import { Reveal, Lines, LB, Magnetic, go, useScene, clamp, money } from "./lib.jsx";
import { Plate, ProductCard, Thread, Stock, Qty, Crumb } from "./parts.jsx";
import { useCart } from "./cart.jsx";

/* ===========================================================================
   §1  HOME
   =========================================================================== */
function Hero() {
  const ref = useRef(null);
  const mark = useRef(null);

  /* the rule under the hero draws itself as the page leaves — a small piece
     of scroll feedback that costs one transform and no layout */
  useScene(ref, (p) => {
    if (mark.current) mark.current.style.transform = `scaleX(${clamp(p * 2.4)})`;
  });

  return (
    <header className="wrap hero" ref={ref}>
      <div className="g">
        <div className="hero-t">
          <Lines as="h1" className="mega" lines={[
            "The pieces",
            "menswear",
            { t: "skipped.", mark: true },
          ]} />
          <Reveal delay={260}>
            <p className="lede">
              Six objects a man is read by before he speaks — built to a standard
              India sells at ten times the price, and priced where nobody has
              bothered to build anything at all.
            </p>
          </Reveal>
          <Reveal delay={360} className="hero-cta">
            <Magnetic className="btn btn-solid" onClick={() => go("/shop")}>
              Shop the six
            </Magnetic>
            <Magnetic className="btn btn-line" onClick={() => go("/system")}>
              Read the thinking
            </Magnetic>
          </Reveal>
        </div>

        <div className="hero-side">
          <Reveal delay={440}>
            <dl>
              <div><dt>Pieces live</dt><dd className="num">06 of 09</dd></div>
              <div><dt>Made in</dt><dd>Chennai · Kolkata · Jaipur</dd></div>
              <div><dt>Trial</dt><dd>Thirty nights</dd></div>
            </dl>
          </Reveal>
        </div>
      </div>
      <div style={{ marginTop: "clamp(38px,6vh,74px)" }}>
        <span ref={mark} style={{
          display: "block", height: 1, background: "var(--mark)",
          transform: "scaleX(0)", transformOrigin: "left",
        }} />
      </div>
    </header>
  );
}

function CreedBar() {
  const run = [...CREED, ...CREED, ...CREED, ...CREED, ...CREED, ...CREED];
  return (
    <div className="creedbar" aria-hidden="true">
      <div className="creedtrack">
        {run.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}

export function Home({ onAdd }) {
  const featured = PRODUCTS.slice(0, 3);
  return (
    <>
      <Hero />
      <CreedBar />

      <section className="wrap sec">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 22, flexWrap: "wrap", marginBottom: "clamp(28px,4vw,52px)" }}>
          <div>
            <Reveal><LB>The first three</LB></Reveal>
            <Reveal delay={90}>
              <h2 className="big" style={{ marginTop: 14 }}>Start anywhere.<br />They already agree.</h2>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <button className="link" onClick={() => go("/shop")}>See all six →</button>
          </Reveal>
        </div>

        <div className="grid">
          {featured.map((p, i) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} delay={i * 90} eager={i === 0} />
          ))}
        </div>
      </section>

      <section className="wrap quote">
        <Reveal>
          <p>Nine pieces. Twenty-eight coherent outfits. One recognisable man.</p>
        </Reveal>
        <Reveal delay={220} style={{ marginTop: "clamp(34px,6vh,64px)", display: "grid", placeItems: "center" }}>
          <Thread />
        </Reveal>
      </section>

      <section className="wrap sec-tight">
        <div className="promises">
          {PROMISES.map(([h, b], i) => (
            <Reveal key={h} delay={i * 80} className="promise">
              <h3>{h}</h3>
              <p>{b}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

/* ===========================================================================
   §2  SHOP
   =========================================================================== */
export function Shop({ onAdd }) {
  const [line, setLine] = useState("All");
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    let l = line === "All" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.line === line);
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [line, sort]);

  return (
    <section className="wrap pdp" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Shop" }]} />
      <Lines as="h1" className="big" lines={["Six of the nine."]} />
      <p className="body" style={{ marginTop: 16 }}>
        The remaining three are in fitting. Everything here ships from a named
        workshop within two working days.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "center", margin: "clamp(30px,5vw,54px) 0 clamp(24px,3vw,40px)" }}>
        <div className="filters" role="group" aria-label="Filter by line">
          {LINES.map((l) => (
            <button key={l} className={`fbtn ${line === l ? "on" : ""}`}
              aria-pressed={line === l} onClick={() => setLine(l)}>{l}</button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lb">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 100, border: "1px solid var(--line-2)", background: "var(--paper)", fontSize: ".78rem", fontWeight: 700 }}>
            <option value="featured">Featured</option>
            <option value="low">Price — low to high</option>
            <option value="high">Price — high to low</option>
          </select>
        </label>
      </div>

      <p className="sr" aria-live="polite">{list.length} pieces shown</p>

      {list.length ? (
        <div className="grid feature">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} delay={i * 70} eager={i < 2} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p className="mid">Nothing in that line yet.</p>
          <button className="btn btn-line btn-sm" onClick={() => setLine("All")}>Show all six</button>
        </div>
      )}
    </section>
  );
}

/* ===========================================================================
   §3  PRODUCT DETAIL
   =========================================================================== */
export function Product({ id, onAdd }) {
  const p = byId(id);
  const [colour, setColour] = useState(() => p?.colours[0]?.id ?? "");
  const [qty, setQty] = useState(1);

  if (!p) {
    return (
      <section className="wrap pdp" style={{ paddingBottom: "18vh" }}>
        <div className="empty">
          <p className="mid">That piece doesn&rsquo;t exist.</p>
          <button className="btn btn-line btn-sm" onClick={() => go("/shop")}>Back to the shop</button>
        </div>
      </section>
    );
  }

  const others = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3);
  const soldOut = p.stock <= 0;

  return (
    <>
      <section className="wrap pdp">
        <Crumb trail={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: p.name }]} />

        <div className="g">
          <div className="pdp-media">
            <Plate p={p} eager />
            <Reveal delay={120}>
              <p className="body" style={{ marginTop: 26, fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.06rem", color: "var(--ink-2)" }}>
                {p.thread}
              </p>
            </Reveal>
          </div>

          <div className="pdp-info">
            <p className="pline">{p.line}</p>
            <h1 className="big" style={{ marginTop: 10, fontSize: "clamp(1.7rem,3vw,2.5rem)" }}>{p.name}</h1>

            <div className="pdp-price">
              {p.was ? <span className="pwas num" style={{ fontSize: "1rem" }}>{money(p.was)}</span> : null}
              <b className="num">{money(p.price)}</b>
              <Stock n={p.stock} />
            </div>

            <p className="body" style={{ marginTop: 18 }}>{p.blurb}</p>

            <div style={{ marginTop: 28 }}>
              <p className="lb" style={{ marginBottom: 12 }}>
                Finish — {p.colours.find((c) => c.id === colour)?.name}
              </p>
              <div className="swatches" role="radiogroup" aria-label="Finish">
                {p.colours.map((c) => (
                  <button key={c.id} role="radio" aria-checked={colour === c.id}
                    aria-label={c.name} title={c.name}
                    className={`sw ${colour === c.id ? "on" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => setColour(c.id)} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 26, flexWrap: "wrap" }}>
              <Qty value={qty} onChange={(v) => setQty(Math.max(1, v))} max={Math.max(1, p.stock)} />
              <button className="btn btn-solid" style={{ flex: 1, minWidth: 190 }}
                disabled={soldOut}
                onClick={() => onAdd(p, colour, qty)}>
                {soldOut ? "Sold out" : `Add to bag — ${money(p.price * qty)}`}
              </button>
            </div>

            <p className="body" style={{ fontSize: ".8rem", marginTop: 14 }}>
              Free shipping over ₹2,000 · Thirty-night trial · Repaired, not replaced
            </p>

            <div style={{ marginTop: 34 }}>
              <details className="acc" open>
                <summary>Specification<i /></summary>
                <div className="acc-body">
                  <table className="spec">
                    <tbody>
                      {p.spec.map(([k, v]) => (
                        <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
              <details className="acc">
                <summary>Living with it<i /></summary>
                <div className="acc-body"><p className="body">{p.care}</p></div>
              </details>
              <details className="acc">
                <summary>Shipping &amp; returns<i /></summary>
                <div className="acc-body">
                  <p className="body">
                    Dispatched within two working days from the workshop that made it.
                    Two to four days across India, tracked. Thirty nights to decide:
                    carry it properly, and if it hasn&rsquo;t earned its place, send it
                    back for a full refund.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap sec-tight">
        <Reveal><LB>Goes with</LB></Reveal>
        <div className="grid" style={{ marginTop: 26 }}>
          {others.map((o, i) => <ProductCard key={o.id} p={o} onAdd={(pp) => onAdd(pp)} delay={i * 80} />)}
        </div>
      </section>
    </>
  );
}

/* ===========================================================================
   §4  THE SYSTEM — the one editorial page the store keeps
   =========================================================================== */
export function System() {
  return (
    <section className="wrap pdp" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "The system" }]} />
      <div className="g">
        <div style={{ gridColumn: "1/9" }}>
          <Lines as="h1" className="big" lines={["A wardrobe is not", { t: "a pile of things.", dim: true }]} />
          <Reveal delay={200}>
            <p className="lede" style={{ marginTop: 24 }}>
              Indian menswear spent thirty years getting very good at selling
              garments and never once built a system. You can buy a good shirt
              in nine hundred places. You cannot buy nine things that agree with
              each other.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="body" style={{ marginTop: 20 }}>
              That is the whole of it. Every piece here is designed against the
              other eight: one palette, one hardware finish, one set of
              proportions. Buy one and it works. Buy four and they compound —
              not because they match, but because they were drawn by someone
              who knew what the other three were going to be.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              The research behind this ran for eighteen months and is published
              in full. This shop is the part of it you can hold.
            </p>
          </Reveal>
          <Reveal delay={340} style={{ marginTop: 34 }}>
            <Magnetic className="btn btn-solid" onClick={() => go("/shop")}>Shop the six</Magnetic>
          </Reveal>
        </div>
        <div style={{ gridColumn: "10/13", alignSelf: "center" }}>
          <Reveal delay={300}><Thread /></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   §5  CHECKOUT
   Validated on submit, not on every keystroke — telling somebody their email
   is invalid while they are still on the third character of it is hostile.
   Once a field has failed once, it re-validates live so the error clears as
   soon as they fix it.
   =========================================================================== */
const REQUIRED = [
  ["email", "Email", "email", "you@example.com"],
  ["name", "Full name", "text", "Arjun Mehta"],
  ["phone", "Phone", "tel", "98765 43210"],
  ["addr", "Address", "text", "Flat, street"],
  ["city", "City", "text", "Bengaluru"],
  ["pin", "PIN code", "text", "560001"],
];

function validate(v) {
  const e = {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.email || "")) e.email = "Enter a valid email address.";
  if (!(v.name || "").trim()) e.name = "We need a name for the parcel.";
  /* Indian mobile numbers are ten digits and never start below 6. Spaces,
     dashes and a +91 prefix are all normal ways to type one, so strip them
     before testing rather than rejecting the format. */
  if (!/^[6-9]\d{9}$/.test((v.phone || "").replace(/[\s\-+]/g, "").replace(/^91/, ""))) {
    e.phone = "Enter a 10-digit Indian mobile number.";
  }
  if (!(v.addr || "").trim()) e.addr = "Street address is required.";
  if (!(v.city || "").trim()) e.city = "City is required.";
  if (!/^\d{6}$/.test((v.pin || "").trim())) e.pin = "A PIN code is six digits.";
  return e;
}

const AUTOCOMPLETE = {
  email: "email", name: "name", phone: "tel",
  addr: "street-address", city: "address-level2", pin: "postal-code",
};

/* Defined at module scope on purpose.
   BUG WAS HERE: this used to be declared inside Checkout. A component
   declared inside another component is a NEW function identity on every
   render, so React cannot reconcile it with the previous tree — it unmounts
   the old <input> and mounts a fresh one. The visible symptom was that typing
   into any checkout field kept only the first character and then dropped
   focus, because every keystroke destroyed the element receiving it. */
function Field({ k, label, type, ph, half, value, err, onChange }) {
  return (
    <div className={`field ${err ? "bad" : ""}`} style={half ? undefined : { gridColumn: "1/-1" }}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} name={k} type={type} placeholder={ph}
        value={value || ""} onChange={onChange}
        aria-invalid={!!err} aria-describedby={err ? `e-${k}` : undefined}
        autoComplete={AUTOCOMPLETE[k]} />
      {err ? <span className="err" id={`e-${k}`}>{err}</span> : null}
    </div>
  );
}

export function Checkout({ onPlaced }) {
  const { lines, subtotal, shipping, total, setQty } = useCart();
  const [v, setV] = useState({});
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState(false);
  const [pay, setPay] = useState("upi");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched) setErrs(validate(next));   // only after a failed submit
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(v);
    setErrs(found);
    setTouched(true);
    if (Object.keys(found).length) {
      /* send the keyboard to the first problem — scrolling somebody to an
         error they then have to find is only half the job */
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setBusy(true);
    /* Stands in for the payment call. Swap this for the gateway's SDK: the
       shape it needs is { lines, total, pay, address: v }. */
    setTimeout(() => { setBusy(false); onPlaced({ ...v, pay, total }); }, 900);
  };

  if (!lines.length) {
    return (
      <section className="wrap co" style={{ paddingBottom: "18vh" }}>
        <div className="empty">
          <p className="mid">Your bag is empty.</p>
          <p className="body" style={{ textAlign: "center" }}>Nothing to check out yet.</p>
          <button className="btn btn-solid btn-sm" onClick={() => go("/shop")}>Shop the six</button>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap co" style={{ paddingBottom: "clamp(64px,10vw,130px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Bag", to: "/shop" }, { label: "Checkout" }]} />
      <h1 className="big" style={{ marginBottom: "clamp(28px,4vw,48px)" }}>Checkout</h1>

      <form className="g" onSubmit={submit} noValidate>
        <div className="co-form">
          <h2 className="h3" style={{ marginBottom: 18 }}>Where it goes</h2>
          <div className="row2">
            {REQUIRED.slice(0, 3).map(([k, l, t, ph]) => (
              <Field key={k} k={k} label={l} type={t} ph={ph} half={k !== "email"}
                value={v[k]} err={errs[k]} onChange={set(k)} />
            ))}
          </div>
          <Field k="addr" label="Address" type="text" ph="Flat, street"
            value={v.addr} err={errs.addr} onChange={set("addr")} />
          <div className="row2">
            <Field k="city" label="City" type="text" ph="Bengaluru" half
              value={v.city} err={errs.city} onChange={set("city")} />
            <Field k="pin" label="PIN code" type="text" ph="560001" half
              value={v.pin} err={errs.pin} onChange={set("pin")} />
          </div>

          <h2 className="h3" style={{ margin: "34px 0 16px" }}>How you pay</h2>
          <div className="paybox">
            {[
              ["upi", "UPI", "Google Pay, PhonePe, Paytm and any BHIM app"],
              ["card", "Card", "Visa, Mastercard, RuPay and Amex"],
              ["cod", "Cash on delivery", "₹49 handling. Not available above ₹10,000"],
            ].map(([id, t, s]) => (
              <label key={id} className="payopt">
                <input type="radio" name="pay" value={id} checked={pay === id}
                  onChange={() => setPay(id)}
                  disabled={id === "cod" && total > 10000} />
                <span>
                  <b>{t}</b>
                  <span>{id === "cod" && total > 10000 ? "Unavailable on this order" : s}</span>
                </span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-mark btn-full" style={{ marginTop: 26 }} disabled={busy}>
            {busy ? "Placing…" : `Place order — ${money(total)}`}
          </button>
          <p className="body" style={{ fontSize: ".78rem", marginTop: 12 }}>
            This is a demonstration store. No payment is taken and no card details are collected.
          </p>
        </div>

        <aside className="co-sum" aria-label="Order summary">
          <h2 className="h3" style={{ marginBottom: 16 }}>Your bag</h2>
          {lines.map((l) => (
            <div className="li" key={`${l.id}:${l.colour}`} style={{ gridTemplateColumns: "56px 1fr" }}>
              <div className="li-p"><b>{l.product.n}</b></div>
              <div>
                <p className="li-n">{l.product.name}</p>
                <p className="li-m">{l.colourName} · {l.qty}</p>
                <div className="li-r">
                  <Qty value={l.qty} max={l.product.stock}
                    onChange={(q) => setQty(l.id, l.colour, q)} />
                  <span className="num" style={{ fontWeight: 700, fontSize: ".88rem" }}>{money(l.sub)}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            <p className="tot"><span>Subtotal</span><span className="num">{money(subtotal)}</span></p>
            <p className="tot">
              <span>Shipping</span>
              <span className="num">{shipping === 0 ? "Free" : money(shipping)}</span>
            </p>
            <p className="tot grand"><span>Total</span><span className="num">{money(total)}</span></p>
          </div>
        </aside>
      </form>
    </section>
  );
}

/* ===========================================================================
   §6  CONFIRMATION
   =========================================================================== */
export function Done({ order }) {
  const ref = useRef(Math.random().toString(36).slice(2, 8).toUpperCase());
  return (
    <section className="wrap co" style={{ paddingBottom: "18vh" }}>
      <div style={{ maxWidth: "44ch", marginInline: "auto", textAlign: "center", paddingTop: "6vh" }}>
        <Reveal>
          <p className="lb" style={{ color: "var(--mark)" }}>Order placed</p>
          <h1 className="big" style={{ marginTop: 18 }}>That&rsquo;s yours.</h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="body" style={{ marginTop: 20, marginInline: "auto" }}>
            Reference <b className="num" style={{ color: "var(--ink)" }}>RMR-{ref.current}</b>.
            A confirmation is on its way to {order?.email || "your inbox"}. It ships
            within two working days from the workshop that made it.
          </p>
        </Reveal>
        <Reveal delay={220} style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Magnetic className="btn btn-solid" onClick={() => go("/shop")}>Keep looking</Magnetic>
          <Magnetic className="btn btn-line" onClick={() => go("/")}>Home</Magnetic>
        </Reveal>
        <div style={{ marginTop: "clamp(44px,8vh,86px)", display: "grid", placeItems: "center" }}>
          <Thread label="one of nine · the thread continues" />
        </div>
      </div>
    </section>
  );
}
