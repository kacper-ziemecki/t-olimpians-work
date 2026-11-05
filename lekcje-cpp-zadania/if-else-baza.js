// If / Else — baza zadań na koniec tematu (krok 9).
// Kolejność = kolejność w lekcji i w sprawdzarce: najpierw łatwe, potem średnie, na końcu trudne.
// Każde zadanie łączy kilka zagadnień z lekcji (pole tags). Bez pętli.
module.exports = (h) => {
    const { nums, toks, lines, join, fx, capital, padL } = h;
    const R = String.raw;
    const K = 9;
    const z2 = (n) => padL(n, 2, '0');
    const przestepny = (r) => (r % 4 === 0 && r % 100 !== 0) || r % 400 === 0;
    const dniMiesiaca = (m, r) => (m === 2 ? (przestepny(r) ? 29 : 28) : [4, 6, 9, 11].includes(m) ? 30 : 31);
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];
    const KOL = 'abcdefgh';
    const pole = (r) => `${r.pick(KOL)}${r.int(1, 8)}`;
    const naPole = (s) => [s.charCodeAt(0) - 96, Number(s[1])];
    const hhmm = (min) => `${z2(Math.floor(min / 60))}:${z2(min % 60)}`;
    const czas = (s) => { const m = s.match(/(\d+):(\d+)/); return Number(m[1]) * 60 + Number(m[2]); };
    const data = (r, rokOd = 1000, rokDo = 9998) => {
        const y = r.int(rokOd, rokDo), m = r.int(1, 12), d = r.int(1, dniMiesiaca(m, y));
        return `${z2(d)}.${z2(m)}.${y}`;
    };
    const dmr = (s) => s.trim().split('.').map(Number);

    return [
        // ================================================================ łatwe
        {
            id: 'ie-woda', krok: K, level: 'latwe',
            title: 'Lód, woda czy para?',
            short: 'Temperatura wody → lod, woda albo para. Uważaj na 0 i 100 stopni.',
            tags: ['else if', 'granice przedziałów'],
            statement: ['Wczytaj temperaturę wody t (w stopniach Celsjusza). Wypisz lod, gdy t ≤ 0, para, gdy t ≥ 100, a woda w pozostałych przypadkach.'],
            input_format: ['Jedna liczba całkowita t.'],
            output_format: ['Jedno słowo: lod, woda albo para.'],
            constraints: ['−273 ≤ t ≤ 1000'],
            examples: [{ input: '-5' }, { input: '25' }, { input: '100' }],
            hint: 'Trzy przypadki: if (t <= 0) lod, else if (t >= 100) para, else woda. Granice 0 i 100 należą odpowiednio do lodu i pary — sprawdź je osobno.',
            tests: (r) => ['-5', '25', '100', '0', '1', '99', '-273', '1000', String(r.int(1, 99)), String(r.int(-273, 0)), String(r.int(100, 1000))],
            solve: (inp) => { const t = nums(inp)[0]; return t <= 0 ? 'lod' : t >= 100 ? 'para' : 'woda'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    if (t <= 0) {
        cout << "lod\n";
    } else if (t >= 100) {
        cout << "para\n";
    } else {
        cout << "woda\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-kto-wyzszy', krok: K, level: 'latwe',
            title: 'Kto jest wyższy?',
            short: 'Dwie osoby z imieniem i wzrostem — wypisz imię wyższej albo REMIS.',
            tags: ['string', 'else if'],
            statement: ['W każdym z dwóch wierszy wejścia jest imię osoby i jej wzrost w centymetrach. Wypisz imię wyższej osoby, a gdy obie są tego samego wzrostu — słowo REMIS.'],
            input_format: ['Dwa wiersze, w każdym imię (jedno słowo) i liczba całkowita.'],
            output_format: ['Jedno słowo: imię albo REMIS.'],
            constraints: ['imiona mają od 1 do 20 liter i są różne', '50 ≤ wzrost ≤ 250'],
            examples: [{ input: 'Ola 152\nAda 148' }, { input: 'Jan 170\nIgor 170' }],
            hint: 'Wczytaj cin >> imie1 >> w1 >> imie2 >> w2;. Potem trzy przypadki: w1 > w2, w2 > w1 i remis.',
            tests: (r) => {
                const n = () => capital(r.word(r.int(1, 20)));
                return ['Ola 152\nAda 148', 'Jan 170\nIgor 170', 'Ala 50\nBob 250', 'Ala 250\nBob 50', `Zosia 140\nKasia 141`,
                    `${n()}a ${r.int(50, 250)}\n${n()}b ${r.int(50, 250)}`, `${n()}a ${r.int(150, 160)}\n${n()}b ${r.int(150, 160)}`];
            },
            solve: (inp) => { const t = toks(inp); const a = Number(t[1]), b = Number(t[3]); return a > b ? t[0] : b > a ? t[2] : 'REMIS'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string i1, i2;
    int w1, w2;
    cin >> i1 >> w1 >> i2 >> w2;
    if (w1 > w2) {
        cout << i1 << "\n";
    } else if (w2 > w1) {
        cout << i2 << "\n";
    } else {
        cout << "REMIS\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-boisko', krok: K, level: 'latwe',
            title: 'Piłka na boisku',
            short: 'Czy punkt (x, y) leży w prostokącie boiska? Linie się liczą.',
            tags: ['&&', 'przedziały'],
            statement: [
                'Boisko to prostokąt, w którym x jest od 0 do a, a y — od 0 do b. Linie należą do boiska.',
                'Wczytaj a i b, a potem współrzędne piłki x i y. Wypisz BOISKO, jeśli piłka jest na boisku (także na linii), albo AUT w przeciwnym razie.',
            ],
            input_format: ['Pierwszy wiersz: liczby całkowite a i b. Drugi wiersz: liczby całkowite x i y.'],
            output_format: ['Jedno słowo: BOISKO albo AUT.'],
            constraints: ['1 ≤ a, b ≤ 1000', '−2000 ≤ x, y ≤ 2000'],
            examples: [{ input: '100 60\n30 45' }, { input: '100 60\n101 20' }],
            hint: 'Piłka jest na boisku, gdy x jest w przedziale [0, a] i jednocześnie y w przedziale [0, b]: x >= 0 && x <= a && y >= 0 && y <= b.',
            tests: (r) => ['100 60\n30 45', '100 60\n101 20', '100 60\n0 0', '100 60\n100 60', '100 60\n-1 30', '100 60\n50 61', '100 60\n50 -1', '1 1\n1 0', '1000 1000\n-2000 2000',
                `${r.int(1, 1000)} ${r.int(1, 1000)}\n${r.int(-50, 1050)} ${r.int(-50, 1050)}`, `500 300\n${r.int(0, 500)} ${r.int(0, 300)}`, `${r.int(1, 1000)} ${r.int(1, 1000)}\n${r.int(-2000, 2000)} ${r.int(-2000, 2000)}`],
            solve: (inp) => { const [a, b, x, y] = nums(inp); return x >= 0 && x <= a && y >= 0 && y <= b ? 'BOISKO' : 'AUT'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, x, y;
    cin >> a >> b >> x >> y;
    if (x >= 0 && x <= a && y >= 0 && y <= b) {
        cout << "BOISKO\n";
    } else {
        cout << "AUT\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-wspolny-dzielnik', krok: K, level: 'latwe',
            title: 'Wspólny dzielnik',
            short: 'Czy d dzieli jednocześnie n i m?',
            tags: ['%', '&&'],
            statement: ['Wczytaj trzy dodatnie liczby całkowite n, m i d. Wypisz TAK, jeśli d dzieli bez reszty zarówno n, jak i m, albo NIE w przeciwnym razie.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi n, m i d.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['1 ≤ n, m, d ≤ 10⁹'],
            examples: [{ input: '12 18 6' }, { input: '12 18 4' }],
            hint: 'Dwa warunki naraz: n % d == 0 && m % d == 0.',
            tests: (r) => {
                const d = r.int(1, 1000);
                return ['12 18 6', '12 18 4', '1 1 1', '7 14 7', '14 7 14', '1000000000 1000000000 1000000000', '1000000000 999999999 1',
                    `${d * r.int(1, 1e6)} ${d * r.int(1, 1e6)} ${d}`, `${d * r.int(1, 1e6)} ${d * r.int(1, 1e6) + 1} ${d === 1 ? 2 : d}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 10)}`];
            },
            solve: (inp) => { const [n, m, d] = nums(inp); return n % d === 0 && m % d === 0 ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, m, d;
    cin >> n >> m >> d;
    if (n % d == 0 && m % d == 0) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-bilet-miesieczny', krok: K, level: 'latwe',
            title: 'Bilet miesięczny czy jednorazowe?',
            short: 'Policz, co wyjdzie taniej, i wypisz wybór oraz koszt.',
            tags: ['if … else', 'porównanie kosztów'],
            statement: [
                'Bilet jednorazowy kosztuje p zł, a miesięczny — m zł. W tym miesiącu pojedziesz n razy.',
                'Wypisz MIESIECZNY, jeśli bilet miesięczny wyjdzie taniej niż n biletów jednorazowych, albo JEDNORAZOWE w przeciwnym razie (także wtedy, gdy koszty są równe). W drugim wierszu wypisz, ile zapłacisz, wybierając tańszą możliwość.',
            ],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi p, m i n.'],
            output_format: ['Dwa wiersze: wybór i koszt.'],
            constraints: ['1 ≤ p ≤ 100', '1 ≤ m ≤ 1000', '0 ≤ n ≤ 200'],
            examples: [{ input: '4 110 40' }, { input: '4 110 20' }],
            hint: 'Policz jednorazowe = p * n. if (m < jednorazowe) MIESIECZNY i m, else JEDNORAZOWE i jednorazowe.',
            tests: (r) => ['4 110 40', '4 110 20', '5 100 20', '5 100 21', '1 1 0', '100 1000 200', '100 1 1', `${r.int(1, 100)} ${r.int(1, 1000)} ${r.int(0, 200)}`, `${r.int(1, 10)} ${r.int(50, 150)} ${r.int(5, 40)}`, `${r.int(1, 100)} ${r.int(1, 1000)} ${r.int(0, 200)}`],
            solve: (inp) => { const [p, m, n] = nums(inp); const j = p * n; return m < j ? join('MIESIECZNY', String(m)) : join('JEDNORAZOWE', String(j)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int p, m, n;
    cin >> p >> m >> n;
    int jednorazowe = p * n;
    if (m < jednorazowe) {
        cout << "MIESIECZNY\n" << m << "\n";
    } else {
        cout << "JEDNORAZOWE\n" << jednorazowe << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-do-dziesiatek', krok: K, level: 'latwe',
            title: 'Zaokrąglanie do dziesiątek',
            short: 'Zaokrąglij liczbę do najbliższej pełnej dziesiątki (piątka w górę).',
            tags: ['%', 'if … else'],
            statement: ['Zaokrąglij nieujemną liczbę całkowitą n do najbliższej pełnej dziesiątki. Liczby kończące się cyfrą 5 zaokrąglamy w górę: 25 → 30, 24 → 20, 40 → 40.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — n zaokrąglona do dziesiątek.'],
            constraints: ['0 ≤ n ≤ 10⁹'],
            examples: [{ input: '24' }, { input: '25' }, { input: '40' }],
            hint: 'Ostatnia cyfra to n % 10. Jeśli jest mniejsza od 5, zaokrąglasz w dół: n - n % 10. W przeciwnym razie — w górę: n - n % 10 + 10.',
            tests: (r) => ['24', '25', '40', '0', '4', '5', '9', '995', '999999995', '1000000000', '999999994', String(r.int(0, 1e9)), String(r.int(0, 1e9))],
            solve: (inp) => { const n = nums(inp)[0]; const d = n - (n % 10); return String(n % 10 < 5 ? d : d + 10); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int cyfra = n % 10;
    if (cyfra < 5) {
        cout << n - cyfra << "\n";
    } else {
        cout << n - cyfra + 10 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-poprawna-godzina', krok: K, level: 'latwe',
            title: 'Czy to poprawna godzina?',
            short: 'HH:MM z dowolnymi cyframi — czy taka godzina istnieje na zegarze?',
            tags: ['char jako separator', '&&'],
            statement: ['Wczytaj godzinę zapisaną jako HH:MM, gdzie HH i MM to dowolne liczby dwucyfrowe (od 00 do 99). Wypisz POPRAWNA, jeśli taka godzina istnieje na zegarze (godziny od 0 do 23, minuty od 0 do 59), albo NIEPOPRAWNA w przeciwnym razie.'],
            input_format: ['Jeden wiersz w postaci HH:MM.'],
            output_format: ['Jedno słowo: POPRAWNA albo NIEPOPRAWNA.'],
            constraints: ['HH i MM to liczby od 00 do 99 zapisane dwiema cyframi'],
            examples: [{ input: '13:45' }, { input: '24:00' }, { input: '07:60' }],
            hint: 'Wczytaj cin >> h >> dwukropek >> m;. Godzina jest poprawna, gdy h <= 23 && m <= 59 (ujemnych liczb na wejściu nie ma).',
            tests: (r) => ['13:45', '24:00', '07:60', '00:00', '23:59', '23:60', '24:59', '99:99', '00:59', '19:00', `${z2(r.int(0, 99))}:${z2(r.int(0, 99))}`, `${z2(r.int(0, 23))}:${z2(r.int(0, 59))}`, `${z2(r.int(0, 99))}:${z2(r.int(0, 99))}`],
            solve: (inp) => { const [h, m] = inp.trim().split(':').map(Number); return h <= 23 && m <= 59 ? 'POPRAWNA' : 'NIEPOPRAWNA'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h, m;
    char dwukropek;
    cin >> h >> dwukropek >> m;
    if (h <= 23 && m <= 59) {
        cout << "POPRAWNA\n";
    } else {
        cout << "NIEPOPRAWNA\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-kolor-pola', krok: K, level: 'latwe',
            title: 'Kolor pola szachownicy',
            short: 'Pole w rodzaju e4 — czarne czy białe?',
            tags: ['char', 'kody znaków', '%'],
            statement: [
                'Pola szachownicy oznacza się literą kolumny (od a do h) i numerem wiersza (od 1 do 8), na przykład e4. Pole a1 jest czarne, a kolory sąsiednich pól się zmieniają — tak jak na prawdziwej szachownicy.',
                'Wczytaj oznaczenie pola i wypisz czarne albo biale.',
            ],
            input_format: ['Jeden wiersz z oznaczeniem pola, np. e4.'],
            output_format: ['Jedno słowo: czarne albo biale.'],
            constraints: ['litera od a do h, cyfra od 1 do 8'],
            examples: [{ input: 'a1' }, { input: 'e4' }, { input: 'h1' }],
            hint: R`Wczytaj char kol; int w; cin >> kol >> w;. Numer kolumny to kol - 'a' + 1 (dla a to 1, dla h — 8). Na polu a1 suma numeru kolumny i wiersza to 2, a gdy przesuniesz się o jedno pole, suma zmienia się o 1 — więc pola z parzystą sumą są czarne, a z nieparzystą — białe.`,
            tests: (r) => ['a1', 'e4', 'h1', 'h8', 'a8', 'b1', 'd1', 'e1', 'd8', 'e8', 'c3', pole(r), pole(r), pole(r)],
            solve: (inp) => { const [k, w] = naPole(inp.trim()); return (k + w) % 2 === 0 ? 'czarne' : 'biale'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char kol;
    int w;
    cin >> kol >> w;
    int k = kol - 'a' + 1;
    if ((k + w) % 2 == 0) {
        cout << "czarne\n";
    } else {
        cout << "biale\n";
    }
    return 0;
}`,
        },

        // ================================================================ średnie
        {
            id: 'ie-papier-kamien-nozyce', krok: K, level: 'srednie',
            title: 'Kamień, papier, nożyce',
            short: 'K, P albo N dwóch graczy — kto wygrał?',
            tags: ['char', '&&', '||', 'else if'],
            statement: [
                'Dwaj gracze pokazują jednocześnie K (kamień), P (papier) albo N (nożyce). Kamień tępi nożyce, nożyce tną papier, a papier owija kamień.',
                'Wczytaj dwa znaki — wybór pierwszego i drugiego gracza — i wypisz PIERWSZY, DRUGI albo REMIS.',
            ],
            input_format: ['Jeden wiersz z dwiema literami (K, P lub N) oddzielonymi spacją.'],
            output_format: ['Jedno słowo: PIERWSZY, DRUGI albo REMIS.'],
            constraints: ['każda litera to K, P albo N'],
            examples: [{ input: 'K N' }, { input: 'K P' }, { input: 'N N' }],
            hint: R`Najpierw remis: if (a == b). Potem trzy sytuacje, w których wygrywa pierwszy, połączone przez ||: (a == 'K' && b == 'N') || (a == 'N' && b == 'P') || (a == 'P' && b == 'K'). W pozostałych przypadkach wygrywa drugi.`,
            tests: () => ['K N', 'K P', 'N N', 'K K', 'P P', 'N P', 'P N', 'P K', 'N K'],
            solve: (inp) => {
                const [a, b] = toks(inp);
                if (a === b) return 'REMIS';
                return (a === 'K' && b === 'N') || (a === 'N' && b === 'P') || (a === 'P' && b === 'K') ? 'PIERWSZY' : 'DRUGI';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char a, b;
    cin >> a >> b;
    if (a == b) {
        cout << "REMIS\n";
    } else if ((a == 'K' && b == 'N') || (a == 'N' && b == 'P') || (a == 'P' && b == 'K')) {
        cout << "PIERWSZY\n";
    } else {
        cout << "DRUGI\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-zegar-12h', krok: K, level: 'srednie',
            title: 'Zegar 12-godzinny',
            short: 'Zamień 14:05 na 2:05 PM, a 00:30 na 12:30 AM.',
            tags: ['char jako separator', 'else if', 'setfill'],
            statement: [
                'Zamień godzinę z zapisu 24-godzinnego HH:MM na zapis 12-godzinny w stylu angielskim: h:MM AM dla godzin przed południem i h:MM PM dla godzin od południa.',
                'Północ (00:MM) to 12:MM AM, a południe (12:MM) to 12:MM PM. Godzinę h wypisz bez zera z przodu, a minuty — zawsze dwiema cyframi.',
            ],
            input_format: ['Jeden wiersz w postaci HH:MM.'],
            output_format: ['Jeden wiersz w postaci h:MM AM albo h:MM PM.'],
            constraints: ['00 ≤ HH ≤ 23', '00 ≤ MM ≤ 59'],
            examples: [{ input: '00:05' }, { input: '09:30' }, { input: '12:00' }, { input: '23:59' }],
            hint: R`Cztery przypadki: h == 0 → 12 AM, h < 12 → h AM, h == 12 → 12 PM, pozostałe → h - 12 PM. Minuty wypisz z zerem z przodu: cout << setfill('0') << setw(2) << m;.`,
            tests: (r) => ['00:05', '09:30', '12:00', '23:59', ...Array.from({ length: 24 }, (_, h) => `${z2(h)}:${z2(r.int(0, 59))}`), '00:00', '12:59', '11:59', '13:00'],
            solve: (inp) => {
                const [h, m] = inp.trim().split(':').map(Number);
                const g = h === 0 ? 12 : h <= 12 ? h : h - 12;
                return `${g}:${z2(m)} ${h < 12 ? 'AM' : 'PM'}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    int h, m;
    char dwukropek;
    cin >> h >> dwukropek >> m;
    int g;
    string pora;
    if (h == 0) {
        g = 12;
        pora = "AM";
    } else if (h < 12) {
        g = h;
        pora = "AM";
    } else if (h == 12) {
        g = 12;
        pora = "PM";
    } else {
        g = h - 12;
        pora = "PM";
    }
    cout << g << ":" << setfill('0') << setw(2) << m << " " << pora << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-rodzaj-trojkata', krok: K, level: 'srednie',
            title: 'Jaki to trójkąt?',
            short: 'Czy z trzech odcinków powstanie trójkąt? Równoboczny, równoramienny czy różnoboczny?',
            tags: ['&&', '||', 'else if', 'nierówność trójkąta'],
            statement: [
                'Wczytaj długości trzech odcinków a, b i c. Trójkąt da się z nich zbudować, gdy każdy odcinek jest krótszy od sumy dwóch pozostałych.',
                'Jeśli trójkąta nie da się zbudować, wypisz NIE ISTNIEJE. W przeciwnym razie wypisz ROWNOBOCZNY (wszystkie trzy boki równe), ROWNORAMIENNY (dokładnie dwa boki równe) albo ROZNOBOCZNY.',
            ],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi a, b i c.'],
            output_format: ['Jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ a, b, c ≤ 10⁶'],
            examples: [{ input: '3 4 5' }, { input: '5 5 8' }, { input: '1 2 3', note: '1 + 2 nie jest większe od 3 — odcinki położą się na jednej prostej.' }],
            hint: 'Najpierw sprawdź, czy trójkąt istnieje: a + b > c && a + c > b && b + c > a — i jeśli nie, od razu NIE ISTNIEJE. Potem: a == b && b == c → równoboczny, a == b || b == c || a == c → równoramienny, w pozostałych przypadkach różnoboczny.',
            tests: (r) => ['3 4 5', '5 5 8', '1 2 3', '2 2 2', '2 2 3', '3 2 2', '2 3 2', '1 1 2', '5 5 10', '10 1 1', '7 7 13', '1000000 1000000 1000000', '1 1000000 1000000', '1000000 999999 1',
                r.arr(3, 1, 1e6).join(' '), r.arr(3, 1, 10).join(' '), r.arr(3, 1, 10).join(' ')],
            solve: (inp) => {
                const [a, b, c] = nums(inp);
                if (!(a + b > c && a + c > b && b + c > a)) return 'NIE ISTNIEJE';
                if (a === b && b === c) return 'ROWNOBOCZNY';
                if (a === b || b === c || a === c) return 'ROWNORAMIENNY';
                return 'ROZNOBOCZNY';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (!(a + b > c && a + c > b && b + c > a)) {
        cout << "NIE ISTNIEJE\n";
    } else if (a == b && b == c) {
        cout << "ROWNOBOCZNY\n";
    } else if (a == b || b == c || a == c) {
        cout << "ROWNORAMIENNY\n";
    } else {
        cout << "ROZNOBOCZNY\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-odcinki', krok: K, level: 'srednie',
            title: 'Czy odcinki się nakładają?',
            short: 'Dwa odcinki na osi — mają choć jeden wspólny punkt?',
            tags: ['||', '!', 'przedziały'],
            statement: [
                'Na osi liczbowej leżą dwa odcinki: od a do b oraz od c do d (a ≤ b i c ≤ d).',
                'Wypisz TAK, jeśli mają co najmniej jeden wspólny punkt (wystarczy wspólny koniec), albo NIE w przeciwnym razie.',
            ],
            input_format: ['Jeden wiersz z czterema liczbami całkowitymi a, b, c i d.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['−10⁹ ≤ a ≤ b ≤ 10⁹', '−10⁹ ≤ c ≤ d ≤ 10⁹'],
            examples: [{ input: '1 5 4 9' }, { input: '1 3 4 9' }, { input: '1 4 4 9', note: 'Wspólny koniec 4 wystarczy.' }],
            hint: 'Łatwiej opisać, kiedy odcinki się NIE nakładają: gdy pierwszy kończy się przed początkiem drugiego (b < c) albo drugi kończy się przed początkiem pierwszego (d < a). Odpowiedź TAK to zaprzeczenie: !(b < c || d < a).',
            check: (inp) => { const [a, b, c, d] = nums(inp); return a <= b && c <= d ? null : 'zła kolejność końców'; },
            tests: (r) => {
                const odc = (lo, hi) => { const x = r.int(lo, hi), y = r.int(lo, hi); return x <= y ? `${x} ${y}` : `${y} ${x}`; };
                return ['1 5 4 9', '1 3 4 9', '1 4 4 9', '4 9 1 5', '4 9 1 3', '1 10 3 4', '3 4 1 10', '5 5 5 5', '5 5 6 6', '-1000000000 1000000000 0 0', '-1000000000 -999999999 999999999 1000000000',
                    `${odc(-100, 100)} ${odc(-100, 100)}`, `${odc(-1e9, 1e9)} ${odc(-1e9, 1e9)}`, `${odc(-20, 20)} ${odc(-20, 20)}`];
            },
            solve: (inp) => { const [a, b, c, d] = nums(inp); return !(b < c || d < a) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    if (!(b < c || d < a)) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-skoczek', krok: K, level: 'srednie',
            title: 'Ruch skoczka',
            short: 'Czy konik szachowy dojdzie z pola na pole jednym ruchem?',
            tags: ['char', 'wartość bezwzględna', '&&', '||'],
            statement: [
                'Skoczek (konik) szachowy porusza się „literą L”: o dwa pola w jednym kierunku i o jedno pole w kierunku prostopadłym.',
                'Wczytaj pole, na którym stoi skoczek, i pole docelowe (na przykład b1 c3). Wypisz TAK, jeśli skoczek może dojść na pole docelowe jednym ruchem, albo NIE w przeciwnym razie.',
            ],
            input_format: ['Jeden wiersz z dwoma polami szachownicy, np. b1 c3.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['litery od a do h, cyfry od 1 do 8'],
            examples: [{ input: 'b1 c3' }, { input: 'b1 b3' }],
            hint: R`Wczytaj cin >> k1 >> w1 >> k2 >> w2; (k1, k2 to char). Policz różnice dk = k2 - k1 i dw = w2 - w1 i zamień je na nieujemne (if (dk < 0) dk = -dk;). Ruch skoczka to (dk == 1 && dw == 2) || (dk == 2 && dw == 1).`,
            tests: (r) => ['b1 c3', 'b1 b3', 'b1 a3', 'b1 d2', 'g8 f6', 'e4 d6', 'e4 c3', 'e4 f2', 'e4 g5', 'e4 e4', 'e4 f5', 'a1 h8', 'h8 g6', `${pole(r)} ${pole(r)}`, `${pole(r)} ${pole(r)}`],
            solve: (inp) => {
                const [p, q] = toks(inp).map(naPole);
                const dk = Math.abs(p[0] - q[0]), dw = Math.abs(p[1] - q[1]);
                return (dk === 1 && dw === 2) || (dk === 2 && dw === 1) ? 'TAK' : 'NIE';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char k1, k2;
    int w1, w2;
    cin >> k1 >> w1 >> k2 >> w2;
    int dk = k2 - k1;
    int dw = w2 - w1;
    if (dk < 0) { dk = -dk; }
    if (dw < 0) { dw = -dw; }
    if ((dk == 1 && dw == 2) || (dk == 2 && dw == 1)) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-za-k-dni', krok: K, level: 'srednie',
            title: 'Jaki dzień będzie za k dni?',
            short: 'Dziś dzień numer d — jaki dzień tygodnia będzie za k dni?',
            tags: ['%', 'switch'],
            statement: ['Dziś jest dzień tygodnia numer d (1 — poniedziałek, 2 — wtorek, …, 7 — niedziela). Wypisz nazwę dnia tygodnia, który będzie za k dni: poniedzialek, wtorek, sroda, czwartek, piatek, sobota albo niedziela.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi d i k.'],
            output_format: ['Jedno słowo — nazwa dnia.'],
            constraints: ['1 ≤ d ≤ 7', '0 ≤ k ≤ 10⁹'],
            examples: [{ input: '1 2' }, { input: '5 3', note: 'Piątek + 3 dni to poniedziałek.' }, { input: '7 700' }],
            hint: 'Co 7 dni tydzień się powtarza, więc liczy się tylko reszta z dzielenia. Ponumeruj dni od zera: numer dnia za k dni to (d - 1 + k) % 7 + 1. Potem switch z siedmioma przypadkami.',
            tests: (r) => ['1 2', '5 3', '7 700', '1 0', '7 1', '6 1', '3 1000000000', '7 1000000000', ...Array.from({ length: 7 }, (_, i) => `${i + 1} ${r.int(0, 1e9)}`)],
            solve: (inp) => { const [d, k] = nums(inp); return DNI[(d - 1 + k) % 7]; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d, k;
    cin >> d >> k;
    int wynik = (d - 1 + k) % 7 + 1;
    switch (wynik) {
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
            id: 'ie-lista-obecnosci', krok: K, level: 'srednie',
            title: 'Lista obecności',
            short: 'Trzy imiona — ułóż je w kolejności alfabetycznej.',
            tags: ['string', 'swap', 'sortowanie trzech'],
            statement: ['Wczytaj trzy imiona (każde zaczyna się wielką literą, a dalej ma małe litery) i wypisz je w kolejności alfabetycznej, każde w osobnym wierszu.'],
            input_format: ['Jeden wiersz z trzema imionami oddzielonymi spacjami.'],
            output_format: ['Trzy wiersze z imionami w kolejności alfabetycznej.'],
            constraints: ['każde imię ma od 1 do 20 liter'],
            examples: [{ input: 'Zosia Adam Marek' }, { input: 'Ola Ala Olaf' }],
            hint: 'To ten sam schemat co „Trzy liczby po kolei”, tylko na napisach: trzy zamiany if (a > b) swap(a, b); if (b > c) swap(b, c); if (a > b) swap(a, b);. Dla stringów > znaczy „później w słowniku”.',
            tests: (r) => {
                const n = () => capital(r.word(r.int(1, 20)));
                const p = capital(r.word(r.int(1, 4)));
                return ['Zosia Adam Marek', 'Ola Ala Olaf', 'Ala Ala Ala', 'Ala Bob Cyryl', 'Cyryl Bob Ala', 'Bob Cyryl Ala', `${p}a ${p} ${p}ab`, `${n()} ${n()} ${n()}`, `${n()} ${n()} ${n()}`, `${n()} ${n()} ${n()}`];
            },
            solve: (inp) => join(toks(inp).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))),
            cpp: R`
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string a, b, c;
    cin >> a >> b >> c;
    if (a > b) { swap(a, b); }
    if (b > c) { swap(b, c); }
    if (a > b) { swap(a, b); }
    cout << a << "\n" << b << "\n" << c << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-najblizsza-wielokrotnosc', krok: K, level: 'srednie',
            title: 'Najbliższa wielokrotność',
            short: 'Która wielokrotność liczby k leży najbliżej n?',
            tags: ['%', 'if … else', 'remis'],
            statement: [
                'Wczytaj liczby całkowite dodatnie n i k. Wypisz tę wielokrotność liczby k (czyli liczbę postaci k · i dla całkowitego i ≥ 0 — 0 też się liczy), która leży najbliżej n.',
                'Jeśli dwie wielokrotności są tak samo blisko, wypisz większą.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi n i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n, k ≤ 10⁹'],
            examples: [{ input: '17 5' }, { input: '13 5' }, { input: '15 10', note: '10 i 20 są tak samo blisko — wybieramy większą.' }],
            hint: 'Wielokrotność „w dół” to dol = n - n % k, a „w górę” — gora = dol + k. Porównaj odległości n - dol i gora - n: jeśli pierwsza jest mniejsza, wynik to dol, w przeciwnym razie (także przy remisie) gora.',
            tests: (r) => ['17 5', '13 5', '15 10', '3 10', '5 10', '10 10', '1 1', '1 1000000000', '1000000000 1000000000', '999999999 1000000000', '500000000 1000000000', '7 2', '7 3',
                `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e9)} ${r.int(1, 1000)}`, `${r.int(1, 100)} ${r.int(1, 10)}`],
            solve: (inp) => { const [n, k] = nums(inp); const dol = n - (n % k), gora = dol + k; return String(n - dol < gora - n ? dol : gora); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long dol = n - n % k;
    long long gora = dol + k;
    if (n - dol < gora - n) {
        cout << dol << "\n";
    } else {
        cout << gora << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-koniec-filmu', krok: K, level: 'srednie',
            title: 'Koniec filmu',
            short: 'Film zaczyna się o HH:MM i trwa t minut. O której się skończy?',
            tags: ['char jako separator', 'setfill', 'przejście przez północ'],
            statement: [
                'Film zaczyna się o godzinie HH:MM i trwa t minut. Wypisz godzinę jego końca w formacie HH:MM (z zerami z przodu).',
                'Jeśli film skończy się następnego dnia, w drugim wierszu wypisz nastepnego dnia.',
            ],
            input_format: ['Jeden wiersz: godzina rozpoczęcia HH:MM i liczba całkowita t.'],
            output_format: ['Jeden albo dwa wiersze, jak w przykładach.'],
            constraints: ['00 ≤ HH ≤ 23', '00 ≤ MM ≤ 59', '1 ≤ t ≤ 600'],
            examples: [{ input: '18:30 135' }, { input: '22:15 140' }],
            hint: R`Zamień początek na minuty od północy i dodaj t. Jeśli wynik to co najmniej 1440 (24 · 60), odejmij 1440 i zapamiętaj, że to już następny dzień. Godzinę wypisz przez setfill('0') << setw(2).`,
            tests: (r) => ['18:30 135', '22:15 140', '23:59 1', '00:00 600', '21:00 180', '21:00 179', '14:00 600', '23:00 600', `${hhmm(r.int(0, 1439))} ${r.int(1, 600)}`, `${hhmm(r.int(0, 1439))} ${r.int(1, 600)}`, `${hhmm(r.int(1200, 1439))} ${r.int(1, 600)}`],
            solve: (inp) => { const t = toks(inp); let k = czas(t[0]) + Number(t[1]); const nast = k >= 1440; if (nast) k -= 1440; return join(hhmm(k), nast ? ['nastepnego dnia'] : []); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h, m, t;
    char dwukropek;
    cin >> h >> dwukropek >> m >> t;
    int koniec = h * 60 + m + t;
    bool nastepny = false;
    if (koniec >= 1440) {
        koniec -= 1440;
        nastepny = true;
    }
    cout << setfill('0') << setw(2) << koniec / 60 << ":" << setw(2) << koniec % 60 << "\n";
    if (nastepny) {
        cout << "nastepnego dnia\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-cennik-paczek', krok: K, level: 'srednie',
            title: 'Cennik paczek',
            short: 'Waga w gramach i rodzaj dostawy → cena albo odmowa.',
            tags: ['else if', 'char', 'jednostki'],
            statement: [
                'Firma kurierska ma cennik: paczka do 1 kg włącznie kosztuje 9 zł, do 5 kg — 14 zł, a do 20 kg — 25 zł. Cięższych paczek firma nie przyjmuje. Za dostawę ekspresową dopłaca się 10 zł.',
                'Wczytaj wagę paczki w gramach i literę E (ekspres) albo Z (zwykła dostawa). Wypisz cenę w złotych albo NIE PRZYJMUJEMY dla paczek cięższych niż 20 kg.',
            ],
            input_format: ['Jeden wiersz: liczba całkowita (waga w gramach) i litera E albo Z.'],
            output_format: ['Jedna liczba albo napis NIE PRZYJMUJEMY.'],
            constraints: ['1 ≤ waga ≤ 100 000'],
            examples: [{ input: '1500 E' }, { input: '800 Z' }, { input: '25000 Z' }],
            hint: 'Uważaj na jednostki: 1 kg to 1000 g. Najpierw przypadek odmowy (waga > 20000), potem cena w łańcuchu else if, a na końcu if (dostawa == \'E\') cena += 10.',
            tests: (r) => ['1500 E', '800 Z', '25000 Z', '1000 Z', '1001 Z', '5000 E', '5001 Z', '20000 E', '20001 E', '1 Z', '100000 E', `${r.int(1, 30000)} ${r.pick(['E', 'Z'])}`, `${r.int(1, 30000)} ${r.pick(['E', 'Z'])}`, `${r.int(1, 1000)} E`],
            solve: (inp) => {
                const [ws, d] = toks(inp);
                const w = Number(ws);
                if (w > 20000) return 'NIE PRZYJMUJEMY';
                const c = w <= 1000 ? 9 : w <= 5000 ? 14 : 25;
                return String(d === 'E' ? c + 10 : c);
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int waga;
    char dostawa;
    cin >> waga >> dostawa;
    if (waga > 20000) {
        cout << "NIE PRZYJMUJEMY\n";
    } else {
        int cena;
        if (waga <= 1000) {
            cena = 9;
        } else if (waga <= 5000) {
            cena = 14;
        } else {
            cena = 25;
        }
        if (dostawa == 'E') {
            cena += 10;
        }
        cout << cena << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-podatek', krok: K, level: 'srednie',
            title: 'Podatek progowy',
            short: '12% do 120 000 zł, 32% od nadwyżki — policz podatek.',
            tags: ['if … else', 'double', 'setprecision(2)', 'zakres int'],
            statement: [
                'Uproszczony podatek dochodowy działa tak: od dochodu do 120 000 zł płaci się 12%, a od nadwyżki ponad 120 000 zł — 32%. Na przykład od 150 000 zł podatek to 12% z 120 000 zł plus 32% z 30 000 zł.',
                'Wczytaj roczny dochód d (w pełnych złotych) i wypisz podatek w złotych z dokładnością do dwóch miejsc po przecinku.',
            ],
            input_format: ['Jedna liczba całkowita d.'],
            output_format: ['Jedna liczba z dwiema cyframi po kropce.'],
            constraints: ['0 ≤ d ≤ 10⁹'],
            examples: [{ input: '50000' }, { input: '150000' }],
            hint: 'Dwa przypadki: if (d <= 120000) podatek = 0.12 * d; else podatek = 0.12 * 120000 + 0.32 * (d - 120000);. Licz na double — iloczyn d * 32 na int przekroczyłby zakres dla dużych dochodów.',
            tests: (r) => ['50000', '150000', '0', '1', '120000', '120001', '119999', '1000000000', '999999999', String(r.int(0, 120000)), String(r.int(120001, 1e9)), String(r.int(120001, 1e6))],
            solve: (inp) => { const d = nums(inp)[0]; return fx(d <= 120000 ? d * 12 / 100 : 14400 + (d - 120000) * 32 / 100, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long d;
    cin >> d;
    double podatek;
    if (d <= 120000) {
        podatek = 0.12 * d;
    } else {
        podatek = 0.12 * 120000 + 0.32 * (d - 120000);
    }
    cout << fixed << setprecision(2) << podatek << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-ile-trafien', krok: K, level: 'srednie',
            title: 'Ile trafień?',
            short: 'Trzy Twoje liczby i trzy wylosowane — ile trafiłeś?',
            tags: ['licznik', '||'],
            statement: [
                'W loterii wybierasz trzy różne liczby od 1 do 49, a maszyna losuje trzy różne liczby z tego samego zakresu.',
                'W pierwszym wierszu są Twoje liczby, a w drugim — wylosowane. Wypisz, ile Twoich liczb zostało wylosowanych.',
            ],
            input_format: ['Dwa wiersze, w każdym trzy różne liczby całkowite.'],
            output_format: ['Jedna liczba od 0 do 3.'],
            constraints: ['wszystkie liczby są od 1 do 49', 'liczby w jednym wierszu są różne'],
            examples: [{ input: '7 13 42\n42 8 7' }],
            hint: 'Licznik od zera i trzy osobne if-y — po jednym dla każdej Twojej liczby: if (a == x || a == y || a == z) { ile++; }.',
            check: (inp) => { const l = lines(inp.trim()).map((s) => nums(s)); return l.every((w) => new Set(w).size === 3) ? null : 'powtórzona liczba w wierszu'; },
            tests: (r) => {
                const trzy = () => { const s = new Set(); while (s.size < 3) s.add(r.int(1, 49)); return [...s]; };
                const out = ['7 13 42\n42 8 7', '1 2 3\n4 5 6', '1 2 3\n3 2 1', '1 2 3\n1 2 3', '10 20 30\n30 31 32', '49 48 47\n1 2 49'];
                for (let i = 0; i < 6; i++) out.push(`${trzy().join(' ')}\n${trzy().join(' ')}`);
                const t = trzy();
                out.push(`${t.join(' ')}\n${[t[1], t[2], t[0]].join(' ')}`);
                return out;
            },
            solve: (inp) => { const l = lines(inp.trim()).map((s) => nums(s)); return String(l[0].filter((x) => l[1].includes(x)).length); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c, x, y, z;
    cin >> a >> b >> c >> x >> y >> z;
    int ile = 0;
    if (a == x || a == y || a == z) { ile++; }
    if (b == x || b == y || b == z) { ile++; }
    if (c == x || c == y || c == z) { ile++; }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-jablka', krok: K, level: 'srednie',
            title: 'Ile jabłek?',
            short: '1 jablko, 2 jablka, 5 jablek — dobierz końcówkę jak w języku polskim.',
            tags: ['%', '&&', '||', 'else if'],
            statement: [
                'W języku polskim po liczbie zmienia się końcówka słowa: 1 jablko, 2 jablka, 5 jablek, 22 jablka, 112 jablek.',
                'Zasada: dla n = 1 piszemy jablko. Gdy ostatnia cyfra to 2, 3 lub 4, a przedostatnia nie jest jedynką (czyli liczba nie kończy się na 12, 13 ani 14) — jablka. We wszystkich pozostałych przypadkach, także dla 0 — jablek.',
                'Wczytaj n i wypisz n, spację i słowo z poprawną końcówką.',
            ],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz, jak w przykładach.'],
            constraints: ['0 ≤ n ≤ 10⁹'],
            examples: [{ input: '1' }, { input: '22' }, { input: '12' }],
            hint: 'Ostatnia cyfra to n % 10, a dwie ostatnie cyfry — n % 100. Warunek na jablka: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14). Przypadek n == 1 sprawdź na samym początku.',
            tests: (r) => ['1', '22', '12', '0', '2', '4', '5', '11', '13', '14', '15', '21', '24', '25', '101', '102', '111', '112', '114', '122', '1000000000', '999999914', '999999903', String(r.int(0, 1e9)), String(r.int(0, 1e9))],
            solve: (inp) => {
                const n = nums(inp)[0];
                const s = n === 1 ? 'jablko' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'jablka' : 'jablek';
                return `${n} ${s}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n == 1) {
        cout << n << " jablko\n";
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {
        cout << n << " jablka\n";
    } else {
        cout << n << " jablek\n";
    }
    return 0;
}`,
        },

        // ================================================================ trudne
        {
            id: 'ie-jaki-kat', krok: K, level: 'trudne',
            title: 'Ostry, prosty czy rozwarty?',
            short: 'Trzy boki → rodzaj trójkąta ze względu na kąty. Kwadraty potrzebują long long.',
            tags: ['sortowanie trzech', 'long long', 'else if'],
            statement: [
                'Wczytaj długości trzech odcinków. Jeśli nie da się z nich zbudować trójkąta (każdy bok musi być krótszy od sumy dwóch pozostałych), wypisz NIE ISTNIEJE.',
                'W przeciwnym razie wypisz PROSTOKATNY, OSTROKATNY albo ROZWARTOKATNY. Z matematyki: gdy c jest najdłuższym bokiem, trójkąt jest prostokątny, gdy a² + b² = c², ostrokątny, gdy a² + b² > c², a rozwartokątny, gdy a² + b² < c².',
            ],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi — długościami odcinków, w dowolnej kolejności.'],
            output_format: ['Jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ każda długość ≤ 10⁶'],
            examples: [{ input: '5 3 4' }, { input: '2 3 3' }, { input: '2 2 3' }],
            hint: 'Najpierw ustaw boki rosnąco trzema zamianami — wtedy c jest najdłuższy, a trójkąt istnieje dokładnie wtedy, gdy a + b > c. Kwadraty boków sięgają 10¹², więc licz je na long long.',
            tests: (r) => ['5 3 4', '2 3 3', '2 2 3', '3 4 5', '13 12 5', '1 2 3', '1 1 1', '1000000 1000000 1000000', '600000 800000 1000000', '1000000 600000 800000', '999999 1000000 1000000', '1 1000000 1000000',
                '500000 500000 999999', '20 21 29', r.arr(3, 1, 1e6).join(' '), r.arr(3, 1, 20).join(' '), r.arr(3, 1, 20).join(' ')],
            solve: (inp) => {
                const [a, b, c] = nums(inp).map(BigInt).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
                if (!(a + b > c)) return 'NIE ISTNIEJE';
                const s = a * a + b * b, t = c * c;
                return s === t ? 'PROSTOKATNY' : s > t ? 'OSTROKATNY' : 'ROZWARTOKATNY';
            },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    if (a > b) { swap(a, b); }
    if (b > c) { swap(b, c); }
    if (a > b) { swap(a, b); }
    if (a + b <= c) {
        cout << "NIE ISTNIEJE\n";
    } else if (a * a + b * b == c * c) {
        cout << "PROSTOKATNY\n";
    } else if (a * a + b * b > c * c) {
        cout << "OSTROKATNY\n";
    } else {
        cout << "ROZWARTOKATNY\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-czesc-wspolna', krok: K, level: 'trudne',
            title: 'Część wspólna odcinków',
            short: 'Jak długi jest kawałek wspólny dwóch odcinków na osi?',
            tags: ['max i min', 'przedziały', 'if'],
            statement: [
                'Na osi liczbowej leżą odcinki od a do b oraz od c do d (a ≤ b i c ≤ d).',
                'Wypisz długość ich części wspólnej. Gdy odcinki nie mają wspólnych punktów albo stykają się tylko końcami, wypisz 0.',
            ],
            input_format: ['Jeden wiersz z czterema liczbami całkowitymi a, b, c i d.'],
            output_format: ['Jedna liczba — długość części wspólnej.'],
            constraints: ['−10⁹ ≤ a ≤ b ≤ 10⁹', '−10⁹ ≤ c ≤ d ≤ 10⁹'],
            examples: [{ input: '1 5 3 9', note: 'Część wspólna to odcinek od 3 do 5.' }, { input: '1 3 4 9' }],
            hint: 'Część wspólna zaczyna się w późniejszym z początków i kończy we wcześniejszym z końców: pocz = max(a, c), kon = min(b, d). Jeśli kon > pocz, długość to kon - pocz, a w przeciwnym razie 0. Różnica może sięgać 2·10⁹ — użyj long long.',
            check: (inp) => { const [a, b, c, d] = nums(inp); return a <= b && c <= d ? null : 'zła kolejność końców'; },
            tests: (r) => {
                const odc = (lo, hi) => { const x = r.int(lo, hi), y = r.int(lo, hi); return x <= y ? `${x} ${y}` : `${y} ${x}`; };
                return ['1 5 3 9', '1 3 4 9', '1 4 4 9', '3 9 1 5', '1 10 3 4', '3 4 1 10', '5 5 5 5', '-1000000000 1000000000 -1000000000 1000000000', '-1000000000 0 0 1000000000',
                    `${odc(-100, 100)} ${odc(-100, 100)}`, `${odc(-1e9, 1e9)} ${odc(-1e9, 1e9)}`, `${odc(-1e9, 1e9)} ${odc(-1e9, 1e9)}`, `${odc(-20, 20)} ${odc(-20, 20)}`];
            },
            solve: (inp) => { const [a, b, c, d] = nums(inp); return String(Math.max(0, Math.min(b, d) - Math.max(a, c))); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    long long a, b, c, d;
    cin >> a >> b >> c >> d;
    long long pocz = max(a, c);
    long long kon = min(b, d);
    if (kon > pocz) {
        cout << kon - pocz << "\n";
    } else {
        cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-hetman', krok: K, level: 'trudne',
            title: 'Ruch hetmana',
            short: 'Pion, poziom albo przekątna — czy hetman dojdzie jednym ruchem?',
            tags: ['char', 'wartość bezwzględna', '||'],
            statement: [
                'Hetman porusza się o dowolną liczbę pól w pionie, w poziomie albo po przekątnej.',
                'Wczytaj dwa różne pola szachownicy (na przykład d1 h5) i wypisz TAK, jeśli hetman może przejść z pierwszego na drugie jednym ruchem (szachownica jest pusta), albo NIE w przeciwnym razie.',
            ],
            input_format: ['Jeden wiersz z dwoma różnymi polami szachownicy, np. d1 h5.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['litery od a do h, cyfry od 1 do 8', 'pola są różne'],
            examples: [{ input: 'd1 h5' }, { input: 'd1 d8' }, { input: 'a1 b3' }],
            hint: 'Ta sama kolumna (k1 == k2) albo ten sam wiersz (w1 == w2) to ruch w pionie lub poziomie. Po przekątnej hetman idzie wtedy, gdy różnica kolumn jest równa różnicy wierszy — po zamianie obu na wartości bez minusa.',
            check: (inp) => { const [p, q] = toks(inp); return p === q ? 'to samo pole' : null; },
            tests: (r) => {
                const out = ['d1 h5', 'd1 d8', 'a1 b3', 'a1 h8', 'h1 a8', 'e4 e5', 'e4 a4', 'e4 b7', 'e4 b6', 'c2 f4', 'a8 b1', 'g7 h6'];
                while (out.length < 18) { const p = pole(r), q = pole(r); if (p !== q) out.push(`${p} ${q}`); }
                return out;
            },
            solve: (inp) => {
                const [p, q] = toks(inp).map(naPole);
                return p[0] === q[0] || p[1] === q[1] || Math.abs(p[0] - q[0]) === Math.abs(p[1] - q[1]) ? 'TAK' : 'NIE';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char k1, k2;
    int w1, w2;
    cin >> k1 >> w1 >> k2 >> w2;
    int dk = k2 - k1;
    int dw = w2 - w1;
    if (dk < 0) { dk = -dk; }
    if (dw < 0) { dw = -dw; }
    if (k1 == k2 || w1 == w2 || dk == dw) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-parking', krok: K, level: 'trudne',
            title: 'Parking',
            short: 'Pierwsza godzina gratis, potem 4 zł za każdą rozpoczętą godzinę.',
            tags: ['char jako separator', 'zaokrąglanie w górę', 'if'],
            statement: [
                'Na parkingu pierwsza godzina postoju jest darmowa, a za każdą kolejną rozpoczętą godzinę płaci się 4 zł. Na przykład za 61 minut płaci się 4 zł, a za 2 godziny i 1 minutę — 8 zł.',
                'Wczytaj godzinę wjazdu i godzinę wyjazdu (obie w formacie HH:MM, tego samego dnia, wyjazd nie wcześniej niż wjazd) i wypisz opłatę w złotych.',
            ],
            input_format: ['Jeden wiersz: godzina wjazdu i godzina wyjazdu, obie w postaci HH:MM, oddzielone spacją.'],
            output_format: ['Jedna liczba — opłata w złotych.'],
            constraints: ['00:00 ≤ wjazd ≤ wyjazd ≤ 23:59'],
            examples: [{ input: '10:00 10:45' }, { input: '10:00 11:01' }, { input: '08:30 12:30' }],
            hint: 'Policz minuty postoju: (h2 * 60 + m2) - (h1 * 60 + m1). Jeśli to najwyżej 60 — opłata 0. W przeciwnym razie płatne minuty to postoj - 60, a liczba rozpoczętych godzin to płatne / 60 plus jeszcze 1, gdy płatne % 60 != 0 — tak jak przy autobusach z części 01.',
            check: (inp) => { const [a, b] = toks(inp).map(czas); return a <= b ? null : 'wyjazd przed wjazdem'; },
            tests: (r) => {
                const para = () => { const a = r.int(0, 1439), b = r.int(a, 1439); return `${hhmm(a)} ${hhmm(b)}`; };
                return ['10:00 10:45', '10:00 11:01', '08:30 12:30', '10:00 10:00', '10:00 11:00', '10:00 12:00', '10:00 12:01', '00:00 23:59', '23:00 23:59', '12:59 14:00', para(), para(), para()];
            },
            solve: (inp) => {
                const [a, b] = toks(inp).map(czas);
                const p = b - a;
                if (p <= 60) return '0';
                const pl = p - 60;
                return String(4 * ((pl - pl % 60) / 60 + (pl % 60 ? 1 : 0)));
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h1, m1, h2, m2;
    char dwukropek;
    cin >> h1 >> dwukropek >> m1 >> h2 >> dwukropek >> m2;
    int postoj = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (postoj <= 60) {
        cout << 0 << "\n";
    } else {
        int platne = postoj - 60;
        int godziny = platne / 60;
        if (platne % 60 != 0) {
            godziny++;
        }
        cout << 4 * godziny << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-dzien-roku', krok: K, level: 'trudne',
            title: 'Który to dzień roku?',
            short: 'Data DD.MM.RRRR → numer dnia w roku. Bez pętli!',
            tags: ['char jako separator', 'rok przestępny', 'kilka if'],
            statement: [
                'Wczytaj datę w formacie DD.MM.RRRR i wypisz, którym dniem roku jest. 1 stycznia to dzień 1, a 31 grudnia — dzień 365 albo 366 w roku przestępnym.',
                'Rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400. Data na wejściu jest poprawna.',
            ],
            input_format: ['Jeden wiersz z datą DD.MM.RRRR.'],
            output_format: ['Jedna liczba — numer dnia w roku.'],
            constraints: ['1000 ≤ RRRR ≤ 9999', 'data jest poprawna'],
            examples: [{ input: '01.01.2026' }, { input: '01.03.2024', note: 'Styczeń (31) + luty (29) + 1 = 61.' }, { input: '31.12.2026' }],
            hint: 'Zacznij od numer = d i dodawaj długości wszystkich pełnych miesięcy przed miesiącem m — osobnymi if-ami: if (m > 1) numer += 31; if (m > 2) numer += luty; if (m > 3) numer += 31; … aż do if (m > 11) numer += 30;. Luty ma 29 albo 28 dni — policz to wcześniej.',
            tests: (r) => ['01.01.2026', '01.03.2024', '31.12.2026', '31.12.2024', '01.03.2023', '29.02.2024', '28.02.2023', '31.01.2025', '01.02.2025', '15.06.2026', '31.12.2000', '31.12.1900', '01.03.2000', '01.03.2100', data(r), data(r), data(r), data(r)],
            solve: (inp) => { const [d, m, y] = dmr(inp); let n = d; for (let i = 1; i < m; i++) n += dniMiesiaca(i, y); return String(n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d, m, r;
    char kropka;
    cin >> d >> kropka >> m >> kropka >> r;
    int luty = 28;
    if ((r % 4 == 0 && r % 100 != 0) || r % 400 == 0) {
        luty = 29;
    }
    int numer = d;
    if (m > 1) { numer += 31; }
    if (m > 2) { numer += luty; }
    if (m > 3) { numer += 31; }
    if (m > 4) { numer += 30; }
    if (m > 5) { numer += 31; }
    if (m > 6) { numer += 30; }
    if (m > 7) { numer += 31; }
    if (m > 8) { numer += 31; }
    if (m > 9) { numer += 30; }
    if (m > 10) { numer += 31; }
    if (m > 11) { numer += 30; }
    cout << numer << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-ostatnia-cyfra-potegi', krok: K, level: 'trudne',
            title: 'Ostatnia cyfra potęgi',
            short: 'Ostatnia cyfra liczby aⁿ dla n aż do 10¹⁸ — bez liczenia całej potęgi.',
            tags: ['long long', '%', 'cykl co 4', 'if'],
            statement: [
                'Wczytaj cyfrę a (od 0 do 9) i liczbę n (od 1 do 10¹⁸). Wypisz ostatnią cyfrę liczby aⁿ, czyli a pomnożonego przez siebie n razy.',
                'Liczba aⁿ jest gigantyczna, ale jej ostatnie cyfry powtarzają się co 4 kroki. Na przykład dla a = 2 kolejne potęgi kończą się cyframi 2, 4, 8, 6, 2, 4, 8, 6, … Tak jest dla każdej cyfry: ostatnia cyfra aⁿ jest taka sama jak ostatnia cyfra aᵖ, gdzie p to liczba od 1 do 4 o tej samej reszcie z dzielenia przez 4 co n.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i n.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ a ≤ 9', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '2 10', note: '2¹⁰ = 1024.' }, { input: '7 3' }, { input: '9 1000000000000000000' }],
            hint: 'n nie mieści się w int — użyj long long. Policz p = (n - 1) % 4 + 1 (to liczba od 1 do 4). Potem pomnóż a przez siebie p razy, za każdym razem zostawiając tylko ostatnią cyfrę: int w = a; if (p >= 2) w = w * a % 10; if (p >= 3) w = w * a % 10; if (p >= 4) w = w * a % 10;.',
            tests: (r) => ['2 10', '7 3', '9 1000000000000000000', '0 1', '0 1000000000000000000', '1 999999999999999999', '5 2', '6 7', '2 1', '2 2', '2 3', '2 4', '3 5', '8 6', '4 999999999999999999',
                `${r.int(0, 9)} ${r.big(1, 10n ** 18n)}`, `${r.int(0, 9)} ${r.big(1, 10n ** 18n)}`, `${r.int(0, 9)} ${r.int(1, 100)}`],
            solve: (inp) => {
                const t = toks(inp);
                const a = BigInt(t[0]), n = BigInt(t[1]);
                const p = (n - 1n) % 4n + 1n;
                let w = 1n;
                for (let i = 0n; i < p; i++) w = (w * a) % 10n;
                return String(w);
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a;
    long long n;
    cin >> a >> n;
    int p = (n - 1) % 4 + 1;
    int w = a;
    if (p >= 2) { w = w * a % 10; }
    if (p >= 3) { w = w * a % 10; }
    if (p >= 4) { w = w * a % 10; }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'ie-prostokaty', krok: K, level: 'trudne',
            title: 'Wspólna część prostokątów',
            short: 'Pole części wspólnej dwóch prostokątów — odcinki na obu osiach.',
            tags: ['max i min', 'long long', 'część wspólna'],
            statement: [
                'Na płaszczyźnie leżą dwa prostokąty o bokach równoległych do osi układu. Pierwszy ma przeciwległe rogi w punktach (x1, y1) i (x2, y2), a drugi — w punktach (x3, y3) i (x4, y4), przy czym x1 < x2, y1 < y2, x3 < x4 i y3 < y4.',
                'Wypisz pole części wspólnej prostokątów. Gdy prostokąty na siebie nie nachodzą (albo stykają się tylko brzegami), wypisz 0.',
            ],
            input_format: ['Dwa wiersze: x1 y1 x2 y2 oraz x3 y3 x4 y4.'],
            output_format: ['Jedna liczba — pole części wspólnej.'],
            constraints: ['wszystkie współrzędne są między −10⁹ a 10⁹'],
            examples: [{ input: '0 0 4 3\n2 1 6 5', note: 'Część wspólna to prostokąt od (2, 1) do (4, 3) — pole 2 · 2 = 4.' }, { input: '0 0 2 2\n3 3 5 5' }],
            hint: 'Prostokąty nachodzą na siebie wtedy, gdy nachodzą na siebie ich „cienie” na obu osiach. Szerokość części wspólnej to min(x2, x4) - max(x1, x3), a wysokość — min(y2, y4) - max(y1, y3). Jeśli któraś wyjdzie ≤ 0, pole jest równe 0. Iloczyn może sięgać 4·10¹⁸ — tylko long long go pomieści.',
            check: (inp) => { const [a, b, c, d, e, f, g, i] = nums(inp); return a < c && b < d && e < g && f < i ? null : 'zła kolejność rogów'; },
            tests: (r) => {
                const pr = (lo, hi) => {
                    let a = r.int(lo, hi), b = r.int(lo, hi), c = r.int(lo, hi), d = r.int(lo, hi);
                    if (a === c) c = a + 1; if (b === d) d = b + 1;
                    return [Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)].join(' ');
                };
                return ['0 0 4 3\n2 1 6 5', '0 0 2 2\n3 3 5 5', '0 0 2 2\n2 0 4 2', '0 0 10 10\n2 2 3 3', '2 2 3 3\n0 0 10 10', '0 0 5 5\n0 0 5 5', '-1000000000 -1000000000 1000000000 1000000000\n-1000000000 -1000000000 1000000000 1000000000',
                    '-1000000000 -1000000000 1000000000 1000000000\n0 0 1000000000 1000000000', '0 0 4 4\n1 5 3 8', '0 0 4 4\n5 1 8 3',
                    `${pr(-20, 20)}\n${pr(-20, 20)}`, `${pr(-1e9, 1e9)}\n${pr(-1e9, 1e9)}`, `${pr(-1e9, 1e9)}\n${pr(-1e9, 1e9)}`, `${pr(-100, 100)}\n${pr(-100, 100)}`];
            },
            solve: (inp) => {
                const [x1, y1, x2, y2, x3, y3, x4, y4] = nums(inp).map(BigInt);
                const mx = (p, q) => (p > q ? p : q), mn = (p, q) => (p < q ? p : q);
                const w = mn(x2, x4) - mx(x1, x3), hh = mn(y2, y4) - mx(y1, y3);
                return String(w > 0n && hh > 0n ? w * hh : 0n);
            },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    long long x1, y1, x2, y2, x3, y3, x4, y4;
    cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3 >> x4 >> y4;
    long long szer = min(x2, x4) - max(x1, x3);
    long long wys = min(y2, y4) - max(y1, y3);
    if (szer > 0 && wys > 0) {
        cout << szer * wys << "\n";
    } else {
        cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ie-jutro', krok: K, level: 'trudne',
            title: 'Wielki finał: jaka data będzie jutro?',
            short: 'Data DD.MM.RRRR → data następnego dnia. Miesiące, lata przestępne i Sylwester.',
            tags: ['char jako separator', 'if w if', 'rok przestępny', 'setfill'],
            statement: [
                'Wczytaj datę w formacie DD.MM.RRRR i wypisz datę następnego dnia w tym samym formacie: dzień i miesiąc dwiema cyframi, rok czterema.',
                'Pamiętaj o miesiącach o różnej długości (kwiecień, czerwiec, wrzesień i listopad mają po 30 dni), o lutym w latach przestępnych (rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400) i o Sylwestrze.',
            ],
            input_format: ['Jeden wiersz z poprawną datą DD.MM.RRRR.'],
            output_format: ['Jeden wiersz z datą następnego dnia w formacie DD.MM.RRRR.'],
            constraints: ['1000 ≤ RRRR ≤ 9998', 'data jest poprawna'],
            examples: [{ input: '15.06.2026' }, { input: '28.02.2024' }, { input: '31.12.2025' }],
            hint: R`Najpierw policz, ile dni ma miesiąc m (jak w ćwiczeniu „Ile dni ma miesiąc?”). Potem: d++; if (d > dni) { d = 1; m++; if (m > 12) { m = 1; r++; } }. Wypisz z zerami: cout << setfill('0') << setw(2) << d << "." << setw(2) << m << "." << r;.`,
            tests: (r) => ['15.06.2026', '28.02.2024', '31.12.2025', '29.02.2024', '28.02.2023', '28.02.1900', '28.02.2000', '28.02.2100', '30.04.2026', '31.01.2026', '31.03.2026', '30.06.2026', '30.09.2026', '30.11.2026', '31.07.2026', '31.08.2026', '31.10.2026', '01.01.1000', '31.12.9998', '30.12.2026',
                data(r), data(r), data(r), data(r)],
            solve: (inp) => {
                let [d, m, y] = dmr(inp);
                d++;
                if (d > dniMiesiaca(m, y)) { d = 1; m++; if (m > 12) { m = 1; y++; } }
                return `${z2(d)}.${z2(m)}.${y}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int d, m, r;
    char kropka;
    cin >> d >> kropka >> m >> kropka >> r;
    int dni;
    if (m == 2) {
        if ((r % 4 == 0 && r % 100 != 0) || r % 400 == 0) {
            dni = 29;
        } else {
            dni = 28;
        }
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        dni = 30;
    } else {
        dni = 31;
    }
    d++;
    if (d > dni) {
        d = 1;
        m++;
        if (m > 12) {
            m = 1;
            r++;
        }
    }
    cout << setfill('0') << setw(2) << d << "." << setw(2) << m << "." << r << "\n";
    return 0;
}`,
        },
    ];
};
