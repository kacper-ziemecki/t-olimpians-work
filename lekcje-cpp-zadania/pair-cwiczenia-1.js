// Pair — ćwiczenia w trakcie lekcji, części 1–4: pierwsza para (first, second, klamry, typy, kopia),
// pary z życia (punkty, godziny, ułamki, przedziały, abs, max, min), porównywanie par (kolejność słownikowa,
// sztuczka z minusem) i tablica par (wczytywanie, szukanie, para (wartość, pozycja), każda z każdą).
// Uczeń zna pierwszy etap, tablice i napisy — ale jeszcze nie funkcje, vector ani sort (sort pojawia się w części 7).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const TOWARY = ['chleb', 'mleko', 'maslo', 'jajka', 'ser', 'jablka', 'banany', 'woda', 'sok', 'herbata', 'kawa', 'cukier', 'maka',
        'ryz', 'makaron', 'pomidory', 'ogorki', 'szynka', 'jogurt', 'czekolada', 'ciastka', 'dzem', 'miod', 'olej', 'sol', 'pieprz'];
    const lines = (s) => s.split('\n');
    const word = (r, a, b) => r.word(r.int(a, b));
    const p2 = (x) => String(x).padStart(2, '0');
    const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
    const cmp = (a, b) => (a[0] !== b[0] ? (a[0] < b[0] ? -1 : 1) : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0);
    const para = (a, b) => `(${a}, ${b})`;

    return [
        // ================================================================ KROK 1 · pierwsza para
        {
            id: 'pair-w-nawiasach', krok: 1, level: 'latwe',
            title: 'Para w nawiasach',
            short: 'Wczytaj dwie liczby do pary i wypisz ją w nawiasach — raz normalnie, raz odwróconą.',
            tags: ['pair<int, int>', 'first i second', 'format (a, b)'],
            statement: ['Wczytaj dwie liczby całkowite do pary p. W pierwszym wierszu wypisz parę w postaci (a, b) — nawias, pierwsza liczba, przecinek, spacja, druga liczba, nawias. W drugim wierszu wypisz tę samą parę z zamienionymi przegródkami.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Dwa wiersze: (a, b) i (b, a).'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '4 9' }, { input: '-1 0' }],
            hint: R`Wczytaj: cin >> p.first >> p.second;. Wypisz kawałek po kawałku: cout << "(" << p.first << ", " << p.second << ")\n";. Do drugiego wiersza możesz użyć swap(p.first, p.second); albo po prostu wypisać przegródki w odwrotnej kolejności.`,
            tests: (r) => ['4 9', '-1 0', '0 0', '1000000000 -1000000000', `${r.int(-100, 100)} ${r.int(-100, 100)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`],
            solve: (inp) => { const [a, b] = nums(inp); return `${para(a, b)}\n${para(b, a)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<int, int> p;
    cin >> p.first >> p.second;
    cout << "(" << p.first << ", " << p.second << ")\n";
    swap(p.first, p.second);
    cout << "(" << p.first << ", " << p.second << ")\n";
    return 0;
}`,
        },
        {
            id: 'pair-dodawanie-par', krok: 1, level: 'latwe',
            title: 'Dodawanie i odejmowanie par',
            short: 'Dwie pary dodaj i odejmij przegródka po przegródce: first z first, second z second.',
            tags: ['dwie pary', 'p.first + q.first', 'klamry'],
            statement: ['Wczytaj dwie pary liczb: (a, b) i (c, d). Wypisz ich sumę, czyli parę (a + c, b + d), a w drugim wierszu różnicę, czyli parę (a − c, b − d). Pary wypisz w postaci (x, y).'],
            input_format: ['Jeden wiersz z czterema liczbami: a, b, c, d.'],
            output_format: ['Dwa wiersze: suma i różnica par w postaci (x, y).'],
            constraints: ['−10⁹ ≤ a, b, c, d ≤ 10⁹'],
            examples: [{ input: '1 2 3 4', note: 'Suma: (1 + 3, 2 + 4) = (4, 6). Różnica: (1 − 3, 2 − 4) = (−2, −2).' }],
            hint: R`Sumy dochodzą do 2 · 10⁹, więc nie zmieszczą się w int — użyj pair<long long, long long>. Nową parę zbudujesz klamrami: s = {p.first + q.first, p.second + q.second};.`,
            tests: (r) => ['1 2 3 4', '0 0 0 0', '1000000000 1000000000 1000000000 1000000000', '-1000000000 5 1000000000 -5',
                ...Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => r.int(-1e9, 1e9)).join(' '))],
            solve: (inp) => { const [a, b, c, d] = nums(inp); return `${para(a + c, b + d)}\n${para(a - c, b - d)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<long long, long long> p, q;
    cin >> p.first >> p.second >> q.first >> q.second;
    pair<long long, long long> s = {p.first + q.first, p.second + q.second};
    pair<long long, long long> r = {p.first - q.first, p.second - q.second};
    cout << "(" << s.first << ", " << s.second << ")\n";
    cout << "(" << r.first << ", " << r.second << ")\n";
    return 0;
}`,
        },
        {
            id: 'pair-przesuniecie', krok: 1, level: 'latwe',
            title: 'Przesunięcie punktu',
            short: 'Punkt przesuwa się k razy o ten sam wektor (dx, dy). Gdzie skończy?',
            tags: ['p.first += …', 'pętla', 'pozycja jako para'],
            statement: ['Punkt startuje w (x, y). W każdym kroku przesuwa się o wektor (dx, dy): jego x zwiększa się o dx, a y o dy. Wykonaj k kroków i wypisz końcowe współrzędne punktu, oddzielone spacją.'],
            input_format: ['W pierwszym wierszu x i y.', 'W drugim wierszu dx i dy.', 'W trzecim wierszu liczba kroków k.'],
            output_format: ['Dwie liczby: końcowe x i y.'],
            constraints: ['−1000 ≤ x, y, dx, dy ≤ 1000', '0 ≤ k ≤ 1000'],
            examples: [{ input: '0 0\n2 -1\n3' }, { input: '5 5\n1 1\n0', note: 'Zero kroków — punkt zostaje na miejscu.' }],
            hint: R`Trzymaj pozycję w pair<int, int> p, a wektor w pair<int, int> v. W pętli wykonanej k razy: p.first += v.first; p.second += v.second;. Możesz też od razu dodać k * dx — oba sposoby są dobre.`,
            tests: (r) => ['0 0\n2 -1\n3', '5 5\n1 1\n0', '-1000 1000\n1000 -1000\n1000', ...Array.from({ length: 5 }, () => `${r.int(-1000, 1000)} ${r.int(-1000, 1000)}\n${r.int(-1000, 1000)} ${r.int(-1000, 1000)}\n${r.int(0, 1000)}`)],
            solve: (inp) => { const [x, y, dx, dy, k] = nums(inp); return `${x + k * dx} ${y + k * dy}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<int, int> p, v;
    int k;
    cin >> p.first >> p.second >> v.first >> v.second >> k;
    for (int i = 0; i < k; i++) {
        p.first += v.first;
        p.second += v.second;
    }
    cout << p.first << " " << p.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-licznik-parzystych', krok: 1, level: 'latwe',
            title: 'Licznik w parze',
            short: 'Jedna para jako dwa liczniki: ile liczb parzystych i ile nieparzystych?',
            tags: ['para jako licznik', 'nowa para ma zera', 'x % 2'],
            statement: ['Wczytaj n liczb całkowitych i policz, ile z nich jest parzystych, a ile nieparzystych. Oba liczniki trzymaj w jednej parze: w first liczbę parzystych, w second liczbę nieparzystych. Wypisz obie liczby oddzielone spacją. Uwaga: liczby mogą być ujemne.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby: ile parzystych i ile nieparzystych.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n1 2 3 4 -5 0', note: 'Parzyste: 2, 4 i 0. Nieparzyste: 1, 3 i −5.' }],
            hint: R`pair<int, int> licz; startuje od (0, 0), więc od razu możesz zwiększać przegródki. Pamiętaj z lekcji o modulo: -5 % 2 to -1, a nie 1 — sprawdzaj parzystość warunkiem x % 2 == 0, a nie x % 2 == 1.`,
            tests: (r) => ['6\n1 2 3 4 -5 0', '1\n7', '1\n-8', `10\n${Array.from({ length: 10 }, () => r.int(-9, 9)).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => r.int(-1e9, 1e9)).join(' ')}`, `5\n-1 -3 -5 -7 -9`],
            solve: (inp) => { const v = nums(inp).slice(1); const p = v.filter((x) => x % 2 === 0).length; return `${p} ${v.length - p}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> licz;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) licz.first++;
        else licz.second++;
    }
    cout << licz.first << " " << licz.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-min-max', krok: 1, level: 'latwe',
            title: 'Najmniejsza i największa w jednej parze',
            short: 'Trzymaj w parze naraz minimum i maksimum wczytywanych liczb.',
            tags: ['para (min, max)', 'start od pierwszej liczby', 'rekord'],
            statement: ['Wczytaj n liczb całkowitych. Na bieżąco trzymaj w jednej parze najmniejszą (first) i największą (second) liczbę spośród wczytanych. Na koniec wypisz obie przegródki pary, oddzielone spacją.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby: najmniejsza i największa.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n4 -2 9 0 9' }, { input: '1\n-7' }],
            hint: R`Pierwszą liczbę wczytaj przed pętlą i ustaw p = {x, x};. W pętli po pozostałych: if (x < p.first) p.first = x; if (x > p.second) p.second = x;. Start od zera byłby błędem dla samych liczb ujemnych (albo samych dodatnich).`,
            tests: (r) => ['5\n4 -2 9 0 9', '1\n-7', '3\n-5 -9 -1', '3\n5 9 1', `1000\n${Array.from({ length: 1000 }, () => r.int(-1e9, 1e9)).join(' ')}`, `20\n${Array.from({ length: 20 }, () => r.int(-50, 50)).join(' ')}`],
            solve: (inp) => { const v = nums(inp).slice(1); return `${Math.min(...v)} ${Math.max(...v)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, x;
    cin >> n >> x;
    pair<int, int> p = {x, x};
    for (int i = 1; i < n; i++) {
        cin >> x;
        if (x < p.first) p.first = x;
        if (x > p.second) p.second = x;
    }
    cout << p.first << " " << p.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-polowki-slowa', krok: 1, level: 'latwe',
            title: 'Połówki słowa',
            short: 'Rozetnij słowo na dwie połówki, zapisz je w parze napisów i zamień miejscami.',
            tags: ['pair<string, string>', 'substr', 'swap'],
            statement: ['Wczytaj słowo o parzystej długości. Rozetnij je na dwie równe połówki i włóż je do pary napisów: lewą do first, prawą do second. W pierwszym wierszu wypisz parę w postaci (lewa, prawa). W drugim wierszu wypisz słowo powstałe ze sklejenia połówek w odwrotnej kolejności: najpierw prawa, potem lewa.'],
            input_format: ['Jeden wiersz ze słowem o parzystej długości.'],
            output_format: ['Dwa wiersze: (lewa, prawa) i sklejone połówki w odwrotnej kolejności.'],
            constraints: ['Słowo ma od 2 do 100 małych liter, a jego długość jest parzysta.'],
            examples: [{ input: 'kotlet' }, { input: 'ab' }],
            hint: R`Połówki wytniesz przez substr z lekcji o napisach: s.substr(0, n / 2) i s.substr(n / 2). Zapisz je w pair<string, string> p = {…, …};. Potem swap(p.first, p.second); i wypisz p.first + p.second.`,
            check: (inp) => (inp.length % 2 === 0 ? null : 'nieparzysta długość'),
            tests: (r) => ['kotlet', 'ab', 'kajak' + 'k', 'abcdefgh', r.word(2 * r.int(1, 10)), r.word(100), r.word(2 * r.int(20, 49))],
            solve: (inp) => { const s = inp.trim(), n = s.length; const a = s.slice(0, n / 2), b = s.slice(n / 2); return `(${a}, ${b})\n${b}${a}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    pair<string, string> p = {s.substr(0, n / 2), s.substr(n / 2)};
    cout << "(" << p.first << ", " << p.second << ")\n";
    swap(p.first, p.second);
    cout << p.first + p.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-wyniki-meczow', krok: 1, level: 'latwe',
            title: 'Wyniki meczów',
            short: 'Każdy wynik meczu to para (gospodarze, goście). Ile było wygranych gospodarzy, remisów i wygranych gości?',
            tags: ['para jako wynik', 'if / else if', 'trzy liczniki'],
            statement: ['W lidze rozegrano n meczów. Wynik każdego meczu to para liczb: gole gospodarzy i gole gości. Policz, ile meczów wygrali gospodarze, ile skończyło się remisem i ile wygrali goście. Wypisz te trzy liczby w tej kolejności, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby: gole gospodarzy i gole gości.'],
            output_format: ['Trzy liczby: wygrane gospodarzy, remisy, wygrane gości.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ gole ≤ 20'],
            examples: [{ input: '4\n2 1\n0 0\n1 3\n2 2' }],
            hint: R`Wczytuj każdy wynik do pary w: cin >> w.first >> w.second;. Porównaj przegródki: w.first > w.second — wygrali gospodarze, w.first == w.second — remis, a w pozostałych przypadkach wygrali goście.`,
            tests: (r) => ['4\n2 1\n0 0\n1 3\n2 2', '1\n0 0', `30\n${Array.from({ length: 30 }, () => `${r.int(0, 5)} ${r.int(0, 5)}`).join('\n')}`, `1000\n${Array.from({ length: 1000 }, () => `${r.int(0, 20)} ${r.int(0, 20)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const n = v[0]; let a = 0, b = 0, c = 0; for (let i = 0; i < n; i++) { const x = v[1 + 2 * i], y = v[2 + 2 * i]; if (x > y) a++; else if (x === y) b++; else c++; } return `${a} ${b} ${c}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int gosp = 0, remis = 0, gosc = 0;
    for (int i = 0; i < n; i++) {
        pair<int, int> w;
        cin >> w.first >> w.second;
        if (w.first > w.second) gosp++;
        else if (w.first == w.second) remis++;
        else gosc++;
    }
    cout << gosp << " " << remis << " " << gosc << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-znak-i-liczba', krok: 1, level: 'latwe',
            title: 'Znak i liczba powtórzeń',
            short: 'Pary (znak, ile razy) zamień z powrotem w napis: (a, 3) to aaa.',
            tags: ['pair<char, int>', "string(k, c)", 'budowanie napisu'],
            statement: ['Napis został zapisany w skrócie jako lista par (znak, liczba powtórzeń): para (a, 3) oznacza aaa, a para (b, 1) — b. Wczytaj n par i odtwórz cały napis.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednej parze: znak (mała litera) i liczba powtórzeń.'],
            output_format: ['Odtworzony napis.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ liczba powtórzeń ≤ 100', 'Odtworzony napis ma najwyżej 20 000 znaków.'],
            examples: [{ input: '3\na 3\nb 1\nc 2' }],
            hint: R`Wczytuj pary do pair<char, int> p: cin >> p.first >> p.second;. Kawałek napisu to string(p.second, p.first) — przepis z lekcji o typach. Doklejaj kolejne kawałki do wyniku przez +=.`,
            check: (inp) => { const t = toks(inp); let s = 0; for (let i = 0; i < Number(t[0]); i++) s += Number(t[2 + 2 * i]); return s <= 20000 ? null : 'za długi napis'; },
            tests: (r) => ['3\na 3\nb 1\nc 2', '1\nz 1', '1\nq 100', `20\n${Array.from({ length: 20 }, () => `${r.word(1)} ${r.int(1, 9)}`).join('\n')}`, `200\n${Array.from({ length: 200 }, () => `${r.word(1)} ${r.int(1, 100)}`).join('\n')}`, `1000\n${Array.from({ length: 1000 }, () => `${r.word(1)} ${r.int(1, 20)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let s = ''; for (let i = 0; i < n; i++) s += t[1 + 2 * i].repeat(Number(t[2 + 2 * i])); return s; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string w = "";
    for (int i = 0; i < n; i++) {
        pair<char, int> p;
        cin >> p.first >> p.second;
        w += string(p.second, p.first);
    }
    cout << w << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · pary z życia
        {
            id: 'pair-taksowka', krok: 2, level: 'latwe',
            title: 'Odległość taksówkarza',
            short: 'Taksówka jeździ tylko wzdłuż ulic. Ile kratek przejedzie z punktu A do punktu B?',
            tags: ['punkt (x, y)', 'abs', 'odległość miejska'],
            statement: ['W mieście o ulicach ułożonych w kratkę taksówka jeździ tylko w poziomie i w pionie. Odległość między punktami (x₁, y₁) i (x₂, y₂) to |x₁ − x₂| + |y₁ − y₂|. Dla każdego z n kursów wypisz, ile kratek przejedzie taksówka.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: x₁, y₁, x₂, y₂.'],
            output_format: ['n wierszy z odległościami.'],
            constraints: ['1 ≤ n ≤ 100', '−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '2\n1 2 4 -2\n0 0 0 0' }],
            hint: R`Zapisz punkty w parach a i b. Odległość to abs(a.first - b.first) + abs(a.second - b.second). abs usuwa minus, więc kolejność punktów nie ma znaczenia.`,
            tests: (r) => ['2\n1 2 4 -2\n0 0 0 0', `1\n-1000000 -1000000 1000000 1000000`, `100\n${Array.from({ length: 100 }, () => Array.from({ length: 4 }, () => r.int(-1e6, 1e6)).join(' ')).join('\n')}`, `20\n${Array.from({ length: 20 }, () => Array.from({ length: 4 }, () => r.int(-10, 10)).join(' ')).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const [a, b, c, d] = v.slice(1 + 4 * i, 5 + 4 * i); out.push(Math.abs(a - c) + Math.abs(b - d)); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<int, int> a, b;
        cin >> a.first >> a.second >> b.first >> b.second;
        cout << abs(a.first - b.first) + abs(a.second - b.second) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-srodek-odcinka', krok: 2, level: 'latwe',
            title: 'Środek odcinka',
            short: 'Znajdź środek odcinka między dwoma punktami — wynik z jedną cyfrą po kropce.',
            tags: ['pair<double, double>', '/ 2.0', 'fixed i setprecision'],
            statement: ['Wczytaj dwa punkty A i B o współrzędnych całkowitych. Wypisz środek odcinka AB: jego x to średnia x-ów, a y — średnia y-ów. Obie współrzędne wypisz z dokładnie jedną cyfrą po kropce, oddzielone spacją.'],
            input_format: ['Jeden wiersz z czterema liczbami: xA, yA, xB, yB.'],
            output_format: ['Dwie liczby z jedną cyfrą po kropce.'],
            constraints: ['−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '1 2 4 -2' }, { input: '-3 5 -3 5', note: 'Gdy punkty są takie same, środek to ten sam punkt.' }],
            hint: R`Dziel przez 2.0, a nie przez 2 — inaczej dzielenie liczb całkowitych obetnie połówkę. Wynik trzymaj w pair<double, double>, a wypisz z cout << fixed << setprecision(1) (biblioteka <iomanip>).`,
            tests: (r) => ['1 2 4 -2', '-3 5 -3 5', '0 0 1 1', '-1 -1 0 0', '1000000 -1000000 -1000000 999999', ...Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => r.int(-1e6, 1e6)).join(' '))],
            solve: (inp) => { const [a, b, c, d] = nums(inp); const f = (s) => (s / 2).toFixed(1); return `${f(a + c)} ${f(b + d)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    pair<int, int> a, b;
    cin >> a.first >> a.second >> b.first >> b.second;
    pair<double, double> s = {(a.first + b.first) / 2.0, (a.second + b.second) / 2.0};
    cout << fixed << setprecision(1) << s.first << " " << s.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-cwiartka', krok: 2, level: 'latwe',
            title: 'Która ćwiartka?',
            short: 'Dla każdego punktu powiedz, w której ćwiartce układu leży — albo że leży na osi.',
            tags: ['punkt (x, y)', 'if / else if', 'znaki współrzędnych'],
            statement: ['Osie układu współrzędnych dzielą płaszczyznę na cztery ćwiartki: I (x > 0, y > 0), II (x < 0, y > 0), III (x < 0, y < 0) i IV (x > 0, y < 0). Dla każdego z n punktów wypisz numer ćwiartki rzymskimi cyframi: I, II, III albo IV. Jeśli punkt leży na którejś osi (x = 0 lub y = 0), wypisz OS.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby: x i y.'],
            output_format: ['n wierszy: I, II, III, IV albo OS.'],
            constraints: ['1 ≤ n ≤ 100', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '5\n3 4\n-3 4\n-3 -4\n3 -4\n0 7' }],
            hint: R`Najpierw sprawdź osie: if (p.first == 0 || p.second == 0). Potem rozstrzygaj po znakach przegródek łańcuchem else if.`,
            tests: (r) => ['5\n3 4\n-3 4\n-3 -4\n3 -4\n0 7', '2\n0 0\n5 0', `100\n${Array.from({ length: 100 }, () => `${r.pick([0, r.int(-1e9, 1e9), r.int(-5, 5)])} ${r.pick([0, r.int(-1e9, 1e9), r.int(-5, 5)])}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const x = v[1 + 2 * i], y = v[2 + 2 * i]; out.push(x === 0 || y === 0 ? 'OS' : x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III')); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<int, int> p;
        cin >> p.first >> p.second;
        if (p.first == 0 || p.second == 0) cout << "OS\n";
        else if (p.first > 0 && p.second > 0) cout << "I\n";
        else if (p.first < 0 && p.second > 0) cout << "II\n";
        else if (p.first < 0 && p.second < 0) cout << "III\n";
        else cout << "IV\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-za-ile-minut', krok: 2, level: 'latwe',
            title: 'Godzina za k minut',
            short: 'Godzina jako para (h, m). Która będzie godzina za k minut? Zegar przechodzi przez północ.',
            tags: ['godzina (h, m)', '% 1440', 'zera z przodu'],
            statement: ['Jest godzina h:m. Która godzina będzie za k minut? Zegar jest 24-godzinny: po 23:59 przychodzi 00:00. Wypisz wynik w postaci HH:MM — godziny i minuty zawsze dwucyfrowo.'],
            input_format: ['Jeden wiersz: godzina h, minuta m i liczba minut k.'],
            output_format: ['Godzina w postaci HH:MM.'],
            constraints: ['0 ≤ h ≤ 23', '0 ≤ m ≤ 59', '0 ≤ k ≤ 10⁶'],
            examples: [{ input: '13 45 100' }, { input: '23 50 15', note: 'Po północy zegar liczy od zera: 00:05.' }],
            hint: R`Zamień godzinę na minuty od północy: h * 60 + m, dodaj k i weź resztę z dzielenia przez 1440 (tyle minut ma doba). Nowa godzina to t = {m / 60, m % 60}. Zera z przodu dopisz warunkiem if (… < 10) albo przez setw(2) i setfill('0').`,
            tests: (r) => ['13 45 100', '23 50 15', '0 0 0', '23 59 1', '12 30 1000000', '0 0 1440', ...Array.from({ length: 5 }, () => `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 1e6)}`)],
            solve: (inp) => { const [h, m, k] = nums(inp); const t = (h * 60 + m + k) % 1440; return `${p2(Math.floor(t / 60))}:${p2(t % 60)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<int, int> t;
    int k;
    cin >> t.first >> t.second >> k;
    int m = (t.first * 60 + t.second + k) % 1440;
    t = {m / 60, m % 60};
    if (t.first < 10) cout << "0";
    cout << t.first << ":";
    if (t.second < 10) cout << "0";
    cout << t.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-ile-minut-minelo', krok: 2, level: 'latwe',
            title: 'Ile minut minęło?',
            short: 'Od godziny A do godziny B — ile minut? Jeśli B jest wcześniej, to już następnego dnia.',
            tags: ['godzina (h, m)', 'minuty od północy', '+ 1440'],
            statement: ['Wczytaj dwie godziny: A i B, każdą jako parę (godzina, minuta). Policz, ile minut mija od A do najbliższej godziny B. Jeśli B jest wcześniej niż A, to chodzi o B następnego dnia. Jeśli godziny są równe, wypisz 0.'],
            input_format: ['Jeden wiersz z czterema liczbami: h₁ m₁ h₂ m₂.'],
            output_format: ['Liczba minut.'],
            constraints: ['0 ≤ h₁, h₂ ≤ 23', '0 ≤ m₁, m₂ ≤ 59'],
            examples: [{ input: '8 0 9 30' }, { input: '22 15 1 0', note: 'Od 22:15 do północy mija 105 minut, a potem jeszcze 60.' }],
            hint: R`Zamień obie godziny na minuty od północy. Różnica może wyjść ujemna — wtedy dodaj 1440. Krótko: (b - a + 1440) % 1440.`,
            tests: (r) => ['8 0 9 30', '22 15 1 0', '0 0 0 0', '23 59 0 0', '0 0 23 59', '12 0 12 0', ...Array.from({ length: 6 }, () => `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 23)} ${r.int(0, 59)}`)],
            solve: (inp) => { const [a, b, c, d] = nums(inp); return String((c * 60 + d - a * 60 - b + 1440) % 1440); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<int, int> a, b;
    cin >> a.first >> a.second >> b.first >> b.second;
    int ma = a.first * 60 + a.second;
    int mb = b.first * 60 + b.second;
    cout << (mb - ma + 1440) % 1440 << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-skracanie-ulamka', krok: 2, level: 'srednie',
            title: 'Skracanie ułamka',
            short: 'Ułamek jako para (licznik, mianownik). Skróć go algorytmem Euklidesa.',
            tags: ['ułamek (l, m)', 'NWD — Euklides', 'long long'],
            statement: ['Dla każdego z n ułamków a/b wypisz ułamek skrócony do postaci nieskracalnej — licznik i mianownik podzielone przez ich największy wspólny dzielnik — w postaci licznik/mianownik.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby: licznik a i mianownik b.'],
            output_format: ['n wierszy z ułamkami w postaci a/b.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ a, b ≤ 10¹²'],
            examples: [{ input: '3\n9 18\n7 3\n100 25', note: 'Ułamka 7/3 nie da się skrócić. 100/25 to 4/1.' }],
            hint: R`NWD policz algorytmem Euklidesa z lekcji o modulo: dopóki b != 0, zamieniaj (a, b) na (b, a % b). Liczby mogą mieć 12 cyfr, więc użyj pair<long long, long long>. Uwaga: pętla Euklidesa niszczy swoje zmienne — pracuj na kopiach licznika i mianownika.`,
            tests: (r) => ['3\n9 18\n7 3\n100 25', '2\n1 1\n1000000000000 1', `30\n${Array.from({ length: 30 }, () => { const g = r.int(1, 1000); return `${g * r.int(1, 1e6)} ${g * r.int(1, 1e6)}`; }).join('\n')}`, `100\n${Array.from({ length: 100 }, () => `${r.int(1, 1e12)} ${r.int(1, 1e12)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp).map(BigInt); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; let x = a, y = b; while (y) { [x, y] = [y, x % y]; } out.push(`${a / x}/${b / x}`); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<long long, long long> u;
        cin >> u.first >> u.second;
        long long a = u.first, b = u.second;
        while (b != 0) {
            long long r = a % b;
            a = b;
            b = r;
        }
        u = {u.first / a, u.second / a};
        cout << u.first << "/" << u.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-dodawanie-ulamkow', krok: 2, level: 'srednie',
            title: 'Dodawanie ułamków',
            short: 'Dodaj dwa ułamki zapisane jako pary i podaj wynik w postaci nieskracalnej.',
            tags: ['a/b + c/d', 'NWD', 'para wynikowa'],
            statement: ['Dla każdej z n par ułamków a/b i c/d wypisz ich sumę w postaci nieskracalnej licznik/mianownik.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: a, b, c, d.'],
            output_format: ['n wierszy z sumami w postaci licznik/mianownik.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ a, b, c, d ≤ 10⁶'],
            examples: [{ input: '3\n1 6 1 3\n1 2 1 2\n2 3 1 4', note: '1/6 + 1/3 = 9/18 = 1/2. 1/2 + 1/2 = 1/1.' }],
            hint: R`Suma to (a · d + c · b) / (b · d). Iloczyny dochodzą do 10¹², więc licz w long long. Potem skróć licznik i mianownik przez ich NWD — algorytmem Euklidesa.`,
            tests: (r) => ['3\n1 6 1 3\n1 2 1 2\n2 3 1 4', '1\n1000000 1 1000000 1', `100\n${Array.from({ length: 100 }, () => Array.from({ length: 4 }, () => r.int(1, r.pick([10, 1000, 1e6]))).join(' ')).join('\n')}`],
            solve: (inp) => { const t = toks(inp).map(BigInt); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) { const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i); const l = a * d + c * b, m = b * d; let x = l, y = m; while (y) { [x, y] = [y, x % y]; } out.push(`${l / x}/${m / x}`); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<long long, long long> x, y;
        cin >> x.first >> x.second >> y.first >> y.second;
        pair<long long, long long> s = {x.first * y.second + y.first * x.second, x.second * y.second};
        long long a = s.first, b = s.second;
        while (b != 0) {
            long long r = a % b;
            a = b;
            b = r;
        }
        cout << s.first / a << "/" << s.second / a << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-czesc-wspolna', krok: 2, level: 'latwe',
            title: 'Część wspólna przedziałów',
            short: 'Dwa przedziały [a, b] i [c, d]: gdzie się pokrywają? Późniejszy początek, wcześniejszy koniec.',
            tags: ['przedział (od, do)', 'max i min', 'BRAK'],
            statement: ['Dla każdej z n par przedziałów [a, b] i [c, d] wypisz ich część wspólną w postaci dwóch liczb: początku i końca. Końce przedziałów należą do przedziałów, więc [1, 5] i [5, 8] mają część wspólną [5, 5]. Jeśli przedziały się nie pokrywają, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: a, b, c, d.'],
            output_format: ['n wierszy: początek i koniec części wspólnej albo BRAK.'],
            constraints: ['1 ≤ n ≤ 100', '−10⁹ ≤ a ≤ b ≤ 10⁹', '−10⁹ ≤ c ≤ d ≤ 10⁹'],
            examples: [{ input: '3\n2 8 5 12\n2 4 6 9\n1 5 5 8' }],
            hint: R`Część wspólna zaczyna się w max(a, c), a kończy w min(b, d). Zbuduj z nich parę w = {max(…), min(…)}; i sprawdź, czy w.first <= w.second.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) { const [a, b, c, d] = v.slice(1 + 4 * i, 5 + 4 * i); if (a > b || c > d) return 'zły przedział'; } return null; },
            tests: (r) => {
                const prz = (lo, hi) => { const a = r.int(lo, hi), b = r.int(lo, hi); return `${Math.min(a, b)} ${Math.max(a, b)}`; };
                return ['3\n2 8 5 12\n2 4 6 9\n1 5 5 8', '1\n1 1 1 1', `100\n${Array.from({ length: 100 }, () => `${prz(-20, 20)} ${prz(-20, 20)}`).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${prz(-1e9, 1e9)} ${prz(-1e9, 1e9)}`).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const [a, b, c, d] = v.slice(1 + 4 * i, 5 + 4 * i); const x = Math.max(a, c), y = Math.min(b, d); out.push(x <= y ? `${x} ${y}` : 'BRAK'); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<int, int> a, b;
        cin >> a.first >> a.second >> b.first >> b.second;
        pair<int, int> w = {max(a.first, b.first), min(a.second, b.second)};
        if (w.first <= w.second) {
            cout << w.first << " " << w.second << "\n";
        } else {
            cout << "BRAK\n";
        }
    }
    return 0;
}`,
        },

        // ================================================================ KROK 3 · porównywanie
        {
            id: 'pair-ktora-wczesniej', krok: 3, level: 'latwe',
            title: 'Która godzina wcześniej?',
            short: 'Godziny jako pary porównują się same. Wypisz wcześniejszą z dwóch.',
            tags: ['pary porównane <', 'godzina (h, m)', 'HH:MM'],
            statement: ['Dla każdej z n par godzin (z tego samego dnia) wypisz tę, która jest wcześniejsza, w postaci HH:MM. Jeśli obie godziny są takie same, wypisz ROWNO.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: h₁ m₁ h₂ m₂.'],
            output_format: ['n wierszy: wcześniejsza godzina albo ROWNO.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ h ≤ 23', '0 ≤ m ≤ 59'],
            examples: [{ input: '3\n9 30 10 5\n12 59 12 1\n7 0 7 0' }],
            hint: R`Zapisz godziny w parach a i b i porównaj je wprost: a < b. Pary porównują najpierw godziny, a przy równych godzinach — minuty. Nie trzeba niczego przeliczać na minuty.`,
            tests: (r) => {
                const g = () => `${r.int(0, 23)} ${r.int(0, 59)}`;
                return ['3\n9 30 10 5\n12 59 12 1\n7 0 7 0', `100\n${Array.from({ length: 100 }, () => { const h = r.int(0, 23); return r() < 0.3 ? `${h} ${r.int(0, 59)} ${h} ${r.int(0, 59)}` : `${g()} ${g()}`; }).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const a = v.slice(1 + 4 * i, 3 + 4 * i), b = v.slice(3 + 4 * i, 5 + 4 * i); const c = cmp(a, b); const w = c <= 0 ? a : b; out.push(c === 0 ? 'ROWNO' : `${p2(w[0])}:${p2(w[1])}`); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<int, int> a, b;
        cin >> a.first >> a.second >> b.first >> b.second;
        if (a == b) {
            cout << "ROWNO\n";
            continue;
        }
        pair<int, int> w = min(a, b);
        if (w.first < 10) cout << "0";
        cout << w.first << ":";
        if (w.second < 10) cout << "0";
        cout << w.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-porownaj-pary', krok: 3, level: 'latwe',
            title: 'Porównaj pary',
            short: 'Mniejsza, większa czy równa? Pary porównuje się najpierw po first, a przy remisie po second.',
            tags: ['<, >, ==', 'kolejność słownikowa', 'first, potem second'],
            statement: ['Dla każdej z n par par (a, b) i (c, d) wypisz znak: <, jeśli pierwsza para jest mniejsza; >, jeśli większa; albo =, jeśli są równe. Pary porównujemy jak w C++: najpierw pierwsze przegródki, a gdy są równe — drugie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: a, b, c, d.'],
            output_format: ['n wierszy ze znakami <, > albo =.'],
            constraints: ['1 ≤ n ≤ 100', '−10⁹ ≤ a, b, c, d ≤ 10⁹'],
            examples: [{ input: '4\n1 9 2 0\n3 5 3 2\n4 4 4 4\n-1 7 -2 100', note: '(1, 9) < (2, 0), bo 1 < 2 — druga przegródka nie ma znaczenia.' }],
            hint: R`Zbuduj dwie pary i porównaj je operatorami: if (p < q) …, else if (p > q) …, else …. Nie musisz pisać porównania przegródek ręcznie — pary robią to same.`,
            tests: (r) => ['4\n1 9 2 0\n3 5 3 2\n4 4 4 4\n-1 7 -2 100', `100\n${Array.from({ length: 100 }, () => { const a = r.int(-3, 3), c = r() < 0.5 ? a : r.int(-3, 3); return `${a} ${r.int(-3, 3)} ${c} ${r.int(-3, 3)}`; }).join('\n')}`, `50\n${Array.from({ length: 50 }, () => Array.from({ length: 4 }, () => r.int(-1e9, 1e9)).join(' ')).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const c = cmp(v.slice(1 + 4 * i, 3 + 4 * i), v.slice(3 + 4 * i, 5 + 4 * i)); out.push(c < 0 ? '<' : c > 0 ? '>' : '='); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<int, int> p, q;
        cin >> p.first >> p.second >> q.first >> q.second;
        if (p < q) cout << "<\n";
        else if (p > q) cout << ">\n";
        else cout << "=\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-lepszy-wynik', krok: 3, level: 'latwe',
            title: 'Lepszy wynik',
            short: 'Więcej punktów wygrywa, a przy remisie — krótszy czas. Sztuczka z minusem w praktyce.',
            tags: ['{punkty, -czas}', 'sztuczka z minusem', 'porównanie par'],
            statement: ['W pojedynku dwóch zawodników wygrywa ten, kto zdobył więcej punktów. Przy równej liczbie punktów wygrywa ten, kto uzyskał je w krótszym czasie. Dla każdego z n pojedynków wypisz PIERWSZY, DRUGI albo REMIS (gdy punkty i czasy są równe).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: punkty i czas pierwszego zawodnika, punkty i czas drugiego.'],
            output_format: ['n wierszy: PIERWSZY, DRUGI albo REMIS.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ punkty ≤ 1000', '1 ≤ czas ≤ 10⁶'],
            examples: [{ input: '3\n90 45 90 30\n95 50 90 30\n80 20 80 20' }],
            hint: R`Zapisz każdego zawodnika jako parę {punkty, -czas}. Minus sprawia, że krótszy czas daje większą parę. Teraz wystarczy porównać pary: większa para to lepszy zawodnik.`,
            tests: (r) => ['3\n90 45 90 30\n95 50 90 30\n80 20 80 20', `100\n${Array.from({ length: 100 }, () => { const p = r.int(0, 5), t = r.int(1, 5); return r() < 0.4 ? `${p} ${t} ${p} ${r.int(1, 5)}` : `${p} ${t} ${r.int(0, 5)} ${r.int(1, 5)}`; }).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${r.int(0, 1000)} ${r.int(1, 1e6)} ${r.int(0, 1000)} ${r.int(1, 1e6)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const [p1, t1, p2_, t2] = v.slice(1 + 4 * i, 5 + 4 * i); const c = cmp([p1, -t1], [p2_, -t2]); out.push(c > 0 ? 'PIERWSZY' : c < 0 ? 'DRUGI' : 'REMIS'); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int p1, t1, p2, t2;
        cin >> p1 >> t1 >> p2 >> t2;
        pair<int, int> a = {p1, -t1}, b = {p2, -t2};
        if (a > b) cout << "PIERWSZY\n";
        else if (b > a) cout << "DRUGI\n";
        else cout << "REMIS\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-meta-maratonu', krok: 3, level: 'latwe',
            title: 'Pierwszy i ostatni na mecie',
            short: 'Godziny dobiegnięcia na metę jako pary. Kto pierwszy, kto ostatni? min i max na parach.',
            tags: ['min i max par', 'godzina (h, m)', 'rekordy'],
            statement: ['Na mecie maratonu zapisywano godzinę dobiegnięcia każdego z n zawodników jako parę (godzina, minuta). Wypisz godzinę dobiegnięcia pierwszego zawodnika, a w drugim wierszu — ostatniego, obie w postaci HH:MM.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby: godzina i minuta.'],
            output_format: ['Dwa wiersze: najwcześniejsza i najpóźniejsza godzina w postaci HH:MM.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ godzina ≤ 23', '0 ≤ minuta ≤ 59'],
            examples: [{ input: '4\n11 45\n10 58\n12 3\n11 5' }],
            hint: R`Startuj od pierwszej pary jako rekordu i dla każdej kolejnej: pierwszy = min(pierwszy, t); ostatni = max(ostatni, t);. min i max działają na całych parach.`,
            tests: (r) => ['4\n11 45\n10 58\n12 3\n11 5', '1\n9 7', `1000\n${Array.from({ length: 1000 }, () => `${r.int(0, 23)} ${r.int(0, 59)}`).join('\n')}`, `50\n${Array.from({ length: 50 }, () => `${r.int(10, 11)} ${r.int(0, 59)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); let a = t[0], b = t[0]; for (const x of t) { if (cmp(x, a) < 0) a = x; if (cmp(x, b) > 0) b = x; } return `${p2(a[0])}:${p2(a[1])}\n${p2(b[0])}:${p2(b[1])}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t;
    cin >> t.first >> t.second;
    pair<int, int> pierwszy = t, ostatni = t;
    for (int i = 1; i < n; i++) {
        cin >> t.first >> t.second;
        pierwszy = min(pierwszy, t);
        ostatni = max(ostatni, t);
    }
    if (pierwszy.first < 10) cout << "0";
    cout << pierwszy.first << ":";
    if (pierwszy.second < 10) cout << "0";
    cout << pierwszy.second << "\n";
    if (ostatni.first < 10) cout << "0";
    cout << ostatni.first << ":";
    if (ostatni.second < 10) cout << "0";
    cout << ostatni.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-trzy-pary', krok: 3, level: 'latwe',
            title: 'Trzy pary po kolei',
            short: 'Ułóż trzy pary rosnąco trzema porównaniami i zamianami.',
            tags: ['swap par', 'trzy porównania', 'kolejność słownikowa'],
            statement: ['Wczytaj trzy pary liczb i wypisz je w kolejności rosnącej — od najmniejszej do największej według zasad porównywania par — każdą w osobnym wierszu jako dwie liczby oddzielone spacją.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: kolejno przegródki pierwszej, drugiej i trzeciej pary.'],
            output_format: ['Trzy wiersze z parami w kolejności rosnącej.'],
            constraints: ['−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3 1 1 9 3 0' }],
            hint: R`Schemat z lekcji: if (a > b) swap(a, b); if (b > c) swap(b, c); if (a > b) swap(a, b);. swap zamienia całe pary, a > porównuje je według kolejności słownikowej.`,
            tests: (r) => ['3 1 1 9 3 0', '1 1 1 1 1 1', '5 5 4 4 3 3', ...Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => r.int(-3, 3)).join(' ')), Array.from({ length: 6 }, () => r.int(-1e9, 1e9)).join(' ')],
            solve: (inp) => { const v = nums(inp); const t = [[v[0], v[1]], [v[2], v[3]], [v[4], v[5]]].sort(cmp); return t.map((p) => p.join(' ')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<int, int> a, b, c;
    cin >> a.first >> a.second >> b.first >> b.second >> c.first >> c.second;
    if (a > b) swap(a, b);
    if (b > c) swap(b, c);
    if (a > b) swap(a, b);
    cout << a.first << " " << a.second << "\n";
    cout << b.first << " " << b.second << "\n";
    cout << c.first << " " << c.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najlepszy-uczen', krok: 3, level: 'srednie',
            title: 'Najlepszy uczeń',
            short: 'Najwięcej punktów wygrywa, a przy remisie — imię wcześniejsze w alfabecie. Para {-punkty, imię}.',
            tags: ['{-punkty, imie}', 'najmniejsza para', 'pair<int, string>'],
            statement: ['Wczytaj wyniki n uczniów: imię i liczbę punktów. Wypisz imię i punkty najlepszego ucznia. Najlepszy jest ten, kto ma najwięcej punktów; jeśli kilku uczniów ma tyle samo punktów, wybierz imię wcześniejsze w alfabecie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach imię i liczba punktów.'],
            output_format: ['Imię i punkty najlepszego ucznia, oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona mają od 2 do 20 liter: pierwsza wielka, pozostałe małe.', '0 ≤ punkty ≤ 1000'],
            examples: [{ input: '4\nOla 90\nJan 75\nEwa 90\nIgor 60', note: 'Ola i Ewa mają po 90 punktów — wygrywa Ewa, bo jest wcześniej w alfabecie.' }],
            hint: R`Zapisz każdego ucznia jako pair<int, string> {-punkty, imię} i szukaj najmniejszej pary. Minus sprawia, że więcej punktów to mniejsza para, a przy remisie o kolejności decyduje imię — alfabetycznie. Przy wypisywaniu cofnij minus.`,
            tests: (r) => ['4\nOla 90\nJan 75\nEwa 90\nIgor 60', '1\nAl 0', `30\n${Array.from({ length: 30 }, () => `${r.pick(IMIONA)} ${r.int(80, 90)}`).join('\n')}`, `1000\n${Array.from({ length: 1000 }, () => `${r.pick(IMIONA)} ${r.int(0, 1000)}`).join('\n')}`, `5\nZosia 5\nAnna 5\nBasia 5\nAla 5\nOla 5`],
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let best = null; for (let i = 0; i < n; i++) { const x = [-Number(t[2 + 2 * i]), t[1 + 2 * i]]; if (!best || cmp(x, best) < 0) best = x; } return `${best[1]} ${-best[0]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, string> najlepszy;
    for (int i = 0; i < n; i++) {
        string imie;
        int p;
        cin >> imie >> p;
        pair<int, string> u = {-p, imie};
        if (i == 0 || u < najlepszy) najlepszy = u;
    }
    cout << najlepszy.second << " " << -najlepszy.first << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-konkurs-skokow', krok: 3, level: 'srednie',
            title: 'Konkurs skoków',
            short: 'Najdłuższy skok wygrywa, przy remisie — wyższe noty, a potem wcześniejszy numer startowy.',
            tags: ['{odległość, noty}', 'ostro większa', 'numer zwycięzcy'],
            statement: ['W konkursie skoków narciarskich startuje n zawodników z numerami od 1 do n. Każdy oddał jeden skok: znamy jego odległość (w centymetrach) i noty za styl. Wygrywa najdłuższy skok; przy równej odległości — wyższe noty; a gdy i noty są równe — zawodnik z mniejszym numerem. Wypisz numer zwycięzcy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby: odległość i noty (zawodnik numer i to i-ty wiersz).'],
            output_format: ['Numer zwycięzcy.'],
            constraints: ['1 ≤ n ≤ 1000', '5000 ≤ odległość ≤ 25000', '0 ≤ noty ≤ 60'],
            examples: [{ input: '4\n12550 54\n13000 50\n13000 55\n13000 55', note: 'Zawodnicy 2, 3 i 4 skoczyli 130 m. Najwyższe noty mają 3 i 4 — wygrywa 3, bo ma mniejszy numer.' }],
            hint: R`Trzymaj rekord jako parę {odległość, noty} i numer jego właściciela. Zmieniaj rekord tylko wtedy, gdy nowa para jest OSTRO większa (>). Wtedy przy pełnym remisie zostaje zawodnik z mniejszym numerem.`,
            tests: (r) => ['4\n12550 54\n13000 50\n13000 55\n13000 55', '1\n5000 0', `50\n${Array.from({ length: 50 }, () => `${r.pick([12000, 12500, 13000])} ${r.int(50, 52)}`).join('\n')}`, `1000\n${Array.from({ length: 1000 }, () => `${r.int(5000, 25000)} ${r.int(0, 60)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); let best = null, k = 0; for (let i = 0; i < v[0]; i++) { const x = [v[1 + 2 * i], v[2 + 2 * i]]; if (!best || cmp(x, best) > 0) { best = x; k = i + 1; } } return String(k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> rekord = {-1, -1};
    int ktory = 0;
    for (int i = 1; i <= n; i++) {
        pair<int, int> s;
        cin >> s.first >> s.second;
        if (s > rekord) {
            rekord = s;
            ktory = i;
        }
    }
    cout << ktory << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-czy-rosna', krok: 3, level: 'latwe',
            title: 'Czy pary rosną?',
            short: 'Sprawdź, czy każda kolejna para jest ostro większa od poprzedniej.',
            tags: ['poprzednia para', 'p <= poprzednia', 'pierwszy błąd'],
            statement: ['Wczytaj n par liczb. Sprawdź, czy tworzą ciąg ostro rosnący: każda kolejna para musi być większa od poprzedniej (według zasad porównywania par). Jeśli tak, wypisz TAK. Jeśli nie, wypisz NIE i numer pierwszej pary, która nie jest większa od swojej poprzedniczki (pary numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby.'],
            output_format: ['TAK albo NIE i numer pary.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n1 5\n1 7\n2 0\n2 0', note: 'Para numer 4 jest równa parze numer 3, a nie większa.' }, { input: '3\n0 9\n1 -5\n1 3' }],
            hint: R`Pamiętaj poprzednią parę. Dla każdej nowej sprawdź: if (p <= poprzednia) — wtedy wypisz NIE i numer, i zakończ program. Pierwsza para nie ma poprzedniczki, więc wczytaj ją przed pętlą.`,
            tests: (r) => {
                const ros = (n) => { const t = []; let a = r.int(-100, 0), b = r.int(-100, 100); for (let i = 0; i < n; i++) { if (r() < 0.5) b += r.int(1, 5); else { a += r.int(1, 3); b = r.int(-100, 100); } t.push(`${a} ${b}`); } return t; };
                const zepsuj = (t) => { const v = t.slice(); const i = r.int(1, v.length - 1); v[i] = v[i - 1]; return v; };
                return ['4\n1 5\n1 7\n2 0\n2 0', '3\n0 9\n1 -5\n1 3', '1\n5 5', '2\n2 1\n1 9', `1000\n${ros(1000).join('\n')}`, `1000\n${zepsuj(ros(1000)).join('\n')}`, `50\n${zepsuj(ros(50)).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp); for (let i = 1; i < v[0]; i++) { if (cmp([v[1 + 2 * i], v[2 + 2 * i]], [v[2 * i - 1], v[2 * i]]) <= 0) return `NIE ${i + 1}`; } return 'TAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> poprzednia, p;
    cin >> poprzednia.first >> poprzednia.second;
    for (int i = 2; i <= n; i++) {
        cin >> p.first >> p.second;
        if (p <= poprzednia) {
            cout << "NIE " << i << "\n";
            return 0;
        }
        poprzednia = p;
    }
    cout << "TAK\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · tablica par
        {
            id: 'pair-pary-od-konca', krok: 4, level: 'latwe',
            title: 'Pary od końca',
            short: 'Wczytaj n par do tablicy i wypisz je od ostatniej do pierwszej w postaci (a, b).',
            tags: ['pair<int, int> t[1005]', 'pętla od końca', 'format (a, b)'],
            statement: ['Wczytaj n par liczb do tablicy par, a potem wypisz je w odwrotnej kolejności — od ostatniej do pierwszej — każdą w osobnym wierszu, w postaci (a, b).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby.'],
            output_format: ['n wierszy z parami w postaci (a, b), od ostatniej do pierwszej.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1 2\n3 4\n5 6' }],
            hint: R`pair<int, int> t[1005]; i pętla wczytująca: cin >> t[i].first >> t[i].second;. Wypisuj od i = n - 1 w dół do 0.`,
            tests: (r) => ['3\n1 2\n3 4\n5 6', '1\n0 0', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`).join('\n')}`, `20\n${Array.from({ length: 20 }, () => `${r.int(-9, 9)} ${r.int(-9, 9)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = v[0] - 1; i >= 0; i--) out.push(para(v[1 + 2 * i], v[2 + 2 * i])); return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    for (int i = n - 1; i >= 0; i--) {
        cout << "(" << t[i].first << ", " << t[i].second << ")\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-kto-najwiecej', krok: 4, level: 'latwe',
            title: 'Kto ma najwięcej punktów?',
            short: 'Tablica par (imię, punkty): znajdź osobę z największą liczbą punktów.',
            tags: ['pair<string, int>', 'rekord', 'pierwszy przy remisie'],
            statement: ['Wczytaj imiona i punkty n uczniów do tablicy par. Wypisz imię i punkty ucznia z największą liczbą punktów. Jeśli kilku uczniów ma tyle samo punktów, wybierz tego, który był na liście wcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach imię i punkty.'],
            output_format: ['Imię i punkty, oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona mają od 2 do 20 liter.', '0 ≤ punkty ≤ 10⁶'],
            examples: [{ input: '4\nOla 90\nJan 95\nEwa 95\nIgor 60', note: 'Jan i Ewa mają po 95 punktów — Jan był wcześniej.' }],
            hint: R`Pamiętaj numer najlepszego: gdzie = 0. Dla i od 1: if (u[i].second > u[gdzie].second) gdzie = i;. Ostre > sprawia, że przy remisie zostaje wcześniejszy uczeń.`,
            tests: (r) => ['4\nOla 90\nJan 95\nEwa 95\nIgor 60', '1\nAl 0', `1000\n${Array.from({ length: 1000 }, () => `${r.pick(IMIONA)} ${r.int(0, 1e6)}`).join('\n')}`, `40\n${Array.from({ length: 40 }, () => `${r.pick(IMIONA)} ${r.int(0, 5)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let k = 0; for (let i = 1; i < n; i++) if (Number(t[2 + 2 * i]) > Number(t[2 + 2 * k])) k = i; return `${t[1 + 2 * k]} ${t[2 + 2 * k]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<string, int> u[1005];
    for (int i = 0; i < n; i++) {
        cin >> u[i].first >> u[i].second;
    }
    int gdzie = 0;
    for (int i = 1; i < n; i++) {
        if (u[i].second > u[gdzie].second) gdzie = i;
    }
    cout << u[gdzie].first << " " << u[gdzie].second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-cennik', krok: 4, level: 'latwe',
            title: 'Cennik',
            short: 'Tablica par (towar, cena w groszach) jako ściąga. Odpowiedz na pytania o ceny.',
            tags: ['tablica-ściąga', 'szukanie po first', 'złote i grosze'],
            statement: ['Sklep ma cennik: n towarów, przy każdym cena w groszach. Potem przychodzi q pytań — nazw towarów. Dla każdego pytania wypisz cenę towaru w postaci złote.grosze, z groszami zawsze dwucyfrowo (na przykład 4.05), albo BRAK, jeśli takiego towaru nie ma w cenniku.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach nazwa towaru i cena w groszach.', 'Potem liczba q i q wierszy z nazwami.'],
            output_format: ['q wierszy: cena albo BRAK.'],
            constraints: ['1 ≤ n, q ≤ 100', 'Nazwy są różne i mają od 2 do 20 małych liter.', '1 ≤ cena ≤ 10⁶'],
            examples: [{ input: '3\nchleb 450\nmleko 389\njajka 105\n3\nmleko\nser\njajka' }],
            hint: R`Trzymaj cennik w pair<string, int> c[105]. Dla pytania przejdź po tablicy i porównuj c[i].first z nazwą. Cenę wypisz jako cena / 100, kropka i cena % 100 — a gdy reszta jest mniejsza od 10, dopisz przed nią zero.`,
            tests: (r) => {
                const gen = (n, q) => { const t = r.shuffle(TOWARY).slice(0, n); const ceny = t.map(() => r.pick([r.int(1, 99), r.int(100, 9999), r.int(1, 1e6), r.int(1, 20) * 100])); const pyt = Array.from({ length: q }, () => (r() < 0.75 ? r.pick(t) : r.pick(TOWARY))); return `${n}\n${t.map((x, i) => `${x} ${ceny[i]}`).join('\n')}\n${q}\n${pyt.join('\n')}`; };
                return ['3\nchleb 450\nmleko 389\njajka 105\n3\nmleko\nser\njajka', gen(5, 10), gen(26, 100), gen(1, 3)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const c = new Map(); for (let i = 0; i < n; i++) c.set(t[1 + 2 * i], Number(t[2 + 2 * i])); const q = Number(t[1 + 2 * n]); const out = []; for (let i = 0; i < q; i++) { const x = t[2 + 2 * n + i]; out.push(c.has(x) ? `${Math.floor(c.get(x) / 100)}.${p2(c.get(x) % 100)}` : 'BRAK'); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<string, int> c[105];
    for (int i = 0; i < n; i++) {
        cin >> c[i].first >> c[i].second;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string co;
        cin >> co;
        int cena = -1;
        for (int i = 0; i < n; i++) {
            if (c[i].first == co) {
                cena = c[i].second;
                break;
            }
        }
        if (cena == -1) {
            cout << "BRAK\n";
        } else {
            cout << cena / 100 << ".";
            if (cena % 100 < 10) cout << "0";
            cout << cena % 100 << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'pair-min-max-z-miejscem', krok: 4, level: 'latwe',
            title: 'Najmniejsza i największa z miejscem',
            short: 'Pary (wartość, numer): min daje pierwsze wystąpienie najmniejszej, max — ostatnie największej.',
            tags: ['para (wartość, numer)', 'min i max par', 'remisy'],
            statement: ['Wczytaj n liczb ponumerowanych od 1. W pierwszym wierszu wypisz najmniejszą liczbę i numer jej PIERWSZEGO wystąpienia. W drugim wierszu wypisz największą liczbę i numer jej OSTATNIEGO wystąpienia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: wartość i numer.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n5 3 9 3 9 4', note: 'Najmniejsza to 3 — pierwszy raz na miejscu 2. Największa to 9 — ostatni raz na miejscu 5.' }],
            hint: R`Zamieniaj każdą liczbę w parę make_pair(x, i). Najmniejsza para przy remisie wartości ma mniejszy numer — to pierwsze wystąpienie. Największa para przy remisie ma większy numer — to ostatnie wystąpienie. Wystarczą min i max.`,
            tests: (r) => ['6\n5 3 9 3 9 4', '1\n-4', '3\n7 7 7', `1000\n${Array.from({ length: 1000 }, () => r.int(-5, 5)).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => r.int(-1e9, 1e9)).join(' ')}`],
            solve: (inp) => { const v = nums(inp).slice(1); let a = 0, b = 0; v.forEach((x, i) => { if (x < v[a]) a = i; if (x >= v[b]) b = i; }); return `${v[a]} ${a + 1}\n${v[b]} ${b + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> najm, najw;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        pair<int, int> p = {x, i};
        if (i == 1) {
            najm = p;
            najw = p;
        }
        najm = min(najm, p);
        najw = max(najw, p);
    }
    cout << najm.first << " " << najm.second << "\n";
    cout << najw.first << " " << najw.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najblizszy-punkt', krok: 4, level: 'srednie',
            title: 'Najbliższy punkt',
            short: 'Dla każdego pytania znajdź najbliższy punkt z listy. Para (odległość, numer) sama rozstrzyga remisy.',
            tags: ['tablica punktów', 'para (odległość, numer)', 'abs'],
            statement: ['Na mapie jest n punktów ponumerowanych od 1. Potem przychodzi q pytań — każde to punkt (x, y). Dla każdego pytania wypisz numer punktu z mapy, który leży najbliżej, gdy odległość mierzymy jak taksówkarz: |x₁ − x₂| + |y₁ − y₂|. Jeśli kilka punktów jest równie blisko, wypisz najmniejszy numer.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.', 'Potem liczba q i q wierszy ze współrzędnymi pytań.'],
            output_format: ['q wierszy z numerami najbliższych punktów.'],
            constraints: ['1 ≤ n, q ≤ 500', '−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '3\n0 0\n5 5\n-2 1\n3\n4 4\n-1 0\n1 1', note: 'Dla (1, 1): punkt 1 jest w odległości 2, punkt 3 — w odległości 3.' }],
            hint: R`Dla każdego pytania szukaj najmniejszej pary {odległość, numer} po wszystkich punktach. Przy równej odległości mniejsza para ma mniejszy numer — remis rozstrzyga się sam.`,
            tests: (r) => {
                const gen = (n, q, z) => `${n}\n${Array.from({ length: n }, () => `${r.int(-z, z)} ${r.int(-z, z)}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => `${r.int(-z, z)} ${r.int(-z, z)}`).join('\n')}`;
                return ['3\n0 0\n5 5\n-2 1\n3\n4 4\n-1 0\n1 1', '1\n7 7\n1\n-7 -7', gen(500, 500, 1e6), gen(50, 50, 5), gen(200, 100, 20)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const P = []; for (let i = 0; i < n; i++) P.push([v[1 + 2 * i], v[2 + 2 * i]]); const q = v[1 + 2 * n]; const out = []; for (let k = 0; k < q; k++) { const x = v[2 + 2 * n + 2 * k], y = v[3 + 2 * n + 2 * k]; let best = [Infinity, 0]; P.forEach(([a, b], i) => { const d = [Math.abs(a - x) + Math.abs(b - y), i + 1]; if (cmp(d, best) < 0) best = d; }); out.push(best[1]); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> p[505];
    for (int i = 1; i <= n; i++) {
        cin >> p[i].first >> p[i].second;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int x, y;
        cin >> x >> y;
        pair<int, int> najlepszy = {2000000000, 0};
        for (int i = 1; i <= n; i++) {
            int d = abs(p[i].first - x) + abs(p[i].second - y);
            najlepszy = min(najlepszy, make_pair(d, i));
        }
        cout << najlepszy.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-najblizsza-para-punktow', krok: 4, level: 'srednie',
            title: 'Najbliższa para punktów',
            short: 'Każdy punkt z każdym: która para punktów leży najbliżej siebie?',
            tags: ['każdy z każdym', 'j od i + 1', 'abs'],
            statement: ['Na mapie jest n punktów ponumerowanych od 1. Znajdź dwa różne punkty, które leżą najbliżej siebie, gdy odległość mierzymy jak taksówkarz: |x₁ − x₂| + |y₁ − y₂|. Wypisz tę najmniejszą odległość, a po spacji numery obu punktów, mniejszy jako pierwszy. Jeśli kilka par ma tę samą najmniejszą odległość, wybierz tę o najmniejszym pierwszym numerze, a przy remisie — o najmniejszym drugim.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['Trzy liczby: odległość i numery punktów.'],
            constraints: ['2 ≤ n ≤ 1000', '−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '4\n0 0\n10 10\n1 2\n9 8', note: 'Punkty 1 i 3 są w odległości 3, a punkty 2 i 4 — w odległości 3. Wybieramy parę o mniejszym pierwszym numerze: 1 i 3.' }],
            hint: R`Dwie pętle: i od 1 do n, j od i + 1 do n. Zmieniaj rekord tylko przy ostro mniejszej odległości — kolejność pętli sama zadba o to, że przy remisie zostanie para z najmniejszymi numerami.`,
            tests: (r) => {
                const gen = (n, z) => `${n}\n${Array.from({ length: n }, () => `${r.int(-z, z)} ${r.int(-z, z)}`).join('\n')}`;
                return ['4\n0 0\n10 10\n1 2\n9 8', '2\n5 5\n5 5', '3\n0 0\n0 1\n1 0', gen(1000, 1e6), gen(1000, 30), gen(50, 10)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const P = []; for (let i = 0; i < n; i++) P.push([v[1 + 2 * i], v[2 + 2 * i]]); let b = Infinity, bi = 0, bj = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.abs(P[i][0] - P[j][0]) + Math.abs(P[i][1] - P[j][1]); if (d < b) { b = d; bi = i + 1; bj = j + 1; } } return `${b} ${bi} ${bj}`; },
            cpp: R`
#include <iostream>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> p[1005];
    for (int i = 1; i <= n; i++) {
        cin >> p[i].first >> p[i].second;
    }
    int najmniej = 2000000000, a = 0, b = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            int d = abs(p[i].first - p[j].first) + abs(p[i].second - p[j].second);
            if (d < najmniej) {
                najmniej = d;
                a = i;
                b = j;
            }
        }
    }
    cout << najmniej << " " << a << " " << b << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-zamiany-par', krok: 4, level: 'latwe',
            title: 'Zamiany w tablicy par',
            short: 'Wykonaj na tablicy par serię zamian swap(t[i], t[j]) — całe pary jadą razem.',
            tags: ['swap(t[i], t[j])', 'numeracja od 1', 'tablica par'],
            statement: ['Wczytaj n par liczb, a potem q poleceń zamiany. Każde polecenie to dwa numery i oraz j (pary numerujemy od 1) i oznacza: zamień miejscami parę numer i z parą numer j. Wykonaj wszystkie polecenia po kolei i wypisz końcową listę par, każdą w osobnym wierszu jako dwie liczby oddzielone spacją.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach pary.', 'Potem liczba q i q wierszy z numerami i oraz j.'],
            output_format: ['n wierszy z parami po wszystkich zamianach.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 1000', '1 ≤ i, j ≤ n (i może być równe j)', '−10⁹ ≤ liczby w parach ≤ 10⁹'],
            examples: [{ input: '3\n1 1\n2 2\n3 3\n2\n1 3\n2 3' }],
            hint: R`swap(t[i - 1], t[j - 1]); — pary numerujemy od 1, a pudełka od 0. Zamiana pary z samą sobą niczego nie psuje.`,
            tests: (r) => {
                const gen = (n, q) => `${n}\n${Array.from({ length: n }, (_, i) => `${i + 1} ${r.int(-1e9, 1e9)}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => `${r.int(1, n)} ${r.int(1, n)}`).join('\n')}`;
                return ['3\n1 1\n2 2\n3 3\n2\n1 3\n2 3', '1\n5 5\n1\n1 1', gen(10, 20), gen(1000, 1000)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = []; for (let i = 0; i < n; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); const q = v[1 + 2 * n]; for (let k = 0; k < q; k++) { const i = v[2 + 2 * n + 2 * k] - 1, j = v[3 + 2 * n + 2 * k] - 1; [t[i], t[j]] = [t[j], t[i]]; } return t.map((p) => p.join(' ')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int i, j;
        cin >> i >> j;
        swap(t[i - 1], t[j - 1]);
    }
    for (int i = 0; i < n; i++) {
        cout << t[i].first << " " << t[i].second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-suma-punktow', krok: 4, level: 'srednie',
            title: 'Suma punktów każdej osoby',
            short: 'Imiona się powtarzają. Zsumuj punkty każdej osoby w tablicy par (imię, suma).',
            tags: ['tablica par jako słownik', 'szukaj, a jak nie ma — dopisz', 'pair<string, int>'],
            statement: ['Przez cały semestr zapisywano punkty za aktywność: m wpisów, każdy to imię ucznia i liczba punktów. Ten sam uczeń mógł dostać punkty wiele razy. Dla każdego ucznia wypisz jego imię i sumę punktów. Uczniów wypisz w kolejności, w jakiej pojawili się na liście po raz pierwszy.'],
            input_format: ['W pierwszym wierszu liczba m.', 'W kolejnych m wierszach imię i liczba punktów.'],
            output_format: ['Dla każdego ucznia wiersz: imię i suma punktów.'],
            constraints: ['1 ≤ m ≤ 1000', 'Imiona mają od 2 do 20 liter.', '1 ≤ punkty ≤ 100'],
            examples: [{ input: '5\nOla 3\nJan 5\nOla 2\nEwa 1\nJan 1' }],
            hint: R`Trzymaj tablicę par pair<string, int> s[1005] i licznik k zajętych pudełek. Dla każdego wpisu poszukaj imienia wśród s[0..k-1]. Jeśli jest — dodaj punkty do second. Jeśli nie — dopisz nową parę na pozycji k i zwiększ k.`,
            tests: (r) => ['5\nOla 3\nJan 5\nOla 2\nEwa 1\nJan 1', '1\nAl 7', `50\n${Array.from({ length: 50 }, () => `${r.pick(IMIONA.slice(0, 6))} ${r.int(1, 100)}`).join('\n')}`, `1000\n${Array.from({ length: 1000 }, () => `${r.pick(IMIONA)} ${r.int(1, 100)}`).join('\n')}`, `300\n${Array.from({ length: 300 }, () => `${r.word(r.int(2, 4)).replace(/^./, (c) => c.toUpperCase())} ${r.int(1, 100)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp); const m = Number(t[0]); const s = new Map(); for (let i = 0; i < m; i++) s.set(t[1 + 2 * i], (s.get(t[1 + 2 * i]) || 0) + Number(t[2 + 2 * i])); return [...s].map(([a, b]) => `${a} ${b}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int m;
    cin >> m;
    pair<string, int> s[1005];
    int k = 0;
    for (int i = 0; i < m; i++) {
        string imie;
        int p;
        cin >> imie >> p;
        int gdzie = -1;
        for (int j = 0; j < k; j++) {
            if (s[j].first == imie) {
                gdzie = j;
                break;
            }
        }
        if (gdzie == -1) {
            s[k] = {imie, 0};
            gdzie = k;
            k++;
        }
        s[gdzie].second += p;
    }
    for (int j = 0; j < k; j++) {
        cout << s[j].first << " " << s[j].second << "\n";
    }
    return 0;
}`,
        },
    ];
};
