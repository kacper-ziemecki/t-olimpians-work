// Pomocniki dla plików zadań lekcji C++ (typy-zmiennych-*.js).
// To samo co rekurencja-zadania/lib.js (rng, reader, …) plus wypisywanie liczb double
// dokładnie tak, jak robi to C++: cout << fixed << setprecision(d) << x.

const base = require('../rekurencja-zadania/lib');

// Czy x z d cyframi po kropce wypada (prawie) dokładnie w połowie między dwoma wynikami?
// Takich testów unikamy: printf w MinGW na Windowsie potrafi zaokrąglić połówkę inaczej niż
// sprawdzarka (glibc), a dwa równoważne wzory (np. PI * r * r i r * r * PI) mogą wtedy
// dać różne wyniki w ostatniej cyfrze.
function nearTie(x, d) {
    const y = Math.abs(x) * 10 ** d;
    const fr = y - Math.floor(y);
    return Math.abs(fr - 0.5) < 1e-7 + y * 1e-12;
}

const negZero = (s) => /^-0(\.0+)?$/.test(s);

// Odpowiednik cout << fixed << setprecision(d) << x. toFixed i glibc zaokrąglają dokładną
// wartość double tak samo — różnią się tylko przy idealnej połówce, którą tu odrzucamy.
function fx(x, d) {
    if (!Number.isFinite(x)) throw new Error(`fx: ${x}`);
    if (nearTie(x, d)) throw new Error(`fx: ${x} wypada w połowie przy ${d} miejscach po kropce — zmień test`);
    const s = x.toFixed(d);
    if (negZero(s)) throw new Error(`fx: wynik ${s} (ujemne zero) — zmień test`);
    return s;
}

// Czy wynik nadaje się do testu (patrz fx)?
const safe = (x, d) => Number.isFinite(x) && !nearTie(x, d) && !negZero(x.toFixed(d));

// Liczba z dokładnie d cyframi po kropce, zapisana z k całkowitych setnych/tysięcznych (bez błędów double).
function dec(k, d) {
    const neg = k < 0;
    const s = String(Math.abs(k)).padStart(d + 1, '0');
    return (neg ? '-' : '') + (d ? s.slice(0, s.length - d) + '.' + s.slice(s.length - d) : s);
}

// Pierwsza litera wielka, reszta małe.
const capital = (w) => w[0].toUpperCase() + w.slice(1);

module.exports = { ...base, fx, safe, dec, capital };
