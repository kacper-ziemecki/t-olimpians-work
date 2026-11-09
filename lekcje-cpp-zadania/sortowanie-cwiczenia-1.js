// Sortowanie — ćwiczenia w trakcie lekcji, części 1–5: pierwsze sortowanie (vector, tablica, napisy, litery, kawałek,
// czy posortowane), malejąco, k-ty element i mediana, grupy równych wartości i najbliżsi sąsiedzi, sortowanie ręczne
// (wybieranie, bąbelki, wstawianie, zliczanie, naleśniki) oraz własna reguła porównania (lambda, [&]).
// Uczeń zna pierwszy etap, tablice, napisy, pary i vector — ale jeszcze nie funkcje ani rekurencję.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks, fx } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const SLOWA = ['kot', 'pies', 'mysz', 'lew', 'ara', 'zebra', 'kajak', 'lato', 'tola', 'kino', 'okno', 'ryba', 'bary', 'rak', 'kra',
        'arka', 'kara', 'rama', 'mara', 'las', 'sal', 'osa', 'oas', 'nos', 'son', 'sowa', 'wosa', 'tama', 'mata', 'atak', 'kata'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const asc = (a) => a.slice().sort((x, y) => x - y);
    const desc = (a) => a.slice().sort((x, y) => y - x);
    const strSort = (a) => a.slice().sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
    const slowo = (r, lo, hi) => r.word(r.int(lo, hi));
    const imie = (r) => { const w = r.word(r.int(2, 9)); return w[0].toUpperCase() + w.slice(1); };
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]), reszta: a.slice(1 + a[0]) }; };
    const sumaCyfr = (x) => String(x).split('').reduce((s, c) => s + Number(c), 0);

    return [
        // ================================================================ KROK 1 · pierwsze sortowanie
        {
            id: 'sort-rosnaco', krok: 1, level: 'latwe',
            title: 'Od najmniejszej',
            short: 'Wczytaj n liczb i wypisz je od najmniejszej do największej.',
            tags: ['vector', 'sort(v.begin(), v.end())', 'liczby ujemne'],
            statement: ['Wczytaj n liczb całkowitych i wypisz je w jednym wierszu w kolejności od najmniejszej do największej (niemalejąco). Równe liczby stoją obok siebie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: te same n liczb, posortowane niemalejąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n7 -3 9 1 5 1', note: 'Dwie jedynki stają obok siebie, a −3 jest najmniejsza.' }],
            hint: R`Trzy kroki: wczytaj liczby do vector<int> v(n); posortuj jedną linijką sort(v.begin(), v.end()); i wypisz pętlą „dla każdego” ze spacją po każdej liczbie.`,
            tests: (r) => ['1\n5', '2\n2 1', '5\n1 2 3 4 5', '5\n5 4 3 2 1', '4\n-1 -1 -1 -1', fmt(arr(r, 30, -50, 50)), fmt(arr(r, 2000, -1e9, 1e9)), fmt(arr(r, 2000, 0, 3))],
            solve: (inp) => asc(czytaj(inp).v).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-lista-obecnosci', krok: 1, level: 'latwe',
            title: 'Lista obecności',
            short: 'Imiona uczniów w kolejności przychodzenia — wypisz je alfabetycznie.',
            tags: ['vector<string>', 'porządek słownikowy', 'sort'],
            statement: ['Na zajęcia przychodzi n uczniów. Nauczyciel zapisał ich imiona w kolejności przychodzenia. Wypisz te imiona alfabetycznie (w porządku słownikowym), każde w osobnym wierszu. Każde imię zaczyna się wielką literą, a dalej ma tylko małe litery angielskie. Imiona mogą się powtarzać — wtedy wypisujesz je tyle razy, ile razy występują.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach imiona.'],
            output_format: ['n wierszy: imiona alfabetycznie.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde imię ma od 2 do 12 liter.'],
            examples: [{ input: '5\nOla\nJan\nAla\nOlek\nJan', note: '„Ola” stoi przed „Olek”, bo jest jego początkiem.' }],
            hint: R`Wczytaj imiona do vector<string> s(n); i posortuj zwykłym sort. Napisy porównują się litera po literze, a gdy jedno jest początkiem drugiego — krótsze stoi wcześniej. Wszystkie imiona zaczynają się wielką literą, więc pułapka „wielkie przed małymi” tu nie przeszkadza.`,
            tests: (r) => {
                const t = (n) => `${n}\n${Array.from({ length: n }, () => (r() < 0.6 ? r.pick(IMIONA) : imie(r))).join('\n')}`;
                return ['1\nOla', '3\nOla\nOla\nOla', '4\nZosia\nOlek\nOla\nAla', t(10), t(300), t(1000)];
            },
            solve: (inp) => strSort(toks(inp).slice(1)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end());
    for (auto x : s) cout << x << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-litery', krok: 1, level: 'latwe',
            title: 'Litery po kolei',
            short: 'Ustaw litery jednego słowa w kolejności alfabetycznej.',
            tags: ['string', 'sort(s.begin(), s.end())'],
            statement: ['Wczytaj słowo złożone z małych liter angielskich. Wypisz to samo słowo, ale z literami ustawionymi alfabetycznie.'],
            input_format: ['Jedno słowo.'],
            output_format: ['Słowo z literami ułożonymi alfabetycznie.'],
            constraints: ['Słowo ma od 1 do 20 000 liter.'],
            examples: [{ input: 'banan' }, { input: 'informatyka' }],
            hint: R`Napis sortuje się tak samo jak vector: sort(s.begin(), s.end());. Potem wypisz cały napis jednym cout.`,
            tests: (r) => ['a', 'zyx', 'aaaa', 'olimpiada', slowo(r, 10, 30), r.word(20000), r.word(20000, 'ab'), r.word(5000, 'zyxw')],
            solve: (inp) => toks(inp)[0].split('').sort().join(''),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    sort(s.begin(), s.end());
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-czy-posortowane', krok: 1, level: 'latwe',
            title: 'Czy już po kolei?',
            short: 'Sprawdź, czy ciąg jest posortowany. Jeśli nie — gdzie pierwszy raz psuje się kolejność?',
            tags: ['sąsiedzi v[i] i v[i + 1]', 'is_sorted', 'break'],
            statement: ['Wczytaj ciąg n liczb całkowitych a₁, a₂, …, aₙ. Jeśli jest posortowany niemalejąco (każda liczba jest większa albo równa poprzedniej), wypisz TAK. W przeciwnym razie wypisz NIE, a w drugim wierszu najmniejszy numer i (licząc od 1), dla którego aᵢ > aᵢ₊₁.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['TAK albo NIE; po NIE w drugim wierszu numer i.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '6\n1 3 3 8 6 9', note: 'a₄ = 8 > a₅ = 6.' }, { input: '4\n2 2 5 5' }],
            hint: R`Przejdź pętlą po sąsiadach: dla i od 0, dopóki i + 1 < n, sprawdzaj v[i] > v[i + 1]. Przy pierwszym takim miejscu wypisz NIE i i + 1 (numery od 1!) i przerwij. Samo „czy posortowane” sprawdzi też is_sorted(v.begin(), v.end()).`,
            tests: (r) => {
                const pos = (n) => asc(arr(r, n, -1e9, 1e9));
                const zepsuj = (a, i) => { const b = a.slice(); [b[i], b[i + 1]] = [b[i + 1], b[i] - 1]; return b; };
                const big = pos(8000);
                return ['1\n7', '2\n5 4', '2\n4 4', '5\n5 4 3 2 1', fmt(pos(20)), fmt(zepsuj(pos(30), 0)), fmt(zepsuj(pos(30), 28)), fmt(big), fmt(zepsuj(big, 7777)), fmt(arr(r, 10000, 0, 1))];
            },
            solve: (inp) => { const { n, v } = czytaj(inp); for (let i = 0; i + 1 < n; i++) if (v[i] > v[i + 1]) return `NIE\n${i + 1}`; return 'TAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    for (int i = 0; i + 1 < n; i++) {
        if (v[i] > v[i + 1]) {
            cout << "NIE\n" << i + 1 << "\n";
            return 0;
        }
    }
    cout << "TAK\n";
    return 0;
}`,
        },
        {
            id: 'sort-kawalek', krok: 1, level: 'latwe',
            title: 'Posortuj kawałek',
            short: 'Posortuj tylko pozycje od a do b, a resztę ciągu zostaw w spokoju.',
            tags: ['v.begin() + a', 'zakres [od, do)', 'numery od 1'],
            statement: ['Wczytaj ciąg n liczb oraz dwie liczby a i b. Posortuj niemalejąco tylko kawałek ciągu od pozycji a do pozycji b włącznie (pozycje numerujemy od 1). Pozostałe liczby mają zostać na swoich miejscach. Wypisz cały ciąg.'],
            input_format: ['W pierwszym wierszu liczby n, a i b.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb po posortowaniu kawałka.'],
            constraints: ['1 ≤ a ≤ b ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '7 2 5\n9 7 5 3 1 8 6', note: 'Sortujemy pozycje 2–5: liczby 7 5 3 1 stają się 1 3 5 7.' }],
            hint: R`Pozycja a (od 1) to w vectorze pudełko a − 1, a pozycja b — pudełko b − 1. Druga strzałka ma pokazywać miejsce ZA kawałkiem, czyli pudełko b: sort(v.begin() + a - 1, v.begin() + b);`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[2] && a[2] <= a[0] ? null : 'zle a, b'; },
            tests: (r) => {
                const t = (n, a, b, lo, hi) => `${n} ${a} ${b}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1 1\n5', '3 1 3\n3 2 1', '3 2 2\n3 2 1', '5 1 2\n9 8 7 6 5', '5 4 5\n9 8 7 6 5', t(20, 5, 15, -9, 9), t(2000, 1, 2000, -1e6, 1e6), t(2000, 700, 1300, -1e6, 1e6)];
            },
            solve: (inp) => { const a = nums(inp); const [n, x, y] = a; const v = a.slice(3, 3 + n); const k = asc(v.slice(x - 1, y)); return [...v.slice(0, x - 1), ...k, ...v.slice(y)].join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, a, b;
    cin >> n >> a >> b;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin() + a - 1, v.begin() + b);
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-na-swoim-miejscu', krok: 1, level: 'latwe',
            title: 'Na swoim miejscu',
            short: 'Ile liczb stoi już tam, gdzie stałyby po posortowaniu?',
            tags: ['kopia vectora', 'sort kopii', 'v[i] == w[i]'],
            statement: ['Wczytaj ciąg n liczb całkowitych. Wyobraź sobie, że sortujemy go niemalejąco. Policz, na ilu pozycjach liczba przed sortowaniem jest taka sama jak liczba po sortowaniu — czyli ile pozycji „już się zgadza”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — ile pozycji się zgadza.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n3 1 2 4 5', note: 'Po sortowaniu: 1 2 3 4 5. Zgadzają się pozycje 4 i 5.' }, { input: '4\n2 1 2 1' }],
            hint: R`Zrób kopię: vector<int> w = v; i posortuj tylko kopię. Potem jedną pętlą policz pozycje, na których v[i] == w[i].`,
            tests: (r) => ['1\n8', '3\n1 2 3', '3\n3 2 1', '4\n5 5 5 5', fmt(arr(r, 20, 1, 5)), fmt(arr(r, 8000, -1e9, 1e9)), fmt(asc(arr(r, 10000, 0, 50)).map((x, i) => (i % 1000 === 0 ? 99 : x)))],
            solve: (inp) => { const { v } = czytaj(inp); const w = asc(v); return String(v.filter((x, i) => x === w[i]).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> w = v;
    sort(w.begin(), w.end());
    int ile = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] == w[i]) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-slowo-klucz', krok: 1, level: 'srednie',
            title: 'Słowo-klucz',
            short: 'Które słowa z listy są anagramami słowa-klucza?',
            tags: ['sortowanie liter', 'kopie napisów', 'anagramy', '=='],
            statement: ['Dane jest słowo-klucz oraz lista n słów. Słowo jest anagramem klucza, jeśli składa się z dokładnie tych samych liter co klucz, każdej tyle samo razy (kolejność może być dowolna; samo słowo-klucz też jest swoim anagramem). Wypisz wszystkie anagramy klucza z listy, w kolejności, w jakiej występują na liście, każde w osobnym wierszu. Jeśli na liście nie ma żadnego anagramu, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu słowo-klucz i liczba n.', 'W drugim wierszu n słów.'],
            output_format: ['Anagramy klucza w kolejności z listy, każdy w osobnym wierszu, albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', 'Wszystkie słowa mają od 1 do 10 małych liter angielskich.'],
            examples: [{ input: 'kajak 5\njakak kajko kajak akk kaajk', note: '„kajko” ma literę o zamiast a, a „akk” jest za krótkie.' }, { input: 'kot 3\npies kotek ok' }],
            hint: R`Posortuj litery kopii klucza: string k = klucz; sort(k.begin(), k.end());. Dla każdego słowa z listy zrób to samo z jego kopią i porównaj kopie przez ==. Wypisuj oryginalne słowo, nie posortowane.`,
            tests: (r) => {
                const t = (key, n, pAna) => {
                    const ws = Array.from({ length: n }, () => {
                        const p = r();
                        if (p < pAna) return r.shuffle(key.split('')).join('');
                        if (p < pAna + 0.3) { const z = key.split(''); z[r.int(0, z.length - 1)] = r.word(1); return r.shuffle(z).join(''); }
                        return r.word(r.int(Math.max(1, key.length - 1), key.length + 1), 'aeiklmnoprst');
                    });
                    return `${key} ${n}\n${ws.join(' ')}`;
                };
                return ['a 1\na', 'ab 2\nba ab', 'abc 3\nabcd ab cab', t('kot', 10, 0.4), t('olimpiada', 200, 0.2), t('ekran', 1000, 0.1), t('zzzz', 50, 0)];
            },
            solve: (inp) => { const t = toks(inp); const k = t[0].split('').sort().join(''); const out = t.slice(2).filter((w) => w.split('').sort().join('') === k); return out.length ? out.join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string klucz;
    int n;
    cin >> klucz >> n;
    string k = klucz;
    sort(k.begin(), k.end());
    int ile = 0;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        string t = s;
        sort(t.begin(), t.end());
        if (t == k) {
            cout << s << "\n";
            ile++;
        }
    }
    if (ile == 0) cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'sort-slownikowo-liczbowo', krok: 1, level: 'srednie',
            title: 'Słownikowo czy liczbowo?',
            short: 'Te same liczby posortuj dwa razy: według wartości i jak słowa w słowniku.',
            tags: ['vector<int>', 'vector<string>', '„10” przed „9”'],
            statement: ['Wczytaj n liczb naturalnych (bez zer na początku). W pierwszym wierszu wypisz je posortowane według wartości, niemalejąco. W drugim wierszu wypisz je posortowane tak, jakby były słowami w słowniku — czyli porównując ich zapisy znak po znaku (wtedy na przykład 10 stoi przed 9, a 100 przed 20).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Dwa wiersze po n liczb.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n9 10 100 20 3', note: 'Słownikowo: „10” < „100” (krótszy początek), „100” < „20” (pierwsze znaki 1 i 2).' }],
            hint: R`Wczytaj liczby do vector<string> — wtedy sort ustawi je słownikowo. Do sortowania według wartości wczytaj je jeszcze raz do int albo zamień napisy na liczby (stoll). Najprościej: wczytaj jako napisy, zrób kopię do vector<long long> przez stoll i posortuj oba vectory.`,
            tests: (r) => {
                const t = (n, hi) => fmt(Array.from({ length: n }, () => (r() < 0.5 ? r.int(0, 30) : r.int(0, hi))));
                return ['1\n0', '3\n1 10 100', '4\n9 99 999 9999', '5\n0 5 50 500 5000', t(20, 1000), t(1000, 1e9), t(1000, 100)];
            },
            solve: (inp) => { const t = toks(inp).slice(1); return `${asc(t.map(Number)).join(' ')}\n${strSort(t).join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    vector<long long> v;
    for (auto x : s) v.push_back(stoll(x));
    sort(v.begin(), v.end());
    sort(s.begin(), s.end());
    for (auto x : v) cout << x << " ";
    cout << "\n";
    for (auto x : s) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · malejąco, k-ty, mediana
        {
            id: 'sort-malejaco', krok: 2, level: 'latwe',
            title: 'Od największej',
            short: 'Wypisz liczby od największej do najmniejszej.',
            tags: ['sort(v.rbegin(), v.rend())', 'greater<int>()', 'sort + reverse'],
            statement: ['Wczytaj n liczb całkowitych i wypisz je w jednym wierszu od największej do najmniejszej (nierosnąco).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb nierosnąco.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n4 9 1 7 3' }, { input: '4\n-2 5 -2 0' }],
            hint: R`Wybierz jeden z trzech sposobów: sort(v.rbegin(), v.rend()); albo sort(v.begin(), v.end(), greater<int>()); albo sort, a potem reverse(v.begin(), v.end());.`,
            tests: (r) => ['1\n-5', '3\n1 2 3', '3\n3 2 1', '4\n7 7 7 7', fmt(arr(r, 30, -9, 9)), fmt(arr(r, 2000, -1e9, 1e9))],
            solve: (inp) => desc(czytaj(inp).v).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.rbegin(), v.rend());
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-k-ty', krok: 2, level: 'latwe',
            title: 'K-ta od dołu i od góry',
            short: 'Podaj k-tą najmniejszą i k-tą największą liczbę.',
            tags: ['v[k - 1]', 'v[n - k]', 'powtórzenia'],
            statement: ['Wczytaj n liczb całkowitych i liczbę k. Wyobraź sobie te liczby posortowane niemalejąco. Wypisz liczbę, która stoi na k-tym miejscu od początku (k-ta najmniejsza), i liczbę, która stoi na k-tym miejscu od końca (k-ta największa). Jeśli liczby się powtarzają, każda zajmuje osobne miejsce.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby w jednym wierszu: k-ta najmniejsza i k-ta największa.'],
            constraints: ['1 ≤ k ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7 3\n40 85 72 91 66 85 58', note: 'Po sortowaniu: 40 58 66 72 85 85 91. Trzecia od początku to 66, trzecia od końca to 85.' }],
            hint: R`Po sort(v.begin(), v.end()); k-ta najmniejsza stoi w pudełku k − 1, a k-ta największa w pudełku n − k. Sprawdź wzór dla k = 1: dostajesz v[0] i v[n − 1].`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n5', '2 1\n3 8', '2 2\n3 8', '5 3\n1 2 3 4 5', t(20, 7, 0, 9), t(8000, 1, -1e9, 1e9), t(8000, 4000, -1e9, 1e9), t(10000, 9999, 0, 1000)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = asc(a.slice(2, 2 + n)); return `${v[k - 1]} ${v[n - k]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    cout << v[k - 1] << " " << v[n - k] << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-mediana', krok: 2, level: 'latwe',
            title: 'Mediana',
            short: 'Znajdź wartość środkową — także wtedy, gdy liczb jest parzyście wiele.',
            tags: ['v[n / 2]', 'średnia dwóch środkowych', '/ 2.0', 'long long'],
            statement: ['Wczytaj n liczb całkowitych i wypisz ich medianę z dokładnie jedną cyfrą po kropce. Mediana to liczba stojąca w środku po posortowaniu. Gdy n jest nieparzyste, środek jest jeden. Gdy n jest parzyste, medianą jest średnia dwóch środkowych liczb.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Mediana z jedną cyfrą po kropce.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n2500 2000 50000 2300 2100' }, { input: '6\n9 1 12 4 3 8', note: 'Środkowe liczby to 4 i 8, mediana to 6.0.' }, { input: '2\n3 4' }],
            hint: R`Po sortowaniu: dla nieparzystego n mediana to v[n / 2], dla parzystego — (v[n / 2 - 1] + v[n / 2]) / 2.0. Suma dwóch liczb rzędu miliarda nie mieści się w int — trzymaj liczby w long long. Wypisuj z cout << fixed << setprecision(1).`,
            tests: (r) => ['1\n7', '1\n-7', '2\n-3 -4', '2\n-1 0', '2\n1000000000 999999999', '4\n1 1 2 2', fmt(arr(r, 11, -50, 50)), fmt(arr(r, 8000, -1e9, 1e9)), fmt(arr(r, 7999, -1e9, 1e9)), fmt(arr(r, 8000, 1e9 - 3, 1e9))],
            solve: (inp) => { const { n, v } = czytaj(inp); const w = asc(v); return fx(n % 2 ? w[(n - 1) / 2] : (w[n / 2 - 1] + w[n / 2]) / 2, 1); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    cout << fixed << setprecision(1);
    if (n % 2 == 1) cout << (double)v[n / 2] << "\n";
    else cout << (v[n / 2 - 1] + v[n / 2]) / 2.0 << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-prog-awansu', krok: 2, level: 'latwe',
            title: 'Próg awansu',
            short: 'Do finału wchodzi k najlepszych — i wszyscy, którzy remisują z k-tym. Ilu ich jest?',
            tags: ['v[n - k]', 'remis na granicy', 'liczenie ≥'],
            statement: ['W eliminacjach n zawodników zdobyło punkty. Do finału awansuje k najlepszych, ale jeśli ktoś ma tyle samo punktów co k-ty najlepszy zawodnik, też awansuje. Wypisz próg — liczbę punktów k-tego najlepszego zawodnika — oraz liczbę osób, które awansują.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — punkty zawodników.'],
            output_format: ['Dwie liczby w jednym wierszu: próg i liczba finalistów.'],
            constraints: ['1 ≤ k ≤ n ≤ 10 000', '0 ≤ punkty ≤ 10⁶'],
            examples: [{ input: '7 3\n70 85 90 85 60 85 95', note: 'Trzeci najlepszy wynik to 85, a 85 punktów ma aż trzech zawodników — awansuje 5 osób.' }],
            hint: R`Po sortowaniu rosnąco k-ty najlepszy wynik stoi w pudełku n − k. Potem policz wszystkich z wynikiem ≥ progu — może ich być więcej niż k.`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n0', '3 3\n5 5 5', '3 1\n5 5 5', '4 2\n10 9 8 7', t(30, 10, 0, 10), t(10000, 100, 0, 1e6), t(10000, 5000, 0, 100), t(10000, 1, 0, 3)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = asc(a.slice(2, 2 + n)); const p = v[n - k]; return `${p} ${v.filter((x) => x >= p).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int prog = v[n - k];
    int ile = 0;
    for (auto x : v) {
        if (x >= prog) ile++;
    }
    cout << prog << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-najlepsze-k', krok: 2, level: 'latwe',
            title: 'Najlepsze k',
            short: 'Wypisz k największych liczb od największej i ich sumę.',
            tags: ['sort malejąco', 'pierwsze k', 'long long'],
            statement: ['Wczytaj n liczb całkowitych i liczbę k. W pierwszym wierszu wypisz k największych liczb, od największej (jeśli największa liczba powtarza się kilka razy, wypisujesz ją tyle razy, ile mieści się w tych k). W drugim wierszu wypisz ich sumę.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu k liczb, w drugim ich suma.'],
            constraints: ['1 ≤ k ≤ n ≤ 10 000', 'k ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 3\n5 1 9 5 3 9' }],
            hint: R`Posortuj malejąco i wypisz pudełka 0 … k − 1. Sumę licz w long long — 2000 liczb po miliard to 2·10¹².`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] && a[1] <= 2000 ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n-4', '3 2\n-1 -2 -3', '4 4\n1 1 1 1', t(20, 5, -9, 9), t(8000, 2000, -1e9, 1e9), t(8000, 1, -1e9, 1e9), t(2000, 2000, 1e9 - 10, 1e9)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = desc(a.slice(2, 2 + n)).slice(0, k); return `${v.join(' ')}\n${v.reduce((s, x) => s + BigInt(x), 0n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), greater<long long>());
    long long suma = 0;
    for (int i = 0; i < k; i++) {
        cout << v[i] << " ";
        suma += v[i];
    }
    cout << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-cyfry-max-min', krok: 2, level: 'srednie',
            title: 'Największa i najmniejsza z cyfr',
            short: 'Z cyfr liczby ułóż największą i najmniejszą liczbę — bez zera na początku.',
            tags: ['string', 'sort malejąco', 'pierwsza niezerowa cyfra', 'swap'],
            statement: ['Dana jest liczba naturalna zapisana bez zer na początku (może mieć nawet 100 cyfr). Przestawiając jej cyfry, ułóż największą i najmniejszą możliwą liczbę. Liczba nie może zaczynać się od zera — chyba że jest to po prostu liczba 0.'],
            input_format: ['Jedna liczba naturalna.'],
            output_format: ['Dwie liczby w jednym wierszu: największa i najmniejsza.'],
            constraints: ['Liczba ma od 1 do 100 cyfr i nie zaczyna się od zera (wyjątek: liczba 0).'],
            examples: [{ input: '30521', note: 'Rosnąco cyfry dają 01235, ale zero nie może stać na początku — zamieniamy je z pierwszą niezerową cyfrą: 10235.' }, { input: '1000' }],
            hint: R`Wczytaj liczbę do string. Największa: sort(s.rbegin(), s.rend()). Najmniejsza: posortuj rosnąco, znajdź pierwszą cyfrę różną od '0' i zamień ją ze znakiem na początku (swap). Pilnuj, żeby pętla szukająca nie wyszła za napis.`,
            tests: (r) => {
                const lic = (n, alf) => { let s = r.word(n, alf); if (s[0] === '0') s = r.pick('123456789'.split('')) + s.slice(1); return s; };
                return ['0', '7', '10', '100', '9876543210', '1111', lic(20, '0123456789'), lic(100, '0123456789'), lic(100, '00000001'), lic(60, '59')];
            },
            solve: (inp) => {
                const s = toks(inp)[0].split('');
                const duza = s.slice().sort().reverse().join('');
                const m = s.slice().sort();
                const i = m.findIndex((c) => c !== '0');
                if (i > 0) [m[0], m[i]] = [m[i], m[0]];
                return `${duza} ${m.join('')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    string duza = s, mala = s;
    sort(duza.rbegin(), duza.rend());
    sort(mala.begin(), mala.end());
    int i = 0;
    while (i < (int)mala.size() && mala[i] == '0') i++;
    if (i < (int)mala.size()) swap(mala[0], mala[i]);
    cout << duza << " " << mala << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-noty-sedziow', krok: 2, level: 'srednie',
            title: 'Noty sędziów',
            short: 'Odrzuć k najniższych i k najwyższych not, a resztę zsumuj.',
            tags: ['sort', 'pomijanie końców', 'suma kawałka'],
            statement: ['W konkursie skoków n sędziów wystawia noty. Żeby żaden sędzia nie mógł za bardzo pomóc ani zaszkodzić, odrzuca się k najniższych i k najwyższych not. Wynik zawodnika to suma pozostałych not. Oblicz go.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n not — liczb całkowitych.'],
            output_format: ['Jedna liczba — suma not, które zostały.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k i 2k < n', '0 ≤ każda nota ≤ 200'],
            examples: [{ input: '5 1\n170 185 180 120 175', note: 'Odrzucamy 120 i 185, zostaje 170 + 175 + 180 = 525.' }],
            hint: R`Po posortowaniu najniższe noty stoją w pudełkach 0 … k − 1, a najwyższe w n − k … n − 1. Sumuj pętlą od i = k do i < n − k.`,
            check: (inp) => { const a = nums(inp); return a[1] >= 0 && 2 * a[1] < a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 0\n150', '3 1\n200 0 100', '4 0\n1 2 3 4', '5 2\n10 20 30 40 50', t(15, 3, 100, 200), t(1000, 0, 0, 200), t(1000, 499, 0, 200), t(1000, 100, 150, 200)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = asc(a.slice(2, 2 + n)); return String(v.slice(k, n - k).reduce((s, x) => s + x, 0)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int suma = 0;
    for (int i = k; i < n - k; i++) suma += v[i];
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-wicemistrz', krok: 2, level: 'srednie',
            title: 'Wicemistrz',
            short: 'Drugi najlepszy wynik — inny niż najlepszy. Ilu zawodników go ma?',
            tags: ['sort malejąco', 'różne wartości', 'przypadek BRAK'],
            statement: ['Zawodnicy zdobyli punkty. Mistrzami są wszyscy, którzy mają najwięcej punktów. Wicemistrzami są wszyscy, którzy mają drugi najlepszy wynik — największą liczbę punktów mniejszą od wyniku mistrzów. Wypisz wynik wicemistrzów i ich liczbę. Jeśli wszyscy mają tyle samo punktów, wicemistrzów nie ma — wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — punkty zawodników.'],
            output_format: ['Dwie liczby w jednym wierszu (wynik wicemistrzów i ich liczba) albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ punkty ≤ 10⁹'],
            examples: [{ input: '6\n90 75 90 80 80 60', note: 'Mistrzowie mają 90 punktów, wicemistrzowie 80 — jest ich dwóch.' }, { input: '3\n5 5 5' }],
            hint: R`Posortuj malejąco. Pomiń wszystkie wyniki równe v[0] (mistrzów). Jeśli doszedłeś do końca — BRAK. W przeciwnym razie bieżąca liczba to wynik wicemistrzów; policz, ile razy występuje.`,
            tests: (r) => ['1\n7', '2\n7 7', '2\n7 3', '5\n1 2 3 4 5', '6\n9 9 9 1 1 1', fmt(arr(r, 30, 0, 5)), fmt(arr(r, 8000, 0, 1e9)), fmt(arr(r, 10000, 0, 2)), fmt(Array(10000).fill(42))],
            solve: (inp) => { const { v } = czytaj(inp); const m = v.reduce((a, b) => Math.max(a, b)); const reszta = v.filter((x) => x < m); if (!reszta.length) return 'BRAK'; const w = reszta.reduce((a, b) => Math.max(a, b)); return `${w} ${v.filter((x) => x === w).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.rbegin(), v.rend());
    int i = 0;
    while (i < n && v[i] == v[0]) i++;
    if (i == n) {
        cout << "BRAK\n";
        return 0;
    }
    int w = v[i], ile = 0;
    while (i < n && v[i] == w) {
        ile++;
        i++;
    }
    cout << w << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-dwie-druzyny', krok: 2, level: 'srednie',
            title: 'Silni na słabych',
            short: 'Podziel 2n graczy na dwie równe drużyny tak, by różnica sił była jak największa.',
            tags: ['sort', 'n największych', 'n najmniejszych', 'long long'],
            statement: ['Na boisku jest 2n graczy, każdy ma swoją siłę. Trzeba ich podzielić na dwie drużyny po n graczy. Siła drużyny to suma sił jej graczy. Organizator chce, żeby mecz był jak najbardziej jednostronny: różnica między siłą silniejszej a słabszej drużyny ma być jak największa. Wypisz tę największą możliwą różnicę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu 2n liczb — siły graczy.'],
            output_format: ['Jedna liczba — największa możliwa różnica.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ siła ≤ 10⁹'],
            examples: [{ input: '2\n5 1 8 3', note: 'Drużyna 8 + 5 = 13 przeciwko 3 + 1 = 4: różnica 9.' }],
            hint: R`Silniejsza drużyna powinna dostać n najsilniejszych graczy, a słabsza — n najsłabszych. Po sortowaniu to po prostu druga i pierwsza połowa vectora. Sumy mogą sięgać 5·10¹² — użyj long long.`,
            tests: (r) => {
                const t = (n, lo, hi) => `${n}\n${arr(r, 2 * n, lo, hi).join(' ')}`;
                return ['1\n5 5', '1\n0 1000000000', '3\n1 2 3 4 5 6', t(10, 0, 100), t(4000, 0, 1e9), t(5000, 5, 6)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = asc(a.slice(1, 1 + 2 * n)); let s = 0n; for (let i = 0; i < 2 * n; i++) s += BigInt(i < n ? -v[i] : v[i]); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(2 * n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long roznica = 0;
    for (int i = 0; i < n; i++) roznica -= v[i];
    for (int i = n; i < 2 * n; i++) roznica += v[i];
    cout << roznica << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · grupy i sąsiedzi
        {
            id: 'sort-ile-roznych', krok: 3, level: 'latwe',
            title: 'Ile różnych?',
            short: 'Policz, ile różnych wartości jest w ciągu — nawet ogromnych.',
            tags: ['sort', 'v[i] != v[i - 1]', 'liczby do 10⁹'],
            statement: ['Wczytaj n liczb całkowitych i wypisz, ile jest wśród nich różnych wartości.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba różnych wartości.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n5 2 8 2 5 5', note: 'Różne wartości to 2, 5 i 8.' }],
            hint: R`Tablica liczników nie zadziała — liczby są za duże. Posortuj i licz miejsca, w których wartość zmienia się względem poprzedniej: różnych jest 1 + liczba takich miejsc.`,
            tests: (r) => ['1\n0', '3\n1 1 1', '3\n1 2 3', '4\n-1000000000 1000000000 -1000000000 0', fmt(arr(r, 30, 0, 9)), fmt(arr(r, 8000, -1e9, 1e9)), fmt(arr(r, 10000, -500, 500)), fmt(arr(r, 8000, 0, 1).map((x) => x * 1e9))],
            solve: (inp) => String(new Set(czytaj(inp).v).size),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int roznych = 1;
    for (int i = 1; i < n; i++) {
        if (v[i] != v[i - 1]) roznych++;
    }
    cout << roznych << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-bez-powtorzen', krok: 3, level: 'latwe',
            title: 'Bez powtórzeń, po kolei',
            short: 'Zostaw każdą wartość tylko raz i wypisz je rosnąco.',
            tags: ['sort', 'unique', 'erase', 'size()'],
            statement: ['Wczytaj n liczb całkowitych. Usuń powtórzenia tak, żeby każda wartość została dokładnie raz. W pierwszym wierszu wypisz, ile wartości zostało, a w drugim — te wartości rosnąco.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu liczba k, w drugim k różnych wartości rosnąco.'],
            constraints: ['1 ≤ n ≤ 10 000', 'Różnych wartości jest najwyżej 2000.', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n5 2 8 2 5 5' }],
            hint: R`Najpierw sort(v.begin(), v.end());, potem v.erase(unique(v.begin(), v.end()), v.end());. Po tej linijce v.size() to od razu liczba różnych wartości.`,
            check: (inp) => (new Set(czytaj(inp).v).size <= 2000 ? null : 'za dużo różnych'),
            tests: (r) => {
                const z = (k, lo, hi) => { const s = new Set(); while (s.size < k) s.add(r.int(lo, hi)); return [...s]; };
                const t = (n, pula) => fmt(Array.from({ length: n }, () => r.pick(pula)));
                return ['1\n-3', '5\n4 4 4 4 4', '5\n5 4 3 2 1', t(30, z(6, -9, 9)), t(8000, z(2000, -1e9, 1e9)), t(8000, z(3, -1e9, 1e9)), fmt(z(2000, -1e9, 1e9))];
            },
            solve: (inp) => { const u = asc([...new Set(czytaj(inp).v)]); return `${u.length}\n${u.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    cout << v.size() << "\n";
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-ile-razy-kazda', krok: 3, level: 'latwe',
            title: 'Ile razy każda?',
            short: 'Dla każdej wartości wypisz, ile razy wystąpiła — rosnąco według wartości.',
            tags: ['grupy', 'dwa numery i, j', 'j - i'],
            statement: ['Wczytaj n liczb całkowitych. Dla każdej różnej wartości wypisz w osobnym wierszu tę wartość i liczbę jej wystąpień. Wiersze mają iść rosnąco według wartości.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Tyle wierszy, ile różnych wartości: wartość i liczba wystąpień.'],
            constraints: ['1 ≤ n ≤ 10 000', 'Różnych wartości jest najwyżej 1500.', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n5 2 8 2 5 5' }],
            hint: R`Po sortowaniu idź grupa po grupie: i to początek grupy, j przesuwa się w prawo, dopóki v[j] == v[i]. Wypisz v[i] i j − i, a potem i = j. Pamiętaj, żeby w warunku najpierw sprawdzać j < n.`,
            check: (inp) => (new Set(czytaj(inp).v).size <= 1500 ? null : 'za dużo różnych'),
            tests: (r) => {
                const z = (k, lo, hi) => { const s = new Set(); while (s.size < k) s.add(r.int(lo, hi)); return [...s]; };
                const t = (n, pula) => fmt(Array.from({ length: n }, () => r.pick(pula)));
                return ['1\n7', '4\n3 3 3 3', '4\n4 3 2 1', t(20, z(5, -5, 5)), t(8000, z(1500, -1e9, 1e9)), t(8000, z(2, 0, 1e9)), fmt(z(1500, -1e9, 1e9))];
            },
            solve: (inp) => { const v = asc(czytaj(inp).v); const out = []; let i = 0; while (i < v.length) { let j = i; while (j < v.length && v[j] === v[i]) j++; out.push(`${v[i]} ${j - i}`); i = j; } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && v[j] == v[i]) j++;
        cout << v[i] << " " << j - i << "\n";
        i = j;
    }
    return 0;
}`,
        },
        {
            id: 'sort-najczestsza', krok: 3, level: 'latwe',
            title: 'Najczęstsza wartość',
            short: 'Która wartość występuje najczęściej? Przy remisie — najmniejsza.',
            tags: ['grupy', 'najdłuższa grupa', '> a nie >='],
            statement: ['Wczytaj n liczb całkowitych. Znajdź wartość, która występuje najwięcej razy, i wypisz ją razem z liczbą wystąpień. Jeśli kilka wartości występuje tyle samo razy, wybierz najmniejszą z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby: najczęstsza wartość i liczba jej wystąpień.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n4 7 4 1 7 9 7 4', note: 'Czwórki i siódemki występują po 3 razy — wybieramy mniejszą wartość, 4.' }],
            hint: R`Idź grupa po grupie i zapamiętuj najdłuższą. Zmieniaj zapamiętaną wartość tylko wtedy, gdy nowa grupa jest ściśle dłuższa (j − i > najIle) — wtedy przy remisie zostanie wcześniejsza, czyli mniejsza wartość.`,
            tests: (r) => ['1\n-5', '4\n2 1 2 1', '5\n9 8 7 6 5', '6\n-1 -1 3 3 3 -1', fmt(arr(r, 30, 0, 5)), fmt(arr(r, 8000, -1e9, 1e9)), fmt(arr(r, 10000, -50, 50)), fmt(arr(r, 10000, 0, 9))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let bw = v[0], bi = 0, i = 0; while (i < v.length) { let j = i; while (j < v.length && v[j] === v[i]) j++; if (j - i > bi) { bi = j - i; bw = v[i]; } i = j; } return `${bw} ${bi}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int najW = v[0], najIle = 0;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && v[j] == v[i]) j++;
        if (j - i > najIle) {
            najIle = j - i;
            najW = v[i];
        }
        i = j;
    }
    cout << najW << " " << najIle << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-najblizsze-liczby', krok: 3, level: 'latwe',
            title: 'Najbliższe liczby',
            short: 'Które dwie liczby leżą najbliżej siebie? Wystarczy spojrzeć na sąsiadów po sortowaniu.',
            tags: ['sąsiedzi po sortowaniu', 'v[i + 1] - v[i]', 'min'],
            statement: ['Wczytaj n liczb całkowitych (n ≥ 2). Znajdź dwie liczby (stojące na różnych pozycjach), których różnica jest najmniejsza. W pierwszym wierszu wypisz tę najmniejszą różnicę. W drugim wierszu wypisz te dwie liczby, mniejszą pierwszą. Jeśli jest kilka takich par, wybierz tę, w której mniejsza liczba jest najmniejsza.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu najmniejsza różnica, w drugim dwie liczby.'],
            constraints: ['2 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n40 7 22 31 12 60', note: 'Po sortowaniu: 7 12 22 31 40 60. Najmniejsza różnica sąsiadów to 5 (7 i 12).' }, { input: '4\n10 3 10 3', note: 'Różnica 0 mają dwie trójki i dwie dziesiątki — wybieramy trójki.' }],
            hint: R`Po sortowaniu najbliższe liczby zawsze stoją obok siebie. Przejdź po sąsiadach i zapamiętaj pierwszą parę z najmniejszą różnicą (zmieniaj ją tylko przy ściśle mniejszej różnicy). Różnica dwóch liczb rzędu miliarda może przekroczyć int — licz ją w long long.`,
            tests: (r) => ['2\n5 5', '2\n-1000000000 1000000000', '3\n1 5 3', '5\n1 2 4 7 11', fmt(arr(r, 30, -100, 100)), fmt(arr(r, 8000, -1e9, 1e9)), fmt(r.shuffle(Array.from({ length: 10000 }, (_, i) => i * 7 - 30000)))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let bd = Infinity, bi = 0; for (let i = 0; i + 1 < v.length; i++) { const d = v[i + 1] - v[i]; if (d < bd) { bd = d; bi = i; } } return `${bd}\n${v[bi]} ${v[bi + 1]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long najD = v[1] - v[0];
    int gdzie = 0;
    for (int i = 1; i + 1 < n; i++) {
        if (v[i + 1] - v[i] < najD) {
            najD = v[i + 1] - v[i];
            gdzie = i;
        }
    }
    cout << najD << "\n" << v[gdzie] << " " << v[gdzie + 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-najwieksza-przerwa', krok: 3, level: 'latwe',
            title: 'Największa przerwa',
            short: 'Drzewa przy drodze: gdzie jest najdłuższy odcinek bez drzew?',
            tags: ['sort', 'różnice sąsiadów', 'max'],
            statement: ['Przy prostej drodze rośnie n drzew; znasz ich pozycje (w dowolnej kolejności, kilka drzew może rosnąć w tym samym miejscu). Znajdź najdłuższy odcinek drogi między dwoma sąsiednimi drzewami. Wypisz jego długość oraz pozycje drzew na jego końcach. Jeśli takich odcinków jest kilka, wybierz ten, który leży najbardziej na lewo.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n pozycji drzew.'],
            output_format: ['Trzy liczby w jednym wierszu: długość przerwy, pozycja lewego i prawego drzewa.'],
            constraints: ['2 ≤ n ≤ 10 000', '0 ≤ pozycja ≤ 10⁹'],
            examples: [{ input: '6\n40 7 22 31 12 60', note: 'Najdłuższa przerwa jest między drzewami w punktach 40 i 60.' }],
            hint: R`Posortuj pozycje i przejdź po sąsiadach, szukając największej różnicy v[i + 1] − v[i]. Zmieniaj zapamiętaną przerwę tylko przy ściśle większej różnicy — wtedy przy remisie zostanie ta bardziej na lewo.`,
            tests: (r) => ['2\n5 5', '2\n1000000000 0', '4\n1 3 5 7', '5\n0 10 10 30 50', fmt(arr(r, 30, 0, 100)), fmt(arr(r, 8000, 0, 1e9)), fmt(arr(r, 10000, 0, 1000))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let bd = -1, bi = 0; for (let i = 0; i + 1 < v.length; i++) { const d = v[i + 1] - v[i]; if (d > bd) { bd = d; bi = i; } } return `${bd} ${v[bi]} ${v[bi + 1]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int najD = -1, gdzie = 0;
    for (int i = 0; i + 1 < n; i++) {
        if (v[i + 1] - v[i] > najD) {
            najD = v[i + 1] - v[i];
            gdzie = i;
        }
    }
    cout << najD << " " << v[gdzie] << " " << v[gdzie + 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-podobny-wzrost', krok: 3, level: 'srednie',
            title: 'Podobny wzrost',
            short: 'Wybierz k dzieci o jak najbardziej podobnym wzroście.',
            tags: ['okno k elementów', 'v[i + k - 1] - v[i]', 'sort'],
            statement: ['Do zdjęcia w pierwszym rzędzie trzeba wybrać k spośród n dzieci. Fotograf chce, żeby wyglądały równo: różnica między najwyższym a najniższym wybranym dzieckiem ma być jak najmniejsza. Wypisz tę najmniejszą możliwą różnicę.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — wzrost dzieci w centymetrach.'],
            output_format: ['Jedna liczba — najmniejsza możliwa różnica.'],
            constraints: ['1 ≤ k ≤ n ≤ 10 000', '50 ≤ wzrost ≤ 250'],
            examples: [{ input: '6 3\n150 141 163 147 158 144', note: 'Najlepiej wybrać 141, 144 i 147 (albo 144, 147 i 150) — różnica 6.' }],
            hint: R`Po sortowaniu najlepiej wybrać k dzieci stojących kolejno obok siebie. Sprawdź wszystkie takie okna: dla i od 0, dopóki i + k − 1 < n, różnica to v[i + k − 1] − v[i]. Wybierz najmniejszą.`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k) => `${n} ${k}\n${arr(r, n, 50, 250).join(' ')}`;
                return ['1 1\n150', '3 3\n150 160 170', '3 1\n150 160 170', '4 2\n100 200 101 199', t(20, 4), t(10000, 5000), t(10000, 2), t(1000, 999)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = asc(a.slice(2, 2 + n)); let b = Infinity; for (let i = 0; i + k - 1 < n; i++) b = Math.min(b, v[i + k - 1] - v[i]); return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int najlepiej = v[k - 1] - v[0];
    for (int i = 0; i + k - 1 < n; i++) {
        najlepiej = min(najlepiej, v[i + k - 1] - v[i]);
    }
    cout << najlepiej << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-brakujace-numery', krok: 3, level: 'srednie',
            title: 'Brakujące numery',
            short: 'Ile liczb między najmniejszą a największą nie pojawiło się ani razu?',
            tags: ['sort', 'sąsiedzi', 'v[i + 1] - v[i] - 1', 'long long'],
            statement: ['Na loterii sprzedano losy o podanych numerach (numery mogą się powtarzać, bo niektórzy kupili duplikaty). Policz, ile liczb całkowitych z przedziału od najmniejszego do największego sprzedanego numeru nie wystąpiło ani razu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n numerów losów.'],
            output_format: ['Jedna liczba — ile numerów brakuje.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ numer ≤ 10⁹'],
            examples: [{ input: '6\n5 2 9 5 4 2', note: 'Między 2 a 9 brakuje numerów 3, 6, 7 i 8.' }],
            hint: R`Tablica liczników nie zadziała dla numerów do miliarda. Posortuj: między sąsiadami v[i] < v[i + 1] brakuje dokładnie v[i + 1] − v[i] − 1 liczb, a równi sąsiedzi niczego nie dokładają. Suma może przekroczyć int — użyj long long.`,
            tests: (r) => ['1\n7', '2\n1 1', '2\n-1000000000 1000000000', '3\n3 1 2', '5\n10 10 20 20 30', fmt(arr(r, 30, 0, 60)), fmt(arr(r, 8000, -1e9, 1e9)), fmt(arr(r, 10000, -50000, 50000))],
            solve: (inp) => { const u = asc([...new Set(czytaj(inp).v)]); return String(u[u.length - 1] - u[0] + 1 - u.length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long brak = 0;
    for (int i = 0; i + 1 < n; i++) {
        if (v[i + 1] > v[i]) brak += v[i + 1] - v[i] - 1;
    }
    cout << brak << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · sortowanie ręcznie
        {
            id: 'sort-wybieranie-kroki', krok: 4, level: 'latwe',
            title: 'Wybieranie krok po kroku',
            short: 'Napisz sortowanie przez wybieranie i wypisz ciąg po każdej rundzie.',
            tags: ['pętla w pętli', 'numer najmniejszego m', 'swap'],
            statement: ['Posortuj ciąg n liczb metodą przez wybieranie: w rundzie numer i (i = 0, 1, …, n − 2) znajdź najmniejszą liczbę w kawałku od pozycji i do końca (jeśli najmniejsza występuje kilka razy — tę najbardziej na lewo) i zamień ją z liczbą na pozycji i (jeśli to ta sama pozycja, nic się nie zmienia). Po każdej rundzie wypisz cały ciąg w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n − 1 wierszy — ciąg po każdej rundzie.'],
            constraints: ['2 ≤ n ≤ 50', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '5\n5 2 4 1 3', note: 'W rundzie 1 (drugi wiersz) najmniejsza z 2 4 5 3 już stoi na miejscu, więc ciąg się nie zmienia.' }],
            hint: R`Dla każdego i od 0 do n − 2: int m = i; potem pętla j od i + 1 do n − 1 i if (v[j] < v[m]) m = j; (znak < zostawia najbardziej lewą z równych). Po pętli swap(v[i], v[m]); i wypisz cały vector.`,
            tests: (r) => ['2\n1 2', '2\n2 1', '4\n7 7 7 7', '5\n5 4 3 2 1', fmt(arr(r, 10, -9, 9)), fmt(arr(r, 50, -1000, 1000)), fmt(arr(r, 50, 0, 2))],
            solve: (inp) => { const v = czytaj(inp).v; const n = v.length; const out = []; for (let i = 0; i < n - 1; i++) { let m = i; for (let j = i + 1; j < n; j++) if (v[j] < v[m]) m = j; [v[i], v[m]] = [v[m], v[i]]; out.push(v.join(' ')); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[m]) m = j;
        }
        swap(v[i], v[m]);
        for (auto x : v) cout << x << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-babelki-rundy', krok: 4, level: 'srednie',
            title: 'Rundy bąbelków',
            short: 'Sortowanie bąbelkowe z flagą: wypisz ciąg po każdej rundzie i policz rundy.',
            tags: ['swap sąsiadów', 'flaga bool', 'break', 'n - 1 - runda'],
            statement: ['Posortuj ciąg n liczb metodą bąbelkową. W rundzie numer r (r = 0, 1, 2, …) porównujesz po kolei pary sąsiadów na pozycjach (0, 1), (1, 2), …, (n − 2 − r, n − 1 − r) i zamieniasz parę, jeśli lewa liczba jest większa od prawej. Po każdej rundzie wypisz cały ciąg. Algorytm kończy się po rundzie, w której nie było żadnej zamiany (ta runda też jest wypisywana), albo po n − 1 rundach. Na koniec wypisz liczbę wykonanych rund.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Ciąg po każdej wykonanej rundzie (każdy w osobnym wierszu), a w ostatnim wierszu liczba rund.'],
            constraints: ['1 ≤ n ≤ 50', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '5\n5 1 4 2 8', note: 'W trzeciej rundzie nie ma już zamian — wypisujemy ją i kończymy.' }, { input: '3\n3 2 1', note: 'Każda z n − 1 = 2 rund ma zamiany, więc algorytm kończy się po nich.' }],
            hint: R`Zewnętrzna pętla: for (int runda = 0; runda < n - 1; runda++), w niej bool bylaZamiana = false; i wewnętrzna pętla po j, dopóki j + 1 < n - runda. Po wewnętrznej pętli wypisz vector i zwiększ licznik rund, a dopiero potem if (!bylaZamiana) break;.`,
            tests: (r) => ['1\n5', '2\n1 2', '2\n2 1', '4\n1 2 3 4', '3\n3 2 1', fmt(arr(r, 10, -9, 9)), fmt(arr(r, 50, -1000, 1000)), fmt([...Array.from({ length: 49 }, (_, i) => i), -5]), fmt(Array.from({ length: 50 }, (_, i) => 50 - i))],
            solve: (inp) => { const v = czytaj(inp).v; const n = v.length; const out = []; let rund = 0; for (let r = 0; r < n - 1; r++) { let z = false; for (let j = 0; j + 1 < n - r; j++) if (v[j] > v[j + 1]) { [v[j], v[j + 1]] = [v[j + 1], v[j]]; z = true; } out.push(v.join(' ')); rund++; if (!z) break; } out.push(String(rund)); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int rund = 0;
    for (int runda = 0; runda < n - 1; runda++) {
        bool bylaZamiana = false;
        for (int j = 0; j + 1 < n - runda; j++) {
            if (v[j] > v[j + 1]) {
                swap(v[j], v[j + 1]);
                bylaZamiana = true;
            }
        }
        for (auto x : v) cout << x << " ";
        cout << "\n";
        rund++;
        if (!bylaZamiana) break;
    }
    cout << rund << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-ile-zamian', krok: 4, level: 'latwe',
            title: 'Ile zamian zrobią bąbelki?',
            short: 'Policz zamiany sortowania bąbelkowego — czyli pary w złej kolejności.',
            tags: ['sortowanie bąbelkowe', 'licznik zamian', 'inwersje'],
            statement: ['Sortowanie bąbelkowe zamienia sąsiadów, którzy stoją w złej kolejności (lewy większy od prawego), aż cały ciąg będzie posortowany niemalejąco. Wypisz, ile zamian wykona dla podanego ciągu. Równe sąsiednie liczby nie są zamieniane.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba zamian.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n5 1 4 2 8', note: 'Pary w złej kolejności: (5, 1), (5, 4), (5, 2), (4, 2).' }],
            hint: R`Napisz zwykłe sortowanie bąbelkowe i zwiększaj licznik przy każdym swap. Dla n = 2000 to około 2 miliony porównań — zdąży. (Ciekawostka: wynik to liczba par i < j, w których v[i] > v[j].)`,
            tests: (r) => ['1\n5', '3\n1 2 3', '3\n3 2 1', '4\n2 2 2 2', '4\n2 1 2 1', fmt(arr(r, 30, 0, 9)), fmt(arr(r, 2000, -1e9, 1e9)), fmt(Array.from({ length: 2000 }, (_, i) => 2000 - i)), fmt(arr(r, 2000, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; let z = 0; for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (v[i] > v[j]) z++; return String(z); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    long long zamian = 0;
    for (int runda = 0; runda < n - 1; runda++) {
        for (int j = 0; j + 1 < n - runda; j++) {
            if (v[j] > v[j + 1]) {
                swap(v[j], v[j + 1]);
                zamian++;
            }
        }
    }
    cout << zamian << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-karty-w-rece', krok: 4, level: 'latwe',
            title: 'Karty w ręce',
            short: 'Sortowanie przez wstawianie: wypisz rękę po wsunięciu każdej kolejnej karty.',
            tags: ['wstawianie', 'while (j >= 0 && v[j] > x)', 'przesuwanie w prawo'],
            statement: ['Dostajesz po kolei n kart z liczbami. Układasz je w ręce metodą przez wstawianie: lewa część ręki jest już ułożona niemalejąco, a każdą nową kartę wsuwasz na właściwe miejsce, przesuwając w prawo wszystkie karty z większymi liczbami. Karta z równą liczbą zostaje przed nową kartą. Po wsunięciu każdej karty od drugiej do ostatniej wypisz cały ciąg (wraz z kartami, które jeszcze czekają).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — karty w kolejności dostawania.'],
            output_format: ['n − 1 wierszy — ciąg po każdym wsunięciu.'],
            constraints: ['2 ≤ n ≤ 50', '1 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '5\n7 3 5 1 6' }],
            hint: R`Dla i od 1 do n − 1: int x = v[i], j = i - 1; dopóki j >= 0 i v[j] > x, przepisuj v[j + 1] = v[j] i zmniejszaj j. Na koniec v[j + 1] = x; i wypisz vector.`,
            tests: (r) => ['2\n1 1', '2\n2 1', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 10, 1, 9)), fmt(arr(r, 50, 1, 1000)), fmt(arr(r, 50, 1, 3))],
            solve: (inp) => { const v = czytaj(inp).v; const out = []; for (let i = 1; i < v.length; i++) { const x = v[i]; let j = i - 1; while (j >= 0 && v[j] > x) { v[j + 1] = v[j]; j--; } v[j + 1] = x; out.push(v.join(' ')); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    for (int i = 1; i < n; i++) {
        int x = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > x) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = x;
        for (auto y : v) cout << y << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-oceny-zliczanie', krok: 4, level: 'latwe',
            title: 'Oceny od 1 do 6',
            short: 'Posortuj oceny licznikami — bez ani jednego porównania.',
            tags: ['sortowanie przez zliczanie', 'licznik[x]++', 'vector<int> licznik(7)'],
            statement: ['Klasa dostała n ocen od 1 do 6. W pierwszym wierszu wypisz wszystkie oceny niemalejąco. W drugim wierszu wypisz sześć liczb: ile było jedynek, dwójek, …, szóstek.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n ocen.'],
            output_format: ['W pierwszym wierszu n ocen niemalejąco, w drugim sześć liczb.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ każda ocena ≤ 6'],
            examples: [{ input: '8\n4 6 3 4 5 2 4 6' }],
            hint: R`Zrób vector<int> licznik(7, 0); i dla każdej oceny x zrób licznik[x]++. Potem dla w od 1 do 6 wypisz w dokładnie licznik[w] razy. Drugi wiersz to same liczniki.`,
            tests: (r) => ['1\n6', '6\n1 2 3 4 5 6', '5\n3 3 3 3 3', fmt(arr(r, 40, 1, 6)), fmt(arr(r, 10000, 1, 6)), fmt(arr(r, 10000, 5, 6))],
            solve: (inp) => { const v = czytaj(inp).v; const c = [0, 0, 0, 0, 0, 0, 0]; v.forEach((x) => c[x]++); return `${asc(v).join(' ')}\n${c.slice(1).join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> licznik(7, 0);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        licznik[x]++;
    }
    for (int w = 1; w <= 6; w++) {
        for (int k = 0; k < licznik[w]; k++) cout << w << " ";
    }
    cout << "\n";
    for (int w = 1; w <= 6; w++) cout << licznik[w] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-wybieranie-czy-babelki', krok: 4, level: 'srednie',
            title: 'Wybieranie czy bąbelki?',
            short: 'Która metoda zrobi mniej zamian na tym samym ciągu?',
            tags: ['dwie metody', 'kopia vectora', 'licznik zamian'],
            statement: ['Ten sam ciąg n liczb sortujemy niemalejąco dwiema metodami. Sortowanie przez wybieranie (jak w lekcji: w rundzie i wybieramy najmniejszą liczbę z kawałka od i do końca — przy remisie najbardziej na lewo — i zamieniamy ją z liczbą na pozycji i) liczy zamianę tylko wtedy, gdy zamienia dwie różne pozycje. Sortowanie bąbelkowe liczy każdą zamianę sąsiadów. Wypisz liczbę zamian obu metod, a w drugim wierszu WYBIERANIE, BABELKI albo REMIS — która metoda wykonała mniej zamian.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu dwie liczby: zamiany wybierania i bąbelków.', 'W drugim wierszu WYBIERANIE, BABELKI albo REMIS.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n5 1 4 2 8', note: 'Wybieranie: zamiany 5↔1 i 5↔2 (dwie). Bąbelki: cztery.' }],
            hint: R`Zrób dwie kopie wczytanego vectora i posortuj każdą swoją metodą, licząc zamiany. W wybieraniu zwiększaj licznik tylko wtedy, gdy m != i. Wybieranie robi najwyżej n − 1 zamian, a bąbelki — tyle, ile par w złej kolejności.`,
            tests: (r) => ['1\n3', '2\n1 2', '2\n2 1', '3\n2 3 1', '4\n4 3 2 1', fmt(arr(r, 30, 0, 9)), fmt(arr(r, 2000, -1e9, 1e9)), fmt([...Array.from({ length: 1999 }, (_, i) => i + 1), 0]), fmt(Array.from({ length: 2000 }, (_, i) => (i % 2 ? i - 1 : i + 1)))],
            solve: (inp) => {
                const v0 = czytaj(inp).v; const n = v0.length;
                const a = v0.slice(); let zw = 0;
                for (let i = 0; i < n - 1; i++) { let m = i; for (let j = i + 1; j < n; j++) if (a[j] < a[m]) m = j; if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; zw++; } }
                let zb = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (v0[i] > v0[j]) zb++;
                return `${zw} ${zb}\n${zw < zb ? 'WYBIERANIE' : zb < zw ? 'BABELKI' : 'REMIS'}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> a = v, b = v;
    long long zw = 0, zb = 0;
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[m]) m = j;
        }
        if (m != i) {
            swap(a[i], a[m]);
            zw++;
        }
    }
    for (int runda = 0; runda < n - 1; runda++) {
        for (int j = 0; j + 1 < n - runda; j++) {
            if (b[j] > b[j + 1]) {
                swap(b[j], b[j + 1]);
                zb++;
            }
        }
    }
    cout << zw << " " << zb << "\n";
    if (zw < zb) cout << "WYBIERANIE\n";
    else if (zb < zw) cout << "BABELKI\n";
    else cout << "REMIS\n";
    return 0;
}`,
        },
        {
            id: 'sort-nalesniki', krok: 4, level: 'srednie',
            title: 'Sortowanie naleśnikowe',
            short: 'Jedyny dozwolony ruch: odwróć k górnych naleśników. Ułóż stos od najmniejszego.',
            tags: ['reverse na kawałku', 'pozycja największego', 'symulacja'],
            statement: ['Na talerzu leży stos n naleśników o różnych rozmiarach 1, 2, …, n (podanych od góry do dołu). Jedyny dozwolony ruch to przewrót: wsuwasz łopatkę pod k-ty naleśnik od góry i odwracasz całą górną część — kolejność k górnych naleśników się odwraca. Chcemy, żeby na górze leżał najmniejszy, a na dole największy. Postępuj tak: dla rozmiaru s = n, n − 1, …, 2 znajdź pozycję p (licząc od 1, od góry) naleśnika o rozmiarze s. Jeśli p = s, naleśnik już leży na miejscu — nic nie rób. W przeciwnym razie: jeśli p > 1, przewróć p górnych naleśników (największy z nich trafi na górę), a potem przewróć s górnych (trafi na pozycję s). Wypisz liczbę przewrotów i ich rozmiary k w kolejności wykonywania.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb od 1 do n — rozmiary naleśników od góry do dołu.'],
            output_format: ['W pierwszym wierszu liczba przewrotów m.', 'W drugim wierszu m liczb — rozmiary kolejnych przewrotów (gdy m = 0, drugi wiersz jest pusty).'],
            constraints: ['1 ≤ n ≤ 30'],
            examples: [{ input: '4\n3 1 4 2', note: 's = 4 jest na pozycji 3: przewroty 3 (4 1 3 2) i 4 (2 3 1 4). s = 3 na pozycji 2: przewroty 2 (3 2 1 4) i 3 (1 2 3 4). s = 2 już leży na miejscu.' }],
            hint: R`Trzymaj stos w vectorze (pozycja p to pudełko p − 1). Przewrót k górnych to reverse(v.begin(), v.begin() + k);. Pozycję naleśnika s znajdziesz przez find(v.begin(), v.end(), s) - v.begin() + 1. Zapisuj rozmiary przewrotów w osobnym vectorze, a na końcu wypisz jego rozmiar i zawartość.`,
            tests: (r) => {
                const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                return ['1\n1', '2\n1 2', '2\n2 1', '3\n3 2 1', '5\n1 2 3 4 5', '5\n5 4 3 2 1', fmt(perm(8)), fmt(perm(20)), fmt(perm(30)), fmt(perm(30))];
            },
            solve: (inp) => {
                const v = czytaj(inp).v; const n = v.length; const ruchy = [];
                const flip = (k) => { const g = v.slice(0, k).reverse(); for (let i = 0; i < k; i++) v[i] = g[i]; ruchy.push(k); };
                for (let s = n; s >= 2; s--) { const p = v.indexOf(s) + 1; if (p === s) continue; if (p > 1) flip(p); flip(s); }
                return `${ruchy.length}\n${ruchy.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> ruchy;
    for (int s = n; s >= 2; s--) {
        int p = find(v.begin(), v.end(), s) - v.begin() + 1;
        if (p == s) continue;
        if (p > 1) {
            reverse(v.begin(), v.begin() + p);
            ruchy.push_back(p);
        }
        reverse(v.begin(), v.begin() + s);
        ruchy.push_back(s);
    }
    cout << ruchy.size() << "\n";
    for (auto k : ruchy) cout << k << " ";
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 5 · własna reguła
        {
            id: 'sort-ostatnia-cyfra', krok: 5, level: 'latwe',
            title: 'Według ostatniej cyfry',
            short: 'Ustaw liczby według ostatniej cyfry, a przy remisie — według wartości.',
            tags: ['lambda', 'x % 10', 'drugie kryterium'],
            statement: ['Wczytaj n liczb naturalnych i wypisz je posortowane według ostatniej cyfry (od 0 do 9). Liczby z tą samą ostatnią cyfrą mają stać rosnąco.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n23 15 42 11 30 21 5' }],
            hint: R`Reguła: if (a % 10 != b % 10) return a % 10 < b % 10; a potem return a < b;. Cała reguła to trzeci argument sort: sort(v.begin(), v.end(), [](int a, int b) { … });.`,
            tests: (r) => ['1\n7', '3\n21 11 1', '4\n9 19 8 18', fmt(arr(r, 30, 0, 100)), fmt(arr(r, 2000, 0, 1e9)), fmt(arr(r, 2000, 0, 30))],
            solve: (inp) => czytaj(inp).v.sort((a, b) => (a % 10 - b % 10) || (a - b)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), [](int a, int b) {
        if (a % 10 != b % 10) return a % 10 < b % 10;
        return a < b;
    });
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-najblizej-zera', krok: 5, level: 'latwe',
            title: 'Najbliżej zera',
            short: 'Ustaw liczby od najbliższej zeru; przy remisie ujemna przed dodatnią.',
            tags: ['lambda', 'abs', 'remis: a < b'],
            statement: ['Wczytaj n liczb całkowitych i wypisz je posortowane według odległości od zera (wartości bezwzględnej), od najmniejszej. Jeśli dwie liczby są tak samo daleko od zera (na przykład −3 i 3), ujemna stoi pierwsza.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n3 -2 2 -5 0 -3' }],
            hint: R`Reguła: if (abs(a) != abs(b)) return abs(a) < abs(b); return a < b;. Przy remisie odległości wygrywa mniejsza liczba, czyli ujemna.`,
            tests: (r) => ['1\n0', '2\n5 -5', '4\n-1 -2 -3 -4', fmt(arr(r, 30, -10, 10)), fmt(arr(r, 2000, -1e9, 1e9)), fmt(arr(r, 2000, -3, 3))],
            solve: (inp) => czytaj(inp).v.sort((a, b) => (Math.abs(a) - Math.abs(b)) || (a - b)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), [](int a, int b) {
        if (abs(a) != abs(b)) return abs(a) < abs(b);
        return a < b;
    });
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-parzyste-przodem', krok: 5, level: 'latwe',
            title: 'Parzyste przodem',
            short: 'Najpierw parzyste rosnąco, potem nieparzyste malejąco.',
            tags: ['lambda', 'bool pa, pb', 'return pa', 'liczby ujemne'],
            statement: ['Wczytaj n liczb całkowitych i wypisz je tak: najpierw wszystkie liczby parzyste, od najmniejszej do największej, a potem wszystkie nieparzyste, od największej do najmniejszej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n7 4 -3 10 1 -6 8' }],
            hint: R`W regule zapisz bool pa = (a % 2 == 0), pb = (b % 2 == 0);. Gdy pa != pb, zwróć pa. Gdy obie są parzyste — a < b, gdy obie nieparzyste — a > b. Warunek x % 2 == 0 działa też dla liczb ujemnych.`,
            tests: (r) => ['1\n-1', '2\n1 2', '4\n-4 -3 -2 -1', '4\n5 3 7 1', fmt(arr(r, 30, -20, 20)), fmt(arr(r, 2000, -1e9, 1e9))],
            solve: (inp) => { const v = czytaj(inp).v; const p = asc(v.filter((x) => x % 2 === 0)); const q = desc(v.filter((x) => x % 2 !== 0)); return [...p, ...q].join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), [](int a, int b) {
        bool pa = (a % 2 == 0), pb = (b % 2 == 0);
        if (pa != pb) return pa;
        if (pa) return a < b;
        return a > b;
    });
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-od-najkrotszego', krok: 5, level: 'latwe',
            title: 'Od najkrótszego',
            short: 'Słowa od najkrótszego; słowa tej samej długości — alfabetycznie.',
            tags: ['vector<string>', 'lambda', 'a.size()', 'a < b'],
            statement: ['Wczytaj n słów i wypisz je w jednym wierszu, od najkrótszego do najdłuższego. Słowa tej samej długości mają stać alfabetycznie. Słowa składają się z małych liter angielskich i mogą się powtarzać.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów.'],
            output_format: ['Jeden wiersz: n słów w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '6\npies kot zebra mysz lew ara' }],
            hint: R`Reguła dla napisów: [](string a, string b) { if (a.size() != b.size()) return a.size() < b.size(); return a < b; }.`,
            tests: (r) => ['1\nkot', '3\nccc bb a', '4\nab aa ba bb', `20\n${Array.from({ length: 20 }, () => slowo(r, 1, 5)).join(' ')}`, `2000\n${Array.from({ length: 2000 }, () => (r() < 0.3 ? r.pick(SLOWA) : slowo(r, 1, 10))).join(' ')}`],
            solve: (inp) => toks(inp).slice(1).sort((a, b) => (a.length - b.length) || (a < b ? -1 : a > b ? 1 : 0)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end(), [](string a, string b) {
        if (a.size() != b.size()) return a.size() < b.size();
        return a < b;
    });
    for (auto x : s) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-suma-cyfr', krok: 5, level: 'srednie',
            title: 'Według sumy cyfr',
            short: 'Reguła, która liczy: sortuj według sumy cyfr, a przy remisie według wartości.',
            tags: ['lambda z pętlą while', 'x % 10, x / 10', 'drugie kryterium'],
            statement: ['Wczytaj n liczb naturalnych i wypisz je posortowane według sumy cyfr, rosnąco. Liczby o tej samej sumie cyfr mają stać rosnąco według wartości.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n91 8 125 44 70 17', note: 'Sumy cyfr: 10, 8, 8, 8, 7, 8.' }],
            hint: R`W regule policz sumy cyfr a i b pętlą while (x > 0) { s += x % 10; x /= 10; } — na osobnej zmiennej x. Potem: if (sa != sb) return sa < sb; return a < b;. Liczba 0 ma sumę cyfr 0.`,
            tests: (r) => ['1\n0', '3\n100 10 1', '4\n19 91 28 82', fmt(arr(r, 30, 0, 200)), fmt(arr(r, 2000, 0, 1e9)), fmt(arr(r, 2000, 0, 10000))],
            solve: (inp) => czytaj(inp).v.sort((a, b) => (sumaCyfr(a) - sumaCyfr(b)) || (a - b)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), [](int a, int b) {
        int sa = 0, sb = 0;
        int x = a;
        while (x > 0) { sa += x % 10; x /= 10; }
        x = b;
        while (x > 0) { sb += x % 10; x /= 10; }
        if (sa != sb) return sa < sb;
        return a < b;
    });
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-najblizej-celu', krok: 5, level: 'latwe',
            title: 'Najbliżej celu',
            short: 'Ustaw liczby od najbliższej do liczby k. Reguła musi widzieć k — [&].',
            tags: ['[&]', 'abs(a - k)', 'remis: mniejsza'],
            statement: ['Wczytaj liczbę k oraz n liczb całkowitych. Wypisz te liczby posortowane według odległości od k, od najbliższej. Jeśli dwie liczby są tak samo daleko od k, mniejsza stoi pierwsza.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁸ ≤ k ≤ 10⁸', '−10⁸ ≤ każda liczba ≤ 10⁸'],
            examples: [{ input: '6 10\n1 12 8 20 10 15' }],
            hint: R`Reguła z pustymi nawiasami [] nie widzi k. Napisz [&](int a, int b) { if (abs(a - k) != abs(b - k)) return abs(a - k) < abs(b - k); return a < b; }.`,
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 0\n5', '2 0\n3 -3', '3 5\n4 6 5', t(30, 3, -10, 10), t(2000, r.int(-1e8, 1e8), -1e8, 1e8), t(2000, 0, -5, 5), t(2000, -100000000, -1e8, 1e8)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; return a.slice(2, 2 + n).sort((x, y) => (Math.abs(x - k) - Math.abs(y - k)) || (x - y)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), [&](int a, int b) {
        if (abs(a - k) != abs(b - k)) return abs(a - k) < abs(b - k);
        return a < b;
    });
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-bez-wielkosci-liter', krok: 5, level: 'srednie',
            title: 'Alfabet bez wielkich liter',
            short: 'Sortuj słowa alfabetycznie, nie zwracając uwagi na wielkość liter.',
            tags: ['lambda', 'tolower', 'kopie napisów', 'remis'],
            statement: ['Wczytaj n słów złożonych z wielkich i małych liter angielskich. Wypisz je posortowane alfabetycznie bez względu na wielkość liter — tak, jakby wszystkie litery były małe (wtedy „ala” stoi przed „Zosia”). Jeśli dwa słowa po zamianie na małe litery są identyczne (np. „Kot” i „kot”), rozstrzyga zwykłe porównanie napisów, w którym wielkie litery są przed małymi.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów.'],
            output_format: ['Jeden wiersz: n słów w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '5\nZosia ala Kot kot Ala', note: 'Bez wielkości liter: ala = Ala, kot = Kot, potem zosia. Remisy: „Ala” przed „ala”, „Kot” przed „kot”.' }],
            hint: R`W regule zrób kopie: string x = a, y = b; i zamień w nich litery na małe pętlą for (auto &c : x) c = tolower(c);. Jeśli x != y — zwróć x < y, w przeciwnym razie a < b.`,
            tests: (r) => {
                const mix = (w) => w.split('').map((c) => (r() < 0.3 ? c.toUpperCase() : c)).join('');
                const t = (n) => `${n}\n${Array.from({ length: n }, () => mix(r() < 0.4 ? r.pick(SLOWA) : slowo(r, 1, 10))).join(' ')}`;
                return ['1\nA', '3\nb B a', '4\nKOT kot Kot kOt', '3\nab AB Ab', t(30), t(1000)];
            },
            solve: (inp) => toks(inp).slice(1).sort((a, b) => { const x = a.toLowerCase(), y = b.toLowerCase(); if (x !== y) return x < y ? -1 : 1; return a < b ? -1 : a > b ? 1 : 0; }).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end(), [](string a, string b) {
        string x = a, y = b;
        for (auto &c : x) c = tolower(c);
        for (auto &c : y) c = tolower(c);
        if (x != y) return x < y;
        return a < b;
    });
    for (auto x : s) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-reszta', krok: 5, level: 'latwe',
            title: 'Reszta z dzielenia',
            short: 'Sortuj według reszty z dzielenia przez k; przy remisie większa liczba pierwsza.',
            tags: ['[&]', 'x % k', 'remis: a > b'],
            statement: ['Wczytaj liczbę k oraz n liczb naturalnych. Wypisz te liczby posortowane według reszty z dzielenia przez k, rosnąco. Liczby z tą samą resztą mają stać od największej do najmniejszej.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ k ≤ 1000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 3\n4 9 5 12 7 1', note: 'Reszty: 4 → 1, 9 → 0, 5 → 2, 12 → 0, 7 → 1, 1 → 1.' }],
            hint: R`Reguła potrzebuje k, więc [&]: if (a % k != b % k) return a % k < b % k; return a > b;.`,
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n5', '3 1\n1 2 3', '4 2\n1 2 3 4', t(30, 5, 0, 50), t(2000, 1000, 0, 1e9), t(2000, 7, 0, 100)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; return a.slice(2, 2 + n).sort((x, y) => (x % k - y % k) || (y - x)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end(), [&](int a, int b) {
        if (a % k != b % k) return a % k < b % k;
        return a > b;
    });
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
    ];
};
