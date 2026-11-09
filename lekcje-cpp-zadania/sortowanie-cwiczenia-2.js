// Sortowanie — ćwiczenia w trakcie lekcji, części 6–9: kilka kryteriów naraz (pary, sztuczka z minusem, reguła dla par,
// stable_sort, punkty według odległości), sortowanie numerów (reguła [&], rekordy w kilku vectorach, miejsca ex aequo,
// kompresja), szukanie w posortowanym (połowienie, binary_search, lower_bound, upper_bound) oraz pomysły zachłanne
// (budżet, kolejka, łódki, iloczyny, ciastka, pary, zmiana znaków).
// Uczeń zna pierwszy etap, tablice, napisy, pary i vector — ale jeszcze nie funkcje ani rekurencję.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const KRAJE = ['POL', 'GER', 'CZE', 'SVK', 'UKR', 'LTU', 'FRA', 'ITA', 'ESP', 'NOR'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const asc = (a) => a.slice().sort((x, y) => x - y);
    const cmpS = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
    const imie = (r) => (r() < 0.6 ? r.pick(IMIONA) : (() => { const w = r.word(r.int(2, 8)); return w[0].toUpperCase() + w.slice(1); })());
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]), reszta: a.slice(1 + a[0]) }; };
    // pierwsze miejsce ≥ x (lower_bound) i > x (upper_bound) w posortowanej tablicy
    const lb = (v, x) => { let l = 0, r = v.length; while (l < r) { const s = (l + r) >> 1; if (v[s] < x) l = s + 1; else r = s; } return l; };
    const ub = (v, x) => { let l = 0, r = v.length; while (l < r) { const s = (l + r) >> 1; if (v[s] <= x) l = s + 1; else r = s; } return l; };
    // wejście: n, q, n liczb, q zapytań po k liczb
    const zapytania = (inp, k) => { const a = nums(inp); const [n, q] = a; const v = a.slice(2, 2 + n); const z = []; for (let i = 0; i < q; i++) z.push(a.slice(2 + n + i * k, 2 + n + (i + 1) * k)); return { n, q, v, z }; };

    return [
        // ================================================================ KROK 6 · kilka kryteriów
        {
            id: 'sort-minus', krok: 6, level: 'latwe',
            title: 'Sztuczka z minusem',
            short: 'Więcej punktów wyżej, a przy remisie krótszy czas wyżej — bez pisania reguły.',
            tags: ['vector<pair<int, int>>', '(-punkty, czas)', 'sort par'],
            statement: ['Zawodnicy zdobyli punkty i mieli swoje czasy. W rankingu wyżej stoi zawodnik z większą liczbą punktów, a przy równych punktach — ten z krótszym czasem. Wypisz pary „punkty czas” w kolejności rankingu, od najlepszego.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby: punkty i czas.'],
            output_format: ['n wierszy „punkty czas” w kolejności rankingu.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ punkty ≤ 1000', '1 ≤ czas ≤ 100 000'],
            examples: [{ input: '5\n75 300\n90 410\n75 250\n60 120\n90 380' }],
            hint: R`Zapisz każdego zawodnika jako parę (-punkty, czas) i posortuj zwykłym sort. Rosnąco po minus punktach to malejąco po punktach, a przy remisie pary porównują second — czas rosnąco. Wypisując, zmień znak z powrotem.`,
            tests: (r) => {
                const t = (n, pmax, cmax) => `${n}\n${Array.from({ length: n }, () => `${r.int(0, pmax)} ${r.int(1, cmax)}`).join('\n')}`;
                return ['1\n0 1', '3\n5 30\n5 20\n5 10', '3\n1 9\n2 9\n3 9', t(20, 5, 50), t(2000, 1000, 100000), t(2000, 3, 5)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const p = []; for (let i = 0; i < n; i++) p.push([a[1 + 2 * i], a[2 + 2 * i]]); p.sort((x, y) => (y[0] - x[0]) || (x[1] - y[1])); return p.map((x) => x.join(' ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> w(n);
    for (auto &[mp, czas] : w) {
        int punkty;
        cin >> punkty >> czas;
        mp = -punkty;
    }
    sort(w.begin(), w.end());
    for (auto [mp, czas] : w) cout << -mp << " " << czas << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-punkty-od-lewej', krok: 6, level: 'latwe',
            title: 'Punkty od lewej',
            short: 'Punkty od lewej do prawej, a te nad sobą — od góry do dołu.',
            tags: ['pary (x, y)', 'reguła dla par', 'y malejąco'],
            statement: ['Na płaszczyźnie leży n punktów. Wypisz je od lewej do prawej, czyli według x rosnąco. Punkty o tym samym x (leżące jeden nad drugim) wypisz od góry do dołu, czyli według y malejąco.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby całkowite x i y.'],
            output_format: ['n wierszy „x y” w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', '−1000 ≤ x, y ≤ 1000'],
            examples: [{ input: '5\n2 1\n0 5\n2 7\n-1 3\n0 -2' }],
            hint: R`Reguła dla par: if (a.first != b.first) return a.first < b.first; return a.second > b.second;. Można też zapisać parę (x, -y) i posortować zwykłym sort.`,
            tests: (r) => {
                const t = (n, m) => `${n}\n${Array.from({ length: n }, () => `${r.int(-m, m)} ${r.int(-m, m)}`).join('\n')}`;
                return ['1\n0 0', '3\n1 1\n1 2\n1 3', '3\n3 0\n2 0\n1 0', t(20, 3), t(2000, 1000), t(2000, 5)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const p = []; for (let i = 0; i < n; i++) p.push([a[1 + 2 * i], a[2 + 2 * i]]); p.sort((x, y) => (x[0] - y[0]) || (y[1] - x[1])); return p.map((x) => x.join(' ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> p(n);
    for (auto &[x, y] : p) cin >> x >> y;
    sort(p.begin(), p.end(), [](pair<int, int> a, pair<int, int> b) {
        if (a.first != b.first) return a.first < b.first;
        return a.second > b.second;
    });
    for (auto [x, y] : p) cout << x << " " << y << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-lista-klas', krok: 6, level: 'latwe',
            title: 'Lista według klas',
            short: 'Pogrupuj uczniów według klas, ale w każdej klasie zostaw kolejność zapisów.',
            tags: ['stable_sort', 'reguła tylko po klasie', 'pair<string, string>'],
            statement: ['Uczniowie zapisywali się na wycieczkę po kolei, podając imię i klasę (np. 2b). Wypisz listę pogrupowaną według klas: klasy w porządku słownikowym (1a, 1b, 2a, …), a uczniów z tej samej klasy — w kolejności, w jakiej się zapisywali. Każdy wiersz ma postać „klasa imię”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię i klasa.'],
            output_format: ['n wierszy „klasa imię”.'],
            constraints: ['1 ≤ n ≤ 1000', 'Klasa to cyfra od 1 do 8 i mała litera.', 'Imię ma od 2 do 9 liter.'],
            examples: [{ input: '5\nZosia 2a\nAdam 1b\nOla 2a\nBartek 1b\nAla 2a', note: 'W klasie 2a kolejność zapisów to Zosia, Ola, Ala — choć alfabetycznie byłoby inaczej.' }],
            hint: R`Zapisz pary (imię, klasa) i użyj stable_sort z regułą, która porównuje tylko klasy: return a.second < b.second;. Stabilne sortowanie zostawi uczniów z tej samej klasy w kolejności z wejścia.`,
            tests: (r) => {
                const t = (n, kl) => `${n}\n${Array.from({ length: n }, () => `${imie(r)} ${r.pick(kl)}`).join('\n')}`;
                return ['1\nOla 1a', '3\nC 1a\nB 1a\nA 1a', '4\nOla 8z\nAla 1a\nEwa 8z\nIda 1a', t(20, ['1a', '1b', '2a']), t(1000, ['1a', '1b', '1c', '2a', '2b', '3a', '4c', '7a', '8b']), t(1000, ['5a', '5b'])];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const p = []; for (let i = 0; i < n; i++) p.push([t[1 + 2 * i], t[2 + 2 * i]]); p.sort((x, y) => cmpS(x[1], y[1])); return p.map((x) => `${x[1]} ${x[0]}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<string, string>> u(n);
    for (auto &[imie, klasa] : u) cin >> imie >> klasa;
    stable_sort(u.begin(), u.end(), [](auto a, auto b) {
        return a.second < b.second;
    });
    for (auto [imie, klasa] : u) cout << klasa << " " << imie << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-tabela-wynikow', krok: 6, level: 'srednie',
            title: 'Tabela wyników',
            short: 'Trzy kryteria: punkty malejąco, czas rosnąco, imię alfabetycznie.',
            tags: ['trzy kryteria', 'reguła z dwoma ifami', 'miejsce k + 1'],
            statement: ['Zawodnicy mają imię, liczbę punktów i czas. Ułóż tabelę wyników: wyżej stoi zawodnik z większą liczbą punktów; przy równych punktach — z krótszym czasem; a przy równych punktach i czasach — z imieniem wcześniejszym w alfabecie. Wypisz tabelę w postaci „miejsce. imię punkty czas”, gdzie miejsca to kolejne liczby od 1.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię, punkty i czas.'],
            output_format: ['n wierszy tabeli wyników.'],
            constraints: ['1 ≤ n ≤ 800', '0 ≤ punkty ≤ 500', '1 ≤ czas ≤ 9999', 'Imię ma od 2 do 9 liter.'],
            examples: [{ input: '5\nOla 300 95\nJan 300 80\nEwa 250 60\nAla 300 80\nIgor 280 70' }],
            hint: R`Trzymaj zawodnika jako pair<string, pair<int, int>> albo w trzech vectorach z sortowaniem numerów (część 7). Reguła to schodki: if (punkty różne) return punkty a > punkty b; if (czasy różne) return czas a < czas b; return imię a < imię b;.`,
            tests: (r) => {
                const t = (n, pm, cm) => `${n}\n${Array.from({ length: n }, () => `${imie(r)} ${r.int(0, pm)} ${r.int(1, cm)}`).join('\n')}`;
                return ['1\nOla 0 1', '3\nC 5 5\nB 5 5\nA 5 5', '3\nAla 1 3\nOla 1 2\nEwa 1 1', t(20, 3, 3), t(800, 500, 9999), t(800, 2, 4)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const p = []; for (let i = 0; i < n; i++) p.push([t[1 + 3 * i], Number(t[2 + 3 * i]), Number(t[3 + 3 * i])]); p.sort((x, y) => (y[1] - x[1]) || (x[2] - y[2]) || cmpS(x[0], y[0])); return p.map((x, i) => `${i + 1}. ${x[0]} ${x[1]} ${x[2]}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<string, pair<int, int>>> z(n);
    for (auto &x : z) cin >> x.first >> x.second.first >> x.second.second;
    sort(z.begin(), z.end(), [](auto a, auto b) {
        if (a.second.first != b.second.first) return a.second.first > b.second.first;
        if (a.second.second != b.second.second) return a.second.second < b.second.second;
        return a.first < b.first;
    });
    for (int i = 0; i < n; i++) {
        cout << i + 1 << ". " << z[i].first << " " << z[i].second.first << " " << z[i].second.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-najblizej-srodka', krok: 6, level: 'srednie',
            title: 'Najbliżej środka',
            short: 'Punkty według odległości od (0, 0) — liczonej bez pierwiastka i w long long.',
            tags: ['x * x + y * y', 'long long', 'remis: zwykła para'],
            statement: ['Na płaszczyźnie leży n punktów o współrzędnych całkowitych. Wypisz je od najbliższego do najdalszego od początku układu współrzędnych (0, 0). Punkty tak samo odległe wypisz według x rosnąco, a przy tym samym x — według y rosnąco.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby całkowite x i y.'],
            output_format: ['n wierszy „x y” w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '5\n3 4\n-1 1\n0 2\n-5 0\n1 -1' }],
            hint: R`Do porównywania odległości nie potrzeba pierwiastka — wystarczy x² + y². Dla współrzędnych do miliarda kwadrat ma 18 cyfr: licz go jako 1LL * x * x + 1LL * y * y. Przy remisie zwróć a < b — porównanie całych par to dokładnie „według x, potem według y”.`,
            tests: (r) => {
                const t = (n, m) => `${n}\n${Array.from({ length: n }, () => `${r.int(-m, m)} ${r.int(-m, m)}`).join('\n')}`;
                const okrag = ['3 4', '4 3', '-3 4', '4 -3', '0 5', '5 0', '-5 0', '0 -5', '-4 -3', '-3 -4', '1 1', '-1 -1'];
                return ['1\n0 0', '2\n1000000000 1000000000\n-1000000000 -1000000000', `${okrag.length}\n${r.shuffle(okrag).join('\n')}`, t(30, 5), t(1000, 1e9), t(1000, 30)];
            },
            solve: (inp) => {
                const a = nums(inp); const n = a[0]; const p = [];
                for (let i = 0; i < n; i++) { const x = a[1 + 2 * i], y = a[2 + 2 * i]; p.push([x, y, BigInt(x) * BigInt(x) + BigInt(y) * BigInt(y)]); }
                p.sort((u, w) => (u[2] < w[2] ? -1 : u[2] > w[2] ? 1 : 0) || (u[0] - w[0]) || (u[1] - w[1]));
                return p.map((u) => `${u[0]} ${u[1]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> p(n);
    for (auto &[x, y] : p) cin >> x >> y;
    sort(p.begin(), p.end(), [](auto a, auto b) {
        long long da = a.first * a.first + a.second * a.second;
        long long db = b.first * b.first + b.second * b.second;
        if (da != db) return da < db;
        return a < b;
    });
    for (auto [x, y] : p) cout << x << " " << y << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-czeste-slowa', krok: 6, level: 'srednie',
            title: 'Najczęstsze słowa',
            short: 'Policz słowa i wypisz k najczęstszych — przy remisie alfabetycznie.',
            tags: ['grupy napisów', 'pary (liczba, słowo)', 'reguła z remisem'],
            statement: ['Wczytaj n słów. Policz, ile razy występuje każde słowo, i wypisz k najczęstszych: od najczęstszego, a przy tej samej liczbie wystąpień — alfabetycznie. Każdy wiersz ma postać „słowo liczba”. Jeśli różnych słów jest mniej niż k, wypisz wszystkie.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n słów z małych liter angielskich.'],
            output_format: ['Najwyżej k wierszy „słowo liczba”.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ k ≤ 100', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '9 3\nala ma kota a kot ma ale ala ma', note: '„ma” — 3 razy, „ala” — 2 razy, a potem pięć słów po 1 razie: z nich alfabetycznie pierwsze jest „a”.' }],
            hint: R`Posortuj słowa i przejdź grupa po grupie (jak liczby w części 3), zapisując pary (liczba wystąpień, słowo). Potem posortuj pary regułą: if (a.first != b.first) return a.first > b.first; return a.second < b.second; i wypisz pierwsze min(k, liczba par).`,
            tests: (r) => {
                const pula = (k) => Array.from({ length: k }, () => r.word(r.int(1, 6), 'abcdeklmnoprst'));
                const t = (n, k, p) => { const P = pula(p); return `${n} ${k}\n${Array.from({ length: n }, () => P[Math.floor(P.length * r() * r())]).join(' ')}`; };
                return ['1 1\na', '3 5\nb a b', '4 2\nd c b a', t(30, 4, 8), t(10000, 100, 500), t(10000, 10, 20), t(10000, 100, 3000)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]), k = Number(t[1]); const m = new Map();
                for (const w of t.slice(2, 2 + n)) m.set(w, (m.get(w) || 0) + 1);
                return [...m].sort((x, y) => (y[1] - x[1]) || cmpS(x[0], y[0])).slice(0, k).map((x) => `${x[0]} ${x[1]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end());
    vector<pair<int, string>> p;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && s[j] == s[i]) j++;
        p.push_back({j - i, s[i]});
        i = j;
    }
    sort(p.begin(), p.end(), [](auto a, auto b) {
        if (a.first != b.first) return a.first > b.first;
        return a.second < b.second;
    });
    for (int x = 0; x < k && x < (int)p.size(); x++) cout << p[x].second << " " << p[x].first << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-wyniki-biegu', krok: 6, level: 'srednie',
            title: 'Wyniki biegu',
            short: 'Czasy zapisane jako m:ss — wczytaj je, ułóż ranking i wypisz w tym samym formacie.',
            tags: ['wczytywanie m:ss', 'para (sekundy, imię)', 'setw i setfill'],
            statement: ['Biegacze przebiegli trasę. Czas każdego zapisano w postaci m:ss (minuty bez zer na początku, sekundy zawsze dwiema cyframi, np. 3:07). Wypisz ranking: od najkrótszego czasu, a przy równych czasach — alfabetycznie według imion. Każdy wiersz ma postać „miejsce. imię m:ss”, gdzie miejsca to kolejne liczby od 1, a czas jest zapisany tak samo jak na wejściu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię i czas m:ss.'],
            output_format: ['n wierszy rankingu.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ minuty ≤ 59', '0 ≤ sekundy ≤ 59'],
            examples: [{ input: '4\nOla 3:07\nJan 2:59\nEwa 3:07\nIgor 10:00', note: 'Ewa i Ola mają ten sam czas — wyżej Ewa (alfabet).' }],
            hint: R`Czas wczytasz jak godzinę z lekcji o wejściu: cin >> imie >> m >> dwukropek >> s; (dwukropek to char). Zamień go na sekundy m * 60 + s i sortuj pary (sekundy, imię) — zwykły sort da czas rosnąco, a przy remisie imię alfabetycznie. Sekundy wypisz z zerem na początku: setw(2) i setfill('0').`,
            tests: (r) => {
                const czas = (m) => `${r.int(0, m)}:${String(r.int(0, 59)).padStart(2, '0')}`;
                const t = (n, m) => `${n}\n${Array.from({ length: n }, () => `${imie(r)} ${czas(m)}`).join('\n')}`;
                return ['1\nOla 0:00', '3\nC 1:05\nB 1:05\nA 0:59', '2\nAla 59:59\nOla 0:01', t(20, 3), t(1000, 59), t(1000, 1)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]); const p = [];
                for (let i = 0; i < n; i++) { const [m, s] = t[2 + 2 * i].split(':').map(Number); p.push([m * 60 + s, t[1 + 2 * i]]); }
                p.sort((x, y) => (x[0] - y[0]) || cmpS(x[1], y[1]));
                return p.map((x, i) => `${i + 1}. ${x[1]} ${Math.floor(x[0] / 60)}:${String(x[0] % 60).padStart(2, '0')}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<int, string>> b(n);
    for (auto &[sek, imie] : b) {
        int m, s;
        char dwukropek;
        cin >> imie >> m >> dwukropek >> s;
        sek = m * 60 + s;
    }
    sort(b.begin(), b.end());
    for (int i = 0; i < n; i++) {
        cout << i + 1 << ". " << b[i].second << " " << b[i].first / 60 << ":"
             << setw(2) << setfill('0') << b[i].first % 60 << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 7 · numery i rankingi
        {
            id: 'sort-skad-przyszly', krok: 7, level: 'latwe',
            title: 'Skąd przyszły?',
            short: 'Wypisz numery pozycji w kolejności posortowanych wartości.',
            tags: ['vector numerów', 'reguła [&]', 'remis po numerze'],
            statement: ['Wczytaj n liczb całkowitych; pozycje numerujemy od 1. Wyobraź sobie, że ustawiamy liczby niemalejąco, a równe liczby — w kolejności ich pozycji. Wypisz numery pozycji, z których pochodzą kolejne liczby tego ustawienia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n numerów pozycji.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n150 142 150 138 142', note: 'Najmniejsza liczba (138) stoi na pozycji 4, potem dwie liczby 142 z pozycji 2 i 5, potem 150 z pozycji 1 i 3.' }],
            hint: R`Zrób vector numerów nr = {0, 1, …, n − 1} i posortuj go regułą [&](int a, int b) { if (v[a] != v[b]) return v[a] < v[b]; return a < b; }. Wypisuj nr[k] + 1, bo pozycje liczymy od 1.`,
            tests: (r) => ['1\n5', '3\n7 7 7', '3\n3 2 1', '4\n-1 1 -1 1', fmt(arr(r, 30, 0, 9)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; return v.map((x, i) => i).sort((a, b) => (v[a] - v[b]) || (a - b)).map((i) => i + 1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (v[a] != v[b]) return v[a] < v[b];
        return a < b;
    });
    for (auto i : nr) cout << i + 1 << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-wedlug-wzrostu', krok: 7, level: 'latwe',
            title: 'Ustaw się według wzrostu',
            short: 'Imiona w jednym wierszu, wzrost w drugim. Wypisz imiona od najwyższej osoby.',
            tags: ['dwa vectory', 'sortowanie numerów', 'imie[nr[k]]'],
            statement: ['Dzieci podały swoje imiona i wzrost — ale osobno: w jednym wierszu są imiona, a w drugim wzrost w tej samej kolejności (k-ty wzrost należy do k-tego imienia). Wypisz imiona od najwyższego dziecka do najniższego. Dzieci tego samego wzrostu wypisz w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n imion.', 'W trzecim wierszu n liczb — wzrost w centymetrach.'],
            output_format: ['Jeden wiersz: n imion w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', '80 ≤ wzrost ≤ 200'],
            examples: [{ input: '4\nOla Jan Ewa Igor\n150 162 150 171' }],
            hint: R`Wczytaj imiona do vector<string> imie(n), a wzrost do vector<int> w(n). Posortuj numery regułą [&]: if (w[a] != w[b]) return w[a] > w[b]; return a < b;. Wypisz imie[nr[k]].`,
            tests: (r) => {
                const t = (n, lo, hi) => { const im = Array.from({ length: n }, () => imie(r)); return `${n}\n${im.join(' ')}\n${arr(r, n, lo, hi).join(' ')}`; };
                return ['1\nOla\n150', '3\nA B C\n150 150 150', '3\nA B C\n100 110 120', t(20, 140, 150), t(1000, 80, 200), t(1000, 150, 152)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const im = t.slice(1, 1 + n); const w = t.slice(1 + n, 1 + 2 * n).map(Number); return im.map((x, i) => i).sort((a, b) => (w[b] - w[a]) || (a - b)).map((i) => im[i]).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> imie(n);
    vector<int> w(n);
    for (auto &x : imie) cin >> x;
    for (auto &x : w) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (w[a] != w[b]) return w[a] > w[b];
        return a < b;
    });
    for (auto i : nr) cout << imie[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-gdzie-k-ta', krok: 7, level: 'latwe',
            title: 'Gdzie stoi k-ta?',
            short: 'Pytania: na której pozycji stoi k-ta najmniejsza liczba?',
            tags: ['sortowanie numerów', 'remis po numerze', 'wiele pytań'],
            statement: ['Wczytaj n liczb całkowitych (pozycje od 1) i q pytań. Ustawiamy liczby niemalejąco, a równe — w kolejności ich pozycji. Każde pytanie to liczba k; odpowiedz, na której pozycji w danych wejściowych stoi liczba, która w tym ustawieniu jest k-ta.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb całkowitych.', 'W trzecim wierszu q liczb k.'],
            output_format: ['q wierszy — odpowiedzi na pytania.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ q ≤ 3000', '1 ≤ k ≤ n', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5 3\n150 142 150 138 142\n1 3 5', note: 'Ustawienie pozycji: 4, 2, 5, 1, 3.' }],
            hint: R`Posortuj raz vector numerów (z remisem po numerze), a potem na każde pytanie odpowiadaj nr[k - 1] + 1. Nie sortuj od nowa przy każdym pytaniu!`,
            tests: (r) => {
                const t = (n, q, lo, hi) => `${n} ${q}\n${arr(r, n, lo, hi).join(' ')}\n${arr(r, q, 1, n).join(' ')}`;
                return ['1 1\n5\n1', '3 3\n7 7 7\n1 2 3', '4 4\n4 3 2 1\n1 2 3 4', t(20, 10, 0, 5), t(5000, 3000, -1e9, 1e9), t(5000, 3000, 0, 2)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 1); const nr = v.map((x, i) => i).sort((a, b) => (v[a] - v[b]) || (a - b)); return z.map(([k]) => nr[k - 1] + 1).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (v[a] != v[b]) return v[a] < v[b];
        return a < b;
    });
    while (q--) {
        int k;
        cin >> k;
        cout << nr[k - 1] + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-miejsca-ex-aequo', krok: 7, level: 'srednie',
            title: 'Miejsca ex aequo',
            short: 'Dla każdego zawodnika podaj jego miejsce — remisy dzielą miejsce (1, 2, 2, 4).',
            tags: ['sortowanie numerów', 'miejsce[i]', 'jak poprzedni → to samo'],
            statement: ['n zawodników zdobyło punkty. Miejsca przyznaje się jak w sporcie: zawodnik ma miejsce o 1 większe od liczby zawodników, którzy mają od niego więcej punktów. Dlatego remisujący dzielą miejsce, a następne miejsca są pomijane (np. 1, 2, 2, 4). Wypisz miejsca wszystkich zawodników w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — punkty zawodników.'],
            output_format: ['Jeden wiersz: n miejsc w kolejności z wejścia.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ punkty ≤ 10⁶'],
            examples: [{ input: '6\n70 85 90 85 60 90' }],
            hint: R`Posortuj numery malejąco według punktów. Idź po kolei: zawodnik na pozycji k dostaje k + 1, chyba że ma tyle samo punktów co zawodnik na pozycji k − 1 — wtedy to samo miejsce co on. Zapisuj do miejsce[nr[k]], a na końcu wypisz miejsce[0], miejsce[1], ….`,
            tests: (r) => ['1\n0', '3\n5 5 5', '4\n1 2 3 4', '4\n90 85 85 70', fmt(arr(r, 30, 0, 5)), fmt(arr(r, 5000, 0, 1e6)), fmt(arr(r, 5000, 0, 10))],
            solve: (inp) => { const v = czytaj(inp).v; return v.map((x) => 1 + v.filter((y) => y > x).length).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> pkt(n);
    for (auto &x : pkt) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (pkt[a] != pkt[b]) return pkt[a] > pkt[b];
        return a < b;
    });
    vector<int> miejsce(n);
    for (int k = 0; k < n; k++) {
        int i = nr[k];
        if (k > 0 && pkt[i] == pkt[nr[k - 1]]) miejsce[i] = miejsce[nr[k - 1]];
        else miejsce[i] = k + 1;
    }
    for (auto x : miejsce) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-kompresja', krok: 7, level: 'srednie',
            title: 'Numery zamiast liczb',
            short: 'Zamień każdą liczbę na jej numer wśród różnych wartości: najmniejsza dostaje 1.',
            tags: ['kompresja', 'sortowanie numerów', 'nowa wartość → numer++'],
            statement: ['Wczytaj n liczb całkowitych. Zamień każdą liczbę na jej numer w uporządkowanej liście różnych wartości: najmniejsza wartość dostaje numer 1, następna 2 i tak dalej. Równe liczby dostają ten sam numer. Wypisz numery w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n numerów.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1000 5 1000000 5 70' }],
            hint: R`Posortuj numery według wartości. Idź po kolei z licznikiem: zwiększ go, gdy k == 0 albo wartość różni się od poprzedniej w ustawieniu, i zapisz kod[nr[k]] = licznik. Inny sposób: posortuj kopię, usuń powtórzenia (unique) i dla każdej liczby znajdź jej pozycję przez lower_bound — to z części 8.`,
            tests: (r) => ['1\n-7', '3\n5 5 5', '3\n3 2 1', '4\n7 3 7 10', fmt(arr(r, 30, -5, 5)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 100).map((x) => x * 1e7))],
            solve: (inp) => { const v = czytaj(inp).v; const u = asc([...new Set(v)]); const m = new Map(u.map((x, i) => [x, i + 1])); return v.map((x) => m.get(x)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) { return v[a] < v[b]; });
    vector<int> kod(n);
    int numer = 0;
    for (int k = 0; k < n; k++) {
        if (k == 0 || v[nr[k]] != v[nr[k - 1]]) numer++;
        kod[nr[k]] = numer;
    }
    for (auto x : kod) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-lista-startowa', krok: 7, level: 'srednie',
            title: 'Lista startowa',
            short: 'Zawodnicy z różnych krajów: grupuj po kraju, w kraju od najlepszego.',
            tags: ['rekordy w trzech vectorach', 'reguła [&] z trzema kryteriami', 'imie[nr[k]]'],
            statement: ['Każdy zawodnik ma imię, kod kraju (trzy wielkie litery, np. POL) i liczbę punktów z kwalifikacji. Ułóż listę startową: zawodnicy pogrupowani według kraju (kody krajów alfabetycznie), w każdym kraju od największej liczby punktów, a przy równych punktach — alfabetycznie według imion. Każdy wiersz ma postać „kraj imię punkty”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię, kod kraju i punkty.'],
            output_format: ['n wierszy listy startowej.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ punkty ≤ 1000', 'Imię ma od 2 do 9 liter.'],
            examples: [{ input: '5\nOla POL 80\nHans GER 95\nJan POL 92\nEwa POL 80\nLars NOR 70' }],
            hint: R`Trzymaj dane w trzech vectorach: imie, kraj, pkt. Posortuj numery regułą [&]: if (kraj[a] != kraj[b]) return kraj[a] < kraj[b]; if (pkt[a] != pkt[b]) return pkt[a] > pkt[b]; return imie[a] < imie[b];.`,
            tests: (r) => {
                const t = (n, kr, pm) => `${n}\n${Array.from({ length: n }, () => `${imie(r)} ${r.pick(kr)} ${r.int(0, pm)}`).join('\n')}`;
                return ['1\nOla POL 0', '3\nC POL 5\nB POL 5\nA POL 5', '3\nAla NOR 1\nOla CZE 1\nEwa ESP 1', t(20, KRAJE.slice(0, 3), 5), t(1000, KRAJE, 1000), t(1000, KRAJE.slice(0, 2), 3)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]); const p = [];
                for (let i = 0; i < n; i++) p.push([t[1 + 3 * i], t[2 + 3 * i], Number(t[3 + 3 * i])]);
                p.sort((x, y) => cmpS(x[1], y[1]) || (y[2] - x[2]) || cmpS(x[0], y[0]));
                return p.map((x) => `${x[1]} ${x[0]} ${x[2]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> imie(n), kraj(n);
    vector<int> pkt(n);
    for (int i = 0; i < n; i++) cin >> imie[i] >> kraj[i] >> pkt[i];
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (kraj[a] != kraj[b]) return kraj[a] < kraj[b];
        if (pkt[a] != pkt[b]) return pkt[a] > pkt[b];
        return imie[a] < imie[b];
    });
    for (auto i : nr) cout << kraj[i] << " " << imie[i] << " " << pkt[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-kto-awansowal', krok: 7, level: 'srednie',
            title: 'Kto awansował najwięcej?',
            short: 'Dwa rankingi — po pierwszej rundzie i po całych zawodach. Kto poprawił się najbardziej?',
            tags: ['dwa razy sortowanie numerów', 'miejsce1[i] - miejsce2[i]', 'remis po numerze'],
            statement: ['W zawodach startuje n zawodników ponumerowanych od 1. W pierwszej rundzie zawodnik i zdobył aᵢ punktów, w drugiej bᵢ. Ranking po pierwszej rundzie układamy według aᵢ malejąco, a ranking końcowy — według aᵢ + bᵢ malejąco; w obu rankingach przy remisie wyżej stoi zawodnik z mniejszym numerem, więc miejsca są różne (od 1 do n). Awans zawodnika to (miejsce po pierwszej rundzie) − (miejsce końcowe). Wypisz numer zawodnika z największym awansem i ten awans. Jeśli kilku ma ten sam największy awans, wybierz najmniejszy numer.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby aᵢ i bᵢ.'],
            output_format: ['Dwie liczby: numer zawodnika i jego awans.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ aᵢ, bᵢ ≤ 10⁶'],
            examples: [{ input: '4\n10 0\n8 5\n9 1\n5 9', note: 'Po rundzie 1: zawodnicy 1, 3, 2, 4. Końcowo (sumy 10, 13, 10, 14): 4, 2, 1, 3. Zawodnik 4 awansował z miejsca 4 na 1.' }],
            hint: R`Policz dwa vectory miejsc. Dla każdego rankingu posortuj numery (reguła [&] z remisem po numerze) i zapisz miejsce[nr[k]] = k + 1. Potem jedną pętlą znajdź największą różnicę miejsce1[i] − miejsce2[i] — zmieniaj ją tylko przy ściśle większej wartości.`,
            tests: (r) => {
                const t = (n, m) => `${n}\n${Array.from({ length: n }, () => `${r.int(0, m)} ${r.int(0, m)}`).join('\n')}`;
                return ['1\n5 5', '2\n1 0\n0 2', '3\n0 0\n0 0\n0 0', '3\n3 0\n2 0\n1 9', t(20, 10), t(5000, 1e6), t(5000, 3)];
            },
            solve: (inp) => {
                const a = nums(inp); const n = a[0]; const A = [], B = [];
                for (let i = 0; i < n; i++) { A.push(a[1 + 2 * i]); B.push(a[1 + 2 * i] + a[2 + 2 * i]); }
                const miejsca = (w) => { const nr = w.map((x, i) => i).sort((x, y) => (w[y] - w[x]) || (x - y)); const m = Array(n); nr.forEach((i, k) => { m[i] = k + 1; }); return m; };
                const m1 = miejsca(A), m2 = miejsca(B);
                let bi = 0; for (let i = 1; i < n; i++) if (m1[i] - m2[i] > m1[bi] - m2[bi]) bi = i;
                return `${bi + 1} ${m1[bi] - m2[bi]}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n), s(n);
    for (int i = 0; i < n; i++) {
        long long x, y;
        cin >> x >> y;
        a[i] = x;
        s[i] = x + y;
    }
    vector<int> nr(n), m1(n), m2(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int p, int q) {
        if (a[p] != a[q]) return a[p] > a[q];
        return p < q;
    });
    for (int k = 0; k < n; k++) m1[nr[k]] = k + 1;
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int p, int q) {
        if (s[p] != s[q]) return s[p] > s[q];
        return p < q;
    });
    for (int k = 0; k < n; k++) m2[nr[k]] = k + 1;
    int naj = 0;
    for (int i = 1; i < n; i++) {
        if (m1[i] - m2[i] > m1[naj] - m2[naj]) naj = i;
    }
    cout << naj + 1 << " " << m1[naj] - m2[naj] << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · szukanie w posortowanym
        {
            id: 'sort-czy-jest', krok: 8, level: 'latwe',
            title: 'Czy jest na liście?',
            short: 'Posortuj raz, a potem na każde pytanie odpowiadaj przez binary_search.',
            tags: ['sort raz', 'binary_search', 'while (q--)'],
            statement: ['Na liście jest n numerów biletów, które już wygrały. Przychodzi q osób; każda pyta, czy jej numer jest na liście. Na każde pytanie odpowiedz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n numerów z listy.', 'W trzecim wierszu q numerów z pytań.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ q ≤ 4000', '0 ≤ każdy numer ≤ 10⁶'],
            examples: [{ input: '6 4\n40 7 22 31 12 60\n22 23 60 1' }],
            hint: R`Posortuj listę jeden raz, przed pytaniami. Potem binary_search(v.begin(), v.end(), x) odpowiada na pytanie w kilkunastu krokach.`,
            tests: (r) => {
                const t = (n, q, hi) => { const v = arr(r, n, 0, hi); return `${n} ${q}\n${v.join(' ')}\n${Array.from({ length: q }, () => (r() < 0.5 ? r.pick(v) : r.int(0, hi))).join(' ')}`; };
                return ['1 2\n0\n0 1', '3 3\n5 5 5\n4 5 6', t(20, 20, 30), t(8000, 4000, 1e6), t(8000, 4000, 10000)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 1); const s = new Set(v); return z.map(([x]) => (s.has(x) ? 'TAK' : 'NIE')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    while (q--) {
        int x;
        cin >> x;
        if (binary_search(v.begin(), v.end(), x)) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-ile-mniejszych', krok: 8, level: 'latwe',
            title: 'Ile mniejszych?',
            short: 'Na każde pytanie x odpowiedz, ile liczb jest mniejszych od x.',
            tags: ['lower_bound', '- v.begin()', 'liczba elementów < x'],
            statement: ['Wczytaj n liczb całkowitych i q pytań. Każde pytanie to liczba x — odpowiedz, ile spośród n liczb jest ściśle mniejszych od x.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W trzecim wierszu q liczb x.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ q ≤ 4000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '6 4\n2 4 4 4 7 9\n4 5 1 10' }],
            hint: R`Po sortowaniu lower_bound(v.begin(), v.end(), x) - v.begin() to numer pierwszego elementu ≥ x — a zarazem liczba elementów mniejszych od x.`,
            tests: (r) => {
                const t = (n, q, m) => { const v = arr(r, n, -m, m); return `${n} ${q}\n${v.join(' ')}\n${Array.from({ length: q }, () => (r() < 0.5 ? r.pick(v) : r.int(-m - 2, m + 2))).join(' ')}`; };
                return ['1 3\n0\n-1 0 1', '3 3\n5 5 5\n4 5 6', t(20, 20, 10), t(8000, 4000, 1e6), t(8000, 4000, 50)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 1); const w = asc(v); return z.map(([x]) => lb(w, x)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    while (q--) {
        int x;
        cin >> x;
        cout << lower_bound(v.begin(), v.end(), x) - v.begin() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-ile-w-przedziale', krok: 8, level: 'latwe',
            title: 'Ile w przedziale?',
            short: 'Pytania „ile liczb leży między a i b?” — jednym odejmowaniem.',
            tags: ['upper_bound(b) - lower_bound(a)', 'końce się liczą'],
            statement: ['Wczytaj n liczb całkowitych i q pytań. Każde pytanie to dwie liczby a ≤ b — odpowiedz, ile spośród n liczb leży w przedziale od a do b (włącznie z końcami).'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W każdym z kolejnych q wierszy liczby a i b.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n ≤ 6000', '1 ≤ q ≤ 3000', '−10⁶ ≤ każda liczba, a, b ≤ 10⁶', 'a ≤ b'],
            examples: [{ input: '7 3\n15 3 9 27 9 20 1\n5 15\n10 14\n0 100' }],
            hint: R`Liczba elementów w [a, b] to (ile ≤ b) − (ile < a), czyli upper_bound(v.begin(), v.end(), b) - lower_bound(v.begin(), v.end(), a). Posortuj tylko raz.`,
            check: (inp) => { const { z } = zapytania(inp, 2); return z.every(([a, b]) => a <= b) ? null : 'a > b'; },
            tests: (r) => {
                const t = (n, q, m) => {
                    const v = arr(r, n, -m, m);
                    const p = Array.from({ length: q }, () => { let a = r() < 0.5 ? r.pick(v) : r.int(-m, m); let b = r() < 0.5 ? r.pick(v) : r.int(-m, m); if (a > b) [a, b] = [b, a]; return `${a} ${b}`; });
                    return `${n} ${q}\n${v.join(' ')}\n${p.join('\n')}`;
                };
                return ['1 2\n0\n0 0\n1 1', '3 2\n5 5 5\n5 5\n-1000000 1000000', t(20, 20, 10), t(6000, 3000, 1e6), t(6000, 3000, 30)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 2); const w = asc(v); return z.map(([a, b]) => ub(w, b) - lb(w, a)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << upper_bound(v.begin(), v.end(), b) - lower_bound(v.begin(), v.end(), a) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-ile-razy-wystapilo', krok: 8, level: 'latwe',
            title: 'Ile razy wystąpiło?',
            short: 'Policz wystąpienia liczby x — różnicą upper_bound i lower_bound.',
            tags: ['upper_bound - lower_bound', 'liczba równych'],
            statement: ['Wczytaj n liczb całkowitych i q pytań. Każde pytanie to liczba x — odpowiedz, ile razy x występuje wśród n liczb.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W trzecim wierszu q liczb x.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ q ≤ 4000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '6 3\n2 4 4 4 7 9\n4 5 9' }],
            hint: R`Wszystkie liczby równe x leżą między lower_bound(x) (wliczamy) a upper_bound(x) (nie wliczamy). Ich liczba to różnica tych dwóch strzałek.`,
            tests: (r) => {
                const t = (n, q, m) => { const v = arr(r, n, -m, m); return `${n} ${q}\n${v.join(' ')}\n${Array.from({ length: q }, () => (r() < 0.6 ? r.pick(v) : r.int(-m, m))).join(' ')}`; };
                return ['1 2\n0\n0 1', '4 1\n5 5 5 5\n5', t(20, 20, 5), t(8000, 4000, 1e6), t(8000, 4000, 100)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 1); const c = new Map(); v.forEach((x) => c.set(x, (c.get(x) || 0) + 1)); return z.map(([x]) => c.get(x) || 0).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    while (q--) {
        int x;
        cin >> x;
        cout << upper_bound(v.begin(), v.end(), x) - lower_bound(v.begin(), v.end(), x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-zgadnij-liczbe', krok: 8, level: 'latwe',
            title: 'Zgadnij liczbę',
            short: 'Zgadujący zawsze pyta o środek przedziału. Wypisz jego kolejne strzały.',
            tags: ['wyszukiwanie binarne', 'l, r, s = (l + r) / 2', 'pętla while'],
            statement: ['Ktoś pomyślał liczbę x od 1 do n. Zgadujący pilnuje przedziału [l, r], w którym może być liczba (na początku l = 1, r = n), i zawsze pyta o s = (l + r) / 2 (dzielenie całkowite). Jeśli s = x — koniec. Jeśli s < x, zgadujący ustawia l = s + 1, a jeśli s > x — ustawia r = s − 1. Wypisz wszystkie kolejne strzały, a w drugim wierszu ich liczbę.'],
            input_format: ['Dwie liczby n i x.'],
            output_format: ['W pierwszym wierszu kolejne strzały, w drugim ich liczba.'],
            constraints: ['1 ≤ x ≤ n ≤ 10⁹'],
            examples: [{ input: '100 71' }, { input: '100 50' }],
            hint: R`Pętla while (true): policz s = (l + r) / 2, wypisz s i zwiększ licznik; jeśli s == x — break; jeśli s < x — l = s + 1; inaczej r = s − 1. Dla n do miliarda l + r mieści się w int (2·10⁹ < 2 147 483 647), ale long long nie zaszkodzi.`,
            check: (inp) => { const [n, x] = nums(inp); return x >= 1 && x <= n ? null : 'zle x'; },
            tests: (r) => ['1 1', '2 1', '2 2', '7 7', '100 1', '1000000000 1', '1000000000 1000000000', '1000000000 123456789', `${r.int(1, 1e9)} 1`, (() => { const n = r.int(1, 1e9); return `${n} ${r.int(1, n)}`; })(), '1023 512', '1023 1'],
            solve: (inp) => { const [n, x] = nums(inp); let l = 1, r = n; const s = []; while (true) { const m = Math.floor((l + r) / 2); s.push(m); if (m === x) break; if (m < x) l = m + 1; else r = m - 1; } return `${s.join(' ')}\n${s.length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, x;
    cin >> n >> x;
    long long l = 1, r = n;
    int strzalow = 0;
    while (true) {
        long long s = (l + r) / 2;
        cout << s << " ";
        strzalow++;
        if (s == x) break;
        if (s < x) l = s + 1;
        else r = s - 1;
    }
    cout << "\n" << strzalow << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-nastepny-rozmiar', krok: 8, level: 'latwe',
            title: 'Następny rozmiar',
            short: 'Klient chce buty w rozmiarze co najmniej x. Jaki najmniejszy taki rozmiar jest w sklepie?',
            tags: ['lower_bound', '*lower_bound', 'end() = BRAK'],
            statement: ['W sklepie jest n par butów; znasz ich rozmiary (mogą się powtarzać). Przychodzi q klientów. Klient z rozmiarem x zadowoli się butami w rozmiarze x albo większym. Dla każdego klienta wypisz najmniejszy rozmiar dostępny w sklepie, który jest co najmniej x, albo BRAK, jeśli wszystkie buty są za małe. Klienci tylko pytają — niczego nie kupują.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n rozmiarów.', 'W trzecim wierszu q rozmiarów klientów.'],
            output_format: ['q wierszy: rozmiar albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 3000', '15 ≤ każdy rozmiar ≤ 50'],
            examples: [{ input: '5 4\n38 42 40 44 40\n40 41 45 20' }],
            hint: R`Po sortowaniu int i = lower_bound(v.begin(), v.end(), x) - v.begin(); pokazuje najmniejszy rozmiar ≥ x. Gdy i == n, takiego rozmiaru nie ma — wypisz BRAK (nie czytaj v[n]!).`,
            tests: (r) => {
                const t = (n, q, lo, hi) => `${n} ${q}\n${arr(r, n, lo, hi).join(' ')}\n${arr(r, q, 15, 50).join(' ')}`;
                return ['1 3\n30\n29 30 31', '3 2\n50 50 50\n50 15', t(10, 20, 30, 40), t(1000, 3000, 15, 50), t(1000, 3000, 20, 30)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 1); const w = asc(v); return z.map(([x]) => { const i = lb(w, x); return i === w.length ? 'BRAK' : w[i]; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    while (q--) {
        int x;
        cin >> x;
        int i = lower_bound(v.begin(), v.end(), x) - v.begin();
        if (i == n) cout << "BRAK\n";
        else cout << v[i] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-najblizsza-cena', krok: 8, level: 'srednie',
            title: 'Najbliższa cena',
            short: 'Dla każdej kwoty znajdź w cenniku cenę najbliższą — przy remisie tańszą.',
            tags: ['lower_bound', 'sąsiad przed', 'brzegi: 0 i n'],
            statement: ['W cenniku jest n cen. Na każde z q pytań — kwotę x — wypisz cenę z cennika, która jest najbliżej x. Jeśli dwie ceny są tak samo blisko, wybierz tańszą.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n cen.', 'W trzecim wierszu q kwot.'],
            output_format: ['q wierszy z cenami.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ q ≤ 3000', '1 ≤ cena, kwota ≤ 10⁶'],
            examples: [{ input: '5 5\n10 25 40 60 95\n30 34 5 120 50' }],
            hint: R`lower_bound daje najmniejszą cenę ≥ x (numer i). Drugi kandydat to cena tuż przed nią (numer i − 1). Obsłuż brzegi: gdy i == n — tylko c[n − 1], gdy i == 0 — tylko c[0]. W pozostałych przypadkach porównaj x − c[i − 1] z c[i] − x; przy remisie wybierz c[i − 1].`,
            tests: (r) => {
                const t = (n, q, hi) => `${n} ${q}\n${arr(r, n, 1, hi).join(' ')}\n${arr(r, q, 1, hi).join(' ')}`;
                return ['1 3\n50\n1 50 1000000', '2 3\n40 60\n50 49 51', '3 2\n7 7 7\n1 9', t(10, 20, 100), t(8000, 3000, 1e6), t(8000, 3000, 20000)];
            },
            solve: (inp) => { const { v, z } = zapytania(inp, 1); const w = asc(v); return z.map(([x]) => { const i = lb(w, x); if (i === w.length) return w[i - 1]; if (i === 0) return w[0]; return x - w[i - 1] <= w[i] - x ? w[i - 1] : w[i]; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> c(n);
    for (auto &x : c) cin >> x;
    sort(c.begin(), c.end());
    while (q--) {
        int x;
        cin >> x;
        int i = lower_bound(c.begin(), c.end(), x) - c.begin();
        int odp;
        if (i == n) odp = c[n - 1];
        else if (i == 0) odp = c[0];
        else if (x - c[i - 1] <= c[i] - x) odp = c[i - 1];
        else odp = c[i];
        cout << odp << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sort-pary-o-sumie', krok: 8, level: 'srednie',
            title: 'Pary o sumie S',
            short: 'Ile jest par liczb (na różnych pozycjach), które dają razem S?',
            tags: ['sort', 'szukanie S - v[i] na prawo', 'long long'],
            statement: ['Wczytaj n liczb całkowitych i liczbę S. Policz, ile jest par pozycji i < j, dla których aᵢ + aⱼ = S.'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 8000', '−10⁶ ≤ aᵢ ≤ 10⁶', '−2·10⁶ ≤ S ≤ 2·10⁶'],
            examples: [{ input: '6 10\n5 3 7 5 2 8', note: 'Pary: 5 + 5, 3 + 7 i 2 + 8.' }],
            hint: R`Posortuj. Dla każdego i policz, ile razy liczba S − v[i] występuje na prawo od i: upper_bound(v.begin() + i + 1, v.end(), S - v[i]) - lower_bound(v.begin() + i + 1, v.end(), S - v[i]). Szukając tylko na prawo, każdą parę liczysz dokładnie raz. Wynik może przekroczyć int — sumuj w long long.`,
            tests: (r) => {
                const t = (n, S, m) => `${n} ${S}\n${arr(r, n, -m, m).join(' ')}`;
                return ['1 2\n1', '2 2\n1 1', '4 0\n0 0 0 0', '5 7\n1 2 3 4 5', t(30, 5, 5), t(8000, 0, 1e6), t(8000, 10, 10), t(8000, 2000000, 1e6), t(8000, 7, 3)];
            },
            solve: (inp) => { const a = nums(inp); const [n, S] = a; const v = a.slice(2, 2 + n); const c = new Map(); let wyn = 0; for (const x of v) { wyn += c.get(S - x) || 0; c.set(x, (c.get(x) || 0) + 1); } return String(wyn); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, S;
    cin >> n >> S;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long par = 0;
    for (int i = 0; i < n; i++) {
        int szukam = S - v[i];
        par += upper_bound(v.begin() + i + 1, v.end(), szukam) - lower_bound(v.begin() + i + 1, v.end(), szukam);
    }
    cout << par << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 9 · pomysły zachłanne
        {
            id: 'sort-prezenty', krok: 9, level: 'latwe',
            title: 'Jak najwięcej prezentów',
            short: 'Kup jak najwięcej prezentów za budżet B — zaczynając od najtańszych.',
            tags: ['sort rosnąco', 'zachłannie od najtańszego', 'long long'],
            statement: ['Masz B złotych i listę cen n prezentów. Każdy prezent możesz kupić najwyżej raz. Kup jak najwięcej prezentów. Wypisz, ile ich kupisz, i ile najmniej złotych na to wydasz.'],
            input_format: ['W pierwszym wierszu liczby n i B.', 'W drugim wierszu n cen.'],
            output_format: ['Dwie liczby: największa liczba prezentów i najmniejsza kwota, za którą da się je kupić.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ B ≤ 10¹²', '1 ≤ cena ≤ 10⁶'],
            examples: [{ input: '6 50\n20 7 35 12 9 15' }],
            hint: R`Posortuj ceny rosnąco i kupuj po kolei, dopóki starcza pieniędzy. Najtańsze prezenty dają jednocześnie największą liczbę i najmniejszą kwotę. Budżet nie mieści się w int — long long.`,
            tests: (r) => {
                const t = (n, B, hi) => `${n} ${B}\n${arr(r, n, 1, hi).join(' ')}`;
                return ['1 0\n5', '1 5\n5', '3 1000000000000\n1 2 3', '4 9\n3 3 3 3', t(20, 100, 30), t(10000, 1e9, 1e6), t(10000, 12345678, 10000)];
            },
            solve: (inp) => { const a = nums(inp); const [n, B] = a; const v = asc(a.slice(2, 2 + n)); let s = 0, k = 0; for (const x of v) { if (s + x > B) break; s += x; k++; } return `${k} ${s}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long budzet;
    cin >> n >> budzet;
    vector<int> c(n);
    for (auto &x : c) cin >> x;
    sort(c.begin(), c.end());
    int ile = 0;
    long long wydane = 0;
    for (auto x : c) {
        if (wydane + x > budzet) break;
        wydane += x;
        ile++;
    }
    cout << ile << " " << wydane << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-kolejka-do-kasy', krok: 9, level: 'latwe',
            title: 'Kolejka do kasy',
            short: 'W jakiej kolejności obsłużyć klientów, żeby łącznie czekali jak najkrócej?',
            tags: ['od najkrótszego', 'suma prefiksowa', 'long long'],
            statement: ['Do jednej kasy przyszło jednocześnie n klientów. Obsługa klienta i trwa tᵢ minut, a kasjer obsługuje ich jednego po drugim, bez przerw. Czas czekania klienta to liczba minut od chwili 0 do końca jego obsługi. Ustaw klientów tak, by suma czasów czekania wszystkich była jak najmniejsza, i wypisz tę sumę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n czasów obsługi.'],
            output_format: ['Jedna liczba — najmniejsza suma czasów czekania.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ tᵢ ≤ 10⁴'],
            examples: [{ input: '3\n5 1 3', note: 'Kolejność 1, 3, 5: klienci kończą po 1, 4 i 9 minutach.' }],
            hint: R`Obsługuj od najkrótszego. Po sortowaniu trzymaj zegar (koniec obsługi bieżącego klienta) i dodawaj go do sumy. Suma może sięgnąć 5·10¹¹ — long long.`,
            tests: (r) => ['1\n7', '3\n2 2 2', '4\n4 3 2 1', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 10000, 1, 1e4)), fmt(Array(10000).fill(10000))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let z = 0, s = 0; for (const x of v) { z += x; s += z; } return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    sort(t.begin(), t.end());
    long long zegar = 0, suma = 0;
    for (auto x : t) {
        zegar += x;
        suma += zegar;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-rowne-pary', krok: 9, level: 'latwe',
            title: 'Równe pary',
            short: 'Połącz 2n graczy w pary tak, by najsilniejsza para była jak najsłabsza.',
            tags: ['najmniejszy z największym', 'v[i] + v[2n - 1 - i]', 'max'],
            statement: ['Na turniej przyszło 2n graczy; każdy ma swoją siłę. Trzeba ich połączyć w n par. Siła pary to suma sił obu graczy. Organizator chce, by pary były jak najbardziej wyrównane: największa siła pary ma być jak najmniejsza. Wypisz tę najmniejszą możliwą wartość.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu 2n liczb — siły graczy.'],
            output_format: ['Jedna liczba — najmniejsza możliwa siła najsilniejszej pary.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ siła ≤ 10⁶'],
            examples: [{ input: '2\n1 9 3 7', note: 'Pary (1, 9) i (3, 7) mają siłę 10.' }],
            hint: R`Posortuj i łącz najsłabszego z najsilniejszym, drugiego najsłabszego z drugim najsilniejszym itd.: pary v[i] i v[2n − 1 − i]. Odpowiedź to największa z tych sum.`,
            tests: (r) => {
                const t = (n, lo, hi) => `${n}\n${arr(r, 2 * n, lo, hi).join(' ')}`;
                return ['1\n1 1', '1\n5 1000000', '2\n1 2 3 100', '3\n5 5 5 5 5 5', t(10, 1, 50), t(5000, 1, 1e6), t(5000, 1, 3)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = asc(a.slice(1, 1 + 2 * n)); let m = 0; for (let i = 0; i < n; i++) m = Math.max(m, v[i] + v[2 * n - 1 - i]); return String(m); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(2 * n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int najw = 0;
    for (int i = 0; i < n; i++) najw = max(najw, v[i] + v[2 * n - 1 - i]);
    cout << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-lodki', krok: 9, level: 'srednie',
            title: 'Łódki',
            short: 'Łódka mieści dwie osoby o łącznej wadze do L. Ile najmniej łódek?',
            tags: ['dwa wskaźniki', 'najcięższy z najlżejszym', 'i <= j'],
            statement: ['n osób chce przepłynąć rzekę. Każda łódka mieści najwyżej dwie osoby, a ich łączna waga nie może przekroczyć L. Wagi wszystkich osób są nie większe niż L. Ile najmniej łódek potrzeba?'],
            input_format: ['W pierwszym wierszu liczby n i L.', 'W drugim wierszu n wag.'],
            output_format: ['Jedna liczba — najmniejsza liczba łódek.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ waga ≤ L ≤ 10⁶'],
            examples: [{ input: '6 120\n70 50 80 30 60 90' }],
            hint: R`Posortuj wagi i ustaw i na najlżejszej, j na najcięższej osobie. Dopóki i <= j: jeśli i < j i v[i] + v[j] <= L, najlżejszy płynie z najcięższym (i++); w każdym przypadku najcięższy odpływa (j--) i zużywamy jedną łódkę.`,
            check: (inp) => { const a = nums(inp); const [n, L] = a; return a.slice(2, 2 + n).every((x) => x <= L) ? null : 'waga > L'; },
            tests: (r) => {
                const t = (n, L, lo) => `${n} ${L}\n${arr(r, n, lo, L).join(' ')}`;
                return ['1 5\n5', '2 10\n5 5', '2 9\n5 5', '3 100\n100 100 100', '4 100\n60 40 70 30', t(20, 50, 1), t(10000, 1e6, 1), t(10000, 1000, 400), t(10000, 100, 1)];
            },
            solve: (inp) => { const a = nums(inp); const [n, L] = a; const v = asc(a.slice(2, 2 + n)); let i = 0, j = n - 1, k = 0; while (i <= j) { if (i < j && v[i] + v[j] <= L) i++; j--; k++; } return String(k); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, L;
    cin >> n >> L;
    vector<int> w(n);
    for (auto &x : w) cin >> x;
    sort(w.begin(), w.end());
    int i = 0, j = n - 1, lodek = 0;
    while (i <= j) {
        if (i < j && w[i] + w[j] <= L) i++;
        j--;
        lodek++;
    }
    cout << lodek << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-suma-iloczynow', krok: 9, level: 'srednie',
            title: 'Suma iloczynów',
            short: 'Połącz liczby z dwóch list w pary tak, by suma iloczynów była największa — i najmniejsza.',
            tags: ['dwie listy', 'największy z największym', 'long long'],
            statement: ['Masz dwie listy po n liczb całkowitych: a i b. Każdą liczbę z listy a łączysz w parę z inną liczbą z listy b (każda liczba z b jest użyta dokładnie raz). Wynik to suma iloczynów w parach. Wypisz największy i najmniejszy możliwy wynik.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb listy a.', 'W trzecim wierszu n liczb listy b.'],
            output_format: ['Dwie liczby: największy i najmniejszy wynik.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁴ ≤ każda liczba ≤ 10⁴'],
            examples: [{ input: '3\n3 1 2\n10 30 20' }, { input: '2\n-1 2\n3 -4', note: 'Największy: (−1)·(−4) + 2·3 = 10. Najmniejszy: (−1)·3 + 2·(−4) = −11.' }],
            hint: R`Posortuj obie listy rosnąco. Największy wynik: a[i] · b[i] (największy z największym — działa też dla liczb ujemnych). Najmniejszy: a[i] · b[n − 1 − i]. Sumy mogą sięgać 5·10¹¹ — long long.`,
            tests: (r) => {
                const t = (n, m) => `${n}\n${arr(r, n, -m, m).join(' ')}\n${arr(r, n, -m, m).join(' ')}`;
                return ['1\n5\n-5', '2\n0 0\n7 -7', '3\n1 1 1\n1 2 3', t(10, 9), t(5000, 1e4), t(5000, 3)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const x = asc(a.slice(1, 1 + n)); const y = asc(a.slice(1 + n, 1 + 2 * n)); let mx = 0, mn = 0; for (let i = 0; i < n; i++) { mx += x[i] * y[i]; mn += x[i] * y[n - 1 - i]; } return `${mx} ${mn}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n), b(n);
    for (auto &x : a) cin >> x;
    for (auto &x : b) cin >> x;
    sort(a.begin(), a.end());
    sort(b.begin(), b.end());
    long long maks = 0, mini = 0;
    for (int i = 0; i < n; i++) {
        maks += a[i] * b[i];
        mini += a[i] * b[n - 1 - i];
    }
    cout << maks << " " << mini << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-ciastka', krok: 9, level: 'srednie',
            title: 'Ciastka dla dzieci',
            short: 'Każde dziecko chce ciastka co najmniej swojego rozmiaru. Ile dzieci zadowolisz?',
            tags: ['dwie posortowane listy', 'dwa wskaźniki', 'najmniej wymagające dziecko'],
            statement: ['Masz n dzieci i m ciastek. Dziecko i ma apetyt aᵢ — zadowoli je ciastko o rozmiarze co najmniej aᵢ. Każde dziecko dostaje najwyżej jedno ciastko, a każde ciastko może dostać najwyżej jedno dziecko. Ile najwięcej dzieci możesz zadowolić?'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n apetytów.', 'W trzecim wierszu m rozmiarów ciastek.'],
            output_format: ['Jedna liczba — największa liczba zadowolonych dzieci.'],
            constraints: ['1 ≤ n, m ≤ 5000', '1 ≤ apetyt, rozmiar ≤ 10⁶'],
            examples: [{ input: '4 5\n5 2 8 3\n4 1 3 9 2' }],
            hint: R`Posortuj obie listy. Idź po ciastkach od najmniejszego; d to numer najmniej wymagającego niezadowolonego dziecka. Jeśli ciastko >= apetyt[d] — dziecko d je dostaje (d++), w przeciwnym razie ciastko jest za małe dla wszystkich pozostałych i je pomijasz.`,
            tests: (r) => {
                const t = (n, m, hi) => `${n} ${m}\n${arr(r, n, 1, hi).join(' ')}\n${arr(r, m, 1, hi).join(' ')}`;
                return ['1 1\n5\n4', '1 1\n5\n5', '3 2\n1 2 3\n1 1', '2 3\n10 10\n1 2 3', t(10, 10, 20), t(5000, 5000, 1e6), t(5000, 1000, 1e6), t(1000, 5000, 100)];
            },
            solve: (inp) => { const a = nums(inp); const [n, m] = a; const ap = asc(a.slice(2, 2 + n)); const c = asc(a.slice(2 + n, 2 + n + m)); let d = 0; for (const x of c) if (d < n && x >= ap[d]) d++; return String(d); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<int> apetyt(n), ciastko(m);
    for (auto &x : apetyt) cin >> x;
    for (auto &x : ciastko) cin >> x;
    sort(apetyt.begin(), apetyt.end());
    sort(ciastko.begin(), ciastko.end());
    int d = 0;
    for (auto c : ciastko) {
        if (d < n && c >= apetyt[d]) d++;
    }
    cout << d << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-zmiana-znakow', krok: 9, level: 'srednie',
            title: 'Zmiana znaków',
            short: 'Dokładnie k razy zmień znak jakiejś liczby. Jaka największa suma wyjdzie?',
            tags: ['sort rosnąco', 'najpierw najmniejsze ujemne', 'parzystość k', 'long long'],
            statement: ['Masz n liczb całkowitych. Musisz wykonać dokładnie k ruchów; w jednym ruchu wybierasz dowolną liczbę i zmieniasz jej znak (x staje się −x). Tę samą liczbę możesz wybrać wiele razy. Wypisz największą możliwą sumę wszystkich liczb po k ruchach.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa możliwa suma.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ k ≤ 10⁹', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5 3\n-4 -1 3 -2 5', note: 'Zmieniamy −4, −2 i −1: suma 4 + 1 + 3 + 2 + 5 = 15.' }, { input: '3 3\n-5 2 4', note: 'Zmieniamy −5 na 5, a pozostałe dwa ruchy wykonujemy na dwójce (2 → −2 → 2): suma 11.' }],
            hint: R`Posortuj rosnąco i zmieniaj znaki ujemnych liczb od najmniejszej, dopóki są ruchy i ujemne liczby. Jeśli zostały ruchy: parzysta liczba ruchów nic nie zmienia (dwa razy ta sama liczba), a przy nieparzystej jeden ruch musi trafić w liczbę o najmniejszej wartości bezwzględnej — odejmij od sumy 2·min|x|.`,
            tests: (r) => {
                const t = (n, k, m) => `${n} ${k}\n${arr(r, n, -m, m).join(' ')}`;
                return ['1 1\n5', '1 2\n5', '1 1000000000\n-3', '3 1\n0 -1 -2', '3 4\n-1 -2 -3', '4 3\n-1 -1 2 2', t(20, 7, 10), t(10000, 5000, 1e6), t(10000, 999999999, 1e6), t(10000, 1, 1e6)];
            },
            solve: (inp) => {
                const a = nums(inp); const [n] = a; let k = a[1]; const v = asc(a.slice(2, 2 + n));
                for (let i = 0; i < n && k > 0 && v[i] < 0; i++) { v[i] = -v[i]; k--; }
                let s = v.reduce((x, y) => x + y, 0);
                if (k % 2 === 1) s -= 2 * v.reduce((m, x) => Math.min(m, Math.abs(x)), Infinity);
                return String(s);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    for (int i = 0; i < n && k > 0 && v[i] < 0; i++) {
        v[i] = -v[i];
        k--;
    }
    long long suma = 0, najmniej = v[0] < 0 ? -v[0] : v[0];
    for (auto x : v) {
        suma += x;
        najmniej = min(najmniej, x < 0 ? -x : x);
    }
    if (k % 2 == 1) suma -= 2 * najmniej;
    cout << suma << "\n";
    return 0;
}`,
        },
    ];
};
