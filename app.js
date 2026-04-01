const appState = {
  view: 'home',
  lang: localStorage.getItem('cw_lang') || 'en',
  dataSaver: localStorage.getItem('cw_data_saver') === 'true',
  fontSize: localStorage.getItem('cw_font_size') || '18px',
  historyStack: [],
  currentArticle: null
};

const els = {
  topbar: document.getElementById('topbar'),
  bottomnav: document.getElementById('bottomnav'),
  mainScroll: document.getElementById('main-scroll'),
  fab: document.getElementById('fabBtn'),
  tbTitle: document.getElementById('tb-title'),
  tbEyebrow: document.getElementById('tb-eyebrow'),
  tbNav: document.getElementById('tb-nav'),
  tbActionIcon: document.getElementById('tb-action-icon'),
  langSelect: document.getElementById('lang-select'),
  heroStage: document.getElementById('hero-stage')
};

const langNames = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  zh: 'Chinese'
};

let revealObserver = null;

function init() {
  applyPreferences();
  els.langSelect.value = appState.lang;
  initRevealObserver();
  activateReveals(document);
  bindScrollBehavior();
  bindSearchInput();
  buildTicker();
  syncHomePanels();
  syncSettingsCopy();
  loadFeed();
}

function bindScrollBehavior() {
  const progressBar = document.getElementById('reading-progress');
  let lastScrollY = els.mainScroll.scrollTop;

  els.mainScroll.addEventListener('scroll', () => {
    const currentScrollY = els.mainScroll.scrollTop;

    if (appState.view === 'article') {
      const scrollable = els.mainScroll.scrollHeight - els.mainScroll.clientHeight;
      const pct = scrollable > 0 ? Math.min(100, (currentScrollY / scrollable) * 100) : 0;
      progressBar.style.width = `${pct}%`;
      progressBar.classList.toggle('visible', pct > 0.5);
    } else {
      progressBar.style.width = '0%';
      progressBar.classList.remove('visible');
    }

    if (appState.view === 'article' || appState.view === 'search') {
      if (currentScrollY > lastScrollY && currentScrollY > 90) {
        els.topbar.classList.add('hide');
        els.bottomnav.classList.add('hide');
        els.fab.classList.add('nav-hide');
      } else {
        els.topbar.classList.remove('hide');
        els.bottomnav.classList.remove('hide');
        els.fab.classList.remove('nav-hide');
      }
    } else {
      els.topbar.classList.remove('hide');
      els.bottomnav.classList.remove('hide');
      els.fab.classList.remove('nav-hide');
    }

    els.topbar.classList.toggle('scrolled', currentScrollY > 8);
    lastScrollY = currentScrollY;
  }, { passive: true });
}

function bindSearchInput() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  let debounceTimeout;

  input.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    clearBtn.style.opacity = query ? '1' : '0';
    clearTimeout(debounceTimeout);

    if (!query) {
      renderSearchHint();
      return;
    }

    debounceTimeout = setTimeout(() => doSearch(query), 350);
  });
}

function setTopbar(title, eyebrow) {
  els.tbTitle.textContent = title;
  els.tbEyebrow.textContent = eyebrow;
}

function switchTab(tabId) {
  if (appState.view === 'article') {
    appState.historyStack = [];
  }

  appState.view = tabId;

  document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
  const activeTab = document.getElementById(`tab-${tabId}`);
  if (activeTab) activeTab.classList.add('active');

  document.querySelectorAll('.view').forEach((el) => el.classList.remove('active'));
  document.getElementById(`view-${tabId}`).classList.add('active');

  els.tbNav.classList.add('hidden');
  els.tbNav.classList.remove('flex');
  els.langSelect.classList.add('hidden');
  els.bottomnav.classList.remove('hide');
  els.topbar.classList.remove('hide');
  els.fab.classList.remove('hide', 'nav-hide');
  els.tbActionIcon.textContent = 'casino';
  els.tbActionIcon.classList.remove('icon-filled');
  els.mainScroll.scrollTop = 0;

  if (tabId === 'home') {
    setTopbar('COOLWIKI', 'signal // live encyclopedia');
    els.langSelect.classList.remove('hidden');
    syncHomePanels();
  } else if (tabId === 'search') {
    setTopbar('SEARCH', 'query // wikipedia index');
    els.fab.classList.add('hide');
    renderSearchHint(document.getElementById('search-input').value.trim());
  } else if (tabId === 'saved') {
    setTopbar('STACK', 'offline // local archive');
    els.fab.classList.add('hide');
    loadSaved();
  } else if (tabId === 'settings') {
    setTopbar('SYSTEM', 'prefs // machine controls');
    els.fab.classList.add('hide');
    syncSettingsCopy();
  }

  activateReveals(document.getElementById(`view-${tabId}`));
}

function openArticle(title, pushHistory = true) {
  if (pushHistory) {
    if (appState.view === 'article' && appState.currentArticle) {
      appState.historyStack.push({ view: 'article', title: appState.currentArticle.title });
    } else {
      appState.historyStack.push({ view: appState.view });
    }
  }

  appState.view = 'article';
  document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
  document.querySelectorAll('.view').forEach((el) => el.classList.remove('active'));
  document.getElementById('view-article').classList.add('active');

  els.mainScroll.scrollTop = 0;
  els.tbNav.classList.remove('hidden');
  els.tbNav.classList.add('flex');
  els.langSelect.classList.add('hidden');
  els.bottomnav.classList.add('hide');
  els.fab.classList.add('hide');
  setTopbar(title.toUpperCase(), 'live // article');
  syncArticleActionState(title);

  document.getElementById('art-title').textContent = title;
  document.getElementById('art-desc').textContent = '';
  document.getElementById('art-meta-row').innerHTML = '';
  document.getElementById('article-hero-container').innerHTML = '';
  document.getElementById('art-content').innerHTML = renderLoader('panel-acid');

  fetchArticleData(title).then((data) => {
    if (!data) {
      document.getElementById('art-content').innerHTML = renderErrorPanel(
        'Content unavailable',
        'Could not load that article. Try another page or check the connection.',
        'panel-signal'
      );
      return;
    }

    appState.currentArticle = data;
    setTopbar(data.title.toUpperCase(), 'live // article');
    document.getElementById('art-title').textContent = data.title;
    document.getElementById('art-desc').textContent = data.description || '';

    const processEl = document.createElement('div');
    processEl.innerHTML = data.html;

    processMath(processEl);
    cleanArticleHTML(processEl);

    let heroImage = normalizeWikiImageUrl(data.image);
    if (!heroImage) {
      const firstImage = getFirstUsableArticleImage(processEl);
      if (firstImage) {
        heroImage = firstImage.src;
        const removableContainer = firstImage.element.closest('figure, .thumb, .gallerybox');
        if (removableContainer) removableContainer.remove();
        else firstImage.element.remove();
      }
    }

    if (heroImage) {
      document.getElementById('article-hero-container').innerHTML = `
        <div class="article-hero-frame panel panel-cyan reveal">
          <img src="${heroImage}" class="article-hero" alt="${escapeHtml(data.title)}" data-optional="true" onerror="this.remove()">
        </div>`;
    }

    document.getElementById('art-meta-row').innerHTML = renderArticleMeta(data);
    document.getElementById('art-content').innerHTML = processEl.innerHTML;
    enforceReadableBrightBoxes(document.getElementById('art-content'));

    document.getElementById('art-content').querySelectorAll('a').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('./')) {
        const wikiTitle = decodeURIComponent(href.replace('./', '').split('#')[0]).replace(/_/g, ' ');
        anchor.href = 'javascript:void(0)';
        anchor.onclick = (event) => {
          event.preventDefault();
          openArticle(wikiTitle);
        };
      } else if (href && href.startsWith('http')) {
        anchor.target = '_blank';
        anchor.rel = 'noopener';
      }
    });

    activateReveals(document.getElementById('view-article'));
    syncArticleActionState(data.title);
  });
}

function renderArticleMeta(data) {
  const readMins = Math.min(calcReadTime(data.html), 60);
  const wikiUrl = `https://${appState.lang}.wikipedia.org/wiki/${encodeURIComponent(data.title.replace(/ /g, '_'))}`;

  return `
    <span class="meta-chip border-3 border-outline bg-panel-2 px-3 py-2 text-xs text-acid">
      ${readMins} min read
    </span>
    <span class="meta-chip border-3 border-outline bg-panel-2 px-3 py-2 text-xs text-cyan">
      ${langNames[appState.lang]} edition
    </span>
    <a class="meta-chip border-3 border-outline bg-panel-2 px-3 py-2 text-xs text-pink no-underline"
      href="${wikiUrl}" target="_blank" rel="noopener">
      open on wikipedia
    </a>`;
}

function syncArticleActionState(title) {
  const saved = getSavedArticles();
  const isSaved = saved.some((article) => article.title === title);
  els.tbActionIcon.textContent = isSaved ? 'bookmark_remove' : 'bookmark_add';
  els.tbActionIcon.classList.toggle('icon-filled', isSaved);
}

function processMath(element) {
  element.querySelectorAll('img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display').forEach((img) => {
    const tex = img.getAttribute('alt');
    if (!tex) return;

    try {
      const span = document.createElement('span');
      katex.render(tex.replace(/\\(displaystyle|textstyle)/, '').trim(), span, {
        throwOnError: false,
        displayMode: img.classList.contains('mwe-math-fallback-image-display')
      });
      img.parentNode.replaceChild(span, img);
    } catch (error) {
      console.error(error);
    }
  });
}

function cleanArticleHTML(root) {
  const removable = ['.mw-editsection', '.navbox', '.metadata', '.mbox', '.reflist', '.references', '.toc', '#toc'];
  removable.forEach((selector) => root.querySelectorAll(selector).forEach((node) => node.remove()));

  root.querySelectorAll('img').forEach((img) => {
    let src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('resource');
    const srcset = img.getAttribute('srcset');

    if ((!src || src.startsWith('./File:')) && srcset) {
      src = srcset.split(',')[0]?.trim().split(' ')[0];
    }

    src = normalizeWikiImageUrl(src);
    if (!src) {
      img.remove();
      return;
    }

    img.src = src;
    img.dataset.optional = 'true';
  });
}

function getFirstUsableArticleImage(root) {
  const images = root.querySelectorAll('img');

  for (const img of images) {
    const src = normalizeWikiImageUrl(
      img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('resource')
    );
    const width = Number(img.getAttribute('width') || 0);
    if (!src) continue;
    if (img.classList.contains('mwe-math-fallback-image-inline') || img.classList.contains('mwe-math-fallback-image-display')) continue;
    if (src.startsWith('data:')) continue;
    if (src.includes('/static/images/')) continue;
    if (src.includes('Special:FilePath')) continue;
    if (!/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(src) && !src.includes('/thumb/')) continue;
    if (width && width < 120) continue;

    img.src = src;
    img.dataset.optional = 'true';
    return { src, element: img };
  }

  return null;
}

function normalizeWikiImageUrl(src) {
  if (!src) return null;
  let out = String(src).trim();
  if (!out || out.startsWith('./File:') || out.startsWith('File:')) return null;
  if (out.startsWith('//')) out = `https:${out}`;
  else if (out.startsWith('/')) out = `https://${appState.lang}.wikipedia.org${out}`;
  else if (out.startsWith('./')) out = `https://${appState.lang}.wikipedia.org/wiki/${out.slice(2)}`;
  if (out.includes('/revision/latest')) return null;
  return out;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeJsString(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function enforceReadableBrightBoxes(root) {
  root.querySelectorAll('*').forEach((element) => {
    const style = getComputedStyle(element);
    const bg = style.backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') return;
    const rgb = bg.match(/\d+(\.\d+)?/g);
    if (!rgb || rgb.length < 3) return;
    const [r, g, b] = rgb.slice(0, 3).map(Number);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (luminance > 0.72) element.classList.add('force-dark-on-light');
  });
}

function goBack() {
  const previous = appState.historyStack.pop();
  if (!previous) {
    switchTab('home');
    return;
  }

  if (previous.view === 'article' && previous.title) {
    openArticle(previous.title, false);
    return;
  }

  switchTab(previous.view || 'home');
}

const getWikiApi = () => `https://${appState.lang}.wikipedia.org/api/rest_v1`;
const getActionApi = () => `https://${appState.lang}.wikipedia.org/w/api.php?origin=*&format=json`;

async function fetchFeed() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  try {
    const response = await fetch(`${getWikiApi()}/feed/featured/${y}/${m}/${d}`);
    if (!response.ok) throw new Error('feed failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchArticleData(title) {
  const saved = getSavedArticles();
  const cached = saved.find((article) => article.title === title);
  if (cached && cached.html) return cached;

  try {
    const [summaryResponse, htmlResponse] = await Promise.all([
      fetch(`${getWikiApi()}/page/summary/${encodeURIComponent(title)}`),
      fetch(`${getWikiApi()}/page/html/${encodeURIComponent(title)}`)
    ]);

    const summary = await summaryResponse.json();
    const htmlText = await htmlResponse.text();
    const documentEl = new DOMParser().parseFromString(htmlText, 'text/html');

    return {
      title: summary.title,
      description: summary.description,
      image: summary.thumbnail ? summary.thumbnail.source.replace(/\/\d+px-/, '/800px-') : null,
      html: documentEl.body.innerHTML
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function doSearch(query) {
  const container = document.getElementById('search-results');
  container.innerHTML = renderLoader('panel-cyan');

  try {
    const response = await fetch(`${getActionApi()}&action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=15&prop=pageimages&pithumbsize=120`);
    const data = await response.json();

    if (!data.query || !data.query.search.length) {
      container.innerHTML = renderErrorPanel('No results', `Nothing found for "${escapeHtml(query)}".`, 'panel-signal');
      return;
    }

    const titles = data.query.search.map((result) => result.title).join('|');
    const thumbsResponse = await fetch(`${getActionApi()}&action=query&titles=${encodeURIComponent(titles)}&prop=pageimages&pithumbsize=240`);
    const thumbsData = await thumbsResponse.json();
    const thumbs = {};

    if (thumbsData.query && thumbsData.query.pages) {
      Object.values(thumbsData.query.pages).forEach((page) => {
        if (page.thumbnail) thumbs[page.title] = page.thumbnail.source;
      });
    }

    container.innerHTML = `
      <div class="grid gap-5 md:grid-cols-2">
        ${data.query.search.map((result, index) => {
          const title = result.title;
          const safeTitle = escapeJsString(title);
          const image = thumbs[title] || '';
          const snippet = result.snippet.replace(/<\/?span[^>]*>/g, '');
          return `
            <article class="panel ${index % 3 === 0 ? 'panel-acid' : index % 3 === 1 ? 'panel-cyan' : 'panel-pink'} lift-on-hover reveal cursor-pointer p-4 md:p-5"
              onclick="openArticle('${safeTitle}')">
              <div class="grid gap-4 sm:grid-cols-2">
                ${renderThumb(image, 'travel_explore', 'h-28 w-full sm:h-28 sm:w-28')}
                <div>
                  <div class="small-label text-cyan">search hit</div>
                  <h3 class="mt-2 font-display text-3xl font-bold uppercase leading-[0.92] tracking-brutal">
                    ${escapeHtml(title)}
                  </h3>
                  <p class="mt-3 text-sm leading-6 text-outline" style="opacity:.78">
                    ${escapeHtml(snippet)}
                  </p>
                </div>
              </div>
            </article>`;
        }).join('')}
      </div>`;

    staggerReveal(container);
  } catch (error) {
    console.error(error);
    container.innerHTML = renderErrorPanel('Search failed', 'Please check your connection and try again.', 'panel-signal');
  }
}

function loadRandom() {
  pulseHaptic();
  fetch(`${getActionApi()}&action=query&generator=random&grnnamespace=0&prop=info`)
    .then((response) => response.json())
    .then((data) => {
      if (data.query && data.query.pages) {
        openArticle(Object.values(data.query.pages)[0].title);
      }
    })
    .catch((error) => console.error(error));
}

function buildTicker(topics) {
  const defaults = ['CoolWiki', 'Wikipedia', 'Signal Feed', 'Search', 'Most Read', 'On This Day', 'Random Drop'];
  const items = topics && topics.length ? topics.concat(defaults) : defaults;
  const track = document.getElementById('ticker-track');
  const all = [...items, ...items];

  track.innerHTML = all.map((item) => `
    <span class="marquee-item">
      <span>${escapeHtml(item)}</span>
    </span>`).join('');
}

function calcReadTime(htmlStr) {
  const text = htmlStr.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function syncHomePanels(feed = null) {
  const saved = getSavedArticles();
  const languageCount = document.getElementById('hero-language-count');
  const languageLabel = document.getElementById('hero-language-label');
  const savedCount = document.getElementById('hero-saved-count');
  const modePill = document.getElementById('hero-mode-pill');
  const featureCard = document.getElementById('hero-feature-card');
  const featureTitle = document.getElementById('hero-feature-title');
  const featureDesc = document.getElementById('hero-feature-desc');
  const heroTrendTitle = document.getElementById('hero-trend-title');
  const heroTrendDesc = document.getElementById('hero-trend-desc');
  const heroLangPill = document.getElementById('hero-lang-pill');
  const heroDatePill = document.getElementById('hero-date-pill');

  languageCount.textContent = '06';
  languageLabel.textContent = `${langNames[appState.lang]} edition active`;
  savedCount.textContent = String(saved.length).padStart(2, '0');
  modePill.textContent = appState.dataSaver ? 'Lean' : 'Live';
  heroLangPill.textContent = `${appState.lang.toUpperCase()} edition`;
  heroDatePill.textContent = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  featureCard.onclick = null;

  if (feed && feed.tfa) {
    featureTitle.textContent = feed.tfa.normalizedtitle || feed.tfa.title;
    featureDesc.textContent = feed.tfa.description || 'Featured article loaded from the daily feed.';
    featureCard.onclick = () => openArticle(feed.tfa.title);
  } else {
    featureTitle.textContent = 'Loading feed';
    featureDesc.textContent = 'Pulling the live edition from Wikipedia right now.';
  }

  if (feed && feed.mostread && feed.mostread.articles && feed.mostread.articles.length) {
    const lead = feed.mostread.articles[0];
    heroTrendTitle.textContent = lead.normalizedtitle || lead.title;
    heroTrendDesc.textContent = `${Number(lead.views).toLocaleString()} views in the ${langNames[appState.lang]} edition.`;
  } else {
    heroTrendTitle.textContent = 'Trending now';
    heroTrendDesc.textContent = 'Waiting for the live most-read signal.';
  }
}

function syncSettingsCopy() {
  const langEl = document.getElementById('settings-lang');
  const descEl = document.getElementById('settings-lang-desc');
  if (!langEl || !descEl) return;
  langEl.textContent = appState.lang.toUpperCase();
  descEl.textContent = `${langNames[appState.lang]} Wikipedia is currently driving feed, search, and article fetches.`;
}

function loadFeed() {
  const container = document.getElementById('feed-content');
  container.innerHTML = renderLoader('panel-acid');
  syncHomePanels();

  fetchFeed().then((feed) => {
    if (!feed) {
      container.innerHTML = renderErrorPanel(
        'Feed offline',
        'Could not reach Wikipedia. Retry when the connection is back.',
        'panel-signal',
        '<button class="cta-btn mt-5 bg-acid px-4 py-3 font-display text-lg font-bold uppercase text-ink" onclick="loadFeed()">Retry</button>'
      );
      return;
    }

    const mostRead = feed.mostread && feed.mostread.articles ? feed.mostread.articles.slice(0, 6) : [];
    const topics = mostRead.slice(0, 6).map((article) => article.normalizedtitle || article.title);
    buildTicker(topics);
    syncHomePanels(feed);

    const tfa = feed.tfa;
    const tfaTitle = tfa ? (tfa.normalizedtitle || tfa.title) : 'No feature';
    const tfaImage = tfa && tfa.thumbnail ? tfa.thumbnail.source.replace(/\/\d+px-/, '/800px-') : '';
    const tfaDesc = tfa && tfa.description ? tfa.description : 'Featured article will appear here when the feed responds.';
    const quickHits = mostRead.slice(0, 3).map((article, index) => `
      <div class="grid gap-2 ${index ? 'mt-4 pt-4' : 'mt-5'}" ${index ? 'style="border-top:3px solid rgba(246,240,230,.16)"' : ''}>
        <div class="small-label text-pink">0${index + 1}</div>
        <div class="font-display text-2xl font-bold uppercase leading-[0.92] tracking-brutal">
          ${escapeHtml(article.normalizedtitle || article.title)}
        </div>
        <p class="text-sm leading-6 text-outline" style="opacity:.78">
          ${escapeHtml(article.description || 'Live from the most-read board.')}
        </p>
      </div>`).join('');

    const otd = feed.onthisday && feed.onthisday.length ? feed.onthisday[0] : null;
    const otdTitle = otd && otd.pages && otd.pages[0] ? (otd.pages[0].normalizedtitle || otd.pages[0].title) : '';
    const otdPage = otd && otd.pages && otd.pages[0] ? otd.pages[0].title : '';
    const otdText = otd ? otd.text : '';
    const todayLabel = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

    container.innerHTML = `
      <section class="grid gap-6 lg:grid-cols-2">
        <article class="panel panel-acid lift-on-hover reveal overflow-hidden ${tfa ? 'cursor-pointer' : ''}"
          ${tfa ? `onclick="openArticle('${escapeJsString(tfa.title)}')"` : ''}>
          ${tfaImage
            ? `<img src="${tfaImage}" alt="${escapeHtml(tfaTitle)}" class="h-72 w-full border-b-3 border-outline object-cover md:h-96" data-optional="true">`
            : `<div class="grid h-72 place-items-center border-b-3 border-outline bg-panel-2 text-acid md:h-96">
                 <span class="material-symbols-outlined text-6xl">grid_view</span>
               </div>`
          }
          <div class="p-5 md:p-6">
            <div class="section-kicker">daily strike</div>
            <h2 class="mt-3 max-w-[10ch] font-display text-4xl font-bold uppercase leading-[0.88] tracking-brutal md:text-6xl">
              ${escapeHtml(tfaTitle)}
            </h2>
            <p class="mt-4 max-w-2xl text-base leading-7 text-outline" style="opacity:.78">
              ${escapeHtml(tfaDesc)}
            </p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="meta-chip border-3 border-outline bg-panel-2 px-3 py-2 text-xs text-acid">
                ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span class="meta-chip border-3 border-outline bg-panel-2 px-3 py-2 text-xs text-cyan">
                Featured read
              </span>
            </div>
          </div>
        </article>

        <div class="grid gap-6">
          <article class="panel panel-cyan reveal p-5 md:p-6">
            <div class="section-kicker">field notes</div>
            <h3 class="mt-3 font-display text-4xl font-bold uppercase leading-[0.9] tracking-brutal md:text-5xl">
              What the feed is shouting.
            </h3>
            <p class="mt-4 text-base leading-7 text-outline" style="opacity:.78">
              Fast highlights from the most-read board right now.
            </p>
            ${quickHits || `
              <div class="mt-5 text-sm leading-6 text-outline" style="opacity:.78">
                Waiting for the live trend signal.
              </div>`}
          </article>

          ${otdTitle && otdPage ? `
            <article class="panel panel-pink lift-on-hover reveal cursor-pointer p-5 md:p-6"
              onclick="openArticle('${escapeJsString(otdPage)}')">
              <div class="section-kicker">on this day</div>
              <div class="mt-3 font-display text-4xl font-bold uppercase leading-[0.88] tracking-brutal md:text-5xl">
                ${escapeHtml(otdTitle)}
              </div>
              <div class="mt-4 text-sm font-medium uppercase tracking-widest text-acid">${todayLabel}</div>
              <p class="mt-4 text-base leading-7 text-outline" style="opacity:.78">
                ${escapeHtml(otdText || 'Historical signal from the archive.')}
              </p>
            </article>` : ''}
        </div>
      </section>

      <section class="panel panel-pink reveal p-5 md:p-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div class="section-kicker">most read</div>
            <h3 class="mt-3 font-display text-4xl font-bold uppercase leading-[0.9] tracking-brutal md:text-6xl">
              Trending board
            </h3>
          </div>
          <div class="small-label text-cyan">${Math.min(5, mostRead.length)} live entries</div>
        </div>

        <div class="mt-5">
          ${mostRead.slice(0, 5).map((article, index) => `
            <button class="lift-on-hover grid w-full gap-4 py-4 text-left md:grid-cols-3"
              onclick="openArticle('${escapeJsString(article.title)}')">
              <div class="font-display text-4xl font-bold leading-none text-acid">
                ${String(index + 1).padStart(2, '0')}
              </div>
              ${renderThumb(article.thumbnail ? article.thumbnail.source : '', 'trending_up', 'h-24 w-full md:h-24 md:w-24')}
              <div>
                <div class="font-display text-3xl font-bold uppercase leading-[0.92] tracking-brutal">
                  ${escapeHtml(article.normalizedtitle || article.title)}
                </div>
                <p class="mt-3 text-sm leading-6 text-outline" style="opacity:.78">
                  ${escapeHtml(article.description || 'Live from the trend board.')}
                </p>
                <div class="mt-3 small-label text-cyan">
                  ${Number(article.views).toLocaleString()} views
                </div>
              </div>
            </button>
            ${index < Math.min(5, mostRead.length) - 1 ? '<div class="feed-divider"></div>' : ''}
          `).join('')}
        </div>
      </section>`;

    staggerReveal(container);
  });
}

function renderSearchHint(query = '') {
  const container = document.getElementById('search-results');
  if (query) return;

  container.innerHTML = `
    <div class="panel panel-pink hint-panel reveal p-5 md:p-7">
      <div class="section-kicker">ready state</div>
      <div class="mt-3 font-display text-3xl font-bold uppercase leading-[0.92] tracking-brutal md:text-5xl">
        Start typing
      </div>
      <p class="mt-4 max-w-xl text-base leading-7 text-outline" style="opacity:.78">
        Search results will stack here as soon as you hit the archive.
      </p>
    </div>`;
  activateReveals(container);
}

function getSavedArticles() {
  try {
    return JSON.parse(localStorage.getItem('cw_saved')) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveCurrentArticle() {
  if (!appState.currentArticle) return;
  pulseHaptic();

  const saved = getSavedArticles();
  const index = saved.findIndex((article) => article.title === appState.currentArticle.title);

  if (index > -1) {
    saved.splice(index, 1);
    els.tbActionIcon.textContent = 'bookmark_add';
    els.tbActionIcon.classList.remove('icon-filled');
  } else {
    saved.push({
      title: appState.currentArticle.title,
      description: appState.currentArticle.description,
      image: appState.currentArticle.image,
      html: appState.currentArticle.html,
      savedAt: Date.now()
    });
    els.tbActionIcon.textContent = 'bookmark_remove';
    els.tbActionIcon.classList.add('icon-filled');
  }

  try {
    localStorage.setItem('cw_saved', JSON.stringify(saved));
  } catch (error) {
    console.error(error);
  }

  syncHomePanels();
}

function loadSaved() {
  const container = document.getElementById('saved-list');
  const saved = getSavedArticles().sort((a, b) => b.savedAt - a.savedAt);

  if (!saved.length) {
    container.innerHTML = renderErrorPanel(
      'Nothing saved',
      'Articles you bookmark will land here for offline reading.',
      'panel-cyan'
    );
    return;
  }

  container.innerHTML = `
    <div class="grid gap-5 md:grid-cols-2">
      ${saved.map((article, index) => {
        const image = article.image ? article.image.replace(/800px-/, '400px-') : '';
        const date = new Date(article.savedAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        return `
          <article class="panel ${index % 2 === 0 ? 'panel-acid' : 'panel-cyan'} lift-on-hover reveal cursor-pointer p-4 md:p-5"
            onclick="openArticle('${escapeJsString(article.title)}')">
            <div class="grid gap-4 sm:grid-cols-2">
              ${renderThumb(image, 'bookmark', 'h-28 w-full sm:h-28 sm:w-28')}
              <div>
                <div class="small-label text-pink">saved ${escapeHtml(date)}</div>
                <h3 class="mt-2 font-display text-3xl font-bold uppercase leading-[0.92] tracking-brutal">
                  ${escapeHtml(article.title)}
                </h3>
                <p class="mt-3 text-sm leading-6 text-outline" style="opacity:.78">
                  ${escapeHtml(article.description || 'Saved article.')}
                </p>
              </div>
            </div>
          </article>`;
      }).join('')}
    </div>`;

  staggerReveal(container);
}

function applyPreferences() {
  document.documentElement.dataset.dataSaver = String(appState.dataSaver);
  document.documentElement.style.setProperty('--reader-size', appState.fontSize);
  document.getElementById('data-switch').classList.toggle('on', appState.dataSaver);
  document.getElementById('font-select').value = appState.fontSize;
  syncHomePanels();
  syncSettingsCopy();
}

function toggleDataSaver() {
  appState.dataSaver = !appState.dataSaver;
  localStorage.setItem('cw_data_saver', String(appState.dataSaver));
  applyPreferences();
}

function setFontSize(value) {
  appState.fontSize = value;
  localStorage.setItem('cw_font_size', value);
  applyPreferences();
}

function changeLang(value) {
  appState.lang = value;
  localStorage.setItem('cw_lang', value);
  syncHomePanels();
  syncSettingsCopy();
  loadFeed();

  const activeQuery = document.getElementById('search-input').value.trim();
  if (activeQuery) doSearch(activeQuery);
}

function pulseHaptic() {
  if (navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) {
    navigator.vibrate(10);
  }
}

function initRevealObserver() {
  if (revealObserver) revealObserver.disconnect();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealObserver = null;
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {
    root: els.mainScroll,
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });
}

function activateReveals(root = document) {
  const items = root && root.querySelectorAll ? root.querySelectorAll('.reveal') : [];
  if (!items.length) return;

  if (!revealObserver) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  items.forEach((item) => {
    if (item.classList.contains('is-visible')) return;
    revealObserver.observe(item);
  });
}

function staggerReveal(root) {
  root.querySelectorAll('.reveal').forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  });
  activateReveals(root);
}

function renderThumb(image, fallbackIcon, sizeClasses) {
  if (image) {
    return `
      <div class="feed-thumb ${sizeClasses} border-3 border-outline" style="background-image:url(${image})" data-optional="true"></div>`;
  }

  return `
    <div class="${sizeClasses} grid place-items-center border-3 border-outline bg-panel-2 text-cyan">
      <span class="material-symbols-outlined text-3xl">${fallbackIcon}</span>
    </div>`;
}

function renderLoader(panelClass = 'panel-acid') {
  return `
    <div class="panel ${panelClass} loader-box p-6">
      <div class="loader"></div>
    </div>`;
}

function renderErrorPanel(title, copy, panelClass = 'panel-signal', extra = '') {
  return `
    <div class="panel ${panelClass} error-panel p-5 md:p-7">
      <div class="section-kicker">error state</div>
      <div class="mt-3 font-display text-3xl font-bold uppercase leading-[0.92] tracking-brutal md:text-5xl">
        ${escapeHtml(title)}
      </div>
      <p class="mt-4 max-w-xl text-base leading-7 text-outline" style="opacity:.78">
        ${escapeHtml(copy)}
      </p>
      ${extra}
    </div>`;
}

init();
