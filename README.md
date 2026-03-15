<div align="center">

<img src="fevicon.png" width="110" alt="CoolWiki" />

<br/>

# C O O L W I K I

*The world's knowledge, dressed for the occasion.*

<br/>

[![Live Demo](https://img.shields.io/badge/◈_Live_Demo-Visit_Site-C4964A?style=for-the-badge&labelColor=0D0C0A)](https://coding-to-void.github.io/Coolwiki/)
[![Single File](https://img.shields.io/badge/◈_Architecture-Single_File-C4964A?style=for-the-badge&labelColor=0D0C0A)](https://github.com/CODING-to-void/Coolwiki/blob/main/index.html)
[![No Dependencies](https://img.shields.io/badge/◈_Dependencies-None-C4964A?style=for-the-badge&labelColor=0D0C0A)](https://github.com/CODING-to-void/Coolwiki)
[![License: MIT](https://img.shields.io/badge/◈_License-MIT-C4964A?style=for-the-badge&labelColor=0D0C0A)](LICENSE)

<br/>

---

> *Wikipedia was never ugly. The web just forgot how to read.*

---

</div>

<br/>

## &nbsp;&nbsp;I.&nbsp;&nbsp; The Premise

CoolWiki is a **single-file Wikipedia client** — no frameworks, no build pipeline, no installations. One `index.html`. Open it. Read the world.

It reimagines Wikipedia not as a utility to tolerate, but as a **reading experience to return to** — wrapping the planet's largest encyclopedia in a bespoke *Dark Literary Luxury* design system built from scratch in pure HTML, CSS, and JavaScript.

<br/>

---

## &nbsp;&nbsp;II.&nbsp;&nbsp; Features

<br/>

| &nbsp; | Feature | Description |
|--------|---------|-------------|
| `◈` | **Article Feed** | Daily featured articles and trending reads surface automatically on launch |
| `◈` | **Full Article View** | Distraction-free reading with hero imagery, rich formatting, and rendered math |
| `◈` | **Real-Time Search** | Debounced search against the Wikipedia API — results as you think |
| `◈` | **Saved Articles** | Bookmark articles locally; they remain offline in `localStorage` |
| `◈` | **Random Discovery** | A single dice roll. A world you didn't expect |
| `◈` | **Multi-Language** | Six Wikipedia editions: `EN` `ES` `FR` `DE` `JA` `ZH` |
| `◈` | **Dark / Light Mode** | Persisted preference. Silk-smooth transition |
| `◈` | **Data Saver** | Image suppression for lean reading on limited bandwidth |
| `◈` | **Font Scaling** | Four reading sizes — Small through X-Large |
| `◈` | **LaTeX / KaTeX** | Mathematical content renders as it was written to render |

<br/>

---

## &nbsp;&nbsp;III.&nbsp;&nbsp; Design Philosophy

CoolWiki does not merely display information. It **frames** it.

Every typographic decision, every motion curve, every shadow depth was deliberate:

```
Typefaces  ——  Cormorant Garamond  ·  Newsreader  ·  DM Mono
Accent     ——  #C4964A  (burnished gold)
Background ——  #0D0C0A  (near-black charcoal)
Motion     ——  cubic-bezier(0.16, 1, 0.3, 1)  (silk ease)
Nav        ——  Floating frosted-glass pill · bottom-anchored
Texture    ——  Subtle SVG film grain overlay across all surfaces
```

The result is a reading environment that feels less like an app and more like a private library.

<br/>

---

## &nbsp;&nbsp;IV.&nbsp;&nbsp; Getting Started

No installation. No configuration. No ceremony.

```bash
# Clone the repository
git clone https://github.com/CODING-to-void/Coolwiki.git

# Open in browser — that's it
open index.html
```

Or download `index.html` directly and open it. The entire application lives inside a single file.

> **Note:** Article content is fetched live from the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) and [Wikimedia Feed API](https://api.wikimedia.org). An internet connection is required. Saved articles persist offline via `localStorage`.

<br/>

---

## &nbsp;&nbsp;V.&nbsp;&nbsp; File Structure

```
coolwiki/
├── index.html      ← The entire application. HTML, CSS, JS. One file.
└── fevicon.png     ← The mark.
```

<br/>

---

## &nbsp;&nbsp;VI.&nbsp;&nbsp; Customization

All design tokens are declared at the top of `index.html` inside a single `:root` block. No JavaScript required to retheme — adjust, reload, and the entire application responds.

```css
:root {
    --bg:           #0D0C0A;   /* primary background    */
    --gold:         #C4964A;   /* accent — the signature */
    --font-display: 'Cormorant Garamond', serif;
    --font-reading: 'Newsreader', serif;
    --font-ui:      'DM Mono', monospace;
    /* ... full token set inside index.html */
}
```

<br/>

---

## &nbsp;&nbsp;VII.&nbsp;&nbsp; API Sources

| Data | Endpoint |
|------|----------|
| Featured feed | `https://api.wikimedia.org/feed/v1/wikipedia/{lang}/featured/{date}` |
| Article summary | `https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}` |
| Full article HTML | `https://{lang}.wikipedia.org/api/rest_v1/page/mobile-html/{title}` |
| Search | `https://{lang}.wikipedia.org/w/api.php?action=query&list=search` |

<br/>

---

## &nbsp;&nbsp;VIII.&nbsp;&nbsp; Browser Support

Built for the modern web. Optimized for mobile without compromise.

- `viewport-fit=cover` — notch-safe on all devices
- `env(safe-area-inset-bottom)` — respects hardware geometry
- Touch-calibrated tap targets
- `overscroll-behavior` — native-feel scroll physics

<br/>

---

## &nbsp;&nbsp;IX.&nbsp;&nbsp; License

Released under the **MIT License** — free to use, adapt, and carry forward.

See [`LICENSE`](LICENSE) for the full terms.

<br/>

---

<div align="center">

<br/>

<img src="fevicon.png" width="48" alt="" />

<br/>
<br/>

*Built with no dependencies. Governed by no framework.*  
*Just craft, and the conviction that reading should feel like something.*

<br/>

**[↗ Live Site](https://coding-to-void.github.io/Coolwiki/)** &nbsp;·&nbsp; **[↗ Source](https://github.com/CODING-to-void/Coolwiki/blob/main/index.html)**

<br/>

</div>
