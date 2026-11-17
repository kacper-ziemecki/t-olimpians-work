// Input i Output (+) — ćwiczenia w trakcie lekcji, części 7–8: polecenia różnych typów (znak albo słowo mówi, co wczytać dalej:
// licznik, robot, konto, lista zakupów na set<string>, zapytania 1/2/3 na multisecie, edytor z cofaniem, notatnik z resztą wiersza,
// magazyn na vectorze par) oraz duże dane (szablon z sync_with_stdio, dużo wierszy wyniku z "\n", przetwarzanie w locie,
// dane z generatora, suma kontrolna zamiast milionów wyników, budowanie wiersza w napisie, pytania o sumy przedziałów).
module.exports = (h) => {
    const { toks } = h;
    const P = require('./input-output-plus-pomoc');
    const { PRODUKTY, SLOWA, losy, calk, czyLiczba, mulmod, dobryGen } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');

    // Ciąg z generatora liczony w locie (bez tablicy): wywołuje f(x, i) dla i = 1..n.
    const gen = (n, s, a, b, m, f) => { let x = s; for (let i = 1; i <= n; i++) { if (i > 1) x = (mulmod(x, a, m) + b) % m; f(x, i); } };
    const losGen = (r, n, m) => `${n} ${r.int(0, m - 1)} ${r.int(1, Math.max(1, m - 1))} ${r.int(0, m - 1)} ${m}`;

    return [
        // ================================================================ KROK 7 · polecenia różnych typów
        {
            id: 'iop-licznik-polecen', krok: 7, level: 'latwe',
            title: 'Licznik na polecenia',
            short: 'Polecenia + x, - x i ?. Tylko ? coś wypisuje. Po znaku polecenia wiesz, czy wczytywać jeszcze liczbę.',
            tags: ['char polecenie', 'liczba tylko czasem', 'q poleceń'],
            statement: ['Licznik zaczyna od 0. Dostajesz q poleceń: + x (dodaj x), - x (odejmij x) oraz ? (wypisz aktualną wartość licznika). Polecenie ? nie ma liczby — po znaku zapytania od razu zaczyna się następne polecenie.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z następnych q wierszy jedno polecenie.'],
            output_format: ['Wartość licznika po każdym poleceniu ?, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 7000', '0 ≤ x ≤ 10⁹', 'Poleceń ? jest od 1 do 1500.'],
            examples: [{ input: '5\n+ 10\n?\n- 3\n+ 100\n?', note: 'Po pierwszym ? licznik ma 10, po drugim 10 − 3 + 100 = 107.' }],
            hint: R`Wczytaj znak polecenia do char op, a liczbę tylko wtedy, gdy op to '+' albo '-'. Gdybyś wczytywał x przy każdym poleceniu, przy ? wczytałbyś do x znak następnego polecenia — i strumień przeszedłby w stan błędu. Licznik w long long.`,
            tests: (r) => {
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q, pyt) => { const a = []; let z = 0; for (let i = 0; i < q; i++) { if ((r() < pyt && z < 1500) || (i === q - 1 && !z)) { a.push('?'); z++; } else a.push(`${r.pick('+-')} ${r.int(0, 1000000000)}`); } return a; };
                return [d(['?']), d(['- 5', '?', '+ 5', '?']), d(los(20, 0.3)), d(los(7000, 0.1)), d([...Array(5500).fill('- 1000000000'), ...Array(1500).fill('?')])];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 7000) || L.length !== q + 1) return 'q';
                let z = 0; for (const l of L.slice(1)) { if (l === '?') { z++; continue; } const m = l.match(/^[+-] (\d+)$/); if (!m || Number(m[1]) > 1e9) return 'polecenie'; }
                return z >= 1 && z <= 1500 ? null : 'pytania';
            },
            solve: (inp) => { let v = 0; const o = []; for (const l of linie(inp).slice(1)) { if (l === '?') o.push(v); else v += (l[0] === '+' ? 1 : -1) * Number(l.slice(2)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    long long licznik = 0;
    while (q--) {
        char op;
        cin >> op;
        if (op == '?') {
            cout << licznik << "\n";
        } else {
            long long x;
            cin >> x;
            if (op == '+') licznik += x;
            else licznik -= x;
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-robot-na-kratce', krok: 7, level: 'latwe',
            title: 'Robot na kratce',
            short: 'Polecenia N 5, E 3, S 2, W 1 przesuwają robota, a GDZIE każe podać pozycję. Słowo polecenia mówi, co wczytać dalej.',
            tags: ['string polecenie', 'różna liczba danych', 'KONIEC kończy'],
            statement: ['Robot stoi w punkcie (0, 0). Polecenia N k, S k, E k i W k przesuwają go o k kratek: na północ (y rośnie), na południe (y maleje), na wschód (x rośnie) i na zachód (x maleje). Polecenie GDZIE każe wypisać aktualną pozycję w formacie (x, y). Polecenie KONIEC kończy dane.'],
            input_format: ['Polecenia, każde w osobnym wierszu, aż do polecenia KONIEC.'],
            output_format: ['Pozycja robota po każdym poleceniu GDZIE, w formacie (x, y) — z przecinkiem i spacją.'],
            constraints: ['Poleceń jest najwyżej 10 000, w tym najwyżej 1000 poleceń GDZIE.', '1 ≤ k ≤ 1000'],
            examples: [{ input: 'N 5\nE 3\nGDZIE\nS 10\nW 1\nGDZIE\nKONIEC', note: 'Po N 5 i E 3 robot stoi w (3, 5). Potem schodzi o 10 na południe i o 1 na zachód: (2, −5).' }],
            hint: R`while (cin >> p && p != "KONIEC") { if (p == "GDZIE") wypisz; else { cin >> k; … } }. Słowo GDZIE nie ma liczby, więc k wczytuj tylko przy N, S, E i W.`,
            tests: (r) => {
                const los = (n, pyt) => { const a = []; let z = 0; for (let i = 0; i < n; i++) { if (r() < pyt && z < 1000) { a.push('GDZIE'); z++; } else a.push(`${r.pick('NSEW')} ${r.int(1, 1000)}`); } if (!z) a.push('GDZIE'); return [...a, 'KONIEC'].join('\n'); };
                return ['GDZIE\nKONIEC', 'W 1\nS 1\nGDZIE\nKONIEC', los(20, 0.3), los(9000, 0.1), [...Array(8999).fill('S 1000'), 'GDZIE', 'KONIEC'].join('\n')];
            },
            check: (inp) => {
                const L = linie(inp); if (L[L.length - 1] !== 'KONIEC' || L.length > 10001) return 'KONIEC';
                let z = 0; for (const l of L.slice(0, -1)) { if (l === 'GDZIE') { z++; continue; } const m = l.match(/^[NSEW] (\d+)$/); if (!m || !calk(Number(m[1]), 1, 1000)) return 'polecenie'; }
                return z <= 1000 ? null : 'GDZIE';
            },
            solve: (inp) => {
                let x = 0, y = 0; const o = [];
                for (const l of linie(inp)) { if (l === 'KONIEC') break; if (l === 'GDZIE') { o.push(`(${x}, ${y})`); continue; } const k = Number(l.slice(2)); if (l[0] === 'N') y += k; else if (l[0] === 'S') y -= k; else if (l[0] === 'E') x += k; else x -= k; }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string p;
    long long x = 0, y = 0;
    while (cin >> p && p != "KONIEC") {
        if (p == "GDZIE") {
            cout << "(" << x << ", " << y << ")\n";
        } else {
            long long k;
            cin >> k;
            if (p == "N") y += k;
            else if (p == "S") y -= k;
            else if (p == "E") x += k;
            else x -= k;
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-konto-w-banku', krok: 7, level: 'latwe',
            title: 'Konto w banku',
            short: 'WPLATA, WYPLATA i STAN. Wypłata większa niż saldo nie przechodzi — wtedy wypisz ODMOWA.',
            tags: ['polecenia-słowa', 'warunek przy poleceniu', 'long long'],
            statement: ['Konto zaczyna z saldem 0 zł. Polecenia: WPLATA x — wpłać x zł; WYPLATA x — wypłać x zł, ale tylko jeśli na koncie jest co najmniej x (inaczej wypisz ODMOWA i niczego nie zmieniaj); STAN — wypisz saldo.'],
            input_format: ['W pierwszym wierszu q.', 'q poleceń, każde w osobnym wierszu.'],
            output_format: ['Wiersz dla każdego polecenia STAN (saldo) i dla każdej odrzuconej wypłaty (ODMOWA) — w kolejności poleceń.'],
            constraints: ['1 ≤ q ≤ 1500', '1 ≤ x ≤ 10⁹'],
            examples: [{ input: '6\nWPLATA 100\nWYPLATA 30\nSTAN\nWYPLATA 100\nWPLATA 5\nSTAN', note: 'Po wypłacie 30 zostaje 70 zł. Wypłata 100 jest odrzucona, a po wpłacie 5 jest 75.' }],
            hint: R`Wczytaj słowo polecenia do string. Liczbę wczytuj tylko przy WPLATA i WYPLATA — STAN jej nie ma. Przy wypłacie najpierw sprawdź saldo >= x; dopiero wtedy odejmij. Saldo w long long.`,
            tests: (r) => {
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q) => Array.from({ length: q }, () => { const p = r(); return p < 0.35 ? `WPLATA ${r.int(1, 1000)}` : p < 0.75 ? `WYPLATA ${r.int(1, 1000)}` : 'STAN'; });
                return [d(['STAN']), d(['WYPLATA 1', 'WPLATA 1', 'WYPLATA 1', 'STAN']), d(los(30)), d(los(1500)), d([...Array(1000).fill('WPLATA 1000000000'), ...Array(500).fill('STAN')])];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1500) || L.length !== q + 1) return 'q'; return L.slice(1).every((l) => l === 'STAN' || ((m) => m && calk(Number(m[1]), 1, 1e9))(l.match(/^WY?PLATA (\d+)$/))) ? null : 'polecenie'; },
            solve: (inp) => {
                let s = 0; const o = [];
                for (const l of linie(inp).slice(1)) { if (l === 'STAN') { o.push(s); continue; } const [p, x] = l.split(' '); if (p === 'WPLATA') s += Number(x); else if (s >= Number(x)) s -= Number(x); else o.push('ODMOWA'); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    long long saldo = 0;
    while (q--) {
        string p;
        cin >> p;
        if (p == "STAN") {
            cout << saldo << "\n";
        } else {
            long long x;
            cin >> x;
            if (p == "WPLATA") saldo += x;
            else if (saldo >= x) saldo -= x;
            else cout << "ODMOWA\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-lista-zakupow', krok: 7, level: 'srednie',
            title: 'Lista zakupów',
            short: 'DODAJ, USUN, ILE i POKAZ na zbiorze napisów. POKAZ wypisuje listę alfabetycznie, po przecinku — albo PUSTA.',
            tags: ['set<string>', 'polecenia-słowa', 'separator „, ”'],
            statement: ['Rodzina prowadzi wspólną listę zakupów. Polecenia: DODAJ produkt (jeśli już jest na liście — nic się nie dzieje), USUN produkt (jeśli go nie ma — nic się nie dzieje), ILE (wypisz liczbę produktów na liście) i POKAZ (wypisz produkty alfabetycznie, oddzielone przecinkiem i spacją, albo PUSTA, gdy lista jest pusta).'],
            input_format: ['W pierwszym wierszu q.', 'q poleceń, każde w osobnym wierszu.'],
            output_format: ['Wiersz dla każdego polecenia ILE i POKAZ.'],
            constraints: ['1 ≤ q ≤ 3000', 'Nazwy produktów: od 1 do 10 małych liter; na liście nigdy nie ma więcej niż 30 produktów.', 'Poleceń POKAZ jest najwyżej 40.'],
            examples: [{ input: '7\nDODAJ mleko\nDODAJ chleb\nDODAJ mleko\nPOKAZ\nUSUN mleko\nILE\nPOKAZ', note: 'Drugie DODAJ mleko niczego nie zmienia. Po usunięciu mleka zostaje tylko chleb.' }],
            hint: R`set<string> trzyma produkty bez powtórzeń i alfabetycznie — insert i erase same ignorują to, czego nie trzeba robić. Przy POKAZ przejdź zbiór pętlą i wypisuj ", " przed każdym produktem oprócz pierwszego; pusty zbiór sprawdzisz przez empty().`,
            tests: (r) => {
                const pula = PRODUKTY.slice(0, 30);
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q) => { let z = 0; return Array.from({ length: q }, () => { const p = r(); if (p < 0.4) return `DODAJ ${r.pick(pula)}`; if (p < 0.65) return `USUN ${r.pick(pula)}`; if (p < 0.9 || z >= 40) return 'ILE'; z++; return 'POKAZ'; }); };
                return [d(['POKAZ']), d(['USUN ser', 'ILE', 'DODAJ ser', 'DODAJ ser', 'POKAZ']), d(los(30)), d(los(3000)), d([...pula.map((p) => `DODAJ ${p}`), ...Array(40).fill('POKAZ')])];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                const s = new Set(); let z = 0;
                for (const l of L.slice(1)) { if (l === 'ILE') continue; if (l === 'POKAZ') { z++; continue; } const m = l.match(/^(DODAJ|USUN) ([a-z]{1,10})$/); if (!m) return 'polecenie'; if (m[1] === 'DODAJ') s.add(m[2]); else s.delete(m[2]); if (s.size > 30) return '30'; }
                return z <= 40 ? null : 'POKAZ';
            },
            solve: (inp) => {
                const s = new Set(); const o = [];
                for (const l of linie(inp).slice(1)) { const [p, x] = l.split(' '); if (p === 'DODAJ') s.add(x); else if (p === 'USUN') s.delete(x); else if (p === 'ILE') o.push(s.size); else o.push(s.size ? [...s].sort().join(', ') : 'PUSTA'); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<string> lista;
    while (q--) {
        string p;
        cin >> p;
        if (p == "DODAJ" || p == "USUN") {
            string x;
            cin >> x;
            if (p == "DODAJ") lista.insert(x);
            else lista.erase(x);
        } else if (p == "ILE") {
            cout << lista.size() << "\n";
        } else {
            if (lista.empty()) cout << "PUSTA";
            bool pierwszy = true;
            for (auto &x : lista) {
                if (!pierwszy) cout << ", ";
                cout << x;
                pierwszy = false;
            }
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-zapytania-typu', krok: 7, level: 'srednie',
            title: 'Zapytania typu 1, 2 i 3',
            short: 'Na olimpiadzie polecenia to często numery: 1 x — dodaj, 2 x — usuń jedną kopię, 3 — najmniejsza i największa. multiset.',
            tags: ['numer typu zapytania', 'multiset', 'erase(find(x))'],
            statement: ['Na zawodach polecenia zapisuje się zwykle numerami. Masz pusty worek liczb (powtórzenia są dozwolone) i q zapytań:',
                '1 x — wrzuć liczbę x do worka;',
                '2 x — wyjmij z worka jedną kopię liczby x (jeśli jej nie ma — nic nie rób);',
                '3 — wypisz najmniejszą i największą liczbę w worku, oddzielone spacją, albo PUSTO, gdy worek jest pusty.'],
            input_format: ['W pierwszym wierszu q.', 'q zapytań, każde w osobnym wierszu.'],
            output_format: ['Wiersz dla każdego zapytania typu 3.'],
            constraints: ['1 ≤ q ≤ 7000', '−10⁹ ≤ x ≤ 10⁹', 'Zapytań typu 3 jest od 1 do 1000.'],
            examples: [{ input: '7\n1 5\n1 2\n1 5\n3\n2 5\n2 2\n3', note: 'Po trzech wrzutach worek to {2, 5, 5}. Wyjmujemy jedną piątkę i dwójkę — zostaje {5}, więc najmniejsza i największa to 5.' }],
            hint: R`Wczytaj typ do int. Typy 1 i 2 mają liczbę, typ 3 — nie. multiset<long long> m: wrzucanie to m.insert(x), a wyjęcie jednej kopii — auto it = m.find(x); if (it != m.end()) m.erase(it);. Uwaga: m.erase(x) usunąłby wszystkie kopie. Najmniejsza to *m.begin(), największa — *m.rbegin().`,
            tests: (r) => {
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q, M) => { const w = []; let z = 0; const a = []; for (let i = 0; i < q; i++) { const p = r(); if ((p < 0.12 && z < 1000) || (i === q - 1 && !z)) { a.push('3'); z++; } else if (p < 0.6 || !w.length) { const x = r.int(-M, M); w.push(x); a.push(`1 ${x}`); } else { const x = r() < 0.8 ? r.pick(w) : r.int(-M, M); a.push(`2 ${x}`); } } return a; };
                return [d(['3']), d(['2 7', '1 7', '1 7', '2 7', '3', '2 7', '3']), d(los(25, 5)), d(los(7000, 1000000000)), d(los(7000, 3))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 7000) || L.length !== q + 1) return 'q';
                let z = 0; for (const l of L.slice(1)) { if (l === '3') { z++; continue; } const m = l.match(/^[12] (-?\d+)$/); if (!m || !calk(Number(m[1]), -1e9, 1e9)) return 'zapytanie'; }
                return z >= 1 && z <= 1000 ? null : 'typ 3';
            },
            solve: (inp) => {
                const m = new Map(); let ile = 0; const o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === '3') { if (!ile) o.push('PUSTO'); else { const k = [...m.keys()]; o.push(`${Math.min(...k)} ${Math.max(...k)}`); } continue; }
                    const [t, xs] = l.split(' '); const x = Number(xs);
                    if (t === '1') { m.set(x, (m.get(x) || 0) + 1); ile++; } else if (m.has(x)) { ile--; if (m.get(x) === 1) m.delete(x); else m.set(x, m.get(x) - 1); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    multiset<long long> worek;
    while (q--) {
        int typ;
        cin >> typ;
        if (typ == 3) {
            if (worek.empty()) cout << "PUSTO\n";
            else cout << *worek.begin() << " " << *worek.rbegin() << "\n";
        } else {
            long long x;
            cin >> x;
            if (typ == 1) worek.insert(x);
            else {
                auto it = worek.find(x);
                if (it != worek.end()) worek.erase(it);
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-edytor-z-cofaniem', krok: 7, level: 'srednie',
            title: 'Edytor z cofaniem',
            short: 'PISZ słowo dopisuje słowo, COFNIJ kasuje ostatnie, POKAZ wypisuje tekst. vector<string> jako stos.',
            tags: ['push_back i pop_back', 'COFNIJ na pustym', 'polecenia-słowa'],
            statement: ['Prosty edytor tekstu przyjmuje polecenia: PISZ slowo — dopisz słowo na końcu tekstu; COFNIJ — usuń ostatnio dopisane słowo (jeśli tekst jest pusty — nic się nie dzieje); POKAZ — wypisz cały tekst, słowa oddzielone spacjami, albo (pusto), gdy tekstu nie ma.'],
            input_format: ['W pierwszym wierszu q.', 'q poleceń, każde w osobnym wierszu.'],
            output_format: ['Wiersz dla każdego polecenia POKAZ.'],
            constraints: ['1 ≤ q ≤ 5000', 'Słowa mają od 1 do 10 liter.', 'Poleceń POKAZ jest od 1 do 80; tekst nigdy nie ma więcej niż 25 słów.'],
            examples: [{ input: '6\nPISZ Ala\nPISZ ma\nPISZ psa\nCOFNIJ\nPISZ kota\nPOKAZ', note: 'COFNIJ usuwa psa, a w jego miejsce trafia kota.' }],
            hint: R`Tekst trzymaj w vector<string>. PISZ to push_back, COFNIJ to pop_back — ale tylko gdy vector nie jest pusty (pop_back na pustym to błąd programu). Przy PISZ wczytaj jeszcze słowo, przy pozostałych poleceniach — nic.`,
            tests: (r) => {
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q) => { let n = 0, z = 0; const a = []; for (let i = 0; i < q; i++) { const p = r(); if ((p < 0.1 && z < 80) || (i === q - 1 && !z)) { a.push('POKAZ'); z++; } else if (p < 0.6 && n < 25) { a.push(`PISZ ${r.pick(SLOWA.filter((w) => w.length <= 10))}`); n++; } else { a.push('COFNIJ'); n = Math.max(0, n - 1); } } return a; };
                return [d(['POKAZ']), d(['COFNIJ', 'COFNIJ', 'PISZ a', 'POKAZ', 'COFNIJ', 'POKAZ']), d(los(30)), d(los(5000)), d([...Array.from({ length: 25 }, () => `PISZ ${r.word(10)}`), ...Array(80).fill('POKAZ')])];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 5000) || L.length !== q + 1) return 'q';
                let n = 0, z = 0; for (const l of L.slice(1)) { if (l === 'POKAZ') z++; else if (l === 'COFNIJ') n = Math.max(0, n - 1); else if (/^PISZ [A-Za-z]{1,10}$/.test(l)) { n++; if (n > 25) return '25'; } else return 'polecenie'; }
                return z >= 1 && z <= 80 ? null : 'POKAZ';
            },
            solve: (inp) => { const t = []; const o = []; for (const l of linie(inp).slice(1)) { if (l === 'POKAZ') o.push(t.length ? t.join(' ') : '(pusto)'); else if (l === 'COFNIJ') t.pop(); else t.push(l.slice(5)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<string> tekst;
    while (q--) {
        string p;
        cin >> p;
        if (p == "PISZ") {
            string w;
            cin >> w;
            tekst.push_back(w);
        } else if (p == "COFNIJ") {
            if (!tekst.empty()) tekst.pop_back();
        } else {
            if (tekst.empty()) cout << "(pusto)";
            for (int i = 0; i < (int)tekst.size(); i++) cout << (i ? " " : "") << tekst[i];
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-notatnik', krok: 7, level: 'srednie',
            title: 'Notatnik',
            short: 'NOTUJ i cały tekst do końca wiersza — razem ze spacjami. Po cin >> polecenie dociągnij resztę wiersza przez getline.',
            tags: ['cin >> słowo, potem getline', 'spacja po poleceniu', 'POKAZ k'],
            statement: ['Notatnik przyjmuje polecenia: NOTUJ tekst — zapisz notatkę (tekst może mieć spacje i ciągnie się do końca wiersza); POKAZ k — wypisz k-tą notatkę (licząc od 1) albo BRAK, jeśli takiej nie ma; ILE — wypisz liczbę notatek.'],
            input_format: ['Polecenia, każde w osobnym wierszu — do końca danych.'],
            output_format: ['Wiersz dla każdego polecenia POKAZ i ILE.'],
            constraints: ['Poleceń jest od 1 do 3000, w tym najwyżej 400 poleceń POKAZ i ILE razem.', 'Tekst notatki ma od 1 do 60 znaków (litery, cyfry, spacje, interpunkcja) i nie zaczyna się ani nie kończy spacją.', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: 'NOTUJ kupic mleko\nNOTUJ zadanie z matmy na piatek\nPOKAZ 2\nPOKAZ 5\nILE', note: 'Druga notatka ma pięć słów — getline bierze cały wiersz. Notatki numer 5 nie ma.' }],
            hint: R`cin >> polecenie wczyta samo słowo NOTUJ, a reszta wiersza zaczyna się od spacji. getline(cin, tekst) da " kupic mleko" — ze spacją na początku. Przeskocz ją wcześniej: getline(cin >> ws, tekst). Notatki trzymaj w vector<string>; przy POKAZ k sprawdź, czy k ≤ size().`,
            tests: (r) => {
                const nota = () => { let s = ''; while (!s.length || s.length > 60) s = Array.from({ length: r.int(1, 8) }, () => (r() < 0.8 ? r.pick(SLOWA) : String(r.int(1, 99)) + r.pick(['', '!', ',', '?']))).join(' '); return s; };
                const los = (q) => { let n = 0, z = 0; const a = []; for (let i = 0; i < q; i++) { const p = r(); if (p < 0.15 && z < 400) { a.push(r() < 0.8 ? `POKAZ ${r.int(1, Math.max(1, n + 2))}` : 'ILE'); z++; } else { a.push(`NOTUJ ${nota()}`); n++; } } return a.join('\n'); };
                return ['ILE', 'NOTUJ a\nPOKAZ 1\nPOKAZ 2\nPOKAZ 1000000000', 'NOTUJ kupic mleko\nNOTUJ zadanie z matmy na piatek\nPOKAZ 2\nPOKAZ 5\nILE', los(30), los(3000)];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 3000) return 'ile';
                let z = 0; for (const l of L) { if (l === 'ILE') { z++; continue; } let m = l.match(/^POKAZ (\d+)$/); if (m) { z++; if (!calk(Number(m[1]), 1, 1e9)) return 'k'; continue; } m = l.match(/^NOTUJ (\S.{0,58}\S|\S)$/); if (!m) return 'NOTUJ'; }
                return z <= 400 ? null : 'za dużo pytań';
            },
            solve: (inp) => { const t = []; const o = []; for (const l of linie(inp)) { if (l === 'ILE') o.push(t.length); else if (l.startsWith('POKAZ ')) { const k = Number(l.slice(6)); o.push(k <= t.length ? t[k - 1] : 'BRAK'); } else t.push(l.slice(6)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<string> notatki;
    string p;
    while (cin >> p) {
        if (p == "NOTUJ") {
            string tekst;
            getline(cin >> ws, tekst);
            notatki.push_back(tekst);
        } else if (p == "POKAZ") {
            long long k;
            cin >> k;
            if (k <= (long long)notatki.size()) cout << notatki[k - 1] << "\n";
            else cout << "BRAK\n";
        } else {
            cout << notatki.size() << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-magazyn', krok: 7, level: 'trudne',
            title: 'Magazyn',
            short: 'PRZYJMIJ, WYDAJ, STAN i RAPORT dla wielu towarów. Bez map: vector par (nazwa, ilość) i szukanie po nazwie.',
            tags: ['polecenia z różną liczbą danych', 'vector<pair<string, long long>>', 'raport alfabetycznie'],
            statement: ['Magazyn przyjmuje polecenia:',
                'PRZYJMIJ nazwa ilosc — przyjmij towar;',
                'WYDAJ nazwa ilosc — wydaj towar, ale tylko jeśli jest go wystarczająco dużo; inaczej wypisz BRAK nazwa i niczego nie zmieniaj;',
                'STAN nazwa — wypisz ilość tego towaru (0, jeśli go nie ma);',
                'RAPORT — wypisz w jednym wierszu wszystkie towary o dodatniej ilości, alfabetycznie, w formacie nazwa: ilosc, oddzielone średnikiem i spacją; gdy magazyn jest pusty — PUSTO.'],
            input_format: ['W pierwszym wierszu q.', 'q poleceń, każde w osobnym wierszu.'],
            output_format: ['Wiersze dla poleceń STAN i RAPORT oraz dla nieudanych WYDAJ — w kolejności poleceń.'],
            constraints: ['1 ≤ q ≤ 1000', 'Nazwy: od 1 do 12 małych liter; różnych nazw jest najwyżej 25.', '1 ≤ ilość ≤ 10⁶', 'Poleceń RAPORT jest najwyżej 10.'],
            examples: [{ input: '8\nPRZYJMIJ cukier 50\nPRZYJMIJ maka 20\nWYDAJ cukier 70\nWYDAJ cukier 50\nSTAN cukier\nPRZYJMIJ cukier 5\nRAPORT\nSTAN sol', note: 'Wydanie 70 kg cukru się nie udaje (jest tylko 50). Potem cukier znika do zera i wraca w ilości 5. Soli nigdy nie było — STAN wypisuje 0.' }],
            hint: R`Trzymaj vector<pair<string, long long>> — nazwę i ilość. Napisz lambdę, która zwraca indeks towaru o danej nazwie albo -1 (pętla po vectorze). Przy PRZYJMIJ nowy towar dopisz przez push_back. RAPORT: skopiuj vector, posortuj (pary sortują się po nazwie) i wypisz te z ilością większą od zera, z separatorem "; ".`,
            tests: (r) => {
                const pula = PRODUKTY.slice(0, 25);
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q, maxI) => { let z = 0; return Array.from({ length: q }, () => { const p = r(); if (p < 0.4) return `PRZYJMIJ ${r.pick(pula)} ${r.int(1, maxI)}`; if (p < 0.75) return `WYDAJ ${r.pick(pula)} ${r.int(1, maxI)}`; if (p < 0.97 || z >= 10) return `STAN ${r.pick(pula)}`; z++; return 'RAPORT'; }); };
                return [d(['RAPORT']), d(['STAN x', 'WYDAJ x 1', 'PRZYJMIJ x 1', 'WYDAJ x 1', 'RAPORT', 'STAN x']), d(los(40, 20)), d(los(1000, 1000000)),
                    d([...pula.map((p) => `PRZYJMIJ ${p} 1000000`), ...Array(965).fill('PRZYJMIJ cukier 1000000'), ...Array(10).fill('RAPORT')])];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                const nazwy = new Set(); let z = 0;
                for (const l of L.slice(1)) {
                    if (l === 'RAPORT') { z++; continue; }
                    let m = l.match(/^(PRZYJMIJ|WYDAJ) ([a-z]{1,12}) (\d+)$/); if (m) { if (!calk(Number(m[3]), 1, 1e6)) return 'ilość'; nazwy.add(m[2]); continue; }
                    m = l.match(/^STAN ([a-z]{1,12})$/); if (!m) return 'polecenie'; nazwy.add(m[1]);
                }
                return z <= 10 && nazwy.size <= 25 ? null : 'za dużo';
            },
            solve: (inp) => {
                const m = new Map(); const o = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, n, x] = l.split(' ');
                    if (p === 'PRZYJMIJ') m.set(n, (m.get(n) || 0) + Number(x));
                    else if (p === 'WYDAJ') { if ((m.get(n) || 0) >= Number(x)) m.set(n, m.get(n) - Number(x)); else o.push(`BRAK ${n}`); }
                    else if (p === 'STAN') o.push(m.get(n) || 0);
                    else { const t = [...m].filter(([, v]) => v > 0).sort((a, b) => (a[0] < b[0] ? -1 : 1)); o.push(t.length ? t.map(([k, v]) => `${k}: ${v}`).join('; ') : 'PUSTO'); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<pair<string, long long>> mag;
    auto znajdz = [&](const string &nazwa) {
        for (int i = 0; i < (int)mag.size(); i++)
            if (mag[i].first == nazwa) return i;
        return -1;
    };
    while (q--) {
        string p;
        cin >> p;
        if (p == "PRZYJMIJ" || p == "WYDAJ") {
            string nazwa;
            long long ile;
            cin >> nazwa >> ile;
            int i = znajdz(nazwa);
            if (p == "PRZYJMIJ") {
                if (i == -1) mag.push_back({nazwa, ile});
                else mag[i].second += ile;
            } else {
                if (i != -1 && mag[i].second >= ile) mag[i].second -= ile;
                else cout << "BRAK " << nazwa << "\n";
            }
        } else if (p == "STAN") {
            string nazwa;
            cin >> nazwa;
            int i = znajdz(nazwa);
            cout << (i == -1 ? 0 : mag[i].second) << "\n";
        } else {
            vector<pair<string, long long>> kopia = mag;
            sort(kopia.begin(), kopia.end());
            bool pierwszy = true;
            for (auto &[nazwa, ile] : kopia) {
                if (ile <= 0) continue;
                if (!pierwszy) cout << "; ";
                cout << nazwa << ": " << ile;
                pierwszy = false;
            }
            if (pierwszy) cout << "PUSTO";
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        // ================================================================ KROK 8 · duże dane
        {
            id: 'iop-szablon-duze-dane', krok: 8, level: 'latwe',
            title: 'Szablon na duże dane',
            short: 'Dużo liczb na wejściu. Wklej dwie linijki przyspieszające, wczytaj wszystko i wypisz sumę, najmniejszą i największą.',
            tags: ['sync_with_stdio(false)', 'cin.tie(nullptr)', 'przetwarzanie w locie'],
            statement: ['To zadanie to trening szablonu na duże dane. Na olimpiadzie takich liczb byłoby kilka milionów; tutaj jest ich mniej, bo sprawdzarka przesyła dane przez internet — ale napisz program tak, jakby było ich milion: z dwiema linijkami przyspieszającymi, bez endl i bez zapisywania liczb, których nie trzeba pamiętać.',
                'Dostajesz n liczb. Wypisz ich sumę, najmniejszą i największą.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: suma, najmniejsza i największa liczba.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5\n3 -7 10 0 2', note: 'Suma 8, najmniejsza −7, największa 10.' }],
            hint: R`Na samym początku main: ios_base::sync_with_stdio(false); cin.tie(nullptr);. Potem zwykła pętla for z cin >> x — każdą liczbę od razu doliczasz do sumy i porównujesz z rekordami, nie potrzebujesz tablicy. Wynik zakończ "\n".`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([0]), d([-1000000]), d(losy(r, 10, -9, 9)), d(losy(r, 10000, -1000000, 1000000)), d(Array(10000).fill(1000000)), d([...losy(r, 9999, 0, 5), -1000000])];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); let s = 0, mn = Infinity, mx = -Infinity; for (const x of a) { s += x; mn = Math.min(mn, x); mx = Math.max(mx, x); } return `${s} ${mn} ${mx}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    long long suma = 0, mn = LLONG_MAX, mx = LLONG_MIN;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        suma += x;
        mn = min(mn, x);
        mx = max(mx, x);
    }
    cout << suma << " " << mn << " " << mx << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-od-konca-wiersze', krok: 8, level: 'latwe',
            title: 'Od końca, jedna pod drugą',
            short: 'Wypisz n liczb od ostatniej do pierwszej, każdą w osobnym wierszu — z "\n", nie z endl.',
            tags: ['"\\n" zamiast endl', 'vector', 'dużo wierszy wyniku'],
            statement: ['Wypisz n liczb w odwrotnej kolejności, każdą w osobnym wierszu. Wierszy wyniku jest dużo, a każdy endl to osobny „kurs” do ekranu — kończ więc wiersze znakiem "\\n".'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy — liczby od ostatniej do pierwszej.'],
            constraints: ['1 ≤ n ≤ 3000', '0 ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '4\n10 20 30 40', note: 'Ostatnia liczba idzie pierwsza.' }],
            hint: R`Wczytaj liczby do vector<int> v(n), a potem for (int i = n - 1; i >= 0; i--) cout << v[i] << "\n";. Dwie linijki przyspieszające na początku main też się przydadzą.`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([7]), d([1, 2]), d(losy(r, 20, 0, 99)), d(losy(r, 3000, 0, 1000000)), d(Array(3000).fill(1000000))]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).reverse().join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> v(n);
    for (int &x : v) cin >> x;
    for (int i = n - 1; i >= 0; i--) cout << v[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-zmiany-kierunku', krok: 8, level: 'srednie',
            title: 'Zmiany kierunku',
            short: 'Wykres temperatur rośnie i maleje. Policz, ile razy zmienił kierunek — w locie, bez zapisywania pomiarów.',
            tags: ['przetwarzanie w locie', 'poprzednia wartość', 'bez tablicy'],
            statement: ['Czujnik wysyła n pomiarów. Między dwoma kolejnymi pomiarami wykres idzie w górę (następny jest większy), w dół (następny jest mniejszy) albo płasko (są równe). Zmiana kierunku to miejsce, w którym po ruchu w górę następuje ruch w dół albo odwrotnie; odcinki płaskie po drodze nie przerywają ruchu i same nie są kierunkiem.',
                'Wypisz liczbę zmian kierunku. Spróbuj nie zapisywać pomiarów — wystarczy pamiętać poprzedni pomiar i ostatni kierunek inny niż płasko.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba zmian kierunku.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '8\n1 3 3 5 2 2 4 1', note: 'Kierunki: w górę, płasko, w górę, w dół, płasko, w górę, w dół. Bez płaskich: góra, góra, dół, góra, dół — zmiany są trzy.' }],
            hint: R`Trzymaj poprzedni pomiar i int kier — 1 (w górę), −1 (w dół) albo 0 (jeszcze żadnego). Dla nowego pomiaru wyznacz d: 1, gdy większy, −1, gdy mniejszy, 0, gdy równy. Jeśli d != 0: gdy kier != 0 i d != kier — to zmiana; potem kier = d. Na koniec poprzedni = bieżący.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const fala = (n) => { const a = [0]; for (let i = 1; i < n; i++) a.push(a[i - 1] + r.pick([-3, -1, 0, 0, 1, 2])); return a; };
                return [d([5]), d([5, 5, 5]), d([1, 2, 1, 2, 1]), d([1, 3, 3, 5, 2, 2, 4, 1]), d(losy(r, 30, 0, 3)), d(fala(10000)), d(losy(r, 10000, -1000000, 1000000)), d(Array.from({ length: 10000 }, (_, i) => (i % 2 ? 1000000 : -1000000)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); let k = 0, z = 0; for (let i = 1; i < a.length; i++) { const d = Math.sign(a[i] - a[i - 1]); if (d) { if (k && d !== k) z++; k = d; } } return String(z); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    long long poprzedni, x;
    cin >> poprzedni;
    int kier = 0, zmiany = 0;
    for (int i = 1; i < n; i++) {
        cin >> x;
        int d = (x > poprzedni) - (x < poprzedni);
        if (d != 0) {
            if (kier != 0 && d != kier) zmiany++;
            kier = d;
        }
        poprzedni = x;
    }
    cout << zmiany << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-dane-z-generatora', krok: 8, level: 'srednie',
            title: 'Dane z generatora',
            short: 'n nawet 10 milionów — za dużo, żeby przysłać. Wygeneruj liczby wzorem i policz sumę oraz maksimum w locie.',
            tags: ['xᵢ = (xᵢ₋₁ · a + b) mod m', 'bez tablicy', 'long long'],
            statement: ['Gdy danych jest za dużo, by przesłać je w pliku, zadania olimpijskie podają tylko przepis na nie — generator. Ciąg tworzymy tak: x₁ = s, a każdy następny wyraz to xᵢ = (xᵢ₋₁ · a + b) mod m.',
                'Wypisz sumę wszystkich n wyrazów ciągu, największy wyraz i numer jego pierwszego wystąpienia (licząc od 1).'],
            input_format: ['Jeden wiersz: n s a b m.'],
            output_format: ['Jeden wiersz: suma, największy wyraz i numer jego pierwszego wystąpienia.'],
            constraints: ['1 ≤ n ≤ 10⁷', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 5 100', note: 'Ciąg: 3, 26, 87, 14, 3 (np. 26 · 7 + 5 = 187, a 187 mod 100 = 87). Suma 133, największy wyraz 87 stoi na miejscu 3.' }],
            hint: R`Nie twórz tablicy na 10 milionów liczb — każdy wyraz od razu doliczasz do sumy i porównujesz z rekordem. Trzymaj bieżące x w long long: iloczyn x · a może mieć prawie 10¹⁸. Wzór: x = (x * a + b) % m — liczony od drugiego wyrazu.`,
            tests: (r) => ['1 0 0 0 1', '5 3 7 5 100', '10 999999999 999999999 999999999 1000000000', `1000 7 21 7 1000000`, losGen(r, 100000, 1000000000), `10000000 1 21 7 1000000`, losGen(r, 10000000, 1000000000), '10000000 999999999 1 0 1000000000'],
            check: (inp) => { const t = toks(inp); return t.length === 5 && dobryGen(t, 0, 1e7, 1e9) ? null : 'generator'; },
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp); let sum = 0, S = 0n, mx = -1, poz = 0;
                gen(n, s, a, b, m, (x, i) => { sum += x; if (sum > 4e15) { S += BigInt(sum); sum = 0; } if (x > mx) { mx = x; poz = i; } });
                return `${S + BigInt(sum)} ${mx} ${poz}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    long long x = s, suma = 0, mx = -1, poz = 0;
    for (long long i = 1; i <= n; i++) {
        if (i > 1) x = (x * a + b) % m;
        suma += x;
        if (x > mx) {
            mx = x;
            poz = i;
        }
    }
    cout << suma << " " << mx << " " << poz << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-suma-kontrolna', krok: 8, level: 'srednie',
            title: 'Suma kontrolna',
            short: 'Wyników jest kilka milionów — nikt nie chce ich czytać. Wypisz zamiast nich sumę kontrolną: Σ i · pᵢ mod 10⁹ + 7.',
            tags: ['za duży wynik', 'suma kontrolna', 'modulo po każdym kroku'],
            statement: ['Dla ciągu z generatora (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) chcemy znać maksimum każdego prefiksu: pᵢ = max(x₁, …, xᵢ). Takich wyników jest n — za dużo, by je wypisać, a sprawdzarka i tak porównałaby je wszystkie.',
                'Zamiast nich wypisz sumę kontrolną: (1 · p₁ + 2 · p₂ + … + n · pₙ) mod 1 000 000 007.'],
            input_format: ['Jeden wiersz: n s a b m.'],
            output_format: ['Jedna liczba — suma kontrolna.'],
            constraints: ['1 ≤ n ≤ 5 · 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 5 100', note: 'Ciąg 3, 26, 87, 14, 3 ma maksima prefiksów 3, 26, 87, 87, 87. Suma kontrolna: 1 · 3 + 2 · 26 + 3 · 87 + 4 · 87 + 5 · 87 = 1099.' }],
            hint: R`Licz pᵢ w locie — to bieżące maksimum. Od razu doliczaj i · pᵢ do sumy i bierz modulo po każdym dodaniu. Iloczyn i · pᵢ może mieć 5 · 10¹⁵, więc long long; wynik po modulo jest mniejszy od 10⁹ + 7.`,
            tests: (r) => ['1 5 0 0 7', '5 3 7 5 100', '3 0 1 1 1000000000', `1000 7 21 7 1000000`, losGen(r, 200000, 1000000000), `5000000 1 21 7 1000000`, losGen(r, 5000000, 1000000000)],
            check: (inp) => { const t = toks(inp); return t.length === 5 && dobryGen(t, 0, 5e6, 1e9) ? null : 'generator'; },
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp); const MOD = 1000000007; let p = -1, w = 0;
                gen(n, s, a, b, m, (x, i) => { if (x > p) p = x; w = (w + ((i * p) % MOD)) % MOD; });
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    const long long MOD = 1000000007;
    long long x = s, p = -1, wynik = 0;
    for (long long i = 1; i <= n; i++) {
        if (i > 1) x = (x * a + b) % m;
        p = max(p, x);
        wynik = (wynik + i * p) % MOD;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-powieksz-obrazek', krok: 8, level: 'srednie',
            title: 'Powiększ obrazek',
            short: 'Każdy znak obrazka staje się kwadratem f × f. Dużo wyniku — zbuduj wiersz w napisie i wypisz go f razy.',
            tags: ['string(f, c)', 'budowanie wiersza', '"\\n"'],
            statement: ['Mały obrazek z kropek i krzyżyków trzeba powiększyć f razy: każdy znak zamienia się w kwadrat f × f złożony z tego samego znaku. Wypisz powiększony obrazek.'],
            input_format: ['W pierwszym wierszu n, m i f.', 'n wierszy po m znaków: . albo #.'],
            output_format: ['n · f wierszy po m · f znaków.'],
            constraints: ['1 ≤ n, m ≤ 50', '1 ≤ f ≤ 10', 'Powiększony obrazek mieści się w wyniku: (n · f) · (m · f + 1) ≤ 25 000.'],
            examples: [{ input: '2 3 2\n#.#\n.#.', note: 'Każdy znak zamienia się w kwadrat 2 × 2, więc z 2 wierszy po 3 znaki robią się 4 wiersze po 6 znaków.' }],
            hint: R`Dla każdego wiersza obrazka zbuduj raz powiększony wiersz: string w; for (char c : wiersz) w += string(f, c);. Potem wypisz go f razy, za każdym razem kończąc "\n". Budowanie całego wiersza i wypisanie go naraz jest szybsze niż wypisywanie znak po znaku.`,
            tests: (r) => {
                const ob = (n, m, f, p) => `${n} ${m} ${f}\n${Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < p ? '#' : '.')).join('')).join('\n')}`;
                return ['1 1 1\n#', '1 1 10\n.', '2 3 2\n#.#\n.#.', ob(5, 7, 3, 0.4), ob(50, 50, 2, 0.5), ob(12, 12, 10, 0.3), ob(1, 50, 10, 0.5), ob(50, 1, 10, 0.5), ob(49, 50, 3, 0.2)];
            },
            check: (inp) => {
                const L = linie(inp); const [n, m, f] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 50) || !calk(m, 1, 50) || !calk(f, 1, 10) || n * f * (m * f + 1) > 25000 || L.length !== n + 1) return 'n m f';
                return L.slice(1).every((w) => w.length === m && /^[.#]+$/.test(w)) ? null : 'obrazek';
            },
            solve: (inp) => { const L = linie(inp); const f = Number(L[0].split(' ')[2]); const o = []; for (const w of L.slice(1)) { const p = [...w].map((c) => c.repeat(f)).join(''); for (let k = 0; k < f; k++) o.push(p); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, f;
    cin >> n >> m >> f;
    for (int i = 0; i < n; i++) {
        string wiersz, w;
        cin >> wiersz;
        for (char c : wiersz) w += string(f, c);
        for (int k = 0; k < f; k++) cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-pytania-o-sumy', krok: 8, level: 'srednie',
            title: 'Pytania o sumy',
            short: 'n liczb i q pytań „suma od a do b”. Sumy prefiksowe i szybkie wejście-wyjście — klasyczny format olimpijski.',
            tags: ['sumy prefiksowe', 'q pytań', 'szybkie I/O'],
            statement: ['Dostajesz n liczb i q pytań. Każde pytanie to dwie liczby a i b, a odpowiedź to suma liczb od a-tej do b-tej (licząc od 1, włącznie z obiema).',
                'Na olimpiadzie n i q byłyby rzędu miliona — wtedy liczenie każdej sumy pętlą byłoby za wolne i potrzebne są sumy prefiksowe. Tutaj dane są mniejsze, ale napisz program tak, jakby nie były.'],
            input_format: ['W pierwszym wierszu n i q.', 'W drugim wierszu n liczb całkowitych.', 'W każdym z następnych q wierszy pytanie: a b.'],
            output_format: ['q wierszy — odpowiedzi na pytania.'],
            constraints: ['1 ≤ n ≤ 10 000, 1 ≤ q ≤ 2000', '−10⁴ ≤ każda liczba ≤ 10⁴', '1 ≤ a ≤ b ≤ n'],
            examples: [{ input: '5 3\n3 -1 4 1 5\n1 3\n2 5\n4 4', note: 'Sumy: 3 − 1 + 4 = 6, −1 + 4 + 1 + 5 = 9 i samo 1.' }],
            hint: R`Policz raz tablicę p (long long) o rozmiarze n + 1: p[0] = 0, p[i] = p[i − 1] + x[i]. Odpowiedź na pytanie (a, b) to p[b] − p[a − 1] — jedno odejmowanie. Dodaj dwie linijki przyspieszające i kończ wiersze "\n".`,
            tests: (r) => {
                const d = (a, Q) => `${a.length} ${Q.length}\n${a.join(' ')}\n${Q.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const pyt = (n, q) => Array.from({ length: q }, () => { const x = r.int(1, n), y = r.int(1, n); return [Math.min(x, y), Math.max(x, y)]; });
                return [d([7], [[1, 1]]), d([3, -1, 4, 1, 5], [[1, 5], [5, 5], [1, 1], [2, 4]]), d(losy(r, 50, -9, 9), pyt(50, 30)), d(losy(r, 10000, -10000, 10000), pyt(10000, 2000)),
                    d(Array(10000).fill(10000), Array.from({ length: 2000 }, () => [1, 10000])), d(Array(10000).fill(-10000), pyt(10000, 2000))];
            },
            check: (inp) => {
                const t = nums(inp); const [n, q] = t; if (!calk(n, 1, 10000) || !calk(q, 1, 2000) || t.length !== 2 + n + 2 * q) return 'n q';
                if (!t.slice(2, 2 + n).every((x) => calk(x, -1e4, 1e4))) return 'zakres';
                for (let i = 0; i < q; i++) { const a = t[2 + n + 2 * i], b = t[3 + n + 2 * i]; if (!(calk(a, 1, n) && calk(b, a, n))) return 'pytanie'; }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const [n, q] = t; const p = [0]; for (let i = 0; i < n; i++) p.push(p[i] + t[2 + i]);
                const o = []; for (let i = 0; i < q; i++) { const a = t[2 + n + 2 * i], b = t[3 + n + 2 * i]; o.push(p[b] - p[a - 1]); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> p(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        p[i] = p[i - 1] + x;
    }
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << p[b] - p[a - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-generator-i-pytania', krok: 8, level: 'trudne',
            title: 'Generator i pytania',
            short: 'Pięć milionów liczb z generatora i dwa tysiące pytań o sumy długich fragmentów. Pętla na każde pytanie nie zdąży — sumy prefiksowe tak.',
            tags: ['generator', 'sumy prefiksowe w long long', 'złożoność'],
            statement: ['Ciąg n liczb tworzy generator: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Potem przychodzi q pytań; każde to dwie liczby l i r, a odpowiedź to suma xₗ + xₗ₊₁ + … + xᵣ.',
                'Pytań jest „tylko” 2000, ale fragmenty są długie — nawet kilka milionów wyrazów. Liczenie każdej sumy pętlą to miliardy dodawań. Policz raz sumy prefiksowe całego ciągu.'],
            input_format: ['W pierwszym wierszu: n s a b m.', 'W drugim wierszu q.', 'W następnych q wierszach pytania: l r.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n ≤ 5 · 10⁶', '1 ≤ m ≤ 10⁵', '0 ≤ s, a, b < m', '1 ≤ q ≤ 2000', '1 ≤ l ≤ r ≤ n'],
            examples: [{ input: '5 3 7 5 100\n3\n1 5\n2 3\n4 4', note: 'Ciąg to 3, 26, 87, 14, 3. Sumy: 133, 26 + 87 = 113 i 14.' }],
            hint: R`Wygeneruj ciąg od razu do tablicy sum prefiksowych: vector<long long> p(n + 1), p[0] = 0, p[i] = p[i − 1] + xᵢ (x trzymaj w long long i licz x = (x * a + b) % m). Odpowiedź na (l, r) to p[r] − p[l − 1]. Tablica ma 5 milionów long longów, czyli około 40 MB — mieści się w limicie pamięci.`,
            time_limit: '1 s',
            tests: (r) => {
                const d = (g, Q) => `${g}\n${Q.length}\n${Q.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const pyt = (n, q, dlugie) => Array.from({ length: q }, () => { if (dlugie) { const l = r.int(1, Math.max(1, Math.floor(n / 10))); return [l, r.int(Math.max(l, n - Math.floor(n / 10)), n)]; } const x = r.int(1, n), y = r.int(1, n); return [Math.min(x, y), Math.max(x, y)]; });
                return [d('1 0 0 0 1', [[1, 1]]), d('5 3 7 5 100', [[1, 5], [2, 3], [4, 4], [5, 5]]), d(losGen(r, 1000, 100000), pyt(1000, 50, false)),
                    d(losGen(r, 5000000, 100000), pyt(5000000, 2000, true)), d('5000000 99999 1 99998 100000', pyt(5000000, 2000, true)), d(losGen(r, 3000000, 100000), pyt(3000000, 2000, false))];
            },
            check: (inp) => {
                const t = nums(inp); if (!dobryGen(t.map(String), 0, 5e6, 1e5)) return 'generator';
                const n = t[0], q = t[5]; if (!calk(q, 1, 2000) || t.length !== 6 + 2 * q) return 'q';
                for (let i = 0; i < q; i++) { const l = t[6 + 2 * i], rr = t[7 + 2 * i]; if (!(calk(l, 1, n) && calk(rr, l, n))) return 'pytanie'; }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const [n, s, a, b, m] = t; const p = new Float64Array(n + 1);
                gen(n, s, a, b, m, (x, i) => { p[i] = p[i - 1] + x; });
                const q = t[5]; const o = []; for (let i = 0; i < q; i++) o.push(p[t[7 + 2 * i]] - p[t[6 + 2 * i] - 1]);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    vector<long long> p(n + 1, 0);
    long long x = s;
    for (long long i = 1; i <= n; i++) {
        if (i > 1) x = (x * a + b) % m;
        p[i] = p[i - 1] + x;
    }
    int q;
    cin >> q;
    while (q--) {
        long long l, r;
        cin >> l >> r;
        cout << p[r] - p[l - 1] << "\n";
    }
    return 0;
}`,
        },
    ];
};
