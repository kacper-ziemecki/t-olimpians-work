// Pomocniki do zadań lekcji Silnia (silnia-*.js).
//
// Oczekiwane wyniki liczymy DOKŁADNIE na BigInt (silnie, iloczyny, dwumiany, wykładniki Legendre'a).
// Tam, gdzie zadanie każe użyć log10 (liczba cyfr i pierwsze cyfry wielkiej silni), wynik bierzemy
// z dokładnej sumy logarytmów (sumowanie Kahana), a generator testów odrzuca n, dla których
// log10(n!) leży bliżej niż MARGINES od granicy — tam zwykła suma na double (tak, jak liczy ją uczeń)
// mogłaby dać inny wynik.

const B = BigInt;

// F[i] = i! (BigInt), dopisywane w miarę potrzeby.
const F = [1n];
function fact(n) {
    n = Number(n);
    if (n < 0) throw new Error('silnia liczby ujemnej');
    if (n > 20000) return iloczyn(1, n);
    while (F.length <= n) F.push(F[F.length - 1] * B(F.length));
    return F[n];
}

// a · (a + 1) · … · b na BigInt (drzewo mnożeń — szybko także dla dużych zakresów); pusty iloczyn = 1.
function iloczyn(a, b) {
    a = Number(a); b = Number(b);
    if (a > b) return 1n;
    if (b - a < 24) { let r = 1n; for (let i = a; i <= b; i++) r *= B(i); return r; }
    const m = Math.floor((a + b) / 2);
    return iloczyn(a, m) * iloczyn(m + 1, b);
}

// Symbol Newtona C(n, k) na BigInt (0, gdy k < 0 albo k > n).
function C(n, k) {
    n = B(n); k = B(k);
    if (k < 0n || k > n) return 0n;
    if (k > n - k) k = n - k;
    let c = 1n;
    for (let i = 1n; i <= k; i++) c = (c * (n - k + i)) / i;
    return c;
}

// Wykładnik liczby pierwszej p w rozkładzie n! (wzór Legendre'a): n/p + n/p² + …
function leg(n, p) {
    n = B(n); p = B(p);
    let s = 0n;
    while (n > 0n) { n /= p; s += n; }
    return s;
}

// Ile razy p dzieli x (x > 0).
function krotnosc(x, p) {
    x = B(x); p = B(p);
    let s = 0n;
    while (x % p === 0n) { x /= p; s++; }
    return s;
}

// Rozkład na czynniki pierwsze (dzielenie próbne) — [[p, e], …] rosnąco, p i e jako BigInt.
function rozklad(x) {
    x = B(x);
    const out = [];
    for (let p = 2n; p * p <= x; p++) {
        if (x % p) continue;
        let e = 0n;
        while (x % p === 0n) { x /= p; e++; }
        out.push([p, e]);
    }
    if (x > 1n) out.push([x, 1n]);
    return out;
}

// Liczby pierwsze ≤ n (sito).
function pierwsze(n) {
    const s = new Uint8Array(n + 1);
    const out = [];
    for (let i = 2; i <= n; i++) {
        if (s[i]) continue;
        out.push(i);
        for (let j = i * i; j <= n; j += i) s[j] = 1;
    }
    return out;
}

// ------------------------------------------------------------------ logarytmy
// LA[n] — dokładne log10(n!) (Kahan), LN[n] — suma „jak uczeń”: s += log10(i) na double.
let LA = null, LN = null;
function logi(N) {
    if (LA && LA.length > N) return;
    const M = Math.max(N, 1000000);
    LA = new Float64Array(M + 1);
    LN = new Float64Array(M + 1);
    let s = 0, c = 0, nv = 0;
    for (let i = 1; i <= M; i++) {
        const v = Math.log10(i);
        const y = v - c;
        const t = s + y;
        c = (t - s) - y;
        s = t;
        nv += v;
        LA[i] = s;
        LN[i] = nv;
    }
}
const MARGINES = 1e-5;
const frac = (x) => x - Math.floor(x);

// Liczba cyfr n! — z logarytmu, z kontrolą, że do granicy daleko (n = 0 i 1 to dokładnie 0).
function cyfry(n) {
    n = Number(n);
    if (n <= 1) return 1;
    logi(n);
    const f = frac(LA[n]);
    if (f < 1e-7 || f > 1 - 1e-7) throw new Error(`cyfry(${n}): log10 za blisko liczby całkowitej`);
    return Math.floor(LA[n]) + 1;
}
// Czy test z liczbą cyfr n! jest bezpieczny dla rozwiązań na double?
function cyfryBezpieczne(n) {
    n = Number(n);
    if (n <= 1) return true;
    logi(n);
    const f = frac(LA[n]);
    return f > MARGINES && f < 1 - MARGINES && Math.floor(LN[n]) === Math.floor(LA[n]);
}

// Pierwsze k cyfr n! (n! musi mieć co najmniej k cyfr) — z części ułamkowej log10.
function pierwszeCyfry(n, k) {
    n = Number(n);
    if (!pierwszeBezpieczne(n, k)) throw new Error(`pierwszeCyfry(${n}, ${k}): za blisko granicy — zmień test`);
    const v = Math.floor(Math.pow(10, frac(LA[n]) + k - 1));
    if (String(v).length !== k) throw new Error(`pierwszeCyfry(${n}, ${k}): ${v}`);
    return v;
}
function pierwszeBezpieczne(n, k) {
    n = Number(n);
    logi(n);
    const f = frac(LA[n]);
    const g = f + k - 1;
    const v = Math.floor(Math.pow(10, g));
    const d1 = g - Math.log10(v), d2 = Math.log10(v + 1) - g;
    const fn = frac(LN[n]);
    const vn = Math.floor(Math.pow(10, fn + k - 1));
    return d1 > MARGINES && d2 > MARGINES && vn === v && f > MARGINES && f < 1 - MARGINES;
}

module.exports = { fact, iloczyn, C, leg, krotnosc, rozklad, pierwsze, logi, cyfry, cyfryBezpieczne, pierwszeCyfry, pierwszeBezpieczne, MARGINES, LA: () => LA, LN: () => LN };
