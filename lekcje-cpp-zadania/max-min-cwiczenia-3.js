// Max / Min — ćwiczenia w trakcie lekcji, części 7–9: podium (dwie i trzy największe, druga różna, najlepsza para,
// największy iloczyn), rekordy na bieżąco (maksimum prefiksowe, rozstęp na bieżąco, pobite rekordy, widok z prawej,
// najlepszy zysk, tablice pm i sm) oraz serie i fragmenty (najdłuższa seria, rosnący fragment, okno k liczb,
// największa suma fragmentu, maksima wierszy i kolumn, najlepszy z najgorszych).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]) }; };
    const desc = (a) => a.slice().sort((x, y) => x - y).reverse();
    const bmax = (a, b) => (a > b ? a : b);
    const tabela = (r, w, k, lo, hi) => `${w} ${k}\n${Array.from({ length: w }, () => arr(r, k, lo, hi).join(' ')).join('\n')}`;

    return [
        // ================================================================ KROK 7 · podium
        {
            id: 'mm-dwie-najwieksze', krok: 7, level: 'latwe',
            title: 'Złoto i srebro',
            short: 'Dwie największe liczby z listy — w jednym przejściu, bez sortowania.',
            tags: ['m1 i m2', 'najpierw m2 = m1', 'powtórzenia się liczą'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz w jednym wierszu dwie największe liczby z listy: najpierw największą, potem drugą największą. Równe liczby liczą się osobno — jeśli największa występuje kilka razy, druga największa jest jej równa.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: dwie liczby.'],
            constraints: ['2 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n12 45 7 45 30 51 8' }, { input: '3\n9 9 5' }],
            hint: R`Złoto i srebro: if (x > m1) { m2 = m1; m1 = x; } else if (x > m2) m2 = x;. Oba zaczynają od INT_MIN. Kolejność jest ważna — najpierw stare złoto spada na srebro, dopiero potem wpisujesz x.`,
            tests: (r) => ['2\n1 2', '2\n2 1', '2\n-5 -5', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 30, -9, 9)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, -1e9, -1e9 + 3))],
            solve: (inp) => { const d = desc(czytaj(inp).v); return `${d[0]} ${d[1]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int m1 = INT_MIN, m2 = INT_MIN;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > m1) {
            m2 = m1;
            m1 = x;
        } else if (x > m2) {
            m2 = x;
        }
    }
    cout << m1 << " " << m2 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-dwie-najtansze', krok: 7, level: 'latwe',
            title: 'Dwa najtańsze prezenty',
            short: 'Musisz kupić dwa różne prezenty z listy. Ile najmniej zapłacisz?',
            tags: ['dwa minima naraz', 's1 i s2', 'INT_MAX'],
            statement: ['W sklepie jest n produktów. Chcesz kupić dwa różne produkty (dwie różne pozycje z listy) i zapłacić jak najmniej. Wypisz najmniejszą możliwą kwotę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — ceny.'],
            output_format: ['Jedna liczba — najmniejsza kwota.'],
            constraints: ['2 ≤ n ≤ 5000', '1 ≤ każda cena ≤ 10⁶'],
            examples: [{ input: '4\n7 3 9 3', note: 'Dwa produkty po 3 — razem 6.' }],
            hint: R`Schemat złota i srebra odwrotnie: znak < i start od INT_MAX. if (x < s1) { s2 = s1; s1 = x; } else if (x < s2) s2 = x;. Wynik: s1 + s2.`,
            tests: (r) => ['2\n1000000 1000000', '3\n5 1 5', '3\n1 1 1', fmt(arr(r, 20, 1, 50)), fmt(arr(r, 5000, 1, 1e6)), fmt(arr(r, 5000, 999990, 1e6))],
            solve: (inp) => { const v = czytaj(inp).v.sort((x, y) => x - y); return String(v[0] + v[1]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int s1 = INT_MAX, s2 = INT_MAX;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x < s1) {
            s2 = s1;
            s1 = x;
        } else if (x < s2) {
            s2 = x;
        }
    }
    cout << s1 + s2 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najlepsza-para', krok: 7, level: 'latwe',
            title: 'Najlepsza para',
            short: 'Dwie liczby z różnych pozycji o największej sumie.',
            tags: ['m1 + m2', 'liczby ujemne'],
            statement: ['Wczytaj n liczb całkowitych. Wybierz dwie liczby stojące na różnych pozycjach tak, żeby ich suma była jak największa. Wypisz tę sumę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa suma.'],
            constraints: ['2 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n-10 -8 1 3 5' }, { input: '3\n-5 -2 -9', note: 'Same ujemne — najlepsza para to −5 i −2.' }],
            hint: R`Największa suma to suma dwóch największych liczb: m1 + m2 ze schematu złota i srebra. Gdy największa występuje dwa razy, to dwie różne pozycje — wolno wziąć obie.`,
            tests: (r) => ['2\n-1000000000 -1000000000', '2\n1000000000 1000000000', '4\n7 7 7 7', fmt(arr(r, 20, -50, 50)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, -1e9, -1))],
            solve: (inp) => { const d = desc(czytaj(inp).v); return String(d[0] + d[1]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int m1 = INT_MIN, m2 = INT_MIN;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > m1) {
            m2 = m1;
            m1 = x;
        } else if (x > m2) {
            m2 = x;
        }
    }
    cout << m1 + m2 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-druga-rozna', krok: 7, level: 'srednie',
            title: 'Druga największa wartość',
            short: 'Największa liczba mniejsza od największej — a jeśli wszystkie są równe, BRAK.',
            tags: ['x < m1 && x > m2', 'różne wartości', 'BRAK'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz drugą największą wartość, czyli największą liczbę, która jest mniejsza od największej. Jeśli taka liczba nie istnieje (wszystkie liczby są równe), wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba albo BRAK.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n9 9 5 7', note: 'Druga dziewiątka to ta sama wartość — szukamy największej mniejszej od 9.' }, { input: '3\n4 4 4' }],
            hint: R`Srebro dostaje tylko liczba mniejsza od złota: if (x > m1) { m2 = m1; m1 = x; } else if (x < m1 && x > m2) m2 = x;. Liczby nie schodzą poniżej −10⁹, więc jeśli na końcu m2 == INT_MIN — srebra nie ma i wypisujesz BRAK.`,
            tests: (r) => ['1\n5', '2\n5 5', '2\n5 4', '2\n4 5', '5\n-1000000000 -1000000000 -1000000000 -1000000000 -999999999', fmt(arr(r, 20, 0, 3)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(Array(5000).fill(77)), fmt(arr(r, 5000, 7, 8))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.max(...v); const s = v.filter((x) => x < m); return s.length ? String(Math.max(...s)) : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int m1 = INT_MIN, m2 = INT_MIN;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > m1) {
            m2 = m1;
            m1 = x;
        } else if (x < m1 && x > m2) {
            m2 = x;
        }
    }
    if (m2 == INT_MIN) cout << "BRAK\n";
    else cout << m2 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-iloczyn-pary', krok: 7, level: 'srednie',
            title: 'Największy iloczyn pary',
            short: 'Dwie liczby o największym iloczynie — uwaga, minus razy minus daje plus!',
            tags: ['dwie największe i dwie najmniejsze', 'long long', 'max(m1 * m2, s1 * s2)'],
            statement: ['Wczytaj n liczb całkowitych (także ujemnych). Wybierz dwie liczby stojące na różnych pozycjach tak, żeby ich iloczyn był jak największy. Wypisz ten iloczyn.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największy iloczyn.'],
            constraints: ['2 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n-10 -8 1 3 5', note: '(−10) · (−8) = 80 to więcej niż 5 · 3 = 15.' }, { input: '2\n-3 4' }],
            hint: R`Kandydaci są dwaj: iloczyn dwóch największych liczb i iloczyn dwóch najmniejszych. Wynik to max z nich. Iloczyn może sięgać 10¹⁸, więc trzymaj wszystko w long long (start od LLONG_MIN i LLONG_MAX).`,
            tests: (r) => ['2\n-1000000000 -1000000000', '2\n1000000000 -1000000000', '3\n-1000000000 0 1000000000', '4\n0 0 -1 -1', '3\n-5 0 3', fmt(arr(r, 20, -20, 20)),
                fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, -1e9, -1)), fmt(arr(r, 5000, 0, 1e9))],
            solve: (inp) => { const v = czytaj(inp).v.map(BigInt).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)); const n = v.length; return String(bmax(v[0] * v[1], v[n - 1] * v[n - 2])); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long m1 = LLONG_MIN, m2 = LLONG_MIN, s1 = LLONG_MAX, s2 = LLONG_MAX;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x > m1) { m2 = m1; m1 = x; }
        else if (x > m2) m2 = x;
        if (x < s1) { s2 = s1; s1 = x; }
        else if (x < s2) s2 = x;
    }
    cout << max(m1 * m2, s1 * s2) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-podium', krok: 7, level: 'srednie',
            title: 'Podium',
            short: 'Trzy najlepsze wyniki zawodów — złoto, srebro i brąz w jednym przejściu.',
            tags: ['m1, m2, m3', 'łańcuch przesunięć', 'bez sortowania'],
            statement: ['Wczytaj wyniki n zawodników. Wypisz w jednym wierszu trzy najlepsze wyniki, od największego. Równe wyniki liczą się osobno.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wyniki.'],
            output_format: ['Jeden wiersz: trzy liczby.'],
            constraints: ['3 ≤ n ≤ 5000', '0 ≤ każdy wynik ≤ 10⁹'],
            examples: [{ input: '6\n40 75 62 90 75 18' }],
            hint: R`Gdy x bije złoto, wszyscy spadają o jedno miejsce: m3 = m2; m2 = m1; m1 = x;. Gdy bije tylko srebro: m3 = m2; m2 = x;. Gdy bije tylko brąz: m3 = x;. (Sortowanie też zadziała, ale spróbuj bez niego.)`,
            tests: (r) => ['3\n1 2 3', '3\n3 2 1', '3\n5 5 5', '5\n1 9 9 1 9', '4\n0 0 0 1', fmt(arr(r, 30, 0, 10)), fmt(arr(r, 5000, 0, 1e9)), fmt(arr(r, 5000, 0, 2))],
            solve: (inp) => desc(czytaj(inp).v).slice(0, 3).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int m1 = -1, m2 = -1, m3 = -1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > m1) { m3 = m2; m2 = m1; m1 = x; }
        else if (x > m2) { m3 = m2; m2 = x; }
        else if (x > m3) { m3 = x; }
    }
    cout << m1 << " " << m2 << " " << m3 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-bez-jednego', krok: 7, level: 'srednie',
            title: 'Najlepszy bez jednego',
            short: 'Dla każdej pozycji: jaka jest największa liczba, gdy tę jedną usuniemy?',
            tags: ['m1 i m2', 'v[i] == m1', 'bez pętli w pętli'],
            statement: ['Wczytaj n liczb całkowitych. Dla każdej pozycji i wypisz największą liczbę spośród wszystkich pozostałych — czyli bez liczby stojącej na pozycji i. Wyniki wypisz w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb.'],
            constraints: ['2 ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3\n1 7 3', note: 'Bez siódemki największa jest 3, a bez każdej innej liczby — 7.' }, { input: '4\n5 9 2 9' }],
            hint: R`Pętla w pętli zadziała, ale da się sprytniej. Znajdź złoto i srebro (z powtórzeniami). Bez liczby v[i] największa jest m1 — chyba że v[i] == m1; wtedy m2. Gdy m1 występuje dwa razy, m2 też jest równe m1, więc wszystko się zgadza.`,
            tests: (r) => ['2\n1 2', '2\n-3 -3', '3\n4 4 4', fmt(arr(r, 30, -9, 9)), fmt(arr(r, 2000, -1e6, 1e6)), fmt(arr(r, 2000, 0, 2))],
            solve: (inp) => { const v = czytaj(inp).v; const d = desc(v); return v.map((x) => (x === d[0] ? d[1] : d[0])).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int m1 = INT_MIN, m2 = INT_MIN;
    for (auto x : v) {
        if (x > m1) { m2 = m1; m1 = x; }
        else if (x > m2) m2 = x;
    }
    for (auto x : v) {
        if (x == m1) cout << m2 << " ";
        else cout << m1 << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · rekordy na bieżąco
        {
            id: 'mm-rekord-do-tej-pory', krok: 8, level: 'latwe',
            title: 'Rekord do tej pory',
            short: 'Po każdym treningu wypisz rekord — najdłuższy dotychczasowy trening.',
            tags: ['maksimum prefiksowe', 'wypisywanie w pętli'],
            statement: ['Biegacz zapisywał, ile kilometrów przebiegł na kolejnych n treningach. Po każdym treningu chce znać swój rekord — najdłuższy dotychczasowy trening. Wypisz w jednym wierszu rekord po każdym treningu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — kilometry z kolejnych treningów.'],
            output_format: ['Jeden wiersz: n liczb.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ każda liczba ≤ 100'],
            examples: [{ input: '8\n3 7 5 9 4 9 12 2' }],
            hint: R`Wypisuj rekord w środku pętli, zaraz po rekord = max(rekord, x);. Ciąg rekordów nigdy nie maleje.`,
            tests: (r) => ['1\n5', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 3000, 1, 100)), fmt(Array.from({ length: 3000 }, (_, i) => 1 + Math.floor(i / 30)))],
            solve: (inp) => { let m = 0; return czytaj(inp).v.map((x) => (m = Math.max(m, x))).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int rekord = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        rekord = max(rekord, x);
        cout << rekord << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-rozstep-na-biezaco', krok: 8, level: 'latwe',
            title: 'Rozstęp na bieżąco',
            short: 'Po każdej liczbie: różnica między największą a najmniejszą z dotychczasowych.',
            tags: ['dwa rekordy na bieżąco', 'maks − mini'],
            statement: ['Wczytaj n liczb całkowitych. Po każdej wczytanej liczbie wypisz rozstęp wszystkich liczb wczytanych do tej pory, czyli różnicę między największą a najmniejszą z nich. Wyniki wypisz w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb.'],
            constraints: ['1 ≤ n ≤ 2500', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5\n4 9 2 6 11', note: 'Po pierwszej liczbie rozstęp to 0, po 9 — 5, po 2 — 7, po 6 nadal 7, po 11 — 9.' }],
            hint: R`Dwa rekordy aktualizowane przy każdej liczbie: maks i mini (start od pierwszej liczby albo od INT_MIN i INT_MAX). Po aktualizacji wypisz maks - mini.`,
            tests: (r) => ['1\n-1000000', '2\n-1000000 1000000', '3\n5 5 5', fmt(arr(r, 30, -9, 9)), fmt(arr(r, 2500, -1e6, 1e6)), fmt(arr(r, 2500, 0, 50))],
            solve: (inp) => { let mx = -Infinity, mn = Infinity; return czytaj(inp).v.map((x) => { mx = Math.max(mx, x); mn = Math.min(mn, x); return mx - mn; }).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks = INT_MIN, mini = INT_MAX;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        maks = max(maks, x);
        mini = min(mini, x);
        cout << maks - mini << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-ile-rekordow', krok: 8, level: 'latwe',
            title: 'Ile razy pobity rekord?',
            short: 'Skoczek pobija rekord życiowy, gdy skacze dalej niż kiedykolwiek wcześniej. Ile razy to zrobił?',
            tags: ['if (x > rekord) ile++', 'wyrównanie się nie liczy'],
            statement: ['W kolejnych n konkursach skoczek uzyskał podane odległości. Rekord życiowy jest pobity, gdy skok jest dłuższy od wszystkich wcześniejszych skoków; pierwszy skok zawsze ustanawia rekord. Ile razy skoczek pobił swój rekord?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — odległości.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda odległość ≤ 250'],
            examples: [{ input: '8\n98 105 105 99 112 120 111 120', note: 'Rekordy: 98, 105, 112 i 120. Drugie 105 i drugie 120 tylko wyrównują rekord.' }],
            hint: R`Rekord startuje od 0 (odległości są dodatnie). W pętli: jeśli x > rekord — ile++. Dopiero potem rekord = max(rekord, x);.`,
            tests: (r) => ['1\n100', '3\n100 100 100', '5\n1 2 3 4 5', '5\n5 4 3 2 1', fmt(arr(r, 40, 1, 250)), fmt(arr(r, 5000, 1, 250)), fmt(Array.from({ length: 5000 }, (_, i) => Math.min(250, 1 + Math.floor(i / 20))))],
            solve: (inp) => { let m = 0, c = 0; for (const x of czytaj(inp).v) { if (x > m) c++; m = Math.max(m, x); } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int rekord = 0, ile = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > rekord) ile++;
        rekord = max(rekord, x);
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-widok-z-prawej', krok: 8, level: 'srednie',
            title: 'Widok z prawej',
            short: 'Patrzysz na rząd budynków z prawej strony. Ile z nich widzisz?',
            tags: ['pętla od końca', 'rekord od prawej', 'vector'],
            statement: ['W rzędzie stoi n budynków o podanych wysokościach. Patrzysz na nie z daleka, z prawej strony. Budynek widać, jeśli jest wyższy od wszystkich budynków stojących na prawo od niego (najbardziej prawy budynek widać zawsze). Ile budynków widać?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wysokości budynków od lewej do prawej.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda wysokość ≤ 10⁹'],
            examples: [{ input: '7\n4 9 3 7 2 5 1', note: 'Widać budynki o wysokościach 1, 5, 7 i 9.' }],
            hint: R`Wczytaj wysokości do vectora i idź pętlą od końca (od i = n − 1 do 0) z rekordem maksPrawo — najwyższym budynkiem po prawej. Budynek widać, gdy h[i] > maksPrawo.`,
            tests: (r) => ['1\n5', '4\n1 2 3 4', '4\n4 3 2 1', '4\n7 7 7 7', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 5000, 1, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => 5000 - i))],
            solve: (inp) => { const v = czytaj(inp).v; let m = 0, c = 0; for (let i = v.length - 1; i >= 0; i--) { if (v[i] > m) c++; m = Math.max(m, v[i]); } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for (auto &x : h) cin >> x;
    int maksPrawo = 0, widac = 0;
    for (int i = n - 1; i >= 0; i--) {
        if (h[i] > maksPrawo) widac++;
        maksPrawo = max(maksPrawo, h[i]);
    }
    cout << widac << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najlepszy-zysk', krok: 8, level: 'srednie',
            title: 'Najlepszy zysk',
            short: 'Kup akcję w jednym dniu, sprzedaj w późniejszym. Jaki największy zysk?',
            tags: ['najniższa cena do tej pory', 'zysk = max(zysk, cena − mini)', 'jedna pętla'],
            statement: ['Znasz ceny akcji z n kolejnych dni. Możesz kupić jedną akcję w jednym dniu i sprzedać ją w którymś późniejszym dniu — albo nie robić nic. Jaki największy zysk możesz osiągnąć? Jeśli każda transakcja przyniosłaby stratę albo zero, wypisz 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — ceny z kolejnych dni.'],
            output_format: ['Jedna liczba — największy zysk.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda cena ≤ 10⁹'],
            examples: [{ input: '6\n7 1 5 3 6 4', note: 'Kupno po 1, sprzedaż po 6.' }, { input: '5\n9 7 4 3 1' }],
            hint: R`Idź dzień po dniu i załóż, że sprzedajesz dziś. Najlepiej było kupić najtaniej wcześniej — tę cenę pamięta rekord mini. Najpierw zysk = max(zysk, cena - mini);, a dopiero potem mini = min(mini, cena);.`,
            tests: (r) => ['1\n5', '2\n1 1000000000', '2\n1000000000 1', '4\n5 5 5 5', fmt(arr(r, 30, 1, 50)), fmt(arr(r, 5000, 1, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => 1e9 - i * 1000)), fmt(arr(r, 5000, 1, 10))],
            solve: (inp) => { let mn = Infinity, z = 0; for (const x of czytaj(inp).v) { z = Math.max(z, x - mn); mn = Math.min(mn, x); } return String(z); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int mini = INT_MAX, zysk = 0;
    for (int i = 0; i < n; i++) {
        int cena;
        cin >> cena;
        zysk = max(zysk, cena - mini);
        mini = min(mini, cena);
    }
    cout << zysk << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najwieksza-roznica', krok: 8, level: 'srednie',
            title: 'Później minus wcześniej',
            short: 'Największa różnica liczba późniejsza minus wcześniejsza — nawet jeśli wyjdzie ujemna.',
            tags: ['minimum z lewej', 'start nie od zera', 'i < j'],
            statement: ['Wczytaj ciąg n liczb całkowitych a₁, a₂, …, aₙ. Znajdź największą wartość różnicy aⱼ − aᵢ, gdzie i < j — czyli liczba późniejsza minus wcześniejsza. Wynik może być ujemny — wtedy też go wypisz.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['2 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n5 3 8 1 4', note: '8 − 3 = 5.' }, { input: '3\n9 4 2', note: 'Ciąg tylko maleje. Najlepsza różnica to 2 − 4 = −2.' }],
            hint: R`To prawie najlepszy zysk, tylko bez możliwości „nic nie robię”. Trzymaj w mini najmniejszą liczbę z lewej (start od a₁) i zacznij pętlę od drugiej liczby: najpierw wynik = max(wynik, x - mini), potem mini = min(mini, x). Wynik zacznij od INT_MIN — nie od zera!`,
            tests: (r) => ['2\n1 2', '2\n2 1', '2\n-1000000000 1000000000', '2\n1000000000 -1000000000', '3\n7 7 7', fmt(arr(r, 30, -20, 20)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => 1e9 - i * 400000))],
            solve: (inp) => { const v = czytaj(inp).v; let mn = v[0], w = -Infinity; for (let i = 1; i < v.length; i++) { w = Math.max(w, v[i] - mn); mn = Math.min(mn, v[i]); } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int mini;
    cin >> mini;
    int wynik = INT_MIN;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        wynik = max(wynik, x - mini);
        mini = min(mini, x);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-widac-z-boku', krok: 8, level: 'srednie',
            title: 'Widać z lewej albo z prawej',
            short: 'Ile budynków widać z co najmniej jednej strony rzędu? Tablice pm i sm.',
            tags: ['tablice pm i sm', 'rekordy od lewej i od prawej', 'warunek z ||'],
            statement: ['W rzędzie stoi n budynków. Budynek widać z lewej strony, jeśli jest wyższy od wszystkich budynków na lewo od niego, a z prawej — jeśli jest wyższy od wszystkich budynków na prawo od niego (skrajny lewy budynek zawsze widać z lewej, a skrajny prawy — z prawej). Ile budynków widać z co najmniej jednej strony?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wysokości budynków od lewej do prawej.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda wysokość ≤ 10⁹'],
            examples: [{ input: '7\n4 9 3 7 2 5 1', note: 'Z lewej widać 4 i 9, z prawej 1, 5, 7 i 9. Razem 5 różnych budynków.' }],
            hint: R`Policz pm[i] — najwyższy budynek od 0 do i — i sm[i] — najwyższy od i do n − 1. Budynek i widać z lewej, gdy i == 0 || h[i] > pm[i - 1], a z prawej, gdy i == n - 1 || h[i] > sm[i + 1]. Licz budynki, dla których zachodzi któryś z warunków.`,
            tests: (r) => ['1\n5', '2\n3 3', '3\n1 5 1', '4\n7 7 7 7', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 5000, 1, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => 1 + Math.abs(2500 - i))), fmt(arr(r, 5000, 1, 5))],
            solve: (inp) => {
                const v = czytaj(inp).v; const n = v.length; const pm = [], sm = [];
                v.forEach((x, i) => { pm[i] = i ? Math.max(pm[i - 1], x) : x; });
                for (let i = n - 1; i >= 0; i--) sm[i] = i < n - 1 ? Math.max(sm[i + 1], v[i]) : v[i];
                let c = 0; for (let i = 0; i < n; i++) if (i === 0 || v[i] > pm[i - 1] || i === n - 1 || v[i] > sm[i + 1]) c++;
                return String(c);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for (auto &x : h) cin >> x;
    vector<int> pm(n), sm(n);
    pm[0] = h[0];
    for (int i = 1; i < n; i++) pm[i] = max(pm[i - 1], h[i]);
    sm[n - 1] = h[n - 1];
    for (int i = n - 2; i >= 0; i--) sm[i] = max(sm[i + 1], h[i]);
    int widac = 0;
    for (int i = 0; i < n; i++) {
        bool lewa = (i == 0 || h[i] > pm[i - 1]);
        bool prawa = (i == n - 1 || h[i] > sm[i + 1]);
        if (lewa || prawa) widac++;
    }
    cout << widac << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 9 · serie i fragmenty
        {
            id: 'mm-najdluzsza-seria', krok: 9, level: 'latwe',
            title: 'Najdłuższa seria',
            short: 'Najdłuższy kawałek ciągu złożony z takich samych sąsiednich liczb.',
            tags: ['obecny i najlepszy', 'rekord w każdym kroku'],
            statement: ['Wczytaj ciąg n liczb całkowitych. Seria to fragment złożony z sąsiednich, takich samych liczb. Wypisz długość najdłuższej serii.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — długość najdłuższej serii.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n7 7 2 2 2 5 2 2', note: 'Najdłuższa seria to trzy dwójki.' }],
            hint: R`Gdy liczba jest równa poprzedniej — obecny++, w przeciwnym razie obecny = 1. Rekord najlepszy = max(najlepszy, obecny) poprawiaj w każdym kroku, a nie tylko przy przerwaniu serii — inaczej zgubisz serię na samym końcu.`,
            tests: (r) => ['1\n5', '5\n1 2 3 4 5', '5\n4 4 4 4 4', '6\n1 2 2 3 3 3', fmt(arr(r, 40, 0, 2)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 1)), fmt(Array.from({ length: 5000 }, (_, i) => Math.floor(i / 1234)))],
            solve: (inp) => { const v = czytaj(inp).v; let o = 1, b = 1; for (let i = 1; i < v.length; i++) { o = v[i] === v[i - 1] ? o + 1 : 1; b = Math.max(b, o); } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int obecny = 1, najlepszy = 1;
    for (int i = 1; i < n; i++) {
        if (v[i] == v[i - 1]) obecny++;
        else obecny = 1;
        najlepszy = max(najlepszy, obecny);
    }
    cout << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-seria-wygranych', krok: 9, level: 'latwe',
            title: 'Seria wygranych',
            short: 'Napis z literami W, R i P — ile najwięcej meczów z rzędu wygrała drużyna?',
            tags: ['seria w napisie', 'obecny = 0 przy przerwaniu', 'string'],
            statement: ['Wyniki kolejnych meczów drużyny zapisano jako napis złożony z liter W (wygrana), R (remis) i P (porażka). Wypisz długość najdłuższej serii wygranych z rzędu (0, jeśli drużyna nie wygrała ani razu).'],
            input_format: ['Jeden napis złożony z liter W, R i P.'],
            output_format: ['Jedna liczba.'],
            constraints: ['Napis ma od 1 do 50 000 liter.'],
            examples: [{ input: 'WWRWWWPW' }, { input: 'PPR' }],
            hint: R`Idź po literach napisu. Przy W — obecny++, przy każdej innej literze obecny = 0. Po każdej literze najlepszy = max(najlepszy, obecny);.`,
            tests: (r) => ['W', 'P', 'WWWWW', 'RRRRW', r.word(40, 'WRP'), r.word(50000, 'WRP'), r.word(50000, 'WWWWWWWWWP'), r.word(30000, 'RP')],
            solve: (inp) => { let o = 0, b = 0; for (const c of toks(inp)[0]) { o = c === 'W' ? o + 1 : 0; b = Math.max(b, o); } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int obecny = 0, najlepszy = 0;
    for (char c : s) {
        if (c == 'W') obecny++;
        else obecny = 0;
        najlepszy = max(najlepszy, obecny);
    }
    cout << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-rosnacy-fragment', krok: 9, level: 'latwe',
            title: 'Najdłuższy rosnący fragment',
            short: 'Najdłuższy kawałek ciągu, w którym każda liczba jest większa od poprzedniej.',
            tags: ['poprzednia liczba', 'obecny i najlepszy'],
            statement: ['Wczytaj ciąg n liczb całkowitych. Wypisz długość najdłuższego fragmentu (kawałka złożonego z sąsiednich liczb), w którym każda liczba jest większa od poprzedniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '9\n3 5 8 4 6 9 12 2 7', note: 'Najdłuższy rosnący fragment to 4 6 9 12.' }],
            hint: R`Pamiętaj poprzednią liczbę. Gdy x > poprz — obecny++, w przeciwnym razie obecny = 1. Na końcu każdego kroku: najlepszy = max(najlepszy, obecny); oraz poprz = x;.`,
            tests: (r) => ['1\n5', '5\n1 2 3 4 5', '5\n5 4 3 2 1', '5\n1 1 1 1 1', '6\n1 2 2 3 4 5', fmt(arr(r, 40, 0, 9)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => i % 777))],
            solve: (inp) => { const v = czytaj(inp).v; let o = 1, b = 1; for (let i = 1; i < v.length; i++) { o = v[i] > v[i - 1] ? o + 1 : 1; b = Math.max(b, o); } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int poprz;
    cin >> poprz;
    int obecny = 1, najlepszy = 1;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        if (x > poprz) obecny++;
        else obecny = 1;
        najlepszy = max(najlepszy, obecny);
        poprz = x;
    }
    cout << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-wiersze-i-kolumny', krok: 9, level: 'latwe',
            title: 'Maksima wierszy, minima kolumn',
            short: 'Tabela liczb: największa w każdym wierszu i najmniejsza w każdej kolumnie.',
            tags: ['vector 2D', '*max_element(t[i]...)', 'rekord w kolumnie'],
            statement: ['Wczytaj tabelę liczb całkowitych o w wierszach i k kolumnach. W pierwszym wierszu wyniku wypisz największą liczbę z każdego wiersza tabeli, a w drugim — najmniejszą liczbę z każdej kolumny.'],
            input_format: ['W pierwszym wierszu liczby w i k.', 'W kolejnych w wierszach po k liczb całkowitych.'],
            output_format: ['Dwa wiersze: w liczb, a potem k liczb.'],
            constraints: ['1 ≤ w, k ≤ 100', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3 4\n3 8 1 6\n7 2 9 4\n5 5 0 8' }],
            hint: R`Wiersz t[i] to zwykły vector, więc pasuje *max_element(t[i].begin(), t[i].end()). Kolumny nie są vectorami — dla kolumny j przejdź pętlą po wierszach z rekordem min.`,
            tests: (r) => ['1 1\n-5', '1 5\n3 1 4 1 5', '5 1\n3\n1\n4\n1\n5', tabela(r, 4, 6, -9, 9), tabela(r, 100, 100, -1e6, 1e6), tabela(r, 37, 81, 0, 3)],
            solve: (inp) => {
                const a = nums(inp); const [w, k] = a; const t = []; for (let i = 0; i < w; i++) t.push(a.slice(2 + i * k, 2 + (i + 1) * k));
                const kol = []; for (let j = 0; j < k; j++) kol.push(Math.min(...t.map((row) => row[j])));
                return `${t.map((row) => Math.max(...row)).join(' ')}\n${kol.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int w, k;
    cin >> w >> k;
    vector<vector<int>> t(w, vector<int>(k));
    for (auto &wiersz : t)
        for (auto &x : wiersz) cin >> x;
    for (int i = 0; i < w; i++) cout << *max_element(t[i].begin(), t[i].end()) << " ";
    cout << "\n";
    for (int j = 0; j < k; j++) {
        int m = t[0][j];
        for (int i = 1; i < w; i++) m = min(m, t[i][j]);
        cout << m << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najlepsze-okno', krok: 9, level: 'srednie',
            title: 'Najcieplejsze k dni',
            short: 'Okno k kolejnych dni o największej sumie temperatur — i gdzie się zaczyna.',
            tags: ['okno przesuwane', 'suma += t[i] − t[i − k]', 'pierwsze najlepsze'],
            statement: ['Masz temperatury z n kolejnych dni. Znajdź k kolejnych dni o największej sumie temperatur. Wypisz tę sumę i numer dnia, od którego zaczyna się taki okres (dni numerujemy od 1). Jeśli takich okresów jest kilka, podaj najwcześniejszy.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Jeden wiersz: największa suma i numer pierwszego dnia okresu.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '7 3\n2 5 1 8 7 3 4', note: 'Dni 4, 5 i 6: 8 + 7 + 3 = 18.' }],
            hint: R`Policz sumę pierwszych k dni, a potem przesuwaj okno: suma += t[i] - t[i - k];. Okno kończące się w dniu i zaczyna się w dniu i − k + 1 (licząc od 0). Ostry znak > przy poprawianiu rekordu zostawi najwcześniejsze okno.`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n-50', '3 3\n1 2 3', '4 1\n5 9 9 1', '5 2\n0 0 0 0 0', t(20, 4, -10, 10), t(5000, 7, -50, 50), t(5000, 5000, -50, 50), t(5000, 100, -1, 1), t(4000, 1, -50, 50)];
            },
            solve: (inp) => {
                const a = nums(inp); const [n, k] = a; const t = a.slice(2, 2 + n);
                let s = 0; for (let i = 0; i < k; i++) s += t[i];
                let b = s, st = 0; for (let i = k; i < n; i++) { s += t[i] - t[i - k]; if (s > b) { b = s; st = i - k + 1; } }
                return `${b} ${st + 1}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    int suma = 0;
    for (int i = 0; i < k; i++) suma += t[i];
    int najl = suma, start = 0;
    for (int i = k; i < n; i++) {
        suma += t[i] - t[i - k];
        if (suma > najl) {
            najl = suma;
            start = i - k + 1;
        }
    }
    cout << najl << " " << start + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najwieksza-suma', krok: 9, level: 'srednie',
            title: 'Największa suma fragmentu',
            short: 'Kawałek ciągu o największej sumie — algorytm Kadane’a w jednej pętli.',
            tags: ['obecna = max(x, obecna + x)', 'long long', 'start od pierwszej liczby'],
            statement: ['Wczytaj ciąg n liczb całkowitych. Wypisz największą sumę fragmentu — kawałka złożonego z sąsiednich liczb. Fragment musi zawierać co najmniej jedną liczbę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa suma fragmentu.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n2 -5 3 1 -2 4 -6 1', note: 'Najlepszy fragment to 3, 1, −2, 4.' }, { input: '3\n-4 -2 -7', note: 'Same liczby ujemne — najlepiej wziąć samą −2.' }],
            hint: R`Dla każdej liczby x licz obecna = max(x, obecna + x) — najlepszą sumę fragmentu kończącego się na x: albo sam x, albo x doklejony do poprzedniego fragmentu. Wynik to rekord wszystkich wartości obecna. Zacznij od pierwszej liczby (nie od 0!), a sumy trzymaj w long long.`,
            tests: (r) => ['1\n-1000000000', '1\n1000000000', '3\n-1 -1 -1', '5\n1000000000 1000000000 1000000000 1000000000 1000000000', '4\n5 -10 5 -1', fmt(arr(r, 40, -9, 9)),
                fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, -1e9, 1e8)), fmt(arr(r, 5000, -1e9, -1)), fmt(arr(r, 5000, 0, 1e9))],
            solve: (inp) => {
                const v = czytaj(inp).v.map(BigInt); let o = v[0], b = v[0];
                for (let i = 1; i < v.length; i++) { const x = v[i]; o = bmax(x, o + x); b = bmax(b, o); }
                return String(b);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long obecna, najl;
    cin >> obecna;
    najl = obecna;
    for (int i = 1; i < n; i++) {
        long long x;
        cin >> x;
        obecna = max(x, obecna + x);
        najl = max(najl, obecna);
    }
    cout << najl << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najlatwiejsza-trasa', krok: 9, level: 'srednie',
            title: 'Najłatwiejsza trasa',
            short: 'Trudność trasy to jej najtrudniejszy podjazd. Która trasa jest najłatwiejsza?',
            tags: ['najlepszy z najgorszych', 'max w wierszu, min z maksimów', 'numer wiersza'],
            statement: ['Jest w tras rowerowych, a każda ma k podjazdów o podanej trudności. Trudność całej trasy to trudność jej najtrudniejszego podjazdu. Wybierz najłatwiejszą trasę: wypisz jej numer (trasy numerujemy od 1) i jej trudność. Jeśli kilka tras jest tak samo łatwych, wybierz tę o najmniejszym numerze.'],
            input_format: ['W pierwszym wierszu liczby w i k.', 'W kolejnych w wierszach po k liczb — trudności podjazdów jednej trasy.'],
            output_format: ['Jeden wiersz: numer trasy i jej trudność.'],
            constraints: ['1 ≤ w, k ≤ 100', '1 ≤ każda trudność ≤ 10⁶'],
            examples: [{ input: '3 4\n3 8 1 6\n7 2 9 4\n5 5 2 8', note: 'Trudności tras: 8, 9 i 8. Najłatwiejsze są trasy 1 i 3 — wybieramy 1.' }],
            hint: R`Dla każdego wiersza policz maksimum (np. *max_element), a spośród tych maksimów szukaj najmniejszego razem z numerem wiersza. Ostry znak < zostawi trasę o najmniejszym numerze.`,
            tests: (r) => ['1 1\n5', '2 2\n1 9\n9 1', '3 1\n4\n2\n2', tabela(r, 5, 4, 1, 9), tabela(r, 100, 100, 1, 1e6), tabela(r, 60, 3, 1, 4), tabela(r, 100, 100, 999990, 1e6)],
            solve: (inp) => {
                const a = nums(inp); const [w, k] = a; let b = Infinity, nr = 0;
                for (let i = 0; i < w; i++) { const m = Math.max(...a.slice(2 + i * k, 2 + (i + 1) * k)); if (m < b) { b = m; nr = i + 1; } }
                return `${nr} ${b}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int w, k;
    cin >> w >> k;
    int najl = INT_MAX, numer = 0;
    for (int i = 1; i <= w; i++) {
        vector<int> trasa(k);
        for (auto &x : trasa) cin >> x;
        int trudnosc = *max_element(trasa.begin(), trasa.end());
        if (trudnosc < najl) {
            najl = trudnosc;
            numer = i;
        }
    }
    cout << numer << " " << najl << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najstabilniejszy-okres', krok: 9, level: 'srednie',
            title: 'Najstabilniejszy okres',
            short: 'k kolejnych dni, w których temperatura najmniej się wahała.',
            tags: ['max_element i min_element na kawałku', 'rekord różnic', 'okno'],
            statement: ['Masz temperatury z n kolejnych dni. Wahanie okresu to różnica między najwyższą a najniższą temperaturą w tym okresie. Znajdź k kolejnych dni o najmniejszym wahaniu. Wypisz to wahanie i numer pierwszego dnia takiego okresu (dni numerujemy od 1). Jeśli takich okresów jest kilka, podaj najwcześniejszy.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Jeden wiersz: najmniejsze wahanie i numer pierwszego dnia okresu.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '7 3\n5 9 6 7 6 2 8', note: 'Wahania okien: 4, 3, 1, 5, 6. Najmniejsze ma okres od dnia 3: 6, 7, 6.' }],
            hint: R`Dla każdego okna od i do i + k − 1 policz największą i najmniejszą temperaturę — np. *max_element(t.begin() + i, t.begin() + i + k) — i zrób rekord najmniejszej różnicy. Przy n ≤ 2000 takie liczenie od nowa dla każdego okna jest wystarczająco szybkie.`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n7', '3 3\n1 5 2', '4 2\n3 3 3 3', '5 1\n4 -2 9 0 1', t(20, 4, -10, 10), t(2000, 7, -50, 50), t(2000, 2000, -50, 50), t(2000, 30, 0, 5)];
            },
            solve: (inp) => {
                const a = nums(inp); const [n, k] = a; const t = a.slice(2, 2 + n); let b = Infinity, st = 0;
                for (let i = 0; i + k <= n; i++) { const w = t.slice(i, i + k); const d = Math.max(...w) - Math.min(...w); if (d < b) { b = d; st = i; } }
                return `${b} ${st + 1}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    int najl = INT_MAX, start = 0;
    for (int i = 0; i + k <= n; i++) {
        int mx = *max_element(t.begin() + i, t.begin() + i + k);
        int mn = *min_element(t.begin() + i, t.begin() + i + k);
        if (mx - mn < najl) {
            najl = mx - mn;
            start = i;
        }
    }
    cout << najl << " " << start + 1 << "\n";
    return 0;
}`,
        },
    ];
};
