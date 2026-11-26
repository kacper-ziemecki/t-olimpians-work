// Pomocniki do zadań z lekcji Liczby dwójkowe.
//
// Wszystkie liczby, które mogą przekroczyć 2⁵³, liczymy na BigInt (zwykły Number w JS gubi wtedy cyfry, a operatory bitowe
// na Number działają tylko na 32 bitach). Zapis w dowolnym systemie, kody U2, „zawijanie” wyniku do k bitów (tak jak robi to
// procesor), liczenie jedynek i losowe napisy z zer i jedynek do testów.

const P = require('./kopiec-pomoc');

const big = (x) => (typeof x === 'bigint' ? x : BigInt(x));
const CYFRY = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// x ≥ 0 zapisane w systemie o podstawie k (2 ≤ k ≤ 36), wielkie litery jako cyfry 10, 11, …
function naSystem(x, k = 2) {
    x = big(x);
    if (x < 0n) throw new Error('naSystem: liczba ujemna');
    return x.toString(k).toUpperCase();
}
const dw = (x) => naSystem(x, 2);
// Napis z cyframi systemu k (wielkie albo małe litery) → BigInt.
function zSystemu(s, k = 2) {
    let w = 0n;
    const K = BigInt(k);
    for (const c of String(s)) {
        const d = CYFRY.indexOf(c.toUpperCase());
        if (d < 0 || d >= k) throw new Error(`zSystemu: zła cyfra ${c} w systemie ${k}`);
        w = w * K + BigInt(d);
    }
    return w;
}
// Czy napis jest poprawnym zapisem w systemie k (same dozwolone cyfry, niepusty)?
const czyWSystemie = (s, k, male = false) => s.length > 0 && [...s].every((c) => {
    const d = CYFRY.indexOf(male ? c.toUpperCase() : c);
    return d >= 0 && d < k;
});
// Zapis na dokładnie k bitach (z zerami z przodu).
const naKBitach = (x, k) => {
    const s = dw(x);
    if (s.length > k) throw new Error(`naKBitach: ${x} nie mieści się na ${k} bitach`);
    return s.padStart(k, '0');
};
// Liczba jedynek w zapisie dwójkowym x ≥ 0.
function jedynki(x) {
    x = big(x);
    let c = 0;
    while (x > 0n) { c += Number(x & 1n); x >>= 1n; }
    return c;
}
// Liczba cyfr zapisu dwójkowego (0 ma jedną cyfrę).
const dlugosc = (x) => dw(x).length;
// Kod U2 liczby x na k bitach (−2^(k−1) ≤ x < 2^(k−1)).
function u2(x, k) {
    x = big(x);
    const m = 1n << BigInt(k);
    if (x < -(m >> 1n) || x >= (m >> 1n)) throw new Error(`u2: ${x} nie mieści się na ${k} bitach ze znakiem`);
    return naKBitach(x < 0n ? x + m : x, k);
}
// Wartość kodu U2 zapisanego napisem (pierwszy bit ma wagę −2^(k−1)).
function zU2(s) {
    const v = zSystemu(s, 2);
    return s[0] === '1' ? v - (1n << BigInt(s.length)) : v;
}
// Zawijanie wyniku do k bitów: bez znaku (0 … 2^k − 1) i ze znakiem (kod U2).
function zawinU(x, k) {
    const m = 1n << BigInt(k);
    return ((big(x) % m) + m) % m;
}
function zawin(x, k) {
    const m = 1n << BigInt(k);
    const r = zawinU(x, k);
    return r >= (m >> 1n) ? r - m : r;
}
const bezZer = (s) => s.replace(/^0+(?=.)/, '');
// Losowy napis dwójkowy długości L; jedynka = pierwsza cyfra (bez zer z przodu), chyba że wiodace = true.
function losBin(r, L, wiodace = false, p1 = 0.5) {
    let s = wiodace ? '' : '1';
    while (s.length < L) s += r() < p1 ? '1' : '0';
    return s;
}
// Losowy BigInt z przedziału [lo, hi] (r.big z lib.js) jako napis.
const losB = (r, lo, hi) => r.big(lo, hi);
// Czy napis to liczba dwójkowa bez zer z przodu (albo „0”)?
const czyDw = (s, max) => /^(0|1[01]*)$/.test(s) && s.length <= max;
// Czy napis to ciąg zer i jedynek (zera z przodu dozwolone)?
const czy01 = (s, max) => /^[01]+$/.test(s) && s.length <= max;
// Liczba całkowita BigInt z napisu z kontrolą zakresu.
const calkB = (t, lo, hi) => /^-?\d+$/.test(t) && BigInt(t) >= BigInt(lo) && BigInt(t) <= BigInt(hi);

// Dodawanie, odejmowanie (a ≥ b) i porównywanie napisów dwójkowych — wzorce do zadań z działaniami pisemnymi.
const dodajDw = (a, b) => dw(zSystemu(a) + zSystemu(b));
const odejmijDw = (a, b) => dw(zSystemu(a) - zSystemu(b));
const porownajDw = (a, b) => { const x = zSystemu(a), y = zSystemu(b); return x < y ? '<' : x > y ? '>' : '='; };

module.exports = {
    ...P, CYFRY, big, naSystem, dw, zSystemu, czyWSystemie, naKBitach, jedynki, dlugosc, u2, zU2, zawin, zawinU, bezZer,
    losBin, losB, czyDw, czy01, calkB, dodajDw, odejmijDw, porownajDw,
};
