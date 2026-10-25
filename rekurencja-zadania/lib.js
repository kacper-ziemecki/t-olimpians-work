// Wspólne pomocniki dla plików zadań z rekurencji (zadania-krokN.js).
// Każdy plik zadań eksportuje funkcję (h) => [zadania], gdzie h to ten moduł.

// Deterministyczny generator liczb losowych (mulberry32) — testy są zawsze takie same.
function rng(seed) {
    let a = seed >>> 0;
    const r = () => {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    // losowy BigInt z przedziału [lo, hi]
    r.big = (lo, hi) => {
        lo = BigInt(lo); hi = BigInt(hi);
        const span = hi - lo + 1n;
        let x = 0n;
        for (let i = 0; i < 4; i++) x = (x << 30n) | BigInt(Math.floor(r() * 2 ** 30));
        return lo + (x % span);
    };
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.shuffle = (arr) => {
        const a2 = arr.slice();
        for (let i = a2.length - 1; i > 0; i--) {
            const j = Math.floor(r() * (i + 1));
            [a2[i], a2[j]] = [a2[j], a2[i]];
        }
        return a2;
    };
    r.arr = (n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    r.word = (len, alphabet = 'abcdefghijklmnopqrstuvwxyz') =>
        Array.from({ length: len }, () => alphabet[Math.floor(r() * alphabet.length)]).join('');
    return r;
}

const toks = (s) => s.trim().split(/\s+/).filter(Boolean);
const nums = (s) => toks(s).map(Number);
const bigs = (s) => toks(s).map((x) => BigInt(x));
const lines = (s) => s.replace(/\r/g, '').split('\n');

// Czytnik wejścia: kolejne „słowa” jak cin >> x.
function reader(s) {
    const t = toks(s);
    let i = 0;
    return {
        int: () => Number(t[i++]),
        big: () => BigInt(t[i++]),
        str: () => t[i++],
        ints: (n) => Array.from({ length: n }, () => Number(t[i++])),
        bigs: (n) => Array.from({ length: n }, () => BigInt(t[i++])),
        rest: () => t.slice(i),
    };
}

const join = (...ls) => ls.flat().join('\n');
const babs = (x) => (x < 0n ? -x : x);
const bmax = (a, b) => (a > b ? a : b);
const bmin = (a, b) => (a < b ? a : b);

module.exports = { rng, toks, nums, bigs, lines, reader, join, babs, bmax, bmin };
