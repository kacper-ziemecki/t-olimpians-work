// Pomocniki do zadań z lekcji Złożoność czasowa.
//
// Generator danych z lekcji: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m, gdzie 0 ≤ s, a, b < m ≤ 10⁹.
// W C++ uczeń liczy to w long long (iloczyn < 10¹⁸). W JS iloczyn nie mieści się dokładnie w double,
// więc mnożymy „na raty”: a = ah · 2¹⁵ + al, każdy kawałek iloczynu ma mniej niż 2⁴⁶ — liczby dokładne.

function mulmod(x, a, m) {
    const ah = Math.floor(a / 32768), al = a % 32768;
    return (((x * ah) % m) * 32768 + x * al) % m;
}

// Zwraca Float64Array z n wyrazami ciągu (liczby całkowite, dokładne).
function generuj(n, s, a, b, m) {
    const x = new Float64Array(n);
    let v = s;
    x[0] = v;
    for (let i = 1; i < n; i++) {
        v = (mulmod(v, a, m) + b) % m;
        x[i] = v;
    }
    return x;
}

// Parametry generatora jako napis „n s a b m” (losowe s, a, b < m).
function losGen(r, n, m) {
    return `${n} ${r.int(0, m - 1)} ${r.int(1, Math.max(1, m - 1))} ${r.int(0, m - 1)} ${m}`;
}

// Odczyt parametrów generatora z początku wejścia (zwraca też resztę tokenów).
function czytajGen(t, od = 0) {
    const [n, s, a, b, m] = t.slice(od, od + 5).map(Number);
    return { n, s, a, b, m, x: generuj(n, s, a, b, m), reszta: t.slice(od + 5) };
}

// Sprawdzenie parametrów generatora: 1 ≤ n ≤ maxN, 1 ≤ m ≤ maxM, 0 ≤ s, a, b < m.
function dobryGen(t, od, maxN, maxM) {
    const v = t.slice(od, od + 5).map(Number);
    if (v.length < 5 || v.some((x) => !Number.isInteger(x))) return false;
    const [n, s, a, b, m] = v;
    return n >= 1 && n <= maxN && m >= 1 && m <= maxM && s >= 0 && s < m && a >= 0 && a < m && b >= 0 && b < m;
}

// Kod generatora do wskazówek (uczeń może go skopiować).
const KOD_GEN = 'vector<long long> x(n); x[0] = s; for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;';

module.exports = { mulmod, generuj, losGen, czytajGen, dobryGen, KOD_GEN };
