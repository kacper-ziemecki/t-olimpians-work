// Pomocniki do zadań z lekcji Struct.
//
// Formatowanie czasu i dat tak, jak robi to uczeń w C++ (setw(2) i setfill('0')), unikalne imiona i nazwy,
// ułamki na BigInt (żeby nic się nie przepełniło w JS) i sortowanie stabilne z kilkoma kryteriami.
// Re-eksportuje listy imion i słów, daty i nwd z pomocników lekcji Funkcje (a przez nie — z Input i Output (+)).

const P = require('./funkcje-pomoc');

const pad2 = (x) => String(x).padStart(2, '0');
// Minuty od północy → HH:MM; sekundy → HH:MM:SS albo MM:SS.
const hhmm = (min) => `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
const hhmmss = (s) => `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`;
const mmss = (s) => `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
const dataTxt = (d, m, r) => `${pad2(d)}.${pad2(m)}.${r}`;

// Losowa poprawna data z lat [r1, r2].
function losData(r, r1, r2) {
    const rok = r.int(r1, r2), m = r.int(1, 12);
    return [r.int(1, P.dniWMiesiacu(m, rok)), m, rok];
}

// Porównanie napisów jak w C++ (dla ASCII to samo co < w JS).
const cmpS = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const cmpN = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
// Sortowanie stabilne po kolejnych kryteriach: klucze(x) → tablica, kier = tablica +1/−1.
function sortuj(arr, klucze, kier) {
    return arr.slice().sort((a, b) => {
        const ka = klucze(a), kb = klucze(b);
        for (let i = 0; i < ka.length; i++) {
            const c = typeof ka[i] === 'string' ? cmpS(ka[i], kb[i]) : cmpN(ka[i], kb[i]);
            if (c) return c * ((kier && kier[i]) || 1);
        }
        return 0;
    });
}

// n różnych imion (z listy, a gdy zabraknie — z dopisaną cyfrą albo literą).
function unikalneImiona(r, n) {
    const baza = r.shuffle(P.IMIONA);
    const out = [];
    const uzyte = new Set();
    while (out.length < n) {
        let s = baza[out.length % baza.length];
        if (out.length >= baza.length) s = s + String.fromCharCode(65 + r.int(0, 25)) + r.int(0, 9);
        if (uzyte.has(s)) continue;
        uzyte.add(s);
        out.push(s);
    }
    return out;
}
// Losowe „słowo” z sylab (tylko małe litery), długość w sylabach.
const SYL = ['ka', 'to', 'mi', 'la', 're', 'po', 'zu', 'be', 'no', 'si', 'da', 'ku', 'fe', 'go', 'ra', 'wi', 'te', 'mo', 'ny', 'lu'];
const slowo = (r, a, b) => Array.from({ length: r.int(a, b) }, () => r.pick(SYL)).join('');
function unikalneSlowa(r, n, a, b) {
    const s = new Set();
    let proby = 0;
    while (s.size < n) {
        s.add(slowo(r, a, b));
        if (++proby > n * 200) throw new Error('unikalneSlowa: za mało możliwości');
    }
    return r.shuffle([...s]);
}

// Ułamki na BigInt: [l, m] z m > 0 i skrócone.
const B = (x) => BigInt(x);
const absB = (x) => (x < 0n ? -x : x);
const nwdB = (a, b) => { a = absB(a); b = absB(b); while (b) [a, b] = [b, a % b]; return a; };
function skrocB(l, m) {
    l = B(l); m = B(m);
    if (m < 0n) { l = -l; m = -m; }
    const g = nwdB(l, m);
    return g ? [l / g, m / g] : [0n, 1n];
}
const ulTxt = ([l, m]) => `${l}/${m}`;

// Kwadrat odległości i odległość taksówkowa.
const odl2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const manh = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

module.exports = {
    ...P, pad2, hhmm, hhmmss, mmss, dataTxt, losData, cmpS, cmpN, sortuj, unikalneImiona, slowo, unikalneSlowa,
    B, absB, nwdB, skrocB, ulTxt, odl2, manh,
};
