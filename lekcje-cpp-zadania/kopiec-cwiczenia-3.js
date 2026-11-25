// Kopiec — ćwiczenia w trakcie lekcji, części 7–8: zdarzenia w czasie (kasy, sale, procesor), zachłanne wybieranie
// z terminami (zyski, kursy, tankowanie), leniwe usuwanie (usuwanie ze środka, maksimum w oknie) oraz algorytm Dijkstry
// (odległości, wiadomość w sieci, odtwarzanie trasy, plansza z kosztami, wiele startów, dwa przebiegi, liczba
// najkrótszych dróg i graf stanów z biletem ze zniżką).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kopiec-pomoc');
    const { calk, PQ, mniej, wiecej, mniejKrotka, wiecejKrotka, generuj, dobryGen, KOD_GEN, losGrafW, listyW, grafWTxt, dijkstra, trasa, losKoszty, kosztyTxt, D4 } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');

    // wspólne sprawdzenie grafu z wagami: nagłówek „n m” (+ dodatkowe liczby), potem m krawędzi a b w
    function grafOk(t, od, n, m, maxN, maxM, wmin, wmax) {
        if (!calk(n, 2, maxN) || !calk(m, 0, maxM)) return false;
        for (let i = 0; i < m; i++) {
            const a = t[od + 3 * i], b = t[od + 3 * i + 1], w = t[od + 3 * i + 2];
            if (!calk(a, 1, n) || !calk(b, 1, n) || a === b || !calk(w, wmin, wmax)) return false;
        }
        return true;
    }
    function czytajGraf(t, od, m) { const k = []; for (let i = 0; i < m; i++) k.push([t[od + 3 * i], t[od + 3 * i + 1], t[od + 3 * i + 2]]); return k; }
    const dTxt = (d) => (d === Infinity ? -1 : d);
    // graf o kształcie kratki R × C (wierzchołki numerowane wierszami), wagi z [wmin, wmax], z kilkoma przekątnymi
    function kratka(r, R_, C, wmin, wmax, przekatne = 0) {
        const id = (i, j) => i * C + j + 1, k = [];
        for (let i = 0; i < R_; i++) for (let j = 0; j < C; j++) {
            if (j + 1 < C) k.push([id(i, j), id(i, j + 1), r.int(wmin, wmax)]);
            if (i + 1 < R_) k.push([id(i, j), id(i + 1, j), r.int(wmin, wmax)]);
            if (przekatne && i + 1 < R_ && j + 1 < C && r() < przekatne) k.push([id(i, j), id(i + 1, j + 1), r.int(wmin, wmax)]);
        }
        return r.shuffle(k).map((e) => (r() < 0.5 ? e : [e[1], e[0], e[2]]));
    }

    return [
        // ================================================================ KROK 7 · zdarzenia, terminy i leniwe usuwanie
        {
            id: 'kop-kasy', krok: 7, level: 'latwe',
            title: 'Kasy w sklepie',
            short: 'Każdy klient idzie do kasy, która najwcześniej będzie wolna. Kopiec minimum par {kiedy wolna, numer kasy}.',
            tags: ['kopiec czasów', 'para {czas, numer}', 'long long'],
            statement: ['W sklepie jest m kas ponumerowanych od 1 do m, a w kolejce stoi n klientów. Obsługa i-tego klienta trwa tᵢ minut. W chwili 0 wszystkie kasy są wolne.',
                'Klienci po kolei, w kolejności z kolejki, podchodzą do kasy, która najwcześniej będzie wolna (jeśli kilka kas zwalnia się w tej samej chwili — do tej o najmniejszym numerze). Obsługa zaczyna się, gdy kasa się zwolni.',
                'Wypisz, do której kasy trafił każdy klient, a w drugim wierszu — o której minucie skończy się obsługa ostatniego klienta.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n liczb tᵢ.'],
            output_format: ['W pierwszym wierszu n numerów kas.', 'W drugim wierszu jedna liczba — chwila zakończenia całej obsługi.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ m ≤ 1000', 'Czasy obsługi są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '5 2\n5 3 4 1 2', note: 'Klient 1 do kasy 1 (wolna o 5), klient 2 do kasy 2 (wolna o 3). Klient 3 czeka na kasę 2 (3 + 4 = 7). Klient 4 — kasa 1 o 5 (do 6). Klient 5 — kasa 1 o 6 (do 8). Koniec o 8.' }],
            hint: R`priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> kasy; — na początku {0, j} dla każdej kasy. Klient: auto [czas, nr] = kasy.top(); kasy.pop(); kasy.push({czas + t, nr}); koniec = max(koniec, czas + t);.`,
            tests: (r) => {
                const d = (t, m) => `${t.length} ${m}\n${t.join(' ')}`;
                return [d([7], 1), d([7], 3), d([1, 1, 1, 1], 2), d([5, 3, 4, 1, 2], 2), d(r.arr(20, 1, 10), 3), d(r.arr(5000, 1, 1000000), 1000), d(r.arr(5000, 1, 1000000), 1), d(r.arr(5000, 1, 3), 7), d(r.arr(3000, 1000000, 1000000), 100)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(n, 1, 5000) && calk(m, 1, 1000) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), m = t[1], kasy = new PQ(wiecejKrotka), nr = [];
                for (let j = 1; j <= m; j++) kasy.push([0, j]);
                let koniec = 0;
                for (const x of t.slice(2)) { const [c, k] = kasy.pop(); nr.push(k); kasy.push([c + x, k]); koniec = Math.max(koniec, c + x); }
                return nr.join(' ') + '\n' + koniec;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> kasy;
    for (int j = 1; j <= m; j++) kasy.push({0, j});
    long long koniec = 0;
    for (int i = 0; i < n; i++) {
        long long t;
        cin >> t;
        auto [czas, nr] = kasy.top();
        kasy.pop();
        cout << nr << " ";
        kasy.push({czas + t, nr});
        koniec = max(koniec, czas + t);
    }
    cout << "\n" << koniec << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-sale', krok: 7, level: 'latwe',
            title: 'Ile sal potrzeba',
            short: 'Spotkania posortowane po początku, a w kopcu minimum — końce trwających spotkań. Największy rozmiar kopca to liczba sal.',
            tags: ['sortowanie po początku', 'kopiec końców', 'zwalnianie sal'],
            statement: ['W firmie zaplanowano n spotkań. Spotkanie i trwa od chwili sᵢ do chwili eᵢ (spotkanie kończące się o 10 i spotkanie zaczynające się o 10 mogą być w tej samej sali). Ile najmniej sal potrzeba, żeby wszystkie spotkania się odbyły?',
                'Posortuj spotkania po początku. Trzymaj w kopcu minimum końce spotkań, które właśnie zajmują sale. Przed każdym spotkaniem zwolnij salę, jeśli najwcześniej kończące się spotkanie skończyło się do chwili sᵢ (top() ≤ sᵢ), a potem wrzuć eᵢ. Odpowiedź to największy rozmiar kopca.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby sᵢ i eᵢ.'],
            output_format: ['Jedna liczba — najmniejsza liczba sal.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ sᵢ < eᵢ ≤ 10⁹'],
            examples: [{ input: '4\n0 30\n5 10\n10 20\n15 25', note: 'O 15 trwają naraz trzy spotkania: 0–30, 10–20 i 15–25 (spotkanie 5–10 już się skończyło i zwolniło salę). Potrzeba 3 sal.' }],
            hint: R`vector<pair<int, int>> sp(n); sort(sp.begin(), sp.end());. Potem: for (auto [s, e] : sp) { if (!konce.empty() && konce.top() <= s) konce.pop(); konce.push(e); naj = max(naj, (int)konce.size()); }.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, T, D) => d(Array.from({ length: n }, () => { const s = r.int(0, T - 1); return [s, Math.min(T, s + r.int(1, D))]; }));
                return [d([[1, 2]]), d([[0, 10], [10, 20]]), d([[0, 10], [5, 15], [9, 20]]), d([[3, 4], [3, 4], [3, 4]]), los(20, 50, 10), los(5000, 1000000000, 1000000), los(5000, 1000000000, 300000000), los(5000, 100, 5), los(3000, 1000000, 1)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 5000) || t.length !== 2 * n + 1) return 'n'; for (let i = 0; i < n; i++) { const s = t[1 + 2 * i], e = t[2 + 2 * i]; if (!calk(s, 0, 1e9) || !calk(e, 0, 1e9) || s >= e) return 'spotkanie'; } return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0], ev = [];
                for (let i = 0; i < n; i++) { ev.push([t[1 + 2 * i], 1]); ev.push([t[2 + 2 * i], -1]); }
                ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                let c = 0, naj = 0;
                for (const [, d] of ev) { c += d; naj = Math.max(naj, c); }
                return String(naj);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> sp(n);
    for (auto &[s, e] : sp) cin >> s >> e;
    sort(sp.begin(), sp.end());
    priority_queue<int, vector<int>, greater<int>> konce;
    int naj = 0;
    for (auto [s, e] : sp) {
        if (!konce.empty() && konce.top() <= s) konce.pop();
        konce.push(e);
        naj = max(naj, (int)konce.size());
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-procesor', krok: 7, level: 'srednie',
            title: 'Procesor jednowątkowy',
            short: 'Zadania przychodzą w różnych chwilach, a wolny procesor bierze najkrótsze z czekających. Zegar, wskaźnik po posortowanych i kopiec.',
            tags: ['zegar symulacji', 'kopiec czekających', 'skok do następnego'],
            statement: ['Procesor dostaje n zadań ponumerowanych od 1 do n. Zadanie i pojawia się w chwili aᵢ i wymaga dᵢ jednostek czasu. Procesor robi naraz jedno zadanie i nie przerywa go, dopóki go nie skończy.',
                'Gdy procesor jest wolny, wybiera spośród zadań, które już się pojawiły i czekają, to o najkrótszym czasie dᵢ (przy remisie — o najmniejszym numerze). Jeśli żadne zadanie nie czeka, procesor czeka do chwili pojawienia się następnego. Wypisz numery zadań w kolejności wykonywania.',
                'Posortuj zadania po chwili pojawienia się. Trzymaj zegar i wskaźnik na następne zadanie z posortowanej listy: przed wyborem wrzuć do kopca minimum par {dᵢ, i} wszystkie zadania z aᵢ ≤ zegar.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby aᵢ i dᵢ.'],
            output_format: ['Jeden wiersz: numery zadań w kolejności wykonywania.'],
            constraints: ['1 ≤ n ≤ 4000', '0 ≤ aᵢ ≤ 10⁹', '1 ≤ dᵢ ≤ 10⁶'],
            examples: [{ input: '4\n1 2\n2 4\n3 2\n4 1', note: 'W chwili 1 jest tylko zadanie 1 (do chwili 3). W chwili 3 czekają 2 (4 jednostki) i 3 (2) — wybieramy 3 (do 5). W chwili 5 czekają 2 i 4 — najkrótsze jest 4, a na końcu 2.' }],
            hint: R`while (zrobione < n) { while (j < n && zad[j].a <= zegar) { pq.push({zad[j].d, zad[j].nr}); j++; } if (pq.empty()) { zegar = zad[j].a; continue; } auto [d, nr] = pq.top(); pq.pop(); zegar += d; … }. Zegar w long long.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, T, D) => d(Array.from({ length: n }, () => [r.int(0, T), r.int(1, D)]));
                return [d([[5, 3]]), d([[0, 2], [0, 1], [0, 2]]), d([[10, 1], [0, 1]]), los(15, 20, 5), los(4000, 1000000000, 1000000), los(4000, 1000, 1000000), los(4000, 100000000, 1000), los(4000, 0, 3), los(1000, 5000, 10)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 4000) || t.length !== 2 * n + 1) return 'n'; for (let i = 0; i < n; i++) if (!calk(t[1 + 2 * i], 0, 1e9) || !calk(t[2 + 2 * i], 1, 1e6)) return 'zadanie'; return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const z = Array.from({ length: n }, (_, i) => ({ a: t[1 + 2 * i], d: t[2 + 2 * i], nr: i + 1 })).sort((x, y) => x.a - y.a || x.nr - y.nr);
                const pq = new PQ(wiecejKrotka), out = [];
                let zegar = 0, j = 0;
                while (out.length < n) {
                    while (j < n && z[j].a <= zegar) { pq.push([z[j].d, z[j].nr]); j++; }
                    if (pq.empty()) { zegar = z[j].a; continue; }
                    const [d, nr] = pq.pop();
                    zegar += d;
                    out.push(nr);
                }
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zadanie {
    long long a, d;
    int nr;
};
int main() {
    int n;
    cin >> n;
    vector<Zadanie> zad(n);
    for (int i = 0; i < n; i++) {
        cin >> zad[i].a >> zad[i].d;
        zad[i].nr = i + 1;
    }
    sort(zad.begin(), zad.end(), [](const Zadanie &x, const Zadanie &y) {
        if (x.a != y.a) return x.a < y.a;
        return x.nr < y.nr;
    });
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    long long zegar = 0;
    int j = 0, zrobione = 0;
    while (zrobione < n) {
        while (j < n && zad[j].a <= zegar) {
            pq.push({zad[j].d, zad[j].nr});
            j++;
        }
        if (pq.empty()) {
            zegar = zad[j].a;
            continue;
        }
        auto [d, nr] = pq.top();
        pq.pop();
        zegar += d;
        cout << nr << " ";
        zrobione++;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-terminy-i-zyski', krok: 7, level: 'srednie',
            title: 'Zlecenia z terminami',
            short: 'Zlecenia posortowane po terminie, a w kopcu minimum — zyski wybranych. Gdy wybranych jest więcej niż dni, wyrzuć najmniej opłacalne.',
            tags: ['zachłannie z kopcem', 'sortowanie po terminie', 'wymiana na lepsze'],
            statement: ['Masz n zleceń. Każde zajmuje dokładnie jeden dzień, zlecenie i trzeba wykonać najpóźniej w dniu dᵢ (dni liczymy od 1), a za jego wykonanie dostajesz pᵢ złotych. Dziennie możesz wykonać najwyżej jedno zlecenie. Ile najwięcej możesz zarobić?',
                'Posortuj zlecenia po terminie i przeglądaj je po kolei, trzymając w kopcu minimum zyski zleceń, które na razie bierzesz. Wrzuć zysk każdego zlecenia; jeśli w kopcu jest teraz więcej zleceń niż dᵢ (tyle dni jest do terminu), wyrzuć najmniej opłacalne. Na końcu w kopcu są zlecenia, które opłaca się wykonać.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby dᵢ i pᵢ.'],
            output_format: ['Jedna liczba — największy możliwy zarobek.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ dᵢ ≤ 10⁵', '1 ≤ pᵢ ≤ 10⁶'],
            examples: [{ input: '5\n2 100\n1 19\n2 27\n1 25\n3 15', note: 'Najlepiej: zlecenie za 100 i za 27 w dniach 1 i 2, a w dniu 3 — za 15. Razem 142. Zlecenia za 19 i 25 musiałyby być wykonane w dniu 1, a ten dzień lepiej wykorzystać inaczej.' }],
            hint: R`sort po d. for (auto [d, p] : z) { pq.push(p); if (pq.size() > d) pq.pop(); }. Na końcu zsumuj kopiec (long long). Wyrzucamy najmniejszy zysk — także wtedy, gdy to zysk właśnie dodanego zlecenia.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, D, Pm) => d(Array.from({ length: n }, () => [r.int(1, D), r.int(1, Pm)]));
                return [d([[1, 5]]), d([[1, 5], [1, 7]]), d([[3, 1], [3, 2], [3, 3], [3, 4]]), los(15, 5, 50), los(5000, 100000, 1000000), los(5000, 50, 1000000), los(5000, 3000, 1000000), los(5000, 1, 1000000), los(2000, 100000, 1)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 5000) || t.length !== 2 * n + 1) return 'n'; for (let i = 0; i < n; i++) if (!calk(t[1 + 2 * i], 1, 1e5) || !calk(t[2 + 2 * i], 1, 1e6)) return 'zlecenie'; return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const z = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]).sort((a, b) => a[0] - b[0]);
                const pq = new PQ(wiecej);
                for (const [d, p] of z) { pq.push(p); if (pq.size > d) pq.pop(); }
                return String(pq.h.reduce((a, b) => a + b, 0));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> z(n);
    for (auto &[d, p] : z) cin >> d >> p;
    sort(z.begin(), z.end());
    priority_queue<int, vector<int>, greater<int>> pq;
    for (auto [d, p] : z) {
        pq.push(p);
        if ((int)pq.size() > d) pq.pop();
    }
    long long suma = 0;
    while (!pq.empty()) {
        suma += pq.top();
        pq.pop();
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-kursy', krok: 7, level: 'srednie',
            title: 'Kursy online',
            short: 'Jak najwięcej kursów przed terminami: po terminie rosnąco, a gdy czas się nie mieści — wyrzuć najdłuższy kurs z kopca maksimum.',
            tags: ['zachłannie z kopcem', 'kopiec maksimum długości', 'suma czasu'],
            statement: ['Na platformie jest n kursów online. Kurs i trwa tᵢ dni i trzeba go skończyć najpóźniej w dniu lᵢ. Kursy robisz po jednym, bez przerw między nimi, zaczynając w dniu 1 (kurs trwający 3 dni zaczęty jako pierwszy kończy się w dniu 3). Ile najwięcej kursów możesz ukończyć w terminie?',
                'Posortuj kursy po terminie lᵢ. Przeglądaj je po kolei: dodaj kurs (czas += tᵢ, długość do kopca maksimum), a jeśli łączny czas przekroczył lᵢ, wyrzuć z kopca najdłuższy kurs i odejmij jego długość. Liczba kursów w kopcu na końcu to odpowiedź.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby tᵢ i lᵢ.'],
            output_format: ['Jedna liczba — największa liczba kursów.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ tᵢ ≤ 10⁶', '1 ≤ lᵢ ≤ 10⁹'],
            examples: [{ input: '4\n100 200\n200 1300\n1000 1250\n2000 3200', note: 'Kursy 1, 3 i 2 kończą się w dniach 100, 1100 i 1300 — wszystkie w terminie. Czwarty skończyłby się w dniu 3300, za późno. Odpowiedź 3.' }],
            hint: R`sort po l. for (…) { czas += t; pq.push(t); if (czas > l) { czas -= pq.top(); pq.pop(); } }. Czas sumuje tysiące kursów po milion dni — long long.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, T, L) => d(Array.from({ length: n }, () => [r.int(1, T), r.int(1, L)]));
                return [d([[5, 4]]), d([[5, 5]]), d([[1, 2], [2, 3]]), d([[3, 2], [4, 3]]), los(15, 10, 40), los(5000, 1000000, 1000000000), los(5000, 1000000, 100000000), los(5000, 1000, 1000000), los(5000, 1000000, 1000000)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 5000) || t.length !== 2 * n + 1) return 'n'; for (let i = 0; i < n; i++) if (!calk(t[1 + 2 * i], 1, 1e6) || !calk(t[2 + 2 * i], 1, 1e9)) return 'kurs'; return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const k = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]).sort((a, b) => a[1] - b[1]);
                const pq = new PQ(mniej);
                let czas = 0;
                for (const [d, l] of k) { czas += d; pq.push(d); if (czas > l) czas -= pq.pop(); }
                return String(pq.size);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> k(n);
    for (auto &[t, l] : k) cin >> t >> l;
    sort(k.begin(), k.end(), [](const pair<long long, long long> &a, const pair<long long, long long> &b) { return a.second < b.second; });
    priority_queue<long long> pq;
    long long czas = 0;
    for (auto [t, l] : k) {
        czas += t;
        pq.push(t);
        if (czas > l) {
            czas -= pq.top();
            pq.pop();
        }
    }
    cout << pq.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-tankowanie', krok: 7, level: 'trudne',
            title: 'Tankowanie',
            short: 'Jedź, ile się da, a gdy paliwa zabraknie — „cofnij się” i zatankuj na największej z mijanych stacji. Kopiec maksimum paliwa.',
            tags: ['zachłannie z kopcem', 'decyzja na później', 'long long'],
            statement: ['Samochód jedzie po prostej drodze do celu odległego o D kilometrów i spala jeden litr na kilometr. Na starcie ma F litrów, a bak jest tak duży, że zmieści każdą ilość paliwa. Po drodze jest n stacji: stacja i stoi na kilometrze pᵢ i można na niej zatankować dokładnie fᵢ litrów (całe paliwo stacji).',
                'Ile najmniej razy trzeba się zatrzymać na tankowanie, żeby dojechać do celu? Jeśli się nie da, wypisz −1. Dojechanie do stacji albo do celu z pustym bakiem jest w porządku.',
                'Sztuczka: jedź przed siebie i wrzucaj paliwo każdej mijanej stacji do kopca maksimum — tak jakbyś „zapamiętywał” stacje. Gdy paliwa nie starcza do następnego punktu, zatankuj na najlepszej z zapamiętanych stacji (wierzch kopca). Jeśli kopiec jest pusty — nie da się dojechać.'],
            input_format: ['W pierwszym wierszu liczby D, F i n.', 'W każdym z kolejnych n wierszy dwie liczby pᵢ i fᵢ (stacje w kolejności od startu).'],
            output_format: ['Jedna liczba — najmniejsza liczba tankowań albo −1.'],
            constraints: ['1 ≤ D ≤ 10⁹', '0 ≤ F ≤ 10⁹', '0 ≤ n ≤ 5000', '0 < p₁ < p₂ < … < pₙ < D', '1 ≤ fᵢ ≤ 10⁹'],
            examples: [{ input: '100 10 4\n10 60\n20 30\n30 30\n60 40', note: 'Na 10 km kończy się paliwo — tankujemy 60 litrów (dojedziemy do 70 km). Mijamy stacje 20, 30 i 60. Na 70 km znów brakuje — tankujemy największą zapamiętaną (40 litrów, stacja 60). Starcza do 110 km. Dwa tankowania.' },
                { input: '100 1 1\n10 100', note: 'Z jednym litrem nie dojedziemy nawet do pierwszej stacji — odpowiedź −1.' }],
            hint: R`long long paliwo = F; int tank = 0; dla każdego punktu (stacje, a na końcu cel D): while (paliwo < p && !pq.empty()) { paliwo += pq.top(); pq.pop(); tank++; } if (paliwo < p) → −1; potem pq.push(f) dla stacji. paliwo to „do którego kilometra dojedziemy”.`,
            tests: (r) => {
                const d = (D, F, st) => `${D} ${F} ${st.length}` + (st.length ? '\n' + st.map((q) => q.join(' ')).join('\n') : '');
                const los = (D, F, n, fmax) => {
                    const p = new Set();
                    while (p.size < n) p.add(r.int(1, D - 1));
                    return d(D, F, [...p].sort((a, b) => a - b).map((x) => [x, r.int(1, fmax)]));
                };
                return [d(1, 1, []), d(1, 0, []), d(10, 5, [[5, 5]]), d(10, 4, [[5, 5]]), los(100, 10, 10, 30), los(1000000000, 1000000, 5000, 1000000), los(1000000000, 100000000, 5000, 300000), los(1000000000, 1, 5000, 1000000000), los(10000, 100, 5000, 50), los(1000000000, 5000000, 4000, 400000), los(1000, 999, 999, 1)];
            },
            check: (inp) => {
                const t = nums(inp); const [D, F, n] = t;
                if (!calk(D, 1, 1e9) || !calk(F, 0, 1e9) || !calk(n, 0, 5000) || t.length !== 2 * n + 3) return 'dane';
                let prev = 0;
                for (let i = 0; i < n; i++) { const p = t[3 + 2 * i], f = t[4 + 2 * i]; if (!(p > prev && p < D) || !calk(f, 1, 1e9)) return 'stacja'; prev = p; }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const [D, F, n] = t;
                const pq = new PQ(mniej);
                let paliwo = F, tank = 0;
                const punkty = [];
                for (let i = 0; i < n; i++) punkty.push([t[3 + 2 * i], t[4 + 2 * i]]);
                punkty.push([D, 0]);
                for (const [p, f] of punkty) {
                    while (paliwo < p && pq.size) { paliwo += pq.pop(); tank++; }
                    if (paliwo < p) return '-1';
                    if (f) pq.push(f);
                }
                return String(tank);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long D, F;
    int n;
    cin >> D >> F >> n;
    vector<pair<long long, long long>> st(n);
    for (auto &[p, f] : st) cin >> p >> f;
    st.push_back({D, 0});
    priority_queue<long long> pq;
    long long paliwo = F;
    int tank = 0;
    for (auto [p, f] : st) {
        while (paliwo < p && !pq.empty()) {
            paliwo += pq.top();
            pq.pop();
            tank++;
        }
        if (paliwo < p) {
            cout << -1 << "\n";
            return 0;
        }
        if (f > 0) pq.push(f);
    }
    cout << tank << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-leniwe-usuwanie', krok: 7, level: 'srednie',
            title: 'Usuwanie ze środka',
            short: 'Kopiec nie usunie elementu ze środka — ale drugi kopiec „do usunięcia” tak: wyrzucamy dopiero wtedy, gdy taki element wyjdzie na wierzch.',
            tags: ['leniwe usuwanie', 'dwa kopce', 'sprzątanie wierzchu'],
            statement: ['Wykonaj q poleceń na zbiorze liczb (liczby mogą się powtarzać): DODAJ x — dodaj liczbę x; USUN x — usuń jedno wystąpienie liczby x (na pewno jest teraz w zbiorze); MAX — wypisz największą liczbę w zbiorze albo PUSTO.',
                'priority_queue nie umie usunąć elementu ze środka. Zastosuj leniwe usuwanie: trzymaj dwa kopce maksimum — jest (wszystko, co dodano) i usuniete (wszystko, co kazano usunąć). Przy MAX najpierw sprzątaj wierzch: dopóki usuniete nie jest pusty i jego wierzch jest równy wierzchowi jest, zdejmij oba wierzchy. Dopiero potem jest.top() to prawdziwe maksimum.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia MAX jeden wiersz: największa liczba albo PUSTO.'],
            constraints: ['1 ≤ q ≤ 5000', 'Liczby są z przedziału od −10⁹ do 10⁹.', 'Polecenie USUN x dotyczy liczby, która jest w zbiorze.'],
            examples: [{ input: '8\nDODAJ 5\nDODAJ 9\nDODAJ 7\nMAX\nUSUN 9\nMAX\nUSUN 5\nMAX', note: 'Po usunięciu 9 maksimum to 7. Usunięcie piątki niczego nie zmienia na wierzchu — piątka leży w jest dalej, ale zniknie, gdy wyjdzie na wierzch.' }],
            hint: R`void sprzataj() { while (!usuniete.empty() && jest.top() == usuniete.top()) { jest.pop(); usuniete.pop(); } }. Przy MAX: sprzataj(); if (jest.empty()) cout << "PUSTO\n"; else cout << jest.top() << "\n";. Kopce przekaż do funkcji przez &.`,
            tests: (r) => {
                const los = (q, pDod, lo, hi) => {
                    const L = [], zb = [];
                    for (let i = 0; i < q; i++) {
                        const u = r();
                        if (!zb.length || u < pDod) { const x = r.int(lo, hi); zb.push(x); L.push(`DODAJ ${x}`); }
                        else if (u < pDod + 0.25) { const j = r.int(0, zb.length - 1); const x = zb[j]; zb[j] = zb[zb.length - 1]; zb.pop(); L.push(`USUN ${x}`); }
                        else L.push('MAX');
                    }
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nMAX', '3\nDODAJ 4\nUSUN 4\nMAX', '6\nDODAJ 3\nDODAJ 3\nUSUN 3\nMAX\nUSUN 3\nMAX', los(40, 0.45, 1, 9), los(5000, 0.45, -1000000000, 1000000000), los(5000, 0.4, 1, 5), los(5000, 0.6, -100, 100)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 5000) || L.length !== q + 1) return 'q';
                const ile = new Map();
                for (const l of L.slice(1)) {
                    if (l === 'MAX') continue;
                    const m = l.match(/^(DODAJ|USUN) (-?\d+)$/);
                    if (!m || !calk(Number(m[2]), -1e9, 1e9)) return 'polecenie';
                    const x = Number(m[2]);
                    if (m[1] === 'DODAJ') ile.set(x, (ile.get(x) || 0) + 1);
                    else { if (!ile.get(x)) return 'usuwanie nieobecnej'; ile.set(x, ile.get(x) - 1); }
                }
                return null;
            },
            solve: (inp) => {
                const jest = new PQ(mniej), usun = new PQ(mniej), out = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'MAX') {
                        while (usun.size && jest.top() === usun.top()) { jest.pop(); usun.pop(); }
                        out.push(jest.empty() ? 'PUSTO' : jest.top());
                    } else { const [p, x] = l.split(' '); (p === 'DODAJ' ? jest : usun).push(Number(x)); }
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void sprzataj(priority_queue<int> &jest, priority_queue<int> &usuniete) {
    while (!usuniete.empty() && jest.top() == usuniete.top()) {
        jest.pop();
        usuniete.pop();
    }
}
int main() {
    int q;
    cin >> q;
    priority_queue<int> jest, usuniete;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            int x;
            cin >> x;
            jest.push(x);
        } else if (p == "USUN") {
            int x;
            cin >> x;
            usuniete.push(x);
        } else {
            sprzataj(jest, usuniete);
            if (jest.empty()) cout << "PUSTO\n";
            else cout << jest.top() << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-okno-max', krok: 7, level: 'trudne',
            title: 'Maksimum w oknie — leniwie',
            short: 'Pary {wartość, pozycja} w kopcu, a przy odczycie wyrzucamy z wierzchu te, które wypadły już z okna. Milion liczb z generatora.',
            tags: ['leniwe usuwanie', 'para {wartość, pozycja}', 'generator danych'],
            statement: ['Liczby generujesz sam: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m (w long long). Dla każdego okna k kolejnych liczb — od xᵢ₋ₖ₊₁ do xᵢ, dla i od k do n — znajdź największą liczbę w oknie. Wypisz sumę tych n − k + 1 maksimów.',
                'Wrzucaj do kopca pary {xᵢ, i}. Liczby, które wypadły z okna, nie przeszkadzają, dopóki leżą głęboko w kopcu — wyrzucaj je dopiero wtedy, gdy wyjdą na wierzch: dopóki top().second ≤ i − k, pop. (W lekcji Kolejka robiliśmy to samo kolejką monotoniczną — kopiec to drugi, prostszy do wymyślenia sposób.)'],
            input_format: ['Jeden wiersz: liczby n, s, a, b, m oraz k.'],
            output_format: ['Jedna liczba — suma maksimów wszystkich okien.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 1 3 2 10 3', note: 'Ciąg: 1, 5, 7, 3, 1, 5. Okna po 3: (1 5 7) → 7, (5 7 3) → 7, (7 3 1) → 7, (3 1 5) → 5. Suma 26.' }],
            hint: R`${KOD_GEN} priority_queue<pair<long long, int>> pq; for (int i = 0; i < n; i++) { pq.push({x[i], i}); if (i >= k - 1) { while (pq.top().second <= i - k) pq.pop(); suma += pq.top().first; } }.`,
            tests: () => ['1 5 0 0 10 1', '6 1 3 2 10 3', '10 3 7 1 100 10', '1000 7 31 3 1000 50', '1000000 12345 48271 0 999999937 1000', '1000000 1 16807 11 1000000000 1', '1000000 999 69621 3 999999937 500000', '1000000 5 21 7 1000000 1000000', '1000000 3 41 3 1000000 77'],
            check: (inp) => { const t = nums(inp); return t.length === 6 && dobryGen(t, 0, 1e6, 1e9) && calk(t[5], 1, t[0]) ? null : 'dane'; },
            solve: (inp) => {
                const [n, s, a, b, m, k] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const d = new Int32Array(n);
                let hh = 0, tt = 0, suma = 0;
                for (let i = 0; i < n; i++) {
                    while (tt > hh && x[d[tt - 1]] <= x[i]) tt--;
                    d[tt++] = i;
                    if (d[hh] <= i - k) hh++;
                    if (i >= k - 1) suma += x[d[hh]];
                }
                return String(suma);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m, k;
    cin >> n >> s >> a >> b >> m >> k;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    priority_queue<pair<long long, int>> pq;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        pq.push({x[i], i});
        if (i >= k - 1) {
            while (pq.top().second <= i - k) pq.pop();
            suma += pq.top().first;
        }
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · algorytm Dijkstry
        {
            id: 'kop-odleglosci', krok: 8, level: 'latwe',
            title: 'Odległości od stolicy',
            short: 'Pierwszy Dijkstra: kopiec minimum par {odległość, miasto}, a przy zdjęciu nieaktualnego wpisu — continue.',
            tags: ['Dijkstra', 'listy sąsiadów z wagami', 'long long'],
            statement: ['W kraju jest n miast połączonych m drogami. Każda droga łączy dwa miasta, można nią jechać w obie strony i ma podaną długość. Stolicą jest miasto 1. Dla każdego miasta wypisz długość najkrótszej trasy ze stolicy albo −1, jeśli do miasta nie da się dojechać.',
                'Zastosuj algorytm Dijkstry: dist[1] = 0, a do kopca minimum wrzuć {0, 1}. Dopóki kopiec nie jest pusty: zdejmij {d, v}; jeśli d > dist[v], to wpis jest nieaktualny — pomiń go; w przeciwnym razie dla każdej drogi v → u o długości w, jeśli dist[v] + w < dist[u], popraw dist[u] i wrzuć {dist[u], u} do kopca.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w — droga między miastami a i b o długości w.'],
            output_format: ['Jeden wiersz: n liczb — odległości miast 1, 2, …, n od stolicy (albo −1).'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ w ≤ 10⁶', 'Między dwoma miastami jest najwyżej jedna droga i żadna droga nie prowadzi z miasta do niego samego.'],
            examples: [{ input: '5 5\n1 2 7\n1 3 2\n3 2 3\n2 4 1\n3 4 9', note: 'Do miasta 2 lepiej jechać przez 3: 2 + 3 = 5 zamiast 7. Do 4: przez 3 i 2, czyli 5 + 1 = 6. Do miasta 5 nie prowadzi żadna droga.' }],
            hint: R`vector<vector<pair<int, int>>> g(n + 1); g[a].push_back({b, w}); g[b].push_back({a, w});. vector<long long> dist(n + 1, INF); gdzie const long long INF = 1e18;. Kopiec: priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>>. Na końcu: dist[v] == INF ? -1 : dist[v].`,
            tests: (r) => {
                const g = (n, m, spojny, wmax) => grafWTxt(n, losGrafW(r, n, m, 1, wmax, { spojny }));
                return [grafWTxt(2, []), grafWTxt(2, [[2, 1, 5]]), grafWTxt(3, [[1, 2, 1], [2, 3, 1], [1, 3, 3]]), g(10, 15, true, 20), g(2000, 5000, true, 1000000), g(2000, 3000, false, 1000000), g(2000, 5000, true, 3), g(300, 299, true, 1000000), g(50, 1225, true, 1000000)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return t.length === 3 * m + 2 && grafOk(t, 2, n, m, 2000, 5000, 1, 1e6) ? null : 'graf'; },
            solve: (inp) => { const t = nums(inp); const { dist } = dijkstra(listyW(t[0], czytajGraf(t, 2, t[1])), [1]); return dist.slice(1).map(dTxt).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
        g[b].push_back({a, w});
    }
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[1] = 0;
    pq.push({0, 1});
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : g[v]) {
            if (dist[v] + w < dist[u]) {
                dist[u] = dist[v] + w;
                pq.push({dist[u], u});
            }
        }
    }
    for (int v = 1; v <= n; v++) cout << (dist[v] == INF ? -1 : dist[v]) << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-wiadomosc', krok: 8, level: 'latwe',
            title: 'Wiadomość w sieci',
            short: 'Łącza w jedną stronę z czasami przesyłu. Kiedy wiadomość dotrze do wszystkich komputerów? Największa odległość — albo −1.',
            tags: ['graf skierowany', 'Dijkstra', 'maksimum odległości'],
            statement: ['W sieci jest n komputerów i m łączy. Łącze a → b przesyła wiadomość tylko w jedną stronę, z komputera a do b, i zajmuje to w milisekund. Komputer s wysyła wiadomość w chwili 0, a każdy komputer, który ją dostanie, od razu przesyła ją dalej wszystkimi swoimi łączami.',
                'Po ilu milisekundach wiadomość dotrze do wszystkich komputerów? Jeśli do któregoś nie dotrze nigdy, wypisz −1. Odpowiedź to największa z odległości od s policzonych algorytmem Dijkstry — w grafie skierowanym każde łącze dopisujesz tylko do listy komputera a.'],
            input_format: ['W pierwszym wierszu liczby n, m i s.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w — łącze a → b.'],
            output_format: ['Jedna liczba — czas dotarcia do wszystkich albo −1.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ s ≤ n', '1 ≤ w ≤ 10⁶', 'Każde łącze a → b występuje najwyżej raz, a ≠ b.'],
            examples: [{ input: '4 4 2\n2 1 1\n2 3 1\n3 4 1\n1 4 5', note: 'Wiadomość dociera do 1 i 3 po 1 ms, a do 4 po 2 ms (przez 3). Odpowiedź 2.' },
                { input: '3 2 1\n1 2 4\n3 2 1', note: 'Do komputera 3 nie prowadzi żadne łącze z 1 — odpowiedź −1.' }],
            hint: R`Tylko g[a].push_back({b, w}); — bez krawędzi powrotnej. Po Dijkstrze: long long naj = 0; for (v) { if (dist[v] == INF) → −1; naj = max(naj, dist[v]); }.`,
            tests: (r) => {
                const g = (n, m, spojny, wmax, s) => grafWTxt(n, losGrafW(r, n, m, 1, wmax, { spojny, skierowany: true })).replace(/^(\d+ \d+)/, `$1 ${s}`);
                const pelny = (n) => { const k = []; for (let i = 2; i <= n; i++) k.push([1, i, r.int(1, 1000000)]); for (let i = 2; i < n; i++) k.push([i, i + 1, r.int(1, 1000)]); return grafWTxt(n, r.shuffle(k)).replace(/^(\d+ \d+)/, '$1 1'); };
                return ['2 1 1\n1 2 7', '2 1 2\n1 2 7', g(10, 30, true, 10, 1), g(2000, 5000, false, 1000000, 1), pelny(2000), g(500, 5000, false, 1000000, 17), g(2000, 5000, false, 1000000, 2000)];
            },
            check: (inp) => { const t = nums(inp); const [n, m, s] = t; if (!calk(s, 1, n) || t.length !== 3 * m + 3 || !grafOk(t, 3, n, m, 2000, 5000, 1, 1e6)) return 'graf'; const k = new Set(); for (let i = 0; i < m; i++) { const key = t[3 + 3 * i] * 5000 + t[4 + 3 * i]; if (k.has(key)) return 'powtórzone łącze'; k.add(key); } return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0], m = t[1], s = t[2];
                const { dist } = dijkstra(listyW(n, czytajGraf(t, 3, m), true), [s]);
                const d = dist.slice(1);
                return String(d.some((x) => x === Infinity) ? -1 : Math.max(...d));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
int main() {
    int n, m, s;
    cin >> n >> m >> s;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
    }
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[s] = 0;
    pq.push({0, s});
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u]) {
                dist[u] = d + w;
                pq.push({dist[u], u});
            }
        }
    }
    long long naj = 0;
    for (int v = 1; v <= n; v++) {
        if (dist[v] == INF) {
            cout << -1 << "\n";
            return 0;
        }
        naj = max(naj, dist[v]);
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-trasa', krok: 8, level: 'srednie',
            title: 'Najkrótsza trasa',
            short: 'Nie tylko długość, ale i sama trasa: przy każdej poprawie dist[u] zapamiętaj, skąd przyszliśmy — prev[u] = v.',
            tags: ['odtwarzanie trasy', 'tablica poprzedników', 'odwracanie'],
            statement: ['W kraju jest n miast i m dwukierunkowych dróg z długościami. Znajdź najkrótszą trasę z miasta 1 do miasta n: wypisz jej długość, a w drugim wierszu — kolejne miasta na trasie, od 1 do n. W testach najkrótsza trasa jest zawsze tylko jedna. Jeśli do miasta n nie da się dojechać, wypisz tylko −1.',
                'W algorytmie Dijkstry przy każdej poprawie dist[u] przez miasto v zapisz prev[u] = v — skąd przyjechaliśmy. Na końcu idź od n po prev aż do 1: dostaniesz trasę od końca, więc ją odwróć.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w.'],
            output_format: ['W pierwszym wierszu długość trasy (albo −1).', 'W drugim wierszu miasta na trasie (tylko gdy trasa istnieje).'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ w ≤ 10⁶', 'Najkrótsza trasa z 1 do n (jeśli istnieje) jest tylko jedna.'],
            examples: [{ input: '5 6\n1 2 2\n2 5 5\n1 3 1\n3 4 1\n4 5 3\n2 3 4', note: 'Trasa 1 → 3 → 4 → 5 ma długość 1 + 1 + 3 = 5, a 1 → 2 → 5 — długość 7.' }],
            hint: R`vector<int> prev(n + 1, 0); — przy poprawie: dist[u] = d + w; prev[u] = v;. Trasa: vector<int> t; for (int v = n; v != 0; v = prev[v]) t.push_back(v); reverse(t.begin(), t.end());. prev[1] zostaje 0, więc pętla kończy się po dojściu do 1.`,
            tests: (r) => {
                const jedna = (n, m, wmax, spojny) => {
                    for (let p = 0; p < 200; p++) {
                        const k = losGrafW(r, n, m, 1, wmax, { spojny });
                        const { dist, ile } = dijkstra(listyW(n, k), [1]);
                        if (dist[n] === Infinity || ile[n] === 1) return grafWTxt(n, k);
                    }
                    throw new Error('kop-trasa: brak testu z jedną najkrótszą trasą');
                };
                return [grafWTxt(2, [[1, 2, 9]]), grafWTxt(3, [[1, 2, 4]]), jedna(10, 15, 50, true), jedna(2000, 5000, 1000000, true), jedna(2000, 2500, 1000000, true), jedna(2000, 1999, 1000000, true), jedna(1000, 1500, 1000000, false), jedna(100, 4950, 1000000, true)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m] = t;
                if (t.length !== 3 * m + 2 || !grafOk(t, 2, n, m, 2000, 5000, 1, 1e6)) return 'graf';
                const { dist, ile } = dijkstra(listyW(n, czytajGraf(t, 2, m)), [1]);
                return dist[n] === Infinity || ile[n] === 1 ? null : 'więcej niż jedna najkrótsza trasa';
            },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const { dist, prev } = dijkstra(listyW(n, czytajGraf(t, 2, t[1])), [1]);
                if (dist[n] === Infinity) return '-1';
                return dist[n] + '\n' + trasa(prev, 1, n).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
        g[b].push_back({a, w});
    }
    vector<long long> dist(n + 1, INF);
    vector<int> prev(n + 1, 0);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[1] = 0;
    pq.push({0, 1});
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u]) {
                dist[u] = d + w;
                prev[u] = v;
                pq.push({dist[u], u});
            }
        }
    }
    if (dist[n] == INF) {
        cout << -1 << "\n";
        return 0;
    }
    cout << dist[n] << "\n";
    vector<int> t;
    for (int v = n; v != 0; v = prev[v]) t.push_back(v);
    reverse(t.begin(), t.end());
    for (int v : t) cout << v << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-bagna', krok: 8, level: 'srednie',
            title: 'Przejście przez bagna',
            short: 'Dijkstra na planszy: każde pole kosztuje swoją cyfrę, a z pola idziemy w cztery strony. BFS tu nie wystarczy — kroki kosztują różnie.',
            tags: ['Dijkstra na planszy', 'para {koszt, {w, k}}', 'koszt pola'],
            statement: ['Bagno to plansza h × w, a w każdym polu jest cyfra od 1 do 9 — tyle sił kosztuje wejście na to pole. Zaczynasz w lewym górnym rogu i chcesz dojść do prawego dolnego, chodząc w górę, w dół, w lewo i w prawo. Koszt drogi to suma cyfr wszystkich pól, przez które przechodzisz — razem z polem startowym i końcowym.',
                'Wypisz najmniejszy koszt. Plansza może mieć 90 000 pól, a kroki kosztują różnie — zwykły BFS z lekcji Kolejka nie znajdzie najtańszej drogi, ale Dijkstra na polach planszy tak. Odległością pola jest najmniejszy koszt dojścia do niego.'],
            input_format: ['W pierwszym wierszu liczby h i w.', 'W każdym z kolejnych h wierszy w cyfr bez spacji.'],
            output_format: ['Jedna liczba — najmniejszy koszt przejścia.'],
            constraints: ['1 ≤ h, w ≤ 300', 'Każda cyfra jest od 1 do 9.'],
            examples: [{ input: '5 4\n1111\n9991\n1111\n1999\n1111', note: 'Najtańsza droga to zygzak: cały pierwszy wiersz w prawo, w dół prawym brzegiem, cały trzeci wiersz w lewo, w dół lewym brzegiem i ostatni wiersz w prawo — 14 pól po 1. Każda krótsza droga musi wejść na dziewiątkę i kosztuje co najmniej 16.' }],
            hint: R`vector<vector<long long>> dist(h, vector<long long>(w, INF)); dist[0][0] = plansza[0][0] - '0';. W kopcu trzymaj {koszt, {r, c}}. Sąsiedzi: dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1} — wejście na (nr, nc) kosztuje plansza[nr][nc] - '0'.`,
            tests: (r) => {
                const tekst = (k) => `${k.length} ${k[0].length}\n${k.map((w) => w.join('')).join('\n')}`;
                const waz = (n) => { const k = Array.from({ length: n }, () => Array(n).fill(9)); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i % 4 === 1 && j < n - 1 || i % 4 === 3 && j > 0) k[i][j] = 9; else k[i][j] = 1; return k; };
                return ['1 1\n5', '1 3\n123', '2 2\n19\n11', tekst(losKoszty(r, 8, 10, 1, 9)), tekst(losKoszty(r, 300, 300, 1, 9)), tekst(losKoszty(r, 300, 300, 1, 2)), tekst(waz(301 - 1)), tekst(losKoszty(r, 1, 300, 1, 9)), tekst(losKoszty(r, 300, 1, 1, 9))];
            },
            check: (inp) => {
                const L = linie(inp);
                const [hh, ww] = L[0].split(' ').map(Number);
                if (!calk(hh, 1, 300) || !calk(ww, 1, 300) || L.length !== hh + 1) return 'h w';
                return L.slice(1).every((l) => new RegExp(`^[1-9]{${ww}}$`).test(l)) ? null : 'plansza';
            },
            solve: (inp) => {
                const L = linie(inp);
                const [hh, ww] = L[0].split(' ').map(Number);
                const k = L.slice(1).map((l) => l.split('').map(Number));
                const dist = Array.from({ length: hh }, () => new Array(ww).fill(Infinity));
                const pq = new PQ(wiecejKrotka);
                dist[0][0] = k[0][0];
                pq.push([k[0][0], 0, 0]);
                while (pq.size) {
                    const [d, i, j] = pq.pop();
                    if (d > dist[i][j]) continue;
                    for (const [di, dj] of D4) {
                        const a = i + di, b = j + dj;
                        if (a < 0 || b < 0 || a >= hh || b >= ww) continue;
                        if (d + k[a][b] < dist[a][b]) { dist[a][b] = d + k[a][b]; pq.push([dist[a][b], a, b]); }
                    }
                }
                return String(dist[hh - 1][ww - 1]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
int main() {
    int h, w;
    cin >> h >> w;
    vector<string> p(h);
    for (auto &s : p) cin >> s;
    vector<vector<long long>> dist(h, vector<long long>(w, INF));
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    dist[0][0] = p[0][0] - '0';
    pq.push({dist[0][0], {0, 0}});
    while (!pq.empty()) {
        auto [d, pole] = pq.top();
        pq.pop();
        auto [r, c] = pole;
        if (d > dist[r][c]) continue;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nc < 0 || nr >= h || nc >= w) continue;
            long long nd = d + (p[nr][nc] - '0');
            if (nd < dist[nr][nc]) {
                dist[nr][nc] = nd;
                pq.push({nd, {nr, nc}});
            }
        }
    }
    cout << dist[h - 1][w - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-szpitale', krok: 8, level: 'srednie',
            title: 'Najbliższy szpital',
            short: 'Dijkstra z wielu startów naraz: wszystkie szpitale wchodzą do kopca z odległością 0, a jeden przebieg liczy odległość do najbliższego.',
            tags: ['wiele startów', 'Dijkstra', 'jeden przebieg'],
            statement: ['W kraju jest n miast połączonych m dwukierunkowymi drogami z długościami. W k miastach są szpitale. Dla każdego miasta wypisz odległość do najbliższego szpitala (w mieście ze szpitalem — 0), albo −1, jeśli z tego miasta do żadnego szpitala nie da się dojechać.',
                'Nie trzeba uruchamiać Dijkstry osobno z każdego szpitala. Wrzuć wszystkie szpitale do kopca od razu, każdy z odległością 0 — to tak, jakby fala ruszała ze wszystkich szpitali jednocześnie. Jeden przebieg Dijkstry da odległość do najbliższego.'],
            input_format: ['W pierwszym wierszu liczby n, m i k.', 'W drugim wierszu k różnych numerów miast ze szpitalami.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w.'],
            output_format: ['Jeden wiersz: n odległości (albo −1).'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ k ≤ n', '1 ≤ w ≤ 10⁶'],
            examples: [{ input: '6 5 2\n1 6\n1 2 4\n2 3 1\n3 4 1\n4 5 3\n5 6 2', note: 'Miasta 2 i 3 są najbliżej szpitala w mieście 1 (4 i 5), a miasta 4 i 5 — szpitala w mieście 6 (5 i 2).' }],
            hint: R`for (int s : szpitale) { dist[s] = 0; pq.push({0, s}); }. Reszta to zwykły Dijkstra. To samo robiliśmy w lekcji Kolejka z BFS z wielu startów.`,
            tests: (r) => {
                const d = (n, kraw, sz) => `${n} ${kraw.length} ${sz.length}\n${sz.join(' ')}` + (kraw.length ? '\n' + kraw.map((e) => e.join(' ')).join('\n') : '');
                const los = (n, m, k, spojny, wmax) => d(n, losGrafW(r, n, m, 1, wmax, { spojny }), r.shuffle(Array.from({ length: n }, (_, i) => i + 1)).slice(0, k));
                return [d(2, [], [1]), d(3, [[1, 2, 5], [2, 3, 5]], [1, 3]), los(10, 12, 2, true, 20), los(2000, 5000, 10, true, 1000000), los(2000, 4000, 1, true, 1000000), los(2000, 3000, 50, false, 1000000), los(2000, 5000, 2000, true, 1000000), los(500, 600, 3, false, 5)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m, k] = t;
                if (!calk(k, 1, n) || t.length !== 3 + k + 3 * m) return 'dane';
                const sz = t.slice(3, 3 + k);
                if (new Set(sz).size !== k || !sz.every((x) => calk(x, 1, n))) return 'szpitale';
                return grafOk(t, 3 + k, n, m, 2000, 5000, 1, 1e6) ? null : 'graf';
            },
            solve: (inp) => {
                const t = nums(inp); const [n, m, k] = t;
                const { dist } = dijkstra(listyW(n, czytajGraf(t, 3 + k, m)), t.slice(3, 3 + k));
                return dist.slice(1).map(dTxt).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<int> szpitale(k);
    for (int &s : szpitale) cin >> s;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
        g[b].push_back({a, w});
    }
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    for (int s : szpitale) {
        dist[s] = 0;
        pq.push({0, s});
    }
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u]) {
                dist[u] = d + w;
                pq.push({dist[u], u});
            }
        }
    }
    for (int v = 1; v <= n; v++) cout << (dist[v] == INF ? -1 : dist[v]) << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-przez-sklep', krok: 8, level: 'srednie',
            title: 'Przez sklep do szkoły',
            short: 'Najkrótsza droga z przystankiem po drodze: dist(dom → sklep) + dist(sklep → szkoła). Dijkstra jako funkcja, uruchomiona dwa razy.',
            tags: ['Dijkstra jako funkcja', 'dwa przebiegi', 'graf skierowany'],
            statement: ['Miasto ma n skrzyżowań i m ulic jednokierunkowych z długościami. Ola mieszka przy skrzyżowaniu 1, szkoła jest przy skrzyżowaniu n, a po drodze Ola musi zajść do sklepu przy skrzyżowaniu s. Jaka jest długość najkrótszej takiej drogi? Jeśli się nie da, wypisz −1.',
                'Najkrótsza droga przez sklep składa się z najkrótszej drogi z domu do sklepu i najkrótszej drogi ze sklepu do szkoły. Napisz Dijkstrę jako funkcję, która dostaje graf i start, a oddaje vector odległości — i wywołaj ją dwa razy: z 1 i z s.'],
            input_format: ['W pierwszym wierszu liczby n, m i s.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w — ulica a → b.'],
            output_format: ['Jedna liczba — długość drogi albo −1.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ s ≤ n', '1 ≤ w ≤ 10⁶', 'Każda ulica a → b występuje najwyżej raz, a ≠ b.'],
            examples: [{ input: '4 5 3\n1 2 1\n2 4 1\n1 3 5\n3 4 5\n2 3 1', note: 'Najkrótsza droga do szkoły (1 → 2 → 4) omija sklep. Przez sklep: 1 → 2 → 3 (2) i 3 → 4 (5) — razem 7.' }],
            hint: R`vector<long long> dijkstra(const vector<vector<pair<int, int>>> &g, int s) { … return dist; }. Potem: auto d1 = dijkstra(g, 1), ds = dijkstra(g, s); if (d1[s] == INF || ds[n] == INF) → −1, inaczej d1[s] + ds[n].`,
            tests: (r) => {
                const g = (n, m, spojny, s) => grafWTxt(n, losGrafW(r, n, m, 1, 1000000, { spojny, skierowany: true })).replace(/^(\d+ \d+)/, `$1 ${s}`);
                return ['2 1 1\n1 2 3', '2 1 2\n1 2 3', '2 1 2\n2 1 3', '3 2 2\n1 3 1\n3 2 1', g(10, 30, true, 5), g(2000, 5000, false, 1000), g(2000, 5000, false, 2), g(300, 5000, false, 150), g(2000, 4000, false, 1999)];
            },
            check: (inp) => { const t = nums(inp); const [n, m, s] = t; if (!calk(s, 1, n) || t.length !== 3 * m + 3 || !grafOk(t, 3, n, m, 2000, 5000, 1, 1e6)) return 'graf'; const k = new Set(); for (let i = 0; i < m; i++) { const key = t[3 + 3 * i] * 5000 + t[4 + 3 * i]; if (k.has(key)) return 'powtórzona ulica'; k.add(key); } return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0], m = t[1], s = t[2];
                const g = listyW(n, czytajGraf(t, 3, m), true);
                const a = dijkstra(g, [1]).dist[s], b = dijkstra(g, [s]).dist[n];
                return String(a === Infinity || b === Infinity ? -1 : a + b);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
vector<long long> dijkstra(const vector<vector<pair<int, int>>> &g, int s) {
    vector<long long> dist(g.size(), INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[s] = 0;
    pq.push({0, s});
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u]) {
                dist[u] = d + w;
                pq.push({dist[u], u});
            }
        }
    }
    return dist;
}
int main() {
    int n, m, s;
    cin >> n >> m >> s;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
    }
    vector<long long> d1 = dijkstra(g, 1), ds = dijkstra(g, s);
    if (d1[s] == INF || ds[n] == INF) cout << -1 << "\n";
    else cout << d1[s] + ds[n] << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-ile-najkrotszych', krok: 8, level: 'trudne',
            title: 'Ile jest najkrótszych dróg',
            short: 'Obok dist liczymy cnt: poprawa odległości przepisuje licznik, a remis go dodaje. Wynik modulo 10⁹ + 7.',
            tags: ['liczenie dróg', 'remis odległości', 'modulo'],
            statement: ['W kraju jest n miast i m dwukierunkowych dróg z długościami (każda długość to co najmniej 1). Ile jest różnych najkrótszych tras z miasta 1 do miasta n? Wypisz długość najkrótszej trasy i liczbę takich tras modulo 10⁹ + 7. Jeśli do miasta n nie da się dojechać, wypisz −1.',
                'Obok dist trzymaj cnt[v] — liczbę najkrótszych tras do v (cnt[1] = 1). Gdy przez v znajdziesz krótszą drogę do u, ustaw cnt[u] = cnt[v]; gdy znajdziesz drogę tak samo długą, dodaj: cnt[u] = (cnt[u] + cnt[v]) mod 10⁹ + 7. Dzięki temu, że długości dróg są dodatnie, każde miasto zdejmowane z kopca ma już policzony ostateczny cnt.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w.'],
            output_format: ['Jeden wiersz: długość najkrótszej trasy i liczba tras modulo 10⁹ + 7 — albo −1.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ w ≤ 10⁶'],
            examples: [{ input: '4 5\n1 2 1\n1 3 1\n2 4 1\n3 4 1\n1 4 3', note: 'Trasy 1 → 2 → 4 i 1 → 3 → 4 mają długość 2. Bezpośrednia droga 1 → 4 jest dłuższa. Odpowiedź: 2 2.' }],
            hint: R`if (d + w < dist[u]) { dist[u] = d + w; cnt[u] = cnt[v]; pq.push({dist[u], u}); } else if (d + w == dist[u]) { cnt[u] = (cnt[u] + cnt[v]) % MOD; }. Przy remisie niczego nie wrzucamy do kopca.`,
            tests: (r) => {
                return [grafWTxt(2, []), grafWTxt(2, [[1, 2, 5]]), grafWTxt(4, [[1, 2, 1], [1, 3, 1], [2, 4, 1], [3, 4, 1], [1, 4, 2]]),
                    grafWTxt(12, kratka(r, 3, 4, 1, 1)), grafWTxt(2000, kratka(r, 40, 50, 1, 1)), grafWTxt(2000, kratka(r, 25, 80, 1, 2, 0.3)), grafWTxt(1800, kratka(r, 30, 60, 1, 1, 0.5)),
                    grafWTxt(2000, losGrafW(r, 2000, 5000, 1, 3, { spojny: true })), grafWTxt(2000, losGrafW(r, 2000, 5000, 1, 1000000, { spojny: true }))];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return t.length === 3 * m + 2 && grafOk(t, 2, n, m, 2000, 5000, 1, 1e6) ? null : 'graf'; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const g = listyW(n, czytajGraf(t, 2, t[1]));
                const MOD = 1000000007;
                const dist = new Array(n + 1).fill(Infinity), cnt = new Array(n + 1).fill(0), pq = new PQ(wiecejKrotka);
                dist[1] = 0; cnt[1] = 1; pq.push([0, 1]);
                while (pq.size) {
                    const [d, v] = pq.pop();
                    if (d > dist[v]) continue;
                    for (const [u, w] of g[v]) {
                        if (d + w < dist[u]) { dist[u] = d + w; cnt[u] = cnt[v]; pq.push([dist[u], u]); }
                        else if (d + w === dist[u]) cnt[u] = (cnt[u] + cnt[v]) % MOD;
                    }
                }
                return dist[n] === Infinity ? '-1' : `${dist[n]} ${cnt[n]}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 1e18;
const long long MOD = 1000000007;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
        g[b].push_back({a, w});
    }
    vector<long long> dist(n + 1, INF), cnt(n + 1, 0);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[1] = 0;
    cnt[1] = 1;
    pq.push({0, 1});
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u]) {
                dist[u] = d + w;
                cnt[u] = cnt[v];
                pq.push({dist[u], u});
            } else if (d + w == dist[u]) {
                cnt[u] = (cnt[u] + cnt[v]) % MOD;
            }
        }
    }
    if (dist[n] == INF) cout << -1 << "\n";
    else cout << dist[n] << " " << cnt[n] << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-bilet-ze-znizka', krok: 8, level: 'trudne',
            title: 'Bilet ze zniżką',
            short: 'Jeden kupon obniża cenę jednego lotu o połowę. Dijkstra po stanach (miasto, czy kupon już zużyty) — graf w dwóch warstwach.',
            tags: ['graf stanów', 'dwie warstwy', 'long long'],
            statement: ['Linie lotnicze obsługują m lotów między n miastami. Lot a → b kosztuje w złotych (tylko w tę stronę). Masz jeden kupon: możesz go użyć na jeden wybrany lot i wtedy zapłacisz za niego ⌊w / 2⌋. Ile najmniej zapłacisz za podróż z miasta 1 do miasta n? Jeśli się nie da, wypisz −1.',
                'Stanem podróży jest para: miasto i to, czy kupon jest już zużyty (0 albo 1). Licz dist[v][0] i dist[v][1]. Z (v, 0) lot do u prowadzi do (u, 0) za w albo do (u, 1) za ⌊w / 2⌋, a z (v, 1) — tylko do (u, 1) za w. To zwykły Dijkstra na grafie z 2n wierzchołkami.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w — lot a → b.'],
            output_format: ['Jedna liczba — najmniejszy koszt albo −1.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 4000', '1 ≤ w ≤ 10⁹', 'Każdy lot a → b występuje najwyżej raz, a ≠ b.'],
            examples: [{ input: '3 4\n1 2 3\n2 3 1\n1 3 7\n2 1 5', note: 'Bez kuponu: 1 → 2 → 3 za 4. Z kuponem na lot 1 → 3: ⌊7 / 2⌋ = 3. Z kuponem na lot 1 → 2: 1 + 1 = 2 — najtaniej.' }],
            hint: R`vector<array<long long, 2>> dist(n + 1, {INF, INF}); — w kopcu trójki zapisane jako pair<long long, pair<int, int>>: {koszt, {miasto, kupon}}. Wynik: min(dist[n][0], dist[n][1]). Ceny do 10⁹ na tysiącach lotów — long long.`,
            tests: (r) => {
                const g = (n, m, spojny) => grafWTxt(n, losGrafW(r, n, m, 1, 1000000000, { spojny, skierowany: true }));
                return ['2 1\n1 2 1', '2 1\n2 1 10', '2 1\n1 2 1000000000', '4 4\n1 2 10\n2 4 10\n1 3 1\n3 4 19', g(10, 30, true), g(2000, 4000, false), g(2000, 4000, true), g(300, 4000, false), g(2000, 2500, false)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (t.length !== 3 * m + 2 || !grafOk(t, 2, n, m, 2000, 4000, 1, 1e9)) return 'graf'; const k = new Set(); for (let i = 0; i < m; i++) { const key = t[2 + 3 * i] * 5000 + t[3 + 3 * i]; if (k.has(key)) return 'powtórzony lot'; k.add(key); } return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const g = listyW(n, czytajGraf(t, 2, t[1]), true);
                const dist = [new Array(n + 1).fill(Infinity), new Array(n + 1).fill(Infinity)], pq = new PQ(wiecejKrotka);
                dist[0][1] = 0; pq.push([0, 1, 0]);
                while (pq.size) {
                    const [d, v, k] = pq.pop();
                    if (d > dist[k][v]) continue;
                    for (const [u, w] of g[v]) {
                        if (d + w < dist[k][u]) { dist[k][u] = d + w; pq.push([dist[k][u], u, k]); }
                        if (!k) { const nd = d + Math.floor(w / 2); if (nd < dist[1][u]) { dist[1][u] = nd; pq.push([nd, u, 1]); } }
                    }
                }
                const wyn = Math.min(dist[0][n], dist[1][n]);
                return String(wyn === Infinity ? -1 : wyn);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long INF = 4e18;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        g[a].push_back({b, w});
    }
    vector<array<long long, 2>> dist(n + 1, {INF, INF});
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    dist[1][0] = 0;
    pq.push({0, {1, 0}});
    while (!pq.empty()) {
        auto [d, stan] = pq.top();
        pq.pop();
        auto [v, k] = stan;
        if (d > dist[v][k]) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u][k]) {
                dist[u][k] = d + w;
                pq.push({dist[u][k], {u, k}});
            }
            if (k == 0 && d + w / 2 < dist[u][1]) {
                dist[u][1] = d + w / 2;
                pq.push({dist[u][1], {u, 1}});
            }
        }
    }
    long long wynik = min(dist[n][0], dist[n][1]);
    if (wynik == INF) cout << -1 << "\n";
    else cout << wynik << "\n";
    return 0;
}`,
        },
    ];
};
