// Kolejka — baza zadań na koniec lekcji: 28 zadań od łatwych do trudnych (10 / 10 / 8). Łączą całą lekcję: kolejkę i deque
// w symulacjach, kilka kolejek naraz, okna i kolejkę monotoniczną, BFS na liczbach, grafach, planszach i stanach, BFS z deque
// (0-1 BFS) — a na koniec wielki finał: gra w węża, czyli wąż jako deque pól planszy.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kolejka-pomoc');
    const { IMIONA, Kolejka, Deque, calk, D4, losPlansza, losLabirynt, wstaw, znajdz, bfsPlansza, losGraf, listy, bfsGraf, grafTxt, generuj, losGen, dobryGen, KOD_GEN, unikalneSlowa } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const los = (r, n, a, b) => Array.from({ length: n }, () => r.int(a, b));
    const planszaTxt = (g) => `${g.length} ${g[0].length}\n${g.join('\n')}`;
    const czytajPlansze = (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); return { n, m, g: L.slice(1) }; };
    const dobraPlansza = (inp, maxN, maxM, dozwolone, od = 1) => {
        const L = linie(inp); const t = L[0].split(' ').map(Number);
        if (t.length < 2 || !calk(t[0], 1, maxN) || !calk(t[1], 1, maxM) || L.length !== t[0] + od) return false;
        const re = new RegExp(`^[${dozwolone}]{${t[1]}}$`);
        return L.slice(od, od + t[0]).every((w) => re.test(w));
    };
    const ile = (g, ch) => g.reduce((a, w) => a + w.split(ch).length - 1, 0);
    const dobryGraf = (inp, maxN, maxM, extra) => {
        const L = linie(inp); const g0 = L[0].split(' ').map(Number);
        const [n, m] = g0;
        if (!calk(n, 1, maxN) || !calk(m, 0, maxM) || L.length < m + 1) return false;
        const byl = new Set();
        for (const l of L.slice(1, 1 + m)) {
            const [a, b, ...reszta] = l.split(' ').map(Number);
            if (reszta.length || !calk(a, 1, n) || !calk(b, 1, n) || a === b) return false;
            const k = Math.min(a, b) * 100003 + Math.max(a, b);
            if (byl.has(k)) return false;
            byl.add(k);
        }
        return extra ? extra(g0, L.slice(1 + m)) : L.length === m + 1;
    };

    return [
        // ================================================================ ŁATWE
        {
            id: 'kol-b-czarna-skrzynka', krok: 9, level: 'latwe',
            title: 'Czarna skrzynka',
            short: 'Rejestrator lotu pamięta tylko K ostatnich pomiarów wysokości: gdy pamięć jest pełna, najstarszy pomiar znika. Co zostanie w pamięci po locie?',
            tags: ['kolejka o stałej pojemności', 'pop przy przepełnieniu', 'max i min z kolejki'],
            statement: ['Czarna skrzynka samolotu co sekundę zapisuje wysokość lotu, ale ma pamięć tylko na K pomiarów. Gdy pamięć jest pełna, a przychodzi nowy pomiar, najstarszy zapisany pomiar zostaje skasowany.',
                'Samolot wykonał n pomiarów. Wypisz pomiary, które zostały w pamięci — od najstarszego do najnowszego — a w drugim wierszu największą i najmniejszą z zapisanych wysokości.'],
            input_format: ['W pierwszym wierszu liczby n i K.', 'W drugim wierszu n wysokości w kolejności pomiarów.'],
            output_format: ['Dwa wiersze: zapisane pomiary oraz najwyzej: X, najnizej: Y.'],
            constraints: ['1 ≤ K ≤ n ≤ 10⁴', 'K ≤ 2000', '0 ≤ wysokość ≤ 20 000'],
            examples: [{ input: '6 4\n0 300 1200 2500 2400 2600', note: 'Pamięć mieści 4 pomiary, więc dwa pierwsze (0 i 300) zostały skasowane.' }],
            hint: R`queue<int> q;. Dla każdego pomiaru: q.push(x); if ((int)q.size() > K) q.pop();. Na końcu opróżniaj kolejkę, wypisując pomiary i licząc max oraz min.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                const lot = (n) => { const o = []; let h = 0; for (let i = 0; i < n; i++) { h = Math.max(0, Math.min(20000, h + r.int(-150, 220))); o.push(h); } return o; };
                return [d([7], 1), d([1, 2, 3], 3), d([5, 4, 3, 2, 1], 2), d(lot(10000), 2000), d(lot(10000), 1), d(los(r, 3000, 0, 20000), 777), d(lot(50), 12)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 1, Math.min(n, 2000)) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 20000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[1]; const z = t.slice(2).slice(-k); return `${z.join(' ')}\nnajwyzej: ${Math.max(...z)}, najnizej: ${Math.min(...z)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, K;
    cin >> n >> K;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
        if ((int)q.size() > K) q.pop();
    }
    int mx = q.front(), mn = q.front();
    while (!q.empty()) {
        cout << q.front() << " ";
        mx = max(mx, q.front());
        mn = min(mn, q.front());
        q.pop();
    }
    cout << "\n";
    cout << "najwyzej: " << mx << ", najnizej: " << mn << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-najlepszy-tydzien', krok: 9, level: 'latwe',
            title: 'Najlepszy tydzień sklepu',
            short: 'Który okres k kolejnych dni przyniósł największy utarg? Suma w oknie przesuwanym kolejką — i najwcześniejszy z najlepszych okresów.',
            tags: ['suma w oknie', 'maksimum po oknach', 'long long'],
            statement: ['Sklep zapisał utarg z każdego z n dni. Kierowniczka szuka najlepszego okresu k kolejnych dni, czyli takiego, w którym łączny utarg był największy. Jeśli takich okresów jest kilka, wybierz ten, który zaczyna się najwcześniej.',
                'Wypisz numer pierwszego dnia najlepszego okresu (dni liczymy od 1) i łączny utarg w tym okresie.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n utargów.'],
            output_format: ['Jeden wiersz: od dnia d: suma S.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁴', '0 ≤ utarg ≤ 10⁶'],
            examples: [{ input: '7 3\n5 1 8 2 8 1 5', note: 'Okresy 1–3 (14), 2–4 (11), 3–5 (18), 4–6 (11), 5–7 (14). Najlepszy jest okres od dnia 3.' }],
            hint: R`Suma ostatnich k jak w części 4 lekcji. Od dnia k porównuj: if (suma > naj) { naj = suma; od = i - k + 1; } — ostra nierówność zostawia najwcześniejszy okres. naj zacznij od -1, bo utargi mogą być zerowe.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d([0], 1), d([0, 0, 0], 2), d([5, 1, 8, 2, 8, 1, 5], 3), d(los(r, 10000, 0, 1e6), 7), d(los(r, 10000, 1000000, 1000000), 10000), d(los(r, 10000, 0, 3), 50), d(los(r, 100, 0, 9), 1)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1], a = t.slice(2);
                let s = 0, naj = -1, od = 0;
                for (let i = 0; i < a.length; i++) { s += a[i]; if (i >= k) s -= a[i - k]; if (i >= k - 1 && s > naj) { naj = s; od = i - k + 2; } }
                return `od dnia ${od}: suma ${naj}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    queue<int> q;
    long long suma = 0, naj = -1;
    int od = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        q.push(x);
        suma += x;
        if ((int)q.size() > k) {
            suma -= q.front();
            q.pop();
        }
        if (i >= k && suma > naj) {
            naj = suma;
            od = i - k + 1;
        }
    }
    cout << "od dnia " << od << ": suma " << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-szczesliwe-liczby', krok: 9, level: 'latwe',
            title: 'Szczęśliwe liczby',
            short: 'Liczby zbudowane tylko z czwórek i siódemek, od najmniejszej. Kolejka sama je ustawia: zdejmij x, wypisz i dołóż na koniec x4 i x7.',
            tags: ['generowanie kolejką', 'x * 10 + cyfra', 'long long'],
            statement: ['Bajtek uważa za szczęśliwe liczby, w których zapisie są tylko cyfry 4 i 7: 4, 7, 44, 47, 74, 77, 444, … Wypisz n najmniejszych szczęśliwych liczb w kolejności rosnącej.',
                'Pomysł z kolejką: wstaw do niej 4 i 7. Potem n razy zdejmij pierwszą liczbę x, wypisz ją i wstaw na koniec x · 10 + 4 oraz x · 10 + 7. Liczby wychodzą z kolejki od najkrótszych, a wśród liczb tej samej długości — od najmniejszych.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['n wierszy — kolejne szczęśliwe liczby.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '8', note: 'Po 4 i 7 przychodzą liczby dwucyfrowe 44, 47, 74, 77, a potem trzycyfrowe: 444 i 447.' }],
            hint: R`queue<long long> q; q.push(4); q.push(7);. W pętli: long long x = q.front(); q.pop(); cout << x << "\n"; q.push(x * 10 + 4); q.push(x * 10 + 7);. Wstawiane liczby są dłuższe od wypisywanych — dlatego long long.`,
            tests: () => ['1', '2', '8', '30', '1000', '511', '999'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 1000) ? null : 'dane'; },
            solve: (inp) => {
                const n = nums(inp)[0]; const q = new Kolejka([4n, 7n]); const o = [];
                for (let i = 0; i < n; i++) { const x = q.pop(); o.push(String(x)); q.push(x * 10n + 4n); q.push(x * 10n + 7n); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<long long> q;
    q.push(4);
    q.push(7);
    for (int i = 0; i < n; i++) {
        long long x = q.front();
        q.pop();
        cout << x << "\n";
        q.push(x * 10 + 4);
        q.push(x * 10 + 7);
    }
    return 0;
}`,
        },
        {
            id: 'kol-b-playlista', krok: 9, level: 'latwe',
            title: 'Playlista',
            short: 'Utwór na koniec, utwór „zagraj jako następny”, usuń ostatni i powtórz ostatnio zagrany. Kolejka odtwarzania to deque — oba końce w ruchu.',
            tags: ['deque<string>', 'push_front i pop_back', 'zapamiętany ostatni'],
            statement: ['Odtwarzacz muzyki ma kolejkę utworów do zagrania, na początku pustą. Polecenia:',
                '• DODAJ tytul — utwór trafia na koniec kolejki,',
                '• NASTEPNA tytul — utwór zagra jako następny (trafia na początek kolejki),',
                '• GRAJ — gra pierwszy utwór z kolejki: wypisz gra: tytul i usuń go z kolejki; jeśli kolejka jest pusta — cisza,',
                '• USUN_OSTATNI — usuwa ostatni utwór z kolejki: wypisz usunieto: tytul albo nic do usuniecia,',
                '• POWTORZ — ostatnio zagrany utwór jeszcze raz trafia na koniec kolejki; jeśli jeszcze nic nie grało — wypisz nic nie gralo.',
                'Na koniec wypisz zawartość kolejki.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersze wypisywane przez polecenia, a na końcu w kolejce: tytuły albo w kolejce: pusto.'],
            constraints: ['1 ≤ q ≤ 2000', 'Tytuły to napisy z małych liter, cyfr i znaku _ (do 20 znaków).'],
            examples: [{ input: '7\nDODAJ kolysanka\nDODAJ marsz\nNASTEPNA hymn\nGRAJ\nPOWTORZ\nUSUN_OSTATNI\nGRAJ', note: 'Kolejka: hymn kolysanka marsz. Gra hymn, POWTORZ dokłada go na koniec, a USUN_OSTATNI właśnie go usuwa. Potem gra kolysanka, a w kolejce zostaje marsz.' }],
            hint: R`deque<string> d; string ostatni = "";. GRAJ: ostatni = d.front(); d.pop_front();. POWTORZ: if (ostatni == "") … else d.push_back(ostatni);.`,
            tests: (r) => {
                const tyt = unikalneSlowa(r, 40, 1, 4);
                const gen = (q) => { const o = []; for (let i = 0; i < q; i++) { const x = r(); o.push(x < 0.3 ? `DODAJ ${r.pick(tyt)}` : x < 0.45 ? `NASTEPNA ${r.pick(tyt)}` : x < 0.75 ? 'GRAJ' : x < 0.87 ? 'USUN_OSTATNI' : 'POWTORZ'); } return `${q}\n${o.join('\n')}`; };
                return ['1\nGRAJ', '2\nPOWTORZ\nUSUN_OSTATNI', '3\nNASTEPNA a\nGRAJ\nPOWTORZ', gen(30), gen(2000), gen(2000), gen(200)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => /^(GRAJ|USUN_OSTATNI|POWTORZ)$/.test(l) || /^(DODAJ|NASTEPNA) [a-z0-9_]{1,20}$/.test(l)) ? null : 'polecenie';
            },
            solve: (inp) => {
                const d = new Deque(); let ost = ''; const o = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, t] = l.split(' ');
                    if (p === 'DODAJ') d.pushBack(t);
                    else if (p === 'NASTEPNA') d.pushFront(t);
                    else if (p === 'GRAJ') { if (d.empty()) o.push('cisza'); else { ost = d.popFront(); o.push(`gra: ${ost}`); } }
                    else if (p === 'USUN_OSTATNI') o.push(d.empty() ? 'nic do usuniecia' : `usunieto: ${d.popBack()}`);
                    else if (ost === '') o.push('nic nie gralo'); else d.pushBack(ost);
                }
                o.push(`w kolejce: ${d.empty() ? 'pusto' : d.toArray().join(' ')}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int ile;
    cin >> ile;
    deque<string> d;
    string ostatni = "";
    for (int i = 0; i < ile; i++) {
        string p;
        cin >> p;
        if (p == "DODAJ" || p == "NASTEPNA") {
            string t;
            cin >> t;
            if (p == "DODAJ") d.push_back(t);
            else d.push_front(t);
        } else if (p == "GRAJ") {
            if (d.empty()) cout << "cisza\n";
            else {
                ostatni = d.front();
                d.pop_front();
                cout << "gra: " << ostatni << "\n";
            }
        } else if (p == "USUN_OSTATNI") {
            if (d.empty()) cout << "nic do usuniecia\n";
            else {
                cout << "usunieto: " << d.back() << "\n";
                d.pop_back();
            }
        } else {
            if (ostatni == "") cout << "nic nie gralo\n";
            else d.push_back(ostatni);
        }
    }
    cout << "w kolejce:";
    if (d.empty()) cout << " pusto";
    for (string &t : d) cout << " " << t;
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-stolowka', krok: 9, level: 'latwe',
            title: 'Stołówka',
            short: 'Uczniowie chcą kanapki z serem albo z szynką, a kanapki leżą w stosie. Kto nie chce tej z wierzchu, wraca na koniec kolejki — aż nikt już jej nie zechce.',
            tags: ['powrót na koniec', 'warunek zatrzymania', 'liczniki chętnych'],
            statement: ['W kolejce na stołówce stoi n uczniów, ponumerowanych od 1 w kolejności w kolejce. Każdy chce kanapki z serem (0) albo z szynką (1). Kanapek jest też n i leżą jedna na drugiej; brać można tylko kanapkę z wierzchu.',
                'Pierwszy uczeń w kolejce: jeśli chce kanapki z wierzchu, bierze ją i odchodzi; jeśli nie — wraca na koniec kolejki. Gdy żaden z czekających nie chce kanapki z wierzchu, wydawanie się kończy. Wypisz numery uczniów w kolejności, w jakiej dostali kanapki, i ilu uczniów zostało głodnych.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb 0 albo 1 — czego chcą uczniowie 1, 2, …, n.', 'W trzecim wierszu n liczb 0 albo 1 — kanapki od wierzchu.'],
            output_format: ['Dwa wiersze: jedza: numery (albo jedza: nikt) oraz glodnych: X.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '4\n1 1 0 0\n0 1 0 1', note: 'Kanapkę z serem bierze uczeń 3 (1 i 2 przechodzą na koniec), z szynką — 1, z serem — 4, a ostatnią z szynką — 2. Nikt nie jest głodny.' },
                { input: '3\n1 1 1\n0 1 1', note: 'Na wierzchu leży ser, a wszyscy chcą szynki — od razu koniec.' }],
            hint: R`queue<int> q; z numerami uczniów i int chce[2] — ilu czekających chce każdej kanapki. Dopóki kolejka niepusta i chce[kanapka z wierzchu] > 0: zdejmij ucznia; jeśli pasuje — wypisz go, zmniejsz licznik i przejdź do następnej kanapki; jeśli nie — q.push(uczen).`,
            tests: (r) => {
                const d = (a, b) => `${a.length}\n${a.join(' ')}\n${b.join(' ')}`;
                const gen = (n, p) => d(Array.from({ length: n }, () => (r() < p ? 1 : 0)), Array.from({ length: n }, () => (r() < 0.5 ? 1 : 0)));
                return [d([0], [0]), d([0], [1]), d([1, 1, 0, 0], [0, 1, 0, 1]), d([1, 1, 1], [0, 1, 1]), gen(1000, 0.5), gen(1000, 0.3), gen(1000, 0.9), gen(20, 0.5)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; return calk(n, 1, 1000) && t.length === 2 * n + 1 && t.slice(1).every((x) => x === 0 || x === 1) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const n = t[0]; const u = t.slice(1, 1 + n), k = t.slice(1 + n);
                const q = new Kolejka(u.map((_, i) => i)); const chce = [0, 0]; u.forEach((x) => chce[x]++);
                const jedza = []; let w = 0;
                while (!q.empty() && w < n && chce[k[w]] > 0) { const x = q.pop(); if (u[x] === k[w]) { jedza.push(x + 1); chce[u[x]]--; w++; } else q.push(x); }
                return `jedza: ${jedza.length ? jedza.join(' ') : 'nikt'}\nglodnych: ${q.size}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> uczen(n + 1), kanapka(n);
    int chce[2] = {0, 0};
    queue<int> q;
    for (int i = 1; i <= n; i++) {
        cin >> uczen[i];
        chce[uczen[i]]++;
        q.push(i);
    }
    for (int i = 0; i < n; i++) cin >> kanapka[i];
    int wierzch = 0;
    vector<int> jedza;
    while (!q.empty() && chce[kanapka[wierzch]] > 0) {
        int x = q.front();
        q.pop();
        if (uczen[x] == kanapka[wierzch]) {
            jedza.push_back(x);
            chce[uczen[x]]--;
            wierzch++;
        } else {
            q.push(x);
        }
    }
    cout << "jedza:";
    if (jedza.empty()) cout << " nikt";
    for (int x : jedza) cout << " " << x;
    cout << "\n";
    cout << "glodnych: " << q.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-tasowanie', krok: 9, level: 'latwe',
            title: 'Tasowanie na zmianę',
            short: 'Krupier zdejmuje karty z talii i kładzie je na nową kupkę na zmianę: na wierzch, pod spód, na wierzch… Nowa kupka to deque, wierzch to jej front.',
            tags: ['push_front i push_back na zmianę', 'deque jako kupka', 'parzystość numeru'],
            statement: ['Talia ma n kart, podanych od wierzchu. Krupier zdejmuje karty po kolei z wierzchu talii i układa z nich nową kupkę: pierwszą kartę po prostu kładzie na stole, drugą kładzie na wierzch kupki, trzecią wsuwa pod spód kupki, czwartą znów na wierzch, piątą pod spód — i tak dalej, na zmianę.',
                'Wypisz nową kupkę od wierzchu do spodu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — karty talii od wierzchu.'],
            output_format: ['Jeden wiersz: karty nowej kupki od wierzchu.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ karty ≤ 10⁴'],
            examples: [{ input: '6\n1 2 3 4 5 6', note: 'Kupka po kolei: 1 → 2 1 → 2 1 3 → 4 2 1 3 → 4 2 1 3 5 → 6 4 2 1 3 5.' }],
            hint: R`deque<int> d;. Karta numer i (od 1): if (i % 2 == 1) d.push_back(x); else d.push_front(x);. Pierwsza karta trafia do pustej kupki, więc wszystko jedno, z której strony ją położysz. Wypisz d od początku.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([9]), d([1, 2]), d([1, 2, 3, 4, 5, 6]), d(los(r, 3000, 1, 10000)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(los(r, 7, 1, 9))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e4)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const d = new Deque(); a.forEach((x, i) => { if (i % 2 === 0) d.pushBack(x); else d.pushFront(x); }); return d.toArray().join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    deque<int> d;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (i % 2 == 1) d.push_back(x);
        else d.push_front(x);
    }
    for (int x : d) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-wojna', krok: 9, level: 'latwe',
            title: 'Gra w wojnę',
            short: 'Dwie talie, dwie kolejki. Wyższa karta zabiera obie i wkłada je pod spód swojej talii, a remis wyrzuca obie karty z gry. Kto wygra i po ilu rundach?',
            tags: ['dwie kolejki', 'symulacja rund', 'limit rund'],
            statement: ['Ala i Bartek grają w uproszczoną wojnę. Każde ma swoją talię kart z wartościami od 1 do 13, trzymaną wierzchem do góry. W każdej rundzie oboje odkrywają kartę z wierzchu. Kto ma wyższą, zabiera obie karty i wkłada je pod spód swojej talii — najpierw swoją kartę, potem kartę przeciwnika. Przy remisie obie karty odpadają z gry.',
                'Gra kończy się, gdy ktoś nie ma już kart, albo po 10 000 rundach. Wypisz, ile rund rozegrano i kto wygrał: wygrywa Ala, wygrywa Bartek albo remis (gdy oboje skończyli karty w tej samej rundzie albo po 10 000 rundach oboje wciąż je mają).'],
            input_format: ['W pierwszym wierszu liczba n i n kart Ali od wierzchu.', 'W drugim wierszu liczba m i m kart Bartka od wierzchu.'],
            output_format: ['Dwa wiersze: rund: R oraz wynik.'],
            constraints: ['1 ≤ n, m ≤ 1000', '1 ≤ karty ≤ 13'],
            examples: [{ input: '3 5 2 9\n3 3 8 9', note: 'Runda 1: 5 > 3 — Ala zabiera 5 i 3. Runda 2: 2 < 8 — Bartek zabiera 8 i 2. Runda 3: remis 9 i 9, obie odpadają. Ala ma 5 3, Bartek 8 2. Runda 4: 5 < 8, runda 5: 3 > 2 — Ala ma 3 2, Bartek 8 5. Runda 6: 3 < 8, runda 7: 2 < 5 — Ala nie ma kart.' }],
            hint: R`queue<int> a, b; int rundy = 0; while (!a.empty() && !b.empty() && rundy < 10000) { int x = a.front(), y = b.front(); a.pop(); b.pop(); rundy++; if (x > y) { a.push(x); a.push(y); } else if (y > x) { b.push(y); b.push(x); } }. Potem sprawdź, kto ma karty.`,
            tests: (r) => {
                const d = (a, b) => `${a.length} ${a.join(' ')}\n${b.length} ${b.join(' ')}`;
                return [d([5], [5]), d([1], [2]), d([5, 2, 9], [3, 8, 9]), d(los(r, 1000, 1, 13), los(r, 1000, 1, 13)), d(los(r, 26, 1, 13), los(r, 26, 1, 13)), d(los(r, 1000, 1, 13), los(r, 10, 1, 13)), d([13, 1], [2, 12]), d(los(r, 300, 1, 13), los(r, 300, 1, 13))];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length !== 2) return 'wiersze';
                return L.every((l) => { const t = l.split(' ').map(Number); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 13)); }) ? null : 'dane';
            },
            solve: (inp) => {
                const [A, B] = linie(inp).map((l) => new Kolejka(l.split(' ').map(Number).slice(1)));
                let r = 0;
                while (!A.empty() && !B.empty() && r < 10000) { const x = A.pop(), y = B.pop(); r++; if (x > y) { A.push(x); A.push(y); } else if (y > x) { B.push(y); B.push(x); } }
                const w = !A.empty() && B.empty() ? 'wygrywa Ala' : A.empty() && !B.empty() ? 'wygrywa Bartek' : 'remis';
                return `rund: ${r}\n${w}`;
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
    int rundy = 0;
    while (!a.empty() && !b.empty() && rundy < 10000) {
        int ka = a.front(), kb = b.front();
        a.pop();
        b.pop();
        rundy++;
        if (ka > kb) {
            a.push(ka);
            a.push(kb);
        } else if (kb > ka) {
            b.push(kb);
            b.push(ka);
        }
    }
    cout << "rund: " << rundy << "\n";
    if (!a.empty() && b.empty()) cout << "wygrywa Ala\n";
    else if (a.empty() && !b.empty()) cout << "wygrywa Bartek\n";
    else cout << "remis\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-wyliczanka-z-kartami', krok: 9, level: 'latwe',
            title: 'Wyliczanka z kartami',
            short: 'Dzieci w kółku trzymają karty z liczbami. Dziecko, które odpada, mówi, ile liczyć dalej — swoją kartą. Kółko w kolejce, obroty modulo rozmiar.',
            tags: ['kółko jako kolejka', 'zmienne odliczanie', '(k − 1) % size'],
            statement: ['W kółku stoi n dzieci, ponumerowanych od 1 do n zgodnie z kolejnością w kółku. Każde trzyma kartę z liczbą. Pierwsze odliczanie zaczyna dziecko numer 1, które mówi „raz”, a kolejne dzieci w kółku mówią kolejne liczby; dziecko, które powie k, odpada. Następne odliczanie zaczyna dziecko stojące za tym, które odpadło, a odlicza się tyle, ile było na karcie dziecka, które właśnie odpadło.',
                'Wypisz numery dzieci w kolejności odpadania. Liczby na kartach bywają ogromne — pełne okrążenie kółka niczego nie zmienia.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — karty dzieci 1, 2, …, n.'],
            output_format: ['Jeden wiersz: numery dzieci w kolejności odpadania.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ k, karty ≤ 10⁹'],
            examples: [{ input: '5 2\n3 1 4 1 5', note: 'Odliczanie do 2: odpada dziecko 2 (karta 1). Teraz odlicza się do 1 od dziecka 3 — odpada ono samo (karta 4). Od dziecka 4 odlicza się do 4: 4, 5, 1, 4 — odpada 4 (karta 1). Od dziecka 5 do 1: odpada 5, na końcu 1.' }],
            hint: R`Kółko to kolejka numerów dzieci. Odliczanie do k: wykonaj (k - 1) % q.size() obrotów (q.push(q.front()); q.pop();) — wtedy z przodu stoi dziecko, które odpada. Nowe k to jego karta.`,
            tests: (r) => {
                const d = (k, c) => `${c.length} ${k}\n${c.join(' ')}`;
                return [d(1, [5]), d(1000000000, [1, 1]), d(2, [3, 1, 4, 1, 5]), d(7, los(r, 2000, 1, 1e9)), d(1, los(r, 2000, 1, 3)), d(r.int(1, 1e9), los(r, 2000, 1, 20)), d(3, los(r, 12, 1, 6))];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 2000) && calk(k, 1, 1e9) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); let k = t[1]; const c = t.slice(2);
                let a = c.map((_, i) => i + 1); let p = 0; const o = [];
                while (a.length) { p = (p + (k - 1) % a.length) % a.length; const x = a[p]; o.push(x); k = c[x - 1]; a = a.slice(0, p).concat(a.slice(p + 1)); if (p === a.length) p = 0; }
                return o.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> karta(n + 1);
    queue<int> q;
    for (int i = 1; i <= n; i++) {
        cin >> karta[i];
        q.push(i);
    }
    while (!q.empty()) {
        long long obroty = (k - 1) % q.size();
        for (long long i = 0; i < obroty; i++) {
            q.push(q.front());
            q.pop();
        }
        int x = q.front();
        q.pop();
        cout << x << " ";
        k = karta[x];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-plotka', krok: 9, level: 'latwe',
            title: 'Plotka i milczki',
            short: 'Plotka rozchodzi się po znajomych co minutę — ale milczki słyszą ją i nikomu nie powtarzają. BFS, w którym nie każdy wierzchołek wypuszcza falę dalej.',
            tags: ['BFS w grafie', 'wierzchołki bez wyjścia', 'czas ostatniego'],
            statement: ['W klasie jest n uczniów i m par przyjaciół. W minucie 0 plotkę zna uczeń s. W każdej kolejnej minucie każdy, kto zna plotkę i nie jest milczkiem, opowiada ją wszystkim swoim przyjaciołom. Milczki też poznają plotkę od przyjaciół, ale nikomu jej nie powtarzają (uczeń s nie jest milczkiem).',
                'Wypisz, w której minucie plotkę pozna ostatni uczeń, który ją w ogóle pozna (0, jeśli nikt poza s), i ilu uczniów nigdy jej nie usłyszy.'],
            input_format: ['W pierwszym wierszu liczby n, m i s.', 'W każdym z m kolejnych wierszy para przyjaciół a b.', 'W ostatnim wierszu liczba milczków k i ich numery (gdy k = 0 — sama liczba 0).'],
            output_format: ['Dwa wiersze: ostatni w minucie: X oraz nie uslyszy: Y.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ s ≤ n', 'Pary są różne, a ≠ b; milczki są różne i żaden nie jest uczniem s.'],
            examples: [{ input: '6 6 1\n1 2\n2 3\n3 4\n1 5\n5 6\n6 4\n1 2', note: 'Uczeń 2 to milczek: poznaje plotkę w minucie 1, ale uczeń 3 nie dowie się od niego. Plotka idzie 1 → 5 → 6 → 4 → 3: ostatni, uczeń 3, pozna ją w minucie 4.' }],
            hint: R`Zwykły BFS od s, tylko zdejmując ucznia v, sprawdź: if (milczek[v]) continue; — milczek ma swoją odległość, ale nie wkłada przyjaciół do kolejki.`,
            tests: (r) => {
                const gen = (n, m, km, spojny) => {
                    const kraw = losGraf(r, n, m, spojny); const s = r.int(1, n);
                    const mil = r.shuffle(Array.from({ length: n }, (_, i) => i + 1).filter((x) => x !== s)).slice(0, km);
                    return `${n} ${m} ${s}\n${kraw.map((e) => e.join(' ')).join('\n')}${m ? '\n' : ''}${km}${km ? ' ' + mil.join(' ') : ''}`;
                };
                return ['1 0 1\n0', '2 1 2\n1 2\n1 1', '3 2 1\n1 2\n2 3\n1 2', '6 6 1\n1 2\n2 3\n3 4\n1 5\n5 6\n6 4\n1 2', gen(2000, 5000, 200, true), gen(2000, 2500, 50, false), gen(2000, 1999, 0, true), gen(2000, 4000, 1500, true), gen(30, 35, 5, false)];
            },
            check: (inp) => (dobryGraf(inp, 2000, 5000, (g0, reszta) => {
                if (g0.length !== 3 || !calk(g0[2], 1, g0[0]) || reszta.length !== 1) return false;
                const t = reszta[0].split(' ').map(Number);
                return calk(t[0], 0, g0[0] - 1) && t.length === t[0] + 1 && new Set(t.slice(1)).size === t[0] && t.slice(1).every((x) => calk(x, 1, g0[0]) && x !== g0[2]);
            }) ? null : 'dane'),
            solve: (inp) => {
                const L = linie(inp); const [n, m, s] = L[0].split(' ').map(Number);
                const g = listy(n, L.slice(1, 1 + m).map((l) => l.split(' ').map(Number)));
                const mil = new Uint8Array(n + 1); L[1 + m].split(' ').map(Number).slice(1).forEach((x) => { mil[x] = 1; });
                const d = new Int32Array(n + 1).fill(-1); const q = new Kolejka([s]); d[s] = 0;
                while (!q.empty()) { const v = q.pop(); if (mil[v]) continue; for (const u of g[v]) if (d[u] === -1) { d[u] = d[v] + 1; q.push(u); } }
                let mx = 0, nie = 0; for (let i = 1; i <= n; i++) { if (d[i] < 0) nie++; else mx = Math.max(mx, d[i]); }
                return `ostatni w minucie: ${mx}\nnie uslyszy: ${nie}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, s;
    cin >> n >> m >> s;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    int k;
    cin >> k;
    vector<bool> milczek(n + 1, false);
    for (int i = 0; i < k; i++) {
        int x;
        cin >> x;
        milczek[x] = true;
    }
    vector<int> odl(n + 1, -1);
    queue<int> q;
    odl[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        if (milczek[v]) continue;
        for (int u : g[v]) {
            if (odl[u] == -1) {
                odl[u] = odl[v] + 1;
                q.push(u);
            }
        }
    }
    int ostatni = 0, nie = 0;
    for (int i = 1; i <= n; i++) {
        if (odl[i] == -1) nie++;
        else ostatni = max(ostatni, odl[i]);
    }
    cout << "ostatni w minucie: " << ostatni << "\n";
    cout << "nie uslyszy: " << nie << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-dwie-druzyny', krok: 9, level: 'latwe',
            title: 'Dwie drużyny',
            short: 'Wrogowie nie mogą grać w jednej drużynie. BFS koloruje graf na dwa kolory: sąsiad dostaje kolor przeciwny, a sąsiad w tym samym kolorze oznacza, że się nie da.',
            tags: ['BFS z kolorowaniem', 'graf dwudzielny', 'kilka składowych'],
            statement: ['Trener chce podzielić n zawodników na dwie drużyny. Niektóre pary zawodników się nie lubią — m takich par nie może trafić do tej samej drużyny. Czy podział jest możliwy?',
                'Pokoloruj zawodników BFS-em: pierwszy z grupy dostaje drużynę 1, każdy jego „wróg” — drużynę 2, wrogowie wrogów — znów 1 i tak dalej. Jeśli kiedyś okaże się, że dwaj wrogowie mają ten sam kolor, podział jest niemożliwy. Zawodnicy bez wrogów mogą grać w dowolnej drużynie — przydzielaj ich (i każdego pierwszego z nowej grupy) do drużyny 1. Wypisz TAK i liczebności obu drużyn albo NIE.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy para wrogów a b.'],
            output_format: ['Jeden wiersz: TAK x y (liczebności drużyn 1 i 2) albo NIE.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ m ≤ 8000', 'Pary są różne, a ≠ b.'],
            examples: [{ input: '5 3\n1 2\n2 3\n4 5', note: 'Zawodnicy 1 i 3 — drużyna 1, zawodnik 2 — drużyna 2. Z drugiej grupy 4 idzie do drużyny 1, a 5 do drużyny 2. TAK 3 2.' },
                { input: '3 3\n1 2\n2 3\n3 1', note: 'Trzej wzajemni wrogowie: dwaj z nich zawsze trafią do tej samej drużyny.' }],
            hint: R`vector<int> kolor(n + 1, 0); — 0 = jeszcze bez drużyny. Pętla po zawodnikach; nieodwiedzonemu daj kolor 1 i uruchom BFS: dla sąsiada u zawodnika v: if (kolor[u] == 0) { kolor[u] = 3 - kolor[v]; q.push(u); } else if (kolor[u] == kolor[v]) nie_da_sie = true;.`,
            tests: (r) => {
                const dwudzielny = (n, m) => { const strona = Array.from({ length: n + 1 }, () => r.int(0, 1)); const kraw = []; const byl = new Set(); let p = 0; while (kraw.length < m && p++ < 50 * m) { const a = r.int(1, n), b = r.int(1, n); if (a === b || strona[a] === strona[b]) continue; const k = Math.min(a, b) * 100003 + Math.max(a, b); if (byl.has(k)) continue; byl.add(k); kraw.push([a, b]); } return grafTxt(n, kraw); };
                return ['1 0', '2 1\n1 2', '5 3\n1 2\n2 3\n4 5', '3 3\n1 2\n2 3\n3 1', dwudzielny(5000, 8000), dwudzielny(5000, 3000), grafTxt(5000, losGraf(r, 5000, 4000)), grafTxt(5000, losGraf(r, 5000, 4999, true)), dwudzielny(40, 30)];
            },
            check: (inp) => (dobryGraf(inp, 5000, 8000) ? null : 'graf'),
            solve: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number);
                const g = listy(n, L.slice(1, 1 + m).map((l) => l.split(' ').map(Number)));
                const kol = new Int8Array(n + 1); let zle = false;
                for (let s = 1; s <= n; s++) { if (kol[s]) continue; kol[s] = 1; const q = new Kolejka([s]); while (!q.empty()) { const v = q.pop(); for (const u of g[v]) { if (!kol[u]) { kol[u] = 3 - kol[v]; q.push(u); } else if (kol[u] === kol[v]) zle = true; } } }
                if (zle) return 'NIE';
                let a = 0; for (let i = 1; i <= n; i++) if (kol[i] === 1) a++;
                return `TAK ${a} ${n - a}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    vector<int> kolor(n + 1, 0);
    bool zle = false;
    for (int s = 1; s <= n; s++) {
        if (kolor[s] != 0) continue;
        kolor[s] = 1;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int u : g[v]) {
                if (kolor[u] == 0) {
                    kolor[u] = 3 - kolor[v];
                    q.push(u);
                } else if (kolor[u] == kolor[v]) {
                    zle = true;
                }
            }
        }
    }
    if (zle) {
        cout << "NIE\n";
    } else {
        int jedynki = 0;
        for (int i = 1; i <= n; i++) {
            if (kolor[i] == 1) jedynki++;
        }
        cout << "TAK " << jedynki << " " << n - jedynki << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'kol-b-talia-magika', krok: 9, level: 'srednie',
            title: 'Talia magika',
            short: 'Magik odkrywa kartę, następną przekłada pod spód — i karty wychodzą 1, 2, 3, … Jak ułożyć talię? Zasymuluj trik na pozycjach zamiast na kartach.',
            tags: ['kolejka pozycji', 'symulacja odwrotna', 'wpisywanie do vectora'],
            statement: ['Magik trzyma talię n kart z numerami od 1 do n i robi trik: odkrywa kartę z wierzchu i kładzie ją na stole, następną kartę z wierzchu przekłada pod spód talii, znowu odkrywa kartę z wierzchu, następną przekłada pod spód — i tak dalej, aż odkryje wszystkie. Publiczność widzi, że karty pojawiają się w kolejności 1, 2, 3, …, n.',
                'Jak magik musiał ułożyć talię? Wypisz numery kart od wierzchu. Podpowiedź: zasymuluj trik na pozycjach w talii — kolejka zawiera pozycje 0, 1, …, n − 1. Pozycja, która w symulacji zostanie odkryta jako k-ta, musi zawierać kartę numer k.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jeden wiersz: n numerów kart od wierzchu talii.'],
            constraints: ['1 ≤ n ≤ 3000'],
            examples: [{ input: '5', note: 'Talia 1 5 2 4 3: odkryj 1, 5 pod spód (2 4 3 5), odkryj 2, 4 pod spód (3 5 4), odkryj 3, 5 pod spód (4 5), odkryj 4, 5 pod spód, odkryj 5.' }],
            hint: R`queue<int> q; for (int i = 0; i < n; i++) q.push(i); vector<int> talia(n);. Dla k od 1 do n: talia[q.front()] = k; q.pop(); if (!q.empty()) { q.push(q.front()); q.pop(); }. Potem wypisz talię.`,
            tests: () => ['1', '2', '5', '13', '3000', '1024', '777'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 3000) ? null : 'dane'; },
            solve: (inp) => {
                const n = nums(inp)[0]; const q = new Kolejka(Array.from({ length: n }, (_, i) => i)); const t = new Array(n);
                for (let k = 1; k <= n; k++) { t[q.pop()] = k; if (!q.empty()) q.push(q.pop()); }
                return t.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<int> q;
    for (int i = 0; i < n; i++) q.push(i);
    vector<int> talia(n);
    for (int k = 1; k <= n; k++) {
        talia[q.front()] = k;
        q.pop();
        if (!q.empty()) {
            q.push(q.front());
            q.pop();
        }
    }
    for (int x : talia) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-kolejka-druzynowa', krok: 9, level: 'srednie',
            title: 'Kolejka drużynowa',
            short: 'Kto ma w kolejce kolegę z drużyny, staje zaraz za nim. To kolejka drużyn, a w każdej drużynie — jej własna kolejka zawodników. Kolejka kolejek!',
            tags: ['kolejka kolejek', 'vector<queue<int>>', 'numer drużyny z tablicy'],
            statement: ['Na stołówce obowiązuje dziwny zwyczaj. Zawodnicy należą do t drużyn. Gdy przychodzi zawodnik, rozgląda się: jeśli w kolejce stoi już ktoś z jego drużyny, staje zaraz za ostatnim kolegą z drużyny; jeśli nie — staje na samym końcu kolejki. Obsługiwana jest zawsze pierwsza osoba w kolejce.',
                'Zdarzenia: ENQUEUE x — przychodzi zawodnik x, DEQUEUE — obsługa pierwszej osoby (wypisz jej numer), STOP — koniec. Zauważ, że zawodnicy jednej drużyny zawsze stoją w kolejce obok siebie: trzymaj kolejkę numerów drużyn, a dla każdej drużyny osobną kolejkę jej zawodników.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy liczba k i numery k zawodników drużyny.', 'Potem zdarzenia, po jednym w wierszu, zakończone słowem STOP.'],
            output_format: ['Po jednym wierszu z numerem zawodnika dla każdego DEQUEUE.'],
            constraints: ['1 ≤ t ≤ 500', 'Łącznie najwyżej 3000 zawodników; numery są różne, od 0 do 999 999.', 'Najwyżej 5000 zdarzeń. DEQUEUE nigdy nie dotyczy pustej kolejki, a ENQUEUE x — zawodnika, który już stoi w kolejce.'],
            examples: [{ input: '2\n3 101 102 103\n3 201 202 203\nENQUEUE 101\nENQUEUE 201\nENQUEUE 102\nENQUEUE 202\nENQUEUE 103\nENQUEUE 203\nDEQUEUE\nDEQUEUE\nDEQUEUE\nDEQUEUE\nSTOP', note: 'Zawodnik 102 staje za 101 (przed 201), a 103 za 102. Kolejka to 101 102 103 201 202 203.' }],
            hint: R`vector<int> druzyna(1000000); — numer drużyny każdego zawodnika. queue<int> kolejkaDruzyn; vector<queue<int>> wDruzynie(t);. ENQUEUE x: int d = druzyna[x]; if (wDruzynie[d].empty()) kolejkaDruzyn.push(d); wDruzynie[d].push(x);. DEQUEUE: drużyna z przodu, jej pierwszy zawodnik — a gdy jej kolejka się opróżni, zdejmij drużynę z kolejkaDruzyn.`,
            tests: (r) => {
                const gen = (t, ileZ, ileZd) => {
                    const num = new Set(); while (num.size < ileZ) num.add(r.int(0, 999999));
                    const z = r.shuffle([...num]); const dr = Array.from({ length: t }, () => []);
                    z.forEach((x, i) => dr[i < t ? i : r.int(0, t - 1)].push(x));
                    const druz = new Map(); dr.forEach((d, i) => d.forEach((x) => druz.set(x, i)));
                    const L = [String(t), ...dr.map((d) => `${d.length} ${d.join(' ')}`)];
                    const kd = new Kolejka(); const wd = dr.map(() => new Kolejka()); const w = new Set();
                    for (let i = 0; i < ileZd; i++) {
                        if (w.size && (r() < 0.4 || w.size === ileZ)) {
                            L.push('DEQUEUE'); const d = kd.front(); w.delete(wd[d].pop()); if (wd[d].empty()) kd.pop(); continue;
                        }
                        let x; do { x = r.pick(z); } while (w.has(x));
                        L.push(`ENQUEUE ${x}`); w.add(x); const d = druz.get(x); if (wd[d].empty()) kd.push(d); wd[d].push(x);
                    }
                    L.push('STOP');
                    return L.join('\n');
                };
                return ['1\n1 5\nENQUEUE 5\nDEQUEUE\nSTOP', '2\n3 101 102 103\n3 201 202 203\nENQUEUE 101\nENQUEUE 201\nENQUEUE 102\nENQUEUE 202\nENQUEUE 103\nENQUEUE 203\nDEQUEUE\nDEQUEUE\nDEQUEUE\nDEQUEUE\nSTOP', gen(3, 12, 40), gen(500, 3000, 1900), gen(10, 3000, 1900), gen(100, 600, 1900), gen(1, 50, 300)];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 500)) return 't';
                const dr = new Map(); let s = 0;
                for (let i = 1; i <= t; i++) {
                    const x = (L[i] || '').split(' ').map(Number);
                    if (!calk(x[0], 1, 3000) || x.length !== x[0] + 1) return 'drużyna';
                    for (const v of x.slice(1)) { if (!calk(v, 0, 999999) || dr.has(v)) return 'zawodnik'; dr.set(v, i); }
                    s += x[0];
                }
                if (s > 3000) return 'suma';
                const zd = L.slice(t + 1);
                if (zd[zd.length - 1] !== 'STOP' || zd.length - 1 > 5000 || zd.slice(0, -1).includes('STOP')) return 'stop';
                const kd = new Kolejka(); const wd = new Map(); const w = new Set();
                for (const l of zd.slice(0, -1)) {
                    if (l === 'DEQUEUE') { if (kd.empty()) return 'pusta'; const d = kd.front(); w.delete(wd.get(d).pop()); if (wd.get(d).empty()) kd.pop(); continue; }
                    const m = l.match(/^ENQUEUE (\d+)$/); if (!m) return 'zdarzenie';
                    const x = Number(m[1]); if (!dr.has(x) || w.has(x)) return 'enqueue';
                    w.add(x); const d = dr.get(x); if (!wd.has(d)) wd.set(d, new Kolejka()); if (wd.get(d).empty()) kd.push(d); wd.get(d).push(x);
                }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                const dr = new Map(); for (let i = 1; i <= t; i++) L[i].split(' ').map(Number).slice(1).forEach((v) => dr.set(v, i));
                const kd = new Kolejka(); const wd = new Map(); const o = [];
                for (const l of L.slice(t + 1)) {
                    if (l === 'STOP') break;
                    if (l === 'DEQUEUE') { const d = kd.front(); const x = wd.get(d).pop(); o.push(x); if (wd.get(d).empty()) kd.pop(); }
                    else { const x = Number(l.slice(8)); const d = dr.get(x); if (!wd.has(d)) wd.set(d, new Kolejka()); if (wd.get(d).empty()) kd.push(d); wd.get(d).push(x); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    vector<int> druzyna(1000000, -1);
    for (int i = 0; i < t; i++) {
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            druzyna[x] = i;
        }
    }
    queue<int> kolejkaDruzyn;
    vector<queue<int>> wDruzynie(t);
    string z;
    while (cin >> z && z != "STOP") {
        if (z == "ENQUEUE") {
            int x;
            cin >> x;
            int d = druzyna[x];
            if (wDruzynie[d].empty()) kolejkaDruzyn.push(d);
            wDruzynie[d].push(x);
        } else {
            int d = kolejkaDruzyn.front();
            cout << wDruzynie[d].front() << "\n";
            wDruzynie[d].pop();
            if (wDruzynie[d].empty()) kolejkaDruzyn.pop();
        }
    }
    return 0;
}`,
        },
        {
            id: 'kol-b-wagoniki', krok: 9, level: 'srednie',
            title: 'Wagoniki kolejki górskiej',
            short: 'Grupy wsiadają do wagonika od przodu kolejki, dopóki następna grupa się mieści — i po przejeździe wracają na koniec. Ile zarobi kolejka górska w ciągu dnia?',
            tags: ['grupy w kolejce', 'pojemność przejazdu', 'najwyżej raz na przejazd'],
            statement: ['Kolejka górska ma wagonik na L miejsc i jeździ C razy dziennie. W kolejce stoi n grup; grupa i liczy gᵢ osób i nigdy się nie rozdziela. Przed każdym przejazdem do wagonika wsiadają po kolei grupy z początku kolejki — dopóki następna grupa w całości się zmieści (i dopóki każda grupa wsiadła najwyżej raz w tym przejeździe). Po przejeździe grupy, które jechały, wracają na koniec kolejki w tej samej kolejności.',
                'Za każdy przejazd każda osoba płaci 1 zł. Ile zarobi kolejka górska przez cały dzień?'],
            input_format: ['W pierwszym wierszu liczby L, C i n.', 'W drugim wierszu n liczb g₁, g₂, …, gₙ.'],
            output_format: ['Jedna liczba — zarobek w złotych.'],
            constraints: ['1 ≤ L ≤ 10⁷', '1 ≤ C ≤ 10⁴', '1 ≤ n ≤ 1000', '1 ≤ gᵢ ≤ L'],
            examples: [{ input: '3 3 4\n3 1 1 2', note: 'Przejazd 1: grupa 3 osób (zarobek 3). Przejazd 2: grupy 1 i 1 — następna, dwuosobowa, się nie mieści (zarobek 2). Przejazd 3: grupa 2 osób, bo trzyosobowa już się nie zmieści (2). Razem 7 zł.' }],
            hint: R`queue<int> q; z wielkościami grup. Przejazd: int wolne = L, wsiadlo = 0; while (wsiadlo < n && q.front() <= wolne) { wolne -= q.front(); q.push(q.front()); q.pop(); wsiadlo++; } zarobek += L - wolne;. Zarobek w long long.`,
            tests: (r) => {
                const d = (L, C, g) => `${L} ${C} ${g.length}\n${g.join(' ')}`;
                return [d(1, 1, [1]), d(3, 3, [3, 1, 1, 2]), d(10, 10000, [1, 1, 1]), d(10000000, 10000, los(r, 1000, 1, 10000000)), d(100, 10000, los(r, 1000, 1, 100)), d(1000, 10000, los(r, 1000, 1, 30)), d(5, 7, [5, 5, 2, 3, 1])];
            },
            check: (inp) => { const t = nums(inp); const [L, C, n] = t; return calk(L, 1, 1e7) && calk(C, 1, 1e4) && calk(n, 1, 1000) && t.length === n + 3 && t.slice(3).every((x) => calk(x, 1, L)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [L, C, n] = t; const q = new Kolejka(t.slice(3)); let z = 0;
                for (let c = 0; c < C; c++) { let w = L, k = 0; while (k < n && q.front() <= w) { w -= q.front(); q.push(q.pop()); k++; } z += L - w; }
                return String(z);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long L;
    int C, n;
    cin >> L >> C >> n;
    queue<long long> q;
    for (int i = 0; i < n; i++) {
        long long g;
        cin >> g;
        q.push(g);
    }
    long long zarobek = 0;
    for (int c = 0; c < C; c++) {
        long long wolne = L;
        int wsiadlo = 0;
        while (wsiadlo < n && q.front() <= wolne) {
            wolne -= q.front();
            q.push(q.front());
            q.pop();
            wsiadlo++;
        }
        zarobek += L - wolne;
    }
    cout << zarobek << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-liczby-235', krok: 9, level: 'srednie',
            title: 'Liczby z dwójek, trójek i piątek',
            short: 'Liczby, które dzielą się tylko przez 2, 3 i 5: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, … Trzy kolejki — mnożenie przez 2, przez 3 i przez 5 — i zawsze najmniejszy z trzech przodów.',
            tags: ['trzy kolejki', 'minimum z frontów', 'usuwanie powtórzeń'],
            statement: ['Rozważ liczby, które w rozkładzie na czynniki pierwsze mają tylko dwójki, trójki i piątki (także 1, która nie ma żadnego czynnika): 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, … Wypisz n-tą z nich.',
                'Pomysł z trzema kolejkami: każda kolejna liczba to któraś wcześniejsza pomnożona przez 2, 3 albo 5. Gdy wyznaczysz liczbę x, wstaw 2x do pierwszej kolejki, 3x do drugiej i 5x do trzeciej. Następna liczba to najmniejszy z trzech pierwszych elementów — a jeśli ta sama liczba stoi z przodu kilku kolejek (np. 6 = 2 · 3 = 3 · 2), zdejmij ją z każdej.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jedna liczba — n-ta liczba z ciągu.'],
            constraints: ['1 ≤ n ≤ 10⁴'],
            examples: [{ input: '10', note: 'Ciąg: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 — dziesiąta jest 12. Liczby 7 i 11 się nie pojawiają.' }],
            hint: R`queue<long long> q2, q3, q5; long long x = 1;. n − 1 razy: q2.push(2 * x); q3.push(3 * x); q5.push(5 * x); x = min({q2.front(), q3.front(), q5.front()}); if (q2.front() == x) q2.pop(); i tak samo dla q3 i q5. Liczby rosną szybko — long long.`,
            tests: () => ['1', '2', '7', '10', '1500', '10000', '9999', '4321'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 1e4) ? null : 'dane'; },
            solve: (inp) => {
                const n = nums(inp)[0]; const q = [new Kolejka(), new Kolejka(), new Kolejka()]; const m = [2n, 3n, 5n]; let x = 1n;
                for (let i = 1; i < n; i++) { q.forEach((k, j) => k.push(x * m[j])); x = q.map((k) => k.front()).reduce((a, b) => (a < b ? a : b)); q.forEach((k) => { if (k.front() === x) k.pop(); }); }
                return String(x);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<long long> q2, q3, q5;
    long long x = 1;
    for (int i = 1; i < n; i++) {
        q2.push(2 * x);
        q3.push(3 * x);
        q5.push(5 * x);
        x = min({q2.front(), q3.front(), q5.front()});
        if (q2.front() == x) q2.pop();
        if (q3.front() == x) q3.pop();
        if (q5.front() == x) q5.pop();
    }
    cout << x << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-metro', krok: 9, level: 'srednie',
            title: 'Metro',
            short: 'Stacje mają nazwy, a linie to listy stacji. Mapa zamienia nazwy na numery, kolejne stacje linii łączą się krawędzią, a BFS liczy przystanki między dwiema stacjami.',
            tags: ['map<string, int>', 'graf z linii', 'kilka pytań BFS'],
            statement: ['Sieć metra ma kilka linii. Każda linia to lista stacji, przez które przejeżdża po kolei; między dwiema sąsiednimi stacjami linii pociąg jedzie w obie strony, a przejazd między nimi to jeden przystanek. Linie mogą mieć wspólne stacje — tam można się przesiąść (przesiadka nic nie kosztuje).',
                'Dla każdego pytania A B wypisz najmniejszą liczbę przystanków, którą trzeba przejechać ze stacji A do stacji B, albo brak, jeśli się nie da. Nadaj stacjom numery mapą map<string, int>, zbuduj listy sąsiadów i dla każdego pytania uruchom BFS.'],
            input_format: ['W pierwszym wierszu liczby L (linie) i q (pytania).', 'W każdym z L kolejnych wierszy liczba k i nazwy k stacji linii, po kolei.', 'W każdym z q kolejnych wierszy dwie nazwy stacji A i B.'],
            output_format: ['q wierszy — liczba przystanków albo brak.'],
            constraints: ['1 ≤ L ≤ 100', '2 ≤ k', 'Łącznie najwyżej 5000 stacji na wszystkich liniach i najwyżej 2000 różnych stacji.', '1 ≤ q ≤ 30', 'Nazwy to małe litery (do 15); stacje z pytań występują na liniach.'],
            examples: [{ input: '3 3\n4 dworzec rynek park zoo\n3 rynek szkola stadion\n2 lotnisko hotel\ndworzec stadion\nzoo szkola\nzoo hotel', note: 'Z dworca: rynek (1), przesiadka, szkoła (2), stadion (3). Z zoo: park, rynek, szkoła — 3. Linia lotnisko–hotel nie styka się z resztą.' }],
            hint: R`map<string, int> nr; int ile = 0;. Funkcja int numer(string s) { if (!nr.count(s)) nr[s] = ile++; return nr[s]; }. Dla linii: kolejne stacje a i b dostają krawędź g[a].push_back(b); g[b].push_back(a);. Każde pytanie: nowa tablica odległości i BFS.`,
            tests: (r) => {
                const gen = (ileSt, L, k, q) => {
                    const st = unikalneSlowa(r, ileSt, 2, 5); const lin = [];
                    for (let i = 0; i < L; i++) { const dl = r.int(2, k); const s = []; let x = r.pick(st); for (let j = 0; j < dl; j++) { s.push(x); let y; do { y = r() < 0.7 ? st[(st.indexOf(x) + r.int(1, 4)) % ileSt] : r.pick(st); } while (y === x); x = y; } lin.push(`${s.length} ${s.join(' ')}`); }
                    const uzyte = [...new Set(lin.flatMap((l) => l.split(' ').slice(1)))];
                    const pyt = Array.from({ length: q }, () => `${r.pick(uzyte)} ${r.pick(uzyte)}`);
                    return `${L} ${q}\n${lin.join('\n')}\n${pyt.join('\n')}`;
                };
                return ['1 2\n2 a b\na b\nb b', '3 3\n4 dworzec rynek park zoo\n3 rynek szkola stadion\n2 lotnisko hotel\ndworzec stadion\nzoo szkola\nzoo hotel', gen(30, 6, 6, 10), gen(2000, 100, 50, 30), gen(800, 100, 50, 30), gen(2000, 40, 60, 30), gen(60, 20, 4, 20)];
            },
            check: (inp) => {
                const L = linie(inp); const [l, q] = L[0].split(' ').map(Number);
                if (!calk(l, 1, 100) || !calk(q, 1, 30) || L.length !== 1 + l + q) return 'wiersze';
                const st = new Set(); let suma = 0;
                for (const w of L.slice(1, 1 + l)) { const t = w.split(' '); const k = Number(t[0]); if (k < 2 || t.length !== k + 1 || t.slice(1).some((s) => !/^[a-z]{1,15}$/.test(s))) return 'linia'; t.slice(1).forEach((s) => st.add(s)); suma += k; }
                if (suma > 5000 || st.size > 2000) return 'rozmiar';
                return L.slice(1 + l).every((w) => { const t = w.split(' '); return t.length === 2 && st.has(t[0]) && st.has(t[1]); }) ? null : 'pytania';
            },
            solve: (inp) => {
                const L = linie(inp); const [l] = L[0].split(' ').map(Number);
                const nr = new Map(); const g = [];
                const numer = (s) => { if (!nr.has(s)) { nr.set(s, g.length); g.push([]); } return nr.get(s); };
                for (const w of L.slice(1, 1 + l)) { const t = w.split(' ').slice(1).map(numer); for (let i = 1; i < t.length; i++) { g[t[i]].push(t[i - 1]); g[t[i - 1]].push(t[i]); } }
                return L.slice(1 + l).map((w) => {
                    const [a, b] = w.split(' ').map((s) => nr.get(s));
                    const d = new Int32Array(g.length).fill(-1); const q = new Kolejka([a]); d[a] = 0;
                    while (!q.empty()) { const v = q.pop(); for (const u of g[v]) if (d[u] === -1) { d[u] = d[v] + 1; q.push(u); } }
                    return d[b] === -1 ? 'brak' : String(d[b]);
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
map<string, int> nr;
vector<vector<int>> g;
int numer(const string &s) {
    if (!nr.count(s)) {
        int k = g.size();
        nr[s] = k;
        g.push_back({});
    }
    return nr[s];
}
int main() {
    nr.clear();
    g.clear();
    int L, q;
    cin >> L >> q;
    for (int i = 0; i < L; i++) {
        int k;
        cin >> k;
        int poprz = -1;
        for (int j = 0; j < k; j++) {
            string s;
            cin >> s;
            int v = numer(s);
            if (poprz != -1) {
                g[v].push_back(poprz);
                g[poprz].push_back(v);
            }
            poprz = v;
        }
    }
    for (int i = 0; i < q; i++) {
        string sa, sb;
        cin >> sa >> sb;
        int a = nr[sa], b = nr[sb];
        vector<int> odl(g.size(), -1);
        queue<int> kol;
        odl[a] = 0;
        kol.push(a);
        while (!kol.empty()) {
            int v = kol.front();
            kol.pop();
            for (int u : g[v]) {
                if (odl[u] == -1) {
                    odl[u] = odl[v] + 1;
                    kol.push(u);
                }
            }
        }
        if (odl[b] == -1) cout << "brak\n";
        else cout << odl[b] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-b-wieza', krok: 9, level: 'srednie',
            title: 'Wieża na planszy',
            short: 'Wieża jedzie dowolnie daleko w jednym kierunku, aż do ściany. Jeden ruch to cały przejazd — BFS sprawdza wszystkie pola na drodze, a nie tylko sąsiednie.',
            tags: ['ruch o wiele pól', 'BFS z przesuwaniem', 'nie przerywać na odwiedzonych'],
            statement: ['Plansza n × m ma wolne pola ., ściany #, pole startowe S i docelowe K. Wieża szachowa w jednym ruchu przesuwa się w górę, w dół, w lewo albo w prawo o dowolną liczbę pól (co najmniej jedno), ale nie może przeskakiwać ścian ani wyjeżdżać poza planszę.',
                'Ile najmniej ruchów potrzebuje wieża, żeby dojechać z S na K (może się zatrzymać na dowolnym polu po drodze)? Wypisz −1, jeśli się nie da. W BFS z pola v sprawdzasz po kolei wszystkie pola w każdym z czterech kierunków, aż trafisz na ścianę albo brzeg planszy — każde jeszcze nieodwiedzone dostaje odległość o jeden większą.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów albo −1.'],
            constraints: ['1 ≤ n, m ≤ 100', 'S i K występują dokładnie raz.'],
            examples: [{ input: '4 5\nS.#..\n..#.K\n.....\n#....', note: 'S → w dół do wiersza 3 (dalej jest ściana), → w prawo do kolumny 5, → w górę do K. Trzy ruchy.' }],
            hint: R`W BFS dla kierunku i: int nw = w + dw[i], nk = k + dk[i]; while (nw, nk na planszy i g[nw][nk] != '#') { if (odl[nw][nk] == -1) { odl[nw][nk] = odl[w][k] + 1; q.push({nw, nk}); } nw += dw[i]; nk += dk[i]; }. Nie przerywaj na polu już odwiedzonym — za nim mogą być nowe pola.`,
            tests: (r) => {
                const gen = (n, m, p) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); wstaw(r, g, 'K'); return planszaTxt(g); };
                return ['1 2\nSK', '1 3\nS#K', '4 5\nS.#..\n..#.K\n.....\n#....', gen(100, 100, 0.3), gen(100, 100, 0.55), gen(100, 100, 0.05), gen(100, 100, 0.45), gen(15, 20, 0.35)];
            },
            check: (inp) => { const g = linie(inp).slice(1); return dobraPlansza(inp, 100, 100, '.#SK') && ile(g, 'S') === 1 && ile(g, 'K') === 1 ? null : 'plansza'; },
            solve: (inp) => {
                const { n, m, g } = czytajPlansze(inp);
                const s = znajdz(g, 'S')[0], k = znajdz(g, 'K')[0];
                const d = new Int32Array(n * m).fill(-1); const q = new Kolejka([s]); d[s[0] * m + s[1]] = 0;
                while (!q.empty()) {
                    const [w, c] = q.pop();
                    for (const [dw, dk] of D4) { let a = w + dw, b = c + dk; while (a >= 0 && a < n && b >= 0 && b < m && g[a][b] !== '#') { if (d[a * m + b] === -1) { d[a * m + b] = d[w * m + c] + 1; q.push([a, b]); } a += dw; b += dk; } }
                }
                return String(d[k[0] * m + k[1]]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    int kw = 0, kk = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
            if (g[w][k] == 'K') {
                kw = w;
                kk = k;
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            while (nw >= 0 && nw < n && nk >= 0 && nk < m && g[nw][nk] != '#') {
                if (odl[nw][nk] == -1) {
                    odl[nw][nk] = odl[w][k] + 1;
                    q.push({nw, nk});
                }
                nw += dw[i];
                nk += dk[i];
            }
        }
    }
    cout << odl[kw][kk] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-zera-i-jedynki', krok: 9, level: 'srednie',
            title: 'Wielokrotność z zer i jedynek',
            short: 'Najmniejsza wielokrotność n zapisana samymi zerami i jedynkami. Liczby mogą mieć dziesiątki cyfr, ale reszt z dzielenia przez n jest tylko n — BFS po resztach.',
            tags: ['BFS po resztach', 'dopisywanie cyfry', 'odtwarzanie napisu'],
            statement: ['Dla danej liczby n znajdź najmniejszą dodatnią liczbę, która dzieli się przez n i w zapisie dziesiętnym ma tylko cyfry 0 i 1. Na przykład dla n = 6 to 1110.',
                'Takie liczby bywają bardzo długie — nie zmieszczą się w long long. Zauważ jednak, że liczy się tylko reszta z dzielenia przez n: dopisanie cyfry c na końcu zamienia resztę r na (r · 10 + c) mod n. Przeszukuj reszty wszerz, zaczynając od liczby 1; dla każdej reszty zapamiętaj, z jakiej reszty i jaką cyfrą do niej doszedłeś, a na końcu odtwórz liczbę od reszty 0. Gdy z reszty wychodzisz najpierw cyfrą 0, a potem 1, BFS znajduje najmniejszą liczbę.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jedna liczba — najmniejsza wielokrotność n z samych zer i jedynek.'],
            constraints: ['1 ≤ n ≤ 10⁵'],
            examples: [{ input: '6', note: 'Kolejno sprawdzane liczby z zer i jedynek: 1, 10, 11, 100, 101, 110, 111, 1000, …, 1110. Pierwsza podzielna przez 6 to 1110.' },
                { input: '7', note: '1001 = 7 · 143.' }],
            hint: R`vector<int> skad(n, -1), cyfra(n);. Start: reszta 1 % n (cyfra 1, skąd: -2 jako „początek”). Z reszty r: dla c = 0, 1: int u = (r * 10 + c) % n; if (skad[u] == -1) { skad[u] = r; cyfra[u] = c; q.push(u); }. Gdy dojdziesz do reszty 0 — cofaj się po skad, zbierając cyfry, i odwróć napis.`,
            tests: () => ['1', '2', '6', '7', '9', '99999', '99998', '12345', '81', '625', '9999'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 1e5) ? null : 'dane'; },
            solve: (inp) => {
                const n = nums(inp)[0];
                const skad = new Int32Array(n).fill(-1), cyf = new Int8Array(n); const q = new Int32Array(n); let hh = 0, tt = 0;
                const s = 1 % n; skad[s] = -2; cyf[s] = 1; q[tt++] = s;
                while (hh < tt && skad[0] === -1) { const r0 = q[hh++]; for (const c of [0, 1]) { const u = (r0 * 10 + c) % n; if (skad[u] === -1) { skad[u] = r0; cyf[u] = c; q[tt++] = u; } } }
                let w = ''; for (let x = 0; ; x = skad[x]) { w += cyf[x]; if (skad[x] === -2) break; }
                return w.split('').reverse().join('');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> skad(n, -1), cyfra(n, 0);
    queue<int> q;
    int start = 1 % n;
    skad[start] = -2;
    cyfra[start] = 1;
    q.push(start);
    while (!q.empty() && skad[0] == -1) {
        int r = q.front();
        q.pop();
        for (int c = 0; c <= 1; c++) {
            int u = (r * 10 + c) % n;
            if (skad[u] == -1) {
                skad[u] = r;
                cyfra[u] = c;
                q.push(u);
            }
        }
    }
    string w = "";
    for (int x = 0; ; x = skad[x]) {
        w += char('0' + cyfra[x]);
        if (skad[x] == -2) break;
    }
    reverse(w.begin(), w.end());
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-labirynt-z-kluczem', krok: 9, level: 'srednie',
            title: 'Labirynt z kluczem',
            short: 'Drzwi otwiera tylko klucz, który leży gdzieś w labiryncie. Stan to nie samo pole, tylko pole i to, czy masz już klucz — plansza ma dwie warstwy.',
            tags: ['stan = pole + klucz', 'tablica odl[2][n][m]', 'BFS po warstwach'],
            statement: ['Labirynt n × m: . to wolne pole, # ściana, S start, K wyjście, k klucz, a D drzwi. Na drzwi wolno wejść tylko z kluczem. Klucz podnosisz automatycznie, gdy wejdziesz na jego pole, i od tej chwili otwiera on wszystkie drzwi. Kluczy może być kilka (albo żaden), drzwi też.',
                'Ile najmniej kroków potrzeba, żeby dojść z S do K? Wypisz −1, jeśli się nie da. Stan to (wiersz, kolumna, czy mam klucz) — to samo pole odwiedzone z kluczem i bez klucza to dwa różne stany, więc odległości trzymaj w tablicy odl[2][n][m].'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Jedna liczba — najmniejsza liczba kroków albo −1.'],
            constraints: ['1 ≤ n, m ≤ 100', 'S i K występują dokładnie raz.'],
            examples: [{ input: '3 7\nS..D..K\n.#####.\n...k...', note: 'Dolnym korytarzem i prawą kolumną da się dojść do K bez drzwi: 2 kroki w dół, 6 w prawo i 2 w górę — 10 kroków. Droga przez drzwi wymagałaby najpierw wyprawy po klucz i jest dłuższa.' }],
            hint: R`struct Stan { int w, k, klucz; }; queue<Stan> q;. Wchodząc na pole: if (g[nw][nk] == '#') continue; if (g[nw][nk] == 'D' && !klucz) continue; int nowy = klucz || g[nw][nk] == 'k';. Odległość w odl[nowy][nw][nk].`,
            tests: (r) => {
                const gen = (n, m, p, kl, dr) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); wstaw(r, g, 'K'); for (let i = 0; i < kl; i++) wstaw(r, g, 'k'); for (let i = 0; i < dr; i++) wstaw(r, g, 'D'); return planszaTxt(g); };
                const sciana = () => { const g = losPlansza(r, 60, 60, 0.25); for (let i = 0; i < 60; i++) g[i] = g[i].slice(0, 30) + 'D' + g[i].slice(31); for (let i = 0; i < 60; i++) if (g[i][5] === '.') { g[i] = g[i].slice(0, 5) + 'S' + g[i].slice(6); break; } for (let i = 59; i >= 0; i--) if (g[i][50] === '.') { g[i] = g[i].slice(0, 50) + 'K' + g[i].slice(51); break; } wstaw(r, g, 'k'); return planszaTxt(g); };
                return ['1 2\nSK', '1 3\nSDK', '1 4\nkSDK', '3 7\nS..D..K\n.#####.\n...k...', gen(100, 100, 0.3, 2, 300), gen(100, 100, 0.2, 0, 1500), sciana(), sciana(), gen(100, 100, 0.35, 5, 600), gen(10, 15, 0.2, 1, 20)];
            },
            check: (inp) => { const g = linie(inp).slice(1); return dobraPlansza(inp, 100, 100, '.#SKkD') && ile(g, 'S') === 1 && ile(g, 'K') === 1 ? null : 'plansza'; },
            solve: (inp) => {
                const { n, m, g } = czytajPlansze(inp);
                const s = znajdz(g, 'S')[0], k = znajdz(g, 'K')[0];
                const d = new Int32Array(2 * n * m).fill(-1); const q = new Kolejka(); const id = (c, w, x) => c * n * m + w * m + x;
                d[id(0, s[0], s[1])] = 0; q.push([0, s[0], s[1]]);
                while (!q.empty()) {
                    const [c, w, x] = q.pop();
                    for (const [dw, dk] of D4) {
                        const a = w + dw, b = x + dk; if (a < 0 || a >= n || b < 0 || b >= m) continue;
                        const ch = g[a][b]; if (ch === '#' || (ch === 'D' && !c)) continue;
                        const nc = c || ch === 'k' ? 1 : 0; if (d[id(nc, a, b)] !== -1) continue;
                        d[id(nc, a, b)] = d[id(c, w, x)] + 1; q.push([nc, a, b]);
                    }
                }
                const x0 = d[id(0, k[0], k[1])], x1 = d[id(1, k[0], k[1])];
                return String(x0 < 0 ? x1 : x1 < 0 ? x0 : Math.min(x0, x1));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Stan {
    int w, k, klucz;
};
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<vector<int>>> odl(2, vector<vector<int>>(n, vector<int>(m, -1)));
    queue<Stan> q;
    int kw = 0, kk = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[0][w][k] = 0;
                q.push({w, k, 0});
            }
            if (g[w][k] == 'K') {
                kw = w;
                kk = k;
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        Stan s = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = s.w + dw[i], nk = s.k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            char c = g[nw][nk];
            if (c == '#') continue;
            if (c == 'D' && !s.klucz) continue;
            int nowy = (s.klucz || c == 'k') ? 1 : 0;
            if (odl[nowy][nw][nk] != -1) continue;
            odl[nowy][nw][nk] = odl[s.klucz][s.w][s.k] + 1;
            q.push({nw, nk, nowy});
        }
    }
    int a = odl[0][kw][kk], b = odl[1][kw][kk];
    if (a == -1) cout << b << "\n";
    else if (b == -1) cout << a << "\n";
    else cout << min(a, b) << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-spokojne-fragmenty', krok: 9, level: 'srednie',
            title: 'Ile spokojnych fragmentów?',
            short: 'Nie najdłuższy, tylko wszystkie: ile fragmentów ma max − min ≤ K? Gąsienica z dwiema kolejkami monotonicznymi — dla każdego prawego końca dodajesz długość okna.',
            tags: ['liczenie fragmentów', 'dwie deque + gąsienica', 'long long'],
            statement: ['Ciąg n pomiarów powstaje z generatora: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Fragment (kilka kolejnych pomiarów, także jeden) jest spokojny, jeśli różnica między jego największym a najmniejszym pomiarem jest nie większa niż K. Ile jest spokojnych fragmentów?',
                'Jeśli fragment od l do r jest spokojny, to każdy fragment od l′ do r z l ≤ l′ też jest. Dla każdego prawego końca r znajdź więc najmniejsze dobre l (gąsienicą z dwiema kolejkami monotonicznymi, jak w części 6) i dodaj do wyniku r − l + 1.'],
            input_format: ['W pierwszym wierszu liczby n, s, a, b i m (parametry generatora).', 'W drugim wierszu liczba K.'],
            output_format: ['Jedna liczba — liczba spokojnych fragmentów.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ K ≤ 10⁹'],
            examples: [{ input: '5 4 7 3 10\n3', note: 'Ciąg 4, 1, 0, 3, 4. Spokojne są wszystkie pojedyncze pomiary (5), pary 4 1, 1 0, 0 3, 3 4 (4) i trójka 1 0 3 (1). Razem 10.' }],
            hint: R`${KOD_GEN} Gąsienica jak w „Najdłuższym spokojnym fragmencie”, tylko zamiast maksimum długości: wynik += r - l + 1;. Fragmentów jest nawet 5 · 10¹¹ — long long.`,
            tests: (r) => ['1 5 0 0 10\n0', '5 4 7 3 10\n3', '1000000 12345 21 7 1000000\n999000', '1000000 3 21 7 1000000\n999999', '1000000 5 21 7 1000000\n0', `1000000 ${r.int(0, 999999936)} 48271 11 999999937\n999990000`, `1000000 ${r.int(0, 999999)} 1 1000 1000000000\n50000000`, `${losGen(r, 2000, 100)}\n20`],
            check: (inp) => { const t = nums(inp); return t.length === 6 && dobryGen(t, 0, 1e6, 1e9) && calk(t[5], 0, 1e9) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, s, a, b, m, K] = t;
                const x = generuj(n, s, a, b, m);
                const mx = new Int32Array(n), mn = new Int32Array(n); let h1 = 0, t1 = 0, h2 = 0, t2 = 0, l = 0, w = 0;
                for (let i = 0; i < n; i++) {
                    while (t1 > h1 && x[mx[t1 - 1]] <= x[i]) t1--; mx[t1++] = i;
                    while (t2 > h2 && x[mn[t2 - 1]] >= x[i]) t2--; mn[t2++] = i;
                    while (x[mx[h1]] - x[mn[h2]] > K) { l++; if (mx[h1] < l) h1++; if (mn[h2] < l) h2++; }
                    w += i - l + 1;
                }
                return String(w);
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
    int l = 0;
    long long wynik = 0;
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
        wynik += r - l + 1;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-supermarket', krok: 9, level: 'srednie',
            title: 'Supermarket',
            short: 'Klient wybiera kasę, przy której stoi najmniej ludzi. Każda kasa ma kolejkę chwil wyjścia klientów — przed wyborem usuwasz z przodu tych, którzy już wyszli.',
            tags: ['k kolejek', 'chwile wyjścia w kolejce', 'wybór najkrótszej'],
            statement: ['W supermarkecie działa k kas, ponumerowanych od 1. Kasjer skanuje jeden produkt na sekundę. Klienci przychodzą do kas w chwilach tᵢ (niemalejąco), klient i ma pᵢ produktów. Przychodząc, klient staje w kolejce do kasy, przy której jest w tej chwili najmniej klientów (obsługiwanych i czekających); przy remisie wybiera kasę o najmniejszym numerze. Klient, którego obsługa kończy się dokładnie w chwili tᵢ, już wyszedł.',
                'Obsługa klienta zaczyna się, gdy kasa skończy poprzedniego klienta (albo od razu, jeśli kasa jest wolna), i trwa pᵢ sekund. Dla każdego klienta wypisz numer kasy i chwilę wyjścia. Wskazówka: dla każdej kasy trzymaj kolejkę chwil wyjścia jej klientów — z przodu usuwaj tych, którzy wyszli najpóźniej w chwili tᵢ, a ostatni element (back) mówi, kiedy kasa skończy obecną pracę.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z n kolejnych wierszy liczby tᵢ i pᵢ.'],
            output_format: ['n wierszy: numer kasy i chwila wyjścia klienta.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ k ≤ 10', '0 ≤ tᵢ ≤ 10⁶, niemalejąco', '1 ≤ pᵢ ≤ 1000'],
            examples: [{ input: '5 2\n0 5\n1 2\n2 1\n6 3\n6 1', note: 'Klient 1 idzie do kasy 1 (wyjdzie o 5), klient 2 do pustej kasy 2 (o 3). Klient 3 ma remis 1 : 1 — kasa 1, wyjdzie o 6. W chwili 6 przy kasie 1 nikt już nie stoi (klient 3 właśnie wyszedł), przy kasie 2 też — klient 4 wybiera kasę 1 (o 9), a klient 5 kasę 2 (o 7).' }],
            hint: R`vector<queue<long long>> kasa(k);. Dla klienta (t, p): dla każdej kasy while (!kasa[j].empty() && kasa[j].front() <= t) kasa[j].pop();. Wybierz j z najmniejszym size(). long long start = kasa[j].empty() ? t : max(t, kasa[j].back()); kasa[j].push(start + p);.`,
            tests: (r) => {
                const gen = (n, k, dt, mp) => { const o = []; let t = r.int(0, 3); for (let i = 0; i < n; i++) { t += r.int(0, dt); o.push(`${t} ${r.int(1, mp)}`); } return `${n} ${k}\n${o.join('\n')}`; };
                return ['1 1\n0 1', '3 1\n5 2\n5 2\n7 1', '5 2\n0 5\n1 2\n2 1\n6 3\n6 1', gen(30, 3, 3, 10), gen(2000, 10, 2, 60), gen(2000, 4, 30, 100), gen(2000, 1, 100, 100), gen(300, 6, 0, 20)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, k] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 2000) || !calk(k, 1, 10) || L.length !== n + 1) return 'n';
                let pt = 0;
                for (const l of L.slice(1)) { const [t, p] = l.split(' ').map(Number); if (!calk(t, 0, 1e6) || t < pt || !calk(p, 1, 1000)) return 'klient'; pt = t; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const [, k] = L[0].split(' ').map(Number);
                const kasa = Array.from({ length: k }, () => new Kolejka()); const o = [];
                for (const l of L.slice(1)) {
                    const [t, p] = l.split(' ').map(Number);
                    kasa.forEach((q) => { while (!q.empty() && q.front() <= t) q.pop(); });
                    let j = 0; for (let i = 1; i < k; i++) if (kasa[i].size < kasa[j].size) j = i;
                    const start = kasa[j].empty() ? t : Math.max(t, kasa[j].back());
                    kasa[j].push(start + p);
                    o.push(`${j + 1} ${start + p}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<queue<long long>> kasa(k);
    for (int i = 0; i < n; i++) {
        long long t, p;
        cin >> t >> p;
        for (int j = 0; j < k; j++) {
            while (!kasa[j].empty() && kasa[j].front() <= t) kasa[j].pop();
        }
        int wybor = 0;
        for (int j = 1; j < k; j++) {
            if (kasa[j].size() < kasa[wybor].size()) wybor = j;
        }
        long long start = kasa[wybor].empty() ? t : max(t, kasa[wybor].back());
        kasa[wybor].push(start + p);
        cout << wybor + 1 << " " << start + p << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'kol-b-burzenie-scian', krok: 9, level: 'trudne',
            title: 'Burzenie ścian',
            short: 'Wejście na wolne pole nic nie kosztuje, a na ścianę — jedno burzenie. Krawędzie mają wagi 0 i 1, więc zwykły BFS nie wystarczy: deque wkłada „darmowe” pola na przód.',
            tags: ['BFS 0-1', 'push_front dla kosztu 0', 'odległość jako liczba burzeń'],
            statement: ['Robot burzący stoi w lewym górnym rogu planszy n × m i ma dotrzeć do prawego dolnego rogu. Pole . jest wolne, a # to ściana, którą robot może zburzyć — każde burzenie to koszt 1, a przejście na wolne pole nic nie kosztuje. Robot chodzi w czterech kierunkach. Jeśli ściana stoi już na polu startowym, też trzeba ją zburzyć.',
                'Ile najmniej ścian musi zburzyć robot? To BFS 0-1: odległość to liczba burzeń. Zdejmując pole z przodu deque, sąsiada, do którego przejście kosztuje 0, wstawiasz na przód (push_front), a sąsiada za 1 — na koniec (push_back). Pole aktualizujesz, gdy znalazłeś do niego tańszą drogę.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków . i #.'],
            output_format: ['Jedna liczba — najmniejsza liczba zburzonych ścian.'],
            constraints: ['1 ≤ n, m ≤ 250'],
            examples: [{ input: '4 5\n..#..\n###.#\n.....\n.###.', note: 'Robot przechodzi dwa pola w prawo, burzy ścianę w kolumnie 3, schodzi do wolnego pola w drugim wierszu, potem w dół na trzeci wiersz, w prawo i w dół do celu. Jedno burzenie.' }],
            hint: R`vector<vector<int>> odl(n, vector<int>(m, INT_MAX)); deque<pair<int, int>> d;. Start: odl[0][0] = (g[0][0] == '#'); d.push_back({0, 0});. Zdejmij z przodu (w, k); dla sąsiada: int c = (g[nw][nk] == '#'); if (odl[w][k] + c < odl[nw][nk]) { odl[nw][nk] = odl[w][k] + c; if (c == 0) d.push_front({nw, nk}); else d.push_back({nw, nk}); }.`,
            tests: (r) => {
                const gen = (n, m, p) => planszaTxt(losPlansza(r, n, m, p));
                return ['1 1\n.', '1 1\n#', '1 3\n.#.', '4 5\n..#..\n###.#\n.....\n.###.', gen(250, 250, 0.35), gen(250, 250, 0.6), gen(250, 250, 0.85), gen(250, 250, 0.15), gen(20, 30, 0.5), planszaTxt(losLabirynt(r, 124, 124).map((w) => w.split('').map((c) => (c === '#' && r() < 0.03 ? '.' : c)).join('')))];
            },
            check: (inp) => (dobraPlansza(inp, 250, 250, '.#') ? null : 'plansza'),
            solve: (inp) => {
                const { n, m, g } = czytajPlansze(inp);
                const INF = 1e9; const d = new Int32Array(n * m).fill(INF); const dq = new Deque();
                d[0] = g[0][0] === '#' ? 1 : 0; dq.pushBack(0);
                while (!dq.empty()) {
                    const v = dq.popFront(); const w = Math.floor(v / m), k = v % m;
                    for (const [dw, dk] of D4) { const a = w + dw, b = k + dk; if (a < 0 || a >= n || b < 0 || b >= m) continue; const c = g[a][b] === '#' ? 1 : 0; const u = a * m + b; if (d[v] + c < d[u]) { d[u] = d[v] + c; if (c) dq.pushBack(u); else dq.pushFront(u); } }
                }
                return String(d[n * m - 1]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, INT_MAX));
    deque<pair<int, int>> d;
    odl[0][0] = (g[0][0] == '#');
    d.push_back({0, 0});
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!d.empty()) {
        auto [w, k] = d.front();
        d.pop_front();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            int c = (g[nw][nk] == '#');
            if (odl[w][k] + c < odl[nw][nk]) {
                odl[nw][nk] = odl[w][k] + c;
                if (c == 0) d.push_front({nw, nk});
                else d.push_back({nw, nk});
            }
        }
    }
    cout << odl[n - 1][m - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-pozar-i-ucieczka', krok: 9, level: 'trudne',
            title: 'Pożar i ucieczka',
            short: 'Ogień i uciekinier ruszają się jednocześnie. Najpierw BFS ognia mówi, o której minucie zapłonie każde pole — potem BFS uciekiniera wchodzi tylko tam, gdzie zdąży przed ogniem.',
            tags: ['dwa BFS', 'czas ognia na polu', 'wyjście poza planszę'],
            statement: ['W labiryncie n × m wybuchł pożar. # to ściana, . wolne pole, J — Jaś (dokładnie jeden), a F — pola, które płoną (może ich być kilka albo żadne). Co minutę Jaś przechodzi na sąsiednie pole (w czterech kierunkach), a ogień przenosi się z każdego płonącego pola na sąsiednie pola, które nie są ścianami. Jaś nie może wejść na ścianę ani na pole, które w chwili jego wejścia już płonie albo właśnie się zapala.',
                'Jaś ucieka, gdy z pola na brzegu labiryntu wyjdzie na zewnątrz — to też zajmuje minutę. Wypisz, po ilu minutach najszybciej może uciec, albo niemozliwe. Najpierw BFS ze wszystkich F policzy minutę zapłonu każdego pola; Jaś może wejść na pole w minucie t tylko wtedy, gdy ogień dotrze tam później niż w minucie t.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Jedna liczba minut albo napis niemozliwe.'],
            constraints: ['1 ≤ n, m ≤ 100', 'J występuje dokładnie raz.'],
            examples: [{ input: '4 4\n####\n#JF#\n#..#\n#..#', note: 'Jaś idzie w dół (minuta 1, ogień dotrze tam w minucie 2), znowu w dół na brzeg (minuta 2) i wychodzi na zewnątrz w minucie 3.' },
                { input: '3 3\n###\n#J.\n#.F', note: 'Oba wolne pola przy Jasiu zapalają się w minucie 1 — dokładnie wtedy, gdy mógłby na nie wejść.' }],
            hint: R`Pole bez ognia ma czas „nieskończony” (np. INT_MAX). BFS Jasia: z pola (w, k) w minucie t — jeśli pole jest na brzegu, odpowiedź to t + 1 (pierwszy taki moment w BFS jest najlepszy). Sąsiad: nie ściana, nieodwiedzony i ogien[nw][nk] > t + 1.`,
            tests: (r) => {
                const gen = (n, m, p, f) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'J'); for (let i = 0; i < f; i++) wstaw(r, g, 'F'); return planszaTxt(g); };
                const ramka = (n, m, p, f) => { const g = losPlansza(r, n, m, p).map((w, i) => (i === 0 || i === n - 1 ? '#'.repeat(m) : '#' + w.slice(1, m - 1) + '#')); const w0 = r.int(0, 1) ? 0 : n - 1; const k0 = r.int(1, m - 2); g[w0] = g[w0].slice(0, k0) + '.' + g[w0].slice(k0 + 1); wstaw(r, g, 'J'); for (let i = 0; i < f; i++) wstaw(r, g, 'F'); return planszaTxt(g); };
                return ['1 1\nJ', '1 2\nFJ', '3 3\n###\n#J#\n###', '4 4\n####\n#JF#\n#..#\n#..#', '3 3\n###\n#J.\n#.F', gen(100, 100, 0.3, 5), ramka(100, 100, 0.25, 3), ramka(100, 100, 0.2, 1), ramka(100, 100, 0.3, 0), gen(100, 100, 0.1, 40), ramka(30, 40, 0.3, 2)];
            },
            check: (inp) => (dobraPlansza(inp, 100, 100, '#.JF') && ile(linie(inp).slice(1), 'J') === 1 ? null : 'plansza'),
            solve: (inp) => {
                const { n, m, g } = czytajPlansze(inp);
                const ogien = bfsPlansza(g, znajdz(g, 'F'));
                const INF = 1e9; const f = (v) => (ogien[v] < 0 ? INF : ogien[v]);
                const s = znajdz(g, 'J')[0]; const d = new Int32Array(n * m).fill(-1); const q = new Kolejka([s[0] * m + s[1]]); d[s[0] * m + s[1]] = 0;
                while (!q.empty()) {
                    const v = q.pop(); const w = Math.floor(v / m), k = v % m;
                    if (w === 0 || w === n - 1 || k === 0 || k === m - 1) return String(d[v] + 1);
                    for (const [dw, dk] of D4) { const a = w + dw, b = k + dk; const u = a * m + b; if (g[a][b] === '#' || d[u] !== -1 || f(u) <= d[v] + 1) continue; d[u] = d[v] + 1; q.push(u); }
                }
                return 'niemozliwe';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    vector<vector<int>> ogien(n, vector<int>(m, INT_MAX));
    queue<pair<int, int>> q;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'F') {
                ogien[w][k] = 0;
                q.push({w, k});
            }
        }
    }
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#' || ogien[nw][nk] != INT_MAX) continue;
            ogien[nw][nk] = ogien[w][k] + 1;
            q.push({nw, nk});
        }
    }
    vector<vector<int>> jas(n, vector<int>(m, -1));
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'J') {
                jas[w][k] = 0;
                q.push({w, k});
            }
        }
    }
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        int t = jas[w][k];
        if (w == 0 || w == n - 1 || k == 0 || k == m - 1) {
            cout << t + 1 << "\n";
            return 0;
        }
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (g[nw][nk] == '#' || jas[nw][nk] != -1) continue;
            if (ogien[nw][nk] <= t + 1) continue;
            jas[nw][nk] = t + 1;
            q.push({nw, nk});
        }
    }
    cout << "niemozliwe\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-przesuwanka', krok: 9, level: 'trudne',
            title: 'Przesuwanka 3 × 3',
            short: 'Osiem kafelków i jedno puste miejsce. Stan to cały układ zapisany jako napis — a stanów jest 181 440. BFS z mapą odległości znajdzie najkrótszy ciąg przesunięć.',
            tags: ['stan jako napis', 'unordered_map odległości', 'układy nierozwiązywalne'],
            statement: ['Przesuwanka to ramka 3 × 3 z kafelkami 1–8 i jednym pustym polem (0). Jeden ruch to przesunięcie kafelka sąsiadującego (w pionie albo w poziomie) z pustym polem na to puste pole. Celem jest układ, w którym kafelki stoją po kolei: 123 / 456 / 780.',
                'Ile najmniej ruchów potrzeba z podanego układu? Wypisz −1, jeśli celu nie da się osiągnąć — tak bywa dla połowy wszystkich układów. Zapisz stan jako napis 9 znaków (wiersz po wierszu), a odległości trzymaj w unordered_map<string, int>.'],
            input_format: ['Trzy wiersze po trzy cyfry — układ przesuwanki (0 to puste pole).'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów albo −1.'],
            constraints: ['Każda z cyfr 0–8 występuje dokładnie raz.'],
            examples: [{ input: '123\n405\n786', note: 'Przesuń 5 w lewo (123 450 786), potem 6 w górę (123 456 780) — dwa ruchy.' },
                { input: '213\n456\n780', note: 'Zamiana dwóch kafelków miejscami jest niemożliwa w tej grze — tego układu nie da się ułożyć.' }],
            hint: R`string start = w1 + w2 + w3;. W BFS: int p = s.find('0'); int w = p / 3, k = p % 3;. Dla sąsiada (nw, nk) w ramce: string t = s; swap(t[p], t[nw * 3 + nk]); if (!odl.count(t)) { odl[t] = odl[s] + 1; q.push(t); }. Zatrzymaj się, gdy zdejmiesz "123456780".`,
            tests: (r) => {
                const uloz = (s) => `${s.slice(0, 3)}\n${s.slice(3, 6)}\n${s.slice(6)}`;
                const tasuj = (k) => { let s = '123456780'.split(''); let p = 8; for (let i = 0; i < k; i++) { const w = Math.floor(p / 3), c = p % 3; const sas = D4.map(([a, b]) => [w + a, c + b]).filter(([a, b]) => a >= 0 && a < 3 && b >= 0 && b < 3).map(([a, b]) => a * 3 + b); const u = r.pick(sas); [s[p], s[u]] = [s[u], s[p]]; p = u; } return s.join(''); };
                return [uloz('123456780'), uloz('123405786'), uloz('213456780'), uloz('867254301'), uloz('647850321'), uloz(tasuj(40)), uloz(tasuj(1000)), uloz('812043765'), uloz(r.shuffle('012345678'.split('')).join(''))];
            },
            check: (inp) => { const L = linie(inp); return L.length === 3 && L.every((w) => /^[0-8]{3}$/.test(w)) && new Set(L.join('')).size === 9 ? null : 'układ'; },
            solve: (inp) => {
                const s = linie(inp).join(''); const cel = '123456780';
                const odl = new Map([[s, 0]]); const q = new Kolejka([s]);
                while (!q.empty()) {
                    const v = q.pop(); if (v === cel) return String(odl.get(v));
                    const p = v.indexOf('0'); const w = Math.floor(p / 3), k = p % 3;
                    for (const [dw, dk] of D4) { const a = w + dw, b = k + dk; if (a < 0 || a > 2 || b < 0 || b > 2) continue; const t = v.split(''); const u = a * 3 + b; [t[p], t[u]] = [t[u], t[p]]; const ts = t.join(''); if (!odl.has(ts)) { odl.set(ts, odl.get(v) + 1); q.push(ts); } }
                }
                return '-1';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string w1, w2, w3;
    cin >> w1 >> w2 >> w3;
    string start = w1 + w2 + w3, cel = "123456780";
    unordered_map<string, int> odl;
    queue<string> q;
    odl[start] = 0;
    q.push(start);
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        string s = q.front();
        q.pop();
        if (s == cel) {
            cout << odl[s] << "\n";
            return 0;
        }
        int p = s.find('0');
        int w = p / 3, k = p % 3;
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw > 2 || nk < 0 || nk > 2) continue;
            string t = s;
            swap(t[p], t[nw * 3 + nk]);
            if (!odl.count(t)) {
                odl[t] = odl[s] + 1;
                q.push(t);
            }
        }
    }
    cout << -1 << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-max-w-kwadracie', krok: 9, level: 'trudne',
            title: 'Maksimum w każdym kwadracie',
            short: 'Największa liczba w każdym kwadracie k × k mapy. Najpierw kolejka monotoniczna wzdłuż każdego wiersza, potem wzdłuż każdej kolumny wyników — i dwa przejścia zamiast k² kroków na kwadrat.',
            tags: ['okno 2D', 'dwa przejścia monotoniczne', 'suma kontrolna'],
            statement: ['Mapa wysokości ma n wierszy i m kolumn, a liczby powstają z generatora: x₁ = s, x_{t+1} = (x_t · a + b) mod M; pole w wierszu i i kolumnie j (od 0) ma wysokość x_{i·m + j + 1}. Dla każdego kwadratu k × k (kwadratów jest (n − k + 1) · (m − k + 1)) znajdź najwyższy punkt.',
                'Wypisz sumę najwyższych punktów wszystkich kwadratów. Kwadratów są miliony, a każdy może mieć setki tysięcy pól — trzeba to policzyć w O(n · m). Najpierw dla każdego wiersza policz kolejką monotoniczną maksima wszystkich okien długości k (powstaje tablica n × (m − k + 1)). Maksimum kwadratu to maksimum k kolejnych takich wartości w kolumnie — więc to samo zrób wzdłuż każdej kolumny nowej tablicy.'],
            input_format: ['W pierwszym wierszu liczby n, m i k.', 'W drugim wierszu liczby s, a, b i M (parametry generatora).'],
            output_format: ['Jedna liczba — suma maksimów wszystkich kwadratów k × k.'],
            constraints: ['1 ≤ n, m ≤ 1500', '1 ≤ k ≤ min(n, m)', '1 ≤ M ≤ 10⁹', '0 ≤ s, a, b < M'],
            examples: [{ input: '3 3 2\n1 2 1 10', note: 'Wysokości: 1 3 7 / 5 1 3 / 7 5 1. Kwadraty 2 × 2 mają maksima 5, 7, 7 i 5 — suma 24.' }],
            hint: R`Wygeneruj tablicę wiersz po wierszu. Wiersze: dla każdego i zwykła kolejka monotoniczna po j, wynik w r[i][j - k + 1]. Kolumny: dla każdej kolumny j tablicy r kolejka monotoniczna po i — maksimum okna to maksimum kwadratu; dodawaj je do sumy w long long.`,
            tests: (r) => ['1 1 1\n5 0 0 10', '3 3 2\n1 2 1 10', '2 5 2\n0 1 1 1000', '1500 1500 1\n12345 48271 11 999999937', '1500 1500 1500\n7 16807 3 999999937', '1500 1500 100\n987654 69621 5 999999937', '1000 1500 37\n42 48271 11 999999937', `600 900 ${r.int(2, 600)}\n${r.int(0, 999999936)} 16807 3 999999937`, '1500 1200 7\n5 21 7 1000000'],
            check: (inp) => { const t = nums(inp); const [n, m, k, s, a, b, M] = t; return t.length === 7 && calk(n, 1, 1500) && calk(m, 1, 1500) && calk(k, 1, Math.min(n, m)) && calk(M, 1, 1e9) && [s, a, b].every((v) => calk(v, 0, M - 1)) ? null : 'dane'; },
            solve: (inp) => {
                const [n, m, k, s, a, b, M] = nums(inp);
                const x = generuj(n * m, s, a, b, M); const W = m - k + 1;
                const rw = new Float64Array(n * W); const d = new Int32Array(Math.max(n, m)); let suma = 0;
                for (let i = 0; i < n; i++) { let h = 0, t = 0; for (let j = 0; j < m; j++) { while (t > h && x[i * m + d[t - 1]] <= x[i * m + j]) t--; d[t++] = j; if (d[h] <= j - k) h++; if (j >= k - 1) rw[i * W + j - k + 1] = x[i * m + d[h]]; } }
                for (let j = 0; j < W; j++) { let h = 0, t = 0; for (let i = 0; i < n; i++) { while (t > h && rw[d[t - 1] * W + j] <= rw[i * W + j]) t--; d[t++] = i; if (d[h] <= i - k) h++; if (i >= k - 1) suma += rw[d[h] * W + j]; } }
                return String(suma);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, k;
    long long s, a, b, M;
    cin >> n >> m >> k >> s >> a >> b >> M;
    vector<vector<long long>> x(n, vector<long long>(m));
    long long v = s;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            x[i][j] = v;
            v = (v * a + b) % M;
        }
    }
    int W = m - k + 1;
    vector<vector<long long>> rw(n, vector<long long>(W));
    for (int i = 0; i < n; i++) {
        deque<int> d;
        for (int j = 0; j < m; j++) {
            while (!d.empty() && x[i][d.back()] <= x[i][j]) d.pop_back();
            d.push_back(j);
            if (d.front() <= j - k) d.pop_front();
            if (j >= k - 1) rw[i][j - k + 1] = x[i][d.front()];
        }
    }
    long long suma = 0;
    for (int j = 0; j < W; j++) {
        deque<int> d;
        for (int i = 0; i < n; i++) {
            while (!d.empty() && rw[d.back()][j] <= rw[i][j]) d.pop_back();
            d.push_back(i);
            if (d.front() <= i - k) d.pop_front();
            if (i >= k - 1) suma += rw[d.front()][j];
        }
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-teleporty', krok: 9, level: 'trudne',
            title: 'Teleporty',
            short: 'Pola z tą samą literą to teleporty: z jednego skaczesz na dowolne inne jednym ruchem. Żeby nie przeglądać listy teleportów setki razy, każdą literę rozwijasz w BFS tylko raz.',
            tags: ['BFS z dodatkowymi krawędziami', 'litera użyta raz', 'listy pól z literą'],
            statement: ['Plansza n × m: . to wolne pole, # ściana, S start, K cel, a małe litery a–z to teleporty (też wolne pola). W jednym ruchu przechodzisz na sąsiednie pole (w czterech kierunkach, nie na ścianę) albo — stojąc na teleporcie z literą c — przenosisz się na dowolny inny teleport z tą samą literą.',
                'Ile najmniej ruchów potrzeba z S do K? Wypisz −1, jeśli się nie da. Uwaga na czas: teleportów z jedną literą może być tysiące. Gdy pierwszy raz zdejmiesz z kolejki teleport z literą c, wstaw do kolejki wszystkie nieodwiedzone teleporty z tą literą i zaznacz literę jako zużytą — później już nic nie dadzą, bo wszystkie zostały odwiedzone za pierwszym razem.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów albo −1.'],
            constraints: ['1 ≤ n, m ≤ 200', 'S i K występują dokładnie raz.'],
            examples: [{ input: '3 8\nSa.#....\n##.#.##.\n...#a..K', note: 'S → a (1 ruch), teleport do drugiego a (2), potem trzy kroki w prawo do K — razem 5. Bez teleportu ściany nie dałoby się obejść.' }],
            hint: R`vector<vector<pair<int, int>>> pola(26); — pozycje każdej litery, bool uzyta[26] = {};. Zdejmując pole z literą c: if (!uzyta[c]) { uzyta[c] = true; for (auto [w, k] : pola[c]) if (odl[w][k] == -1) { odl[w][k] = odl[v] + 1; q.push({w, k}); } }. Potem zwykli sąsiedzi.`,
            tests: (r) => {
                const gen = (n, m, p, ileL, ilePar) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); wstaw(r, g, 'K'); const lit = 'abcdefghijklmnopqrstuvwxyz'.slice(0, ileL); for (let i = 0; i < ilePar; i++) wstaw(r, g, lit[r.int(0, ileL - 1)]); return planszaTxt(g); };
                return ['1 2\nSK', '1 5\nSa#aK', '1 5\nSa#bK', '3 8\nSa.#....\n##.#.##.\n...#a..K', gen(200, 200, 0.45, 3, 3000), gen(200, 200, 0.3, 26, 400), gen(200, 200, 0.55, 2, 40), gen(200, 200, 0.2, 1, 20000), gen(30, 30, 0.4, 5, 30)];
            },
            check: (inp) => { const g = linie(inp).slice(1); return dobraPlansza(inp, 200, 200, '.#SKa-z') && ile(g, 'S') === 1 && ile(g, 'K') === 1 ? null : 'plansza'; },
            solve: (inp) => {
                const { n, m, g } = czytajPlansze(inp);
                const pola = Array.from({ length: 26 }, () => []);
                for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const c = g[i].charCodeAt(j) - 97; if (c >= 0 && c < 26) pola[c].push(i * m + j); }
                const s = znajdz(g, 'S')[0], k = znajdz(g, 'K')[0];
                const d = new Int32Array(n * m).fill(-1); const uz = new Uint8Array(26); const q = new Kolejka([s[0] * m + s[1]]); d[s[0] * m + s[1]] = 0;
                while (!q.empty()) {
                    const v = q.pop(); const w = Math.floor(v / m), x = v % m; const c = g[w].charCodeAt(x) - 97;
                    if (c >= 0 && c < 26 && !uz[c]) { uz[c] = 1; for (const u of pola[c]) if (d[u] === -1) { d[u] = d[v] + 1; q.push(u); } }
                    for (const [dw, dk] of D4) { const a = w + dw, b = x + dk; if (a < 0 || a >= n || b < 0 || b >= m || g[a][b] === '#') continue; const u = a * m + b; if (d[u] === -1) { d[u] = d[v] + 1; q.push(u); } }
                }
                return String(d[k[0] * m + k[1]]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<pair<int, int>>> pola(26);
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    int kw = 0, kk = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            char c = g[w][k];
            if (c >= 'a' && c <= 'z') pola[c - 'a'].push_back({w, k});
            if (c == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
            if (c == 'K') {
                kw = w;
                kk = k;
            }
        }
    }
    bool uzyta[26] = {};
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        char c = g[w][k];
        if (c >= 'a' && c <= 'z' && !uzyta[c - 'a']) {
            uzyta[c - 'a'] = true;
            for (auto [tw, tk] : pola[c - 'a']) {
                if (odl[tw][tk] == -1) {
                    odl[tw][tk] = odl[w][k] + 1;
                    q.push({tw, tk});
                }
            }
        }
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#' || odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            q.push({nw, nk});
        }
    }
    cout << odl[kw][kk] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-najkrotszy-most', krok: 9, level: 'trudne',
            title: 'Najkrótszy most',
            short: 'Dwie wyspy i woda między nimi. Najpierw BFS znajduje całą pierwszą wyspę, potem BFS z wszystkich jej pól naraz płynie przez wodę — pierwsze dotknięcie drugiej wyspy to najkrótszy most.',
            tags: ['dwa etapy BFS', 'wiele startów', 'odległość − 1'],
            statement: ['Mapa n × m: # to ląd, a . woda. Na mapie są dokładnie dwie wyspy (spójne kawałki lądu, pola łączą się bokami). Trzeba połączyć je mostem, czyli zamienić w ląd jak najmniej pól wody tak, żeby wyspy połączyły się w jedną.',
                'Wypisz najmniejszą liczbę pól wody do zasypania. Najpierw znajdź dowolne pole lądu i BFS-em zaznacz całą jego wyspę. Potem wstaw wszystkie pola tej wyspy do kolejki z odległością 0 i rozchodź się po wodzie; gdy pierwszy raz dotrzesz do pola drugiej wyspy z odległością d, most ma d − 1 pól.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków # i ..'],
            output_format: ['Jedna liczba — najmniejsza liczba pól mostu.'],
            constraints: ['1 ≤ n, m ≤ 200', 'Na mapie są dokładnie dwie wyspy.'],
            examples: [{ input: '4 6\n##....\n#.....\n....##\n.....#', note: 'Prawe górne pole pierwszej wyspy i lewe górne pole drugiej dzielą 2 kroki w dół i 3 w prawo, więc wystarczy zasypać 4 pola wody, na przykład trzy pola w prawo w górnym wierszu i jedno pod ostatnim z nich. Krótszego mostu nie ma.' }],
            hint: R`Etap 1: BFS od pierwszego znalezionego pola # zaznacza wyspę (np. zamienia jej pola na 'A'). Etap 2: kolejka ze wszystkimi polami 'A' (odl = 0); dla sąsiada: jeśli to '#' — wypisz odl[v] (to liczba pól wody na drodze) i zakończ; jeśli to '.' i nieodwiedzone — odl + 1, do kolejki.`,
            tests: (r) => {
                const wyspa = (g, w0, k0, w1, k1, ileP) => { let w = r.int(w0, w1), k = r.int(k0, k1); for (let i = 0; i < ileP; i++) { g[w][k] = '#'; const [a, b] = r.pick(D4); w = Math.min(w1, Math.max(w0, w + a)); k = Math.min(k1, Math.max(k0, k + b)); } };
                const gen = (n, m, ileP, przerwa) => {
                    for (let proba = 0; proba < 200; proba++) {
                        const g = Array.from({ length: n }, () => new Array(m).fill('.'));
                        const pol = Math.floor(m / 2);
                        wyspa(g, 0, 0, n - 1, Math.max(0, pol - przerwa - 1), ileP); wyspa(g, 0, Math.min(m - 1, pol + przerwa), n - 1, m - 1, ileP);
                        const t = g.map((x) => x.join(''));
                        const lad = znajdz(t, '#'); if (!lad.length) continue;
                        const d = bfsPlansza(t, [lad[0]], (c) => c === '#');
                        const odw = lad.filter(([a, b]) => d[a * m + b] >= 0).length;
                        if (odw === lad.length) continue;
                        const reszta = lad.filter(([a, b]) => d[a * m + b] < 0);
                        const d2 = bfsPlansza(t, [reszta[0]], (c) => c === '#');
                        if (reszta.every(([a, b]) => d2[a * m + b] >= 0)) return planszaTxt(t);
                    }
                    throw new Error('kol-b-najkrotszy-most: brak mapy');
                };
                return ['1 3\n#.#', '2 2\n#.\n.#', '4 6\n##....\n#.....\n....##\n.....#', gen(200, 200, 3000, 10), gen(200, 200, 20000, 2), gen(200, 200, 800, 60), gen(50, 80, 600, 5), gen(200, 200, 40000, 1)];
            },
            check: (inp) => {
                if (!dobraPlansza(inp, 200, 200, '#.')) return 'plansza';
                const { m, g } = czytajPlansze(inp); const lad = znajdz(g, '#'); if (!lad.length) return 'ląd';
                let wysp = 0; const byl = new Set();
                for (const [a, b] of lad) { if (byl.has(a * m + b)) continue; wysp++; const d = bfsPlansza(g, [[a, b]], (c) => c === '#'); lad.forEach(([x, y]) => { if (d[x * m + y] >= 0) byl.add(x * m + y); }); if (wysp > 2) break; }
                return wysp === 2 ? null : 'wyspy';
            },
            solve: (inp) => {
                const { n, m, g } = czytajPlansze(inp);
                const lad = znajdz(g, '#'); const d1 = bfsPlansza(g, [lad[0]], (c) => c === '#');
                const pierwsza = lad.filter(([a, b]) => d1[a * m + b] >= 0);
                const naj = new Set(pierwsza.map(([a, b]) => a * m + b));
                const d = new Int32Array(n * m).fill(-1); const q = new Kolejka();
                for (const v of naj) { d[v] = 0; q.push(v); }
                while (!q.empty()) {
                    const v = q.pop(); const w = Math.floor(v / m), k = v % m;
                    for (const [dw, dk] of D4) { const a = w + dw, b = k + dk; if (a < 0 || a >= n || b < 0 || b >= m) continue; const u = a * m + b; if (g[a][b] === '#' && !naj.has(u)) return String(d[v]); if (g[a][b] === '.' && d[u] === -1) { d[u] = d[v] + 1; q.push(u); } }
                }
                return '-1';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    queue<pair<int, int>> q;
    for (int w = 0; w < n && q.empty(); w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == '#') {
                g[w][k] = 'A';
                q.push({w, k});
                break;
            }
        }
    }
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> fala;
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        odl[w][k] = 0;
        fala.push({w, k});
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] != '#') continue;
            g[nw][nk] = 'A';
            q.push({nw, nk});
        }
    }
    while (!fala.empty()) {
        auto [w, k] = fala.front();
        fala.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#') {
                cout << odl[w][k] << "\n";
                return 0;
            }
            if (g[nw][nk] == '.' && odl[nw][nk] == -1) {
                odl[nw][nk] = odl[w][k] + 1;
                fala.push({nw, nk});
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'kol-b-serwerownia', krok: 9, level: 'trudne',
            title: 'Serwerownia',
            short: 'Zadania czekają w kolejce na wolny serwer. Zanim obsłużysz nowe zadanie, przesuń czas: serwery, które zwolniły się wcześniej, zabierają po kolei zadania z kolejki.',
            tags: ['kolejka zadań', 'symulacja zdarzeń', 'remisy w czasie'],
            statement: ['Serwerownia ma k serwerów, ponumerowanych od 1, na początku wolnych. Przychodzi n zadań: zadanie i pojawia się w chwili tᵢ (chwile nie maleją) i jego wykonanie zajmuje dᵢ sekund. Zasady:',
                '• Gdy serwer kończy zadanie, a w kolejce czekają zadania, od razu bierze pierwsze z nich. Jeśli kilka serwerów kończy pracę w tej samej chwili, zadania z kolejki biorą po kolei od serwera o najmniejszym numerze.',
                '• Nowe zadanie, gdy kolejka jest pusta, trafia na wolny serwer o najmniejszym numerze; gdy żaden serwer nie jest wolny (albo w kolejce ktoś już czeka) — staje na końcu kolejki.',
                '• W tej samej chwili najpierw serwery zabierają zadania z kolejki, a dopiero potem przydziela się nowe zadania. Serwer, który kończy pracę w chwili t, jest w chwili t wolny.',
                'Dla każdego zadania wypisz numer serwera i chwilę zakończenia.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z n kolejnych wierszy liczby tᵢ i dᵢ.'],
            output_format: ['n wierszy: numer serwera i chwila zakończenia zadania.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ k ≤ 20', '0 ≤ tᵢ ≤ 10⁶, niemalejąco', '1 ≤ dᵢ ≤ 10⁴'],
            examples: [{ input: '5 2\n0 5\n1 5\n2 2\n3 1\n5 4', note: 'Zadania 1 i 2 zajmują oba serwery (do chwil 5 i 6). Zadania 3 i 4 czekają w kolejce. W chwili 5 serwer 1 bierze zadanie 3 (do 7), w chwili 6 serwer 2 bierze zadanie 4 (do 7). Zadanie 5 z chwili 5 czeka i dostaje w chwili 7 serwer 1 (do 11).' }],
            hint: R`vector<long long> wolny(k, 0); — od kiedy serwer jest wolny. queue<int> q; — numery czekających zadań. Przed zadaniem z chwili t: while (!q.empty()) { znajdź s z najmniejszym wolny[s] (przy remisie mniejszy numer); if (wolny[s] > t) break; przydziel q.front() od chwili wolny[s]; }. Potem nowe zadanie: jeśli q puste i jest serwer z wolny[s] <= t — najmniejszy taki numer, start w t; inaczej q.push(i). Na końcu opróżnij kolejkę tą samą pętlą.`,
            tests: (r) => {
                const gen = (n, k, dt, md) => { const o = []; let t = r.int(0, 3); for (let i = 0; i < n; i++) { t += r.int(0, dt); o.push(`${t} ${r.int(1, md)}`); } return `${n} ${k}\n${o.join('\n')}`; };
                return ['1 1\n0 1', '3 1\n0 2\n0 2\n2 1', '5 2\n0 5\n1 5\n2 2\n3 1\n5 4', '4 3\n0 4\n0 4\n0 4\n4 1', gen(30, 3, 2, 8), gen(2000, 20, 3, 100), gen(2000, 5, 10, 60), gen(2000, 1, 50, 50), gen(2000, 20, 0, 300), gen(300, 4, 5, 20)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, k] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 2000) || !calk(k, 1, 20) || L.length !== n + 1) return 'n';
                let pt = 0;
                for (const l of L.slice(1)) { const [t, d] = l.split(' ').map(Number); if (!calk(t, 0, 1e6) || t < pt || !calk(d, 1, 1e4)) return 'zadanie'; pt = t; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const [n, k] = L[0].split(' ').map(Number);
                const z = L.slice(1).map((l) => l.split(' ').map(Number));
                const wolny = new Array(k).fill(0); const q = new Kolejka(); const wyn = new Array(n);
                const najwczesniej = () => { let s = 0; for (let i = 1; i < k; i++) if (wolny[i] < wolny[s]) s = i; return s; };
                const zKolejki = (t) => { while (!q.empty()) { const s = najwczesniej(); if (wolny[s] > t) break; const j = q.pop(); wolny[s] += z[j][1]; wyn[j] = `${s + 1} ${wolny[s]}`; } };
                z.forEach(([t, d], i) => {
                    zKolejki(t);
                    let s = -1; if (q.empty()) for (let j = 0; j < k; j++) if (wolny[j] <= t) { s = j; break; }
                    if (s >= 0) { wolny[s] = t + d; wyn[i] = `${s + 1} ${wolny[s]}`; } else q.push(i);
                });
                zKolejki(Infinity);
                return wyn.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, k;
vector<long long> wolny, t, d, koniec;
vector<int> serwer;
queue<int> q;
int najwczesniejszy() {
    int s = 0;
    for (int i = 1; i < k; i++) {
        if (wolny[i] < wolny[s]) s = i;
    }
    return s;
}
void zKolejki(long long teraz) {
    while (!q.empty()) {
        int s = najwczesniejszy();
        if (wolny[s] > teraz) break;
        int j = q.front();
        q.pop();
        wolny[s] += d[j];
        serwer[j] = s + 1;
        koniec[j] = wolny[s];
    }
}
int main() {
    cin >> n >> k;
    wolny.assign(k, 0);
    t.assign(n, 0);
    d.assign(n, 0);
    koniec.assign(n, 0);
    serwer.assign(n, 0);
    q = queue<int>();
    for (int i = 0; i < n; i++) cin >> t[i] >> d[i];
    for (int i = 0; i < n; i++) {
        zKolejki(t[i]);
        int s = -1;
        if (q.empty()) {
            for (int j = 0; j < k; j++) {
                if (wolny[j] <= t[i]) {
                    s = j;
                    break;
                }
            }
        }
        if (s >= 0) {
            wolny[s] = t[i] + d[i];
            serwer[i] = s + 1;
            koniec[i] = wolny[s];
        } else {
            q.push(i);
        }
    }
    zKolejki(LLONG_MAX);
    for (int i = 0; i < n; i++) cout << serwer[i] << " " << koniec[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-b-final-waz', krok: 9, level: 'trudne',
            title: 'Wielki finał: gra w węża',
            short: 'Wąż to deque pól planszy: nowa głowa wchodzi z przodu, ogon wychodzi z tyłu — chyba że wąż właśnie zjadł jabłko. Zasymuluj całą grę: ściany, ogon, jabłka i wynik.',
            tags: ['deque<pair<int, int>>', 'tablica zajętych pól', 'symulacja gry'],
            statement: ['Plansza ma n wierszy i m kolumn (numerowanych od 1). Wąż na początku zajmuje jedno pole (r₀, c₀) i ma długość 1. Na planszy leży A jabłek na różnych polach. Gracz wydaje polecenia: G (w górę, wiersz − 1), D (w dół, wiersz + 1), L (w lewo, kolumna − 1) i P (w prawo, kolumna + 1). Każde polecenie przesuwa głowę węża o jedno pole:',
                '• jeśli nowe pole jest poza planszą — gra kończy się uderzeniem w ścianę;',
                '• jeśli na nowym polu jest jabłko — wąż je zjada i rośnie: głowa wchodzi na nowe pole, a ogon zostaje na miejscu;',
                '• w przeciwnym razie wąż pełznie: głowa wchodzi na nowe pole, a ogon schodzi z ostatniego pola. Dlatego wolno wejść głową na pole, z którego właśnie schodzi ogon;',
                '• jeśli nowe pole zajmuje ciało węża (i nie jest to pole ogona, który właśnie schodzi) — gra kończy się ugryzieniem ogona.',
                'Wypisz, jak skończyła się gra, ile jabłek zjadł wąż oraz gdzie są jego głowa i ogon po ostatnim udanym ruchu. Trzymaj węża w deque<pair<int, int>> (głowa z przodu, ogon z tyłu) i zajęte pola w tablicy — sprawdzanie całego ciała przy każdym ruchu byłoby za wolne.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu r₀ i c₀.', 'W trzecim wierszu liczba A, a w każdym z A kolejnych wierszy pozycja jabłka r c.', 'W ostatnim wierszu napis z poleceniami (litery G, D, L, P).'],
            output_format: ['Cztery wiersze: koniec w ruchu i: sciana, koniec w ruchu i: ogon albo wszystkie ruchy wykonane; potem zjedzone: X, glowa: r c i ogon: r c.'],
            constraints: ['1 ≤ n, m ≤ 100', '0 ≤ A ≤ 2000; jabłka leżą na różnych polach, żadne na polu startowym.', 'Napis ma od 1 do 50 000 liter.'],
            examples: [{ input: '3 5\n2 1\n4\n2 2\n2 3\n2 4\n2 5\nPPPPGLD', note: 'Wąż zjada cztery jabłka w rzędzie (ma długość 5), skręca w górę i w lewo — pełznie, więc ogon schodzi z pól (2, 1) i (2, 2). Ruch 7 w dół trafia w pole (2, 4), które zajmuje ciało węża, a ogon jest w (2, 3) — to ugryzienie.' },
                { input: '2 2\n1 1\n3\n1 2\n2 2\n2 1\nPDLGPDLG', note: 'Po zjedzeniu trzech jabłek wąż zajmuje całą planszę 2 × 2, a mimo to krąży dalej: za każdym razem wchodzi na pole, z którego właśnie schodzi ogon.' }],
            hint: R`deque<pair<int, int>> waz; vector<vector<int>> zajete(n + 1, vector<int>(m + 1, 0)); vector<vector<bool>> jablko(…);. Ruch: nowe pole (nw, nk); poza planszą → koniec. if (zajete[nw][nk] && make_pair(nw, nk) != waz.back()) → ogon. Jeśli jabłko — zjedz; jeśli nie — zdejmij ogon (zajete = 0, pop_back). Na końcu push_front i zajete = 1.`,
            tests: (r) => {
                const DIR = { G: [-1, 0], D: [1, 0], L: [0, -1], P: [0, 1] };
                const gra = (n, m, A, L, tryb) => {
                    const r0 = r.int(1, n), c0 = r.int(1, m);
                    const jab = new Set(); while (jab.size < Math.min(A, n * m - 1)) { const a = r.int(1, n), b = r.int(1, m); if (a !== r0 || b !== c0) jab.add(a * 1000 + b); }
                    const jablka = [...jab];
                    const waz = new Deque([[r0, c0]]); const zaj = new Set([r0 * 1000 + c0]); const ruchy = [];
                    // Ile wolnych pól widać z (w0, k0) — liczymy najwyżej do lim (pole ogona traktujemy jak wolne).
                    const wolneOd = (w0, k0, lim, ogonKl) => {
                        const byl = new Set([w0 * 1000 + k0]); const q = [[w0, k0]]; let hh = 0;
                        while (hh < q.length && byl.size < lim) {
                            const [w, k] = q[hh++];
                            for (const [a, b] of D4) { const x = w + a, y = k + b; if (x < 1 || x > n || y < 1 || y > m) continue; const kl = x * 1000 + y; if (byl.has(kl) || (zaj.has(kl) && kl !== ogonKl)) continue; byl.add(kl); q.push([x, y]); }
                        }
                        return byl.size;
                    };
                    for (let krok = 0; krok < L; krok++) {
                        const [hw, hk] = waz.front(); const [tw, tk] = waz.back();
                        const ocena = Object.entries(DIR).map(([lit, [a, b]]) => {
                            const w = hw + a, k = hk + b;
                            const poza = w < 1 || w > n || k < 1 || k > m;
                            const ogon = !poza && zaj.has(w * 1000 + k) && !(w === tw && k === tk);
                            return { lit, w, k, poza, ogon };
                        });
                        const bezp = ocena.filter((o) => !o.poza && !o.ogon);
                        let wyb = null;
                        if (tryb === 'sciana' && krok > L / 2) wyb = ocena.find((o) => o.poza);
                        if (tryb === 'ogon' && krok > L / 2 && waz.size >= 5) wyb = ocena.find((o) => o.ogon);
                        if (!wyb) {
                            const prog = Math.min(waz.size + 3, n * m - waz.size);
                            const dobre = bezp.filter((o) => wolneOd(o.w, o.k, prog, tw * 1000 + tk) >= prog);
                            const pula = dobre.length ? dobre : bezp;
                            if (!pula.length) wyb = r.pick(ocena);
                            else if (ruchy.length && r() < 0.55) wyb = pula.find((o) => o.lit === ruchy[ruchy.length - 1]) || r.pick(pula);
                            else wyb = r.pick(pula);
                        }
                        ruchy.push(wyb.lit);
                        if (wyb.poza || wyb.ogon) break;
                        const kl = wyb.w * 1000 + wyb.k;
                        if (jab.has(kl)) jab.delete(kl); else { const [a, b] = waz.popBack(); zaj.delete(a * 1000 + b); }
                        waz.pushFront([wyb.w, wyb.k]); zaj.add(kl);
                    }
                    return `${n} ${m}\n${r0} ${c0}\n${jablka.length}${jablka.length ? '\n' : ''}${jablka.map((x) => `${Math.floor(x / 1000)} ${x % 1000}`).join('\n')}\n${ruchy.join('')}`;
                };
                return ['1 1\n1 1\n0\nP', '1 3\n1 1\n2\n1 2\n1 3\nPPL', '2 2\n1 1\n2\n1 2\n2 2\nPDLG', '3 4\n2 1\n2\n2 2\n2 3\nPPGLLD', gra(100, 100, 2000, 50000, 'zyje'), gra(100, 100, 300, 50000, 'ogon'), gra(100, 100, 50, 50000, 'sciana'), gra(20, 30, 400, 20000, 'zyje'), gra(10, 10, 99, 5000, 'zyje'), gra(60, 60, 1500, 40000, 'ogon'), gra(100, 100, 200, 50000, 'zyje'), gra(100, 100, 30, 30000, 'zyje')];
            },
            check: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 100) || !calk(m, 1, 100)) return 'plansza';
                const [r0, c0] = L[1].split(' ').map(Number); if (!calk(r0, 1, n) || !calk(c0, 1, m)) return 'start';
                const A = Number(L[2]); if (!calk(A, 0, 2000) || L.length !== A + 4) return 'jabłka';
                const byl = new Set([r0 * 1000 + c0]);
                for (const l of L.slice(3, 3 + A)) { const [a, b] = l.split(' ').map(Number); if (!calk(a, 1, n) || !calk(b, 1, m) || byl.has(a * 1000 + b)) return 'jabłko'; byl.add(a * 1000 + b); }
                return /^[GDLP]{1,50000}$/.test(L[3 + A]) ? null : 'ruchy';
            },
            solve: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); const [r0, c0] = L[1].split(' ').map(Number);
                const A = Number(L[2]); const jab = new Set(L.slice(3, 3 + A).map((l) => { const [a, b] = l.split(' ').map(Number); return a * 1000 + b; }));
                const DIR = { G: [-1, 0], D: [1, 0], L: [0, -1], P: [0, 1] };
                const waz = new Deque([[r0, c0]]); const zaj = new Set([r0 * 1000 + c0]); let zjedzone = 0, koniec = 'wszystkie ruchy wykonane';
                const ruchy = L[3 + A];
                for (let i = 0; i < ruchy.length; i++) {
                    const [a, b] = DIR[ruchy[i]]; const [hw, hk] = waz.front(); const [tw, tk] = waz.back();
                    const w = hw + a, k = hk + b;
                    if (w < 1 || w > n || k < 1 || k > m) { koniec = `koniec w ruchu ${i + 1}: sciana`; break; }
                    if (zaj.has(w * 1000 + k) && !(w === tw && k === tk)) { koniec = `koniec w ruchu ${i + 1}: ogon`; break; }
                    if (jab.has(w * 1000 + k)) { jab.delete(w * 1000 + k); zjedzone++; } else { waz.popBack(); zaj.delete(tw * 1000 + tk); }
                    waz.pushFront([w, k]); zaj.add(w * 1000 + k);
                }
                return `${koniec}\nzjedzone: ${zjedzone}\nglowa: ${waz.front().join(' ')}\nogon: ${waz.back().join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, r0, c0, A;
    cin >> n >> m >> r0 >> c0 >> A;
    vector<vector<bool>> jablko(n + 1, vector<bool>(m + 1, false));
    for (int i = 0; i < A; i++) {
        int a, b;
        cin >> a >> b;
        jablko[a][b] = true;
    }
    string ruchy;
    cin >> ruchy;
    vector<vector<int>> zajete(n + 1, vector<int>(m + 1, 0));
    deque<pair<int, int>> waz;
    waz.push_front({r0, c0});
    zajete[r0][c0] = 1;
    int zjedzone = 0;
    string koniec = "wszystkie ruchy wykonane";
    for (int i = 0; i < (int)ruchy.size(); i++) {
        char c = ruchy[i];
        int nw = waz.front().first, nk = waz.front().second;
        if (c == 'G') nw--;
        else if (c == 'D') nw++;
        else if (c == 'L') nk--;
        else nk++;
        if (nw < 1 || nw > n || nk < 1 || nk > m) {
            koniec = "koniec w ruchu " + to_string(i + 1) + ": sciana";
            break;
        }
        if (zajete[nw][nk] && make_pair(nw, nk) != waz.back()) {
            koniec = "koniec w ruchu " + to_string(i + 1) + ": ogon";
            break;
        }
        if (jablko[nw][nk]) {
            jablko[nw][nk] = false;
            zjedzone++;
        } else {
            zajete[waz.back().first][waz.back().second] = 0;
            waz.pop_back();
        }
        waz.push_front({nw, nk});
        zajete[nw][nk] = 1;
    }
    cout << koniec << "\n";
    cout << "zjedzone: " << zjedzone << "\n";
    cout << "glowa: " << waz.front().first << " " << waz.front().second << "\n";
    cout << "ogon: " << waz.back().first << " " << waz.back().second << "\n";
    return 0;
}`,
        },
    ];
};
