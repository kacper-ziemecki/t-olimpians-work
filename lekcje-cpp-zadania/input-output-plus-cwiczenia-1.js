// Input i Output (+) — ćwiczenia w trakcie lekcji, części 1–3: ile jest danych (n na początku, wartość kończąca,
// koniec danych, strumień w stanie błędu i cin.clear()), wiele testów w jednym wejściu (reset zmiennych, doczytywanie
// testu, Case #k, puste wiersze między testami, czyszczenie tylko użytych liczników) oraz wypisywanie z głową
// (separatory, nawiasy, k w wierszu, odstępy co trzy cyfry, kolumny z setw, spis treści, tabela z ramką).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, SLOWA, rozrzuc, losy, calk, czyLiczba } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const wszystkieCalk = (t, lo, hi) => t.every((x) => czyLiczba(x) && calk(Number(x), lo, hi));

    return [
        // ================================================================ KROK 1 · ile jest danych
        {
            id: 'iop-suma-do-konca', krok: 1, level: 'latwe',
            title: 'Suma do końca danych',
            short: 'Liczb jest nie wiadomo ile — czytaj, dopóki się da. Wypisz, ile ich było i jaka jest ich suma.',
            tags: ['while (cin >> x)', 'koniec danych', 'long long'],
            statement: ['Termometr w szkolnej stacji pogodowej zapisuje pomiary, ale nikt nie zapisał, ile ich jest. Dostajesz wszystkie pomiary — liczby całkowite rozrzucone po wierszach: po kilka w wierszu, czasem po jednej, czasem z pustymi wierszami pomiędzy.',
                'Wypisz, ile było liczb, i ich sumę.'],
            input_format: ['Liczby całkowite oddzielone spacjami i znakami końca wiersza — aż do końca danych. Na początku nie ma liczby mówiącej, ile ich będzie.'],
            output_format: ['W pierwszym wierszu — ile było liczb.', 'W drugim wierszu — ich suma.'],
            constraints: ['Liczb jest od 1 do 10 000.', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '12 -3 7\n\n100\n5 5', note: 'Sześć liczb: 12 − 3 + 7 + 100 + 5 + 5 = 126. Pusty wiersz niczego nie zmienia — cin >> i tak go przeskoczy.' }],
            hint: R`Nie wiesz, ile jest liczb, więc pętla for z n odpada. Pętla while (cin >> x) wczytuje kolejną liczbę i sama się zatrzyma, gdy danych zabraknie. Licz w niej, ile razy się obróciła, i dodawaj x do sumy. Sumę trzymaj w long long — 10 000 liczb po miliard to 10¹³.`,
            tests: (r) => [
                '42', '-1000000000', rozrzuc(r, losy(r, 12, -50, 50)), rozrzuc(r, losy(r, 300, -1000, 1000), 'kolumna'),
                rozrzuc(r, losy(r, 2000, -1000000, 1000000)), rozrzuc(r, Array(7000).fill(1000000000), 'wiersz'),
                rozrzuc(r, Array(7000).fill(-1000000000)), rozrzuc(r, losy(r, 7000, -1000000000, 1000000000)),
            ],
            check: (inp) => { const t = toks(inp); if (t.length < 1 || t.length > 10000) return 'ile'; return wszystkieCalk(t, -1e9, 1e9) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); return `${t.length}\n${t.reduce((a, b) => a + b, 0)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x, suma = 0;
    int ile = 0;
    while (cin >> x) {
        ile++;
        suma += x;
    }
    cout << ile << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-do-zera', krok: 1, level: 'latwe',
            title: 'Aż do zera',
            short: 'Dane kończą się zerem, a za nim stoją jeszcze stare liczby. Policz zakupy przed zerem i ich sumę.',
            tags: ['wartość kończąca', 'cin >> x && x != 0', 'reszta danych zostaje'],
            statement: ['Kasjerka wbija kwoty kolejnych zakupów (w złotych, liczby całkowite dodatnie), a na koniec dnia wbija 0. Kasa ma jednak pamięć z poprzednich dni: za zerem w danych stoją jeszcze inne liczby — ale one już nie należą do dzisiejszego dnia.',
                'Wypisz, ile zakupów było dzisiaj (czyli przed pierwszym zerem) i ile wyniosła ich suma.'],
            input_format: ['Liczby całkowite oddzielone białymi znakami. W pewnym miejscu stoi 0 — to koniec dzisiejszych danych. Za zerem mogą być jeszcze inne liczby (także zera), których nie wolno liczyć.'],
            output_format: ['Jeden wiersz: liczba zakupów przed pierwszym zerem i ich suma.'],
            constraints: ['Przed pierwszym zerem jest od 0 do 10 000 liczb, każda od 1 do 100 000.', 'Za pierwszym zerem jest najwyżej 1000 liczb, każda od 0 do 100 000.'],
            examples: [{ input: '12 30 7\n5 0 99 14 0 3', note: 'Dziś były 4 zakupy: 12 + 30 + 7 + 5 = 54. Liczby 99, 14, 0 i 3 stoją za zerem — to stare dane.' }],
            hint: R`Warunek pętli robi dwie rzeczy po kolei: while (cin >> x && x != 0). Najpierw wczytuje, potem sprawdza, czy to nie zero. Po wyjściu z pętli po prostu nie czytaj dalej — to, co zostało na wejściu, programowi nie przeszkadza.`,
            tests: (r) => {
                const t = (przed, po) => [...przed, 0, ...po].join(' ');
                return ['0', '0 5 7 0', '100000 0', t(losy(r, 20, 1, 100), losy(r, 5, 0, 9)), rozrzuc(r, [...losy(r, 500, 1, 1000), 0, ...losy(r, 300, 0, 3)]),
                    rozrzuc(r, [...losy(r, 3000, 1, 100000), 0, ...losy(r, 1000, 0, 100000)]), rozrzuc(r, [...Array(9000).fill(100000), 0, 0, 0, 7]),
                    t(losy(r, 10000, 1, 9), [])];
            },
            check: (inp) => {
                const t = toks(inp); if (!wszystkieCalk(t, 0, 100000)) return 'zakres';
                const z = t.indexOf('0'); if (z < 0) return 'brak zera';
                return z <= 10000 && t.length - z - 1 <= 1000 ? null : 'ile';
            },
            solve: (inp) => { const t = nums(inp); const z = t.indexOf(0); const a = t.slice(0, z); return `${a.length} ${a.reduce((p, q) => p + q, 0)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x, suma = 0;
    int ile = 0;
    while (cin >> x && x != 0) {
        ile++;
        suma += x;
    }
    cout << ile << " " << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-goscie-koniec', krok: 1, level: 'latwe',
            title: 'Lista gości do słowa KONIEC',
            short: 'Wczytuj imiona, aż trafisz na KONIEC. Wypisz gości od ostatniego do pierwszego.',
            tags: ['while (cin >> s && s != "KONIEC")', 'vector<string>', 'od końca'],
            statement: ['Przy wejściu na urodziny każdy gość wpisuje swoje imię do zeszytu. Na końcu listy ktoś napisał KONIEC, a pod spodem są jeszcze bazgroły, które do listy nie należą.',
                'Wypisz liczbę gości, a potem ich imiona w odwrotnej kolejności — od tego, który przyszedł ostatni, do pierwszego. Uwaga: KONIEC to dokładnie to słowo, wielkimi literami. Imię Koniec albo słowo KONIECZNY to zwykłe wpisy.'],
            input_format: ['Słowa oddzielone białymi znakami. W pewnym miejscu stoi słowo KONIEC. Za nim mogą być jeszcze inne słowa — trzeba je pominąć.'],
            output_format: ['W pierwszym wierszu liczba gości k.', 'W następnych k wierszach imiona od ostatniego do pierwszego.'],
            constraints: ['Przed pierwszym słowem KONIEC jest od 1 do 1000 słów.', 'Każde słowo ma od 1 do 15 liter alfabetu angielskiego.'],
            examples: [{ input: 'Ola Bartek\nZuzia Kuba KONIEC xyz Ala', note: 'Gości jest czworo. Od końca: Kuba, Zuzia, Bartek, Ola. Słowa xyz i Ala stoją za KONIEC — nie liczymy ich.' }],
            hint: R`Zbieraj imiona do vector<string> w pętli while (cin >> s && s != "KONIEC"). Porównanie napisów przez != sprawdza całe słowo i wielkość liter, więc Koniec i KONIECZNY przejdą jako zwykłe imiona. Na koniec wypisz size(), a potem vector od ostatniego elementu do pierwszego.`,
            tests: (r) => {
                const lista = (n, po) => rozrzuc(r, [...Array.from({ length: n }, () => r.pick(IMIONA)), 'KONIEC', ...po]);
                return ['Ala KONIEC', lista(1, ['KONIEC', 'KONIEC']), 'Koniec KONIECZNY koniec KONIEC Ala', lista(10, ['Zosia', 'Kuba']),
                    lista(200, Array.from({ length: 50 }, () => r.pick(IMIONA))), lista(1000, []), lista(999, ['KONIEC', 'Bartek'])];
            },
            check: (inp) => {
                const t = toks(inp); const k = t.indexOf('KONIEC'); if (k < 1 || k > 1000) return 'KONIEC';
                return t.every((w) => /^[A-Za-z]{1,15}$/.test(w)) ? null : 'słowa';
            },
            solve: (inp) => { const t = toks(inp); const g = t.slice(0, t.indexOf('KONIEC')); return [g.length, ...g.reverse()].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<string> goscie;
    string s;
    while (cin >> s && s != "KONIEC") goscie.push_back(s);
    cout << goscie.size() << "\n";
    for (int i = (int)goscie.size() - 1; i >= 0; i--) cout << goscie[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-koszyk-pary', krok: 1, level: 'latwe',
            title: 'Koszyk w sklepie',
            short: 'Pary „cena ilość” aż do końca danych. Ile pozycji, ile sztuk i ile do zapłaty — w złotych z groszami.',
            tags: ['while (cin >> a >> b)', 'grosze', 'setw i setfill'],
            statement: ['Kasa samoobsługowa zapisuje każdą pozycję z koszyka jako dwie liczby: cenę jednej sztuki w groszach i liczbę sztuk. Nie wiadomo, ile będzie pozycji.',
                'Wypisz, ile pozycji było na paragonie, ile sztuk towaru łącznie i ile trzeba zapłacić — w złotych, z dokładnie dwiema cyframi groszy po kropce.'],
            input_format: ['Pary liczb całkowitych: cena w groszach i liczba sztuk — aż do końca danych. Liczby z jednej pary mogą stać w różnych wierszach.'],
            output_format: ['Trzy wiersze: Pozycje: p, Sztuki: s oraz Do zaplaty: Z.GG — Z to złote, GG to grosze zawsze zapisane dwiema cyframi.'],
            constraints: ['Pozycji jest od 1 do 5000.', '1 ≤ cena ≤ 100 000 (groszy)', '1 ≤ liczba sztuk ≤ 100'],
            examples: [{ input: '250 4\n1999 1\n5 10', note: 'Trzy pozycje, 4 + 1 + 10 = 15 sztuk. Do zapłaty 250 · 4 + 1999 · 1 + 5 · 10 = 3049 groszy, czyli 30.49 zł.' }],
            hint: R`while (cin >> cena >> ile) czyta całą parę — warunek jest prawdziwy tylko wtedy, gdy udało się wczytać obie liczby. Kwotę licz w groszach w long long. Na końcu wypisz suma / 100, kropkę i suma % 100 — ale grosze z setfill('0') i setw(2), żeby 5 groszy wyszło jako 05.`,
            tests: (r) => {
                const pary = (n, cMax) => rozrzuc(r, Array.from({ length: n }, () => [r.int(1, cMax), r.int(1, 100)]).flat());
                return ['100 1', '1 1', '5 1 5 1', pary(5, 300), '99999 100\n1 1', pary(200, 100000), pary(5000, 100000), rozrzuc(r, Array(5000).fill('100000 100'), 'kolumna')];
            },
            check: (inp) => {
                const t = nums(inp); if (t.length % 2 || t.length < 2 || t.length > 10000) return 'pary';
                for (let i = 0; i < t.length; i += 2) if (!calk(t[i], 1, 100000) || !calk(t[i + 1], 1, 100)) return 'zakres';
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); let szt = 0, gr = 0;
                for (let i = 0; i < t.length; i += 2) { szt += t[i + 1]; gr += t[i] * t[i + 1]; }
                return `Pozycje: ${t.length / 2}\nSztuki: ${szt}\nDo zaplaty: ${P.zlote(gr)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long cena, ile, suma = 0, sztuki = 0;
    int pozycje = 0;
    while (cin >> cena >> ile) {
        pozycje++;
        sztuki += ile;
        suma += cena * ile;
    }
    cout << "Pozycje: " << pozycje << "\n";
    cout << "Sztuki: " << sztuki << "\n";
    cout << "Do zaplaty: " << suma / 100 << "." << setfill('0') << setw(2) << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-punkty-zero-zero', krok: 1, level: 'srednie',
            title: 'Punkty do pary 0 0',
            short: 'Punkty kończą się parą 0 0 — ale punkt (0, 5) jeszcze nie jest końcem. Znajdź najdalszy od lądowiska.',
            tags: ['para kończąca', 'x == 0 && y == 0', 'odległość |x| + |y|'],
            statement: ['Dron zapisuje miejsca lądowań jako punkty (x, y) na mapie miasta. Koniec zapisu oznacza para 0 0. Uwaga: punkt, w którym tylko jedna współrzędna jest zerem — na przykład (0, 5) albo (−3, 0) — to zwykłe lądowanie na osi, a nie koniec danych.',
                'Wypisz, ile było lądowań, i to, które było najdalej od lądowiska (0, 0), licząc odległość jak po ulicach: |x| + |y|. Gdy kilka lądowań jest równie daleko — wypisz pierwsze z nich.'],
            input_format: ['Pary liczb całkowitych x y, aż do pary 0 0. Za parą 0 0 nic już nie ma.'],
            output_format: ['W pierwszym wierszu liczba lądowań (para 0 0 nie jest lądowaniem).', 'W drugim wierszu najdalsze lądowanie i jego odległość: x y d.'],
            constraints: ['Lądowań jest od 1 do 5000.', '−10⁶ ≤ x, y ≤ 10⁶', 'Żadne lądowanie nie jest punktem (0, 0).'],
            examples: [{ input: '1 2\n0 5\n-7 0\n2 -5\n0 0', note: 'Odległości: 3, 5, 7 i 7. Najdalej są (−7, 0) i (2, −5) — wygrywa wcześniejsze. Punkty (0, 5) i (−7, 0) leżą na osiach, ale nie kończą danych.' }],
            hint: R`Koniec to x == 0 && y == 0 — oba zera naraz. Wygodnie: while (cin >> x >> y && !(x == 0 && y == 0)) { … }. Gdybyś napisał x == 0 || y == 0, program zakończyłby się na pierwszym punkcie leżącym na osi. Odległość liczy abs(x) + abs(y); nowy rekord tylko przy ostrej nierówności >, żeby przy remisie zostało pierwsze.`,
            tests: (r) => {
                const pkt = () => { let x, y; do { x = r.int(-1000000, 1000000); y = r.int(-1000000, 1000000); if (r() < 0.25) { if (r() < 0.5) x = 0; else y = 0; } } while (x === 0 && y === 0); return [x, y]; };
                const dane = (lst) => rozrzuc(r, [...lst.flat(), 0, 0]);
                return [dane([[0, -1]]), dane([[3, 0], [0, 3], [-3, 0], [0, -3]]), dane([[5, 5], [0, 7], [1000000, 0], [-1000000, 1]]),
                    dane(Array.from({ length: 30 }, () => [r.int(-5, 5), r.int(-5, 5)]).filter(([x, y]) => x || y)),
                    dane(Array.from({ length: 2000 }, pkt)), dane(Array.from({ length: 5000 }, pkt)),
                    dane([...Array.from({ length: 4998 }, () => [0, r.int(1, 9)]), [-1000000, -1000000], [1000000, 1000000]])];
            },
            check: (inp) => {
                const t = nums(inp); if (t.length % 2 || !t.every((x) => calk(x, -1e6, 1e6))) return 'zakres';
                const n = t.length / 2 - 1; if (n < 1 || n > 5000 || t[2 * n] !== 0 || t[2 * n + 1] !== 0) return 'koniec';
                for (let i = 0; i < n; i++) if (t[2 * i] === 0 && t[2 * i + 1] === 0) return '0 0 w środku';
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const n = t.length / 2 - 1; let b = 0;
                const d = (i) => Math.abs(t[2 * i]) + Math.abs(t[2 * i + 1]);
                for (let i = 1; i < n; i++) if (d(i) > d(b)) b = i;
                return `${n}\n${t[2 * b]} ${t[2 * b + 1]} ${d(b)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int x, y, ile = 0, bx = 0, by = 0, bd = -1;
    while (cin >> x >> y && !(x == 0 && y == 0)) {
        ile++;
        int d = abs(x) + abs(y);
        if (d > bd) {
            bd = d;
            bx = x;
            by = y;
        }
    }
    cout << ile << "\n" << bx << " " << by << " " << bd << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-ostatnie-dwie', krok: 1, level: 'srednie',
            title: 'Ostatnie dwie liczby',
            short: 'Czytaj do końca danych, a potem wypisz przedostatnią i ostatnią liczbę. Bez tablicy — wystarczą dwie zmienne.',
            tags: ['koniec danych', 'przesuwanie zmiennych', 'bez tablicy'],
            statement: ['Licznik na bramce stadionu wysyła kolejne odczyty, a nas interesują tylko dwa ostatnie: przedostatni i ostatni — oraz łączna liczba odczytów.',
                'Spróbuj rozwiązać to bez zapisywania wszystkich liczb: wystarczy pamiętać ostatnią i przedostatnią.'],
            input_format: ['Liczby całkowite aż do końca danych (co najmniej dwie).'],
            output_format: ['W pierwszym wierszu — ile było liczb.', 'W drugim wierszu — przedostatnia i ostatnia liczba, oddzielone spacją.'],
            constraints: ['Liczb jest od 2 do 10 000.', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5 8 13\n21 34', note: 'Pięć liczb; przedostatnia to 21, ostatnia — 34.' }],
            hint: R`Trzymaj dwie zmienne: przedost i ost. Po wczytaniu nowej liczby x najpierw przesuń: przedost = ost, a dopiero potem ost = x — w odwrotnej kolejności zgubisz starą wartość ost. Pętla while (cin >> x) skończy się sama; nieudane, ostatnie wczytanie nie wejdzie do środka pętli.`,
            tests: (r) => ['1 2', '-5\n-5', '7 7 7 7 8', rozrzuc(r, losy(r, 15, -100, 100)), rozrzuc(r, losy(r, 1000, -1000000000, 1000000000), 'kolumna'),
                rozrzuc(r, losy(r, 7000, -1000000000, 1000000000)), rozrzuc(r, [...losy(r, 3000, 0, 9), -1000000000, 1000000000])],
            check: (inp) => { const t = toks(inp); if (t.length < 2 || t.length > 10000) return 'ile'; return wszystkieCalk(t, -1e9, 1e9) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp); return `${t.length}\n${t[t.length - 2]} ${t[t.length - 1]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x, ost = 0, przedost = 0;
    int ile = 0;
    while (cin >> x) {
        przedost = ost;
        ost = x;
        ile++;
    }
    cout << ile << "\n" << przedost << " " << ost << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-liczby-i-slowo', krok: 1, level: 'srednie',
            title: 'Liczby, a potem hasło',
            short: 'Najpierw liczby, potem jedno słowo. cin >> x potknie się o literę — napraw strumień przez cin.clear() i przeczytaj słowo.',
            tags: ['strumień w stanie błędu', 'cin.clear()', 'słowo po liczbach'],
            statement: ['Szyfrant wysyła wiadomość: najpierw kilka liczb całkowitych, a na końcu jedno słowo — hasło. Nie wiadomo, ile będzie liczb.',
                'Wypisz sumę liczb, a w drugim wierszu hasło zapisane od tyłu.'],
            input_format: ['Liczby całkowite, a po nich jedno słowo złożone z liter alfabetu angielskiego. Wszystko oddzielone białymi znakami.'],
            output_format: ['W pierwszym wierszu suma liczb.', 'W drugim wierszu hasło od tyłu.'],
            constraints: ['Liczb jest od 1 do 10 000, każda od −10⁹ do 10⁹.', 'Hasło ma od 1 do 20 liter.'],
            examples: [{ input: '10 20\n-5 7 sezam', note: 'Suma 10 + 20 − 5 + 7 = 32. Hasło sezam od tyłu to mazes.' }],
            hint: R`Pętla while (cin >> x) zatrzyma się na pierwszej literze: wczytanie liczby się nie uda, a strumień przejdzie w stan błędu — od tej chwili każde kolejne cin >> nic nie zrobi. Litera jednak zostaje na taśmie. Wywołaj cin.clear(), żeby „naprawić” strumień, i dopiero wtedy cin >> haslo. Odwracanie: reverse(haslo.begin(), haslo.end()).`,
            tests: (r) => {
                const haslo = () => { const w = r.pick(SLOWA.filter((x) => x.length > 2)); return r() < 0.5 ? w : w[0].toUpperCase() + w.slice(1); };
                return ['5 a', '-1000000000 Zz', '1 2 3 kot', rozrzuc(r, [...losy(r, 20, -100, 100), haslo()]), rozrzuc(r, [...losy(r, 500, -1000000, 1000000), 'abcdefghijklmnopqrst']),
                    rozrzuc(r, [...losy(r, 7000, -1000000000, 1000000000), haslo()]), rozrzuc(r, [...Array(7000).fill(1000000000), 'KONIEC'])];
            },
            check: (inp) => {
                const t = toks(inp); const w = t.pop(); if (!/^[A-Za-z]{1,20}$/.test(w)) return 'hasło';
                if (t.length < 1 || t.length > 10000) return 'ile'; return wszystkieCalk(t, -1e9, 1e9) ? null : 'zakres';
            },
            solve: (inp) => { const t = toks(inp); const w = t.pop(); return `${t.map(Number).reduce((a, b) => a + b, 0)}\n${[...w].reverse().join('')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x, suma = 0;
    while (cin >> x) suma += x;
    cin.clear();
    string haslo;
    cin >> haslo;
    reverse(haslo.begin(), haslo.end());
    cout << suma << "\n" << haslo << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-trzy-formaty', krok: 1, level: 'srednie',
            title: 'Trzy formaty w jednym wejściu',
            short: 'Trzy części danych: z liczbą n na początku, z zerem na końcu i do końca danych. Każda część ma swoją sumę.',
            tags: ['n na początku', 'wartość kończąca', 'do końca danych'],
            statement: ['Trzy czujniki wysłały pomiary jednym ciągiem, każdy w innym formacie:',
                'czujnik A — najpierw liczba n, a po niej n pomiarów;',
                'czujnik B — pomiary różne od zera, a po nich 0 (zero nie jest pomiarem);',
                'czujnik C — pomiary aż do końca danych (może ich nie być wcale).',
                'Wypisz sumę pomiarów każdego czujnika.'],
            input_format: ['Najpierw n, a po nim n liczb (czujnik A). Dalej liczby różne od zera zakończone zerem (czujnik B). Dalej liczby aż do końca danych (czujnik C). Wszystko oddzielone białymi znakami.'],
            output_format: ['Trzy wiersze: A: suma, B: suma, C: suma (suma pustej części to 0).'],
            constraints: ['0 ≤ n ≤ 3000; czujnik B ma od 0 do 3000 pomiarów, czujnik C — od 0 do 3000.', 'Każdy pomiar to liczba całkowita od −10⁶ do 10⁶; pomiary czujnika A i C mogą być zerami, pomiary czujnika B — nie.'],
            examples: [{ input: '3\n5 0 -2\n7 7 0\n1 2 3', note: 'A: 5 + 0 − 2 = 3 (zero należy do A, bo A ma podaną liczbę pomiarów). B: 7 + 7 = 14. C: 1 + 2 + 3 = 6.' }],
            hint: R`Trzy pętle po kolei, każda w swoim stylu: for z n, potem while (cin >> x && x != 0), potem while (cin >> x). Każda pętla zaczyna czytać dokładnie tam, gdzie skończyła poprzednia — taśma się nie cofa. Ostatnia pętla po prostu się nie wykona, gdy czujnik C nic nie wysłał.`,
            tests: (r) => {
                const bez0 = (n) => losy(r, n, -1000000, 1000000).map((x) => x || 1);
                const d = (a, b, c) => rozrzuc(r, [a.length, ...a, ...b, 0, ...c]);
                return [d([], [], []), d([0, 0], [], [0]), d([], [5], []), d([7], [], [1, 2]), d(losy(r, 10, -9, 9), bez0(10), losy(r, 10, -9, 9)),
                    d(losy(r, 3000, -1000000, 1000000), bez0(3000), losy(r, 3000, -1000000, 1000000)), d(Array(3000).fill(0), bez0(3000), [])];
            },
            check: (inp) => {
                const t = nums(inp); if (!t.every((x) => calk(x, -1e6, 1e6))) return 'zakres';
                const n = t[0]; if (!calk(n, 0, 3000) || t.length < n + 2) return 'A';
                const z = t.indexOf(0, n + 1); if (z < 0 || z - n - 1 > 3000 || t.length - z - 1 > 3000) return 'B/C';
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0], z = t.indexOf(0, n + 1); const s = (a) => a.reduce((p, q) => p + q, 0);
                return `A: ${s(t.slice(1, n + 1))}\nB: ${s(t.slice(n + 1, z))}\nC: ${s(t.slice(z + 1))}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, x, a = 0, b = 0, c = 0;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> x;
        a += x;
    }
    while (cin >> x && x != 0) b += x;
    while (cin >> x) c += x;
    cout << "A: " << a << "\n" << "B: " << b << "\n" << "C: " << c << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · wiele testów
        {
            id: 'iop-testy-suma', krok: 2, level: 'latwe',
            title: 'Wiele testów: a + b',
            short: 'Pierwsza liczba mówi, ile jest testów. Dla każdego wypisz sumę dwóch ogromnych liczb w osobnym wierszu.',
            tags: ['int t; cin >> t;', 'while (t--)', 'long long'],
            statement: ['Najprostsze zadanie z wieloma testami. Na początku wejścia stoi liczba testów t. Każdy test to dwie liczby całkowite a i b. Dla każdego testu wypisz a + b — każdy wynik w osobnym wierszu, w kolejności testów.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby a i b.'],
            output_format: ['t wierszy — w każdym suma a + b dla kolejnego testu.'],
            constraints: ['1 ≤ t ≤ 1000', '−10¹⁸ ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n1 2\n-5 5\n1000000000000 1', note: 'Trzy testy, trzy wiersze wyniku. Liczby mogą mieć 19 cyfr — dlatego long long (suma też się w nim mieści).' }],
            hint: R`Wczytaj t, a potem while (t--) { … } albo for (int i = 0; i < t; i++) { … }. W środku pętli wczytaj a i b i od razu wypisz a + b z "\n". Liczby są ogromne — long long.`,
            tests: (r) => {
                const big = () => r.big(-1000000000000000000n, 1000000000000000000n);
                const d = (pary) => `${pary.length}\n${pary.map(([a, b]) => `${a} ${b}`).join('\n')}`;
                return [d([[0, 0]]), d([[1000000000000000000n, 1000000000000000000n], [-1000000000000000000n, -1000000000000000000n]]),
                    d(Array.from({ length: 10 }, () => [r.int(-100, 100), r.int(-100, 100)])), d(Array.from({ length: 1000 }, () => [big(), big()])),
                    d(Array.from({ length: 1000 }, () => [r.int(-1000000000, 1000000000), r.int(-1000000000, 1000000000)]))];
            },
            check: (inp) => {
                const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1000) || t.length !== 2 * n + 1) return 't';
                return t.slice(1).every((x) => czyLiczba(x) && BigInt(x) >= -(10n ** 18n) && BigInt(x) <= 10n ** 18n) ? null : 'zakres';
            },
            solve: (inp) => { const t = toks(inp).slice(1).map(BigInt); const o = []; for (let i = 0; i < t.length; i += 2) o.push(String(t[i] + t[i + 1])); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        cout << a + b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-maks', krok: 2, level: 'latwe',
            title: 'Najlepszy wynik w każdym teście',
            short: 'W każdym teście n wyników. Wypisz najlepszy — i pamiętaj, żeby rekord zaczynał się od nowa w każdym teście.',
            tags: ['zmienne w środku pętli', 'reset co test', 'liczby ujemne'],
            statement: ['Klasa pisała t sprawdzianów. Dla każdego sprawdzianu dostajesz liczbę uczniów n i ich wyniki — wyniki mogą być ujemne, bo za ściąganie są punkty karne. Dla każdego sprawdzianu wypisz najlepszy wynik.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każdy test zajmuje dwa wiersze: liczba n, a w następnym wierszu n liczb całkowitych.'],
            output_format: ['t wierszy — największa liczba z każdego testu.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, suma wszystkich n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n4\n3 9 -2 7\n2\n-8 -3\n1\n5', note: 'W drugim teście wszystkie wyniki są ujemne — najlepszy to −3. Program, który nie zaczyna rekordu od nowa, wypisałby tu 9 (z poprzedniego testu), a program startujący od 0 — wypisałby 0.' }],
            hint: R`Zmienną z rekordem utwórz w środku pętli po testach — wtedy w każdym teście zaczyna od nowa. Startuj od pierwszej liczby testu albo od bardzo małej wartości (np. LLONG_MIN), ale nie od 0: wszystkie liczby mogą być ujemne.`,
            tests: (r) => {
                const d = (testy) => `${testy.length}\n${testy.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                return [d([[5]]), d([[-1, -2], [-3], [7, 7]]), d([[100, 50], [-100, -50], [0]]),
                    d(Array.from({ length: 50 }, () => losy(r, r.int(1, 10), -20, 20))), d(Array.from({ length: 1000 }, () => losy(r, r.int(1, 9), -1000000000, 1000000000))),
                    d([losy(r, 6000, -1000000000, -1), losy(r, 1000, 1, 1000000000)]), d(Array.from({ length: 1000 }, (_, i) => losy(r, 5, -1000000000, -1000000000 + i)))];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 1000)) return 't';
                let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = t[p]; if (!calk(n, 1, 10000)) return 'n'; s += n; p += n + 1; }
                if (p !== t.length || s > 10000) return 'długość'; return t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'zakres';
            },
            solve: (inp) => { const t = nums(inp); const o = []; let p = 1; for (let i = 0; i < t[0]; i++) { const n = t[p]; o.push(Math.max(...t.slice(p + 1, p + 1 + n))); p += n + 1; } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        long long najlepszy = LLONG_MIN;
        for (int i = 0; i < n; i++) {
            long long x;
            cin >> x;
            najlepszy = max(najlepszy, x);
        }
        cout << najlepszy << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-case', krok: 2, level: 'latwe',
            title: 'Case #k',
            short: 'Wynik każdego testu w formacie „Case #k: wynik”, jak na wielu zawodach. Numer testu liczysz sam.',
            tags: ['for (int k = 1; k <= t; k++)', 'format wyniku', 'numer testu'],
            statement: ['Na wielu zawodach programistycznych wynik każdego testu trzeba poprzedzić napisem Case #k:, gdzie k to numer testu liczony od 1.',
                'W każdym teście dostajesz słowo. Wypisz liczbę jego samogłosek (a, e, i, o, u, y) w formacie Case #k: liczba.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z następnych t wierszy jedno słowo z małych liter alfabetu angielskiego.'],
            output_format: ['t wierszy postaci Case #k: x — słowo Case z wielkiej litery, spacja, krzyżyk, numer testu, dwukropek, spacja i wynik.'],
            constraints: ['1 ≤ t ≤ 1500', 'Każde słowo ma od 1 do 40 liter.'],
            examples: [{ input: '3\nprogramowanie\nkrzyk\nolimpiada', note: 'programowanie ma 6 samogłosek (o, a, o, a, i, e), krzyk — jedną (y), olimpiada — 5.' }],
            hint: R`Pętla for (int k = 1; k <= t; k++) od razu daje numer testu. Wypisz: cout << "Case #" << k << ": " << wynik << "\n";. Najczęstsze błędy: brak spacji po dwukropku, numeracja od zera i „case” małą literą — sprawdzarka porównuje znak po znaku.`,
            tests: (r) => {
                const d = (w) => `${w.length}\n${w.join('\n')}`;
                return [d(['a']), d(['krzyk', 'bbb', 'aeiouy']), d(Array.from({ length: 30 }, () => r.word(r.int(1, 12)))),
                    d(Array.from({ length: 1500 }, () => r.word(r.int(1, 40)))), d(Array.from({ length: 1500 }, () => r.word(40, 'aeiouy')))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1500) || t.length !== n + 1) return 't'; return t.slice(1).every((w) => /^[a-z]{1,40}$/.test(w)) ? null : 'słowa'; },
            solve: (inp) => toks(inp).slice(1).map((w, i) => `Case #${i + 1}: ${[...w].filter((c) => 'aeiouy'.includes(c)).length}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 1; k <= t; k++) {
        string s;
        cin >> s;
        int ile = 0;
        for (char c : s)
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') ile++;
        cout << "Case #" << k << ": " << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-szukaj', krok: 2, level: 'srednie',
            title: 'Czy jest w tym teście?',
            short: 'W każdym teście szukasz liczby k. Znalazłeś wcześnie? I tak doczytaj resztę testu — inaczej następny test się rozjedzie.',
            tags: ['doczytaj cały test', 'break a wczytywanie', 'pierwsze wystąpienie'],
            statement: ['W każdym z t testów dostajesz liczbę k oraz n liczb. Wypisz pozycję (licząc od 1) pierwszego wystąpienia k wśród tych n liczb albo słowo BRAK, jeśli k się nie pojawia.',
                'Uwaga na pułapkę: gdy znajdziesz k, nie przerywaj wczytywania przez break. Pozostałe liczby tego testu wciąż stoją na taśmie i zostałyby przeczytane jako początek następnego testu.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: wiersz z liczbami n i k, a w następnym wierszu n liczb całkowitych.'],
            output_format: ['t wierszy: pozycja pierwszego wystąpienia albo BRAK.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, suma wszystkich n ≤ 10 000', 'k i wszystkie liczby: od −10⁶ do 10⁶'],
            examples: [{ input: '3\n5 7\n1 7 3 7 9\n3 4\n4 4 4\n2 6\n1 2', note: 'W pierwszym teście 7 stoi na pozycji 2 (i drugi raz na 4). Gdyby program przerwał czytanie po znalezieniu, liczby 3 7 9 zostałyby wzięte za n i k drugiego testu — i wszystko dalej by się pomieszało.' }],
            hint: R`Wczytuj zawsze wszystkie n liczb testu. Pozycję trzymaj w zmiennej ustawianej na start testu na -1 i zmieniaj ją tylko wtedy, gdy wciąż jest -1, a trafisz na k. Wynik (albo BRAK) wypisz dopiero po pętli wczytującej.`,
            tests: (r) => {
                const d = (testy) => `${testy.length}\n${testy.map(([k, a]) => `${a.length} ${k}\n${a.join(' ')}`).join('\n')}`;
                const test = (n, lo, hi) => { const a = losy(r, n, lo, hi); return [r() < 0.7 ? r.pick(a) : r.int(lo, hi), a]; };
                return [d([[3, [3]]]), d([[1, [1, 1, 1]], [2, [1, 2, 3]], [5, [9]]]), d(Array.from({ length: 40 }, () => test(r.int(1, 8), 0, 9))),
                    d(Array.from({ length: 1000 }, () => test(r.int(1, 10), -1000000, 1000000))), d([test(9000, -5, 5), ...Array.from({ length: 100 }, () => test(10, -3, 3))]),
                    d(Array.from({ length: 500 }, () => [7, [7, ...losy(r, 15, 0, 9)]]))];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 1000)) return 't';
                let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = t[p]; if (!calk(n, 1, 10000)) return 'n'; s += n; p += n + 2; }
                if (p !== t.length || s > 10000) return 'długość';
                p = 1; for (let i = 0; i < T; i++) { const n = t[p]; if (!t.slice(p + 1, p + 2 + n).every((x) => calk(x, -1e6, 1e6))) return 'zakres'; p += n + 2; }
                return null;
            },
            solve: (inp) => { const t = nums(inp); const o = []; let p = 1; for (let i = 0; i < t[0]; i++) { const n = t[p], k = t[p + 1]; const j = t.slice(p + 2, p + 2 + n).indexOf(k); o.push(j < 0 ? 'BRAK' : j + 1); p += n + 2; } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n, k;
        cin >> n >> k;
        int poz = -1;
        for (int i = 1; i <= n; i++) {
            int x;
            cin >> x;
            if (x == k && poz == -1) poz = i;
        }
        if (poz == -1) cout << "BRAK\n";
        else cout << poz << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-do-zera', krok: 2, level: 'srednie',
            title: 'Testy aż do zera',
            short: 'Liczba testów nie jest podana — test z n = 0 kończy dane. W każdym teście policz różne wartości.',
            tags: ['while (cin >> n && n != 0)', 'set w środku pętli', 'ile różnych'],
            statement: ['Tym razem nikt nie podał liczby testów. Każdy test zaczyna się od liczby n, po której stoi n liczb. Samo 0 w miejscu n oznacza koniec danych (nie jest testem).',
                'Dla każdego testu wypisz, ile różnych wartości jest wśród jego n liczb.'],
            input_format: ['Kolejne testy: liczba n, a po niej n liczb całkowitych. Na końcu stoi 0.'],
            output_format: ['Po jednym wierszu na test — liczba różnych wartości.'],
            constraints: ['Testów jest od 1 do 1000.', '1 ≤ n, suma wszystkich n ≤ 10 000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '4\n1 2 2 1\n3\n5 5 5\n5\n1 2 3 4 5\n0', note: 'Pierwszy test ma dwie różne wartości (1 i 2), drugi — jedną, trzeci — pięć. Zbiór z pierwszego testu nie może przetrwać do drugiego, bo drugi wyszedłby 3 zamiast 1.' }],
            hint: R`while (cin >> n && n != 0) { set<int> s; … } — zbiór utworzony w środku pętli jest pusty na początku każdego testu. Gdybyś utworzył go przed pętlą, liczby z poprzednich testów by w nim zostały (chyba że wywołasz s.clear()).`,
            tests: (r) => {
                const d = (testy) => `${testy.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}\n0`;
                return [d([[0]]), d([[1, 1], [1, 2], [2, 2, 2]]), d(Array.from({ length: 30 }, () => losy(r, r.int(1, 8), 0, 5))),
                    d(Array.from({ length: 1000 }, () => losy(r, r.int(1, 10), -1000000, 1000000))), d([losy(r, 9000, -50, 50), losy(r, 1000, -1000000, 1000000)]),
                    d(Array.from({ length: 200 }, (_, i) => Array(50).fill(i)))];
            },
            check: (inp) => {
                const t = nums(inp); if (t[t.length - 1] !== 0) return 'koniec';
                let p = 0, s = 0, T = 0; while (t[p] !== 0) { const n = t[p]; if (!calk(n, 1, 10000)) return 'n'; s += n; T++; p += n + 1; if (p >= t.length) return 'długość'; }
                if (p !== t.length - 1 || s > 10000 || T > 1000 || T < 1) return 'długość';
                return t.every((x) => calk(x, -1e6, 1e6)) ? null : 'zakres';
            },
            solve: (inp) => { const t = nums(inp); const o = []; let p = 0; while (t[p] !== 0) { const n = t[p]; o.push(new Set(t.slice(p + 1, p + 1 + n)).size); p += n + 1; } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    while (cin >> n && n != 0) {
        set<int> s;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            s.insert(x);
        }
        cout << s.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-permutacja', krok: 2, level: 'srednie',
            title: 'Czy to permutacja?',
            short: 'W każdym teście sprawdź, czy n liczb to dokładnie 1, 2, …, n w jakiejś kolejności. Tablica „czy było” — nowa w każdym teście.',
            tags: ['vector<bool> w teście', 'czy było', 'TAK / NIE'],
            statement: ['Permutacja liczb od 1 do n to te liczby ustawione w dowolnej kolejności — każda dokładnie raz. Na przykład 3 1 2 jest permutacją, a 3 1 1 i 1 2 4 nie są.',
                'W każdym z t testów sprawdź, czy podane n liczb tworzy permutację liczb od 1 do n.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: liczba n, a w następnym wierszu n liczb całkowitych.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, suma wszystkich n ≤ 15 000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n3\n3 1 2\n3\n3 1 1\n3\n1 2 4\n1\n1', note: 'Drugi test ma dwie jedynki i brak dwójki, trzeci — liczbę 4, która jest większa niż n = 3.' }],
            hint: R`W każdym teście utwórz vector<bool> bylo(n + 1, false) i flagę ok = true. Dla każdej liczby x: jeśli x > n albo bylo[x] — ok = false (ale czytaj dalej!), inaczej bylo[x] = true. Zanim sięgniesz do bylo[x], sprawdź x > n — inaczej wyjdziesz poza vector.`,
            tests: (r) => {
                const d = (testy) => `${testy.length}\n${testy.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                const zepsuj = (a) => { const b = a.slice(); const i = r.int(0, b.length - 1); const p = r(); b[i] = p < 0.4 ? b[r.int(0, b.length - 1)] : p < 0.7 ? b.length + r.int(1, 5) : r.int(1000000, 1000000000); return b; };
                const los = (n) => (r() < 0.5 ? perm(n) : zepsuj(perm(n)));
                return [d([[1]]), d([[2], [1, 1], [2, 1], [1000000000]]), d(Array.from({ length: 60 }, () => los(r.int(1, 6)))),
                    d(Array.from({ length: 1000 }, () => los(r.int(1, 14)))), d([perm(10000), zepsuj(perm(4000))]), d([[...perm(4999), 4999]])];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 1000)) return 't';
                let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = t[p]; if (!calk(n, 1, 15000)) return 'n'; s += n; p += n + 1; }
                if (p !== t.length || s > 15000) return 'długość'; return t.every((x) => calk(x, 1, 1e9)) ? null : 'zakres';
            },
            solve: (inp) => {
                const t = nums(inp); const o = []; let p = 1;
                for (let i = 0; i < t[0]; i++) { const n = t[p]; const a = t.slice(p + 1, p + 1 + n); const s = new Set(a); o.push(s.size === n && a.every((x) => x <= n) ? 'TAK' : 'NIE'); p += n + 1; }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<bool> bylo(n + 1, false);
        bool ok = true;
        for (int i = 0; i < n; i++) {
            long long x;
            cin >> x;
            if (x > n || bylo[x]) ok = false;
            else bylo[x] = true;
        }
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-pusty-wiersz', krok: 2, level: 'srednie',
            title: 'Pusty wiersz między testami',
            short: 'Wyniki testów oddziela pusty wiersz — ale nie przed pierwszym i nie po ostatnim. Słowa każdego testu alfabetycznie.',
            tags: ['separator między testami', 'if (k > 1)', 'sort'],
            statement: ['W każdym z t testów dostajesz n słów. Wypisz je alfabetycznie, każde w osobnym wierszu.',
                'Wyniki kolejnych testów oddziel jednym pustym wierszem. Przed pierwszym testem i po ostatnim nie ma pustego wiersza.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: liczba n, a w następnym wierszu n słów z małych liter.'],
            output_format: ['Słowa każdego testu alfabetycznie, po jednym w wierszu; między wynikami testów jeden pusty wiersz.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n, suma wszystkich n ≤ 2000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '2\n3\nkot ala pies\n2\nzebra antylopa', note: 'Pusty wiersz stoi tylko między ostatnim słowem pierwszego testu a pierwszym słowem drugiego.' }],
            hint: R`Pusty wiersz najłatwiej wypisać na początku każdego testu oprócz pierwszego: if (k > 1) cout << "\n";. To prostsze niż pilnowanie, który test jest ostatni. Słowa wczytaj do vector<string> i posortuj przez sort.`,
            tests: (r) => {
                const d = (testy) => `${testy.length}\n${testy.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                const sl = (n) => Array.from({ length: n }, () => (r() < 0.5 ? r.pick(SLOWA.filter((w) => w.length <= 10)) : r.word(r.int(1, 10))));
                return [d([['a']]), d([['b', 'a'], ['c'], ['b', 'b']]), d(Array.from({ length: 20 }, () => sl(r.int(1, 6)))),
                    d(Array.from({ length: 100 }, () => sl(20))), d([sl(1900), ...Array.from({ length: 99 }, () => sl(1))])];
            },
            check: (inp) => {
                const t = toks(inp); const T = Number(t[0]); if (!calk(T, 1, 100)) return 't';
                let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = Number(t[p]); if (!calk(n, 1, 2000)) return 'n'; if (!t.slice(p + 1, p + 1 + n).every((w) => /^[a-z]{1,10}$/.test(w))) return 'słowa'; s += n; p += n + 1; }
                return p === t.length && s <= 2000 ? null : 'długość';
            },
            solve: (inp) => {
                const t = toks(inp); const o = []; let p = 1;
                for (let i = 0; i < Number(t[0]); i++) { const n = Number(t[p]); const a = t.slice(p + 1, p + 1 + n).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)); if (i) o.push(''); o.push(...a); p += n + 1; }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 1; k <= t; k++) {
        int n;
        cin >> n;
        vector<string> w(n);
        for (auto &s : w) cin >> s;
        sort(w.begin(), w.end());
        if (k > 1) cout << "\n";
        for (auto &s : w) cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-testy-najczestsza', krok: 2, level: 'trudne',
            title: 'Najczęstsza w każdym teście',
            short: 'Tysiące krótkich testów, liczby do 10 milionów. Licz w globalnej tablicy — ale czyść tylko to, czego test użył.',
            tags: ['globalna tablica liczników', 'czyść tylko użyte', 'złożoność'],
            statement: ['W każdym z t testów dostajesz n liczb od 1 do 10 000 000. Wypisz liczbę, która występuje w teście najczęściej, a gdy kilka występuje równie często — najmniejszą z nich.',
                'Testów jest bardzo dużo, ale są krótkie. Tablica liczników int ile[10000001] to dobry pomysł — tylko nie zeruj jej całej przed każdym testem: 3000 testów razy 10 milionów pudełek to 30 miliardów operacji. Wyzeruj tylko te pudełka, których test naprawdę użył.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: liczba n, a w następnym wierszu n liczb.'],
            output_format: ['t wierszy — najczęstsza liczba każdego testu.'],
            constraints: ['1 ≤ t ≤ 3000', '1 ≤ n, suma wszystkich n ≤ 9000', '1 ≤ każda liczba ≤ 10⁷'],
            examples: [{ input: '3\n5\n7 3 7 3 9\n1\n10000000\n3\n2 2 5', note: 'W pierwszym teście 7 i 3 występują po dwa razy — wygrywa mniejsza, 3.' }],
            hint: R`Globalna tablica int ile[10000001] ma na start same zera. W teście: wczytaj liczby do vectora, zwiększ ile[x] dla każdej i znajdź najlepszą. Na koniec testu przejdź vector jeszcze raz i ustaw ile[x] = 0. Czyszczenie kosztuje tyle, ile liczb ma test — a nie 10 milionów. (Inny dobry sposób: posortuj liczby testu i policz serie równych.)`,
            time_limit: '1 s',
            tests: (r) => {
                const d = (testy) => `${testy.length}\n${testy.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                return [d([[1]]), d([[5, 5, 1], [10000000, 1, 10000000], [4, 3, 2, 1]]), d(Array.from({ length: 40 }, () => losy(r, r.int(1, 7), 1, 4))),
                    d(Array.from({ length: 3000 }, () => losy(r, r.int(1, 3), 1, 10000000))), d(Array.from({ length: 3000 }, () => losy(r, 3, 9999990, 10000000))),
                    d([losy(r, 6000, 1, 30), ...Array.from({ length: 2999 }, () => [r.int(1, 10000000)])])];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 3000)) return 't';
                let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = t[p]; if (!calk(n, 1, 9000)) return 'n'; s += n; p += n + 1; }
                if (p !== t.length || s > 9000) return 'długość';
                p = 1; for (let i = 0; i < T; i++) { const n = t[p]; if (!t.slice(p + 1, p + 1 + n).every((x) => calk(x, 1, 1e7))) return 'zakres'; p += n + 1; }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const o = []; let p = 1;
                for (let i = 0; i < t[0]; i++) {
                    const n = t[p]; const m = new Map(); for (const x of t.slice(p + 1, p + 1 + n)) m.set(x, (m.get(x) || 0) + 1);
                    let b = 0, bc = 0; for (const [x, c] of m) if (c > bc || (c === bc && x < b)) { b = x; bc = c; }
                    o.push(b); p += n + 1;
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int ile[10000001];
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<int> a(n);
        for (int &x : a) {
            cin >> x;
            ile[x]++;
        }
        int best = 0;
        for (int x : a)
            if (best == 0 || ile[x] > ile[best] || (ile[x] == ile[best] && x < best)) best = x;
        cout << best << "\n";
        for (int x : a) ile[x] = 0;
    }
    return 0;
}`,
        },
        // ================================================================ KROK 3 · wypisywanie z głową
        {
            id: 'iop-przecinki', krok: 3, level: 'latwe',
            title: 'Lista po przecinku',
            short: 'Wypisz liczby oddzielone przecinkiem i spacją — bez przecinka na końcu.',
            tags: ['separator', 'if (i > 0)', 'bez końcowego przecinka'],
            statement: ['Wypisz n liczb w jednym wierszu, oddzielając je przecinkiem i spacją — tak jak pisze się wyliczankę na kartce: 3, 1, 4. Po ostatniej liczbie nie ma przecinka.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: liczby rozdzielone przecinkiem i spacją.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '4\n3 1 4 1', note: 'Między czterema liczbami są trzy separatory.' }],
            hint: R`Przed każdą liczbą oprócz pierwszej wypisz ", ": if (i > 0) cout << ", "; cout << x;. Separator stoi między liczbami, więc jest go o jeden mniej niż liczb. Sprawdzarka wybacza spację na końcu wiersza, ale przecinka — już nie.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([7]), d([-1, -1]), d(losy(r, 10, -9, 9)), d(losy(r, 300, -1000000, 1000000)), d(losy(r, 2000, -1000000, 1000000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).join(', '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (i > 0) cout << ", ";
        cout << x;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-nawiasy-lista', krok: 3, level: 'latwe',
            title: 'Lista w nawiasach kwadratowych',
            short: 'Wypisz liczby od końca w formacie [7, -2, 10]. Pusta lista to [].',
            tags: ['format [a, b, c]', 'pusta lista', 'od końca'],
            statement: ['Wypisz n liczb w formacie listy: nawias kwadratowy, liczby rozdzielone przecinkiem i spacją, nawias zamykający — na przykład [3, 1, 4]. Gdy liczb nie ma (n = 0), wypisz [].',
                'Liczby wypisz w odwrotnej kolejności niż na wejściu.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych (gdy n = 0, drugiego wiersza nie ma).'],
            output_format: ['Jeden wiersz z listą.'],
            constraints: ['0 ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3\n10 -2 7', note: 'Od końca: 7, −2, 10.' }],
            hint: R`Wczytaj liczby do vectora. Wypisz "[", potem liczby od ostatniej do pierwszej z ", " przed każdą oprócz pierwszej wypisanej, a na końcu "]". Ten sam kod zadziała dla n = 0 — pętla się nie wykona i zostanie [].`,
            tests: (r) => {
                const d = (a) => (a.length ? `${a.length}\n${a.join(' ')}` : '0');
                return [d([]), d([5]), d([1, 2]), d(losy(r, 10, -9, 9)), d(losy(r, 2000, -1000000, 1000000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 0, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => `[${nums(inp).slice(1).reverse().join(', ')}]`,
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int &x : v) cin >> x;
    cout << "[";
    for (int i = n - 1; i >= 0; i--) {
        if (i < n - 1) cout << ", ";
        cout << v[i];
    }
    cout << "]\n";
    return 0;
}`,
        },
        {
            id: 'iop-po-k-w-wierszu', krok: 3, level: 'latwe',
            title: 'Po k w wierszu',
            short: 'Rozłóż n liczb na wiersze po k sztuk. Ostatni wiersz może być krótszy.',
            tags: ['(i + 1) % k == 0', 'koniec wiersza', 'ostatni wiersz'],
            statement: ['Drukarka paragonów mieści w wierszu tylko k liczb. Wypisz n liczb po k w wierszu, oddzielone spacjami, w kolejności z wejścia. Ostatni wiersz może mieć mniej niż k liczb.'],
            input_format: ['W pierwszym wierszu n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Liczby po k w wierszu.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ k ≤ 2000', 'Każda liczba: od 0 do 10⁶.'],
            examples: [{ input: '7 3\n1 2 3 4 5 6 7', note: 'Dwa pełne wiersze po trzy liczby i jeden krótszy.' }],
            hint: R`Po wypisaniu liczby o indeksie i (licząc od zera) sprawdź, czy (i + 1) % k == 0 — wtedy zakończ wiersz, a w przeciwnym razie wypisz spację. Gdy n nie dzieli się przez k, ostatni wiersz jest niepełny — po pętli dopisz jeszcze "\n".`,
            tests: (r) => {
                const d = (k, a) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d(1, [5]), d(5, [1, 2, 3]), d(1, losy(r, 6, 0, 9)), d(3, losy(r, 9, 0, 99)), d(4, losy(r, 10, 0, 99)), d(7, losy(r, 500, 0, 1000000)),
                    d(2000, losy(r, 2000, 0, 1000000)), d(13, losy(r, 2000, 0, 1000000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && calk(t[1], 1, 2000) && t.length === t[0] + 2 && t.slice(2).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[1], a = t.slice(2); const o = []; for (let i = 0; i < a.length; i += k) o.push(a.slice(i, i + k).join(' ')); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        cout << x;
        if ((i + 1) % k == 0) cout << "\n";
        else cout << " ";
    }
    if (n % k != 0) cout << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-separator-tysiecy', krok: 3, level: 'srednie',
            title: 'Spacje co trzy cyfry',
            short: 'Duże liczby czyta się łatwiej z odstępami: 1 234 567. Wstaw spację co trzy cyfry, licząc od prawej.',
            tags: ['liczba jako napis', 'grupy od prawej', 'minus'],
            statement: ['W Polsce duże liczby zapisuje się z odstępami co trzy cyfry, licząc od prawej strony: 1 234 567, a nie 1234567. Dostajesz n liczb całkowitych (także ujemnych). Wypisz każdą w osobnym wierszu, z odstępami.'],
            input_format: ['W pierwszym wierszu n.', 'W następnych n wierszach po jednej liczbie.'],
            output_format: ['n wierszy z liczbami zapisanymi z odstępami.'],
            constraints: ['1 ≤ n ≤ 1000', '−10¹⁸ ≤ każda liczba ≤ 10¹⁸ (bez zer na początku)'],
            examples: [{ input: '4\n1234567\n-1000\n999\n1000000000000000000', note: 'Liczba 999 ma tylko jedną grupę — bez odstępów. Minus nie jest cyfrą, więc nie liczy się do grup.' }],
            hint: R`Wczytaj liczbę do string. Jeśli zaczyna się od minusa, wypisz go i usuń z napisu. Potem idź po cyfrach od lewej: przed cyfrą o indeksie i wstaw spację, gdy i > 0 i (dlugosc − i) % 3 == 0 — czyli gdy na prawo od niej zostało dokładnie trzy, sześć, dziewięć… cyfr.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const los = () => { const k = r.int(1, 19); let s = String(r.int(1, 9)); for (let i = 1; i < k; i++) s += r.int(0, 9); if (s.length === 19) s = '1000000000000000000'; return (r() < 0.3 ? '-' : '') + s; };
                return [d(['0']), d(['1', '-1', '12', '123', '1234', '-12345', '123456', '-1234567']), d(['1000000000000000000', '-1000000000000000000', '100', '-100000']),
                    d(Array.from({ length: 50 }, los)), d(Array.from({ length: 1000 }, los))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => /^(0|-?[1-9]\d*)$/.test(x) && BigInt(x) <= 10n ** 18n && BigInt(x) >= -(10n ** 18n)) ? null : 'zakres'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { const m = s[0] === '-' ? '-' : ''; const c = s.replace('-', ''); let o = ''; for (let i = 0; i < c.length; i++) { if (i > 0 && (c.length - i) % 3 === 0) o += ' '; o += c[i]; } return m + o; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string s;
        cin >> s;
        if (s[0] == '-') {
            cout << "-";
            s = s.substr(1);
        }
        int d = s.size();
        for (int i = 0; i < d; i++) {
            if (i > 0 && (d - i) % 3 == 0) cout << " ";
            cout << s[i];
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-kolumna-do-prawej', krok: 3, level: 'srednie',
            title: 'Kolumna dosunięta do prawej',
            short: 'Liczby jedna pod drugą tak, żeby ostatnie cyfry stały równo. Szerokość kolumny = długość najdłuższej liczby.',
            tags: ['setw(w)', 'szerokość z danych', 'to_string'],
            statement: ['Księgowy chce mieć kwoty w równej kolumnie: jedności pod jednościami, dziesiątki pod dziesiątkami. Wypisz n liczb, każdą w osobnym wierszu, dosuniętych do prawej. Szerokość kolumny to długość najdłuższej liczby (minus też jest znakiem).'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n wierszy — liczby dosunięte do prawej w kolumnie o szerokości najdłuższej z nich.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n7 -120 35 1000', note: 'Najdłuższe są −120 i 1000 — po cztery znaki. Każda liczba dostaje pole szerokości 4 i jest dosunięta do prawej.' }],
            hint: R`Najpierw wczytaj wszystkie liczby do vectora i znajdź najdłuższą: w = max(w, (int)to_string(x).size()). Dopiero potem wypisuj: cout << setw(w) << x << "\n"; — szerokość w setw może być zmienną.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([1, 10, 100, 1000]), d([-1, 1, -10]), d(losy(r, 20, -999, 999)), d(losy(r, 1000, -1000000000, 1000000000)), d([...losy(r, 999, 0, 99), -1000000000])];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = toks(inp).slice(1); const w = Math.max(...a.map((s) => s.length)); return a.map((s) => s.padStart(w)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    int w = 0;
    for (auto &x : v) {
        cin >> x;
        w = max(w, (int)to_string(x).size());
    }
    for (auto x : v) cout << setw(w) << x << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-tabliczka-rowna', krok: 3, level: 'srednie',
            title: 'Równa tabliczka mnożenia',
            short: 'Tabliczka n × n, w której wszystkie kolumny mają tę samą szerokość: tyle znaków, ile cyfr ma n · n, plus jeden.',
            tags: ['setw', 'pętla w pętli', 'szerokość z n · n'],
            statement: ['Wypisz tabliczkę mnożenia n × n: w wierszu i, w kolumnie j stoi iloczyn i · j. Każda liczba zajmuje pole o szerokości w + 1, gdzie w to liczba cyfr największego iloczynu n · n, i jest w nim dosunięta do prawej. Pierwsze pole wiersza też ma szerokość w + 1.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['n wierszy tabliczki.'],
            constraints: ['1 ≤ n ≤ 40'],
            examples: [{ input: '4', note: 'Największy iloczyn to 16 — dwie cyfry, więc każde pole ma 3 znaki.' }],
            hint: R`Policz w = to_string(n * n).size(). W pętli w pętli wypisuj cout << setw(w + 1) << i * j;, a po każdym wierszu "\n". setw działa tylko na najbliższą wartość, więc stoi przed każdym iloczynem.`,
            tests: () => ['1', '2', '3', '4', '9', '10', '31', '32', '40'],
            check: (inp) => (calk(Number(inp), 1, 40) ? null : 'n'),
            solve: (inp) => { const n = Number(inp); const w = String(n * n).length; const o = []; for (let i = 1; i <= n; i++) { let s = ''; for (let j = 1; j <= n; j++) s += String(i * j).padStart(w + 1); o.push(s); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = to_string(n * n).size();
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) cout << setw(w + 1) << i * j;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-spis-tresci', krok: 3, level: 'srednie',
            title: 'Spis treści z kropkami',
            short: 'Tytuł z lewej, numer strony z prawej, kropki pomiędzy — każdy wiersz ma dokładnie W znaków.',
            tags: ['setfill(\'.\')', 'left', 'string(k, \'.\')'],
            statement: ['Wypisz spis treści książki. Każdy wiersz ma mieć dokładnie W znaków: tytuł rozdziału przy lewej krawędzi, numer strony przy prawej, a całe miejsce pomiędzy wypełniają kropki.',
                'Tytuły są pojedynczymi słowami (zamiast spacji mają podkreślnik _).'],
            input_format: ['W pierwszym wierszu n i W.', 'W każdym z następnych n wierszy tytuł i numer strony.'],
            output_format: ['n wierszy po dokładnie W znaków.'],
            constraints: ['1 ≤ n ≤ 200', '10 ≤ W ≤ 60', 'Tytuł ma od 1 do 30 znaków (litery, cyfry, _), numer strony — od 1 do 999.', 'Zawsze zmieści się co najmniej jedna kropka: długość tytułu + liczba cyfr numeru < W.'],
            examples: [{ input: '3 20\nWstep 1\nPetle 15\nTablice_2D 103', note: 'Wstep ma 5 znaków, numer 1 — jeden, więc kropek jest 20 − 5 − 1 = 14.' }],
            hint: R`Najprościej: cout << tytul << string(W - tytul.size() - to_string(strona).size(), '.') << strona << "\n";. To samo da się zrobić manipulatorami: cout << left << setfill('.') << setw(W - liczba_cyfr) << tytul << strona — pole o szerokości W minus cyfry numeru, wypełnione kropkami z prawej strony tytułu.`,
            tests: (r) => {
                const tyt = () => (r() < 0.5 ? r.pick(['Wstep', 'Zmienne', 'Petla_for', 'Petla_while', 'Tablice', 'Napisy', 'Zbiory', 'Sortowanie', 'Pary', 'Wektor', 'Funkcje', 'Rekurencja', 'Struktury', 'Mapy', 'Zakonczenie', 'Dodatek_A']) : r.word(r.int(1, 30)));
                const d = (W, a) => `${a.length} ${W}\n${a.map(([t, p]) => `${t} ${p}`).join('\n')}`;
                const los = (W, n) => Array.from({ length: n }, () => { let t, p; do { t = tyt(); p = r.int(1, 999); } while (t.length + String(p).length >= W); return [t, p]; });
                return [d(10, [['a', 1]]), d(10, [['Wstep', 999], ['abcdefgh', 1]]), d(20, los(20, 8)), d(60, los(60, 200)), d(35, los(35, 120)),
                    d(60, [['abcdefghijklmnopqrstuvwxyz1234', 999]])];
            },
            check: (inp) => {
                const L = inp.split('\n'); const [n, W] = L[0].split(' ').map(Number); if (!calk(n, 1, 200) || !calk(W, 10, 60) || L.length !== n + 1) return 'nagłówek';
                for (const l of L.slice(1)) { const [t, p] = l.split(' '); if (!/^\w{1,30}$/.test(t) || !calk(Number(p), 1, 999) || t.length + p.length >= W) return 'wiersz'; }
                return null;
            },
            solve: (inp) => { const L = inp.split('\n'); const W = Number(L[0].split(' ')[1]); return L.slice(1).map((l) => { const [t, p] = l.split(' '); return t + '.'.repeat(W - t.length - p.length) + p; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, W;
    cin >> n >> W;
    for (int i = 0; i < n; i++) {
        string tytul;
        int strona;
        cin >> tytul >> strona;
        int kropki = W - tytul.size() - to_string(strona).size();
        cout << tytul << string(kropki, '.') << strona << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-tabela-z-ramka', krok: 3, level: 'trudne',
            title: 'Tabela z ramką',
            short: 'Tabela wyników z ramką z +, - i |. Szerokość każdej kolumny zależy od najdłuższego wpisu — trzeba ją najpierw policzyć.',
            tags: ['szerokości kolumn', 'left i right', 'string(k, \'-\')'],
            statement: ['Wypisz tabelę wyników zawodów z ramką. Tabela ma cztery kolumny o nagłówkach Imie, Zad1, Zad2 i Suma. W kolumnie Suma jest suma punktów za oba zadania.',
                'Szerokość kolumny to długość najdłuższego wpisu w tej kolumnie — wliczając nagłówek. Każda komórka ma z lewej i z prawej po jednej spacji odstępu od kreski. Imiona i wszystkie nagłówki są dosunięte do lewej, liczby — do prawej.',
                'Ramka: linia pozioma składa się z plusów na skrzyżowaniach i z myślników nad komórkami (szerokość kolumny + 2); pionowe kreski | oddzielają komórki. Linia pozioma stoi nad nagłówkiem, pod nagłówkiem i pod ostatnim wierszem. Zawodnicy są w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: imię (jedno słowo) i dwie liczby — punkty za zadania.'],
            output_format: ['Tabela z ramką — n + 4 wiersze (dokładnie jak w przykładzie).'],
            constraints: ['1 ≤ n ≤ 100', 'Imię ma od 1 do 20 liter.', '0 ≤ punkty ≤ 100 000'],
            examples: [{ input: '3\nOla 100 85\nBartek 7 120\nZuzanna 0 0', note: 'Najdłuższe imię, Zuzanna, ma 7 liter — kolumna Imie ma szerokość 7, a jej linia pozioma 9 myślników. W pozostałych kolumnach najdłuższe są nagłówki (4 znaki).' }],
            hint: R`Najpierw wczytaj wszystko i policz szerokości: w = max(długość nagłówka, najdłuższy wpis w kolumnie) — długość liczby to to_string(x).size(). Linia pozioma: "+", a potem dla każdej kolumny string(w + 2, '-') + "+". Wiersz: "| " + wpis + " | " + … — wpis wypisz przez left << setw(w) (imiona, nagłówki) albo right << setw(w) (liczby).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([i, x, y]) => `${i} ${x} ${y}`).join('\n')}`;
                const imie = () => (r() < 0.7 ? r.pick(IMIONA) : r.word(r.int(1, 20)));
                return [d([['A', 0, 0]]), d([['Al', 100000, 100000]]), d([['Maksymilian', 5, 12], ['Jo', 99999, 1]]),
                    d(Array.from({ length: 10 }, () => [imie(), r.int(0, 100), r.int(0, 100)])), d(Array.from({ length: 100 }, () => [imie(), r.int(0, 100000), r.int(0, 100000)])),
                    d([['abcdefghijklmnopqrst', 1, 2], ['x', 3, 4]])];
            },
            check: (inp) => {
                const L = inp.split('\n'); const n = Number(L[0]); if (!calk(n, 1, 100) || L.length !== n + 1) return 'n';
                for (const l of L.slice(1)) { const [i, x, y] = l.split(' '); if (!/^[A-Za-z]{1,20}$/.test(i) || !calk(Number(x), 0, 100000) || !calk(Number(y), 0, 100000)) return 'wiersz'; }
                return null;
            },
            solve: (inp) => {
                const L = inp.split('\n').slice(1).map((l) => { const [i, x, y] = l.split(' '); return [i, x, y, String(Number(x) + Number(y))]; });
                const nag = ['Imie', 'Zad1', 'Zad2', 'Suma'];
                const w = nag.map((h0, k) => Math.max(h0.length, ...L.map((row) => row[k].length)));
                const linia = '+' + w.map((x) => '-'.repeat(x + 2) + '+').join('');
                const wiersz = (row, liczby) => '|' + row.map((c, k) => ' ' + (liczby && k > 0 ? c.padStart(w[k]) : c.padEnd(w[k])) + ' |').join('');
                return [linia, wiersz(nag, false), linia, ...L.map((row) => wiersz(row, true)), linia].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> imie(n);
    vector<long long> a(n), b(n);
    for (int i = 0; i < n; i++) cin >> imie[i] >> a[i] >> b[i];
    int w[4] = {4, 4, 4, 4};
    for (int i = 0; i < n; i++) {
        w[0] = max(w[0], (int)imie[i].size());
        w[1] = max(w[1], (int)to_string(a[i]).size());
        w[2] = max(w[2], (int)to_string(b[i]).size());
        w[3] = max(w[3], (int)to_string(a[i] + b[i]).size());
    }
    string linia = "+";
    for (int k = 0; k < 4; k++) linia += string(w[k] + 2, '-') + "+";
    cout << linia << "\n";
    cout << "| " << left << setw(w[0]) << "Imie" << " | " << setw(w[1]) << "Zad1" << " | "
         << setw(w[2]) << "Zad2" << " | " << setw(w[3]) << "Suma" << " |\n";
    cout << linia << "\n";
    for (int i = 0; i < n; i++) {
        cout << "| " << left << setw(w[0]) << imie[i] << " | " << right << setw(w[1]) << a[i] << " | "
             << setw(w[2]) << b[i] << " | " << setw(w[3]) << a[i] + b[i] << " |\n";
    }
    cout << linia << "\n";
    return 0;
}`,
        },
    ];
};
