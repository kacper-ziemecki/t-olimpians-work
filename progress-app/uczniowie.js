/* ═══════════════════════════════════════════════════════════════════════════
   T-Olimpians — konta uczniów (logowanie haszem)

   Używają tego: progress-app/index.html (lista postępów ucznia)
                 progress-app/admin.html (panel admina: dodawanie, usuwanie, postępy)
   Inne platformy T-Olimpians mogą logować ucznia tym samym haszem:
       import { savedStudentHash, fetchProfile } from "/progress-app/uczniowie.js";

   HASZ UCZNIA — 16 znaków szesnastkowych (64 losowe bity), pokazywany jako
   xxxx-xxxx-xxxx-xxxx. Działa jak hasło: kto zna hasz, ten wchodzi na listę ucznia.

   DANE — Firestore, projekt progress-app-2d372. Reguły bazy wpuszczają tylko do
   kolekcji z prefiksem training_items_, a przeglądarka nie może wylistować nazw
   kolekcji — więc do kolekcji, w której nazwie jest hasz, trafi tylko ktoś, kto go zna.

     training_items_<hasz>              lista ucznia (dokument = jeden element listy)
       └─ _profil                       { name, createdAt, itemsCollection, … }
     training_items_gryglo              listy ze starych stron progress-app/<id>.html.
     training_items_pankubix_79997      Uczeń z takiej strony ma w profilu
                                        itemsCollection: "training_items_gryglo" — jego dane
                                        zostają tam, gdzie były (nic nie jest kopiowane).
                                        Panel admina może je potem przenieść do kolekcji
                                        z haszem (kopia; stara kolekcja zostaje nietknięta).
     training_items_admin_<id panelu>   panel admina: dokument = uczeń (ID = jego hasz)
       └─ _panel                        { createdAt } — po nim poznajemy, że panel istnieje.
                                        ID panelu = SHA-256 klucza admina (sam klucz
                                        nigdy nie trafia do bazy).
   ═══════════════════════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCCq6q-GqkILS9E7xXSl65bn856IkiUaGc",
  authDomain: "progress-app-2d372.firebaseapp.com",
  projectId: "progress-app-2d372",
  storageBucket: "progress-app-2d372.firebasestorage.app",
  messagingSenderId: "40639690555",
  appId: "1:40639690555:web:cf7b4f8d17d5dd051b691e",
  measurementId: "G-LX80GLN87H"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const PREFIX = "training_items_";
export const PROFILE_ID = "_profil";
export const PANEL_META_ID = "_panel";

const HASH_RE = /^[0-9a-f]{16}$/;
export const PANEL_ID_RE = /^[0-9a-f]{64}$/;
/* ID starej strony (dawny PAGE_ID, nazwa pliku w progress-app bez .html), np. gryglo */
export const LEGACY_ID_RE = /^[A-Za-z0-9_-]{1,60}$/;
const LEGACY_COLLECTION_RE = /^training_items_[A-Za-z0-9_-]{1,60}$/;

/* ─ hasz ─ */

/** Hasz z tego, co człowiek wpisał albo wkleił (spacje, myślniki, wielkie litery,
 *  nawet cała wiadomość od nauczyciela) — albo null, jeśli hasza tam nie ma. */
export function parseHash(text){
  const s = String(text ?? "").trim().toLowerCase();
  const flat = s.replace(/[\s\-–—_.:]/g, "");
  if(HASH_RE.test(flat)) return flat;
  const m = s.match(/(?:^|[^0-9a-z])([0-9a-f]{4})[\s\-–—]?([0-9a-f]{4})[\s\-–—]?([0-9a-f]{4})[\s\-–—]?([0-9a-f]{4})(?![0-9a-z])/);
  return m ? m.slice(1, 5).join("") : null;
}
export const formatHash = h => String(h).replace(/(.{4})(?=.)/g, "$1-");
export const maskHash = h => h.slice(0, 4) + "-••••-••••-" + h.slice(12);

function randomHex(bytes){
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), b => b.toString(16).padStart(2, "0")).join("");
}
export const newHash = () => randomHex(8);

/* ─ gdzie leżą dane ucznia ─ */

export const studentCollection = hash => PREFIX + hash;
export const legacyCollection = id => PREFIX + id;
export const profileRef = hash => doc(db, studentCollection(hash), PROFILE_ID);

/** Kolekcja z elementami listy ucznia: jego własna albo (uczeń ze starej strony) ta wskazana w profilu. */
export function itemsCollectionOf(hash, profile){
  const c = profile && profile.itemsCollection;
  return (typeof c === "string" && LEGACY_COLLECTION_RE.test(c)) ? c : studentCollection(hash);
}

/** Profil ucznia o danym haszu albo null, gdy takiego ucznia nie ma (błąd sieci rzuca wyjątek). */
export async function fetchProfile(hash){
  const snap = await getDoc(profileRef(hash));
  return snap.exists() ? snap.data() : null;
}

/* ─ panel admina ─ */

export const panelCollection = id => PREFIX + "admin_" + id;
export const panelMetaRef = id => doc(db, panelCollection(id), PANEL_META_ID);

export async function panelIdFromKey(key){
  const bytes = new TextEncoder().encode("t-olimpians/panel/" + String(key).trim());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

/** Losowy klucz admina: 20 znaków (100 bitów) bez łatwych do pomylenia liter, np. tol-k3m9q-…  */
export function newAdminKey(){
  const abc = "abcdefghjkmnpqrstvwxyz0123456789";        // 32 znaki → bajt & 31 daje równy rozkład
  const chars = Array.from(crypto.getRandomValues(new Uint8Array(20)), b => abc[b & 31]).join("");
  return "tol-" + chars.replace(/(.{5})(?=.)/g, "$1-");
}

/* ─ pamięć przeglądarki ─
   „Zapamiętaj” → localStorage (zostaje po zamknięciu przeglądarki), inaczej sessionStorage (tylko ta karta). */

const KEYS = { student: "tol_uczen_hasz", panel: "tol_admin_panel", preview: "tol_podglad", previewTab: "tol_podglad_karta" };

function store(kind){ try { return kind === "local" ? localStorage : sessionStorage; } catch(e){ return null; } }
function get(kind, k){ try { return store(kind)?.getItem(k) ?? null; } catch(e){ return null; } }
function set(kind, k, v){ try { store(kind)?.setItem(k, v); } catch(e){} }
function del(kind, k){ try { store(kind)?.removeItem(k); } catch(e){} }

export function savedStudentHash(){
  return parseHash(get("local", KEYS.student)) || parseHash(get("session", KEYS.student));
}
export function saveStudentHash(hash, remember){
  forgetStudentHash();
  set(remember ? "local" : "session", KEYS.student, hash);
}
export function forgetStudentHash(){ del("local", KEYS.student); del("session", KEYS.student); }

export function savedPanelId(){
  for(const kind of ["local", "session"]){
    const v = get(kind, KEYS.panel);
    if(v && PANEL_ID_RE.test(v)) return v;
  }
  return null;
}
export function savePanelId(id, remember){
  forgetPanelId();
  set(remember ? "local" : "session", KEYS.panel, id);
}
export function forgetPanelId(){ del("local", KEYS.panel); del("session", KEYS.panel); }

/* Podgląd listy ucznia z panelu admina. Hasz przekazujemy przez localStorage (nigdy w adresie
   strony — adresy trafiają do historii i statystyk); nowa karta odbiera go od razu i trzyma
   w sessionStorage, żeby podgląd przeżył odświeżenie strony. */
export const PREVIEW_URL = "/progress-app/?podglad=1";
export function handOffPreview(hash){ set("local", KEYS.preview, JSON.stringify({ hash, t: Date.now() })); }
export function takePreviewHash(){
  const raw = get("local", KEYS.preview);
  del("local", KEYS.preview);
  let hash = null;
  try {
    const o = JSON.parse(raw);
    if(o && Date.now() - o.t < 120000) hash = parseHash(o.hash);
  } catch(e){}
  if(hash) set("session", KEYS.previewTab, hash);
  return hash || parseHash(get("session", KEYS.previewTab));
}
export function endPreview(){ del("session", KEYS.previewTab); }
