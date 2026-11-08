// Vector — ćwiczenia w trakcie lekcji, części 1–4: pierwszy vector (tworzenie, indeksy, size, wczytywanie, vector znaków
// i napisów), vector rośnie i maleje (push_back, pop_back, back, empty, wczytywanie do końca danych, resize),
// pętla for-each z referencją & i vector jako całość (kopia, ==, <), iteratory i gotowe polecenia (erase, insert,
// sort, reverse, count, find, max_element).
// Uczeń zna pierwszy etap, tablice, napisy i pary (z sort(t, t + n)) — ale jeszcze nie funkcje.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks, fx, safe } = h;
    const R = String.raw;
    const SLOWA = ['ala', 'kot', 'pies', 'dom', 'okno', 'rower', 'szkola', 'zadanie', 'vector', 'tablica', 'program', 'lekcja', 'mama',
        'tata', 'brat', 'las', 'rzeka', 'morze', 'gora', 'slonce', 'deszcz', 'chmura', 'ksiazka', 'zeszyt', 'olowek', 'kreda', 'tablet',
        'komputer', 'mysz', 'klawiatura', 'ekran', 'kubek', 'herbata', 'kawa', 'ser', 'chleb', 'jablko', 'gruszka', 'sliwka', 'wisnia'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const lista = (a) => (a.length ? a.join(' ') : 'PUSTO');
    const wiersze = (s) => s.replace(/\r/g, '').split('\n');

    return [
        // ================================================================ KROK 1 · pierwszy vector
        {
            id: 'vec-od-konca', krok: 1, level: 'latwe',
            title: 'Od końca',
            short: 'Wczytaj n liczb do vectora i wypisz je w odwrotnej kolejności.',
            tags: ['vector<int> v(n)', 'cin >> v[i]', 'pętla od końca'],
            statement: ['Wczytaj n liczb całkowitych do vectora. Wypisz je w odwrotnej kolejności — od ostatniej do pierwszej — w jednym wierszu, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: te same liczby od ostatniej do pierwszej.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n3 8 -1 5' }, { input: '1\n42', note: 'Jedna liczba — od końca wygląda tak samo.' }],
            hint: R`Najpierw wczytaj n, dopiero potem utwórz vector<int> v(n); — ma wtedy dokładnie n pudełek. Wczytaj liczby pętlą cin >> v[i];, a potem drugą pętlą idź od i = n - 1 w dół do 0 i wypisuj v[i] ze spacją.`,
            tests: (r) => ['2\n1 2', '3\n0 0 0', '5\n-1000000000 5 0 7 1000000000', fmt(arr(r, 10, -50, 50)), fmt(arr(r, 300, -1e6, 1e6)), fmt(arr(r, 1000, -1e9, 1e9))],
            solve: (inp) => nums(inp).slice(1).reverse().join(' '),
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    for (int i = n - 1; i >= 0; i--) cout << v[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-pierwszy-srodkowy-ostatni', krok: 1, level: 'latwe',
            title: 'Pierwszy, środkowy, ostatni',
            short: 'Vector ma nieparzystą liczbę elementów. Wypisz pierwszy, środkowy i ostatni z nich.',
            tags: ['v[0]', 'v[v.size() / 2]', 'v[v.size() - 1]'],
            statement: ['Wczytaj nieparzystą liczbę n, a potem n liczb całkowitych do vectora v. Wypisz w jednym wierszu trzy liczby oddzielone spacjami: pierwszy element vectora, element środkowy (ten, który ma tyle samo elementów przed sobą co za sobą) i ostatni element.'],
            input_format: ['W pierwszym wierszu nieparzysta liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy liczby: pierwsza, środkowa i ostatnia.'],
            constraints: ['1 ≤ n ≤ 999, n jest nieparzyste', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 2 5 3 -5', note: 'Środkowy element ma numer 5 / 2 = 2 — to liczba 5.' }, { input: '1\n7', note: 'Przy jednym elemencie wszystkie trzy to ta sama liczba.' }],
            hint: R`Pierwszy element to v[0], ostatni to v[v.size() - 1] (albo v[n - 1]). Środkowy ma numer v.size() / 2 — przy n = 5 to 2, a przed nim i za nim stoją po dwa elementy.`,
            check: (inp) => { const [n] = nums(inp); return n % 2 === 1 ? null : 'n parzyste'; },
            tests: (r) => ['3\n9 8 7', '3\n-1 0 1', fmt(arr(r, 7, -9, 9)), fmt(arr(r, 99, -1e9, 1e9)), fmt(arr(r, 999, -1e9, 1e9)), fmt(arr(r, 501, 0, 100))],
            solve: (inp) => { const v = nums(inp).slice(1); return `${v[0]} ${v[(v.length - 1) / 2]} ${v[v.length - 1]}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    cout << v[0] << " " << v[v.size() / 2] << " " << v[v.size() - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-pytania-o-miejsca', krok: 1, level: 'latwe',
            title: 'Pytania o miejsca',
            short: 'W kolejce stoi n osób z numerkami. Odpowiedz na pytania: jaki numerek ma osoba na miejscu p?',
            tags: ['indeks od 1 → od 0', 'v[p - 1]', 'zapytania'],
            statement: ['W kolejce stoi n osób, każda trzyma kartkę z liczbą. Miejsca w kolejce liczymy od 1 (tak, jak liczą ludzie). Potem padają pytania: „jaką liczbę trzyma osoba na miejscu p?”. Odpowiedz na każde pytanie w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — kartki osób od miejsca 1 do miejsca n.', 'W trzecim wierszu liczba pytań q.', 'W każdym z kolejnych q wierszy jedna liczba p.'],
            output_format: ['q wierszy — odpowiedzi na kolejne pytania.'],
            constraints: ['1 ≤ n, q ≤ 1000', '1 ≤ p ≤ n', '−10⁹ ≤ liczby na kartkach ≤ 10⁹'],
            examples: [{ input: '4\n10 20 30 40\n3\n1\n4\n2', note: 'Miejsce 1 to pudełko v[0], miejsce 4 to v[3].' }],
            hint: R`Vector numeruje pudełka od 0, a zadanie liczy miejsca od 1. Miejsce p to więc pudełko v[p - 1]. Wczytaj kartki do vector<int> v(n);, a potem w pętli po pytaniach wczytuj p i wypisuj v[p - 1].`,
            check: (inp) => { const a = nums(inp); const n = a[0]; const q = a[n + 1]; return a.slice(n + 2, n + 2 + q).every((p) => p >= 1 && p <= n) ? null : 'p poza zakresem'; },
            tests: (r) => {
                const t = (n, q, lo, hi) => { const v = arr(r, n, lo, hi); return `${fmt(v)}\n${q}\n${Array.from({ length: q }, () => r.int(1, n)).join('\n')}`; };
                return ['1\n5\n2\n1\n1', '3\n-1 -2 -3\n3\n3\n2\n1', t(10, 10, -100, 100), t(100, 50, -1e9, 1e9), t(1000, 1000, -1e9, 1e9), t(1000, 5, 0, 9)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = a.slice(1, n + 1); const q = a[n + 1]; return a.slice(n + 2, n + 2 + q).map((p) => v[p - 1]).join('\n'); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int p;
        cin >> p;
        cout << v[p - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-poprawki', krok: 1, level: 'latwe',
            title: 'Poprawki w liście',
            short: 'Lista liczb dostaje kolejne poprawki „na miejscu p wpisz x”. Wypisz listę po wszystkich poprawkach.',
            tags: ['v[p - 1] = x', 'zmiana elementu', 'wypisywanie pętlą'],
            statement: ['Nauczyciel wpisał do dziennika n ocen punktowych. Potem zauważył pomyłki i wprowadził q poprawek. Każda poprawka ma postać „p x” i znaczy: ocenę na miejscu p (miejsca liczymy od 1) zamień na x. Poprawki wykonuje się po kolei — to samo miejsce może być poprawiane kilka razy. Wypisz wszystkie oceny po poprawkach.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.', 'W trzecim wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby p i x.'],
            output_format: ['Jeden wiersz: n liczb po wszystkich poprawkach.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ q ≤ 1000', '1 ≤ p ≤ n', '0 ≤ oceny, x ≤ 100'],
            examples: [{ input: '5\n50 60 70 80 90\n3\n2 65\n5 100\n2 66', note: 'Miejsce 2 poprawiono dwa razy — zostaje ostatnia poprawka, 66.' }],
            hint: R`Miejsce p to pudełko v[p - 1]. Każdą poprawkę wykonaj od razu po wczytaniu: v[p - 1] = x;. Na koniec wypisz cały vector pętlą.`,
            tests: (r) => {
                const t = (n, q) => { const v = arr(r, n, 0, 100); const ops = Array.from({ length: q }, () => `${r.int(1, n)} ${r.int(0, 100)}`); return `${fmt(v)}\n${q}${q ? '\n' + ops.join('\n') : ''}`; };
                return ['1\n0\n1\n1 100', '3\n1 2 3\n0', t(10, 5), t(100, 100), t(1000, 1000), t(1000, 3)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = a.slice(1, n + 1); const q = a[n + 1]; for (let i = 0; i < q; i++) v[a[n + 2 + 2 * i] - 1] = a[n + 3 + 2 * i]; return v.join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int p, x;
        cin >> p >> x;
        v[p - 1] = x;
    }
    for (int i = 0; i < n; i++) cout << v[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-temperatury', krok: 1, level: 'latwe',
            title: 'Cieplej czy zimniej?',
            short: 'Temperatury z kolejnych dni: ile razy było cieplej niż dzień wcześniej, ile zimniej, a ile tak samo?',
            tags: ['v[i] i v[i - 1]', 'porównanie sąsiadów', 'trzy liczniki'],
            statement: ['Przez n kolejnych dni zapisywano temperaturę w południe. Dla każdego dnia oprócz pierwszego porównaj temperaturę z dniem poprzednim. Policz, ile razy było cieplej niż poprzedniego dnia, ile razy zimniej, a ile razy tak samo.'],
            input_format: ['W pierwszym wierszu liczba dni n.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Trzy liczby oddzielone spacjami: ile razy cieplej, ile zimniej, ile tak samo.'],
            constraints: ['1 ≤ n ≤ 1000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '6\n3 5 5 2 4 -1', note: 'Cieplej: 3→5 i 2→4. Zimniej: 5→2 i 4→−1. Tak samo: 5→5.' }, { input: '1\n10', note: 'Jeden dzień — nie ma z czym porównywać.' }],
            hint: R`Porównujesz sąsiadów, więc potrzebujesz numerów: pętla od i = 1 (nie od 0!) do n - 1 i warunki v[i] > v[i - 1], v[i] < v[i - 1]. Trzy liczniki startują od zera.`,
            tests: (r) => ['2\n-50 50', '4\n7 7 7 7', '5\n5 4 3 2 1', fmt(arr(r, 20, -5, 5)), fmt(arr(r, 1000, -50, 50)), fmt(arr(r, 500, 0, 2))],
            solve: (inp) => { const v = nums(inp).slice(1); let c = 0, z = 0, t = 0; for (let i = 1; i < v.length; i++) { if (v[i] > v[i - 1]) c++; else if (v[i] < v[i - 1]) z++; else t++; } return `${c} ${z} ${t}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    int cieplej = 0, zimniej = 0, tak_samo = 0;
    for (int i = 1; i < n; i++) {
        if (v[i] > v[i - 1]) cieplej++;
        else if (v[i] < v[i - 1]) zimniej++;
        else tak_samo++;
    }
    cout << cieplej << " " << zimniej << " " << tak_samo << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-najdluzsze-slowo', krok: 1, level: 'latwe',
            title: 'Najdłuższe słowo',
            short: 'vector napisów: znajdź najdłuższe słowo, a potem wypisz wszystkie słowa od końca.',
            tags: ['vector<string>', 's[i].size()', 'od końca'],
            statement: ['Wczytaj n słów do vectora napisów. W pierwszym wierszu wypisz najdłuższe słowo — jeśli kilka ma tę samą największą długość, wypisz to, które pojawiło się najwcześniej. W drugim wierszu wypisz wszystkie słowa w odwrotnej kolejności, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów złożonych z małych liter.'],
            output_format: ['Dwa wiersze: najdłuższe słowo oraz wszystkie słowa od ostatniego do pierwszego.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 20 liter.'],
            examples: [{ input: '4\nala ma duzego kota', note: 'Najdłuższe jest „duzego” (6 liter).' }, { input: '3\nkot pies mysz', note: '„pies” i „mysz” mają po 4 litery — wygrywa wcześniejsze.' }],
            hint: R`Utwórz vector<string> s(n); i wczytaj słowa pętlą. Długość słowa numer i to s[i].size(). Szukaj najdłuższego jak maksimum: zapamiętaj numer najlepszego słowa i zmieniaj go tylko przy długości ostro większej (>), wtedy przy remisie zostaje wcześniejsze.`,
            tests: (r) => ['1\nslowo', '2\nab cd', '5\na bb a bb a', `20\n${Array.from({ length: 20 }, () => r.pick(SLOWA)).join(' ')}`,
                `1000\n${Array.from({ length: 1000 }, () => r.word(r.int(1, 20))).join(' ')}`, `300\n${Array.from({ length: 300 }, () => r.word(r.int(1, 3), 'ab')).join(' ')}`],
            solve: (inp) => { const w = toks(inp).slice(1); let b = 0; w.forEach((x, i) => { if (x.length > w[b].length) b = i; }); return `${w[b]}\n${w.slice().reverse().join(' ')}`; },
            cpp: R`
#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (int i = 0; i < n; i++) cin >> s[i];
    int best = 0;
    for (int i = 1; i < n; i++) {
        if (s[i].size() > s[best].size()) best = i;
    }
    cout << s[best] << "\n";
    for (int i = n - 1; i >= 0; i--) cout << s[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-lawki', krok: 1, level: 'latwe',
            title: 'Ławki w parku',
            short: 'Rząd n pustych ławek i k osób, które na nich siadają. Narysuj park i policz wolne ławki.',
            tags: ["vector<char> v(n, '.')", 'v[p] = litera', 'wypisz jak napis'],
            statement: ["W parku stoi rząd n ławek o numerach od 0 do n − 1. Na początku wszystkie są puste. Przychodzi k osób — każda siada na innej ławce. O każdej osobie wiesz, na której ławce usiadła, i znasz pierwszą literę jej imienia. Wypisz rząd ławek jako jeden ciąg n znaków: wolna ławka to kropka, a zajęta — litera osoby. W drugim wierszu wypisz, ile ławek zostało wolnych."],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z kolejnych k wierszy liczba p (numer ławki) i wielka litera.'],
            output_format: ['W pierwszym wierszu n znaków bez spacji — rząd ławek.', 'W drugim wierszu liczba wolnych ławek.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k ≤ n', '0 ≤ p ≤ n − 1, każda osoba siada na innej ławce'],
            examples: [{ input: '12 4\n0 C\n2 L\n6 B\n9 K', note: 'To park z lekcji: C.L...B..K..' }],
            hint: R`vector<char> lawki(n, '.'); tworzy n kropek. Każda osoba to jedno przypisanie lawki[p] = litera;. Na koniec wypisz znaki pętlą bez spacji i policz kropki (albo po prostu wypisz n - k).`,
            check: (inp) => { const t = toks(inp); const n = +t[0], k = +t[1]; const ps = []; for (let i = 0; i < k; i++) ps.push(+t[2 + 2 * i]); return new Set(ps).size === k && ps.every((p) => p >= 0 && p < n) ? null : 'zła ławka'; },
            tests: (r) => {
                const t = (n, k) => { const ps = r.shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, k); return `${n} ${k}${k ? '\n' : ''}${ps.map((p) => `${p} ${r.word(1, 'ABCDEFGHIJKLMNOPRSTUWZ')}`).join('\n')}`; };
                return ['1 0', '1 1\n0 A', '5 5\n4 E\n3 D\n2 C\n1 B\n0 A', t(30, 10), t(1000, 300), t(1000, 1000), t(200, 0)];
            },
            solve: (inp) => { const t = toks(inp); const n = +t[0], k = +t[1]; const v = Array(n).fill('.'); for (let i = 0; i < k; i++) v[+t[2 + 2 * i]] = t[3 + 2 * i]; return `${v.join('')}\n${n - k}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<char> lawki(n, '.');
    for (int i = 0; i < k; i++) {
        int p;
        char c;
        cin >> p >> c;
        lawki[p] = c;
    }
    int wolne = 0;
    for (int i = 0; i < n; i++) {
        cout << lawki[i];
        if (lawki[i] == '.') wolne++;
    }
    cout << "\n" << wolne << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-powyzej-sredniej', krok: 1, level: 'srednie',
            title: 'Powyżej średniej',
            short: 'Policz średnią z n liczb i wypisz te liczby, które są od niej większe.',
            tags: ['dwa przejścia po vectorze', 'fixed i setprecision', 'double'],
            statement: ['Wczytaj n liczb całkowitych. W pierwszym wierszu wypisz ich średnią arytmetyczną z dokładnie dwiema cyframi po kropce. W drugim wierszu wypisz — w kolejności z wejścia — wszystkie liczby, które są ostro większe od średniej. Jeśli takich liczb nie ma, wypisz BRAK.', 'Żeby wiedzieć, które liczby są większe od średniej, musisz najpierw znać średnią — a do tego trzeba przejrzeć wszystkie liczby. Dlatego liczby trzeba zapamiętać w vectorze i przejrzeć dwa razy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu średnia z dwiema cyframi po kropce.', 'W drugim wierszu liczby większe od średniej albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '5\n4 8 1 7 5', note: 'Średnia to 25 / 5 = 5.00. Większe od niej: 8 i 7.' }, { input: '3\n2 2 2', note: 'Wszystkie liczby są równe średniej — żadna nie jest większa.' }],
            hint: R`Najpierw zsumuj liczby i policz średnią jako double: (double)suma / n — bez rzutowania dzielenie byłoby całkowite. Wypisz ją przez cout << fixed << setprecision(2) (biblioteka iomanip). Potem drugą pętlą wypisz liczby większe od średniej; jeśli żadnej nie było, wypisz BRAK.`,
            check: (inp) => { const v = nums(inp).slice(1); const s = v.reduce((a, b) => a + b, 0); return safe(s / v.length, 2) ? null : 'średnia w połowie'; },
            tests: (r) => {
                const out = ['1\n-7', '2\n1 2', '4\n-1000 1000 -1000 1000', '6\n10 9 8 7 6 5'];
                for (const n of [10, 100, 1000, 999]) {
                    for (let k = 0; k < 50; k++) { const v = arr(r, n, -1000, 1000); const s = v.reduce((a, b) => a + b, 0); if (safe(s / n, 2)) { out.push(fmt(v)); break; } }
                }
                return out;
            },
            solve: (inp) => { const v = nums(inp).slice(1); const s = v.reduce((a, b) => a + b, 0); const n = v.length; const w = v.filter((x) => x * n > s); return `${fx(s / n, 2)}\n${w.length ? w.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> v[i];
        suma += v[i];
    }
    double srednia = (double)suma / n;
    cout << fixed << setprecision(2) << srednia << "\n";
    bool byla = false;
    for (int i = 0; i < n; i++) {
        if ((long long)v[i] * n > suma) {
            cout << v[i] << " ";
            byla = true;
        }
    }
    if (!byla) cout << "BRAK";
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · rośnie i maleje
        {
            id: 'vec-tylko-parzyste', krok: 2, level: 'latwe',
            title: 'Tylko parzyste',
            short: 'Zbierz do osobnego vectora tylko liczby parzyste i wypisz, ile ich jest i jakie.',
            tags: ['pusty vector', 'push_back', 'size()'],
            statement: ['Wczytaj n liczb całkowitych. Zbierz do osobnego vectora te z nich, które są parzyste — w kolejności z wejścia. W pierwszym wierszu wypisz, ile ich jest, a w drugim same te liczby oddzielone spacjami. Jeśli parzystych nie ma, w drugim wierszu wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: liczba parzystych i same parzyste (albo BRAK).'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n4 7 10 -3 0 5 8' }, { input: '3\n1 3 -5' }],
            hint: R`Zacznij od pustego vector<int> parzyste;. Każdą liczbę wczytaj do zmiennej x i jeśli x % 2 == 0, zrób parzyste.push_back(x);. Pamiętaj, że -3 % 2 to -1 — dlatego sprawdzaj == 0, a nie == 1. Na końcu parzyste.size() mówi, ile ich zebrałeś.`,
            tests: (r) => ['1\n0', '1\n-1', '4\n2 4 6 8', fmt(arr(r, 15, -20, 20)), fmt(arr(r, 1000, -1e9, 1e9)), fmt(arr(r, 500, 0, 3).map((x) => 2 * x + 1))],
            solve: (inp) => { const v = nums(inp).slice(1).filter((x) => x % 2 === 0); return `${v.length}\n${v.length ? v.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> parzyste;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) parzyste.push_back(x);
    }
    cout << parzyste.size() << "\n";
    if (parzyste.empty()) cout << "BRAK";
    for (int i = 0; i < parzyste.size(); i++) cout << parzyste[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-do-konca-danych', krok: 2, level: 'latwe',
            title: 'Ile liczb przyszło?',
            short: 'Nikt nie powie Ci, ile jest liczb. Wczytuj aż do końca danych, a potem wypisz je od końca.',
            tags: ['while (cin >> x)', 'push_back', 'od końca'],
            statement: ['Na wejściu jest pewna liczba liczb całkowitych, rozrzuconych w kilku wierszach — ale nikt nie mówi, ile ich jest. Wczytaj je wszystkie. W pierwszym wierszu wypisz, ile liczb wczytałeś, a w drugim — wszystkie liczby w odwrotnej kolejności, oddzielone spacjami.'],
            input_format: ['Kilka wierszy z liczbami całkowitymi. Wiersz może zawierać jedną albo wiele liczb.'],
            output_format: ['Dwa wiersze: ile liczb, a potem liczby od ostatniej do pierwszej.'],
            constraints: ['Liczb jest od 1 do 1000.', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3 1 4 1\n5 9' }, { input: '42' }],
            hint: R`Pętla while (cin >> x) wczytuje liczby, dopóki są, i sama kończy się na końcu danych. W środku rób v.push_back(x);. Po pętli v.size() to liczba wczytanych liczb. Testując w konsoli, koniec danych zaznaczasz Ctrl+Z i Enter (Windows) albo Ctrl+D.`,
            tests: (r) => {
                const t = (n, lo, hi) => { const v = arr(r, n, lo, hi); const ls = []; let i = 0; while (i < v.length) { const k = r.int(1, 12); ls.push(v.slice(i, i + k).join(' ')); i += k; } return ls.join('\n'); };
                return ['-5', '1\n2\n3', '0 0', t(30, -100, 100), t(1000, -1e9, 1e9), t(400, 1, 9)];
            },
            solve: (inp) => { const v = nums(inp); return `${v.length}\n${v.reverse().join(' ')}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> v;
    int x;
    while (cin >> x) v.push_back(x);
    cout << v.size() << "\n";
    for (int i = (int)v.size() - 1; i >= 0; i--) cout << v[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-cyfry', krok: 2, level: 'latwe',
            title: 'Cyfry w vectorze',
            short: 'Rozbierz liczbę na cyfry i zbierz je w vectorze. Wypisz je od przodu i od tyłu.',
            tags: ['n % 10 i n /= 10', 'push_back', 'liczba 0 osobno'],
            statement: ['Wczytaj nieujemną liczbę całkowitą n. Zbierz jej cyfry w vectorze. W pierwszym wierszu wypisz cyfry liczby od pierwszej do ostatniej, oddzielone spacjami, a w drugim — od ostatniej do pierwszej.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: cyfry od pierwszej do ostatniej i od ostatniej do pierwszej.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '90417' }, { input: '0', note: 'Zero ma jedną cyfrę: 0.' }],
            hint: R`Liczba do 10¹⁸ potrzebuje long long. Pętla while (n > 0) { c.push_back(n % 10); n /= 10; } zbiera cyfry od końca: c[0] to jedności. Cyfry od pierwszej wypisujesz więc pętlą od c.size() - 1 w dół, a od ostatniej — od 0 w górę. Zero obsłuż osobno: pętla while (n > 0) nie wykona się ani razu.`,
            tests: (r) => ['7', '10', '1000000000000000000', '999999999999999999', '120', String(r.int(1, 1e9)), String(r.big(1, 10n ** 18n)), String(r.big(10n ** 17n, 10n ** 18n - 1n))],
            solve: (inp) => { const s = inp.trim().split(''); return `${s.join(' ')}\n${s.slice().reverse().join(' ')}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    long long n;
    cin >> n;
    vector<int> c;
    if (n == 0) c.push_back(0);
    while (n > 0) {
        c.push_back(n % 10);
        n /= 10;
    }
    for (int i = (int)c.size() - 1; i >= 0; i--) cout << c[i] << " ";
    cout << "\n";
    for (int i = 0; i < c.size(); i++) cout << c[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-collatz', krok: 2, level: 'latwe',
            title: 'Ciąg Collatza',
            short: 'Zbieraj kolejne wyrazy ciągu Collatza, aż dojdziesz do 1. Ile ich było i który był największy?',
            tags: ['push_back w while', 'long long', 'max'],
            statement: ['Ciąg Collatza zaczyna się od liczby n. Jeśli bieżąca liczba jest parzysta, następna to jej połowa. Jeśli jest nieparzysta, następna to trzykrotność plus jeden. Ciąg kończy się, gdy dojdzie do 1. Zbierz wszystkie wyrazy ciągu (razem z n i końcową jedynką) w vectorze. Wypisz: w pierwszym wierszu liczbę wyrazów, w drugim największy wyraz, a w trzecim — wszystkie wyrazy po kolei.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Trzy wiersze: liczba wyrazów, największy wyraz, wszystkie wyrazy oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 10⁶'],
            examples: [{ input: '6', note: '6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1: dziewięć wyrazów, największy to 16.' }, { input: '1', note: 'Ciąg od razu się kończy: jeden wyraz.' }],
            hint: R`Uwaga na zakres: choć n ≤ 10⁶, wyrazy ciągu potrafią urosnąć ponad 50 miliardów — trzymaj je w long long, a vector rób typu vector<long long>. Najpierw push_back(n), potem pętla while (n != 1), w której liczysz następny wyraz i dokładasz go na koniec.`,
            tests: () => ['2', '3', '27', '97', '704511', '837799', '1000000', '999999'],
            solve: (inp) => { let n = nums(inp)[0]; const v = [n]; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; v.push(n); } return `${v.length}\n${Math.max(...v)}\n${v.join(' ')}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    long long n;
    cin >> n;
    vector<long long> v;
    v.push_back(n);
    while (n != 1) {
        if (n % 2 == 0) n = n / 2;
        else n = 3 * n + 1;
        v.push_back(n);
    }
    long long mx = v[0];
    for (int i = 0; i < v.size(); i++) if (v[i] > mx) mx = v[i];
    cout << v.size() << "\n" << mx << "\n";
    for (int i = 0; i < v.size(); i++) cout << v[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-bez-powtorzen-obok', krok: 2, level: 'latwe',
            title: 'Bez powtórzeń obok siebie',
            short: 'Sklej sąsiadujące takie same liczby w jedną. Pomoże v.back().',
            tags: ['v.back()', 'v.empty()', 'push_back z warunkiem'],
            statement: ['Wczytaj n liczb. Zbuduj nowy vector, w którym każda grupa takich samych liczb stojących obok siebie zostaje zastąpiona jedną taką liczbą. Na przykład z 1 1 2 2 2 1 3 3 powstaje 1 2 1 3. Wypisz rozmiar nowego vectora, a w drugim wierszu jego elementy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: rozmiar nowego vectora i jego elementy.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n1 1 2 2 2 1 3 3', note: 'Jedynka pojawia się w wyniku dwa razy, bo nie stały obok siebie.' }],
            hint: R`Idź po liczbach po kolei i dokładaj liczbę x do nowego vectora w tylko wtedy, gdy w.empty() albo w.back() != x — czyli gdy różni się od ostatnio dołożonej. Najpierw sprawdź empty(), bo back() na pustym vectorze wysypie program.`,
            tests: (r) => ['1\n5', '5\n7 7 7 7 7', '6\n1 2 1 2 1 2', fmt(arr(r, 30, 0, 2)), fmt(arr(r, 1000, -2, 2)), fmt(arr(r, 1000, -1e9, 1e9)), fmt(arr(r, 200, 5, 5).concat(arr(r, 200, 6, 6)))],
            solve: (inp) => { const v = nums(inp).slice(1); const w = v.filter((x, i) => i === 0 || v[i - 1] !== x); return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> w;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (w.empty() || w.back() != x) w.push_back(x);
    }
    cout << w.size() << "\n";
    for (int i = 0; i < w.size(); i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-zamek', krok: 2, level: 'latwe',
            title: 'Zamek błyskawiczny',
            short: 'Splataj dwa vectory na przemian, jak ząbki zamka: a₀ b₀ a₁ b₁… a resztę dłuższego dołóż na końcu.',
            tags: ['dwa vectory', 'push_back', 'różne długości'],
            statement: ['Masz dwa ciągi: a (n liczb) i b (m liczb). Zbuduj nowy ciąg, biorąc elementy na przemian, jak ząbki zamka błyskawicznego: pierwszy element a, pierwszy element b, drugi element a, drugi element b i tak dalej. Gdy jeden z ciągów się skończy, dołóż na koniec wszystkie pozostałe elementy drugiego. Wypisz powstały ciąg.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb ciągu a.', 'W trzecim wierszu liczba m, w czwartym m liczb ciągu b.'],
            output_format: ['Jeden wiersz: n + m liczb splecionego ciągu.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1 2 3\n5\n10 20 30 40 50', note: 'Po trzech parach a się kończy — 40 i 50 idą na koniec.' }],
            hint: R`Wczytaj oba ciągi do vectorów. Potem pętla po i od 0 do max(n, m) - 1: jeśli i < n, dołóż a[i], a jeśli i < m, dołóż b[i] — do wynikowego vectora przez push_back.`,
            tests: (r) => ['1\n5\n1\n6', '2\n1 1\n1\n2', '1\n7\n4\n1 2 3 4', `${fmt(arr(r, 10, -9, 9))}\n${fmt(arr(r, 3, -9, 9))}`, `${fmt(arr(r, 1000, -1e9, 1e9))}\n${fmt(arr(r, 1000, -1e9, 1e9))}`, `${fmt(arr(r, 7, 0, 100))}\n${fmt(arr(r, 900, 0, 100))}`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const A = a.slice(1, n + 1); const m = a[n + 1]; const B = a.slice(n + 2, n + 2 + m); const w = []; for (let i = 0; i < Math.max(n, m); i++) { if (i < n) w.push(A[i]); if (i < m) w.push(B[i]); } return w.join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, m;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cin >> m;
    vector<int> b(m);
    for (int i = 0; i < m; i++) cin >> b[i];
    vector<int> w;
    for (int i = 0; i < max(n, m); i++) {
        if (i < n) w.push_back(a[i]);
        if (i < m) w.push_back(b[i]);
    }
    for (int i = 0; i < w.size(); i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-cofanie', krok: 2, level: 'srednie',
            title: 'Edytor z cofaniem',
            short: 'Polecenia DOPISZ, COFNIJ i OSTATNI. vector jako stos: push_back, pop_back i back.',
            tags: ['push_back', 'pop_back', 'back() i empty()'],
            statement: ['Prosty edytor trzyma listę liczb, na początku pustą, i wykonuje q poleceń:', '• DOPISZ x — dopisz liczbę x na koniec listy,', '• COFNIJ — usuń ostatnią liczbę z listy; jeśli lista jest pusta, nic nie rób,', '• OSTATNI — wypisz ostatnią liczbę listy albo PUSTO, jeśli lista jest pusta.', 'Po wykonaniu wszystkich poleceń wypisz całą listę od początku do końca (albo PUSTO).'],
            input_format: ['W pierwszym wierszu liczba poleceń q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu dla każdego polecenia OSTATNI, a na końcu wiersz z całą listą.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁹ ≤ x ≤ 10⁹'],
            examples: [{ input: '7\nDOPISZ 5\nDOPISZ 8\nOSTATNI\nCOFNIJ\nOSTATNI\nCOFNIJ\nOSTATNI' }, { input: '4\nCOFNIJ\nDOPISZ 1\nDOPISZ 2\nDOPISZ 3', note: 'Pierwsze COFNIJ trafia na pustą listę i nic nie robi.' }],
            hint: R`Lista to vector<int> v;. DOPISZ to v.push_back(x), COFNIJ to v.pop_back() — ale tylko gdy !v.empty(). OSTATNI to v.back() albo PUSTO. Polecenie wczytuj do string i porównuj przez ==; liczbę x wczytuj tylko przy DOPISZ.`,
            tests: (r) => {
                const t = (q, pd) => { const ops = []; for (let i = 0; i < q; i++) { const u = r(); ops.push(u < pd ? `DOPISZ ${r.int(-1e9, 1e9)}` : u < pd + (1 - pd) / 2 ? 'COFNIJ' : 'OSTATNI'); } return `${q}\n${ops.join('\n')}`; };
                return ['1\nOSTATNI', '2\nDOPISZ -3\nOSTATNI', '3\nCOFNIJ\nCOFNIJ\nOSTATNI', t(20, 0.4), t(1000, 0.5), t(1000, 0.8), t(1000, 0.2)];
            },
            solve: (inp) => { const t = toks(inp); const q = +t[0]; let i = 1; const v = []; const out = []; for (let k = 0; k < q; k++) { const c = t[i++]; if (c === 'DOPISZ') v.push(t[i++]); else if (c === 'COFNIJ') v.pop(); else out.push(v.length ? v[v.length - 1] : 'PUSTO'); } out.push(lista(v)); return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<int> v;
    for (int i = 0; i < q; i++) {
        string c;
        cin >> c;
        if (c == "DOPISZ") {
            int x;
            cin >> x;
            v.push_back(x);
        } else if (c == "COFNIJ") {
            if (!v.empty()) v.pop_back();
        } else {
            if (v.empty()) cout << "PUSTO\n";
            else cout << v.back() << "\n";
        }
    }
    if (v.empty()) cout << "PUSTO";
    for (int i = 0; i < v.size(); i++) cout << v[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-glosy', krok: 2, level: 'srednie',
            title: 'Liczenie głosów',
            short: 'Głosy na kandydatów o numerach, których nie znasz z góry. Vector liczników urośnie dzięki resize.',
            tags: ['resize', 'vector liczników', 'while (cin >> x)'],
            statement: ['W wyborach każdy głos to numer kandydata. Nie wiadomo z góry, ilu jest kandydatów ani ile będzie głosów — głosy przychodzą aż do końca danych. Wypisz w pierwszym wierszu numer zwycięzcy i liczbę jego głosów (przy remisie wygrywa kandydat o mniejszym numerze), a w drugim wierszu — ilu różnych kandydatów dostało przynajmniej jeden głos.'],
            input_format: ['Numery kandydatów oddzielone spacjami lub znakami nowej linii, aż do końca danych.'],
            output_format: ['W pierwszym wierszu dwie liczby: numer zwycięzcy i liczba jego głosów.', 'W drugim wierszu liczba kandydatów z co najmniej jednym głosem.'],
            constraints: ['Głosów jest od 1 do 5000.', '1 ≤ numer kandydata ≤ 100 000'],
            examples: [{ input: '3 7 3\n1 7 3', note: 'Kandydat 3 ma 3 głosy, 7 ma 2, a 1 ma jeden. Głosy dostało trzech różnych kandydatów.' }, { input: '5 2', note: 'Remis 1 : 1 — wygrywa kandydat 2, bo ma mniejszy numer.' }],
            hint: R`Trzymaj liczniki w vector<int> licz;. Gdy przychodzi głos na kandydata x, a licz.size() <= x, zrób licz.resize(x + 1); — nowe pudełka dostaną zera. Dopiero potem licz[x]++. Na końcu przejdź po licznikach od 1 w górę: szukaj maksimum (ostro większe, żeby przy remisie został mniejszy numer) i licz niezerowe pudełka.`,
            tests: (r) => {
                const t = (n, maxK, wiersz) => { const v = arr(r, n, 1, maxK); const ls = []; for (let i = 0; i < v.length; i += wiersz) ls.push(v.slice(i, i + wiersz).join(' ')); return ls.join('\n'); };
                return ['1', '100000', '4 4 2 2', t(50, 5, 10), t(5000, 100000, 20), t(5000, 30, 25), t(3000, 1000, 1)];
            },
            solve: (inp) => { const v = nums(inp); const c = new Map(); v.forEach((x) => c.set(x, (c.get(x) || 0) + 1)); let bk = 0, bv = -1; for (const [k, x] of c) if (x > bv || (x === bv && k < bk)) { bk = k; bv = x; } return `${bk} ${bv}\n${c.size}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> licz;
    int x;
    while (cin >> x) {
        if ((int)licz.size() <= x) licz.resize(x + 1);
        licz[x]++;
    }
    int best = 0, ile = 0;
    for (int k = 1; k < licz.size(); k++) {
        if (licz[k] > 0) ile++;
        if (best == 0 || licz[k] > licz[best]) best = k;
    }
    cout << best << " " << licz[best] << "\n" << ile << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · for-each i &
        {
            id: 'vec-razy-k', krok: 3, level: 'latwe',
            title: 'Pomnóż wszystko',
            short: 'Wczytaj vector pętlą for-each z &, pomnóż każdy element przez k i wypisz.',
            tags: ['for (auto &x : v) cin >> x', 'x *= k', 'for (auto x : v)'],
            statement: ['Wczytaj n liczb całkowitych do vectora, a potem pomnóż każdy jego element przez k — tak, żeby zmienił się sam vector. Na koniec wypisz vector.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb po pomnożeniu.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁴ ≤ k, każda liczba ≤ 10⁴'],
            examples: [{ input: '4 3\n1 -2 0 5' }],
            hint: R`To ćwiczenie na trzy pętle „dla każdego”: wczytanie for (auto &x : v) cin >> x;, mnożenie for (auto &x : v) x *= k; i wypisanie for (auto x : v) cout << x << " ";. W dwóch pierwszych potrzebujesz &, bo zmieniasz vector; w trzeciej nie.`,
            tests: (r) => ['1 0\n7', '3 -1\n1 2 3', '2 10000\n10000 -10000', `10 ${r.int(-9, 9)}\n${arr(r, 10, -9, 9).join(' ')}`, `1000 ${r.int(-1e4, 1e4)}\n${arr(r, 1000, -1e4, 1e4).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const k = a[1]; return a.slice(2).map((x) => x * k).join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    for (auto &x : v) x *= k;
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-przytnij', krok: 3, level: 'latwe',
            title: 'Przytnij do przedziału',
            short: 'Każdą liczbę spoza przedziału [lo, hi] przesuń na najbliższy koniec. Ile liczb się zmieniło?',
            tags: ['for (auto &x : v)', 'zmiana przez referencję', 'licznik'],
            statement: ['Wczytaj n liczb oraz dwie liczby lo ≤ hi. Każdą liczbę mniejszą od lo zamień na lo, a każdą większą od hi — na hi. Liczby z przedziału [lo, hi] zostają bez zmian. W pierwszym wierszu wypisz vector po zmianach, a w drugim — ile liczb się zmieniło.'],
            input_format: ['W pierwszym wierszu liczby n, lo i hi.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: liczby po przycięciu i liczba zmienionych.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ lo ≤ hi ≤ 10⁹', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 0 10\n-5 3 12 10 0 100', note: 'Zmieniają się −5 (na 0), 12 i 100 (na 10).' }],
            hint: R`W pętli for (auto &x : v) sprawdź if (x < lo) { x = lo; ile++; } else if (x > hi) { x = hi; ile++; }. Bez & zmieniałbyś kopie i vector zostałby taki sam.`,
            check: (inp) => { const [, lo, hi] = nums(inp); return lo <= hi ? null : 'lo > hi'; },
            tests: (r) => ['1 5 5\n5', '3 -1 1\n-2 0 2', `20 -10 10\n${arr(r, 20, -20, 20).join(' ')}`, `1000 -1000000 1000000\n${arr(r, 1000, -2e6, 2e6).join(' ')}`, `500 7 7\n${arr(r, 500, 0, 14).join(' ')}`, `1000 -1000000000 1000000000\n${arr(r, 1000, -1e9, 1e9).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const [, lo, hi] = a; let c = 0; const v = a.slice(3).map((x) => { if (x < lo) { c++; return lo; } if (x > hi) { c++; return hi; } return x; }); return `${v.join(' ')}\n${c}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, lo, hi;
    cin >> n >> lo >> hi;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int ile = 0;
    for (auto &x : v) {
        if (x < lo) { x = lo; ile++; }
        else if (x > hi) { x = hi; ile++; }
    }
    for (auto x : v) cout << x << " ";
    cout << "\n" << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-statystyki', krok: 3, level: 'latwe',
            title: 'Suma, minimum, maksimum',
            short: 'Jedna pętla „dla każdego”: suma, najmniejsza i największa liczba oraz ile razy wystąpiło maksimum.',
            tags: ['for (auto x : v)', 'long long', 'min i max'],
            statement: ['Wczytaj n liczb całkowitych do vectora. Wypisz w jednym wierszu cztery liczby: sumę wszystkich liczb, najmniejszą liczbę, największą liczbę oraz to, ile razy największa liczba występuje w vectorze.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Cztery liczby: suma, minimum, maksimum, ile razy maksimum.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n4 9 -2 9 0 3', note: 'Suma 23, minimum −2, maksimum 9 — występuje dwa razy.' }],
            hint: R`Suma tysiąca liczb do 10⁹ to nawet 10¹² — potrzebny long long. Minimum i maksimum zacznij od v[0]. Liczbę wystąpień maksimum policz drugą pętlą „dla każdego”, gdy już wiesz, ile wynosi maksimum.`,
            tests: (r) => ['1\n-1000000000', '3\n5 5 5', fmt(arr(r, 1000, 1e9, 1e9)), fmt(arr(r, 1000, -1e9, -1e9 + 5)), fmt(arr(r, 20, -3, 3)), fmt(arr(r, 1000, -1e9, 1e9))],
            solve: (inp) => { const v = nums(inp).slice(1); const s = v.reduce((a, b) => a + b, 0); const mn = Math.min(...v), mx = Math.max(...v); return `${s} ${mn} ${mx} ${v.filter((x) => x === mx).length}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    long long suma = 0;
    int mn = v[0], mx = v[0];
    for (auto x : v) {
        suma += x;
        if (x < mn) mn = x;
        if (x > mx) mx = x;
    }
    int ile = 0;
    for (auto x : v) if (x == mx) ile++;
    cout << suma << " " << mn << " " << mx << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-wielkie-litery', krok: 3, level: 'latwe',
            title: 'Wielka litera na początku',
            short: 'vector napisów i pętla for (auto &s : slowa): każde słowo zaczyna się od wielkiej litery.',
            tags: ['vector<string>', 'for (auto &s : v)', 'toupper'],
            statement: ['Wczytaj n słów zapisanych małymi literami. Zamień w każdym słowie pierwszą literę na wielką — tak, by zmieniły się słowa w vectorze — i wypisz wszystkie słowa w jednym wierszu, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter.'],
            output_format: ['Jeden wiersz: słowa z wielką pierwszą literą.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 20 liter.'],
            examples: [{ input: '3\nala ma kota' }],
            hint: R`for (auto &s : slowa) s[0] = toupper(s[0]); — & sprawia, że zmieniasz słowa w vectorze, a nie ich kopie. toupper znasz z lekcji o napisach (biblioteka cctype).`,
            tests: (r) => ['1\na', '2\nzz ab', `20\n${Array.from({ length: 20 }, () => r.pick(SLOWA)).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => r.word(r.int(1, 15))).join(' ')}`],
            solve: (inp) => toks(inp).slice(1).map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
            cpp: R`
#include <iostream>
#include <vector>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> slowa(n);
    for (auto &s : slowa) cin >> s;
    for (auto &s : slowa) s[0] = toupper(s[0]);
    for (auto s : slowa) cout << s << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-cwiartki', krok: 3, level: 'latwe',
            title: 'Punkty w ćwiartkach',
            short: 'vector par (x, y) i rozpakowywanie w pętli: ile punktów leży w każdej ćwiartce układu?',
            tags: ['vector<pair<int, int>>', 'for (auto [x, y] : p)', 'pięć liczników'],
            statement: ['Wczytaj n punktów (x, y) do vectora par. Policz, ile punktów leży w każdej ćwiartce układu współrzędnych, a ile na osiach. Ćwiartka I to x > 0 i y > 0, II to x < 0 i y > 0, III to x < 0 i y < 0, IV to x > 0 i y < 0. Punkt, który ma x = 0 albo y = 0, leży na osi.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby x i y.'],
            output_format: ['Pięć liczb: ile punktów w ćwiartkach I, II, III, IV oraz ile na osiach.'],
            constraints: ['1 ≤ n ≤ 1000', '−1000 ≤ x, y ≤ 1000'],
            examples: [{ input: '6\n1 2\n-3 4\n-1 -1\n5 -2\n0 7\n0 0', note: 'Po jednym punkcie w każdej ćwiartce i dwa na osiach.' }],
            hint: R`Wczytaj punkty: for (auto &[x, y] : p) cin >> x >> y; (vector<pair<int, int>> p(n)). Potem for (auto [x, y] : p) i seria if-ów: najpierw sprawdź, czy x == 0 || y == 0 (oś), a dopiero potem znaki x i y.`,
            tests: (r) => {
                const t = (n, m) => `${n}\n${Array.from({ length: n }, () => `${r.int(-m, m)} ${r.int(-m, m)}`).join('\n')}`;
                return ['1\n0 0', '4\n1 1\n2 2\n3 3\n-1 -1', t(20, 2), t(1000, 1000), t(1000, 1)];
            },
            solve: (inp) => { const a = nums(inp); const c = [0, 0, 0, 0, 0]; for (let i = 0; i < a[0]; i++) { const x = a[1 + 2 * i], y = a[2 + 2 * i]; if (x === 0 || y === 0) c[4]++; else if (x > 0 && y > 0) c[0]++; else if (x < 0 && y > 0) c[1]++; else if (x < 0) c[2]++; else c[3]++; } return c.join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> p(n);
    for (auto &[x, y] : p) cin >> x >> y;
    int c1 = 0, c2 = 0, c3 = 0, c4 = 0, osie = 0;
    for (auto [x, y] : p) {
        if (x == 0 || y == 0) osie++;
        else if (x > 0 && y > 0) c1++;
        else if (x < 0 && y > 0) c2++;
        else if (x < 0) c3++;
        else c4++;
    }
    cout << c1 << " " << c2 << " " << c3 << " " << c4 << " " << osie << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-slownikowo', krok: 3, level: 'srednie',
            title: 'Który ciąg pierwszy?',
            short: 'Porównaj dwa ciągi liczb jak słowa w słowniku. vectory porównują się same: a < b.',
            tags: ['a < b na vectorach', 'a == b', 'kolejność słownikowa'],
            statement: ['Dwa ciągi liczb porównujemy jak słowa w słowniku: patrzymy na pierwsze elementy — jeśli są różne, mniejszy element ma ciąg, który jest „wcześniej”. Jeśli są równe, porównujemy drugie elementy, i tak dalej. Jeśli jeden ciąg jest początkiem drugiego, wcześniej jest ten krótszy. Wypisz PIERWSZY, jeśli wcześniej jest ciąg a, DRUGI — jeśli b, albo ROWNE, jeśli ciągi są identyczne.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb ciągu a.', 'W trzecim wierszu liczba m, w czwartym m liczb ciągu b.'],
            output_format: ['Jedno słowo: PIERWSZY, DRUGI albo ROWNE.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1 2 9\n2\n1 3', note: 'Pierwsze elementy równe, a na drugim miejscu 2 < 3 — wcześniej jest a.' }, { input: '2\n4 4\n3\n4 4 0', note: 'a to początek b, więc a jest wcześniej.' }],
            hint: R`Wczytaj oba ciągi do vector<int> a(n), b(m);. Z części 3 wiesz, że vectory porównują się jak napisy: if (a < b) … else if (b < a) … else …. Nie musisz pisać żadnej pętli porównującej.`,
            tests: (r) => {
                const v = arr(r, 500, -1e9, 1e9);
                const w = v.slice(); w[499] = v[499] < 1e9 ? v[499] + 1 : v[499] - 1;
                return ['1\n5\n1\n5', '1\n-1\n1\n1', '3\n1 2 3\n2\n1 2', '2\n7 7\n2\n7 8', `${fmt(v)}\n${fmt(v)}`, `${fmt(v)}\n${fmt(w)}`, `${fmt(w)}\n${fmt(v)}`, `${fmt(arr(r, 1000, 0, 1))}\n${fmt(arr(r, 1000, 0, 1))}`];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const A = a.slice(1, n + 1); const B = a.slice(n + 2); for (let i = 0; i < Math.min(A.length, B.length); i++) { if (A[i] < B[i]) return 'PIERWSZY'; if (A[i] > B[i]) return 'DRUGI'; } return A.length < B.length ? 'PIERWSZY' : A.length > B.length ? 'DRUGI' : 'ROWNE'; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, m;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    cin >> m;
    vector<int> b(m);
    for (auto &x : b) cin >> x;
    if (a < b) cout << "PIERWSZY\n";
    else if (b < a) cout << "DRUGI\n";
    else cout << "ROWNE\n";
    return 0;
}`,
        },
        {
            id: 'vec-wygladzanie', krok: 3, level: 'srednie',
            title: 'Wygładzanie',
            short: 'k rund: każda liczba staje się średnią swoją i sąsiadów. Nową rundę licz na kopii!',
            tags: ['vector nowy = v', 'v = nowy', 'brzegi'],
            statement: ['Masz rząd n liczb naturalnych. W jednej rundzie wygładzania każda liczba zamienia się na średnią arytmetyczną z siebie i swoich sąsiadów, zaokrągloną w dół (dzielenie całkowite). Liczby na brzegach mają tylko jednego sąsiada, więc ich średnia liczona jest z dwóch liczb, a gdy n = 1 — z jednej. Wszystkie liczby w rundzie zmieniają się jednocześnie, na podstawie wartości sprzed rundy. Wykonaj k rund i wypisz wynik.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n liczb po k rundach.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k ≤ 100', '0 ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5 1\n9 0 0 0 9', note: 'Brzeg: (9 + 0) / 2 = 4. Środek: (0 + 0 + 0) / 3 = 0. Druga liczba: (9 + 0 + 0) / 3 = 3.' }, { input: '4 2\n10 20 30 40' }],
            hint: R`Gdybyś zmieniał vector w miejscu, liczba numer i widziałaby już nową wartość sąsiada i - 1. Dlatego w każdej rundzie twórz vector<int> nowy(n);, licz go wyłącznie ze starego v (sumuj v[i - 1] gdy i > 0, v[i], v[i + 1] gdy i + 1 < n, i dziel przez liczbę zsumowanych), a na końcu rundy zrób v = nowy;.`,
            tests: (r) => ['1 5\n7', '2 3\n0 100', '3 0\n5 6 7', `10 3\n${arr(r, 10, 0, 100).join(' ')}`, `1000 100\n${arr(r, 1000, 0, 1e6).join(' ')}`, `600 50\n${arr(r, 600, 0, 1).map((x) => x * 1000000).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const [n, k] = a; let v = a.slice(2); for (let t = 0; t < k; t++) { const w = v.map((x, i) => { let s = x, c = 1; if (i > 0) { s += v[i - 1]; c++; } if (i + 1 < n) { s += v[i + 1]; c++; } return Math.floor(s / c); }); v = w; } return v.join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    for (int t = 0; t < k; t++) {
        vector<int> nowy(n);
        for (int i = 0; i < n; i++) {
            int s = v[i], c = 1;
            if (i > 0) { s += v[i - 1]; c++; }
            if (i + 1 < n) { s += v[i + 1]; c++; }
            nowy[i] = s / c;
        }
        v = nowy;
    }
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-powrot', krok: 3, level: 'srednie',
            title: 'Powrót do początku',
            short: 'Obracaj vector w lewo o k miejsc, aż znowu będzie taki jak na początku. Ile obrotów?',
            tags: ['kopia start = v', 'porównanie v == start', 'obrót przez nowy vector'],
            statement: ['W jednym obrocie pierwsze k elementów ciągu przechodzi — w tej samej kolejności — na jego koniec. Na przykład obrót ciągu 1 2 3 4 5 o k = 2 daje 3 4 5 1 2. Obracaj ciąg raz za razem. Po ilu obrotach (co najmniej jednym) ciąg po raz pierwszy znowu wygląda dokładnie tak jak na początku?'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb ciągu.'],
            output_format: ['Jedna liczba — po ilu obrotach ciąg wraca do początkowego wyglądu.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 10⁹', '1 ≤ każda liczba ≤ 9'],
            examples: [{ input: '5 2\n1 2 3 4 5', note: 'Dopiero po 5 obrotach o 2 każdy element wraca na swoje miejsce.' }, { input: '6 2\n1 2 1 2 1 2', note: 'Już po jednym obrocie ciąg wygląda tak samo.' }],
            hint: R`Zapamiętaj kopię początku: vector<int> start = v;. Obrót najłatwiej zbudować w nowym vectorze: element numer i trafia z pozycji (i + k) % n. Po każdym obrocie sprawdzaj v == start. Duże k zmniejsz od razu: k % n daje ten sam obrót. Odpowiedź nigdy nie przekracza n.`,
            tests: (r) => ['1 1\n5', '4 4\n1 2 3 4', '4 1000000000\n1 2 3 4', '6 4\n1 2 3 4 5 6', `12 3\n${'1 2 3 '.repeat(4).trim()}`, `1000 999\n${arr(r, 1000, 1, 9).join(' ')}`, `1000 400\n${arr(r, 1000, 1, 9).join(' ')}`, `1000 7\n${'4 '.repeat(1000).trim()}`, `997 123456789\n${arr(r, 997, 1, 2).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const k = a[1] % n; const s = a.slice(2); let v = s.slice(); for (let t = 1; ; t++) { v = v.map((_, i) => v[(i + k) % n]); if (v.every((x, i) => x === s[i])) return String(t); } },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    k %= n;
    vector<int> start = v;
    int obroty = 0;
    do {
        vector<int> nowy(n);
        for (int i = 0; i < n; i++) nowy[i] = v[(i + k) % n];
        v = nowy;
        obroty++;
    } while (v != start);
    cout << obroty << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · iteratory
        {
            id: 'vec-usun-element', krok: 4, level: 'latwe',
            title: 'Usuń jeden element',
            short: 'Usuń z vectora element stojący na miejscu p. Przyda się v.erase(v.begin() + …).',
            tags: ['erase', 'v.begin() + k', 'miejsca od 1'],
            statement: ['Wczytaj n liczb do vectora, a potem liczbę p. Usuń z vectora element stojący na miejscu p (miejsca liczymy od 1) i wypisz pozostałe elementy. Jeśli vector zrobił się pusty, wypisz PUSTO.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.', 'W trzecim wierszu liczba p.'],
            output_format: ['Jeden wiersz: elementy po usunięciu albo PUSTO.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ p ≤ n', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n1 2 3 4 5 6\n3', note: 'Miejsce 3 to pudełko numer 2 — znika liczba 3.' }, { input: '1\n9\n1' }],
            hint: R`Miejsce p to pudełko p - 1, a strzałka na nie to v.begin() + (p - 1). Usuwasz jedną linijką: v.erase(v.begin() + p - 1);. Potem wypisz vector pętlą — albo PUSTO, gdy v.empty().`,
            check: (inp) => { const a = nums(inp); return a[a.length - 1] >= 1 && a[a.length - 1] <= a[0] ? null : 'zle p'; },
            tests: (r) => ['3\n1 2 3\n1', '3\n1 2 3\n3', `10\n${arr(r, 10, -9, 9).join(' ')}\n${r.int(1, 10)}`, `1000\n${arr(r, 1000, -1e9, 1e9).join(' ')}\n${r.int(1, 1000)}`, `1000\n${arr(r, 1000, 0, 5).join(' ')}\n1000`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = a.slice(1, n + 1); v.splice(a[n + 1] - 1, 1); return lista(v); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int p;
    cin >> p;
    v.erase(v.begin() + p - 1);
    if (v.empty()) cout << "PUSTO";
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-wstaw-element', krok: 4, level: 'latwe',
            title: 'Wstaw element',
            short: 'Wstaw liczbę x tak, żeby stała na miejscu p. Przyda się v.insert(v.begin() + …, x).',
            tags: ['insert', 'v.begin() + k', 'v.end() to koniec'],
            statement: ['Wczytaj n liczb do vectora, a potem liczby p i x. Wstaw x do vectora tak, aby stała na miejscu p (miejsca liczymy od 1). Elementy, które stały na miejscach od p dalej, przesuwają się o jedno w prawo. Gdy p = n + 1, x trafia na sam koniec. Wypisz vector po wstawieniu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.', 'W trzecim wierszu liczby p i x.'],
            output_format: ['Jeden wiersz: n + 1 liczb.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ p ≤ n + 1', '−10⁹ ≤ x, każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1 2 3\n2 9', note: '9 staje na miejscu 2, a 2 i 3 przesuwają się w prawo.' }, { input: '3\n1 2 3\n4 9', note: 'p = n + 1 — dopisanie na koniec.' }],
            hint: R`v.insert(v.begin() + p - 1, x); wstawia x przed pudełko numer p - 1, czyli tak, że x dostaje numer p - 1 (miejsce p). Dla p = n + 1 strzałka to v.end() — wstawienie przed end() to dopisanie na koniec.`,
            check: (inp) => { const a = nums(inp); const n = a[0]; const p = a[n + 1]; return p >= 1 && p <= n + 1 ? null : 'zle p'; },
            tests: (r) => ['1\n5\n1 4', '1\n5\n2 6', `10\n${arr(r, 10, -9, 9).join(' ')}\n${r.int(1, 11)} ${r.int(-9, 9)}`, `1000\n${arr(r, 1000, -1e9, 1e9).join(' ')}\n${r.int(1, 1001)} ${r.int(-1e9, 1e9)}`, `1000\n${arr(r, 1000, 0, 5).join(' ')}\n1 -1`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = a.slice(1, n + 1); v.splice(a[n + 1] - 1, 0, a[n + 2]); return v.join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int p, x;
    cin >> p >> x;
    v.insert(v.begin() + p - 1, x);
    for (auto y : v) cout << y << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-mediana', krok: 4, level: 'latwe',
            title: 'Najmniejsza, środkowa, największa',
            short: 'Posortuj vector przez sort(v.begin(), v.end()) i odczytaj minimum, medianę i maksimum.',
            tags: ['sort(v.begin(), v.end())', 'mediana', 'v.front() i v.back()'],
            statement: ['Wczytaj nieparzystą liczbę n i n liczb całkowitych. Wypisz najmniejszą z nich, medianę i największą. Mediana to liczba, która po ułożeniu wszystkich liczb rosnąco stoi dokładnie w środku.'],
            input_format: ['W pierwszym wierszu nieparzysta liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy liczby: najmniejsza, mediana, największa.'],
            constraints: ['1 ≤ n ≤ 999, n jest nieparzyste', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n7 1 9 3 3', note: 'Po posortowaniu: 1 3 3 7 9. Środkowa liczba to 3.' }],
            hint: R`sort(v.begin(), v.end()); układa vector rosnąco. Potem najmniejsza to v[0] (v.front()), największa to v.back(), a mediana stoi w pudełku n / 2.`,
            check: (inp) => (nums(inp)[0] % 2 === 1 ? null : 'n parzyste'),
            tests: (r) => ['1\n-4', '3\n3 2 1', '7\n5 5 5 5 5 5 5', fmt(arr(r, 11, -9, 9)), fmt(arr(r, 999, -1e9, 1e9)), fmt(arr(r, 501, 0, 3))],
            solve: (inp) => { const v = nums(inp).slice(1).sort((a, b) => a - b); return `${v[0]} ${v[(v.length - 1) / 2]} ${v[v.length - 1]}`; },
            cpp: R`
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    cout << v.front() << " " << v[n / 2] << " " << v.back() << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-gdzie-maksimum', krok: 4, level: 'latwe',
            title: 'Gdzie jest maksimum?',
            short: 'max_element, min_element i count: wartość, pierwsze miejsce i liczba wystąpień.',
            tags: ['*max_element', 'max_element(…) - v.begin()', 'count'],
            statement: ['Wczytaj n liczb całkowitych. W pierwszym wierszu wypisz trzy liczby: największą wartość, miejsce jej pierwszego wystąpienia (miejsca liczymy od 1) i to, ile razy występuje. W drugim wierszu wypisz to samo dla najmniejszej wartości.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze po trzy liczby: wartość, miejsce pierwszego wystąpienia, liczba wystąpień.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n6 2 9 9 1 2', note: 'Maksimum 9 pierwszy raz stoi na miejscu 3 i występuje dwa razy. Minimum 1 stoi na miejscu 5.' }],
            hint: R`auto it = max_element(v.begin(), v.end()); to strzałka na pierwsze maksimum: *it to jego wartość, a it - v.begin() to numer pudełka (miejsce to o 1 więcej). Liczbę wystąpień daje count(v.begin(), v.end(), *it). Dla minimum tak samo z min_element.`,
            tests: (r) => ['1\n5', '4\n3 3 3 3', '5\n-1 -5 -1 -5 0', fmt(arr(r, 20, -3, 3)), fmt(arr(r, 1000, -1e9, 1e9)), fmt(arr(r, 1000, 0, 9))],
            solve: (inp) => { const v = nums(inp).slice(1); const f = (w) => `${w} ${v.indexOf(w) + 1} ${v.filter((x) => x === w).length}`; return `${f(Math.max(...v))}\n${f(Math.min(...v))}`; },
            cpp: R`
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    auto mx = max_element(v.begin(), v.end());
    cout << *mx << " " << mx - v.begin() + 1 << " " << count(v.begin(), v.end(), *mx) << "\n";
    auto mn = min_element(v.begin(), v.end());
    cout << *mn << " " << mn - v.begin() + 1 << " " << count(v.begin(), v.end(), *mn) << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-szukanie', krok: 4, level: 'latwe',
            title: 'Szukanie',
            short: 'Dla każdego zapytania: na którym miejscu pierwszy raz stoi x i ile razy występuje? find i count.',
            tags: ['find', 'it == v.end()', 'count'],
            statement: ['Wczytaj n liczb, a potem q zapytań. Każde zapytanie to liczba x. Dla każdego zapytania wypisz w osobnym wierszu dwie liczby: miejsce pierwszego wystąpienia x w ciągu (miejsca liczymy od 1) i liczbę wystąpień x. Jeśli x nie występuje, wypisz -1 0.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb.', 'W trzecim wierszu liczba q, w czwartym q liczb x.'],
            output_format: ['q wierszy, w każdym dwie liczby.'],
            constraints: ['1 ≤ n, q ≤ 1000', '−1000 ≤ liczby i x ≤ 1000'],
            examples: [{ input: '6\n4 8 15 16 8 42\n3\n8 23 42' }],
            hint: R`auto it = find(v.begin(), v.end(), x); — jeśli it == v.end(), liczby nie ma. W przeciwnym razie miejsce to it - v.begin() + 1. Liczbę wystąpień daje count(v.begin(), v.end(), x).`,
            tests: (r) => ['1\n5\n2\n5 6', '3\n1 1 1\n1\n1', `20\n${arr(r, 20, -5, 5).join(' ')}\n10\n${arr(r, 10, -7, 7).join(' ')}`, `1000\n${arr(r, 1000, -1000, 1000).join(' ')}\n1000\n${arr(r, 1000, -1000, 1000).join(' ')}`, `1000\n${arr(r, 1000, 0, 9).join(' ')}\n12\n${arr(r, 12, -1, 10).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = a.slice(1, n + 1); const q = a[n + 1]; return a.slice(n + 2, n + 2 + q).map((x) => { const i = v.indexOf(x); return i < 0 ? '-1 0' : `${i + 1} ${v.filter((y) => y === x).length}`; }).join('\n'); },
            cpp: R`
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int x;
        cin >> x;
        auto it = find(v.begin(), v.end(), x);
        if (it == v.end()) cout << "-1 0\n";
        else cout << it - v.begin() + 1 << " " << count(v.begin(), v.end(), x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-podium', krok: 4, level: 'latwe',
            title: 'Podium',
            short: 'Wypisz k największych wyników od najlepszego. sort, a potem reverse — albo pętla od końca.',
            tags: ['sort', 'reverse', 'k pierwszych'],
            statement: ['W zawodach n zawodników zdobyło punkty. Wypisz k najlepszych wyników od największego do najmniejszego. Jeśli kilku zawodników ma ten sam wynik, wynik pojawia się tyle razy, ilu ich jest.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — wyniki zawodników.'],
            output_format: ['Jeden wiersz: k liczb od największej.'],
            constraints: ['1 ≤ k ≤ n ≤ 1000', '0 ≤ każdy wynik ≤ 10⁹'],
            examples: [{ input: '6 3\n50 90 70 90 10 80', note: 'Dwa razy 90, a potem 80.' }],
            hint: R`sort(v.begin(), v.end()); ułoży wyniki rosnąco, a reverse(v.begin(), v.end()); odwróci je na malejąco. Wtedy k najlepszych to v[0] … v[k - 1].`,
            check: (inp) => { const [n, k] = nums(inp); return k >= 1 && k <= n ? null : 'zle k'; },
            tests: (r) => ['1 1\n0', '4 4\n1 2 3 4', `10 3\n${arr(r, 10, 0, 100).join(' ')}`, `1000 1000\n${arr(r, 1000, 0, 1e9).join(' ')}`, `1000 10\n${arr(r, 1000, 0, 5).join(' ')}`],
            solve: (inp) => { const a = nums(inp); return a.slice(2).sort((x, y) => y - x).slice(0, a[1]).join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    reverse(v.begin(), v.end());
    for (int i = 0; i < k; i++) cout << v[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-odwracanie-kawalkow', krok: 4, level: 'srednie',
            title: 'Odwracanie kawałków',
            short: 'q razy odwróć kawałek ciągu od miejsca a do miejsca b. Uważaj na drugą strzałkę: + 1!',
            tags: ['reverse na kawałku', 'v.begin() + a - 1', '[od, do)'],
            statement: ['Wczytaj ciąg n liczb. Potem wykonaj po kolei q operacji. Każda operacja to dwie liczby a i b (a ≤ b, miejsca liczymy od 1) i oznacza: odwróć kolejność elementów stojących na miejscach od a do b włącznie. Wypisz ciąg po wszystkich operacjach.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb.', 'W trzecim wierszu liczba q, a w kolejnych q wierszach liczby a i b.'],
            output_format: ['Jeden wiersz: ciąg po wszystkich operacjach.'],
            constraints: ['1 ≤ n, q ≤ 1000', '1 ≤ a ≤ b ≤ n', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n1 2 3 4 5 6\n2\n2 4\n1 6', note: 'Po pierwszej operacji: 1 4 3 2 5 6. Po drugiej (cały ciąg): 6 5 2 3 4 1.' }],
            hint: R`Miejsca od a do b to pudełka od a - 1 do b - 1. Pierwsza strzałka to v.begin() + a - 1, a druga musi pokazywać pudełko ZA ostatnim odwracanym: v.begin() + b. Razem: reverse(v.begin() + a - 1, v.begin() + b);.`,
            check: (inp) => { const a = nums(inp); const n = a[0]; const q = a[n + 1]; for (let i = 0; i < q; i++) { const x = a[n + 2 + 2 * i], y = a[n + 3 + 2 * i]; if (!(x >= 1 && x <= y && y <= n)) return 'zle a b'; } return null; },
            tests: (r) => {
                const t = (n, q) => { const ops = Array.from({ length: q }, () => { const x = r.int(1, n), y = r.int(1, n); return `${Math.min(x, y)} ${Math.max(x, y)}`; }); return `${fmt(arr(r, n, -1e9, 1e9))}\n${q}\n${ops.join('\n')}`; };
                return ['1\n5\n1\n1 1', '3\n1 2 3\n1\n1 3', '4\n1 2 3 4\n2\n1 2\n3 4', t(10, 5), t(1000, 1000), t(1000, 1)];
            },
            solve: (inp) => { const a = nums(inp); const n = a[0]; const v = a.slice(1, n + 1); const q = a[n + 1]; for (let i = 0; i < q; i++) { let x = a[n + 2 + 2 * i] - 1, y = a[n + 3 + 2 * i] - 1; while (x < y) { [v[x], v[y]] = [v[y], v[x]]; x++; y--; } } return v.join(' '); },
            cpp: R`
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int a, b;
        cin >> a >> b;
        reverse(v.begin() + a - 1, v.begin() + b);
    }
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-usun-wszystkie', krok: 4, level: 'srednie',
            title: 'Usuń wszystkie x',
            short: 'Usuń z ciągu wszystkie wystąpienia liczby x. Pułapka: erase w pętli przeskakuje sąsiada!',
            tags: ['nowy vector z elementów, które zostają', 'erase w pętli — pułapka', 'count'],
            statement: ['Wczytaj ciąg n liczb i liczbę x. Usuń z ciągu wszystkie wystąpienia x, zachowując kolejność pozostałych elementów. W pierwszym wierszu wypisz, ile elementów usunięto, a w drugim — ciąg po usunięciu albo PUSTO, jeśli nic nie zostało.'],
            input_format: ['W pierwszym wierszu liczby n i x.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: liczba usuniętych i ciąg po usunięciu (albo PUSTO).'],
            constraints: ['1 ≤ n ≤ 1000', '−1000 ≤ x, każda liczba ≤ 1000'],
            examples: [{ input: '5 2\n1 2 2 3 2', note: 'Dwie dwójki stoją obok siebie — prosta pętla z erase i i++ jedną z nich przeskoczy.' }, { input: '3 7\n7 7 7' }],
            hint: R`Najprościej zbudować nowy vector: for (auto y : v) if (y != x) zostaja.push_back(y);. Liczba usuniętych to v.size() - zostaja.size() albo count(v.begin(), v.end(), x). Jeśli chcesz użyć erase w pętli po indeksach, po usunięciu nie zwiększaj i — na to miejsce właśnie wskoczył następny element.`,
            tests: (r) => ['1 5\n5', '1 5\n4', '6 0\n0 0 1 0 0 1', `20 1\n${arr(r, 20, 0, 2).join(' ')}`, `1000 3\n${arr(r, 1000, 0, 5).join(' ')}`, `1000 -1000\n${arr(r, 1000, -1000, 1000).join(' ')}`, `1000 9\n${'9 '.repeat(999)}8`],
            solve: (inp) => { const a = nums(inp); const x = a[1]; const v = a.slice(2); const w = v.filter((y) => y !== x); return `${v.length - w.length}\n${lista(w)}`; },
            cpp: R`
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, x;
    cin >> n >> x;
    vector<int> v(n);
    for (auto &y : v) cin >> y;
    vector<int> zostaja;
    for (auto y : v) if (y != x) zostaja.push_back(y);
    cout << v.size() - zostaja.size() << "\n";
    if (zostaja.empty()) cout << "PUSTO";
    for (auto y : zostaja) cout << y << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-edytor', krok: 4, level: 'srednie',
            title: 'Edytor ciągu',
            short: 'Polecenia WSTAW p x, USUN p i WYPISZ na żywym vectorze. insert i erase w praktyce.',
            tags: ['insert', 'erase', 'polecenia tekstowe'],
            statement: ['Edytor trzyma ciąg liczb (na początku n liczb z wejścia) i wykonuje q poleceń. Miejsca liczymy od 1.', '• WSTAW p x — wstaw x tak, by stała na miejscu p (1 ≤ p ≤ długość ciągu + 1),', '• USUN p — usuń element z miejsca p (ciąg nie jest wtedy pusty),', '• WYPISZ — wypisz cały ciąg w jednym wierszu albo PUSTO, jeśli jest pusty.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb.', 'W trzecim wierszu liczba q, a w kolejnych q wierszach polecenia.'],
            output_format: ['Po jednym wierszu dla każdego polecenia WYPISZ.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ q ≤ 300', 'Polecenie WYPISZ pojawia się od 1 do 10 razy.', '1 ≤ liczby w ciągu i x ≤ 999'],
            examples: [{ input: '3\n10 20 30\n5\nWSTAW 1 5\nUSUN 3\nWYPISZ\nWSTAW 4 99\nWYPISZ', note: 'Po WSTAW 1 5: 5 10 20 30. Po USUN 3: 5 10 30.' }],
            hint: R`Trzymaj ciąg w vector<int> v. WSTAW p x to v.insert(v.begin() + p - 1, x);, USUN p to v.erase(v.begin() + p - 1);. Polecenie wczytuj do string i sprawdzaj ==; liczby p i x wczytuj dopiero, gdy wiesz, które to polecenie.`,
            check: (inp) => {
                const t = toks(inp); const n = +t[0]; const v = t.slice(1, n + 1); const q = +t[n + 1]; let i = n + 2, wyp = 0;
                for (let k = 0; k < q; k++) { const c = t[i++]; if (c === 'WSTAW') { const p = +t[i++]; i++; if (p < 1 || p > v.length + 1) return 'zle p'; v.splice(p - 1, 0, 0); } else if (c === 'USUN') { const p = +t[i++]; if (p < 1 || p > v.length) return 'zle p'; v.splice(p - 1, 1); } else wyp++; }
                return wyp >= 1 && wyp <= 10 && q <= 300 ? null : 'WYPISZ';
            },
            tests: (r) => {
                const t = (n, q, pw) => {
                    let len = n; const ops = []; let wyp = 0;
                    for (let k = 0; k < q - 1; k++) {
                        const u = r();
                        if (u < 0.03 && wyp < 9) { ops.push('WYPISZ'); wyp++; } else if (u < pw || len === 0) { ops.push(`WSTAW ${r.int(1, len + 1)} ${r.int(1, 999)}`); len++; } else { ops.push(`USUN ${r.int(1, len)}`); len--; }
                    }
                    ops.push('WYPISZ');
                    return `${fmt(arr(r, n, 1, 999))}\n${q}\n${ops.join('\n')}`;
                };
                return ['1\n5\n2\nUSUN 1\nWYPISZ', '2\n1 2\n3\nWSTAW 3 3\nWSTAW 1 7\nWYPISZ', t(10, 30, 0.5), t(100, 300, 0.7), t(100, 300, 0.3), t(5, 300, 0.5)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = +t[0]; const v = t.slice(1, n + 1); const q = +t[n + 1]; let i = n + 2; const out = [];
                for (let k = 0; k < q; k++) { const c = t[i++]; if (c === 'WSTAW') { const p = +t[i++]; const x = t[i++]; v.splice(p - 1, 0, x); } else if (c === 'USUN') { v.splice(+t[i++] - 1, 1); } else out.push(lista(v)); }
                return out.join('\n');
            },
            cpp: R`
#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string c;
        cin >> c;
        if (c == "WSTAW") {
            int p, x;
            cin >> p >> x;
            v.insert(v.begin() + p - 1, x);
        } else if (c == "USUN") {
            int p;
            cin >> p;
            v.erase(v.begin() + p - 1);
        } else {
            if (v.empty()) cout << "PUSTO";
            for (auto x : v) cout << x << " ";
            cout << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
