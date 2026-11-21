// Pomocniki do zadań z lekcji Rekurencja.
//
// Wzorcówki w JS piszemy BEZ głębokiej rekurencji (Node ma mały stos) — pętlami albo z własnym stosem.
// Liczby do 10¹⁸ liczymy na BigInt. Plansze to tablice napisów ('#', '.', …), pola numerujemy od 0.
// Re-eksportuje listy imion i słów, nwd i czyPierwsza z pomocników lekcji Funkcje.

const P = require('./funkcje-pomoc');

const B = (x) => BigInt(x);
const absB = (x) => (x < 0n ? -x : x);
const nwdB = (a, b) => { a = absB(a); b = absB(b); while (b) [a, b] = [b, a % b]; return a; };
const nwwB = (a, b) => (a === 0n || b === 0n ? 0n : a / nwdB(a, b) * b);
function powmodB(a, n, m) {
    a %= m;
    let w = 1n % m;
    while (n > 0n) {
        if (n & 1n) w = w * a % m;
        a = a * a % m;
        n >>= 1n;
    }
    return w;
}
// Pierwiastek całkowity: największe x, że x² ≤ n (n: BigInt ≥ 0).
function isqrtB(n) {
    if (n < 2n) return n;
    let x = B(Math.floor(Math.sqrt(Number(n))));
    while (x * x > n) x--;
    while ((x + 1n) * (x + 1n) <= n) x++;
    return x;
}
const cyfryB = (x) => String(x).split('').map(Number);

// Napis BigInt w systemie o podstawie p (2–16), cyfry 0–9A–F.
const ZNAKI = '0123456789ABCDEF';
function naSystem(x, p) {
    x = B(x);
    if (x === 0n) return '0';
    let s = '';
    const pb = B(p);
    while (x > 0n) { s = ZNAKI[Number(x % pb)] + s; x /= pb; }
    return s;
}
function zSystemu(s, p) {
    let v = 0n;
    for (const c of s) v = v * B(p) + B(ZNAKI.indexOf(c));
    return v;
}

// Losowy BigInt z [lo, hi] o „ładnym” rozkładzie długości (dużo małych i dużo dużych liczb).
function losDlugi(r, lo, hi) {
    lo = B(lo); hi = B(hi);
    const cyf = String(hi).length;
    for (;;) {
        const k = r.int(1, cyf);
        const x = r.big(10n ** B(k - 1) - (k === 1 ? 1n : 0n), 10n ** B(k) - 1n);
        if (x >= lo && x <= hi) return x;
    }
}

// Plansza n × m: pole z prawdopodobieństwem p ma znak a, inaczej b.
function plansza(r, n, m, p, a = '#', b = '.') {
    return Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < p ? a : b)).join(''));
}
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
// Zalewanie bez rekurencji: zaznacza w tablicy odw pola osiągalne z (x, y) po polach, dla których ok(x, y) jest prawdą.
// Zwraca liczbę nowo zaznaczonych pól.
function zalej(n, m, x, y, ok, odw, dirs = D4) {
    if (x < 0 || y < 0 || x >= n || y >= m || odw[x][y] || !ok(x, y)) return 0;
    const st = [[x, y]];
    odw[x][y] = true;
    let ile = 0;
    while (st.length) {
        const [a, b] = st.pop();
        ile++;
        for (const [dx, dy] of dirs) {
            const c = a + dx, d = b + dy;
            if (c < 0 || d < 0 || c >= n || d >= m || odw[c][d] || !ok(c, d)) continue;
            odw[c][d] = true;
            st.push([c, d]);
        }
    }
    return ile;
}
const pusta = (n, m) => Array.from({ length: n }, () => new Array(m).fill(false));

// Plansza „wężowa” — jedna długa ścieżka '#' przez całą planszę (głęboka rekurencja w zalewaniu).
function waz(n, m, a = '#', b = '.') {
    const g = Array.from({ length: n }, () => new Array(m).fill(b));
    for (let i = 0; i < n; i += 2) {
        for (let j = 0; j < m; j++) g[i][j] = a;
        if (i + 1 < n) g[i + 1][(i / 2) % 2 === 0 ? m - 1 : 0] = a;
    }
    return g.map((w) => w.join(''));
}

const MOD = 1000000007n;
const MODN = 1000000007;

module.exports = {
    ...P, B, absB, nwdB, nwwB, powmodB, isqrtB, cyfryB, ZNAKI, naSystem, zSystemu, losDlugi,
    plansza, D4, D8, zalej, pusta, waz, MOD, MODN,
};
