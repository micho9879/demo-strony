/* ============================================================
   TESTY UDT — Logika SPA v8
   Light/Dark mode · Postęp w menu · Firebase Firestore Auth
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, onSnapshot, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxts_hKjSLjPLDtGcYglzVMrIBUfKsch4",
  authDomain: "testy-udt-kursy.firebaseapp.com",
  projectId: "testy-udt-kursy",
  storageBucket: "testy-udt-kursy.firebasestorage.app",
  messagingSenderId: "295571460947",
  appId: "1:295571460947:web:5c8a6bdc43777e233c07a6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── SVG IKONY ──────────────────────────────────────────────

const IC_FILES = {
  crane_hds: 'zurawie-przenosne.svg',
  fork_std: 'wozki-podnosnikowe.svg',
  crane_mob: 'zurawie-samojezdne.svg',
  platform: 'podesty.svg',
  fork_spec: 'wozki-specjalizowane.svg',
  bridge: 'suwnice.svg'
};

const GITHUB_RAW = 'https://raw.githubusercontent.com/bhpcomplexwloszczowa/zdjecia-udt/main';

async function loadSvg(el, name) {
  if (I[name]) { el.innerHTML = I[name]; return; }
  try {
    const r = await fetch(GITHUB_RAW + '/icons/' + IC_FILES[name]);
    let svg = await r.text();
    svg = svg.replace(/<\?xml.*?\?>\s*/i, '')
      .replace(/fill="#[A-Fa-f0-9]{6}"/gi, 'fill="currentColor"')
      .replace(/<svg([^>]*)>/i, '<svg$1 fill="currentColor">');
    I[name] = svg;
    if (el) el.innerHTML = svg;
  } catch (e) { }
}

const I = {
  exc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="8" height="6" rx="1"/><path d="M8 17h6"/><path d="M5 14V8a1 1 0 0 1 1-1h2l3 3h4a1 1 0 0 1 1 1v3"/><path d="M15 7l-3-3"/></svg>`,
  chR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  chL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  aL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  aR: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.3 9.3"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
  alrt: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  clk: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  brain: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>`,
  fChk: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>`,
  chkC: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  xC: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  rot: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  out: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  play: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  flag: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
  flagFill: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
  clip: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,

  // Ikony motywu
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,

  // Pokaż/ukryj hasło
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`,

  // Ikony grup i podkategorii
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  helmet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 15V7a2 2 0 0 1 2-2v0a6 6 0 0 1 6 6v4"/><path d="M6 15v-3a6 6 0 0 1 4-5.65"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

// ─── STAŁE ──────────────────────────────────────────────────
const LT = 'ABCD';
const LS_AUTH = 'udt_auth';
const LS_PROGRESS = 'udt_progress';
const LS_THEME = 'udt_theme';
const LS_HARD = 'udt_hard';
const EXAM_N = 15;
const EXAM_T = 30 * 60;
const PASS_COUNT = 11;

// Zmienna przechowująca pobrane ustawienia egzaminu z CMS
const EXAM_RULES = {};

// ─── GENERATOR EGZAMINU ────────────────────────────
function generateExam(allQs, cat) {
  const conf = EXAM_RULES[cat] || { rules: [] };
  const rules = conf.rules || [];

  let exam = [];
  let usedIds = new Set();

  for (const rule of rules) {
    let rulePool = allQs.filter(q => {
      if (usedIds.has(q.id)) return false;
      return rule.ranges.some(([min, max]) => q.id >= min && q.id <= max);
    });
    
    let pickedRule = shuf(rulePool).slice(0, rule.count);
    pickedRule.forEach(q => { exam.push(q); usedIds.add(q.id); });
  }

  // W razie gdyby zdefiniowane reguły nie ułożyły wystarczająco pytań (np. braki w konfiguracji CMS)
  // i egzamin miał mniej niż 15 pytań, dobieramy losowo cokolwiek ze wszystkich, żeby zapobiec błędom
  if (exam.length < 15) {
    let needed = 15 - exam.length;
    let fallback = shuf(allQs.filter(q => !usedIds.has(q.id))).slice(0, needed);
    fallback.forEach(q => exam.push(q));
  }

  return shuf(exam);
}

const CATS = {
  'wozki-podnosnikowe': { label: 'Wózki widłowe podnośnikowe', desc: 'Obsługa wózków jezdniowych podnośnikowych', ic: 'fork_std' },
  'wozki-specjalizowane': { label: 'Wózki widłowe specjalizowane', desc: 'Obsługa wózków jezdniowych specjalizowanych', ic: 'fork_spec' },
  'podesty': { label: 'Podesty ruchome przejezdne', desc: 'Obsługa podestów ruchomych przejezdnych', ic: 'platform' },
  'zurawie-przenosne': { label: 'Żurawie przenośne i przewoźne', desc: 'Obsługa żurawi HDS, przenośnych i przewoźnych', ic: 'crane_hds' },
  'zurawie-samojezdne': { label: 'Żurawie samojezdne', desc: 'Obsługa żurawi samojezdnych', ic: 'crane_mob' },
  'suwnice': { label: 'Suwnice', desc: 'Obsługa suwnic sterowanych z poziomu roboczego', ic: 'bridge' },
  'bhp-1': { label: 'BHP Moduł 1', desc: 'Ogólne zasady BHP', ic: 'helmet' },
  'bhp-2': { label: 'BHP Moduł 2', desc: 'Wypadki i pierwsza pomoc', ic: 'helmet' },
  'bhp-3': { label: 'BHP Moduł 3', desc: 'Ochrona przeciwpożarowa', ic: 'helmet' },
  'bhp-4': { label: 'BHP Moduł 4', desc: 'Czynniki szkodliwe na stanowisku', ic: 'helmet' }
};

// ─── GRUPY (Poziom 1 nawigacji) ────────────────────────────
const GROUPS = {
  udt: {
    label: 'Szkolenia UDT',
    desc: 'TESTY UDT - Szkolenie operatorów urządzeń transportu bliskiego.',
    ic: 'udt_group',
    icons: ['wozki-podnosnikowe.svg', 'zurawie-przenosne.svg', 'podesty.svg', 'wozki-specjalizowane.svg', 'suwnice.svg'],
    cats: ['wozki-podnosnikowe', 'wozki-specjalizowane', 'podesty', 'zurawie-przenosne', 'zurawie-samojezdne', 'suwnice'],
  },
  bhp: {
    label: 'Szkolenia BHP',
    desc: 'Bezpieczeństwo i Higiena Pracy',
    ic: 'helmet',
    icons: ['helmet.svg'],
    cats: ['bhp-1', 'bhp-2', 'bhp-3', 'bhp-4'],
  }
};

// ─── STAN ───────────────────────────────────────────────────
const S = {
  group: null, cat: null, qs: [], opisy: [],
  bi: 0,
  ti: 0, tAns: false,
  eq: [], ei: 0, ea: [], et: EXAM_T, eInt: null,
  catTotals: {},
};

const $ = id => document.getElementById(id);
const appEl = $('app');

// ═══════════════════════════════════════════════════════════
// LIGHT / DARK MODE
// ═══════════════════════════════════════════════════════════
const themeBtn = $('theme-toggle');

/** Ustawia motyw i aktualizuje ikonę przycisku */
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeBtn.innerHTML = I.moon;
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.innerHTML = I.sun;
  }
}

function initTheme() {
  const saved = localStorage.getItem(LS_THEME);
  applyTheme(saved === 'light' ? 'light' : 'dark');
}

themeBtn.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  localStorage.setItem(LS_THEME, next);
  applyTheme(next);
});

// ─── LIGHTBOX (Natywne gesty: Pinch, Pan, Double-Tap, Wheel) ─
const lb = $('lb'), lbi = $('lb-img'), lbx = $('lb-x');
const lbVp = $('lb-vp');
lbi.addEventListener('contextmenu', e => e.preventDefault());
lbVp.addEventListener('contextmenu', e => e.preventDefault());

// ── Stan zooma ──
const Z = { s: 1, tx: 0, ty: 0, MIN: 1, MAX: 5 };
let rafId = null;

// Renderuj transform przez RAF (płynność 60/120fps)
function zApply() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    // Kolejność: scale() translate() — przy center center daje focal point zoom
    lbi.style.transform = `scale(${Z.s}) translate(${Z.tx}px, ${Z.ty}px)`;
    rafId = null;
  });
}

// Oblicz wyświetlany rozmiar obrazka (bez transformacji)
function getDisplaySize() {
  const vw = lbVp.clientWidth * 0.96;  // max-width: 96vw
  const vh = lbVp.clientHeight * 0.92; // max-height: 92vh
  const nw = lbi.naturalWidth || 1;
  const nh = lbi.naturalHeight || 1;
  const ratio = Math.min(vw / nw, vh / nh, 1); // nigdy nie powiększaj ponad oryginał
  return { w: nw * ratio, h: nh * ratio };
}

// Ogranicz pan — obrazek nie może uciec za krawędź
function zClamp() {
  if (Z.s <= 1) { Z.tx = 0; Z.ty = 0; return; }
  const vw = lbVp.clientWidth, vh = lbVp.clientHeight;
  const d = getDisplaySize();
  // Maksymalne przesunięcie: ile obrazek wystaje poza viewport (w image-space)
  const maxTx = Math.max(0, (d.w * Z.s - vw) / (2 * Z.s));
  const maxTy = Math.max(0, (d.h * Z.s - vh) / (2 * Z.s));
  Z.tx = Math.min(maxTx, Math.max(-maxTx, Z.tx));
  Z.ty = Math.min(maxTy, Math.max(-maxTy, Z.ty));
}

function zReset() {
  Z.s = 1; Z.tx = 0; Z.ty = 0;
  zApply();
}

// Focal point zoom — skaluj celując w punkt (cx, cy) na ekranie
function zoomAt(newS, cx, cy) {
  newS = Math.min(Z.MAX, Math.max(Z.MIN, newS));
  if (newS <= 1) { zReset(); return; }
  const vr = lbVp.getBoundingClientRect();
  // Punkt w image-space (relatywnie do środka viewportu, przeliczony na skalę)
  const px = (cx - vr.left - vr.width / 2) / Z.s;
  const py = (cy - vr.top - vr.height / 2) / Z.s;
  // Przesuń translate, żeby px/py zostało w tym samym miejscu na ekranie
  const ratio = newS / Z.s;
  Z.tx += px * (1 - ratio);
  Z.ty += py * (1 - ratio);
  Z.s = newS;
  zClamp();
  zApply();
}

// ── Otwarcie / Zamknięcie ──
function olb(src) {
  lbi.src = src;
  zReset();
  lb.classList.add('on');
}
function clb() {
  lb.classList.remove('on');
  setTimeout(() => { lbi.src = ''; zReset(); }, 300);
}

lbx.onclick = clb;
lb.onclick = e => { if (e.target === lb) clb(); };

// ══════════════════════════════════════════════════════════════
// DOUBLE TAP / DOUBLE CLICK
// ══════════════════════════════════════════════════════════════
let lastTap = 0;
lbVp.addEventListener('click', e => {
  const now = Date.now();
  if (now - lastTap < 300) {
    e.preventDefault();
    lbi.classList.add('lb__img--anim');
    if (Z.s > 1.05) {
      zReset();
    } else {
      zoomAt(2.5, e.clientX, e.clientY);
    }
    lbi.addEventListener('transitionend', () => lbi.classList.remove('lb__img--anim'), { once: true });
    lastTap = 0;
  } else {
    lastTap = now;
  }
});

// ══════════════════════════════════════════════════════════════
// MOUSE DRAG / PAN (PC — mousedown/move/up/leave)
// ══════════════════════════════════════════════════════════════
let mDrag = false, msx = 0, msy = 0;

lbVp.addEventListener('mousedown', e => {
  if (Z.s <= 1) return;
  e.preventDefault();
  mDrag = true;
  msx = e.clientX / Z.s - Z.tx;
  msy = e.clientY / Z.s - Z.ty;
});
lbVp.addEventListener('mousemove', e => {
  if (!mDrag) return;
  e.preventDefault();
  Z.tx = e.clientX / Z.s - msx;
  Z.ty = e.clientY / Z.s - msy;
  zClamp();
  zApply();
});
lbVp.addEventListener('mouseup', () => { mDrag = false; });
lbVp.addEventListener('mouseleave', () => { mDrag = false; });

// ══════════════════════════════════════════════════════════════
// TOUCH DRAG / PAN (Mobile — jeden palec)
// ══════════════════════════════════════════════════════════════
let tDrag = false, tsx = 0, tsy = 0;

lbVp.addEventListener('touchstart', e => {
  if (e.touches.length === 1 && Z.s > 1) {
    tDrag = true;
    tsx = e.touches[0].clientX / Z.s - Z.tx;
    tsy = e.touches[0].clientY / Z.s - Z.ty;
  }
}, { passive: true });

lbVp.addEventListener('touchmove', e => {
  // Jeden palec — pan
  if (tDrag && e.touches.length === 1 && !pinching) {
    e.preventDefault();
    Z.tx = e.touches[0].clientX / Z.s - tsx;
    Z.ty = e.touches[0].clientY / Z.s - tsy;
    zClamp();
    zApply();
  }
}, { passive: false });

lbVp.addEventListener('touchend', e => {
  if (e.touches.length === 0) tDrag = false;
});

// ══════════════════════════════════════════════════════════════
// PINCH-TO-ZOOM (Mobile — dwa palce)
// ══════════════════════════════════════════════════════════════
let pinching = false, pinchDist = 0, pinchS = 1;

lbVp.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    pinching = true;
    tDrag = false; // wyłącz pan przy pinczu
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    pinchDist = Math.hypot(dx, dy);
    pinchS = Z.s;
  }
}, { passive: false });

lbVp.addEventListener('touchmove', e => {
  if (!pinching || e.touches.length !== 2) return;
  e.preventDefault();
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  const dist = Math.hypot(dx, dy);
  const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
  const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  const newS = pinchS * (dist / pinchDist);
  zoomAt(newS, cx, cy);
}, { passive: false });

lbVp.addEventListener('touchend', e => {
  if (e.touches.length < 2) pinching = false;
});

// ══════════════════════════════════════════════════════════════
// MOUSE WHEEL ZOOM (PC)
// ══════════════════════════════════════════════════════════════
lbVp.addEventListener('wheel', e => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.3 : 0.3;
  zoomAt(Z.s + delta, e.clientX, e.clientY);
}, { passive: false });

// ─── LOCAL STORAGE (auth per kategoria) ───────────────────
function getAuth(c) {
  try {
    const raw = localStorage.getItem(LS_AUTH);
    if (!raw) return c ? '' : {};
    const a = JSON.parse(raw);
    if (typeof a !== 'object' || a === null) { localStorage.removeItem(LS_AUTH); return c ? '' : {}; }
    return c ? (a[c] || '') : a;
  } catch { localStorage.removeItem(LS_AUTH); return c ? '' : {}; }
}
function setAuth(c, p) { const a = getAuth(); a[c] = p; localStorage.setItem(LS_AUTH, JSON.stringify(a)); }
function delAuth(c) { if (c) { const a = getAuth(); delete a[c]; localStorage.setItem(LS_AUTH, JSON.stringify(a)); } else { localStorage.removeItem(LS_AUTH); } }

function getSaved(c) { return parseInt(localStorage.getItem('udt_last_' + c)) || 0; }
function setSaved(c, i) { localStorage.setItem('udt_last_' + c, String(i)); }
function delSaved(c) { localStorage.removeItem('udt_last_' + c); }

function getProgress() { try { return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; } catch { return {}; } }
function markDone(cat, qId) {
  const p = getProgress();
  if (!p[cat]) p[cat] = [];
  if (!p[cat].includes(qId)) p[cat].push(qId);
  localStorage.setItem(LS_PROGRESS, JSON.stringify(p));
}
function getDoneCount(cat) { const p = getProgress(); return p[cat] ? p[cat].length : 0; }

// ─── SCHOWEK TRUDNYCH PYTAŃ ─────────────────────────────────
function getHard() { try { return JSON.parse(localStorage.getItem(LS_HARD)) || {}; } catch { return {}; } }
function isHard(cat, qId) { const h = getHard(); return h[cat] ? h[cat].includes(qId) : false; }
function toggleHard(cat, qId) {
  const h = getHard();
  if (!h[cat]) h[cat] = [];
  const idx = h[cat].indexOf(qId);
  if (idx >= 0) h[cat].splice(idx, 1);
  else h[cat].push(qId);
  localStorage.setItem(LS_HARD, JSON.stringify(h));
  return idx < 0; // true = dodano, false = usunięto
}
function removeHard(cat, qId) {
  const h = getHard();
  if (!h[cat]) return;
  h[cat] = h[cat].filter(id => id !== qId);
  localStorage.setItem(LS_HARD, JSON.stringify(h));
}
function getHardCount(cat) { const h = getHard(); return h[cat] ? h[cat].length : 0; }

// ─── NARZĘDZIA ──────────────────────────────────────────────
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function shuf(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; }
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

// ─── FIREBASE AUTH (globalne hasło) ─────────────────────────
let unsubAuth = null;

function clearAuthListener() {
  if (unsubAuth) {
    unsubAuth();
    unsubAuth = null;
  }
}

function startAuthListener(authKey) {
  clearAuthListener();
  if (S.group === 'bhp') {
    // authKey = login::haslo
    const [lVal, pVal] = authKey.split('::');
    unsubAuth = onSnapshot(doc(db, "konta-bhp", lVal), (snap) => {
      if (!snap.exists() || snap.data().haslo !== pVal || snap.data().kurs !== S.cat) {
        clearAuthListener();
        delAuth(S.cat);
        if (S.eInt) { clearInterval(S.eInt); S.eInt = null; }
        alert("Twoja sesja wygasła, ponieważ dostęp do kursu został cofnięty.");
        go('login');
      }
    });
  } else {
    // UDT logowanie globalne
    unsubAuth = onSnapshot(doc(db, "kursy-udt", 'udt-haslo'), (snap) => {
      if (!snap.exists() || snap.data().haslo !== authKey) {
        clearAuthListener();
        delAuth(S.cat);
        if (S.eInt) { clearInterval(S.eInt); S.eInt = null; }
        alert("Twoja sesja wygasła, ponieważ hasło dostępowe zostało zmienione.");
        go('login');
      }
    });
  }
}

async function verifyAuth(grp, cat, login, pass) {
  if (grp === 'bhp') {
    const dSnap = await getDoc(doc(db, "konta-bhp", login));
    if (dSnap.exists() && dSnap.data().haslo === pass && dSnap.data().kurs === cat) {
      return true;
    }
    return false;
  } else {
    const dSnap = await getDoc(doc(db, "kursy-udt", 'udt-haslo'));
    if (dSnap.exists() && dSnap.data().haslo === pass) {
      return true;
    }
    return false;
  }
}

async function getQs(c) {
  const r = await fetch(`data/${c}.json`, { cache: 'no-cache' });
  const data = await r.json();
  S.qs = Array.isArray(data) ? data : (data.questions || []);
  
  // Normalizacja indeksu: JSON używa 1-4 (ludzki), JS potrzebuje 0-3 (tablicowy)
  S.qs.forEach(q => {
    const v = parseInt(q.correct);
    if (v >= 1) q.correct = v - 1;
    if (q.image && q.image.startsWith('/img/')) q.image = q.image.substring(1);
  });
  S.catTotals[c] = S.qs.length;

  try {
    const rOp = await fetch(`data/${c}_opisy.json`, { cache: 'no-cache' });
    const dOp = await rOp.json();
    S.opisy = dOp.items || [];
    S.opisy.forEach(q => {
      if (q.image && q.image.startsWith('/img/')) q.image = q.image.substring(1);
    });
  } catch(e) { S.opisy = []; }

  try {
    const rSet = await fetch(`data/${c}_ustawienia.json`, { cache: 'no-cache' });
    const dSet = await rSet.json();
    EXAM_RULES[c] = {
      rules: (dSet.rules || []).map(r => ({
        count: r.count,
        ranges: [[r.min, r.max]]
      }))
    };
  } catch(e) { 
    EXAM_RULES[c] = { rules: [] }; 
  }

  return S.qs;
}

// ─── NAWIGACJA WIDOKÓW I ZARZĄDZANIE MAIN-HEADER ────────────
const topBk = $('top-bk');
const topLo = $('top-lo');
const topTitle = $('top-title');

function go(v) {
  if (S.eInt && v !== 'exam') { clearInterval(S.eInt); S.eInt = null; }

  // Title logic
  if (S.cat && !['home', 'subcats'].includes(v)) {
    topTitle.innerHTML = CATS[S.cat].label;
  } else if (v === 'subcats' && S.group) {
    topTitle.innerHTML = GROUPS[S.group].label;
  } else {
    topTitle.innerHTML = `Testy <span class="a">UDT</span>`;
  }

  // Wróć (Back) logic
  if (['home'].includes(v)) {
    topBk.style.display = 'none';
  } else {
    topBk.style.display = '';
    topBk.onclick = () => {
      if (v === 'subcats') { S.group = null; go('home'); }
      else if (v === 'login' || v === 'menu') { 
        S.cat = null; 
        if (S.group === 'bhp') { S.group = null; go('home'); }
        else go('subcats');
      }
      else {
        if (v === 'exam') { clearInterval(S.eInt); S.eInt = null; }
        go('menu');
      }
    };
  }

  // Wyloguj (Logout) logic
  if (['menu', 'cheat', 'train', 'resume', 'exam', 'signature', 'result', 'clipboard', 'opisyList', 'bhpList'].includes(v)) {
    topLo.style.display = '';
    topLo.onclick = () => {
      clearAuthListener();
      if (S.eInt) { clearInterval(S.eInt); S.eInt = null; }
      delAuth(S.cat);
      S.cat = null;
      history.replaceState(null, "", window.location.pathname);
      if (S.group === 'bhp') { S.group = null; go('home'); }
      else go('subcats');
    };
  } else {
    topLo.style.display = 'none';
  }

  const m = {
    home: vHome, subcats: vSubcats, login: vLogin, menu: vMenu, resume: vResume,
    cheat: vCheat, train: vTrain, exam: vExam, signature: vSignature, result: vResult, clipboard: vClipboard,
    opisyList: vOpisyList, bhpList: vBhpList
  };
  if (m[v]) m[v]();
  document.body.className = 'view-' + v;

  const el = appEl.firstElementChild;
  if (el) {
    el.classList.add('v-in');

    // Dynamic footer injection inside the scrolling element
    if (v === 'home') {
      const footer = document.createElement('footer');
      footer.className = 'app-footer';
      footer.innerHTML = '<button class="btn-privacy" id="btn-privacy">Polityka Prywatności</button>';
      el.appendChild(footer);
    }
  }
}

// Global click event for Privacy Policy
appEl.addEventListener('click', e => {
  if (e.target.id === 'btn-privacy') {
    const polModal = $('pol-modal');
    if (polModal) polModal.classList.add('on');
  }
});

// ═════════════════════════════════════════════════════════════
// WIDOK 1a — Ekran główny: GRUPY (Poziom 1)
// ═════════════════════════════════════════════════════════════
function vHome() {
  appEl.innerHTML = `<div>
    <header class="hdr"><p>Wybierz rodzaj szkolenia</p></header>
    <div class="grid" id="g" style="display:flex; justify-content:center; margin-top:32px"></div>
  </div>`;

  const g = $('g');
  for (const [k, grp] of Object.entries(GROUPS)) {
    const d = document.createElement('div');
    d.className = 'crd'; d.id = 'g-' + k;
    d.style.width = '100%';
    d.style.maxWidth = '360px';
    d.innerHTML = `<div class="crd__ic" data-ic="${grp.ic}"></div>
      <div class="crd__t">${grp.label}</div>
      <div class="crd__d">${grp.desc}</div>
      <span class="crd__arr">${I.chR}</span>`;
    d.onclick = () => { 
      S.group = k;
      go('subcats'); 
    };
    g.appendChild(d);

    // Render ikon
    if (grp.icons) {
      // Grupa z wieloma ikonkami (np. UDT)
      const icEl = d.querySelector('.crd__ic');
      icEl.classList.add('crd__ic--multi');
      icEl.innerHTML = '';
      grp.icons.forEach(file => {
        const img = document.createElement('img');
        img.src = GITHUB_RAW + '/icons/' + file;
        img.alt = '';
        img.className = 'crd__ic-img';
        icEl.appendChild(img);
      });
    } else if (IC_FILES[grp.ic]) {
      loadSvg(d.querySelector('.crd__ic'), grp.ic);
    } else {
      d.querySelector('.crd__ic').innerHTML = I[grp.ic] || '';
    }
  }
}

// ═════════════════════════════════════════════════════════════
// WIDOK 1b — Podkategorie: MASZYNY / SZKOLENIA (Poziom 2)
// ═════════════════════════════════════════════════════════════
function vSubcats() {
  const grp = GROUPS[S.group];
  appEl.innerHTML = `<div>
    <header class="hdr"><p>Wybierz kategorię i przygotuj się do egzaminu</p></header>
    <div class="grid" id="g"></div>
  </div>`;

  const g = $('g');
  for (const k of grp.cats) {
    const c = CATS[k];
    const d = document.createElement('div');
    d.className = 'crd crd--course' + (c.locked ? ' crd--locked' : ''); d.id = 'c-' + k;
    d.innerHTML = `<div class="crd__ic" data-ic="${c.ic}"></div>
      <div class="crd__t">${c.label}</div>
      <div class="crd__d">${c.locked ? '🔒 Moduł w przygotowaniu' : c.desc}</div>
      <span class="crd__arr">${I.chR}</span>`;
    d.onclick = () => {
      if (c.locked) { alert('Moduł w przygotowaniu — wkrótce dostępne'); return; }
      pickCat(k);
    };
    g.appendChild(d);
    if (IC_FILES[c.ic]) {
      loadSvg(d.querySelector('.crd__ic'), c.ic);
    } else {
      d.querySelector('.crd__ic').innerHTML = I[c.ic] || '';
    }
  }
}

async function pickCat(k) {
  S.cat = k;
  const sv = getAuth(k);
  if (sv) {
    try {
      if (S.group === 'bhp') {
        const [lgn, pw] = sv.split('::');
        if (lgn && pw) {
          const authOk = await verifyAuth(S.group, k, lgn, pw);
          if (authOk) {
            startAuthListener(sv);
            S.studentLogin = lgn;
            history.pushState({ testActive: true }, "Testy", "#test");
            await getQs(k); go('menu'); return;
          }
        }
      } else {
        const authOk = await verifyAuth(S.group, k, null, sv);
        if (authOk) {
          startAuthListener(sv);
          history.pushState({ testActive: true }, "Testy", "#test");
          await getQs(k); go('menu'); return;
        }
      }
    } catch (e) { /* brak połączenia */ }
    delAuth(k);
  }
  go('login');
}

// ═════════════════════════════════════════════════════════════
// WIDOK 2 — Logowanie
// ═════════════════════════════════════════════════════════════
function vLogin() {
  const c = CATS[S.cat];
  const isBhp = S.group === 'bhp';
  
  let loginHtml = '';
  if (isBhp) {
    loginHtml = `
      <div class="fld"><label for="lgn">LOGIN</label>
        <input type="text" id="lgn" placeholder="Wpisz swój login..." autocomplete="off"/>
      </div>
    `;
  }

  appEl.innerHTML = `<div>
    <div class="lbox" style="margin-top:0">
      <h2>${c.label}</h2><p>${isBhp ? 'Zaloguj się na swoje konto' : 'Wpisz hasło otrzymane od instruktora'}</p>
      ${loginHtml}
      <div class="fld"><label for="pw">HASŁO</label>
        <div class="pw-wrapper">
          <input type="password" id="pw" placeholder="••••••••" autocomplete="off"/>
          <button type="button" class="pw-eye" id="pw-eye" aria-label="Pokaż hasło">${I.eye}</button>
        </div>
        <div class="fld-err" id="er">${I.alrt}<span></span></div>
      </div>
      <label class="chk"><input type="checkbox" id="rem" checked/> Zapamiętaj mnie</label>
      <div style="text-align: center;">
        <button class="btn btn--a" id="sub" style="min-width: 200px;">${I.key} <span>Zaloguj się</span></button>
      </div>
    </div></div>`;

  const pw = $('pw'), er = $('er'), rem = $('rem'), btn = $('sub'), pwEye = $('pw-eye');
  const lgn = $('lgn'); // Może być null dla UDT

  pwEye.onclick = () => {
    if (pw.type === 'password') {
      pw.type = 'text';
      pwEye.innerHTML = I.eyeOff;
    } else {
      pw.type = 'password';
      pwEye.innerHTML = I.eye;
    }
  };

  async function tryLog() {
    const v = pw.value.trim();
    const lVal = lgn ? lgn.value.trim() : null;

    pw.classList.remove('has-error');
    if (lgn) lgn.classList.remove('has-error');
    er.classList.remove('on');

    if (isBhp && !lVal) {
      lgn.classList.add('has-error');
      sErr(er, 'Wpisz login');
      return;
    }

    if (!v) {
      pw.classList.add('has-error');
      sErr(er, 'Wpisz hasło');
      return;
    }

    btn.disabled = true;
    const btnSpan = btn.querySelector('span');
    btnSpan.textContent = 'Sprawdzanie...';

    try {
      const authOk = await verifyAuth(S.group, S.cat, lVal, v);
      if (authOk) {
        const authKey = isBhp ? `${lVal}::${v}` : v;
        if (rem.checked) setAuth(S.cat, authKey);
        startAuthListener(authKey);
        if (isBhp) S.studentLogin = lVal;
        history.pushState({ testActive: true }, "Testy", "#test");
        await getQs(S.cat); go('menu');
      } else {
        pw.classList.add('has-error');
        sErr(er, isBhp ? 'Nieprawidłowy login, hasło lub brak dostępu' : 'Nieprawidłowe hasło');
        pw.value = ''; pw.focus();
        btn.disabled = false;
        btnSpan.textContent = 'Zaloguj się';
      }
    } catch (e) {
      sErr(er, 'Błąd połączenia z bazą');
      btn.disabled = false;
      btnSpan.textContent = 'Zaloguj się';
    }
  }
  btn.onclick = tryLog;
  pw.onkeydown = e => { if (e.key === 'Enter') tryLog(); };
  requestAnimationFrame(() => pw.focus());
}
function sErr(el, m) { el.querySelector('span').textContent = m; el.classList.add('on'); }

// ═════════════════════════════════════════════════════════════
// WIDOK 3 — Menu (postęp kategorii + tryby)
// ═════════════════════════════════════════════════════════════
function vMenu() {
  const c = CATS[S.cat];
  const n = Math.min(EXAM_N, S.qs.length);
  const passInfo = `${PASS_COUNT}/${n}`;
  const done = getDoneCount(S.cat);
  const total = S.qs.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  appEl.innerHTML = `<div>
    <div class="stats-box">
      <div class="stats-box__title">Postęp w ${c.label}</div>
      <div class="stats-box__row">
        <span class="stats-box__label">Przerobione w treningu</span>
        <span class="stats-box__val">${done} / ${total} pytań</span>
      </div>
      <div class="stats-bar">
        <div class="stats-bar__fill" style="width:${pct}%"></div>
      </div>
    </div>

    <header class="hdr" style="padding-top:4px">
      <h1 style="font-size:1.5rem">Wybierz <span class="a">tryb</span></h1></header>
    <div class="modes">
      <button class="mbtn" id="ma"><div class="mbtn__ic mbtn__ic--b">${I.book}</div>
        <div><div class="mbtn__t">Baza pytań (Ściąga)</div>
        <div class="mbtn__d">Przeglądaj pytania z zaznaczoną poprawną odpowiedzią</div></div></button>
      <button class="mbtn" id="mb"><div class="mbtn__ic mbtn__ic--g">${I.brain}</div>
        <div><div class="mbtn__t">Trening (Krok po kroku)</div>
        <div class="mbtn__d">Ucz się — natychmiastowy feedback, zapamiętywanie postępu</div></div></button>
      <button class="mbtn" id="mc"><div class="mbtn__ic mbtn__ic--r">${I.fChk}</div>
        <div><div class="mbtn__t">Egzamin (Losowe)</div>
        <div class="mbtn__d">${n} pytań · 30 min · próg: ${passInfo}</div></div></button>
      <button class="mbtn mbtn--hard" id="md"><div class="mbtn__ic mbtn__ic--y">${I.clip}</div>
        <div><div class="mbtn__t">Trudne pytania (Schowek)</div>
        <div class="mbtn__d"><span id="hard-count">${getHardCount(S.cat)}</span> zapisanych pytań · pokaż instruktorowi</div></div></button>
      <button class="mbtn" id="mf"><div class="mbtn__ic mbtn__ic--b">${I.file}</div>
        <div><div class="mbtn__t">Opisy i Definicje</div>
        <div class="mbtn__d">${S.opisy ? S.opisy.length : 0} opisów w bazie</div></div></button>
    </div></div>`;

  $('ma').onclick = () => { S.bi = 0; go('cheat'); };
  $('mb').onclick = () => {
    const sv = getSaved(S.cat);
    if (sv > 0 && sv < S.qs.length) go('resume');
    else { S.ti = 0; S.tAns = false; go('train'); }
  };
  $('mc').onclick = startExam;
  $('md').onclick = () => go('clipboard');
  $('mf').onclick = () => go('opisyList');
}

// ═════════════════════════════════════════════════════════════
// WIDOK 3b — Dialog kontynuacji
// ═════════════════════════════════════════════════════════════
function vResume() {
  const sv = getSaved(S.cat);
  appEl.innerHTML = `<div>
    <div class="resume-box" style="margin-top:0">
      <h2>Masz zapisany postęp</h2>
      <p>Ostatnio skończyłeś na pytaniu <strong style="color:var(--accent)">${sv + 1}</strong> z ${S.qs.length}.</p>
      <div class="btns">
        <button class="btn btn--ok" id="cont">${I.play} Kontynuuj od pytania ${sv + 1}</button>
        <button class="btn btn--o" id="fresh">${I.rot} Zacznij od nowa</button>
      </div>
    </div></div>`;

  $('cont').onclick = () => { S.ti = sv; S.tAns = false; go('train'); };
  $('fresh').onclick = () => { delSaved(S.cat); S.ti = 0; S.tAns = false; go('train'); };
}

// ═════════════════════════════════════════════════════════════
// WIDOK A — Baza pytań
// ═════════════════════════════════════════════════════════════
function vCheat() {
  const q = S.qs[S.bi], tot = S.qs.length, pct = ((S.bi + 1) / tot) * 100;
  appEl.innerHTML = `<div>
    <div class="prog"><div class="prog__top">
      <span class="prog__l">Baza pytań</span>
      <span class="prog__n">${S.bi + 1} / ${tot}</span></div>
      <div class="prog__bar"><div class="prog__fill" style="width:${pct}%"></div></div></div>
    <div class="pyt-kontener">
      <div class="q-top-row"><div class="q-n">Pytanie ${S.bi + 1}</div>
        <button class="btn-hard ${isHard(S.cat, q.id) ? 'btn-hard--on' : ''}" id="btn-hard" title="Oznacz jako trudne">${isHard(S.cat, q.id) ? I.flagFill : I.flag}</button></div>
      <div class="q-t">${q.question}</div>
      ${q.image ? `<img src="${q.image}" alt="Ilustracja" class="q-img" data-src="${q.image}" onerror="this.style.display='none'"/>` : ''}
      <div class="odp-lista">${q.options.map((o, i) => `
        <div class="odp-btn odp-btn--lk ${i === q.correct ? 'odp-btn--ok' : ''}">
          <span class="odp-btn__l">${LT[i]}</span><span class="odp-btn__t">${o}</span>
        </div>`).join('')}</div>
    </div>
    ${navPanel(S.bi, tot)}
  </div>`;
  bindImgs(appEl);
  bindHardBtn(q);
  bindNavPanel('cheat');
}

// ═════════════════════════════════════════════════════════════
// WIDOK B — Trening
// ═════════════════════════════════════════════════════════════
function vTrain() {
  const q = S.qs[S.ti], tot = S.qs.length, pct = ((S.ti + 1) / tot) * 100;
  appEl.innerHTML = `<div>
    <div class="prog"><div class="prog__top">
      <span class="prog__l">Trening</span>
      <span class="prog__n">${S.ti + 1} / ${tot}</span></div>
      <div class="prog__bar"><div class="prog__fill" style="width:${pct}%"></div></div></div>
    <div class="pyt-kontener">
      <div class="q-top-row"><div class="q-n">Pytanie ${S.ti + 1}</div>
        <button class="btn-hard ${isHard(S.cat, q.id) ? 'btn-hard--on' : ''}" id="btn-hard" title="Oznacz jako trudne">${isHard(S.cat, q.id) ? I.flagFill : I.flag}</button></div>
      <div class="q-t">${q.question}</div>
      ${q.image ? `<img src="${q.image}" alt="Ilustracja" class="q-img" data-src="${q.image}" onerror="this.style.display='none'"/>` : ''}
      <div class="odp-lista" id="odp-lista">${q.options.map((o, i) => `
        <button class="odp-btn" data-i="${i}" id="o${i}">
          <span class="odp-btn__l">${LT[i]}</span><span class="odp-btn__t">${o}</span>
        </button>`).join('')}</div>
    </div>
    ${navPanel(S.ti, tot)}
  </div>`;

  bindImgs(appEl);

  $('odp-lista').querySelectorAll('.odp-btn').forEach(b => {
    b.onclick = () => {
      if (S.tAns) return;
      S.tAns = true;
      const ch = +b.dataset.i, ok = q.correct;
      setSaved(S.cat, S.ti);
      markDone(S.cat, q.id);

      document.querySelectorAll('#odp-lista .odp-btn').forEach(o => {
        const idx = +o.dataset.i;
        o.classList.add('odp-btn--lk');
        if (idx === ok) o.classList.add('odp-btn--ok');
        if (idx === ch && ch !== ok) o.classList.add('odp-btn--bad');
      });
    };
  });
  bindHardBtn(q);
  bindNavPanel('train');
}

// ─── PRZYCISK TRUDNE PYTANIE ─────────────────────────────────
function bindHardBtn(q) {
  const btn = $('btn-hard');
  if (!btn) return;
  btn.onclick = () => {
    const added = toggleHard(S.cat, q.id);
    btn.classList.toggle('btn-hard--on', added);
    btn.innerHTML = added ? I.flagFill : I.flag;
  };
}

// ═════════════════════════════════════════════════════════════
// WIDOK D — Schowek trudnych pytań
// ═════════════════════════════════════════════════════════════
function vClipboard() {
  const hardIds = (getHard()[S.cat] || []);
  const hardQs = S.qs.filter(q => hardIds.includes(q.id));

  let content = '';
  if (hardQs.length === 0) {
    content = `<div class="clip-empty">
      <div class="clip-empty__ic">${I.clip}</div>
      <h2>Brak zapisanych pytań</h2>
      <p>Jeśli na jakieś trafisz, oznacz je flagą podczas nauki!</p>
    </div>`;
  } else {
    content = hardQs.map((q, idx) => {
      const qNum = S.qs.findIndex(x => x.id === q.id) + 1;
      return `
      <div class="clip-card" id="clip-${idx}">
        <div class="clip-card__top">
          <div class="clip-card__q"><span class="clip-card__num">Pytanie ${qNum}</span>${q.question}</div>
          <button class="clip-card__del" data-qid="${q.id}" title="Usuń ze schowka">${I.trash}</button>
        </div>
        ${q.image ? `<img src="${q.image}" alt="Ilustracja" class="q-img" data-src="${q.image}" onerror="this.style.display='none'"/>` : ''}
        <div class="odp-lista">${q.options.map((o, i) => `
          <div class="odp-btn odp-btn--lk ${i === q.correct ? 'odp-btn--ok' : ''}">
            <span class="odp-btn__l">${LT[i]}</span><span class="odp-btn__t">${o}</span>
          </div>`).join('')}</div>
      </div>`;
    }).join('');
  }

  appEl.innerHTML = `<div>
    <header class="hdr"><h1 style="font-size:1.3rem">Trudne pytania <span class="a">(${hardQs.length})</span></h1>
      <p>Pytania oznaczone flagą — pokaż je instruktorowi</p></header>
    <div class="clip-list">${content}</div>
    <div class="r-acts" style="margin-top:16px">
      <button class="btn btn--o" id="clip-back">${I.aL} Wróć do menu</button>
    </div>
  </div>`;

  bindImgs(appEl);
  $('clip-back').onclick = () => go('menu');

  // Bind delete buttons
  appEl.querySelectorAll('.clip-card__del').forEach(btn => {
    btn.onclick = () => {
      const qid = parseInt(btn.dataset.qid, 10);
      removeHard(S.cat, qid);
      go('clipboard'); // re-render
    };
  });
}

// ═════════════════════════════════════════════════════════════
// PANEL NAWIGACJI
// ═════════════════════════════════════════════════════════════
function navPanel(cur, tot) {
  return `<div class="qnav" id="qnav">
    <button class="qnav__btn" id="nav-prev" ${cur === 0 ? 'disabled' : ''}>${I.chL} Poprzednie</button>
    <div class="qnav__mid"><span>Pytanie</span>
      <input type="number" class="qnav__input" id="nav-inp" min="1" max="${tot}" value="${cur + 1}"/>
      <span>z ${tot}</span></div>
    <button class="qnav__btn" id="nav-next" ${cur === tot - 1 ? 'disabled' : ''}>Następne ${I.chR}</button>
  </div>`;
}

function bindNavPanel(mode) {
  const tot = S.qs.length;
  const inp = $('nav-inp');

  $('nav-prev').onclick = () => {
    if (mode === 'cheat' && S.bi > 0) { S.bi--; go('cheat'); }
    if (mode === 'train' && S.ti > 0) { S.ti--; S.tAns = false; go('train'); }
  };
  $('nav-next').onclick = () => {
    if (mode === 'cheat' && S.bi < tot - 1) { S.bi++; go('cheat'); }
    if (mode === 'train' && S.ti < tot - 1) { S.ti++; S.tAns = false; go('train'); }
  };

  function jumpTo() {
    let v = parseInt(inp.value, 10);
    if (isNaN(v)) return;
    v = clamp(v, 1, tot);
    const idx = v - 1;
    if (mode === 'cheat') { S.bi = idx; go('cheat'); }
    if (mode === 'train') { S.ti = idx; S.tAns = false; go('train'); }
  }
  inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); jumpTo(); } };
  inp.onblur = jumpTo;
  inp.onfocus = () => inp.select();
}

// ═════════════════════════════════════════════════════════════
// WIDOK C — Egzamin
// ═════════════════════════════════════════════════════════════
function startExam() {
  S.eq = generateExam(S.qs, S.cat);
  const n = S.eq.length;
  S.ei = 0; S.ea = Array(n).fill(-1); S.et = EXAM_T;
  clearInterval(S.eInt);
  S.eInt = setInterval(() => {
    S.et--; updTmr();
    if (S.et <= 0) { clearInterval(S.eInt); S.eInt = null; S.group === 'bhp' ? go('signature') : go('result'); }
  }, 1000);
  go('exam');
}

function vExam() {
  const q = S.eq[S.ei], tot = S.eq.length, pct = ((S.ei + 1) / tot) * 100, sel = S.ea[S.ei];
  appEl.innerHTML = `<div>
    <div class="top" style="justify-content:flex-end">
      <div class="tmr" id="tmr">${I.clk} <span id="tt">${fmt(S.et)}</span></div>
    </div>
    <div class="prog"><div class="prog__top">
      <span class="prog__l">Egzamin</span>
      <span class="prog__n">${S.ei + 1} / ${tot}</span></div>
      <div class="prog__bar"><div class="prog__fill" style="width:${pct}%"></div></div></div>
    <div class="pyt-kontener">
      <div class="q-n">Pytanie ${S.ei + 1}</div>
      <div class="q-t">${q.question}</div>
      ${q.image ? `<img src="${q.image}" alt="Ilustracja" class="q-img" data-src="${q.image}" onerror="this.style.display='none'"/>` : ''}
      <div class="odp-lista" id="odp-lista">${q.options.map((o, i) => `
        <button class="odp-btn ${i === sel ? 'odp-btn--sel' : ''}" data-i="${i}" id="eo${i}">
          <span class="odp-btn__l">${LT[i]}</span><span class="odp-btn__t">${o}</span>
        </button>`).join('')}</div>
      <div style="margin-top:16px;display:flex;justify-content:space-between">
        <button class="btn btn--o" id="eprv" ${S.ei === 0 ? 'style="visibility:hidden"' : ''}>
          ${I.aL} Wstecz</button>
        <button class="btn btn--a btn--s" id="enx">
          ${S.ei < tot - 1 ? 'Następne' : 'Zakończ egzamin'} ${I.aR}</button>
      </div>
    </div></div>`;

  bindImgs(appEl);

  $('odp-lista').querySelectorAll('.odp-btn').forEach(b => {
    b.onclick = () => {
      S.ea[S.ei] = +b.dataset.i;
      document.querySelectorAll('#odp-lista .odp-btn').forEach(o => o.classList.remove('odp-btn--sel'));
      b.classList.add('odp-btn--sel');
    };
  });

  const eprv = $('eprv');
  if (eprv) {
    eprv.onclick = () => {
      if (S.ei > 0) { S.ei--; go('exam'); }
    };
  }

  $('enx').onclick = () => {
    if (S.ei < tot - 1) { S.ei++; go('exam'); }
    else { clearInterval(S.eInt); S.eInt = null; S.group === 'bhp' ? go('signature') : go('result'); }
  };
  updTmr();
}

function updTmr() {
  const t = $('tt'), p = $('tmr');
  if (!t || !p) return;
  t.textContent = fmt(S.et);
  p.classList.remove('tmr--w', 'tmr--c');
  if (S.et <= 60) p.classList.add('tmr--c');
  else if (S.et <= 180) p.classList.add('tmr--w');
}

// ═════════════════════════════════════════════════════════════
// WIDOK — Podpis egzaminu (tylko BHP)
function vSignature() {
  const d = new Date();
  const dStr = d.toLocaleDateString('pl-PL') + ' ' + d.toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});
  const defName = S.studentLogin ? S.studentLogin.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  appEl.innerHTML = `<div>
    <header class="hdr" style="padding-top:16px">
      <h1 style="font-size:1.5rem">Podsumowanie <span class="a">egzaminu</span></h1>
      <p>Wymagany podpis do zatwierdzenia wyniku</p>
    </header>
    <div class="lbox" style="margin-top:24px">
      <div class="fld">
        <label>DATA I CZAS ZAKOŃCZENIA</label>
        <input type="text" value="${dStr}" disabled style="background:#f5f5f5; color:#555; cursor:not-allowed;" />
      </div>
      <div class="fld" style="margin-top:16px;">
        <label for="sig-name">TWÓJ PODPIS (Imię i Nazwisko)</label>
        <input type="text" id="sig-name" placeholder="np. Jan Kowalski" value="${defName}" autocomplete="off"/>
        <div class="fld-err" id="sig-er">${I.alrt}<span></span></div>
      </div>
      <div style="text-align: center; margin-top:24px;">
        <button class="btn btn--a" id="sig-btn" style="min-width: 200px;">${I.chkC} <span>Zatwierdź Egzamin</span></button>
      </div>
    </div>
  </div>`.replace(/\\/g, ''); // Fix escaping

  $('sig-btn').onclick = () => {
    const name = $('sig-name').value.trim();
    if (!name) {
      $('sig-name').classList.add('has-error');
      sErr($('sig-er'), 'Wpisz imię i nazwisko');
      return;
    }
    S.studentSignature = name;
    S.examDate = dStr;
    S.examDateObj = d;
    go('result');
  };
}

// ═════════════════════════════════════════════════════════════
// WIDOK — Wynik egzaminu
// ═════════════════════════════════════════════════════════════
function vResult() {
  const tot = S.eq.length;
  let sc = 0; const mis = [];
  S.eq.forEach((q, i) => {
    const a = S.ea[i];
    if (a === q.correct) sc++;
    else mis.push({ q: q.question, img: q.image || '', u: a >= 0 ? q.options[a] : 'Brak odpowiedzi', c: q.options[q.correct] });
  });
  const pass = sc >= PASS_COUNT, pct = Math.round(sc / tot * 100);
  const isBhp = S.group === 'bhp';

  let actsHtml = '';
  if (isBhp) {
    if (pass) {
      actsHtml = `
        <button class="btn btn--a" id="r-pdf" style="background:var(--ok)">${I.doc || '📄'} Pobierz Certyfikat PDF</button>
        <button class="btn btn--o" id="rh">${I.home} Menu</button>
      `;
    } else {
      actsHtml = `<button class="btn btn--a" id="rr" style="width:100%">${I.rot} Spróbuj ponownie (Wymagane)</button>`;
    }
  } else {
    actsHtml = `
      <button class="btn btn--a" id="rr">${I.rot} Spróbuj ponownie</button>
      <button class="btn btn--o" id="rh">${I.home} Menu</button>
    `;
  }

  appEl.innerHTML = `<div>
    <header class="hdr" style="padding-top:16px">
      <h1 style="font-size:1.5rem">Wynik <span class="a">egzaminu</span></h1>
      <p>${CATS[S.cat].label}</p></header>
    <div class="rbox">
      <div class="r-ico ${pass ? 'r-ico--p' : 'r-ico--f'}">${pass ? I.chkC : I.xC}</div>
      <div class="r-sub">Twój wynik</div>
      <div class="r-sc ${pass ? 'r-sc--p' : 'r-sc--f'}">${sc}/${tot}</div>
      <div class="r-sub">${pct}% poprawnych</div>
      <span class="r-badge ${pass ? 'r-badge--p' : 'r-badge--f'}">
        ${pass ? '👏 Zdałeś! Gratulacje!' : 'Nie zdałeś. Spróbuj ponownie.'}</span>
      ${isBhp && pass ? `<div style="margin-top:12px; font-weight:600; color:#555;">Podpis: ${S.studentSignature}<br/>Data: ${S.examDate}</div>` : ''}
    </div>
    ${mis.length ? `<div class="rev"><h2>Przegląd błędów (${mis.length})</h2>
      ${mis.map(m => `<div class="ri"><div class="ri__q">${m.q}</div>
        ${m.img ? `<img class="ri__img" src="${m.img}" alt="Grafika do pytania" loading="lazy">` : ''}
        <div class="ri__r ri__r--b"><span class="dot dot--r"></span><span>Twoja: ${m.u}</span></div>
        <div class="ri__r ri__r--g"><span class="dot dot--g"></span><span>Poprawna: ${m.c}</span></div></div>`).join('')}
    </div>` : `<div class="rev" style="text-align:center;margin-top:24px">
      <p style="color:var(--ok);font-weight:600">🏆 Bezłędnie!</p></div>`}
    <div class="r-acts">
      ${actsHtml}
    </div></div>`;

  if ($('rr')) $('rr').onclick = startExam;
  if ($('rh')) $('rh').onclick = () => go('menu');
  if ($('r-pdf')) {
    $('r-pdf').onclick = () => {
      alert("Pobieranie PDF... (funkcja będzie dodana w następnym kroku)");
    };
  }

  if (isBhp && pass && !S.savedResult) {
    S.savedResult = true;
    saveBhpResult(S.studentLogin, S.studentSignature, S.examDateObj, sc, tot, pct);
  }
}

async function saveBhpResult(login, signature, dateObj, sc, tot, pct) {
  try {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);

    await addDoc(collection(db, "wyniki-bhp"), {
      login: login || 'nieznany',
      podpis: signature || '',
      kurs: CATS[S.cat].label,
      kurs_id: S.cat,
      wynik: `${sc}/${tot}`,
      procent: pct,
      data_egzaminu: dateObj,
      data_utworzenia: serverTimestamp(),
      wygasa: expireDate
    });
    console.log("Zapisano wynik do bazy!");
  } catch(e) {
    console.error("Błąd zapisu:", e);
  }
}

function renderList(title, data, subtitle) {
  let content = (!data || data.length === 0) ? `<div class="clip-empty">
      <div class="clip-empty__ic">${I.file}</div>
      <h2>Brak wpisów</h2>
      <p>Dodaj wpisy w panelu CMS, aby się tu pojawiły.</p>
    </div>` :
    data.map((q, idx) => `
      <div class="clip-card">
        <div class="clip-card__top">
          <div class="clip-card__q"><span class="clip-card__num">${idx + 1}.</span> ${q.question}</div>
        </div>
        ${q.image ? `<img src="${q.image}" alt="Ilustracja" class="q-img" data-src="${q.image}" onerror="this.style.display='none'"/>` : ''}
        <div class="odp-lista">
          <div class="odp-btn odp-btn--ok" style="cursor:default;align-items:flex-start">
            <span class="odp-btn__t" style="white-space:pre-wrap;text-align:left">${q.answer || ''}</span>
          </div>
        </div>
      </div>
    `).join('');

  appEl.innerHTML = `<div>
    <header class="hdr"><h1 style="font-size:1.3rem">${title}</h1>
      <p>${subtitle}</p></header>
    <div class="clip-list">${content}</div>
    <div class="r-acts" style="margin-top:16px">
      <button class="btn btn--o" id="clip-back">${I.aL} Wróć do menu</button>
    </div>
  </div>`;
  bindImgs(appEl);
  $('clip-back').onclick = () => go('menu');
}

function vOpisyList() {
  renderList("Opisy i Definicje", S.opisy, CATS[S.cat].label);
}

// ═════════════════════════════════════════════════════════════
// WIDOK — Lista pytań (BHP)
// ═════════════════════════════════════════════════════════════
function vBhpList() {
  const content = S.qs.map((q, idx) => {
    return `
    <div class="clip-card" id="clip-${idx}">
      <div class="clip-card__top">
        <div class="clip-card__q"><span class="clip-card__num">${idx + 1}.</span> ${q.question}</div>
      </div>
      ${q.image ? `<img src="${q.image}" alt="Ilustracja" class="q-img" data-src="${q.image}" onerror="this.style.display='none'"/>` : ''}
      <div class="odp-lista">
        <div class="odp-btn odp-btn--lk odp-btn--ok" style="cursor:default; align-items:flex-start">
          <span class="odp-btn__t" style="white-space:pre-wrap; text-align:left">${q.options[q.correct]}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  appEl.innerHTML = `<div>
    <header class="hdr"><h1 style="font-size:1.3rem">Baza pytań: ${CATS[S.cat].label}</h1>
      <p>Pełna lista pytań i odpowiedzi</p></header>
    <div class="clip-list">${content}</div>
    <div class="r-acts" style="margin-top:16px">
      <button class="btn btn--o" id="clip-back">${I.aL} Wróć do menu</button>
    </div>
  </div>`;

  bindImgs(appEl);
  $('clip-back').onclick = () => go('menu');
}


// ─── HELPER ─────────────────────────────────────────────────
function bindImgs(el) {
  el.querySelectorAll('.q-img').forEach(i => {
    i.onclick = () => olb(i.dataset.src || i.src);
  });
}

// ─── START ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  $('top-bk').innerHTML = `${I.aL} <span class="nav-txt">Wróć</span>`;
  $('top-lo').innerHTML = `${I.out} <span class="nav-txt">Wyloguj</span>`;
  initTheme();
  go('home');
});

window.addEventListener('popstate', (e) => {
  if (S.cat) {
    const c = confirm("Czy na pewno chcesz opuścić trwający test? Twój postęp zostanie utracony.");
    if (c) {
      clearAuthListener();
      if (S.eInt) { clearInterval(S.eInt); S.eInt = null; }
      delAuth(S.cat);
      S.cat = null;
      history.replaceState(null, "", window.location.pathname);
      go(S.group ? 'subcats' : 'home');
    } else {
      history.pushState({ testActive: true }, "Testy UDT", "#test");
    }
  }
});

// ─── PWA (Demontaż - Czysta Strona Web) ────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  }).catch(() => { });
}

// ─── POLITYKA PRYWATNOŚCI (Zamykanie Modala) ───────────────────
const polModal = $('pol-modal');
const polX = $('pol-x');

if (polModal && polX) {
  polX.onclick = () => polModal.classList.remove('on');
  polModal.onclick = (e) => {
    if (e.target === polModal) polModal.classList.remove('on');
  };
}
