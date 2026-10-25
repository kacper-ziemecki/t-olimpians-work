// Krok 1 · Pierwsze kroki — funkcja, która woła samą siebie.
// Same funkcje void: warunek stopu, kod przed wywołaniem (w dół) i po wywołaniu (w górę).
module.exports = (h) => {
    const { reader, join } = h;
    const NIE_PETLA = 'Zadanie rozwiąż rekurencyjnie — funkcja, która robi całą pracę, nie może mieć w środku żadnej pętli.';

    return [
        // ------------------------------------------------------------ 1
        {
            id: 'rek-powtorz-napis',
            title: 'Powtórz napis',
            level: 'latwe',
            statement: [
                'Bajtek chce, żeby komputer napisał jego imię wiele razy. Wczytaj liczbę n i słowo s, a następnie wypisz słowo s dokładnie n razy — każde w osobnym wierszu.',
                'Zrób to rekurencyjnie: napisz funkcję void powtorz(int n, string s), która wypisuje s tylko jeden raz, a resztę pracy zleca samej sobie, czyli wywołaniu powtorz(n - 1, s). ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się liczba całkowita n oraz słowo s złożone z małych liter alfabetu angielskiego.'],
            output_format: ['Wypisz n wierszy, w każdym słowo s.'],
            constraints: ['1 ≤ n ≤ 1000', 's ma od 1 do 20 liter'],
            examples: [{
                input: '3 bajtek',
                note: 'powtorz(3, s) wypisuje słowo i woła powtorz(2, s). Ta wypisuje i woła powtorz(1, s), a ta — powtorz(0, s), które od razu kończy pracę. To jest warunek stopu.',
            }],
            hint: 'Warunek stopu: jeśli n == 0, nie ma już nic do wypisania — wykonaj return. W przeciwnym razie wypisz s (i znak nowej linii), a potem wywołaj powtorz(n - 1, s). Każde wywołanie zmniejsza n o 1, więc po n krokach dojdziemy do zera.',
            tests: (r) => ['1 a', '2 ola', '5 rekurencja', '10 x', '17 olimpiada', '100 bit',
                `${r.int(200, 600)} ${r.word(7)}`, `${r.int(600, 999)} ${r.word(20)}`, '1000 t'],
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), s = rd.str(); return Array(n).fill(s).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void powtorz(int n, const string &s) {
    if (n == 0) return;
    cout << s << "\n";
    powtorz(n - 1, s);
}
int main() {
    int n; string s;
    cin >> n >> s;
    powtorz(n, s);
}`,
        },
        // ------------------------------------------------------------ 2
        {
            id: 'rek-odliczanie',
            title: 'Odliczanie do startu',
            level: 'latwe',
            statement: [
                'Rakieta zaraz wystartuje, a Ty prowadzisz odliczanie. Wczytaj liczbę n i wypisz liczby n, n − 1, n − 2, …, 2, 1 — każdą w osobnym wierszu — a na samym końcu napis START.',
                'Napisz funkcję void odliczaj(int n), która wypisuje n i wywołuje samą siebie dla n − 1. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz n wierszy z liczbami n, n − 1, …, 1, a po nich jeden wiersz z napisem START.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{
                input: '5',
                note: 'odliczaj(5) wypisuje 5 i woła odliczaj(4), ta wypisuje 4 i woła odliczaj(3)… aż odliczaj(0) od razu kończy pracę. Wtedy wszystkie wywołania wracają do main, które wypisuje START.',
            }],
            hint: 'Warunek stopu: gdy n == 0, nie ma już czego odliczać — return. W przeciwnym razie: najpierw cout << n << endl, potem odliczaj(n - 1). Napis START wypisz w main, zaraz po wywołaniu odliczaj(n) — wykona się dopiero wtedy, gdy całe odliczanie się skończy.',
            tests: (r) => ['1', '2', '3', '10', String(r.int(20, 99)), '100', String(r.int(300, 800)), '999', '1000'],
            solve: (inp) => { const n = Number(inp); const o = []; for (let i = n; i >= 1; i--) o.push(i); o.push('START'); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void odliczaj(int n) {
    if (n == 0) return;
    cout << n << "\n";
    odliczaj(n - 1);
}
int main() {
    int n;
    cin >> n;
    odliczaj(n);
    cout << "START\n";
}`,
        },
        // ------------------------------------------------------------ 3
        {
            id: 'rek-od-1-do-n',
            title: 'Od 1 do n',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i wypisz liczby 1, 2, 3, …, n w jednym wierszu, oddzielone spacjami.',
                'Haczyk: funkcja rekurencyjna ma mieć tylko jeden parametr — n — i nie wolno Ci dodać żadnego licznika. Wykorzystaj to, że kod zapisany PO wywołaniu rekurencyjnym wykonuje się dopiero w drodze powrotnej. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz w jednym wierszu liczby od 1 do n oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{
                input: '5',
                note: 'wypisz(5) najpierw woła wypisz(4), które wypisze „1 2 3 4”. Dopiero gdy wypisz(4) wróci, wypisz(5) dopisuje swoje 5.',
            }],
            hint: 'void wypisz(int n): jeśli n == 0 — return. W przeciwnym razie NAJPIERW wywołaj wypisz(n - 1), a DOPIERO POTEM cout << n << " ". Zaufaj rekurencji: wypisz(n - 1) wypisze 1 … n−1, więc po nim zostaje dopisać już tylko samo n.',
            tests: (r) => ['1', '2', '3', '7', '10', String(r.int(30, 99)), String(r.int(100, 500)), '999', '1000'],
            solve: (inp) => { const n = Number(inp); return Array.from({ length: n }, (_, i) => i + 1).join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void wypisz(int n) {
    if (n == 0) return;
    wypisz(n - 1);
    cout << n << " ";
}
int main() {
    int n;
    cin >> n;
    wypisz(n);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 4
        {
            id: 'rek-tam-i-z-powrotem',
            title: 'Tam i z powrotem',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i wypisz w jednym wierszu liczby n, n − 1, …, 2, 1, a zaraz po nich 1, 2, …, n − 1, n (jedynka pojawi się dwa razy, obok siebie).',
                'Całe zadanie da się zrobić JEDNĄ funkcją rekurencyjną z jednym parametrem i jednym wywołaniem samej siebie. Zastanów się, co wypisać przed wywołaniem, a co po nim. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz w jednym wierszu 2n liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{
                input: '4',
                note: 'W drodze w dół każde wywołanie wypisuje swoje n (4 3 2 1), a w drodze powrotnej — znowu swoje n (1 2 3 4). Wywołania wracają w odwrotnej kolejności niż wchodziły.',
            }],
            hint: 'void f(int n): jeśli n == 0 — return. Potem: cout << n << " "; f(n - 1); cout << n << " ";. Pierwszy cout wykonuje się w drodze w dół (od n do 1), drugi — w drodze powrotnej (od 1 do n).',
            tests: (r) => ['1', '2', '3', '5', '10', String(r.int(20, 80)), String(r.int(100, 400)), '777', '1000'],
            solve: (inp) => { const n = Number(inp); const a = []; for (let i = n; i >= 1; i--) a.push(i); for (let i = 1; i <= n; i++) a.push(i); return a.join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void f(int n) {
    if (n == 0) return;
    cout << n << " ";
    f(n - 1);
    cout << n << " ";
}
int main() {
    int n;
    cin >> n;
    f(n);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 5
        {
            id: 'rek-od-a-do-b',
            title: 'Od a do b',
            level: 'latwe',
            statement: [
                'Wczytaj dwie liczby całkowite a i b (a ≤ b) i wypisz wszystkie liczby całkowite od a do b włącznie, w jednym wierszu, oddzielone spacjami.',
                'Napisz funkcję void wypisz(int a, int b) z dwoma parametrami. Tym razem warunek stopu zależy od obu parametrów naraz. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite a i b.'],
            output_format: ['Wypisz w jednym wierszu liczby a, a + 1, …, b oddzielone spacjami.'],
            constraints: ['−1000 ≤ a ≤ b ≤ 1000'],
            examples: [
                { input: '3 7', note: 'wypisz(3, 7) wypisuje 3 i woła wypisz(4, 7), …, aż wypisz(8, 7) widzi, że a > b, i kończy.' },
                { input: '-2 2' },
            ],
            hint: 'Kiedy nie ma już nic do wypisania? Gdy a > b — wtedy return. W przeciwnym razie wypisz a i wywołaj wypisz(a + 1, b). Parametr b się nie zmienia, „zbliża się” tylko a.',
            tests: (r) => ['5 5', '1 1', '0 10', '-10 -1', '-1000 -990', '995 1000', `${r.int(-500, 0)} ${r.int(1, 500)}`, '-1000 1000'],
            solve: (inp) => { const [a, b] = h.nums(inp); const o = []; for (let i = a; i <= b; i++) o.push(i); return o.join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void wypisz(int a, int b) {
    if (a > b) return;
    cout << a << " ";
    wypisz(a + 1, b);
}
int main() {
    int a, b;
    cin >> a >> b;
    wypisz(a, b);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 6
        {
            id: 'rek-co-druga',
            title: 'Co druga liczba',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i wypisz w jednym wierszu liczby n, n − 2, n − 4, … — dopóki są dodatnie.',
                'Uważaj na warunek stopu! Funkcja woła samą siebie dla n − 2, więc dla nieparzystego n nigdy nie trafi dokładnie w zero. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz w jednym wierszu dodatnie liczby n, n − 2, n − 4, … oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000'],
            examples: [
                { input: '9', note: '9, 7, 5, 3, 1 — następna byłaby −1, a ona nie jest dodatnia.' },
                { input: '6' },
            ],
            hint: 'Warunek if (n == 0) return; tutaj nie wystarczy: dla n = 9 wywołania idą 9, 7, 5, 3, 1, −1, −3, … i nigdy nie trafiają w zero — program wysypie się z przepełnieniem stosu. Użyj if (n <= 0) return;.',
            tests: (r) => ['1', '2', '3', '4', '15', '20', String(2 * r.int(100, 900) + 1), '1999', '2000'],
            solve: (inp) => { const n = Number(inp); const o = []; for (let i = n; i > 0; i -= 2) o.push(i); return o.join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void f(int n) {
    if (n <= 0) return;
    cout << n << " ";
    f(n - 2);
}
int main() {
    int n;
    cin >> n;
    f(n);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 7
        {
            id: 'rek-linia-gwiazdek',
            title: 'Linia gwiazdek',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i wypisz w jednym wierszu dokładnie n gwiazdek * — bez spacji między nimi.',
                'Napisz funkcję void linia(int n), która wypisuje jedną gwiazdkę i resztę zleca wywołaniu linia(n - 1). Ta funkcja przyda Ci się w kolejnych zadaniach. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz jeden wiersz złożony z n gwiazdek.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '6' }],
            hint: 'Tak samo jak w „Powtórz napis”: if (n == 0) return; cout << \'*\'; linia(n - 1);. Znak nowej linii wypisz raz, w main, po wywołaniu linia(n).',
            tests: (r) => ['1', '2', '3', '10', '50', String(r.int(100, 500)), '999', '1000'],
            solve: (inp) => '*'.repeat(Number(inp)),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void linia(int n) {
    if (n == 0) return;
    cout << '*';
    linia(n - 1);
}
int main() {
    int n;
    cin >> n;
    linia(n);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 8
        {
            id: 'rek-trojkat',
            title: 'Trójkąt z gwiazdek',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i narysuj trójkąt z gwiazdek: w pierwszym wierszu jedna gwiazdka, w drugim dwie, …, w n-tym — n gwiazdek.',
                'Potrzebujesz dwóch funkcji rekurencyjnych: linia(k) z poprzedniego zadania rysuje jeden wiersz, a trojkat(n) rysuje cały trójkąt. Pomyśl: jak narysować trójkąt o wysokości n, jeśli umiesz już narysować trójkąt o wysokości n − 1? ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz n wierszy; i-ty wiersz ma składać się z i gwiazdek.'],
            constraints: ['1 ≤ n ≤ 100'],
            examples: [{ input: '4', note: 'Trójkąt wysokości 4 to trójkąt wysokości 3, pod którym dopisujemy wiersz z 4 gwiazdkami.' }],
            hint: 'trojkat(n): jeśli n == 0 — return. Inaczej NAJPIERW trojkat(n - 1) (narysuje wiersze 1 … n−1), a POTEM linia(n) i znak nowej linii. Kolejność ma znaczenie: kod po wywołaniu wykonuje się w drodze powrotnej, czyli od najkrótszego wiersza.',
            tests: (r) => ['1', '2', '3', '5', '10', String(r.int(20, 60)), '99', '100'],
            solve: (inp) => { const n = Number(inp); return Array.from({ length: n }, (_, i) => '*'.repeat(i + 1)).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void linia(int k) {
    if (k == 0) return;
    cout << '*';
    linia(k - 1);
}
void trojkat(int n) {
    if (n == 0) return;
    trojkat(n - 1);
    linia(n);
    cout << "\n";
}
int main() {
    int n;
    cin >> n;
    trojkat(n);
}`,
        },
        // ------------------------------------------------------------ 9
        {
            id: 'rek-trojkat-odwrocony',
            title: 'Odwrócony trójkąt',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i narysuj trójkąt z gwiazdek „do góry nogami”: w pierwszym wierszu n gwiazdek, w drugim n − 1, …, w ostatnim jedna.',
                'Weź rozwiązanie zadania „Trójkąt z gwiazdek” i zmień w nim tylko kolejność dwóch linijek. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz n wierszy; i-ty wiersz ma składać się z n − i + 1 gwiazdek.'],
            constraints: ['1 ≤ n ≤ 100'],
            examples: [{ input: '4' }],
            hint: 'Teraz najdłuższy wiersz ma się pojawić pierwszy, więc wypisz go w drodze w dół: linia(n), znak nowej linii, a dopiero potem wywołaj odwrocony(n - 1).',
            tests: (r) => ['1', '2', '3', '6', '10', String(r.int(20, 60)), '99', '100'],
            solve: (inp) => { const n = Number(inp); return Array.from({ length: n }, (_, i) => '*'.repeat(n - i)).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void linia(int k) {
    if (k == 0) return;
    cout << '*';
    linia(k - 1);
}
void odwrocony(int n) {
    if (n == 0) return;
    linia(n);
    cout << "\n";
    odwrocony(n - 1);
}
int main() {
    int n;
    cin >> n;
    odwrocony(n);
}`,
        },
        // ------------------------------------------------------------ 10
        {
            id: 'rek-klepsydra',
            title: 'Klepsydra',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i narysuj klepsydrę z gwiazdek: najpierw wiersze z n, n − 1, …, 1 gwiazdkami, a potem wiersze z 1, 2, …, n gwiazdkami. Razem 2n wierszy — wiersz z jedną gwiazdką pojawia się dwa razy, jeden pod drugim.',
                'Wystarczy jedna funkcja klepsydra(n), która woła samą siebie tylko raz — i oczywiście linia(k) do rysowania pojedynczego wiersza. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz 2n wierszy z gwiazdkami, jak w opisie.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '3', note: 'Górna połowa rysuje się w drodze w dół (3, 2, 1), dolna — w drodze powrotnej (1, 2, 3).' }],
            hint: 'To jest „Tam i z powrotem”, tylko zamiast liczby rysujesz wiersz: klepsydra(n) = linia(n) + nowa linia; klepsydra(n - 1); linia(n) + nowa linia. Warunek stopu: n == 0.',
            tests: (r) => ['1', '2', '4', '5', '8', String(r.int(10, 30)), '49', '50'],
            solve: (inp) => { const n = Number(inp); const o = []; for (let i = n; i >= 1; i--) o.push('*'.repeat(i)); for (let i = 1; i <= n; i++) o.push('*'.repeat(i)); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void linia(int k) {
    if (k == 0) return;
    cout << '*';
    linia(k - 1);
}
void klepsydra(int n) {
    if (n == 0) return;
    linia(n); cout << "\n";
    klepsydra(n - 1);
    linia(n); cout << "\n";
}
int main() {
    int n;
    cin >> n;
    klepsydra(n);
}`,
        },
        // ------------------------------------------------------------ 11
        {
            id: 'rek-schodki-liczb',
            title: 'Schodki z liczb',
            level: 'latwe',
            statement: [
                'Wczytaj liczbę n i wypisz n wierszy: w i-tym wierszu mają się znaleźć liczby 1, 2, …, i oddzielone spacjami.',
                'Połącz dwa pomysły z poprzednich zadań: funkcja wiersz(i) wypisuje 1 … i (jak w „Od 1 do n”), a funkcja schodki(n) układa wiersze jeden pod drugim (jak w „Trójkąt z gwiazdek”). ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz n wierszy; i-ty wiersz zawiera liczby od 1 do i oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '4' }],
            hint: 'wiersz(i): if (i == 0) return; wiersz(i - 1); cout << i << " ";. schodki(n): if (n == 0) return; schodki(n - 1); wiersz(n); cout << endl;. Obie funkcje wypisują swoją część w drodze powrotnej.',
            tests: (r) => ['1', '2', '3', '5', '9', String(r.int(10, 30)), '49', '50'],
            solve: (inp) => { const n = Number(inp); return Array.from({ length: n }, (_, i) => Array.from({ length: i + 1 }, (_, j) => j + 1).join(' ')).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void wiersz(int i) {
    if (i == 0) return;
    wiersz(i - 1);
    cout << i << " ";
}
void schodki(int n) {
    if (n == 0) return;
    schodki(n - 1);
    wiersz(n);
    cout << "\n";
}
int main() {
    int n;
    cin >> n;
    schodki(n);
}`,
        },
        // ------------------------------------------------------------ 12
        {
            id: 'rek-cyfry-od-konca',
            title: 'Cyfry od końca',
            level: 'latwe',
            statement: [
                'Dla każdej z t podanych liczb wypisz jej cyfry od ostatniej do pierwszej, oddzielone spacjami. Na przykład dla 4821 wypisz 1 2 8 4.',
                'Ostatnią cyfrę liczby n daje n % 10, a n / 10 to liczba bez tej ostatniej cyfry. Napisz funkcję rekurencyjną, która wypisuje ostatnią cyfrę i resztę liczby zleca samej sobie. Pętla jest dozwolona tylko w main, do wczytania t liczb.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu jej cyfry od ostatniej do pierwszej, oddzielone spacjami.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n4821\n7\n1000', note: 'Dla 1000 cyfry od końca to 0 0 0 1. Dla jednocyfrowej liczby 7 jest tylko jedna cyfra.' }],
            hint: 'void cyfry(long long n): jeśli n < 10 — wypisz n i return (to obsługuje też n = 0). W przeciwnym razie wypisz n % 10 i wywołaj cyfry(n / 10). Pamiętaj o long long — liczby sięgają 10¹⁸.',
            tests: (r) => [
                '5\n0\n9\n10\n99\n100',
                '6\n12345\n54321\n1010\n90\n7007\n123456789',
                '3\n1000000000000000000\n999999999999999999\n123456789012345678',
                '20\n' + Array.from({ length: 20 }, () => String(r.big(0, '1000000000000000000'))).join('\n'),
                '30\n' + Array.from({ length: 30 }, () => String(r.int(0, 100000))).join('\n'),
                '100\n' + Array.from({ length: 100 }, () => String(r.big(0, '1' + '0'.repeat(r.int(1, 18))))).join('\n'),
            ],
            solve: (inp) => { const t = h.toks(inp).slice(1); return t.map((x) => x.split('').reverse().join(' ')).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void cyfry(long long n) {
    if (n < 10) { cout << n; return; }
    cout << n % 10 << " ";
    cyfry(n / 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cyfry(n);
        cout << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 13
        {
            id: 'rek-cyfry-od-poczatku',
            title: 'Cyfry od początku',
            level: 'latwe',
            statement: [
                'Dla każdej z t podanych liczb wypisz jej cyfry od pierwszej do ostatniej, oddzielone spacjami. Na przykład dla 4821 wypisz 4 8 2 1.',
                'Pętlą to kłopotliwe, bo % 10 daje cyfry od końca. Rekurencją wystarczy przestawić jedną linijkę w rozwiązaniu zadania „Cyfry od końca”. Pętla jest dozwolona tylko w main, do wczytania t liczb.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu jej cyfry od pierwszej do ostatniej, oddzielone spacjami.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n4821\n7\n1000', note: 'cyfry(4821) najpierw woła cyfry(482), które wypisze „4 8 2”, a dopiero w drodze powrotnej dopisuje ostatnią cyfrę 1.' }],
            hint: 'void cyfry(long long n): jeśli n < 10 — wypisz n i return. W przeciwnym razie NAJPIERW cyfry(n / 10) (wypisze wszystkie cyfry oprócz ostatniej), a POTEM cout << " " << n % 10.',
            tests: (r) => [
                '5\n0\n9\n10\n99\n100',
                '6\n12345\n54321\n1010\n90\n7007\n123456789',
                '3\n1000000000000000000\n999999999999999999\n123456789012345678',
                '20\n' + Array.from({ length: 20 }, () => String(r.big(0, '1000000000000000000'))).join('\n'),
                '30\n' + Array.from({ length: 30 }, () => String(r.int(0, 100000))).join('\n'),
                '100\n' + Array.from({ length: 100 }, () => String(r.big(0, '1' + '0'.repeat(r.int(1, 18))))).join('\n'),
            ],
            solve: (inp) => { const t = h.toks(inp).slice(1); return t.map((x) => x.split('').join(' ')).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void cyfry(long long n) {
    if (n < 10) { cout << n; return; }
    cyfry(n / 10);
    cout << " " << n % 10;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cyfry(n);
        cout << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 14
        {
            id: 'rek-napis-od-tylu',
            title: 'Napis od tyłu',
            level: 'latwe',
            statement: [
                'Wczytaj słowo s i wypisz je od tyłu — od ostatniej litery do pierwszej.',
                'Napisz funkcję void odwroc(const string &s, int i), która zajmuje się literami od pozycji i do końca słowa. Wywołanie z main to odwroc(s, 0). Znak & sprawia, że słowo nie jest kopiowane przy każdym wywołaniu. ' + NIE_PETLA,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się słowo s złożone z małych liter alfabetu angielskiego.'],
            output_format: ['Wypisz słowo s czytane od końca.'],
            constraints: ['1 ≤ długość s ≤ 1000'],
            examples: [{ input: 'rekurencja', note: 'odwroc(s, 0) najpierw woła odwroc(s, 1), które wypisze wszystko od litery nr 1 do końca w odwrotnej kolejności, a dopiero potem dopisuje literę s[0] = r.' }],
            hint: 'Jeśli i == s.size(), słowo się skończyło — return. W przeciwnym razie NAJPIERW odwroc(s, i + 1), a POTEM cout << s[i]. Litera s[i] wypisze się w drodze powrotnej, czyli po wszystkich literach stojących za nią.',
            tests: (r) => ['a', 'ab', 'kajak', 'olimpiada', 'abcdefghijklmnopqrstuvwxyz', r.word(50), r.word(500), r.word(1000, 'ab')],
            solve: (inp) => inp.trim().split('').reverse().join(''),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void odwroc(const string &s, int i) {
    if (i == (int)s.size()) return;
    odwroc(s, i + 1);
    cout << s[i];
}
int main() {
    string s;
    cin >> s;
    odwroc(s, 0);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 15
        {
            id: 'rek-tablica-od-konca',
            title: 'Tablica od końca',
            level: 'latwe',
            statement: [
                'Wczytaj n liczb do tablicy i wypisz je w odwrotnej kolejności — od ostatniej do pierwszej.',
                'Do wczytania liczb użyj zwykłej pętli. Wypisywanie zrób rekurencyjnie: funkcja wypisz(i) zajmuje się elementami o indeksach od i do n − 1, a z main wołamy wypisz(0).',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.'],
            output_format: ['Wypisz w jednym wierszu liczby aₙ₋₁, …, a₁, a₀ oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '5\n3 -1 4 1 5' }],
            hint: 'Tablicę zrób globalną, żeby funkcja ją widziała. wypisz(i): jeśli i == n — return; NAJPIERW wypisz(i + 1), POTEM cout << a[i] << " ". Element a[0] wypisze się na samym końcu, bo jego wywołanie wraca jako ostatnie.',
            tests: (r) => {
                const T = (n, lo, hi) => `${n}\n${r.arr(n, lo, hi).join(' ')}`;
                return ['1\n42', '2\n1 2', '3\n-5 0 5', T(10, 1, 9), T(50, -100, 100), T(300, -1e9, 1e9), T(1000, -1e9, 1e9), T(1000, 0, 1)];
            },
            solve: (inp) => h.toks(inp).slice(1).reverse().join(' '),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int a[1005];
void wypisz(int i) {
    if (i == n) return;
    wypisz(i + 1);
    cout << a[i] << " ";
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    wypisz(0);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 16
        {
            id: 'rek-zapis-dwojkowy',
            title: 'Zapis dwójkowy rekurencyjnie',
            level: 'srednie',
            statement: [
                'Zapis dwójkowy liczby to jej zapis w systemie o podstawie 2, np. 13 = 8 + 4 + 1 = 1101₂. Ostatnią cyfrą zapisu dwójkowego liczby n jest n % 2, a pozostałe cyfry to zapis dwójkowy liczby n / 2.',
                'Dla każdej z t liczb wypisz jej zapis dwójkowy bez zer wiodących. Użyj rekurencji — dokładnie tak, jak przy wypisywaniu cyfr dziesiętnych od początku, tylko z 2 zamiast 10.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu jej zapis dwójkowy (bez spacji). Zapisem liczby 0 jest 0.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n0\n8\n255', note: 'dwojkowo(13) woła dwojkowo(6), ta dwojkowo(3), ta dwojkowo(1), które wypisuje 1. W drodze powrotnej dopisują się kolejno 13 / 2 … reszty: 1 (z 3), 0 (z 6), 1 (z 13) → 1101.' }],
            hint: 'void dwojkowo(long long n): jeśli n < 2 — wypisz n i return. W przeciwnym razie NAJPIERW dwojkowo(n / 2), POTEM cout << n % 2. Starsze cyfry wypisują się pierwsze, bo ich wywołania są głębiej.',
            tests: (r) => [
                '8\n0\n1\n2\n3\n4\n5\n6\n7',
                '6\n1023\n1024\n1000000\n65535\n65536\n1000000007',
                '3\n1000000000000000000\n576460752303423487\n576460752303423488',
                '40\n' + Array.from({ length: 40 }, () => String(r.big(0, '1000000000000000000'))).join('\n'),
                '100\n' + Array.from({ length: 100 }, () => String(r.int(0, 5000))).join('\n'),
            ],
            solve: (inp) => h.toks(inp).slice(1).map((x) => BigInt(x).toString(2)).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void dwojkowo(long long n) {
    if (n < 2) { cout << n; return; }
    dwojkowo(n / 2);
    cout << n % 2;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        dwojkowo(n);
        cout << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 17
        {
            id: 'rek-system-k',
            title: 'Zapis w systemie o podstawie k',
            level: 'srednie',
            statement: [
                'Uogólnijmy poprzednie zadanie. W systemie o podstawie k ostatnią cyfrą liczby n jest n % k, a pozostałe cyfry to zapis liczby n / k. Dla podstaw większych niż 10 cyfry 10, 11, 12, 13, 14, 15 zapisujemy jako A, B, C, D, E, F.',
                'Dla każdego zapytania wypisz zapis liczby n w systemie o podstawie k. Użyj rekurencji.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu zapis liczby n w systemie o podstawie k, bez zer wiodących. Zapisem zera jest 0.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸', '2 ≤ k ≤ 16'],
            examples: [{ input: '4\n13 2\n255 16\n100 3\n2024 10', note: '255 = 15·16 + 15, więc szesnastkowo FF. 100 = 1·81 + 0·27 + 2·9 + 0·3 + 1, więc trójkowo 10201.' }],
            hint: 'Zrób napis cyfry = "0123456789ABCDEF" — wtedy cyfrą o wartości d jest cyfry[d]. Funkcja: jeśli n < k — wypisz cyfry[n] i return; inaczej zapis(n / k, k), a potem cout << cyfry[n % k].',
            tests: (r) => [
                '6\n0 2\n0 16\n1 3\n15 16\n16 16\n9 10',
                '8\n1000 2\n1000 3\n1000 7\n1000 8\n1000 9\n1000 11\n1000 15\n1000 16',
                '4\n1000000000000000000 16\n1000000000000000000 2\n999999999999999999 7\n123456789012345678 13',
                '50\n' + Array.from({ length: 50 }, () => `${r.big(0, '1000000000000000000')} ${r.int(2, 16)}`).join('\n'),
                '100\n' + Array.from({ length: 100 }, () => `${r.int(0, 100000)} ${r.int(2, 16)}`).join('\n'),
            ],
            solve: (inp) => { const t = h.toks(inp); const o = []; for (let i = 1; i < t.length; i += 2) o.push(BigInt(t[i]).toString(Number(t[i + 1])).toUpperCase()); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
const string cyfry = "0123456789ABCDEF";
void zapis(long long n, int k) {
    if (n < k) { cout << cyfry[n]; return; }
    zapis(n / k, k);
    cout << cyfry[n % k];
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n; int k;
        cin >> n >> k;
        zapis(n, k);
        cout << "\n";
    }
}`,
        },
    ];
};
