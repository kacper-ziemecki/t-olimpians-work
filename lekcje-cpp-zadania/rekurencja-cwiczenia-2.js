// Rekurencja — ćwiczenia w trakcie lekcji, części 4–6: rekurencja na tablicach i napisach (indeks w parametrze, szukanie,
// dwa indeksy l i r, napisy przez const &), klasyki na liczbach (NWD, NWW, szybkie potęgowanie, systemy liczbowe, mnożenie
// modulo) oraz drzewo wywołań i memoizacja (Tribonacci, kafelki, schody, ścieżki, gry, szyfry, podziały, nawiasowania).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./rekurencja-pomoc');
    const { calk, B, losDlugi, nwdB, nwwB, powmodB, naSystem, zSystemu, MOD, MODN } = P;
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
    // t wierszy po kilka liczb do 10¹⁸ (napisy): wiersze = tablica tablic
    const wierszeT = (w) => `${w.length}\n${w.map((x) => x.join(' ')).join('\n')}`;
    const checkWiersze = (inp, tMax, ile, ok) => {
        const L = linie(inp); const n = Number(L[0]);
        if (!calk(n, 1, tMax) || L.length !== n + 1) return 'dane';
        for (let i = 1; i <= n; i++) { const t = L[i].trim().split(/\s+/); if (t.length !== ile || !ok(t)) return 'dane'; }
        return null;
    };
    const tabl = (a) => `${a.length}\n${a.join(' ')}`;

    return [
        // ================================================================ KROK 4 · tablice i napisy
        {
            id: 'rk-dni-mrozu', krok: 4, level: 'latwe',
            title: 'Dni mrozu i dni upału',
            short: 'Ile dni było mroźnych, a ile upalnych? Rekurencja idzie po tablicy indeksem: wynik dla i to „czy dzień i się liczy” plus wynik dla i + 1.',
            tags: ['indeks w parametrze', 'tablica globalna', 'stop: i == n'],
            statement: ['Stacja meteo zapisała temperatury z n kolejnych dni. Policz, ile było dni mroźnych (temperatura poniżej zera) i ile upalnych (powyżej 20 stopni).',
                'Napisz funkcje rekurencyjne, które idą po tablicy od indeksu i do końca: wynik dla i to 1 albo 0 (czy dzień i się liczy) plus wynik dla i + 1. Za tablicą (i == n) wynik to 0.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Dwie liczby oddzielone spacją: liczba dni mroźnych i liczba dni upalnych.'],
            constraints: ['1 ≤ n ≤ 10 000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '7\n-3 0 5 21 -1 25 20', note: 'Mroźne: −3 i −1. Upalne: 21 i 25 (20 to jeszcze nie upał, a 0 to nie mróz).' }],
            hint: R`int t[10005]; int n; int mrozne(int i) { if (i == n) return 0; return (t[i] < 0) + mrozne(i + 1); } — wyrażenie (t[i] < 0) ma wartość 1, gdy warunek jest prawdziwy, i 0, gdy fałszywy. Funkcję upalne napisz tak samo z t[i] > 20. W main: cout << mrozne(0) << " " << upalne(0);.`,
            tests: (r) => [tabl([-3, 0, 5, 21, -1, 25, 20]), tabl([0]), tabl(r.arr(10000, -50, 50)), tabl(r.arr(100, -10, 30)), tabl(new Array(10000).fill(-50)), tabl([21, 20, -1, 0])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -50, 50)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); return `${t.filter((x) => x < 0).length} ${t.filter((x) => x > 20).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int t[10005];
int n;
int mrozne(int i) {
    if (i == n) return 0;
    return (t[i] < 0) + mrozne(i + 1);
}
int upalne(int i) {
    if (i == n) return 0;
    return (t[i] > 20) + upalne(i + 1);
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> t[i];
    cout << mrozne(0) << " " << upalne(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-najwyzszy-szczyt', krok: 4, level: 'latwe',
            title: 'Najwyższy szczyt',
            short: 'Funkcja rekurencyjna oddaje indeks najwyższego szczytu we fragmencie od i do końca. Przy remisie wygrywa szczyt bardziej na zachód.',
            tags: ['zwracanie indeksu', 'remisy: >=', 'tablica'],
            statement: ['Przewodnik ma listę n szczytów z wysokościami, w kolejności z zachodu na wschód. Wypisz wysokość najwyższego szczytu i jego numer na liście (licząc od 1). Jeśli kilka szczytów ma tę samą największą wysokość, podaj ten najbardziej na zachód (o najmniejszym numerze).',
                'Napisz funkcję rekurencyjną int najwyzszy(int i), która oddaje indeks najwyższego szczytu wśród szczytów od i do n − 1: dla ostatniego szczytu to on sam, a dla wcześniejszych — porównujesz szczyt i z najwyższym w reszcie listy.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych — wysokości szczytów.'],
            output_format: ['Dwie liczby: największa wysokość i numer szczytu, który ją ma.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ wysokość ≤ 10⁹'],
            examples: [{ input: '6\n1200 2499 800 2499 1500 2000', note: 'Dwa szczyty mają 2499 m — wygrywa ten o numerze 2.' }],
            hint: R`int najwyzszy(int i) { if (i == n - 1) return i; int j = najwyzszy(i + 1); if (h[i] >= h[j]) return i; return j; }. Znak >= sprawia, że przy remisie wygrywa szczyt bardziej na zachód (i < j). Ze znakiem > wygrałby ten na wschodzie. W main wypisz h[k] i k + 1, gdzie k = najwyzszy(0).`,
            tests: (r) => [tabl([1200, 2499, 800, 2499, 1500, 2000]), tabl([7]), tabl(r.arr(10000, 1, 10000000)), tabl(r.arr(10000, 1, 5)), tabl([5, 5, 5, 5]), tabl([1, 2, 3, 4, 1000000000])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); let k = 0; for (let i = 1; i < t.length; i++) if (t[i] > t[k]) k = i; return `${t[k]} ${k + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int h[10005];
int n;
int najwyzszy(int i) {
    if (i == n - 1) return i;
    int j = najwyzszy(i + 1);
    if (h[i] >= h[j]) return i;
    return j;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> h[i];
    int k = najwyzszy(0);
    cout << h[k] << " " << k + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-schody-rosnace', krok: 4, level: 'latwe',
            title: 'Czy schody idą w górę?',
            short: 'Ciąg jest rosnący, jeśli każdy wyraz jest mniejszy od następnego. Rekurencja znajduje pierwsze miejsce, w którym to się psuje — albo oddaje −1.',
            tags: ['szukanie z wczesnym return', 'sąsiednie elementy', 'kilka testów'],
            statement: ['Stopnie schodów mają wysokości a₁, a₂, …, aₙ (licząc od dołu). Schody są dobre, jeśli każdy stopień jest wyżej niż poprzedni. Dla każdego z t zestawów wypisz TAK, jeśli schody są dobre, a jeśli nie — NIE i numer i pierwszego stopnia, za którym następny nie jest wyżej (czyli najmniejsze i, dla którego aᵢ ≥ aᵢ₊₁).',
                'Napisz funkcję rekurencyjną int pierwszyZly(int i), która oddaje indeks pierwszego złego miejsca od i w prawo albo −1, gdy takiego nie ma.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy zestaw to dwa wiersze: n, a w następnym n liczb całkowitych.'],
            output_format: ['t wierszy: TAK albo NIE i numer stopnia (oddzielone spacją).'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 10 000', '1 ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '3\n4\n1 3 7 8\n5\n2 5 5 6 1\n1\n42', note: 'W drugim zestawie stopnie 2 i 3 są równe (5 i 5), więc pierwsze złe miejsce to stopień 2.' }],
            hint: R`int pierwszyZly(int i) { if (i >= n - 1) return -1; if (a[i] >= a[i + 1]) return i; return pierwszyZly(i + 1); }. Wczesny return przerywa schodzenie — dalszych stopni nikt już nie ogląda. Wypisz i + 1, bo stopnie numerujemy od 1.`,
            tests: (r) => {
                const ros = (n) => { const a = []; let x = r.int(1, 10); for (let i = 0; i < n; i++) { a.push(x); x += r.int(1, 30); } return a; };
                const zepsuj = (a) => { const b = a.slice(); const i = r.int(0, b.length - 2); b[i + 1] = b[i] - r.int(0, Math.min(5, b[i] - 1)); return b; };
                const z = (ts) => `${ts.length}\n${ts.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                return [z([[1, 3, 7, 8], [2, 5, 5, 6, 1], [42]]), z([ros(10000), ros(1), [5, 4], [1, 1]]), z([zepsuj(ros(10000))]),
                    z(Array.from({ length: 10 }, () => (r() < 0.5 ? ros(r.int(2, 800)) : zepsuj(ros(r.int(2, 800))))))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 10)) return 'dane'; let p = 1; for (let k = 0; k < t[0]; k++) { const n = t[p]; if (!calk(n, 1, 10000)) return 'dane'; if (!t.slice(p + 1, p + 1 + n).every((x) => calk(x, 1, 1e9))) return 'dane'; p += n + 1; } return p === t.length ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const w = []; let p = 1; for (let k = 0; k < t[0]; k++) { const n = t[p]; const a = t.slice(p + 1, p + 1 + n); p += n + 1; let z = -1; for (let i = 0; i + 1 < n; i++) if (a[i] >= a[i + 1]) { z = i; break; } w.push(z < 0 ? 'TAK' : `NIE ${z + 1}`); } return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int a[10005];
int n;
int pierwszyZly(int i) {
    if (i >= n - 1) return -1;
    if (a[i] >= a[i + 1]) return i;
    return pierwszyZly(i + 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        cin >> n;
        for (int i = 0; i < n; i++) cin >> a[i];
        int z = pierwszyZly(0);
        if (z == -1) cout << "TAK\n";
        else cout << "NIE " << z + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-gdzie-jest', krok: 4, level: 'latwe',
            title: 'Gdzie jest numer?',
            short: 'Dla każdego pytania znajdź pierwsze miejsce na liście, na którym stoi szukany numer — albo −1. Szukanie rekurencyjne od indeksu i w prawo.',
            tags: ['szukanie liniowe', 'zwracanie indeksu', '−1 gdy brak'],
            statement: ['Na liście zgłoszeń stoi n numerów startowych (numery mogą się powtarzać). Sędzia zadaje q pytań: na którym miejscu listy po raz pierwszy pojawia się numer x?',
                'Napisz funkcję rekurencyjną int szukaj(int i, int x), która oddaje pierwszy indeks j ≥ i, dla którego t[j] == x, albo −1, gdy takiego nie ma. Miejsca na liście numeruj od 1.'],
            input_format: ['W pierwszym wierszu n, w drugim — n numerów z listy.', 'W trzecim wierszu q, w czwartym — q szukanych numerów.'],
            output_format: ['q wierszy: miejsce pierwszego wystąpienia numeru albo −1.'],
            constraints: ['1 ≤ n, q ≤ 1000', 'Wszystkie numery są od 1 do 1000.'],
            examples: [{ input: '6\n7 3 9 3 7 1\n4\n3 7 1 5', note: 'Numer 3 stoi na miejscach 2 i 4 — liczy się pierwsze. Numeru 5 nie ma.' }],
            hint: R`int szukaj(int i, int x) { if (i == n) return -1; if (t[i] == x) return i; return szukaj(i + 1, x); }. W main dla każdego pytania: int j = szukaj(0, x); cout << (j == -1 ? -1 : j + 1) << "\n";. Uważaj, żeby nie dodać 1 do −1.`,
            tests: (r) => {
                const z = (a, q) => `${a.length}\n${a.join(' ')}\n${q.length}\n${q.join(' ')}`;
                return [z([7, 3, 9, 3, 7, 1], [3, 7, 1, 5]), z([1], [1, 2]), z(r.arr(1000, 1, 100), r.arr(1000, 1, 120)), z(r.arr(1000, 1, 1000), r.arr(1000, 1, 1000)), z(new Array(1000).fill(1000), [1000, 999])];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; const q = t[n + 1]; return calk(n, 1, 1000) && calk(q, 1, 1000) && t.length === n + q + 2 && t.every((x, i) => i === 0 || i === n + 1 || calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const a = t.slice(1, n + 1); return t.slice(n + 2).map((x) => { const j = a.indexOf(x); return j < 0 ? -1 : j + 1; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int t[1005];
int n;
int szukaj(int i, int x) {
    if (i == n) return -1;
    if (t[i] == x) return i;
    return szukaj(i + 1, x);
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> t[i];
    int q;
    cin >> q;
    while (q--) {
        int x;
        cin >> x;
        int j = szukaj(0, x);
        if (j == -1) cout << -1 << "\n";
        else cout << j + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-jakala', krok: 4, level: 'latwe',
            title: 'Zacinająca się klawiatura',
            short: 'mmmammmaaa → mama. Litera trafia na wyjście tylko wtedy, gdy różni się od poprzedniej. Indeks idzie po napisie, a napis przekazujesz przez const &.',
            tags: ['napis i indeks', 'porównanie z poprzednim', 'const string &'],
            statement: ['Klawiatura Bajtka się zacina: niektóre klawisze wciskają się po kilka razy pod rząd. Usuń z napisu powtórzenia — z każdej grupy takich samych liter stojących obok siebie zostaw jedną.',
                'Napisz funkcję rekurencyjną void popraw(const string &s, int i), która wypisuje s[i], jeśli i == 0 albo s[i] różni się od s[i − 1], i wywołuje samą siebie dla i + 1.'],
            input_format: ['W jedynym wierszu napis z małych liter.'],
            output_format: ['W jedynym wierszu poprawiony napis.'],
            constraints: ['1 ≤ długość napisu ≤ 10 000'],
            examples: [{ input: 'mmmammmaaa' }, { input: 'abc', note: 'Bez powtórzeń nic się nie zmienia.' }],
            hint: R`void popraw(const string &s, int i) { if (i == (int)s.size()) return; if (i == 0 || s[i] != s[i - 1]) cout << s[i]; popraw(s, i + 1); }. Warunek i == 0 stoi pierwszy — dzięki temu przy i = 0 nikt nie zagląda do s[−1] (operator || nie liczy prawej strony, gdy lewa jest prawdziwa).`,
            tests: (r) => {
                const zac = (n) => { let s = ''; while (s.length < n) s += r.word(1, 'abcdkmot').repeat(r.int(1, 5)); return s.slice(0, n); };
                return ['mmmammmaaa', 'abc', 'a', 'zzzzzzzzzz', zac(10000), zac(60), r.word(10000)];
            },
            check: (inp) => (/^[a-z]{1,10000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => inp.trim().replace(/(.)\1+/g, '$1'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void popraw(const string &s, int i) {
    if (i == (int)s.size()) return;
    if (i == 0 || s[i] != s[i - 1]) cout << s[i];
    popraw(s, i + 1);
}
int main() {
    string s;
    cin >> s;
    popraw(s, 0);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-kolejka-do-kasy', krok: 4, level: 'srednie',
            title: 'Kolejka do kasy',
            short: 'Każdy klient czeka tyle, ile trwa obsługa wszystkich przed nim. Czas oczekiwania płynie w parametrze, a funkcja oddaje łączny czas czekania całej kolejki.',
            tags: ['akumulator w parametrze', 'cout i return naraz', 'tablica'],
            statement: ['W kolejce do jedynej kasy stoi n klientów, obsługa i-tego trwa tᵢ sekund. Pierwszy klient nie czeka wcale, drugi czeka t₁ sekund, trzeci t₁ + t₂ i tak dalej.',
                'Wypisz czas oczekiwania każdego klienta, a w drugim wierszu — łączny czas oczekiwania wszystkich klientów. Napisz funkcję rekurencyjną long long kolejka(int i, long long czeka): wypisuje czas oczekiwania klienta i (to właśnie czeka), wywołuje samą siebie dla i + 1 z czasem powiększonym o t[i], a oddaje czeka plus łączne oczekiwanie dalszych klientów.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych — czasy obsługi.'],
            output_format: ['W pierwszym wierszu n czasów oczekiwania oddzielonych spacjami.', 'W drugim wierszu ich suma.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ tᵢ ≤ 1000'],
            examples: [{ input: '4\n3 1 4 2', note: 'Czasy oczekiwania: 0, 3, 3 + 1 = 4 i 3 + 1 + 4 = 8. Razem 15.' }],
            hint: R`long long kolejka(int i, long long czeka) { if (i == n) return 0; cout << czeka << " "; long long dalsi = kolejka(i + 1, czeka + t[i]); return czeka + dalsi; }. W main: long long suma = kolejka(0, 0); cout << "\n" << suma << "\n";. Parametr niesie informację w dół (ile już czekamy), a return — w górę (ile czekają wszyscy dalej).`,
            tests: (r) => [tabl([3, 1, 4, 2]), tabl([5]), tabl(r.arr(2000, 1, 1000)), tabl(new Array(2000).fill(1000)), tabl(r.arr(50, 1, 10))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); let c = 0, s = 0; const w = []; for (const x of t) { w.push(c); s += c; c += x; } return `${w.join(' ')}\n${s}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int t[2005];
int n;
long long kolejka(int i, long long czeka) {
    if (i == n) return 0;
    cout << czeka << " ";
    long long dalsi = kolejka(i + 1, czeka + t[i]);
    return czeka + dalsi;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> t[i];
    long long suma = kolejka(0, 0);
    cout << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-wzorzec', krok: 4, level: 'srednie',
            title: 'Ile razy wzorzec?',
            short: 'Policz wystąpienia krótkiego wzorca w napisie, także nachodzące na siebie: w aaaa wzorzec aa jest 3 razy. ile(i) = (czy wzorzec zaczyna się w i) + ile(i + 1).',
            tags: ['napis i indeks', 'substr', 'wystąpienia nachodzące'],
            statement: ['Wczytaj napis s i krótki wzorzec p (oba z małych liter). Policz, na ilu pozycjach w s zaczyna się p — wystąpienia mogą na siebie nachodzić.',
                'Napisz funkcję rekurencyjną int ile(int i), która oddaje liczbę wystąpień p zaczynających się na pozycjach od i w prawo. Gdy do końca s zostało mniej liter niż ma p, wynik to 0.'],
            input_format: ['W pierwszym wierszu napis s.', 'W drugim wierszu wzorzec p.'],
            output_format: ['Jedna liczba — liczba wystąpień.'],
            constraints: ['1 ≤ |s| ≤ 10 000', '1 ≤ |p| ≤ 10'],
            examples: [{ input: 'abababa\naba', note: 'aba zaczyna się na pozycjach 0, 2 i 4 — wystąpienia nachodzą na siebie.' }, { input: 'kot\nkotek' }],
            hint: R`string s, p; int ile(int i) { if (i + (int)p.size() > (int)s.size()) return 0; return (s.substr(i, p.size()) == p) + ile(i + 1); }. substr robi tu tylko małą kopię (najwyżej 10 liter). Rzutowania (int) przy size() chronią przed pułapką liczb bez znaku.`,
            tests: (r) => ['abababa\naba', 'kot\nkotek', 'aaaa\naa', `${r.word(10000, 'ab')}\n${r.word(3, 'ab')}`, `${r.word(10000, 'abc')}\n${r.word(2, 'abc')}`, `${'a'.repeat(10000)}\n${'a'.repeat(10)}`, `${r.word(500)}\nq`, 'x\nx'],
            check: (inp) => { const L = linie(inp); return L.length === 2 && /^[a-z]{1,10000}$/.test(L[0]) && /^[a-z]{1,10}$/.test(L[1]) ? null : 'dane'; },
            solve: (inp) => { const [s, p] = linie(inp); let k = 0; for (let i = 0; i + p.length <= s.length; i++) if (s.startsWith(p, i)) k++; return String(k); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string s, p;
int ile(int i) {
    if (i + (int)p.size() > (int)s.size()) return 0;
    return (s.substr(i, p.size()) == p) + ile(i + 1);
}
int main() {
    cin >> s >> p;
    cout << ile(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-kajak', krok: 4, level: 'srednie',
            title: 'Kajak i inne palindromy',
            short: 'Czy zdanie jest palindromem, gdy pominiesz spacje, znaki interpunkcyjne i wielkość liter? Dwa indeksy idą do środka i przeskakują wszystko, co nie jest literą.',
            tags: ['dwa indeksy l i r', 'isalpha i tolower', 'getline'],
            statement: ['Zdanie „Kobyla ma maly bok.” czytane od tyłu brzmi tak samo — jeśli patrzymy tylko na litery i nie zwracamy uwagi na ich wielkość. Dla każdego z t wierszy sprawdź, czy jest takim palindromem, i wypisz TAK albo NIE.',
                'Napisz funkcję rekurencyjną bool palindrom(const string &s, int l, int r): jeśli l ≥ r — to palindrom; jeśli s[l] nie jest literą — przesuń l; jeśli s[r] nie jest literą — przesuń r; inaczej porównaj litery (bez względu na wielkość) i idź do środka.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy zdanie złożone z liter alfabetu łacińskiego (bez polskich znaków), spacji i znaków , . ! ? -'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 50', 'Każdy wiersz ma od 1 do 1000 znaków i zaczyna się literą.'],
            examples: [{ input: '3\nKobyla ma maly bok.\nAla ma kota\nA!' }],
            hint: R`bool palindrom(const string &s, int l, int r) { if (l >= r) return true; if (!isalpha(s[l])) return palindrom(s, l + 1, r); if (!isalpha(s[r])) return palindrom(s, l, r - 1); if (tolower(s[l]) != tolower(s[r])) return false; return palindrom(s, l + 1, r - 1); }. Wiersze czytaj przez getline, a po cin >> t wywołaj cin.ignore();. Napis przekazuj przez const & — z kopią albo z s.substr w każdym wywołaniu długie wiersze kosztowałyby ogromnie dużo pamięci i czasu.`,
            tests: (r) => {
                const ZN = [' ', ' ', ' ', ',', '.', '!', '?', '-'];
                const ubierz = (litery) => {
                    let s = '';
                    for (let i = 0; i < litery.length; i++) {
                        s += r() < 0.3 ? litery[i].toUpperCase() : litery[i];
                        if (i + 1 < litery.length && r() < 0.25) s += r.pick(ZN);
                    }
                    return s;
                };
                const pal = (n) => { const a = r.word(n, 'abcdeklmnorst'); return ubierz(a + (r() < 0.5 ? r.word(1) : '') + a.split('').reverse().join('')); };
                const nie = (n) => { for (;;) { const a = r.word(n, 'abcdeklmnorst'); if (a !== a.split('').reverse().join('')) return ubierz(a); } };
                const zestaw = (k, dl) => Array.from({ length: k }, () => (r() < 0.5 ? pal(r.int(1, dl)) : nie(r.int(2, dl * 2)))).map((s) => s.slice(0, 1000));
                return [listaT(['Kobyla ma maly bok.', 'Ala ma kota', 'A!']), listaT(['Kajak', 'Kajaki', 'Zakopane na pokaz', 'Ab, ba!', 'Ab-cb']), listaT(zestaw(50, 450)), listaT(zestaw(20, 20))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 50) && L.length === n + 1 && L.slice(1).every((l) => /^[A-Za-z][A-Za-z ,.!?-]{0,999}$/.test(l)) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const a = l.toLowerCase().replace(/[^a-z]/g, ''); return a === a.split('').reverse().join('') ? 'TAK' : 'NIE'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool palindrom(const string &s, int l, int r) {
    if (l >= r) return true;
    if (!isalpha(s[l])) return palindrom(s, l + 1, r);
    if (!isalpha(s[r])) return palindrom(s, l, r - 1);
    if (tolower(s[l]) != tolower(s[r])) return false;
    return palindrom(s, l + 1, r - 1);
}
int main() {
    int t;
    cin >> t;
    cin.ignore();
    while (t--) {
        string s;
        getline(cin, s);
        if (palindrom(s, 0, (int)s.size() - 1)) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 5 · NWD i szybkie potęgowanie
        {
            id: 'rk-skracanie', krok: 5, level: 'latwe',
            title: 'Skracanie ułamków',
            short: 'Skróć ułamek a/b do postaci nieskracalnej: podziel licznik i mianownik przez NWD(a, b), liczone rekurencyjnie algorytmem Euklidesa.',
            tags: ['NWD rekurencyjnie', 'algorytm Euklidesa', 'long long'],
            statement: ['Dla każdego z t ułamków a/b wypisz ułamek skrócony do postaci nieskracalnej.',
                'Napisz funkcję rekurencyjną long long nwd(long long a, long long b): nwd(a, 0) = a, a w pozostałych przypadkach nwd(a, b) = nwd(b, a % b).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby całkowite a i b — licznik i mianownik.'],
            output_format: ['t wierszy w formacie licznik/mianownik (bez spacji).'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n6 8\n10 5\n7 13', note: '10/5 to 2/1 — mianownik 1 też wypisujemy.' }],
            hint: R`long long nwd(long long a, long long b) { if (b == 0) return a; return nwd(b, a % b); }. Potem long long g = nwd(a, b); cout << a / g << "/" << b / g << "\n";. Algorytm Euklidesa jest bardzo szybki: nawet dla liczb rzędu 10¹⁸ wykonuje najwyżej kilkadziesiąt wywołań.`,
            tests: (r) => {
                const para = () => { const g = losDlugi(r, 1n, 1000000000n); const max = B(E18) / g; return [String(g * losDlugi(r, 1n, max)), String(g * losDlugi(r, 1n, max))]; };
                return [wierszeT([['6', '8'], ['10', '5'], ['7', '13']]), wierszeT([[E18, E18], ['1', E18], [E18, '999999999999999999'], ['679891637638612258', '420196140727489673'], ['1', '1']]), wierszeT(Array.from({ length: 1000 }, para))];
            },
            check: (inp) => checkWiersze(inp, 1000, 2, (t) => t.every((x) => bigOk(x, '1', E18))),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, b] = l.trim().split(/\s+/).map(B); const g = nwdB(a, b); return `${a / g}/${b / g}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    if (b == 0) return a;
    return nwd(b, a % b);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        long long g = nwd(a, b);
        cout << a / g << "/" << b / g << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-plytki', krok: 5, level: 'latwe',
            title: 'Kwadratowe płytki',
            short: 'Podłogę a × b wyłóż jednakowymi kwadratowymi płytkami bez cięcia — jak największymi. Bok płytki to NWD(a, b), a płytek jest (a / bok) · (b / bok).',
            tags: ['NWD rekurencyjnie', 'zastosowanie NWD', 'iloczyn w long long'],
            statement: ['Glazurnik ma wyłożyć prostokątną podłogę o wymiarach a × b centymetrów jednakowymi kwadratowymi płytkami — bez cięcia i bez szpar. Chce użyć jak największych płytek. Jaki bok mają płytki i ile ich potrzeba?',
                'Bok płytki musi dzielić i a, i b — największy taki bok to NWD(a, b). Napisz NWD jako funkcję rekurencyjną.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy: bok płytki i liczba płytek, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '2\n12 18\n7 5', note: 'Podłoga 12 × 18: płytki 6 × 6, w rzędzie 2, a rzędów 3 — razem 6 płytek.' }],
            hint: R`long long g = nwd(a, b); cout << g << " " << (a / g) * (b / g) << "\n";. Liczba płytek sięga 10¹⁸ (np. podłoga 10⁹ × (10⁹ − 1) wymaga płytek 1 × 1), więc licz ją w long long.`,
            tests: (r) => {
                const para = () => { const g = r.int(1, 100000); return [String(g * r.int(1, Math.floor(1e9 / g))), String(g * r.int(1, Math.floor(1e9 / g)))]; };
                return [wierszeT([['12', '18'], ['7', '5']]), wierszeT([['1000000000', '999999999'], ['1000000000', '1000000000'], ['1', '1'], ['1', '1000000000']]), wierszeT(Array.from({ length: 1000 }, para))];
            },
            check: (inp) => checkWiersze(inp, 1000, 2, (t) => t.every((x) => bigOk(x, '1', '1000000000'))),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, b] = l.trim().split(/\s+/).map(B); const g = nwdB(a, b); return `${g} ${(a / g) * (b / g)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    if (b == 0) return a;
    return nwd(b, a % b);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        long long g = nwd(a, b);
        cout << g << " " << (a / g) * (b / g) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-kroki-euklidesa', krok: 5, level: 'latwe',
            title: 'Kroki Euklidesa',
            short: 'Ile razy algorytm Euklidesa liczy resztę z dzielenia, zanim dojdzie do zera? Jedna funkcja rekurencyjna oddaje NWD, druga — liczbę kroków.',
            tags: ['NWD rekurencyjnie', 'liczenie wywołań', 'return 1 + …'],
            statement: ['Algorytm Euklidesa zamienia parę (a, b) na (b, a % b), aż drugi element stanie się zerem. Każdą taką zamianę nazwijmy krokiem. Na przykład (21, 13) → (13, 8) → (8, 5) → (5, 3) → (3, 2) → (2, 1) → (1, 0) to 6 kroków, a NWD to 1.',
                'Dla każdej z t par wypisz NWD i liczbę kroków. Napisz funkcję rekurencyjną int kroki(long long a, long long b): dla b == 0 nie trzeba żadnego kroku, a w przeciwnym razie — jeden krok plus kroki dla pary (b, a % b).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy: NWD i liczba kroków, oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ 10¹⁸', '0 ≤ b ≤ 10¹⁸'],
            examples: [{ input: '3\n21 13\n12 18\n5 0', note: '(12, 18) → (18, 12) → (12, 6) → (6, 0): 3 kroki, bo pierwszy krok tylko zamienia liczby miejscami.' }],
            hint: R`int kroki(long long a, long long b) { if (b == 0) return 0; return 1 + kroki(b, a % b); }. Najwięcej kroków robią pary sąsiednich liczb Fibonacciego, ale nawet one nie przekraczają kilkudziesięciu kroków dla 10¹⁸.`,
            tests: (r) => {
                const F = [0n, 1n]; for (let i = 2; i <= 87; i++) F.push(F[i - 1] + F[i - 2]);
                const para = () => [String(losDlugi(r, 1n, B(E18))), String(r() < 0.1 ? 0n : losDlugi(r, 0n, B(E18)))];
                return [wierszeT([['21', '13'], ['12', '18'], ['5', '0']]), wierszeT([[String(F[87]), String(F[86])], [String(F[86]), String(F[87])], [E18, '1'], ['1', E18], [E18, E18], ['7', '0']]), wierszeT(Array.from({ length: 1000 }, para))];
            },
            check: (inp) => checkWiersze(inp, 1000, 2, (t) => bigOk(t[0], '1', E18) && bigOk(t[1], '0', E18)),
            solve: (inp) => linie(inp).slice(1).map((l) => { let [a, b] = l.trim().split(/\s+/).map(B); let k = 0; while (b !== 0n) { [a, b] = [b, a % b]; k++; } return `${a} ${k}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    if (b == 0) return a;
    return nwd(b, a % b);
}
int kroki(long long a, long long b) {
    if (b == 0) return 0;
    return 1 + kroki(b, a % b);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        cout << nwd(a, b) << " " << kroki(a, b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-autobusy', krok: 5, level: 'srednie',
            title: 'Autobusy na pętli',
            short: 'Autobusy różnych linii odjeżdżają z pętli co a₁, a₂, …, aₙ minut. Kiedy znowu odjadą wszystkie naraz? To NWW wszystkich liczb, liczone przez NWD.',
            tags: ['NWW przez NWD', 'najpierw dziel, potem mnóż', 'long long'],
            statement: ['O północy z pętli odjechały naraz autobusy n linii. Autobus linii i odjeżdża co aᵢ minut. Po ilu minutach od północy znowu wszystkie odjadą w tej samej chwili?',
                'To najmniejsza wspólna wielokrotność liczb aᵢ. NWW(a, b) = a / NWD(a, b) · b — najpierw dziel, potem mnóż, żeby nie wyjść poza zakres. NWW wielu liczb licz po kolei: NWW(NWW(a₁, a₂), a₃) i tak dalej. NWD napisz rekurencyjnie.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych aᵢ.'],
            output_format: ['Jedna liczba — po ilu minutach wszystkie autobusy znowu odjadą razem.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ aᵢ ≤ 10⁹', 'Wynik nie przekracza 10¹⁸.'],
            examples: [{ input: '3\n4 6 10', note: 'NWW(4, 6) = 12, a NWW(12, 10) = 60.' }],
            hint: R`long long nww(long long a, long long b) { return a / nwd(a, b) * b; }, a w main: long long w = 1; for (…) w = nww(w, a);. Kolejność ma znaczenie: a * b / nwd(a, b) przy dużych liczbach przepełni long long, zanim zdążysz podzielić.`,
            tests: (r) => {
                const PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
                const zestaw = (n) => {
                    let L = 1n; const wyk = {};
                    for (let k = 0; k < 60; k++) { const p = r.pick(PR); if (L * B(p) > B(E18)) continue; L *= B(p); wyk[p] = (wyk[p] || 0) + 1; }
                    const a = [];
                    while (a.length < n) {
                        let d = 1n;
                        for (const [p, e] of Object.entries(wyk)) { const k = r.int(0, e); for (let i = 0; i < k; i++) if (d * B(p) <= 1000000000n) d *= B(p); }
                        a.push(String(d));
                    }
                    return a;
                };
                return [tabl([4, 6, 10]), tabl([7]), tabl([1000000000, 999999999]), tabl(zestaw(100)), tabl(zestaw(5)), tabl(new Array(100).fill(1)), tabl(zestaw(30))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 100) || t.length !== n + 1 || !t.slice(1).every((x) => bigOk(x, '1', '1000000000'))) return 'dane'; let w = 1n; for (const x of t.slice(1)) w = nwwB(w, B(x)); return w <= B(E18) ? null : 'wynik'; },
            solve: (inp) => { let w = 1n; for (const x of toks(inp).slice(1)) w = nwwB(w, B(x)); return String(w); },
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
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 0; i < n; i++) {
        long long a;
        cin >> a;
        w = nww(w, a);
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-ostatnie-cyfry', krok: 5, level: 'srednie',
            title: 'Trzy ostatnie cyfry',
            short: 'aⁿ może mieć miliardy cyfr, ale potrzebujesz tylko trzech ostatnich. Szybkie potęgowanie modulo 1000: aⁿ = (a^(n/2))² — około 60 wywołań nawet dla n = 10¹⁸.',
            tags: ['szybkie potęgowanie', 'modulo', 'zera z przodu'],
            statement: ['Dla każdej z t par a, n wypisz trzy ostatnie cyfry liczby aⁿ — dokładnie trzy znaki, z zerami z przodu, jeśli trzeba. Na przykład 2¹⁰ = 1024 kończy się na 024, a 7² = 49 — na 049.',
                'Napisz funkcję rekurencyjną long long potega(long long a, long long n), która liczy aⁿ mod 1000: a⁰ = 1, dla parzystego n aⁿ = (a^(n/2))², a dla nieparzystego — jeszcze razy a. Wynik wywołania dla n / 2 zapisz do zmiennej i użyj go dwa razy — nie wywołuj funkcji dwa razy!'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby całkowite a i n.'],
            output_format: ['t wierszy, każdy z dokładnie trzema cyframi.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ 10⁹', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n2 10\n7 2\n123456789 0', note: 'Każda liczba do potęgi 0 to 1, czyli 001.' }],
            hint: R`long long potega(long long a, long long n) { if (n == 0) return 1; long long p = potega(a, n / 2); long long w = p * p % 1000; if (n % 2 == 1) w = w * (a % 1000) % 1000; return w; }. Wypisz: cout << setw(3) << setfill('0') << potega(a, n) << "\n";. Gdybyś napisał potega(a, n / 2) * potega(a, n / 2), funkcja wołałaby się dwa razy na każdym poziomie i straciłaby całą szybkość.`,
            tests: (r) => {
                const para = () => [String(r.int(1, 1000000000)), String(r() < 0.1 ? r.int(0, 5) : losDlugi(r, 0n, B(E18)))];
                return [wierszeT([['2', '10'], ['7', '2'], ['123456789', '0']]), wierszeT([['1000', E18], ['1000000000', '1'], ['999999999', E18], ['2', '9'], ['5', '3'], ['10', '2'], ['1', '0']]), wierszeT(Array.from({ length: 1000 }, para))];
            },
            check: (inp) => checkWiersze(inp, 1000, 2, (t) => bigOk(t[0], '1', '1000000000') && bigOk(t[1], '0', E18)),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, n] = l.trim().split(/\s+/).map(B); return String(powmodB(a, n, 1000n)).padStart(3, '0'); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long potega(long long a, long long n) {
    if (n == 0) return 1;
    long long p = potega(a, n / 2);
    long long w = p * p % 1000;
    if (n % 2 == 1) w = w * (a % 1000) % 1000;
    return w;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, n;
        cin >> a >> n;
        cout << setw(3) << setfill('0') << potega(a, n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-upor-liczby', krok: 5, level: 'srednie',
            title: 'Uparta liczba',
            short: 'Zamieniaj liczbę na iloczyn jej cyfr, aż zostanie jedna cyfra: 39 → 27 → 14 → 4, czyli 3 kroki. Dwie funkcje rekurencyjne: iloczyn cyfr i liczba kroków.',
            tags: ['dwie funkcje rekurencyjne', 'iloczyn cyfr', 'return 1 + …'],
            statement: ['Upór liczby to liczba kroków, w których zamieniamy liczbę na iloczyn jej cyfr, aż zostanie liczba jednocyfrowa. Na przykład 39 → 3 · 9 = 27 → 2 · 7 = 14 → 1 · 4 = 4, więc upór 39 to 3. Liczba jednocyfrowa ma upór 0.',
                'Dla każdej z t liczb wypisz jej upór. Napisz rekurencyjnie long long iloczyn(long long n) (iloczyn cyfr) i int upor(long long n): dla n < 10 zero, a inaczej 1 + upor(iloczyn(n)).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — upory kolejnych liczb.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n39\n7\n277777788888899', note: 'Ostatnia liczba ma upór 11 — to najmniejsza liczba o takim uporze.' }],
            hint: R`int upor(long long n) { if (n < 10) return 0; return 1 + upor(iloczyn(n)); }. To rekurencja, która w środku wywołuje inną rekurencję: najpierw iloczyn(n) policzy iloczyn cyfr (sam rekurencyjnie), a dopiero potem upor wywoła się dla wyniku.`,
            tests: (r) => {
                const upart = () => { let s = ''; const k = r.int(2, 18); for (let i = 0; i < k; i++) s += r.pick('2346789'); return s; };
                return [listaT(['39', '7', '277777788888899']), listaT(['0', '10', '25', '999', '1000000000000000000', '999999999999999999', '68889', '2677889', '26888999', '3778888999', '27777789999999999']), listaT(Array.from({ length: 1000 }, () => (r() < 0.5 ? upart() : String(losDlugi(r, 0n, B(E18))))))];
            },
            check: (inp) => checkT(inp, 1000, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => { let n = B(x), k = 0; while (n >= 10n) { n = String(n).split('').reduce((a, c) => a * B(c), 1n); k++; } return String(k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long iloczyn(long long n) {
    if (n < 10) return n;
    return (n % 10) * iloczyn(n / 10);
}
int upor(long long n) {
    if (n < 10) return 0;
    return 1 + upor(iloczyn(n));
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << upor(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-z-systemu-do-systemu', krok: 5, level: 'srednie',
            title: 'Z systemu do systemu',
            short: 'Przelicz liczbę z systemu o podstawie p na system o podstawie q (od 2 do 16). Wartość liczysz rekurencją po cyfrach napisu, a nowy zapis wypisujesz w drodze powrotnej.',
            tags: ['dwie rekurencje', 'systemy liczbowe', 'cyfry A–F'],
            statement: ['Dla każdego z t zapytań dostajesz podstawy p i q oraz liczbę zapisaną w systemie o podstawie p. Wypisz tę liczbę w systemie o podstawie q. Cyfry większe niż 9 to wielkie litery: A = 10, B = 11, …, F = 15.',
                'Napisz dwie funkcje rekurencyjne: long long wartosc(const string &s, int i, int p) — wartość pierwszych i cyfr napisu (to wartość pierwszych i − 1 cyfr razy p plus i-ta cyfra) — oraz void wypisz(long long x, int q), która wypisuje zapis x w systemie q (najpierw wypisz(x / q, q), potem ostatnia cyfra).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy p, q i zapis liczby w systemie p (bez zer z przodu).'],
            output_format: ['t wierszy — zapisy liczb w systemie q (bez zer z przodu).'],
            constraints: ['1 ≤ t ≤ 1000', '2 ≤ p, q ≤ 16', 'Wartość liczby jest od 0 do 10¹⁸.'],
            examples: [{ input: '3\n10 2 13\n2 16 11111111\n16 10 FF' }],
            hint: R`int cyfra(char c) { if (c <= '9') return c - '0'; return c - 'A' + 10; }. long long wartosc(const string &s, int i, int p) { if (i == 0) return 0; return wartosc(s, i - 1, p) * p + cyfra(s[i - 1]); } — wywołanie wartosc(s, s.size(), p). Wypisywanie: string Z = "0123456789ABCDEF"; void wypisz(long long x, int q) { if (x < q) { cout << Z[x]; return; } wypisz(x / q, q); cout << Z[x % q]; }.`,
            tests: (r) => {
                const zap = () => { const v = r() < 0.05 ? 0n : losDlugi(r, 0n, B(E18)); const p = r.int(2, 16), q = r.int(2, 16); return [String(p), String(q), naSystem(v, p)]; };
                return [wierszeT([['10', '2', '13'], ['2', '16', '11111111'], ['16', '10', 'FF']]), wierszeT([['10', '16', E18], ['16', '2', naSystem(B(E18), 16)], ['7', '3', '0'], ['2', '2', '1'], ['15', '16', 'E'], ['3', '11', '2101']]), wierszeT(Array.from({ length: 1000 }, zap))];
            },
            check: (inp) => checkWiersze(inp, 1000, 3, (t) => { const p = Number(t[0]), q = Number(t[1]); if (!calk(p, 2, 16) || !calk(q, 2, 16)) return false; const Z = '0123456789ABCDEF'.slice(0, p); if (![...t[2]].every((c) => Z.includes(c)) || (t[2].length > 1 && t[2][0] === '0')) return false; return zSystemu(t[2], p) <= B(E18); }),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [p, q, s] = l.trim().split(/\s+/); return naSystem(zSystemu(s, Number(p)), Number(q)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string Z = "0123456789ABCDEF";
int cyfra(char c) {
    if (c <= '9') return c - '0';
    return c - 'A' + 10;
}
long long wartosc(const string &s, int i, int p) {
    if (i == 0) return 0;
    return wartosc(s, i - 1, p) * p + cyfra(s[i - 1]);
}
void wypisz(long long x, int q) {
    if (x < q) {
        cout << Z[x];
        return;
    }
    wypisz(x / q, q);
    cout << Z[x % q];
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int p, q;
        string s;
        cin >> p >> q >> s;
        wypisz(wartosc(s, s.size(), p), q);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-mnozenie-modulo', krok: 5, level: 'trudne',
            title: 'Mnożenie modulo bez przepełnienia',
            short: 'a · b mod m dla liczb do 10¹⁸ — sam iloczyn nie mieści się w long long. Pomysł z szybkiego potęgowania, tylko z dodawaniem: a · b = 2 · (a · (b / 2)) (+ a).',
            tags: ['szybkie mnożenie', 'modulo', 'przepełnienie long long'],
            statement: ['Dla każdej z t trójek a, b, m wypisz (a · b) mod m. Liczby sięgają 10¹⁸, więc iloczyn a · b może mieć nawet 37 cyfr — nie zmieści się w long long, który ma ich najwyżej 19.',
                'Napisz funkcję rekurencyjną long long razy(long long a, long long b, long long m) na wzór szybkiego potęgowania: razy(a, 0, m) = 0, a w pozostałych przypadkach policz x = razy(a, b / 2, m), podwój je modulo m i — jeśli b jest nieparzyste — dodaj jeszcze a (też modulo m). Zadbaj, żeby na początku a było mniejsze od m.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy trzy liczby całkowite a, b i m.'],
            output_format: ['t wierszy — wartości (a · b) mod m.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ a, b ≤ 10¹⁸', '1 ≤ m ≤ 10¹⁸'],
            examples: [{ input: '3\n3 4 5\n1000000000000000000 1000000000000000000 999999999999999999\n7 0 3', note: '10¹⁸ mod (10¹⁸ − 1) = 1, więc wynik to 1 · 1 = 1.' }],
            hint: R`long long razy(long long a, long long b, long long m) { if (b == 0) return 0; long long x = razy(a, b / 2, m); x = (x + x) % m; if (b % 2 == 1) x = (x + a) % m; return x; }, a w main wywołaj razy(a % m, b, m). Każda wartość jest mniejsza niż m ≤ 10¹⁸, więc x + x i x + a są mniejsze niż 2 · 10¹⁸ — bez przepełnienia.`,
            tests: (r) => {
                const tr = () => [String(losDlugi(r, 0n, B(E18))), String(losDlugi(r, 0n, B(E18))), String(r() < 0.5 ? B(E18) - B(r.int(0, 1000)) : losDlugi(r, 1n, B(E18)))];
                return [wierszeT([['3', '4', '5'], [E18, E18, '999999999999999999'], ['7', '0', '3']]), wierszeT([[E18, E18, E18], ['999999999999999999', '999999999999999999', E18], ['5', '5', '1'], ['0', E18, '7'], ['123456789123456789', '987654321987654321', '1000000007']]), wierszeT(Array.from({ length: 1000 }, tr))];
            },
            check: (inp) => checkWiersze(inp, 1000, 3, (t) => bigOk(t[0], '0', E18) && bigOk(t[1], '0', E18) && bigOk(t[2], '1', E18)),
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, b, m] = l.trim().split(/\s+/).map(B); return String(a * b % m); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long razy(long long a, long long b, long long m) {
    if (b == 0) return 0;
    long long x = razy(a, b / 2, m);
    x = (x + x) % m;
    if (b % 2 == 1) x = (x + a) % m;
    return x;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, m;
        cin >> a >> b >> m;
        cout << razy(a % m, b, m) << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 6 · drzewo wywołań i memoizacja
        {
            id: 'rk-tribonacci', krok: 6, level: 'latwe',
            title: 'Tribonacci',
            short: 'Każdy wyraz to suma trzech poprzednich. Trzy wywołania w jednej funkcji to lawina — zapamiętuj policzone wyniki w tablicy (memoizacja).',
            tags: ['trzy wywołania', 'memoizacja', 'long long'],
            statement: ['Ciąg Tribonacciego zaczyna się od T(0) = 0, T(1) = 0, T(2) = 1, a każdy następny wyraz to suma trzech poprzednich: T(n) = T(n − 1) + T(n − 2) + T(n − 3). Dla każdego z t zapytań wypisz T(n).',
                'Napisz funkcję rekurencyjną long long trib(int n) z zapamiętywaniem: zanim zaczniesz liczyć, sprawdź, czy wynik dla n jest już w tablicy, a po policzeniu — zapisz go tam. Bez pamięci liczenie T(70) zajęłoby lata.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba n.'],
            output_format: ['t wierszy — wartości T(n).'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 70'],
            examples: [{ input: '4\n0\n2\n5\n10', note: 'Początek ciągu: 0, 0, 1, 1, 2, 4, 7, 13, 24, 44, 81.' }],
            hint: R`long long memo[75]; bool jest[75]; long long trib(int n) { if (n <= 1) return 0; if (n == 2) return 1; if (jest[n]) return memo[n]; memo[n] = trib(n - 1) + trib(n - 2) + trib(n - 3); jest[n] = true; return memo[n]; }. Każde n liczy się tylko raz — kolejne zapytania o to samo n odpowiadają od razu.`,
            tests: (r) => [listaT(['0', '2', '5', '10']), listaT(['70', '69', '1', '3', '50']), listaT(Array.from({ length: 100 }, () => String(r.int(0, 70)))), listaT(Array.from({ length: 100 }, () => '70'))],
            check: (inp) => checkT(inp, 100, '0', '70'),
            solve: (inp) => { const T = [0n, 0n, 1n]; for (let i = 3; i <= 70; i++) T.push(T[i - 1] + T[i - 2] + T[i - 3]); return toks(inp).slice(1).map((x) => String(T[Number(x)])).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long memo[75];
bool jest[75];
long long trib(int n) {
    if (n <= 1) return 0;
    if (n == 2) return 1;
    if (jest[n]) return memo[n];
    memo[n] = trib(n - 1) + trib(n - 2) + trib(n - 3);
    jest[n] = true;
    return memo[n];
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << trib(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-kafelki', krok: 6, level: 'latwe',
            title: 'Kafelki w korytarzu',
            short: 'Korytarz 2 × n wykładasz kafelkami 1 × 2 (w obu kierunkach) i 2 × 2. Na ile sposobów? Spójrz na prawy koniec: f(n) = f(n − 1) + 2 · f(n − 2) — z pamięcią.',
            tags: ['liczenie sposobów', 'ostatni kafelek', 'memoizacja'],
            statement: ['Korytarz ma wymiary 2 × n. Masz kafelki 1 × 2 (można je kłaść poziomo albo pionowo) i kwadratowe kafelki 2 × 2. Na ile sposobów można wyłożyć cały korytarz — bez cięcia kafelków i bez dziur?',
                'Spójrz na prawy koniec korytarza. Albo stoi tam jeden pionowy kafelek 1 × 2 — zostaje korytarz 2 × (n − 1); albo dwa poziome kafelki jeden nad drugim, albo kwadrat 2 × 2 — w obu przypadkach zostaje 2 × (n − 2). Stąd f(n) = f(n − 1) + 2 · f(n − 2), przy czym f(0) = f(1) = 1. Napisz to rekurencyjnie z zapamiętywaniem wyników.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba n.'],
            output_format: ['t wierszy — liczby sposobów.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 60'],
            examples: [{ input: '3\n1\n2\n3', note: 'Dla n = 2: dwa pionowe, dwa poziome albo jeden kwadrat — 3 sposoby.' }],
            hint: R`long long memo[65]; long long f(int n) { if (n <= 1) return 1; if (memo[n] != 0) return memo[n]; return memo[n] = f(n - 1) + 2 * f(n - 2); }. Wynik nigdy nie jest zerem, więc 0 w tablicy może oznaczać „jeszcze nie policzone”. Bez pamięci f(60) wymagałoby ponad 10¹² wywołań.`,
            tests: (r) => [listaT(['1', '2', '3']), listaT(['0', '60', '59', '30', '4']), listaT(Array.from({ length: 100 }, () => String(r.int(0, 60))))],
            check: (inp) => checkT(inp, 100, '0', '60'),
            solve: (inp) => { const f = [1n, 1n]; for (let i = 2; i <= 60; i++) f.push(f[i - 1] + 2n * f[i - 2]); return toks(inp).slice(1).map((x) => String(f[Number(x)])).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long memo[65];
long long f(int n) {
    if (n <= 1) return 1;
    if (memo[n] != 0) return memo[n];
    memo[n] = f(n - 1) + 2 * f(n - 2);
    return memo[n];
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << f(n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-zepsute-stopnie', krok: 6, level: 'srednie',
            title: 'Zepsute stopnie',
            short: 'Wchodzisz po schodach o 1, 2 albo 3 stopnie naraz, ale na zepsutych stopniach nie wolno stanąć. Na ile sposobów dojdziesz na szczyt? Wynik modulo 10⁹ + 7.',
            tags: ['liczenie sposobów', 'memoizacja', 'modulo'],
            statement: ['Schody mają n stopni ponumerowanych od 1 (najniższy) do n (szczyt), a Bajtek stoi na ziemi (stopień 0). Jednym krokiem wchodzi o 1, 2 albo 3 stopnie. Niektóre stopnie są zepsute — nie wolno na nich stanąć (szczyt na pewno jest cały). Na ile sposobów Bajtek może wejść na szczyt? Wynik podaj modulo 1 000 000 007.',
                'Napisz funkcję rekurencyjną long long sposoby(int k) — liczbę sposobów dojścia ze stopnia k na szczyt: na szczycie to 1, za szczytem i na zepsutym stopniu — 0, a w pozostałych przypadkach suma wyników dla k + 1, k + 2 i k + 3. Wyniki zapamiętuj w tablicy.'],
            input_format: ['W pierwszym wierszu n i m — liczba stopni i liczba zepsutych stopni.', 'W drugim wierszu m różnych numerów zepsutych stopni (gdy m = 0, ten wiersz jest pusty).'],
            output_format: ['Jedna liczba — liczba sposobów modulo 1 000 000 007.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ m < n', 'Zepsute stopnie mają numery od 1 do n − 1.'],
            examples: [{ input: '4 0', note: 'Bez zepsutych stopni: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1 — 7 sposobów.' }, { input: '5 1\n2' }],
            hint: R`long long sposoby(int k) { if (k > n || zepsuty[k]) return 0; if (k == n) return 1; if (jest[k]) return memo[k]; memo[k] = (sposoby(k + 1) + sposoby(k + 2) + sposoby(k + 3)) % MOD; jest[k] = true; return memo[k]; }, a w main sposoby(0). Tablica zepsuty ma rozmiar n + 4, żeby k + 3 nie wyszło poza nią. Głębokość rekurencji to najwyżej n.`,
            tests: (r) => {
                const z = (n, m) => { const s = new Set(); while (s.size < m) s.add(r.int(1, n - 1)); return `${n} ${m}\n${[...s].join(' ')}`; };
                return ['4 0', '5 1\n2', '1 0', '10000 0', z(10000, 3000), z(10000, 100), '6 3\n1 2 3', z(50, 10), '3 2\n1 2'];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 10000) || !calk(m, 0, n - 1) || t.length !== m + 2) return 'dane'; const z = t.slice(2); return z.every((x) => calk(x, 1, n - 1)) && new Set(z).size === m ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const zep = new Set(t.slice(2)); const f = new Array(n + 4).fill(0); f[n] = 1; for (let k = n - 1; k >= 0; k--) f[k] = zep.has(k) ? 0 : (f[k + 1] + f[k + 2] + f[k + 3]) % MODN; return String(f[0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
int n;
bool zepsuty[10010], jest[10010];
long long memo[10010];
long long sposoby(int k) {
    if (k > n || zepsuty[k]) return 0;
    if (k == n) return 1;
    if (jest[k]) return memo[k];
    memo[k] = (sposoby(k + 1) + sposoby(k + 2) + sposoby(k + 3)) % MOD;
    jest[k] = true;
    return memo[k];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(zepsuty, 0, sizeof zepsuty);
    memset(jest, 0, sizeof jest);
    int m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        zepsuty[x] = true;
    }
    cout << sposoby(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-sciezki-krola', krok: 6, level: 'srednie',
            title: 'Król idzie do rogu',
            short: 'Król chodzi po planszy tylko w prawo, w dół albo na skos w prawo w dół i omija skały. Ile jest dróg z lewego górnego rogu do prawego dolnego? Pamięć w tablicy 2D.',
            tags: ['memoizacja 2D', 'plansza', 'modulo'],
            statement: ['Plansza ma n wierszy i m kolumn; pola ze skałami oznaczono #, wolne — kropką. Król stoi w lewym górnym rogu i chce dojść do prawego dolnego. W jednym ruchu idzie o jedno pole w prawo, w dół albo na skos w prawo w dół — nigdy na skałę. Ile jest różnych dróg? Wynik podaj modulo 1 000 000 007.',
                'Napisz funkcję rekurencyjną long long drogi(int r, int c) — liczbę dróg z pola (r, c) do celu: poza planszą i na skale to 0, w celu — 1, a w pozostałych przypadkach suma wyników dla trzech pól, na które można przejść. Wyniki zapamiętuj w tablicy 2D.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z n kolejnych wierszy m znaków: # albo kropka.'],
            output_format: ['Jedna liczba — liczba dróg modulo 1 000 000 007.'],
            constraints: ['1 ≤ n, m ≤ 100', 'Lewy górny i prawy dolny róg są wolne.'],
            examples: [{ input: '2 2\n..\n..', note: 'Prawo i dół, dół i prawo albo jeden skok na skos.' }, { input: '3 3\n...\n.#.\n...' }],
            hint: R`long long drogi(int r, int c) { if (r >= n || c >= m || g[r][c] == '#') return 0; if (r == n - 1 && c == m - 1) return 1; if (jest[r][c]) return memo[r][c]; memo[r][c] = (drogi(r, c + 1) + drogi(r + 1, c) + drogi(r + 1, c + 1)) % MOD; jest[r][c] = true; return memo[r][c]; }. Bez pamięci liczba wywołań rosłaby wykładniczo — z pamięcią każde pole liczy się raz.`,
            tests: (r) => {
                const pl = (n, m, p) => { const g = P.plansza(r, n, m, p).map((w) => w.split('')); g[0][0] = '.'; g[n - 1][m - 1] = '.'; return `${n} ${m}\n${g.map((w) => w.join('')).join('\n')}`; };
                return ['2 2\n..\n..', '3 3\n...\n.#.\n...', '1 1\n.', pl(100, 100, 0), pl(100, 100, 0.2), pl(60, 100, 0.35), pl(1, 100, 0), '2 2\n.#\n#.', pl(37, 11, 0.1)];
            },
            check: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); return calk(n, 1, 100) && calk(m, 1, 100) && L.length === n + 1 && L.slice(1).every((w) => w.length === m && /^[.#]+$/.test(w)) && L[1][0] === '.' && L[n][m - 1] === '.' ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); const g = L.slice(1); const f = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0)); for (let a = n - 1; a >= 0; a--) for (let b = m - 1; b >= 0; b--) { if (g[a][b] === '#') continue; f[a][b] = a === n - 1 && b === m - 1 ? 1 : (f[a][b + 1] + f[a + 1][b] + f[a + 1][b + 1]) % MODN; } return String(f[0][0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
int n, m;
string g[105];
long long memo[105][105];
bool jest[105][105];
long long drogi(int r, int c) {
    if (r >= n || c >= m || g[r][c] == '#') return 0;
    if (r == n - 1 && c == m - 1) return 1;
    if (jest[r][c]) return memo[r][c];
    memo[r][c] = (drogi(r, c + 1) + drogi(r + 1, c) + drogi(r + 1, c + 1)) % MOD;
    jest[r][c] = true;
    return memo[r][c];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(jest, 0, sizeof jest);
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> g[i];
    cout << drogi(0, 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-kamienie', krok: 6, level: 'srednie',
            title: 'Gra w kamienie',
            short: 'Gracze na zmianę zabierają ze stosu tyle kamieni, ile pozwalają dozwolone ruchy. Kto nie może ruszyć — przegrywa. Pozycja jest wygrywająca, jeśli jakiś ruch prowadzi do przegranej przeciwnika.',
            tags: ['funkcja bool', 'gra dwóch graczy', 'memoizacja'],
            statement: ['Ala i Bartek grają w kamienie. Na stole leży n kamieni, a gracze ruszają się na zmianę (zaczyna Ala). W jednym ruchu zabiera się ze stosu dokładnie r kamieni, gdzie r to jedna z k dozwolonych liczb. Kto nie może wykonać żadnego ruchu, przegrywa. Oboje grają najlepiej, jak się da.',
                'Dla każdego z q zapytań (różne n, ruchy te same) wypisz, kto wygra. Napisz funkcję rekurencyjną bool wygrywa(int n) — czy gracz, który ma ruch przy n kamieniach, wygra. Wygrywa, jeśli istnieje dozwolony ruch r ≤ n, po którym przeciwnik przegrywa, czyli !wygrywa(n − r). Wyniki zapamiętuj.'],
            input_format: ['W pierwszym wierszu k, w drugim — k różnych dozwolonych ruchów.', 'W trzecim wierszu q, w czwartym — q liczb n.'],
            output_format: ['q wierszy: Ala albo Bartek — kto wygra przy n kamieniach.'],
            constraints: ['1 ≤ k ≤ 5', '1 ≤ każdy ruch ≤ 20', '1 ≤ q ≤ 1000', '0 ≤ n ≤ 10 000'],
            examples: [{ input: '3\n1 3 4\n4\n1 2 7 10', note: 'Przy 2 kamieniach Ala musi wziąć 1, a wtedy Bartek bierze ostatni. Przy 0 kamieniach przegrywa ten, kto ma ruch.' }],
            hint: R`int stan[10005]; // 0 — nie wiem, 1 — wygrywa, 2 — przegrywa. bool wygrywa(int n) { if (stan[n] != 0) return stan[n] == 1; bool w = false; for (int i = 0; i < k; i++) if (ruch[i] <= n && !wygrywa(n - ruch[i])) w = true; stan[n] = w ? 1 : 2; return w; }. Przy n = 0 nie ma ruchu, więc pętla nic nie znajdzie i wynik to przegrana.`,
            tests: (r) => {
                const z = (ruchy, q) => `${ruchy.length}\n${ruchy.join(' ')}\n${q.length}\n${q.join(' ')}`;
                const ruchy = () => { const s = new Set(); const k = r.int(1, 5); while (s.size < k) s.add(r.int(1, 20)); return [...s]; };
                return [z([1, 3, 4], [1, 2, 7, 10]), z([2], [0, 1, 2, 3, 10000]), z(ruchy(), r.arr(1000, 0, 10000)), z(ruchy(), r.arr(1000, 0, 100)), z([5, 7, 11, 13, 20], r.arr(1000, 0, 10000)), z([1], [0, 1, 9999, 10000])];
            },
            check: (inp) => { const t = nums(inp); const k = t[0]; const q = t[k + 1]; if (!calk(k, 1, 5) || !calk(q, 1, 1000) || t.length !== k + q + 2) return 'dane'; const mv = t.slice(1, k + 1); return mv.every((x) => calk(x, 1, 20)) && new Set(mv).size === k && t.slice(k + 2).every((x) => calk(x, 0, 10000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[0]; const mv = t.slice(1, k + 1); const qs = t.slice(k + 2); const W = new Array(10001).fill(false); for (let n = 0; n <= 10000; n++) W[n] = mv.some((x) => x <= n && !W[n - x]); return qs.map((n) => (W[n] ? 'Ala' : 'Bartek')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int k, ruch[5];
int stan[10005];
bool wygrywa(int n) {
    if (stan[n] != 0) return stan[n] == 1;
    bool w = false;
    for (int i = 0; i < k; i++)
        if (ruch[i] <= n && !wygrywa(n - ruch[i])) w = true;
    stan[n] = w ? 1 : 2;
    return w;
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(stan, 0, sizeof stan);
    cin >> k;
    for (int i = 0; i < k; i++) cin >> ruch[i];
    int q;
    cin >> q;
    while (q--) {
        int n;
        cin >> n;
        if (wygrywa(n)) cout << "Ala\n";
        else cout << "Bartek\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-szyfr-liczbowy', krok: 6, level: 'srednie',
            title: 'Szyfr z liczb',
            short: 'Litery zamieniono na liczby A = 1, …, Z = 26 i skasowano odstępy. Na ile sposobów da się odczytać ciąg cyfr? Wynik dla końcówki od pozycji i — z pamięcią, modulo 10⁹ + 7.',
            tags: ['liczenie sposobów na napisie', 'memoizacja', 'modulo'],
            statement: ['Bajtek zaszyfrował wiadomość, zamieniając każdą literę na jej numer w alfabecie (A = 1, B = 2, …, Z = 26) i sklejając liczby bez odstępów. Na przykład 1121 można odczytać jako AABA (1 1 2 1), KBA (11 2 1), ALA (1 12 1), AAU (1 1 21) albo KU (11 21) — razem 5 sposobów. Na ile sposobów można odczytać podany ciąg cyfr? Wynik podaj modulo 1 000 000 007.',
                'Napisz funkcję rekurencyjną long long sposoby(int i) — liczbę sposobów odczytania końcówki napisu od pozycji i. Gdy i dojdzie do końca napisu, jest jeden sposób. Cyfra 0 nie jest literą — może wystąpić tylko jako druga cyfra liczby 10 albo 20. Wyniki zapamiętuj.'],
            input_format: ['W jedynym wierszu ciąg cyfr.'],
            output_format: ['Jedna liczba — liczba sposobów odczytania modulo 1 000 000 007 (może być 0).'],
            constraints: ['1 ≤ długość ciągu ≤ 10 000'],
            examples: [{ input: '1121' }, { input: '230', note: 'Zero nie może stać samo, a 30 to nie litera — ciągu nie da się odczytać.' }],
            hint: R`long long sposoby(int i) { if (i == n) return 1; if (s[i] == '0') return 0; if (jest[i]) return memo[i]; long long w = sposoby(i + 1); if (i + 1 < n && (s[i] == '1' || (s[i] == '2' && s[i + 1] <= '6'))) w += sposoby(i + 2); memo[i] = w % MOD; jest[i] = true; return memo[i]; }. Pierwsza cyfra końcówki to albo jedna litera, albo — razem z następną — litera o numerze od 10 do 26.`,
            tests: (r) => {
                const dobry = (n) => { let s = ''; while (s.length < n) { const x = r() < 0.15 ? r.pick(['10', '20']) : r.pick(['1', '2', '1', '2', '3', '6', '9', '26', '11', '21']); s += x; } return s.slice(0, n).replace(/0+$/, '').replace(/^0/, '1') || '1'; };
                return ['1121', '230', '10', '0', '1', '2626', '1111111111', dobry(10000), dobry(10000).replace(/.$/, '7'), '1'.repeat(10000), `${'12'.repeat(2000)}30${'1'.repeat(100)}`, dobry(37)];
            },
            check: (inp) => (/^\d{1,10000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const s = inp.trim(); const n = s.length; const f = new Array(n + 2).fill(0); f[n] = 1; for (let i = n - 1; i >= 0; i--) { if (s[i] === '0') { f[i] = 0; continue; } let w = f[i + 1]; if (i + 1 < n && (s[i] === '1' || (s[i] === '2' && s[i + 1] <= '6'))) w += f[i + 2]; f[i] = w % MODN; } return String(f[0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
string s;
int n;
long long memo[10005];
bool jest[10005];
long long sposoby(int i) {
    if (i == n) return 1;
    if (s[i] == '0') return 0;
    if (jest[i]) return memo[i];
    long long w = sposoby(i + 1);
    if (i + 1 < n && (s[i] == '1' || (s[i] == '2' && s[i + 1] <= '6'))) w += sposoby(i + 2);
    memo[i] = w % MOD;
    jest[i] = true;
    return memo[i];
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(jest, 0, sizeof jest);
    cin >> s;
    n = s.size();
    cout << sposoby(0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-grupy-uczniow', krok: 6, level: 'srednie',
            title: 'Podział na grupy',
            short: 'Na ile sposobów podzielić n uczniów na k niepustych grup? Ostatni uczeń albo jest sam, albo dołącza do jednej z k grup: S(n, k) = S(n − 1, k − 1) + k · S(n − 1, k).',
            tags: ['dwa parametry', 'memoizacja 2D', 'myślenie o ostatnim elemencie'],
            statement: ['Nauczycielka dzieli n uczniów na k grup projektowych. Każda grupa musi mieć co najmniej jednego ucznia, a grupy nie mają nazw — liczy się tylko, kto jest z kim. Na ile sposobów może to zrobić? Na przykład 3 uczniów (A, B, C) na 2 grupy: {A, B} i {C}, {A, C} i {B}, {B, C} i {A} — 3 sposoby.',
                'Pomyśl o ostatnim uczniu. Albo jest sam w swojej grupie — wtedy pozostałych n − 1 uczniów dzielimy na k − 1 grup; albo dołącza do jednej z k grup ułożonych z pozostałych — wtedy n − 1 uczniów dzielimy na k grup i mamy k możliwości dołączenia. Napisz funkcję rekurencyjną long long grupy(int n, int k) z zapamiętywaniem. Przypadki brzegowe: grupy(0, 0) = 1, a grupy(n, 0) i grupy(0, k) dla dodatnich n i k to 0.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby n i k.'],
            output_format: ['t wierszy — liczby sposobów.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ k ≤ n ≤ 25'],
            examples: [{ input: '3\n3 2\n4 2\n5 3' }],
            hint: R`long long memo[26][26]; bool jest[26][26]; long long grupy(int n, int k) { if (n == 0 && k == 0) return 1; if (n == 0 || k == 0) return 0; if (jest[n][k]) return memo[n][k]; memo[n][k] = grupy(n - 1, k - 1) + k * grupy(n - 1, k); jest[n][k] = true; return memo[n][k]; }. Dla n = 25 wyniki sięgają 10¹⁸ — long long jest konieczny.`,
            tests: (r) => {
                const q = () => { const n = r.int(1, 25); return [String(n), String(r.int(1, n))]; };
                return [wierszeT([['3', '2'], ['4', '2'], ['5', '3']]), wierszeT([['25', '10'], ['25', '1'], ['25', '25'], ['1', '1'], ['24', '9'], ['20', '8']]), wierszeT(Array.from({ length: 100 }, q))];
            },
            check: (inp) => checkWiersze(inp, 100, 2, (t) => { const n = Number(t[0]), k = Number(t[1]); return calk(n, 1, 25) && calk(k, 1, n); }),
            solve: (inp) => { const S = Array.from({ length: 26 }, () => new Array(26).fill(0n)); S[0][0] = 1n; for (let n = 1; n <= 25; n++) for (let k = 1; k <= n; k++) S[n][k] = S[n - 1][k - 1] + B(k) * S[n - 1][k]; return linie(inp).slice(1).map((l) => { const [n, k] = l.trim().split(/\s+/).map(Number); return String(S[n][k]); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long memo[26][26];
bool jest[26][26];
long long grupy(int n, int k) {
    if (n == 0 && k == 0) return 1;
    if (n == 0 || k == 0) return 0;
    if (jest[n][k]) return memo[n][k];
    memo[n][k] = grupy(n - 1, k - 1) + k * grupy(n - 1, k);
    jest[n][k] = true;
    return memo[n][k];
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n, k;
        cin >> n >> k;
        cout << grupy(n, k) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-nawiasowania', krok: 6, level: 'trudne',
            title: 'Na ile sposobów wstawić nawiasy?',
            short: 'Iloczyn n + 1 czynników można obliczyć w różnej kolejności. Ostatnie mnożenie dzieli czynniki na lewą i prawą część — sumujesz iloczyny możliwości obu stron. Pętla w rekurencji i pamięć.',
            tags: ['pętla w rekurencji', 'memoizacja', 'liczby Catalana'],
            statement: ['Iloczyn czterech czynników a · b · c · d można obliczyć na 5 sposobów, zależnie od nawiasów: ((ab)c)d, (a(bc))d, (ab)(cd), a((bc)d) i a(b(cd)). Na ile sposobów można wstawić nawiasy w iloczynie n + 1 czynników, czyli z n mnożeniami?',
                'Spójrz na mnożenie wykonywane jako ostatnie. Dzieli ono pozostałe n − 1 mnożeń na i mnożeń po lewej stronie i n − 1 − i po prawej, gdzie i = 0, 1, …, n − 1. Liczba sposobów dla n to suma iloczynów sposoby(i) · sposoby(n − 1 − i), a sposoby(0) = 1 (jeden czynnik nie potrzebuje nawiasów). Napisz to rekurencyjnie z zapamiętywaniem.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba n.'],
            output_format: ['t wierszy — liczby sposobów.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 35'],
            examples: [{ input: '3\n3\n1\n0' }],
            hint: R`long long memo[40]; long long sposoby(int n) { if (n == 0) return 1; if (memo[n] != 0) return memo[n]; long long w = 0; for (int i = 0; i < n; i++) w += sposoby(i) * sposoby(n - 1 - i); return memo[n] = w; }. To liczby Catalana — wychodzą w wielu zadaniach (poprawne nawiasowania, drzewa, podziały wielokąta). Dla n = 35 wynik ma 19 cyfr i ledwo mieści się w long long.`,
            tests: (r) => [listaT(['3', '1', '0']), listaT(['35', '34', '2', '10', '20']), listaT(Array.from({ length: 100 }, () => String(r.int(0, 35))))],
            check: (inp) => checkT(inp, 100, '0', '35'),
            solve: (inp) => { const C = [1n]; for (let n = 1; n <= 35; n++) { let s = 0n; for (let i = 0; i < n; i++) s += C[i] * C[n - 1 - i]; C.push(s); } return toks(inp).slice(1).map((x) => String(C[Number(x)])).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long memo[40];
long long sposoby(int n) {
    if (n == 0) return 1;
    if (memo[n] != 0) return memo[n];
    long long w = 0;
    for (int i = 0; i < n; i++) w += sposoby(i) * sposoby(n - 1 - i);
    memo[n] = w;
    return w;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << sposoby(n) << "\n";
    }
    return 0;
}`,
        },
    ];
};
