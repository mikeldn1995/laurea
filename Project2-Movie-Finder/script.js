/* ========================================
   Movie Finder — OMDB API
   Project 2: The Live Data Explorer
   Author: Mike
   ======================================== */

'use strict';

// ---------- API ----------
const OMDB_BASE = 'https://www.omdbapi.com/';
const OMDB_DEMO_KEY = 'thewdb';
const PAGE_SIZE = 10;

// ---------- i18n ----------
const translations = {
    en: {
        appTitle: 'Movie Finder',
        tagline: 'Search the OMDB database — plots, cast, ratings and posters, all in one place.',
        filterHeading: 'Search and filters',
        searchLabel: 'Search title',
        searchPlaceholder: 'Try: Batman, Inception, The Matrix…',
        typeLabel: 'Type',
        typeAny: 'Any',
        typeMovie: 'Movie',
        typeSeries: 'Series',
        typeEpisode: 'Episode',
        yearLabel: 'Year',
        yearPlaceholder: 'e.g. 2019',
        searchBtn: 'Search',
        recentLabel: 'Recent:',
        welcomeTitle: 'Find any movie',
        welcomeBody: 'Search by title to explore posters, plots, cast and ratings from the OMDB movie database.',
        tryLabel: 'Try:',
        loading: 'Loading results…',
        loadingDetails: 'Loading details…',
        errorTitle: 'Something went wrong',
        errorNetwork: 'Could not reach OMDB. Check your internet connection and try again.',
        errorKey: 'Your OMDB key was rejected. Tap the key icon in the header to update it.',
        errorLimit: 'OMDB daily request limit reached. Try again tomorrow or use another key.',
        errorNoResults: 'No matches — try a different title or year.',
        errorGeneric: 'OMDB returned an error. Please try again.',
        retry: 'Try again',
        empty: 'No results match your search.',
        loadMore: 'Load more',
        footerData: 'Data from <a href="https://www.omdbapi.com/" target="_blank" rel="noopener">OMDB API</a>',
        footerBuild: 'Built with vanilla JavaScript · Laurea UAS',
        settingsTitle: 'Set up your OMDB API key',
        settingsDesc: "OMDB requires a free personal API key. Grab one from omdbapi.com and paste it below — it's stored in your browser only.",
        apiKeyLabel: 'OMDB API key',
        getKey: 'Get a free key',
        saveKey: 'Save key',
        settingsHint: 'Your key stays in localStorage and is never sent anywhere except OMDB.',
        resultCount: (n, total) => total ? `${n} of ${total} results shown` : `${n} ${n === 1 ? 'result' : 'results'}`,
        minutes: 'min',
        plotLabel: 'Plot',
        castLabel: 'Cast',
        directorLabel: 'Director',
        writerLabel: 'Writer',
        genreLabel: 'Genre',
        languageLabel: 'Language',
        countryLabel: 'Country',
        releasedLabel: 'Released',
        awardsLabel: 'Awards',
        boxOfficeLabel: 'Box office',
        ratingsLabel: 'Ratings',
        viewOnImdb: 'View on IMDb',
        invalidKey: 'That key didn\'t work. Double-check and try again.',
        langCode: 'EN',
        htmlLang: 'en',
    },
    fi: {
        appTitle: 'Elokuvahaku',
        tagline: 'Selaa OMDB-tietokantaa — juonet, näyttelijät, arvostelut ja julisteet yhdessä paikassa.',
        filterHeading: 'Haku ja suodattimet',
        searchLabel: 'Hae nimellä',
        searchPlaceholder: 'Esim. Batman, Inception, The Matrix…',
        typeLabel: 'Tyyppi',
        typeAny: 'Kaikki',
        typeMovie: 'Elokuva',
        typeSeries: 'Sarja',
        typeEpisode: 'Jakso',
        yearLabel: 'Vuosi',
        yearPlaceholder: 'Esim. 2019',
        searchBtn: 'Hae',
        recentLabel: 'Viimeisimmät:',
        welcomeTitle: 'Löydä mikä tahansa elokuva',
        welcomeBody: 'Hae nimellä ja tutki julisteita, juonia, näyttelijöitä ja arvosteluja OMDB-tietokannasta.',
        tryLabel: 'Kokeile:',
        loading: 'Ladataan tuloksia…',
        loadingDetails: 'Ladataan tietoja…',
        errorTitle: 'Jotain meni pieleen',
        errorNetwork: 'OMDB:hen ei saatu yhteyttä. Tarkista verkko ja yritä uudelleen.',
        errorKey: 'API-avain hylättiin. Päivitä se yläpalkin avainkuvakkeesta.',
        errorLimit: 'OMDB:n päiväkohtainen raja täynnä. Yritä huomenna tai käytä toista avainta.',
        errorNoResults: 'Ei osumia — kokeile toista hakua tai vuotta.',
        errorGeneric: 'OMDB palautti virheen. Yritä uudelleen.',
        retry: 'Yritä uudelleen',
        empty: 'Haulla ei löytynyt tuloksia.',
        loadMore: 'Lataa lisää',
        footerData: 'Tiedot: <a href="https://www.omdbapi.com/" target="_blank" rel="noopener">OMDB API</a>',
        footerBuild: 'Rakennettu puhtaalla JavaScriptillä · Laurea-AMK',
        settingsTitle: 'Aseta OMDB API -avain',
        settingsDesc: 'OMDB vaatii henkilökohtaisen ilmaisen API-avaimen. Hae se osoitteesta omdbapi.com ja liitä se tähän — avain tallennetaan vain selaimeesi.',
        apiKeyLabel: 'OMDB API -avain',
        getKey: 'Hae ilmainen avain',
        saveKey: 'Tallenna',
        settingsHint: 'Avain pysyy localStoragessa, eikä sitä lähetetä muualle kuin OMDB:hen.',
        resultCount: (n, total) => total ? `${n} / ${total} tulosta näkyvissä` : `${n} ${n === 1 ? 'tulos' : 'tulosta'}`,
        minutes: 'min',
        plotLabel: 'Juoni',
        castLabel: 'Näyttelijät',
        directorLabel: 'Ohjaaja',
        writerLabel: 'Käsikirjoitus',
        genreLabel: 'Genre',
        languageLabel: 'Kieli',
        countryLabel: 'Maa',
        releasedLabel: 'Julkaistu',
        awardsLabel: 'Palkinnot',
        boxOfficeLabel: 'Lipputulot',
        ratingsLabel: 'Arvostelut',
        viewOnImdb: 'Avaa IMDb:ssä',
        invalidKey: 'Avain ei toiminut. Tarkista ja yritä uudelleen.',
        langCode: 'FI',
        htmlLang: 'fi',
    },
};

// ---------- State ----------
const state = {
    lang: 'en',
    theme: 'light',
    apiKey: '',
    query: '',
    type: '',
    year: '',
    page: 1,
    totalResults: 0,
    results: [],
    recents: [],
    lastFocus: null,
    detailsCache: new Map(),
};

// ---------- DOM refs ----------
const dom = {
    settingsBtn: document.getElementById('settings-btn'),
    langBtn: document.getElementById('lang-toggle'),
    themeBtn: document.getElementById('dark-mode-toggle'),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    typeSelect: document.getElementById('type-select'),
    yearInput: document.getElementById('year-input'),
    results: document.getElementById('results'),
    welcome: document.getElementById('welcome-state'),
    loading: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),
    empty: document.getElementById('empty-state'),
    eventsGrid: document.getElementById('events-grid'),
    loadMoreWrap: document.getElementById('load-more-wrapper'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    resultMeta: document.getElementById('result-meta'),
    recentRow: document.getElementById('recent-row'),
    recentChips: document.getElementById('recent-chips'),
    clearRecents: document.getElementById('clear-recents'),
    modal: document.getElementById('modal'),
    modalBody: document.getElementById('modal-body'),
    settingsModal: document.getElementById('settings-modal'),
    settingsForm: document.getElementById('settings-form'),
    apiKeyInput: document.getElementById('api-key-input'),
};

// ---------- Utilities ----------
function t(key) {
    return translations[state.lang][key];
}

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValue(v) {
    return v && v !== 'N/A';
}

// ---------- Storage ----------
const storage = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* storage blocked */
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch {
            /* storage blocked */
        }
    },
};

// ---------- OMDB fetch ----------
async function omdbFetch(params) {
    const url = new URL(OMDB_BASE);
    url.searchParams.set('apikey', state.apiKey || OMDB_DEMO_KEY);
    for (const [k, v] of Object.entries(params)) {
        if (v) url.searchParams.set(k, v);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data && data.Response === 'False') {
        const err = new Error(data.Error || 'Unknown OMDB error');
        err.omdbError = data.Error || 'Unknown';
        throw err;
    }
    return data;
}

async function searchMovies(query, { page = 1, type = '', year = '' } = {}) {
    return omdbFetch({ s: query, type, y: year, page });
}

async function fetchMovieById(imdbID) {
    if (state.detailsCache.has(imdbID)) {
        return state.detailsCache.get(imdbID);
    }
    const details = await omdbFetch({ i: imdbID, plot: 'full' });
    state.detailsCache.set(imdbID, details);
    return details;
}

// ---------- State helpers ----------
function showOnly(el) {
    const containers = [
        dom.welcome,
        dom.loading,
        dom.errorState,
        dom.empty,
        dom.eventsGrid,
    ];
    for (const c of containers) {
        if (!c) continue;
        c.hidden = c !== el;
    }
    dom.loadMoreWrap.hidden = el !== dom.eventsGrid || state.results.length >= state.totalResults;
}

function setBusy(on) {
    dom.results.setAttribute('aria-busy', on ? 'true' : 'false');
}

function showLoading() {
    dom.loading.querySelector('p').textContent = t('loading');
    showOnly(dom.loading);
    setBusy(true);
}

function showError(messageKey) {
    dom.errorMessage.textContent = t(messageKey);
    showOnly(dom.errorState);
    setBusy(false);
}

function showEmpty() {
    dom.empty.querySelector('p').textContent = t('empty');
    showOnly(dom.empty);
    setBusy(false);
}

function showWelcome() {
    showOnly(dom.welcome);
    dom.resultMeta.textContent = '';
    setBusy(false);
}

// ---------- Rendering ----------
function renderResults({ append = false } = {}) {
    if (state.results.length === 0) {
        showEmpty();
        dom.resultMeta.textContent = '';
        return;
    }

    showOnly(dom.eventsGrid);
    setBusy(false);

    if (!append) {
        dom.eventsGrid.innerHTML = state.results.map(cardHTML).join('');
    } else {
        const startIndex = dom.eventsGrid.children.length;
        const newCards = state.results.slice(startIndex).map(cardHTML).join('');
        dom.eventsGrid.insertAdjacentHTML('beforeend', newCards);
    }

    attachCardListeners();
    refreshIcons();

    dom.resultMeta.textContent = t('resultCount')(state.results.length, state.totalResults);
    dom.loadMoreWrap.hidden = state.results.length >= state.totalResults;
}

function cardHTML(movie) {
    const title = escapeHTML(movie.Title || '');
    const year = escapeHTML(movie.Year || '');
    const type = escapeHTML(movie.Type || 'movie');
    const poster = isValue(movie.Poster) ? movie.Poster : '';

    return `
        <button class="movie-card" data-id="${escapeHTML(movie.imdbID)}" aria-label="${title}">
            <div class="poster-wrapper">
                ${poster
                    ? `<img class="poster-img" src="${escapeHTML(poster)}" alt="${title} poster" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="poster-fallback" style="display:none;"><i data-lucide="film"></i></div>`
                    : `<div class="poster-fallback"><i data-lucide="film"></i></div>`}
                <span class="type-badge">${type}</span>
                ${year ? `<span class="year-badge">${year}</span>` : ''}
            </div>
            <div class="card-body">
                <h3 class="card-title">${title}</h3>
                <div class="card-meta">
                    <span><i data-lucide="calendar"></i>${year}</span>
                </div>
            </div>
        </button>
    `;
}

function attachCardListeners() {
    dom.eventsGrid.querySelectorAll('.movie-card').forEach((card) => {
        if (card.dataset.listener === '1') return;
        card.dataset.listener = '1';
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            if (id) openDetails(id);
        });
    });
}

// ---------- Details modal ----------
async function openDetails(imdbID) {
    state.lastFocus = document.activeElement;
    dom.modalBody.innerHTML = `
        <div class="settings-body" style="text-align:center;">
            <div class="spinner" style="margin: 1rem auto;"></div>
            <p>${t('loadingDetails')}</p>
        </div>
    `;
    dom.modal.hidden = false;
    document.body.classList.add('modal-open');

    try {
        const movie = await fetchMovieById(imdbID);
        dom.modalBody.innerHTML = movieDetailHTML(movie);
        refreshIcons();

        const closeBtn = dom.modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    } catch (err) {
        console.error('Details failed:', err);
        dom.modalBody.innerHTML = `
            <div class="settings-body">
                <h2>${t('errorTitle')}</h2>
                <p class="settings-desc">${escapeHTML(err.message)}</p>
            </div>
        `;
    }
}

function movieDetailHTML(movie) {
    const title = escapeHTML(movie.Title);
    const year = escapeHTML(movie.Year);
    const rated = isValue(movie.Rated) ? escapeHTML(movie.Rated) : '';
    const runtime = isValue(movie.Runtime) ? escapeHTML(movie.Runtime) : '';
    const genre = isValue(movie.Genre) ? escapeHTML(movie.Genre) : '';
    const plot = isValue(movie.Plot) ? escapeHTML(movie.Plot) : '';
    const director = isValue(movie.Director) ? escapeHTML(movie.Director) : '';
    const writer = isValue(movie.Writer) ? escapeHTML(movie.Writer) : '';
    const released = isValue(movie.Released) ? escapeHTML(movie.Released) : '';
    const awards = isValue(movie.Awards) ? escapeHTML(movie.Awards) : '';
    const language = isValue(movie.Language) ? escapeHTML(movie.Language) : '';
    const country = isValue(movie.Country) ? escapeHTML(movie.Country) : '';
    const boxOffice = isValue(movie.BoxOffice) ? escapeHTML(movie.BoxOffice) : '';
    const imdbRating = isValue(movie.imdbRating) ? escapeHTML(movie.imdbRating) : '';
    const poster = isValue(movie.Poster) ? movie.Poster : '';
    const imdbLink = movie.imdbID ? `https://www.imdb.com/title/${encodeURIComponent(movie.imdbID)}/` : '';

    const actors = isValue(movie.Actors)
        ? movie.Actors.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    const ratings = Array.isArray(movie.Ratings) ? movie.Ratings : [];

    return `
        <div class="modal-hero">
            ${poster
                ? `<img src="${escapeHTML(poster)}" alt="">
                   <div class="hero-poster"><img src="${escapeHTML(poster)}" alt="${title} poster" loading="lazy"></div>`
                : ''}
        </div>
        <div class="modal-info">
            <h2 id="modal-title" class="modal-title">${title}</h2>
            ${year ? `<p class="modal-subtitle">${year}${released ? ` · ${released}` : ''}</p>` : ''}

            <div class="modal-meta">
                ${rated ? `<span class="chip chip-rated"><i data-lucide="shield"></i>${rated}</span>` : ''}
                ${runtime ? `<span class="chip"><i data-lucide="clock"></i>${runtime}</span>` : ''}
                ${genre ? `<span class="chip"><i data-lucide="tag"></i>${genre}</span>` : ''}
                ${imdbRating ? `<span class="chip chip-imdb"><i data-lucide="star"></i>${imdbRating} IMDb</span>` : ''}
            </div>

            ${plot ? `
                <section class="modal-section">
                    <h3>${t('plotLabel')}</h3>
                    <p>${plot}</p>
                </section>` : ''}

            ${actors.length ? `
                <section class="modal-section">
                    <h3>${t('castLabel')}</h3>
                    <div class="pill-list">
                        ${actors.map((a) => `<span>${escapeHTML(a)}</span>`).join('')}
                    </div>
                </section>` : ''}

            ${ratings.length ? `
                <section class="modal-section">
                    <h3>${t('ratingsLabel')}</h3>
                    <div class="ratings-grid">
                        ${ratings.map((r) => `
                            <div class="rating-box">
                                <span class="rating-source">${escapeHTML(r.Source)}</span>
                                <span class="rating-value">${escapeHTML(r.Value)}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>` : ''}

            <div class="fact-grid">
                ${director ? factHTML(t('directorLabel'), director) : ''}
                ${writer ? factHTML(t('writerLabel'), writer) : ''}
                ${language ? factHTML(t('languageLabel'), language) : ''}
                ${country ? factHTML(t('countryLabel'), country) : ''}
                ${awards ? factHTML(t('awardsLabel'), awards) : ''}
                ${boxOffice ? factHTML(t('boxOfficeLabel'), boxOffice) : ''}
            </div>

            ${imdbLink ? `
                <a class="btn-primary" href="${escapeHTML(imdbLink)}" target="_blank" rel="noopener">
                    <i data-lucide="external-link"></i>
                    <span>${t('viewOnImdb')}</span>
                </a>` : ''}
        </div>
    `;
}

function factHTML(label, value) {
    return `
        <div class="fact">
            <span class="fact-label">${escapeHTML(label)}</span>
            <span class="fact-value">${value}</span>
        </div>
    `;
}

function closeModal() {
    dom.modal.hidden = true;
    document.body.classList.remove('modal-open');
    dom.modalBody.innerHTML = '';
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
        state.lastFocus.focus();
    }
}

// ---------- Settings modal ----------
function openSettings() {
    state.lastFocus = document.activeElement;
    dom.apiKeyInput.value = state.apiKey;
    dom.settingsModal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => dom.apiKeyInput.focus(), 50);
}

function closeSettings() {
    dom.settingsModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
        state.lastFocus.focus();
    }
}

async function saveApiKey(key) {
    const trimmed = key.trim();
    if (!trimmed) return;
    state.apiKey = trimmed;
    storage.set('mf_apiKey', trimmed);
    closeSettings();
    if (state.query) runSearch({ reset: true });
}

// ---------- Search flows ----------
async function runSearch({ reset = true } = {}) {
    if (!state.query) {
        showWelcome();
        return;
    }

    if (reset) {
        state.page = 1;
        state.results = [];
        state.totalResults = 0;
        showLoading();
    }

    try {
        const data = await searchMovies(state.query, {
            page: state.page,
            type: state.type,
            year: state.year,
        });

        state.totalResults = parseInt(data.totalResults, 10) || 0;
        const fresh = Array.isArray(data.Search) ? data.Search : [];

        if (reset) {
            state.results = fresh;
        } else {
            state.results = [...state.results, ...fresh];
        }

        renderResults({ append: !reset });
        addRecent(state.query);
    } catch (err) {
        console.error('Search failed:', err);
        const msg = err.omdbError || err.message || '';
        if (/invalid api key/i.test(msg) || /no api key/i.test(msg)) {
            showError('errorKey');
        } else if (/daily limit/i.test(msg) || /request limit/i.test(msg)) {
            showError('errorLimit');
        } else if (/movie not found|too many results|incorrect imdb/i.test(msg)) {
            showEmpty();
            state.results = [];
            state.totalResults = 0;
            dom.resultMeta.textContent = '';
        } else if (/failed to fetch/i.test(err.message)) {
            showError('errorNetwork');
        } else {
            showError('errorGeneric');
        }
    }
}

async function loadMore() {
    state.page += 1;
    dom.loadMoreBtn.disabled = true;
    try {
        await runSearch({ reset: false });
    } finally {
        dom.loadMoreBtn.disabled = false;
    }
}

function handleSubmit(e) {
    e.preventDefault();
    const q = dom.searchInput.value.trim();
    if (q.length < 2) return;
    state.query = q;
    state.type = dom.typeSelect.value;
    state.year = dom.yearInput.value.trim();
    runSearch({ reset: true });
}

// ---------- Recent searches ----------
function addRecent(query) {
    const key = query.trim();
    if (!key) return;
    state.recents = [key, ...state.recents.filter((r) => r.toLowerCase() !== key.toLowerCase())].slice(0, 6);
    storage.set('mf_recents', state.recents);
    renderRecents();
}

function renderRecents() {
    if (!state.recents.length) {
        dom.recentRow.hidden = true;
        return;
    }
    dom.recentRow.hidden = false;
    dom.recentChips.innerHTML = state.recents.map((r) =>
        `<button type="button" class="recent-chip" data-q="${escapeHTML(r)}">${escapeHTML(r)}</button>`
    ).join('');
    dom.recentChips.querySelectorAll('.recent-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            dom.searchInput.value = chip.dataset.q;
            state.query = chip.dataset.q;
            runSearch({ reset: true });
        });
    });
}

function clearRecents() {
    state.recents = [];
    storage.remove('mf_recents');
    renderRecents();
}

// ---------- Theme & Language ----------
function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storage.set('mf_theme', theme);
}

function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function applyLang(lang) {
    state.lang = lang;
    document.documentElement.setAttribute('lang', translations[lang].htmlLang);
    document.documentElement.setAttribute('data-lang', lang);
    dom.langBtn.querySelector('.lang-label').textContent = lang === 'en' ? 'FI' : 'EN';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const value = translations[lang][key];
        if (value === undefined) return;
        if (key === 'footerData') {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        const pair = el.getAttribute('data-i18n-attr');
        const [attr, key] = pair.split(':');
        if (translations[lang][key]) {
            el.setAttribute(attr, translations[lang][key]);
        }
    });

    storage.set('mf_lang', lang);

    if (state.query && state.results.length) {
        dom.resultMeta.textContent = t('resultCount')(state.results.length, state.totalResults);
    }
}

function toggleLang() {
    applyLang(state.lang === 'en' ? 'fi' : 'en');
}

// ---------- Icons ----------
function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// ---------- Init ----------
function loadSavedPrefs() {
    const savedTheme = storage.get('mf_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    }

    const savedLang = storage.get('mf_lang');
    if (savedLang === 'en' || savedLang === 'fi') {
        state.lang = savedLang;
    } else if ((navigator.language || '').toLowerCase().startsWith('fi')) {
        state.lang = 'fi';
    }

    const savedKey = storage.get('mf_apiKey');
    if (typeof savedKey === 'string' && savedKey) {
        state.apiKey = savedKey;
    } else {
        state.apiKey = OMDB_DEMO_KEY;
    }

    const savedRecents = storage.get('mf_recents');
    if (Array.isArray(savedRecents)) {
        state.recents = savedRecents.filter((r) => typeof r === 'string');
    }
}

function wireEvents() {
    dom.settingsBtn.addEventListener('click', openSettings);
    dom.langBtn.addEventListener('click', toggleLang);
    dom.themeBtn.addEventListener('click', toggleTheme);

    dom.searchForm.addEventListener('submit', handleSubmit);

    dom.searchInput.addEventListener('input', () => {
        dom.clearSearch.hidden = !dom.searchInput.value;
    });

    dom.clearSearch.addEventListener('click', () => {
        dom.searchInput.value = '';
        dom.clearSearch.hidden = true;
        dom.searchInput.focus();
        if (state.query) {
            state.query = '';
            showWelcome();
        }
    });

    dom.retryBtn.addEventListener('click', () => {
        if (state.query) runSearch({ reset: true });
    });

    dom.loadMoreBtn.addEventListener('click', loadMore);

    dom.clearRecents.addEventListener('click', clearRecents);

    document.querySelectorAll('.suggestion-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const q = btn.dataset.q;
            if (!q) return;
            dom.searchInput.value = q;
            state.query = q;
            state.type = dom.typeSelect.value;
            state.year = dom.yearInput.value.trim();
            runSearch({ reset: true });
        });
    });

    dom.modal.addEventListener('click', (e) => {
        if (e.target.matches('[data-close]')) closeModal();
    });

    dom.settingsModal.addEventListener('click', (e) => {
        if (e.target.matches('[data-close-settings]')) closeSettings();
    });

    dom.settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveApiKey(dom.apiKeyInput.value);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!dom.modal.hidden) closeModal();
            else if (!dom.settingsModal.hidden) closeSettings();
        }
    });
}

function init() {
    loadSavedPrefs();
    applyLang(state.lang);

    wireEvents();
    renderRecents();
    refreshIcons();

    showWelcome();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
