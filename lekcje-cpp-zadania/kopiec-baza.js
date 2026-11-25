// Kopiec — baza zadań na koniec lekcji: 28 zadań od łatwych do trudnych (10 / 10 / 8), które łączą wszystkie części lekcji:
// pierwszy kopiec, kopiec minimum, kopiec binarny, symulacje, pary i struktury, k największych i mediana, zdarzenia
// i terminy oraz Dijkstra — a na koniec wielki finał: planista procesora z priorytetami i wywłaszczaniem.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kopiec-pomoc');
    const { calk, PQ, mniej, wiecej, mniejKrotka, wiecejKrotka, generuj, dobryGen, KOD_GEN, losGrafW, listyW, grafWTxt, dijkstra, pad2, hhmm, D4, Kolejka } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const d1 = (a) => `${a.length}\n${a.join(' ')}`;
    const dk = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
    const malejaco = (a) => a.slice().sort((x, y) => y - x);
    const rosnaco = (a) => a.slice().sort((x, y) => x - y);
    const cmpStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    const suma = (a) => a.reduce((x, y) => x + y, 0);
    // graf z wagami: nagłówek „n m”, potem m krawędzi a b w (a ≠ b)
    function grafOk2(t, n, m, maxN = 500, maxM = 5000, wmax = 1e4) {
        if (!calk(n, 2, maxN) || !calk(m, 0, maxM)) return false;
        for (let i = 0; i < m; i++) {
            const a = t[2 + 3 * i], b = t[3 + 3 * i], w = t[4 + 3 * i];
            if (!calk(a, 1, n) || !calk(b, 1, n) || a === b || !calk(w, 1, wmax)) return false;
        }
        return true;
    }

    return [
        // ================================================================ BAZA · łatwe
        {
            id: 'kop-b-podium-na-zywo', krok: 9, level: 'latwe',
            title: 'Podium na żywo',
            short: 'Po każdym nowym wyniku tablica pokazuje aktualne podium. Kopiec minimum z trzema wynikami i wypisanie od najlepszego.',
            tags: ['kopiec rozmiaru 3', 'kopia do wypisania', 'strumień'],
            statement: ['Na zawodach wyniki pojawiają się jeden po drugim. Po każdym nowym wyniku tablica wyników pokazuje podium: trzy najwyższe wyniki spośród dotychczasowych, od najwyższego (równe wyniki liczą się osobno). Dopóki wyników jest mniej niż trzy, tablica pokazuje wszystkie.',
                'Od czego zacząć: trzymaj trzy najlepsze wyniki w kopcu minimum (gdy urośnie do czterech — wyrzuć najmniejszy). Do wypisania od najwyższego zrób kopię kopca, przerzuć ją do vectora i wypisz go od końca.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['n wierszy: podium po każdym wyniku, od najwyższego.'],
            constraints: ['1 ≤ n ≤ 1000', 'Wyniki są liczbami całkowitymi od 0 do 10⁵.'],
            examples: [{ input: '5\n50 70 60 70 10', note: 'Po trzecim wyniku podium to 70 60 50. Druga siedemdziesiątka wypycha pięćdziesiątkę. Dziesiątka niczego nie zmienia.' }],
            hint: R`priority_queue<int, vector<int>, greater<int>> top3; top3.push(x); if (top3.size() > 3) top3.pop();. Wypisywanie: auto k = top3; vector<int> v; while (!k.empty()) { v.push_back(k.top()); k.pop(); } — v jest rosnąco, więc wypisz go od końca.`,
            tests: (r) => [d1([5]), d1([1, 2]), d1([3, 2, 1, 4]), d1([7, 7, 7, 7, 7]), d1(r.arr(20, 0, 30)), d1(r.arr(1000, 0, 100000)), d1(Array.from({ length: 300 }, (_, i) => i)), d1(r.arr(1000, 0, 3))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e5)) ? null : 'dane'; },
            solve: (inp) => { const top = [], out = []; for (const x of nums(inp).slice(1)) { top.push(x); top.sort((a, b) => b - a); if (top.length > 3) top.pop(); out.push(top.join(' ')); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> top3;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        top3.push(x);
        if (top3.size() > 3) top3.pop();
        auto k = top3;
        vector<int> v;
        while (!k.empty()) {
            v.push_back(k.top());
            k.pop();
        }
        for (int j = (int)v.size() - 1; j >= 0; j--) cout << v[j] << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-b-zmiana-znakow', krok: 9, level: 'latwe',
            title: 'Zmiana znaków',
            short: 'k razy zmień znak jednej liczby, żeby suma była jak największa. Zawsze odwracaj najmniejszą — kopiec minimum.',
            tags: ['zachłannie najmniejszy', 'top → pop → push', 'ta sama liczba wiele razy'],
            statement: ['Masz n liczb całkowitych. Dokładnie k razy wybierasz jedną liczbę i zmieniasz jej znak (x staje się −x). Tę samą liczbę możesz wybrać wiele razy. Jaka jest największa możliwa suma liczb po k zmianach?',
                'Od czego zacząć: zawsze opłaca się odwrócić najmniejszą liczbę — ujemna staje się dodatnia, a gdy zostały same nieujemne, odwracanie najmniejszej najmniej szkodzi. Trzymaj liczby w kopcu minimum i k razy: zdejmij najmniejszą, wrzuć ją z przeciwnym znakiem.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa możliwa suma.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ k ≤ 10⁴', 'Liczby są z przedziału od −10⁴ do 10⁴.'],
            examples: [{ input: '4 3\n-5 2 -3 1', note: 'Odwracamy −5 (będzie 5), potem −3 (będzie 3), a trzecia zmiana trafia w najmniejszą liczbę, czyli 1. Suma: 5 + 2 + 3 − 1 = 9.' }],
            hint: R`for (int i = 0; i < k; i++) { int x = pq.top(); pq.pop(); pq.push(-x); }. Na końcu zsumuj kopiec. Gdy na wierzchu jest 0, kolejne zmiany niczego nie psują.`,
            tests: (r) => [dk([5], 1), dk([5], 2), dk([0], 7), dk([-1, -2, -3], 2), dk([-1, -2, -3], 4), dk(r.arr(12, -10, 10), 5), dk(r.arr(10000, -10000, 10000), 10000), dk(r.arr(10000, 1, 10000), 9999), dk(r.arr(5000, -10000, -1), 3000)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 1, 1e4) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e4, 1e4)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp), pq = new PQ(wiecej, t.slice(2)); for (let i = 0; i < t[1]; i++) pq.push(-pq.pop()); return String(suma(pq.h)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    for (int i = 0; i < k; i++) {
        int x = pq.top();
        pq.pop();
        pq.push(-x);
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
            id: 'kop-b-mnozenie-najmniejszej', krok: 9, level: 'latwe',
            title: 'Mnożenie najmniejszej',
            short: 'k razy pomnóż najmniejszą liczbę przez m, a przy remisie tę, która stoi najbliżej początku. Kopiec par {wartość, pozycja}.',
            tags: ['para {wartość, pozycja}', 'kopiec minimum par', 'wynik na swoim miejscu'],
            statement: ['Masz n liczb naturalnych w tablicy. Wykonaj k razy: znajdź najmniejszą liczbę w tablicy (jeśli kilka jest równych — tę o najmniejszej pozycji) i pomnóż ją przez m. Wypisz tablicę po wszystkich k ruchach.',
                'Od czego zacząć: trzymaj w kopcu minimum pary {wartość, pozycja} — remis wartości sam rozstrzygnie się na korzyść mniejszej pozycji. Po pomnożeniu wrzuć parę z nową wartością i tą samą pozycją, a nową wartość zapisz też w tablicy.'],
            input_format: ['W pierwszym wierszu liczby n, k i m.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jeden wiersz: tablica po k ruchach.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', '1 ≤ m ≤ 10', 'Liczby są z przedziału od 1 do 10⁹.'],
            examples: [{ input: '5 4 2\n2 1 3 5 1', note: 'Mnożymy jedynkę z pozycji 2 (będzie 2), potem jedynkę z pozycji 5 (2), potem dwójkę z pozycji 1 (4), a na koniec dwójkę z pozycji 2 (4). Wynik: 4 4 3 5 2.' }],
            hint: R`priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;. Ruch: auto [w, i] = pq.top(); pq.pop(); t[i] = w * m; pq.push({t[i], i});. Liczby rosną powyżej int — long long.`,
            tests: (r) => {
                const d = (a, k, m) => `${a.length} ${k} ${m}\n${a.join(' ')}`;
                return [d([7], 1, 3), d([1, 1, 1], 3, 1), d([5, 4, 3], 3, 2), d(r.arr(12, 1, 20), 10, 3), d(r.arr(2000, 1, 1000000000), 2000, 10), d(r.arr(2000, 1, 5), 1999, 2), d([1, ...r.arr(1999, 1000000000, 1000000000)], 2000, 2), d(r.arr(500, 1, 100), 300, 7)];
            },
            check: (inp) => { const t = nums(inp); const [n, k, m] = t; return calk(n, 1, 2000) && calk(k, 1, n) && calk(m, 1, 10) && t.length === n + 3 && t.slice(3).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1], m = t[2], a = t.slice(3);
                const pq = new PQ(wiecejKrotka, a.map((x, i) => [x, i]));
                for (let j = 0; j < k; j++) { const [, i] = pq.pop(); a[i] *= m; if (a[i] > Number.MAX_SAFE_INTEGER) throw new Error('za duże'); pq.push([a[i], i]); }
                return a.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    long long m;
    cin >> n >> k >> m;
    vector<long long> t(n);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
        pq.push({t[i], i});
    }
    for (int j = 0; j < k; j++) {
        auto [w, i] = pq.top();
        pq.pop();
        t[i] = w * m;
        pq.push({t[i], i});
    }
    for (long long x : t) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-k-ta-rozna', krok: 9, level: 'latwe',
            title: 'k-ta różna wartość',
            short: 'k-ta największa wartość, ale powtórzenia liczą się raz: zdejmując z kopca, pomijaj liczby równe poprzedniej.',
            tags: ['pomijanie powtórzeń', 'top i pop', 'brak odpowiedzi'],
            statement: ['Wczytaj n liczb. Wypisz k-tą największą spośród różnych wartości: najpierw największa wartość, potem następna mniejsza od niej, i tak dalej — każda wartość liczy się raz, choćby wystąpiła wiele razy. Jeśli różnych wartości jest mniej niż k, wypisz brak.',
                'Od czego zacząć: wrzuć liczby do kopca, a potem zdejmuj je po kolei i licz tylko te, które różnią się od ostatnio zdjętej.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba albo słowo brak.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', 'Liczby są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '7 3\n5 9 5 7 9 1 7', note: 'Różne wartości od największej: 9, 7, 5, 1. Trzecia to 5.' }, { input: '3 2\n4 4 4', note: 'Jest tylko jedna różna wartość — brak.' }],
            hint: R`int ile = 0; bool pierwsza = true; long long ost = 0; while (!pq.empty()) { int x = pq.top(); pq.pop(); if (pierwsza || x != ost) { ile++; if (ile == k) → wypisz x; } ost = x; pierwsza = false; }. Jeśli pętla się skończy bez wypisania — brak.`,
            tests: (r) => [dk([3], 1), dk([3, 3], 2), dk([1, 2, 3], 3), dk(r.arr(15, 0, 5), 4), dk(r.arr(5000, -1000000000, 1000000000), 2500), dk(r.arr(5000, 1, 100), 100), dk(r.arr(5000, 1, 100), 101), dk(r.arr(100, 7, 7), 1)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp), u = malejaco([...new Set(t.slice(2))]); return t[1] <= u.length ? String(u[t[1] - 1]) : 'brak'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    int ile = 0, ost = 0;
    bool pierwsza = true;
    while (!pq.empty()) {
        int x = pq.top();
        pq.pop();
        if (pierwsza || x != ost) {
            ile++;
            if (ile == k) {
                cout << x << "\n";
                return 0;
            }
        }
        ost = x;
        pierwsza = false;
    }
    cout << "brak\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-wedlug-czestosci', krok: 9, level: 'latwe',
            title: 'Według częstości',
            short: 'Najpierw liczby, które występują najczęściej, a przy remisie mniejsze. Mapa liczników i kopiec par {ile, −wartość}.',
            tags: ['mapa + kopiec', 'para {ile, −wartość}', 'powtarzanie w wyniku'],
            statement: ['Wczytaj n liczb i ustaw je w nowej kolejności: najpierw wszystkie wystąpienia liczby, która występuje najczęściej, potem następnej i tak dalej. Jeśli dwie liczby występują tyle samo razy, wcześniej idzie mniejsza. Każdą liczbę wypisz tyle razy, ile razy wystąpiła.',
                'Od czego zacząć: zlicz liczby w mapie, a potem wrzuć do kopca pary {ile, −wartość} — więcej wystąpień wygrywa, a przy remisie większe −wartość, czyli mniejsza wartość.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb w nowej kolejności.'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od −10⁴ do 10⁴.'],
            examples: [{ input: '8\n4 6 2 6 4 4 2 9', note: 'Czwórka występuje 3 razy, szóstka i dwójka po 2 (dwójka jest mniejsza, więc pierwsza), dziewiątka raz.' }],
            hint: R`map<int, int> ile; for (…) ile[x]++;. for (auto [x, c] : ile) pq.push({c, -x});. Przy wypisywaniu: auto [c, mx] = pq.top(); pq.pop(); for (int j = 0; j < c; j++) cout << -mx << " ";.`,
            tests: (r) => [d1([1]), d1([2, 1]), d1([1, 2, 2]), d1([5, 5, 3, 3]), d1(r.arr(20, 0, 5)), d1(r.arr(3000, -10000, 10000)), d1(r.arr(3000, -10, 10)), d1(r.arr(3000, 1, 2))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e4, 1e4)) ? null : 'dane'; },
            solve: (inp) => {
                const m = new Map();
                for (const x of nums(inp).slice(1)) m.set(x, (m.get(x) || 0) + 1);
                const out = [];
                for (const [x, c] of [...m].sort((a, b) => b[1] - a[1] || a[0] - b[0])) for (let j = 0; j < c; j++) out.push(x);
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> ile;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x]++;
    }
    priority_queue<pair<int, int>> pq;
    for (auto [x, c] : ile) pq.push({c, -x});
    while (!pq.empty()) {
        auto [c, mx] = pq.top();
        pq.pop();
        for (int j = 0; j < c; j++) cout << -mx << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-tablica-odlotow', krok: 9, level: 'latwe',
            title: 'Tablica odlotów',
            short: 'Loty w przypadkowej kolejności, a tablica ma je pokazać od najwcześniejszego. Godzina zamieniona na minuty i para z kodem lotu.',
            tags: ['kopiec minimum par', 'godzina na minuty', 'wypisywanie hh:mm'],
            statement: ['Dostajesz n lotów w przypadkowej kolejności: kod lotu i godzinę odlotu w zapisie hh:mm. Wypisz tablicę odlotów: loty od najwcześniejszego, a jeśli kilka odlatuje o tej samej godzinie — alfabetycznie według kodu.',
                'Od czego zacząć: zamień godzinę na liczbę minut od północy (60 · hh + mm) i trzymaj w kopcu minimum pary {minuty, kod}. Przy wypisywaniu zamień minuty z powrotem na hh:mm — z zerem na początku, gdy trzeba.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy kod lotu i godzina odlotu hh:mm.'],
            output_format: ['n wierszy: godzina hh:mm i kod lotu, od najwcześniejszego odlotu.'],
            constraints: ['1 ≤ n ≤ 1000', 'Kody to dwie wielkie litery i 2–4 cyfry; są różne.', 'Godziny są od 00:00 do 23:59.'],
            examples: [{ input: '4\nLO281 14:05\nFR12 09:30\nLH77 14:05\nWZ603 07:45', note: 'Najwcześniej WZ603 o 7:45. Dwa loty o 14:05 — alfabetycznie LH77 przed LO281.' }],
            hint: R`char dwukropek; int hh, mm; cin >> kod >> hh >> dwukropek >> mm; pq.push({60 * hh + mm, kod});. Wypisywanie: cout << setw(2) << setfill('0') << t / 60 << ":" << setw(2) << t % 60 << " " << kod;.`,
            tests: (r) => {
                const kody = (n) => { const s = new Set(); while (s.size < n) s.add(String.fromCharCode(65 + r.int(0, 25)) + String.fromCharCode(65 + r.int(0, 25)) + r.int(0, 10 ** r.int(2, 4) - 1).toString().padStart(2, '0')); return [...s]; };
                const d = (l) => `${l.length}\n${l.map(([k, t]) => `${k} ${hhmm(t)}`).join('\n')}`;
                const los = (n, lo, hi) => d(kody(n).map((k) => [k, r.int(lo, hi)]));
                return [d([['AB12', 0]]), d([['ZZ99', 1439], ['AA00', 0]]), d([['BB10', 600], ['AB10', 600], ['BA10', 600]]), los(20, 0, 1439), los(1000, 0, 1439), los(1000, 600, 605), los(300, 0, 59)];
            },
            check: (inp) => {
                const L = linie(inp);
                const n = Number(L[0]);
                if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                const k = new Set();
                for (const l of L.slice(1)) { const m = l.match(/^([A-Z]{2}\d{2,4}) (\d\d):(\d\d)$/); if (!m || Number(m[2]) > 23 || Number(m[3]) > 59 || k.has(m[1])) return 'lot'; k.add(m[1]); }
                return null;
            },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [k, t] = l.split(' '); return [k, t]; }).sort((a, b) => cmpStr(a[1], b[1]) || cmpStr(a[0], b[0])).map(([k, t]) => `${t} ${k}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    for (int i = 0; i < n; i++) {
        string kod;
        int hh, mm;
        char dwukropek;
        cin >> kod >> hh >> dwukropek >> mm;
        pq.push({60 * hh + mm, kod});
    }
    while (!pq.empty()) {
        auto [t, kod] = pq.top();
        pq.pop();
        cout << setw(2) << setfill('0') << t / 60 << ":" << setw(2) << setfill('0') << t % 60 << " " << kod << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-b-poprawki', krok: 9, level: 'latwe',
            title: 'Poprawki ocen',
            short: 'Każda poprawka podnosi o jeden najniższą ocenę — ale szóstki nie da się poprawić. Kopiec minimum i warunek stopu na wierzchu.',
            tags: ['kopiec minimum', 'warunek na wierzchu', 'przerwanie pętli'],
            statement: ['Uczeń ma n ocen od 1 do 6 i może napisać k poprawek. Każda poprawka podnosi o 1 jego najniższą ocenę. Szóstki nie da się podnieść — jeśli wszystkie oceny są szóstkami, pozostałe poprawki przepadają i uczeń ich nie pisze.',
                'Wypisz sumę ocen po poprawkach i liczbę poprawek, które uczeń naprawdę napisał. Od czego zacząć: oceny w kopcu minimum; przed każdą poprawką sprawdź, czy na wierzchu nie leży już szóstka.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n ocen.'],
            output_format: ['Dwie liczby: suma ocen po poprawkach i liczba napisanych poprawek.'],
            constraints: ['1 ≤ n ≤ 10⁴', '0 ≤ k ≤ 10⁵', 'Oceny są liczbami całkowitymi od 1 do 6.'],
            examples: [{ input: '4 5\n3 6 1 4', note: 'Jedynka idzie w górę dwa razy (do 3), potem dwie trójki dostają po poprawce (4 i 4), a piąta poprawka podnosi jedną z czwórek. Oceny: 5, 6, 4, 4 — suma 19, napisane wszystkie 5 poprawek.' }],
            hint: R`for (int i = 0; i < k; i++) { if (pq.top() == 6) break; int x = pq.top(); pq.pop(); pq.push(x + 1); napisane++; }. Suma: opróżnij kopiec albo licz ją na bieżąco (każda poprawka to +1).`,
            tests: (r) => [dk([6], 3), dk([1], 0), dk([1], 100000), dk([5, 5], 1), dk(r.arr(10, 1, 6), 7), dk(r.arr(10000, 1, 6), 100000), dk(r.arr(10000, 1, 6), 12345), dk(r.arr(10000, 1, 2), 30000), dk(r.arr(500, 6, 6), 10)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 0, 1e5) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 6)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp), a = t.slice(2), mozna = suma(a.map((x) => 6 - x)), uzyte = Math.min(mozna, t[1]); return `${suma(a) + uzyte} ${uzyte}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int, vector<int>, greater<int>> pq;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
        suma += x;
    }
    int napisane = 0;
    for (int i = 0; i < k; i++) {
        if (pq.top() == 6) break;
        int x = pq.top();
        pq.pop();
        pq.push(x + 1);
        napisane++;
        suma++;
    }
    cout << suma << " " << napisane << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-roznica-sum', krok: 9, level: 'latwe',
            title: 'Najlepsi kontra najsłabsi',
            short: 'Suma k największych minus suma k najmniejszych: dwa kopce na tych samych liczbach — maksimum i minimum.',
            tags: ['dwa kopce', 'kopiec maksimum i minimum', 'long long'],
            statement: ['Wczytaj n liczb i liczbę k (2k ≤ n). Wypisz różnicę: suma k największych liczb minus suma k najmniejszych.',
                'Od czego zacząć: wrzuć każdą liczbę do dwóch kopców — zwykłego i kopca minimum — i z każdego zdejmij k razy wierzch. Sumy mogą przekroczyć int.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — różnica sum.'],
            constraints: ['2 ≤ 2k ≤ n ≤ 5000', 'Liczby są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '6 2\n4 -1 7 3 10 2', note: 'Dwie największe: 10 + 7 = 17. Dwie najmniejsze: −1 + 2 = 1. Różnica 16.' }],
            hint: R`priority_queue<long long> maks; priority_queue<long long, vector<long long>, greater<long long>> mini;. for (k razy) { wynik += maks.top(); maks.pop(); wynik -= mini.top(); mini.pop(); }.`,
            tests: (r) => [dk([1, 2], 1), dk([5, 5, 5, 5], 2), dk([-3, 8, 0, 1, -7], 2), dk(r.arr(20, -50, 50), 5), dk(r.arr(5000, -1000000000, 1000000000), 2500), dk(r.arr(5000, 999999990, 1000000000), 2000), dk(r.arr(5000, -1000000000, 1000000000), 1)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 2, 5000) && calk(k, 1, Math.floor(n / 2)) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp), k = t[1], a = rosnaco(t.slice(2)); return String(suma(a.slice(a.length - k)) - suma(a.slice(0, k))); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<long long> maks;
    priority_queue<long long, vector<long long>, greater<long long>> mini;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        maks.push(x);
        mini.push(x);
    }
    long long wynik = 0;
    for (int i = 0; i < k; i++) {
        wynik += maks.top();
        maks.pop();
        wynik -= mini.top();
        mini.pop();
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-magazyn', krok: 9, level: 'latwe',
            title: 'Magazyn palet',
            short: 'Wydaje się zawsze najcięższą paletę, a przy równej wadze — tę, która przyjechała najwcześniej. Do tego raport: ile palet i ile ważą.',
            tags: ['para {waga, −numer}', 'polecenia', 'suma w long long'],
            statement: ['Do magazynu przyjeżdżają palety, a magazynier wydaje je w kolejności od najcięższej; przy równej wadze najpierw wydaje tę, która przyjechała najwcześniej. Wykonaj q poleceń:',
                'DOSTAWA nazwa waga — do magazynu przyjeżdża paleta; WYDAJ — wydaj paletę: wypisz jej nazwę i wagę albo magazyn pusty; RAPORT — wypisz liczbę palet w magazynie i ich łączną wagę.',
                'Od czego zacząć: numeruj dostawy, trzymaj w kopcu pary {waga, −numer}, nazwy w vectorze pod numerami, a łączną wagę — w zmiennej long long poprawianej przy każdej dostawie i wydaniu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia WYDAJ i RAPORT jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ q ≤ 3000', 'Wagi są liczbami całkowitymi od 1 do 10⁶.', 'Nazwy to słowa z małych liter, najwyżej 12 znaków.'],
            examples: [{ input: '6\nDOSTAWA cegly 500\nDOSTAWA piasek 800\nDOSTAWA cement 500\nWYDAJ\nWYDAJ\nRAPORT', note: 'Najpierw piasek (800). Cegły i cement ważą po 500 — cegły przyjechały wcześniej. Zostaje 1 paleta o wadze 500.' }],
            hint: R`priority_queue<pair<int, int>> pq; vector<string> nazwy; long long waga = 0;. Przy DOSTAWA: nazwy.push_back(n); pq.push({w, -(int)(nazwy.size() - 1)}); waga += w;. RAPORT: cout << pq.size() << " " << waga;.`,
            tests: (r) => {
                const sl = ['cegly', 'piasek', 'cement', 'drewno', 'stal', 'szklo', 'farba', 'gips', 'kable', 'rury', 'deski', 'plytki'];
                const los = (q, pD, wMax) => { const L = []; for (let i = 0; i < q; i++) { const u = r(); L.push(u < pD ? `DOSTAWA ${r.pick(sl)} ${r.int(1, wMax)}` : u < pD + 0.1 ? 'RAPORT' : 'WYDAJ'); } return `${q}\n${L.join('\n')}`; };
                return ['1\nWYDAJ', '2\nRAPORT\nDOSTAWA a 1', '4\nDOSTAWA a 5\nDOSTAWA b 5\nWYDAJ\nWYDAJ', los(30, 0.6, 10), los(3000, 0.6, 1000000), los(3000, 0.5, 2), los(3000, 0.9, 1000000)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'WYDAJ' || l === 'RAPORT' || (/^DOSTAWA [a-z]{1,12} \d+$/.test(l) && calk(Number(l.split(' ')[2]), 1, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const pq = new PQ(mniejKrotka), naz = [], out = [];
                let waga = 0;
                for (const l of linie(inp).slice(1)) {
                    if (l === 'RAPORT') out.push(`${pq.size} ${waga}`);
                    else if (l === 'WYDAJ') { if (pq.empty()) out.push('magazyn pusty'); else { const [w, mn] = pq.pop(); waga -= w; out.push(`${naz[-mn]} ${w}`); } }
                    else { const [, n, w] = l.split(' '); naz.push(n); pq.push([Number(w), -(naz.length - 1)]); waga += Number(w); }
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    priority_queue<pair<int, int>> pq;
    vector<string> nazwy;
    long long waga = 0;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "DOSTAWA") {
            string n;
            int w;
            cin >> n >> w;
            nazwy.push_back(n);
            pq.push({w, -(int)(nazwy.size() - 1)});
            waga += w;
        } else if (p == "RAPORT") {
            cout << pq.size() << " " << waga << "\n";
        } else if (pq.empty()) {
            cout << "magazyn pusty\n";
        } else {
            auto [w, mn] = pq.top();
            pq.pop();
            waga -= w;
            cout << nazwy[-mn] << " " << w << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-b-pizzeria', krok: 9, level: 'latwe',
            title: 'Pizzeria z jednym piecem',
            short: 'Wszystkie zamówienia są już znane, a piec mieści jedną pizzę. Najkrótsze najpierw — wtedy klienci czekają w sumie najkrócej.',
            tags: ['kopiec minimum par', 'najkrótsze najpierw', 'suma czasów'],
            statement: ['W pizzerii czeka n zamówień ponumerowanych od 1 do n, a pieczenie pizzy z zamówienia i trwa tᵢ minut. Piec mieści jedną pizzę naraz i zaczyna pracę w minucie 0. Klient i czeka do chwili, w której jego pizza wyjdzie z pieca.',
                'Żeby suma czasów oczekiwania wszystkich klientów była jak najmniejsza, piec piecze zawsze najkrótszą z czekających pizz (przy remisie — zamówienie o mniejszym numerze). Wypisz numery zamówień w kolejności pieczenia oraz sumę czasów oczekiwania.',
                'Od czego zacząć: kopiec minimum par {tᵢ, i}, zegar i suma — po każdej pizzy zegar += t, suma += zegar.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb tᵢ.'],
            output_format: ['W pierwszym wierszu numery zamówień w kolejności pieczenia.', 'W drugim wierszu suma czasów oczekiwania.'],
            constraints: ['1 ≤ n ≤ 4000', 'Czasy pieczenia są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '4\n10 3 7 3', note: 'Najpierw dwie pizze po 3 minuty (zamówienia 2 i 4), potem 7, a na końcu 10. Klienci czekają 3, 6, 13 i 23 minuty — razem 45.' }],
            hint: R`priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq; pq.push({t, i});. long long zegar = 0, suma = 0;. Każda pizza: zegar += t; suma += zegar;.`,
            tests: (r) => [d1([5]), d1([2, 1]), d1([4, 4, 4]), d1(r.arr(15, 1, 20)), d1(r.arr(4000, 1, 1000000)), d1(r.arr(4000, 1, 3)), d1(Array.from({ length: 100 }, (_, i) => 100 - i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 4000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const z = nums(inp).slice(1).map((t, i) => [t, i + 1]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                let zegar = 0, s = 0;
                for (const [t] of z) { zegar += t; s += zegar; }
                return z.map((q) => q[1]).join(' ') + '\n' + s;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    for (int i = 1; i <= n; i++) {
        int t;
        cin >> t;
        pq.push({t, i});
    }
    long long zegar = 0, suma = 0;
    while (!pq.empty()) {
        auto [t, i] = pq.top();
        pq.pop();
        zegar += t;
        suma += zegar;
        cout << i << " ";
    }
    cout << "\n" << suma << "\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · średnie
        {
            id: 'kop-b-liczby-235', krok: 9, level: 'srednie',
            title: 'Liczby z dwójek, trójek i piątek',
            short: 'Kolejne liczby, które dzielą się tylko przez 2, 3 i 5: z kopca minimum bierzesz najmniejszą, a wrzucasz ją razy 2, 3 i 5. Powtórki pomijasz.',
            tags: ['kopiec minimum', 'generowanie kolejnych', 'pomijanie powtórek'],
            statement: ['Liczba jest gładka, jeśli w jej rozkładzie na czynniki pierwsze są tylko dwójki, trójki i piątki. Pierwsze gładkie liczby to 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16 (liczba 1 też się liczy — nie ma żadnych czynników).',
                'Odpowiedz na T pytań: jaka jest n-ta gładka liczba?',
                'Od czego zacząć: wrzuć 1 do kopca minimum. Zdejmuj najmniejszą liczbę x — to kolejna gładka liczba — i wrzucaj 2x, 3x i 5x. Ta sama liczba może trafić do kopca kilka razy (6 = 2 · 3 = 3 · 2), więc zdejmując, pomijaj liczby równe poprzedniej. Wygeneruj raz tyle liczb, ile potrzeba do największego pytania.'],
            input_format: ['W pierwszym wierszu liczba T.', 'W każdym z kolejnych T wierszy jedna liczba n.'],
            output_format: ['Dla każdego pytania jeden wiersz: n-ta gładka liczba.'],
            constraints: ['1 ≤ T ≤ 1000', '1 ≤ n ≤ 3000'],
            examples: [{ input: '4\n1\n7\n12\n100', note: 'Siódma gładka liczba to 8 (7 nie jest gładka), dwunasta to 16, a setna — 1536.' }],
            hint: R`priority_queue<long long, vector<long long>, greater<long long>> pq; pq.push(1); vector<long long> g;. while (g.size() < 3000) { long long x = pq.top(); pq.pop(); if (!g.empty() && g.back() == x) continue; g.push_back(x); pq.push(2 * x); pq.push(3 * x); pq.push(5 * x); }. Liczby szybko przekraczają int.`,
            tests: (r) => {
                const q = (a) => `${a.length}\n${a.join('\n')}`;
                return [q([1]), q(Array.from({ length: 30 }, (_, i) => i + 1)), q([3000, 2999, 1690, 1691, 1500]), q(Array.from({ length: 1000 }, () => r.int(1, 3000))), q(Array.from({ length: 200 }, () => r.int(2500, 3000)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 3000)) ? null : 'dane'; },
            solve: (inp) => {
                const g = [1];
                let i2 = 0, i3 = 0, i5 = 0;
                while (g.length < 3000) {
                    const x = Math.min(g[i2] * 2, g[i3] * 3, g[i5] * 5);
                    g.push(x);
                    if (x === g[i2] * 2) i2++;
                    if (x === g[i3] * 3) i3++;
                    if (x === g[i5] * 5) i5++;
                }
                return nums(inp).slice(1).map((n) => g[n - 1]).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    pq.push(1);
    vector<long long> g;
    while (g.size() < 3000) {
        long long x = pq.top();
        pq.pop();
        if (!g.empty() && g.back() == x) continue;
        g.push_back(x);
        pq.push(2 * x);
        pq.push(3 * x);
        pq.push(5 * x);
    }
    int T;
    cin >> T;
    for (int i = 0; i < T; i++) {
        int n;
        cin >> n;
        cout << g[n - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-b-cegly-i-drabiny', krok: 9, level: 'srednie',
            title: 'Cegły i drabiny',
            short: 'Drabiny zostaw na największe podejścia: kopiec minimum podejść „na drabinach”, a gdy drabin brakuje — najmniejsze podejście pokrywasz cegłami.',
            tags: ['zachłannie z kopcem', 'decyzja na później', 'kopiec rozmiaru l'],
            statement: ['Idziesz po dachach n budynków stojących w rzędzie, od budynku 1. Z budynku i na i + 1 przechodzisz bez problemu, jeśli następny jest niższy albo tak samo wysoki. Jeśli jest wyższy o d, musisz albo użyć jednej drabiny, albo zużyć d cegieł. Masz b cegieł i l drabin. Jaki jest numer najdalszego budynku, do którego dojdziesz?',
                'Od czego zacząć: drabiny opłaca się zostawić na największe podejścia, ale nie wiesz z góry, które to będą. Każde podejście wrzucaj do kopca minimum (tak jakbyś użył drabiny). Gdy w kopcu jest więcej podejść niż drabin, najmniejsze z nich pokryj cegłami — zdejmij je i odejmij od b. Gdy cegieł zabraknie, dalej nie pójdziesz.'],
            input_format: ['W pierwszym wierszu liczby n, b i l.', 'W drugim wierszu n wysokości budynków.'],
            output_format: ['Jedna liczba — numer najdalszego budynku (budynki numerujemy od 1).'],
            constraints: ['1 ≤ n ≤ 10⁴', '0 ≤ b ≤ 10⁹', '0 ≤ l ≤ n', 'Wysokości są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '7 5 1\n4 2 7 6 9 14 12', note: 'Podejścia: 2 → 7 (o 5), 6 → 9 (o 3) i 9 → 14 (o 5). Drabina i 5 cegieł starczają na dwa pierwsze (drabina na podejście o 5, 3 cegły na podejście o 3), ale na trzecie zostają tylko 2 cegły. Najdalej dochodzimy do budynku 5 (wysokość 9).' }],
            hint: R`for (int i = 0; i + 1 < n; i++) { int d = h[i + 1] - h[i]; if (d > 0) { pq.push(d); if (pq.size() > l) { b -= pq.top(); pq.pop(); } } if (b < 0) { cout << i + 1; return 0; } } cout << n;. b w long long.`,
            tests: (r) => {
                const d = (h, b, l) => `${h.length} ${b} ${l}\n${h.join(' ')}`;
                return [d([5], 0, 0), d([1, 2], 0, 0), d([1, 2], 1, 0), d([1, 2], 0, 1), d([3, 3, 3], 0, 0), d(r.arr(12, 1, 20), 10, 2), d(r.arr(10000, 1, 1000000), 1000000000, 100), d(r.arr(10000, 1, 1000000), 50000000, 500), d(r.arr(10000, 1, 1000000), 0, 3000), d(Array.from({ length: 10000 }, (_, i) => i + 1), 9000, 500), d(r.arr(10000, 1, 1000), 100000, 0)];
            },
            check: (inp) => { const t = nums(inp); const [n, b, l] = t; return calk(n, 1, 1e4) && calk(b, 0, 1e9) && calk(l, 0, n) && t.length === n + 3 && t.slice(3).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); let b = t[1]; const l = t[2], hh = t.slice(3), pq = new PQ(wiecej);
                for (let i = 0; i + 1 < hh.length; i++) {
                    const d = hh[i + 1] - hh[i];
                    if (d > 0) { pq.push(d); if (pq.size > l) b -= pq.pop(); }
                    if (b < 0) return String(i + 1);
                }
                return String(hh.length);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, l;
    long long b;
    cin >> n >> b >> l;
    vector<int> h(n);
    for (int &x : h) cin >> x;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i + 1 < n; i++) {
        int d = h[i + 1] - h[i];
        if (d > 0) {
            pq.push(d);
            if ((int)pq.size() > l) {
                b -= pq.top();
                pq.pop();
            }
        }
        if (b < 0) {
            cout << i + 1 << "\n";
            return 0;
        }
    }
    cout << n << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-bez-sasiadow', krok: 9, level: 'srednie',
            title: 'Bez dwóch takich samych obok siebie',
            short: 'Przestaw litery tak, żeby żadne dwie sąsiednie nie były równe. Za każdym razem bierz najliczniejszą literę inną niż poprzednia.',
            tags: ['kopiec par {ile, litera}', 'odkładanie na bok', 'zachłannie'],
            statement: ['Dostajesz napis z małych liter. Przestaw jego litery tak, żeby żadne dwie sąsiednie nie były takie same, według dokładnie tej reguły: budujesz wynik od lewej i na każdą kolejną pozycję stawiasz literę, której zostało najwięcej, ale inną niż litera postawiona tuż przed nią; jeśli kilka liter ma tę samą liczbę — alfabetycznie najwcześniejszą.',
                'Jeśli w którymś momencie nie da się postawić żadnej litery (zostały tylko takie same jak poprzednia), wypisz NIE.',
                'Od czego zacząć: trzymaj w kopcu pary {ile zostało, −litera}. Zdejmij wierzch; jeśli to ta sama litera co poprzednia, zdejmij jeszcze jeden element i użyj jego, a pierwszy odłóż z powrotem. Użytą literę wrzuć z liczbą o jeden mniejszą (jeśli coś jej zostało).'],
            input_format: ['Jeden wiersz: napis s.'],
            output_format: ['Przestawiony napis albo NIE.'],
            constraints: ['1 ≤ długość s ≤ 10⁴', 's składa się z małych liter angielskiego alfabetu.'],
            examples: [{ input: 'aaabbc', note: 'Najwięcej jest a, potem na zmianę b i a… Wychodzi ababac.' }, { input: 'aaab', note: 'Trzy litery a i tylko jedna inna — nie da się ich rozdzielić.' }],
            hint: R`priority_queue<pair<int, int>> pq; for (litera c) if (ile[c] > 0) pq.push({ile[c], -c});. Krok: auto a = pq.top(); pq.pop(); if (-a.second == ostatnia) { if (pq.empty()) → NIE; auto b = pq.top(); pq.pop(); pq.push(a); a = b; } wynik += (char)(-a.second); if (--a.first > 0) pq.push(a);.`,
            tests: (r) => {
                const los = (n, alf) => r.word(n, alf);
                const prawie = (n) => { const k = Math.ceil(n / 2); return r.shuffle([...'a'.repeat(k), ...r.word(n - k, 'bcd')]).join(''); };
                return ['a', 'aa', 'ab', 'aab', 'abc', 'zzzyx', los(20, 'abc'), los(10000, 'abcdefghijklmnopqrstuvwxyz'), los(10000, 'ab'), prawie(9999), prawie(10000), 'a'.repeat(5000) + 'b'.repeat(4999), 'q'.repeat(100) + 'r'.repeat(98)];
            },
            check: (inp) => (/^[a-z]{1,10000}$/.test(inp) ? null : 'napis'),
            solve: (inp) => {
                const ile = new Array(26).fill(0);
                for (const c of inp) ile[c.charCodeAt(0) - 97]++;
                const out = [];
                let ost = -1;
                for (let p = 0; p < inp.length; p++) {
                    let best = -1;
                    for (let c = 0; c < 26; c++) if (ile[c] > 0 && c !== ost && (best < 0 || ile[c] > ile[best])) best = c;
                    if (best < 0) { if (Math.max(...ile) <= 0 || 2 * Math.max(...[...new Set(inp)].map((c) => inp.split(c).length - 1)) <= inp.length + 1) throw new Error('NIE, choć się da'); return 'NIE'; }
                    out.push(String.fromCharCode(97 + best));
                    ile[best]--;
                    ost = best;
                }
                return out.join('');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int ile[26] = {0};
    for (char c : s) ile[c - 'a']++;
    priority_queue<pair<int, int>> pq;
    for (int c = 0; c < 26; c++) {
        if (ile[c] > 0) pq.push({ile[c], -c});
    }
    string wynik;
    int ostatnia = -1;
    while (!pq.empty()) {
        auto a = pq.top();
        pq.pop();
        if (-a.second == ostatnia) {
            if (pq.empty()) {
                cout << "NIE\n";
                return 0;
            }
            auto b = pq.top();
            pq.pop();
            pq.push(a);
            a = b;
        }
        wynik += (char)('a' - a.second);
        ostatnia = -a.second;
        if (--a.first > 0) pq.push(a);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-serwery', krok: 9, level: 'srednie',
            title: 'Serwerownia',
            short: 'Dwa kopce: wolne serwery {waga, numer} i zajęte {kiedy wolny, waga, numer}. Zadanie bierze najlżejszy wolny serwer — albo czeka.',
            tags: ['dwa kopce', 'przenoszenie między kopcami', 'symulacja czasu'],
            statement: ['Serwerownia ma n serwerów ponumerowanych od 1 do n, serwer i ma wagę wᵢ. Napływa m zadań: zadanie j (numerujemy od 0) pojawia się w sekundzie j i jego wykonanie trwa tⱼ sekund. Zadania są przydzielane w kolejności pojawiania się.',
                'Gdy zadanie jest przydzielane, dostaje wolny serwer o najmniejszej wadze (przy remisie — o najmniejszym numerze). Jeśli żaden serwer nie jest wolny, zadanie czeka do chwili, w której zwolni się pierwszy serwer (jeśli kilka zwalnia się w tej samej chwili, wybór jak wyżej). Serwer zajęty od chwili c zadaniem o czasie t zwalnia się w chwili c + t. Wypisz numer serwera dla każdego zadania.',
                'Od czego zacząć: kopiec minimum wolnych serwerów {wᵢ, i} i kopiec minimum zajętych {kiedy wolny, {wᵢ, i}}. Zegar = max(zegar, j); przenieś z zajętych do wolnych wszystkie serwery zwolnione do chwili zegar; jeśli wolnych brak — przesuń zegar na najwcześniejsze zwolnienie i przenieś znowu.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n wag wᵢ.', 'W trzecim wierszu m czasów tⱼ.'],
            output_format: ['Jeden wiersz: m numerów serwerów.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ m ≤ 5000', 'Wagi i czasy są z przedziału od 1 do 10⁵.'],
            examples: [{ input: '3 6\n3 3 2\n1 2 3 2 1 2', note: 'Zadanie 0 dostaje najlżejszy serwer 3 (do sekundy 1). W sekundzie 1 serwer 3 jest znowu wolny, więc zadanie 1 też go dostaje (do sekundy 3). W sekundzie 2 serwer 3 pracuje — zadanie 2 dostaje serwer 1 (waga 3, mniejszy numer niż serwer 2). Wynik: 3 3 1 3 2 3.' }],
            hint: R`while (!zajete.empty() && zajete.top().first <= zegar) { wolne.push(zajete.top().second); zajete.pop(); }. Jeśli wolne.empty(): zegar = zajete.top().first; i przenieś jeszcze raz. Potem auto [w, i] = wolne.top(); wolne.pop(); zajete.push({zegar + t, {w, i}});.`,
            tests: (r) => {
                const d = (w, t) => `${w.length} ${t.length}\n${w.join(' ')}\n${t.join(' ')}`;
                return [d([1], [5]), d([1], [3, 1, 1]), d([2, 1], [1, 1, 1, 1]), d([5, 5, 5], [10, 1, 1, 1, 1]), d(r.arr(5, 1, 3), r.arr(20, 1, 6)), d(r.arr(1000, 1, 100000), r.arr(5000, 1, 100000)), d(r.arr(10, 1, 100000), r.arr(5000, 1, 100000)), d(r.arr(300, 1, 3), r.arr(5000, 1, 500)), d(r.arr(1000, 1, 100000), r.arr(5000, 1, 2))];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(n, 1, 1000) && calk(m, 1, 5000) && t.length === n + m + 2 && t.slice(2).every((x) => calk(x, 1, 1e5)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const w = t.slice(2, 2 + n), tt = t.slice(2 + n);
                const wolne = new PQ(wiecejKrotka, w.map((x, i) => [x, i + 1])), zajete = new PQ(wiecejKrotka), out = [];
                let zegar = 0;
                for (let j = 0; j < m; j++) {
                    zegar = Math.max(zegar, j);
                    const przenies = () => { while (zajete.size && zajete.top()[0] <= zegar) { const [, x, i] = zajete.pop(); wolne.push([x, i]); } };
                    przenies();
                    if (wolne.empty()) { zegar = zajete.top()[0]; przenies(); }
                    const [x, i] = wolne.pop();
                    out.push(i);
                    zajete.push([zegar + tt[j], x, i]);
                }
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> wolne;
    for (int i = 1; i <= n; i++) {
        int w;
        cin >> w;
        wolne.push({w, i});
    }
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> zajete;
    long long zegar = 0;
    for (int j = 0; j < m; j++) {
        long long t;
        cin >> t;
        zegar = max(zegar, (long long)j);
        while (!zajete.empty() && zajete.top().first <= zegar) {
            wolne.push(zajete.top().second);
            zajete.pop();
        }
        if (wolne.empty()) {
            zegar = zajete.top().first;
            while (!zajete.empty() && zajete.top().first <= zegar) {
                wolne.push(zajete.top().second);
                zajete.pop();
            }
        }
        auto [w, i] = wolne.top();
        wolne.pop();
        cout << i << " ";
        zajete.push({zegar + t, {w, i}});
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-wydarzenia', krok: 9, level: 'srednie',
            title: 'Festiwal wydarzeń',
            short: 'Jedno wydarzenie dziennie, każde w swoim przedziale dni. Każdego dnia idź na to, które kończy się najwcześniej — kopiec minimum końców.',
            tags: ['kopiec końców', 'przeglądanie dni', 'skok do następnego'],
            statement: ['Na festiwalu jest n wydarzeń. Wydarzenie i trwa od dnia sᵢ do dnia eᵢ włącznie i wystarczy na nim być przez jeden dowolny dzień z tego przedziału. Każdego dnia możesz pójść tylko na jedno wydarzenie. Na ile najwięcej różnych wydarzeń możesz pójść?',
                'Od czego zacząć: przeglądaj dni po kolei. Każdego dnia dorzuć do kopca minimum końce wydarzeń, które właśnie się zaczynają, wyrzuć te, które już się skończyły (eᵢ < dzień), i idź na to, które kończy się najwcześniej. Gdy kopiec jest pusty, przeskocz od razu do dnia startu następnego wydarzenia — dni może być miliard.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby sᵢ i eᵢ.'],
            output_format: ['Jedna liczba — największa liczba wydarzeń.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ sᵢ ≤ eᵢ ≤ 10⁹'],
            examples: [{ input: '4\n1 2\n2 3\n3 4\n1 2', note: 'Dzień 1: wydarzenie 1 (albo 4). Dzień 2: drugie z pary 1–2. Dzień 3: wydarzenie 2–3. Dzień 4: wydarzenie 3–4. Wszystkie cztery.' }],
            hint: R`Posortuj po s. long long dzien; int i = 0; while (i < n || !pq.empty()) { if (pq.empty()) dzien = max(dzien, (long long)ev[i].first); while (i < n && ev[i].first <= dzien) pq.push(ev[i++].second); while (!pq.empty() && pq.top() < dzien) pq.pop(); if (!pq.empty()) { pq.pop(); wynik++; } dzien++; }.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, T, D) => d(Array.from({ length: n }, () => { const s = r.int(1, T); return [s, Math.min(1000000000, s + r.int(0, D))]; }));
                return [d([[1, 1]]), d([[1, 1], [1, 1]]), d([[1, 2], [1, 2], [1, 2]]), d([[5, 5], [1, 10]]), los(15, 10, 3), los(5000, 1000000000, 1000000), los(5000, 1000, 20), los(5000, 100, 3), los(5000, 1000000000, 1000000000), los(3000, 10, 0)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 5000) || t.length !== 2 * n + 1) return 'n'; for (let i = 0; i < n; i++) { const s = t[1 + 2 * i], e = t[2 + 2 * i]; if (!calk(s, 1, 1e9) || !calk(e, s, 1e9)) return 'wydarzenie'; } return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const ev = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]).sort((a, b) => a[0] - b[0]);
                const pq = new PQ(wiecej);
                let dzien = 0, i = 0, wyn = 0;
                while (i < n || pq.size) {
                    if (pq.empty()) dzien = Math.max(dzien, ev[i][0]);
                    while (i < n && ev[i][0] <= dzien) pq.push(ev[i++][1]);
                    while (pq.size && pq.top() < dzien) pq.pop();
                    if (pq.size) { pq.pop(); wyn++; }
                    dzien++;
                }
                return String(wyn);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> ev(n);
    for (auto &[s, e] : ev) cin >> s >> e;
    sort(ev.begin(), ev.end());
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    long long dzien = 0;
    int i = 0, wynik = 0;
    while (i < n || !pq.empty()) {
        if (pq.empty()) dzien = max(dzien, ev[i].first);
        while (i < n && ev[i].first <= dzien) {
            pq.push(ev[i].second);
            i++;
        }
        while (!pq.empty() && pq.top() < dzien) pq.pop();
        if (!pq.empty()) {
            pq.pop();
            wynik++;
        }
        dzien++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-kapital', krok: 9, level: 'srednie',
            title: 'Kapitał na projekty',
            short: 'Projekty posortowane po wymaganym kapitale, a w kopcu maksimum — zyski tych, na które już cię stać. k razy bierz najzyskowniejszy.',
            tags: ['sortowanie + kopiec', 'dostępne kandydaty', 'long long'],
            statement: ['Firma ma kapitał w i może zrealizować najwyżej k projektów, jeden po drugim. Projekt i wymaga kapitału co najmniej cᵢ (kapitał nie jest zużywany) i po realizacji zwiększa kapitał o pᵢ. Każdy projekt można zrealizować najwyżej raz. Jaki największy kapitał może mieć firma na końcu?',
                'Od czego zacząć: posortuj projekty po cᵢ. Przed każdym wyborem dorzuć do kopca maksimum zyski wszystkich projektów, na które już stać firmę (cᵢ ≤ kapitał), i zrealizuj ten z wierzchu. Jeśli kopiec jest pusty, na nic więcej firmy nie stać.'],
            input_format: ['W pierwszym wierszu liczby n, k i w.', 'W każdym z kolejnych n wierszy dwie liczby cᵢ i pᵢ.'],
            output_format: ['Jedna liczba — największy kapitał na końcu.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ k ≤ n', '0 ≤ w ≤ 10⁹', '0 ≤ cᵢ ≤ 10⁹', '0 ≤ pᵢ ≤ 10⁶'],
            examples: [{ input: '3 2 0\n0 1\n1 2\n1 3', note: 'Na początku stać nas tylko na projekt 1 (zysk 1). Mając 1, możemy wybrać projekt 3 (zysk 3) — razem 4.' }],
            hint: R`int j = 0; for (int r = 0; r < k; r++) { while (j < n && pr[j].first <= w) { pq.push(pr[j].second); j++; } if (pq.empty()) break; w += pq.top(); pq.pop(); }. Kapitał w long long.`,
            tests: (r) => {
                const d = (k, w, p) => `${p.length} ${k} ${w}\n${p.map((q) => q.join(' ')).join('\n')}`;
                // wymagany kapitał częściej mały niż duży — żeby było z czego wybierać od początku
                const los = (n, k, w, C, Pm) => d(k, w, Array.from({ length: n }, () => [Math.floor(C * r() ** 3), r.int(0, Pm)]));
                return [d(1, 0, [[1, 5]]), d(1, 5, [[1, 5]]), d(3, 0, [[0, 0], [0, 0], [1, 9]]), los(10, 5, 3, 20, 10), los(5000, 5000, 0, 1000000000, 1000000), los(5000, 100, 1000, 1000000, 1000000), los(5000, 2500, 0, 50000, 30), los(5000, 5000, 1000000000, 1000000000, 1000000), los(5000, 3, 10, 100, 1000000)];
            },
            check: (inp) => { const t = nums(inp); const [n, k, w] = t; if (!calk(n, 1, 5000) || !calk(k, 1, n) || !calk(w, 0, 1e9) || t.length !== 2 * n + 3) return 'dane'; for (let i = 0; i < n; i++) if (!calk(t[3 + 2 * i], 0, 1e9) || !calk(t[4 + 2 * i], 0, 1e6)) return 'projekt'; return null; },
            solve: (inp) => {
                const t = nums(inp); const [n, k] = t; let w = t[2];
                const pr = Array.from({ length: n }, (_, i) => [t[3 + 2 * i], t[4 + 2 * i]]).sort((a, b) => a[0] - b[0]);
                const pq = new PQ(mniej);
                let j = 0;
                for (let rr = 0; rr < k; rr++) { while (j < n && pr[j][0] <= w) pq.push(pr[j++][1]); if (pq.empty()) break; w += pq.pop(); }
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    long long w;
    cin >> n >> k >> w;
    vector<pair<long long, long long>> pr(n);
    for (auto &[c, p] : pr) cin >> c >> p;
    sort(pr.begin(), pr.end());
    priority_queue<long long> pq;
    int j = 0;
    for (int r = 0; r < k; r++) {
        while (j < n && pr[j].first <= w) {
            pq.push(pr[j].second);
            j++;
        }
        if (pq.empty()) break;
        w += pq.top();
        pq.pop();
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-procesor-z-przerwa', krok: 9, level: 'srednie',
            title: 'Procesor z przerwą',
            short: 'Zadania tego samego rodzaju muszą być rozdzielone c jednostkami czasu. Kopiec liczników i kolejka zadań, które „stygną”.',
            tags: ['kopiec + kolejka', 'czas oczekiwania', 'symulacja'],
            statement: ['Procesor ma wykonać zadania opisane wielkimi literami — każda litera to jedno zadanie danego rodzaju. Każde zadanie zajmuje jedną jednostkę czasu. Między dwoma zadaniami tego samego rodzaju muszą minąć co najmniej c jednostek czasu, w których procesor robi coś innego albo odpoczywa. Ile najmniej jednostek czasu zajmie wykonanie wszystkich zadań?',
                'Od czego zacząć: zasymuluj procesor. Liczby pozostałych zadań każdego rodzaju trzymaj w kopcu maksimum, a rodzaje, które właśnie „stygną”, w kolejce par {pozostało, kiedy znów można}. W każdej jednostce czasu weź z kopca rodzaj z największą liczbą pozostałych zadań (jeśli jakiś jest gotowy). Gdy kopiec jest pusty, a kolejka nie — przeskocz zegarem do chwili, w której ostygnie pierwszy rodzaj.'],
            input_format: ['W pierwszym wierszu napis z wielkich liter — lista zadań.', 'W drugim wierszu liczba c.'],
            output_format: ['Jedna liczba — najmniejszy łączny czas.'],
            constraints: ['1 ≤ liczba zadań ≤ 10⁴', '0 ≤ c ≤ 100'],
            examples: [{ input: 'AAABBB\n2', note: 'A B przerwa A B przerwa A B — 8 jednostek.' }, { input: 'AAABBB\n0', note: 'Bez przerw wystarczy 6 jednostek.' }],
            hint: R`priority_queue<int> pq; queue<pair<int, long long>> stygnie;. Pętla: while (!pq.empty() || !stygnie.empty()) { if (pq.empty()) czas = stygnie.front().second; if (!stygnie.empty() && stygnie.front().second <= czas) { pq.push(stygnie.front().first); stygnie.pop(); } … }. Kolejka zachowuje kolejność, bo każdy rodzaj stygnie tak samo długo.`,
            tests: (r) => {
                const d = (s, c) => `${s}\n${c}`;
                return [d('A', 0), d('A', 100), d('AA', 0), d('AA', 3), d('AAABBB', 2), d('ABCDEFG', 2), d(r.word(30, 'ABC'), 4), d(r.word(10000, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 100), d(r.word(10000, 'AB'), 10), d(r.word(10000, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 5), d('Z'.repeat(10000), 100), d(r.word(500, 'XY'), 0)];
            },
            check: (inp) => { const L = linie(inp); return L.length === 2 && /^[A-Z]{1,10000}$/.test(L[0]) && calk(Number(L[1]), 0, 100) ? null : 'dane'; },
            solve: (inp) => {
                const [s, cs] = linie(inp), c = Number(cs);
                const ile = new Map();
                for (const ch of s) ile.set(ch, (ile.get(ch) || 0) + 1);
                const maks = Math.max(...ile.values()), ileMaks = [...ile.values()].filter((x) => x === maks).length;
                return String(Math.max(s.length, (maks - 1) * (c + 1) + ileMaks));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    long long c;
    cin >> s >> c;
    int ile[26] = {0};
    for (char ch : s) ile[ch - 'A']++;
    priority_queue<int> pq;
    for (int i = 0; i < 26; i++) {
        if (ile[i] > 0) pq.push(ile[i]);
    }
    queue<pair<int, long long>> stygnie;
    long long czas = 0;
    while (!pq.empty() || !stygnie.empty()) {
        if (pq.empty()) czas = max(czas, stygnie.front().second);
        while (!stygnie.empty() && stygnie.front().second <= czas) {
            pq.push(stygnie.front().first);
            stygnie.pop();
        }
        int x = pq.top();
        pq.pop();
        czas++;
        if (x - 1 > 0) stygnie.push({x - 1, czas + c});
    }
    cout << czas << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-tabliczka-mnozenia', krok: 9, level: 'srednie',
            title: 'k-ta w tabliczce mnożenia',
            short: 'Tabliczka n × m ma 10¹⁰ pól, ale k-ta najmniejsza wymaga tylko k zdjęć z kopca: każdy wiersz to posortowana lista i · 1, i · 2, …',
            tags: ['scalanie wierszy', 'kopiec kandydatów', 'long long'],
            statement: ['W tabliczce mnożenia n × m w polu (i, j) stoi liczba i · j (1 ≤ i ≤ n, 1 ≤ j ≤ m). Ustaw wszystkie n · m liczb niemalejąco (powtórzenia liczą się osobno) i wypisz k-tą z nich.',
                'Od czego zacząć: wiersz i to posortowana lista i, 2i, 3i, … — scal te listy kopcem jak w ćwiczeniu „Najmniejsze sumy par”. Na początku wrzuć {i · 1, {i, 1}} dla i ≤ min(n, k), a po każdym zdjęciu {i · j, {i, j}} wrzuć {i · (j + 1), {i, j + 1}}, jeśli j < m. k-te zdjęcie to odpowiedź.'],
            input_format: ['Jeden wiersz: liczby n, m i k.'],
            output_format: ['Jedna liczba — k-ta najmniejsza liczba w tabliczce.'],
            constraints: ['1 ≤ n, m ≤ 10⁵', '1 ≤ k ≤ min(n · m, 2 · 10⁵)'],
            examples: [{ input: '3 3 5', note: 'Liczby po kolei: 1, 2, 2, 3, 3, 4, 6, 6, 9. Piąta to 3.' }],
            hint: R`priority_queue<pair<long long, pair<int, int>>, vector<…>, greater<…>> pq;. Iloczyn i · j może mieć 10¹⁰ — zawsze 1LL * i * j. Po k − 1 zdjęciach odpowiedź jest na wierzchu.`,
            tests: () => ['1 1 1', '3 3 5', '3 3 9', '2 5 7', '100000 100000 200000', '100000 1 100000', '1 100000 99999', '300 400 120000', '7 100000 200000', '100000 2 199999'],
            check: (inp) => { const t = nums(inp); const [n, m, k] = t; return t.length === 3 && calk(n, 1, 1e5) && calk(m, 1, 1e5) && calk(k, 1, Math.min(n * m, 2e5)) ? null : 'dane'; },
            solve: (inp) => {
                const [n, m, k] = nums(inp);
                const ile = (x) => { let s = 0; for (let i = 1; i <= n; i++) s += Math.min(m, Math.floor(x / i)); return s; };
                let lo = 1, hi = n * m;
                while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (ile(mid) >= k) hi = mid; else lo = mid + 1; }
                return String(lo);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, m, k;
    cin >> n >> m >> k;
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    for (int i = 1; i <= min(n, k); i++) pq.push({(long long)i, {i, 1}});
    for (int r = 1; r < k; r++) {
        auto [v, p] = pq.top();
        pq.pop();
        auto [i, j] = p;
        if (j < m) pq.push({1LL * i * (j + 1), {i, j + 1}});
    }
    cout << pq.top().first << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-sale-wykladowe', krok: 9, level: 'srednie',
            title: 'Sale wykładowe',
            short: 'Wykład idzie do wolnej sali o najmniejszym numerze, a gdy wszystkie zajęte — czeka na pierwszą wolną. Która sala gościła najwięcej wykładów?',
            tags: ['dwa kopce', 'przesunięcie w czasie', 'liczniki sal'],
            statement: ['Na uczelni jest n sal ponumerowanych od 1 do n i m wykładów. Wykład i ma zaczynać się w chwili sᵢ i trwać do eᵢ (czas trwania eᵢ − sᵢ); chwile startu są różne. Wykłady przydzielamy w kolejności planowanych startów:',
                'jeśli w chwili startu jest wolna sala, wykład dostaje wolną salę o najmniejszym numerze; jeśli nie — wykład czeka do chwili, w której zwolni się pierwsza sala (przy remisie — sala o najmniejszym numerze), i trwa tyle samo co w planie. Sala zajęta do chwili t jest wolna dla wykładu, który zaczyna się w chwili t.',
                'Wypisz numer sali, w której odbyło się najwięcej wykładów (przy remisie — najmniejszy), a w drugim wierszu liczbę wykładów w każdej sali.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy dwie liczby sᵢ i eᵢ.'],
            output_format: ['W pierwszym wierszu numer sali.', 'W drugim wierszu n liczb — liczby wykładów w salach 1, …, n.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ m ≤ 5000', '0 ≤ sᵢ < eᵢ ≤ 10⁹', 'Wszystkie sᵢ są różne.'],
            examples: [{ input: '2 4\n0 10\n1 5\n2 7\n3 4', note: 'Wykład 0–10 w sali 1, 1–5 w sali 2. Wykład 2–7 czeka do chwili 5 (zwalnia się sala 2) i trwa do 10. Wykład 3–4 czeka do chwili 10 — wtedy wolne są obie sale, bierze salę 1. Sale: 2 i 2 wykłady, odpowiedź 1.' }],
            hint: R`Kopiec wolnych numerów sal (minimum) i kopiec zajętych {koniec, sala} (minimum). Przed wykładem przenieś do wolnych sale z końcem ≤ sᵢ. Jeśli wolnych brak: auto [t, sala] = zajete.top(); zajete.pop(); wykład kończy się w t + (eᵢ − sᵢ). Czas w long long — opóźnienia się sumują.`,
            tests: (r) => {
                const d = (n, p) => `${n} ${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, m, T, D) => {
                    const s = new Set();
                    while (s.size < m) s.add(r.int(0, T - 1));
                    return d(n, r.shuffle([...s]).map((x) => [x, Math.min(1000000000, x + r.int(1, D))]));
                };
                return [d(1, [[0, 1]]), d(1, [[0, 5], [1, 2]]), d(3, [[1, 2], [0, 10], [2, 3]]), los(2, 10, 30, 10), los(100, 5000, 1000000000, 10000000), los(3, 5000, 100000, 1000), los(100, 5000, 10000, 1000000), los(10, 5000, 1000000000, 1000000000), los(7, 2000, 3000, 2)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m] = t;
                if (!calk(n, 1, 100) || !calk(m, 1, 5000) || t.length !== 2 * m + 2) return 'dane';
                const s = new Set();
                for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 0, 1e9) || !calk(b, 0, 1e9) || a >= b || s.has(a)) return 'wykład'; s.add(a); }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const w = Array.from({ length: m }, (_, i) => [t[2 + 2 * i], t[3 + 2 * i]]).sort((a, b) => a[0] - b[0]);
                const wolne = new PQ(wiecej, Array.from({ length: n }, (_, i) => i + 1)), zajete = new PQ(wiecejKrotka), ile = new Array(n + 1).fill(0);
                for (const [s, e] of w) {
                    while (zajete.size && zajete.top()[0] <= s) wolne.push(zajete.pop()[1]);
                    if (wolne.size) { const sala = wolne.pop(); ile[sala]++; zajete.push([e, sala]); }
                    else { const [k, sala] = zajete.pop(); ile[sala]++; zajete.push([k + e - s, sala]); }
                }
                let best = 1;
                for (let i = 2; i <= n; i++) if (ile[i] > ile[best]) best = i;
                return best + '\n' + ile.slice(1).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<pair<long long, long long>> w(m);
    for (auto &[s, e] : w) cin >> s >> e;
    sort(w.begin(), w.end());
    priority_queue<int, vector<int>, greater<int>> wolne;
    for (int i = 1; i <= n; i++) wolne.push(i);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> zajete;
    vector<int> ile(n + 1, 0);
    for (auto [s, e] : w) {
        while (!zajete.empty() && zajete.top().first <= s) {
            wolne.push(zajete.top().second);
            zajete.pop();
        }
        if (!wolne.empty()) {
            int sala = wolne.top();
            wolne.pop();
            ile[sala]++;
            zajete.push({e, sala});
        } else {
            auto [koniec, sala] = zajete.top();
            zajete.pop();
            ile[sala]++;
            zajete.push({koniec + (e - s), sala});
        }
    }
    int best = 1;
    for (int i = 2; i <= n; i++) {
        if (ile[i] > ile[best]) best = i;
    }
    cout << best << "\n";
    for (int i = 1; i <= n; i++) cout << ile[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-laczenie-po-k', krok: 9, level: 'srednie',
            title: 'Łączenie po kilka lin',
            short: 'Łączenie lin, ale naraz można połączyć do k lin. Sztuczka: dorzuć liny o długości 0, żeby każde łączenie mogło brać pełne k.',
            tags: ['łączenie najmniejszych', 'liny zerowe', 'long long'],
            statement: ['Masz n lin o podanych długościach. W jednym ruchu łączysz co najmniej 2 i najwyżej k lin w jedną — nowa lina ma długość równą sumie, a ruch kosztuje tyle, ile ta suma. Połącz wszystkie liny w jedną jak najtaniej i wypisz najmniejszy łączny koszt (dla jednej liny — 0).',
                'Od czego zacząć: jak przy zwykłym łączeniu lin, zawsze łącz najkrótsze — ale tylko jedno łączenie może być „niepełne”, i opłaca się, żeby było pierwsze. Najprościej dorzucić do kopca liny o długości 0, aż (liczba lin − 1) będzie podzielna przez (k − 1), a potem zawsze łączyć dokładnie k najkrótszych.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n długości lin.'],
            output_format: ['Jedna liczba — najmniejszy łączny koszt.'],
            constraints: ['1 ≤ n ≤ 10⁴', '2 ≤ k ≤ 10', 'Długości są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '4 3\n1 2 3 4', note: 'Najlepiej najpierw połączyć tylko dwie najkrótsze (1 + 2 = 3), a potem trzy liny 3, 3 i 4 (koszt 10). Razem 13. Dorzucenie jednej liny zerowej daje to samo: 0 + 1 + 2, potem 3 + 3 + 4.' }],
            hint: R`while ((pq.size() - 1) % (k - 1) != 0) pq.push(0);. Potem while (pq.size() > 1) { long long s = 0; for (int j = 0; j < k; j++) { s += pq.top(); pq.pop(); } koszt += s; pq.push(s); }.`,
            tests: (r) => [dk([5], 2), dk([5], 10), dk([1, 1], 2), dk([1, 2, 3, 4], 3), dk([1, 2, 3, 4, 5, 6], 2), dk(r.arr(10, 1, 20), 4), dk(r.arr(10000, 1, 1000000), 2), dk(r.arr(10000, 1, 1000000), 10), dk(r.arr(9999, 1, 1000000), 7), dk(r.arr(1000, 1, 3), 5)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 2, 10) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1], pq = new PQ(wiecej, t.slice(2));
                while ((pq.size - 1) % (k - 1) !== 0) pq.push(0);
                let koszt = 0;
                while (pq.size > 1) { let s = 0; for (let j = 0; j < k; j++) s += pq.pop(); koszt += s; pq.push(s); }
                return String(koszt);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    for (int i = 0; i < n; i++) {
        long long d;
        cin >> d;
        pq.push(d);
    }
    while ((pq.size() - 1) % (k - 1) != 0) pq.push(0);
    long long koszt = 0;
    while (pq.size() > 1) {
        long long s = 0;
        for (int j = 0; j < k; j++) {
            s += pq.top();
            pq.pop();
        }
        koszt += s;
        pq.push(s);
    }
    cout << koszt << "\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · trudne
        {
            id: 'kop-b-mediana-w-oknie', krok: 9, level: 'trudne',
            time_limit: '2 s',
            title: 'Mediana w przesuwanym oknie',
            short: 'Dwa kopce jak przy medianie, ale liczby też wypadają z okna. Leniwe usuwanie w obu kopcach i liczniki prawdziwych rozmiarów.',
            tags: ['dwa kopce', 'leniwe usuwanie', 'generator danych'],
            statement: ['Liczby generujesz sam: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m (w long long). Dla każdego okna k kolejnych liczb policz jego medianę — liczbę, która w posortowanym oknie stoi na miejscu ⌈k/2⌉ (przy parzystym k to mniejsza z dwóch środkowych). Wypisz sumę median wszystkich n − k + 1 okien.',
                'Od czego zacząć: dwa kopce jak w „Mediana na bieżąco” — dol (maksimum) i gora (minimum) — ale liczba, która wypada z okna, może leżeć głęboko w środku kopca. Usuwaj ją leniwie: zapisz w mapie usunięć tego kopca, w którym jest (jeśli x ≤ dol.top() — w dolnym, inaczej w górnym), i zmniejsz licznik prawdziwych elementów tego kopca. Wyrzucaj ją dopiero wtedy, gdy wyjdzie na wierzch. Rozmiary porównuj licznikami, nie size().'],
            input_format: ['Jeden wiersz: liczby n, s, a, b, m oraz k.'],
            output_format: ['Jedna liczba — suma median.'],
            constraints: ['1 ≤ k ≤ n ≤ 2 · 10⁵', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 5 3 1 17 3', note: 'Ciąg: 5, 16, 15, 12, 3, 10. Okna po 3 i ich mediany: (5 16 15) → 15, (16 15 12) → 15, (15 12 3) → 12, (12 3 10) → 10. Suma 52.' }],
            hint: R`Struktura z polami: dwa kopce, dwie mapy usunięć (map<long long, int>) i dwa liczniki. Funkcja sprzataj() zdejmuje z wierzchów elementy oznaczone w mapach, wyrownaj() przerzuca jeden element, gdy liczniki różnią się za bardzo — i za każdym razem woła sprzataj() przed odczytem wierzchu. Kolejność w pętli: dodaj xᵢ, usuń xᵢ₋ₖ, odczytaj medianę.`,
            tests: () => ['1 7 0 0 10 1', '6 5 3 1 17 3', '6 5 3 1 17 6', '10 3 7 1 100 4', '1000 7 31 3 1000 10', '200000 12345 48271 0 999999937 1000', '200000 1 16807 11 1000000000 2', '200000 999 69621 3 999999937 100000', '200000 5 21 7 1000000 199999', '200000 3 41 3 1000000 77', '200000 3 7 1 10 501'],
            check: (inp) => { const t = nums(inp); return t.length === 6 && dobryGen(t, 0, 2e5, 1e9) && calk(t[5], 1, t[0]) ? null : 'dane'; },
            solve: (inp) => {
                const [n, s, a, b, m, k] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const wart = [...new Set(x)].sort((p, q) => p - q), poz = new Map(wart.map((v, i) => [v, i + 1]));
                const N = wart.length, fw = new Int32Array(N + 1);
                const dod = (i, v) => { for (; i <= N; i += i & -i) fw[i] += v; };
                let LOG = 1; while (LOG * 2 <= N) LOG *= 2;
                const kty = (kk) => { let p = 0; for (let st = LOG; st; st >>= 1) if (p + st <= N && fw[p + st] < kk) { p += st; kk -= fw[p]; } return wart[p]; };
                let suma = 0;
                for (let i = 0; i < n; i++) {
                    dod(poz.get(x[i]), 1);
                    if (i >= k) dod(poz.get(x[i - k]), -1);
                    if (i >= k - 1) suma += kty(Math.ceil(k / 2));
                }
                return String(suma);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Mediana {
    priority_queue<long long> dol;
    priority_queue<long long, vector<long long>, greater<long long>> gora;
    map<long long, int> usunDol, usunGora;
    int ileDol = 0, ileGora = 0;
    void sprzataj() {
        while (!dol.empty() && usunDol[dol.top()] > 0) {
            usunDol[dol.top()]--;
            dol.pop();
        }
        while (!gora.empty() && usunGora[gora.top()] > 0) {
            usunGora[gora.top()]--;
            gora.pop();
        }
    }
    void wyrownaj() {
        sprzataj();
        if (ileDol > ileGora + 1) {
            gora.push(dol.top());
            dol.pop();
            ileDol--;
            ileGora++;
        } else if (ileGora > ileDol) {
            dol.push(gora.top());
            gora.pop();
            ileGora--;
            ileDol++;
        }
        sprzataj();
    }
    void dodaj(long long x) {
        if (ileDol == 0 || x <= dol.top()) {
            dol.push(x);
            ileDol++;
        } else {
            gora.push(x);
            ileGora++;
        }
        wyrownaj();
    }
    void usun(long long x) {
        if (x <= dol.top()) {
            usunDol[x]++;
            ileDol--;
        } else {
            usunGora[x]++;
            ileGora--;
        }
        wyrownaj();
    }
};
int main() {
    long long n, s, a, b, m, k;
    cin >> n >> s >> a >> b >> m >> k;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    Mediana med;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        med.dodaj(x[i]);
        if (i >= k) med.usun(x[i - k]);
        if (i >= k - 1) suma += med.dol.top();
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-najmniejszy-zakres', krok: 9, level: 'trudne',
            title: 'Najmniejszy zakres',
            short: 'Najkrótszy przedział, w którym jest choć jedna liczba z każdej listy. W kopcu po jednym kandydacie z listy i bieżące maksimum.',
            tags: ['scalanie list', 'bieżące maksimum', 'przesuwanie minimum'],
            statement: ['Masz k list liczb, każda jest posortowana niemalejąco i niepusta. Znajdź najkrótszy przedział [x, y], w którym leży co najmniej jedna liczba z każdej listy. Najkrótszy znaczy: o najmniejszym y − x, a przy remisie — o najmniejszym x.',
                'Od czego zacząć: weź po jednej liczbie z każdej listy — na początku pierwsze. Przedział od najmniejszej do największej z nich zawiera coś z każdej listy. Najmniejszą trzymaj na wierzchu kopca minimum {wartość, {lista, pozycja}}, a największą — w zmiennej. Jedyny sensowny ruch to zastąpienie najmniejszej następną liczbą z jej listy (i poprawienie maksimum). Gdy któraś lista się skończy — koniec.'],
            input_format: ['W pierwszym wierszu liczba k.', 'W każdym z kolejnych k wierszy: długość listy d (d ≥ 1), a po niej d liczb niemalejąco.'],
            output_format: ['Dwie liczby x i y.'],
            constraints: ['1 ≤ k ≤ 1000', 'Suma długości list nie przekracza 10⁴.', 'Liczby są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '3\n5 4 10 15 24 26\n4 0 9 12 20\n4 5 18 22 30', note: 'Przedział [20, 24] zawiera 24 z pierwszej listy, 20 z drugiej i 22 z trzeciej. Krótszego nie ma.' }],
            hint: R`long long naj = max z pierwszych elementów; bestX = pq.top().first, bestY = naj;. Pętla: auto [v, p] = pq.top(); if (naj - v < bestY - bestX) { bestX = v; bestY = naj; } pq.pop(); if (j + 1 == L[i].size()) break; pq.push({L[i][j + 1], {i, j + 1}}); naj = max(naj, L[i][j + 1]);. Minimum nigdy nie maleje, więc przy remisie wygrywa wcześniejszy, czyli mniejszy x.`,
            tests: (r) => {
                const d = (L) => `${L.length}\n${L.map((l) => [l.length, ...l].join(' ')).join('\n')}`;
                const lista = (n, lo, hi) => r.arr(n, lo, hi).sort((a, b) => a - b);
                return [d([[5]]), d([[1, 2], [1, 2]]), d([[1, 10], [2, 9], [3, 8]]), d([[0], [100], [-5, 50, 200]]), d(Array.from({ length: 5 }, () => lista(r.int(1, 8), 0, 50))),
                    d(Array.from({ length: 1000 }, () => lista(10, -1000000, 1000000))), d(Array.from({ length: 10 }, () => lista(1000, -1000000, 1000000))), d(Array.from({ length: 50 }, () => lista(200, 0, 1000))), d(Array.from({ length: 3 }, () => lista(3000, -1000000, 1000000))), d(Array.from({ length: 100 }, () => lista(100, 0, 9)))];
            },
            check: (inp) => {
                const t = nums(inp);
                if (!calk(t[0], 1, 1000)) return 'k';
                let p = 1, suma = 0;
                for (let j = 0; j < t[0]; j++) { const dl = t[p++]; if (!calk(dl, 1, 1e4)) return 'd'; const l = t.slice(p, p + dl); p += dl; suma += dl; if (!l.every((x, i) => calk(x, -1e6, 1e6) && (!i || l[i - 1] <= x))) return 'lista'; }
                return p === t.length && suma <= 1e4 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp), k = t[0], el = [];
                let p = 1;
                for (let j = 0; j < k; j++) { const dl = t[p++]; for (let i = 0; i < dl; i++) el.push([t[p + i], j]); p += dl; }
                el.sort((a, b) => a[0] - b[0]);
                const ile = new Array(k).fill(0);
                let pokryte = 0, l = 0, bx = 0, by = Infinity;
                for (let rr = 0; rr < el.length; rr++) {
                    if (ile[el[rr][1]]++ === 0) pokryte++;
                    while (pokryte === k) {
                        const x = el[l][0], y = el[rr][0];
                        if (y - x < by - bx || (y - x === by - bx && x < bx)) { bx = x; by = y; }
                        if (--ile[el[l][1]] === 0) pokryte--;
                        l++;
                    }
                }
                return `${bx} ${by}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    vector<vector<long long>> L(k);
    for (int i = 0; i < k; i++) {
        int d;
        cin >> d;
        L[i].resize(d);
        for (auto &x : L[i]) cin >> x;
    }
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    long long naj = LLONG_MIN;
    for (int i = 0; i < k; i++) {
        pq.push({L[i][0], {i, 0}});
        naj = max(naj, L[i][0]);
    }
    long long bestX = pq.top().first, bestY = naj;
    while (true) {
        auto [v, p] = pq.top();
        if (naj - v < bestY - bestX) {
            bestX = v;
            bestY = naj;
        }
        pq.pop();
        auto [i, j] = p;
        if (j + 1 == (int)L[i].size()) break;
        pq.push({L[i][j + 1], {i, j + 1}});
        naj = max(naj, L[i][j + 1]);
    }
    cout << bestX << " " << bestY << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-sciezka-wysilku', krok: 9, level: 'trudne',
            title: 'Ścieżka najmniejszego wysiłku',
            short: 'Wysiłek drogi to jej największy pojedynczy skok wysokości. Dijkstra, w którym zamiast sumy liczy się maksimum.',
            tags: ['Dijkstra z maksimum', 'plansza', 'minimalizacja największego kroku'],
            statement: ['Turysta idzie po mapie h × w, na której każde pole ma wysokość. Zaczyna w lewym górnym rogu, kończy w prawym dolnym i chodzi w górę, w dół, w lewo i w prawo. Wysiłek drogi to największa różnica wysokości między dwoma sąsiednimi polami na tej drodze (wartość bezwzględna). Jaki jest najmniejszy możliwy wysiłek?',
                'Od czego zacząć: to Dijkstra, tylko „długość” drogi liczy się inaczej — nie sumą, ale maksimum. Wejście z pola v na pole u daje drodze wysiłek max(wysiłek do v, |h[u] − h[v]|). Kopiec minimum {wysiłek, pole} działa tak samo jak przy sumie, bo wysiłek nigdy nie maleje, gdy droga się wydłuża.'],
            input_format: ['W pierwszym wierszu liczby h i w.', 'W każdym z kolejnych h wierszy w wysokości.'],
            output_format: ['Jedna liczba — najmniejszy wysiłek.'],
            constraints: ['1 ≤ h, w ≤ 100', 'Wysokości są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '3 3\n1 2 2\n3 8 2\n5 3 5', note: 'Droga 1 → 3 → 5 → 3 → 5 (w dół lewym brzegiem i po dolnym wierszu) ma skoki 2, 2, 2 i 2. Każda inna droga ma większy skok.' }],
            hint: R`dist[r][c] = najmniejszy wysiłek dojścia; dist[0][0] = 0. Po zdjęciu {d, (r, c)}: dla sąsiada nd = max(d, (long long)abs(h[nr][nc] - h[r][c])); if (nd < dist[nr][nc]) { dist[nr][nc] = nd; pq.push(…); }.`,
            tests: (r) => {
                const tekst = (k) => `${k.length} ${k[0].length}\n${k.map((w) => w.join(' ')).join('\n')}`;
                const gladka = (H, W, skok) => { const k = []; for (let i = 0; i < H; i++) { k.push([]); for (let j = 0; j < W; j++) { const b = i ? k[i - 1][j] : j ? k[i][j - 1] : 500000; k[i].push(Math.max(1, Math.min(1000000, b + r.int(-skok, skok)))); } } return k; };
                return ['1 1\n5', '1 2\n3 10', '2 2\n1 100\n100 1', tekst(Array.from({ length: 5 }, () => r.arr(6, 1, 20))), tekst(Array.from({ length: 100 }, () => r.arr(100, 1, 1000000))), tekst(gladka(100, 100, 1000)), tekst(gladka(100, 100, 30)), tekst(Array.from({ length: 1 }, () => r.arr(100, 1, 1000000))), tekst(Array.from({ length: 100 }, () => r.arr(1, 1, 1000000)))];
            },
            check: (inp) => { const t = nums(inp); const [hh, ww] = t; return calk(hh, 1, 100) && calk(ww, 1, 100) && t.length === hh * ww + 2 && t.slice(2).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [H, W] = t; const hgt = t.slice(2);
                const kraw = [];
                for (let i = 0; i < H; i++) for (let j = 0; j < W; j++) {
                    const v = i * W + j;
                    if (j + 1 < W) kraw.push([Math.abs(hgt[v] - hgt[v + 1]), v, v + 1]);
                    if (i + 1 < H) kraw.push([Math.abs(hgt[v] - hgt[v + W]), v, v + W]);
                }
                kraw.sort((a, b) => a[0] - b[0]);
                const o = Array.from({ length: H * W }, (_, i) => i);
                const f = (x) => { while (o[x] !== x) { o[x] = o[o[x]]; x = o[x]; } return x; };
                if (H * W === 1) return '0';
                for (const [w, a, b] of kraw) { o[f(a)] = f(b); if (f(0) === f(H * W - 1)) return String(w); }
                throw new Error('niespójna plansza');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, w;
    cin >> h >> w;
    vector<vector<long long>> t(h, vector<long long>(w));
    for (auto &wiersz : t)
        for (auto &x : wiersz) cin >> x;
    const long long INF = 1e18;
    vector<vector<long long>> dist(h, vector<long long>(w, INF));
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    dist[0][0] = 0;
    pq.push({0, {0, 0}});
    while (!pq.empty()) {
        auto [d, pole] = pq.top();
        pq.pop();
        auto [r, c] = pole;
        if (d > dist[r][c]) continue;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nc < 0 || nr >= h || nc >= w) continue;
            long long nd = max(d, llabs(t[nr][nc] - t[r][c]));
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
            id: 'kop-b-deszcz-na-wyspie', krok: 9, level: 'trudne',
            title: 'Deszcz na wyspie',
            short: 'Deszczówka w trzech wymiarach: woda ucieka przez najniższe miejsce brzegu. Kopiec minimum pól brzegowych i zalewanie od najniższego.',
            tags: ['kopiec pól brzegu', 'zalewanie od najniższego', 'long long'],
            statement: ['Wyspa to plansza h × w, a w każdym polu stoi słupek o podanej wysokości. Po ulewie woda zbiera się w zagłębieniach — tam, skąd nie może spłynąć poza planszę. Ile jednostek wody zostanie na wyspie? (Woda z pola może spłynąć do sąsiada w górę, w dół, w lewo i w prawo; pola na brzegu planszy niczego nie zatrzymują.)',
                'Od czego zacząć: woda w środku wyspy stoi najwyżej na poziomie najniższego miejsca „ściany”, która ją otacza. Wrzuć wszystkie pola brzegu do kopca minimum {poziom, pole} i oznacz je jako odwiedzone. Zdejmuj najniższe pole; każdy jego nieodwiedzony sąsiad dostaje wodę do poziomu max(poziom, swoja wysokość): woda += max(0, poziom − wysokość sąsiada), a sąsiad trafia do kopca z poziomem max(poziom, jego wysokość).'],
            input_format: ['W pierwszym wierszu liczby h i w.', 'W każdym z kolejnych h wierszy w wysokości.'],
            output_format: ['Jedna liczba — ilość wody.'],
            constraints: ['1 ≤ h, w ≤ 100', 'Wysokości są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '3 6\n1 4 3 1 3 2\n3 2 1 3 2 4\n2 3 3 2 3 1', note: 'Woda zbiera się w trzech polach środkowego wiersza: 2 jednostki na polu o wysokości 1 (między trójkami), 1 jednostka na polu o wysokości 2 obok czwórki i 1 jednostka na drugim polu o wysokości 2. Razem 4.' }],
            hint: R`vector<vector<bool>> odw(h, vector<bool>(w));. Brzeg: wiersz 0, wiersz h − 1, kolumna 0 i kolumna w − 1. Potem: auto [poz, pole] = pq.top(); pq.pop(); dla nieodwiedzonych sąsiadów: woda += max(0LL, poz - t[nr][nc]); pq.push({max(poz, t[nr][nc]), {nr, nc}});. Wody może być 10¹⁰ — long long.`,
            tests: (r) => {
                const tekst = (k) => `${k.length} ${k[0].length}\n${k.map((w) => w.join(' ')).join('\n')}`;
                const misa = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === 0 || j === 0 || i === n - 1 || j === n - 1 ? 1000000 : r.int(0, 999999))));
                const gory = (H, W) => Array.from({ length: H }, (_, i) => Array.from({ length: W }, (_, j) => Math.max(0, Math.min(1000000, Math.round(500000 + 400000 * Math.sin(i / 7) * Math.cos(j / 9) + r.int(-50000, 50000))))));
                return ['1 1\n5', '3 3\n5 5 5\n5 1 5\n5 5 5', '3 3\n5 5 5\n5 1 5\n5 4 5', tekst(Array.from({ length: 6 }, () => r.arr(7, 0, 9))), tekst(Array.from({ length: 100 }, () => r.arr(100, 0, 1000000))), tekst(misa(100)), tekst(gory(100, 100)), tekst(Array.from({ length: 100 }, () => r.arr(100, 0, 3))), tekst(Array.from({ length: 2 }, () => r.arr(100, 0, 1000000)))];
            },
            check: (inp) => { const t = nums(inp); const [hh, ww] = t; return calk(hh, 1, 100) && calk(ww, 1, 100) && t.length === hh * ww + 2 && t.slice(2).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                // inny sposób niż wzorcówka: poziom wody to najmniejsza możliwa „najwyższa ściana” na drodze do brzegu,
                // liczony powtarzanym poprawianiem (tam i z powrotem), aż nic się nie zmienia
                const t = nums(inp); const [H, W] = t; const hg = t.slice(2);
                const poz = hg.map((x, v) => { const i = Math.floor(v / W), j = v % W; return i === 0 || j === 0 || i === H - 1 || j === W - 1 ? x : Infinity; });
                for (let zm = true; zm;) {
                    zm = false;
                    for (const kier of [1, -1]) {
                        for (let s = 0; s < H * W; s++) {
                            const v = kier === 1 ? s : H * W - 1 - s;
                            const i = Math.floor(v / W), j = v % W;
                            if (i === 0 || j === 0 || i === H - 1 || j === W - 1) continue;
                            const m = Math.max(hg[v], Math.min(poz[v - 1], poz[v + 1], poz[v - W], poz[v + W]));
                            if (m < poz[v]) { poz[v] = m; zm = true; }
                        }
                    }
                }
                return String(poz.reduce((a, p, v) => a + p - hg[v], 0));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, w;
    cin >> h >> w;
    vector<vector<long long>> t(h, vector<long long>(w));
    for (auto &wiersz : t)
        for (auto &x : wiersz) cin >> x;
    vector<vector<bool>> odw(h, vector<bool>(w, false));
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (i == 0 || j == 0 || i == h - 1 || j == w - 1) {
                odw[i][j] = true;
                pq.push({t[i][j], {i, j}});
            }
        }
    }
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    long long woda = 0;
    while (!pq.empty()) {
        auto [poziom, pole] = pq.top();
        pq.pop();
        auto [r, c] = pole;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nc < 0 || nr >= h || nc >= w || odw[nr][nc]) continue;
            odw[nr][nc] = true;
            woda += max(0LL, poziom - t[nr][nc]);
            pq.push({max(poziom, t[nr][nc]), {nr, nc}});
        }
    }
    cout << woda << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-loty-z-przesiadkami', krok: 9, level: 'trudne',
            title: 'Loty z przesiadkami',
            short: 'Najtańszy lot z co najwyżej k przesiadkami. Stan to para (miasto, ile lotów już było) — Dijkstra po stanach.',
            tags: ['graf stanów', 'limit przesiadek', 'Dijkstra'],
            statement: ['Jest n miast i m lotów; lot a → b kosztuje w złotych (tylko w tę stronę). Chcesz dolecieć z miasta s do miasta t, robiąc co najwyżej k przesiadek, czyli wykonując najwyżej k + 1 lotów. Ile najmniej zapłacisz? Jeśli się nie da, wypisz −1.',
                'Od czego zacząć: zwykły Dijkstra nie pilnuje liczby lotów — najtańsza trasa może mieć ich za dużo. Rozszerz stan: (miasto, ile lotów już wykonano). dist[v][e] to najmniejszy koszt dotarcia do v po dokładnie e lotach. Z (v, e) lot do u prowadzi do (u, e + 1) — o ile e + 1 ≤ k + 1. Pierwsze zdjęcie z kopca stanu z miastem t daje odpowiedź.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w.', 'W ostatnim wierszu liczby s, t i k.'],
            output_format: ['Jedna liczba — najmniejszy koszt albo −1.'],
            constraints: ['2 ≤ n ≤ 500', '0 ≤ m ≤ 5000', '1 ≤ w ≤ 10⁴', '1 ≤ s, t ≤ n, s ≠ t', '0 ≤ k ≤ 100', 'Każdy lot a → b występuje najwyżej raz, a ≠ b.'],
            examples: [{ input: '4 5\n1 2 100\n2 3 100\n3 4 100\n1 3 500\n1 4 900\n1 4 1', note: 'Najtaniej jest lecieć 1 → 2 → 3 → 4 za 300, ale to dwie przesiadki. Z jedną przesiadką: 1 → 3 → 4 za 600.' }],
            hint: R`vector<vector<long long>> dist(n + 1, vector<long long>(k + 2, INF));. W kopcu {koszt, {miasto, loty}}. Po zdjęciu: if (v == t) → wypisz koszt. Relaksuj tylko, gdy loty + 1 <= k + 1.`,
            tests: (r) => {
                const d = (n, kraw, s, t, k) => `${n} ${kraw.length}` + (kraw.length ? '\n' + kraw.map((e) => e.join(' ')).join('\n') : '') + `\n${s} ${t} ${k}`;
                const los = (n, m, k, spojny) => { const s = r.int(1, n); let t; do t = r.int(1, n); while (t === s); return d(n, losGrafW(r, n, m, 1, 10000, { spojny, skierowany: true }), s, t, k); };
                return [d(2, [], 1, 2, 5), d(2, [[1, 2, 7]], 1, 2, 0), d(3, [[1, 2, 1], [2, 3, 1], [1, 3, 5]], 1, 3, 0), los(10, 30, 2, true), los(500, 5000, 3, false), los(500, 5000, 100, false), los(500, 5000, 0, false), los(100, 5000, 10, false), los(500, 2000, 50, true)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m] = t;
                if (t.length !== 3 * m + 5 || !grafOk2(t, n, m)) return 'graf';
                const [s, tt, k] = t.slice(2 + 3 * m);
                return calk(s, 1, n) && calk(tt, 1, n) && s !== tt && calk(k, 0, 100) ? null : 's t k';
            },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const [s, tt, k] = t.slice(2 + 3 * m);
                let d = new Array(n + 1).fill(Infinity);
                d[s] = 0;
                let naj = Infinity;
                for (let e = 0; e < k + 1; e++) {
                    const nd = new Array(n + 1).fill(Infinity);
                    for (let i = 0; i < m; i++) { const a = t[2 + 3 * i], b = t[3 + 3 * i], w = t[4 + 3 * i]; if (d[a] + w < nd[b]) nd[b] = d[a] + w; }
                    d = nd;
                    naj = Math.min(naj, d[tt]);
                }
                return String(naj === Infinity ? -1 : naj);
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
    }
    int s, t, k;
    cin >> s >> t >> k;
    vector<vector<long long>> dist(n + 1, vector<long long>(k + 2, INF));
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    dist[s][0] = 0;
    pq.push({0, {s, 0}});
    while (!pq.empty()) {
        auto [d, stan] = pq.top();
        pq.pop();
        auto [v, e] = stan;
        if (d > dist[v][e]) continue;
        if (v == t) {
            cout << d << "\n";
            return 0;
        }
        if (e + 1 > k + 1) continue;
        for (auto [u, w] : g[v]) {
            if (d + w < dist[u][e + 1]) {
                dist[u][e + 1] = d + w;
                pq.push({dist[u][e + 1], {u, e + 1}});
            }
        }
    }
    cout << -1 << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-siec-swiatlowodowa', krok: 9, level: 'trudne',
            title: 'Sieć światłowodowa',
            short: 'Połącz wszystkie miasta najtaniej: rośnij od miasta 1, zawsze dokładając najtańszy kabel do nowego miasta. Algorytm Prima z kopcem.',
            tags: ['algorytm Prima', 'kopiec krawędzi', 'pomijanie odwiedzonych'],
            statement: ['Trzeba połączyć światłowodem n miast. Można położyć m różnych kabli: kabel między miastami a i b kosztuje w. Sygnał biegnie kablami w obie strony i może przechodzić przez inne miasta. Ile najmniej kosztuje sieć, w której z każdego miasta da się dotrzeć do każdego innego? Jeśli się nie da, wypisz −1.',
                'Od czego zacząć: buduj sieć od miasta 1. Trzymaj w kopcu minimum kable {koszt, miasto}, które prowadzą z miast już podłączonych. Zdejmuj najtańszy; jeśli prowadzi do miasta już podłączonego — pomiń go (jak nieaktualny wpis w Dijkstrze); w przeciwnym razie podłącz to miasto, dolicz koszt i wrzuć wszystkie kable z tego miasta. To algorytm Prima — wygląda prawie jak Dijkstra, tylko w kopcu jest koszt kabla, a nie odległość od startu.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy trzy liczby a, b i w.'],
            output_format: ['Jedna liczba — najmniejszy koszt sieci albo −1.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ w ≤ 10⁶', 'a ≠ b'],
            examples: [{ input: '4 5\n1 2 4\n1 3 1\n3 2 2\n2 4 5\n3 4 8', note: 'Najtańsza sieć: kable 1–3 (1), 3–2 (2) i 2–4 (5) — razem 8.' }],
            hint: R`vector<bool> pod(n + 1, false); pq.push({0, 1});. while (!pq.empty()) { auto [c, v] = pq.top(); pq.pop(); if (pod[v]) continue; pod[v] = true; suma += c; ile++; for (auto [u, w] : g[v]) if (!pod[u]) pq.push({w, u}); }. Na końcu: ile < n → −1.`,
            tests: (r) => {
                const g = (n, m, spojny, wmax) => grafWTxt(n, losGrafW(r, n, m, 1, wmax, { spojny }));
                return [grafWTxt(2, []), grafWTxt(2, [[1, 2, 3]]), grafWTxt(3, [[1, 2, 1], [2, 3, 1], [1, 3, 1]]), g(10, 20, true, 10), g(2000, 5000, true, 1000000), g(2000, 1999, true, 1000000), g(2000, 5000, false, 1000000), g(2000, 5000, true, 2), g(100, 4950, true, 1000000)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return t.length === 3 * m + 2 && grafOk2(t, n, m, 2000, 5000, 1e6) ? null : 'graf'; },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const k = []; for (let i = 0; i < m; i++) k.push([t[4 + 3 * i], t[2 + 3 * i], t[3 + 3 * i]]);
                k.sort((a, b) => a[0] - b[0]);
                const o = Array.from({ length: n + 1 }, (_, i) => i);
                const f = (x) => { while (o[x] !== x) { o[x] = o[o[x]]; x = o[x]; } return x; };
                let s = 0, ile = 1;
                for (const [w, a, b] of k) { const fa = f(a), fb = f(b); if (fa !== fb) { o[fa] = fb; s += w; ile++; } }
                return String(ile === n ? s : -1);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
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
    vector<bool> pod(n + 1, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, 1});
    long long suma = 0;
    int ile = 0;
    while (!pq.empty()) {
        auto [c, v] = pq.top();
        pq.pop();
        if (pod[v]) continue;
        pod[v] = true;
        suma += c;
        ile++;
        for (auto [u, w] : g[v]) {
            if (!pod[u]) pq.push({w, u});
        }
    }
    if (ile < n) cout << -1 << "\n";
    else cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-druzyna-marzen', krok: 9, level: 'trudne',
            title: 'Drużyna marzeń',
            short: 'Siła drużyny to suma szybkości razy najmniejsza wytrwałość. Przeglądaj od najwytrwalszych i trzymaj k najszybszych w kopcu minimum.',
            tags: ['sortowanie + kopiec', 'kopiec rozmiaru k', 'long long'],
            statement: ['Trener wybiera drużynę z n zawodników, najwyżej k osób. Zawodnik i ma szybkość sᵢ i wytrwałość eᵢ. Siła drużyny to suma szybkości jej członków pomnożona przez najmniejszą wytrwałość w drużynie. Jaka jest największa możliwa siła drużyny?',
                'Od czego zacząć: posortuj zawodników od największej wytrwałości. Gdy dochodzisz do zawodnika i, załóż, że to on ma najmniejszą wytrwałość w drużynie — pozostali są wybierani spośród wcześniejszych (wytrwalszych). Wtedy opłaca się wziąć najszybszych: trzymaj w kopcu minimum szybkości wybranych i ich sumę, a gdy wybranych jest więcej niż k, wyrzuć najwolniejszego. Kandydat na wynik: suma · eᵢ.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z kolejnych n wierszy dwie liczby sᵢ i eᵢ.'],
            output_format: ['Jedna liczba — największa siła drużyny.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', '1 ≤ sᵢ, eᵢ ≤ 10⁵'],
            examples: [{ input: '6 2\n2 5\n10 4\n3 2\n1 9\n5 7\n8 3', note: 'Najlepiej wziąć zawodników o szybkościach 10 i 5: (10 + 5) · min(4, 7) = 60.' }],
            hint: R`sort malejąco po e. for (auto [e, s] : z) { pq.push(s); suma += s; if (pq.size() > k) { suma -= pq.top(); pq.pop(); } wynik = max(wynik, suma * e); }. suma · e to nawet 5 · 10¹³ — long long.`,
            tests: (r) => {
                const d = (p, k) => `${p.length} ${k}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, k, S, E) => d(Array.from({ length: n }, () => [r.int(1, S), r.int(1, E)]), k);
                return [d([[5, 5]], 1), d([[1, 10], [10, 1]], 2), d([[3, 3], [3, 3], [3, 3]], 2), los(12, 4, 20, 20), los(5000, 2500, 100000, 100000), los(5000, 5000, 100000, 100000), los(5000, 1, 100000, 100000), los(5000, 100, 100000, 10), los(5000, 3000, 10, 100000)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, n) && t.length === 2 * n + 2 && t.slice(2).every((x) => calk(x, 1, 1e5)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, k] = t;
                const z = Array.from({ length: n }, (_, i) => [t[3 + 2 * i], t[2 + 2 * i]]).sort((a, b) => b[0] - a[0]);
                const pq = new PQ(wiecej);
                let s = 0, best = 0;
                for (const [e, sp] of z) { pq.push(sp); s += sp; if (pq.size > k) s -= pq.pop(); best = Math.max(best, s * e); }
                return String(best);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<pair<long long, long long>> z(n);
    for (auto &[e, s] : z) cin >> s >> e;
    sort(z.rbegin(), z.rend());
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    long long suma = 0, wynik = 0;
    for (auto [e, s] : z) {
        pq.push(s);
        suma += s;
        if ((int)pq.size() > k) {
            suma -= pq.top();
            pq.pop();
        }
        wynik = max(wynik, suma * e);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-b-final-planista', krok: 9, level: 'trudne',
            title: 'Wielki finał: planista procesora',
            short: 'Procesy z priorytetami przychodzą w różnych chwilach, a ważniejszy proces natychmiast przerywa mniej ważny. Symulacja zdarzeń z kopcem gotowych procesów.',
            tags: ['symulacja zdarzeń', 'struktura z operator<', 'wywłaszczanie'],
            statement: ['System operacyjny ma jeden procesor i n procesów ponumerowanych od 1 do n. Proces i pojawia się w chwili aᵢ, potrzebuje dᵢ jednostek czasu procesora i ma priorytet pᵢ (większa liczba — ważniejszy proces). Od chwili pojawienia się do zakończenia proces jest gotowy do pracy.',
                'W każdej chwili procesor wykonuje najważniejszy gotowy proces: o największym priorytecie, przy remisie — ten, który pojawił się wcześniej, a przy kolejnym remisie — o mniejszym numerze. Gdy pojawi się proces ważniejszy od wykonywanego, procesor natychmiast przełącza się na niego (to wywłaszczenie), a przerwany proces czeka z pozostałym czasem pracy. Proces mniej albo tak samo ważny niczego nie przerywa. Gdy żaden proces nie jest gotowy, procesor odpoczywa.',
                'Wypisz: w pierwszym wierszu chwile zakończenia procesów 1, 2, …, n; w drugim — liczbę wywłaszczeń; w trzecim — łączny czas czekania wszystkich procesów (dla procesu i to koniec − aᵢ − dᵢ); w czwartym — łączny czas odpoczynku procesora od chwili 0 do zakończenia ostatniego procesu.',
                'Od czego zacząć: posortuj procesy po chwili pojawienia się i symuluj skokami — od zdarzenia do zdarzenia. Gotowe procesy trzymaj w kopcu struktur z operatorem < (mniejszy znaczy: mniej ważny), a pozostały czas pracy w tablicy. Procesor wykonuje wierzch kopca aż do najbliższego z dwóch zdarzeń: końca tego procesu albo pojawienia się następnego procesu. Wywłaszczenie liczysz wtedy, gdy wierzch kopca zmienił się, choć poprzednio wykonywany proces jeszcze się nie skończył.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy trzy liczby aᵢ, dᵢ i pᵢ.'],
            output_format: ['Cztery wiersze opisane w treści.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ aᵢ ≤ 10⁹', '1 ≤ dᵢ ≤ 10⁶', '1 ≤ pᵢ ≤ 100'],
            examples: [{ input: '4\n0 5 1\n1 2 3\n2 2 3\n10 1 2', note: 'P1 pracuje od 0. W chwili 1 przychodzi ważniejszy P2 — wywłaszczenie, P2 pracuje 1–3 (P3 z tym samym priorytetem przychodzi później, więc nie przerywa). Potem P3 (3–5) i dokończenie P1 (5–9). Procesor odpoczywa 9–10, a P4 pracuje 10–11. Czekanie: 4 + 0 + 1 + 0 = 5.' }],
            hint: R`struct Proces { int p; long long a; int id; bool operator<(const Proces &o) const { if (p != o.p) return p < o.p; if (a != o.a) return a > o.a; return id > o.id; } };. Pętla: wrzuć procesy z a ≤ czas; jeśli kopiec pusty — odpoczynek do następnego a; inaczej cur = top(), nast = następne a (albo nieskończoność); jeśli czas + zostalo[cur] ≤ nast — proces kończy się, pop; w przeciwnym razie zostalo[cur] -= nast − czas i czas = nast.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, T, D, Pm) => d(Array.from({ length: n }, () => [r.int(0, T), r.int(1, D), r.int(1, Pm)]));
                return [d([[0, 1, 1]]), d([[5, 3, 2]]), d([[0, 10, 1], [2, 3, 2], [4, 1, 3]]), d([[0, 5, 2], [0, 5, 2], [0, 5, 2]]), d([[3, 2, 1], [3, 2, 1], [1, 1, 1]]), los(8, 20, 5, 3), los(40, 100, 10, 5),
                    los(2000, 1000000000, 1000000, 100), los(2000, 100000, 1000, 100), los(2000, 2000000, 1000000, 3), los(2000, 0, 1000000, 100), los(2000, 500000, 500, 1), los(1500, 30000, 50, 10)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 2000) || t.length !== 3 * n + 1) return 'n'; for (let i = 0; i < n; i++) if (!calk(t[1 + 3 * i], 0, 1e9) || !calk(t[2 + 3 * i], 1, 1e6) || !calk(t[3 + 3 * i], 1, 100)) return 'proces'; return null; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const pr = Array.from({ length: n }, (_, i) => ({ a: t[1 + 3 * i], d: t[2 + 3 * i], p: t[3 + 3 * i], id: i + 1 }));
                const kol = pr.slice().sort((x, y) => x.a - y.a || x.id - y.id);
                const mniejWazny = (x, y) => (x.p !== y.p ? x.p < y.p : x.a !== y.a ? x.a > y.a : x.id > y.id);
                const pq = new PQ(mniejWazny), zost = new Array(n + 1).fill(0), kon = new Array(n + 1).fill(0);
                for (const q of pr) zost[q.id] = q.d;
                let czas = 0, j = 0, zrob = 0, wyw = 0, odp = 0, ostatni = -1;
                while (zrob < n) {
                    while (j < n && kol[j].a <= czas) pq.push(kol[j++]);
                    if (pq.empty()) { odp += kol[j].a - czas; czas = kol[j].a; ostatni = -1; continue; }
                    const cur = pq.top();
                    if (ostatni !== -1 && ostatni !== cur.id && zost[ostatni] > 0) wyw++;
                    const nast = j < n ? kol[j].a : Infinity;
                    if (czas + zost[cur.id] <= nast) { czas += zost[cur.id]; zost[cur.id] = 0; kon[cur.id] = czas; pq.pop(); zrob++; ostatni = -1; }
                    else { zost[cur.id] -= nast - czas; czas = nast; ostatni = cur.id; }
                }
                let czek = 0;
                for (const q of pr) czek += kon[q.id] - q.a - q.d;
                return [kon.slice(1).join(' '), wyw, czek, odp].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Proces {
    int p;
    long long a;
    int id;
    bool operator<(const Proces &o) const {
        if (p != o.p) return p < o.p;
        if (a != o.a) return a > o.a;
        return id > o.id;
    }
};
int main() {
    int n;
    cin >> n;
    vector<Proces> pr(n);
    vector<long long> d(n + 1), zostalo(n + 1), koniec(n + 1), przyjscie(n + 1);
    for (int i = 0; i < n; i++) {
        cin >> pr[i].a >> d[i + 1] >> pr[i].p;
        pr[i].id = i + 1;
        zostalo[i + 1] = d[i + 1];
        przyjscie[i + 1] = pr[i].a;
    }
    sort(pr.begin(), pr.end(), [](const Proces &x, const Proces &y) {
        if (x.a != y.a) return x.a < y.a;
        return x.id < y.id;
    });
    priority_queue<Proces> gotowe;
    long long czas = 0, odpoczynek = 0;
    int j = 0, zrobione = 0, wywlaszczenia = 0, ostatni = -1;
    while (zrobione < n) {
        while (j < n && pr[j].a <= czas) {
            gotowe.push(pr[j]);
            j++;
        }
        if (gotowe.empty()) {
            odpoczynek += pr[j].a - czas;
            czas = pr[j].a;
            ostatni = -1;
            continue;
        }
        Proces cur = gotowe.top();
        if (ostatni != -1 && ostatni != cur.id && zostalo[ostatni] > 0) wywlaszczenia++;
        long long nast = (j < n ? pr[j].a : LLONG_MAX);
        if (czas + zostalo[cur.id] <= nast) {
            czas += zostalo[cur.id];
            zostalo[cur.id] = 0;
            koniec[cur.id] = czas;
            gotowe.pop();
            zrobione++;
            ostatni = -1;
        } else {
            zostalo[cur.id] -= nast - czas;
            czas = nast;
            ostatni = cur.id;
        }
    }
    long long czekanie = 0;
    for (int i = 1; i <= n; i++) czekanie += koniec[i] - przyjscie[i] - d[i];
    for (int i = 1; i <= n; i++) cout << koniec[i] << " ";
    cout << "\n" << wywlaszczenia << "\n" << czekanie << "\n" << odpoczynek << "\n";
    return 0;
}`,
        },
    ];
};
