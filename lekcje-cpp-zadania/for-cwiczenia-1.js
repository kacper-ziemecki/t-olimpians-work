// For loop — ćwiczenia w trakcie lekcji, części 1–4: pierwsza pętla for, zakresy i kroki, for i dane wejściowe,
// for kontra while (break, continue, pętla bez końca). Uczeń zna typy, wejście i wyjście, if / else i pętlę while.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki (zadania.html).
module.exports = (h) => {
    const { nums, toks, lines, join, fx, safe } = h;
    const R = String.raw;
    const range = (a, b, k = 1) => { const o = []; if (k > 0) for (let x = a; x <= b; x += k) o.push(x); else for (let x = a; x >= b; x += k) o.push(x); return o; };
    const lista = (n, lo, hi, r) => `${n}\n${r.arr(n, lo, hi).join(' ')}`;
    const pierwsza = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
    const IMIONA = ['Ala', 'Ola', 'Kuba', 'Zosia', 'Antek', 'Igor', 'Maja', 'Lena', 'Franek', 'Hania', 'Tymek', 'Julia', 'Staś', 'Nina'].map((s) => s.replace('ś', 's'));

    return [
        // ================================================================ KROK 1 · pierwsza pętla for
        {
            id: 'for-od-1-do-n', krok: 1, level: 'latwe',
            title: 'Od 1 do n — pętlą for',
            short: 'Pierwsza pętla for: wypisz liczby od 1 do n w jednym wierszu.',
            tags: ['for', 'i++'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n i wypisz w jednym wierszu wszystkie liczby od 1 do n, oddzielone spacjami. Użyj pętli for.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz: 1 2 3 … n.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '5' }, { input: '1' }],
            hint: R`Cała pętla mieści się w jednej linijce: for (int i = 1; i <= n; i++) { cout << i << " "; }. Start, warunek i zmiana stoją w nawiasie, oddzielone średnikami. Spacja na końcu wiersza nie przeszkadza.`,
            tests: (r) => ['5', '1', '2', '1000', '999', String(r.int(3, 500))],
            solve: (inp) => range(1, nums(inp)[0]).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-slowo-n-razy', krok: 1, level: 'latwe',
            title: 'Echo',
            short: 'Wypisz podane słowo n razy w jednym wierszu.',
            tags: ['for', 'powtórz n razy', 'string'],
            statement: ['Wczytaj liczbę n i słowo, a potem wypisz to słowo n razy w jednym wierszu, oddzielając powtórzenia spacjami.'],
            input_format: ['Jeden wiersz: liczba n i słowo (bez spacji w środku).'],
            output_format: ['Jeden wiersz z n powtórzeniami słowa.'],
            constraints: ['1 ≤ n ≤ 100', 'słowo ma od 1 do 20 znaków'],
            examples: [{ input: '3 hej' }, { input: '1 Olimpiada' }],
            hint: R`Pętla, która wykonuje się n razy: for (int i = 0; i < n; i++). Licznik i nie jest tu wypisywany — tylko liczy obroty. W ciele: cout << slowo << " ";.`,
            tests: (r) => ['3 hej', '1 Olimpiada', '100 a', '2 C++', `${r.int(4, 99)} ${r.word(r.int(1, 20))}`, `${r.int(2, 9)} ${r.word(5, 'xyz019')}`],
            solve: (inp) => { const [n, w] = toks(inp); return Array(Number(n)).fill(w).join(' '); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    string slowo;
    cin >> n >> slowo;
    for (int i = 0; i < n; i++) {
        cout << slowo << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-odliczanie', krok: 1, level: 'latwe',
            title: 'Odliczanie pętlą for',
            short: 'Wypisz liczby od n w dół do 1, każdą w osobnym wierszu, a na końcu Start!',
            tags: ['for', 'i--'],
            statement: ['Wczytaj n i wypisz liczby od n do 1 (malejąco), każdą w osobnym wierszu. W ostatnim wierszu wypisz Start!'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n + 1 wierszy.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '3' }],
            hint: R`Licznik startuje od n i maleje: for (int i = n; i >= 1; i--). Napis Start! wypisz już po pętli — za jej klamrami.`,
            tests: (r) => ['3', '1', '2', '1000', String(r.int(4, 999))],
            solve: (inp) => join(range(nums(inp)[0], 1, -1).map(String), 'Start!'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = n; i >= 1; i--) {
        cout << i << "\n";
    }
    cout << "Start!\n";
    return 0;
}`,
        },
        {
            id: 'for-ciag-3i1', krok: 1, level: 'latwe',
            title: 'Wyrazy ciągu 3i + 1',
            short: 'Dla i od 0 do n − 1 wypisz 3 · i + 1 — licznik pętli w obliczeniach.',
            tags: ['for', 'licznik w wyrażeniu'],
            statement: ['Wczytaj n i wypisz w jednym wierszu n liczb: wartości wyrażenia 3 · i + 1 dla i = 0, 1, 2, …, n − 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z n liczbami.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '5' }],
            hint: R`Pętla od 0 do n − 1: for (int i = 0; i < n; i++), a w środku wypisz 3 * i + 1. Licznik pętli to zwykła zmienna — możesz go używać w działaniach.`,
            tests: (r) => ['5', '1', '2', '1000', String(r.int(3, 999))],
            solve: (inp) => Array.from({ length: nums(inp)[0] }, (_, i) => 3 * i + 1).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cout << 3 * i + 1 << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-kwadraty-liczb', krok: 1, level: 'latwe',
            title: 'Kwadraty po kolei',
            short: 'Wypisz 1, 4, 9, 16, … — kwadraty liczb od 1 do n.',
            tags: ['for', 'i * i'],
            statement: ['Wczytaj n i wypisz w jednym wierszu kwadraty kolejnych liczb od 1 do n: 1, 4, 9, …, n · n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z n liczbami.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '6' }],
            hint: R`for (int i = 1; i <= n; i++) { cout << i * i << " "; }. Największy kwadrat to 1000 · 1000 = milion — mieści się w int.`,
            tests: (r) => ['6', '1', '1000', String(r.int(2, 999))],
            solve: (inp) => range(1, nums(inp)[0]).map((i) => i * i).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << i * i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-przepisz-while', krok: 1, level: 'latwe',
            title: 'Przepisz while na for',
            short: 'Dostajesz działającą pętlę while — zapisz ją jako for, z identycznym wynikiem.',
            tags: ['for', 'while → for'],
            statement: [
                'Ten program działa poprawnie: int n; cin >> n; int i = 2; while (i <= n) { cout << i << " "; i += 3; }',
                'Napisz program, który dla każdego n wypisuje dokładnie to samo, ale zamiast while używa pętli for — start, warunek i zmiana mają się znaleźć w jednym nawiasie.',
            ],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz — to samo, co wypisuje program z treści.'],
            constraints: ['2 ≤ n ≤ 10 000'],
            examples: [{ input: '10' }, { input: '2' }],
            hint: R`Start (int i = 2) idzie na początek nawiasu, warunek (i <= n) do środka, a zmiana (i += 3) na koniec: for (int i = 2; i <= n; i += 3). Ciało pętli zawiera już tylko cout.`,
            tests: (r) => ['10', '2', '4', '5', '10000', '9998', String(r.int(6, 9000))],
            solve: (inp) => range(2, nums(inp)[0], 3).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 2; i <= n; i += 3) {
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-suma-odwrotnosci', krok: 1, level: 'srednie',
            title: 'Suma odwrotności',
            short: 'Policz 1 + 1/2 + 1/3 + … + 1/n z czterema miejscami po przecinku.',
            tags: ['for', 'suma double', '1.0 / i', 'setprecision'],
            statement: ['Wczytaj n i wypisz sumę 1 + 1/2 + 1/3 + … + 1/n, zaokrągloną do czterech miejsc po przecinku.', 'Ta suma rośnie bardzo powoli — ale bez końca: dla odpowiednio dużego n przekroczy każdą liczbę.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba z dokładnie czterema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1 000 000'],
            examples: [{ input: '4', note: '1 + 0,5 + 0,3333… + 0,25 = 2,0833…' }, { input: '1' }],
            hint: R`Suma musi być typu double, a dodawać trzeba 1.0 / i — samo 1 / i to dzielenie całkowite, które dla i ≥ 2 daje 0. Wypisz przez cout << fixed << setprecision(4) << suma.`,
            tests: (r) => {
                const out = ['4', '1', '2', '10', '1000000'];
                while (out.length < 10) { const n = r.int(3, 1e6); let s = 0; for (let i = 1; i <= n; i++) s += 1.0 / i; if (safe(s, 4)) out.push(String(n)); }
                return out;
            },
            check: (inp) => { const n = nums(inp)[0]; let s = 0; for (let i = 1; i <= n; i++) s += 1.0 / i; return safe(s, 4) ? null : 'połówka'; },
            solve: (inp) => { const n = nums(inp)[0]; let s = 0; for (let i = 1; i <= n; i++) s += 1.0 / i; return fx(s, 4); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    double suma = 0;
    for (int i = 1; i <= n; i++) {
        suma += 1.0 / i;
    }
    cout << fixed << setprecision(4) << suma << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · zakresy i kroki
        {
            id: 'for-od-b-do-a', krok: 2, level: 'latwe',
            title: 'Z góry na dół',
            short: 'Wypisz wszystkie liczby od b w dół do a — także ujemne.',
            tags: ['for', 'i--', 'zakres'],
            statement: ['Wczytaj dwie liczby całkowite a ≤ b i wypisz w jednym wierszu wszystkie liczby całkowite od b do a (malejąco), oddzielone spacjami.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jeden wiersz z liczbami od b do a.'],
            constraints: ['−1000 ≤ a ≤ b ≤ 1000'],
            examples: [{ input: '3 7' }, { input: '-2 1' }],
            hint: R`for (int i = b; i >= a; i--). Warunek >= sprawia, że a też zostanie wypisane. Dla a = b pętla wykona się dokładnie raz.`,
            tests: (r) => ['3 7', '-2 1', '5 5', '-1000 1000', '-10 -4', `${r.int(-900, 0)} ${r.int(0, 900)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); return range(b, a, -1).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    for (int i = b; i >= a; i--) {
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-co-k', krok: 2, level: 'latwe',
            title: 'Od a do b co k',
            short: 'Wypisz a, a + k, a + 2k, … — dopóki liczba nie przekroczy b.',
            tags: ['for', 'i += k'],
            statement: ['Wczytaj a, b i k. Wypisz w jednym wierszu liczby a, a + k, a + 2k, … — wszystkie, które nie są większe od b.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Jeden wiersz z liczbami oddzielonymi spacjami.'],
            constraints: ['−2000 ≤ a ≤ b ≤ 2000', '1 ≤ k ≤ 4000'],
            examples: [{ input: '1 20 4' }, { input: '-5 5 5' }],
            hint: R`Zmiana w nawiasie for nie musi być i++: for (int i = a; i <= b; i += k). Pierwsza liczba, a, wypisze się zawsze, bo a ≤ b.`,
            tests: (r) => ['1 20 4', '-5 5 5', '7 7 3', '0 2000 1', '-2000 2000 1', '-2000 2000 4000', '-2000 2000 7', `${r.int(-2000, 0)} ${r.int(0, 2000)} ${r.int(2, 300)}`],
            check: (inp) => { const [a, b, k] = nums(inp); return a > b ? 'a > b' : a < -2000 || b > 2000 || k < 1 || k > 4000 ? 'a, b albo k poza zakresem' : null; },
            solve: (inp) => { const [a, b, k] = nums(inp); return range(a, b, k).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, k;
    cin >> a >> b >> k;
    for (int i = a; i <= b; i += k) {
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-dwa-liczniki', krok: 2, level: 'latwe',
            title: 'Dwa liczniki naraz',
            short: 'Jeden licznik rośnie od 1, drugi maleje od n — oba w jednym nawiasie for.',
            tags: ['for', 'dwie zmienne', 'przecinek'],
            statement: ['Wczytaj n i wypisz n wierszy. W pierwszym wierszu są liczby 1 i n, w drugim 2 i n − 1, w trzecim 3 i n − 2, i tak dalej — w ostatnim n i 1. Liczby w wierszu oddziel spacją.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy po dwie liczby.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '4' }],
            hint: R`W nawiasie for możesz mieć dwie zmienne naraz, oddzielone przecinkami: for (int i = 1, j = n; i <= n; i++, j--). W każdym obrocie i rośnie, a j maleje.`,
            tests: (r) => ['4', '1', '2', '1000', String(r.int(3, 999))],
            solve: (inp) => { const n = nums(inp)[0]; return range(1, n).map((i) => `${i} ${n + 1 - i}`).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1, j = n; i <= n; i++, j--) {
        cout << i << " " << j << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-tabela-funkcji', krok: 2, level: 'latwe',
            title: 'Tabela wartości funkcji',
            short: 'Dla każdego x od a do b policz x² − 5x + 6 i policz miejsca zerowe.',
            tags: ['for', 'licznik w wyrażeniu', 'licznik warunkowy'],
            statement: ['Wczytaj a i b. Dla każdego całkowitego x od a do b wypisz w osobnym wierszu x i wartość f(x) = x² − 5x + 6, oddzielone spacją.', 'W ostatnim wierszu wypisz miejsca zerowe: k, gdzie k to liczba tych x, dla których f(x) = 0.'],
            input_format: ['Jeden wiersz z liczbami a i b, a ≤ b.'],
            output_format: ['b − a + 2 wierszy, jak w przykładzie.'],
            constraints: ['−1000 ≤ a ≤ b ≤ 1000'],
            examples: [{ input: '0 4' }],
            hint: R`Pętla for (int x = a; x <= b; x++), a w niej: int f = x * x - 5 * x + 6; wypisz x i f; if (f == 0) zera++;. Licznik zer utwórz przed pętlą, a wypisz po niej.`,
            tests: (r) => ['0 4', '2 2', '-1000 1000', '5 10', `${r.int(-50, 0)} ${r.int(0, 50)}`, `${r.int(-1000, -900)} ${r.int(-800, -700)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let z = 0; const o = range(a, b).map((x) => { const f = x * x - 5 * x + 6; if (f === 0) z++; return `${x} ${f}`; }); return join(o, `miejsca zerowe: ${z}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int zera = 0;
    for (int x = a; x <= b; x++) {
        int f = x * x - 5 * x + 6;
        cout << x << " " << f << "\n";
        if (f == 0) {
            zera++;
        }
    }
    cout << "miejsca zerowe: " << zera << "\n";
    return 0;
}`,
        },
        {
            id: 'for-potegi-k', krok: 2, level: 'latwe',
            title: 'Potęgi liczby k',
            short: 'Wypisz 1, k, k², k³, … — wszystkie potęgi k nie większe od n.',
            tags: ['for', 'p *= k', 'long long'],
            statement: ['Wczytaj k i n i wypisz w jednym wierszu wszystkie potęgi liczby k (zaczynając od k⁰ = 1), które nie są większe od n.'],
            input_format: ['Jeden wiersz z liczbami k i n.'],
            output_format: ['Jeden wiersz z potęgami k.'],
            constraints: ['2 ≤ k ≤ 10', '1 ≤ n ≤ 10¹⁷'],
            examples: [{ input: '3 100' }, { input: '10 1000' }],
            hint: R`for (long long p = 1; p <= n; p *= k). Licznik nie musi być typu int ani rosnąć o 1 — tu jest long long i mnoży się przez k.`,
            tests: (r) => ['3 100', '10 1000', '2 1', '10 100000000000000000', '2 100000000000000000', '7 99999999999999999', `${r.int(2, 10)} ${r.int(1, 1e9)}`, `${r.int(2, 10)} ${String(r.big(1e12, 1e17))}`],
            solve: (inp) => { const [k, n] = toks(inp).map(BigInt); const o = []; for (let p = 1n; p <= n; p *= k) o.push(p); return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long k, n;
    cin >> k >> n;
    for (long long p = 1; p <= n; p *= k) {
        cout << p << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-miedzy', krok: 2, level: 'srednie',
            title: 'Liczby pomiędzy',
            short: 'Wypisz liczby leżące ściśle między a i b — albo BRAK, gdy takich nie ma.',
            tags: ['for', 'pusty zakres', 'if przed pętlą'],
            statement: ['Wczytaj dwie liczby całkowite a i b (w dowolnej kolejności, mogą być równe). Wypisz rosnąco, w jednym wierszu, wszystkie liczby całkowite leżące ściśle między nimi — bez samych a i b. Jeśli takich liczb nie ma, wypisz BRAK.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jeden wiersz z liczbami albo słowo BRAK.'],
            constraints: ['−1000 ≤ a, b ≤ 1000'],
            examples: [{ input: '3 7' }, { input: '9 4' }, { input: '5 6' }],
            hint: R`Najpierw ustal mniejszą i większą liczbę (zamiana miejscami z lekcji o if). Liczby pomiędzy to od mn + 1 do wi − 1. Gdy wi − mn < 2, ten zakres jest pusty — wtedy wypisz BRAK.`,
            tests: (r) => ['3 7', '9 4', '5 6', '6 5', '4 4', '-1000 1000', '1000 -1000', '-3 -1', `${r.int(-100, 100)} ${r.int(-100, 100)}`],
            solve: (inp) => { const [a, b] = nums(inp); const lo = Math.min(a, b), hi = Math.max(a, b); return hi - lo < 2 ? 'BRAK' : range(lo + 1, hi - 1).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a > b) {
        int t = a;
        a = b;
        b = t;
    }
    if (b - a < 2) {
        cout << "BRAK\n";
    } else {
        for (int i = a + 1; i < b; i++) {
            cout << i << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-wielokrotnosci', krok: 2, level: 'srednie',
            title: 'Wielokrotności w przedziale',
            short: 'Znajdź pierwszą wielokrotność k od a i skacz co k — sprawdzanie każdej liczby będzie za wolne.',
            tags: ['for', 'i += k', 'pierwsza wielokrotność'],
            statement: ['Wczytaj a, b i k. Wypisz rosnąco w jednym wierszu wszystkie liczby z przedziału od a do b (włącznie), które dzielą się przez k. Jeśli takich liczb nie ma, wypisz BRAK.', 'Uwaga: przedział może mieć miliard liczb, ale wielokrotności k jest w nim najwyżej 1000. Sprawdzanie liczb po kolei będzie za wolne — skacz od razu co k.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Jeden wiersz z liczbami albo słowo BRAK.'],
            constraints: ['1 ≤ a ≤ b ≤ 10⁹', '1 ≤ k ≤ 10⁹', 'w przedziale jest co najwyżej 1000 wielokrotności k'],
            examples: [{ input: '10 40 7' }, { input: '8 9 5' }],
            hint: R`Pierwsza wielokrotność k, która nie jest mniejsza od a, to (a + k - 1) / k * k — dzielenie całkowite zaokrągla w górę, a mnożenie wraca do wielokrotności. Od niej: for (long long x = start; x <= b; x += k). Licz w long long, bo start może trochę przekroczyć zakres int.`,
            tests: (r) => {
                const out = ['10 40 7', '8 9 5', '1 1 1', '5 5 5', '1 1000 1', '1 1000000000 1000000', '999999999 1000000000 1000000000', '1000000000 1000000000 999999999'];
                for (let t = 0; t < 4; t++) { const k = r.int(1e6, 1e9); const a = r.int(1, 1e9); const b = Math.min(1e9, a + r.int(0, 999) * k); out.push(`${a} ${Math.max(a, b)} ${k}`); }
                return out;
            },
            check: (inp) => { const [a, b, k] = nums(inp); return a <= b && Math.floor(b / k) - Math.floor((a - 1) / k) <= 1000 ? null : 'za dużo wielokrotności'; },
            solve: (inp) => { const [a, b, k] = nums(inp); const s = Math.ceil(a / k) * k; const o = []; for (let x = s; x <= b; x += k) o.push(x); return o.length ? o.join(' ') : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, k;
    cin >> a >> b >> k;
    long long start = (a + k - 1) / k * k;
    if (start > b) {
        cout << "BRAK\n";
    } else {
        for (long long x = start; x <= b; x += k) {
            cout << x << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-ile-obrotow', krok: 2, level: 'srednie',
            title: 'Ile razy obróci się pętla?',
            short: 'Policz obroty pętli for wzorem — dla liczb rzędu 10¹⁸ symulacja nie zdąży.',
            tags: ['liczba obrotów', 'pusty zakres', 'long long'],
            statement: [
                'Ile razy wykona się ciało tej pętli: for (long long i = a; i <= b; i += k) { … } ?',
                'Wczytaj a, b i k i wypisz tę liczbę. Liczby mogą być ogromne, więc uruchomienie pętli i liczenie obrotów nie zdąży — trzeba policzyć wynik jednym wzorem.',
            ],
            input_format: ['Jeden wiersz z liczbami całkowitymi a, b i k.'],
            output_format: ['Jedna liczba — liczba obrotów (może być 0).'],
            constraints: ['−10¹⁸ ≤ a, b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '1 10 1' }, { input: '0 10 3', note: 'Licznik przyjmuje wartości 0, 3, 6 i 9.' }, { input: '5 2 1', note: 'Warunek jest fałszywy od razu.' }],
            hint: R`Gdy a > b, pętla nie wykona się ani razu. W przeciwnym razie: od a do b jest b − a „kroków o 1”, z czego mieszczą się (b − a) / k pełne skoki o k, a do tego dochodzi pierwszy obrót dla i = a. Wynik: (b − a) / k + 1. Sprawdź wzór na przykładach z treści — zanim go wyślesz.`,
            tests: (r) => ['1 10 1', '0 10 3', '5 2 1', '7 7 100', '-1000000000000000000 1000000000000000000 1', '-1000000000000000000 1000000000000000000 1000000000000000000', '1000000000000000000 -1000000000000000000 5', '0 0 1', '1 2 2', '1 3 2',
                `${String(r.big(-1e18, 0))} ${String(r.big(0, 1e18))} ${String(r.big(1, 1e9))}`, `${r.int(-100, 100)} ${r.int(-100, 100)} ${r.int(1, 10)}`],
            solve: (inp) => { const [a, b, k] = toks(inp).map(BigInt); return a > b ? '0' : String((b - a) / k + 1n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, k;
    cin >> a >> b >> k;
    if (a > b) {
        cout << 0 << "\n";
    } else {
        cout << (b - a) / k + 1 << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 3 · for i dane
        {
            id: 'for-suma-srednia', krok: 3, level: 'latwe',
            title: 'Suma i średnia',
            short: 'Wczytaj n liczb pętlą for i wypisz ich sumę oraz średnią z dwoma miejscami.',
            tags: ['for', 'cin w pętli', 'setprecision'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. W pierwszym wierszu wypisz suma: S, a w drugim srednia: X, gdzie X to średnia zaokrąglona do dwóch miejsc po przecinku.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁶ do 10⁶'],
            examples: [{ input: '4\n3 8 -2 10' }],
            hint: R`for (int i = 0; i < n; i++) { cin >> x; suma += x; }. Przy średniej uważaj na dzielenie całkowite: (double)suma / n. Sumę trzymaj w long long — na wszelki wypadek.`,
            tests: (r) => {
                const out = ['4\n3 8 -2 10', '1\n-7', '2\n1 2', `1000\n${Array(1000).fill(1e6).join(' ')}`];
                while (out.length < 10) { const n = r.pick([r.int(2, 20), r.int(100, 1000)]); const a = r.arr(n, -1e6, 1e6); if (safe(a.reduce((s, x) => s + x, 0) / n, 2)) out.push(`${n}\n${a.join(' ')}`); }
                return out;
            },
            check: (inp) => { const a = nums(inp).slice(1); return safe(a.reduce((s, x) => s + x, 0) / a.length, 2) ? null : 'połówka'; },
            solve: (inp) => { const a = nums(inp).slice(1); const s = a.reduce((p, x) => p + x, 0); return join(`suma: ${s}`, `srednia: ${fx(s / a.length, 2)}`); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        suma += x;
    }
    cout << "suma: " << suma << "\n";
    cout << "srednia: " << fixed << setprecision(2) << (double)suma / n << "\n";
    return 0;
}`,
        },
        {
            id: 'for-wieksze-od-pierwszej', krok: 3, level: 'latwe',
            title: 'Lepiej niż na początku',
            short: 'Ile liczb jest większych od pierwszej? Pierwszą wczytaj przed pętlą.',
            tags: ['for', 'pierwsza liczba osobno', 'licznik'],
            statement: ['Wczytaj n, a potem n liczb całkowitych — wyniki kolejnych treningów. Wypisz, ile treningów (nie licząc pierwszego) miało wynik większy niż pierwszy trening.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od 0 do 10⁶'],
            examples: [{ input: '6\n50 48 52 50 61 55' }],
            hint: R`Wczytaj pierwszą liczbę przed pętlą. Pętla wczytuje pozostałe n − 1 liczb: for (int i = 1; i < n; i++), a w niej if (x > pierwszy) ile++;.`,
            tests: (r) => ['6\n50 48 52 50 61 55', '1\n7', '3\n5 5 5', '3\n1 2 3', lista(1000, 0, 1e6, r), lista(30, 40, 60, r)],
            solve: (inp) => { const a = nums(inp).slice(1); return String(a.slice(1).filter((x) => x > a[0]).length); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, pierwszy;
    cin >> n >> pierwszy;
    int ile = 0;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        if (x > pierwszy) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-iloczyny-par', krok: 3, level: 'latwe',
            title: 'Rachunek z paragonów',
            short: 'n wierszy „cena ilość” — wypisz wartość każdej pozycji i sumę na końcu.',
            tags: ['for', 'dwie liczby w obrocie', 'long long'],
            statement: ['Na paragonie jest n pozycji. Każda pozycja to cena za sztukę (w groszach) i liczba sztuk. Dla każdej pozycji wypisz w osobnym wierszu jej wartość (cena · ilość), a w ostatnim wierszu razem: S, gdzie S to suma wszystkich pozycji.'],
            input_format: ['W pierwszym wierszu n, w każdym z kolejnych n wierszy dwie liczby: cena i ilość.'],
            output_format: ['n + 1 wierszy.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ cena ≤ 10⁶', '1 ≤ ilość ≤ 10⁴'],
            examples: [{ input: '3\n250 4\n1999 1\n45 10' }],
            hint: R`W każdym obrocie wczytaj dwie liczby: cin >> cena >> ilosc;. Wartość pozycji może dojść do 10¹⁰, a suma do 10¹³ — obie trzymaj w long long.`,
            tests: (r) => ['3\n250 4\n1999 1\n45 10', '1\n1 1', `1000\n${Array(1000).fill('1000000 10000').join('\n')}`,
                `20\n${Array.from({ length: 20 }, () => `${r.int(1, 5000)} ${r.int(1, 20)}`).join('\n')}`, `500\n${Array.from({ length: 500 }, () => `${r.int(1, 1e6)} ${r.int(1, 1e4)}`).join('\n')}`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const o = []; let s = 0; for (let i = 0; i < n; i++) { const v = a[1 + 2 * i] * a[2 + 2 * i]; o.push(String(v)); s += v; } return join(o, `razem: ${s}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        long long cena, ilosc;
        cin >> cena >> ilosc;
        cout << cena * ilosc << "\n";
        razem += cena * ilosc;
    }
    cout << "razem: " << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'for-max-min-pozycje', krok: 3, level: 'srednie',
            title: 'Gdzie był rekord?',
            short: 'Największa liczba z pierwszą pozycją i najmniejsza z ostatnią — > kontra >=.',
            tags: ['for', 'maksimum', 'minimum', 'pozycja'],
            statement: ['Wczytaj n, a potem n liczb całkowitych (pozycje numerujemy od 1). W pierwszym wierszu wypisz największą liczbę i numer pozycji, na której wystąpiła po raz pierwszy. W drugim — najmniejszą liczbę i numer pozycji, na której wystąpiła po raz ostatni.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Dwa wiersze po dwie liczby.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '7\n4 9 1 9 3 1 5' }],
            hint: R`Licznik pętli niech będzie numerem pozycji: for (int i = 1; i <= n; i++). Dla pierwszego wystąpienia maksimum aktualizuj przy x > maks (równe go nie zmienia), a dla ostatniego wystąpienia minimum — przy x <= mini. Pierwszą liczbę możesz potraktować osobno albo zacząć rekordy przy i == 1.`,
            tests: (r) => ['7\n4 9 1 9 3 1 5', '1\n-4', '3\n2 2 2', '4\n-1 -5 -1 -5', lista(1000, -1e9, 1e9, r), lista(50, 0, 3, r), lista(10, -2, 2, r)],
            solve: (inp) => { const a = nums(inp).slice(1); const mx = Math.max(...a), mn = Math.min(...a); return join(`${mx} ${a.indexOf(mx) + 1}`, `${mn} ${a.lastIndexOf(mn) + 1}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks = 0, mini = 0, gdzieMaks = 0, gdzieMini = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (i == 1 || x > maks) {
            maks = x;
            gdzieMaks = i;
        }
        if (i == 1 || x <= mini) {
            mini = x;
            gdzieMini = i;
        }
    }
    cout << maks << " " << gdzieMaks << "\n";
    cout << mini << " " << gdzieMini << "\n";
    return 0;
}`,
        },
        {
            id: 'for-najlepszy-uczen', krok: 3, level: 'srednie',
            title: 'Najlepszy w klasie',
            short: 'n wierszy „imię ocena”. Kto ma najlepszą ocenę i ilu uczniów zdało?',
            tags: ['for', 'string i liczba', 'rekord z imieniem'],
            statement: ['W klasie jest n uczniów. Dla każdego znasz imię i ocenę z kartkówki (od 1 do 6). Wypisz w pierwszym wierszu najlepszy: imię, gdzie imię należy do ucznia z najwyższą oceną (jeśli kilku ma tę samą najwyższą ocenę — tego, który był najwcześniej na liście). W drugim wierszu wypisz zdali: k, gdzie k to liczba uczniów z oceną co najmniej 2.'],
            input_format: ['W pierwszym wierszu n, w każdym z kolejnych n wierszy imię (bez spacji i polskich liter) i ocena.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ ocena ≤ 6'],
            examples: [{ input: '4\nAla 4\nKuba 5\nOla 5\nIgor 1' }],
            hint: R`Obok najlepszej oceny zapamiętuj imię jej właściciela: if (ocena > najlepsza) { najlepsza = ocena; kto = imie; }. Ostre > sprawdza, że przy remisie zostaje wcześniejszy uczeń. Imię to zmienna typu string.`,
            tests: (r) => {
                const gen = (n) => `${n}\n${Array.from({ length: n }, () => `${r.pick(IMIONA)} ${r.int(1, 6)}`).join('\n')}`;
                return ['4\nAla 4\nKuba 5\nOla 5\nIgor 1', '1\nZosia 1', '3\nAla 1\nOla 1\nEla 1', gen(10), gen(100), gen(30)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let best = -1, kto = '', z = 0; for (let i = 0; i < n; i++) { const o = Number(t[2 + 2 * i]); if (o > best) { best = o; kto = t[1 + 2 * i]; } if (o >= 2) z++; } return join(`najlepszy: ${kto}`, `zdali: ${z}`); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najlepsza = 0, zdali = 0;
    string kto;
    for (int i = 0; i < n; i++) {
        string imie;
        int ocena;
        cin >> imie >> ocena;
        if (ocena > najlepsza) {
            najlepsza = ocena;
            kto = imie;
        }
        if (ocena >= 2) {
            zdali++;
        }
    }
    cout << "najlepszy: " << kto << "\n";
    cout << "zdali: " << zdali << "\n";
    return 0;
}`,
        },
        {
            id: 'for-zmiany-znaku', krok: 3, level: 'srednie',
            title: 'Zmiany znaku',
            short: 'Ile razy w ciągu liczba dodatnia sąsiaduje z ujemną? Pamiętaj poprzednią.',
            tags: ['for', 'poprzednia liczba', 'iloczyn < 0'],
            statement: ['Wczytaj n, a potem n liczb całkowitych różnych od zera. Wypisz, ile razy w tym ciągu zmienia się znak — czyli ile jest par sąsiednich liczb, z których jedna jest dodatnia, a druga ujemna.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych różnych od zera.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹, różna od 0'],
            examples: [{ input: '6\n3 -1 -4 2 5 -6' }],
            hint: R`Trzymaj poprzednią liczbę. Znak zmienia się, gdy (poprz > 0 && x < 0) || (poprz < 0 && x > 0). Kuszący skrót poprz * x < 0 jest groźny: iloczyn dwóch liczb rzędu miliarda nie mieści się w int.`,
            tests: (r) => {
                const nz = (n, lo, hi) => r.arr(n, lo, hi).map((x) => x || 1);
                return ['6\n3 -1 -4 2 5 -6', '1\n5', '2\n1000000000 -1000000000', '4\n1 2 3 4', `1000\n${nz(1000, -1e9, 1e9).join(' ')}`, `20\n${nz(20, -3, 3).join(' ')}`];
            },
            solve: (inp) => { const a = nums(inp).slice(1); let c = 0; for (let i = 1; i < a.length; i++) if ((a[i - 1] > 0) !== (a[i] > 0)) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, poprz;
    cin >> n >> poprz;
    int zmiany = 0;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        if ((poprz > 0 && x < 0) || (poprz < 0 && x > 0)) {
            zmiany++;
        }
        poprz = x;
    }
    cout << zmiany << "\n";
    return 0;
}`,
        },
        {
            id: 'for-najwiekszy-skok', krok: 3, level: 'srednie',
            title: 'Największy skok',
            short: 'Największa różnica (bez znaku) między dwiema sąsiednimi liczbami.',
            tags: ['for', 'poprzednia liczba', 'wartość bezwzględna', 'maksimum'],
            statement: ['Wczytaj n, a potem n liczb całkowitych — wysokości kolejnych punktów na trasie. Wypisz największą różnicę wysokości między dwoma sąsiednimi punktami (bez znaku: spadek o 7 i wzrost o 7 to ten sam skok).'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['2 ≤ n ≤ 1000', 'każda liczba od −10⁶ do 10⁶'],
            examples: [{ input: '5\n10 13 4 6 1' }],
            hint: R`Dla każdej pary sąsiadów policz r = x - poprz; i jeśli r < 0, zmień znak (r = -r). Potem zwykły rekord: if (r > maks) maks = r;. Rekord może startować od 0, bo różnica bez znaku nie jest ujemna.`,
            tests: (r) => ['5\n10 13 4 6 1', '2\n5 5', '2\n-1000000 1000000', '3\n1000000 -1000000 1000000', lista(1000, -1e6, 1e6, r), lista(20, 0, 10, r)],
            solve: (inp) => { const a = nums(inp).slice(1); let m = 0; for (let i = 1; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - a[i - 1])); return String(m); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, poprz;
    cin >> n >> poprz;
    int maks = 0;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        int r = x - poprz;
        if (r < 0) {
            r = -r;
        }
        if (r > maks) {
            maks = r;
        }
        poprz = x;
    }
    cout << maks << "\n";
    return 0;
}`,
        },
        {
            id: 'for-najnizsze-saldo', krok: 3, level: 'srednie',
            title: 'Najniższy stan konta',
            short: 'Po kolei wpłaty i wypłaty. Ile jest na koncie na końcu, a ile było najmniej?',
            tags: ['for', 'suma', 'minimum na bieżąco', 'long long'],
            statement: ['Na początku na koncie jest 0 zł. Potem wykonujesz n operacji: liczba dodatnia to wpłata, ujemna — wypłata (konto może zejść poniżej zera). W pierwszym wierszu wypisz koniec: S — stan konta po wszystkich operacjach. W drugim wierszu wypisz najnizej: M — najniższy stan konta w całej historii, licząc też początkowe 0.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '5\n100 -250 50 300 -20' }, { input: '2\n5 7' }],
            hint: R`Saldo zmieniasz w każdym obrocie, a zaraz potem sprawdzasz rekord: if (saldo < najnizej) najnizej = saldo;. Rekord startuje od 0 — bo 0 to stan początkowy. Oba w long long: tysiąc wypłat po miliard to bilion.`,
            tests: (r) => ['5\n100 -250 50 300 -20', '2\n5 7', '1\n-1', `1000\n${Array(1000).fill(-1e9).join(' ')}`, lista(1000, -1e9, 1e9, r), lista(30, -100, 100, r)],
            solve: (inp) => { const a = nums(inp).slice(1); let s = 0, m = 0; for (const x of a) { s += x; m = Math.min(m, s); } return join(`koniec: ${s}`, `najnizej: ${m}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long saldo = 0, najnizej = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        saldo += x;
        if (saldo < najnizej) {
            najnizej = saldo;
        }
    }
    cout << "koniec: " << saldo << "\n";
    cout << "najnizej: " << najnizej << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · for kontra while, break i continue
        {
            id: 'for-pierwsza-podzielna', krok: 4, level: 'latwe',
            title: 'Pierwsza podzielna',
            short: 'Szukaj pierwszej liczby od a do b, która dzieli się przez k — znalazłeś? break.',
            tags: ['for', 'break', 'szukanie'],
            statement: ['Wczytaj a, b i k. Wypisz najmniejszą liczbę z przedziału od a do b, która dzieli się przez k. Jeśli takiej nie ma, wypisz BRAK.', 'Zrób to pętlą, która sprawdza liczby po kolei i kończy się, gdy tylko znajdzie odpowiedź.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Jedna liczba albo słowo BRAK.'],
            constraints: ['1 ≤ a ≤ b ≤ 10⁶', '1 ≤ k ≤ 10⁶'],
            examples: [{ input: '20 40 7' }, { input: '8 9 5' }],
            hint: R`Zmienna wynik = 0 znaczy „nie znaleziono”. for (int x = a; x <= b; x++) { if (x % k == 0) { wynik = x; break; } }. Po pętli: wynik == 0 → BRAK.`,
            tests: (r) => ['20 40 7', '8 9 5', '1 1 1', '1 1000000 1000000', '1 999999 1000000', '999999 1000000 2', `${r.int(1, 5e5)} ${r.int(5e5, 1e6)} ${r.int(1, 1000)}`, `${r.int(1, 1000)} ${r.int(1000, 2000)} ${r.int(500, 5000)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b, k] = nums(inp); for (let x = a; x <= b; x++) if (x % k === 0) return String(x); return 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, k;
    cin >> a >> b >> k;
    int wynik = 0;
    for (int x = a; x <= b; x++) {
        if (x % k == 0) {
            wynik = x;
            break;
        }
    }
    if (wynik == 0) {
        cout << "BRAK\n";
    } else {
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-pomin-trojki', krok: 4, level: 'latwe',
            title: 'Bez trójek',
            short: 'Liczby od 1 do n bez tych, które dzielą się przez 3 albo kończą cyfrą 3 — continue.',
            tags: ['for', 'continue'],
            statement: ['Wczytaj n i wypisz w jednym wierszu liczby od 1 do n, pomijając te, które dzielą się przez 3, oraz te, których ostatnią cyfrą jest 3.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z liczbami.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '15' }],
            hint: R`if (i % 3 == 0 || i % 10 == 3) continue;. W pętli for continue nie psuje licznika — i++ z nawiasu wykona się mimo to. To ważna różnica w porównaniu z while!`,
            tests: (r) => ['15', '1', '2', '3', '10000', String(r.int(4, 9999))],
            solve: (inp) => range(1, nums(inp)[0]).filter((i) => i % 3 && i % 10 !== 3).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 || i % 10 == 3) {
            continue;
        }
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-szukaj-liczby', krok: 4, level: 'latwe',
            title: 'Gdzie jest x?',
            short: 'Na której pozycji pierwszy raz pojawia się liczba x?',
            tags: ['for', 'break', 'pozycja'],
            statement: ['W pierwszym wierszu są liczby n i x, a w drugim n liczb całkowitych. Wypisz numer pozycji (od 1), na której liczba x występuje po raz pierwszy, albo BRAK, jeśli jej nie ma.'],
            input_format: ['W pierwszym wierszu n i x, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', 'wszystkie liczby od −1000 do 1000'],
            examples: [{ input: '6 7\n3 7 1 7 9 2' }, { input: '3 5\n1 2 3' }],
            hint: R`for (int i = 1; i <= n; i++) { cin >> a; if (a == x) { gdzie = i; break; } }. Zmienna gdzie zaczyna od 0, czyli „nie znaleziono”.`,
            tests: (r) => {
                const a = r.arr(1000, -1000, 1000); const x = a[r.int(500, 999)];
                return ['6 7\n3 7 1 7 9 2', '3 5\n1 2 3', '1 0\n0', '1 0\n1', `1000 ${x}\n${a.join(' ')}`, `1000 -5\n${r.arr(1000, 0, 1000).join(' ')}`, `20 2\n${r.arr(20, 0, 3).join(' ')}`];
            },
            check: (inp) => { const a = nums(inp); return Math.abs(a[1]) <= 1000 ? null : 'x poza zakresem'; },
            solve: (inp) => { const a = nums(inp); const x = a[1]; const i = a.slice(2).indexOf(x); return i < 0 ? 'BRAK' : String(i + 1); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, x;
    cin >> n >> x;
    int gdzie = 0;
    for (int i = 1; i <= n; i++) {
        int a;
        cin >> a;
        if (a == x) {
            gdzie = i;
            break;
        }
    }
    if (gdzie == 0) {
        cout << "BRAK\n";
    } else {
        cout << gdzie << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-tylko-dodatnie', krok: 4, level: 'latwe',
            title: 'Tylko dodatnie',
            short: 'Sumuj liczby dodatnie, a pozostałe pomijaj przez continue — i policz je.',
            tags: ['for', 'continue', 'licznik'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Wypisz w pierwszym wierszu suma: S — sumę liczb dodatnich, a w drugim pominiete: k — ile liczb nie było dodatnich (zera i ujemne).'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁶ do 10⁶'],
            examples: [{ input: '6\n4 -2 0 7 -1 3' }],
            hint: R`if (x <= 0) { pominiete++; continue; } suma += x;. Instrukcje za continue wykonują się tylko dla liczb dodatnich.`,
            tests: (r) => ['6\n4 -2 0 7 -1 3', '1\n0', '1\n5', '3\n-1 -2 -3', lista(1000, -1e6, 1e6, r), lista(25, -3, 3, r)],
            solve: (inp) => { const a = nums(inp).slice(1); return join(`suma: ${a.filter((x) => x > 0).reduce((s, x) => s + x, 0)}`, `pominiete: ${a.filter((x) => x <= 0).length}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    int pominiete = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x <= 0) {
            pominiete++;
            continue;
        }
        suma += x;
    }
    cout << "suma: " << suma << "\n";
    cout << "pominiete: " << pominiete << "\n";
    return 0;
}`,
        },
        {
            id: 'for-wszystkie-parzyste', krok: 4, level: 'srednie',
            title: 'Czy wszystkie parzyste?',
            short: 'TAK, jeśli każda liczba jest parzysta — w przeciwnym razie NIE i pozycja pierwszej nieparzystej.',
            tags: ['for', 'break', 'flaga'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Jeśli wszystkie są parzyste, wypisz TAK. W przeciwnym razie wypisz NIE i — po spacji — numer pozycji (od 1) pierwszej liczby nieparzystej.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['TAK albo NIE i liczba.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '5\n2 8 -4 7 6' }, { input: '3\n0 -2 10' }],
            hint: R`Pozycja 0 oznacza „wszystkie parzyste”. Przy pierwszej nieparzystej (x % 2 != 0 — działa też dla ujemnych) zapisz pozycję i break. Po pętli zdecyduj, co wypisać.`,
            tests: (r) => {
                const ev = (n) => r.arr(n, -5e8, 5e8).map((x) => 2 * x);
                const a = ev(1000); a[r.int(0, 999)] += 1; const b = ev(1000);
                return ['5\n2 8 -4 7 6', '3\n0 -2 10', '1\n-3', '1\n4', `1000\n${a.join(' ')}`, `1000\n${b.join(' ')}`, `10\n${r.arr(10, -9, 9).join(' ')}`];
            },
            solve: (inp) => { const a = nums(inp).slice(1); const i = a.findIndex((x) => x % 2 !== 0); return i < 0 ? 'TAK' : `NIE ${i + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int gdzie = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (x % 2 != 0) {
            gdzie = i;
            break;
        }
    }
    if (gdzie == 0) {
        cout << "TAK\n";
    } else {
        cout << "NIE " << gdzie << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-do-progu', krok: 4, level: 'srednie',
            title: 'Aż przekroczysz próg',
            short: 'Dodawaj 1, 2, 3, … dopóki suma nie przekroczy s. for bez warunku i break.',
            tags: ['for (;;)', 'break', 'long long'],
            statement: ['Dodajesz po kolei 1 + 2 + 3 + … aż suma stanie się większa od s. Wypisz, ile liczb trzeba było dodać, a po spacji — jaka wyszła suma.'],
            input_format: ['Jedna liczba całkowita s.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['0 ≤ s ≤ 10¹²'],
            examples: [{ input: '10', note: '1 + 2 + 3 + 4 = 10 to jeszcze nie więcej niż 10 — potrzebna jest piątka: suma 15.' }, { input: '0' }],
            hint: R`Część warunkowa w nawiasie for może być pusta: for (long long i = 1; ; i++) { suma += i; if (suma > s) { wypisz i oraz sumę; break; } }. Bez break taka pętla kręciłaby się bez końca.`,
            tests: (r) => ['10', '0', '1', '2', '1000000000000', '999999999999', '500000500000', String(r.int(3, 1e6)), String(r.int(1e9, 1e12))],
            solve: (inp) => { const s = Number(toks(inp)[0]); let sum = 0; for (let i = 1; ; i++) { sum += i; if (sum > s) return `${i} ${sum}`; } },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long s;
    cin >> s;
    long long suma = 0;
    for (long long i = 1; ; i++) {
        suma += i;
        if (suma > s) {
            cout << i << " " << suma << "\n";
            break;
        }
    }
    return 0;
}`,
        },
        {
            id: 'for-nastepna-pierwsza', krok: 4, level: 'srednie',
            title: 'Następna liczba pierwsza',
            short: 'Najmniejsza liczba pierwsza większa od n — pętla bez końca, a w niej test pierwszości.',
            tags: ['for (;;)', 'break', 'd * d <= x'],
            statement: ['Wczytaj n i wypisz najmniejszą liczbę pierwszą, która jest większa od n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba pierwsza.'],
            constraints: ['1 ≤ n ≤ 10⁹'],
            examples: [{ input: '10' }, { input: '13' }],
            hint: R`Zewnętrzna pętla sprawdza kolejnych kandydatów od n + 1 w górę: for (long long x = n + 1; ; x++). W środku test pierwszości z dzielnikami d, dopóki d * d <= x. Gdy x okaże się pierwsza — wypisz i break. Liczby pierwsze są gęsto: kandydatów nie będzie wielu.`,
            tests: (r) => ['10', '13', '1', '2', '1000000000', '999999937', '999999936', '370261', String(r.int(3, 1e9)), String(r.int(3, 1e6))],
            solve: (inp) => { const n = nums(inp)[0]; for (let x = n + 1; ; x++) if (pierwsza(x)) return String(x); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    for (long long x = n + 1; ; x++) {
        bool pierwsza = true;
        for (long long d = 2; d * d <= x; d++) {
            if (x % d == 0) {
                pierwsza = false;
                break;
            }
        }
        if (pierwsza) {
            cout << x << "\n";
            break;
        }
    }
    return 0;
}`,
        },
    ];
};
