/* ═══════════════════════════════════════════════════════════════════════════
   T-Olimpians — postęp w kursach i „ukończenia” do statystyk

   Używają tego: progress-app/index.html (lista ucznia: kursy, Statystyka, mapa aktywności)
                 progress-app/admin.html (panel admina: 7 dni, wykres wszystkich uczniów,
                                          ostatnio ukończone, postęp w kursach)
   Jedne reguły w obu miejscach — uczeń i nauczyciel widzą te same liczby.

   KURSY — element listy może być kursem dwóch rodzajów. Postęp obu leży w polu kp
   elementu: klucz → czas odhaczenia (ms). Dawne odhaczenia w mini kursach mają true
   (bez czasu) — liczą się do postępu kursu, ale nie trafiają na wykres ani mapę aktywności.

   • KURS Z PLANERA — type "kurs", kroki w plan.steps (planer-app/planer.html):
       z|<id kroku>              zadanie zrobione
       t|<id kroku>              temat bez materiałów przerobiony
       m|<id kroku>|<nr>         film obejrzany / artykuł przeczytany (nr w materials)
   • MINI KURS Z KOMPENDIUM — temat albo zadanie z linkiem …/net#temat=<kat>/<temat>[/<zagadnienie>]
     (pole komp), treść z /network-data.json:
       v|<zagadnienie>|<tytuł>   film obejrzany
       t|<zagadnienie>|<nazwa>   zadanie zrobione
       l|<zagadnienie>|<adres>   materiał do przeczytania przeczytany

   UKOŃCZENIE (event) — jedno odhaczenie z czasem, liczone na wykresie i mapie aktywności:
     { t, kind, title, url, from, via }
       kind  "zadanie" | "film" | "artykul" | "temat"  (KIND_CAT: seria wykresu, KIND_LABEL: podpis)
       from  tytuł kursu, z którego pochodzi, via: "kurs" | "mini kurs" (zwykły element listy: brak)
   Każde zadanie, film i artykuł w kursie to osobne ukończenie; temat z planera dochodzi jeszcze
   jako „temat”, gdy odhaczone są wszystkie jego materiały (tak jak zwykły temat z listy).
   ═══════════════════════════════════════════════════════════════════════════ */

export const KOMP_VIDEO_HOSTS = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/i;

/** Czas odhaczenia (ms) albo null — dawne true, puste i błędne wartości nie mają czasu. */
export const markTime = v => (typeof v === "number" && isFinite(v) && v > 0) ? v : null;
const kpOf = item => (item && item.kp && typeof item.kp === "object") ? item.kp : {};

/** rodzaj ukończenia → seria na wykresie (zadania / materiały / tematy) */
export const KIND_CAT = { zadanie: "zadanie", film: "material", artykul: "material", temat: "temat" };
/** rodzaj ukończenia → podpis na znaczniku */
export const KIND_LABEL = { zadanie: "zadanie", film: "film", artykul: "artykuł", temat: "temat" };

/* ═══ KURS Z PLANERA ═══ */
export const pkKey = {
  task: s => "z|" + s.id,
  topic: s => "t|" + s.id,           // temat bez materiałów odhacza się w całości
  mat: (s, k) => "m|" + s.id + "|" + k
};
export const pkSteps = item => (item && item.plan && Array.isArray(item.plan.steps)) ? item.plan.steps : [];
const stepMats = s => Array.isArray(s.materials) ? s.materials : [];

export function pkStepDone(s, kp){
  if(s.type === "zadanie") return !!kp[pkKey.task(s)];
  const mats = stepMats(s);
  return mats.length ? mats.every((m, k) => kp[pkKey.mat(s, k)]) : !!kp[pkKey.topic(s)];
}
/** kiedy krok został ukończony (najpóźniejsze odhaczenie w kroku) albo null */
export function pkStepTime(s, kp){
  if(!pkStepDone(s, kp)) return null;
  const mats = stepMats(s);
  const keys = s.type === "zadanie" ? [pkKey.task(s)] : mats.length ? mats.map((m, k) => pkKey.mat(s, k)) : [pkKey.topic(s)];
  return markTime(Math.max(...keys.map(k => markTime(kp[k]) || 0)));
}
/** Liczniki kursu. Jednostki (u…) = wszystko, co da się odhaczyć: zadania, filmy, artykuły
 *  i tematy bez materiałów — po nich idzie pasek postępu, więc rusza się przy każdym odhaczeniu. */
export function pkStats(steps, kp){
  const st = { sDone: 0, sAll: steps.length, zDone: 0, zAll: 0, tDone: 0, tAll: 0,
               fDone: 0, fAll: 0, aDone: 0, aAll: 0, mDone: 0, mAll: 0, uDone: 0, uAll: 0, next: -1 };
  steps.forEach((s, i) => {
    const done = pkStepDone(s, kp);
    if(done) st.sDone++; else if(st.next < 0) st.next = i;
    if(s.type === "zadanie"){ st.zAll++; if(done){ st.zDone++; st.uDone++; } st.uAll++; return; }
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

/* ═══ UKOŃCZENIA ═══ */
/** Ukończenia jednego elementu listy (patrz komentarz na górze). komp: dane kompendium albo null. */
export function itemEvents(item, komp){
  const out = [];
  if(!item || typeof item !== "object") return out;
  const kp = kpOf(item);
  if(item.type === "kurs"){
    const from = item.title || "Kurs", via = "kurs";
    for(const s of pkSteps(item)){
      const title = s.title || "(bez nazwy)", url = s.url || "";
      if(s.type === "zadanie"){
        const t = markTime(kp[pkKey.task(s)]);
        if(t) out.push({ t, kind: "zadanie", title, url, from, via });
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
      const t = pkStepTime(s, kp);       // cały temat przerobiony — jak odhaczony temat z listy
      if(t) out.push({ t, kind: "temat", title, url, from, via });
    }
    return out;                          // sam kurs (done) się nie liczy — liczą się jego kroki
  }
  const doneAt = markTime(item.doneAt);
  if(item.done && doneAt){
    out.push({ t: doneAt, kind: item.type === "zadanie" ? "zadanie" : "temat", title: item.title || "(bez nazwy)", url: item.url || "" });
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
export function completionEvents(items, komp){
  const out = [];
  for(const item of items || []) for(const e of itemEvents(item, komp)) out.push(e);
  return out;
}

/* ═══ POSTĘP KURSU ═══
   → null (to nie kurs / kompendium jeszcze się wczytuje / temat nie ma czego odhaczać) albo
     { id, via, title, done, all, pct, z, f, a, steps, next, last, complete }
       done/all  jednostki (zadania + filmy + artykuły [+ tematy bez materiałów])
       z, f, a   [zrobione, wszystkie] zadania, filmy, artykuły / materiały do przeczytania
       steps     [ukończone, wszystkie] kroki kursu z planera (mini kurs: null)
       next      następny krok (kurs) albo zagadnienie (mini kurs) do zrobienia, "" gdy brak
       last      czas ostatniego odhaczenia w kursie (0 = nic) */
export function courseProgress(item, komp){
  if(!item || typeof item !== "object") return null;
  const kp = kpOf(item);
  const last = Math.max(0, ...Object.values(kp).map(v => markTime(v) || 0));
  const pct = (d, a) => a ? Math.round(d / a * 100) : 0;
  if(item.type === "kurs"){
    const steps = pkSteps(item), st = pkStats(steps, kp);
    return {
      id: item.id, via: "kurs", title: item.title || "Kurs",
      done: st.uDone, all: st.uAll, pct: pct(st.uDone, st.uAll),
      z: [st.zDone, st.zAll], f: [st.fDone, st.fAll], a: [st.aDone, st.aAll], steps: [st.sDone, st.sAll],
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
    z: [st.tDone, st.tAll], f: [st.vDone, st.vAll], a: [st.lDone, st.lAll], steps: null,
    next, last, complete: !!item.done || st.done === st.all
  };
}
