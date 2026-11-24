// Pomocniki do zadań z lekcji Kolejka.
//
// Kolejka i Deque w JS działają jak queue i deque w C++ (pop z przodu w O(1)), bo wzorcówki JS symulują to samo,
// co uczeń pisze w C++. Do tego plansze (losowe mapy, BFS, liczenie najkrótszych dróg — żeby wybrać testy
// z jedną najkrótszą drogą), grafy (losowe krawędzie, listy sąsiadów, BFS) i maksimum w oknie.
// Re-eksportuje pomocniki lekcji Struct (a przez nie: imiona, słowa, generator ciągu z lekcji o złożoności).

const P = require('./struct-pomoc');

class Kolejka {
    constructor(it) { this.a = []; this.h = 0; if (it) for (const x of it) this.a.push(x); }
    push(x) { this.a.push(x); }
    pop() {
        if (this.h >= this.a.length) throw new Error('pop() z pustej kolejki');
        const x = this.a[this.h++];
        if (this.h > 4096 && this.h * 2 > this.a.length) { this.a = this.a.slice(this.h); this.h = 0; }
        return x;
    }
    front() { if (this.h >= this.a.length) throw new Error('front() z pustej kolejki'); return this.a[this.h]; }
    back() { if (this.h >= this.a.length) throw new Error('back() z pustej kolejki'); return this.a[this.a.length - 1]; }
    get size() { return this.a.length - this.h; }
    empty() { return this.h >= this.a.length; }
    toArray() { return this.a.slice(this.h); }
}

// Deque: bufor cykliczny, który podwaja się, gdy brakuje miejsca.
class Deque {
    constructor(it) { this.cap = 16; this.b = new Array(16); this.h = 0; this.n = 0; if (it) for (const x of it) this.pushBack(x); }
    _rosnij() {
        const nb = new Array(this.cap * 2);
        for (let i = 0; i < this.n; i++) nb[i] = this.b[(this.h + i) % this.cap];
        this.b = nb; this.h = 0; this.cap *= 2;
    }
    pushBack(x) { if (this.n === this.cap) this._rosnij(); this.b[(this.h + this.n) % this.cap] = x; this.n++; }
    pushFront(x) { if (this.n === this.cap) this._rosnij(); this.h = (this.h - 1 + this.cap) % this.cap; this.b[this.h] = x; this.n++; }
    popFront() {
        if (!this.n) throw new Error('pop_front() z pustej deque');
        const x = this.b[this.h]; this.b[this.h] = undefined; this.h = (this.h + 1) % this.cap; this.n--; return x;
    }
    popBack() {
        if (!this.n) throw new Error('pop_back() z pustej deque');
        const i = (this.h + this.n - 1) % this.cap; const x = this.b[i]; this.b[i] = undefined; this.n--; return x;
    }
    front() { if (!this.n) throw new Error('front() z pustej deque'); return this.b[this.h]; }
    back() { if (!this.n) throw new Error('back() z pustej deque'); return this.b[(this.h + this.n - 1) % this.cap]; }
    at(i) { if (i < 0 || i >= this.n) throw new Error('d[' + i + '] poza deque'); return this.b[(this.h + i) % this.cap]; }
    get size() { return this.n; }
    empty() { return this.n === 0; }
    toArray() { const o = []; for (let i = 0; i < this.n; i++) o.push(this.b[(this.h + i) % this.cap]); return o; }
}

// ------------------------------------------------------------------ plansze
const D4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const D8 = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
const SKOCZEK = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

// Losowa plansza n × m: każde pole to '#' z prawdopodobieństwem p, inaczej '.'.
function losPlansza(r, n, m, p) {
    const g = [];
    for (let i = 0; i < n; i++) { let s = ''; for (let j = 0; j < m; j++) s += r() < p ? '#' : '.'; g.push(s); }
    return g;
}
// Wstawia znak ch w losowe wolne pole (zwraca [w, k]); wolne = '.'.
function wstaw(r, g, ch, wolne = '.') {
    const n = g.length, m = g[0].length;
    for (let proba = 0; proba < 100000; proba++) {
        const w = r.int(0, n - 1), k = r.int(0, m - 1);
        if (g[w][k] === wolne) { g[w] = g[w].slice(0, k) + ch + g[w].slice(k + 1); return [w, k]; }
    }
    throw new Error('wstaw: brak wolnego pola');
}
// Pola z danym znakiem.
function znajdz(g, ch) {
    const out = [];
    for (let i = 0; i < g.length; i++) for (let j = 0; j < g[i].length; j++) if (g[i][j] === ch) out.push([i, j]);
    return out;
}
// BFS po planszy: starty = lista [w, k], przejscie(ch) mówi, czy wolno wejść na pole. Zwraca Int32Array odległości (-1 = nie dotarto).
function bfsPlansza(g, starty, przejscie = (ch) => ch !== '#', ruchy = D4) {
    const n = g.length, m = g[0].length;
    const d = new Int32Array(n * m).fill(-1);
    const q = new Int32Array(n * m);
    let h = 0, t = 0;
    for (const [w, k] of starty) if (d[w * m + k] === -1) { d[w * m + k] = 0; q[t++] = w * m + k; }
    while (h < t) {
        const v = q[h++], w = Math.floor(v / m), k = v % m;
        for (const [dw, dk] of ruchy) {
            const nw = w + dw, nk = k + dk;
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            const u = nw * m + nk;
            if (d[u] !== -1 || !przejscie(g[nw][nk])) continue;
            d[u] = d[v] + 1;
            q[t++] = u;
        }
    }
    return d;
}
// Liczba najkrótszych dróg (ucięta do 2) — do wybierania plansz z dokładnie jedną najkrótszą drogą.
function ileNajkrotszych(g, s, cel, przejscie = (ch) => ch !== '#', ruchy = D4) {
    const n = g.length, m = g[0].length;
    const d = bfsPlansza(g, [s], przejscie, ruchy);
    const ile = new Float64Array(n * m);
    const kol = [];
    for (let v = 0; v < n * m; v++) if (d[v] >= 0) kol.push(v);
    kol.sort((a, b) => d[a] - d[b]);
    ile[s[0] * m + s[1]] = 1;
    for (const v of kol) {
        const w = Math.floor(v / m), k = v % m;
        for (const [dw, dk] of ruchy) {
            const nw = w + dw, nk = k + dk;
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            const u = nw * m + nk;
            if (d[u] === d[v] + 1) ile[u] = Math.min(2, ile[u] + ile[v]);
        }
    }
    return { odl: d[cel[0] * m + cel[1]], ile: ile[cel[0] * m + cel[1]] };
}

// Labirynt „doskonały” (2h + 1) × (2w + 1): między dwoma wolnymi polami jest dokładnie jedna droga.
// dziury = ile ścian wybić potem losowo (powstają pętle — wtedy dróg może być więcej).
function losLabirynt(r, h, w, dziury = 0) {
    const n = 2 * h + 1, m = 2 * w + 1;
    const g = Array.from({ length: n }, () => new Array(m).fill('#'));
    const byl = Array.from({ length: h }, () => new Array(w).fill(false));
    const stos = [[r.int(0, h - 1), r.int(0, w - 1)]];
    byl[stos[0][0]][stos[0][1]] = true;
    g[2 * stos[0][0] + 1][2 * stos[0][1] + 1] = '.';
    while (stos.length) {
        const [a, b] = stos[stos.length - 1];
        const sas = D4.map(([da, db]) => [a + da, b + db]).filter(([x, y]) => x >= 0 && x < h && y >= 0 && y < w && !byl[x][y]);
        if (!sas.length) { stos.pop(); continue; }
        const [x, y] = r.pick(sas);
        byl[x][y] = true;
        g[2 * x + 1][2 * y + 1] = '.';
        g[a + x + 1][b + y + 1] = '.';
        stos.push([x, y]);
    }
    for (let k = 0; k < dziury; k++) {
        const x = r.int(1, n - 2), y = r.int(1, m - 2);
        if (g[x][y] === '#' && ((g[x - 1][y] === '.' && g[x + 1][y] === '.') || (g[x][y - 1] === '.' && g[x][y + 1] === '.'))) g[x][y] = '.';
    }
    return g.map((row) => row.join(''));
}

// ------------------------------------------------------------------ grafy
// Losowy graf: n wierzchołków (od 1), m różnych krawędzi bez pętli. spojny = najpierw losowe drzewo.
function losGraf(r, n, m, spojny = false) {
    const kraw = [];
    const byl = new Set();
    const dodaj = (a, b) => {
        if (a === b) return false;
        const k = a < b ? a * 100003 + b : b * 100003 + a;
        if (byl.has(k)) return false;
        byl.add(k); kraw.push([a, b]); return true;
    };
    if (spojny) {
        const p = r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
        for (let i = 1; i < n; i++) dodaj(p[i], p[r.int(0, i - 1)]);
    }
    const maks = (n * (n - 1)) / 2;
    if (m > maks) throw new Error('losGraf: za dużo krawędzi');
    let proby = 0;
    while (kraw.length < m) { dodaj(r.int(1, n), r.int(1, n)); if (++proby > 100 * m + 1000) throw new Error('losGraf: nie da się'); }
    return r.shuffle(kraw).map(([a, b]) => (r() < 0.5 ? [a, b] : [b, a]));
}
// Listy sąsiadów (indeksy od 1) w kolejności krawędzi z wejścia.
function listy(n, kraw) {
    const g = Array.from({ length: n + 1 }, () => []);
    for (const [a, b] of kraw) { g[a].push(b); g[b].push(a); }
    return g;
}
function bfsGraf(g, starty) {
    const n = g.length - 1;
    const d = new Int32Array(n + 1).fill(-1);
    const q = new Kolejka();
    for (const s of starty) if (d[s] === -1) { d[s] = 0; q.push(s); }
    while (!q.empty()) {
        const v = q.pop();
        for (const u of g[v]) if (d[u] === -1) { d[u] = d[v] + 1; q.push(u); }
    }
    return d;
}
// Liczba najkrótszych dróg w grafie (ucięta do 2).
function ileNajkrotszychGraf(g, s, t) {
    const d = bfsGraf(g, [s]);
    const n = g.length - 1;
    const kol = [];
    for (let v = 1; v <= n; v++) if (d[v] >= 0) kol.push(v);
    kol.sort((a, b) => d[a] - d[b]);
    const ile = new Float64Array(n + 1);
    ile[s] = 1;
    for (const v of kol) for (const u of g[v]) if (d[u] === d[v] + 1) ile[u] = Math.min(2, ile[u] + ile[v]);
    return { odl: d[t], ile: ile[t] };
}
const grafTxt = (n, kraw) => `${n} ${kraw.length}` + (kraw.length ? '\n' + kraw.map((e) => e.join(' ')).join('\n') : '');

// ------------------------------------------------------------------ okna
// Maksima (albo minima) wszystkich okien długości k — kolejka monotoniczna na indeksach.
function oknaMax(a, k, min = false) {
    const n = a.length, out = [];
    const d = new Int32Array(n);
    let h = 0, t = 0;
    for (let i = 0; i < n; i++) {
        while (t > h && (min ? a[d[t - 1]] >= a[i] : a[d[t - 1]] <= a[i])) t--;
        d[t++] = i;
        if (d[h] <= i - k) h++;
        if (i >= k - 1) out.push(a[d[h]]);
    }
    return out;
}

module.exports = {
    ...P, Kolejka, Deque, D4, D8, SKOCZEK, losPlansza, losLabirynt, wstaw, znajdz, bfsPlansza, ileNajkrotszych,
    losGraf, listy, bfsGraf, ileNajkrotszychGraf, grafTxt, oknaMax,
};
