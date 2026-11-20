// Pomocniki do zadań z lekcji Funkcje.
//
// Te same „cegiełki”, które uczeń pisze w C++ jako funkcje: liczby pierwsze, cyfry, liczby rzymskie, daty, NWD.
// Re-eksportuje też listy imion i słów oraz generator ciągu z lekcji o złożoności (przez input-output-plus-pomoc).

const P = require('./input-output-plus-pomoc');

function czyPierwsza(n) {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
    return true;
}

// Cyfry liczby (Number albo BigInt albo napis z cyfr) — od najstarszej.
const cyfry = (x) => String(x).replace('-', '').split('').map(Number);
const sumaCyfr = (x) => cyfry(x).reduce((a, b) => a + b, 0);
const odwroc = (x) => Number(String(x).split('').reverse().join(''));
const odwrocBig = (x) => BigInt(String(x).split('').reverse().join(''));

const RZ = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
function naRzymskie(x) {
    let s = '';
    for (const [w, z] of RZ) while (x >= w) { s += z; x -= w; }
    return s;
}
function zRzymskich(s) {
    const W = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let w = 0;
    for (let i = 0; i < s.length; i++) {
        const a = W[s[i]], b = i + 1 < s.length ? W[s[i + 1]] : 0;
        w += a < b ? -a : a;
    }
    return w;
}

const czyPrzestepny = (r) => (r % 4 === 0 && r % 100 !== 0) || r % 400 === 0;
const DNI = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dniWMiesiacu = (m, r) => (m === 2 && czyPrzestepny(r) ? 29 : DNI[m - 1]);
const czyPoprawnaData = (d, m, r) => r >= 1 && m >= 1 && m <= 12 && d >= 1 && d <= dniWMiesiacu(m, r);
// Numer dnia: 1.01.0001 → 1 (kalendarz gregoriański „wstecz”).
function numerDnia(d, m, r) {
    const y = r - 1;
    let n = y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
    for (let k = 1; k < m; k++) n += dniWMiesiacu(k, r);
    return n + d;
}
// Dzień tygodnia: 0 = poniedziałek, …, 6 = niedziela (1.01.0001 był poniedziałkiem).
const dzienTygodnia = (d, m, r) => (numerDnia(d, m, r) - 1) % 7;
function zNumeru(n) {
    let r = Math.floor(n / 365.2425) + 1;
    while (numerDnia(1, 1, r) > n) r--;
    while (numerDnia(1, 1, r + 1) <= n) r++;
    let m = 1;
    while (m < 12 && numerDnia(1, m + 1, r) <= n) m++;
    return [n - numerDnia(1, m, r) + 1, m, r];
}

const nwd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const nwdBig = (a, b) => { if (a < 0n) a = -a; if (b < 0n) b = -b; while (b) [a, b] = [b, a % b]; return a; };

// Liczba z dokładnie 2 cyframi po kropce (cout << fixed << setprecision(2)) z wartości w setnych.
const grosze = (g) => P.zlote(g, '.');

module.exports = {
    ...P, czyPierwsza, cyfry, sumaCyfr, odwroc, odwrocBig, naRzymskie, zRzymskich,
    czyPrzestepny, dniWMiesiacu, czyPoprawnaData, numerDnia, dzienTygodnia, zNumeru, nwd, nwdBig, grosze,
};
