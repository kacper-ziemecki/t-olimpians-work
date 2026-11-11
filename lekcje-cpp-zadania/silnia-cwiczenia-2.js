// Silnia — ćwiczenia w trakcie lekcji, części 4–6: tablica silni (f[i] = f[i - 1] * i, wiele pytań,
// dzielenie silni, silnie cyfr, łańcuchy i system silniowy), silnia modulo (ostatnia cyfra, w = w * i % m,
// n! mod m = 0 dla n ≥ m, sumy i iloczyny modulo, test Wilsona) oraz zera na końcu i czynniki silni
// (piątki, n/5 + n/25 + …, dwójki, wzór Legendre'a, zera iloczynu).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const { fact, leg, krotnosc } = require('./silnia-pomoc');
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const MOD = 1000000007n;
    const zakresy = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i));
    const lista = (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])); };
    const zgodnaLista = (inp, ok) => { const t = toks(inp); const v = lista(inp); return v.length === Number(t[0]) && t.length === v.length + 1 && v.length >= 1 && v.every(ok); };
    const FC = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
    const sumaSilniCyfr = (x) => String(x).split('').reduce((a, d) => a + FC[Number(d)], 0);
    const zera = (n) => leg(n, 5);
    // n! mod m dla małego n (Number) i m (BigInt)
    const silniaMod = (n, m) => { let w = 1n % m; for (let i = 2; i <= n; i++) w = (w * B(i)) % m; return w; };
    const czyPierwsza = (p) => { if (p < 2) return false; for (let d = 2; d * d <= p; d++) if (p % d === 0) return false; return true; };
    const losowaPierwsza = (r, lo, hi) => { for (;;) { const p = r.int(lo, hi); if (czyPierwsza(p)) return p; } };

    // kolejne cyfry systemu silniowego: x = c_K · K! + … + c_1 · 1!
    const silniowy = (x) => {
        x = B(x);
        if (x === 0n) return '0';
        let K = 1;
        while (fact(K + 1) <= x) K++;
        const out = [];
        for (let k = K; k >= 1; k--) { out.push(String(x / fact(k))); x %= fact(k); }
        return out.join(' ');
    };
    const lancuch = (x) => {
        const seen = [];
        while (!seen.includes(x)) { seen.push(x); x = sumaSilniCyfr(x); }
        return [...seen, x].join(' ');
    };

    return [
        // ================================================================ KROK 4 · tablica silni
        {
            id: 'sil-tablica', krok: 4, level: 'latwe',
            title: 'Tablica silni',
            short: 'Wypełnij tablicę f[0..20] raz, a potem odpowiadaj na pytania od ręki.',
            tags: ['long long f[21]', 'f[i] = f[i - 1] * i', 'wiele pytań'],
            statement: ['Wczytaj q liczb. Dla każdej liczby n wypisz w osobnym wierszu n!.', 'Najpierw wypełnij tablicę wszystkich silni od 0! do 20!, a potem dla każdego pytania po prostu odczytaj gotowy wynik.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb całkowitych.'],
            output_format: ['q wierszy — w każdym silnia odpowiedniej liczby.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ każda liczba ≤ 20'],
            examples: [{ input: '5\n3 20 0 3 10' }],
            hint: R`long long f[21]; f[0] = 1; for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i; — każda silnia powstaje z poprzedniej jednym mnożeniem. Potem w pętli po pytaniach wypisuj f[n]. Tablicę wypełniasz raz, na samym początku, a nie przy każdym pytaniu.`,
            tests: (r) => ['1\n0', '1\n20', `21\n${zakresy(0, 20).join(' ')}`, `21\n${zakresy(0, 20).reverse().join(' ')}`, `1000\n${r.arr(1000, 0, 20).join(' ')}`, `100\n${r.arr(100, 15, 20).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => Number(x) >= 0 && Number(x) <= 20) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => String(fact(Number(x)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n;
        cin >> n;
        cout << f[n] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-iloraz-silni', krok: 4, level: 'latwe',
            title: 'Silnia przez silnię',
            short: 'n! / k! z tablicy — dzielenie zawsze wychodzi bez reszty.',
            tags: ['f[n] / f[k]', 'tablica silni', 'k ≤ n'],
            statement: ['Wczytaj q par liczb n i k (k ≤ n). Dla każdej pary wypisz w osobnym wierszu wartość n! / k!.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W kolejnych q wierszach po dwie liczby: n i k.'],
            output_format: ['q wierszy — w każdym wartość n! / k!.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ k ≤ n ≤ 20'],
            examples: [{ input: '3\n5 3\n20 18\n7 7', note: '5! / 3! = 120 / 6 = 20, czyli 4 · 5. 20! / 18! = 19 · 20 = 380.' }],
            hint: R`Wypełnij tablicę f[0..20] i wypisuj f[n] / f[k]. Dzielenie zawsze wychodzi bez reszty, bo n! = k! · (k + 1) · … · n. Zauważ, że wynik to iloczyn liczb od k + 1 do n — to przydaje się, gdy n jest za duże na tablicę.`,
            tests: (r) => ['1\n0 0', '1\n20 0', '1\n20 20', `21\n${zakresy(0, 20).map((n) => `20 ${n}`).join('\n')}`,
                `1000\n${Array.from({ length: 1000 }, () => { const n = r.int(0, 20); return `${n} ${r.int(0, n)}`; }).join('\n')}`],
            check: (inp) => { const t = toks(inp).map(Number); const q = t[0]; if (t.length !== 1 + 2 * q || q > 1000) return 'liczba'; for (let i = 0; i < q; i++) { const n = t[1 + 2 * i], k = t[2 + 2 * i]; if (!(k >= 0 && k <= n && n <= 20)) return 'zakres'; } return null; },
            solve: (inp) => { const t = toks(inp).map(Number); const out = []; for (let i = 0; i < t[0]; i++) out.push(String(fact(t[1 + 2 * i]) / fact(t[2 + 2 * i]))); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int n, k;
        cin >> n >> k;
        cout << f[n] / f[k] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-silnie-cyfr', krok: 4, level: 'latwe',
            title: 'Suma silni cyfr',
            short: 'Dla 145 to 1! + 4! + 5!. Tablica silni cyfr od 0! do 9! i pętla po cyfrach.',
            tags: ['tablica 0!..9!', 'cyfry liczby', '0! = 1'],
            statement: ['Wczytaj q liczb. Dla każdej liczby wypisz w osobnym wierszu sumę silni jej cyfr. Na przykład dla 145 to 1! + 4! + 5! = 1 + 24 + 120 = 145, a dla 2022 — 2! + 0! + 2! + 2! = 7.', 'Uwaga: liczba 0 ma jedną cyfrę 0, a 0! = 1.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb całkowitych nieujemnych.'],
            output_format: ['q wierszy — w każdym suma silni cyfr odpowiedniej liczby.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '4\n145 2022 9 0' }],
            hint: R`Silnie cyfr policz raz do tablicy: f[0] = 1, f[i] = f[i - 1] * i dla i od 1 do 9. Potem cyfry liczby wyciągaj jak w lekcji o modulo: x % 10 to ostatnia cyfra, x /= 10 ją usuwa. Pułapka: pętla while (x > 0) dla x = 0 nie wykona się ani razu, a 0 ma jedną cyfrę — wtedy wynik to 0! = 1. Najprościej wczytać liczbę jako string i przejść po znakach (cyfra = c - '0').`,
            tests: (r) => ['1\n0', '1\n1000000000000000000', '1\n999999999999999999', '3\n145 40585 1', '10\n0 1 2 3 4 5 6 7 8 9',
                `1000\n${Array.from({ length: 1000 }, () => String(r.pick([r.int(0, 100), r.int(0, 1000000), r.big(0, E18)]))).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => /^\d+$/.test(x) && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => String(sumaSilniCyfr(B(x)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int f[10];
    f[0] = 1;
    for (int i = 1; i <= 9; i++) f[i] = f[i - 1] * i;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string s;
        cin >> s;
        long long suma = 0;
        for (char c : s) suma += f[c - '0'];
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-najblizsza', krok: 4, level: 'srednie',
            title: 'Najbliższa silnia',
            short: 'Która silnia leży najbliżej x? Tablica silni i odległość max − min.',
            tags: ['tablica silni', 'max(a, b) - min(a, b)', 'remis'],
            statement: ['Wczytaj q liczb. Dla każdej liczby x wypisz tę silnię, która jest najbliżej x (czyli różni się od x najmniej). Jeśli dwie silnie są równie blisko, wypisz mniejszą.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb całkowitych.'],
            output_format: ['q wierszy — w każdym silnia najbliższa odpowiedniej liczbie.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '4\n100 4 30 5000', note: '4 leży dokładnie w połowie między 2! = 2 i 3! = 6 — wypisujemy mniejszą.' }],
            hint: R`Wypełnij tablicę f[0..20] (20! jest już większe od 10¹⁸, więc dalej szukać nie trzeba). Dla każdego x przejdź po tablicy i licz odległość max(x, f[i]) - min(x, f[i]) — bez ujemnych liczb. Zapamiętuj najlepszą; nowa silnia wygrywa tylko przy odległości ostro mniejszej, więc przy remisie zostanie wcześniejsza, czyli mniejsza.`,
            tests: (r) => {
                const remis = () => { const k = r.int(2, 18); return String((fact(k) + fact(k + 1)) / 2n); };
                const blisko = () => String(fact(r.int(1, 19)) + B(r.int(-50, 50)));
                const jedna = () => r.pick([remis, blisko, () => String(r.big(1, E18)), () => String(r.int(1, 1000))])();
                return ['1\n1', '1\n2', '1\n4', '1\n1000000000000000000', '1\n121645100408832000', '6\n3 4 5 15 16 72',
                    `1000\n${Array.from({ length: 1000 }, jedna).map((x) => (B(x) < 1n ? '1' : x)).join(' ')}`];
            },
            check: (inp) => (zgodnaLista(inp, (x) => B(x) >= 1n && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((s) => {
                const x = B(s);
                let best = null, bd = null;
                for (let i = 0; i <= 20; i++) { const f = fact(i); const d = f > x ? f - x : x - f; if (bd === null || d < bd) { bd = d; best = f; } }
                return String(best);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        long long x;
        cin >> x;
        long long best = f[0], bd = max(x, f[0]) - min(x, f[0]);
        for (int i = 1; i <= 20; i++) {
            long long d = max(x, f[i]) - min(x, f[i]);
            if (d < bd) {
                bd = d;
                best = f[i];
            }
        }
        cout << best << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-iloczyn-silni', krok: 4, level: 'srednie',
            title: 'Iloczyn silni',
            short: 'Pomnóż silnie podanych liczb — a gdy iloczyn przekroczy 10¹⁸, wypisz ZA DUZO.',
            tags: ['tablica silni', 'LIMIT / f[a]', 'ZA DUZO'],
            statement: ['Wczytaj n liczb a₁, a₂, …, aₙ i policz iloczyn ich silni: a₁! · a₂! · … · aₙ!. Jeśli iloczyn jest większy od 10¹⁸, wypisz ZA DUZO, a w przeciwnym razie wypisz iloczyn.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: iloczyn silni albo ZA DUZO.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 20'],
            examples: [{ input: '3\n3 4 5', note: '6 · 24 · 120 = 17 280.' }, { input: '2\n20 2' }],
            hint: R`Silnie weź z tablicy f[0..20]. Mnóż jak w zadaniu „Bezpieczny iloczyn”: przed każdym mnożeniem sprawdź, czy w > LIMIT / f[a] — jeśli tak, iloczyn przekroczy 10¹⁸ i możesz od razu wypisać ZA DUZO. Silnie są dodatnie (nawet 0! = 1), więc dzielenie przez f[a] jest bezpieczne.`,
            tests: (r) => {
                const out = ['1\n0', '1\n20', '2\n19 2', '2\n19 3', '3\n10 10 2', '1000\n' + Array(1000).fill(1).join(' '), '5\n0 1 0 1 0'];
                for (let k = 0; k < 6; k++) {
                    const v = []; let p = 1n;
                    const limit = r() < 0.5 ? E18 : E18 * 50n;
                    while (v.length < 1000) { const a = r.pick([0, 1, 2, 3, r.int(0, 8), r.int(0, 20)]); if (p * fact(a) > limit) break; p *= fact(a); v.push(a); }
                    out.push(`${v.length}\n${r.shuffle(v).join(' ')}`);
                }
                return out;
            },
            check: (inp) => (zgodnaLista(inp, (x) => Number(x) >= 0 && Number(x) <= 20) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => { let p = 1n; for (const a of lista(inp)) p *= fact(Number(a)); return p > E18 ? 'ZA DUZO' : String(p); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long LIMIT = 1000000000000000000LL;
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int n;
    cin >> n;
    long long w = 1;
    bool zaDuzo = false;
    for (int i = 0; i < n; i++) {
        int a;
        cin >> a;
        if (zaDuzo) continue;
        if (w > LIMIT / f[a]) zaDuzo = true;
        else w *= f[a];
    }
    if (zaDuzo) cout << "ZA DUZO\n";
    else cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-liczby-silniowe', krok: 4, level: 'srednie',
            title: 'Liczby silniowe',
            short: 'Znajdź liczby równe sumie silni swoich cyfr — jak 145 = 1! + 4! + 5!.',
            tags: ['tablica 0!..9!', 'pętla po przedziale', 'BRAK'],
            statement: ['Liczba jest silniowa, jeśli jest równa sumie silni swoich cyfr. Na przykład 145 jest silniowa, bo 1! + 4! + 5! = 1 + 24 + 120 = 145.', 'Wczytaj a i b i wypisz w jednym wierszu wszystkie liczby silniowe z przedziału [a, b] w kolejności rosnącej. Jeśli w przedziale nie ma żadnej, wypisz BRAK.'],
            input_format: ['Dwie liczby całkowite a i b.'],
            output_format: ['Jeden wiersz: liczby silniowe oddzielone spacjami albo słowo BRAK.'],
            constraints: ['1 ≤ a ≤ b ≤ 2 000 000'],
            examples: [{ input: '1 200' }, { input: '3 144' }],
            hint: R`Tablica f[0..9] z silniami cyfr, a potem pętla po wszystkich x od a do b: policz sumę silni cyfr (kopia x, % 10 i / 10) i porównaj z x. Dwa miliony liczb po najwyżej 7 cyfr to kilkanaście milionów operacji — szybko. Zapamiętaj w zmiennej bool, czy coś znalazłeś, żeby na końcu wiedzieć, czy wypisać BRAK.`,
            tests: (r) => ['1 2000000', '1 1', '2 2', '3 144', '145 145', '146 40584', '40585 2000000', '40586 2000000', '100 1000', '1000000 2000000', `${r.int(1, 50000)} ${r.int(50000, 2000000)}`],
            check: (inp) => { const [a, b] = toks(inp).map(Number); return a >= 1 && a <= b && b <= 2000000 ? null : 'zakres'; },
            solve: (inp) => { const [a, b] = toks(inp).map(Number); const v = [1, 2, 145, 40585].filter((x) => x >= a && x <= b); return v.length ? v.join(' ') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int f[10];
    f[0] = 1;
    for (int i = 1; i <= 9; i++) f[i] = f[i - 1] * i;
    int a, b;
    cin >> a >> b;
    bool jest = false;
    for (int x = a; x <= b; x++) {
        int y = x, suma = 0;
        while (y > 0) {
            suma += f[y % 10];
            y /= 10;
        }
        if (suma == x) {
            if (jest) cout << " ";
            cout << x;
            jest = true;
        }
    }
    if (!jest) cout << "BRAK";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-lancuch', krok: 4, level: 'srednie',
            title: 'Łańcuch silni cyfr',
            short: 'Zamieniaj liczbę na sumę silni jej cyfr, aż liczba się powtórzy. Wypisz cały łańcuch.',
            tags: ['tablica 0!..9!', 'vector odwiedzonych', 'find'],
            statement: ['Zaczynamy od liczby x i w każdym kroku zamieniamy liczbę na sumę silni jej cyfr. Na przykład 69 → 6! + 9! = 363600 → 1454 → 169 → 363601 → 1454 → … Prędzej czy później jakaś liczba się powtórzy.', 'Wypisz w jednym wierszu kolejne liczby łańcucha, zaczynając od x i kończąc na pierwszej liczbie, która pojawia się po raz drugi (ją też wypisz).'],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Jeden wiersz: liczby łańcucha oddzielone spacjami.'],
            constraints: ['1 ≤ x ≤ 1 000 000'],
            examples: [{ input: '69' }, { input: '145', note: '145 zamienia się w samą siebie — powtarza się od razu.' }, { input: '540' }],
            hint: R`Trzymaj vector<long long> odwiedzonych liczb. W pętli: jeśli bieżąca liczba jest już w vectorze (find z lekcji o vectorze albo zwykła pętla), wypisz ją i zakończ; w przeciwnym razie dopisz ją (push_back), wypisz i policz następną: sumę silni cyfr z tablicy f[0..9]. Łańcuchy są krótkie — najwyżej kilkadziesiąt liczb.`,
            tests: (r) => ['1', '2', '145', '169', '871', '872', '40585', '1000000', '69', '78', '540', '999999', ...Array.from({ length: 6 }, () => String(r.int(1, 1000000)))],
            check: (inp) => { const x = Number(inp); return x >= 1 && x <= 1000000 ? null : 'x'; },
            solve: (inp) => lancuch(Number(inp)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long f[10];
    f[0] = 1;
    for (int i = 1; i <= 9; i++) f[i] = f[i - 1] * i;
    long long x;
    cin >> x;
    vector<long long> byly;
    while (find(byly.begin(), byly.end(), x) == byly.end()) {
        byly.push_back(x);
        cout << x << " ";
        long long y = x, suma = 0;
        while (y > 0) {
            suma += f[y % 10];
            y /= 10;
        }
        x = suma;
    }
    cout << x << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-system-silniowy', krok: 4, level: 'srednie',
            title: 'System silniowy',
            short: 'Zapisz x jako sumę c · k! z cyframi c ≤ k: 463 to 3 4 1 0 1.',
            tags: ['tablica silni', 'x / f[k] i x % f[k]', 'od największej'],
            statement: ['Każdą liczbę naturalną x da się zapisać jednoznacznie jako sumę x = c_K · K! + … + c₂ · 2! + c₁ · 1!, w której każda „cyfra” c_k spełnia 0 ≤ c_k ≤ k, a pierwsza cyfra c_K jest dodatnia. Na przykład 463 = 3 · 5! + 4 · 4! + 1 · 3! + 0 · 2! + 1 · 1!.', 'Wczytaj x i wypisz jego cyfry w tym systemie, od c_K do c₁, oddzielone spacjami. Dla x = 0 wypisz 0.'],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Jeden wiersz: cyfry c_K, …, c₁ oddzielone spacjami (albo 0 dla x = 0).'],
            constraints: ['0 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '463' }, { input: '5', note: '5 = 2 · 2! + 1 · 1!.' }, { input: '0' }],
            hint: R`To jak zamiana na inny system liczbowy, tylko „wagami” są silnie zamiast potęg. Wypełnij tablicę f[0..20] i znajdź największe K, dla którego f[K] ≤ x. Potem dla k od K w dół do 1: cyfra to x / f[k], a resztę zostaw w x (x %= f[k]). Cyfry bywają dwucyfrowe (nawet 19), dlatego oddzielamy je spacjami.`,
            tests: (r) => ['0', '1', '2', '5', '6', '23', '24', '463', '719', '720', '1000000000000000000', '121645100408831999', '121645100408832000',
                ...Array.from({ length: 6 }, () => String(r.pick([r.int(1, 5000), r.int(1, 1000000000), r.big(1, E18)])))],
            check: (inp) => { const x = B(inp); return x >= 0n && x <= E18 ? null : 'x'; },
            solve: (inp) => silniowy(inp),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    long long x;
    cin >> x;
    if (x == 0) {
        cout << 0 << "\n";
        return 0;
    }
    int K = 1;
    while (K + 1 <= 20 && f[K + 1] <= x) K++;
    for (int k = K; k >= 1; k--) {
        cout << x / f[k];
        if (k > 1) cout << " ";
        x %= f[k];
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 5 · silnia modulo
        {
            id: 'sil-ostatnia-cyfra', krok: 5, level: 'latwe',
            title: 'Ostatnia cyfra silni',
            short: 'n do 10¹⁸ — ale od 5! w górę ostatnią cyfrą jest zawsze 0.',
            tags: ['n! % 10', '2 · 5 = 10', 'if'],
            statement: ['Wczytaj t liczb. Dla każdej liczby n wypisz w osobnym wierszu ostatnią cyfrę liczby n!.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym jedna cyfra.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '4\n3 4 10 1000000000000000000' }],
            hint: R`Od 5! w górę iloczyn zawiera i 2, i 5, czyli dzieli się przez 10 — ostatnia cyfra to 0. Dla n ≤ 4 policz silnię zwykłą pętlą (wyniki: 1, 1, 2, 6, 24) i weź % 10. Pętla do 10¹⁸ trwałaby latami — tu trzeba pomyśleć, zanim się policzy.`,
            tests: (r) => ['1\n0', '1\n4', '1\n5', '1\n1000000000000000000', `10\n${zakresy(0, 9).join(' ')}`,
                `1000\n${Array.from({ length: 1000 }, () => String(r.pick([r.int(0, 6), r.int(0, 100), r.big(0, E18)]))).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => B(x) >= 0n && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => (B(x) >= 5n ? '0' : String(fact(Number(x)) % 10n))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long n;
        cin >> n;
        if (n >= 5) {
            cout << 0 << "\n";
            continue;
        }
        int w = 1;
        for (int i = 2; i <= n; i++) w *= i;
        cout << w % 10 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-silnia-mod', krok: 5, level: 'latwe',
            title: 'Silnia modulo m',
            short: 'n! mod m: modulo po każdym mnożeniu, a w * i w long long.',
            tags: ['w = w * i % m', 'long long', 'modulo po każdym kroku'],
            statement: ['Wczytaj n i m i wypisz resztę z dzielenia n! przez m.'],
            input_format: ['Dwie liczby całkowite n i m.'],
            output_format: ['Jedna liczba — n! mod m.'],
            constraints: ['0 ≤ n ≤ 1 000 000', '2 ≤ m ≤ 2 000 000 000'],
            examples: [{ input: '5 7', note: '120 = 17 · 7 + 1.' }, { input: '10 1000000' }, { input: '1000000 1000000007' }],
            hint: R`Całej silni nie zmieścisz w żadnym typie, ale resztę możesz liczyć na bieżąco: w = w * i % m po każdym mnożeniu (reszta iloczynu zależy tylko od reszt czynników). w jest mniejsze od m ≤ 2 · 10⁹, a i ≤ 10⁶, więc w * i < 2 · 10¹⁵ — mieści się w long long, ale nie w int. Samo m też może nie zmieścić się w int — wczytaj je do long long.`,
            tests: (r) => ['0 2', '1 2', '5 7', '10 1000000', '1000000 1000000007', '1000000 2000000000', '1000000 1999999973', '999999 999983', '20 1000000000', '12 479001600', '13 479001600',
                ...Array.from({ length: 5 }, () => `${r.int(0, 1000000)} ${r.int(2, 2000000000)}`), `${r.int(0, 1000000)} ${r.int(2, 1000)}`],
            check: (inp) => { const [n, m] = toks(inp).map(Number); return n >= 0 && n <= 1000000 && m >= 2 && m <= 2e9 ? null : 'zakres'; },
            solve: (inp) => { const [n, m] = toks(inp).map(Number); let w = 1 % m; for (let i = 2; i <= n; i++) { w = Number((B(w) * B(i)) % B(m)); if (w === 0) break; } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, m;
    cin >> n >> m;
    long long w = 1;
    for (long long i = 2; i <= n; i++) w = w * i % m;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-suma-mod', krok: 5, level: 'latwe',
            title: 'Suma silni modulo',
            short: '(1! + 2! + … + n!) mod 10⁹ + 7 dla n do 10 milionów.',
            tags: ['s = s * i % MOD', 'suma = (suma + s) % MOD', 'const long long MOD'],
            statement: ['Wczytaj n i wypisz resztę z dzielenia sumy 1! + 2! + … + n! przez 1 000 000 007.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma silni modulo 10⁹ + 7.'],
            constraints: ['1 ≤ n ≤ 10 000 000'],
            examples: [{ input: '4' }, { input: '20', note: 'Suma przekracza 10⁹ + 7, więc wypisujemy tylko resztę.' }],
            hint: R`Jak w sumie silni z części 2, tylko po każdym kroku bierzesz resztę: s = s * i % MOD, a potem suma = (suma + s) % MOD. Obie zmienne w long long — s * i może sięgnąć 10¹⁶. Stałą zapisz raz: const long long MOD = 1000000007;.`,
            tests: () => ['1', '2', '4', '12', '13', '20', '100', '1000', '999999', '10000000', '9999999', '1234567'],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 10000000 ? null : 'n'; },
            solve: (inp) => { const n = Number(inp); let s = 1n, suma = 0n; for (let i = 1; i <= n; i++) { s = (s * B(i)) % MOD; suma = (suma + s) % MOD; } return String(suma); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    long long n;
    cin >> n;
    long long s = 1, suma = 0;
    for (long long i = 1; i <= n; i++) {
        s = s * i % MOD;
        suma = (suma + s) % MOD;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-iloczyn-mod', krok: 5, level: 'srednie',
            title: 'Iloczyn od a do b modulo',
            short: 'a · (a + 1) · … · b mod 10⁹ + 7 — modulo nie da się dzielić, więc pętla od a.',
            tags: ['pętla od a do b', 'w = w * i % MOD', 'nie dzielimy modulo'],
            statement: ['Wczytaj a i b i wypisz resztę z dzielenia iloczynu a · (a + 1) · … · b przez 1 000 000 007.'],
            input_format: ['Dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — iloczyn modulo 10⁹ + 7.'],
            constraints: ['1 ≤ a ≤ b ≤ 10⁹', 'b − a ≤ 10 000 000'],
            examples: [{ input: '5 7' }, { input: '999999000 1000000000' }],
            hint: R`Kusi, żeby policzyć b! mod p i (a − 1)! mod p, a potem podzielić — ale reszt nie wolno dzielić (pamiętasz z lekcji o modulo?), a b! do 10⁹ liczyłoby się za długo. Wystarczy pętla od a do b z w = w * i % MOD. i sięga 10⁹, a w < 10⁹ + 7, więc w * i < 1,1 · 10¹⁸ — long long wystarczy.`,
            tests: (r) => ['1 1', '5 7', '1 20', '999999000 1000000000', '1000000000 1000000000', '1 10000001', '990000000 1000000000', '123456789 133456789',
                ...Array.from({ length: 4 }, () => { const a = r.int(1, 999000000); return `${a} ${a + r.int(0, 1000000)}`; })],
            check: (inp) => { const [a, b] = toks(inp).map(Number); return a >= 1 && a <= b && b <= 1e9 && b - a <= 10000000 ? null : 'zakres'; },
            solve: (inp) => { const [a, b] = toks(inp).map(Number); let w = 1n; for (let i = a; i <= b; i++) w = (w * B(i)) % MOD; return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    long long a, b;
    cin >> a >> b;
    long long w = 1;
    for (long long i = a; i <= b; i++) w = w * i % MOD;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-pytania-mod', krok: 5, level: 'srednie',
            title: 'Tablica reszt silni',
            short: 'q pytań o n! mod 10⁹ + 7. Tablica do miliona liczona raz — poza main.',
            tags: ['tablica poza main', 'f[i] = f[i - 1] * i % MOD', 'wiele pytań'],
            statement: ['Wczytaj q liczb. Dla każdej liczby n wypisz w osobnym wierszu resztę z dzielenia n! przez 1 000 000 007.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb całkowitych.'],
            output_format: ['q wierszy — w każdym n! mod 10⁹ + 7.'],
            constraints: ['1 ≤ q ≤ 2000', '0 ≤ każda liczba ≤ 1 000 000'],
            examples: [{ input: '4\n5 0 20 1000000' }],
            hint: R`Dwa tysiące pytań po milion mnożeń to za dużo. Policz raz tablicę reszt: f[0] = 1, f[i] = f[i - 1] * i % MOD dla i do miliona, a potem odpowiadaj f[n]. Tablicę na milion liczb long long zadeklaruj poza main (jak w lekcji o tablicach) — w środku main mogłoby zabraknąć miejsca.`,
            tests: (r) => ['1\n0', '1\n1000000', '5\n0 1 2 3 4', `2000\n${Array.from({ length: 2000 }, () => r.pick([r.int(0, 20), r.int(0, 1000000), 1000000])).join(' ')}`, `500\n${r.arr(500, 999000, 1000000).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => Number(x) >= 0 && Number(x) <= 1000000) && Number(toks(inp)[0]) <= 2000 ? null : 'zakres'),
            solve: (() => {
                let T = null;
                return (inp) => {
                    if (!T) { T = new Array(1000001); let w = 1n; T[0] = 1n; for (let i = 1; i <= 1000000; i++) { w = (w * B(i)) % MOD; T[i] = w; } }
                    return lista(inp).map((x) => String(T[Number(x)])).join('\n');
                };
            })(),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
long long f[1000001];
int main() {
    f[0] = 1;
    for (int i = 1; i <= 1000000; i++) f[i] = f[i - 1] * i % MOD;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n;
        cin >> n;
        cout << f[n] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-olbrzym-mod', krok: 5, level: 'srednie',
            title: 'Silnia olbrzyma modulo m',
            short: 'n do 10¹⁸, m do miliona. Gdy n ≥ m, wynik to 0 — bez liczenia.',
            tags: ['n ≥ m → 0', 'pętla tylko dla n < m', 'long long'],
            statement: ['Wczytaj n i m i wypisz resztę z dzielenia n! przez m.'],
            input_format: ['Dwie liczby całkowite n i m.'],
            output_format: ['Jedna liczba — n! mod m.'],
            constraints: ['0 ≤ n ≤ 10¹⁸', '2 ≤ m ≤ 1 000 000'],
            examples: [{ input: '1000000000000000000 999983' }, { input: '6 7' }],
            hint: R`Jeśli n ≥ m, to m jest jednym z czynników iloczynu 1 · 2 · … · n, więc n! dzieli się przez m i reszta to 0 — od razu. W przeciwnym razie n < m ≤ 10⁶ i zwykła pętla w = w * i % m zdąży. Pętli do 10¹⁸ nie da się wykonać w rozsądnym czasie.`,
            tests: (r) => ['0 2', '1 2', '6 7', '7 7', '1000000000000000000 999983', '999999 1000000', '999982 999983', '1000000 1000000', '100 101', '25 26',
                ...Array.from({ length: 4 }, () => { const m = r.int(2, 1000000); return `${r.int(0, m - 1)} ${m}`; }), ...Array.from({ length: 3 }, () => `${r.big(0, E18)} ${r.int(2, 1000000)}`)],
            check: (inp) => { const t = toks(inp); const n = B(t[0]), m = Number(t[1]); return n >= 0n && n <= E18 && m >= 2 && m <= 1000000 ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp); const n = B(t[0]), m = Number(t[1]); if (n >= B(m)) return '0'; return String(silniaMod(Number(n), B(m))); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, m;
    cin >> n >> m;
    if (n >= m) {
        cout << 0 << "\n";
        return 0;
    }
    long long w = 1;
    for (long long i = 2; i <= n; i++) w = w * i % m;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-dwie-cyfry-sumy', krok: 5, level: 'srednie',
            title: 'Dwie ostatnie cyfry sumy silni',
            short: 'Od 10! w górę każda silnia kończy się na 00 — dwie ostatnie cyfry sumy przestają się zmieniać.',
            tags: ['% 100', 'n ≥ 10', 'setw(2) i setfill'],
            statement: ['Wczytaj n i wypisz dwie ostatnie cyfry sumy 1! + 2! + … + n!. Jeśli przedostatnia cyfra to zero, wypisz je i tak — zawsze dwie cyfry (na przykład 01, a nie 1).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie cyfry.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '1' }, { input: '4', note: '1 + 2 + 6 + 24 = 33.' }, { input: '1000000000000000000' }],
            hint: R`Od 10! w górę każda silnia zawiera czynnik 10 · 5 · 2 = 100, więc kończy się na 00 i nie zmienia dwóch ostatnich cyfr sumy. Wystarczy więc sumować do min(n, 9) — reszta z dzielenia przez 100 będzie już ostateczna. Wypisz ją z dwiema cyframi: cout << setw(2) << setfill('0') << wynik.`,
            tests: (r) => [...zakresy(1, 15), '1000000000000000000', ...Array.from({ length: 3 }, () => String(r.big(16, E18)))],
            check: (inp) => { const n = B(inp); return n >= 1n && n <= E18 ? null : 'n'; },
            solve: (inp) => { const n = Number(B(inp) > 9n ? 9n : B(inp)); let s = 0n; for (let i = 1; i <= n; i++) s += fact(i); return String(s % 100n).padStart(2, '0'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long ile = min(n, 9LL);
    long long s = 1, suma = 0;
    for (long long i = 1; i <= ile; i++) {
        s *= i;
        suma += s;
    }
    cout << setw(2) << setfill('0') << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-wilson', krok: 5, level: 'srednie',
            title: 'Test Wilsona',
            short: 'p jest pierwsza dokładnie wtedy, gdy (p − 1)! daje resztę p − 1. Sprawdź to dla kilku liczb.',
            tags: ['(p − 1)! mod p', 'w = w * i % p', 'liczby pierwsze'],
            statement: ['Twierdzenie Wilsona mówi, że liczba p > 1 jest pierwsza wtedy i tylko wtedy, gdy (p − 1)! daje z dzielenia przez p resztę p − 1. Na przykład dla p = 7: 6! = 720 = 102 · 7 + 6, a 6 = 7 − 1, więc 7 jest pierwsza. Dla p = 6: 5! = 120 = 20 · 6 + 0 — reszta to nie 5, więc 6 nie jest pierwsza.', 'Wczytaj t liczb i dla każdej sprawdź tym sposobem, czy jest pierwsza. Wypisz w osobnych wierszach reszty z dzielenia (p − 1)! przez p i obok słowo TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym reszta (p − 1)! mod p i słowo TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 10', '2 ≤ każda liczba ≤ 1 000 000'],
            examples: [{ input: '4\n7 6 2 4', note: 'Dla p = 4: 3! = 6 daje resztę 2, a nie 3 — 4 nie jest pierwsza.' }],
            hint: R`Dla każdej liczby p policz (p − 1)! mod p pętlą w = w * i % p dla i od 1 do p − 1 (w zaczyna od 1 dla każdej liczby osobno). Potem porównaj w z p − 1. To bardzo wolny sposób sprawdzania pierwszości (p mnożeń zamiast √p dzieleń), ale ładnie pokazuje, że silnia „wie”, które liczby są pierwsze.`,
            tests: (r) => ['1\n2', '1\n4', '1\n999983', '1\n1000000', '10\n2 3 4 5 6 7 8 9 10 11', '3\n25 49 121',
                `10\n${Array.from({ length: 10 }, () => (r() < 0.5 ? losowaPierwsza(r, 2, 1000000) : r.int(2, 1000000))).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => Number(x) >= 2 && Number(x) <= 1000000) && Number(toks(inp)[0]) <= 10 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => { const p = Number(x); const w = silniaMod(p - 1, B(p)); return `${w} ${w === B(p - 1) ? 'TAK' : 'NIE'}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long p;
        cin >> p;
        long long w = 1;
        for (long long i = 1; i <= p - 1; i++) w = w * i % p;
        cout << w << " " << (w == p - 1 ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 6 · zera na końcu i czynniki
        {
            id: 'sil-zera-male', krok: 6, level: 'latwe',
            title: 'Zera na końcu — na piechotę',
            short: 'Policz n! dla n do 20 i licz zera na końcu: % 10 i / 10.',
            tags: ['w % 10 == 0', 'w /= 10', 'long long'],
            statement: ['Wczytaj n i wypisz, iloma zerami kończy się liczba n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba zer na końcu n!.'],
            constraints: ['0 ≤ n ≤ 20'],
            examples: [{ input: '10', note: '10! = 3 628 800 kończy się dwoma zerami.' }, { input: '4' }],
            hint: R`Policz silnię w long long, a potem: dopóki w % 10 == 0 — zwiększ licznik i podziel w przez 10. Silnia jest zawsze dodatnia, więc pętla na pewno się skończy.`,
            tests: () => zakresy(0, 20),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 20 ? null : 'n'; },
            solve: (inp) => String(zera(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 1; i <= n; i++) w *= i;
    int zera = 0;
    while (w % 10 == 0) {
        zera++;
        w /= 10;
    }
    cout << zera << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-ile-piatek', krok: 6, level: 'latwe',
            title: 'Ile piątek w liczbie?',
            short: 'Ile razy liczba dzieli się przez 5? 25 ma dwie piątki, 250 — trzy.',
            tags: ['while (x % 5 == 0)', 'x /= 5', 'licznik'],
            statement: ['Wczytaj t liczb. Dla każdej liczby x wypisz w osobnym wierszu, ile razy x dzieli się przez 5 — czyli ile piątek ma w rozkładzie na czynniki pierwsze. Na przykład 25 = 5 · 5 ma dwie piątki, 250 = 2 · 5 · 5 · 5 — trzy, a 7 — zero.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych dodatnich.'],
            output_format: ['t wierszy — w każdym liczba piątek.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '5\n25 250 7 5 1000000' }],
            hint: R`Dla każdej liczby: licznik = 0, a potem dopóki x % 5 == 0 — licznik++ i x /= 5. Liczby sięgają 10¹⁸, więc wczytuj je do long long. To dokładnie ta operacja, którą w lekcji robiliśmy dla każdej liczby od 1 do n, licząc piątki w silni.`,
            tests: (r) => ['1\n1', '1\n5', '1\n1000000000000000000', '1\n762939453125', '1\n3814697265625', '6\n25 125 625 3125 15625 78125',
                `1000\n${Array.from({ length: 1000 }, () => { const e = r.int(0, 25); let x = 5n ** B(e) * B(r.int(1, 1000)); if (x > E18) x = 5n ** B(e); return String(x); }).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => B(x) >= 1n && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => String(krotnosc(x, 5))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x;
        cin >> x;
        int piatki = 0;
        while (x % 5 == 0) {
            piatki++;
            x /= 5;
        }
        cout << piatki << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-zera-wolno', krok: 6, level: 'latwe',
            title: 'Zera silni miliona',
            short: 'Zera na końcu n! dla n do miliona: zsumuj piątki wszystkich liczb od 1 do n.',
            tags: ['piątki każdej liczby', 'pętla w pętli', 'dwójek jest więcej'],
            statement: ['Wczytaj n i wypisz, iloma zerami kończy się liczba n!. Tym razem n może sięgać miliona — silni nie da się policzyć, trzeba liczyć piątki.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba zer na końcu n!.'],
            constraints: ['0 ≤ n ≤ 1 000 000'],
            examples: [{ input: '10' }, { input: '25', note: '25! ma 6 piątek: po jednej w 5, 10, 15, 20 i dwie w 25.' }],
            hint: R`Każde zero na końcu to czynnik 10 = 2 · 5, a dwójek w silni jest zawsze więcej niż piątek. Liczba zer to więc liczba piątek w iloczynie 1 · 2 · … · n. Dla każdego i od 1 do n policz piątki w i (while (x % 5 == 0)) i dodaj do wyniku. Szybciej: piątki mają tylko wielokrotności 5, więc pętla może iść co 5.`,
            tests: () => ['0', '4', '5', '10', '24', '25', '100', '124', '125', '1000', '999999', '1000000', '390624', '390625', '78124'],
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000000 ? null : 'n'; },
            solve: (inp) => String(zera(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long zera = 0;
    for (int i = 5; i <= n; i += 5) {
        int x = i;
        while (x % 5 == 0) {
            zera++;
            x /= 5;
        }
    }
    cout << zera << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-zera-wiele', krok: 6, level: 'srednie',
            title: 'Zera silni olbrzymów',
            short: 'n/5 + n/25 + n/125 + … dla n do 10¹⁸ — tysiąc pytań naraz.',
            tags: ['n / 5 + n / 25 + …', 'dzielenie w pętli', 'long long'],
            statement: ['Wczytaj t liczb. Dla każdej liczby n wypisz w osobnym wierszu, iloma zerami kończy się n!.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym liczba zer na końcu n!.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '3\n100 1000000000 1000000000000000000' }],
            hint: R`Co piąta liczba daje jedną piątkę, co dwudziesta piąta — jeszcze jedną, co sto dwudziesta piąta — kolejną… Wynik to n / 5 + n / 25 + n / 125 + …, aż kolejna potęga piątki przekroczy n. Najbezpieczniej bez potęg: while (n > 0) { n /= 5; zera += n; } — ten sam wynik, a żadna liczba nie urośnie ponad n.`,
            tests: (r) => ['1\n0', '1\n4', '1\n1000000000000000000', '6\n5 24 25 124 125 624', '3\n298023223876953125 298023223876953124 59604644775390625',
                `1000\n${Array.from({ length: 1000 }, () => String(r.pick([r.int(0, 1000), r.big(0, E18), r.big(0, 1000000000000n)]))).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => B(x) >= 0n && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => String(zera(x))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long n;
        cin >> n;
        long long zera = 0;
        while (n > 0) {
            n /= 5;
            zera += n;
        }
        cout << zera << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-dwojki', krok: 6, level: 'srednie',
            title: 'Dwójki w silni',
            short: 'Ile dwójek ma n! w rozkładzie? n/2 + n/4 + n/8 + … — zawsze więcej niż piątek.',
            tags: ['n / 2 + n / 4 + …', 'wzór Legendre’a', 'long long'],
            statement: ['Wczytaj t liczb. Dla każdej liczby n wypisz w osobnym wierszu, ile razy liczba n! dzieli się przez 2 (czyli ile dwójek ma w rozkładzie na czynniki pierwsze).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym liczba dwójek w n!.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '3\n10 4 1' }],
            hint: R`To samo co z piątkami, tylko z dwójką: co druga liczba daje jedną dwójkę, co czwarta — jeszcze jedną, co ósma — kolejną… Wynik to n / 2 + n / 4 + n / 8 + …; najprościej while (n > 0) { n /= 2; wynik += n; }. Dla 10! wychodzi 5 + 2 + 1 = 8 — dużo więcej niż 2 piątki.`,
            tests: (r) => ['1\n0', '1\n1', '1\n1000000000000000000', '6\n2 3 4 7 8 1024', '3\n999999999999999999 576460752303423488 576460752303423487',
                `1000\n${Array.from({ length: 1000 }, () => String(r.pick([r.int(0, 1000), r.big(0, E18)]))).join(' ')}`],
            check: (inp) => (zgodnaLista(inp, (x) => B(x) >= 0n && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => String(leg(x, 2))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long n;
        cin >> n;
        long long wynik = 0;
        while (n > 0) {
            n /= 2;
            wynik += n;
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-wykladnik', krok: 6, level: 'srednie',
            title: 'Wykładnik liczby pierwszej',
            short: 'Ile razy n! dzieli się przez liczbę pierwszą p? n/p + n/p² + … dla dowolnego p.',
            tags: ['wzór Legendre’a', 'while (n > 0) n /= p', 'p > n → 0'],
            statement: ['Wczytaj t par liczb n i p, gdzie p jest liczbą pierwszą. Dla każdej pary wypisz w osobnym wierszu, ile razy n! dzieli się przez p (czyli wykładnik p w rozkładzie n! na czynniki pierwsze).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W kolejnych t wierszach po dwie liczby: n i p.'],
            output_format: ['t wierszy — w każdym wykładnik p w n!.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸', '2 ≤ p ≤ 2 · 10⁹, p jest liczbą pierwszą'],
            examples: [{ input: '3\n10 3\n100 7\n5 7', note: '10! dzieli się przez 3 czterokrotnie: po jednej trójce w 3 i 6 oraz dwie w 9.' }],
            hint: R`Ten sam wzór co dla piątek i dwójek, tylko z p: n / p + n / p² + n / p³ + … (to wzór Legendre’a). Nie licz potęg p — mogą przekroczyć zakres long long. Dziel n w pętli: while (n > 0) { n /= p; wynik += n; }. Gdy p > n, wynik to 0 — pętla zrobi to sama.`,
            tests: (r) => {
                const pary = () => { const p = r.pick([2, 3, 5, 7, 11, 13, 97, 1000000007, 999999937, 1999999973, losowaPierwsza(r, 2, 1000), losowaPierwsza(r, 2, 2000000000)]); return `${r.pick([r.int(0, 1000), r.big(0, E18), B(p) * B(r.int(0, 10))])} ${p}`; };
                return ['1\n0 2', '1\n1000000000000000000 2', '1\n1000000000000000000 999999937', '1\n999999936 999999937', '1\n999999937 999999937', '4\n10 3\n10 5\n10 7\n10 11',
                    `1000\n${Array.from({ length: 1000 }, pary).join('\n')}`];
            },
            check: (inp) => { const t = toks(inp); const k = Number(t[0]); if (t.length !== 1 + 2 * k || k > 1000) return 'liczba'; for (let i = 0; i < k; i++) { const n = B(t[1 + 2 * i]), p = Number(t[2 + 2 * i]); if (n < 0n || n > E18 || p < 2 || p > 2e9 || !czyPierwsza(p)) return 'zakres'; } return null; },
            solve: (inp) => { const t = toks(inp); const out = []; for (let i = 0; i < Number(t[0]); i++) out.push(String(leg(t[1 + 2 * i], t[2 + 2 * i]))); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long n, p;
        cin >> n >> p;
        long long wynik = 0;
        while (n > 0) {
            n /= p;
            wynik += n;
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-zera-iloczynu', krok: 6, level: 'srednie',
            title: 'Zera na końcu iloczynu',
            short: 'Iloczyn n liczb ma tyle zer, ile par 2 · 5 — min(dwójki, piątki).',
            tags: ['dwójki i piątki', 'min(d, p)', 'bez liczenia iloczynu'],
            statement: ['Wczytaj n liczb dodatnich i wypisz, iloma zerami kończy się ich iloczyn. Iloczyn może być ogromny — nie da się go policzyć wprost.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych dodatnich.'],
            output_format: ['Jedna liczba — liczba zer na końcu iloczynu.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '3\n4 25 3', note: '4 · 25 · 3 = 300.' }, { input: '2\n16 5', note: '16 · 5 = 80 — tylko jedna piątka, choć dwójek jest cztery.' }],
            hint: R`Zero na końcu to para 2 · 5. Policz łączną liczbę dwójek we wszystkich liczbach (while (x % 2 == 0)) i łączną liczbę piątek. Każda para dwójka + piątka daje jedno zero, więc wynik to min(dwójki, piątki). W silni dwójek zawsze było więcej, ale w dowolnym iloczynie — niekoniecznie.`,
            tests: (r) => {
                const jedna = () => { let x = 2n ** B(r.int(0, 12)) * 5n ** B(r.int(0, 12)) * B(r.int(1, 1000)); if (x > E18) x = B(r.int(1, 1000000)); return String(x); };
                return ['1\n1', '1\n1000000000000000000', '2\n16 5', '3\n4 25 3', '2\n7 11', '5\n2 2 2 5 5', `1000\n${Array.from({ length: 1000 }, jedna).join(' ')}`, `300\n${Array.from({ length: 300 }, () => String(r.big(1, E18))).join(' ')}`];
            },
            check: (inp) => (zgodnaLista(inp, (x) => B(x) >= 1n && B(x) <= E18) && Number(toks(inp)[0]) <= 1000 ? null : 'zakres'),
            solve: (inp) => { let d = 0n, p = 0n; for (const x of lista(inp)) { d += krotnosc(x, 2); p += krotnosc(x, 5); } return String(d < p ? d : p); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long dwojki = 0, piatki = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        while (x % 2 == 0) {
            dwojki++;
            x /= 2;
        }
        while (x % 5 == 0) {
            piatki++;
            x /= 5;
        }
    }
    cout << min(dwojki, piatki) << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-dokladnie-k-zer', krok: 6, level: 'srednie',
            title: 'Silnia z dokładnie k zerami',
            short: 'Najmniejsze n, którego silnia kończy się dokładnie k zerami — albo NIE, bo niektórych k brak.',
            tags: ['zera rosną skokami', 'pętla co 5', 'NIE'],
            statement: ['Wczytaj t liczb. Dla każdej liczby k wypisz w osobnym wierszu najmniejsze n, dla którego n! kończy się dokładnie k zerami. Jeśli takiego n nie ma, wypisz NIE.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym liczba n albo słowo NIE.'],
            constraints: ['1 ≤ t ≤ 20', '0 ≤ każda liczba ≤ 1 000 000'],
            examples: [{ input: '4\n0 1 5 6', note: '24! ma 4 zera, a 25! już 6 — żadna silnia nie ma dokładnie 5 zer.' }],
            hint: R`Liczba zer zmienia się tylko przy wielokrotnościach 5 (tylko one dodają piątki), więc odpowiedź — jeśli istnieje — jest wielokrotnością 5. Idź pętlą n = 0, 5, 10, … i trzymaj liczbę zer z = zera(n): przy przejściu do n + 5 dodaj liczbę piątek w n + 5. Zatrzymaj się, gdy z ≥ k. Jeśli z == k — odpowiedzią jest n, a jeśli z przeskoczyło k (bo n + 5 dało od razu dwie albo więcej piątek) — NIE.`,
            tests: (r) => {
                const zle = []; // k, których brakuje
                let z = 0n;
                for (let n = 5; zle.length < 30; n += 5) { const nz = z + krotnosc(n, 5); for (let k = z + 1n; k < nz; k++) zle.push(String(k)); z = nz; }
                return ['1\n0', '1\n1000000', '1\n5', '20\n0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19', `20\n${zle.slice(0, 20).join(' ')}`,
                    `20\n${Array.from({ length: 20 }, () => r.int(0, 1000000)).join(' ')}`, `20\n${Array.from({ length: 20 }, () => r.int(999000, 1000000)).join(' ')}`];
            },
            check: (inp) => (zgodnaLista(inp, (x) => Number(x) >= 0 && Number(x) <= 1000000) && Number(toks(inp)[0]) <= 20 ? null : 'zakres'),
            solve: (inp) => lista(inp).map((x) => {
                const k = B(x);
                // zera(n) rośnie z n; szukamy binarnie najmniejszego n z zera(n) >= k
                let lo = 0n, hi = 5n * k + 5n;
                while (lo < hi) { const mid = (lo + hi) / 2n; if (zera(mid) >= k) hi = mid; else lo = mid + 1n; }
                return zera(lo) === k ? String(lo) : 'NIE';
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int j = 0; j < t; j++) {
        long long k;
        cin >> k;
        long long n = 0, z = 0;
        while (z < k) {
            n += 5;
            long long x = n;
            while (x % 5 == 0) {
                z++;
                x /= 5;
            }
        }
        if (z == k) cout << n << "\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
    ];
};
