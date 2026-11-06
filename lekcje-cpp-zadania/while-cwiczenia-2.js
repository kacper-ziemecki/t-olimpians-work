// While loop — ćwiczenia w trakcie lekcji, części 5–8: cyfry liczby i znaki napisu, pętle „aż do skutku”
// (nie wiadomo z góry, ile będzie obrotów), break / continue / while (true) / do … while, pętla w pętli.
module.exports = (h) => {
    const { nums, toks, lines, join } = h;
    const R = String.raw;
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const big = (r, cyfr) => { let s = String(r.int(1, 9)); while (s.length < cyfr) s += r.int(0, 9); return s; };
    const pierwsza = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };

    return [
        // ================================================================ KROK 5 · cyfry liczby i znaki napisu
        {
            id: 'wh-ile-cyfr', krok: 5, level: 'latwe',
            title: 'Ile cyfr ma liczba?',
            short: 'Obcinaj ostatnią cyfrę przez n /= 10 i licz, ile razy się udało.',
            tags: ['while', 'n /= 10', 'long long'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n i wypisz, z ilu cyfr się składa.', 'Rozwiąż to pętlą na liczbie — nie wczytuj jej jako napisu.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba cyfr.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4821' }, { input: '7' }],
            hint: R`Dzielenie całkowite przez 10 obcina ostatnią cyfrę: 4821 / 10 = 482. Rób n /= 10; i ile++; tak długo, jak n > 0. Liczba 10¹⁸ nie mieści się w int, więc n musi być long long.`,
            tests: (r) => ['4821', '7', '1', '9', '10', '99', '100', '1000000000000000000', '999999999999999999', big(r, 5), big(r, 12), big(r, 17)],
            solve: (inp) => String(toks(inp)[0].length),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int ile = 0;
    while (n > 0) {
        n /= 10;
        ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-suma-cyfr', krok: 5, level: 'latwe',
            title: 'Suma cyfr',
            short: 'n % 10 to ostatnia cyfra, n /= 10 ją obcina — dodawaj cyfry, aż liczba się skończy.',
            tags: ['while', 'n % 10', 'n /= 10'],
            statement: ['Wczytaj liczbę całkowitą nieujemną n i wypisz sumę jej cyfr.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma cyfr.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4821', note: '4 + 8 + 2 + 1 = 15' }, { input: '0' }],
            hint: R`W każdym obrocie: suma += n % 10; (dokładasz ostatnią cyfrę), n /= 10; (obcinasz ją). Dla n = 0 pętla while (n > 0) nie wykona się ani razu i suma zostanie 0 — tak ma być.`,
            tests: (r) => ['4821', '0', '5', '10', '999999999999999999', '1000000000000000000', '123456789', big(r, 8), big(r, 15), big(r, 18)],
            solve: (inp) => String([...toks(inp)[0]].reduce((s, c) => s + Number(c), 0)),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int suma = 0;
    while (n > 0) {
        suma += n % 10;
        n /= 10;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-cyfry-od-konca', krok: 5, level: 'latwe',
            title: 'Cyfry od końca',
            short: 'Wypisz cyfry liczby od ostatniej do pierwszej, oddzielone spacjami.',
            tags: ['while', 'n % 10', 'n /= 10'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n i wypisz w jednym wierszu jej cyfry w odwrotnej kolejności — od ostatniej do pierwszej — oddzielone spacjami.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z cyframi oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4821' }, { input: '1200' }],
            hint: R`Pętla „odcinająca” cyfry naturalnie idzie od końca: w każdym obrocie wypisz n % 10 i spację, potem n /= 10;. Zera w środku i na końcu liczby też są cyframi — 1200 daje 0 0 2 1.`,
            tests: (r) => ['4821', '1200', '7', '10', '1000000000000000000', big(r, 6), big(r, 13), big(r, 18)],
            solve: (inp) => [...toks(inp)[0]].reverse().join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    while (n > 0) {
        cout << n % 10 << " ";
        n /= 10;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-odwroc-liczbe', krok: 5, level: 'srednie',
            title: 'Odwrócona liczba',
            short: 'Zbuduj liczbę z cyfr wziętych od końca: wynik = wynik * 10 + cyfra.',
            tags: ['while', 'budowanie liczby', 'long long'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n i wypisz liczbę, która powstaje z zapisania cyfr n w odwrotnej kolejności. Zera, które znajdą się na początku, znikają — odwróceniem 1200 jest 21.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — n zapisane od tyłu.'],
            constraints: ['1 ≤ n ≤ 10⁹'],
            examples: [{ input: '1234' }, { input: '1200' }],
            hint: R`Zacznij od wynik = 0. W każdym obrocie: wynik = wynik * 10 + n % 10; n /= 10;. Mnożenie przez 10 przesuwa dotychczasowe cyfry w lewo i robi miejsce na nową. Odwrócenie 999999999 ma 10 cyfr — wynik trzymaj w long long.`,
            tests: (r) => ['1234', '1200', '5', '10', '1000000000', '999999999', '123456789', String(r.int(1, 1e9)), String(r.int(1, 99999))],
            solve: (inp) => String(BigInt([...toks(inp)[0]].reverse().join(''))),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long wynik = 0;
    while (n > 0) {
        wynik = wynik * 10 + n % 10;
        n /= 10;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-palindrom-liczbowy', krok: 5, level: 'srednie',
            title: 'Liczbowy palindrom',
            short: 'Czy liczba czytana od tyłu jest taka sama? Odwróć ją i porównaj z oryginałem.',
            tags: ['while', 'kopia zmiennej', 'odwracanie'],
            statement: ['Palindrom to coś, co czytane od tyłu wygląda tak samo, np. 12321 albo 4444. Wczytaj liczbę n i wypisz TAK, jeśli jest palindromem, albo NIE w przeciwnym razie.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 10¹⁷'],
            examples: [{ input: '12321' }, { input: '1231' }],
            hint: R`Pętla odwracająca niszczy n (na końcu jest 0). Zrób więc kopię: long long kopia = n; i odwracaj kopię. Po pętli porównaj odwróconą liczbę z oryginalnym n.`,
            tests: (r) => {
                const pal = (k) => { const s = big(r, k); return s + [...s].reverse().join('').slice(1); };
                return ['12321', '1231', '7', '10', '11', '100', '1001', '100000000000000000', '99999999999999999', pal(5), pal(9), big(r, 12), pal(2) + '0'];
            },
            solve: (inp) => { const s = toks(inp)[0]; return s === [...s].reverse().join('') ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long kopia = n;
    long long odwrocona = 0;
    while (kopia > 0) {
        odwrocona = odwrocona * 10 + kopia % 10;
        kopia /= 10;
    }
    if (odwrocona == n) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'wh-najwieksza-cyfra', krok: 5, level: 'srednie',
            title: 'Największa cyfra',
            short: 'Która cyfra liczby jest największa i ile razy występuje?',
            tags: ['while', 'cyfry', 'maksimum', 'licznik'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n. Wypisz jej największą cyfrę, a po spacji — ile razy ta cyfra występuje w liczbie n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '39193' }, { input: '1000' }],
            hint: R`Najprościej dwiema pętlami: pierwsza znajduje największą cyfrę (maksimum zaczyna od 0, bo cyfry nie są ujemne), druga — na kopii liczby — liczy, ile cyfr jest jej równych. Da się też jedną pętlą: gdy trafisz na cyfrę większą od maksimum, ustaw maksimum i licznik = 1; gdy równą — licznik++.`,
            tests: (r) => ['39193', '1000', '7', '999999999999999999', '1000000000000000000', '123456789', '987654321', big(r, 10), big(r, 18), big(r, 4)],
            solve: (inp) => { const d = [...toks(inp)[0]].map(Number); const m = Math.max(...d); return `${m} ${d.filter((x) => x === m).length}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int maks = 0, ile = 0;
    while (n > 0) {
        int c = n % 10;
        if (c > maks) {
            maks = c;
            ile = 1;
        } else if (c == maks) {
            ile++;
        }
        n /= 10;
    }
    cout << maks << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-litera-w-slowie', krok: 5, level: 'latwe',
            title: 'Ile razy ta litera?',
            short: 'Przejdź po słowie znak po znaku i policz wystąpienia podanej litery.',
            tags: ['while', 's[i]', 's.length()'],
            statement: ['Wczytaj słowo s (same małe litery) i jedną literę c. Wypisz, ile razy litera c występuje w słowie s.'],
            input_format: ['Jeden wiersz: słowo s, spacja i litera c.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ długość s ≤ 1000'],
            examples: [{ input: 'abrakadabra a' }, { input: 'kot z' }],
            hint: R`Indeks i biegnie od 0 do s.length() − 1, czyli warunek i < s.length(). W pętli: if (s[i] == c) ile++;. Literę c trzymaj w zmiennej typu char.`,
            tests: (r) => ['abrakadabra a', 'kot z', 'a a', 'a b', `${'z'.repeat(1000)} z`, `${r.word(1000, 'ab')} a`, `${r.word(50)} ${r.pick([...LITERY])}`, `${r.word(300, 'xyz')} y`],
            solve: (inp) => { const [s, c] = toks(inp); return String([...s].filter((x) => x === c).length); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    char c;
    cin >> s >> c;
    int ile = 0;
    int i = 0;
    while (i < s.length()) {
        if (s[i] == c) {
            ile++;
        }
        i++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-slowo-wspak', krok: 5, level: 'latwe',
            title: 'Słowo wspak',
            short: 'Wypisz słowo od ostatniej litery do pierwszej.',
            tags: ['while', 'i--', 's[i]'],
            statement: ['Wczytaj jedno słowo i wypisz je od tyłu — od ostatniej litery do pierwszej.'],
            input_format: ['Jedno słowo złożone z liter i cyfr.'],
            output_format: ['To samo słowo zapisane wspak.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'kajak' }, { input: 'programowanie' }],
            hint: R`Ostatni znak ma indeks s.length() − 1. Zacznij od int i = s.length() - 1; i idź w dół, dopóki i >= 0, wypisując s[i]. Ważne: i musi być typu int — wtedy po zerze może zejść do −1 i pętla się zakończy.`,
            tests: (r) => ['kajak', 'programowanie', 'a', 'ab', 'Olimpiada2026', r.word(1000), r.word(37, 'abcXYZ019')],
            solve: (inp) => [...toks(inp)[0]].reverse().join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int i = s.length() - 1;
    while (i >= 0) {
        cout << s[i];
        i--;
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · aż do skutku
        {
            id: 'wh-polowienie', krok: 6, level: 'latwe',
            title: 'Dziel na pół',
            short: 'Ile razy trzeba podzielić n przez 2 (całkowicie), żeby zostało 1?',
            tags: ['while', 'nieznana liczba obrotów', 'n /= 2'],
            statement: ['Liczbę n dzielimy przez 2, odrzucając resztę (dzielenie całkowite), potem wynik znów przez 2 i tak dalej — aż zostanie 1. Wypisz, ile dzieleń trzeba wykonać.', 'Na przykład 13 → 6 → 3 → 1, czyli 3 dzielenia.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba dzieleń.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '13' }, { input: '1' }],
            hint: R`Tym razem nie wiesz z góry, ile będzie obrotów — pętla po prostu kręci się, dopóki n > 1. W środku: n /= 2; ile++;. Dla n = 1 nie trzeba nic dzielić, więc wynik to 0.`,
            tests: (r) => ['13', '1', '2', '3', '1024', '1023', '1000000000000000000', '576460752303423488', big(r, 10), big(r, 17)],
            solve: (inp) => { let n = BigInt(toks(inp)[0]); let c = 0; while (n > 1n) { n /= 2n; c++; } return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int ile = 0;
    while (n > 1) {
        n /= 2;
        ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-skarbonka', krok: 6, level: 'latwe',
            title: 'Skarbonka',
            short: 'Co tydzień wkładasz o d zł więcej. Po ilu tygodniach uzbierasz co najmniej c zł?',
            tags: ['while', 'suma do progu', 'dwie zmienne'],
            statement: ['W pierwszym tygodniu wkładasz do skarbonki a zł, a w każdym następnym o d zł więcej niż w poprzednim (d może być zerem). Po ilu tygodniach w skarbonce będzie co najmniej c zł?'],
            input_format: ['Jeden wiersz z liczbami a, d i c.'],
            output_format: ['Jedna liczba — liczba tygodni.'],
            constraints: ['1 ≤ a ≤ 1000', '0 ≤ d ≤ 1000', '1 ≤ c ≤ 1 000 000'],
            examples: [{ input: '10 5 100', note: '10 + 15 + 20 + 25 + 30 = 100 po 5 tygodniach.' }, { input: '50 0 120' }],
            hint: R`Zmienne: suma (start 0), wplata (start a), tygodnie (start 0). Pętla: while (suma < c) { suma += wplata; wplata += d; tygodnie++; }. Warunek mówi „jeszcze nie uzbierałem” — gdy stanie się fałszywy, cel jest osiągnięty.`,
            tests: (r) => ['10 5 100', '50 0 120', '1 0 1', '1000 1000 1', '1 0 1000000', '1 1 1000000', '1000 0 1000000', `${r.int(1, 1000)} ${r.int(0, 1000)} ${r.int(1, 1e6)}`, `${r.int(1, 50)} ${r.int(0, 5)} ${r.int(1000, 1e6)}`],
            solve: (inp) => { const [a, d, c] = nums(inp); let s = 0, w = a, t = 0; while (s < c) { s += w; w += d; t++; } return String(t); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, d, c;
    cin >> a >> d >> c;
    int suma = 0, wplata = a, tygodnie = 0;
    while (suma < c) {
        suma += wplata;
        wplata += d;
        tygodnie++;
    }
    cout << tygodnie << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-potega-ponad', krok: 6, level: 'latwe',
            title: 'Pierwsza potęga dwójki ponad n',
            short: 'Mnóż przez 2, aż przekroczysz n albo go dogonisz.',
            tags: ['while', 'p *= 2', 'long long'],
            statement: ['Wczytaj n i wypisz najmniejszą potęgę dwójki (1, 2, 4, 8, …), która jest większa od n albo równa n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — szukana potęga dwójki.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '100' }, { input: '64' }],
            hint: R`long long p = 1; while (p < n) p *= 2;. Po pętli p jest pierwszą potęgą, która „dogoniła” n. Dla n = 10¹⁸ wynikiem jest 2⁶⁰ — mieści się w long long, ale nie w int.`,
            tests: (r) => ['100', '64', '1', '2', '3', '1000000000000000000', '576460752303423488', '576460752303423489', '2147483647', big(r, 9), big(r, 16)],
            solve: (inp) => { const n = BigInt(toks(inp)[0]); let p = 1n; while (p < n) p *= 2n; return String(p); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long p = 1;
    while (p < n) {
        p *= 2;
    }
    cout << p << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-collatz', krok: 6, level: 'srednie',
            title: 'Problem Collatza',
            short: 'Parzystą dziel przez 2, nieparzystą zamień na 3n + 1 — aż dojdziesz do 1.',
            tags: ['while (n != 1)', 'if … else w pętli'],
            statement: ['Weź liczbę n. Jeśli jest parzysta, podziel ją przez 2, a jeśli nieparzysta — pomnóż przez 3 i dodaj 1. Z nową liczbą zrób to samo i tak dalej, aż dojdziesz do 1. Matematycy podejrzewają, że zawsze się do 1 dochodzi, ale nikt jeszcze tego nie udowodnił!', 'Wypisz w pierwszym wierszu wszystkie liczby, przez które przechodzisz (od n do 1, oddzielone spacjami), a w drugim — liczbę wykonanych kroków.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: ciąg liczb i liczba kroków.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '6', note: '6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1, czyli 8 kroków.' }, { input: '1' }],
            hint: R`Wypisz n jeszcze przed pętlą. Pętla: while (n != 1) { if (n % 2 == 0) n /= 2; else n = 3 * n + 1; wypisz n; kroki++; }. Dla 27 ciąg ma aż 111 kroków i dochodzi do 9232 — sprawdź!`,
            tests: (r) => ['6', '1', '2', '3', '27', '9999', '6171', '10000', String(r.int(4, 10000)), String(r.int(100, 1000))],
            solve: (inp) => { let n = nums(inp)[0]; const o = [n]; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; o.push(n); } return join(o.join(' '), String(o.length - 1)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int kroki = 0;
    cout << n;
    while (n != 1) {
        if (n % 2 == 0) {
            n /= 2;
        } else {
            n = 3 * n + 1;
        }
        cout << " " << n;
        kroki++;
    }
    cout << "\n" << kroki << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-lokata', krok: 6, level: 'srednie',
            title: 'Lokata w banku',
            short: 'Co rok bank dopisuje p% odsetek. Po ilu latach uzbierasz wymarzoną kwotę?',
            tags: ['while', 'liczenie w groszach', 'long long'],
            statement: ['Wpłacasz na lokatę k zł. Na koniec każdego roku bank dopisuje odsetki: p% kwoty, która jest na lokacie, zaokrąglone w dół do pełnego grosza. Po ilu latach na lokacie będzie co najmniej c zł?', 'Przykład: 100 zł na 10% — po roku 110,00 zł, po dwóch 121,00 zł, po trzech 133,10 zł.'],
            input_format: ['Jeden wiersz z liczbami całkowitymi k, p i c — kwota w złotych, oprocentowanie w procentach i cel w złotych.'],
            output_format: ['Jedna liczba — liczba lat.'],
            constraints: ['1 ≤ k < c ≤ 10 000 000', '1 ≤ p ≤ 50'],
            examples: [{ input: '100 10 130' }, { input: '1000 5 2000' }],
            hint: R`Licz w groszach na liczbach całkowitych, żeby uniknąć błędów double: kwota = k * 100, cel = c * 100. Odsetki to kwota * p / 100 (dzielenie całkowite samo zaokrągla w dół). Iloczyn kwota * p może przekroczyć int — użyj long long.`,
            tests: (r) => ['100 10 130', '1000 5 2000', '1 1 2', '1 50 10000000', '9999999 1 10000000', '1 1 10000000', `${r.int(1, 1000)} ${r.int(1, 50)} ${r.int(2000, 1e7)}`, `${r.int(1000, 1e5)} ${r.int(1, 10)} ${r.int(1e5 + 1, 1e7)}`],
            check: (inp) => { const [k, , c] = nums(inp); return k < c ? null : 'k >= c'; },
            solve: (inp) => { const [k, p, c] = nums(inp); let x = k * 100, l = 0; while (x < c * 100) { x += Math.floor(x * p / 100); l++; } return String(l); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long k, p, c;
    cin >> k >> p >> c;
    long long kwota = k * 100;
    long long cel = c * 100;
    int lata = 0;
    while (kwota < cel) {
        kwota += kwota * p / 100;
        lata++;
    }
    cout << lata << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-nwd', krok: 6, level: 'srednie',
            title: 'Największy wspólny dzielnik',
            short: 'Algorytm Euklidesa: zamieniaj parę (a, b) na (b, a % b), aż b będzie zerem.',
            tags: ['while (b != 0)', 'algorytm Euklidesa', '%'],
            statement: ['Największy wspólny dzielnik (NWD) dwóch liczb to największa liczba, przez którą dzielą się obie, np. NWD(12, 18) = 6.', 'Wczytaj a i b i wypisz NWD(a, b). Liczby są duże — sprawdzanie wszystkich kandydatów po kolei będzie za wolne, użyj algorytmu Euklidesa z lekcji.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba — NWD(a, b).'],
            constraints: ['1 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '12 18' }, { input: '17 5' }],
            hint: R`Dopóki b != 0: zapamiętaj r = a % b, potem a = b; b = r;. Gdy b dojdzie do zera, wynikiem jest a. Potrzebna jest trzecia zmienna — tak jak przy zamianie miejscami z lekcji o if.`,
            tests: (r) => ['12 18', '17 5', '1 1', '1000000000 1', '1000000000 999999999', '999999937 999999929', '832040 514229', '1000000000 500000000', `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e4) * 360} ${r.int(1, 1e4) * 360}`],
            solve: (inp) => { let [a, b] = nums(inp); while (b !== 0) { const t = a % b; a = b; b = t; } return String(a); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    cout << a << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-piramida-z-klockow', krok: 6, level: 'srednie',
            title: 'Piramida z klocków',
            short: 'Rzędy po 1, 2, 3, … klocki. Ile pełnych rzędów ułożysz i ile klocków zostanie?',
            tags: ['while', 'odejmowanie do skutku', 'long long'],
            statement: ['Układasz piramidę od góry: w pierwszym rzędzie 1 klocek, w drugim 2, w trzecim 3 i tak dalej. Masz n klocków. Wypisz, ile pełnych rzędów da się ułożyć, a po spacji — ile klocków zostanie (za mało na kolejny pełny rząd).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 10¹²'],
            examples: [{ input: '12', note: '1 + 2 + 3 + 4 = 10, a na piąty rząd brakuje klocków — zostają 2.' }, { input: '10' }],
            hint: R`Zmienna rzad zaczyna od 1. Dopóki starcza klocków na kolejny rząd (n >= rzad), odejmij je: n -= rzad; i przejdź do następnego rzędu. Po pętli pełnych rzędów jest rzad − 1, a w n zostaje reszta. Dla 10¹² rzędów będzie ok. 1,4 miliona — pętla zdąży.`,
            tests: (r) => ['12', '10', '1', '2', '3', '1000000000000', '999999999999', '500000500000', String(r.int(1, 1e6)), String(r.int(1e9, 1e12))],
            solve: (inp) => { let n = Number(toks(inp)[0]); let k = 1; while (n >= k) { n -= k; k++; } return `${k - 1} ${n}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long rzad = 1;
    while (n >= rzad) {
        n -= rzad;
        rzad++;
    }
    cout << rzad - 1 << " " << n << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 7 · break, continue, do-while
        {
            id: 'wh-pierwsza-ujemna', krok: 7, level: 'latwe',
            title: 'Pierwsza ujemna',
            short: 'Na którym miejscu stoi pierwsza liczba ujemna? Gdy ją znajdziesz — break.',
            tags: ['while', 'break', 'pozycja'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Wypisz numer pozycji (licząc od 1), na której stoi pierwsza liczba ujemna. Jeśli żadna liczba nie jest ujemna, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −1000 do 1000'],
            examples: [{ input: '6\n4 0 7 -2 5 -9' }, { input: '3\n1 2 3' }],
            hint: R`Zmienna pozycja = 0 oznacza „jeszcze nie znalazłem”. W pętli: gdy x < 0, zapisz pozycja = i i wyjdź z pętli instrukcją break;. Po pętli: if (pozycja == 0) BRAK, w przeciwnym razie pozycja. Reszty liczb nie musisz wczytywać.`,
            tests: (r) => {
                const a = r.arr(1000, 0, 1000); a[999] = -1; const b = r.arr(1000, 0, 1000); b[r.int(100, 900)] = -r.int(1, 1000);
                return ['6\n4 0 7 -2 5 -9', '3\n1 2 3', '1\n-5', '1\n0', '4\n-1 -2 -3 -4', `1000\n${a.join(' ')}`, `1000\n${b.join(' ')}`, `1000\n${r.arr(1000, 0, 1000).join(' ')}`, `20\n${r.arr(20, -5, 5).join(' ')}`];
            },
            solve: (inp) => { const a = nums(inp).slice(1); const i = a.findIndex((x) => x < 0); return i < 0 ? 'BRAK' : String(i + 1); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int pozycja = 0;
    int i = 1;
    while (i <= n) {
        int x;
        cin >> x;
        if (x < 0) {
            pozycja = i;
            break;
        }
        i++;
    }
    if (pozycja == 0) {
        cout << "BRAK\n";
    } else {
        cout << pozycja << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'wh-bez-wielokrotnosci', krok: 7, level: 'latwe',
            title: 'Pomiń wielokrotności',
            short: 'Wypisz liczby od 1 do n, pomijając wielokrotności k — z continue i bez zawieszenia.',
            tags: ['while', 'continue', 'pułapka z i++'],
            statement: ['Wczytaj n i k. Wypisz w jednym wierszu wszystkie liczby od 1 do n oprócz tych, które dzielą się przez k. Jest pewne, że wypiszesz co najmniej jedną liczbę.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz z liczbami oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 10 000', '2 ≤ k ≤ 10 000'],
            examples: [{ input: '10 3' }, { input: '7 2' }],
            hint: R`Najpierw zwiększ licznik, potem decyduj: int i = 0; while (i < n) { i++; if (i % k == 0) continue; wypisz i; }. Gdyby i++ stało na końcu, continue by je przeskoczyło i pętla kręciłaby się w nieskończoność na tej samej liczbie.`,
            tests: (r) => ['10 3', '7 2', '1 2', '10000 2', '10000 10000', '5 7', `${r.int(100, 10000)} ${r.int(2, 50)}`],
            solve: (inp) => { const [n, k] = nums(inp); const o = []; for (let i = 1; i <= n; i++) if (i % k) o.push(i); return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int i = 0;
    while (i < n) {
        i++;
        if (i % k == 0) {
            continue;
        }
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-haslo', krok: 7, level: 'latwe',
            title: 'Trzecia próba hasła',
            short: 'Sprawdzaj kolejne próby, aż padnie poprawne hasło — while (true) i break.',
            tags: ['while (true)', 'break', 'string'],
            statement: ['W pierwszym wierszu jest poprawne hasło, a w kolejnych wierszach — hasła, które po kolei wpisuje użytkownik. Wiadomo, że w którymś momencie wpisze poprawne.', 'Dla każdej błędnej próby wypisz Proba k: zle haslo, a dla poprawnej — Proba k: witaj! (k to numer próby, od 1). Po poprawnym haśle zakończ program — dalszych wierszy nie czytaj.'],
            input_format: ['W pierwszym wierszu poprawne hasło, w następnych — próby. Hasła to słowa bez spacji.'],
            output_format: ['Po jednym wierszu dla każdej próby, aż do poprawnej włącznie.'],
            constraints: ['co najwyżej 1000 prób', 'hasła mają od 1 do 20 znaków'],
            examples: [{ input: 'tajne123\nhaslo\nTajne123\ntajne123\nkot' }],
            hint: R`while (true) { cin >> proba; numer++; if (proba == haslo) { wypisz witaj!; break; } wypisz zle haslo; }. Warunek wyjścia jest w środku pętli, więc while (true) z break pasuje tu idealnie.`,
            tests: (r) => {
                const out = ['tajne123\nhaslo\nTajne123\ntajne123\nkot', 'a\na', 'abc\nab\nabcd\nABC\nabc'];
                for (let t = 0; t < 4; t++) {
                    const pw = r.word(r.int(3, 12), 'abc01'); const n = r.int(1, t === 3 ? 1000 : 30); const p = [];
                    while (p.length < n - 1) { const w = r.word(r.int(1, 12), 'abc01'); if (w !== pw) p.push(w); }
                    p.push(pw); p.push(r.word(5)); out.push([pw, ...p].join('\n'));
                }
                return out;
            },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 1; i < t.length; i++) { if (t[i] === t[0]) { o.push(`Proba ${i}: witaj!`); break; } o.push(`Proba ${i}: zle haslo`); } return o.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string haslo, proba;
    cin >> haslo;
    int numer = 0;
    while (true) {
        cin >> proba;
        numer++;
        if (proba == haslo) {
            cout << "Proba " << numer << ": witaj!\n";
            break;
        }
        cout << "Proba " << numer << ": zle haslo\n";
    }
    return 0;
}`,
        },
        {
            id: 'wh-budzet', krok: 7, level: 'srednie',
            title: 'Zakupy z budżetem',
            short: 'Kupuj po kolei, aż zabraknie pieniędzy na następną rzecz — wtedy break.',
            tags: ['while', 'break', 'licznik i suma'],
            statement: ['Masz b zł i listę n rzeczy do kupienia z ich cenami. Kupujesz po kolei, zaczynając od pierwszej. Gdy zabraknie Ci pieniędzy na kolejną rzecz z listy, kończysz zakupy (nie przeskakujesz jej i nie kupujesz już niczego dalej).', 'Wypisz, ile rzeczy kupisz, a po spacji — ile pieniędzy Ci zostanie.'],
            input_format: ['W pierwszym wierszu liczby n i b, w drugim n cen.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ b ≤ 10⁹', '1 ≤ każda cena ≤ 10⁶'],
            examples: [{ input: '5 100\n30 20 60 10 5', note: 'Kupujesz za 30 i 20 zł, zostaje 50 zł — za mało na rzecz za 60 zł, więc koniec zakupów.' }, { input: '3 1000\n100 200 300' }],
            hint: R`W pętli wczytaj cenę i sprawdź: if (cena > b) break;. W przeciwnym razie odejmij cenę od b i zwiększ licznik kupionych rzeczy. Po pętli wypisz licznik i b.`,
            tests: (r) => ['5 100\n30 20 60 10 5', '3 1000\n100 200 300', '1 0\n1', '1 5\n5', '2 5\n6 1', `1000 1000000000\n${r.arr(1000, 1, 1e6).join(' ')}`, `1000 ${r.int(1e5, 1e8)}\n${r.arr(1000, 1, 1e6).join(' ')}`, `50 ${r.int(100, 1000)}\n${r.arr(50, 1, 100).join(' ')}`],
            solve: (inp) => { const a = nums(inp); let b = a[1], k = 0; for (const c of a.slice(2)) { if (c > b) break; b -= c; k++; } return `${k} ${b}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, b;
    cin >> n >> b;
    int kupione = 0;
    int i = 0;
    while (i < n) {
        int cena;
        cin >> cena;
        if (cena > b) {
            break;
        }
        b -= cena;
        kupione++;
        i++;
    }
    cout << kupione << " " << b << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-szostki', krok: 7, level: 'srednie',
            title: 'Rzucaj, dopóki szóstka',
            short: 'Gracz rzuca kostką co najmniej raz, a dalej — dopóki wypada 6. Idealne do do … while.',
            tags: ['do … while', 'suma'],
            statement: ['W grze planszowej gracz rzuca kostką i przesuwa pionek o tyle pól, ile wyrzucił. Gdy wyrzuci szóstkę, rzuca jeszcze raz — i tak dalej, aż wypadnie coś innego niż 6.', 'Na wejściu są kolejne wyniki rzutów kostką (dalsze wiersze, po zakończonym ruchu, należą już do następnego gracza i nie są Ci potrzebne). Wypisz, o ile pól przesunie się pionek, a po spacji — ile razy gracz rzucał.'],
            input_format: ['Kolejne wyniki rzutów (liczby od 1 do 6), oddzielone spacjami lub enterami. Na pewno w którymś momencie wypada liczba różna od 6.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['co najwyżej 1000 rzutów'],
            examples: [{ input: '6 6 3 5 1' }, { input: '2 6 6' }],
            hint: R`Pierwszy rzut jest zawsze, a o następnym decyduje dopiero jego wynik — to dokładnie do { cin >> k; suma += k; rzuty++; } while (k == 6);. Warunek sprawdzany jest po wykonaniu ciała, więc ciało wykona się co najmniej raz.`,
            tests: (r) => {
                const out = ['6 6 3 5 1', '2 6 6', '1', '6 1', `${Array(999).fill(6).join(' ')} 4`];
                for (let t = 0; t < 4; t++) { const n = r.int(0, 20); out.push([...Array(n).fill(6), r.int(1, 5), ...r.arr(r.int(0, 10), 1, 6)].join(' ')); }
                return out;
            },
            solve: (inp) => { const a = nums(inp); let s = 0, i = 0; do { s += a[i]; i++; } while (a[i - 1] === 6); return `${s} ${i}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int k;
    int suma = 0, rzuty = 0;
    do {
        cin >> k;
        suma += k;
        rzuty++;
    } while (k == 6);
    cout << suma << " " << rzuty << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-najmniejszy-dzielnik', krok: 7, level: 'srednie',
            title: 'Najmniejszy dzielnik',
            short: 'Znajdź najmniejszy dzielnik większy od 1 — i przerwij szukanie, gdy d · d > n.',
            tags: ['while', 'break', 'd * d <= n'],
            statement: ['Wczytaj liczbę n ≥ 2 i wypisz jej najmniejszy dzielnik większy od 1. Dla liczby pierwszej jest nim sama liczba n.', 'Uwaga: n może wynosić nawet 2 miliardy — sprawdzanie wszystkich liczb aż do n jest za wolne. Wykorzystaj spostrzeżenie z lekcji: jeśli n ma dzielnik większy od 1, to ma też dzielnik d, dla którego d · d ≤ n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — najmniejszy dzielnik n większy od 1.'],
            constraints: ['2 ≤ n ≤ 2 · 10⁹'],
            examples: [{ input: '91', note: '91 = 7 · 13' }, { input: '97' }],
            hint: R`long long d = 2; while (d * d <= n) { if (n % d == 0) break; d++; }. Po pętli: jeśli n % d == 0 i d * d <= n, wynikiem jest d, a w przeciwnym razie n jest pierwsza i wynikiem jest n. d trzymaj w long long — d * d dla d ≈ 46 341 przekracza zakres int.`,
            tests: (r) => ['91', '97', '2', '3', '4', '25', '49', '1999999973', '2000000000', '1999999943', '2147395600', '1073676289', String(r.int(2, 2e9)), String(2 * r.int(1, 1e9) - 1)].filter((s) => Number(s) <= 2e9),
            solve: (inp) => { const n = nums(inp)[0]; for (let d = 2; d * d <= n; d++) if (n % d === 0) return String(d); return String(n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long d = 2;
    bool znaleziony = false;
    while (d * d <= n) {
        if (n % d == 0) {
            znaleziony = true;
            break;
        }
        d++;
    }
    if (znaleziony) {
        cout << d << "\n";
    } else {
        cout << n << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'wh-bankomat-menu', krok: 7, level: 'srednie',
            title: 'Konto w banku',
            short: 'Wykonuj polecenia W, P i S, dopóki nie przyjdzie K — menu w pętli while (true).',
            tags: ['while (true)', 'break', 'polecenia'],
            statement: ['Na koncie jest na początku 0 zł. Na wejściu są kolejne polecenia, każde w osobnym wierszu:', 'W x — wpłata x zł; P x — wypłata x zł (jeśli na koncie jest mniej niż x zł, wypisz Brak srodkow i nic nie zmieniaj); S — wypisz Saldo: … ; K — koniec pracy (po nim nic już nie wypisuj).'],
            input_format: ['Polecenia, po jednym w wierszu: litera W, P, S albo K, a przy W i P — jeszcze liczba x. Ostatnim poleceniem jest K.'],
            output_format: ['Po jednym wierszu dla każdego polecenia S i każdej nieudanej wypłaty.'],
            constraints: ['co najwyżej 1000 poleceń', '1 ≤ x ≤ 10⁶'],
            examples: [{ input: 'W 100\nP 30\nS\nP 80\nW 15\nS\nK' }],
            hint: R`while (true) { cin >> polecenie; if (polecenie == 'K') break; … }. Liczbę x wczytuj tylko przy W i P — przy S i K jej nie ma. Saldo może przekroczyć int (1000 wpłat po milion), więc trzymaj je w long long.`,
            tests: (r) => {
                const out = ['W 100\nP 30\nS\nP 80\nW 15\nS\nK', 'S\nK', 'P 5\nK', 'W 1000000\nS\nK\nS'];
                for (let t = 0; t < 3; t++) {
                    const n = t === 2 ? 999 : r.int(5, 40); const c = [];
                    for (let i = 0; i < n; i++) { const k = r.pick(['W', 'P', 'P', 'S']); c.push(k === 'S' ? 'S' : `${k} ${r.int(1, t === 2 ? 1e6 : 200)}`); }
                    c.push('S'); out.push([...c, 'K'].join('\n'));
                }
                out.push([...Array(999).fill('W 1000000'), 'S', 'K'].join('\n'));
                return out;
            },
            solve: (inp) => { const t = toks(inp); let i = 0, s = 0; const o = []; while (true) { const k = t[i++]; if (k === 'K') break; if (k === 'S') o.push(`Saldo: ${s}`); else { const x = Number(t[i++]); if (k === 'W') s += x; else if (x > s) o.push('Brak srodkow'); else s -= x; } } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long saldo = 0;
    char polecenie;
    while (true) {
        cin >> polecenie;
        if (polecenie == 'K') {
            break;
        }
        if (polecenie == 'S') {
            cout << "Saldo: " << saldo << "\n";
        } else {
            long long x;
            cin >> x;
            if (polecenie == 'W') {
                saldo += x;
            } else if (x > saldo) {
                cout << "Brak srodkow\n";
            } else {
                saldo -= x;
            }
        }
    }
    return 0;
}`,
        },

        // ================================================================ KROK 8 · pętla w pętli
        {
            id: 'wh-prostokat', krok: 8, level: 'latwe',
            title: 'Prostokąt z gwiazdek',
            short: 'a wierszy po b gwiazdek — pętla wierszy, a w niej pętla gwiazdek.',
            tags: ['pętla w pętli', 'wiersze i kolumny'],
            statement: ['Wczytaj liczby a i b i narysuj prostokąt z gwiazdek: a wierszy, w każdym b znaków * (bez spacji między nimi).'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['a wierszy po b gwiazdek.'],
            constraints: ['1 ≤ a, b ≤ 50'],
            examples: [{ input: '3 5' }],
            hint: R`Zewnętrzna pętla liczy wiersze (w od 0 do a − 1), wewnętrzna — gwiazdki w wierszu (k od 0 do b − 1). Licznik wewnętrznej pętli ustawiaj na 0 wewnątrz zewnętrznej, tuż przed nią — inaczej drugi wiersz będzie pusty. Po wewnętrznej pętli wypisz "\n".`,
            tests: (r) => ['3 5', '1 1', '1 50', '50 1', '50 50', `${r.int(2, 20)} ${r.int(2, 20)}`],
            solve: (inp) => { const [a, b] = nums(inp); return Array(a).fill('*'.repeat(b)).join('\n'); },
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
            cout << "*";
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-trojkat-gwiazdek', krok: 8, level: 'latwe',
            title: 'Trójkąt z gwiazdek',
            short: 'W pierwszym wierszu 1 gwiazdka, w drugim 2, … w ostatnim n.',
            tags: ['pętla w pętli', 'wewnętrzna zależy od zewnętrznej'],
            statement: ['Wczytaj n i narysuj trójkąt z gwiazdek: n wierszy, w wierszu numer w (licząc od 1) jest dokładnie w gwiazdek.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy z gwiazdkami.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '4' }],
            hint: R`To prostokąt z jedną zmianą: wewnętrzna pętla kręci się nie b razy, ale w razy — while (k < w), gdzie w to numer wiersza od 1 do n.`,
            tests: (r) => ['4', '1', '2', '50', String(r.int(3, 49))],
            solve: (inp) => Array.from({ length: nums(inp)[0] }, (_, i) => '*'.repeat(i + 1)).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    while (w <= n) {
        int k = 0;
        while (k < w) {
            cout << "*";
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-trojkat-liczb', krok: 8, level: 'latwe',
            title: 'Trójkąt liczb',
            short: 'Wiersz w zawiera liczby 1 2 … w.',
            tags: ['pętla w pętli', 'licznik wewnętrzny'],
            statement: ['Wczytaj n i wypisz n wierszy: w wierszu numer w (od 1) są liczby od 1 do w, oddzielone spacjami.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy.'],
            constraints: ['1 ≤ n ≤ 100'],
            examples: [{ input: '4' }],
            hint: R`Jak trójkąt z gwiazdek, tylko zamiast gwiazdki wypisujesz licznik wewnętrznej pętli i spację. Wewnętrzny licznik startuje od 1 w każdym wierszu.`,
            tests: (r) => ['4', '1', '2', '100', String(r.int(5, 60))],
            solve: (inp) => Array.from({ length: nums(inp)[0] }, (_, i) => Array.from({ length: i + 1 }, (_, j) => j + 1).join(' ')).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    while (w <= n) {
        int k = 1;
        while (k <= w) {
            cout << k << " ";
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-tabliczka-n', krok: 8, level: 'latwe',
            title: 'Tabliczka mnożenia n × n',
            short: 'Wiersz w, kolumna k: liczba w · k. Cała tabliczka do n.',
            tags: ['pętla w pętli', 'w * k'],
            statement: ['Wczytaj n i wypisz tabliczkę mnożenia o wymiarach n × n: w wierszu numer w (od 1) są kolejno liczby w · 1, w · 2, …, w · n, oddzielone pojedynczymi spacjami.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy po n liczb.'],
            constraints: ['1 ≤ n ≤ 30'],
            examples: [{ input: '4' }],
            hint: R`Obie pętle biegną od 1 do n, a w środku wewnętrznej wypisujesz w * k i spację. Zewnętrzny licznik w mówi, który to wiersz, wewnętrzny k — która kolumna.`,
            tests: (r) => ['4', '1', '2', '30', '10', String(r.int(5, 29))],
            solve: (inp) => { const n = nums(inp)[0]; return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i + 1) * (j + 1)).join(' ')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    while (w <= n) {
        int k = 1;
        while (k <= n) {
            cout << w * k << " ";
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-szachownica', krok: 8, level: 'srednie',
            title: 'Szachownica',
            short: 'Pola # i . na przemian — o kolorze decyduje parzystość w + k.',
            tags: ['pętla w pętli', 'if w środku', '(w + k) % 2'],
            statement: ['Wczytaj n i narysuj szachownicę n × n: w lewym górnym rogu jest znak #, a znaki # i . przeplatają się zarówno w wierszach, jak i w kolumnach. Między znakami nie ma spacji.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy po n znaków.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '4' }, { input: '3' }],
            hint: R`Numeruj wiersze i kolumny od 0. Pole (w, k) jest # wtedy, gdy w + k jest parzyste — sprawdź na rysunku: (0, 0) to #, (0, 1) to ., (1, 0) to . W wewnętrznej pętli wystarczy jeden if … else.`,
            tests: (r) => ['4', '3', '1', '2', '50', String(r.int(5, 49))],
            solve: (inp) => { const n = nums(inp)[0]; return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => ((i + j) % 2 ? '.' : '#')).join('')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 0;
    while (w < n) {
        int k = 0;
        while (k < n) {
            if ((w + k) % 2 == 0) {
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
        {
            id: 'wh-choinka', krok: 8, level: 'srednie',
            title: 'Choinka',
            short: 'Każdy wiersz: najpierw kropki z lewej, potem nieparzysta liczba gwiazdek.',
            tags: ['pętla w pętli', 'dwie wewnętrzne pętle'],
            statement: ['Wczytaj n i narysuj choinkę wysokości n. W wierszu numer w (od 1 do n) najpierw stoi n − w kropek, a potem 2 · w − 1 gwiazdek. Kropki zastępują spacje, żeby było je widać.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy.'],
            constraints: ['1 ≤ n ≤ 40'],
            examples: [{ input: '4' }],
            hint: R`W zewnętrznej pętli są dwie wewnętrzne, jedna po drugiej: pierwsza wypisuje n − w kropek, druga 2 * w − 1 gwiazdek. Potem "\n". Rozpisz sobie wiersze dla n = 4: (3 kropki, 1 gwiazdka), (2, 3), (1, 5), (0, 7).`,
            tests: (r) => ['4', '1', '2', '40', String(r.int(5, 39))],
            solve: (inp) => { const n = nums(inp)[0]; return Array.from({ length: n }, (_, i) => '.'.repeat(n - i - 1) + '*'.repeat(2 * i + 1)).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    while (w <= n) {
        int k = 0;
        while (k < n - w) {
            cout << ".";
            k++;
        }
        k = 0;
        while (k < 2 * w - 1) {
            cout << "*";
            k++;
        }
        cout << "\n";
        w++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-pierwsze-do-n', krok: 8, level: 'srednie',
            title: 'Wszystkie liczby pierwsze do n',
            short: 'Dla każdej liczby od 2 do n sprawdź, czy jest pierwsza — pętla w pętli z break.',
            tags: ['pętla w pętli', 'break', 'd * d <= x'],
            statement: ['Wczytaj n i wypisz w jednym wierszu wszystkie liczby pierwsze nie większe od n, w kolejności rosnącej, oddzielone spacjami.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z liczbami pierwszymi.'],
            constraints: ['2 ≤ n ≤ 50 000'],
            examples: [{ input: '30' }, { input: '2' }],
            hint: R`Zewnętrzna pętla przechodzi po kandydatach x od 2 do n. Wewnętrzna szuka dzielnika d od 2, dopóki d * d <= x — gdy go znajdzie, ustawia flagę pierwsza = false i robi break. Po wewnętrznej pętli: jeśli flaga dalej jest true, wypisz x. Flagę ustawiaj na true dla każdego x od nowa!`,
            tests: (r) => ['30', '2', '3', '4', '50000', '49999', '1000', String(r.int(5, 50000))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let x = 2; x <= n; x++) if (pierwsza(x)) o.push(x); return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int x = 2;
    while (x <= n) {
        bool pierwsza = true;
        int d = 2;
        while (d * d <= x) {
            if (x % d == 0) {
                pierwsza = false;
                break;
            }
            d++;
        }
        if (pierwsza) {
            cout << x << " ";
        }
        x++;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-doskonale', krok: 8, level: 'srednie',
            title: 'Liczby doskonałe',
            short: 'Liczba doskonała to suma swoich dzielników mniejszych od niej, np. 6 = 1 + 2 + 3.',
            tags: ['pętla w pętli', 'suma dzielników'],
            statement: ['Liczba doskonała to liczba równa sumie wszystkich swoich dzielników mniejszych od niej samej, np. 6 = 1 + 2 + 3 albo 28 = 1 + 2 + 4 + 7 + 14.', 'Wczytaj n i wypisz wszystkie liczby doskonałe nie większe od n, każdą w osobnym wierszu. Jeśli takich liczb nie ma, wypisz BRAK.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Liczby doskonałe po jednej w wierszu albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '100' }, { input: '5' }],
            hint: R`Dla każdej liczby x od 2 do n policz wewnętrzną pętlą sumę dzielników d od 1 do x − 1 (if (x % d == 0) suma += d;). Sumę zeruj przed wewnętrzną pętlą, dla każdego x osobno. Licznik znalezionych liczb przyda się do napisania BRAK.`,
            tests: (r) => ['100', '5', '1', '6', '27', '28', '10000', '8127', '8128', '495', '496', String(r.int(500, 9999))],
            solve: (inp) => { const n = nums(inp)[0]; const o = [6, 28, 496, 8128].filter((x) => x <= n); return o.length ? o.join('\n') : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int znalezione = 0;
    int x = 2;
    while (x <= n) {
        int suma = 0;
        int d = 1;
        while (d < x) {
            if (x % d == 0) {
                suma += d;
            }
            d++;
        }
        if (suma == x) {
            cout << x << "\n";
            znalezione++;
        }
        x++;
    }
    if (znalezione == 0) {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
    ];
};
