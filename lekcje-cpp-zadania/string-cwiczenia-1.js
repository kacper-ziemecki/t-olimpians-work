// String — ćwiczenia w trakcie lekcji, części 1–4: napis od środka (długość, indeksy, zmiana znaku),
// wczytywanie tekstu (słowa, wiersze, do końca danych, liczba i wiersz, przecinki), znak po znaku
// (rodzaje znaków, liczniki, sąsiedzi, serie, flagi) i budowanie napisów (zmiana w miejscu, +=, filtrowanie).
// Uczeń zna cały pierwszy etap i tablice — ale jeszcze nie funkcje, vector ani sort.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const SLOWA = ['kot', 'pies', 'dom', 'ala', 'ma', 'kota', 'szkola', 'olimpiada', 'program', 'tablica', 'napis', 'litera',
        'zadanie', 'komputer', 'klawiatura', 'ekran', 'myszka', 'kajak', 'anna', 'radar', 'zeszyt', 'lekcja', 'matematyka',
        'informatyka', 'jablko', 'gruszka', 'sliwka', 'banan', 'wisnia', 'kotek', 'kotlet', 'okno', 'domek', 'rower', 'samochod',
        'pociag', 'samolot', 'statek', 'las', 'rzeka', 'gora', 'morze', 'slonce', 'ksiezyc', 'gwiazda', 'deszcz', 'snieg', 'wiatr',
        'burza', 'tecza', 'a', 'i', 'w', 'z', 'na', 'do', 'od', 'pod', 'nad', 'oraz', 'albo', 'bardzo', 'dzisiaj', 'jutro'];
    const lines = (s) => s.split('\n');
    const word = (r, a, b) => r.word(r.int(a, b));
    const slowo = (r) => r.pick(SLOWA);
    const zdanie = (r, a, b) => Array.from({ length: r.int(a, b) }, () => slowo(r)).join(' ');
    const mix = (r, s, p = 0.5) => [...s].map((c) => (r() < p ? c.toUpperCase() : c)).join('');
    const isUp = (c) => c >= 'A' && c <= 'Z';
    const isLow = (c) => c >= 'a' && c <= 'z';
    const isDig = (c) => c >= '0' && c <= '9';
    const isAlpha = (c) => isUp(c) || isLow(c);
    const SAM = 'aeiouyAEIOUY';
    // losowy znak z podanego zestawu
    const znaki = (r, n, alfabet) => Array.from({ length: n }, () => alfabet[Math.floor(r() * alfabet.length)]).join('');
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const WIELKIE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const CYFRY = '0123456789';

    return [
        // ================================================================ KROK 1 · napis od środka
        {
            id: 'str-ostatnie-dwie', krok: 1, level: 'latwe',
            title: 'Dwie ostatnie litery',
            short: 'Wczytaj słowo i wypisz jego przedostatnią i ostatnią literę.',
            tags: ['s.length()', 's[n - 1]', 's[n - 2]'],
            statement: ['Wczytaj słowo i wypisz jego dwie ostatnie litery: najpierw przedostatnią, a zaraz za nią — bez spacji — ostatnią.'],
            input_format: ['Jeden wiersz z jednym słowem.'],
            output_format: ['Dwie ostatnie litery słowa, jedna za drugą.'],
            constraints: ['Słowo ma od 2 do 100 małych liter.'],
            examples: [{ input: 'kotek', note: 'Słowo ma 5 liter: przedostatnia to s[3] = e, ostatnia to s[4] = k.' }, { input: 'ok' }],
            hint: R`Zapisz długość w zmiennej: int n = s.length();. Ostatnia litera to s[n - 1], przedostatnia — s[n - 2]. Wypisz je jedną za drugą: cout << s[n - 2] << s[n - 1];.`,
            tests: (r) => ['kotek', 'ok', 'ab', 'programowanie', 'olimpiada', word(r, 2, 5), word(r, 5, 20), word(r, 50, 100), 'zz'],
            solve: (inp) => { const s = inp.trim(); return s.slice(-2); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    cout << s[n - 2] << s[n - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'str-k-od-konca', krok: 1, level: 'latwe',
            title: 'Litera k-ta od końca',
            short: 'Ostatnia litera to pierwsza od końca. Którą literą jest k-ta od końca?',
            tags: ['s[n - k]', 'numeracja od 1', 'od końca'],
            statement: ['Wczytaj słowo i liczbę k. Wypisz k-tą literę słowa licząc od końca. Pierwsza od końca to ostatnia litera słowa, druga od końca — przedostatnia i tak dalej.'],
            input_format: ['W pierwszym wierszu słowo.', 'W drugim wierszu liczba k.'],
            output_format: ['Jedna litera.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.', '1 ≤ k ≤ długość słowa'],
            examples: [
                { input: 'programowanie\n1', note: 'Pierwsza od końca to ostatnia litera: e.' },
                { input: 'programowanie\n4', note: 'Licząc od końca: e (1), i (2), n (3), a (4).' },
            ],
            hint: R`Sprawdź wzór na dwóch przypadkach. Dla k = 1 chcesz ostatnią literę, s[n - 1]. Dla k = n — pierwszą, s[0]. Oba pasują do s[n - k].`,
            check: (inp) => { const [s, k] = toks(inp); return Number(k) >= 1 && Number(k) <= s.length ? null : 'k poza słowem'; },
            tests: (r) => {
                const out = ['programowanie\n1', 'programowanie\n4', 'a\n1', 'kotek\n5', 'kotek\n3'];
                for (let i = 0; i < 6; i++) { const s = word(r, 1, 100); out.push(`${s}\n${r.int(1, s.length)}`); }
                const s = word(r, 100, 100); out.push(`${s}\n100`);
                return out;
            },
            solve: (inp) => { const [s, k] = toks(inp); return s[s.length - Number(k)]; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    int n = s.length();
    cout << s[n - k] << "\n";
    return 0;
}`,
        },
        {
            id: 'str-srodek-slowa', krok: 1, level: 'latwe',
            title: 'Środek słowa',
            short: 'Nieparzysta długość — jedna środkowa litera. Parzysta — dwie.',
            tags: ['s[n / 2]', 'n % 2', 'if / else'],
            statement: ['Wczytaj słowo i wypisz jego środek. Jeśli słowo ma nieparzystą liczbę liter, środek to jedna litera — ta, przed którą i za którą stoi tyle samo liter. Jeśli parzystą — środek to dwie litery stojące w samym środku; wypisz je jedną za drugą, bez spacji.'],
            input_format: ['Jeden wiersz z jednym słowem.'],
            output_format: ['Środkowa litera albo dwie środkowe litery.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.'],
            examples: [
                { input: 'domek', note: '5 liter: przed m stoją dwie litery i za m dwie.' },
                { input: 'okno', note: '4 litery: środek to k i n.' },
                { input: 'a' },
            ],
            hint: R`Dla nieparzystego n środek to s[n / 2] (dzielenie całkowite). Dla parzystego środkowe są s[n / 2 - 1] i s[n / 2]. Sprawdź na kartce: dla n = 4 to pudełka 1 i 2.`,
            tests: (r) => ['domek', 'okno', 'a', 'ab', 'abc', 'olimpiada', 'programowanie', 'informatyka', 'matematyka',
                word(r, 99, 99), word(r, 100, 100), word(r, 2, 10), word(r, 2, 10)],
            solve: (inp) => { const s = inp.trim(); const n = s.length; return n % 2 ? s[(n - 1) / 2] : s[n / 2 - 1] + s[n / 2]; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    if (n % 2 == 1) {
        cout << s[n / 2] << "\n";
    } else {
        cout << s[n / 2 - 1] << s[n / 2] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-literowka', krok: 1, level: 'latwe',
            title: 'Poprawka literówki',
            short: 'Zamień p-tą literę słowa na podaną i wypisz poprawione słowo.',
            tags: ['s[p - 1] = c', 'char', 'numeracja od 1'],
            statement: ['Ktoś zrobił literówkę i wie dokładnie, gdzie: na pozycji p (liczonej od 1) stoi zła litera, a powinna stać litera c. Wczytaj słowo, liczbę p i literę c, popraw słowo i wypisz je.'],
            input_format: ['Jeden wiersz: słowo, liczba p i litera c, oddzielone spacjami.'],
            output_format: ['Poprawione słowo.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.', '1 ≤ p ≤ długość słowa', 'c to mała litera.'],
            examples: [
                { input: 'kpt 2 o', note: 'Druga litera (pudełko 1) zamienia się z p na o.' },
                { input: 'lekxja 4 c' },
            ],
            hint: R`Literę wczytasz do zmiennej char: char c; cin >> s >> p >> c;. Pozycja p liczona od 1 to pudełko p - 1, więc piszesz s[p - 1] = c;.`,
            check: (inp) => { const [s, p] = toks(inp); return Number(p) >= 1 && Number(p) <= s.length ? null : 'p poza słowem'; },
            tests: (r) => {
                const out = ['kpt 2 o', 'lekxja 4 c', 'a 1 b', 'kot 1 k', 'kot 3 d'];
                for (let i = 0; i < 6; i++) { const s = word(r, 1, 100); out.push(`${s} ${r.int(1, s.length)} ${r.word(1)}`); }
                return out;
            },
            solve: (inp) => { const [s, p, c] = toks(inp); const a = [...s]; a[Number(p) - 1] = c; return a.join(''); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int p;
    char c;
    cin >> s >> p >> c;
    s[p - 1] = c;
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-zamiana-koncow', krok: 1, level: 'latwe',
            title: 'Zamiana końców',
            short: 'Zamień miejscami pierwszą i ostatnią literę słowa.',
            tags: ['swap', 's[0]', 's[n - 1]'],
            statement: ['Wczytaj słowo, zamień miejscami jego pierwszą i ostatnią literę, a potem wypisz zmienione słowo. Słowo z jednej litery zostaje bez zmian.'],
            input_format: ['Jeden wiersz z jednym słowem.'],
            output_format: ['Słowo po zamianie.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.'],
            examples: [{ input: 'lato', note: 'l i o zamieniają się miejscami.' }, { input: 'kajak' }, { input: 'x' }],
            hint: R`Funkcję swap znasz z lekcji o tablicach: swap(s[0], s[n - 1]);. Działa też dla jednej litery — zamienia ją sama ze sobą.`,
            tests: (r) => ['lato', 'kajak', 'x', 'ab', 'olimpiada', 'zeszyt', word(r, 2, 5), word(r, 5, 30), word(r, 100, 100)],
            solve: (inp) => { const a = [...inp.trim()]; const n = a.length; [a[0], a[n - 1]] = [a[n - 1], a[0]]; return a.join(''); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    swap(s[0], s[n - 1]);
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-dluzsze-slowo', krok: 1, level: 'latwe',
            title: 'Które słowo dłuższe?',
            short: 'Z dwóch słów wypisz dłuższe, a przy remisie — oba.',
            tags: ['length()', 'porównanie długości', 'if / else'],
            statement: ['Wczytaj dwa słowa i wypisz to, które ma więcej liter. Jeśli oba mają tyle samo liter, wypisz oba w kolejności z wejścia, oddzielone spacją.'],
            input_format: ['Jeden wiersz z dwoma słowami oddzielonymi spacją.'],
            output_format: ['Dłuższe słowo albo — przy remisie — oba słowa.'],
            constraints: ['Każde słowo ma od 1 do 50 małych liter.'],
            examples: [{ input: 'kot kotek' }, { input: 'pies kota', note: 'Oba słowa mają po 4 litery — wypisujemy oba.' }],
            hint: R`Porównujesz długości, a nie same słowa: a.length() > b.length(). Trzy przypadki: pierwsze dłuższe, drugie dłuższe, równe — to łańcuch if, else if, else.`,
            tests: (r) => {
                const out = ['kot kotek', 'pies kota', 'olimpiada kot', 'a b', 'ab abc'];
                for (let i = 0; i < 6; i++) out.push(`${word(r, 1, 50)} ${word(r, 1, 50)}`);
                for (let i = 0; i < 3; i++) { const n = r.int(1, 50); out.push(`${r.word(n)} ${r.word(n)}`); }
                return out;
            },
            solve: (inp) => { const [a, b] = toks(inp); return a.length > b.length ? a : b.length > a.length ? b : `${a} ${b}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    if (a.length() > b.length()) {
        cout << a << "\n";
    } else if (b.length() > a.length()) {
        cout << b << "\n";
    } else {
        cout << a << " " << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-bezpieczny-indeks', krok: 1, level: 'srednie',
            title: 'Czy jest taka pozycja?',
            short: 'Pytania o znaki na pozycjach — także na takich, których w napisie nie ma.',
            tags: ['0 ≤ i < n', 'poza napisem', 'int n = s.length()'],
            statement: ['Wczytaj słowo, a potem q pytań. Każde pytanie to numer pozycji i, liczony od zera — tak jak indeksy w C++. Dla każdego pytania wypisz znak stojący na pozycji i albo słowo BRAK, jeśli takiej pozycji w słowie nie ma. Uwaga: numery mogą być ujemne albo za duże.'],
            input_format: ['W pierwszym wierszu słowo.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb całkowitych — numery pozycji.'],
            output_format: ['q wierszy: znak albo BRAK.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.', '1 ≤ q ≤ 100', '−1000 ≤ i ≤ 1000'],
            examples: [{ input: 'kot\n5\n0 2 3 -1 1', note: 'Pozycje 0, 1 i 2 istnieją (k, o, t). Pozycji 3 i −1 nie ma.' }],
            hint: R`Najpierw sprawdź, czy pozycja istnieje: if (i >= 0 && i < n), a dopiero potem zajrzyj do s[i]. Zapisz długość w int n = s.length(); — porównanie ujemnego int z samym s.length() dałoby zły wynik, bo długość nie zna liczb ujemnych.`,
            tests: (r) => {
                const out = ['kot\n5\n0 2 3 -1 1'];
                const q = (s, k) => { const n = s.length; return `${s}\n${k}\n${Array.from({ length: k }, () => r.pick([r.int(0, n - 1), r.int(0, n - 1), r.int(-1000, 1000), n, -1, r.int(n, n + 5)])).join(' ')}`; };
                out.push('a\n3\n0 1 -1');
                for (let i = 0; i < 5; i++) out.push(q(word(r, 1, 100), r.int(1, 100)));
                out.push(q(word(r, 100, 100), 100));
                return out;
            },
            solve: (inp) => { const t = toks(inp); const s = t[0], q = Number(t[1]); return t.slice(2, 2 + q).map(Number).map((i) => (i >= 0 && i < s.length ? s[i] : 'BRAK')).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int q;
    cin >> s >> q;
    int n = s.length();
    for (int k = 0; k < q; k++) {
        int i;
        cin >> i;
        if (i >= 0 && i < n) {
            cout << s[i] << "\n";
        } else {
            cout << "BRAK\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-takie-same-konce', krok: 1, level: 'latwe',
            title: 'Takie same końce',
            short: 'Ile słów zaczyna się i kończy tą samą literą?',
            tags: ['s[0] == s[n - 1]', 'licznik', 'n słów'],
            statement: ['Wczytaj n słów i policz, ile z nich zaczyna się i kończy tą samą literą. Słowo z jednej litery też się liczy — jego pierwsza litera jest zarazem ostatnią.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów oddzielonych spacjami.'],
            output_format: ['Jedna liczba — ile słów ma takie same końce.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 20 małych liter.'],
            examples: [{ input: '5\nkajak anna kot zeszyt a', note: 'Pasują kajak, anna i a. Kot kończy się na t, a zeszyt na t, choć zaczyna na z.' }],
            hint: R`Słowa możesz wczytywać po kolei do jednej zmiennej string w pętli for — nie trzeba ich pamiętać. Dla każdego sprawdź s[0] == s[s.length() - 1].`,
            tests: (r) => {
                const out = ['5\nkajak anna kot zeszyt a', '1\nx', '3\nab ba aa'];
                const gen = (n) => Array.from({ length: n }, () => { const w = word(r, 1, 20); return r() < 0.3 ? w + w[0] : w; });
                for (const n of [10, 50, 300, 1000]) out.push(`${n}\n${gen(n).join(' ')}`);
                out.push(`6\n${['radar', 'kajak', 'anna', 'oko', 'zakaz', 'ala'].join(' ')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); return String(t.slice(1, 1 + n).filter((w) => w[0] === w[w.length - 1]).length); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        if (s[0] == s[s.length() - 1]) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · wczytywanie
        {
            id: 'str-slowo-pod-slowem', krok: 2, level: 'latwe',
            title: 'Słowo pod słowem',
            short: 'Wczytuj słowa aż do końca danych i wypisz każde w osobnym wierszu razem z długością.',
            tags: ['while (cin >> s)', 'odstępy', 'length()'],
            statement: ['Na wejściu jest tekst: słowa oddzielone spacjami albo Enterami — czasem kilkoma naraz. Wypisz każde słowo w osobnym wierszu, a za nim, po spacji, jego długość. Słowo to ciąg znaków bez odstępów, razem z przecinkami i kropkami, jeśli stoją przy nim.'],
            input_format: ['Tekst w jednym lub wielu wierszach, aż do końca danych.'],
            output_format: ['Dla każdego słowa jeden wiersz: słowo, spacja i liczba jego znaków.'],
            constraints: ['Tekst ma od 1 do 1000 słów.', 'Każde słowo ma od 1 do 30 znaków.'],
            examples: [{ input: 'Ala  ma\nkota,   a kot\n\nma Ale.', note: 'Liczba spacji i pusty wiersz nie mają znaczenia — cin >> je pomija. „kota,” ma 5 znaków, bo przecinek należy do słowa.' }],
            hint: R`while (cin >> s) wczytuje kolejne słowa, dopóki są dane, i sam pomija wszystkie odstępy. W środku pętli wypisz s, spację i s.length().`,
            tests: (r) => {
                const out = ['Ala  ma\nkota,   a kot\n\nma Ale.', 'x'];
                const tekst = (n) => {
                    let s = '';
                    for (let i = 0; i < n; i++) {
                        let w = r() < 0.8 ? slowo(r) : word(r, 1, 30);
                        if (r() < 0.2) w = w[0].toUpperCase() + w.slice(1);
                        if (r() < 0.15 && w.length < 30) w += r.pick([',', '.', '!', '?']);
                        s += (i ? r.pick([' ', ' ', ' ', '  ', '\n', '   ', '\n\n']) : '') + w;
                    }
                    return s;
                };
                for (const n of [5, 30, 200, 1000]) out.push(tekst(n));
                return out;
            },
            solve: (inp) => toks(inp).map((w) => `${w} ${w.length}`).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    while (cin >> s) {
        cout << s << " " << s.length() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-najkrotsze-slowo', krok: 2, level: 'latwe',
            title: 'Najkrótsze słowo',
            short: 'Czytaj słowa do końca danych. Które jest najkrótsze i które z kolei?',
            tags: ['while (cin >> s)', 'rekord', 'numer słowa'],
            statement: ['Wczytuj słowa aż do końca danych. Wypisz najkrótsze z nich, a po spacji jego numer — słowa numerujemy od 1 w kolejności z wejścia. Jeśli kilka słów jest równie krótkich, wybierz to, które pojawiło się najwcześniej.'],
            input_format: ['Tekst w jednym lub wielu wierszach, słowa oddzielone odstępami.'],
            output_format: ['Najkrótsze słowo i jego numer, oddzielone spacją.'],
            constraints: ['Tekst ma od 1 do 1000 słów.', 'Każde słowo ma od 1 do 30 małych liter.'],
            examples: [{ input: 'ala ma kota\na kot ma ale', note: 'Najkrótsze jest a (1 litera) — czwarte słowo. Słowo ma też jest krótkie, ale ma 2 litery.' }],
            hint: R`Licz słowa w zmiennej nr i pamiętaj rekord: najkrotsze i jego numer. Pierwsze słowo zawsze zostaje rekordem (np. zacznij od rekordu pustego i sprawdzaj nr == 1). Przy remisie nie zmieniaj rekordu — warunek to <, a nie <=.`,
            tests: (r) => {
                const out = ['ala ma kota\na kot ma ale', 'olimpiada', 'bb aa cc'];
                const tekst = (n, a, b) => Array.from({ length: n }, () => word(r, a, b)).join(r.pick([' ', '\n']));
                out.push(tekst(10, 2, 8), tekst(100, 3, 30), tekst(1000, 1, 30), tekst(500, 5, 6), `${tekst(200, 5, 20)} abcd ${tekst(50, 4, 20)}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); let b = 0; t.forEach((w, i) => { if (w.length < t[b].length) b = i; }); return `${t[b]} ${b + 1}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, najkrotsze = "";
    int nr = 0, gdzie = 0;
    while (cin >> s) {
        nr++;
        if (nr == 1 || s.length() < najkrotsze.length()) {
            najkrotsze = s;
            gdzie = nr;
        }
    }
    cout << najkrotsze << " " << gdzie << "\n";
    return 0;
}`,
        },
        {
            id: 'str-odwrocone-zdanie', krok: 2, level: 'latwe',
            title: 'Zdanie od końca',
            short: 'Wypisz słowa zdania w odwrotnej kolejności. Przyda się tablica napisów.',
            tags: ['string t[1005]', 'while (cin >> t[n])', 'od tyłu'],
            statement: ['Wczytaj zdanie i wypisz jego słowa w odwrotnej kolejności — od ostatniego do pierwszego — oddzielone pojedynczymi spacjami. Samych słów nie zmieniaj.'],
            input_format: ['Jeden wiersz ze słowami oddzielonymi spacjami.'],
            output_format: ['Te same słowa w odwrotnej kolejności.'],
            constraints: ['Zdanie ma od 1 do 1000 słów.', 'Każde słowo ma od 1 do 20 znaków (litery i znaki przestankowe).'],
            examples: [{ input: 'Ala ma kota' }, { input: 'raz dwa trzy cztery piec' }],
            hint: R`Słowa trzeba zapamiętać, bo ostatnie wypisujesz jako pierwsze: string t[1005]; — z zapasem. Wczytuj je pętlą while (cin >> t[n]) n++; — po pętli n to liczba słów. Potem wypisz od t[n - 1] w dół do t[0].`,
            tests: (r) => ['Ala ma kota', 'raz dwa trzy cztery piec', 'jedno', zdanie(r, 5, 10), zdanie(r, 50, 100), zdanie(r, 1000, 1000),
                Array.from({ length: 300 }, () => mix(r, word(r, 1, 20), 0.2)).join(' ')],
            solve: (inp) => toks(inp).reverse().join(' '),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string t[1005];
    int n = 0;
    while (cin >> t[n]) {
        n++;
    }
    for (int i = n - 1; i >= 0; i--) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-kara', krok: 2, level: 'latwe',
            title: 'Sto razy na tablicy',
            short: 'Liczba, a potem zdanie ze spacjami: wypisz je n razy z numerami. Pamiętaj o Enterze po liczbie!',
            tags: ['cin.ignore()', 'getline', 'pułapka z Enterem'],
            statement: ['Nauczycielka kazała przepisać zdanie n razy. Wczytaj liczbę n i zdanie, a potem wypisz n wierszy: w każdym numer (od 1), kropkę, spację i całe zdanie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu zdanie — może zawierać spacje.'],
            output_format: ['n wierszy w postaci „numer. zdanie”.'],
            constraints: ['1 ≤ n ≤ 100', 'Zdanie ma od 1 do 100 znaków.'],
            examples: [{ input: '3\nNie bede rozmawiac na lekcji.' }],
            hint: R`Po cin >> n na wejściu zostaje Enter. Zanim wczytasz zdanie przez getline(cin, zdanie), zjedz go: cin.ignore();. Bez tego getline wczyta pusty napis.`,
            tests: (r) => {
                const z = () => { const s = zdanie(r, 1, 12); return (s[0].toUpperCase() + s.slice(1)).slice(0, 99) + '.'; };
                return ['3\nNie bede rozmawiac na lekcji.', '1\nx', `2\n${z()}`, `10\n${z()}`, `100\n${z()}`, `57\n${z()}`, `5\nA  B   C`];
            },
            solve: (inp) => { const [a, b] = inp.split('\n'); return Array.from({ length: Number(a) }, (_, i) => `${i + 1}. ${b}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    string zdanie;
    cin >> n;
    cin.ignore();
    getline(cin, zdanie);
    for (int i = 1; i <= n; i++) {
        cout << i << ". " << zdanie << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-akrostych', krok: 2, level: 'latwe',
            title: 'Akrostych',
            short: 'Pierwsze litery wierszy wiersza (tego z rymami) układają się w ukryte słowo. Odczytaj je.',
            tags: ['while (getline)', 'empty()', 'linia[0]'],
            statement: ['Akrostych to wiersz, w którym pierwsze litery kolejnych wersów czytane z góry na dół tworzą ukryte słowo. Na wejściu jest taki wiersz: kolejne wersy w kolejnych wierszach, a między zwrotkami mogą stać puste wiersze. Wypisz ukryte słowo — pierwsze znaki wszystkich niepustych wierszy, jeden za drugim.'],
            input_format: ['Tekst w wielu wierszach, aż do końca danych. Niektóre wiersze mogą być puste. Niepusty wiersz nie zaczyna się od spacji.'],
            output_format: ['Jedno słowo — pierwsze znaki niepustych wierszy.'],
            constraints: ['Tekst ma od 1 do 1000 wierszy, w tym co najmniej jeden niepusty.', 'Każdy wiersz ma najwyżej 100 znaków.'],
            examples: [{ input: 'Kot siedzi na plotku\nOpowiada bajki\n\nTak mija mu dzien', note: 'Pusty wiersz pomijamy. Zostają K, O i T.' }],
            hint: R`Wczytuj wiersze pętlą while (getline(cin, linia)). Pusty wiersz nie ma znaku linia[0] — najpierw sprawdź if (!linia.empty()), a dopiero potem dopisz linia[0] do wyniku.`,
            tests: (r) => {
                const out = ['Kot siedzi na plotku\nOpowiada bajki\n\nTak mija mu dzien', 'Jedyny wiersz'];
                const wiersz = (haslo, puste) => [...haslo].map((c, i) => {
                    const w = c + zdanie(r, 1, 10).slice(0, 80);
                    return (i && r() < puste ? '\n' : '') + w;
                }).join('\n');
                out.push(wiersz('OLIMPIADA', 0.3), wiersz('PROGRAMISTA', 0), wiersz('NapisyWCplusplus', 0.2));
                out.push(wiersz(znaki(r, 300, WIELKIE + LITERY), 0.1), wiersz(znaki(r, 700, WIELKIE), 0.4));
                return out;
            },
            solve: (inp) => lines(inp).filter((l) => l.length).map((l) => l[0]).join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string linia, haslo = "";
    while (getline(cin, linia)) {
        if (!linia.empty()) {
            haslo += linia[0];
        }
    }
    cout << haslo << "\n";
    return 0;
}`,
        },
        {
            id: 'str-najdluzszy-wiersz', krok: 2, level: 'latwe',
            title: 'Najdłuższy wiersz',
            short: 'Który wiersz tekstu jest najdłuższy? Spacje też się liczą.',
            tags: ['while (getline)', 'rekord', 'length()'],
            statement: ['Wczytaj tekst wiersz po wierszu aż do końca danych. Znajdź najdłuższy wiersz — liczą się wszystkie znaki, także spacje. Wypisz jego numer (wiersze numerujemy od 1), a w drugim wierszu wyjścia — sam ten wiersz. Jeśli kilka wierszy jest równie długich, wybierz pierwszy z nich.'],
            input_format: ['Tekst w jednym lub wielu wierszach. Wiersze mogą być puste i mogą zawierać spacje.'],
            output_format: ['W pierwszym wierszu numer najdłuższego wiersza.', 'W drugim wierszu ten wiersz.'],
            constraints: ['Tekst ma od 1 do 1000 wierszy.', 'Każdy wiersz ma najwyżej 100 znaków, co najmniej jeden wiersz jest niepusty.', 'Żaden wiersz nie kończy się spacją.'],
            examples: [{ input: 'Ala ma kota\nkot ma  Ale\n\nkoniec', note: 'Pierwszy i drugi wiersz mają po 11 znaków (w drugim są dwie spacje obok siebie). Wygrywa pierwszy.' }],
            hint: R`Licz wiersze w zmiennej nr i pamiętaj rekord: najdłuższy wiersz i jego numer. Zmieniaj rekord tylko przy wierszu ostro dłuższym (>), wtedy przy remisie zostanie pierwszy.`,
            tests: (r) => {
                const out = ['Ala ma kota\nkot ma  Ale\n\nkoniec', 'x'];
                const wiersz = () => (r() < 0.1 ? '' : zdanie(r, 1, 12).slice(0, 100).trim());
                for (const n of [5, 50, 1000]) out.push(Array.from({ length: n }, wiersz).join('\n').trim() || 'a');
                out.push('abc\nabd\nabe');
                return out;
            },
            solve: (inp) => { const L = lines(inp); let b = 0; L.forEach((l, i) => { if (l.length > L[b].length) b = i; }); return `${b + 1}\n${L[b]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string linia, najdluzszy = "";
    int nr = 0, gdzie = 0;
    while (getline(cin, linia)) {
        nr++;
        if (nr == 1 || linia.length() > najdluzszy.length()) {
            najdluzszy = linia;
            gdzie = nr;
        }
    }
    cout << gdzie << "\n" << najdluzszy << "\n";
    return 0;
}`,
        },
        {
            id: 'str-lista-zakupow', krok: 2, level: 'latwe',
            title: 'Lista zakupów',
            short: 'Produkty oddzielone przecinkami w jednym wierszu: wypisz je jako ponumerowaną listę.',
            tags: ['getline', 'cięcie po przecinku', 'kawałek += c'],
            statement: ['Lista zakupów jest zapisana w jednym wierszu: produkty oddzielone przecinkami, bez spacji wokół przecinków. Nazwa produktu może składać się z kilku słów. Wypisz produkty jako ponumerowaną listę — każdy w osobnym wierszu w postaci „numer. produkt” — a na końcu wiersz „Razem: k”, gdzie k to liczba produktów.'],
            input_format: ['Jeden wiersz: produkty oddzielone przecinkami.'],
            output_format: ['k wierszy listy i wiersz „Razem: k”.'],
            constraints: ['Na liście jest od 1 do 100 produktów.', 'Każdy produkt ma od 1 do 30 znaków (małe litery i spacje) i nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: 'chleb,mleko,ser zolty,jajka' }],
            hint: R`Wczytaj cały wiersz przez getline i idź po nim znak po znaku. Gdy trafisz na przecinek — kawałek jest gotowy: wypisz go i wyczyść. Każdy inny znak dopisz do kawałka. Po pętli wypisz ostatni kawałek, bo po nim nie ma przecinka.`,
            tests: (r) => {
                const prod = () => (r() < 0.25 ? `${slowo(r)} ${slowo(r)}` : slowo(r)).slice(0, 30).trim();
                return ['chleb,mleko,ser zolty,jajka', 'woda', 'a,b', Array.from({ length: 10 }, prod).join(','),
                    Array.from({ length: 100 }, prod).join(','), Array.from({ length: 37 }, prod).join(',')];
            },
            solve: (inp) => { const p = inp.split(','); return [...p.map((x, i) => `${i + 1}. ${x}`), `Razem: ${p.length}`].join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string linia, kawalek = "";
    getline(cin, linia);
    int k = 0;
    for (char c : linia) {
        if (c == ',') {
            k++;
            cout << k << ". " << kawalek << "\n";
            kawalek = "";
        } else {
            kawalek += c;
        }
    }
    k++;
    cout << k << ". " << kawalek << "\n";
    cout << "Razem: " << k << "\n";
    return 0;
}`,
        },
        {
            id: 'str-statystyka-tekstu', krok: 2, level: 'srednie',
            title: 'Statystyka tekstu',
            short: 'Ile tekst ma wierszy, słów i znaków? Program, który robi to samo co „wc” w Linuksie.',
            tags: ['while (getline)', 'początek słowa', 'trzy liczniki'],
            statement: ['W Linuksie jest program wc, który podaje statystykę tekstu. Napisz jego prostą wersję. Wczytaj tekst wiersz po wierszu aż do końca danych i wypisz trzy liczby: ile jest wierszy, ile słów i ile znaków. Słowo to ciąg znaków bez spacji, otoczony spacjami albo końcami wiersza. Znaki liczymy we wszystkich wierszach razem ze spacjami, ale bez znaków końca wiersza.'],
            input_format: ['Tekst w jednym lub wielu wierszach. Między słowami może być kilka spacji, wiersze mogą zaczynać się spacjami i mogą być puste.'],
            output_format: ['Trzy liczby oddzielone spacjami: liczba wierszy, słów i znaków.'],
            constraints: ['Tekst ma od 1 do 1000 wierszy, każdy najwyżej 100 znaków.', 'W tekście są tylko litery, cyfry, spacje i znaki przestankowe.'],
            examples: [{ input: 'Ala ma kota\n  a kot   ma Ale\n\nkoniec.', note: 'Wiersze: 4. Słowa: 3 + 4 + 0 + 1 = 8. Znaki: 11 + 16 + 0 + 7 = 34.' }],
            hint: R`Wiersze i znaki to proste: nr++ i znaki += linia.length() w każdym obrocie pętli z getline. Słowa policz w każdym wierszu osobno: słowo zaczyna się na pozycji i, gdy linia[i] nie jest spacją, a i == 0 albo linia[i - 1] jest spacją.`,
            tests: (r) => {
                const out = ['Ala ma kota\n  a kot   ma Ale\n\nkoniec.', 'x'];
                const wiersz = () => {
                    if (r() < 0.12) return '';
                    let s = r() < 0.2 ? ' '.repeat(r.int(1, 3)) : '';
                    const k = r.int(1, 10);
                    for (let i = 0; i < k; i++) s += (i ? ' '.repeat(r.pick([1, 1, 1, 2, 3])) : '') + (r() < 0.9 ? slowo(r) : word(r, 1, 8)) + (r() < 0.1 ? '.' : '');
                    return s.slice(0, 100).replace(/ +$/, '');
                };
                for (const n of [3, 20, 200, 1000]) out.push(['Start', ...Array.from({ length: n }, wiersz)].join('\n').replace(/\s+$/, ''));
                return out;
            },
            solve: (inp) => { const L = lines(inp); const w = L.reduce((a, l) => a + l.split(' ').filter(Boolean).length, 0); return `${L.length} ${w} ${L.reduce((a, l) => a + l.length, 0)}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string linia;
    int wiersze = 0, slowa = 0, znaki = 0;
    while (getline(cin, linia)) {
        wiersze++;
        int n = linia.length();
        znaki += n;
        for (int i = 0; i < n; i++) {
            if (linia[i] != ' ' && (i == 0 || linia[i - 1] == ' ')) {
                slowa++;
            }
        }
    }
    cout << wiersze << " " << slowa << " " << znaki << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · znak po znaku
        {
            id: 'str-cztery-liczniki', krok: 3, level: 'latwe',
            title: 'Cztery liczniki',
            short: 'Policz w wierszu wielkie litery, małe litery, cyfry i całą resztę.',
            tags: ['isupper', 'islower', 'isdigit'],
            statement: ['Wczytaj wiersz tekstu i policz w nim cztery rodzaje znaków: wielkie litery, małe litery, cyfry i wszystkie pozostałe znaki (spacje, znaki przestankowe i inne). Wypisz cztery liczby w tej kolejności.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Cztery liczby oddzielone spacjami: wielkie litery, małe litery, cyfry, pozostałe znaki.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'Ala ma 2 koty!', note: 'Wielka: A. Małe: l, a, m, a, k, o, t, y. Cyfra: 2. Pozostałe: trzy spacje i wykrzyknik.' }],
            hint: R`Cztery liczniki i łańcuch if, else if, else: isupper(c), islower(c), isdigit(c), a w else — reszta. Wiersz ze spacjami wczytasz przez getline.`,
            tests: (r) => ['Ala ma 2 koty!', 'x', '2026', 'ABC def 123 !?.', znaki(r, 50, LITERY + WIELKIE + CYFRY + ' .,!?-'),
                znaki(r, 1000, LITERY + LITERY + WIELKIE + CYFRY + ' .,!?-:;()'), `Tel. 600-100-200, ${zdanie(r, 5, 10)}`],
            solve: (inp) => { const s = inp; let u = 0, l = 0, d = 0, o = 0; for (const c of s) { if (isUp(c)) u++; else if (isLow(c)) l++; else if (isDig(c)) d++; else o++; } return `${u} ${l} ${d} ${o}`; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int wielkie = 0, male = 0, cyfry = 0, inne = 0;
    for (char c : s) {
        if (isupper(c)) {
            wielkie++;
        } else if (islower(c)) {
            male++;
        } else if (isdigit(c)) {
            cyfry++;
        } else {
            inne++;
        }
    }
    cout << wielkie << " " << male << " " << cyfry << " " << inne << "\n";
    return 0;
}`,
        },
        {
            id: 'str-ukryta-wiadomosc', krok: 3, level: 'latwe',
            title: 'Ukryta wiadomość',
            short: 'Szpieg ukrywa wiadomość w wielkich literach zwykłego zdania. Odczytaj ją.',
            tags: ['isupper', 'budowanie napisu', 'BRAK'],
            statement: ['Szpieg ukrywa wiadomości w zwykłych zdaniach: wielkie litery czytane po kolei, od lewej do prawej, tworzą tajne słowo. Wczytaj wiersz tekstu i wypisz wszystkie wielkie litery w kolejności, w jakiej występują, jedna za drugą. Jeśli w tekście nie ma ani jednej wielkiej litery, wypisz BRAK.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Ukryte słowo albo BRAK.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'ala ma Kota, ktOry lubi mleko Taty' }, { input: 'tu nic nie ma' }],
            hint: R`Zbuduj nowy napis: zacznij od pustego i dopisuj każdy znak, dla którego isupper(c) jest prawdą. Na końcu sprawdź, czy napis jest pusty — wtedy wypisz BRAK.`,
            tests: (r) => {
                const out = ['ala ma Kota, ktOry lubi mleko Taty', 'tu nic nie ma', 'X', 'ABC'];
                const ukryj = (haslo, szum) => {
                    let s = '';
                    for (const c of haslo) { s += zdanie(r, 0, szum).replace(/^/, ' ') + ' ' + slowo(r).slice(0, 3) + c.toUpperCase() + r.word(r.int(0, 4)); }
                    return s.trim().slice(0, 1000);
                };
                out.push(ukryj('SZPIEG', 3), ukryj('OLIMPIADAINFORMATYCZNA', 4), ukryj(r.word(60), 6), zdanie(r, 30, 60));
                return out;
            },
            solve: (inp) => { const w = [...inp].filter(isUp).join(''); return w || 'BRAK'; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, w = "";
    getline(cin, s);
    for (char c : s) {
        if (isupper(c)) {
            w += c;
        }
    }
    if (w.empty()) {
        cout << "BRAK\n";
    } else {
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-gdzie-cyfry', krok: 3, level: 'latwe',
            title: 'Gdzie są cyfry?',
            short: 'Znajdź pozycję pierwszej i ostatniej cyfry w napisie.',
            tags: ['isdigit', 'break', '-1 = nie ma'],
            statement: ['Wczytaj napis złożony z liter i cyfr. Wypisz pozycję pierwszej cyfry i pozycję ostatniej cyfry, licząc pozycje od zera. Jeśli w napisie jest tylko jedna cyfra, obie pozycje są takie same. Jeśli nie ma żadnej cyfry, wypisz BRAK.'],
            input_format: ['Jeden wiersz z napisem bez spacji.'],
            output_format: ['Dwie liczby oddzielone spacją albo BRAK.'],
            constraints: ['Napis ma od 1 do 1000 znaków — małych liter i cyfr.'],
            examples: [{ input: 'abc7de9f' }, { input: 'ala5' }, { input: 'kot' }],
            hint: R`Zacznij od pierwsza = -1 i ostatnia = -1. Pierwszą znajdziesz pętlą z break, ostatnią — pętlą bez break (albo pętlą od końca z break). Jeśli pierwsza wciąż jest -1, cyfr nie ma.`,
            tests: (r) => ['abc7de9f', 'ala5', 'kot', '1', '12345', 'a1', '9z', znaki(r, 100, LITERY + LITERY + CYFRY), znaki(r, 1000, LITERY),
                `${znaki(r, 500, LITERY)}7${znaki(r, 499, LITERY)}`, znaki(r, 1000, LITERY.repeat(10) + CYFRY)],
            solve: (inp) => { const s = inp; const a = [...s].findIndex(isDig); if (a < 0) return 'BRAK'; let b = s.length - 1; while (!isDig(s[b])) b--; return `${a} ${b}`; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    int pierwsza = -1, ostatnia = -1;
    for (int i = 0; i < n; i++) {
        if (isdigit(s[i])) {
            pierwsza = i;
            break;
        }
    }
    for (int i = n - 1; i >= 0; i--) {
        if (isdigit(s[i])) {
            ostatnia = i;
            break;
        }
    }
    if (pierwsza == -1) {
        cout << "BRAK\n";
    } else {
        cout << pierwsza << " " << ostatnia << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-slowo-alfabetyczne', krok: 3, level: 'latwe',
            title: 'Słowo alfabetyczne',
            short: 'Czy litery słowa idą w kolejności alfabetu? „almost” — tak, „kotek” — nie.',
            tags: ['s[i] i s[i + 1]', 'i < n - 1', 'flaga'],
            statement: ['Słowo nazwiemy alfabetycznym, jeśli jego litery czytane od lewej idą w kolejności alfabetu — każda następna litera jest taka sama jak poprzednia albo dalej w alfabecie. Na przykład „almost” (a, l, m, o, s, t) i „kot” (k, o, t) są alfabetyczne, a „kotek” nie, bo po t stoi e. Dla każdego z n słów wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym słowie.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', 'Każde słowo ma od 1 do 100 małych liter.'],
            examples: [{ input: '5\nalmost\nkot\nkotek\naabbz\nzz' }],
            hint: R`Znaki porównujesz tak jak liczby: s[i] > s[i + 1] znaczy, że następna litera jest wcześniej w alfabecie — słowo nie jest alfabetyczne. Pętla po sąsiadach: i od 0 do n - 2, czyli i < n - 1. Flaga startuje od true.`,
            tests: (r) => {
                const out = ['5\nalmost\nkot\nkotek\naabbz\nzz'];
                const rosnace = (n) => [...r.word(n)].sort().join('');
                const lista = (k) => Array.from({ length: k }, () => (r() < 0.5 ? rosnace(r.int(1, 100)) : r() < 0.5 ? word(r, 1, 6) : slowo(r)));
                out.push(`3\na\nab\nba`, `10\n${lista(10).join('\n')}`, `100\n${lista(100).join('\n')}`,
                    `4\n${rosnace(100)}\n${rosnace(99)}b\n${'a'.repeat(100)}\n${'z'.repeat(99)}a`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])).map((s) => ([...s].every((c, i) => i === 0 || s[i - 1] <= c) ? 'TAK' : 'NIE')).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string s;
        cin >> s;
        int n = s.length();
        bool ok = true;
        for (int i = 0; i < n - 1; i++) {
            if (s[i] > s[i + 1]) {
                ok = false;
                break;
            }
        }
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-najdluzszy-ciag-cyfr', krok: 3, level: 'srednie',
            title: 'Najdłuższy ciąg cyfr',
            short: 'Znajdź w napisie najdłuższy kawałek złożony z samych cyfr stojących obok siebie.',
            tags: ['isdigit', 'bieżąca seria', 'rekord'],
            statement: ['Wczytaj napis złożony z liter i cyfr. Znajdź najdłuższy fragment, w którym stoją same cyfry, jedna obok drugiej (cyfry mogą być różne). Wypisz jego długość, a po spacji — sam ten fragment. Jeśli takich najdłuższych fragmentów jest kilka, wypisz pierwszy z nich. Jeśli w napisie nie ma cyfr, wypisz 0.'],
            input_format: ['Jeden wiersz z napisem bez spacji.'],
            output_format: ['Długość najdłuższego ciągu cyfr i ten ciąg albo samo 0.'],
            constraints: ['Napis ma od 1 do 1000 znaków — małych liter i cyfr.'],
            examples: [
                { input: 'ab123c45678d9', note: 'Ciągi cyfr to 123, 45678 i 9. Najdłuższy ma 5 cyfr.' },
                { input: 'x12y34', note: '12 i 34 mają po dwie cyfry — wypisujemy pierwszy.' },
                { input: 'kot' },
            ],
            hint: R`To schemat serii z lekcji, tylko warunek jest inny: seria trwa, dopóki znaki są cyframi. Pamiętaj długość bieżącego ciągu (zeruj ją na literze) i rekord razem z pozycją, na której rekordowy ciąg się kończy. Sam ciąg możesz też budować w napisie: bieżący += c, a na literze bieżący = "".`,
            tests: (r) => ['ab123c45678d9', 'x12y34', 'kot', '7', '1234567890', 'a1b2c3', znaki(r, 200, LITERY + CYFRY.repeat(3)),
                znaki(r, 1000, LITERY + CYFRY), znaki(r, 1000, LITERY + LITERY), `${znaki(r, 300, LITERY + CYFRY)}x${znaki(r, 40, CYFRY)}y${znaki(r, 300, LITERY + CYFRY)}`],
            solve: (inp) => { const m = inp.match(/\d+/g); if (!m) return '0'; let b = m[0]; for (const x of m) if (x.length > b.length) b = x; return `${b.length} ${b}`; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, biezacy = "", najlepszy = "";
    cin >> s;
    for (char c : s) {
        if (isdigit(c)) {
            biezacy += c;
            if (biezacy.length() > najlepszy.length()) {
                najlepszy = biezacy;
            }
        } else {
            biezacy = "";
        }
    }
    if (najlepszy.empty()) {
        cout << 0 << "\n";
    } else {
        cout << najlepszy.length() << " " << najlepszy << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-silne-haslo', krok: 3, level: 'srednie',
            title: 'Silne hasło',
            short: 'Hasło jest silne, gdy ma 8 znaków, małą i wielką literę, cyfrę i znak specjalny.',
            tags: ['flagi', 'islower / isupper', 'isdigit'],
            statement: ['Serwis wymaga silnych haseł. Hasło jest silne, gdy spełnia wszystkie pięć warunków: ma co najmniej 8 znaków, zawiera co najmniej jedną małą literę, co najmniej jedną wielką literę, co najmniej jedną cyfrę i co najmniej jeden znak specjalny — czyli znak, który nie jest ani literą, ani cyfrą. Dla każdego z n haseł wypisz SILNE albo SLABE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym haśle (bez spacji).'],
            output_format: ['n wierszy: SILNE albo SLABE.'],
            constraints: ['1 ≤ n ≤ 100', 'Każde hasło ma od 1 do 50 znaków: liter, cyfr i znaków !@#$%^&*-_.?'],
            examples: [{ input: '4\nKot123!x\nkot123!x\nAla!1\nTo-Jest-Haslo-2026', note: 'Drugie nie ma wielkiej litery, trzecie ma tylko 5 znaków. Pierwsze i czwarte spełniają wszystkie warunki.' }],
            hint: R`Dla każdego hasła ustaw cztery flagi na false (mala, wielka, cyfra, specjalny) i przejdź po znakach. Znak specjalny to taki, dla którego !isalnum(c). Na końcu hasło jest silne, gdy długość ≥ 8 i wszystkie cztery flagi są prawdziwe.`,
            tests: (r) => {
                const SPEC = '!@#$%^&*-_.?';
                const haslo = () => {
                    const zestaw = r.pick([LITERY, LITERY + CYFRY, LITERY + WIELKIE + CYFRY, LITERY + WIELKIE + CYFRY + SPEC, LITERY + SPEC + CYFRY, WIELKIE + CYFRY + SPEC]);
                    return znaki(r, r.pick([r.int(1, 7), 8, r.int(8, 50)]), zestaw);
                };
                const out = ['4\nKot123!x\nkot123!x\nAla!1\nTo-Jest-Haslo-2026', '3\nAa1!aaaa\nAa1!aaa\nAAAAAAAAAA'];
                out.push(`20\n${Array.from({ length: 20 }, haslo).join('\n')}`, `100\n${Array.from({ length: 100 }, haslo).join('\n')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])).map((s) => (s.length >= 8 && [...s].some(isLow) && [...s].some(isUp) && [...s].some(isDig) && [...s].some((c) => !isAlpha(c) && !isDig(c)) ? 'SILNE' : 'SLABE')).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string s;
        cin >> s;
        bool mala = false, wielka = false, cyfra = false, specjalny = false;
        for (char c : s) {
            if (islower(c)) mala = true;
            if (isupper(c)) wielka = true;
            if (isdigit(c)) cyfra = true;
            if (!isalnum(c)) specjalny = true;
        }
        if (s.length() >= 8 && mala && wielka && cyfra && specjalny) {
            cout << "SILNE\n";
        } else {
            cout << "SLABE\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-nazwa-zmiennej', krok: 3, level: 'srednie',
            title: 'Poprawna nazwa zmiennej',
            short: 'Czy kompilator C++ przyjmie taką nazwę zmiennej? Sprawdź pierwszy znak i całą resztę.',
            tags: ['isalpha', 'isalnum', 'pierwszy znak osobno'],
            statement: ['W C++ nazwa zmiennej musi spełniać dwa warunki: pierwszy znak to litera albo podkreślnik _, a każdy kolejny znak to litera, cyfra albo podkreślnik. Dla każdego z n napisów wypisz TAK, jeśli mógłby być nazwą zmiennej, albo NIE w przeciwnym razie. (Słowa zarezerwowane, takie jak int czy for, pomijamy — traktujemy je jak zwykłe nazwy.)'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym napisie bez spacji.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', 'Każdy napis ma od 1 do 30 znaków: liter, cyfr i znaków _ - $ . #'],
            examples: [{ input: '6\nsuma\n_licznik2\n2liczba\nmoja-zmienna\nMAX_N\nx', note: 'Trzeci zaczyna się cyfrą, czwarty ma minus w środku.' }],
            hint: R`Najpierw sprawdź s[0]: isalpha(s[0]) || s[0] == '_'. Potem pętla od i = 1: każdy znak musi spełniać isalnum(s[i]) || s[i] == '_'. Jedna flaga ok wystarczy.`,
            tests: (r) => {
                const zn = LITERY + WIELKIE + CYFRY + '_';
                const nazwa = () => {
                    const k = r.int(1, 30);
                    let s = znaki(r, k, zn);
                    if (r() < 0.25) { const p = r.int(0, k - 1); s = s.slice(0, p) + r.pick(['-', '$', '.', '#']) + s.slice(p + 1); }
                    if (r() < 0.2) s = r.pick(CYFRY) + s.slice(1);
                    if (r() < 0.15) s = '_' + s.slice(1);
                    return s;
                };
                const out = ['6\nsuma\n_licznik2\n2liczba\nmoja-zmienna\nMAX_N\nx', '4\n_\n__\n9\n_9'];
                out.push(`30\n${Array.from({ length: 30 }, nazwa).join('\n')}`, `100\n${Array.from({ length: 100 }, nazwa).join('\n')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])).map((s) => (/^[A-Za-z_][A-Za-z0-9_]*$/.test(s) ? 'TAK' : 'NIE')).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string s;
        cin >> s;
        int n = s.length();
        bool ok = isalpha(s[0]) || s[0] == '_';
        for (int i = 1; i < n; i++) {
            if (!isalnum(s[i]) && s[i] != '_') {
                ok = false;
            }
        }
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-ile-zdan', krok: 3, level: 'srednie',
            title: 'Ile zdań?',
            short: 'Zdanie kończy się kropką, wykrzyknikiem albo pytajnikiem. Ale „...” i „?!” to jedno zakończenie!',
            tags: ['s[i + 1]', 'koniec grupy', 'i == n - 1 ||'],
            statement: ['Wczytaj wiersz tekstu i policz, ile jest w nim zdań. Zdanie kończy się kropką, wykrzyknikiem albo pytajnikiem. Kilka takich znaków stojących bezpośrednio obok siebie — na przykład „...”, „!!!” albo „?!” — to jedno zakończenie zdania. Tekst zawsze kończy się zakończeniem zdania.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Liczba zdań.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.', 'Tekst kończy się jednym ze znaków . ! ?'],
            examples: [{ input: 'Ala ma kota. Kot ma Ale!!! Czy to prawda?! Tak...', note: 'Zakończenia to „.”, „!!!”, „?!” i „...” — cztery zdania.' }],
            hint: R`Licz koniec każdej grupy znaków kończących: pozycję i, na której stoi . ! albo ?, a następny znak nie jest żadnym z nich — albo i to ostatnia pozycja. Warunek i == n - 1 || ... postaw na początku, żeby nie zajrzeć do s[n].`,
            tests: (r) => {
                const kon = () => r.pick(['.', '.', '.', '!', '?', '...', '!!!', '?!', '!?', '..']);
                const tekst = (k) => Array.from({ length: k }, () => { const z = zdanie(r, 1, 8); return z[0].toUpperCase() + z.slice(1) + kon(); }).join(' ');
                return ['Ala ma kota. Kot ma Ale!!! Czy to prawda?! Tak...', '.', 'Tak!', '?!?!?!', 'a.b.c.', tekst(5), tekst(30), tekst(80).slice(0, 990).replace(/[^.!?]*$/, '') || 'X.'];
            },
            check: (inp) => (/[.!?]$/.test(inp) ? null : 'tekst nie kończy się zakończeniem zdania'),
            solve: (inp) => String((inp.match(/[.!?]+/g) || []).length),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int n = s.length();
    int zdania = 0;
    for (int i = 0; i < n; i++) {
        bool koniec = (s[i] == '.' || s[i] == '!' || s[i] == '?');
        if (!koniec) continue;
        if (i == n - 1 || (s[i + 1] != '.' && s[i + 1] != '!' && s[i + 1] != '?')) {
            zdania++;
        }
    }
    cout << zdania << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · budowanie napisów
        {
            id: 'str-nazwisko-ladnie', krok: 4, level: 'latwe',
            title: 'Nazwisko z wielkiej litery',
            short: 'kOWALSKI → Kowalski: pierwsza litera wielka, reszta małe.',
            tags: ['toupper', 'tolower', 'zmiana w miejscu'],
            statement: ['W bazie danych nazwiska są zapisane byle jak: raz wielkimi literami, raz małymi, a czasem na zmianę. Popraw je. Dla każdego z n nazwisk wypisz je tak, by pierwsza litera była wielka, a wszystkie pozostałe — małe.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym nazwisku (same litery).'],
            output_format: ['n wierszy z poprawionymi nazwiskami.'],
            constraints: ['1 ≤ n ≤ 100', 'Każde nazwisko ma od 1 do 30 liter.'],
            examples: [{ input: '3\nkOWALSKI\nnowak\nWISNIEWSKA' }],
            hint: R`Zmieniaj w miejscu: najpierw w pętli zamień wszystkie znaki na małe (s[i] = tolower(s[i])), a potem s[0] = toupper(s[0]). Wynik tolower i toupper zapisany do s[i] sam staje się znakiem.`,
            tests: (r) => {
                const NAZ = ['kowalski', 'nowak', 'wisniewska', 'wojcik', 'kaminski', 'lewandowska', 'zielinski', 'szymanska', 'wozniak', 'dabrowski', 'kozlowska', 'jankowski', 'mazur', 'krawczyk', 'piotrowski', 'grabowska', 'nowakowski', 'pawlowska', 'michalski', 'krol'];
                const out = ['3\nkOWALSKI\nnowak\nWISNIEWSKA', '2\nx\nY'];
                out.push(`20\n${Array.from({ length: 20 }, () => mix(r, r.pick(NAZ), r.pick([0, 0.3, 0.5, 1]))).join('\n')}`);
                out.push(`100\n${Array.from({ length: 100 }, () => mix(r, word(r, 1, 30), r.pick([0.1, 0.5, 0.9]))).join('\n')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])).map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string s;
        cin >> s;
        int n = s.length();
        for (int i = 0; i < n; i++) {
            s[i] = tolower(s[i]);
        }
        s[0] = toupper(s[0]);
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-odwrotna-wielkosc', krok: 4, level: 'latwe',
            title: 'Odwrotna wielkość liter',
            short: 'Przypadkiem włączony Caps Lock: zamień małe litery na wielkie, a wielkie na małe.',
            tags: ['isupper / islower', 'for (char &c : s)', 'zmiana w miejscu'],
            statement: ['Ktoś pisał z włączonym klawiszem Caps Lock i wyszło mu „aLA MA KOTA”. Napraw tekst: każdą małą literę zamień na wielką, a każdą wielką — na małą. Pozostałe znaki zostaw bez zmian.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Ten sam wiersz z odwróconą wielkością liter.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'aLA MA KOTA, A kOT MA aLE!' }],
            hint: R`Pętla for (char &c : s) — z &, żeby zmieniać prawdziwe znaki. Jeśli isupper(c) — c = tolower(c); w przeciwnym razie, jeśli islower(c) — c = toupper(c). Uważaj na dwa osobne if-y: wielka litera zamieniona na małą nie może od razu wrócić na wielką.`,
            tests: (r) => ['aLA MA KOTA, A kOT MA aLE!', 'x', 'X', '123 !?', mix(r, zdanie(r, 5, 10), 0.5), znaki(r, 1000, LITERY + WIELKIE + CYFRY + ' .,!?'),
                zdanie(r, 30, 50).toUpperCase()],
            solve: (inp) => [...inp].map((c) => (isUp(c) ? c.toLowerCase() : isLow(c) ? c.toUpperCase() : c)).join(''),
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    for (char &c : s) {
        if (isupper(c)) {
            c = tolower(c);
        } else if (islower(c)) {
            c = toupper(c);
        }
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-bez-samoglosek', krok: 4, level: 'latwe',
            title: 'Bez samogłosek',
            short: 'Usuń z tekstu wszystkie samogłoski — małe i wielkie. Zostanie szkielet: „Prgrmwn”.',
            tags: ['budowanie od ""', 'tolower', 'filtrowanie'],
            statement: ['Wczytaj wiersz tekstu i wypisz go bez samogłosek. Samogłoski to litery a, e, i, o, u, y — zarówno małe, jak i wielkie. Wszystkie pozostałe znaki, także spacje, zostają na swoich miejscach.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Ten sam tekst bez samogłosek.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.', 'Po usunięciu samogłosek zostaje co najmniej jeden znak, który nie jest spacją.'],
            examples: [{ input: 'Programowanie jest super' }, { input: 'Ala ma kota' }],
            hint: R`Znaki znikają, więc buduj nowy napis od "". Żeby nie pisać dwunastu porównań, sprowadź znak do małej litery: char m = tolower(c); i porównuj m z a, e, i, o, u, y. Do wyniku dopisuj oryginalny znak c.`,
            check: (inp) => ([...inp].some((c) => c !== ' ' && !SAM.includes(c)) ? null : 'zostałyby same spacje'),
            tests: (r) => ['Programowanie jest super', 'Ala ma kota', 'x', 'AEIOUY bcd', mix(r, zdanie(r, 5, 10), 0.3), zdanie(r, 50, 100).slice(0, 1000).trim(),
                znaki(r, 1000, LITERY + WIELKIE + ' .,!?')],
            solve: (inp) => [...inp].filter((c) => !SAM.includes(c)).join(''),
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, w = "";
    getline(cin, s);
    for (char c : s) {
        char m = tolower(c);
        if (m != 'a' && m != 'e' && m != 'i' && m != 'o' && m != 'u' && m != 'y') {
            w += c;
        }
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-rosnace-powtorzenia', krok: 4, level: 'latwe',
            title: 'Rosnące powtórzenia',
            short: 'abc → a-bb-ccc: pierwsza litera raz, druga dwa razy, trzecia trzy razy…',
            tags: ['string(k, c)', 'separator', 'budowanie'],
            statement: ['Wczytaj słowo i zbuduj z niego nowy napis: pierwsza litera powtórzona raz, druga — dwa razy, trzecia — trzy razy i tak dalej. Kolejne grupy oddziel myślnikiem. Na przykład z „abc” powstaje „a-bb-ccc”.'],
            input_format: ['Jeden wiersz z jednym słowem.'],
            output_format: ['Zbudowany napis.'],
            constraints: ['Słowo ma od 1 do 50 liter.'],
            examples: [{ input: 'abc' }, { input: 'Kot' }],
            hint: R`Litera s[i] stoi w grupie, która ma i + 1 powtórzeń — gotowy kawałek to string(i + 1, s[i]). Myślnik dopisuj przed każdą grupą oprócz pierwszej: if (i > 0) w += "-";.`,
            tests: (r) => ['abc', 'Kot', 'x', 'ab', mix(r, word(r, 5, 10), 0.3), word(r, 50, 50), mix(r, word(r, 20, 40), 0.5)],
            solve: (inp) => [...inp.trim()].map((c, i) => c.repeat(i + 1)).join('-'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, w = "";
    cin >> s;
    int n = s.length();
    for (int i = 0; i < n; i++) {
        if (i > 0) {
            w += "-";
        }
        w += string(i + 1, s[i]);
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-inicjaly', krok: 4, level: 'latwe',
            title: 'Inicjały',
            short: 'jan maria kowalski → J.M.K. — pierwsze litery słów, wielkie, z kropkami.',
            tags: ['toupper', 'początek słowa', 'budowanie'],
            statement: ['Wczytaj imiona i nazwisko osoby zapisane w jednym wierszu i wypisz jej inicjały: pierwsze litery wszystkich słów, zamienione na wielkie, każda z kropką za sobą, bez spacji.'],
            input_format: ['Jeden wiersz: słowa oddzielone pojedynczymi spacjami.'],
            output_format: ['Inicjały, na przykład J.M.K.'],
            constraints: ['W wierszu jest od 1 do 10 słów.', 'Każde słowo ma od 1 do 20 liter.'],
            examples: [{ input: 'jan maria kowalski' }, { input: 'Ewa nowak' }],
            hint: R`Litera zaczyna słowo, gdy stoi na pozycji 0 albo zaraz po spacji: i == 0 || s[i - 1] == ' '. Do wyniku dopisz (char)toupper(s[i]) i kropkę. Bez (char) dopisałbyś znak — ale w cout bez rzutowania zobaczyłbyś liczbę.`,
            tests: (r) => {
                const IM = ['jan', 'maria', 'anna', 'piotr', 'ewa', 'krzysztof', 'zofia', 'adam', 'ola', 'tomasz', 'kowalski', 'nowak', 'zielinska', 'mazur'];
                const osoba = () => Array.from({ length: r.int(1, 10) }, () => mix(r, r() < 0.7 ? r.pick(IM) : word(r, 1, 20), r.pick([0, 0, 0.2]))).join(' ');
                return ['jan maria kowalski', 'Ewa nowak', 'x', 'a b c d e f g h i j', osoba(), osoba(), osoba(), osoba()];
            },
            solve: (inp) => inp.split(' ').filter(Boolean).map((w) => w[0].toUpperCase() + '.').join(''),
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, w = "";
    getline(cin, s);
    int n = s.length();
    for (int i = 0; i < n; i++) {
        if (s[i] != ' ' && (i == 0 || s[i - 1] == ' ')) {
            w += (char)toupper(s[i]);
            w += '.';
        }
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-numer-konta', krok: 4, level: 'latwe',
            title: 'Numer konta czytelnie',
            short: '26 cyfr jednym ciągiem to koszmar. Pogrupuj je tak jak bank: 2 cyfry, a potem po 4.',
            tags: ['separator', 'i % 4', 'budowanie'],
            statement: ['Polski numer konta bankowego ma 26 cyfr. Banki zapisują go czytelnie: najpierw dwie cyfry, a potem sześć grup po cztery cyfry, wszystkie grupy oddzielone pojedynczymi spacjami. Dla każdego z n numerów zapisanych jednym ciągiem wypisz jego czytelną postać.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym numerze: 26 cyfr bez spacji.'],
            output_format: ['n wierszy z numerami w postaci XX XXXX XXXX XXXX XXXX XXXX XXXX.'],
            constraints: ['1 ≤ n ≤ 100'],
            examples: [{ input: '1\n61109010140000071219812874' }],
            hint: R`Idź po cyfrach i przed niektórymi wstaw spację. Spacja stoi przed cyfrą numer 2, 6, 10, 14, 18 i 22 (licząc od zera) — to te i, dla których i >= 2 i (i - 2) % 4 == 0.`,
            check: (inp) => (toks(inp).slice(1).every((x) => /^\d{26}$/.test(x)) ? null : 'numer nie ma 26 cyfr'),
            tests: (r) => ['1\n61109010140000071219812874', `3\n${'0'.repeat(26)}\n${'9'.repeat(26)}\n12345678901234567890123456`,
                `100\n${Array.from({ length: 100 }, () => znaki(r, 26, CYFRY)).join('\n')}`],
            solve: (inp) => toks(inp).slice(1).map((s) => [s.slice(0, 2), ...Array.from({ length: 6 }, (_, k) => s.slice(2 + 4 * k, 6 + 4 * k))].join(' ')).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string s, w = "";
        cin >> s;
        for (int i = 0; i < 26; i++) {
            if (i >= 2 && (i - 2) % 4 == 0) {
                w += ' ';
            }
            w += s[i];
        }
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-zamiana-sasiadow', krok: 4, level: 'latwe',
            title: 'Zamiana sąsiadów',
            short: 'abcdef → badcfe: zamień miejscami litery w każdej parze.',
            tags: ['swap', 'i += 2', 'zmiana w miejscu'],
            statement: ['Wczytaj słowo i zamień miejscami litery w kolejnych parach: pierwszą z drugą, trzecią z czwartą, piątą z szóstą i tak dalej. Jeśli słowo ma nieparzystą liczbę liter, ostatnia litera nie ma pary i zostaje na swoim miejscu.'],
            input_format: ['Jeden wiersz z jednym słowem.'],
            output_format: ['Słowo po zamianach.'],
            constraints: ['Słowo ma od 1 do 1000 liter.'],
            examples: [{ input: 'abcdef' }, { input: 'kotek', note: 'Pary: ko → ok, te → et, a k zostaje na końcu.' }],
            hint: R`Pętla z krokiem 2: for (int i = 0; i + 1 < n; i += 2) swap(s[i], s[i + 1]);. Warunek i + 1 < n pilnuje, żeby para miała drugi element — dla ostatniej, samotnej litery pętla się już nie wykona.`,
            tests: (r) => ['abcdef', 'kotek', 'x', 'ab', 'abc', word(r, 10, 20), word(r, 999, 999), word(r, 1000, 1000)],
            solve: (inp) => { const a = [...inp.trim()]; for (let i = 0; i + 1 < a.length; i += 2) [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a.join(''); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    for (int i = 0; i + 1 < n; i += 2) {
        swap(s[i], s[i + 1]);
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-znikajace-slowo', krok: 4, level: 'srednie',
            title: 'Znikające słowo',
            short: 'Słowo traci z każdym wierszem pierwszą i ostatnią literę, aż zostanie sam środek.',
            tags: ["string(i, ' ')", 'fragment od i do n - 1 - i', 'pętla w pętli'],
            statement: ['Wczytaj słowo o nieparzystej liczbie liter i narysuj, jak znika. W pierwszym wierszu wypisz całe słowo. W każdym kolejnym — słowo bez pierwszej i ostatniej litery poprzedniego wiersza, przesunięte o jedną spację w prawo względem poprzedniego, tak by litery stały pod tymi samymi literami co wyżej. Ostatni wiersz zawiera tylko środkową literę.'],
            input_format: ['Jeden wiersz ze słowem.'],
            output_format: ['(n + 1) / 2 wierszy rysunku, gdzie n to długość słowa.'],
            constraints: ['Słowo ma nieparzystą liczbę liter, od 1 do 99.'],
            examples: [{ input: 'olimpiada', note: 'Wiersz numer i (od zera) zaczyna się od i spacji, a potem zawiera litery od s[i] do s[n - 1 - i].' }],
            hint: R`Wiersz numer i: string(i, ' ') spacji, a potem litery od pozycji i do pozycji n - 1 - i włącznie — wypisz je wewnętrzną pętlą for (int j = i; j <= n - 1 - i; j++). Wierszy jest n / 2 + 1, czyli i idzie od 0 do n / 2.`,
            check: (inp) => (inp.trim().length % 2 === 1 ? null : 'parzysta długość'),
            tests: (r) => ['olimpiada', 'a', 'kot', 'abcde', word(r, 15, 15), word(r, 99, 99), word(r, 51, 51)],
            solve: (inp) => { const s = inp.trim(), n = s.length; const out = []; for (let i = 0; i <= Math.floor(n / 2); i++) out.push(' '.repeat(i) + s.slice(i, n - i)); return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    for (int i = 0; i <= n / 2; i++) {
        cout << string(i, ' ');
        for (int j = i; j <= n - 1 - i; j++) {
            cout << s[j];
        }
        cout << "\n";
    }
    return 0;
}`,
        },
    ];
};
