// Rekurencja — baza zadań na koniec lekcji (krok 9): od prostych rekurencji na liczbach, przez memoizację, przeszukiwanie
// i rekurencję po drzewie, po pomysłowe rozwiązania przez połowienie — a na koniec wielki finał: kalkulator z nawiasami.
// Zadania idą od najłatwiejszych do najtrudniejszych (najpierw łatwe, potem średnie, na końcu trudne).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./rekurencja-pomoc');
    const { calk, B, losDlugi, nwdB, nwwB, czyPierwsza, MODN, plansza, D4 } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const bigOk = (s, lo, hi) => /^\d+$/.test(s) && B(s) >= B(lo) && B(s) <= B(hi);
    const E18 = '1000000000000000000';
    const listaT = (a) => `${a.length}\n${a.join('\n')}`;
    const checkT = (inp, tMax, lo, hi) => {
        const t = toks(inp); const n = Number(t[0]);
        return calk(n, 1, tMax) && t.length === n + 1 && t.slice(1).every((x) => bigOk(x, lo, hi)) ? null : 'dane';
    };
    const wierszeT = (w) => `${w.length}\n${w.map((x) => x.join(' ')).join('\n')}`;
    const checkWiersze = (inp, tMax, ile, ok) => {
        const L = linie(inp); const n = Number(L[0]);
        if (!calk(n, 1, tMax) || L.length !== n + 1) return 'dane';
        for (let i = 1; i <= n; i++) { const t = L[i].trim().split(/\s+/); if (t.length !== ile || !ok(t)) return 'dane'; }
        return null;
    };
    const losoweDuze = (r, k, lo = '0', hi = E18) => Array.from({ length: k }, () => String(losDlugi(r, lo, hi)));

    return [
        // ================================================================ ŁATWE
        {
            id: 'rk-b-schodki', krok: 9, level: 'latwe',
            title: 'Schodki bez pętli',
            short: 'W wierszu i stoją liczby od 1 do i. Dwie rekurencje zamiast dwóch pętli: jedna wypisuje wiersz, a druga wywołuje ją dla kolejnych wierszy.',
            tags: ['dwie funkcje rekurencyjne', 'rekurencja zamiast pętli', 'wypisywanie'],
            statement: ['Wczytaj n i wypisz schodki z liczb: w pierwszym wierszu 1, w drugim 1 2, w trzecim 1 2 3 i tak dalej, aż do wiersza z liczbami od 1 do n.',
                'Haczyk: w programie nie może być żadnej pętli. Napisz dwie funkcje rekurencyjne — jedną, która wypisuje jeden wiersz (liczby od j do i), i drugą, która wypisuje kolejne wiersze.'],
            input_format: ['W jedynym wierszu n.'],
            output_format: ['n wierszy schodków; liczby w wierszu oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '3' }],
            hint: R`void wiersz(int j, int i) { cout << j; if (j == i) { cout << "\n"; return; } cout << " "; wiersz(j + 1, i); } oraz void schodki(int i, int n) { if (i > n) return; wiersz(1, i); schodki(i + 1, n); }. Pętla zagnieżdżona w pętli zamienia się w rekurencję, która wywołuje inną rekurencję.`,
            tests: (r) => ['3', '1', '2', '50', String(r.int(10, 49))],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 50) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const w = []; for (let i = 1; i <= n; i++) w.push(Array.from({ length: i }, (_, j) => j + 1).join(' ')); return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wiersz(int j, int i) {
    cout << j;
    if (j == i) {
        cout << "\n";
        return;
    }
    cout << " ";
    wiersz(j + 1, i);
}
void schodki(int i, int n) {
    if (i > n) return;
    wiersz(1, i);
    schodki(i + 1, n);
}
int main() {
    int n;
    cin >> n;
    schodki(1, n);
    return 0;
}`,
        },
        {
            id: 'rk-b-suma-przedzialu', krok: 9, level: 'latwe',
            title: 'Suma od a do b',
            short: 'Suma wszystkich liczb całkowitych między a i b (włącznie): suma(a, b) = a + suma(a + 1, b). Uwaga na liczby ujemne i na a większe od b.',
            tags: ['return', 'dwa parametry', 'liczby ujemne'],
            statement: ['Dla każdej z t par liczb a i b policz sumę wszystkich liczb całkowitych leżących między nimi, razem z a i b. Liczba a może być większa od b — wtedy też liczymy sumę liczb od mniejszej do większej.',
                'Napisz funkcję rekurencyjną long long suma(int a, int b) dla a ≤ b: gdy a > b, przedział jest pusty i suma to 0; inaczej to a + suma(a + 1, b).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy — kolejne sumy.'],
            constraints: ['1 ≤ t ≤ 10', '−10 000 ≤ a, b ≤ 10 000'],
            examples: [{ input: '3\n1 100\n5 -2\n-3 -3', note: 'Dla 5 i −2 sumujemy −2, −1, 0, 1, 2, 3, 4, 5 — wychodzi 12.' }],
            hint: R`long long suma(int a, int b) { if (a > b) return 0; return a + suma(a + 1, b); }. W main, jeśli a > b, zamień je miejscami: if (a > b) swap(a, b);. Głębokość rekurencji to najwyżej 20 001 — w sam raz.`,
            tests: (r) => [wierszeT([['1', '100'], ['5', '-2'], ['-3', '-3']]), wierszeT([['-10000', '10000'], ['10000', '-10000'], ['10000', '10000'], ['-10000', '-9999'], ['0', '0']]), wierszeT(Array.from({ length: 10 }, () => [String(r.int(-10000, 10000)), String(r.int(-10000, 10000))]))],
            check: (inp) => checkWiersze(inp, 10, 2, (t) => t.every((x) => /^-?\d+$/.test(x) && calk(Number(x), -10000, 10000))),
            solve: (inp) => linie(inp).slice(1).map((l) => { let [a, b] = l.trim().split(/\s+/).map(Number); if (a > b) [a, b] = [b, a]; return String((a + b) * (b - a + 1) / 2); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long suma(int a, int b) {
    if (a > b) return 0;
    return a + suma(a + 1, b);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int a, b;
        cin >> a >> b;
        if (a > b) swap(a, b);
        cout << suma(a, b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-ile-jedynek', krok: 9, level: 'latwe',
            title: 'Jedynki w zapisie dwójkowym',
            short: 'Ile jedynek ma liczba zapisana dwójkowo? Ostatnia cyfra dwójkowa to n % 2, a resztę zapisu tworzy n / 2 — tak samo jak z cyframi dziesiętnymi.',
            tags: ['zapis dwójkowy', 'n % 2 i n / 2', 'long long'],
            statement: ['Dla każdej z t liczb policz, ile jedynek ma jej zapis dwójkowy. Na przykład 5 to dwójkowo 101 — dwie jedynki, a 255 to 11111111 — osiem jedynek.',
                'Napisz funkcję rekurencyjną int jedynki(long long n): dla zera to 0, a w pozostałych przypadkach ostatnia cyfra dwójkowa (n % 2) plus liczba jedynek w n / 2.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — liczby jedynek.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n5\n0\n255' }],
            hint: R`int jedynki(long long n) { if (n == 0) return 0; return n % 2 + jedynki(n / 2); }. Nie musisz budować zapisu dwójkowego — wystarczy liczyć ostatnie cyfry. Głębokość to około 60.`,
            tests: (r) => [listaT(['5', '0', '255']), listaT([E18, '1', String(2n ** 59n - 1n), String(2n ** 59n), '999999999999999999']), listaT(losoweDuze(r, 1000))],
            check: (inp) => checkT(inp, 1000, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => String(B(x).toString(2).split('').filter((c) => c === '1').length)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int jedynki(long long n) {
    if (n == 0) return 0;
    return n % 2 + jedynki(n / 2);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << jedynki(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-zera-na-koncu', krok: 9, level: 'latwe',
            title: 'Zera na końcu',
            short: 'Ile zer stoi na końcu liczby i jaka liczba zostanie, gdy je zetrzesz? Dwie krótkie rekurencje: jedna liczy zera, druga oddaje liczbę bez nich.',
            tags: ['dwie funkcje rekurencyjne', 'n % 10 i n / 10', 'long long'],
            statement: ['Dla każdej z t liczb wypisz, ile zer stoi na jej końcu, oraz liczbę, która zostanie po starciu tych zer. Na przykład 12000 ma na końcu 3 zera, a po ich starciu zostaje 12.',
                'Napisz dwie funkcje rekurencyjne: int zera(long long n) i long long bezZer(long long n). Obie kończą pracę, gdy ostatnia cyfra nie jest zerem.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy: liczba zer na końcu i liczba bez tych zer, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n12000\n7\n1000000000000000000' }],
            hint: R`int zera(long long n) { if (n % 10 != 0) return 0; return 1 + zera(n / 10); } i long long bezZer(long long n) { if (n % 10 != 0) return n; return bezZer(n / 10); }. Liczba n ≥ 1 zawsze ma jakąś niezerową cyfrę, więc rekurencja na pewno się zatrzyma. Dla n = 0 tak by nie było!`,
            tests: (r) => [listaT(['12000', '7', E18]), listaT(['1', '10', '100000000000000001', '999999999999999990', '505000']), listaT(Array.from({ length: 1000 }, () => String(losDlugi(r, 1n, 999999999n) * 10n ** B(r.int(0, 9)))))],
            check: (inp) => checkT(inp, 1000, '1', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => { const m = x.match(/0*$/)[0].length; return `${m} ${x.slice(0, x.length - m)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int zera(long long n) {
    if (n % 10 != 0) return 0;
    return 1 + zera(n / 10);
}
long long bezZer(long long n) {
    if (n % 10 != 0) return n;
    return bezZer(n / 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << zera(n) << " " << bezZer(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-domek-z-kart', krok: 9, level: 'latwe',
            title: 'Domek z kart',
            short: 'Domek z kart o n piętrach to najniższe piętro (n par kart opartych o siebie i n − 1 kart leżących na nich) oraz domek o n − 1 piętrach na górze: K(n) = K(n − 1) + 3n − 1.',
            tags: ['rekurencja z przepisu', 'return', 'long long'],
            statement: ['Bajtek buduje domki z kart. Domek o n piętrach wygląda tak: na najniższym piętrze stoi n „namiotów” — par kart opartych o siebie — a na nich leży n − 1 kart poziomych. Na tych kartach stoi domek o n − 1 piętrach. Domek o 0 piętrach nie ma żadnych kart.',
                'Dla każdego z t domków policz, ile kart potrzeba. Napisz funkcję rekurencyjną long long karty(long long n), która korzysta z tego, że domek o n piętrach to 2n + (n − 1) = 3n − 1 kart najniższego piętra plus domek o n − 1 piętrach.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba n.'],
            output_format: ['t wierszy — liczby kart.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 100 000'],
            examples: [{ input: '3\n1\n2\n3', note: 'Jedno piętro to jeden namiot (2 karty). Dwa piętra: 2 namioty, 1 karta pozioma i namiot na górze — 7 kart.' }],
            hint: R`long long karty(long long n) { if (n == 0) return 0; return 3 * n - 1 + karty(n - 1); }. Głębokość rekurencji sięga 100 000 — to bezpieczne na sprawdzarce. Wynik dla n = 100 000 przekracza zakres int.`,
            tests: (r) => [listaT(['1', '2', '3']), listaT(['100000', '99999', '4', '10']), listaT(Array.from({ length: 10 }, () => String(r.int(1, 100000))))],
            check: (inp) => checkT(inp, 10, '1', '100000'),
            solve: (inp) => toks(inp).slice(1).map((x) => { const n = B(x); return String(n * (3n * n + 1n) / 2n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long karty(long long n) {
    if (n == 0) return 0;
    return 3 * n - 1 + karty(n - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << karty(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-cyfry-parzyste', krok: 9, level: 'latwe',
            title: 'Parzyste cyfry od lewej',
            short: 'Wypisz parzyste cyfry liczby w kolejności od lewej. Najpierw rekurencja dla n / 10, a dopiero potem ostatnia cyfra — ale tylko wtedy, gdy jest parzysta.',
            tags: ['cout po wywołaniu', 'warunek przy wypisywaniu', 'BRAK'],
            statement: ['Dla każdej z t liczb wypisz jej parzyste cyfry (0, 2, 4, 6, 8) w kolejności, w jakiej stoją w liczbie, bez spacji. Jeśli liczba nie ma żadnej parzystej cyfry, wypisz BRAK.',
                'Napisz funkcję rekurencyjną void parzyste(long long n), która najpierw wywołuje samą siebie dla n / 10, a potem wypisuje ostatnią cyfrę, jeśli jest parzysta. Drugą funkcją rekurencyjną policz, ile jest parzystych cyfr — żeby wiedzieć, kiedy wypisać BRAK.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — parzyste cyfry albo BRAK.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n12345\n2468\n135' }],
            hint: R`void parzyste(long long n) { if (n == 0) return; parzyste(n / 10); if (n % 10 % 2 == 0) cout << n % 10; } i int ile(long long n) { if (n == 0) return 0; return (n % 10 % 2 == 0) + ile(n / 10); }. Stop przy n == 0 jest tu dobry, bo n ≥ 1 — zero „po lewej stronie” liczby nie zostanie wypisane.`,
            tests: (r) => [listaT(['12345', '2468', '135']), listaT(['1', '10', E18, '999999999999999999', '13579', '20202']), listaT(Array.from({ length: 100 }, () => (r() < 0.2 ? r.word(r.int(1, 18), '13579') : String(losDlugi(r, 1n, B(E18))))))],
            check: (inp) => checkT(inp, 100, '1', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => x.split('').filter((c) => Number(c) % 2 === 0).join('') || 'BRAK').join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void parzyste(long long n) {
    if (n == 0) return;
    parzyste(n / 10);
    if (n % 10 % 2 == 0) cout << n % 10;
}
int ile(long long n) {
    if (n == 0) return 0;
    return (n % 10 % 2 == 0) + ile(n / 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        if (ile(n) == 0) cout << "BRAK";
        else parzyste(n);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-nwd-trzech', krok: 9, level: 'latwe',
            title: 'NWD i NWW trzech liczb',
            short: 'NWD(a, b, c) = NWD(NWD(a, b), c) — i tak samo NWW. Jedna rekurencyjna funkcja nwd wystarczy do obu.',
            tags: ['NWD rekurencyjnie', 'NWW przez NWD', 'long long'],
            statement: ['Dla każdej z t trójek liczb a, b, c wypisz ich największy wspólny dzielnik i najmniejszą wspólną wielokrotność.',
                'Napisz funkcję rekurencyjną long long nwd(long long a, long long b) (algorytm Euklidesa). NWD trzech liczb to nwd(nwd(a, b), c), a NWW — nww(nww(a, b), c), gdzie nww(x, y) = x / nwd(x, y) · y.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy trzy liczby całkowite a, b, c.'],
            output_format: ['t wierszy: NWD i NWW, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b, c ≤ 10⁶'],
            examples: [{ input: '2\n12 18 30\n7 5 3' }],
            hint: R`long long nwd(long long a, long long b) { if (b == 0) return a; return nwd(b, a % b); } i long long nww(long long a, long long b) { return a / nwd(a, b) * b; }. NWW trzech liczb do 10⁶ może sięgać 10¹⁸ — long long, i najpierw dziel, potem mnóż.`,
            tests: (r) => {
                const tr = () => { const g = r.int(1, 1000); return [g * r.int(1, Math.floor(1e6 / g)), g * r.int(1, Math.floor(1e6 / g)), g * r.int(1, Math.floor(1e6 / g))].map(String); };
                return [wierszeT([['12', '18', '30'], ['7', '5', '3']]), wierszeT([['1000000', '999999', '999998'], ['1', '1', '1'], ['1000000', '1000000', '1000000'], ['999983', '999979', '999961']]), wierszeT(Array.from({ length: 1000 }, () => (r() < 0.5 ? tr() : [String(r.int(1, 1e6)), String(r.int(1, 1e6)), String(r.int(1, 1e6))])))];
            },
            check: (inp) => checkWiersze(inp, 1000, 3, (t) => t.every((x) => bigOk(x, '1', '1000000'))),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, b, c] = l.trim().split(/\s+/).map(B); return `${nwdB(nwdB(a, b), c)} ${nwwB(nwwB(a, b), c)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    if (b == 0) return a;
    return nwd(b, a % b);
}
long long nww(long long a, long long b) {
    return a / nwd(a, b) * b;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, c;
        cin >> a >> b >> c;
        cout << nwd(nwd(a, b), c) << " " << nww(nww(a, b), c) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-dwojkowo-k', krok: 9, level: 'latwe',
            title: 'Dwójkowo na k bitach',
            short: 'Zapisz liczbę dwójkowo na dokładnie k pozycjach, z zerami z przodu. Rekurencja z licznikiem bitów: najpierw starsze bity, potem n % 2.',
            tags: ['zapis dwójkowy', 'licznik w parametrze', 'cout po wywołaniu'],
            statement: ['Rejestr w procesorze ma k bitów. Dla każdej z t par n i k wypisz zapis dwójkowy liczby n na dokładnie k bitach — z zerami z przodu, jeśli trzeba. Na przykład 5 na 8 bitach to 00000101.',
                'Napisz funkcję rekurencyjną void bity(long long n, int k), która wypisuje k ostatnich bitów liczby n: dla k = 0 nic, a inaczej najpierw bity(n / 2, k − 1), a potem n % 2.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby n i k.'],
            output_format: ['t wierszy, każdy z dokładnie k znaków 0 i 1.'],
            constraints: ['1 ≤ t ≤ 400', '1 ≤ k ≤ 60', '0 ≤ n < 2ᵏ'],
            examples: [{ input: '3\n5 8\n0 3\n1 1' }],
            hint: R`void bity(long long n, int k) { if (k == 0) return; bity(n / 2, k - 1); cout << n % 2; }. Zera z przodu pojawiają się same: gdy n spadnie do 0, n % 2 wypisuje 0 aż do wyczerpania licznika k.`,
            tests: (r) => {
                const para = () => { const k = r.int(1, 60); return [String(r.big(0n, 2n ** B(k) - 1n)), String(k)]; };
                return [wierszeT([['5', '8'], ['0', '3'], ['1', '1']]), wierszeT([[String(2n ** 60n - 1n), '60'], ['0', '60'], [String(2n ** 59n), '60'], ['1', '60'], ['6', '3']]), wierszeT(Array.from({ length: 400 }, para))];
            },
            check: (inp) => checkWiersze(inp, 400, 2, (t) => { const k = Number(t[1]); return calk(k, 1, 60) && /^\d+$/.test(t[0]) && B(t[0]) < 2n ** B(k); }),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [n, k] = l.trim().split(/\s+/); return B(n).toString(2).padStart(Number(k), '0'); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void bity(long long n, int k) {
    if (k == 0) return;
    bity(n / 2, k - 1);
    cout << n % 2;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        int k;
        cin >> n >> k;
        bity(n, k);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-zdanie-wspak', krok: 9, level: 'latwe',
            title: 'Zdanie wspak',
            short: 'Wczytuj słowa do końca danych i wypisz je w odwrotnej kolejności — bez tablicy. Rekurencja: wczytaj słowo, zejdź głębiej, wypisz słowo w drodze powrotnej.',
            tags: ['cin w rekurencji', 'koniec danych', 'cout po wywołaniu'],
            statement: ['Wejście zawiera słowa oddzielone spacjami i enterami — nie wiadomo, ile ich jest. Wypisz je w jednym wierszu w odwrotnej kolejności, oddzielone pojedynczymi spacjami.',
                'Nie używaj tablicy ani vectora. Napisz funkcję rekurencyjną void wspak(), która próbuje wczytać słowo: jeśli się nie udało (koniec danych) — kończy; inaczej najpierw wywołuje samą siebie, a potem wypisuje swoje słowo.'],
            input_format: ['Słowa z liter i cyfr, oddzielone spacjami i znakami nowego wiersza.'],
            output_format: ['W jednym wierszu wszystkie słowa w odwrotnej kolejności.'],
            constraints: ['Słów jest od 1 do 2000.', 'Każde słowo ma od 1 do 10 znaków.'],
            examples: [{ input: 'Ala ma kota\ni psa', note: 'Podział na wiersze nie ma znaczenia — liczy się kolejność słów.' }],
            hint: R`void wspak() { string s; if (!(cin >> s)) return; wspak(); cout << s << " "; }. Wyrażenie cin >> s jest fałszywe, gdy nie udało się wczytać słowa — to jest warunek stopu. Spacja na końcu wiersza nie przeszkadza sprawdzarce.`,
            tests: (r) => {
                const sl = () => (r() < 0.8 ? r.pick(P.SLOWA) : r.word(r.int(1, 10), 'abcdefghijklmnopqrstuvwxyz0123456789')).slice(0, 10);
                return ['Ala ma kota\ni psa', 'raz', P.rozrzuc(r, Array.from({ length: 2000 }, sl)), P.rozrzuc(r, Array.from({ length: 30 }, sl), 'kolumna'), P.rozrzuc(r, Array.from({ length: 300 }, sl))];
            },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 2000 && t.every((x) => /^[A-Za-z0-9]{1,10}$/.test(x)) ? null : 'dane'; },
            solve: (inp) => toks(inp).reverse().join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wspak() {
    string s;
    if (!(cin >> s)) return;
    wspak();
    cout << s << " ";
}
int main() {
    wspak();
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-collatz-szczyt', krok: 9, level: 'latwe',
            title: 'Najwyższy punkt lotu',
            short: 'Ciąg Collatza: parzystą liczbę dziel przez 2, nieparzystą zamieniaj na 3n + 1, aż dojdziesz do 1. Jak wysoko „poleci” liczba? szczyt(n) = max(n, szczyt(następnej)).',
            tags: ['return max(…)', 'ciąg z przepisu', 'long long'],
            statement: ['Weź liczbę n. Jeśli jest parzysta, podziel ją przez 2, a jeśli nieparzysta — zamień na 3n + 1. Powtarzaj, aż dojdziesz do 1 (dla wszystkich liczb z zadania tak się dzieje). Liczby po drodze potrafią mocno urosnąć: 7 → 22 → 11 → 34 → 17 → 52 → 26 → … → 1. Dla każdej z t liczb wypisz największą wartość, jaka pojawi się w jej ciągu (licząc też samo n).',
                'Napisz funkcję rekurencyjną long long szczyt(long long n): dla n = 1 to 1, a inaczej większa z liczb n i szczyt(następnej liczby w ciągu).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba n.'],
            output_format: ['t wierszy — najwyższe wartości.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10⁶'],
            examples: [{ input: '3\n6\n1\n7', note: '6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1, najwyżej 16.' }],
            hint: R`long long szczyt(long long n) { if (n == 1) return 1; long long nast = (n % 2 == 0) ? n / 2 : 3 * n + 1; return max(n, szczyt(nast)); }. Wartości po drodze przekraczają zakres int (dla n ≤ 10⁶ dochodzą do ponad 5 · 10¹⁰), dlatego long long. Ciąg ma najwyżej kilkaset wyrazów, więc głębokość rekurencji jest mała.`,
            tests: (r) => [listaT(['6', '1', '7']), listaT(['1000000', '999999', '837799', '77031', '27', '2']), listaT(Array.from({ length: 1000 }, () => String(r.int(1, 1000000))))],
            check: (inp) => checkT(inp, 1000, '1', '1000000'),
            solve: (inp) => toks(inp).slice(1).map((x) => { let n = Number(x), m = n; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; if (n > m) m = n; } return String(m); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long szczyt(long long n) {
    if (n == 1) return 1;
    long long nast = (n % 2 == 0) ? n / 2 : 3 * n + 1;
    return max(n, szczyt(nast));
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << szczyt(n) << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'rk-b-zlodziej', krok: 9, level: 'srednie',
            title: 'Złodziej w szeregowcu',
            short: 'Z domów stojących w rzędzie nie wolno okraść dwóch sąsiednich. Jaki największy łup? Przy domu i: albo go pomijasz, albo bierzesz i przeskakujesz sąsiada — z pamięcią.',
            tags: ['memoizacja', 'wybór: biorę albo nie', 'long long'],
            statement: ['W szeregowcu stoi n domów, w i-tym jest skarb wart aᵢ. Złodziej nie może okraść dwóch sąsiednich domów — włączy się alarm. Jaką największą wartość może ukraść?',
                'Napisz funkcję rekurencyjną long long lup(int i) — największy łup z domów od i do końca. Przy domu i są dwie możliwości: pominąć go (lup(i + 1)) albo okraść i przeskoczyć sąsiada (aᵢ + lup(i + 2)). Bez pamięci liczba wywołań rośnie jak ciąg Fibonacciego — zapamiętuj wyniki.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych aᵢ.'],
            output_format: ['Jedna liczba — największy możliwy łup.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ aᵢ ≤ 10⁶'],
            examples: [{ input: '5\n2 7 9 3 1', note: 'Domy 1, 3 i 5: 2 + 9 + 1 = 12. Dom 2 (7) kusi, ale wtedy odpada sąsiadujący z nim dom 3 (9).' }],
            hint: R`long long lup(int i) { if (i >= n) return 0; if (jest[i]) return memo[i]; memo[i] = max(lup(i + 1), a[i] + lup(i + 2)); jest[i] = true; return memo[i]; }. Warunek i >= n łapie oba „wyjścia za szeregowiec” — i == n oraz i == n + 1.`,
            tests: (r) => {
                const z = (a) => `${a.length}\n${a.join(' ')}`;
                return [z([2, 7, 9, 3, 1]), z([5]), z([1, 2]), z(r.arr(10000, 0, 1000000)), z(r.arr(10000, 0, 10)), z(new Array(10000).fill(1000000)), z(r.arr(30, 0, 100))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const n = a.length; const f = new Array(n + 2).fill(0); for (let i = n - 1; i >= 0; i--) f[i] = Math.max(f[i + 1], a[i] + f[i + 2]); return String(f[0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
long long a[10005], memo[10005];
bool jest[10005];
long long lup(int i) {
    if (i >= n) return 0;
    if (jest[i]) return memo[i];
    memo[i] = max(lup(i + 1), a[i] + lup(i + 2));
    jest[i] = true;
    return memo[i];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(jest, 0, sizeof jest);
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << lup(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-trojkat-liczb', krok: 9, level: 'srednie',
            title: 'Droga w dół trójkąta',
            short: 'Z wierzchołka trójkąta liczb schodzisz w dół, zawsze na jedną z dwóch liczb pod spodem. Jaka największa suma? najlepsza(r, c) = liczba + większa z dróg niżej — z pamięcią.',
            tags: ['memoizacja 2D', 'max z dwóch wyborów', 'trójkąt'],
            statement: ['Liczby ułożono w trójkąt o n wierszach: w wierszu r (od 1) stoi r liczb. Zaczynasz na samej górze i schodzisz wiersz po wierszu — z liczby w kolumnie c możesz zejść na liczbę w kolumnie c albo c + 1 w następnym wierszu. Jaka jest największa suma liczb na drodze z góry do dolnego wiersza?',
                'Napisz funkcję rekurencyjną int najlepsza(int r, int c): w dolnym wierszu to sama liczba, a wyżej — liczba plus większa z wartości najlepsza(r + 1, c) i najlepsza(r + 1, c + 1). Wyniki zapamiętuj — bez tego drogi liczyłyby się wiele razy.'],
            input_format: ['W pierwszym wierszu n.', 'W r-tym z kolejnych n wierszy r liczb całkowitych.'],
            output_format: ['Jedna liczba — największa suma.'],
            constraints: ['1 ≤ n ≤ 100', '−10 000 ≤ każda liczba ≤ 10 000'],
            examples: [{ input: '4\n3\n7 4\n2 4 6\n8 5 9 3', note: 'Najlepsza droga: 3 → 7 → 4 → 9 = 23. Zachłanne schodzenie na większą liczbę też tu działa, ale nie zawsze!' }],
            hint: R`int najlepsza(int r, int c) { if (r == n - 1) return a[r][c]; if (jest[r][c]) return memo[r][c]; memo[r][c] = a[r][c] + max(najlepsza(r + 1, c), najlepsza(r + 1, c + 1)); jest[r][c] = true; return memo[r][c]; }. Bez pamięci dróg jest 2ⁿ⁻¹ — dla n = 100 to więcej niż atomów na Ziemi.`,
            tests: (r) => {
                const z = (n, lo, hi) => `${n}\n${Array.from({ length: n }, (_, i) => r.arr(i + 1, lo, hi).join(' ')).join('\n')}`;
                return ['4\n3\n7 4\n2 4 6\n8 5 9 3', '1\n-5', '3\n1\n9 1\n1 1 100', z(100, -10000, 10000), z(100, 0, 99), z(100, -10000, -1), z(20, -50, 50)];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 100) || L.length !== n + 1) return 'dane'; for (let i = 1; i <= n; i++) { const t = L[i].trim().split(/\s+/).map(Number); if (t.length !== i || !t.every((x) => calk(x, -10000, 10000))) return 'dane'; } return null; },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const a = L.slice(1).map((w) => w.trim().split(/\s+/).map(Number)); let f = a[n - 1].slice(); for (let r = n - 2; r >= 0; r--) f = a[r].map((x, c) => x + Math.max(f[c], f[c + 1])); return String(f[0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, a[105][105], memo[105][105];
bool jest[105][105];
int najlepsza(int r, int c) {
    if (r == n - 1) return a[r][c];
    if (jest[r][c]) return memo[r][c];
    memo[r][c] = a[r][c] + max(najlepsza(r + 1, c), najlepsza(r + 1, c + 1));
    jest[r][c] = true;
    return memo[r][c];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(jest, 0, sizeof jest);
    cin >> n;
    for (int r = 0; r < n; r++)
        for (int c = 0; c <= r; c++) cin >> a[r][c];
    cout << najlepsza(0, 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-liczby-schodkowe', krok: 9, level: 'srednie',
            title: 'Liczby schodkowe',
            short: 'W liczbie schodkowej sąsiednie cyfry różnią się o 1, na przykład 4545 albo 1210. Ile jest n-cyfrowych liczb schodkowych? Zapamiętuj wyniki dla par (ile cyfr zostało, ostatnia cyfra).',
            tags: ['memoizacja 2D', 'stan: ostatnia cyfra', 'long long'],
            statement: ['Liczba jest schodkowa, jeśli każde dwie sąsiednie cyfry różnią się dokładnie o 1 — na przykład 4545, 1210 albo 7. Dla każdego z t zapytań policz, ile jest dodatnich n-cyfrowych liczb schodkowych (bez zera na początku).',
                'Napisz funkcję rekurencyjną long long dopisz(int ile, int ostatnia) — na ile sposobów można dopisać jeszcze ile cyfr za cyfrą ostatnia: gdy ile == 0, jest jeden sposób; inaczej następna cyfra to ostatnia − 1 albo ostatnia + 1 (o ile jest od 0 do 9). Odpowiedź to suma dopisz(n − 1, c) po pierwszych cyfrach c od 1 do 9. Wyniki zapamiętuj.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba n.'],
            output_format: ['t wierszy — liczby n-cyfrowych liczb schodkowych.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 60'],
            examples: [{ input: '2\n1\n2', note: 'Jednocyfrowe: 1, …, 9. Dwucyfrowe: 10, 12, 21, 23, …, 89, 98 — jest ich 17.' }],
            hint: R`long long memo[61][10]; bool jest[61][10]; long long dopisz(int ile, int c) { if (ile == 0) return 1; if (jest[ile][c]) return memo[ile][c]; long long w = 0; if (c > 0) w += dopisz(ile - 1, c - 1); if (c < 9) w += dopisz(ile - 1, c + 1); jest[ile][c] = true; return memo[ile][c] = w; }. Stanów jest tylko 61 · 10, choć samych liczb są tryliony.`,
            tests: (r) => [listaT(['1', '2']), listaT(['60', '59', '3', '10', '40']), listaT(Array.from({ length: 100 }, () => String(r.int(1, 60))))],
            check: (inp) => checkT(inp, 100, '1', '60'),
            solve: (inp) => { const wyn = [0n]; let f = [0n, 1n, 1n, 1n, 1n, 1n, 1n, 1n, 1n, 1n]; wyn.push(9n); for (let i = 2; i <= 60; i++) { const g = new Array(10).fill(0n); for (let d = 0; d < 10; d++) { if (d > 0) g[d - 1] += f[d]; if (d < 9) g[d + 1] += f[d]; } f = g; wyn.push(f.reduce((a, b) => a + b, 0n)); } return toks(inp).slice(1).map((x) => String(wyn[Number(x)])).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long memo[61][10];
bool jest[61][10];
long long dopisz(int ile, int c) {
    if (ile == 0) return 1;
    if (jest[ile][c]) return memo[ile][c];
    long long w = 0;
    if (c > 0) w += dopisz(ile - 1, c - 1);
    if (c < 9) w += dopisz(ile - 1, c + 1);
    jest[ile][c] = true;
    memo[ile][c] = w;
    return w;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        long long w = 0;
        for (int c = 1; c <= 9; c++) w += dopisz(n - 1, c);
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-hanoi-sasiednie', krok: 9, level: 'srednie',
            title: 'Hanoi na sąsiednie pręty',
            short: 'Pręty A, B, C stoją w rzędzie, a krążki wolno przenosić tylko między sąsiednimi prętami (A–B i B–C). Każde przeniesienie wieży z końca na koniec to pięć kroków — razem 3ⁿ − 1 ruchów.',
            tags: ['wieże Hanoi', 'pięć kroków rekurencji', 'wypisywanie ruchów'],
            statement: ['Na pręcie A leży n krążków, od największego (n) na dole do najmniejszego (1) na górze. Trzeba przenieść całą wieżę na pręt C. Jeden ruch to przełożenie górnego krążka z jednego pręta na drugi; nigdy nie wolno kłaść większego krążka na mniejszy. Haczyk: pręty stoją w rzędzie A, B, C i wolno przenosić krążki tylko między sąsiednimi prętami — między A i B albo między B i C.',
                'Przeniesienie n krążków z jednego końca (A albo C) na drugi koniec zrób tak: przenieś n − 1 górnych krążków na drugi koniec, przełóż krążek n na B, przenieś n − 1 krążków z powrotem na pierwszy koniec, przełóż krążek n z B na drugi koniec i na koniec przenieś n − 1 krążków na drugi koniec. Wypisz liczbę ruchów i wszystkie ruchy w tej kolejności.'],
            input_format: ['W jedynym wierszu n.'],
            output_format: ['W pierwszym wierszu liczba ruchów.', 'W kolejnych wierszach ruchy w formacie X->Y (skąd i dokąd).'],
            constraints: ['1 ≤ n ≤ 7'],
            examples: [{ input: '1', note: 'Jedyny krążek musi przejść przez środkowy pręt: A->B, potem B->C.' }],
            hint: R`void przenies(int n, char z, char na) { if (n == 0) return; przenies(n - 1, z, na); cout << z << "->B\n"; przenies(n - 1, na, z); cout << "B->" << na << "\n"; przenies(n - 1, z, na); }. Wywołanie przenies(n, 'A', 'C') — z i na to zawsze końce rzędu (A i C), a środkiem jest B. Liczba ruchów: R(n) = 3 · R(n − 1) + 2, czyli 3ⁿ − 1.`,
            tests: () => ['1', '2', '3', '7', '5'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 7) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const w = []; const pr = (k, z, na) => { if (k === 0) return; pr(k - 1, z, na); w.push(`${z}->B`); pr(k - 1, na, z); w.push(`B->${na}`); pr(k - 1, z, na); }; pr(n, 'A', 'C'); return `${w.length}\n${w.join('\n')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void przenies(int n, char z, char na) {
    if (n == 0) return;
    przenies(n - 1, z, na);
    cout << z << "->B\n";
    przenies(n - 1, na, z);
    cout << "B->" << na << "\n";
    przenies(n - 1, z, na);
}
int main() {
    int n;
    cin >> n;
    long long ruchy = 1;
    for (int i = 0; i < n; i++) ruchy *= 3;
    cout << ruchy - 1 << "\n";
    przenies(n, 'A', 'C');
    return 0;
}`,
        },
        {
            id: 'rk-b-skoczek', krok: 9, level: 'srednie',
            title: 'Skoczek w k ruchach',
            short: 'Na ile różnych pól może trafić skoczek szachowy w co najwyżej k ruchach, jeśli na zajętych polach nie może stanąć? Przeszukiwanie rekurencyjne na głębokość k.',
            tags: ['przeszukiwanie na głębokość k', 'ruchy skoczka', 'tablica odwiedzonych'],
            statement: ['Plansza ma n × n pól; pola zajęte oznaczono #, wolne — kropką. Skoczek szachowy stoi na wolnym polu w wierszu r i kolumnie c (numerowane od 1). Skoczek rusza się „w kształt litery L”: o 2 pola w jednym kierunku i o 1 w prostopadłym (8 możliwości). Może przeskakiwać nad zajętymi polami, ale nie może na nich stanąć ani wyjść poza planszę. Na ile różnych pól może trafić w co najwyżej k ruchach (licząc pole startowe)?',
                'Napisz funkcję rekurencyjną void skacz(int x, int y, int zostalo), która zaznacza pole (x, y) jako osiągnięte i — jeśli zostały jeszcze ruchy — wywołuje samą siebie dla każdego dozwolonego skoku z zostalo − 1. Wynik to liczba zaznaczonych pól.'],
            input_format: ['W pierwszym wierszu cztery liczby n, k, r i c.', 'W każdym z n kolejnych wierszy n znaków: # albo kropka.'],
            output_format: ['Jedna liczba — ile różnych pól może odwiedzić skoczek.'],
            constraints: ['1 ≤ n ≤ 8', '0 ≤ k ≤ 6'],
            examples: [{ input: '4 1 1 1\n....\n....\n....\n....', note: 'Z rogu skoczek ma tylko dwa skoki — razem z polem startowym to 3 pola.' }],
            hint: R`int dx[8] = {1, 2, 2, 1, -1, -2, -2, -1}, dy[8] = {2, 1, -1, -2, -2, -1, 1, 2}; void skacz(int x, int y, int zostalo) { osiagniete[x][y] = true; if (zostalo == 0) return; for (int d = 0; d < 8; d++) { int nx = x + dx[d], ny = y + dy[d]; if (nx < 0 || ny < 0 || nx >= n || ny >= n || g[nx][ny] == '#') continue; skacz(nx, ny, zostalo - 1); } }. Nie przerywaj na polu już osiągniętym — mogłeś tam dojść wcześniej „dłuższą drogą” i mieć teraz więcej ruchów w zapasie. 8⁶ to tylko 262 144 wywołania.`,
            tests: (r) => {
                const z = (n, k, p) => { const g = plansza(r, n, n, p).map((w) => w.split('')); const x = r.int(0, n - 1), y = r.int(0, n - 1); g[x][y] = '.'; return `${n} ${k} ${x + 1} ${y + 1}\n${g.map((w) => w.join('')).join('\n')}`; };
                return ['4 1 1 1\n....\n....\n....\n....', '1 6 1 1\n.', z(8, 6, 0), z(8, 6, 0.3), z(8, 3, 0.2), z(8, 0, 0.5), z(5, 6, 0.1), z(8, 2, 0), z(3, 6, 0)];
            },
            check: (inp) => { const L = linie(inp); const [n, k, x, y] = L[0].split(' ').map(Number); if (!calk(n, 1, 8) || !calk(k, 0, 6) || !calk(x, 1, n) || !calk(y, 1, n) || L.length !== n + 1) return 'dane'; if (!L.slice(1).every((w) => w.length === n && /^[.#]+$/.test(w))) return 'dane'; return L[x][y - 1] === '.' ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const [n, k, x, y] = L[0].split(' ').map(Number); const g = L.slice(1); const dist = Array.from({ length: n }, () => new Array(n).fill(-1)); const q = [[x - 1, y - 1]]; dist[x - 1][y - 1] = 0; const M = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]; let ile = 0; while (q.length) { const [a, b] = q.shift(); ile++; if (dist[a][b] === k) continue; for (const [dx, dy] of M) { const c = a + dx, d = b + dy; if (c < 0 || d < 0 || c >= n || d >= n || g[c][d] === '#' || dist[c][d] >= 0) continue; dist[c][d] = dist[a][b] + 1; q.push([c, d]); } } return String(ile); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
string g[8];
bool osiagniete[8][8];
int dx[8] = {1, 2, 2, 1, -1, -2, -2, -1};
int dy[8] = {2, 1, -1, -2, -2, -1, 1, 2};
void skacz(int x, int y, int zostalo) {
    osiagniete[x][y] = true;
    if (zostalo == 0) return;
    for (int d = 0; d < 8; d++) {
        int nx = x + dx[d], ny = y + dy[d];
        if (nx < 0 || ny < 0 || nx >= n || ny >= n || g[nx][ny] == '#') continue;
        skacz(nx, ny, zostalo - 1);
    }
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(osiagniete, 0, sizeof osiagniete);
    int k, r, c;
    cin >> n >> k >> r >> c;
    for (int i = 0; i < n; i++) cin >> g[i];
    skacz(r - 1, c - 1, k);
    int ile = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (osiagniete[i][j]) ile++;
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-podzial-na-slowa', krok: 9, level: 'srednie',
            title: 'Podział na słowa',
            short: 'Tekst bez spacji i słownik. Na ile sposobów da się pociąć tekst na słowa ze słownika? sposoby(i) = suma wyników dla pozycji za każdym słowem pasującym od i — z pamięcią.',
            tags: ['memoizacja na napisie', 'pętla po słowniku', 'modulo'],
            statement: ['Ktoś napisał zdanie bez spacji, na przykład alamakota. Masz słownik d słów. Na ile sposobów można pociąć tekst na kawałki tak, żeby każdy kawałek był słowem ze słownika? Słów można używać wiele razy. Wynik podaj modulo 1 000 000 007.',
                'Napisz funkcję rekurencyjną long long sposoby(int i) — na ile sposobów można pociąć końcówkę tekstu od pozycji i. Na samym końcu tekstu jest jeden sposób (nic nie zostało). Inaczej sprawdź każde słowo ze słownika: jeśli tekst od pozycji i zaczyna się tym słowem, dolicz sposoby(i + długość słowa). Wyniki zapamiętuj.'],
            input_format: ['W pierwszym wierszu d.', 'W drugim wierszu d różnych słów słownika.', 'W trzecim wierszu tekst.'],
            output_format: ['Jedna liczba — liczba sposobów modulo 1 000 000 007 (może być 0).'],
            constraints: ['1 ≤ d ≤ 50', 'Słowa mają od 1 do 10 małych liter.', '1 ≤ długość tekstu ≤ 2000, tekst składa się z małych liter.'],
            examples: [{ input: '6\nala ma kota alama ko ta\nalamakota', note: 'ala|ma|kota, ala|ma|ko|ta, alama|kota i alama|ko|ta.' }],
            hint: R`long long sposoby(int i) { if (i == (int)tekst.size()) return 1; if (jest[i]) return memo[i]; long long w = 0; for (string s : slowa) if (tekst.compare(i, s.size(), s) == 0) w += sposoby(i + s.size()); memo[i] = w % MOD; jest[i] = true; return memo[i]; }. Zamiast compare możesz porównać tekst.substr(i, s.size()) == s — słowa są krótkie. Bez pamięci tekst z samych liter a i słownik a, aa, aaa liczyłby się w nieskończoność.`,
            tests: (r) => {
                const z = (sl, t) => `${sl.length}\n${sl.join(' ')}\n${t}`;
                const slownik = (d, alf, mx) => { const s = new Set(); while (s.size < d) s.add(r.word(r.int(1, mx), alf)); return [...s]; };
                const z1 = slownik(8, 'ab', 4);
                const zlep = (sl, dl) => { let t = ''; while (t.length < dl) t += r.pick(sl); return t.slice(0, 2000); };
                const z2 = slownik(50, 'abc', 10);
                return [z(['ala', 'ma', 'kota', 'alama', 'ko', 'ta'], 'alamakota'), z(['a'], 'b'), z(['a', 'aa', 'aaa'], 'a'.repeat(2000)), z(z1, zlep(z1, 1990)), z(z2, zlep(z2, 1995)), z(z1, r.word(2000, 'ab')), z(['ab', 'abc', 'cd', 'd', 'bcd'], 'abcd'.repeat(500))];
            },
            check: (inp) => { const L = linie(inp); if (L.length !== 3) return 'dane'; const d = Number(L[0]); const sl = L[1].split(' '); return calk(d, 1, 50) && sl.length === d && new Set(sl).size === d && sl.every((s) => /^[a-z]{1,10}$/.test(s)) && /^[a-z]{1,2000}$/.test(L[2]) ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const sl = L[1].split(' '); const t = L[2]; const n = t.length; const f = new Array(n + 1).fill(0); f[n] = 1; for (let i = n - 1; i >= 0; i--) { let w = 0; for (const s of sl) if (t.startsWith(s, i)) w = (w + f[i + s.length]) % MODN; f[i] = w; } return String(f[0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
vector<string> slowa;
string tekst;
long long memo[2005];
bool jest[2005];
long long sposoby(int i) {
    if (i == (int)tekst.size()) return 1;
    if (jest[i]) return memo[i];
    long long w = 0;
    for (string s : slowa)
        if (tekst.compare(i, s.size(), s) == 0) w += sposoby(i + s.size());
    memo[i] = w % MOD;
    jest[i] = true;
    return memo[i];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(jest, 0, sizeof jest);
    int d;
    cin >> d;
    slowa.resize(d);
    for (int i = 0; i < d; i++) cin >> slowa[i];
    cin >> tekst;
    cout << sposoby(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-pierwsze-z-cyfr', krok: 9, level: 'srednie',
            title: 'Liczby pierwsze z kartoników',
            short: 'Z kartoników z cyframi układasz liczby — każdego kartonika używasz najwyżej raz. Ile różnych liczb pierwszych da się ułożyć? Generowanie z tablicą użytych i set na wyniki.',
            tags: ['generowanie permutacji', 'tablica użytych', 'set'],
            statement: ['Bajtek ma kartoniki z cyframi (cyfry mogą się powtarzać). Układa z nich liczby: bierze kilka kartoników (co najmniej jeden, każdy najwyżej raz) i kładzie je w dowolnej kolejności. Zero na początku nie przeszkadza — 011 to po prostu 11. Ile różnych liczb pierwszych może ułożyć?',
                'Napisz funkcję rekurencyjną void ukladaj(long long liczba), która wstawia aktualną liczbę do zbioru (jeśli użyto już jakiegoś kartonika), a potem po kolei dokłada każdy nieużyty kartonik na koniec: oznacza go jako użyty, wywołuje ukladaj(liczba · 10 + cyfra) i cofa oznaczenie. Na koniec sprawdź, które liczby ze zbioru są pierwsze.'],
            input_format: ['W jedynym wierszu napis z cyfr na kartonikach.'],
            output_format: ['Jedna liczba — ile różnych liczb pierwszych da się ułożyć.'],
            constraints: ['1 ≤ liczba kartoników ≤ 7'],
            examples: [{ input: '17', note: 'Da się ułożyć 1, 7, 17 i 71 — pierwsze są 7, 17 i 71.' }, { input: '011', note: 'Pierwsze: 11 (także jako 011) i 101.' }],
            hint: R`set<long long> zbior; bool uzyty[7]; void ukladaj(long long liczba, int ile) { if (ile > 0) zbior.insert(liczba); for (int i = 0; i < n; i++) { if (uzyty[i]) continue; uzyty[i] = true; ukladaj(liczba * 10 + (s[i] - '0'), ile + 1); uzyty[i] = false; } }. Zbiór sam usunie powtórzenia (np. przy dwóch takich samych kartonikach). Liczby mają najwyżej 7 cyfr, więc test pierwszości do pierwiastka jest szybki.`,
            tests: (r) => ['17', '011', '0', '2', '1234567', '1111111', '9999991', r.word(7, '0123456789'), r.word(6, '13579'), '1000000', r.word(5, '0123456789')],
            check: (inp) => (/^\d{1,7}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const s = inp.trim(); const n = s.length; const zb = new Set(); const uz = new Array(n).fill(false); const gen = (v, ile) => { if (ile > 0) zb.add(v); for (let i = 0; i < n; i++) { if (uz[i]) continue; uz[i] = true; gen(v * 10 + Number(s[i]), ile + 1); uz[i] = false; } }; gen(0, 0); return String([...zb].filter((x) => czyPierwsza(x)).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string s;
int n;
bool uzyty[7];
set<long long> zbior;
void ukladaj(long long liczba, int ile) {
    if (ile > 0) zbior.insert(liczba);
    for (int i = 0; i < n; i++) {
        if (uzyty[i]) continue;
        uzyty[i] = true;
        ukladaj(liczba * 10 + (s[i] - '0'), ile + 1);
        uzyty[i] = false;
    }
}
bool pierwsza(long long x) {
    if (x < 2) return false;
    for (long long d = 2; d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    zbior.clear();
    cin >> s;
    n = s.size();
    ukladaj(0, 0);
    int ile = 0;
    for (long long x : zbior)
        if (pierwsza(x)) ile++;
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-firma', krok: 9, level: 'srednie',
            title: 'Firma i podwładni',
            short: 'Każdy pracownik oprócz prezesa ma jednego szefa. Ilu podwładnych — bezpośrednich i pośrednich — ma każdy? Podwładni szefa to jego bezpośredni podwładni i wszyscy ich podwładni: rekurencja po drzewie firmy.',
            tags: ['rekurencja po drzewie', 'vector dzieci', 'wynik z wyników dzieci'],
            statement: ['W firmie pracuje n osób ponumerowanych od 1 do n. Osoba 1 to prezes, a każda inna osoba ma dokładnie jednego bezpośredniego szefa. Szef mojego szefa też jest moim przełożonym — i tak dalej aż do prezesa. Dla każdej osoby policz, ilu ma podwładnych (bezpośrednich i pośrednich).',
                'Zapisz dla każdej osoby listę jej bezpośrednich podwładnych (vector<int> pod[]). Napisz funkcję rekurencyjną int podwladni(int v), która dla każdego bezpośredniego podwładnego u dolicza 1 (samego u) plus podwladni(u), zapisuje wynik osoby v w tablicy i go oddaje.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n − 1 liczb: numery szefów osób 2, 3, …, n (gdy n = 1, ten wiersz jest pusty).'],
            output_format: ['W jednym wierszu n liczb — liczby podwładnych osób 1, 2, …, n.'],
            constraints: ['1 ≤ n ≤ 3000', 'Każda osoba ma przełożonych aż do prezesa (struktura firmy to drzewo).'],
            examples: [{ input: '5\n1 1 2 2', note: 'Prezes ma 4 podwładnych, osoba 2 — dwóch (4 i 5), a osoby 3, 4 i 5 nie mają żadnych.' }],
            hint: R`vector<int> pod[3005]; int wynik[3005]; int podwladni(int v) { int s = 0; for (int u : pod[v]) s += 1 + podwladni(u); wynik[v] = s; return s; }. W main: for (int i = 2; i <= n; i++) { int sz; cin >> sz; pod[sz].push_back(i); } i podwladni(1);. Szef może mieć większy numer niż podwładny — dlatego zwykła pętla po numerach nie wystarczy, a rekurencja od prezesa tak.`,
            tests: (r) => {
                const drzewo = (n, glebokie) => { const kol = [1, ...r.shuffle(Array.from({ length: n - 1 }, (_, i) => i + 2))]; const sz = new Array(n + 1).fill(0); for (let j = 1; j < n; j++) sz[kol[j]] = glebokie ? kol[j - 1] : kol[r.int(Math.max(0, j - 5), j - 1)]; return `${n}\n${sz.slice(2).join(' ')}`; };
                return ['5\n1 1 2 2', '1', '2\n1', drzewo(3000, true), drzewo(3000, false), `3000\n${new Array(2999).fill(1).join(' ')}`, drzewo(50, false)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 3000) || t.length !== n) return 'dane'; const sz = [0, 0, ...t.slice(1)]; if (!sz.slice(2).every((x) => calk(x, 1, n))) return 'dane'; for (let v = 2; v <= n; v++) { let x = v, k = 0; while (x !== 1 && k <= n) { x = sz[x]; k++; } if (x !== 1) return 'dane'; } return null; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const sz = [0, 0, ...t.slice(1)]; const dz = Array.from({ length: n + 1 }, () => []); for (let v = 2; v <= n; v++) dz[sz[v]].push(v); const kol = [1]; for (let i = 0; i < kol.length; i++) kol.push(...dz[kol[i]]); const w = new Array(n + 1).fill(0); for (let i = kol.length - 1; i > 0; i--) w[sz[kol[i]]] += 1 + w[kol[i]]; return w.slice(1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<int> pod[3005];
int wynik[3005];
int podwladni(int v) {
    int s = 0;
    for (int u : pod[v]) s += 1 + podwladni(u);
    wynik[v] = s;
    return s;
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    for (int i = 0; i < 3005; i++) pod[i].clear();
    int n;
    cin >> n;
    for (int i = 2; i <= n; i++) {
        int sz;
        cin >> sz;
        pod[sz].push_back(i);
    }
    podwladni(1);
    for (int i = 1; i <= n; i++) cout << wynik[i] << (i < n ? " " : "\n");
    return 0;
}`,
        },
        {
            id: 'rk-b-gra-na-koncach', krok: 9, level: 'srednie',
            title: 'Gra na końcach',
            short: 'Gracze na zmianę biorą liczbę z lewego albo prawego końca rzędu. Oboje grają najlepiej. Ile punktów zdobędzie każdy? Zapamiętuj najlepszą przewagę dla każdego fragmentu [l, r].',
            tags: ['memoizacja 2D', 'gra dwóch graczy', 'przewaga zamiast punktów'],
            statement: ['Na stole leży w rzędzie n kart z liczbami. Ala i Bartek ruszają się na zmianę (zaczyna Ala): w swoim ruchu gracz zabiera kartę z lewego albo prawego końca rzędu i dopisuje sobie jej wartość. Gra kończy się, gdy kart zabraknie. Oboje grają tak, żeby zdobyć jak najwięcej punktów. Ile punktów zdobędzie Ala, a ile Bartek?',
                'Napisz funkcję rekurencyjną int przewaga(int l, int r) — o ile więcej punktów od przeciwnika zdobędzie gracz, który ma ruch, gdy na stole leżą karty od l do r. Gdy kart nie ma, przewaga to 0; inaczej gracz wybiera lepszą z opcji: a[l] − przewaga(l + 1, r) albo a[r] − przewaga(l, r − 1). Wyniki zapamiętuj w tablicy 2D. Z sumy S i przewagi d policzysz punkty: Ala ma (S + d) / 2, a Bartek (S − d) / 2.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb na kartach.'],
            output_format: ['Dwie liczby: punkty Ali i punkty Bartka.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '4\n3 9 1 2', note: 'Ala bierze 2 (nie 3!) — wtedy Bartek musi odsłonić jej dziewiątkę. Ala: 2 + 9 = 11, Bartek: 3 + 1 = 4.' }],
            hint: R`int przewaga(int l, int r) { if (l > r) return 0; if (jest[l][r]) return memo[l][r]; memo[l][r] = max(a[l] - przewaga(l + 1, r), a[r] - przewaga(l, r - 1)); jest[l][r] = true; return memo[l][r]; }. Odejmowanie oddaje sedno gry: to, co zyskuje przeciwnik w dalszej części, jest moją stratą. Fragmentów [l, r] jest tylko około 5000.`,
            tests: (r) => {
                const z = (a) => `${a.length}\n${a.join(' ')}`;
                return [z([3, 9, 1, 2]), z([7]), z([1, 2]), z(r.arr(100, 1, 1000)), z(r.arr(100, 1, 3)), z(r.arr(99, 1, 1000)), z(new Array(100).fill(1000)), z(r.arr(10, 1, 20))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 100) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const n = a.length; const d = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0)); for (let len = 1; len <= n; len++) for (let l = 0; l + len - 1 < n; l++) { const rr = l + len - 1; d[l][rr] = Math.max(a[l] - (l + 1 <= rr ? d[l + 1][rr] : 0), a[rr] - (l <= rr - 1 ? d[l][rr - 1] : 0)); } const S = a.reduce((x, y) => x + y, 0); return `${(S + d[0][n - 1]) / 2} ${(S - d[0][n - 1]) / 2}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, a[105], memo[105][105];
bool jest[105][105];
int przewaga(int l, int r) {
    if (l > r) return 0;
    if (jest[l][r]) return memo[l][r];
    memo[l][r] = max(a[l] - przewaga(l + 1, r), a[r] - przewaga(l, r - 1));
    jest[l][r] = true;
    return memo[l][r];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(jest, 0, sizeof jest);
    cin >> n;
    int S = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        S += a[i];
    }
    int d = przewaga(0, n - 1);
    cout << (S + d) / 2 << " " << (S - d) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-rozwin-napis', krok: 9, level: 'srednie',
            title: 'Rozwiń skrót',
            short: '3[ab]c → abababc, a 2[x3[y]] → xyyyxyyy. Nawiasy w nawiasach to idealne zadanie dla rekurencji: funkcja czyta napis do nawiasu zamykającego i oddaje rozwinięty kawałek.',
            tags: ['rekurencja na nawiasach', 'globalna pozycja', 'string jako wynik'],
            statement: ['Skrót zapisuje napis krócej: k[tekst] oznacza tekst powtórzony k razy (k to jedna cyfra od 1 do 9), a w środku nawiasów mogą być kolejne skróty. Na przykład 3[ab]c to abababc, a 2[x3[y]] to xyyyxyyy. Wczytaj skrót i wypisz rozwinięty napis.',
                'Trzymaj w zmiennej globalnej pozycję, którą właśnie czytasz. Napisz funkcję rekurencyjną string czytaj(), która czyta znaki aż do końca napisu albo do znaku ]: literę dopisuje do wyniku, a cyfrę k — pomija ją razem z [, wywołuje czytaj() (to rozwinie wnętrze nawiasu), pomija ] i dopisuje wynik k razy.'],
            input_format: ['W jedynym wierszu skrót złożony z małych liter, cyfr od 1 do 9 i nawiasów kwadratowych.'],
            output_format: ['Jeden wiersz — rozwinięty napis.'],
            constraints: ['Skrót ma od 1 do 1000 znaków i jest poprawny (każda cyfra stoi tuż przed [, nawiasy są dobrze zagnieżdżone).', 'Rozwinięty napis ma od 1 do 10 000 liter.'],
            examples: [{ input: '3[ab]c' }, { input: '2[x3[y]]', note: 'Najpierw rozwija się wnętrze: x3[y] to xyyy, a potem całość powtarza się 2 razy.' }],
            hint: R`string s; int poz = 0; string czytaj() { string w = ""; while (poz < (int)s.size() && s[poz] != ']') { if (isalpha(s[poz])) { w += s[poz]; poz++; } else { int k = s[poz] - '0'; poz += 2; string wn = czytaj(); poz++; for (int i = 0; i < k; i++) w += wn; } } return w; }. Każde wywołanie czyta dokładnie jeden poziom nawiasów — o głębsze poziomy dba rekurencja.`,
            tests: (r) => {
                const gen = (d, maxDl) => { let s = '', dl = 0; const ile = r.int(1, 4); for (let i = 0; i < ile; i++) { if (d > 0 && r() < 0.5) { const k = r.int(1, 9); const [w, wl] = gen(d - 1, maxDl); s += `${k}[${w}]`; dl += k * wl; } else { const lit = r.word(r.int(1, 3)); s += lit; dl += lit.length; } } return [s, dl]; };
                const los = (d) => { for (;;) { const [s, dl] = gen(d, 10000); if (s.length <= 1000 && dl <= 10000 && dl >= 1) return s; } };
                return ['3[ab]c', '2[x3[y]]', 'a', '9[9[9[9[a]]]]', los(3), los(5), los(6), `${'1['.repeat(300)}ok${']'.repeat(300)}`, los(2)];
            },
            check: (inp) => { const s = inp.trim(); if (!/^[a-z1-9\[\]]{1,1000}$/.test(s)) return 'dane'; let gl = 0; for (let i = 0; i < s.length; i++) { const c = s[i]; if (/\d/.test(c)) { if (s[i + 1] !== '[') return 'dane'; } else if (c === '[') { if (!/\d/.test(s[i - 1] || '')) return 'dane'; gl++; } else if (c === ']') { gl--; if (gl < 0) return 'dane'; } } return gl === 0 ? null : 'dane'; },
            solve: (inp) => { const s = inp.trim(); let poz = 0; const czytaj = () => { let w = ''; while (poz < s.length && s[poz] !== ']') { if (/[a-z]/.test(s[poz])) { w += s[poz]; poz++; } else { const k = Number(s[poz]); poz += 2; const wn = czytaj(); poz++; w += wn.repeat(k); } } return w; }; return czytaj(); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string s;
int poz = 0;
string czytaj() {
    string w = "";
    while (poz < (int)s.size() && s[poz] != ']') {
        if (isalpha(s[poz])) {
            w += s[poz];
            poz++;
        } else {
            int k = s[poz] - '0';
            poz += 2;
            string wn = czytaj();
            poz++;
            for (int i = 0; i < k; i++) w += wn;
        }
    }
    return w;
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    poz = 0;
    cin >> s;
    cout << czytaj() << "\n";
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'rk-b-wieze', krok: 9, level: 'trudne',
            title: 'Wieże bez bicia',
            short: 'Postaw n wież na planszy n × n z dziurami tak, żeby żadne dwie się nie biły — czyli po jednej w każdym wierszu i kolumnie. Na ile sposobów? Wiersz po wierszu, z tablicą zajętych kolumn.',
            tags: ['przeszukiwanie z nawrotami', 'tablica zajętych kolumn', 'liczenie ustawień'],
            statement: ['Szachownica ma n × n pól, ale w niektórych są dziury (#) — na nich nie da się postawić figury. Na pozostałych polach (kropki) trzeba postawić n wież tak, żeby żadne dwie się nie biły, czyli żeby w każdym wierszu i w każdej kolumnie stała dokładnie jedna wieża. Na ile sposobów można to zrobić?',
                'Napisz funkcję rekurencyjną long long postaw(int w), która stawia wieżę w wierszu w: próbuje każdej kolumny, która jest wolna (tablica bool zajeta[]) i nie ma w tym wierszu dziury, oznacza ją, wywołuje postaw(w + 1) i cofa oznaczenie. Gdy w == n, znaleziono jedno ustawienie.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy n znaków: kropka albo #.'],
            output_format: ['Jedna liczba — liczba ustawień.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '3\n...\n.#.\n...', note: 'Bez dziury byłoby 3! = 6 ustawień; 2 z nich używają środkowego pola.' }],
            hint: R`long long postaw(int w) { if (w == n) return 1; long long s = 0; for (int c = 0; c < n; c++) { if (zajeta[c] || g[w][c] == '#') continue; zajeta[c] = true; s += postaw(w + 1); zajeta[c] = false; } return s; }. Dla pustej planszy 10 × 10 to 10! = 3 628 800 ustawień — rekurencja je wszystkie odwiedzi, ale zdąży, bo w każdym wierszu od razu odrzuca zajęte kolumny.`,
            tests: (r) => {
                const z = (pl) => `${pl.length}\n${pl.join('\n')}`;
                const przek = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? '#' : '.')).join(''));
                return ['3\n...\n.#.\n...', '1\n.', '1\n#', z(plansza(r, 10, 10, 0)), z(przek(10)), z(plansza(r, 10, 10, 0.3)), z(plansza(r, 10, 10, 0.15)), z(plansza(r, 8, 8, 0.5)), z(['##########', ...plansza(r, 9, 10, 0.1)])];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 10) && L.length === n + 1 && L.slice(1).every((w) => w.length === n && /^[.#]+$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const g = L.slice(1); const dp = new Array(1 << n).fill(0); dp[0] = 1; for (let m = 0; m < (1 << n); m++) { if (!dp[m]) continue; let w = 0; for (let x = m; x; x &= x - 1) w++; if (w === n) continue; for (let c = 0; c < n; c++) if (!(m & (1 << c)) && g[w][c] === '.') dp[m | (1 << c)] += dp[m]; } return String(dp[(1 << n) - 1]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
string g[10];
bool zajeta[10];
long long postaw(int w) {
    if (w == n) return 1;
    long long s = 0;
    for (int c = 0; c < n; c++) {
        if (zajeta[c] || g[w][c] == '#') continue;
        zajeta[c] = true;
        s += postaw(w + 1);
        zajeta[c] = false;
    }
    return s;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> g[i];
    cout << postaw(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-rowne-grupy', krok: 9, level: 'trudne',
            title: 'Sprawiedliwy podział',
            short: 'Czy patyczki da się rozdzielić na k grup o równej łącznej długości? Każdy patyczek po kolei próbujesz dołożyć do każdej grupy i obcinasz gałęzie, w których grupa przekroczyła cel.',
            tags: ['przeszukiwanie z nawrotami', 'obcinanie gałęzi', 'TAK albo NIE'],
            statement: ['Bajtek ma n patyczków o długościach a₁, …, aₙ i chce ułożyć z nich k figur z równymi obwodami — czyli rozdzielić wszystkie patyczki na k grup o równej sumie długości (każdy patyczek trafia do dokładnie jednej grupy). Dla każdego z t zestawów wypisz TAK, jeśli to możliwe, albo NIE.',
                'Jeśli suma S nie dzieli się przez k, odpowiedź to od razu NIE. Inaczej każda grupa ma mieć sumę cel = S / k. Napisz funkcję rekurencyjną bool rozdziel(int i), która próbuje dołożyć patyczek i do każdej grupy, do której się jeszcze mieści (suma grupy + aᵢ ≤ cel), i wywołuje rozdziel(i + 1); po nieudanej próbie cofa patyczek. Gdy i == n, wszystkie grupy mają sumę cel.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy zestaw to dwa wiersze: n i k, a w następnym n długości patyczków.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 5', '1 ≤ n ≤ 12', '1 ≤ k ≤ 4', '1 ≤ aᵢ ≤ 100'],
            examples: [{ input: '2\n4 2\n1 2 3 4\n3 2\n1 1 3', note: 'Pierwszy zestaw: 1 + 4 = 2 + 3. W drugim suma 5 nie dzieli się na 2.' }],
            hint: R`bool rozdziel(int i) { if (i == n) return true; for (int g = 0; g < k; g++) { if (suma[g] + a[i] > cel) continue; suma[g] += a[i]; if (rozdziel(i + 1)) return true; suma[g] -= a[i]; if (suma[g] == 0) break; } return false; }. Linijka if (suma[g] == 0) break; to sprytne obcięcie: jeśli patyczek nie pasował do pustej grupy, to do kolejnych pustych też nie (puste grupy są takie same). Pomaga też posortowanie patyczków malejąco.`,
            tests: (r) => {
                const tak = () => { const k = r.int(1, 4); const cel = r.int(10, 150); const a = []; for (let g = 0; g < k; g++) { let s = cel; const ile = r.int(1, Math.max(1, Math.floor(12 / k))); for (let j = 1; j < ile && s > 1; j++) { const x = r.int(1, Math.min(100, s - 1)); a.push(x); s -= x; } if (s > 100) return tak(); a.push(s); } if (a.length > 12) return tak(); return [k, r.shuffle(a)]; };
                const los = () => { const n = r.int(1, 12), k = r.int(1, 4); const a = r.arr(n, 1, 100); const S = a.reduce((x, y) => x + y, 0); a[0] += (k - S % k) % k; if (a[0] > 100) a[0] -= k; return [k, a]; };
                const z = (ts) => `${ts.length}\n${ts.map(([k, a]) => `${a.length} ${k}\n${a.join(' ')}`).join('\n')}`;
                return [z([[2, [1, 2, 3, 4]], [2, [1, 1, 3]]]), z([tak(), tak(), tak(), tak(), tak()]), z([los(), los(), los(), los(), los()]), z([[4, [100, 100, 100, 100, 1, 1, 1, 1, 50, 50, 50, 46]], [3, [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4]], [4, [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]], [1, [7]], [4, [1, 1, 1]]]), z([los(), tak(), los(), tak(), los()])];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 5)) return 'dane'; let p = 1; for (let q = 0; q < t[0]; q++) { const n = t[p], k = t[p + 1]; if (!calk(n, 1, 12) || !calk(k, 1, 4)) return 'dane'; if (!t.slice(p + 2, p + 2 + n).every((x) => calk(x, 1, 100))) return 'dane'; p += n + 2; } return p === t.length ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const w = []; let p = 1;
                for (let q = 0; q < t[0]; q++) {
                    const n = t[p], k = t[p + 1]; const a = t.slice(p + 2, p + 2 + n); p += n + 2;
                    const S = a.reduce((x, y) => x + y, 0);
                    if (S % k !== 0) { w.push('NIE'); continue; }
                    const cel = S / k; const dp = new Array(1 << n).fill(false); dp[0] = true; const sm = new Array(1 << n).fill(0);
                    for (let m = 1; m < (1 << n); m++) { const i = 31 - Math.clz32(m & -m); sm[m] = sm[m & (m - 1)] + a[i]; }
                    for (let m = 0; m < (1 << n); m++) { if (!dp[m]) continue; const reszta = sm[m] % cel; for (let i = 0; i < n; i++) if (!(m & (1 << i)) && reszta + a[i] <= cel) dp[m | (1 << i)] = true; }
                    w.push(dp[(1 << n) - 1] ? 'TAK' : 'NIE');
                }
                return w.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, k, cel;
int a[12], suma[4];
bool rozdziel(int i) {
    if (i == n) return true;
    for (int g = 0; g < k; g++) {
        if (suma[g] + a[i] > cel) continue;
        suma[g] += a[i];
        if (rozdziel(i + 1)) return true;
        suma[g] -= a[i];
        if (suma[g] == 0) break;
    }
    return false;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        cin >> n >> k;
        int S = 0;
        for (int i = 0; i < n; i++) {
            cin >> a[i];
            S += a[i];
        }
        if (S % k != 0) {
            cout << "NIE\n";
            continue;
        }
        cel = S / k;
        sort(a, a + n, greater<int>());
        for (int g = 0; g < k; g++) suma[g] = 0;
        cout << (rozdziel(0) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-hanoi-po-k', krok: 9, level: 'trudne',
            title: 'Hanoi po k ruchach',
            short: 'Optymalne przenoszenie n krążków z A na C trwa 2ⁿ − 1 ruchów. Jak wyglądają pręty po k ruchach? Największy krążek rusza się dokładnie w połowie — to wystarczy, żeby zejść rekurencyjnie bez symulowania ruchów.',
            tags: ['wieże Hanoi', 'połowienie zamiast symulacji', 'long long'],
            statement: ['Na pręcie A leży n krążków (od n na dole do 1 na górze). Optymalne przeniesienie wieży na pręt C (przez B) robi się rekurencyjnie: przenieś n − 1 krążków z A na B, przełóż krążek n z A na C, przenieś n − 1 krążków z B na C. Trwa to 2ⁿ − 1 ruchów. Jak wyglądają pręty po pierwszych k ruchach?',
                'Dla n = 60 ruchów jest około 10¹⁸ — symulacja nie wchodzi w grę. Zauważ: przez pierwsze 2ⁿ⁻¹ − 1 ruchów krążek n leży na pręcie startowym, a ruch numer 2ⁿ⁻¹ przekłada go na docelowy. Napisz funkcję rekurencyjną void stan(int n, long long k, int z, int na, int przez): jeśli k < 2ⁿ⁻¹, krążek n leży na z, a dalej dzieje się stan(n − 1, k, z, przez, na); w przeciwnym razie krążek n leży na na, a dalej — stan(n − 1, k − 2ⁿ⁻¹, przez, na, z).'],
            input_format: ['W jedynym wierszu n i k.'],
            output_format: ['Trzy wiersze w formacie A: …, B: … i C: … — krążki na każdym pręcie od dołu do góry, oddzielone spacjami (pusty pręt to sam napis A:, B: albo C:).'],
            constraints: ['1 ≤ n ≤ 60', '0 ≤ k ≤ 2ⁿ − 1'],
            examples: [{ input: '3 2', note: 'Dwa pierwsze ruchy to A→C (krążek 1) i A→B (krążek 2).' }],
            hint: R`vector<int> pret[3]; void stan(int n, long long k, int z, int na, int przez) { if (n == 0) return; long long pol = 1LL << (n - 1); if (k < pol) { pret[z].push_back(n); stan(n - 1, k, z, przez, na); } else { pret[na].push_back(n); stan(n - 1, k - pol, przez, na, z); } }, wywołanie stan(n, k, 0, 2, 1). Krążki dokładamy od największego, więc w każdym vectorze leżą od dołu do góry. Pamiętaj o 1LL — zwykłe 1 << 59 przepełni int.`,
            tests: (r) => {
                const k = (n) => String(r.big(0n, 2n ** B(n) - 1n));
                return ['3 2', '1 0', '1 1', '3 7', '60 0', `60 ${2n ** 60n - 1n}`, `60 ${k(60)}`, `60 ${2n ** 59n}`, `60 ${2n ** 59n - 1n}`, `10 ${k(10)}`, `25 ${k(25)}`, `4 ${k(4)}`];
            },
            check: (inp) => { const t = toks(inp); if (t.length !== 2) return 'dane'; const n = Number(t[0]); return calk(n, 1, 60) && /^\d+$/.test(t[1]) && B(t[1]) <= 2n ** B(n) - 1n ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp); let n = Number(t[0]), k = B(t[1]); const pr = [[], [], []]; let z = 0, na = 2, pz = 1; while (n > 0) { const pol = 2n ** B(n - 1); if (k < pol) { pr[z].push(n); [na, pz] = [pz, na]; } else { pr[na].push(n); k -= pol; [z, pz] = [pz, z]; } n--; } return ['A', 'B', 'C'].map((c, i) => `${c}:${pr[i].length ? ' ' + pr[i].join(' ') : ''}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<int> pret[3];
void stan(int n, long long k, int z, int na, int przez) {
    if (n == 0) return;
    long long pol = 1LL << (n - 1);
    if (k < pol) {
        pret[z].push_back(n);
        stan(n - 1, k, z, przez, na);
    } else {
        pret[na].push_back(n);
        stan(n - 1, k - pol, przez, na, z);
    }
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    for (int i = 0; i < 3; i++) pret[i].clear();
    int n;
    long long k;
    cin >> n >> k;
    stan(n, k, 0, 2, 1);
    string nazwy = "ABC";
    for (int i = 0; i < 3; i++) {
        cout << nazwy[i] << ":";
        for (int x : pret[i]) cout << " " << x;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-krzywa-smoka', krok: 9, level: 'trudne',
            title: 'Smocza krzywa',
            short: 'Składasz pasek papieru n razy na pół i rozkładasz: zagięcia tworzą ciąg liter L i P długości 2ⁿ − 1. Jaka jest k-ta litera? Środek to zawsze P, a druga połowa to odbita pierwsza z zamienionymi literami.',
            tags: ['połowienie', 'odbicie lustrzane', 'long long'],
            statement: ['Gdy złożysz pasek papieru na pół n razy (zawsze w tę samą stronę) i rozłożysz go, zagięcia układają się w słynną smoczą krzywą. Kierunki zagięć tworzą napis D(n) z liter L i P: D(1) = P, a D(n) = D(n − 1), potem P, a potem D(n − 1) zapisane od tyłu, w którym każde L zamieniono na P i odwrotnie. Na przykład D(2) = PPL, a D(3) = PPLPPLL.',
                'D(60) ma ponad 10¹⁸ liter — nie da się go zbudować. Dla każdego z t zapytań (n, k) wypisz k-tą literę D(n) (litery numerujemy od 1). Napisz funkcję rekurencyjną char znak(int n, long long k): środek ma numer 2ⁿ⁻¹ i jest tam P; dla k mniejszego od środka to znak(n − 1, k), a dla większego — odwrotność litery znak(n − 1, 2ⁿ − k).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby n i k.'],
            output_format: ['t wierszy — litery L albo P.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 60', '1 ≤ k ≤ 2ⁿ − 1'],
            examples: [{ input: '3\n3 1\n3 3\n3 7', note: 'D(3) = PPLPPLL.' }],
            hint: R`char znak(int n, long long k) { long long srodek = 1LL << (n - 1); if (k == srodek) return 'P'; if (k < srodek) return znak(n - 1, k); char c = znak(n - 1, (1LL << n) - k); return c == 'P' ? 'L' : 'P'; }. Litera k w drugiej połowie odpowiada literze 2ⁿ − k w pierwszej (odbicie względem środka), tylko zamienionej. Każde wywołanie zmniejsza n o 1, więc głębokość to najwyżej 60.`,
            tests: (r) => {
                const q = () => { const n = r.int(1, 60); return [String(n), String(r.big(1n, 2n ** B(n) - 1n))]; };
                return [wierszeT([['3', '1'], ['3', '3'], ['3', '7']]), wierszeT([['1', '1'], ['60', String(2n ** 59n)], ['60', '1'], ['60', String(2n ** 60n - 1n)], ['2', '2'], ['2', '3'], ['4', '9']]), wierszeT(Array.from({ length: 1000 }, q))];
            },
            check: (inp) => checkWiersze(inp, 1000, 2, (t) => { const n = Number(t[0]); return calk(n, 1, 60) && /^\d+$/.test(t[1]) && B(t[1]) >= 1n && B(t[1]) <= 2n ** B(n) - 1n; }),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [ns, ks] = l.trim().split(/\s+/); let n = Number(ns), k = B(ks), odwr = false; for (;;) { const sr = 2n ** B(n - 1); if (k === sr) return odwr ? 'L' : 'P'; if (k > sr) { k = 2n ** B(n) - k; odwr = !odwr; } n--; } }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
char znak(int n, long long k) {
    long long srodek = 1LL << (n - 1);
    if (k == srodek) return 'P';
    if (k < srodek) return znak(n - 1, k);
    char c = znak(n - 1, (1LL << n) - k);
    return c == 'P' ? 'L' : 'P';
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        long long k;
        cin >> n >> k;
        cout << znak(n, k) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-gra-24', krok: 9, level: 'trudne',
            title: 'Gra w 24',
            short: 'Z czterech kart ułóż działanie o wartości 24 (+, −, ·, / i nawiasy, ułamki dozwolone). Rekurencja: wybierz dwie liczby, zastąp je wynikiem działania i rozwiąż mniejszy problem.',
            tags: ['przeszukiwanie wszystkich działań', 'ułamki jako para liczb', 'vector w parametrze'],
            statement: ['W grze w 24 losuje się cztery karty z liczbami od 1 do 13. Trzeba użyć każdej karty dokładnie raz i za pomocą dodawania, odejmowania, mnożenia, dzielenia i nawiasów otrzymać 24. Wyniki pośrednie mogą być ułamkami: na przykład z 3, 3, 8, 8 da się zrobić 8 / (3 − 8 / 3) = 24. Dla każdego z t zestawów wypisz TAK albo NIE.',
                'Każde działanie łączy dwie liczby w jedną. Napisz funkcję rekurencyjną bool da(vector<pair<long long, long long>> v), gdzie para to licznik i mianownik ułamka: jeśli w v została jedna liczba, sprawdź, czy równa się 24; inaczej dla każdej pary liczb i każdego działania (a + b, a − b, b − a, a · b, a / b, b / a — dzielenie tylko przez liczbę różną od zera) zbuduj vector z wynikiem zamiast tej pary i wywołaj da.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy cztery liczby.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 100', 'Każda liczba jest od 1 do 13.'],
            examples: [{ input: '3\n4 1 8 7\n1 1 1 1\n3 3 8 8', note: '(8 − 4) · (7 − 1) = 24. Z czterech jedynek nie da się dojść dalej niż do 4.' }],
            hint: R`Ułamek a/b to para (a, b) z b różnym od 0. Działania: (a/b) + (c/d) = (ad + cb)/(bd), (a/b) · (c/d) = (ac)/(bd), (a/b) / (c/d) = (ad)/(bc) — o ile c ≠ 0. Ułamek x/y równa się 24, gdy x == 24 · y. Liczby są małe, więc nie musisz skracać ułamków. Wszystkich możliwości jest tylko kilka tysięcy.`,
            tests: (r) => {
                const czw = () => [r.int(1, 13), r.int(1, 13), r.int(1, 13), r.int(1, 13)].map(String);
                return [wierszeT([['4', '1', '8', '7'], ['1', '1', '1', '1'], ['3', '3', '8', '8']]), wierszeT([['1', '5', '5', '5'], ['4', '4', '10', '10'], ['1', '3', '4', '6'], ['13', '13', '13', '13'], ['1', '1', '1', '8'], ['2', '3', '5', '12'], ['1', '2', '7', '7'], ['3', '3', '7', '7']]), wierszeT(Array.from({ length: 100 }, czw))];
            },
            check: (inp) => checkWiersze(inp, 100, 4, (t) => t.every((x) => /^\d+$/.test(x) && calk(Number(x), 1, 13))),
            solve: (inp) => {
                const da = (v) => {
                    if (v.length === 1) return v[0][1] !== 0 && v[0][0] === 24 * v[0][1];
                    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
                        const [a, b] = v[i], [c, d] = v[j]; const reszta = v.filter((_, q) => q !== i && q !== j);
                        const wyn = [[a * d + c * b, b * d], [a * d - c * b, b * d], [c * b - a * d, b * d], [a * c, b * d]];
                        if (c !== 0) wyn.push([a * d, b * c]);
                        if (a !== 0) wyn.push([c * b, d * a]);
                        for (const x of wyn) if (da([...reszta, x])) return true;
                    }
                    return false;
                };
                return linie(inp).slice(1).map((l) => (da(l.trim().split(/\s+/).map((x) => [Number(x), 1])) ? 'TAK' : 'NIE')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
typedef pair<long long, long long> Ulamek;
bool da(vector<Ulamek> v) {
    if (v.size() == 1) return v[0].first == 24 * v[0].second;
    for (int i = 0; i < (int)v.size(); i++)
        for (int j = i + 1; j < (int)v.size(); j++) {
            long long a = v[i].first, b = v[i].second, c = v[j].first, d = v[j].second;
            vector<Ulamek> reszta;
            for (int q = 0; q < (int)v.size(); q++)
                if (q != i && q != j) reszta.push_back(v[q]);
            vector<Ulamek> wyniki = {{a * d + c * b, b * d}, {a * d - c * b, b * d}, {c * b - a * d, b * d}, {a * c, b * d}};
            if (c != 0) wyniki.push_back({a * d, b * c});
            if (a != 0) wyniki.push_back({c * b, d * a});
            for (Ulamek x : wyniki) {
                reszta.push_back(x);
                if (da(reszta)) return true;
                reszta.pop_back();
            }
        }
    return false;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        vector<Ulamek> v;
        for (int i = 0; i < 4; i++) {
            long long x;
            cin >> x;
            v.push_back({x, 1});
        }
        cout << (da(v) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-b-drzewo-czworkowe', krok: 9, level: 'trudne',
            title: 'Kompresja obrazka',
            short: 'Obrazek 2ᵏ × 2ᵏ z pikseli 0 i 1: jeśli cały kwadrat ma jeden kolor, zapisz ten kolor; inaczej zapisz Q i skompresuj cztery ćwiartki. Klasyczne dziel i zwyciężaj.',
            tags: ['dziel i zwyciężaj', 'cztery ćwiartki', 'string jako wynik'],
            statement: ['Czarno-biały obrazek ma 2ᵏ × 2ᵏ pikseli zapisanych cyframi 0 i 1. Kompresujemy go tak: jeśli wszystkie piksele kwadratu mają ten sam kolor, kod kwadratu to ta jedna cyfra. W przeciwnym razie kod to litera Q, a za nią kody czterech ćwiartek w kolejności: lewa górna, prawa górna, lewa dolna, prawa dolna. Wypisz kod całego obrazka.',
                'Napisz funkcję rekurencyjną string kod(int x, int y, int bok) dla kwadratu o lewym górnym rogu (x, y): sprawdź pętlą, czy wszystkie piksele są takie same; jeśli tak — oddaj tę cyfrę, jeśli nie — oddaj "Q" + kody czterech ćwiartek o boku bok / 2.'],
            input_format: ['W pierwszym wierszu k.', 'W każdym z 2ᵏ kolejnych wierszy 2ᵏ cyfr 0 albo 1.'],
            output_format: ['Jeden wiersz — kod obrazka.'],
            constraints: ['0 ≤ k ≤ 7'],
            examples: [{ input: '1\n10\n00', note: 'Obrazek nie jest jednolity, więc Q, a potem kody pikseli: 1, 0, 0, 0.' }, { input: '2\n0011\n0011\n0101\n1111' }],
            hint: R`string kod(int x, int y, int bok) { bool jednolity = true; for (int i = x; i < x + bok; i++) for (int j = y; j < y + bok; j++) if (g[i][j] != g[x][y]) jednolity = false; if (jednolity) return string(1, g[x][y]); int h = bok / 2; return "Q" + kod(x, y, h) + kod(x, y + h, h) + kod(x + h, y, h) + kod(x + h, y + h, h); }. Każdy poziom rekurencji przegląda łącznie cały obrazek, a poziomów jest k + 1 — to szybkie.`,
            tests: (r) => {
                const z = (g) => `${Math.log2(g.length)}\n${g.join('\n')}`;
                const kolo = (k) => { const n = 2 ** k; const cx = r.int(0, n), cy = r.int(0, n), rr = r.int(n / 8, n / 2); return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => ((i - cx) ** 2 + (j - cy) ** 2 <= rr * rr ? '1' : '0')).join('')); };
                const szach = (k, b) => Array.from({ length: 2 ** k }, (_, i) => Array.from({ length: 2 ** k }, (_, j) => String((Math.floor(i / b) + Math.floor(j / b)) % 2)).join(''));
                return ['1\n10\n00', '2\n0011\n0011\n0101\n1111', '0\n1', z(plansza(r, 128, 128, 0.5, '1', '0')), z(kolo(7)), z(Array.from({ length: 128 }, () => '0'.repeat(128))), z(szach(6, 1)), z(szach(7, 16)), z(plansza(r, 32, 32, 0.1, '1', '0'))];
            },
            check: (inp) => { const L = linie(inp); const k = Number(L[0]); if (!calk(k, 0, 7)) return 'dane'; const n = 2 ** k; return L.length === n + 1 && L.slice(1).every((w) => w.length === n && /^[01]+$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const g = L.slice(1); const kod = (x, y, bok) => { let jedn = true; for (let i = x; i < x + bok && jedn; i++) for (let j = y; j < y + bok; j++) if (g[i][j] !== g[x][y]) { jedn = false; break; } if (jedn) return g[x][y]; const hh = bok / 2; return 'Q' + kod(x, y, hh) + kod(x, y + hh, hh) + kod(x + hh, y, hh) + kod(x + hh, y + hh, hh); }; return kod(0, 0, g.length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<string> g;
string kod(int x, int y, int bok) {
    bool jednolity = true;
    for (int i = x; i < x + bok; i++)
        for (int j = y; j < y + bok; j++)
            if (g[i][j] != g[x][y]) jednolity = false;
    if (jednolity) return string(1, g[x][y]);
    int h = bok / 2;
    return "Q" + kod(x, y, h) + kod(x, y + h, h) + kod(x + h, y, h) + kod(x + h, y + h, h);
}
int main() {
    int k;
    cin >> k;
    int n = 1 << k;
    g.resize(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    cout << kod(0, 0, n) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-domino', krok: 9, level: 'trudne',
            title: 'Domino na planszy',
            short: 'Na ile sposobów można pokryć wszystkie wolne pola planszy kostkami domina 1 × 2? Zawsze zajmij pierwsze wolne pole — poziomo albo pionowo — i rekurencyjnie pokryj resztę.',
            tags: ['przeszukiwanie z nawrotami', 'pierwsze wolne pole', 'liczenie pokryć'],
            statement: ['Plansza ma n wierszy i m kolumn; pola zajęte oznaczono #, wolne — kropką. Na ile sposobów można pokryć wszystkie wolne pola kostkami domina 1 × 2 (poziomo albo pionowo), tak żeby kostki nie nachodziły na siebie ani na zajęte pola? Jeśli się nie da, odpowiedź to 0.',
                'Sztuczka, która porządkuje przeszukiwanie: znajdź pierwsze wolne pole (wiersz po wierszu, od lewej). Jakaś kostka musi je przykryć — a skoro wszystkie pola przed nim są już zajęte, to tylko kostka leżąca w prawo albo w dół. Napisz funkcję rekurencyjną long long pokrycia(), która próbuje obu możliwości, wywołuje samą siebie i zdejmuje kostkę. Gdy wolnych pól nie ma — znaleziono jedno pokrycie.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z n kolejnych wierszy m znaków: kropka albo #.'],
            output_format: ['Jedna liczba — liczba pokryć.'],
            constraints: ['1 ≤ n, m ≤ 8', 'Wolnych pól jest najwyżej 40.'],
            examples: [{ input: '2 3\n...\n...', note: 'Trzy pionowe kostki, albo jedna pionowa i dwie poziome (z lewej albo z prawej strony).' }, { input: '3 3\n...\n.#.\n...' }],
            hint: R`long long pokrycia() { int x = -1, y = -1; for (int i = 0; i < n && x < 0; i++) for (int j = 0; j < m; j++) if (g[i][j] == '.') { x = i; y = j; break; } if (x < 0) return 1; long long w = 0; if (y + 1 < m && g[x][y + 1] == '.') { g[x][y] = g[x][y + 1] = 'X'; w += pokrycia(); g[x][y] = g[x][y + 1] = '.'; } if (x + 1 < n && g[x + 1][y] == '.') { … to samo w dół … } return w; }. Każde pokrycie powstaje dokładnie raz — dzięki temu, że zawsze kładziesz kostkę na pierwszym wolnym polu.`,
            tests: (r) => {
                const z = (pl) => `${pl.length} ${pl[0].length}\n${pl.join('\n')}`;
                const ogr = (n, m, wolne) => { const g = Array.from({ length: n }, () => new Array(m).fill('#')); const pola = r.shuffle(Array.from({ length: n * m }, (_, i) => i)).slice(0, wolne); for (const p of pola) g[Math.floor(p / m)][p % m] = '.'; return g.map((w) => w.join('')); };
                const prost = (n, m) => Array.from({ length: n }, () => '.'.repeat(m));
                return ['2 3\n...\n...', '3 3\n...\n.#.\n...', '1 1\n.', '1 2\n..', '1 1\n#', z(prost(5, 8)), z(prost(6, 6)), z(ogr(8, 8, 40)), z(ogr(8, 8, 36)), z(prost(8, 5)), z(['........', '...##...', '........', '..#..#..', '........']), z(prost(3, 7))];
            },
            check: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); if (!calk(n, 1, 8) || !calk(m, 1, 8) || L.length !== n + 1 || !L.slice(1).every((w) => w.length === m && /^[.#]+$/.test(w))) return 'dane'; return L.slice(1).join('').split('').filter((c) => c === '.').length <= 40 ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); const g = L.slice(1).map((w) => w.split('')); const licz = () => { let x = -1, y = -1; for (let i = 0; i < n && x < 0; i++) for (let j = 0; j < m; j++) if (g[i][j] === '.') { x = i; y = j; break; } if (x < 0) return 1; let w = 0; if (y + 1 < m && g[x][y + 1] === '.') { g[x][y] = g[x][y + 1] = 'X'; w += licz(); g[x][y] = g[x][y + 1] = '.'; } if (x + 1 < n && g[x + 1][y] === '.') { g[x][y] = g[x + 1][y] = 'X'; w += licz(); g[x][y] = g[x + 1][y] = '.'; } return w; }; return String(licz()); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
string g[8];
long long pokrycia() {
    int x = -1, y = -1;
    for (int i = 0; i < n && x < 0; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == '.') {
                x = i;
                y = j;
                break;
            }
    if (x < 0) return 1;
    long long w = 0;
    if (y + 1 < m && g[x][y + 1] == '.') {
        g[x][y] = g[x][y + 1] = 'X';
        w += pokrycia();
        g[x][y] = g[x][y + 1] = '.';
    }
    if (x + 1 < n && g[x + 1][y] == '.') {
        g[x][y] = g[x + 1][y] = 'X';
        w += pokrycia();
        g[x][y] = g[x + 1][y] = '.';
    }
    return w;
}
int main() {
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> g[i];
    cout << pokrycia() << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-b-kalkulator', krok: 9, level: 'trudne',
            title: 'Wielki finał: kalkulator z nawiasami',
            short: 'Policz wartość wyrażenia z +, −, *, / i nawiasami — z kolejnością działań. Trzy funkcje wołające się nawzajem: wyrażenie to składniki, składnik to czynniki, a czynnik to liczba albo wyrażenie w nawiasie.',
            tags: ['rekurencja wzajemna', 'kolejność działań', 'deklaracja funkcji'],
            statement: ['Dla każdego z t wierszy policz wartość zapisanego w nim wyrażenia. Wyrażenie składa się z nieujemnych liczb całkowitych, działań +, −, * i / oraz nawiasów okrągłych; między nimi mogą stać spacje. Obowiązuje zwykła kolejność działań: najpierw nawiasy, potem mnożenie i dzielenie, na końcu dodawanie i odejmowanie, a działania tego samego rodzaju wykonuje się od lewej. Dzielenie jest całkowite, jak w C++ (wynik obcięty w stronę zera).',
                'Rozbij zadanie na trzy funkcje, które wywołują się nawzajem. wyrazenie() liczy składnik, a potem — dopóki widzi + albo − — kolejne składniki. skladnik() liczy czynnik, a potem — dopóki widzi * albo / — kolejne czynniki. czynnik() to albo liczba, albo nawias: (, wyrazenie() i ). Pozycję w napisie trzymaj w zmiennej globalnej. Ponieważ czynnik wywołuje wyrazenie, które jest zdefiniowane niżej, nad czynnik napisz deklarację long long wyrazenie();.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy jedno poprawne wyrażenie.'],
            output_format: ['t wierszy — wartości wyrażeń.'],
            constraints: ['1 ≤ t ≤ 100', 'Każde wyrażenie ma od 1 do 1000 znaków.', 'Liczby w wyrażeniach są od 0 do 10⁹, nigdy nie dzielimy przez zero, a każdy wynik pośredni ma wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '3\n2 + 3 * 4\n(2 + 3) * 4\n100 / 7 / 2 - 3 * (4 - 10)', note: 'W ostatnim: 100 / 7 = 14, 14 / 2 = 7, a 3 · (4 − 10) = −18, więc 7 − (−18) = 25.' }],
            hint: R`string s; int poz; void spacje() { while (poz < (int)s.size() && s[poz] == ' ') poz++; } long long wyrazenie(); long long czynnik() { spacje(); if (s[poz] == '(') { poz++; long long w = wyrazenie(); spacje(); poz++; return w; } long long w = 0; while (poz < (int)s.size() && isdigit(s[poz])) w = w * 10 + (s[poz++] - '0'); return w; }. skladnik i wyrazenie wyglądają tak samo: pierwszy kawałek, a potem pętla while po operatorach. Wiersze czytaj getline (po cin >> t zjedz resztę wiersza).`,
            tests: (r) => {
                const LIM = B(E18);
                const liczba = () => String(r() < 0.8 ? r.int(0, 99) : r() < 0.8 ? r.int(100, 9999) : r.int(10000, 1000000000));
                const genW = (d) => { const t = [genS(d)]; const k = r.int(0, 3); for (let i = 0; i < k; i++) t.push(r.pick(['+', '-']), genS(d)); return t.flat(); };
                const genS = (d) => { const t = [genC(d)]; const k = r.int(0, 2); for (let i = 0; i < k; i++) t.push(r.pick(['*', '/', '*']), genC(d)); return t.flat(); };
                const genC = (d) => (d > 0 && r() < 0.4 ? ['(', ...genW(d - 1), ')'] : [liczba()]);
                const policz = (s) => {
                    let p = 0; let ok = true;
                    const sp = () => { while (s[p] === ' ') p++; };
                    const spr = (v) => { if (v > LIM || v < -LIM) ok = false; return v; };
                    const cz = () => { sp(); if (s[p] === '(') { p++; const v = wy(); sp(); p++; return v; } let v = 0n; while (p < s.length && s[p] >= '0' && s[p] <= '9') v = v * 10n + B(s[p++]); return v; };
                    const sk = () => { let v = cz(); for (;;) { sp(); if (s[p] === '*' || s[p] === '/') { const op = s[p++]; const b = cz(); if (op === '*') v = spr(v * b); else { if (b === 0n) { ok = false; return 0n; } v = v / b; } } else return v; } };
                    const wy = () => { let v = sk(); for (;;) { sp(); if (s[p] === '+' || s[p] === '-') { const op = s[p++]; const b = sk(); v = spr(op === '+' ? v + b : v - b); } else return v; } };
                    const v = wy();
                    return ok ? v : null;
                };
                const sklej = (tk) => tk.map((x) => x + ' '.repeat(r() < 0.6 ? 1 : r() < 0.5 ? 0 : 2)).join('').trim();
                const wyr = (d, maxDl) => { for (;;) { const s = sklej(genW(d)); if (s.length <= maxDl && policz(s) !== null) return s; } };
                const gleboki = `${'('.repeat(300)}7${')'.repeat(300)} * 6`;
                return ['3\n2 + 3 * 4\n(2 + 3) * 4\n100 / 7 / 2 - 3 * (4 - 10)',
                    listaT(['0', '1000000000 * 1000000000', '7 / 2', '0 - 7 / 2', '(0 - 7) / 2', '1 - 2 - 3', '2 * 3 * 4 / 5 / 6', gleboki, '((1))+((2))*((3))', '10/3*3']),
                    listaT(Array.from({ length: 40 }, () => wyr(2, 200))),
                    listaT(Array.from({ length: 30 }, () => wyr(5, 1000))),
                    listaT(Array.from({ length: 100 }, () => wyr(3, 300)))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 100) && L.length === n + 1 && L.slice(1).every((w) => w.length >= 1 && w.length <= 1000 && /^[0-9+\-*/() ]+$/.test(w)) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((s) => {
                let p = 0;
                const sp = () => { while (s[p] === ' ') p++; };
                const cz = () => { sp(); if (s[p] === '(') { p++; const v = wy(); sp(); p++; return v; } let v = 0n; while (p < s.length && s[p] >= '0' && s[p] <= '9') v = v * 10n + B(s[p++]); return v; };
                const sk = () => { let v = cz(); for (;;) { sp(); if (s[p] === '*' || s[p] === '/') { const op = s[p++]; const b = cz(); v = op === '*' ? v * b : v / b; } else return v; } };
                const wy = () => { let v = sk(); for (;;) { sp(); if (s[p] === '+' || s[p] === '-') { const op = s[p++]; const b = sk(); v = op === '+' ? v + b : v - b; } else return v; } };
                return String(wy());
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string s;
int poz;
void spacje() {
    while (poz < (int)s.size() && s[poz] == ' ') poz++;
}
long long wyrazenie();
long long czynnik() {
    spacje();
    if (s[poz] == '(') {
        poz++;
        long long w = wyrazenie();
        spacje();
        poz++;
        return w;
    }
    long long w = 0;
    while (poz < (int)s.size() && isdigit(s[poz])) {
        w = w * 10 + (s[poz] - '0');
        poz++;
    }
    return w;
}
long long skladnik() {
    long long w = czynnik();
    while (true) {
        spacje();
        if (poz < (int)s.size() && (s[poz] == '*' || s[poz] == '/')) {
            char op = s[poz];
            poz++;
            long long b = czynnik();
            if (op == '*') w *= b;
            else w /= b;
        } else break;
    }
    return w;
}
long long wyrazenie() {
    long long w = skladnik();
    while (true) {
        spacje();
        if (poz < (int)s.size() && (s[poz] == '+' || s[poz] == '-')) {
            char op = s[poz];
            poz++;
            long long b = skladnik();
            if (op == '+') w += b;
            else w -= b;
        } else break;
    }
    return w;
}
int main() {
    int t;
    cin >> t;
    getline(cin, s);
    while (t--) {
        getline(cin, s);
        poz = 0;
        cout << wyrazenie() << "\n";
    }
    return 0;
}`,
        },
    ];
};
