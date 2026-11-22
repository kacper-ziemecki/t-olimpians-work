// Struct — baza zadań na koniec lekcji: 28 zadań od łatwych przez średnie do trudnych (wielki finał: giełda).
// Łatwe: jedna, dwie struktury naraz. Średnie: sortowanie z kilkoma kryteriami, mapy struktur, symulacje, przedziały.
// Trudne: struktury w poważnych algorytmach (przydział sal, ranking na żywo, rozkład jazdy, DP na posortowanych strukturach).
module.exports = (h) => {
    const { toks } = h;
    const P = require('./struct-pomoc');
    const { IMIONA, NAZWISKA, PRODUKTY, calk, zlote, pad2, hhmm, hhmmss, dataTxt, losData, unikalneImiona, unikalneSlowa, slowo, sortuj, cmpS, nwdB } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const imie = (r) => r.pick(IMIONA);
    const czyImie = (s, max) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const czyMale = (s, max) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const zl = (g) => zlote(g, '.');
    const minuty = (g) => { const [a, b] = g.split(':').map(Number); return a * 60 + b; };
    const czyGodz = (g) => /^\d\d:\d\d$/.test(g) && Number(g.slice(0, 2)) < 24 && Number(g.slice(3)) < 60;

    // Giełda (st-b-final-gielda): arkusz zleceń — wzorcówka i generator testów. wykonaj(wiersz) oddaje wypisane wiersze.
    function nowaGielda() {
        const kup = [], spr = []; // { c: cena, t: czas, id, q: ilość } — kup: cena malejąco, spr: cena rosnąco; przy równej cenie starsze pierwsze
        const gdzie = new Map();
        let czas = 0;
        const wstaw = (arr, x, przed) => { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (przed(arr[m], x)) lo = m + 1; else hi = m; } arr.splice(lo, 0, x); };
        const przedK = (a, b) => a.c > b.c || (a.c === b.c && a.t < b.t);
        const przedS = (a, b) => a.c < b.c || (a.c === b.c && a.t < b.t);
        const linia = (arr, nazwa) => { if (!arr.length) return `${nazwa}: brak`; const c = arr[0].c; let s = 0; for (const x of arr) { if (x.c !== c) break; s += x.q; } return `${nazwa}: ${c} x ${s}`; };
        return {
            wykonaj(l) {
                const t = l.split(' '); const o = []; const teraz = czas++;
                if (t[0] === 'KUP' || t[0] === 'SPRZEDAJ') {
                    const id = Number(t[1]), c = Number(t[3]); let q = Number(t[2]);
                    const kupuje = t[0] === 'KUP'; const druga = kupuje ? spr : kup;
                    while (q > 0 && druga.length && (kupuje ? druga[0].c <= c : druga[0].c >= c)) {
                        const z = druga[0]; const x = Math.min(q, z.q);
                        o.push(kupuje ? `TRANSAKCJA ${id} ${z.id} ${x} ${z.c}` : `TRANSAKCJA ${z.id} ${id} ${x} ${z.c}`);
                        q -= x; z.q -= x;
                        if (!z.q) { druga.shift(); gdzie.delete(z.id); }
                    }
                    if (q > 0) { if (kupuje) wstaw(kup, { c, t: teraz, id, q }, przedK); else wstaw(spr, { c, t: teraz, id, q }, przedS); gdzie.set(id, kupuje ? kup : spr); }
                } else if (t[0] === 'ANULUJ') {
                    const id = Number(t[1]); const arr = gdzie.get(id);
                    if (!arr) o.push(`BRAK ${id}`); else { arr.splice(arr.findIndex((x) => x.id === id), 1); gdzie.delete(id); o.push(`ANULOWANO ${id}`); }
                } else o.push(linia(kup, 'kupno'), linia(spr, 'sprzedaz'));
                return o;
            },
        };
    }

    return [
        // ================================================================ BAZA · łatwe
        {
            id: 'st-b-skoki', krok: 9, level: 'latwe',
            title: 'Konkurs skoków',
            short: 'Skoczek: odległość i pięć not za styl. Najwyższa i najniższa nota odpada, punkty liczy funkcja, a ranking — sort z trzema kryteriami.',
            tags: ['struktura z tablicą not', 'funkcja licząca punkty', 'sort z kilkoma kryteriami'],
            statement: ['Każdy z n skoczków ma imię, odległość skoku w metrach i pięć not za styl. Punkty skoczka to podwojona odległość plus suma trzech środkowych not (najwyższą i najniższą notę się odrzuca — jeśli kilka not jest równych, odrzuca się tylko jedną najwyższą i jedną najniższą).',
                'Wypisz ranking: od największej liczby punktów, przy równych punktach — od dłuższego skoku, a jeśli i to równe — alfabetycznie według imienia.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, odległość i pięć not.'],
            output_format: ['n wierszy: MIEJSCE. IMIE PUNKTY.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona są różne (od 1 do 20 znaków: litery i cyfry, pierwsza wielka).', '50 ≤ odległość ≤ 150, noty od 10 do 20'],
            examples: [{ input: '3\nKamil 132 18 19 18 20 17\nDawid 135 17 17 16 18 17\nPiotr 130 19 19 20 20 19', note: 'Kamil: 264 + (18 + 19 + 18) = 319. Dawid: 270 + (17 + 17 + 17) = 321. Piotr: 260 + (19 + 19 + 20) = 318.' }],
            hint: R`struct Skoczek { string imie; int odl; int noty[5]; int punkty; };. Punkty: 2 * odl + suma wszystkich not − największa − najmniejsza. Policz je raz po wczytaniu i zapisz w polu, zamiast liczyć w komparatorze przy każdym porównaniu.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => unikalneImiona(r, n).map((s) => [s, r.int(lo, hi), ...Array.from({ length: 5 }, () => r.int(10, 20))]);
                return [d([['Ala', 50, 10, 10, 10, 10, 10]]), d([['B', 100, 15, 15, 15, 15, 15], ['A', 100, 15, 15, 15, 15, 15], ['C', 99, 20, 20, 20, 10, 10]]), d(los(12, 120, 135)), d(los(1000, 50, 150)), d(los(300, 100, 102))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n'; const s = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 7 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || s.has(t[0]) || !calk(Number(t[1]), 50, 150) || !t.slice(2).every((x) => calk(Number(x), 10, 20))) return 'dane'; s.add(t[0]); }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); const n = t.slice(2).map(Number); return [t[0], Number(t[1]), 2 * Number(t[1]) + n.reduce((a, b) => a + b, 0) - Math.max(...n) - Math.min(...n)]; });
                return sortuj(u, (x) => [x[2], x[1], x[0]], [-1, -1, 1]).map((x, i) => `${i + 1}. ${x[0]} ${x[2]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Skoczek {
    string imie;
    int odl;
    int noty[5];
    int punkty;
};
int policz(const Skoczek &s) {
    int suma = 0, mx = s.noty[0], mn = s.noty[0];
    for (int i = 0; i < 5; i++) {
        suma += s.noty[i];
        mx = max(mx, s.noty[i]);
        mn = min(mn, s.noty[i]);
    }
    return 2 * s.odl + suma - mx - mn;
}
int main() {
    int n;
    cin >> n;
    vector<Skoczek> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i].imie >> v[i].odl;
        for (int j = 0; j < 5; j++) cin >> v[i].noty[j];
        v[i].punkty = policz(v[i]);
    }
    sort(v.begin(), v.end(), [](const Skoczek &a, const Skoczek &b) {
        if (a.punkty != b.punkty) return a.punkty > b.punkty;
        if (a.odl != b.odl) return a.odl > b.odl;
        return a.imie < b.imie;
    });
    for (int i = 0; i < n; i++) cout << i + 1 << ". " << v[i].imie << " " << v[i].punkty << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-pociagi', krok: 9, level: 'latwe',
            title: 'Czas przejazdu',
            short: 'Pociąg z godziną odjazdu i przyjazdu. Gdy przyjazd jest „wcześniej” niż odjazd, pociąg jechał przez północ — doliczasz dobę.',
            tags: ['struct z dwiema godzinami', 'przez północ', 'najkrótszy i najdłuższy'],
            statement: ['Rozkład ma n pociągów: nazwę, godzinę odjazdu i godzinę przyjazdu (HH:MM). Każdy pociąg jedzie krócej niż dobę; jeśli godzina przyjazdu jest wcześniejsza niż godzina odjazdu, pociąg dojechał następnego dnia.',
                'Dla każdego pociągu wypisz czas jazdy w formacie G:MM (godziny bez zera z przodu, minuty zawsze dwiema cyframi), a na końcu najszybszy i najwolniejszy pociąg (przy remisie — wcześniejszy w rozkładzie).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa, odjazd i przyjazd.'],
            output_format: ['n wierszy NAZWA G:MM, potem najszybszy: NAZWA i najwolniejszy: NAZWA.'],
            constraints: ['1 ≤ n ≤ 1000', 'Nazwy mają od 1 do 15 znaków (wielkie litery i cyfry).', 'Godzina przyjazdu jest różna od godziny odjazdu.'],
            examples: [{ input: '3\nIC101 06:40 09:05\nNOC7 22:30 06:15\nR12 12:00 12:45', note: 'IC101 jedzie 2:25. NOC7 jedzie przez północ: 22:30 → 06:15 to 7:45. R12 jedzie 0:45 i jest najszybszy.' }],
            hint: R`Zamień godziny na minuty od północy. int czas = przyjazd - odjazd; if (czas < 0) czas += 24 * 60;. Wypisanie: czas / 60 << ":" << setw(2) << setfill('0') << czas % 60.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([n, x, y]) => `${n} ${hhmm(x)} ${hhmm(y)}`).join('\n')}`;
                const naz = () => r.pick(['IC', 'TLK', 'R', 'EIP', 'NOC', 'KS']) + r.int(1, 999);
                const los = (n) => Array.from({ length: n }, () => { const a = r.int(0, 1439); let b = r.int(0, 1439); if (b === a) b = (a + 1) % 1440; return [naz(), a, b]; });
                return [d([['A', 0, 1439]]), d([['X', 1439, 0], ['Y', 0, 1439], ['Z', 600, 599]]), d(los(15)), d(los(1000))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && /^[A-Z0-9]{1,15}$/.test(t[0]) && czyGodz(t[1]) && czyGodz(t[2]) && t[1] !== t[2]; }) ? null : 'dane'; },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); let c = minuty(t[2]) - minuty(t[1]); if (c < 0) c += 1440; return [t[0], c]; });
                let a = u[0], b = u[0];
                for (const x of u) { if (x[1] < a[1]) a = x; if (x[1] > b[1]) b = x; }
                return [...u.map((x) => `${x[0]} ${Math.floor(x[1] / 60)}:${pad2(x[1] % 60)}`), `najszybszy: ${a[0]}`, `najwolniejszy: ${b[0]}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pociag {
    string nazwa;
    int odjazd, przyjazd, czas;
};
int main() {
    int n;
    cin >> n;
    vector<Pociag> v(n);
    char c;
    for (int i = 0; i < n; i++) {
        int h1, m1, h2, m2;
        cin >> v[i].nazwa >> h1 >> c >> m1 >> h2 >> c >> m2;
        v[i].odjazd = h1 * 60 + m1;
        v[i].przyjazd = h2 * 60 + m2;
        v[i].czas = v[i].przyjazd - v[i].odjazd;
        if (v[i].czas < 0) v[i].czas += 24 * 60;
    }
    int a = 0, b = 0;
    for (int i = 0; i < n; i++) {
        cout << v[i].nazwa << " " << v[i].czas / 60 << ":" << setw(2) << setfill('0') << v[i].czas % 60 << "\n";
        if (v[i].czas < v[a].czas) a = i;
        if (v[i].czas > v[b].czas) b = i;
    }
    cout << "najszybszy: " << v[a].nazwa << "\n";
    cout << "najwolniejszy: " << v[b].nazwa << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-punkty-w-prostokatach', krok: 9, level: 'latwe',
            title: 'Punkty w prostokątach',
            short: 'Prostokąty z metodą zawiera(x, y) i seria pytań: w ilu prostokątach leży punkt? Brzeg też się liczy.',
            tags: ['vector<Prostokat>', 'metoda bool', 'zliczanie'],
            statement: ['Na mapie zaznaczono n prostokątnych stref (boki równoległe do osi), każda podana lewym dolnym (x1, y1) i prawym górnym (x2, y2) rogiem. Dla każdego z q punktów wypisz, w ilu strefach leży — punkt na brzegu strefy też w niej leży.',
                'Zadeklaruj strukturę Prostokat z metodą bool zawiera(int x, int y).'],
            input_format: ['W pierwszym wierszu n, potem n wierszy: x1 y1 x2 y2.', 'Potem wiersz z q i q wierszy z punktami x y.'],
            output_format: ['q wierszy z liczbami stref.'],
            constraints: ['1 ≤ n, q ≤ 1000', '−10⁶ ≤ współrzędne ≤ 10⁶, x1 < x2, y1 < y2'],
            examples: [{ input: '3\n0 0 4 4\n2 2 6 5\n-1 3 1 8\n4\n3 3\n0 4\n5 5\n7 0', note: '(3, 3) leży w dwóch pierwszych strefach. (0, 4) — w pierwszej (brzeg) i w trzeciej. (5, 5) — na brzegu drugiej. (7, 0) — w żadnej.' }],
            hint: R`bool zawiera(int x, int y) { return x1 <= x && x <= x2 && y1 <= y && y <= y2; }. Dla każdego pytania przejdź po wszystkich strefach — n · q to najwyżej milion sprawdzeń.`,
            tests: (r) => {
                const d = (p, q) => `${p.length}\n${p.map((x) => x.join(' ')).join('\n')}\n${q.length}\n${q.map((x) => x.join(' ')).join('\n')}`;
                const pr = (n, m, dl) => Array.from({ length: n }, () => { const a = r.int(-m, m - 1), b = r.int(-m, m - 1); return [a, b, Math.min(m, a + r.int(1, dl)), Math.min(m, b + r.int(1, dl))]; });
                const pk = (q, m) => Array.from({ length: q }, () => [r.int(-m, m), r.int(-m, m)]);
                return [d([[0, 0, 1, 1]], [[0, 0], [1, 1], [2, 2], [0, 1]]), d(pr(10, 10, 6), pk(20, 11)), d(pr(1000, 1000000, 800000), pk(1000, 1000000)), d(pr(1000, 50, 20), pk(1000, 50))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                if (!L.slice(1, n + 1).every((l) => { const t = l.split(' ').map(Number); return t.length === 4 && t.every((x) => calk(x, -1e6, 1e6)) && t[0] < t[2] && t[1] < t[3]; })) return 'prostokat';
                const q = Number(L[n + 1]); if (!calk(q, 1, 1000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const t = l.split(' ').map(Number); return t.length === 2 && t.every((x) => calk(x, -1e6, 1e6)); }) ? null : 'punkt';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const p = L.slice(1, n + 1).map((l) => l.split(' ').map(Number));
                return L.slice(n + 2).map((l) => { const [x, y] = l.split(' ').map(Number); return String(p.filter((z) => z[0] <= x && x <= z[2] && z[1] <= y && y <= z[3]).length); }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Prostokat {
    int x1, y1, x2, y2;
    bool zawiera(int x, int y) {
        return x1 <= x && x <= x2 && y1 <= y && y <= y2;
    }
};
int main() {
    int n;
    cin >> n;
    vector<Prostokat> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].x1 >> v[i].y1 >> v[i].x2 >> v[i].y2;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int x, y, ile = 0;
        cin >> x >> y;
        for (Prostokat &p : v)
            if (p.zawiera(x, y)) ile++;
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-wspolna-czesc', krok: 9, level: 'latwe',
            title: 'Wspólna część prostokątów',
            short: 'Część wspólna dwóch prostokątów to też prostokąt: max z lewych brzegów i min z prawych. Funkcja dostaje dwie struktury i oddaje pole.',
            tags: ['funkcja z dwiema strukturami', 'max i min z brzegów', 'long long'],
            statement: ['Dla każdego z t testów dane są dwa prostokąty o bokach równoległych do osi (lewy dolny i prawy górny róg). Wypisz pole ich części wspólnej. Jeśli prostokąty się nie nakładają albo tylko stykają bokiem lub rogiem, pole wynosi 0.',
                'Napisz funkcję long long wspolne(const Prostokat &a, const Prostokat &b).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy osiem liczb: ax1 ay1 ax2 ay2 bx1 by1 bx2 by2.'],
            output_format: ['t wierszy z polami.'],
            constraints: ['1 ≤ t ≤ 1000', '−10⁹ ≤ współrzędne ≤ 10⁹, x1 < x2 i y1 < y2 w każdym prostokącie'],
            examples: [{ input: '3\n0 0 4 3 2 1 6 5\n0 0 2 2 2 0 4 2\n-5 -5 5 5 -1 -2 1 2', note: 'Pierwsze: wspólna część to x od 2 do 4 i y od 1 do 3 — pole 4. Drugie: prostokąty stykają się tylko bokiem. Trzecie: mały prostokąt leży w dużym — pole 2 · 4 = 8.' }],
            hint: R`Szerokość części wspólnej: max(0, min(a.x2, b.x2) - max(a.x1, b.x1)), tak samo wysokość. Pole może mieć 4 · 10¹⁸ — mieści się w long long, ale tylko na styk.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const pr = (m) => { const a = r.int(-m, m - 1), b = r.int(-m, m - 1); return [a, b, r.int(a + 1, m), r.int(b + 1, m)]; };
                return [d([[0, 0, 1, 1, 1, 1, 2, 2], [-1e9, -1e9, 1e9, 1e9, -1e9, -1e9, 1e9, 1e9]]), d(Array.from({ length: 20 }, () => [...pr(5), ...pr(5)])), d(Array.from({ length: 1000 }, () => [...pr(1e9), ...pr(1e9)])), d(Array.from({ length: 500 }, () => [...pr(30), ...pr(30)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1000) || t.length !== 1 + 8 * t[0]) return 't'; for (let i = 1; i < t.length; i += 4) { if (!t.slice(i, i + 4).every((x) => calk(x, -1e9, 1e9)) || t[i] >= t[i + 2] || t[i + 1] >= t[i + 3]) return 'prostokat'; } return null; },
            solve: (inp) => {
                const t = nums(inp).map(BigInt); const o = [];
                const mx = (a, b) => (a > b ? a : b), mn = (a, b) => (a < b ? a : b);
                for (let i = 1; i < t.length; i += 8) { const [a1, b1, a2, b2, c1, d1, c2, d2] = t.slice(i, i + 8); const w = mx(0n, mn(a2, c2) - mx(a1, c1)), hh = mx(0n, mn(b2, d2) - mx(b1, d1)); o.push(String(w * hh)); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Prostokat {
    long long x1, y1, x2, y2;
};
long long wspolne(const Prostokat &a, const Prostokat &b) {
    long long w = max(0LL, min(a.x2, b.x2) - max(a.x1, b.x1));
    long long h = max(0LL, min(a.y2, b.y2) - max(a.y1, b.y1));
    return w * h;
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        Prostokat a, b;
        cin >> a.x1 >> a.y1 >> a.x2 >> a.y2 >> b.x1 >> b.y1 >> b.x2 >> b.y2;
        cout << wspolne(a, b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-swiadectwo', krok: 9, level: 'latwe',
            title: 'Świadectwo z paskiem',
            short: 'Pasek: średnia co najmniej 4.75 i zachowanie co najmniej bardzo dobre. Warunek bez double: suma · 4 ≥ 19 · liczba ocen.',
            tags: ['warunek na kilku polach', 'porównanie bez double', 'sort średnich'],
            statement: ['Każdy z n uczniów ma imię, ocenę z zachowania (wzorowe, bardzo_dobre, dobre, poprawne, nieodpowiednie albo naganne) i m ocen z przedmiotów (od 1 do 6). Świadectwo z paskiem dostaje uczeń, którego średnia ocen z przedmiotów wynosi co najmniej 4.75, a zachowanie jest wzorowe albo bardzo dobre.',
                'Wypisz uczniów z paskiem od najwyższej średniej (przy równych — alfabetycznie), ze średnią z dwiema cyframi po kropce, a na końcu z paskiem: K. Średnią porównuj z 4.75 bez zaokrągleń: suma · 4 ≥ 19 · m.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z n kolejnych wierszy imię, zachowanie i m ocen.'],
            output_format: ['Wiersze IMIE SREDNIA dla uczniów z paskiem i wiersz z paskiem: K.'],
            constraints: ['1 ≤ n ≤ 1000, 1 ≤ m ≤ 15', 'Imiona są różne (od 1 do 20 znaków: litery i cyfry, pierwsza wielka).', 'Żadna średnia nie wypada dokładnie w połowie między dwoma wynikami z dwoma miejscami po przecinku.'],
            examples: [{ input: '4 4\nOla wzorowe 5 5 5 4\nKuba bardzo_dobre 6 6 5 5\nIga dobre 6 6 6 6\nAdam wzorowe 5 5 4 4', note: 'Ola: 19 / 4 = 4.75 — dokładnie próg, pasek jest. Kuba: 5.50. Iga ma 6.00, ale zachowanie tylko dobre. Adam: 4.50 — za mało.' }],
            hint: R`struct Uczen { string imie, zachowanie; int suma; };. Pasek: (u.zachowanie == "wzorowe" || u.zachowanie == "bardzo_dobre") && u.suma * 4 >= 19 * m. Wszyscy mają tyle samo ocen, więc średnie porównujesz po samej sumie.`,
            tests: (r) => {
                const ZA = ['wzorowe', 'bardzo_dobre', 'dobre', 'poprawne', 'nieodpowiednie', 'naganne'];
                const d = (m, a) => `${a.length} ${m}\n${a.map((x) => `${x[0]} ${x[1]} ${x[2].join(' ')}`).join('\n')}`;
                const uczen = (s, m, lo) => { for (;;) { const o = Array.from({ length: m }, () => r.int(lo, 6)); if (h.safe(o.reduce((a, b) => a + b, 0) / m, 2)) return [s, r.pick(ZA.slice(0, r() < 0.7 ? 2 : 6)), o]; } };
                const los = (n, m, lo) => { if (m === 8) m = 9; return [m, unikalneImiona(r, n).map((s) => uczen(s, m, lo))]; };
                const [m3, a3] = los(12, 5, 4), [m4, a4] = los(1000, 15, 3), [m5, a5] = los(300, 3, 4);
                return [d(1, [['Ala', 'naganne', [6]]]), d(4, [['B', 'wzorowe', [5, 5, 5, 4]], ['A', 'bardzo_dobre', [5, 4, 5, 5]], ['C', 'dobre', [6, 6, 6, 6]]]), d(m3, a3), d(m4, a4), d(m5, a5)];
            },
            check: (inp) => {
                const ZA = ['wzorowe', 'bardzo_dobre', 'dobre', 'poprawne', 'nieodpowiednie', 'naganne'];
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); if (!calk(n, 1, 1000) || !calk(m, 1, 15) || L.length !== n + 1) return 'n'; const s = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== m + 2 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || s.has(t[0]) || !ZA.includes(t[1])) return 'dane'; s.add(t[0]); const o = t.slice(2).map(Number); if (!o.every((x) => calk(x, 1, 6))) return 'oceny'; if (!h.safe(o.reduce((a, b) => a + b, 0) / m, 2)) return 'polowka'; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const m = Number(L[0].split(' ')[1]);
                const u = L.slice(1).map((l) => { const t = l.split(' '); return [t[0], t[1], t.slice(2).reduce((a, b) => a + Number(b), 0)]; }).filter((x) => (x[1] === 'wzorowe' || x[1] === 'bardzo_dobre') && x[2] * 4 >= 19 * m);
                return [...sortuj(u, (x) => [x[2], x[0]], [-1, 1]).map((x) => `${x[0]} ${h.fx(x[2] / m, 2)}`), `z paskiem: ${u.length}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie, zachowanie;
    int suma;
};
int main() {
    int n, m;
    cin >> n >> m;
    vector<Uczen> pasek;
    for (int i = 0; i < n; i++) {
        Uczen u;
        cin >> u.imie >> u.zachowanie;
        u.suma = 0;
        for (int j = 0; j < m; j++) {
            int o;
            cin >> o;
            u.suma += o;
        }
        bool zach = u.zachowanie == "wzorowe" || u.zachowanie == "bardzo_dobre";
        if (zach && u.suma * 4 >= 19 * m) pasek.push_back(u);
    }
    sort(pasek.begin(), pasek.end(), [](const Uczen &a, const Uczen &b) {
        if (a.suma != b.suma) return a.suma > b.suma;
        return a.imie < b.imie;
    });
    cout << fixed << setprecision(2);
    for (const Uczen &u : pasek) cout << u.imie << " " << (double)u.suma / m << "\n";
    cout << "z paskiem: " << pasek.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-wydatki', krok: 9, level: 'latwe',
            title: 'Wydatki według kategorii',
            short: 'Zakupy sumujesz po kategoriach w mapie, a potem przepisujesz do vectora struktur, żeby posortować po kwocie.',
            tags: ['map do sumowania', 'vector struktur do sortowania', 'format Z.GG'],
            statement: ['Rodzina zapisuje zakupy: nazwę produktu, kategorię, cenę za sztukę w groszach i liczbę sztuk. Policz, ile wydano w każdej kategorii, i wypisz kategorie od największych wydatków (przy równych kwotach — alfabetycznie), a na końcu łączną kwotę.',
                'Sumy po kategoriach zbierz w map<string, long long>, a potem przepisz je do vectora struktur { kategoria, suma } i posortuj.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy produkt, kategoria, cena w groszach i liczba sztuk.'],
            output_format: ['Wiersze KATEGORIA: Z.GG i wiersz razem: Z.GG.'],
            constraints: ['1 ≤ n ≤ 2000', 'Produkty i kategorie mają od 1 do 15 małych liter.', '1 ≤ cena ≤ 10⁶, 1 ≤ sztuki ≤ 100'],
            examples: [{ input: '5\nmleko spozywcze 349 2\nzeszyt szkolne 450 4\nchleb spozywcze 599 1\nkredki szkolne 1200 1\nbilet transport 340 2', note: 'Spożywcze: 6.98 + 5.99 = 12.97. Szkolne: 18.00 + 12.00 = 30.00. Transport: 6.80. Razem 49.77.' }],
            hint: R`map<string, long long> suma; suma[kategoria] += 1LL * cena * sztuki;. Potem vector<Kategoria> v; for (auto [k, s] : suma) v.push_back({k, s}); i sort po s malejąco, a przy remisie po nazwie.`,
            tests: (r) => {
                const KAT = ['spozywcze', 'szkolne', 'transport', 'chemia', 'ubrania', 'rozrywka', 'zdrowie', 'dom', 'prezenty', 'sport'];
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, k, mc) => Array.from({ length: n }, () => [r.pick(PRODUKTY), r.pick(KAT.slice(0, k)), r.int(1, mc), r.int(1, 100)]);
                return [d([['woda', 'spozywcze', 1, 1]]), d([['a', 'b', 100, 1], ['c', 'a', 50, 2], ['d', 'c', 1, 100]]), d(los(15, 4, 3000)), d(los(2000, 10, 1000000)), d(los(500, 3, 10))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 4 && czyMale(t[0], 15) && czyMale(t[1], 15) && calk(Number(t[2]), 1, 1e6) && calk(Number(t[3]), 1, 100); }) ? null : 'dane'; },
            solve: (inp) => {
                const m = new Map(); let s = 0;
                for (const l of linie(inp).slice(1)) { const t = l.split(' '); const w = Number(t[2]) * Number(t[3]); m.set(t[1], (m.get(t[1]) || 0) + w); s += w; }
                return [...sortuj([...m.entries()], (x) => [x[1], x[0]], [-1, 1]).map((x) => `${x[0]}: ${zl(x[1])}`), `razem: ${zl(s)}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Kategoria {
    string nazwa;
    long long suma;
};
void kwota(long long g) {
    cout << g / 100 << "." << setw(2) << setfill('0') << g % 100 << "\n";
}
int main() {
    int n;
    cin >> n;
    map<string, long long> suma;
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        string produkt, kat;
        long long cena, szt;
        cin >> produkt >> kat >> cena >> szt;
        suma[kat] += cena * szt;
        razem += cena * szt;
    }
    vector<Kategoria> v;
    for (auto [k, s] : suma) v.push_back({k, s});
    sort(v.begin(), v.end(), [](const Kategoria &a, const Kategoria &b) {
        if (a.suma != b.suma) return a.suma > b.suma;
        return a.nazwa < b.nazwa;
    });
    for (const Kategoria &k : v) {
        cout << k.nazwa << ": ";
        kwota(k.suma);
    }
    cout << "razem: ";
    kwota(razem);
    return 0;
}`,
        },
        {
            id: 'st-b-dni-miedzy-datami', krok: 9, level: 'latwe',
            title: 'Ile dni między datami?',
            short: 'Funkcja zamienia datę na numer dnia „od początku kalendarza”. Wtedy różnica dat to zwykłe odejmowanie dwóch liczb.',
            tags: ['struct Data', 'funkcja numer dnia', 'lata przestępne'],
            statement: ['Dla każdego z t zapytań podano dwie daty (kalendarz gregoriański). Wypisz, ile dni dzieli te daty (zawsze liczbę nieujemną — kolejność dat nie ma znaczenia).',
                'Napisz funkcję long long numer(const Data &x), która oddaje numer dnia — na przykład liczbę dni od 1 stycznia roku 1 (1.01.0001 to dzień 1). Wtedy odpowiedź to |numer(a) − numer(b)|. Pamiętaj o latach przestępnych: rok podzielny przez 4 jest przestępny, chyba że dzieli się przez 100, ale nie przez 400.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie daty: d1 m1 r1 d2 m2 r2.'],
            output_format: ['t wierszy z liczbami dni.'],
            constraints: ['1 ≤ t ≤ 1000', 'Daty są poprawne, lata od 1600 do 2400.'],
            examples: [{ input: '3\n1 1 2024 1 1 2025\n1 3 2100 28 2 2100\n22 11 2026 14 7 1789', note: '2024 jest przestępny — 366 dni. W 2100 nie ma 29 lutego, więc 28.02 i 1.03 dzieli jeden dzień. Od zdobycia Bastylii do 22.11.2026 minęło 86 693 dni.' }],
            hint: R`Numer dnia: lata pełne przed rokiem r to (r − 1) · 365 plus dni przestępne: (r − 1) / 4 − (r − 1) / 100 + (r − 1) / 400. Do tego dni pełnych miesięcy roku r (luty liczy się po swojemu) i d.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                return [d([[1, 1, 1600, 31, 12, 2400], [29, 2, 2000, 29, 2, 2000]]), d([[28, 2, 1900, 1, 3, 1900], [28, 2, 2000, 1, 3, 2000], [31, 12, 1999, 1, 1, 2000]]), d(Array.from({ length: 30 }, () => [...losData(r, 2020, 2030), ...losData(r, 2020, 2030)])), d(Array.from({ length: 1000 }, () => [...losData(r, 1600, 2400), ...losData(r, 1600, 2400)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1000) || t.length !== 1 + 6 * t[0]) return 't'; for (let i = 1; i < t.length; i += 3) if (!P.czyPoprawnaData(t[i], t[i + 1], t[i + 2]) || !calk(t[i + 2], 1600, 2400)) return 'data'; return null; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 1; i < t.length; i += 6) o.push(String(Math.abs(P.numerDnia(t[i], t[i + 1], t[i + 2]) - P.numerDnia(t[i + 3], t[i + 4], t[i + 5])))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Data {
    int d, m, r;
};
bool przestepny(int r) {
    return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
}
long long numer(const Data &x) {
    const int dni[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    long long y = x.r - 1;
    long long n = y * 365 + y / 4 - y / 100 + y / 400;
    for (int k = 1; k < x.m; k++) {
        n += dni[k];
        if (k == 2 && przestepny(x.r)) n++;
    }
    return n + x.d;
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        Data a, b;
        cin >> a.d >> a.m >> a.r >> b.d >> b.m >> b.r;
        cout << llabs(numer(a) - numer(b)) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-talia-kart', krok: 9, level: 'latwe',
            title: 'Układanie kart',
            short: 'Karta to wartość i kolor. Napis „10H” zamieniasz na strukturę, sortujesz po kolorze i wartości, a wypisujesz z powrotem jako napis.',
            tags: ['parsowanie do struktury', 'klucz z funkcji', 'sort'],
            statement: ['Gracz ma w ręce k kart. Karta to wartość (2, 3, …, 10, J, Q, K, A) i kolor: C (trefl), D (karo), H (kier) albo S (pik), zapisane razem, np. 10H, QS, 2C, AD.',
                'Dla każdego z t rozdań wypisz karty ułożone według koloru w kolejności C, D, H, S, a w ramach koloru — od najmniejszej wartości (2 jest najmniejsza, A największa). Zamień każdą kartę na strukturę Karta { int wartosc; char kolor; } — wartość J to 11, Q 12, K 13, A 14.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy k i k kart.'],
            output_format: ['t wierszy z kartami po ułożeniu, oddzielonymi spacjami.'],
            constraints: ['1 ≤ t ≤ 100, 1 ≤ k ≤ 52', 'Karty mogą się powtarzać (gra się kilkoma taliami).'],
            examples: [{ input: '2\n5 10H QS 2C AD 9H\n3 AS 2S 10S', note: 'Najpierw trefl (2C), potem karo (AD), kier (9H, 10H) i pik (QS). W drugim rozdaniu same piki: 2, 10, A.' }],
            hint: R`Wartość to wszystko oprócz ostatniego znaku: string w = s.substr(0, s.size() - 1);, a kolor to s.back(). Kolejność kolorów: string("CDHS").find(kolor). Przy wypisywaniu zamień wartość z powrotem: 11 → J itd.`,
            tests: (r) => {
                const W = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'], K = ['C', 'D', 'H', 'S'];
                const karta = () => r.pick(W) + r.pick(K);
                const d = (a) => `${a.length}\n${a.map((x) => `${x.length} ${x.join(' ')}`).join('\n')}`;
                const talia = W.flatMap((w) => K.map((k) => w + k));
                return [d([['AS']]), d([r.shuffle(talia), ['10C', '2C', 'AC', 'JC', 'KC', 'QC']]), d(Array.from({ length: 10 }, () => Array.from({ length: r.int(1, 8) }, karta))), d(Array.from({ length: 100 }, () => Array.from({ length: 52 }, karta)))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 100) || L.length !== t + 1) return 't'; return L.slice(1).every((l) => { const x = l.split(' '); return calk(Number(x[0]), 1, 52) && x.length === Number(x[0]) + 1 && x.slice(1).every((c) => /^(10|[2-9JQKA])[CDHS]$/.test(c)); }) ? null : 'karty'; },
            solve: (inp) => {
                const W = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
                return linie(inp).slice(1).map((l) => sortuj(l.split(' ').slice(1), (c) => ['CDHS'.indexOf(c.slice(-1)), W.indexOf(c.slice(0, -1))]).join(' ')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Karta {
    int wartosc;
    char kolor;
};
Karta zNapisu(const string &s) {
    Karta k;
    k.kolor = s.back();
    string w = s.substr(0, s.size() - 1);
    if (w == "J") k.wartosc = 11;
    else if (w == "Q") k.wartosc = 12;
    else if (w == "K") k.wartosc = 13;
    else if (w == "A") k.wartosc = 14;
    else k.wartosc = stoi(w);
    return k;
}
string naNapis(const Karta &k) {
    string w;
    if (k.wartosc == 11) w = "J";
    else if (k.wartosc == 12) w = "Q";
    else if (k.wartosc == 13) w = "K";
    else if (k.wartosc == 14) w = "A";
    else w = to_string(k.wartosc);
    return w + k.kolor;
}
int main() {
    int t;
    cin >> t;
    const string KOLORY = "CDHS";
    for (int i = 0; i < t; i++) {
        int k;
        cin >> k;
        vector<Karta> v(k);
        for (int j = 0; j < k; j++) {
            string s;
            cin >> s;
            v[j] = zNapisu(s);
        }
        sort(v.begin(), v.end(), [&](const Karta &a, const Karta &b) {
            if (a.kolor != b.kolor) return KOLORY.find(a.kolor) < KOLORY.find(b.kolor);
            return a.wartosc < b.wartosc;
        });
        for (int j = 0; j < k; j++) cout << (j ? " " : "") << naNapis(v[j]);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-meta', krok: 9, level: 'latwe',
            title: 'Meta biegu',
            short: 'Każdy biegacz ma godzinę startu i mety (start falowy). Liczysz czas netto, sortujesz i drukujesz wyniki jako HH:MM:SS.',
            tags: ['czas w sekundach', 'sort z numerem jako remisem', 'format HH:MM:SS'],
            statement: ['W biegu ze startem falowym każdy zawodnik (numer, imię) ma własną godzinę startu i godzinę dobiegnięcia do mety (HH:MM:SS, ten sam dzień). Liczy się czas netto: meta − start.',
                'Wypisz wyniki: od najkrótszego czasu netto, przy równych czasach — od mniejszego numeru, w formacie MIEJSCE. NUMER IMIE HH:MM:SS (czas netto).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy numer, imię, start i meta.'],
            output_format: ['n wierszy z wynikami.'],
            constraints: ['1 ≤ n ≤ 800', 'Numery są różne, od 1 do 9999; imiona mają od 1 do 15 liter (pierwsza wielka).', 'Meta jest później niż start.'],
            examples: [{ input: '3\n12 Ola 09:00:00 09:41:20\n7 Kuba 09:05:00 09:44:59\n30 Iga 09:10:00 09:51:20', note: 'Czasy netto: Ola 41:20, Kuba 39:59, Iga 41:20. Ola i Iga remisują — wyżej Ola z mniejszym numerem.' }],
            hint: R`Godzinę HH:MM:SS wczytaj jako h, ':', m, ':', s i zamień na sekundy: h * 3600 + m * 60 + s. Czas netto = meta − start. Wypisanie: setw(2) << setfill('0') przed godzinami, minutami i sekundami.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => `${x[0]} ${x[1]} ${hhmmss(x[2])} ${hhmmss(x[3])}`).join('\n')}`;
                const los = (n, dl) => { const nr = r.shuffle(Array.from({ length: 9999 }, (_, i) => i + 1)).slice(0, n); return nr.map((k) => { const s = r.int(32400, 36000); return [k, imie(r), s, Math.min(86399, s + r.int(1, dl))]; }); };
                return [d([[1, 'Ala', 0, 86399]]), d([[3, 'A', 100, 200], [1, 'B', 150, 250], [2, 'C', 0, 100]]), d(los(15, 3000)), d(los(800, 20000)), d(los(400, 30))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 800) || L.length !== n + 1) return 'n'; const s = new Set(); const sek = (g) => { const m = g.match(/^(\d\d):(\d\d):(\d\d)$/); return m && Number(m[1]) < 24 && Number(m[2]) < 60 && Number(m[3]) < 60 ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : -1; };
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 4 || !calk(Number(t[0]), 1, 9999) || s.has(t[0]) || !czyImie(t[1], 15)) return 'dane'; s.add(t[0]); const a = sek(t[2]), b = sek(t[3]); if (a < 0 || b < 0 || b <= a) return 'czas'; }
                return null;
            },
            solve: (inp) => {
                const sek = (g) => { const [a, b, c] = g.split(':').map(Number); return a * 3600 + b * 60 + c; };
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [Number(t[0]), t[1], sek(t[3]) - sek(t[2])]; });
                return sortuj(u, (x) => [x[2], x[0]]).map((x, i) => `${i + 1}. ${x[0]} ${x[1]} ${hhmmss(x[2])}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Biegacz {
    int nr;
    string imie;
    int netto;
};
int sekundy() {
    int h, m, s;
    char c;
    cin >> h >> c >> m >> c >> s;
    return h * 3600 + m * 60 + s;
}
int main() {
    int n;
    cin >> n;
    vector<Biegacz> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i].nr >> v[i].imie;
        int start = sekundy();
        int meta = sekundy();
        v[i].netto = meta - start;
    }
    sort(v.begin(), v.end(), [](const Biegacz &a, const Biegacz &b) {
        if (a.netto != b.netto) return a.netto < b.netto;
        return a.nr < b.nr;
    });
    for (int i = 0; i < n; i++) {
        int t = v[i].netto;
        cout << i + 1 << ". " << v[i].nr << " " << v[i].imie << " ";
        cout << setfill('0') << setw(2) << t / 3600 << ":" << setw(2) << t / 60 % 60 << ":" << setw(2) << t % 60 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-bagaz', krok: 9, level: 'latwe',
            title: 'Odprawa bagażowa',
            short: 'Pasażer ma klasę i wagę bagażu, a od klasy zależą limit i stawka za nadwagę. Dopłaty, suma i najcięższy bagaż — w jednym przejściu.',
            tags: ['warunek zależny od pola', 'najlepszy rekord', 'suma'],
            statement: ['Na lotnisku odprawia się n pasażerów: imię, klasę (E — ekonomiczna albo B — biznes) i wagę bagażu w kilogramach. W klasie ekonomicznej limit to 20 kg, a za każdy kilogram ponad limit płaci się 40 zł; w biznesowej limit to 32 kg, a dopłata — 25 zł za kilogram.',
                'Wypisz pasażerów, którzy muszą dopłacić (w kolejności odprawy), z kwotą dopłaty, potem liczbę takich pasażerów i sumę dopłat, a na końcu pasażera z najcięższym bagażem (przy remisie — pierwszego).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, klasa i waga.'],
            output_format: ['Wiersze IMIE: X zl, potem doplaty: K pasazerow, razem Y zl i najciezszy bagaz: IMIE (W kg).'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona mają od 1 do 15 liter (pierwsza wielka).', '0 ≤ waga ≤ 100'],
            examples: [{ input: '4\nOla E 23\nKuba B 30\nIga B 35\nAdam E 20', note: 'Ola: 3 kg nadwagi · 40 zł = 120 zł. Iga: 3 kg · 25 zł = 75 zł. Kuba i Adam mieszczą się w limitach. Najcięższy bagaż ma Iga.' }],
            hint: R`struct Pasazer { string imie; char klasa; int waga; };. Dopłata: int limit = (p.klasa == 'E') ? 20 : 32, stawka = (p.klasa == 'E') ? 40 : 25; int dop = max(0, p.waga - limit) * stawka;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => Array.from({ length: n }, () => [imie(r), r.pick(['E', 'B']), r.int(lo, hi)]);
                return [d([['Ala', 'E', 0]]), d([['A', 'E', 20], ['B', 'B', 32], ['C', 'E', 21], ['D', 'B', 33], ['E', 'E', 100], ['F', 'B', 100]]), d(los(15, 10, 40)), d(los(1000, 0, 100)), d(los(300, 18, 24))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && czyImie(t[0], 15) && (t[1] === 'E' || t[1] === 'B') && calk(Number(t[2]), 0, 100); }) ? null : 'dane'; },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], t[1], Number(t[2])]; });
                const o = []; let k = 0, s = 0, best = u[0];
                for (const x of u) { const dop = Math.max(0, x[2] - (x[1] === 'E' ? 20 : 32)) * (x[1] === 'E' ? 40 : 25); if (dop > 0) { o.push(`${x[0]}: ${dop} zl`); k++; s += dop; } if (x[2] > best[2]) best = x; }
                o.push(`doplaty: ${k} pasazerow, razem ${s} zl`, `najciezszy bagaz: ${best[0]} (${best[2]} kg)`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pasazer {
    string imie;
    char klasa;
    int waga;
};
int doplata(const Pasazer &p) {
    int limit = (p.klasa == 'E') ? 20 : 32;
    int stawka = (p.klasa == 'E') ? 40 : 25;
    return max(0, p.waga - limit) * stawka;
}
int main() {
    int n;
    cin >> n;
    vector<Pasazer> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].imie >> v[i].klasa >> v[i].waga;
    int ile = 0, razem = 0;
    Pasazer najciezszy = v[0];
    for (const Pasazer &p : v) {
        int d = doplata(p);
        if (d > 0) {
            cout << p.imie << ": " << d << " zl\n";
            ile++;
            razem += d;
        }
        if (p.waga > najciezszy.waga) najciezszy = p;
    }
    cout << "doplaty: " << ile << " pasazerow, razem " << razem << " zl\n";
    cout << "najciezszy bagaz: " << najciezszy.imie << " (" << najciezszy.waga << " kg)\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · średnie
        {
            id: 'st-b-tabela-ligowa', krok: 9, level: 'srednie',
            title: 'Tabela ligowa',
            short: 'Wyniki meczów zamieniasz w tabelę: mapa drużyn ze strukturą statystyk, a potem sort po punktach, bilansie bramek, strzelonych i nazwie.',
            tags: ['map<string, Druzyna>', 'cztery kryteria sortowania', 'aktualizacja dwóch rekordów'],
            statement: ['W lidze rozegrano n meczów. Za zwycięstwo drużyna dostaje 3 punkty, za remis 1, za porażkę 0. Ułóż tabelę: od największej liczby punktów, przy równych punktach — od lepszego bilansu bramek (strzelone − stracone), potem od większej liczby strzelonych bramek, a na końcu alfabetycznie.',
                'Dla każdej drużyny wypisz liczbę meczów, punkty i bramki w formacie strzelone:stracone. Zadeklaruj struct Druzyna z polami nazwa, mecze, pkt, strzelone, stracone i trzymaj drużyny w map<string, Druzyna> — każdy mecz zmienia dwa rekordy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy mecz: A gA gB B — drużyna A strzeliła gA bramek, drużyna B — gB.'],
            output_format: ['Po jednym wierszu na drużynę: MIEJSCE. NAZWA mecze M, pkt P, bramki S:T.'],
            constraints: ['1 ≤ n ≤ 2000', 'Nazwy drużyn mają od 1 do 15 liter (pierwsza wielka); w meczu A ≠ B.', '0 ≤ gA, gB ≤ 20'],
            examples: [{ input: '4\nOrly 2 1 Sokoly\nSokoly 3 0 Jastrzebie\nJastrzebie 1 1 Orly\nSokoly 1 1 Orly', note: 'Orły: wygrana i dwa remisy — 5 pkt, bramki 4:3. Sokoły: wygrana, remis i porażka — 4 pkt, 5:3. Jastrzębie: 1 pkt, 1:4.' }],
            hint: R`map<string, Druzyna> t; Druzyna &a = t[A]; a.nazwa = A; Druzyna &b = t[B]; b.nazwa = B; — referencje & pozwalają wygodnie zmieniać rekord w mapie. Po wszystkich meczach przepisz drużyny do vector<Druzyna> i posortuj komparatorem z czterema kryteriami.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const liga = (k, n, mg) => { const D = unikalneSlowa(r, k, 2, 4).map((s) => s[0].toUpperCase() + s.slice(1)); return Array.from({ length: n }, () => { const a = r.pick(D); let b = r.pick(D); while (b === a) b = r.pick(D); return [a, r.int(0, mg), r.int(0, mg), b]; }); };
                return [d([['A', 0, 0, 'B']]), d([['Cy', 1, 0, 'Ax'], ['Ax', 1, 0, 'Bz'], ['Bz', 1, 0, 'Cy'], ['Ax', 2, 2, 'Cy']]), d(liga(4, 12, 4)), d(liga(20, 2000, 6)), d(liga(8, 300, 1)), d(liga(50, 2000, 20))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 4 && czyImie(t[0], 15) && czyImie(t[3], 15) && t[0] !== t[3] && calk(Number(t[1]), 0, 20) && calk(Number(t[2]), 0, 20); }) ? null : 'mecz'; },
            solve: (inp) => {
                const T = new Map(); const g = (n) => { if (!T.has(n)) T.set(n, { n, m: 0, p: 0, s: 0, t: 0 }); return T.get(n); };
                for (const l of linie(inp).slice(1)) {
                    const [A, x, y, B] = l.split(' '); const a = g(A), b = g(B); const ga = Number(x), gb = Number(y);
                    a.m++; b.m++; a.s += ga; a.t += gb; b.s += gb; b.t += ga;
                    if (ga > gb) a.p += 3; else if (gb > ga) b.p += 3; else { a.p++; b.p++; }
                }
                return sortuj([...T.values()], (x) => [x.p, x.s - x.t, x.s, x.n], [-1, -1, -1, 1]).map((x, i) => `${i + 1}. ${x.n} mecze ${x.m}, pkt ${x.p}, bramki ${x.s}:${x.t}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Druzyna {
    string nazwa;
    int mecze = 0, pkt = 0, strzelone = 0, stracone = 0;
};
int main() {
    int n;
    cin >> n;
    map<string, Druzyna> t;
    for (int i = 0; i < n; i++) {
        string A, B;
        int ga, gb;
        cin >> A >> ga >> gb >> B;
        Druzyna &a = t[A];
        Druzyna &b = t[B];
        a.nazwa = A;
        b.nazwa = B;
        a.mecze++;
        b.mecze++;
        a.strzelone += ga;
        a.stracone += gb;
        b.strzelone += gb;
        b.stracone += ga;
        if (ga > gb) a.pkt += 3;
        else if (gb > ga) b.pkt += 3;
        else {
            a.pkt++;
            b.pkt++;
        }
    }
    vector<Druzyna> v;
    for (auto &[nazwa, d] : t) v.push_back(d);
    sort(v.begin(), v.end(), [](const Druzyna &a, const Druzyna &b) {
        if (a.pkt != b.pkt) return a.pkt > b.pkt;
        int ba = a.strzelone - a.stracone, bb = b.strzelone - b.stracone;
        if (ba != bb) return ba > bb;
        if (a.strzelone != b.strzelone) return a.strzelone > b.strzelone;
        return a.nazwa < b.nazwa;
    });
    for (int i = 0; i < (int)v.size(); i++)
        cout << i + 1 << ". " << v[i].nazwa << " mecze " << v[i].mecze << ", pkt " << v[i].pkt << ", bramki " << v[i].strzelone << ":" << v[i].stracone << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-ranking-olimpiady', krok: 9, level: 'srednie',
            title: 'Ranking olimpiady',
            short: 'Suma punktów, potem liczba zadań za 100 — a miejsca ex aequo tylko przy remisie w obu. Komparator i „czy lepszy” to ta sama myśl.',
            tags: ['dwa kryteria i ex aequo', 'tablica w strukturze', 'miejsca z sąsiadów'],
            statement: ['Na olimpiadzie n uczestników rozwiązywało k zadań; za każde dostali od 0 do 100 punktów. Uczestnik jest lepszy od drugiego, jeśli ma większą sumę punktów, a przy równej sumie — więcej zadań za pełne 100 punktów.',
                'Wypisz ranking: od najlepszego; uczestników równie dobrych (ta sama suma i ta sama liczba setek) wypisz alfabetycznie i daj im to samo miejsce. Miejsce uczestnika to 1 + liczba uczestników od niego lepszych.'],
            input_format: ['W pierwszym wierszu n i k.', 'W każdym z n kolejnych wierszy imię i k wyników.'],
            output_format: ['n wierszy: MIEJSCE. IMIE SUMA (pelne: C).'],
            constraints: ['1 ≤ n ≤ 1000, 1 ≤ k ≤ 10', 'Imiona są różne (od 1 do 20 znaków: litery i cyfry, pierwsza wielka).', 'Wyniki od 0 do 100.'],
            examples: [{ input: '4 3\nOla 100 50 100\nKuba 100 100 50\nIga 90 90 70\nAdam 100 100 0', note: 'Ola i Kuba: po 250 punktów i dwie setki — dzielą 1. miejsce. Iga też ma 250, ale bez setek — 3. miejsce. Adam: 200.' }],
            hint: R`Po sortowaniu (suma malejąco, pelne malejąco, imię rosnąco) miejsce wylicza się z sąsiada: if (i == 0 || v[i].suma != v[i - 1].suma || v[i].pelne != v[i - 1].pelne) miejsce = i + 1;.`,
            tests: (r) => {
                const d = (k, a) => `${a.length} ${k}\n${a.map((x) => `${x[0]} ${x[1].join(' ')}`).join('\n')}`;
                const los = (n, k, p) => unikalneImiona(r, n).map((s) => [s, Array.from({ length: k }, () => (r() < p ? 100 : r.int(0, 100)))]);
                const grube = (n, k) => unikalneImiona(r, n).map((s) => [s, Array.from({ length: k }, () => r.pick([0, 50, 100]))]);
                return [d(1, [['Ala', [0]]]), d(2, [['B', [100, 0]], ['A', [50, 50]], ['C', [0, 100]], ['D', [100, 0]]]), d(3, los(12, 3, 0.3)), d(10, los(1000, 10, 0.2)), d(4, grube(500, 4))];
            },
            check: (inp) => {
                const L = linie(inp); const [n, k] = L[0].split(' ').map(Number); if (!calk(n, 1, 1000) || !calk(k, 1, 10) || L.length !== n + 1) return 'n'; const s = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== k + 1 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || s.has(t[0]) || !t.slice(1).every((x) => calk(Number(x), 0, 100))) return 'dane'; s.add(t[0]); }
                return null;
            },
            solve: (inp) => {
                const u = sortuj(linie(inp).slice(1).map((l) => { const t = l.split(' '); const p = t.slice(1).map(Number); return [t[0], p.reduce((a, b) => a + b, 0), p.filter((x) => x === 100).length]; }), (x) => [x[1], x[2], x[0]], [-1, -1, 1]);
                let m = 0;
                return u.map((x, i) => { if (i === 0 || x[1] !== u[i - 1][1] || x[2] !== u[i - 1][2]) m = i + 1; return `${m}. ${x[0]} ${x[1]} (pelne: ${x[2]})`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczestnik {
    string imie;
    int suma, pelne;
};
int main() {
    int n, k;
    cin >> n >> k;
    vector<Uczestnik> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i].imie;
        v[i].suma = 0;
        v[i].pelne = 0;
        for (int j = 0; j < k; j++) {
            int p;
            cin >> p;
            v[i].suma += p;
            if (p == 100) v[i].pelne++;
        }
    }
    sort(v.begin(), v.end(), [](const Uczestnik &a, const Uczestnik &b) {
        if (a.suma != b.suma) return a.suma > b.suma;
        if (a.pelne != b.pelne) return a.pelne > b.pelne;
        return a.imie < b.imie;
    });
    int miejsce = 0;
    for (int i = 0; i < n; i++) {
        if (i == 0 || v[i].suma != v[i - 1].suma || v[i].pelne != v[i - 1].pelne) miejsce = i + 1;
        cout << miejsce << ". " << v[i].imie << " " << v[i].suma << " (pelne: " << v[i].pelne << ")\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-biblioteka', krok: 9, level: 'srednie',
            title: 'Biblioteka i kary',
            short: 'Mapa tytuł → wypożyczenie (kto i kiedy) i mapa kar czytelników. Zwrot po terminie nalicza karę; na końcu dwa posortowane raporty.',
            tags: ['map<string, Wypozyczenie>', 'kary w drugiej mapie', 'dwa raporty'],
            statement: ['Biblioteka ma po jednym egzemplarzu każdej książki. Polecenia przychodzą w kolejności dni (numery dni nie maleją): WYPOZYCZ dzien czytelnik tytul — jeśli książka jest akurat wypożyczona, wypisz niedostepna: TYTUL; ZWROC dzien tytul — jeśli książka nie jest wypożyczona, wypisz nie byla wypozyczona: TYTUL.',
                'Książkę można trzymać 14 dni. Jeśli od wypożyczenia do zwrotu minęło więcej niż 14 dni, czytelnik dostaje karę 50 groszy za każdy dzień ponad 14. Na końcu wypisz kary (od największej, przy równych — alfabetycznie), a potem książki, które wciąż są wypożyczone (alfabetycznie, z czytelnikiem).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Komunikaty z poleceń, potem wiersz kary: i wiersze CZYTELNIK Z.GG (albo kary: brak), a potem wiersz wypozyczone: i wiersze TYTUL - CZYTELNIK (albo wypozyczone: brak).'],
            constraints: ['1 ≤ q ≤ 2000', '1 ≤ dzien ≤ 10 000, dni nie maleją', 'Tytuły mają od 1 do 20 znaków (małe litery i _), czytelnicy od 1 do 15 liter (pierwsza wielka).'],
            examples: [{ input: '6\nWYPOZYCZ 1 Ola hobbit\nWYPOZYCZ 3 Kuba hobbit\nWYPOZYCZ 3 Kuba lalka\nZWROC 20 hobbit\nZWROC 21 dziady\nWYPOZYCZ 22 Kuba hobbit', note: 'Ola oddała Hobbita po 19 dniach — 5 dni spóźnienia, kara 2.50. Lalka i Hobbit zostają u Kuby.' }],
            hint: R`struct Wypozyczenie { string czytelnik; int dzien; }; map<string, Wypozyczenie> u; — tytuł prowadzi do rekordu. Przy zwrocie: int dni = d - u[t].dzien; if (dni > 14) kara[u[t].czytelnik] += (dni - 14) * 50; i u.erase(t);. Kary przepisz do vectora i posortuj.`,
            tests: (r) => {
                const TYT = ['hobbit', 'lalka', 'dziady', 'potop', 'solaris', 'wesele', 'chlopi', 'krzyzacy', 'pan_tadeusz', 'quo_vadis', 'cyberiada', 'bajki', 'balladyna', 'kordian', 'zemsta'];
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                const sesja = (q, osob, ks, krok) => { const O = unikalneImiona(r, osob); const K = TYT.slice(0, ks); let dz = 1; return Array.from({ length: q }, () => { dz += r.int(0, krok); dz = Math.min(dz, 10000); return r() < 0.55 ? `WYPOZYCZ ${dz} ${r.pick(O)} ${r.pick(K)}` : `ZWROC ${dz} ${r.pick(K)}`; }); };
                return [d(['ZWROC 1 lalka']), d(['WYPOZYCZ 1 Ala lalka', 'ZWROC 15 lalka', 'WYPOZYCZ 15 Ala lalka', 'ZWROC 30 lalka', 'WYPOZYCZ 30 Ola potop', 'WYPOZYCZ 30 Ela hobbit', 'ZWROC 100 potop', 'ZWROC 100 hobbit']), d(sesja(25, 4, 5, 4)), d(sesja(2000, 30, 15, 5)), d(sesja(500, 3, 3, 10))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q'; let pd = 0;
                for (const l of L.slice(1)) { const t = l.split(' '); let dz; if (t[0] === 'WYPOZYCZ' && t.length === 4 && czyImie(t[2], 15) && /^[a-z_]{1,20}$/.test(t[3])) dz = Number(t[1]); else if (t[0] === 'ZWROC' && t.length === 3 && /^[a-z_]{1,20}$/.test(t[2])) dz = Number(t[1]); else return 'polecenie'; if (!calk(dz, 1, 10000) || dz < pd) return 'dzien'; pd = dz; }
                return null;
            },
            solve: (inp) => {
                const U = new Map(), K = new Map(); const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'WYPOZYCZ') { if (U.has(t[3])) o.push(`niedostepna: ${t[3]}`); else U.set(t[3], [t[2], Number(t[1])]); }
                    else if (!U.has(t[2])) o.push(`nie byla wypozyczona: ${t[2]}`);
                    else { const [c, dz] = U.get(t[2]); const dni = Number(t[1]) - dz; if (dni > 14) K.set(c, (K.get(c) || 0) + (dni - 14) * 50); U.delete(t[2]); }
                }
                const kary = sortuj([...K.entries()], (x) => [x[1], x[0]], [-1, 1]);
                if (kary.length) { o.push('kary:'); for (const [c, k] of kary) o.push(`${c} ${zl(k)}`); } else o.push('kary: brak');
                const w = [...U.keys()].sort(cmpS);
                if (w.length) { o.push('wypozyczone:'); for (const t of w) o.push(`${t} - ${U.get(t)[0]}`); } else o.push('wypozyczone: brak');
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Wypozyczenie {
    string czytelnik;
    int dzien;
};
struct Kara {
    string czytelnik;
    long long grosze;
};
int main() {
    int q;
    cin >> q;
    map<string, Wypozyczenie> u;
    map<string, long long> kara;
    for (int i = 0; i < q; i++) {
        string op, tytul;
        int d;
        cin >> op >> d;
        if (op == "WYPOZYCZ") {
            string kto;
            cin >> kto >> tytul;
            if (u.count(tytul)) cout << "niedostepna: " << tytul << "\n";
            else u[tytul] = {kto, d};
        } else {
            cin >> tytul;
            if (!u.count(tytul)) {
                cout << "nie byla wypozyczona: " << tytul << "\n";
            } else {
                int dni = d - u[tytul].dzien;
                if (dni > 14) kara[u[tytul].czytelnik] += (dni - 14) * 50;
                u.erase(tytul);
            }
        }
    }
    vector<Kara> v;
    for (auto [kto, g] : kara) v.push_back({kto, g});
    sort(v.begin(), v.end(), [](const Kara &a, const Kara &b) {
        if (a.grosze != b.grosze) return a.grosze > b.grosze;
        return a.czytelnik < b.czytelnik;
    });
    if (v.empty()) cout << "kary: brak\n";
    else {
        cout << "kary:\n";
        for (const Kara &k : v) cout << k.czytelnik << " " << k.grosze / 100 << "." << setw(2) << setfill('0') << k.grosze % 100 << "\n";
    }
    if (u.empty()) cout << "wypozyczone: brak\n";
    else {
        cout << "wypozyczone:\n";
        for (auto &[tytul, w] : u) cout << tytul << " - " << w.czytelnik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-najblizsza-para', krok: 9, level: 'srednie',
            title: 'Najbliższa para',
            short: 'Sprawdzasz wszystkie pary punktów i pamiętasz najlepszą — rekord z dwoma indeksami i odległością. Remisy rozstrzyga kolejność indeksów.',
            tags: ['wszystkie pary', 'rekord z indeksami', 'kwadrat odległości'],
            statement: ['Na mapie jest n miejsc z nazwami i współrzędnymi. Znajdź dwa miejsca położone najbliżej siebie (w zwykłej odległości, ale wystarczy porównywać kwadraty odległości: dx² + dy²). Wypisz ich nazwy (najpierw to, które było wcześniej na liście) i kwadrat odległości.',
                'Jeśli kilka par jest równie blisko, wybierz parę (i, j), i < j, o najmniejszym i, a przy równym i — o najmniejszym j. Przy n ≤ 2000 wystarczy sprawdzić wszystkie pary.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa i współrzędne x y.'],
            output_format: ['Jeden wiersz: NAZWA1 NAZWA2 D.'],
            constraints: ['2 ≤ n ≤ 2000', 'Nazwy są różne, mają od 1 do 12 małych liter.', '−10⁶ ≤ x, y ≤ 10⁶; miejsca mogą leżeć w tym samym punkcie.'],
            examples: [{ input: '4\nszkola 0 0\nkino 5 5\nsklep 3 4\npark 8 9', note: 'Kwadraty odległości: szkoła–sklep 25, kino–sklep 5, kino–park 25 … Najbliżej są kino i sklep: 2² + 1² = 5.' }],
            hint: R`Dwie pętle: for i, for j > i. Najlepszą parę trzymaj w strukturze { int i, j; long long d; } i podmieniaj tylko przy ostrym <, wtedy remisy rozstrzygną się same. dx² + dy² dochodzi do 8 · 10¹² — long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => unikalneSlowa(r, n, 1, 5).map((s) => [s, r.int(-m, m), r.int(-m, m)]);
                return [d([['a', 0, 0], ['b', 0, 0]]), d([['a', -1000000, -1000000], ['b', 1000000, 1000000]]), d([['a', 0, 0], ['b', 1, 0], ['c', 0, 1], ['d', 1, 1]]), d(los(30, 20)), d(los(2000, 1000000)), d(los(2000, 30))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 2, 2000) || L.length !== n + 1) return 'n'; const s = new Set(); for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 3 || !czyMale(t[0], 12) || s.has(t[0]) || !calk(Number(t[1]), -1e6, 1e6) || !calk(Number(t[2]), -1e6, 1e6)) return 'dane'; s.add(t[0]); } return null; },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1]), Number(t[2])]; });
                let bi = 0, bj = 1, bd = Infinity;
                for (let i = 0; i < u.length; i++) for (let j = i + 1; j < u.length; j++) { const dx = u[i][1] - u[j][1], dy = u[i][2] - u[j][2]; const dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; bi = i; bj = j; } }
                return `${u[bi][0]} ${u[bj][0]} ${bd}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Miejsce {
    string nazwa;
    long long x, y;
};
struct Para {
    int i, j;
    long long d;
};
int main() {
    int n;
    cin >> n;
    vector<Miejsce> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].nazwa >> v[i].x >> v[i].y;
    Para best = {0, 1, -1};
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            long long dx = v[i].x - v[j].x, dy = v[i].y - v[j].y;
            long long d = dx * dx + dy * dy;
            if (best.d == -1 || d < best.d) best = {i, j, d};
        }
    }
    cout << v[best.i].nazwa << " " << v[best.j].nazwa << " " << best.d << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-kolejka-do-lekarza', krok: 9, level: 'srednie',
            title: 'Kolejka do lekarza',
            short: 'Pacjenci przychodzą o różnych porach, lekarz przyjmuje po kolei. Sortujesz po godzinie przyjścia i symulujesz: wizyta zaczyna się, gdy lekarz jest wolny i pacjent już jest.',
            tags: ['sort i symulacja', 'max(wolny, przyjście)', 'najdłuższe czekanie'],
            statement: ['Lekarz zaczyna przyjmować o 08:00. Pacjenci są przyjmowani w kolejności przyjścia (przy tej samej godzinie — alfabetycznie). Wizyta pacjenta zaczyna się wtedy, gdy lekarz jest wolny i pacjent już przyszedł, i trwa podaną liczbę minut.',
                'Wypisz pacjentów w kolejności przyjmowania: imię, godziny wizyty i ile minut pacjent czekał (od przyjścia do początku wizyty). Na końcu wypisz, kto czekał najdłużej (przy remisie — przyjęty wcześniej). Pacjenci są podani w przypadkowej kolejności.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, godzina przyjścia HH:MM i długość wizyty w minutach.'],
            output_format: ['n wierszy IMIE HH:MM-HH:MM, czekal W min i wiersz najdluzej czekal: IMIE (W min).'],
            constraints: ['1 ≤ n ≤ 60', 'Imiona są różne (od 1 do 20 znaków: litery i cyfry, pierwsza wielka).', '1 ≤ długość wizyty ≤ 30', 'Wszystkie wizyty kończą się najpóźniej o 23:59.'],
            examples: [{ input: '4\nOla 08:10 20\nKuba 07:45 15\nIga 08:10 10\nAdam 09:00 5', note: 'Kuba przyszedł przed otwarciem: wizyta 08:00–08:15, czekał 15 minut. Iga i Ola przyszły o 08:10 — alfabetycznie najpierw Iga: 08:15–08:25. Ola: 08:25–08:45. Adam wchodzi od razu o 09:00.' }],
            hint: R`Posortuj pacjentów po (przyjście, imię). int wolny = 8 * 60; dla każdego: int start = max(wolny, p.przyjscie); int koniec = start + p.czas; czekal = start - p.przyjscie; wolny = koniec;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => `${x[0]} ${hhmm(x[1])} ${x[2]}`).join('\n')}`;
                const los = (n, lo, hi, mc) => { for (;;) { const a = unikalneImiona(r, n).map((s) => [s, r.int(lo, hi), r.int(1, mc)]); const s = a.slice().sort((x, y) => x[1] - y[1] || (x[0] < y[0] ? -1 : 1)); let w = 480; for (const x of s) w = Math.max(w, x[1]) + x[2]; if (w <= 1439) return a; } };
                return [d([['Ala', 0, 1]]), d([['B', 480, 30], ['A', 480, 30], ['C', 400, 1], ['D', 1400, 30]]), d(los(10, 420, 600, 30)), d(los(60, 420, 900, 15)), d(los(40, 470, 490, 20))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 60) || L.length !== n + 1) return 'n'; const s = new Set(); const u = [];
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 3 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || s.has(t[0]) || !czyGodz(t[1]) || !calk(Number(t[2]), 1, 30)) return 'dane'; s.add(t[0]); u.push([t[0], minuty(t[1]), Number(t[2])]); }
                u.sort((x, y) => x[1] - y[1] || cmpS(x[0], y[0])); let w = 480; for (const x of u) w = Math.max(w, x[1]) + x[2];
                return w <= 1439 ? null : 'po polnocy';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], minuty(t[1]), Number(t[2])]; }).sort((x, y) => x[1] - y[1] || cmpS(x[0], y[0]));
                let w = 480; const o = []; let best = null;
                for (const x of u) { const s = Math.max(w, x[1]); w = s + x[2]; const c = s - x[1]; o.push(`${x[0]} ${hhmm(s)}-${hhmm(w)}, czekal ${c} min`); if (!best || c > best[1]) best = [x[0], c]; }
                o.push(`najdluzej czekal: ${best[0]} (${best[1]} min)`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Pacjent {
    string imie;
    int przyjscie, czas;
};
void godzina(int t) {
    cout << setfill('0') << setw(2) << t / 60 << ":" << setw(2) << t % 60;
}
int main() {
    int n;
    cin >> n;
    vector<Pacjent> v(n);
    char c;
    for (int i = 0; i < n; i++) {
        int h, m;
        cin >> v[i].imie >> h >> c >> m >> v[i].czas;
        v[i].przyjscie = h * 60 + m;
    }
    sort(v.begin(), v.end(), [](const Pacjent &a, const Pacjent &b) {
        if (a.przyjscie != b.przyjscie) return a.przyjscie < b.przyjscie;
        return a.imie < b.imie;
    });
    int wolny = 8 * 60, najdluzej = -1;
    string kto;
    for (const Pacjent &p : v) {
        int start = max(wolny, p.przyjscie);
        int koniec = start + p.czas;
        int czekal = start - p.przyjscie;
        cout << p.imie << " ";
        godzina(start);
        cout << "-";
        godzina(koniec);
        cout << ", czekal " << czekal << " min\n";
        if (czekal > najdluzej) {
            najdluzej = czekal;
            kto = p.imie;
        }
        wolny = koniec;
    }
    cout << "najdluzej czekal: " << kto << " (" << najdluzej << " min)\n";
    return 0;
}`,
        },
        {
            id: 'st-b-wybory', krok: 9, level: 'srednie',
            title: 'Wybory do samorządu',
            short: 'Kandydaci z komitetami, głosy na nazwiska i głosy nieważne. Procenty liczysz na liczbach całkowitych, a wyniki sortujesz dwa razy: kandydatów i komitety.',
            tags: ['map nazwa → indeks', 'procent bez double', 'dwa rankingi'],
            statement: ['W wyborach startuje c kandydatów; każdy ma imię i komitet. Oddano v głosów — każdy to imię kandydata. Głos na imię, którego nie ma na liście, jest nieważny.',
                'Wypisz kandydatów od największej liczby głosów (przy remisie — alfabetycznie) z komitetem, liczbą głosów i procentem ważnych głosów obciętym (nie zaokrąglonym) do dwóch miejsc po przecinku. Potem wypisz komitety z sumą głosów ich kandydatów (od największej, przy remisie — alfabetycznie), a na końcu liczbę głosów nieważnych. Gdy nie ma żadnego ważnego głosu, procent to 0.00.'],
            input_format: ['W pierwszym wierszu c, potem c wierszy: imię i komitet.', 'Potem wiersz z v i v wierszy z głosami.'],
            output_format: ['c wierszy IMIE (KOMITET): G glosow, P%, potem wiersze KOMITET: G glosow i wiersz niewazne: K.'],
            constraints: ['1 ≤ c ≤ 100, 1 ≤ v ≤ 5000', 'Imiona kandydatów są różne; imiona i komitety mają od 1 do 15 liter (pierwsza wielka). Głos to słowo z liter, od 1 do 15.'],
            examples: [{ input: '3\nOla Zieloni\nKuba Niebiescy\nIga Zieloni\n6\nOla\nKuba\nOla\nZosia\nIga\nKuba', note: 'Zosi nie ma na liście — głos nieważny. Ważnych 5: Ola i Kuba po 2 (40.00%), Iga 1 (20.00%). Zieloni 3, Niebiescy 2.' }],
            hint: R`Procent obcięty do setnych: long long p = 10000LL * glosy / wazne; cout << p / 100 << "." << setw(2) << setfill('0') << p % 100;. Indeks kandydata po imieniu najprościej trzymać w map<string, int>.`,
            tests: (r) => {
                const KOM = ['Zieloni', 'Niebiescy', 'Czerwoni', 'Zolci', 'Fioletowi', 'Pomaranczowi', 'Srebrni'];
                const d = (k, g) => `${k.length}\n${k.map((x) => x.join(' ')).join('\n')}\n${g.length}\n${g.join('\n')}`;
                const los = (c, v, pz, km) => { const K = unikalneSlowa(r, c, 2, 4).map((s) => [s[0].toUpperCase() + s.slice(1), r.pick(KOM.slice(0, km))]); const wagi = K.map(() => r.int(1, 10)); const S = wagi.reduce((a, b) => a + b, 0); const g = Array.from({ length: v }, () => { if (r() < pz) return r.pick(IMIONA) + 'x'; let x = r.int(1, S); for (let i = 0; i < K.length; i++) { x -= wagi[i]; if (x <= 0) return K[i][0]; } return K[0][0]; }); return [K, g]; };
                const t = [d([['Ala', 'Zieloni']], ['Ola']), d([['B', 'X'], ['A', 'Y'], ['C', 'X']], ['A', 'B', 'C', 'A', 'B', 'C', 'Q'])];
                for (const [c, v, pz, km] of [[5, 30, 0.1, 3], [100, 5000, 0.05, 7], [20, 3000, 0.3, 2], [7, 3, 0, 7]]) { const [k, g] = los(c, v, pz, km); t.push(d(k, g)); }
                return t;
            },
            check: (inp) => {
                const L = linie(inp); const c = Number(L[0]); if (!calk(c, 1, 100)) return 'c'; const s = new Set();
                for (const l of L.slice(1, c + 1)) { const t = l.split(' '); if (t.length !== 2 || !czyImie(t[0], 15) || !czyImie(t[1], 15) || s.has(t[0])) return 'kandydat'; s.add(t[0]); }
                const v = Number(L[c + 1]); if (!calk(v, 1, 5000) || L.length !== c + 2 + v) return 'v';
                return L.slice(c + 2).every((g) => /^[A-Za-z]{1,15}$/.test(g)) ? null : 'glos';
            },
            solve: (inp) => {
                const L = linie(inp); const c = Number(L[0]); const K = L.slice(1, c + 1).map((l) => { const t = l.split(' '); return { n: t[0], k: t[1], g: 0 }; });
                const idx = new Map(K.map((x, i) => [x.n, i])); let niew = 0;
                for (const g of L.slice(c + 2)) { if (idx.has(g)) K[idx.get(g)].g++; else niew++; }
                const W = K.reduce((a, x) => a + x.g, 0);
                const pr = (g) => { if (!W) return '0.00'; const p = Math.floor((10000 * g) / W); return `${Math.floor(p / 100)}.${pad2(p % 100)}`; };
                const kom = new Map(); for (const x of K) kom.set(x.k, (kom.get(x.k) || 0) + x.g);
                return [...sortuj(K, (x) => [x.g, x.n], [-1, 1]).map((x) => `${x.n} (${x.k}): ${x.g} glosow, ${pr(x.g)}%`), ...sortuj([...kom.entries()], (x) => [x[1], x[0]], [-1, 1]).map((x) => `${x[0]}: ${x[1]} glosow`), `niewazne: ${niew}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Kandydat {
    string imie, komitet;
    int glosy = 0;
};
struct Komitet {
    string nazwa;
    int glosy;
};
int main() {
    int c;
    cin >> c;
    vector<Kandydat> k(c);
    map<string, int> indeks;
    for (int i = 0; i < c; i++) {
        cin >> k[i].imie >> k[i].komitet;
        indeks[k[i].imie] = i;
    }
    int v, niewazne = 0, wazne = 0;
    cin >> v;
    for (int i = 0; i < v; i++) {
        string g;
        cin >> g;
        if (indeks.count(g)) {
            k[indeks[g]].glosy++;
            wazne++;
        } else {
            niewazne++;
        }
    }
    map<string, int> sumy;
    for (const Kandydat &x : k) sumy[x.komitet] += x.glosy;
    sort(k.begin(), k.end(), [](const Kandydat &a, const Kandydat &b) {
        if (a.glosy != b.glosy) return a.glosy > b.glosy;
        return a.imie < b.imie;
    });
    for (const Kandydat &x : k) {
        long long p = wazne == 0 ? 0 : 10000LL * x.glosy / wazne;
        cout << x.imie << " (" << x.komitet << "): " << x.glosy << " glosow, " << p / 100 << "." << setw(2) << setfill('0') << p % 100 << "%\n";
    }
    vector<Komitet> kom;
    for (auto [nazwa, g] : sumy) kom.push_back({nazwa, g});
    sort(kom.begin(), kom.end(), [](const Komitet &a, const Komitet &b) {
        if (a.glosy != b.glosy) return a.glosy > b.glosy;
        return a.nazwa < b.nazwa;
    });
    for (const Komitet &x : kom) cout << x.nazwa << ": " << x.glosy << " glosow\n";
    cout << "niewazne: " << niewazne << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-magazyn-fifo', krok: 9, level: 'srednie',
            title: 'Magazyn FIFO',
            short: 'Każda dostawa to partia z ilością i ceną. Sprzedaż zabiera najpierw z najstarszych partii — vector partii i wskaźnik na pierwszą niepustą.',
            tags: ['vector<Partia>', 'kolejka na vectorze', 'koszt sprzedanego towaru'],
            statement: ['Hurtownia kupuje towar partiami: DOSTAWA ilosc cena — przybywa ilosc sztuk kupionych po cena groszy za sztukę. Przy sprzedaży SPRZEDAZ ilosc towar wydaje się zawsze z najstarszych partii (najpierw cała najstarsza, potem następna — zasada FIFO).',
                'Dla każdej sprzedaży wypisz koszt zakupu sprzedanych sztuk (suma po partiach: ile sztuk z partii · cena partii) w formacie koszt Z.GG. Jeśli w magazynie jest mniej sztuk, niż chcą kupić, nic się nie zmienia i wypisz brak towaru (jest K szt.). Na końcu wypisz, ile sztuk zostało i ile są warte (po cenach zakupu).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy DOSTAWA ilosc cena albo SPRZEDAZ ilosc.'],
            output_format: ['Wiersz dla każdej sprzedaży i wiersz zostalo: K szt., wartosc Z.GG.'],
            constraints: ['1 ≤ q ≤ 2000', '1 ≤ ilosc ≤ 1000, 1 ≤ cena ≤ 100 000'],
            examples: [{ input: '5\nDOSTAWA 10 500\nDOSTAWA 5 800\nSPRZEDAZ 12\nSPRZEDAZ 4\nDOSTAWA 2 100', note: 'Sprzedaż 12 sztuk: 10 z pierwszej partii (50.00) i 2 z drugiej (16.00) — 66.00. Zostały 3 sztuki, a ktoś chce 4. Na końcu: 3 sztuki po 8.00 i 2 po 1.00 — 26.00.' }],
            hint: R`struct Partia { int ilosc; long long cena; }; vector<Partia> p; int pierwsza = 0;. Sprzedaż: najpierw sprawdź, czy suma sztuk wystarczy. Potem w pętli: int bierz = min(zostalo, p[pierwsza].ilosc); koszt += bierz * p[pierwsza].cena; p[pierwsza].ilosc -= bierz; if (p[pierwsza].ilosc == 0) pierwsza++;.`,
            tests: (r) => {
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                const los = (q, mi, mc, ps) => Array.from({ length: q }, () => (r() < ps ? `SPRZEDAZ ${r.int(1, mi)}` : `DOSTAWA ${r.int(1, mi)} ${r.int(1, mc)}`));
                return [d(['SPRZEDAZ 1']), d(['DOSTAWA 1000 100000', 'SPRZEDAZ 1000', 'SPRZEDAZ 1', 'DOSTAWA 1 1', 'DOSTAWA 1 2', 'SPRZEDAZ 2']), d(los(20, 10, 1000, 0.4)), d(los(2000, 1000, 100000, 0.5)), d(los(1000, 3, 50, 0.55))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q'; return L.slice(1).every((l) => { const t = l.split(' '); if (t[0] === 'SPRZEDAZ') return t.length === 2 && calk(Number(t[1]), 1, 1000); return t[0] === 'DOSTAWA' && t.length === 3 && calk(Number(t[1]), 1, 1000) && calk(Number(t[2]), 1, 100000); }) ? null : 'polecenie'; },
            solve: (inp) => {
                const p = []; let pi = 0, suma = 0; const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'DOSTAWA') { p.push([Number(t[1]), Number(t[2])]); suma += Number(t[1]); continue; }
                    let k = Number(t[1]); if (k > suma) { o.push(`brak towaru (jest ${suma} szt.)`); continue; }
                    suma -= k; let koszt = 0;
                    while (k > 0) { const b = Math.min(k, p[pi][0]); koszt += b * p[pi][1]; p[pi][0] -= b; k -= b; if (!p[pi][0]) pi++; }
                    o.push(`koszt ${zl(koszt)}`);
                }
                let w = 0; for (let i = pi; i < p.length; i++) w += p[i][0] * p[i][1];
                o.push(`zostalo: ${suma} szt., wartosc ${zl(w)}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Partia {
    int ilosc;
    long long cena;
};
void kwota(long long g) {
    cout << g / 100 << "." << setw(2) << setfill('0') << g % 100;
}
int main() {
    int q;
    cin >> q;
    vector<Partia> p;
    int pierwsza = 0;
    long long sztuk = 0;
    for (int i = 0; i < q; i++) {
        string op;
        cin >> op;
        if (op == "DOSTAWA") {
            Partia x;
            cin >> x.ilosc >> x.cena;
            p.push_back(x);
            sztuk += x.ilosc;
            continue;
        }
        int k;
        cin >> k;
        if (k > sztuk) {
            cout << "brak towaru (jest " << sztuk << " szt.)\n";
            continue;
        }
        sztuk -= k;
        long long koszt = 0;
        while (k > 0) {
            int bierz = min(k, p[pierwsza].ilosc);
            koszt += bierz * p[pierwsza].cena;
            p[pierwsza].ilosc -= bierz;
            k -= bierz;
            if (p[pierwsza].ilosc == 0) pierwsza++;
        }
        cout << "koszt ";
        kwota(koszt);
        cout << "\n";
    }
    long long wartosc = 0;
    for (int i = pierwsza; i < (int)p.size(); i++) wartosc += p[i].ilosc * p[i].cena;
    cout << "zostalo: " << sztuk << " szt., wartosc ";
    kwota(wartosc);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-pole-sumy', krok: 9, level: 'srednie',
            title: 'Pole sumy prostokątów',
            short: 'Na małej planszy każdy prostokąt „zamalowuje” kratki. Licznik w każdej kratce mówi, czy jest pokryta i czy przynajmniej dwa razy.',
            tags: ['vector<Prostokat>', 'kratki w tablicy 2D', 'pokrycie wielokrotne'],
            statement: ['Na kartce w kratkę narysowano n prostokątów o wierzchołkach w punktach kratowych (lewy dolny róg (x1, y1), prawy górny (x2, y2)). Prostokąty mogą na siebie nachodzić.',
                'Policz pole figury zakrytej przez prostokąty (ich sumy) i pole części zakrytej przez co najmniej dwa prostokąty. Wskazówka: kratka o lewym dolnym rogu (x, y) należy do prostokąta, gdy x1 ≤ x < x2 i y1 ≤ y < y2 — wystarczy policzyć, ile prostokątów zakrywa każdą kratkę.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy x1 y1 x2 y2.'],
            output_format: ['Dwa wiersze: pole: A i co najmniej dwa razy: B.'],
            constraints: ['1 ≤ n ≤ 200', '0 ≤ x1 < x2 ≤ 300, 0 ≤ y1 < y2 ≤ 300'],
            examples: [{ input: '3\n0 0 4 3\n2 1 6 5\n10 10 11 11', note: 'Pierwsze dwa prostokąty mają pola 12 i 16, a nakładają się na kwadracie 2 × 2 — suma ma pole 12 + 16 − 4 = 24, do tego mały kwadrat 1. Dwa razy zakryte są 4 kratki.' }],
            hint: R`int ile[300][300] (globalnie — same zera). Dla każdego prostokąta: for (x = x1; x < x2; x++) for (y = y1; y < y2; y++) ile[x][y]++;. Potem przejdź po wszystkich kratkach i policz te z ile ≥ 1 i ile ≥ 2. Najwyżej 200 · 90 000 = 18 milionów kroków.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m, dl) => Array.from({ length: n }, () => { const a = r.int(0, m - 1), b = r.int(0, m - 1); return [a, b, Math.min(m, a + r.int(1, dl)), Math.min(m, b + r.int(1, dl))]; });
                return [d([[0, 0, 1, 1]]), d([[0, 0, 300, 300], [0, 0, 300, 300]]), d(los(10, 20, 8)), d(los(200, 300, 300)), d(los(200, 300, 30)), d(los(50, 300, 5))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 200) || t.length !== 1 + 4 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 4) { const [a, b, c, dd] = t.slice(i, i + 4); if (!calk(a, 0, 300) || !calk(b, 0, 300) || !calk(c, 0, 300) || !calk(dd, 0, 300) || a >= c || b >= dd) return 'prostokat'; } return null; },
            solve: (inp) => {
                const t = nums(inp); const g = new Uint16Array(300 * 300);
                for (let i = 1; i < t.length; i += 4) for (let x = t[i]; x < t[i + 2]; x++) for (let y = t[i + 1]; y < t[i + 3]; y++) g[x * 300 + y]++;
                let a = 0, b = 0; for (const v of g) { if (v >= 1) a++; if (v >= 2) b++; }
                return `pole: ${a}\nco najmniej dwa razy: ${b}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Prostokat {
    int x1, y1, x2, y2;
};
int ile[300][300];
int main() {
    for (int x = 0; x < 300; x++)
        for (int y = 0; y < 300; y++) ile[x][y] = 0;
    int n;
    cin >> n;
    vector<Prostokat> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].x1 >> v[i].y1 >> v[i].x2 >> v[i].y2;
    for (const Prostokat &p : v)
        for (int x = p.x1; x < p.x2; x++)
            for (int y = p.y1; y < p.y2; y++) ile[x][y]++;
    int pole = 0, dwa = 0;
    for (int x = 0; x < 300; x++) {
        for (int y = 0; y < 300; y++) {
            if (ile[x][y] >= 1) pole++;
            if (ile[x][y] >= 2) dwa++;
        }
    }
    cout << "pole: " << pole << "\n";
    cout << "co najmniej dwa razy: " << dwa << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-wolne-terminy', krok: 9, level: 'srednie',
            title: 'Wspólny wolny termin',
            short: 'Zajęte przedziały wszystkich osób wrzucasz do jednego vectora, scalasz po sortowaniu, a wolne terminy to dziury między scalonymi przedziałami.',
            tags: ['scalanie przedziałów', 'dziury między przedziałami', 'czas jako minuty'],
            statement: ['m osób szuka terminu wspólnego spotkania w godzinach pracy, od 08:00 do 18:00. Każda osoba podała swoje zajęte przedziały HH:MM–HH:MM (osoba jest zajęta od pierwszej godziny do drugiej; spotkanie może zacząć się dokładnie wtedy, gdy ktoś kończy zajęcie).',
                'Wypisz wszystkie wolne dla wszystkich przedziały w godzinach pracy, które trwają co najmniej d minut — od najwcześniejszego. Jeśli takich nie ma, wypisz brak terminow.'],
            input_format: ['W pierwszym wierszu m i d.', 'Każda osoba to wiersz z imieniem i liczbą przedziałów k, a potem k wierszy HH:MM HH:MM.'],
            output_format: ['Wiersze HH:MM-HH:MM albo jeden wiersz brak terminow.'],
            constraints: ['1 ≤ m ≤ 50, 0 ≤ k ≤ 20, 1 ≤ d ≤ 600', 'Każdy przedział leży w godzinach 08:00–18:00 i ma dodatnią długość.'],
            examples: [{ input: '2 30\nOla 2\n09:00 10:30\n13:00 14:00\nKuba 2\n10:00 11:00\n15:45 18:00', note: 'Zajęte razem: 09:00–11:00, 13:00–14:00, 15:45–18:00. Wolne: 08:00–09:00, 11:00–13:00 i 14:00–15:45 — każde ma co najmniej 30 minut.' }],
            hint: R`Wrzuć wszystkie przedziały do jednego vector<Przedzial>, posortuj po początku. Idź z kursorem t = 8 * 60: jeśli przedział zaczyna się po t, to [t, początek] jest wolne; potem t = max(t, koniec). Na końcu sprawdź jeszcze [t, 18 * 60].`,
            tests: (r) => {
                const d = (D, os) => `${os.length} ${D}\n${os.map(([n, p]) => `${n} ${p.length}${p.length ? '\n' + p.map(([a, b]) => `${hhmm(a)} ${hhmm(b)}`).join('\n') : ''}`).join('\n')}`;
                const los = (m, kmax, dl) => unikalneImiona(r, m).map((n) => [n, Array.from({ length: r.int(0, kmax) }, () => { const a = r.int(480, 1079); return [a, Math.min(1080, a + r.int(1, dl))]; })]);
                return [d(600, [['Ala', []]]), d(1, [['A', [[480, 1080]]]]), d(30, los(3, 3, 120)), d(15, los(50, 20, 40)), d(60, los(10, 4, 60)), d(5, los(20, 20, 15))];
            },
            check: (inp) => {
                const L = linie(inp); const [m, D] = L[0].split(' ').map(Number); if (!calk(m, 1, 50) || !calk(D, 1, 600)) return 'm'; let i = 1;
                for (let k = 0; k < m; k++) { const t = (L[i] || '').split(' '); const kk = Number(t[1]); if (t.length !== 2 || !czyImie(t[0], 15) || !calk(kk, 0, 20)) return 'osoba'; for (let j = 1; j <= kk; j++) { const p = (L[i + j] || '').split(' '); if (p.length !== 2 || !czyGodz(p[0]) || !czyGodz(p[1])) return 'format'; const a = minuty(p[0]), b = minuty(p[1]); if (a < 480 || b > 1080 || a >= b) return 'przedzial'; } i += 1 + kk; }
                return i === L.length ? null : 'dlugosc';
            },
            solve: (inp) => {
                const L = linie(inp); const [m, D] = L[0].split(' ').map(Number); let i = 1; const v = [];
                for (let k = 0; k < m; k++) { const kk = Number(L[i].split(' ')[1]); for (let j = 1; j <= kk; j++) { const [a, b] = L[i + j].split(' ').map(minuty); v.push([a, b]); } i += 1 + kk; }
                v.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
                const o = []; let t = 480;
                for (const [a, b] of v) { if (a > t && a - t >= D) o.push(`${hhmm(t)}-${hhmm(a)}`); t = Math.max(t, b); }
                if (1080 - t >= D) o.push(`${hhmm(t)}-${hhmm(1080)}`);
                return o.length ? o.join('\n') : 'brak terminow';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Przedzial {
    int a, b;
};
void godzina(int t) {
    cout << setfill('0') << setw(2) << t / 60 << ":" << setw(2) << t % 60;
}
int main() {
    int m, d;
    cin >> m >> d;
    vector<Przedzial> v;
    char c;
    for (int i = 0; i < m; i++) {
        string imie;
        int k;
        cin >> imie >> k;
        for (int j = 0; j < k; j++) {
            int h1, m1, h2, m2;
            cin >> h1 >> c >> m1 >> h2 >> c >> m2;
            v.push_back({h1 * 60 + m1, h2 * 60 + m2});
        }
    }
    sort(v.begin(), v.end(), [](const Przedzial &x, const Przedzial &y) {
        if (x.a != y.a) return x.a < y.a;
        return x.b < y.b;
    });
    int t = 8 * 60, ile = 0;
    for (const Przedzial &p : v) {
        if (p.a > t && p.a - t >= d) {
            godzina(t);
            cout << "-";
            godzina(p.a);
            cout << "\n";
            ile++;
        }
        t = max(t, p.b);
    }
    if (18 * 60 - t >= d) {
        godzina(t);
        cout << "-";
        godzina(18 * 60);
        cout << "\n";
        ile++;
    }
    if (ile == 0) cout << "brak terminow\n";
    return 0;
}`,
        },
        {
            id: 'st-b-prostokaty-z-punktow', krok: 9, level: 'srednie',
            title: 'Prostokąty z punktów',
            short: 'Każda para punktów może być przekątną prostokąta — wystarczy sprawdzić, czy dwa pozostałe rogi też są w zbiorze. set<Punkt> z operator< robi to szybko.',
            tags: ['set<Punkt>', 'para jako przekątna', 'zliczanie bez powtórzeń'],
            statement: ['Na płaszczyźnie jest n różnych punktów. Policz prostokąty o bokach równoległych do osi (o dodatnim polu), których wszystkie cztery wierzchołki są wśród tych punktów.',
                'Pomysł: każdy taki prostokąt ma dokładnie jedną przekątną z lewego dolnego do prawego górnego rogu. Przejdź po wszystkich parach punktów (x1, y1), (x2, y2) z x1 < x2 i y1 < y2 i sprawdź w set<Punkt>, czy są w nim punkty (x1, y2) i (x2, y1).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy x i y.'],
            output_format: ['Jedna liczba — liczba prostokątów.'],
            constraints: ['1 ≤ n ≤ 1500', '0 ≤ x, y ≤ 10⁹; punkty są różne.'],
            examples: [{ input: '6\n0 0\n0 2\n3 0\n3 2\n5 0\n5 2', note: 'Trzy pionowe pary punktów na wysokościach 0 i 2 dają trzy prostokąty: x od 0 do 3, od 3 do 5 i od 0 do 5.' }],
            hint: R`struct Punkt z bool operator<(const Punkt &o) const. Dwie pętle po parach (i, j); gdy v[i].x < v[j].x && v[i].y < v[j].y, sprawdź s.count({v[i].x, v[j].y}) && s.count({v[j].x, v[i].y}). Par jest ok. miliona, każde sprawdzenie w secie jest szybkie.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const siatka = (n, w, hh, M) => { const s = new Map(); while (s.size < n) { const x = r.int(0, w - 1) * M, y = r.int(0, hh - 1) * M; s.set(`${x} ${y}`, [x, y]); } return r.shuffle([...s.values()]); };
                const pelna = (w, hh) => r.shuffle(Array.from({ length: w * hh }, (_, i) => [Math.floor(i / hh) * 7, (i % hh) * 7]));
                return [d([[5, 5]]), d([[0, 0], [1, 1], [0, 1], [1, 0], [2, 2]]), d(siatka(30, 6, 6, 1)), d(siatka(1500, 40, 40, 1)), d(siatka(1500, 1000000, 1000000, 1000)), d(pelna(30, 50))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1500) || t.length !== 1 + 2 * t[0]) return 'n'; const s = new Set(); for (let i = 1; i < t.length; i += 2) { if (!calk(t[i], 0, 1e9) || !calk(t[i + 1], 0, 1e9)) return 'zakres'; s.add(`${t[i]} ${t[i + 1]}`); } return s.size === t[0] ? null : 'powtorka'; },
            solve: (inp) => {
                const t = nums(inp); const p = []; const s = new Set();
                for (let i = 1; i < t.length; i += 2) { p.push([t[i], t[i + 1]]); s.add(`${t[i]} ${t[i + 1]}`); }
                let ile = 0;
                for (let i = 0; i < p.length; i++) for (let j = 0; j < p.length; j++) if (p[i][0] < p[j][0] && p[i][1] < p[j][1] && s.has(`${p[i][0]} ${p[j][1]}`) && s.has(`${p[j][0]} ${p[i][1]}`)) ile++;
                return String(ile);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    int x, y;
    bool operator<(const Punkt &o) const {
        if (x != o.x) return x < o.x;
        return y < o.y;
    }
};
int main() {
    int n;
    cin >> n;
    vector<Punkt> v(n);
    set<Punkt> s;
    for (int i = 0; i < n; i++) {
        cin >> v[i].x >> v[i].y;
        s.insert(v[i]);
    }
    long long ile = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (v[i].x < v[j].x && v[i].y < v[j].y) {
                if (s.count({v[i].x, v[j].y}) && s.count({v[j].x, v[i].y})) ile++;
            }
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · trudne
        {
            id: 'st-b-sale-wykladowe', krok: 9, level: 'trudne',
            title: 'Przydział sal',
            short: 'Wykłady po kolei według początku; sala, w której wykład już się skończył, wraca do puli wolnych. Najmniejszy wolny numer albo nowa sala.',
            tags: ['sort zdarzeń', 'set wolnych sal', 'odpowiedzi w kolejności z wejścia'],
            statement: ['Na uczelni jest n wykładów; każdy ma nazwę, początek i koniec (HH:MM, wykład trwa od początku do tuż przed końcem — sala jest wolna już o godzinie końca). Sale numerujemy od 1. Dziekanat przydziela sale tak:',
                'wykłady rozpatruje według godziny początku (przy równych — według końca, a potem według kolejności z wejścia). Gdy przychodzi pora na wykład zaczynający się o godzinie s, wszystkie sale, w których wykład skończył się najpóźniej o s, są wolne. Wykład dostaje wolną salę o najmniejszym numerze, a gdy żadna nie jest wolna — nową salę o numerze o jeden większym niż dotąd największy.',
                'Wypisz liczbę użytych sal, a potem dla każdego wykładu (w kolejności z wejścia) jego salę. Zapamiętaj w strukturze wykładu jego numer z wejścia, żeby po sortowaniu móc zapisać wynik na właściwe miejsce.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa, początek i koniec.'],
            output_format: ['Wiersz sal: S, a potem n wierszy NAZWA: sala X.'],
            constraints: ['1 ≤ n ≤ 1000', 'Nazwy mają od 1 do 10 znaków (małe litery i cyfry); początek jest przed końcem.'],
            examples: [{ input: '5\nanaliza 08:00 10:00\nfizyka 09:00 11:00\nalgebra 10:00 12:00\nlogika 08:30 09:00\nbazy 11:00 12:30', note: 'analiza → sala 1, logika (08:30) → sala 2, fizyka (09:00) → sala 2 (logika właśnie się skończyła), algebra (10:00) → sala 1, bazy (11:00) → sala 2. Wystarczą 2 sale.' }],
            hint: R`set<int> wolne; set<pair<int, int>> zajete; — para (koniec, sala). Przed wykładem o początku s: while (!zajete.empty() && zajete.begin()->first <= s) { wolne.insert(zajete.begin()->second); zajete.erase(zajete.begin()); }. Potem weź *wolne.begin() albo nową salę, wpisz zajete.insert({koniec, sala}) i sala[w.nr] = ….`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([n, x, y]) => `${n} ${hhmm(x)} ${hhmm(y)}`).join('\n')}`;
                const naz = (i) => r.pick(['wyklad', 'lab', 'cw', 'sem', 'proj']) + (i + 1);
                const los = (n, lo, hi, dl) => Array.from({ length: n }, (_, i) => { const a = r.int(lo, hi - 1); return [naz(i), a, Math.min(hi, a + r.int(1, dl))]; });
                return [d([['a', 0, 1]]), d([['x', 600, 660], ['y', 600, 660], ['z', 660, 720], ['w', 600, 601], ['v', 601, 700]]), d(los(12, 480, 1080, 180)), d(los(1000, 0, 1439, 300)), d(los(1000, 600, 720, 30)), d(los(500, 480, 1200, 600))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 3 && /^[a-z0-9]{1,10}$/.test(t[0]) && czyGodz(t[1]) && czyGodz(t[2]) && minuty(t[1]) < minuty(t[2]); }) ? null : 'dane'; },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l, i) => { const t = l.split(' '); return { n: t[0], s: minuty(t[1]), k: minuty(t[2]), i }; });
                const ord = u.slice().sort((a, b) => a.s - b.s || a.k - b.k || a.i - b.i);
                const wolne = [], zaj = []; let sale = 0; const sala = [];
                for (const w of ord) {
                    zaj.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                    while (zaj.length && zaj[0][0] <= w.s) { wolne.push(zaj.shift()[1]); }
                    wolne.sort((a, b) => a - b);
                    const x = wolne.length ? wolne.shift() : ++sale;
                    sala[w.i] = x; zaj.push([w.k, x]);
                }
                return [`sal: ${sale}`, ...u.map((w) => `${w.n}: sala ${sala[w.i]}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Wyklad {
    string nazwa;
    int start, koniec, nr;
};
int main() {
    int n;
    cin >> n;
    vector<Wyklad> v(n);
    char c;
    for (int i = 0; i < n; i++) {
        int h1, m1, h2, m2;
        cin >> v[i].nazwa >> h1 >> c >> m1 >> h2 >> c >> m2;
        v[i].start = h1 * 60 + m1;
        v[i].koniec = h2 * 60 + m2;
        v[i].nr = i;
    }
    vector<Wyklad> kol = v;
    sort(kol.begin(), kol.end(), [](const Wyklad &a, const Wyklad &b) {
        if (a.start != b.start) return a.start < b.start;
        if (a.koniec != b.koniec) return a.koniec < b.koniec;
        return a.nr < b.nr;
    });
    set<int> wolne;
    set<pair<int, int>> zajete;
    vector<int> sala(n);
    int sal = 0;
    for (const Wyklad &w : kol) {
        while (!zajete.empty() && zajete.begin()->first <= w.start) {
            wolne.insert(zajete.begin()->second);
            zajete.erase(zajete.begin());
        }
        int x;
        if (!wolne.empty()) {
            x = *wolne.begin();
            wolne.erase(wolne.begin());
        } else {
            x = ++sal;
        }
        sala[w.nr] = x;
        zajete.insert({w.koniec, x});
    }
    cout << "sal: " << sal << "\n";
    for (int i = 0; i < n; i++) cout << v[i].nazwa << ": sala " << sala[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-ranking-na-zywo', krok: 9, level: 'trudne',
            title: 'Ranking na żywo',
            short: 'Punkty graczy ciągle się zmieniają, a ranking ma być gotowy w każdej chwili. set<Gracz> z operator< — zmiana to usunięcie starego rekordu i wstawienie nowego.',
            tags: ['set<Gracz> z operator<', 'usuń i wstaw ponownie', 'map nick → punkty'],
            statement: ['Gracze zdobywają punkty w grze online. Obsłuż q poleceń: PUNKTY nick x — gracz dostaje x punktów (gracz, który pojawia się pierwszy raz, zaczyna od 0); MIEJSCE nick — wypisz NICK: miejsce M, punkty P, gdzie M to 1 + liczba graczy z większą liczbą punktów, albo NICK: brak, jeśli gracz jeszcze nie grał; TOP k — wypisz top: i k najlepszych graczy w formacie NICK (PUNKTY), oddzielonych przecinkami (mniej, jeśli graczy jest mniej; top: brak, gdy nie ma żadnego).',
                'Ranking: więcej punktów wyżej, przy równych punktach — alfabetycznie. Trzymaj graczy w set<Gracz> uporządkowanym operatorem< i w map<string, long long> z punktami: przy zmianie punktów usuń z setu stary rekord i wstaw nowy.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Odpowiedzi na polecenia MIEJSCE i TOP, po jednej w wierszu.'],
            constraints: ['1 ≤ q ≤ 3000, poleceń MIEJSCE i TOP jest łącznie najwyżej 400', 'Nicki mają od 1 do 10 małych liter i cyfr; graczy jest najwyżej 1000.', '1 ≤ x ≤ 1000, 1 ≤ k ≤ 3'],
            examples: [{ input: '7\nPUNKTY ala 50\nPUNKTY bob 70\nTOP 3\nPUNKTY ala 20\nMIEJSCE bob\nTOP 2\nMIEJSCE ewa', note: 'Po dwóch wynikach prowadzi bob (70). Gdy ala ma też 70, oboje mają miejsce 1, a w TOP ala jest pierwsza alfabetycznie. ewa jeszcze nie grała.' }],
            hint: R`struct Gracz { long long punkty; string nick; bool operator<(const Gracz &o) const { if (punkty != o.punkty) return punkty > o.punkty; return nick < o.nick; } };. Zmiana: if (pkt.count(n)) s.erase({pkt[n], n}); pkt[n] += x; s.insert({pkt[n], n});. MIEJSCE: idź od s.begin() i licz graczy z punkty > P.`,
            tests: (r) => {
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                const sesja = (q, gr, zap) => { const G = unikalneSlowa(r, gr, 1, 4); const znani = []; let z = 0; return Array.from({ length: q }, () => { const p = r(); if (p < zap && z < 400) { z++; if (r() < 0.5) return `MIEJSCE ${r() < 0.8 && znani.length ? r.pick(znani) : r.pick(G)}`; return `TOP ${r.int(1, 3)}`; } const g = r.pick(G); if (!znani.includes(g)) znani.push(g); return `PUNKTY ${g} ${r.int(1, r() < 0.3 ? 5 : 1000)}`; }); };
                return [d(['TOP 1', 'MIEJSCE ala']), d(['PUNKTY b 5', 'PUNKTY a 5', 'PUNKTY c 4', 'TOP 3', 'MIEJSCE c', 'MIEJSCE a', 'PUNKTY c 1', 'TOP 3', 'MIEJSCE c']), d(sesja(40, 6, 0.3)), d(sesja(3000, 1000, 0.13)), d(sesja(3000, 20, 0.13)), d(sesja(1000, 300, 0.4))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q'; let z = 0; const g = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t[0] === 'PUNKTY' && t.length === 3 && /^[a-z0-9]{1,10}$/.test(t[1]) && calk(Number(t[2]), 1, 1000)) { g.add(t[1]); continue; } if (t[0] === 'MIEJSCE' && t.length === 2 && /^[a-z0-9]{1,10}$/.test(t[1])) { z++; continue; } if (t[0] === 'TOP' && t.length === 2 && calk(Number(t[1]), 1, 3)) { z++; continue; } return 'polecenie'; }
                return z <= 400 && g.size <= 1000 ? null : 'za duzo';
            },
            solve: (inp) => {
                const pk = new Map(); const o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'PUNKTY') pk.set(t[1], (pk.get(t[1]) || 0) + Number(t[2]));
                    else if (t[0] === 'MIEJSCE') { if (!pk.has(t[1])) o.push(`${t[1]}: brak`); else { const p = pk.get(t[1]); let m = 1; for (const v of pk.values()) if (v > p) m++; o.push(`${t[1]}: miejsce ${m}, punkty ${p}`); } }
                    else { const s = sortuj([...pk.entries()], (x) => [x[1], x[0]], [-1, 1]).slice(0, Number(t[1])); o.push(s.length ? `top: ${s.map((x) => `${x[0]} (${x[1]})`).join(', ')}` : 'top: brak'); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Gracz {
    long long punkty;
    string nick;
    bool operator<(const Gracz &o) const {
        if (punkty != o.punkty) return punkty > o.punkty;
        return nick < o.nick;
    }
};
int main() {
    int q;
    cin >> q;
    set<Gracz> s;
    map<string, long long> pkt;
    for (int i = 0; i < q; i++) {
        string op;
        cin >> op;
        if (op == "PUNKTY") {
            string n;
            long long x;
            cin >> n >> x;
            if (pkt.count(n)) s.erase({pkt[n], n});
            pkt[n] += x;
            s.insert({pkt[n], n});
        } else if (op == "MIEJSCE") {
            string n;
            cin >> n;
            if (!pkt.count(n)) {
                cout << n << ": brak\n";
                continue;
            }
            long long p = pkt[n];
            int miejsce = 1;
            for (const Gracz &g : s) {
                if (g.punkty <= p) break;
                miejsce++;
            }
            cout << n << ": miejsce " << miejsce << ", punkty " << p << "\n";
        } else {
            int k;
            cin >> k;
            if (s.empty()) {
                cout << "top: brak\n";
                continue;
            }
            cout << "top: ";
            int i = 0;
            for (const Gracz &g : s) {
                if (i == k) break;
                if (i > 0) cout << ", ";
                cout << g.nick << " (" << g.punkty << ")";
                i++;
            }
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-b-rozklad-jazdy', krok: 9, level: 'trudne',
            title: 'Rozkład jazdy',
            short: 'Połączenia posortowane po godzinie odjazdu i jedno przejście: z połączenia skorzystasz, jeśli zdążysz na stację odjazdu. Najwcześniejszy przyjazd w czasie liniowym.',
            tags: ['struct Polaczenie', 'sort po odjeździe', 'najwcześniejszy przyjazd'],
            statement: ['Sieć kolejowa ma m połączeń; połączenie to stacja odjazdu, stacja przyjazdu, godzina odjazdu i godzina przyjazdu (HH:MM tego samego dnia, przyjazd po odjeździe). Przesiadka nic nie kosztuje: jeśli dojedziesz na stację o godzinie t, możesz odjechać każdym połączeniem, które odjeżdża o t albo później.',
                'Dla każdego z q pytań S T D (start ze stacji S o godzinie T, cel D) wypisz najwcześniejszą godzinę dotarcia do D albo nie da sie. Gdy S = D, odpowiedzią jest T.',
                'Pomysł: posortuj połączenia po godzinie odjazdu i trzymaj dla każdej stacji najwcześniejszą znaną godzinę dotarcia (na starcie tylko S ma T). Idąc po połączeniach w tej kolejności, z połączenia można skorzystać, jeśli na jego stację odjazdu już dotarliśmy nie później niż o godzinie odjazdu — wtedy poprawiamy godzinę dla stacji przyjazdu.'],
            input_format: ['W pierwszym wierszu m, potem m wierszy: skad dokad odjazd przyjazd.', 'Potem wiersz z q i q wierszy: S T D.'],
            output_format: ['q wierszy: HH:MM albo nie da sie.'],
            constraints: ['1 ≤ m ≤ 3000, 1 ≤ q ≤ 100', 'Stacje mają od 1 do 12 małych liter; skad ≠ dokad.'],
            examples: [{ input: '4\nkrakow tarnow 08:00 09:10\ntarnow rzeszow 09:15 10:30\nkrakow rzeszow 08:30 11:00\ntarnow rzeszow 09:05 10:00\n3\nkrakow 07:50 rzeszow\nkrakow 08:10 rzeszow\nrzeszow 12:00 krakow', note: 'Z Krakowa o 07:50: pociąg 08:00 do Tarnowa (09:10), ale ten o 09:05 już odjechał — przesiadka na 09:15, przyjazd 10:30, wcześniej niż bezpośredni (11:00). Od 08:10 zostaje tylko bezpośredni. Z Rzeszowa nic nie jedzie.' }],
            hint: R`struct Polaczenie { string skad, dokad; int odjazd, przyjazd; };. Dla każdego pytania: map<string, int> najw; najw[S] = T;. Po posortowanych połączeniach: if (najw.count(p.skad) && najw[p.skad] <= p.odjazd && (!najw.count(p.dokad) || p.przyjazd < najw[p.dokad])) najw[p.dokad] = p.przyjazd;.`,
            tests: (r) => {
                const d = (p, q) => `${p.length}\n${p.map(([a, b, x, y]) => `${a} ${b} ${hhmm(x)} ${hhmm(y)}`).join('\n')}\n${q.length}\n${q.map(([a, t, b]) => `${a} ${hhmm(t)} ${b}`).join('\n')}`;
                const siec = (s, m, q) => {
                    const S = unikalneSlowa(r, s, 2, 4);
                    const p = Array.from({ length: m }, () => { const a = r.pick(S); let b = r.pick(S); while (b === a) b = r.pick(S); const x = r.int(300, 1350); return [a, b, x, Math.min(1439, x + r.int(10, 120))]; });
                    const z = Array.from({ length: q }, () => [r.pick(S), r.int(300, 1200), r.pick(S)]);
                    return d(p, z);
                };
                return [d([['a', 'b', 0, 1]], [['a', 0, 'b'], ['a', 1, 'b'], ['b', 0, 'a'], ['c', 5, 'c']]), d([['x', 'y', 600, 660], ['y', 'z', 660, 700], ['y', 'z', 659, 690]], [['x', 600, 'z'], ['x', 599, 'y'], ['z', 0, 'x']]), siec(5, 20, 10), siec(30, 3000, 100), siec(8, 3000, 100), siec(60, 500, 100)];
            },
            check: (inp) => {
                const L = linie(inp); const m = Number(L[0]); if (!calk(m, 1, 3000)) return 'm';
                if (!L.slice(1, m + 1).every((l) => { const t = l.split(' '); return t.length === 4 && czyMale(t[0], 12) && czyMale(t[1], 12) && t[0] !== t[1] && czyGodz(t[2]) && czyGodz(t[3]) && minuty(t[2]) < minuty(t[3]); })) return 'polaczenie';
                const q = Number(L[m + 1]); if (!calk(q, 1, 100) || L.length !== m + 2 + q) return 'q';
                return L.slice(m + 2).every((l) => { const t = l.split(' '); return t.length === 3 && czyMale(t[0], 12) && czyGodz(t[1]) && czyMale(t[2], 12); }) ? null : 'pytanie';
            },
            solve: (inp) => {
                const L = linie(inp); const m = Number(L[0]);
                const p = L.slice(1, m + 1).map((l) => { const t = l.split(' '); return [t[0], t[1], minuty(t[2]), minuty(t[3])]; }).sort((a, b) => a[2] - b[2]);
                return L.slice(m + 2).map((l) => {
                    const [S, T, D] = l.split(' '); const n = new Map([[S, minuty(T)]]);
                    for (const [a, b, x, y] of p) if (n.has(a) && n.get(a) <= x && (!n.has(b) || y < n.get(b))) n.set(b, y);
                    return n.has(D) ? hhmm(n.get(D)) : 'nie da sie';
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Polaczenie {
    string skad, dokad;
    int odjazd, przyjazd;
};
int czytajGodzine() {
    int h, m;
    char c;
    cin >> h >> c >> m;
    return h * 60 + m;
}
int main() {
    int m;
    cin >> m;
    vector<Polaczenie> v(m);
    for (int i = 0; i < m; i++) {
        cin >> v[i].skad >> v[i].dokad;
        v[i].odjazd = czytajGodzine();
        v[i].przyjazd = czytajGodzine();
    }
    sort(v.begin(), v.end(), [](const Polaczenie &a, const Polaczenie &b) {
        return a.odjazd < b.odjazd;
    });
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string S, D;
        cin >> S;
        int T = czytajGodzine();
        cin >> D;
        map<string, int> najw;
        najw[S] = T;
        for (const Polaczenie &p : v) {
            if (najw.count(p.skad) && najw[p.skad] <= p.odjazd) {
                if (!najw.count(p.dokad) || p.przyjazd < najw[p.dokad]) najw[p.dokad] = p.przyjazd;
            }
        }
        if (!najw.count(D)) cout << "nie da sie\n";
        else cout << setfill('0') << setw(2) << najw[D] / 60 << ":" << setw(2) << najw[D] % 60 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-zlecenia', krok: 9, level: 'trudne',
            title: 'Zlecenia z największym zyskiem',
            short: 'Zlecenia posortowane po końcu i tablica dp: najlepszy zysk z pierwszych i zleceń. Dla każdego zlecenia: bierzesz je (plus najlepsze przed jego początkiem) albo nie.',
            tags: ['sort po końcu', 'programowanie dynamiczne', 'upper_bound'],
            statement: ['Firma transportowa ma jedną ciężarówkę i n ofert zleceń; zlecenie zajmuje ciężarówkę od chwili start do chwili koniec i daje zysk. Zlecenia nie mogą na siebie nachodzić, ale nowe może zacząć się dokładnie wtedy, gdy poprzednie się kończy. Wybierz zlecenia tak, żeby łączny zysk był największy, i wypisz ten zysk.',
                'Sposób: posortuj zlecenia po końcu. Niech dp[i] to największy zysk, jaki da się osiągnąć zleceniami spośród pierwszych i (po sortowaniu). Dla i-tego zlecenia albo go nie bierzesz (dp[i − 1]), albo bierzesz — wtedy do jego zysku dodajesz dp[j], gdzie j to liczba zleceń kończących się nie później niż start i-tego.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy start, koniec i zysk.'],
            output_format: ['Jedna liczba — największy łączny zysk.'],
            constraints: ['1 ≤ n ≤ 3000', '0 ≤ start < koniec ≤ 10⁹, 1 ≤ zysk ≤ 10⁶'],
            examples: [{ input: '4\n1 3 50\n3 5 20\n2 6 100\n6 7 30', note: 'Zlecenia 1, 2 i 4 dają 100, a zlecenia 3 i 4 — 130. Lepiej nie da się.' }],
            hint: R`Po sortowaniu zapisz końce w vector<long long> konce. Liczbę zleceń kończących się najpóźniej w chwili s da upper_bound(konce.begin(), konce.end(), s) - konce.begin(). dp ma n + 1 elementów: dp[0] = 0, dp[i + 1] = max(dp[i], v[i].zysk + dp[j]). Wynik sięga 3 · 10⁹ — long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, M, dl, zm) => Array.from({ length: n }, () => { const a = r.int(0, M - 1); return [a, Math.min(M, a + r.int(1, dl)), r.int(1, zm)]; });
                return [d([[0, 1000000000, 1000000]]), d([[0, 2, 5], [2, 4, 5], [0, 4, 9], [1, 3, 11]]), d(los(15, 50, 10, 100)), d(los(3000, 1000000000, 5000000, 1000000)), d(los(3000, 3000, 3, 1000000)), d(los(1000, 100, 100, 1000))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 3000) || t.length !== 1 + 3 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 3) if (!calk(t[i], 0, 1e9) || !calk(t[i + 1], 0, 1e9) || t[i] >= t[i + 1] || !calk(t[i + 2], 1, 1e6)) return 'zlecenie'; return null; },
            solve: (inp) => {
                const t = nums(inp); const v = []; for (let i = 1; i < t.length; i += 3) v.push([t[i], t[i + 1], t[i + 2]]);
                v.sort((a, b) => a[1] - b[1]);
                const kon = v.map((x) => x[1]); const dp = [0];
                const ub = (s) => { let lo = 0, hi = kon.length; while (lo < hi) { const m = (lo + hi) >> 1; if (kon[m] <= s) lo = m + 1; else hi = m; } return lo; };
                v.forEach((x, i) => { dp.push(Math.max(dp[i], x[2] + dp[ub(x[0])])); });
                return String(dp[v.length]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zlecenie {
    long long start, koniec, zysk;
};
int main() {
    int n;
    cin >> n;
    vector<Zlecenie> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].start >> v[i].koniec >> v[i].zysk;
    sort(v.begin(), v.end(), [](const Zlecenie &a, const Zlecenie &b) {
        return a.koniec < b.koniec;
    });
    vector<long long> konce(n);
    for (int i = 0; i < n; i++) konce[i] = v[i].koniec;
    vector<long long> dp(n + 1, 0);
    for (int i = 0; i < n; i++) {
        int j = upper_bound(konce.begin(), konce.end(), v[i].start) - konce.begin();
        dp[i + 1] = max(dp[i], v[i].zysk + dp[j]);
    }
    cout << dp[n] << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-wieza-z-pudelek', krok: 9, level: 'trudne',
            title: 'Wieża z pudełek',
            short: 'Każde pudełko można położyć na trzy sposoby — to trzy struktury {szerokość, głębokość, wysokość}. Posortuj je po podstawie i policz najwyższą wieżę jak najdłuższy podciąg.',
            tags: ['trzy rekordy z jednego pudełka', 'sort po podstawie', 'dp jak najdłuższy podciąg'],
            statement: ['Masz n rodzajów pudełek (prostopadłościanów) o wymiarach a × b × c — każdego rodzaju dowolnie wiele sztuk. Pudełko można obrócić i postawić na dowolnej ścianie. Budujesz wieżę: pudełko można postawić na drugim tylko wtedy, gdy oba wymiary jego podstawy są ostro mniejsze od wymiarów podstawy pudełka pod spodem (podstawę też wolno obracać).',
                'Wypisz największą możliwą wysokość wieży. Sposób: każde pudełko daje trzy struktury Klocek { int w, d, h } (wysokość to jeden wymiar, a podstawa to dwa pozostałe, ułożone tak, żeby w ≤ d). Posortuj klocki po w, a potem po d, i policz dp[i] — najwyższą wieżę z klockiem i na samej górze — jak przy najdłuższym podciągu rosnącym.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy trzy wymiary a b c.'],
            output_format: ['Jedna liczba — największa wysokość wieży.'],
            constraints: ['1 ≤ n ≤ 300', '1 ≤ a, b, c ≤ 10⁴'],
            examples: [{ input: '2\n4 6 7\n1 2 3', note: 'Pudełko 4 × 6 × 7 dzieli się na trzy klocki: podstawa 6 × 7 z wysokością 4, podstawa 4 × 7 z wysokością 6, podstawa 4 × 6 z wysokością 7. Najlepiej: 6 × 7 (4), na nim 4 × 6 (7), potem 2 × 3 (1) i 1 × 2 (3) — razem 15.' }],
            hint: R`Klocek „na” klocku j: v[i].w < v[j].w && v[i].d < v[j].d. Po sortowaniu (po w rosnąco, potem d) każdy klocek, który może stać pod i (ma większą podstawę), jest w tablicy później — więc licz od góry wieży: dp[i] = v[i].h + max(dp[j]) po j < i z mniejszą podstawą. Wynik to max(dp).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(1, m), r.int(1, m), r.int(1, m)]);
                return [d([[1, 1, 1]]), d([[5, 5, 5], [5, 5, 5], [4, 4, 4]]), d(los(5, 10)), d(los(300, 10000)), d(los(300, 30)), d([[1, 2, 3], [2, 3, 4], [3, 4, 5], [10000, 10000, 10000]])];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 300) || t.length !== 1 + 3 * t[0]) return 'n'; return t.slice(1).every((x) => calk(x, 1, 10000)) ? null : 'wymiar'; },
            solve: (inp) => {
                const t = nums(inp); const v = [];
                for (let i = 1; i < t.length; i += 3) { const [a, b, c] = [t[i], t[i + 1], t[i + 2]]; for (const [x, y, z] of [[a, b, c], [a, c, b], [b, c, a]]) v.push([Math.min(x, y), Math.max(x, y), z]); }
                v.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
                const dp = v.map((x) => x[2]); let best = 0;
                for (let i = 0; i < v.length; i++) { for (let j = 0; j < i; j++) if (v[j][0] < v[i][0] && v[j][1] < v[i][1]) dp[i] = Math.max(dp[i], dp[j] + v[i][2]); best = Math.max(best, dp[i]); }
                return String(best);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Klocek {
    int w, d, h;
};
Klocek klocek(int x, int y, int h) {
    return {min(x, y), max(x, y), h};
}
int main() {
    int n;
    cin >> n;
    vector<Klocek> v;
    for (int i = 0; i < n; i++) {
        int a, b, c;
        cin >> a >> b >> c;
        v.push_back(klocek(a, b, c));
        v.push_back(klocek(a, c, b));
        v.push_back(klocek(b, c, a));
    }
    sort(v.begin(), v.end(), [](const Klocek &p, const Klocek &q) {
        if (p.w != q.w) return p.w < q.w;
        return p.d < q.d;
    });
    int m = v.size();
    vector<int> dp(m);
    int best = 0;
    for (int i = 0; i < m; i++) {
        dp[i] = v[i].h;
        for (int j = 0; j < i; j++)
            if (v[j].w < v[i].w && v[j].d < v[i].d) dp[i] = max(dp[i], dp[j] + v[i].h);
        best = max(best, dp[i]);
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'st-b-ciag-fareya', krok: 9, level: 'trudne',
            title: 'Ciąg Fareya',
            short: 'Wszystkie ułamki nieskracalne z mianownikiem do n, posortowane operatorem< na krzyż. Ile ich jest i który stoi na k-tym miejscu?',
            tags: ['operator< na ułamkach', 'generowanie i sortowanie', 'NWD'],
            statement: ['Ciąg Fareya rzędu n to wszystkie ułamki nieskracalne p/q z przedziału od 0 do 1 (włącznie), których mianownik q wynosi najwyżej n, ułożone rosnąco. Na przykład dla n = 4: 0/1, 1/4, 1/3, 1/2, 2/3, 3/4, 1/1.',
                'Wypisz, ile wyrazów ma ciąg Fareya rzędu n, a potem odpowiedz na q pytań: jaki ułamek stoi na k-tym miejscu (od 1)? Wygeneruj wszystkie ułamki p/q z 0 ≤ p ≤ q ≤ n i NWD(p, q) = 1 do vector<Ulamek>, posortuj operatorem< (porównanie na krzyż) i odpowiadaj z tablicy.'],
            input_format: ['W pierwszym wierszu n i q.', 'W drugim wierszu q liczb k.'],
            output_format: ['Wiersz wyrazow: C, a potem q wierszy z ułamkami p/q.'],
            constraints: ['1 ≤ n ≤ 300, 1 ≤ q ≤ 1000', '1 ≤ k ≤ C (liczba wyrazów)'],
            examples: [{ input: '4 3\n1 4 7', note: 'Ciąg rzędu 4 ma 7 wyrazów: 0/1, 1/4, 1/3, 1/2, 2/3, 3/4, 1/1 — pierwszy to 0/1, czwarty 1/2, siódmy 1/1.' }],
            hint: R`Dwie pętle: for (q = 1..n) for (p = 0..q) if (__gcd(p, q) == 1) v.push_back({p, q});. Ułamek 0/q jest nieskracalny tylko dla q = 1 (NWD(0, q) = q), a q/q — też tylko dla q = 1. operator<: return p * o.q < o.p * q;.`,
            tests: (r) => {
                const ile = (n) => { let c = 0; for (let q = 1; q <= n; q++) for (let p = 0; p <= q; p++) if (Number(nwdB(BigInt(p), BigInt(q))) === 1) c++; return c; };
                const d = (n, ks) => `${n} ${ks.length}\n${ks.join(' ')}`;
                const los = (n, q) => { const C = ile(n); return d(n, Array.from({ length: q }, () => r.int(1, C))); };
                return [d(1, [1, 2]), d(5, Array.from({ length: 11 }, (_, i) => i + 1)), los(10, 20), los(300, 1000), los(137, 500), d(300, [1, ile(300), Math.floor(ile(300) / 2) + 1])];
            },
            check: (inp) => {
                const t = nums(inp); const [n, q] = t; if (!calk(n, 1, 300) || !calk(q, 1, 1000) || t.length !== 2 + q) return 'n';
                let C = 0; for (let b = 1; b <= n; b++) for (let a = 0; a <= b; a++) { let x = a, y = b; while (y) [x, y] = [y, x % y]; if (x === 1) C++; }
                return t.slice(2).every((k) => calk(k, 1, C)) ? null : 'k';
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0]; const v = [];
                for (let q = 1; q <= n; q++) for (let p = 0; p <= q; p++) { let x = p, y = q; while (y) [x, y] = [y, x % y]; if (x === 1) v.push([p, q]); }
                v.sort((a, b) => a[0] * b[1] - b[0] * a[1]);
                return [`wyrazow: ${v.length}`, ...t.slice(2).map((k) => `${v[k - 1][0]}/${v[k - 1][1]}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Ulamek {
    int p, q;
    bool operator<(const Ulamek &o) const {
        return p * o.q < o.p * q;
    }
};
int nwd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}
int main() {
    int n, ile;
    cin >> n >> ile;
    vector<Ulamek> v;
    for (int q = 1; q <= n; q++)
        for (int p = 0; p <= q; p++)
            if (nwd(p, q) == 1) v.push_back({p, q});
    sort(v.begin(), v.end());
    cout << "wyrazow: " << v.size() << "\n";
    for (int i = 0; i < ile; i++) {
        int k;
        cin >> k;
        cout << v[k - 1].p << "/" << v[k - 1].q << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-b-hotel', krok: 9, level: 'trudne',
            title: 'Hotel',
            short: 'Rezerwacje to struktury {pokój, od, do}. Nowa rezerwacja dostaje najniższy pokój wolny przez wszystkie noce; odwołanie zwalnia pokój, a recepcja pyta, kto śpi gdzie.',
            tags: ['map id → Rezerwacja', 'nachodzenie przedziałów', 'symulacja'],
            statement: ['Hotel ma R pokoi o numerach 1, …, R. Rezerwacja obejmuje noce od dnia od do dnia do − 1 (wyjazd w dniu do — tej nocy pokój jest już wolny). Obsłuż q poleceń:',
                'REZERWUJ id od do — nowa rezerwacja dostaje pokój o najniższym numerze, w którym żadna aktywna rezerwacja nie zajmuje żadnej z tych nocy; wypisz ID: pokoj P albo ID: brak miejsc (wtedy rezerwacja przepada). ODWOLAJ id — jeśli rezerwacja jest aktywna, usuń ją i wypisz ID: odwolana, inaczej ID: brak rezerwacji. KTO p noc — wypisz pokoj P, noc N: ID albo pokoj P, noc N: wolny.',
                'Dwie rezerwacje [a, b) i [c, d) zajmują wspólną noc dokładnie wtedy, gdy a < d i c < b.'],
            input_format: ['W pierwszym wierszu R i q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu na każde polecenie.'],
            constraints: ['1 ≤ R ≤ 50, 1 ≤ q ≤ 1000', 'Identyfikatory rezerwacji to liczby od 1 do 10⁶, każda REZERWUJ ma nowy, jeszcze nieużyty identyfikator.', '1 ≤ od < do ≤ 366, 1 ≤ p ≤ R, 1 ≤ noc ≤ 365'],
            examples: [{ input: '2 7\nREZERWUJ 1 10 15\nREZERWUJ 2 12 20\nREZERWUJ 3 15 16\nREZERWUJ 4 11 13\nKTO 2 14\nODWOLAJ 2\nREZERWUJ 5 13 14', note: 'Rezerwacja 1 → pokój 1, 2 nachodzi na nią → pokój 2, 3 zaczyna się w dniu wyjazdu 1 → pokój 1. Rezerwacja 4 nachodzi na obie — brak miejsc. Po odwołaniu 2 pokój 2 jest wolny.' }],
            hint: R`struct Rezerwacja { int pokoj, od, doo; }; map<int, Rezerwacja> aktywne;. REZERWUJ: vector<bool> zajety(R + 1, false); dla każdej aktywnej r, która nachodzi na [od, do), zajety[r.pokoj] = true; potem najmniejszy wolny pokój. (Słowo do jest zarezerwowane w C++ — pole nazwij inaczej.)`,
            tests: (r) => {
                const d = (R0, o) => `${R0} ${o.length}\n${o.join('\n')}`;
                const sesja = (R0, q, dl, dni) => {
                    let id = 0; const ids = []; const o = [];
                    while (o.length < q) {
                        const p = r();
                        if (p < 0.55) { const a = r.int(1, dni - 1); const b = Math.min(dni, a + r.int(1, dl)); id += r.int(1, 50); ids.push(id); o.push(`REZERWUJ ${id} ${a} ${b}`); }
                        else if (p < 0.75) o.push(`ODWOLAJ ${ids.length && r() < 0.85 ? r.pick(ids) : id + r.int(1, 99)}`);
                        else o.push(`KTO ${r.int(1, R0)} ${r.int(1, dni - 1)}`);
                    }
                    return d(R0, o);
                };
                return [d(1, ['KTO 1 1', 'ODWOLAJ 5']), d(1, ['REZERWUJ 7 1 366', 'REZERWUJ 8 1 2', 'KTO 1 365', 'ODWOLAJ 7', 'ODWOLAJ 7', 'REZERWUJ 9 365 366', 'KTO 1 365']), sesja(3, 40, 10, 30), sesja(50, 1000, 20, 366), sesja(5, 1000, 15, 60), sesja(20, 1000, 200, 366)];
            },
            check: (inp) => {
                const L = linie(inp); const [R0, q] = L[0].split(' ').map(Number); if (!calk(R0, 1, 50) || !calk(q, 1, 1000) || L.length !== q + 1) return 'q'; const uz = new Set();
                for (const l of L.slice(1)) { const t = l.split(' ').map((x, i) => (i ? Number(x) : x)); if (t[0] === 'REZERWUJ' && t.length === 4) { if (!calk(t[1], 1, 1e6) || uz.has(t[1]) || !calk(t[2], 1, 365) || !calk(t[3], 2, 366) || t[2] >= t[3]) return 'rezerwuj'; uz.add(t[1]); } else if (t[0] === 'ODWOLAJ' && t.length === 2) { if (!calk(t[1], 1, 1e6)) return 'odwolaj'; } else if (t[0] === 'KTO' && t.length === 3) { if (!calk(t[1], 1, R0) || !calk(t[2], 1, 365)) return 'kto'; } else return 'polecenie'; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const R0 = Number(L[0].split(' ')[0]); const A = new Map(); const o = [];
                for (const l of L.slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'REZERWUJ') { const [id, a, b] = t.slice(1).map(Number); const z = new Array(R0 + 1).fill(false); for (const x of A.values()) if (a < x[2] && x[1] < b) z[x[0]] = true; let p = 1; while (p <= R0 && z[p]) p++; if (p > R0) o.push(`${id}: brak miejsc`); else { A.set(id, [p, a, b]); o.push(`${id}: pokoj ${p}`); } }
                    else if (t[0] === 'ODWOLAJ') { const id = Number(t[1]); if (A.has(id)) { A.delete(id); o.push(`${id}: odwolana`); } else o.push(`${id}: brak rezerwacji`); }
                    else { const p = Number(t[1]), n = Number(t[2]); let kto = null; for (const [id, x] of A) if (x[0] === p && x[1] <= n && n < x[2]) kto = id; o.push(`pokoj ${p}, noc ${n}: ${kto === null ? 'wolny' : kto}`); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Rezerwacja {
    int pokoj, od, doo;
};
int main() {
    int R, q;
    cin >> R >> q;
    map<int, Rezerwacja> aktywne;
    for (int i = 0; i < q; i++) {
        string op;
        cin >> op;
        if (op == "REZERWUJ") {
            int id, a, b;
            cin >> id >> a >> b;
            vector<bool> zajety(R + 1, false);
            for (auto &[k, r] : aktywne)
                if (a < r.doo && r.od < b) zajety[r.pokoj] = true;
            int p = 1;
            while (p <= R && zajety[p]) p++;
            if (p > R) {
                cout << id << ": brak miejsc\n";
            } else {
                aktywne[id] = {p, a, b};
                cout << id << ": pokoj " << p << "\n";
            }
        } else if (op == "ODWOLAJ") {
            int id;
            cin >> id;
            if (aktywne.count(id)) {
                aktywne.erase(id);
                cout << id << ": odwolana\n";
            } else {
                cout << id << ": brak rezerwacji\n";
            }
        } else {
            int p, noc;
            cin >> p >> noc;
            int kto = -1;
            for (auto &[k, r] : aktywne)
                if (r.pokoj == p && r.od <= noc && noc < r.doo) kto = k;
            cout << "pokoj " << p << ", noc " << noc << ": ";
            if (kto == -1) cout << "wolny\n";
            else cout << kto << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-b-final-gielda', krok: 9, level: 'trudne',
            title: 'Wielki finał: giełda',
            short: 'Zlecenia kupna i sprzedaży czekają w dwóch setach uporządkowanych po cenie i czasie. Nowe zlecenie zawiera transakcje z najlepszymi czekającymi, a reszta trafia do arkusza.',
            tags: ['dwa sety z operator<', 'map id → zlecenie', 'symulacja dopasowań'],
            statement: ['Symulujesz arkusz zleceń na giełdzie. Zlecenie kupna to identyfikator, liczba akcji i najwyższa cena, jaką kupujący zapłaci; zlecenie sprzedaży — identyfikator, liczba akcji i najniższa cena, za jaką sprzedający sprzeda. Polecenia:',
                'KUP id ilosc cena — dopóki zlecenie ma jeszcze akcje do kupienia, a w arkuszu jest zlecenie sprzedaży z ceną nie wyższą niż cena: weź najlepsze z nich (najtańsze, a przy równej cenie — najstarsze), zawrzyj transakcję na min(obie ilości) akcji po cenie zlecenia z arkusza i wypisz TRANSAKCJA kupujacy sprzedajacy ilosc cena. To, czego nie kupiono, czeka w arkuszu. SPRZEDAJ id ilosc cena — tak samo, tylko z czekającymi zleceniami kupna o cenie nie niższej niż cena, od najdroższego (przy równej cenie — najstarszego); transakcja po cenie zlecenia kupna.',
                'ANULUJ id — jeśli zlecenie czeka w arkuszu, usuń je i wypisz ANULOWANO id, inaczej BRAK id. ARKUSZ — wypisz dwa wiersze: kupno: CENA x ILOSC dla najlepszej ceny kupna (ILOSC to suma akcji wszystkich czekających zleceń kupna z tą ceną) albo kupno: brak, i tak samo sprzedaz: CENA x ILOSC albo sprzedaz: brak.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersze wypisywane przez polecenia, w kolejności.'],
            constraints: ['1 ≤ q ≤ 2000', 'Identyfikatory zleceń są różne, od 1 do 10⁶; 1 ≤ ilosc ≤ 1000, 1 ≤ cena ≤ 10⁶', 'Program wypisuje co najmniej 1 i najwyżej 700 wierszy.'],
            examples: [{ input: '7\nSPRZEDAJ 1 50 102\nSPRZEDAJ 2 30 100\nKUP 3 60 101\nARKUSZ\nKUP 4 70 105\nANULUJ 1\nARKUSZ', note: 'Kupno 3 zawiera transakcję z najtańszym zleceniem 2 (30 akcji po 100); zlecenie 1 po 102 jest za drogie, więc 30 akcji czeka po 101. Kupno 4 bierze całe zlecenie 1 (50 po 102), a 20 akcji czeka po 105. Zlecenie 1 już nie istnieje.' }],
            hint: R`Dwie struktury: Kupno z operator< (cena malejąco, potem czas rosnąco) i Sprzedaz (cena rosnąco, potem czas). set<Kupno> kupno; set<Sprzedaz> sprzedaz;. Elementów setu nie wolno zmieniać, więc pozostałe ilości trzymaj osobno: map<int, int> zostalo; — a map<int, Kupno> i map<int, Sprzedaz> pozwolą znaleźć zlecenie do anulowania. Najlepsze zlecenie to *s.begin().`,
            tests: (r) => {
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                // Polecenia generujemy na symulatorze, a potem bierzemy najdłuższy początek, który wypisuje najwyżej 700 wierszy.
                const sesja = (q, sr, roz, mx) => {
                    const G = nowaGielda(); const o = [], w = []; let id = 0; const ids = [];
                    while (o.length < q) {
                        const p = r(); let l;
                        if (p < 0.42) { id += r.int(1, 30); ids.push(id); l = `KUP ${id} ${r.int(1, mx)} ${sr - r.int(-roz, roz * 2)}`; }
                        else if (p < 0.84) { id += r.int(1, 30); ids.push(id); l = `SPRZEDAJ ${id} ${r.int(1, mx)} ${sr + r.int(-roz, roz * 2)}`; }
                        else if (p < 0.93) l = `ANULUJ ${ids.length && r() < 0.8 ? r.pick(ids) : id + r.int(1, 50)}`;
                        else l = 'ARKUSZ';
                        o.push(l); w.push(G.wykonaj(l).length);
                    }
                    let s = 0, k = 0;
                    while (k < o.length && s + w[k] <= 700) { s += w[k]; k++; }
                    const wynik = o.slice(0, k);
                    if (!s) wynik.push('ARKUSZ');
                    return wynik;
                };
                return [d(['ARKUSZ']), d(['KUP 5 10 100', 'KUP 6 10 100', 'KUP 7 5 101', 'SPRZEDAJ 8 22 99', 'ARKUSZ', 'ANULUJ 6', 'ANULUJ 5', 'ARKUSZ', 'SPRZEDAJ 9 1 1000000', 'KUP 10 1000 1000000', 'ARKUSZ']), d(sesja(40, 100, 5, 20)), d(sesja(2000, 50000, 300, 1000)), d(sesja(2000, 1000, 20, 50)), d(sesja(1000, 10, 3, 5))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q'; const uz = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if ((t[0] === 'KUP' || t[0] === 'SPRZEDAJ') && t.length === 4) { const id = Number(t[1]); if (!calk(id, 1, 1e6) || uz.has(id) || !calk(Number(t[2]), 1, 1000) || !calk(Number(t[3]), 1, 1e6)) return 'zlecenie'; uz.add(id); } else if (t[0] === 'ANULUJ' && t.length === 2) { if (!calk(Number(t[1]), 1, 1e6)) return 'anuluj'; } else if (!(t[0] === 'ARKUSZ' && t.length === 1)) return 'polecenie'; }
                const G = nowaGielda(); let w = 0; for (const l of L.slice(1)) w += G.wykonaj(l).length;
                return w >= 1 && w <= 700 ? null : `wierszy ${w}`;
            },
            solve: (inp) => { const G = nowaGielda(); return linie(inp).slice(1).flatMap((l) => G.wykonaj(l)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Kupno {
    long long cena;
    int czas, id;
    bool operator<(const Kupno &o) const {
        if (cena != o.cena) return cena > o.cena;
        return czas < o.czas;
    }
};
struct Sprzedaz {
    long long cena;
    int czas, id;
    bool operator<(const Sprzedaz &o) const {
        if (cena != o.cena) return cena < o.cena;
        return czas < o.czas;
    }
};
set<Kupno> kupno;
set<Sprzedaz> sprzedaz;
map<int, int> zostalo;
map<int, Kupno> czekaK;
map<int, Sprzedaz> czekaS;
void kup(int id, int ilosc, long long cena, int czas) {
    while (ilosc > 0 && !sprzedaz.empty() && sprzedaz.begin()->cena <= cena) {
        Sprzedaz s = *sprzedaz.begin();
        int t = min(ilosc, zostalo[s.id]);
        cout << "TRANSAKCJA " << id << " " << s.id << " " << t << " " << s.cena << "\n";
        ilosc -= t;
        zostalo[s.id] -= t;
        if (zostalo[s.id] == 0) {
            sprzedaz.erase(sprzedaz.begin());
            zostalo.erase(s.id);
            czekaS.erase(s.id);
        }
    }
    if (ilosc > 0) {
        Kupno k = {cena, czas, id};
        kupno.insert(k);
        zostalo[id] = ilosc;
        czekaK[id] = k;
    }
}
void sprzedaj(int id, int ilosc, long long cena, int czas) {
    while (ilosc > 0 && !kupno.empty() && kupno.begin()->cena >= cena) {
        Kupno k = *kupno.begin();
        int t = min(ilosc, zostalo[k.id]);
        cout << "TRANSAKCJA " << k.id << " " << id << " " << t << " " << k.cena << "\n";
        ilosc -= t;
        zostalo[k.id] -= t;
        if (zostalo[k.id] == 0) {
            kupno.erase(kupno.begin());
            zostalo.erase(k.id);
            czekaK.erase(k.id);
        }
    }
    if (ilosc > 0) {
        Sprzedaz s = {cena, czas, id};
        sprzedaz.insert(s);
        zostalo[id] = ilosc;
        czekaS[id] = s;
    }
}
int main() {
    kupno.clear();
    sprzedaz.clear();
    zostalo.clear();
    czekaK.clear();
    czekaS.clear();
    int q;
    cin >> q;
    for (int czas = 0; czas < q; czas++) {
        string op;
        cin >> op;
        if (op == "KUP" || op == "SPRZEDAJ") {
            int id, ilosc;
            long long cena;
            cin >> id >> ilosc >> cena;
            if (op == "KUP") kup(id, ilosc, cena, czas);
            else sprzedaj(id, ilosc, cena, czas);
        } else if (op == "ANULUJ") {
            int id;
            cin >> id;
            if (czekaK.count(id)) {
                kupno.erase(czekaK[id]);
                czekaK.erase(id);
                zostalo.erase(id);
                cout << "ANULOWANO " << id << "\n";
            } else if (czekaS.count(id)) {
                sprzedaz.erase(czekaS[id]);
                czekaS.erase(id);
                zostalo.erase(id);
                cout << "ANULOWANO " << id << "\n";
            } else {
                cout << "BRAK " << id << "\n";
            }
        } else {
            if (kupno.empty()) cout << "kupno: brak\n";
            else {
                long long c = kupno.begin()->cena, suma = 0;
                for (const Kupno &k : kupno) {
                    if (k.cena != c) break;
                    suma += zostalo[k.id];
                }
                cout << "kupno: " << c << " x " << suma << "\n";
            }
            if (sprzedaz.empty()) cout << "sprzedaz: brak\n";
            else {
                long long c = sprzedaz.begin()->cena, suma = 0;
                for (const Sprzedaz &s : sprzedaz) {
                    if (s.cena != c) break;
                    suma += zostalo[s.id];
                }
                cout << "sprzedaz: " << c << " x " << suma << "\n";
            }
        }
    }
    return 0;
}`,
        },
    ];
};
