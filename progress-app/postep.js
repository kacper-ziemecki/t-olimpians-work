/* ═══════════════════════════════════════════════════════════════════════════
   T-Olimpians — postęp w kursach i „ukończenia” do statystyk

   Używają tego: progress-app/index.html (lista ucznia: kursy, Statystyka, mapa aktywności)
                 progress-app/admin.html (panel admina: 7 dni, wykres wszystkich uczniów,
                                          ostatnio ukończone, postęp w kursach)
   Jedne reguły w obu miejscach — uczeń i nauczyciel widzą te same liczby.

   KURSY — element listy może być kursem trzech rodzajów. Postęp każdego leży w polu kp
   elementu: klucz → czas odhaczenia (ms). Dawne odhaczenia w mini kursach mają true
   (bez czasu) — liczą się do postępu kursu, ale nie trafiają na wykres ani mapę aktywności.

   • KURS Z PLANERA — type "kurs", kroki w plan.steps (planer-app/planer.html):
       z|<id kroku>              zadanie zrobione
       t|<id kroku>              temat bez materiałów przerobiony
       m|<id kroku>|<nr>         film obejrzany / artykuł przeczytany (nr w materials)
     Krok może też być lekcją C++ (type "lekcja") — jej części i zadania mają klucze jak niżej.
   • MINI KURS Z KOMPENDIUM — temat albo zadanie z linkiem …/net#temat=<kat>/<temat>[/<zagadnienie>]
     (pole komp), treść z /network-data.json:
       v|<zagadnienie>|<tytuł>   film obejrzany
       t|<zagadnienie>|<nazwa>   zadanie zrobione
       l|<zagadnienie>|<adres>   materiał do przeczytania przeczytany
   • LEKCJA „C++ OD PODSTAW” — type "kurs" z polem cpp = { kurs, czesc } (albo dawny element z linkiem
     do lekcji …/c++_logika/<lekcja>.html[#<część>]), treść z /c++_logika/kursy.json (lekcje-cpp-zadania/kursy.js):
       c|<lekcja>|<część>        część lekcji przeczytana (baza zadań ma tylko zadania)
       cz|<zadanie>              zadanie zrobione (id zadania ze sprawdzarki, np. tab-pierwsza-tablica)

   UKOŃCZENIE (event) — jedno odhaczenie z czasem, liczone na wykresie i mapie aktywności:
     { t, kind, title, url, from, via }
       kind  "zadanie" | "film" | "artykul" | "czesc" | "temat"  (KIND_CAT: seria wykresu, KIND_LABEL: podpis)
       from  tytuł kursu, z którego pochodzi, via: "kurs" | "mini kurs" | "lekcja C++" (zwykły element listy: brak)
   Każde zadanie, film, artykuł i część lekcji w kursie to osobne ukończenie; temat i lekcja z planera dochodzą
   jeszcze jako „temat”, gdy odhaczone jest w nich wszystko (tak jak zwykły temat z listy).
   ═══════════════════════════════════════════════════════════════════════════ */

export const KOMP_VIDEO_HOSTS = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/i;

/** Czas odhaczenia (ms) albo null — dawne true, puste i błędne wartości nie mają czasu. */
export const markTime = v => (typeof v === "number" && isFinite(v) && v > 0) ? v : null;
const kpOf = item => (item && item.kp && typeof item.kp === "object") ? item.kp : {};

/** rodzaj ukończenia → seria na wykresie (zadania / materiały / tematy) */
export const KIND_CAT = { zadanie: "zadanie", film: "material", artykul: "material", czesc: "material", temat: "temat" };
/** rodzaj ukończenia → podpis na znaczniku */
export const KIND_LABEL = { zadanie: "zadanie", film: "film", artykul: "artykuł", czesc: "lekcja", temat: "temat" };

/* ═══ KURS Z PLANERA ═══ */
export const pkKey = {
  task: s => "z|" + s.id,
  topic: s => "t|" + s.id,           // temat bez materiałów odhacza się w całości
  mat: (s, k) => "m|" + s.id + "|" + k
};
export const pkSteps = item => (item && item.plan && Array.isArray(item.plan.steps)) ? item.plan.steps : [];
const stepMats = s => Array.isArray(s.materials) ? s.materials : [];
/** krok-lekcja C++ → rozwiązana lekcja (cpResolve) albo null, gdy katalog się wczytuje / nie ma lekcji */
export function pkLesson(s, cpp){
  if(!s || s.type !== "lekcja") return null;
  const res = cpResolve({ kurs: String(s.lekcja || ""), czesc: String(s.czesc || "") }, cpp);
  return res.kurs ? res : null;
}

/* cpp: katalog lekcji C++ (/c++_logika/kursy.json) — potrzebny tylko krokom-lekcjom; bez niego lekcja nie jest ukończona */
export function pkStepDone(s, kp, cpp){
  if(s.type === "zadanie") return !!kp[pkKey.task(s)];
  if(s.type === "lekcja"){
    const res = pkLesson(s, cpp);
    if(!res) return false;
    const st = cpStats(res, kp);
    return st.all > 0 && st.done === st.all;
  }
  const mats = stepMats(s);
  return mats.length ? mats.every((m, k) => kp[pkKey.mat(s, k)]) : !!kp[pkKey.topic(s)];
}
/** kiedy krok został ukończony (najpóźniejsze odhaczenie w kroku) albo null */
export function pkStepTime(s, kp, cpp){
  if(!pkStepDone(s, kp, cpp)) return null;
  const mats = stepMats(s);
  const keys = s.type === "zadanie" ? [pkKey.task(s)] : s.type === "lekcja" ? cpKeys(pkLesson(s, cpp))
    : mats.length ? mats.map((m, k) => pkKey.mat(s, k)) : [pkKey.topic(s)];
  return markTime(Math.max(...keys.map(k => markTime(kp[k]) || 0)));
}
/** Liczniki kursu. Jednostki (u…) = wszystko, co da się odhaczyć: zadania, filmy, artykuły, części lekcji C++
 *  i tematy bez materiałów — po nich idzie pasek postępu, więc rusza się przy każdym odhaczeniu.
 *  Zadania lekcji C++ liczą się do zadań (z…), przeczytane części lekcji — do c… */
export function pkStats(steps, kp, cpp){
  const st = { sDone: 0, sAll: steps.length, zDone: 0, zAll: 0, tDone: 0, tAll: 0, lDone: 0, lAll: 0, cDone: 0, cAll: 0,
               fDone: 0, fAll: 0, aDone: 0, aAll: 0, mDone: 0, mAll: 0, uDone: 0, uAll: 0, next: -1 };
  steps.forEach((s, i) => {
    const done = pkStepDone(s, kp, cpp);
    if(done) st.sDone++; else if(st.next < 0) st.next = i;
    if(s.type === "zadanie"){ st.zAll++; if(done){ st.zDone++; st.uDone++; } st.uAll++; return; }
    if(s.type === "lekcja"){
      st.lAll++;
      if(done) st.lDone++;
      const res = pkLesson(s, cpp);
      if(!res) return;
      const ls = cpStats(res, kp);
      st.zDone += ls.zDone; st.zAll += ls.zAll;
      st.cDone += ls.cDone; st.cAll += ls.cAll;
      st.uDone += ls.done; st.uAll += ls.all;
      return;
    }
    st.tAll++;
    if(done) st.tDone++;
    const mats = stepMats(s);
    if(!mats.length){ st.uAll++; if(done) st.uDone++; return; }
    mats.forEach((m, k) => {
      const on = !!kp[pkKey.mat(s, k)];
      if(m && m.kind === "film"){ st.fAll++; if(on) st.fDone++; }
      else{ st.aAll++; if(on) st.aDone++; }
      st.uAll++;
      if(on) st.uDone++;
    });
  });
  st.mDone = st.fDone + st.aDone;
  st.mAll = st.fAll + st.aAll;
  return st;
}

/* ═══ MINI KURS Z KOMPENDIUM ═══ */
/* musi dawać to samo co tdxSlug() w net.html */
export function kSlug(str){
  const from = "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", to = "acelnoszzACELNOSZZ";
  const s = String(str || "").replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, c => to[from.indexOf(c)]);
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
          .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
export function kParseLink(text){
  const str = String(text || "").trim();
  const at = str.indexOf("#temat=");
  if(at < 0) return null;
  let h = str.slice(at);
  try{ h = decodeURIComponent(h); }catch(e){}
  const m = h.match(/^#temat=([^/\s]+)\/([^/\s]+)(?:\/([^\s]+))?$/);
  return m ? { cat: m[1], topic: m[2], sec: m[3] || null } : null;
}
export function itemKompRef(item){
  if(!item) return null;
  if(item.komp && item.komp.cat && item.komp.topic) return item.komp;
  return kParseLink(item.url);
}

/* ─ normalizacja danych — tak samo jak w net.html (getTopicViewSections) ─ */
function kVideos(videos){
  if(!Array.isArray(videos)) return [];
  return videos
    .map(v => typeof v === "string" ? { title: "", url: v } : { title: v.title || v.label || "", url: v.url || "", author: v.author || "", duration: v.duration || "" })
    .filter(v => v.url || v.title)
    .map(v => ({ ...v, title: v.title || v.url }));
}
function kTasks(tasks){
  if(!tasks) return [];
  const arr = Array.isArray(tasks) ? tasks : String(tasks).split(",").map(s => s.trim()).filter(Boolean);
  return arr.map(t => typeof t === "string"
      ? { name: t, url: "" }
      : { name: t.name || "", url: t.url || "", platform: t.platform || "", level: t.level || "", hint: t.hint || "", solution: t.solution || "" })
    .filter(t => t.name);
}
function kLinks(links){
  return (Array.isArray(links) ? links : []).map(l => ({ label: (l && l.label) || "", url: (l && l.url) || "" })).filter(l => l.label || l.url);
}
export function kSections(topic){
  const secs = (Array.isArray(topic.sections) ? topic.sections : []).map((s, i) => ({
    name: (s && s.name) || ("Zagadnienie " + (i + 1)),
    note: (s && s.note) || "",
    videos: kVideos(s && s.videos),
    links: kLinks(s && s.links),
    tasks: kTasks(s && s.tasks)
  }));
  const gen = kLinks(topic.links), genTasks = kTasks(topic.tasks);
  const genVideos = kVideos(gen.filter(l => KOMP_VIDEO_HOSTS.test(l.url)));
  const genLinks = gen.filter(l => !KOMP_VIDEO_HOSTS.test(l.url));
  if(genVideos.length || genLinks.length || genTasks.length){
    secs.push({ name: secs.length ? "Materiały ogólne" : "Materiały i zadania", note: "", videos: genVideos, links: genLinks, tasks: genTasks });
  }
  return secs;
}

/** ref → { catName, topicName, note, sections, secIndex, shown[] } albo { loading } / { error }.
 *  data: dane kompendium (/network-data.json) — null = jeszcze się wczytują, false = błąd. */
const resCache = new WeakMap();      // dane kompendium → Map(ref → wynik)
export function kResolve(ref, data){
  if(data === null || data === undefined) return { loading: true };
  if(!Array.isArray(data)) return { error: "Nie udało się wczytać kompendium." };
  let cache = resCache.get(data);
  if(!cache){ cache = new Map(); resCache.set(data, cache); }
  const key = ref.cat + "/" + ref.topic + "/" + (ref.sec || "");
  if(!cache.has(key)) cache.set(key, kResolveRaw(ref, data));
  return cache.get(key);
}
function kResolveRaw(ref, data){
  const cat = data.find(c => kSlug(c.cat) === ref.cat);
  if(!cat) return { error: "Nie ma już takiej kategorii w kompendium." };
  const raw = (cat.topics || []).find(t => kSlug(typeof t === "string" ? t : t.name) === ref.topic);
  if(!raw) return { error: "Nie ma już takiego tematu w kompendium." };
  const topic = typeof raw === "string" ? { name: raw } : raw;
  const sections = kSections(topic);
  let secIndex = -1;
  if(ref.sec){
    secIndex = sections.findIndex(s => kSlug(s.name) === ref.sec);
    if(secIndex < 0 && /^\d+$/.test(ref.sec)) secIndex = parseInt(ref.sec, 10) - 1;
    if(secIndex < 0 || secIndex >= sections.length) return { error: "Nie ma już takiego zagadnienia w temacie „" + topic.name + "”." };
  }
  return {
    catName: cat.cat, topicName: topic.name, note: topic.note || "",
    sections, secIndex,
    shown: secIndex > -1 ? [secIndex] : sections.map((_, i) => i)
  };
}

export const kVideoKey = (sec, v) => "v|" + sec.name + "|" + (v.title || v.url);
export const kTaskKey = (sec, t) => "t|" + sec.name + "|" + t.name;
export const kLinkKey = (sec, l) => "l|" + sec.name + "|" + (l.url || l.label);   // etykiety potrafią się powtarzać, adresy nie

export function kSecStats(sec, kp){
  const vDone = sec.videos.filter(v => kp[kVideoKey(sec, v)]).length;
  const tDone = sec.tasks.filter(t => kp[kTaskKey(sec, t)]).length;
  const lDone = sec.links.filter(l => kp[kLinkKey(sec, l)]).length;
  const vAll = sec.videos.length, tAll = sec.tasks.length, lAll = sec.links.length;
  return { vDone, vAll, tDone, tAll, lDone, lAll, done: vDone + tDone + lDone, all: vAll + tAll + lAll };
}
export function kStats(res, kp){
  const out = { vDone: 0, vAll: 0, tDone: 0, tAll: 0, lDone: 0, lAll: 0, done: 0, all: 0 };
  res.shown.forEach(i => {
    const s = kSecStats(res.sections[i], kp);
    for(const k in out) out[k] += s[k];
  });
  return out;
}

/* klucz postępu mini kursu → { kind, title, url } (z danych kompendium) */
function kKeyIndex(res){
  const map = new Map();
  for(const sec of res.sections){
    sec.videos.forEach(v => map.set(kVideoKey(sec, v), { kind: "film", title: v.title || v.url, url: v.url }));
    sec.tasks.forEach(t => map.set(kTaskKey(sec, t), { kind: "zadanie", title: t.name, url: t.url }));
    sec.links.forEach(l => map.set(kLinkKey(sec, l), { kind: "artykul", title: l.label || l.url, url: l.url }));
  }
  return map;
}
/* …a gdy kompendium się nie wczytało albo temat się zmienił — z samego klucza */
function kKeyGuess(key){
  const kind = { v: "film", t: "zadanie", l: "artykul" }[key.charAt(0)];
  if(!kind || key.charAt(1) !== "|") return null;
  const rest = key.slice(2), bar = rest.indexOf("|");
  const tail = bar < 0 ? rest : rest.slice(bar + 1);
  const url = kind === "artykul" && /^https?:\/\//i.test(tail) ? tail : "";
  return { kind, title: (url ? url.replace(/^https?:\/\/(www\.)?/i, "") : tail) || "(bez nazwy)", url };
}

/* ═══ LEKCJE „C++ OD PODSTAW” ═══
   Katalog /c++_logika/kursy.json (lekcje-cpp-zadania/kursy.js): { zadania: "<adres zadania bez id>", etapy: [{ nr, nazwa }],
   kursy: [{ id, nr, etap, tytul, opis, url, filmy, czesci: [{ id, nr, nazwa, opis, baza, zadania: [{ id, nazwa, poziom }] }] }] }.
   Klucze postępu nie zależą od miejsca (osobny element listy czy krok kursu z planera), więc odhaczenie
   tej samej części albo zadania znaczy to samo w każdym kursie. */
export const CPP_URL = "/c++_logika/kursy.json";
const SITE = "https://t-olimpians.com";
const CPP_TASK_URL = "/zadania-tematowe-app/zadania.html#";
export const cpKey = {
  read: (kurs, czesc) => "c|" + kurs + "|" + czesc,
  task: id => "cz|" + id
};
/** baza zadań nie ma „przeczytane” — tylko zadania */
export const cpReadable = c => !!c && !c.baza;
export const cpTasks = c => (c && Array.isArray(c.zadania)) ? c.zadania : [];
/** adres zadania w sprawdzarce (względny — działa też na podglądzie i lokalnie) */
export const cpTaskHref = (z, cat) => ((cat && typeof cat.zadania === "string" && cat.zadania) || CPP_TASK_URL) + z.id;

/** link do lekcji → { kurs, czesc } (czy lekcja istnieje, sprawdza dopiero cpResolve) albo null.
 *  Rozpoznaje …/c++_logika/<lekcja>[.html][#<część>] (także c%2B%2B_logika i adres względny),
 *  a dawne t-olimpians.com/<lekcja> (przekierowania z _redirects) jako stary: true. */
export function cpParseLink(text){
  let s = String(text || "").trim();
  if(!s || s.length > 600) return null;
  s = s.replace(/%2B/gi, "+");
  const hash = s.match(/#([\w-]+)\/?\s*$/);
  const czesc = hash ? hash[1] : "";
  let m = s.match(/(?:^|\/)c\+\+_logika\/([\w-]+?)(?:\.html?)?\/?(?:[?#]|$)/i);
  if(m) return { kurs: m[1].toLowerCase(), czesc };
  m = s.match(/^(?:https?:\/\/)?(?:www\.)?t-olimpians\.com\/([\w-]+?)(?:\.html?)?\/?(?:[?#]|$)/i);
  if(m) return { kurs: m[1].toLowerCase(), czesc, stary: true };
  return null;
}
/** lekcja C++ elementu listy: pole cpp albo (dawny element) link do lekcji; kurs z planera ma własne kroki */
export function itemCppRef(item){
  if(!item || typeof item !== "object") return null;
  const c = item.cpp;
  if(c && typeof c === "object" && typeof c.kurs === "string" && c.kurs) return { kurs: c.kurs, czesc: typeof c.czesc === "string" ? c.czesc : "" };
  if(item.type === "kurs" || itemKompRef(item)) return null;
  return cpParseLink(item.url);
}

/** ref → { kurs, etap, parts, part } albo { loading } / { error } / { missing } (dawny adres, który nie jest lekcją).
 *  cpp: katalog — null = jeszcze się wczytuje, false = błąd. Nieznana część (np. #filmy) = cała lekcja. */
const cpCache = new WeakMap();
export function cpResolve(ref, cpp){
  if(cpp === null || cpp === undefined) return { loading: true };
  if(!cpp || !Array.isArray(cpp.kursy)) return { error: "Nie udało się wczytać lekcji C++." };
  let cache = cpCache.get(cpp);
  if(!cache){ cache = new Map(); cpCache.set(cpp, cache); }
  const key = ref.kurs + "#" + (ref.czesc || "") + (ref.stary ? "#s" : "");
  if(!cache.has(key)){
    const kurs = cpp.kursy.find(k => k && k.id === ref.kurs);
    let res;
    if(!kurs) res = ref.stary ? { missing: true } : { error: "Nie znalazłem tej lekcji w kursie C++ od podstaw." };
    else{
      const all = Array.isArray(kurs.czesci) ? kurs.czesci : [];
      const part = ref.czesc ? all.find(c => c.id === ref.czesc) || null : null;
      res = { kurs, etap: (cpp.etapy || []).find(e => e.nr === kurs.etap) || null, parts: part ? [part] : all, part, cat: cpp };
    }
    cache.set(key, res);
  }
  return cache.get(key);
}
/** tytuł lekcji (albo „lekcja — część”) do nazwy elementu listy / kroku planu */
export const cpTitle = res => res.part ? res.kurs.tytul + " — " + res.part.nazwa : res.kurs.tytul;
/** wszystkie klucze postępu lekcji (części do przeczytania i zadania) */
export function cpKeys(res){
  if(!res) return [];
  const out = [];
  for(const c of res.parts){
    if(cpReadable(c)) out.push(cpKey.read(res.kurs.id, c.id));
    for(const z of cpTasks(c)) out.push(cpKey.task(z.id));
  }
  return out;
}
export function cpPartStats(kurs, c, kp){
  const read = cpReadable(c) ? !!kp[cpKey.read(kurs.id, c.id)] : null;
  const zs = cpTasks(c);
  const zDone = zs.filter(z => kp[cpKey.task(z.id)]).length;
  return { read, zDone, zAll: zs.length, done: zDone + (read ? 1 : 0), all: zs.length + (read === null ? 0 : 1) };
}
/** liczniki lekcji: c… części przeczytane, z… zadania, p… części ukończone w całości, next = pierwsza nieukończona */
export function cpStats(res, kp){
  const st = { cDone: 0, cAll: 0, zDone: 0, zAll: 0, pDone: 0, pAll: res.parts.length, done: 0, all: 0, next: -1 };
  res.parts.forEach((c, i) => {
    const s = cpPartStats(res.kurs, c, kp);
    if(s.read !== null){ st.cAll++; if(s.read) st.cDone++; }
    st.zDone += s.zDone; st.zAll += s.zAll; st.done += s.done; st.all += s.all;
    if(s.done === s.all) st.pDone++; else if(st.next < 0) st.next = i;
  });
  return st;
}

/* klucz lekcji → { kind, title, url } — indeks całego katalogu (klucze są wspólne dla wszystkich kursów) */
const cpIndexCache = new WeakMap();
function cpKeyIndex(cpp){
  if(!cpp || !Array.isArray(cpp.kursy)) return null;
  if(cpIndexCache.has(cpp)) return cpIndexCache.get(cpp);
  const map = new Map();
  for(const k of cpp.kursy){
    for(const c of (k && Array.isArray(k.czesci) ? k.czesci : [])){
      if(cpReadable(c)) map.set(cpKey.read(k.id, c.id), { kind: "czesc", title: k.tytul + " — " + c.nazwa, url: SITE + k.url + "#" + c.id });
      for(const z of cpTasks(c)) map.set(cpKey.task(z.id), { kind: "zadanie", title: z.nazwa, url: SITE + CPP_TASK_URL + z.id });
    }
  }
  cpIndexCache.set(cpp, map);
  return map;
}
/* …a gdy katalog się nie wczytał — z samego klucza */
function cpKeyGuess(key){
  let m = key.match(/^c\|([\w-]+)\|([\w-]+)$/);
  if(m) return { kind: "czesc", title: m[1] + " — " + m[2], url: SITE + "/c++_logika/" + m[1] + ".html#" + m[2] };
  m = key.match(/^cz\|([\w-]+)$/);
  if(m) return { kind: "zadanie", title: m[1], url: SITE + CPP_TASK_URL + m[1] };
  return null;
}
const isCpKey = key => key.startsWith("c|") || key.startsWith("cz|");
/** ukończenia z kluczy lekcji C++ w kp (w kolejności kluczy) */
function cpEvents(kp, cpp, from, via){
  const out = [];
  const index = cpKeyIndex(cpp);
  for(const [key, v] of Object.entries(kp)){
    if(!isCpKey(key)) continue;
    const t = markTime(v);
    if(!t) continue;
    const info = (index && index.get(key)) || cpKeyGuess(key);
    if(info) out.push({ t, ...info, from, via });
  }
  return out;
}

/* ═══ UKOŃCZENIA ═══ */
/** Ukończenia jednego elementu listy (patrz komentarz na górze).
 *  komp: dane kompendium, cpp: katalog lekcji C++ — null, gdy jeszcze się nie wczytały (tytuły biorą się wtedy z kluczy). */
export function itemEvents(item, komp, cpp){
  const out = [];
  if(!item || typeof item !== "object") return out;
  const kp = kpOf(item);
  const cref = itemCppRef(item);
  if(cref && item.type === "kurs"){
    return cpEvents(kp, cpp, item.title || "Lekcja C++", "lekcja C++");   // sam kurs (done) się nie liczy
  }
  if(item.type === "kurs"){
    const from = item.title || "Kurs", via = "kurs";
    for(const e of cpEvents(kp, cpp, from, via)) out.push(e);            // części i zadania kroków-lekcji
    for(const s of pkSteps(item)){
      const title = s.title || "(bez nazwy)", url = s.url || "";
      if(s.type === "zadanie"){
        const t = markTime(kp[pkKey.task(s)]);
        if(t) out.push({ t, kind: "zadanie", title, url, from, via });
        continue;
      }
      if(s.type === "lekcja"){
        const t = pkStepTime(s, kp, cpp);  // cała lekcja przerobiona — jak temat
        if(t) out.push({ t, kind: "temat", title, url, from, via });
        continue;
      }
      const mats = stepMats(s);
      if(!mats.length){
        const t = markTime(kp[pkKey.topic(s)]);
        if(t) out.push({ t, kind: "temat", title, url, from, via });
        continue;
      }
      mats.forEach((m, k) => {
        const t = markTime(kp[pkKey.mat(s, k)]);
        if(t) out.push({ t, kind: m && m.kind === "film" ? "film" : "artykul", title: (m && (m.title || m.url)) || "(bez nazwy)", url: (m && m.url) || "", from, via });
      });
      const t = pkStepTime(s, kp, cpp);  // cały temat przerobiony — jak odhaczony temat z listy
      if(t) out.push({ t, kind: "temat", title, url, from, via });
    }
    return out;                          // sam kurs (done) się nie liczy — liczą się jego kroki
  }
  const doneAt = markTime(item.doneAt);
  if(item.done && doneAt){
    out.push({ t: doneAt, kind: item.type === "zadanie" ? "zadanie" : "temat", title: item.title || "(bez nazwy)", url: item.url || "" });
  }
  if(cref){                              // dawny element z linkiem do lekcji (zadanie / temat) — też odhacza się po kawałku
    for(const e of cpEvents(kp, cpp, item.title || "Lekcja C++", "lekcja C++")) out.push(e);
    return out;
  }
  const ref = itemKompRef(item);
  if(ref){
    const res = kResolve(ref, komp);
    const index = res.sections ? kKeyIndex(res) : null;
    const from = item.title || "Mini kurs", via = "mini kurs";
    for(const [key, v] of Object.entries(kp)){
      const t = markTime(v);
      if(!t) continue;
      const info = (index && index.get(key)) || kKeyGuess(key);
      if(info) out.push({ t, ...info, from, via });
    }
  }
  return out;
}
/** Wszystkie ukończenia z listy ucznia (bez sortowania). */
export function completionEvents(items, komp, cpp){
  const out = [];
  for(const item of items || []) for(const e of itemEvents(item, komp, cpp)) out.push(e);
  return out;
}

/* ═══ POSTĘP KURSU ═══
   → null (to nie kurs / dane jeszcze się wczytują / temat nie ma czego odhaczać) albo
     { id, via, title, done, all, pct, z, f, a, c, steps, next, last, complete }
       done/all  jednostki (zadania + filmy + artykuły + części lekcji [+ tematy bez materiałów])
       z, f, a   [zrobione, wszystkie] zadania, filmy, artykuły / materiały do przeczytania
       c         [przeczytane, wszystkie] części lekcji C++
       steps     [ukończone, wszystkie] kroki kursu z planera (mini kurs i lekcja: null)
       next      następny krok (kurs), zagadnienie (mini kurs) albo część (lekcja) do zrobienia, "" gdy brak
       last      czas ostatniego odhaczenia w kursie (0 = nic) */
export function courseProgress(item, komp, cpp){
  if(!item || typeof item !== "object") return null;
  const kp = kpOf(item);
  const last = Math.max(0, ...Object.values(kp).map(v => markTime(v) || 0));
  const pct = (d, a) => a ? Math.round(d / a * 100) : 0;
  const cref = itemCppRef(item);
  if(cref){
    const res = cpResolve(cref, cpp);
    if(!res.kurs) return null;
    const st = cpStats(res, kp);
    if(!st.all) return null;
    return {
      id: item.id, via: "lekcja C++", title: item.title || cpTitle(res),
      done: st.done, all: st.all, pct: pct(st.done, st.all),
      z: [st.zDone, st.zAll], f: [0, 0], a: [0, 0], c: [st.cDone, st.cAll], steps: null,
      next: st.next > -1 && res.parts.length > 1 ? res.parts[st.next].nazwa : "", last,
      complete: !!item.done || st.done === st.all
    };
  }
  if(item.type === "kurs"){
    const steps = pkSteps(item), st = pkStats(steps, kp, cpp);
    return {
      id: item.id, via: "kurs", title: item.title || "Kurs",
      done: st.uDone, all: st.uAll, pct: pct(st.uDone, st.uAll),
      z: [st.zDone, st.zAll], f: [st.fDone, st.fAll], a: [st.aDone, st.aAll], c: [st.cDone, st.cAll], steps: [st.sDone, st.sAll],
      next: st.next > -1 ? (steps[st.next].title || "(bez nazwy)") : "", last,
      complete: !!item.done || (st.sAll > 0 && st.sDone === st.sAll)
    };
  }
  const ref = itemKompRef(item);
  if(!ref) return null;
  const res = kResolve(ref, komp);
  if(!res.sections) return null;
  const st = kStats(res, kp);
  if(!st.all) return null;
  let next = "";
  if(res.shown.length > 1){
    const i = res.shown.find(i => { const s = kSecStats(res.sections[i], kp); return s.done < s.all; });
    if(i !== undefined) next = res.sections[i].name;
  }
  return {
    id: item.id, via: "mini kurs", title: item.title || "Mini kurs",
    done: st.done, all: st.all, pct: pct(st.done, st.all),
    z: [st.tDone, st.tAll], f: [st.vDone, st.vAll], a: [st.lDone, st.lAll], c: [0, 0], steps: null,
    next, last, complete: !!item.done || st.done === st.all
  };
}
