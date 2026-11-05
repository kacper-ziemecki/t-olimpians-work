// If / Else — ćwiczenia w trakcie lekcji, części 5–8: operatory && || !, zagnieżdżanie, typowe schematy
// (maksimum, zamiana, sortowanie trzech liczb, licznik), switch i operator ?:. Bez pętli.
module.exports = (h) => {
    const { nums, toks, lines, join, fx, capital } = h;
    const R = String.raw;
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const przestepny = (r) => (r % 4 === 0 && r % 100 !== 0) || r % 400 === 0;
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];

    return [
        // ================================================================ KROK 5 · && || !
        {
            id: 'ie-dwucyfrowa', krok: 5, level: 'latwe',
            title: 'Liczba dwucyfrowa',
            short: 'Czy liczba leży w przedziale od 10 do 99?',
            tags: ['&&', 'przedział'],
            statement: ['Wczytaj nieujemną liczbę całkowitą n. Wypisz TAK, jeśli jest dwucyfrowa (od 10 do 99), albo NIE w przeciwnym razie.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['0 ≤ n ≤ 10⁹'],
            examples: [{ input: '42' }, { input: '100' }],
            hint: 'Dwa porównania połączone przez &&: if (n >= 10 && n <= 99). Zapis 10 <= n <= 99 się skompiluje, ale da zły wynik — sprawdź dlaczego w części 05.',
            tests: (r) => ['42', '100', '9', '10', '99', '0', '1000000000', '55', '101', String(r.int(10, 99)), String(r.int(100, 1e9)), String(r.int(0, 9))],
            solve: (inp) => { const n = nums(inp)[0]; return n >= 10 && n <= 99 ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n >= 10 && n <= 99) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-weekend', krok: 5, level: 'latwe',
            title: 'Weekend',
            short: 'Numer dnia tygodnia — weekend czy dzień roboczy?',
            tags: ['||'],
            statement: ['Dni tygodnia są ponumerowane od 1 (poniedziałek) do 7 (niedziela). Wczytaj numer dnia i wypisz weekend dla soboty i niedzieli, a dzien roboczy dla pozostałych dni.'],
            input_format: ['Jedna liczba całkowita od 1 do 7.'],
            output_format: ['Jeden wiersz: weekend albo dzien roboczy.'],
            constraints: ['1 ≤ numer dnia ≤ 7'],
            examples: [{ input: '6' }, { input: '3' }],
            hint: 'Sobota to 6, a niedziela 7: if (d == 6 || d == 7). Każde porównanie piszesz w całości — d == 6 || 7 nie zadziała.',
            tests: () => ['6', '3', '1', '2', '4', '5', '7'],
            solve: (inp) => { const d = nums(inp)[0]; return d === 6 || d === 7 ? 'weekend' : 'dzien roboczy'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d;
    cin >> d;
    if (d == 6 || d == 7) {
        cout << "weekend\n";
    } else {
        cout << "dzien roboczy\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-samogloska', krok: 5, level: 'latwe',
            title: 'Samogłoska czy spółgłoska?',
            short: 'Mała litera — jedna z a, e, i, o, u, y, czy nie?',
            tags: ['||', 'char'],
            statement: ['Wczytaj jedną małą literę alfabetu angielskiego. Wypisz samogloska, jeśli to jedna z liter a, e, i, o, u, y, albo spolgloska w przeciwnym razie.'],
            input_format: ['Jedna mała litera.'],
            output_format: ['Jedno słowo: samogloska albo spolgloska.'],
            constraints: ['na wejściu jest litera od a do z'],
            examples: [{ input: 'e' }, { input: 'k' }],
            hint: R`Sześć porównań połączonych przez ||: c == 'a' || c == 'e' || … || c == 'y'. Nie skracaj zapisu do c == 'a' || 'e' — taki warunek jest zawsze prawdziwy.`,
            tests: () => ['e', 'k', ...LITERY.split('')],
            solve: (inp) => ('aeiouy'.includes(inp.trim()) ? 'samogloska' : 'spolgloska'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') {
        cout << "samogloska\n";
    } else {
        cout << "spolgloska\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-rodzaj-znaku', krok: 5, level: 'srednie',
            title: 'Rodzaj znaku',
            short: 'Cyfra, mała litera, wielka litera czy inny znak?',
            tags: ['&&', 'else if', 'przedziały znaków'],
            statement: ['Wczytaj jeden znak (nie spację). Wypisz cyfra, mala litera, wielka litera albo inny znak.'],
            input_format: ['Jeden znak.'],
            output_format: ['Jeden wiersz: cyfra, mala litera, wielka litera albo inny znak.'],
            constraints: ['znak ma kod ASCII od 33 do 126 (nie jest spacją)'],
            examples: [{ input: '7' }, { input: 'g' }, { input: 'G' }, { input: '?' }],
            hint: "Znaki od '0' do '9', od 'a' do 'z' i od 'A' do 'Z' mają kolejne kody, więc każdy rodzaj to przedział: c >= '0' && c <= '9' i tak dalej. Uważaj na znaki leżące między przedziałami — na przykład [ i ` mają kody między 'Z' a 'a'.",
            tests: (r) => ['7', 'g', 'G', '?', '0', '9', 'a', 'z', 'A', 'Z', '@', '[', '`', '{', '/', ':', '~', '!', String.fromCharCode(r.int(33, 126)), String.fromCharCode(r.int(33, 126))],
            solve: (inp) => {
                const c = inp.trim();
                if (c >= '0' && c <= '9') return 'cyfra';
                if (c >= 'a' && c <= 'z') return 'mala litera';
                if (c >= 'A' && c <= 'Z') return 'wielka litera';
                return 'inny znak';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    if (c >= '0' && c <= '9') {
        cout << "cyfra\n";
    } else if (c >= 'a' && c <= 'z') {
        cout << "mala litera\n";
    } else if (c >= 'A' && c <= 'Z') {
        cout << "wielka litera\n";
    } else {
        cout << "inny znak\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-luty', krok: 5, level: 'srednie',
            title: 'Ile dni ma luty?',
            short: 'Rok przestępny: przez 4, ale nie przez 100 — albo przez 400.',
            tags: ['&&', '||', 'nawiasy'],
            statement: [
                'Wczytaj rok r i wypisz, ile dni ma luty w tym roku: 29 w roku przestępnym i 28 w zwykłym.',
                'Rok jest przestępny, gdy dzieli się przez 4, ale nie dzieli się przez 100 — albo gdy dzieli się przez 400.',
            ],
            input_format: ['Jedna liczba całkowita r.'],
            output_format: ['Jedna liczba: 28 albo 29.'],
            constraints: ['1 ≤ r ≤ 100 000'],
            examples: [{ input: '2024' }, { input: '1900' }, { input: '2000' }],
            hint: 'Przepisz zasadę wprost na warunek, z nawiasami: (r % 4 == 0 && r % 100 != 0) || r % 400 == 0. Sprawdź program na latach 2024, 2023, 1900 i 2000.',
            tests: (r) => ['2024', '1900', '2000', '2023', '2100', '2400', '4', '1', '100', '400', '99996', '100000', String(4 * r.int(1, 25000)), String(r.int(1, 100000)), String(100 * r.int(1, 1000))],
            solve: (inp) => String(przestepny(nums(inp)[0]) ? 29 : 28),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int r;
    cin >> r;
    if ((r % 4 == 0 && r % 100 != 0) || r % 400 == 0) {
        cout << 29 << "\n";
    } else {
        cout << 28 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-cwiartka', krok: 5, level: 'srednie',
            title: 'Ćwiartka układu współrzędnych',
            short: 'W której ćwiartce leży punkt (x, y)? A może na osi?',
            tags: ['&&', '||', 'else if'],
            statement: [
                'Wczytaj współrzędne punktu x i y. Wypisz numer ćwiartki układu współrzędnych, w której leży punkt: I (x > 0, y > 0), II (x < 0, y > 0), III (x < 0, y < 0) albo IV (x > 0, y < 0).',
                'Jeśli punkt leży na którejś osi (x = 0 lub y = 0), wypisz na osi.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi x i y.'],
            output_format: ['Jeden wiersz: I, II, III, IV albo na osi.'],
            constraints: ['−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '3 5' }, { input: '-3 -5' }, { input: '0 7' }],
            hint: 'Najpierw przypadek szczególny: if (x == 0 || y == 0) na osi. Potem każda ćwiartka to dwa warunki połączone przez &&, np. else if (x > 0 && y > 0) I.',
            tests: (r) => ['3 5', '-3 -5', '0 7', '-3 5', '3 -5', '7 0', '0 0', '-1 0', '0 -1', '1 1', '-1000000000 1000000000',
                `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`],
            solve: (inp) => {
                const [x, y] = nums(inp);
                if (x === 0 || y === 0) return 'na osi';
                if (x > 0 && y > 0) return 'I';
                if (x < 0 && y > 0) return 'II';
                if (x < 0 && y < 0) return 'III';
                return 'IV';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int x, y;
    cin >> x >> y;
    if (x == 0 || y == 0) {
        cout << "na osi\n";
    } else if (x > 0 && y > 0) {
        cout << "I\n";
    } else if (x < 0 && y > 0) {
        cout << "II\n";
    } else if (x < 0 && y < 0) {
        cout << "III\n";
    } else {
        cout << "IV\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-bilet-ulgowy', krok: 5, level: 'srednie',
            title: 'Bilet ulgowy',
            short: 'Uczeń albo senior — ale tylko z legitymacją. Nawiasy mają znaczenie!',
            tags: ['&&', '||', 'nawiasy', 'char'],
            statement: [
                'Bilet ulgowy przysługuje uczniom (osobom, które mają mniej niż 19 lat) i seniorom (osobom, które mają co najmniej 65 lat) — ale tylko wtedy, gdy pokażą legitymację.',
                'Wczytaj wiek i literę T (ma legitymację) albo N (nie ma). Wypisz ULGOWY albo NORMALNY.',
            ],
            input_format: ['Jeden wiersz: liczba całkowita (wiek) i litera T albo N.'],
            output_format: ['Jedno słowo: ULGOWY albo NORMALNY.'],
            constraints: ['1 ≤ wiek ≤ 120'],
            examples: [{ input: '15 T' }, { input: '15 N' }, { input: '40 T' }],
            hint: R`Warunek to (wiek < 19 || wiek >= 65) && leg == 'T'. Nawiasy są tu konieczne — bez nich && połączyłoby się tylko z drugim porównaniem i uczeń bez legitymacji dostałby ulgę.`,
            tests: (r) => ['15 T', '15 N', '40 T', '70 T', '70 N', '18 T', '19 T', '64 T', '65 T', '65 N', '1 T', '120 N', '40 N', `${r.int(1, 120)} ${r.pick(['T', 'N'])}`, `${r.int(1, 120)} ${r.pick(['T', 'N'])}`],
            solve: (inp) => { const [w, l] = toks(inp); const wiek = Number(w); return (wiek < 19 || wiek >= 65) && l === 'T' ? 'ULGOWY' : 'NORMALNY'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int wiek;
    char leg;
    cin >> wiek >> leg;
    if ((wiek < 19 || wiek >= 65) && leg == 'T') {
        cout << "ULGOWY\n";
    } else {
        cout << "NORMALNY\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-bezpieczne-dzielenie', krok: 5, level: 'srednie',
            title: 'Bezpieczne dzielenie',
            short: 'Czy b dzieli a? Uwaga: b może być zerem.',
            tags: ['&&', 'skrócone obliczanie', 'dzielenie przez zero'],
            statement: ['Wczytaj liczby całkowite a i b. Wypisz TAK, jeśli b jest różne od zera i a dzieli się przez b bez reszty. W przeciwnym razie — także gdy b jest zerem — wypisz NIE.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '12 4' }, { input: '12 0' }],
            hint: 'Reszta z dzielenia przez zero wysypuje program. Najpierw sprawdź b != 0, a dopiero potem a % b == 0 — i połącz oba warunki przez &&. Dzięki skróconemu obliczaniu przy b = 0 reszta w ogóle się nie policzy.',
            tests: (r) => ['12 4', '12 0', '0 0', '0 5', '-12 4', '12 -4', '7 3', '-7 0', '1000000000 -1', '1000000000 1000000000', '999999999 -3',
                (() => { const b = r.int(-1000, 1000) || 7; return `${b * r.int(-1e6, 1e6)} ${b}`; })(), `${r.int(-1e9, 1e9)} ${r.int(-30, 30)}`, `${r.int(-1e9, 1e9)} 0`],
            solve: (inp) => { const [a, b] = nums(inp); return b !== 0 && a % b === 0 ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (b != 0 && a % b == 0) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 6 · zagnieżdżanie
        {
            id: 'ie-logowanie', krok: 6, level: 'latwe',
            title: 'Logowanie',
            short: 'Najpierw login, potem hasło — trzy możliwe komunikaty.',
            tags: ['if w if', 'string'],
            statement: [
                'W pierwszym wierszu wejścia są poprawny login i poprawne hasło, a w drugim — login i hasło wpisane przez użytkownika.',
                'Jeśli wpisany login jest inny niż poprawny, wypisz Nieznany uzytkownik. Jeśli login się zgadza, ale hasło nie — wypisz Bledne haslo. Jeśli zgadza się jedno i drugie, wypisz Witaj, LOGIN! (z loginem w miejscu słowa LOGIN).',
            ],
            input_format: ['Dwa wiersze, w każdym dwa słowa: login i hasło.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['loginy i hasła mają od 1 do 20 znaków (litery i cyfry)'],
            examples: [{ input: 'bajtek tajne1\nbajtek tajne1' }, { input: 'bajtek tajne1\nbajtek tajne2' }, { input: 'bajtek tajne1\nbajtka tajne1' }],
            hint: 'Zewnętrzny if sprawdza login, a w jego klamrach drugi if sprawdza hasło. Gdy login się nie zgadza, hasła w ogóle nie trzeba sprawdzać — to załatwia zewnętrzny else.',
            tests: (r) => {
                const w = () => r.word(r.int(1, 12), 'abcdefghijklmnopqrstuvwxyz0123456789');
                const l = w(), p = w();
                return ['bajtek tajne1\nbajtek tajne1', 'bajtek tajne1\nbajtek tajne2', 'bajtek tajne1\nbajtka tajne1', 'ola kot\nOla kot', 'ola kot\nola Kot', 'ola kot\nala pies',
                    `${l} ${p}\n${l} ${p}`, `${l} ${p}\n${l} ${p}x`, `${l} ${p}\n${l}x ${p}`];
            },
            solve: (inp) => { const [l, p, wl, wp] = toks(inp); return wl !== l ? 'Nieznany uzytkownik' : wp !== p ? 'Bledne haslo' : `Witaj, ${wl}!`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string login, haslo, wl, wh;
    cin >> login >> haslo >> wl >> wh;
    if (wl == login) {
        if (wh == haslo) {
            cout << "Witaj, " << wl << "!\n";
        } else {
            cout << "Bledne haslo\n";
        }
    } else {
        cout << "Nieznany uzytkownik\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-co-zalozyc', krok: 6, level: 'latwe',
            title: 'Co założyć?',
            short: 'Pada czy nie pada, ciepło czy zimno — cztery odpowiedzi.',
            tags: ['if w if', 'char', 'drzewo decyzji'],
            statement: [
                'Wczytaj literę T albo N (czy pada deszcz) i temperaturę t.',
                'Gdy pada: przy t < 5 wypisz kurtka i kalosze, a w przeciwnym razie parasol. Gdy nie pada: przy t >= 20 wypisz koszulka, a w przeciwnym razie bluza.',
            ],
            input_format: ['Jeden wiersz: litera T albo N i liczba całkowita t.'],
            output_format: ['Jeden wiersz z odpowiedzią.'],
            constraints: ['−30 ≤ t ≤ 40'],
            examples: [{ input: 'T 3' }, { input: 'N 24' }],
            hint: R`Zewnętrzny if sprawdza, czy pada (if (pada == 'T')), a w każdej gałęzi stoi drugi if … else z temperaturą. To dokładnie drzewo decyzji z części 06.`,
            tests: (r) => ['T 3', 'N 24', 'T 5', 'T 4', 'N 20', 'N 19', 'T -30', 'N -30', 'T 40', 'N 40', `T ${r.int(-30, 40)}`, `N ${r.int(-30, 40)}`],
            solve: (inp) => { const [p, ts] = toks(inp); const t = Number(ts); return p === 'T' ? (t < 5 ? 'kurtka i kalosze' : 'parasol') : (t >= 20 ? 'koszulka' : 'bluza'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char pada;
    int t;
    cin >> pada >> t;
    if (pada == 'T') {
        if (t < 5) {
            cout << "kurtka i kalosze\n";
        } else {
            cout << "parasol\n";
        }
    } else {
        if (t >= 20) {
            cout << "koszulka\n";
        } else {
            cout << "bluza\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'ie-bankomat', krok: 6, level: 'srednie',
            title: 'Bankomat',
            short: 'Kwota podzielna przez 10? Wystarczy pieniędzy? Wypłać albo odmów.',
            tags: ['if w if', '%', 'kolejność sprawdzeń'],
            statement: [
                'Bankomat wypłaca tylko kwoty podzielne przez 10. Na koncie jest s zł, a klient chce wypłacić w zł.',
                'Jeśli w nie dzieli się przez 10, wypisz Bledna kwota. Jeśli kwota jest dobra, ale na koncie jest za mało pieniędzy, wypisz Brak srodkow. W przeciwnym razie wypisz dwa wiersze: Wyplacono w zl oraz Saldo: X zl, gdzie X to pieniądze, które zostały na koncie.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi s i w.'],
            output_format: ['Jeden albo dwa wiersze, jak w przykładach.'],
            constraints: ['0 ≤ s ≤ 10⁹', '1 ≤ w ≤ 10⁹'],
            examples: [{ input: '500 120' }, { input: '500 125' }, { input: '100 200' }],
            hint: 'Zewnętrzny if: if (w % 10 == 0) { … } else { Bledna kwota }. W jego klamrach drugi if sprawdza, czy w <= s. Najpierw sprawdzasz kwotę, a dopiero potem saldo — przy kwocie 125 zł bankomat nie mówi o braku środków.',
            tests: (r) => ['500 120', '500 125', '100 200', '100 100', '0 10', '0 15', '1000000000 1000000000', '999999999 1000000000', '1000000000 999999999',
                `${r.int(0, 1e9)} ${10 * r.int(1, 1e8)}`, `${r.int(0, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1000, 5000)} ${10 * r.int(1, 200)}`],
            solve: (inp) => { const [s, w] = nums(inp); return w % 10 !== 0 ? 'Bledna kwota' : w > s ? 'Brak srodkow' : join(`Wyplacono ${w} zl`, `Saldo: ${s - w} zl`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int s, w;
    cin >> s >> w;
    if (w % 10 == 0) {
        if (w <= s) {
            cout << "Wyplacono " << w << " zl\n";
            cout << "Saldo: " << s - w << " zl\n";
        } else {
            cout << "Brak srodkow\n";
        }
    } else {
        cout << "Bledna kwota\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-dni-miesiaca', krok: 6, level: 'srednie',
            title: 'Ile dni ma miesiąc?',
            short: 'Numer miesiąca i rok → 28, 29, 30 albo 31 dni.',
            tags: ['if w if', 'rok przestępny', '||'],
            statement: [
                'Wczytaj numer miesiąca m (od 1 do 12) i rok r. Wypisz, ile dni ma ten miesiąc.',
                'Kwiecień, czerwiec, wrzesień i listopad mają po 30 dni. Luty ma 29 dni w roku przestępnym i 28 w zwykłym (rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400). Pozostałe miesiące mają po 31 dni.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi m i r.'],
            output_format: ['Jedna liczba — liczba dni w miesiącu.'],
            constraints: ['1 ≤ m ≤ 12', '1 ≤ r ≤ 100 000'],
            examples: [{ input: '2 2024' }, { input: '4 2026' }, { input: '12 2026' }],
            hint: 'if (m == 2) { tu drugi if: rok przestępny → 29, inaczej 28 } else if (m == 4 || m == 6 || m == 9 || m == 11) { 30 } else { 31 }.',
            tests: (r) => ['2 2024', '4 2026', '12 2026', ...Array.from({ length: 12 }, (_, i) => `${i + 1} 2023`), '2 1900', '2 2000', '2 2100', '2 2400', '6 2024', '9 1', '11 100000', `${r.int(1, 12)} ${r.int(1, 100000)}`],
            solve: (inp) => { const [m, r] = nums(inp); return String(m === 2 ? (przestepny(r) ? 29 : 28) : [4, 6, 9, 11].includes(m) ? 30 : 31); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int m, r;
    cin >> m >> r;
    if (m == 2) {
        if ((r % 4 == 0 && r % 100 != 0) || r % 400 == 0) {
            cout << 29 << "\n";
        } else {
            cout << 28 << "\n";
        }
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        cout << 30 << "\n";
    } else {
        cout << 31 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-staly-klient', krok: 6, level: 'srednie',
            title: 'Rabat dla stałych klientów',
            short: 'Stały klient czy nie, zakupy od 200 zł czy mniej — jaki rabat?',
            tags: ['if w if', 'procenty', 'setprecision(2)'],
            statement: [
                'Stały klient dostaje 20% rabatu przy zakupach za co najmniej 200 zł i 10% przy mniejszych. Pozostali klienci dostają 5% rabatu przy zakupach za co najmniej 200 zł, a przy mniejszych — nic.',
                'Wczytaj literę T (stały klient) albo N i kwotę zakupów k (w pełnych złotych). Wypisz kwotę do zapłaty z dokładnością do dwóch miejsc po przecinku.',
            ],
            input_format: ['Jeden wiersz: litera T albo N i liczba całkowita k.'],
            output_format: ['Jedna liczba z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ k ≤ 100 000'],
            examples: [{ input: 'T 250' }, { input: 'N 199' }, { input: 'T 199' }],
            hint: 'Najpierw ustal procent rabatu: zewnętrzny if sprawdza, czy klient jest stały, a wewnętrzny — czy k >= 200. Potem do zapłaty = k * (100 - procent) / 100.0 i wypisz przez cout << fixed << setprecision(2).',
            tests: (r) => ['T 250', 'N 199', 'T 199', 'N 200', 'T 200', 'N 250', 'T 1', 'N 1', 'T 100000', 'N 100000', `T ${r.int(1, 100000)}`, `N ${r.int(1, 100000)}`, `T ${r.int(1, 199)}`, `N ${r.int(200, 1000)}`],
            solve: (inp) => {
                const [s, ks] = toks(inp);
                const k = Number(ks);
                const p = s === 'T' ? (k >= 200 ? 20 : 10) : (k >= 200 ? 5 : 0);
                return fx(k * (100 - p) / 100, 2);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    char staly;
    int k;
    cin >> staly >> k;
    int procent;
    if (staly == 'T') {
        if (k >= 200) {
            procent = 20;
        } else {
            procent = 10;
        }
    } else {
        if (k >= 200) {
            procent = 5;
        } else {
            procent = 0;
        }
    }
    cout << fixed << setprecision(2) << k * (100 - procent) / 100.0 << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-rownanie', krok: 6, level: 'srednie',
            title: 'Równanie a · x = b',
            short: 'Jedno rozwiązanie, brak rozwiązań czy nieskończenie wiele?',
            tags: ['if w if', '%', 'przypadki szczególne'],
            statement: [
                'Rozwiąż w liczbach całkowitych równanie a · x = b.',
                'Jeśli a jest różne od zera i b dzieli się przez a, wypisz jedyne rozwiązanie x. Jeśli a jest różne od zera, ale b nie dzieli się przez a, wypisz BRAK (rozwiązanie nie jest liczbą całkowitą). Jeśli a = 0, to dla b = 0 każda liczba jest rozwiązaniem — wypisz NIESKONCZENIE WIELE — a dla b różnego od zera rozwiązań nie ma: wypisz BRAK.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedna liczba albo napis BRAK lub NIESKONCZENIE WIELE.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3 12' }, { input: '3 13' }, { input: '0 0' }, { input: '0 5' }],
            hint: 'Zewnętrzny if: if (a != 0). W środku: if (b % a == 0) wypisz b / a, inaczej BRAK. W zewnętrznym else (czyli a == 0): if (b == 0) NIESKONCZENIE WIELE, inaczej BRAK. Przy a = 0 nie wolno liczyć b % a!',
            tests: (r) => ['3 12', '3 13', '0 0', '0 5', '-3 12', '3 -12', '-3 -12', '0 -7', '1 1000000000', '-1 1000000000', '1000000000 -1000000000', '7 0', '-7 0', '1000000000 999999999',
                (() => { const a = r.int(-1000, 1000) || 3; return `${a} ${a * r.int(-1e6, 1e6)}`; })(), `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-20, 20)} ${r.int(-100, 100)}`],
            solve: (inp) => { const [a, b] = nums(inp); if (a !== 0) return b % a === 0 ? String(b / a) : 'BRAK'; return b === 0 ? 'NIESKONCZENIE WIELE' : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a != 0) {
        if (b % a == 0) {
            cout << b / a << "\n";
        } else {
            cout << "BRAK\n";
        }
    } else {
        if (b == 0) {
            cout << "NIESKONCZENIE WIELE\n";
        } else {
            cout << "BRAK\n";
        }
    }
    return 0;
}`,
        },

        // ================================================================ KROK 7 · typowe schematy
        {
            id: 'ie-najwieksza-z-trzech', krok: 7, level: 'latwe',
            title: 'Największa z trzech',
            short: 'Zapamiętaj pierwszą, a potem porównuj z nią kolejne.',
            tags: ['maksimum', 'osobne if'],
            statement: ['Wczytaj trzy liczby całkowite i wypisz największą z nich.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi.'],
            output_format: ['Jedna liczba — największa z trzech.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '4 9 2' }, { input: '-5 -2 -8' }],
            hint: 'int najw = a; if (b > najw) { najw = b; } if (c > najw) { najw = c; }. Oba if-y są osobne — każdą liczbę trzeba porównać z dotychczasową największą.',
            tests: (r) => ['4 9 2', '-5 -2 -8', '7 3 7', '1 2 3', '3 2 1', '2 3 1', '5 5 5', '-1000000000 -1000000000 -999999999', ...Array.from({ length: 4 }, () => r.arr(3, -1e9, 1e9).join(' '))],
            solve: (inp) => String(Math.max(...nums(inp))),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int najw = a;
    if (b > najw) {
        najw = b;
    }
    if (c > najw) {
        najw = c;
    }
    cout << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-najmniejsza-z-czterech', krok: 7, level: 'latwe',
            title: 'Najmniejsza z czterech',
            short: 'Ten sam schemat co przy maksimum — tylko z < zamiast >.',
            tags: ['minimum', 'osobne if'],
            statement: ['Wczytaj cztery liczby całkowite i wypisz najmniejszą z nich.'],
            input_format: ['Jeden wiersz z czterema liczbami całkowitymi.'],
            output_format: ['Jedna liczba — najmniejsza z czterech.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '8 3 6 5' }],
            hint: 'Zacznij od int najm = a; i dla każdej kolejnej liczby napisz osobny if: if (b < najm) { najm = b; } — razem trzy if-y.',
            tests: (r) => ['8 3 6 5', '1 2 3 4', '4 3 2 1', '2 4 1 3', '0 0 0 0', '-1 -1 -2 -1', '1000000000 1000000000 1000000000 -1000000000', ...Array.from({ length: 4 }, () => r.arr(4, -1e9, 1e9).join(' '))],
            solve: (inp) => String(Math.min(...nums(inp))),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    int najm = a;
    if (b < najm) {
        najm = b;
    }
    if (c < najm) {
        najm = c;
    }
    if (d < najm) {
        najm = d;
    }
    cout << najm << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-dwie-rosnaco', krok: 7, level: 'latwe',
            title: 'Dwie liczby po kolei',
            short: 'Jeśli stoją w złej kolejności — zamień je miejscami.',
            tags: ['zamiana', 'swap'],
            statement: ['Wczytaj dwie liczby całkowite i wypisz je w kolejności rosnącej (najpierw mniejszą), oddzielone spacją.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi.'],
            output_format: ['Jeden wiersz z dwiema liczbami w kolejności rosnącej.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '9 4' }, { input: '2 6' }],
            hint: 'if (a > b) { swap(a, b); } — po tym if na pewno a <= b. Zamiast swap możesz użyć pomocniczej zmiennej: int t = a; a = b; b = t;.',
            tests: (r) => ['9 4', '2 6', '5 5', '-1 -2', '0 -1000000000', ...Array.from({ length: 5 }, () => r.arr(2, -1e9, 1e9).join(' '))],
            solve: (inp) => nums(inp).sort((x, y) => x - y).join(' '),
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a > b) {
        swap(a, b);
    }
    cout << a << " " << b << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-ile-parzystych', krok: 7, level: 'latwe',
            title: 'Ile parzystych?',
            short: 'Licznik: ile z czterech liczb jest parzystych? Także ujemnych!',
            tags: ['licznik', '%', 'osobne if'],
            statement: ['Wczytaj cztery liczby całkowite i wypisz, ile z nich jest parzystych. Liczby mogą być ujemne.'],
            input_format: ['Jeden wiersz z czterema liczbami całkowitymi.'],
            output_format: ['Jedna liczba od 0 do 4.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '3 8 -4 7' }],
            hint: 'int ile = 0; a potem cztery osobne if-y: if (a % 2 == 0) { ile++; } i tak dalej. Pamiętaj, że −4 % 2 to 0, ale −7 % 2 to −1.',
            tests: (r) => ['3 8 -4 7', '1 3 5 7', '2 4 6 8', '0 0 0 0', '-1 -2 -3 -4', '-7 -9 11 13', ...Array.from({ length: 5 }, () => r.arr(4, -1e9, 1e9).join(' ')), r.arr(4, -9, 9).join(' ')],
            solve: (inp) => String(nums(inp).filter((x) => x % 2 === 0).length),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    int ile = 0;
    if (a % 2 == 0) { ile++; }
    if (b % 2 == 0) { ile++; }
    if (c % 2 == 0) { ile++; }
    if (d % 2 == 0) { ile++; }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-trzy-rosnaco', krok: 7, level: 'srednie',
            title: 'Trzy liczby po kolei',
            short: 'Trzy zamiany wystarczą, żeby ustawić trzy liczby rosnąco.',
            tags: ['zamiana', 'sortowanie trzech liczb'],
            statement: ['Wczytaj trzy liczby całkowite i wypisz je w kolejności rosnącej, oddzielone spacjami.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi.'],
            output_format: ['Jeden wiersz z trzema liczbami w kolejności rosnącej.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '8 2 5' }, { input: '3 2 1' }],
            hint: 'Trzy zamiany: if (a > b) swap(a, b); if (b > c) swap(b, c); — teraz c jest największa — i jeszcze raz if (a > b) swap(a, b);. Sprawdź na kartce dane 3 2 1.',
            tests: (r) => ['8 2 5', '3 2 1', '1 2 3', '1 3 2', '2 1 3', '2 3 1', '3 1 2', '5 5 1', '1 5 5', '7 7 7', ...Array.from({ length: 4 }, () => r.arr(3, -1e9, 1e9).join(' '))],
            solve: (inp) => nums(inp).sort((x, y) => x - y).join(' '),
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a > b) { swap(a, b); }
    if (b > c) { swap(b, c); }
    if (a > b) { swap(a, b); }
    cout << a << " " << b << " " << c << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-srodkowa', krok: 7, level: 'srednie',
            title: 'Środkowa liczba',
            short: 'Która z trzech liczb wypadnie w środku po ustawieniu w kolejności?',
            tags: ['sortowanie trzech liczb', 'mediana'],
            statement: ['Wczytaj trzy liczby całkowite i wypisz tę, która znajdzie się w środku, gdy ustawisz je w kolejności rosnącej. Na przykład dla 7 1 4 to 4, a dla 5 1 5 — 5.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi.'],
            output_format: ['Jedna liczba — środkowa.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '7 1 4' }, { input: '5 1 5' }],
            hint: 'Najprościej: ustaw liczby rosnąco trzema zamianami, jak w poprzednim ćwiczeniu, i wypisz b.',
            tests: (r) => ['7 1 4', '5 1 5', '1 2 3', '3 2 1', '2 3 1', '1 3 2', '9 9 9', '-5 0 5', ...Array.from({ length: 5 }, () => r.arr(3, -1e9, 1e9).join(' '))],
            solve: (inp) => String(nums(inp).sort((x, y) => x - y)[1]),
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a > b) { swap(a, b); }
    if (b > c) { swap(b, c); }
    if (a > b) { swap(a, b); }
    cout << b << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-podium', krok: 7, level: 'srednie',
            title: 'Podium',
            short: 'Trzech biegaczy z czasami — wypisz kolejność na mecie.',
            tags: ['zamiana par', 'string', 'sortowanie trzech'],
            statement: [
                'W biegu wystartowało trzech zawodników. W każdym z trzech wierszy wejścia jest imię zawodnika i jego czas w sekundach. Czasy są różne.',
                'Wypisz podium: w pierwszym wierszu 1. i imię najszybszego zawodnika (z najmniejszym czasem), w drugim 2. i imię drugiego, a w trzecim 3. i imię trzeciego.',
            ],
            input_format: ['Trzy wiersze, w każdym imię (jedno słowo) i liczba całkowita — czas.'],
            output_format: ['Trzy wiersze, jak w przykładzie.'],
            constraints: ['imiona mają od 1 do 20 liter', '1 ≤ czas ≤ 10 000', 'czasy są różne'],
            examples: [{ input: 'Ola 62\nAda 58\nIza 71' }],
            hint: 'Ustaw zawodników według czasu trzema zamianami, jak liczby w ćwiczeniu „Trzy liczby po kolei”. Przy każdej zamianie zamieniaj naraz czasy i imiona: if (t1 > t2) { swap(t1, t2); swap(i1, i2); }.',
            check: (inp) => { const t = toks(inp); return new Set([t[1], t[3], t[5]]).size === 3 ? null : 'powtórzony czas'; },
            tests: (r) => {
                const name = () => capital(r.word(r.int(1, 20)));
                const trzy = (ts) => ts.map((t) => `${name()} ${t}`).join('\n');
                const perm = (a) => [[a[0], a[1], a[2]], [a[0], a[2], a[1]], [a[1], a[0], a[2]], [a[1], a[2], a[0]], [a[2], a[0], a[1]], [a[2], a[1], a[0]]];
                const out = ['Ola 62\nAda 58\nIza 71', ...perm([10, 20, 30]).map(trzy), 'A 1\nB 10000\nC 5000'];
                while (out.length < 11) { const ts = r.arr(3, 1, 10000); if (new Set(ts).size === 3) out.push(trzy(ts)); }
                return out;
            },
            solve: (inp) => {
                const t = toks(inp);
                const z = [[t[0], Number(t[1])], [t[2], Number(t[3])], [t[4], Number(t[5])]].sort((x, y) => x[1] - y[1]);
                return join(z.map((p, i) => `${i + 1}. ${p[0]}`));
            },
            cpp: R`
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string i1, i2, i3;
    int t1, t2, t3;
    cin >> i1 >> t1 >> i2 >> t2 >> i3 >> t3;
    if (t1 > t2) { swap(t1, t2); swap(i1, i2); }
    if (t2 > t3) { swap(t2, t3); swap(i2, i3); }
    if (t1 > t2) { swap(t1, t2); swap(i1, i2); }
    cout << "1. " << i1 << "\n";
    cout << "2. " << i2 << "\n";
    cout << "3. " << i3 << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · switch i ?:
        {
            id: 'ie-dzien-tygodnia', krok: 8, level: 'latwe',
            title: 'Nazwa dnia tygodnia',
            short: 'Numer od 1 do 7 → nazwa dnia. Idealne zadanie dla switch.',
            tags: ['switch', 'case', 'break'],
            statement: ['Wczytaj numer dnia tygodnia (1 to poniedziałek, 7 — niedziela) i wypisz jego nazwę bez polskich znaków: poniedzialek, wtorek, sroda, czwartek, piatek, sobota albo niedziela.'],
            input_format: ['Jedna liczba całkowita od 1 do 7.'],
            output_format: ['Jedno słowo — nazwa dnia.'],
            constraints: ['1 ≤ numer ≤ 7'],
            examples: [{ input: '3' }, { input: '7' }],
            hint: R`switch (d) { case 1: cout << "poniedzialek\n"; break; case 2: … }. Nie zapomnij o break na końcu każdego case — bez niego program wypisze kilka dni naraz.`,
            tests: () => ['3', '7', '1', '2', '4', '5', '6'],
            solve: (inp) => DNI[nums(inp)[0] - 1],
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d;
    cin >> d;
    switch (d) {
        case 1: cout << "poniedzialek\n"; break;
        case 2: cout << "wtorek\n"; break;
        case 3: cout << "sroda\n"; break;
        case 4: cout << "czwartek\n"; break;
        case 5: cout << "piatek\n"; break;
        case 6: cout << "sobota\n"; break;
        case 7: cout << "niedziela\n"; break;
    }
    return 0;
}`,
        },
        {
            id: 'ie-ocena-slownie', krok: 8, level: 'latwe',
            title: 'Ocena słownie',
            short: 'Ocena od 1 do 6 → jej nazwa. Z default dla złych liczb.',
            tags: ['switch', 'default'],
            statement: [
                'Wczytaj ocenę szkolną (liczbę całkowitą) i wypisz jej nazwę bez polskich znaków: 1 — niedostateczny, 2 — dopuszczajacy, 3 — dostateczny, 4 — dobry, 5 — bardzo dobry, 6 — celujacy.',
                'Dla każdej innej liczby wypisz nie ma takiej oceny.',
            ],
            input_format: ['Jedna liczba całkowita.'],
            output_format: ['Jeden wiersz z nazwą oceny albo nie ma takiej oceny.'],
            constraints: ['liczba jest między −100 a 100'],
            examples: [{ input: '5' }, { input: '9' }],
            hint: 'Sześć przypadków case i default na wszystkie pozostałe liczby — default działa jak else na końcu łańcucha.',
            tests: (r) => ['5', '9', '1', '2', '3', '4', '6', '0', '7', '-1', '100', String(r.int(-100, 100))],
            solve: (inp) => ['niedostateczny', 'dopuszczajacy', 'dostateczny', 'dobry', 'bardzo dobry', 'celujacy'][nums(inp)[0] - 1] || 'nie ma takiej oceny',
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int o;
    cin >> o;
    switch (o) {
        case 1: cout << "niedostateczny\n"; break;
        case 2: cout << "dopuszczajacy\n"; break;
        case 3: cout << "dostateczny\n"; break;
        case 4: cout << "dobry\n"; break;
        case 5: cout << "bardzo dobry\n"; break;
        case 6: cout << "celujacy\n"; break;
        default: cout << "nie ma takiej oceny\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-min-max', krok: 8, level: 'latwe',
            title: 'Najpierw mniejsza',
            short: 'Wypisz mniejszą i większą z dwóch liczb — operatorem ?:.',
            tags: ['?:'],
            statement: ['Wczytaj dwie liczby całkowite a i b. Wypisz w jednym wierszu najpierw mniejszą, a potem większą z nich, oddzielone spacją. Spróbuj użyć operatora ?: zamiast if.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jeden wiersz z dwiema liczbami.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '9 4' }, { input: '-3 8' }],
            hint: 'int mn = (a < b) ? a : b; i podobnie mx = (a > b) ? a : b;. Potem wypisz mn i mx.',
            tests: (r) => ['9 4', '-3 8', '5 5', '0 0', '-1000000000 1000000000', ...Array.from({ length: 5 }, () => r.arr(2, -1e9, 1e9).join(' '))],
            solve: (inp) => nums(inp).sort((x, y) => x - y).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int mn = (a < b) ? a : b;
    int mx = (a > b) ? a : b;
    cout << mn << " " << mx << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-pora-roku', krok: 8, level: 'srednie',
            title: 'Pora roku',
            short: 'Numer miesiąca → pora roku. Kilka case z tym samym kodem.',
            tags: ['switch', 'kilka case naraz'],
            statement: ['Wczytaj numer miesiąca (od 1 do 12) i wypisz porę roku: zima dla grudnia, stycznia i lutego (12, 1, 2), wiosna dla miesięcy 3–5, lato dla 6–8 i jesien dla 9–11.'],
            input_format: ['Jedna liczba całkowita od 1 do 12.'],
            output_format: ['Jedno słowo: zima, wiosna, lato albo jesien.'],
            constraints: ['1 ≤ m ≤ 12'],
            examples: [{ input: '1' }, { input: '7' }],
            hint: R`Kilka case jeden pod drugim prowadzi do tego samego kodu: case 12: case 1: case 2: cout << "zima\n"; break;. To ta sama sztuczka co z sobotą i niedzielą w lekcji.`,
            tests: () => ['1', '7', ...Array.from({ length: 12 }, (_, i) => String(i + 1))],
            solve: (inp) => { const m = nums(inp)[0]; return m === 12 || m <= 2 ? 'zima' : m <= 5 ? 'wiosna' : m <= 8 ? 'lato' : 'jesien'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int m;
    cin >> m;
    switch (m) {
        case 12:
        case 1:
        case 2:
            cout << "zima\n";
            break;
        case 3:
        case 4:
        case 5:
            cout << "wiosna\n";
            break;
        case 6:
        case 7:
        case 8:
            cout << "lato\n";
            break;
        default:
            cout << "jesien\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-kalkulator', krok: 8, level: 'srednie',
            title: 'Kalkulator',
            short: 'Działanie w postaci 7*6 — switch na znaku działania.',
            tags: ['switch', 'char', 'long long'],
            statement: [
                'Wczytaj działanie zapisane bez spacji: liczba, znak działania i liczba, np. 7*6 albo 100/7. Znak działania to jeden z: + - * / %. Wypisz wynik.',
                'Dzielenie / i reszta % działają jak w C++ na liczbach całkowitych: 100/7 to 14, a 100%7 to 2. Przy dzieleniu i reszcie druga liczba nie jest zerem.',
            ],
            input_format: ['Jeden wiersz: liczba całkowita, znak działania i liczba całkowita, bez spacji. Druga liczba jest nieujemna.'],
            output_format: ['Jedna liczba — wynik działania.'],
            constraints: ['0 ≤ obie liczby ≤ 10⁹', 'dla / i % druga liczba jest dodatnia'],
            examples: [{ input: '7*6' }, { input: '100/7' }, { input: '9-12' }],
            hint: 'Wczytaj: cin >> a >> op >> b; (op to char). Iloczyn może sięgać 10¹⁸, więc a i b niech będą typu long long. Potem switch (op) z pięcioma przypadkami: case \'+\', case \'-\', case \'*\', case \'/\' i case \'%\'.',
            tests: (r) => {
                const big = () => r.int(0, 1e9);
                return ['7*6', '100/7', '9-12', '100%7', '0+0', '1000000000*1000000000', '1000000000-1000000000', '0-1000000000', '999999999/1000000000', '5%5', '1000000000+1000000000',
                    `${big()}+${big()}`, `${big()}-${big()}`, `${big()}*${big()}`, `${big()}/${r.int(1, 1e9)}`, `${big()}%${r.int(1, 1000)}`];
            },
            solve: (inp) => {
                const m = inp.trim().match(/^(\d+)([-+*/%])(\d+)$/);
                const a = BigInt(m[1]), b = BigInt(m[3]);
                return String({ '+': a + b, '-': a - b, '*': a * b, '/': b ? a / b : 0n, '%': b ? a % b : 0n }[m[2]]);
            },
            check: (inp) => (/[/%]0$/.test(inp.trim()) ? 'dzielenie przez zero' : null),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    char op;
    cin >> a >> op >> b;
    switch (op) {
        case '+': cout << a + b << "\n"; break;
        case '-': cout << a - b << "\n"; break;
        case '*': cout << a * b << "\n"; break;
        case '/': cout << a / b << "\n"; break;
        case '%': cout << a % b << "\n"; break;
    }
    return 0;
}`,
        },
        {
            id: 'ie-robot', krok: 8, level: 'srednie',
            title: 'Robot na kratce',
            short: 'Pozycja robota, kierunek N/S/E/W i liczba kroków — gdzie stanie?',
            tags: ['switch', 'char', 'współrzędne'],
            statement: [
                'Robot stoi w punkcie (x, y). Dostaje polecenie: kierunek i liczbę kroków d. Kierunek to jedna z liter: N (północ — y rośnie), S (południe — y maleje), E (wschód — x rośnie) albo W (zachód — x maleje).',
                'Wypisz współrzędne robota po wykonaniu polecenia: x i y oddzielone spacją.',
            ],
            input_format: ['Pierwszy wiersz: dwie liczby całkowite x i y. Drugi wiersz: litera kierunku i liczba całkowita d.'],
            output_format: ['Jeden wiersz: nowe współrzędne x i y.'],
            constraints: ['−10⁹ ≤ x, y ≤ 10⁹', '0 ≤ d ≤ 10⁹'],
            examples: [{ input: '2 3\nN 5' }, { input: '0 0\nW 7' }],
            hint: R`switch (k) { case 'N': y += d; break; case 'S': y -= d; break; … }. Współrzędne po ruchu mogą sięgać 2·10⁹, więc użyj long long.`,
            tests: (r) => ['2 3\nN 5', '0 0\nW 7', '0 0\nE 0', '-5 -5\nS 10', '1000000000 1000000000\nN 1000000000', '-1000000000 -1000000000\nW 1000000000', '1000000000 -1000000000\nE 1000000000',
                `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}\n${r.pick(['N', 'S', 'E', 'W'])} ${r.int(0, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}\n${r.pick(['N', 'S', 'E', 'W'])} ${r.int(0, 1e9)}`, `${r.int(-100, 100)} ${r.int(-100, 100)}\nS ${r.int(0, 100)}`],
            solve: (inp) => {
                const t = toks(inp);
                let x = Number(t[0]), y = Number(t[1]);
                const d = Number(t[3]);
                if (t[2] === 'N') y += d; else if (t[2] === 'S') y -= d; else if (t[2] === 'E') x += d; else x -= d;
                return `${x} ${y}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long x, y, d;
    char k;
    cin >> x >> y >> k >> d;
    switch (k) {
        case 'N': y += d; break;
        case 'S': y -= d; break;
        case 'E': x += d; break;
        case 'W': x -= d; break;
    }
    cout << x << " " << y << "\n";
    return 0;
}`,
        },
    ];
};
