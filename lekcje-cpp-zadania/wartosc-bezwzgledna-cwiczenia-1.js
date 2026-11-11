// Wartość bezwzględna — ćwiczenia w trakcie lekcji, części 1–3: odległość od zera (oś liczbowa, |x| przez if,
// liczba przeciwna, równanie |x| = k, znak liczby, suma modułów), funkcja abs (typy wyniku, najmniejsza liczba int,
// liczby z przecinkiem, reszta i cyfry liczby ujemnej) oraz odległość dwóch liczb |a − b| (piętra, minuty, litery,
// „czy pomiędzy”, różnica poza zakresem int, długości napisów).
// Uczeń zna pierwszy etap, tablice, napisy, pary, vector, sortowanie, max i min, zaokrąglanie i silnię.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const B = BigInt;
    const babs = (x) => (x < 0n ? -x : x);
    const lista = (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])); };
    const zgodne = (inp, n) => toks(inp).length === n;
    const wZakresie = (xs, lo, hi) => xs.every((x) => Number.isInteger(Number(x)) && Number(x) >= lo && Number(x) <= hi);
    const MLD = 1000000000;
    // liczby do testów: kilka „brzegowych” i losowe
    const losowe = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));

    return [
        // ================================================================ KROK 1 · odległość od zera
        {
            id: 'abs-winda-z-parteru', krok: 1, level: 'latwe',
            title: 'Winda z parteru',
            short: 'Winda jedzie z parteru na poziom p. W którą stronę i ile pięter? Garaże mają numery ujemne.',
            tags: ['|p|', 'if', 'kierunek i odległość'],
            statement: ['W budynku parter ma numer 0, piętra nad nim mają numery dodatnie, a garaże pod ziemią — ujemne (−1, −2, …). Winda stoi na parterze i ma pojechać na poziom p.', 'Wypisz, w którą stronę pojedzie winda — w gore, w dol albo stoi (gdy p = 0) — oraz ile pięter przejedzie.'],
            input_format: ['Jedna liczba całkowita p — numer poziomu, na który jedzie winda.'],
            output_format: ['Jeden wiersz: kierunek (w gore, w dol albo stoi), spacja i liczba przejechanych pięter.'],
            constraints: ['−100 ≤ p ≤ 1000'],
            examples: [{ input: '3', note: 'Trzy piętra w górę.' }, { input: '-2', note: 'Do garażu −2 winda zjeżdża o 2 piętra.' }, { input: '0', note: 'Winda już jest na parterze.' }],
            hint: R`Liczba pięter to odległość p od zera, czyli |p|: dla liczby ujemnej to ta liczba bez minusa (-p), a dla dodatniej — samo p. Kierunek zależy od znaku: p > 0 — w górę, p < 0 — w dół, p == 0 — winda stoi. Na przykład dla ujemnego p: cout << "w dol " << -p;`,
            tests: (r) => ['1', '-1', '1000', '-100', '57', '-37', ...losowe(r, 6, -100, 1000).map(String)],
            check: (inp) => (zgodne(inp, 1) && wZakresie(toks(inp), -100, 1000) ? null : 'p'),
            solve: (inp) => { const p = Number(inp); return p > 0 ? `w gore ${p}` : p < 0 ? `w dol ${-p}` : 'stoi 0'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int p;
    cin >> p;
    if (p > 0) cout << "w gore " << p << "\n";
    else if (p < 0) cout << "w dol " << -p << "\n";
    else cout << "stoi 0\n";
    return 0;
}`,
        },
        {
            id: 'abs-przeciwna-i-modul', krok: 1, level: 'latwe',
            title: 'Liczba przeciwna i moduł',
            short: 'Wypisz −x i |x|. Uwaga: dla liczby dodatniej to dwie różne liczby!',
            tags: ['−x', '|x|', 'if (x < 0)'],
            statement: ['Wczytaj liczbę całkowitą x. W pierwszym wierszu wypisz liczbę przeciwną do x (czyli −x), a w drugim — moduł x (czyli |x|, odległość x od zera).'],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Dwa wiersze: liczba −x oraz liczba |x|.'],
            constraints: ['|x| ≤ 10⁹'],
            examples: [{ input: '-7' }, { input: '12', note: 'Liczba przeciwna do 12 to −12, ale moduł 12 to 12.' }, { input: '0', note: 'Zero jest liczbą przeciwną samej siebie.' }],
            hint: R`Liczba przeciwna to po prostu -x: dla 12 wychodzi −12, a dla −7 wychodzi 7. Moduł to odległość od zera: jeśli x < 0, to -x, a w przeciwnym razie samo x. Moduł i liczba przeciwna są równe tylko dla liczb ujemnych i zera.`,
            tests: (r) => ['1', '-1', String(MLD), String(-MLD), '5', '-123456789', ...losowe(r, 4, -MLD, MLD).map(String)],
            check: (inp) => (zgodne(inp, 1) && wZakresie(toks(inp), -MLD, MLD) ? null : 'x'),
            solve: (inp) => { const x = Number(inp); return `${x === 0 ? 0 : -x}\n${Math.abs(x)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int x;
    cin >> x;
    cout << -x << "\n";
    int m = x;
    if (m < 0) m = -m;
    cout << m << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-znak-i-modul', krok: 1, level: 'latwe',
            title: 'Znak i moduł',
            short: 'Rozłóż każdą z n liczb na znak (−1, 0 albo 1) i moduł.',
            tags: ['znak liczby', '|x|', 'x = znak · |x|'],
            statement: ['Każdą liczbę całkowitą x można zapisać jako znak razy moduł: x = znak · |x|, gdzie znak to 1 dla liczb dodatnich, −1 dla ujemnych i 0 dla zera.', 'Wczytaj n liczb i dla każdej wypisz w osobnym wierszu jej znak i moduł, oddzielone spacją.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n wierszy — w każdym znak i moduł kolejnej liczby.'],
            constraints: ['1 ≤ n ≤ 1000', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '4\n-7 15 0 -1', note: '−7 = (−1) · 7, 15 = 1 · 15, 0 = 0 · 0, −1 = (−1) · 1.' }],
            hint: R`Trzy przypadki: if (x > 0) — znak 1, moduł x; else if (x < 0) — znak −1, moduł -x; else — znak 0 i moduł 0. Zrób to w pętli dla każdej wczytanej liczby i wypisuj od razu.`,
            tests: (r) => ['1\n0', '1\n-1000000000', `3\n${MLD} ${-MLD} 0`, '5\n-1 1 -2 2 0',
                ...[10, 300, 1000].map((n) => `${n}\n${losowe(r, n, -MLD, MLD).map((x) => (r.int(0, 9) === 0 ? 0 : x)).join(' ')}`),
                `20\n${losowe(r, 20, -5, 5).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map(Number).map((x) => `${Math.sign(x) || 0} ${Math.abs(x)}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > 0) cout << 1 << " " << x << "\n";
        else if (x < 0) cout << -1 << " " << -x << "\n";
        else cout << 0 << " " << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-zmiana-znaku', krok: 1, level: 'latwe',
            title: 'Zmiana znaku',
            short: 'Wypisz moduły wszystkich liczb w jednym wierszu i policz, ilu liczbom trzeba było zmienić znak.',
            tags: ['if (x < 0) x = -x', 'pętla', 'licznik'],
            statement: ['Wczytaj n liczb całkowitych. W pierwszym wierszu wypisz ich moduły w tej samej kolejności, oddzielone spacjami. W drugim wierszu wypisz, ilu liczbom trzeba było przy tym zmienić znak (ile było liczb ujemnych).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu n modułów, w drugim jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '5\n3 -4 0 -12 7', note: 'Znak zmieniamy tylko liczbom −4 i −12. Zero zostaje zerem.' }],
            hint: R`W pętli wczytaj liczbę x. Jeśli x < 0, zrób x = -x i zwiększ licznik. Potem wypisz x i spację. Po pętli przejdź do nowego wiersza i wypisz licznik.`,
            tests: (r) => ['1\n0', '1\n-5', `4\n${MLD} ${-MLD} 1 -1`, '6\n-1 -2 -3 -4 -5 -6', '3\n7 8 9',
                ...[15, 400, 1000].map((n) => `${n}\n${losowe(r, n, -MLD, MLD).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = lista(inp).map(Number); return `${v.map((x) => Math.abs(x)).join(' ')}\n${v.filter((x) => x < 0).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int zmienione = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x < 0) {
            x = -x;
            zmienione++;
        }
        cout << x << " ";
    }
    cout << "\n" << zmienione << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-saldo-i-obrot', krok: 1, level: 'latwe',
            title: 'Saldo i obrót',
            short: 'Wpłaty i wypłaty na koncie: suma ze znakiem (saldo) i suma modułów (obrót) — w long long.',
            tags: ['suma ze znakiem', 'suma modułów', 'long long'],
            statement: ['Na koncie zapisano n operacji: liczba dodatnia to wpłata, ujemna — wypłata (w złotych).', 'W pierwszym wierszu wypisz saldo, czyli sumę wszystkich operacji ze znakiem. W drugim wypisz obrót, czyli sumę wszystkich kwot bez znaku — ile pieniędzy w sumie przepłynęło przez konto.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — kwoty operacji.'],
            output_format: ['Dwa wiersze: saldo i obrót.'],
            constraints: ['1 ≤ n ≤ 5000', '|każda kwota| ≤ 10⁹'],
            examples: [{ input: '5\n3 -4 0 -12 7', note: 'Saldo: 3 − 4 + 0 − 12 + 7 = −6. Obrót: 3 + 4 + 0 + 12 + 7 = 26.' }],
            hint: R`Potrzebujesz dwóch sum. Do salda dodawaj liczbę taką, jaka jest, a do obrotu — jej moduł (dla ujemnej: -x). Suma 5000 kwot po miliardzie to 5 · 10¹² — nie zmieści się w int, więc obie sumy trzymaj w long long.`,
            tests: (r) => ['1\n0', '1\n-1000000000', `5000\n${Array(5000).fill(MLD).join(' ')}`, `5000\n${Array(5000).fill(-MLD).join(' ')}`,
                `4\n${MLD} ${-MLD} ${MLD} ${-MLD}`,
                ...[20, 1000, 5000].map((n) => `${n}\n${losowe(r, n, -MLD, MLD).join(' ')}`), `30\n${losowe(r, 30, -100, 100).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = lista(inp).map(Number); return `${v.reduce((a, x) => a + x, 0)}\n${v.reduce((a, x) => a + Math.abs(x), 0)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long saldo = 0, obrot = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        saldo += x;
        if (x < 0) x = -x;
        obrot += x;
    }
    cout << saldo << "\n" << obrot << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-dalej-od-zera', krok: 1, level: 'latwe',
            title: 'Dalej od zera',
            short: 'Która z dwóch liczb leży dalej od zera? Wypisz ją ze znakiem albo REMIS.',
            tags: ['porównanie modułów', 'oryginał ze znakiem', 'remis'],
            statement: ['Wczytaj dwie liczby całkowite a i b. Wypisz tę, która leży dalej od zera (ma większy moduł) — dokładnie taką, jaka jest, razem ze znakiem.', 'Jeśli obie liczby leżą tak samo daleko od zera, wypisz REMIS.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedna liczba albo słowo REMIS.'],
            constraints: ['|a|, |b| ≤ 10⁹'],
            examples: [{ input: '-9 5', note: '−9 leży 9 od zera, a 5 — tylko 5.' }, { input: '4 -4', note: 'Obie liczby leżą 4 od zera.' }],
            hint: R`Policz moduły obu liczb (ma = a, a jeśli ma < 0, to ma = -ma; tak samo mb). Porównuj moduły, ale wypisuj oryginalną liczbę: jeśli ma > mb, wypisz a (nie ma!). Remis zachodzi, gdy moduły są równe — także wtedy, gdy a i b to ta sama liczba.`,
            tests: (r) => ['0 0', '7 7', '-7 7', `${MLD} ${-MLD}`, `${-MLD} 999999999`, '0 -1', '-3 2', '100 -101',
                ...Array.from({ length: 4 }, () => `${r.int(-MLD, MLD)} ${r.int(-MLD, MLD)}`)],
            check: (inp) => (zgodne(inp, 2) && wZakresie(toks(inp), -MLD, MLD) ? null : 'a b'),
            solve: (inp) => { const [a, b] = toks(inp).map(Number); return Math.abs(a) > Math.abs(b) ? String(a) : Math.abs(b) > Math.abs(a) ? String(b) : 'REMIS'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int ma = a, mb = b;
    if (ma < 0) ma = -ma;
    if (mb < 0) mb = -mb;
    if (ma > mb) cout << a << "\n";
    else if (mb > ma) cout << b << "\n";
    else cout << "REMIS\n";
    return 0;
}`,
        },
        {
            id: 'abs-rownanie-x-k', krok: 1, level: 'latwe',
            title: 'Równanie |x| = k',
            short: 'Ile liczb ma moduł równy k i jakie to liczby? Pomyśl o zerze i o ujemnym k.',
            tags: ['|x| = k', 'liczby przeciwne', 'trzy przypadki'],
            statement: ['Wczytaj liczbę całkowitą k i rozwiąż równanie |x| = k, czyli znajdź wszystkie liczby x, które leżą dokładnie k od zera.', 'W pierwszym wierszu wypisz liczbę rozwiązań. Jeśli rozwiązania są, w drugim wierszu wypisz je rosnąco, oddzielone spacją.'],
            input_format: ['Jedna liczba całkowita k.'],
            output_format: ['W pierwszym wierszu liczba rozwiązań, w drugim (jeśli są) — rozwiązania rosnąco.'],
            constraints: ['|k| ≤ 10⁹'],
            examples: [{ input: '4', note: 'Liczby −4 i 4 leżą 4 od zera.' }, { input: '0' }, { input: '-3', note: 'Moduł nie bywa ujemny — nie ma rozwiązań, więc wypisujemy tylko 0.' }],
            hint: R`Trzy przypadki. Dla k > 0 są dwa rozwiązania: −k i k (najpierw ujemne, bo rosnąco). Dla k == 0 jest jedno: 0. Dla k < 0 nie ma żadnego — odległość nie może być ujemna — więc wypisujesz tylko 0 (i nic więcej).`,
            tests: (r) => ['1', '-1', String(MLD), String(-MLD), '7', '-50', ...losowe(r, 4, -MLD, MLD).map(String)],
            check: (inp) => (zgodne(inp, 1) && wZakresie(toks(inp), -MLD, MLD) ? null : 'k'),
            solve: (inp) => { const k = Number(inp); return k > 0 ? `2\n${-k} ${k}` : k === 0 ? '1\n0' : '0'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    if (k > 0) cout << 2 << "\n" << -k << " " << k << "\n";
    else if (k == 0) cout << 1 << "\n" << 0 << "\n";
    else cout << 0 << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-moduly-z-przedzialu', krok: 1, level: 'srednie',
            title: 'Moduły z przedziału',
            short: 'Ile liczb całkowitych x spełnia a ≤ |x| ≤ b? Liczby leżą po obu stronach zera.',
            tags: ['symetria względem zera', '2k + 1', 'long long'],
            statement: ['Wczytaj dwie liczby całkowite a i b (0 ≤ a ≤ b). Policz, ile jest liczb całkowitych x, których moduł leży między a i b włącznie, czyli a ≤ |x| ≤ b.'],
            input_format: ['Jeden wiersz z dwiema liczbami a i b.'],
            output_format: ['Jedna liczba — liczba takich x.'],
            constraints: ['0 ≤ a ≤ b ≤ 10⁹'],
            examples: [{ input: '2 4', note: 'Pasują −4, −3, −2, 2, 3 i 4 — sześć liczb.' }, { input: '0 3', note: 'Od −3 do 3: siedem liczb (zero liczymy tylko raz).' }],
            hint: R`Modułów od a do b jest b − a + 1. Każdemu dodatniemu modułowi m odpowiadają dwie liczby: m i −m, a modułowi 0 — tylko jedna. Jeśli a > 0, wynik to 2 · (b − a + 1). Jeśli a = 0, zero liczymy raz: 2 · b + 1. Wynik może sięgać 2 · 10⁹ + 1 — licz w long long.`,
            tests: (r) => ['0 0', `0 ${MLD}`, `${MLD} ${MLD}`, `1 ${MLD}`, '5 5', '0 1', '1 1',
                ...Array.from({ length: 5 }, () => { const a = r.int(0, MLD), b = r.int(a, MLD); return `${a} ${b}`; }), `0 ${r.int(1, 1000)}`],
            check: (inp) => { const t = toks(inp).map(Number); return t.length === 2 && t[0] >= 0 && t[0] <= t[1] && t[1] <= MLD ? null : 'a b'; },
            solve: (inp) => { const [a, b] = toks(inp).map(Number); return String(a === 0 ? 2 * b + 1 : 2 * (b - a + 1)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    if (a == 0) cout << 2 * b + 1 << "\n";
    else cout << 2 * (b - a + 1) << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · funkcja abs
        {
            id: 'abs-moduly-olbrzymow', krok: 2, level: 'latwe',
            title: 'Moduły olbrzymów',
            short: 'Moduły liczb sięgających 10¹⁸ — abs działa też dla long long.',
            tags: ['abs', 'long long', 'typ wyniku'],
            statement: ['Wczytaj n liczb całkowitych i wypisz moduł każdej z nich w osobnym wierszu. Uwaga: liczby są ogromne — nie zmieszczą się w int.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n wierszy — moduły kolejnych liczb.'],
            constraints: ['1 ≤ n ≤ 1000', '|każda liczba| ≤ 10¹⁸'],
            examples: [{ input: '3\n-1000000000000000000 25 -7' }],
            hint: R`Wczytuj do zmiennej long long, a moduł licz funkcją abs — dla long long zwraca ona long long, więc nic się nie przepełni (10¹⁸ mieści się w long long). Pamiętaj, żeby wynik wypisać albo przypisać: cout << abs(x) << "\n";`,
            tests: (r) => ['1\n0', '1\n-1000000000000000000', '2\n1000000000000000000 -999999999999999999', '5\n-1 1 -10 10 0',
                ...[10, 500, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => String(r.big(-(10n ** 18n), 10n ** 18n))).join(' ')}`),
                `40\n${Array.from({ length: 40 }, () => String(r.big(-1000000n, 1000000n))).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && t.slice(1).every((x) => /^-?\d+$/.test(x) && babs(B(x)) <= 10n ** 18n && x !== '-0') ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => String(babs(B(x)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        cout << abs(x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-caly-zakres-int', krok: 2, level: 'latwe',
            title: 'Cały zakres int',
            short: 'Moduł każdej liczby z zakresu int — także najmniejszej: −2 147 483 648.',
            tags: ['abs', 'najmniejsza liczba int', 'long long'],
            statement: ['Wczytaj t liczb z pełnego zakresu typu int i dla każdej wypisz w osobnym wierszu jej moduł.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — moduły kolejnych liczb.'],
            constraints: ['1 ≤ t ≤ 1000', '−2 147 483 648 ≤ każda liczba ≤ 2 147 483 647'],
            examples: [{ input: '3\n-5 2147483647 -2147483648', note: 'Moduł najmniejszej liczby int, czyli 2 147 483 648, nie mieści się już w int.' }],
            hint: R`Wszystkie liczby mieszczą się w int — ale nie wszystkie ich moduły! |−2 147 483 648| = 2 147 483 648, a to o 1 za dużo dla int, więc abs(x) dla int zwróci bzdurę (zwykle tę samą ujemną liczbę). Wczytuj do long long — wtedy abs liczy w long long i wszystko się mieści.`,
            tests: (r) => ['1\n-2147483648', '1\n2147483647', '1\n0', '4\n-2147483648 -2147483647 2147483647 -1',
                ...[10, 300, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => (r.int(0, 30) === 0 ? -2147483648 : r.int(-2147483648, 2147483647))).join(' ')}`),
                `7\n${losowe(r, 7, -1000, 1000).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && wZakresie(t.slice(1), -2147483648, 2147483647) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => String(Math.abs(Number(x)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long x;
        cin >> x;
        cout << abs(x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-modul-ulamka', krok: 2, level: 'latwe',
            title: 'Moduł ułamka',
            short: 'Moduły liczb z przecinkiem, wypisane z dokładnie dwiema cyframi po kropce.',
            tags: ['abs dla double', 'fixed', 'setprecision(2)'],
            statement: ['Wczytaj n liczb, każdą z dokładnie dwiema cyframi po kropce (na przykład −3.75). Dla każdej wypisz w osobnym wierszu jej moduł — również z dokładnie dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb z dwiema cyframi po kropce.'],
            output_format: ['n wierszy — moduły kolejnych liczb z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '|każda liczba| ≤ 10 000'],
            examples: [{ input: '3\n-3.75 2.50 -0.05' }],
            hint: R`Wczytuj do double — abs dla double zwraca double z całą częścią po przecinku. Przed wypisywaniem ustaw cout << fixed << setprecision(2); (biblioteka iomanip), wtedy 2.5 wypisze się jako 2.50.`,
            tests: (r) => {
                const lic = (k) => h.dec(k, 2);
                return ['1\n0.00', '1\n-10000.00', '2\n10000.00 -0.01', '4\n-0.10 0.10 -1.00 1.00',
                    ...[10, 400, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => { let k = r.int(-1000000, 1000000); if (k === 0) k = 1; return lic(k); }).join(' ')}`)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && t.slice(1).every((x) => /^-?\d+\.\d\d$/.test(x) && Math.abs(Number(x)) <= 10000 && Number(x) !== 0 || x === '0.00') ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => x.replace(/^-/, '')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        cout << abs(x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-suma-modulow-modul-sumy', krok: 2, level: 'latwe',
            title: 'Suma modułów a moduł sumy',
            short: 'Policz |a| + |b| i |a + b|. Kiedy są równe? Uwaga: liczby sięgają dwóch miliardów.',
            tags: ['|a| + |b|', '|a + b|', 'long long'],
            statement: ['Wczytaj dwie liczby całkowite a i b. W pierwszym wierszu wypisz sumę ich modułów |a| + |b|, w drugim — moduł ich sumy |a + b|, a w trzecim ROWNE, jeśli obie wartości są równe, albo ROZNE w przeciwnym razie.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Trzy wiersze: |a| + |b|, |a + b| i słowo ROWNE albo ROZNE.'],
            constraints: ['|a|, |b| ≤ 2 000 000 000'],
            examples: [{ input: '5 -3', note: '|5| + |−3| = 8, a |5 + (−3)| = 2.' }, { input: '-4 -6', note: 'Liczby mają ten sam znak, więc obie wartości są równe.' }],
            hint: R`Obie liczby mieszczą się w int, ale |a| + |b| może mieć nawet 4 miliardy — a to za dużo dla int. Wczytuj do long long, wtedy abs(a) + abs(b) i abs(a + b) policzą się poprawnie. Wartości są równe dokładnie wtedy, gdy a i b nie mają różnych znaków.`,
            tests: (r) => ['2000000000 2000000000', '-2000000000 -2000000000', '2000000000 -2000000000', '0 0', '0 -7', '1 -1', '-5 3',
                ...Array.from({ length: 5 }, () => `${r.int(-2 * MLD, 2 * MLD)} ${r.int(-2 * MLD, 2 * MLD)}`)],
            check: (inp) => (zgodne(inp, 2) && wZakresie(toks(inp), -2 * MLD, 2 * MLD) ? null : 'a b'),
            solve: (inp) => { const [a, b] = toks(inp).map(Number); const s = Math.abs(a) + Math.abs(b), m = Math.abs(a + b); return `${s}\n${m}\n${s === m ? 'ROWNE' : 'ROZNE'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long s = abs(a) + abs(b);
    long long m = abs(a + b);
    cout << s << "\n" << m << "\n";
    if (s == m) cout << "ROWNE\n";
    else cout << "ROZNE\n";
    return 0;
}`,
        },
        {
            id: 'abs-cyfry-ujemnej', krok: 2, level: 'latwe',
            title: 'Cyfry liczby ujemnej',
            short: 'Ile cyfr ma liczba i jaka jest suma jej cyfr — także dla liczb ujemnych i zera.',
            tags: ['x = abs(x)', 'rozbieranie na cyfry', 'zero osobno'],
            statement: ['Dla każdej z t liczb całkowitych wypisz w osobnym wierszu, ile ma cyfr i ile wynosi suma jej cyfr. Znak minus nie jest cyfrą.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym liczba cyfr i suma cyfr, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '|każda liczba| ≤ 10¹⁸'],
            examples: [{ input: '3\n-4071 0 25', note: '−4071 ma 4 cyfry o sumie 12. Zero ma jedną cyfrę.' }],
            hint: R`Pętla while (x > 0) { suma += x % 10; x /= 10; } nie zadziała dla liczby ujemnej — warunek jest od razu fałszywy. Najpierw zrób x = abs(x); (x w long long). Zero obsłuż osobno: ma jedną cyfrę, choć pętla się dla niego nie wykona.`,
            tests: (r) => ['1\n0', '1\n-1000000000000000000', '2\n999999999999999999 -999999999999999999', '5\n-1 -10 -100 9 -9',
                ...[10, 500, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => String(r.big(-(10n ** 18n), 10n ** 18n) / (10n ** B(r.int(0, 17))))).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && t.slice(1).every((x) => /^-?\d+$/.test(x) && x !== '-0' && babs(B(x)) <= 10n ** 18n) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => { const s = String(babs(B(x))); return `${s.length} ${[...s].reduce((a, c) => a + Number(c), 0)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x;
        cin >> x;
        x = abs(x);
        int cyfry = 0, suma = 0;
        if (x == 0) cyfry = 1;
        while (x > 0) {
            suma += x % 10;
            cyfry++;
            x /= 10;
        }
        cout << cyfry << " " << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-ostatnia-cyfra-parzystosc', krok: 2, level: 'latwe',
            title: 'Ostatnia cyfra i parzystość',
            short: 'Ostatnia cyfra i parzystość liczb ujemnych: −7 % 10 to −7, a −3 % 2 to −1.',
            tags: ['x % 10 dla ujemnych', 'abs(x % 10)', 'parzystość'],
            statement: ['Dla każdej z t liczb całkowitych wypisz w osobnym wierszu jej ostatnią cyfrę (cyfrę jedności, bez znaku) oraz słowo parzysta albo nieparzysta.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym cyfra i słowo, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '|każda liczba| ≤ 10¹⁸'],
            examples: [{ input: '3\n-1234 17 -7', note: 'W C++ −1234 % 10 to −4, a −7 % 2 to −1 — dlatego potrzebny jest moduł.' }],
            hint: R`Reszta w C++ ma znak liczby dzielonej, więc dla ujemnego x wyrażenie x % 10 jest ujemne. Ostatnia cyfra to abs(x % 10). Parzystość sprawdzaj przez x % 2 == 0 (to działa też dla ujemnych), a nie przez x % 2 == 1 — dla −7 reszta to −1, nie 1.`,
            tests: (r) => ['1\n0', '1\n-1000000000000000000', '4\n-1 -2 -3 -9', '3\n999999999999999999 -999999999999999999 10',
                ...[10, 500, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => String(r.big(-(10n ** 18n), 10n ** 18n) / (10n ** B(r.int(0, 17))))).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && t.slice(1).every((x) => /^-?\d+$/.test(x) && x !== '-0' && babs(B(x)) <= 10n ** 18n) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => { const d = Number(x[x.length - 1]); return `${d} ${d % 2 === 0 ? 'parzysta' : 'nieparzysta'}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x;
        cin >> x;
        cout << abs(x % 10) << " ";
        if (x % 2 == 0) cout << "parzysta\n";
        else cout << "nieparzysta\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-rowne-czy-przeciwne', krok: 2, level: 'latwe',
            title: 'Równe, przeciwne czy różne?',
            short: 'Dla każdej pary: ROWNE (a = b), PRZECIWNE (a = −b) albo ROZNE. Uważaj na zero.',
            tags: ['abs(a) == abs(b)', 'liczby przeciwne', 'zero'],
            statement: ['Dla każdej z t par liczb całkowitych a, b wypisz w osobnym wierszu jedno słowo: ROWNE, gdy a = b; PRZECIWNE, gdy liczby są różne, ale mają ten sam moduł (czyli a = −b); ROZNE w pozostałych przypadkach.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby a i b.'],
            output_format: ['t wierszy — w każdym jedno słowo.'],
            constraints: ['1 ≤ t ≤ 1000', '|a|, |b| ≤ 10⁹'],
            examples: [{ input: '4\n5 5\n5 -5\n0 0\n3 -4', note: '0 i 0 są równe — zero jest jednocześnie swoją liczbą przeciwną, ale najpierw sprawdzamy równość.' }],
            hint: R`Kolejność warunków ma znaczenie: najpierw if (a == b) — ROWNE; potem else if (abs(a) == abs(b)) — PRZECIWNE (liczby są różne, ale tak samo daleko od zera); w pozostałych przypadkach ROZNE.`,
            tests: (r) => ['1\n0 0', `2\n${MLD} ${-MLD}\n${-MLD} ${-MLD}`, '3\n1 -1\n-1 1\n1 2',
                ...[20, 400, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(-MLD, MLD), z = r.int(0, 2); const b = z === 0 ? a : z === 1 ? -a : r.int(-MLD, MLD); return `${a} ${b}`; }).join('\n')}`),
                `12\n${Array.from({ length: 12 }, () => `${r.int(-3, 3)} ${r.int(-3, 3)}`).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; out.push(a === b ? 'ROWNE' : Math.abs(a) === Math.abs(b) ? 'PRZECIWNE' : 'ROZNE'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int a, b;
        cin >> a >> b;
        if (a == b) cout << "ROWNE\n";
        else if (abs(a) == abs(b)) cout << "PRZECIWNE\n";
        else cout << "ROZNE\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-srednia-odleglosc', krok: 2, level: 'srednie',
            title: 'Średnia odległość od zera',
            short: 'Średnia z modułów n liczb, z dwiema cyframi po kropce. Suma w long long, dzielenie z przecinkiem.',
            tags: ['suma modułów', 'long long', 'dzielenie z przecinkiem'],
            statement: ['Wczytaj n liczb całkowitych i wypisz ich średnią odległość od zera, czyli średnią arytmetyczną ich modułów, z dokładnie dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba z dokładnie dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 5000', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '4\n-3 5 -10 2', note: '(3 + 5 + 10 + 2) / 4 = 5.' }, { input: '3\n-1 0 1', note: '2 / 3 = 0,666…, po zaokrągleniu do dwóch miejsc 0.67.' }],
            hint: R`Sumuj abs(x) w zmiennej long long (5000 liczb po miliardzie to 5 · 10¹²). Średnia to suma podzielona przez n — ale dzielenie dwóch liczb całkowitych ucina ułamek, więc zamień sumę na double: (double)suma / n. Wypisz z cout << fixed << setprecision(2).`,
            tests: (r) => {
                const out = ['1\n0', '1\n-1000000000', `5000\n${Array(5000).fill(-MLD).join(' ')}`, '7\n-1 2 -3 4 -5 6 -7'];
                for (const [n, lo] of [[3, -100], [10, -MLD], [700, -MLD], [5000, -MLD], [9, -20], [2500, -1000]]) {
                    for (;;) {
                        const v = losowe(r, n, lo, -lo);
                        const s = v.reduce((a, x) => a + Math.abs(x), 0);
                        if (h.safe(s / n, 2)) { out.push(`${n}\n${v.join(' ')}`); break; }
                    }
                }
                return out;
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = lista(inp).map(Number); return h.fx(v.reduce((a, x) => a + Math.abs(x), 0) / v.length, 2); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        suma += abs(x);
    }
    cout << fixed << setprecision(2) << (double)suma / n << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · odległość dwóch liczb
        {
            id: 'abs-o-ile-sie-roznia', krok: 3, level: 'latwe',
            title: 'O ile się różnią?',
            short: 'Odległość |a − b| dla wielu par. Liczby sięgają dwóch miliardów — różnica nie zmieści się w int.',
            tags: ['abs(a - b)', 'long long', 'kolejność bez znaczenia'],
            statement: ['Dla każdej z t par liczb całkowitych a, b wypisz w osobnym wierszu, o ile liczby się różnią, czyli ich odległość na osi liczbowej |a − b|.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby a i b.'],
            output_format: ['t wierszy — odległości kolejnych par.'],
            constraints: ['1 ≤ t ≤ 1000', '|a|, |b| ≤ 2 000 000 000'],
            examples: [{ input: '3\n3 10\n10 3\n-4 6' }],
            hint: R`Odległość to abs(a - b) — kolejność odejmowania nie ma znaczenia. Ale uwaga: dla a = 2 000 000 000 i b = −2 000 000 000 różnica to 4 miliardy, a int sięga tylko do około 2,1 miliarda. Odejmowanie w int przepełni się, zanim abs zdąży pomóc — wczytuj a i b do long long.`,
            tests: (r) => ['1\n2000000000 -2000000000', '1\n-2000000000 2000000000', '2\n0 0\n5 5', '3\n-2000000000 -2000000000\n2000000000 0\n0 -2000000000',
                ...[10, 300, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => `${r.int(-2 * MLD, 2 * MLD)} ${r.int(-2 * MLD, 2 * MLD)}`).join('\n')}`),
                `15\n${Array.from({ length: 15 }, () => `${r.int(-20, 20)} ${r.int(-20, 20)}`).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -2 * MLD, 2 * MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) out.push(Math.abs(t[1 + 2 * i] - t[2 + 2 * i])); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, b;
        cin >> a >> b;
        cout << abs(a - b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-winda-na-wezwanie', krok: 3, level: 'latwe',
            title: 'Winda na wezwanie',
            short: 'Winda dojeżdża z poziomu p po pasażera na poziom q i wiezie go na r. Ile pięter?',
            tags: ['|p − q| + |q − r|', 'piętra ujemne', 'kilka odcinków'],
            statement: ['Winda stoi na poziomie p. Wzywa ją osoba czekająca na poziomie q, która chce pojechać na poziom r. Winda najpierw dojeżdża po pasażera, a potem wiezie go na miejsce. Poziomy ujemne to garaże.', 'W pierwszym wierszu wypisz, ile pięter winda przejedzie po pasażera, w drugim — ile z pasażerem, a w trzecim — ile razem.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi p, q i r.'],
            output_format: ['Trzy wiersze: dojazd, kurs z pasażerem i suma.'],
            constraints: ['−50 ≤ p, q, r ≤ 200'],
            examples: [{ input: '3 -1 6', note: 'Dojazd z 3 do −1: 4 piętra. Kurs z −1 do 6: 7 pięter. Razem 11.' }, { input: '0 0 5', note: 'Pasażer czeka tam, gdzie stoi winda — dojazd to 0 pięter.' }],
            hint: R`Każdy odcinek liczysz osobno jako odległość dwóch poziomów: dojazd to abs(p - q), kurs to abs(q - r). Na końcu dodaj obie liczby. Kierunek jazdy (w górę czy w dół) nie ma znaczenia.`,
            tests: (r) => ['-50 200 -50', '200 -50 200', '7 7 7', '-3 -3 -10', '5 0 -5', ...Array.from({ length: 7 }, () => `${r.int(-50, 200)} ${r.int(-50, 200)} ${r.int(-50, 200)}`)],
            check: (inp) => (zgodne(inp, 3) && wZakresie(toks(inp), -50, 200) ? null : 'p q r'),
            solve: (inp) => { const [p, q, rr] = toks(inp).map(Number); const a = Math.abs(p - q), b = Math.abs(q - rr); return `${a}\n${b}\n${a + b}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int p, q, r;
    cin >> p >> q >> r;
    int dojazd = abs(p - q);
    int kurs = abs(q - r);
    cout << dojazd << "\n" << kurs << "\n" << dojazd + kurs << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-ile-minut', krok: 3, level: 'latwe',
            title: 'Ile minut różnicy?',
            short: 'Dwie godziny z jednego dnia — ile minut je dzieli? Zamień je na minuty od północy.',
            tags: ['minuty od północy', 'abs(t1 - t2)', 'kolejność bez znaczenia'],
            statement: ['Wczytaj dwie godziny z tego samego dnia, każdą jako dwie liczby: godzinę i minutę. Wypisz, ile minut dzieli te dwie chwile. Godziny mogą być podane w dowolnej kolejności.'],
            input_format: ['Jeden wiersz z czterema liczbami: h1 m1 h2 m2.'],
            output_format: ['Jedna liczba — liczba minut między godzinami.'],
            constraints: ['0 ≤ h1, h2 ≤ 23', '0 ≤ m1, m2 ≤ 59'],
            examples: [{ input: '9 10 7 45', note: '9:10 to 550 minut od północy, a 7:45 — 465 minut. Różnica: 85 minut.' }, { input: '0 0 23 59' }],
            hint: R`Zamień każdą godzinę na liczbę minut od północy: t = h * 60 + m. Wtedy obie chwile leżą na jednej osi i odległość między nimi to abs(t1 - t2).`,
            tests: (r) => ['23 59 0 0', '12 0 12 0', '0 1 0 0', '13 30 9 45', ...Array.from({ length: 8 }, () => `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 23)} ${r.int(0, 59)}`)],
            check: (inp) => { const t = toks(inp).map(Number); return t.length === 4 && wZakresie([t[0], t[2]], 0, 23) && wZakresie([t[1], t[3]], 0, 59) ? null : 'godziny'; },
            solve: (inp) => { const [a, b, c, d] = toks(inp).map(Number); return String(Math.abs(a * 60 + b - (c * 60 + d))); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h1, m1, h2, m2;
    cin >> h1 >> m1 >> h2 >> m2;
    int t1 = h1 * 60 + m1;
    int t2 = h2 * 60 + m2;
    cout << abs(t1 - t2) << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-litery-w-alfabecie', krok: 3, level: 'latwe',
            title: 'Litery w alfabecie',
            short: 'Odległość dwóch liter w alfabecie i ile liter stoi ściśle pomiędzy nimi.',
            tags: ['abs(a - b) dla char', 'kody liter', 'ściśle pomiędzy'],
            statement: ['Wczytaj dwie małe litery alfabetu angielskiego (od a do z). Wypisz ich odległość w alfabecie (o ile pozycji są od siebie oddalone) oraz liczbę liter, które stoją w alfabecie ściśle pomiędzy nimi.'],
            input_format: ['Jeden wiersz z dwiema małymi literami oddzielonymi spacją.'],
            output_format: ['Dwie liczby w jednym wierszu: odległość i liczba liter pomiędzy.'],
            constraints: ['obie litery są z zakresu a–z'],
            examples: [{ input: 'c k', note: 'Od c do k jest 8 kroków, a pomiędzy stoi 7 liter: d, e, f, g, h, i, j.' }, { input: 'b a' }, { input: 'q q' }],
            hint: R`Litery to liczby (kody), a kolejne litery mają kolejne kody — więc abs(a - b) to ich odległość w alfabecie. Liter pomiędzy jest o jedną mniej niż kroków, ale nie mniej niż zero: dla odległości 0 (ta sama litera) pomiędzy nie ma nic.`,
            tests: (r) => ['a z', 'z a', 'a a', 'a b', 'm n', ...Array.from({ length: 8 }, () => `${String.fromCharCode(97 + r.int(0, 25))} ${String.fromCharCode(97 + r.int(0, 25))}`)],
            check: (inp) => { const t = toks(inp); return t.length === 2 && t.every((x) => /^[a-z]$/.test(x)) ? null : 'litery'; },
            solve: (inp) => { const [a, b] = toks(inp); const d = Math.abs(a.charCodeAt(0) - b.charCodeAt(0)); return `${d} ${Math.max(0, d - 1)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    char a, b;
    cin >> a >> b;
    int d = abs(a - b);
    int pomiedzy = d - 1;
    if (pomiedzy < 0) pomiedzy = 0;
    cout << d << " " << pomiedzy << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-kto-blizej', krok: 3, level: 'latwe',
            title: 'Kto był bliżej?',
            short: 'Zgadywanka dla dwojga: sekret s, strzał Ali i strzał Bartka. Kto wygrał — a może remis?',
            tags: ['abs(x - s)', 'porównanie odległości', 'remis'],
            statement: ['Ala i Bartek zgadują sekretną liczbę s. Ala powiedziała a, a Bartek b. Wygrywa ten, czyja liczba leży bliżej sekretu.', 'Wypisz Ala, Bartek albo REMIS, jeśli oboje są tak samo daleko od s.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi: s, a, b.'],
            output_format: ['Jedno słowo: Ala, Bartek albo REMIS.'],
            constraints: ['|s|, |a|, |b| ≤ 10⁹'],
            examples: [{ input: '50 47 55', note: 'Ala pomyliła się o 3, Bartek o 5.' }, { input: '10 8 12', note: 'Oboje pomylili się o 2 — w przeciwne strony.' }],
            hint: R`Policz dwie odległości: da = abs(a - s) i db = abs(b - s). Mniejsza wygrywa. Przy równych odległościach wypisz REMIS — także wtedy, gdy oboje podali tę samą liczbę.`,
            tests: (r) => ['0 0 0', '10 8 12', `${MLD} ${-MLD} ${MLD}`, `${-MLD} ${MLD} ${MLD}`, '5 6 4', '5 4 7', '-3 -10 4',
                ...Array.from({ length: 5 }, () => `${r.int(-MLD, MLD)} ${r.int(-MLD, MLD)} ${r.int(-MLD, MLD)}`)],
            check: (inp) => (zgodne(inp, 3) && wZakresie(toks(inp), -MLD, MLD) ? null : 's a b'),
            solve: (inp) => { const [s, a, b] = toks(inp).map(Number); const da = Math.abs(a - s), db = Math.abs(b - s); return da < db ? 'Ala' : db < da ? 'Bartek' : 'REMIS'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long s, a, b;
    cin >> s >> a >> b;
    long long da = abs(a - s), db = abs(b - s);
    if (da < db) cout << "Ala\n";
    else if (db < da) cout << "Bartek\n";
    else cout << "REMIS\n";
    return 0;
}`,
        },
        {
            id: 'abs-czy-pomiedzy', krok: 3, level: 'srednie',
            title: 'Czy leży pomiędzy?',
            short: 'Czy c leży między a i b (końce się liczą)? Nie wiadomo, która z liczb a, b jest mniejsza.',
            tags: ['|a − c| + |c − b| = |a − b|', 'min i max', 'long long'],
            statement: ['Dla każdego z t zapytań dostajesz trzy liczby całkowite a, b i c. Wypisz TAK, jeśli c leży na osi liczbowej między a i b (końce się liczą), albo NIE w przeciwnym razie. Liczba a może być większa od b.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby a, b, c.'],
            output_format: ['t wierszy — TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '|a|, |b|, |c| ≤ 10⁹'],
            examples: [{ input: '3\n8 2 5\n2 6 9\n2 6 6', note: 'W pierwszym zapytaniu a jest większe od b, ale 5 i tak leży pomiędzy. W trzecim c to koniec odcinka.' }],
            hint: R`Sposób z odległościami: c leży pomiędzy dokładnie wtedy, gdy abs(a - c) + abs(c - b) == abs(a - b) — droga przez c nie jest dłuższa niż prosta. Suma dwóch odległości może sięgać 4 · 10⁹, więc licz w long long. Sposób z max i min: min(a, b) <= c && c <= max(a, b).`,
            tests: (r) => {
                const q = (n, R2) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(-R2, R2), b = r.int(-R2, R2); const lo = Math.min(a, b), hi = Math.max(a, b); const c = r.int(0, 2) ? r.int(lo, hi) : r.int(-R2, R2); return `${a} ${b} ${c}`; }).join('\n')}`;
                return [`3\n${MLD} ${-MLD} 0\n${-MLD} ${MLD} ${MLD}\n${MLD} ${MLD} ${-MLD}`, '4\n5 5 5\n5 5 6\n-1 1 0\n1 -1 2', q(20, 10), q(300, MLD), q(1000, MLD), q(50, 3)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 3 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const [a, b, c] = t.slice(1 + 3 * i, 4 + 3 * i); out.push(Math.min(a, b) <= c && c <= Math.max(a, b) ? 'TAK' : 'NIE'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, b, c;
        cin >> a >> b >> c;
        if (abs(a - c) + abs(c - b) == abs(a - b)) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-wyrownaj-dlugosci', krok: 3, level: 'latwe',
            title: 'Wyrównaj długości',
            short: 'Ile liter dopisać do krótszego słowa? Uwaga: size() nie ma minusa.',
            tags: ['(int)s.size()', 'abs', 'liczby bez znaku'],
            statement: ['Wczytaj dwa słowa. W pierwszym wierszu wypisz, ile liter trzeba dopisać do krótszego z nich, żeby oba miały tę samą długość. W drugim wierszu wypisz, które słowo jest krótsze: pierwsze, drugie albo rowne (gdy mają tę samą długość).'],
            input_format: ['Jeden wiersz z dwoma słowami złożonymi z małych liter.'],
            output_format: ['Dwa wiersze: liczba liter i jedno słowo (pierwsze, drugie albo rowne).'],
            constraints: ['każde słowo ma od 1 do 1000 małych liter'],
            examples: [{ input: 'kot hipopotam', note: 'Słowa mają 3 i 9 liter — do krótszego trzeba dopisać 6.' }, { input: 'ala ola' }],
            hint: R`Długość słowa to s.size(), ale size() zwraca liczbę bez znaku: s.size() - t.size() dla krótszego s nie jest ujemne, tylko ogromne, a abs od takiej liczby się nie kompiluje. Zamień długości na int przed odejmowaniem: abs((int)s.size() - (int)t.size()).`,
            tests: (r) => ['a b', 'a bb', 'bb a', `${'x'.repeat(1000)} y`, `y ${'x'.repeat(1000)}`, `${'k'.repeat(1000)} ${'m'.repeat(1000)}`,
                ...Array.from({ length: 6 }, () => `${r.word(r.int(1, 30))} ${r.word(r.int(1, 30))}`)],
            check: (inp) => { const t = toks(inp); return t.length === 2 && t.every((w) => /^[a-z]{1,1000}$/.test(w)) ? null : 'slowa'; },
            solve: (inp) => { const [s, t] = toks(inp); return `${Math.abs(s.length - t.length)}\n${s.length < t.length ? 'pierwsze' : s.length > t.length ? 'drugie' : 'rowne'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    int a = s.size(), b = t.size();
    cout << abs(a - b) << "\n";
    if (a < b) cout << "pierwsze\n";
    else if (a > b) cout << "drugie\n";
    else cout << "rowne\n";
    return 0;
}`,
        },
        {
            id: 'abs-najwieksza-zmiana', krok: 3, level: 'srednie',
            title: 'Największa zmiana temperatury',
            short: 'Temperatura rano i wieczorem przez n dni. Który dzień miał największą zmianę?',
            tags: ['abs(w - r)', 'rekord', 'remis: najwcześniejszy'],
            statement: ['Przez n dni mierzono temperaturę dwa razy dziennie: rano i wieczorem. Zmiana temperatury w danym dniu to różnica między pomiarem porannym i wieczornym, bez względu na to, czy się ociepliło, czy oziębiło.', 'Wypisz numer dnia z największą zmianą (dni są numerowane od 1) i tę zmianę. Jeśli kilka dni ma taką samą największą zmianę, wybierz najwcześniejszy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby: temperatura rano i wieczorem.'],
            output_format: ['Dwie liczby w jednym wierszu: numer dnia i największa zmiana.'],
            constraints: ['1 ≤ n ≤ 1000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '4\n-3 5\n10 1\n0 0\n7 -1', note: 'Zmiany: 8, 9, 0 i 8. Największa, 9, była w dniu 2.' }],
            hint: R`To wzorzec rekordu z lekcji o max i min. Zmiana dnia to abs(rano - wieczor). Zapamiętuj numer najlepszego dnia i jego zmianę; podmieniaj tylko wtedy, gdy nowa zmiana jest ściśle większa (>) — wtedy przy remisie zostaje wcześniejszy dzień.`,
            tests: (r) => ['1\n0 0', '1\n-50 50', '3\n5 5\n6 6\n7 7', '4\n1 2\n2 1\n-1 0\n0 -1', `5\n-50 50\n50 -50\n0 0\n-50 50\n10 20`,
                ...[10, 300, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => `${r.int(-50, 50)} ${r.int(-50, 50)}`).join('\n')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -50, 50) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number); let naj = 0, d = -1; for (let i = 0; i < t[0]; i++) { const z = Math.abs(t[1 + 2 * i] - t[2 + 2 * i]); if (z > d) { d = z; naj = i; } } return `${naj + 1} ${d}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najDzien = 0, najZmiana = -1;
    for (int i = 1; i <= n; i++) {
        int rano, wieczor;
        cin >> rano >> wieczor;
        int z = abs(rano - wieczor);
        if (z > najZmiana) {
            najZmiana = z;
            najDzien = i;
        }
    }
    cout << najDzien << " " << najZmiana << "\n";
    return 0;
}`,
        },
    ];
};
