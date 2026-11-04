// Typy zmiennych — baza zadań na koniec tematu (krok 12).
// Kolejność = kolejność w lekcji i w sprawdzarce: najpierw łatwe, potem średnie, na końcu trudne.
// Każde zadanie łączy kilka zagadnień z lekcji (pole tags), a trudność rośnie powoli.
module.exports = (h) => {
    const { reader, nums, toks, join, fx, safe, dec, capital } = h;
    const R = String.raw;
    const MALE = 'abcdefghijklmnopqrstuvwxyz';
    const K = 12;

    return [
        // ================================================================ łatwe
        {
            id: 'tz-kieszonkowe', krok: K, level: 'latwe',
            title: 'Kieszonkowe',
            short: 'Ile pieniędzy będzie w skarbonce za t tygodni?',
            tags: ['int', 'cin', 'działania'],
            statement: ['Bajtek ma w skarbonce s złotych. Co tydzień dostaje k złotych kieszonkowego i niczego nie wydaje. Ile pieniędzy będzie miał w skarbonce za t tygodni?'],
            input_format: ['W jedynym wierszu trzy liczby całkowite s, k, t.'],
            output_format: ['Wypisz jedną liczbę — stan skarbonki po t tygodniach.'],
            constraints: ['0 ≤ s ≤ 10 000', '0 ≤ k ≤ 1000', '0 ≤ t ≤ 1000'],
            examples: [{ input: '50 20 4', note: '50 + 4 · 20 = 130.' }],
            hint: 'Po t tygodniach Bajtek dostanie t razy po k złotych, czyli k · t. Do tego dochodzi to, co już ma: s + k * t.',
            tests: (r) => ['0 0 0', '100 0 50', '0 1000 1000', '10000 1000 1000', '7 3 0', `${r.int(0, 10000)} ${r.int(0, 1000)} ${r.int(0, 1000)}`, `${r.int(0, 100)} ${r.int(0, 50)} ${r.int(0, 52)}`],
            solve: (inp) => { const [s, k, t] = nums(inp); return String(s + k * t); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int s, k, t;
    cin >> s >> k >> t;
    cout << s + k * t << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-zlotowki', krok: K, level: 'latwe',
            title: 'Złotówki i grosze',
            short: 'Zamień kwotę w groszach na złote i grosze.',
            tags: ['int', '/', '%'],
            statement: ['Kasa w sklepie liczy wszystko w groszach. Wczytaj kwotę g w groszach i wypisz ją w złotych i groszach, w postaci: Z zl G gr. W złotówce jest 100 groszy.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita g.'],
            output_format: ['Wypisz jeden wiersz w postaci Z zl G gr.'],
            constraints: ['0 ≤ g ≤ 10⁹'],
            examples: [{ input: '1234' }, { input: '5' }, { input: '700' }],
            hint: R`Pełne złote to g / 100 (dzielenie całkowite), a reszta groszy to g % 100. Wypisz: cout << g / 100 << " zl " << g % 100 << " gr\n";`,
            tests: (r) => ['0', '99', '100', '101', '1000000000', '999999999', r.int(0, 1e9), r.int(0, 10000)],
            solve: (inp) => { const g = reader(inp).int(); return `${Math.floor(g / 100)} zl ${g % 100} gr`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int g;
    cin >> g;
    cout << g / 100 << " zl " << g % 100 << " gr\n";
    return 0;
}`,
        },
        {
            id: 'tz-inicjaly', krok: K, level: 'latwe',
            title: 'Inicjały',
            short: 'Z imienia i nazwiska zrób inicjały: J.K.',
            tags: ['string', 's[0]', 'char'],
            statement: ['Wczytaj imię i nazwisko i wypisz inicjały: pierwszą literę imienia, kropkę, pierwszą literę nazwiska i kropkę — bez spacji, na przykład J.K.'],
            input_format: ['W jedynym wierszu dwa słowa: imię i nazwisko. Każde zaczyna się wielką literą alfabetu angielskiego, a dalej ma małe litery.'],
            output_format: ['Wypisz inicjały w postaci X.Y.'],
            constraints: ['każde słowo ma od 1 do 30 liter'],
            examples: [{ input: 'Jan Kowalski' }],
            hint: R`Pierwszą literę słowa s odczytasz jako s[0] — to wartość typu char. Wypisz: cout << imie[0] << "." << nazwisko[0] << ".\n";`,
            tests: (r) => ['Ala Nowak', 'X Y', 'Bajtazar Bitowski', `${capital(r.word(r.int(1, 30)))} ${capital(r.word(r.int(1, 30)))}`, `${capital(r.word(r.int(1, 30)))} ${capital(r.word(30))}`],
            solve: (inp) => { const [a, b] = toks(inp); return `${a[0]}.${b[0]}.`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie, nazwisko;
    cin >> imie >> nazwisko;
    cout << imie[0] << "." << nazwisko[0] << ".\n";
    return 0;
}`,
        },
        {
            id: 'tz-litera-k', krok: K, level: 'latwe',
            title: 'Litera numer k',
            short: 'Wypisz k-tą literę alfabetu: małą i wielką.',
            tags: ['char', '(char)', 'ASCII'],
            statement: ['Wczytaj liczbę k i wypisz k-tą literę alfabetu angielskiego — najpierw małą, potem wielką, oddzielone spacją. Litera numer 1 to a (i A), a litera numer 26 to z (i Z).'],
            input_format: ['W jedynym wierszu jedna liczba całkowita k.'],
            output_format: ['Wypisz małą i wielką literę oddzielone spacją.'],
            constraints: ['1 ≤ k ≤ 26'],
            examples: [{ input: '3' }, { input: '26' }],
            hint: "Litera numer 1 to 'a', numer 2 to 'a' + 1 i tak dalej — czyli k-ta litera to 'a' + k - 1. To liczba, więc zamień ją na znak: (char)('a' + k - 1). Wielką literę dostaniesz tak samo, zaczynając od 'A'.",
            tests: () => Array.from({ length: 26 }, (_, i) => String(i + 1)),
            solve: (inp) => { const k = reader(inp).int(); return `${MALE[k - 1]} ${MALE[k - 1].toUpperCase()}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int k;
    cin >> k;
    cout << (char)('a' + k - 1) << " " << (char)('A' + k - 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-kantor', krok: K, level: 'latwe',
            title: 'Kantor',
            short: 'Ile złotych zapłacisz za e euro po kursie k?',
            tags: ['double', 'setprecision(2)'],
            statement: ['W kantorze kupujesz euro: jedno euro kosztuje k złotych. Ile złotych zapłacisz za e euro? Wynik wypisz z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['W jedynym wierszu dwie liczby rzeczywiste: e (kwota w euro, z dwiema cyframi po kropce) i k (kurs, z czterema cyframi po kropce).'],
            output_format: ['Wypisz kwotę w złotych z dokładnie dwiema cyframi po kropce.'],
            constraints: ['0.01 ≤ e ≤ 100 000.00', '3.0000 ≤ k ≤ 6.0000', 'testy dobrano tak, żeby zaokrąglenie do groszy było zawsze jednoznaczne'],
            examples: [{ input: '100.00 4.2817' }, { input: '12.50 4.3000' }],
            hint: 'Obie liczby wczytaj do zmiennych double i pomnóż: e * k. Wypisz z fixed i setprecision(2).',
            tests: (r) => {
                const out = ['1.00 4.0000', '100000.00 6.0000', '0.01 3.0000'];
                while (out.length < 10) {
                    const e = dec(r.int(1, 10000000), 2), k = dec(r.int(30000, 60000), 4);
                    if (safe(Number(e) * Number(k), 2)) out.push(`${e} ${k}`);
                }
                return out;
            },
            solve: (inp) => { const [e, k] = nums(inp); return fx(e * k, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double e, k;
    cin >> e >> k;
    cout << fixed << setprecision(2) << e * k << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-palindrom3', krok: K, level: 'latwe',
            title: 'Trzyliterowy palindrom',
            short: 'Czy słowo z trzech liter czyta się tak samo od tyłu?',
            tags: ['string', '==', 'bool'],
            statement: ['Palindrom to słowo, które czyta się tak samo od przodu i od tyłu, np. oko albo kajak. Wczytaj słowo złożone z dokładnie trzech liter i wypisz 1, jeśli jest palindromem, albo 0, jeśli nie jest.'],
            input_format: ['W jedynym wierszu jedno słowo.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['słowo ma dokładnie 3 małe litery alfabetu angielskiego'],
            examples: [{ input: 'oko' }, { input: 'kot' }],
            hint: 'Trzyliterowe słowo jest palindromem, gdy pierwsza litera jest taka sama jak ostatnia — środkowa nie ma znaczenia. cout << (s[0] == s[2]);',
            tests: (r) => ['aaa', 'abc', 'aba', 'zzy', 'yzz', 'ala', 'ewa', 'kok', r.word(3), r.word(3)],
            solve: (inp) => { const s = toks(inp)[0]; return s[0] === s[2] ? '1' : '0'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    cout << (s[0] == s[2]) << "\n";
    return 0;
}`,
        },

        // ================================================================ średnie
        {
            id: 'tz-monety', krok: K, level: 'srednie',
            title: 'Monety',
            short: 'Wydaj resztę monetami 5, 2 i 1 zł — jak najmniejszą liczbą monet.',
            tags: ['int', '/', '%'],
            statement: ['Automat wydaje resztę monetami 5 zł, 2 zł i 1 zł i zawsze używa jak najmniej monet: najpierw daje tyle piątek, ile się da, potem tyle dwójek, ile się da, a resztę złotówkami. Wczytaj kwotę n (w złotych) i wypisz, ile monet każdego rodzaju wyda automat.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz w jednym wierszu trzy liczby: ile monet 5 zł, 2 zł i 1 zł wyda automat.'],
            constraints: ['0 ≤ n ≤ 10⁹'],
            examples: [{ input: '13', note: '13 = 2 · 5 + 1 · 2 + 1 · 1.' }, { input: '4' }],
            hint: 'Piątek jest n / 5. Po ich wydaniu zostaje n % 5 złotych — z tego dwójek jest (n % 5) / 2, a złotówek (n % 5) % 2.',
            tests: (r) => ['0', '1', '2', '3', '5', '9', '1000000000', '999999999', r.int(0, 1e9), r.int(0, 100)],
            solve: (inp) => { const n = reader(inp).int(); const x = n % 5; return `${Math.floor(n / 5)} ${Math.floor(x / 2)} ${x % 2}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n / 5 << " " << (n % 5) / 2 << " " << (n % 5) % 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-pizza', krok: K, level: 'srednie',
            title: 'Pizza na spółkę',
            short: 'Ile pizz zamówić, żeby nikt nie był głodny? Dzielenie w górę.',
            tags: ['int', 'dzielenie w górę'],
            statement: ['n przyjaciół zamawia pizzę. Każdy zje dokładnie k kawałków, a jedna pizza ma 8 kawałków. Ile całych pizz trzeba zamówić, żeby nikt nie był głodny, i ile kawałków zostanie?'],
            input_format: ['W jedynym wierszu dwie liczby całkowite n i k.'],
            output_format: ['W pierwszym wierszu wypisz liczbę pizz, a w drugim liczbę kawałków, które zostaną.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 1000'],
            examples: [
                { input: '5 3', note: 'Potrzeba 15 kawałków. Jedna pizza (8 kawałków) to za mało, dwie (16) wystarczą — zostanie 1 kawałek.' },
                { input: '4 2', note: '8 kawałków to dokładnie jedna pizza — nic nie zostaje.' },
            ],
            hint: 'Potrzeba n · k kawałków. Zwykłe dzielenie przez 8 zaokrągla w dół, a tu potrzebujesz w górę — pomoże sztuczka z lekcji: (x + 7) / 8 to x / 8 zaokrąglone w górę. Zostaje pizze · 8 − n · k kawałków.',
            tests: (r) => ['1 1', '1 8', '1 9', '8 1', '1000 1000', '3 5', `${r.int(1, 1000)} ${r.int(1, 1000)}`, `${r.int(1, 20)} ${r.int(1, 10)}`],
            solve: (inp) => { const [n, k] = nums(inp); const x = n * k; const p = Math.floor((x + 7) / 8); return join(p, p * 8 - x); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int kawalki = n * k;
    int pizze = (kawalki + 7) / 8;
    cout << pizze << "\n";
    cout << pizze * 8 - kawalki << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-dni-godziny', krok: K, level: 'srednie',
            title: 'Doby, godziny i minuty',
            short: 'Zamień liczbę minut na pełne doby, godziny i minuty.',
            tags: ['int', '/', '%'],
            statement: ['Wczytaj liczbę minut m i zamień ją na pełne doby, godziny i minuty. Doba ma 24 godziny, a godzina 60 minut.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita m.'],
            output_format: ['Wypisz w jednym wierszu trzy liczby: doby, godziny (od 0 do 23) i minuty (od 0 do 59).'],
            constraints: ['0 ≤ m ≤ 10⁹'],
            examples: [{ input: '1500', note: '1500 minut = 1440 minut (pełna doba) + 60 minut (godzina).' }, { input: '59' }],
            hint: 'Doba ma 24 · 60 = 1440 minut. Pełnych dób jest m / 1440. Z reszty (m % 1440) godziny to (m % 1440) / 60, a minuty to m % 60.',
            tests: (r) => ['0', '60', '1439', '1440', '1441', '1000000000', r.int(0, 1e9), r.int(0, 1e5)],
            solve: (inp) => { const m = reader(inp).int(); return `${Math.floor(m / 1440)} ${Math.floor((m % 1440) / 60)} ${m % 60}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int m;
    cin >> m;
    cout << m / 1440 << " " << (m % 1440) / 60 << " " << m % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-suma-cyfr', krok: K, level: 'srednie',
            title: 'Suma cyfr',
            short: 'Wyciągnij cztery cyfry liczby i je dodaj.',
            tags: ['int', '/ 10', '% 10'],
            statement: ['Wczytaj liczbę czterocyfrową i wypisz sumę jej cyfr.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz sumę cyfr liczby n.'],
            constraints: ['1000 ≤ n ≤ 9999'],
            examples: [{ input: '2026', note: '2 + 0 + 2 + 6 = 10.' }, { input: '9999' }],
            hint: 'Cyfry wyciągniesz dzieleniem i resztą: tysiące to n / 1000, setki n / 100 % 10, dziesiątki n / 10 % 10, jedności n % 10. Dodaj je do siebie.',
            tests: (r) => ['1000', '1001', '9000', '1234', '5050', String(r.int(1000, 9999)), String(r.int(1000, 9999)), String(r.int(1000, 9999))],
            solve: (inp) => String(toks(inp)[0].split('').reduce((a, c) => a + Number(c), 0)),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n / 1000 + n / 100 % 10 + n / 10 % 10 + n % 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-od-tylu', krok: K, level: 'srednie',
            title: 'Liczba od tyłu',
            short: 'Odwróć kolejność cyfr liczby trzycyfrowej: 120 → 21.',
            tags: ['int', '/ 10', '% 10'],
            statement: ['Wczytaj liczbę trzycyfrową i wypisz liczbę, która powstanie, gdy zapiszesz jej cyfry w odwrotnej kolejności. Wynik wypisz jako zwykłą liczbę — bez zer na początku (ze 120 powstaje 21).'],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz liczbę zapisaną od tyłu.'],
            constraints: ['100 ≤ n ≤ 999'],
            examples: [{ input: '123' }, { input: '120', note: 'Od tyłu to 021, ale jako liczba to po prostu 21.' }],
            hint: 'Weź cyfry: a = n / 100, b = n / 10 % 10, c = n % 10. Liczba od tyłu to c · 100 + b · 10 + a. Zera z przodu znikną same, bo wypisujesz liczbę, a nie napis.',
            tests: (r) => ['100', '101', '500', '999', '910', '305', String(r.int(100, 999)), String(r.int(100, 999)), String(r.int(100, 999))],
            solve: (inp) => String(Number(toks(inp)[0].split('').reverse().join(''))),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int a = n / 100, b = n / 10 % 10, c = n % 10;
    cout << c * 100 + b * 10 + a << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-predkosc', krok: K, level: 'srednie',
            title: 'Średnia prędkość',
            short: 'Kilometry i minuty → km/h. Uwaga: t / 60 na int-ach to często 0.',
            tags: ['double', 'rzutowanie', 'setprecision'],
            statement: ['Pociąg przejechał d kilometrów w czasie t minut. Jaka była jego średnia prędkość w kilometrach na godzinę? Wypisz wynik z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite d i t.'],
            output_format: ['Wypisz prędkość w km/h z dokładnie dwiema cyframi po kropce.'],
            constraints: ['1 ≤ d ≤ 10 000', '1 ≤ t ≤ 10 000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '150 90', note: '90 minut to 1,5 godziny, a 150 / 1,5 = 100.' }, { input: '10 7' }],
            hint: 'Prędkość w km/h to droga podzielona przez czas w godzinach, a t minut to t / 60 godziny. Uwaga: t / 60 na int-ach daje 0 dla t < 60! Licz na double: d * 60.0 / t.',
            tests: (r) => {
                const out = ['1 1', '10000 1', '1 10000', '60 60', '120 45'];
                while (out.length < 11) {
                    const d = r.int(1, 10000), t = r.int(1, 10000);
                    if (safe(d * 60 / t, 2) && safe(d / (t / 60), 2)) out.push(`${d} ${t}`);
                }
                return out;
            },
            solve: (inp) => { const [d, t] = nums(inp); return fx(d * 60 / t, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int d, t;
    cin >> d >> t;
    cout << fixed << setprecision(2) << d * 60.0 / t << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-bmi', krok: K, level: 'srednie',
            title: 'Kalkulator BMI',
            short: 'Masa przez kwadrat wzrostu — centymetry trzeba zamienić na metry.',
            tags: ['double', '/ 100.0', 'setprecision'],
            statement: ['Wskaźnik BMI to masa ciała (w kilogramach) podzielona przez kwadrat wzrostu (w metrach). Wczytaj masę m w kilogramach i wzrost h w centymetrach i wypisz BMI z dokładnością do jednego miejsca po przecinku.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite m i h.'],
            output_format: ['Wypisz BMI z dokładnie jedną cyfrą po kropce.'],
            constraints: ['20 ≤ m ≤ 200', '100 ≤ h ≤ 220', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '70 175' }, { input: '50 160' }],
            hint: 'Najpierw zamień centymetry na metry: double metry = h / 100.0; — dzielenie przez 100.0, a nie przez 100! BMI to m / (metry * metry).',
            tests: (r) => {
                const out = [];
                const ok = (m, hh) => safe(m / ((hh / 100) * (hh / 100)), 1) && safe(m * 10000 / (hh * hh), 1);
                for (const [m, hh] of [[20, 220], [200, 100], [60, 180], [90, 190]]) if (ok(m, hh)) out.push(`${m} ${hh}`);
                while (out.length < 11) {
                    const m = r.int(20, 200), hh = r.int(100, 220);
                    if (ok(m, hh)) out.push(`${m} ${hh}`);
                }
                return out;
            },
            solve: (inp) => { const [m, hh] = nums(inp); const metry = hh / 100; return fx(m / (metry * metry), 1); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int m, h;
    cin >> m >> h;
    double metry = h / 100.0;
    cout << fixed << setprecision(1) << m / (metry * metry) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-przestepny', krok: K, level: 'srednie',
            title: 'Rok przestępny',
            short: 'Podzielny przez 4, ale nie przez 100 — chyba że przez 400.',
            tags: ['bool', '&& i ||', '%'],
            statement: ['Rok jest przestępny (luty ma wtedy 29 dni), jeśli dzieli się przez 4, ale nie dzieli się przez 100 — chyba że dzieli się przez 400, wtedy też jest przestępny. Na przykład 2024 i 2000 są przestępne, a 2023 i 1900 nie są. Wczytaj rok i wypisz 1, jeśli jest przestępny, albo 0, jeśli nie jest.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita — rok.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['1 ≤ rok ≤ 10⁹'],
            examples: [{ input: '2024' }, { input: '1900', note: '1900 dzieli się przez 100, ale nie przez 400.' }, { input: '2000' }],
            hint: 'Zapisz całą regułę jednym wyrażeniem: (rok % 4 == 0 && rok % 100 != 0) || rok % 400 == 0. Nawiasy pokazują, które warunki łączą się ze sobą.',
            tests: (r) => ['1', '4', '100', '400', '2023', '2100', '2400', '1000000000', '999999996', String(r.int(1, 1e9)), String(4 * r.int(1, 2.5e8))],
            solve: (inp) => { const y = reader(inp).int(); return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? '1' : '0'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int rok;
    cin >> rok;
    cout << ((rok % 4 == 0 && rok % 100 != 0) || rok % 400 == 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-dziennik', krok: K, level: 'srednie',
            title: 'Kto pierwszy w dzienniku?',
            short: 'Porównaj dwa nazwiska alfabetycznie — operatorem < na stringach.',
            tags: ['string', '<', 'bool'],
            statement: [
                'W dzienniku uczniowie są zapisani alfabetycznie według nazwisk. Wczytaj dwa różne nazwiska (małymi literami) i wypisz 1, jeśli pierwsze nazwisko jest w dzienniku wcześniej niż drugie, albo 0, jeśli później.',
                'Napisy w C++ porównuje się zwykłymi operatorami < i >, a komputer sprawdza wtedy kolejność alfabetyczną — dokładnie tak jak w słowniku.',
            ],
            input_format: ['W jedynym wierszu dwa różne nazwiska oddzielone spacją.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['nazwiska są różne', 'każde ma od 1 do 30 małych liter alfabetu angielskiego'],
            examples: [
                { input: 'kowalski nowak' },
                { input: 'nowak nowakowski', note: 'Słowo, które jest początkiem dłuższego słowa, stoi w słowniku przed nim.' },
                { input: 'zielinski adamczyk' },
            ],
            hint: 'cout << (a < b); — dla napisów < znaczy „wcześniej w słowniku”. Komputer porównuje litery od lewej, aż trafi na pierwszą różnicę.',
            tests: (r) => {
                const out = ['a b', 'b a', 'ab a', 'abc abd', 'nowakowski nowak'];
                while (out.length < 10) {
                    const a = r.word(r.int(1, 30)), b = r() < 0.4 ? a.slice(0, r.int(1, a.length)) + r.word(r.int(0, 5)) : r.word(r.int(1, 30));
                    if (a !== b && b.length >= 1 && b.length <= 30) out.push(`${a} ${b}`);
                }
                return out;
            },
            check: (inp) => { const [a, b] = toks(inp); return a === b ? 'te same nazwiska' : null; },
            solve: (inp) => { const [a, b] = toks(inp); return a < b ? '1' : '0'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    cout << (a < b) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-ramka', krok: K, level: 'srednie',
            title: 'Słowo w ramce',
            short: 'Otocz słowo ramką z gwiazdek. Przyda się string(n, c) i .length().',
            tags: ['string', 'string(n, c)', '.length()'],
            statement: ['Wczytaj słowo i wypisz je w ramce z gwiazdek — tak jak w przykładzie. Ramka ma trzy wiersze: górny brzeg z gwiazdek, wiersz ze słowem otoczonym z każdej strony gwiazdką i spacją, oraz dolny brzeg taki sam jak górny.'],
            input_format: ['W jedynym wierszu jedno słowo.'],
            output_format: ['Wypisz trzy wiersze ramki.'],
            constraints: ['słowo ma od 1 do 50 małych liter alfabetu angielskiego'],
            examples: [{ input: 'bajtek' }],
            hint: R`Górny brzeg ma o 4 znaki więcej niż słowo (gwiazdka i spacja z każdej strony). Taki napis zbudujesz jako string(s.length() + 4, '*'). Środkowy wiersz: cout << "* " << s << " *\n";`,
            tests: (r) => ['a', 'ola', 'cpp', r.word(50), r.word(r.int(1, 50)), r.word(r.int(1, 50))],
            solve: (inp) => { const s = toks(inp)[0]; const b = '*'.repeat(s.length + 4); return join(b, `* ${s} *`, b); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    string brzeg = string(s.length() + 4, '*');
    cout << brzeg << "\n";
    cout << "* " << s << " *\n";
    cout << brzeg << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-pole-trojkata', krok: K, level: 'srednie',
            title: 'Pole trójkąta',
            short: 'a · h / 2 dla boków do 100 000 — iloczyn przepełni int-a.',
            tags: ['double', 'przepełnienie', 'rzutowanie'],
            statement: [
                'Wczytaj długość podstawy a i wysokość h trójkąta (liczby całkowite) i wypisz jego pole, czyli a · h / 2, z dokładnością do jednego miejsca po przecinku.',
                'Uważaj: a i h mogą sięgać 100 000.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i h.'],
            output_format: ['Wypisz pole z dokładnie jedną cyfrą po kropce.'],
            constraints: ['1 ≤ a, h ≤ 100 000'],
            examples: [{ input: '3 5' }, { input: '100000 100000', note: 'a · h = 10 000 000 000 — więcej, niż zmieści int.' }],
            hint: 'Iloczyn a · h może sięgać 10¹⁰ — jeśli policzysz go na int-ach, przepełni się, zanim dojdzie do dzielenia. Zamień jedną z liczb na double przed mnożeniem: (double)a * h / 2.',
            tests: (r) => ['1 1', '1 2', '99999 99999', '100000 99999', '65536 65536', `${r.int(1, 1e5)} ${r.int(1, 1e5)}`, `${r.int(1, 1e5)} ${r.int(1, 1e5)}`, `${r.int(1, 1000)} ${r.int(1, 1000)}`],
            solve: (inp) => { const [a, hh] = nums(inp); return fx(a * hh / 2, 1); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, h;
    cin >> a >> h;
    cout << fixed << setprecision(1) << (double)a * h / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-kwadrat-sumy', krok: K, level: 'srednie',
            title: 'Kwadrat sumy',
            short: '(a + b)² dla liczb do miliarda — już sama suma nie mieści się w int.',
            tags: ['long long', 'przepełnienie'],
            statement: ['Wczytaj dwie liczby całkowite a i b i wypisz kwadrat ich sumy, czyli (a + b)².'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz jedną liczbę — (a + b)².'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '2 3' }, { input: '1000000000 1000000000' }],
            hint: 'Już sama suma a + b może sięgać 2 · 10⁹ — więcej niż limit int-a. Wczytaj liczby do long long: wtedy s = a + b i s * s (do 4 · 10¹⁸) mieszczą się bez problemu.',
            tests: (r) => ['0 0', '-1000000000 -1000000000', '1000000000 -1000000000', '-5 2', '46341 0', `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`],
            solve: (inp) => { const [a, b] = toks(inp).map(BigInt); const s = a + b; return String(s * s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long s = a + b;
    cout << s * s << "\n";
    return 0;
}`,
        },

        // ================================================================ trudne
        {
            id: 'tz-zegar-cyfrowy', krok: K, level: 'trudne',
            title: 'Zegar cyfrowy',
            short: 'Dodaj do godziny t minut. Po 23:59 zegar wraca do 0:00 — przyda się %.',
            tags: ['int', '%', 'reszta jak zegar'],
            statement: ['Na zegarze cyfrowym jest godzina H:M. Bajtek nastawia minutnik na t minut. Która godzina będzie na zegarze, gdy minutnik zadzwoni? Zegar pokazuje godziny od 0 do 23, a po 23:59 jest 0:00.'],
            input_format: ['W jedynym wierszu trzy liczby całkowite H, M i t.'],
            output_format: ['Wypisz w jednym wierszu dwie liczby: godzinę (od 0 do 23) i minutę (od 0 do 59), oddzielone spacją.'],
            constraints: ['0 ≤ H ≤ 23', '0 ≤ M ≤ 59', '0 ≤ t ≤ 10⁹'],
            examples: [{ input: '23 50 15', note: '23:50 + 15 minut = 0:05 następnego dnia.' }, { input: '8 0 1440', note: '1440 minut to pełna doba — zegar pokaże tę samą godzinę.' }],
            hint: 'Zamień godzinę na liczbę minut od północy: H · 60 + M, i dodaj t. Doba ma 1440 minut, więc reszta z dzielenia przez 1440 mówi, ile minut minęło od ostatniej północy. Z tej liczby godzina to x / 60, a minuta x % 60.',
            tests: (r) => ['0 0 0', '23 59 1', '12 30 0', '0 0 1000000000', '23 59 1000000000', '6 45 75',
                ...Array.from({ length: 4 }, () => `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 1e9)}`), `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 3000)}`],
            solve: (inp) => { const [H, M, t] = nums(inp); const x = (H * 60 + M + t) % 1440; return `${Math.floor(x / 60)} ${x % 60}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int H, M, t;
    cin >> H >> M >> t;
    int x = (H * 60 + M + t) % 1440;
    cout << x / 60 << " " << x % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-rachunek', krok: K, level: 'trudne',
            title: 'Podział rachunku',
            short: 'Podziel rachunek po równo w groszach — resztę dopłaca organizator.',
            tags: ['int', '/ i %', 'double', 'setprecision'],
            statement: ['n przyjaciół płaci razem rachunek w restauracji — g groszy. Każdy płaci tyle samo, w pełnych groszach, i tak dużo, jak się da. Groszy, które zostaną (bo nie dzielą się po równo), dopłaca organizator — oprócz swojej części. Wypisz, ile płaci zwykły uczestnik, a ile organizator — w złotych, z dokładnością do groszy.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite: g (rachunek w groszach) i n (liczba osób razem z organizatorem).'],
            output_format: ['W pierwszym wierszu wypisz kwotę zwykłego uczestnika, a w drugim kwotę organizatora — obie w złotych, z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ g ≤ 10⁹', '2 ≤ n ≤ 100'],
            examples: [
                { input: '10000 3', note: '10 000 groszy na 3 osoby: każdy płaci 3333 grosze, zostaje 1 grosz, który dopłaca organizator.' },
                { input: '5000 4' },
            ],
            hint: 'Licz w groszach na int-ach: część jednej osoby to g / n, a reszta to g % n. Dopiero na koniec zamień grosze na złote, dzieląc przez 100.0 (nie przez 100!), i wypisz z setprecision(2).',
            tests: (r) => ['1 2', '99 100', '1000000000 3', '1000000000 100', '7 7', '101 2', `${r.int(1, 1e9)} ${r.int(2, 100)}`, `${r.int(1, 1e6)} ${r.int(2, 100)}`, `${r.int(1, 1e9)} ${r.int(2, 100)}`],
            solve: (inp) => { const [g, n] = nums(inp); const c = Math.floor(g / n); return join(fx(c / 100, 2), fx((c + g % n) / 100, 2)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int g, n;
    cin >> g >> n;
    int czesc = g / n;
    int reszta = g % n;
    cout << fixed << setprecision(2);
    cout << czesc / 100.0 << "\n";
    cout << (czesc + reszta) / 100.0 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-trojkat', krok: K, level: 'trudne',
            title: 'Czy powstanie trójkąt?',
            short: 'Trzy warunki połączone && — a sumy boków nie mieszczą się w int.',
            tags: ['bool', '&&', 'long long'],
            statement: ['Z trzech patyków o długościach a, b i c da się zbudować trójkąt wtedy i tylko wtedy, gdy każdy patyk jest krótszy niż dwa pozostałe razem: a < b + c, b < a + c oraz c < a + b. Wczytaj długości patyków i wypisz 1, jeśli trójkąt powstanie, albo 0, jeśli nie.'],
            input_format: ['W jedynym wierszu trzy liczby całkowite a, b, c.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['1 ≤ a, b, c ≤ 2 · 10⁹'],
            examples: [
                { input: '3 4 5' },
                { input: '1 2 3', note: 'Patyki 1 i 2 razem mają długość 3 — tyle samo co trzeci, więc „położą się płasko”. Trójkąt nie powstanie.' },
                { input: '2000000000 2000000000 2000000000', note: 'Suma dwóch patyków to 4 · 10⁹ — nie mieści się w int.' },
            ],
            hint: 'Każda długość mieści się w int, ale suma dwóch już nie (4 · 10⁹ > 2 147 483 647). Wczytaj liczby do long long. Trzy warunki połącz operatorem &&.',
            tests: (r) => {
                const out = ['1 1 1', '1 1 2', '2 1 1', '1 2 1', '5 3 4', '1 1 2000000000', '2000000000 1000000000 1000000001', '2000000000 1000000000 1000000000', '1500000000 1500000000 1'];
                for (let i = 0; i < 4; i++) {
                    const a = r.int(1, 2e9), b = r.int(1, 2e9);
                    out.push(`${a} ${b} ${r() < 0.6 ? r.int(Math.abs(a - b) + 1, Math.min(2e9, a + b - 1)) : r.int(1, 2e9)}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b, c] = toks(inp).map(BigInt); return a < b + c && b < a + c && c < a + b ? '1' : '0'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    cout << (a < b + c && b < a + c && c < a + b) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-cezar', krok: K, level: 'trudne',
            title: 'Szyfr Cezara',
            short: 'Przesuń literę o k miejsc w alfabecie. Po z wracamy do a.',
            tags: ['char', '%', '(char)'],
            statement: [
                'Juliusz Cezar szyfrował listy, przesuwając każdą literę o kilka miejsc w alfabecie. Przy przesunięciu o 3 litera a staje się d, b staje się e, a pod koniec alfabetu liczymy dalej od początku: x staje się a, y — b, a z — c. Wczytaj małą literę i przesunięcie k, a potem wypisz zaszyfrowaną literę.',
                'Przesunięcie może być ogromne — alfabet „zawija się” wtedy wiele razy.',
            ],
            input_format: ['W jedynym wierszu mała litera i liczba całkowita k, oddzielone spacją.'],
            output_format: ['Wypisz jedną małą literę — zaszyfrowaną literę.'],
            constraints: ['litera jest jedną z 26 małych liter alfabetu angielskiego', '0 ≤ k ≤ 10⁹'],
            examples: [{ input: 'a 3' }, { input: 'y 3' }, { input: 'c 52', note: '52 = 2 · 26 — litera dwa razy obiega cały alfabet i wraca na swoje miejsce.' }],
            hint: "Zamień literę na numer od 0 do 25: c - 'a'. Dodaj k i weź resztę z dzielenia przez 26 — to numer nowej litery (działa jak zegar, który po 25 wraca do 0). Na koniec z powrotem na znak: (char)('a' + (c - 'a' + k) % 26).",
            tests: (r) => ['a 0', 'z 1', 'z 0', 'm 13', 'a 25', 'a 26', 'q 1000000000', `${r.pick(MALE.split(''))} ${r.int(0, 1e9)}`, `${r.pick(MALE.split(''))} ${r.int(0, 100)}`, `${r.pick(MALE.split(''))} ${r.int(0, 1e9)}`],
            solve: (inp) => { const [c, k] = toks(inp); return MALE[(c.charCodeAt(0) - 97 + Number(k)) % 26]; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    int k;
    cin >> c >> k;
    cout << (char)('a' + (c - 'a' + k) % 26) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-znak-liczby', krok: K, level: 'trudne',
            title: 'Znak liczby',
            short: 'Wypisz 1, −1 albo 0 bez instrukcji if — porównania to też liczby.',
            tags: ['bool', 'bool jako liczba'],
            statement: [
                'Wczytaj liczbę całkowitą n i wypisz 1, jeśli jest dodatnia, −1, jeśli jest ujemna, albo 0, jeśli jest zerem.',
                'Instrukcję if poznasz za dwie lekcje — spróbuj obejść się bez niej. Przypomnij sobie, co się dzieje z true i false w działaniach arytmetycznych.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz 1, -1 albo 0.'],
            constraints: ['−10⁹ ≤ n ≤ 10⁹'],
            examples: [{ input: '42' }, { input: '-7' }, { input: '0' }],
            hint: '(n > 0) to 1 dla liczb dodatnich, a (n < 0) to 1 dla ujemnych. Odejmij jedno od drugiego: cout << (n > 0) - (n < 0); — sprawdź na kartce, że to działa we wszystkich trzech przypadkach.',
            tests: (r) => ['1', '-1', '1000000000', '-1000000000', String(r.int(-1e9, -1)), String(r.int(1, 1e9))],
            solve: (inp) => String(Math.sign(reader(inp).int())),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << (n > 0) - (n < 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-wieksza', krok: K, level: 'trudne',
            title: 'Większa z dwóch — bez if',
            short: 'Mnożenie przez wynik porównania „włącza” albo „wyłącza” liczbę.',
            tags: ['bool', 'bool jako liczba', '*'],
            statement: ['Wczytaj dwie liczby całkowite a i b i wypisz większą z nich (jeśli są równe — po prostu tę liczbę). Spróbuj bez instrukcji if, korzystając z tego, że w działaniach true to 1, a false to 0.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz większą z liczb a i b.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3 8' }, { input: '-2 -5' }, { input: '4 4' }],
            hint: 'a * (a >= b) to a, gdy a jest większe lub równe b, a w przeciwnym razie 0. Podobnie b * (b > a). Zawsze dokładnie jedno z tych wyrażeń jest „włączone”, więc ich suma to większa liczba.',
            tests: (r) => ['0 0', '1 -1', '-1 1', '1000000000 -1000000000', '-1000000000 -1000000000', '7 7', `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`],
            solve: (inp) => { const [a, b] = nums(inp); return String(Math.max(a, b)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a * (a >= b) + b * (b > a) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-kafelki', krok: K, level: 'trudne',
            title: 'Kafelki w łazience',
            short: 'Dwa razy dzielenie w górę i iloczyn do 10¹⁸ — wszystko na long long.',
            tags: ['dzielenie w górę', 'long long'],
            statement: ['Podłoga w łazience to prostokąt o wymiarach W na H centymetrów. Kafelki są kwadratami o boku a centymetrów i układa się je w równych rzędach. Jeśli ostatni kafelek w rzędzie (albo ostatni rząd) się nie mieści, przycinamy go — ale zużywamy cały kafelek. Ile kafelków trzeba kupić?'],
            input_format: ['W jedynym wierszu trzy liczby całkowite W, H i a.'],
            output_format: ['Wypisz jedną liczbę — liczbę kafelków.'],
            constraints: ['1 ≤ W, H, a ≤ 10⁹'],
            examples: [
                { input: '250 180 50', note: 'W jednym rzędzie mieści się 250 / 50 = 5 kafelków, a rzędów potrzeba 180 / 50 = 3,6 — zaokrąglamy w górę do 4. Razem 5 · 4 = 20.' },
                { input: '1000000000 1000000000 1' },
            ],
            hint: 'W jednym rzędzie potrzeba W / a kafelków zaokrąglone w górę, czyli (W + a − 1) / a; tak samo liczy się rzędy. Uważaj na zakres: W + a − 1 może przekroczyć int, a wynik — iloczyn — sięga 10¹⁸. Wszystko licz na long long.',
            tests: (r) => ['1 1 1', '1 1 1000000000', '1000000000 1000000000 1000000000', '999999999 1000000000 2', '7 7 3', '100 100 10',
                `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1e5)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1000)} ${r.int(1, 1000)} ${r.int(1, 100)}`],
            solve: (inp) => { const [W, H, a] = toks(inp).map(BigInt); return String(((W + a - 1n) / a) * ((H + a - 1n) / a)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long W, H, a;
    cin >> W >> H >> a;
    long long wRzedzie = (W + a - 1) / a;
    long long rzedy = (H + a - 1) / a;
    cout << wRzedzie * rzedy << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-wycieczka', krok: K, level: 'trudne',
            title: 'Wielki finał: wycieczka klasowa',
            short: 'int, char, double i string w jednym programie — podsumowanie dla wychowawcy.',
            tags: ['int', 'char', 'double', 'string', 'dzielenie w górę'],
            statement: [
                'Klasa jedzie na wycieczkę, a Ty piszesz program, który przygotuje krótkie podsumowanie dla wychowawcy. Na wejściu dostajesz: numer klasy i jej literę (np. 7 i b), liczbę uczestników n, cenę wycieczki za osobę (w złotych, z groszami) i nazwisko opiekuna.',
                'Autokar ma 50 miejsc, a uczestników wiezie tyle autokarów, ile trzeba (ostatni nie musi być pełny). Wypisz pięć wierszy dokładnie w takiej postaci jak w przykładzie: Klasa (numer i WIELKA litera), Opiekun, Koszt (n · cena, z dwiema cyframi po kropce), Autokary i Wolne miejsca (ile miejsc w autokarach zostanie pustych).',
            ],
            input_format: ['Pierwszy wiersz: numer klasy (liczba całkowita) i litera klasy (mała litera). Drugi wiersz: liczba uczestników n. Trzeci wiersz: cena za osobę (liczba z dwiema cyframi po kropce). Czwarty wiersz: nazwisko opiekuna (jedno słowo).'],
            output_format: ['Wypisz pięć wierszy — dokładnie tak jak w przykładzie.'],
            constraints: ['1 ≤ numer klasy ≤ 8', '1 ≤ n ≤ 1000', '0.01 ≤ cena ≤ 5000.00', 'nazwisko ma od 1 do 30 liter alfabetu angielskiego i zaczyna się wielką literą', 'testy dobrano tak, żeby zaokrąglenie kosztu było zawsze jednoznaczne'],
            examples: [{ input: '7 b\n27\n149.90\nNowak', note: '27 · 149,90 = 4047,30 zł. 27 osób mieści się w jednym autokarze, a 50 − 27 = 23 miejsca zostają wolne.' }],
            hint: R`Każdą daną wczytaj do odpowiedniego typu: int, char, int, double, string. Wielką literę zrobisz jak w ćwiczeniu z lekcji: (char)(litera - 'a' + 'A'). Autokary to n / 50 zaokrąglone w górę: (n + 49) / 50, a wolne miejsca to autokary · 50 − n. Pamiętaj o spacji po każdym dwukropku.`,
            tests: (r) => {
                const out = ['1 a\n1\n0.01\nX', '8 z\n1000\n5000.00\nKowalski', '4 c\n50\n10.00\nNowak', '5 d\n51\n99.99\nWisniewska'];
                while (out.length < 10) {
                    const n = r.int(1, 1000), c = r.int(1, 500000);
                    if (!safe(n * Number(dec(c, 2)), 2)) continue;
                    out.push(`${r.int(1, 8)} ${r.pick(MALE.split(''))}\n${n}\n${dec(c, 2)}\n${capital(r.word(r.int(1, 30)))}`);
                }
                return out;
            },
            solve: (inp) => {
                const [nr, lit, nStr, cena, nazwisko] = toks(inp);
                const n = Number(nStr);
                const aut = Math.floor((n + 49) / 50);
                return join(`Klasa: ${nr}${lit.toUpperCase()}`, `Opiekun: ${nazwisko}`, `Koszt: ${fx(n * Number(cena), 2)}`, `Autokary: ${aut}`, `Wolne miejsca: ${aut * 50 - n}`);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    int numer, n;
    char litera;
    double cena;
    string opiekun;
    cin >> numer >> litera >> n >> cena >> opiekun;
    int autokary = (n + 49) / 50;
    cout << "Klasa: " << numer << (char)(litera - 'a' + 'A') << "\n";
    cout << "Opiekun: " << opiekun << "\n";
    cout << fixed << setprecision(2) << "Koszt: " << n * cena << "\n";
    cout << "Autokary: " << autokary << "\n";
    cout << "Wolne miejsca: " << autokary * 50 - n << "\n";
    return 0;
}`,
        },
    ];
};
