// While loop — baza zadań na koniec tematu (krok 9).
// Kolejność = kolejność w lekcji i w sprawdzarce: najpierw łatwe, potem średnie, na końcu trudne.
// Każde zadanie łączy kilka zagadnień z lekcji (pole tags). Bez pętli for i bez tablic.
module.exports = (h) => {
    const { nums, toks, join, fx, safe } = h;
    const R = String.raw;
    const K = 9;
    const z2 = (n) => String(n).padStart(2, '0');
    const big = (r, cyfr) => { let s = String(r.int(1, 9)); while (s.length < cyfr) s += r.int(0, 9); return s; };
    const pierwsza = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
    const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
    const bgcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
    const collatz = (n) => { let k = 0; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; k++; } return k; };
    const sumCyfr = (n) => { let s = 0; while (n > 0) { s += n % 10; n = Math.floor(n / 10); } return s; };

    return [
        // ================================================================ łatwe
        {
            id: 'wh-fizzbuzz', krok: K, level: 'latwe',
            title: 'FizzBuzz od 1 do n',
            short: 'Klasyk: liczby od 1 do n, ale zamiast wielokrotności 3 i 5 — Fizz, Buzz i FizzBuzz.',
            tags: ['while', 'else if', '%'],
            statement: ['Wypisz liczby od 1 do n, każdą w osobnym wierszu, ale: zamiast liczb podzielnych przez 3 i przez 5 naraz wypisz FizzBuzz, zamiast pozostałych liczb podzielnych przez 3 — Fizz, a zamiast pozostałych podzielnych przez 5 — Buzz.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '15' }],
            hint: R`To zadanie FizzBuzz z lekcji o if, tylko w pętli od 1 do n. Kolejność warunków ma znaczenie: najpierw i % 15 == 0, potem i % 3 == 0, potem i % 5 == 0, a na końcu else — sama liczba.`,
            tests: (r) => ['15', '1', '3', '5', '1000', String(r.int(16, 999))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let i = 1; i <= n; i++) o.push(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i)); return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        if (i % 15 == 0) {
            cout << "FizzBuzz\n";
        } else if (i % 3 == 0) {
            cout << "Fizz\n";
        } else if (i % 5 == 0) {
            cout << "Buzz\n";
        } else {
            cout << i << "\n";
        }
        i++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-pompki', krok: K, level: 'latwe',
            title: 'Plan treningowy',
            short: 'Pierwszego dnia a pompek, każdego kolejnego o d więcej. Ile ostatniego dnia, ile razem?',
            tags: ['while', 'suma', 'dwie zmienne'],
            statement: ['Pierwszego dnia treningu robisz a pompek, a każdego kolejnego dnia o d pompek więcej niż poprzedniego. Trening trwa n dni.', 'Wypisz w pierwszym wierszu, ile pompek zrobisz ostatniego dnia, a w drugim — ile zrobisz razem przez wszystkie dni.'],
            input_format: ['Jeden wiersz z liczbami n, a i d.'],
            output_format: ['Dwa wiersze.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ a ≤ 1000', '0 ≤ d ≤ 1000'],
            examples: [{ input: '5 10 2', note: '10 + 12 + 14 + 16 + 18 = 70' }],
            hint: R`Zmienna dzis startuje od a, suma od 0. Pętla n razy: suma += dzis;, a potem dzis += d; — ale uważaj: po ostatnim obrocie dzis jest już o d za duże. Ostatni dzień to a + (n − 1) · d, albo zapamiętaj wartość przed zwiększeniem.`,
            tests: (r) => ['5 10 2', '1 7 3', '1000 1000 1000', '1000 1 0', '2 5 0', `${r.int(2, 1000)} ${r.int(1, 1000)} ${r.int(0, 1000)}`, `${r.int(2, 50)} ${r.int(1, 30)} ${r.int(0, 5)}`],
            solve: (inp) => { const [n, a, d] = nums(inp); return join(String(a + (n - 1) * d), String(n * a + d * n * (n - 1) / 2)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, a, d;
    cin >> n >> a >> d;
    int dzis = a, ostatni = a;
    long long suma = 0;
    int i = 0;
    while (i < n) {
        suma += dzis;
        ostatni = dzis;
        dzis += d;
        i++;
    }
    cout << ostatni << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-sumy-czesciowe', krok: K, level: 'latwe',
            title: 'Stan konta dzień po dniu',
            short: 'Po każdej operacji wypisz aktualne saldo — sumy częściowe.',
            tags: ['while', 'suma', 'long long'],
            statement: ['Na koncie jest na początku 0 zł. Przez n dni wykonujesz po jednej operacji: liczba dodatnia to wpłata, a ujemna — wypłata. Wypisz w jednym wierszu stan konta po każdym dniu, oddzielając liczby spacjami.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jeden wiersz z n liczbami.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '5\n100 -30 50 -200 10' }],
            hint: R`Sumę wypisuj w środku pętli, zaraz po dodaniu kolejnej liczby — wtedy widać każdy stan pośredni. Saldo może wyjść poza zakres int, więc trzymaj je w long long.`,
            tests: (r) => ['5\n100 -30 50 -200 10', '1\n-7', `1000\n${Array(1000).fill(1e9).join(' ')}`, `1000\n${Array(1000).fill(-1e9).join(' ')}`, `30\n${r.arr(30, -100, 100).join(' ')}`, `1000\n${r.arr(1000, -1e9, 1e9).join(' ')}`],
            solve: (inp) => { const a = nums(inp).slice(1); let s = 0; return a.map((x) => (s += x)).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long saldo = 0;
    int i = 0;
    while (i < n) {
        long long x;
        cin >> x;
        saldo += x;
        cout << saldo << " ";
        i++;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-ile-podzielnych', krok: K, level: 'latwe',
            title: 'Ile podzielnych w przedziale?',
            short: 'Policz liczby z przedziału od a do b, które dzielą się przez k.',
            tags: ['while', 'licznik warunkowy', '%'],
            statement: ['Wczytaj a, b i k. Wypisz, ile liczb całkowitych z przedziału od a do b (włącznie) dzieli się przez k.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['−10⁶ ≤ a ≤ b ≤ 10⁶', '1 ≤ k ≤ 10⁶'],
            examples: [{ input: '1 20 3' }, { input: '-5 5 2' }],
            hint: R`Przejdź po wszystkich liczbach od a do b i licz te, dla których i % k == 0. Zero dzieli się przez każde k, a dla liczb ujemnych reszta też wynosi 0, gdy dzielą się bez reszty (−4 % 2 == 0).`,
            tests: (r) => ['1 20 3', '-5 5 2', '0 0 7', '1 1 2', '-1000000 1000000 1', '-1000000 1000000 1000000', '-999999 -1 1000000', `${r.int(-1e6, 0)} ${r.int(0, 1e6)} ${r.int(1, 1000)}`, `${r.int(1, 1000)} ${r.int(1000, 1e5)} ${r.int(2, 99)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b, k] = nums(inp); let c = 0; for (let i = a; i <= b; i++) if (i % k === 0) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, k;
    cin >> a >> b >> k;
    int ile = 0;
    int i = a;
    while (i <= b) {
        if (i % k == 0) {
            ile++;
        }
        i++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-iloczyn-cyfr', krok: K, level: 'latwe',
            title: 'Iloczyn cyfr',
            short: 'Pomnóż przez siebie wszystkie cyfry liczby.',
            tags: ['while', 'n % 10', 'iloczyn', 'long long'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n i wypisz iloczyn jej cyfr, np. dla 234 wynikiem jest 2 · 3 · 4 = 24.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — iloczyn cyfr.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '234' }, { input: '105' }],
            hint: R`Jak suma cyfr, tylko iloczyn startuje od 1 i w pętli robisz iloczyn *= n % 10;. Wystarczy jedno zero w liczbie, żeby wynik był zerem. Dla osiemnastu dziewiątek iloczyn ma 18 cyfr — long long.`,
            tests: (r) => ['234', '105', '7', '10', '1000000000000000000', '999999999999999999', '111111111111111111', big(r, 8), big(r, 15), '987654321987654321'],
            solve: (inp) => String([...toks(inp)[0]].reduce((p, c) => p * BigInt(c), 1n)),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long iloczyn = 1;
    while (n > 0) {
        iloczyn *= n % 10;
        n /= 10;
    }
    cout << iloczyn << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-kwadraty-do-n', krok: K, level: 'latwe',
            title: 'Ile kwadratów?',
            short: 'Ile liczb 1, 4, 9, 16, … nie przekracza n? Pętla z warunkiem i * i <= n.',
            tags: ['while', 'i * i <= n', 'long long'],
            statement: ['Kwadraty liczb całkowitych dodatnich to 1, 4, 9, 16, 25, … Wczytaj n i wypisz, ile z nich nie jest większych od n. Wypisz też największy z nich, w drugim wierszu.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: liczba kwadratów i największy z nich.'],
            constraints: ['1 ≤ n ≤ 10¹²'],
            examples: [{ input: '30', note: '1, 4, 9, 16, 25 — pięć kwadratów, największy to 25.' }, { input: '49' }],
            hint: R`long long i = 1; while (i * i <= n) i++;. Po pętli i jest o jeden za daleko — kwadratów jest i − 1, a największy to (i − 1) · (i − 1). Dla 10¹² pętla wykona milion obrotów — to dla komputera nic.`,
            tests: (r) => ['30', '49', '1', '3', '4', '1000000000000', '999999999999', '999998000001', String(r.int(1, 1e6)), String(r.int(1e9, 1e12))],
            solve: (inp) => { const n = BigInt(toks(inp)[0]); let i = 1n; while (i * i <= n) i++; return join(String(i - 1n), String((i - 1n) * (i - 1n))); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long i = 1;
    while (i * i <= n) {
        i++;
    }
    cout << i - 1 << "\n" << (i - 1) * (i - 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-srednia-do-zera', krok: K, level: 'latwe',
            title: 'Średnia aż do zera',
            short: 'Oceny kończą się zerem. Wypisz średnią albo BRAK, gdy nie było żadnej oceny.',
            tags: ['while', 'wartość kończąca', 'setprecision', 'if po pętli'],
            statement: ['Nauczyciel wpisuje oceny ucznia (liczby od 1 do 6), a na końcu wpisuje 0. Wypisz średnią ocen z dwoma miejscami po przecinku. Jeśli przed zerem nie było żadnej oceny, wypisz BRAK.'],
            input_format: ['Oceny oddzielone spacjami, na końcu 0.'],
            output_format: ['Liczba z dwiema cyframi po kropce albo słowo BRAK.'],
            constraints: ['co najwyżej 1000 ocen'],
            examples: [{ input: '5 4 6 3 0' }, { input: '0' }],
            hint: R`Schemat z wartością kończącą: wczytaj ocenę przed pętlą, while (x != 0) { suma += x; ile++; cin >> x; }. Po pętli: jeśli ile == 0, dzielić nie wolno (dzielenie przez zero!) — wypisz BRAK.`,
            tests: (r) => {
                const out = ['5 4 6 3 0', '0', '6 0', '1 2 0'];
                while (out.length < 9) { const n = r.int(2, 1000); const a = r.arr(n, 1, 6); if (safe(a.reduce((s, x) => s + x, 0) / n, 2)) out.push(`${a.join(' ')} 0`); }
                return out;
            },
            check: (inp) => { const a = nums(inp); a.pop(); return !a.length || safe(a.reduce((s, x) => s + x, 0) / a.length, 2) ? null : 'połówka'; },
            solve: (inp) => { const a = nums(inp); a.pop(); return a.length ? fx(a.reduce((s, x) => s + x, 0) / a.length, 2) : 'BRAK'; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int suma = 0, ile = 0;
    int x;
    cin >> x;
    while (x != 0) {
        suma += x;
        ile++;
        cin >> x;
    }
    if (ile == 0) {
        cout << "BRAK\n";
    } else {
        cout << fixed << setprecision(2) << (double)suma / ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'wh-ramka', krok: K, level: 'latwe',
            title: 'Ramka',
            short: 'Prostokąt z # tylko na brzegach — w środku kropki.',
            tags: ['pętla w pętli', '||', 'brzeg prostokąta'],
            statement: ['Wczytaj a i b i narysuj ramkę o a wierszach i b kolumnach: na brzegach (pierwszy i ostatni wiersz, pierwsza i ostatnia kolumna) stoi znak #, a w środku — kropki.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['a wierszy po b znaków.'],
            constraints: ['1 ≤ a, b ≤ 50'],
            examples: [{ input: '4 6' }, { input: '2 3' }],
            hint: R`Numeruj od 0. Pole (w, k) leży na brzegu, gdy w == 0 || w == a - 1 || k == 0 || k == b - 1 — wtedy #, w przeciwnym razie kropka.`,
            tests: (r) => ['4 6', '2 3', '1 1', '1 5', '5 1', '50 50', '3 3', `${r.int(3, 30)} ${r.int(3, 30)}`],
            solve: (inp) => { const [a, b] = nums(inp); return Array.from({ length: a }, (_, w) => Array.from({ length: b }, (_, k) => (w === 0 || w === a - 1 || k === 0 || k === b - 1 ? '#' : '.')).join('')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int w = 0;
    while (w < a) {
        int k = 0;
        while (k < b) {
            if (w == 0 || w == a - 1 || k == 0 || k == b - 1) {
                cout << "#";
            } else {
                cout << ".";
            }
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },

        // ================================================================ średnie
        {
            id: 'wh-slimak', krok: K, level: 'srednie',
            title: 'Ślimak w studni',
            short: 'W dzień w górę o a, w nocy w dół o b. Którego dnia ślimak wyjdzie ze studni?',
            tags: ['while', 'symulacja', 'break'],
            statement: ['Ślimak siedzi na dnie studni o głębokości h metrów. Każdego dnia wspina się o a metrów, ale każdej nocy zsuwa się o b metrów. Gdy w ciągu dnia dotrze na wysokość h (albo wyżej), wychodzi ze studni i już się nie zsuwa.', 'Którego dnia ślimak wyjdzie ze studni?'],
            input_format: ['Jeden wiersz z liczbami h, a i b.'],
            output_format: ['Jedna liczba — numer dnia (dni liczymy od 1).'],
            constraints: ['1 ≤ h ≤ 10⁶', '1 ≤ b < a ≤ 10⁶'],
            examples: [{ input: '10 3 1', note: 'Wieczorami: 3, 5, 7, 9 i 11 m — piątego dnia wychodzi.' }, { input: '5 7 6' }],
            hint: R`Symuluj dzień po dniu: dzien++; wys += a; if (wys >= h) break; wys -= b;. Kolejność jest ważna — najpierw sprawdzasz, czy ślimak wyszedł, a dopiero potem zsuwasz go w nocy.`,
            tests: (r) => ['10 3 1', '5 7 6', '1 2 1', '1000000 2 1', '1000000 1000000 999999', '100 10 9', `${r.int(1, 1e6)} ${r.int(500, 1000)} ${r.int(1, 499)}`, `${r.int(1000, 1e6)} ${r.int(2, 50)} ${r.int(1, 1)}`],
            check: (inp) => { const [, a, b] = nums(inp); return b < a ? null : 'b >= a'; },
            solve: (inp) => { const [hh, a, b] = nums(inp); let w = 0, d = 0; while (true) { d++; w += a; if (w >= hh) break; w -= b; } return String(d); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h, a, b;
    cin >> h >> a >> b;
    int wys = 0, dzien = 0;
    while (true) {
        dzien++;
        wys += a;
        if (wys >= h) {
            break;
        }
        wys -= b;
    }
    cout << dzien << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-najdluzsza-seria', krok: K, level: 'srednie',
            title: 'Najdłuższa seria',
            short: 'Ile najwięcej równych liczb stoi obok siebie? Licz bieżącą serię i pamiętaj rekord.',
            tags: ['while', 'poprzednia liczba', 'rekord'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Seria to kilka kolejnych liczb o tej samej wartości stojących obok siebie. Wypisz długość najdłuższej serii.', 'Na przykład w ciągu 5 5 2 2 2 5 najdłuższa seria to 2 2 2, więc wynikiem jest 3.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba — długość najdłuższej serii.'],
            constraints: ['1 ≤ n ≤ 10 000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '6\n5 5 2 2 2 5' }, { input: '4\n1 2 3 4' }],
            hint: R`Trzymaj trzy rzeczy: poprzednią liczbę, długość bieżącej serii i rekord. Gdy x == poprz, seria++; w przeciwnym razie seria = 1;. Po każdej liczbie: if (seria > rekord) rekord = seria;.`,
            tests: (r) => ['6\n5 5 2 2 2 5', '4\n1 2 3 4', '1\n9', `10000\n${Array(10000).fill(-3).join(' ')}`, `200\n${r.arr(200, 1, 2).join(' ')}`, `10000\n${r.arr(10000, 0, 1).join(' ')}`, `50\n${r.arr(50, -1e9, 1e9).join(' ')}`, '7\n1 1 2 2 3 3 3'],
            solve: (inp) => { const a = nums(inp).slice(1); let best = 1, cur = 1; for (let i = 1; i < a.length; i++) { cur = a[i] === a[i - 1] ? cur + 1 : 1; best = Math.max(best, cur); } return String(best); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int poprz;
    cin >> poprz;
    int seria = 1, rekord = 1;
    int i = 1;
    while (i < n) {
        int x;
        cin >> x;
        if (x == poprz) {
            seria++;
        } else {
            seria = 1;
        }
        if (seria > rekord) {
            rekord = seria;
        }
        poprz = x;
        i++;
    }
    cout << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-druga-najwieksza', krok: K, level: 'srednie',
            title: 'Srebrny medal',
            short: 'Znajdź drugą największą wartość — inną niż największa. Bez tablic, w jednym przejściu.',
            tags: ['while', 'dwa rekordy', 'flaga'],
            statement: ['Wczytaj n, a potem n wyników zawodników (liczby całkowite). Wypisz drugi najlepszy wynik, czyli największą wartość mniejszą od największej. Jeśli wszyscy mają ten sam wynik, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '6\n7 3 9 9 8 2' }, { input: '3\n5 5 5' }],
            hint: R`Pilnuj dwóch wartości: pierwszy i drugi, plus flaga jestDrugi. Gdy x > pierwszy: stary pierwszy spada na drugie miejsce (drugi = pierwszy; jestDrugi = true;), a pierwszy = x. Gdy x < pierwszy i (nie ma jeszcze drugiego albo x > drugi) — drugi = x. Gdy x == pierwszy — nic nie rób.`,
            tests: (r) => ['6\n7 3 9 9 8 2', '3\n5 5 5', '1\n4', '2\n1 2', '2\n2 1', '4\n-1 -1 -2 -1', '5\n9 1 1 1 1', `10000\n${r.arr(10000, -1e9, 1e9).join(' ')}`, `100\n${r.arr(100, 1, 3).join(' ')}`, `50\n${r.arr(50, -5, -5).join(' ')}`],
            solve: (inp) => { const a = nums(inp).slice(1); const m = Math.max(...a); const rest = a.filter((x) => x < m); return rest.length ? String(Math.max(...rest)) : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int pierwszy;
    cin >> pierwszy;
    int drugi = 0;
    bool jestDrugi = false;
    int i = 1;
    while (i < n) {
        int x;
        cin >> x;
        if (x > pierwszy) {
            drugi = pierwszy;
            jestDrugi = true;
            pierwszy = x;
        } else if (x < pierwszy && (!jestDrugi || x > drugi)) {
            drugi = x;
            jestDrugi = true;
        }
        i++;
    }
    if (jestDrugi) {
        cout << drugi << "\n";
    } else {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'wh-banknoty', krok: K, level: 'srednie',
            title: 'Wypłata z bankomatu',
            short: 'Wydaj kwotę jak najmniejszą liczbą banknotów: zawsze bierz największy, jaki się mieści.',
            tags: ['while', 'zachłannie', 'kilka pętli'],
            statement: ['Bankomat ma banknoty 500, 200, 100, 50, 20 i 10 zł — każdego dowolnie dużo. Wypłaca kwotę tak, że zawsze bierze największy banknot, który nie przekracza pozostałej do wypłaty kwoty.', 'Wypisz, ile banknotów każdego rodzaju wyda bankomat, w kolejności od największego. Pomiń nominały, których nie użył. Każdy wiersz ma postać nominał x liczba.'],
            input_format: ['Jedna liczba całkowita — kwota (podzielna przez 10).'],
            output_format: ['Wiersze w postaci 200 x 2, od największego nominału.'],
            constraints: ['10 ≤ kwota ≤ 10⁹'],
            examples: [{ input: '780' }, { input: '30' }],
            hint: R`Dla każdego nominału osobna pętla: while (kwota >= 500) { kwota -= 500; ile500++; } — i tak samo dla 200, 100, 50, 20 i 10. Po każdej pętli wypisz wiersz tylko wtedy, gdy licznik nie jest zerem. (Kwota 10⁹ to dwa miliony obrotów pierwszej pętli — wciąż szybko.)`,
            tests: (r) => ['780', '30', '10', '500', '1000000000', '880', '999999990', String(r.int(1, 1e5) * 10), String(r.int(1, 1e8) * 10)],
            check: (inp) => (nums(inp)[0] % 10 === 0 ? null : 'nie dzieli się przez 10'),
            solve: (inp) => { let k = nums(inp)[0]; const o = []; for (const m of [500, 200, 100, 50, 20, 10]) { const c = Math.floor(k / m); k -= c * m; if (c) o.push(`${m} x ${c}`); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int kwota;
    cin >> kwota;
    int nominal = 500;
    int ktory = 0;
    while (kwota > 0) {
        int ile = 0;
        while (kwota >= nominal) {
            kwota -= nominal;
            ile++;
        }
        if (ile > 0) {
            cout << nominal << " x " << ile << "\n";
        }
        ktory++;
        if (ktory == 1) nominal = 200;
        else if (ktory == 2) nominal = 100;
        else if (ktory == 3) nominal = 50;
        else if (ktory == 4) nominal = 20;
        else nominal = 10;
    }
    return 0;
}`,
        },
        {
            id: 'wh-fibonacci', krok: K, level: 'srednie',
            title: 'Ciąg Fibonacciego',
            short: 'Każdy wyraz to suma dwóch poprzednich. Wypisz wszystkie nie większe od n.',
            tags: ['while', 'trzy zmienne', 'long long'],
            statement: ['Ciąg Fibonacciego zaczyna się od 1, 1, a każdy kolejny wyraz jest sumą dwóch poprzednich: 1, 1, 2, 3, 5, 8, 13, 21, … Wczytaj n i wypisz w jednym wierszu wszystkie wyrazy tego ciągu, które nie są większe od n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z wyrazami ciągu.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '20' }, { input: '1' }],
            hint: R`Trzymaj dwa ostatnie wyrazy: a = 1, b = 1. W pętli while (a <= n): wypisz a, policz nastepny = a + b, a potem przesuń: a = b; b = nastepny;. Wszystko w long long — wyrazy rosną bardzo szybko.`,
            tests: (r) => ['20', '1', '2', '3', '1000000000000000000', '832040', '832039', big(r, 6), big(r, 15)],
            solve: (inp) => { const n = BigInt(toks(inp)[0]); let a = 1n, b = 1n; const o = []; while (a <= n) { o.push(a); [a, b] = [b, a + b]; } return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long a = 1, b = 1;
    while (a <= n) {
        cout << a << " ";
        long long nastepny = a + b;
        a = b;
        b = nastepny;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-cyfrowy-korzen', krok: K, level: 'srednie',
            title: 'Suma cyfr aż do skutku',
            short: 'Sumuj cyfry, potem cyfry sumy… aż zostanie jedna cyfra. Pętla w pętli.',
            tags: ['pętla w pętli', 'suma cyfr', 'long long'],
            statement: ['Weź liczbę n i zastąp ją sumą jej cyfr. Powtarzaj to, dopóki liczba ma więcej niż jedną cyfrę. Na przykład 9875 → 29 → 11 → 2.', 'Wypisz cyfrę, która zostanie na końcu, a po spacji — ile razy trzeba było sumować cyfry.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '9875' }, { input: '7' }],
            hint: R`Zewnętrzna pętla: while (n >= 10). W środku wewnętrzna pętla liczy sumę cyfr n (jak w lekcji), a potem n = suma; i rundy++;. Sumę zeruj na początku każdej rundy.`,
            tests: (r) => ['9875', '7', '0', '10', '19', '999999999999999999', '1000000000000000000', '199', big(r, 10), big(r, 18)],
            solve: (inp) => { let s = toks(inp)[0]; let k = 0; while (s.length > 1) { s = String([...s].reduce((a, c) => a + Number(c), 0)); k++; } return `${s} ${k}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int rundy = 0;
    while (n >= 10) {
        long long suma = 0;
        while (n > 0) {
            suma += n % 10;
            n /= 10;
        }
        n = suma;
        rundy++;
    }
    cout << n << " " << rundy << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-szyfr-cezara', krok: K, level: 'srednie',
            title: 'Szyfr Cezara',
            short: 'Przesuń każdą literę słowa o k miejsc w alfabecie, z zawijaniem z z do a.',
            tags: ['while', 's[i]', 'kody znaków', '%'],
            statement: ['Szyfr Cezara zamienia każdą literę na literę stojącą k miejsc dalej w alfabecie angielskim (26 liter, od a do z). Po z wracamy na początek: przy k = 3 litera x staje się a, y — b, a z — c.', 'Wczytaj słowo złożone z małych liter i liczbę k, a potem wypisz zaszyfrowane słowo.'],
            input_format: ['Jeden wiersz: słowo i liczba k.'],
            output_format: ['Zaszyfrowane słowo.'],
            constraints: ['1 ≤ długość słowa ≤ 1000', '0 ≤ k ≤ 1000'],
            examples: [{ input: 'olimpiada 3' }, { input: 'xyz 3' }],
            hint: R`Zamień literę na jej numer w alfabecie: s[i] - 'a' (od 0 do 25). Dodaj k, weź resztę z dzielenia przez 26 i zamień z powrotem: (char)('a' + nr). Przypisanie s[i] = … zmienia literę w słowie — po pętli wypisz całe s.`,
            tests: (r) => ['olimpiada 3', 'xyz 3', 'a 0', 'z 1', 'abc 26', 'abc 1000', `${r.word(1000)} ${r.int(0, 1000)}`, `${r.word(20)} ${r.int(1, 25)}`],
            solve: (inp) => { const [s, k] = toks(inp); return [...s].map((c) => String.fromCharCode(97 + ((c.charCodeAt(0) - 97 + Number(k)) % 26))).join(''); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    int i = 0;
    while (i < s.length()) {
        int nr = (s[i] - 'a' + k) % 26;
        s[i] = (char)('a' + nr);
        i++;
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-na-dwojkowy', krok: K, level: 'srednie',
            title: 'Zapis dwójkowy',
            short: 'Zamień liczbę na system dwójkowy — najpierw znajdź największą potęgę dwójki.',
            tags: ['while', 'potęgi dwójki', 'long long'],
            statement: ['Wczytaj liczbę nieujemną n i wypisz jej zapis w systemie dwójkowym (bez zer z przodu), np. 13 to 1101, bo 13 = 8 + 4 + 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Zapis dwójkowy liczby n.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '13' }, { input: '0' }],
            hint: R`Najpierw pętlą znajdź największą potęgę dwójki p nie większą od n: p = 1; while (p * 2 <= n) p *= 2;. Potem idź w dół: while (p > 0) { cout << n / p % 2; p /= 2; }. Dla n = 0 zostaje p = 1 i wypisze się 0.`,
            tests: (r) => ['13', '0', '1', '2', '1023', '1024', '1000000000000000000', '576460752303423487', big(r, 5), big(r, 13), big(r, 18)],
            solve: (inp) => BigInt(toks(inp)[0]).toString(2),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long p = 1;
    while (p * 2 <= n) {
        p *= 2;
    }
    while (p > 0) {
        cout << n / p % 2;
        p /= 2;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-z-dwojkowego', krok: K, level: 'srednie',
            title: 'Z dwójkowego na dziesiętny',
            short: 'Odczytaj napis z zer i jedynek jako liczbę: wynik = wynik * 2 + cyfra.',
            tags: ['while', 's[i]', 'budowanie liczby', 'long long'],
            statement: ['Wczytaj liczbę zapisaną w systemie dwójkowym jako napis z zer i jedynek (pierwszym znakiem jest 1, chyba że cała liczba to 0) i wypisz ją w systemie dziesiętnym.'],
            input_format: ['Jeden napis z cyfr 0 i 1.'],
            output_format: ['Jedna liczba w zapisie dziesiętnym.'],
            constraints: ['1 ≤ długość napisu ≤ 60'],
            examples: [{ input: '1101' }, { input: '100000' }],
            hint: R`Tak samo jak przy odwracaniu liczby, tylko z dwójką: idąc od lewej, wynik = wynik * 2 + (s[i] - '0');. Znak '1' minus '0' daje liczbę 1. Sześćdziesiąt cyfr dwójkowych to liczba rzędu 10¹⁸ — long long.`,
            tests: (r) => ['1101', '100000', '0', '1', '1'.repeat(60), '1' + '0'.repeat(59), '1' + r.word(59, '01'), '1' + r.word(20, '01'), '1010101010'],
            solve: (inp) => String(BigInt('0b' + toks(inp)[0])),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    long long wynik = 0;
    int i = 0;
    while (i < s.length()) {
        wynik = wynik * 2 + (s[i] - '0');
        i++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-slowa', krok: K, level: 'srednie',
            title: 'Najdłuższe słowo',
            short: 'Czytaj słowa do końca danych. Ile ich było i które jest najdłuższe?',
            tags: ['while (cin >> s)', 'string', 'rekord'],
            statement: ['Na wejściu jest tekst złożony ze słów oddzielonych spacjami i enterami (jest co najmniej jedno słowo). Wypisz w pierwszym wierszu liczbę słów, a w drugim — najdłuższe słowo. Jeśli kilka słów ma tę samą, największą długość, wypisz to, które pojawiło się najwcześniej.'],
            input_format: ['Słowa złożone z liter, oddzielone spacjami i enterami.'],
            output_format: ['Dwa wiersze: liczba słów i najdłuższe słowo.'],
            constraints: ['co najwyżej 10 000 słów', 'każde słowo ma od 1 do 50 liter'],
            examples: [{ input: 'Ala ma kota\na kot ma Ale' }, { input: 'raz dwa trzy' }],
            hint: R`while (cin >> s) wczytuje kolejne słowa, aż się skończą. Licz je i porównuj długości: if (s.length() > najdluzsze.length()) najdluzsze = s;. Znak > (a nie >=) sprawia, że przy remisie zostaje wcześniejsze słowo.`,
            tests: (r) => {
                const w = (n, mx) => Array.from({ length: n }, () => r.word(r.int(1, mx), 'abcdefghijKLMNO'));
                return ['Ala ma kota\na kot ma Ale', 'raz dwa trzy', 'slowo', w(3000, 50).join(r.pick([' ', '\n'])), w(30, 6).join(' '), `${w(15, 4).join(' ')}\n${w(15, 4).join(' ')}`];
            },
            solve: (inp) => { const t = toks(inp); let best = t[0]; for (const s of t) if (s.length > best.length) best = s; return join(String(t.length), best); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, najdluzsze = "";
    int ile = 0;
    while (cin >> s) {
        ile++;
        if (s.length() > najdluzsze.length()) {
            najdluzsze = s;
        }
    }
    cout << ile << "\n" << najdluzsze << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-pierwsze-w-przedziale', krok: K, level: 'srednie',
            title: 'Liczby pierwsze w przedziale',
            short: 'Policz liczby pierwsze między a i b — każdą sprawdzaj do pierwiastka.',
            tags: ['pętla w pętli', 'break', 'd * d <= x'],
            statement: ['Wczytaj a i b i wypisz, ile liczb pierwszych leży w przedziale od a do b (włącznie z końcami).'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 10⁶'],
            examples: [{ input: '1 10', note: '2, 3, 5 i 7.' }, { input: '14 16' }],
            hint: R`Pętla po x od a do b, w niej sprawdzenie, czy x jest pierwsza: pamiętaj, że 1 nie jest pierwsza, a dzielniki wystarczy sprawdzać, dopóki d * d <= x (i przerwać break, gdy któryś się znajdzie). Dla miliona liczb zwykłe sprawdzanie wszystkich dzielników do x byłoby o wiele za wolne.`,
            tests: (r) => ['1 10', '14 16', '1 1', '2 2', '1 1000000', '999000 1000000', '24 28', `${r.int(1, 5e5)} ${r.int(5e5, 1e6)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let c = 0; for (let x = a; x <= b; x++) if (pierwsza(x)) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int ile = 0;
    int x = a;
    while (x <= b) {
        bool pierwsza = (x >= 2);
        int d = 2;
        while (d * d <= x) {
            if (x % d == 0) {
                pierwsza = false;
                break;
            }
            d++;
        }
        if (pierwsza) {
            ile++;
        }
        x++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-armstrong', krok: K, level: 'srednie',
            title: 'Liczby narcystyczne',
            short: 'Liczba równa sumie swoich cyfr podniesionych do potęgi równej liczbie cyfr, np. 153.',
            tags: ['pętla w pętli', 'cyfry', 'potęga pętlą'],
            statement: ['Liczba narcystyczna ma k cyfr i jest równa sumie swoich cyfr podniesionych do k-tej potęgi, np. 153 = 1³ + 5³ + 3³ albo 9474 = 9⁴ + 4⁴ + 7⁴ + 4⁴. Każda liczba jednocyfrowa też jest narcystyczna.', 'Wczytaj n i wypisz w jednym wierszu wszystkie liczby narcystyczne od 1 do n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z liczbami.'],
            constraints: ['1 ≤ n ≤ 1 000 000'],
            examples: [{ input: '500' }],
            hint: R`Dla każdej liczby x: najpierw pętlą policz jej cyfry (k), potem drugą pętlą przejdź po cyfrach i do sumy dodaj cyfrę do potęgi k — a tę potęgę policz trzecią, najbardziej wewnętrzną pętlą (mnożenie k razy). Pracuj na kopiach x, bo pętle cyfr niszczą liczbę.`,
            tests: (r) => ['500', '1', '9', '10', '153', '152', '1000000', '9474', '9473', String(r.int(1000, 1e6))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let x = 1; x <= n; x++) { const s = String(x); const k = s.length; if ([...s].reduce((a, c) => a + Number(c) ** k, 0) === x) o.push(x); } return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int x = 1;
    while (x <= n) {
        int k = 0, kopia = x;
        while (kopia > 0) {
            k++;
            kopia /= 10;
        }
        int suma = 0;
        kopia = x;
        while (kopia > 0) {
            int c = kopia % 10;
            int pot = 1, j = 0;
            while (j < k) {
                pot *= c;
                j++;
            }
            suma += pot;
            kopia /= 10;
        }
        if (suma == x) {
            cout << x << " ";
        }
        x++;
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ trudne
        {
            id: 'wh-szczesliwe-bilety', krok: K, level: 'trudne',
            title: 'Szczęśliwe bilety',
            short: 'Bilet jest szczęśliwy, gdy suma trzech pierwszych cyfr równa się sumie trzech ostatnich.',
            tags: ['while', 'cyfry', 'licznik', 'zera z przodu'],
            statement: ['Bilety tramwajowe mają sześciocyfrowe numery od 000000 do 999999. Bilet jest szczęśliwy, gdy suma trzech pierwszych cyfr jest równa sumie trzech ostatnich, np. 123402 (1 + 2 + 3 = 4 + 0 + 2).', 'Wczytaj numery a i b (jako liczby — zera z przodu są pominięte, np. 2400 to bilet 002400) i wypisz, ile szczęśliwych biletów ma numery od a do b.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ a ≤ b ≤ 999 999'],
            examples: [{ input: '123400 123500' }, { input: '0 999999' }],
            hint: R`Trzy ostatnie cyfry to x % 1000, a trzy pierwsze — x / 1000 (przy zerach z przodu wyjdzie po prostu mniejsza liczba, np. 2 dla 002400, i to jest w porządku). Dla każdej z tych dwóch liczb policz sumę cyfr pętlą i porównaj.`,
            tests: (r) => ['123400 123500', '0 999999', '0 0', '1 1', '1001 1001', '999999 999999', `${r.int(0, 5e5)} ${r.int(5e5, 999999)}`, `${r.int(0, 1000)} ${r.int(1000, 20000)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let c = 0; for (let x = a; x <= b; x++) if (sumCyfr(Math.floor(x / 1000)) === sumCyfr(x % 1000)) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int ile = 0;
    int x = a;
    while (x <= b) {
        int lewa = x / 1000, prawa = x % 1000;
        int sl = 0, sp = 0;
        while (lewa > 0) {
            sl += lewa % 10;
            lewa /= 10;
        }
        while (prawa > 0) {
            sp += prawa % 10;
            prawa /= 10;
        }
        if (sl == sp) {
            ile++;
        }
        x++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-rozklad', krok: K, level: 'trudne',
            title: 'Rozkład na czynniki pierwsze',
            short: 'Zapisz n jako iloczyn liczb pierwszych, np. 360 = 2^3 * 3^2 * 5.',
            tags: ['pętla w pętli', 'd * d <= n', 'long long', 'formatowanie'],
            statement: ['Każdą liczbę większą od 1 da się zapisać jako iloczyn liczb pierwszych, np. 360 = 2 · 2 · 2 · 3 · 3 · 5. Wczytaj n i wypisz jej rozkład w postaci jak w przykładach: czynniki od najmniejszego, oddzielone znakiem * ze spacjami wokół, a gdy czynnik występuje więcej niż raz — z wykładnikiem po znaku ^.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z rozkładem.'],
            constraints: ['2 ≤ n ≤ 10¹²'],
            examples: [{ input: '360' }, { input: '97' }, { input: '1000000000000' }],
            hint: R`Dziel n przez kolejne d od 2, dopóki d * d <= n: wewnętrzna pętla while (n % d == 0) { n /= d; k++; } liczy wykładnik. Jeśli k > 0, wypisz czynnik (z ^k, gdy k > 1). Gdy po pętli n > 1, to, co zostało, jest ostatnią liczbą pierwszą. Przed każdym czynnikiem poza pierwszym wypisz " * ".`,
            tests: (r) => ['360', '97', '1000000000000', '2', '4', '999999999989', '999999999999', '549755813888', '600851475143', '9699690', String(r.int(2, 1e12)), String(r.int(2, 1e6))],
            solve: (inp) => {
                let n = Number(toks(inp)[0]); const o = [];
                for (let d = 2; d * d <= n; d++) { let k = 0; while (n % d === 0) { n /= d; k++; } if (k) o.push(k > 1 ? `${d}^${k}` : `${d}`); }
                if (n > 1) o.push(String(n));
                return o.join(' * ');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    bool pierwszy = true;
    long long d = 2;
    while (d * d <= n) {
        int k = 0;
        while (n % d == 0) {
            n /= d;
            k++;
        }
        if (k > 0) {
            if (!pierwszy) cout << " * ";
            cout << d;
            if (k > 1) cout << "^" << k;
            pierwszy = false;
        }
        d++;
    }
    if (n > 1) {
        if (!pierwszy) cout << " * ";
        cout << n;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-nww', krok: K, level: 'trudne',
            title: 'Wspólny rytm',
            short: 'Po ilu dniach wszystkie autobusy spotkają się znowu? NWW wielu liczb przez NWD.',
            tags: ['pętla w pętli', 'algorytm Euklidesa', 'NWW', 'long long'],
            statement: ['Na pętli autobusowej spotkało się dziś n linii. Linia numer i wraca na pętlę co dokładnie tᵢ minut. Po ilu minutach wszystkie linie znów spotkają się na pętli jednocześnie?', 'Odpowiedzią jest najmniejsza wspólna wielokrotność (NWW) liczb t₁, …, tₙ. Wiadomo, że nie przekracza 10¹⁸.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych tᵢ.'],
            output_format: ['Jedna liczba — NWW.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ tᵢ ≤ 10⁶', 'wynik ≤ 10¹⁸'],
            examples: [{ input: '3\n4 6 10' }, { input: '2\n7 13' }],
            hint: R`NWW dwóch liczb to a / NWD(a, b) * b — najpierw dziel, potem mnóż, żeby nie przekroczyć zakresu. Dla wielu liczb idź po kolei: wynik = 1, a dla każdej kolejnej t: wynik = NWW(wynik, t). NWD licz algorytmem Euklidesa w pętli wewnętrznej — na kopiach zmiennych, wszystko w long long.`,
            tests: (r) => {
                const out = ['3\n4 6 10', '2\n7 13', '1\n1', '1\n1000000', '5\n1 1 1 1 1', '3\n999983 999979 999961'];
                const lcm = (a, b) => a / bgcd(a, b) * b;
                for (let t = 0; t < 5; t++) {
                    const n = r.int(2, 100); const a = []; let l = 1n;
                    while (a.length < n) { const x = r.pick([r.int(1, 60), r.int(1, 1000), r.int(1, 1e6)]); const nl = lcm(l, BigInt(x)); if (nl <= 10n ** 18n) { a.push(x); l = nl; } else if (r() < 0.5) a.push(r.int(1, 12)), l = lcm(l, BigInt(a[a.length - 1])); }
                    if (l <= 10n ** 18n) out.push(`${a.length}\n${a.join(' ')}`);
                }
                return out;
            },
            check: (inp) => { const a = nums(inp).slice(1); let l = 1n; for (const x of a) l = l / bgcd(l, BigInt(x)) * BigInt(x); return l <= 10n ** 18n ? null : 'za duże NWW'; },
            solve: (inp) => { const a = nums(inp).slice(1); let l = 1n; for (const x of a) l = l / bgcd(l, BigInt(x)) * BigInt(x); return String(l); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long wynik = 1;
    int i = 0;
    while (i < n) {
        long long t;
        cin >> t;
        long long a = wynik, b = t;
        while (b != 0) {
            long long r = a % b;
            a = b;
            b = r;
        }
        wynik = wynik / a * t;
        i++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-collatz-rekord', krok: K, level: 'trudne',
            title: 'Rekordzista Collatza',
            short: 'Która liczba od 1 do n ma najdłuższy ciąg Collatza? Uwaga na zakres po drodze.',
            tags: ['pętla w pętli', 'rekord', 'long long'],
            statement: ['Przypomnij sobie problem Collatza z lekcji: parzystą liczbę dzielimy przez 2, nieparzystą zamieniamy na 3n + 1, aż dojdziemy do 1. Liczba kroków zależy od liczby startowej.', 'Wczytaj n i wypisz tę liczbę startową od 1 do n, dla której kroków jest najwięcej (przy remisie — najmniejszą z nich), a po spacji — liczbę jej kroków.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 300 000'],
            examples: [{ input: '10', note: 'Liczba 9 dochodzi do 1 w 19 krokach — najwięcej spośród 1…10.' }, { input: '1' }],
            hint: R`Zewnętrzna pętla po liczbach startowych, wewnętrzna liczy kroki — na kopii w long long! Dla niektórych startów poniżej 300 000 wartości po drodze przekraczają 2 miliardy i int się przepełnia. Rekord aktualizuj tylko przy kroki > rekord (ostra nierówność daje najmniejszą liczbę przy remisie).`,
            tests: (r) => ['10', '1', '2', '3', '27', '300000', '230631', '113383', String(r.int(100, 1e5)), String(r.int(1e5, 3e5))],
            solve: (inp) => { const n = nums(inp)[0]; let best = 1, bk = 0; for (let x = 1; x <= n; x++) { const k = collatz(x); if (k > bk) { bk = k; best = x; } } return `${best} ${bk}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najlepsza = 1, rekord = 0;
    int x = 1;
    while (x <= n) {
        long long y = x;
        int kroki = 0;
        while (y != 1) {
            if (y % 2 == 0) {
                y /= 2;
            } else {
                y = 3 * y + 1;
            }
            kroki++;
        }
        if (kroki > rekord) {
            rekord = kroki;
            najlepsza = x;
        }
        x++;
    }
    cout << najlepsza << " " << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-rozmienianie', krok: K, level: 'trudne',
            title: 'Na ile sposobów zapłacić?',
            short: 'Monety 1, 2 i 5 zł. Na ile sposobów można zapłacić n zł? Pętla w pętli.',
            tags: ['pętla w pętli', 'zliczanie', 'long long'],
            statement: ['Masz dowolnie dużo monet 1 zł, 2 zł i 5 zł. Na ile różnych sposobów możesz zapłacić dokładnie n zł? Sposoby różnią się liczbą monet któregoś rodzaju — kolejność monet nie ma znaczenia.', 'Na przykład 5 zł można zapłacić na 4 sposoby: 5; 2 + 2 + 1; 2 + 1 + 1 + 1; 1 + 1 + 1 + 1 + 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba sposobów.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '5' }, { input: '10' }],
            hint: R`Zewnętrzna pętla: ile piątek (p od 0, dopóki 5 · p <= n). Wewnętrzna: ile dwójek (d od 0, dopóki 5 · p + 2 · d <= n). Gdy piątki i dwójki są ustalone, resztę zawsze da się dopłacić jedynkami — na dokładnie jeden sposób. Wystarczy więc liczyć obroty wewnętrznej pętli.`,
            tests: (r) => ['5', '10', '1', '2', '3', '4', '10000', '9999', String(r.int(10, 1000)), String(r.int(1000, 10000))],
            solve: (inp) => { const n = nums(inp)[0]; let c = 0; for (let p = 0; 5 * p <= n; p++) c += Math.floor((n - 5 * p) / 2) + 1; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long sposoby = 0;
    int p = 0;
    while (5 * p <= n) {
        int d = 0;
        while (5 * p + 2 * d <= n) {
            sposoby++;
            d++;
        }
        p++;
    }
    cout << sposoby << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-palindromy-zegar', krok: K, level: 'trudne',
            title: 'Palindromy na zegarze',
            short: 'Ile razy między dwiema godzinami zegar pokaże palindrom, np. 12:21 albo 05:50?',
            tags: ['while', 'minuty od północy', 'cyfry', '&&'],
            statement: ['Zegar cyfrowy pokazuje godzinę w formacie HH:MM, od 00:00 do 23:59. Godzina jest palindromem, gdy jej cztery cyfry czytane od tyłu dają to samo, np. 12:21, 05:50 albo 00:00.', 'Wczytaj dwie godziny z tego samego dnia (pierwsza nie jest późniejsza od drugiej) i wypisz, ile razy w tym przedziale (włącznie z obiema godzinami) zegar pokaże palindrom.'],
            input_format: ['Jeden wiersz: dwie godziny w formacie HH:MM oddzielone spacją.'],
            output_format: ['Jedna liczba.'],
            constraints: ['00:00 ≤ pierwsza godzina ≤ druga godzina ≤ 23:59'],
            examples: [{ input: '12:00 13:59', note: '12:21 i 13:31.' }, { input: '00:00 23:59' }],
            hint: R`Zamień obie godziny na minuty od północy i przejdź pętlą po każdej minucie x. Godzina to g = x / 60, minuta m = x % 60, a cztery cyfry: g / 10, g % 10, m / 10, m % 10. Palindrom: pierwsza == czwarta && druga == trzecia.`,
            tests: (r) => {
                const t = (m) => `${z2(Math.floor(m / 60))}:${z2(m % 60)}`;
                const out = ['12:00 13:59', '00:00 23:59', '00:00 00:00', '12:21 12:21', '12:22 13:30', '23:32 23:59'];
                for (let i = 0; i < 4; i++) { const a = r.int(0, 1439), b = r.int(a, 1439); out.push(`${t(a)} ${t(b)}`); }
                return out;
            },
            check: (inp) => { const m = inp.match(/(\d+):(\d+)\s+(\d+):(\d+)/); return +m[1] * 60 + +m[2] <= +m[3] * 60 + +m[4] ? null : 'zła kolejność'; },
            solve: (inp) => { const m = inp.match(/(\d+):(\d+)\s+(\d+):(\d+)/).slice(1).map(Number); let c = 0; for (let x = m[0] * 60 + m[1]; x <= m[2] * 60 + m[3]; x++) { const s = z2(Math.floor(x / 60)) + z2(x % 60); if (s[0] === s[3] && s[1] === s[2]) c++; } return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int g1, m1, g2, m2;
    char znak;
    cin >> g1 >> znak >> m1 >> g2 >> znak >> m2;
    int x = g1 * 60 + m1, koniec = g2 * 60 + m2;
    int ile = 0;
    while (x <= koniec) {
        int g = x / 60, m = x % 60;
        if (g / 10 == m % 10 && g % 10 == m / 10) {
            ile++;
        }
        x++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-pascal', krok: K, level: 'trudne',
            title: 'Trójkąt Pascala',
            short: 'Każdy wiersz liczysz wzorem C(w, k + 1) = C(w, k) · (w − k) / (k + 1) — bez tablic.',
            tags: ['pętla w pętli', 'kolejność działań', 'long long'],
            statement: ['W trójkącie Pascala każdy wiersz zaczyna się i kończy jedynką, a każda inna liczba jest sumą dwóch liczb stojących nad nią. Pierwsze wiersze to: 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1.', 'Wczytaj n i wypisz n pierwszych wierszy (liczby w wierszu oddzielone spacjami). Liczbę numer k + 1 w wierszu numer w (licząc oba od 0) możesz obliczyć z poprzedniej liczby x w tym samym wierszu: x · (w − k) / (k + 1) — dzielenie zawsze wychodzi równo.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy trójkąta Pascala.'],
            constraints: ['1 ≤ n ≤ 60'],
            examples: [{ input: '5' }],
            hint: R`W wierszu w zacznij od x = 1, wypisz je, a potem dla k od 0 do w − 1: x = x * (w - k) / (k + 1); i wypisz x. Najpierw mnożenie, potem dzielenie — odwrotna kolejność dałaby złe (ucięte) wyniki. Największe liczby w 60. wierszu mają 17 cyfr, a iloczyn po drodze jeszcze więcej — long long ledwo wystarcza.`,
            tests: (r) => ['5', '1', '2', '60', '30', String(r.int(6, 59))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let w = 0; w < n; w++) { let x = 1n; const row = [x]; for (let k = 0; k < w; k++) { x = x * BigInt(w - k) / BigInt(k + 1); row.push(x); } o.push(row.join(' ')); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 0;
    while (w < n) {
        long long x = 1;
        cout << x;
        int k = 0;
        while (k < w) {
            x = x * (w - k) / (k + 1);
            cout << " " << x;
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-dziennik-pogody', krok: K, level: 'trudne',
            title: 'Wielki finał: dziennik pogody',
            short: 'Temperatury do końca danych: liczba dni, średnia, rekordy z datą, najdłuższy mróz i ocieplenia.',
            tags: ['while (cin >> t)', 'rekordy', 'seria', 'setprecision', 'wszystko naraz'],
            statement: ['Stacja meteo zapisuje temperaturę w południe każdego dnia. Na wejściu są kolejne pomiary (liczby całkowite), dzień po dniu, aż do końca danych — nie wiadomo z góry, ile ich jest. Dni numerujemy od 1.', 'Wypisz raport w sześciu wierszach, dokładnie w formacie jak w przykładzie: liczbę dni; średnią temperaturę z dwoma miejscami po przecinku; najwyższą temperaturę i numer dnia, w którym wystąpiła po raz pierwszy; to samo dla najniższej; długość najdłuższej serii kolejnych dni z mrozem (temperaturą poniżej zera; 0, jeśli mrozu nie było); liczbę dni cieplejszych niż dzień poprzedni.'],
            input_format: ['Liczby całkowite oddzielone spacjami lub enterami.'],
            output_format: ['Sześć wierszy raportu.'],
            constraints: ['od 1 do 10 000 pomiarów', 'każdy pomiar od −60 do 60'],
            examples: [{ input: '3 -2 -5 1 -1 -4 -4 6 6' }],
            hint: R`Jedna pętla while (cin >> t), a w niej wszystko po kolei: licznik dni i suma; rekord ciepła i zimna z numerem dnia (ostra nierówność — zostaje pierwszy dzień); seria mrozu (t < 0 ? seria++ : seria = 0) i jej rekord; porównanie z poprzednim dniem (tylko od drugiego dnia!) i na koniec obrotu poprz = t. Średnia po pętli: (double)suma / dni.`,
            tests: (r) => {
                const out = ['3 -2 -5 1 -1 -4 -4 6 6', '5', '-7', '0 0 0', '-1 -2 -3 -4 1 2 3 4'];
                while (out.length < 11) {
                    const n = r.pick([r.int(2, 30), r.int(100, 10000)]); let t = r.int(-20, 20); const a = [];
                    for (let i = 0; i < n; i++) { t = Math.max(-60, Math.min(60, t + r.int(-5, 5))); a.push(t); }
                    if (safe(a.reduce((s, x) => s + x, 0) / n, 2)) out.push(a.join(r.pick([' ', '\n'])));
                }
                return out;
            },
            check: (inp) => { const a = nums(inp); return safe(a.reduce((s, x) => s + x, 0) / a.length, 2) ? null : 'połówka'; },
            solve: (inp) => {
                const a = nums(inp); const n = a.length;
                let mx = a[0], dmx = 1, mn = a[0], dmn = 1, ser = 0, best = 0, ciep = 0;
                a.forEach((t, i) => {
                    if (t > mx) { mx = t; dmx = i + 1; }
                    if (t < mn) { mn = t; dmn = i + 1; }
                    ser = t < 0 ? ser + 1 : 0; best = Math.max(best, ser);
                    if (i > 0 && t > a[i - 1]) ciep++;
                });
                return join(`dni: ${n}`, `srednia: ${fx(a.reduce((s, x) => s + x, 0) / n, 2)}`, `najcieplej: ${mx} (dzien ${dmx})`, `najzimniej: ${mn} (dzien ${dmn})`, `najdluzszy mroz: ${best}`, `ocieplenia: ${ciep}`);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int t;
    int dni = 0, suma = 0;
    int maks = 0, dzienMaks = 0, mini = 0, dzienMini = 0;
    int seria = 0, najdluzsza = 0;
    int poprz = 0, ocieplenia = 0;
    while (cin >> t) {
        dni++;
        suma += t;
        if (dni == 1 || t > maks) {
            maks = t;
            dzienMaks = dni;
        }
        if (dni == 1 || t < mini) {
            mini = t;
            dzienMini = dni;
        }
        if (t < 0) {
            seria++;
        } else {
            seria = 0;
        }
        if (seria > najdluzsza) {
            najdluzsza = seria;
        }
        if (dni > 1 && t > poprz) {
            ocieplenia++;
        }
        poprz = t;
    }
    cout << "dni: " << dni << "\n";
    cout << "srednia: " << fixed << setprecision(2) << (double)suma / dni << "\n";
    cout << "najcieplej: " << maks << " (dzien " << dzienMaks << ")\n";
    cout << "najzimniej: " << mini << " (dzien " << dzienMini << ")\n";
    cout << "najdluzszy mroz: " << najdluzsza << "\n";
    cout << "ocieplenia: " << ocieplenia << "\n";
    return 0;
}`,
        },
    ];
};
