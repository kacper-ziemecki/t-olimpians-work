/* ============================================================
   T-Olimpians — licznik odwiedzin  (zasila panel kacperos.html)

   Wpięcie: w KAŻDEJ stronie, którą chcesz mierzyć, przed </body>:
       <script type="module" src="/track.js"></script>

   Zapisuje jeden dokument na odsłonę do kolekcji "analytics_hits"
   i odświeża go co 30 s, dopóki karta jest widoczna — stąd biorą się
   "teraz na stronie" oraz czas czytania.

   NIE liczymy: robotów, podglądu z dysku/localhosta i przeglądarek,
   które w panelu kliknęły "nie licz moich wizyt".

   Reguły Firestore, których wymaga ten plik — na końcu pliku.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCq6q-GqkILS9E7xXSl65bn856IkiUaGc",
  authDomain: "progress-app-2d372.firebaseapp.com",
  projectId: "progress-app-2d372",
  storageBucket: "progress-app-2d372.firebasestorage.app",
  messagingSenderId: "40639690555",
  appId: "1:40639690555:web:cf7b4f8d17d5dd051b691e"
};

const COLLECTION   = "analytics_hits";
const HEARTBEAT_MS = 30_000;   // co ile odświeżać "ostatnio widziany"
const MAX_MINUTES  = 30;       // po tylu minutach przestajemy doliczać czas

/* --- kogo w ogóle nie liczymy ------------------------------------------- */

const UA    = navigator.userAgent || "";
const DEBUG = /[?&]kcs_debug=1/.test(location.search);   // do testów lokalnych

const isBot = navigator.webdriver === true ||
  /bot|crawler|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests/i.test(UA);

const isLocal = location.protocol === "file:" ||
  ["localhost", "127.0.0.1", "[::1]", "::1", ""].includes(location.hostname);

const note = (msg) => console.info("[kacperos] " + msg);

if (localStorage.getItem("kcs_ignore") === "1") note("ta przeglądarka jest wykluczona ze statystyk");
else if (isBot && !DEBUG)   note("wygląda na robota — nie liczę tej odsłony");
else if (isLocal && !DEBUG) note("podgląd lokalny — nie liczę (dodaj ?kcs_debug=1, żeby przetestować zapis)");
else start();

/* --- pomocnicze --------------------------------------------------------- */

function newId(prefix) {
  const r = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
    .replace(/-/g, "").slice(0, 8);
  return prefix + r;
}

/** Stały identyfikator przeglądarki — ten sam człowiek między wizytami. */
function visitorId() {
  let v = localStorage.getItem("kcs_vid");
  if (!v) { v = newId("v_"); localStorage.setItem("kcs_vid", v); }
  return v;
}

/** Kiedy ta przeglądarka trafiła tu pierwszy raz — stąd "nowi vs powracający". */
function firstSeen() {
  let t = +localStorage.getItem("kcs_first");
  if (!t) { t = Date.now(); localStorage.setItem("kcs_first", String(t)); }
  return t;
}

/** Identyfikator sesji — ginie po zamknięciu karty. */
function sessionId() {
  let s = sessionStorage.getItem("kcs_sid");
  if (!s) { s = newId("s_"); sessionStorage.setItem("kcs_sid", s); }
  return s;
}

/** Czy to pierwsza strona tej sesji — do tabeli "strony wejścia". */
function isEntry() {
  if (sessionStorage.getItem("kcs_entry") === "1") return false;
  sessionStorage.setItem("kcs_entry", "1");
  return true;
}

/** Nick, jeśli któraś ze stron go zna (wspólne kodowanie, sieć, logowanie). */
function knownUser() {
  const explicit = window.KACPEROS_USER;
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim().slice(0, 60);
  for (const key of ["tolimpiansNetworkNick", "tolimpians-nick", "nick", "user", "username", "uczen", "kcs_user"]) {
    const v = localStorage.getItem(key);
    if (v && v.length < 60 && !v.startsWith("{") && !v.startsWith("[")) return v.trim();
  }
  return null;
}

/**
 * Ścieżka w postaci, w jakiej widzi ją człowiek: bez ".html" (serwer i tak
 * serwuje ładne adresy) i bez śmieci z kampanii — inaczej jedna strona
 * rozsypuje się w tabeli na kilka osobnych wierszy.
 */
function cleanPath() {
  let p = location.pathname.replace(/\/{2,}/g, "/").replace(/\.html?$/i, "");
  p = p.replace(/\/index$/i, "/");
  if (p.length > 1) p = p.replace(/\/$/, "");
  if (!p) p = "/";

  const keep = new URLSearchParams();
  for (const [k, v] of new URLSearchParams(location.search)) {
    if (/^(utm_|fbclid|gclid|msclkid|kcs_)/i.test(k)) continue;
    keep.append(k, v);
  }
  const q = keep.toString();
  return (q ? p + "?" + q : p).slice(0, 200);
}

function deviceType(ua) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobile|iPhone|iPod|Android|IEMobile|BlackBerry|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

function browserName(ua) {
  if (/Edg\//.test(ua))                            return "Edge";
  if (/OPR\/|Opera/.test(ua))                      return "Opera";
  if (/SamsungBrowser/.test(ua))                   return "Samsung";
  if (/Firefox\//.test(ua))                        return "Firefox";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Safari\//.test(ua))                         return "Safari";
  return "inna";
}

function osName(ua) {
  if (/Windows NT 10|Windows NT 11/.test(ua)) return "Windows";
  if (/Windows/.test(ua))                     return "Windows (starszy)";
  if (/Android/.test(ua))                     return "Android";
  if (/iPhone|iPad|iPod/.test(ua))            return "iOS";
  if (/Mac OS X/.test(ua))                    return "macOS";
  if (/Linux/.test(ua))                       return "Linux";
  return "inny";
}

/** Skąd przyszedł — host odsyłacza plus jego kategoria. */
function referrerInfo() {
  const raw = document.referrer || "";
  if (!raw) return { ref: "", refType: "bezpośrednie" };
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    if (host === location.hostname)                                 return { ref: host, refType: "wewnętrzne" };
    if (/google\.|bing\.|duckduckgo|yahoo|ecosia|brave/.test(host))  return { ref: host, refType: "wyszukiwarka" };
    if (/facebook|instagram|tiktok|youtube|youtu\.be|t\.co|twitter|x\.com|linkedin|discord|messenger/.test(host))
                                                                    return { ref: host, refType: "social" };
    return { ref: host, refType: "odsyłacz" };
  } catch {
    return { ref: "", refType: "bezpośrednie" };
  }
}

/**
 * Przybliżona lokalizacja z ipapi.co (ten sam serwis, którego już używasz
 * w projekcie). Zapisujemy WYŁĄCZNIE miasto i kraj — pełny adres IP nie
 * trafia do bazy. Wynik jest cache'owany na dobę, żeby nie zużywać limitu.
 */
async function geo() {
  const DAY = 86_400_000;
  try {
    const cached = JSON.parse(localStorage.getItem("kcs_geo") || "null");
    if (cached && Date.now() - cached.at < DAY) return cached.v;
  } catch { /* uszkodzony cache — pobierz od nowa */ }

  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    const v = { city: d.city || "", country: d.country_code || "" };
    localStorage.setItem("kcs_geo", JSON.stringify({ at: Date.now(), v }));
    return v;
  } catch {
    return { city: "", country: "" };
  }
}

/**
 * Ostatni zapis przy zamykaniu karty. Zwykły updateDoc bywa wtedy ucinany
 * razem ze stroną, więc idziemy prosto do REST-owego Firestore z keepalive —
 * taki request przeżywa zamknięcie karty.
 */
function beacon(id, fields) {
  const mask = Object.keys(fields).map(k => "&updateMask.fieldPaths=" + k).join("");
  const url  = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}`
             + `/databases/(default)/documents/${COLLECTION}/${id}`
             + `?key=${firebaseConfig.apiKey}${mask}`;
  const body = JSON.stringify({
    fields: Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, { integerValue: String(Math.round(v)) }]))
  });
  return fetch(url, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body, keepalive: true
  });
}

/* --- właściwy pomiar ----------------------------------------------------- */

async function start() {
  let db, hitRef;
  try {
    db = getFirestore(initializeApp(firebaseConfig, "kacperos"));
  } catch (e) {
    console.warn("[kacperos] nie udało się połączyć z bazą:", e);
    return;
  }

  const started = Date.now();
  const { ref, refType } = referrerInfo();

  /* Czas liczymy tylko wtedy, gdy karta jest na wierzchu — inaczej
     "średni czas czytania" mierzyłby zapomniane karty w tle. */
  const CAP = MAX_MINUTES * 60;
  let visibleMs = 0;
  let visibleSince = document.visibilityState === "visible" ? Date.now() : null;

  function freeze() {
    if (visibleSince) { visibleMs += Date.now() - visibleSince; visibleSince = null; }
  }
  const secs = () => Math.min(CAP,
    Math.round((visibleMs + (visibleSince ? Date.now() - visibleSince : 0)) / 1000));

  const hit = {
    vid:    visitorId(),
    sid:    sessionId(),
    vfirst: firstSeen(),
    user:   knownUser(),
    entry:  isEntry(),
    path:   cleanPath(),
    title:  (document.title || "").slice(0, 120),
    ref, refType,
    ts:     started,
    last:   started,
    dur:    0,
    dev:    deviceType(UA),
    br:     browserName(UA),
    os:     osName(UA),
    scr:    `${screen.width}x${screen.height}`,
    lang:   (navigator.language || "").slice(0, 10),
    city:   "",
    country: ""
  };

  try {
    hitRef = await addDoc(collection(db, COLLECTION), hit);
  } catch (e) {
    console.warn("[kacperos] nie udało się zapisać odsłony:", e);
    return;
  }
  if (DEBUG) note("zapisano odsłonę " + hitRef.id + " → " + hit.path);

  const push = (extra) => updateDoc(doc(db, COLLECTION, hitRef.id), extra);

  // Lokalizacja dociąga się osobno, żeby nie opóźniać zapisu odsłony.
  geo().then(g => {
    if (g.city || g.country) push({ city: g.city, country: g.country }).catch(() => {});
  });

  const timer = setInterval(() => {
    if (document.visibilityState !== "visible") return;   // karta w tle się nie liczy
    if (secs() >= CAP) { clearInterval(timer); return; }
    push({ last: Date.now(), dur: secs() }).catch(() => {});
  }, HEARTBEAT_MS);

  // Przełączenie karty: zatrzymujemy zegar i od razu zapisujemy stan.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") { visibleSince = Date.now(); return; }
    freeze();
    push({ last: Date.now(), dur: secs() }).catch(() => {});
  });

  // Zamknięcie karty — pagehide łapie też telefony.
  addEventListener("pagehide", () => {
    clearInterval(timer);
    freeze();
    const fields = { last: Date.now(), dur: secs() };
    try { beacon(hitRef.id, fields); }
    catch { push(fields).catch(() => {}); }
  }, { once: true });
}

/* ============================================================
   REGUŁY FIRESTORE dla kolekcji analytics_hits
   (Firebase → Firestore Database → Rules). Każdy może dopisać
   własną odsłonę i doszlifować swój wpis, nikt nie skasuje ani
   nie podmieni cudzego dokumentu:

   match /analytics_hits/{hit} {
     allow create: if request.resource.data.keys().hasAll(['vid','path','ts'])
                   && request.resource.data.ts is int
                   && request.resource.data.path.size() < 220;
     allow update: if request.resource.data.diff(resource.data)
                     .affectedKeys().hasOnly(['last','dur','city','country']);
     allow read:   if true;    // panel czyta bez logowania
     allow delete: if false;
   }
   ============================================================ */
