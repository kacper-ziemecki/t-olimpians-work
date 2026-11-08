// Vector — ćwiczenia w trakcie lekcji, części 5–8: vector 2D (tabele, wiersze różnej długości, grupy, plansze),
// podtablice, prefiksy i sufiksy (wszystkie podtablice, sumy prefiksowe, liderzy, okno), podzbiory i permutacje
// (dwa palce, maski dwójkowe, liczniki, sort i ==, next_permutation, permutacja odwrotna) oraz palindromy
// i dwa wskaźniki.
// Uczeń zna pierwszy etap, tablice, napisy i pary — ale jeszcze nie funkcje ani rekurencję.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const macierz = (r, n, m, lo, hi) => `${n} ${m}\n${Array.from({ length: n }, () => arr(r, m, lo, hi).join(' ')).join('\n')}`;
    const czytajM = (inp) => { const a = nums(inp); const [n, m] = a; const M = []; for (let i = 0; i < n; i++) M.push(a.slice(2 + i * m, 2 + (i + 1) * m)); return { n, m, M }; };
    const palindrom = (v) => v.every((x, i) => x === v[v.length - 1 - i]);
    const nastepna = (a) => {
        let i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i < 0) { a.reverse(); return false; }
        let j = a.length - 1;
        while (a[j] <= a[i]) j--;
        [a[i], a[j]] = [a[j], a[i]];
        for (let l = i + 1, r = a.length - 1; l < r; l++, r--) [a[l], a[r]] = [a[r], a[l]];
        return true;
    };

    return [
        // ================================================================ KROK 5 · vector 2D
        {
            id: 'vec-2d-transpozycja', krok: 5, level: 'latwe',
            title: 'Wiersze na kolumny',
            short: 'Tabela n × m zamienia się w tabelę m × n: pierwszy wiersz staje się pierwszą kolumną.',
            tags: ['vector<vector<int>>', 'm[w][k]', 'pętla w pętli'],
            statement: ['Wczytaj tabelę liczb o n wierszach i m kolumnach. Wypisz ją „przekręconą” tak, by wiersze stały się kolumnami: wynik ma m wierszy i n kolumn, a w wierszu numer i stoi kolumna numer i tabeli z wejścia (od góry do dołu).'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb całkowitych.'],
            output_format: ['m wierszy po n liczb.'],
            constraints: ['1 ≤ n, m ≤ 50', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '2 3\n1 2 3\n4 5 6', note: 'Pierwsza kolumna (1 i 4) staje się pierwszym wierszem wyniku, druga (2 i 5) — drugim.' }],
            hint: R`Wczytaj tabelę do vector<vector<int>> t(n, vector<int>(m));. Wypisując, zamień rolami pętle: zewnętrzna idzie po kolumnach k od 0 do m - 1, wewnętrzna po wierszach w od 0 do n - 1, i wypisuje t[w][k].`,
            tests: (r) => ['1 1\n7', '1 4\n1 2 3 4', '4 1\n1\n2\n3\n4', macierz(r, 3, 3, -9, 9), macierz(r, 50, 50, -1000, 1000), macierz(r, 7, 40, 0, 99)],
            solve: (inp) => { const { n, m, M } = czytajM(inp); const out = []; for (let k = 0; k < m; k++) out.push(M.map((w) => w[k]).join(' ')); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> t(n, vector<int>(m));
    for (auto &w : t) for (auto &x : w) cin >> x;
    for (int k = 0; k < m; k++) {
        for (int w = 0; w < n; w++) cout << t[w][k] << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-2d-sumy', krok: 5, level: 'latwe',
            title: 'Sumy wierszy i kolumn',
            short: 'Policz sumę każdego wiersza i każdej kolumny tabeli.',
            tags: ['vector 2D', 'sumy wierszy', 'sumy kolumn'],
            statement: ['Wczytaj tabelę liczb o n wierszach i m kolumnach. W pierwszym wierszu wypisz n liczb — sumy kolejnych wierszy. W drugim wierszu wypisz m liczb — sumy kolejnych kolumn.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb całkowitych.'],
            output_format: ['Dwa wiersze: sumy wierszy i sumy kolumn.'],
            constraints: ['1 ≤ n, m ≤ 100', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '2 3\n1 2 3\n10 20 30' }],
            hint: R`Sumy kolumn wygodnie zbierać w vector<long long> kol(m, 0); — przechodząc po tabeli, do kol[k] dodajesz t[w][k]. Sumę wiersza liczysz zwykłą zmienną wewnątrz pętli po wierszach. Sumy mieszczą się w int, ale long long nie zaszkodzi.`,
            tests: (r) => ['1 1\n-5', '2 2\n1 -1\n-1 1', macierz(r, 5, 4, -9, 9), macierz(r, 100, 100, -1000, 1000), macierz(r, 1, 100, -1e6, 1e6), macierz(r, 100, 1, -1e6, 1e6)],
            solve: (inp) => { const { m, M } = czytajM(inp); const w = M.map((row) => row.reduce((a, b) => a + b, 0)); const k = []; for (let j = 0; j < m; j++) k.push(M.reduce((a, row) => a + row[j], 0)); return `${w.join(' ')}\n${k.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> t(n, vector<int>(m));
    for (auto &w : t) for (auto &x : w) cin >> x;
    vector<long long> kol(m, 0);
    for (int w = 0; w < n; w++) {
        long long s = 0;
        for (int k = 0; k < m; k++) {
            s += t[w][k];
            kol[k] += t[w][k];
        }
        cout << s << " ";
    }
    cout << "\n";
    for (auto x : kol) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-2d-pascal', krok: 5, level: 'latwe',
            title: 'Trójkąt Pascala',
            short: 'Zbuduj n wierszy trójkąta Pascala — każdy wiersz o jeden dłuższy od poprzedniego.',
            tags: ['wiersze różnej długości', 't[i].push_back', 't[i - 1][j - 1] + t[i - 1][j]'],
            statement: ['Trójkąt Pascala buduje się tak: wiersz numer 0 to jedna jedynka. Każdy kolejny wiersz jest o jedną liczbę dłuższy, na jego brzegach stoją jedynki, a każda liczba w środku to suma dwóch liczb stojących nad nią: tej samej pozycji i pozycji o jeden w lewo w poprzednim wierszu. Wypisz pierwszych n wierszy.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['n wierszy trójkąta Pascala; wiersz numer i ma i + 1 liczb.'],
            constraints: ['1 ≤ n ≤ 30'],
            examples: [{ input: '5' }],
            hint: R`Utwórz vector<vector<int>> t(n); — n pustych wierszy. Do wiersza i dokładaj: najpierw 1, potem dla j od 1 do i - 1 liczbę t[i - 1][j - 1] + t[i - 1][j], a na końcu (gdy i > 0) znowu 1. Wiersz 29 ma liczby do 77 558 760 — mieszczą się w int.`,
            tests: () => ['1', '2', '3', '10', '17', '30'],
            solve: (inp) => { const n = nums(inp)[0]; const t = []; for (let i = 0; i < n; i++) { const w = [1]; for (let j = 1; j < i; j++) w.push(t[i - 1][j - 1] + t[i - 1][j]); if (i > 0) w.push(1); t.push(w); } return t.map((w) => w.join(' ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<vector<int>> t(n);
    for (int i = 0; i < n; i++) {
        t[i].push_back(1);
        for (int j = 1; j < i; j++) t[i].push_back(t[i - 1][j - 1] + t[i - 1][j]);
        if (i > 0) t[i].push_back(1);
    }
    for (auto w : t) {
        for (auto x : w) cout << x << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-2d-paragony', krok: 5, level: 'latwe',
            title: 'Paragony',
            short: 'Każdy klient kupił inną liczbę rzeczy. Zapamiętaj paragony i wypisz je od ostatniego klienta, ceny od najdroższej.',
            tags: ['wiersze różnej długości', 'sort na wierszu', 'pusty wiersz'],
            statement: ['Do sklepu przyszło n klientów. Każdy kupił k rzeczy (k może być zerem) — znasz ceny tych rzeczy. Wypisz paragony w odwrotnej kolejności: od ostatniego klienta do pierwszego. Paragon to jeden wiersz: najpierw suma zakupów, a po niej ceny wszystkich rzeczy od najdroższej do najtańszej. Klient, który nic nie kupił, ma paragon „0”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy liczba k, a po niej k cen.'],
            output_format: ['n wierszy — paragony od ostatniego klienta do pierwszego.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ k ≤ 100', 'Wszystkich cen jest łącznie najwyżej 2000.', '1 ≤ cena ≤ 10⁴'],
            examples: [{ input: '3\n2 10 30\n0\n3 5 20 5', note: 'Ostatni klient: suma 30, ceny 20 5 5. Drugi nic nie kupił. Pierwszy: 40, ceny 30 10.' }],
            hint: R`Zapamiętaj zakupy w vector<vector<int>> zak(n); — wiersz i ma tyle cen, ile kupił klient i. Wiersz posortujesz malejąco tak jak zwykły vector: sort(zak[i].begin(), zak[i].end()); a potem reverse. Pętla po klientach idzie od n - 1 do 0.`,
            check: (inp) => { const a = nums(inp); const n = a[0]; let i = 1, s = 0; for (let k = 0; k < n; k++) { s += a[i]; i += a[i] + 1; } return s <= 2000 ? null : 'za dużo cen'; },
            tests: (r) => {
                const t = (n, maxK, lo, hi) => { let zostalo = 2000; const ls = []; for (let i = 0; i < n; i++) { const k = Math.min(zostalo, r.int(0, maxK)); zostalo -= k; ls.push([k, ...arr(r, k, lo, hi)].join(' ')); } return `${n}\n${ls.join('\n')}`; };
                return ['1\n0', '1\n1 7', '2\n3 1 1 1\n2 2 2', t(10, 5, 1, 50), t(100, 40, 1, 1e4), t(20, 100, 1, 1e4), t(100, 3, 1, 9)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; let i = 1; const z = []; for (let k = 0; k < n; k++) { const c = a[i]; z.push(a.slice(i + 1, i + 1 + c)); i += c + 1; } return z.reverse().map((w) => [w.reduce((x, y) => x + y, 0), ...w.slice().sort((x, y) => y - x)].join(' ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<vector<int>> zak(n);
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int c;
            cin >> c;
            zak[i].push_back(c);
        }
    }
    for (int i = n - 1; i >= 0; i--) {
        sort(zak[i].begin(), zak[i].end());
        reverse(zak[i].begin(), zak[i].end());
        int suma = 0;
        for (auto c : zak[i]) suma += c;
        cout << suma;
        for (auto c : zak[i]) cout << " " << c;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-2d-listy-klas', krok: 5, level: 'srednie',
            title: 'Listy klas',
            short: 'Rozdziel uczniów do szuflad według numeru klasy i wypisz listę każdej klasy.',
            tags: ['vector<vector<string>> g(k + 1)', 'g[nr].push_back', 'grupy'],
            statement: ['W szkole jest k klas o numerach od 1 do k. O każdym z n uczniów wiesz, jak ma na imię i do której klasy chodzi. Wypisz listy klas: dla każdej klasy od 1 do k jeden wiersz w postaci „numer: imiona”, z imionami w kolejności z wejścia. Jeśli do klasy nikt nie chodzi, zamiast imion wypisz myślnik.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z kolejnych n wierszy imię i numer klasy.'],
            output_format: ['k wierszy w postaci „numer: imiona” albo „numer: -”.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 100', 'Imiona składają się z liter i mają do 10 znaków.'],
            examples: [{ input: '5 3\nOla 2\nJan 1\nEwa 2\nIgor 2\nIda 1' }],
            hint: R`Zrób k + 1 szuflad: vector<vector<string>> klasa(k + 1); (szuflada 0 nie jest używana). Ucznia wrzucasz przez klasa[nr].push_back(imie);. Na koniec dla nr od 1 do k wypisz nr, dwukropek i imiona — albo myślnik, gdy klasa[nr].empty().`,
            tests: (r) => {
                const t = (n, k) => `${n} ${k}\n${Array.from({ length: n }, () => `${r.pick(IMIONA)} ${r.int(1, k)}`).join('\n')}`;
                return ['1 1\nOla 1', '2 3\nA 3\nB 3', t(10, 4), t(1000, 100), t(1000, 3), t(5, 100)];
            },
            solve: (inp) => { const t = toks(inp); const n = +t[0], k = +t[1]; const g = Array.from({ length: k + 1 }, () => []); for (let i = 0; i < n; i++) g[+t[3 + 2 * i]].push(t[2 + 2 * i]); return g.slice(1).map((w, i) => `${i + 1}: ${w.length ? w.join(' ') : '-'}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<vector<string>> klasa(k + 1);
    for (int i = 0; i < n; i++) {
        string imie;
        int nr;
        cin >> imie >> nr;
        klasa[nr].push_back(imie);
    }
    for (int nr = 1; nr <= k; nr++) {
        cout << nr << ":";
        if (klasa[nr].empty()) cout << " -";
        for (auto s : klasa[nr]) cout << " " << s;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-2d-saper', krok: 5, level: 'srednie',
            title: 'Saper',
            short: 'Plansza z minami jako vector napisów. W każde wolne pole wpisz, ile min jest dookoła.',
            tags: ['vector<string>', 'osiem sąsiadów', 'brzegi planszy'],
            statement: ['Plansza sapera ma n wierszy i m kolumn. Gwiazdka * to mina, kropka . to wolne pole. Wypisz planszę, w której każde wolne pole zostało zastąpione cyfrą — liczbą min na sąsiednich polach. Sąsiadów jest najwyżej osiem: w poziomie, w pionie i po skosie. Miny zostają gwiazdkami.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m znaków: * albo .'],
            output_format: ['n wierszy po m znaków.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '3 4\n*...\n..*.\n....' }],
            hint: R`Wczytaj planszę do vector<string> p(n);. Dla każdego wolnego pola (w, k) sprawdź osiem sąsiadów: dw i dk od -1 do 1, z pominięciem dw = dk = 0. Zanim zajrzysz do p[w + dw][k + dk], sprawdź, czy nowa pozycja leży na planszy. Wynik zapisuj do kopii planszy — znak cyfry to '0' + liczba.`,
            tests: (r) => {
                const t = (n, m, pm) => `${n} ${m}\n${Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < pm ? '*' : '.')).join('')).join('\n')}`;
                return ['1 1\n.', '1 1\n*', '3 3\n***\n*.*\n***', '2 5\n.....\n.....', t(10, 10, 0.2), t(100, 100, 0.15), t(100, 100, 0.6), t(1, 100, 0.3)];
            },
            solve: (inp) => { const t = toks(inp); const n = +t[0], m = +t[1]; const p = t.slice(2, 2 + n); return p.map((w, i) => [...w].map((c, j) => { if (c === '*') return '*'; let s = 0; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { if (!a && !b) continue; const x = i + a, y = j + b; if (x >= 0 && x < n && y >= 0 && y < m && p[x][y] === '*') s++; } return String(s); }).join('')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> p(n);
    for (auto &w : p) cin >> w;
    vector<string> wynik = p;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (p[w][k] == '*') continue;
            int s = 0;
            for (int dw = -1; dw <= 1; dw++) {
                for (int dk = -1; dk <= 1; dk++) {
                    if (dw == 0 && dk == 0) continue;
                    int nw = w + dw, nk = k + dk;
                    if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] == '*') s++;
                }
            }
            wynik[w][k] = '0' + s;
        }
    }
    for (auto w : wynik) cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-2d-obrot', krok: 5, level: 'srednie',
            title: 'Obrót o 90 stopni',
            short: 'Obróć tabelę n × m o 90 stopni w prawo. Wynik ma m wierszy i n kolumn.',
            tags: ['vector 2D o nowych wymiarach', 'r[k][n - 1 - w] = t[w][k]', 'rysunek na kartce'],
            statement: ['Wczytaj tabelę liczb o n wierszach i m kolumnach i obróć ją o 90 stopni zgodnie z ruchem wskazówek zegara. Po obrocie tabela ma m wierszy i n kolumn: pierwszy wiersz wyniku to pierwsza kolumna tabeli czytana od dołu do góry.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb całkowitych.'],
            output_format: ['m wierszy po n liczb.'],
            constraints: ['1 ≤ n, m ≤ 50', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '2 3\n1 2 3\n4 5 6', note: 'Pierwsza kolumna od dołu: 4 1. Druga: 5 2. Trzecia: 6 3.' }],
            hint: R`Utwórz wynik o odwróconych wymiarach: vector<vector<int>> r(m, vector<int>(n));. Liczba z wiersza w i kolumny k trafia do wiersza k i kolumny n - 1 - w. Narysuj sobie przykład 2 × 3 na kartce i sprawdź wzór na jednej liczbie, zanim napiszesz pętlę.`,
            tests: (r) => ['1 1\n5', '1 3\n1 2 3', '3 1\n1\n2\n3', macierz(r, 4, 4, -9, 9), macierz(r, 50, 50, -1000, 1000), macierz(r, 13, 37, 0, 99)],
            solve: (inp) => { const { n, m, M } = czytajM(inp); const out = []; for (let k = 0; k < m; k++) { const w = []; for (let i = n - 1; i >= 0; i--) w.push(M[i][k]); out.push(w.join(' ')); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> t(n, vector<int>(m));
    for (auto &w : t) for (auto &x : w) cin >> x;
    vector<vector<int>> r(m, vector<int>(n));
    for (int w = 0; w < n; w++)
        for (int k = 0; k < m; k++) r[k][n - 1 - w] = t[w][k];
    for (auto w : r) {
        for (auto x : w) cout << x << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-2d-obserwujacy', krok: 5, level: 'srednie',
            title: 'Kto kogo obserwuje',
            short: 'Lista „kogo obserwuje” dla każdej osoby i najpopularniejsza osoba. Pierwsza lista sąsiedztwa!',
            tags: ['vector<vector<int>> g(n + 1)', 'lista sąsiedztwa', 'licznik obserwujących'],
            statement: ['W serwisie jest n osób o numerach od 1 do n. Dostajesz m informacji „a b”, które znaczą: osoba a obserwuje osobę b. Dla każdej osoby od 1 do n wypisz wiersz w postaci „numer: lista”, gdzie lista to numery osób, które ta osoba obserwuje — w kolejności z wejścia (albo myślnik, jeśli nikogo nie obserwuje). W ostatnim wierszu wypisz numer osoby, którą obserwuje najwięcej osób, i liczbę jej obserwujących. Przy remisie wybierz osobę o mniejszym numerze.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy dwie liczby a i b.'],
            output_format: ['n wierszy „numer: lista” i jeden wiersz z dwiema liczbami.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ m ≤ 2000', 'a ≠ b, żadna para się nie powtarza'],
            examples: [{ input: '4 5\n1 2\n3 2\n1 4\n4 2\n2 1', note: 'Osobę 2 obserwują trzy osoby: 1, 3 i 4.' }],
            hint: R`To tak zwana lista sąsiedztwa: vector<vector<int>> g(n + 1); i g[a].push_back(b);. Obok trzymaj vector<int> obs(n + 1, 0); i rób obs[b]++. Najpopularniejszą osobę znajdziesz jak maksimum — zmieniaj ją tylko przy ostro większej liczbie.`,
            check: (inp) => { const a = nums(inp); const [n, m] = a; const s = new Set(); for (let i = 0; i < m; i++) { const x = a[2 + 2 * i], y = a[3 + 2 * i]; if (x === y || x < 1 || y < 1 || x > n || y > n) return 'zła para'; const k = x * 2000 + y; if (s.has(k)) return 'powtórka'; s.add(k); } return null; },
            tests: (r) => {
                const t = (n, m) => { const s = new Set(); const ps = []; while (ps.length < m) { const x = r.int(1, n), y = r.int(1, n); if (x === y || s.has(x * 2000 + y)) continue; s.add(x * 2000 + y); ps.push(`${x} ${y}`); } return `${n} ${m}${m ? '\n' + ps.join('\n') : ''}`; };
                return ['1 0', '2 2\n1 2\n2 1', '3 0', t(10, 20), t(1000, 2000), t(30, 600), t(1000, 50)];
            },
            solve: (inp) => { const a = nums(inp); const [n, m] = a; const g = Array.from({ length: n + 1 }, () => []); const o = Array(n + 1).fill(0); for (let i = 0; i < m; i++) { g[a[2 + 2 * i]].push(a[3 + 2 * i]); o[a[3 + 2 * i]]++; } let b = 1; for (let i = 2; i <= n; i++) if (o[i] > o[b]) b = i; return [...g.slice(1).map((w, i) => `${i + 1}: ${w.length ? w.join(' ') : '-'}`), `${b} ${o[b]}`].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    vector<int> obs(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        obs[b]++;
    }
    int best = 1;
    for (int i = 1; i <= n; i++) {
        cout << i << ":";
        if (g[i].empty()) cout << " -";
        for (auto x : g[i]) cout << " " << x;
        cout << "\n";
        if (obs[i] > obs[best]) best = i;
    }
    cout << best << " " << obs[best] << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · podtablice, prefiksy, sufiksy
        {
            id: 'vec-wszystkie-podtablice', krok: 6, level: 'latwe',
            title: 'Wszystkie podtablice',
            short: 'Wypisz każdą podtablicę ciągu w osobnym wierszu — według początku, a potem według końca.',
            tags: ['podtablica (I, J)', 'trzy pętle', 'j zaczyna się od i'],
            statement: ['Podtablica to kawałek ciągu złożony z elementów stojących obok siebie, bez przerw. Wypisz wszystkie podtablice ciągu n liczb, każdą w osobnym wierszu. Kolejność: najpierw podtablice zaczynające się na pierwszym elemencie (od najkrótszej), potem zaczynające się na drugim, i tak dalej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n · (n + 1) / 2 wierszy — kolejne podtablice.'],
            constraints: ['1 ≤ n ≤ 8', '−100 ≤ każda liczba ≤ 100'],
            examples: [{ input: '3\n1 8 9' }],
            hint: R`Pętla po początku i, w niej pętla po końcu j — ale j startuje od i, nie od 0 (koniec nie może być przed początkiem). W środku trzecia pętla po k od i do j wypisuje elementy jednej podtablicy, a po niej znak nowej linii.`,
            tests: (r) => ['1\n5', '2\n-1 1', fmt(arr(r, 5, -9, 9)), fmt(arr(r, 8, -100, 100)), '8\n1 1 1 1 1 1 1 1'],
            solve: (inp) => { const v = nums(inp).slice(1); const out = []; for (let i = 0; i < v.length; i++) for (let j = i; j < v.length; j++) out.push(v.slice(i, j + 1).join(' ')); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            for (int k = i; k <= j; k++) cout << a[k] << " ";
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'vec-prefiksy-sufiksy', krok: 6, level: 'latwe',
            title: 'Prefiksy i sufiksy',
            short: 'Wypisz wszystkie prefiksy ciągu, a potem wszystkie sufiksy — za każdym razem od najkrótszego.',
            tags: ['prefiks (0, J)', 'sufiks (I, n − 1)', 'n prefiksów i n sufiksów'],
            statement: ['Prefiks to kawałek ciągu, który zaczyna się na pierwszym elemencie. Sufiks to kawałek, który kończy się na ostatnim elemencie. Wypisz najpierw wszystkie n prefiksów ciągu, od najkrótszego do najdłuższego, a potem wszystkie n sufiksów, też od najkrótszego do najdłuższego. Każdy w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['2n wierszy: n prefiksów, potem n sufiksów.'],
            constraints: ['1 ≤ n ≤ 10', '−100 ≤ każda liczba ≤ 100'],
            examples: [{ input: '3\n1 3 0', note: 'Prefiksy: 1 / 1 3 / 1 3 0. Sufiksy: 0 / 3 0 / 1 3 0. Cały ciąg jest i prefiksem, i sufiksem.' }],
            hint: R`Prefiks kończący się na J to elementy od 0 do J — pętla po J od 0 do n - 1, a w niej wypisywanie od 0 do J. Najkrótszy sufiks zaczyna się na I = n - 1, więc pętla po I idzie od n - 1 w dół do 0, a w niej wypisujesz elementy od I do n - 1.`,
            tests: (r) => ['1\n7', '2\n4 5', fmt(arr(r, 6, -9, 9)), fmt(arr(r, 10, -100, 100))],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; const out = []; for (let j = 0; j < n; j++) out.push(v.slice(0, j + 1).join(' ')); for (let i = n - 1; i >= 0; i--) out.push(v.slice(i).join(' ')); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    for (int J = 0; J < n; J++) {
        for (int k = 0; k <= J; k++) cout << a[k] << " ";
        cout << "\n";
    }
    for (int I = n - 1; I >= 0; I--) {
        for (int k = I; k < n; k++) cout << a[k] << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-okno', krok: 6, level: 'latwe',
            title: 'Najlepsze k dni',
            short: 'Opady z n dni. W których k kolejnych dniach spadło najwięcej deszczu? Okno przesuwane o jeden.',
            tags: ['okno długości k', 'suma += a[i] - a[i - k]', 'pierwsze najlepsze'],
            statement: ['Przez n dni mierzono opady deszczu. Znajdź k kolejnych dni, w których spadło łącznie najwięcej deszczu. Wypisz tę największą sumę i numer pierwszego dnia takiego okresu (dni numerujemy od 1). Jeśli kilka okresów ma tę samą największą sumę, wybierz ten, który zaczyna się najwcześniej.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — opady w kolejne dni.'],
            output_format: ['Dwie liczby: największa suma i numer pierwszego dnia.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁴', '0 ≤ opady ≤ 1000'],
            examples: [{ input: '7 3\n3 1 4 1 5 9 2', note: 'Okna: 8, 6, 10, 15, 16. Najlepsze zaczyna się w dniu 5: 5 + 9 + 2 = 16.' }],
            hint: R`Policz sumę pierwszych k dni. Potem przesuwaj okno: dla i od k do n - 1 do sumy wchodzi a[i], a wychodzi a[i - k]. Okno kończy się wtedy na dniu i, więc zaczyna na numerze i - k + 1 (licząc od 0) — dodaj 1 przy wypisywaniu. Zmieniaj najlepsze tylko przy ostro większej sumie.`,
            check: (inp) => { const [n, k] = nums(inp); return k >= 1 && k <= n ? null : 'zle k'; },
            tests: (r) => ['1 1\n0', '5 5\n1 2 3 4 5', '6 2\n5 5 5 5 5 5', `20 4\n${arr(r, 20, 0, 20).join(' ')}`, `10000 100\n${arr(r, 10000, 0, 1000).join(' ')}`, `10000 1\n${arr(r, 10000, 0, 1000).join(' ')}`, `3000 2999\n${arr(r, 3000, 0, 10).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = a.slice(2); let s = 0; for (let i = 0; i < k; i++) s += v[i]; let b = s, bs = 0; for (let i = k; i < n; i++) { s += v[i] - v[i - k]; if (s > b) { b = s; bs = i - k + 1; } } return `${b} ${bs + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    long long s = 0;
    for (int i = 0; i < k; i++) s += a[i];
    long long best = s;
    int start = 0;
    for (int i = k; i < n; i++) {
        s += a[i] - a[i - k];
        if (s > best) {
            best = s;
            start = i - k + 1;
        }
    }
    cout << best << " " << start + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-sumy-przedzialow', krok: 6, level: 'latwe',
            title: 'Sumy na przedziałach',
            short: 'Wiele pytań „ile wynosi suma od a do b?”. Sumy prefiksów odpowiadają na każde jednym odejmowaniem.',
            tags: ['vector<long long> p(n + 1)', 'p[b] - p[a - 1]', 'prefiksy'],
            statement: ['Wczytaj ciąg n liczb całkowitych, a potem q pytań. Każde pytanie to dwie liczby a i b (1 ≤ a ≤ b ≤ n) i znaczy: ile wynosi suma elementów od miejsca a do miejsca b włącznie (miejsca liczymy od 1)? Odpowiedz na każde pytanie w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb.', 'W trzecim wierszu liczba q, a w kolejnych q wierszach liczby a i b.'],
            output_format: ['q wierszy — sumy dla kolejnych pytań.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ q ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 3 0 -1 2\n3\n2 4\n1 5\n3 3' }],
            hint: R`Policz sumy prefiksów: vector<long long> p(n + 1, 0); i p[i + 1] = p[i] + a[i]. Przy miejscach liczonych od 1 suma od a do b to p[b] - p[a - 1] — p[b] to suma pierwszych b elementów, a p[a - 1] to wszystko przed miejscem a. Sumy sięgają 10¹³, więc long long jest konieczny.`,
            check: (inp) => { const a = nums(inp); const n = a[0]; const q = a[n + 1]; for (let i = 0; i < q; i++) { const x = a[n + 2 + 2 * i], y = a[n + 3 + 2 * i]; if (!(x >= 1 && x <= y && y <= n)) return 'zle a b'; } return null; },
            tests: (r) => {
                const t = (n, q, lo, hi) => `${fmt(arr(r, n, lo, hi))}\n${q}\n${Array.from({ length: q }, () => { const x = r.int(1, n), y = r.int(1, n); return `${Math.min(x, y)} ${Math.max(x, y)}`; }).join('\n')}`;
                return ['1\n-7\n1\n1 1', '3\n1000000000 1000000000 1000000000\n2\n1 3\n2 2', t(20, 10, -10, 10), t(10000, 1000, -1e6, 1e6), t(5000, 1000, -1e9, 1e9), t(9000, 1, 1e9, 1e9)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const p = [0]; for (let i = 0; i < n; i++) p.push(p[i] + a[1 + i]); const q = a[n + 1]; const out = []; for (let i = 0; i < q; i++) out.push(p[a[n + 3 + 2 * i]] - p[a[n + 2 + 2 * i] - 1]); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n), p(n + 1, 0);
    for (auto &x : a) cin >> x;
    for (int i = 0; i < n; i++) p[i + 1] = p[i] + a[i];
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int x, y;
        cin >> x >> y;
        cout << p[y] - p[x - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-liderzy', krok: 6, level: 'srednie',
            title: 'Liderzy',
            short: 'Lider jest większy od wszystkiego na prawo od siebie. Idź od końca i pamiętaj maksimum sufiksu.',
            tags: ['sufiks', 'pętla od końca', 'maksimum sufiksu'],
            statement: ['Element ciągu nazywamy liderem, jeśli jest ostro większy od każdego elementu stojącego na prawo od niego. Ostatni element jest zawsze liderem. Wypisz wszystkich liderów w kolejności, w jakiej stoją w ciągu (od lewej do prawej).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: liderzy od lewej do prawej.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '6\n16 17 4 3 5 2' }, { input: '3\n5 5 5', note: 'Pierwsze dwie piątki nie są ostro większe od piątki na prawo — liderem jest tylko ostatnia.' }],
            hint: R`Sprawdzanie każdego elementu z całym sufiksem za nim to dwie pętle — działa, ale można prościej. Idź od końca i pamiętaj największy element sufiksu, który już przeszedłeś. Element jest liderem, gdy jest większy od tego maksimum. Liderów znajdziesz od prawej, więc zbieraj ich w vectorze i odwróć go przed wypisaniem.`,
            tests: (r) => ['1\n-3', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 15, -9, 9)), fmt(arr(r, 2000, -1e6, 1e6)), fmt(Array.from({ length: 2000 }, (_, i) => 1e6 - i * 7)), fmt(arr(r, 2000, 0, 3))],
            solve: (inp) => { const v = nums(inp).slice(1); const w = []; let m = -Infinity; for (let i = v.length - 1; i >= 0; i--) { if (v[i] > m) w.push(v[i]); m = Math.max(m, v[i]); } return w.reverse().join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    vector<int> liderzy;
    int m = INT_MIN;
    for (int i = n - 1; i >= 0; i--) {
        if (a[i] > m) liderzy.push_back(a[i]);
        m = max(m, a[i]);
    }
    reverse(liderzy.begin(), liderzy.end());
    for (auto x : liderzy) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-rosnacy-kawalek', krok: 6, level: 'srednie',
            title: 'Najdłuższy rosnący kawałek',
            short: 'Znajdź najdłuższą podtablicę, w której każdy element jest większy od poprzedniego.',
            tags: ['podtablica', 'bieżąca długość', 'początek najlepszej'],
            statement: ['Znajdź najdłuższą podtablicę ciągu (kawałek bez przerw), w której każdy kolejny element jest ostro większy od poprzedniego. Wypisz jej długość oraz miejsce początku i końca (miejsca liczymy od 1). Jeśli takich najdłuższych podtablic jest kilka, wypisz tę, która zaczyna się najwcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy liczby: długość, początek i koniec.'],
            constraints: ['1 ≤ n ≤ 10⁴', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n5 1 2 3 3 4 5 6', note: 'Kawałek 3 4 5 6 (miejsca 5–8) jest dłuższy od 1 2 3.' }, { input: '3\n3 2 1', note: 'Każdy pojedynczy element to rosnący kawałek długości 1.' }],
            hint: R`Wystarczy jedno przejście. Trzymaj długość bieżącego rosnącego kawałka, który kończy się na elemencie i: jeśli a[i] > a[i - 1], wydłuż go o 1, a jeśli nie — zacznij nowy kawałek o długości 1. Gdy bieżąca długość jest ostro większa od najlepszej, zapamiętaj ją i koniec i — początek to i - dlugosc + 1.`,
            tests: (r) => ['1\n0', '5\n1 2 3 4 5', '6\n1 2 1 2 1 2', fmt(arr(r, 30, 0, 9)), fmt(arr(r, 10000, -1e9, 1e9)), fmt(Array.from({ length: 10000 }, (_, i) => (i % 500) - 250)), fmt(arr(r, 5000, 0, 1))],
            solve: (inp) => { const v = nums(inp).slice(1); let d = 1, bd = 1, bk = 0; for (let i = 1; i < v.length; i++) { d = v[i] > v[i - 1] ? d + 1 : 1; if (d > bd) { bd = d; bk = i; } } return `${bd} ${bk - bd + 2} ${bk + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int d = 1, best = 1, koniec = 0;
    for (int i = 1; i < n; i++) {
        if (a[i] > a[i - 1]) d++;
        else d = 1;
        if (d > best) {
            best = d;
            koniec = i;
        }
    }
    cout << best << " " << koniec - best + 2 << " " << koniec + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-rowny-podzial', krok: 6, level: 'srednie',
            title: 'Równy podział',
            short: 'Gdzie przeciąć ciąg na prefiks i sufiks o równych sumach? Wypisz wszystkie miejsca cięcia.',
            tags: ['prefiks i sufiks', 'suma prefiksu = całość − prefiks', 'long long'],
            statement: ['Ciąg n liczb można przeciąć w jednym z n − 1 miejsc: cięcie k (1 ≤ k ≤ n − 1) dzieli go na prefiks złożony z k pierwszych elementów i sufiks złożony z pozostałych n − k elementów. Znajdź wszystkie cięcia, po których suma prefiksu jest równa sumie sufiksu. W pierwszym wierszu wypisz, ile ich jest, a w drugim — same liczby k rosnąco (albo BRAK).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: liczba dobrych cięć i ich numery k (albo BRAK).'],
            constraints: ['2 ≤ n ≤ 3000', '−10⁴ ≤ każda liczba ≤ 10⁴'],
            examples: [{ input: '6\n1 2 3 -2 4 -2', note: 'Cięcie 2: prefiks 1 + 2 = 3, sufiks 3 + (−2) + 4 + (−2) = 3 — równe. Przy każdym innym cięciu sumy się różnią.' }, { input: '4\n0 0 0 0' }],
            hint: R`Najpierw policz sumę całego ciągu. Potem idź po k od 1 do n - 1 i dokładaj kolejne elementy do sumy prefiksu. Suma sufiksu to wtedy całość minus prefiks — nie trzeba jej liczyć osobną pętlą.`,
            tests: (r) => ['2\n5 5', '2\n1 2', '3\n-1 0 -1', fmt(arr(r, 12, -2, 2)), fmt(arr(r, 3000, -1e4, 1e4)), fmt(Array(3000).fill(0)), fmt(arr(r, 3000, -1, 1))],
            solve: (inp) => { const v = nums(inp).slice(1); const s = v.reduce((a, b) => a + b, 0); let p = 0; const w = []; for (let k = 1; k < v.length; k++) { p += v[k - 1]; if (p === s - p) w.push(k); } return `${w.length}\n${w.length ? w.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    long long suma = 0;
    for (auto &x : a) {
        cin >> x;
        suma += x;
    }
    vector<int> dobre;
    long long pref = 0;
    for (int k = 1; k < n; k++) {
        pref += a[k - 1];
        if (pref == suma - pref) dobre.push_back(k);
    }
    cout << dobre.size() << "\n";
    if (dobre.empty()) cout << "BRAK";
    for (auto k : dobre) cout << k << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-podtablice-o-sumie', krok: 6, level: 'srednie',
            title: 'Podtablice o sumie k',
            short: 'Ile podtablic ma sumę dokładnie k? Dwie pętle i suma, która rośnie razem z końcem.',
            tags: ['wszystkie podtablice', 'suma bez trzeciej pętli', 'n(n+1)/2'],
            statement: ['Policz, ile podtablic ciągu (kawałków złożonych z elementów stojących obok siebie) ma sumę równą dokładnie k. Dwie podtablice są różne, jeśli zaczynają się albo kończą w innym miejscu — nawet jeśli wyglądają tak samo.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — ile podtablic ma sumę k.'],
            constraints: ['1 ≤ n ≤ 2000', '−1000 ≤ każda liczba ≤ 1000', '−10⁶ ≤ k ≤ 10⁶'],
            examples: [{ input: '5 3\n1 2 1 2 1', note: 'Sumę 3 mają: 1 2, 2 1, 1 2 i 2 1 — cztery podtablice.' }, { input: '3 0\n0 0 0', note: 'Każda z 6 podtablic ma sumę 0.' }],
            hint: R`Dla każdego początku i trzymaj sumę s, zaczynając od zera, i przesuwaj koniec j od i do n - 1, dodając a[j]. Po każdym dodaniu s to suma podtablicy (i, j) — jeśli równa się k, zwiększ licznik. Dwie pętle, około 2 milionów kroków.`,
            tests: (r) => ['1 5\n5', '1 5\n4', '4 -2\n-1 -1 -1 -1', `20 2\n${arr(r, 20, -2, 3).join(' ')}`, `2000 0\n${arr(r, 2000, -3, 3).join(' ')}`, '2000 0\n' + Array(2000).fill(0).join(' '), `2000 500\n${arr(r, 2000, -1000, 1000).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = a.slice(2); let c = 0; for (let i = 0; i < n; i++) { let s = 0; for (let j = i; j < n; j++) { s += v[j]; if (s === k) c++; } } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    long long ile = 0;
    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int j = i; j < n; j++) {
            s += a[j];
            if (s == k) ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-najlepszy-kawalek', krok: 6, level: 'srednie',
            title: 'Najlepszy kawałek',
            short: 'Podtablica o największej sumie — i gdzie się zaczyna oraz kończy.',
            tags: ['wszystkie podtablice', 'long long', 'remis: najmniejszy początek'],
            statement: ['Zysk sklepu w kolejnych n dniach może być dodatni albo ujemny. Znajdź okres kolejnych dni (co najmniej jeden dzień) o największym łącznym zysku. Wypisz ten zysk oraz numery pierwszego i ostatniego dnia okresu (dni numerujemy od 1). Jeśli najlepszych okresów jest kilka, wybierz ten, który zaczyna się najwcześniej, a spośród nich — ten, który najwcześniej się kończy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — zyski w kolejne dni.'],
            output_format: ['Trzy liczby: największy zysk, pierwszy dzień, ostatni dzień.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁶ ≤ każdy zysk ≤ 10⁶'],
            examples: [{ input: '5\n2 -5 4 3 -1' }, { input: '3\n-3 -1 -2', note: 'Wszystkie zyski są ujemne — najlepszy jest jeden dzień ze stratą 1.' }],
            hint: R`Dla każdego początku i zwiększaj koniec j i dokładaj a[j] do sumy. Najlepszą sumę zacznij od a[0] (a nie od zera — wszystkie liczby mogą być ujemne!) i zmieniaj ją tylko przy ostro większej sumie: wtedy przy remisie zostaje okres o najmniejszym i, a przy tym samym i — o najmniejszym j. Suma 2000 dni może przekroczyć zakres int.`,
            tests: (r) => ['1\n-5', '4\n1 1 -2 2', '5\n0 0 0 0 0', fmt(arr(r, 30, -10, 10)), fmt(arr(r, 2000, -1e6, 1e6)), fmt(arr(r, 2000, 1e6 - 10, 1e6)), fmt(arr(r, 2000, -1e6, -1))],
            solve: (inp) => { const v = nums(inp).slice(1); let b = v[0], bi = 0, bj = 0; for (let i = 0; i < v.length; i++) { let s = 0; for (let j = i; j < v.length; j++) { s += v[j]; if (s > b) { b = s; bi = i; bj = j; } } } return `${b} ${bi + 1} ${bj + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long best = a[0];
    int bi = 0, bj = 0;
    for (int i = 0; i < n; i++) {
        long long s = 0;
        for (int j = i; j < n; j++) {
            s += a[j];
            if (s > best) {
                best = s;
                bi = i;
                bj = j;
            }
        }
    }
    cout << best << " " << bi + 1 << " " << bj + 1 << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 7 · podzbiory i permutacje
        {
            id: 'vec-wykreslanka', krok: 7, level: 'latwe',
            title: 'Wykreślanka',
            short: 'Czy da się otrzymać ciąg b, wykreślając niektóre elementy z ciągu a? Dwa palce.',
            tags: ['podzbiór z zachowaniem kolejności', 'dwa palce', 'TAK / NIE'],
            statement: ['Masz ciąg a o n elementach i ciąg b o m elementach. Czy da się otrzymać b, wykreślając z a niektóre elementy (być może żadnego) i nie zmieniając kolejności pozostałych? Innymi słowy: czy b jest podzbiorem a, w którym zachowano kolejność? Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb ciągu a.', 'W trzecim wierszu liczba m, w czwartym m liczb ciągu b.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '9\n1 5 4 -6 15 9 2 1 1\n3\n5 -6 1' }, { input: '9\n1 5 4 -6 15 9 2 1 1\n2\n9 15', note: '15 stoi w a przed 9 — kolejności zmieniać nie wolno.' }],
            hint: R`Prowadź palec j po b (na początku j = 0). Idź po a od lewej; gdy a[i] == b[j], przesuń j o jeden. Jeśli na końcu j == m, to znalazłeś wszystkie elementy b po kolei. Uważaj, żeby nie czytać b[j], gdy j już doszło do m.`,
            tests: (r) => {
                const a = arr(r, 1000, 0, 9); const pod = a.filter(() => r() < 0.3); const zle = pod.slice(); zle.push(10);
                return ['1\n5\n1\n5', '1\n5\n1\n6', '3\n1 2 3\n4\n1 2 3 3', `${fmt(a)}\n${fmt(pod)}`, `${fmt(a)}\n${fmt(zle)}`, `${fmt(arr(r, 50, 0, 2))}\n${fmt(arr(r, 20, 0, 2))}`, `${fmt(a)}\n${fmt(a)}`, `${fmt(arr(r, 1000, -1000, 1000))}\n${fmt(arr(r, 3, -1000, 1000))}`];
            },
            solve: (inp) => { const x = nums(inp); const n = x[0]; const a = x.slice(1, n + 1); const b = x.slice(n + 2); let j = 0; for (const y of a) if (j < b.length && y === b[j]) j++; return j === b.length ? 'TAK' : 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    cin >> m;
    vector<int> b(m);
    for (auto &x : b) cin >> x;
    int j = 0;
    for (int i = 0; i < n; i++) {
        if (j < m && a[i] == b[j]) j++;
    }
    cout << (j == m ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-czy-permutacja', krok: 7, level: 'latwe',
            title: 'Czy to permutacja?',
            short: 'Czy każda liczba od 1 do n występuje dokładnie raz? Jeśli nie — której najmniejszej brakuje?',
            tags: ['permutacja 1..n', 'vector liczników', 'zakres przed indeksem'],
            statement: ['Ciąg n liczb jest permutacją liczb od 1 do n, jeśli każda liczba od 1 do n występuje w nim dokładnie raz. Sprawdź, czy ciąg z wejścia jest taką permutacją. Jeśli tak, wypisz TAK. Jeśli nie, wypisz NIE oraz najmniejszą liczbę z zakresu od 1 do n, której w ciągu brakuje.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['TAK albo NIE i brakująca liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n2 4 1 3' }, { input: '4\n2 4 4 1', note: 'Czwórka jest dwa razy, a trójki brakuje.' }, { input: '3\n1 2 7', note: '7 jest spoza zakresu, więc brakuje 3.' }],
            hint: R`Zrób vector<int> ile(n + 1, 0);. Dla każdej liczby x sprawdź najpierw, czy 1 <= x && x <= n — dopiero wtedy wolno zrobić ile[x]++. Ciąg n liczb jest permutacją dokładnie wtedy, gdy żadnej liczby od 1 do n nie brakuje — więc wystarczy znaleźć pierwsze k z ile[k] == 0.`,
            tests: (r) => {
                const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                const p1 = perm(1000); const p2 = perm(1000); p2[r.int(0, 999)] = p2[r.int(0, 999)];
                const p3 = perm(500); p3[r.int(0, 499)] = r.int(501, 1e9);
                return ['1\n1', '1\n0', '2\n2 2', fmt(perm(10)), fmt(p1), fmt(p2), fmt(p3), fmt(arr(r, 1000, -1e9, 1e9))];
            },
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; const s = new Set(v); for (let k = 1; k <= n; k++) if (!s.has(k)) return `NIE ${k}`; return 'TAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> ile(n + 1, 0);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (1 <= x && x <= n) ile[x]++;
    }
    for (int k = 1; k <= n; k++) {
        if (ile[k] == 0) {
            cout << "NIE " << k << "\n";
            return 0;
        }
    }
    cout << "TAK\n";
    return 0;
}`,
        },
        {
            id: 'vec-te-same-liczby', krok: 7, level: 'latwe',
            title: 'Te same liczby?',
            short: 'Czy dwa ciągi są swoimi permutacjami? Posortuj oba i porównaj całe vectory.',
            tags: ['sort', 'a == b', 'permutacja'],
            statement: ['Masz dwa ciągi po n liczb. Sprawdź, czy jeden jest permutacją drugiego — czyli czy mają dokładnie te same liczby, każdą tyle samo razy, choć być może w innej kolejności. Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb pierwszego ciągu, w trzecim n liczb drugiego.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n3 1 2 3\n2 3 3 1' }, { input: '3\n3 1 3\n1 3 1', note: 'Pierwszy ma dwie trójki, drugi dwie jedynki.' }],
            hint: R`Posortuj oba vectory: sort(a.begin(), a.end()); i to samo z b. Po posortowaniu kolejność przestaje mieć znaczenie — wystarczy porównać if (a == b).`,
            tests: (r) => {
                const a = arr(r, 1000, -1e9, 1e9); const b = r.shuffle(a); const c = b.slice(); c[0] = c[0] === 5 ? 6 : 5;
                const d = arr(r, 1000, 0, 3); const e = r.shuffle(d); const f = e.slice(); const i = f.indexOf(0) >= 0 ? f.indexOf(0) : 0; f[i] = 1;
                return ['1\n5\n5', '1\n5\n6', '2\n1 2\n2 2', `1000\n${a.join(' ')}\n${b.join(' ')}`, `1000\n${a.join(' ')}\n${c.join(' ')}`, `1000\n${d.join(' ')}\n${e.join(' ')}`, `1000\n${d.join(' ')}\n${f.join(' ')}`];
            },
            solve: (inp) => { const x = nums(inp); const n = x[0]; const a = x.slice(1, n + 1).sort((p, q) => p - q); const b = x.slice(n + 1).sort((p, q) => p - q); return a.every((y, i) => y === b[i]) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (auto &x : a) cin >> x;
    for (auto &x : b) cin >> x;
    sort(a.begin(), a.end());
    sort(b.begin(), b.end());
    cout << (a == b ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-kto-gdzie-stoi', krok: 7, level: 'latwe',
            title: 'Kto gdzie stoi',
            short: 'Wiesz, kto stoi na każdym miejscu. Odwróć to: na którym miejscu stoi każda osoba?',
            tags: ['permutacja odwrotna', 'gdzie[p[i]] = i', 'numeracja od 1'],
            statement: ['W kolejce stoi n osób o numerach od 1 do n. Wiesz, że na miejscu i (miejsca też liczymy od 1) stoi osoba p[i]. Dla każdej osoby od 1 do n wypisz numer miejsca, na którym stoi.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb: p[1], p[2], …, p[n] — permutacja liczb od 1 do n.'],
            output_format: ['Jeden wiersz: n liczb — miejsca osób 1, 2, …, n.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '4\n3 1 4 2', note: 'Osoba 1 stoi na miejscu 2, osoba 2 na miejscu 4, osoba 3 na miejscu 1, osoba 4 na miejscu 3.' }],
            hint: R`Zrób vectory o rozmiarze n + 1, żeby numerować od 1. Skoro na miejscu i stoi osoba p[i], to gdzie[p[i]] = i;. Jedna pętla po miejscach i gotowe.`,
            tests: (r) => { const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1)); return ['1\n1', '2\n2 1', '5\n1 2 3 4 5', fmt(perm(10)), fmt(perm(1000)), fmt(Array.from({ length: 1000 }, (_, i) => 1000 - i))]; },
            solve: (inp) => { const p = nums(inp).slice(1); const g = Array(p.length + 1); p.forEach((x, i) => { g[x] = i + 1; }); return g.slice(1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> p(n + 1), gdzie(n + 1);
    for (int i = 1; i <= n; i++) cin >> p[i];
    for (int i = 1; i <= n; i++) gdzie[p[i]] = i;
    for (int x = 1; x <= n; x++) cout << gdzie[x] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-wszystkie-podzbiory', krok: 7, level: 'srednie',
            title: 'Wszystkie podzbiory',
            short: 'Wypisz wszystkie 2ⁿ podzbiorów w kolejności masek 0, 1, 2, … Cyfry dwójkowe mówią: bierzemy albo nie.',
            tags: ['maska od 0 do 2ⁿ − 1', 'm % 2 i m /= 2', 'podzbiór pusty'],
            statement: ['Wypisz wszystkie podzbiory ciągu n liczb, każdy w osobnym wierszu. Kolejność jest ustalona tak jak w lekcji: dla każdej liczby maska od 0 do 2ⁿ − 1 wypisz podzbiór, w którym element a[i] (licząc od 0) jest wtedy, gdy i-ta cyfra dwójkowa maski, licząc od prawej (od zera), jest jedynką. Elementy podzbioru wypisuj w kolejności z ciągu, oddzielone spacjami. Pusty podzbiór wypisz jako słowo PUSTY.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['2ⁿ wierszy — podzbiory dla masek 0, 1, …, 2ⁿ − 1.'],
            constraints: ['1 ≤ n ≤ 8', '−100 ≤ każda liczba ≤ 100'],
            examples: [{ input: '3\n1 8 9', note: 'Maska 5 to dwójkowo 101: bierzemy a[0] i a[2], czyli 1 9.' }],
            hint: R`Policz 2ⁿ pętlą (ile *= 2). Dla każdej maski skopiuj ją do m i w pętli po i od 0 do n - 1: jeśli m % 2 == 1, a[i] należy do podzbioru; potem m /= 2. Elementy podzbioru zbieraj w vectorze — wtedy łatwo sprawdzić, czy jest pusty.`,
            tests: (r) => ['1\n5', '2\n-1 1', fmt(arr(r, 4, -9, 9)), fmt(arr(r, 8, -100, 100)), '6\n1 1 1 1 1 1'],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; const out = []; for (let m = 0; m < 1 << n; m++) { const w = v.filter((_, i) => (m >> i) & 1); out.push(w.length ? w.join(' ') : 'PUSTY'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int ile = 1;
    for (int i = 0; i < n; i++) ile *= 2;
    for (int maska = 0; maska < ile; maska++) {
        vector<int> w;
        int m = maska;
        for (int i = 0; i < n; i++) {
            if (m % 2 == 1) w.push_back(a[i]);
            m /= 2;
        }
        if (w.empty()) cout << "PUSTY";
        for (auto x : w) cout << x << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-monety', krok: 7, level: 'srednie',
            title: 'Monety',
            short: 'Ile jest sposobów wybrania monet o sumie dokładnie S? Przejrzyj wszystkie podzbiory.',
            tags: ['wszystkie podzbiory', 'maski', 'n ≤ 20'],
            statement: ['W skarbonce leży n monet o podanych wartościach (różne monety mogą mieć tę samą wartość, ale to wciąż różne monety). Na ile sposobów można wybrać kilka monet (co najmniej jedną) tak, by ich wartości sumowały się dokładnie do S? Dwa wybory są różne, jeśli różnią się choć jedną monetą.'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n wartości monet.'],
            output_format: ['Jedna liczba — liczba sposobów.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ wartość monety ≤ 10⁶', '1 ≤ S ≤ 10⁹'],
            examples: [{ input: '4 5\n1 2 3 5', note: 'Sposoby: {5}, {2, 3}. Razem 2.' }, { input: '3 2\n1 1 1', note: 'Każde dwie z trzech jedynek: 3 sposoby.' }],
            hint: R`Podzbiorów jest 2ⁿ, dla n = 20 to około miliona — można przejrzeć wszystkie. Dla każdej maski policz sumę wybranych monet (cyfry dwójkowe przez % 2 i / 2) i sprawdź, czy równa się S. Suma 20 monet po 10⁶ mieści się w int, ale long long nie zaszkodzi.`,
            tests: (r) => ['1 5\n5', '1 5\n4', '20 10\n' + Array(20).fill(1).join(' '), `10 15\n${arr(r, 10, 1, 9).join(' ')}`, `20 ${r.int(30, 80)}\n${arr(r, 20, 1, 10).join(' ')}`, `20 3000000\n${arr(r, 20, 1, 1e6).join(' ')}`, '20 1000000000\n' + Array(20).fill(1e6).join(' ')],
            solve: (inp) => { const a = nums(inp); const [n, S] = a; const v = a.slice(2); let c = 0; for (let m = 1; m < 1 << n; m++) { let s = 0; for (let i = 0; i < n; i++) if ((m >> i) & 1) s += v[i]; if (s === S) c++; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int ile = 1;
    for (int i = 0; i < n; i++) ile *= 2;
    int sposoby = 0;
    for (int maska = 1; maska < ile; maska++) {
        long long s = 0;
        int m = maska;
        for (int i = 0; i < n; i++) {
            if (m % 2 == 1) s += a[i];
            m /= 2;
        }
        if (s == S) sposoby++;
    }
    cout << sposoby << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-podzial-druzyn', krok: 7, level: 'srednie',
            title: 'Podział na drużyny',
            short: 'Podziel zawodników na dwie niepuste drużyny tak, by różnica sił była najmniejsza.',
            tags: ['maski', 'reszta to druga drużyna', 'abs'],
            statement: ['Każdy z n zawodników ma siłę. Trzeba podzielić wszystkich zawodników na dwie drużyny, każdą z co najmniej jednym zawodnikiem. Siła drużyny to suma sił jej zawodników. Jaka jest najmniejsza możliwa różnica między siłami drużyn?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — siły zawodników.'],
            output_format: ['Jedna liczba — najmniejsza różnica sił.'],
            constraints: ['2 ≤ n ≤ 20', '1 ≤ siła ≤ 10⁶'],
            examples: [{ input: '5\n3 1 4 2 2', note: 'Siły sumują się do 12. Drużyny 3 + 1 + 2 = 6 i 4 + 2 = 6 mają równe siły — różnica 0.' }, { input: '2\n10 3' }],
            hint: R`Maska wybiera zawodników pierwszej drużyny, a reszta to druga drużyna: jej siła to suma wszystkich minus siła pierwszej. Pomiń maskę 0 (pusta pierwsza drużyna) i maskę ze wszystkimi jedynkami (pusta druga). Różnicę licz przez abs.`,
            tests: (r) => ['2\n1 1', '3\n1 1 1', '4\n1000000 1 1 1', fmt(arr(r, 10, 1, 100)), fmt(arr(r, 20, 1, 1e6)), fmt(arr(r, 20, 1, 5)), fmt(Array.from({ length: 20 }, (_, i) => 2 ** Math.min(i, 19)))],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; const tot = v.reduce((a, b) => a + b, 0); let b = Infinity; for (let m = 1; m < (1 << n) - 1; m++) { let s = 0; for (let i = 0; i < n; i++) if ((m >> i) & 1) s += v[i]; b = Math.min(b, Math.abs(tot - 2 * s)); } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    long long suma = 0;
    for (auto &x : a) {
        cin >> x;
        suma += x;
    }
    int ile = 1;
    for (int i = 0; i < n; i++) ile *= 2;
    long long best = suma;
    for (int maska = 1; maska < ile - 1; maska++) {
        long long s = 0;
        int m = maska;
        for (int i = 0; i < n; i++) {
            if (m % 2 == 1) s += a[i];
            m /= 2;
        }
        best = min(best, abs(suma - 2 * s));
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-wszystkie-ustawienia', krok: 7, level: 'srednie',
            title: 'Wszystkie ustawienia',
            short: 'Wypisz wszystkie różne permutacje ciągu w kolejności słownikowej. sort + next_permutation.',
            tags: ['next_permutation', 'najpierw sort', 'do … while'],
            statement: ['Wypisz wszystkie różne ustawienia (permutacje) n liczb z wejścia w kolejności słownikowej — każde w osobnym wierszu, z liczbami oddzielonymi spacjami. Jeśli liczby się powtarzają, każde różne ustawienie wypisz tylko raz. W ostatnim wierszu wypisz słowo razem i liczbę wypisanych ustawień.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Kolejne ustawienia, a na końcu wiersz „razem X”.'],
            constraints: ['1 ≤ n ≤ 6', '1 ≤ każda liczba ≤ 9'],
            examples: [{ input: '3\n3 1 2' }, { input: '3\n2 1 1', note: 'Powtórzone jedynki dają tylko 3 różne ustawienia.' }],
            hint: R`Najpierw sort(v.begin(), v.end()); — next_permutation przechodzi od bieżącego ustawienia do następnego, więc trzeba zacząć od najmniejszego. Potem do { wypisz v; licznik++; } while (next_permutation(v.begin(), v.end()));.`,
            tests: (r) => ['1\n5', '2\n7 7', '2\n9 1', fmt(arr(r, 4, 1, 9)), '6\n6 5 4 3 2 1', '6\n1 2 1 2 1 2', fmt(arr(r, 5, 1, 3))],
            solve: (inp) => { const v = nums(inp).slice(1).sort((a, b) => a - b); const out = []; do { out.push(v.join(' ')); } while (nastepna(v)); out.push(`razem ${out.length}`); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int ile = 0;
    do {
        for (auto x : v) cout << x << " ";
        cout << "\n";
        ile++;
    } while (next_permutation(v.begin(), v.end()));
    cout << "razem " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-nikt-na-swoim-miejscu', krok: 7, level: 'srednie',
            title: 'Nikt na swoim miejscu',
            short: 'Ile jest permutacji liczb 1..n, w których żadna liczba nie stoi na swoim miejscu? Sprawdź wszystkie.',
            tags: ['wszystkie permutacje', 'warunek p[i] ≠ i', 'n! ≤ 362 880'],
            statement: ['n osób wrzuciło swoje prezenty do worka, a potem każda wyciągnęła jeden prezent. Ustawienie prezentów to permutacja liczb od 1 do n: osoba numer i dostaje prezent p[i]. Policz, w ilu permutacjach nikt nie dostał własnego prezentu (p[i] ≠ i dla każdego i). W drugim wierszu wypisz pierwszą taką permutację w kolejności słownikowej — albo BRAK, jeśli żadnej nie ma.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Dwa wiersze: liczba takich permutacji i pierwsza z nich (albo BRAK).'],
            constraints: ['1 ≤ n ≤ 9'],
            examples: [{ input: '3', note: 'Pasują 2 3 1 oraz 3 1 2.' }, { input: '1' }],
            hint: R`Przejrzyj wszystkie permutacje vectora {1, 2, …, n} pętlą do … while z next_permutation (vector jest od razu posortowany). Dla każdej sprawdź, czy v[i] != i + 1 dla każdego i (vector numeruje od 0). Pierwszą pasującą zapamiętaj w osobnym vectorze — kopia przez =.`,
            tests: () => ['2', '4', '5', '6', '7', '8', '9'],
            solve: (inp) => { const n = nums(inp)[0]; const v = Array.from({ length: n }, (_, i) => i + 1); let c = 0, f = null; do { if (v.every((x, i) => x !== i + 1)) { c++; if (!f) f = v.slice(); } } while (nastepna(v)); return `${c}\n${f ? f.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) v[i] = i + 1;
    int ile = 0;
    vector<int> pierwsza;
    do {
        bool dobra = true;
        for (int i = 0; i < n; i++) if (v[i] == i + 1) dobra = false;
        if (dobra) {
            ile++;
            if (pierwsza.empty()) pierwsza = v;
        }
    } while (next_permutation(v.begin(), v.end()));
    cout << ile << "\n";
    if (pierwsza.empty()) cout << "BRAK";
    for (auto x : pierwsza) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · palindromy i dwa wskaźniki
        {
            id: 'vec-czy-palindrom', krok: 8, level: 'latwe',
            title: 'Czy palindrom?',
            short: 'Czy ciąg liczb czyta się tak samo od przodu i od tyłu? Porównaj lustrzane pary.',
            tags: ['a[i] i a[n - 1 - i]', 'pierwsza połowa', 'TAK / NIE'],
            statement: ['Ciąg jest palindromem, jeśli czytany od tyłu wygląda dokładnie tak samo jak od przodu. Sprawdź, czy ciąg n liczb z wejścia jest palindromem. Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 2 3 2 1' }, { input: '4\n5 1 5 1' }],
            hint: R`Element numer i ma w lustrze element numer n - 1 - i. Wystarczy sprawdzić i od 0 do n / 2 - 1. Drugi sposób: vector<int> r = a; reverse(r.begin(), r.end()); i porównanie r == a.`,
            tests: (r) => { const h1 = arr(r, 500, -1e9, 1e9); const p = h1.concat(h1.slice().reverse()); const q = p.slice(); q[700] = q[700] === 0 ? 1 : 0; const o = arr(r, 499, 0, 9); return ['1\n7', '2\n3 3', '2\n3 4', '3\n1 2 1', fmt(p), fmt(q), fmt(o.concat([5], o.slice().reverse())), fmt(arr(r, 1000, 0, 1))]; },
            solve: (inp) => (palindrom(nums(inp).slice(1)) ? 'TAK' : 'NIE'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    bool pal = true;
    for (int i = 0; i < n / 2; i++) {
        if (a[i] != a[n - 1 - i]) pal = false;
    }
    cout << (pal ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-liczby-palindromy', krok: 8, level: 'latwe',
            title: 'Liczby-palindromy',
            short: 'Które liczby czytane od tyłu się nie zmieniają? Cyfry każdej liczby zbierz w vectorze i sprawdź.',
            tags: ['cyfry w vectorze', 'palindrom', 'liczba 0'],
            check: (inp) => (nums(inp).slice(1).every((x) => x >= 0 && x <= 1e9) ? null : 'liczba > 10^9'),
            statement: ['Liczba jest palindromem, jeśli jej zapis dziesiętny czytany od tyłu jest taki sam jak od przodu — na przykład 121, 7 albo 4004. Wczytaj n liczb nieujemnych. W pierwszym wierszu wypisz, ile z nich jest palindromami, a w drugim — te liczby w kolejności z wejścia (albo BRAK).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n nieujemnych liczb całkowitych.'],
            output_format: ['Dwa wiersze: ile palindromów i one same (albo BRAK).'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n121 10 7 4004 1231 0' }],
            hint: R`Dla każdej liczby zbierz jej cyfry: while (x > 0) { c.push_back(x % 10); x /= 10; } — wcześniej skopiuj x, bo będziesz go jeszcze wypisywać. Zero ma jedną cyfrę, więc dla x = 0 włóż do vectora 0 osobno. Potem sprawdź lustrzane pary cyfr.`,
            tests: (r) => { const pal = () => { const s = String(r.int(1, 9999)); return Number(s + s.split('').reverse().join('').slice(r.int(0, 1))); }; return ['1\n0', '1\n10', '3\n1000000000 999999999 123454321', fmt(arr(r, 30, 0, 200)), fmt(Array.from({ length: 1000 }, () => (r() < 0.5 ? pal() : r.int(0, 1e9)))), fmt(arr(r, 1000, 0, 9))]; },
            solve: (inp) => { const v = toks(inp).slice(1); const w = v.filter((s) => s === s.split('').reverse().join('')); return `${w.length}\n${w.length ? w.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> pal;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        vector<int> c;
        int y = x;
        if (y == 0) c.push_back(0);
        while (y > 0) {
            c.push_back(y % 10);
            y /= 10;
        }
        bool ok = true;
        int k = c.size();
        for (int j = 0; j < k / 2; j++) if (c[j] != c[k - 1 - j]) ok = false;
        if (ok) pal.push_back(x);
    }
    cout << pal.size() << "\n";
    if (pal.empty()) cout << "BRAK";
    for (auto x : pal) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-poprawki-palindrom', krok: 8, level: 'latwe',
            title: 'Poprawki do palindromu',
            short: 'Ile elementów trzeba zmienić, by ciąg stał się palindromem? Popraw prawy element każdej złej pary.',
            tags: ['lustrzane pary', 'a[n - 1 - i] = a[i]', 'licznik zmian'],
            statement: ['Ciąg n liczb chcemy zamienić w palindrom, zmieniając jak najmniej elementów. W każdej lustrzanej parze (element numer i i element numer n − 1 − i, licząc od 0), w której liczby się różnią, zmieniamy prawy element na taki sam jak lewy. Wypisz liczbę zmian, a w drugim wierszu ciąg po zmianach.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: liczba zmian i ciąg po zmianach.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n3 1 4 1 5 3', note: 'Para (3, 3) się zgadza. Pary (1, 5) i (4, 1) — nie: dwie zmiany.' }],
            hint: R`Pętla po i od 0 do n / 2 - 1. Gdy a[i] != a[n - 1 - i], zwiększ licznik i przepisz a[n - 1 - i] = a[i];. Środkowy element przy nieparzystym n nie ma pary i zostaje bez zmian.`,
            tests: (r) => ['1\n5', '2\n1 2', '3\n1 2 3', fmt(arr(r, 11, 0, 3)), fmt(arr(r, 1000, -1e9, 1e9)), fmt(arr(r, 999, 0, 1))],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; let c = 0; for (let i = 0; i < n >> 1; i++) if (v[i] !== v[n - 1 - i]) { c++; v[n - 1 - i] = v[i]; } return `${c}\n${v.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int zmian = 0;
    for (int i = 0; i < n / 2; i++) {
        if (a[i] != a[n - 1 - i]) {
            zmian++;
            a[n - 1 - i] = a[i];
        }
    }
    cout << zmian << "\n";
    for (auto x : a) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-palindromiczne-kawalki', krok: 8, level: 'srednie',
            title: 'Palindromiczne kawałki',
            short: 'Ile podtablic ciągu jest palindromami? Rozszerzaj od każdego środka w obie strony.',
            tags: ['podtablica', 'rozszerzanie od środka', 'środek parzysty i nieparzysty'],
            statement: ['Policz, ile podtablic ciągu n liczb (kawałków złożonych z elementów stojących obok siebie) jest palindromami. Każdy pojedynczy element jest palindromem. Podtablice w różnych miejscach liczymy osobno, nawet jeśli wyglądają tak samo.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — ile podtablic jest palindromami.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 2 1 2 2', note: '5 jednoelementowych, a do tego 1 2 1, 2 1 2 i 2 2.' }],
            hint: R`Sprawdzanie każdej z około 2 milionów podtablic osobną pętlą może być za wolne, gdy wszystkie liczby są równe. Szybciej: stań w każdym środku i rozszerzaj w obie strony (l--, r++), dopóki a[l] == a[r] — każde udane rozszerzenie to jeden palindrom. Środkiem jest element (l = r = c) albo przerwa między elementami (l = c, r = c + 1).`,
            tests: (r) => ['1\n5', '2\n7 7', '3\n1 2 3', fmt(arr(r, 30, 1, 2)), '2000\n' + Array(2000).fill(4).join(' '), fmt(arr(r, 2000, 1, 2)), fmt(arr(r, 2000, 1, 1e9))],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; let c = 0; for (let s = 0; s < 2 * n - 1; s++) { let l = s >> 1, r = l + (s & 1); while (l >= 0 && r < n && v[l] === v[r]) { c++; l--; r++; } } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    long long ile = 0;
    for (int c = 0; c < n; c++) {
        int l = c, r = c;
        while (l >= 0 && r < n && a[l] == a[r]) { ile++; l--; r++; }
        l = c;
        r = c + 1;
        while (l >= 0 && r < n && a[l] == a[r]) { ile++; l--; r++; }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-najdluzszy-palindrom', krok: 8, level: 'srednie',
            title: 'Najdłuższy palindromiczny kawałek',
            short: 'Znajdź najdłuższą podtablicę, która jest palindromem — jej długość, początek i koniec.',
            tags: ['rozszerzanie od środka', 'najdłuższy', 'remis: najwcześniejszy początek'],
            statement: ['Znajdź najdłuższą podtablicę ciągu, która jest palindromem. Wypisz jej długość oraz miejsce początku i końca (miejsca liczymy od 1). Jeśli najdłuższych jest kilka, wypisz tę, która zaczyna się najwcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy liczby: długość, początek, koniec.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n5 1 2 2 1 3 3', note: 'Kawałek 1 2 2 1 (miejsca 2–5) ma długość 4.' }, { input: '3\n1 2 3', note: 'Każdy element to palindrom długości 1 — wygrywa pierwszy.' }],
            hint: R`Rozszerzaj od każdego środka, jak przy liczeniu palindromicznych kawałków. Po pętli while palindrom zajmuje miejsca od l + 1 do r - 1 (bo ostatni krok już się nie udał), więc jego długość to r - l - 1. Zapamiętuj go, gdy jest ostro dłuższy, albo równie długi, ale zaczyna się wcześniej.`,
            tests: (r) => ['1\n9', '2\n1 1', '4\n1 2 2 1', '6\n1 2 3 3 2 9', fmt(arr(r, 40, 1, 2)), fmt(arr(r, 2000, 1, 2)), '2000\n' + Array(2000).fill(3).join(' '), fmt(arr(r, 2000, 1, 1e9))],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; let bd = 0, bs = 0; for (let s = 0; s < 2 * n - 1; s++) { let l = s >> 1, r = l + (s & 1); while (l >= 0 && r < n && v[l] === v[r]) { l--; r++; } const d = r - l - 1; if (d > bd || (d === bd && l + 1 < bs)) { bd = d; bs = l + 1; } } return `${bd} ${bs + 1} ${bs + bd}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int bd = 0, bs = 0;
    for (int c = 0; c < n; c++) {
        for (int typ = 0; typ < 2; typ++) {
            int l = c, r = c + typ;
            while (l >= 0 && r < n && a[l] == a[r]) { l--; r++; }
            int d = r - l - 1;
            if (d > bd || (d == bd && l + 1 < bs)) {
                bd = d;
                bs = l + 1;
            }
        }
    }
    cout << bd << " " << bs + 1 << " " << bs + bd << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-dopisz-palindrom', krok: 8, level: 'srednie',
            title: 'Dopisz do palindromu',
            short: 'Ile najmniej liczb trzeba dopisać na końcu ciągu, żeby był palindromem? Najdłuższy sufiks-palindrom.',
            tags: ['sufiks', 'palindrom', 'push_back od lustra'],
            statement: ['Dopisując liczby na końcu ciągu, chcemy zrobić z niego palindrom. Ile najmniej liczb trzeba dopisać? W pierwszym wierszu wypisz tę liczbę, a w drugim — palindrom, który powstanie po dopisaniu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: ile liczb dopisano i powstały palindrom.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ każda liczba ≤ 100'],
            examples: [{ input: '4\n1 2 3 2', note: 'Sufiks 2 3 2 już jest palindromem — wystarczy dopisać 1.' }, { input: '3\n1 2 3', note: 'Najdłuższy sufiks-palindrom to samo 3: dopisujemy 2 i 1.' }],
            hint: R`Szukaj najdłuższego sufiksu, który jest palindromem: sprawdzaj początki I = 0, 1, 2, … i przy pierwszym udanym przerwij (break). Elementy przed nim, czyli a[I - 1], …, a[0], dopisz w tej kolejności przez push_back. Ostatni element sam jest palindromem, więc jakiś sufiks na pewno znajdziesz.`,
            tests: (r) => { const h1 = arr(r, 999, 1, 100); return ['1\n5', '2\n1 2', '2\n4 4', fmt(arr(r, 12, 1, 3)), fmt(h1.concat([7], h1.slice().reverse()).slice(0, 2000)), fmt(arr(r, 2000, 1, 100)), fmt([5].concat(Array(1999).fill(6)))]; },
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; let I = 0; while (!palindrom(v.slice(I))) I++; const w = v.concat(v.slice(0, I).reverse()); return `${I}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int start = 0;
    for (int I = 0; I < n; I++) {
        bool pal = true;
        for (int i = I, j = n - 1; i < j; i++, j--) {
            if (a[i] != a[j]) pal = false;
        }
        if (pal) {
            start = I;
            break;
        }
    }
    for (int i = start - 1; i >= 0; i--) a.push_back(a[i]);
    cout << start << "\n";
    for (auto x : a) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-przestaw-palindrom', krok: 8, level: 'srednie',
            title: 'Przestaw w palindrom',
            short: 'Czy da się ustawić liczby w palindrom? Jeśli tak — wypisz najmniejszy w kolejności słownikowej.',
            tags: ['permutacja i palindrom', 'liczniki', 'najwyżej jedna nieparzysta'],
            statement: ['Masz n liczb. Czy da się je ustawić w takiej kolejności, żeby powstał palindrom? Jeśli nie, wypisz NIE. Jeśli tak, wypisz palindrom, który jest najmniejszy w kolejności słownikowej (porównując ciągi jak słowa w słowniku).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['NIE albo n liczb tworzących najmniejszy palindrom.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda liczba ≤ 100'],
            examples: [{ input: '7\n3 1 2 1 3 1 1', note: 'Dwójka występuje raz — ona stanie w środku. Najmniejszy palindrom: 1 1 3 2 3 1 1.' }, { input: '4\n1 2 3 3', note: 'Jedynka i dwójka występują po razie — dwie wartości nieparzyście, więc się nie da.' }],
            hint: R`Policz wystąpienia: vector<int> ile(101, 0);. Jeśli więcej niż jedna wartość występuje nieparzystą liczbę razy — NIE. W przeciwnym razie lewa połowa to wartości od najmniejszej, każda ile[w] / 2 razy; środek to wartość z nieparzystym licznikiem (jeśli jest); prawa połowa to lewa odwrócona.`,
            tests: (r) => { const h1 = arr(r, 499, 1, 100); return ['1\n5', '2\n1 2', '3\n2 2 9', '5\n1 1 1 1 1', fmt(arr(r, 10, 1, 3)), fmt(r.shuffle(h1.concat(h1, [42]))), fmt(r.shuffle(h1.concat(h1))), fmt(arr(r, 1000, 1, 100))]; },
            solve: (inp) => { const v = nums(inp).slice(1); const c = Array(101).fill(0); v.forEach((x) => c[x]++); const odd = c.map((x, i) => [x, i]).filter(([x]) => x % 2); if (odd.length > 1) return 'NIE'; const L = []; for (let w = 1; w <= 100; w++) for (let k = 0; k < c[w] >> 1; k++) L.push(w); return L.concat(odd.length ? [odd[0][1]] : [], L.slice().reverse()).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> ile(101, 0);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x]++;
    }
    int nieparzyste = 0, srodek = 0;
    for (int w = 1; w <= 100; w++) {
        if (ile[w] % 2 == 1) {
            nieparzyste++;
            srodek = w;
        }
    }
    if (nieparzyste > 1) {
        cout << "NIE\n";
        return 0;
    }
    vector<int> lewa;
    for (int w = 1; w <= 100; w++)
        for (int k = 0; k < ile[w] / 2; k++) lewa.push_back(w);
    vector<int> wynik = lewa;
    if (nieparzyste == 1) wynik.push_back(srodek);
    for (int i = (int)lewa.size() - 1; i >= 0; i--) wynik.push_back(lewa[i]);
    for (auto x : wynik) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-pary-limit', krok: 8, level: 'srednie',
            title: 'Pary w limicie',
            short: 'Ile par liczb ma sumę najwyżej S? Posortuj i poprowadź dwa wskaźniki naprzeciw siebie.',
            tags: ['sort', 'dwa wskaźniki', 'j - i par naraz'],
            statement: ['Na wycieczkę jadą n osób, każda ma plecak o podanej wadze. Na rowerze można przewieźć dwa plecaki, jeśli ich łączna waga jest najwyżej S. Policz, ile jest różnych par plecaków (dwa różne plecaki, kolejność się nie liczy), które razem można przewieźć.'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n wag.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ wagi ≤ 10⁹ (tak, w tym zadaniu wagi mogą być ujemne — to tylko liczby)', '−2 · 10⁹ ≤ S ≤ 2 · 10⁹'],
            examples: [{ input: '5 7\n5 1 7 2 4', note: 'Pasują pary: 1+2, 1+4, 1+5, 2+4 i 2+5 — razem 5.' }, { input: '3 0\n1 2 3' }],
            hint: R`Posortuj wagi. Ustaw i = 0 i j = n - 1. Jeśli a[i] + a[j] <= S, to a[i] pasuje do każdego elementu od i + 1 do j — dodaj j - i i przesuń i w prawo. W przeciwnym razie a[j] jest za duże — przesuń j w lewo. Sumy i wynik trzymaj w long long.`,
            tests: (r) => ['1 5\n1', '2 2\n1 1', '2 1\n1 1', '4 0\n-1 1 -1 1', `20 10\n${arr(r, 20, 0, 10).join(' ')}`, `5000 0\n${arr(r, 5000, -1e9, 1e9).join(' ')}`, `5000 2000000000\n${arr(r, 5000, -1e9, 1e9).join(' ')}`, `5000 -2000000000\n${arr(r, 5000, -1e9, 1e9).join(' ')}`, `5000 ${r.int(-1e6, 1e6)}\n${arr(r, 5000, -1e6, 1e6).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const [n, S] = a; const v = a.slice(2).sort((x, y) => x - y); let i = 0, j = n - 1, c = 0; while (i < j) { if (v[i] + v[j] <= S) { c += j - i; i++; } else j--; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());
    int i = 0, j = n - 1;
    long long par = 0;
    while (i < j) {
        if (a[i] + a[j] <= S) {
            par += j - i;
            i++;
        } else {
            j--;
        }
    }
    cout << par << "\n";
    return 0;
}`,
        },
    ];
};
