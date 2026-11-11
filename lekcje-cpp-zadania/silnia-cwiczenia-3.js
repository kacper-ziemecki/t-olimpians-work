// Silnia — ćwiczenia w trakcie lekcji, części 7–8: silnie olbrzymy (liczba w vectorze cyfr od końca,
// mnożenie pisemne z przeniesieniem, dokładna silnia, cyfry olbrzyma, suma silni olbrzymów, liczba cyfr
// i pierwsza cyfra przez log10) oraz liczenie sposobów (podium, kody, uściski dłoni, symbol Newtona,
// trójkąt Pascala, anagramy, ścieżki na kratce, dwumian modulo).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./silnia-pomoc');
    const { fact, C } = P;
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const MOD = 1000000007n;
    const zakresy = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i));
    const wielka = (r, len) => String(r.int(1, 9)) + Array.from({ length: len - 1 }, () => r.int(0, 9)).join('');
    const losoweN = (r, ile, lo, hi) => Array.from({ length: ile }, () => String(r.int(lo, hi)));

    return [
        // ================================================================ KROK 7 · silnie olbrzymy
        {
            id: 'sil-razy-liczba', krok: 7, level: 'srednie',
            title: 'Olbrzym razy liczba',
            short: 'Pomnóż liczbę z tysiąca cyfr przez k — pisemnie, z przeniesieniem.',
            tags: ['vector cyfr od końca', 'przeniesienie', 'mnożenie pisemne'],
            statement: ['Wczytaj bardzo dużą liczbę a (nawet tysiąc cyfr) i zwykłą liczbę k. Wypisz iloczyn a · k.'],
            input_format: ['W pierwszym wierszu liczba a (bez zer na początku).', 'W drugim wierszu liczba k.'],
            output_format: ['Jedna liczba — iloczyn a · k.'],
            constraints: ['1 ≤ a < 10¹⁰⁰⁰ (a ma najwyżej 1000 cyfr)', '1 ≤ k ≤ 10 000'],
            examples: [{ input: '123456789123456789123456789\n9' }, { input: '5\n24', note: 'Przeniesienie po ostatniej cyfrze ma dwie cyfry — 12 — więc liczba urasta o dwie cyfry.' }],
            hint: R`Wczytaj a jako string i przepisz cyfry od końca do vector<int> (cyfra jedności na początku: c[0]). Mnożenie pisemne: p = 0; dla każdej cyfry: x = c[i] * k + p, nowa cyfra c[i] = x % 10, przeniesienie p = x / 10. Po pętli, dopóki p > 0: c.push_back(p % 10), p /= 10. Wypisz cyfry od końca vectora do początku.`,
            tests: (r) => ['1\n1', '9\n10000', '5\n24', '1\n10000', `${'9'.repeat(1000)}\n10000`, `${'9'.repeat(1000)}\n1`, `1${'0'.repeat(999)}\n10`, `${wielka(r, 1000)}\n9999`,
                ...Array.from({ length: 6 }, () => `${wielka(r, r.int(1, 1000))}\n${r.int(1, 10000)}`)],
            check: (inp) => { const [a, k] = toks(inp); return /^[1-9]\d{0,999}$/.test(a) && Number(k) >= 1 && Number(k) <= 10000 ? null : 'zakres'; },
            solve: (inp) => { const [a, k] = toks(inp); return String(B(a) * B(k)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string a;
    int k;
    cin >> a >> k;
    vector<int> c;
    for (int i = (int)a.size() - 1; i >= 0; i--) c.push_back(a[i] - '0');
    int p = 0;
    for (int i = 0; i < (int)c.size(); i++) {
        int x = c[i] * k + p;
        c[i] = x % 10;
        p = x / 10;
    }
    while (p > 0) {
        c.push_back(p % 10);
        p /= 10;
    }
    for (int i = (int)c.size() - 1; i >= 0; i--) cout << c[i];
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-dokladna', krok: 7, level: 'srednie',
            title: 'Dokładna silnia',
            short: 'n! ze wszystkimi cyframi dla n do 1000 — vector cyfr mnożony przez 2, 3, …, n.',
            tags: ['vector<int> c = {1}', 'mnożenie pisemne', '1000! ma 2568 cyfr'],
            statement: ['Wczytaj n i wypisz liczbę n! — dokładnie, ze wszystkimi cyframi.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — n!.'],
            constraints: ['0 ≤ n ≤ 1000'],
            examples: [{ input: '25' }, { input: '0' }],
            hint: R`Trzymaj liczbę w vectorze cyfr od końca, na start vector<int> c = {1}; (to 1 = 0!). Dla i od 2 do n pomnóż ją pisemnie przez i, tak jak w zadaniu „Olbrzym razy liczba”: x = c[j] * i + p, c[j] = x % 10, p = x / 10, a na końcu dopisz cyfry przeniesienia. 1000! ma 2568 cyfr, a cała praca to kilka milionów mnożeń cyfr.`,
            tests: (r) => ['0', '1', '2', '10', '20', '21', '25', '50', '100', '170', '500', '999', '1000', ...losoweN(r, 3, 22, 1000)],
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> c = {1};
    for (int i = 2; i <= n; i++) {
        int p = 0;
        for (int j = 0; j < (int)c.size(); j++) {
            int x = c[j] * i + p;
            c[j] = x % 10;
            p = x / 10;
        }
        while (p > 0) {
            c.push_back(p % 10);
            p /= 10;
        }
    }
    for (int j = (int)c.size() - 1; j >= 0; j--) cout << c[j];
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-suma-cyfr', krok: 7, level: 'latwe',
            title: 'Suma cyfr silni',
            short: 'Policz n! cyfra po cyfrze i zsumuj cyfry. Dla 100! wychodzi 648.',
            tags: ['vector cyfr', 'suma cyfr', 'mnożenie pisemne'],
            statement: ['Wczytaj n i wypisz sumę cyfr liczby n!. Na przykład 10! = 3 628 800, a suma jego cyfr to 3 + 6 + 2 + 8 + 8 + 0 + 0 = 27.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma cyfr n!.'],
            constraints: ['0 ≤ n ≤ 1000'],
            examples: [{ input: '10' }, { input: '100' }],
            hint: R`Najpierw policz n! w vectorze cyfr, tak jak w zadaniu „Dokładna silnia”. Potem przejdź po vectorze i dodaj wszystkie cyfry — kolejność nie ma znaczenia, więc nie trzeba niczego odwracać.`,
            tests: (r) => ['0', '1', '5', '10', '24', '25', '100', '500', '999', '1000', ...losoweN(r, 4, 2, 1000)],
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000 ? null : 'n'; },
            solve: (inp) => String(String(fact(Number(inp))).split('').reduce((a, d) => a + Number(d), 0)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> c = {1};
    for (int i = 2; i <= n; i++) {
        int p = 0;
        for (int j = 0; j < (int)c.size(); j++) {
            int x = c[j] * i + p;
            c[j] = x % 10;
            p = x / 10;
        }
        while (p > 0) {
            c.push_back(p % 10);
            p /= 10;
        }
    }
    int suma = 0;
    for (int d : c) suma += d;
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-ile-razy-cyfra', krok: 7, level: 'latwe',
            title: 'Ile razy cyfra d?',
            short: 'Ile razy cyfra d występuje w zapisie n!? Zera w środku też się liczą.',
            tags: ['vector cyfr', 'licznik', 'cyfra d'],
            statement: ['Wczytaj n i cyfrę d. Wypisz, ile razy cyfra d występuje w zapisie liczby n!.'],
            input_format: ['Dwie liczby całkowite n i d.'],
            output_format: ['Jedna liczba — liczba wystąpień cyfry d.'],
            constraints: ['0 ≤ n ≤ 1000', '0 ≤ d ≤ 9'],
            examples: [{ input: '10 8', note: '10! = 3628800 — dwie ósemki.' }, { input: '10 0' }],
            hint: R`Policz n! w vectorze cyfr i przejdź po nim, licząc cyfry równe d. Uważaj tylko, żeby vector nie miał zer na końcu (czyli na początku liczby) — przy mnożeniu z przeniesieniem tak się nie stanie, bo dopisujesz tylko cyfry przeniesienia, gdy p > 0.`,
            tests: (r) => ['0 1', '0 0', '10 0', '10 8', '1000 0', '1000 9', '25 0', '100 7', ...Array.from({ length: 6 }, () => `${r.int(0, 1000)} ${r.int(0, 9)}`)],
            check: (inp) => { const [n, d] = toks(inp).map(Number); return n >= 0 && n <= 1000 && d >= 0 && d <= 9 ? null : 'zakres'; },
            solve: (inp) => { const [n, d] = toks(inp).map(Number); return String(String(fact(n)).split('').filter((c) => Number(c) === d).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, d;
    cin >> n >> d;
    vector<int> c = {1};
    for (int i = 2; i <= n; i++) {
        int p = 0;
        for (int j = 0; j < (int)c.size(); j++) {
            int x = c[j] * i + p;
            c[j] = x % 10;
            p = x / 10;
        }
        while (p > 0) {
            c.push_back(p % 10);
            p /= 10;
        }
    }
    int ile = 0;
    for (int x : c) {
        if (x == d) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-ostatnia-niezerowa', krok: 7, level: 'latwe',
            title: 'Ostatnia niezerowa cyfra',
            short: 'Pomiń zera na końcu n! i wypisz pierwszą cyfrę, która zerem nie jest.',
            tags: ['vector cyfr od końca', 'pomijanie zer', 'c[0] to cyfra jedności'],
            statement: ['Wczytaj n i wypisz ostatnią cyfrę liczby n!, która nie jest zerem. Na przykład 10! = 3 628 800 — ostatnia niezerowa cyfra to 8.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ n ≤ 1000'],
            examples: [{ input: '10' }, { input: '5' }],
            hint: R`Cyfry trzymasz od końca, więc c[0] to cyfra jedności. Idź od początku vectora i pomijaj zera — pierwsza cyfra różna od zera to szukana odpowiedź. Silnia zawsze ma jakąś niezerową cyfrę, więc pętla na pewno ją znajdzie.`,
            tests: (r) => ['0', '1', '4', '5', '10', '15', '25', '100', '999', '1000', ...losoweN(r, 5, 2, 1000)],
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp))).replace(/0+$/, '').slice(-1),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> c = {1};
    for (int i = 2; i <= n; i++) {
        int p = 0;
        for (int j = 0; j < (int)c.size(); j++) {
            int x = c[j] * i + p;
            c[j] = x % 10;
            p = x / 10;
        }
        while (p > 0) {
            c.push_back(p % 10);
            p /= 10;
        }
    }
    int j = 0;
    while (c[j] == 0) j++;
    cout << c[j] << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-suma-olbrzymow', krok: 7, level: 'srednie',
            title: 'Suma silni olbrzymów',
            short: '1! + 2! + … + n! dokładnie: mnożenie pisemne i dodawanie pisemne na zmianę.',
            tags: ['mnożenie pisemne', 'dodawanie pisemne', 'dwa vectory'],
            statement: ['Wczytaj n i wypisz dokładną wartość sumy 1! + 2! + … + n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma silni.'],
            constraints: ['1 ≤ n ≤ 500'],
            examples: [{ input: '4' }, { input: '25' }],
            hint: R`Trzymaj dwa olbrzymy w vectorach cyfr od końca: f (bieżąca silnia, start {1}) i s (suma, start {0}). W każdym obrocie pomnóż f pisemnie przez i, a potem dodaj f do s — dodawanie pisemne jak w lekcji o napisach: idź po pozycjach do długości dłuższej liczby, dodawaj cyfry i przeniesienie (brakującą cyfrę traktuj jak 0), a na końcu dopisz przeniesienie, jeśli zostało.`,
            tests: (r) => ['1', '2', '3', '4', '9', '10', '20', '25', '100', '499', '500', ...losoweN(r, 3, 26, 500)],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 500 ? null : 'n'; },
            solve: (inp) => { let s = 0n; for (let i = 1; i <= Number(inp); i++) s += fact(i); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> f = {1}, s = {0};
    for (int i = 1; i <= n; i++) {
        int p = 0;
        for (int j = 0; j < (int)f.size(); j++) {
            int x = f[j] * i + p;
            f[j] = x % 10;
            p = x / 10;
        }
        while (p > 0) {
            f.push_back(p % 10);
            p /= 10;
        }
        p = 0;
        for (int j = 0; j < (int)f.size() || p > 0; j++) {
            if (j == (int)s.size()) s.push_back(0);
            int x = s[j] + p + (j < (int)f.size() ? f[j] : 0);
            s[j] = x % 10;
            p = x / 10;
        }
    }
    for (int j = (int)s.size() - 1; j >= 0; j--) cout << s[j];
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-cyfry-log', krok: 7, level: 'srednie',
            title: 'Ile cyfr ma silnia miliona?',
            short: 'Liczba cyfr n! dla n do miliona: suma logarytmów log10(1) + … + log10(n).',
            tags: ['log10', 'floor(L) + 1', 'suma logarytmów'],
            statement: ['Wczytaj n i wypisz, ile cyfr ma liczba n!. Tym razem n sięga miliona — mnożenie pisemne trwałoby za długo.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba cyfr n!.'],
            constraints: ['0 ≤ n ≤ 1 000 000'],
            examples: [{ input: '10', note: '10! = 3 628 800 ma 7 cyfr.' }, { input: '1000000' }],
            hint: R`Liczba x ma floor(log10(x)) + 1 cyfr, a logarytm iloczynu to suma logarytmów: log10(n!) = log10(1) + log10(2) + … + log10(n). Zsumuj je w double i wypisz (long long)floor(suma) + 1. Dla n = 0 i n = 1 suma to 0, więc wynik to 1 — jedna cyfra, zgadza się.`,
            tests: (r) => ['0', '1', '2', '3', '4', '10', '20', '25', '100', '1000', '10000', '100000', '999999', '1000000', ...losoweN(r, 8, 5, 1000000)].filter((n) => P.cyfryBezpieczne(Number(n))),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000000 && P.cyfryBezpieczne(n) ? null : 'n'; },
            solve: (inp) => String(P.cyfry(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    double suma = 0;
    for (int i = 1; i <= n; i++) suma += log10(i);
    cout << (long long)floor(suma) + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-pierwsza-cyfra', krok: 7, level: 'srednie',
            title: 'Pierwsza cyfra silni',
            short: 'Część ułamkowa log10(n!) mówi, jak liczba się zaczyna: pierwsza cyfra to (int)pow(10, f).',
            tags: ['log10', 'część ułamkowa', 'pow(10, f)'],
            statement: ['Wczytaj n i wypisz pierwszą (najbardziej znaczącą) cyfrę liczby n!. Na przykład 10! = 3 628 800 zaczyna się cyfrą 3.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['4 ≤ n ≤ 1 000 000'],
            examples: [{ input: '10' }, { input: '1000000' }],
            hint: R`Policz L = log10(n!) jako sumę logarytmów, jak w poprzednim zadaniu. Część całkowita L mówi, ile cyfr ma liczba, a część ułamkowa f = L − floor(L) — jak się zaczyna: n! = 10^f · 10^floor(L), a 10^f to liczba od 1 do 10 (na przykład 3,6288 dla 10!). Pierwsza cyfra to więc (int)pow(10, f).`,
            tests: (r) => ['4', '5', '8', '10', '20', '25', '100', '1000', '12345', '100000', '999999', '1000000', ...losoweN(r, 12, 4, 1000000)].filter((n) => P.pierwszeBezpieczne(Number(n), 1)),
            check: (inp) => { const n = Number(inp); return n >= 4 && n <= 1000000 && P.pierwszeBezpieczne(n, 1) ? null : 'n'; },
            solve: (inp) => String(P.pierwszeCyfry(Number(inp), 1)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    double L = 0;
    for (int i = 1; i <= n; i++) L += log10(i);
    double f = L - floor(L);
    cout << (int)pow(10, f) << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · liczenie sposobów
        {
            id: 'sil-podium', krok: 8, level: 'latwe',
            title: 'Podium',
            short: 'Na ile sposobów może wyglądać podium z k miejscami? n · (n − 1) · … — k czynników.',
            tags: ['n · (n − 1) · …', 'k czynników', 'n! / (n − k)!'],
            statement: ['W biegu startuje n zawodników. Na ile sposobów może wyglądać podium z k miejscami (pierwsze, drugie, …, k-te)? Dwa podia są różne, jeśli na którymś miejscu stoi ktoś inny.'],
            input_format: ['Dwie liczby całkowite n i k.'],
            output_format: ['Jedna liczba — liczba możliwych podiów.'],
            constraints: ['1 ≤ k ≤ n ≤ 1 000 000', 'wynik jest nie większy niż 9 · 10¹⁸ (mieści się w long long)'],
            examples: [{ input: '8 3', note: 'Złoto: 8 możliwości, srebro: 7, brąz: 6 — razem 8 · 7 · 6 = 336.' }, { input: '5 5', note: 'Gdy k = n, to po prostu n! = 120.' }],
            hint: R`Na pierwsze miejsce: n możliwości, na drugie: n − 1 (zwycięzca już stoi), …, na k-te: n − k + 1. Pomnóż te k liczb — pętla od n w dół, wykonana k razy. To silnia, która zatrzymuje się w połowie: n! / (n − k)!, ale silni nie licz — n! dla dużego n się nie zmieści.`,
            tests: (r) => {
                const out = ['1 1', '20 20', '1000000 1', '1000000 3', '8 3', '5 5', '100 9', '60 10'];
                for (let i = 0; i < 6; i++) { const n = r.pick([r.int(1, 20), r.int(1, 1000), r.int(1, 1000000)]); let k = 1; while (k < n && P.iloczyn(n - k, n) <= 9n * E18 && r() < 0.8) k++; out.push(`${n} ${k}`); }
                return out;
            },
            check: (inp) => { const [n, k] = toks(inp).map(Number); return k >= 1 && k <= n && n <= 1000000 && P.iloczyn(n - k + 1, n) <= 9n * E18 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(Number); return String(P.iloczyn(n - k + 1, n)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long w = 1;
    for (long long i = n; i > n - k; i--) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-kody', krok: 8, level: 'latwe',
            title: 'Kody z różnych cyfr',
            short: 'Ile jest k-cyfrowych kodów — wszystkich i takich bez powtórzeń cyfr?',
            tags: ['10 · 10 · …', '10 · 9 · 8 · …', 'k > 10 → 0'],
            statement: ['Kod do sejfu składa się z k cyfr od 0 do 9 (może zaczynać się od zera). Wypisz dwie liczby: ile jest wszystkich takich kodów oraz ile jest kodów, w których żadna cyfra się nie powtarza.'],
            input_format: ['Jedna liczba całkowita k.'],
            output_format: ['Jeden wiersz: dwie liczby oddzielone spacją.'],
            constraints: ['1 ≤ k ≤ 18'],
            examples: [{ input: '3', note: 'Wszystkich: 10 · 10 · 10 = 1000. Bez powtórzeń: 10 · 9 · 8 = 720.' }, { input: '11', note: 'Różnych cyfr jest tylko 10 — kodu z 11 różnych cyfr nie ma.' }],
            hint: R`Wszystkie kody: na każdej z k pozycji 10 możliwości, więc 10 · 10 · … · 10 = 10^k (pętla mnożąca k razy przez 10, wynik w long long). Bez powtórzeń: 10 · 9 · 8 · … — k czynników, jak przy podium. Gdy k > 10, któryś czynnik byłby zerem — i dobrze, bo takich kodów nie ma.`,
            tests: () => zakresy(1, 18),
            check: (inp) => { const k = Number(inp); return k >= 1 && k <= 18 ? null : 'k'; },
            solve: (inp) => { const k = Number(inp); let a = 1n, b = 1n; for (let i = 0; i < k; i++) { a *= 10n; b *= B(Math.max(0, 10 - i)); } return `${a} ${b}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    long long wszystkie = 1, rozne = 1;
    for (int i = 0; i < k; i++) {
        wszystkie *= 10;
        rozne *= max(0, 10 - i);
    }
    cout << wszystkie << " " << rozne << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-usciski', krok: 8, level: 'latwe',
            title: 'Uściski dłoni',
            short: 'Każdy z każdym jeden uścisk: n · (n − 1) / 2 — dzielimy przez 2, bo para to para.',
            tags: ['n · (n − 1) / 2', 'C(n, 2)', 'long long'],
            statement: ['Na spotkanie przyszło n osób i każdy przywitał się z każdym dokładnie jednym uściskiem dłoni. Ile było uścisków?'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba uścisków.'],
            constraints: ['1 ≤ n ≤ 2 000 000 000'],
            examples: [{ input: '4', note: 'Osoby A, B, C, D: AB, AC, AD, BC, BD, CD — sześć uścisków.' }, { input: '1' }],
            hint: R`Każda z n osób ściska dłoń n − 1 pozostałym, ale wtedy każdy uścisk policzyliśmy dwa razy (raz jako A z B, raz jako B z A). Wynik: n · (n − 1) / 2. Dla n do dwóch miliardów iloczyn sięga 4 · 10¹⁸ — wczytaj n do long long, żeby mnożenie odbyło się na long long.`,
            tests: (r) => ['1', '2', '3', '4', '2000000000', '1999999999', '65536', '100000', ...losoweN(r, 4, 1, 2000000000)],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 2e9 ? null : 'n'; },
            solve: (inp) => { const n = B(inp); return String((n * (n - 1n)) / 2n); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << n * (n - 1) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-dwumian', krok: 8, level: 'srednie',
            title: 'Symbol Newtona',
            short: 'C(n, k) dla n do 60 — bez silni: c = c * (n - k + i) / i krok po kroku.',
            tags: ['C(n, k)', 'c * (n - k + i) / i', 'bez przepełnienia'],
            statement: ['Wczytaj n i k i wypisz, na ile sposobów można wybrać k osób spośród n osób, gdy kolejność wyboru się nie liczy. To symbol Newtona C(n, k) = n! / (k! · (n − k)!).'],
            input_format: ['Dwie liczby całkowite n i k.'],
            output_format: ['Jedna liczba — C(n, k).'],
            constraints: ['0 ≤ k ≤ n ≤ 60'],
            examples: [{ input: '5 2', note: 'Pary z pięciu osób: 5 · 4 / 2 = 10.' }, { input: '49 6', note: 'Tyle jest możliwych zakładów w Lotto.' }, { input: '60 30' }],
            hint: R`Nie licz silni — 60! nie zmieści się w żadnym typie. Licz krok po kroku: c = 1; dla i od 1 do k: c = c * (n - k + i) / i. Po każdym kroku c jest liczbą całkowitą (to C(n − k + i, i)), więc dzielenie nie gubi reszty. Najpierw mnóż, potem dziel — odwrotna kolejność zgubiłaby resztę. Wynik w long long.`,
            tests: (r) => ['0 0', '1 0', '1 1', '5 2', '49 6', '60 30', '60 0', '60 60', '60 1', '60 59', '59 29', '20 10', ...Array.from({ length: 6 }, () => { const n = r.int(0, 60); return `${n} ${r.int(0, n)}`; })],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return k >= 0 && k <= n && n <= 60 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(Number); return String(C(n, k)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long c = 1;
    for (long long i = 1; i <= k; i++) c = c * (n - k + i) / i;
    cout << c << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-pascal', krok: 8, level: 'latwe',
            title: 'Trójkąt Pascala',
            short: 'Wypisz n wierszy trójkąta — każda liczba to suma dwóch nad nią.',
            tags: ['tablica 2D', 't[i][j] = t[i-1][j-1] + t[i-1][j]', 'brzegi to 1'],
            statement: ['Wypisz n pierwszych wierszy trójkąta Pascala. Wiersz numer i (licząc od 0) zawiera i + 1 liczb: C(i, 0), C(i, 1), …, C(i, i). Na brzegach trójkąta stoją jedynki, a każda liczba w środku to suma dwóch liczb stojących nad nią.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy — w wierszu numer i liczby C(i, 0), …, C(i, i) oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 30'],
            examples: [{ input: '5' }],
            hint: R`Tablica dwuwymiarowa int t[30][30]. Dla każdego wiersza i: t[i][0] = t[i][i] = 1, a dla j od 1 do i − 1: t[i][j] = t[i - 1][j - 1] + t[i - 1][j]. Od razu wypisuj wiersz. Największa liczba to C(29, 14) = 77 558 760 — int wystarczy.`,
            tests: () => ['1', '2', '3', '5', '10', '17', '29', '30'],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 30 ? null : 'n'; },
            solve: (inp) => Array.from({ length: Number(inp) }, (_, i) => Array.from({ length: i + 1 }, (_, j) => String(C(i, j))).join(' ')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int t[30][30];
    for (int i = 0; i < n; i++) {
        t[i][0] = t[i][i] = 1;
        for (int j = 1; j < i; j++) t[i][j] = t[i - 1][j - 1] + t[i - 1][j];
        for (int j = 0; j <= i; j++) {
            if (j > 0) cout << " ";
            cout << t[i][j];
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-anagramy', krok: 8, level: 'srednie',
            title: 'Ile anagramów?',
            short: 'MAMA ma 6 anagramów: n! podzielone przez silnie liczników powtórzonych liter.',
            tags: ['liczniki liter', 'n! / (a! · b! · …)', 'long long'],
            statement: ['Wczytaj słowo i wypisz, na ile różnych sposobów można ustawić jego litery — czyli ile różnych słów (anagramów) da się z nich ułożyć, licząc także samo słowo. Na przykład z liter słowa mama da się ułożyć 6 słów: aamm, amam, amma, maam, mama i mmaa.'],
            input_format: ['Jedno słowo z małych liter alfabetu angielskiego.'],
            output_format: ['Jedna liczba — liczba różnych anagramów.'],
            constraints: ['1 ≤ długość słowa ≤ 20'],
            examples: [{ input: 'mama' }, { input: 'kot' }, { input: 'aaaa' }],
            hint: R`Gdyby wszystkie litery były różne, ustawień byłoby n!. Ale zamiana miejscami dwóch takich samych liter nie daje nowego słowa — każde słowo policzyliśmy tyle razy, na ile sposobów da się poprzestawiać jednakowe litery między sobą. Dlatego n! dzielimy przez silnię liczby wystąpień każdej litery: n! / (a! · b! · …). Liczniki liter trzymaj w tablicy 26 liczb (lekcja o napisach). 20! mieści się w long long, a każde dzielenie wychodzi bez reszty.`,
            tests: (r) => ['a', 'ab', 'mama', 'kot', 'aaaa', 'abcdefghijklmnopqrst', 'aaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaabbbbbbbbbb', 'mississippi', 'abracadabra', 'zzzzzzzzzzzzzzzzzzzy',
                ...Array.from({ length: 6 }, () => r.word(r.int(1, 20), r.pick(['ab', 'abc', 'abcdef', 'abcdefghijklmnopqrstuvwxyz'])))],
            check: (inp) => (/^[a-z]{1,20}$/.test(inp) ? null : 'słowo'),
            solve: (inp) => { const cnt = {}; for (const c of inp) cnt[c] = (cnt[c] || 0) + 1; let w = fact(inp.length); for (const v of Object.values(cnt)) w /= fact(v); return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int ile[26] = {0};
    for (char c : s) ile[c - 'a']++;
    long long w = f[s.size()];
    for (int i = 0; i < 26; i++) w /= f[ile[i]];
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-sciezki', krok: 8, level: 'srednie',
            title: 'Trasy przez przystanek',
            short: 'Trasy na kratce w prawo i w górę przez punkt (x, y): iloczyn dwóch symboli Newtona.',
            tags: ['C(a + b, a)', 'dwa odcinki trasy', 'mnożymy możliwości'],
            statement: ['Na kratkowanej mapie idziesz z punktu (0, 0) do punktu (a, b), robiąc kroki o jedną kratkę w prawo (x rośnie o 1) albo w górę (y rośnie o 1). Każda trasa to a kroków w prawo i b kroków w górę ustawionych w jakiejś kolejności, więc wszystkich tras jest C(a + b, a) — wybieramy, które z a + b kroków idą w prawo.', 'Ile tras przechodzi przez przystanek w punkcie (x, y)?'],
            input_format: ['Cztery liczby całkowite a, b, x i y.'],
            output_format: ['Jedna liczba — liczba tras przechodzących przez (x, y).'],
            constraints: ['0 ≤ x ≤ a', '0 ≤ y ≤ b', 'a + b ≤ 60'],
            examples: [{ input: '2 2 1 1', note: 'Do (1, 1) prowadzą 2 trasy i z (1, 1) do (2, 2) też 2 — razem 4 z wszystkich 6 tras.' }, { input: '3 2 0 0' }],
            hint: R`Trasa przez przystanek to trasa z (0, 0) do (x, y), a potem z (x, y) do (a, b). Pierwszą część wybierasz na C(x + y, x) sposobów, drugą — na C((a − x) + (b − y), a − x). Każda pierwsza część pasuje do każdej drugiej, więc mnożymy. Symbol Newtona licz pętlą c = c * (n - k + i) / i — napisz ją dwa razy albo w pętli po dwóch odcinkach.`,
            tests: (r) => ['0 0 0 0', '2 2 1 1', '3 2 0 0', '30 30 15 15', '60 0 30 0', '0 60 0 60', '30 30 0 30', '30 30 30 0', '31 29 10 20',
                ...Array.from({ length: 6 }, () => { const a = r.int(0, 60); const b = r.int(0, 60 - a); return `${a} ${b} ${r.int(0, a)} ${r.int(0, b)}`; })],
            check: (inp) => { const [a, b, x, y] = toks(inp).map(Number); return a >= 0 && b >= 0 && a + b <= 60 && x >= 0 && x <= a && y >= 0 && y <= b ? null : 'zakres'; },
            solve: (inp) => { const [a, b, x, y] = toks(inp).map(Number); return String(C(x + y, x) * C(a - x + b - y, a - x)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b, x, y;
    cin >> a >> b >> x >> y;
    long long c1 = 1, c2 = 1;
    for (long long i = 1; i <= x; i++) c1 = c1 * (y + i) / i;
    for (long long i = 1; i <= a - x; i++) c2 = c2 * (b - y + i) / i;
    cout << c1 * c2 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-dwumian-mod', krok: 8, level: 'srednie',
            title: 'Dwumian modulo',
            short: 'C(n, k) mod 10⁹ + 7 dla n do 2000. Reszt nie dzielimy — trójkąt Pascala tylko dodaje.',
            tags: ['trójkąt Pascala', '% MOD przy dodawaniu', 'tablica poza main'],
            statement: ['Wczytaj q par liczb n i k. Dla każdej pary wypisz w osobnym wierszu resztę z dzielenia C(n, k) przez 1 000 000 007.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W kolejnych q wierszach po dwie liczby: n i k.'],
            output_format: ['q wierszy — w każdym C(n, k) mod 10⁹ + 7.'],
            constraints: ['1 ≤ q ≤ 2000', '0 ≤ k ≤ n ≤ 2000'],
            examples: [{ input: '3\n5 2\n60 30\n2000 1000' }],
            hint: R`Wzoru z silniami tu nie użyjesz: C(2000, 1000) ma ponad 600 cyfr, a reszt nie wolno dzielić. Trójkąt Pascala używa za to tylko dodawania, a dodawać modulo wolno: t[i][j] = (t[i - 1][j - 1] + t[i - 1][j]) % MOD. Policz raz całą tablicę 2001 × 2001 (int wystarczy: suma dwóch reszt to najwyżej około 2 · 10⁹) i zadeklaruj ją poza main — ma 16 MB.`,
            tests: (r) => ['1\n0 0', '1\n2000 1000', '1\n2000 0', '3\n5 2\n60 30\n2000 1000',
                `2000\n${Array.from({ length: 2000 }, () => { const n = r.pick([r.int(0, 60), r.int(0, 2000), 2000]); return `${n} ${r.int(0, n)}`; }).join('\n')}`],
            check: (inp) => { const t = toks(inp).map(Number); const q = t[0]; if (t.length !== 1 + 2 * q || q > 2000) return 'liczba'; for (let i = 0; i < q; i++) { const n = t[1 + 2 * i], k = t[2 + 2 * i]; if (!(k >= 0 && k <= n && n <= 2000)) return 'zakres'; } return null; },
            solve: (inp) => { const t = toks(inp).map(Number); const out = []; for (let i = 0; i < t[0]; i++) out.push(String(C(t[1 + 2 * i], t[2 + 2 * i]) % MOD)); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int MOD = 1000000007;
int t[2001][2001];
int main() {
    for (int i = 0; i <= 2000; i++) {
        t[i][0] = t[i][i] = 1;
        for (int j = 1; j < i; j++) t[i][j] = (t[i - 1][j - 1] + t[i - 1][j]) % MOD;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n, m;
        cin >> n >> m;
        cout << t[n][m] << "\n";
    }
    return 0;
}`,
        },
    ];
};
