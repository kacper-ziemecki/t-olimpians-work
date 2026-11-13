// Zbiór — ćwiczenia w trakcie lekcji, części 4–6: szukanie w zbiorze (lower_bound, upper_bound, poprzednik,
// najbliższa wartość, zbiór, który rośnie i maleje), działania na zbiorach (część wspólna, suma, różnica,
// różnica symetryczna, podzbiór, litery, wiele zbiorów) oraz zbiory par i napisów (punkty, znajomości,
// małe litery, robot, ułamki, klucze, ranking, lower_bound na parach).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./zbior-pomoc');
    const { Zbior, cmpPar, rozne, unikalne } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const losy = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const calk = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;
    // „n q”, potem n liczb w wierszu, potem q pytań w osobnych wierszach
    const zPytaniami = (a, q) => `${a.length} ${q.length}\n${a.join(' ')}\n${q.join('\n')}`;
    const czytajZP = (inp) => { const t = nums(inp); const [n, q] = t; return { a: t.slice(2, 2 + n), q: t.slice(2 + n, 2 + n + q) }; };
    const sprawdzZP = (inp, maxN, maxQ, lo, hi, qlo, qhi) => { const t = nums(inp); const [n, q] = t; if (!calk(n, 1, maxN) || !calk(q, 1, maxQ) || t.length !== 2 + n + q) return 'n, q'; if (!t.slice(2, 2 + n).every((x) => calk(x, lo, hi))) return 'liczba'; return t.slice(2 + n).every((x) => calk(x, qlo, qhi)) ? null : 'pytanie'; };
    const dwieListy = (a, b) => `${a.length} ${b.length}\n${a.join(' ')}\n${b.join(' ')}`;
    const czytajDL = (inp) => { const t = nums(inp); const [n, m] = t; return { A: t.slice(2, 2 + n), B: t.slice(2 + n, 2 + n + m) }; };
    const sprawdzDL = (inp, maxN, lo, hi) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, maxN) || !calk(m, 1, maxN) || t.length !== 2 + n + m) return 'n, m'; return t.slice(2).every((x) => calk(x, lo, hi)) ? null : 'zakres'; };

    return [
        // ================================================================ KROK 4 · szukanie
        {
            id: 'zb-basen', krok: 4, level: 'latwe',
            title: 'Najbliższy dzień otwarcia',
            short: 'Basen jest otwarty w wybrane dni. Kiedy najwcześniej popływasz, jeśli przyjdziesz w dniu d? lower_bound.',
            tags: ['lower_bound', 'end()', 'pytania'],
            statement: ['Basen jest otwarty tylko w wybrane dni (numery dni od początku roku szkolnego; ten sam dzień mógł zostać zapisany kilka razy). Dla każdego z q pytań d wypisz numer pierwszego dnia otwarcia, który jest nie wcześniejszy niż d — albo ZAMKNIETE, jeśli po dniu d basen już nie będzie otwarty.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n numerów dni otwarcia.', 'W każdym z następnych q wierszy jedno pytanie d.'],
            output_format: ['q wierszy — numer dnia albo ZAMKNIETE.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ q ≤ 2500', '1 ≤ numer dnia ≤ 10⁶', '1 ≤ d ≤ 10⁶'],
            examples: [{ input: '4 4\n10 3 25 10\n1\n10\n11\n26', note: 'Dni otwarcia to 3, 10 i 25. Kto przyjdzie w dniu 10, popływa od razu. Po dniu 25 basen jest zamknięty.' }],
            hint: R`Wstaw dni otwarcia do zbioru. Dla pytania d weź auto it = s.lower_bound(d) — pierwszy dzień ≥ d. Jeśli it == s.end(), wypisz ZAMKNIETE, a w przeciwnym razie *it. Pamiętaj: lower_bound z kropką, jako polecenie zbioru.`,
            tests: (r) => [zPytaniami([5], [5]), zPytaniami([5], [6]), zPytaniami([1, 1, 1], [1, 2]), zPytaniami(losy(r, 10, 1, 50), losy(r, 20, 1, 60)), zPytaniami(losy(r, 1000, 1, 1e6), losy(r, 1000, 1, 1e6)),
                zPytaniami(losy(r, 5000, 1, 1e6), losy(r, 2500, 1, 1e6)), zPytaniami(losy(r, 5000, 1, 1000), losy(r, 2500, 1, 1e6))],
            check: (inp) => sprawdzZP(inp, 5000, 2500, 1, 1e6, 1, 1e6),
            solve: (inp) => { const { a, q } = czytajZP(inp); const s = new Zbior(); a.forEach((x) => s.add(x)); return q.map((d) => { const i = s.lower(d); return i < s.size ? String(s.a[i]) : 'ZAMKNIETE'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    set<int> dni;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        dni.insert(x);
    }
    while (q--) {
        int d;
        cin >> d;
        auto it = dni.lower_bound(d);
        if (it == dni.end()) cout << "ZAMKNIETE\n";
        else cout << *it << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-ostatni-autobus', krok: 4, level: 'latwe',
            title: 'Ostatni autobus',
            short: 'O której odjechał ostatni autobus nie później niż t? upper_bound i krok w lewo.',
            tags: ['upper_bound', 'prev', 'begin()'],
            statement: ['Z przystanku odjeżdżają autobusy — znasz ich godziny odjazdów, zapisane w sekundach od początku tygodnia (niektóre godziny zapisano dwa razy). Spóźnieni uczniowie przychodzą na przystanek i każdy pyta: o której odjechał ostatni autobus nie później niż w sekundzie t, kiedy przyszedłem?',
                'Dla każdego pytania t wypisz największą godzinę odjazdu, która jest ≤ t, albo BRAK, jeśli przed t żaden autobus nie odjechał.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n godzin odjazdów.', 'W każdym z następnych q wierszy jedno pytanie t.'],
            output_format: ['q wierszy — godzina odjazdu albo BRAK.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ q ≤ 3000', '0 ≤ godzina odjazdu, t ≤ 604 800'],
            examples: [{ input: '5 4\n100 400 250 100 900\n50\n100\n399\n1000', note: 'Kto przyjdzie w sekundzie 50, nie zdążył na nic — przed nim nic nie odjechało. W sekundzie 100 autobus odjeżdża właśnie teraz, więc się liczy. Dla 399 ostatni odjazd był o 250.' }],
            hint: R`upper_bound(t) wskazuje pierwszy odjazd PÓŹNIEJSZY niż t. Ostatni odjazd ≤ t stoi tuż przed nim: *prev(it). Ale jeśli it == s.begin(), to wszystkie odjazdy są późniejsze niż t — wypisz BRAK. Bez tego sprawdzenia prev(begin()) to błąd.`,
            tests: (r) => [zPytaniami([0], [0]), zPytaniami([10], [9]), zPytaniami([5, 5], [4, 5, 6]), zPytaniami(losy(r, 10, 0, 100), losy(r, 20, 0, 120)), zPytaniami(losy(r, 2000, 0, 604800), losy(r, 2000, 0, 604800)),
                zPytaniami(losy(r, 5000, 0, 604800), losy(r, 3000, 0, 604800)), zPytaniami(losy(r, 5000, 300000, 604800), losy(r, 3000, 0, 604800))],
            check: (inp) => sprawdzZP(inp, 5000, 3000, 0, 604800, 0, 604800),
            solve: (inp) => { const { a, q } = czytajZP(inp); const s = new Zbior(); a.forEach((x) => s.add(x)); return q.map((t) => { const i = s.upper(t); return i > 0 ? String(s.a[i - 1]) : 'BRAK'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    set<int> odjazdy;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        odjazdy.insert(x);
    }
    while (q--) {
        int t;
        cin >> t;
        auto it = odjazdy.upper_bound(t);
        if (it == odjazdy.begin()) cout << "BRAK\n";
        else cout << *prev(it) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-sasiedzi-wartosci', krok: 4, level: 'latwe',
            title: 'Mniejszy i większy sąsiad',
            short: 'Dla x podaj największy element mniejszy od x i najmniejszy większy od x — ściśle!',
            tags: ['prev(lower_bound)', 'upper_bound', 'ściśle mniejszy / większy'],
            statement: ['Dostajesz n liczb (mogą się powtarzać) i q pytań. Dla każdego pytania x wypisz dwie wartości: największą liczbę z listy, która jest ściśle mniejsza od x, i najmniejszą liczbę z listy, która jest ściśle większa od x. Gdy takiej liczby nie ma, w jej miejscu wypisz znak -.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W każdym z następnych q wierszy jedno pytanie x.'],
            output_format: ['q wierszy — w każdym dwie wartości (liczby albo -) oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 4000', '1 ≤ q ≤ 1500', '−10⁶ ≤ każda liczba, x ≤ 10⁶'],
            examples: [{ input: '5 3\n3 8 15 21 30\n15\n2\n31', note: 'Dla 15: mniejsze to 3 i 8 (największa 8), większe — 21 i 30 (najmniejsza 21). Sama piętnastka się nie liczy, bo ma być ściśle. Dla 2 nic nie jest mniejsze.' }],
            hint: R`Największy element < x stoi tuż przed lower_bound(x): sprawdź, czy lower_bound nie jest begin(), i cofnij strzałkę. Najmniejszy element > x to upper_bound(x) — sprawdź, czy nie jest end(). Nie myl lower z upper: dla x obecnego w zbiorze dają różne miejsca.`,
            tests: (r) => [zPytaniami([0], [0]), zPytaniami([0], [-1, 1]), zPytaniami([5, 5, 5], [5, 4, 6]), zPytaniami(losy(r, 10, -20, 20), losy(r, 30, -25, 25)), zPytaniami(losy(r, 4000, -1e6, 1e6), losy(r, 1500, -1e6, 1e6)), zPytaniami(losy(r, 4000, -100, 100), losy(r, 1500, -120, 120))],
            check: (inp) => sprawdzZP(inp, 4000, 1500, -1e6, 1e6, -1e6, 1e6),
            solve: (inp) => { const { a, q } = czytajZP(inp); const s = new Zbior(); a.forEach((x) => s.add(x)); return q.map((x) => { const lo = s.lower(x), up = s.upper(x); return `${lo > 0 ? s.a[lo - 1] : '-'} ${up < s.size ? s.a[up] : '-'}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    while (q--) {
        int x;
        cin >> x;
        auto lo = s.lower_bound(x);
        if (lo == s.begin()) cout << "- ";
        else cout << *prev(lo) << " ";
        auto up = s.upper_bound(x);
        if (up == s.end()) cout << "-\n";
        else cout << *up << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-najblizej', krok: 4, level: 'srednie',
            title: 'Najbliższa liczba w rosnącym zbiorze',
            short: 'Liczby dochodzą, a w międzyczasie pytamy o najbliższą. Dwóch kandydatów i remis dla mniejszej.',
            tags: ['lower_bound', 'dwóch kandydatów', 'long long'],
            statement: ['Na początku zbiór jest pusty. Wykonaj q poleceń:',
                'DODAJ x — wstaw x do zbioru,',
                'NAJBLIZEJ x — wypisz liczbę ze zbioru najbliższą x (jeśli dwie są tak samo blisko — mniejszą z nich), albo PUSTY, jeśli zbiór jest pusty.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie i liczba x.'],
            output_format: ['Odpowiedzi na polecenia NAJBLIZEJ, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 5000', '−10⁹ ≤ x ≤ 10⁹', 'Jest co najmniej jedno polecenie NAJBLIZEJ.'],
            examples: [{ input: '6\nDODAJ 10\nNAJBLIZEJ 3\nDODAJ 20\nNAJBLIZEJ 15\nNAJBLIZEJ 16\nNAJBLIZEJ 100', note: 'Dla 15 liczby 10 i 20 są tak samo blisko — wygrywa mniejsza, 10. Dla 16 bliżej jest 20.' }],
            hint: R`Kandydaci to it = s.lower_bound(x) (pierwszy ≥ x) i element przed nim (ostatni < x). Rozpatrz trzy przypadki: it == s.end() (jest tylko kandydat z lewej), it == s.begin() (tylko z prawej) i oba. Odległości licz w long long: x − lewy może sięgać 2 · 10⁹, a to więcej niż mieści int.`,
            tests: (r) => {
                const t = (q, hi) => { const w = []; for (let i = 0; i < q; i++) w.push(`${r() < 0.5 ? 'DODAJ' : 'NAJBLIZEJ'} ${r.int(-hi, hi)}`); if (!w.some((x) => x.startsWith('N'))) w[q - 1] = `NAJBLIZEJ 0`; return `${q}\n${w.join('\n')}`; };
                return ['1\nNAJBLIZEJ 5', '3\nDODAJ -1000000000\nDODAJ 1000000000\nNAJBLIZEJ 0', '3\nDODAJ 1000000000\nNAJBLIZEJ -1000000000\nNAJBLIZEJ 999999999', '4\nDODAJ 4\nDODAJ 8\nNAJBLIZEJ 6\nNAJBLIZEJ 7', t(30, 20), t(1000, 1e6), t(5000, 1e9), t(5000, 50)];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 5000) || t.length !== 1 + 2 * q) return 'q'; let pyt = 0; for (let i = 0; i < q; i++) { const p = t[1 + 2 * i]; if (p === 'NAJBLIZEJ') pyt++; else if (p !== 'DODAJ') return 'polecenie'; if (!calk(Number(t[2 + 2 * i]), -1e9, 1e9)) return 'x'; } return pyt ? null : 'brak pytań'; },
            solve: (inp) => {
                const t = toks(inp); const s = new Zbior(); const out = [];
                for (let i = 0; i < Number(t[0]); i++) {
                    const x = Number(t[2 + 2 * i]);
                    if (t[1 + 2 * i] === 'DODAJ') { s.add(x); continue; }
                    if (!s.size) { out.push('PUSTY'); continue; }
                    const k = s.lower(x); let odp;
                    if (k === s.size) odp = s.a[k - 1]; else if (k === 0) odp = s.a[0]; else odp = x - s.a[k - 1] <= s.a[k] - x ? s.a[k - 1] : s.a[k];
                    out.push(String(odp));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<long long> s;
    while (q--) {
        string p;
        long long x;
        cin >> p >> x;
        if (p == "DODAJ") {
            s.insert(x);
            continue;
        }
        if (s.empty()) {
            cout << "PUSTY\n";
            continue;
        }
        auto it = s.lower_bound(x);
        long long odp;
        if (it == s.end()) odp = *prev(it);
        else if (it == s.begin()) odp = *it;
        else {
            long long prawy = *it, lewy = *prev(it);
            if (x - lewy <= prawy - x) odp = lewy;
            else odp = prawy;
        }
        cout << odp << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-nowy-w-szeregu', krok: 4, level: 'srednie',
            title: 'Nowy w szeregu',
            short: 'Uczniowie dołączają do szeregu według wzrostu. Kto stoi obok nowego? insert().first i sąsiedzi.',
            tags: ['insert().first', 'prev i next', 'brzegi'],
            statement: ['Na WF-ie uczniowie ustawiają się w szeregu od najniższego do najwyższego, ale przychodzą po kolei, jeden po drugim. Każdy nowy wchodzi w szereg na swoje miejsce według wzrostu (wszystkie wzrosty są różne).',
                'Po przyjściu każdego ucznia wypisz wzrost jego lewego sąsiada (najwyższego z niższych) i prawego sąsiada (najniższego z wyższych). Gdy sąsiada z którejś strony nie ma, wypisz w jego miejscu znak -.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych wzrostów, w kolejności przychodzenia.'],
            output_format: ['n wierszy — w każdym wzrost lewego i prawego sąsiada (albo -).'],
            constraints: ['1 ≤ n ≤ 1500', '1 ≤ wzrost ≤ 10⁶ (wszystkie różne)'],
            examples: [{ input: '5\n160 150 170 155 165', note: 'Pierwszy stoi sam. 150 staje na lewym końcu, obok 160. 155 wchodzi między 150 a 160, a 165 — między 160 a 170.' }],
            hint: R`auto it = s.insert(x).first; daje strzałkę na nowego ucznia. Lewy sąsiad to *prev(it) — o ile it != s.begin(). Prawy to *next(it) — o ile next(it) != s.end().`,
            tests: (r) => {
                const t = (n, hi) => `${n}\n${unikalne(r, n, () => r.int(1, hi)).join(' ')}`;
                return ['1\n100', '2\n5 3', '3\n1 2 3', '3\n3 2 1', t(10, 30), t(300, 1e6), t(1500, 1e6), t(1500, 1600)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 1500) || t.length !== n + 1) return 'n'; const a = t.slice(1); if (!a.every((x) => calk(x, 1, 1e6))) return 'zakres'; return new Set(a).size === n ? null : 'powtórzony wzrost'; },
            solve: (inp) => { const s = new Zbior(); return nums(inp).slice(1).map((x) => { s.add(x); const i = s.lower(x); return `${i > 0 ? s.a[i - 1] : '-'} ${i + 1 < s.size ? s.a[i + 1] : '-'}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        auto it = s.insert(x).first;
        if (it == s.begin()) cout << "- ";
        else cout << *prev(it) << " ";
        if (next(it) == s.end()) cout << "-\n";
        else cout << *next(it) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-stacje', krok: 4, level: 'srednie',
            title: 'Stacje ładowania',
            short: 'Stacje powstają i znikają. Gdzie jest pierwsza stacja na prawo od x? Zbiór zmienia się między pytaniami.',
            tags: ['insert i erase', 'lower_bound', 'dane się zmieniają'],
            statement: ['Wzdłuż autostrady budowane są stacje ładowania aut elektrycznych (pozycja to liczba całkowita w metrach od początku drogi). Wykonaj q poleceń:',
                'BUDUJ x — powstaje stacja na pozycji x (gdy tam już jest, nic się nie zmienia),',
                'BURZ x — stacja na pozycji x znika (gdy jej nie ma, nic się nie dzieje),',
                'JADE x — kierowca rusza z pozycji x w stronę rosnących pozycji; wypisz pozycję pierwszej stacji, którą spotka (stacja na pozycji x też się liczy), albo BRAK.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie i liczba x.'],
            output_format: ['Odpowiedzi na polecenia JADE, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 5000', '0 ≤ x ≤ 10⁹', 'Jest co najmniej jedno polecenie JADE.'],
            examples: [{ input: '7\nBUDUJ 50\nBUDUJ 20\nJADE 21\nBURZ 50\nJADE 21\nJADE 20\nJADE 0', note: 'Po zburzeniu stacji 50 za pozycją 21 nie ma już żadnej stacji. Stacja na pozycji 20 liczy się dla kierowcy, który rusza właśnie z 20.' }],
            hint: R`Zbiór pozycji stacji: BUDUJ to insert, BURZ to erase, a JADE to lower_bound(x) — pierwsza stacja ≥ x — ze sprawdzeniem end(). Zbiór zmienia się między pytaniami, więc posortowany raz vector by nie wystarczył.`,
            tests: (r) => {
                const t = (q, hi) => { const w = []; const by = []; for (let i = 0; i < q; i++) { const p = r.pick(['BUDUJ', 'BUDUJ', 'BURZ', 'JADE', 'JADE']); const x = p === 'BURZ' && by.length && r() < 0.8 ? r.pick(by) : r.int(0, hi); if (p === 'BUDUJ') by.push(x); w.push(`${p} ${x}`); } if (!w.some((x) => x.startsWith('J'))) w[q - 1] = 'JADE 0'; return `${q}\n${w.join('\n')}`; };
                return ['1\nJADE 0', '2\nBUDUJ 0\nJADE 0', '3\nBUDUJ 5\nBURZ 5\nJADE 1', '4\nBUDUJ 1000000000\nJADE 999999999\nJADE 1000000000\nBURZ 7', t(30, 50), t(1000, 1e5), t(5000, 1e9), t(5000, 30)];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 5000) || t.length !== 1 + 2 * q) return 'q'; let pyt = 0; for (let i = 0; i < q; i++) { const p = t[1 + 2 * i]; if (p === 'JADE') pyt++; else if (p !== 'BUDUJ' && p !== 'BURZ') return 'polecenie'; if (!calk(Number(t[2 + 2 * i]), 0, 1e9)) return 'x'; } return pyt ? null : 'brak pytań'; },
            solve: (inp) => { const t = toks(inp); const s = new Zbior(); const out = []; for (let i = 0; i < Number(t[0]); i++) { const p = t[1 + 2 * i], x = Number(t[2 + 2 * i]); if (p === 'BUDUJ') s.add(x); else if (p === 'BURZ') s.del(x); else { const k = s.lower(x); out.push(k < s.size ? String(s.a[k]) : 'BRAK'); } } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<int> stacje;
    while (q--) {
        string p;
        int x;
        cin >> p >> x;
        if (p == "BUDUJ") stacje.insert(x);
        else if (p == "BURZ") stacje.erase(x);
        else {
            auto it = stacje.lower_bound(x);
            if (it == stacje.end()) cout << "BRAK\n";
            else cout << *it << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-szafki', krok: 4, level: 'trudne',
            title: 'Szafki na basenie',
            short: 'Zbiór WOLNYCH szafek: pierwsza wolna ≥ p, a gdy brak — od początku. Oddana szafka wraca do zbioru.',
            tags: ['zbiór wolnych miejsc', 'lower_bound', 'zawijanie do begin()'],
            statement: ['W szatni basenu jest n szafek o numerach od 1 do n, na początku wszystkie wolne. Przychodzą pływacy i oddają klucze:',
                'PRZYCHODZI p — pływak chce szafkę p. Jeśli jest zajęta, bierze pierwszą wolną szafkę o numerze większym od p, a jeśli takiej nie ma — pierwszą wolną szafkę od początku (o najmniejszym numerze). Wypisz numer szafki, którą dostał, albo 0, jeśli wszystkie są zajęte (wtedy pływak odchodzi bez szafki).',
                'ODDAJE k — szafka k się zwalnia (dane są poprawne: szafka k była zajęta).'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z następnych q wierszy polecenie i liczba.'],
            output_format: ['Odpowiedzi na polecenia PRZYCHODZI, każda w osobnym wierszu.'],
            constraints: ['1 ≤ n ≤ 100 000', '1 ≤ q ≤ 5000', '1 ≤ p, k ≤ n', 'Jest co najmniej jedno polecenie PRZYCHODZI.'],
            examples: [{ input: '5 6\nPRZYCHODZI 4\nPRZYCHODZI 4\nPRZYCHODZI 5\nODDAJE 4\nPRZYCHODZI 5\nPRZYCHODZI 2', note: 'Drugi pływak dostaje 5, bo 4 jest zajęta. Trzeci chce 5, za nią nic wolnego — dostaje pierwszą wolną od początku: 1. Po oddaniu czwórki wolne są 2, 3, 4: pływak, który chce 5, dostaje 2, a ostatni, który chce 2 (zajętą), dostaje 3.' }],
            hint: R`Trzymaj zbiór WOLNYCH szafek — na początku wstaw do niego wszystkie od 1 do n. Przy PRZYCHODZI: jeśli zbiór jest pusty, wypisz 0. W przeciwnym razie it = s.lower_bound(p); gdy it == s.end(), weź it = s.begin(). Wypisz *it i usuń tę szafkę ze zbioru wolnych. ODDAJE k to po prostu insert(k).`,
            tests: (r) => {
                // symulacja w trakcie losowania: ODDAJE oddaje tylko szafki, które naprawdę są zajęte
                const t = (n, q) => {
                    const wolne = new Zbior(); wolne.a = Array.from({ length: n }, (_, i) => i + 1); const zaj = []; const w = [];
                    for (let i = 0; i < q; i++) {
                        if (zaj.length && r() < 0.3) { const k = zaj.splice(r.int(0, zaj.length - 1), 1)[0]; wolne.add(k); w.push(`ODDAJE ${k}`); continue; }
                        const p = r.int(1, n); w.push(`PRZYCHODZI ${p}`);
                        if (wolne.size) { let j = wolne.lower(p); if (j === wolne.size) j = 0; zaj.push(wolne.a[j]); wolne.a.splice(j, 1); }
                    }
                    return `${n} ${q}\n${w.join('\n')}`;
                };
                return ['1 1\nPRZYCHODZI 1', '1 3\nPRZYCHODZI 1\nPRZYCHODZI 1\nODDAJE 1', '3 4\nPRZYCHODZI 3\nPRZYCHODZI 3\nPRZYCHODZI 3\nPRZYCHODZI 3', t(5, 20), t(30, 100), t(100, 400), t(100000, 2000), t(1000, 1500)];
            },
            check: (inp) => {
                const t = toks(inp); const [n, q] = [Number(t[0]), Number(t[1])]; if (!calk(n, 1, 1e5) || !calk(q, 1, 5000) || t.length !== 2 + 2 * q) return 'n, q';
                const wolne = new Zbior(); wolne.a = Array.from({ length: n }, (_, i) => i + 1); let pyt = 0;
                for (let i = 0; i < q; i++) { const c = t[2 + 2 * i], k = Number(t[3 + 2 * i]); if (!calk(k, 1, n)) return 'numer'; if (c === 'ODDAJE') { if (wolne.has(k)) return 'oddaje wolną szafkę'; wolne.add(k); } else if (c === 'PRZYCHODZI') { pyt++; if (wolne.size) { let j = wolne.lower(k); if (j === wolne.size) j = 0; wolne.a.splice(j, 1); } } else return 'polecenie'; }
                return pyt ? null : 'brak PRZYCHODZI';
            },
            solve: (inp) => {
                const t = toks(inp); const [n, q] = [Number(t[0]), Number(t[1])]; const wolne = new Zbior(); wolne.a = Array.from({ length: n }, (_, i) => i + 1); const out = [];
                for (let i = 0; i < q; i++) { const c = t[2 + 2 * i], k = Number(t[3 + 2 * i]); if (c === 'ODDAJE') wolne.add(k); else if (!wolne.size) out.push('0'); else { let j = wolne.lower(k); if (j === wolne.size) j = 0; out.push(String(wolne.a[j])); wolne.a.splice(j, 1); } }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    set<int> wolne;
    for (int i = 1; i <= n; i++) wolne.insert(i);
    while (q--) {
        string p;
        int k;
        cin >> p >> k;
        if (p == "ODDAJE") {
            wolne.insert(k);
            continue;
        }
        if (wolne.empty()) {
            cout << 0 << "\n";
            continue;
        }
        auto it = wolne.lower_bound(k);
        if (it == wolne.end()) it = wolne.begin();
        cout << *it << "\n";
        wolne.erase(it);
    }
    return 0;
}`,
        },
        {
            id: 'zb-najmniejsza-roznica', krok: 4, level: 'trudne',
            title: 'Najmniejsza różnica na żywo',
            short: 'Po każdej nowej liczbie: najmniejsza różnica między dwiema liczbami w zbiorze. Liczą się tylko sąsiedzi nowej.',
            tags: ['insert().first', 'sąsiedzi nowego', 'bieżące minimum'],
            statement: ['Liczby (wszystkie różne) przychodzą po kolei i trafiają do zbioru. Po każdej nowej liczbie wypisz najmniejszą różnicę między dwiema liczbami, które są już w zbiorze. Po pierwszej liczbie różnicy jeszcze nie ma — wypisz wtedy znak -.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb, w kolejności przychodzenia.'],
            output_format: ['n wierszy — najmniejsza różnica po każdej liczbie (w pierwszym wierszu -).'],
            constraints: ['1 ≤ n ≤ 3000', '0 ≤ liczba ≤ 10⁹ (wszystkie różne)'],
            examples: [{ input: '5\n10 50 30 32 1', note: 'Po 50: różnica 40. Po 30: najbliższe są 30 i 10 albo 30 i 50 — różnica 20. Po 32: 32 − 30 = 2. Jedynka nic nie poprawia (1 jest 9 od 10).' }],
            hint: R`Sprawdzanie wszystkich par po każdej liczbie byłoby wolne. Zauważ, że nowa liczba może poprawić wynik tylko z jednym ze swoich sąsiadów w zbiorze — z najbliższą mniejszą albo najbliższą większą. Trzymaj bieżące minimum (na start bardzo duża liczba) i po każdym insert sprawdź tylko różnice z *prev(it) i *next(it) (pilnując brzegów).`,
            tests: (r) => {
                const t = (n, hi) => `${n}\n${unikalne(r, n, () => r.int(0, hi)).join(' ')}`;
                return ['1\n7', '2\n0 1000000000', '3\n1 2 3', '4\n100 1 50 51', t(20, 100), t(1000, 1e9), t(3000, 1e9), t(3000, 5000)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 3000) || t.length !== n + 1) return 'n'; const a = t.slice(1); if (!a.every((x) => calk(x, 0, 1e9))) return 'zakres'; return new Set(a).size === n ? null : 'powtórka'; },
            solve: (inp) => { const s = new Zbior(); let best = Infinity; return nums(inp).slice(1).map((x) => { s.add(x); const i = s.lower(x); if (i > 0) best = Math.min(best, x - s.a[i - 1]); if (i + 1 < s.size) best = Math.min(best, s.a[i + 1] - x); return best === Infinity ? '-' : String(best); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    int najmn = INT_MAX;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        auto it = s.insert(x).first;
        if (it != s.begin()) najmn = min(najmn, x - *prev(it));
        if (next(it) != s.end()) najmn = min(najmn, *next(it) - x);
        if (najmn == INT_MAX) cout << "-\n";
        else cout << najmn << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · działania na zbiorach
        {
            id: 'zb-wspolne-gry', krok: 5, level: 'latwe',
            title: 'Wspólne gry',
            short: 'Ala i Ola mają swoje listy gier. W które gry mogą zagrać razem? Część wspólna.',
            tags: ['część wspólna', 'count', 'BRAK'],
            statement: ['Ala ma na komputerze n gier, a Ola — m gier (każda gra ma numer; listy mogą zawierać powtórki). Wypisz rosnąco numery gier, które mają obie dziewczyny, w jednym wierszu oddzielone spacjami. Jeśli nie mają ani jednej wspólnej gry, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n numerów gier Ali.', 'W trzecim wierszu m numerów gier Oli.'],
            output_format: ['Numery wspólnych gier rosnąco albo BRAK.'],
            constraints: ['1 ≤ n, m ≤ 3000', '1 ≤ numer gry ≤ 10⁶'],
            examples: [{ input: '5 4\n10 3 7 3 15\n7 15 2 10', note: 'Wspólne są gry 7, 10 i 15.' }],
            hint: R`Wczytaj obie listy do dwóch zbiorów A i B. Przejdź zbiór A pętlą i wypisz każdy x, dla którego B.count(x) jest równe 1. Zapamiętaj, czy cokolwiek wypisałeś — jeśli nie, wypisz BRAK.`,
            tests: (r) => [dwieListy([1], [1]), dwieListy([1], [2]), dwieListy([5, 5, 5], [5]), dwieListy(losy(r, 10, 1, 15), losy(r, 10, 1, 15)), dwieListy(losy(r, 1000, 1, 2000), losy(r, 1000, 1, 2000)),
                dwieListy(losy(r, 3000, 1, 1e6), losy(r, 3000, 1, 1e6)), dwieListy(losy(r, 3000, 1, 3000), losy(r, 3000, 1, 3000)), dwieListy(losy(r, 3000, 1, 500), losy(r, 3000, 501, 1000))],
            check: (inp) => sprawdzDL(inp, 3000, 1, 1e6),
            solve: (inp) => { const { A, B } = czytajDL(inp); const sB = new Set(B); const w = rozne(A).filter((x) => sB.has(x)); return w.length ? w.join(' ') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    set<int> A, B;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        A.insert(x);
    }
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        B.insert(x);
    }
    bool cos = false;
    for (int x : A)
        if (B.count(x)) {
            cout << x << " ";
            cos = true;
        }
    if (!cos) cout << "BRAK";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-razem', krok: 5, level: 'latwe',
            title: 'Wszystkie naklejki razem',
            short: 'Dwie kolekcje łączą się w jedną. Ile różnych naklejek mają razem i jakie? Suma zbiorów.',
            tags: ['suma zbiorów', 'insert z obu', 'size()'],
            statement: ['Bracia Kuba i Tomek łączą swoje kolekcje naklejek. Kuba ma n naklejek, Tomek m (numery mogą się powtarzać, także między braćmi). Ile różnych naklejek będzie w połączonej kolekcji? Wypisz ich liczbę, a potem numery rosnąco.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n numerów naklejek Kuby.', 'W trzecim wierszu m numerów naklejek Tomka.'],
            output_format: ['W pierwszym wierszu liczba różnych naklejek.', 'W drugim wierszu ich numery rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n, m ≤ 1500', '1 ≤ numer ≤ 10⁶'],
            examples: [{ input: '3 4\n5 1 5\n2 5 9 1', note: 'Razem: 1, 2, 5, 9 — cztery różne naklejki.' }],
            hint: R`Wystarczy jeden zbiór: wstaw do niego wszystkie naklejki Kuby i wszystkie naklejki Tomka. Powtórki odpadną same. Wypisz size() i przejdź zbiór pętlą.`,
            tests: (r) => [dwieListy([7], [7]), dwieListy([1], [2]), dwieListy([3, 2, 1], [1, 2, 3]), dwieListy(losy(r, 10, 1, 12), losy(r, 10, 1, 12)), dwieListy(losy(r, 1500, 1, 1e6), losy(r, 1500, 1, 1e6)), dwieListy(losy(r, 1500, 1, 1000), losy(r, 1500, 500, 1500))],
            check: (inp) => sprawdzDL(inp, 1500, 1, 1e6),
            solve: (inp) => { const { A, B } = czytajDL(inp); const w = rozne([...A, ...B]); return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    set<int> s;
    for (int i = 0; i < n + m; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    cout << s.size() << "\n";
    for (int x : s) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-czego-nie-ma', krok: 5, level: 'latwe',
            title: 'Czego nie ma druga?',
            short: 'Które naklejki Ali są nowe dla Oli? Różnica A \\ B — kolejność zbiorów ma znaczenie.',
            tags: ['różnica A \\ B', '!count', 'BRAK'],
            statement: ['Ala chce podarować Oli naklejki, ale tylko takie, których Ola jeszcze nie ma. Wypisz rosnąco różne numery naklejek, które ma Ala, a których nie ma Ola — w jednym wierszu, oddzielone spacjami. Jeśli takich nie ma, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n numerów naklejek Ali.', 'W trzecim wierszu m numerów naklejek Oli.'],
            output_format: ['Numery naklejek rosnąco albo BRAK.'],
            constraints: ['1 ≤ n, m ≤ 3000', '1 ≤ numer ≤ 10⁶'],
            examples: [{ input: '5 3\n4 1 9 4 6\n6 2 4', note: 'Ala ma 1, 4, 6, 9. Ola ma już 4 i 6. Nowe dla Oli są 1 i 9 (dwójka Oli nie ma znaczenia).' }],
            hint: R`To różnica zbiorów A \ B: przejdź zbiór naklejek Ali i wypisz te x, dla których !B.count(x). Uważaj, który zbiór przechodzisz — B \ A to coś zupełnie innego.`,
            tests: (r) => [dwieListy([1], [1]), dwieListy([1], [2]), dwieListy([2, 2, 3], [3]), dwieListy(losy(r, 10, 1, 15), losy(r, 10, 1, 15)), dwieListy(losy(r, 3000, 1, 1e6), losy(r, 3000, 1, 1e6)), dwieListy(losy(r, 3000, 1, 4000), losy(r, 3000, 1, 4000)), dwieListy(losy(r, 3000, 1, 300), losy(r, 3000, 1, 300))],
            check: (inp) => sprawdzDL(inp, 3000, 1, 1e6),
            solve: (inp) => { const { A, B } = czytajDL(inp); const sB = new Set(B); const w = rozne(A).filter((x) => !sB.has(x)); return w.length ? w.join(' ') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    set<int> A, B;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        A.insert(x);
    }
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        B.insert(x);
    }
    bool cos = false;
    for (int x : A)
        if (!B.count(x)) {
            cout << x << " ";
            cos = true;
        }
    if (!cos) cout << "BRAK";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-dokladnie-u-jednego', krok: 5, level: 'latwe',
            title: 'Dokładnie u jednego',
            short: 'Które numery ma tylko jeden z dwóch braci? Różnica symetryczna.',
            tags: ['różnica symetryczna', 'dwie różnice', 'size()'],
            statement: ['Kuba ma n naklejek, Tomek m. Które numery naklejek ma dokładnie jeden z nich (Kuba albo Tomek, ale nie obaj)? Wypisz, ile jest takich numerów, a potem same numery rosnąco.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n numerów naklejek Kuby.', 'W trzecim wierszu m numerów naklejek Tomka.'],
            output_format: ['W pierwszym wierszu liczba takich numerów.', 'W drugim wierszu te numery rosnąco (pusty wiersz, jeśli ich nie ma).'],
            constraints: ['1 ≤ n, m ≤ 1500', '1 ≤ numer ≤ 10⁶'],
            examples: [{ input: '4 4\n1 2 3 4\n3 4 5 6', note: 'Tylko Kuba ma 1 i 2, tylko Tomek — 5 i 6. Trójkę i czwórkę mają obaj.' }],
            hint: R`Zbuduj zbiory A i B. Do nowego zbioru W wstaw elementy A, których nie ma w B, i elementy B, których nie ma w A. W ułoży je rosnąco. Wypisz W.size() i jego elementy.`,
            tests: (r) => [dwieListy([1], [1]), dwieListy([1], [2]), dwieListy([1, 2, 3], [3, 2, 1]), dwieListy(losy(r, 10, 1, 12), losy(r, 10, 1, 12)), dwieListy(losy(r, 1500, 1, 1e6), losy(r, 1500, 1, 1e6)), dwieListy(losy(r, 1500, 1, 1000), losy(r, 1500, 1, 1000))],
            check: (inp) => sprawdzDL(inp, 1500, 1, 1e6),
            solve: (inp) => { const { A, B } = czytajDL(inp); const sA = new Set(A), sB = new Set(B); const w = rozne([...A.filter((x) => !sB.has(x)), ...B.filter((x) => !sA.has(x))]); return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    set<int> A, B;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        A.insert(x);
    }
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        B.insert(x);
    }
    set<int> W;
    for (int x : A) if (!B.count(x)) W.insert(x);
    for (int x : B) if (!A.count(x)) W.insert(x);
    cout << W.size() << "\n";
    for (int x : W) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-relacja', krok: 5, level: 'srednie',
            title: 'Podzbiór czy nie?',
            short: 'Równe, podzbiór, nadzbiór, rozłączne czy nic z tego? Kilka par zbiorów do sprawdzenia.',
            tags: ['A == B', 'podzbiór', 'rozłączność', 'kilka testów'],
            statement: ['Dostajesz t par list liczb. Z każdej pary list tworzysz zbiory A i B (powtórki znikają). Dla każdej pary wypisz jedno słowo:',
                'ROWNE — gdy A i B mają dokładnie te same elementy,',
                'PODZBIOR — gdy każdy element A jest w B, ale B ma też coś, czego nie ma A,',
                'NADZBIOR — gdy każdy element B jest w A, ale A ma też coś, czego nie ma B,',
                'ROZLACZNE — gdy A i B nie mają żadnego wspólnego elementu,',
                'INNE — w pozostałych przypadkach.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każda para to trzy wiersze: liczby n i m, potem n liczb pierwszej listy i m liczb drugiej listy.'],
            output_format: ['t wierszy — w każdym jedno słowo.'],
            constraints: ['1 ≤ t ≤ 50', '1 ≤ n, m ≤ 1000', 'Suma wszystkich n i m ≤ 20 000', '1 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '4\n3 2\n1 2 3\n2 1\n2 3\n5 6\n7 8 9\n1 1\n4\n4\n2 3\n1 2\n2 1 3', note: 'Pierwsza para: B = {1, 2} mieści się w A = {1, 2, 3} — A jest nadzbiorem B. Druga: nic wspólnego. Trzecia: oba to {4}. Czwarta: {1, 2} mieści się w {1, 2, 3}.' }],
            hint: R`Najpierw sprawdź równość: A == B. Potem policz, ile elementów A jest w B (wspolne). Jeśli wspolne == A.size(), to A ⊆ B — a skoro nie są równe, to PODZBIOR. Jeśli wspolne == B.size(), to NADZBIOR. Jeśli wspolne == 0 — ROZLACZNE. W pozostałych przypadkach — INNE. Pamiętaj o nowych zbiorach dla każdej pary.`,
            tests: (r) => {
                const para = () => { const typ = r.int(0, 4); const baza = rozne(losy(r, r.int(1, 30), 1, 60)); let A, B; if (typ === 0) { A = baza; B = r.shuffle(baza); } else if (typ === 1) { A = baza.slice(0, Math.max(1, baza.length - 2)); B = baza; } else if (typ === 2) { A = baza; B = baza.slice(0, Math.max(1, baza.length - 2)); } else if (typ === 3) { A = losy(r, r.int(1, 20), 1, 50); B = losy(r, r.int(1, 20), 51, 100); } else { A = losy(r, r.int(1, 20), 1, 40); B = losy(r, r.int(1, 20), 30, 70); } const dup = (x) => [...x, ...x.slice(0, r.int(0, x.length))]; return [dup(A), dup(B)]; };
                const t = (k) => { const p = Array.from({ length: k }, para); return `${k}\n${p.map(([a, b]) => `${a.length} ${b.length}\n${r.shuffle(a).join(' ')}\n${r.shuffle(b).join(' ')}`).join('\n')}`; };
                const duza = (k) => `${k}\n${Array.from({ length: k }, () => { const a = losy(r, 1000, 1, 1000), b = r() < 0.5 ? a.slice().reverse() : losy(r, 1000, 1, 1000); return `1000 1000\n${a.join(' ')}\n${b.join(' ')}`; }).join('\n')}`;
                return ['1\n1 1\n5\n5', '1\n1 1\n5\n6', '1\n2 3\n1 1\n1 1 1', '1\n3 1\n1 2 2\n2', '1\n2 2\n1 2\n2 3', t(20), t(50), duza(10)];
            },
            check: (inp) => { const t = nums(inp); const k = t[0]; if (!calk(k, 1, 50)) return 't'; let i = 1, suma = 0; for (let j = 0; j < k; j++) { const n = t[i], m = t[i + 1]; if (!calk(n, 1, 1000) || !calk(m, 1, 1000)) return 'n, m'; suma += n + m; i += 2; for (let z = 0; z < n + m; z++) if (!calk(t[i++], 1, 1000)) return 'liczba'; } return i === t.length && suma <= 20000 ? null : 'długość'; },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const out = [];
                for (let j = 0; j < t[0]; j++) {
                    const n = t[i], m = t[i + 1]; i += 2; const A = new Set(t.slice(i, i + n)); i += n; const B = new Set(t.slice(i, i + m)); i += m;
                    let w = 0; for (const x of A) if (B.has(x)) w++;
                    out.push(w === A.size && w === B.size ? 'ROWNE' : w === A.size ? 'PODZBIOR' : w === B.size ? 'NADZBIOR' : w === 0 ? 'ROZLACZNE' : 'INNE');
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n, m;
        cin >> n >> m;
        set<int> A, B;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            A.insert(x);
        }
        for (int i = 0; i < m; i++) {
            int x;
            cin >> x;
            B.insert(x);
        }
        int wspolne = 0;
        for (int x : A)
            if (B.count(x)) wspolne++;
        if (A == B) cout << "ROWNE\n";
        else if (wspolne == (int)A.size()) cout << "PODZBIOR\n";
        else if (wspolne == (int)B.size()) cout << "NADZBIOR\n";
        else if (wspolne == 0) cout << "ROZLACZNE\n";
        else cout << "INNE\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-pangram', krok: 5, level: 'latwe',
            title: 'Brakujące litery',
            short: 'Których liter alfabetu brakuje w zdaniu? Wielkie i małe to ta sama litera.',
            tags: ['set<char>', 'getline', 'tolower', 'litery od a do z'],
            statement: ['Pangram to zdanie, w którym występuje każda z 26 liter alfabetu angielskiego (od a do z). Dostajesz jedno zdanie. Wielkie i małe litery traktuj jak tę samą literę, a inne znaki (spacje, cyfry, przecinki) pomijaj.',
                'Wypisz w jednym wierszu, bez spacji i alfabetycznie, małe litery, których w zdaniu brakuje. Jeśli zdanie jest pangramem, wypisz PANGRAM.'],
            input_format: ['Jeden wiersz — zdanie (litery a–z i A–Z, cyfry, spacje i znaki interpunkcyjne).'],
            output_format: ['Brakujące litery alfabetycznie albo PANGRAM.'],
            constraints: ['Zdanie ma od 1 do 10 000 znaków.'],
            examples: [{ input: 'Ala ma kota, a kot ma Ale.', note: 'W zdaniu są tylko litery a, e, k, l, m, o, t. Brakuje pozostałych.' }, { input: 'The quick brown fox jumps over the lazy dog', note: 'To słynny angielski pangram.' }],
            hint: R`Wczytaj całe zdanie przez getline(cin, zdanie) — zwykłe cin >> przeczytałoby tylko pierwsze słowo. Dla każdego znaku, który jest literą (isalpha), wstaw do set<char> jego małą wersję tolower(c). Potem pętla for (char c = 'a'; c <= 'z'; c++) i wypisz litery, których zbiór nie zna. Jeśli nic nie wypisałeś — PANGRAM.`,
            tests: (r) => {
                const znaki = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ          0123456789.,!?-';
                const zd = (n, alf) => { let s = ''; while (s.length < n) s += r.pick([...alf]); return s.replace(/^\s+|\s+$/g, 'x'); };
                return ['a', 'Z', '12345 ...', 'Pack my box with five dozen liquor jugs!', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', zd(60, 'aeiou AEIOU,.'), zd(2000, znaki), zd(10000, 'qwertyQWERTY 1.'), zd(10000, znaki)];
            },
            check: (inp) => { const s = inp.replace(/\r/g, '').replace(/\n+$/, ''); if (s.includes('\n')) return 'jeden wiersz'; if (s.length < 1 || s.length > 10000) return 'długość'; return /^[A-Za-z0-9 .,!?\-]+$/.test(s) ? null : 'znaki'; },
            solve: (inp) => { const s = new Set([...inp.toLowerCase()].filter((c) => c >= 'a' && c <= 'z')); const brak = [...'abcdefghijklmnopqrstuvwxyz'].filter((c) => !s.has(c)).join(''); return brak || 'PANGRAM'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string zdanie;
    getline(cin, zdanie);
    set<char> litery;
    for (char c : zdanie)
        if (isalpha(c)) litery.insert(tolower(c));
    string brak = "";
    for (char c = 'a'; c <= 'z'; c++)
        if (!litery.count(c)) brak += c;
    if (brak == "") cout << "PANGRAM\n";
    else cout << brak << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-litery-wszystkich', krok: 5, level: 'srednie',
            title: 'Litery wspólne dla wszystkich',
            short: 'Które litery występują w każdym z n słów? Część wspólna wielu zbiorów, krok po kroku.',
            tags: ['część wspólna wielu', 'set<char>', 'BRAK'],
            statement: ['Dostajesz n słów z małych liter. Wypisz alfabetycznie, bez spacji, litery, które występują w każdym z tych słów. Jeśli takiej litery nie ma, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy jedno słowo.'],
            output_format: ['Wspólne litery alfabetycznie albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 100 liter a–z.'],
            examples: [{ input: '3\nkotek\nkrata\nkapitan', note: 'Litery słów: {e, k, o, t}, {a, k, r, t}, {a, i, k, n, p, t}. We wszystkich trzech są tylko k i t.' }],
            hint: R`Zbiór wspolne zacznij od liter pierwszego słowa. Dla każdego kolejnego słowa zbuduj zbiór jego liter i zostaw we wspolne tylko te litery, które ma też to słowo (nowy zbiór i przypisanie wspolne = nowe). Na końcu wypisz litery albo BRAK, jeśli zbiór jest pusty.`,
            tests: (r) => {
                const t = (n, len, alf) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(1, len), alf)).join('\n')}`;
                return ['1\nabc', '2\nabc\ndef', '3\naaa\naa\na', t(5, 10, 'abcd'), t(50, 30, 'abcdefg'), t(1000, 100, 'abcdefghijklmnopqrstuvwxyz'), t(1000, 100, 'aeiouxyz'), `3\n${'abcdefghijklmnopqrstuvwxyz'.repeat(3)}\nzyxwvutsrqponmlkjihgfedcba\nqazwsxedcrfvtgbyhnujmikolp`];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z]{1,100}$/.test(w)) ? null : 'słowo'; },
            solve: (inp) => { const w = toks(inp).slice(1); let wsp = new Set(w[0]); for (const s of w.slice(1)) { const l = new Set(s); wsp = new Set([...wsp].filter((c) => l.has(c))); } const o = rozne([...wsp]).join(''); return o || 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<char> wspolne;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        set<char> litery(w.begin(), w.end());
        if (i == 0) wspolne = litery;
        else {
            set<char> nowe;
            for (char c : wspolne)
                if (litery.count(c)) nowe.insert(c);
            wspolne = nowe;
        }
    }
    if (wspolne.empty()) cout << "BRAK";
    for (char c : wspolne) cout << c;
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-kolka', krok: 5, level: 'trudne',
            title: 'Kółka zainteresowań',
            short: 'Ilu uczniów chodzi na co najmniej jedno kółko, ilu na wszystkie, a ilu na dokładnie jedno?',
            tags: ['suma i część wspólna', 'dwa zbiory: raz i więcej', 'wiele zbiorów'],
            statement: ['W szkole działa k kółek zainteresowań. Dla każdego kółka znasz listę numerów uczniów, którzy na nie chodzą (przez pomyłkę ktoś mógł zostać wpisany na tę samą listę dwa razy — to wciąż jeden uczeń).',
                'Wypisz trzy liczby: ilu różnych uczniów chodzi na co najmniej jedno kółko, ilu chodzi na wszystkie kółka i ilu chodzi na dokładnie jedno kółko.'],
            input_format: ['W pierwszym wierszu liczba kółek k.', 'W każdym z następnych k wierszy: liczba wpisów c, a potem c numerów uczniów.'],
            output_format: ['Trzy liczby oddzielone spacjami.'],
            constraints: ['1 ≤ k ≤ 100', '1 ≤ c ≤ 1000', 'Suma wszystkich c ≤ 10 000', '1 ≤ numer ucznia ≤ 10⁶'],
            examples: [{ input: '3\n4 1 2 3 2\n2 2 4\n3 2 3 5', note: 'Kółka to {1, 2, 3}, {2, 4} i {2, 3, 5}. Razem pięciu uczniów: 1–5. Na wszystkie chodzi tylko 2. Na dokładnie jedno: 1, 4 i 5 (trójka chodzi na dwa).' }],
            hint: R`Dla każdego kółka zbuduj najpierw zbiór jego uczniów (to usuwa pomyłkowe powtórki). „Co najmniej jedno” to suma wszystkich zbiorów, „wszystkie” — część wspólna liczona krok po kroku. Na „dokładnie jedno” przydadzą się dwa zbiory: raz (uczniowie widziani na jednym kółku) i wiecej (na co najmniej dwóch). Dla ucznia z kolejnego kółka: jeśli jest w wiecej — nic; jeśli jest w raz — przenieś go do wiecej; w przeciwnym razie wstaw do raz. Odpowiedź to raz.size().`,
            tests: (r) => {
                const t = (k, c, hi) => `${k}\n${Array.from({ length: k }, () => { const n = r.int(1, c); return `${n} ${losy(r, n, 1, hi).join(' ')}`; }).join('\n')}`;
                return ['1\n1 7', '1\n3 7 7 7', '2\n2 1 2\n2 3 4', '2\n3 1 2 3\n3 3 2 1', '3\n2 1 2\n2 2 3\n2 3 1', t(5, 10, 20), t(30, 200, 300), t(100, 100, 1e6), t(10, 1000, 1500), t(100, 100, 120)];
            },
            check: (inp) => { const t = nums(inp); const k = t[0]; if (!calk(k, 1, 100)) return 'k'; let i = 1, suma = 0; for (let j = 0; j < k; j++) { const c = t[i++]; if (!calk(c, 1, 1000)) return 'c'; suma += c; for (let z = 0; z < c; z++) if (!calk(t[i++], 1, 1e6)) return 'numer'; } return i === t.length && suma <= 10000 ? null : 'długość'; },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const ile = new Map(); let wsp = null;
                for (let j = 0; j < t[0]; j++) { const c = t[i++]; const s = new Set(t.slice(i, i + c)); i += c; for (const x of s) ile.set(x, (ile.get(x) || 0) + 1); wsp = wsp === null ? s : new Set([...wsp].filter((x) => s.has(x))); }
                return `${ile.size} ${wsp.size} ${[...ile.values()].filter((v) => v === 1).length}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    set<int> suma, wszystkie, raz, wiecej;
    for (int j = 0; j < k; j++) {
        int c;
        cin >> c;
        set<int> kolko;
        for (int i = 0; i < c; i++) {
            int x;
            cin >> x;
            kolko.insert(x);
        }
        if (j == 0) wszystkie = kolko;
        else {
            set<int> nowe;
            for (int x : wszystkie)
                if (kolko.count(x)) nowe.insert(x);
            wszystkie = nowe;
        }
        for (int x : kolko) {
            suma.insert(x);
            if (wiecej.count(x)) continue;
            if (raz.count(x)) {
                raz.erase(x);
                wiecej.insert(x);
            } else raz.insert(x);
        }
    }
    cout << suma.size() << " " << wszystkie.size() << " " << raz.size() << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · pary i napisy
        {
            id: 'zb-rozne-punkty', krok: 6, level: 'latwe',
            title: 'Różne punkty',
            short: 'Niektóre punkty zapisano kilka razy. Ile jest różnych i jakie — po kolei według x, potem y?',
            tags: ['set<pair<int, int>>', 'insert({x, y})', 'auto [x, y]'],
            statement: ['Dostajesz n punktów na płaszczyźnie (współrzędne całkowite). Niektóre punkty zapisano kilka razy. Wypisz, ile jest różnych punktów, a potem każdy różny punkt w osobnym wierszu — posortowane według x, a przy równych x według y.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby: x i y.'],
            output_format: ['W pierwszym wierszu liczba różnych punktów.', 'Potem różne punkty, każdy w osobnym wierszu: x i y oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 2000', '−1000 ≤ x, y ≤ 1000'],
            examples: [{ input: '5\n1 2\n0 5\n1 2\n-3 4\n0 5', note: 'Różne są trzy punkty. Najpierw ten z najmniejszym x = −3.' }],
            hint: R`set<pair<int, int>> punkty; i punkty.insert({x, y}); — pary porównują się najpierw po first, potem po second, dokładnie tak, jak każe zadanie. Wypisz punkty.size(), a potem for (auto [x, y] : punkty).`,
            tests: (r) => { const t = (n, hi) => `${n}\n${Array.from({ length: n }, () => `${r.int(-hi, hi)} ${r.int(-hi, hi)}`).join('\n')}`; return ['1\n0 0', '3\n1 1\n1 1\n1 1', '3\n2 1\n1 2\n1 1', t(10, 2), t(300, 10), t(2000, 1000), t(2000, 20)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 2000) || t.length !== 1 + 2 * n) return 'n'; return t.slice(1).every((x) => calk(x, -1000, 1000)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const m = new Map(); for (let i = 0; i < t[0]; i++) m.set(`${t[1 + 2 * i]} ${t[2 + 2 * i]}`, [t[1 + 2 * i], t[2 + 2 * i]]); const p = [...m.values()].sort(cmpPar); return `${p.length}\n${p.map(([x, y]) => `${x} ${y}`).join('\n')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<pair<int, int>> punkty;
    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        punkty.insert({x, y});
    }
    cout << punkty.size() << "\n";
    for (auto [x, y] : punkty) cout << x << " " << y << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-znajomosci', krok: 6, level: 'latwe',
            title: 'Znajomości bez powtórzeń',
            short: '„4 2” i „2 4” to ta sama znajomość. Ile jest różnych i jakie? Para {min, max}.',
            tags: ['{min(a, b), max(a, b)}', 'set<pair>', 'para bez kolejności'],
            statement: ['W klasie zapisano m znajomości: każda to para numerów uczniów a i b, którzy się znają. Znajomość działa w obie strony, więc zapis „4 2” oznacza to samo co „2 4”, a ta sama znajomość mogła zostać zapisana kilka razy.',
                'Wypisz, ile jest różnych znajomości, a potem każdą w osobnym wierszu jako dwa numery: mniejszy, potem większy. Znajomości posortuj według pierwszego numeru, a przy remisie według drugiego.'],
            input_format: ['W pierwszym wierszu liczba m.', 'W każdym z następnych m wierszy dwa różne numery uczniów a i b.'],
            output_format: ['W pierwszym wierszu liczba różnych znajomości.', 'Potem znajomości, każda w osobnym wierszu.'],
            constraints: ['1 ≤ m ≤ 2000', '1 ≤ a, b ≤ 10 000', 'a ≠ b'],
            examples: [{ input: '6\n4 2\n2 4\n1 4\n4 1\n4 1\n3 2', note: 'Różne znajomości: 1–4, 2–3 i 2–4.' }],
            hint: R`Zanim wstawisz parę do set<pair<int, int>>, ustaw ją w jednej kolejności: {min(a, b), max(a, b)}. Wtedy „4 2” i „2 4” staną się tą samą parą (2, 4), a zbiór zostawi ją raz.`,
            tests: (r) => { const t = (m, hi) => `${m}\n${Array.from({ length: m }, () => { const a = r.int(1, hi); let b = r.int(1, hi - 1); if (b >= a) b++; return `${a} ${b}`; }).join('\n')}`; return ['1\n2 1', '2\n1 2\n2 1', '3\n5 3\n3 5\n5 4', t(15, 5), t(500, 40), t(2000, 10000), t(2000, 60)]; },
            check: (inp) => { const t = nums(inp); const m = t[0]; if (!calk(m, 1, 2000) || t.length !== 1 + 2 * m) return 'm'; for (let i = 0; i < m; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 1, 10000) || !calk(b, 1, 10000) || a === b) return 'para'; } return null; },
            solve: (inp) => { const t = nums(inp); const m = new Map(); for (let i = 0; i < t[0]; i++) { const a = Math.min(t[1 + 2 * i], t[2 + 2 * i]), b = Math.max(t[1 + 2 * i], t[2 + 2 * i]); m.set(`${a} ${b}`, [a, b]); } const p = [...m.values()].sort(cmpPar); return `${p.length}\n${p.map(([a, b]) => `${a} ${b}`).join('\n')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int m;
    cin >> m;
    set<pair<int, int>> znajomosci;
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        znajomosci.insert({min(a, b), max(a, b)});
    }
    cout << znajomosci.size() << "\n";
    for (auto [a, b] : znajomosci) cout << a << " " << b << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-te-same-slowa', krok: 6, level: 'latwe',
            title: 'Te same słowa?',
            short: 'Czy dwa zdania używają tego samego zestawu słów, nie licząc wielkości liter? tolower i A == B.',
            tags: ['tolower', 'set<string>', 'A == B'],
            statement: ['Dostajesz dwa zdania jako listy słów (słowa z liter a–z i A–Z). Sprawdź, czy oba zdania używają dokładnie tego samego zestawu różnych słów, jeśli nie zwracamy uwagi na wielkość liter („Kot” i „kot” to to samo słowo) ani na to, ile razy słowo się powtarza.',
                'Wypisz TAK albo NIE, a potem liczbę różnych słów w pierwszym i w drugim zdaniu.'],
            input_format: ['W pierwszym wierszu liczby n i m — liczby słów w zdaniach.', 'W drugim wierszu n słów pierwszego zdania.', 'W trzecim wierszu m słów drugiego zdania.'],
            output_format: ['Jeden wiersz: TAK albo NIE i dwie liczby.'],
            constraints: ['1 ≤ n, m ≤ 2000', 'Każde słowo ma od 1 do 12 liter.'],
            examples: [{ input: '4 3\nAla ma Kota ala\nkota MA ala', note: 'Po zamianie na małe litery oba zdania to zestaw {ala, kota, ma}.' }, { input: '2 2\nkot pies\nkot kot', note: 'W drugim zdaniu brakuje słowa „pies”.' }],
            hint: R`Każde słowo przed wstawieniem zamień na małe litery: for (char &c : w) c = tolower(c);. Zbuduj dwa zbiory napisów i porównaj je operatorem ==. Rozmiary to A.size() i B.size().`,
            tests: (r) => {
                const zmien = (w) => [...w].map((c) => (r() < 0.3 ? c.toUpperCase() : c)).join('');
                const t = (n, m, pula, rowne) => { const p = Array.from({ length: pula }, () => r.word(r.int(1, 12))); const a = Array.from({ length: n }, () => zmien(r.pick(p))); let b = Array.from({ length: m }, () => zmien(r.pick(p))); if (rowne) { const uz = [...new Set(a.map((x) => x.toLowerCase()))]; b = [...uz.map(zmien), ...b.filter((x) => uz.includes(x.toLowerCase()))].slice(0, Math.max(m, uz.length)); } return `${a.length} ${b.length}\n${a.join(' ')}\n${b.join(' ')}`; };
                return ['1 1\nA\na', '1 1\nab\nba', '3 2\nKOT kot Kot\nkOt KoT', t(10, 10, 4, true), t(10, 10, 4, false), t(500, 600, 50, true), t(2000, 2000, 300, true), t(2000, 2000, 300, false), t(2000, 1500, 3, true)];
            },
            check: (inp) => { const t = toks(inp); const [n, m] = t.slice(0, 2).map(Number); if (!calk(n, 1, 2000) || !calk(m, 1, 2000) || t.length !== 2 + n + m) return 'n, m'; return t.slice(2).every((w) => /^[A-Za-z]{1,12}$/.test(w)) ? null : 'słowo'; },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const A = new Set(t.slice(2, 2 + n).map((w) => w.toLowerCase())), B = new Set(t.slice(2 + n).map((w) => w.toLowerCase())); const rowne = A.size === B.size && [...A].every((w) => B.has(w)); return `${rowne ? 'TAK' : 'NIE'} ${A.size} ${B.size}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    set<string> A, B;
    for (int i = 0; i < n + m; i++) {
        string w;
        cin >> w;
        for (char &c : w) c = tolower(c);
        if (i < n) A.insert(w);
        else B.insert(w);
    }
    cout << (A == B ? "TAK" : "NIE") << " " << A.size() << " " << B.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-robot', krok: 6, level: 'srednie',
            title: 'Robot na kratce',
            short: 'Na ilu różnych polach stanął robot i w którym ruchu pierwszy raz wrócił na pole, na którym już był?',
            tags: ['set<pair<int, int>>', 'count', 'pole startowe'],
            statement: ['Robot stoi na polu (0, 0) nieskończonej kratki i wykonuje ruchy zapisane jako napis: G — w górę (y + 1), D — w dół (y − 1), L — w lewo (x − 1), P — w prawo (x + 1).',
                'Wypisz dwie rzeczy: na ilu różnych polach stał robot (licząc pole startowe) oraz numer ruchu (licząc od 1), po którym robot pierwszy raz stanął na polu, na którym już wcześniej był. Jeśli to się nie zdarzyło, zamiast numeru wypisz NIGDY.'],
            input_format: ['Jeden wiersz — napis z ruchami.'],
            output_format: ['Liczba różnych pól i numer ruchu (albo NIGDY), oddzielone spacją.'],
            constraints: ['Napis ma od 1 do 10 000 znaków G, D, L, P.'],
            examples: [{ input: 'PPLLD', note: 'Pola: (0, 0), (1, 0), (2, 0), potem znowu (1, 0) — to trzeci ruch. Dalej (0, 0) i (0, −1). Różnych pól jest 4.' }, { input: 'GGP', note: 'Robot nigdy nie wraca: 4 różne pola.' }],
            hint: R`Zbiór set<pair<int, int>> odwiedzonych pól zacznij od {0, 0}. W każdym ruchu zmień x albo y, a potem — tak jak w „czy to już było?” — najpierw sprawdź count({x, y}) (jeśli to pierwszy powrót, zapamiętaj numer ruchu), a dopiero potem wstaw pole.`,
            tests: (r) => { const t = (n, alf) => r.word(n, alf); return ['G', 'GD', 'GPDL', 'PPPP', 'LLLLGGGGPPPPDDDD', t(30, 'GDLP'), t(2000, 'GDLP'), t(10000, 'GDLP'), t(10000, 'GGGPPPLD'), t(10000, 'PG')]; },
            check: (inp) => (/^[GDLP]{1,10000}$/.test(inp.trim()) ? null : 'ruchy'),
            solve: (inp) => { let x = 0, y = 0; const s = new Set(['0,0']); let pierwszy = 'NIGDY'; [...inp.trim()].forEach((c, i) => { if (c === 'G') y++; else if (c === 'D') y--; else if (c === 'L') x--; else x++; const k = `${x},${y}`; if (pierwszy === 'NIGDY' && s.has(k)) pierwszy = String(i + 1); s.add(k); }); return `${s.size} ${pierwszy}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string ruchy;
    cin >> ruchy;
    int x = 0, y = 0, pierwszy = -1;
    set<pair<int, int>> pola;
    pola.insert({0, 0});
    for (int i = 0; i < (int)ruchy.size(); i++) {
        char c = ruchy[i];
        if (c == 'G') y++;
        else if (c == 'D') y--;
        else if (c == 'L') x--;
        else x++;
        if (pierwszy == -1 && pola.count({x, y})) pierwszy = i + 1;
        pola.insert({x, y});
    }
    cout << pola.size() << " ";
    if (pierwszy == -1) cout << "NIGDY\n";
    else cout << pierwszy << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-ulamki', krok: 6, level: 'srednie',
            title: 'Różne ułamki',
            short: '1/2, 2/4 i 3/6 to ta sama liczba. Skróć każdy ułamek przez NWD i wstaw parę do zbioru.',
            tags: ['NWD', 'postać nieskracalna', 'set<pair>'],
            statement: ['Dostajesz n ułamków a/b. Ile różnych liczb one oznaczają? Na przykład 1/2, 2/4 i 3/6 to ta sama liczba, a 0/5 i 0/7 — też (obie to zero). Licznik może być ujemny, mianownik jest zawsze dodatni.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby: licznik a i mianownik b.'],
            output_format: ['Jedna liczba — ile różnych wartości mają ułamki.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁶ ≤ a ≤ 10⁶', '1 ≤ b ≤ 10⁶'],
            examples: [{ input: '6\n1 2\n2 4\n3 6\n2 3\n0 5\n0 7', note: 'Trzy pierwsze ułamki to 1/2, potem 2/3 i dwa razy zero — razem trzy różne wartości.' }, { input: '3\n-1 2\n-2 4\n1 2', note: '−1/2 i −2/4 to ta sama liczba, a 1/2 — inna.' }],
            hint: R`Sprowadź każdy ułamek do postaci nieskracalnej: policz NWD z |a| i b (algorytm Euklidesa z lekcji Modulo: dopóki b2 != 0, zamieniaj (a2, b2) na (b2, a2 % b2)) i podziel przez nie licznik i mianownik. Dla a = 0 NWD wychodzi równe b, więc dostaniesz 0/1. Takie pary (licznik, mianownik) wstawiaj do set<pair<int, int>> i wypisz rozmiar.`,
            tests: (r) => {
                const t = (n, hi) => `${n}\n${Array.from({ length: n }, () => {
                    let a = r.int(-hi, hi), b = r.int(1, hi);
                    if (r() < 0.1) a = 0;
                    const k = r.int(2, 9);
                    if (r() < 0.4 && Math.abs(a * k) <= 1e6 && b * k <= 1e6) { a *= k; b *= k; }
                    return `${a} ${b}`;
                }).join('\n')}`;
                return ['1\n0 1', '2\n0 3\n0 9', '4\n6 8\n9 12\n-3 4\n3 4', t(20, 6), t(1000, 30), t(5000, 1000), t(5000, 1e6), `3\n1000000 1\n-1000000 1\n999999 1000000`];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 5000) || t.length !== 1 + 2 * n) return 'n'; for (let i = 0; i < n; i++) if (!calk(t[1 + 2 * i], -1e6, 1e6) || !calk(t[2 + 2 * i], 1, 1e6)) return 'ułamek'; return null; },
            solve: (inp) => { const t = nums(inp); const nwd = (a, b) => (b ? nwd(b, a % b) : a); const s = new Set(); for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; const g = nwd(Math.abs(a), b); s.add(`${a / g}/${b / g}`); } return String(s.size); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<pair<int, int>> ulamki;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        int x = abs(a), y = b;
        while (y != 0) {
            int r = x % y;
            x = y;
            y = r;
        }
        ulamki.insert({a / x, b / x});
    }
    cout << ulamki.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-zestaw-liter', krok: 6, level: 'srednie',
            title: 'Ten sam zestaw liter',
            short: 'Słowa są spokrewnione, gdy używają tych samych liter (bez liczenia powtórzeń). Ile jest grup? Klucz ze zbioru liter.',
            tags: ['klucz', 'set<char> → string', 'set<string>'],
            statement: ['Dwa słowa są spokrewnione, jeśli używają dokładnie tego samego zestawu liter — nie liczy się kolejność liter ani to, ile razy litera się powtarza. Na przykład „mama”, „am” i „maa” są spokrewnione (zestaw {a, m}), a „kot” i „tok” też (zestaw {k, o, t}).',
                'Dostajesz n słów. Na ile grup spokrewnionych słów się dzielą?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter a–z.'],
            output_format: ['Jedna liczba — liczba grup.'],
            constraints: ['1 ≤ n ≤ 2000', 'Każde słowo ma od 1 do 20 liter.'],
            examples: [{ input: '6\nkot tok koot mama am maa', note: 'Zestawy liter: {k, o, t} trzy razy i {a, m} trzy razy — dwie grupy.' }],
            hint: R`Każde słowo zamień na klucz: zbiór jego liter zapisany jako napis. Najprościej: set<char> l(w.begin(), w.end()); string klucz(l.begin(), l.end()); — litery wyjdą bez powtórzeń i alfabetycznie. Klucze wstawiaj do set<string>; liczba grup to jego rozmiar.`,
            tests: (r) => { const t = (n, len, alf) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(1, len), alf)).join(' ')}`; return ['1\na', '2\nab ba', '3\naab abb ab', '3\nabc ab a', t(20, 5, 'abc'), t(500, 10, 'abcdef'), t(2000, 20, 'abcdefghij'), t(2000, 20, 'abcdefghijklmnopqrstuvwxyz'), t(2000, 20, 'xy')]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z]{1,20}$/.test(w)) ? null : 'słowo'; },
            solve: (inp) => String(new Set(toks(inp).slice(1).map((w) => rozne([...w]).join(''))).size),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<string> klucze;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        set<char> litery(w.begin(), w.end());
        string klucz(litery.begin(), litery.end());
        klucze.insert(klucz);
    }
    cout << klucze.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-ranking', krok: 6, level: 'trudne',
            title: 'Ranking na żywo',
            short: 'Punkty spływają, a lider ma być znany po każdym wyniku. Para (−punkty, numer), erase i insert.',
            tags: ['set<pair>', '(−punkty, numer)', 'erase + insert', '*begin()'],
            statement: ['W turnieju gra n zawodników o numerach od 1 do n; na początku każdy ma 0 punktów. Przychodzi q wyników: każdy to numer zawodnika i liczba punktów, które zdobył (dodają się do jego dotychczasowych).',
                'Po każdym wyniku wypisz lidera: numer zawodnika z największą liczbą punktów (przy remisie — z najmniejszym numerem) i jego punkty.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z następnych q wierszy dwie liczby: numer zawodnika i zdobyte punkty.'],
            output_format: ['q wierszy — w każdym numer lidera i jego punkty.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ q ≤ 2000', '1 ≤ zdobyte punkty ≤ 1000'],
            examples: [{ input: '3 4\n2 5\n3 5\n1 3\n3 1', note: 'Po drugim wyniku 2 i 3 mają po 5 punktów — liderem jest zawodnik z mniejszym numerem, 2. Po czwartym zawodnik 3 ma 6 punktów i prowadzi.' }],
            hint: R`Trzymaj punkty w vector<long long> pkt(n + 1) i zbiór par (-punkty, numer) — na start wszystkie pary (0, i). Przy wyniku usuń starą parę zawodnika ({-pkt[i], i}), zwiększ pkt[i] i wstaw nową parę. Lider to *ranking.begin(): numer to second, a punkty to -first. Sprawdzanie wszystkich zawodników po każdym wyniku (n · q kroków) też by zdążyło, ale zbiór robi to w O(log n).`,
            tests: (r) => { const t = (n, q, mx) => `${n} ${q}\n${Array.from({ length: q }, () => `${r.int(1, n)} ${r.int(1, mx)}`).join('\n')}`; return ['1 1\n1 7', '2 2\n2 3\n1 3', '3 3\n3 1\n2 1\n1 1', t(5, 20, 5), t(50, 500, 10), t(10000, 2000, 1000), t(3, 2000, 1000), t(10000, 2000, 1)]; },
            check: (inp) => { const t = nums(inp); const [n, q] = t; if (!calk(n, 1, 10000) || !calk(q, 1, 2000) || t.length !== 2 + 2 * q) return 'n, q'; for (let i = 0; i < q; i++) if (!calk(t[2 + 2 * i], 1, n) || !calk(t[3 + 2 * i], 1, 1000)) return 'wynik'; return null; },
            solve: (inp) => { const t = nums(inp); const [n, q] = t; const pkt = new Array(n + 1).fill(0); let lider = 1; const out = []; for (let i = 0; i < q; i++) { const z = t[2 + 2 * i]; pkt[z] += t[3 + 2 * i]; if (pkt[z] > pkt[lider] || (pkt[z] === pkt[lider] && z < lider)) lider = z; out.push(`${lider} ${pkt[lider]}`); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> pkt(n + 1, 0);
    set<pair<long long, int>> ranking;
    for (int i = 1; i <= n; i++) ranking.insert({0, i});
    while (q--) {
        int z;
        long long p;
        cin >> z >> p;
        ranking.erase({-pkt[z], z});
        pkt[z] += p;
        ranking.insert({-pkt[z], z});
        auto [minusPkt, lider] = *ranking.begin();
        cout << lider << " " << -minusPkt << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-kamienie', krok: 6, level: 'trudne',
            title: 'Kamienie na planszy',
            short: 'Kamienie kładzione i zdejmowane. Pierwszy kamień w wierszu na prawo od kolumny c? lower_bound na parach.',
            tags: ['set<pair>', 'lower_bound({r, c})', 'it->first'],
            statement: ['Na ogromnej planszy kładzie się i zdejmuje kamienie. Pole opisują dwie liczby: numer wiersza r i numer kolumny c. Wykonaj q poleceń:',
                'POLOZ r c — połóż kamień na polu (r, c) (jeśli już tam leży, nic się nie zmienia),',
                'ZDEJMIJ r c — zdejmij kamień z pola (r, c) (jeśli go tam nie ma, nic się nie dzieje),',
                'PRAWO r c — idąc wierszem r od kolumny c w prawo (kolumna c też się liczy), na kamień w której kolumnie trafisz najpierw? Wypisz numer kolumny albo BRAK.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie i dwie liczby r, c.'],
            output_format: ['Odpowiedzi na polecenia PRAWO, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ r, c ≤ 10⁹', 'Jest co najmniej jedno polecenie PRAWO.'],
            examples: [{ input: '7\nPOLOZ 1 5\nPOLOZ 1 9\nPOLOZ 2 3\nPRAWO 1 6\nZDEJMIJ 1 9\nPRAWO 1 6\nPRAWO 2 1', note: 'Najpierw w wierszu 1 na prawo od kolumny 6 leży kamień w kolumnie 9. Po jego zdjęciu nic już tam nie ma — kamień (2, 3) jest w innym wierszu i się nie liczy.' }],
            hint: R`Trzymaj kamienie w set<pair<int, int>> jako pary (wiersz, kolumna). auto it = s.lower_bound({r, c}) wskazuje pierwszy kamień, który w kolejności par jest ≥ (r, c). To szukany kamień — ale tylko wtedy, gdy it != s.end() i it->first == r. W przeciwnym razie w wierszu r na prawo od c nic nie leży.`,
            tests: (r) => {
                const t = (q, wiersze, kol) => { const w = []; const lez = []; for (let i = 0; i < q; i++) { const p = r.pick(['POLOZ', 'POLOZ', 'ZDEJMIJ', 'PRAWO', 'PRAWO']); let a = r.int(1, wiersze), b = r.int(1, kol); if (p === 'ZDEJMIJ' && lez.length && r() < 0.8) [a, b] = r.pick(lez); if (p === 'POLOZ') lez.push([a, b]); w.push(`${p} ${a} ${b}`); } if (!w.some((x) => x.startsWith('PR'))) w[q - 1] = 'PRAWO 1 1'; return `${q}\n${w.join('\n')}`; };
                return ['1\nPRAWO 1 1', '2\nPOLOZ 1 1\nPRAWO 1 1', '3\nPOLOZ 2 1\nPRAWO 1 1000000000\nPRAWO 1 1', '4\nPOLOZ 1000000000 1000000000\nPRAWO 1000000000 1\nZDEJMIJ 1000000000 1000000000\nPRAWO 1000000000 1', t(30, 3, 20), t(1000, 20, 1000), t(3000, 1e9, 1e9), t(3000, 50, 200), t(3000, 2, 1e9)];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 3000) || t.length !== 1 + 3 * q) return 'q'; let pyt = 0; for (let i = 0; i < q; i++) { const p = t[1 + 3 * i]; if (p === 'PRAWO') pyt++; else if (p !== 'POLOZ' && p !== 'ZDEJMIJ') return 'polecenie'; if (!calk(Number(t[2 + 3 * i]), 1, 1e9) || !calk(Number(t[3 + 3 * i]), 1, 1e9)) return 'pole'; } return pyt ? null : 'brak PRAWO'; },
            solve: (inp) => { const t = toks(inp); const s = new Zbior(cmpPar); const out = []; for (let i = 0; i < Number(t[0]); i++) { const p = t[1 + 3 * i], a = Number(t[2 + 3 * i]), b = Number(t[3 + 3 * i]); if (p === 'POLOZ') s.add([a, b]); else if (p === 'ZDEJMIJ') s.del([a, b]); else { const k = s.lower([a, b]); out.push(k < s.size && s.a[k][0] === a ? String(s.a[k][1]) : 'BRAK'); } } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<pair<int, int>> kamienie;
    while (q--) {
        string p;
        int r, c;
        cin >> p >> r >> c;
        if (p == "POLOZ") kamienie.insert({r, c});
        else if (p == "ZDEJMIJ") kamienie.erase({r, c});
        else {
            auto it = kamienie.lower_bound({r, c});
            if (it != kamienie.end() && it->first == r) cout << it->second << "\n";
            else cout << "BRAK\n";
        }
    }
    return 0;
}`,
        },
    ];
};
