// Kolejka — ćwiczenia w trakcie lekcji, części 1–3: pierwsza kolejka (push, front, back, pop, size, empty, opróżnianie,
// kopia kolejki, dwie kolejki naraz), polecenia i obroty (pusta kolejka, push(front()) + pop(), wyliczanki, kilka testów
// i czyszczenie kolejki, vector z erase(begin()) jest za wolny) oraz kolejka par i struktur (front() jako referencja,
// powrót na koniec z licznikiem, symulacje z czasem, leniwe usuwanie).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kolejka-pomoc');
    const { IMIONA, Kolejka, calk, unikalneImiona, unikalneSlowa } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const czyImie = (s, max = 15) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const czyNazwa = (s, max = 15) => new RegExp(`^[A-Za-z][A-Za-z0-9]{0,${max - 1}}$`).test(s);
    const czyMale = (s, max = 15) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const imiona = (r, n) => Array.from({ length: n }, () => r.pick(IMIONA));

    return [
        // ================================================================ KROK 1 · pierwsza kolejka
        {
            id: 'kol-bilety-do-kina', krok: 1, level: 'latwe',
            title: 'Kolejka do kina',
            short: 'Imiona trafiają do queue<string>. Kto stoi pierwszy, kto ostatni, ile osób czeka — i kto będzie pierwszy, gdy kasjer obsłuży dwie osoby.',
            tags: ['push', 'front i back', 'size i pop'],
            statement: ['Przed kasą kina ustawiło się n osób. Wczytaj ich imiona w kolejności przychodzenia i wstaw każde do kolejki queue<string> poleceniem push.',
                'Wypisz, kto stoi pierwszy (front), kto ostatni (back) i ile osób czeka (size). Potem kasjer sprzedaje bilety dwóm pierwszym osobom — dwa razy usuń pierwszą osobę z kolejki poleceniem pop, ale tylko wtedy, gdy ktoś jeszcze stoi. Na koniec wypisz, kto jest teraz pierwszy, albo słowo nikt, jeśli kolejka jest pusta.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n imion oddzielonych spacjami — w kolejności, w jakiej osoby przyszły.'],
            output_format: ['Cztery wiersze: pierwszy: …, ostatni: …, czeka: … oraz teraz pierwszy: … (imię albo słowo nikt).'],
            constraints: ['1 ≤ n ≤ 100', 'Imiona mają od 1 do 15 liter; pierwsza jest wielka, reszta małe. Imiona mogą się powtarzać.'],
            examples: [{ input: '4\nAla Ola Kuba Ewa', note: 'Pierwsza przyszła Ala, ostatnia Ewa. Po sprzedaży biletów Ali i Oli pierwszy w kolejce jest Kuba.' }],
            hint: R`queue<string> q; i w pętli: cin >> imie; q.push(imie);. Potem q.front(), q.back() i q.size(). Dwie sprzedaże: for (int i = 0; i < 2; i++) if (!q.empty()) q.pop();. Na końcu: if (q.empty()) cout << "nikt"; else cout << q.front();.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d(['Bo']), d(['Ala', 'Ola']), d(['Ewa', 'Iga', 'Ida']), d(imiona(r, 10)), d(imiona(r, 100)), d(imiona(r, 5))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => czyImie(s)) ? null : 'dane'; },
            solve: (inp) => {
                const a = toks(inp).slice(1);
                const po = a.slice(2);
                return [`pierwszy: ${a[0]}`, `ostatni: ${a[a.length - 1]}`, `czeka: ${a.length}`, `teraz pierwszy: ${po.length ? po[0] : 'nikt'}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<string> q;
    for (int i = 0; i < n; i++) {
        string imie;
        cin >> imie;
        q.push(imie);
    }
    cout << "pierwszy: " << q.front() << "\n";
    cout << "ostatni: " << q.back() << "\n";
    cout << "czeka: " << q.size() << "\n";
    for (int i = 0; i < 2; i++) {
        if (!q.empty()) q.pop();
    }
    cout << "teraz pierwszy: ";
    if (q.empty()) cout << "nikt\n";
    else cout << q.front() << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-po-kolei', krok: 1, level: 'latwe',
            title: 'Obsługa po kolei',
            short: 'Jedno okienko, n osób w kolejce. Pętla while (!q.empty()) obsługuje je po kolei i za każdym razem mówi, ile osób jeszcze czeka.',
            tags: ['while (!q.empty())', 'front i pop', 'size po pop'],
            statement: ['W urzędzie jest jedno okienko. Przyszło n osób — wczytaj ich imiona do kolejki queue<string>.',
                'Potem obsługuj osoby po kolei, dopóki kolejka nie jest pusta: wypisz numer obsługi i imię pierwszej osoby, usuń ją z kolejki, a w nawiasie podaj, ile osób czeka jeszcze za nią. Na koniec wypisz, ile osób obsłużono.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n imion oddzielonych spacjami.'],
            output_format: ['n wierszy w formacie nr. imie (czeka jeszcze k), a potem wiersz obsluzono: n.'],
            constraints: ['1 ≤ n ≤ 500', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą; mogą się powtarzać.'],
            examples: [{ input: '3\nKuba Ala Ola', note: 'Kuba jest obsłużony pierwszy i za nim czekają jeszcze dwie osoby. Po obsłużeniu Oli kolejka jest pusta.' }],
            hint: R`int nr = 1; while (!q.empty()) { string kto = q.front(); q.pop(); cout << nr << ". " << kto << " (czeka jeszcze " << q.size() << ")\n"; nr++; }. Zwróć uwagę: najpierw pop, potem size — wtedy size mówi, ile osób zostało.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d(['Ala']), d(['Ewa', 'Ewa']), d(imiona(r, 7)), d(imiona(r, 500)), d(imiona(r, 40))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 500) && t.length === n + 1 && t.slice(1).every((s) => czyImie(s)) ? null : 'dane'; },
            solve: (inp) => {
                const a = toks(inp).slice(1);
                const o = a.map((x, i) => `${i + 1}. ${x} (czeka jeszcze ${a.length - i - 1})`);
                o.push(`obsluzono: ${a.length}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<string> q;
    for (int i = 0; i < n; i++) {
        string imie;
        cin >> imie;
        q.push(imie);
    }
    int nr = 1;
    while (!q.empty()) {
        string kto = q.front();
        q.pop();
        cout << nr << ". " << kto << " (czeka jeszcze " << q.size() << ")\n";
        nr++;
    }
    cout << "obsluzono: " << nr - 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-co-zostalo', krok: 1, level: 'latwe',
            title: 'Co zostało w kolejce?',
            short: 'Kasa zdąży obsłużyć k klientów — usuń ich z przodu kolejki (o ile ktoś jeszcze stoi) i wypisz, kto czeka dalej.',
            tags: ['pop k razy', 'pusta kolejka', 'wypisywanie kolejki'],
            statement: ['W kolejce do kasy stoi n klientów; każdy ma swój numer. Zanim kasa się zamknie, kasjer zdąży obsłużyć k klientów — po kolei, od pierwszego w kolejce.',
                'Wstaw numery do kolejki queue<int>, a potem usuń z jej przodu k numerów — albo wszystkie, jeśli k jest większe niż liczba czekających (pop na pustej kolejce to błąd, więc pilnuj tego). Wypisz, ilu klientów obsłużono, a w drugim wierszu numery tych, którzy wciąż czekają, od pierwszego do ostatniego — albo słowo nikt.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n numerów klientów w kolejności z kolejki.'],
            output_format: ['Dwa wiersze: obsluzono: X oraz czekaja: … (numery oddzielone spacjami albo słowo nikt).'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k ≤ 2000', 'Numery klientów są od 1 do 10⁶.'],
            examples: [{ input: '5 2\n17 4 9 30 2', note: 'Obsłużeni zostają 17 i 4. Czekają 9, 30 i 2 — w tej samej kolejności co na początku.' },
                { input: '3 7\n5 6 7', note: 'Kasjer mógłby obsłużyć 7 osób, ale czekają tylko 3. Kolejka jest pusta.' }],
            hint: R`int obsluzono = 0; while (k > 0 && !q.empty()) { q.pop(); k--; obsluzono++; }. Potem wypisz resztę: while (!q.empty()) { cout << q.front() << " "; q.pop(); } — a jeśli kolejka była pusta od razu, wypisz nikt.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                const los = (n) => Array.from({ length: n }, () => r.int(1, 1000000));
                return [d([1], 0), d([1], 1), d([8, 8, 8], 2000), d(los(1000), 999), d(los(1000), 0), d(los(30), 12), d(los(500), r.int(0, 500))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && calk(t[1], 0, 2000) && t.length === t[0] + 2 && t.slice(2).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp);
                const n = t[0], k = t[1], a = t.slice(2);
                const ob = Math.min(n, k);
                const reszta = a.slice(ob);
                return `obsluzono: ${ob}\nczekaja: ${reszta.length ? reszta.join(' ') : 'nikt'}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
    }
    int obsluzono = 0;
    while (k > 0 && !q.empty()) {
        q.pop();
        k--;
        obsluzono++;
    }
    cout << "obsluzono: " << obsluzono << "\n";
    cout << "czekaja:";
    if (q.empty()) cout << " nikt";
    while (!q.empty()) {
        cout << " " << q.front();
        q.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-po-kazdej-zmianie', krok: 1, level: 'latwe',
            title: 'Kolejka po każdej zmianie',
            short: 'Polecenia + x i -, a po każdym cała kolejka na ekranie. Funkcja wypisz(queue<int> q) dostaje kopię, więc może ją bez strachu opróżnić.',
            tags: ['kolejka jako parametr', 'kopia kolejki', 'opróżnianie kopii'],
            statement: ['Kolejka liczb jest na początku pusta. Wykonaj q poleceń: + x oznacza, że liczba x staje na końcu kolejki, a - — że pierwsza liczba wychodzi z kolejki. Polecenie - pojawia się tylko wtedy, gdy kolejka nie jest pusta.',
                'Po każdym poleceniu wypisz całą kolejkę od pierwszej do ostatniej liczby (oddzielone spacjami) albo słowo pusta. Kolejki nie da się przejść pętlą for jak vectora — trzeba ją opróżniać. Napisz więc funkcję void wypisz(queue<int> q): parametr bez & to kopia, więc funkcja opróżnia tylko swoją kopię, a kolejka w main zostaje nietknięta.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie: + x albo -.'],
            output_format: ['q wierszy — zawartość kolejki po każdym poleceniu (albo pusta).'],
            constraints: ['1 ≤ q ≤ 60', '1 ≤ x ≤ 999', 'Polecenie - nigdy nie dotyczy pustej kolejki.'],
            examples: [{ input: '5\n+ 4\n+ 7\n+ 1\n-\n+ 9', note: 'Po trzech poleceniach + kolejka to 4 7 1. Polecenie - usuwa 4 (pierwszą), a 9 staje na końcu.' }],
            hint: R`void wypisz(queue<int> q) { if (q.empty()) { cout << "pusta\n"; return; } while (!q.empty()) { cout << q.front() << " "; q.pop(); } cout << "\n"; } — w main po każdym poleceniu wołasz wypisz(q);. Polecenie czytaj jako char albo string: cin >> c; if (c == '+') { cin >> x; q.push(x); } else q.pop();.`,
            tests: (r) => {
                const gen = (q) => {
                    const o = []; let size = 0;
                    for (let i = 0; i < q; i++) {
                        if (size && r() < 0.4) { o.push('-'); size--; } else { o.push(`+ ${r.int(1, 999)}`); size++; }
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\n+ 5', '2\n+ 5\n-', '6\n+ 1\n+ 2\n-\n-\n+ 3\n-', gen(20), gen(60), gen(60), gen(35)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 60) || L.length !== q + 1) return 'liczba poleceń';
                let s = 0;
                for (const l of L.slice(1)) {
                    if (l === '-') { if (!s) return 'pop z pustej'; s--; } else { const m = l.match(/^\+ (\d+)$/); if (!m || !calk(Number(m[1]), 1, 999)) return 'polecenie'; s++; }
                }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp).slice(1);
                const q = new Kolejka();
                const o = [];
                for (const l of L) {
                    if (l === '-') q.pop(); else q.push(Number(l.slice(2)));
                    o.push(q.empty() ? 'pusta' : q.toArray().join(' '));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(queue<int> q) {
    if (q.empty()) {
        cout << "pusta\n";
        return;
    }
    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }
    cout << "\n";
}
int main() {
    int ile;
    cin >> ile;
    queue<int> q;
    for (int i = 0; i < ile; i++) {
        char c;
        cin >> c;
        if (c == '+') {
            int x;
            cin >> x;
            q.push(x);
        } else {
            q.pop();
        }
        wypisz(q);
    }
    return 0;
}`,
        },
        {
            id: 'kol-na-zmiane', krok: 1, level: 'latwe',
            title: 'Dwie kolejki na zmianę',
            short: 'Zostaje jedna kasa i dwie kolejki. Obsługujemy na zmianę: z pierwszej, z drugiej, z pierwszej… — a gdy jedna się skończy, już tylko drugą.',
            tags: ['dwie kolejki', 'warunek z ||', 'empty przed front'],
            statement: ['W sklepie stały dwie kolejki do dwóch kas: w pierwszej n osób, w drugiej m osób. Jedna kasa się zepsuła, więc kierownik zarządził: obsługujemy na zmianę — najpierw pierwszą osobę z pierwszej kolejki, potem pierwszą z drugiej, potem znów z pierwszej i tak dalej. Gdy jedna kolejka się skończy, obsługujemy już tylko osoby z drugiej.',
                'Wczytaj obie kolejki do dwóch zmiennych queue<string> i wypisz imiona w kolejności obsługi, każde w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n imion z pierwszej kolejki (gdy n = 0, ten wiersz jest pusty).', 'W trzecim wierszu liczba m, w czwartym m imion z drugiej kolejki (gdy m = 0, wiersz jest pusty).'],
            output_format: ['n + m wierszy — imiona w kolejności obsługi.'],
            constraints: ['0 ≤ n, m ≤ 500', 'n + m ≥ 1', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą.'],
            examples: [{ input: '3\nAla Bartek Celina\n1\nDawid', note: 'Najpierw Ala (kolejka 1), potem Dawid (kolejka 2). Druga kolejka jest już pusta, więc dalej tylko Bartek i Celina.' }],
            hint: R`while (!a.empty() || !b.empty()) { if (!a.empty()) { cout << a.front() << "\n"; a.pop(); } if (!b.empty()) { cout << b.front() << "\n"; b.pop(); } }. Każde front() poprzedź sprawdzeniem empty().`,
            tests: (r) => {
                const d = (a, b) => `${a.length}\n${a.join(' ')}\n${b.length}\n${b.join(' ')}`;
                return [d(['Ala'], []), d([], ['Ola']), d(['A', 'B'], ['C', 'D']), d(imiona(r, 1), imiona(r, 6)), d(imiona(r, 500), imiona(r, 500)), d(imiona(r, 300), imiona(r, 20)), d(imiona(r, 9), imiona(r, 10))];
            },
            check: (inp) => {
                const t = toks(inp); const n = Number(t[0]);
                if (!calk(n, 0, 500)) return 'n';
                const m = Number(t[n + 1]);
                if (!calk(m, 0, 500) || n + m < 1 || t.length !== n + m + 2) return 'm';
                return t.filter((_, i) => i !== 0 && i !== n + 1).every((s) => czyImie(s)) ? null : 'imiona';
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]);
                const a = t.slice(1, 1 + n), b = t.slice(2 + n);
                const o = [];
                for (let i = 0; i < Math.max(a.length, b.length); i++) { if (i < a.length) o.push(a[i]); if (i < b.length) o.push(b[i]); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    queue<string> a, b;
    int n, m;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        a.push(s);
    }
    cin >> m;
    for (int i = 0; i < m; i++) {
        string s;
        cin >> s;
        b.push(s);
    }
    while (!a.empty() || !b.empty()) {
        if (!a.empty()) {
            cout << a.front() << "\n";
            a.pop();
        }
        if (!b.empty()) {
            cout << b.front() << "\n";
            b.pop();
        }
    }
    return 0;
}`,
        },
        {
            id: 'kol-najpierw-parzyste', krok: 1, level: 'latwe',
            title: 'Najpierw parzyste',
            short: 'Liczby rozchodzą się do dwóch kolejek: parzyste i nieparzyste. Każda kolejka pamięta kolejność, w jakiej liczby przyszły — także te ujemne.',
            tags: ['dwie kolejki', 'parzystość i minusy', 'kolejność zachowana'],
            statement: ['Wczytaj n liczb całkowitych. Każdą parzystą wstaw do kolejki parzyste, a każdą nieparzystą — do kolejki nieparzyste. Obie kolejki zachowują kolejność, w jakiej liczby przyszły.',
                'Wypisz w pierwszym wierszu, ile jest liczb parzystych, i je same (opróżniając kolejkę), a w drugim — to samo dla nieparzystych. Jeśli jakaś kolejka jest pusta, zamiast liczb wypisz słowo brak. Uwaga: liczby mogą być ujemne.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: parzyste (k): … oraz nieparzyste (k): … — liczby oddzielone spacjami albo słowo brak.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ liczby ≤ 10⁹'],
            examples: [{ input: '7\n3 -4 8 -7 0 5 12', note: 'Parzyste: −4, 8, 0 i 12 (zero też jest parzyste). Nieparzyste: 3, −7 i 5 — w tej samej kolejności co na wejściu.' }],
            hint: R`Parzystość sprawdzaj warunkiem x % 2 == 0. Nie pisz x % 2 == 1 dla nieparzystych: dla −7 reszta wynosi −1, a nie 1 (lekcja o modulo). Wypisując, najpierw sprawdź q.empty() i ewentualnie wypisz brak.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const los = (n, m) => Array.from({ length: n }, () => r.int(-m, m));
                return [d([2]), d([-3]), d([-1, -3, -5, 7]), d([0, -2, 4, 1000000000]), d(los(1000, 1e9)), d(los(40, 20)), d(los(9, 5))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1);
                const p = a.filter((x) => x % 2 === 0), np = a.filter((x) => x % 2 !== 0);
                const w = (nazwa, t) => `${nazwa} (${t.length}): ${t.length ? t.join(' ') : 'brak'}`;
                return `${w('parzyste', p)}\n${w('nieparzyste', np)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(string nazwa, queue<long long> &q) {
    cout << nazwa << " (" << q.size() << "):";
    if (q.empty()) cout << " brak";
    while (!q.empty()) {
        cout << " " << q.front();
        q.pop();
    }
    cout << "\n";
}
int main() {
    int n;
    cin >> n;
    queue<long long> parzyste, nieparzyste;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x % 2 == 0) parzyste.push(x);
        else nieparzyste.push(x);
    }
    wypisz("parzyste", parzyste);
    wypisz("nieparzyste", nieparzyste);
    return 0;
}`,
        },
        {
            id: 'kol-sito', krok: 1, level: 'latwe',
            title: 'Sito na kolejce',
            short: 'Każde sito przepuszcza całą kolejkę jeden raz: wyjmij liczbę z przodu i — jeśli przeszła — odłóż ją na koniec. Najpierw zapamiętaj, ile razy to zrobić!',
            tags: ['int ile = q.size()', 'push(front()) i pop', 'filtrowanie'],
            statement: ['W kolejce stoi n liczb. Potem kolejno działa m sit: sito k usuwa z kolejki wszystkie liczby podzielne przez k, a pozostałe zostawia w tej samej kolejności.',
                'Przepuść kolejkę przez każde sito tak: tyle razy, ile liczb było w kolejce na początku tego sita, wyjmij liczbę z przodu i — jeśli nie jest podzielna przez k — wstaw ją z powrotem na koniec. Po każdym sicie wypisz, ile liczb zostało i która jest pierwsza. Na koniec wypisz całą kolejkę.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n liczb — zawartość kolejki od pierwszej do ostatniej.', 'W trzecim wierszu m liczb k — sita w kolejności działania.'],
            output_format: ['m wierszy: sito k: zostalo X, pierwsza Y (gdy X = 0 — tylko sito k: zostalo 0).', 'Na końcu wiersz kolejka: … (liczby oddzielone spacjami albo słowo pusta).'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ m ≤ 50', '1 ≤ liczby ≤ 10⁶', '2 ≤ k ≤ 100'],
            examples: [{ input: '10 2\n2 3 4 5 6 7 8 9 10 11\n2 3', note: 'Sito 2 zostawia 3 5 7 9 11. Sito 3 usuwa 3 i 9 — zostają 5 7 11.' }],
            hint: R`Najpierw int ile = q.size();, potem for (int i = 0; i < ile; i++) { int x = q.front(); q.pop(); if (x % k != 0) q.push(x); }. Nie pisz i < q.size() — rozmiar zmienia się w trakcie pętli i przejdziesz tylko część kolejki.`,
            tests: (r) => {
                const d = (a, s) => `${a.length} ${s.length}\n${a.join(' ')}\n${s.join(' ')}`;
                const los = (n, m) => Array.from({ length: n }, () => r.int(1, m));
                const sita = (m) => Array.from({ length: m }, () => r.int(2, 100));
                return [d([7], [2]), d([6], [3]), d([4, 6, 8], [2, 2]), d(los(2000, 1e6), sita(50)), d(los(100, 60), [2, 3, 5, 7, 11]), d(los(2000, 1e6), sita(6)), d(Array.from({ length: 30 }, (_, i) => i + 2), [2, 3, 5, 7])];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0], m = t[1];
                return calk(n, 1, 2000) && calk(m, 1, 50) && t.length === n + m + 2 && t.slice(2, 2 + n).every((x) => calk(x, 1, 1e6)) && t.slice(2 + n).every((x) => calk(x, 2, 100)) ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0];
                let a = t.slice(2, 2 + n);
                const o = [];
                for (const k of t.slice(2 + n)) {
                    a = a.filter((x) => x % k !== 0);
                    o.push(a.length ? `sito ${k}: zostalo ${a.length}, pierwsza ${a[0]}` : `sito ${k}: zostalo 0`);
                }
                o.push(`kolejka: ${a.length ? a.join(' ') : 'pusta'}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
    }
    for (int j = 0; j < m; j++) {
        int k;
        cin >> k;
        int ile = q.size();
        for (int i = 0; i < ile; i++) {
            int x = q.front();
            q.pop();
            if (x % k != 0) q.push(x);
        }
        cout << "sito " << k << ": zostalo " << q.size();
        if (!q.empty()) cout << ", pierwsza " << q.front();
        cout << "\n";
    }
    cout << "kolejka:";
    if (q.empty()) cout << " pusta";
    while (!q.empty()) {
        cout << " " << q.front();
        q.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-wagony', krok: 1, level: 'latwe',
            title: 'Wagony pociągu',
            short: 'Na każdej stacji z przodu odłącza się a wagonów, a na końcu dołącza b nowych. Po stacji: ile wagonów, pierwszy i ostatni — albo pusty pociąg.',
            tags: ['push i pop na zmianę', 'front i back', 'empty'],
            statement: ['Pociąg towarowy to kolejka wagonów z numerami: na początku ma n wagonów. Na każdej z s stacji najpierw z przodu pociągu odłącza się a wagonów (albo wszystkie, jeśli jest ich mniej), a potem na końcu dołącza się b nowych wagonów o podanych numerach.',
                'Po każdej stacji wypisz, ile wagonów ma pociąg, oraz numer pierwszego i ostatniego wagonu. Jeśli pociąg nie ma żadnego wagonu, wypisz pociag pusty.'],
            input_format: ['W pierwszym wierszu liczba n, a po niej n numerów wagonów od pierwszego do ostatniego.', 'W drugim wierszu liczba s.', 'W każdym z s kolejnych wierszy liczby a i b, a po nich b numerów nowych wagonów (w kolejności doczepiania).'],
            output_format: ['s wierszy: stacja i: wagonow c, pierwszy x, ostatni y albo stacja i: pociag pusty.'],
            constraints: ['0 ≤ n ≤ 1000', '1 ≤ s ≤ 200', '0 ≤ a ≤ 2000, 0 ≤ b ≤ 50', 'Numery wagonów są od 1 do 9999.'],
            examples: [{ input: '3 11 12 13\n3\n1 2 20 21\n5 0\n0 1 30', note: 'Stacja 1: odpada 11, dochodzą 20 i 21 — wagony 12 13 20 21. Stacja 2: odpada 5 wagonów, ale są tylko 4 — pociąg jest pusty. Stacja 3: dochodzi wagon 30.' }],
            hint: R`Odłączanie: while (a > 0 && !q.empty()) { q.pop(); a--; }. Doczepianie: b razy cin >> x; q.push(x);. Potem if (q.empty()) … else cout << q.size() << ", pierwszy " << q.front() << ", ostatni " << q.back();.`,
            tests: (r) => {
                const gen = (n, s, maxA, maxB) => {
                    const w = Array.from({ length: n }, () => r.int(1, 9999));
                    const L = [`${n}${n ? ' ' + w.join(' ') : ''}`, String(s)];
                    for (let i = 0; i < s; i++) {
                        const b = r.int(0, maxB);
                        L.push(`${r.int(0, maxA)} ${b}${b ? ' ' + Array.from({ length: b }, () => r.int(1, 9999)).join(' ') : ''}`);
                    }
                    return L.join('\n');
                };
                return ['0\n1\n0 0', '0\n2\n3 1 5\n1 0', '1 7\n1\n0 1 8', gen(1000, 200, 30, 50), gen(10, 50, 3, 3), gen(0, 30, 2000, 50), gen(500, 200, 2000, 50)];
            },
            check: (inp) => {
                const L = linie(inp); const t0 = L[0].split(' ').map(Number);
                if (!calk(t0[0], 0, 1000) || t0.length !== t0[0] + 1 || t0.slice(1).some((x) => !calk(x, 1, 9999))) return 'pociąg';
                const s = Number(L[1]);
                if (!calk(s, 1, 200) || L.length !== s + 2) return 's';
                for (const l of L.slice(2)) { const t = l.split(' ').map(Number); if (!calk(t[0], 0, 2000) || !calk(t[1], 0, 50) || t.length !== t[1] + 2 || t.slice(2).some((x) => !calk(x, 1, 9999))) return 'stacja'; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp);
                const q = new Kolejka(L[0].split(' ').map(Number).slice(1));
                const o = [];
                L.slice(2).forEach((l, i) => {
                    const t = l.split(' ').map(Number);
                    let a = t[0];
                    while (a > 0 && !q.empty()) { q.pop(); a--; }
                    for (const x of t.slice(2)) q.push(x);
                    o.push(q.empty() ? `stacja ${i + 1}: pociag pusty` : `stacja ${i + 1}: wagonow ${q.size}, pierwszy ${q.front()}, ostatni ${q.back()}`);
                });
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
    }
    int s;
    cin >> s;
    for (int st = 1; st <= s; st++) {
        int a, b;
        cin >> a >> b;
        while (a > 0 && !q.empty()) {
            q.pop();
            a--;
        }
        for (int i = 0; i < b; i++) {
            int x;
            cin >> x;
            q.push(x);
        }
        cout << "stacja " << st << ": ";
        if (q.empty()) cout << "pociag pusty\n";
        else cout << "wagonow " << q.size() << ", pierwszy " << q.front() << ", ostatni " << q.back() << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 2 · polecenia, obroty i wyliczanki
        {
            id: 'kol-polecenia', krok: 2, level: 'latwe',
            title: 'Polecenia dla kolejki',
            short: 'Sześć poleceń: PUSH, POP, FRONT, BACK, SIZE i EMPTY. Gdy polecenie dotyczy pustej kolejki — zamiast wywracać program, wypisz blad.',
            tags: ['polecenia', 'empty przed front i pop', 'string jako polecenie'],
            statement: ['Napisz program, który obsługuje kolejkę liczb całkowitych (na początku pustą) i wykonuje q poleceń:',
                '• PUSH x — wstaw x na koniec kolejki (nic nie wypisuj),',
                '• POP — usuń pierwszą liczbę i wypisz ją,',
                '• FRONT — wypisz pierwszą liczbę, nie usuwając jej,',
                '• BACK — wypisz ostatnią liczbę, nie usuwając jej,',
                '• SIZE — wypisz, ile liczb jest w kolejce,',
                '• EMPTY — wypisz TAK, jeśli kolejka jest pusta, albo NIE.',
                'Jeśli POP, FRONT albo BACK dotyczą pustej kolejki, wypisz blad. W C++ nie wolno wywołać front() ani pop() na pustej kolejce — program mógłby się wywrócić albo po cichu zepsuć kolejkę — więc zawsze najpierw sprawdź empty().'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu dla każdego polecenia innego niż PUSH.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ x ≤ 10⁶'],
            examples: [{ input: '9\nPUSH 5\nPUSH 8\nFRONT\nBACK\nSIZE\nPOP\nPOP\nPOP\nEMPTY', note: 'Po dwóch PUSH kolejka to 5 8. Dwa POP wypisują 5 i 8, trzeci trafia na pustą kolejkę — blad. Na koniec kolejka jest pusta: TAK.' }],
            hint: R`string p; cin >> p; if (p == "PUSH") { cin >> x; q.push(x); } else if (p == "POP") { if (q.empty()) cout << "blad\n"; else { cout << q.front() << "\n"; q.pop(); } } … — pop() nic nie zwraca, więc wartość odczytaj przez front() przed pop().`,
            tests: (r) => {
                const gen = (q, pPush) => {
                    const o = [];
                    for (let i = 0; i < q; i++) {
                        const p = r();
                        if (p < pPush) o.push(`PUSH ${r.int(1, 1000000)}`);
                        else o.push(r.pick(['POP', 'POP', 'FRONT', 'BACK', 'SIZE', 'EMPTY']));
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nPOP', '3\nEMPTY\nSIZE\nFRONT', '4\nPUSH 1\nBACK\nPOP\nBACK', gen(30, 0.5), gen(3000, 0.5), gen(3000, 0.3), gen(3000, 0.7), gen(200, 0.45)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => /^(POP|FRONT|BACK|SIZE|EMPTY)$/.test(l) || (/^PUSH \d+$/.test(l) && calk(Number(l.slice(5)), 1, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const q = new Kolejka();
                const o = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, x] = l.split(' ');
                    if (p === 'PUSH') q.push(Number(x));
                    else if (p === 'POP') o.push(q.empty() ? 'blad' : q.pop());
                    else if (p === 'FRONT') o.push(q.empty() ? 'blad' : q.front());
                    else if (p === 'BACK') o.push(q.empty() ? 'blad' : q.back());
                    else if (p === 'SIZE') o.push(q.size);
                    else o.push(q.empty() ? 'TAK' : 'NIE');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int ile;
    cin >> ile;
    queue<int> q;
    for (int i = 0; i < ile; i++) {
        string p;
        cin >> p;
        if (p == "PUSH") {
            int x;
            cin >> x;
            q.push(x);
        } else if (p == "POP") {
            if (q.empty()) cout << "blad\n";
            else {
                cout << q.front() << "\n";
                q.pop();
            }
        } else if (p == "FRONT") {
            if (q.empty()) cout << "blad\n";
            else cout << q.front() << "\n";
        } else if (p == "BACK") {
            if (q.empty()) cout << "blad\n";
            else cout << q.back() << "\n";
        } else if (p == "SIZE") {
            cout << q.size() << "\n";
        } else {
            if (q.empty()) cout << "TAK\n";
            else cout << "NIE\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kol-poczta', krok: 2, level: 'latwe',
            title: 'Okienko na poczcie',
            short: 'Ludzie przychodzą, okienko obsługuje po kolei, a kierownik co jakiś czas pyta, ile osób czeka. Na koniec dnia — lista nieobsłużonych.',
            tags: ['zdarzenia w czasie', 'pusta kolejka', 'size'],
            statement: ['Na poczcie jest jedno okienko. W ciągu dnia zdarza się q zdarzeń, w kolejności z wejścia:',
                '• PRZYCHODZI imie — osoba staje na końcu kolejki,',
                '• OKIENKO — urzędniczka obsługuje pierwszą osobę z kolejki: wypisz imie zalatwia sprawe, a jeśli nikt nie czeka — nikt nie czeka,',
                '• ILE — wypisz, ile osób czeka w kolejce.',
                'Po wszystkich zdarzeniach poczta się zamyka. Wypisz nieobsluzeni: i imiona osób, które wciąż czekają (w kolejności z kolejki), albo nieobsluzeni: brak.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno zdarzenie.'],
            output_format: ['Po jednym wierszu dla każdego zdarzenia OKIENKO i ILE, a na końcu wiersz nieobsluzeni: ….'],
            constraints: ['1 ≤ q ≤ 2000', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą; mogą się powtarzać.'],
            examples: [{ input: '7\nPRZYCHODZI Zosia\nPRZYCHODZI Adam\nILE\nOKIENKO\nPRZYCHODZI Ewa\nOKIENKO\nILE', note: 'Zosia przyszła pierwsza, więc pierwsza załatwia sprawę. Na końcu czeka jeszcze Ewa.' }],
            hint: R`string z; cin >> z; if (z == "PRZYCHODZI") { cin >> imie; q.push(imie); } else if (z == "OKIENKO") { if (q.empty()) cout << "nikt nie czeka\n"; else { cout << q.front() << " zalatwia sprawe\n"; q.pop(); } } else cout << q.size() << "\n";. Po pętli wypisz resztę kolejki.`,
            tests: (r) => {
                const gen = (q, p) => {
                    const o = [];
                    for (let i = 0; i < q; i++) { const x = r(); o.push(x < p ? `PRZYCHODZI ${r.pick(IMIONA)}` : x < p + (1 - p) * 0.75 ? 'OKIENKO' : 'ILE'); }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nOKIENKO', '2\nPRZYCHODZI Ala\nILE', '3\nILE\nOKIENKO\nPRZYCHODZI Bo', gen(40, 0.5), gen(2000, 0.5), gen(2000, 0.65), gen(300, 0.35)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'OKIENKO' || l === 'ILE' || (/^PRZYCHODZI \S+$/.test(l) && czyImie(l.slice(11)))) ? null : 'zdarzenie';
            },
            solve: (inp) => {
                const q = new Kolejka();
                const o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'OKIENKO') o.push(q.empty() ? 'nikt nie czeka' : `${q.pop()} zalatwia sprawe`);
                    else if (l === 'ILE') o.push(q.size);
                    else q.push(l.slice(11));
                }
                o.push(`nieobsluzeni: ${q.empty() ? 'brak' : q.toArray().join(' ')}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int ile;
    cin >> ile;
    queue<string> q;
    for (int i = 0; i < ile; i++) {
        string z;
        cin >> z;
        if (z == "PRZYCHODZI") {
            string imie;
            cin >> imie;
            q.push(imie);
        } else if (z == "OKIENKO") {
            if (q.empty()) cout << "nikt nie czeka\n";
            else {
                cout << q.front() << " zalatwia sprawe\n";
                q.pop();
            }
        } else {
            cout << q.size() << "\n";
        }
    }
    cout << "nieobsluzeni:";
    if (q.empty()) cout << " brak";
    while (!q.empty()) {
        cout << " " << q.front();
        q.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-obrot', krok: 2, level: 'latwe',
            title: 'Obrót kolejki',
            short: 'Pierwsza liczba idzie na koniec — i tak k razy. Ale k może mieć 18 cyfr: pełny obrót niczego nie zmienia, więc wystarczy k % n kroków.',
            tags: ['push(front()) i pop', 'k % n', 'long long'],
            statement: ['W kolejce stoi n liczb. Jeden obrót to przeniesienie pierwszej liczby na koniec kolejki: q.push(q.front()); q.pop();.',
                'Wykonaj k obrotów i wypisz kolejkę od pierwszej do ostatniej liczby. Uwaga: k może być ogromne (do 10¹⁸) — pętla wykonująca k obrotów nie skończyłaby się przez wiele lat. Zauważ, że po n obrotach kolejka wygląda dokładnie tak jak na początku.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — kolejka od pierwszej do ostatniej.'],
            output_format: ['Jeden wiersz: kolejka po k obrotach, liczby oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ k ≤ 10¹⁸', '1 ≤ liczby ≤ 10⁶'],
            examples: [{ input: '5 7\n10 20 30 40 50', note: 'Po 5 obrotach kolejka wraca do początku, więc 7 obrotów to tyle samo co 2: 30 40 50 10 20.' }],
            hint: R`long long k; — 10¹⁸ nie mieści się w int. Wykonaj tylko k % n obrotów: for (long long i = 0; i < k % n; i++) { q.push(q.front()); q.pop(); }.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                const los = (n) => Array.from({ length: n }, () => r.int(1, 1000000));
                return [d([7], '1000000000000000000'), d([1, 2], '0'), d([1, 2, 3], '3'), d(los(10), '999999999999999999'), d(los(2000), String(r.big(0, 10n ** 18n))), d(los(2000), '1999'), d(los(37), String(r.int(0, 100)))];
            },
            check: (inp) => {
                const t = toks(inp); const n = Number(t[0]);
                return calk(n, 1, 2000) && /^\d+$/.test(t[1]) && BigInt(t[1]) <= 10n ** 18n && t.length === n + 2 && t.slice(2).every((x) => calk(Number(x), 1, 1e6)) ? null : 'dane';
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]);
                const a = t.slice(2);
                const k = Number(BigInt(t[1]) % BigInt(n));
                return a.slice(k).concat(a.slice(0, k)).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
    }
    long long obroty = k % n;
    for (long long i = 0; i < obroty; i++) {
        q.push(q.front());
        q.pop();
    }
    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-wyrzucanie-kart', krok: 2, level: 'latwe',
            title: 'Wyrzucanie kart',
            short: 'Karta z wierzchu do kosza, następna pod spód talii — i tak, aż zostanie jedna. Talia to kolejka: wierzch to front, spód to back.',
            tags: ['talia jako kolejka', 'pop i push(front())', 'while (q.size() > 1)'],
            statement: ['Talia ma n kart z numerami od 1 (na wierzchu) do n (na spodzie). Dopóki w talii są co najmniej dwie karty, powtarzamy: wyrzuć kartę z wierzchu, a potem kartę, która jest teraz na wierzchu, przełóż na spód talii.',
                'Wypisz numery wyrzuconych kart w kolejności wyrzucania, a potem kartę, która została. Talia to kolejka: wierzch to front(), a spód — miejsce, gdzie trafia push().'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Dwa wiersze: wyrzucone: i numery kart oddzielone spacjami (gdy n = 1 — samo wyrzucone:) oraz zostala: k.'],
            constraints: ['1 ≤ n ≤ 4000'],
            examples: [{ input: '7', note: 'Talia 1 2 3 4 5 6 7: wyrzucamy 1, a 2 idzie pod spód (3 4 5 6 7 2). Potem wyrzucamy 3, a 4 idzie pod spód — i tak dalej. Zostaje 6.' }],
            hint: R`Wstaw karty 1…n do queue<int>. while (q.size() > 1) { cout << q.front() << " "; q.pop(); q.push(q.front()); q.pop(); }. Ostatnia karta to q.front().`,
            tests: (r) => ['1', '2', '3', '4', '10', '4000', '2048', String(r.int(100, 3999)), '1000'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 4000) ? null : 'dane'; },
            solve: (inp) => {
                const n = nums(inp)[0];
                const q = new Kolejka(Array.from({ length: n }, (_, i) => i + 1));
                const w = [];
                while (q.size > 1) { w.push(q.pop()); q.push(q.pop()); }
                return `wyrzucone:${w.length ? ' ' + w.join(' ') : ''}\nzostala: ${q.front()}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<int> q;
    for (int i = 1; i <= n; i++) q.push(i);
    cout << "wyrzucone:";
    while (q.size() > 1) {
        cout << " " << q.front();
        q.pop();
        q.push(q.front());
        q.pop();
    }
    cout << "\n";
    cout << "zostala: " << q.front() << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-goracy-ziemniak', krok: 2, level: 'srednie',
            title: 'Gorący ziemniak',
            short: 'Dzieci w kółku podają sobie ziemniak. Gdy muzyka cichnie, dziecko z ziemniakiem odpada. Kółko to kolejka, a podanie dalej to obrót.',
            tags: ['kółko jako kolejka', 'obrót', 'k % size'],
            statement: ['W kółku stoi n dzieci, w kolejności z wejścia. Ziemniak jest na początku u pierwszego dziecka. Gra ma n − 1 rund. W rundzie i muzyka gra tak długo, że ziemniak zostaje podany dalej kᵢ razy (każde podanie — do następnego dziecka w kółku), a gdy muzyka cichnie, dziecko, które trzyma ziemniak, odpada. Ziemniak dostaje wtedy następne dziecko w kółku.',
                'Wypisz dzieci w kolejności odpadania i zwycięzcę. Kółko trzymaj w kolejce: dziecko z ziemniakiem to front(), a podanie dalej to przeniesienie pierwszego dziecka na koniec. Liczby kᵢ są duże — pełne okrążenie kółka niczego nie zmienia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych imion — dzieci w kolejności w kółku.', 'W trzecim wierszu n − 1 liczb k₁, k₂, …, kₙ₋₁.'],
            output_format: ['n − 1 wierszy odpada: imie, a potem wiersz wygrywa: imie.'],
            constraints: ['2 ≤ n ≤ 1000', '0 ≤ kᵢ ≤ 10⁹', 'Imiona są różne i mają od 1 do 15 znaków.'],
            examples: [{ input: '5\nAla Bartek Cyryl Daria Ewa\n2 3 1 4', note: 'Runda 1: dwa podania (Ala → Bartek → Cyryl), odpada Cyryl, ziemniak ma Daria. Runda 2: trzy podania od Darii: Ewa, Ala, Bartek — odpada Bartek. Runda 3: od Darii jedno podanie — odpada Ewa. Runda 4: zostali Ala i Daria; 4 podania to dwa pełne okrążenia, więc odpada Ala, która trzymała ziemniak.' }],
            hint: R`Podanie dalej: q.push(q.front()); q.pop();. W rundzie wykonaj k % q.size() podań, a potem cout << "odpada: " << q.front() << "\n"; q.pop();. Po n − 1 rundach zwycięzca to q.front().`,
            tests: (r) => {
                const d = (a, k) => `${a.length}\n${a.join(' ')}\n${k.join(' ')}`;
                const gen = (n, mk) => d(unikalneImiona(r, n), Array.from({ length: n - 1 }, () => r.int(0, mk)));
                return [d(['Ala', 'Ola'], [0]), d(['Ala', 'Ola'], [1000000000]), d(['A', 'B', 'C'], [5, 5]), gen(10, 20), gen(1000, 1e9), gen(1000, 3), gen(300, 1e9)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                if (!calk(n, 2, 1000) || L.length !== 3) return 'wiersze';
                const a = L[1].split(' '), k = L[2].split(' ').map(Number);
                return a.length === n && new Set(a).size === n && a.every((s) => czyNazwa(s)) && k.length === n - 1 && k.every((x) => calk(x, 0, 1e9)) ? null : 'dane';
            },
            solve: (inp) => {
                const L = linie(inp);
                let a = L[1].split(' ');
                const k = L[2].split(' ').map(Number);
                const o = [];
                let p = 0;
                for (const x of k) {
                    p = (p + x) % a.length;
                    o.push(`odpada: ${a[p]}`);
                    a = a.slice(0, p).concat(a.slice(p + 1));
                    if (p === a.length) p = 0;
                }
                o.push(`wygrywa: ${a[0]}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<string> q;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        q.push(s);
    }
    for (int runda = 1; runda < n; runda++) {
        long long k;
        cin >> k;
        long long podania = k % q.size();
        for (long long i = 0; i < podania; i++) {
            q.push(q.front());
            q.pop();
        }
        cout << "odpada: " << q.front() << "\n";
        q.pop();
    }
    cout << "wygrywa: " << q.front() << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-ostatnia-karta', krok: 2, level: 'srednie',
            title: 'Ostatnia karta',
            short: 'Ta sama talia co w wyrzucaniu kart, ale aż milion kart i kilka talii w jednym teście. vector z erase(begin()) tu nie zdąży — kolejka tak.',
            tags: ['kilka testów', 'nowa kolejka na test', 'szybkość pop'],
            statement: ['Talia ma n kart z numerami od 1 (na wierzchu) do n (na spodzie). Dopóki w talii są co najmniej dwie karty: wyrzuć kartę z wierzchu, a kartę, która jest teraz na wierzchu, przełóż na spód talii. Która karta zostanie?',
                'W jednym wejściu jest t talii. Dla każdej wypisz numer karty, która zostanie. Talie są ogromne: vector z v.erase(v.begin()) przesuwa przy każdym usunięciu wszystkie pozostałe karty i dla miliona kart pracowałby wiele minut. Kolejka usuwa pierwszy element w jednym kroku. Pamiętaj, że każda talia zaczyna się od pustej kolejki.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy liczba n — rozmiar talii.'],
            output_format: ['t wierszy — karta, która zostanie w każdej talii.'],
            constraints: ['1 ≤ t ≤ 5', '1 ≤ n ≤ 10⁶'],
            examples: [{ input: '3\n7\n1\n8', note: 'Z siedmiu kart zostaje 6 (jak w zadaniu „Wyrzucanie kart”). Talia z jedną kartą od razu jest gotowa. Z ośmiu kart zostaje ostatnia, 8.' }],
            hint: R`for (int test = 0; test < t; test++) { int n; cin >> n; queue<int> q; for (int i = 1; i <= n; i++) q.push(i); while (q.size() > 1) { q.pop(); q.push(q.front()); q.pop(); } cout << q.front() << "\n"; }. Kolejka zadeklarowana w środku pętli jest dla każdej talii nowa i pusta.`,
            tests: (r) => ['1\n1', '2\n2\n3', '5\n1000000\n999999\n524288\n524289\n1', '5\n' + Array.from({ length: 5 }, () => r.int(1, 1000000)).join('\n'), '3\n10\n100\n1000', '4\n1000000\n1000000\n1000000\n1000000'],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp);
                return t.slice(1).map((n) => {
                    const q = new Int32Array(2 * n + 2);
                    let h = 0, e = 0;
                    for (let i = 1; i <= n; i++) q[e++] = i;
                    while (e - h > 1) { h++; q[e++] = q[h++]; }
                    return q[h];
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int test = 0; test < t; test++) {
        int n;
        cin >> n;
        queue<int> q;
        for (int i = 1; i <= n; i++) q.push(i);
        while (q.size() > 1) {
            q.pop();
            q.push(q.front());
            q.pop();
        }
        cout << q.front() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-dni-w-urzedzie', krok: 2, level: 'srednie',
            title: 'Kilka dni w urzędzie',
            short: 'Każdego dnia nowa kolejka: kto nie zdążył, idzie do domu. Kolejka z poprzedniego dnia nie może przejść na następny — wyczyść ją albo utwórz nową.',
            tags: ['kilka testów', 'czyszczenie kolejki', 'zdarzenia'],
            statement: ['Urząd pracuje przez t dni. Każdego dnia zdarza się q zdarzeń: P imie — osoba staje na końcu kolejki, O — urzędnik obsługuje pierwszą osobę. Na koniec dnia wszyscy, którzy wciąż czekają, idą do domu, a następnego dnia kolejka zaczyna się od nowa, pusta.',
                'Dla każdego dnia wypisz wiersz Dzien d:, potem dla każdego zdarzenia O imię obsłużonej osoby (albo nikt, jeśli kolejka była pusta), a na końcu dnia do domu: i imiona czekających w kolejności z kolejki (albo do domu: nikt).'],
            input_format: ['W pierwszym wierszu liczba t.', 'Dla każdego dnia: wiersz z liczbą q, a potem q wierszy ze zdarzeniami.'],
            output_format: ['Dla każdego dnia: Dzien d:, wiersze z obsłużonymi i wiersz do domu: ….'],
            constraints: ['1 ≤ t ≤ 20', '1 ≤ q ≤ 200', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą.'],
            examples: [{ input: '2\n4\nP Ala\nP Ola\nO\nP Ewa\n2\nO\nP Jan', note: 'Pierwszego dnia obsłużono Alę, do domu poszły Ola i Ewa. Drugiego dnia kolejka jest pusta od rana, więc pierwsze O nikogo nie obsługuje.' }],
            hint: R`Najprościej zadeklarować queue<string> q; wewnątrz pętli po dniach — wtedy każdego dnia jest nowa i pusta. Kolejka nie ma clear(); zadeklarowaną wyżej wyczyścisz przez q = queue<string>(); albo while (!q.empty()) q.pop();.`,
            tests: (r) => {
                const dzien = (q, p) => { const o = []; for (let i = 0; i < q; i++) o.push(r() < p ? `P ${r.pick(IMIONA)}` : 'O'); return `${q}\n${o.join('\n')}`; };
                const gen = (t, q, p) => `${t}\n${Array.from({ length: t }, () => dzien(r.int(1, q), p)).join('\n')}`;
                return ['1\n1\nO', '2\n1\nP Ala\n1\nO', '3\n2\nP A\nP B\n1\nO\n2\nO\nO', gen(5, 10, 0.6), gen(20, 200, 0.7), gen(20, 200, 0.5), gen(10, 30, 0.8)];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 20)) return 't';
                let i = 1;
                for (let d = 0; d < t; d++) {
                    const q = Number(L[i++]);
                    if (!calk(q, 1, 200)) return 'q';
                    for (let j = 0; j < q; j++) { const l = L[i++]; if (!(l === 'O' || (/^P \S+$/.test(l) && czyImie(l.slice(2))))) return 'zdarzenie'; }
                }
                return i === L.length ? null : 'nadmiar';
            },
            solve: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                const o = [];
                let i = 1;
                for (let d = 1; d <= t; d++) {
                    const q = new Kolejka();
                    o.push(`Dzien ${d}:`);
                    const ile = Number(L[i++]);
                    for (let j = 0; j < ile; j++) { const l = L[i++]; if (l === 'O') o.push(q.empty() ? 'nikt' : q.pop()); else q.push(l.slice(2)); }
                    o.push(`do domu: ${q.empty() ? 'nikt' : q.toArray().join(' ')}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int d = 1; d <= t; d++) {
        queue<string> q;
        int ile;
        cin >> ile;
        cout << "Dzien " << d << ":\n";
        for (int i = 0; i < ile; i++) {
            string z;
            cin >> z;
            if (z == "P") {
                string imie;
                cin >> imie;
                q.push(imie);
            } else {
                if (q.empty()) cout << "nikt\n";
                else {
                    cout << q.front() << "\n";
                    q.pop();
                }
            }
        }
        cout << "do domu:";
        if (q.empty()) cout << " nikt";
        while (!q.empty()) {
            cout << " " << q.front();
            q.pop();
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-zamkniecie-kasy', krok: 2, level: 'srednie',
            title: 'Zamknięcie kasy',
            short: 'Dwie kasy, dwie kolejki. Gdy kasa 2 się zamyka, jej klienci przechodzą — w tej samej kolejności — na koniec kolejki do kasy 1.',
            tags: ['dwie kolejki', 'przelewanie kolejki', 'stan: otwarta / zamknięta'],
            statement: ['W sklepie działają dwie kasy, każda ze swoją kolejką. Zdarzenia (w kolejności z wejścia):',
                '• DO k imie — klient staje w kolejce do kasy k (k = 1 albo 2); jeśli kasa 2 jest już zamknięta, klient chcący do niej staje w kolejce do kasy 1,',
                '• OBSLUZ k — kasa k obsługuje pierwszego klienta: wypisz kasa k: imie albo kasa k: pusto; jeśli kasa 2 jest zamknięta, na OBSLUZ 2 wypisz kasa 2: zamknieta,',
                '• ZAMKNIJ — kasa 2 zamyka się na stałe, a wszyscy jej klienci przechodzą, w tej samej kolejności, na koniec kolejki do kasy 1 (zdarzenie pojawia się najwyżej raz).',
                'Na koniec wypisz zawartość obu kolejek.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno zdarzenie.'],
            output_format: ['Po jednym wierszu dla każdego OBSLUZ, a na końcu dwa wiersze: kasa 1: … oraz kasa 2: … (imiona w kolejności z kolejki, pusto albo — dla zamkniętej kasy 2 — zamknieta).'],
            constraints: ['1 ≤ q ≤ 2000', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą.'],
            examples: [{ input: '8\nDO 1 Ala\nDO 2 Bartek\nDO 2 Celina\nOBSLUZ 2\nDO 1 Dawid\nZAMKNIJ\nDO 2 Ewa\nOBSLUZ 2', note: 'Kasa 2 obsłużyła Bartka. Przy zamknięciu Celina przechodzi za Dawida, a Ewa, która chciała do kasy 2, staje za Celiną.' }],
            hint: R`Dwie kolejki queue<string> k1, k2; i zmienna bool zamknieta = false;. Przelewanie: while (!k2.empty()) { k1.push(k2.front()); k2.pop(); }. Przy DO 2 sprawdź, czy kasa nie jest zamknięta.`,
            tests: (r) => {
                const gen = (q, pDo, kiedyZamknij) => {
                    const o = [];
                    for (let i = 0; i < q; i++) {
                        if (i === kiedyZamknij) { o.push('ZAMKNIJ'); continue; }
                        o.push(r() < pDo ? `DO ${r.int(1, 2)} ${r.pick(IMIONA)}` : `OBSLUZ ${r.int(1, 2)}`);
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nOBSLUZ 2', '2\nZAMKNIJ\nOBSLUZ 2', '3\nDO 2 Ala\nZAMKNIJ\nOBSLUZ 1', gen(30, 0.6, 15), gen(2000, 0.6, 1200), gen(2000, 0.5, -1), gen(500, 0.7, 499), gen(100, 0.55, 3)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                if (L.filter((l) => l === 'ZAMKNIJ').length > 1) return 'dwa zamknięcia';
                return L.slice(1).every((l) => l === 'ZAMKNIJ' || /^OBSLUZ [12]$/.test(l) || (/^DO [12] \S+$/.test(l) && czyImie(l.slice(5)))) ? null : 'zdarzenie';
            },
            solve: (inp) => {
                const k = [null, new Kolejka(), new Kolejka()];
                let zam = false;
                const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'DO') k[zam ? 1 : Number(t[1])].push(t[2]);
                    else if (t[0] === 'OBSLUZ') {
                        const nr = Number(t[1]);
                        if (nr === 2 && zam) o.push('kasa 2: zamknieta');
                        else o.push(`kasa ${nr}: ${k[nr].empty() ? 'pusto' : k[nr].pop()}`);
                    } else { zam = true; while (!k[2].empty()) k[1].push(k[2].pop()); }
                }
                o.push(`kasa 1: ${k[1].empty() ? 'pusto' : k[1].toArray().join(' ')}`);
                o.push(`kasa 2: ${zam ? 'zamknieta' : k[2].empty() ? 'pusto' : k[2].toArray().join(' ')}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(int nr, queue<string> &q) {
    cout << "kasa " << nr << ":";
    if (q.empty()) cout << " pusto";
    while (!q.empty()) {
        cout << " " << q.front();
        q.pop();
    }
    cout << "\n";
}
int main() {
    int ile;
    cin >> ile;
    queue<string> k1, k2;
    bool zamknieta = false;
    for (int i = 0; i < ile; i++) {
        string z;
        cin >> z;
        if (z == "DO") {
            int k;
            string imie;
            cin >> k >> imie;
            if (k == 1 || zamknieta) k1.push(imie);
            else k2.push(imie);
        } else if (z == "OBSLUZ") {
            int k;
            cin >> k;
            if (k == 2 && zamknieta) {
                cout << "kasa 2: zamknieta\n";
                continue;
            }
            queue<string> &q = (k == 1 ? k1 : k2);
            cout << "kasa " << k << ": ";
            if (q.empty()) cout << "pusto\n";
            else {
                cout << q.front() << "\n";
                q.pop();
            }
        } else {
            zamknieta = true;
            while (!k2.empty()) {
                k1.push(k2.front());
                k2.pop();
            }
        }
    }
    wypisz(1, k1);
    if (zamknieta) cout << "kasa 2: zamknieta\n";
    else wypisz(2, k2);
    return 0;
}`,
        },
        // ================================================================ KROK 3 · kolejka par i struktur
        {
            id: 'kol-weterynarz', krok: 3, level: 'latwe',
            title: 'Poczekalnia u weterynarza',
            short: 'W kolejce czekają całe rekordy: struct Zwierze z imieniem, gatunkiem i wiekiem. front().imie, back().imie i obsługa po kolei.',
            tags: ['queue<struct>', 'q.front().pole', 'push({…})'],
            statement: ['Do weterynarza przyszło n zwierząt. Każde ma imię, gatunek i wiek. Zadeklaruj strukturę struct Zwierze { string imie; string gatunek; int wiek; }; i wstaw wszystkie zwierzęta do kolejki queue<Zwierze>.',
                'Najpierw wypisz imię zwierzęcia, które czeka pierwsze, i tego, które czeka ostatnie (q.front().imie, q.back().imie). Potem weterynarz przyjmuje zwierzęta po kolei: dla każdego wypisz numer, imię, gatunek i wiek. Na koniec wypisz najstarsze zwierzę — jeśli kilka ma ten sam, największy wiek, to to, które było przyjęte najwcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z n kolejnych wierszy imię, gatunek i wiek zwierzęcia.'],
            output_format: ['Wiersze pierwszy: imie i ostatni: imie, potem n wierszy nr. imie (gatunek, wiek W), a na końcu najstarszy: imie (wiek W).'],
            constraints: ['1 ≤ n ≤ 300', 'Imię zaczyna się wielką literą i ma do 15 liter, gatunek to małe litery (do 15).', '1 ≤ wiek ≤ 30'],
            examples: [{ input: '3\nBurek pies 5\nMruczek kot 12\nKropka krowa 12', note: 'Mruczek i Kropka mają po 12 lat; najstarszy jest Mruczek, bo został przyjęty wcześniej.' }],
            hint: R`q.push({imie, gatunek, wiek}); — klamry tworzą strukturę. W pętli: Zwierze z = q.front(); q.pop(); i wypisujesz z.imie, z.gatunek, z.wiek. Najstarszego pamiętaj w zmiennej typu Zwierze i podmieniaj tylko przy z.wiek > naj.wiek.`,
            tests: (r) => {
                const GAT = ['pies', 'kot', 'krowa', 'kura', 'chomik', 'papuga', 'koza', 'swinka', 'kon', 'krolik', 'zolw', 'jez'];
                const gen = (n, mw) => `${n}\n${Array.from({ length: n }, () => `${r.pick(IMIONA)} ${r.pick(GAT)} ${r.int(1, mw)}`).join('\n')}`;
                return ['1\nAs pies 1', '2\nBurek pies 30\nAzor pies 30', gen(5, 3), gen(300, 30), gen(40, 30), gen(12, 2)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                if (!calk(n, 1, 300) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && czyImie(t[0]) && czyMale(t[1]) && calk(Number(t[2]), 1, 30); }) ? null : 'dane';
            },
            solve: (inp) => {
                const z = linie(inp).slice(1).map((l) => l.split(' '));
                const o = [`pierwszy: ${z[0][0]}`, `ostatni: ${z[z.length - 1][0]}`];
                let naj = z[0];
                z.forEach((x, i) => { o.push(`${i + 1}. ${x[0]} (${x[1]}, wiek ${x[2]})`); if (Number(x[2]) > Number(naj[2])) naj = x; });
                o.push(`najstarszy: ${naj[0]} (wiek ${naj[2]})`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zwierze {
    string imie;
    string gatunek;
    int wiek;
};
int main() {
    int n;
    cin >> n;
    queue<Zwierze> q;
    for (int i = 0; i < n; i++) {
        string imie, gatunek;
        int wiek;
        cin >> imie >> gatunek >> wiek;
        q.push({imie, gatunek, wiek});
    }
    cout << "pierwszy: " << q.front().imie << "\n";
    cout << "ostatni: " << q.back().imie << "\n";
    Zwierze naj = q.front();
    int nr = 1;
    while (!q.empty()) {
        Zwierze z = q.front();
        q.pop();
        cout << nr << ". " << z.imie << " (" << z.gatunek << ", wiek " << z.wiek << ")\n";
        if (z.wiek > naj.wiek) naj = z;
        nr++;
    }
    cout << "najstarszy: " << naj.imie << " (wiek " << naj.wiek << ")\n";
    return 0;
}`,
        },
        {
            id: 'kol-karuzela', krok: 3, level: 'latwe',
            title: 'Karuzela',
            short: 'Każde dziecko chce się przejechać kilka razy. Po przejeździe wraca na koniec kolejki — z licznikiem mniejszym o jeden. Kolejka par {imię, ile}.',
            tags: ['queue<pair>', 'auto [a, b] = q.front()', 'powrót na koniec'],
            statement: ['Do karuzeli ustawiło się n dzieci; dziecko o imieniu imie chce się przejechać r razy. Karuzela zabiera jedno dziecko na jeden przejazd: pierwsze dziecko z kolejki jedzie, a potem — jeśli chce jechać jeszcze raz — wraca na koniec kolejki.',
                'Trzymaj w kolejce pary {imię, ile przejazdów jeszcze} i wypisz imiona dzieci w kolejności przejazdów (w jednym wierszu), a w drugim wierszu łączną liczbę przejazdów.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z n kolejnych wierszy imię dziecka i liczba r.'],
            output_format: ['Dwa wiersze: imiona w kolejności przejazdów (oddzielone spacjami) oraz przejazdow: S.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ r ≤ 30', 'Łączna liczba przejazdów nie przekracza 3000.', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą.'],
            examples: [{ input: '3\nAla 2\nOla 1\nKuba 3', note: 'Ala, Ola, Kuba — potem Ola już nie wraca, więc dalej jadą Ala i Kuba, a na końcu sam Kuba.' }],
            hint: R`queue<pair<string, int>> q; q.push({imie, r});. W pętli: auto [imie, ile] = q.front(); q.pop(); cout << imie << " "; if (ile > 1) q.push({imie, ile - 1});. auto [a, b] bez & robi kopię, więc po pop() wolno jej dalej używać.`,
            tests: (r) => {
                const gen = (n, mr) => `${n}\n${Array.from({ length: n }, () => `${r.pick(IMIONA)} ${r.int(1, mr)}`).join('\n')}`;
                return ['1\nEla 1', '1\nEla 30', '2\nAla 3\nOla 3', gen(8, 4), gen(100, 30), gen(100, 1), gen(50, 10)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                if (!calk(n, 1, 100) || L.length !== n + 1) return 'n';
                let s = 0;
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 2 || !czyImie(t[0]) || !calk(Number(t[1]), 1, 30)) return 'dane'; s += Number(t[1]); }
                return s <= 3000 ? null : 'suma';
            },
            solve: (inp) => {
                const q = new Kolejka(linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; }));
                const o = [];
                while (!q.empty()) { const [a, b] = q.pop(); o.push(a); if (b > 1) q.push([a, b - 1]); }
                return `${o.join(' ')}\nprzejazdow: ${o.length}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<pair<string, int>> q;
    for (int i = 0; i < n; i++) {
        string imie;
        int r;
        cin >> imie >> r;
        q.push({imie, r});
    }
    int przejazdy = 0;
    while (!q.empty()) {
        auto [imie, ile] = q.front();
        q.pop();
        cout << imie << " ";
        przejazdy++;
        if (ile > 1) q.push({imie, ile - 1});
    }
    cout << "\n";
    cout << "przejazdow: " << przejazdy << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-bilety-na-mecz', krok: 3, level: 'latwe',
            title: 'Bilety na mecz',
            short: 'Kasa sprzedaje jeden bilet na minutę, a kto chce więcej, wraca na koniec. W kolejce stoją pary {numer kibica, ile jeszcze} — o której każdy skończy?',
            tags: ['queue<pair<int, int>>', 'numer w parze', 'czas symulacji'],
            statement: ['Przed kasą stoi n kibiców, ponumerowanych od 1 w kolejności w kolejce. Kibic i chce kupić tᵢ biletów, ale kasa sprzedaje jednemu kibicowi tylko jeden bilet naraz. Każda sprzedaż trwa minutę: pierwszy kibic kupuje bilet i — jeśli potrzebuje kolejnych — staje na końcu kolejki.',
                'Dla każdego kibica, w kolejności numerów, wypisz minutę, w której kupił swój ostatni bilet (pierwsza sprzedaż kończy się w minucie 1). W kolejce trzymaj pary {numer kibica, ile biletów jeszcze potrzebuje}, a wyniki zapisuj do vectora pod numerem kibica.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb t₁, t₂, …, tₙ.'],
            output_format: ['Jeden wiersz: n liczb — minuty zakończenia zakupów kibiców 1, 2, …, n.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ tᵢ ≤ 100'],
            examples: [{ input: '3\n2 3 2', note: 'Minuty: 1 — kibic 1, 2 — kibic 2, 3 — kibic 3, 4 — kibic 1 (kończy), 5 — kibic 2, 6 — kibic 3 (kończy), 7 — kibic 2 (kończy).' }],
            hint: R`queue<pair<int, int>> q; q.push({i, t});. int minuta = 0; while (!q.empty()) { auto [kto, ile] = q.front(); q.pop(); minuta++; if (ile == 1) koniec[kto] = minuta; else q.push({kto, ile - 1}); }.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d([100]), d([2, 3, 2]), d(Array.from({ length: 10 }, () => r.int(1, 5))), d(Array.from({ length: 1000 }, () => r.int(1, 100))), d(Array.from({ length: 1000 }, () => 1)), d(Array.from({ length: 300 }, () => r.int(1, 100)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 100)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp).slice(1);
                const q = new Kolejka(t.map((x, i) => [i, x]));
                const k = new Array(t.length);
                let m = 0;
                while (!q.empty()) { const [a, b] = q.pop(); m++; if (b === 1) k[a] = m; else q.push([a, b - 1]); }
                return k.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<pair<int, int>> q;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        q.push({i, t});
    }
    vector<int> koniec(n);
    int minuta = 0;
    while (!q.empty()) {
        auto [kto, ile] = q.front();
        q.pop();
        minuta++;
        if (ile == 1) koniec[kto] = minuta;
        else q.push({kto, ile - 1});
    }
    for (int i = 0; i < n; i++) cout << koniec[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-procesor', krok: 3, level: 'srednie',
            title: 'Procesor z kwantem czasu',
            short: 'Procesor daje każdemu programowi najwyżej Q milisekund, a niedokończony program wraca na koniec kolejki. Który skończy kiedy?',
            tags: ['round robin', 'min(Q, reszta)', 'zegar symulacji'],
            statement: ['System operacyjny ma n programów do wykonania; program o nazwie s potrzebuje t milisekund pracy procesora. Programy czekają w kolejce w kolejności z wejścia. Procesor bierze pierwszy program z kolejki i pracuje nad nim przez Q milisekund (tak zwany kwant czasu) — albo krócej, jeśli programowi zostało mniej. Jeśli program jeszcze się nie skończył, wraca na koniec kolejki.',
                'Zegar startuje od 0, a przełączanie programów nie zajmuje czasu. Wypisz programy w kolejności kończenia, z chwilą zakończenia każdego z nich.'],
            input_format: ['W pierwszym wierszu liczby n i Q.', 'W każdym z n kolejnych wierszy nazwa programu i liczba t.'],
            output_format: ['n wierszy: nazwa programu i chwila jego zakończenia.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ Q ≤ 10⁴', '1 ≤ t ≤ 10⁴', 'Nazwy są różne i składają się z małych liter (do 15).'],
            examples: [{ input: '3 100\ngra 250\nedytor 80\nmuzyka 150', note: 'Gra pracuje 0–100 i wraca, edytor kończy w 180, muzyka pracuje 180–280 i wraca, gra 280–380, muzyka kończy w 430, gra w 480.' }],
            hint: R`queue<pair<string, int>> q; long long czas = 0; while (!q.empty()) { auto [s, t] = q.front(); q.pop(); int ile = min(Q, t); czas += ile; t -= ile; if (t == 0) cout << s << " " << czas << "\n"; else q.push({s, t}); }.`,
            tests: (r) => {
                const gen = (n, Q, mt) => { const s = unikalneSlowa(r, n, 1, 4); return `${n} ${Q}\n${s.map((x) => `${x} ${r.int(1, mt)}`).join('\n')}`; };
                return ['1 1\nsolo 1', '1 10000\nsolo 10000', '2 1\na 3\nb 2', gen(5, 3, 10), gen(100, 1, 10000), gen(100, 10000, 10000), gen(50, 137, 5000), gen(100, 50, 60)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, Q] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 100) || !calk(Q, 1, 1e4) || L.length !== n + 1) return 'n';
                const s = L.slice(1).map((l) => l.split(' '));
                return new Set(s.map((x) => x[0])).size === n && s.every((x) => x.length === 2 && czyMale(x[0]) && calk(Number(x[1]), 1, 1e4)) ? null : 'dane';
            },
            solve: (inp) => {
                const L = linie(inp); const Q = Number(L[0].split(' ')[1]);
                const q = new Kolejka(L.slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; }));
                let czas = 0;
                const o = [];
                while (!q.empty()) { const [s, t] = q.pop(); const ile = Math.min(Q, t); czas += ile; if (t === ile) o.push(`${s} ${czas}`); else q.push([s, t - ile]); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, Q;
    cin >> n >> Q;
    queue<pair<string, int>> q;
    for (int i = 0; i < n; i++) {
        string s;
        int t;
        cin >> s >> t;
        q.push({s, t});
    }
    long long czas = 0;
    while (!q.empty()) {
        auto [s, t] = q.front();
        q.pop();
        int ile = min(Q, t);
        czas += ile;
        t -= ile;
        if (t == 0) cout << s << " " << czas << "\n";
        else q.push({s, t});
    }
    return 0;
}`,
        },
        {
            id: 'kol-przystanek', krok: 3, level: 'srednie',
            title: 'Przystanek autobusowy',
            short: 'Pasażerowie przychodzą, autobusy przyjeżdżają z wolnymi miejscami. W kolejce struktury {imię, chwila przyjścia} — kto wsiada i kto czekał najdłużej?',
            tags: ['queue<struct>', 'zdarzenia w czasie', 'pojemność'],
            statement: ['Na przystanek przychodzą pasażerowie i przyjeżdżają autobusy. Zdarzenia są podane w kolejności, w jakiej zachodzą:',
                '• P t imie — w chwili t na przystanek przychodzi pasażer i staje na końcu kolejki,',
                '• A t c — w chwili t przyjeżdża autobus, który ma c wolnych miejsc; wsiada do niego tylu pierwszych pasażerów z kolejki, ile się zmieści.',
                'Dla każdego autobusu wypisz, ilu pasażerów wsiadło, ich imiona i ile minut czekał ten z nich, który czekał najdłużej (to zawsze ten, który wsiadł pierwszy). Na końcu wypisz, ilu pasażerów zostało na przystanku. Trzymaj w kolejce strukturę struct Pasazer { string imie; int t; }.'],
            input_format: ['W pierwszym wierszu liczba zdarzeń q.', 'W każdym z q kolejnych wierszy jedno zdarzenie.'],
            output_format: ['Dla każdego autobusu wiersz o t: wsiadlo k (imiona), najdluzej czekal X min — a gdy nikt nie wsiadł: o t: wsiadlo 0.', 'Na końcu wiersz zostalo: k.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ t ≤ 10⁶, chwile nie maleją', '0 ≤ c ≤ 100', 'Imiona mają od 1 do 15 liter i zaczynają się wielką literą.'],
            examples: [{ input: '6\nP 3 Ala\nP 5 Ola\nP 5 Kuba\nA 10 2\nA 12 3\nP 20 Ewa', note: 'Pierwszy autobus zabiera Alę i Olę; Ala czekała 10 − 3 = 7 minut. Drugi zabiera Kubę (7 minut), a Ewa zostaje na przystanku.' }],
            hint: R`struct Pasazer { string imie; int t; }; queue<Pasazer> q;. Przy autobusie: int k = min(c, (int)q.size()); — pierwszy wsiadający to q.front(), czekał t − q.front().t. Potem k razy: zbierz imię i zrób pop().`,
            tests: (r) => {
                const gen = (q, pP, mc, dt) => {
                    const o = []; let t = r.int(0, 5);
                    for (let i = 0; i < q; i++) { t += r.int(0, dt); o.push(r() < pP ? `P ${t} ${r.pick(IMIONA)}` : `A ${t} ${r.int(0, mc)}`); }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nA 0 5', '2\nP 0 Ala\nA 1000000 1', '3\nP 4 Ala\nA 4 0\nA 4 1', gen(30, 0.7, 3, 4), gen(1000, 0.8, 5, 30), gen(1000, 0.6, 100, 300), gen(300, 0.9, 10, 2)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                let pt = -1;
                for (const l of L.slice(1)) {
                    const t = l.split(' ');
                    if (t.length !== 3 || !calk(Number(t[1]), 0, 1e6) || Number(t[1]) < pt) return 'czas';
                    pt = Number(t[1]);
                    if (t[0] === 'P') { if (!czyImie(t[2])) return 'imie'; } else if (t[0] !== 'A' || !calk(Number(t[2]), 0, 100)) return 'autobus';
                }
                return null;
            },
            solve: (inp) => {
                const q = new Kolejka();
                const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'P') q.push([t[2], Number(t[1])]);
                    else {
                        const czas = Number(t[1]), k = Math.min(Number(t[2]), q.size);
                        if (!k) { o.push(`o ${czas}: wsiadlo 0`); continue; }
                        const naj = czas - q.front()[1];
                        const im = [];
                        for (let i = 0; i < k; i++) im.push(q.pop()[0]);
                        o.push(`o ${czas}: wsiadlo ${k} (${im.join(' ')}), najdluzej czekal ${naj} min`);
                    }
                }
                o.push(`zostalo: ${q.size}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pasazer {
    string imie;
    int t;
};
int main() {
    int ile;
    cin >> ile;
    queue<Pasazer> q;
    for (int i = 0; i < ile; i++) {
        char z;
        int t;
        cin >> z >> t;
        if (z == 'P') {
            string imie;
            cin >> imie;
            q.push({imie, t});
        } else {
            int c;
            cin >> c;
            int k = min(c, (int)q.size());
            cout << "o " << t << ": wsiadlo " << k;
            if (k > 0) {
                int najdluzej = t - q.front().t;
                cout << " (";
                for (int j = 0; j < k; j++) {
                    if (j > 0) cout << " ";
                    cout << q.front().imie;
                    q.pop();
                }
                cout << "), najdluzej czekal " << najdluzej << " min";
            }
            cout << "\n";
        }
    }
    cout << "zostalo: " << q.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-drukarka', krok: 3, level: 'srednie',
            title: 'Drukarka z priorytetami',
            short: 'Drukarka bierze pierwszy dokument, ale jeśli dalej czeka ważniejszy — odkłada go na koniec. Kolejka numerów i tablica liczników ważności.',
            tags: ['kolejka numerów', 'tablica liczników', 'odkładanie na koniec'],
            statement: ['Do drukarki trafiło n dokumentów, ponumerowanych od 1 w kolejności w kolejce. Dokument i ma ważność wᵢ od 1 do 9. Drukarka bierze pierwszy dokument z kolejki. Jeśli w kolejce czeka jakikolwiek dokument o większej ważności, odkłada wzięty dokument na koniec kolejki. W przeciwnym razie drukuje go — drukowanie trwa minutę.',
                'Wypisz numery dokumentów w kolejności drukowania, a w drugim wierszu — w której minucie wydrukowano dokument numer m (pierwszy wydruk kończy się w minucie 1).'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n ważności w₁, w₂, …, wₙ.'],
            output_format: ['Dwa wiersze: numery dokumentów w kolejności drukowania oraz dokument m: minuta X.'],
            constraints: ['1 ≤ m ≤ n ≤ 1000', '1 ≤ wᵢ ≤ 9'],
            examples: [{ input: '4 3\n1 2 9 1', note: 'Dokumenty 1 i 2 idą na koniec, bo czeka ważniejszy dokument 3 — drukuje się on pierwszy. Potem kolejka to 4 1 2: dokument 4 idzie na koniec (czeka 2 o ważności 2), dokument 1 też — drukuje się 2, a po nim 4 i 1.' }],
            hint: R`queue<int> q; z numerami dokumentów, ważności w vectorze w, a int ile[10] = {}; liczy, ile dokumentów każdej ważności jeszcze czeka. Wziąwszy dokument d, sprawdź: czy ile[k] > 0 dla jakiegoś k > w[d]? Jeśli tak — q.push(d), jeśli nie — drukuj i zmniejsz ile[w[d]].`,
            tests: (r) => {
                const d = (w, m) => `${w.length} ${m}\n${w.join(' ')}`;
                const los = (n, a, b) => Array.from({ length: n }, () => r.int(a, b));
                return [d([5], 1), d([1, 1, 1], 2), d([1, 2, 9, 1], 3), d([9, 1, 1, 1, 1, 1], 1), d(los(10, 1, 9), 4), d(los(1000, 1, 9), r.int(1, 1000)), d(los(1000, 1, 2), 1000), d(Array.from({ length: 1000 }, (_, i) => 1 + Math.floor(i / 112)), 1)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0], m = t[1]; return calk(n, 1, 1000) && calk(m, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const n = t[0], m = t[1], w = [0].concat(t.slice(2));
                const ile = new Array(10).fill(0);
                for (let i = 1; i <= n; i++) ile[w[i]]++;
                const q = new Kolejka(Array.from({ length: n }, (_, i) => i + 1));
                const o = []; let kiedy = 0;
                while (!q.empty()) {
                    const d = q.pop();
                    let wazniejszy = false;
                    for (let k = w[d] + 1; k <= 9; k++) if (ile[k]) wazniejszy = true;
                    if (wazniejszy) q.push(d); else { o.push(d); ile[w[d]]--; if (d === m) kiedy = o.length; }
                }
                return `${o.join(' ')}\ndokument ${m}: minuta ${kiedy}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<int> w(n + 1);
    int ile[10] = {};
    queue<int> q;
    for (int i = 1; i <= n; i++) {
        cin >> w[i];
        ile[w[i]]++;
        q.push(i);
    }
    int minuta = 0, kiedy = 0;
    while (!q.empty()) {
        int d = q.front();
        q.pop();
        bool wazniejszy = false;
        for (int k = w[d] + 1; k <= 9; k++) {
            if (ile[k] > 0) wazniejszy = true;
        }
        if (wazniejszy) {
            q.push(d);
        } else {
            minuta++;
            cout << d << " ";
            ile[w[d]]--;
            if (d == m) kiedy = minuta;
        }
    }
    cout << "\n";
    cout << "dokument " << m << ": minuta " << kiedy << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-rezygnacje', krok: 3, level: 'srednie',
            title: 'Rezygnacje z kolejki',
            short: 'Ktoś ze środka kolejki rezygnuje — a z kolejki nie da się wyjąć środka. Zapisz go w set i pomiń dopiero wtedy, gdy dojdzie do przodu.',
            tags: ['leniwe usuwanie', 'set z rezygnacjami', 'licznik czekających'],
            statement: ['Do lekarza przychodzą pacjenci. Każdy pacjent przychodzi najwyżej raz (imiona są różne). Zdarzenia:',
                '• PRZYCHODZI imie — pacjent staje na końcu kolejki,',
                '• REZYGNUJE imie — pacjent, który wciąż czeka (ale może stać w środku kolejki), rezygnuje i wychodzi,',
                '• OBSLUZ — lekarz przyjmuje pierwszego czekającego pacjenta: wypisz jego imię albo nikt.',
                'Na koniec wypisz, ilu pacjentów wciąż czeka, i ich imiona w kolejności z kolejki. Z kolejki można usuwać tylko z przodu — zapamiętuj więc rezygnacje w zbiorze set<string> i pomijaj takich pacjentów dopiero wtedy, gdy znajdą się na początku kolejki.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno zdarzenie.'],
            output_format: ['Po jednym wierszu dla każdego OBSLUZ, a na końcu wiersz czeka (k): imiona albo czeka (0): nikt.'],
            constraints: ['1 ≤ q ≤ 4000', 'REZYGNUJE dotyczy zawsze pacjenta, który przyszedł, nie został przyjęty i jeszcze nie zrezygnował.', 'Imiona mają do 15 znaków (litery i cyfry).'],
            examples: [{ input: '7\nPRZYCHODZI Ala\nPRZYCHODZI Bartek\nPRZYCHODZI Celina\nREZYGNUJE Ala\nOBSLUZ\nREZYGNUJE Celina\nOBSLUZ', note: 'Ala zrezygnowała, więc pierwszy OBSLUZ pomija ją i przyjmuje Bartka. Celina też zrezygnowała — drugi OBSLUZ nie ma kogo przyjąć.' }],
            hint: R`set<string> rez; int czeka = 0;. Przy OBSLUZ: while (!q.empty() && rez.count(q.front())) q.pop(); — zrezygnowanych zdejmujesz dopiero teraz. Licznik czeka zwiększaj przy przyjściu, zmniejszaj przy rezygnacji i obsłużeniu; na końcu znów pomiń zrezygnowanych.`,
            tests: (r) => {
                const gen = (q, pP, pR) => {
                    const im = unikalneImiona(r, q);
                    let k = 0; const w = []; const o = [];
                    for (let i = 0; i < q; i++) {
                        const x = r();
                        if (x < pP || (!w.length && x < pP + pR)) { o.push(`PRZYCHODZI ${im[k]}`); w.push(im[k++]); }
                        else if (x < pP + pR && w.length) { const j = r.int(0, w.length - 1); o.push(`REZYGNUJE ${w[j]}`); w.splice(j, 1); }
                        else { o.push('OBSLUZ'); if (w.length) w.shift(); }
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nOBSLUZ', '3\nPRZYCHODZI Ala\nREZYGNUJE Ala\nOBSLUZ', '4\nPRZYCHODZI A\nPRZYCHODZI B\nREZYGNUJE B\nOBSLUZ', gen(30, 0.5, 0.25), gen(4000, 0.45, 0.25), gen(4000, 0.6, 0.3), gen(500, 0.4, 0.4)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 4000) || L.length !== q + 1) return 'q';
                const byl = new Set(), czeka = new Kolejka(), nieaktywni = new Set();
                for (const l of L.slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'PRZYCHODZI') { if (t.length !== 2 || !czyNazwa(t[1]) || byl.has(t[1])) return 'przyjście'; byl.add(t[1]); czeka.push(t[1]); }
                    else if (t[0] === 'REZYGNUJE') { if (!byl.has(t[1]) || nieaktywni.has(t[1])) return 'rezygnacja'; nieaktywni.add(t[1]); }
                    else if (l === 'OBSLUZ') { while (!czeka.empty() && nieaktywni.has(czeka.front())) czeka.pop(); if (!czeka.empty()) nieaktywni.add(czeka.pop()); }
                    else return 'zdarzenie';
                }
                return null;
            },
            solve: (inp) => {
                const q = new Kolejka(); const rez = new Set();
                const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'PRZYCHODZI') q.push(t[1]);
                    else if (t[0] === 'REZYGNUJE') rez.add(t[1]);
                    else { while (!q.empty() && rez.has(q.front())) q.pop(); o.push(q.empty() ? 'nikt' : q.pop()); }
                }
                const zost = q.toArray().filter((x) => !rez.has(x));
                o.push(`czeka (${zost.length}): ${zost.length ? zost.join(' ') : 'nikt'}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int ile;
    cin >> ile;
    queue<string> q;
    set<string> rez;
    int czeka = 0;
    for (int i = 0; i < ile; i++) {
        string z;
        cin >> z;
        if (z == "PRZYCHODZI") {
            string imie;
            cin >> imie;
            q.push(imie);
            czeka++;
        } else if (z == "REZYGNUJE") {
            string imie;
            cin >> imie;
            rez.insert(imie);
            czeka--;
        } else {
            while (!q.empty() && rez.count(q.front())) q.pop();
            if (q.empty()) cout << "nikt\n";
            else {
                cout << q.front() << "\n";
                q.pop();
                czeka--;
            }
        }
    }
    cout << "czeka (" << czeka << "):";
    if (czeka == 0) cout << " nikt";
    while (!q.empty()) {
        if (!rez.count(q.front())) cout << " " << q.front();
        q.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-myjnia', krok: 3, level: 'srednie',
            title: 'Myjnia z poczekalnią',
            short: 'Jedno stanowisko i poczekalnia na P aut. Kto przyjeżdża, gdy poczekalnia jest pełna — odjeżdża. Zanim wpuścisz nowe auto, przesuń zegar myjni do jego przyjazdu.',
            tags: ['symulacja z zegarem', 'pojemność kolejki', 'kolejka numerów'],
            statement: ['Myjnia ma jedno stanowisko i poczekalnię na co najwyżej P samochodów. Przyjeżdża n samochodów; samochód i przyjeżdża w chwili aᵢ (chwile nie maleją), a jego mycie trwa wᵢ minut. Gdy stanowisko się zwalnia, od razu wjeżdża na nie pierwszy samochód z poczekalni.',
                'Gdy samochód przyjeżdża w chwili t: najpierw na stanowisko wjeżdżają wszystkie samochody z poczekalni, których mycie może zacząć się najpóźniej w chwili t (także te, które zaczynają dokładnie w t). Potem, jeśli stanowisko jest wolne, nowy samochód od razu zaczyna mycie; jeśli jest zajęte, a w poczekalni jest mniej niż P samochodów — czeka; w przeciwnym razie odjeżdża bez mycia.',
                'Dla każdego samochodu, w kolejności z wejścia, wypisz chwilę rozpoczęcia i zakończenia mycia albo odjechal.'],
            input_format: ['W pierwszym wierszu liczby n i P.', 'W każdym z n kolejnych wierszy liczby aᵢ i wᵢ.'],
            output_format: ['n wierszy: start koniec albo odjechal.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ P ≤ 50', '0 ≤ aᵢ ≤ 10⁶, chwile nie maleją', '1 ≤ wᵢ ≤ 1000'],
            examples: [{ input: '5 1\n0 10\n2 5\n3 4\n10 2\n15 1', note: 'Auto 1 myje się 0–10. Auto 2 czeka w poczekalni, auto 3 odjeżdża (poczekalnia pełna). W chwili 10 auto 2 wjeżdża na stanowisko (10–15), a auto 4 zajmuje poczekalnię i myje się 15–17. Auto 5 przyjeżdża w 15, kiedy auto 4 właśnie wjechało — czeka i myje się 17–18.' }],
            hint: R`int wolne = 0; — chwila, od której stanowisko jest wolne. queue<int> q; — numery aut w poczekalni. Przy przyjeździe w chwili t: while (!q.empty() && wolne <= t) { int c = q.front(); q.pop(); start[c] = wolne; wolne += w[c]; }. Potem: if (q.empty() && wolne <= t) start = t, wolne = t + w; else if ((int)q.size() < P) q.push(i); else odjechal. Po pętli opróżnij poczekalnię tak samo.`,
            tests: (r) => {
                const gen = (n, P, dt, mw) => { const o = []; let t = r.int(0, 3); for (let i = 0; i < n; i++) { t += r.int(0, dt); o.push(`${t} ${r.int(1, mw)}`); } return `${n} ${P}\n${o.join('\n')}`; };
                return ['1 0\n0 1', '2 0\n0 5\n5 1', '3 1\n4 4\n4 4\n4 4', gen(10, 1, 4, 6), gen(2000, 3, 5, 12), gen(2000, 50, 2, 10), gen(2000, 0, 8, 10), gen(500, 5, 60, 100)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, P] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 2000) || !calk(P, 0, 50) || L.length !== n + 1) return 'n';
                let pt = 0;
                for (const l of L.slice(1)) { const [a, w] = l.split(' ').map(Number); if (!calk(a, 0, 1e6) || a < pt || !calk(w, 1, 1000)) return 'dane'; pt = a; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const [n, P] = L[0].split(' ').map(Number);
                const a = [], w = [];
                L.slice(1).forEach((l) => { const t = l.split(' ').map(Number); a.push(t[0]); w.push(t[1]); });
                const start = new Array(n).fill(-1);
                const q = new Kolejka();
                let wolne = 0;
                for (let i = 0; i < n; i++) {
                    const t = a[i];
                    while (!q.empty() && wolne <= t) { const c = q.pop(); start[c] = wolne; wolne += w[c]; }
                    if (q.empty() && wolne <= t) { start[i] = t; wolne = t + w[i]; } else if (q.size < P) q.push(i);
                }
                while (!q.empty()) { const c = q.pop(); start[c] = wolne; wolne += w[c]; }
                return start.map((s, i) => (s < 0 ? 'odjechal' : `${s} ${s + w[i]}`)).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, P;
    cin >> n >> P;
    vector<int> a(n), w(n), start(n, -1);
    for (int i = 0; i < n; i++) cin >> a[i] >> w[i];
    queue<int> q;
    int wolne = 0;
    for (int i = 0; i < n; i++) {
        int t = a[i];
        while (!q.empty() && wolne <= t) {
            int c = q.front();
            q.pop();
            start[c] = wolne;
            wolne += w[c];
        }
        if (q.empty() && wolne <= t) {
            start[i] = t;
            wolne = t + w[i];
        } else if ((int)q.size() < P) {
            q.push(i);
        }
    }
    while (!q.empty()) {
        int c = q.front();
        q.pop();
        start[c] = wolne;
        wolne += w[c];
    }
    for (int i = 0; i < n; i++) {
        if (start[i] < 0) cout << "odjechal\n";
        else cout << start[i] << " " << start[i] + w[i] << "\n";
    }
    return 0;
}`,
        },
    ];
};
