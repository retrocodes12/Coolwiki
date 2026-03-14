<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Roboto&size=42&duration=3000&pause=1000&color=006874&center=true&vCenter=true&width=600&lines=📖+CoolWiki;Beautiful+Wikipedia+Reader;Knowledge%2C+Beautifully+Delivered" alt="CoolWiki Typing SVG" />

<br/>

**A stunning, blazing-fast Wikipedia reader — built with a single HTML file.**  
*Material Design 3 · Offline Reading · Dark Mode · Math Rendering*

<br/>

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Material Design](https://img.shields.io/badge/Material%20Design%203-757575?style=for-the-badge&logo=materialdesign&logoColor=white)
![Wikipedia API](https://img.shields.io/badge/Wikipedia%20API-000000?style=for-the-badge&logo=wikipedia&logoColor=white)

<br/>

![License](https://img.shields.io/badge/license-MIT-97f0ff?style=flat-square)
![Single File](https://img.shields.io/badge/single%20file-⚡%20zero%20dependencies-4fd8eb?style=flat-square)
![Mobile Ready](https://img.shields.io/badge/mobile-ready-006874?style=flat-square)
![Offline](https://img.shields.io/badge/offline-supported-97f0ff?style=flat-square)

<br/>

---

</div>

<br/>

## 🌟 What is CoolWiki?

> **CoolWiki** is a beautifully designed Wikipedia reading experience wrapped in a *single HTML file*. No npm. No build step. No framework. Just open it in your browser and explore the world's knowledge — with style.

Powered by the **Wikipedia REST API** and styled with **Google's Material Design 3** system, CoolWiki turns the raw wall of text you're used to into a magazine-quality reading experience — with dark mode, offline saving, math rendering, and buttery-smooth animations.

<br/>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📰 Discover

- 🌅 **Article of the Day** — curated by Wikipedia
- 🔥 **Trending Articles** — most-read right now
- 🎲 **Random Article** — one tap, infinite curiosity
- 🌍 **Multi-language** — switch Wikipedia edition on the fly

</td>
<td width="50%">

### 📖 Read

- 🖼️ **Hero images** with cinematic gradient overlays
- 🔤 **Source Serif 4** font for comfortable long reads
- 📐 **KaTeX math rendering** for scientific articles
- 🔗 **In-app link navigation** — stay in the app

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Personalize

- 🌙 **Dark / Light / System** theme auto-switch
- 🔡 **Adjustable font size** for your eyes
- 📡 **Data Saver mode** — hides images on slow connections
- 💾 **Offline reading** — save articles to localStorage

</td>
<td width="50%">

### ⚡ Performance

- 📦 **Zero dependencies** — single `.html` file
- 🚀 **Instant load** — no build tools needed
- 📱 **Mobile-first** — works perfectly on iOS & Android
- 🎨 **Material You** color system throughout

</td>
</tr>
</table>

<br/>

---

## 🎨 Screenshots & Design

<div align="center">

| 🏠 Home Feed | 📖 Article View | 🔍 Search | ⚙️ Settings |
|:---:|:---:|:---:|:---:|
| Article of the Day + Trending | Hero image + serif typography | Debounced live search | Theme, font, data saver |

</div>

### 🖌️ Design System

CoolWiki uses a full **Material Design 3** token system — every color, shadow, and animation is defined as a CSS variable:

```css
/* Teal primary palette — adapts automatically to dark mode */
--md-sys-color-primary:           #006874;  /* Light */
--md-sys-color-primary-container: #97f0ff;

/* Dark mode counterparts */
--md-sys-color-primary:           #4fd8eb;  /* Dark */
```

> All surfaces, elevations, and state layers follow M3 spec — hover states, ripple effects, and container hierarchies included.

<br/>

---

## 🚀 Getting Started

No installation. No server. Just:

```bash
# Clone the repo
git clone https://github.com/your-username/coolwiki.git

# Open in your browser
open index.html
```

Or [**Download the single HTML file**](./index.html) and open it directly. That's it. ✅

<br/>

---

## 🗂️ App Structure

Even though it's one file, CoolWiki is organized into clear logical sections:

```
index.html
│
├── 🎨  CSS Variables (Material 3 tokens — light & dark)
├── 🏗️  Layout  (Top App Bar · Bottom Nav · Views · FAB)
├── 🃏  Components (Cards · List Items · Search Bar · Snackbar)
├── 📄  Article View (Hero · Header · Content · Tables · Math)
├── ⚙️  Settings Panel (Theme · Font Size · Data Saver · Language)
│
└── 🧠  JavaScript
    ├── init()           — boot & restore preferences
    ├── fetchFeed()      — Wikipedia Featured Content API
    ├── fetchArticleData() — Wikipedia REST API
    ├── doSearch()       — Wikipedia Search API (debounced)
    ├── openArticle()    — render article with hero + math
    ├── cleanArticleHTML() — strip navboxes, fix image URLs
    ├── processMath()    — KaTeX rendering for formulas
    ├── saveCurrentArticle() — localStorage offline saving
    └── applyPreferences() — theme, font, data saver
```

<br/>

---

## 🌐 APIs Used

| API | Purpose |
|---|---|
| `en.wikipedia.org/api/rest_v1/feed/featured/{date}` | Article of the Day + Trending |
| `en.wikipedia.org/api/rest_v1/page/summary/{title}` | Article metadata |
| `en.wikipedia.org/api/rest_v1/page/mobile-html/{title}` | Full article HTML |
| `en.wikipedia.org/w/api.php?action=opensearch` | Search autocomplete |

> Language prefix swaps automatically based on your selection (e.g. `fr.wikipedia.org`, `ja.wikipedia.org`).

<br/>

---

## 📱 Mobile Experience

CoolWiki is built **mobile-first** with careful attention to:

- ✅ `viewport-fit=cover` — fills notched screens edge-to-edge
- ✅ `env(safe-area-inset-bottom)` — bottom nav clears home bars
- ✅ `-webkit-tap-highlight-color: transparent` — no tap flash
- ✅ `overscroll-behavior-y: none` — no accidental pull-to-refresh
- ✅ `100dvh` — correct height on browsers with dynamic toolbars
- ✅ Smooth hide/show of top bar and bottom nav while scrolling

<br/>

---

## ⚙️ Settings Reference

| Setting | Options | Saved in |
|---|---|---|
| **Theme** | Light · Dark · System | `localStorage` |
| **Font Size** | Small · Medium · Large | `localStorage` |
| **Data Saver** | On · Off | `localStorage` |
| **Language** | Any Wikipedia language code | `localStorage` |

<br/>

---

## 🧮 Math Support

Scientific and mathematical Wikipedia articles render beautifully using **KaTeX**:

```
Wikipedia sends:  <img class="mwe-math-fallback-image-inline" alt="E = mc^2">
CoolWiki renders: ← proper typeset formula via KaTeX
```

Both inline and display-mode equations are supported.

<br/>

---

## 🔌 Offline Reading

Save any article with the **bookmark button** in the top bar. Saved articles are stored in `localStorage` and available even without internet:

```js
// What gets saved per article
{
  title: "Article Title",
  description: "Short description",
  image: "https://...",   // hero image URL
  html: "...",            // full rendered HTML
  savedAt: 1700000000000  // timestamp
}
```

> ⚠️ `localStorage` has a ~5MB limit per origin. Very long articles with many images may hit storage quota — CoolWiki shows a graceful error if this happens.

<br/>

---

## 🛠️ Customization

Since everything lives in one file, tweaking is easy:

```css
/* Change the primary color — everything adapts */
:root {
    --md-sys-color-primary: #6750A4; /* Switch to purple M3 theme */
}
```

```js
// Change default language
appState.lang = 'fr'; // French Wikipedia
```

<br/>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. 🍴 Fork the repository
2. 🌿 Create your branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit your changes: `git commit -m 'Add amazing feature'`
4. 📤 Push to the branch: `git push origin feature/amazing-feature`
5. 🔁 Open a Pull Request

<br/>

---

## 📜 License

```
MIT License — use it, modify it, ship it.
```

<br/>

---

<div align="center">

**Built with ❤️ and a single `<script>` tag**

*"The whole of Wikipedia. The beauty of Material Design. Zero megabytes of node_modules."*

<br/>

⭐ **Star this repo if CoolWiki made knowledge beautiful for you!** ⭐

<br/>

![Visitor Badge](https://visitor-badge.laobi.icu/badge?page_id=coolwiki.readme&left_color=006874&right_color=4fd8eb)

</div>
