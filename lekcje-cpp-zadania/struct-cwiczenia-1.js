// Struct — ćwiczenia w trakcie lekcji, części 1–3: pierwsza struktura (deklaracja, pola, kropka, cin i cout pole po polu,
// inicjalizacja klamrami), kopiowanie i porównywanie (przypisanie całego rekordu, najlepszy rekord w pętli, swap, porównywanie
// pole po polu) oraz vector struktur (v[i].pole, push_back, pętla z &, kilka przejść, wyszukiwanie po polu, zmiany w miejscu).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./struct-pomoc');
    const { IMIONA, NAZWISKA, PRODUKTY, MIASTA, calk, zlote, pad2, hhmm, dataTxt, losData, unikalneImiona, unikalneSlowa, slowo } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const imie = (r) => r.pick(IMIONA);
    const czyImie = (s, max) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const czyMale = (s, max) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const zl = (g) => zlote(g, '.');
    const porownajDaty = (a, b) => (a[2] - b[2]) || (a[1] - b[1]) || (a[0] - b[0]);

    return [
        // ================================================================ KROK 1 · pierwsza struktura
        {
            id: 'st-legitymacja', krok: 1, level: 'latwe',
            title: 'Legitymacja szkolna',
            short: 'Imię, nazwisko, klasa i rok urodzenia w jednej zmiennej typu Uczen — a z niej wydrukowana legitymacja.',
            tags: ['struct', 'pola i kropka', 'cin do pól'],
            statement: ['Sekretariat drukuje legitymacje. Dane jednego ucznia to imię, nazwisko, klasa (np. 7b) i rok urodzenia.',
                'Zadeklaruj nad main strukturę struct Uczen z czterema polami: string imie, string nazwisko, string klasa i int rok. Wczytaj dane do jednej zmiennej tego typu i wypisz legitymację dokładnie w formacie z przykładu. W ostatnim wierszu jest wiek, który uczeń kończy w 2026 roku (2026 − rok urodzenia).'],
            input_format: ['Jeden wiersz: imię, nazwisko, klasa i rok urodzenia, oddzielone spacjami.'],
            output_format: ['Pięć wierszy: LEGITYMACJA SZKOLNA, potem Imie i nazwisko: …, Klasa: …, Rok urodzenia: … i Wiek w 2026: …'],
            constraints: ['Imię ma od 1 do 15 liter, nazwisko od 1 do 20 liter; obie nazwy zaczynają się wielką literą, reszta to małe litery.', 'Klasa to cyfra od 1 do 8 i mała litera od a do f.', '2005 ≤ rok ≤ 2020'],
            examples: [{ input: 'Ala Nowak 7b 2012', note: 'Wszystkie cztery dane siedzą w jednej zmiennej: u.imie, u.nazwisko, u.klasa i u.rok. Wiek: 2026 − 2012 = 14.' }],
            hint: R`struct Uczen { string imie; string nazwisko; string klasa; int rok; }; — pamiętaj o średniku po klamrze. W main: Uczen u; cin >> u.imie >> u.nazwisko >> u.klasa >> u.rok;. Wiek to 2026 - u.rok.`,
            tests: (r) => {
                const los = () => `${imie(r)} ${r.pick(NAZWISKA)} ${r.int(1, 8)}${r.pick(['a', 'b', 'c', 'd', 'e', 'f'])} ${r.int(2005, 2020)}`;
                return ['Bo Lis 1a 2020', 'Maksymilian Kozlowski 8f 2005', los(), los(), los(), los()];
            },
            check: (inp) => {
                const t = toks(inp);
                return t.length === 4 && czyImie(t[0], 15) && czyImie(t[1], 20) && /^[1-8][a-f]$/.test(t[2]) && calk(Number(t[3]), 2005, 2020) ? null : 'dane';
            },
            solve: (inp) => {
                const [im, na, kl, rok] = toks(inp);
                return ['LEGITYMACJA SZKOLNA', `Imie i nazwisko: ${im} ${na}`, `Klasa: ${kl}`, `Rok urodzenia: ${rok}`, `Wiek w 2026: ${2026 - Number(rok)}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie;
    string nazwisko;
    string klasa;
    int rok;
};
int main() {
    Uczen u;
    cin >> u.imie >> u.nazwisko >> u.klasa >> u.rok;
    cout << "LEGITYMACJA SZKOLNA\n";
    cout << "Imie i nazwisko: " << u.imie << " " << u.nazwisko << "\n";
    cout << "Klasa: " << u.klasa << "\n";
    cout << "Rok urodzenia: " << u.rok << "\n";
    cout << "Wiek w 2026: " << 2026 - u.rok << "\n";
    return 0;
}`,
        },
        {
            id: 'st-dwa-prostokaty', krok: 1, level: 'latwe',
            title: 'Dwie działki',
            short: 'Dwie prostokątne działki jako dwie zmienne typu Dzialka: pole, obwód i która jest większa. Pola są duże — long long.',
            tags: ['dwie zmienne jednego typu', 'long long w polu', 'porównanie pól'],
            statement: ['Pan Zenon wybiera między dwiema prostokątnymi działkami. Każdą opisują dwie liczby: szerokość i długość w metrach.',
                'Zadeklaruj strukturę struct Dzialka z polami szerokosc i dlugosc i utwórz dwie zmienne tego typu. Dla każdej działki wypisz pole i obwód, a na końcu napisz, która działka ma większe pole: pierwsza, druga albo rowne, jeśli pola są równe.'],
            input_format: ['W pierwszym wierszu szerokość i długość pierwszej działki, w drugim — drugiej.'],
            output_format: ['Trzy wiersze: pierwsza: pole P, obwod O, potem druga: pole P, obwod O, a na końcu wieksza: pierwsza / druga / rowne.'],
            constraints: ['1 ≤ szerokość, długość ≤ 100 000'],
            examples: [{ input: '3 4\n2 6', note: 'Pola są równe (12 m²), choć działki mają różne kształty — druga ma za to dłuższy obwód (16 m).' }],
            hint: R`Przy wymiarach 100 000 × 100 000 pole to 10¹⁰ — nie zmieści się w int. Zadeklaruj pola jako long long: struct Dzialka { long long szerokosc, dlugosc; };. Potem Dzialka a, b; cin >> a.szerokosc >> a.dlugosc >> b.szerokosc >> b.dlugosc;.`,
            tests: (r) => {
                const d = () => `${r.int(1, 100000)} ${r.int(1, 100000)}`;
                return ['1 1\n1 1', '100000 100000\n99999 100000', '5 8\n4 10', `${d()}\n${d()}`, `${r.int(1, 50)} ${r.int(1, 50)}\n${r.int(1, 50)} ${r.int(1, 50)}`, '7 3\n2 11', `${d()}\n${d()}`];
            },
            check: (inp) => { const t = nums(inp); return t.length === 4 && t.every((x) => calk(x, 1, 100000)) ? null : 'dane'; },
            solve: (inp) => {
                const [a, b, c, d] = nums(inp);
                const p1 = a * b, p2 = c * d;
                return [`pierwsza: pole ${p1}, obwod ${2 * (a + b)}`, `druga: pole ${p2}, obwod ${2 * (c + d)}`, `wieksza: ${p1 > p2 ? 'pierwsza' : p2 > p1 ? 'druga' : 'rowne'}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Dzialka {
    long long szerokosc, dlugosc;
};
int main() {
    Dzialka a, b;
    cin >> a.szerokosc >> a.dlugosc >> b.szerokosc >> b.dlugosc;
    long long poleA = a.szerokosc * a.dlugosc;
    long long poleB = b.szerokosc * b.dlugosc;
    cout << "pierwsza: pole " << poleA << ", obwod " << 2 * (a.szerokosc + a.dlugosc) << "\n";
    cout << "druga: pole " << poleB << ", obwod " << 2 * (b.szerokosc + b.dlugosc) << "\n";
    cout << "wieksza: ";
    if (poleA > poleB) cout << "pierwsza\n";
    else if (poleB > poleA) cout << "druga\n";
    else cout << "rowne\n";
    return 0;
}`,
        },
        {
            id: 'st-robot-krok-po-kroku', krok: 1, level: 'latwe',
            title: 'Robot krok po kroku',
            short: 'Pozycja robota to jedna zmienna Punkt. Każdy ruch zmienia jej pola x i y — wypisz pozycję po każdym ruchu i największe oddalenie.',
            tags: ['struct Punkt', 'zmiana pól w pętli', 'p.x += dx'],
            statement: ['Robot stoi w punkcie (0, 0). Dostaje n poleceń; każde to dwie liczby dx i dy — robot przesuwa się o dx w poziomie i o dy w pionie.',
                'Pozycję robota trzymaj w jednej zmiennej typu struct Punkt { int x, y; }. Po każdym ruchu wypisz jego pozycję. Na końcu wypisz, jak daleko od startu robot był najdalej — w odległości „taksówkowej” |x| + |y| (licząc wszystkie pozycje po ruchach).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy dwie liczby dx i dy.'],
            output_format: ['n wierszy z pozycją x y po kolejnych ruchach, a potem wiersz najdalej od startu: D.'],
            constraints: ['1 ≤ n ≤ 1000', '−1000 ≤ dx, dy ≤ 1000'],
            examples: [{ input: '4\n2 3\n-5 0\n1 -4\n2 1', note: 'Pozycje: (2, 3), (−3, 3), (−2, −1), (0, 0). Odległości od startu: 5, 6, 3 i 0 — najdalej było 6.' }],
            hint: R`Punkt p; p.x = 0; p.y = 0; (albo Punkt p = {0, 0};). W pętli: cin >> dx >> dy; p.x += dx; p.y += dy; cout << p.x << " " << p.y << "\n";. Odległość od startu to abs(p.x) + abs(p.y) — porównuj ją z dotychczasowym maksimum.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m)]);
                return [d([[0, 0]]), d([[-1000, -1000], [1000, 1000]]), d(los(10, 10)), d(los(1000, 1000)), d(Array.from({ length: 1000 }, () => [r.int(0, 1000), r.int(-3, 1000)])), d(los(50, 5))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === 1 + 2 * t[0] && t.slice(1).every((x) => calk(x, -1000, 1000)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp);
                let x = 0, y = 0, mx = 0;
                const o = [];
                for (let i = 0; i < t[0]; i++) {
                    x += t[1 + 2 * i]; y += t[2 + 2 * i];
                    o.push(`${x} ${y}`);
                    mx = Math.max(mx, Math.abs(x) + Math.abs(y));
                }
                o.push(`najdalej od startu: ${mx}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    int x, y;
};
int main() {
    int n;
    cin >> n;
    Punkt p = {0, 0};
    int najdalej = 0;
    for (int i = 0; i < n; i++) {
        int dx, dy;
        cin >> dx >> dy;
        p.x += dx;
        p.y += dy;
        cout << p.x << " " << p.y << "\n";
        najdalej = max(najdalej, abs(p.x) + abs(p.y));
    }
    cout << "najdalej od startu: " << najdalej << "\n";
    return 0;
}`,
        },
        {
            id: 'st-zegar', krok: 1, level: 'latwe',
            title: 'Zegar za k sekund',
            short: 'Godzina jako struktura z trzema polami. Ile pokaże zegar za k sekund i ile razy minie po drodze północ?',
            tags: ['struct Czas', 'modulo', 'setw i setfill'],
            statement: ['Zegar elektroniczny pokazuje godzinę, minutę i sekundę. Zadeklaruj strukturę struct Czas { int h, m, s; }, wczytaj do niej aktualny czas, a potem liczbę sekund k.',
                'Wypisz, co pokaże zegar za k sekund (zegar 24-godzinny, po 23:59:59 jest 00:00:00), w formacie HH:MM:SS — zawsze z dwiema cyframi. W drugim wierszu wypisz, ile razy w tym czasie zegar przeszedł przez północ.'],
            input_format: ['W pierwszym wierszu trzy liczby: godzina, minuta i sekunda.', 'W drugim wierszu k.'],
            output_format: ['Dwa wiersze: czas HH:MM:SS i przejsc przez polnoc: D.'],
            constraints: ['0 ≤ godzina ≤ 23, 0 ≤ minuta, sekunda ≤ 59', '0 ≤ k ≤ 10⁹'],
            examples: [{ input: '23 59 30\n45', note: '23:59:30 + 45 s = 00:00:15 następnego dnia — zegar raz przeszedł przez północ.' }],
            hint: R`Zamień czas na sekundy od północy: long long t = c.h * 3600 + c.m * 60 + c.s + k;. Doby: t / 86400. Reszta t % 86400 to nowy czas: c.h = reszta / 3600, c.m = reszta / 60 % 60, c.s = reszta % 60. Dwie cyfry: cout << setw(2) << setfill('0') << c.h (setw działa tylko na najbliższą liczbę — powtórz go przed każdą).`,
            tests: (r) => {
                const d = () => `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 59)}\n${r.int(0, 1000000000)}`;
                return ['0 0 0\n0', '23 59 59\n1', '12 0 0\n86400', '23 59 59\n1000000000', '5 7 9\n59', d(), d(), `${r.int(0, 23)} ${r.int(0, 59)} ${r.int(0, 59)}\n${r.int(0, 5000)}`];
            },
            check: (inp) => { const t = nums(inp); return t.length === 4 && calk(t[0], 0, 23) && calk(t[1], 0, 59) && calk(t[2], 0, 59) && calk(t[3], 0, 1e9) ? null : 'dane'; },
            solve: (inp) => {
                const [g, m, s, k] = nums(inp);
                const t = g * 3600 + m * 60 + s + k;
                const re = t % 86400;
                return `${pad2(Math.floor(re / 3600))}:${pad2(Math.floor(re / 60) % 60)}:${pad2(re % 60)}\nprzejsc przez polnoc: ${Math.floor(t / 86400)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Czas {
    int h, m, s;
};
int main() {
    Czas c;
    long long k;
    cin >> c.h >> c.m >> c.s >> k;
    long long t = c.h * 3600 + c.m * 60 + c.s + k;
    long long doby = t / 86400;
    long long reszta = t % 86400;
    c.h = reszta / 3600;
    c.m = reszta / 60 % 60;
    c.s = reszta % 60;
    cout << setfill('0') << setw(2) << c.h << ":" << setw(2) << c.m << ":" << setw(2) << c.s << "\n";
    cout << "przejsc przez polnoc: " << doby << "\n";
    return 0;
}`,
        },
        {
            id: 'st-kto-starszy', krok: 1, level: 'latwe',
            title: 'Kto jest starszy?',
            short: 'Dwie osoby z datami urodzenia. Porównujesz pole po polu: najpierw rok, potem miesiąc, a na końcu dzień.',
            tags: ['porównywanie pole po polu', 'data jako struktura', 'if / else if'],
            statement: ['Dane osoby to imię i data urodzenia: dzień, miesiąc i rok. Zadeklaruj strukturę struct Osoba { string imie; int d, m, r; } i wczytaj dwie osoby.',
                'Wypisz imię osoby starszej, czyli urodzonej wcześniej. Jeśli obie urodziły się tego samego dnia, wypisz rowiesnicy. Pamiętaj, że o tym, kto jest starszy, decyduje najpierw rok; gdy lata są równe — miesiąc; gdy także miesiące są równe — dzień.'],
            input_format: ['Dwa wiersze; w każdym imię, dzień, miesiąc i rok urodzenia.'],
            output_format: ['Imię starszej osoby albo słowo rowiesnicy.'],
            constraints: ['Imiona są różne, mają od 1 do 15 liter i zaczynają się wielką literą.', 'Daty są poprawne, lata od 1950 do 2020.'],
            examples: [{ input: 'Ola 12 5 2011\nKuba 30 1 2011', note: 'Ten sam rok, więc decyduje miesiąc: styczeń jest wcześniej niż maj — starszy jest Kuba.' }],
            hint: R`Najpierw porównaj a.r z b.r. Jeśli są różne, starszy jest ten z mniejszym rokiem. Jeśli równe — porównaj a.m z b.m, a jeśli i te są równe — a.d z b.d. Gdy wszystkie trzy pola są równe: rowiesnicy.`,
            tests: (r) => {
                const [a, b] = unikalneImiona(r, 2);
                const d = (x, y) => `${a} ${x.join(' ')}\n${b} ${y.join(' ')}`;
                const t = [];
                t.push(d([1, 1, 2000], [1, 1, 2000]));
                t.push(d([31, 12, 2005], [1, 1, 2006]));
                t.push(d([15, 6, 1999], [14, 6, 1999]));
                t.push(d([3, 2, 2010], [3, 9, 2010]));
                const x = losData(r, 1950, 2020);
                t.push(d(x, [x[0], x[1], x[2]]));
                t.push(d(losData(r, 1950, 2020), losData(r, 1950, 2020)));
                const y = losData(r, 2000, 2000); t.push(d(y, losData(r, 2000, 2000)));
                return t;
            },
            check: (inp) => {
                const L = linie(inp); if (L.length !== 2) return 'wiersze';
                const o = L.map((l) => l.split(' '));
                if (o[0][0] === o[1][0]) return 'imiona';
                return o.every((t) => t.length === 4 && czyImie(t[0], 15) && P.czyPoprawnaData(Number(t[1]), Number(t[2]), Number(t[3])) && calk(Number(t[3]), 1950, 2020)) ? null : 'dane';
            },
            solve: (inp) => {
                const o = linie(inp).map((l) => l.split(' '));
                const c = porownajDaty(o[0].slice(1).map(Number), o[1].slice(1).map(Number));
                return c < 0 ? o[0][0] : c > 0 ? o[1][0] : 'rowiesnicy';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Osoba {
    string imie;
    int d, m, r;
};
int main() {
    Osoba a, b;
    cin >> a.imie >> a.d >> a.m >> a.r;
    cin >> b.imie >> b.d >> b.m >> b.r;
    if (a.r != b.r) {
        if (a.r < b.r) cout << a.imie << "\n";
        else cout << b.imie << "\n";
    } else if (a.m != b.m) {
        if (a.m < b.m) cout << a.imie << "\n";
        else cout << b.imie << "\n";
    } else if (a.d != b.d) {
        if (a.d < b.d) cout << a.imie << "\n";
        else cout << b.imie << "\n";
    } else {
        cout << "rowiesnicy\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-porownaj-ulamki', krok: 1, level: 'latwe',
            title: 'Który ułamek większy?',
            short: 'Ułamek to struktura z licznikiem i mianownikiem. Porównujesz a/b i c/d bez dzielenia — mnożąc „na krzyż” w long long.',
            tags: ['struct Ulamek', 'mnożenie na krzyż', 'long long'],
            statement: ['Zadeklaruj strukturę struct Ulamek { long long l, m; } — licznik i mianownik. Dla każdej z t par ułamków a/b i c/d wypisz, który jest większy, wstawiając między nie znak <, > albo =.',
                'Nie dziel liczb: dla dodatnich mianowników a/b < c/d dokładnie wtedy, gdy a · d < c · b. Tak porównanie jest dokładne, a double mógłby się pomylić przy bardzo bliskich ułamkach. Ułamki wypisuj tak, jak je wczytano (bez skracania).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy cztery liczby a, b, c, d — ułamki a/b i c/d.'],
            output_format: ['t wierszy w formacie a/b ZNAK c/d.'],
            constraints: ['1 ≤ t ≤ 500', '−10⁹ ≤ a, c ≤ 10⁹', '1 ≤ b, d ≤ 10⁹'],
            examples: [{ input: '3\n1 2 2 4\n-3 7 -1 3\n999999999 1000000000 999999998 999999999', note: '1/2 = 2/4. −3/7 ≈ −0,4286 jest mniejsze niż −1/3. Ostatnie dwa ułamki różnią się dopiero na 18. miejscu po przecinku: 999999999 · 999999999 = 999999998000000001, a 999999998 · 1000000000 = 999999998000000000 — lewy jest większy.' }],
            hint: R`Ulamek x, y; cin >> x.l >> x.m >> y.l >> y.m;. Porównaj long long lewa = x.l * y.m, prawa = y.l * x.m;. Iloczyn sięga 10¹⁸ — mieści się w long long (do ok. 9,2 · 10¹⁸), ale nie w int.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (m) => [r.int(-m, m), r.int(1, m), r.int(-m, m), r.int(1, m)];
                const rowne = () => { const l = r.int(-1000, 1000), m = r.int(1, 1000), k = r.int(1, 1000), q = r.int(1, 1000); return [l * k, m * k, l * q, m * q]; };
                const blisko = () => { const b = r.int(500000000, 1000000000); return [b - 1, b, b, b + 1]; };
                return [d([[0, 5, 0, 1]]), d([[1000000000, 1, -1000000000, 1], [-1000000000, 1000000000, -1, 1], [7, 3, 7, 3]]),
                    d(Array.from({ length: 30 }, () => los(20))), d(Array.from({ length: 500 }, () => (r() < 0.3 ? rowne() : r() < 0.5 ? blisko() : los(1000000000)))),
                    d(Array.from({ length: 200 }, rowne))];
            },
            check: (inp) => {
                const t = nums(inp); if (!calk(t[0], 1, 500) || t.length !== 1 + 4 * t[0]) return 't';
                for (let i = 0; i < t[0]; i++) { const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i); if (!calk(a, -1e9, 1e9) || !calk(c, -1e9, 1e9) || !calk(b, 1, 1e9) || !calk(d, 1, 1e9)) return 'zakres'; }
                return null;
            },
            solve: (inp) => {
                const t = toks(inp); const o = [];
                for (let i = 0; i < Number(t[0]); i++) {
                    const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i);
                    const L = BigInt(a) * BigInt(d), Pr = BigInt(c) * BigInt(b);
                    o.push(`${a}/${b} ${L < Pr ? '<' : L > Pr ? '>' : '='} ${c}/${d}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Ulamek {
    long long l, m;
};
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        Ulamek x, y;
        cin >> x.l >> x.m >> y.l >> y.m;
        long long lewa = x.l * y.m;
        long long prawa = y.l * x.m;
        char znak = '=';
        if (lewa < prawa) znak = '<';
        if (lewa > prawa) znak = '>';
        cout << x.l << "/" << x.m << " " << znak << " " << y.l << "/" << y.m << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-paragon', krok: 1, level: 'latwe',
            title: 'Paragon ze sklepu',
            short: 'Każda pozycja paragonu to nazwa, cena i ilość — jedna zmienna Pozycja, wczytywana od nowa w każdym obrocie pętli.',
            tags: ['jedna zmienna w pętli', 'grosze jako int', 'format Z.GG'],
            statement: ['Kasa fiskalna drukuje paragon. Każda pozycja to nazwa produktu, cena za sztukę w groszach i liczba sztuk. Zadeklaruj strukturę struct Pozycja { string nazwa; int cena; int ilosc; }.',
                'Dla każdej pozycji wypisz wiersz nazwa: ilosc x CENA = WARTOSC, a na końcu SUMA: S. Kwoty wypisuj w złotych z dokładnie dwiema cyframi groszy, np. 1250 groszy to 12.50, a 7 groszy to 0.07.'],
            input_format: ['W pierwszym wierszu n — liczba pozycji.', 'W każdym z n kolejnych wierszy nazwa, cena w groszach i ilość.'],
            output_format: ['n wierszy z pozycjami i wiersz SUMA: S.'],
            constraints: ['1 ≤ n ≤ 500', 'Nazwa ma od 1 do 15 małych liter.', '1 ≤ cena ≤ 1 000 000, 1 ≤ ilość ≤ 1000'],
            examples: [{ input: '3\nmleko 349 2\nchleb 599 1\njajka 105 10', note: 'mleko: 2 × 3.49 = 6.98, chleb: 5.99, jajka: 10 × 1.05 = 10.50. Razem 23.47.' }],
            hint: R`Wartość pozycji to p.cena * p.ilosc — do 10⁹, a suma do 10¹² — trzymaj ją w long long. Kwotę w groszach g wypisz tak: cout << g / 100 << "." << setw(2) << setfill('0') << g % 100;. Najwygodniej zrobić z tego funkcję albo powtórzyć ten zapis trzy razy.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const poz = (mc, mi) => [r.pick(PRODUKTY), r.int(1, mc), r.int(1, mi)];
                return [d([['woda', 1, 1]]), d([['sejf', 1000000, 1000], ['guma', 5, 3], ['kawa', 100, 1]]), d(Array.from({ length: 8 }, () => poz(2000, 5))),
                    d(Array.from({ length: 500 }, () => poz(1000000, 1000))), d(Array.from({ length: 50 }, () => poz(99, 9)))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 500) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && czyMale(t[0], 15) && calk(Number(t[1]), 1, 1e6) && calk(Number(t[2]), 1, 1000); }) ? null : 'dane';
            },
            solve: (inp) => {
                let suma = 0; const o = [];
                for (const l of linie(inp).slice(1)) {
                    const [na, c, il] = l.split(' ');
                    const w = Number(c) * Number(il);
                    suma += w;
                    o.push(`${na}: ${il} x ${zl(Number(c))} = ${zl(w)}`);
                }
                o.push(`SUMA: ${zl(suma)}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pozycja {
    string nazwa;
    int cena;
    int ilosc;
};
void kwota(long long g) {
    cout << g / 100 << "." << setw(2) << setfill('0') << g % 100;
}
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        Pozycja p;
        cin >> p.nazwa >> p.cena >> p.ilosc;
        long long wartosc = 1LL * p.cena * p.ilosc;
        suma += wartosc;
        cout << p.nazwa << ": " << p.ilosc << " x ";
        kwota(p.cena);
        cout << " = ";
        kwota(wartosc);
        cout << "\n";
    }
    cout << "SUMA: ";
    kwota(suma);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'st-trojkat', krok: 1, level: 'srednie',
            title: 'Trójkąt z trzech punktów',
            short: 'Trzy zmienne typu Punkt. Ze wzoru na pole sprawdzasz, czy punkty leżą na prostej, a z iloczynów — czy jest kąt prosty.',
            tags: ['trzy zmienne Punkt', 'wzór na pole', 'kąt prosty'],
            statement: ['Dla każdego z t zestawów trzech punktów A, B, C (zapisanych w trzech zmiennych typu struct Punkt { long long x, y; }) sprawdź, jaki to trójkąt.',
                'Podwojone pole trójkąta liczy się ze wzoru 2P = |(xB − xA)·(yC − yA) − (xC − xA)·(yB − yA)|. Jeśli wychodzi 0, punkty leżą na jednej prostej — wypisz zdegenerowany. W przeciwnym razie wypisz podwojone pole i to, czy trójkąt ma kąt prosty. Kąt przy wierzchołku A jest prosty, gdy (xB − xA)·(xC − xA) + (yB − yA)·(yC − yA) = 0 — tak samo sprawdzasz kąty przy B i przy C.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy sześć liczb: xA yA xB yB xC yC.'],
            output_format: ['t wierszy: zdegenerowany albo podwojone pole P, prostokatny / podwojone pole P, nieprostokatny.'],
            constraints: ['1 ≤ t ≤ 500', '−10⁶ ≤ każda współrzędna ≤ 10⁶'],
            examples: [{ input: '3\n0 0 4 0 0 3\n1 1 2 2 5 5\n0 0 5 1 2 7', note: 'Pierwszy to trójkąt 3-4-5 z kątem prostym przy A (pole 6, podwojone 12). Drugi — trzy punkty na prostej y = x. Trzeci: 2P = |5 · 7 − 2 · 1| = 33, żaden kąt nie jest prosty.' }],
            hint: R`Różnice współrzędnych sięgają 2 · 10⁶, a iloczyny 4 · 10¹² — dlatego pola są long long. Zrób funkcję pomocniczą albo zapisz trzy warunki kąta prostego: przy A z wektorami AB i AC, przy B z BA i BC, przy C z CA i CB.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const M = 1000000;
                const los = (m) => [r.int(-m, m), r.int(-m, m), r.int(-m, m), r.int(-m, m), r.int(-m, m), r.int(-m, m)];
                const prosty = () => {
                    // kąt prosty przy jednym z wierzchołków: A + u i A + k·u' (u' ⟂ u), potem wierzchołki w losowej kolejności
                    for (;;) {
                        const ax = r.int(-1000, 1000), ay = r.int(-1000, 1000), p = r.int(-300, 300), q = r.int(-300, 300), k = r.int(-3, 3);
                        if ((p === 0 && q === 0) || k === 0) continue;
                        const pts = r.shuffle([[ax, ay], [ax + p, ay + q], [ax - q * k, ay + p * k]]);
                        return pts.flat();
                    }
                };
                const prosta = () => { const ax = r.int(-M / 2, M / 2), ay = r.int(-M / 2, M / 2), p = r.int(-1000, 1000), q = r.int(-1000, 1000), k = r.int(-200, 200); return r.shuffle([[ax, ay], [ax + p, ay + q], [ax + k * p, ay + k * q]]).flat(); };
                const prosta2 = () => { const ax = r.int(-1000, 1000), ay = r.int(-1000, 1000), p = r.int(-300, 300), q = r.int(-300, 300), k = r.int(-2, 2); return [ax, ay, ax + p, ay + q, ax + k * p, ay + k * q]; };
                return [d([[0, 0, 0, 0, 0, 0], [-M, -M, M, M, M, -M], [-M, -M, M, M, -M + 1, -M + 1]]), d(Array.from({ length: 12 }, () => (r() < 0.4 ? prosty() : r() < 0.5 ? prosta2() : los(20)))),
                    d(Array.from({ length: 500 }, () => { const p = r(); return p < 0.3 ? prosty() : p < 0.45 ? prosta2() : p < 0.5 ? prosta() : los(M); })), d(Array.from({ length: 200 }, prosty))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 500) && t.length === 1 + 6 * t[0] && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp).map(BigInt); const o = [];
                const sk = (a, b, c) => (b[0] - a[0]) * (c[0] - a[0]) + (b[1] - a[1]) * (c[1] - a[1]);
                for (let i = 0; i < Number(t[0]); i++) {
                    const v = t.slice(1 + 6 * i, 7 + 6 * i);
                    const A = [v[0], v[1]], Bp = [v[2], v[3]], C = [v[4], v[5]];
                    let p = (Bp[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (Bp[1] - A[1]);
                    if (p < 0n) p = -p;
                    if (p === 0n) { o.push('zdegenerowany'); continue; }
                    const pr = sk(A, Bp, C) === 0n || sk(Bp, A, C) === 0n || sk(C, A, Bp) === 0n;
                    o.push(`podwojone pole ${p}, ${pr ? 'prostokatny' : 'nieprostokatny'}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    long long x, y;
};
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        Punkt a, b, c;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y;
        long long pole = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
        if (pole < 0) pole = -pole;
        if (pole == 0) {
            cout << "zdegenerowany\n";
            continue;
        }
        bool przyA = (b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y) == 0;
        bool przyB = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y) == 0;
        bool przyC = (a.x - c.x) * (b.x - c.x) + (a.y - c.y) * (b.y - c.y) == 0;
        cout << "podwojone pole " << pole << ", ";
        if (przyA || przyB || przyC) cout << "prostokatny\n";
        else cout << "nieprostokatny\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 2 · kopiowanie i porównywanie
        {
            id: 'st-najlepszy-uczen', krok: 2, level: 'latwe',
            title: 'Najlepszy w klasie',
            short: 'Uczniowie przychodzą po kolei. Trzymasz najlepszego w zmiennej typu Uczen i kopiujesz do niej cały rekord naraz.',
            tags: ['najlepszy rekord', 'przypisanie kopiuje wszystkie pola', 'remisy'],
            statement: ['Nauczycielka wpisuje wyniki sprawdzianu: imię ucznia i liczbę punktów. Znajdź najlepszego ucznia — jeśli kilku ma ten sam najwyższy wynik, najlepszy jest ten, który był wpisany najwcześniej.',
                'Trzymaj najlepszego w jednej zmiennej Uczen najlepszy i gdy trafisz na lepszego, przepisz go w całości: najlepszy = u;. Policz też, ilu uczniów ma dokładnie tyle punktów co najlepszy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i liczba punktów.'],
            output_format: ['Dwa wiersze: najlepszy: IMIE PUNKTY i z takim samym wynikiem: K (K liczy także samego najlepszego).'],
            constraints: ['1 ≤ n ≤ 5000', 'Imię ma od 1 do 15 liter (pierwsza wielka); imiona mogą się powtarzać.', '0 ≤ punkty ≤ 100'],
            examples: [{ input: '5\nOla 82\nKuba 97\nZosia 64\nIga 97\nAdam 97', note: 'Najwyższy wynik to 97 — ma go trzech uczniów, a najlepszy jest Kuba, bo był wpisany pierwszy.' }],
            hint: R`Uczen najlepszy; cin >> najlepszy.imie >> najlepszy.punkty; int ile = 1; — potem pętla po pozostałych n − 1 uczniach: wczytaj Uczen u; jeśli u.punkty > najlepszy.punkty, to najlepszy = u; ile = 1;, a jeśli równe — ile++. Przy remisie nie podmieniaj (znak >, nie >=).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => Array.from({ length: n }, () => [imie(r), r.int(lo, hi)]);
                const t = [d([['Ala', 0]]), d([['Ola', 50], ['Ela', 50], ['Iga', 50]]), d(Array.from({ length: 20 }, (_, i) => [imie(r), i * 5])), d(los(12, 40, 60)), d(los(5000, 0, 100)), d(los(3000, 0, 9))];
                const k = los(100, 0, 98); k.push(['Zuzanna', 99]); t.push(d(k));
                return t;
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 5000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 2 && czyImie(t[0], 15) && calk(Number(t[1]), 0, 100); }) ? null : 'dane';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => l.split(' '));
                let b = u[0], ile = 1;
                for (const x of u.slice(1)) {
                    if (Number(x[1]) > Number(b[1])) { b = x; ile = 1; } else if (Number(x[1]) === Number(b[1])) ile++;
                }
                return `najlepszy: ${b[0]} ${b[1]}\nz takim samym wynikiem: ${ile}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie;
    int punkty;
};
int main() {
    int n;
    cin >> n;
    Uczen najlepszy;
    cin >> najlepszy.imie >> najlepszy.punkty;
    int ile = 1;
    for (int i = 1; i < n; i++) {
        Uczen u;
        cin >> u.imie >> u.punkty;
        if (u.punkty > najlepszy.punkty) {
            najlepszy = u;
            ile = 1;
        } else if (u.punkty == najlepszy.punkty) {
            ile++;
        }
    }
    cout << "najlepszy: " << najlepszy.imie << " " << najlepszy.punkty << "\n";
    cout << "z takim samym wynikiem: " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'st-najtanszy-najdrozszy', krok: 2, level: 'latwe',
            title: 'Najtańszy i najdroższy',
            short: 'Dwa rekordy naraz: najtańszy i najdroższy produkt. Uważaj na remisy — przy jednym wygrywa pierwszy, przy drugim ostatni.',
            tags: ['dwa najlepsze rekordy', '< kontra >=', 'format Z.GG'],
            statement: ['W sklepie internetowym jest n produktów, każdy ma nazwę i cenę w groszach. Wypisz najtańszy i najdroższy produkt.',
                'Remisy rozstrzygaj tak: jeśli kilka produktów ma tę samą najniższą cenę, wypisz ten, który był na liście najwcześniej; jeśli kilka ma tę samą najwyższą cenę — ten, który był na liście najpóźniej. Najwygodniej trzymać dwie zmienne typu Produkt i kopiować do nich całe rekordy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa i cena w groszach.'],
            output_format: ['Dwa wiersze: najtanszy: NAZWA Z.GG i najdrozszy: NAZWA Z.GG.'],
            constraints: ['1 ≤ n ≤ 5000', 'Nazwy są różne, mają od 1 do 15 małych liter.', '1 ≤ cena ≤ 10⁸'],
            examples: [{ input: '5\nlampa 4999\nkubek 1250\nfotel 89900\nzegar 1250\nbiurko 89900', note: 'Najniższa cena 12.50 jest dwa razy — wygrywa wcześniejszy kubek. Najwyższa 899.00 też dwa razy — wygrywa późniejsze biurko.' }],
            hint: R`Produkt tani = pierwszy, drogi = pierwszy;. Dla kolejnych: if (p.cena < tani.cena) tani = p; (ostre <, więc remis zostawia wcześniejszy) oraz if (p.cena >= drogi.cena) drogi = p; (z >=, więc remis podmienia na późniejszy).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const lista = (n, lo, hi) => { const w = unikalneSlowa(r, n, 1, 4); return w.map((s) => [s, r.int(lo, hi)]); };
                return [d([['woda', 199]]), d([['a', 5], ['b', 5], ['c', 5], ['d', 5]]), d(lista(10, 100, 120)), d(lista(5000, 1, 100000000)), d(lista(2000, 1, 30)), d([['x', 100000000], ['y', 1], ['z', 100000000], ['w', 1]])];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 5000) || L.length !== n + 1) return 'n';
                const nz = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 2 || !czyMale(t[0], 15) || nz.has(t[0]) || !calk(Number(t[1]), 1, 1e8)) return 'dane'; nz.add(t[0]); }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; });
                let a = u[0], b = u[0];
                for (const x of u.slice(1)) { if (x[1] < a[1]) a = x; if (x[1] >= b[1]) b = x; }
                return `najtanszy: ${a[0]} ${zl(a[1])}\nnajdrozszy: ${b[0]} ${zl(b[1])}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Produkt {
    string nazwa;
    int cena;
};
void wypisz(string etykieta, Produkt p) {
    cout << etykieta << p.nazwa << " " << p.cena / 100 << "." << setw(2) << setfill('0') << p.cena % 100 << "\n";
}
int main() {
    int n;
    cin >> n;
    Produkt p;
    cin >> p.nazwa >> p.cena;
    Produkt tani = p, drogi = p;
    for (int i = 1; i < n; i++) {
        cin >> p.nazwa >> p.cena;
        if (p.cena < tani.cena) tani = p;
        if (p.cena >= drogi.cena) drogi = p;
    }
    wypisz("najtanszy: ", tani);
    wypisz("najdrozszy: ", drogi);
    return 0;
}`,
        },
        {
            id: 'st-najstarszy', krok: 2, level: 'latwe',
            title: 'Najstarszy i najmłodszy',
            short: 'Rekordy z datami urodzenia. „Wcześniej” to porównanie pole po polu: rok, miesiąc, dzień. Najstarszy i najmłodszy w jednym przejściu.',
            tags: ['porównanie dat', 'dwa rekordy naraz', 'format DD.MM.RRRR'],
            statement: ['W drużynie harcerskiej jest n osób; każda ma imię i datę urodzenia. Znajdź osobę najstarszą (urodzoną najwcześniej) i najmłodszą (urodzoną najpóźniej). Jeśli kilka osób urodziło się tego samego dnia, wybierz tę, która była na liście wcześniej — dotyczy to obu wyników.',
                'Datę wypisuj w formacie DD.MM.RRRR, z zerami na początku dnia i miesiąca.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, dzień, miesiąc i rok urodzenia.'],
            output_format: ['Dwa wiersze: najstarszy: IMIE DD.MM.RRRR i najmlodszy: IMIE DD.MM.RRRR.'],
            constraints: ['1 ≤ n ≤ 5000', 'Imiona są różne, mają od 1 do 20 znaków (litery i cyfry, pierwsza wielka litera).', 'Daty są poprawne, lata od 1990 do 2020.'],
            examples: [{ input: '4\nOla 5 3 2012\nKuba 17 11 2011\nIga 1 12 2012\nAdam 17 11 2011', note: 'Najwcześniej urodzili się Kuba i Adam (17.11.2011) — wygrywa wcześniejszy na liście Kuba. Najpóźniej — Iga.' }],
            hint: R`Napisz warunek „a urodził się wcześniej niż b”: a.r < b.r albo (a.r == b.r i a.m < b.m) albo (a.r == b.r i a.m == b.m i a.d < b.d). Najstarszego podmieniaj, gdy nowy jest wcześniej; najmłodszego — gdy obecny najmłodszy jest wcześniej niż nowy. Remisy nic nie zmieniają.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const lista = (n, r1, r2) => unikalneImiona(r, n).map((s) => [s, ...losData(r, r1, r2)]);
                const t = [d([['Ala', 29, 2, 2000]]), d([['A', 1, 1, 2010], ['B', 1, 1, 2010], ['C', 1, 1, 2010]]), d(lista(8, 2010, 2011)), d(lista(5000, 1990, 2020))];
                const s = lista(300, 2015, 2015); s.push(['Ostatni', 31, 12, 2015]); s.splice(5, 0, ['Wczesny', 1, 1, 2015]); t.push(d(s));
                t.push(d(lista(50, 2012, 2012).map((x) => [x[0], r.int(1, 3), 6, 2012])));
                return t;
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 5000) || L.length !== n + 1) return 'n';
                const nz = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 4 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || nz.has(t[0]) || !P.czyPoprawnaData(Number(t[1]), Number(t[2]), Number(t[3])) || !calk(Number(t[3]), 1990, 2020)) return 'dane'; nz.add(t[0]); }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1]), Number(t[2]), Number(t[3])]; });
                let st = u[0], ml = u[0];
                for (const x of u.slice(1)) { if (porownajDaty(x.slice(1), st.slice(1)) < 0) st = x; if (porownajDaty(ml.slice(1), x.slice(1)) < 0) ml = x; }
                return `najstarszy: ${st[0]} ${dataTxt(st[1], st[2], st[3])}\nnajmlodszy: ${ml[0]} ${dataTxt(ml[1], ml[2], ml[3])}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Osoba {
    string imie;
    int d, m, r;
};
bool wczesniej(Osoba a, Osoba b) {
    if (a.r != b.r) return a.r < b.r;
    if (a.m != b.m) return a.m < b.m;
    return a.d < b.d;
}
void wypisz(Osoba o) {
    cout << o.imie << " " << setfill('0') << setw(2) << o.d << "." << setw(2) << o.m << "." << o.r << "\n";
}
int main() {
    int n;
    cin >> n;
    Osoba o;
    cin >> o.imie >> o.d >> o.m >> o.r;
    Osoba najstarszy = o, najmlodszy = o;
    for (int i = 1; i < n; i++) {
        cin >> o.imie >> o.d >> o.m >> o.r;
        if (wczesniej(o, najstarszy)) najstarszy = o;
        if (wczesniej(najmlodszy, o)) najmlodszy = o;
    }
    cout << "najstarszy: ";
    wypisz(najstarszy);
    cout << "najmlodszy: ";
    wypisz(najmlodszy);
    return 0;
}`,
        },
        {
            id: 'st-kopia-zapasowa', krok: 2, level: 'latwe',
            title: 'Kopia zapasowa dokumentu',
            short: 'ZAPISZ kopiuje cały dokument do drugiej zmiennej, COFNIJ kopiuje go z powrotem. Kopia żyje własnym życiem.',
            tags: ['kopia = oryginał', 'niezależne kopie', 'polecenia'],
            statement: ['Edytor tekstu pamięta dokument: tytuł, liczbę stron i liczbę słów. Na początku dokument ma tytuł bez_tytulu, 0 stron i 0 słów, a kopia zapasowa wygląda tak samo. Obsłuż q poleceń:',
                'TYTUL t — zmienia tytuł na t. PISZ s w — dopisuje s stron i w słów. ZAPISZ — robi kopię zapasową: zapamiętuje cały obecny dokument. COFNIJ — przywraca dokument z kopii zapasowej (kopia zostaje, można ją przywrócić jeszcze raz). POKAZ — wypisuje dokument w formacie tytul: S stron, W slow.',
                'Dokument i kopię trzymaj w dwóch zmiennych typu struct Dokument. Zapis i przywracanie to wtedy jedno przypisanie.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu dla każdego polecenia POKAZ.'],
            constraints: ['1 ≤ q ≤ 1000', 'Tytuły mają od 1 do 20 znaków (małe litery i _).', '0 ≤ s ≤ 100, 0 ≤ w ≤ 100 000', 'Jest co najmniej jedno polecenie POKAZ.'],
            examples: [{ input: '8\nTYTUL wypracowanie\nPISZ 2 900\nZAPISZ\nPISZ 1 450\nPOKAZ\nCOFNIJ\nTYTUL lektura\nPOKAZ', note: 'Po ZAPISZ kopia ma 2 strony i 900 słów. Dopisanie strony zmienia tylko dokument, nie kopię. COFNIJ wraca do 2 stron i 900 słów (i tytułu wypracowanie), a potem zmieniamy tytuł.' }],
            hint: R`Dokument dok = {"bez_tytulu", 0, 0}; Dokument kopia = dok;. ZAPISZ to kopia = dok;, COFNIJ to dok = kopia;. Przypisanie kopiuje wszystkie pola naraz, a późniejsze zmiany dok nie ruszają kopii.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const tyt = () => r.pick(['notatki', 'referat', 'list_do_babci', 'wypracowanie', 'projekt', 'opowiadanie', 'plan_lekcji', 'raport', 'x']);
                const los = (q) => { const o = []; while (o.length < q - 1) { const p = r(); o.push(p < 0.15 ? `TYTUL ${tyt()}` : p < 0.5 ? `PISZ ${r.int(0, 100)} ${r.int(0, 100000)}` : p < 0.65 ? 'ZAPISZ' : p < 0.78 ? 'COFNIJ' : 'POKAZ'); } o.push('POKAZ'); return o; };
                return [d(['POKAZ']), d(['COFNIJ', 'PISZ 3 10', 'COFNIJ', 'POKAZ', 'ZAPISZ', 'TYTUL nowy', 'POKAZ', 'COFNIJ', 'POKAZ']), d(los(30)), d(los(1000)), d(los(400))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                let pok = 0;
                for (const l of L.slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'TYTUL') { if (t.length !== 2 || !/^[a-z_]{1,20}$/.test(t[1])) return 'tytul'; }
                    else if (t[0] === 'PISZ') { if (t.length !== 3 || !calk(Number(t[1]), 0, 100) || !calk(Number(t[2]), 0, 100000)) return 'pisz'; }
                    else if (['ZAPISZ', 'COFNIJ', 'POKAZ'].includes(t[0]) && t.length === 1) { if (t[0] === 'POKAZ') pok++; }
                    else return 'polecenie';
                }
                return pok ? null : 'brak POKAZ';
            },
            solve: (inp) => {
                let dok = { t: 'bez_tytulu', s: 0, w: 0 }, kop = { ...dok }; const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'TYTUL') dok.t = t[1];
                    else if (t[0] === 'PISZ') { dok.s += Number(t[1]); dok.w += Number(t[2]); }
                    else if (t[0] === 'ZAPISZ') kop = { ...dok };
                    else if (t[0] === 'COFNIJ') dok = { ...kop };
                    else o.push(`${dok.t}: ${dok.s} stron, ${dok.w} slow`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Dokument {
    string tytul;
    int strony;
    int slowa;
};
int main() {
    int q;
    cin >> q;
    Dokument dok = {"bez_tytulu", 0, 0};
    Dokument kopia = dok;
    for (int i = 0; i < q; i++) {
        string polecenie;
        cin >> polecenie;
        if (polecenie == "TYTUL") {
            cin >> dok.tytul;
        } else if (polecenie == "PISZ") {
            int s, w;
            cin >> s >> w;
            dok.strony += s;
            dok.slowa += w;
        } else if (polecenie == "ZAPISZ") {
            kopia = dok;
        } else if (polecenie == "COFNIJ") {
            dok = kopia;
        } else {
            cout << dok.tytul << ": " << dok.strony << " stron, " << dok.slowa << " slow\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-bez-powtorzen', krok: 2, level: 'latwe',
            title: 'Zgłoszenia bez powtórzeń',
            short: 'Formularz czasem wysyła się dwa razy. Usuń rekord identyczny z poprzednim — porównując wszystkie trzy pola, bo == na strukturach nie działa.',
            tags: ['porównanie pole po polu', 'poprzedni rekord', 'kopiowanie w pętli'],
            statement: ['Na zawody zgłosiło się n osób: imię, nazwisko i rok urodzenia. Czasem formularz wysyłał się dwa razy z rzędu — wtedy w danych stoją obok siebie dwa identyczne zgłoszenia (wszystkie trzy pola równe).',
                'Wypisz listę bez takich powtórzeń: zgłoszenie pomijasz, jeśli jest identyczne z bezpośrednio poprzednim zgłoszeniem w danych. Na końcu wypisz, ile zgłoszeń usunięto. Uwaga: zapis a == b dla dwóch struktur się nie skompiluje — porównaj pola osobno.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, nazwisko i rok urodzenia.'],
            output_format: ['Zgłoszenia bez powtórzeń (po jednym w wierszu, w formacie z wejścia), a potem wiersz usunieto: K.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona i nazwiska mają od 1 do 20 liter, pierwsza wielka.', '1990 ≤ rok ≤ 2020'],
            examples: [{ input: '6\nOla Lis 2011\nOla Lis 2011\nOla Lis 2012\nKuba Mazur 2010\nKuba Mazur 2010\nOla Lis 2011', note: 'Drugie zgłoszenie jest kopią pierwszego, piąte — czwartego. Trzecie ma inny rok, a ostatnie nie stoi obok swojego bliźniaka — oba zostają.' }],
            hint: R`Trzymaj Zgloszenie poprzednie;. Dla każdego nowego z (od drugiego): jeśli z.imie == poprzednie.imie && z.nazwisko == poprzednie.nazwisko && z.rok == poprzednie.rok — usunieto++, w przeciwnym razie wypisz z. Na końcu obrotu pętli: poprzednie = z;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, pPow) => {
                    const o = [[imie(r), r.pick(NAZWISKA), r.int(1990, 2020)]];
                    while (o.length < n) {
                        const p = r(), pr = o[o.length - 1];
                        if (p < pPow) o.push(pr.slice());
                        else if (p < pPow + 0.1) o.push([pr[0], pr[1], pr[2] === 2020 ? 2019 : pr[2] + 1]);
                        else if (p < pPow + 0.15) o.push([pr[0], r.pick(NAZWISKA), pr[2]]);
                        else o.push([imie(r), r.pick(NAZWISKA), r.int(1990, 2020)]);
                    }
                    return o;
                };
                return [d([['Ala', 'Nowak', 2000]]), d(Array.from({ length: 5 }, () => ['Ela', 'Kowalczyk', 2015])), d(los(15, 0.4)), d(los(1000, 0.3)), d(los(500, 0.7))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && czyImie(t[0], 20) && czyImie(t[1], 20) && calk(Number(t[2]), 1990, 2020); }) ? null : 'dane';
            },
            solve: (inp) => {
                const L = linie(inp).slice(1); const o = [L[0]]; let u = 0;
                for (let i = 1; i < L.length; i++) { if (L[i] === L[i - 1]) u++; else o.push(L[i]); }
                o.push(`usunieto: ${u}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zgloszenie {
    string imie, nazwisko;
    int rok;
};
int main() {
    int n;
    cin >> n;
    Zgloszenie poprzednie;
    cin >> poprzednie.imie >> poprzednie.nazwisko >> poprzednie.rok;
    cout << poprzednie.imie << " " << poprzednie.nazwisko << " " << poprzednie.rok << "\n";
    int usunieto = 0;
    for (int i = 1; i < n; i++) {
        Zgloszenie z;
        cin >> z.imie >> z.nazwisko >> z.rok;
        if (z.imie == poprzednie.imie && z.nazwisko == poprzednie.nazwisko && z.rok == poprzednie.rok) {
            usunieto++;
        } else {
            cout << z.imie << " " << z.nazwisko << " " << z.rok << "\n";
        }
        poprzednie = z;
    }
    cout << "usunieto: " << usunieto << "\n";
    return 0;
}`,
        },
        {
            id: 'st-pomiary', krok: 2, level: 'srednie',
            title: 'Pomiary ze stacji pogodowej',
            short: 'Pomiar to godzina i temperatura. Rekord najcieplejszy, najzimniejszy i największy skok między kolejnymi pomiarami — z pamiętanym poprzednim rekordem.',
            tags: ['rekord w pętli', 'poprzedni pomiar', 'wczytywanie HH:MM'],
            statement: ['Stacja pogodowa zapisuje w ciągu dnia n pomiarów: godzinę w formacie HH:MM i temperaturę (liczbę całkowitą). Pomiary są uporządkowane od najwcześniejszego.',
                'Wypisz najwyższą temperaturę i godzinę, o której ją zmierzono, tak samo najniższą, a potem największy skok temperatury między dwoma kolejnymi pomiarami (wartość bezwzględną różnicy) razem z godzinami tych dwóch pomiarów. Przy remisach wybieraj zawsze pomiar (albo parę pomiarów), który wystąpił najwcześniej. Jeśli jest tylko jeden pomiar, skoku nie ma.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy godzina HH:MM i temperatura.'],
            output_format: ['Trzy wiersze: max: T o HH:MM, min: T o HH:MM oraz najwiekszy skok: D miedzy HH:MM a HH:MM (albo najwiekszy skok: brak).'],
            constraints: ['1 ≤ n ≤ 1440, godziny rosną (różne minuty doby)', '−40 ≤ temperatura ≤ 45'],
            examples: [{ input: '5\n06:00 -3\n09:30 4\n12:00 11\n15:45 11\n21:10 2', note: 'Najcieplej było 11° — pierwszy raz o 12:00. Najzimniej −3° o 06:00. Skoki: 7, 7, 0, 9 — największy, 9°, między 15:45 a 21:10.' }],
            hint: R`Wczytuj godzinę przez znak: char dwukropek; cin >> p.h >> dwukropek >> p.m >> p.t;. Trzymaj rekordy Pomiar mx, mn, poprzedni oraz pary skokOd, skokDo. Godzinę wypisuj z zerami: setw(2) << setfill('0').`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([m, t]) => `${hhmm(m)} ${t}`).join('\n')}`;
                const los = (n, lo, hi) => { const m = r.shuffle(Array.from({ length: 1440 }, (_, i) => i)).slice(0, n).sort((a, b) => a - b); let t = r.int(lo, hi); return m.map((x) => { t = Math.max(-40, Math.min(45, t + r.int(-6, 6))); return [x, t]; }); };
                return [d([[0, 5]]), d([[0, -40], [1439, 45]]), d([[60, 3], [120, 3], [180, 3]]), d(los(20, -5, 15)), d(los(1440, 0, 20)), d(los(300, -30, -10)), d(los(5, 20, 30))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1440) || L.length !== n + 1) return 'n';
                let pm = -1;
                for (const l of L.slice(1)) { const m = l.match(/^(\d\d):(\d\d) (-?\d+)$/); if (!m) return 'format'; const g = Number(m[1]), mi = Number(m[2]); if (g > 23 || mi > 59 || !calk(Number(m[3]), -40, 45)) return 'zakres'; if (g * 60 + mi <= pm) return 'kolejnosc'; pm = g * 60 + mi; }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const [g, t] = l.split(' '); return [g, Number(t)]; });
                let mx = u[0], mn = u[0], sk = -1, a = null, b = null;
                for (let i = 1; i < u.length; i++) {
                    if (u[i][1] > mx[1]) mx = u[i];
                    if (u[i][1] < mn[1]) mn = u[i];
                    const s = Math.abs(u[i][1] - u[i - 1][1]);
                    if (s > sk) { sk = s; a = u[i - 1]; b = u[i]; }
                }
                return [`max: ${mx[1]} o ${mx[0]}`, `min: ${mn[1]} o ${mn[0]}`, sk < 0 ? 'najwiekszy skok: brak' : `najwiekszy skok: ${sk} miedzy ${a[0]} a ${b[0]}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pomiar {
    int h, m, t;
};
void godzina(Pomiar p) {
    cout << setfill('0') << setw(2) << p.h << ":" << setw(2) << p.m;
}
int main() {
    int n;
    cin >> n;
    char dwukropek;
    Pomiar p;
    cin >> p.h >> dwukropek >> p.m >> p.t;
    Pomiar mx = p, mn = p, poprzedni = p, skokOd = p, skokDo = p;
    int skok = -1;
    for (int i = 1; i < n; i++) {
        cin >> p.h >> dwukropek >> p.m >> p.t;
        if (p.t > mx.t) mx = p;
        if (p.t < mn.t) mn = p;
        if (abs(p.t - poprzedni.t) > skok) {
            skok = abs(p.t - poprzedni.t);
            skokOd = poprzedni;
            skokDo = p;
        }
        poprzedni = p;
    }
    cout << "max: " << mx.t << " o ";
    godzina(mx);
    cout << "\nmin: " << mn.t << " o ";
    godzina(mn);
    cout << "\nnajwiekszy skok: ";
    if (skok < 0) {
        cout << "brak\n";
    } else {
        cout << skok << " miedzy ";
        godzina(skokOd);
        cout << " a ";
        godzina(skokDo);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-zmiana-lidera', krok: 2, level: 'srednie',
            title: 'Zmiany lidera',
            short: 'Skoczkowie skaczą po kolei. Po każdym skoku, który daje nowe prowadzenie, ogłaszasz nowego lidera — kopiując jego rekord.',
            tags: ['najlepszy do tej pory', 'ogłaszanie zmian', 'remis zostawia lidera'],
            statement: ['W konkursie skoków narciarskich zawodnicy skaczą po kolei, a po każdym skoku komentator patrzy na tablicę wyników. Każdy skok to imię zawodnika i liczba punktów.',
                'Liderem jest zawodnik z najlepszym wynikiem spośród tych, którzy już skoczyli. Gdy po skoku numer i lider się zmienia (także po pierwszym skoku, gdy pojawia się pierwszy lider), wypisz po skoku i prowadzi IMIE z wynikiem W. Wyrównanie wyniku lidera nie odbiera mu prowadzenia. Na końcu wypisz wygrywa IMIE z wynikiem W.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i wynik skoczka.'],
            output_format: ['Ogłoszenia o nowych liderach (w kolejności skoków), a na końcu wiersz o zwycięzcy.'],
            constraints: ['1 ≤ n ≤ 2000', 'Imiona mają od 1 do 15 liter (pierwsza wielka).', '0 ≤ wynik ≤ 300'],
            examples: [{ input: '5\nKamil 121\nDawid 118\nPiotr 130\nAdam 130\nMaciej 142', note: 'Kamil prowadzi po 1. skoku, Piotr po 3. Adam tylko wyrównuje — Piotr dalej prowadzi. Po 5. skoku prowadzi Maciej i on wygrywa.' }],
            hint: R`Skoczek lider; wczytaj pierwszego do lider i od razu ogłoś go jako lidera po skoku 1. Dla i od 2 do n: wczytaj Skoczek s; jeśli s.wynik > lider.wynik, to lider = s; i ogłoś.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => Array.from({ length: n }, () => [imie(r), r.int(lo, hi)]);
                return [d([['Ala', 0]]), d(Array.from({ length: 10 }, (_, i) => [imie(r), 100 + i * 10])), d(Array.from({ length: 10 }, (_, i) => [imie(r), 200 - i])), d(los(15, 100, 140)), d(los(2000, 0, 300)), d(Array.from({ length: 300 }, (_, i) => [imie(r), Math.min(300, Math.floor(i / 2) * 2 + r.int(0, 1))]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 2 && czyImie(t[0], 15) && calk(Number(t[1]), 0, 300); }) ? null : 'dane';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => l.split(' '));
                let lid = null; const o = [];
                u.forEach((x, i) => { if (!lid || Number(x[1]) > Number(lid[1])) { lid = x; o.push(`po skoku ${i + 1} prowadzi ${x[0]} z wynikiem ${x[1]}`); } });
                o.push(`wygrywa ${lid[0]} z wynikiem ${lid[1]}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Skoczek {
    string imie;
    int wynik;
};
int main() {
    int n;
    cin >> n;
    Skoczek lider;
    cin >> lider.imie >> lider.wynik;
    cout << "po skoku 1 prowadzi " << lider.imie << " z wynikiem " << lider.wynik << "\n";
    for (int i = 2; i <= n; i++) {
        Skoczek s;
        cin >> s.imie >> s.wynik;
        if (s.wynik > lider.wynik) {
            lider = s;
            cout << "po skoku " << i << " prowadzi " << lider.imie << " z wynikiem " << lider.wynik << "\n";
        }
    }
    cout << "wygrywa " << lider.imie << " z wynikiem " << lider.wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'st-podium', krok: 2, level: 'srednie',
            title: 'Podium w jednym przejściu',
            short: 'Trzy zmienne: złoto, srebro i brąz. Nowy zawodnik przesuwa medalistów w dół — całe rekordy kopiowane jeden za drugim.',
            tags: ['trzy najlepsze rekordy', 'przesuwanie kopii', 'remisy'],
            statement: ['W biegu wzięło udział n zawodników; każdy ma imię i liczbę punktów. Wypisz podium: trzech zawodników z najwyższymi wynikami, od pierwszego miejsca. Przy równych wynikach wyżej jest ten, kto był wcześniej na liście.',
                'Zrób to w jednym przejściu przez dane, bez tablicy: trzymaj trzy zmienne typu Zawodnik — m1, m2, m3. Gdy nowy zawodnik jest lepszy od m1, brązowy medal przechodzi na m2, srebrny na m1, a nowy zostaje złotym: m3 = m2; m2 = m1; m1 = z; — i podobnie dla pozostałych miejsc.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i wynik.'],
            output_format: ['Trzy wiersze: 1. IMIE WYNIK, 2. IMIE WYNIK, 3. IMIE WYNIK.'],
            constraints: ['3 ≤ n ≤ 5000', 'Imiona mają od 1 do 15 liter (pierwsza wielka); mogą się powtarzać.', '0 ≤ wynik ≤ 10⁶'],
            examples: [{ input: '6\nOla 70\nKuba 95\nIga 80\nAdam 95\nZosia 99\nEla 80', note: 'Zosia (99) wygrywa. Kuba i Adam mają po 95 — Kuba był wcześniej, więc jest drugi, a Adam trzeci. Iga i Ela (80) są już poza podium.' }],
            hint: R`Zacznij od Zawodnik m1 = {"", -1}, m2 = {"", -1}, m3 = {"", -1}; (wyniki są nieujemne, więc pierwszy zawodnik na pewno jest lepszy). Dla każdego z: if (z.wynik > m1.wynik) { m3 = m2; m2 = m1; m1 = z; } else if (z.wynik > m2.wynik) { m3 = m2; m2 = z; } else if (z.wynik > m3.wynik) m3 = z;. Ostre > daje pierwszeństwo wcześniejszym przy remisie.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => Array.from({ length: n }, () => [imie(r), r.int(lo, hi)]);
                return [d([['A', 1], ['B', 2], ['C', 3]]), d([['A', 5], ['B', 5], ['C', 5], ['D', 5]]), d([['Ola', 0], ['Ela', 1000000], ['Iga', 0], ['Ula', 999999]]), d(los(10, 0, 20)), d(los(5000, 0, 1000000)), d(los(3000, 0, 5)), d(Array.from({ length: 50 }, (_, i) => [imie(r), i]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 3, 5000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 2 && czyImie(t[0], 15) && calk(Number(t[1]), 0, 1e6); }) ? null : 'dane';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; });
                const s = u.map((x, i) => [x, i]).sort((a, b) => b[0][1] - a[0][1] || a[1] - b[1]);
                return s.slice(0, 3).map(([x], i) => `${i + 1}. ${x[0]} ${x[1]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zawodnik {
    string imie;
    int wynik;
};
int main() {
    int n;
    cin >> n;
    Zawodnik m1 = {"", -1}, m2 = {"", -1}, m3 = {"", -1};
    for (int i = 0; i < n; i++) {
        Zawodnik z;
        cin >> z.imie >> z.wynik;
        if (z.wynik > m1.wynik) {
            m3 = m2;
            m2 = m1;
            m1 = z;
        } else if (z.wynik > m2.wynik) {
            m3 = m2;
            m2 = z;
        } else if (z.wynik > m3.wynik) {
            m3 = z;
        }
    }
    cout << "1. " << m1.imie << " " << m1.wynik << "\n";
    cout << "2. " << m2.imie << " " << m2.wynik << "\n";
    cout << "3. " << m3.imie << " " << m3.wynik << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · vector struktur
        {
            id: 'st-lista-obecnosci', krok: 3, level: 'latwe',
            title: 'Lista obecności',
            short: 'Najpierw obecni, potem nieobecni — obie grupy w kolejności z dziennika. Bez zapamiętania wszystkich uczniów się nie da.',
            tags: ['vector<Uczen>', 'dwa przejścia', 'filtrowanie'],
            statement: ['Wychowawca sprawdza obecność. Dla każdego z n uczniów ma imię, nazwisko i znak 1 (obecny) albo 0 (nieobecny).',
                'Wypisz najpierw wiersz obecni: K i listę obecnych, a potem wiersz nieobecni: M i listę nieobecnych. W obu grupach zachowaj kolejność z dziennika. Wczytaj wszystkich uczniów do vector<Uczen>, a potem przejdź po nim dwa razy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, nazwisko i 1 albo 0.'],
            output_format: ['Wiersz obecni: K, K wierszy Imie Nazwisko, wiersz nieobecni: M i M wierszy Imie Nazwisko.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona i nazwiska mają od 1 do 20 liter, pierwsza wielka.'],
            examples: [{ input: '4\nOla Lis 1\nKuba Mazur 0\nIga Nowak 1\nAdam Krol 0', note: 'Obecni są Ola i Iga, nieobecni — Kuba i Adam. Kolejność w obu grupach jest taka jak w dzienniku.' }],
            hint: R`struct Uczen { string imie, nazwisko; int obecny; };. vector<Uczen> v(n); for (int i = 0; i < n; i++) cin >> v[i].imie >> v[i].nazwisko >> v[i].obecny;. Najpierw policz obecnych, wypisz nagłówek i przejdź po v, wypisując tych z obecny == 1; potem to samo dla 0.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, p) => Array.from({ length: n }, () => [imie(r), r.pick(NAZWISKA), r() < p ? 1 : 0]);
                return [d([['Ala', 'Nowak', 1]]), d([['Ola', 'Lis', 0], ['Ela', 'Krol', 0]]), d(los(12, 0.6)), d(los(1000, 0.85)), d(los(300, 0.1))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && czyImie(t[0], 20) && czyImie(t[1], 20) && (t[2] === '0' || t[2] === '1'); }) ? null : 'dane';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => l.split(' '));
                const ob = u.filter((x) => x[2] === '1'), nb = u.filter((x) => x[2] === '0');
                return [`obecni: ${ob.length}`, ...ob.map((x) => `${x[0]} ${x[1]}`), `nieobecni: ${nb.length}`, ...nb.map((x) => `${x[0]} ${x[1]}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie, nazwisko;
    int obecny;
};
int main() {
    int n;
    cin >> n;
    vector<Uczen> v(n);
    int obecnych = 0;
    for (int i = 0; i < n; i++) {
        cin >> v[i].imie >> v[i].nazwisko >> v[i].obecny;
        if (v[i].obecny == 1) obecnych++;
    }
    cout << "obecni: " << obecnych << "\n";
    for (const Uczen &u : v)
        if (u.obecny == 1) cout << u.imie << " " << u.nazwisko << "\n";
    cout << "nieobecni: " << n - obecnych << "\n";
    for (const Uczen &u : v)
        if (u.obecny == 0) cout << u.imie << " " << u.nazwisko << "\n";
    return 0;
}`,
        },
        {
            id: 'st-powyzej-sredniej', krok: 3, level: 'latwe',
            title: 'Powyżej średniej',
            short: 'Średnią znasz dopiero po przeczytaniu wszystkich wyników — więc najpierw zapisz uczniów w vectorze, a potem wybierz lepszych od średniej.',
            tags: ['vector<Uczen>', 'średnia', 'porównanie bez double'],
            statement: ['Po konkursie matematycznym n uczniów dostało punkty. Wypisz średnią liczbę punktów z dokładnością do dwóch miejsc po przecinku, a potem listę uczniów, którzy zdobyli więcej punktów niż średnia (w kolejności z wejścia).',
                'Dopóki nie wczytasz wszystkich wyników, nie znasz średniej — dlatego uczniów trzeba najpierw zapamiętać w vector<Uczen>.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i liczba punktów.'],
            output_format: ['Wiersz srednia: X.XX, wiersz powyzej sredniej: K i K wierszy z imionami.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona mają od 1 do 20 znaków (litery i cyfry, pierwsza wielka).', '0 ≤ punkty ≤ 100', 'Średnia nigdy nie wypada dokładnie w połowie między dwoma wynikami z dwoma miejscami po przecinku.'],
            examples: [{ input: '5\nOla 70\nKuba 45\nIga 90\nAdam 60\nZosia 62', note: 'Suma 327, średnia 65.40. Więcej mają Ola i Iga.' }],
            hint: R`Najpierw suma (int wystarczy), a średnią wypisz przez cout << fixed << setprecision(2) << (double)suma / n;. Przy wybieraniu uczniów nie porównuj z zaokrągloną średnią — porównaj bez ułamków: u.punkty * n > suma.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => {
                    for (;;) {
                        const u = unikalneImiona(r, n).map((s) => [s, r.int(lo, hi)]);
                        const s = u.reduce((a, x) => a + x[1], 0);
                        if (h.safe(s / n, 2)) return u;
                    }
                };
                return [d([['Ala', 50]]), d([['A', 10], ['B', 10], ['C', 10]]), d(los(7, 0, 100)), d(los(1000, 0, 100)), d(los(30, 95, 100)), d(los(200, 0, 3))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                let s = 0;
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 2 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || !calk(Number(t[1]), 0, 100)) return 'dane'; s += Number(t[1]); }
                return h.safe(s / n, 2) ? null : 'srednia w polowie';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; });
                const n = u.length, s = u.reduce((a, x) => a + x[1], 0);
                const w = u.filter((x) => x[1] * n > s);
                return [`srednia: ${h.fx(s / n, 2)}`, `powyzej sredniej: ${w.length}`, ...w.map((x) => x[0])].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie;
    int punkty;
};
int main() {
    int n;
    cin >> n;
    vector<Uczen> v(n);
    int suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> v[i].imie >> v[i].punkty;
        suma += v[i].punkty;
    }
    cout << fixed << setprecision(2) << "srednia: " << (double)suma / n << "\n";
    int ile = 0;
    for (const Uczen &u : v)
        if (u.punkty * n > suma) ile++;
    cout << "powyzej sredniej: " << ile << "\n";
    for (const Uczen &u : v)
        if (u.punkty * n > suma) cout << u.imie << "\n";
    return 0;
}`,
        },
        {
            id: 'st-ksiazka-telefoniczna', krok: 3, level: 'latwe',
            title: 'Książka telefoniczna',
            short: 'Lista kontaktów w vectorze struktur. Szukasz po imieniu albo po numerze — ten sam vector, inne pole w warunku.',
            tags: ['wyszukiwanie po polu', 'vector<Kontakt>', 'dwa rodzaje zapytań'],
            statement: ['Telefon pamięta n kontaktów: imię i numer (dziewięć cyfr). Imiona są różne i numery też są różne. Obsłuż q zapytań dwóch rodzajów:',
                'NUMER imie — wypisz numer tej osoby albo brak kontaktu. KTO numer — wypisz imię osoby o tym numerze albo nieznany numer. Kontakty trzymaj w vector<Kontakt> i przeszukuj go po kolei.'],
            input_format: ['W pierwszym wierszu n, w kolejnych n wierszach imię i numer.', 'Potem wiersz z q i q wierszy z zapytaniami.'],
            output_format: ['q wierszy — odpowiedzi na zapytania.'],
            constraints: ['1 ≤ n, q ≤ 1000', 'Imiona mają od 1 do 20 znaków (litery i cyfry, pierwsza wielka).', 'Numer to 9 cyfr, pierwsza od 5 do 8.'],
            examples: [{ input: '3\nOla 501234567\nKuba 602000111\nIga 777888999\n4\nNUMER Kuba\nKTO 777888999\nNUMER Ela\nKTO 500000000', note: 'Kuby szukasz po polu imie, a właściciela numeru 777888999 — po polu numer.' }],
            hint: R`Numer trzymaj jako string — to etykieta, a nie liczba do liczenia. Dla zapytania przejdź po vectorze: for (const Kontakt &k : v) if (k.imie == x) { … }. Użyj zmiennej bool znaleziono, żeby po pętli wiedzieć, czy wypisać brak kontaktu.`,
            tests: (r) => {
                const lista = (n) => { const im = unikalneImiona(r, n); const nr = new Set(); while (nr.size < n) nr.add(`${r.int(5, 8)}${String(r.int(0, 99999999)).padStart(8, '0')}`); const t = [...nr]; return im.map((s, i) => [s, t[i]]); };
                const d = (k, q) => `${k.length}\n${k.map((x) => x.join(' ')).join('\n')}\n${q.length}\n${q.join('\n')}`;
                const zap = (k, q) => Array.from({ length: q }, () => { const p = r(); const x = r.pick(k); if (p < 0.4) return `NUMER ${x[0]}`; if (p < 0.5) return `NUMER ${imie(r)}Z`; if (p < 0.9) return `KTO ${x[1]}`; return `KTO ${r.int(5, 8)}${String(r.int(0, 99999999)).padStart(8, '0')}`; });
                const k1 = lista(1), k2 = lista(20), k3 = lista(1000);
                return [d(k1, [`NUMER ${k1[0][0]}`, `KTO ${k1[0][1]}`, 'NUMER Nikt']), d(k2, zap(k2, 30)), d(k3, zap(k3, 1000))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                const im = new Set(), nr = new Set();
                for (const l of L.slice(1, n + 1)) { const t = l.split(' '); if (t.length !== 2 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || !/^[5-8]\d{8}$/.test(t[1]) || im.has(t[0]) || nr.has(t[1])) return 'kontakt'; im.add(t[0]); nr.add(t[1]); }
                const q = Number(L[n + 1]); if (!calk(q, 1, 1000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => /^NUMER [A-Z][A-Za-z0-9]{0,19}$/.test(l) || /^KTO [5-8]\d{8}$/.test(l)) ? null : 'zapytanie';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const k = L.slice(1, n + 1).map((l) => l.split(' '));
                return L.slice(n + 2).map((l) => {
                    const [c, x] = l.split(' ');
                    if (c === 'NUMER') { const f = k.find((y) => y[0] === x); return f ? f[1] : 'brak kontaktu'; }
                    const f = k.find((y) => y[1] === x); return f ? f[0] : 'nieznany numer';
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Kontakt {
    string imie, numer;
};
int main() {
    int n;
    cin >> n;
    vector<Kontakt> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].imie >> v[i].numer;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string rodzaj, x;
        cin >> rodzaj >> x;
        bool znaleziono = false;
        for (const Kontakt &k : v) {
            if (rodzaj == "NUMER" && k.imie == x) {
                cout << k.numer << "\n";
                znaleziono = true;
            }
            if (rodzaj == "KTO" && k.numer == x) {
                cout << k.imie << "\n";
                znaleziono = true;
            }
        }
        if (!znaleziono) {
            if (rodzaj == "NUMER") cout << "brak kontaktu\n";
            else cout << "nieznany numer\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-podwyzki', krok: 3, level: 'latwe',
            title: 'Podwyżki w firmie',
            short: 'Podwyżka dla całego stanowiska zmienia pensje w vectorze — pętla z & pracuje na oryginałach, bez & zmieniłaby kopie.',
            tags: ['for (Pracownik &p : v)', 'zmiana w miejscu', 'long long'],
            statement: ['Firma zatrudnia n pracowników; każdy ma imię, stanowisko i pensję w groszach. Zarząd ogłasza kolejno q podwyżek: stanowisko i procent p. Każdy pracownik na tym stanowisku dostaje nową pensję pensja · (100 + p) / 100, zaokrągloną w dół do pełnego grosza.',
                'Po wszystkich podwyżkach wypisz pracowników w kolejności z wejścia (imię, stanowisko i pensja w złotych z dwiema cyframi groszy), a na końcu sumę wszystkich pensji. Podwyżki rób pętlą for (Pracownik &p : v) — z ampersandem.'],
            input_format: ['W pierwszym wierszu n, w kolejnych n wierszach imię, stanowisko i pensja w groszach.', 'Potem wiersz z q i q wierszy: stanowisko i procent.'],
            output_format: ['n wierszy IMIE STANOWISKO Z.GG i wiersz razem: Z.GG.'],
            constraints: ['1 ≤ n ≤ 1000, 0 ≤ q ≤ 20', 'Stanowiska to małe litery (od 1 do 15).', '100 000 ≤ pensja ≤ 1 000 000 groszy, 1 ≤ p ≤ 50'],
            examples: [{ input: '3\nOla kasjer 450000\nKuba kierowca 520000\nIga kasjer 470050\n2\nkasjer 10\nkasjer 5', note: 'Pensja Oli: 450000 → 495000 → 519750. Pensja Igi: 470050 → 517055 → 542907 (z 542907,75 zostaje pełny grosz). Kuby żadna podwyżka nie dotyczy.' }],
            hint: R`Pensje rosną nawet do kilku miliardów groszy — trzymaj je w long long. Podwyżka: for (Pracownik &p : v) if (p.stanowisko == s) p.pensja = p.pensja * (100 + proc) / 100;. Bez & pętla zmieniałaby kopie i nic by się nie zapisało.`,
            tests: (r) => {
                const ST = ['kasjer', 'magazynier', 'kierowca', 'ksiegowy', 'informatyk', 'sprzedawca', 'dyrektor'];
                const d = (u, q) => `${u.length}\n${u.map((x) => x.join(' ')).join('\n')}\n${q.length}${q.length ? '\n' + q.map((x) => x.join(' ')).join('\n') : ''}`;
                const los = (n) => Array.from({ length: n }, () => [imie(r), r.pick(ST), r.int(100000, 1000000)]);
                const pod = (q, st) => Array.from({ length: q }, () => [r.pick(st), r.int(1, 50)]);
                return [d([['Ala', 'kasjer', 100000]], []), d([['Ola', 'kasjer', 1000000]], Array.from({ length: 20 }, () => ['kasjer', 50])), d(los(10), pod(5, ST)), d(los(1000), pod(20, ST)), d(los(200), pod(20, ['kasjer', 'pilot', 'dyrektor']))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                for (const l of L.slice(1, n + 1)) { const t = l.split(' '); if (t.length !== 3 || !czyImie(t[0], 20) || !czyMale(t[1], 15) || !calk(Number(t[2]), 100000, 1000000)) return 'pracownik'; }
                const q = Number(L[n + 1]); if (!calk(q, 0, 20) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const t = l.split(' '); return t.length === 2 && czyMale(t[0], 15) && calk(Number(t[1]), 1, 50); }) ? null : 'podwyzka';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const u = L.slice(1, n + 1).map((l) => { const t = l.split(' '); return [t[0], t[1], BigInt(t[2])]; });
                for (const l of L.slice(n + 2)) { const [s, p] = l.split(' '); for (const x of u) if (x[1] === s) x[2] = x[2] * BigInt(100 + Number(p)) / 100n; }
                const sum = u.reduce((a, x) => a + x[2], 0n);
                return [...u.map((x) => `${x[0]} ${x[1]} ${zl(x[2])}`), `razem: ${zl(sum)}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pracownik {
    string imie, stanowisko;
    long long pensja;
};
void kwota(long long g) {
    cout << g / 100 << "." << setw(2) << setfill('0') << g % 100;
}
int main() {
    int n;
    cin >> n;
    vector<Pracownik> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].imie >> v[i].stanowisko >> v[i].pensja;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string s;
        int proc;
        cin >> s >> proc;
        for (Pracownik &p : v)
            if (p.stanowisko == s) p.pensja = p.pensja * (100 + proc) / 100;
    }
    long long razem = 0;
    for (const Pracownik &p : v) {
        cout << p.imie << " " << p.stanowisko << " ";
        kwota(p.pensja);
        cout << "\n";
        razem += p.pensja;
    }
    cout << "razem: ";
    kwota(razem);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'st-najblizsza-stacja', krok: 3, level: 'latwe',
            title: 'Najbliższa stacja rowerowa',
            short: 'Stacje to rekordy z nazwą i współrzędnymi. Dla każdego pytania przechodzisz po vectorze i szukasz najmniejszej odległości taksówkowej.',
            tags: ['vector<Stacja>', 'minimum po vectorze', 'odległość |dx| + |dy|'],
            statement: ['W mieście jest n stacji rowerów miejskich; każda ma nazwę i położenie (x, y) na siatce ulic. Rowerzysta w punkcie (a, b) jedzie ulicami, więc do stacji ma |a − x| + |b − y| kwartałów.',
                'Dla każdego z q rowerzystów wypisz nazwę najbliższej stacji i odległość do niej. Jeśli kilka stacji jest równie blisko, wybierz tę, która była wcześniej na liście.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy: nazwa, x, y.', 'Potem wiersz z q i q wierszy: a, b.'],
            output_format: ['q wierszy: NAZWA ODLEGLOSC.'],
            constraints: ['1 ≤ n, q ≤ 1000', 'Nazwy mają od 1 do 12 małych liter i są różne.', '−10⁶ ≤ x, y, a, b ≤ 10⁶'],
            examples: [{ input: '3\nrynek 0 0\ndworzec 5 -2\npark -3 4\n3\n1 1\n4 0\n-1 2', note: 'Z (1, 1): rynek 2, dworzec 7, park 7 — wygrywa rynek. Z (4, 0): dworzec 3. Z (−1, 2): rynek 3 i park 4 — rynek.' }],
            hint: R`Dla każdego pytania: int best = 0; for (int i = 1; i < n; i++) if (odl(v[i]) < odl(v[best])) best = i; — ostre <, więc przy remisie zostaje wcześniejsza stacja. Odległość mieści się w int (do 4 · 10⁶).`,
            tests: (r) => {
                const d = (s, q) => `${s.length}\n${s.map((x) => x.join(' ')).join('\n')}\n${q.length}\n${q.map((x) => x.join(' ')).join('\n')}`;
                const st = (n, m) => unikalneSlowa(r, n, 1, 6).map((w) => [w, r.int(-m, m), r.int(-m, m)]);
                const pyt = (q, m) => Array.from({ length: q }, () => [r.int(-m, m), r.int(-m, m)]);
                return [d([['solo', 7, -7]], [[7, -7], [-1000000, 1000000]]), d([['a', 0, 0], ['b', 2, 0], ['c', 0, 2], ['d', 1, 1]], [[1, 0], [1, 1], [0, 1], [2, 2]]), d(st(20, 10), pyt(30, 12)), d(st(1000, 1000000), pyt(1000, 1000000)), d(st(300, 20), pyt(500, 25))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                const nz = new Set();
                for (const l of L.slice(1, n + 1)) { const t = l.split(' '); if (t.length !== 3 || !czyMale(t[0], 12) || nz.has(t[0]) || !calk(Number(t[1]), -1e6, 1e6) || !calk(Number(t[2]), -1e6, 1e6)) return 'stacja'; nz.add(t[0]); }
                const q = Number(L[n + 1]); if (!calk(q, 1, 1000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const t = l.split(' ').map(Number); return t.length === 2 && t.every((x) => calk(x, -1e6, 1e6)); }) ? null : 'pytanie';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const s = L.slice(1, n + 1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1]), Number(t[2])]; });
                return L.slice(n + 2).map((l) => {
                    const [a, b] = l.split(' ').map(Number);
                    let best = 0, bd = Infinity;
                    s.forEach((x, i) => { const dd = Math.abs(a - x[1]) + Math.abs(b - x[2]); if (dd < bd) { bd = dd; best = i; } });
                    return `${s[best][0]} ${bd}`;
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Stacja {
    string nazwa;
    int x, y;
};
int main() {
    int n;
    cin >> n;
    vector<Stacja> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].nazwa >> v[i].x >> v[i].y;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        int best = 0;
        int bestOdl = abs(a - v[0].x) + abs(b - v[0].y);
        for (int i = 1; i < n; i++) {
            int odl = abs(a - v[i].x) + abs(b - v[i].y);
            if (odl < bestOdl) {
                bestOdl = odl;
                best = i;
            }
        }
        cout << v[best].nazwa << " " << bestOdl << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-wycieczki', krok: 3, level: 'srednie',
            title: 'Biuro podróży',
            short: 'Filtr z kilkoma warunkami naraz: cena w budżecie i wystarczająco długi wyjazd. Ile ofert pasuje i która jest najlepsza?',
            tags: ['filtrowanie po kilku polach', 'najlepszy wśród pasujących', 'remisy'],
            statement: ['Biuro podróży ma n ofert; każda to cel, liczba dni i cena w złotych. Klient podaje budżet B i minimalną liczbę dni D. Pasują oferty, które kosztują najwyżej B i trwają co najmniej D dni.',
                'Dla każdego z q klientów wypisz, ile ofert pasuje, i najlepszą z nich: najtańszą, a przy równej cenie — dłuższą, a jeśli i to się zgadza — wcześniejszą na liście. Jeśli nic nie pasuje, wypisz tylko pasuje 0.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy: cel, dni, cena.', 'Potem wiersz z q i q wierszy: B i D.'],
            output_format: ['q wierszy: pasuje K, najlepsza: CEL albo pasuje 0.'],
            constraints: ['1 ≤ n, q ≤ 1000', 'Cele mają od 1 do 20 znaków (litery, pierwsza wielka); mogą się powtarzać.', '1 ≤ dni ≤ 30, 100 ≤ cena ≤ 20 000', '0 ≤ B ≤ 20 000, 1 ≤ D ≤ 30'],
            examples: [{ input: '4\nHel 7 2400\nZakopane 5 1900\nMalbork 3 900\nSopot 10 2400\n3\n2500 5\n1000 4\n5000 1', note: 'Klient 1: pasują Hel, Zakopane i Sopot — najtańsze Zakopane. Klient 2: nic. Klient 3: wszystkie — najtańszy Malbork.' }],
            hint: R`Dla każdego klienta: int ile = 0, best = -1;. Przejdź po ofertach; jeśli o.cena <= B && o.dni >= D, to ile++ i sprawdź, czy jest lepsza od v[best]: best == -1 albo o.cena < v[best].cena albo (o.cena == v[best].cena && o.dni > v[best].dni).`,
            tests: (r) => {
                const CEL = ['Hel', 'Zakopane', 'Malbork', 'Sopot', 'Krakow', 'Gdansk', 'Wisla', 'Karpacz', 'Mazury', 'Bieszczady', 'Rzym', 'Paryz', 'Londyn', 'Praga', 'Wieden', 'Oslo', 'Ateny', 'Lizbona'];
                const d = (o, q) => `${o.length}\n${o.map((x) => x.join(' ')).join('\n')}\n${q.length}\n${q.map((x) => x.join(' ')).join('\n')}`;
                const of = (n, mc) => Array.from({ length: n }, () => [r.pick(CEL), r.int(1, 30), 100 * r.int(1, mc / 100)]);
                const kl = (q) => Array.from({ length: q }, () => [r.int(0, 20000), r.int(1, 30)]);
                return [d([['Hel', 1, 100]], [[100, 1], [99, 1], [100, 2]]), d([['A', 5, 1000], ['B', 7, 1000], ['C', 7, 1000], ['D', 3, 500]], [[1000, 1], [1000, 6], [600, 3], [20000, 30]]), d(of(15, 5000), kl(20)), d(of(1000, 20000), kl(1000)), d(of(500, 3000), kl(300))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                for (const l of L.slice(1, n + 1)) { const t = l.split(' '); if (t.length !== 3 || !/^[A-Z][a-z]{0,19}$/.test(t[0]) || !calk(Number(t[1]), 1, 30) || !calk(Number(t[2]), 100, 20000)) return 'oferta'; }
                const q = Number(L[n + 1]); if (!calk(q, 1, 1000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const t = l.split(' ').map(Number); return t.length === 2 && calk(t[0], 0, 20000) && calk(t[1], 1, 30); }) ? null : 'klient';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const o = L.slice(1, n + 1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1]), Number(t[2])]; });
                return L.slice(n + 2).map((l) => {
                    const [B, D] = l.split(' ').map(Number);
                    let ile = 0, best = null;
                    for (const x of o) if (x[2] <= B && x[1] >= D) { ile++; if (!best || x[2] < best[2] || (x[2] === best[2] && x[1] > best[1])) best = x; }
                    return ile ? `pasuje ${ile}, najlepsza: ${best[0]}` : 'pasuje 0';
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Oferta {
    string cel;
    int dni, cena;
};
int main() {
    int n;
    cin >> n;
    vector<Oferta> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].cel >> v[i].dni >> v[i].cena;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int B, D;
        cin >> B >> D;
        int ile = 0, best = -1;
        for (int i = 0; i < n; i++) {
            if (v[i].cena <= B && v[i].dni >= D) {
                ile++;
                if (best == -1 || v[i].cena < v[best].cena || (v[i].cena == v[best].cena && v[i].dni > v[best].dni))
                    best = i;
            }
        }
        if (ile == 0) cout << "pasuje 0\n";
        else cout << "pasuje " << ile << ", najlepsza: " << v[best].cel << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-upaly', krok: 3, level: 'srednie',
            title: 'Fale upałów',
            short: 'Pomiary dzień po dniu w vectorze. Szukasz serii co najmniej trzech dni z 30° i więcej — z datą początku, końca i najwyższą temperaturą.',
            tags: ['serie w vectorze', 'indeksy początku i końca', 'wczytywanie DD.MM'],
            statement: ['Meteorolog ma pomiary z n kolejnych dni: datę DD.MM i najwyższą temperaturę dnia. Fala upałów to co najmniej 3 kolejne pomiary z temperaturą 30° lub wyższą (najdłuższa możliwa seria — nie dzielimy jej na kawałki).',
                'Wypisz każdą falę upałów w kolejności: od DD.MM do DD.MM: K dni, max T, a na końcu fal upalow: W. Najwygodniej wczytać wszystkie dni do vector<Dzien>, a potem szukać serii, pamiętając indeks jej początku.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy data DD.MM i temperatura.'],
            output_format: ['Po jednym wierszu na każdą falę upałów i wiersz fal upalow: W.'],
            constraints: ['1 ≤ n ≤ 365, daty to kolejne dni jednego roku (nieprzestępnego)', '−30 ≤ temperatura ≤ 45'],
            examples: [{ input: '8\n28.06 29\n29.06 31\n30.06 33\n01.07 30\n02.07 27\n03.07 30\n04.07 34\n05.07 31', note: 'Pierwsza fala: 29.06–01.07 (3 dni, max 33). Potem 02.07 przerywa serię, a 03.07–05.07 to druga fala (3 dni, max 34).' }],
            hint: R`Wczytaj datę: cin >> v[i].d >> kropka >> v[i].m >> v[i].t;. Idź indeksem i; gdy v[i].t >= 30, przesuwaj j od i, dopóki v[j].t >= 30. Seria to v[i]…v[j − 1]; jeśli j − i >= 3, wypisz ją. Potem i = j.`,
            tests: (r) => {
                const DN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const data = (k) => { let m = 0; while (k >= DN[m]) { k -= DN[m]; m++; } return `${pad2(k + 1)}.${pad2(m + 1)}`; };
                const d = (start, t) => `${t.length}\n${t.map((x, i) => `${data(start + i)} ${x}`).join('\n')}`;
                const lato = (n) => { let t = r.int(24, 30); return Array.from({ length: n }, () => { t = Math.max(-30, Math.min(45, t + r.int(-4, 4))); return t; }); };
                const rok = () => Array.from({ length: 365 }, (_, i) => Math.round(8 - 18 * Math.cos((2 * Math.PI * (i - 10)) / 365) + r.int(-6, 6)));
                return [d(0, [30]), d(100, [30, 30, 29, 30, 30, 30]), d(170, lato(20)), d(0, rok()), d(150, lato(120)), d(200, [31, 32, 33, 34, 35, 36, 37])];
            },
            check: (inp) => {
                const DN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 365) || L.length !== n + 1) return 'n';
                let pk = -1;
                for (const l of L.slice(1)) {
                    const m = l.match(/^(\d\d)\.(\d\d) (-?\d+)$/); if (!m) return 'format';
                    const dd = Number(m[1]), mm = Number(m[2]); if (mm < 1 || mm > 12 || dd < 1 || dd > DN[mm - 1] || !calk(Number(m[3]), -30, 45)) return 'zakres';
                    const k = DN.slice(0, mm - 1).reduce((a, b) => a + b, 0) + dd - 1; if (pk >= 0 && k !== pk + 1) return 'nie kolejne'; pk = k;
                }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const [dt, t] = l.split(' '); return [dt, Number(t)]; });
                const o = []; let i = 0;
                while (i < u.length) {
                    if (u[i][1] < 30) { i++; continue; }
                    let j = i, mx = -100;
                    while (j < u.length && u[j][1] >= 30) { mx = Math.max(mx, u[j][1]); j++; }
                    if (j - i >= 3) o.push(`od ${u[i][0]} do ${u[j - 1][0]}: ${j - i} dni, max ${mx}`);
                    i = j;
                }
                o.push(`fal upalow: ${o.length}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Dzien {
    int d, m, t;
};
void data(Dzien x) {
    cout << setfill('0') << setw(2) << x.d << "." << setw(2) << x.m;
}
int main() {
    int n;
    cin >> n;
    vector<Dzien> v(n);
    char kropka;
    for (int i = 0; i < n; i++) cin >> v[i].d >> kropka >> v[i].m >> v[i].t;
    int fal = 0;
    int i = 0;
    while (i < n) {
        if (v[i].t < 30) {
            i++;
            continue;
        }
        int j = i, mx = v[i].t;
        while (j < n && v[j].t >= 30) {
            mx = max(mx, v[j].t);
            j++;
        }
        if (j - i >= 3) {
            fal++;
            cout << "od ";
            data(v[i]);
            cout << " do ";
            data(v[j - 1]);
            cout << ": " << j - i << " dni, max " << mx << "\n";
        }
        i = j;
    }
    cout << "fal upalow: " << fal << "\n";
    return 0;
}`,
        },
        {
            id: 'st-magazyn', krok: 3, level: 'srednie',
            title: 'Magazyn sklepu',
            short: 'Towary w vectorze struktur, operacje sprzedaży i dostawy. Znajdź towar po kodzie i zmień jego pole przez v[i].ilosc.',
            tags: ['wyszukiwanie indeksu', 'v[i].pole -= k', 'raport na koniec'],
            statement: ['Sklep ma n towarów; każdy to kod (np. A12), nazwa, liczba sztuk w magazynie i cena za sztukę w groszach. Obsłuż q operacji:',
                'SPRZEDAZ kod k — jeśli towar istnieje i jest co najmniej k sztuk, ubywa k sztuk, a utarg rośnie o k · cena; jeśli sztuk jest za mało, wypisz brak towaru: KOD. DOSTAWA kod k — przybywa k sztuk. Gdy kodu nie ma w magazynie (przy obu operacjach), wypisz nieznany kod: KOD.',
                'Po wszystkich operacjach wypisz stan magazynu w kolejności z wejścia (kod, nazwa, liczba sztuk) i utarg w złotych.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy: kod, nazwa, sztuki, cena.', 'Potem wiersz z q i q wierszy z operacjami.'],
            output_format: ['Komunikaty o błędach (w kolejności operacji), potem n wierszy KOD NAZWA SZTUKI i wiersz utarg: Z.GG.'],
            constraints: ['1 ≤ n, q ≤ 1000', 'Kody są różne: wielka litera i od 1 do 3 cyfr. Nazwy: od 1 do 15 małych liter.', '0 ≤ sztuki ≤ 10⁴, 1 ≤ cena ≤ 10⁵, 1 ≤ k ≤ 10⁴'],
            examples: [{ input: '3\nA1 mleko 10 349\nB7 chleb 2 599\nC3 maslo 0 899\n5\nSPRZEDAZ A1 4\nSPRZEDAZ B7 3\nDOSTAWA C3 5\nSPRZEDAZ C3 5\nSPRZEDAZ X9 1', note: 'Mleko: 4 × 3.49 = 13.96. Chleba jest za mało. Masło: dostawa 5 i sprzedaż 5 = 44.95. X9 nie istnieje. Utarg: 58.91.' }],
            hint: R`Napisz pętlę szukającą: int idx = -1; for (int i = 0; i < n; i++) if (v[i].kod == kod) idx = i;. Jeśli idx == -1 — nieznany kod. Inaczej zmieniaj v[idx].sztuki. Utarg trzymaj w long long (może przekroczyć 2 · 10⁹ groszy).`,
            tests: (r) => {
                const d = (t, o) => `${t.length}\n${t.map((x) => x.join(' ')).join('\n')}\n${o.length}\n${o.join('\n')}`;
                const kody = (n) => { const s = new Set(); while (s.size < n) s.add(String.fromCharCode(65 + r.int(0, 25)) + r.int(0, n > 200 ? 999 : 99)); return r.shuffle([...s]); };
                const tow = (n) => kody(n).map((k) => [k, r.pick(PRODUKTY), r.int(0, 100), r.int(1, 100000)]);
                const op = (t, q, km) => Array.from({ length: q }, () => { const x = r() < 0.9 ? r.pick(t)[0] : String.fromCharCode(65 + r.int(0, 25)) + r.int(0, 999); return `${r() < 0.65 ? 'SPRZEDAZ' : 'DOSTAWA'} ${x} ${r.int(1, km)}`; });
                const t1 = tow(5), t2 = tow(1000);
                return [d([['A1', 'woda', 0, 100]], ['SPRZEDAZ A1 1', 'DOSTAWA A1 1', 'SPRZEDAZ A1 1', 'SPRZEDAZ A1 1']), d(t1, op(t1, 20, 40)), d(t2, op(t2, 1000, 60)), d([['Z999', 'sejf', 10000, 100000]], Array.from({ length: 1000 }, () => (r() < 0.5 ? 'SPRZEDAZ Z999 10000' : 'DOSTAWA Z999 10000')))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                const k = new Set();
                for (const l of L.slice(1, n + 1)) { const t = l.split(' '); if (t.length !== 4 || !/^[A-Z]\d{1,3}$/.test(t[0]) || k.has(t[0]) || !czyMale(t[1], 15) || !calk(Number(t[2]), 0, 10000) || !calk(Number(t[3]), 1, 100000)) return 'towar'; k.add(t[0]); }
                const q = Number(L[n + 1]); if (!calk(q, 1, 1000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const t = l.split(' '); return t.length === 3 && (t[0] === 'SPRZEDAZ' || t[0] === 'DOSTAWA') && /^[A-Z]\d{1,3}$/.test(t[1]) && calk(Number(t[2]), 1, 10000); }) ? null : 'operacja';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const t = L.slice(1, n + 1).map((l) => { const x = l.split(' '); return [x[0], x[1], Number(x[2]), Number(x[3])]; });
                const o = []; let ut = 0;
                for (const l of L.slice(n + 2)) {
                    const [c, kod, k] = l.split(' '); const x = t.find((y) => y[0] === kod); const kk = Number(k);
                    if (!x) { o.push(`nieznany kod: ${kod}`); continue; }
                    if (c === 'DOSTAWA') x[2] += kk; else if (x[2] >= kk) { x[2] -= kk; ut += kk * x[3]; } else o.push(`brak towaru: ${kod}`);
                }
                return [...o, ...t.map((x) => `${x[0]} ${x[1]} ${x[2]}`), `utarg: ${zl(ut)}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Towar {
    string kod, nazwa;
    int sztuki, cena;
};
int main() {
    int n;
    cin >> n;
    vector<Towar> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].kod >> v[i].nazwa >> v[i].sztuki >> v[i].cena;
    int q;
    cin >> q;
    long long utarg = 0;
    for (int k = 0; k < q; k++) {
        string op, kod;
        int ile;
        cin >> op >> kod >> ile;
        int idx = -1;
        for (int i = 0; i < n; i++)
            if (v[i].kod == kod) idx = i;
        if (idx == -1) {
            cout << "nieznany kod: " << kod << "\n";
        } else if (op == "DOSTAWA") {
            v[idx].sztuki += ile;
        } else if (v[idx].sztuki >= ile) {
            v[idx].sztuki -= ile;
            utarg += 1LL * ile * v[idx].cena;
        } else {
            cout << "brak towaru: " << kod << "\n";
        }
    }
    for (const Towar &t : v) cout << t.kod << " " << t.nazwa << " " << t.sztuki << "\n";
    cout << "utarg: " << utarg / 100 << "." << setw(2) << setfill('0') << utarg % 100 << "\n";
    return 0;
}`,
        },
    ];
};
