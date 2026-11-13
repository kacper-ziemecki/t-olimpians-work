// Zbiór — ćwiczenia w trakcie lekcji, części 7–8: multiset (oceny, jedna kopia czy wszystkie, półka z cenami,
// okna: największy i rozrzut, buty, sklejanie lin, pralnia) oraz unordered_set i szybkość (wielkie dane
// z generatora: ile różnych, para o sumie k, wspólne liczby, szybkie pytania, zapętlenie generatora; saldo
// i sumy prefiksowe, playlista bez powtórek, różne w oknach).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./zbior-pomoc');
    const { Zbior, Kopiec, rosnaco, generuj, losGen, dobryGen, KOD_GEN } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const losy = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const calk = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;
    const GEN_OPIS = 'Liczby powstają z generatora: x₁ = s, a każda następna to xᵢ = (xᵢ₋₁ · a + b) mod m.';
    const GEN_KOD = KOD_GEN;

    return [
        // ================================================================ KROK 7 · multiset
        {
            id: 'zb-dziennik-ocen', krok: 7, level: 'latwe',
            title: 'Dziennik ocen',
            short: 'Oceny się powtarzają, a poprawiona ocena znika — tylko jedna! multiset, count i erase(find).',
            tags: ['multiset', 'count', 'erase(find(x))'],
            statement: ['Nauczyciel prowadzi dziennik jednego ucznia. Wykonaj q poleceń:',
                'DODAJ x — uczeń dostaje ocenę x,',
                'USUN x — jedna ocena x zostaje poprawiona i znika z dziennika (jeśli uczeń nie ma żadnej oceny x, nic się nie dzieje),',
                'ILE x — wypisz, ile ocen x ma teraz uczeń.',
                'Na koniec wypisz wszystkie oceny ucznia rosnąco w jednym wierszu albo PUSTO, jeśli dziennik jest pusty.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie i ocena x.'],
            output_format: ['Odpowiedzi na polecenia ILE, każda w osobnym wierszu, a w ostatnim wierszu — wszystkie oceny rosnąco albo PUSTO.'],
            constraints: ['1 ≤ q ≤ 5000', '1 ≤ x ≤ 6'],
            examples: [{ input: '7\nDODAJ 5\nDODAJ 3\nDODAJ 5\nILE 5\nUSUN 5\nILE 5\nDODAJ 6', note: 'Uczeń ma dwie piątki. Poprawa usuwa tylko jedną z nich. Na końcu w dzienniku są 3, 5 i 6.' }],
            hint: R`Oceny się powtarzają, więc potrzebny jest multiset<int>. ILE to count(x). Przy USUN uważaj: m.erase(x) skasowałoby WSZYSTKIE oceny x. Usuń jedną: auto it = m.find(x); if (it != m.end()) m.erase(it);`,
            tests: (r) => { const t = (q) => `${q}\n${Array.from({ length: q }, () => `${r.pick(['DODAJ', 'DODAJ', 'DODAJ', 'USUN', 'ILE'])} ${r.int(1, 6)}`).join('\n')}`; return ['1\nILE 1', '2\nDODAJ 4\nUSUN 4', '5\nDODAJ 2\nDODAJ 2\nDODAJ 2\nUSUN 2\nILE 2', '3\nUSUN 1\nDODAJ 1\nILE 1', t(20), t(500), t(5000), t(5000)]; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 5000) || t.length !== 1 + 2 * q) return 'q'; for (let i = 0; i < q; i++) { if (!['DODAJ', 'USUN', 'ILE'].includes(t[1 + 2 * i])) return 'polecenie'; if (!calk(Number(t[2 + 2 * i]), 1, 6)) return 'ocena'; } return null; },
            solve: (inp) => { const t = toks(inp); const ile = [0, 0, 0, 0, 0, 0, 0]; const out = []; for (let i = 0; i < Number(t[0]); i++) { const p = t[1 + 2 * i], x = Number(t[2 + 2 * i]); if (p === 'DODAJ') ile[x]++; else if (p === 'USUN') { if (ile[x]) ile[x]--; } else out.push(String(ile[x])); } const w = []; for (let x = 1; x <= 6; x++) for (let k = 0; k < ile[x]; k++) w.push(x); out.push(w.length ? w.join(' ') : 'PUSTO'); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    multiset<int> oceny;
    while (q--) {
        string p;
        int x;
        cin >> p >> x;
        if (p == "DODAJ") oceny.insert(x);
        else if (p == "USUN") {
            auto it = oceny.find(x);
            if (it != oceny.end()) oceny.erase(it);
        } else cout << oceny.count(x) << "\n";
    }
    if (oceny.empty()) cout << "PUSTO";
    for (int x : oceny) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-jedno-czy-wszystkie', krok: 7, level: 'latwe',
            title: 'Jedno czy wszystkie?',
            short: 'JEDNO x usuwa jedną kopię, WSZYSTKIE x — każdą. Dwie różne linijki z erase.',
            tags: ['erase(x)', 'erase(find(x))', 'multiset'],
            statement: ['Dostajesz n liczb (mogą się powtarzać) i q poleceń usuwania:',
                'JEDNO x — usuń jedno wystąpienie liczby x (jeśli x nie ma, nic się nie dzieje),',
                'WSZYSTKIE x — usuń wszystkie wystąpienia liczby x.',
                'Po wykonaniu wszystkich poleceń wypisz, ile liczb zostało, a potem te liczby rosnąco (z powtórzeniami) — albo PUSTO, jeśli nic nie zostało.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W każdym z następnych q wierszy polecenie i liczba x.'],
            output_format: ['W pierwszym wierszu liczba pozostałych liczb.', 'W drugim wierszu pozostałe liczby rosnąco albo PUSTO.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ q ≤ 3000', '1 ≤ każda liczba, x ≤ 100'],
            examples: [{ input: '6 3\n4 2 4 4 7 2\nJEDNO 4\nWSZYSTKIE 2\nJEDNO 9', note: 'Po JEDNO 4 zostają dwie czwórki. WSZYSTKIE 2 usuwa obie dwójki. Dziewiątki nie było.' }],
            hint: R`W multisecie erase(x) usuwa wszystkie kopie — to dokładnie polecenie WSZYSTKIE. JEDNO wymaga strzałki: znajdź jedną kopię przez find i usuń ją erase(it), o ile find nie zwrócił end().`,
            tests: (r) => { const t = (n, q, hi) => `${n} ${q}\n${losy(r, n, 1, hi).join(' ')}\n${Array.from({ length: q }, () => `${r.pick(['JEDNO', 'JEDNO', 'WSZYSTKIE'])} ${r.int(1, hi)}`).join('\n')}`; return ['1 1\n5\nJEDNO 5', '3 1\n5 5 5\nWSZYSTKIE 5', '3 2\n5 5 5\nJEDNO 5\nJEDNO 6', t(10, 5, 5), t(300, 100, 30), t(3000, 3000, 100), t(3000, 200, 10), t(3000, 1000, 3)]; },
            check: (inp) => { const t = toks(inp); const [n, q] = t.slice(0, 2).map(Number); if (!calk(n, 1, 3000) || !calk(q, 1, 3000) || t.length !== 2 + n + 2 * q) return 'n, q'; if (!t.slice(2, 2 + n).every((x) => calk(Number(x), 1, 100))) return 'liczba'; for (let i = 0; i < q; i++) { if (!['JEDNO', 'WSZYSTKIE'].includes(t[2 + n + 2 * i])) return 'polecenie'; if (!calk(Number(t[3 + n + 2 * i]), 1, 100)) return 'x'; } return null; },
            solve: (inp) => { const t = toks(inp); const [n, q] = t.slice(0, 2).map(Number); const ile = new Array(101).fill(0); t.slice(2, 2 + n).forEach((x) => ile[Number(x)]++); for (let i = 0; i < q; i++) { const p = t[2 + n + 2 * i], x = Number(t[3 + n + 2 * i]); if (p === 'JEDNO') { if (ile[x]) ile[x]--; } else ile[x] = 0; } const w = []; for (let x = 1; x <= 100; x++) for (let k = 0; k < ile[x]; k++) w.push(x); return `${w.length}\n${w.length ? w.join(' ') : 'PUSTO'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    multiset<int> m;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        m.insert(x);
    }
    while (q--) {
        string p;
        int x;
        cin >> p >> x;
        if (p == "WSZYSTKIE") m.erase(x);
        else {
            auto it = m.find(x);
            if (it != m.end()) m.erase(it);
        }
    }
    cout << m.size() << "\n";
    if (m.empty()) cout << "PUSTO";
    for (int x : m) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-ceny-na-polce', krok: 7, level: 'srednie',
            title: 'Ceny na półce',
            short: 'Dostawy i sprzedaż, a w międzyczasie pytania o najtańszy i najdroższy produkt. Dwa produkty w tej samej cenie to dwa produkty!',
            tags: ['multiset', '*begin() i *rbegin()', 'erase(find(c))'],
            statement: ['W sklepie na półce leżą produkty. Wykonaj q poleceń:',
                'DOSTAWA c — na półkę trafia produkt w cenie c,',
                'SPRZEDAJ c — klient kupuje jeden produkt w cenie c (jeśli takiego nie ma, nic się nie dzieje),',
                'NAJTANSZY — wypisz cenę najtańszego produktu na półce,',
                'NAJDROZSZY — wypisz cenę najdroższego produktu.',
                'Jeśli przy NAJTANSZY albo NAJDROZSZY półka jest pusta, wypisz PUSTO.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie (DOSTAWA i SPRZEDAJ z ceną c).'],
            output_format: ['Odpowiedzi na polecenia NAJTANSZY i NAJDROZSZY, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ c ≤ 10⁶', 'Jest co najmniej jedno polecenie NAJTANSZY albo NAJDROZSZY.'],
            examples: [{ input: '8\nDOSTAWA 10\nDOSTAWA 30\nDOSTAWA 10\nNAJTANSZY\nSPRZEDAJ 10\nNAJTANSZY\nSPRZEDAJ 10\nNAJTANSZY', note: 'Na półce były dwa produkty po 10 zł. Po sprzedaży jednego najtańszy wciąż kosztuje 10, po sprzedaży drugiego — 30.' }],
            hint: R`Zwykły set zgubiłby drugi produkt za 10 zł — potrzebny jest multiset<int>. NAJTANSZY to *m.begin(), NAJDROZSZY to *m.rbegin() (po sprawdzeniu, że półka nie jest pusta). SPRZEDAJ usuwa jedną kopię: find i erase(it).`,
            tests: (r) => { const t = (q, hi) => { const w = []; for (let i = 0; i < q; i++) { const p = r.pick(['DOSTAWA', 'DOSTAWA', 'SPRZEDAJ', 'NAJTANSZY', 'NAJDROZSZY']); w.push(p.startsWith('NAJ') ? p : `${p} ${r.int(1, hi)}`); } if (!w.some((x) => x.startsWith('NAJ'))) w[q - 1] = 'NAJTANSZY'; return `${q}\n${w.join('\n')}`; }; return ['1\nNAJTANSZY', '3\nDOSTAWA 5\nNAJTANSZY\nNAJDROZSZY', '4\nDOSTAWA 5\nDOSTAWA 5\nSPRZEDAJ 5\nNAJDROZSZY', t(20, 5), t(500, 100), t(3000, 1e6), t(3000, 4)]; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 3000)) return 'q'; let i = 1, ile = 0, pyt = 0; while (i < t.length) { const p = t[i++]; ile++; if (p === 'DOSTAWA' || p === 'SPRZEDAJ') { if (!calk(Number(t[i++]), 1, 1e6)) return 'cena'; } else if (p === 'NAJTANSZY' || p === 'NAJDROZSZY') pyt++; else return 'polecenie'; } return ile === q && pyt ? null : 'liczba poleceń'; },
            solve: (inp) => { const t = toks(inp); const m = new Zbior(undefined, true); const out = []; let i = 1; while (i < t.length) { const p = t[i++]; if (p === 'DOSTAWA') m.add(Number(t[i++])); else if (p === 'SPRZEDAJ') m.del(Number(t[i++])); else out.push(m.size ? String(p === 'NAJTANSZY' ? m.min() : m.max()) : 'PUSTO'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    multiset<int> polka;
    while (q--) {
        string p;
        cin >> p;
        if (p == "DOSTAWA" || p == "SPRZEDAJ") {
            int c;
            cin >> c;
            if (p == "DOSTAWA") polka.insert(c);
            else {
                auto it = polka.find(c);
                if (it != polka.end()) polka.erase(it);
            }
        } else if (polka.empty()) {
            cout << "PUSTO\n";
        } else if (p == "NAJTANSZY") {
            cout << *polka.begin() << "\n";
        } else {
            cout << *polka.rbegin() << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-okno-max', krok: 7, level: 'srednie',
            title: 'Najcieplej w każdym tygodniu',
            short: 'Dla każdego okna k kolejnych dni — najwyższa temperatura. Okno w multisecie, wychodzi jedna kopia.',
            tags: ['okno w multisecie', 'erase(find)', '*rbegin()'],
            statement: ['Masz temperatury z n kolejnych dni. Dla każdego okresu k kolejnych dni (od dni 1…k, przez 2…k + 1, aż do n − k + 1…n) wypisz najwyższą temperaturę w tym okresie.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n temperatur, dzień po dniu.'],
            output_format: ['Jeden wiersz — n − k + 1 liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '7 3\n5 -2 3 8 1 -4 0', note: 'Okresy: (5, −2, 3) → 5, (−2, 3, 8) → 8, (3, 8, 1) → 8, (8, 1, −4) → 8, (1, −4, 0) → 1.' }],
            hint: R`Trzymaj w multisecie temperatury bieżącego okna. Dla i od 0 do n − 1: wstaw t[i]; jeśli i >= k, usuń JEDNĄ kopię t[i - k] (m.erase(m.find(t[i - k]))); jeśli i >= k - 1, wypisz *m.rbegin(). Zwykłe m.erase(t[i - k]) usunęłoby też inne dni z tą samą temperaturą — temperatury często się powtarzają.`,
            tests: (r) => { const t = (n, k, lo, hi) => `${n} ${k}\n${losy(r, n, lo, hi).join(' ')}`; return ['1 1\n7', '3 3\n1 2 3', '3 1\n-5 0 5', '5 2\n3 3 3 3 3', t(20, 4, -10, 10), t(1000, 50, -50, 50), t(5000, 1, -50, 50), t(5000, 5000, -50, 50), t(5000, 300, -3, 3), t(5000, 7, -50, 50)]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; if (!calk(n, 1, 5000) || !calk(k, 1, n) || t.length !== n + 2) return 'n, k'; return t.slice(2).every((x) => calk(x, -50, 50)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const [n, k] = t; const a = t.slice(2); const ile = new Array(101).fill(0); const out = []; for (let i = 0; i < n; i++) { ile[a[i] + 50]++; if (i >= k) ile[a[i - k] + 50]--; if (i >= k - 1) { let x = 100; while (!ile[x]) x--; out.push(x - 50); } } return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (int &x : t) cin >> x;
    multiset<int> okno;
    for (int i = 0; i < n; i++) {
        okno.insert(t[i]);
        if (i >= k) okno.erase(okno.find(t[i - k]));
        if (i >= k - 1) cout << *okno.rbegin() << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-okno-rozrzut', krok: 7, level: 'srednie',
            title: 'Najspokojniejszy tydzień',
            short: 'W którym okresie k dni różnica między najcieplejszym a najzimniejszym dniem była najmniejsza?',
            tags: ['okno w multisecie', '*rbegin() − *begin()', 'pierwsze minimum'],
            statement: ['Masz pomiary z n kolejnych dni. Rozrzut okresu k kolejnych dni to różnica między największym a najmniejszym pomiarem w tym okresie. Znajdź okres o najmniejszym rozrzucie.',
                'Wypisz ten najmniejszy rozrzut i numer pierwszego dnia tego okresu (dni numerujemy od 1). Jeśli kilka okresów ma ten sam najmniejszy rozrzut, wybierz ten, który zaczyna się najwcześniej.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n pomiarów.'],
            output_format: ['Dwie liczby: najmniejszy rozrzut i numer pierwszego dnia okresu.'],
            constraints: ['1 ≤ k ≤ n ≤ 10 000', '0 ≤ pomiar ≤ 10⁶'],
            examples: [{ input: '6 3\n10 12 30 11 13 12', note: 'Rozrzuty okresów: 20, 19, 19 i 2. Najspokojniejszy jest okres od dnia 4: (11, 13, 12).' }],
            hint: R`Ten sam schemat okna co w zadaniu o najcieplejszym tygodniu, tylko w każdym pełnym oknie liczysz *m.rbegin() - *m.begin() i porównujesz z dotychczas najlepszym. Okno kończące się na indeksie i (liczonym od 0) zaczyna się w dniu numer i - k + 2. Zmieniaj wynik tylko przy ściśle mniejszym rozrzucie — wtedy zostanie najwcześniejszy.`,
            tests: (r) => { const t = (n, k, hi) => `${n} ${k}\n${losy(r, n, 0, hi).join(' ')}`; return ['1 1\n5', '2 2\n0 1000000', '4 2\n5 5 5 5', '5 3\n1 9 1 9 1', t(30, 5, 20), t(2000, 40, 1e6), t(10000, 100, 1e6), t(10000, 1, 1e6), t(10000, 10000, 1e6), t(10000, 500, 50)]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; if (!calk(n, 1, 10000) || !calk(k, 1, n) || t.length !== n + 2) return 'n, k'; return t.slice(2).every((x) => calk(x, 0, 1e6)) ? null : 'zakres'; },
            solve: (inp) => {
                const t = nums(inp); const [n, k] = t; const a = t.slice(2);
                // kolejki monotoniczne: maksimum i minimum okna
                const mx = [], mn = []; let hx = 0, hn = 0, best = Infinity, dzien = 0;
                for (let i = 0; i < n; i++) {
                    while (mx.length > hx && a[mx[mx.length - 1]] <= a[i]) mx.pop(); mx.push(i);
                    while (mn.length > hn && a[mn[mn.length - 1]] >= a[i]) mn.pop(); mn.push(i);
                    if (mx[hx] <= i - k) hx++; if (mn[hn] <= i - k) hn++;
                    if (i >= k - 1) { const d = a[mx[hx]] - a[mn[hn]]; if (d < best) { best = d; dzien = i - k + 2; } }
                }
                return `${best} ${dzien}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (int &x : t) cin >> x;
    multiset<int> okno;
    int najlepszy = INT_MAX, dzien = 0;
    for (int i = 0; i < n; i++) {
        okno.insert(t[i]);
        if (i >= k) okno.erase(okno.find(t[i - k]));
        if (i >= k - 1) {
            int rozrzut = *okno.rbegin() - *okno.begin();
            if (rozrzut < najlepszy) {
                najlepszy = rozrzut;
                dzien = i - k + 2;
            }
        }
    }
    cout << najlepszy << " " << dzien << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-buty', krok: 7, level: 'srednie',
            title: 'Sklep z butami',
            short: 'Każdy klient kupuje najmniejszą parę, która na niego pasuje. lower_bound w multisecie i erase(it).',
            tags: ['multiset', 'lower_bound', 'erase(it)'],
            statement: ['W sklepie jest n par butów; znasz rozmiar każdej pary (rozmiary mogą się powtarzać). Klienci przychodzą po kolei i każdy zna rozmiar swojej stopy s. Klient kupuje najmniejszą dostępną parę o rozmiarze co najmniej s. Kupiona para znika ze sklepu.',
                'Dla każdego klienta wypisz rozmiar kupionej pary albo BRAK, jeśli żadna dostępna para na niego nie pasuje.'],
            input_format: ['W pierwszym wierszu liczby n i m — liczba par butów i liczba klientów.', 'W drugim wierszu n rozmiarów par.', 'W każdym z następnych m wierszy rozmiar stopy klienta.'],
            output_format: ['m wierszy — rozmiar kupionej pary albo BRAK.'],
            constraints: ['1 ≤ n, m ≤ 3000', '1 ≤ rozmiar ≤ 1000'],
            examples: [{ input: '5 4\n40 38 42 38 45\n39\n38\n38\n41', note: 'Pierwszy klient kupuje 40. Dwaj następni kupują obie pary 38. Ostatni potrzebuje co najmniej 41 — kupuje 42.' }],
            hint: R`Pary butów trzymaj w multiset<int> (dwie pary rozmiaru 38 to dwie różne pary). Dla klienta: auto it = m.lower_bound(s) — najmniejsza para ≥ s. Jeśli it == m.end(), wypisz BRAK; inaczej wypisz *it i usuń dokładnie tę parę: m.erase(it).`,
            tests: (r) => { const t = (n, m, lo, hi) => `${n} ${m}\n${losy(r, n, lo, hi).join(' ')}\n${losy(r, m, lo, hi).join('\n')}`; return ['1 1\n40\n41', '1 2\n40\n40\n40', '3 3\n38 38 38\n37\n38\n39', t(10, 10, 35, 45), t(500, 600, 1, 100), t(3000, 3000, 1, 1000), t(3000, 3000, 30, 40), t(100, 3000, 1, 1000)]; },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 3000) || !calk(m, 1, 3000) || t.length !== 2 + n + m) return 'n, m'; return t.slice(2).every((x) => calk(x, 1, 1000)) ? null : 'rozmiar'; },
            solve: (inp) => { const t = nums(inp); const [n] = t; const ile = new Array(1001).fill(0); t.slice(2, 2 + n).forEach((x) => ile[x]++); return t.slice(2 + n).map((s) => { let x = s; while (x <= 1000 && !ile[x]) x++; if (x > 1000) return 'BRAK'; ile[x]--; return String(x); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    multiset<int> buty;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        buty.insert(x);
    }
    for (int i = 0; i < m; i++) {
        int s;
        cin >> s;
        auto it = buty.lower_bound(s);
        if (it == buty.end()) cout << "BRAK\n";
        else {
            cout << *it << "\n";
            buty.erase(it);
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-sklejanie', krok: 7, level: 'srednie',
            title: 'Sklejanie lin',
            short: 'Zawsze sklejaj dwie najkrótsze liny. Ile kosztuje sklejenie wszystkich? Dwa razy begin(), wstaw sumę.',
            tags: ['multiset', 'dwa najmniejsze', 'long long'],
            statement: ['Masz n lin o podanych długościach. Sklejenie dwóch lin o długościach a i b kosztuje a + b, a w ich miejsce powstaje jedna lina o długości a + b. Sklejasz liny, aż zostanie jedna. Najtaniej wychodzi, gdy zawsze sklejasz dwie najkrótsze liny, jakie masz w danej chwili.',
                'Wypisz łączny koszt sklejenia wszystkich lin w ten sposób (dla jednej liny koszt to 0).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n długości lin.'],
            output_format: ['Jedna liczba — łączny koszt.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ długość ≤ 10⁶'],
            examples: [{ input: '4\n4 3 2 6', note: 'Sklejamy 2 i 3 (koszt 5), potem 4 i 5 (koszt 9), na koniec 6 i 9 (koszt 15). Razem 5 + 9 + 15 = 29.' }],
            hint: R`Liny trzymaj w multiset<long long> — mogą mieć równe długości. Dopóki m.size() > 1: zdejmij najkrótszą (a = *m.begin(); m.erase(m.begin());), potem kolejną najkrótszą b tak samo, dodaj a + b do kosztu i wstaw a + b z powrotem. Koszt rośnie szybko — long long.`,
            tests: (r) => { const t = (n, hi) => `${n}\n${losy(r, n, 1, hi).join(' ')}`; return ['1\n7', '2\n5 5', '3\n1 1 1', t(10, 10), t(1000, 1e6), t(10000, 1e6), t(10000, 1), `10000\n${Array(10000).fill(1000000).join(' ')}`]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const k = new Kopiec(); nums(inp).slice(1).forEach((x) => k.push(x)); let koszt = 0; while (k.size > 1) { const a = k.pop(), b = k.pop(); koszt += a + b; k.push(a + b); } if (koszt > Number.MAX_SAFE_INTEGER) throw new Error('za duży koszt'); return String(koszt); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    multiset<long long> liny;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        liny.insert(x);
    }
    long long koszt = 0;
    while (liny.size() > 1) {
        long long a = *liny.begin();
        liny.erase(liny.begin());
        long long b = *liny.begin();
        liny.erase(liny.begin());
        koszt += a + b;
        liny.insert(a + b);
    }
    cout << koszt << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-pralnia', krok: 7, level: 'trudne',
            title: 'Pralnia',
            short: 'k pralek, klienci w kolejce. Każdy bierze pralkę, która zwolni się najwcześniej. Kiedy koniec i ile czekania?',
            tags: ['multiset czasów', 'zawsze najmniejszy', 'max(przyjście, wolna)', 'long long'],
            statement: ['W pralni samoobsługowej jest k pralek, na początku wszystkie wolne. Klienci przychodzą po kolei: i-ty przychodzi w minucie tᵢ (minuty nie maleją) i potrzebuje pralki na dᵢ minut. Każdy klient zajmuje pralkę, która zwolni się najwcześniej. Jeśli wszystkie są zajęte, czeka na nią — i zaczyna pranie dokładnie w chwili, gdy się zwolni (zaczyna więc w minucie max(tᵢ, chwila zwolnienia pralki)).',
                'Wypisz minutę, w której skończy się ostatnie pranie, i łączny czas czekania wszystkich klientów.'],
            input_format: ['W pierwszym wierszu liczby k i n.', 'W każdym z następnych n wierszy dwie liczby: tᵢ i dᵢ.'],
            output_format: ['Dwie liczby: minuta zakończenia ostatniego prania i łączny czas czekania.'],
            constraints: ['1 ≤ k ≤ 1000', '1 ≤ n ≤ 5000', '0 ≤ t₁ ≤ t₂ ≤ … ≤ tₙ ≤ 10⁹', '1 ≤ dᵢ ≤ 10⁶'],
            examples: [{ input: '2 4\n0 5\n1 3\n2 4\n6 2', note: 'Klienci 1 i 2 od razu zajmują pralki (skończą w minutach 5 i 4). Klient 3 przychodzi w minucie 2 i czeka do minuty 4 — czeka 2 minuty, kończy w 8. Klient 4 przychodzi w minucie 6, a pralka zwolniła się w 5 — nie czeka, kończy w 8.' }],
            hint: R`Trzymaj w multiset<long long> minuty, w których pralki się zwolnią — na początku k zer. Dla klienta: f = *m.begin() (najwcześniej wolna pralka), usuń ją z multisetu, start = max(t, f), czekanie += start - t, a do multisetu wstaw start + d. Koniec ostatniego prania to największa wartość na końcu: *m.rbegin(). Czasy i suma czekania przekraczają int — long long.`,
            tests: (r) => {
                const t = (k, n, krok, dmax) => { let c = 0; const w = []; for (let i = 0; i < n; i++) { c += r.int(0, krok); if (c > 1e9) c = 1e9; w.push(`${c} ${r.int(1, dmax)}`); } return `${k} ${n}\n${w.join('\n')}`; };
                return ['1 1\n0 1', '1 2\n0 10\n0 10', '3 2\n5 1\n5 1', t(2, 10, 3, 5), t(5, 200, 2, 30), t(1000, 5000, 1, 1e6), t(1, 5000, 100, 1e6), t(10, 5000, 200000, 1e6), t(100, 5000, 0, 1e6)];
            },
            check: (inp) => { const t = nums(inp); const [k, n] = t; if (!calk(k, 1, 1000) || !calk(n, 1, 5000) || t.length !== 2 + 2 * n) return 'k, n'; let p = 0; for (let i = 0; i < n; i++) { const a = t[2 + 2 * i], d = t[3 + 2 * i]; if (!calk(a, 0, 1e9) || a < p || !calk(d, 1, 1e6)) return 'klient'; p = a; } return null; },
            solve: (inp) => { const t = nums(inp); const [k, n] = t; const kop = new Kopiec(); for (let i = 0; i < k; i++) kop.push(0); let czek = 0, koniec = 0; for (let i = 0; i < n; i++) { const a = t[2 + 2 * i], d = t[3 + 2 * i]; const f = kop.pop(); const s = Math.max(a, f); czek += s - a; kop.push(s + d); koniec = Math.max(koniec, s + d); } if (czek > Number.MAX_SAFE_INTEGER) throw new Error('za duże'); return `${koniec} ${czek}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k, n;
    cin >> k >> n;
    multiset<long long> wolna;
    for (int i = 0; i < k; i++) wolna.insert(0);
    long long czekanie = 0;
    for (int i = 0; i < n; i++) {
        long long t, d;
        cin >> t >> d;
        long long f = *wolna.begin();
        wolna.erase(wolna.begin());
        long long start = max(t, f);
        czekanie += start - t;
        wolna.insert(start + d);
    }
    cout << *wolna.rbegin() << " " << czekanie << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · unordered_set i szybkość
        {
            id: 'zb-duzo-roznych', krok: 8, level: 'latwe',
            title: 'Ile różnych — wielkie dane',
            short: 'Do 200 000 liczb z generatora. Ile różnych? Pętla w pętli nie zdąży, zbiór — tak.',
            tags: ['generator', 'set / unordered_set', 'O(n log n)'],
            statement: [GEN_OPIS + ' Ile różnych liczb jest wśród x₁, x₂, …, xₙ?'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — ile różnych wartości ma ciąg.'],
            constraints: ['1 ≤ n ≤ 200 000', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '8 0 1 3 10', note: 'Ciąg: 0, 3, 6, 9, 2, 5, 8, 1 — wszystkie różne.' }, { input: '10 1 2 3 7', note: 'Ciąg: 1, 5, 6, 1, 5, 6, … — zapętla się, różne są tylko trzy liczby.' }],
            hint: 'Generuj liczby w pętli w long long (iloczyn x · a może sięgać 10¹⁸) i wstawiaj do set<long long> albo unordered_set<long long>; wynik to size(). Sprawdzanie każdej nowej liczby ze wszystkimi poprzednimi to O(n²) — dla n = 200 000 około 20 miliardów porównań. Generator: ' + GEN_KOD,
            tests: (r) => ['1 5 2 3 10', '5 0 0 0 1', '6 0 1 2 6', '20 3 7 5 50', losGen(r, 1000, 1000), losGen(r, 200000, 1e9), '200000 7 5 3 1048576', '200000 1 21 7 1000000', losGen(r, 200000, 5000), '200000 0 1 1 200000'],
            check: (inp) => (dobryGen(toks(inp), 0, 200000, 1e9) && toks(inp).length === 5 ? null : 'generator'),
            solve: (inp) => { const [n, s, a, b, m] = nums(inp); return String(new Set(generuj(n, s, a, b, m)).size); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    set<long long> rozne;
    long long x = s;
    for (long long i = 0; i < n; i++) {
        rozne.insert(x);
        x = (x * a + b) % m;
    }
    cout << rozne.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-para-sumy', krok: 8, level: 'srednie',
            title: 'Para o sumie k — wielkie dane',
            short: 'Czy dwie różne pozycje ciągu dają w sumie k? Pytaj o k − x przed wstawieniem x.',
            tags: ['generator', 'count(k − x)', 'long long'],
            statement: [GEN_OPIS + ' Czy istnieją dwie różne pozycje i < j, dla których xᵢ + xⱼ = k? Wypisz TAK albo NIE.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, k.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 200 000', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ k ≤ 2 · 10⁹'],
            examples: [{ input: '6 1 3 1 20 17', note: 'Ciąg: 1, 4, 13, 0, 1, 4. 4 + 13 = 17, więc TAK.' }, { input: '4 2 2 0 9 4', note: 'Ciąg: 2, 4, 8, 7. Suma 4 wymagałaby dwóch dwójek, a dwójka jest tylko jedna: NIE.' }],
            hint: 'Czytaj ciąg po kolei. Dla każdej liczby x najpierw zapytaj zbiór, czy jest w nim k − x (to by była para z wcześniejszą pozycją), a dopiero potem wstaw x. Wszystko w long long. Dwie pętle po parach to 20 miliardów sprawdzeń dla n = 200 000. Generator: ' + GEN_KOD,
            tests: (r) => {
                const zPara = (n, m, tak) => { const g = losGen(r, n, m).split(' ').map(Number); const x = generuj(...g); let k; if (tak) { const i = r.int(0, n - 2), j = r.int(i + 1, n - 1); k = x[i] + x[j]; } else k = r.int(0, Math.min(2e9, 2 * m)); return `${g.join(' ')} ${k}`; };
                return ['1 5 1 0 10 10', '2 5 1 0 10 10', '3 0 1 1 1000 1', zPara(20, 50, true), zPara(20, 1e9, false), zPara(200000, 1e9, true), zPara(200000, 1e9, false), `200000 2 4 2 1000000000 1999999999`, zPara(200000, 1000, false), `200000 7 5 3 1048576 ${2 * 1048575 + 1}`];
            },
            check: (inp) => { const t = toks(inp); if (t.length !== 6 || !dobryGen(t, 0, 200000, 1e9)) return 'generator'; return calk(Number(t[5]), 0, 2e9) ? null : 'k'; },
            solve: (inp) => { const t = nums(inp); const x = generuj(t[0], t[1], t[2], t[3], t[4]); const k = t[5]; const s = new Set(); for (const v of x) { if (s.has(k - v)) return 'TAK'; s.add(v); } return 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m, k;
    cin >> n >> s >> a >> b >> m >> k;
    set<long long> widziane;
    bool jest = false;
    long long x = s;
    for (long long i = 0; i < n; i++) {
        if (widziane.count(k - x)) jest = true;
        widziane.insert(x);
        x = (x * a + b) % m;
    }
    cout << (jest ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-saldo', krok: 8, level: 'srednie',
            title: 'Saldo jak kiedyś',
            short: 'Pierwszy dzień, w którym saldo konta jest takie samo jak w którymś wcześniejszym dniu. Zbiór sum prefiksowych.',
            tags: ['sumy prefiksowe', 'count', 'long long'],
            statement: ['Na początku (dzień 0) saldo konta wynosi 0. Każdego z n kolejnych dni na konto wpływa albo z niego schodzi pewna kwota (liczba dodatnia albo ujemna), a saldo po dniu d to suma kwot z dni 1…d.',
                'Znajdź pierwszy dzień d, po którym saldo jest równe saldu z któregoś wcześniejszego dnia e (0 ≤ e < d). Wypisz d i e — a jeśli wcześniejszych dni z tym samym saldem jest kilka, wypisz najwcześniejszy z nich. Jeśli saldo nigdy się nie powtórzyło, wypisz NIGDY.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kwot.'],
            output_format: ['Dwie liczby d i e albo NIGDY.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁶ ≤ kwota ≤ 10⁶'],
            examples: [{ input: '6\n3 -1 4 -3 5 2', note: 'Salda po dniach 0–4: 0, 3, 2, 6, 3. Po dniu 4 saldo 3 powtarza saldo z dnia 1 — kwoty z dni 2–4 sumują się do zera.' }, { input: '3\n1 2 3', note: 'Saldo tylko rośnie.' }],
            hint: R`Zbiór pamięta salda, które już były — na start wstaw 0 (dzień 0). Po każdym dniu policz nowe saldo (long long) i sprawdź count: pierwsze trafienie daje d. Żeby znaleźć e, przejdź salda drugi raz od dnia 0 (możesz je zapisać w vectorze) i znajdź pierwszy dzień z tym samym saldem.`,
            tests: (r) => { const t = (n, hi) => `${n}\n${losy(r, n, -hi, hi).join(' ')}`; return ['1\n0', '1\n5', '2\n5 -5', '4\n1 1 -1 -1', t(20, 5), t(1000, 1e6), `10000\n${Array.from({ length: 10000 }, (_, i) => i + 1).join(' ')}`, t(10000, 1e6), t(10000, 3)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'kwota'; },
            solve: (inp) => { const t = nums(inp).slice(1); const kiedy = new Map([[0, 0]]); let s = 0; for (let d = 1; d <= t.length; d++) { s += t[d - 1]; if (kiedy.has(s)) return `${d} ${kiedy.get(s)}`; kiedy.set(s, d); } return 'NIGDY'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> saldo(n + 1, 0);
    set<long long> byly = {0};
    int d = -1;
    for (int i = 1; i <= n; i++) {
        long long kwota;
        cin >> kwota;
        saldo[i] = saldo[i - 1] + kwota;
        if (d == -1 && byly.count(saldo[i])) d = i;
        byly.insert(saldo[i]);
    }
    if (d == -1) {
        cout << "NIGDY\n";
        return 0;
    }
    int e = 0;
    while (saldo[e] != saldo[d]) e++;
    cout << d << " " << e << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-playlista', krok: 8, level: 'srednie',
            title: 'Playlista bez powtórek',
            short: 'Najdłuższy fragment playlisty, w którym żaden utwór się nie powtarza. Dwa wskaźniki i set<string>.',
            tags: ['dwa wskaźniki', 'okno ze zbiorem', 'set<string>'],
            statement: ['Playlista to n tytułów utworów (tytuł to jedno słowo; ten sam utwór może wystąpić wiele razy). Znajdź najdłuższy fragment playlisty — kawałek kolejnych utworów bez przerw — w którym żaden utwór się nie powtarza.',
                'Wypisz długość tego fragmentu i numer jego pierwszego utworu (utwory numerujemy od 1). Jeśli najdłuższych fragmentów jest kilka, wybierz ten, który zaczyna się najwcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n tytułów (małe litery a–z i cyfry, do 10 znaków).'],
            output_format: ['Dwie liczby: długość fragmentu i numer jego pierwszego utworu.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '8\na b c a d e c b', note: 'Fragment od 2. do 6. utworu (b, c, a, d, e) ma 5 różnych utworów. Fragment od 4. do 8. też ma długość 5, ale zaczyna się później.' }],
            hint: R`Okno [l, r] trzyma swoje tytuły w set<string>. Prawy koniec r idzie po kolei. Dopóki tytuł t[r] już jest w oknie, usuwaj t[l] ze zbioru i przesuwaj l w prawo. Potem wstaw t[r] i porównaj długość r - l + 1 z najlepszą — zmieniaj wynik tylko przy ściśle dłuższym oknie, wtedy zostanie najwcześniejsze.`,
            tests: (r) => { const t = (n, pula) => { const p = Array.from({ length: pula }, () => r.word(r.int(1, 10), 'abcdefghijklmnopqrstuvwxyz0123456789')); return `${n}\n${Array.from({ length: n }, () => r.pick(p)).join(' ')}`; }; return ['1\nx', '3\na a a', '4\na b c d', '5\nab ab ba ab ba', t(20, 5), t(2000, 50), t(10000, 10000), t(10000, 300), t(10000, 2)]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z0-9]{1,10}$/.test(w)) ? null : 'tytuł'; },
            solve: (inp) => { const t = toks(inp).slice(1); const ost = new Map(); let l = 0, best = 0, start = 1; t.forEach((w, r) => { if (ost.has(w) && ost.get(w) >= l) l = ost.get(w) + 1; ost.set(w, r); if (r - l + 1 > best) { best = r - l + 1; start = l + 1; } }); return `${best} ${start}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> t(n);
    for (string &w : t) cin >> w;
    set<string> okno;
    int l = 0, najl = 0, start = 1;
    for (int r = 0; r < n; r++) {
        while (okno.count(t[r])) {
            okno.erase(t[l]);
            l++;
        }
        okno.insert(t[r]);
        if (r - l + 1 > najl) {
            najl = r - l + 1;
            start = l + 1;
        }
    }
    cout << najl << " " << start << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-wspolne-duze', krok: 8, level: 'srednie',
            title: 'Wspólne liczby — wielkie dane',
            short: 'Dwa długie ciągi z generatora. Ile różnych wartości występuje w obu? Część wspólna na dużych danych.',
            tags: ['generator', 'część wspólna', 'O(n log n)'],
            statement: ['Dwa ciągi powstają z generatora: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m — każdy z innymi parametrami. Ile różnych wartości występuje w obu ciągach?'],
            input_format: ['W pierwszym wierszu pięć liczb pierwszego ciągu: n₁, s₁, a₁, b₁, m₁.', 'W drugim wierszu pięć liczb drugiego ciągu: n₂, s₂, a₂, b₂, m₂.'],
            output_format: ['Jedna liczba — ile różnych wartości jest w obu ciągach.'],
            constraints: ['1 ≤ n₁, n₂ ≤ 150 000', '1 ≤ m₁, m₂ ≤ 10⁹', '0 ≤ s, a, b < m (dla każdego ciągu)'],
            examples: [{ input: '5 0 1 2 100\n4 1 1 3 100', note: 'Pierwszy ciąg: 0, 2, 4, 6, 8. Drugi: 1, 4, 7, 10. Wspólna jest tylko czwórka.' }],
            hint: 'Wygeneruj pierwszy ciąg do zbioru A, drugi do zbioru B, a potem policz elementy A, które ma B (przechodź mniejszy zbiór, pytaj większy). Porównywanie każdej liczby z każdą to ponad 20 miliardów sprawdzeń. Generator: ' + GEN_KOD,
            tests: (r) => ['1 5 1 0 10\n1 5 1 0 10', '1 5 1 0 10\n1 6 1 0 10', '6 0 1 1 6\n6 0 1 2 6', `${losGen(r, 1000, 2000)}\n${losGen(r, 1000, 2000)}`, `${losGen(r, 150000, 1e6)}\n${losGen(r, 150000, 1e6)}`, '150000 7 5 3 1048576\n150000 1 5 1 1048576', '150000 1 21 7 1000000\n150000 3 21 7 1000000', `${losGen(r, 150000, 1e9)}\n${losGen(r, 150000, 1e9)}`, '150000 0 1 2 300000\n150000 0 1 3 450000'],
            check: (inp) => { const t = toks(inp); return t.length === 10 && dobryGen(t, 0, 150000, 1e9) && dobryGen(t, 5, 150000, 1e9) ? null : 'generatory'; },
            solve: (inp) => { const t = nums(inp); const A = new Set(generuj(t[0], t[1], t[2], t[3], t[4])); const B = new Set(generuj(t[5], t[6], t[7], t[8], t[9])); let w = 0; for (const x of B) if (A.has(x)) w++; return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    set<long long> A, B;
    for (int c = 0; c < 2; c++) {
        long long n, s, a, b, m;
        cin >> n >> s >> a >> b >> m;
        long long x = s;
        for (long long i = 0; i < n; i++) {
            if (c == 0) A.insert(x);
            else B.insert(x);
            x = (x * a + b) % m;
        }
    }
    int wspolne = 0;
    for (long long x : B)
        if (A.count(x)) wspolne++;
    cout << wspolne << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-zapetlenie', krok: 8, level: 'srednie',
            title: 'Kiedy generator się zapętli?',
            short: 'Generator w końcu powtórzy liczbę i zacznie krążyć. Na której pozycji i jak długa jest pętla?',
            tags: ['wykrywanie powtórki', 'zbiór albo tablica', 'długość cyklu'],
            statement: [GEN_OPIS + ' Ponieważ wartości są mniejsze od m, ciąg w końcu powtórzy którąś liczbę — a od tej chwili będzie krążył w kółko.',
                'Znajdź najmniejsze i, dla którego xᵢ jest równe któremuś wcześniejszemu xⱼ (j < i). Wypisz i oraz długość pętli, czyli i − j.'],
            input_format: ['Jeden wiersz z czterema liczbami: s, a, b, m.'],
            output_format: ['Dwie liczby: i oraz i − j.'],
            constraints: ['1 ≤ m ≤ 300 000', '0 ≤ s, a, b < m'],
            examples: [{ input: '1 2 3 7', note: 'Ciąg: x₁ = 1, x₂ = 5, x₃ = 6, x₄ = 1. Czwarta liczba powtarza pierwszą — pętla ma długość 3.' }, { input: '0 1 1 5', note: '0, 1, 2, 3, 4, 0 — szósta liczba powtarza pierwszą, pętla obejmuje wszystkie pięć wartości.' }],
            hint: 'Generuj kolejne liczby i wstawiaj do zbioru, pytając najpierw count — pierwsza znaleziona powtórka daje i. Żeby znaleźć j, wygeneruj ciąg drugi raz od początku i zatrzymaj się na pierwszej liczbie równej xᵢ. Wartości są mniejsze od m ≤ 300 000, więc zamiast zbioru możesz też użyć tablicy, w której pod indeksem x zapisujesz numer pozycji, na której x się pojawił. Licz w long long.',
            tests: (r) => { const g = (m) => `${r.int(0, m - 1)} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${m}`; return ['0 0 0 1', '5 0 3 10', '2 2 0 9', g(50), g(1000), g(300000), '7 5 3 262144', '1 21 7 300000', '0 1 1 300000', g(299999)]; },
            check: (inp) => { const t = nums(inp); if (t.length !== 4) return 'liczby'; const [s, a, b, m] = t; return calk(m, 1, 300000) && calk(s, 0, m - 1) && calk(a, 0, m - 1) && calk(b, 0, m - 1) ? null : 'zakres'; },
            solve: (inp) => { const [s, a, b, m] = nums(inp); const gdzie = new Int32Array(m); let x = s; for (let i = 1; ; i++) { if (gdzie[x]) return `${i} ${i - gdzie[x]}`; gdzie[x] = i; x = (P.mulmod(x, a, m) + b) % m; } },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long s, a, b, m;
    cin >> s >> a >> b >> m;
    set<long long> byly;
    long long x = s;
    int i = 1;
    while (!byly.count(x)) {
        byly.insert(x);
        x = (x * a + b) % m;
        i++;
    }
    long long y = s;
    int j = 1;
    while (y != x) {
        y = (y * a + b) % m;
        j++;
    }
    cout << i << " " << i - j << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-rozne-w-oknach', krok: 8, level: 'trudne',
            title: 'Różne w każdym oknie',
            short: 'Dla każdego okna k kolejnych liczb — ile w nim różnych? Wypisz największą i najmniejszą z tych wartości.',
            tags: ['okno w multisecie', 'find zamiast count', 'licznik różnych'],
            statement: ['Dostajesz n liczb i długość okna k. Dla każdego okna k kolejnych liczb policz, ile różnych wartości w nim występuje. Wypisz największą i najmniejszą z tych liczności.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwie liczby: największa i najmniejsza liczba różnych wartości w oknie.'],
            constraints: ['1 ≤ k ≤ n ≤ 10 000', '1 ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '7 3\n1 2 1 3 3 3 2', note: 'Okna: (1, 2, 1) → 2, (2, 1, 3) → 3, (1, 3, 3) → 2, (3, 3, 3) → 1, (3, 3, 2) → 2. Największa liczność 3, najmniejsza 1.' }],
            hint: R`Budowanie nowego zbioru dla każdego okna to O(n · k) wstawień — dla n = 10 000 i k = 5000 za dużo. Przesuwaj okno: trzymaj jego liczby w multisecie i licznik różnych. Przed wstawieniem x: jeśli m.find(x) == m.end(), licznik++. Po usunięciu jednej kopii wychodzącej liczby y (m.erase(m.find(y))): jeśli m.find(y) == m.end(), licznik--. Nie używaj tu count — przy wielu kopiach jest wolny.`,
            tests: (r) => { const t = (n, k, hi) => `${n} ${k}\n${losy(r, n, 1, hi).join(' ')}`; return ['1 1\n5', '3 3\n1 1 1', '4 2\n1 2 1 2', t(20, 5, 4), t(2000, 100, 50), t(10000, 5000, 1e6), t(10000, 5000, 3000), t(10000, 1, 1e6), t(10000, 7000, 2)]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; if (!calk(n, 1, 10000) || !calk(k, 1, n) || t.length !== n + 2) return 'n, k'; return t.slice(2).every((x) => calk(x, 1, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const [n, k] = t; const a = t.slice(2); const ile = new Map(); let roz = 0, mx = 0, mn = Infinity; for (let i = 0; i < n; i++) { const c = ile.get(a[i]) || 0; if (!c) roz++; ile.set(a[i], c + 1); if (i >= k) { const y = a[i - k]; const d = ile.get(y) - 1; ile.set(y, d); if (!d) roz--; } if (i >= k - 1) { mx = Math.max(mx, roz); mn = Math.min(mn, roz); } } return `${mx} ${mn}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (int &x : t) cin >> x;
    multiset<int> okno;
    int rozne = 0, najw = 0, najmn = INT_MAX;
    for (int i = 0; i < n; i++) {
        if (okno.find(t[i]) == okno.end()) rozne++;
        okno.insert(t[i]);
        if (i >= k) {
            okno.erase(okno.find(t[i - k]));
            if (okno.find(t[i - k]) == okno.end()) rozne--;
        }
        if (i >= k - 1) {
            najw = max(najw, rozne);
            najmn = min(najmn, rozne);
        }
    }
    cout << najw << " " << najmn << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-szybkie-pytania', krok: 8, level: 'srednie',
            title: 'Szybkie pytania',
            short: '200 000 liczb i 200 000 pytań „czy jest?”. Zbiór raz, potem każde pytanie w O(log n) — albo O(1).',
            tags: ['generator', 'count', 'unordered_set'],
            statement: ['Pierwszy ciąg (zbiór liczb) i drugi ciąg (pytania) powstają z generatora: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m — każdy ciąg z własnymi parametrami. Dla każdego pytania sprawdź, czy ta liczba występuje w pierwszym ciągu. Wypisz, na ile pytań odpowiedź brzmi „tak”.'],
            input_format: ['W pierwszym wierszu pięć liczb pierwszego ciągu: n, s, a, b, m.', 'W drugim wierszu pięć liczb ciągu pytań: q, s₂, a₂, b₂, m₂.'],
            output_format: ['Jedna liczba — ile pytań trafiło w liczbę z pierwszego ciągu.'],
            constraints: ['1 ≤ n, q ≤ 200 000', '1 ≤ m, m₂ ≤ 10⁹', '0 ≤ s, a, b < m, 0 ≤ s₂, a₂, b₂ < m₂'],
            examples: [{ input: '4 1 2 0 100\n5 0 1 2 10', note: 'Liczby: 1, 2, 4, 8. Pytania: 0, 2, 4, 6, 8. Trafiają 2, 4 i 8 — trzy pytania.' }],
            hint: 'Wygeneruj pierwszy ciąg do zbioru (set albo unordered_set), a potem generuj pytania jedno po drugim i licz trafienia przez count. Sprawdzanie każdego pytania z każdą liczbą to 40 miliardów porównań. Uwaga: pytania mogą się powtarzać i każde liczy się osobno. Generator: ' + GEN_KOD,
            tests: (r) => ['1 5 1 0 10\n1 5 1 0 10', '1 5 1 0 10\n3 4 1 1 10', '5 0 1 1 5\n10 0 1 1 5', `${losGen(r, 1000, 3000)}\n${losGen(r, 1000, 3000)}`, `${losGen(r, 200000, 1e6)}\n${losGen(r, 200000, 1e6)}`, '200000 7 5 3 1048576\n200000 0 5 1 1048576', `${losGen(r, 200000, 1e9)}\n${losGen(r, 200000, 400000)}`, '200000 0 1 2 1000000000\n200000 0 1 4 1000000000'],
            check: (inp) => { const t = toks(inp); return t.length === 10 && dobryGen(t, 0, 200000, 1e9) && dobryGen(t, 5, 200000, 1e9) ? null : 'generatory'; },
            solve: (inp) => { const t = nums(inp); const A = new Set(generuj(t[0], t[1], t[2], t[3], t[4])); let w = 0; for (const x of generuj(t[5], t[6], t[7], t[8], t[9])) if (A.has(x)) w++; return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    unordered_set<long long> liczby;
    long long x = s;
    for (long long i = 0; i < n; i++) {
        liczby.insert(x);
        x = (x * a + b) % m;
    }
    long long q;
    cin >> q >> s >> a >> b >> m;
    long long trafione = 0;
    x = s;
    for (long long i = 0; i < q; i++) {
        if (liczby.count(x)) trafione++;
        x = (x * a + b) % m;
    }
    cout << trafione << "\n";
    return 0;
}`,
        },
    ];
};
