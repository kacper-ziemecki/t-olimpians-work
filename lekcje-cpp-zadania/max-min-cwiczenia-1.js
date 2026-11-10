// Max / Min — ćwiczenia w trakcie lekcji, części 1–3: max i min dwóch liczb (typy, long long, napisy), trzy i więcej
// liczb (max w max, lista w klamrach, liczba środkowa, noty sędziów, trójkąt) oraz rekord w pętli (start rekordu,
// min i max naraz, rozstęp, rekord czegoś policzonego, rekord tylko z niektórych liczb).
// Uczeń zna pierwszy etap, tablice, napisy, pary, vector i sortowanie — ale jeszcze nie funkcje ani rekurencję.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks, fx, dec } = h;
    const R = String.raw;
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]) }; };
    const wiersze = (a) => `${a.length}\n${a.map((p) => p.join(' ')).join('\n')}`;
    const bmax = (a, b) => (a > b ? a : b);
    const bmin = (a, b) => (a < b ? a : b);
    const sumaCyfr = (x) => String(x).split('').reduce((s, c) => s + Number(c), 0);
    const pol = (k) => (k % 2 === 0 ? String(k / 2) : `${(k - 1) / 2}.5`); // k połówek jako liczba z wejścia

    return [
        // ================================================================ KROK 1 · dwie liczby
        {
            id: 'mm-wieksza-mniejsza', krok: 1, level: 'latwe',
            title: 'Większa i mniejsza',
            short: 'Wczytaj dwie liczby i wypisz najpierw większą, a potem mniejszą.',
            tags: ['max(a, b)', 'min(a, b)', 'liczby ujemne'],
            statement: ['Wczytaj dwie liczby całkowite a i b. W pierwszym wierszu wypisz większą z nich, a w drugim — mniejszą. Jeśli liczby są równe, w obu wierszach wypisz tę samą liczbę.'],
            input_format: ['Jeden wiersz: dwie liczby całkowite a i b.'],
            output_format: ['Dwa wiersze: większa liczba, potem mniejsza.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '7 3' }, { input: '-4 -9', note: '−4 jest większe od −9, bo leży bliżej zera.' }],
            hint: R`cout << max(a, b) << "\n"; i tak samo z min. Obie liczby są typu int, więc zasada jednego typu jest spełniona.`,
            tests: (r) => ['3 7', '5 5', '0 -1', '-1000000000 1000000000', '1000000000 -1000000000', '-6 -6',
                ...Array.from({ length: 5 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`)],
            solve: (inp) => { const [a, b] = nums(inp); return `${Math.max(a, b)}\n${Math.min(a, b)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << max(a, b) << "\n";
    cout << min(a, b) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-lepsza-proba', krok: 1, level: 'latwe',
            title: 'Lepsza z dwóch prób',
            short: 'Każdy skoczek oddał dwa skoki. Wypisz lepszy skok każdego z nich.',
            tags: ['max(a, b)', 'pętla', 'wczytywanie par'],
            statement: ['W konkursie skoku w dal każdy z n zawodników oddał dwie próby. Wynik próby to liczba centymetrów, a 0 oznacza skok spalony. Zawodnikowi liczy się lepsza z dwóch prób. Wypisz w jednym wierszu wyniki wszystkich zawodników w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby całkowite — wynik pierwszej i drugiej próby zawodnika.'],
            output_format: ['Jeden wiersz: n liczb — lepsza próba każdego zawodnika.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ wynik próby ≤ 900'],
            examples: [{ input: '4\n512 548\n601 0\n0 0\n455 455', note: 'Trzeci zawodnik spalił oba skoki, więc ma 0.' }],
            hint: R`W pętli wczytuj po dwie liczby s1 i s2 i od razu wypisuj max(s1, s2) ze spacją. Nie trzeba niczego zapamiętywać.`,
            tests: (r) => {
                const t = (n) => wiersze(Array.from({ length: n }, () => [r() < 0.15 ? 0 : r.int(300, 900), r() < 0.15 ? 0 : r.int(300, 900)]));
                return ['1\n0 0', '1\n700 0', '2\n0 650\n650 650', t(10), t(300), t(1000)];
            },
            solve: (inp) => { const a = nums(inp); const out = []; for (let i = 0; i < a[0]; i++) out.push(Math.max(a[1 + 2 * i], a[2 + 2 * i])); return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int s1, s2;
        cin >> s1 >> s2;
        cout << max(s1, s2) << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-odleglosc', krok: 1, level: 'latwe',
            title: 'Dwa pionki na osi',
            short: 'Jak daleko od siebie stoją dwa pionki na osi liczbowej?',
            tags: ['max(a, b) - min(a, b)', 'long long', 'odległość'],
            statement: ['Na osi liczbowej stoją dwa pionki: jeden w punkcie a, drugi w punkcie b. Wypisz odległość między nimi, czyli różnicę między większą a mniejszą z tych liczb.'],
            input_format: ['Jeden wiersz: dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — odległość między pionkami.'],
            constraints: ['−2·10⁹ ≤ a, b ≤ 2·10⁹'],
            examples: [{ input: '3 -5', note: '3 − (−5) = 8.' }, { input: '-2000000000 2000000000', note: 'Odległość to 4 miliardy — więcej, niż mieści int!' }],
            hint: R`Większa minus mniejsza: max(a, b) - min(a, b). Same liczby mieszczą się w int, ale ich odległość może sięgać 4·10⁹ — a to za dużo dla int. Wczytaj a i b od razu do long long.`,
            tests: (r) => ['7 7', '0 5', '5 0', '-3 -10', '2000000000 -2000000000', '-2000000000 -2000000000', '1999999999 -1999999999',
                ...Array.from({ length: 4 }, () => `${r.int(-2e9, 2e9)} ${r.int(-2e9, 2e9)}`)],
            solve: (inp) => { const [a, b] = nums(inp); return String(Math.abs(a - b)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    cout << max(a, b) - min(a, b) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-tansze-zakupy', krok: 1, level: 'latwe',
            title: 'Zawsze taniej',
            short: 'Każdy produkt kupujesz w tańszym z dwóch sklepów. Ile zapłacisz i ile zaoszczędzisz?',
            tags: ['min(a, b)', 'max(a, b)', 'suma w pętli'],
            statement: ['Masz listę n produktów. Każdy z nich można kupić w sklepie A albo w sklepie B — osobno, tam, gdzie jest taniej. W pierwszym wierszu wypisz, ile zapłacisz za wszystkie produkty, kupując każdy w tańszym sklepie. W drugim wierszu wypisz, ile w ten sposób zaoszczędzisz w porównaniu z kupowaniem każdego produktu w droższym sklepie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby całkowite: cena produktu w sklepie A i w sklepie B.'],
            output_format: ['Dwa wiersze: kwota do zapłaty i oszczędność.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda cena ≤ 100 000'],
            examples: [{ input: '3\n129 99\n50 50\n10 25', note: 'Płacimy 99 + 50 + 10 = 159. Oszczędzamy 30 + 0 + 15 = 45.' }],
            hint: R`Dwie sumy w jednej pętli: do pierwszej dodawaj min(a, b), do drugiej — różnicę max(a, b) - min(a, b).`,
            tests: (r) => {
                const t = (n, hi) => wiersze(Array.from({ length: n }, () => [r.int(1, hi), r.int(1, hi)]));
                return ['1\n5 5', '1\n100000 1', '2\n1 100000\n100000 1', t(10, 100), t(500, 100000), t(1000, 100000)];
            },
            solve: (inp) => { const a = nums(inp); let s = 0, o = 0; for (let i = 0; i < a[0]; i++) { const x = a[1 + 2 * i], y = a[2 + 2 * i]; s += Math.min(x, y); o += Math.abs(x - y); } return `${s}\n${o}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int zaplata = 0, oszczednosc = 0;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        zaplata += min(a, b);
        oszczednosc += max(a, b) - min(a, b);
    }
    cout << zaplata << "\n" << oszczednosc << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-wielkie-liczby', krok: 1, level: 'latwe',
            title: 'Wielkie liczby',
            short: 'max i min dla liczb rzędu 10¹⁸ — i większa z liczb a i 0.',
            tags: ['long long', 'max(a, 0LL)', 'zasada jednego typu'],
            statement: ['Wczytaj dwie bardzo duże liczby całkowite a i b. W pierwszym wierszu wypisz większą z nich, w drugim — mniejszą, a w trzecim — większą z liczb a i 0 (czyli a, gdy a jest dodatnie, a w przeciwnym razie 0).'],
            input_format: ['Jeden wiersz: dwie liczby całkowite a i b.'],
            output_format: ['Trzy wiersze, każdy z jedną liczbą.'],
            constraints: ['−10¹⁸ ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '5000000000000 -7' }, { input: '-123456789012 0', note: 'a jest ujemne, więc w trzecim wierszu jest 0.' }],
            hint: R`Liczby nie mieszczą się w int — potrzebny jest long long. Wtedy zero też musi być typu long long: max(a, 0LL). Samo max(a, 0) się nie skompiluje, bo 0 to int.`,
            tests: (r) => ['0 0', '1 -1', '-1 1', '1000000000000000000 -1000000000000000000', '-1000000000000000000 -999999999999999999',
                ...Array.from({ length: 5 }, () => `${r.big(-(10n ** 18n), 10n ** 18n)} ${r.big(-(10n ** 18n), 10n ** 18n)}`)],
            solve: (inp) => { const [a, b] = toks(inp).map(BigInt); return `${bmax(a, b)}\n${bmin(a, b)}\n${bmax(a, 0n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    cout << max(a, b) << "\n";
    cout << min(a, b) << "\n";
    cout << max(a, 0LL) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-slownik', krok: 1, level: 'latwe',
            title: 'Kto pierwszy w słowniku?',
            short: 'Z dwóch słów wypisz najpierw to, które w słowniku stoi wcześniej.',
            tags: ['min i max na string', 'porządek słownikowy'],
            statement: ['Wczytaj dwa słowa złożone z małych liter angielskich. W pierwszym wierszu wypisz to, które w słowniku stoi wcześniej, a w drugim — to, które stoi później. Jeśli słowa są takie same, wypisz je dwa razy.'],
            input_format: ['Jeden wiersz: dwa słowa.'],
            output_format: ['Dwa wiersze: słowo wcześniejsze i późniejsze.'],
            constraints: ['Każde słowo ma od 1 do 20 małych liter angielskich.'],
            examples: [{ input: 'kotek kot', note: '„kot” jest początkiem „kotek”, więc stoi wcześniej.' }, { input: 'zebra arbuz' }],
            hint: R`min i max działają też na napisach typu string — porównują je w porządku słownikowym. min(s, t) to słowo wcześniejsze, a max(s, t) — późniejsze.`,
            tests: (r) => ['a b', 'b a', 'ala ala', 'ala alan', 'zzz zz', 'abc abd',
                ...Array.from({ length: 6 }, () => { const s = r.word(r.int(1, 8), 'abcde'); return `${s} ${r() < 0.3 ? s + r.word(r.int(1, 3), 'abcde') : r.word(r.int(1, 8), 'abcde')}`; })],
            solve: (inp) => { const [s, t] = toks(inp); return s <= t ? `${s}\n${t}` : `${t}\n${s}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    cout << min(s, t) << "\n";
    cout << max(s, t) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-liczba-i-ulamek', krok: 1, level: 'latwe',
            title: 'Liczba i ułamek',
            short: 'Większa z dwóch liczb — gdy jedna jest int, a druga double.',
            tags: ['max((double)a, b)', 'fixed', 'setprecision'],
            statement: ['Wczytaj liczbę całkowitą a oraz liczbę rzeczywistą b. Wypisz większą z nich z dokładnie dwiema cyframi po kropce.'],
            input_format: ['Jeden wiersz: liczba całkowita a i liczba rzeczywista b.'],
            output_format: ['Jedna liczba z dwiema cyframi po kropce.'],
            constraints: ['−1000 ≤ a ≤ 1000', '−1000 ≤ b ≤ 1000', 'b ma co najwyżej dwie cyfry po kropce.'],
            examples: [{ input: '3 2.5' }, { input: '-2 -1.75' }],
            hint: R`a jest typu int, a b — double, więc max(a, b) się nie skompiluje. Zamień a na double: max((double)a, b). Do wypisania użyj cout << fixed << setprecision(2) z lekcji Input / Output.`,
            tests: (r) => ['5 5', '0 -0.5', '-1000 -999.99', '1000 999.99', '7 7.01',
                ...Array.from({ length: 6 }, () => `${r.int(-1000, 1000)} ${dec(r.int(-100000, 100000), 2)}`)],
            solve: (inp) => { const [a, b] = nums(inp); return fx(Math.max(a, b), 2); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a;
    double b;
    cin >> a >> b;
    cout << fixed << setprecision(2) << max((double)a, b) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-dywan', krok: 1, level: 'srednie',
            title: 'Czy dywan się zmieści?',
            short: 'Prostokątny dywan, prostokątny pokój. Zmieści się, jeśli go dobrze obrócisz?',
            tags: ['min(a, b)', 'max(a, b)', 'warunek z &&'],
            statement: ['Dywan ma kształt prostokąta o bokach a i b, a podłoga pokoju — prostokąta o bokach c i d. Dywan można obrócić o 90 stopni, ale jego boki zawsze muszą być równoległe do ścian. Czy dywan zmieści się na podłodze, nie zaginając się? Dywan może dotykać ścian. Wypisz TAK albo NIE.'],
            input_format: ['Jeden wiersz: cztery liczby całkowite a, b, c, d.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ a, b, c, d ≤ 10⁹'],
            examples: [{ input: '3 5 6 4', note: 'Obracamy dywan: krótszy bok 3 przy krótszej ścianie 4, dłuższy bok 5 przy dłuższej ścianie 6.' }, { input: '2 7 6 6', note: 'Bok 7 jest dłuższy od każdej ściany.' }],
            hint: R`Ustaw oba prostokąty tak samo: krótszy bok przy krótszym, dłuższy przy dłuższym. Dywan się mieści, gdy min(a, b) <= min(c, d) i max(a, b) <= max(c, d).`,
            tests: (r) => ['1 1 1 1', '5 3 3 5', '4 4 4 3', '1000000000 1 1 1000000000', '1000000000 2 1000000000 1', '6 2 5 3', '2 6 3 5',
                ...Array.from({ length: 6 }, () => arr(r, 4, 1, 12).join(' ')), ...Array.from({ length: 3 }, () => arr(r, 4, 1, 1e9).join(' '))],
            solve: (inp) => { const [a, b, c, d] = nums(inp); return Math.min(a, b) <= Math.min(c, d) && Math.max(a, b) <= Math.max(c, d) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    if (min(a, b) <= min(c, d) && max(a, b) <= max(c, d)) cout << "TAK\n";
    else cout << "NIE\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · trzy i więcej liczb
        {
            id: 'mm-trzy-liczby', krok: 2, level: 'latwe',
            title: 'Największa i najmniejsza z trzech',
            short: 'Trzy liczby: wypisz największą i najmniejszą.',
            tags: ['max({a, b, c})', 'min({a, b, c})'],
            statement: ['Wczytaj trzy liczby całkowite. W pierwszym wierszu wypisz największą z nich, a w drugim — najmniejszą.'],
            input_format: ['Jeden wiersz: trzy liczby całkowite.'],
            output_format: ['Dwa wiersze: największa i najmniejsza liczba.'],
            constraints: ['−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4 9 6' }, { input: '-5 -5 -8' }],
            hint: R`Lista w klamrach: max({a, b, c}) i min({a, b, c}). Działa też max(a, max(b, c)).`,
            tests: (r) => ['1 2 3', '3 2 1', '2 3 1', '7 7 7', '-1000000000 0 1000000000', '5 -5 5',
                ...Array.from({ length: 5 }, () => arr(r, 3, -1e9, 1e9).join(' '))],
            solve: (inp) => { const a = nums(inp); return `${Math.max(...a)}\n${Math.min(...a)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << max({a, b, c}) << "\n";
    cout << min({a, b, c}) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-srodkowa', krok: 2, level: 'latwe',
            title: 'Liczba środkowa',
            short: 'Z trzech liczb wypisz tę, która nie jest ani największa, ani najmniejsza.',
            tags: ['suma − max − min', 'long long', 'powtórzenia'],
            statement: ['Wczytaj trzy liczby całkowite i wypisz liczbę środkową — tę, która po ustawieniu trzech liczb od najmniejszej do największej stoi w środku.'],
            input_format: ['Jeden wiersz: trzy liczby całkowite.'],
            output_format: ['Jedna liczba — środkowa.'],
            constraints: ['−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7 2 5' }, { input: '4 9 4', note: 'Po ustawieniu: 4 4 9 — w środku stoi czwórka.' }],
            hint: R`Suma wszystkich trzech minus największa minus najmniejsza. Suma trzech liczb rzędu miliarda nie mieści się w int — wczytaj je do long long (wtedy wszystko w max({…}) jest long long).`,
            tests: (r) => ['1 2 3', '3 1 2', '2 3 1', '6 6 6', '1000000000 1000000000 999999999', '-1000000000 -1000000000 -1000000000', '1000000000 -1000000000 0',
                ...Array.from({ length: 5 }, () => arr(r, 3, -1e9, 1e9).join(' '))],
            solve: (inp) => String(nums(inp).sort((x, y) => x - y)[1]),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    cout << a + b + c - max({a, b, c}) - min({a, b, c}) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-trzy-po-kolei', krok: 2, level: 'latwe',
            title: 'Trzy liczby po kolei',
            short: 'Ustaw trzy liczby od najmniejszej do największej — bez ani jednego ifa.',
            tags: ['min({…})', 'max({…})', 'liczba środkowa'],
            statement: ['Wczytaj trzy liczby całkowite i wypisz je w jednym wierszu od najmniejszej do największej.'],
            input_format: ['Jeden wiersz: trzy liczby całkowite.'],
            output_format: ['Jeden wiersz: te same trzy liczby, niemalejąco.'],
            constraints: ['−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7 2 5' }, { input: '0 -3 0' }],
            hint: R`Najmniejsza to min({a, b, c}), największa — max({a, b, c}), a środkową znasz z poprzedniego zadania (pamiętaj o long long). Możesz też wrzucić liczby do vectora i użyć sort — oba sposoby są dobre.`,
            tests: (r) => ['1 2 3', '3 2 1', '2 1 3', '5 5 1', '1 5 5', '-1000000000 1000000000 0', '1000000000 1000000000 1000000000',
                ...Array.from({ length: 5 }, () => arr(r, 3, -1e9, 1e9).join(' '))],
            solve: (inp) => nums(inp).sort((x, y) => x - y).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    long long mn = min({a, b, c});
    long long mx = max({a, b, c});
    long long sr = a + b + c - mn - mx;
    cout << mn << " " << sr << " " << mx << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-noty-sedziow', krok: 2, level: 'latwe',
            title: 'Noty sędziów',
            short: 'Pięć not za styl — odrzuć najwyższą i najniższą, a resztę zsumuj.',
            tags: ['max({…})', 'min({…})', 'double', 'setprecision(1)'],
            statement: ['W konkursie skoków narciarskich pięciu sędziów ocenia styl każdego skoku notą od 0 do 20 (co pół punktu). Najwyższą i najniższą notę się odrzuca, a pozostałe trzy sumuje. Dla każdego z n skoków wypisz sumę not po odrzuceniu skrajnych, z jedną cyfrą po kropce. Gdy kilku sędziów dało taką samą najwyższą notę, odrzuca się tylko jedną z nich (z najniższą tak samo).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy pięć not jednego skoku.'],
            output_format: ['n wierszy — wynik każdego skoku z jedną cyfrą po kropce.'],
            constraints: ['1 ≤ n ≤ 500', 'Każda nota to liczba od 0 do 20, będąca wielokrotnością 0.5.'],
            examples: [{ input: '2\n18.5 19 17.5 18 20\n17 17 17 17 17', note: 'Pierwszy skok: 93 − 20 − 17.5 = 55.5. Drugi: 85 − 17 − 17 = 51.' }],
            hint: R`Wczytaj noty do double. Wynik to suma − max({…}) − min({…}). Wypisuj z cout << fixed << setprecision(1). Odejmujesz największą notę tylko raz, więc przy dwóch takich samych odrzucasz dokładnie jedną.`,
            tests: (r) => {
                const skok = () => { const b = r.int(26, 40); return Array.from({ length: 5 }, () => pol(Math.max(0, Math.min(40, b + r.int(-3, 3))))).join(' '); };
                const t = (n) => `${n}\n${Array.from({ length: n }, skok).join('\n')}`;
                return ['1\n20 20 20 20 20', '1\n0 0 0 0 0', '1\n0 20 10 10.5 9.5', t(5), t(100), t(500)];
            },
            solve: (inp) => {
                const a = toks(inp).map(Number);
                const out = [];
                for (let i = 0; i < a[0]; i++) { const w = a.slice(1 + 5 * i, 6 + 5 * i); out.push(fx(w.reduce((s, x) => s + x, 0) - Math.max(...w) - Math.min(...w), 1)); }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << fixed << setprecision(1);
    for (int i = 0; i < n; i++) {
        double a, b, c, d, e;
        cin >> a >> b >> c >> d >> e;
        double suma = a + b + c + d + e;
        cout << suma - max({a, b, c, d, e}) - min({a, b, c, d, e}) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mm-rozrzut-cen', krok: 2, level: 'latwe',
            title: 'Rower w czterech sklepach',
            short: 'Cztery ceny tego samego roweru: najniższa, najwyższa i różnica.',
            tags: ['min({…})', 'max({…})', 'rozstęp'],
            statement: ['Ten sam rower sprzedają cztery sklepy. Wczytaj cztery ceny i wypisz w jednym wierszu: najniższą cenę, najwyższą cenę i różnicę między nimi.'],
            input_format: ['Jeden wiersz: cztery liczby całkowite — ceny.'],
            output_format: ['Jeden wiersz: trzy liczby.'],
            constraints: ['1 ≤ każda cena ≤ 1 000 000'],
            examples: [{ input: '1299 999 1150 1499' }],
            hint: R`Cztery liczby to już dużo nawiasów przy max w max — użyj listy w klamrach: min({a, b, c, d}) i max({a, b, c, d}).`,
            tests: (r) => ['5 5 5 5', '1 2 3 4', '4 3 2 1', '1 1000000 1 1000000', ...Array.from({ length: 6 }, () => arr(r, 4, 1, 1e6).join(' '))],
            solve: (inp) => { const a = nums(inp); const mn = Math.min(...a), mx = Math.max(...a); return `${mn} ${mx} ${mx - mn}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    int mn = min({a, b, c, d});
    int mx = max({a, b, c, d});
    cout << mn << " " << mx << " " << mx - mn << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-ocena-koncowa', krok: 2, level: 'latwe',
            title: 'Najgorszy sprawdzian się nie liczy',
            short: 'Z trzech wyników skreśl najgorszy i policz średnią dwóch pozostałych.',
            tags: ['min({…})', 'dzielenie przez 2.0', 'setprecision(1)'],
            statement: ['Uczeń napisał trzy sprawdziany, każdy na od 0 do 100 punktów. Nauczyciel skreśla najgorszy wynik, a ocenę wystawia ze średniej dwóch pozostałych. Wypisz tę średnią z jedną cyfrą po kropce.'],
            input_format: ['Jeden wiersz: trzy liczby całkowite — wyniki sprawdzianów.'],
            output_format: ['Jedna liczba z jedną cyfrą po kropce.'],
            constraints: ['0 ≤ każdy wynik ≤ 100'],
            examples: [{ input: '70 85 90', note: 'Skreślamy 70, średnia z 85 i 90 to 87.5.' }, { input: '50 50 50' }],
            hint: R`Suma dwóch lepszych to a + b + c - min({a, b, c}). Dziel przez 2.0, a nie przez 2 — inaczej zgubisz połówkę. Wypisz z fixed i setprecision(1).`,
            tests: (r) => ['0 0 0', '100 100 100', '0 100 100', '100 0 99', '1 2 4', ...Array.from({ length: 6 }, () => arr(r, 3, 0, 100).join(' '))],
            solve: (inp) => { const a = nums(inp); return fx((a[0] + a[1] + a[2] - Math.min(...a)) / 2, 1); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int suma = a + b + c - min({a, b, c});
    cout << fixed << setprecision(1) << suma / 2.0 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-jaki-trojkat', krok: 2, level: 'srednie',
            title: 'Jaki to trójkąt?',
            short: 'Trzy patyki: czy będzie trójkąt, a jeśli tak — ostrokątny, prostokątny czy rozwartokątny?',
            tags: ['max({…}) i min({…})', 'bok środkowy', 'long long', 'twierdzenie Pitagorasa'],
            statement: [
                'Wczytaj długości trzech patyków. Jeśli nie da się z nich zbudować trójkąta, wypisz NIE. W przeciwnym razie wypisz, jaki to trójkąt: OSTROKATNY, PROSTOKATNY albo ROZWARTOKATNY.',
                'Jeśli c to najdłuższy bok, a a i b — dwa pozostałe, to trójkąt istnieje, gdy c < a + b. Jest prostokątny, gdy c² = a² + b², rozwartokątny, gdy c² > a² + b², a ostrokątny, gdy c² < a² + b².',
            ],
            input_format: ['Jeden wiersz: trzy liczby całkowite — długości patyków.'],
            output_format: ['NIE, OSTROKATNY, PROSTOKATNY albo ROZWARTOKATNY.'],
            constraints: ['1 ≤ każda długość ≤ 10⁹'],
            examples: [{ input: '5 3 4', note: '25 = 9 + 16.' }, { input: '2 2 3', note: '9 > 4 + 4.' }, { input: '1 2 3', note: '3 nie jest mniejsze od 1 + 2.' }],
            hint: R`Najdłuższy bok to max({x, y, z}), najkrótszy — min({x, y, z}), a środkowy to suma minus oba. Kwadrat boku sięga 10¹⁸, a suma dwóch kwadratów — 2·10¹⁸, więc wszystko licz w long long.`,
            tests: (r) => {
                const t = (a, b, c) => r.shuffle([a, b, c]).join(' ');
                const out = [t(3, 4, 5), t(6, 8, 10), t(5, 12, 13), t(300000000, 400000000, 500000000), t(1e9, 1e9, 1e9), '1 1 1', '1 1 2', '1000000000 1000000000 1',
                    t(999999999, 1000000000, 1), t(20, 21, 29), t(7, 24, 25), t(2, 3, 4), t(4, 5, 6), t(1, 1000000000, 1000000000)];
                for (let i = 0; i < 6; i++) out.push(arr(r, 3, 1, 30).join(' '));
                for (let i = 0; i < 4; i++) out.push(arr(r, 3, 5e8, 1e9).join(' '));
                return out;
            },
            solve: (inp) => {
                const s = toks(inp).map(BigInt).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
                const [a, b, c] = s;
                if (c >= a + b) return 'NIE';
                const l = c * c, p = a * a + b * b;
                return l === p ? 'PROSTOKATNY' : l > p ? 'ROZWARTOKATNY' : 'OSTROKATNY';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x, y, z;
    cin >> x >> y >> z;
    long long c = max({x, y, z});
    long long a = min({x, y, z});
    long long b = x + y + z - a - c;
    if (c >= a + b) cout << "NIE\n";
    else if (c * c == a * a + b * b) cout << "PROSTOKATNY\n";
    else if (c * c > a * a + b * b) cout << "ROZWARTOKATNY\n";
    else cout << "OSTROKATNY\n";
    return 0;
}`,
        },
        {
            id: 'mm-paczka', krok: 2, level: 'srednie',
            title: 'Paczka przez okienko',
            short: 'Czy paczkę da się przepchnąć przez okienko na poczcie, jeśli dobrze ją obrócisz?',
            tags: ['min({…}) i max({…})', 'wymiar środkowy', 'long long'],
            statement: ['Paczka ma kształt prostopadłościanu o wymiarach a, b i c. Trzeba ją przesunąć przez prostokątne okienko o wymiarach w na h. Paczkę można dowolnie obracać, ale jej ściany muszą być równoległe do brzegów okienka, a paczka przechodzi przez okienko prosto, jedną ze ścian do przodu. Paczka przejdzie, jeśli któraś jej ściana zmieści się w okienku (wymiar równy wymiarowi okienka też pasuje). Wypisz TAK albo NIE.'],
            input_format: ['Jeden wiersz: pięć liczb całkowitych a, b, c, w, h.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ a, b, c, w, h ≤ 10⁹'],
            examples: [{ input: '7 2 4 3 5', note: 'Paczka przechodzi ścianą 2 na 4: 2 ≤ 3 i 4 ≤ 5.' }, { input: '6 6 6 5 9', note: 'Każda ściana ma wymiary 6 na 6, a okienko ma bok 5.' }],
            hint: R`Najłatwiej przepchnąć paczkę jej najmniejszą ścianą — złożoną z dwóch najkrótszych wymiarów. Najkrótszy wymiar porównaj z krótszym bokiem okienka, a środkowy — z dłuższym. Środkowy wymiar to suma minus największy minus najmniejszy (w long long!).`,
            tests: (r) => ['1 1 1 1 1', '2 2 2 1 5', '5 1 1 1 1', '1000000000 1000000000 1000000000 1000000000 1000000000', '1000000000 999999999 1 1 999999999',
                '1000000000 999999999 1 999999998 1', '3 5 4 4 3', '3 5 4 3 3',
                ...Array.from({ length: 8 }, () => arr(r, 5, 1, 10).join(' ')), ...Array.from({ length: 3 }, () => arr(r, 5, 1e8, 1e9).join(' '))],
            solve: (inp) => { const a = nums(inp); const p = a.slice(0, 3).sort((x, y) => x - y); return p[0] <= Math.min(a[3], a[4]) && p[1] <= Math.max(a[3], a[4]) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b, c, w, h;
    cin >> a >> b >> c >> w >> h;
    long long mn = min({a, b, c});
    long long sr = a + b + c - mn - max({a, b, c});
    if (mn <= min(w, h) && sr <= max(w, h)) cout << "TAK\n";
    else cout << "NIE\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · rekord w pętli
        {
            id: 'mm-najwieksza', krok: 3, level: 'latwe',
            title: 'Największa liczba',
            short: 'Wczytaj n liczb — także ujemnych — i wypisz największą.',
            tags: ['rekord', 'maks = max(maks, x)', 'start od pierwszej liczby'],
            statement: ['Wczytaj n liczb całkowitych i wypisz największą z nich. Liczby mogą być ujemne.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n3 -2 8 8 1' }, { input: '3\n-7 -2 -15', note: 'Same liczby ujemne — wynik to −2, a nie 0.' }],
            hint: R`Rekord: wczytaj pierwszą liczbę do maks jeszcze przed pętlą, a w pętli dla pozostałych pisz maks = max(maks, x);. Nie zaczynaj od 0!`,
            tests: (r) => ['1\n-5', '1\n1000000000', '2\n-1 -2', '4\n-1000000000 -1000000000 -1000000000 -1000000000', fmt(arr(r, 30, -100, 100)),
                fmt(arr(r, 5000, -1e9, -1)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 5))],
            solve: (inp) => String(Math.max(...czytaj(inp).v)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks;
    cin >> maks;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        maks = max(maks, x);
    }
    cout << maks << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najzimniejsza-noc', krok: 3, level: 'latwe',
            title: 'Najzimniejsza noc',
            short: 'Temperatury z n nocy — która była najniższa?',
            tags: ['rekord z min', 'INT_MAX', 'pułapka zera'],
            statement: ['Stacja meteorologiczna mierzyła temperaturę przez n nocy. Wypisz najniższą zmierzoną temperaturę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Jedna liczba — najniższa temperatura.'],
            constraints: ['1 ≤ n ≤ 5000', '−60 ≤ każda temperatura ≤ 40'],
            examples: [{ input: '5\n3 -2 0 -7 1' }, { input: '3\n12 15 9', note: 'Wszystkie temperatury są dodatnie — start rekordu od 0 dałby zły wynik 0.' }],
            hint: R`mini = min(mini, t);. Zacznij od pierwszej temperatury albo od INT_MAX — ale nie od 0.`,
            tests: (r) => ['1\n40', '1\n-60', '3\n12 15 9', '4\n0 0 0 0', fmt(arr(r, 50, 1, 40)), fmt(arr(r, 5000, -60, 40)), fmt(arr(r, 5000, 5, 40))],
            solve: (inp) => String(Math.min(...czytaj(inp).v)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int mini = INT_MAX;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        mini = min(mini, t);
    }
    cout << mini << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-rozstep', krok: 3, level: 'latwe',
            title: 'Rozstęp',
            short: 'Różnica między największą a najmniejszą liczbą — w jednej pętli.',
            tags: ['dwa rekordy naraz', 'max i min', 'rozstęp'],
            statement: ['Wczytaj n liczb całkowitych i wypisz ich rozstęp, czyli różnicę między największą a najmniejszą z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — rozstęp.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n21 45 12 67 8 33 50' }, { input: '1\n5', note: 'Jedna liczba jest jednocześnie największa i najmniejsza — rozstęp 0.' }],
            hint: R`Dwa rekordy w jednej pętli: maks i mini, oba startują od pierwszej liczby. Wynik to maks - mini. Największy możliwy rozstęp (2·10⁹) jeszcze mieści się w int.`,
            tests: (r) => ['2\n-1000000000 1000000000', '3\n7 7 7', '2\n-5 -9', fmt(arr(r, 40, -50, 50)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 100, 110))],
            solve: (inp) => { const v = czytaj(inp).v; return String(Math.max(...v) - Math.min(...v)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int x;
    cin >> x;
    int maks = x, mini = x;
    for (int i = 1; i < n; i++) {
        cin >> x;
        maks = max(maks, x);
        mini = min(mini, x);
    }
    cout << maks - mini << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-dlugie-krotkie', krok: 3, level: 'latwe',
            title: 'Długie i krótkie słowa',
            short: 'Jaką długość ma najdłuższe, a jaką najkrótsze słowo z listy?',
            tags: ['rekord długości', '(int)s.size()', 'string'],
            statement: ['Wczytaj n słów i wypisz w jednym wierszu długość najdłuższego i długość najkrótszego z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów oddzielonych spacjami.'],
            output_format: ['Jeden wiersz: dwie liczby.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 30 małych liter angielskich.'],
            examples: [{ input: '4\nala programowanie kot olimpiada' }],
            hint: R`Rekord długości: najdl = max(najdl, (int)s.size());. Bez (int) program się nie skompiluje, bo s.size() nie jest typu int. Najkrótsze słowo — tak samo z min, a start np. od długości pierwszego słowa.`,
            tests: (r) => {
                const t = (n, lo, hi) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(lo, hi))).join(' ')}`;
                return ['1\na', '1\nnajdluzszeslowowtymzadaniutoto', '3\nab cd ef', t(10, 1, 10), t(1000, 1, 30), t(1000, 5, 6)];
            },
            solve: (inp) => { const w = toks(inp).slice(1).map((s) => s.length); return `${Math.max(...w)} ${Math.min(...w)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najdl = 0, najkr = 1000;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        najdl = max(najdl, (int)s.size());
        najkr = min(najkr, (int)s.size());
    }
    cout << najdl << " " << najkr << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-skok-temperatury', krok: 3, level: 'latwe',
            title: 'Największy skok temperatury',
            short: 'O ile najbardziej zmieniła się temperatura z dnia na dzień?',
            tags: ['rekord czegoś policzonego', 'sąsiednie dni', 'abs'],
            statement: ['Masz temperatury z n kolejnych dni. Skok temperatury między dwoma sąsiednimi dniami to różnica ich temperatur bez znaku — na przykład z 5 stopni na −3 to skok o 8. Wypisz największy skok.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — temperatury z kolejnych dni.'],
            output_format: ['Jedna liczba — największy skok.'],
            constraints: ['2 ≤ n ≤ 5000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '5\n3 5 -3 -1 6', note: 'Skoki: 2, 8, 2, 7. Największy to 8.' }],
            hint: R`Zapamiętuj temperaturę z poprzedniego dnia. Dla każdego kolejnego dnia policz skok abs(t - poprz) i zrób z niego rekord. Skok nigdy nie jest ujemny, więc tu rekord może bezpiecznie zacząć od 0.`,
            tests: (r) => ['2\n5 5', '2\n-50 50', '3\n10 0 10', fmt(arr(r, 30, -10, 10)), fmt(arr(r, 5000, -50, 50)), fmt(Array.from({ length: 5000 }, (_, i) => (i % 7) - 3))],
            solve: (inp) => { const v = czytaj(inp).v; let m = 0; for (let i = 1; i < v.length; i++) m = Math.max(m, Math.abs(v[i] - v[i - 1])); return String(m); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int poprz;
    cin >> poprz;
    int najw = 0;
    for (int i = 1; i < n; i++) {
        int t;
        cin >> t;
        najw = max(najw, abs(t - poprz));
        poprz = t;
    }
    cout << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-rekordowa-suma-cyfr', krok: 3, level: 'srednie',
            title: 'Rekordowa suma cyfr',
            short: 'Która liczba z listy ma największą sumę cyfr? Wypisz tę sumę.',
            tags: ['rekord czegoś policzonego', 'cyfry: % 10 i / 10', 'pętla w pętli'],
            statement: ['Wczytaj n liczb naturalnych i wypisz największą sumę cyfr, jaką ma któraś z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jedna liczba — największa suma cyfr.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n123 99 1000 58', note: 'Sumy cyfr: 6, 18, 1, 13.' }],
            hint: R`Dla każdej liczby policz sumę jej cyfr pętlą while: suma += x % 10; x /= 10; (lekcja While loop). Dopiero potem rekord = max(rekord, suma);.`,
            tests: (r) => ['1\n1000000000', '1\n999999999', '3\n10 100 1000', fmt(arr(r, 20, 1, 1000)), fmt(arr(r, 5000, 1, 1e9)), fmt(arr(r, 5000, 1, 99))],
            solve: (inp) => String(Math.max(...czytaj(inp).v.map(sumaCyfr))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int rekord = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        int suma = 0;
        while (x > 0) {
            suma += x % 10;
            x /= 10;
        }
        rekord = max(rekord, suma);
    }
    cout << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-az-do-zera', krok: 3, level: 'srednie',
            title: 'Aż do zera',
            short: 'Nie wiesz, ile będzie liczb — wczytuj do zera i znajdź największą i najmniejszą.',
            tags: ['while (cin >> x && x != 0)', 'INT_MIN i INT_MAX', 'BRAK'],
            statement: ['Wczytuj liczby całkowite, aż trafisz na 0. Zero oznacza koniec danych i samo się nie liczy. Wypisz w jednym wierszu największą i najmniejszą z wczytanych liczb. Jeśli przed zerem nie było żadnej liczby, wypisz BRAK.'],
            input_format: ['Ciąg liczb całkowitych zakończony zerem. Liczby mogą być w kilku wierszach.'],
            output_format: ['Dwie liczby: największa i najmniejsza, albo BRAK.'],
            constraints: ['Przed zerem jest co najwyżej 5000 liczb.', '−10⁶ ≤ każda liczba ≤ 10⁶, a żadna oprócz ostatniej nie jest zerem.'],
            examples: [{ input: '4 -2 9 1 0' }, { input: '0', note: 'Nie było żadnej liczby.' }],
            hint: R`Pętla while (cin >> x && x != 0). Rekordy zacznij od INT_MIN i INT_MAX. Licz też, ile liczb wczytałeś — jeśli zero, wypisz BRAK.`,
            tests: (r) => {
                const bezZera = (n, lo, hi) => Array.from({ length: n }, () => { let x = 0; while (x === 0) x = r.int(lo, hi); return x; });
                const w = (a) => { const out = []; for (let i = 0; i < a.length; i += 20) out.push(a.slice(i, i + 20).join(' ')); return out.concat(['0']).join('\n'); };
                return ['5 0', '-5 0', '-1000000 1000000 0', w(bezZera(10, -9, 9)), w(bezZera(5000, -1e6, 1e6)), w(bezZera(3000, -1e6, -1))];
            },
            solve: (inp) => { const a = nums(inp); const v = a.slice(0, a.indexOf(0)); return v.length ? `${Math.max(...v)} ${Math.min(...v)}` : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int x, ile = 0;
    int maks = INT_MIN, mini = INT_MAX;
    while (cin >> x && x != 0) {
        maks = max(maks, x);
        mini = min(mini, x);
        ile++;
    }
    if (ile == 0) cout << "BRAK\n";
    else cout << maks << " " << mini << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najwieksza-parzysta', krok: 3, level: 'srednie',
            title: 'Największa parzysta',
            short: 'Największa liczba parzysta z listy — a jeśli parzystych nie ma, BRAK.',
            tags: ['rekord tylko z niektórych liczb', 'bool jest', 'x % 2 == 0'],
            statement: ['Wczytaj n liczb całkowitych i wypisz największą liczbę parzystą spośród nich. Jeśli żadna liczba nie jest parzysta, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Największa liczba parzysta albo BRAK.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n7 -4 3 -10 9' }, { input: '3\n1 3 5' }],
            hint: R`Nie zaczynaj od pierwszej liczby (może być nieparzysta) ani od 0 (parzyste mogą być ujemne). Użyj flagi bool jest = false;: pierwsza parzysta liczba zostaje rekordem bez porównywania. x % 2 == 0 działa także dla liczb ujemnych.`,
            tests: (r) => {
                const niep = (n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi) * 2 + 1);
                return ['1\n2', '1\n-3', '2\n-8 -6', '3\n0 -1 1', fmt(niep(40, -50, 50)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(niep(5000, -5e8, 5e8 - 1).map((x, i) => (i === 4321 ? -1000000000 : x))),
                    fmt(arr(r, 5000, -1e9, -1))];
            },
            solve: (inp) => { const p = czytaj(inp).v.filter((x) => x % 2 === 0); return p.length ? String(Math.max(...p)) : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bool jest = false;
    int maks = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) {
            if (!jest || x > maks) maks = x;
            jest = true;
        }
    }
    if (jest) cout << maks << "\n";
    else cout << "BRAK\n";
    return 0;
}`,
        },
    ];
};
