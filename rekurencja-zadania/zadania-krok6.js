// Krok 6 · Dziel i zwyciężaj.
module.exports = (h) => {
    const { reader } = h;
    const many = (t, gen) => `${t}\n` + Array.from({ length: t }, gen).join('\n');
    const arrT = (r, n, lo, hi) => `${n}\n${r.arr(n, lo, hi).join(' ')}`;
    const DZIEL = 'Rozwiąż to metodą „dziel i zwyciężaj”: podziel problem na dwie połowy, rozwiąż każdą rekurencyjnie i połącz wyniki.';
    const powmod = (a, b, m) => { a %= m; let r = 1n % m; while (b > 0n) { if (b & 1n) r = (r * a) % m; a = (a * a) % m; b >>= 1n; } return r; };
    const fibLen = [0n, 1n, 1n];
    for (let i = 3; i <= 90; i++) fibLen.push(fibLen[i - 1] + fibLen[i - 2]);

    return [
        // ------------------------------------------------------------ 1
        {
            id: 'rek-min-maks-dziel',
            title: 'Minimum i maksimum przez połowienie',
            level: 'latwe',
            statement: [
                'Wczytaj n liczb i wypisz najmniejszą i największą z nich.',
                'Rozgrzewka przed prawdziwym „dziel i zwyciężaj”: napisz funkcję pair<int, int> minmaks(int l, int r), która dla fragmentu a[l..r] dzieli go na dwie połowy, rekurencyjnie znajduje minimum i maksimum każdej połowy, a potem je łączy. Fragment jednoelementowy jest warunkiem stopu.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, …, aₙ₋₁.'],
            output_format: ['Wypisz dwie liczby oddzielone spacją: najmniejszy i największy element.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '6\n3 -1 4 1 5 9', note: 'Lewa połowa 3 −1 4 ma minimum −1 i maksimum 4, prawa 1 5 9 — minimum 1 i maksimum 9. Razem: min(−1, 1) = −1 i max(4, 9) = 9.' }],
            hint: 'if (l == r) return {a[l], a[l]}; int s = (l + r) / 2; auto L = minmaks(l, s); auto R = minmaks(s + 1, r); return {min(L.first, R.first), max(L.second, R.second)};. Głębokość rekurencji to tylko ok. log₂ n, bo fragment za każdym razem maleje o połowę.',
            tests: (r) => ['1\n7', '2\n5 -5', '5\n1 1 1 1 1', arrT(r, 10, -9, 9), arrT(r, 100, -1e9, 1e9), arrT(r, 5000, -1e9, 1e9), arrT(r, 5000, 0, 1), arrT(r, 4097, -1e6, 1e6)],
            solve: (inp) => { const a = h.nums(inp).slice(1); return `${Math.min(...a)} ${Math.max(...a)}`; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int a[5005];
pair<int, int> minmaks(int l, int r) {
    if (l == r) return {a[l], a[l]};
    int s = (l + r) / 2;
    auto L = minmaks(l, s);
    auto R = minmaks(s + 1, r);
    return {min(L.first, R.first), max(L.second, R.second)};
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    auto w = minmaks(0, n - 1);
    cout << w.first << " " << w.second << "\n";
}`,
        },
        // ------------------------------------------------------------ 2
        {
            id: 'rek-szybkie-potegowanie',
            title: 'Szybkie potęgowanie',
            level: 'srednie',
            statement: [
                'Dla każdego zapytania policz aᵇ mod m — resztę z dzielenia aᵇ przez m. Wykładnik b może być ogromny, aż do 10¹⁸, więc mnożenie b razy nie wchodzi w grę.',
                'Pomysł: a¹⁰⁰ = (a⁵⁰)², a a⁵⁰ = (a²⁵)², a a²⁵ = a · (a¹²)². Za każdym razem wykładnik maleje o połowę, więc wystarczy ok. 60 kroków. Liczymy cały czas modulo m, żeby liczby nie urosły.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się trzy liczby całkowite a, b i m.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu wartość aᵇ mod m.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ a, b ≤ 10¹⁸', '1 ≤ m ≤ 10⁹'],
            examples: [{ input: '3\n2 10 1000\n3 0 7\n2 1000000000000000000 1000000007', note: '2¹⁰ = 1024, a 1024 mod 1000 = 24. Cokolwiek do potęgi 0 to 1.' }],
            hint: 'long long potega(long long a, long long b): if (b == 0) return 1 % m; long long p = potega(a, b / 2); p = p * p % m; if (b % 2 == 1) p = p * (a % m) % m; return p;. Wywołanie potega(a, b / 2) zrób tylko RAZ i zapisz w zmiennej — dwa takie wywołania zepsułyby całą szybkość. Uwaga na m = 1: wtedy każdy wynik to 0. Iloczyny reszt są mniejsze niż 10¹⁸, więc mieszczą się w long long.',
            tests: (r) => ['5\n0 0 7\n0 5 7\n5 0 1\n10 10 1\n1000000000000000000 1000000000000000000 1000000000',
                '4\n2 62 1000000000\n3 1000000000000000000 999999937\n123456789 987654321 1000000007\n999999999999999999 2 1000000000',
                many(1000, () => `${r.big(0, '1000000000000000000')} ${r.big(0, '1000000000000000000')} ${r.int(1, 1e9)}`),
                many(200, () => `${r.int(0, 100)} ${r.int(0, 100)} ${r.int(1, 1000)}`)],
            solve: (inp) => { const t = h.toks(inp); const o = []; for (let i = 1; i < t.length; i += 3) o.push(String(powmod(BigInt(t[i]), BigInt(t[i + 1]), BigInt(t[i + 2])))); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long m;
long long potega(long long a, long long b) {
    if (b == 0) return 1 % m;
    long long p = potega(a, b / 2);
    p = p * p % m;
    if (b % 2 == 1) p = p * (a % m) % m;
    return p;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b >> m;
        cout << potega(a, b) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 3
        {
            id: 'rek-wyszukiwanie-binarne',
            title: 'Wyszukiwanie binarne',
            level: 'srednie',
            statement: [
                'Dana jest rosnąca tablica n różnych liczb i q pytań. Dla każdej liczby x z pytania wypisz jej pozycję w tablicy (numerowaną od 1) albo −1, jeśli jej tam nie ma.',
                'Zamiast przeglądać całą tablicę, spójrz na środkowy element: jeśli to x — znalazłeś; jeśli jest większy od x — x może być tylko w lewej połowie; jeśli mniejszy — tylko w prawej. Funkcja szukaj(l, r, x) przeszukuje fragment a[l..r] i woła samą siebie tylko dla jednej połowy.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i q.', 'W drugim wierszu znajduje się n liczb całkowitych a₁ < a₂ < … < aₙ.', 'W trzecim wierszu znajduje się q liczb całkowitych — pytania.'],
            output_format: ['Dla każdego pytania wypisz w osobnym wierszu pozycję liczby albo −1.'],
            constraints: ['1 ≤ n, q ≤ 5000', '−10⁹ ≤ aᵢ, x ≤ 10⁹'],
            examples: [{ input: '6 4\n1 3 5 7 9 11\n7\n1\n4\n11', note: 'Szukając 7: środek fragmentu 1..6 to pozycja 3 (liczba 5 < 7), więc szukamy w 4..6; jego środek to pozycja 5 (liczba 9 > 7), więc szukamy w 4..4 — i jest: pozycja 4.' }],
            hint: 'int szukaj(int l, int r, int x): if (l > r) return -1; int s = (l + r) / 2; if (a[s] == x) return s; if (a[s] > x) return szukaj(l, s - 1, x); return szukaj(s + 1, r, x);. Każde wywołanie zmniejsza fragment co najmniej o połowę, więc dla n = 5000 wystarczy ok. 13 kroków.',
            tests: (r) => {
                const T = (n, q) => { const s = new Set(); while (s.size < n) s.add(r.int(-1e9, 1e9)); const a = [...s].sort((x, y) => x - y); const qs = Array.from({ length: q }, () => (r() < 0.5 ? r.pick(a) : r.int(-1e9, 1e9))); return `${n} ${q}\n${a.join(' ')}\n${qs.join('\n')}`; };
                return ['1 2\n5\n5\n6', '2 4\n-3 3\n-3\n3\n0\n-4', `10 12\n1 2 3 4 5 6 7 8 9 10\n${Array.from({ length: 12 }, (_, i) => i).join('\n')}`, T(100, 100), T(1000, 500), T(5000, 5000), T(4999, 2000)];
            },
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), q = rd.int(); const a = rd.ints(n); const pos = new Map(a.map((x, i) => [x, i + 1])); return rd.ints(q).map((x) => String(pos.has(x) ? pos.get(x) : -1)).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int a[5005];
int szukaj(int l, int r, int x) {
    if (l > r) return -1;
    int s = (l + r) / 2;
    if (a[s] == x) return s;
    if (a[s] > x) return szukaj(l, s - 1, x);
    return szukaj(s + 1, r, x);
}
int main() {
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (q--) {
        int x;
        cin >> x;
        cout << szukaj(1, n, x) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 4
        {
            id: 'rek-scalanie',
            title: 'Scalanie dwóch ciągów',
            level: 'latwe',
            statement: [
                'Dane są dwa ciągi posortowane niemalejąco: a (n liczb) i b (m liczb). Połącz je w jeden ciąg posortowany niemalejąco i go wypisz. To serce sortowania przez scalanie z następnego zadania.',
                'Wystarczy patrzeć na pierwsze elementy obu ciągów: mniejszy z nich jest najmniejszym elementem wyniku. Wypisz go i scal resztę — rekurencyjnie: scal(i, j) scala a[i..] z b[j..].',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i m.', 'W drugim wierszu znajduje się n liczb ciągu a, a w trzecim — m liczb ciągu b.'],
            output_format: ['Wypisz w jednym wierszu n + m liczb — scalony ciąg.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁹ ≤ aᵢ, bᵢ ≤ 10⁹'],
            examples: [{ input: '3 4\n1 4 9\n2 3 4 10', note: 'Porównujemy 1 i 2 → wypisujemy 1; 4 i 2 → 2; 4 i 3 → 3; 4 i 4 → 4 (z a); 9 i 4 → 4; 9 i 10 → 9; został tylko 10.' }],
            hint: 'void scal(int i, int j): if (i == n && j == m) return; if (j == m || (i < n && a[i] <= b[j])) { cout << a[i] << " "; scal(i + 1, j); } else { cout << b[j] << " "; scal(i, j + 1); }. Gdy jeden ciąg się skończy, wypisujemy już tylko drugi.',
            tests: (r) => { const S = (n) => r.arr(n, -1e9, 1e9).sort((x, y) => x - y).join(' '); const T = (n, m) => `${n} ${m}\n${S(n)}\n${S(m)}`; return ['1 1\n5\n5', '1 3\n10\n1 2 3', '3 1\n1 2 3\n0', T(10, 10), T(100, 50), T(1000, 1000), `5 5\n${[1, 1, 1, 1, 1].join(' ')}\n${[1, 1, 1, 1, 1].join(' ')}`, T(1, 1000)]; },
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), m = rd.int(); return rd.ints(n).concat(rd.ints(m)).sort((x, y) => x - y).join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, m;
int a[1005], b[1005];
void scal(int i, int j) {
    if (i == n && j == m) return;
    if (j == m || (i < n && a[i] <= b[j])) {
        cout << a[i] << " ";
        scal(i + 1, j);
    } else {
        cout << b[j] << " ";
        scal(i, j + 1);
    }
}
int main() {
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int j = 0; j < m; j++) cin >> b[j];
    scal(0, 0);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 5
        {
            id: 'rek-sortowanie-scalanie',
            title: 'Sortowanie przez scalanie',
            level: 'srednie',
            statement: [
                'Posortuj n liczb niemalejąco, implementując samodzielnie sortowanie przez scalanie (merge sort).',
                'Funkcja sortuj(l, r): jeśli fragment ma jeden element, jest już posortowany. W przeciwnym razie podziel go na połowy, posortuj każdą rekurencyjnie, a potem scal dwie posortowane połowy w jedną (jak w poprzednim zadaniu — tym razem do tablicy pomocniczej). ' + 'Taki algorytm działa w czasie O(n log n).',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych.'],
            output_format: ['Wypisz w jednym wierszu te same liczby w kolejności niemalejącej.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '6\n5 2 4 6 1 3', note: '5 2 4 | 6 1 3 → po posortowaniu połówek 2 4 5 | 1 3 6 → po scaleniu 1 2 3 4 5 6.' }],
            hint: 'void sortuj(int l, int r): if (l >= r) return; int s = (l + r) / 2; sortuj(l, s); sortuj(s + 1, r); potem scalanie: dwa wskaźniki i = l, j = s + 1 i tablica pom — zawsze przepisuj do pom mniejszy z a[i], a[j], a na koniec skopiuj pom[l..r] z powrotem do a. (Do sprawdzenia możesz użyć sort(), ale celem jest napisać to samemu.)',
            tests: (r) => ['1\n42', '2\n2 1', '5\n1 2 3 4 5', '5\n5 4 3 2 1', arrT(r, 10, -9, 9), arrT(r, 1000, -1e9, 1e9), arrT(r, 5000, -1e9, 1e9), arrT(r, 5000, 0, 3)],
            solve: (inp) => h.nums(inp).slice(1).sort((x, y) => x - y).join(' '),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int a[5005], pom[5005];
void sortuj(int l, int r) {
    if (l >= r) return;
    int s = (l + r) / 2;
    sortuj(l, s);
    sortuj(s + 1, r);
    int i = l, j = s + 1, k = l;
    while (i <= s || j <= r) {
        if (j > r || (i <= s && a[i] <= a[j])) pom[k++] = a[i++];
        else pom[k++] = a[j++];
    }
    for (int x = l; x <= r; x++) a[x] = pom[x];
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    sortuj(0, n - 1);
    for (int i = 0; i < n; i++) cout << a[i] << " ";
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 6
        {
            id: 'rek-inwersje',
            title: 'Zliczanie inwersji',
            level: 'trudne',
            statement: [
                'Inwersja w tablicy to para pozycji i < j, dla której aᵢ > aⱼ — czyli para liczb ustawiona „w złej kolejności”. Policz inwersje w tablicy n liczb.',
                'Przy sortowaniu przez scalanie każda inwersja jest albo w lewej połowie, albo w prawej, albo „pomiędzy” (większa liczba w lewej połowie, mniejsza w prawej). Te ostatnie da się policzyć podczas scalania: gdy do wyniku trafia element z prawej połowy, jest on mniejszy od WSZYSTKICH elementów, które zostały jeszcze w lewej połowie.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₁, …, aₙ.'],
            output_format: ['Wypisz jedną liczbę — liczbę inwersji.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '5\n2 4 1 3 5', note: 'Inwersje to pary (2, 1), (4, 1) i (4, 3).' }, { input: '4\n4 3 2 1', note: 'Każda para jest inwersją: 4 · 3 / 2 = 6.' }],
            hint: 'long long sortuj(int l, int r) zwraca liczbę inwersji we fragmencie i go sortuje: if (l >= r) return 0; long long w = sortuj(l, s) + sortuj(s + 1, r); podczas scalania, gdy bierzesz a[j] z prawej połowy, dodaj w += s - i + 1 (tyle elementów zostało w lewej). Równe liczby nie tworzą inwersji — przy remisie bierz najpierw z lewej (a[i] <= a[j]). Wynik może przekroczyć int.',
            tests: (r) => ['1\n5', '2\n1 2', '2\n2 1', '5\n3 3 3 3 3', arrT(r, 10, 1, 5), arrT(r, 1000, -1e9, 1e9), arrT(r, 5000, -1e9, 1e9), `5000\n${Array.from({ length: 5000 }, (_, i) => 5000 - i).join(' ')}`, arrT(r, 5000, 0, 2)],
            solve: (inp) => { const a = h.nums(inp).slice(1); const pom = Array(a.length); const go = (l, r) => { if (l >= r) return 0; const s = (l + r) >> 1; let w = go(l, s) + go(s + 1, r); let i = l, j = s + 1, k = l; while (i <= s || j <= r) { if (j > r || (i <= s && a[i] <= a[j])) pom[k++] = a[i++]; else { w += s - i + 1; pom[k++] = a[j++]; } } for (let x = l; x <= r; x++) a[x] = pom[x]; return w; }; return String(go(0, a.length - 1)); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int a[5005], pom[5005];
long long sortuj(int l, int r) {
    if (l >= r) return 0;
    int s = (l + r) / 2;
    long long w = sortuj(l, s) + sortuj(s + 1, r);
    int i = l, j = s + 1, k = l;
    while (i <= s || j <= r) {
        if (j > r || (i <= s && a[i] <= a[j])) pom[k++] = a[i++];
        else { w += s - i + 1; pom[k++] = a[j++]; }
    }
    for (int x = l; x <= r; x++) a[x] = pom[x];
    return w;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << sortuj(0, n - 1) << "\n";
}`,
        },
        // ------------------------------------------------------------ 7
        {
            id: 'rek-k-ty-najmniejszy',
            title: 'K-ty najmniejszy element',
            level: 'trudne',
            statement: [
                'Dana jest tablica n liczb i liczba k. Wypisz liczbę, która stałaby na k-tym miejscu, gdyby tablicę posortować niemalejąco.',
                'Pomysł z sortowania szybkiego (quicksort): wybierz element osiowy (pivot) i podziel tablicę na trzy grupy — mniejsze od niego, równe i większe. Z rozmiarów grup od razu widać, w której jest k-ty element — i tylko w niej szukamy dalej, rekurencyjnie. To algorytm quickselect.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i k.', 'W drugim wierszu znajduje się n liczb całkowitych.'],
            output_format: ['Wypisz jedną liczbę — k-ty najmniejszy element.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '7 3\n7 2 9 4 2 8 5', note: 'Posortowana tablica to 2 2 4 5 7 8 9 — trzecia liczba to 4.' }],
            hint: 'int kty(vector<int> v, int k): wybierz pivot, np. v[v.size() / 2] albo losowy. Rozdziel v na mniejsze, rowne, wieksze. Jeśli k <= mniejsze.size() — return kty(mniejsze, k); jeśli k <= mniejsze.size() + rowne.size() — return pivot; w przeciwnym razie return kty(wieksze, k - mniejsze.size() - rowne.size());.',
            tests: (r) => { const T = (n, lo, hi) => `${n} ${r.int(1, n)}\n${r.arr(n, lo, hi).join(' ')}`; return ['1 1\n-5', '3 2\n3 1 2', '5 5\n1 1 1 1 1', '6 1\n6 5 4 3 2 1', T(10, 1, 9), T(1000, -1e9, 1e9), T(5000, -1e9, 1e9), T(5000, 0, 5), `5000 2500\n${Array.from({ length: 5000 }, (_, i) => i).join(' ')}`]; },
            solve: (inp) => { const a = h.nums(inp); const k = a[1]; return String(a.slice(2).sort((x, y) => x - y)[k - 1]); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int kty(const vector<int> &v, int k) {
    int pivot = v[v.size() / 2];
    vector<int> mniejsze, wieksze;
    int rowne = 0;
    for (int x : v) {
        if (x < pivot) mniejsze.push_back(x);
        else if (x > pivot) wieksze.push_back(x);
        else rowne++;
    }
    if (k <= (int)mniejsze.size()) return kty(mniejsze, k);
    if (k <= (int)mniejsze.size() + rowne) return pivot;
    return kty(wieksze, k - mniejsze.size() - rowne);
}
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    cout << kty(v, k) << "\n";
}`,
        },
        // ------------------------------------------------------------ 8
        {
            id: 'rek-maks-podtablica',
            title: 'Najlepszy spójny fragment',
            level: 'trudne',
            statement: [
                'Dana jest tablica n liczb całkowitych (także ujemnych). Wybierz niepusty spójny fragment tablicy (kilka liczb stojących obok siebie) o największej sumie i wypisz tę sumę.',
                DZIEL + ' Najlepszy fragment leży albo w całości w lewej połowie, albo w całości w prawej, albo przechodzi przez środek — a ten ostatni to najlepszy kawałek kończący się na środku lewej połowy plus najlepszy kawałek zaczynający się na początku prawej.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₁, …, aₙ.'],
            output_format: ['Wypisz jedną liczbę — największą sumę spójnego fragmentu.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '8\n-2 1 -3 4 -1 2 1 -5', note: 'Najlepszy fragment to 4 −1 2 1 o sumie 6 — przechodzi przez środek tablicy.' }, { input: '3\n-5 -2 -9', note: 'Fragment musi być niepusty, więc gdy wszystkie liczby są ujemne, wybieramy największą z nich.' }],
            hint: 'long long najlepszy(int l, int r): if (l == r) return a[l]; s = (l + r) / 2; wynik = max(najlepszy(l, s), najlepszy(s + 1, r)); potem pętlą od s w lewo licz sumy a[s], a[s] + a[s − 1], … i zapamiętaj największą (lewa), tak samo od s + 1 w prawo (prawa); wynik = max(wynik, lewa + prawa). Sumy sięgają 5 · 10¹² — long long.',
            tests: (r) => ['1\n-7', '1\n1000000000', '3\n1 -1 1', '5\n-1 -2 -3 -4 -5', arrT(r, 10, -9, 9), arrT(r, 1000, -1e9, 1e9), arrT(r, 5000, -1e9, 1e9), arrT(r, 5000, -100, 101), `5000\n${Array(5000).fill(1e9).join(' ')}`],
            solve: (inp) => { const a = h.nums(inp).slice(1); let best = -Infinity, cur = 0; for (const x of a) { cur = Math.max(x, cur + x); best = Math.max(best, cur); } return String(best); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long a[5005];
long long najlepszy(int l, int r) {
    if (l == r) return a[l];
    int s = (l + r) / 2;
    long long wynik = max(najlepszy(l, s), najlepszy(s + 1, r));
    long long suma = 0, lewa = LLONG_MIN, prawa = LLONG_MIN;
    for (int i = s; i >= l; i--) { suma += a[i]; lewa = max(lewa, suma); }
    suma = 0;
    for (int i = s + 1; i <= r; i++) { suma += a[i]; prawa = max(prawa, suma); }
    return max(wynik, lewa + prawa);
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << najlepszy(0, n - 1) << "\n";
}`,
        },
        // ------------------------------------------------------------ 9
        {
            id: 'rek-dywan-sierpinskiego',
            title: 'Dywan Sierpińskiego',
            level: 'srednie',
            statement: [
                'Dywan Sierpińskiego rzędu 0 to jedno pole #. Dywan rzędu k to kwadrat złożony z 3 × 3 dywanów rzędu k − 1, z których środkowy został wycięty (same kropki). Dywan rzędu k ma bok 3ᵏ.',
                'Wczytaj k i narysuj dywan rzędu k. Najprościej rekurencyjnie: funkcja rysuj(k, w, x) wypełnia w tablicy kwadrat o boku 3ᵏ zaczynający się w wierszu w i kolumnie x — dzieli go na 9 mniejszych kwadratów i rysuje osiem z nich (wszystkie oprócz środkowego).',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita k.'],
            output_format: ['Wypisz 3ᵏ wierszy po 3ᵏ znaków # lub . — dywan rzędu k.'],
            constraints: ['0 ≤ k ≤ 4'],
            examples: [{ input: '1' }, { input: '2' }],
            hint: 'Wypełnij tablicę char t[81][81] kropkami. void rysuj(int k, int w, int x): if (k == 0) { t[w][x] = \'#\'; return; } int b = 3^(k − 1); for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) if (!(i == 1 && j == 1)) rysuj(k - 1, w + i * b, x + j * b);. Na końcu wypisz tablicę.',
            tests: () => ['0', '3', '4'],
            solve: (inp) => { const k = Number(inp); const n = 3 ** k; const o = []; for (let i = 0; i < n; i++) { let row = ''; for (let j = 0; j < n; j++) { let a = i, b = j, full = true; while (a || b) { if (a % 3 === 1 && b % 3 === 1) { full = false; break; } a = Math.floor(a / 3); b = Math.floor(b / 3); } row += full ? '#' : '.'; } o.push(row); } return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
char t[81][82];
void rysuj(int k, int w, int x) {
    if (k == 0) { t[w][x] = '#'; return; }
    int b = 1;
    for (int i = 1; i < k; i++) b *= 3;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (!(i == 1 && j == 1)) rysuj(k - 1, w + i * b, x + j * b);
}
int main() {
    int k;
    cin >> k;
    int n = 1;
    for (int i = 0; i < k; i++) n *= 3;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) t[i][j] = '.';
    rysuj(k, 0, 0);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) cout << t[i][j];
        cout << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 10
        {
            id: 'rek-napis-fibonacciego',
            title: 'Napis Fibonacciego',
            level: 'trudne',
            statement: [
                'Napisy Fibonacciego tworzymy tak: S(1) = a, S(2) = b, a dalej S(n) = S(n − 1) + S(n − 2), gdzie + oznacza sklejenie napisów. Na przykład S(3) = ba, S(4) = bab, S(5) = babba, S(6) = babbabab.',
                'Dla każdego zapytania wypisz k-tą literę napisu S(n). Napisy rosną jak liczby Fibonacciego — S(80) ma ponad 2 · 10¹⁶ liter — więc nie da się ich zbudować. Ale nie trzeba: k-ta litera S(n) leży albo w części S(n − 1), albo w części S(n − 2), a długości tych części znamy.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu literę a albo b.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 80', '1 ≤ k ≤ długość S(n)'],
            examples: [{ input: '4\n5 1\n5 4\n6 8\n1 1', note: 'S(5) = babba: 1. litera to b, 4. to b. S(6) = babbabab: 8. litera to b.' }],
            hint: 'Policz długości dl[1] = dl[2] = 1, dl[n] = dl[n − 1] + dl[n − 2] (long long). char litera(int n, long long k): if (n == 1) return \'a\'; if (n == 2) return \'b\'; if (k <= dl[n - 1]) return litera(n - 1, k); return litera(n - 2, k - dl[n - 1]);. Każde wywołanie schodzi o 1 lub 2 rzędy niżej, więc rekurencja ma najwyżej 80 poziomów.',
            tests: (r) => ['6\n1 1\n2 1\n3 1\n3 2\n4 3\n7 13', many(100, () => { const n = r.int(1, 15); return `${n} ${r.big(1, fibLen[n])}`; }), many(1000, () => { const n = r.int(1, 80); return `${n} ${r.big(1, fibLen[n])}`; }), many(10, () => `80 ${r.big(1, fibLen[80])}`), '2\n80 1\n80 23416728348467685'],
            solve: (inp) => { const t = h.toks(inp); const o = []; const f = (n, k) => { while (n > 2) { if (k <= fibLen[n - 1]) n -= 1; else { k -= fibLen[n - 1]; n -= 2; } } return n === 1 ? 'a' : 'b'; }; for (let i = 1; i < t.length; i += 2) o.push(f(Number(t[i]), BigInt(t[i + 1]))); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long dl[81];
char litera(int n, long long k) {
    if (n == 1) return 'a';
    if (n == 2) return 'b';
    if (k <= dl[n - 1]) return litera(n - 1, k);
    return litera(n - 2, k - dl[n - 1]);
}
int main() {
    dl[1] = dl[2] = 1;
    for (int i = 3; i <= 80; i++) dl[i] = dl[i - 1] + dl[i - 2];
    int t;
    cin >> t;
    while (t--) {
        int n; long long k;
        cin >> n >> k;
        cout << litera(n, k) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 11
        {
            id: 'rek-thue-morse',
            title: 'Ciąg Thuego–Morse’a',
            level: 'trudne',
            statement: [
                'Zaczynamy od napisu „0”. W każdym kroku doklejamy na koniec kopię całego napisu, w której zamieniliśmy zera na jedynki i jedynki na zera: 0 → 01 → 0110 → 01101001 → 0110100110010110 → … Każdy napis jest początkiem następnego, więc w ten sposób powstaje jeden nieskończony ciąg cyfr.',
                'Dla każdego zapytania wypisz k-tą cyfrę tego ciągu (cyfry numerujemy od 1). Wskazówka: jeśli k jest w drugiej połowie napisu o długości 2p, to jest zamienioną cyfrą z pozycji k − p.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita k.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu cyfrę 0 albo 1.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '5\n1\n2\n3\n4\n6', note: 'Ciąg zaczyna się od 0 1 1 0 1 0 0 1 …' }],
            hint: 'int cyfra(long long k): if (k == 1) return 0; znajdź największą potęgę dwójki p mniejszą od k (p = 1, a potem podwajaj, dopóki 2p < k); return 1 - cyfra(k - p);. Każde wywołanie przynajmniej o połowę zmniejsza k, więc wystarczy ok. 60 poziomów.',
            tests: (r) => ['8\n1\n2\n3\n4\n5\n6\n7\n8', many(64, (_, i) => String(i + 1)), many(1000, () => String(r.big(1, '1000000000000000000'))), '4\n1000000000000000000\n576460752303423488\n576460752303423489\n999999999999999999'],
            solve: (inp) => h.toks(inp).slice(1).map((x) => { let k = BigInt(x) - 1n, c = 0; while (k) { c ^= Number(k & 1n); k >>= 1n; } return String(c); }).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int cyfra(long long k) {
    if (k == 1) return 0;
    long long p = 1;
    while (2 * p < k) p *= 2;
    return 1 - cyfra(k - p);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long k;
        cin >> k;
        cout << cyfra(k) << "\n";
    }
}`,
        },
    ];
};
