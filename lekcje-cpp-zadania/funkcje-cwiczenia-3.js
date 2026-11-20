// Funkcje — ćwiczenia w trakcie lekcji, części 7–8: funkcje z kontenerami (zwracanie vectora, pary i napisu, tablica
// int t[] jako parametr, komparator do sort jako zwykła funkcja, vector napisów jako obrazek) oraz narzędzia: przeciążanie,
// wartości domyślne, rozbijanie większego zadania na małe funkcje (daty, ułamki, cztery w rzędzie, przecinanie odcinków).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./funkcje-pomoc');
    const { calk, numerDnia, czyPoprawnaData, nwdBig } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

    const czynniki = (n) => { const o = []; for (let d = 2; d * d <= n; d++) if (n % d === 0) { o.push(d); while (n % d === 0) n /= d; } if (n > 1) o.push(n); return o.join(','); };
    const ileDzielnikow = (x) => { let k = 0; for (let d = 1; d * d <= x; d++) if (x % d === 0) k += d * d === x ? 1 : 2; return k; };

    return [
        // ================================================================ KROK 7 · vector, string, pair, tablice
        {
            id: 'fun-te-same-czynniki', krok: 7, level: 'latwe',
            title: 'Te same czynniki pierwsze',
            short: '12 i 18 mają te same czynniki pierwsze: 2 i 3. Funkcja zwraca vector czynników, a dwa vectory porównuje się zwykłym ==.',
            tags: ['funkcja zwracająca vector', 'porównanie vectorów', 'rozkład na czynniki'],
            statement: ['Dwie liczby są spokrewnione, jeśli dzielą się przez dokładnie te same liczby pierwsze. 12 = 2 · 2 · 3 i 18 = 2 · 3 · 3 są spokrewnione (obie mają czynniki 2 i 3), a 12 i 15 = 3 · 5 — nie.',
                'Napisz funkcję vector<int> czynniki(int n), która zwraca różne czynniki pierwsze liczby n rosnąco. Dla każdej pary wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy dwie liczby a i b.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 500', '2 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3\n12 18\n12 15\n7 49', note: '12 i 18: czynniki {2, 3} i {2, 3}. 12 i 15: {2, 3} i {3, 5}. 7 i 49 = 7 · 7: oba mają tylko 7.' }],
            hint: R`vector<int> czynniki(int n) { vector<int> w; for (int d = 2; d * d <= n; d++) if (n % d == 0) { w.push_back(d); while (n % d == 0) n /= d; } if (n > 1) w.push_back(n); return w; } — to, co zostanie po pętli (większe od 1), jest ostatnim czynnikiem. W main: if (czynniki(a) == czynniki(b)) — vectory porównuje się element po elemencie.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const zCzynnikow = (ps, mx) => { let x = 1; for (const p of ps) x *= p; if (x > mx) return null; while (r() < 0.6) { const p = r.pick(ps); if (x * p > mx) break; x *= p; } return x; };
                const para = () => { const PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 97, 101, 997, 9973]; for (;;) { const ps = r.shuffle(PR).slice(0, r.int(1, 4)).sort((a, b) => a - b); const a = zCzynnikow(ps, 1e9), b = zCzynnikow(r() < 0.7 ? ps : r.shuffle(PR).slice(0, ps.length), 1e9); if (a && b && a >= 2 && b >= 2) return [a, b]; } };
                return [d([[2, 2]]), d([[999999937, 999999937], [1000000000, 10], [536870912, 2], [6, 30], [999999937, 2]]), d(Array.from({ length: 30 }, para)), d(Array.from({ length: 500 }, () => (r() < 0.5 ? para() : [r.int(2, 1e9), r.int(2, 1e9)])))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 500) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, 2, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) o.push(czynniki(t[i]) === czynniki(t[i + 1]) ? 'TAK' : 'NIE'); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<int> czynniki(int n) {
    vector<int> w;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            w.push_back(d);
            while (n % d == 0) n /= d;
        }
    }
    if (n > 1) w.push_back(n);
    return w;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int a, b;
        cin >> a >> b;
        if (czynniki(a) == czynniki(b)) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-suma-iloczyn', krok: 7, level: 'latwe',
            title: 'Suma równa iloczynowi',
            short: '123: 1 + 2 + 3 = 6 = 1 · 2 · 3. Funkcja oddaje dwa wyniki naraz jako parę, a main rozpakowuje je przez auto [s, p].',
            tags: ['funkcja zwracająca pair', 'auto [a, b]', 'cyfry liczby'],
            statement: ['Niektóre liczby mają sumę cyfr równą iloczynowi cyfr: wszystkie jednocyfrowe, 22 (2 + 2 = 2 · 2), 123 (1 + 2 + 3 = 1 · 2 · 3) czy 1124.',
                'Napisz funkcję pair<int, long long> sumaIIloczyn(int x), która zwraca obie wartości naraz. Dla każdego z q przedziałów [a, b] policz takie liczby.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy liczby a i b.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ q ≤ 5', '1 ≤ a ≤ b ≤ 10⁶'],
            examples: [{ input: '1\n1 30', note: 'Dziewięć liczb jednocyfrowych i 22 — razem 10.' }],
            hint: R`pair<int, long long> sumaIIloczyn(int x) { int s = 0; long long p = 1; while (x > 0) { s += x % 10; p *= x % 10; x /= 10; } return {s, p}; }. W main: auto [s, p] = sumaIIloczyn(i); if (s == p) ile++; — para pozwala oddać dwie liczby jednym return.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([[1, 1]]), d([[10, 21], [22, 22], [1, 1000000]]), d(Array.from({ length: 5 }, () => { const a = r.int(1, 990000); return [a, a + r.int(0, 10000)]; })), d(Array.from({ length: 5 }, () => [r.int(1, 1000), 1000000]))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) && t.slice(1).every((x, i, a) => i % 2 === 0 || a[i - 1] <= x) ? null : 'dane'; },
            solve: (inp) => {
                const ok = new Uint8Array(1000001);
                for (let x = 1; x <= 1000000; x++) { let s = 0, p = 1, y = x; while (y > 0) { s += y % 10; p *= y % 10; y = Math.floor(y / 10); } ok[x] = s === p ? 1 : 0; }
                const t = nums(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) { let k = 0; for (let x = t[i]; x <= t[i + 1]; x++) k += ok[x]; o.push(k); } return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
pair<int, long long> sumaIIloczyn(int x) {
    int s = 0;
    long long p = 1;
    while (x > 0) {
        s += x % 10;
        p *= x % 10;
        x /= 10;
    }
    return {s, p};
}
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        int ile = 0;
        for (int i = a; i <= b; i++) {
            auto [s, p] = sumaIIloczyn(i);
            if (s == p) ile++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-wartosc-slowa', krok: 7, level: 'latwe',
            title: 'Ranking słów według wartości',
            short: 'Wartość słowa to suma numerów liter (a = 1, …, z = 26). Sortujemy własnym komparatorem — zwykłą funkcją bool podaną do sort.',
            tags: ['komparator jako funkcja', 'const string &', 'sort'],
            statement: ['Wartość słowa to suma numerów jego liter w alfabecie angielskim: a = 1, b = 2, …, z = 26. Na przykład kot = 11 + 15 + 20 = 46.',
                'Ułóż słowa od najcenniejszego. Przy równej wartości wcześniej idzie słowo wcześniejsze alfabetycznie. Napisz funkcje int wartosc(const string &s) oraz bool lepsze(const string &a, const string &b) i przekaż tę drugą do sort.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy jedno słowo.'],
            output_format: ['n wierszy: słowo i jego wartość, w kolejności rankingu.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 20 małych liter (mogą się powtarzać).'],
            examples: [{ input: '4\nkot\nala\nzebra\nab', note: 'zebra = 26 + 5 + 2 + 18 + 1 = 52, kot = 46, ala = 14, ab = 3.' }],
            hint: R`bool lepsze(const string &a, const string &b) { int wa = wartosc(a), wb = wartosc(b); if (wa != wb) return wa > wb; return a < b; }. Do sort podajesz samą nazwę funkcji, bez nawiasów: sort(v.begin(), v.end(), lepsze); — sort sam będzie ją wywoływał. Z nawiasami (lepsze()) kompilator zgłosi „too few arguments”.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['a']), d(['b', 'aa', 'ba', 'ab', 'c']), d(Array.from({ length: 30 }, () => r.word(r.int(1, 6)))), d(Array.from({ length: 1000 }, () => r.word(r.int(1, 20)))), d(Array.from({ length: 1000 }, () => r.word(r.int(1, 3), 'abc')))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((s) => /^[a-z]{1,20}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const w = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0) - 96, 0); return toks(inp).slice(1).sort((a, b) => w(b) - w(a) || cmp(a, b)).map((s) => `${s} ${w(s)}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int wartosc(const string &s) {
    int w = 0;
    for (char c : s) w += c - 'a' + 1;
    return w;
}
bool lepsze(const string &a, const string &b) {
    int wa = wartosc(a), wb = wartosc(b);
    if (wa != wb) return wa > wb;
    return a < b;
}
int main() {
    int n;
    cin >> n;
    vector<string> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    sort(v.begin(), v.end(), lepsze);
    for (const string &s : v) cout << s << " " << wartosc(s) << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-po-dzielnikach', krok: 7, level: 'srednie',
            title: 'Według liczby dzielników',
            short: 'Najpierw liczby z największą liczbą dzielników. Liczenie dzielników jest drogie, więc liczymy je raz, a komparator porównuje gotowe pary.',
            tags: ['komparator jako funkcja', 'vector par', 'licz raz, sortuj potem'],
            statement: ['Ułóż n liczb od tej, która ma najwięcej dzielników (12 ma ich sześć: 1, 2, 3, 4, 6, 12). Przy remisie wcześniej idzie mniejsza liczba.',
                'Napisz funkcję int ileDzielnikow(int x), która sprawdza dzielniki do √x. Policz liczbę dzielników każdej liczby raz, zapisz pary (liczba dzielników, liczba) w vectorze i posortuj go własnym komparatorem bool porownaj(const pair<int, int> &a, const pair<int, int> &b).'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: liczby w nowej kolejności, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5\n12 7 8 1 6', note: 'Dzielników: 12 → 6, 8 → 4, 6 → 4, 7 → 2, 1 → 1. Przy remisie 6 i 8 wygrywa mniejsza, czyli 6.' }],
            hint: R`int ileDzielnikow(int x) { int k = 0; for (int d = 1; d * d <= x; d++) if (x % d == 0) { k++; if (d != x / d) k++; } return k; } — każdy dzielnik d ≤ √x ma parę x / d. Komparator: if (a.first != b.first) return a.first > b.first; return a.second < b.second;. Gdyby komparator sam liczył dzielniki, robiłby to przy każdym porównaniu — wielokrotnie dla tej samej liczby.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), d(r.arr(30, 1, 100)), d(r.arr(2000, 1, 1000000)), d([...r.arr(1000, 1, 50), 720720, 831600, 997920, 1000000, 999983])];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((x) => [ileDzielnikow(x), x]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).map((p) => p[1]).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int ileDzielnikow(int x) {
    int k = 0;
    for (int d = 1; d * d <= x; d++) {
        if (x % d == 0) {
            k++;
            if (d != x / d) k++;
        }
    }
    return k;
}
bool porownaj(const pair<int, int> &a, const pair<int, int> &b) {
    if (a.first != b.first) return a.first > b.first;
    return a.second < b.second;
}
int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> v(n);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        v[i] = {ileDzielnikow(x), x};
    }
    sort(v.begin(), v.end(), porownaj);
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << v[i].second;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-obrot-fragmentu', krok: 7, level: 'srednie',
            title: 'Karuzela na fragmencie',
            short: 'Funkcja dostaje zwykłą tablicę int t[] i przesuwa fragment w kółko o jedno miejsce. Tablica nie jest kopiowana — zmiany widać w main.',
            tags: ['tablica int t[] jako parametr', 'zmiana w miejscu', 'przesunięcie cykliczne'],
            statement: ['W tablicy n liczb (pozycje od 1 do n) wykonujemy q operacji. Operacja a b obraca fragment od pozycji a do b o jedno miejsce w prawo: ostatni element fragmentu przechodzi na jego początek, a pozostałe przesuwają się o jedno miejsce dalej.',
                'Napisz funkcję void obroc(int t[], int a, int b). Tablica przekazana do funkcji nie jest kopiowana — funkcja pracuje na tej samej tablicy co main. Wypisz tablicę po wszystkich operacjach.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb.', 'W trzecim wierszu q, a w każdym z q kolejnych dwie liczby a i b.'],
            output_format: ['Jeden wiersz: tablica po wszystkich operacjach.'],
            constraints: ['1 ≤ n, q ≤ 1000', '1 ≤ a ≤ b ≤ n', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 2 3 4 5\n2\n1 3\n2 5', note: 'Po obrocie 1–3: 3 1 2 4 5. Fragment 2–5 to 1 2 4 5 — po obrocie 5 1 2 4, więc cała tablica: 3 5 1 2 4.' }],
            hint: R`void obroc(int t[], int a, int b) { int ost = t[b]; for (int i = b; i > a; i--) t[i] = t[i - 1]; t[a] = ost; } — idziemy od końca, żeby niczego nie nadpisać przed przesunięciem. Wywołanie to obroc(t, a, b); — sama nazwa tablicy, bez nawiasów kwadratowych.`,
            tests: (r) => {
                const d = (a, Q) => `${a.length}\n${a.join(' ')}\n${Q.length}\n${Q.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const pyt = (n, q) => Array.from({ length: q }, () => { const a = r.int(1, n); return [a, r.int(a, n)]; });
                return [d([7], [[1, 1]]), d([1, 2, 3], [[1, 3], [1, 3], [1, 3]]), d(r.arr(10, -9, 9), pyt(10, 20)), d(r.arr(1000, -1000000000, 1000000000), pyt(1000, 1000)), d(Array.from({ length: 1000 }, (_, i) => i + 1), Array.from({ length: 1000 }, () => [1, 1000]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const t = L[1].split(' ').map(Number); const q = Number(L[2]);
                if (!calk(n, 1, 1000) || t.length !== n || !t.every((x) => calk(x, -1e9, 1e9)) || !calk(q, 1, 1000) || L.length !== q + 3) return 'dane';
                return L.slice(3).every((l) => { const [a, b] = l.split(' ').map(Number); return calk(a, 1, n) && calk(b, a, n); }) ? null : 'operacja';
            },
            solve: (inp) => { const L = linie(inp); const t = L[1].split(' ').map(Number); for (const l of L.slice(3)) { const [a, b] = l.split(' ').map(Number); const x = t.splice(b - 1, 1)[0]; t.splice(a - 1, 0, x); } return t.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void obroc(int t[], int a, int b) {
    int ost = t[b];
    for (int i = b; i > a; i--) t[i] = t[i - 1];
    t[a] = ost;
}
int main() {
    int n;
    cin >> n;
    int t[1005];
    for (int i = 1; i <= n; i++) cin >> t[i];
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        obroc(t, a, b);
    }
    for (int i = 1; i <= n; i++) {
        if (i > 1) cout << " ";
        cout << t[i];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-spakuj-rozpakuj', krok: 7, level: 'srednie',
            title: 'Spakuj i rozpakuj',
            short: 'aaabcc ↔ a3b1c2. Dwie funkcje, które zwracają napis i robią dokładnie odwrotne rzeczy — dobra okazja, żeby sprawdzić jedną drugą.',
            tags: ['funkcja zwracająca string', 'const string &', 'liczby wielocyfrowe w napisie'],
            statement: ['Pakowanie zamienia każdy ciąg takich samych liter na literę i długość ciągu: aaabcc → a3b1c2, zzzzzzzzzzzz → z12. Rozpakowanie robi odwrotnie.',
                'Napisz funkcje string spakuj(const string &s) i string rozpakuj(const string &k). Polecenie S tekst — wypisz spakowany tekst; polecenie R kod — wypisz rozpakowany kod.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy polecenie S albo R i napis.'],
            output_format: ['q wierszy z wynikami.'],
            constraints: ['1 ≤ q ≤ 20', 'Teksty mają od 1 do 1000 małych liter.', 'Kody są poprawnym wynikiem pakowania tekstu o długości od 1 do 1000.'],
            examples: [{ input: '3\nS aaabcc\nR a3b1c2\nR z12', note: 'Kod a3b1c2 to trzy a, jedno b i dwa c. W z12 liczba ma dwie cyfry — trzeba je zebrać, zanim powtórzy się literę.' }],
            hint: R`Pakowanie: idź po napisie i licz, ile razy z rzędu stoi ta sama litera; gdy się zmienia (albo napis się kończy) — dopisz literę i to_string(ile). Rozpakowanie: weź literę, potem zbieraj cyfry: ile = ile * 10 + (c - '0'), a na koniec wynik += string(ile, litera).`,
            tests: (r) => {
                const tekst = (n, al) => { let s = ''; while (s.length < n) s += r.pick(al).repeat(Math.min(n - s.length, r.int(1, r.pick([3, 15, 120])))); return s; };
                const pak = (s) => s.replace(/(.)\1*/g, (m, c) => c + m.length);
                const los = (q) => `${q}\n${Array.from({ length: q }, () => { const s = tekst(r.int(1, 1000), r.pick(['ab', 'abc', 'abcdefghijklmnopqrstuvwxyz', 'z'])); return r() < 0.5 ? `S ${s}` : `R ${pak(s)}`; }).join('\n')}`;
                return ['1\nS a', '4\nR a1\nS zzzzzzzzzzzz\nR b1000\nS abababab', los(6), los(20)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 20) || L.length !== q + 1) return 'q';
                for (const l of L.slice(1)) { let m; if ((m = l.match(/^S ([a-z]{1,1000})$/))) continue; if (!(m = l.match(/^R ((?:[a-z][1-9]\d*)+)$/))) return 'polecenie'; let dl = 0, pop = ''; for (const [, c, k] of m[1].matchAll(/([a-z])(\d+)/g)) { if (c === pop) return 'te same litery obok'; pop = c; dl += Number(k); } if (dl > 1000) return 'długość'; }
                return null;
            },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [c, s] = l.split(' '); return c === 'S' ? s.replace(/(.)\1*/g, (m, x) => x + m.length) : s.replace(/([a-z])(\d+)/g, (m, x, k) => x.repeat(Number(k))); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string spakuj(const string &s) {
    string w = "";
    int i = 0;
    while (i < (int)s.size()) {
        int j = i;
        while (j < (int)s.size() && s[j] == s[i]) j++;
        w += s[i];
        w += to_string(j - i);
        i = j;
    }
    return w;
}
string rozpakuj(const string &k) {
    string w = "";
    int i = 0;
    while (i < (int)k.size()) {
        char litera = k[i];
        i++;
        int ile = 0;
        while (i < (int)k.size() && k[i] >= '0' && k[i] <= '9') {
            ile = ile * 10 + (k[i] - '0');
            i++;
        }
        w += string(ile, litera);
    }
    return w;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string c, s;
        cin >> c >> s;
        if (c == "S") cout << spakuj(s) << "\n";
        else cout << rozpakuj(s) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-uprosc-sciezke', krok: 7, level: 'srednie',
            title: 'Uprość ścieżkę',
            short: '/home/ala/../ola/./dok to tak naprawdę /home/ola/dok. Funkcja dzieli napis na vector nazw, druga skleja go z powrotem.',
            tags: ['funkcja zwracająca vector<string>', 'vector jako stos', 'podział napisu'],
            statement: ['Ścieżka do folderu zaczyna się od / i składa się z nazw oddzielonych znakami /. Kropka . oznacza „ten sam folder”, a dwie kropki .. — „folder wyżej” (z folderu głównego / nie da się wyjść wyżej). Kilka ukośników pod rząd działa jak jeden, a ukośnik na końcu niczego nie zmienia.',
                'Wypisz każdą ścieżkę w najprostszej postaci: / i nazwy folderów oddzielone pojedynczymi /, bez . i .. (folder główny to sam znak /). Napisz funkcje vector<string> podziel(const string &s), która zwraca kolejne niepuste nazwy, i string zlacz(const vector<string> &v).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy jedna ścieżka.'],
            output_format: ['n wierszy z uproszczonymi ścieżkami.'],
            constraints: ['1 ≤ n ≤ 500', 'Ścieżka ma od 1 do 100 znaków, zaczyna się od / i zawiera tylko /, kropki, małe litery i cyfry.', 'Nazwy folderów (poza . i ..) mają co najmniej jedną literę albo cyfrę.'],
            examples: [{ input: '3\n/home/ala/../ola/./dok\n/../a//b/\n/.', note: 'Z /home/ala wracamy do /home i wchodzimy do ola, a potem dok. W drugiej: .. z folderu głównego nic nie robi, a // działa jak /.' }],
            hint: R`podziel: idź po znakach i zbieraj nazwę; przy / (i na końcu) dopisz ją do wyniku, jeśli nie jest pusta. Potem przejdź po nazwach z vectorem stos: "." pomijasz, ".." to if (!stos.empty()) stos.pop_back();, a inną nazwę push_back. zlacz: dla pustego vectora zwróć "/", inaczej dla każdej nazwy w += "/" + nazwa.`,
            tests: (r) => {
                const AL = 'abcdefghijklmnopqrstuvwxyz0123456789';
                const nazwa = () => (r() < 0.25 ? '..' : r() < 0.35 ? '.' : r.word(r.int(1, 5), AL));
                const sciezka = () => { for (;;) { let s = ''; const k = r.int(0, 14); for (let i = 0; i < k; i++) s += '/'.repeat(r() < 0.85 ? 1 : 2) + nazwa(); if (r() < 0.2 || !s) s += '/'; if (s.length <= 100) return s; } };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['/']), d(['/..', '/./././', '/a/b/c/../../..', '/x//y///z', '/a.b/..c/c..', '/abc/', '/9/../9']), d(Array.from({ length: 30 }, sciezka)), d(Array.from({ length: 500 }, sciezka))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 500) && L.length === n + 1 && L.slice(1).every((s) => /^\/[a-z0-9./]{0,99}$/.test(s) && s.split('/').filter(Boolean).every((p) => p === '.' || p === '..' || /[a-z0-9]/.test(p))) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((s) => { const st = []; for (const p of s.split('/').filter(Boolean)) { if (p === '.') continue; if (p === '..') st.pop(); else st.push(p); } return st.length ? '/' + st.join('/') : '/'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<string> podziel(const string &s) {
    vector<string> w;
    string nazwa = "";
    for (char c : s) {
        if (c == '/') {
            if (nazwa != "") w.push_back(nazwa);
            nazwa = "";
        } else nazwa += c;
    }
    if (nazwa != "") w.push_back(nazwa);
    return w;
}
string zlacz(const vector<string> &v) {
    if (v.empty()) return "/";
    string w = "";
    for (const string &x : v) w += "/" + x;
    return w;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        vector<string> stos;
        for (const string &x : podziel(s)) {
            if (x == ".") continue;
            if (x == "..") {
                if (!stos.empty()) stos.pop_back();
            } else stos.push_back(x);
        }
        cout << zlacz(stos) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-obrazek', krok: 7, level: 'srednie',
            title: 'Obrazek po przekształceniach',
            short: 'Obrót o 90°, lustro i odwrócenie do góry nogami — każda operacja to funkcja, która dostaje obrazek (vector<string>) i zwraca nowy.',
            tags: ['funkcja zwracająca vector<string>', 'const & na wejściu', 'obrót tablicy 2D'],
            statement: ['Obrazek ma n wierszy po m znaków. Polecenia: OBROT — obróć obrazek o 90° zgodnie z ruchem wskazówek zegara (będzie miał m wierszy po n znaków); LUSTRO — odbij każdy wiersz od lewej do prawej; GORA — odwróć kolejność wierszy (do góry nogami).',
                'Napisz funkcje vector<string> obroc(const vector<string> &a), vector<string> lustro(const vector<string> &a) i vector<string> doGory(const vector<string> &a). Każda zwraca nowy obrazek: obraz = obroc(obraz);. Wypisz obrazek po wszystkich poleceniach.'],
            input_format: ['W pierwszym wierszu n, m i k.', 'W n kolejnych wierszach obrazek.', 'W k kolejnych wierszach polecenia.'],
            output_format: ['Obrazek po wszystkich poleceniach.'],
            constraints: ['1 ≤ n, m ≤ 50, 1 ≤ k ≤ 1000', 'Obrazek składa się z liter, cyfr i znaków # . * + o'],
            examples: [{ input: '2 3 2\nabc\ndef\nOBROT\nLUSTRO', note: 'Po obrocie kolumny czytane od dołu stają się wierszami: da, eb, fc. Lustro odwraca każdy wiersz: ad, be, cf.' }],
            hint: R`W obroc nowy obrazek ma m wierszy po n znaków: vector<string> b(m, string(n, ' '));, a b[i][j] = a[n - 1 - j][i]. lustro: skopiuj a i każdy wiersz reverse(…). doGory: skopiuj a i reverse(b.begin(), b.end()). Parametr const & nie kopiuje obrazka przy wywołaniu, a wynik i tak budujesz w nowej zmiennej.`,
            tests: (r) => {
                const AL = 'abcdefghij0123456789#.*+o';
                const d = (n, m, k) => `${n} ${m} ${k}\n${Array.from({ length: n }, () => r.word(m, AL)).join('\n')}\n${Array.from({ length: k }, () => r.pick(['OBROT', 'LUSTRO', 'GORA'])).join('\n')}`;
                return ['1 1 1\nx\nOBROT', '2 3 4\nabc\ndef\nOBROT\nOBROT\nOBROT\nOBROT', '3 2 1\nab\ncd\nef\nGORA', d(4, 7, 10), d(50, 37, 1000), d(50, 50, 999)];
            },
            check: (inp) => { const L = linie(inp); const [n, m, k] = L[0].split(' ').map(Number); if (!calk(n, 1, 50) || !calk(m, 1, 50) || !calk(k, 1, 1000) || L.length !== n + k + 1) return 'n m k'; if (!L.slice(1, n + 1).every((w) => w.length === m && /^[A-Za-z0-9#.*+o]+$/.test(w))) return 'obrazek'; return L.slice(n + 1).every((p) => ['OBROT', 'LUSTRO', 'GORA'].includes(p)) ? null : 'polecenie'; },
            solve: (inp) => {
                const L = linie(inp); const [n] = L[0].split(' ').map(Number); let a = L.slice(1, n + 1);
                for (const p of L.slice(n + 1)) {
                    if (p === 'OBROT') { const N = a.length, M = a[0].length; a = Array.from({ length: M }, (_, i) => Array.from({ length: N }, (_, j) => a[N - 1 - j][i]).join('')); }
                    else if (p === 'LUSTRO') a = a.map((w) => w.split('').reverse().join(''));
                    else a = a.slice().reverse();
                }
                return a.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<string> obroc(const vector<string> &a) {
    int n = a.size(), m = a[0].size();
    vector<string> b(m, string(n, ' '));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) b[i][j] = a[n - 1 - j][i];
    return b;
}
vector<string> lustro(const vector<string> &a) {
    vector<string> b = a;
    for (string &w : b) reverse(w.begin(), w.end());
    return b;
}
vector<string> doGory(const vector<string> &a) {
    vector<string> b = a;
    reverse(b.begin(), b.end());
    return b;
}
int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<string> obraz(n);
    for (int i = 0; i < n; i++) cin >> obraz[i];
    for (int i = 0; i < k; i++) {
        string p;
        cin >> p;
        if (p == "OBROT") obraz = obroc(obraz);
        else if (p == "LUSTRO") obraz = lustro(obraz);
        else obraz = doGory(obraz);
    }
    for (const string &w : obraz) cout << w << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · przeciążanie, domyślne, podział zadania
        {
            id: 'fun-pola-figur', krok: 8, level: 'latwe',
            title: 'Pola figur',
            short: 'Trzy funkcje o tej samej nazwie pole: z jednym bokiem, z dwoma bokami i z promieniem typu double. Kompilator sam wybiera właściwą.',
            tags: ['przeciążanie funkcji', 'int i double', 'fixed i setprecision'],
            statement: ['Policz pola figur. K a — kwadrat o boku a; P a b — prostokąt o bokach a i b; O r — koło o promieniu r (pole π · r · r, z dwiema cyframi po kropce; przyjmij π = M_PI).',
                'Napisz trzy funkcje o tej samej nazwie: int pole(int a), int pole(int a, int b) i double pole(double r). Kompilator wybierze właściwą po liczbie i typach argumentów.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['q wierszy z polami: dla kwadratu i prostokąta liczba całkowita, dla koła liczba z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ a, b ≤ 10⁴', '1 ≤ r ≤ 1000 (r jest liczbą całkowitą)'],
            examples: [{ input: '3\nK 4\nP 3 5\nO 2', note: '4 · 4 = 16, 3 · 5 = 15, a π · 2 · 2 ≈ 12.566 — po zaokrągleniu 12.57.' }],
            hint: R`double pole(double r) { return M_PI * r * r; }. Promień wczytaj do zmiennej double r; — wtedy pole(r) wywoła wersję dla double, a pole(a) dla int a — wersję kwadratu. Dla koła: cout << fixed << setprecision(2) << pole(r) << "\n"; (fixed nie zmienia wypisywania liczb całkowitych).`,
            tests: (r) => {
                const rr = () => { for (;;) { const x = r.int(1, 1000); if (h.safe(Math.PI * x * x, 2)) return x; } };
                const pol = () => { const p = r(); return p < 0.33 ? `K ${r.int(1, 10000)}` : p < 0.66 ? `P ${r.int(1, 10000)} ${r.int(1, 10000)}` : `O ${rr()}`; };
                return ['1\nK 1', `4\nK 10000\nP 10000 10000\nP 1 10000\nO ${[1000, 999, 998, 997].find((x) => h.safe(Math.PI * x * x, 2))}`, `20\n${Array.from({ length: 20 }, pol).join('\n')}`, `1000\n${Array.from({ length: 1000 }, pol).join('\n')}`];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 1000) && L.length === q + 1 && L.slice(1).every((l) => { let m; if ((m = l.match(/^K (\d+)$/))) return calk(Number(m[1]), 1, 1e4); if ((m = l.match(/^P (\d+) (\d+)$/))) return calk(Number(m[1]), 1, 1e4) && calk(Number(m[2]), 1, 1e4); if ((m = l.match(/^O (\d+)$/))) return calk(Number(m[1]), 1, 1000); return false; }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [c, a, b] = l.split(' '); if (c === 'K') return Number(a) * Number(a); if (c === 'P') return Number(a) * Number(b); const x = Number(a); return h.fx(Math.PI * x * x, 2); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int pole(int a) {
    return a * a;
}
int pole(int a, int b) {
    return a * b;
}
double pole(double r) {
    return M_PI * r * r;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        char c;
        cin >> c;
        if (c == 'K') {
            int a;
            cin >> a;
            cout << pole(a) << "\n";
        } else if (c == 'P') {
            int a, b;
            cin >> a >> b;
            cout << pole(a, b) << "\n";
        } else {
            double r;
            cin >> r;
            cout << fixed << setprecision(2) << pole(r) << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-drukarka-typow', krok: 8, level: 'latwe',
            title: 'Drukarka różnych typów',
            short: 'Cztery funkcje wypisz: dla liczby, napisu, pary liczb i listy. Ta sama nazwa, różne parametry — przeciążanie w praktyce.',
            tags: ['przeciążanie funkcji', 'const vector<int> &', 'formatowanie wyniku'],
            statement: ['Drukarka dostaje polecenia: L x — liczba; N s — napis; P a b — para liczb; T n a₁ … aₙ — lista n liczb. Wypisuje je tak:',
                'liczba: x — napis: s (dlugosc k) — para: (a, b) — lista: [a₁, a₂, …, aₙ] (pusta lista to lista: []).',
                'Napisz cztery funkcje o nazwie wypisz: void wypisz(int x), void wypisz(string s), void wypisz(int a, int b) i void wypisz(const vector<int> &v).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['q wierszy w opisanych formatach.'],
            constraints: ['1 ≤ q ≤ 300', '−10⁶ ≤ x, a, b ≤ 10⁶', 'Napisy mają od 1 do 20 małych liter.', '0 ≤ n ≤ 10, −1000 ≤ aᵢ ≤ 1000'],
            examples: [{ input: '4\nL 42\nN kot\nP 3 -4\nT 3 1 2 3', note: 'Każde polecenie trafia do innej wersji funkcji wypisz — o wyborze decydują typy i liczba argumentów.' }],
            hint: R`void wypisz(string s) { cout << "napis: " << s << " (dlugosc " << s.size() << ")\n"; }. W wersji dla listy przecinek wypisuj przed każdym elementem oprócz pierwszego. Uwaga: wypisz('a') z literą w apostrofach wybrałoby wersję dla int (znak to liczba) — dlatego napis zawsze wczytuj do zmiennej string.`,
            tests: (r) => {
                const pol = () => { const p = r(); if (p < 0.25) return `L ${r.int(-1000000, 1000000)}`; if (p < 0.5) return `N ${r.word(r.int(1, 20))}`; if (p < 0.75) return `P ${r.int(-1000000, 1000000)} ${r.int(-1000000, 1000000)}`; const n = r.int(0, 10); return `T ${[n, ...r.arr(n, -1000, 1000)].join(' ')}`; };
                return ['1\nT 0', '4\nL -1000000\nN a\nP 0 0\nT 1 -1000', `20\n${Array.from({ length: 20 }, pol).join('\n')}`, `300\n${Array.from({ length: 300 }, pol).join('\n')}`];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 300) && L.length === q + 1 && L.slice(1).every((l) => { let m; if ((m = l.match(/^L (-?\d+)$/))) return calk(Number(m[1]), -1e6, 1e6); if ((m = l.match(/^N ([a-z]{1,20})$/))) return true; if ((m = l.match(/^P (-?\d+) (-?\d+)$/))) return calk(Number(m[1]), -1e6, 1e6) && calk(Number(m[2]), -1e6, 1e6); if ((m = l.match(/^T (\d+)((?: -?\d+)*)$/))) { const a = m[2].trim() ? m[2].trim().split(' ').map(Number) : []; return calk(Number(m[1]), 0, 10) && a.length === Number(m[1]) && a.every((x) => calk(x, -1000, 1000)); } return false; }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const t = l.split(' '); if (t[0] === 'L') return `liczba: ${t[1]}`; if (t[0] === 'N') return `napis: ${t[1]} (dlugosc ${t[1].length})`; if (t[0] === 'P') return `para: (${t[1]}, ${t[2]})`; return `lista: [${t.slice(2).join(', ')}]`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(int x) {
    cout << "liczba: " << x << "\n";
}
void wypisz(string s) {
    cout << "napis: " << s << " (dlugosc " << s.size() << ")\n";
}
void wypisz(int a, int b) {
    cout << "para: (" << a << ", " << b << ")\n";
}
void wypisz(const vector<int> &v) {
    cout << "lista: [";
    for (int i = 0; i < (int)v.size(); i++) {
        if (i > 0) cout << ", ";
        cout << v[i];
    }
    cout << "]\n";
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        char c;
        cin >> c;
        if (c == 'L') {
            int x;
            cin >> x;
            wypisz(x);
        } else if (c == 'N') {
            string s;
            cin >> s;
            wypisz(s);
        } else if (c == 'P') {
            int a, b;
            cin >> a >> b;
            wypisz(a, b);
        } else {
            int n;
            cin >> n;
            vector<int> v(n);
            for (int j = 0; j < n; j++) cin >> v[j];
            wypisz(v);
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-linie-domyslne', krok: 8, level: 'latwe',
            title: 'Linie z wartościami domyślnymi',
            short: 'void linia(int n = 10, char c = \'-\'): polecenie może podać obie wartości, tylko długość albo nic — brakujące biorą się z domyślnych.',
            tags: ['wartości domyślne parametrów', 'getline i stringstream', 'ile danych w wierszu'],
            statement: ['Każde polecenie to słowo LINIA, po którym mogą stać: nic, sama długość n albo długość n i znak c. Wypisz linię z n znaków c. Gdy znaku nie podano, użyj -, a gdy nie podano też długości — narysuj 10 znaków.',
                'Napisz jedną funkcję void linia(int n = 10, char c = \'-\') i wywołuj ją jako linia(), linia(n) albo linia(n, c) — zależnie od tego, ile danych było w wierszu.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['q wierszy z liniami.'],
            constraints: ['1 ≤ q ≤ 200', '1 ≤ n ≤ 80', 'c to jeden ze znaków # * = + o @ % x X & $'],
            examples: [{ input: '3\nLINIA\nLINIA 4\nLINIA 6 *', note: 'Bez danych: 10 znaków -. Z samą długością: 4 znaki -. Z obiema wartościami: 6 gwiazdek.' }],
            hint: R`Wiersz czytaj w całości: getline(cin, w); (po cin >> q pamiętaj o cin.ignore();), a potem stringstream ss(w); ss >> slowo;. if (!(ss >> n)) linia(); else if (!(ss >> c)) linia(n); else linia(n, c); — ss >> x zwraca fałsz, gdy w wierszu nie ma już danych. Wartości domyślne piszesz tylko w nagłówku funkcji.`,
            tests: (r) => {
                const Z = '#*=+o@%xX&$';
                const pol = () => { const p = r(); return p < 0.3 ? 'LINIA' : p < 0.6 ? `LINIA ${r.int(1, 80)}` : `LINIA ${r.int(1, 80)} ${r.pick(Z)}`; };
                return ['1\nLINIA', '3\nLINIA 80 #\nLINIA 1\nLINIA 10 x', `20\n${Array.from({ length: 20 }, pol).join('\n')}`, `200\n${Array.from({ length: 200 }, pol).join('\n')}`];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 200) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^LINIA(?: (\d+)(?: ([#*=+o@%xX&$]))?)?$/); return m && (m[1] === undefined || calk(Number(m[1]), 1, 80)); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const t = l.split(' '); return (t[2] || '-').repeat(t[1] ? Number(t[1]) : 10); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void linia(int n = 10, char c = '-') {
    for (int i = 0; i < n; i++) cout << c;
    cout << "\n";
}
int main() {
    int q;
    cin >> q;
    cin.ignore();
    for (int i = 0; i < q; i++) {
        string w, slowo;
        getline(cin, w);
        stringstream ss(w);
        ss >> slowo;
        int n;
        char c;
        if (!(ss >> n)) linia();
        else if (!(ss >> c)) linia(n);
        else linia(n, c);
    }
    return 0;
}`,
        },
        {
            id: 'fun-kalkulator-funkcji', krok: 8, level: 'srednie',
            title: 'Kalkulator z funkcjami',
            short: 'NWD, NWW, potęga, silnia i maksimum z dwóch albo trzech liczb — każde polecenie to jedna mała funkcja, a NWW i MAKS3 korzystają z innych.',
            tags: ['wiele małych funkcji', 'funkcja korzysta z funkcji', 'przeciążanie po liczbie parametrów'],
            statement: ['Kalkulator obsługuje polecenia: NWD a b, NWW a b, POT a b (a do potęgi b), SILNIA n, MAKS2 a b oraz MAKS3 a b c.',
                'Napisz osobną funkcję dla każdego działania. NWW policz jako a / nwd(a, b) · b. Dla maksimum napisz dwie funkcje o tej samej nazwie: long long maks(long long a, long long b) i long long maks(long long a, long long b, long long c) — ta druga niech wywołuje pierwszą.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['q wierszy z wynikami.'],
            constraints: ['1 ≤ q ≤ 1000', 'NWD: 1 ≤ a, b ≤ 10¹⁸; NWW: 1 ≤ a, b ≤ 10⁹', 'POT: −10 ≤ a ≤ 10, 0 ≤ b ≤ 18; SILNIA: 0 ≤ n ≤ 20', 'MAKS2, MAKS3: liczby od −10¹⁸ do 10¹⁸'],
            examples: [{ input: '5\nNWD 12 18\nNWW 4 6\nPOT -2 5\nSILNIA 5\nMAKS3 3 -7 10', note: 'NWD(12, 18) = 6; NWW(4, 6) = 4 / 2 · 6 = 12; (−2)⁵ = −32; 5! = 120; największa z 3, −7 i 10 to 10.' }],
            hint: R`long long nww(long long a, long long b) { return a / nwd(a, b) * b; } — najpierw dzielenie, potem mnożenie, żeby nie przekroczyć zakresu. long long maks(long long a, long long b, long long c) { return maks(maks(a, b), c); } — kompilator po liczbie argumentów wie, która wersja ma się wywołać. 0! = 1, a a⁰ = 1.`,
            tests: (r) => {
                const big = () => String(r.big(1, 10n ** 18n));
                const sb = () => String(r.big(-(10n ** 18n), 10n ** 18n));
                const pol = () => { const p = r.int(0, 5); if (p === 0) return `NWD ${big()} ${big()}`; if (p === 1) return `NWW ${r.int(1, 1e9)} ${r.int(1, 1e9)}`; if (p === 2) return `POT ${r.int(-10, 10)} ${r.int(0, 18)}`; if (p === 3) return `SILNIA ${r.int(0, 20)}`; if (p === 4) return `MAKS2 ${sb()} ${sb()}`; return `MAKS3 ${sb()} ${sb()} ${sb()}`; };
                return ['1\nSILNIA 0', '6\nPOT 10 18\nPOT -10 17\nPOT 0 0\nNWW 1000000000 999999999\nSILNIA 20\nMAKS3 -1000000000000000000 -1000000000000000000 -999999999999999999', `30\n${Array.from({ length: 30 }, pol).join('\n')}`, `1000\n${Array.from({ length: 1000 }, pol).join('\n')}`];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                const B = (s, lo, hi) => /^-?\d+$/.test(s) && BigInt(s) >= lo && BigInt(s) <= hi; const E = 10n ** 18n;
                return L.slice(1).every((l) => { const t = l.split(' '); switch (t[0]) { case 'NWD': return t.length === 3 && B(t[1], 1n, E) && B(t[2], 1n, E); case 'NWW': return t.length === 3 && B(t[1], 1n, 10n ** 9n) && B(t[2], 1n, 10n ** 9n); case 'POT': return t.length === 3 && B(t[1], -10n, 10n) && B(t[2], 0n, 18n); case 'SILNIA': return t.length === 2 && B(t[1], 0n, 20n); case 'MAKS2': return t.length === 3 && B(t[1], -E, E) && B(t[2], -E, E); case 'MAKS3': return t.length === 4 && t.slice(1).every((x) => B(x, -E, E)); default: return false; } }) ? null : 'polecenie';
            },
            solve: (inp) => linie(inp).slice(1).map((l) => {
                const t = l.split(' '); const v = t.slice(1).map(BigInt);
                switch (t[0]) {
                    case 'NWD': return String(nwdBig(v[0], v[1]));
                    case 'NWW': return String((v[0] / nwdBig(v[0], v[1])) * v[1]);
                    case 'POT': return String(v[0] ** v[1]);
                    case 'SILNIA': { let w = 1n; for (let i = 2n; i <= v[0]; i++) w *= i; return String(w); }
                    default: return String(v.reduce((a, b) => (a > b ? a : b)));
                }
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
long long nww(long long a, long long b) {
    return a / nwd(a, b) * b;
}
long long potega(long long a, int b) {
    long long w = 1;
    for (int i = 0; i < b; i++) w *= a;
    return w;
}
long long silnia(int n) {
    long long w = 1;
    for (int i = 2; i <= n; i++) w *= i;
    return w;
}
long long maks(long long a, long long b) {
    if (a > b) return a;
    return b;
}
long long maks(long long a, long long b, long long c) {
    return maks(maks(a, b), c);
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "NWD" || p == "NWW" || p == "MAKS2") {
            long long a, b;
            cin >> a >> b;
            if (p == "NWD") cout << nwd(a, b) << "\n";
            else if (p == "NWW") cout << nww(a, b) << "\n";
            else cout << maks(a, b) << "\n";
        } else if (p == "POT") {
            long long a;
            int b;
            cin >> a >> b;
            cout << potega(a, b) << "\n";
        } else if (p == "SILNIA") {
            int n;
            cin >> n;
            cout << silnia(n) << "\n";
        } else {
            long long a, b, c;
            cin >> a >> b >> c;
            cout << maks(a, b, c) << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-roznica-dat', krok: 8, level: 'srednie',
            title: 'Ile dni między datami?',
            short: 'Zamień każdą datę na numer dnia od początku kalendarza — wtedy odległość dat to zwykłe odejmowanie. Trzy małe funkcje składają się w jedną dużą.',
            tags: ['rozbijanie zadania na funkcje', 'funkcja woła funkcję', 'long long'],
            statement: ['Dla każdej pary poprawnych dat policz, ile dni je dzieli (w kalendarzu gregoriańskim, także „wstecz” — dla lat od 1 do 9999).',
                'Rozbij zadanie na funkcje: bool przestepny(int r), int dniWMiesiacu(int m, int r) i long long numerDnia(int d, int m, int r), która mówi, którym dniem od 1 stycznia roku 1 (ten dzień ma numer 1) jest podana data. Odpowiedź to różnica numerów.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy dwie daty: d₁ m₁ r₁ d₂ m₂ r₂.'],
            output_format: ['q wierszy: liczba dni między datami (zawsze nieujemna).'],
            constraints: ['1 ≤ q ≤ 1000', 'Daty są poprawne, lata od 1 do 9999.'],
            examples: [{ input: '2\n1 1 2024 1 3 2024\n31 12 1999 1 1 2000', note: 'Styczeń 2024 ma 31 dni, a luty (rok przestępny) 29 — razem 60. Od sylwestra do Nowego Roku jest 1 dzień.' }],
            hint: R`long long numerDnia(int d, int m, int r) { long long n = 0; for (int i = 1; i < r; i++) n += przestepny(i) ? 366 : 365; for (int i = 1; i < m; i++) n += dniWMiesiacu(i, r); return n + d; } — pętla po latach do 9999 jest wystarczająco szybka. Wynik: abs(numerDnia(…drugiej…) - numerDnia(…pierwszej…)).`,
            tests: (r) => {
                const data = (lo, hi) => { for (;;) { const rr = r.int(lo, hi), m = r.int(1, 12), d = r.int(1, 31); if (czyPoprawnaData(d, m, rr)) return [d, m, rr]; } };
                const d = (a) => `${a.length}\n${a.map((x) => x.flat().join(' ')).join('\n')}`;
                return [d([[[1, 1, 1], [1, 1, 1]]]), d([[[1, 1, 1], [31, 12, 9999]], [[28, 2, 1900], [1, 3, 1900]], [[28, 2, 2000], [1, 3, 2000]], [[1, 3, 2024], [1, 1, 2024]]]), d(Array.from({ length: 30 }, () => [data(2000, 2030), data(2000, 2030)])), d(Array.from({ length: 1000 }, () => [data(1, 9999), data(1, 9999)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1000) || t.length !== 6 * t[0] + 1) return 'q'; for (let i = 1; i < t.length; i += 3) if (!czyPoprawnaData(t[i], t[i + 1], t[i + 2]) || t[i + 2] > 9999) return 'data'; return null; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 1; i < t.length; i += 6) o.push(Math.abs(numerDnia(t[i + 3], t[i + 4], t[i + 5]) - numerDnia(t[i], t[i + 1], t[i + 2]))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool przestepny(int r) {
    return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
}
int dniWMiesiacu(int m, int r) {
    if (m == 2) return przestepny(r) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}
long long numerDnia(int d, int m, int r) {
    long long n = 0;
    for (int i = 1; i < r; i++) n += przestepny(i) ? 366 : 365;
    for (int i = 1; i < m; i++) n += dniWMiesiacu(i, r);
    return n + d;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int d1, m1, r1, d2, m2, r2;
        cin >> d1 >> m1 >> r1 >> d2 >> m2 >> r2;
        cout << llabs(numerDnia(d2, m2, r2) - numerDnia(d1, m1, r1)) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-kalkulator-ulamkow', krok: 8, level: 'srednie',
            title: 'Kalkulator ułamków',
            short: 'a/b + c/d, a także −, · i : — z wynikiem skróconym i minusem zawsze w liczniku. Każde działanie oddaje parę (licznik, mianownik) przez skroc.',
            tags: ['funkcje zwracające pair', 'NWD', 'rozbijanie zadania na funkcje'],
            statement: ['Każdy wiersz to działanie na dwóch ułamkach: a/b op c/d, gdzie op to +, -, * albo : (dzielenie). Wypisz wynik w postaci nieskracalnej p/q z mianownikiem dodatnim (minus, jeśli jest, stoi przy liczniku; zero to 0/1).',
                'Napisz funkcje long long nwd(long long a, long long b), pair<long long, long long> skroc(long long l, long long m) oraz po jednej funkcji na każde działanie — każda niech zwraca wynik przez skroc.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy działanie w formacie a/b op c/d (spacje tylko wokół znaku działania).'],
            output_format: ['q wierszy z wynikami w postaci p/q.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁴ ≤ a, c ≤ 10⁴, 1 ≤ b, d ≤ 10⁴', 'Przy dzieleniu c ≠ 0.'],
            examples: [{ input: '3\n1/2 + 1/3\n3/4 - 5/4\n2/3 : -4/9', note: '1/2 + 1/3 = 5/6. 3/4 − 5/4 = −2/4 = −1/2. 2/3 : (−4/9) = 2/3 · 9/(−4) = 18/(−12) = −3/2.' }],
            hint: R`skroc: if (m < 0) { l = -l; m = -m; } long long g = nwd(abs(l), m); return {l / g, m / g}; — dla l = 0 nwd(0, m) = m i wychodzi 0/1. Dzielenie to mnożenie przez odwrotność: {a * d, b * c} i skroc. Ułamek wczytasz tak: cin >> a >> kreska >> b;, gdzie kreska to char.`,
            tests: (r) => {
                const u = (mx) => `${r.int(-mx, mx)}/${r.int(1, mx)}`;
                const dz = (mx) => { for (;;) { const s = u(mx); if (!s.startsWith('0/')) return s; } };
                const pol = (mx) => { const op = r.pick(['+', '-', '*', ':']); return `${u(mx)} ${op} ${op === ':' ? dz(mx) : u(mx)}`; };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['0/1 + 0/1']), d(['10000/1 * 10000/1', '-10000/10000 : 1/10000', '1/9999 - 1/10000', '7/7 : -7/7', '0/5 * -3/4', '1/2 - 1/2']), d(Array.from({ length: 40 }, () => pol(10))), d(Array.from({ length: 1000 }, () => pol(10000)))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 1000) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^(-?\d+)\/(\d+) ([-+*:]) (-?\d+)\/(\d+)$/); return m && calk(Number(m[1]), -1e4, 1e4) && calk(Number(m[2]), 1, 1e4) && calk(Number(m[4]), -1e4, 1e4) && calk(Number(m[5]), 1, 1e4) && !(m[3] === ':' && Number(m[4]) === 0); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => {
                const m = l.match(/^(-?\d+)\/(\d+) ([-+*:]) (-?\d+)\/(\d+)$/); const [a, b, c, d] = [m[1], m[2], m[4], m[5]].map(BigInt);
                let p, q; if (m[3] === '+') { p = a * d + c * b; q = b * d; } else if (m[3] === '-') { p = a * d - c * b; q = b * d; } else if (m[3] === '*') { p = a * c; q = b * d; } else { p = a * d; q = b * c; }
                if (q < 0n) { p = -p; q = -q; } const g = nwdBig(p, q); return `${p / g}/${q / g}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
pair<long long, long long> skroc(long long l, long long m) {
    if (m < 0) {
        l = -l;
        m = -m;
    }
    long long g = nwd(llabs(l), m);
    return {l / g, m / g};
}
pair<long long, long long> dodaj(long long a, long long b, long long c, long long d) {
    return skroc(a * d + c * b, b * d);
}
pair<long long, long long> odejmij(long long a, long long b, long long c, long long d) {
    return skroc(a * d - c * b, b * d);
}
pair<long long, long long> pomnoz(long long a, long long b, long long c, long long d) {
    return skroc(a * c, b * d);
}
pair<long long, long long> podziel(long long a, long long b, long long c, long long d) {
    return skroc(a * d, b * c);
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b, c, d;
        char k1, op, k2;
        cin >> a >> k1 >> b >> op >> c >> k2 >> d;
        pair<long long, long long> w;
        if (op == '+') w = dodaj(a, b, c, d);
        else if (op == '-') w = odejmij(a, b, c, d);
        else if (op == '*') w = pomnoz(a, b, c, d);
        else w = podziel(a, b, c, d);
        cout << w.first << "/" << w.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-cztery-w-rzedzie', krok: 8, level: 'srednie',
            title: 'Cztery w rzędzie',
            short: 'Gra na planszy 6 × 7: krążki spadają na dół kolumny, wygrywa cztery w linii. wrzuc, policz w jednym kierunku i wygrana — trzy funkcje zamiast jednej plątaniny.',
            tags: ['rozbijanie zadania na funkcje', 'plansza globalna', 'kierunki dr, dc'],
            statement: ['Plansza ma 6 wierszy i 7 kolumn. Gracze X (zaczyna) i O na zmianę wrzucają krążek do wybranej kolumny — krążek spada na najniższe wolne pole. Gracz wygrywa, gdy jego cztery krążki stoją obok siebie w poziomie, w pionie albo po skosie.',
                'Dla każdej gry podano ruchy (numery kolumn od 1 do 7, zawsze do kolumny, która nie jest pełna). Gra kończy się przy pierwszej wygranej — po niej nie ma już ruchów. Wypisz X wygrywa w ruchu k albo O wygrywa w ruchu k, a jeśli nikt nie wygrał: REMIS przy pełnej planszy (42 ruchy) albo GRA TRWA.',
                'Napisz funkcje: int wrzuc(int kol, char g) (zwraca wiersz, w którym wylądował krążek), int policz(int r, int c, int dr, int dc, char g) (ile krążków g stoi w linii od pola obok (r, c) w kierunku (dr, dc)) i bool wygrana(int r, int c, char g).'],
            input_format: ['W pierwszym wierszu t.', 'Każda gra: wiersz z liczbą ruchów k i wiersz z k numerami kolumn.'],
            output_format: ['t wierszy z wynikami gier.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ k ≤ 42'],
            examples: [{ input: '2\n7\n1 2 1 2 1 2 1\n3\n4 4 5', note: 'W pierwszej grze X buduje pionową czwórkę w kolumnie 1 — w swoim czwartym ruchu, czyli siódmym ruchu gry. Druga gra jeszcze się nie skończyła.' }],
            hint: R`Globalnie char p[6][7]; — wyczyść ją przed każdą grą. wygrana: dla czterech kierunków (0, 1), (1, 0), (1, 1), (1, −1) sprawdź, czy 1 + policz(r, c, dr, dc, g) + policz(r, c, -dr, -dc, g) >= 4. W policz idziesz krokami r += dr, c += dc, dopóki pole jest na planszy i ma krążek g.`,
            tests: (r) => {
                const gra = (maks) => {
                    const p = Array.from({ length: 6 }, () => Array(7).fill('.')); const ruchy = [];
                    const ile = (rr, c, dr, dc, g) => { let k = 0; rr += dr; c += dc; while (rr >= 0 && rr < 6 && c >= 0 && c < 7 && p[rr][c] === g) { k++; rr += dr; c += dc; } return k; };
                    for (let i = 0; i < maks; i++) {
                        const wolne = [0, 1, 2, 3, 4, 5, 6].filter((c) => p[0][c] === '.'); if (!wolne.length) break;
                        const c = r() < 0.5 ? r.pick(wolne) : r.pick(wolne.filter((x) => Math.abs(x - 3) <= 1).concat(wolne)); const g = i % 2 ? 'O' : 'X';
                        let rr = 5; while (p[rr][c] !== '.') rr--; p[rr][c] = g; ruchy.push(c + 1);
                        if ([[0, 1], [1, 0], [1, 1], [1, -1]].some(([dr, dc]) => 1 + ile(rr, c, dr, dc, g) + ile(rr, c, -dr, -dc, g) >= 4)) break;
                    }
                    return ruchy;
                };
                const d = (G) => `${G.length}\n${G.map((g) => `${g.length}\n${g.join(' ')}`).join('\n')}`;
                const remisy = []; for (let k = 0; k < 4000 && remisy.length < 2; k++) { const g = gra(42); if (g.length === 42) remisy.push(g); }
                return [d([[4]]), d([[1, 2, 1, 2, 1, 2, 1], [1, 1, 2, 2, 3, 3, 4], [1, 2, 2, 3, 3, 4, 3, 4, 4, 5, 4], [7, 6, 6, 5, 5, 4, 5, 4, 4, 1, 4]]), d(Array.from({ length: 30 }, () => gra(r.int(1, 42)))), d([...Array.from({ length: 98 }, () => gra(42)), ...remisy.slice(0, 2)]), d([gra(42), gra(42)])];
            },
            check: (inp) => { const t = nums(inp); let i = 1; if (!calk(t[0], 1, 100)) return 't'; for (let g = 0; g < t[0]; g++) { const k = t[i++]; if (!calk(k, 1, 42)) return 'k'; const h2 = Array(8).fill(0); for (let j = 0; j < k; j++) { const c = t[i++]; if (!calk(c, 1, 7) || ++h2[c] > 6) return 'kolumna'; } } return i === t.length ? null : 'dlugosc'; },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const o = [];
                for (let g = 0; g < t[0]; g++) {
                    const k = t[i++]; const ruchy = t.slice(i, i + k); i += k; const p = Array.from({ length: 6 }, () => Array(7).fill('.'));
                    const ile = (rr, c, dr, dc, z) => { let n = 0; rr += dr; c += dc; while (rr >= 0 && rr < 6 && c >= 0 && c < 7 && p[rr][c] === z) { n++; rr += dr; c += dc; } return n; };
                    let w = null;
                    for (let j = 0; j < k && !w; j++) { const c = ruchy[j] - 1, z = j % 2 ? 'O' : 'X'; let rr = 5; while (p[rr][c] !== '.') rr--; p[rr][c] = z; if ([[0, 1], [1, 0], [1, 1], [1, -1]].some(([dr, dc]) => 1 + ile(rr, c, dr, dc, z) + ile(rr, c, -dr, -dc, z) >= 4)) w = `${z} wygrywa w ruchu ${j + 1}`; }
                    o.push(w || (k === 42 ? 'REMIS' : 'GRA TRWA'));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
char p[6][7];
int wrzuc(int kol, char g) {
    int r = 5;
    while (p[r][kol] != '.') r--;
    p[r][kol] = g;
    return r;
}
int policz(int r, int c, int dr, int dc, char g) {
    int k = 0;
    r += dr;
    c += dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && p[r][c] == g) {
        k++;
        r += dr;
        c += dc;
    }
    return k;
}
bool wygrana(int r, int c, char g) {
    int kier[4][2] = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
    for (int i = 0; i < 4; i++) {
        int dr = kier[i][0], dc = kier[i][1];
        if (1 + policz(r, c, dr, dc, g) + policz(r, c, -dr, -dc, g) >= 4) return true;
    }
    return false;
}
int main() {
    int t;
    cin >> t;
    for (int gra = 0; gra < t; gra++) {
        for (int r = 0; r < 6; r++)
            for (int c = 0; c < 7; c++) p[r][c] = '.';
        int k;
        cin >> k;
        vector<int> ruchy(k);
        for (int i = 0; i < k; i++) cin >> ruchy[i];
        string wynik = "";
        for (int i = 0; i < k && wynik == ""; i++) {
            char g = (i % 2 == 0) ? 'X' : 'O';
            int kol = ruchy[i] - 1;
            int r = wrzuc(kol, g);
            if (wygrana(r, kol, g)) wynik = string(1, g) + " wygrywa w ruchu " + to_string(i + 1);
        }
        if (wynik == "") wynik = (k == 42) ? "REMIS" : "GRA TRWA";
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-przecinanie-odcinkow', krok: 8, level: 'trudne',
            title: 'Czy odcinki się przecinają?',
            short: 'Klasyka geometrii: kierunek skrętu z iloczynu wektorowego, sprawdzenie „czy punkt leży na odcinku” i jedna funkcja, która składa z nich odpowiedź.',
            tags: ['iloczyn wektorowy w long long', 'funkcja zwracająca znak', 'przypadki szczególne'],
            statement: ['Dla każdej pary odcinków na płaszczyźnie sprawdź, czy mają choć jeden punkt wspólny (także gdy tylko stykają się końcem albo leżą na jednej prostej i zachodzą na siebie). Odcinek może być pojedynczym punktem.',
                'Iloczyn wektorowy (b − a) × (c − a) = (bx − ax)(cy − ay) − (by − ay)(cx − ax) mówi, po której stronie prostej ab leży c: dodatni — po lewej, ujemny — po prawej, zero — na prostej. Napisz int kierunek(…) zwracającą 1, −1 albo 0, bool naOdcinku(…) i bool przecinaja(…).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy osiem liczb: x1 y1 x2 y2 (pierwszy odcinek) i x3 y3 x4 y4 (drugi odcinek).'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁹ ≤ współrzędne ≤ 10⁹'],
            examples: [{ input: '4\n0 0 4 4 0 4 4 0\n0 0 2 2 3 3 5 5\n0 0 2 2 2 2 5 0\n0 0 4 0 1 0 3 0', note: 'Przekątne kwadratu krzyżują się. Drugie odcinki leżą na jednej prostej, ale się nie stykają. Trzecie stykają się w punkcie (2, 2). Czwarte zachodzą na siebie.' }],
            hint: R`int kierunek(long long ax, long long ay, long long bx, long long by, long long cx, long long cy) { long long w = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); return (w > 0) - (w < 0); }. Odcinki się przecinają, gdy d1 = kierunek(p3, p4, p1) i d2 = kierunek(p3, p4, p2) mają różne znaki i tak samo d3, d4 dla p1, p2 — albo gdy któryś kierunek to 0, a punkt leży na drugim odcinku (naOdcinku sprawdza, czy mieści się w prostokącie wyznaczonym przez końce).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (m) => Array.from({ length: 8 }, () => r.int(-m, m));
                const naProstej = () => { const [x, y, dx, dy] = [r.int(-1000, 1000), r.int(-1000, 1000), r.int(-3, 3), r.int(-3, 3)]; const k = () => r.int(-5, 5); const [a, b, c, e] = [k(), k(), k(), k()]; return [x + a * dx, y + a * dy, x + b * dx, y + b * dy, x + c * dx, y + c * dy, x + e * dx, y + e * dy]; };
                const E = 1000000000;
                const reczne = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 1], [1, 1, 1, 1, 0, 0, 2, 2], [-E, -E, E, E, -E, E, E, -E], [-E, -E, E, E, -E + 1, -E, E, E - 1], [-E, 0, E, 0, 0, -E, 0, -1], [-E, 0, E, 0, 0, -E, 0, 0], [E, E, E, E, -E, -E, E, E], [0, 0, 5, 0, 5, 0, 5, 5], [0, 0, 5, 0, 6, 0, 9, 0], [0, 0, 5, 0, 5, 0, 9, 0], [3, 3, 3, 3, 3, 3, 3, 3]];
                return [d([[0, 0, 1, 1, 0, 1, 1, 0]]), d(reczne), d(Array.from({ length: 300 }, () => los(3))), d(Array.from({ length: 1000 }, () => (r() < 0.4 ? naProstej() : r() < 0.5 ? los(E) : los(10)))), d(Array.from({ length: 1000 }, () => los(E)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === 8 * t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp).slice(1).map(BigInt); const o = [];
                const kier = (ax, ay, bx, by, cx, cy) => { const w = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); return w > 0n ? 1 : w < 0n ? -1 : 0; };
                const mn = (a, b) => (a < b ? a : b), mx = (a, b) => (a > b ? a : b);
                const na = (ax, ay, bx, by, cx, cy) => mn(ax, bx) <= cx && cx <= mx(ax, bx) && mn(ay, by) <= cy && cy <= mx(ay, by);
                for (let i = 0; i < t.length; i += 8) {
                    const [x1, y1, x2, y2, x3, y3, x4, y4] = t.slice(i, i + 8);
                    const d1 = kier(x3, y3, x4, y4, x1, y1), d2 = kier(x3, y3, x4, y4, x2, y2), d3 = kier(x1, y1, x2, y2, x3, y3), d4 = kier(x1, y1, x2, y2, x4, y4);
                    let ok = d1 * d2 < 0 && d3 * d4 < 0;
                    if (d1 === 0 && na(x3, y3, x4, y4, x1, y1)) ok = true;
                    if (d2 === 0 && na(x3, y3, x4, y4, x2, y2)) ok = true;
                    if (d3 === 0 && na(x1, y1, x2, y2, x3, y3)) ok = true;
                    if (d4 === 0 && na(x1, y1, x2, y2, x4, y4)) ok = true;
                    o.push(ok ? 'TAK' : 'NIE');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int kierunek(long long ax, long long ay, long long bx, long long by, long long cx, long long cy) {
    long long w = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (w > 0) return 1;
    if (w < 0) return -1;
    return 0;
}
bool naOdcinku(long long ax, long long ay, long long bx, long long by, long long cx, long long cy) {
    return min(ax, bx) <= cx && cx <= max(ax, bx) && min(ay, by) <= cy && cy <= max(ay, by);
}
bool przecinaja(long long x1, long long y1, long long x2, long long y2, long long x3, long long y3, long long x4, long long y4) {
    int d1 = kierunek(x3, y3, x4, y4, x1, y1);
    int d2 = kierunek(x3, y3, x4, y4, x2, y2);
    int d3 = kierunek(x1, y1, x2, y2, x3, y3);
    int d4 = kierunek(x1, y1, x2, y2, x4, y4);
    if (d1 * d2 < 0 && d3 * d4 < 0) return true;
    if (d1 == 0 && naOdcinku(x3, y3, x4, y4, x1, y1)) return true;
    if (d2 == 0 && naOdcinku(x3, y3, x4, y4, x2, y2)) return true;
    if (d3 == 0 && naOdcinku(x1, y1, x2, y2, x3, y3)) return true;
    if (d4 == 0 && naOdcinku(x1, y1, x2, y2, x4, y4)) return true;
    return false;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x1, y1, x2, y2, x3, y3, x4, y4;
        cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3 >> x4 >> y4;
        cout << (przecinaja(x1, y1, x2, y2, x3, y3, x4, y4) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
    ];
};
