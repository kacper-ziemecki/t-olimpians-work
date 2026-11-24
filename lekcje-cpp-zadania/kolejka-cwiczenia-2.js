// Kolejka — ćwiczenia w trakcie lekcji, części 4–6: kolejka jako okno (ostatnie k elementów, ostatnie T sekund, suma w oknie,
// gąsienica, okno z mapą, scalanie dwóch kolejek), deque — kolejka z dwoma końcami (push_front, pop_back, d[i], palindromy,
// obroty, Home i End) oraz kolejka monotoniczna (kolejka indeksów, maksimum i minimum w oknie, dwie deque, okno w DP).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kolejka-pomoc');
    const { IMIONA, Kolejka, Deque, calk, generuj, losGen, dobryGen, KOD_GEN, oknaMax } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const czyImie = (s, max = 15) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const los = (r, n, a, b) => Array.from({ length: n }, () => r.int(a, b));
    const nk = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;

    return [
        // ================================================================ KROK 4 · kolejka jako okno
        {
            id: 'kol-suma-ostatnich', krok: 4, level: 'latwe',
            title: 'Suma ostatnich k',
            short: 'Po każdej nowej liczbie — suma k ostatnich. Nowa liczba wchodzi do kolejki i do sumy, a gdy kolejka jest za długa, najstarsza z niej wychodzi.',
            tags: ['okno długości k', 'suma bieżąca', 'long long'],
            statement: ['Licznik rowerów na ścieżce co minutę podaje, ile rowerów przejechało. Wczytaj n kolejnych odczytów i po każdym wypisz, ile rowerów przejechało w ciągu ostatnich k minut (licząc bieżącą). Na początku, gdy odczytów jest mniej niż k, zsumuj wszystkie dotychczasowe.',
                'Nie sumuj za każdym razem od nowa. Trzymaj ostatnie odczyty w kolejce i ich sumę w zmiennej: nowy odczyt wchodzi do kolejki i do sumy, a gdy w kolejce jest więcej niż k odczytów, najstarszy z niej wychodzi i odejmujesz go od sumy.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n odczytów.'],
            output_format: ['n wierszy — suma ostatnich k odczytów po każdym odczycie.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', '0 ≤ odczyt ≤ 10⁶'],
            examples: [{ input: '6 3\n4 1 7 2 0 5', note: 'Sumy: 4, 4 + 1 = 5, 4 + 1 + 7 = 12, potem okno się przesuwa: 1 + 7 + 2 = 10, 7 + 2 + 0 = 9, 2 + 0 + 5 = 7.' }],
            hint: R`queue<int> q; long long suma = 0;. Dla każdego x: q.push(x); suma += x; if ((int)q.size() > k) { suma -= q.front(); q.pop(); } cout << suma << "\n";. Suma 2000 odczytów po milion nie mieści się w int.`,
            tests: (r) => ['1 1\n0', '3 1\n5 6 7', '4 4\n1 2 3 4', nk(los(r, 2000, 1000000, 1000000), 2000), nk(los(r, 2000, 0, 1000000), 300), nk(los(r, 50, 0, 9), 4), nk(los(r, 1500, 0, 1000000), 1)],
            check: (inp) => { const t = nums(inp); const n = t[0], k = t[1]; return calk(n, 1, 2000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1], a = t.slice(2);
                const o = []; let s = 0;
                a.forEach((x, i) => { s += x; if (i >= k) s -= a[i - k]; o.push(s); });
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    queue<int> q;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
        suma += x;
        if ((int)q.size() > k) {
            suma -= q.front();
            q.pop();
        }
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-licznik-odwiedzin', krok: 4, level: 'latwe',
            title: 'Licznik odwiedzin',
            short: 'Strona liczy wejścia z ostatnich T milisekund. Kolejka trzyma chwile wejść, a z przodu wylatują te, które są już za stare.',
            tags: ['okno czasu', 'while z front()', 'wyrzucanie starych'],
            statement: ['Serwer zapisuje chwile, w których ktoś wszedł na stronę (w milisekundach, rosnąco). Po każdym wejściu w chwili t licznik pokazuje, ile było wejść w przedziale od t − T do t włącznie — razem z tym ostatnim.',
                'Wstawiaj chwile wejść do kolejki. Zanim odczytasz licznik, usuń z przodu kolejki wszystkie wejścia starsze niż t − T. Ponieważ chwile rosną, stare wejścia zawsze stoją na początku kolejki.'],
            input_format: ['W pierwszym wierszu liczby n i T.', 'W drugim wierszu n chwil wejść, rosnąco.'],
            output_format: ['n wierszy — stan licznika po każdym wejściu.'],
            constraints: ['1 ≤ n ≤ 3000', '0 ≤ T ≤ 10⁹', '0 ≤ chwile ≤ 10⁹, ściśle rosnące'],
            examples: [{ input: '5 3000\n1 100 3001 3002 7000', note: 'W chwili 3001 liczą się wejścia od 1 do 3001 — wszystkie trzy. W chwili 3002 wejście z chwili 1 jest już za stare (1 < 2). W chwili 7000 zostaje tylko ono samo.' }],
            hint: R`queue<int> q;. Dla każdej chwili t: q.push(t); while (q.front() < t - T) q.pop(); cout << q.size() << "\n";. Kolejka nigdy nie będzie pusta w tym while, bo właśnie wstawiłeś t, a t ≥ t − T.`,
            tests: (r) => {
                const gen = (n, dt, T) => { const o = []; let t = r.int(0, 10); for (let i = 0; i < n; i++) { o.push(t); t += r.int(1, dt); } return `${n} ${T}\n${o.join(' ')}`; };
                return ['1 0\n5', '3 0\n1 2 3', '4 1\n1 2 3 5', '5 3000\n1 100 3001 3002 7000', gen(3000, 1000, 3000), gen(3000, 300000, 1000000000), gen(3000, 5, 40), gen(100, 50, 100)];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0], T = t[1];
                if (!calk(n, 1, 3000) || !calk(T, 0, 1e9) || t.length !== n + 2) return 'n';
                const a = t.slice(2);
                return a.every((x, i) => calk(x, 0, 1e9) && (i === 0 || x > a[i - 1])) ? null : 'chwile';
            },
            solve: (inp) => {
                const t = nums(inp); const T = t[1], a = t.slice(2);
                let h = 0; const o = [];
                a.forEach((x, i) => { while (a[h] < x - T) h++; o.push(i - h + 1); });
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long T;
    cin >> n >> T;
    queue<long long> q;
    for (int i = 0; i < n; i++) {
        long long t;
        cin >> t;
        q.push(t);
        while (q.front() < t - T) q.pop();
        cout << q.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-alarm', krok: 4, level: 'latwe',
            title: 'Alarm temperatury',
            short: 'Średnia z ostatnich k minut przekracza próg — alarm się włącza; spada — wyłącza. Średnia bez ułamków: suma > T · k.',
            tags: ['suma w oknie', 'porównanie bez double', 'zmiany stanu'],
            statement: ['Czujnik w szklarni co minutę podaje temperaturę. Alarm patrzy na ostatnie k odczytów: od minuty k (gdy jest już k odczytów) alarm jest włączony wtedy, gdy średnia z ostatnich k odczytów jest większa niż T, a wyłączony — gdy jest mniejsza albo równa T. Przed minutą k alarm jest wyłączony.',
                'Wypisz każdą zmianę stanu alarmu: w której minucie się włączył, a w której wyłączył. Na końcu wypisz, przez ile minut alarm był włączony. Nie licz średniej na double: średnia jest większa niż T wtedy i tylko wtedy, gdy suma ostatnich k odczytów jest większa niż T · k.'],
            input_format: ['W pierwszym wierszu liczby n, k i T.', 'W drugim wierszu n temperatur — odczyty z minut 1, 2, …, n.'],
            output_format: ['Dla każdej zmiany wiersz minuta i: alarm wlaczony albo minuta i: alarm wylaczony.', 'Na końcu wiersz minut z alarmem: X.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', '−50 ≤ T ≤ 50', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '7 3 20\n18 21 22 25 15 19 30', note: 'Średnie od minuty 3: 61/3, 68/3, 62/3, 59/3, 64/3. Sumy porównujemy z 60: alarm włącza się w minucie 3, wyłącza w 6 i znów włącza w 7. Był włączony w minutach 3, 4, 5 i 7.' }],
            hint: R`Suma ostatnich k odczytów — jak w „Sumie ostatnich k”. bool wlaczony = false;. Od minuty k: bool teraz = suma > T * k; if (teraz != wlaczony) { wypisz zmianę; wlaczony = teraz; } if (teraz) minut++;.`,
            tests: (r) => {
                const gen = (n, k, T, a, b) => `${n} ${k} ${T}\n${los(r, n, a, b).join(' ')}`;
                const fala = (n, k, T) => `${n} ${k} ${T}\n${Array.from({ length: n }, (_, i) => Math.max(-50, Math.min(50, Math.round(20 + 15 * Math.sin(i / 9)) + r.int(-4, 4)))).join(' ')}`;
                return ['1 1 0\n0', '1 1 0\n1', '3 2 -50\n-50 -50 -49', gen(20, 1, 0, -3, 3), fala(5000, 10, 25), fala(5000, 60, 20), gen(5000, 5000, 0, -50, 50), gen(300, 4, 10, 0, 20)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, k, T] = t;
                return calk(n, 1, 5000) && calk(k, 1, n) && calk(T, -50, 50) && t.length === n + 3 && t.slice(3).every((x) => calk(x, -50, 50)) ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); const [n, k, T] = t; const a = t.slice(3);
                const o = []; let s = 0, wl = false, ile = 0;
                for (let i = 0; i < n; i++) {
                    s += a[i]; if (i >= k) s -= a[i - k];
                    if (i >= k - 1) { const teraz = s > T * k; if (teraz !== wl) { o.push(`minuta ${i + 1}: alarm ${teraz ? 'wlaczony' : 'wylaczony'}`); wl = teraz; } if (teraz) ile++; }
                }
                o.push(`minut z alarmem: ${ile}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k, T;
    cin >> n >> k >> T;
    queue<int> q;
    long long suma = 0;
    bool wlaczony = false;
    int minut = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        q.push(x);
        suma += x;
        if ((int)q.size() > k) {
            suma -= q.front();
            q.pop();
        }
        if (i >= k) {
            bool teraz = suma > (long long)T * k;
            if (teraz != wlaczony) {
                cout << "minuta " << i << ": alarm " << (teraz ? "wlaczony" : "wylaczony") << "\n";
                wlaczony = teraz;
            }
            if (teraz) minut++;
        }
    }
    cout << "minut z alarmem: " << minut << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-limit-wiadomosci', krok: 4, level: 'srednie',
            title: 'Limit wiadomości',
            short: 'Czat przyjmuje najwyżej k wiadomości na każde T sekund. Kolejka trzyma tylko przyjęte wiadomości z ostatnich T sekund — odrzuconych nie liczymy.',
            tags: ['okno czasu', 'kolejka tylko przyjętych', 'limit k'],
            statement: ['Żeby nikt nie zasypywał czatu, serwer przyjmuje wiadomość wysłaną w chwili t tylko wtedy, gdy w ostatnich T sekundach — czyli w chwilach od t − T + 1 do t — przyjął mniej niż k wiadomości. Wiadomości odrzucone nie liczą się do limitu.',
                'Dla każdej wiadomości, w kolejności wysyłania, wypisz OK albo ODRZUCONA, a na końcu — ile wiadomości przyjęto. W kolejce trzymaj chwile przyjętych wiadomości; przed decyzją usuń z jej przodu te, które wypadły z okna.'],
            input_format: ['W pierwszym wierszu liczby n, k i T.', 'W drugim wierszu n chwil wysłania wiadomości (niemalejąco).'],
            output_format: ['n wierszy OK albo ODRZUCONA, a potem wiersz przyjete: X.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ k ≤ 100', '1 ≤ T ≤ 10⁹', '0 ≤ chwile ≤ 10⁹, niemalejące'],
            examples: [{ input: '6 2 10\n1 3 5 11 12 20', note: 'Przyjęte są wiadomości z chwil 1 i 3. Wiadomość z chwili 5 przekroczyłaby limit. W chwili 11 okno to 2–11 — jest w nim tylko wiadomość z 3, więc 11 przechodzi. W 12 okno 3–12 ma już 3 i 11 — odrzucona. W 20 okno 11–20 ma tylko 11.' }],
            hint: R`queue<long long> q; — chwile przyjętych. Dla każdej chwili t: while (!q.empty() && q.front() <= t - T) q.pop(); if ((int)q.size() < k) { q.push(t); cout << "OK\n"; } else cout << "ODRZUCONA\n";.`,
            tests: (r) => {
                const gen = (n, k, T, dt) => { const o = []; let t = r.int(0, 5); for (let i = 0; i < n; i++) { o.push(t); t += r.int(0, dt); } return `${n} ${k} ${T}\n${o.join(' ')}`; };
                return ['1 1 1\n0', '3 1 1\n5 5 6', '4 2 1000000000\n0 0 999999999 1000000000', gen(30, 2, 10, 4), gen(3000, 5, 60, 20), gen(3000, 100, 1000, 3), gen(3000, 1, 7, 6), gen(500, 10, 100000, 50000)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, k, T] = t;
                if (!calk(n, 1, 3000) || !calk(k, 1, 100) || !calk(T, 1, 1e9) || t.length !== n + 3) return 'n';
                const a = t.slice(3);
                return a.every((x, i) => calk(x, 0, 1e9) && (i === 0 || x >= a[i - 1])) ? null : 'chwile';
            },
            solve: (inp) => {
                const t = nums(inp); const [, k, T] = t; const a = t.slice(3);
                const q = new Kolejka(); const o = [];
                for (const x of a) { while (!q.empty() && q.front() <= x - T) q.pop(); if (q.size < k) { q.push(x); o.push('OK'); } else o.push('ODRZUCONA'); }
                o.push(`przyjete: ${o.filter((x) => x === 'OK').length}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    long long T;
    cin >> n >> k >> T;
    queue<long long> q;
    int przyjete = 0;
    for (int i = 0; i < n; i++) {
        long long t;
        cin >> t;
        while (!q.empty() && q.front() <= t - T) q.pop();
        if ((int)q.size() < k) {
            q.push(t);
            przyjete++;
            cout << "OK\n";
        } else {
            cout << "ODRZUCONA\n";
        }
    }
    cout << "przyjete: " << przyjete << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-gasienica', krok: 4, level: 'srednie',
            title: 'Najdłuższy fragment z małą sumą',
            short: 'Gąsienica: głowa zjada kolejną liczbę, a gdy suma przekroczy S, ogon się podciąga. Kolejka to ciało gąsienicy — najdłuższe ciało to odpowiedź.',
            tags: ['gąsienica', 'okno zmiennej długości', 'suma w oknie'],
            statement: ['Dany jest ciąg n liczb dodatnich i liczba S. Znajdź najdłuższy spójny fragment ciągu (kilka kolejnych liczb), którego suma nie przekracza S. Wypisz jego długość i pozycję, od której się zaczyna (pozycje liczymy od 1). Jeśli najdłuższych fragmentów jest kilka, wybierz ten, który zaczyna się najwcześniej. Jeśli każda liczba jest większa niż S, wypisz brak.',
                'Użyj „gąsienicy”: przechodź po liczbach, dokładaj każdą na koniec kolejki i do sumy, a dopóki suma przekracza S — usuwaj liczby z przodu. Po każdym kroku kolejka to najdłuższy dobry fragment kończący się na bieżącej liczbie.'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n liczb dodatnich.'],
            output_format: ['Jeden wiersz: dlugosc L, od pozycji p albo brak.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ liczby ≤ 10⁴', '1 ≤ S ≤ 10⁹'],
            examples: [{ input: '8 10\n4 3 5 1 2 6 1 1', note: 'Fragmenty 3 5 1 (suma 9) i 5 1 2 (suma 8) mają długość 3. Dłuższy jest 1 2 6 1 o sumie 10 — zaczyna się na pozycji 4. Fragment 2 6 1 1 też ma długość 4 i sumę 10, ale zaczyna się później.' }],
            hint: R`queue<int> q; long long suma = 0;. Dla i-tej liczby x: q.push(x); suma += x; while (suma > S) { suma -= q.front(); q.pop(); } if ((int)q.size() > naj) { naj = q.size(); start = i - naj + 1; }. Ostra nierówność > zostawia najwcześniejszy fragment.`,
            tests: (r) => {
                return ['1 1\n2', '1 5\n5', '3 1000000000\n1 1 1', '8 10\n4 3 5 1 2 6 1 1', nk(los(r, 10000, 1, 10000), 1000000), nk(los(r, 10000, 1, 10), 30), nk(los(r, 10000, 1, 10000), 15000), nk(los(r, 200, 5, 50), 4), nk(Array.from({ length: 10000 }, () => 10000), 1000000000)];
            },
            check: (inp) => { const t = nums(inp); const [n, S] = t; return calk(n, 1, 1e4) && calk(S, 1, 1e9) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e4)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const S = t[1], a = t.slice(2);
                let l = 0, s = 0, naj = 0, st = 0;
                for (let i = 0; i < a.length; i++) { s += a[i]; while (s > S) s -= a[l++]; if (i - l + 1 > naj) { naj = i - l + 1; st = l + 1; } }
                return naj ? `dlugosc ${naj}, od pozycji ${st}` : 'brak';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    queue<int> q;
    long long suma = 0;
    int naj = 0, start = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        q.push(x);
        suma += x;
        while (suma > S) {
            suma -= q.front();
            q.pop();
        }
        if ((int)q.size() > naj) {
            naj = q.size();
            start = i - naj + 1;
        }
    }
    if (naj == 0) cout << "brak\n";
    else cout << "dlugosc " << naj << ", od pozycji " << start << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-rozne-w-oknie', krok: 4, level: 'srednie',
            title: 'Ile różnych w oknie?',
            short: 'Okno długości k jedzie po ciągu. Mapa liczy, ile razy każda wartość jest w oknie — gdy licznik spada do zera, wartość znika z mapy, a m.size() to wynik.',
            tags: ['okno + mapa', 'licznik w map', 'erase przy zerze'],
            statement: ['Dany jest ciąg n liczb i długość okna k. Dla każdego okna — fragmentu k kolejnych liczb, od pozycji 1–k, przez 2–(k+1), aż do (n−k+1)–n — wypisz, ile różnych wartości w nim jest.',
                'Trzymaj okno w kolejce, a w mapie map<int, int> zapisuj, ile razy każda wartość występuje w oknie. Nowa liczba zwiększa swój licznik; liczba, która wypada z przodu okna, zmniejsza swój i — jeśli licznik spadnie do zera — znika z mapy. Liczba różnych wartości to wtedy rozmiar mapy.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n − k + 1 liczb — liczby różnych wartości w kolejnych oknach.'],
            constraints: ['1 ≤ k ≤ n ≤ 3000', '1 ≤ liczby ≤ 10⁹'],
            examples: [{ input: '7 3\n5 5 2 5 7 7 7', note: 'Okna: 5 5 2 (dwie różne), 5 2 5 (dwie), 2 5 7 (trzy), 5 7 7 (dwie), 7 7 7 (jedna).' }],
            hint: R`map<int, int> ile; queue<int> q;. Dla każdego x: q.push(x); ile[x]++; if ((int)q.size() > k) { int y = q.front(); q.pop(); ile[y]--; if (ile[y] == 0) ile.erase(y); } if ((int)q.size() == k) cout << ile.size() << " ";.`,
            tests: (r) => ['1 1\n7', '4 4\n1 1 1 1', '5 1\n1 2 3 4 5', '7 3\n5 5 2 5 7 7 7', nk(los(r, 3000, 1, 1e9), 1000), nk(los(r, 3000, 1, 20), 50), nk(los(r, 3000, 1, 300), 300), nk(los(r, 100, 1, 5), 7)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 3000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1], a = t.slice(2);
                const m = new Map(); const o = [];
                a.forEach((x, i) => {
                    m.set(x, (m.get(x) || 0) + 1);
                    if (i >= k) { const y = a[i - k]; const c = m.get(y) - 1; if (c) m.set(y, c); else m.delete(y); }
                    if (i >= k - 1) o.push(m.size);
                });
                return o.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    queue<int> q;
    map<int, int> ile;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
        ile[x]++;
        if ((int)q.size() > k) {
            int y = q.front();
            q.pop();
            ile[y]--;
            if (ile[y] == 0) ile.erase(y);
        }
        if ((int)q.size() == k) cout << ile.size() << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-scalanie', krok: 4, level: 'srednie',
            title: 'Scalanie dwóch kolejek',
            short: 'Dwie posortowane kolejki zlewają się w jedną posortowaną: zawsze bierzesz mniejszy z dwóch przodów. Kto wygrywa remis — mówi treść.',
            tags: ['dwa fronty', 'scalanie', 'remisy'],
            statement: ['Dwie kolejki zawierają liczby posortowane niemalejąco. Scal je w jeden posortowany ciąg: dopóki obie kolejki nie są puste, porównaj ich pierwsze elementy i zabierz mniejszy (przy równych — ten z pierwszej kolejki). Gdy jedna kolejka się opróżni, dopisz resztę drugiej.',
                'Wypisz scalony ciąg, a w drugim wierszu — z której kolejki pochodzi każda kolejna liczba: znak 1 albo 2 dla każdej liczby, bez spacji.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb pierwszej kolejki.', 'W trzecim wierszu liczba m, w czwartym m liczb drugiej kolejki.'],
            output_format: ['Dwa wiersze: n + m liczb scalonego ciągu oraz napis z n + m znaków 1 i 2.'],
            constraints: ['1 ≤ n, m ≤ 2000', '0 ≤ liczby ≤ 1000, w każdej kolejce niemalejąco'],
            examples: [{ input: '3\n1 4 4\n4\n2 4 5 9', note: 'Najpierw 1 (kolejka 1), 2 (kolejka 2). Potem trzy czwórki: dwie z pierwszej kolejki idą przed czwórką z drugiej, bo przy remisie wygrywa pierwsza.' }],
            hint: R`while (!a.empty() && !b.empty()) { if (a.front() <= b.front()) { wynik.push_back(a.front()); skad += '1'; a.pop(); } else { … b … } }. Potem dwie pętle dla reszty a i reszty b.`,
            tests: (r) => {
                const sor = (n, m) => los(r, n, 0, m).sort((x, y) => x - y);
                const d = (a, b) => `${a.length}\n${a.join(' ')}\n${b.length}\n${b.join(' ')}`;
                return [d([5], [5]), d([1], [0]), d([0, 0, 0], [1000]), d(sor(2000, 1000), sor(2000, 1000)), d(sor(2000, 20), sor(1500, 20)), d(sor(10, 5), sor(2000, 1000)), d(sor(300, 3), sor(300, 3))];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0]; const a = t.slice(1, 1 + n); const m = t[1 + n]; const b = t.slice(2 + n);
                const sor = (x) => x.every((v, i) => calk(v, 0, 1000) && (i === 0 || v >= x[i - 1]));
                return calk(n, 1, 2000) && calk(m, 1, 2000) && b.length === m && sor(a) && sor(b) ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0]; const a = t.slice(1, 1 + n); const b = t.slice(2 + n);
                let i = 0, j = 0; const w = []; let s = '';
                while (i < a.length && j < b.length) { if (a[i] <= b[j]) { w.push(a[i++]); s += '1'; } else { w.push(b[j++]); s += '2'; } }
                while (i < a.length) { w.push(a[i++]); s += '1'; }
                while (j < b.length) { w.push(b[j++]); s += '2'; }
                return `${w.join(' ')}\n${s}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    queue<int> a, b;
    int n, m, x;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> x;
        a.push(x);
    }
    cin >> m;
    for (int i = 0; i < m; i++) {
        cin >> x;
        b.push(x);
    }
    string skad = "";
    while (!a.empty() && !b.empty()) {
        if (a.front() <= b.front()) {
            cout << a.front() << " ";
            a.pop();
            skad += '1';
        } else {
            cout << b.front() << " ";
            b.pop();
            skad += '2';
        }
    }
    while (!a.empty()) {
        cout << a.front() << " ";
        a.pop();
        skad += '1';
    }
    while (!b.empty()) {
        cout << b.front() << " ";
        b.pop();
        skad += '2';
    }
    cout << "\n" << skad << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-najaktywniejszy', krok: 4, level: 'srednie',
            title: 'Najaktywniejszy na czacie',
            short: 'Kto napisał najwięcej wiadomości w ostatnich T sekundach? Kolejka par {chwila, nick} jako okno i mapa z licznikami — po każdej wiadomości.',
            tags: ['okno czasu', 'queue<pair> + map', 'remis alfabetycznie'],
            statement: ['Na czacie pojawia się n wiadomości; każda ma chwilę wysłania (w sekundach, niemalejąco) i nick autora. Po każdej wiadomości wysłanej w chwili t moderator chce wiedzieć, kto jest najaktywniejszy, czyli kto napisał najwięcej wiadomości w ostatnich T sekundach — w chwilach od t − T + 1 do t (razem z tą ostatnią). Przy remisie wygrywa nick wcześniejszy w alfabecie.',
                'Trzymaj w kolejce pary {chwila, nick} z okna, a w mapie map<string, int> — ile wiadomości z okna napisał każdy autor. Po każdej wiadomości przejdź po mapie i znajdź najaktywniejszego.'],
            input_format: ['W pierwszym wierszu liczby n i T.', 'W każdym z n kolejnych wierszy chwila i nick.'],
            output_format: ['n wierszy — nick najaktywniejszego autora po każdej wiadomości.'],
            constraints: ['1 ≤ n ≤ 2500', '1 ≤ T ≤ 10⁹', '0 ≤ chwile ≤ 10⁹, niemalejące', 'Nicki to imiona z wielkiej litery (do 15 liter); różnych nicków jest najwyżej 20.'],
            examples: [{ input: '5 10\n1 Ola\n2 Kuba\n5 Kuba\n11 Ola\n13 Ola', note: 'Po drugiej wiadomości jest remis 1 : 1 — wygrywa Kuba, bo jest wcześniej w alfabecie. Po trzeciej Kuba ma 2, Ola 1. W chwili 11 okno to 2–11: Kuba 2, Ola 1. W chwili 13 okno 4–13: Kuba 1 (z chwili 5), Ola 2.' }],
            hint: R`queue<pair<int, string>> q; map<string, int> ile;. Wiadomość: q.push({t, nick}); ile[nick]++; while (q.front().first <= t - T) { ile[q.front().second]--; q.pop(); }. Potem pętla po mapie: for (auto &[kto, ile_w] : ile) if (ile_w > naj) … — mapa idzie alfabetycznie, więc ostra nierówność daje remisom pierwszeństwo alfabetyczne.`,
            tests: (r) => {
                const gen = (n, T, dt, ileN) => { const nicki = r.shuffle(IMIONA).slice(0, ileN); const o = []; let t = r.int(0, 3); for (let i = 0; i < n; i++) { o.push(`${t} ${r.pick(nicki)}`); t += r.int(0, dt); } return `${n} ${T}\n${o.join('\n')}`; };
                return ['1 1\n0 Ala', '3 1\n5 Ola\n5 Ala\n6 Ola', gen(20, 5, 3, 3), gen(2500, 60, 10, 20), gen(2500, 1000000000, 1000, 8), gen(2500, 3, 2, 20), gen(400, 40, 5, 4)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, T] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 2500) || !calk(T, 1, 1e9) || L.length !== n + 1) return 'n';
                let pt = 0; const nicki = new Set();
                for (const l of L.slice(1)) { const [t, s] = l.split(' '); if (!calk(Number(t), 0, 1e9) || Number(t) < pt || !czyImie(s)) return 'dane'; pt = Number(t); nicki.add(s); }
                return nicki.size <= 20 ? null : 'nicki';
            },
            solve: (inp) => {
                const L = linie(inp); const T = Number(L[0].split(' ')[1]);
                const w = L.slice(1).map((l) => { const [t, s] = l.split(' '); return [Number(t), s]; });
                const ile = new Map(); let h = 0; const o = [];
                w.forEach(([t, s]) => {
                    ile.set(s, (ile.get(s) || 0) + 1);
                    while (w[h][0] <= t - T) { ile.set(w[h][1], ile.get(w[h][1]) - 1); h++; }
                    let naj = '', c = 0;
                    for (const [k, v] of [...ile.entries()].sort((x, y) => (x[0] < y[0] ? -1 : 1))) if (v > c) { c = v; naj = k; }
                    o.push(naj);
                });
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long T;
    cin >> n >> T;
    queue<pair<long long, string>> q;
    map<string, int> ile;
    for (int i = 0; i < n; i++) {
        long long t;
        string nick;
        cin >> t >> nick;
        q.push({t, nick});
        ile[nick]++;
        while (q.front().first <= t - T) {
            ile[q.front().second]--;
            q.pop();
        }
        string naj = "";
        int najIle = 0;
        for (auto &[kto, ileW] : ile) {
            if (ileW > najIle) {
                najIle = ileW;
                naj = kto;
            }
        }
        cout << naj << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · deque
        {
            id: 'kol-deque-polecenia', krok: 5, level: 'latwe',
            title: 'Polecenia dla deque',
            short: 'Siedem poleceń dla kolejki z dwoma końcami: wstawianie i zdejmowanie z przodu i z tyłu, podgląd obu końców i rozmiar. Pusta deque — blad.',
            tags: ['push_front i push_back', 'pop_front i pop_back', 'empty przed pop'],
            statement: ['Obsłuż kolejkę dwustronną deque<int>, na początku pustą, i wykonaj q poleceń:',
                '• PUSH_FRONT x i PUSH_BACK x — wstaw x na początek albo na koniec (nic nie wypisuj),',
                '• POP_FRONT i POP_BACK — usuń element z początku albo z końca i wypisz go,',
                '• FRONT i BACK — wypisz element z początku albo z końca, nie usuwając go,',
                '• SIZE — wypisz liczbę elementów.',
                'Jeśli POP_FRONT, POP_BACK, FRONT albo BACK dotyczą pustej deque, wypisz blad.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu dla każdego polecenia, które coś wypisuje.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ x ≤ 10⁶'],
            examples: [{ input: '8\nPUSH_BACK 5\nPUSH_FRONT 3\nPUSH_BACK 9\nFRONT\nPOP_BACK\nPOP_BACK\nSIZE\nPOP_FRONT', note: 'Po trzech wstawieniach deque to 3 5 9. Dwa POP_BACK zdejmują 9 i 5, zostaje 3 — a potem POP_FRONT zdejmuje także ją.' }],
            hint: R`deque<int> d;. Odczyt przed zdjęciem jak w kolejce: cout << d.back() << "\n"; d.pop_back();. Pop i podgląd tylko po sprawdzeniu if (d.empty()) cout << "blad\n";.`,
            tests: (r) => {
                const gen = (q, pPush) => { const o = []; for (let i = 0; i < q; i++) o.push(r() < pPush ? `${r.pick(['PUSH_FRONT', 'PUSH_BACK'])} ${r.int(1, 1000000)}` : r.pick(['POP_FRONT', 'POP_BACK', 'FRONT', 'BACK', 'SIZE'])); return `${q}\n${o.join('\n')}`; };
                return ['1\nPOP_BACK', '3\nPUSH_FRONT 1\nBACK\nPOP_FRONT', '4\nSIZE\nFRONT\nPUSH_BACK 2\nFRONT', gen(30, 0.5), gen(3000, 0.5), gen(3000, 0.35), gen(3000, 0.7)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => /^(POP_FRONT|POP_BACK|FRONT|BACK|SIZE)$/.test(l) || (/^PUSH_(FRONT|BACK) \d+$/.test(l) && calk(Number(l.split(' ')[1]), 1, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const d = new Deque(); const o = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, x] = l.split(' ');
                    if (p === 'PUSH_FRONT') d.pushFront(Number(x));
                    else if (p === 'PUSH_BACK') d.pushBack(Number(x));
                    else if (p === 'SIZE') o.push(d.size);
                    else if (d.empty()) o.push('blad');
                    else if (p === 'POP_FRONT') o.push(d.popFront());
                    else if (p === 'POP_BACK') o.push(d.popBack());
                    else if (p === 'FRONT') o.push(d.front());
                    else o.push(d.back());
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int ile;
    cin >> ile;
    deque<int> d;
    for (int i = 0; i < ile; i++) {
        string p;
        cin >> p;
        if (p == "PUSH_FRONT" || p == "PUSH_BACK") {
            int x;
            cin >> x;
            if (p == "PUSH_FRONT") d.push_front(x);
            else d.push_back(x);
        } else if (p == "SIZE") {
            cout << d.size() << "\n";
        } else if (d.empty()) {
            cout << "blad\n";
        } else if (p == "POP_FRONT") {
            cout << d.front() << "\n";
            d.pop_front();
        } else if (p == "POP_BACK") {
            cout << d.back() << "\n";
            d.pop_back();
        } else if (p == "FRONT") {
            cout << d.front() << "\n";
        } else {
            cout << d.back() << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kol-palindromy', krok: 5, level: 'latwe',
            title: 'Palindromy z deque',
            short: 'Litery słowa trafiają do deque<char>. Dopóki zostały co najmniej dwie, porównujesz pierwszą z ostatnią i zdejmujesz obie — z dwóch stron naraz.',
            tags: ['deque<char>', 'front() i back()', 'pop z obu stron'],
            statement: ['Palindrom to słowo, które czytane od tyłu jest takie samo jak od przodu, na przykład kajak albo potop. Dla każdego z t słów sprawdź, czy jest palindromem.',
                'Wstaw litery słowa do deque<char>. Dopóki w deque są co najmniej dwie litery: porównaj pierwszą z ostatnią — jeśli są różne, słowo nie jest palindromem; jeśli są takie same, zdejmij obie (pop_front i pop_back) i sprawdzaj dalej.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jedno słowo.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 100', 'Słowa składają się z małych liter i mają od 1 do 1000 znaków; łącznie najwyżej 30 000 znaków.'],
            examples: [{ input: '4\nkajak\nkotek\nx\nabba', note: 'W słowie kotek już pierwsza para k i k się zgadza, ale druga — o i e — nie. Jedna litera to zawsze palindrom.' }],
            hint: R`deque<char> d; for (char c : s) d.push_back(c); bool ok = true; while (d.size() > 1) { if (d.front() != d.back()) { ok = false; break; } d.pop_front(); d.pop_back(); }.`,
            tests: (r) => {
                const slowo = (n) => r.word(n, 'abc');
                const pal = (n) => { const a = slowo(Math.ceil(n / 2)); return a + a.split('').reverse().join('').slice(n % 2); };
                const prawie = (n) => { const p = pal(n).split(''); const i = r.int(0, n - 1); if (n > 1) { p[i] = p[i] === 'a' ? 'b' : 'a'; if (p.join('') === p.slice().reverse().join('')) p[(i + 1) % n] = 'c'; } return p.join(''); };
                const gen = (t, m) => `${t}\n${Array.from({ length: t }, () => { const n = r.int(1, m); return r() < 0.5 ? pal(n) : prawie(n); }).join('\n')}`;
                return ['1\na', '2\nab\naa', '4\nkajak\nkotek\nx\nabba', gen(100, 300), gen(30, 1000), gen(100, 4), `2\n${pal(1000)}\n${prawie(1000)}`];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 100) || L.length !== t + 1) return 't';
                return L.slice(1).every((s) => /^[a-z]{1,1000}$/.test(s)) && L.slice(1).join('').length <= 30000 ? null : 'słowa';
            },
            solve: (inp) => linie(inp).slice(1).map((s) => (s === s.split('').reverse().join('') ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        string s;
        cin >> s;
        deque<char> d;
        for (char c : s) d.push_back(c);
        bool ok = true;
        while (d.size() > 1) {
            if (d.front() != d.back()) {
                ok = false;
                break;
            }
            d.pop_front();
            d.pop_back();
        }
        if (ok) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-klub-vip', krok: 5, level: 'latwe',
            title: 'Klub z VIP-ami',
            short: 'Zwykli goście stają na końcu, VIP-y wchodzą na sam początek, a ostatni w kolejce może zrezygnować. Wszystkie cztery końce deque w jednym zadaniu.',
            tags: ['push_front dla VIP', 'pop_back', 'wypisywanie deque'],
            statement: ['Przed klubem stoi kolejka. Zdarzenia:',
                '• GOSC imie — zwykły gość staje na końcu kolejki,',
                '• VIP imie — VIP staje na samym początku kolejki (przed wszystkimi, także przed wcześniejszymi VIP-ami),',
                '• WEJSCIE — pierwsza osoba z kolejki wchodzi do klubu: wypisz wchodzi: imie albo wchodzi: nikt,',
                '• ODCHODZI — ostatnia osoba w kolejce traci cierpliwość i odchodzi: wypisz odchodzi: imie albo odchodzi: nikt.',
                'Na koniec wypisz czekających od pierwszego do ostatniego. Deque można przejść pętlą for jak vector.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno zdarzenie.'],
            output_format: ['Po jednym wierszu dla każdego WEJSCIE i ODCHODZI, a na końcu czekaja: imiona albo czekaja: nikt.'],
            constraints: ['1 ≤ q ≤ 2000', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą.'],
            examples: [{ input: '7\nGOSC Ala\nGOSC Bartek\nVIP Celina\nODCHODZI\nVIP Daria\nWEJSCIE\nGOSC Ewa', note: 'Po trzech zdarzeniach kolejka to Celina Ala Bartek. Odchodzi ostatni, Bartek. Daria staje przed Celiną i pierwsza wchodzi do klubu. Na końcu czekają Celina, Ala i Ewa.' }],
            hint: R`deque<string> d;. GOSC → d.push_back(imie), VIP → d.push_front(imie), WEJSCIE → front() i pop_front(), ODCHODZI → back() i pop_back(). Na końcu: for (string &s : d) cout << " " << s;.`,
            tests: (r) => {
                const gen = (q, pG, pV, pW) => { const o = []; for (let i = 0; i < q; i++) { const x = r(); o.push(x < pG ? `GOSC ${r.pick(IMIONA)}` : x < pG + pV ? `VIP ${r.pick(IMIONA)}` : x < pG + pV + pW ? 'WEJSCIE' : 'ODCHODZI'); } return `${q}\n${o.join('\n')}`; };
                return ['1\nWEJSCIE', '2\nVIP Ala\nODCHODZI', '3\nGOSC A\nVIP B\nWEJSCIE', gen(30, 0.4, 0.2, 0.25), gen(2000, 0.35, 0.2, 0.3), gen(2000, 0.5, 0.15, 0.2), gen(300, 0.2, 0.2, 0.3)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'WEJSCIE' || l === 'ODCHODZI' || (/^(GOSC|VIP) \S+$/.test(l) && czyImie(l.split(' ')[1]))) ? null : 'zdarzenie';
            },
            solve: (inp) => {
                const d = new Deque(); const o = [];
                for (const l of linie(inp).slice(1)) {
                    const [z, im] = l.split(' ');
                    if (z === 'GOSC') d.pushBack(im);
                    else if (z === 'VIP') d.pushFront(im);
                    else if (z === 'WEJSCIE') o.push(`wchodzi: ${d.empty() ? 'nikt' : d.popFront()}`);
                    else o.push(`odchodzi: ${d.empty() ? 'nikt' : d.popBack()}`);
                }
                o.push(`czekaja: ${d.empty() ? 'nikt' : d.toArray().join(' ')}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int ile;
    cin >> ile;
    deque<string> d;
    for (int i = 0; i < ile; i++) {
        string z;
        cin >> z;
        if (z == "GOSC" || z == "VIP") {
            string imie;
            cin >> imie;
            if (z == "GOSC") d.push_back(imie);
            else d.push_front(imie);
        } else if (z == "WEJSCIE") {
            cout << "wchodzi: ";
            if (d.empty()) cout << "nikt\n";
            else {
                cout << d.front() << "\n";
                d.pop_front();
            }
        } else {
            cout << "odchodzi: ";
            if (d.empty()) cout << "nikt\n";
            else {
                cout << d.back() << "\n";
                d.pop_back();
            }
        }
    }
    cout << "czekaja:";
    if (d.empty()) cout << " nikt";
    for (string &s : d) cout << " " << s;
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-liczby-na-stole', krok: 5, level: 'latwe',
            title: 'Liczby na stole',
            short: 'Każda nowa kartka idzie na lewy koniec rzędu, jeśli jest nie większa od lewej skrajnej — inaczej na prawy. Rząd kartek to deque.',
            tags: ['push_front albo push_back', 'front()', 'pętla po deque'],
            statement: ['Bajtek wyciąga z pudełka po kolei n kartek z liczbami i układa je w rzędzie na stole. Pierwszą kartkę po prostu kładzie. Każdą następną kartkę z liczbą x kładzie na lewym końcu rzędu, jeśli x jest mniejsze albo równe liczbie na lewej skrajnej kartce, a w przeciwnym razie — na prawym końcu.',
                'Wypisz rząd kartek od lewej do prawej oraz — w drugim wierszu — ile kartek trafiło na lewy koniec (nie licząc pierwszej).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb w kolejności wyciągania.'],
            output_format: ['Dwa wiersze: rząd kartek (liczby oddzielone spacjami) oraz na lewo: k.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ liczby ≤ 10⁶'],
            examples: [{ input: '6\n5 3 8 3 1 6', note: 'Rząd po kolei: 5 → 3 5 → 3 5 8 → 3 3 5 8 (3 ≤ 3) → 1 3 3 5 8 → 1 3 3 5 8 6.' }],
            hint: R`deque<int> d;. Pierwszą liczbę: d.push_back(x). Dla kolejnych: if (x <= d.front()) { d.push_front(x); naLewo++; } else d.push_back(x);. Wypisz pętlą for (int x : d).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([7]), d([2, 2, 2]), d([1, 2, 3, 4]), d([4, 3, 2, 1]), d(los(r, 2000, 1, 1e6)), d(los(r, 2000, 1, 5)), d(los(r, 30, 1, 20))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1);
                const d = new Deque([a[0]]); let ile = 0;
                for (const x of a.slice(1)) { if (x <= d.front()) { d.pushFront(x); ile++; } else d.pushBack(x); }
                return `${d.toArray().join(' ')}\nna lewo: ${ile}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    deque<int> d;
    int naLewo = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (i > 0 && x <= d.front()) {
            d.push_front(x);
            naLewo++;
        } else {
            d.push_back(x);
        }
    }
    for (int x : d) cout << x << " ";
    cout << "\n";
    cout << "na lewo: " << naLewo << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-gra-z-koncow', krok: 5, level: 'latwe',
            title: 'Gra z końców',
            short: 'Karty leżą w rzędzie, a gracze na zmianę biorą skrajną kartę — tę większą z dwóch końców. Deque oddaje oba końce w jednym kroku.',
            tags: ['front() kontra back()', 'zachłanny wybór', 'na zmianę'],
            statement: ['Na stole leży rząd n kart z liczbami. Ala i Bartek grają na zmianę, zaczyna Ala. W swoim ruchu gracz bierze jedną skrajną kartę — z lewego albo z prawego końca rzędu — i zawsze wybiera tę z większą liczbą (gdy na obu końcach jest ta sama liczba, bierze lewą). Wynik gracza to suma liczb na jego kartach.',
                'Wypisz wyniki obu graczy i zwycięzcę (albo remis).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb na kartach, od lewej do prawej.'],
            output_format: ['Trzy wiersze: Ala: X, Bartek: Y oraz wygrywa: Ala, wygrywa: Bartek albo remis.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ liczby ≤ 10⁶'],
            examples: [{ input: '5\n4 1 2 10 3', note: 'Ala bierze 4 (bo 4 > 3), Bartek 3, Ala 10, Bartek 2, Ala 1. Ala: 15, Bartek: 5.' }],
            hint: R`deque<int> d; long long wynik[2] = {0, 0}; int kto = 0;. W pętli while (!d.empty()): if (d.front() >= d.back()) { wynik[kto] += d.front(); d.pop_front(); } else { wynik[kto] += d.back(); d.pop_back(); } kto = 1 - kto;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([9]), d([5, 5]), d([1, 2]), d([4, 1, 2, 10, 3]), d(los(r, 2000, 1, 1e6)), d(los(r, 2000, 1, 3)), d(Array.from({ length: 2000 }, () => 1000000)), d(los(r, 51, 1, 100))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1);
                let l = 0, p = a.length - 1, kto = 0; const w = [0, 0];
                while (l <= p) { if (a[l] >= a[p]) w[kto] += a[l++]; else w[kto] += a[p--]; kto = 1 - kto; }
                return `Ala: ${w[0]}\nBartek: ${w[1]}\n${w[0] > w[1] ? 'wygrywa: Ala' : w[1] > w[0] ? 'wygrywa: Bartek' : 'remis'}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    deque<int> d;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        d.push_back(x);
    }
    long long wynik[2] = {0, 0};
    int kto = 0;
    while (!d.empty()) {
        if (d.front() >= d.back()) {
            wynik[kto] += d.front();
            d.pop_front();
        } else {
            wynik[kto] += d.back();
            d.pop_back();
        }
        kto = 1 - kto;
    }
    cout << "Ala: " << wynik[0] << "\n";
    cout << "Bartek: " << wynik[1] << "\n";
    if (wynik[0] > wynik[1]) cout << "wygrywa: Ala\n";
    else if (wynik[1] > wynik[0]) cout << "wygrywa: Bartek\n";
    else cout << "remis\n";
    return 0;
}`,
        },
        {
            id: 'kol-obroty-w-obie-strony', krok: 5, level: 'srednie',
            title: 'Obroty w obie strony',
            short: 'L k obraca w lewo, R k w prawo, a ? p pyta o p-ty element. Deque obraca się w obie strony i daje d[i] — kolejka umiałaby tylko w lewo.',
            tags: ['obrót w lewo i w prawo', 'd[i]', 'k % n'],
            statement: ['W deque stoi n liczb. Wykonaj q poleceń:',
                '• L k — obróć deque k razy w lewo: pierwszy element przechodzi na koniec,',
                '• R k — obróć deque k razy w prawo: ostatni element przechodzi na początek,',
                '• ? p — wypisz p-ty element od początku (pozycje liczymy od 1).',
                'Liczby k są duże — pamiętaj, że n obrotów w jedną stronę niczego nie zmienia.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb — deque od początku do końca.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu dla każdego polecenia ? p.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ q ≤ 2000', '0 ≤ k ≤ 10⁹', '1 ≤ p ≤ n', '1 ≤ liczby ≤ 10⁶'],
            examples: [{ input: '5 5\n1 2 3 4 5\nL 2\n? 1\nR 7\n? 1\n? 5', note: 'Po L 2 deque to 3 4 5 1 2. R 7 to tyle samo co R 2: 1 2 3 4 5. Pierwsza jest 1, piąta 5.' }],
            hint: R`Obrót w lewo: d.push_back(d.front()); d.pop_front();. W prawo: d.push_front(d.back()); d.pop_back();. Wykonaj k % n obrotów. Pytanie: cout << d[p - 1] << "\n";.`,
            tests: (r) => {
                const gen = (n, q, mk) => { const o = []; for (let i = 0; i < q; i++) { const x = r(); o.push(x < 0.35 ? `L ${r.int(0, mk)}` : x < 0.7 ? `R ${r.int(0, mk)}` : `? ${r.int(1, n)}`); } return `${n} ${q}\n${los(r, n, 1, 1e6).join(' ')}\n${o.join('\n')}`; };
                return ['1 2\n7\nL 1000000000\n? 1', '2 3\n1 2\nR 1\n? 1\n? 2', '5 5\n1 2 3 4 5\nL 2\n? 1\nR 7\n? 1\n? 5', gen(10, 30, 25), gen(2000, 2000, 1e9), gen(2000, 2000, 3), gen(300, 500, 1e9)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, q] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 2000) || !calk(q, 1, 2000) || L.length !== q + 2) return 'n';
                const a = L[1].split(' ').map(Number);
                if (a.length !== n || a.some((x) => !calk(x, 1, 1e6))) return 'liczby';
                return L.slice(2).every((l) => { const [c, v] = l.split(' '); return (c === 'L' || c === 'R') ? calk(Number(v), 0, 1e9) : c === '?' && calk(Number(v), 1, n); }) ? null : 'polecenie';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0].split(' ')[0]);
                const a = L[1].split(' ').map(Number);
                let off = 0; const o = [];
                for (const l of L.slice(2)) {
                    const [c, v] = l.split(' '); const k = Number(v);
                    if (c === 'L') off = (off + k) % n; else if (c === 'R') off = ((off - (k % n)) % n + n) % n; else o.push(a[(off + k - 1) % n]);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    deque<int> d;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        d.push_back(x);
    }
    for (int i = 0; i < q; i++) {
        char c;
        long long k;
        cin >> c >> k;
        if (c == 'L') {
            for (long long j = 0; j < k % n; j++) {
                d.push_back(d.front());
                d.pop_front();
            }
        } else if (c == 'R') {
            for (long long j = 0; j < k % n; j++) {
                d.push_front(d.back());
                d.pop_back();
            }
        } else {
            cout << d[k - 1] << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kol-klawiatura', krok: 5, level: 'srednie',
            title: 'Klawiatura z Home i End',
            short: 'W klawiaturze psują się klawisze Home i End: [ przenosi kursor na początek, ] na koniec. Kawałki tekstu lądują z przodu albo z tyłu — deque napisów.',
            tags: ['deque<string>', 'kawałki tekstu', 'push_front całego kawałka'],
            statement: ['Bajtek pisze tekst na zepsutej klawiaturze: czasem sam z siebie naciska się klawisz Home (przenosi kursor na początek tekstu) albo End (przenosi kursor na koniec). Na wejściu Home jest zapisany jako [, a End jako ]. Na początku kursor jest na końcu (pustego) tekstu, a każda litera pojawia się w miejscu kursora, który przesuwa się za nią.',
                'Dla każdego wiersza wejścia wypisz tekst, który zobaczy Bajtek. Podpowiedź: tekst napisany po [ trafia w całości na początek, a tekst po ] — w całości na koniec. Zbieraj kolejne kawałki do napisu i przy każdym [ albo ] dokładaj gotowy kawałek do deque<string> z przodu albo z tyłu.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden ciąg naciśnięć: małe litery, cyfry, znaki _ oraz [ i ].'],
            output_format: ['t wierszy — teksty, które powstaną.'],
            constraints: ['1 ≤ t ≤ 20', 'Wiersz ma od 1 do 10⁴ znaków, łącznie najwyżej 50 000 znaków.', 'Każdy wiersz zawiera co najmniej jeden znak, który nie jest nawiasem.'],
            examples: [{ input: '3\nla_[ala_]ma_kota\n[[a]b[c\nab[cd[ef]gh', note: 'W pierwszym wierszu ala_ trafia przed la_: ala_la_ma_kota. W drugim: a na początek, b na koniec, c znów na początek — cab. W trzecim: ab, potem cd na początek, ef jeszcze przed nim, a gh na koniec: efcdabgh.' }],
            hint: R`deque<string> d; string kawalek = ""; bool naPoczatek = false;. Dla każdego znaku: jeśli to [ albo ], to dołóż kawałek (naPoczatek ? d.push_front(kawalek) : d.push_back(kawalek)), wyczyść go i ustaw naPoczatek = (c == '['); w przeciwnym razie kawalek += c;. Po pętli dołóż ostatni kawałek i wypisz wszystkie kawałki po kolei.`,
            tests: (r) => {
                const ALF = 'abcdefghijklmnopqrstuvwxyz0123456789_';
                const wiersz = (n, p) => { let s = ''; for (let i = 0; i < n; i++) { const x = r(); s += x < p ? '[' : x < 2 * p ? ']' : ALF[r.int(0, ALF.length - 1)]; } if (!/[^\[\]]/.test(s)) s += 'x'; return s; };
                const gen = (t, n, p) => `${t}\n${Array.from({ length: t }, () => wiersz(r.int(1, n), p)).join('\n')}`;
                return ['1\na', '2\n[]a\n]]b[[', '3\nla_[ala_]ma_kota\n[[a]b[c\nab[cd[ef]gh', gen(20, 2500, 0.05), gen(5, 10000, 0.2), gen(20, 50, 0.3), `1\n${wiersz(10000, 0.45)}`];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 20) || L.length !== t + 1) return 't';
                return L.slice(1).every((s) => /^[a-z0-9_\[\]]{1,10000}$/.test(s) && /[^\[\]]/.test(s)) && L.slice(1).join('').length <= 50000 ? null : 'wiersze';
            },
            solve: (inp) => linie(inp).slice(1).map((s) => {
                const d = new Deque(); let kaw = '', przod = false;
                for (const c of s) { if (c === '[' || c === ']') { if (przod) d.pushFront(kaw); else d.pushBack(kaw); kaw = ''; przod = c === '['; } else kaw += c; }
                if (przod) d.pushFront(kaw); else d.pushBack(kaw);
                return d.toArray().join('');
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        string s;
        cin >> s;
        deque<string> d;
        string kawalek = "";
        bool naPoczatek = false;
        for (char c : s) {
            if (c == '[' || c == ']') {
                if (naPoczatek) d.push_front(kawalek);
                else d.push_back(kawalek);
                kawalek = "";
                naPoczatek = (c == '[');
            } else {
                kawalek += c;
            }
        }
        if (naPoczatek) d.push_front(kawalek);
        else d.push_back(kawalek);
        for (string &k : d) cout << k;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-obracanie-do-celu', krok: 5, level: 'srednie',
            title: 'Obracanie do celu',
            short: 'Z deque wolno zdejmować tylko z przodu, a obracać w lewo albo w prawo. Ile obrotów, żeby wyjąć liczby w zadanej kolejności? Zawsze krótszą drogą.',
            tags: ['szukanie w d[i]', 'krótszy kierunek', 'min(p, size − p)'],
            statement: ['W deque stoją liczby 1, 2, …, n. Trzeba z niej wyjąć m podanych liczb, w podanej kolejności. Wolno wykonywać trzy ruchy: zdjąć pierwszy element (za darmo), obrócić deque w lewo (pierwszy element na koniec — koszt 1) albo w prawo (ostatni element na początek — koszt 1).',
                'Dla każdej kolejnej liczby znajdź jej pozycję p w deque (licząc od 0), obróć deque krótszą drogą — p razy w lewo albo size − p razy w prawo — i zdejmij ją. Wypisz łączny koszt.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m różnych liczb od 1 do n — w kolejności wyjmowania.'],
            output_format: ['Jedna liczba — najmniejsza łączna liczba obrotów.'],
            constraints: ['1 ≤ m ≤ n ≤ 2000'],
            examples: [{ input: '10 3\n2 9 5', note: 'Liczba 2 jest na pozycji 1: jeden obrót w lewo. Potem deque to 3 4 5 6 7 8 9 10 1 — 9 jest na pozycji 6 z 9, więc taniej są 3 obroty w prawo. Na koniec 5 jest na pozycji 4 z 8: 4 obroty. Razem 8.' }],
            hint: R`Pozycję znajdź pętlą: for (int i = 0; i < (int)d.size(); i++) if (d[i] == x) p = i;. Koszt: min(p, (int)d.size() - p). Obróć w wybraną stronę, aż x będzie z przodu, i zrób pop_front().`,
            tests: (r) => {
                const d = (n, a) => `${n} ${a.length}\n${a.join(' ')}`;
                const gen = (n, m) => d(n, r.shuffle(Array.from({ length: n }, (_, i) => i + 1)).slice(0, m));
                return [d(1, [1]), d(2, [2, 1]), d(10, [2, 9, 5]), gen(10, 10), gen(2000, 2000), gen(2000, 50), gen(77, 30)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m] = t; const a = t.slice(2);
                return calk(n, 1, 2000) && calk(m, 1, n) && a.length === m && a.every((x) => calk(x, 1, n)) && new Set(a).size === m ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0];
                let d = Array.from({ length: n }, (_, i) => i + 1); let koszt = 0;
                for (const x of t.slice(2)) { const p = d.indexOf(x); koszt += Math.min(p, d.length - p); d = d.slice(p + 1).concat(d.slice(0, p)); }
                return String(koszt);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    deque<int> d;
    for (int i = 1; i <= n; i++) d.push_back(i);
    long long koszt = 0;
    for (int j = 0; j < m; j++) {
        int x;
        cin >> x;
        int p = 0;
        for (int i = 0; i < (int)d.size(); i++) {
            if (d[i] == x) p = i;
        }
        int lewo = p, prawo = d.size() - p;
        if (lewo <= prawo) {
            koszt += lewo;
            for (int i = 0; i < lewo; i++) {
                d.push_back(d.front());
                d.pop_front();
            }
        } else {
            koszt += prawo;
            for (int i = 0; i < prawo; i++) {
                d.push_front(d.back());
                d.pop_back();
            }
        }
        d.pop_front();
    }
    cout << koszt << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · kolejka monotoniczna
        {
            id: 'kol-pierwszy-ujemny', krok: 6, level: 'latwe',
            title: 'Pierwszy ujemny w oknie',
            short: 'W kolejce nie trzymasz liczb, tylko numery pozycji liczb ujemnych. Z przodu wyrzucasz te, które wypadły z okna — a pierwszy w kolejce to odpowiedź.',
            tags: ['kolejka indeksów', 'wypadanie z okna', 'okno długości k'],
            statement: ['Dany jest ciąg n liczb całkowitych i długość okna k. Dla każdego okna — k kolejnych liczb — wypisz pierwszą (najbardziej na lewo) liczbę ujemną w tym oknie albo 0, jeśli okno nie ma liczb ujemnych.',
                'Trzymaj w kolejce pozycje (indeksy) liczb ujemnych, w kolejności z ciągu. Gdy okno kończy się na pozycji i, zaczyna się na pozycji i − k + 1 — usuń z przodu kolejki pozycje mniejsze niż ta. Wtedy pierwsza pozycja w kolejce wskazuje odpowiedź.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n − k + 1 liczb — odpowiedzi dla kolejnych okien.'],
            constraints: ['1 ≤ k ≤ n ≤ 3000', '−10⁵ ≤ liczby ≤ 10⁵'],
            examples: [{ input: '8 3\n12 -1 -7 8 -15 30 16 28', note: 'Okna: 12 −1 −7 → −1; −1 −7 8 → −1; −7 8 −15 → −7; 8 −15 30 → −15; −15 30 16 → −15; 30 16 28 → 0.' }],
            hint: R`queue<int> q; — indeksy ujemnych. Dla i od 0: if (a[i] < 0) q.push(i); if (i >= k - 1) { while (!q.empty() && q.front() < i - k + 1) q.pop(); cout << (q.empty() ? 0 : a[q.front()]) << " "; }.`,
            tests: (r) => ['1 1\n-5', '1 1\n5', '3 3\n1 2 3', '8 3\n12 -1 -7 8 -15 30 16 28', nk(los(r, 3000, -1e5, 1e5), 10), nk(los(r, 3000, -3, 100000), 200), nk(los(r, 3000, -100000, 100000), 1), nk(los(r, 100, -2, 30), 5)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 3000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e5, 1e5)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1], a = t.slice(2); const o = [];
                for (let i = k - 1; i < a.length; i++) { let w = 0; for (let j = i - k + 1; j <= i; j++) if (a[j] < 0) { w = a[j]; break; } o.push(w); }
                return o.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (a[i] < 0) q.push(i);
        if (i >= k - 1) {
            while (!q.empty() && q.front() < i - k + 1) q.pop();
            if (q.empty()) cout << 0 << " ";
            else cout << a[q.front()] << " ";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-max-w-oknie', krok: 6, level: 'latwe',
            title: 'Maksimum w oknie',
            short: 'Klasyka: największa liczba w każdym oknie długości k. Deque indeksów, w której wartości maleją od przodu — z tyłu wyrzucasz słabszych, z przodu przeterminowanych.',
            tags: ['deque indeksów', 'wartości malejące', 'front() to maksimum'],
            statement: ['Dany jest ciąg n liczb i długość okna k. Dla każdego okna — k kolejnych liczb, od pozycji 1–k do (n−k+1)–n — wypisz największą liczbę w tym oknie.',
                'Użyj kolejki monotonicznej z lekcji: deque<int> z indeksami, w której liczby (a[indeks]) maleją od przodu do tyłu. Nowy indeks i: najpierw usuń z tyłu wszystkie indeksy z liczbami mniejszymi albo równymi a[i] — już nigdy nie będą maksimum — potem wstaw i na koniec, a z przodu usuń indeks, który wypadł z okna. Maksimum okna to a[d.front()].'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n − k + 1 liczb — maksima kolejnych okien.'],
            constraints: ['1 ≤ k ≤ n ≤ 3000', '0 ≤ liczby ≤ 10⁵'],
            examples: [{ input: '8 3\n1 3 1 2 0 5 4 1', note: 'Okna: 1 3 1 → 3; 3 1 2 → 3; 1 2 0 → 2; 2 0 5 → 5; 0 5 4 → 5; 5 4 1 → 5.' }],
            hint: R`for (int i = 0; i < n; i++) { while (!d.empty() && a[d.back()] <= a[i]) d.pop_back(); d.push_back(i); if (d.front() <= i - k) d.pop_front(); if (i >= k - 1) cout << a[d.front()] << " "; }.`,
            tests: (r) => ['1 1\n0', '3 1\n4 5 6', '3 3\n3 2 1', '8 3\n1 3 1 2 0 5 4 1', nk(los(r, 3000, 0, 1e5), 100), nk(los(r, 3000, 0, 5), 7), nk(Array.from({ length: 3000 }, (_, i) => 3000 - i), 50), nk(Array.from({ length: 3000 }, (_, i) => i), 2999)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 3000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 1e5)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); return oknaMax(t.slice(2), t[1]).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    deque<int> d;
    for (int i = 0; i < n; i++) {
        while (!d.empty() && a[d.back()] <= a[i]) d.pop_back();
        d.push_back(i);
        if (d.front() <= i - k) d.pop_front();
        if (i >= k - 1) cout << a[d.front()] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-najzimniejszy', krok: 6, level: 'latwe',
            title: 'Najzimniejszy dzień tygodnia',
            short: 'Minimum w oknie i numer dnia, w którym wystąpiło — a przy remisie dzień najwcześniejszy. O tym decyduje jedna nierówność: > czy >=.',
            tags: ['minimum w oknie', 'remisy w deque', 'indeks w odpowiedzi'],
            statement: ['Meteorolog ma n dziennych temperatur. Dla każdego okresu k kolejnych dni (od dni 1–k do dni (n−k+1)–n) chce znać najniższą temperaturę i numer dnia, w którym ją zanotowano. Jeśli najniższa temperatura wystąpiła w okresie kilka razy, podaj najwcześniejszy taki dzień.',
                'To kolejka monotoniczna dla minimum: liczby w deque rosną od przodu do tyłu. Zastanów się, kiedy usuwać indeksy z tyłu — przy równych temperaturach starszy dzień musi zostać w deque, bo to on jest odpowiedzią.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n temperatur.'],
            output_format: ['n − k + 1 wierszy: najniższa temperatura i numer dnia (dni liczymy od 1).'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '6 3\n4 -2 5 -2 7 8', note: 'W dniach 1–3 najzimniej było w dniu 2 (−2). W dniach 2–4 temperatura −2 była dwa razy — wygrywa wcześniejszy dzień 2. W dniach 3–5 i 4–6 najzimniej było w dniu 4.' }],
            hint: R`Usuwaj z tyłu tylko indeksy z temperaturą ściśle większą: while (!d.empty() && a[d.back()] > a[i]) d.pop_back();. Równa temperatura zostaje — jest starsza, więc stoi bliżej przodu. Wypisz a[d.front()] i d.front() + 1.`,
            tests: (r) => ['1 1\n0', '3 2\n5 5 5', '6 3\n4 -2 5 -2 7 8', nk(los(r, 2000, -50, 50), 7), nk(los(r, 2000, -1, 1), 30), nk(los(r, 2000, -50, 50), 1), nk(los(r, 2000, -50, 50), 2000), nk(los(r, 60, 0, 3), 4)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 2000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -50, 50)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1], a = t.slice(2); const o = [];
                for (let i = k - 1; i < a.length; i++) { let b = i - k + 1; for (let j = b; j <= i; j++) if (a[j] < a[b]) b = j; o.push(`${a[b]} ${b + 1}`); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    deque<int> d;
    for (int i = 0; i < n; i++) {
        while (!d.empty() && a[d.back()] > a[i]) d.pop_back();
        d.push_back(i);
        if (d.front() <= i - k) d.pop_front();
        if (i >= k - 1) cout << a[d.front()] << " " << d.front() + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-rozpietosc', krok: 6, level: 'srednie',
            title: 'Rozpiętość w oknie',
            short: 'Największa minus najmniejsza w każdym oknie. Dwie kolejki monotoniczne naraz: jedna pilnuje maksimum, druga minimum.',
            tags: ['dwie deque', 'max − min', 'okno długości k'],
            statement: ['Dany jest ciąg n pomiarów i długość okna k. Rozpiętość okna to różnica między największym a najmniejszym pomiarem w tym oknie. Wypisz rozpiętość każdego okna k kolejnych pomiarów.',
                'Prowadź dwie kolejki monotoniczne jednocześnie: w jednej liczby maleją od przodu (pierwszy indeks wskazuje maksimum), w drugiej rosną (pierwszy wskazuje minimum).'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n pomiarów.'],
            output_format: ['Jeden wiersz: n − k + 1 rozpiętości kolejnych okien.'],
            constraints: ['1 ≤ k ≤ n ≤ 3000', '0 ≤ pomiary ≤ 10⁵'],
            examples: [{ input: '6 3\n5 1 4 4 9 2', note: 'Okna: 5 1 4 → 5 − 1 = 4; 1 4 4 → 3; 4 4 9 → 5; 4 9 2 → 7.' }],
            hint: R`deque<int> mx, mn;. Dla i: while (!mx.empty() && a[mx.back()] <= a[i]) mx.pop_back(); mx.push_back(i); i to samo dla mn z >=. Z przodu obu usuń indeks i − k. Od i = k − 1 wypisuj a[mx.front()] - a[mn.front()].`,
            tests: (r) => ['1 1\n7', '2 2\n0 100000', '6 3\n5 1 4 4 9 2', nk(los(r, 3000, 0, 1e5), 25), nk(los(r, 3000, 0, 10), 3), nk(los(r, 3000, 0, 1e5), 3000), nk(Array.from({ length: 3000 }, (_, i) => (i * 37) % 101), 10)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 3000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 1e5)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const a = t.slice(2), k = t[1]; const mx = oknaMax(a, k), mn = oknaMax(a, k, true); return mx.map((x, i) => x - mn[i]).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    deque<int> mx, mn;
    for (int i = 0; i < n; i++) {
        while (!mx.empty() && a[mx.back()] <= a[i]) mx.pop_back();
        mx.push_back(i);
        while (!mn.empty() && a[mn.back()] >= a[i]) mn.pop_back();
        mn.push_back(i);
        if (mx.front() <= i - k) mx.pop_front();
        if (mn.front() <= i - k) mn.pop_front();
        if (i >= k - 1) cout << a[mx.front()] - a[mn.front()] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-suma-maksimow', krok: 6, level: 'srednie',
            title: 'Suma maksimów',
            short: 'Milion liczb z generatora i okna długości k. Liczenie maksimum każdego okna od nowa to k kroków na okno — za wolno. Kolejka monotoniczna robi to w O(n).',
            tags: ['generator danych', 'O(n) zamiast O(n · k)', 'long long'],
            statement: ['Ciąg n liczb powstaje z generatora z lekcji o złożoności: x₁ = s, a każda następna liczba to xᵢ = (xᵢ₋₁ · a + b) mod m. Dla każdego okna k kolejnych liczb policz jego maksimum i wypisz sumę maksimów wszystkich n − k + 1 okien.',
                'Okien jest prawie milion, a okno może mieć setki tysięcy liczb — szukanie maksimum każdego okna osobną pętlą trwałoby godzinami. Użyj kolejki monotonicznej.'],
            input_format: ['W pierwszym wierszu liczby n, s, a, b i m (parametry generatora).', 'W drugim wierszu liczba k.'],
            output_format: ['Jedna liczba — suma maksimów wszystkich okien.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 2 3 1 10\n3', note: 'Ciąg: 2, 7, 2, 7, 2, 7 (bo 2 · 3 + 1 = 7, a 7 · 3 + 1 = 22, 22 mod 10 = 2). Każde okno trzech liczb ma maksimum 7, a okien są 4: suma 28.' }],
            hint: R`${KOD_GEN} Iloczyn x[i − 1] · a może sięgać 10¹⁸ — dlatego long long. Potem zwykła kolejka monotoniczna dla maksimum, a suma maksimów też w long long (do 10¹⁵).`,
            tests: (r) => ['1 5 0 0 10\n1', '6 2 3 1 10\n3', '1000000 12345 21 7 1000000\n1', '1000000 999 21 7 1000000\n1000000', '1000000 77 21 7 1000000\n500000', `1000000 ${r.int(0, 999999936)} 48271 11 999999937\n${r.int(1000, 200000)}`, `${losGen(r, 1000, 1000)}\n37`, `1000000 ${r.int(0, 999999936)} 16807 3 999999937\n1000`],
            check: (inp) => { const t = nums(inp); return t.length === 6 && dobryGen(t, 0, 1e6, 1e9) && calk(t[5], 1, t[0]) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, s, a, b, m, k] = t;
                const x = generuj(n, s, a, b, m);
                return String(oknaMax(x, k).reduce((u, v) => u + v, 0));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    int k;
    cin >> n >> s >> a >> b >> m >> k;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    deque<int> d;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        while (!d.empty() && x[d.back()] <= x[i]) d.pop_back();
        d.push_back(i);
        if (d.front() <= i - k) d.pop_front();
        if (i >= k - 1) suma += x[d.front()];
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-dni-rekordowe', krok: 6, level: 'srednie',
            title: 'Dni rekordowe',
            short: 'Dzień jest rekordowy, gdy był cieplejszy niż każdy z k poprzednich. Maksimum poprzednich dni bierzesz z kolejki monotonicznej, zanim dołożysz dzisiejszy.',
            tags: ['okno poprzednich dni', 'najpierw pytanie, potem push', 'ostra nierówność'],
            statement: ['Masz n dziennych temperatur. Dzień i jest rekordowy, jeśli było w nim cieplej (ostro) niż w każdym z k poprzednich dni — a jeśli przed nim jest mniej niż k dni, to cieplej niż we wszystkich poprzednich. Dzień 1 nie ma poprzednich dni, więc jest rekordowy.',
                'Policz dni rekordowe i podaj numer ostatniego z nich. Przed dołożeniem dnia i do kolejki monotonicznej usuń z jej przodu dzień, który wypadł z okna k poprzednich dni — wtedy jej pierwszy indeks to najcieplejszy z poprzednich dni.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n temperatur.'],
            output_format: ['Dwa wiersze: rekordowych: C oraz ostatni: d.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁴', '−10⁵ ≤ temperatura ≤ 10⁵'],
            examples: [{ input: '7 2\n5 3 4 6 6 2 7', note: 'Dzień 1 — rekord. Dzień 3 (4): poprzednie 5 i 3 — nie. Dzień 4 (6): poprzednie 3 i 4 — rekord. Dzień 5 (6): wśród poprzednich jest 6 — nie (trzeba ostro cieplej). Dzień 7 (7): poprzednie 6 i 2 — rekord. Rekordowe są dni 1, 4 i 7.' }],
            hint: R`Dla dnia i (od 0): if (!d.empty() && d.front() < i - k) d.pop_front(); bool rekord = d.empty() || a[i] > a[d.front()]; — dopiero potem while (!d.empty() && a[d.back()] <= a[i]) d.pop_back(); d.push_back(i);.`,
            tests: (r) => ['1 1\n5', '3 2\n1 1 1', '4 1\n1 2 3 4', '7 2\n5 3 4 6 6 2 7', nk(los(r, 10000, -1e5, 1e5), 7), nk(los(r, 10000, -3, 3), 2), nk(los(r, 10000, -1e5, 1e5), 10000), nk(Array.from({ length: 10000 }, (_, i) => Math.round(1000 * Math.sin(i / 30)) + r.int(-40, 40)), 50)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e5, 1e5)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1], a = t.slice(2);
                let c = 0, ost = 0;
                for (let i = 0; i < a.length; i++) { let ok = true; for (let j = Math.max(0, i - k); j < i; j++) if (a[j] >= a[i]) { ok = false; break; } if (ok) { c++; ost = i + 1; } }
                return `rekordowych: ${c}\nostatni: ${ost}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    deque<int> d;
    int rekordowych = 0, ostatni = 0;
    for (int i = 0; i < n; i++) {
        if (!d.empty() && d.front() < i - k) d.pop_front();
        if (d.empty() || a[i] > a[d.front()]) {
            rekordowych++;
            ostatni = i + 1;
        }
        while (!d.empty() && a[d.back()] <= a[i]) d.pop_back();
        d.push_back(i);
    }
    cout << "rekordowych: " << rekordowych << "\n";
    cout << "ostatni: " << ostatni << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-spokojny-fragment', krok: 6, level: 'trudne',
            title: 'Najdłuższy spokojny fragment',
            short: 'Najdłuższy fragment, w którym max − min ≤ K. Gąsienica z dwiema kolejkami monotonicznymi: prawy koniec idzie naprzód, a lewy — gdy rozpiętość jest za duża.',
            tags: ['dwie deque + gąsienica', 'okno zmiennej długości', 'generator danych'],
            statement: ['Ciąg n pomiarów powstaje z generatora: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Fragment ciągu (kilka kolejnych pomiarów) jest spokojny, jeśli różnica między jego największym a najmniejszym pomiarem jest nie większa niż K. Znajdź najdłuższy spokojny fragment — wypisz jego długość i pozycję początku (od 1). Przy kilku najdłuższych wybierz ten, który zaczyna się najwcześniej.',
                'Połącz gąsienicę z lekcji z dwiema kolejkami monotonicznymi: prawy koniec fragmentu przesuwa się po kolei po wszystkich pozycjach, a lewy koniec — tylko do przodu, dopóki rozpiętość jest za duża. Kolejki podają maksimum i minimum bieżącego fragmentu.'],
            input_format: ['W pierwszym wierszu liczby n, s, a, b i m (parametry generatora).', 'W drugim wierszu liczba K.'],
            output_format: ['Jeden wiersz: dlugosc L, od pozycji p.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ K ≤ 10⁹'],
            examples: [{ input: '8 4 7 3 10\n3', note: 'Ciąg: 4, 1, 0, 3, 4, 1, 0, 3. Fragment 1 0 3 ma rozpiętość 3, a 1 0 3 4 już 4. Najdłuższe spokojne fragmenty mają długość 3: najwcześniej 1 0 3 od pozycji 2.' }],
            hint: R`${KOD_GEN} Dla każdego prawego końca r: dołóż r do obu deque, a potem while (x[mx.front()] - x[mn.front()] > K) { l++; if (mx.front() < l) mx.pop_front(); if (mn.front() < l) mn.pop_front(); }. Fragment to l … r; zapamiętaj go, gdy r − l + 1 jest większe niż dotąd najlepsze.`,
            tests: (r) => ['1 5 0 0 10\n0', '8 4 7 3 10\n3', '5 1 1 0 2\n0', '1000000 12345 21 7 1000000\n999000', '1000000 3 21 7 1000000\n999999', `1000000 ${r.int(0, 999999936)} 48271 11 999999937\n999900000`, `1000000 ${r.int(0, 999999936)} 69621 5 999999937\n999990000`, `1000000 ${r.int(0, 999999)} 1 1000 1000000000\n50000000`, `1000000 17 1 ${r.int(30000, 70000)} 1000000000\n900000000`, `${losGen(r, 1000, 50)}\n10`],
            check: (inp) => { const t = nums(inp); return t.length === 6 && dobryGen(t, 0, 1e6, 1e9) && calk(t[5], 0, 1e9) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, s, a, b, m, K] = t;
                const x = generuj(n, s, a, b, m);
                const mx = new Int32Array(n), mn = new Int32Array(n);
                let h1 = 0, t1 = 0, h2 = 0, t2 = 0, l = 0, naj = 0, st = 0;
                for (let i = 0; i < n; i++) {
                    while (t1 > h1 && x[mx[t1 - 1]] <= x[i]) t1--; mx[t1++] = i;
                    while (t2 > h2 && x[mn[t2 - 1]] >= x[i]) t2--; mn[t2++] = i;
                    while (x[mx[h1]] - x[mn[h2]] > K) { l++; if (mx[h1] < l) h1++; if (mn[h2] < l) h2++; }
                    if (i - l + 1 > naj) { naj = i - l + 1; st = l + 1; }
                }
                return `dlugosc ${naj}, od pozycji ${st}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m, K;
    cin >> n >> s >> a >> b >> m >> K;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    deque<int> mx, mn;
    int l = 0, naj = 0, start = 0;
    for (int r = 0; r < n; r++) {
        while (!mx.empty() && x[mx.back()] <= x[r]) mx.pop_back();
        mx.push_back(r);
        while (!mn.empty() && x[mn.back()] >= x[r]) mn.pop_back();
        mn.push_back(r);
        while (x[mx.front()] - x[mn.front()] > K) {
            l++;
            if (mx.front() < l) mx.pop_front();
            if (mn.front() < l) mn.pop_front();
        }
        if (r - l + 1 > naj) {
            naj = r - l + 1;
            start = l + 1;
        }
    }
    cout << "dlugosc " << naj << ", od pozycji " << start << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-skoki-zaby', krok: 6, level: 'trudne',
            title: 'Skoki żaby',
            short: 'Żaba skacze po kamieniach o 1…k pól naprzód i zbiera punkty, także ujemne. Najlepszy wynik na kamieniu i to wartość kamienia plus najlepszy z k poprzednich — maksimum w oknie.',
            tags: ['programowanie dynamiczne', 'maksimum w oknie z dp', 'generator danych'],
            statement: ['W rzędzie leży n kamieni. Na kamieniu i jest vᵢ punktów — może to być liczba ujemna. Żaba stoi na kamieniu 1 i musi dotrzeć na kamień n; jednym skokiem przeskakuje naprzód o 1, 2, …, k kamieni. Zbiera punkty z każdego kamienia, na którym stanie (także z pierwszego i ostatniego). Ile najwięcej punktów może zebrać?',
                'Punkty powstają z generatora: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m, a vᵢ = xᵢ − c. Niech dp[i] to najlepszy wynik żaby, która stoi na kamieniu i. Wtedy dp[1] = v₁, a dp[i] = vᵢ + największe z dp[i − k], …, dp[i − 1]. To maksimum w oknie, tyle że okno przesuwa się po tablicy dp, którą właśnie liczysz.'],
            input_format: ['W pierwszym wierszu liczby n, s, a, b i m (parametry generatora).', 'W drugim wierszu liczby k i c.'],
            output_format: ['Jedna liczba — największy możliwy wynik.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ k ≤ n', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m', '0 ≤ c ≤ m'],
            examples: [{ input: '6 3 2 1 9\n2 5', note: 'x: 3, 7, 6, 4, 0, 1, więc v: −2, 2, 1, −1, −5, −4. Najlepiej skakać po kamieniach 1, 2, 3, 4, 6: −2 + 2 + 1 − 1 − 4 = −4. Kamień 5 (−5) trzeba ominąć, a kamienia 4 nie — z 3 na 6 jest za daleko.' }],
            hint: R`vector<long long> dp(n); dp[0] = v[0]; deque<int> d; d.push_back(0);. Dla i od 1: if (d.front() < i - k) d.pop_front(); dp[i] = v[i] + dp[d.front()]; while (!d.empty() && dp[d.back()] <= dp[i]) d.pop_back(); d.push_back(i);. Wynik to dp[n − 1].`,
            tests: (r) => ['1 5 0 0 10\n1 3', '6 3 2 1 9\n2 5', '5 0 1 1 10\n5 3', '1000000 12345 21 7 1000000\n1000 500000', '1000000 3 21 7 1000000\n1 400000', '1000000 77 21 7 1000000\n1000000 999999', `1000000 ${r.int(0, 999982)} 48271 11 999983\n${r.int(2, 300000)} ${r.int(400000, 600000)}`, `${losGen(r, 1000, 2001)}\n7 1000`],
            check: (inp) => { const t = nums(inp); return t.length === 7 && dobryGen(t, 0, 1e6, 1e6) && calk(t[5], 1, t[0]) && calk(t[6], 0, t[4]) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, s, a, b, m, k, c] = t;
                const x = generuj(n, s, a, b, m);
                const dp = new Float64Array(n); const d = new Int32Array(n); let h = 0, e = 0;
                dp[0] = x[0] - c; d[e++] = 0;
                for (let i = 1; i < n; i++) {
                    if (d[h] < i - k) h++;
                    dp[i] = x[i] - c + dp[d[h]];
                    while (e > h && dp[d[e - 1]] <= dp[i]) e--;
                    d[e++] = i;
                }
                return String(dp[n - 1]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m, k, c;
    cin >> n >> s >> a >> b >> m >> k >> c;
    vector<long long> x(n), v(n), dp(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    for (int i = 0; i < n; i++) v[i] = x[i] - c;
    deque<int> d;
    dp[0] = v[0];
    d.push_back(0);
    for (int i = 1; i < n; i++) {
        if (d.front() < i - k) d.pop_front();
        dp[i] = v[i] + dp[d.front()];
        while (!d.empty() && dp[d.back()] <= dp[i]) d.pop_back();
        d.push_back(i);
    }
    cout << dp[n - 1] << "\n";
    return 0;
}`,
        },
    ];
};
