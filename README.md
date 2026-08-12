# RUMOAR — store

A complete storefront for the RUMOAR wardrobe system: six pieces, a bag, a
checkout, and a card-deck intro. React + Vite, no backend.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview
```

Deploys as a static site anywhere. Routing is hash-based, so it needs no
rewrite rules — `dist/index.html` works opened straight off disk.

---

## What is where

| File | Holds |
|---|---|
| `src/data.js` | **The catalogue.** Products, prices, specs, copy, media manifest. |
| `src/styles.js` | **The design system.** Tokens, type scale, every component's CSS. |
| `src/lib.jsx` | Frame loop, scroll, reveals, magnetic controls, focus trap, router, lamp. |
| `src/cart.jsx` | Cart reducer + `localStorage`. |
| `src/parts.jsx` | Plates, product cards, the thread mark, toast, quantity stepper. |
| `src/views.jsx` | Home, Shop, Product, System, Checkout, Confirmation. |
| `src/Intro.jsx` | The deck, the shuffle, and the King of Hearts. |
| `src/Shop.jsx` | App shell — nav, bag panel, footer, routing. |

Two places cover most edits: **`data.js` to change what is sold**, **`styles.js`
to change how it looks.** Neither requires touching a component.

---

## Adding photography

Every product has an `img` field, `null` today. While it is null the product
renders a composed plate — piece number, material, and the line's glyph on a
tinted field. That is a designed state, not a broken image, so the store is
presentable with no photography at all.

To drop real photos in, put files in `public/assets/products/` and change one
line per product in `data.js`:

```js
img: null            →    img: "products/wallet.jpg"
```

Nothing else changes. Shoot **4:5 portrait, 1600px on the long edge**, on a
light ground.

---

## The intro

A deck riffles three times, fans, squares up, and the top card turns over into
the King of Hearts — indexed **R** instead of K. The whisper types underneath
from the first frame, running *alongside* the shuffle rather than after it, so
both finish together.

- Skippable from ~240ms by click, key, or the Skip button.
- Shows **once per browser session** (`sessionStorage`). Someone three clicks
  from checkout shouldn't sit through a card trick again. Clear it with
  `sessionStorage.removeItem('rumoar.intro')` to see it again.
- `prefers-reduced-motion` skips it entirely.

Tuning lives at the top of `Intro.jsx`: `CARDS` (deck size) and the timeline in
the first `useEffect`. The card artwork is the `KingFace` component — pure SVG,
no assets.

---

## Cart

Reducer + `localStorage` under `rumoar.cart.v1`. Line identity is `id:colour`,
not `id` — the same wallet in Ink and Oxblood are two lines. A persisted cart
is validated against the catalogue on read, so a line pointing at a deleted
product can't crash the store on the next visit.

Free shipping over ₹2,000, otherwise ₹149 flat. Both in `cart.jsx`.

## Checkout

Client-side validation only, on submit — telling somebody their email is wrong
while they're on the third character is hostile. After one failed submit,
fields re-validate live so errors clear as they're fixed. Focus jumps to the
first problem.

Payment is a stub. Swap the `setTimeout` in `Checkout` for the gateway SDK; the
shape it needs is `{ lines, total, pay, address }`.

---

## Design notes

Tokens carry over from the research site — the red (`#D8232F`), the ink/paper
ramp, and night mode with the pull-lamp. Light is the default because the store
is looked at in daylight on a phone; night is a deliberate act performed on a
physical object rather than a system preference.

Two families on a contrast axis: **Archivo** for interface, **Bodoni Moda** for
the moments the brand speaks in its own voice. Display tracking bottoms out at
`-.03em` and the hero ceiling is `5.4rem`.

Contrast: body copy runs 9.4:1 on paper and 9.1:1 at night; the lightest ink in
the ramp still clears 4.9:1. Nothing on this site sits below AA.

**Reveals are enhancements, never gates.** The hidden state lives on
`.rv.armed`, and `armed` is only ever added by JavaScript that also owns the
observer which removes it. Without JS — a crawler, reader mode, a renderer that
never fires `IntersectionObserver` — content is simply visible. A 4s failsafe
catches the rest.

---

## Known stubs

Deliberately not built, because they need a backend:

- Payment (see above) and order persistence — the confirmation reference is
  generated client-side.
- Newsletter signup validates and confirms, but posts nowhere.
- Journal links point at `/shop`.
- Stock counts are static; nothing decrements on purchase.
