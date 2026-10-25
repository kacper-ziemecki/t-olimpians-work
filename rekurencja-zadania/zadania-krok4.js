// Krok 4 · Generowanie: ciągi, podzbiory, kombinacje, permutacje.
// Rekurencja „wybierz kolejny element” + cofanie wyboru; wzorce: wypisz wszystkie / znajdź jedno / policz.
module.exports = (h) => {
    const { reader } = h;

    // wspólne generatory (wzorcówki JS)
    const products = (n, alphabet) => {
        const out = [];
        const cur = [];
        const go = (i) => { if (i === n) { out.push(cur.join('')); return; } for (const c of alphabet) { cur.push(c); go(i + 1); cur.pop(); } };
        go(0);
        return out;
    };
    const lexCmp = (a, b) => { for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; };
    const combSum = (vals, T, once) => {
        const a = vals.slice().sort((x, y) => x - y);
        const out = [];
        const cur = [];
        const go = (start, left) => {
            if (left === 0) { out.push(cur.join(' ')); return; }
            for (let i = start; i < a.length; i++) {
                if (once && i > start && a[i] === a[i - 1]) continue;
                if (a[i] > left) break;
                cur.push(a[i]);
                go(once ? i + 1 : i, left - a[i]);
                cur.pop();
            }
        };
        go(0, T);
        return out;
    };

    return [
        // ------------------------------------------------------------ 1
        {
            id: 'rek-ciagi-binarne',
            title: 'Wszystkie ciągi zero-jedynkowe',
            level: 'latwe',
            statement: [
                'Wczytaj n i wypisz wszystkie ciągi długości n złożone z zer i jedynek — w kolejności alfabetycznej (tak jak w słowniku, przy czym 0 jest przed 1).',
                'Rekurencja wypełnia ciąg pozycja po pozycji: funkcja generuj(i) ustawia na pozycji i najpierw 0 i woła generuj(i + 1), a potem ustawia 1 i znowu woła generuj(i + 1). Gdy i == n, ciąg jest gotowy — wypisz go.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz 2ⁿ wierszy — każdy z jednym ciągiem (bez spacji), w kolejności alfabetycznej.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '3', note: 'Drzewo wywołań to drzewo decyzji: na każdej z 3 pozycji wybieramy 0 albo 1, więc ciągów jest 2 · 2 · 2 = 8.' }],
            hint: 'Trzymaj globalny napis s o długości n (string s(n, \'0\')). void generuj(int i): if (i == n) { cout << s << endl; return; } s[i] = \'0\'; generuj(i + 1); s[i] = \'1\'; generuj(i + 1);. Najpierw próbujemy 0, potem 1 — dlatego ciągi wychodzą od razu w kolejności alfabetycznej.',
            tests: () => ['1', '2', '4', '5', '6', '8', '9', '10'],
            solve: (inp) => products(Number(inp), ['0', '1']).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
string s;
void generuj(int i) {
    if (i == n) { cout << s << "\n"; return; }
    s[i] = '0'; generuj(i + 1);
    s[i] = '1'; generuj(i + 1);
}
int main() {
    cin >> n;
    s = string(n, '0');
    generuj(0);
}`,
        },
        // ------------------------------------------------------------ 2
        {
            id: 'rek-ciagi-k',
            title: 'Ciągi z cyfr od 1 do k',
            level: 'latwe',
            statement: [
                'Wczytaj n i k, a potem wypisz wszystkie ciągi długości n, w których każda cyfra jest jedną z cyfr 1, 2, …, k — w kolejności rosnącej (jak liczby).',
                'To uogólnienie poprzedniego zadania: na każdej pozycji jest teraz k możliwości zamiast dwóch, więc w funkcji generuj(i) zamiast dwóch wywołań będzie pętla po cyfrach od 1 do k.',
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Wypisz kⁿ wierszy — każdy z jednym ciągiem cyfr (bez spacji), w kolejności rosnącej.'],
            constraints: ['1 ≤ n ≤ 12', '1 ≤ k ≤ 9', 'kⁿ ≤ 5000'],
            examples: [{ input: '2 3', note: 'Na pierwszej pozycji 1, 2 albo 3, na drugiej tak samo — razem 3 · 3 = 9 ciągów.' }],
            hint: 'void generuj(int i): if (i == n) { wypisz; return; } for (char c = \'1\'; c < \'1\' + k; c++) { s[i] = c; generuj(i + 1); }. Pętla jest tu w porządku — to ona wybiera kolejne możliwości, a rekurencja schodzi do następnej pozycji.',
            tests: () => ['1 1', '1 9', '5 1', '3 2', '3 5', '4 4', '2 9', '12 2', '6 4', '3 9'],
            solve: (inp) => { const [n, k] = h.nums(inp); return products(n, Array.from({ length: k }, (_, i) => String(i + 1))).join('\n'); },
            check: (inp) => { const [n, k] = h.nums(inp); return k ** n > 5000 ? 'k^n > 5000' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, k;
string s;
void generuj(int i) {
    if (i == n) { cout << s << "\n"; return; }
    for (char c = '1'; c < '1' + k; c++) {
        s[i] = c;
        generuj(i + 1);
    }
}
int main() {
    cin >> n >> k;
    s = string(n, '1');
    generuj(0);
}`,
        },
        // ------------------------------------------------------------ 3
        {
            id: 'rek-bez-sasiednich-jedynek',
            title: 'Bez dwóch jedynek obok siebie',
            level: 'srednie',
            statement: [
                'Wczytaj n i wypisz w kolejności alfabetycznej wszystkie ciągi zero-jedynkowe długości n, w których nigdzie nie stoją obok siebie dwie jedynki.',
                'Nie generuj wszystkich ciągów, żeby potem odrzucać złe — sprawdzaj warunek już w trakcie: jedynkę wolno postawić na pozycji i tylko wtedy, gdy na pozycji i − 1 nie ma jedynki. Gałęzie drzewa, które na pewno prowadzą do złych ciągów, w ogóle nie są odwiedzane.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz wszystkie takie ciągi, każdy w osobnym wierszu, w kolejności alfabetycznej.'],
            constraints: ['1 ≤ n ≤ 14'],
            examples: [{ input: '3', note: 'Z 8 ciągów odpadają 011, 110 i 111. Zostaje 5.' }],
            hint: 'Jak w „Wszystkich ciągach zero-jedynkowych”: s[i] = \'0\'; generuj(i + 1);, a potem jedynka tylko wtedy, gdy wolno: if (i == 0 || s[i - 1] == \'0\') { s[i] = \'1\'; generuj(i + 1); }. Ciekawostka: ciągów jest F(n + 2) — znowu Fibonacci!',
            tests: () => ['1', '2', '4', '5', '7', '9', '12', '13', '14'],
            solve: (inp) => products(Number(inp), ['0', '1']).filter((s) => !s.includes('11')).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
string s;
void generuj(int i) {
    if (i == n) { cout << s << "\n"; return; }
    s[i] = '0';
    generuj(i + 1);
    if (i == 0 || s[i - 1] == '0') {
        s[i] = '1';
        generuj(i + 1);
    }
}
int main() {
    cin >> n;
    s = string(n, '0');
    generuj(0);
}`,
        },
        // ------------------------------------------------------------ 4
        {
            id: 'rek-podzbiory',
            title: 'Wszystkie podzbiory',
            level: 'srednie',
            statement: [
                'Wczytaj n i wypisz wszystkie niepuste podzbiory zbioru {1, 2, …, n}. Każdy podzbiór wypisz w osobnym wierszu, z elementami w kolejności rosnącej, oddzielonymi spacjami.',
                'Kolejność podzbiorów jest ustalona przez rekurencję „nie bierz / bierz”: funkcja decyduje kolejno o liczbach 1, 2, …, n i dla każdej najpierw sprawdza wszystkie możliwości BEZ niej, a dopiero potem wszystkie możliwości Z nią. Podzbiór wypisujemy, gdy decyzje o wszystkich n liczbach są podjęte (pusty podzbiór pomijamy). To dokładnie ta sama kolejność, co ciągi zero-jedynkowe z pierwszego zadania: 1 na i-tej pozycji ciągu oznacza „bierzemy liczbę i”.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz 2ⁿ − 1 wierszy z niepustymi podzbiorami, w kolejności opisanej wyżej.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '3', note: 'Ciągi 001, 010, 011, 100, 101, 110, 111 odpowiadają podzbiorom {3}, {2}, {2, 3}, {1}, {1, 3}, {1, 2}, {1, 2, 3}.' }],
            hint: 'Trzymaj wybrane liczby w globalnym vector<int> wybrane. void podzbiory(int i): if (i > n) { jeśli wybrane nie jest puste — wypisz je; return; } podzbiory(i + 1); /* nie bierz */ wybrane.push_back(i); podzbiory(i + 1); /* bierz */ wybrane.pop_back(); /* cofnij wybór */. Bez pop_back liczba i zostałaby w wektorze także w kolejnych podzbiorach!',
            tests: () => ['1', '2', '4', '5', '6', '8', '9', '10'],
            solve: (inp) => { const n = Number(inp); return products(n, ['0', '1']).slice(1).map((s) => s.split('').map((c, i) => (c === '1' ? i + 1 : 0)).filter(Boolean).join(' ')).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
vector<int> wybrane;
void podzbiory(int i) {
    if (i > n) {
        if (wybrane.empty()) return;
        for (int x : wybrane) cout << x << " ";
        cout << "\n";
        return;
    }
    podzbiory(i + 1);
    wybrane.push_back(i);
    podzbiory(i + 1);
    wybrane.pop_back();
}
int main() {
    cin >> n;
    wybrane.clear();
    podzbiory(1);
}`,
        },
        // ------------------------------------------------------------ 5
        {
            id: 'rek-sumy-podzbiorow',
            title: 'Sumy wszystkich podzbiorów',
            level: 'srednie',
            statement: [
                'Dana jest tablica n liczb. Dla każdego z 2ⁿ podzbiorów (łącznie z pustym, którego suma to 0) policz sumę jego elementów. Wypisz wszystkie te sumy w kolejności niemalejącej.',
                'Nie musisz pamiętać, które elementy wybrałeś — wystarczy nieść w parametrze dotychczasową sumę: suma(i, s) decyduje o elemencie a[i], mając już uzbierane s.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.'],
            output_format: ['Wypisz w jednym wierszu 2ⁿ sum, oddzielonych spacjami, w kolejności niemalejącej.'],
            constraints: ['1 ≤ n ≤ 12', '1 ≤ aᵢ ≤ 1000'],
            examples: [{ input: '3\n2 3 5', note: 'Podzbiory: {} → 0, {2} → 2, {3} → 3, {5} → 5, {2, 3} → 5, {2, 5} → 7, {3, 5} → 8, {2, 3, 5} → 10. Suma 5 pojawia się dwa razy.' }],
            hint: 'void sumy(int i, int s): if (i == n) { wynik.push_back(s); return; } sumy(i + 1, s); sumy(i + 1, s + a[i]);. Z main: sumy(0, 0), potem sort(wynik.begin(), wynik.end()) i wypisanie. Tutaj nie trzeba niczego cofać, bo suma jest parametrem — każde wywołanie ma własną kopię.',
            tests: (r) => { const T = (n, hi) => `${n}\n${r.arr(n, 1, hi).join(' ')}`; return ['1\n7', '2\n1 1', '4\n1 2 4 8', T(5, 10), T(8, 100), T(10, 1000), T(12, 1000), T(12, 3)]; },
            solve: (inp) => { const a = h.nums(inp).slice(1); const o = []; const go = (i, s) => { if (i === a.length) { o.push(s); return; } go(i + 1, s); go(i + 1, s + a[i]); }; go(0, 0); return o.sort((x, y) => x - y).join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int a[12];
vector<int> wynik;
void sumy(int i, int s) {
    if (i == n) { wynik.push_back(s); return; }
    sumy(i + 1, s);
    sumy(i + 1, s + a[i]);
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    wynik.clear();
    sumy(0, 0);
    sort(wynik.begin(), wynik.end());
    for (int x : wynik) cout << x << " ";
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 6
        {
            id: 'rek-podzbiory-suma-k',
            title: 'Ile podzbiorów ma sumę k?',
            level: 'srednie',
            statement: [
                'Dana jest tablica n dodatnich liczb i liczba k. Ile jest podzbiorów tablicy, których elementy sumują się dokładnie do k? Podzbiory różnią się wybranymi pozycjami — jeśli w tablicy są dwie równe liczby, to wybór pierwszej i wybór drugiej liczą się jako dwa różne podzbiory.',
                'Tym razem niczego nie wypisujemy po drodze — funkcja zwraca liczbę: ile(i, s) = ile jest sposobów dokończenia wyboru od elementu i, mając już uzbieraną sumę s.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i k.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.'],
            output_format: ['Wypisz jedną liczbę — liczbę podzbiorów o sumie k.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ aᵢ ≤ 10⁶', '1 ≤ k ≤ 2 · 10⁷'],
            examples: [{ input: '4 5\n1 2 3 2', note: 'Sumę 5 dają {2, 3} (pierwsza dwójka), {3, 2} (druga dwójka) i {1, 2, 2} — razem 3.' }],
            hint: 'int ile(int i, long long s): if (i == n) return s == k ? 1 : 0; return ile(i + 1, s) + ile(i + 1, s + a[i]);. To wzorzec „policz”: zamiast wypisywać, każdy liść drzewa zwraca 1 albo 0, a węzły sumują wyniki dzieci. Możesz też przerwać gałąź, gdy s > k — liczby są dodatnie, więc suma już nie zmaleje.',
            tests: (r) => { const T = (n, hi, k) => `${n} ${k}\n${r.arr(n, 1, hi).join(' ')}`; return ['1 5\n5', '1 4\n5', '3 3\n1 1 1', '20 10\n1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1', T(10, 10, 20), T(15, 20, 50), T(20, 10, 60), T(20, 1000000, 5000000), T(20, 5, 30), T(18, 100, 2000)]; },
            solve: (inp) => { const a = h.nums(inp); const n = a[0], k = a[1], v = a.slice(2); let c = 0; const go = (i, s) => { if (s > k) return; if (i === n) { if (s === k) c++; return; } go(i + 1, s); go(i + 1, s + v[i]); }; go(0, 0); return String(c); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
long long k;
long long a[20];
long long ile(int i, long long s) {
    if (i == n) return s == k ? 1 : 0;
    return ile(i + 1, s) + ile(i + 1, s + a[i]);
}
int main() {
    cin >> n >> k;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << ile(0, 0) << "\n";
}`,
        },
        // ------------------------------------------------------------ 7
        {
            id: 'rek-czy-suma-k',
            title: 'Czy da się uzbierać k?',
            level: 'srednie',
            statement: [
                'Dana jest tablica n dodatnich liczb. Bajtek zadaje q pytań: czy da się wybrać kilka (co najmniej jedną) liczb z tablicy tak, żeby ich suma wynosiła dokładnie k? Każdą liczbę z tablicy można wybrać co najwyżej raz.',
                'To wzorzec „znajdź jedno”: funkcja zwraca bool i gdy tylko znajdzie pasujący wybór, od razu przestaje szukać — nie ma sensu przeglądać reszty drzewa, skoro odpowiedź już znamy.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i q.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.', 'W każdym z kolejnych q wierszy znajduje się jedna liczba całkowita k.'],
            output_format: ['Dla każdego pytania wypisz w osobnym wierszu TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ q ≤ 5', '1 ≤ aᵢ ≤ 10⁶', '1 ≤ k ≤ 2 · 10⁷'],
            examples: [{ input: '4 3\n3 34 4 12\n9\n19\n53', note: 'Sumy 9 nie da się złożyć z tych liczb — NIE. 19 = 3 + 4 + 12 — TAK. 53 = 3 + 34 + 4 + 12 — TAK.' }],
            hint: 'bool da(int i, long long s): if (s == k) return true; if (i == n || s > k) return false; if (da(i + 1, s + a[i])) return true; return da(i + 1, s);. Gdy któreś wywołanie zwróci true, wracamy od razu, nie sprawdzając pozostałych gałęzi. Zaczynamy od da(0, 0) — a ponieważ k ≥ 1, pusty wybór nigdy nie przejdzie.',
            tests: (r) => {
                const T = (n, hi) => { const a = r.arr(n, 1, hi); const sum = a.reduce((x, y) => x + y, 0); const qs = Array.from({ length: 5 }, () => (r() < 0.5 ? r.shuffle(a).slice(0, r.int(1, n)).reduce((x, y) => x + y, 0) : r.int(1, Math.min(2e7, sum + 5)))); return `${n} 5\n${a.join(' ')}\n${qs.join('\n')}`; };
                return ['1 2\n5\n5\n4', '3 3\n2 4 6\n1\n7\n12', T(10, 50), T(15, 1000), T(20, 1000000), T(20, 100), `20 5\n${Array(20).fill(2).join(' ')}\n1\n39\n41\n40\n20000000`];
            },
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), q = rd.int(); const a = rd.ints(n); const o = []; for (let z = 0; z < q; z++) { const k = rd.int(); const can = new Set([0]); let ok = false; for (const x of a) { for (const s of [...can]) { const t = s + x; if (t === k) ok = true; if (t <= k) can.add(t); } } o.push(ok ? 'TAK' : 'NIE'); } return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
long long k;
long long a[20];
bool da(int i, long long s) {
    if (s == k) return true;
    if (i == n || s > k) return false;
    if (da(i + 1, s + a[i])) return true;
    return da(i + 1, s);
}
int main() {
    int q;
    cin >> n >> q;
    for (int i = 0; i < n; i++) cin >> a[i];
    while (q--) {
        cin >> k;
        cout << (da(0, 0) ? "TAK" : "NIE") << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 8
        {
            id: 'rek-kombinacje',
            title: 'Wybierz k z n',
            level: 'srednie',
            statement: [
                'Wczytaj n i k i wypisz wszystkie k-elementowe podzbiory zbioru {1, 2, …, n}. Każdy podzbiór wypisz w osobnym wierszu, z elementami rosnąco, a same podzbiory — w kolejności leksykograficznej (najpierw porównujemy pierwsze elementy, przy równych — drugie, i tak dalej).',
                'Funkcja wybieraj(od, ile) dobiera kolejną liczbę spośród od, od + 1, …, n — liczby dobieramy rosnąco, więc każdy podzbiór powstanie tylko raz.',
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Wypisz wszystkie k-elementowe podzbiory, każdy w osobnym wierszu, w kolejności leksykograficznej.'],
            constraints: ['1 ≤ k ≤ n ≤ 12'],
            examples: [{ input: '4 2', note: 'Podzbiorów jest C(4, 2) = 6.' }],
            hint: 'void wybieraj(int od): if (wybrane.size() == k) { wypisz; return; } for (int x = od; x <= n; x++) { wybrane.push_back(x); wybieraj(x + 1); wybrane.pop_back(); }. Następna liczba musi być większa od poprzedniej — dlatego wołamy wybieraj(x + 1), a nie wybieraj(od + 1).',
            tests: () => ['1 1', '3 3', '5 1', '5 3', '6 2', '8 4', '10 5', '12 6', '12 11'],
            solve: (inp) => { const [n, k] = h.nums(inp); const o = []; const cur = []; const go = (od) => { if (cur.length === k) { o.push(cur.join(' ')); return; } for (let x = od; x <= n; x++) { cur.push(x); go(x + 1); cur.pop(); } }; go(1); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, k;
vector<int> wybrane;
void wybieraj(int od) {
    if ((int)wybrane.size() == k) {
        for (int x : wybrane) cout << x << " ";
        cout << "\n";
        return;
    }
    for (int x = od; x <= n; x++) {
        wybrane.push_back(x);
        wybieraj(x + 1);
        wybrane.pop_back();
    }
}
int main() {
    cin >> n >> k;
    wybrane.clear();
    wybieraj(1);
}`,
        },
        // ------------------------------------------------------------ 9
        {
            id: 'rek-permutacje',
            title: 'Wszystkie permutacje',
            level: 'srednie',
            statement: [
                'Permutacja liczb 1, 2, …, n to ustawienie ich wszystkich w jakiejś kolejności, każdej dokładnie raz. Wczytaj n i wypisz wszystkie permutacje w kolejności leksykograficznej.',
                'Na każdą pozycję próbujemy wstawić każdą liczbę, która nie została jeszcze użyta. Do pamiętania, które liczby są zajęte, użyj tablicy bool uzyta[], a po powrocie z rekurencji pamiętaj, żeby liczbę zwolnić.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz n! wierszy — każdy z jedną permutacją (liczby oddzielone spacjami) — w kolejności leksykograficznej.'],
            constraints: ['1 ≤ n ≤ 7'],
            examples: [{ input: '3', note: 'Na pierwszą pozycję 3 możliwości, na drugą 2, na trzecią 1 — razem 3! = 6 permutacji.' }],
            hint: 'void permutuj(int i): if (i == n) { wypisz; return; } for (int x = 1; x <= n; x++) if (!uzyta[x]) { uzyta[x] = true; perm[i] = x; permutuj(i + 1); uzyta[x] = false; }. Linijka uzyta[x] = false to cofnięcie wyboru — bez niej liczba x zostałaby zablokowana na zawsze.',
            tests: () => ['1', '2', '4', '5', '6', '7'],
            solve: (inp) => { const n = Number(inp); const o = []; const cur = []; const used = Array(n + 1).fill(false); const go = () => { if (cur.length === n) { o.push(cur.join(' ')); return; } for (let x = 1; x <= n; x++) if (!used[x]) { used[x] = true; cur.push(x); go(); cur.pop(); used[x] = false; } }; go(); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int perm[8];
bool uzyta[8];
void permutuj(int i) {
    if (i == n) {
        for (int j = 0; j < n; j++) cout << perm[j] << " ";
        cout << "\n";
        return;
    }
    for (int x = 1; x <= n; x++) {
        if (uzyta[x]) continue;
        uzyta[x] = true;
        perm[i] = x;
        permutuj(i + 1);
        uzyta[x] = false;
    }
}
int main() {
    cin >> n;
    for (int x = 0; x < 8; x++) uzyta[x] = false;
    permutuj(0);
}`,
        },
        // ------------------------------------------------------------ 10
        {
            id: 'rek-permutacje-napisu',
            title: 'Permutacje napisu',
            level: 'trudne',
            statement: [
                'Wczytaj słowo s i wypisz wszystkie RÓŻNE słowa, które można ułożyć, przestawiając jego litery — w kolejności alfabetycznej. Uwaga: litery w s mogą się powtarzać, a każde słowo ma się pojawić tylko raz. Na przykład z „aab” powstają tylko trzy słowa: aab, aba, baa.',
                'Zamiast zaznaczać, które pozycje są użyte, policz, ile jest każdej litery, i na każdą kolejną pozycję wstawiaj tylko te litery, których jeszcze zostało więcej niż zero — każdą RÓŻNĄ literę tylko raz.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się słowo s złożone z małych liter alfabetu angielskiego.'],
            output_format: ['Wypisz wszystkie różne słowa powstałe z przestawienia liter s, każde w osobnym wierszu, w kolejności alfabetycznej.'],
            constraints: ['1 ≤ długość s ≤ 7'],
            examples: [{ input: 'aab' }, { input: 'abc' }],
            hint: 'int ile[26] — ile zostało każdej litery. void generuj(int i): if (i == n) { wypisz; return; } for (int c = 0; c < 26; c++) if (ile[c] > 0) { ile[c]--; slowo[i] = \'a\' + c; generuj(i + 1); ile[c]++; }. Pętla przechodzi po różnych literach (a nie po pozycjach w s), więc dwie jednakowe litery nigdy nie dadzą dwa razy tego samego słowa — a pętla od a do z daje od razu kolejność alfabetyczną.',
            tests: (r) => ['a', 'zz', 'ba', 'abcd', 'aabb', 'banana', 'mississ', 'abcdefg', 'aaaaaaa', r.word(7, 'abc'), r.word(6, 'xyz')],
            solve: (inp) => { const s = inp.trim(); const cnt = {}; for (const c of s) cnt[c] = (cnt[c] || 0) + 1; const letters = Object.keys(cnt).sort(); const o = []; const cur = []; const go = () => { if (cur.length === s.length) { o.push(cur.join('')); return; } for (const c of letters) if (cnt[c] > 0) { cnt[c]--; cur.push(c); go(); cur.pop(); cnt[c]++; } }; go(); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int ile[26];
string slowo;
void generuj(int i) {
    if (i == n) { cout << slowo << "\n"; return; }
    for (int c = 0; c < 26; c++) {
        if (ile[c] == 0) continue;
        ile[c]--;
        slowo[i] = 'a' + c;
        generuj(i + 1);
        ile[c]++;
    }
}
int main() {
    string s;
    cin >> s;
    n = s.size();
    for (int c = 0; c < 26; c++) ile[c] = 0;
    for (char ch : s) ile[ch - 'a']++;
    slowo = s;
    generuj(0);
}`,
        },
        // ------------------------------------------------------------ 11
        {
            id: 'rek-nawiasy',
            title: 'Poprawne nawiasowania',
            level: 'srednie',
            statement: [
                'Napis z nawiasów jest poprawny, jeśli każdy nawias otwierający „(” ma swój nawias zamykający „)” stojący gdzieś za nim, i odwrotnie. Na przykład (()()) jest poprawny, a ())( — nie.',
                'Wczytaj n i wypisz wszystkie poprawne napisy złożone z n nawiasów otwierających i n zamykających, w kolejności alfabetycznej, w której „(” jest przed „)”. Generuj je rekurencyjnie, dopisując po jednym nawiasie — i dopisuj tylko takie, które mogą jeszcze prowadzić do poprawnego napisu.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz wszystkie poprawne napisy z n par nawiasów, każdy w osobnym wierszu.'],
            constraints: ['1 ≤ n ≤ 8'],
            examples: [{ input: '3', note: 'Poprawnych napisów z 3 par nawiasów jest 5.' }],
            hint: 'Pamiętaj, ile nawiasów już otworzyłeś (otw) i zamknąłeś (zam). void generuj(int otw, int zam): if (zam == n) { wypisz; return; } if (otw < n) { dopisz \'(\'; generuj(otw + 1, zam); usuń ostatni znak; } if (zam < otw) { dopisz \')\'; generuj(otw, zam + 1); usuń ostatni znak; }. Zamknąć wolno tylko wtedy, gdy jest co zamykać: zam < otw.',
            tests: () => ['1', '2', '4', '5', '6', '7', '8'],
            solve: (inp) => { const n = Number(inp); const o = []; const go = (s, a, b) => { if (b === n) { o.push(s); return; } if (a < n) go(s + '(', a + 1, b); if (b < a) go(s + ')', a, b + 1); }; go('', 0, 0); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
string s;
void generuj(int otw, int zam) {
    if (zam == n) { cout << s << "\n"; return; }
    if (otw < n) {
        s.push_back('(');
        generuj(otw + 1, zam);
        s.pop_back();
    }
    if (zam < otw) {
        s.push_back(')');
        generuj(otw, zam + 1);
        s.pop_back();
    }
}
int main() {
    cin >> n;
    s.clear();
    generuj(0, 0);
}`,
        },
        // ------------------------------------------------------------ 12
        {
            id: 'rek-rozklady',
            title: 'Rozkłady liczby na składniki',
            level: 'srednie',
            statement: [
                'Wczytaj n i wypisz wszystkie sposoby zapisania n jako sumy dodatnich liczb całkowitych, w których kolejność składników nie ma znaczenia. Każdy rozkład zapisz ze składnikami w kolejności nierosnącej, połączonymi znakiem + (bez spacji).',
                'Rozkłady wypisz od „największego”: najpierw porównujemy pierwsze składniki — rozkład z większym pierwszym składnikiem idzie wcześniej; przy równych pierwszych porównujemy drugie, i tak dalej. Rekurencja dopisuje kolejne składniki — każdy nie większy niż poprzedni i nie większy niż to, co zostało do rozłożenia.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz wszystkie rozkłady, każdy w osobnym wierszu, w opisanej kolejności.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '4', note: 'To jest ta sama liczba sposobów (5), którą liczyliśmy w kroku 3 w zadaniu „Na ile sposobów rozłożyć liczbę?” — tym razem każdy sposób wypisujemy.' }],
            hint: 'void rozklad(int zostalo, int maks): if (zostalo == 0) { wypisz składniki; return; } for (int x = min(zostalo, maks); x >= 1; x--) { skladniki.push_back(x); rozklad(zostalo - x, x); skladniki.pop_back(); }. Z main: rozklad(n, n). Pętla idzie od największego x w dół — stąd kolejność od „największego” rozkładu.',
            tests: () => ['1', '2', '3', '5', '7', '10', '14', '18', '20'],
            solve: (inp) => { const n = Number(inp); const o = []; const cur = []; const go = (left, mx) => { if (!left) { o.push(cur.join('+')); return; } for (let x = Math.min(left, mx); x >= 1; x--) { cur.push(x); go(left - x, x); cur.pop(); } }; go(n, n); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> skladniki;
void rozklad(int zostalo, int maks) {
    if (zostalo == 0) {
        for (size_t i = 0; i < skladniki.size(); i++) cout << (i ? "+" : "") << skladniki[i];
        cout << "\n";
        return;
    }
    for (int x = min(zostalo, maks); x >= 1; x--) {
        skladniki.push_back(x);
        rozklad(zostalo - x, x);
        skladniki.pop_back();
    }
}
int main() {
    int n;
    cin >> n;
    skladniki.clear();
    rozklad(n, n);
}`,
        },
        // ------------------------------------------------------------ 13
        {
            id: 'rek-suma-z-powtorzeniami',
            title: 'Suma z powtórzeniami',
            level: 'srednie',
            statement: [
                'Dane są różne dodatnie liczby a₁, …, aₙ i cel T. Wypisz wszystkie sposoby uzyskania sumy T z tych liczb, jeśli każdej liczby wolno użyć dowolnie wiele razy (także zero). Kolejność składników nie ma znaczenia, więc każdy sposób zapisz jako ciąg niemalejący.',
                'Sposoby wypisz w kolejności leksykograficznej (porównujemy kolejne liczby jak w słowniku). Jeśli nie ma żadnego sposobu, wypisz BRAK.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i T.', 'W drugim wierszu znajduje się n różnych liczb całkowitych a₁, …, aₙ.'],
            output_format: ['Wypisz wszystkie sposoby, każdy w osobnym wierszu, z liczbami oddzielonymi spacjami — albo jedno słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 10', '1 ≤ aᵢ ≤ 40', '1 ≤ T ≤ 40', 'sposobów jest co najwyżej 2000'],
            examples: [{ input: '4 7\n2 3 6 7', note: '7 = 2 + 2 + 3 = 7. Liczby 6 nie da się uzupełnić do 7.' }, { input: '1 5\n2' }],
            hint: 'Posortuj liczby. void szukaj(int od, int zostalo): if (zostalo == 0) { wypisz; return; } for (int i = od; i < n; i++) { if (a[i] > zostalo) break; wybrane.push_back(a[i]); szukaj(i, zostalo - a[i]); wybrane.pop_back(); }. Wołamy szukaj(i, …), a nie szukaj(i + 1, …) — tej samej liczby wolno użyć jeszcze raz. Ale nigdy nie cofamy się do mniejszych liczb, więc każdy sposób powstanie raz.',
            tests: (r) => {
                const T = (n, hi, t) => { const a = r.shuffle(Array.from({ length: hi }, (_, i) => i + 1)).slice(0, n); return `${n} ${t}\n${a.join(' ')}`; };
                return ['1 1\n1', '1 40\n7', '3 8\n2 3 5', '2 40\n3 5', '5 30\n4 6 9 11 15', T(4, 20, 40), T(6, 40, 40), T(10, 40, 30), '3 40\n2 3 7', '5 25\n5 10 15 20 25'];
            },
            solve: (inp) => { const a = h.nums(inp); const n = a[0], t = a[1]; const o = combSum(a.slice(2, 2 + n), t, false); return o.length ? o.join('\n') : 'BRAK'; },
            check: (inp) => { const a = h.nums(inp); const n = a[0]; if (new Set(a.slice(2, 2 + n)).size !== n) return 'powtórzone liczby'; return combSum(a.slice(2, 2 + n), a[1], false).length > 2000 ? 'za dużo sposobów' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
vector<int> a, wybrane;
bool znaleziono;
void szukaj(int od, int zostalo) {
    if (zostalo == 0) {
        znaleziono = true;
        for (int x : wybrane) cout << x << " ";
        cout << "\n";
        return;
    }
    for (int i = od; i < n; i++) {
        if (a[i] > zostalo) break;
        wybrane.push_back(a[i]);
        szukaj(i, zostalo - a[i]);
        wybrane.pop_back();
    }
}
int main() {
    int T;
    cin >> n >> T;
    a.assign(n, 0);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end());
    wybrane.clear();
    znaleziono = false;
    szukaj(0, T);
    if (!znaleziono) cout << "BRAK\n";
}`,
        },
        // ------------------------------------------------------------ 14
        {
            id: 'rek-suma-bez-powtorzen',
            title: 'Każda liczba co najwyżej raz',
            level: 'trudne',
            statement: [
                'Dane są dodatnie liczby a₁, …, aₙ (tym razem mogą się powtarzać) i cel T. Wypisz wszystkie RÓŻNE sposoby uzyskania sumy T, jeśli każdej pozycji z wejścia wolno użyć co najwyżej raz. Sposób zapisujemy jako ciąg niemalejący; dwa sposoby są takie same, jeśli dają ten sam ciąg — nawet gdy biorą liczby z różnych pozycji.',
                'Sposoby wypisz w kolejności leksykograficznej. Jeśli nie ma żadnego sposobu, wypisz BRAK.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i T.', 'W drugim wierszu znajduje się n liczb całkowitych a₁, …, aₙ.'],
            output_format: ['Wypisz wszystkie różne sposoby, każdy w osobnym wierszu, z liczbami oddzielonymi spacjami — albo jedno słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ aᵢ ≤ 50', '1 ≤ T ≤ 50', 'sposobów jest co najwyżej 2000'],
            examples: [{ input: '7 8\n10 1 2 7 6 1 5', note: 'Jedynki są dwie, więc 1 1 6 jest możliwe, ale 1 7 wypisujemy tylko raz, choć można je wziąć na dwa sposoby.' }],
            hint: 'Posortuj liczby. Jak w poprzednim zadaniu, ale wołaj szukaj(i + 1, …) (każda pozycja raz) i pomijaj powtórki NA TYM SAMYM POZIOMIE: w pętli for (int i = od; i < n; i++) dodaj if (i > od && a[i] == a[i - 1]) continue;. Dzięki temu z kilku równych liczb jako „kolejny składnik” próbujemy tylko pierwszej.',
            tests: (r) => {
                const T = (n, hi, t) => `${n} ${t}\n${r.arr(n, 1, hi).join(' ')}`;
                return ['1 3\n3', '3 4\n1 1 1', '5 5\n2 5 2 1 2', '4 50\n1 2 3 4', T(10, 10, 15), T(15, 20, 30), T(20, 50, 50), T(20, 5, 20), T(12, 30, 45), `20 10\n${Array(20).fill(1).join(' ')}`];
            },
            solve: (inp) => { const a = h.nums(inp); const n = a[0], t = a[1]; const o = combSum(a.slice(2, 2 + n), t, true); return o.length ? o.join('\n') : 'BRAK'; },
            check: (inp) => { const a = h.nums(inp); return combSum(a.slice(2, 2 + a[0]), a[1], true).length > 2000 ? 'za dużo sposobów' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
vector<int> a, wybrane;
bool znaleziono;
void szukaj(int od, int zostalo) {
    if (zostalo == 0) {
        znaleziono = true;
        for (int x : wybrane) cout << x << " ";
        cout << "\n";
        return;
    }
    for (int i = od; i < n; i++) {
        if (i > od && a[i] == a[i - 1]) continue;
        if (a[i] > zostalo) break;
        wybrane.push_back(a[i]);
        szukaj(i + 1, zostalo - a[i]);
        wybrane.pop_back();
    }
}
int main() {
    int T;
    cin >> n >> T;
    a.assign(n, 0);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end());
    wybrane.clear();
    znaleziono = false;
    szukaj(0, T);
    if (!znaleziono) cout << "BRAK\n";
}`,
        },
        // ------------------------------------------------------------ 15
        {
            id: 'rek-podzbiory-bez-powtorzen',
            title: 'Podzbiory bez powtórzeń',
            level: 'trudne',
            statement: [
                'Dana jest tablica n liczb, w której liczby mogą się powtarzać. Wypisz wszystkie RÓŻNE niepuste „podzbiory” tej tablicy — każdy jako ciąg niemalejący. Dwa wybory dające ten sam ciąg liczymy jako jeden podzbiór: z tablicy 1 2 2 da się wybrać „1 2” na dwa sposoby, ale wypisujemy je raz.',
                'Podzbiory wypisz w kolejności leksykograficznej — przy czym krótszy ciąg, który jest początkiem dłuższego, idzie przed nim (tak jak „1 2” przed „1 2 2”).',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₁, …, aₙ.'],
            output_format: ['Wypisz wszystkie różne niepuste podzbiory, każdy w osobnym wierszu, z liczbami oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 10', '1 ≤ aᵢ ≤ 10'],
            examples: [{ input: '3\n2 1 2', note: 'Różne podzbiory to: 1; 1 2; 1 2 2; 2; 2 2.' }],
            hint: 'Posortuj tablicę. void podzbiory(int od): for (int i = od; i < n; i++) { if (i > od && a[i] == a[i - 1]) continue; wybrane.push_back(a[i]); wypisz wybrane; podzbiory(i + 1); wybrane.pop_back(); }. Każde wywołanie wypisuje podzbiór od razu po dopisaniu liczby — dzięki temu krótszy podzbiór pojawia się przed swoimi przedłużeniami.',
            tests: (r) => { const T = (n, hi) => `${n}\n${r.arr(n, 1, hi).join(' ')}`; return ['1\n5', '2\n3 3', '4\n1 2 3 4', '5\n1 1 1 1 1', T(6, 3), T(8, 5), T(10, 10), T(10, 2), T(10, 4)]; },
            solve: (inp) => { const a = h.nums(inp).slice(1).sort((x, y) => x - y); const o = []; const cur = []; const go = (od) => { for (let i = od; i < a.length; i++) { if (i > od && a[i] === a[i - 1]) continue; cur.push(a[i]); o.push(cur.join(' ')); go(i + 1); cur.pop(); } }; go(0); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
vector<int> a, wybrane;
void podzbiory(int od) {
    for (int i = od; i < n; i++) {
        if (i > od && a[i] == a[i - 1]) continue;
        wybrane.push_back(a[i]);
        for (int x : wybrane) cout << x << " ";
        cout << "\n";
        podzbiory(i + 1);
        wybrane.pop_back();
    }
}
int main() {
    cin >> n;
    a.assign(n, 0);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end());
    wybrane.clear();
    podzbiory(0);
}`,
        },
        // ------------------------------------------------------------ 16
        {
            id: 'rek-klawiatura-telefonu',
            title: 'Klawiatura telefonu',
            level: 'srednie',
            statement: [
                'W starych telefonach na klawiszach z cyframi były też litery: 2 — abc, 3 — def, 4 — ghi, 5 — jkl, 6 — mno, 7 — pqrs, 8 — tuv, 9 — wxyz. Bajtek wcisnął ciąg cyfr i zastanawia się, jakie słowa mógł mieć na myśli.',
                'Wypisz wszystkie słowa, które odpowiadają wciśniętym cyfrom (każda cyfra daje jedną ze swoich liter), w kolejności alfabetycznej.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się ciąg cyfr od 2 do 9.'],
            output_format: ['Wypisz wszystkie pasujące słowa, każde w osobnym wierszu, w kolejności alfabetycznej.'],
            constraints: ['ciąg ma od 1 do 5 cyfr'],
            examples: [{ input: '23', note: 'Pierwsza litera z abc, druga z def — razem 3 · 3 = 9 słów.' }],
            hint: 'Zrób tablicę napisów litery[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"}. void generuj(int i): if (i == cyfry.size()) { wypisz; return; } for (char c : litery[cyfry[i] - \'0\']) { slowo[i] = c; generuj(i + 1); }. To „Ciągi z cyfr od 1 do k”, tylko na każdej pozycji jest inny zestaw możliwości.',
            tests: (r) => ['2', '7', '79', '234', '999', '7777', '2345', '97979', '23456', String(r.int(22222, 99999)).replace(/[01]/g, '5')],
            solve: (inp) => { const L = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']; const d = inp.trim(); const o = []; const go = (i, s) => { if (i === d.length) { o.push(s); return; } for (const c of L[Number(d[i])]) go(i + 1, s + c); }; go(0, ''); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
const string litery[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
string cyfry, slowo;
void generuj(int i) {
    if (i == (int)cyfry.size()) { cout << slowo << "\n"; return; }
    for (char c : litery[cyfry[i] - '0']) {
        slowo[i] = c;
        generuj(i + 1);
    }
}
int main() {
    cin >> cyfry;
    slowo = cyfry;
    generuj(0);
}`,
        },
        // ------------------------------------------------------------ 17
        {
            id: 'rek-k-ta-permutacja',
            title: 'K-ta permutacja',
            level: 'trudne',
            statement: [
                'Wszystkie permutacje liczb 1, 2, …, n ustawiamy w kolejności leksykograficznej i numerujemy od 1. Dla n = 3 są to kolejno: 1 2 3, 1 3 2, 2 1 3, 2 3 1, 3 1 2, 3 2 1. Wypisz k-tą z nich.',
                'Można wygenerować permutacje jedna po drugiej (jak w „Wszystkich permutacjach”) i zatrzymać się na k-tej. Ale da się sprytniej: permutacji zaczynających się od 1 jest (n − 1)!, od 2 — też (n − 1)!, i tak dalej. Z tego od razu widać, jaka liczba stoi na pierwszym miejscu — a resztę znajdzie rekurencja.',
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Wypisz w jednym wierszu k-tą permutację — n liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 12', '1 ≤ k ≤ n!'],
            examples: [{ input: '3 4', note: 'Czwarta permutacja to 2 3 1.' }, { input: '4 9', note: 'Permutacji zaczynających się od 1 jest 3! = 6, więc 9. permutacja to 3. permutacja spośród tych, które zaczynają się od 2: 2 1 3 4, 2 1 4 3, 2 3 1 4.' }],
            hint: 'void kta(vector<int> zostale, long long k): jeśli zostale jest puste — return. Niech f = (liczba zostałych − 1)!. Pierwsza liczba to zostale[(k − 1) / f] — wypisz ją, usuń z wektora i wywołaj kta(zostale, (k − 1) % f + 1). Dla n = 12 permutacji jest 479 001 600 — generowanie po kolei byłoby za wolne, więc potrzebny jest ten sposób. Pamiętaj o long long.',
            tests: () => ['1 1', '2 2', '3 1', '3 6', '5 60', '8 40320', '9 123456', '10 3628800', '12 1', '12 479001600', '12 239500800', '11 31415926'],
            solve: (inp) => { const [n, k0] = h.nums(inp); let k = BigInt(k0) - 1n; const left = Array.from({ length: n }, (_, i) => i + 1); const fact = [1n]; for (let i = 1; i <= n; i++) fact.push(fact[i - 1] * BigInt(i)); const o = []; for (let i = n; i >= 1; i--) { const f = fact[i - 1]; const idx = Number(k / f); o.push(left[idx]); left.splice(idx, 1); k %= f; } return o.join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long silnia(int n) { return n <= 1 ? 1 : n * silnia(n - 1); }
void kta(vector<int> zostale, long long k) {
    if (zostale.empty()) return;
    long long f = silnia(zostale.size() - 1);
    int idx = (k - 1) / f;
    cout << zostale[idx] << " ";
    zostale.erase(zostale.begin() + idx);
    kta(zostale, (k - 1) % f + 1);
}
int main() {
    int n; long long k;
    cin >> n >> k;
    vector<int> v;
    for (int i = 1; i <= n; i++) v.push_back(i);
    kta(v, k);
    cout << "\n";
}`,
        },
    ];
};
