// Input i Output (+) — ćwiczenia w trakcie lekcji, części 4–6: znak po znaku (cin.get, cin >> c, plansze, cyfry olbrzyma,
// liczba sklejona z literą, cin.peek, ściskanie odstępów, nawiasy w kodzie), całe wiersze (getline do końca danych, cin >> n
// i getline, przeplatanie getline z >>, getline do średnika, akapity, wcięcia, drzewo katalogów) oraz rozbieranie wiersza
// (stringstream, godziny z separatorami, kwoty z przecinkiem, punkty w nawiasach, liczby ukryte w tekście, działania w wierszach,
// rekordy klucz=wartość).
module.exports = (h) => {
    const { toks } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, NAZWISKA, MIASTA, SLOWA, losy, calk, czyLiczba, zdanie, imieNazwisko } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const ascii = (s) => /^[\x20-\x7e\n]*$/.test(s);

    // Losowy wiersz „prawdziwego” tekstu: słowa, liczby i interpunkcja, czasem kilka spacji pod rząd.
    const PUNKT = ['.', ',', '!', '?', ':', ';', '-', '(', ')', '"', '%', '+', '='];
    function wierszTekstu(r, maxSlow, spacje = 1) {
        const n = r.int(1, maxSlow);
        const czesci = [];
        for (let i = 0; i < n; i++) {
            const p = r();
            let w = p < 0.6 ? r.pick(SLOWA) : p < 0.75 ? r.pick(IMIONA) : p < 0.9 ? String(r.int(0, 2026)) : r.pick(PUNKT);
            if (r() < 0.15) w += r.pick(PUNKT);
            czesci.push(w);
        }
        return czesci.map((w, i) => (i ? ' '.repeat(r.int(1, spacje)) : '') + w).join('');
    }
    const tekst = (r, n, maxSlow, spacje = 1, pusteCo = 0) => {
        const L = [];
        for (let i = 0; i < n; i++) L.push(i && pusteCo && r() < pusteCo ? '' : wierszTekstu(r, maxSlow, spacje));
        return L.join('\n');
    };
    const linie = (inp) => inp.split('\n');

    return [
        // ================================================================ KROK 4 · znak po znaku
        {
            id: 'iop-statystyka-znakow', krok: 4, level: 'latwe',
            title: 'Statystyka znaków',
            short: 'Przeczytaj cały tekst znak po znaku — razem ze spacjami. Policz litery, cyfry, spacje i inne znaki.',
            tags: ['cin.get(c)', 'while (cin.get(c))', 'isalpha i isdigit'],
            statement: ['Dostajesz tekst w kilku wierszach. Policz w nim: litery (a–z, A–Z), cyfry, spacje i wszystkie pozostałe znaki (kropki, przecinki, nawiasy…). Znaków końca wiersza nie licz nigdzie.'],
            input_format: ['Tekst złożony z liter alfabetu angielskiego, cyfr, spacji, znaków interpunkcyjnych i znaków końca wiersza — do końca danych.'],
            output_format: ['Cztery wiersze: litery: a, cyfry: b, spacje: c, inne: d.'],
            constraints: ['Tekst ma od 1 do 50 000 znaków.'],
            examples: [{ input: 'Ala ma 2 koty.\nA Ola: 13!', note: 'Liter jest 13, cyfr 3 (2, 1, 3), spacji 5, a innych znaków 3: kropka, dwukropek i wykrzyknik. Znak końca pierwszego wiersza się nie liczy.' }],
            hint: R`cin >> c przeskakuje spacje i entery, więc spacji tak nie policzysz. cin.get(c) bierze każdy znak, także spację i '\n'. Pętla while (cin.get(c)) przeczyta wszystko do końca danych; '\n' pomiń przez if, a resztę rozdziel: isalpha(c), isdigit(c), c == ' ', w pozostałych przypadkach — inne.`,
            tests: (r) => ['a', '1 2', '!!!', tekst(r, 5, 8, 3), tekst(r, 200, 12, 2, 0.1), tekst(r, 1500, 9, 4, 0.05),
                Array.from({ length: 400 }, () => '(' + r.word(60, 'ab1 ;') + ')').join('\n')],
            check: (inp) => (inp.length >= 1 && inp.length <= 50000 && ascii(inp) ? null : 'tekst'),
            solve: (inp) => {
                let l = 0, d = 0, s = 0, o = 0;
                for (const c of inp) { if (c === '\n') continue; if (/[A-Za-z]/.test(c)) l++; else if (/\d/.test(c)) d++; else if (c === ' ') s++; else o++; }
                return `litery: ${l}\ncyfry: ${d}\nspacje: ${s}\ninne: ${o}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    char c;
    int litery = 0, cyfry = 0, spacje = 0, inne = 0;
    while (cin.get(c)) {
        if (c == '\n') continue;
        if (isalpha(c)) litery++;
        else if (isdigit(c)) cyfry++;
        else if (c == ' ') spacje++;
        else inne++;
    }
    cout << "litery: " << litery << "\n";
    cout << "cyfry: " << cyfry << "\n";
    cout << "spacje: " << spacje << "\n";
    cout << "inne: " << inne << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-plansza-gwiazdki', krok: 4, level: 'latwe',
            title: 'Gwiazdki w wierszach i kolumnach',
            short: 'Mapa nieba z kropek i gwiazdek. Ile gwiazdek jest w każdym wierszu, a ile w każdej kolumnie?',
            tags: ['plansza jako napisy', 'g[i][j]', 'wiersze i kolumny'],
            statement: ['Mapa nieba to plansza n × m złożona z kropek (puste niebo) i gwiazdek (gwiazdy). Wypisz, ile gwiazdek jest w każdym wierszu, a potem — ile w każdej kolumnie.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z następnych n wierszy m znaków . albo * — bez spacji.'],
            output_format: ['W pierwszym wierszu n liczb — gwiazdki w kolejnych wierszach.', 'W drugim wierszu m liczb — gwiazdki w kolejnych kolumnach.'],
            constraints: ['1 ≤ n, m ≤ 200'],
            examples: [{ input: '3 4\n*..*\n....\n.***', note: 'Wiersze mają 2, 0 i 3 gwiazdki; kolumny — 1, 1, 1 i 2.' }],
            hint: R`Wiersz bez spacji to jedno „słowo”, więc wczytasz go przez cin: vector<string> g(n); for (auto &w : g) cin >> w;. Potem g[i][j] to znak w wierszu i, kolumnie j. Można też czytać znak po znaku do tablicy char t[200][200] przez cin >> t[i][j] — cin >> c sam przeskoczy entery.`,
            tests: (r) => {
                const pl = (n, m, p) => `${n} ${m}\n${Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < p ? '*' : '.')).join('')).join('\n')}`;
                return ['1 1\n.', '1 1\n*', pl(1, 7, 0.5), pl(6, 1, 0.5), pl(5, 8, 0.3), pl(200, 200, 0.2), pl(200, 200, 0.95), pl(37, 150, 0.5)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); if (!calk(n, 1, 200) || !calk(m, 1, 200) || L.length !== n + 1) return 'n m';
                return L.slice(1).every((w) => w.length === m && /^[.*]+$/.test(w)) ? null : 'plansza';
            },
            solve: (inp) => {
                const L = linie(inp).slice(1); const m = L[0].length;
                const w = L.map((s) => [...s].filter((c) => c === '*').length);
                const k = Array.from({ length: m }, (_, j) => L.filter((s) => s[j] === '*').length);
                return `${w.join(' ')}\n${k.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &w : g) cin >> w;
    for (int i = 0; i < n; i++) {
        int ile = 0;
        for (int j = 0; j < m; j++)
            if (g[i][j] == '*') ile++;
        cout << ile << " ";
    }
    cout << "\n";
    for (int j = 0; j < m; j++) {
        int ile = 0;
        for (int i = 0; i < n; i++)
            if (g[i][j] == '*') ile++;
        cout << ile << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-cyfry-olbrzyma', krok: 4, level: 'latwe',
            title: 'Cyfry olbrzyma',
            short: 'Liczba ma do 90 000 cyfr — nie zmieści się w żadnym typie. Czytaj ją znak po znaku i licz cyfry.',
            tags: ['cin >> c w pętli', 'c - \'0\'', 'tablica liczników'],
            statement: ['Dostajesz liczbę naturalną, która może mieć nawet 90 000 cyfr. Wypisz sumę jej cyfr i cyfrę, która występuje w niej najczęściej (przy remisie — najmniejszą z nich).'],
            input_format: ['Jeden wiersz — liczba bez zer na początku.'],
            output_format: ['Dwie liczby w jednym wierszu: suma cyfr i najczęstsza cyfra.'],
            constraints: ['Liczba ma od 1 do 90 000 cyfr.'],
            examples: [{ input: '9071299', note: 'Suma cyfr: 9 + 0 + 7 + 1 + 2 + 9 + 9 = 37. Najczęściej, trzy razy, występuje 9.' }],
            hint: R`Pętla while (cin >> c) z char c czyta po jednej cyfrze. Wartość cyfry to c - '0' (kody znaków '0'…'9' stoją po kolei). Wystąpienia licz w tablicy int ile[10] = {};, a najczęstszą znajdź na końcu pętlą od 0 do 9 z warunkiem ostrej nierówności.`,
            tests: (r) => {
                const liczba = (n, al = '0123456789') => { let s = String(r.int(1, 9)); s += r.word(n - 1, al); return s; };
                return ['0', '7', '10', '1234567890', liczba(50), liczba(1000, '19'), liczba(90000), liczba(90000, '5'), '1' + '0'.repeat(89999)];
            },
            check: (inp) => (/^(0|[1-9]\d{0,89999})$/.test(inp) ? null : 'liczba'),
            solve: (inp) => { const ile = Array(10).fill(0); let s = 0; for (const c of inp) { ile[+c]++; s += +c; } let b = 0; for (let d = 1; d < 10; d++) if (ile[d] > ile[b]) b = d; return `${s} ${b}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    char c;
    int ile[10] = {};
    long long suma = 0;
    while (cin >> c) {
        ile[c - '0']++;
        suma += c - '0';
    }
    int best = 0;
    for (int d = 1; d < 10; d++)
        if (ile[d] > ile[best]) best = d;
    cout << suma << " " << best << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-saper', krok: 4, level: 'srednie',
            title: 'Saper',
            short: 'Plansza z minami. Zamień każde puste pole na liczbę min wokół niego — w ośmiu kierunkach.',
            tags: ['plansza znaków', 'osiem sąsiadów', 'brzegi planszy'],
            statement: ['W grze Saper niektóre pola planszy to miny (*), a pozostałe są puste (.). Każde puste pole pokazuje, ile min leży na polach wokół niego — w ośmiu kierunkach, także po skosie.',
                'Wypisz planszę, w której każda kropka jest zamieniona na cyfrę: liczbę sąsiednich min. Miny zostają gwiazdkami.'],
            input_format: ['W pierwszym wierszu n i m.', 'n wierszy po m znaków: * albo . (bez spacji).'],
            output_format: ['n wierszy po m znaków: * albo cyfra od 0 do 8.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '3 4\n*...\n..*.\n....', note: 'Pole w lewym dolnym rogu nie sąsiaduje z żadną miną — dostaje 0. Pole na środku górnego wiersza dotyka obu min — dostaje 2.' }],
            hint: R`Wczytaj planszę jako vector<string> g(n). Dla każdego pola z kropką przejdź dw od −1 do 1 i dk od −1 do 1 (pomijając 0, 0), sprawdź, czy sąsiad mieści się w planszy (0 ≤ w < n i 0 ≤ k < m), i policz gwiazdki. Wynik zapisuj do kopii planszy — cyfrę zamienisz na znak przez char('0' + ile).`,
            tests: (r) => {
                const pl = (n, m, p) => `${n} ${m}\n${Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < p ? '*' : '.')).join('')).join('\n')}`;
                return ['1 1\n.', '1 1\n*', '3 3\n***\n*.*\n***', pl(1, 10, 0.3), pl(10, 1, 0.3), pl(8, 8, 0.2), pl(100, 100, 0.15), pl(100, 100, 0.6), pl(50, 99, 0.05)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); if (!calk(n, 1, 100) || !calk(m, 1, 100) || L.length !== n + 1) return 'n m';
                return L.slice(1).every((w) => w.length === m && /^[.*]+$/.test(w)) ? null : 'plansza';
            },
            solve: (inp) => {
                const g = linie(inp).slice(1); const n = g.length, m = g[0].length;
                return g.map((w, i) => [...w].map((c, j) => {
                    if (c === '*') return '*';
                    let k = 0; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if ((a || b) && g[i + a] && g[i + a][j + b] === '*') k++;
                    return String(k);
                }).join('')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &w : g) cin >> w;
    vector<string> wynik = g;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (g[i][j] == '*') continue;
            int ile = 0;
            for (int dw = -1; dw <= 1; dw++)
                for (int dk = -1; dk <= 1; dk++) {
                    int w = i + dw, k = j + dk;
                    if ((dw != 0 || dk != 0) && w >= 0 && w < n && k >= 0 && k < m && g[w][k] == '*') ile++;
                }
            wynik[i][j] = char('0' + ile);
        }
    for (auto &w : wynik) cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-rozkoduj', krok: 4, level: 'srednie',
            title: 'Rozkoduj skrót',
            short: 'Zapis 3a2b10c znaczy aaabbcccccccccc. cin >> liczba zatrzyma się na literze, a cin >> znak ją weźmie.',
            tags: ['cin >> k >> c', 'liczba sklejona z literą', 'string(k, c)'],
            statement: ['Długie serie tych samych liter zapisuje się w skrócie: liczba powtórzeń, a zaraz za nią litera. Na przykład 3a2b10c to aaabbcccccccccc.',
                'Dostajesz taki skrót (jeden wiersz, bez spacji). Wypisz rozwinięty napis.'],
            input_format: ['Jeden wiersz — skrót: pary „liczba litera” sklejone ze sobą.'],
            output_format: ['Rozwinięty napis.'],
            constraints: ['Każda liczba powtórzeń: od 1 do 1000 (bez zer na początku).', 'Litery: od a do z.', 'Rozwinięty napis ma najwyżej 25 000 znaków.'],
            examples: [{ input: '3a2b10c', note: 'Trzy litery a, dwie b i dziesięć c.' }],
            hint: R`while (cin >> k >> c) — cin >> k czyta cyfry i staje na literze, bo litera nie pasuje do liczby; cin >> c bierze tę literę. Pętla skończy się sama na końcu danych. Napis string(k, c) to k kopii znaku c.`,
            tests: (r) => {
                const sk = (pary) => pary.map(([k, c]) => `${k}${c}`).join('');
                const los = (n, kMax) => Array.from({ length: n }, () => [r.int(1, kMax), r.word(1)]);
                return ['1a', '1000z', sk([[2, 'a'], [2, 'a'], [1, 'b']]), sk(los(10, 12)), sk(los(300, 50)), sk(los(12000, 2)), sk(Array.from({ length: 25 }, () => [1000, r.word(1)]))];
            },
            check: (inp) => {
                if (!/^([1-9]\d{0,3}[a-z])+$/.test(inp)) return 'format';
                let s = 0; for (const m of inp.matchAll(/(\d+)([a-z])/g)) { if (+m[1] > 1000) return 'k'; s += +m[1]; }
                return s <= 25000 ? null : 'długość';
            },
            solve: (inp) => [...inp.matchAll(/(\d+)([a-z])/g)].map((m) => m[2].repeat(+m[1])).join(''),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    char c;
    string wynik;
    while (cin >> k >> c) wynik += string(k, c);
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-liczba-czy-slowo', krok: 4, level: 'srednie',
            title: 'Liczba czy słowo?',
            short: 'Liczby i słowa przemieszane. Zajrzyj na następny znak przez cin.peek(), zanim zdecydujesz, do czego wczytać.',
            tags: ['cin.peek()', 'cin >> ws', 'isdigit'],
            statement: ['Dostajesz ciąg słów i liczb całkowitych przemieszanych ze sobą. Liczby mogą być ujemne (zaczynają się wtedy od minusa), słowa składają się z samych liter.',
                'Wypisz sumę wszystkich liczb, a w drugim wierszu wszystkie słowa w kolejności z wejścia, oddzielone spacjami — albo słowo BRAK, gdy nie ma żadnego słowa.'],
            input_format: ['Słowa i liczby oddzielone białymi znakami, do końca danych.'],
            output_format: ['W pierwszym wierszu suma liczb (0, gdy nie ma żadnej liczby).', 'W drugim wierszu słowa albo BRAK.'],
            constraints: ['Liczb jest od 0 do 8000, każda od −10⁹ do 10⁹.', 'Słów jest od 0 do 2000, każde ma od 1 do 10 liter.', 'Razem jest co najmniej jeden kawałek.'],
            examples: [{ input: 'Ala 12 ma -3 koty\n7 kot', note: 'Liczby: 12 − 3 + 7 = 16. Słowa po kolei: Ala ma koty kot.' }],
            hint: R`Najpierw przeskocz białe znaki: cin >> ws. Potem char z = cin.peek(); — to następny znak, który jeszcze zostaje na taśmie. Jeśli to cyfra albo minus, wczytaj liczbę (cin >> x), w przeciwnym razie — słowo (cin >> s). Całość w pętli while (cin >> ws && cin.peek() != EOF). (Inny sposób: czytaj wszystko jako string i sprawdzaj pierwszy znak, a liczbę zamieniaj przez stoll.)`,
            tests: (r) => {
                const los = (nL, nS) => { const t = [...Array.from({ length: nL }, () => r.int(-1000000000, 1000000000)), ...Array.from({ length: nS }, () => r.word(r.int(1, 10), 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'))]; return P.rozrzuc(r, r.shuffle(t)); };
                return ['5', 'kot', '-7 -8', 'a b c', los(10, 10), los(0, 2000), los(8000, 0), los(5000, 2000), los(3, 1)];
            },
            check: (inp) => {
                const t = toks(inp); const L = t.filter(czyLiczba), S = t.filter((x) => !czyLiczba(x));
                if (!t.length || L.length > 8000 || S.length > 2000) return 'ile';
                return L.every((x) => calk(Number(x), -1e9, 1e9)) && S.every((w) => /^[A-Za-z]{1,10}$/.test(w)) ? null : 'zakres';
            },
            solve: (inp) => { const t = toks(inp); const L = t.filter(czyLiczba), S = t.filter((x) => !czyLiczba(x)); return `${L.map(Number).reduce((a, b) => a + b, 0)}\n${S.length ? S.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long suma = 0;
    vector<string> slowa;
    while (cin >> ws && cin.peek() != EOF) {
        char z = cin.peek();
        if (isdigit(z) || z == '-') {
            long long x;
            cin >> x;
            suma += x;
        } else {
            string s;
            cin >> s;
            slowa.push_back(s);
        }
    }
    cout << suma << "\n";
    if (slowa.empty()) cout << "BRAK\n";
    else {
        for (int i = 0; i < (int)slowa.size(); i++) cout << (i ? " " : "") << slowa[i];
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-scisnij-spacje', krok: 4, level: 'srednie',
            title: 'Ściśnij odstępy',
            short: 'Tekst z wieloma spacjami pod rząd. Zostaw jedną spację między słowami, usuń spacje na brzegach wierszy — wiersze zostają.',
            tags: ['cin.get(c)', 'zaległa spacja', 'wiersze zostają'],
            statement: ['Ktoś wpisał tekst, waląc w spację na oślep: między słowami stoi czasem kilka spacji, a niektóre wiersze zaczynają się lub kończą spacjami. Popraw tekst: między słowami ma być dokładnie jedna spacja, a na początku i na końcu wiersza — żadnej. Podział na wiersze (także puste wiersze) zostaje bez zmian.'],
            input_format: ['Tekst w kilku wierszach — do końca danych.'],
            output_format: ['Ten sam tekst po poprawkach — tyle samo wierszy.'],
            constraints: ['Tekst ma od 1 do 30 000 znaków: litery, cyfry, interpunkcja, spacje i znaki końca wiersza.'],
            examples: [{ input: 'Ala   ma    kota\n   a kot   ma Ale  \n\nKONIEC', note: 'Drugi wiersz traci trzy spacje z początku i dwie z końca, a odstępy w środku kurczą się do jednej spacji. Pusty wiersz zostaje.' }],
            hint: R`Czytaj while (cin.get(c)). Spacji nie wypisuj od razu — zapamiętaj tylko, że była (bool zalegla = true). Gdy przyjdzie zwykły znak: jeśli zaległa spacja czeka, a w tym wierszu coś już wypisałeś — wypisz jedną spację, potem znak. Gdy przyjdzie '\n': wypisz go i zacznij wiersz od nowa (zaległą spację wyrzuć).`,
            tests: (r) => {
                const wiersz = () => (r() < 0.12 ? (r() < 0.5 ? '' : ' '.repeat(r.int(1, 5))) : ' '.repeat(r.int(0, 4)) + wierszTekstu(r, 10, 6) + ' '.repeat(r.int(0, 4)));
                const t = (n) => Array.from({ length: n }, wiersz).join('\n');
                return ['a', 'a  b', 'Ala   ma    kota\n   a kot   ma Ale  \n\nKONIEC', t(10), t(300), t(650), 'x' + ' '.repeat(5000) + 'y\n' + ' '.repeat(3000) + 'z'];
            },
            check: (inp) => (inp.length >= 1 && inp.length <= 30000 && ascii(inp) ? null : 'tekst'),
            solve: (inp) => linie(inp).map((l) => l.split(' ').filter(Boolean).join(' ')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    char c;
    bool zalegla = false, cos = false;
    while (cin.get(c)) {
        if (c == '\n') {
            cout << '\n';
            zalegla = false;
            cos = false;
        } else if (c == ' ') {
            zalegla = true;
        } else {
            if (zalegla && cos) cout << ' ';
            cout << c;
            zalegla = false;
            cos = true;
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-klamry-w-kodzie', krok: 4, level: 'trudne',
            title: 'Klamry w kodzie',
            short: 'Kod pełen nawiasów ( [ {. Czy są dobrze sparowane i jak głęboko sięgają? Czytaj znak po znaku i trzymaj stos otwartych.',
            tags: ['cin.get(c)', 'stos na vectorze', 'wiersz i kolumna błędu'],
            statement: ['Dostajesz fragment kodu — dowolne znaki w kilku wierszach. Interesują nas tylko nawiasy: okrągłe ( ), kwadratowe [ ] i klamrowe { }. Nawiasy są poprawne, jeśli każdy zamykający pasuje do ostatniego jeszcze niezamkniętego otwierającego, a na końcu żaden nawias nie zostaje otwarty.',
                'Jeśli nawiasy są poprawne, wypisz OK i największą głębokość zagnieżdżenia (0, gdy nawiasów nie ma). Jeśli nie — wypisz BLAD, numer wiersza i numer znaku w tym wierszu (oba liczone od 1), gdzie leży pierwszy błąd.',
                'Pierwszy błąd to nawias zamykający, który nie pasuje do ostatniego otwartego albo nie ma żadnego otwartego. Jeśli takiego nie ma, a na końcu zostały otwarte nawiasy, błędem jest najwcześniejszy z nich.'],
            input_format: ['Kod w kilku wierszach — do końca danych (tylko znaki ASCII).'],
            output_format: ['OK g — gdy nawiasy są poprawne,', 'albo BLAD w k — gdy nie są.'],
            constraints: ['Kod ma od 1 do 50 000 znaków.'],
            examples: [
                { input: 'int main() {\n    int t[5] = {1, 2};\n}', note: 'Najgłębiej leżą [5] i {1, 2} — wewnątrz klamry funkcji, czyli na głębokości 2.' },
                { input: 'if (a[i) > 0) {\n}', note: 'Ósmy znak pierwszego wiersza to „)”, a ostatni otwarty nawias to „[” — tu jest pierwszy błąd.' },
            ],
            hint: R`Czytaj while (cin.get(c)) i pilnuj pozycji: po '\n' wiersz++ i kolumna = 0, a dla każdego innego znaku kolumna++. Otwierający nawias wrzuć na stos razem z pozycją (np. trzy vectory albo vector par). Zamykający musi pasować do stos.back() — jeśli stos jest pusty albo rodzaj się nie zgadza, wypisz błąd i zakończ program. Głębokość to rozmiar stosu tuż po wstawieniu. Na końcu, gdy stos nie jest pusty, błędem jest jego pierwszy element.`,
            tests: (r) => {
                const PARY = ['()', '[]', '{}'];
                // poprawny „kod” o zadanej długości: słowa, a w nich zagnieżdżone nawiasy
                const kod = (n, glMax) => {
                    let s = '', st = [];
                    while (s.length < n) {
                        const p = r();
                        if (p < 0.08 && st.length < glMax) { const q = r.pick(PARY); s += q[0]; st.push(q[1]); }
                        else if (p < 0.16 && st.length) s += st.pop();
                        else if (p < 0.22) s += '\n' + '    '.repeat(st.length);
                        else s += r.pick([...SLOWA, '=', '+', ';', ',', '1', '"x"']) + ' ';
                    }
                    while (st.length) s += st.pop();
                    return s.trim();
                };
                const zepsuj = (s, jak) => {
                    const poz = [...s].map((c, i) => [c, i]).filter(([c]) => '()[]{}'.includes(c)).map(([, i]) => i);
                    if (!poz.length) return s + ')';
                    const i = r.pick(poz);
                    if (jak === 'zamien') { const zly = { '(': ']', '[': '}', '{': ')', ')': ']', ']': '}', '}': ')' }; return s.slice(0, i) + zly[s[i]] + s.slice(i + 1); }
                    if (jak === 'usun') return s.slice(0, i) + 'x' + s.slice(i + 1);
                    return s.slice(0, i) + '(' + s.slice(i);
                };
                return ['x', 'a)', '((', '([{}])', '{\n(\n}', '[\n  ]]', kod(300, 4), zepsuj(kod(500, 5), 'zamien'), zepsuj(kod(2000, 8), 'usun'),
                    zepsuj(kod(5000, 6), 'dodaj'), kod(40000, 30), zepsuj(kod(45000, 12), 'zamien'), '('.repeat(20000) + ')'.repeat(20000)];
            },
            check: (inp) => (inp.length >= 1 && inp.length <= 50000 && ascii(inp) ? null : 'kod'),
            solve: (inp) => {
                const st = []; let w = 1, k = 0, g = 0;
                const para = { ')': '(', ']': '[', '}': '{' };
                for (const c of inp) {
                    if (c === '\n') { w++; k = 0; continue; }
                    k++;
                    if ('([{'.includes(c)) { st.push([c, w, k]); g = Math.max(g, st.length); } else if (para[c]) {
                        if (!st.length || st[st.length - 1][0] !== para[c]) return `BLAD ${w} ${k}`;
                        st.pop();
                    }
                }
                return st.length ? `BLAD ${st[0][1]} ${st[0][2]}` : `OK ${g}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<char> rodzaj;
    vector<int> sw, sk;
    int w = 1, k = 0, glebokosc = 0;
    char c;
    while (cin.get(c)) {
        if (c == '\n') {
            w++;
            k = 0;
            continue;
        }
        k++;
        if (c == '(' || c == '[' || c == '{') {
            rodzaj.push_back(c);
            sw.push_back(w);
            sk.push_back(k);
            glebokosc = max(glebokosc, (int)rodzaj.size());
        } else if (c == ')' || c == ']' || c == '}') {
            char otw = (c == ')' ? '(' : c == ']' ? '[' : '{');
            if (rodzaj.empty() || rodzaj.back() != otw) {
                cout << "BLAD " << w << " " << k << "\n";
                return 0;
            }
            rodzaj.pop_back();
            sw.pop_back();
            sk.pop_back();
        }
    }
    if (!rodzaj.empty()) cout << "BLAD " << sw[0] << " " << sk[0] << "\n";
    else cout << "OK " << glebokosc << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 5 · całe wiersze — getline
        {
            id: 'iop-numeruj-wiersze', krok: 5, level: 'latwe',
            title: 'Ponumeruj wiersze',
            short: 'Wczytuj wiersze aż do końca — także puste. Przed każdym wypisz numer, a puste oznacz napisem (pusty).',
            tags: ['while (getline(cin, s))', 'puste wiersze', 's.empty()'],
            statement: ['Dostajesz tekst. Wypisz go z numerami wierszy: przed każdym wierszem jego numer, dwukropek i spację. Zamiast pustego wiersza wypisz numer, dwukropek, spację i napis (pusty).'],
            input_format: ['Tekst — kilka wierszy, aż do końca danych. Wiersze mogą zawierać spacje (także na początku), mogą też być puste.'],
            output_format: ['Te same wiersze z numerami.'],
            constraints: ['Tekst ma od 1 do 500 wierszy i najwyżej 20 000 znaków. Pierwszy i ostatni wiersz nie są puste.'],
            examples: [{ input: 'Ala ma kota\n\nKot ma Ale\n    a pies ma kosc', note: 'Drugi wiersz jest pusty. Czwarty zaczyna się od czterech spacji — getline je zachowuje.' }],
            hint: R`while (getline(cin, s)) czyta wiersz po wierszu — bez znaku '\n' na końcu. Pusty wiersz to pusty napis (s.empty()), a nie koniec danych: pętla zatrzyma się dopiero wtedy, gdy wierszy naprawdę zabraknie.`,
            tests: (r) => {
                const t = (n) => { const L = []; for (let i = 0; i < n; i++) L.push(i && i < n - 1 && r() < 0.2 ? '' : (i && r() < 0.15 ? ' '.repeat(r.int(1, 8)) : '') + wierszTekstu(r, 8)); return L.join('\n'); };
                return ['a', 'Ala\n\n\n\nOla', t(5), t(60), t(400), 'x\n' + '\n'.repeat(400) + 'y'];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 500 && inp.length <= 20000 && L[0] !== '' && L[L.length - 1] !== '' && ascii(inp) ? null : 'tekst'; },
            solve: (inp) => linie(inp).map((l, i) => `${i + 1}: ${l === '' ? '(pusty)' : l}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int nr = 0;
    while (getline(cin, s)) {
        nr++;
        if (s.empty()) cout << nr << ": (pusty)\n";
        else cout << nr << ": " << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-najdluzszy-wiersz', krok: 5, level: 'latwe',
            title: 'Najdłuższy wiersz',
            short: 'Który wiersz tekstu jest najdłuższy? Spacje też się liczą — cin >> by je zgubił.',
            tags: ['getline', 's.size()', 'pierwszy przy remisie'],
            statement: ['Wypisz numer najdłuższego wiersza tekstu (licząc od 1), jego długość i sam ten wiersz. Długość wiersza to liczba jego znaków, razem ze spacjami. Przy remisie wybierz wcześniejszy wiersz.'],
            input_format: ['Tekst — do końca danych. Wiersze mogą zawierać spacje i mogą być puste.'],
            output_format: ['W pierwszym wierszu numer najdłuższego wiersza i jego długość.', 'W drugim wierszu ten wiersz.'],
            constraints: ['Tekst ma od 1 do 1000 wierszy, każdy najwyżej 200 znaków, razem najwyżej 50 000 znaków. Pierwszy wiersz nie jest pusty.'],
            examples: [{ input: 'Ala ma kota\nOla ma dwa koty i psa\n\nKoniec', note: 'Drugi wiersz ma 21 znaków (16 liter i 5 spacji) — więcej niż pozostałe.' }],
            hint: R`while (getline(cin, s)) i licznik wierszy. Rekord zmieniaj tylko przy s.size() > najlepsza — ostra nierówność zostawi przy remisie wcześniejszy wiersz. Zapamiętaj numer, długość i sam napis.`,
            tests: (r) => {
                const t = (n, sp) => { const L = []; for (let i = 0; i < n; i++) L.push(i && r() < 0.1 ? '' : (i && r() < 0.2 ? ' '.repeat(r.int(1, 10)) : '') + wierszTekstu(r, 14, sp)); return L.join('\n'); };
                return ['x', 'ab\ncd\nef', 'a\n          b', t(8, 1), t(200, 3), t(1000, 2), 'Ala ma kota\nOla ma dwa koty i psa\n\nKoniec\nOla ma dwa koty i kot'];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 1000 && inp.length <= 50000 && L[0] !== '' && L.every((l) => l.length <= 200) && ascii(inp) ? null : 'tekst'; },
            solve: (inp) => { const L = linie(inp); let b = 0; L.forEach((l, i) => { if (l.length > L[b].length) b = i; }); return `${b + 1} ${L[b].length}\n${L[b]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, najdluzszy;
    int nr = 0, numer = 0;
    while (getline(cin, s)) {
        nr++;
        if (numer == 0 || s.size() > najdluzszy.size()) {
            najdluzszy = s;
            numer = nr;
        }
    }
    cout << numer << " " << najdluzszy.size() << "\n" << najdluzszy << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-liczba-i-zdania', krok: 5, level: 'latwe',
            title: 'Liczba, a potem zdania',
            short: 'Najpierw n, potem n zdań ze spacjami. Po cin >> n zostaje enter — bez cin.ignore() pierwsze zdanie wyjdzie puste.',
            tags: ['cin >> n, potem getline', 'cin.ignore()', 'od ostatniego'],
            statement: ['Dostajesz liczbę n, a pod nią n zdań (zdania zawierają spacje). Wypisz zdania w odwrotnej kolejności — od ostatniego do pierwszego.'],
            input_format: ['W pierwszym wierszu n.', 'W następnych n wierszach zdania.'],
            output_format: ['n wierszy: zdania od ostatniego do pierwszego.'],
            constraints: ['1 ≤ n ≤ 200', 'Każde zdanie ma od 1 do 100 znaków i nie zaczyna się od spacji.'],
            examples: [{ input: '3\nAla ma kota.\nKot ma Ale.\nTo koniec.', note: 'Bez cin.ignore() program wczytałby jako pierwsze „zdanie” pusty napis (resztę wiersza z liczbą 3), a ostatniego zdania nie przeczytałby wcale.' }],
            hint: R`Po cin >> n na taśmie zostaje '\n' z końca pierwszego wiersza. Pierwszy getline przeczytałby tylko ten enter i oddał pusty napis. Wyrzuć go przez cin.ignore() zaraz po cin >> n (albo czytaj zdania przez getline(cin >> ws, s)). Zdania zbieraj do vector<string> i wypisz od końca.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['A.']), d(['Ala ma kota.', 'Ala ma kota.']), d(Array.from({ length: 8 }, () => zdanie(r, 1, 8))), d(Array.from({ length: 200 }, () => zdanie(r, 1, 8))),
                    d(['x', '7', '  ? to nie spacja na poczatku'.trim(), 'koniec'])];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 200) && L.length === n + 1 && L.slice(1).every((s) => s.length >= 1 && s.length <= 100 && s[0] !== ' ') ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).reverse().join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cin.ignore();
    vector<string> zdania(n);
    for (auto &z : zdania) getline(cin, z);
    for (int i = n - 1; i >= 0; i--) cout << zdania[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-karty-uczniow', krok: 5, level: 'srednie',
            title: 'Karty uczniów',
            short: 'Na zmianę: wiersz z imionami (ze spacjami) i wiersz z liczbami. getline i cin >> przeplatane — pilnuj enterów.',
            tags: ['getline(cin >> ws, s)', 'przeplatanie z >>', 'format wyniku'],
            statement: ['Sekretariat ma karty n uczniów. Każda karta zajmuje dwa wiersze. W pierwszym są imiona i nazwisko (uczeń może mieć kilka imion, np. Anna Maria Kowalska), w drugim — klasa (od 1 do 8) i średnia ocen pomnożona przez 100 (np. 475 znaczy 4.75).',
                'Dla każdego ucznia wypisz wiersz: imiona i nazwisko, przecinek i spacja, klasa X, przecinek i spacja, srednia Y.YY — średnia z dokładnie dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu n.', 'Dalej n kart po dwa wiersze: imiona i nazwisko; klasa i średnia razy 100.'],
            output_format: ['n wierszy w formacie: Imiona Nazwisko, klasa X, srednia Y.YY'],
            constraints: ['1 ≤ n ≤ 200', 'Imiona i nazwisko: od 1 do 50 znaków (litery i pojedyncze spacje).', '1 ≤ klasa ≤ 8', '100 ≤ średnia razy 100 ≤ 600'],
            examples: [{ input: '2\nAnna Maria Kowalska\n7 475\nJan Nowak\n3 500', note: 'Średnia 500 to 5.00 — dwie cyfry po kropce wypisujemy zawsze, także wtedy, gdy są zerami.' }],
            hint: R`Najpewniej: getline(cin >> ws, imiona); — cin >> ws przeskakuje enter, który zostaje po liczbach z poprzedniego wiersza (i po n). Potem cin >> klasa >> sr. Średnią wypisz jako sr / 100, kropka i sr % 100 przez setfill('0') i setw(2).`,
            tests: (r) => {
                const osoba = () => { const k = r.int(1, 3); const im = Array.from({ length: k }, () => r.pick(IMIONA)); return [...im, r.pick(NAZWISKA)].join(' '); };
                const d = (a) => `${a.length}\n${a.map(([o, k, s]) => `${o}\n${k} ${s}`).join('\n')}`;
                return [d([['Jan', 1, 100]]), d([['A B C D', 8, 600], ['X', 1, 101], ['Ola Lis', 4, 510]]),
                    d(Array.from({ length: 10 }, () => [osoba(), r.int(1, 8), r.int(100, 600)])), d(Array.from({ length: 200 }, () => [osoba(), r.int(1, 8), r.int(100, 600)]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 200) || L.length !== 2 * n + 1) return 'n';
                for (let i = 0; i < n; i++) { const o = L[1 + 2 * i], [k, s] = L[2 + 2 * i].split(' ').map(Number); if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(o) || o.length > 50 || !calk(k, 1, 8) || !calk(s, 100, 600)) return 'karta'; }
                return null;
            },
            solve: (inp) => { const L = linie(inp); const o = []; for (let i = 0; i < Number(L[0]); i++) { const [k, s] = L[2 + 2 * i].split(' ').map(Number); o.push(`${L[1 + 2 * i]}, klasa ${k}, srednia ${Math.floor(s / 100)}.${String(s % 100).padStart(2, '0')}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string imiona;
        int klasa, sr;
        getline(cin >> ws, imiona);
        cin >> klasa >> sr;
        cout << imiona << ", klasa " << klasa << ", srednia " << sr / 100 << "."
             << setfill('0') << setw(2) << sr % 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-sredniki', krok: 5, level: 'srednie',
            title: 'Średniki w danych',
            short: 'Wiersze „imię;miasto;punkty”. getline do średnika, cin >> punkty — i cin >> ws, żeby enter nie wkleił się do następnego imienia.',
            tags: ['getline(cin, s, \';\')', 'cin >> ws', 'pułapka z enterem'],
            statement: ['Wyniki konkursu zapisano jako tekst: każdy wiersz to imię i nazwisko uczestnika, miasto i liczba punktów, rozdzielone średnikami — na przykład Jan Kowalski;Nowy Sacz;87. Imiona, nazwiska i nazwy miast mogą zawierać spacje.',
                'Wypisz zwycięzcę (najwięcej punktów; przy remisie — wcześniejszy w danych) w formacie Imie Nazwisko (Miasto): punkty, a w drugim wierszu sumę punktów wszystkich uczestników.'],
            input_format: ['Wiersze w formacie imie i nazwisko;miasto;punkty — do końca danych.'],
            output_format: ['W pierwszym wierszu zwycięzca: Imie Nazwisko (Miasto): punkty', 'W drugim wierszu suma punktów.'],
            constraints: ['Uczestników jest od 1 do 1000.', 'Imię z nazwiskiem i miasto: od 1 do 30 znaków (litery i spacje, bez średników).', '0 ≤ punkty ≤ 1000'],
            examples: [{ input: 'Jan Kowalski;Nowy Sacz;87\nAnna Nowak;Krakow;92\nOla Lis;Zielona Gora;92', note: 'Anna i Ola mają po 92 punkty — wygrywa Anna, bo jest wcześniej. Suma: 87 + 92 + 92 = 271.' }],
            hint: R`getline z trzecim argumentem czyta do wskazanego znaku (i go zjada): getline(cin, miasto, ';'). Schemat: while (getline(cin >> ws, osoba, ';')) { getline(cin, miasto, ';'); cin >> pkt; … }. To cin >> ws jest ważne: po cin >> pkt na taśmie zostaje '\n', który bez tego trafiłby na początek następnego imienia.`,
            tests: (r) => {
                const w = () => `${P.imieNazwisko(r)};${r.pick(MIASTA)};${r.int(0, 1000)}`;
                return ['A;B;0', 'Jan Kowalski;Nowy Sacz;87\nAnna Nowak;Krakow;92\nOla Lis;Zielona Gora;92', Array.from({ length: 12 }, w).join('\n'),
                    Array.from({ length: 1000 }, w).join('\n'), Array.from({ length: 300 }, () => `${P.imieNazwisko(r)};${r.pick(MIASTA)};1000`).join('\n')];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 1000) return 'ile';
                return L.every((l) => { const p = l.split(';'); return p.length === 3 && /^[A-Za-z ]{1,30}$/.test(p[0]) && /^[A-Za-z ]{1,30}$/.test(p[1]) && p[0][0] !== ' ' && p[1][0] !== ' ' && /^\d+$/.test(p[2]) && calk(Number(p[2]), 0, 1000); }) ? null : 'wiersz';
            },
            solve: (inp) => {
                const L = linie(inp).map((l) => l.split(';')); let b = 0, s = 0;
                L.forEach((p, i) => { s += Number(p[2]); if (Number(p[2]) > Number(L[b][2])) b = i; });
                return `${L[b][0]} (${L[b][1]}): ${L[b][2]}\n${s}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string osoba, miasto, bo, bm;
    int pkt, bp = -1;
    long long suma = 0;
    while (getline(cin >> ws, osoba, ';')) {
        getline(cin, miasto, ';');
        cin >> pkt;
        suma += pkt;
        if (pkt > bp) {
            bp = pkt;
            bo = osoba;
            bm = miasto;
        }
    }
    cout << bo << " (" << bm << "): " << bp << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-akapity', krok: 5, level: 'srednie',
            title: 'Akapity',
            short: 'Akapity oddziela pusty wiersz (czasem kilka). Ile jest akapitów, ile wierszy i słów ma każdy?',
            tags: ['getline do końca', 'pusty wiersz = granica', 'liczenie słów'],
            statement: ['Tekst składa się z akapitów. Akapit to jeden lub więcej niepustych wierszy pod rząd; akapity oddziela jeden albo kilka pustych wierszy (całkiem pustych — bez żadnego znaku).',
                'Wypisz liczbę akapitów, a potem dla każdego akapitu wiersz z dwiema liczbami: ile ma wierszy i ile słów. Słowo to ciąg znaków bez spacji; spacji między słowami może być kilka.'],
            input_format: ['Tekst — do końca danych.'],
            output_format: ['W pierwszym wierszu liczba akapitów.', 'Dalej po jednym wierszu na akapit: liczba wierszy i liczba słów.'],
            constraints: ['Tekst ma od 1 do 2000 wierszy i najwyżej 50 000 znaków. Pierwszy i ostatni wiersz nie są puste.'],
            examples: [{ input: 'Ala ma kota.\nKot ma Ale.\n\n\nTo jest drugi akapit.\n\nTrzeci  akapit  ma\ndwa wiersze', note: 'Między pierwszym a drugim akapitem są dwa puste wiersze — to wciąż jedna granica. Podwójne spacje w trzecim akapicie nie tworzą dodatkowych słów.' }],
            hint: R`Czytaj while (getline(cin, s)) i trzymaj flagę „jestem w akapicie”. Pusty wiersz ją gasi. Niepusty wiersz, gdy flaga jest zgaszona, zaczyna nowy akapit (push_back zer do dwóch vectorów). Słowo zaczyna się tam, gdzie znak nie jest spacją, a poprzedni był spacją (albo to początek wiersza) — tak policzysz słowa mimo wielu spacji.`,
            tests: (r) => {
                const t = (nA, maxW, sp) => { const A = []; for (let i = 0; i < nA; i++) A.push(Array.from({ length: r.int(1, maxW) }, () => (r() < 0.2 ? ' '.repeat(r.int(1, 3)) : '') + wierszTekstu(r, 9, sp)).join('\n')); return A.map((a, i) => (i ? '\n'.repeat(r.int(1, 3)) : '') + a).join('\n'); };
                return ['jeden', 'a\nb\n\nc', 'Ala ma kota.\nKot ma Ale.\n\n\nTo jest drugi akapit.\n\nTrzeci  akapit  ma\ndwa wiersze', t(5, 4, 3), t(100, 6, 2), t(350, 3, 4), t(1, 900, 1)];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 2000 && inp.length <= 50000 && L[0] !== '' && L[L.length - 1] !== '' && ascii(inp) && L.every((l) => l === '' || l.trim() !== '') ? null : 'tekst'; },
            solve: (inp) => {
                const A = []; let w = false;
                for (const l of linie(inp)) { if (l === '') { w = false; continue; } if (!w) { A.push([0, 0]); w = true; } A[A.length - 1][0]++; A[A.length - 1][1] += l.split(' ').filter(Boolean).length; }
                return [A.length, ...A.map((a) => a.join(' '))].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    vector<int> wiersze, slowa;
    bool wAkapicie = false;
    while (getline(cin, s)) {
        if (s.empty()) {
            wAkapicie = false;
            continue;
        }
        if (!wAkapicie) {
            wiersze.push_back(0);
            slowa.push_back(0);
            wAkapicie = true;
        }
        wiersze.back()++;
        for (int i = 0; i < (int)s.size(); i++)
            if (s[i] != ' ' && (i == 0 || s[i - 1] == ' ')) slowa.back()++;
    }
    cout << wiersze.size() << "\n";
    for (int i = 0; i < (int)wiersze.size(); i++) cout << wiersze[i] << " " << slowa[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-wciecia', krok: 5, level: 'srednie',
            title: 'Wcięcia co dwie spacje',
            short: 'Kod wcięty po 4 spacje trzeba przepisać na wcięcia po 2. getline zachowuje spacje na początku wiersza — cin >> by je zgubił.',
            tags: ['getline', 'spacje na początku wiersza', 'string(k, \' \')'],
            statement: ['Dostajesz program, w którym każdy poziom wcięcia to 4 spacje. Przepisz go tak, by poziom wcięcia miał 2 spacje: wiersz zaczynający się od 4k spacji ma się zaczynać od 2k spacji. Reszta wiersza zostaje bez zmian, puste wiersze zostają puste.'],
            input_format: ['Program — do końca danych. Każdy wiersz zaczyna się od liczby spacji podzielnej przez 4; pierwszy wiersz nie ma wcięcia.'],
            output_format: ['Ten sam program z wcięciami po 2 spacje.'],
            constraints: ['Program ma od 1 do 1000 wierszy i najwyżej 30 000 znaków.'],
            examples: [{ input: 'int main() {\n    for (int i = 0; i < 3; i++) {\n        cout << i;\n    }\n}', note: 'Wiersz cout << i; miał 8 spacji wcięcia — dostaje 4.' }],
            hint: R`Dla każdego wiersza (while (getline(cin, s))) policz spacje na początku: int k = 0; while (k < (int)s.size() && s[k] == ' ') k++;. Wypisz string(k / 2, ' '), a potem resztę wiersza: s.substr(k).`,
            tests: (r) => {
                const kod = (n) => {
                    const L = ['int main() {']; let p = 1;
                    while (L.length < n) {
                        const q = r();
                        if (q < 0.2 && p < 7) { L.push('    '.repeat(p) + r.pick(['if (x > 0) {', 'for (int i = 0; i < n; i++) {', 'while (cin >> x) {', 'else {', 'do {'])); p++; }
                        else if (q < 0.35 && p > 1) { p--; L.push('    '.repeat(p) + '}'); }
                        else if (q < 0.4) L.push('');
                        else L.push('    '.repeat(p) + r.pick(['x++;', 'cout << x << "\\n";', 'suma += x;', 'int y = 7;', 'return 0;', 'break;', 's = s + "a  b";', '// komentarz:  dwie  spacje']));
                    }
                    while (p > 0) { p--; L.push('    '.repeat(p) + '}'); }
                    return L.join('\n');
                };
                return ['x', 'a\n    b\n        c\n\n            d', 'int main() {\n    for (int i = 0; i < 3; i++) {\n        cout << i;\n    }\n}', kod(20), kod(300), kod(950)];
            },
            check: (inp) => { const L = linie(inp); if (L.length > 1000 || inp.length > 30000 || !ascii(inp) || /^ /.test(L[0])) return 'kod'; return L.every((l) => l.match(/^ */)[0].length % 4 === 0) ? null : 'wcięcie'; },
            solve: (inp) => linie(inp).map((l) => { const k = l.match(/^ */)[0].length; return ' '.repeat(k / 2) + l.slice(k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        int k = 0;
        while (k < (int)s.size() && s[k] == ' ') k++;
        cout << string(k / 2, ' ') << s.substr(k) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-drzewo-katalogow', krok: 5, level: 'trudne',
            title: 'Drzewo katalogów',
            short: 'Wcięcia pokazują, co jest w czym. Zamień drzewko na pełne ścieżki plików: dokumenty/szkola/matma.txt.',
            tags: ['getline i wcięcia', 'stos nazw', 'resize'],
            statement: ['Zawartość dysku zapisano jako drzewko: każdy wiersz to nazwa katalogu albo pliku, a wcięcie (po 2 spacje na poziom) mówi, gdzie się znajduje — w katalogu z najbliższego wiersza powyżej, który ma o jeden poziom mniejsze wcięcie. Pliki to nazwy z kropką (np. zadanie.cpp), katalogi — nazwy bez kropki.',
                'Wypisz pełne ścieżki wszystkich plików w kolejności z wejścia: nazwy katalogów od najwyższego poziomu i nazwa pliku, oddzielone ukośnikami.'],
            input_format: ['Drzewko — do końca danych. Pierwszy wiersz nie ma wcięcia. Wiersz może mieć wcięcie o jeden poziom większe niż wiersz nad nim tylko wtedy, gdy tamten wiersz jest katalogiem.'],
            output_format: ['Ścieżki plików, każda w osobnym wierszu, albo BRAK, gdy w drzewku nie ma żadnego pliku.'],
            constraints: ['Drzewko ma od 1 do 300 wierszy i najwyżej 6 poziomów.', 'Nazwy mają od 1 do 12 znaków (małe litery i kropka).'],
            examples: [{ input: 'dokumenty\n  szkola\n    matma.txt\n    polski.txt\n  zdjecia\n    wakacje\n      plaza.jpg\nprogram.cpp', note: 'plaza.jpg leży w katalogu wakacje, który leży w zdjecia, który leży w dokumenty. program.cpp nie ma wcięcia — leży na samej górze.' }],
            hint: R`Trzymaj vector<string> sciezka — nazwy katalogów, w których „jesteś”. Dla wiersza z k spacjami na początku poziom to k / 2: najpierw skróć ścieżkę do tego poziomu (sciezka.resize(poziom)), a potem: jeśli nazwa ma kropkę (find('.') != string::npos) — wypisz wszystkie katalogi ze ścieżki z ukośnikami i nazwę pliku; jeśli nie — dopisz katalog na koniec ścieżki (push_back).`,
            tests: (r) => {
                const drzewo = (n, pMax) => {
                    const L = []; let wolno = 0;
                    for (let i = 0; i < n; i++) {
                        const p = r.int(Math.max(0, wolno - 2), wolno);
                        const plik = p >= pMax - 1 || r() < 0.45;
                        const nazwa = plik ? r.word(r.int(1, 8)) + '.' + r.pick(['txt', 'cpp', 'jpg', 'pdf']) : r.word(r.int(1, 12));
                        L.push('  '.repeat(p) + nazwa); wolno = plik ? p : p + 1;
                    }
                    return L.join('\n');
                };
                return ['a.txt', 'katalog', 'a\n  b\n    c\n  d', 'dokumenty\n  szkola\n    matma.txt\n    polski.txt\n  zdjecia\n    wakacje\n      plaza.jpg\nprogram.cpp',
                    drzewo(15, 6), drzewo(120, 6), drzewo(300, 6), drzewo(300, 3)];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 300) return 'ile';
                let wolno = 0;
                for (const l of L) {
                    const k = l.match(/^ */)[0].length, n = l.slice(k);
                    if (k % 2 || k / 2 > wolno || k / 2 > 5 || !/^[a-z.]{1,12}$/.test(n)) return 'wiersz';
                    wolno = n.includes('.') ? k / 2 : k / 2 + 1;
                }
                return null;
            },
            solve: (inp) => {
                const o = [], st = [];
                for (const l of linie(inp)) { const k = l.match(/^ */)[0].length, n = l.slice(k); st.length = k / 2; if (n.includes('.')) o.push([...st, n].join('/')); else st.push(n); }
                return o.length ? o.join('\n') : 'BRAK';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    vector<string> sciezka;
    bool bylPlik = false;
    while (getline(cin, s)) {
        int k = 0;
        while (k < (int)s.size() && s[k] == ' ') k++;
        string nazwa = s.substr(k);
        sciezka.resize(k / 2);
        if (nazwa.find('.') != string::npos) {
            for (auto &d : sciezka) cout << d << "/";
            cout << nazwa << "\n";
            bylPlik = true;
        } else {
            sciezka.push_back(nazwa);
        }
    }
    if (!bylPlik) cout << "BRAK\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · rozbieranie wiersza
        {
            id: 'iop-sumy-wierszy', krok: 6, level: 'latwe',
            title: 'Suma w każdym wierszu',
            short: 'W każdym wierszu jest kilka liczb — nie wiadomo ile. Wczytaj wiersz przez getline i rozbierz go strumieniem stringstream.',
            tags: ['getline', 'stringstream ss(s)', 'while (ss >> x)'],
            statement: ['Każdy wiersz danych to punkty jednego ucznia z kartkówek — liczb w wierszu może być różnie, a pusty wiersz oznacza ucznia, który nie pisał żadnej kartkówki. Wypisz sumę liczb z każdego wiersza (dla pustego wiersza — 0).'],
            input_format: ['Wiersze z liczbami całkowitymi oddzielonymi spacjami (czasem kilkoma) — do końca danych.'],
            output_format: ['Po jednym wierszu na każdy wiersz wejścia — suma jego liczb.'],
            constraints: ['Od 1 do 2000 wierszy, w każdym od 0 do 50 liczb, razem najwyżej 10 000 liczb.', '−10⁶ ≤ każda liczba ≤ 10⁶', 'Pierwszy i ostatni wiersz nie są puste.'],
            examples: [{ input: '3 4 5\n\n10 -20\n7', note: 'Pusty drugi wiersz daje sumę 0. Zwykłe cin >> x nie odróżniłoby wierszy — przeskoczyłoby entery i wymieszało liczby uczniów.' }],
            hint: R`while (getline(cin, s)) { stringstream ss(s); long long x, suma = 0; while (ss >> x) suma += x; … }. stringstream (z biblioteki <sstream>) to strumień, który czyta z napisu zamiast z wejścia — działa dokładnie jak cin, ale kończy się na końcu tego jednego wiersza.`,
            tests: (r) => {
                const t = (n, maxK, lo, hi) => { const L = []; for (let i = 0; i < n; i++) { const k = i && i < n - 1 && r() < 0.15 ? 0 : r.int(1, maxK); L.push((i && r() < 0.2 ? '  ' : '') + losy(r, k, lo, hi).join(' '.repeat(r.int(1, 3)))); } return L.join('\n'); };
                return ['5', '1 2\n\n\n3', '-1000000 -1000000 1000000', t(6, 5, -9, 9), t(300, 10, -1000, 1000), t(2000, 5, -1000000, 1000000), t(200, 50, -1000000, 1000000)];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 2000 || L[0].trim() === '' || L[L.length - 1].trim() === '') return 'wiersze';
                let s = 0; for (const l of L) { const t = l.split(' ').filter(Boolean); if (t.length > 50) return '50'; s += t.length; if (!t.every((x) => czyLiczba(x) && calk(Number(x), -1e6, 1e6))) return 'zakres'; }
                return s <= 10000 ? null : 'razem';
            },
            solve: (inp) => linie(inp).map((l) => l.split(' ').filter(Boolean).reduce((a, b) => a + Number(b), 0)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        stringstream ss(s);
        long long x, suma = 0;
        while (ss >> x) suma += x;
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-najwiecej-slow', krok: 6, level: 'latwe',
            title: 'Wiersz z największą liczbą słów',
            short: 'Policz słowa w każdym wierszu przez stringstream i wskaż wiersz, w którym jest ich najwięcej.',
            tags: ['stringstream', 'ss >> slowo', 'rekord z numerem'],
            statement: ['Dla każdego wiersza tekstu policz, ile ma słów. Słowo to ciąg znaków bez spacji, a spacji między słowami może być kilka. Wypisz numer wiersza z największą liczbą słów (licząc od 1; przy remisie — wcześniejszy) i tę liczbę słów.'],
            input_format: ['Tekst — do końca danych. Wiersze mogą być puste.'],
            output_format: ['Dwie liczby: numer wiersza i liczba słów.'],
            constraints: ['Tekst ma od 1 do 2000 wierszy i najwyżej 50 000 znaków. Pierwszy i ostatni wiersz nie są puste.'],
            examples: [{ input: 'Ala  ma kota\nto   jest bardzo  dlugi wiersz\n\nkoniec', note: 'Drugi wiersz ma 5 słów — mimo że między niektórymi stoi po kilka spacji.' }],
            hint: R`Dla każdego wiersza: stringstream ss(s); string w; int ile = 0; while (ss >> w) ile++;. Strumień sam przeskoczy wielokrotne spacje — tak samo jak cin. Rekord zmieniaj przy ostrej nierówności.`,
            tests: (r) => {
                const t = (n, maxW, sp) => { const L = []; for (let i = 0; i < n; i++) L.push(i && i < n - 1 && r() < 0.1 ? '' : (i && r() < 0.2 ? '   ' : '') + wierszTekstu(r, maxW, sp)); return L.join('\n'); };
                return ['a', 'a b\nc d', 'x\n\n\ny  z', t(10, 6, 3), t(500, 10, 4), t(2000, 4, 2), t(100, 60, 1)];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 2000 && inp.length <= 50000 && L[0].trim() !== '' && L[L.length - 1].trim() !== '' && ascii(inp) ? null : 'tekst'; },
            solve: (inp) => { const c = linie(inp).map((l) => l.split(' ').filter(Boolean).length); let b = 0; c.forEach((x, i) => { if (x > c[b]) b = i; }); return `${b + 1} ${c[b]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int nr = 0, numer = 0, najwiecej = -1;
    while (getline(cin, s)) {
        nr++;
        stringstream ss(s);
        string w;
        int ile = 0;
        while (ss >> w) ile++;
        if (ile > najwiecej) {
            najwiecej = ile;
            numer = nr;
        }
    }
    cout << numer << " " << najwiecej << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-godziny-pracy', krok: 6, level: 'latwe',
            title: 'Godziny pracy',
            short: 'Wiersze „08:15-09:45”. Wczytaj godziny i minuty, zjadając separatory zmienną char, i zsumuj cały czas.',
            tags: ['cin >> h >> c >> m', 'separatory : i -', 'minuty na hh:mm'],
            statement: ['Pani Ola zapisuje każdy blok pracy jako przedział godzin, np. 08:15-09:45 (koniec jest zawsze później niż początek, tego samego dnia). Dla każdego bloku wypisz jego długość w minutach, a na końcu łączny czas pracy w formacie hh:mm — godziny co najmniej dwiema cyframi, minuty dokładnie dwiema.'],
            input_format: ['Przedziały w formacie HH:MM-HH:MM, każdy w osobnym wierszu — do końca danych.'],
            output_format: ['Dla każdego przedziału liczba minut, każda w osobnym wierszu.', 'W ostatnim wierszu łączny czas: hh:mm.'],
            constraints: ['Przedziałów jest od 1 do 2000.', 'Godziny od 00:00 do 23:59.'],
            examples: [{ input: '08:15-09:45\n10:00-10:05\n12:30-16:00', note: 'Bloki trwają 90, 5 i 210 minut — razem 305 minut, czyli 5 godzin i 5 minut: 05:05.' }],
            hint: R`char c; while (cin >> h1 >> c >> m1 >> c >> h2 >> c >> m2) — zmienna c zjada kolejno dwukropek, minus i drugi dwukropek. Zero na początku (08) nie przeszkadza: cin >> h wczyta 8. Godzinę zamień na minuty: h * 60 + m. Wynik końcowy wypisz z setfill('0') i setw(2).`,
            tests: (r) => {
                const hm = (x) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
                const blok = () => { const a = r.int(0, 1438), b = r.int(a + 1, 1439); return `${hm(a)}-${hm(b)}`; };
                return ['00:00-00:01', '00:00-23:59', '09:59-10:00\n23:58-23:59', Array.from({ length: 10 }, blok).join('\n'), Array.from({ length: 2000 }, blok).join('\n'),
                    Array(2000).fill('00:00-23:59').join('\n')];
            },
            check: (inp) => {
                return linie(inp).length <= 2000 && linie(inp).every((l) => { const m = l.match(/^(\d\d):(\d\d)-(\d\d):(\d\d)$/); if (!m) return false; const a = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4]; return +m[1] < 24 && +m[3] < 24 && +m[2] < 60 && +m[4] < 60 && b > a; }) ? null : 'przedział';
            },
            solve: (inp) => {
                let s = 0; const o = linie(inp).map((l) => { const m = l.match(/^(\d\d):(\d\d)-(\d\d):(\d\d)$/); const d = (+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]); s += d; return d; });
                o.push(`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h1, m1, h2, m2;
    char c;
    long long razem = 0;
    while (cin >> h1 >> c >> m1 >> c >> h2 >> c >> m2) {
        int d = (h2 * 60 + m2) - (h1 * 60 + m1);
        cout << d << "\n";
        razem += d;
    }
    cout << setfill('0') << setw(2) << razem / 60 << ":" << setw(2) << razem % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-kwoty-z-przecinkiem', krok: 6, level: 'srednie',
            title: 'Kwoty z przecinkiem',
            short: 'Polskie kwoty: „12,5” to 12 zł 50 gr, a „3,05” to 3 zł 5 gr. Wczytaj jako napis, rozbierz na złote i grosze.',
            tags: ['napis i find(\',\')', 'liczenie w groszach', 'jedna czy dwie cyfry'],
            statement: ['W Polsce kwoty pisze się z przecinkiem: 12,50. Ktoś jednak wpisywał je niedbale: raz 12,50, raz 12,5, a raz samo 12. Zapis 12,5 oznacza 12 zł 50 gr (tak jak 12,50), 12,05 to 12 zł 5 gr, a 12 to 12 zł 0 gr.',
                'Wypisz sumę wszystkich kwot w formacie złote, przecinek i dokładnie dwie cyfry groszy.'],
            input_format: ['Kwoty oddzielone białymi znakami — do końca danych. Kwota to liczba złotych, po której może stać przecinek i jedna albo dwie cyfry.'],
            output_format: ['Suma w formacie Z,GG.'],
            constraints: ['Kwot jest od 1 do 8000.', 'Złotych w jednej kwocie: od 0 do 100 000 (bez zer na początku).'],
            examples: [{ input: '12,5 3,05\n7 0,99', note: '12,50 + 3,05 + 7,00 + 0,99 = 23,54.' }],
            hint: R`cin >> double tu nie pomoże — przecinek nie jest dla C++ częścią liczby. Czytaj kwotę jako string i znajdź przecinek: size_t p = s.find(',');. Bez przecinka (p == string::npos) to same złote. Z przecinkiem: złote to stoll(s.substr(0, p)), a grosze — część po przecinku: jedna cyfra razy 10, dwie cyfry tak jak są. Licz wszystko w groszach (long long).`,
            tests: (r) => {
                const kw = () => { const z = r.int(0, 100000); const p = r(); return p < 0.25 ? String(z) : p < 0.55 ? `${z},${r.int(0, 9)}` : `${z},${String(r.int(0, 99)).padStart(2, '0')}`; };
                return ['0', '0,01', '5,5 5,05 5,50 5', P.rozrzuc(r, Array.from({ length: 20 }, kw)), P.rozrzuc(r, Array.from({ length: 8000 }, kw)), Array(8000).fill('100000,99').join(' '), Array(3000).fill('0,9').join('\n')];
            },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 8000 && t.every((x) => /^(0|[1-9]\d*)(,\d\d?)?$/.test(x) && Number(x.split(',')[0]) <= 100000) ? null : 'kwota'; },
            solve: (inp) => {
                let s = 0;
                for (const x of toks(inp)) { const [z, g = ''] = x.split(','); s += Number(z) * 100 + (g.length === 1 ? Number(g) * 10 : g.length === 2 ? Number(g) : 0); }
                return `${Math.floor(s / 100)},${String(s % 100).padStart(2, '0')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    long long suma = 0;
    while (cin >> s) {
        size_t p = s.find(',');
        if (p == string::npos) {
            suma += stoll(s) * 100;
        } else {
            suma += stoll(s.substr(0, p)) * 100;
            string g = s.substr(p + 1);
            if (g.size() == 1) suma += (g[0] - '0') * 10;
            else suma += stoll(g);
        }
    }
    cout << suma / 100 << "," << setfill('0') << setw(2) << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-punkty-w-nawiasach', krok: 6, level: 'srednie',
            title: 'Punkty w nawiasach',
            short: 'Punkty zapisane jak w zeszycie: (3,-4) (10,2). Zjadaj nawiasy i przecinki zmienną char i znajdź prostokąt obejmujący wszystkie.',
            tags: ['cin >> a >> x >> b >> y >> c', 'nawiasy jako separatory', 'min i max'],
            statement: ['Uczeń przepisał punkty z zeszytu tak, jak pisze się je na matematyce: (x,y) — bez spacji w środku nawiasu, ale ze spacjami albo enterami między punktami.',
                'Wypisz najmniejszy prostokąt o bokach równoległych do osi, który zawiera wszystkie punkty: jego lewy dolny i prawy górny róg w tym samym formacie z nawiasami, a w drugim wierszu — jego pole.'],
            input_format: ['Punkty w formacie (x,y), oddzielone spacjami i enterami — do końca danych.'],
            output_format: ['W pierwszym wierszu dwa rogi oddzielone spacją: (x1,y1) (x2,y2).', 'W drugim wierszu pole prostokąta.'],
            constraints: ['Punktów jest od 1 do 4000.', '−10⁶ ≤ x, y ≤ 10⁶'],
            examples: [{ input: '(3,-4) (10,2)\n(-1,7)', note: 'x zmienia się od −1 do 10, y — od −4 do 7. Prostokąt ma wymiary 11 × 11, więc pole 121.' }],
            hint: R`char a, b, c; while (cin >> a >> x >> b >> y >> c) — a zjada „(”, b przecinek, c „)”. Minus przy liczbie nie przeszkadza: cin >> x wczyta −4 razem ze znakiem. Pole liczy w long long: (maxx − minx) · (maxy − miny) może sięgać 4 · 10¹².`,
            tests: (r) => {
                const d = (pk) => P.rozrzuc(r, pk.map(([x, y]) => `(${x},${y})`));
                const los = (n, M) => Array.from({ length: n }, () => [r.int(-M, M), r.int(-M, M)]);
                return ['(0,0)', '(5,-5) (5,-5)', '(-1000000,-1000000) (1000000,1000000)', d(los(10, 20)), d(los(1000, 1000000)), d(los(4000, 1000000)), d(Array.from({ length: 300 }, () => [7, r.int(-50, 50)]))];
            },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 4000 && t.every((p) => { const m = p.match(/^\((-?\d+),(-?\d+)\)$/); return m && calk(+m[1], -1e6, 1e6) && calk(+m[2], -1e6, 1e6); }) ? null : 'punkt'; },
            solve: (inp) => {
                const p = toks(inp).map((s) => s.slice(1, -1).split(',').map(Number)); const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
                const [a, b, c, d] = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
                return `(${a},${b}) (${c},${d})\n${(c - a) * (d - b)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x, y, minx = LLONG_MAX, miny = LLONG_MAX, maxx = LLONG_MIN, maxy = LLONG_MIN;
    char a, b, c;
    while (cin >> a >> x >> b >> y >> c) {
        minx = min(minx, x);
        maxx = max(maxx, x);
        miny = min(miny, y);
        maxy = max(maxy, y);
    }
    cout << "(" << minx << "," << miny << ") (" << maxx << "," << maxy << ")\n";
    cout << (maxx - minx) * (maxy - miny) << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-ukryte-liczby', krok: 6, level: 'srednie',
            title: 'Liczby ukryte w tekście',
            short: 'Tekst „abc12de5f100” kryje liczby 12, 5 i 100. Składaj każdą cyfra po cyfrze: x = x · 10 + cyfra.',
            tags: ['składanie liczby z cyfr', 'cin.get(c)', 'liczba na końcu danych'],
            statement: ['W tekście ukryto liczby: każdy ciąg cyfr stojących obok siebie to jedna liczba. Na przykład w abc12de5f100 są liczby 12, 5 i 100, a w Agent 007 — liczba 7 (zera na początku nie zmieniają wartości). Minusów nie ma — wszystkie liczby są nieujemne.',
                'Wypisz, ile jest liczb w tekście, i ich sumę.'],
            input_format: ['Tekst — do końca danych (litery, cyfry, spacje, interpunkcja, znaki końca wiersza).'],
            output_format: ['Dwie liczby: ile jest liczb i ich suma.'],
            constraints: ['Tekst ma od 1 do 50 000 znaków.', 'Każda liczba ma najwyżej 9 cyfr.'],
            examples: [{ input: 'abc12de5f100\nAgent 007 ma 2 psy.', note: 'Liczby to 12, 5, 100, 7 i 2 — pięć liczb o sumie 126.' }],
            hint: R`Czytaj znak po znaku: while (cin.get(c)). Trzymaj bieżącą liczbę x i flagę „jestem w liczbie”. Cyfra: x = x * 10 + (c - '0'). Każdy inny znak kończy liczbę — wtedy dolicz ją i wyzeruj x. Uwaga na liczbę, która stoi na samym końcu danych: po pętli trzeba ją jeszcze doliczyć.`,
            tests: (r) => {
                const t = (n) => { let s = ''; let cyfry = false; while (s.length < n) { if (!cyfry && r() < 0.4) { s += r.word(r.int(1, 9), '0123456789'); cyfry = true; } else { s += r.word(r.int(1, 6), 'abcdefghij XYZ.,!\n'); cyfry = false; } } return s; };
                return ['7', 'abc', '007', 'a1b2c3', 'abc12de5f100\nAgent 007 ma 2 psy.', '999999999 999999999\n999999999', t(500), t(30000), t(50000).slice(0, 50000)];
            },
            check: (inp) => (inp.length >= 1 && inp.length <= 50000 && ascii(inp) && (inp.match(/\d+/g) || []).every((x) => x.length <= 9) ? null : 'tekst'),
            solve: (inp) => { const m = inp.match(/\d+/g) || []; return `${m.length} ${m.reduce((a, b) => a + Number(b), 0)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    char c;
    long long x = 0, suma = 0;
    int ile = 0;
    bool wLiczbie = false;
    while (cin.get(c)) {
        if (isdigit(c)) {
            x = x * 10 + (c - '0');
            wLiczbie = true;
        } else if (wLiczbie) {
            suma += x;
            ile++;
            x = 0;
            wLiczbie = false;
        }
    }
    if (wLiczbie) {
        suma += x;
        ile++;
    }
    cout << ile << " " << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-dzialania-w-wierszach', krok: 6, level: 'srednie',
            title: 'Rachunki w wierszach',
            short: 'Każdy wiersz to działanie typu 12+7-3+100. stringstream: najpierw liczba, potem pary „znak liczba” aż do końca wiersza.',
            tags: ['stringstream', 'ss >> znak >> liczba', 'wiersz po wierszu'],
            statement: ['Każdy wiersz zawiera działanie złożone z liczb całkowitych nieujemnych oraz znaków + i −, bez spacji — na przykład 12+7-3+100. Wiersz może też zawierać samą liczbę. Policz wynik każdego działania.'],
            input_format: ['Działania, każde w osobnym wierszu — do końca danych.'],
            output_format: ['Wynik każdego działania w osobnym wierszu.'],
            constraints: ['Wierszy jest od 1 do 800, każdy ma najwyżej 100 znaków.', 'Liczby w działaniach: od 0 do 10⁹.'],
            examples: [{ input: '12+7-3+100\n5\n0-1000000000-1000000000', note: 'Trzeci wynik to −2 000 000 000 — nie mieści się w int, więc licz w long long.' }],
            hint: R`Dla każdego wiersza: stringstream ss(s); long long wynik, x; char op; ss >> wynik; while (ss >> op >> x) { if (op == '+') wynik += x; else wynik -= x; }. Strumień zatrzyma ss >> wynik na znaku +, bo + nie jest cyfrą, a minus zje zmienna op, zanim przeczytasz x.`,
            tests: (r) => {
                const dz = (k, M) => { let s = String(r.int(0, M)); for (let i = 0; i < k; i++) s += r.pick('+-') + r.int(0, M); return s; };
                const ogr = (s) => (s.length <= 100 ? s : s.slice(0, 100).replace(/[+-]\d*$/, ''));
                return ['0', '1000000000', '1-2', '12+7-3+100\n5\n0-1000000000-1000000000', Array.from({ length: 20 }, () => dz(r.int(0, 6), 50)).join('\n'),
                    Array.from({ length: 800 }, () => ogr(dz(r.int(0, 12), 1000000000))).join('\n'), Array.from({ length: 300 }, () => ogr(dz(40, 9))).join('\n')];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 800 && L.every((l) => l.length <= 100 && /^\d+([+-]\d+)*$/.test(l) && (l.match(/\d+/g) || []).every((x) => Number(x) <= 1e9)) ? null : 'działanie'; },
            solve: (inp) => linie(inp).map((l) => { let w = 0; for (const m of l.matchAll(/([+-]?)(\d+)/g)) w += (m[1] === '-' ? -1 : 1) * Number(m[2]); return w; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        stringstream ss(s);
        long long wynik, x;
        char op;
        ss >> wynik;
        while (ss >> op >> x) {
            if (op == '+') wynik += x;
            else wynik -= x;
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-klucz-wartosc', krok: 6, level: 'trudne',
            title: 'Klucz=wartość',
            short: 'Rekordy „wzrost=152;waga=41;wiek=12” z polami w dowolnej kolejności. Rozbij wiersz po średnikach, pole — po znaku =, i odpowiedz na pytania.',
            tags: ['getline(ss, pole, \';\')', 'find(\'=\') i substr', 'stoll'],
            statement: ['Pielęgniarka szkolna zapisuje dane uczniów w wierszach złożonych z pól klucz=wartość, rozdzielonych średnikami — na przykład wzrost=152;waga=41;wiek=12. Pola mogą stać w dowolnej kolejności, a niektórych może brakować.',
                'Najpierw dostajesz n rekordów, a potem q pytań — każde pytanie to nazwa klucza. Dla każdego pytania wypisz, ile rekordów ma to pole, i sumę jego wartości.'],
            input_format: ['W pierwszym wierszu n.', 'W następnych n wierszach rekordy (bez spacji).', 'Dalej wiersz z liczbą q i q wierszy z kluczami.'],
            output_format: ['q wierszy: liczba rekordów z danym kluczem i suma wartości (0 0, gdy klucza nie ma nigdzie).'],
            constraints: ['1 ≤ n ≤ 300, 1 ≤ q ≤ 500', 'Rekord ma od 1 do 8 pól; w jednym rekordzie klucze się nie powtarzają.', 'Klucze: od 1 do 10 małych liter. Wartości: liczby całkowite od −10⁹ do 10⁹.'],
            examples: [{ input: '3\nwzrost=152;waga=41;wiek=12\nwiek=13;wzrost=160\nwaga=38\n3\nwzrost\nwaga\noczy', note: 'wzrost jest w dwóch rekordach (152 + 160 = 312), waga też w dwóch (41 + 38 = 79), a oczu nie ma nigdzie.' }],
            hint: R`Rekord wczytaj przez getline i włóż do stringstream ss(s). getline(ss, pole, ';') wyciąga kolejne pola. W polu znajdź znak '=': klucz to pole.substr(0, p), wartość — stoll(pole.substr(p + 1)). Pary zbieraj do vector<pair<string, long long>>, a dla każdego pytania przejdź cały vector. Uwaga: po cin >> n i cin >> q zostaje enter — użyj cin >> ws albo cin.ignore().`,
            tests: (r) => {
                const KL = ['wzrost', 'waga', 'wiek', 'oczy', 'buty', 'klasa', 'numer', 'punkty', 'rok', 'ocena'];
                const rek = (mx) => r.shuffle(KL).slice(0, r.int(1, mx)).map((k) => `${k}=${r.int(-1000000000, 1000000000)}`).join(';');
                const d = (R0, Q) => `${R0.length}\n${R0.join('\n')}\n${Q.length}\n${Q.join('\n')}`;
                const pyt = (q) => Array.from({ length: q }, () => (r() < 0.8 ? r.pick(KL) : r.word(r.int(1, 10))));
                return [d(['a=5'], ['a', 'b']), d(['x=-1;y=-2', 'y=3'], ['y', 'x']), d(Array.from({ length: 10 }, () => rek(4)), pyt(10)),
                    d(Array.from({ length: 300 }, () => rek(8)), pyt(500)), d(Array.from({ length: 300 }, () => 'punkty=1000000000;rok=-1000000000'), ['punkty', 'rok', 'punkt'])];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 300)) return 'n';
                for (const l of L.slice(1, n + 1)) { const pola = l.split(';'); if (pola.length > 8) return '8'; const ks = new Set(); for (const p of pola) { const m = p.match(/^([a-z]{1,10})=(-?\d+)$/); if (!m || ks.has(m[1]) || !calk(+m[2], -1e9, 1e9)) return 'pole'; ks.add(m[1]); } }
                const q = Number(L[n + 1]); if (!calk(q, 1, 500) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((k) => /^[a-z]{1,10}$/.test(k)) ? null : 'klucz';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const pary = [];
                for (const l of L.slice(1, n + 1)) for (const p of l.split(';')) { const [k, v] = p.split('='); pary.push([k, Number(v)]); }
                return L.slice(n + 2).map((k) => { const z = pary.filter((p) => p[0] === k); return `${z.length} ${z.reduce((a, p) => a + p[1], 0)}`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<string, long long>> pary;
    for (int i = 0; i < n; i++) {
        string s, pole;
        getline(cin >> ws, s);
        stringstream ss(s);
        while (getline(ss, pole, ';')) {
            size_t p = pole.find('=');
            pary.push_back({pole.substr(0, p), stoll(pole.substr(p + 1))});
        }
    }
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string klucz;
        cin >> klucz;
        int ile = 0;
        long long suma = 0;
        for (auto &[k, v] : pary)
            if (k == klucz) {
                ile++;
                suma += v;
            }
        cout << ile << " " << suma << "\n";
    }
    return 0;
}`,
        },
    ];
};
