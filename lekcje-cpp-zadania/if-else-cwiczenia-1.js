// If / Else — ćwiczenia w trakcie lekcji, części 1–4: pierwszy if, if … else, warunki (porównania liczb,
// znaków i napisów), else if. Bez pętli — uczeń zna lekcje o typach zmiennych i o wejściu i wyjściu.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki (zadania.html).
module.exports = (h) => {
    const { nums, toks, lines, join, capital } = h;
    const R = String.raw;
    const z2 = (n) => String(n).padStart(2, '0');
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const WIELKIE = LITERY.toUpperCase();
    const ALNUM = LITERY + WIELKIE + '0123456789';

    return [
        // ================================================================ KROK 1 · pierwszy if
        {
            id: 'ie-mroz', krok: 1, level: 'latwe',
            title: 'Ostrzeżenie przed mrozem',
            short: 'Wypisz temperaturę, a gdy jest poniżej zera — dopisz ostrzeżenie.',
            tags: ['if', 'warunek <'],
            statement: [
                'Wczytaj temperaturę t (liczbę całkowitą). W pierwszym wierszu wypisz Temperatura: t. Jeśli temperatura jest niższa niż 0 stopni, wypisz w drugim wierszu Uwaga: mroz!.',
                'Gdy mrozu nie ma, drugiego wiersza nie wypisuj wcale. Zero stopni to jeszcze nie mróz.',
            ],
            input_format: ['Jedna liczba całkowita t.'],
            output_format: ['Jeden albo dwa wiersze, jak w przykładach.'],
            constraints: ['−50 ≤ t ≤ 50'],
            examples: [{ input: '-3' }, { input: '12' }],
            hint: R`Pierwszy wiersz wypisz zawsze, jeszcze przed if. Potem: if (t < 0) { cout << "Uwaga: mroz!\n"; }. Warunek to t < 0, a nie t <= 0 — przy zerze ostrzeżenia nie ma.`,
            tests: (r) => ['-3', '12', '0', '-1', '1', '-50', '50', String(r.int(-50, -2)), String(r.int(2, 50))],
            solve: (inp) => { const t = nums(inp)[0]; return join(`Temperatura: ${t}`, t < 0 ? ['Uwaga: mroz!'] : []); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << "Temperatura: " << t << "\n";
    if (t < 0) {
        cout << "Uwaga: mroz!\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-bez-minusa', krok: 1, level: 'latwe',
            title: 'Odległość od zera',
            short: 'Wypisz liczbę bez minusa — zmień jej znak instrukcją if.',
            tags: ['if', 'x = -x'],
            statement: [
                'Wczytaj liczbę całkowitą x i wypisz jej odległość od zera na osi liczbowej, czyli wartość bezwzględną: dla liczby ujemnej — tę liczbę bez minusa, a dla pozostałych — tę samą liczbę.',
                'Zrób to instrukcją if, bez gotowej funkcji abs.',
            ],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Jedna liczba — odległość x od zera.'],
            constraints: ['−10⁹ ≤ x ≤ 10⁹'],
            examples: [{ input: '-7' }, { input: '12' }],
            hint: 'if (x < 0) { x = -x; } — a potem wypisz x. Dla liczb nieujemnych if niczego nie zmienia.',
            tests: (r) => ['-7', '12', '0', '-1', '1', '1000000000', '-1000000000', String(r.int(-1e9, -2)), String(r.int(2, 1e9))],
            solve: (inp) => String(Math.abs(nums(inp)[0])),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int x;
    cin >> x;
    if (x < 0) {
        x = -x;
    }
    cout << x << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-darmowa-dostawa', krok: 1, level: 'latwe',
            title: 'Darmowa dostawa',
            short: 'Do zamówień tańszych niż 100 zł dolicz 15 zł za dostawę.',
            tags: ['if', '+='],
            statement: [
                'Sklep internetowy dolicza 15 zł za dostawę, ale tylko do zamówień tańszych niż 100 zł — od 100 zł w górę dostawa jest darmowa.',
                'Wczytaj wartość zamówienia w (w złotych) i wypisz, ile trzeba zapłacić razem z dostawą.',
            ],
            input_format: ['Jedna liczba całkowita w.'],
            output_format: ['Jedna liczba — kwota do zapłaty.'],
            constraints: ['1 ≤ w ≤ 10 000'],
            examples: [{ input: '80' }, { input: '120' }],
            hint: 'Utwórz zmienną razem = w, a potem if (w < 100) { razem += 15; }. Uważaj na granicę: przy dokładnie 100 zł dostawa jest już darmowa.',
            tests: (r) => ['80', '120', '100', '99', '1', '10000', '85', String(r.int(1, 99)), String(r.int(100, 10000))],
            solve: (inp) => { const w = nums(inp)[0]; return String(w < 100 ? w + 15 : w); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int w;
    cin >> w;
    int razem = w;
    if (w < 100) {
        razem += 15;
    }
    cout << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-do-parzystej', krok: 1, level: 'latwe',
            title: 'W górę do parzystej',
            short: 'Jeśli liczba jest nieparzysta, zwiększ ją o 1.',
            tags: ['if', '%', '++'],
            statement: ['Wczytaj nieujemną liczbę całkowitą n. Jeśli n jest nieparzysta, zwiększ ją o 1, a jeśli parzysta — zostaw. Wypisz wynik, czyli najmniejszą liczbę parzystą, która nie jest mniejsza od n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ n ≤ 10⁹'],
            examples: [{ input: '7' }, { input: '10' }],
            hint: 'Liczba jest nieparzysta, gdy reszta z dzielenia przez 2 nie jest zerem: if (n % 2 != 0) { n++; }.',
            tests: (r) => ['7', '10', '0', '1', '999999999', '1000000000', String(2 * r.int(0, 5e8 - 1) + 1), String(2 * r.int(0, 5e8))],
            solve: (inp) => { const n = nums(inp)[0]; return String(n % 2 ? n + 1 : n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n % 2 != 0) {
        n++;
    }
    cout << n << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-autobusy', krok: 1, level: 'srednie',
            title: 'Autobusy na wycieczkę',
            short: 'Ile autobusów trzeba zamówić? Dzielenie z zaokrągleniem w górę.',
            tags: ['if', '/ i %', 'zaokrąglanie w górę'],
            statement: ['Na wycieczkę jedzie n osób, a jeden autobus mieści k osób. Ile autobusów trzeba zamówić, żeby pojechali wszyscy?'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi n i k.'],
            output_format: ['Jedna liczba — liczba autobusów.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '50 12', note: '4 autobusy pomieszczą tylko 48 osób, więc potrzebny jest piąty.' }, { input: '48 12' }],
            hint: 'n / k mówi, ile autobusów zapełni się do końca. Jeśli zostaje reszta (n % k != 0), ktoś się nie zmieścił i potrzebny jest jeszcze jeden autobus — zwiększ wynik o 1.',
            tests: (r) => ['50 12', '48 12', '1 1', '1 1000000000', '1000000000 1', '1000000000 1000000000', '1000000000 999999999', '7 3', '6 3',
                `${r.int(1, 1e9)} ${r.int(1, 1000)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1000)} ${r.int(1, 50)}`],
            solve: (inp) => { const [n, k] = nums(inp); return String((n - n % k) / k + (n % k ? 1 : 0)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int autobusy = n / k;
    if (n % k != 0) {
        autobusy++;
    }
    cout << autobusy << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-glosnosc', krok: 1, level: 'srednie',
            title: 'Pokrętło głośności',
            short: 'Zmień głośność, ale nie wyjdź poza zakres od 0 do 100.',
            tags: ['dwa osobne if', 'zakres'],
            statement: [
                'Głośność w telefonie może wynosić od 0 do 100. Aktualna głośność to g. Użytkownik zmienia ją o z: dodatnie z to podgłośnienie, a ujemne — ściszenie.',
                'Gdy wynik wyszedłby powyżej 100, głośność zatrzymuje się na 100, a gdy poniżej 0 — na 0. Wypisz nową głośność.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi g i z.'],
            output_format: ['Jedna liczba — nowa głośność.'],
            constraints: ['0 ≤ g ≤ 100', '−200 ≤ z ≤ 200'],
            examples: [{ input: '70 20' }, { input: '70 45' }, { input: '10 -30' }],
            hint: 'Policz nowa = g + z. Potem dwa osobne if-y: if (nowa > 100) { nowa = 100; } oraz if (nowa < 0) { nowa = 0; }. Oba mogą stać jeden po drugim, bo nigdy nie zadziałają naraz.',
            tests: (r) => ['70 20', '70 45', '10 -30', '0 0', '100 0', '100 200', '0 -200', '50 50', '50 -50', '50 51', '50 -51',
                `${r.int(0, 100)} ${r.int(-200, 200)}`, `${r.int(0, 100)} ${r.int(-200, 200)}`, `${r.int(0, 100)} ${r.int(-20, 20)}`],
            solve: (inp) => { const [g, z] = nums(inp); return String(Math.min(100, Math.max(0, g + z))); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int g, z;
    cin >> g >> z;
    int nowa = g + z;
    if (nowa > 100) {
        nowa = 100;
    }
    if (nowa < 0) {
        nowa = 0;
    }
    cout << nowa << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-bagaz', krok: 1, level: 'srednie',
            title: 'Kontrola bagażu',
            short: 'Za ciężki? Za duży? Wypisz ostrzeżenia i dopłatę.',
            tags: ['kilka if', 'licznik dopłaty'],
            statement: [
                'Na lotnisku bagaż podręczny może ważyć najwyżej 8 kg, a suma jego wymiarów może wynosić najwyżej 115 cm. Za przekroczenie wagi płaci się 100 zł, a za przekroczenie wymiarów — 80 zł. Gdy przekroczone jest jedno i drugie, płaci się obie kwoty.',
                'Wczytaj wagę w (w kg) i sumę wymiarów s (w cm). Jeśli waga jest przekroczona, wypisz wiersz Za ciezki. Jeśli wymiary są przekroczone, wypisz wiersz Za duzy. Na końcu zawsze wypisz Doplata: X zl, gdzie X to suma opłat.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi w i s.'],
            output_format: ['Od jednego do trzech wierszy, jak w przykładach.'],
            constraints: ['1 ≤ w ≤ 50', '20 ≤ s ≤ 300'],
            examples: [{ input: '10 120' }, { input: '7 100' }],
            hint: R`Utwórz doplata = 0. Potem dwa osobne if-y, bo oba przypadki mogą zajść naraz: if (w > 8) { cout << "Za ciezki\n"; doplata += 100; } i podobnie dla s > 115. Ostatni wiersz wypisz już poza if-ami.`,
            tests: (r) => ['10 120', '7 100', '8 115', '9 115', '8 116', '50 300', '1 20', '9 100', '5 200',
                `${r.int(1, 50)} ${r.int(20, 300)}`, `${r.int(1, 50)} ${r.int(20, 300)}`, `${r.int(1, 8)} ${r.int(20, 115)}`],
            solve: (inp) => {
                const [w, s] = nums(inp);
                const out = [];
                let d = 0;
                if (w > 8) { out.push('Za ciezki'); d += 100; }
                if (s > 115) { out.push('Za duzy'); d += 80; }
                return join(out, `Doplata: ${d} zl`);
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int w, s;
    cin >> w >> s;
    int doplata = 0;
    if (w > 8) {
        cout << "Za ciezki\n";
        doplata += 100;
    }
    if (s > 115) {
        cout << "Za duzy\n";
        doplata += 80;
    }
    cout << "Doplata: " << doplata << " zl\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · if … else
        {
            id: 'ie-parzysta-nieparzysta', krok: 2, level: 'latwe',
            title: 'Parzysta czy nieparzysta?',
            short: 'Wypisz PARZYSTA albo NIEPARZYSTA — także dla liczb ujemnych.',
            tags: ['if … else', '%'],
            statement: ['Wczytaj liczbę całkowitą n i wypisz PARZYSTA, jeśli jest parzysta, albo NIEPARZYSTA w przeciwnym razie. Uwaga: liczba może być ujemna.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedno słowo: PARZYSTA albo NIEPARZYSTA.'],
            constraints: ['−10⁹ ≤ n ≤ 10⁹'],
            examples: [{ input: '14' }, { input: '-7', note: 'W C++ −7 % 2 to −1, a nie 1.' }],
            hint: 'if (n % 2 == 0) … else …. Nie sprawdzaj n % 2 == 1 — dla ujemnych liczb nieparzystych reszta wynosi −1 i taki warunek byłby fałszywy.',
            tests: (r) => ['14', '-7', '0', '-1', '1', '-2', '1000000000', '-1000000000', '-999999999', '999999999',
                String(2 * r.int(-5e8, 5e8 - 1) + 1), String(2 * r.int(-5e8, 5e8))],
            solve: (inp) => (nums(inp)[0] % 2 === 0 ? 'PARZYSTA' : 'NIEPARZYSTA'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << "PARZYSTA\n";
    } else {
        cout << "NIEPARZYSTA\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-kolejka-gorska', krok: 2, level: 'latwe',
            title: 'Kolejka górska',
            short: 'Co najmniej 140 cm — wsiadaj. Mniej — ile brakuje?',
            tags: ['if … else', 'granica >='],
            statement: ['Do kolejki górskiej wpuszczane są osoby, które mają co najmniej 140 cm wzrostu. Wczytaj wzrost w (w cm). Jeśli osoba może wsiąść, wypisz Wsiadaj!. W przeciwnym razie wypisz Za niski o X cm, gdzie X to brakujące centymetry.'],
            input_format: ['Jedna liczba całkowita w.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['50 ≤ w ≤ 250'],
            examples: [{ input: '152' }, { input: '131' }],
            hint: R`if (w >= 140) { cout << "Wsiadaj!\n"; } else { cout << "Za niski o " << 140 - w << " cm\n"; }. Sprawdź granicę: przy dokładnie 140 cm można wsiąść.`,
            tests: (r) => ['152', '131', '140', '139', '50', '250', '141', String(r.int(50, 139)), String(r.int(140, 250))],
            solve: (inp) => { const w = nums(inp)[0]; return w >= 140 ? 'Wsiadaj!' : `Za niski o ${140 - w} cm`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int w;
    cin >> w;
    if (w >= 140) {
        cout << "Wsiadaj!\n";
    } else {
        cout << "Za niski o " << 140 - w << " cm\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-wieksza-z-dwoch', krok: 2, level: 'latwe',
            title: 'Większa z dwóch',
            short: 'Wypisz większą z dwóch liczb — tym razem instrukcją if.',
            tags: ['if … else', 'porównanie'],
            statement: ['Wczytaj dwie liczby całkowite i wypisz większą z nich. Jeśli są równe, wypisz tę liczbę.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '8 3' }, { input: '-4 9' }],
            hint: 'if (a > b) wypisz a, a w przeciwnym razie wypisz b. Gdy liczby są równe, wykona się else i wypisze b — czyli właśnie tę liczbę.',
            tests: (r) => ['8 3', '-4 9', '5 5', '-1 -2', '0 0', '-1000000000 1000000000', '1000000000 -1000000000',
                `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-100, 100)} ${r.int(-100, 100)}`],
            solve: (inp) => String(Math.max(...nums(inp))),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a > b) {
        cout << a << "\n";
    } else {
        cout << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-czy-dzieli', krok: 2, level: 'latwe',
            title: 'Czy się dzieli?',
            short: 'TAK, jeśli a dzieli się przez b bez reszty — inaczej NIE.',
            tags: ['if … else', '%', 'TAK/NIE'],
            statement: ['Wczytaj liczby całkowite a i b. Wypisz TAK, jeśli a dzieli się przez b bez reszty, albo NIE w przeciwnym razie.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['−10⁹ ≤ a ≤ 10⁹', '1 ≤ b ≤ 10⁹'],
            examples: [{ input: '12 4' }, { input: '13 4' }],
            hint: 'a dzieli się przez b, gdy reszta z dzielenia wynosi zero: if (a % b == 0). Działa to także dla ujemnych a — na przykład −12 % 4 to 0.',
            tests: (r) => ['12 4', '13 4', '-12 4', '-13 4', '0 7', '7 7', '7 1', '1 7', '1000000000 1000000000', '999999999 3', '1000000000 3',
                (() => { const b = r.int(1, 1000); return `${b * r.int(-1e6, 1e6)} ${b}`; })(), `${r.int(-1e9, 1e9)} ${r.int(1, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(2, 30)}`],
            solve: (inp) => { const [a, b] = nums(inp); return a % b === 0 ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a % b == 0) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-zeszyty', krok: 2, level: 'srednie',
            title: 'Wystarczy na zakupy?',
            short: 'n zeszytów po c zł, w portfelu p zł — reszta czy brakująca kwota?',
            tags: ['if … else', 'kilka instrukcji w gałęzi'],
            statement: [
                'Chcesz kupić n jednakowych zeszytów po c zł każdy, a w portfelu masz p zł.',
                'Jeśli pieniędzy wystarczy, wypisz TAK, a w drugim wierszu — ile zostanie reszty. Jeśli nie wystarczy, wypisz NIE, a w drugim wierszu — ile brakuje.',
            ],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi n, c i p.'],
            output_format: ['Dwa wiersze: TAK albo NIE oraz liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ c ≤ 1000', '0 ≤ p ≤ 10⁶'],
            examples: [{ input: '3 12 50' }, { input: '5 12 50' }],
            hint: 'Najpierw policz koszt = n * c. Potem if (p >= koszt) { TAK i p - koszt } else { NIE i koszt - p }. Gdy pieniędzy jest dokładnie tyle, ile trzeba, wypisz TAK i 0.',
            tests: (r) => ['3 12 50', '5 12 50', '4 12 48', '1 1 0', '1000 1000 1000000', '1000 1000 0', '1 1000 999',
                `${r.int(1, 1000)} ${r.int(1, 1000)} ${r.int(0, 1e6)}`, `${r.int(1, 100)} ${r.int(1, 100)} ${r.int(0, 10000)}`, `${r.int(1, 20)} ${r.int(1, 50)} ${r.int(0, 500)}`],
            solve: (inp) => { const [n, c, p] = nums(inp); const k = n * c; return p >= k ? join('TAK', String(p - k)) : join('NIE', String(k - p)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, c, p;
    cin >> n >> c >> p;
    int koszt = n * c;
    if (p >= koszt) {
        cout << "TAK\n";
        cout << p - koszt << "\n";
    } else {
        cout << "NIE\n";
        cout << koszt - p << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-na-czas', krok: 2, level: 'srednie',
            title: 'Zdążysz na lekcję?',
            short: 'Wychodzisz o HH:MM, droga trwa t minut. Na czas czy spóźnienie?',
            tags: ['if … else', 'char jako separator', 'minuty od północy'],
            statement: [
                'Lekcje zaczynają się o 8:00. Wychodzisz z domu o godzinie HH:MM, a droga do szkoły trwa t minut.',
                'Jeśli dotrzesz najpóźniej o 8:00, wypisz Na czas, zapas X min, gdzie X to liczba minut, o którą jesteś przed 8:00 (może to być 0). W przeciwnym razie wypisz Spoznienie X min.',
            ],
            input_format: ['Jeden wiersz: godzina wyjścia w formacie HH:MM i liczba całkowita t, oddzielone spacją.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['06:00 ≤ HH:MM ≤ 08:59', '1 ≤ t ≤ 120'],
            examples: [{ input: '07:35 20' }, { input: '07:50 25' }],
            hint: 'Wczytaj godzinę jak w lekcji Input / Output: cin >> h >> dwukropek >> m >> t;. Zamień wszystko na minuty od północy: przyjazd = h * 60 + m + t, a 8:00 to 480 minut. Na czas jesteś, gdy przyjazd <= 480.',
            tests: (r) => {
                const g = () => { const x = r.int(360, 539); return `${z2(Math.floor(x / 60))}:${z2(x % 60)}`; };
                return ['07:35 20', '07:50 25', '07:40 20', '07:40 21', '06:00 1', '08:59 120', '06:00 120', '08:00 1', '07:59 1',
                    `${g()} ${r.int(1, 120)}`, `${g()} ${r.int(1, 120)}`, `${g()} ${r.int(1, 30)}`];
            },
            solve: (inp) => {
                const m = inp.match(/(\d+):(\d+)\s+(\d+)/);
                const p = Number(m[1]) * 60 + Number(m[2]) + Number(m[3]);
                return p <= 480 ? `Na czas, zapas ${480 - p} min` : `Spoznienie ${p - 480} min`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h, m, t;
    char dwukropek;
    cin >> h >> dwukropek >> m >> t;
    int przyjazd = h * 60 + m + t;
    if (przyjazd <= 480) {
        cout << "Na czas, zapas " << 480 - przyjazd << " min\n";
    } else {
        cout << "Spoznienie " << przyjazd - 480 << " min\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-fotoradar', krok: 2, level: 'srednie',
            title: 'Fotoradar',
            short: 'Ograniczenie L, prędkość v — bez mandatu czy 10 zł za każdy km/h?',
            tags: ['if … else', 'obliczenia w gałęzi'],
            statement: [
                'Na drodze obowiązuje ograniczenie prędkości do L km/h. Fotoradar zmierzył samochód jadący z prędkością v km/h.',
                'Jeśli v nie przekracza ograniczenia, wypisz Bez mandatu. W przeciwnym razie wypisz Mandat: X zl, gdzie X to 10 zł za każdy km/h ponad ograniczenie.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi L i v.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['20 ≤ L ≤ 140', '1 ≤ v ≤ 300'],
            examples: [{ input: '50 47' }, { input: '50 73' }],
            hint: 'Za szybko jedziesz, gdy v > L. Wtedy mandat to (v - L) * 10. Przy v == L mandatu nie ma.',
            tests: (r) => ['50 47', '50 73', '50 50', '50 51', '140 300', '20 1', '20 300', `${r.int(20, 140)} ${r.int(1, 300)}`, `${r.int(20, 140)} ${r.int(1, 300)}`, `${r.int(20, 140)} ${r.int(1, 300)}`],
            solve: (inp) => { const [L, v] = nums(inp); return v > L ? `Mandat: ${(v - L) * 10} zl` : 'Bez mandatu'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int L, v;
    cin >> L >> v;
    if (v > L) {
        cout << "Mandat: " << (v - L) * 10 << " zl\n";
    } else {
        cout << "Bez mandatu\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 3 · warunki
        {
            id: 'ie-sprawdz-dodawanie', krok: 3, level: 'latwe',
            title: 'Sprawdź dodawanie',
            short: 'Uczeń policzył a + b = c. Dobrze czy źle?',
            tags: ['==', 'działanie w warunku'],
            statement: ['Uczeń policzył w zeszycie a + b i otrzymał c. Sprawdź, czy się nie pomylił: wypisz DOBRZE, jeśli a + b jest równe c, albo ZLE w przeciwnym razie.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi a, b i c.'],
            output_format: ['Jedno słowo: DOBRZE albo ZLE.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹', '−2·10⁹ ≤ c ≤ 2·10⁹'],
            examples: [{ input: '17 25 42' }, { input: '17 25 32' }],
            hint: 'if (a + b == c) — komputer najpierw policzy sumę, a dopiero potem ją porówna. Pamiętaj o podwójnym znaku ==.',
            tests: (r) => {
                const ok = () => { const a = r.int(-1e9, 1e9), b = r.int(-1e9, 1e9); return `${a} ${b} ${a + b}`; };
                const zle = () => { const a = r.int(-1e9, 1e9), b = r.int(-1e9, 1e9); return `${a} ${b} ${a + b + r.pick([-1, 1, 10, -100])}`; };
                return ['17 25 42', '17 25 32', '0 0 0', '-5 5 0', '-5 5 10', '1000000000 1000000000 2000000000', '-1000000000 -1000000000 -2000000000', '2 2 5', ok(), ok(), zle(), zle()];
            },
            solve: (inp) => { const [a, b, c] = nums(inp); return a + b === c ? 'DOBRZE' : 'ZLE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a + b == c) {
        cout << "DOBRZE\n";
    } else {
        cout << "ZLE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-ta-sama-cyfra', krok: 3, level: 'latwe',
            title: 'Ta sama ostatnia cyfra',
            short: 'Czy dwie liczby kończą się tą samą cyfrą?',
            tags: ['%', '=='],
            statement: ['Wczytaj dwie nieujemne liczby całkowite a i b. Wypisz TAK, jeśli kończą się tą samą cyfrą, albo NIE w przeciwnym razie.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['0 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '127 57' }, { input: '40 14' }],
            hint: 'Ostatnia cyfra liczby to reszta z dzielenia przez 10. Porównaj reszty: if (a % 10 == b % 10).',
            tests: (r) => {
                const same = () => { const a = r.int(0, 1e9); const b = r.int(0, 1e8) * 10 + (a % 10); return `${a} ${b}`; };
                return ['127 57', '40 14', '0 10', '5 5', '0 0', '1000000000 0', '9 19', '1 2', same(), same(), `${r.int(0, 1e9)} ${r.int(0, 1e9)}`, `${r.int(0, 1e9)} ${r.int(0, 1e9)}`];
            },
            solve: (inp) => { const [a, b] = nums(inp); return a % 10 === b % 10 ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a % 10 == b % 10) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-wielka-czy-mala', krok: 3, level: 'latwe',
            title: 'Wielka czy mała?',
            short: 'Jedna litera — wypisz, czy jest wielka, czy mała.',
            tags: ['char', 'kody ASCII'],
            statement: ['Wczytaj jedną literę alfabetu angielskiego. Wypisz wielka, jeśli to wielka litera, albo mala, jeśli mała.'],
            input_format: ['Jedna litera.'],
            output_format: ['Jedno słowo: wielka albo mala.'],
            constraints: ['na wejściu jest litera od a do z albo od A do Z'],
            examples: [{ input: 'q' }, { input: 'Q' }],
            hint: R`Wszystkie małe litery mają kody ASCII co najmniej 'a' (97), a wielkie — najwyżej 'Z' (90). Wystarczy jedno porównanie: if (c >= 'a'). Znak piszesz w apostrofach.`,
            tests: (r) => ['q', 'Q', 'a', 'z', 'A', 'Z', 'm', 'M', r.pick(LITERY), r.pick(WIELKIE), r.pick(LITERY), r.pick(WIELKIE)],
            solve: (inp) => (inp.trim() >= 'a' ? 'mala' : 'wielka'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    if (c >= 'a') {
        cout << "mala\n";
    } else {
        cout << "wielka\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-sprawdz-haslo', krok: 3, level: 'latwe',
            title: 'Sprawdzenie hasła',
            short: 'Prawdziwe hasło i wpisane hasło — czy są identyczne?',
            tags: ['string', '=='],
            statement: [
                'W pierwszym wierszu wejścia jest prawdziwe hasło, a w drugim — hasło wpisane przez użytkownika. Oba są pojedynczymi słowami.',
                'Wypisz Dostep przyznany, jeśli hasła są identyczne (co do każdego znaku, także wielkości liter), albo Odmowa dostepu w przeciwnym razie.',
            ],
            input_format: ['Dwa wiersze, w każdym jedno słowo złożone z liter i cyfr.'],
            output_format: ['Jeden wiersz: Dostep przyznany albo Odmowa dostepu.'],
            constraints: ['każde hasło ma od 1 do 30 znaków'],
            examples: [{ input: 'bajtek123\nbajtek123' }, { input: 'Kot2026\nkot2026', note: 'Wielkie i małe litery to różne znaki.' }],
            hint: 'Wczytaj oba słowa do zmiennych typu string i porównaj je przez ==. Dla napisów == sprawdza każdy znak i odróżnia wielkie litery od małych.',
            tests: (r) => {
                const w = () => Array.from({ length: r.int(1, 30) }, () => r.pick(ALNUM)).join('');
                const a = w(), b = w();
                return ['bajtek123\nbajtek123', 'Kot2026\nkot2026', 'abc\nabcd', 'abcd\nabc', 'x\nx', 'x\ny', `${a}\n${a}`, `${b}\n${b}`, `${a}\n${b}`,
                    `${a}\n${a.slice(0, -1) + (a.slice(-1) === '7' ? '8' : '7')}`];
            },
            solve: (inp) => { const [a, b] = toks(inp); return a === b ? 'Dostep przyznany' : 'Odmowa dostepu'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string haslo, wpisane;
    cin >> haslo >> wpisane;
    if (haslo == wpisane) {
        cout << "Dostep przyznany\n";
    } else {
        cout << "Odmowa dostepu\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-alfabetycznie', krok: 3, level: 'srednie',
            title: 'W kolejności alfabetycznej',
            short: 'Dwa słowa — wypisz je w kolejności ze słownika.',
            tags: ['string', '<'],
            statement: ['Wczytaj dwa słowa złożone z małych liter i wypisz je w jednym wierszu, w kolejności alfabetycznej (takiej jak w słowniku), oddzielone spacją. Jeśli słowa są takie same, wypisz je oba.'],
            input_format: ['Jeden wiersz z dwoma słowami.'],
            output_format: ['Jeden wiersz z dwoma słowami w kolejności alfabetycznej.'],
            constraints: ['każde słowo ma od 1 do 20 małych liter alfabetu angielskiego'],
            examples: [{ input: 'ola ala' }, { input: 'kotek kot', note: 'Gdy jedno słowo jest początkiem drugiego, krótsze jest wcześniej.' }],
            hint: 'Dla napisów a < b znaczy „a jest wcześniej w słowniku”. if (a < b) wypisz a i b, a w przeciwnym razie b i a.',
            tests: (r) => {
                const w = () => r.word(r.int(1, 20));
                const p = r.word(r.int(1, 8));
                return ['ola ala', 'kotek kot', 'kot kotek', 'kot koc', 'ala ala', 'a b', 'b a', 'zebra zebry', `${p + r.word(3)} ${p}`, `${w()} ${w()}`, `${w()} ${w()}`, `${w()} ${w()}`];
            },
            solve: (inp) => { const [a, b] = toks(inp); return a < b ? `${a} ${b}` : `${b} ${a}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    if (a < b) {
        cout << a << " " << b << "\n";
    } else {
        cout << b << " " << a << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-swiadectwo', krok: 3, level: 'srednie',
            title: 'Świadectwo z paskiem',
            short: 'Średnia co najmniej 4.75? Uważaj na dzielenie całkowite.',
            tags: ['średnia', 'pułapka int / int', 'mnożenie zamiast dzielenia'],
            statement: [
                'Uczeń dostaje świadectwo z paskiem, gdy średnia jego ocen wynosi co najmniej 4.75.',
                'Wczytaj liczbę przedmiotów n i sumę wszystkich ocen s. Wypisz Z PASKIEM albo BEZ PASKA.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi n i s.'],
            output_format: ['Jeden wiersz: Z PASKIEM albo BEZ PASKA.'],
            constraints: ['1 ≤ n ≤ 20', 'n ≤ s ≤ 6n'],
            examples: [{ input: '12 57', note: '57 / 12 to dokładnie 4.75 — pasek jest.' }, { input: '12 56' }],
            hint: 'Średnia to s / n — ale gdy obie liczby są typu int, to dzielenie całkowite i 57 / 12 da 4! Licz na double: (double)s / n >= 4.75 albo — bez ułamków — pomnóż obie strony przez 4n: 4 * s >= 19 * n.',
            tests: (r) => {
                const g = () => { const n = r.int(1, 20); return `${n} ${r.int(n, 6 * n)}`; };
                const blisko = () => { const n = r.int(1, 20); const s = Math.min(6 * n, Math.max(n, Math.ceil(19 * n / 4) + r.int(-1, 1))); return `${n} ${s}`; };
                return ['12 57', '12 56', '4 19', '4 18', '20 95', '20 94', '1 5', '1 4', '1 6', '20 120', '20 20', '3 15', '3 14', g(), blisko(), blisko()];
            },
            solve: (inp) => { const [n, s] = nums(inp); return 4 * s >= 19 * n ? 'Z PASKIEM' : 'BEZ PASKA'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, s;
    cin >> n >> s;
    if (4 * s >= 19 * n) {
        cout << "Z PASKIEM\n";
    } else {
        cout << "BEZ PASKA\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-wiekszy-ulamek', krok: 3, level: 'srednie',
            title: 'Który ułamek większy?',
            short: 'Dwa ułamki a/b i c/d — porównaj je bez dzielenia, na krzyż.',
            tags: ['char jako separator', 'mnożenie na krzyż', 'long long'],
            statement: [
                'Na wejściu są dwa ułamki zapisane jako a/b i c/d (z ukośnikiem), oddzielone spacją. Liczniki i mianowniki są dodatnie, a ułamki — różne.',
                'Wypisz większy z ułamków w takiej samej postaci, w jakiej stał na wejściu.',
            ],
            input_format: ['Jeden wiersz: dwa ułamki w postaci a/b oddzielone spacją.'],
            output_format: ['Większy ułamek w postaci a/b.'],
            constraints: ['1 ≤ a, b, c, d ≤ 10⁵', 'ułamki nie są równe'],
            examples: [{ input: '3/4 2/3' }, { input: '5/8 7/10' }],
            hint: 'Wczytaj ułamki jak w lekcji Input / Output: cin >> a >> kreska >> b >> c >> kreska >> d;. Zamiast dzielić (double bywa niedokładny), porównaj iloczyny na krzyż: a/b > c/d dokładnie wtedy, gdy a * d > c * b. Iloczyny sięgają 10¹⁰, więc użyj long long.',
            check: (inp) => { const m = inp.match(/(\d+)\/(\d+) (\d+)\/(\d+)/); return BigInt(m[1]) * BigInt(m[4]) === BigInt(m[3]) * BigInt(m[2]) ? 'równe ułamki' : null; },
            tests: (r) => {
                const out = ['3/4 2/3', '5/8 7/10', '100000/1 99999/1', '1/100000 1/99999', '99999/100000 99998/99999', '1/2 1/3', '1/3 1/2', '7/1 50/7'];
                while (out.length < 13) {
                    const t = [r.int(1, 1e5), r.int(1, 1e5), r.int(1, 1e5), r.int(1, 1e5)];
                    if (BigInt(t[0]) * BigInt(t[3]) !== BigInt(t[2]) * BigInt(t[1])) out.push(`${t[0]}/${t[1]} ${t[2]}/${t[3]}`);
                }
                return out;
            },
            solve: (inp) => {
                const m = inp.match(/(\d+)\/(\d+) (\d+)\/(\d+)/);
                const [a, b, c, d] = m.slice(1).map(BigInt);
                return a * d > c * b ? `${a}/${b}` : `${c}/${d}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, c, d;
    char kreska;
    cin >> a >> kreska >> b >> c >> kreska >> d;
    if (a * d > c * b) {
        cout << a << "/" << b << "\n";
    } else {
        cout << c << "/" << d << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 4 · else if
        {
            id: 'ie-dodatnia-ujemna-zero', krok: 4, level: 'latwe',
            title: 'Dodatnia, ujemna czy zero?',
            short: 'Trzy przypadki: DODATNIA, UJEMNA albo ZERO.',
            tags: ['else if', 'trzy przypadki'],
            statement: ['Wczytaj liczbę całkowitą i wypisz DODATNIA, jeśli jest większa od zera, UJEMNA, jeśli jest mniejsza od zera, albo ZERO.'],
            input_format: ['Jedna liczba całkowita.'],
            output_format: ['Jedno słowo: DODATNIA, UJEMNA albo ZERO.'],
            constraints: ['liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '5' }, { input: '-3' }, { input: '0' }],
            hint: 'Trzy przypadki to if, else if i else: if (n > 0) … else if (n < 0) … else …. Do else trafi tylko zero.',
            tests: (r) => ['5', '-3', '0', '1', '-1', '1000000000', '-1000000000', String(r.int(1, 1e9)), String(r.int(-1e9, -1))],
            solve: (inp) => { const n = nums(inp)[0]; return n > 0 ? 'DODATNIA' : n < 0 ? 'UJEMNA' : 'ZERO'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "DODATNIA\n";
    } else if (n < 0) {
        cout << "UJEMNA\n";
    } else {
        cout << "ZERO\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-porownaj', krok: 4, level: 'latwe',
            title: 'Porównaj dwie liczby',
            short: 'Wypisz a < b, a > b albo a = b — z prawdziwymi liczbami.',
            tags: ['else if', 'wypisywanie z tekstem'],
            statement: ['Wczytaj liczby całkowite a i b. Wypisz jeden wiersz: a < b, a > b albo a = b — z liczbami w miejscu liter i ze spacjami wokół znaku (zobacz przykłady).'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3 7' }, { input: '10 -2' }, { input: '5 5' }],
            hint: R`Trzy przypadki — if, else if, else. W każdej gałęzi wypisz liczby i znak, np. cout << a << " < " << b << "\n";.`,
            tests: (r) => ['3 7', '10 -2', '5 5', '0 0', '-1 1', '1 -1', '-1000000000 -1000000000', `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`, `${r.int(-5, 5)} ${r.int(-5, 5)}`],
            solve: (inp) => { const [a, b] = nums(inp); return `${a} ${a < b ? '<' : a > b ? '>' : '='} ${b}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a < b) {
        cout << a << " < " << b << "\n";
    } else if (a > b) {
        cout << a << " > " << b << "\n";
    } else {
        cout << a << " = " << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-ocena-z-punktow', krok: 4, level: 'latwe',
            title: 'Ocena z klasówki',
            short: 'Zamień punkty (0–100) na ocenę od 1 do 6 według skali.',
            tags: ['else if', 'progi', 'granice przedziałów'],
            statement: [
                'Zamień liczbę punktów z klasówki (od 0 do 100) na ocenę według skali:',
                '0–29 → 1, 30–49 → 2, 50–69 → 3, 70–84 → 4, 85–96 → 5, 97–100 → 6.',
                'Wypisz samą ocenę.',
            ],
            input_format: ['Jedna liczba całkowita p — liczba punktów.'],
            output_format: ['Jedna liczba — ocena.'],
            constraints: ['0 ≤ p ≤ 100'],
            examples: [{ input: '88' }, { input: '30' }],
            hint: 'Łańcuch else if od najwyższego progu: if (p >= 97) 6, else if (p >= 85) 5, else if (p >= 70) 4… Sprawdź program na granicach: 97 i 96, 85 i 84, 70 i 69, 50 i 49, 30 i 29.',
            tests: (r) => ['88', '30', '0', '29', '49', '50', '69', '70', '84', '85', '96', '97', '100', String(r.int(0, 100))],
            solve: (inp) => { const p = nums(inp)[0]; return String(p >= 97 ? 6 : p >= 85 ? 5 : p >= 70 ? 4 : p >= 50 ? 3 : p >= 30 ? 2 : 1); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int p;
    cin >> p;
    if (p >= 97) {
        cout << 6 << "\n";
    } else if (p >= 85) {
        cout << 5 << "\n";
    } else if (p >= 70) {
        cout << 4 << "\n";
    } else if (p >= 50) {
        cout << 3 << "\n";
    } else if (p >= 30) {
        cout << 2 << "\n";
    } else {
        cout << 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-pora-dnia', krok: 4, level: 'srednie',
            title: 'Pora dnia',
            short: 'Godzina 0–23 → noc, rano, popoludnie albo wieczor.',
            tags: ['else if', 'dwa przedziały na jedną odpowiedź'],
            statement: ['Wczytaj pełną godzinę g (od 0 do 23) i wypisz porę dnia: noc dla godzin 0–5 oraz 22–23, rano dla 6–11, popoludnie dla 12–17 i wieczor dla 18–21.'],
            input_format: ['Jedna liczba całkowita g.'],
            output_format: ['Jedno słowo: noc, rano, popoludnie albo wieczor.'],
            constraints: ['0 ≤ g ≤ 23'],
            examples: [{ input: '7' }, { input: '23' }],
            hint: 'Noc występuje w dwóch kawałkach doby, ale łańcuch else if sobie z tym poradzi: if (g < 6) noc; else if (g < 12) rano; else if (g < 18) popoludnie; else if (g < 22) wieczor; else noc.',
            tests: () => ['7', '23', ...Array.from({ length: 24 }, (_, i) => String(i))],
            solve: (inp) => { const g = nums(inp)[0]; return g < 6 ? 'noc' : g < 12 ? 'rano' : g < 18 ? 'popoludnie' : g < 22 ? 'wieczor' : 'noc'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int g;
    cin >> g;
    if (g < 6) {
        cout << "noc\n";
    } else if (g < 12) {
        cout << "rano\n";
    } else if (g < 18) {
        cout << "popoludnie\n";
    } else if (g < 22) {
        cout << "wieczor\n";
    } else {
        cout << "noc\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-fizzbuzz', krok: 4, level: 'srednie',
            title: 'FizzBuzz',
            short: 'Przez 3 — Fizz, przez 5 — Buzz, przez oba — FizzBuzz.',
            tags: ['else if', 'kolejność warunków', '%'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n. Jeśli dzieli się i przez 3, i przez 5, wypisz FizzBuzz. Jeśli dzieli się tylko przez 3 — Fizz, a jeśli tylko przez 5 — Buzz. W pozostałych przypadkach wypisz samą liczbę n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedno słowo albo liczba.'],
            constraints: ['1 ≤ n ≤ 10⁹'],
            examples: [{ input: '9' }, { input: '15' }, { input: '7' }],
            hint: 'Kolejność ma znaczenie! Najpierw sprawdź, czy n dzieli się przez 15 (czyli przez 3 i przez 5 naraz). Gdybyś zaczął od n % 3 == 0, liczba 15 wpadłaby do Fizz i program nie dotarłby do FizzBuzz.',
            tests: (r) => ['9', '15', '7', '10', '30', '1', '3', '5', '1000000000', '999999990', String(15 * r.int(1, 6e7)), String(3 * r.int(1, 3e8)), String(5 * r.int(1, 2e8)), String(r.int(1, 1e9))],
            solve: (inp) => { const n = nums(inp)[0]; return n % 15 === 0 ? 'FizzBuzz' : n % 3 === 0 ? 'Fizz' : n % 5 === 0 ? 'Buzz' : String(n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n % 15 == 0) {
        cout << "FizzBuzz\n";
    } else if (n % 3 == 0) {
        cout << "Fizz\n";
    } else if (n % 5 == 0) {
        cout << "Buzz\n";
    } else {
        cout << n << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-taksowka', krok: 4, level: 'srednie',
            title: 'Taksówka',
            short: 'Cennik w trzech progach: 10 zł za start, 3 zł/km, a od 20 km — 2 zł/km.',
            tags: ['else if', 'wzór w każdej gałęzi'],
            statement: [
                'Kurs taksówką kosztuje 10 zł za pierwsze 3 km — nawet wtedy, gdy przejazd jest krótszy. Każdy kolejny kilometr aż do 20. kilometru kosztuje 3 zł, a każdy kilometr powyżej 20 km — 2 zł.',
                'Wczytaj długość trasy d (w pełnych kilometrach) i wypisz cenę kursu w złotych.',
            ],
            input_format: ['Jedna liczba całkowita d.'],
            output_format: ['Jedna liczba — cena kursu.'],
            constraints: ['1 ≤ d ≤ 1000'],
            examples: [{ input: '2' }, { input: '8', note: '10 zł + 5 km po 3 zł = 25 zł.' }, { input: '30', note: '10 zł + 17 km po 3 zł + 10 km po 2 zł = 81 zł.' }],
            hint: 'Trzy przypadki: d <= 3, d <= 20 i pozostałe. W drugim płacisz 10 + 3 * (d - 3), a w trzecim 10 + 3 * 17 + 2 * (d - 20).',
            tests: (r) => ['2', '8', '30', '1', '3', '4', '20', '21', '1000', String(r.int(4, 20)), String(r.int(21, 1000))],
            solve: (inp) => { const d = nums(inp)[0]; return String(d <= 3 ? 10 : d <= 20 ? 10 + 3 * (d - 3) : 10 + 3 * 17 + 2 * (d - 20)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d;
    cin >> d;
    int cena;
    if (d <= 3) {
        cena = 10;
    } else if (d <= 20) {
        cena = 10 + 3 * (d - 3);
    } else {
        cena = 10 + 3 * 17 + 2 * (d - 20);
    }
    cout << cena << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-wynik-meczu', krok: 4, level: 'srednie',
            title: 'Wynik meczu',
            short: 'Wynik a:b — wygrana, remis czy porażka gospodarzy i ile punktów?',
            tags: ['else if', 'char jako separator'],
            statement: ['Wynik meczu piłkarskiego zapisano jako a:b, gdzie a to gole gospodarzy, a b — gole gości. Wypisz z punktu widzenia gospodarzy WYGRANA 3, REMIS 1 albo PORAZKA 0 (słowo i liczbę zdobytych punktów).'],
            input_format: ['Jeden wiersz: wynik w postaci a:b.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['0 ≤ a, b ≤ 20'],
            examples: [{ input: '3:1' }, { input: '2:2' }, { input: '0:4' }],
            hint: 'Wczytaj wynik z dwukropkiem: cin >> a >> dwukropek >> b;. Potem trzy przypadki: a > b, a == b i pozostały.',
            tests: (r) => ['3:1', '2:2', '0:4', '0:0', '1:0', '0:1', '20:19', '19:20', '20:20', `${r.int(0, 20)}:${r.int(0, 20)}`, `${r.int(0, 20)}:${r.int(0, 20)}`, `${r.int(0, 5)}:${r.int(0, 5)}`],
            solve: (inp) => { const [a, b] = inp.trim().split(':').map(Number); return a > b ? 'WYGRANA 3' : a === b ? 'REMIS 1' : 'PORAZKA 0'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    char dwukropek;
    cin >> a >> dwukropek >> b;
    if (a > b) {
        cout << "WYGRANA 3\n";
    } else if (a == b) {
        cout << "REMIS 1\n";
    } else {
        cout << "PORAZKA 0\n";
    }
    return 0;
}`,
        },
    ];
};
