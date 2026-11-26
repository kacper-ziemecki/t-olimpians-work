// Bitset — ćwiczenia w trakcie lekcji, części 7–8: sumy podzbiorów przez przesunięcie (S |= S << x, ile sum, podział na pół,
// najbliżej celu, kostki, ważenie na dwóch szalkach z przesunięciem o T, niezbędne monety) oraz bitset jako przyspieszacz
// (tablice bitsetów: wspólni znajomi, trójkąty, osiągalność, prostokąty w kratce, _Find_next, ankiety, zbiory rozłączne, dwa kroki).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./bitset-pomoc');
    const { calk, rozne, los01, sumy, losGraf, losGrafGrupy, grafTxt, macierz } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const lista = (a) => `${a.length}\n${a.join(' ')}`;
    const listaW = (a) => `${a.length}${a.length ? ' ' + a.join(' ') : ''}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const suma = (a) => a.reduce((s, x) => s + x, 0);
    // Sprawdza graf: n m, potem m różnych krawędzi bez pętli (dla nieskierowanego bez par a–b i b–a).
    const dobryGraf = (t, nMax, mMax, skierowany = false) => {
        const [n, m] = t;
        if (!calk(n, 2, nMax) || !calk(m, 1, mMax) || t.length < 2 + 2 * m) return false;
        const s = new Set();
        for (let i = 0; i < m; i++) {
            let a = t[2 + 2 * i], b = t[3 + 2 * i];
            if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return false;
            if (!skierowany && a > b) [a, b] = [b, a];
            const k = a * (n + 1) + b;
            if (s.has(k)) return false;
            s.add(k);
        }
        return true;
    };

    return [
        // ================================================================ KROK 7 · sumy podzbiorów
        {
            id: 'bs-wszystkie-sumy', krok: 7, level: 'latwe',
            title: 'Wszystkie sumy',
            short: 'Zbiór sum zaczyna się od samego zera. Każda nowa liczba x dokłada wszystkie stare sumy powiększone o x: S |= S << x.',
            tags: ['S[0] = 1', 'S |= S << x', 'wypisz zapalone bity'],
            statement: ['Masz n liczb. Wybierasz dowolną część z nich — każdą liczbę najwyżej raz, możesz też nie wybrać żadnej — i dodajesz. Wypisz rosnąco wszystkie sumy, które da się w ten sposób otrzymać (także 0).',
                'Trzymaj zbiór możliwych sum w bitsecie S: na początku S[0] = 1, bo pusty wybór daje 0. Gdy dochodzi liczba x, każdą starą sumę można powiększyć o x albo zostawić — czyli S |= S << x;.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: wszystkie możliwe sumy rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 10', '1 ≤ każda liczba ≤ 100'],
            examples: [{ input: '3\n3 5 4', note: 'Na początku {0}. Po trójce: {0, 3}. Po piątce: {0, 3, 5, 8}. Po czwórce dochodzą 4, 7, 9 i 12: razem 0, 3, 4, 5, 7, 8, 9, 12.' },
                { input: '2\n2 2', note: 'Dwie dwójki dają sumy 0, 2 i 4 — suma 2 powstaje na dwa sposoby, ale wypisujemy ją raz.' }],
            hint: R`bitset<1001> S; S[0] = 1; i dla każdej liczby x: S |= S << x;. Na końcu for (int s = 0; s <= 1000; s++) if (S[s]) cout << s << " ";.`,
            tests: (r) => [lista([3, 5, 4]), lista([2, 2]), lista([100]), lista(new Array(10).fill(100)), lista(r.arr(10, 1, 100)), lista([1, 2, 4, 8, 16, 32, 64, 128 - 28, 1, 1]), lista(r.arr(10, 50, 100)), lista(r.arr(4, 1, 10))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 100)) ? null : 'dane'; },
            solve: (inp) => { const d = sumy(nums(inp).slice(1), 1000); const w = []; for (let s = 0; s <= 1000; s++) if (d[s]) w.push(s); return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<1001> S;
    S[0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        S |= S << x;
    }
    for (int s = 0; s <= 1000; s++) {
        if (S[s]) cout << s << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-czy-zaplace', krok: 7, level: 'latwe',
            title: 'Czy zapłacę bez reszty?',
            short: 'Policz raz zbiór wszystkich kwot, które da się ułożyć z monet w portfelu — a potem każde pytanie to jeden odczyt bitu S[k].',
            tags: ['zbiór sum raz', 'S[k]', 'bitset<100001>'],
            statement: ['W portfelu jest n monet o podanych nominałach (każdą monetę można wydać najwyżej raz). Odpowiedz na q pytań: czy da się zapłacić dokładnie k złotych, bez reszty?',
                'Kwota 0 jest zawsze możliwa — po prostu nic nie dajesz. Najpierw zbuduj zbiór wszystkich możliwych kwot (S |= S << x dla każdej monety), a potem dla każdego pytania sprawdź bit S[k].'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n nominałów.', 'W trzecim wierszu q kwot k.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każdy nominał ≤ 1000', '1 ≤ q ≤ 5000', '0 ≤ k ≤ 100 000'],
            examples: [{ input: '3 4\n2 5 9\n7 1 16 0', note: '7 = 2 + 5, a 16 = 2 + 5 + 9. Złotówki nie da się zapłacić. Zero — zawsze.' }],
            hint: R`bitset<100001> S; S[0] = 1; dla każdej monety S |= S << x;. Potem dla każdego k: cout << (S[k] ? "TAK" : "NIE") << "\n";.`,
            tests: (r) => {
                const gen = (n, lo, hi, q, kmax) => `${n} ${q}\n${r.arr(n, lo, hi).join(' ')}\n${r.arr(q, 0, kmax).join(' ')}`;
                return ['3 4\n2 5 9\n7 1 16 0', '1 3\n1000 \n1000 999 0'.replace(' \n', '\n'), gen(100, 1, 1000, 5000, 100000), gen(100, 900, 1000, 5000, 100000), gen(10, 1, 100, 5000, 1000), gen(30, 100, 1000, 5000, 20000), `5 6\n2 4 6 8 10\n1 3 30 31 0 100000`];
            },
            check: (inp) => { const l = L(inp); const [n, q] = l[0].split(' ').map(Number); const a = (l[1] || '').split(' ').map(Number), k = (l[2] || '').split(' ').map(Number); return l.length === 3 && calk(n, 1, 100) && calk(q, 1, 5000) && a.length === n && k.length === q && a.every((x) => calk(x, 1, 1000)) && k.every((x) => calk(x, 0, 100000)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const d = sumy(l[1].split(' ').map(Number), 100000); return l[2].split(' ').map(Number).map((k) => (d[k] ? 'TAK' : 'NIE')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100001> S;
int main() {
    int n, q;
    cin >> n >> q;
    S.reset();
    S[0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        S |= S << x;
    }
    for (int i = 0; i < q; i++) {
        int k;
        cin >> k;
        if (S[k]) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-ile-sum', krok: 7, level: 'latwe',
            title: 'Ile różnych sum',
            short: 'Po wszystkich przesunięciach S.count() to liczba możliwych sum razem z zerem. Odejmij jedną, a dostaniesz liczbę sum dodatnich.',
            tags: ['S.count() - 1', 'suma do 10⁶', 'bitset przed main'],
            statement: ['Ile różnych dodatnich sum da się otrzymać, wybierając niepustą część z n liczb (każdą liczbę najwyżej raz)?',
                'Wszystkie liczby razem dają najwyżej 100 · 10 000 = 1 000 000, więc bitset musi mieć 1 000 001 bitów i stać przed main. Po zbudowaniu zbioru sum S.count() liczy też sumę 0 — odejmij ją.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba — liczba różnych dodatnich sum.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każda liczba ≤ 10 000'],
            examples: [{ input: '3\n1 2 3', note: 'Da się otrzymać każdą sumę od 1 do 6 — sześć różnych (3 = 3 albo 1 + 2, ale to jedna suma).' },
                { input: '2\n5 5', note: 'Sumy 5 i 10 — dwie.' }],
            hint: R`bitset<1000001> S; przed main, w main: S[0] = 1; S |= S << x; dla każdej liczby, a na końcu cout << S.count() - 1;.`,
            tests: (r) => [lista([1, 2, 3]), lista([5, 5]), lista([10000]), lista(r.arr(100, 1, 10000)), lista(r.arr(100, 9990, 10000)), lista(r.arr(20, 1, 10000)), lista(new Array(100).fill(7)), lista(Array.from({ length: 14 }, (_, i) => 2 ** i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 100) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 10000)) ? null : 'dane'; },
            solve: (inp) => { const d = sumy(nums(inp).slice(1), 1000000); return String(P.ileJedynek(d) - 1); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> S;
int main() {
    S.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    S[0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        S |= S << x;
    }
    cout << S.count() - 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-podzial-na-pol', krok: 7, level: 'srednie',
            title: 'Podział na pół',
            short: 'Jedna grupa ma sumę s, druga — razem − s. Różnica jest najmniejsza dla największej możliwej sumy s nie większej od połowy.',
            tags: ['razem − 2s', 's ≤ razem / 2', 'szukanie od połowy w dół'],
            statement: ['Rodzeństwo dzieli n prezentów o podanych wartościach — każdy prezent dostaje dokładnie jedna osoba. Jak podzielić prezenty, żeby różnica wartości obu części była jak najmniejsza? Wypisz tę najmniejszą różnicę.',
                'Jeśli jedna osoba dostanie prezenty o sumie s, druga dostanie razem − s, a różnica wyniesie razem − 2s. Zbuduj zbiór możliwych sum i znajdź największe s ≤ razem / 2, które da się ułożyć.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wartości.'],
            output_format: ['Jedna liczba — najmniejsza możliwa różnica.'],
            constraints: ['1 ≤ n ≤ 200', '1 ≤ każda wartość ≤ 5000'],
            examples: [{ input: '5\n3 1 4 2 2', note: 'Razem 12. Sumę 6 da się ułożyć (4 + 2 albo 3 + 1 + 2), więc różnica 0.' },
                { input: '3\n1 2 7', note: 'Razem 10, połowa to 5. Największa suma nie większa od 5 to 3 (1 + 2), więc różnica 10 − 6 = 4: siódemka zawsze przeważa.' }],
            hint: R`Po zbudowaniu S: for (int s = razem / 2; s >= 0; s--) if (S[s]) { cout << razem - 2 * s; break; }. Pamiętaj o S[0] = 1 — gdy jest jeden prezent, odpowiedzią jest jego wartość.`,
            tests: (r) => [lista([3, 1, 4, 2, 2]), lista([1, 2, 7]), lista([5000]), lista(r.arr(200, 1, 5000)), lista(r.arr(200, 4000, 5000)), lista([...new Array(199).fill(2), 1]), lista(r.arr(15, 1, 5000)), lista(r.arr(200, 1, 5000).map((x) => 2 * Math.ceil(x / 2))), lista([4999, 5000, 1, 2, 3])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 200) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 5000)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const raz = suma(a); const d = sumy(a, raz); for (let s = Math.floor(raz / 2); s >= 0; s--) if (d[s]) return String(raz - 2 * s); return ''; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> S;
int main() {
    S.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    int razem = 0;
    S[0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        razem += x;
        S |= S << x;
    }
    for (int s = razem / 2; s >= 0; s--) {
        if (S[s]) {
            cout << razem - 2 * s << "\n";
            break;
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-najblizej-celu', krok: 7, level: 'srednie',
            title: 'Najbliżej celu',
            short: 'Która możliwa suma leży najbliżej liczby T? Sprawdzaj odległości d = 0, 1, 2…: najpierw T − d, potem T + d — pierwszy zapalony bit to odpowiedź.',
            tags: ['T − d i T + d', 'remis: mniejsza', 'granice bitsetu'],
            statement: ['Masz n odważników. Chcesz ułożyć z nich (każdy najwyżej raz) ciężar jak najbliższy T. Wypisz ciężar, który da się ułożyć i który jest najbliżej T. Jeśli dwa ciężary są tak samo blisko, wypisz mniejszy.',
                'Po zbudowaniu zbioru sum sprawdzaj kolejno odległości d = 0, 1, 2, …: najpierw T − d (o ile nie jest ujemne), potem T + d (o ile mieści się w bitsecie). Ciężar 0 — gdy nie bierzesz niczego — też się liczy.'],
            input_format: ['W pierwszym wierszu liczby n i T.', 'W drugim wierszu n ciężarów odważników.'],
            output_format: ['Jedna liczba — możliwy ciężar najbliższy T.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każdy ciężar ≤ 10 000', '0 ≤ T ≤ 1 000 000'],
            examples: [{ input: '3 10\n4 7 9', note: 'Możliwe ciężary: 0, 4, 7, 9, 11, 13, 16, 20. Do 10 najbliżej są 9 i 11 — wybieramy mniejszy.' },
                { input: '2 1000000\n3 5', note: 'Największy możliwy ciężar to 8.' }],
            hint: R`for (int d = 0; ; d++) { if (T - d >= 0 && S[T - d]) { cout << T - d; break; } if (T + d <= 1000000 && S[T + d]) { cout << T + d; break; } }.`,
            tests: (r) => {
                const gen = (n, lo, hi, T) => `${n} ${T}\n${r.arr(n, lo, hi).join(' ')}`;
                return ['3 10\n4 7 9', '2 1000000\n3 5', '1 0\n5', '1 3\n5', gen(100, 1, 10000, r.int(0, 1000000)), gen(100, 1000, 10000, 123457), gen(10, 1, 10000, 25000), gen(50, 9000, 10000, 1000000), gen(100, 5000, 10000, 4999), gen(20, 1, 100, 1000)];
            },
            check: (inp) => { const t = nums(inp); const [n, T] = t; return calk(n, 1, 100) && calk(T, 0, 1000000) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 10000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const T = t[1]; const d = sumy(t.slice(2), 1000000); for (let k = 0; ; k++) { if (T - k >= 0 && d[T - k]) return String(T - k); if (T + k <= 1000000 && d[T + k]) return String(T + k); } },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> S;
int main() {
    S.reset(); // zerowanie przed testem
    int n, T;
    cin >> n >> T;
    S[0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        S |= S << x;
    }
    for (int d = 0; ; d++) {
        if (T - d >= 0 && S[T - d]) {
            cout << T - d << "\n";
            break;
        }
        if (T + d <= 1000000 && S[T + d]) {
            cout << T + d << "\n";
            break;
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-kostki', krok: 7, level: 'srednie',
            title: 'Dziwne kostki',
            short: 'Tu każdą kostkę trzeba rzucić — wybierasz dokładnie jedną ściankę. Nowy zbiór sum to OR przesunięć starego o każdą ściankę: N |= S << v.',
            tags: ['dokładnie jeden z grupy', 'N |= S << v', 'S = N'],
            statement: ['Masz d nietypowych kostek: każda ma swoją liczbę ścianek z własnymi liczbami oczek. Rzucasz wszystkimi kostkami naraz i dodajesz wyniki. Ile różnych sum może wypaść?',
                'Inaczej niż przy monetach, tu każdą kostkę trzeba „użyć” — z każdej bierzemy dokładnie jedną ściankę. Dla nowej kostki zbuduj nowy zbiór N: dla każdej ścianki v zrób N |= S << v, a potem S = N. Stary zbiór (bez tej kostki) nie przechodzi dalej.'],
            input_format: ['W pierwszym wierszu liczba d.', 'W każdym z kolejnych d wierszy liczba ścianek f, a po niej f liczb oczek.'],
            output_format: ['Jedna liczba — liczba różnych sum.'],
            constraints: ['1 ≤ d ≤ 50', '1 ≤ f ≤ 20', '1 ≤ liczba oczek ≤ 100'],
            examples: [{ input: '2\n6 1 2 3 4 5 6\n6 1 2 3 4 5 6', note: 'Dwie zwykłe kostki dają sumy od 2 do 12 — jedenaście różnych.' },
                { input: '2\n2 1 10\n2 1 100', note: 'Sumy: 1 + 1 = 2, 1 + 100 = 101, 10 + 1 = 11, 10 + 100 = 110 — cztery.' }],
            hint: R`bitset<5001> S; S[0] = 1; dla każdej kostki: bitset<5001> N; for (każda ścianka v) N |= S << v; S = N;. Na końcu S.count() — zera już tam nie ma.`,
            tests: (r) => {
                const gen = (d, fmax, lo, hi) => `${d}\n${Array.from({ length: d }, () => listaW(r.arr(r.int(1, fmax), lo, hi))).join('\n')}`;
                return ['2\n6 1 2 3 4 5 6\n6 1 2 3 4 5 6', '2\n2 1 10\n2 1 100', '1\n1 100', '1\n3 5 5 5', gen(50, 20, 1, 100), gen(50, 2, 1, 100), gen(50, 3, 10, 13), gen(10, 4, 1, 100), `50\n${Array.from({ length: 50 }, () => '2 1 100').join('\n')}`, gen(25, 20, 90, 100)];
            },
            check: (inp) => { const t = nums(inp); const d = t[0]; if (!calk(d, 1, 50)) return 'dane'; let i = 1; for (let k = 0; k < d; k++) { const f = t[i++]; if (!calk(f, 1, 20)) return 'dane'; for (let j = 0; j < f; j++) if (!calk(t[i++], 1, 100)) return 'dane'; } return i === t.length ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const d = t[0]; let S = new Uint8Array(5001); S[0] = 1; let i = 1; for (let k = 0; k < d; k++) { const f = t[i++]; const sc = [...new Set(t.slice(i, i + f))]; i += f; const N = new Uint8Array(5001); for (let s = 0; s <= 5000; s++) if (S[s]) for (const v of sc) if (s + v <= 5000) N[s + v] = 1; S = N; } return String(P.ileJedynek(S)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int d;
    cin >> d;
    bitset<5001> S;
    S[0] = 1;
    for (int k = 0; k < d; k++) {
        int f;
        cin >> f;
        bitset<5001> N;
        for (int j = 0; j < f; j++) {
            int v;
            cin >> v;
            N |= S << v;
        }
        S = N;
    }
    cout << S.count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-waga-szalkowa', krok: 7, level: 'srednie',
            title: 'Waga szalkowa',
            short: 'Odważnik może stanąć na szalce z przedmiotem, na drugiej szalce albo zostać w pudełku. Różnice mogą być ujemne, więc przesuń zero na środek bitsetu: bit T + d.',
            tags: ['S | (S << w) | (S >> w)', 'przesunięcie o T', 'liczby ujemne w bitsecie'],
            statement: ['Na lewą szalkę wagi kładziesz przedmiot. Masz n odważników — każdy możesz położyć na prawej szalce, na lewej (obok przedmiotu) albo nie używać go wcale. Przedmiot o masie m da się zważyć, jeśli da się tak ułożyć odważniki, żeby waga była w równowadze, czyli m = (suma na prawej) − (suma odważników na lewej).',
                'Policz, ile mas od 1 do razem (suma wszystkich odważników) da się zważyć, i wypisz najmniejszą masę od 1 w górę, której zważyć się nie da. Różnica „prawa − lewa” może być ujemna, a bity mają tylko numery od 0 — dlatego przesuń wszystko o razem: różnicę d trzymaj w bicie razem + d. Na początku zapal bit razem (różnica 0), a każdy odważnik w daje S | (S << w) | (S >> w).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n mas odważników.'],
            output_format: ['Jeden wiersz: liczba mas od 1 do razem, które da się zważyć, i najmniejsza masa, której zważyć się nie da.'],
            constraints: ['1 ≤ n ≤ 50', '1 ≤ każda masa ≤ 1000'],
            examples: [{ input: '2\n1 3', note: 'Razem 4. Masa 1: odważnik 1 na prawej. 2: trójka na prawej, jedynka na lewej. 3 i 4: trójka (i jedynka) na prawej. Wszystkie cztery się da, a 5 już nie.' },
                { input: '2\n2 5', note: 'Da się zważyć 2, 3 (5 na prawej, 2 na lewej), 5 i 7. Nie da się zważyć 1.' }],
            hint: R`bitset<100001> S; int T = razem; S[T] = 1; dla każdego w: S = S | (S << w) | (S >> w);. Masę m da się zważyć, gdy S[T + m]. Najmniejsza niemożliwa może wynosić razem + 1.`,
            tests: (r) => [lista([1, 3]), lista([2, 5]), lista([1000]), lista([1, 3, 9, 27, 81, 243, 729]), lista(r.arr(50, 1, 1000)), lista(r.arr(50, 900, 1000)), lista(r.arr(10, 1, 1000)), lista(new Array(50).fill(1000)), lista([5, 7, 11, 13])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 50) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const T = suma(a); let S = new Uint8Array(2 * T + 1); S[T] = 1; for (const w of a) { const N = S.slice(); for (let i = 0; i <= 2 * T; i++) if (S[i]) { if (i + w <= 2 * T) N[i + w] = 1; if (i - w >= 0) N[i - w] = 1; } S = N; } let c = 0, brak = 0; for (let m = 1; m <= T; m++) { if (S[T + m]) c++; else if (!brak) brak = m; } return `${c} ${brak || T + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> w(n);
    int razem = 0;
    for (int i = 0; i < n; i++) {
        cin >> w[i];
        razem += w[i];
    }
    bitset<100001> S;
    int T = razem;
    S[T] = 1;
    for (int i = 0; i < n; i++) {
        S = S | (S << w[i]) | (S >> w[i]);
    }
    int ile = 0, brak = 0;
    for (int m = 1; m <= razem; m++) {
        if (S[T + m]) ile++;
        else if (brak == 0) brak = m;
    }
    if (brak == 0) brak = razem + 1;
    cout << ile << " " << brak << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-niezbedne-monety', krok: 7, level: 'trudne',
            title: 'Niezbędne monety',
            short: 'Moneta jest niezbędna, gdy bez niej kwoty k nie da się już ułożyć. Dla każdej monety zbuduj zbiór sum ze wszystkich pozostałych i sprawdź bit k.',
            tags: ['zbiór sum bez jednej monety', 'n razy po n przesunięć', 'niemozliwe / brak'],
            statement: ['W portfelu jest n monet, a trzeba zapłacić dokładnie k złotych (każdą monetę można dać najwyżej raz). Jeśli się nie da, wypisz niemozliwe. W przeciwnym razie wypisz numery monet niezbędnych — takich, bez których zapłacić k już się nie da. Gdy żadna nie jest niezbędna, wypisz brak.',
                'Dla każdej monety i zbuduj od nowa zbiór sum ze wszystkich monet oprócz i i sprawdź bit k. To n zbiorów po n przesunięć — na bitsetach to bardzo szybko.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n nominałów (moneta numer 1, 2, …, n).'],
            output_format: ['Jeden wiersz: niemozliwe, brak albo numery niezbędnych monet rosnąco.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każdy nominał ≤ 1000', '1 ≤ k ≤ 100 000'],
            examples: [{ input: '4 9\n2 7 3 4', note: '9 = 2 + 7 = 2 + 3 + 4. Bez dwójki zostają 7, 3 i 4 — dziewięciu z nich nie ułożysz, więc moneta 1 jest niezbędna. Każdą inną da się zastąpić.' },
                { input: '2 5\n2 2', note: 'Z dwóch dwójek nie da się ułożyć pięciu.' }, { input: '3 4\n4 4 1', note: 'Czwórki są dwie, więc żadna nie jest niezbędna.' }],
            hint: R`Najpierw zbiór ze wszystkich monet — jeśli !S[k], wypisz niemozliwe. Potem dla każdego i: bitset<100001> T; T[0] = 1; for (int j = 0; j < n; j++) if (j != i) T |= T << a[j]; if (!T[k]) … moneta i + 1 jest niezbędna.`,
            tests: (r) => {
                const gen = (n, lo, hi) => { const a = r.arr(n, lo, hi); const wyb = a.filter(() => r() < 0.5); return `${n} ${Math.max(1, suma(wyb))}\n${a.join(' ')}`; };
                // Duże, różne nominały i k z kilku monet — mało innych sposobów, więc część monet bywa niezbędna.
                const rzadkie = (n, ile) => { const a = rozne(r, n, 500, 1000); return `${n} ${suma(r.shuffle(a.slice()).slice(0, ile))}\n${a.join(' ')}`; };
                const potegi = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
                return ['4 9\n2 7 3 4', '2 5\n2 2', '3 4\n4 4 1', '1 7\n7', gen(100, 1, 1000), gen(100, 500, 1000), gen(40, 1, 1000), gen(100, 1, 10), `5 100000\n1000 1000 1000 1000 1000`, `6 31\n1 2 4 8 16 32`,
                    rzadkie(20, 5), rzadkie(12, 4), rzadkie(30, 3), `13 789\n${r.shuffle([...potegi, 4, 4, 4]).join(' ')}`, `10 1023\n${r.shuffle(potegi).join(' ')}`];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 100) && calk(k, 1, 100000) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, k] = t; const a = t.slice(2); if (!sumy(a, k)[k]) return 'niemozliwe'; const w = []; for (let i = 0; i < n; i++) if (!sumy(a.filter((_, j) => j !== i), k)[k]) w.push(i + 1); return w.length ? w.join(' ') : 'brak'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    bitset<100001> S;
    S[0] = 1;
    for (int i = 0; i < n; i++) S |= S << a[i];
    if (!S[k]) {
        cout << "niemozliwe\n";
        return 0;
    }
    vector<int> niezbedne;
    for (int i = 0; i < n; i++) {
        bitset<100001> T;
        T[0] = 1;
        for (int j = 0; j < n; j++) {
            if (j != i) T |= T << a[j];
        }
        if (!T[k]) niezbedne.push_back(i + 1);
    }
    if (niezbedne.empty()) cout << "brak";
    for (int x : niezbedne) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · bitset jako przyspieszacz
        {
            id: 'bs-wspolni-znajomi', krok: 8, level: 'latwe',
            title: 'Wspólni znajomi',
            short: 'Znajomych każdej osoby trzymaj w osobnym bitsecie — tablica bitsetów to cała sieć. Wspólni znajomi u i v to (z[u] & z[v]).count().',
            tags: ['bitset<2001> z[2001]', 'z[a][b] = z[b][a] = 1', '(z[u] & z[v]).count()'],
            statement: ['W serwisie społecznościowym jest n osób i m par znajomych (znajomość działa w obie strony). Odpowiedz na q pytań: ile wspólnych znajomych mają osoby u i v?',
                'Dla każdej osoby trzymaj bitset jej znajomych: z[a][b] = 1, gdy a zna b. Wspólni znajomi to bity zapalone w obu bitsetach — jedno & i jedno count() na pytanie. Tablica 2001 bitsetów po 2001 bitów zajmuje około pół megabajta i musi stać przed main.'],
            input_format: ['W pierwszym wierszu liczby n, m i q.', 'W każdym z kolejnych m wierszy dwie osoby, które się znają.', 'W każdym z kolejnych q wierszy pytanie: dwie różne osoby u i v.'],
            output_format: ['q wierszy: liczba wspólnych znajomych.'],
            constraints: ['2 ≤ n ≤ 2000', '1 ≤ m ≤ 4000', '1 ≤ q ≤ 4000', 'każda para znajomych występuje najwyżej raz'],
            examples: [{ input: '5 5 3\n1 2\n1 3\n2 3\n3 4\n4 5\n1 2\n1 4\n2 5', note: 'Osoby 1 i 2 znają obie trójkę. 1 i 4 też mają wspólnego znajomego 3. Osoby 2 i 5 nie mają wspólnych znajomych.' }],
            hint: R`bitset<2001> z[2001]; przed main. Dla każdej znajomości: z[a][b] = 1; z[b][a] = 1;. Pytanie: cout << (z[u] & z[v]).count() << "\n";.`,
            tests: (r) => {
                // Połowa pytań to pary w odległości 2 (znajomy znajomego) — inaczej w dużym rzadkim grafie prawie zawsze wychodziłoby 0.
                const gen = (n, m, q, grupa) => {
                    const e = grupa ? losGrafGrupy(r, n, m, grupa) : losGraf(r, n, m);
                    const adj = Array.from({ length: n + 1 }, () => []);
                    for (const [a, b] of e) { adj[a].push(b); adj[b].push(a); }
                    const p = Array.from({ length: q }, () => {
                        if (r() < 0.5) { const [a, b] = r.pick(e); const c = r.pick(adj[b]); if (c !== a) return `${a} ${c}`; }
                        const u = r.int(1, n); let v = r.int(1, n - 1); if (v >= u) v++; return `${u} ${v}`;
                    });
                    return `${n} ${m} ${q}\n${e.map(([a, b]) => `${a} ${b}`).join('\n')}\n${p.join('\n')}`;
                };
                return ['5 5 3\n1 2\n1 3\n2 3\n3 4\n4 5\n1 2\n1 4\n2 5', '2 1 1\n1 2\n2 1', gen(2000, 4000, 4000, 0), gen(2000, 4000, 4000, 20), gen(100, 4000, 4000, 0), gen(60, 1000, 3000, 0), gen(2000, 1500, 4000, 5)];
            },
            check: (inp) => { const t = nums(inp); const [n, m, q] = t; if (!calk(q, 1, 4000) || !dobryGraf([n, m, ...t.slice(3, 3 + 2 * m)], 2000, 4000)) return 'dane'; const p = t.slice(3 + 2 * m); return p.length === 2 * q && p.every((x) => calk(x, 1, n)) && p.every((x, i) => i % 2 === 1 || x !== p[i + 1]) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, m, q] = t; const e = []; for (let i = 0; i < m; i++) e.push([t[3 + 2 * i], t[4 + 2 * i]]); const M = macierz(n, e); const o = []; for (let i = 0; i < q; i++) { const u = t[3 + 2 * m + 2 * i], v = t[4 + 2 * m + 2 * i]; let c = 0; for (let x = 1; x <= n; x++) if (M[u][x] && M[v][x]) c++; o.push(c); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<2001> z[2001];
int main() {
    int n, m, q;
    cin >> n >> m >> q;
    for (int i = 0; i <= n; i++) z[i].reset(); // zerowanie przed testem
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        z[a][b] = 1;
        z[b][a] = 1;
    }
    for (int i = 0; i < q; i++) {
        int u, v;
        cin >> u >> v;
        cout << (z[u] & z[v]).count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-trojkaty', krok: 8, level: 'srednie',
            title: 'Trójkąty w grafie',
            short: 'Każdy trójkąt zawierający krawędź a–b to wspólny sąsiad a i b. Zsumuj (s[a] & s[b]).count() po wszystkich krawędziach i podziel przez 3.',
            tags: ['tablica bitsetów', 'suma po krawędziach', 'każdy trójkąt 3 razy'],
            statement: ['W grafie jest n wierzchołków i m krawędzi. Trójkąt to trzy wierzchołki połączone każdy z każdym. Ile trójkątów jest w grafie?',
                'Dla krawędzi a–b każdy wspólny sąsiad c daje trójkąt a, b, c — a wspólnych sąsiadów policzy (s[a] & s[b]).count(). Gdy zsumujesz to po wszystkich krawędziach, każdy trójkąt policzysz trzy razy (raz dla każdego z jego boków), więc na końcu podziel przez 3.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy krawędź: dwa różne wierzchołki.'],
            output_format: ['Jedna liczba — liczba trójkątów.'],
            constraints: ['2 ≤ n ≤ 1000', '1 ≤ m ≤ 8000', 'każda krawędź występuje najwyżej raz'],
            examples: [{ input: '4 5\n1 2\n2 3\n1 3\n3 4\n2 4', note: 'Trójkąty: 1–2–3 i 2–3–4. Krawędź 2–3 należy do obu.' }],
            hint: R`bitset<1001> s[1001]; zapamiętaj też krawędzie w vectorze. Potem long long razem = 0; for (auto [a, b] : krawedzie) razem += (s[a] & s[b]).count(); cout << razem / 3;.`,
            tests: (r) => {
                const gen = (n, m, grupa) => grafTxt(n, grupa ? losGrafGrupy(r, n, m, grupa) : losGraf(r, n, m));
                const pelny = (n) => { const e = []; for (let a = 1; a <= n; a++) for (let b = a + 1; b <= n; b++) e.push([a, b]); return grafTxt(n, e); };
                return ['4 5\n1 2\n2 3\n1 3\n3 4\n2 4', '3 2\n1 2\n2 3', pelny(10), pelny(126), gen(1000, 8000, 0), gen(1000, 8000, 30), gen(200, 8000, 0), gen(1000, 3000, 8)];
            },
            check: (inp) => (dobryGraf(nums(inp), 1000, 8000) && nums(inp).length === 2 + 2 * nums(inp)[1] ? null : 'dane'),
            solve: (inp) => { const t = nums(inp); const [n, m] = t; const e = []; for (let i = 0; i < m; i++) e.push([t[2 + 2 * i], t[3 + 2 * i]]); const M = macierz(n, e); let c = 0; for (const [a, b] of e) for (let x = 1; x <= n; x++) if (M[a][x] && M[b][x]) c++; return String(c / 3); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1001> s[1001];
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i <= n; i++) s[i].reset(); // zerowanie przed testem
    vector<pair<int, int>> krawedzie;
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        s[a][b] = 1;
        s[b][a] = 1;
        krawedzie.push_back({a, b});
    }
    long long razem = 0;
    for (auto [a, b] : krawedzie) {
        razem += (s[a] & s[b]).count();
    }
    cout << razem / 3 << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-zasieg', krok: 8, level: 'srednie',
            title: 'Dokąd dojadę',
            short: 'dojade[i] to zbiór miast osiągalnych z i. Jeśli z i da się dojechać do k, to także wszędzie tam, dokąd się da z k: dojade[i] |= dojade[k].',
            tags: ['if (r[i][k]) r[i] |= r[k]', 'k w zewnętrznej pętli', 'n³ / 64'],
            statement: ['W kraju jest n miast i m dróg jednokierunkowych: droga a b pozwala jechać z a do b, ale nie z powrotem. Dla każdego miasta policz, do ilu miast da się z niego dojechać (licząc samo miasto).',
                'Zacznij od dojade[i] = {i} plus bezpośrednie drogi. Potem dla każdego miasta pośredniego k (zewnętrzna pętla!) i każdego miasta i: jeśli z i da się dojechać do k, to z i da się dojechać wszędzie tam, dokąd z k — if (dojade[i][k]) dojade[i] |= dojade[k];. To n² działań na bitsetach po n bitów.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy droga: miasto a i miasto b (a ≠ b).'],
            output_format: ['n wierszy: liczba miast osiągalnych z miasta 1, 2, …, n.'],
            constraints: ['2 ≤ n ≤ 1000', '1 ≤ m ≤ 8000', 'każda droga a b występuje najwyżej raz'],
            examples: [{ input: '4 3\n1 2\n2 3\n4 1', note: 'Z miasta 1 dojedziesz do 2 i 3 (razem z sobą — 3 miasta). Z 2 — do 3. Z 3 nigdzie. Z 4 — wszędzie.' }],
            hint: R`bitset<1001> dojade[1001]; ustaw dojade[i][i] = 1 i dojade[a][b] = 1 dla dróg. Potem for (int k = 1; k <= n; k++) for (int i = 1; i <= n; i++) if (dojade[i][k]) dojade[i] |= dojade[k];. Wynik: dojade[i].count().`,
            tests: (r) => {
                const gen = (n, m) => grafTxt(n, losGraf(r, n, m, true));
                const sciezka = (n) => grafTxt(n, Array.from({ length: n - 1 }, (_, i) => [i + 1, i + 2]));
                return ['4 3\n1 2\n2 3\n4 1', '2 1\n2 1', sciezka(1000), gen(1000, 1000), gen(1000, 1300), gen(1000, 8000), gen(300, 500), gen(50, 2000)];
            },
            check: (inp) => (dobryGraf(nums(inp), 1000, 8000, true) && nums(inp).length === 2 + 2 * nums(inp)[1] ? null : 'dane'),
            solve: (inp) => { const t = nums(inp); const [n, m] = t; const adj = Array.from({ length: n + 1 }, () => []); for (let i = 0; i < m; i++) adj[t[2 + 2 * i]].push(t[3 + 2 * i]); const o = []; for (let s = 1; s <= n; s++) { const vis = new Uint8Array(n + 1); vis[s] = 1; const st = [s]; let c = 1; while (st.length) { const v = st.pop(); for (const u of adj[v]) if (!vis[u]) { vis[u] = 1; c++; st.push(u); } } o.push(c); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1001> dojade[1001];
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i <= n; i++) dojade[i].reset(); // zerowanie przed testem
    for (int i = 1; i <= n; i++) dojade[i][i] = 1;
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        dojade[a][b] = 1;
    }
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i <= n; i++) {
            if (dojade[i][k]) dojade[i] |= dojade[k];
        }
    }
    for (int i = 1; i <= n; i++) {
        cout << dojade[i].count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-prostokaty', krok: 8, level: 'srednie',
            title: 'Prostokąty w kratce',
            short: 'Dwa wiersze kratki mają c wspólnych kolumn z jedynkami — każda para takich kolumn to jeden prostokąt. Dla każdej pary wierszy dodaj c · (c − 1) / 2.',
            tags: ['(w[i] & w[j]).count()', 'c · (c − 1) / 2', 'long long'],
            statement: ['Kratka ma n wierszy i m kolumn, w każdym polu 0 albo 1. Ile jest prostokątów o bokach wzdłuż linii kratki, których wszystkie cztery rogi to jedynki? Rogi muszą leżeć w dwóch różnych wierszach i dwóch różnych kolumnach.',
                'Weź dwa wiersze i oraz j. Kolumny, w których oba mają jedynkę, to bity (w[i] & w[j]) — niech jest ich c. Każde dwie takie kolumny razem z wierszami i, j tworzą prostokąt, więc ta para wierszy daje c · (c − 1) / 2 prostokątów.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy napis z m zer i jedynek.'],
            output_format: ['Jedna liczba — liczba prostokątów.'],
            constraints: ['1 ≤ n, m ≤ 300'],
            examples: [{ input: '3 4\n1101\n1111\n0101', note: 'Wiersze 1 i 2 mają wspólne jedynki w trzech kolumnach — 3 prostokąty. Wiersze 1 i 3 — w dwóch (1 prostokąt), wiersze 2 i 3 — też w dwóch. Razem 5.' }],
            hint: R`vector<bitset<300>> w(n); wczytaj wiersze jako bitsety. Potem long long razem = 0; for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) { long long c = (w[i] & w[j]).count(); razem += c * (c - 1) / 2; }.`,
            tests: (r) => {
                const gen = (n, m, p) => `${n} ${m}\n${Array.from({ length: n }, () => los01(r, m, p)).join('\n')}`;
                return ['3 4\n1101\n1111\n0101', '1 5\n11111', '2 2\n11\n11', gen(300, 300, 0.5), gen(300, 300, 1), gen(300, 300, 0.05), gen(300, 7, 0.6), gen(10, 300, 0.8)];
            },
            check: (inp) => { const l = L(inp); const [n, m] = l[0].split(' ').map(Number); return calk(n, 1, 300) && calk(m, 1, 300) && l.length === n + 1 && l.slice(1).every((s) => s.length === m && /^[01]+$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); const s = l.slice(1); let w = 0n; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let c = 0; for (let k = 0; k < s[i].length; k++) if (s[i][k] === '1' && s[j][k] === '1') c++; w += BigInt(c * (c - 1) / 2); } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<bitset<300>> w(n);
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        w[i] = bitset<300>(s);
    }
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            long long c = (w[i] & w[j]).count();
            razem += c * (c - 1) / 2;
        }
    }
    cout << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-kolejny-wolny', krok: 8, level: 'srednie',
            title: 'Pierwszy wolny od k',
            short: 'Trzymaj bitset wolnych miejsc. wolne._Find_next(k − 1) skacze od razu do pierwszej jedynki o numerze co najmniej k — po 64 bity naraz.',
            tags: ['_Find_next(k - 1)', 'wynik == size() — brak', 'bitset wolnych'],
            statement: ['Na przystani jest n miejsc dla łódek o numerach od 1 do n, na początku wszystkie wolne. Zdarzenia: zajmij k — przypływa łódka, której kapitan chce stanąć jak najbliżej miejsca k, ale nie przed nim: dostaje wolne miejsce o najmniejszym numerze ≥ k (wypisz je albo brak, gdy takiego nie ma); zwolnij k — łódka z miejsca k odpływa.',
                'Trzymaj bitset wolne, w którym zapalone są wolne miejsca. GCC ma do bitsetów funkcję _Find_next(i): zwraca numer pierwszej jedynki o numerze większym niż i (a gdy takiej nie ma — rozmiar bitsetu). Szuka po 64 bity naraz, więc jest dużo szybsza niż pętla po pojedynczych bitach.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy zdarzenie: zajmij k albo zwolnij k.'],
            output_format: ['Dla każdego zdarzenia zajmij jeden wiersz: numer miejsca albo brak.'],
            constraints: ['1 ≤ n ≤ 100 000', '1 ≤ q ≤ 4000', '1 ≤ k ≤ n', 'zwolnij k dotyczy zawsze zajętego miejsca', 'jest co najmniej jedno zdarzenie zajmij'],
            examples: [{ input: '5 6\nzajmij 2\nzajmij 2\nzajmij 5\nzajmij 5\nzwolnij 3\nzajmij 1', note: 'Pierwsza łódka staje na 2, druga — na 3 (2 zajęte), trzecia — na 5. Dla czwartej nie ma wolnego miejsca od 5 w górę. Po zwolnieniu trójki ostatnia łódka dostaje miejsce 1 — wolne od początku.' }],
            hint: R`bitset<100001> wolne; for (int i = 1; i <= n; i++) wolne[i] = 1;. zajmij k: int x = wolne._Find_next(k - 1); if (x > n) brak, inaczej wolne[x] = 0; i wypisz x. zwolnij k: wolne[k] = 1;.`,
            tests: (r) => {
                const gen = (n, q, pz, kmin) => { const zaj = new Set(); const a = []; for (let i = 0; i < q; i++) { if (zaj.size && r() > pz) { const k = r.pick([...zaj]); zaj.delete(k); a.push(`zwolnij ${k}`); } else { const k = r.int(kmin, n); a.push(`zajmij ${k}`); let x = k; while (x <= n && zaj.has(x)) x++; if (x <= n) zaj.add(x); } } if (!a.some((w) => w.startsWith('zajmij'))) a.push('zajmij 1'); return `${n} ${a.length}\n${a.join('\n')}`; };
                return ['5 6\nzajmij 2\nzajmij 2\nzajmij 5\nzajmij 5\nzwolnij 3\nzajmij 1', '1 2\nzajmij 1\nzajmij 1', gen(100000, 4000, 0.8, 1), gen(100000, 4000, 1, 99000), gen(3000, 4000, 0.75, 1), gen(100000, 4000, 0.9, 50000), gen(10, 4000, 0.6, 1)];
            },
            check: (inp) => { const l = L(inp); const [n, q] = l[0].split(' ').map(Number); if (!calk(n, 1, 100000) || !calk(q, 1, 4000) || l.length !== q + 1 || !l.slice(1).some((w) => w.startsWith('zajmij'))) return 'dane'; const zaj = new Set(); for (const w of l.slice(1)) { const m = w.match(/^(zajmij|zwolnij) (\d+)$/); if (!m || !calk(Number(m[2]), 1, n)) return 'dane'; const k = Number(m[2]); if (m[1] === 'zwolnij') { if (!zaj.has(k)) return 'zwalnia wolne'; zaj.delete(k); } else { let x = k; while (x <= n && zaj.has(x)) x++; if (x <= n) zaj.add(x); } } return null; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); const zaj = new Uint8Array(n + 2); const o = []; for (const w of l.slice(1)) { const [p, ks] = w.split(' '); const k = Number(ks); if (p === 'zwolnij') { zaj[k] = 0; continue; } let x = k; while (x <= n && zaj[x]) x++; if (x > n) o.push('brak'); else { zaj[x] = 1; o.push(String(x)); } } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100001> wolne;
int main() {
    int n, q;
    cin >> n >> q;
    wolne.reset();
    for (int i = 1; i <= n; i++) wolne[i] = 1;
    for (int i = 0; i < q; i++) {
        string p;
        int k;
        cin >> p >> k;
        if (p == "zajmij") {
            int x = wolne._Find_next(k - 1);
            if (x > n) {
                cout << "brak\n";
            } else {
                wolne[x] = 0;
                cout << x << "\n";
            }
        } else {
            wolne[k] = 1;
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-podobni-ankietowani', krok: 8, level: 'srednie',
            title: 'Podobni ankietowani',
            short: 'Dwie osoby odpowiedziały tak samo na tyle pytań, na ile ich odpowiedzi się nie różnią: m − (a ^ b).count(). Policz pary, które zgadzają się co najmniej k razy.',
            tags: ['m - (a ^ b).count()', 'wszystkie pary', 'próg k'],
            statement: ['Każda z n osób odpowiedziała na m pytań TAK (1) albo NIE (0). Dwie osoby są podobne, jeśli udzieliły takiej samej odpowiedzi na co najmniej k pytań. Ile jest par podobnych osób?',
                'Liczba pytań z różnymi odpowiedziami to (a ^ b).count(), więc takich samych odpowiedzi jest m − (a ^ b).count(). Bitset ma 300 bitów, ale XOR na bitach powyżej m daje zawsze 0 ^ 0 = 0, więc nic nie psuje.'],
            input_format: ['W pierwszym wierszu liczby n, m i k.', 'W każdym z kolejnych n wierszy napis z m zer i jedynek.'],
            output_format: ['Jedna liczba — liczba par podobnych osób.'],
            constraints: ['2 ≤ n ≤ 300', '1 ≤ m ≤ 300', '0 ≤ k ≤ m'],
            examples: [{ input: '3 4 3\n1100\n1101\n0011', note: 'Osoby 1 i 2 różnią się tylko ostatnią odpowiedzią — zgodne 3 razy. Osoby 1 i 3 różnią się wszędzie, a 2 i 3 zgadzają się tylko raz. Jedna para.' }],
            hint: R`for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) if (m - (int)(o[i] ^ o[j]).count() >= k) ile++;.`,
            tests: (r) => {
                const gen = (n, m, k, p) => { const baza = los01(r, m); return `${n} ${m} ${k}\n${Array.from({ length: n }, () => baza.split('').map((c) => (r() < p ? (c === '1' ? '0' : '1') : c)).join('')).join('\n')}`; };
                return ['3 4 3\n1100\n1101\n0011', '2 1 0\n0\n1', '2 1 1\n0\n1', gen(300, 300, 200, 0.2), gen(300, 300, 150, 0.5), gen(300, 300, 280, 0.05), gen(300, 20, 15, 0.3), gen(100, 300, 0, 0.5), gen(300, 300, 300, 0.01)];
            },
            check: (inp) => { const l = L(inp); const [n, m, k] = l[0].split(' ').map(Number); return calk(n, 2, 300) && calk(m, 1, 300) && calk(k, 0, m) && l.length === n + 1 && l.slice(1).every((s) => s.length === m && /^[01]+$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const [n, m, k] = l[0].split(' ').map(Number); const s = l.slice(1); let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let z = 0; for (let x = 0; x < m; x++) if (s[i][x] === s[j][x]) z++; if (z >= k) c++; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<bitset<300>> o(n);
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        o[i] = bitset<300>(s);
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int zgodne = m - (int)(o[i] ^ o[j]).count();
            if (zgodne >= k) ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-rozlaczne-zbiory', krok: 8, level: 'srednie',
            title: 'Zbiory rozłączne',
            short: 'Dwa zbiory są rozłączne, gdy (s[i] & s[j]).none(). Par jest około dwóch milionów, ale każda to tylko osiem słów po 64 bity.',
            tags: ['(a & b).none()', 'vector<bitset<500>>', 'miliony par'],
            statement: ['Jest n zbiorów liczb od 0 do 499. Ile jest par zbiorów (bez kolejności), które nie mają żadnego wspólnego elementu? Pusty zbiór jest rozłączny z każdym.',
                'Zamień każdy zbiór na bitset<500> i dla każdej pary sprawdź (s[i] & s[j]).none(). Par może być prawie dwa miliony — przy zwykłym porównywaniu list trwałoby to długo, a bitset robi jedno porównanie w ośmiu krokach po 64 bity.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy liczba k, a po niej k liczb zbioru (mogą się powtarzać).'],
            output_format: ['Jedna liczba — liczba par rozłącznych zbiorów.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ k ≤ 500', 'w całych danych jest najwyżej 20 000 liczb', '0 ≤ każda liczba ≤ 499'],
            examples: [{ input: '4\n2 1 2\n2 3 4\n1 2\n0', note: 'Zbiory {1, 2}, {3, 4}, {2} i pusty. Tylko {1, 2} i {2} mają coś wspólnego — rozłącznych par jest 5 z 6.' }],
            hint: R`vector<bitset<500>> s(n); i dla każdej pary i < j: if ((s[i] & s[j]).none()) ile++;. Wynik może przekroczyć milion, ale zmieści się w long long (a nawet w int).`,
            tests: (r) => {
                const gen = (n, kmax, hi) => { const a = []; let ile = 0; for (let i = 0; i < n; i++) { const k = Math.min(r.int(0, kmax), 20000 - ile - (n - i - 1) * 0); const kk = Math.max(0, Math.min(k, 20000 - ile)); ile += kk; a.push(listaW(r.arr(kk, 0, hi))); } return `${n}\n${a.join('\n')}`; };
                return ['4\n2 1 2\n2 3 4\n1 2\n0', '2\n0\n0', '2\n1 5\n1 5', gen(2000, 10, 499), gen(2000, 3, 60), gen(2000, 15, 499), gen(100, 200, 499), gen(2000, 1, 499)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 2, 2000)) return 'dane'; let i = 1, ile = 0; for (let k = 0; k < n; k++) { const c = t[i++]; if (!calk(c, 0, 500)) return 'dane'; ile += c; for (let j = 0; j < c; j++) if (!calk(t[i++], 0, 499)) return 'dane'; } return i === t.length && ile <= 20000 ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const z = []; let i = 1; for (let k = 0; k < n; k++) { const c = t[i++]; z.push(new Set(t.slice(i, i + c))); i += c; } const bez = z.map((s) => [...s]); let w = 0; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) { const [x, y] = bez[a].length < bez[b].length ? [bez[a], z[b]] : [bez[b], z[a]]; if (!x.some((v) => y.has(v))) w++; } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<bitset<500>> s(n);
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            s[i][x] = 1;
        }
    }
    long long ile = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if ((s[i] & s[j]).none()) ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-dwa-kroki', krok: 8, level: 'srednie',
            title: 'Znajomi znajomych',
            short: 'Osoby w odległości najwyżej 2 od v to znajomi v i znajomi tych znajomych: OR bitsetów wszystkich sąsiadów, a na koniec zgaś bit samego v.',
            tags: ['r |= z[u] dla sąsiadów', 'r[v] = 0', 'listy sąsiadów + bitsety'],
            statement: ['W sieci jest n osób i m par znajomych. Dla każdej osoby v policz, ile innych osób jest jej znajomymi albo znajomymi jej znajomych (osoby, do których od v prowadzi droga z jednego albo dwóch kroków).',
                'Weź bitset znajomych v i dołóż do niego bitsety wszystkich znajomych v: r |= z[u]. Wtedy zapalą się osoby w odległości 1 i 2 — ale też sama osoba v (jest znajomą swoich znajomych), więc na koniec zgaś r[v]. Listy znajomych trzymaj w vectorach, żeby szybko przejść po sąsiadach.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy dwie osoby, które się znają.'],
            output_format: ['n wierszy: liczba osób w odległości 1 albo 2 od osoby 1, 2, …, n.'],
            constraints: ['2 ≤ n ≤ 2000', '1 ≤ m ≤ 8000', 'każda para znajomych występuje najwyżej raz'],
            examples: [{ input: '5 4\n1 2\n2 3\n3 4\n4 5', note: 'Osoby stoją w łańcuchu 1–2–3–4–5. Od osoby 3 w dwóch krokach dojdziesz do wszystkich czterech pozostałych, a od osoby 1 — tylko do 2 i 3.' }],
            hint: R`bitset<2001> z[2001]; vector<int> sasiedzi[2001];. Dla osoby v: bitset<2001> r = z[v]; for (int u : sasiedzi[v]) r |= z[u]; r[v] = 0; cout << r.count() << "\n";.`,
            tests: (r) => {
                const gen = (n, m, grupa) => grafTxt(n, grupa ? losGrafGrupy(r, n, m, grupa) : losGraf(r, n, m));
                return ['5 4\n1 2\n2 3\n3 4\n4 5', '2 1\n1 2', gen(2000, 8000, 0), gen(2000, 2000, 0), gen(2000, 8000, 25), gen(300, 8000, 0), `2000 1999\n${Array.from({ length: 1999 }, (_, i) => `1 ${i + 2}`).join('\n')}`];
            },
            check: (inp) => (dobryGraf(nums(inp), 2000, 8000) && nums(inp).length === 2 + 2 * nums(inp)[1] ? null : 'dane'),
            solve: (inp) => { const t = nums(inp); const [n, m] = t; const adj = Array.from({ length: n + 1 }, () => []); for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; adj[a].push(b); adj[b].push(a); } const o = []; const zn = new Int32Array(n + 1); for (let v = 1; v <= n; v++) { let c = 0; const mark = (u) => { if (u !== v && zn[u] !== v) { zn[u] = v; c++; } }; for (const u of adj[v]) { mark(u); for (const w of adj[u]) mark(w); } o.push(c); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<2001> z[2001];
vector<int> sasiedzi[2001];
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i <= n; i++) { // zerowanie przed testem
        z[i].reset();
        sasiedzi[i].clear();
    }
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        z[a][b] = 1;
        z[b][a] = 1;
        sasiedzi[a].push_back(b);
        sasiedzi[b].push_back(a);
    }
    for (int v = 1; v <= n; v++) {
        bitset<2001> r = z[v];
        for (int u : sasiedzi[v]) r |= z[u];
        r[v] = 0;
        cout << r.count() << "\n";
    }
    return 0;
}`,
        },
    ];
};
