// Pomocniki do zadań z lekcji Kopiec.
//
// Wzorcówki JS robią to samo, co uczeń pisze w C++. PQ działa jak priority_queue: konstruktor dostaje funkcję
// mniejszy(a, b) (jak operator< albo komparator w C++), a top() oddaje element NAJWIĘKSZY według niej.
// Uwaga: w C++ kolejność elementów RÓWNYCH według komparatora jest nieokreślona — testy nigdy nie mogą od niej zależeć
// (w treściach zawsze rozstrzygamy remisy do końca, a pary porównujemy w całości).
// Do tego kopiec z podręcznika (tablica od 1, przesiewanie w górę i w dół — część 3 lekcji), grafy z wagami,
// Dijkstra (odległości, liczba najkrótszych dróg z limitem) i plansze z kosztami.
// Re-eksportuje pomocniki lekcji Stos (a przez nie: Kolejka, Struct, Funkcje, imiona, słowa, generator ciągu).

const P = require('./stos-pomoc');

const mniej = (a, b) => a < b;
const wiecej = (a, b) => a > b; // jak greater<int>: na wierzchu najmniejszy
// Porównanie par / krotek jak w C++ (najpierw pierwsze pole, przy remisie następne).
function mniejKrotka(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) return true;
        if (a[i] > b[i]) return false;
    }
    return false;
}
const wiecejKrotka = (a, b) => mniejKrotka(b, a);

class PQ {
    constructor(mniejszy = mniej, it) { this.h = []; this.m = mniejszy; if (it) for (const x of it) this.push(x); }
    get size() { return this.h.length; }
    empty() { return this.h.length === 0; }
    top() { if (!this.h.length) throw new Error('top() z pustego kopca'); return this.h[0]; }
    push(x) {
        const h = this.h, m = this.m;
        h.push(x);
        let i = h.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (!m(h[p], h[i])) break;
            [h[p], h[i]] = [h[i], h[p]];
            i = p;
        }
    }
    pop() {
        const h = this.h, m = this.m;
        if (!h.length) throw new Error('pop() z pustego kopca');
        const top = h[0], last = h.pop();
        if (h.length) {
            h[0] = last;
            let i = 0;
            for (;;) {
                const l = 2 * i + 1, r = l + 1;
                let b = i;
                if (l < h.length && m(h[b], h[l])) b = l;
                if (r < h.length && m(h[b], h[r])) b = r;
                if (b === i) break;
                [h[i], h[b]] = [h[b], h[i]];
                i = b;
            }
        }
        return top;
    }
    // zawartość od najważniejszego (kopia, kopiec się nie zmienia)
    posortowane() { return this.h.slice().sort((a, b) => (this.m(a, b) ? 1 : this.m(b, a) ? -1 : 0)); }
}

// ------------------------------------------------------------------ kopiec z podręcznika (część 3)
// t[1..n] — kopiec maksimum, t[0] nieużywane. Rodzic i/2, dzieci 2i i 2i + 1.
// W górę: dopóki rodzic jest MNIEJSZY, zamień. W dół: wybierz większe dziecko (przy remisie lewe, 2i),
// zamień, jeśli jest WIĘKSZE od elementu. Funkcje zwracają liczbę zamian.
function wGore(t, i) {
    let z = 0;
    while (i > 1 && t[i >> 1] < t[i]) { [t[i >> 1], t[i]] = [t[i], t[i >> 1]]; i >>= 1; z++; }
    return z;
}
function wDol(t, i, n = t.length - 1) {
    let z = 0;
    while (2 * i <= n) {
        let c = 2 * i;
        if (c + 1 <= n && t[c + 1] > t[c]) c++;
        if (t[c] > t[i]) { [t[c], t[i]] = [t[i], t[c]]; i = c; z++; } else break;
    }
    return z;
}
function tPush(t, x) { t.push(x); return wGore(t, t.length - 1); }
function tPop(t) {
    const n = t.length - 1;
    if (n < 1) throw new Error('tPop z pustego kopca');
    const top = t[1];
    t[1] = t[n];
    t.pop();
    const z = t.length > 1 ? wDol(t, 1) : 0;
    return { top, z };
}
function czyKopiec(t) { for (let i = 2; i < t.length; i++) if (t[i >> 1] < t[i]) return i; return 0; }
// wysokość (liczba poziomów) drzewa z n elementami
function poziomy(n) { let p = 0; while (n > 0) { p++; n = Math.floor(n / 2); } return p; }

// ------------------------------------------------------------------ grafy z wagami
// Losowy graf nieskierowany (albo skierowany) bez pętli i bez powtórzonych krawędzi; spojny = najpierw losowe drzewo.
function losGrafW(r, n, m, wmin, wmax, { spojny = false, skierowany = false } = {}) {
    const kraw = [], jest = new Set();
    const klucz = (a, b) => (skierowany || a < b ? a * 1000003 + b : b * 1000003 + a);
    const dodaj = (a, b) => {
        if (a === b || jest.has(klucz(a, b))) return false;
        jest.add(klucz(a, b));
        kraw.push([a, b, r.int(wmin, wmax)]);
        return true;
    };
    if (spojny) {
        const perm = r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
        for (let i = 1; i < n; i++) {
            const a = perm[r.int(0, i - 1)], b = perm[i];
            if (skierowany && r() < 0.5) dodaj(b, a); else dodaj(a, b);
        }
    }
    const maks = skierowany ? n * (n - 1) : (n * (n - 1)) / 2;
    if (m > maks) throw new Error(`losGrafW: za dużo krawędzi (${m} > ${maks})`);
    let proby = 0;
    while (kraw.length < m) {
        dodaj(r.int(1, n), r.int(1, n));
        if (++proby > m * 100 + 10000) throw new Error('losGrafW: nie udało się wylosować krawędzi');
    }
    return r.shuffle(kraw);
}
// listy sąsiadów: g[v] = [[u, w], …] w kolejności krawędzi z wejścia
function listyW(n, kraw, skierowany = false) {
    const g = Array.from({ length: n + 1 }, () => []);
    for (const [a, b, w] of kraw) { g[a].push([b, w]); if (!skierowany) g[b].push([a, w]); }
    return g;
}
const grafWTxt = (n, kraw, reszta = '') => `${n} ${kraw.length}` + (kraw.length ? '\n' + kraw.map((e) => e.join(' ')).join('\n') : '') + (reszta ? '\n' + reszta : '');

// Dijkstra z wielu startów. Zwraca dist (Infinity = nieosiągalny), poprzednika (najmniejszy numer przy remisie odległości
// NIE jest gwarantowany — do odtwarzania trasy wybieraj testy z jedną najkrótszą drogą) i liczbę najkrótszych dróg ucinaną do limit.
function dijkstra(g, starty, limit = 2) {
    const n = g.length - 1;
    const dist = new Array(n + 1).fill(Infinity), ile = new Array(n + 1).fill(0), prev = new Array(n + 1).fill(0);
    const pq = new PQ(wiecejKrotka);
    for (const s of starty) { dist[s] = 0; ile[s] = 1; pq.push([0, s]); }
    while (pq.size) {
        const [d, v] = pq.pop();
        if (d > dist[v]) continue;
        for (const [u, w] of g[v]) {
            const nd = d + w;
            if (nd < dist[u]) { dist[u] = nd; ile[u] = ile[v]; prev[u] = v; pq.push([nd, u]); }
            else if (nd === dist[u]) ile[u] = Math.min(limit, ile[u] + ile[v]);
        }
    }
    return { dist, ile, prev };
}
function trasa(prev, s, t) {
    const p = [t];
    while (p[p.length - 1] !== s) p.push(prev[p[p.length - 1]]);
    return p.reverse();
}

// Plansza liczb (koszty pól) jako tablica wierszy.
function losKoszty(r, h, w, lo, hi) { return Array.from({ length: h }, () => Array.from({ length: w }, () => r.int(lo, hi))); }
const kosztyTxt = (k) => `${k.length} ${k[0].length}\n` + k.map((w) => w.join(' ')).join('\n');

module.exports = {
    ...P, mniej, wiecej, mniejKrotka, wiecejKrotka, PQ, wGore, wDol, tPush, tPop, czyKopiec, poziomy,
    losGrafW, listyW, grafWTxt, dijkstra, trasa, losKoszty, kosztyTxt,
};
