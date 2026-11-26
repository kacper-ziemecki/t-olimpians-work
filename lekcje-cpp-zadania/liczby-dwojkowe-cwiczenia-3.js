// Liczby dwójkowe — ćwiczenia w trakcie lekcji, części 7–8: pojedyncze bity (odczyt bitu k, zapalanie, gaszenie
// i przełączanie, x & −x, najwyższy bit, liczenie jedynek, maski jako zestawy flag) oraz maski i podzbiory (wszystkie
// podzbiory pętlą do 1 << n, sumy podzbiorów, działania na zbiorach, kod Graya, podzbiory k-elementowe, plecak, podział).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./liczby-dwojkowe-pomoc');
    const { calk, jedynki, calkB, PRODUKTY } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const B = (x) => BigInt(x);
    const MAX18 = 10n ** 18n;
    const lista = (a) => `${a.length}\n${a.join('\n')}`;
    const zakresB = (t, lo, hi) => t.every((x) => calkB(x, lo, hi));
    const DNI = ['pn', 'wt', 'sr', 'cz', 'pt', 'sb', 'nd'];
    const rozne = (r, ile, lo, hi) => r.shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, ile);
    const jedynkiN = (x) => { let c = 0; while (x > 0) { c += x & 1; x >>>= 1; } return c; };

    return [
        // ================================================================ KROK 7 · pojedyncze bity
        {
            id: 'ld-ktory-bit', krok: 7, level: 'latwe',
            title: 'Który bit jest zapalony',
            short: 'Bit numer k liczby x to (x >> k) & 1: przesuń go na sam koniec i zostaw tylko ostatnią cyfrę.',
            tags: ['(x >> k) & 1', 'numer od prawej, od 0', 'long long'],
            statement: ['Bity liczby numerujemy od prawej strony, od zera: bit 0 ma wagę 1, bit 1 — wagę 2, bit k — wagę 2ᵏ.',
                'Wczytaj liczbę x i odpowiedz na q pytań: jaki jest bit numer k (0 albo 1)? Przesunięcie x >> k przesuwa bit numer k na sam koniec, a & 1 zostawia tylko ostatni bit.'],
            input_format: ['W pierwszym wierszu liczby x i q.', 'W drugim wierszu q liczb k — numery bitów.'],
            output_format: ['q wierszy: 0 albo 1 — bit numer k liczby x.'],
            constraints: ['0 ≤ x ≤ 10¹⁸', '1 ≤ q ≤ 1000', '0 ≤ k ≤ 62'],
            examples: [{ input: '13 5\n0 1 2 3 4', note: '13 = 1101. Bit 0 (waga 1) — 1, bit 1 (waga 2) — 0, bit 2 (waga 4) — 1, bit 3 (waga 8) — 1, bit 4 — już 0.' }],
            hint: R`long long x; cin >> x; i dla każdego k: cout << ((x >> k) & 1) << "\n";. Nawiasy są potrzebne. Gdyby x było int-em, przesunięcie o 32 i więcej nie miałoby sensu.`,
            tests: (r) => [`13 5\n0 1 2 3 4`, `0 3\n0 30 62`, `1000000000000000000 63\n${Array.from({ length: 63 }, (_, i) => i).join(' ')}`, `${(1n << 62n) - 1n} 10\n0 1 2 31 32 33 59 60 61 62`, `${r.big(0n, MAX18)} 1000\n${r.arr(1000, 0, 62).join(' ')}`, `${1n << 40n} 5\n39 40 41 0 62`],
            check: (inp) => { const t = toks(inp); const q = Number(t[1]); return calkB(t[0], 0n, (1n << 62n) - 1n) && calk(q, 1, 1000) && t.length === q + 2 && t.slice(2).every((k) => calk(Number(k), 0, 62)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp); const x = B(t[0]); return t.slice(2).map((k) => String((x >> B(k)) & 1n)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x;
    int q;
    cin >> x >> q;
    for (int i = 0; i < q; i++) {
        int k;
        cin >> k;
        cout << ((x >> k) & 1) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-zapal-zgas-przelacz', krok: 7, level: 'latwe',
            title: 'Zapal, zgaś, przełącz',
            short: 'Zapal: x |= 1 << k. Zgaś: x &= ~(1 << k). Przełącz: x ^= 1 << k. Po każdym poleceniu wypisz liczbę.',
            tags: ['| zapala', '& ~ gasi', '^ przełącza'],
            statement: ['Rząd 30 żarówek zapisano jedną liczbą x: bit numer k to żarówka numer k. Wykonaj po kolei q poleceń i po każdym wypisz nową wartość x.',
                'zapal k — ustaw bit k na 1 (x | (1 << k)); zgas k — ustaw bit k na 0 (x & ~(1 << k)); przelacz k — zamień bit k na przeciwny (x ^ (1 << k)). Zapalenie zapalonej żarówki i zgaszenie zgaszonej niczego nie zmienia.'],
            input_format: ['W pierwszym wierszu liczby x i q.', 'W każdym z kolejnych q wierszy polecenie: zapal k, zgas k albo przelacz k.'],
            output_format: ['q wierszy — wartość x po każdym poleceniu.'],
            constraints: ['0 ≤ x < 2³⁰', '1 ≤ q ≤ 1000', '0 ≤ k ≤ 29'],
            examples: [{ input: '13 4\nzapal 1\nzgas 3\nprzelacz 0\nzapal 2', note: '13 = 1101. Zapalenie bitu 1: 1111 = 15. Zgaszenie bitu 3: 0111 = 7. Przełączenie bitu 0: 0110 = 6. Bit 2 już świeci, więc zostaje 6.' }],
            hint: R`string p; int k; cin >> p >> k; if (p == "zapal") x |= 1 << k; else if (p == "zgas") x &= ~(1 << k); else x ^= 1 << k;. Tylda ~ odwraca wszystkie bity maski — zostaje jedno zero dokładnie na pozycji k.`,
            tests: (r) => {
                const t = ['13 4\nzapal 1\nzgas 3\nprzelacz 0\nzapal 2', '0 3\nzgas 5\nprzelacz 29\nzapal 0', `${2 ** 30 - 1} 2\nzgas 29\nprzelacz 29`];
                for (let i = 0; i < 4; i++) t.push(`${r.int(0, 2 ** 30 - 1)} 1000\n${Array.from({ length: 1000 }, () => `${r.pick(['zapal', 'zgas', 'przelacz'])} ${r.int(0, i % 2 ? 29 : 4)}`).join('\n')}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const [x, q] = l[0].split(' ').map(Number); return calk(x, 0, 2 ** 30 - 1) && calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => /^(zapal|zgas|przelacz) ([0-9]|[12][0-9])$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); let x = Number(l[0].split(' ')[0]); return l.slice(1).map((w) => { const [p, ks] = w.split(' '); const m = 1 << Number(ks); if (p === 'zapal') x |= m; else if (p === 'zgas') x &= ~m; else x ^= m; return String(x); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int x, q;
    cin >> x >> q;
    for (int i = 0; i < q; i++) {
        string p;
        int k;
        cin >> p >> k;
        if (p == "zapal") x |= 1 << k;
        else if (p == "zgas") x &= ~(1 << k);
        else x ^= 1 << k;
        cout << x << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-wspolne-dni', krok: 7, level: 'latwe',
            title: 'Wspólny wolny dzień',
            short: 'Wolne dni każdego przyjaciela to maska 7 bitów. AND wszystkich masek zostawia dni, w które wolni są wszyscy.',
            tags: ['maska dni', '& wszystkich', 'odczyt bitów'],
            statement: ['Przyjaciele chcą umówić się na wycieczkę. Każdy podał dni tygodnia, w które ma wolne: pn, wt, sr, cz, pt, sb, nd.',
                'Zapisz wolne dni każdej osoby jako maskę 7 bitów: poniedziałek to bit 0, wtorek — bit 1, …, niedziela — bit 6. Dzień pasuje wszystkim, jeśli jego bit jest zapalony w masce każdej osoby — czyli w AND wszystkich masek. Wypisz takie dni w kolejności od poniedziałku albo brak, jeśli nie ma żadnego.'],
            input_format: ['W pierwszym wierszu liczba osób n.', 'W każdym z kolejnych n wierszy liczba m, a po niej m różnych skrótów dni: pn, wt, sr, cz, pt, sb, nd (w dowolnej kolejności).'],
            output_format: ['Jeden wiersz: skróty wspólnych dni od poniedziałku, oddzielone spacjami, albo brak.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ m ≤ 7'],
            examples: [{ input: '3\n3 pn sr pt\n4 sr pt sb nd\n2 pt sr', note: 'Maski: pn, sr, pt = 0010101; sr, pt, sb, nd = 1110100; pt, sr = 0010100. AND wszystkich: 0010100, czyli środa i piątek.' },
                { input: '2\n1 sb\n1 nd', note: 'Jedna osoba może tylko w sobotę, druga tylko w niedzielę — nie ma wspólnego dnia.' }],
            hint: R`int wspolne = 127; (siedem jedynek), a dla każdej osoby buduj maskę: string d; cin >> d; for (int k = 0; k < 7; k++) if (d == dni[k]) maska |= 1 << k;. Potem wspolne &= maska;. Na końcu wypisz dni k, dla których (wspolne >> k) & 1.`,
            tests: (r) => {
                const osoba = (p) => { const d = DNI.filter(() => r() < p); return `${d.length}${d.length ? ' ' + r.shuffle(d).join(' ') : ''}`; };
                const t = ['1\n0', '1\n7 nd sb pt cz sr wt pn', '2\n1 sb\n1 nd', '3\n3 pn sr pt\n4 sr pt sb nd\n2 pt sr'];
                t.push(`1000\n${Array.from({ length: 1000 }, () => osoba(0.995)).join('\n')}`);
                t.push(`20\n${Array.from({ length: 20 }, () => osoba(0.9)).join('\n')}`);
                t.push(`5\n${Array.from({ length: 5 }, () => osoba(0.6)).join('\n')}`);
                t.push(`50\n${Array.from({ length: 50 }, () => `6 ${r.shuffle(DNI.filter((x) => x !== 'wt')).join(' ')}`).join('\n')}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const n = Number(l[0]); return calk(n, 1, 1000) && l.length === n + 1 && l.slice(1).every((w) => { const p = w.split(' '); const m = Number(p[0]); return calk(m, 0, 7) && p.length === m + 1 && p.slice(1).every((d) => DNI.includes(d)) && new Set(p.slice(1)).size === m; }) ? null : 'dane'; },
            solve: (inp) => { let w = 127; for (const l of L(inp).slice(1)) { let m = 0; for (const d of l.split(' ').slice(1)) m |= 1 << DNI.indexOf(d); w &= m; } const o = DNI.filter((_, k) => (w >> k) & 1); return o.length ? o.join(' ') : 'brak'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string dni[7] = {"pn", "wt", "sr", "cz", "pt", "sb", "nd"};
    int n;
    cin >> n;
    int wspolne = 127;
    for (int i = 0; i < n; i++) {
        int m;
        cin >> m;
        int maska = 0;
        for (int j = 0; j < m; j++) {
            string d;
            cin >> d;
            for (int k = 0; k < 7; k++)
                if (d == dni[k]) maska |= 1 << k;
        }
        wspolne &= maska;
    }
    bool jest = false;
    for (int k = 0; k < 7; k++) {
        if ((wspolne >> k) & 1) {
            if (jest) cout << " ";
            cout << dni[k];
            jest = true;
        }
    }
    if (!jest) cout << "brak";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-najnizszy-bit', krok: 7, level: 'latwe',
            title: 'Najniższa zapalona żarówka',
            short: 'x & −x zostawia tylko najniższą jedynkę x. Wypisz jej wagę i numer — 12 = 1100 daje 4 i 2.',
            tags: ['x & -x', 'kod U2', '__builtin_ctzll'],
            statement: ['Dla każdej liczby x wypisz wagę jej najniższej zapalonej żarówki (najmłodszej jedynki w zapisie dwójkowym) oraz numer tej żarówki.',
                'Sztuczka: x & −x daje liczbę, w której została tylko najmłodsza jedynka x. Dlaczego? W kodzie U2 −x to ~x + 1 — wszystkie bity odwrócone, a potem plus jeden, który „przechodzi” przez odwrócone zera z końca i zatrzymuje się dokładnie na pozycji najmłodszej jedynki. Numer tej jedynki to liczba zer na końcu zapisu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba x.'],
            output_format: ['q wierszy: waga najniższej jedynki i jej numer, oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4\n12\n13\n8\n40', note: '12 = 1100: najniższa jedynka ma wagę 4 i numer 2. 13 = 1101: waga 1, numer 0. 8 = 1000: waga 8, numer 3. 40 = 101000: waga 8, numer 3.' }],
            hint: R`long long v = x & -x;. Numer: int nr = 0; while ((v >> nr) != 1) nr++; albo gotowe __builtin_ctzll(x) (count trailing zeros — liczba zer na końcu; ll, bo long long).`,
            tests: (r) => [lista(['12', '13', '8', '40', '1', '2', '3', '1000000000000000000', String(1n << 59n), String((1n << 59n) + (1n << 30n))]), lista(Array.from({ length: 1000 }, () => String(r.big(1n, MAX18)))), lista(Array.from({ length: 60 }, (_, k) => { const v = (1n << B(k)) * B(2 * r.int(0, 100) + 1); return String(v > MAX18 ? 1n << B(k) : v); }))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 1n, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { const x = B(s); const v = x & -x; return `${v} ${v.toString(2).length - 1}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        cin >> x;
        long long v = x & -x;
        cout << v << " " << __builtin_ctzll(x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-najwyzszy-bit', krok: 7, level: 'latwe',
            title: 'Najwyższa zapalona żarówka',
            short: 'Numer najstarszej jedynki to liczba cyfr zapisu minus 1. Wypisz go i 2 do tej potęgi — największą potęgę dwójki ≤ x.',
            tags: ['najstarszy bit', '__lg', 'największa potęga ≤ x'],
            statement: ['Dla każdej liczby x wypisz numer jej najwyższej zapalonej żarówki (najstarszej jedynki zapisu dwójkowego) oraz wagę tej żarówki — czyli największą potęgę dwójki, która nie przekracza x.',
                'Numer najstarszej jedynki to liczba cyfr zapisu dwójkowego minus jeden. Możesz go policzyć pętlą (przesuwaj x w prawo, aż zostanie 1) albo gotowymi funkcjami: __lg(x) albo 63 − __builtin_clzll(x).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba x.'],
            output_format: ['q wierszy: numer najstarszej jedynki i jej waga, oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n1\n1000\n1024', note: '13 = 1101 — najstarsza jedynka ma numer 3 i wagę 8. 1 — numer 0, waga 1. 1000 = 1111101000 — numer 9, waga 512. 1024 = 2¹⁰ to sama najstarsza jedynka.' }],
            hint: R`int p = 0; while ((x >> (p + 1)) > 0) p++; i cout << p << " " << (1LL << p);. Krócej: int p = __lg(x);. Pamiętaj o 1LL — 1 << 40 na zwykłej jedynce się przepełni.`,
            tests: (r) => { const p = []; for (let k = 0; k < 60; k++) { p.push(String(1n << B(k))); p.push(String((1n << B(k + 1)) - 1n)); } return [lista(['13', '1', '1000', '1024', '1000000000000000000']), lista(p.filter((x) => B(x) <= MAX18)), lista(Array.from({ length: 1000 }, () => String(r.big(1n, MAX18))))]; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 1n, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { const p = B(s).toString(2).length - 1; return `${p} ${1n << B(p)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        cin >> x;
        int p = __lg(x);
        cout << p << " " << (1LL << p) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-sortuj-po-jedynkach', krok: 7, level: 'srednie',
            title: 'Sortowanie po liczbie jedynek',
            short: 'Posortuj liczby rosnąco według liczby jedynek w zapisie dwójkowym, a przy remisie — według wartości. Komparator z __builtin_popcount.',
            tags: ['__builtin_popcount', 'komparator', 'remisy'],
            statement: ['Posortuj n liczb według liczby jedynek w ich zapisie dwójkowym — od najmniejszej liczby jedynek do największej. Jeśli dwie liczby mają tyle samo jedynek, wcześniej ma stać mniejsza liczba.',
                'Liczbę jedynek możesz policzyć własną funkcją albo gotową __builtin_popcount(x) (dla int; dla long long jest __builtin_popcountll). Do sortowania użyj sort z komparatorem, tak jak w lekcji Sortowanie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: liczby po posortowaniu, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2500', 'Liczby są z przedziału od 0 do 10⁹.'],
            examples: [{ input: '6\n7 8 3 5 0 16', note: 'Jedynek: 0 → 0, 8 i 16 → po 1, 3 i 5 → po 2, 7 → 3. Przy remisach mniejsza liczba idzie pierwsza: 0 8 16 3 5 7.' }],
            hint: R`sort(v.begin(), v.end(), [](int a, int b) { int pa = __builtin_popcount(a), pb = __builtin_popcount(b); if (pa != pb) return pa < pb; return a < b; });.`,
            tests: (r) => [[0], [5, 5, 5], [7, 8, 3, 5, 0, 16], r.arr(2500, 0, 1e9), r.arr(1000, 0, 63), Array.from({ length: 30 }, (_, i) => 2 ** i - 1).concat([1e9]), r.arr(100, 0, 1000)].map((a) => `${a.length}\n${a.join(' ')}`),
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2500) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).sort((a, b) => jedynkiN(a) - jedynkiN(b) || a - b).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int &x : v) cin >> x;
    sort(v.begin(), v.end(), [](int a, int b) {
        int pa = __builtin_popcount(a), pb = __builtin_popcount(b);
        if (pa != pb) return pa < pb;
        return a < b;
    });
    for (int i = 0; i < n; i++) cout << v[i] << (i + 1 < n ? " " : "\n");
    return 0;
}`,
        },
        {
            id: 'ld-zamien-bity', krok: 7, level: 'srednie',
            title: 'Zamiana dwóch bitów',
            short: 'Jeśli bity i oraz j są równe, nic się nie zmienia. Jeśli różne — przełącz oba naraz: x ^ ((1LL << i) | (1LL << j)).',
            tags: ['odczyt dwóch bitów', 'przełączanie', '1LL << i'],
            statement: ['Dla każdej trójki x, i, j wypisz liczbę, która powstanie z x po zamianie miejscami bitów numer i oraz j.',
                'Zauważ: jeśli te bity są równe (oba 0 albo oba 1), zamiana niczego nie zmienia. Jeśli są różne, zamiana to po prostu przełączenie obu — jedynka gaśnie, a zero się zapala.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczby x, i oraz j.'],
            output_format: ['q wierszy — liczba po zamianie bitów.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ x ≤ 10¹⁸', '0 ≤ i, j ≤ 59'],
            examples: [{ input: '3\n12 0 3\n5 0 2\n1 0 59', note: '12 = 1100: bit 0 to 0, bit 3 to 1 — różne, więc po zamianie 0101 = 5. 5 = 101: bity 0 i 2 to dwie jedynki — bez zmian. 1 po zamianie bitu 0 z bitem 59 to 2⁵⁹.' }],
            hint: R`long long a = (x >> i) & 1, b = (x >> j) & 1; if (a != b) x ^= (1LL << i) | (1LL << j);. 1LL, bo i oraz j sięgają 59.`,
            tests: (r) => [lista(['12 0 3', '5 0 2', '1 0 59', '0 5 7', '7 1 1', `${(1n << 59n)} 59 0`]), lista(Array.from({ length: 1000 }, () => `${r.big(0n, MAX18)} ${r.int(0, 59)} ${r.int(0, 59)}`)), lista(Array.from({ length: 200 }, () => `${r.int(0, 255)} ${r.int(0, 7)} ${r.int(0, 7)}`))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 1000) || t.length !== 3 * q + 1) return 'dane'; for (let k = 0; k < q; k++) if (!calkB(t[1 + 3 * k], 0n, MAX18) || !calk(Number(t[2 + 3 * k]), 0, 59) || !calk(Number(t[3 + 3 * k]), 0, 59)) return 'x i j'; return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let k = 0; k < Number(t[0]); k++) { let x = B(t[1 + 3 * k]); const i = B(t[2 + 3 * k]), j = B(t[3 + 3 * k]); if (((x >> i) & 1n) !== ((x >> j) & 1n)) x ^= (1n << i) | (1n << j); o.push(String(x)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        int i, j;
        cin >> x >> i >> j;
        long long a = (x >> i) & 1, b = (x >> j) & 1;
        if (a != b) x ^= (1LL << i) | (1LL << j);
        cout << x << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-wspolne-zainteresowania', krok: 7, level: 'srednie',
            title: 'Wspólne zainteresowania',
            short: 'Zainteresowania ucznia to maska 60 bitów. Para ma coś wspólnego, gdy AND ich masek nie jest zerem. Policz takie pary.',
            tags: ['maska w long long', '(a & b) != 0', 'wszystkie pary'],
            statement: ['W klasie jest n uczniów. Każdy podał swoje zainteresowania jako numery od 0 do 59. Ile jest par uczniów, którzy mają przynajmniej jedno wspólne zainteresowanie?',
                'Zapisz zainteresowania każdego ucznia jako maskę w long long: zainteresowanie numer z to bit z, czyli 1LL << z. Dwóch uczniów ma coś wspólnego, gdy ich maski mają wspólną jedynkę: (a & b) != 0. Sprawdzenie pary to jedno działanie, więc wszystkie pary sprawdzisz dwiema pętlami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy liczba m, a po niej m różnych numerów zainteresowań.'],
            output_format: ['Jedna liczba — liczba par uczniów ze wspólnym zainteresowaniem.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ m ≤ 10', 'Numery zainteresowań są z przedziału od 0 do 59.'],
            examples: [{ input: '4\n2 1 5\n1 7\n3 5 6 7\n0', note: 'Uczeń 1 i 3 dzielą zainteresowanie 5, a uczeń 2 i 3 — zainteresowanie 7. Uczeń 4 nie podał żadnego. Pary 1–2, 1–4, 2–4 i 3–4 nie mają nic wspólnego. Razem 2 pary.' }],
            hint: R`vector<long long> maska(n); dla każdego numeru z: maska[i] |= 1LL << z;. Potem for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) if ((maska[i] & maska[j]) != 0) ile++;. 1LL jest konieczne — numery sięgają 59.`,
            tests: (r) => {
                const uczen = (maxM, hi) => { const m = r.int(0, maxM); return `${m}${m ? ' ' + rozne(r, m, 0, hi).join(' ') : ''}`; };
                return ['2\n0\n0', '2\n1 59\n1 59', '2\n1 0\n1 59', '4\n2 1 5\n1 7\n3 5 6 7\n0',
                    `2000\n${Array.from({ length: 2000 }, () => uczen(10, 59)).join('\n')}`, `2000\n${Array.from({ length: 2000 }, () => uczen(2, 59)).join('\n')}`,
                    `300\n${Array.from({ length: 300 }, () => uczen(3, 9)).join('\n')}`, `50\n${Array.from({ length: 50 }, () => uczen(1, 59)).join('\n')}`];
            },
            check: (inp) => { const l = L(inp); const n = Number(l[0]); return calk(n, 2, 2000) && l.length === n + 1 && l.slice(1).every((w) => { const p = w.split(' ').map(Number); return calk(p[0], 0, 10) && p.length === p[0] + 1 && p.slice(1).every((z) => calk(z, 0, 59)) && new Set(p.slice(1)).size === p[0]; }) ? null : 'dane'; },
            solve: (inp) => { const m = L(inp).slice(1).map((w) => w.split(' ').slice(1).reduce((a, z) => a | (1n << B(z)), 0n)); let c = 0; for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) if ((m[i] & m[j]) !== 0n) c++; return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> maska(n, 0);
    for (int i = 0; i < n; i++) {
        int m;
        cin >> m;
        for (int j = 0; j < m; j++) {
            int z;
            cin >> z;
            maska[i] |= 1LL << z;
        }
    }
    long long ile = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if ((maska[i] & maska[j]) != 0) ile++;
    cout << ile << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · maski i podzbiory
        {
            id: 'ld-wszystkie-podzbiory', krok: 8, level: 'latwe',
            title: 'Wszystkie podzbiory',
            short: 'Każda maska od 0 do 2ⁿ − 1 to jeden wybór: bit i zapalony = przedmiot i wybrany. Wypisz wszystkie wybory po kolei.',
            tags: ['for m < (1 << n)', '(m >> i) & 1', 'podzbiór = maska'],
            statement: ['Masz n przedmiotów, ponumerowanych od 0. Każdy wybór kilku z nich (podzbiór) można zapisać jako liczbę: bit i jest zapalony, gdy przedmiot i jest wybrany. Liczby od 0 do 2ⁿ − 1 to dokładnie wszystkie możliwe wybory — każdy jeden raz.',
                'Dla każdej maski m od 0 do 2ⁿ − 1 wypisz w osobnym wierszu nazwy wybranych przedmiotów (w kolejności numerów). Dla maski 0 (nic nie wybrano) wypisz pusty.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n nazw przedmiotów (słowa z małych liter).'],
            output_format: ['2ⁿ wierszy — wybrane przedmioty dla kolejnych masek od 0 do 2ⁿ − 1, oddzielone spacjami, albo pusty.'],
            constraints: ['1 ≤ n ≤ 8'],
            examples: [{ input: '3\njablko gruszka sliwka', note: 'Maska 0 = 000 — nic. 1 = 001 — tylko przedmiot 0 (jabłko). 2 = 010 — gruszka. 3 = 011 — jabłko i gruszka. 4 = 100 — śliwka, i tak dalej aż do 7 = 111 — wszystkie trzy.' }],
            hint: R`for (int m = 0; m < (1 << n); m++) { bool cos = false; for (int i = 0; i < n; i++) if ((m >> i) & 1) { if (cos) cout << " "; cout << nazwa[i]; cos = true; } if (!cos) cout << "pusty"; cout << "\n"; }.`,
            tests: (r) => [1, 2, 3, 4, 5, 8, 8, 6].map((n) => `${n}\n${r.shuffle(PRODUKTY).slice(0, n).join(' ')}`),
            check: (inp) => { const l = L(inp); const n = Number(l[0]); const w = (l[1] || '').split(' '); return calk(n, 1, 8) && l.length === 2 && w.length === n && w.every((x) => /^[a-z]+$/.test(x)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0]); const w = l[1].split(' '); const o = []; for (let m = 0; m < 1 << n; m++) { const s = w.filter((_, i) => (m >> i) & 1); o.push(s.length ? s.join(' ') : 'pusty'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> nazwa(n);
    for (auto &s : nazwa) cin >> s;
    for (int m = 0; m < (1 << n); m++) {
        bool cos = false;
        for (int i = 0; i < n; i++) {
            if ((m >> i) & 1) {
                if (cos) cout << " ";
                cout << nazwa[i];
                cos = true;
            }
        }
        if (!cos) cout << "pusty";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-podzbiory-o-sumie', krok: 8, level: 'latwe',
            title: 'Podzbiory o danej sumie',
            short: 'Przejdź po wszystkich maskach i dla każdej zsumuj wybrane liczby. Ile wyborów daje dokładnie S? Dla n = 20 to milion masek — zdąży.',
            tags: ['wszystkie maski', 'suma podzbioru', '2ⁿ · n kroków'],
            statement: ['Masz n monet o podanych wartościach. Na ile sposobów można wybrać kilka z nich (co najmniej jedną), żeby razem dały dokładnie S? Monety są rozróżnialne — dwie monety o tej samej wartości to dwa różne wybory.',
                'Przejrzyj wszystkie maski od 1 do 2ⁿ − 1 i dla każdej zsumuj wybrane monety. Dla n = 20 to około miliona masek, a każda wymaga 20 sprawdzeń — razem 20 milionów kroków, czyli ułamek sekundy.'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n wartości monet.'],
            output_format: ['Jedna liczba — liczba wyborów o sumie S.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ S ≤ 2 · 10⁷', 'Wartości monet są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '4 5\n1 2 3 4', note: 'Sumę 5 dają wybory {1, 4} i {2, 3}. To 2 sposoby.' },
                { input: '3 2\n1 1 2', note: 'Dwie jedynki razem i sama dwójka — 2 sposoby.' }],
            hint: R`for (int m = 1; m < (1 << n); m++) { long long s = 0; for (int i = 0; i < n; i++) if ((m >> i) & 1) s += a[i]; if (s == S) ile++; }.`,
            tests: (r) => { const t = ['1 5\n5', '1 5\n4', '4 5\n1 2 3 4', '3 2\n1 1 2', `20 10\n${Array(20).fill(1).join(' ')}`]; for (const [n, hi] of [[20, 10], [20, 1000000], [15, 100], [20, 50]]) { const a = r.arr(n, 1, hi); const S = a.filter(() => r() < 0.5).reduce((x, y) => x + y, 0) || a[0]; t.push(`${n} ${S}\n${a.join(' ')}`); } return t; },
            check: (inp) => { const t = nums(inp); const [n, S] = t; return calk(n, 1, 20) && calk(S, 1, 2e7) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, S] = t; const a = t.slice(2); const sumy = new Float64Array(1 << n); let c = 0; for (let m = 1; m < 1 << n; m++) { const low = m & -m; const i = 31 - Math.clz32(low); sumy[m] = sumy[m ^ low] + a[i]; if (sumy[m] === S) c++; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long ile = 0;
    for (int m = 1; m < (1 << n); m++) {
        long long s = 0;
        for (int i = 0; i < n; i++)
            if ((m >> i) & 1) s += a[i];
        if (s == S) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-zbiory-jako-maski', krok: 8, level: 'latwe',
            title: 'Zbiory jako maski',
            short: 'Zbiór liczb od 0 do 59 to jedna liczba long long. Suma zbiorów to |, część wspólna to &, a różnica A \\ B to A & ~B.',
            tags: ['| = suma zbiorów', '& = część wspólna', 'A & ~B = różnica'],
            statement: ['Zbiór liczb od 0 do 59 można trzymać w jednej zmiennej long long: liczba z należy do zbioru, gdy bit z jest zapalony. Działania na takich zbiorach to pojedyncze operatory: suma zbiorów A ∪ B to A | B, część wspólna A ∩ B to A & B, a różnica A \\ B (elementy A, których nie ma w B) to A & ~B.',
                'Wczytaj zbiory A i B i wypisz A ∪ B, A ∩ B oraz A \\ B — każdy w osobnym wierszu, elementy rosnąco, albo pusty, gdy zbiór nie ma elementów.'],
            input_format: ['W pierwszym wierszu liczba elementów zbioru A, a po niej te elementy (różne, w dowolnej kolejności).', 'W drugim wierszu tak samo zbiór B.'],
            output_format: ['Trzy wiersze: A ∪ B, A ∩ B i A \\ B — elementy rosnąco, oddzielone spacjami, albo pusty.'],
            constraints: ['Każdy zbiór ma od 0 do 60 elementów.', 'Elementy są z przedziału od 0 do 59.'],
            examples: [{ input: '3 5 1 9\n3 9 2 1', note: 'A = {1, 5, 9}, B = {1, 2, 9}. Suma: {1, 2, 5, 9}. Część wspólna: {1, 9}. Różnica A \\ B: tylko 5.' }],
            hint: R`long long A = 0; dla każdego elementu x: A |= 1LL << x;. Wypisywanie zbioru Z: for (int x = 0; x < 60; x++) if ((Z >> x) & 1) …. Najlepiej napisz funkcję void wypisz(long long Z).`,
            tests: (r) => { const zb = (ile) => { const z = rozne(r, ile, 0, 59); return `${ile}${ile ? ' ' + z.join(' ') : ''}`; }; return ['0\n0', '1 0\n0', '0\n1 59', '3 5 1 9\n3 9 2 1', `${zb(60)}\n${zb(60)}`, `${zb(30)}\n${zb(30)}`, `${zb(5)}\n${zb(40)}`, `${zb(10)}\n${zb(0)}`, `2 58 59\n2 0 59`]; },
            check: (inp) => { const l = L(inp); return l.length === 2 && l.every((w) => { const p = w.split(' ').map(Number); return calk(p[0], 0, 60) && p.length === p[0] + 1 && p.slice(1).every((x) => calk(x, 0, 59)) && new Set(p.slice(1)).size === p[0]; }) ? null : 'dane'; },
            solve: (inp) => { const [a, b] = L(inp).map((w) => new Set(w.split(' ').slice(1).map(Number))); const wyp = (f) => { const o = []; for (let x = 0; x < 60; x++) if (f(x)) o.push(x); return o.length ? o.join(' ') : 'pusty'; }; return [wyp((x) => a.has(x) || b.has(x)), wyp((x) => a.has(x) && b.has(x)), wyp((x) => a.has(x) && !b.has(x))].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(long long Z) {
    bool cos = false;
    for (int x = 0; x < 60; x++) {
        if ((Z >> x) & 1) {
            if (cos) cout << " ";
            cout << x;
            cos = true;
        }
    }
    if (!cos) cout << "pusty";
    cout << "\n";
}
long long wczytaj() {
    int m;
    cin >> m;
    long long Z = 0;
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        Z |= 1LL << x;
    }
    return Z;
}
int main() {
    long long A = wczytaj();
    long long B = wczytaj();
    wypisz(A | B);
    wypisz(A & B);
    wypisz(A & ~B);
    return 0;
}`,
        },
        {
            id: 'ld-kod-graya', krok: 8, level: 'srednie',
            title: 'Kod Graya',
            short: 'W kodzie Graya sąsiednie liczby różnią się jednym bitem. Kod numer i to i ^ (i >> 1) — wypisz wszystkie na n bitach.',
            tags: ['i ^ (i >> 1)', 'zapis na n bitach', 'jeden bit różnicy'],
            statement: ['Gdy zwykły licznik przechodzi z 0111 na 1000, zmieniają się naraz cztery bity — a w urządzeniach mechanicznych nigdy nie zmieniają się idealnie jednocześnie, więc przez chwilę widać bzdury. Kod Graya ustawia liczby od 0 do 2ⁿ − 1 tak, żeby każde dwie kolejne różniły się dokładnie jednym bitem.',
                'Kod Graya numer i to po prostu i ^ (i >> 1). Wypisz kody dla i od 0 do 2ⁿ − 1, każdy na dokładnie n bitach.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['2ⁿ wierszy — kolejne kody Graya, każdy jako n cyfr 0 i 1.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '3', note: '0 → 000, 1 → 001, 2 → 2 ^ 1 = 011, 3 → 3 ^ 1 = 010, 4 → 4 ^ 2 = 110, 5 → 111, 6 → 101, 7 → 100. Każde dwa kolejne wiersze różnią się jednym bitem — nawet ostatni i pierwszy.' }],
            hint: R`for (int i = 0; i < (1 << n); i++) { int g = i ^ (i >> 1); for (int k = n - 1; k >= 0; k--) cout << ((g >> k) & 1); cout << "\n"; }.`,
            tests: () => ['1', '2', '3', '4', '5', '8', '10', '7'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 10) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; return Array.from({ length: 1 << n }, (_, i) => (i ^ (i >> 1)).toString(2).padStart(n, '0')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < (1 << n); i++) {
        int g = i ^ (i >> 1);
        for (int k = n - 1; k >= 0; k--) cout << ((g >> k) & 1);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-k-elementowe', krok: 8, level: 'srednie',
            title: 'Podzbiory k-elementowe',
            short: 'Wypisz wszystkie wybory dokładnie k liczb z 1..n. Przejdź po maskach i bierz tylko te, które mają k jedynek.',
            tags: ['__builtin_popcount(m) == k', 'kolejność masek', 'numery od 1'],
            statement: ['Wypisz wszystkie sposoby wybrania dokładnie k liczb spośród 1, 2, …, n. Każdy wybór zapisz rosnąco w osobnym wierszu.',
                'Kolejność wyborów jest ustalona przez maski: liczba j odpowiada bitowi j − 1, a wybory wypisujesz w kolejności rosnących masek, pomijając maski, które nie mają dokładnie k jedynek.'],
            input_format: ['Dwie liczby n i k.'],
            output_format: ['Wszystkie k-elementowe wybory w kolejności rosnących masek, każdy w osobnym wierszu (liczby rosnąco, oddzielone spacjami).'],
            constraints: ['1 ≤ k ≤ n ≤ 12'],
            examples: [{ input: '4 2', note: 'Maski z dwiema jedynkami po kolei: 0011 → 1 2, 0101 → 1 3, 0110 → 2 3, 1001 → 1 4, 1010 → 2 4, 1100 → 3 4.' }],
            hint: R`for (int m = 0; m < (1 << n); m++) if (__builtin_popcount(m) == k) { for (int i = 0; i < n; i++) if ((m >> i) & 1) cout << i + 1 << " "; cout << "\n"; }. Spacja na końcu wiersza nie przeszkadza sprawdzarce.`,
            tests: () => ['1 1', '3 3', '4 2', '5 1', '6 3', '12 6', '12 12', '12 1', '10 5', '11 4'],
            check: (inp) => { const t = nums(inp); return t.length === 2 && calk(t[0], 1, 12) && calk(t[1], 1, t[0]) ? null : 'dane'; },
            solve: (inp) => { const [n, k] = nums(inp); const o = []; for (let m = 0; m < 1 << n; m++) { if (jedynkiN(m) !== k) continue; const s = []; for (let i = 0; i < n; i++) if ((m >> i) & 1) s.push(i + 1); o.push(s.join(' ')); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    for (int m = 0; m < (1 << n); m++) {
        if (__builtin_popcount(m) != k) continue;
        bool pierwsza = true;
        for (int i = 0; i < n; i++) {
            if ((m >> i) & 1) {
                if (!pierwsza) cout << " ";
                cout << i + 1;
                pierwsza = false;
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-plecak-maskami', krok: 8, level: 'srednie',
            title: 'Plecak przez maski',
            short: 'Sprawdź każdy wybór przedmiotów: policz wagę i wartość, odrzuć za ciężkie i zapamiętaj najcenniejszy. Dla n ≤ 20 to milion wyborów.',
            tags: ['wszystkie maski', 'warunek wagi', 'long long'],
            statement: ['Masz plecak, który uniesie najwyżej W kilogramów, i n przedmiotów — każdy ma wagę i wartość. Wybierz przedmioty o największej łącznej wartości, których łączna waga nie przekracza W.',
                'Przedmiotów jest co najwyżej 20, więc można po prostu sprawdzić każdy wybór — każdą maskę od 0 do 2ⁿ − 1. Dla każdej policz łączną wagę i wartość, pomiń te za ciężkie, a z pozostałych zapamiętaj największą wartość.'],
            input_format: ['W pierwszym wierszu liczby n i W.', 'W każdym z kolejnych n wierszy dwie liczby: waga i wartość przedmiotu.'],
            output_format: ['Jedna liczba — największa łączna wartość (0, jeśli żaden przedmiot się nie mieści).'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ W ≤ 10⁹', 'Wagi i wartości są z przedziału od 1 do 10⁹.'],
            examples: [{ input: '4 10\n5 10\n4 40\n6 30\n3 50', note: 'Najlepiej wziąć przedmioty o wagach 4 i 3 (razem 7 kg) — wartość 40 + 50 = 90. Dorzucenie czegokolwiek przekroczy 10 kg.' }],
            hint: R`for (int m = 0; m < (1 << n); m++) { long long waga = 0, wart = 0; for (int i = 0; i < n; i++) if ((m >> i) & 1) { waga += w[i]; wart += v[i]; } if (waga <= W) best = max(best, wart); }. Sumy sięgają 2 · 10¹⁰ — long long.`,
            tests: (r) => { const t = ['1 5\n6 100', '1 5\n5 100', '4 10\n5 10\n4 40\n6 30\n3 50']; for (const [n, wmax, W] of [[20, 1e9, 1e9], [20, 100, 500], [20, 1e9, 5e8], [10, 50, 100], [20, 1e6, 3e6]]) { const it = Array.from({ length: n }, () => `${r.int(1, wmax)} ${r.int(1, 1e9)}`); t.push(`${n} ${W}\n${it.join('\n')}`); } return t; },
            check: (inp) => { const t = nums(inp); const [n, W] = t; return calk(n, 1, 20) && calk(W, 1, 1e9) && t.length === 2 * n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, W] = t; const w = [], v = []; for (let i = 0; i < n; i++) { w.push(t[2 + 2 * i]); v.push(t[3 + 2 * i]); } const sw = new Float64Array(1 << n), sv = new Float64Array(1 << n); let best = 0; for (let m = 1; m < 1 << n; m++) { const low = m & -m; const i = 31 - Math.clz32(low); sw[m] = sw[m ^ low] + w[i]; sv[m] = sv[m ^ low] + v[i]; if (sw[m] <= W && sv[m] > best) best = sv[m]; } return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long W;
    cin >> n >> W;
    vector<long long> w(n), v(n);
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];
    long long best = 0;
    for (int m = 0; m < (1 << n); m++) {
        long long waga = 0, wart = 0;
        for (int i = 0; i < n; i++) {
            if ((m >> i) & 1) {
                waga += w[i];
                wart += v[i];
            }
        }
        if (waga <= W) best = max(best, wart);
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-podzial-na-dwie', krok: 8, level: 'srednie',
            title: 'Podział na dwie drużyny',
            short: 'Maska wybiera, kto idzie do pierwszej drużyny, reszta trafia do drugiej. Szukasz maski, przy której sumy siły różnią się najmniej.',
            tags: ['maska = podział', 'suma − 2 · s', 'najmniejsza różnica'],
            statement: ['n zawodników o podanej sile trzeba podzielić na dwie drużyny (jedna może być pusta). Drużyny powinny być jak najbardziej wyrównane: różnica sum siły ma być najmniejsza.',
                'Każdy podział to maska: zapalony bit i oznacza, że zawodnik i gra w pierwszej drużynie. Jeśli s to suma siły pierwszej drużyny, a suma — wszystkich zawodników, to druga drużyna ma suma − s, a różnica wynosi |suma − 2s|. Wypisz najmniejszą możliwą różnicę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — siły zawodników.'],
            output_format: ['Jedna liczba — najmniejsza różnica sum siły drużyn.'],
            constraints: ['1 ≤ n ≤ 20', 'Siły są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '5\n3 1 4 2 2', note: 'Razem 12. Drużyny {3, 1, 2} i {4, 2} mają po 6 — różnica 0.' },
                { input: '3\n10 1 2', note: 'Najlepiej {10} kontra {1, 2}: 10 − 3 = 7.' }],
            hint: R`long long suma = …; long long best = suma; for (int m = 0; m < (1 << n); m++) { long long s = 0; for (int i = 0; i < n; i++) if ((m >> i) & 1) s += a[i]; best = min(best, llabs(suma - 2 * s)); }.`,
            tests: (r) => [[7], [5, 5], [10, 1, 2], [3, 1, 4, 2, 2], r.arr(20, 1, 1e6), r.arr(20, 1, 10), r.arr(19, 1000, 1e6), [1e6, ...Array(19).fill(1)], r.arr(12, 1, 100)].map((a) => `${a.length}\n${a.join(' ')}`),
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 20) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const n = a.length; const suma = a.reduce((x, y) => x + y, 0); const s = new Float64Array(1 << n); let best = suma; for (let m = 1; m < 1 << n; m++) { const low = m & -m; const i = 31 - Math.clz32(low); s[m] = s[m ^ low] + a[i]; best = Math.min(best, Math.abs(suma - 2 * s[m])); } return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    long long suma = 0;
    for (auto &x : a) {
        cin >> x;
        suma += x;
    }
    long long best = suma;
    for (int m = 0; m < (1 << n); m++) {
        long long s = 0;
        for (int i = 0; i < n; i++)
            if ((m >> i) & 1) s += a[i];
        best = min(best, llabs(suma - 2 * s));
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-druzyna-umiejetnosci', krok: 8, level: 'srednie',
            title: 'Drużyna ze wszystkimi umiejętnościami',
            short: 'Umiejętności kandydata to maska. Wybór kandydatów pokrywa wszystko, gdy OR ich masek ma same jedynki. Szukasz najmniejszej takiej drużyny.',
            tags: ['OR masek', '(1 << m) − 1', 'najmniej osób'],
            statement: ['Do projektu potrzeba m umiejętności, ponumerowanych od 0 do m − 1. Każdy z n kandydatów zna niektóre z nich. Wybierz jak najmniej kandydatów tak, żeby każdą potrzebną umiejętność znał przynajmniej jeden z wybranych.',
                'Umiejętności kandydata zapisz jako maskę. Umiejętności całej drużyny to OR masek jej członków, a drużyna jest dobra, gdy ten OR to (1 << m) − 1 — same jedynki na m bitach. Przejrzyj wszystkie wybory kandydatów (maski od 0 do 2ⁿ − 1) i znajdź dobry z najmniejszą liczbą osób. Jeśli żaden wybór nie jest dobry, wypisz −1.'],
            input_format: ['W pierwszym wierszu liczby m i n.', 'W każdym z kolejnych n wierszy liczba c, a po niej c różnych numerów umiejętności kandydata.'],
            output_format: ['Jedna liczba — najmniejsza liczba kandydatów albo −1.'],
            constraints: ['1 ≤ m ≤ 20', '1 ≤ n ≤ 16', '0 ≤ c ≤ m'],
            examples: [{ input: '4 3\n2 0 1\n2 2 3\n3 1 2 3', note: 'Pierwszy zna 0 i 1, drugi 2 i 3 — razem wszystkie cztery, więc wystarczą 2 osoby. Nikt sam nie zna wszystkiego.' },
                { input: '3 2\n1 0\n1 1', note: 'Umiejętności 2 nie zna nikt — wynik −1.' }],
            hint: R`int pelna = (1 << m) - 1; for (int s = 0; s < (1 << n); s++) { int razem = 0; for (int i = 0; i < n; i++) if ((s >> i) & 1) razem |= maska[i]; if (razem == pelna) best = min(best, __builtin_popcount(s)); }.`,
            tests: (r) => {
                const kand = (m, p) => { const u = []; for (let j = 0; j < m; j++) if (r() < p) u.push(j); return `${u.length}${u.length ? ' ' + r.shuffle(u).join(' ') : ''}`; };
                const t = ['1 1\n1 0', '1 1\n0', '4 3\n2 0 1\n2 2 3\n3 1 2 3', '3 2\n1 0\n1 1'];
                for (const [m, n, p] of [[20, 16, 0.15], [20, 16, 0.3], [10, 16, 0.2], [20, 16, 0.05], [5, 8, 0.4]]) t.push(`${m} ${n}\n${Array.from({ length: n }, () => kand(m, p)).join('\n')}`);
                t.push(`16 16\n${Array.from({ length: 16 }, (_, i) => `1 ${i}`).join('\n')}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const [m, n] = l[0].split(' ').map(Number); return calk(m, 1, 20) && calk(n, 1, 16) && l.length === n + 1 && l.slice(1).every((w) => { const p = w.split(' ').map(Number); return calk(p[0], 0, m) && p.length === p[0] + 1 && p.slice(1).every((x) => calk(x, 0, m - 1)) && new Set(p.slice(1)).size === p[0]; }) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const [m, n] = l[0].split(' ').map(Number); const mk = l.slice(1).map((w) => w.split(' ').slice(1).reduce((a, x) => a | (1 << Number(x)), 0)); const pelna = (1 << m) - 1; let best = -1; for (let s = 0; s < 1 << n; s++) { let raz = 0; for (let i = 0; i < n; i++) if ((s >> i) & 1) raz |= mk[i]; if (raz === pelna) { const c = jedynkiN(s); if (best < 0 || c < best) best = c; } } return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int m, n;
    cin >> m >> n;
    vector<int> maska(n, 0);
    for (int i = 0; i < n; i++) {
        int c;
        cin >> c;
        for (int j = 0; j < c; j++) {
            int u;
            cin >> u;
            maska[i] |= 1 << u;
        }
    }
    int pelna = (1 << m) - 1;
    int best = -1;
    for (int s = 0; s < (1 << n); s++) {
        int razem = 0;
        for (int i = 0; i < n; i++)
            if ((s >> i) & 1) razem |= maska[i];
        if (razem == pelna) {
            int ile = __builtin_popcount(s);
            if (best == -1 || ile < best) best = ile;
        }
    }
    cout << best << "\n";
    return 0;
}`,
        },
    ];
};
