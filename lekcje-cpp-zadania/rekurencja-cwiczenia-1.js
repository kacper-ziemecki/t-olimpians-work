// Rekurencja — ćwiczenia w trakcie lekcji, części 1–3: pierwsza rekurencja (warunek stopu, krok w stronę stopu, parametry
// zamiast licznika pętli, cin w rekurencji), kod przed wywołaniem i po nim (odwracanie kolejności, cyfry od lewej, zagnieżdżanie)
// oraz rekurencja oddająca wynik (zaufaj rekurencji, funkcje bool, parametr-akumulator, ciągi z przepisu).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./rekurencja-pomoc');
    const { calk, B, losDlugi } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const bigOk = (s, lo, hi) => /^\d+$/.test(s) && B(s) >= B(lo) && B(s) <= B(hi);
    const E18 = '1000000000000000000';
    // t liczb do 10¹⁸ (napisy), po jednej w wierszu
    const listaT = (a) => `${a.length}\n${a.join('\n')}`;
    const checkT = (inp, tMax, lo, hi) => {
        const t = toks(inp); const n = Number(t[0]);
        return calk(n, 1, tMax) && t.length === n + 1 && t.slice(1).every((x) => bigOk(x, lo, hi)) ? null : 'dane';
    };
    const losoweDuze = (r, k, lo = '0', hi = E18) => Array.from({ length: k }, () => String(losDlugi(r, lo, hi)));

    return [
        // ================================================================ KROK 1 · pierwsza rekurencja
        {
            id: 'rk-odliczanie-co-k', krok: 1, level: 'latwe',
            title: 'Odliczanie co k',
            short: 'Odliczaj od n w dół co k: n, n − k, n − 2k, … dopóki liczba jest dodatnia, a potem Start!. Uważaj, żeby warunek stopu nie przeoczył zera.',
            tags: ['warunek stopu', 'krok w stronę stopu', 'n <= 0 zamiast n == 0'],
            statement: ['Kontrola lotów odlicza przed startem rakiety, ale nie co 1, tylko co k: n, n − k, n − 2k, … Wypisuje tylko liczby dodatnie. Gdy kolejna liczba byłaby zerem albo liczbą ujemną, zamiast niej pada komenda Start!.',
                'Napisz funkcję rekurencyjną void odliczaj(int n, int k), która wypisuje n i wywołuje samą siebie dla n − k. Pomyśl, jaki warunek stopu zadziała także wtedy, gdy odliczanie „przeskoczy” zero. Funkcja nie może mieć w środku żadnej pętli.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite n i k.'],
            output_format: ['Kolejne dodatnie liczby odliczania, każda w osobnym wierszu, a w ostatnim wierszu napis Start!'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ k ≤ 3000'],
            examples: [
                { input: '10 3', note: '10, 7, 4, 1 — następna byłaby −2, więc zamiast niej Start!. Z warunkiem stopu n == 0 funkcja minęłaby zero i schodziłaby w nieskończoność: −2, −5, −8, …' },
                { input: '6 2', note: 'Tu odliczanie trafia dokładnie w zero: 6, 4, 2, a potem Start!.' },
            ],
            hint: R`void odliczaj(int n, int k) { if (n <= 0) { cout << "Start!\n"; return; } cout << n << "\n"; odliczaj(n - k, k); }. Warunek n <= 0 łapie i zero, i „przeskoczenie” poniżej zera. W main wystarczy wczytać n, k i wywołać odliczaj(n, k);.`,
            tests: (r) => ['1 1', '3000 1', '3000 3000', '2999 3000', '12 4', '12 5', `${r.int(100, 3000)} ${r.int(2, 40)}`, `${r.int(1, 3000)} ${r.int(1, 3000)}`],
            check: (inp) => { const t = nums(inp); return t.length === 2 && calk(t[0], 1, 3000) && calk(t[1], 1, 3000) ? null : 'dane'; },
            solve: (inp) => { const [n, k] = nums(inp); const w = []; for (let x = n; x > 0; x -= k) w.push(x); w.push('Start!'); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void odliczaj(int n, int k) {
    if (n <= 0) {
        cout << "Start!\n";
        return;
    }
    cout << n << "\n";
    odliczaj(n - k, k);
}
int main() {
    int n, k;
    cin >> n >> k;
    odliczaj(n, k);
    return 0;
}`,
        },
        {
            id: 'rk-polowki', krok: 1, level: 'latwe',
            title: 'Pół na pół',
            short: 'Dziel liczbę przez 2 (bez reszty), aż dojdziesz do 1: 100 50 25 12 6 3 1. Krok rekurencji to n / 2, a liczby sięgają 10¹⁸.',
            tags: ['warunek stopu', 'krok: n / 2', 'long long'],
            statement: ['Bajtek ma tabliczkę czekolady o masie n gramów. Dzieli ją na pół, połowę zjada, a resztę znowu dzieli na pół… Przy dzieleniu okruszki odpadają, czyli dzieli całkowicie (tak jak / w C++). Kończy, gdy zostaje mu kawałek o masie 1.',
                'Wypisz masy kolejnych kawałków: n, n / 2, n / 4, …, 1. Napisz funkcję rekurencyjną void polowki(long long n), która wypisuje n i — jeśli to jeszcze nie 1 — wywołuje samą siebie dla n / 2. Bez pętli.'],
            input_format: ['W jedynym wierszu liczba całkowita n.'],
            output_format: ['W jednym wierszu kolejne masy od n do 1, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '100', note: '100 → 50 → 25 → 12 (okruszek odpada) → 6 → 3 → 1.' }],
            hint: R`void polowki(long long n) { cout << n; if (n == 1) return; cout << " "; polowki(n / 2); }. Stop przy n == 1 jest bezpieczny: dla n ≥ 2 wynik n / 2 to co najmniej 1, więc nie da się go przeskoczyć. Głębokość rekurencji to tylko około 60 — tyle razy da się podzielić 10¹⁸ przez 2. Wczytuj do long long.`,
            tests: () => ['1', '2', '3', E18, String(2n ** 59n), String(2n ** 59n - 1n), '999999999999999999', '777'],
            check: (inp) => { const t = toks(inp); return t.length === 1 && bigOk(t[0], '1', E18) ? null : 'dane'; },
            solve: (inp) => { let n = B(toks(inp)[0]); const w = []; for (;;) { w.push(n); if (n === 1n) break; n /= 2n; } return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void polowki(long long n) {
    cout << n;
    if (n == 1) return;
    cout << " ";
    polowki(n / 2);
}
int main() {
    long long n;
    cin >> n;
    polowki(n);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-podwajanie', krok: 1, level: 'latwe',
            title: 'Ziarenka na szachownicy',
            short: 'Na każdym polu dwa razy więcej ziarenek: 1, 2, 4, 8, … — wypisz wszystkie liczby nie większe niż n. Tym razem krok rekurencji to mnożenie przez 2.',
            tags: ['krok: x * 2', 'drugi parametr', 'long long'],
            statement: ['Legenda mówi, że wynalazca szachów poprosił króla o ziarenka ryżu: 1 na pierwszym polu szachownicy, 2 na drugim, 4 na trzecim — na każdym kolejnym dwa razy więcej. Król ma w spichlerzu worki po n ziarenek i chce wiedzieć, ile pól obsłuży jeden worek.',
                'Wypisz wszystkie liczby 1, 2, 4, 8, … nie większe niż n. Napisz funkcję rekurencyjną void ziarenka(long long x, long long n), która wypisuje x i wywołuje samą siebie dla 2 · x. Warunek stopu: x > n.'],
            input_format: ['W jedynym wierszu liczba całkowita n.'],
            output_format: ['W jednym wierszu wszystkie potęgi dwójki nie większe niż n, rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '20', note: '1, 2, 4, 8, 16 — następna byłaby 32 > 20.' }],
            hint: R`W main: ziarenka(1, n);. W funkcji najpierw stop: if (x > n) return;, potem cout << x << " "; i ziarenka(2 * x, n);. Krok to mnożenie, a nie odejmowanie — ważne tylko, żeby każdy krok zbliżał do stopu. Wszystko w long long: 2 · x dochodzi do 2 · 10¹⁸, a long long sięga około 9,2 · 10¹⁸.`,
            tests: () => ['1', '2', '3', '1023', '1024', E18, String(2n ** 59n), String(2n ** 59n - 1n)],
            check: (inp) => { const t = toks(inp); return t.length === 1 && bigOk(t[0], '1', E18) ? null : 'dane'; },
            solve: (inp) => { const n = B(toks(inp)[0]); const w = []; for (let x = 1n; x <= n; x *= 2n) w.push(x); return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void ziarenka(long long x, long long n) {
    if (x > n) return;
    cout << x << " ";
    ziarenka(2 * x, n);
}
int main() {
    long long n;
    cin >> n;
    ziarenka(1, n);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-winda', krok: 1, level: 'latwe',
            title: 'Winda',
            short: 'Winda jedzie z piętra a na piętro b i ogłasza każde mijane piętro. W górę albo w dół — funkcja sama wybiera kierunek kroku.',
            tags: ['dwa parametry', 'kierunek kroku', 'stop: a == b'],
            statement: ['Winda w wieżowcu ogłasza numer każdego piętra, które mija — także piętra, z którego rusza, i tego, na którym staje. Piętra mogą mieć numery ujemne (to parkingi pod ziemią).',
                'Wczytaj a i b i wypisz numery pięter, przez które przejedzie winda z piętra a na piętro b. Napisz funkcję rekurencyjną void jedz(int a, int b): wypisuje a, a jeśli to jeszcze nie b — wywołuje samą siebie dla piętra o jeden bliżej celu.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['W jednym wierszu numery kolejnych pięter od a do b, oddzielone spacjami.'],
            constraints: ['−1000 ≤ a, b ≤ 1000'],
            examples: [
                { input: '3 7' },
                { input: '2 -2', note: 'Winda jedzie w dół: 2, 1, 0, −1, −2.' },
            ],
            hint: R`void jedz(int a, int b) { cout << a; if (a == b) return; cout << " "; if (a < b) jedz(a + 1, b); else jedz(a - 1, b); }. Gdy a == b, winda stoi — wypisuje jedno piętro. Każdy krok zmniejsza odległość między a i b o 1, więc stop na pewno nastąpi.`,
            tests: (r) => ['0 0', '-1000 1000', '1000 -1000', '5 5', '7 6', `${r.int(-1000, 1000)} ${r.int(-1000, 1000)}`, `${r.int(-50, 0)} ${r.int(1, 60)}`],
            check: (inp) => { const t = nums(inp); return t.length === 2 && t.every((x) => calk(x, -1000, 1000)) ? null : 'dane'; },
            solve: (inp) => { const [a, b] = nums(inp); const w = []; const d = a <= b ? 1 : -1; for (let x = a; ; x += d) { w.push(x); if (x === b) break; } return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void jedz(int a, int b) {
    cout << a;
    if (a == b) return;
    cout << " ";
    if (a < b) jedz(a + 1, b);
    else jedz(a - 1, b);
}
int main() {
    int a, b;
    cin >> a >> b;
    jedz(a, b);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-echo', krok: 1, level: 'latwe',
            title: 'Echo w górach',
            short: 'Krzyczysz HALO, a echo odpowiada coraz krócej: HALO, HAL, HA, H. Parametr k mówi, ile liter jeszcze słychać.',
            tags: ['parametr: długość', 'substr', 'stop: k == 0'],
            statement: ['W górach Bajtek krzyczy słowo s. Echo powtarza je kilka razy, ale za każdym razem cichnie i gubi ostatnią literę: najpierw słychać całe słowo, potem bez ostatniej litery, potem bez dwóch ostatnich… aż zostaje sama pierwsza litera.',
                'Wypisz wszystkie powtórzenia echa, każde w osobnym wierszu. Napisz funkcję rekurencyjną void echo(string s, int k), która wypisuje pierwsze k liter słowa i wywołuje samą siebie dla k − 1.'],
            input_format: ['W jedynym wierszu słowo s złożone z wielkich liter.'],
            output_format: ['|s| wierszy: pierwsze |s| liter, pierwsze |s| − 1 liter, …, pierwsza litera.'],
            constraints: ['1 ≤ |s| ≤ 100'],
            examples: [{ input: 'HALO' }],
            hint: R`void echo(string s, int k) { if (k == 0) return; cout << s.substr(0, k) << "\n"; echo(s, k - 1); }, a w main: echo(s, s.size());. Słowo jest krótkie, więc kopiowanie go przy każdym wywołaniu niczemu tu nie szkodzi — w części 4 zobaczysz, kiedy zaczyna szkodzić.`,
            tests: (r) => ['A', 'AB', 'ECHO', r.word(7, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), r.word(30, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), r.word(100, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')],
            check: (inp) => (/^[A-Z]{1,100}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const s = inp.trim(); const w = []; for (let k = s.length; k > 0; k--) w.push(s.slice(0, k)); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void echo(string s, int k) {
    if (k == 0) return;
    cout << s.substr(0, k) << "\n";
    echo(s, k - 1);
}
int main() {
    string s;
    cin >> s;
    echo(s, s.size());
    return 0;
}`,
        },
        {
            id: 'rk-plotek', krok: 1, level: 'latwe',
            title: 'Płotek z dwóch znaków',
            short: 'Narysuj n znaków na zmianę: a, b, a, b, … Sztuczka: w wywołaniu rekurencyjnym zamień parametry miejscami.',
            tags: ['zamiana parametrów', 'char', 'stop: n == 0'],
            statement: ['Bajtek rysuje w zeszycie płotek: sztacheta, przerwa, sztacheta, przerwa… Zamiast sztachet i przerw może użyć dowolnych dwóch znaków.',
                'Wczytaj n oraz dwa znaki a i b i wypisz n znaków na zmianę: a, b, a, b, … (zaczynając od a). Napisz funkcję rekurencyjną void plotek(int n, char a, char b), która wypisuje a i wywołuje samą siebie dla n − 1 — z zamienionymi znakami.'],
            input_format: ['W jedynym wierszu liczba n i dwa znaki a oraz b, oddzielone spacjami.'],
            output_format: ['W jednym wierszu n znaków bez spacji.'],
            constraints: ['1 ≤ n ≤ 10 000', 'a i b to widoczne znaki ASCII (litery, cyfry albo znaki takie jak | - # * + o).'],
            examples: [{ input: '7 | -', note: 'W każdym wywołaniu znaki zamieniają się miejscami, więc kolejne wywołania wypisują |, -, |, -, …' }],
            hint: R`void plotek(int n, char a, char b) { if (n == 0) return; cout << a; plotek(n - 1, b, a); }. Najważniejsze jest plotek(n - 1, b, a) — w następnym wywołaniu „pierwszym” znakiem jest b. Znaki wczytaj zwykłym cin >> a >> b; (cin pomija spacje).`,
            tests: (r) => {
                const Z = '#*|-ox+.=@ab01';
                return ['1 a b', '2 x x', `9 ${r.pick(Z)} ${r.pick(Z)}`, `${r.int(20, 80)} ${r.pick(Z)} ${r.pick(Z)}`, '10000 # .', `${r.int(1000, 9999)} ${r.pick(Z)} ${r.pick(Z)}`];
            },
            check: (inp) => { const t = toks(inp); return t.length === 3 && calk(Number(t[0]), 1, 10000) && t[1].length === 1 && t[2].length === 1 ? null : 'dane'; },
            solve: (inp) => { const [n, a, b] = toks(inp); let s = ''; for (let i = 0; i < Number(n); i++) s += i % 2 ? b : a; return s; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void plotek(int n, char a, char b) {
    if (n == 0) return;
    cout << a;
    plotek(n - 1, b, a);
}
int main() {
    int n;
    char a, b;
    cin >> n >> a >> b;
    plotek(n, a, b);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-tabliczka', krok: 1, level: 'latwe',
            title: 'Tabliczka mnożenia',
            short: 'Wypisz k x 1, k x 2, …, k x n — licznik pętli zamienia się w parametr funkcji, który rośnie z wywołania na wywołanie.',
            tags: ['licznik w parametrze', 'rekurencja zamiast for', 'long long'],
            statement: ['Mała Ola uczy się tabliczki mnożenia. Poprosiła Cię o ściągę dla liczby k: wiersze k x 1 = …, k x 2 = …, aż do k x n.',
                'Napisz funkcję rekurencyjną void tabliczka(int i, int n, long long k), która wypisuje wiersz dla i i wywołuje samą siebie dla i + 1. Zatrzymaj się po wierszu dla n. Bez pętli.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite k i n.'],
            output_format: ['n wierszy w formacie k x i = wynik, dla i = 1, 2, …, n.'],
            constraints: ['1 ≤ k ≤ 10⁹', '1 ≤ n ≤ 500'],
            examples: [{ input: '7 4' }],
            hint: R`void tabliczka(int i, int n, long long k) { if (i > n) return; cout << k << " x " << i << " = " << k * i << "\n"; tabliczka(i + 1, n, k); }, a w main tabliczka(1, n, k);. Porównaj z pętlą for (int i = 1; i <= n; i++): start (1) to argument pierwszego wywołania, odwrócony warunek (i > n) to warunek stopu, a i++ to argument i + 1. Iloczyn sięga 5 · 10¹¹ — long long.`,
            tests: (r) => ['1 1', '1000000000 500', '13 10', `${r.int(2, 99)} ${r.int(20, 100)}`, `${r.int(100000000, 1000000000)} ${r.int(300, 500)}`],
            check: (inp) => { const t = nums(inp); return t.length === 2 && calk(t[0], 1, 1e9) && calk(t[1], 1, 500) ? null : 'dane'; },
            solve: (inp) => { const [k, n] = nums(inp); const w = []; for (let i = 1; i <= n; i++) w.push(`${k} x ${i} = ${B(k) * B(i)}`); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void tabliczka(int i, int n, long long k) {
    if (i > n) return;
    cout << k << " x " << i << " = " << k * i << "\n";
    tabliczka(i + 1, n, k);
}
int main() {
    long long k;
    int n;
    cin >> k >> n;
    tabliczka(1, n, k);
    return 0;
}`,
        },
        {
            id: 'rk-skarbonka', krok: 1, level: 'latwe',
            title: 'Skarbonka',
            short: 'Wrzucasz monety, aż pojawi się 0. Po każdej monecie wypisz stan skarbonki. Suma płynie w parametrze, a monety wczytuje sama rekurencja.',
            tags: ['cin w rekurencji', 'suma w parametrze', 'stop na zerze'],
            statement: ['Bajtek wrzuca do skarbonki monety. Licznik na skarbonce po każdej monecie pokazuje, ile pieniędzy jest w środku. Moneta o wartości 0 oznacza koniec wrzucania.',
                'Napisz funkcję rekurencyjną void skarbonka(long long suma), która wczytuje jedną monetę: jeśli to 0 — kończy; inaczej wypisuje nowy stan skarbonki i wywołuje samą siebie z nową sumą. W main wystarczy skarbonka(0);.'],
            input_format: ['Ciąg liczb całkowitych dodatnich zakończony zerem (liczby mogą stać w kilku wierszach).'],
            output_format: ['Po jednym wierszu na każdą monetę (bez kończącego zera): stan skarbonki zaraz po jej wrzuceniu.'],
            constraints: ['W ciągu jest od 1 do 2000 monet (nie licząc zera).', 'Każda moneta ma wartość od 1 do 500.'],
            examples: [{ input: '5 2 1\n5 0', note: 'Stan skarbonki: 5, potem 5 + 2 = 7, 8 i 13. Zero kończy wrzucanie.' }],
            hint: R`void skarbonka(long long suma) { int x; cin >> x; if (x == 0) return; suma += x; cout << suma << "\n"; skarbonka(suma); }. Każde wywołanie ma własną zmienną x i własną sumę — to, co trzeba pamiętać dalej, przekazujesz następnemu wywołaniu jako argument.`,
            tests: (r) => {
                const d = (a) => P.rozrzuc(r, [...a, 0]);
                return ['7 0', d(r.arr(10, 1, 9)), d(r.arr(2000, 1, 500)), '500\n0', d(r.arr(300, 1, 500))];
            },
            check: (inp) => { const t = nums(inp); const n = t.length - 1; return n >= 1 && n <= 2000 && t[n] === 0 && t.slice(0, n).every((x) => calk(x, 1, 500)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); let s = 0; const w = []; for (const x of t) { if (x === 0) break; s += x; w.push(s); } return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void skarbonka(long long suma) {
    int x;
    cin >> x;
    if (x == 0) return;
    suma += x;
    cout << suma << "\n";
    skarbonka(suma);
}
int main() {
    skarbonka(0);
    return 0;
}`,
        },

        // ================================================================ KROK 2 · przed wywołaniem i po nim
        {
            id: 'rk-matrioszki', krok: 2, level: 'latwe',
            title: 'Matrioszki',
            short: 'Otwierasz matrioszki od największej do najmniejszej, a potem składasz je w odwrotnej kolejności. Jedna funkcja: cout przed wywołaniem i cout po nim.',
            tags: ['kod przed wywołaniem', 'kod po wywołaniu', 'kolejność powrotów'],
            statement: ['W pudełku stoi n matrioszek, jedna w drugiej: największa ma numer n, najmniejsza — 1. Bajtek otwiera je po kolei od największej. Najmniejsza lalka się nie otwiera — gdy do niej dojdzie, składa wszystkie z powrotem.',
                'Wypisz, co robi Bajtek. Napisz jedną funkcję rekurencyjną void lalka(int k): dla k = 1 wypisuje najmniejsza; dla większego k najpierw wypisuje otwieram k, potem wywołuje lalka(k − 1), a na końcu wypisuje zamykam k.'],
            input_format: ['W jedynym wierszu n.'],
            output_format: ['2n − 1 wierszy: otwieram n, …, otwieram 2, najmniejsza, zamykam 2, …, zamykam n.'],
            constraints: ['1 ≤ n ≤ 500'],
            examples: [{ input: '3', note: 'zamykam 2 wypisuje się przed zamykam 3, bo wywołanie dla 2 kończy się wcześniej niż wywołanie dla 3, które na nie czekało.' }],
            hint: R`void lalka(int k) { if (k == 1) { cout << "najmniejsza\n"; return; } cout << "otwieram " << k << "\n"; lalka(k - 1); cout << "zamykam " << k << "\n"; }. Linijka po wywołaniu wykonuje się dopiero wtedy, gdy wszystkie mniejsze lalki są już zamknięte.`,
            tests: (r) => ['1', '2', String(r.int(5, 20)), '500', String(r.int(100, 499))],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 500) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const w = []; for (let k = n; k >= 2; k--) w.push(`otwieram ${k}`); w.push('najmniejsza'); for (let k = 2; k <= n; k++) w.push(`zamykam ${k}`); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void lalka(int k) {
    if (k == 1) {
        cout << "najmniejsza\n";
        return;
    }
    cout << "otwieram " << k << "\n";
    lalka(k - 1);
    cout << "zamykam " << k << "\n";
}
int main() {
    int n;
    cin >> n;
    lalka(n);
    return 0;
}`,
        },
        {
            id: 'rk-wspak-do-zera', krok: 2, level: 'latwe',
            title: 'Od końca, bez tablicy',
            short: 'Liczby aż do zera wypisz od ostatniej do pierwszej — bez tablicy i bez vectora. Każde wywołanie pamięta swoją liczbę i wypisuje ją w drodze powrotnej.',
            tags: ['cin w rekurencji', 'cout po wywołaniu', 'stos zamiast tablicy'],
            statement: ['Kasjerka nabija na szpikulec kolejne paragony, a wieczorem zdejmuje je od góry — czyli od ostatniego. Wczytuj liczby, aż trafisz na 0, i wypisz je w odwrotnej kolejności (bez zera).',
                'Nie używaj tablicy ani vectora. Napisz funkcję rekurencyjną void wspak(), która wczytuje jedną liczbę i — jeśli to nie zero — najpierw wywołuje samą siebie, a dopiero potem wypisuje swoją liczbę.'],
            input_format: ['Ciąg liczb całkowitych różnych od zera, zakończony zerem (w jednym albo kilku wierszach).'],
            output_format: ['W jednym wierszu wczytane liczby (bez zera) w odwrotnej kolejności, oddzielone spacjami.'],
            constraints: ['Liczb (bez zera) jest od 1 do 3000.', 'Każda z nich ma wartość bezwzględną od 1 do 999.'],
            examples: [{ input: '3 -8 12\n5 0', note: 'Ostatnia wczytana liczba (5) wypisuje się pierwsza, bo jej wywołanie kończy się najwcześniej.' }],
            hint: R`void wspak() { int x; cin >> x; if (x == 0) return; wspak(); cout << x << " "; }. Każde wywołanie ma własne x i czeka, aż skończą się wszystkie późniejsze — dlatego liczby wypisują się od ostatniej. Stos wywołań działa tu jak tablica, której nie musiałeś deklarować.`,
            tests: (r) => {
                const los = (n) => Array.from({ length: n }, () => r.int(1, 999) * (r() < 0.3 ? -1 : 1));
                const d = (a) => P.rozrzuc(r, [...a, 0]);
                return ['42 0', d(los(8)), d(los(3000)), d(los(500)), '-1 -2 -3 0'];
            },
            check: (inp) => { const t = nums(inp); const n = t.length - 1; return n >= 1 && n <= 3000 && t[n] === 0 && t.slice(0, n).every((x) => x !== 0 && calk(Math.abs(x), 1, 999)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); return t.slice(0, t.indexOf(0)).reverse().join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wspak() {
    int x;
    cin >> x;
    if (x == 0) return;
    wspak();
    cout << x << " ";
}
int main() {
    wspak();
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-lustro', krok: 2, level: 'latwe',
            title: 'Lustro',
            short: 'Słowo razem z odbiciem: kot → kottok. Jedna funkcja z indeksem: wypisuje literę przed wywołaniem i tę samą literę po nim.',
            tags: ['indeks w parametrze', 'przed i po wywołaniu', 'const string &'],
            statement: ['Bajtek przykłada lusterko do końca słowa i widzi słowo razem z jego odbiciem: z kot robi się kottok.',
                'Wypisz słowo s, a zaraz za nim (bez spacji) to samo słowo czytane od tyłu. Napisz funkcję rekurencyjną void lustro(const string &s, int i), która wypisuje s[i] przed wywołaniem lustro(s, i + 1) i jeszcze raz po nim.'],
            input_format: ['W jedynym wierszu słowo s z małych liter.'],
            output_format: ['W jedynym wierszu napis o długości 2 · |s|.'],
            constraints: ['1 ≤ |s| ≤ 10 000'],
            examples: [{ input: 'kot' }],
            hint: R`void lustro(const string &s, int i) { if (i == (int)s.size()) return; cout << s[i]; lustro(s, i + 1); cout << s[i]; }, a w main lustro(s, 0);. Zapis const string &s sprawia, że wszystkie wywołania pracują na tym samym napisie — bez kopiowania 10 000 liter na każdym z 10 000 poziomów.`,
            tests: (r) => ['a', 'ab', 'kajak', r.word(50), r.word(10000), r.word(3333, 'ab')],
            check: (inp) => (/^[a-z]{1,10000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const s = inp.trim(); return s + s.split('').reverse().join(''); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void lustro(const string &s, int i) {
    if (i == (int)s.size()) return;
    cout << s[i];
    lustro(s, i + 1);
    cout << s[i];
}
int main() {
    string s;
    cin >> s;
    lustro(s, 0);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-cyfry-slownie', krok: 2, level: 'latwe',
            title: 'Cyfry słownie',
            short: '4821 → cztery osiem dwa jeden. Operacja % 10 daje cyfry od końca, więc słowo ostatniej cyfry wypisuj dopiero po wywołaniu dla n / 10.',
            tags: ['cyfry od lewej', 'cout po wywołaniu', 'long long'],
            statement: ['Automat w banku odczytuje numery kont cyfra po cyfrze. Dla każdej z t liczb wypisz jej cyfry słownie, od pierwszej do ostatniej. Słowa (bez polskich znaków): zero, jeden, dwa, trzy, cztery, piec, szesc, siedem, osiem, dziewiec.',
                'Napisz funkcję rekurencyjną void slownie(long long n): dla liczby jednocyfrowej wypisuje jej słowo, a dla większej — najpierw wywołuje slownie(n / 10), a potem dopisuje spację i słowo ostatniej cyfry.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy jedna liczba całkowita n.'],
            output_format: ['t wierszy: słowa cyfr kolejnych liczb, oddzielone pojedynczymi spacjami.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n4821\n0\n105', note: 'Dla 105 zero w środku nie znika, bo stop jest przy n < 10, a nie przy n == 0.' }],
            hint: R`Tablica słów: string S[10] = {"zero", "jeden", "dwa", "trzy", "cztery", "piec", "szesc", "siedem", "osiem", "dziewiec"};. W funkcji: if (n < 10) { cout << S[n]; return; } slownie(n / 10); cout << " " << S[n % 10];. Warunek stopu n < 10 sprawia, że liczba 0 też dostaje swoje słowo.`,
            tests: (r) => [listaT(['4821', '0', '105']), listaT(['1', '10', '1000000000000000000', '999999999999999999', '120']), listaT(losoweDuze(r, 100)), listaT(['7'])],
            check: (inp) => checkT(inp, 100, '0', E18),
            solve: (inp) => {
                const S = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'piec', 'szesc', 'siedem', 'osiem', 'dziewiec'];
                return toks(inp).slice(1).map((x) => x.split('').map((c) => S[Number(c)]).join(' ')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string S[10] = {"zero", "jeden", "dwa", "trzy", "cztery", "piec", "szesc", "siedem", "osiem", "dziewiec"};
void slownie(long long n) {
    if (n < 10) {
        cout << S[n];
        return;
    }
    slownie(n / 10);
    cout << " " << S[n % 10];
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        slownie(n);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-bloki', krok: 2, level: 'latwe',
            title: 'Zagnieżdżone bloki',
            short: 'Każdy poziom otwiera blok, a zamyka go dopiero po wszystkich głębszych poziomach. Wcięcie rośnie w drodze w dół, a klamry zamykają się w drodze powrotnej.',
            tags: ['przed i po wywołaniu', 'wcięcie w parametrze', 'dwie funkcje rekurencyjne'],
            statement: ['Programista zagnieżdża bloki kodu n razy, każdy w środku poprzedniego. Poziom k zajmuje dwa wiersze: wiersz otwierający poziom k { i — po wszystkich głębszych poziomach — wiersz zamykający }. Oba wiersze poziomu k są wcięte o 2 · (k − 1) spacji.',
                'Napisz funkcję rekurencyjną void blok(int k, int n): wypisuje wiersz otwierający, jeśli k < n — wywołuje blok(k + 1, n), a potem wypisuje wiersz zamykający. Spacje wcięcia też możesz wypisywać rekurencyjnie, osobną funkcją.'],
            input_format: ['W jedynym wierszu n.'],
            output_format: ['2n wierszy opisanych w treści (z wcięciami ze spacji).'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '3' }],
            hint: R`void spacje(int ile) { if (ile == 0) return; cout << ' '; spacje(ile - 1); }. W blok(k, n): spacje(2 * (k - 1)); cout << "poziom " << k << " {\n"; if (k < n) blok(k + 1, n); spacje(2 * (k - 1)); cout << "}\n";. Klamra poziomu 1 zamyka się na samym końcu, bo wywołanie dla poziomu 1 czeka na wszystkie głębsze.`,
            tests: (r) => ['1', '2', String(r.int(5, 12)), '50', String(r.int(20, 49))],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 50) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const w = []; for (let k = 1; k <= n; k++) w.push(`${' '.repeat(2 * (k - 1))}poziom ${k} {`); for (let k = n; k >= 1; k--) w.push(`${' '.repeat(2 * (k - 1))}}`); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void spacje(int ile) {
    if (ile == 0) return;
    cout << ' ';
    spacje(ile - 1);
}
void blok(int k, int n) {
    spacje(2 * (k - 1));
    cout << "poziom " << k << " {\n";
    if (k < n) blok(k + 1, n);
    spacje(2 * (k - 1));
    cout << "}\n";
}
int main() {
    int n;
    cin >> n;
    blok(1, n);
    return 0;
}`,
        },
        {
            id: 'rk-tysiace', krok: 2, level: 'srednie',
            title: 'Separatory tysięcy',
            short: '1234567 → 1 234 567. Grupy po trzy cyfry liczy się od prawej, a wypisuje od lewej: najpierw rekurencja dla n / 1000, potem ostatnia grupa — z zerami z przodu.',
            tags: ['cout po wywołaniu', 'n / 1000 i n % 1000', 'zera w środku grupy'],
            statement: ['Duże kwoty łatwiej przeczytać, gdy cyfry są pogrupowane po trzy od prawej strony: 1234567 to 1 234 567, a 1000 to 1 000. Dla każdej z t liczb wypisz ją z pojedynczą spacją między grupami.',
                'Napisz funkcję rekurencyjną void grupy(long long n): jeśli n < 1000, wypisuje n; inaczej najpierw wywołuje grupy(n / 1000), a potem wypisuje spację i ostatnią grupę — zawsze trzycyfrową.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy z liczbami pogrupowanymi po trzy cyfry.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n1234567\n1000\n5\n1002003', note: 'W 1 002 003 środkowe grupy mają zera z przodu — bez nich wyszłoby 1 2 3.' }],
            hint: R`Ostatnia grupa to r = n % 1000. Wypisz ją na trzech pozycjach: if (r < 100) cout << 0; if (r < 10) cout << 0; cout << r; (albo setw(3) i setfill('0')). Pierwsza grupa (n < 1000) jest bez zer z przodu. Całość: if (n < 1000) { cout << n; return; } grupy(n / 1000); cout << " "; … ostatnia grupa ….`,
            tests: (r) => [listaT(['1234567', '1000', '5', '1002003']), listaT(['0', '999', '1000000', '1000000000000000000', '100010001', '12345678901234567']), listaT(losoweDuze(r, 100))],
            check: (inp) => checkT(inp, 100, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => { const s = String(B(x)); const w = []; for (let e = s.length; e > 0; e -= 3) w.unshift(s.slice(Math.max(0, e - 3), e)); return w.join(' '); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void grupy(long long n) {
    if (n < 1000) {
        cout << n;
        return;
    }
    grupy(n / 1000);
    long long r = n % 1000;
    cout << " ";
    if (r < 100) cout << 0;
    if (r < 10) cout << 0;
    cout << r;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        grupy(n);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-parzyste-nieparzyste', krok: 2, level: 'srednie',
            title: 'Nieparzyste tam, parzyste z powrotem',
            short: 'Jedna rekurencja po cyfrach od prawej: cyfry nieparzyste wypisuj przed wywołaniem (wyjdą od końca), a parzyste — po nim (wyjdą od początku).',
            tags: ['przed i po wywołaniu', 'cyfry liczby', 'dwie kolejności naraz'],
            statement: ['Bajtek ma zabawny sposób czytania liczb. Najpierw czyta od końca wszystkie cyfry nieparzyste, a potem od początku wszystkie parzyste. Na przykład dla 12345 najpierw przeczyta 5, 3, 1, a potem 2, 4.',
                'Dla każdej z t liczb wypisz cyfry w kolejności Bajtka, bez spacji. Zrób to jedną funkcją rekurencyjną, która schodzi po cyfrach od prawej (ostatnia cyfra to n % 10, a reszta to n / 10): cyfrę nieparzystą wypisuje przed wywołaniem dla n / 10, a parzystą — po nim.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — cyfry kolejnych liczb w kolejności Bajtka.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n12345\n2468\n9001', note: 'Dla 9001: nieparzyste od końca to 1, 9, a parzyste od początku to 0, 0 — razem 1900.' }],
            hint: R`void czytaj(long long n) { if (n == 0) return; int c = n % 10; if (c % 2 == 1) cout << c; czytaj(n / 10); if (c % 2 == 0) cout << c; }. Wypisywanie przed wywołaniem idzie w kolejności schodzenia, czyli od ostatniej cyfry. Wypisywanie po wywołaniu — w kolejności powrotów, czyli od pierwszej cyfry.`,
            tests: (r) => [listaT(['12345', '2468', '9001']), listaT(['1', '2', '10', '1000000000000000000', '135797531', '86420']), listaT(losoweDuze(r, 100, '1'))],
            check: (inp) => checkT(inp, 100, '1', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => { const c = String(B(x)).split('').map(Number); return c.filter((d) => d % 2).reverse().join('') + c.filter((d) => d % 2 === 0).join(''); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void czytaj(long long n) {
    if (n == 0) return;
    int c = n % 10;
    if (c % 2 == 1) cout << c;
    czytaj(n / 10);
    if (c % 2 == 0) cout << c;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        czytaj(n);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-czynniki-malejaco', krok: 2, level: 'srednie',
            title: 'Czynniki od największego',
            short: 'Rozkład na czynniki pierwsze od największego: 360 = 5 * 3 * 3 * 2 * 2 * 2. Najmniejszy dzielnik znajdziesz od razu, ale wypiszesz go dopiero w drodze powrotnej.',
            tags: ['cout po wywołaniu', 'czynniki pierwsze', 'separator między wynikami'],
            statement: ['Rozkład liczby na czynniki pierwsze zwykle zapisuje się od najmniejszego czynnika. Bajtek chce go mieć od największego. Dla każdej z t liczb wypisz rozkład w formacie n = p1 * p2 * … * pk, gdzie p1 ≥ p2 ≥ … ≥ pk.',
                'Napisz funkcję rekurencyjną void rozklad(long long n, long long d), która szuka najmniejszego dzielnika p ≥ d liczby n (zwykłą pętlą), wywołuje rozklad(n / p, p), a dopiero potem wypisuje p. Najmniejsze czynniki wypiszą się wtedy na końcu.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy w formacie n = p1 * p2 * … * pk (czynniki od największego, oddzielone spacją, gwiazdką i spacją).'],
            constraints: ['1 ≤ t ≤ 20', '2 ≤ n ≤ 10¹²'],
            examples: [{ input: '3\n360\n13\n1001', note: 'Liczba pierwsza (13) to rozkład z jednego czynnika.' }],
            hint: R`W rozklad(n, d): if (n == 1) return; long long p = d; while (p * p <= n && n % p != 0) p++; if (p * p > n) p = n; rozklad(n / p, p); if (n / p > 1) cout << " * "; cout << p;. Separator: wywołanie, w którym n / p == 1, wypisuje się jako pierwsze (to największy czynnik) — przed nim nie ma gwiazdki. W main: cout << n << " = "; rozklad(n, 2);.`,
            tests: (r) => {
                const duze = () => String(r.int(2, 1000000) * r.int(1, 1000000));
                return [listaT(['360', '13', '1001']), listaT(['2', '1024', '1000000000000', '999999999989', '999966000289', '600851475143', '97', '4']), listaT(Array.from({ length: 20 }, duze))];
            },
            check: (inp) => checkT(inp, 20, '2', '1000000000000'),
            solve: (inp) => toks(inp).slice(1).map((x) => {
                let n = Number(x); const f = [];
                for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; }
                if (n > 1) f.push(n);
                return `${x} = ${f.reverse().join(' * ')}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void rozklad(long long n, long long d) {
    if (n == 1) return;
    long long p = d;
    while (p * p <= n && n % p != 0) p++;
    if (p * p > n) p = n;
    rozklad(n / p, p);
    if (n / p > 1) cout << " * ";
    cout << p;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << n << " = ";
        rozklad(n, 2);
        cout << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 3 · rekurencja oddaje wynik
        {
            id: 'rk-piramida-pomaranczy', krok: 3, level: 'latwe',
            title: 'Piramida z pomarańczy',
            short: 'Na dole kwadrat n × n pomarańczy, wyżej (n − 1) × (n − 1)… aż do jednej na szczycie. Ile wszystkich? piramida(n) = n² + piramida(n − 1).',
            tags: ['return', 'zaufaj rekurencji', 'long long'],
            statement: ['Sprzedawca układa pomarańcze w piramidę: na dole kwadrat n × n, na nim kwadrat (n − 1) × (n − 1), i tak dalej, aż na samej górze leży jedna pomarańcza.',
                'Dla każdej z t wysokości n policz, ile pomarańczy ma piramida. Napisz funkcję rekurencyjną long long piramida(long long n): piramida o wysokości 0 nie ma żadnej pomarańczy, a piramida o wysokości n to dolna warstwa (n · n) plus piramida o wysokości n − 1.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy jedna liczba n.'],
            output_format: ['t wierszy — liczby pomarańczy w kolejnych piramidach.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 100 000'],
            examples: [{ input: '3\n1\n3\n10', note: 'Piramida o wysokości 3: 9 + 4 + 1 = 14.' }],
            hint: R`long long piramida(long long n) { if (n == 0) return 0; return n * n + piramida(n - 1); }. Parametr też jest long long: przy int iloczyn n * n dla n = 100 000 to 10¹⁰ — przepełnienie, zanim wynik trafi do long long. Głębokość rekurencji to n, czyli nawet 100 000 — sprawdzarka ma stos 8 MB, więc to bezpieczne.`,
            tests: (r) => [listaT(['1', '3', '10']), listaT(['100000', '99999', '46341', '2', '65536']), listaT(Array.from({ length: 10 }, () => String(r.int(1, 100000)))), listaT(Array.from({ length: 10 }, () => '100000'))],
            check: (inp) => checkT(inp, 10, '1', '100000'),
            solve: (inp) => toks(inp).slice(1).map((x) => { const n = B(x); return String(n * (n + 1n) * (2n * n + 1n) / 6n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long piramida(long long n) {
    if (n == 0) return 0;
    return n * n + piramida(n - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << piramida(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-iloczyn-cyfr', krok: 3, level: 'latwe',
            title: 'Iloczyn cyfr',
            short: 'Pomnóż cyfry liczby: 2345 → 120. Ostatnia cyfra razy iloczyn cyfr reszty, a liczba jednocyfrowa to po prostu ona sama.',
            tags: ['return', 'n % 10 i n / 10', 'stop: n < 10'],
            statement: ['Dla każdej z t liczb policz iloczyn jej cyfr. Na przykład dla 2345 to 2 · 3 · 4 · 5 = 120, a dla 105 — 0.',
                'Napisz funkcję rekurencyjną long long iloczyn(long long n): dla liczby jednocyfrowej iloczyn cyfr to ona sama, a dla większej — ostatnia cyfra razy iloczyn cyfr liczby n / 10.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — iloczyny cyfr kolejnych liczb.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n2345\n105\n7\n0', note: 'Dla 0 wynikiem jest 0 — liczba ma jedną cyfrę i jest nią zero.' }],
            hint: R`long long iloczyn(long long n) { if (n < 10) return n; return (n % 10) * iloczyn(n / 10); }. Uwaga na stop: gdyby funkcja kończyła się przy n == 0 wynikiem 1 (bo „pusty iloczyn” to 1), liczba 0 dałaby 1 zamiast 0. Największy możliwy wynik to 9¹⁸ ≈ 1,5 · 10¹⁷ — mieści się w long long.`,
            tests: (r) => [listaT(['2345', '105', '7', '0']), listaT(['999999999999999999', '1000000000000000000', '111111111111111111', '987654321', '29']), listaT(losoweDuze(r, 100))],
            check: (inp) => checkT(inp, 100, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => String(x.split('').reduce((a, c) => a * B(c), 1n))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long iloczyn(long long n) {
    if (n < 10) return n;
    return (n % 10) * iloczyn(n / 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << iloczyn(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-skrajne-cyfry', krok: 3, level: 'latwe',
            title: 'Najmniejsza i największa cyfra',
            short: 'Dwie małe funkcje rekurencyjne: najmniejsza cyfra to min(ostatnia cyfra, najmniejsza cyfra reszty) — i tak samo z największą.',
            tags: ['dwie funkcje rekurencyjne', 'min i max', 'zaufaj rekurencji'],
            statement: ['Dla każdej z t liczb wypisz jej najmniejszą i największą cyfrę.',
                'Napisz dwie funkcje rekurencyjne: int najmniejsza(long long n) i int najwieksza(long long n). Każda porównuje ostatnią cyfrę z wynikiem dla n / 10, a dla liczby jednocyfrowej oddaje ją samą.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy: najmniejsza i największa cyfra liczby, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n4821\n7\n900' }],
            hint: R`int najmniejsza(long long n) { if (n < 10) return n; return min((int)(n % 10), najmniejsza(n / 10)); }. Rzutowanie (int) jest potrzebne, bo min chce dwóch argumentów tego samego typu, a n % 10 to long long. Funkcja najwieksza wygląda tak samo, tylko z max.`,
            tests: (r) => [listaT(['4821', '7', '900']), listaT(['0', '1000000000000000000', '123456789', '555555', '90']), listaT(losoweDuze(r, 100))],
            check: (inp) => checkT(inp, 100, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => { const c = x.split('').map(Number); return `${Math.min(...c)} ${Math.max(...c)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int najmniejsza(long long n) {
    if (n < 10) return n;
    return min((int)(n % 10), najmniejsza(n / 10));
}
int najwieksza(long long n) {
    if (n < 10) return n;
    return max((int)(n % 10), najwieksza(n / 10));
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << najmniejsza(n) << " " << najwieksza(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-szczesliwa-cyfra', krok: 3, level: 'latwe',
            title: 'Szczęśliwa cyfra',
            short: 'Ile liczb zawiera Twoją szczęśliwą cyfrę? Funkcja bool zawiera(x, d): ostatnia cyfra to d albo d siedzi gdzieś w x / 10.',
            tags: ['funkcja bool', '||', 'stop: x < 10'],
            statement: ['Kasia uważa, że liczba przynosi szczęście, jeśli w jej zapisie pojawia się cyfra d. Wczytaj d i n liczb i policz, ile z nich przynosi szczęście.',
                'Napisz funkcję rekurencyjną bool zawiera(long long x, int d), a w main — zwykłą pętlę, która wywołuje ją dla każdej wczytanej liczby.'],
            input_format: ['W pierwszym wierszu cyfra d i liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — ile wczytanych liczb zawiera cyfrę d.'],
            constraints: ['0 ≤ d ≤ 9', '1 ≤ n ≤ 10 000', 'Każda liczba jest od 0 do 10¹⁸.'],
            examples: [
                { input: '7 6\n17 70 123 777 0 8', note: 'Siódemkę mają 17, 70 i 777.' },
                { input: '0 4\n100 0 9 25', note: 'Zero ma 100 i samo 0.' },
            ],
            hint: R`bool zawiera(long long x, int d) { if (x < 10) return x == d; return x % 10 == d || zawiera(x / 10, d); }. Stop przy x < 10 sprawia, że liczba 0 „zawiera” cyfrę 0. Operator || nie liczy prawej strony, gdy lewa jest prawdziwa — rekurencja kończy się wtedy od razu.`,
            tests: (r) => {
                const d = (c, a) => `${c} ${a.length}\n${a.join(' ')}`;
                return [d(7, ['17', '70', '123', '777', '0', '8']), d(0, ['100', '0', '9', '25']), d(r.int(0, 9), losoweDuze(r, 5000)),
                    d(9, Array.from({ length: 2000 }, () => String(r.int(0, 1000)))), d(1, [E18]), d(5, ['4'])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[1]); return calk(Number(t[0]), 0, 9) && calk(n, 1, 10000) && t.length === n + 2 && t.slice(2).every((x) => bigOk(x, '0', E18)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp); return String(t.slice(2).filter((x) => x.includes(t[0])).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool zawiera(long long x, int d) {
    if (x < 10) return x == d;
    return x % 10 == d || zawiera(x / 10, d);
}
int main() {
    int d, n;
    cin >> d >> n;
    int ile = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (zawiera(x, d)) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-do-jedynki', krok: 3, level: 'latwe',
            title: 'Droga do jedynki',
            short: 'Parzystą liczbę dziel przez 2, od nieparzystej odejmij 1. Ile kroków do jedynki? kroki(n) = 1 + kroki(liczby po jednym kroku).',
            tags: ['return 1 + …', 'if w rekurencji', 'long long'],
            statement: ['Gra „Do jedynki”: jeśli liczba jest parzysta, dzielisz ją przez 2, a jeśli nieparzysta — odejmujesz od niej 1. Powtarzasz to, aż dojdziesz do 1. Na przykład 10 → 5 → 4 → 2 → 1 to 4 kroki.',
                'Dla każdej z t liczb policz liczbę kroków. Napisz funkcję rekurencyjną int kroki(long long n): z jedynki nie trzeba robić żadnego kroku, a z innej liczby — jeden krok plus tyle kroków, ile trzeba z liczby, do której ten krok prowadzi.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — liczby kroków.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n10\n1\n7', note: '7 → 6 → 3 → 2 → 1, czyli 4 kroki.' }],
            hint: R`int kroki(long long n) { if (n == 1) return 0; if (n % 2 == 0) return 1 + kroki(n / 2); return 1 + kroki(n - 1); }. Nie musisz śledzić, co dzieje się głębiej — wystarczy zaufać, że kroki(n / 2) działa, i dodać jeden krok. Głębokość: najwyżej dwa wywołania na każde połowienie, czyli około 120 dla 10¹⁸.`,
            tests: (r) => [listaT(['10', '1', '7']), listaT(['2', '3', E18, String(2n ** 59n - 1n), String(2n ** 59n), '999999999999999999']), listaT(losoweDuze(r, 1000, '1'))],
            check: (inp) => checkT(inp, 1000, '1', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => { let n = B(x), k = 0; while (n !== 1n) { n = n % 2n === 0n ? n / 2n : n - 1n; k++; } return String(k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int kroki(long long n) {
    if (n == 1) return 0;
    if (n % 2 == 0) return 1 + kroki(n / 2);
    return 1 + kroki(n - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << kroki(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-bakterie', krok: 3, level: 'srednie',
            title: 'Bakterie i lekarstwo',
            short: 'Co godzinę bakterii jest k razy więcej, a zaraz potem lekarstwo zabija d z nich. Ile zostanie po n godzinach? Wynik dla h godzin buduj z wyniku dla h − 1.',
            tags: ['ciąg z przepisu', 'wynik wywołania w zmiennej', 'long long'],
            statement: ['W probówce jest a bakterii. Co godzinę każda bakteria dzieli się na k bakterii, a zaraz potem lekarstwo zabija d z nich. Jeśli bakterii jest wtedy d albo mniej, giną wszystkie — i probówka zostaje pusta już na zawsze.',
                'Dla każdego z t doświadczeń policz, ile bakterii będzie po n godzinach. Napisz funkcję rekurencyjną long long bakterie(int h, …): po 0 godzinach jest a bakterii, a po h godzinach — max(0, k · bakterie(h − 1) − d).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy cztery liczby całkowite a, k, d i n.'],
            output_format: ['t wierszy — liczby bakterii po n godzinach.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ a ≤ 10 000', '1 ≤ k ≤ 3', '0 ≤ d ≤ 10 000', '0 ≤ n ≤ 30'],
            examples: [{ input: '3\n10 2 5 3\n5 1 3 4\n7 1 0 30', note: 'Pierwsze: 10 → 15 → 25 → 45. Drugie: 5 → 2 → 0 → 0 → 0 (gdy bakterii nie ma, już nie odrastają).' }],
            hint: R`long long bakterie(int h, long long a, long long k, long long d) { if (h == 0) return a; long long przed = bakterie(h - 1, a, k, d); return max(0LL, k * przed - d); }. Wynik wywołania zapisz do zmiennej i dopiero potem licz. Gdybyś napisał bakterie(h - 1, …) dwa razy w jednym wzorze, każde wywołanie liczyłoby wszystko od nowa (o tym więcej w części 6). Największy wynik, 3³⁰ · 10⁴ ≈ 2 · 10¹⁸, mieści się w long long.`,
            tests: (r) => {
                const w = () => `${r.int(1, 10000)} ${r.int(1, 3)} ${r.int(0, 10000)} ${r.int(0, 30)}`;
                const zyje = () => { const k = r.int(2, 3), a = r.int(5000, 10000); return `${a} ${k} ${r.int(0, a - 1)} ${r.int(20, 30)}`; };
                return [`3\n10 2 5 3\n5 1 3 4\n7 1 0 30`, `4\n10000 3 0 30\n10000 3 10000 30\n1 1 0 0\n1 3 1 30`, `${100}\n${Array.from({ length: 100 }, () => (r() < 0.5 ? w() : zyje())).join('\n')}`];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 100) || t.length !== 4 * n + 1) return 'dane'; for (let i = 0; i < n; i++) { const [a, k, d, g] = t.slice(1 + 4 * i, 5 + 4 * i); if (!calk(a, 1, 10000) || !calk(k, 1, 3) || !calk(d, 0, 10000) || !calk(g, 0, 30)) return 'dane'; } return null; },
            solve: (inp) => { const t = nums(inp); const w = []; for (let i = 0; i < t[0]; i++) { const [a, k, d, g] = t.slice(1 + 4 * i, 5 + 4 * i); let x = B(a); for (let h = 0; h < g; h++) { x = B(k) * x - B(d); if (x < 0n) x = 0n; } w.push(String(x)); } return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long bakterie(int h, long long a, long long k, long long d) {
    if (h == 0) return a;
    long long przed = bakterie(h - 1, a, k, d);
    return max(0LL, k * przed - d);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, k, d;
        int n;
        cin >> a >> k >> d >> n;
        cout << bakterie(n, a, k, d) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-mnozenie-chlopskie', krok: 3, level: 'srednie',
            title: 'Mnożenie po rosyjsku',
            short: 'Dziel a przez 2, podwajaj b i dodawaj b tam, gdzie a jest nieparzyste. Funkcja wypisuje tabelkę w drodze w dół, a iloczyn oddaje w drodze powrotnej.',
            tags: ['cout i return naraz', 'a / 2 i 2 · b', 'long long'],
            statement: ['Dawniej na rosyjskich wsiach mnożono bez tabliczki mnożenia: w pierwszym wierszu zapisywano a i b, a w każdym kolejnym wierszu dzielono a przez 2 (odrzucając resztę) i podwajano b — aż a spadło do 0. Wiersze z nieparzystym a oznaczano znakiem + i sumowano ich b. Ta suma to a · b.',
                'Napisz funkcję rekurencyjną long long razy(long long a, long long b), która dla a = 0 oddaje 0, a w przeciwnym razie wypisuje wiersz tabelki (a, b i znak +, gdy a jest nieparzyste), wywołuje razy(a / 2, 2 · b) i do wyniku tego wywołania dodaje b, jeśli a jest nieparzyste. W main na koniec wypisz zwrócony iloczyn.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wiersze tabelki w formacie a b (z dopiskiem + po spacji, gdy a jest nieparzyste) — po jednym dla każdego a > 0 — a w ostatnim wierszu iloczyn a · b.'],
            constraints: ['0 ≤ a ≤ 10⁹', '0 ≤ b ≤ 10⁹'],
            examples: [{ input: '13 7', note: 'Wiersze z + mają b równe 7, 28 i 56, a 7 + 28 + 56 = 91 = 13 · 7.' }],
            hint: R`long long razy(long long a, long long b) { if (a == 0) return 0; cout << a << " " << b; if (a % 2 == 1) cout << " +"; cout << "\n"; long long w = razy(a / 2, 2 * b); if (a % 2 == 1) w += b; return w; }. Wiersze wypisują się w drodze w dół (przed wywołaniem), a suma zbiera się w drodze powrotnej (po wywołaniu).`,
            tests: (r) => ['13 7', '0 5', '5 0', '1 1', '1000000000 1000000000', `${r.int(1, 1000)} ${r.int(1, 1000)}`, `${r.int(100000000, 1000000000)} ${r.int(1, 1000000000)}`, String(2 ** 29) + ' 3'],
            check: (inp) => { const t = nums(inp); return t.length === 2 && t.every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const [a0, b0] = nums(inp); let a = B(a0), b = B(b0); const w = []; while (a > 0n) { w.push(`${a} ${b}${a % 2n ? ' +' : ''}`); a /= 2n; b *= 2n; } w.push(String(B(a0) * B(b0))); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long razy(long long a, long long b) {
    if (a == 0) return 0;
    cout << a << " " << b;
    if (a % 2 == 1) cout << " +";
    cout << "\n";
    long long w = razy(a / 2, 2 * b);
    if (a % 2 == 1) w += b;
    return w;
}
int main() {
    long long a, b;
    cin >> a >> b;
    long long wynik = razy(a, b);
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-liczba-lustrzana', krok: 3, level: 'srednie',
            title: 'Liczby lustrzane',
            short: 'Czy liczba czytana od tyłu jest taka sama? Odwróć ją rekurencją z drugim parametrem — akumulatorem, do którego przenosisz cyfry jedna po drugiej.',
            tags: ['parametr-akumulator', 'return z głębi', 'long long'],
            statement: ['Liczba jest lustrzana (palindromiczna), jeśli od tyłu czyta się ją tak samo jak od przodu, na przykład 1221 albo 7. Dla każdej z t liczb wypisz TAK albo NIE.',
                'Napisz funkcję rekurencyjną long long odwroc(long long n, long long acc), która przenosi cyfry z n do acc: gdy n == 0, oddaje acc; inaczej wywołuje samą siebie dla n / 10 i acc · 10 + n % 10. Liczba jest lustrzana, gdy odwroc(n, 0) == n.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n1221\n7\n120\n0', note: '120 od tyłu to 021, czyli 21 — nie 120.' }],
            hint: R`long long odwroc(long long n, long long acc) { if (n == 0) return acc; return odwroc(n / 10, acc * 10 + n % 10); }. Dla 1234: odwroc(1234, 0) → odwroc(123, 4) → odwroc(12, 43) → odwroc(1, 432) → odwroc(0, 4321) → 4321. Ostatnie wywołanie zna cały wynik, a pozostałe tylko oddają go w górę.`,
            tests: (r) => {
                const pal = () => { const k = r.int(1, 9); const s = String(r.int(1, 10 ** k - 1)); const m = r() < 0.5 ? s.slice(0, -1) : s; return (s + m.split('').reverse().join('')).slice(0, 18); };
                const palind = () => { for (;;) { const x = pal(); if (x === x.split('').reverse().join('') && !x.startsWith('0')) return x; } };
                const mix = Array.from({ length: 1000 }, () => (r() < 0.5 ? palind() : String(losDlugi(r, 0n, B(E18)))));
                return [listaT(['1221', '7', '120', '0']), listaT([E18, '999999999999999999', '100000000000000001', '1000000000000000001'.slice(0, 18), '10', '11', '123321', '1234321']), listaT(mix)];
            },
            check: (inp) => checkT(inp, 1000, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => (x === x.split('').reverse().join('') ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long odwroc(long long n, long long acc) {
    if (n == 0) return acc;
    return odwroc(n / 10, acc * 10 + n % 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        if (odwroc(n, 0) == n) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
    ];
};
