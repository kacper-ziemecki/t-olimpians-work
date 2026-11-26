// Pomocniki do zadań z lekcji Bitset.
//
// Wzorcówki w JS trzymają bitsety jako Uint8Array (jeden bajt na bit — w JS to najprostsze i dość szybkie) albo jako BigInt
// (dla liczb do 64 bitów). Sito Eratostenesa liczymy raz i zapamiętujemy największe policzone, bo wiele zadań pyta o liczby
// pierwsze do 10⁶ albo 10⁷. Są też sumy podzbiorów (każdy element najwyżej raz), losowe napisy z zer i jedynek, losowe grafy
// bez powtórzonych krawędzi i losowe zdania do zadań z literami.

const P = require('./liczby-dwojkowe-pomoc');

// ---------------------------------------------------------------- sito
let SITO_N = -1, SITO = null;
// Uint8Array długości ≥ n + 1: 1 = liczba złożona albo 0 / 1, 0 = liczba pierwsza.
function sito(n) {
    if (n <= SITO_N) return SITO;
    const z = new Uint8Array(n + 1);
    z[0] = 1;
    if (n >= 1) z[1] = 1;
    for (let i = 2; i * i <= n; i++) if (!z[i]) for (let j = i * i; j <= n; j += i) z[j] = 1;
    SITO = z; SITO_N = n;
    return z;
}
const czyPierwszaS = (x) => x >= 2 && !sito(x)[x];
// Liczby pierwsze ≤ n (rosnąco).
function pierwszeDo(n) {
    const z = sito(n);
    const w = [];
    for (let i = 2; i <= n; i++) if (!z[i]) w.push(i);
    return w;
}
// Ile liczb pierwszych jest ≤ n.
function ilePierwszych(n) {
    const z = sito(n);
    let c = 0;
    for (let i = 2; i <= n; i++) if (!z[i]) c++;
    return c;
}
// Sprawdzanie dzieleniem — dla pojedynczych dużych liczb (do ~10¹²).
function pierwszaDzielenie(x) {
    if (x < 2) return false;
    if (x % 2 === 0) return x === 2;
    for (let d = 3; d * d <= x; d += 2) if (x % d === 0) return false;
    return true;
}

// ---------------------------------------------------------------- sumy podzbiorów
// d[s] = 1, jeśli sumę s da się ułożyć, biorąc każdy element najwyżej raz (s ≤ max).
function sumy(a, max) {
    const d = new Uint8Array(max + 1);
    d[0] = 1;
    let gora = 0;
    for (const x of a) {
        gora = Math.min(max, gora + x);
        for (let t = gora; t >= x; t--) if (d[t - x]) d[t] = 1;
    }
    return d;
}
const ileJedynek = (d) => { let c = 0; for (let i = 0; i < d.length; i++) c += d[i]; return c; };

// ---------------------------------------------------------------- losowe dane
const los01 = (r, n, p = 0.5) => { let s = ''; for (let i = 0; i < n; i++) s += r() < p ? '1' : '0'; return s; };
// ile różnych liczb z [lo, hi] w losowej kolejności
function rozne(r, ile, lo, hi) {
    if (hi - lo + 1 < ile) throw new Error('rozne: za mało liczb w przedziale');
    if (hi - lo + 1 <= 4 * ile) return r.shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, ile);
    const s = new Set();
    while (s.size < ile) s.add(r.int(lo, hi));
    return r.shuffle([...s]);
}
// Graf nieskierowany bez pętli i powtórzonych krawędzi: tablica par [a, b] z a ≠ b, wierzchołki 1..n.
function losGraf(r, n, m, skierowany = false) {
    const maks = skierowany ? n * (n - 1) : n * (n - 1) / 2;
    if (m > maks) throw new Error('losGraf: za dużo krawędzi');
    const jest = new Set(), e = [];
    while (e.length < m) {
        let a = r.int(1, n), b = r.int(1, n);
        if (a === b) continue;
        if (!skierowany && a > b) [a, b] = [b, a];
        const k = a * (n + 1) + b;
        if (jest.has(k)) continue;
        jest.add(k);
        e.push(r() < 0.5 && !skierowany ? [b, a] : [a, b]);
    }
    return e;
}
// Graf z „gęstymi” grupami (więcej trójkątów i wspólnych sąsiadów niż w zupełnie losowym).
function losGrafGrupy(r, n, m, grupa) {
    const jest = new Set(), e = [];
    let proby = 0;
    while (e.length < m && proby < 50 * m) {
        proby++;
        let a = r.int(1, n), b;
        if (r() < 0.7) { const g = Math.floor((a - 1) / grupa); b = g * grupa + r.int(1, grupa); if (b > n) continue; } else b = r.int(1, n);
        if (a === b) continue;
        if (a > b) [a, b] = [b, a];
        const k = a * (n + 1) + b;
        if (jest.has(k)) continue;
        jest.add(k);
        e.push(r() < 0.5 ? [b, a] : [a, b]);
    }
    if (e.length < m) throw new Error('losGrafGrupy: nie udało się');
    return e;
}
const grafTxt = (n, e) => `${n} ${e.length}\n${e.map(([a, b]) => `${a} ${b}`).join('\n')}`;
// Listy sąsiadów jako tablice Uint8Array (macierz n+1 × n+1) — do wzorcówek w JS.
function macierz(n, e, skierowany = false) {
    const M = Array.from({ length: n + 1 }, () => new Uint8Array(n + 1));
    for (const [a, b] of e) { M[a][b] = 1; if (!skierowany) M[b][a] = 1; }
    return M;
}

// Słowa i zdania z samych liter łacińskich (do zadań z literami).
const SLOWA_ANG = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'pack', 'my', 'box', 'with', 'five', 'dozen', 'liquor', 'jugs',
    'sphinx', 'of', 'black', 'quartz', 'judge', 'vow', 'how', 'vexingly', 'daft', 'zebras', 'jump', 'waltz', 'bad', 'nymph', 'for', 'quick', 'jigs', 'vex',
    'ala', 'ma', 'kota', 'kot', 'pies', 'szkola', 'lekcja', 'zadanie', 'bitset', 'liczba', 'pierwsza', 'sito', 'tablica', 'program', 'wynik', 'dobry', 'zly'];

module.exports = {
    ...P, sito, czyPierwszaS, pierwszeDo, ilePierwszych, pierwszaDzielenie, sumy, ileJedynek, los01, rozne, losGraf, losGrafGrupy, grafTxt, macierz, SLOWA_ANG,
};
