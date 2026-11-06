// While loop — ćwiczenia w trakcie lekcji, części 1–4: pierwsza pętla, budowa pętli (start, warunek, zmiana),
// licznik i suma, wczytywanie danych w pętli. Uczeń zna typy zmiennych, wejście i wyjście oraz if / else.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki (zadania.html).
module.exports = (h) => {
    const { nums, toks, join, fx, safe } = h;
    const R = String.raw;
    const z2 = (n) => String(n).padStart(2, '0');
    const range = (a, b, k = 1) => { const o = []; if (k > 0) for (let x = a; x <= b; x += k) o.push(x); else for (let x = a; x >= b; x += k) o.push(x); return o; };
    const lista = (n, lo, hi, r) => { const a = r.arr(n, lo, hi); return `${n}\n${a.join(' ')}`; };

    return [
        // ================================================================ KROK 1 · pierwsza pętla
        {
            id: 'wh-od-1-do-n', krok: 1, level: 'latwe',
            title: 'Od 1 do n',
            short: 'Wypisz wszystkie liczby od 1 do n, każdą w osobnym wierszu.',
            tags: ['while', 'licznik i++'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n i wypisz wszystkie liczby całkowite od 1 do n — każdą w osobnym wierszu.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy: liczby 1, 2, …, n.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '5' }, { input: '1' }],
            hint: R`Zmienna i startuje od 1 (int i = 1;), pętla kręci się, dopóki i <= n, a w środku wypisujesz i i zwiększasz je: cout << i << "\n"; i++;. Zapomniane i++ = program, który nigdy się nie kończy.`,
            tests: (r) => ['5', '1', '2', '10', '1000', '999', String(r.int(3, 100)), String(r.int(100, 1000))],
            solve: (inp) => range(1, nums(inp)[0]).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        cout << i << "\n";
        i++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-n-razy', krok: 1, level: 'latwe',
            title: 'Hura n razy',
            short: 'Wypisz słowo Hura! dokładnie n razy.',
            tags: ['while', 'powtórz n razy'],
            statement: ['Drużyna wygrała mecz, a kibice krzyczą „Hura!” tyle razy, ile bramek strzelili ich zawodnicy. Wczytaj liczbę bramek n i wypisz słowo Hura! dokładnie n razy, każde w osobnym wierszu.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy, w każdym Hura!'],
            constraints: ['1 ≤ n ≤ 100'],
            examples: [{ input: '3' }],
            hint: R`Pętla, która ma wykonać się n razy: int i = 0; while (i < n) { … i++; }. Licznik i nie musi być wypisywany — służy tylko do liczenia obrotów. Zwróć uwagę: start od 0 i warunek i < n, albo start od 1 i warunek i <= n — oba dają n obrotów.`,
            tests: (r) => ['3', '1', '2', '100', String(r.int(4, 99))],
            solve: (inp) => Array(nums(inp)[0]).fill('Hura!').join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int i = 0;
    while (i < n) {
        cout << "Hura!\n";
        i++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-odliczanie', krok: 1, level: 'latwe',
            title: 'Odliczanie do startu',
            short: 'Odlicz od n do 1 w jednym wierszu, a w następnym wypisz Start!',
            tags: ['while', 'i--'],
            statement: ['Rakieta startuje po odliczaniu. Wczytaj liczbę n i wypisz w pierwszym wierszu liczby od n w dół do 1, oddzielone spacjami. W drugim wierszu wypisz Start!'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: odliczanie i napis Start!'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '5' }],
            hint: R`Tym razem zmienna startuje od n i maleje: while (n > 0) { cout << n << " "; n--; }. Po pętli przejdź do nowego wiersza i wypisz Start!. Spacja po ostatniej liczbie nie przeszkadza — sprawdzarka ignoruje spacje na końcu wiersza.`,
            tests: (r) => ['5', '1', '2', '10', '1000', String(r.int(3, 999))],
            solve: (inp) => join(range(nums(inp)[0], 1, -1).join(' '), 'Start!'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    while (n > 0) {
        cout << n << " ";
        n--;
    }
    cout << "\nStart!\n";
    return 0;
}`,
        },
        {
            id: 'wh-od-a-do-b', krok: 1, level: 'latwe',
            title: 'Od a do b',
            short: 'Wypisz wszystkie liczby całkowite od a do b — także ujemne.',
            tags: ['while', 'start od a'],
            statement: ['Wczytaj dwie liczby całkowite a i b, przy czym a ≤ b. Wypisz w jednym wierszu wszystkie liczby całkowite od a do b włącznie, oddzielone spacjami.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jeden wiersz z liczbami a, a + 1, …, b.'],
            constraints: ['−1000 ≤ a ≤ b ≤ 1000'],
            examples: [{ input: '3 7' }, { input: '-2 2' }],
            hint: R`Licznik nie musi startować od 1. Utwórz int i = a; i kręć pętlą, dopóki i <= b. Liczby ujemne działają tak samo: od −2 przez −1, 0, 1 do 2.`,
            tests: (r) => ['3 7', '-2 2', '5 5', '-1000 1000', '-10 -3', '0 0', `${r.int(-500, 0)} ${r.int(1, 500)}`, `${r.int(-900, -800)} ${r.int(-700, -600)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); return range(a, b).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int i = a;
    while (i <= b) {
        cout << i << " ";
        i++;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-kwadraty', krok: 1, level: 'latwe',
            title: 'Tabela kwadratów',
            short: 'Dla każdej liczby od 1 do n wypisz ją i jej kwadrat.',
            tags: ['while', 'działania na liczniku'],
            statement: ['Wczytaj n. Dla każdej liczby i od 1 do n wypisz w osobnym wierszu dwie liczby: i oraz i · i (kwadrat liczby i), oddzielone spacją.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy, w każdym liczba i jej kwadrat.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '4' }],
            hint: R`To ta sama pętla co od 1 do n — tylko wypisujesz więcej: cout << i << " " << i * i << "\n";. Licznika pętli możesz używać w obliczeniach jak każdej innej zmiennej.`,
            tests: (r) => ['4', '1', '2', '1000', String(r.int(5, 999))],
            solve: (inp) => range(1, nums(inp)[0]).map((i) => `${i} ${i * i}`).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        cout << i << " " << i * i << "\n";
        i++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-tabliczka', krok: 1, level: 'latwe',
            title: 'Tabliczka mnożenia przez k',
            short: 'Wypisz dziesięć wierszy w stylu 7 x 3 = 21.',
            tags: ['while', 'formatowanie'],
            statement: ['Wczytaj liczbę k i wypisz jej tabliczkę mnożenia: dziesięć wierszy w postaci k x i = wynik dla i od 1 do 10. Między elementami stoją pojedyncze spacje, a znakiem mnożenia jest mała litera x.'],
            input_format: ['Jedna liczba całkowita k.'],
            output_format: ['Dziesięć wierszy, jak w przykładzie.'],
            constraints: ['1 ≤ k ≤ 1000'],
            examples: [{ input: '7' }],
            hint: R`Licznik i biegnie od 1 do 10, a k się nie zmienia. W pętli: cout << k << " x " << i << " = " << k * i << "\n";. Uważaj na spacje wokół x i =.`,
            tests: (r) => ['7', '1', '10', '1000', String(r.int(2, 99)), String(r.int(100, 999))],
            solve: (inp) => { const k = nums(inp)[0]; return range(1, 10).map((i) => `${k} x ${i} = ${k * i}`).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int k;
    cin >> k;
    int i = 1;
    while (i <= 10) {
        cout << k << " x " << i << " = " << k * i << "\n";
        i++;
    }
    return 0;
}`,
        },
        {
            id: 'wh-w-obie-strony', krok: 1, level: 'srednie',
            title: 'W górę albo w dół',
            short: 'Idź od a do b — rosnąco albo malejąco, zależnie od tego, która liczba jest większa.',
            tags: ['while', 'if … else', 'dwie pętle'],
            statement: ['Wczytaj dwie liczby całkowite a i b. Wypisz w jednym wierszu wszystkie liczby od a do b włącznie, oddzielone spacjami: rosnąco, jeśli a ≤ b, a malejąco, jeśli a > b.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jeden wiersz z liczbami od a do b.'],
            constraints: ['−1000 ≤ a, b ≤ 1000'],
            examples: [{ input: '2 6' }, { input: '6 2' }],
            hint: R`Najpierw if (a <= b), a w każdej gałęzi osobna pętla: w pierwszej i++ i warunek i <= b, w drugiej i-- i warunek i >= b. Pętla może stać w klamrach if tak samo jak każda inna instrukcja.`,
            tests: (r) => ['2 6', '6 2', '4 4', '-3 3', '3 -3', '1000 -1000', '-1000 1000', `${r.int(-50, 50)} ${r.int(-50, 50)}`, `${r.int(100, 900)} ${r.int(-900, 0)}`],
            solve: (inp) => { const [a, b] = nums(inp); return (a <= b ? range(a, b) : range(a, b, -1)).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int i = a;
    if (a <= b) {
        while (i <= b) {
            cout << i << " ";
            i++;
        }
    } else {
        while (i >= b) {
            cout << i << " ";
            i--;
        }
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · budowa pętli
        {
            id: 'wh-parzyste', krok: 2, level: 'latwe',
            title: 'Liczby parzyste do n',
            short: 'Wypisz 2, 4, 6, … aż do n — licznik rośnie o 2.',
            tags: ['while', 'i += 2'],
            statement: ['Wczytaj n i wypisz w jednym wierszu wszystkie dodatnie liczby parzyste, które nie są większe od n, oddzielone spacjami.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz: 2 4 6 … (ostatnia liczba to n albo n − 1).'],
            constraints: ['2 ≤ n ≤ 1000'],
            examples: [{ input: '10' }, { input: '9' }],
            hint: R`Nie potrzebujesz if! Zacznij od i = 2 i zwiększaj o 2: i += 2;. Warunek i <= n sam zatrzyma pętlę we właściwym miejscu, także dla nieparzystego n.`,
            tests: (r) => ['10', '9', '2', '3', '1000', '999', String(r.int(4, 500))],
            solve: (inp) => range(2, nums(inp)[0], 2).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int i = 2;
    while (i <= n) {
        cout << i << " ";
        i += 2;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-co-k', krok: 2, level: 'latwe',
            title: 'Co k kroków',
            short: 'Wypisz 0, k, 2k, 3k, … dopóki liczba nie przekroczy n.',
            tags: ['while', 'i += k'],
            statement: ['Wczytaj liczby n i k. Wypisz w jednym wierszu liczby 0, k, 2k, 3k, … — wszystkie, które nie są większe od n.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz z liczbami oddzielonymi spacjami.'],
            constraints: ['0 ≤ n ≤ 10 000', '1 ≤ k ≤ 10 000'],
            examples: [{ input: '20 5' }, { input: '17 4' }],
            hint: R`Start: int x = 0;, warunek: x <= n, zmiana: x += k;. To ta sama pętla co zawsze, tylko krok jest inny niż 1.`,
            tests: (r) => ['20 5', '17 4', '0 3', '5 10', '10000 1', '10000 10000', '9999 10000', `${r.int(100, 10000)} ${r.int(7, 300)}`],
            solve: (inp) => { const [n, k] = nums(inp); return range(0, n, k).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int x = 0;
    while (x <= n) {
        cout << x << " ";
        x += k;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-potegi-dwojki', krok: 2, level: 'latwe',
            title: 'Potęgi dwójki',
            short: 'Wypisz 1, 2, 4, 8, … — wszystkie potęgi dwójki nie większe od n.',
            tags: ['while', 'p *= 2'],
            statement: ['Wczytaj n i wypisz w jednym wierszu wszystkie potęgi dwójki (1, 2, 4, 8, 16, …), które nie są większe od n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z potęgami dwójki oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 10⁹'],
            examples: [{ input: '20' }, { input: '64' }],
            hint: R`Zmiana w pętli nie musi być dodawaniem. Start: p = 1, warunek: p <= n, zmiana: p *= 2;. Największa potęga, jaka się pojawi, to 2³⁰ — mieści się w int.`,
            tests: (r) => ['20', '64', '1', '2', '3', '1000000000', '536870912', '536870911', String(r.int(1000, 1e9))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let p = 1; p <= n; p *= 2) o.push(p); return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int p = 1;
    while (p <= n) {
        cout << p << " ";
        p *= 2;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-rakieta-co-k', krok: 2, level: 'latwe',
            title: 'Schodzenie co k pięter',
            short: 'Winda zjeżdża z piętra n co k pięter — wypisz piętra, na których się zatrzyma.',
            tags: ['while', 'i -= k'],
            statement: ['Winda towarowa stoi na piętrze n i zjeżdża w dół, za każdym razem o k pięter. Zatrzymuje się na każdym piętrze, na które dojedzie, dopóki jest to piętro powyżej parteru (piętro większe od 0).', 'Wypisz w jednym wierszu numery wszystkich pięter, na których stoi winda, zaczynając od n.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz: n, n − k, n − 2k, … (tylko liczby większe od 0).'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ k ≤ 10 000'],
            examples: [{ input: '20 6' }, { input: '9 3' }],
            hint: R`Start: p = n, warunek: p > 0, zmiana: p -= k;. Dla 9 3 winda staje na 9, 6 i 3 — kolejny krok dałby 0, a to już nie jest piętro powyżej parteru.`,
            tests: (r) => ['20 6', '9 3', '1 1', '5 10', '10000 1', '10000 9999', `${r.int(100, 10000)} ${r.int(3, 200)}`],
            solve: (inp) => { const [n, k] = nums(inp); return range(n, 1, -k).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int p = n;
    while (p > 0) {
        cout << p << " ";
        p -= k;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-nieparzyste-w-dol', krok: 2, level: 'srednie',
            title: 'Nieparzyste w dół',
            short: 'Wypisz nieparzyste liczby od n w dół do 1 — najpierw ustal, od czego zacząć.',
            tags: ['while', 'if przed pętlą', 'i -= 2'],
            statement: ['Wczytaj n i wypisz w jednym wierszu wszystkie dodatnie liczby nieparzyste nie większe od n — od największej do najmniejszej.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z liczbami nieparzystymi w kolejności malejącej.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '9' }, { input: '10' }],
            hint: R`Najpierw ustal start: jeśli n jest parzyste, zacznij od n − 1, a jeśli nieparzyste — od n. To zwykły if przed pętlą. Potem pętla z krokiem −2, dopóki liczba jest większa od 0.`,
            tests: (r) => ['9', '10', '1', '2', '3', '10000', '9999', String(r.int(4, 5000))],
            solve: (inp) => { const n = nums(inp)[0]; return range(n % 2 ? n : n - 1, 1, -2).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int x = n;
    if (x % 2 == 0) {
        x--;
    }
    while (x > 0) {
        cout << x << " ";
        x -= 2;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-ciag-arytmetyczny', krok: 2, level: 'srednie',
            title: 'Pierwsze n wyrazów ciągu',
            short: 'Wypisz a, a + r, a + 2r, … — dokładnie n liczb. Krok może być ujemny.',
            tags: ['while', 'licznik obrotów', 'dwie zmienne'],
            statement: ['Wczytaj trzy liczby całkowite: n, a i r. Wypisz w jednym wierszu n pierwszych wyrazów ciągu, który zaczyna się od a, a każdy kolejny wyraz jest o r większy od poprzedniego: a, a + r, a + 2r, …', 'Liczba r może być ujemna albo równa zero.'],
            input_format: ['Jeden wiersz z liczbami n, a i r.'],
            output_format: ['Jeden wiersz z n liczbami.'],
            constraints: ['1 ≤ n ≤ 1000', '−10 000 ≤ a, r ≤ 10 000'],
            examples: [{ input: '5 3 4' }, { input: '4 10 -3' }],
            hint: R`Tu warunek pętli nie może zależeć od wartości wyrazu (r może być ujemne albo zerowe!). Potrzebujesz dwóch zmiennych: licznika obrotów i (od 0 do n − 1) oraz bieżącego wyrazu x. W każdym obrocie wypisz x, potem x += r; i i++;.`,
            tests: (r) => ['5 3 4', '4 10 -3', '1 7 100', '6 5 0', '1000 -10000 10000', '1000 10000 -10000', `${r.int(2, 50)} ${r.int(-100, 100)} ${r.int(-20, 20)}`],
            solve: (inp) => { const [n, a, d] = nums(inp); return Array.from({ length: n }, (_, i) => a + i * d).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, a, r;
    cin >> n >> a >> r;
    int x = a;
    int i = 0;
    while (i < n) {
        cout << x << " ";
        x += r;
        i++;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-rozklad-autobusu', krok: 2, level: 'srednie',
            title: 'Rozkład jazdy',
            short: 'Autobus odjeżdża co k minut — wypisz wszystkie godziny odjazdów w formacie HH:MM.',
            tags: ['while', 'minuty od północy', 'setw i setfill'],
            statement: ['Pierwszy autobus odjeżdża o godzinie podanej w pierwszym wierszu, ostatni najpóźniej o godzinie z drugiego wiersza, a autobusy jeżdżą co k minut. Wypisz godziny wszystkich odjazdów, każdą w osobnym wierszu, w formacie HH:MM (z zerami z przodu).', 'Ostatni autobus odjeżdża o drugiej podanej godzinie tylko wtedy, gdy wypada to dokładnie co k minut od pierwszego.'],
            input_format: ['W pierwszym wierszu godzina pierwszego odjazdu w formacie HH:MM, w drugim — godzina, po której autobusy już nie jeżdżą (też HH:MM), w trzecim — liczba k.', 'Obie godziny są z tego samego dnia i pierwsza nie jest późniejsza od drugiej.'],
            output_format: ['Godziny odjazdów w formacie HH:MM, każda w osobnym wierszu.'],
            constraints: ['00:00 ≤ godziny ≤ 23:59', '1 ≤ k ≤ 600'],
            examples: [{ input: '06:00\n07:10\n20' }, { input: '23:15\n23:59\n15' }],
            hint: R`Zamień obie godziny na minuty od północy (g * 60 + m) — wtedy pętla to zwykłe x += k, dopóki x <= koniec. Przy wypisywaniu zamień z powrotem: x / 60 i x % 60, z setw(2) i setfill('0'). Godzinę wczytasz tak: cin >> g >> znak >> m;, gdzie znak to char.`,
            tests: (r) => {
                const t = (m) => `${z2(Math.floor(m / 60))}:${z2(m % 60)}`;
                const out = ['06:00\n07:10\n20', '23:15\n23:59\n15', '00:00\n23:59\n60', '12:00\n12:00\n5', '08:05\n08:06\n600', '00:00\n23:59\n1'];
                for (let i = 0; i < 4; i++) { const a = r.int(0, 1439), b = r.int(a, 1439); out.push(`${t(a)}\n${t(b)}\n${r.int(1, 120)}`); }
                return out;
            },
            check: (inp) => { const m = inp.match(/(\d+):(\d+)\s+(\d+):(\d+)/); return +m[1] * 60 + +m[2] <= +m[3] * 60 + +m[4] ? null : 'zła kolejność'; },
            solve: (inp) => {
                const m = inp.match(/(\d+):(\d+)\s+(\d+):(\d+)\s+(\d+)/).slice(1).map(Number);
                const a = m[0] * 60 + m[1], b = m[2] * 60 + m[3];
                return range(a, b, m[4]).map((x) => `${z2(Math.floor(x / 60))}:${z2(x % 60)}`).join('\n');
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int g1, m1, g2, m2, k;
    char znak;
    cin >> g1 >> znak >> m1;
    cin >> g2 >> znak >> m2;
    cin >> k;
    int x = g1 * 60 + m1;
    int koniec = g2 * 60 + m2;
    cout << setfill('0');
    while (x <= koniec) {
        cout << setw(2) << x / 60 << ":" << setw(2) << x % 60 << "\n";
        x += k;
    }
    return 0;
}`,
        },

        // ================================================================ KROK 3 · licznik i suma
        {
            id: 'wh-suma-do-n', krok: 3, level: 'latwe',
            title: 'Suma od 1 do n',
            short: 'Policz 1 + 2 + … + n, dokładając kolejne liczby do sumy.',
            tags: ['while', 'suma += i'],
            statement: ['Wczytaj n i wypisz sumę wszystkich liczb całkowitych od 1 do n, czyli 1 + 2 + 3 + … + n. Policz ją pętlą.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '5', note: '1 + 2 + 3 + 4 + 5 = 15' }, { input: '100' }],
            hint: R`Dwie zmienne: licznik i = 1 i suma = 0 (koniecznie zero!). W każdym obrocie: suma += i; i++;. Wypisz sumę dopiero po pętli — wewnątrz pętli byłaby jeszcze niepełna.`,
            tests: (r) => ['5', '100', '1', '2', '10000', '9999', String(r.int(3, 9998))],
            solve: (inp) => { const n = nums(inp)[0]; return String(n * (n + 1) / 2); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int suma = 0;
    int i = 1;
    while (i <= n) {
        suma += i;
        i++;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-suma-w-przedziale', krok: 3, level: 'latwe',
            title: 'Suma liczb parzystych',
            short: 'Dodaj do siebie tylko liczby parzyste z przedziału od a do b.',
            tags: ['while', 'suma', 'if w pętli'],
            statement: ['Wczytaj dwie liczby całkowite a ≤ b i wypisz sumę wszystkich liczb parzystych z przedziału od a do b (włącznie z końcami). Jeśli w przedziale nie ma żadnej liczby parzystej, suma wynosi 0.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba — suma liczb parzystych.'],
            constraints: ['−10 000 ≤ a ≤ b ≤ 10 000'],
            examples: [{ input: '1 10', note: '2 + 4 + 6 + 8 + 10 = 30' }, { input: '-3 3' }],
            hint: R`Przejdź pętlą po wszystkich liczbach od a do b, a w środku dodaj if: if (i % 2 == 0) { suma += i; }. Pamiętaj, że dla liczb ujemnych sprawdzasz parzystość przez == 0, a nie przez == 1.`,
            tests: (r) => ['1 10', '-3 3', '7 7', '8 8', '-10000 10000', '0 10000', '-9 -1', `${r.int(-5000, 0)} ${r.int(0, 5000)}`, `${r.int(1, 100)} ${r.int(100, 9000)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let s = 0; for (let i = a; i <= b; i++) if (i % 2 === 0) s += i; return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int suma = 0;
    int i = a;
    while (i <= b) {
        if (i % 2 == 0) {
            suma += i;
        }
        i++;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-silnia', krok: 3, level: 'latwe',
            title: 'Silnia',
            short: 'Policz n! = 1 · 2 · … · n. Iloczyn startuje od 1, a nie od 0.',
            tags: ['while', 'iloczyn *=', 'long long'],
            statement: ['Silnia liczby n, zapisywana n!, to iloczyn wszystkich liczb całkowitych od 1 do n, np. 4! = 1 · 2 · 3 · 4 = 24. Przyjmuje się, że 0! = 1.', 'Wczytaj n i wypisz n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — n!.'],
            constraints: ['0 ≤ n ≤ 20'],
            examples: [{ input: '4' }, { input: '20' }],
            hint: R`Iloczyn musi startować od 1 — gdyby startował od 0, wynik zawsze byłby zerem. W pętli: wynik *= i;. Już 13! nie mieści się w int, więc wynik trzymaj w long long. Dla n = 0 pętla nie wykona się ani razu i zostanie 1 — dokładnie tak, jak trzeba.`,
            tests: () => Array.from({ length: 21 }, (_, i) => String(i)),
            solve: (inp) => { const n = nums(inp)[0]; let w = 1n; for (let i = 1n; i <= BigInt(n); i++) w *= i; return String(w); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long wynik = 1;
    int i = 1;
    while (i <= n) {
        wynik *= i;
        i++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-potega', krok: 3, level: 'latwe',
            title: 'Potęga bez pow',
            short: 'Policz aᵇ, mnożąc a przez siebie b razy.',
            tags: ['while', 'iloczyn', 'long long'],
            statement: ['Wczytaj liczby całkowite a i b i wypisz aᵇ, czyli iloczyn b liczb równych a. Przyjmujemy, że a⁰ = 1.', 'Policz to pętlą — bez funkcji pow, która działa na liczbach z przecinkiem i dla dużych wyników potrafi się pomylić.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba — aᵇ.'],
            constraints: ['−10 ≤ a ≤ 10', '0 ≤ b ≤ 60', 'wynik mieści się w przedziale od −10¹⁸ do 10¹⁸'],
            examples: [{ input: '2 10' }, { input: '-3 3' }],
            hint: R`Tak jak silnia: long long wynik = 1;, a potem b razy wynik *= a;. Licznik obrotów jest osobną zmienną (od 0 do b − 1) — samo a się nie zmienia.`,
            tests: (r) => {
                const out = ['2 10', '-3 3', '5 0', '0 0', '0 7', '1 60', '-1 59', '2 59', '-2 59', '10 18', '-10 17', '3 37', '7 21'];
                for (let i = 0; i < 4; i++) { const a = r.int(-9, 9); let b = r.int(0, 15); out.push(`${a} ${b}`); }
                return out;
            },
            check: (inp) => { const [a, b] = nums(inp); const w = BigInt(a) ** BigInt(b); return w <= 10n ** 18n && w >= -(10n ** 18n) ? null : 'za duży wynik'; },
            solve: (inp) => { const [a, b] = nums(inp); return String(BigInt(a) ** BigInt(b)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a;
    int b;
    cin >> a >> b;
    long long wynik = 1;
    int i = 0;
    while (i < b) {
        wynik *= a;
        i++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-dzielniki', krok: 3, level: 'latwe',
            title: 'Wszystkie dzielniki',
            short: 'Wypisz dzielniki liczby n, a w drugim wierszu — ile ich jest.',
            tags: ['while', 'licznik warunkowy', '%'],
            statement: ['Wczytaj liczbę całkowitą dodatnią n. W pierwszym wierszu wypisz wszystkie jej dzielniki w kolejności rosnącej, oddzielone spacjami, a w drugim — liczbę tych dzielników.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: dzielniki i ich liczba.'],
            constraints: ['1 ≤ n ≤ 100 000'],
            examples: [{ input: '12' }, { input: '13' }],
            hint: R`Sprawdź po kolei każdą liczbę d od 1 do n: if (n % d == 0) { wypisz d; ile++; }. To licznik warunkowy — zwiększasz go tylko wtedy, gdy warunek jest spełniony. Licznik ile wypisz dopiero po pętli.`,
            tests: (r) => ['12', '13', '1', '2', '100000', '99991', '65536', '720', '83160', String(r.int(1000, 100000))],
            solve: (inp) => { const n = nums(inp)[0]; const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return join(d.join(' '), String(d.length)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    int d = 1;
    while (d <= n) {
        if (n % d == 0) {
            cout << d << " ";
            ile++;
        }
        d++;
    }
    cout << "\n" << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-trzy-i-piec', krok: 3, level: 'srednie',
            title: 'Wielokrotności 3 lub 5',
            short: 'Zsumuj liczby od 1 do n, które dzielą się przez 3 lub przez 5.',
            tags: ['while', 'suma warunkowa', '||', 'long long'],
            statement: ['Wczytaj n i wypisz sumę wszystkich liczb całkowitych od 1 do n, które dzielą się przez 3 lub przez 5 (albo przez obie te liczby naraz — każdą taką liczbę liczymy raz).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma.'],
            constraints: ['1 ≤ n ≤ 1 000 000'],
            examples: [{ input: '10', note: '3 + 5 + 6 + 9 + 10 = 33' }, { input: '15' }],
            hint: R`Warunek w pętli: if (i % 3 == 0 || i % 5 == 0). Dzięki || liczba 15 zostanie dodana tylko raz. Dla n = 10⁶ suma przekracza zakres int — użyj long long.`,
            tests: (r) => ['10', '15', '1', '3', '5', '1000000', '999999', String(r.int(100, 1e6))],
            solve: (inp) => { const n = nums(inp)[0]; let s = 0; for (let i = 1; i <= n; i++) if (i % 3 === 0 || i % 5 === 0) s += i; return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    int i = 1;
    while (i <= n) {
        if (i % 3 == 0 || i % 5 == 0) {
            suma += i;
        }
        i++;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-czy-pierwsza', krok: 3, level: 'srednie',
            title: 'Czy liczba jest pierwsza?',
            short: 'Policz dzielniki n — liczba pierwsza ma ich dokładnie dwa.',
            tags: ['while', 'licznik dzielników', 'if … else po pętli'],
            statement: ['Liczba pierwsza to liczba naturalna, która ma dokładnie dwa dzielniki: 1 i samą siebie, np. 2, 3, 5, 7, 11, 13. Liczba 1 nie jest pierwsza (ma tylko jeden dzielnik).', 'Wczytaj n i wypisz TAK, jeśli n jest liczbą pierwszą, albo NIE w przeciwnym razie.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1 000 000'],
            examples: [{ input: '13' }, { input: '12' }, { input: '1' }],
            hint: R`Policz dzielniki tak jak w zadaniu „Wszystkie dzielniki” (bez wypisywania), a po pętli zdecyduj: if (ile == 2) TAK, else NIE. Decyzję podejmujesz dopiero po pętli — w trakcie nie wiesz jeszcze, ile dzielników będzie.`,
            tests: (r) => ['13', '12', '1', '2', '3', '4', '999983', '1000000', '997', '999', '7919', '7917', String(r.int(2, 1e6))],
            solve: (inp) => { const n = nums(inp)[0]; let c = 0; for (let d = 1; d <= n; d++) if (n % d === 0) c++; return c === 2 ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    int d = 1;
    while (d <= n) {
        if (n % d == 0) {
            ile++;
        }
        d++;
    }
    if (ile == 2) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 4 · wczytywanie w pętli
        {
            id: 'wh-suma-n-liczb', krok: 4, level: 'latwe',
            title: 'Suma n liczb',
            short: 'Najpierw ile liczb, potem same liczby — wczytuj je w pętli i sumuj.',
            tags: ['while', 'cin w pętli', 'suma'],
            statement: ['W pierwszym wierszu jest liczba n, a w drugim n liczb całkowitych. Wypisz ich sumę.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba — suma.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁶ do 10⁶'],
            examples: [{ input: '4\n3 8 -2 10' }],
            hint: R`Najpierw cin >> n;, a potem pętla wykonująca się n razy, w której wczytujesz jedną liczbę i od razu dokładasz ją do sumy: cin >> x; suma += x;. Jedna zmienna x wystarczy na wszystkie liczby — każda kolejna nadpisuje poprzednią, ale ta jest już w sumie.`,
            tests: (r) => ['4\n3 8 -2 10', '1\n5', '1\n-1000000', '3\n0 0 0', `1000\n${Array(1000).fill(1000000).join(' ')}`, `1000\n${Array(1000).fill(-1000000).join(' ')}`, lista(10, -100, 100, r), lista(500, -1e6, 1e6, r)],
            solve: (inp) => { const a = nums(inp); return String(a.slice(1, 1 + a[0]).reduce((s, x) => s + x, 0)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int suma = 0;
    int i = 0;
    while (i < n) {
        int x;
        cin >> x;
        suma += x;
        i++;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-srednia', krok: 4, level: 'latwe',
            title: 'Średnia ocen',
            short: 'Wczytaj n ocen i wypisz ich średnią z dwoma miejscami po przecinku.',
            tags: ['while', 'suma', 'fixed i setprecision'],
            statement: ['Wczytaj liczbę ocen n, a potem n ocen (liczb całkowitych od 1 do 6). Wypisz średnią ocen zaokrągloną do dwóch miejsc po przecinku.'],
            input_format: ['W pierwszym wierszu n, w drugim n ocen.'],
            output_format: ['Jedna liczba z dokładnie dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda ocena ≤ 6'],
            examples: [{ input: '3\n5 4 4' }, { input: '4\n6 6 5 6' }],
            hint: R`Zsumuj oceny w pętli (suma jest int), a po pętli podziel — ale uwaga na dzielenie całkowite: (double)suma / n. Wypisz z cout << fixed << setprecision(2) (potrzebny #include <iomanip>).`,
            tests: (r) => {
                const out = ['3\n5 4 4', '4\n6 6 5 6', '1\n1', '1\n6', `1000\n${Array(1000).fill(6).join(' ')}`];
                while (out.length < 10) { const n = r.int(2, 1000); const a = r.arr(n, 1, 6); if (safe(a.reduce((s, x) => s + x, 0) / n, 2)) out.push(`${n}\n${a.join(' ')}`); }
                return out;
            },
            check: (inp) => { const a = nums(inp); return safe(a.slice(1).reduce((s, x) => s + x, 0) / a[0], 2) ? null : 'połówka'; },
            solve: (inp) => { const a = nums(inp); return fx(a.slice(1).reduce((s, x) => s + x, 0) / a[0], 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    int suma = 0;
    int i = 0;
    while (i < n) {
        int ocena;
        cin >> ocena;
        suma += ocena;
        i++;
    }
    cout << fixed << setprecision(2) << (double)suma / n << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-plus-minus-zero', krok: 4, level: 'latwe',
            title: 'Dodatnie, ujemne i zera',
            short: 'Trzy liczniki naraz: ile liczb jest dodatnich, ile ujemnych, a ile to zera.',
            tags: ['while', 'trzy liczniki', 'else if'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Wypisz trzy wiersze: ile z tych liczb jest dodatnich, ile ujemnych, a ile jest równych zero — w formacie jak w przykładzie.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Trzy wiersze: dodatnie: …, ujemne: …, zera: …'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −1000 do 1000'],
            examples: [{ input: '6\n4 -2 0 7 -1 3' }],
            hint: R`Trzy liczniki ustawione na 0 przed pętlą. W pętli, po wczytaniu liczby, łańcuch if / else if / else decyduje, który z nich zwiększyć. Wypisujesz dopiero po pętli.`,
            tests: (r) => ['6\n4 -2 0 7 -1 3', '1\n0', '1\n5', '1\n-5', '5\n0 0 0 0 0', lista(20, -3, 3, r), lista(1000, -1000, 1000, r), lista(300, -1, 1, r)],
            solve: (inp) => { const a = nums(inp).slice(1); return join(`dodatnie: ${a.filter((x) => x > 0).length}`, `ujemne: ${a.filter((x) => x < 0).length}`, `zera: ${a.filter((x) => x === 0).length}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int dodatnie = 0, ujemne = 0, zera = 0;
    int i = 0;
    while (i < n) {
        int x;
        cin >> x;
        if (x > 0) {
            dodatnie++;
        } else if (x < 0) {
            ujemne++;
        } else {
            zera++;
        }
        i++;
    }
    cout << "dodatnie: " << dodatnie << "\n";
    cout << "ujemne: " << ujemne << "\n";
    cout << "zera: " << zera << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-najwieksza', krok: 4, level: 'latwe',
            title: 'Największa liczba',
            short: 'Znajdź największą z n liczb — także wtedy, gdy wszystkie są ujemne.',
            tags: ['while', 'maksimum', 'pierwsza liczba osobno'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Wypisz największą z nich.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '5\n3 9 -4 9 2' }, { input: '3\n-7 -2 -15' }],
            hint: R`Wczytaj pierwszą liczbę jeszcze przed pętlą i zapamiętaj ją jako dotychczasowe maksimum. Potem pętla po pozostałych n − 1 liczbach: if (x > maks) maks = x;. Nie zaczynaj od maks = 0 — dla samych liczb ujemnych wyszłoby 0, którego w danych nie ma.`,
            tests: (r) => ['5\n3 9 -4 9 2', '3\n-7 -2 -15', '1\n-1000000000', '1\n1000000000', '4\n5 4 3 2', '4\n2 3 4 5', lista(1000, -1e9, -1, r), lista(1000, -1e9, 1e9, r)],
            solve: (inp) => { const a = nums(inp).slice(1); return String(Math.max(...a)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks;
    cin >> maks;
    int i = 1;
    while (i < n) {
        int x;
        cin >> x;
        if (x > maks) {
            maks = x;
        }
        i++;
    }
    cout << maks << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-do-zera', krok: 4, level: 'latwe',
            title: 'Aż do zera',
            short: 'Wczytuj liczby, dopóki nie trafisz na 0. Policz je i zsumuj.',
            tags: ['while', 'wartość kończąca', 'licznik i suma'],
            statement: ['Na wejściu są liczby całkowite, a ostatnią z nich jest 0 — to znak, że dane się skończyły. Zero nie należy już do danych.', 'Wypisz w pierwszym wierszu, ile liczb (bez kończącego zera) było na wejściu, a w drugim — ich sumę.'],
            input_format: ['Liczby całkowite oddzielone spacjami lub enterami; ostatnia z nich to 0 i tylko ona jest zerem.'],
            output_format: ['Dwa wiersze: liczba danych i ich suma.'],
            constraints: ['przed zerem jest od 0 do 1000 liczb', 'każda liczba od −10⁶ do 10⁶'],
            examples: [{ input: '5 -3 12 7 0' }, { input: '0', note: 'Zero od razu — danych nie ma wcale.' }],
            hint: R`Wczytaj pierwszą liczbę przed pętlą, a pętla niech kręci się, dopóki x != 0. W środku: policz i dodaj x, a na końcu obrotu wczytaj następną liczbę. Dzięki temu zero nigdy nie trafi do licznika.`,
            tests: (r) => {
                const nz = (n, lo, hi) => r.arr(n, lo, hi).map((x) => x || 1);
                return ['5 -3 12 7 0', '0', '7 0', '-1 0', `${nz(1000, -1e6, 1e6).join('\n')}\n0`, `${nz(30, -9, 9).join(' ')} 0`, `${nz(5, 1, 100).join('\n')}\n0`];
            },
            solve: (inp) => { const a = nums(inp); const d = a.slice(0, a.indexOf(0)); return join(String(d.length), String(d.reduce((s, x) => s + x, 0))); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int ile = 0;
    long long suma = 0;
    int x;
    cin >> x;
    while (x != 0) {
        ile++;
        suma += x;
        cin >> x;
    }
    cout << ile << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-do-konca-danych', krok: 4, level: 'srednie',
            title: 'Do końca danych',
            short: 'Nie wiesz, ile będzie liczb — czytaj while (cin >> x) i licz, aż dane się skończą.',
            tags: ['while (cin >> x)', 'licznik', 'maksimum'],
            statement: ['Na wejściu jest pewna liczba liczb całkowitych, ale nikt nie mówi, ile ich jest — po prostu w którymś momencie się kończą. Jest co najmniej jedna.', 'Wypisz trzy wiersze: ile liczb było na wejściu, jaka jest ich suma i jaka jest największa z nich.'],
            input_format: ['Liczby całkowite oddzielone spacjami lub enterami.'],
            output_format: ['Trzy wiersze: liczba danych, suma, największa liczba.'],
            constraints: ['od 1 do 10 000 liczb', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '4 8 15 16 23 42' }, { input: '-5\n-1\n-9' }],
            hint: R`while (cin >> x) wczytuje kolejną liczbę i kręci się, dopóki wczytanie się udaje. Suma może przekroczyć zakres int — użyj long long. Maksimum: przy pierwszej wczytanej liczbie (gdy licznik jest jeszcze 0) po prostu ją zapamiętaj, a potem porównuj jak zwykle.`,
            tests: (r) => ['4 8 15 16 23 42', '-5\n-1\n-9', '7', '-1000000000', `${r.arr(5000, -1e9, 1e9).join('\n')}`, `${r.arr(50, -100, 100).join(' ')}`, Array(10000).fill(1e9).join(' ')],
            solve: (inp) => { const a = nums(inp); return join(String(a.length), String(a.reduce((s, x) => s + x, 0)), String(Math.max(...a))); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int ile = 0;
    long long suma = 0;
    int maks = 0;
    int x;
    while (cin >> x) {
        if (ile == 0 || x > maks) {
            maks = x;
        }
        ile++;
        suma += x;
    }
    cout << ile << "\n" << suma << "\n" << maks << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-amplituda', krok: 4, level: 'srednie',
            title: 'Najcieplej i najzimniej',
            short: 'Z n pomiarów temperatury wypisz najniższą, najwyższą i różnicę między nimi.',
            tags: ['while', 'minimum i maksimum'],
            statement: ['Stacja pogodowa zmierzyła n razy temperaturę. Wypisz w trzech wierszach: najniższą temperaturę, najwyższą temperaturę i różnicę między najwyższą a najniższą (amplitudę), w formacie jak w przykładzie.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych — temperatury.'],
            output_format: ['Trzy wiersze: min: …, max: …, amplituda: …'],
            constraints: ['1 ≤ n ≤ 1000', 'każda temperatura od −60 do 60'],
            examples: [{ input: '6\n3 -2 5 8 -4 1' }],
            hint: R`Tym razem pilnujesz dwóch rekordów naraz. Pierwszą temperaturę wczytaj przed pętlą i ustaw ją jako minimum i jako maksimum. W pętli: if (t < mini) mini = t; oraz osobno if (t > maks) maks = t;.`,
            tests: (r) => ['6\n3 -2 5 8 -4 1', '1\n-60', '2\n60 -60', '3\n5 5 5', lista(1000, -60, 60, r), lista(20, -10, 25, r), lista(7, -60, -30, r)],
            solve: (inp) => { const a = nums(inp).slice(1); const lo = Math.min(...a), hi = Math.max(...a); return join(`min: ${lo}`, `max: ${hi}`, `amplituda: ${hi - lo}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int t;
    cin >> t;
    int mini = t, maks = t;
    int i = 1;
    while (i < n) {
        cin >> t;
        if (t < mini) {
            mini = t;
        }
        if (t > maks) {
            maks = t;
        }
        i++;
    }
    cout << "min: " << mini << "\n";
    cout << "max: " << maks << "\n";
    cout << "amplituda: " << maks - mini << "\n";
    return 0;
}`,
        },
        {
            id: 'wh-czy-rosnacy', krok: 4, level: 'srednie',
            title: 'Czy ciąg rośnie?',
            short: 'Sprawdź, czy każda liczba jest większa od poprzedniej. Zapamiętuj poprzednią.',
            tags: ['while', 'poprzednia liczba', 'flaga bool'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Wypisz TAK, jeśli ciąg jest ściśle rosnący — każda liczba (poza pierwszą) jest większa od liczby stojącej tuż przed nią. W przeciwnym razie wypisz NIE.', 'Ciąg z jednej liczby uznajemy za rosnący.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '5\n1 3 4 8 20' }, { input: '4\n2 5 5 9', note: '5 nie jest większe od 5.' }],
            hint: R`Trzymaj poprzednią liczbę w zmiennej poprz. W pętli wczytaj x, porównaj: if (x <= poprz) ok = false;, a na końcu obrotu poprz = x;. Flaga bool ok = true ustawiona przed pętlą zmienia się na false przy pierwszym „zepsutym” miejscu i już nie wraca.`,
            tests: (r) => {
                const ros = (n) => { let x = r.int(-1e9, -1e9 + 1000); const a = []; for (let i = 0; i < n; i++) { a.push(x); x += r.int(1, 1e6); } return a; };
                const a1 = ros(1000); const a2 = ros(300); a2[150] = a2[149]; const a3 = ros(50); [a3[48], a3[49]] = [a3[49], a3[48]];
                return ['5\n1 3 4 8 20', '4\n2 5 5 9', '1\n7', '2\n1 2', '2\n2 1', '2\n3 3', `1000\n${a1.join(' ')}`, `300\n${a2.join(' ')}`, `50\n${a3.join(' ')}`, '5\n5 4 6 7 8'];
            },
            solve: (inp) => { const a = nums(inp).slice(1); for (let i = 1; i < a.length; i++) if (a[i] <= a[i - 1]) return 'NIE'; return 'TAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int poprz;
    cin >> poprz;
    bool ok = true;
    int i = 1;
    while (i < n) {
        int x;
        cin >> x;
        if (x <= poprz) {
            ok = false;
        }
        poprz = x;
        i++;
    }
    if (ok) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
    ];
};
