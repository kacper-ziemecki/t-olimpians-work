// Pomocniki do zadań z lekcji Stos.
//
// Wzorcówki JS robią to samo, co uczeń pisze w C++ (stos to zwykła tablica JS z push/pop).
// Tu są: nawiasy (sprawdzanie, losowe poprawne i prawie poprawne ciągi), najbliższy większy/mniejszy element
// (stos monotoniczny), wyrażenia (ONP i zwykły zapis — liczone na BigInt dokładnie jak long long w C++:
// dzielenie z obcięciem do zera, reszta ze znakiem dzielnej) oraz losowe wyrażenia z kontrolą zakresu.
// Re-eksportuje pomocniki lekcji Kolejka (plansze, labirynty, grafy, imiona, generator ciągu z lekcji o złożoności).

const P = require('./kolejka-pomoc');

const KOLORY = ['bialy', 'zielony', 'niebieski', 'czerwony', 'zolty', 'szary', 'czarny', 'rozowy', 'fioletowy', 'pomaranczowy', 'brazowy', 'zloty'];

// ------------------------------------------------------------------ nawiasy
const OTW = '([{', ZAM = ')]}';
const paraDo = (c) => OTW[ZAM.indexOf(c)];
const czyOtw = (c) => OTW.includes(c);
const czyZam = (c) => ZAM.includes(c);

// Czy ciąg (z dowolnymi innymi znakami, które się pomija) ma poprawnie sparowane nawiasy?
function czyPoprawne(s) {
    const st = [];
    for (const c of s) {
        if (czyOtw(c)) st.push(c);
        else if (czyZam(c)) { if (!st.length || st[st.length - 1] !== paraDo(c)) return false; st.pop(); }
    }
    return st.length === 0;
}

// Losowy poprawny ciąg n par nawiasów z podanych rodzajów (np. '()' albo '()[]{}').
// gleboko = szansa na otwarcie zamiast zamknięcia (im większa, tym głębsze zagnieżdżenia).
function losPoprawne(r, n, rodzaje = '()', gleboko = 0.5) {
    const typy = [];
    for (let i = 0; i < rodzaje.length; i += 2) typy.push(rodzaje.slice(i, i + 2));
    const st = [];
    let out = '', otwarte = 0;
    while (out.length < 2 * n) {
        const mozeOtw = otwarte < n, mozeZam = st.length > 0;
        if (mozeOtw && (!mozeZam || r() < gleboko)) { const t = r.pick(typy); st.push(t[1]); out += t[0]; otwarte++; }
        else out += st.pop();
    }
    return out;
}

// Psuje ciąg: zamienia, usuwa albo dokleja jeden znak nawiasu (wynik może przypadkiem dalej być poprawny).
function popsuj(r, s, rodzaje = '()') {
    const zn = rodzaje.split('');
    const i = r.int(0, Math.max(0, s.length - 1));
    const co = r.int(0, 3);
    if (co === 0 && s.length) return s.slice(0, i) + r.pick(zn) + s.slice(i + 1);
    if (co === 1 && s.length > 1) return s.slice(0, i) + s.slice(i + 1);
    if (co === 2) return s.slice(0, i) + r.pick(zn) + s.slice(i);
    const j = r.int(0, Math.max(0, s.length - 1));
    const a = s.split('');
    [a[i], a[j]] = [a[j], a[i]];
    return a.join('');
}

// Losowy ciąg nawiasów długości n (bez gwarancji poprawności).
const losNawiasy = (r, n, rodzaje = '()') => Array.from({ length: n }, () => r.pick(rodzaje.split(''))).join('');

// ------------------------------------------------------------------ stos monotoniczny
// Dla każdego i: indeks najbliższego j w kierunku kier (+1 = w prawo, -1 = w lewo), dla którego warunek(a[j], a[i]) jest prawdą; -1, gdy nie ma.
// Np. następny większy: najblizszy(a, +1, (x, y) => x > y). Liczone stosem w O(n).
function najblizszy(a, kier, warunek) {
    const n = a.length, w = new Int32Array(n).fill(-1), st = [];
    const start = kier > 0 ? n - 1 : 0, koniec = kier > 0 ? -1 : n, krok = kier > 0 ? -1 : 1;
    for (let i = start; i !== koniec; i += krok) {
        while (st.length && !warunek(a[st[st.length - 1]], a[i])) st.pop();
        w[i] = st.length ? st[st.length - 1] : -1;
        st.push(i);
    }
    return w;
}

// ------------------------------------------------------------------ wyrażenia (BigInt = long long)
const LIMIT = 10n ** 18n;
const OPS = ['+', '-', '*', '/'];
const czyOp = (t) => t === '+' || t === '-' || t === '*' || t === '/';
const prio = (op) => (op === '*' || op === '/' ? 2 : op === '^' ? 3 : 1);

function dzialanie(a, b, op) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') { if (b === 0n) throw new Error('dzielenie przez zero'); return a / b; }
    if (op === '%') { if (b === 0n) throw new Error('dzielenie przez zero'); return a % b; }
    if (op === '^') {
        if (b < 0n) throw new Error('ujemny wykładnik');
        if (a === 0n || a === 1n) return b === 0n ? 1n : a;
        if (a === -1n) return b % 2n ? -1n : 1n;
        if (b > 70n) return 10n ** 40n; // i tak za duże — zostanie odrzucone przez kontrolę zakresu
        return a ** b;
    }
    throw new Error('nieznane działanie ' + op);
}

// ONP: tablica tokenów → { ok: true, v } albo { ok: false, blad }. maks = najwyższa dopuszczalna |wartość| po drodze.
function liczOnp(tokeny, maks = LIMIT) {
    const st = [];
    let maxAbs = 0n;
    for (const t of tokeny) {
        if (czyOp(t) || t === '^') {
            if (st.length < 2) return { ok: false, blad: 'za malo liczb' };
            const b = st.pop(), a = st.pop();
            if (t === '/' && b === 0n) return { ok: false, blad: 'dzielenie przez zero' };
            if (t === '^' && b < 0n) return { ok: false, blad: 'ujemny wykladnik' };
            const v = dzialanie(a, b, t);
            const av = v < 0n ? -v : v;
            if (av > maxAbs) maxAbs = av;
            if (av > maks) return { ok: false, blad: 'za duzo', zaDuzo: true };
            st.push(v);
        } else st.push(BigInt(t));
    }
    if (st.length !== 1) return { ok: false, blad: st.length ? 'za duzo liczb' : 'pusto' };
    return { ok: true, v: st[0], maxAbs };
}

// Drzewo wyrażenia: liść { v: '12' } albo { op, l, p }.
// Losowe drzewo z k działaniami; liczby z [lo, hi]; ops = dozwolone działania.
function losDrzewo(r, k, lo, hi, ops = OPS) {
    if (k === 0) return { v: String(r.int(lo, hi)) };
    const kl = r.int(0, k - 1);
    return { op: r.pick(ops), l: losDrzewo(r, kl, lo, hi, ops), p: losDrzewo(r, k - 1 - kl, lo, hi, ops) };
}
const drzewoOnp = (d) => (d.op ? [...drzewoOnp(d.l), ...drzewoOnp(d.p), d.op] : [d.v]);
const drzewoPrefiks = (d) => (d.op ? [d.op, ...drzewoPrefiks(d.l), ...drzewoPrefiks(d.p)] : [d.v]);
// Zapis zwykły z najmniejszą liczbą nawiasów (działania lewostronnie łączne).
function drzewoInfix(d) {
    if (!d.op) return d.v;
    const pr = prio(d.op);
    let l = drzewoInfix(d.l), p = drzewoInfix(d.p);
    if (d.l.op && prio(d.l.op) < pr) l = '(' + l + ')';
    if (d.p.op && (prio(d.p.op) < pr || (prio(d.p.op) === pr && (d.op === '-' || d.op === '/' || d.p.op === '-' || d.p.op === '/' || d.op !== d.p.op)))) p = '(' + p + ')';
    return l + d.op + p;
}
// Wartość drzewa (BigInt) albo null, gdy dzielenie przez zero lub |wartość| > maks po drodze.
function drzewoWartosc(d, maks = LIMIT) {
    if (!d.op) return BigInt(d.v);
    const a = drzewoWartosc(d.l, maks); if (a === null) return null;
    const b = drzewoWartosc(d.p, maks); if (b === null) return null;
    if ((d.op === '/') && b === 0n) return null;
    const v = dzialanie(a, b, d.op);
    if ((v < 0n ? -v : v) > maks) return null;
    return v;
}
// Losowe drzewo, które da się policzyć bez dzielenia przez zero i bez przekroczenia maks: budowane od liści,
// a gdy wylosowane działanie psuje wynik, wybiera inne z ops (w ostateczności + albo -, które nie wyjdą poza maks).
function dobreDrzewo(r, k, lo, hi, ops = OPS, maks = LIMIT) {
    const proba = (l, p, o) => {
        if (o === '/' && p.w === 0n) return null;
        if (o === '^' && (p.w < 0n || p.w > 62n)) return null;
        const v = dzialanie(l.w, p.w, o);
        return (v < 0n ? -v : v) > maks ? null : v;
    };
    function bud(k2) {
        if (k2 === 0) { const v = r.int(lo, hi); return { v: String(v), w: BigInt(v) }; }
        const kl = r.int(0, k2 - 1);
        const l = bud(kl), p = bud(k2 - 1 - kl);
        let op = r.pick(ops), w = proba(l, p, op);
        if (w === null) for (const o of r.shuffle(ops)) { w = proba(l, p, o); if (w !== null) { op = o; break; } }
        if (w === null) { op = (l.w >= 0n) === (p.w >= 0n) ? '-' : '+'; w = dzialanie(l.w, p.w, op); }
        return { op, l, p, w };
    }
    return bud(k);
}

// Zwykły zapis (bez spacji) → tokeny: liczby, działania i nawiasy.
function tokenyInfix(s) {
    const out = [];
    for (let i = 0; i < s.length;) {
        const c = s[i];
        if (c >= '0' && c <= '9') { let j = i; while (j < s.length && s[j] >= '0' && s[j] <= '9') j++; out.push(s.slice(i, j)); i = j; }
        else if (/[a-z]/.test(c)) { let j = i; while (j < s.length && /[a-z]/.test(s[j])) j++; out.push(s.slice(i, j)); i = j; }
        else if (c === ' ') i++;
        else { out.push(c); i++; }
    }
    return out;
}
// Algorytm stacji rozrządowej: zwykły zapis → ONP (działania lewostronnie łączne, ^ prawostronnie).
// naOnpTok dostaje gotowe tokeny (liczby mogą być już BigIntami, np. wartościami zmiennych).
const naOnp = (s) => naOnpTok(tokenyInfix(s));
function naOnpTok(tokeny) {
    const out = [], st = [];
    for (const t of tokeny) {
        if (t === '(') st.push(t);
        else if (t === ')') {
            while (st.length && st[st.length - 1] !== '(') out.push(st.pop());
            if (!st.length) throw new Error('naOnp: zamykający nawias bez pary');
            st.pop();
        }
        else if (czyOp(t) || t === '^') {
            while (st.length && st[st.length - 1] !== '(' && (prio(st[st.length - 1]) > prio(t) || (prio(st[st.length - 1]) === prio(t) && t !== '^'))) out.push(st.pop());
            st.push(t);
        } else out.push(t);
    }
    while (st.length) out.push(st.pop());
    return out;
}

// Losowe drzewo (ojciec każdego wierzchołka 2..n ma mniejszy numer — albo dowolny po przenumerowaniu).
// glebokie = szansa, że ojcem jest poprzedni wierzchołek (tworzy długie ścieżki).
function losDrzewoOjcow(r, n, glebokie = 0.3, przenumeruj = true) {
    const ojc = new Array(n + 1).fill(0);
    for (let v = 2; v <= n; v++) ojc[v] = r() < glebokie ? v - 1 : r.int(1, v - 1);
    if (!przenumeruj) return ojc;
    const perm = [0, 1, ...r.shuffle(Array.from({ length: n - 1 }, (_, i) => i + 2))]; // korzeń zostaje 1
    const nowy = new Array(n + 1).fill(0);
    for (let v = 2; v <= n; v++) nowy[perm[v]] = perm[ojc[v]];
    return nowy;
}

module.exports = {
    ...P, KOLORY, OTW, ZAM, paraDo, czyOtw, czyZam, czyPoprawne, losPoprawne, popsuj, losNawiasy, najblizszy,
    LIMIT, OPS, czyOp, prio, dzialanie, liczOnp, losDrzewo, drzewoOnp, drzewoPrefiks, drzewoInfix, drzewoWartosc, dobreDrzewo,
    tokenyInfix, naOnp, naOnpTok, losDrzewoOjcow,
};
