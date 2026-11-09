// Sortowanie — baza zadań na koniec lekcji: od rozgrzewki z jednym pomysłem (szereg, słownik, skarpetki, ciąg arytmetyczny,
// wolny numer, brązowy medal, najcieplejsze dni, trójkąt, liczba Kaprekara, pary butów) przez zadania średnie (dwa rankingi,
// częstość, indeks h, wyrównywanie wież, największy obwód, mediana na bieżąco, pary o różnicy k, zgrana drużyna, wieże
// z klocków, śpiewne słowa) po trudne (sklejanie liczb, kwota nie do zapłacenia, suma odległości, kary, trójki o sumie zero,
// wyrównana grupa, książki na półce) i wielki finał: ranking olimpiady.
// Zadania idą od łatwych przez średnie do trudnych.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const asc = (a) => a.slice().sort((x, y) => x - y);
    const desc = (a) => a.slice().sort((x, y) => y - x);
    const cmpS = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]) }; };
    const licz = (v) => { const m = new Map(); v.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return m; };
    const rozne = (r, k, lo, hi) => { const s = new Set(); while (s.size < k) s.add(r.int(lo, hi)); return [...s]; };
    const unikalneImiona = (r, n) => { const s = new Set(); while (s.size < n) { const w = r.word(r.int(2, 8)); s.add(w[0].toUpperCase() + w.slice(1)); } return r.shuffle([...s]); };

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'sort-b-szereg', krok: 10, level: 'latwe',
            title: 'Szereg na WF-ie',
            short: 'Ustaw dzieci od najwyższego. Ile z nich musi zmienić miejsce?',
            tags: ['sort malejąco', 'kopia vectora', 'porównanie pozycji'],
            statement: ['Dzieci stanęły w szeregu w przypadkowej kolejności. Nauczyciel chce, żeby stały od najwyższego do najniższego. W pierwszym wierszu wypisz wzrost dzieci w poprawnej kolejności. W drugim wierszu wypisz, ile dzieci musi zmienić miejsce — czyli na ilu pozycjach wzrost dziecka, które tam stoi, różni się od wzrostu, który powinien tam być.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — wzrost dzieci w kolejności w szeregu.'],
            output_format: ['W pierwszym wierszu n liczb, w drugim jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '100 ≤ wzrost ≤ 200'],
            examples: [{ input: '5\n150 170 140 160 130', note: 'Poprawnie: 170 160 150 140 130. Na swoich miejscach stoją tylko dzieci o wzroście 150 i 130.' }],
            hint: R`Zrób kopię vectora i posortuj ją malejąco. Potem porównaj oryginał z kopią pozycja po pozycji i policz różnice.`,
            tests: (r) => ['1\n150', '3\n150 150 150', '3\n130 140 150', '3\n150 140 130', fmt(arr(r, 20, 140, 160)), fmt(arr(r, 1000, 100, 200)), fmt(desc(arr(r, 1000, 100, 200)).map((x, i) => (i % 100 === 7 ? 100 : x)))],
            solve: (inp) => { const v = czytaj(inp).v; const w = desc(v); return `${w.join(' ')}\n${v.filter((x, i) => x !== w[i]).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> w = v;
    sort(w.rbegin(), w.rend());
    int zmiana = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] != w[i]) zmiana++;
    }
    for (auto x : w) cout << x << " ";
    cout << "\n" << zmiana << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-maly-slownik', krok: 10, level: 'latwe',
            title: 'Mały słownik',
            short: 'Z tekstu zrób słownik: każde słowo raz, alfabetycznie, z liczbą wystąpień.',
            tags: ['vector<string>', 'grupy napisów', 'porządek słownikowy'],
            statement: ['Wczytaj tekst złożony z n słów (tylko małe litery angielskie). Zrób z niego słownik: wypisz każde różne słowo dokładnie raz, w porządku alfabetycznym, a obok liczbę jego wystąpień w tekście.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów.'],
            output_format: ['Dla każdego różnego słowa wiersz „słowo liczba”, alfabetycznie.'],
            constraints: ['1 ≤ n ≤ 5000', 'Różnych słów jest najwyżej 1500.', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '9\nala ma kota a kot ma ale ala ma' }],
            hint: R`Posortuj słowa — takie same staną obok siebie. Potem idź grupa po grupie: i to początek grupy, j przesuwa się, dopóki s[j] == s[i]. Wypisz s[i] i j − i.`,
            check: (inp) => (new Set(toks(inp).slice(1)).size <= 1500 ? null : 'za dużo różnych słów'),
            tests: (r) => {
                const t = (n, p) => { const P = Array.from({ length: p }, () => r.word(r.int(1, 7), 'abcdeiklmnoprstuwyz')); return `${n}\n${Array.from({ length: n }, () => P[Math.floor(P.length * r() * r())]).join(' ')}`; };
                return ['1\nkot', '3\nb a b', '4\nkot kota kot ko', t(30, 10), t(5000, 1500), t(5000, 30)];
            },
            solve: (inp) => [...licz(toks(inp).slice(1))].sort((x, y) => cmpS(x[0], y[0])).map((x) => `${x[0]} ${x[1]}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end());
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && s[j] == s[i]) j++;
        cout << s[i] << " " << j - i << "\n";
        i = j;
    }
    return 0;
}`,
        },
        {
            id: 'sort-b-skarpetki', krok: 10, level: 'latwe',
            title: 'Skarpetki do pary',
            short: 'Ile par skarpetek tego samego koloru da się złożyć i ile zostanie samotnych?',
            tags: ['sort', 'grupy', 'liczba / 2 i liczba % 2'],
            statement: ['W szufladzie leży n skarpetek; kolor każdej opisuje liczba (mogą być ogromne). Parę tworzą dwie skarpetki tego samego koloru. Wypisz, ile najwięcej par da się złożyć i ile skarpetek zostanie bez pary.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — kolory skarpetek.'],
            output_format: ['Dwie liczby: liczba par i liczba skarpetek bez pary.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ kolor ≤ 10⁹'],
            examples: [{ input: '7\n5 3 5 5 3 9 5', note: 'Cztery piątki dają 2 pary, dwie trójki — 1 parę, a dziewiątka zostaje sama.' }],
            hint: R`Kolory są za duże na tablicę liczników — posortuj je. W każdej grupie jednakowych kolorów o długości c są c / 2 pary i c % 2 samotne skarpetki.`,
            tests: (r) => ['1\n7', '2\n7 7', '5\n1 2 3 4 5', fmt(arr(r, 30, 1, 6)), fmt(arr(r, 8000, 1, 1e9)), fmt(arr(r, 10000, 1, 50)), fmt(arr(r, 8000, 1, 2).map((x) => x * 1e9 / 2))],
            solve: (inp) => { let p = 0, z = 0; for (const c of licz(czytaj(inp).v).values()) { p += Math.floor(c / 2); z += c % 2; } return `${p} ${z}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int pary = 0, same = 0;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && v[j] == v[i]) j++;
        pary += (j - i) / 2;
        same += (j - i) % 2;
        i = j;
    }
    cout << pary << " " << same << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-ciag-arytmetyczny', krok: 10, level: 'latwe',
            title: 'Ciąg arytmetyczny?',
            short: 'Czy liczby da się ustawić tak, by każda następna była większa o tę samą wartość?',
            tags: ['sort', 'różnice sąsiadów', 'TAK / NIE'],
            statement: ['Ciąg jest arytmetyczny, gdy różnica między każdymi dwoma kolejnymi wyrazami jest taka sama (np. 3, 7, 11, 15 — różnica 4). Sprawdź, czy podane n liczb da się ustawić w ciąg arytmetyczny niemalejący. Jeśli tak, wypisz TAK, a w drugim wierszu jego różnicę. Jeśli nie — wypisz NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['TAK i w drugim wierszu różnica albo NIE.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n15 3 11 7' }, { input: '4\n1 2 4 8' }, { input: '1\n5', note: 'Jedna liczba to też ciąg arytmetyczny — z różnicą 0.' }],
            hint: R`Jeśli da się ustawić, to tylko rosnąco — więc posortuj. Różnica to v[1] − v[0] (dla n = 1 przyjmij 0). Sprawdź, czy wszystkie różnice sąsiadów są takie same. Różnica dwóch liczb do miliarda może przekroczyć int — użyj long long.`,
            tests: (r) => {
                const ar = (n, a, d) => r.shuffle(Array.from({ length: n }, (_, i) => a + i * d));
                const zepsuj = (a) => { const b = a.slice(); b[r.int(0, b.length - 1)] += 1; return b; };
                return ['1\n5', '2\n7 -3', '3\n4 4 4', '3\n1 2 4', fmt(ar(20, -50, 5)), fmt(ar(8000, -1e9, 250000)), fmt(zepsuj(ar(8000, 0, 7))), fmt(ar(10000, 3, 0)), fmt(ar(2, -1e9, 2e9))];
            },
            solve: (inp) => { const v = asc(czytaj(inp).v); const d = v.length > 1 ? v[1] - v[0] : 0; for (let i = 1; i < v.length; i++) if (v[i] - v[i - 1] !== d) return 'NIE'; return `TAK\n${d}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long d = 0;
    if (n > 1) d = v[1] - v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] - v[i - 1] != d) {
            cout << "NIE\n";
            return 0;
        }
    }
    cout << "TAK\n" << d << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-wolny-numer', krok: 10, level: 'latwe',
            title: 'Najmniejszy wolny numer',
            short: 'Jaka jest najmniejsza dodatnia liczba, której nie ma na liście?',
            tags: ['sort', 'szukany numer rośnie', 'powtórzenia i liczby ujemne'],
            statement: ['W systemie są zajęte numery kont — lista n liczb całkowitych (mogą się powtarzać, mogą być też ujemne lub równe zero). Nowe konto dostaje najmniejszą dodatnią liczbę całkowitą, której nie ma na liście. Wypisz ją.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — najmniejszy wolny numer.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n3 1 -2 2 7 1', note: 'Zajęte są 1, 2 i 3, więc wolny jest 4.' }, { input: '3\n5 6 7' }],
            hint: R`Posortuj i zacznij od kandydata 1. Idź po liczbach: gdy liczba jest równa kandydatowi, kandydat rośnie o 1. Mniejsze liczby (także powtórzenia) pomijasz, a większa oznacza, że kandydat jest wolny.`,
            tests: (r) => ['1\n1', '1\n-1', '1\n2', '5\n1 1 1 1 1', '5\n5 4 3 2 1', fmt(arr(r, 30, -5, 20)), fmt(r.shuffle([...Array.from({ length: 9000 }, (_, i) => i + 1).filter((x) => x !== 6543), ...arr(r, 999, -1e9, 1e9)])), fmt(r.shuffle(Array.from({ length: 10000 }, (_, i) => i + 1))), fmt(arr(r, 8000, -1e9, 1e9))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let k = 1; for (const x of v) if (x === k) k++; return String(k); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int wolny = 1;
    for (auto x : v) {
        if (x == wolny) wolny++;
    }
    cout << wolny << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-brazowy-medal', krok: 10, level: 'latwe',
            title: 'Brązowy medal',
            short: 'Medale dostają trzy najlepsze różne wyniki. Ile osób stanie na najniższym stopniu podium?',
            tags: ['sort malejąco', 'unique', 'trzecia różna wartość'],
            statement: ['W zawodach złoto dostają wszyscy z najlepszym wynikiem, srebro — wszyscy z drugim najlepszym różnym wynikiem, a brąz — wszyscy z trzecim najlepszym różnym wynikiem. Wypisz wynik brązowych medalistów i ich liczbę. Jeśli różnych wyników jest mniej niż trzy, brązu nikt nie dostaje — wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['Dwie liczby (wynik i liczba medalistów) albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ wynik ≤ 10⁹'],
            examples: [{ input: '7\n90 85 90 70 85 70 60', note: 'Złoto: 90, srebro: 85, brąz: 70 — dla dwóch osób.' }, { input: '3\n5 5 7' }],
            hint: R`Zrób kopię, posortuj ją malejąco i usuń powtórzenia (unique + erase). Jeśli zostały mniej niż 3 wartości — BRAK. W przeciwnym razie wynik brązowy to trzecia wartość; policz, ile razy występuje w danych.`,
            tests: (r) => ['1\n5', '3\n1 2 3', '3\n5 5 7', '6\n9 9 8 8 7 7', fmt(arr(r, 30, 0, 4)), fmt(arr(r, 8000, 0, 1e9)), fmt(arr(r, 10000, 0, 2)), fmt(arr(r, 10000, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; const u = desc([...new Set(v)]); if (u.length < 3) return 'BRAK'; return `${u[2]} ${v.filter((x) => x === u[2]).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> u = v;
    sort(u.rbegin(), u.rend());
    u.erase(unique(u.begin(), u.end()), u.end());
    if (u.size() < 3) {
        cout << "BRAK\n";
        return 0;
    }
    cout << u[2] << " " << count(v.begin(), v.end(), u[2]) << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-najcieplejsze-dni', krok: 10, level: 'latwe',
            title: 'Najcieplejsze dni',
            short: 'Wybierz k najcieplejszych dni i wypisz ich numery po kolei w kalendarzu.',
            tags: ['sortowanie numerów', 'dwa sortowania', 'remis po numerze'],
            statement: ['Przez n dni (ponumerowanych od 1) mierzono temperaturę. Wybierz k najcieplejszych dni; jeśli kilka dni ma tę samą temperaturę, a nie wszystkie się zmieszczą, wybierz wcześniejsze. Wypisz numery wybranych dni w kolejności rosnącej.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n temperatur.'],
            output_format: ['Jeden wiersz: k numerów dni rosnąco.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '6 3\n12 25 18 25 30 18', note: 'Najcieplejsze: dzień 5 (30) i dni 2, 4 (po 25).' }],
            hint: R`Posortuj numery dni regułą [&]: wyższa temperatura wcześniej, przy remisie mniejszy numer. Weź pierwsze k numerów do nowego vectora, posortuj go rosnąco i wypisz (pamiętaj o + 1).`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n0', '3 2\n5 5 5', '3 3\n1 2 3', '4 1\n-5 -1 -3 -1', t(20, 5, 10, 15), t(5000, 2500, -50, 50), t(5000, 100, 20, 22)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const v = a.slice(2, 2 + n); return asc(v.map((x, i) => i).sort((x, y) => (v[y] - v[x]) || (x - y)).slice(0, k)).map((i) => i + 1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (t[a] != t[b]) return t[a] > t[b];
        return a < b;
    });
    vector<int> dni(nr.begin(), nr.begin() + k);
    sort(dni.begin(), dni.end());
    for (auto d : dni) cout << d + 1 << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-patyczki', krok: 10, level: 'latwe',
            title: 'Patyczki na trójkąt',
            short: 'Czy z trzech spośród n patyczków da się złożyć trójkąt? Po sortowaniu wystarczą sąsiedzi.',
            tags: ['sort', 'trzech sąsiadów', 'a + b > c', 'long long'],
            statement: ['Masz n patyczków o podanych długościach. Trzy patyczki o długościach a ≤ b ≤ c tworzą trójkąt, gdy a + b > c. Sprawdź, czy da się wybrać trzy patyczki, z których powstanie trójkąt. Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n długości.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['3 ≤ n ≤ 10 000', '1 ≤ długość ≤ 10⁹'],
            examples: [{ input: '5\n10 2 5 1 8', note: 'Patyczki 5, 8 i 10 tworzą trójkąt, bo 5 + 8 > 10. Z patyczków 2, 8 i 10 trójkąta nie będzie, bo 2 + 8 = 10.' }, { input: '4\n1 2 4 8', note: 'Każdy patyczek jest co najmniej tak długi jak dwa krótsze razem.' }],
            hint: R`Posortuj. Wystarczy sprawdzić trójki sąsiadów v[i], v[i + 1], v[i + 2]: jeśli jakikolwiek trójkąt istnieje, to dla jego najdłuższego boku c dwa najdłuższe patyczki stojące przed c też go dadzą. Suma dwóch długości może przekroczyć int — long long.`,
            tests: (r) => {
                const fib = () => { const f = [1, 2]; while (f.length < 40) f.push(f[f.length - 1] + f[f.length - 2]); return f.filter((x) => x <= 1e9); };
                return ['3\n1 1 1', '3\n1 2 3', '3\n1000000000 1000000000 1000000000', '3\n1 1 2', fmt(r.shuffle(fib())), fmt(r.shuffle([...fib(), 3])), fmt(arr(r, 30, 1, 100)), fmt(arr(r, 8000, 1, 1e9)), fmt(r.shuffle([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]))];
            },
            solve: (inp) => { const v = asc(czytaj(inp).v); for (let i = 0; i + 2 < v.length; i++) if (v[i] + v[i + 1] > v[i + 2]) return 'TAK'; return 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    for (int i = 0; i + 2 < n; i++) {
        if (v[i] + v[i + 1] > v[i + 2]) {
            cout << "TAK\n";
            return 0;
        }
    }
    cout << "NIE\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-kaprekar', krok: 10, level: 'latwe',
            title: 'Liczba Kaprekara',
            short: 'Cyfry malejąco minus cyfry rosnąco — i tak w kółko, aż wyjdzie 6174.',
            tags: ['sortowanie cyfr', 'string i stoi', 'zera na początku', 'pętla while'],
            statement: ['Weź liczbę czterocyfrową (zapisaną zawsze czterema cyframi, więc może zaczynać się od zer), w której są co najmniej dwie różne cyfry. Krok wygląda tak: ustaw jej cyfry malejąco — to liczba duża; ustaw cyfry rosnąco — to liczba mała (może zaczynać się od zer). Nowa liczba to duża minus mała, znowu zapisana czterema cyframi. Matematyk Kaprekar odkrył, że po kilku krokach zawsze wychodzi 6174. W pierwszym wierszu wypisz liczbę z wejścia i wszystkie kolejne liczby, aż do 6174, każdą czterema cyframi. W drugim wierszu wypisz liczbę kroków.'],
            input_format: ['Liczba zapisana czterema cyframi, z co najmniej dwiema różnymi cyframi.'],
            output_format: ['W pierwszym wierszu kolejne liczby, w drugim liczba kroków.'],
            constraints: ['Wejście ma dokładnie 4 cyfry, nie wszystkie takie same.'],
            examples: [{ input: '3524', note: '5432 − 2345 = 3087, 8730 − 0378 = 8352, 8532 − 2358 = 6174.' }, { input: '2111', note: '2111 − 1112 = 0999, potem 9990 − 0999 = 8991 …' }, { input: '6174' }],
            hint: R`Trzymaj liczbę jako string s. W pętli while (s != "6174"): zrób kopie, posortuj jedną malejąco, drugą rosnąco, zamień je na liczby przez stoi i odejmij. Wynik zamień na napis (to_string) i dopisuj zera z przodu, dopóki napis ma mniej niż 4 znaki.`,
            check: (inp) => { const s = toks(inp)[0]; return /^\d{4}$/.test(s) && new Set(s).size > 1 ? null : 'zle wejscie'; },
            tests: (r) => {
                const los = () => { let s; do { s = String(r.int(0, 9999)).padStart(4, '0'); } while (new Set(s).size < 2); return s; };
                return ['6174', '1000', '0001', '9998', '2111', '1112', '5555'.replace(/5$/, '4'), '0123', los(), los(), los(), los()];
            },
            solve: (inp) => {
                let s = toks(inp)[0]; const out = [s]; let k = 0;
                while (s !== '6174') { const c = s.split('').sort(); const mala = Number(c.join('')), duza = Number(c.slice().reverse().join('')); s = String(duza - mala).padStart(4, '0'); out.push(s); k++; }
                return `${out.join(' ')}\n${k}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    cout << s;
    int kroki = 0;
    while (s != "6174") {
        string duza = s, mala = s;
        sort(duza.rbegin(), duza.rend());
        sort(mala.begin(), mala.end());
        int r = stoi(duza) - stoi(mala);
        s = to_string(r);
        while (s.size() < 4) s = "0" + s;
        cout << " " << s;
        kroki++;
    }
    cout << "\n" << kroki << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-pary-butow', krok: 10, level: 'latwe',
            title: 'Pary butów',
            short: 'Lewe i prawe buty w różnych rozmiarach. Ile pełnych par da się złożyć?',
            tags: ['dwie posortowane listy', 'dwa wskaźniki', 'jak scalanie'],
            statement: ['W magazynie leży n lewych butów i m prawych butów; znasz ich rozmiary. Para to lewy i prawy but w tym samym rozmiarze, a każdy but może trafić do najwyżej jednej pary. Ile najwięcej pełnych par da się złożyć?'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n rozmiarów lewych butów.', 'W trzecim wierszu m rozmiarów prawych butów.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n, m ≤ 10 000', '15 ≤ rozmiar ≤ 50'],
            examples: [{ input: '5 4\n40 38 40 42 44\n40 41 38 40' }],
            hint: R`Posortuj obie listy i idź dwoma wskaźnikami, jak przy scalaniu: gdy rozmiary są równe — para (oba wskaźniki dalej), w przeciwnym razie przesuń wskaźnik przy mniejszym rozmiarze.`,
            tests: (r) => {
                const t = (n, m, lo, hi) => `${n} ${m}\n${arr(r, n, lo, hi).join(' ')}\n${arr(r, m, lo, hi).join(' ')}`;
                return ['1 1\n40\n40', '1 1\n40\n41', '3 2\n40 40 40\n40 40', t(10, 10, 38, 42), t(10000, 10000, 15, 50), t(10000, 500, 15, 50), t(3000, 3000, 30, 31)];
            },
            solve: (inp) => { const a = nums(inp); const [n, m] = a; const L = licz(a.slice(2, 2 + n)); let p = 0; for (const x of a.slice(2 + n, 2 + n + m)) { if (L.get(x) > 0) { p++; L.set(x, L.get(x) - 1); } } return String(p); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<int> a(n), b(m);
    for (auto &x : a) cin >> x;
    for (auto &x : b) cin >> x;
    sort(a.begin(), a.end());
    sort(b.begin(), b.end());
    int i = 0, j = 0, pary = 0;
    while (i < n && j < m) {
        if (a[i] == b[j]) {
            pary++;
            i++;
            j++;
        } else if (a[i] < b[j]) {
            i++;
        } else {
            j++;
        }
    }
    cout << pary << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'sort-b-dwa-rankingi', krok: 10, level: 'srednie',
            title: 'Dwa rankingi',
            short: 'Ranking sportowy (1, 2, 2, 4) i ranking gęsty (1, 2, 2, 3) — dla każdego zawodnika.',
            tags: ['sortowanie numerów', 'miejsca ex aequo', 'dwa liczniki'],
            statement: ['n zawodników zdobyło punkty. W rankingu sportowym miejsce zawodnika to 1 + liczba zawodników z większą liczbą punktów (remisy dzielą miejsce, a następne miejsca są pomijane: 1, 2, 2, 4). W rankingu gęstym miejsce to 1 + liczba różnych wyników większych od wyniku zawodnika (remisy dzielą miejsce, ale nic nie jest pomijane: 1, 2, 2, 3). W pierwszym wierszu wypisz miejsca w rankingu sportowym, a w drugim — w gęstym, w obu w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['Dwa wiersze po n liczb.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ wynik ≤ 10⁶'],
            examples: [{ input: '6\n70 85 90 85 60 90' }],
            hint: R`Posortuj numery malejąco według punktów i idź po kolei z dwoma licznikami. Sportowe: gdy wynik różni się od poprzedniego, miejsce = k + 1, a przy remisie — jak u poprzednika. Gęste: gdy wynik różni się od poprzedniego, licznik gęsty rośnie o 1.`,
            tests: (r) => ['1\n5', '3\n5 5 5', '4\n1 2 3 4', '4\n90 85 85 70', fmt(arr(r, 30, 0, 6)), fmt(arr(r, 2000, 0, 1e6)), fmt(arr(r, 2000, 0, 20))],
            solve: (inp) => { const v = czytaj(inp).v; const u = desc([...new Set(v)]); const g = new Map(u.map((x, i) => [x, i + 1])); return `${v.map((x) => 1 + v.filter((y) => y > x).length).join(' ')}\n${v.map((x) => g.get(x)).join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> p(n);
    for (auto &x : p) cin >> x;
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) { return p[a] > p[b]; });
    vector<int> sport(n), gesty(n);
    int g = 0;
    for (int k = 0; k < n; k++) {
        int i = nr[k];
        if (k > 0 && p[i] == p[nr[k - 1]]) {
            sport[i] = sport[nr[k - 1]];
            gesty[i] = gesty[nr[k - 1]];
        } else {
            sport[i] = k + 1;
            g++;
            gesty[i] = g;
        }
    }
    for (auto x : sport) cout << x << " ";
    cout << "\n";
    for (auto x : gesty) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-wedlug-czestosci', krok: 10, level: 'srednie',
            title: 'Według częstości',
            short: 'Najczęstsze liczby na przód: sortuj według liczby wystąpień, a przy remisie według wartości.',
            tags: ['grupy', 'pary (liczba wystąpień, wartość)', 'reguła'],
            statement: ['Wczytaj n liczb całkowitych i wypisz je wszystkie (z powtórzeniami) w takiej kolejności: najpierw liczby występujące najczęściej, a liczby występujące tyle samo razy — od najmniejszej. Równe liczby stoją obok siebie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 4000', '−10⁴ ≤ każda liczba ≤ 10⁴'],
            examples: [{ input: '8\n4 6 2 6 4 9 6 2', note: 'Szóstka występuje 3 razy, czwórka i dwójka po 2 razy (najpierw dwójki), dziewiątka raz.' }],
            hint: R`Posortuj i zbierz grupy jako pary (liczba wystąpień, wartość). Posortuj pary regułą: if (a.first != b.first) return a.first > b.first; return a.second < b.second;. Potem każdą wartość wypisz tyle razy, ile wystąpiła.`,
            tests: (r) => ['1\n5', '4\n1 2 3 4', '4\n7 7 7 7', '6\n-1 1 -1 1 0 0', fmt(arr(r, 30, 0, 5)), fmt(arr(r, 4000, -1e4, 1e4)), fmt(arr(r, 4000, -30, 30)), fmt(Array.from({ length: 4000 }, () => Math.floor(40 * r() * r()) - 20))],
            solve: (inp) => { const v = czytaj(inp).v; return [...licz(v)].sort((x, y) => (y[1] - x[1]) || (x[0] - y[0])).flatMap(([x, c]) => Array(c).fill(x)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    vector<pair<int, int>> g;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && v[j] == v[i]) j++;
        g.push_back({j - i, v[i]});
        i = j;
    }
    sort(g.begin(), g.end(), [](auto a, auto b) {
        if (a.first != b.first) return a.first > b.first;
        return a.second < b.second;
    });
    for (auto [ile, x] : g) {
        for (int k = 0; k < ile; k++) cout << x << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-indeks-h', krok: 10, level: 'srednie',
            title: 'Indeks naukowca',
            short: 'Największe h takie, że h prac ma co najmniej po h cytowań.',
            tags: ['sort malejąco', 'v[h] >= h + 1', 'myślenie po sortowaniu'],
            statement: ['Naukowiec napisał n prac; znasz liczbę cytowań każdej z nich. Jego indeks h to największa liczba h taka, że co najmniej h jego prac ma każda co najmniej h cytowań. Oblicz indeks h.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — cytowania kolejnych prac.'],
            output_format: ['Jedna liczba — indeks h.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ cytowania ≤ 10⁶'],
            examples: [{ input: '5\n3 0 6 1 5', note: 'Trzy prace mają co najmniej 3 cytowania (3, 6, 5), ale nie ma czterech prac z co najmniej 4 cytowaniami.' }, { input: '3\n0 0 0' }],
            hint: R`Posortuj malejąco. Praca na pozycji h (od 0) jest (h + 1)-tą najczęściej cytowaną. Dopóki h < n i v[h] >= h + 1, zwiększaj h — wtedy h + 1 prac ma po co najmniej h + 1 cytowań.`,
            tests: (r) => ['1\n0', '1\n100', '3\n0 0 0', '5\n5 5 5 5 5', '5\n1 2 3 4 5', fmt(arr(r, 30, 0, 30)), fmt(arr(r, 10000, 0, 1e6)), fmt(arr(r, 10000, 0, 8000)), fmt(arr(r, 10000, 0, 20))],
            solve: (inp) => { const v = desc(czytaj(inp).v); let h = 0; while (h < v.length && v[h] >= h + 1) h++; return String(h); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.rbegin(), v.rend());
    int h = 0;
    while (h < n && v[h] >= h + 1) h++;
    cout << h << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-wyrownaj-wieze', krok: 10, level: 'srednie',
            title: 'Wyrównaj wieże',
            short: 'Ruch to dołożenie albo zdjęcie jednego klocka. Do jakiej wysokości wyrównać wieże najtaniej?',
            tags: ['mediana', 'suma |h - t|', 'long long'],
            statement: ['Stoi n wież z klocków o podanych wysokościach. W jednym ruchu możesz dołożyć jeden klocek na dowolną wieżę albo jeden klocek z niej zdjąć. Chcesz, żeby wszystkie wieże miały tę samą wysokość t, wykonując jak najmniej ruchów. Wypisz najmniejszą wysokość t, przy której liczba ruchów jest najmniejsza, i tę liczbę ruchów.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wysokości.'],
            output_format: ['Dwie liczby: wysokość t i najmniejsza liczba ruchów.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ wysokość ≤ 10⁹'],
            examples: [{ input: '5\n3 10 1 4 2', note: 'Wyrównujemy do 3: ruchy 0 + 7 + 2 + 1 + 1 = 11.' }, { input: '4\n1 2 8 9', note: 'Każda wysokość od 2 do 8 daje 14 ruchów — najmniejsza z nich to 2.' }],
            hint: R`Najlepsza wysokość to mediana: po sortowaniu v[(n − 1) / 2] (dla parzystego n to mniejsza z dwóch środkowych — każda wysokość między nimi jest tak samo dobra, a ta jest najmniejsza). Ruchy to suma |v[i] − t| — może sięgnąć 10¹³, więc long long.`,
            tests: (r) => ['1\n5', '2\n0 1000000000', '4\n1 2 8 9', '3\n7 7 7', fmt(arr(r, 30, 0, 20)), fmt(arr(r, 8000, 0, 1e9)), fmt(arr(r, 10000, 0, 100)), fmt(arr(r, 7999, 0, 1e9))],
            solve: (inp) => { const v = asc(czytaj(inp).v); const t = v[(v.length - 1) >> 1]; let s = 0; for (const x of v) s += Math.abs(x - t); return `${t} ${s}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long t = v[(n - 1) / 2];
    long long ruchy = 0;
    for (auto x : v) ruchy += (x > t ? x - t : t - x);
    cout << t << " " << ruchy << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-najwiekszy-obwod', krok: 10, level: 'srednie',
            title: 'Największy obwód',
            short: 'Ułóż z trzech patyczków trójkąt o największym obwodzie.',
            tags: ['sort malejąco', 'pierwsza dobra trójka', 'long long'],
            statement: ['Masz n patyczków. Wybierz trzy z nich tak, by tworzyły trójkąt (suma dwóch krótszych większa od najdłuższego), a obwód trójkąta (suma trzech długości) był jak największy. Wypisz ten największy obwód albo 0, jeśli żaden trójkąt nie istnieje.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n długości.'],
            output_format: ['Jedna liczba — największy obwód albo 0.'],
            constraints: ['3 ≤ n ≤ 10 000', '1 ≤ długość ≤ 10⁹'],
            examples: [{ input: '6\n2 3 8 4 20 5', note: 'Patyczek 20 nie pasuje do żadnego trójkąta — nawet 8 + 5 to za mało. Patyczki 8, 5 i 4 tworzą trójkąt (5 + 4 > 8) o obwodzie 17.' }, { input: '3\n1 2 3' }],
            hint: R`Posortuj malejąco i sprawdzaj trójki sąsiadów v[i], v[i + 1], v[i + 2]: jeśli v[i] < v[i + 1] + v[i + 2], to jest najlepszy trójkąt z najdłuższym bokiem v[i] — i pierwszy taki od góry ma największy obwód. Sumy liczb do miliarda — long long.`,
            tests: (r) => {
                const fib = () => { const f = [1, 2]; while (f.length < 40) f.push(f[f.length - 1] + f[f.length - 2]); return f.filter((x) => x <= 1e9); };
                return ['3\n1 1 1', '3\n1 2 3', '3\n1000000000 1000000000 1000000000', '4\n3 3 100 100', fmt(r.shuffle(fib())), fmt(r.shuffle([...fib(), 4])), fmt(arr(r, 30, 1, 100)), fmt(arr(r, 8000, 1, 1e9))];
            },
            solve: (inp) => { const v = desc(czytaj(inp).v); for (let i = 0; i + 2 < v.length; i++) if (v[i] < v[i + 1] + v[i + 2]) return String(v[i] + v[i + 1] + v[i + 2]); return '0'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.rbegin(), v.rend());
    for (int i = 0; i + 2 < n; i++) {
        if (v[i] < v[i + 1] + v[i + 2]) {
            cout << v[i] + v[i + 1] + v[i + 2] << "\n";
            return 0;
        }
    }
    cout << 0 << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-mediana-na-biezaco', krok: 10, level: 'srednie',
            title: 'Mediana na bieżąco',
            short: 'Liczby przychodzą po kolei. Po każdej nowej podaj medianę wszystkich dotychczasowych.',
            tags: ['vector posortowany cały czas', 'lower_bound + insert', 'mediana dolna'],
            statement: ['Liczby przychodzą jedna po drugiej. Po przyjściu każdej liczby wypisz medianę wszystkich liczb, które już przyszły. Jeśli liczb jest parzyście wiele, za medianę uznajemy mniejszą z dwóch środkowych.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb w kolejności przychodzenia.'],
            output_format: ['Jeden wiersz: n median.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5\n5 2 8 1 9', note: 'Po kolei: {5} → 5, {2, 5} → 2, {2, 5, 8} → 5, {1, 2, 5, 8} → 2, {1, 2, 5, 8, 9} → 5.' }],
            hint: R`Trzymaj vector, który przez cały czas jest posortowany. Nową liczbę x wstaw w odpowiednie miejsce: s.insert(lower_bound(s.begin(), s.end(), x), x);. Po wstawieniu k liczb mediana dolna to s[(k − 1) / 2].`,
            tests: (r) => ['1\n7', '2\n9 1', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 30, 0, 50)), fmt(arr(r, 2000, 0, 1e6)), fmt(Array.from({ length: 2000 }, (_, i) => i * 500)), fmt(arr(r, 2000, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; const s = []; const out = []; for (const x of v) { let l = 0, rr = s.length; while (l < rr) { const m = (l + rr) >> 1; if (s[m] < x) l = m + 1; else rr = m; } s.splice(l, 0, x); out.push(s[(s.length - 1) >> 1]); } return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> s;
    for (int k = 1; k <= n; k++) {
        int x;
        cin >> x;
        s.insert(lower_bound(s.begin(), s.end(), x), x);
        cout << s[(k - 1) / 2] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-roznica-k', krok: 10, level: 'srednie',
            title: 'Pary o różnicy k',
            short: 'Ile par liczb (na różnych pozycjach) różni się dokładnie o k?',
            tags: ['sort', 'upper_bound - lower_bound', 'k = 0', 'long long'],
            statement: ['Wczytaj n liczb całkowitych i liczbę k ≥ 0. Policz pary pozycji i < j, dla których liczby aᵢ i aⱼ różnią się dokładnie o k (|aᵢ − aⱼ| = k).'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ k ≤ 10⁶', '0 ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '6 2\n1 5 3 4 2 3', note: 'Pary: (1, 3) dwa razy, (5, 3) dwa razy, (4, 2) — razem 5.' }, { input: '4 0\n7 7 7 1', note: 'Trzy siódemki dają 3 pary.' }],
            hint: R`Posortuj. Dla każdego i policz liczby równe v[i] + k stojące na prawo od i: upper_bound(v.begin() + i + 1, v.end(), v[i] + k) − lower_bound(…). Patrząc tylko na prawo, każdą parę liczysz raz — także gdy k = 0.`,
            tests: (r) => {
                const t = (n, k, m) => `${n} ${k}\n${arr(r, n, 0, m).join(' ')}`;
                return ['1 0\n5', '2 0\n5 5', '2 3\n1 4', '3 1000000\n0 1000000 0', t(30, 2, 10), t(10000, 0, 1e6), t(10000, 5, 100), t(10000, 0, 3), t(10000, 1000, 1e6)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const c = licz(a.slice(2, 2 + n)); let s = 0; for (const [x, m] of c) s += k === 0 ? m * (m - 1) / 2 : m * (c.get(x + k) || 0); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long par = 0;
    for (int i = 0; i < n; i++) {
        par += upper_bound(v.begin() + i + 1, v.end(), v[i] + k) - lower_bound(v.begin() + i + 1, v.end(), v[i] + k);
    }
    cout << par << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-zgrana-druzyna', krok: 10, level: 'srednie',
            title: 'Zgrana drużyna',
            short: 'Jak liczną drużynę da się zebrać, by rankingi graczy różniły się najwyżej o d?',
            tags: ['sort', 'okno o zmiennej długości', 'dwa wskaźniki albo upper_bound'],
            statement: ['n graczy ma swoje rankingi. Trener chce zebrać jak najliczniejszą drużynę, w której ranking najlepszego i najsłabszego gracza różni się najwyżej o d. Wypisz największą możliwą liczbę graczy w takiej drużynie.'],
            input_format: ['W pierwszym wierszu liczby n i d.', 'W drugim wierszu n rankingów.'],
            output_format: ['Jedna liczba — największa liczebność drużyny.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ d ≤ 10⁹', '0 ≤ ranking ≤ 10⁹'],
            examples: [{ input: '7 10\n1500 1512 1490 1505 1530 1499 1508', note: 'Gracze 1499, 1500, 1505 i 1508 różnią się najwyżej o 9 — czterech. Pięciu się nie da.' }],
            hint: R`Po sortowaniu najlepiej brać kolejnych graczy. Dla każdego i jako najsłabszego znajdź, ilu graczy ma ranking ≤ v[i] + d: upper_bound(v.begin(), v.end(), v[i] + d) − v.begin() − i. Uwaga: v[i] + d może przekroczyć int — użyj long long.`,
            tests: (r) => {
                const t = (n, d, m) => `${n} ${d}\n${arr(r, n, 0, m).join(' ')}`;
                return ['1 0\n5', '3 0\n5 5 5', '3 0\n1 2 3', '2 1000000000\n0 1000000000', t(30, 5, 50), t(8000, 1e6, 1e9), t(10000, 0, 100), t(8000, 1000, 1e9)];
            },
            solve: (inp) => { const a = nums(inp); const [n, d] = a; const v = asc(a.slice(2, 2 + n)); let j = 0, b = 0; for (let i = 0; i < n; i++) { while (j < n && v[j] <= v[i] + d) j++; b = Math.max(b, j - i); } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long d;
    cin >> n >> d;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int najw = 0;
    for (int i = 0; i < n; i++) {
        int ile = upper_bound(v.begin(), v.end(), v[i] + d) - v.begin() - i;
        najw = max(najw, ile);
    }
    cout << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-wieze-z-klockow', krok: 10, level: 'srednie',
            title: 'Wieże z klocków',
            short: 'W wieży klocki muszą być coraz węższe. Ile najmniej wież zbudujesz ze wszystkich klocków?',
            tags: ['grupy', 'najliczniejsza grupa', 'pomysł zamiast symulacji'],
            statement: ['Masz n klocków o podanych szerokościach. Budujesz z nich wieże: w każdej wieży każdy klocek musi być ściśle węższy od klocka pod nim. Wszystkie klocki muszą zostać użyte. Ile najmniej wież trzeba zbudować?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n szerokości.'],
            output_format: ['Jedna liczba — najmniejsza liczba wież.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ szerokość ≤ 10⁹'],
            examples: [{ input: '6\n3 1 3 2 3 2', note: 'Trzy klocki o szerokości 3 muszą stać w trzech różnych wieżach, a trzy wieże wystarczą: 3-2-1, 3-2, 3.' }],
            hint: R`Dwa klocki tej samej szerokości nie mogą stać w jednej wieży, więc wież jest co najmniej tyle, ile wynosi najliczniejsza grupa równych szerokości. I tyle wystarczy: ułóż wieże „warstwami” — w każdej wieży po jednym klocku z każdej grupy, od najszerszego. Odpowiedź to długość najdłuższej grupy po sortowaniu.`,
            tests: (r) => ['1\n5', '3\n1 2 3', '3\n7 7 7', fmt(arr(r, 30, 1, 5)), fmt(arr(r, 8000, 1, 1e9)), fmt(arr(r, 10000, 1, 20)), fmt(Array.from({ length: 10000 }, () => 1 + Math.floor(50 * r() * r())))],
            solve: (inp) => String(Math.max(...licz(czytaj(inp).v).values())),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int najw = 0, i = 0;
    while (i < n) {
        int j = i;
        while (j < n && v[j] == v[i]) j++;
        najw = max(najw, j - i);
        i = j;
    }
    cout << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-spiewne-slowa', krok: 10, level: 'srednie',
            title: 'Śpiewne słowa',
            short: 'Najpierw słowa z największą liczbą samogłosek, potem krótsze, potem alfabetycznie.',
            tags: ['reguła, która liczy', 'trzy kryteria', 'samogłoski'],
            statement: ['Słowo jest tym bardziej śpiewne, im więcej ma samogłosek (a, e, i, o, u, y). Wypisz n słów od najbardziej śpiewnego. Słowa z tą samą liczbą samogłosek ustaw od najkrótszego, a słowa z tą samą liczbą samogłosek i tą samą długością — alfabetycznie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter angielskich.'],
            output_format: ['Jeden wiersz: n słów w wymaganej kolejności.'],
            constraints: ['1 ≤ n ≤ 2000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '6\nkot aula mysz oko pies ia' }],
            hint: R`W regule policz samogłoski obu słów pętlą po znakach (np. sprawdzając, czy string("aeiouy").find(c) != string::npos, albo zwykłym warunkiem z ||). Potem schodki: samogłoski malejąco, długość rosnąco, a na końcu a < b.`,
            tests: (r) => {
                const t = (n, alf) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(1, 10), alf)).join(' ')}`;
                return ['1\nx', '3\nbca abc cab', '4\nkot kat kit kut', t(30, 'abeiklmnopstuy'), t(2000, 'abcdefghijklmnopqrstuvwxyz'), t(2000, 'aeb')];
            },
            solve: (inp) => { const sg = (w) => w.split('').filter((c) => 'aeiouy'.includes(c)).length; return toks(inp).slice(1).sort((a, b) => (sg(b) - sg(a)) || (a.length - b.length) || cmpS(a, b)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end(), [](string a, string b) {
        int sa = 0, sb = 0;
        for (char c : a) if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') sa++;
        for (char c : b) if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') sb++;
        if (sa != sb) return sa > sb;
        if (a.size() != b.size()) return a.size() < b.size();
        return a < b;
    });
    for (auto x : s) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'sort-b-sklejanie', krok: 10, level: 'trudne',
            title: 'Największa liczba ze sklejenia',
            short: 'Sklej liczby w jedną, jak największą. Reguła porównuje a + b z b + a.',
            tags: ['reguła na napisach', 'a + b > b + a', 'same zera'],
            statement: ['Dostajesz n liczb naturalnych. Ustaw je w takiej kolejności, żeby po sklejeniu ich zapisów w jeden napis powstała jak największa liczba. Na przykład z liczb 3, 30, 34, 5, 9 da się skleić 9534330. Wypisz tę liczbę (bez zbędnych zer na początku — jeśli wszystkie liczby są zerami, wynikiem jest 0).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb naturalnych (bez zer na początku).'],
            output_format: ['Największa liczba, jaką da się skleić.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n3 30 34 5 9' }, { input: '3\n0 0 0' }],
            hint: R`Wczytaj liczby jako napisy. Czy a ma stać przed b? Porównaj dwa sklejenia: a + b i b + a (to napisy tej samej długości) — reguła to return a + b > b + a;. Po sortowaniu sklej wszystko, a jeśli wynik zaczyna się od '0', to wszystkie liczby były zerami — wypisz 0.`,
            tests: (r) => {
                const t = (n, hi) => fmt(Array.from({ length: n }, () => (r() < 0.3 ? r.pick([0, 1, 9, 10, 90, 99, 98, 909, 9090]) : r.int(0, hi))));
                return ['1\n0', '1\n120', '3\n0 0 0', '2\n0 1', '3\n12 121 1212', '4\n9 90 909 99', '2\n824 8247', t(20, 1000), t(1000, 1e9), t(1000, 100)];
            },
            solve: (inp) => { const s = toks(inp).slice(1).sort((a, b) => cmpS(b + a, a + b)).join(''); return s[0] === '0' ? '0' : s; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &x : s) cin >> x;
    sort(s.begin(), s.end(), [](string a, string b) {
        return a + b > b + a;
    });
    string wynik;
    for (auto x : s) wynik += x;
    if (wynik[0] == '0') wynik = "0";
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-kwota-nie-do-zaplacenia', krok: 10, level: 'trudne',
            title: 'Czego nie da się zapłacić?',
            short: 'Masz monety o różnych nominałach. Jaka najmniejsza kwota jest nie do zapłacenia bez reszty?',
            tags: ['sort rosnąco', 'zasięg 1..s', 'zachłanność z dowodem', 'long long'],
            statement: ['W portfelu leży n monet o podanych nominałach (każdą monetę można użyć najwyżej raz). Znajdź najmniejszą dodatnią kwotę, której nie da się zapłacić dokładnie, wybierając niektóre z tych monet.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n nominałów.'],
            output_format: ['Jedna liczba — najmniejsza kwota nie do zapłacenia.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ nominał ≤ 10⁹'],
            examples: [{ input: '5\n1 2 5 1 10', note: 'Monetami 1, 1, 2 i 5 zapłacisz każdą kwotę od 1 do 9. Z monetą 10 — każdą od 1 do 19. Kwoty 20 nie da się zapłacić.' }, { input: '3\n2 3 4', note: 'Kwoty 1 nie da się zapłacić.' }],
            hint: R`Posortuj rosnąco. Niech s oznacza, że każdą kwotę od 1 do s umiesz już zapłacić (na początku s = 0). Kolejna moneta c: jeśli c ≤ s + 1, to teraz umiesz zapłacić wszystko do s + c. Jeśli c > s + 1, kwoty s + 1 nie zapłacisz nigdy (dalsze monety są jeszcze większe) — to odpowiedź. Sumy przekraczają int.`,
            tests: (r) => ['1\n1', '1\n2', '4\n1 1 1 1', '5\n1 2 4 8 16', '5\n1 2 4 8 17', '3\n2 3 4', fmt(arr(r, 30, 1, 10)), fmt(arr(r, 10000, 1, 1e9)), fmt([1, ...arr(r, 9999, 1, 1000)]), fmt(Array.from({ length: 30 }, (_, i) => 2 ** i))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let s = 0; for (const c of v) { if (c > s + 1) break; s += c; } return String(s + 1); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long s = 0;
    for (auto c : v) {
        if (c > s + 1) break;
        s += c;
    }
    cout << s + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-suma-odleglosci', krok: 10, level: 'trudne',
            title: 'Suma odległości',
            short: 'Domy przy drodze: zsumuj odległości między wszystkimi parami domów — bez pętli w pętli.',
            tags: ['sort', 'sumy prefiksowe', 'wkład każdego elementu', 'long long'],
            statement: ['Przy prostej drodze stoi n domów o podanych pozycjach. Oblicz sumę odległości między wszystkimi parami domów (każdą parę liczymy raz).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n pozycji.'],
            output_format: ['Jedna liczba — suma odległości.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ pozycja ≤ 10⁸'],
            examples: [{ input: '4\n1 7 3 10', note: 'Po sortowaniu 1 3 7 10. Pary: 2 + 6 + 9 + 4 + 7 + 3 = 31.' }],
            hint: R`Po sortowaniu dom v[i] stoi na prawo od i domów przed nim, więc do sumy wnosi v[i] · i − (suma pozycji tych i domów). Trzymaj sumę dotychczasowych pozycji w zmiennej i dodawaj wkład każdego domu. Całość może sięgnąć 5·10¹⁵ — long long.`,
            tests: (r) => ['1\n5', '2\n0 100000000', '3\n7 7 7', fmt(arr(r, 30, 0, 100)), fmt(arr(r, 10000, 0, 1e8)), fmt(arr(r, 10000, 0, 10)), fmt(Array.from({ length: 10000 }, (_, i) => (i % 2 ? 1e8 : 0)))],
            solve: (inp) => { const v = asc(czytaj(inp).v); let s = 0n, p = 0n; v.forEach((x, i) => { s += BigInt(x) * BigInt(i) - p; p += BigInt(x); }); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long suma = 0, przed = 0;
    for (int i = 0; i < n; i++) {
        suma += v[i] * i - przed;
        przed += v[i];
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-kary', krok: 10, level: 'trudne',
            title: 'Kary za czekanie',
            short: 'Zlecenia mają czas wykonania i karę za każdą minutę czekania. W jakiej kolejności je zrobić?',
            tags: ['reguła z mnożeniem na krzyż', 'argument zamiany', 'long long'],
            statement: ['Warsztat dostał n zleceń naraz i wykonuje je jedno po drugim, bez przerw, zaczynając w chwili 0. Zlecenie i trwa tᵢ minut, a za każdą minutę od chwili 0 do jego ukończenia warsztat płaci karę wᵢ złotych. Jeśli zlecenie zostanie ukończone w chwili Cᵢ, kara za nie wynosi wᵢ · Cᵢ. Ustaw zlecenia tak, by suma kar była jak najmniejsza, i wypisz tę sumę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby tᵢ i wᵢ.'],
            output_format: ['Jedna liczba — najmniejsza suma kar.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ tᵢ, wᵢ ≤ 1000'],
            examples: [{ input: '3\n3 1\n1 5\n2 2', note: 'Najlepiej: zlecenie 2 (kończy się w chwili 1, kara 5), potem 3 (chwila 3, kara 6), potem 1 (chwila 6, kara 6) — razem 17.' }],
            hint: R`Weź dwa zlecenia stojące obok siebie: a, a za nim b. Zamiana ich miejscami zmienia tylko ich dwie kary — a przed b jest lepsze, gdy tₐ · w_b < t_b · wₐ. To jest reguła sortowania (mnożenie na krzyż zamiast dzielenia, więc bez ułamków). Potem policz kary, trzymając zegar. Suma sięga 10¹³ — long long.`,
            tests: (r) => {
                const t = (n, m) => `${n}\n${Array.from({ length: n }, () => `${r.int(1, m)} ${r.int(1, m)}`).join('\n')}`;
                return ['1\n5 7', '2\n1 1\n1 1', '3\n2 2\n4 4\n1 1', '3\n1 1000\n1000 1\n500 500', t(20, 10), t(5000, 1000), t(5000, 3)];
            },
            solve: (inp) => {
                const a = nums(inp); const n = a[0]; const z = [];
                for (let i = 0; i < n; i++) z.push([a[1 + 2 * i], a[2 + 2 * i]]);
                z.sort((p, q) => p[0] * q[1] - q[0] * p[1]);
                let c = 0, s = 0; for (const [t, w] of z) { c += t; s += w * c; } return String(s);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> z(n);
    for (auto &[t, w] : z) cin >> t >> w;
    sort(z.begin(), z.end(), [](auto a, auto b) {
        return a.first * b.second < b.first * a.second;
    });
    long long zegar = 0, kara = 0;
    for (auto [t, w] : z) {
        zegar += t;
        kara += w * zegar;
    }
    cout << kara << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-trojki-zero', krok: 10, level: 'trudne',
            title: 'Trójki o sumie zero',
            short: 'Ile trójek różnych liczb sumuje się do zera? Sortowanie i dwa wskaźniki.',
            tags: ['sort', 'dwa wskaźniki dla każdego i', 'n · n zamiast n · n · n'],
            statement: ['Dane są n różnych liczb całkowitych. Policz, ile jest trójek (bez względu na kolejność) różnych liczb z tego zbioru, których suma wynosi 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba trójek.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶', 'Liczby są parami różne.'],
            examples: [{ input: '6\n-1 0 1 2 -4 3', note: 'Sumę 0 dają dwie trójki: (−1, 0, 1) i (−4, 1, 3).' }],
            hint: R`Trzy pętle to 2000³ / 6 ≈ 1,3 miliarda kroków — za dużo. Posortuj i dla każdego i szukaj par na prawo od niego dwoma wskaźnikami: l = i + 1, r = n − 1. Gdy v[i] + v[l] + v[r] jest za małe, l++; za duże — r--; równe zeru — liczysz trójkę i przesuwasz oba wskaźniki (liczby są różne).`,
            check: (inp) => { const v = czytaj(inp).v; return new Set(v).size === v.length ? null : 'powtórzone liczby'; },
            tests: (r) => {
                const t = (n, m) => fmt(r.shuffle(rozne(r, n, -m, m)));
                return ['1\n0', '3\n-1 0 1', '3\n1 2 3', '4\n-2 -1 1 2', '6\n-1 0 1 2 -4 3', t(30, 20), t(2000, 1e6), t(2000, 3000), t(2000, 1000)];
            },
            solve: (inp) => { const v = asc(czytaj(inp).v); const n = v.length; let c = 0; for (let i = 0; i < n; i++) { let l = i + 1, r = n - 1; while (l < r) { const s = v[i] + v[l] + v[r]; if (s < 0) l++; else if (s > 0) r--; else { c++; l++; r--; } } } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long trojek = 0;
    for (int i = 0; i < n; i++) {
        int l = i + 1, r = n - 1;
        while (l < r) {
            int s = v[i] + v[l] + v[r];
            if (s < 0) l++;
            else if (s > 0) r--;
            else {
                trojek++;
                l++;
                r--;
            }
        }
    }
    cout << trojek << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-wyrownana-grupa', krok: 10, level: 'trudne',
            title: 'Wyrównana grupa',
            short: 'Usuń jak najmniej liczb, żeby największa była co najwyżej dwa razy większa od najmniejszej.',
            tags: ['sort', 'dwa wskaźniki', 'max ≤ 2 · min', 'long long'],
            statement: ['Masz n liczb całkowitych dodatnich. Usuń jak najmniej z nich tak, żeby wśród pozostałych największa liczba była co najwyżej dwa razy większa od najmniejszej. Wypisz najmniejszą liczbę usuniętych liczb.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba — ile najmniej liczb trzeba usunąć.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n4 5 3 8 3 7', note: 'Po usunięciu 3 i 3 zostaje 4 5 8 7 — największa 8 ≤ 2 · 4. Lepiej się nie da.' }],
            hint: R`Po sortowaniu pozostałe liczby najlepiej wybrać jako kawałek bez przerw: od v[i] (najmniejsza) do ostatniej v[j] ≤ 2 · v[i]. Gdy i rośnie, j też tylko rośnie — dwa wskaźniki. Odpowiedź to n − najdłuższy taki kawałek. 2 · v[i] nie mieści się w int — long long.`,
            tests: (r) => ['1\n5', '2\n1 3', '2\n2 4', '4\n1 1 1 1', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 8000, 1, 1e9)), fmt(arr(r, 10000, 1, 1000)), fmt(Array.from({ length: 30 }, (_, i) => 2 ** i))],
            solve: (inp) => { const v = asc(czytaj(inp).v); const n = v.length; let j = 0, b = 0; for (let i = 0; i < n; i++) { while (j < n && v[j] <= 2 * v[i]) j++; b = Math.max(b, j - i); } return String(n - b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    int j = 0, najw = 0;
    for (int i = 0; i < n; i++) {
        while (j < n && v[j] <= 2 * v[i]) j++;
        najw = max(najw, j - i);
    }
    cout << n - najw << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-ksiazki-na-polce', krok: 10, level: 'trudne',
            title: 'Książki na półce',
            short: 'Jedyny ruch: weź książkę i odłóż ją na koniec półki. Ile ruchów, by tomy stały po kolei?',
            tags: ['pozycja każdej wartości', 'najdłuższy dobry początek', 'myślenie zamiast symulacji'],
            statement: ['Na półce stoi n tomów encyklopedii o numerach od 1 do n, w pomieszanej kolejności. W jednym ruchu możesz wyjąć dowolny tom i odstawić go na sam koniec półki (z prawej). Ile najmniej ruchów potrzeba, żeby tomy stały w kolejności 1, 2, …, n?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb od 1 do n — numery tomów od lewej do prawej.'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '5\n1 4 2 5 3', note: 'Tomy 1, 2, 3 stoją już we właściwej kolejności względem siebie. Wystarczy odstawić na koniec tom 4, a potem tom 5.' }, { input: '3\n3 2 1' }],
            hint: R`Tomy, których nie ruszysz, zostaną na początku półki we właściwej kolejności — muszą to więc być tomy 1, 2, …, k stojące od lewej do prawej. Zapisz pozycję każdego tomu: poz[x]. Znajdź największe k, dla którego poz[1] < poz[2] < … < poz[k]. Pozostałe n − k tomów odstawiasz na koniec w kolejności numerów — odpowiedź to n − k.`,
            check: (inp) => { const v = czytaj(inp).v; return asc(v).every((x, i) => x === i + 1) ? null : 'to nie permutacja'; },
            tests: (r) => {
                const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                const prawie = (n, k) => { const p = Array.from({ length: n }, (_, i) => i + 1); for (let t = 0; t < k; t++) { const i = r.int(0, n - 1), j = r.int(0, n - 1); [p[i], p[j]] = [p[j], p[i]]; } return p; };
                return ['1\n1', '2\n1 2', '2\n2 1', '3\n3 2 1', '5\n2 3 4 5 1', fmt(perm(20)), fmt(perm(10000)), fmt(prawie(10000, 3)), fmt(Array.from({ length: 10000 }, (_, i) => i + 1))];
            },
            solve: (inp) => { const v = czytaj(inp).v; const n = v.length; const poz = Array(n + 1); v.forEach((x, i) => { poz[x] = i; }); let k = 1; while (k < n && poz[k + 1] > poz[k]) k++; return String(n - k); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> poz(n + 1);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        poz[x] = i;
    }
    int k = 1;
    while (k < n && poz[k + 1] > poz[k]) k++;
    cout << n - k << "\n";
    return 0;
}`,
        },
        {
            id: 'sort-b-wielki-final', krok: 10, level: 'trudne',
            title: 'Wielki finał: ranking olimpiady',
            short: 'Ułóż ranking z remisami ex aequo i odpowiadaj na pytania o miejsca, progi i liczbę osób z wynikiem.',
            tags: ['reguła z kilkoma kryteriami', 'miejsca ex aequo', 'lower_bound', 'sortowanie numerów'],
            statement: [
                'W olimpiadzie startuje n zawodników (imiona są różne), każdy rozwiązywał m zadań i za każde dostał od 0 do 100 punktów. Wynik zawodnika to suma jego punktów. Ranking układamy tak: wyżej jest zawodnik z większym wynikiem; przy równych wynikach — ten, kto ma więcej zadań za pełne 100 punktów; a przy remisie i w tym — imię wcześniejsze w alfabecie.',
                'Miejsca przyznajemy ex aequo: zawodnicy z tym samym wynikiem i tą samą liczbą zadań za 100 dzielą miejsce, a następne miejsca są pomijane. Miejsce zawodnika to 1 + liczba zawodników, którzy są od niego lepsi (mają większy wynik albo ten sam wynik i więcej zadań za 100).',
                'Najpierw wypisz cały ranking: n wierszy „miejsce. imię wynik liczba_setek”. Potem odpowiedz na q pytań, każde w osobnym wierszu. Pytania mają trzy rodzaje: MIEJSCE imię — jakie miejsce zajął ten zawodnik; PROG k — jaki wynik ma zawodnik stojący w rankingu na pozycji k (pozycje liczymy od 1, po kolei, jak w wypisanym rankingu); ILE x — ilu zawodników ma wynik co najmniej x.',
            ],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy imię i m liczb — punkty za zadania.', 'W następnym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno pytanie.'],
            output_format: ['n wierszy rankingu, a po nich q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n ≤ 500', '1 ≤ m ≤ 10', '1 ≤ q ≤ 500', '0 ≤ punkty ≤ 100', '1 ≤ k ≤ n', '0 ≤ x ≤ 1000', 'Imię ma od 2 do 9 liter; imiona są różne.'],
            examples: [{
                input: '5 3\nOla 100 50 100\nJan 100 100 50\nEwa 90 90 70\nAla 100 70 80\nIgor 100 100 100\n4\nMIEJSCE Ola\nPROG 3\nILE 250\nMIEJSCE Ewa',
                note: 'Igor ma 300 punktów — miejsce 1. Jan i Ola mają po 250 punktów i po dwie setki, więc dzielą miejsce 2 (Jan stoi wyżej przez alfabet). Ala też ma 250, ale tylko jedną setkę — miejsce 4. Ewa ma 250 bez setek — miejsce 5.',
            }],
            hint: R`Trzymaj dane w vectorach: imie, suma, setki. Posortuj numery regułą [&] z trzema kryteriami i policz miejsca ex aequo (porównując sumę i setki z poprzednikiem). Dla pytań ILE zrób posortowaną kopię sum i użyj lower_bound: zawodników z wynikiem ≥ x jest n − (lower_bound(…, x) − begin). MIEJSCE znajdziesz zwykłą pętlą po imionach.`,
            tests: (r) => {
                const t = (n, m, q, pkt) => {
                    const im = unikalneImiona(r, n);
                    const wiersze = im.map((x) => `${x} ${Array.from({ length: m }, () => r.pick(pkt)).join(' ')}`);
                    const pyt = Array.from({ length: q }, () => { const p = r(); if (p < 0.4) return `MIEJSCE ${r.pick(im)}`; if (p < 0.7) return `PROG ${r.int(1, n)}`; return `ILE ${r.int(0, 100 * m + 5)}`; });
                    return `${n} ${m}\n${wiersze.join('\n')}\n${q}\n${pyt.join('\n')}`;
                };
                return ['1 1\nOla 100\n3\nMIEJSCE Ola\nPROG 1\nILE 101', '3 2\nAla 100 0\nBea 0 100\nCel 50 50\n4\nMIEJSCE Cel\nMIEJSCE Bea\nILE 100\nILE 0', t(10, 3, 10, [0, 50, 100]), t(100, 5, 100, [0, 20, 50, 80, 100]), t(500, 10, 500, Array.from({ length: 101 }, (_, i) => i)), t(500, 4, 500, [0, 100])];
            },
            solve: (inp) => {
                const t = toks(inp); let p = 0; const n = Number(t[p++]), m = Number(t[p++]);
                const z = [];
                for (let i = 0; i < n; i++) { const imie = t[p++]; let s = 0, c = 0; for (let j = 0; j < m; j++) { const x = Number(t[p++]); s += x; if (x === 100) c++; } z.push({ imie, s, c }); }
                const nr = z.map((x, i) => i).sort((a, b) => (z[b].s - z[a].s) || (z[b].c - z[a].c) || cmpS(z[a].imie, z[b].imie));
                const miejsce = Array(n);
                nr.forEach((i, k) => { const prev = k > 0 ? z[nr[k - 1]] : null; miejsce[i] = prev && prev.s === z[i].s && prev.c === z[i].c ? miejsce[nr[k - 1]] : k + 1; });
                const out = nr.map((i) => `${miejsce[i]}. ${z[i].imie} ${z[i].s} ${z[i].c}`);
                const q = Number(t[p++]);
                for (let k = 0; k < q; k++) {
                    const typ = t[p++], arg = t[p++];
                    if (typ === 'MIEJSCE') out.push(String(miejsce[z.findIndex((x) => x.imie === arg)]));
                    else if (typ === 'PROG') out.push(String(z[nr[Number(arg) - 1]].s));
                    else out.push(String(z.filter((x) => x.s >= Number(arg)).length));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> imie(n);
    vector<int> suma(n, 0), setki(n, 0);
    for (int i = 0; i < n; i++) {
        cin >> imie[i];
        for (int j = 0; j < m; j++) {
            int x;
            cin >> x;
            suma[i] += x;
            if (x == 100) setki[i]++;
        }
    }
    vector<int> nr(n);
    for (int i = 0; i < n; i++) nr[i] = i;
    sort(nr.begin(), nr.end(), [&](int a, int b) {
        if (suma[a] != suma[b]) return suma[a] > suma[b];
        if (setki[a] != setki[b]) return setki[a] > setki[b];
        return imie[a] < imie[b];
    });
    vector<int> miejsce(n);
    for (int k = 0; k < n; k++) {
        int i = nr[k];
        if (k > 0 && suma[i] == suma[nr[k - 1]] && setki[i] == setki[nr[k - 1]]) miejsce[i] = miejsce[nr[k - 1]];
        else miejsce[i] = k + 1;
        cout << miejsce[i] << ". " << imie[i] << " " << suma[i] << " " << setki[i] << "\n";
    }
    vector<int> sumy = suma;
    sort(sumy.begin(), sumy.end());
    int q;
    cin >> q;
    while (q--) {
        string typ;
        cin >> typ;
        if (typ == "MIEJSCE") {
            string kto;
            cin >> kto;
            for (int i = 0; i < n; i++) {
                if (imie[i] == kto) cout << miejsce[i] << "\n";
            }
        } else if (typ == "PROG") {
            int k;
            cin >> k;
            cout << suma[nr[k - 1]] << "\n";
        } else {
            int x;
            cin >> x;
            cout << n - (lower_bound(sumy.begin(), sumy.end(), x) - sumy.begin()) << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
