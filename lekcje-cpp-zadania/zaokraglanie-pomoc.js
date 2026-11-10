// Pomocniki do zadań lekcji Zaokrąglanie (zaokraglanie-*.js).
//
// Oczekiwane wyniki liczymy DOKŁADNIE: liczby z wejścia traktujemy jak dokładne ułamki dziesiętne
// i zamieniamy na całkowitą liczbę „jednostek” (setnych, tysięcznych…) w BigInt. Funkcje c… udają
// za to obliczenia C++ na double (JavaScript liczy na tych samych liczbach double co C++), żeby
// generator testów mógł odrzucić dane, na których rozsądne rozwiązanie z double dałoby inny wynik
// niż matematycznie poprawny — tam, gdzie zadanie nie jest właśnie o tej pułapce.

const B = BigInt;

// "−12.345" → liczba jednostek 10^-d (BigInt). Rzuca, gdy cyfr po kropce jest więcej niż d.
function jedn(s, d) {
    const m = String(s).trim().match(/^(-?)(\d+)(?:\.(\d+))?$/);
    if (!m) throw new Error(`zła liczba: ${s}`);
    const fr = m[3] || '';
    if (fr.length > d) throw new Error(`${s}: więcej niż ${d} cyfr po kropce`);
    const v = B(m[2] + fr.padEnd(d, '0'));
    return m[1] ? -v : v;
}

// k jednostek 10^-d → napis bez zbędnych zer na końcu ("2.7", "-0.05", "5").
function napis(k, d) {
    k = B(k);
    const neg = k < 0n;
    let s = (neg ? -k : k).toString().padStart(d + 1, '0');
    if (d) s = s.slice(0, s.length - d) + '.' + s.slice(s.length - d);
    if (d) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return (neg && s !== '0' ? '-' : '') + s;
}

// k jednostek 10^-d → napis z dokładnie d cyframi po kropce (jak fixed << setprecision(d)).
function stale(k, d) {
    k = B(k);
    const neg = k < 0n;
    let s = (neg ? -k : k).toString().padStart(d + 1, '0');
    if (d) s = s.slice(0, s.length - d) + '.' + s.slice(s.length - d);
    return (neg ? '-' : '') + s;
}

// Dzielenie z zaokrągleniem na BigInt (b > 0).
const fdiv = (a, b) => { a = B(a); b = B(b); let q = a / b; if (a % b < 0n) q -= 1n; return q; };   // w dół
const cdiv = (a, b) => -fdiv(-B(a), b);                                                              // w górę
const rdivUp = (a, b) => fdiv(2n * B(a) + B(b), 2n * B(b));                                          // najbliższa, połówki w górę
const rdivAway = (a, b) => (B(a) >= 0n ? rdivUp(a, b) : -rdivUp(-B(a), b));                          // najbliższa, jak round
const tdiv = (a, b) => B(a) / B(b);                                                                  // ucina (jak / w C++)

// Pierwiastek całkowity i sześcienny dla BigInt.
function isqrt(n) {
    n = B(n);
    if (n < 0n) throw new Error('isqrt z liczby ujemnej');
    let k = B(Math.floor(Math.sqrt(Number(n))));
    while (k * k > n) k--;
    while ((k + 1n) * (k + 1n) <= n) k++;
    return k;
}
function icbrt(n) {
    n = B(n);
    let k = B(Math.floor(Math.cbrt(Number(n))));
    while (k > 0n && k * k * k > n) k--;
    while ((k + 1n) ** 3n <= n) k++;
    return k;
}

// round z C++ dla double (połówki dalej od zera; x - floor(x) jest dokładne).
function cround(x) {
    if (x < 0) return -cround(-x);
    const f = Math.floor(x);
    return x - f >= 0.5 ? f + 1 : f;
}
const ctrunc = (x) => (x < 0 ? Math.ceil(x) : Math.floor(x));

// Dokładna wartość liczby double: { m, k } takie, że x = m / 2^k (m BigInt ze znakiem, k ≥ 0).
function dokladnie(x) {
    const dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, x);
    const hi = dv.getUint32(0), lo = dv.getUint32(4);
    const znak = hi >>> 31, wyk = (hi >>> 20) & 2047;
    let m = (B(hi & 0xfffff) << 32n) | B(lo);
    let e;
    if (wyk === 0) e = -1074; else { m |= 1n << 52n; e = wyk - 1075; }
    if (znak) m = -m;
    if (e >= 0) return { m: m << B(e), k: 0, ujemne: !!znak };
    return { m, k: -e, ujemne: !!znak };
}

// printf("%.*f", d, x) z glibc: zaokrągla DOKŁADNĄ wartość double, a idealne połówki do cyfry parzystej.
function cfixed(x, d) {
    if (!Number.isFinite(x)) throw new Error(`cfixed: ${x}`);
    const { m, k, ujemne } = dokladnie(x);
    const am = m < 0n ? -m : m;
    const licz = am * 10n ** B(d), mian = 1n << B(k);
    let q = licz / mian;
    const r2 = 2n * (licz % mian);
    if (r2 > mian || (r2 === mian && q % 2n === 1n)) q++;
    let s = q.toString().padStart(d + 1, '0');
    if (d) s = s.slice(0, s.length - d) + '.' + s.slice(s.length - d);
    return (ujemne ? '-' : '') + s;
}

// Losowy ułamek dziesiętny: liczba całkowita jednostek z [lo, hi] i napis z d cyframi po kropce.
// Część liczb wychodzi z mniejszą liczbą cyfr (np. "2.5" zamiast "2.50"), część — pełna („2.50”), jak w prawdziwych danych.
function losowa(r, lo, hi, d) {
    const k = r.big(lo, hi);
    const s = r() < 0.5 ? napis(k, d) : stale(k, d);
    return { k, s };
}

module.exports = { jedn, napis, stale, fdiv, cdiv, rdivUp, rdivAway, tdiv, isqrt, icbrt, cround, ctrunc, cfixed, losowa };
