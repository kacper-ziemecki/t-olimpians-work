// Struct — ćwiczenia w trakcie lekcji, części 7–8: operatory (operator< z const do sort, set i map, operator==,
// operator+ i inne działania) oraz struktury w strukturach i schematy olimpijskie (struktura w strukturze, vector
// w strukturze, mapa struktur, zdarzenia posortowane po czasie, przedziały, zapytania z numerami).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./struct-pomoc');
    const { IMIONA, NAZWISKA, calk, zlote, hhmm, dataTxt, losData, unikalneImiona, unikalneSlowa, sortuj, skrocB, ulTxt, cmpS } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const imie = (r) => r.pick(IMIONA);
    const czyImie = (s, max) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const czyMale = (s, max) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const zl = (g) => zlote(g, '.');
    const cmpPkt = (a, b) => a[0] - b[0] || a[1] - b[1];

    return [
        // ================================================================ KROK 7 · operatory
        {
            id: 'st-unikalne-punkty', krok: 7, level: 'latwe',
            title: 'Różne punkty',
            short: 'set<Punkt> sam usuwa powtórki i trzyma punkty posortowane — wystarczy nauczyć go porównywać: operator< z const na końcu.',
            tags: ['operator<', 'set<Punkt>', 'const przy metodzie'],
            statement: ['Na mapie zaznaczono n punktów, niektóre kilka razy. Wypisz, ile jest różnych punktów, a potem wszystkie różne punkty posortowane według x, a przy równym x — według y.',
                'Wrzuć punkty do set<Punkt>. Żeby set umiał je ułożyć, dopisz w strukturze operator< — metodę bool operator<(const Punkt &o) const. Słowo const na końcu jest obowiązkowe: set porównuje punkty, których nie wolno zmieniać.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy x i y.'],
            output_format: ['Wiersz roznych: K, a potem K wierszy z punktami.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '6\n3 1\n-2 5\n3 1\n3 -4\n-2 5\n0 0', note: 'Punkty (3, 1) i (−2, 5) są dwa razy — różnych jest 4. Po sortowaniu: najpierw x = −2, potem 0, a dwa punkty z x = 3 według y.' }],
            hint: R`struct Punkt { int x, y; bool operator<(const Punkt &o) const { if (x != o.x) return x < o.x; return y < o.y; } };. Potem set<Punkt> s; s.insert({x, y}); — a na końcu for (const Punkt &p : s) wypisuje je już w kolejności.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m)]);
                return [d([[0, 0]]), d([[5, 5], [5, 5], [5, 5]]), d([[1e9, -1e9], [-1e9, 1e9], [-1e9, -1e9], [1e9, 1e9], [0, -1e9]]), d(los(30, 3)), d(los(1000, 1e9)), d(los(1000, 15))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === 1 + 2 * t[0] && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const s = new Map();
                for (let i = 0; i < t[0]; i++) s.set(`${t[1 + 2 * i]} ${t[2 + 2 * i]}`, [t[1 + 2 * i], t[2 + 2 * i]]);
                const u = [...s.values()].sort(cmpPkt);
                return [`roznych: ${u.length}`, ...u.map((p) => p.join(' '))].join('\n');
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
    set<Punkt> s;
    for (int i = 0; i < n; i++) {
        Punkt p;
        cin >> p.x >> p.y;
        s.insert(p);
    }
    cout << "roznych: " << s.size() << "\n";
    for (const Punkt &p : s) cout << p.x << " " << p.y << "\n";
    return 0;
}`,
        },
        {
            id: 'st-trafienia', krok: 7, level: 'latwe',
            title: 'Trafienia w tarczę',
            short: 'map<Punkt, int> liczy trafienia w każde pole. Z operatorem< punkt może być kluczem mapy tak samo jak liczba czy napis.',
            tags: ['map<Punkt, int>', 'operator< jako klucz', 'najczęstszy klucz'],
            statement: ['Na tarczy z kratkami padło n strzałów; każdy trafił w kratkę (x, y). Wypisz kratkę trafioną najwięcej razy (przy remisie — najmniejszą: o mniejszym x, a przy równym x — o mniejszym y) i liczbę jej trafień, a potem odpowiedz na q pytań: ile razy trafiono w kratkę (a, b)?',
                'Użyj map<Punkt, int> ile; i ile[p]++. Mapa przechodzi klucze w kolejności operatora<, więc remis rozstrzygnie się sam, jeśli podmieniasz najlepszą kratkę tylko przy ostrej nierówności.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy z kratkami x y.', 'Potem wiersz z q i q wierszy z pytaniami a b.'],
            output_format: ['Wiersz najczesciej: X Y (K razy), a potem q wierszy z liczbami trafień.'],
            constraints: ['1 ≤ n, q ≤ 1000', '−1000 ≤ x, y, a, b ≤ 1000'],
            examples: [{ input: '6\n0 0\n1 2\n0 0\n1 2\n5 5\n-1 3\n3\n1 2\n2 1\n-1 3', note: 'Kratki (0, 0) i (1, 2) mają po 2 trafienia — mniejsza jest (0, 0). W (2, 1) nikt nie trafił.' }],
            hint: R`Najczęstszą kratkę znajdź pętlą po mapie: for (auto [p, k] : ile) if (k > najwiecej) { najwiecej = k; best = p; }. Przy pytaniu nie używaj ile[{a, b}] — to dopisałoby pustą kratkę do mapy; lepiej ile.count({a, b}) ? ile[{a, b}] : 0 albo find.`,
            tests: (r) => {
                const d = (s, q) => `${s.length}\n${s.map((x) => x.join(' ')).join('\n')}\n${q.length}\n${q.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m)]);
                const s3 = los(1000, 10);
                return [d([[7, -7]], [[7, -7], [-7, 7]]), d([[3, 3], [-3, -3], [3, -3], [-3, 3]], [[3, 3], [0, 0]]), d(los(30, 3), los(20, 4)), d(s3, [...s3.slice(0, 500), ...los(500, 12)]), d(los(1000, 1000), los(1000, 1000))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                const ok = (l) => { const t = l.split(' ').map(Number); return t.length === 2 && t.every((x) => calk(x, -1000, 1000)); };
                if (!L.slice(1, n + 1).every(ok)) return 'strzal';
                const q = Number(L[n + 1]); if (!calk(q, 1, 1000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every(ok) ? null : 'pytanie';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const m = new Map();
                for (const l of L.slice(1, n + 1)) m.set(l, (m.get(l) || 0) + 1);
                const k = [...m.entries()].map(([s, c]) => [s.split(' ').map(Number), c]).sort((a, b) => cmpPkt(a[0], b[0]));
                let best = k[0];
                for (const x of k) if (x[1] > best[1]) best = x;
                return [`najczesciej: ${best[0].join(' ')} (${best[1]} razy)`, ...L.slice(n + 2).map((l) => String(m.get(l) || 0))].join('\n');
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
    map<Punkt, int> ile;
    for (int i = 0; i < n; i++) {
        Punkt p;
        cin >> p.x >> p.y;
        ile[p]++;
    }
    Punkt best = {0, 0};
    int najwiecej = 0;
    for (auto [p, k] : ile) {
        if (k > najwiecej) {
            najwiecej = k;
            best = p;
        }
    }
    cout << "najczesciej: " << best.x << " " << best.y << " (" << najwiecej << " razy)\n";
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        Punkt p;
        cin >> p.x >> p.y;
        auto it = ile.find(p);
        if (it == ile.end()) cout << 0 << "\n";
        else cout << it->second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-suma-wektorow', krok: 7, level: 'latwe',
            title: 'Dodawanie wektorów',
            short: 'Wektor + Wektor i Wektor * liczba — własne operatory sprawiają, że pozycja = pozycja + w * k wygląda jak zwykła matematyka.',
            tags: ['operator+', 'operator*', 'zwracanie nowej struktury'],
            statement: ['Dron zaczyna w punkcie (0, 0). Dostaje n poleceń; każde to wektor (x, y) i liczba powtórzeń k — dron przesuwa się k razy o ten wektor. Po każdym poleceniu wypisz pozycję drona, a na końcu jego odległość od startu w metryce taksówkowej |x| + |y|.',
                'Napisz strukturę Wektor z polami long long x, y i dwoma operatorami: Wektor operator+(const Wektor &o) const oraz Wektor operator*(long long k) const. Wtedy całe polecenie to jedna linijka: poz = poz + w * k;.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy x, y i k.'],
            output_format: ['n wierszy z pozycjami X Y i wiersz odleglosc: D.'],
            constraints: ['1 ≤ n ≤ 800', '−10⁶ ≤ x, y ≤ 10⁶, 1 ≤ k ≤ 10⁶'],
            examples: [{ input: '3\n1 2 3\n-4 0 2\n0 -1 10', note: 'Po 3 razy (1, 2) dron jest w (3, 6), potem 2 razy (−4, 0) daje (−5, 6), a 10 razy (0, −1) — (−5, −4). Odległość: 9.' }],
            hint: R`Wektor operator+(const Wektor &o) const { return {x + o.x, y + o.y}; } i Wektor operator*(long long k) const { return {x * k, y * k}; }. Operator to zwykła metoda — oddaje nowy wektor i nie zmienia ani siebie, ani o (stąd const). Pozycje sięgają 10¹⁵: long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m, mk) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m), r.int(1, mk)]);
                return [d([[0, 0, 1]]), d(Array.from({ length: 800 }, () => [1000000, -1000000, 1000000])), d(los(10, 5, 5)), d(los(800, 1000000, 1000000)), d(los(300, 3, 2))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 800) || t.length !== 1 + 3 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 3) if (!calk(t[i], -1e6, 1e6) || !calk(t[i + 1], -1e6, 1e6) || !calk(t[i + 2], 1, 1e6)) return 'zakres'; return null; },
            solve: (inp) => {
                const t = nums(inp); let x = 0n, y = 0n; const o = [];
                for (let i = 1; i < t.length; i += 3) { x += BigInt(t[i]) * BigInt(t[i + 2]); y += BigInt(t[i + 1]) * BigInt(t[i + 2]); o.push(`${x} ${y}`); }
                o.push(`odleglosc: ${(x < 0n ? -x : x) + (y < 0n ? -y : y)}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Wektor {
    long long x, y;
    Wektor operator+(const Wektor &o) const {
        return {x + o.x, y + o.y};
    }
    Wektor operator*(long long k) const {
        return {x * k, y * k};
    }
};
int main() {
    int n;
    cin >> n;
    Wektor poz = {0, 0};
    for (int i = 0; i < n; i++) {
        Wektor w;
        long long k;
        cin >> w.x >> w.y >> k;
        poz = poz + w * k;
        cout << poz.x << " " << poz.y << "\n";
    }
    cout << "odleglosc: " << llabs(poz.x) + llabs(poz.y) << "\n";
    return 0;
}`,
        },
        {
            id: 'st-sortuj-ulamki', krok: 7, level: 'srednie',
            title: 'Ułamki po kolei',
            short: 'operator< porównuje ułamki na krzyż, operator== mówi, czy są równe. stable_sort zostawia równe ułamki w kolejności z wejścia.',
            tags: ['operator< i operator==', 'stable_sort', 'mnożenie na krzyż'],
            statement: ['Ułóż n ułamków od najmniejszego do największego. Ułamki równe co do wartości (np. 1/2 i 3/6) zostaw w takiej kolejności, w jakiej były na wejściu. Wypisuj je tak, jak je wczytano. Na końcu wypisz, ile jest różnych wartości.',
                'W strukturze Ulamek zdefiniuj bool operator<(const Ulamek &o) const (mnożąc na krzyż — mianowniki są dodatnie) i bool operator==(const Ulamek &o) const. Do sortowania użyj stable_sort(v.begin(), v.end()) — działa jak sort, ale nie przestawia elementów równych sobie. Różne wartości policz, porównując sąsiadów po sortowaniu.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy licznik i mianownik.'],
            output_format: ['n wierszy l/m w nowej kolejności i wiersz roznych wartosci: K.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ licznik ≤ 10⁹, 1 ≤ mianownik ≤ 10⁹'],
            examples: [{ input: '5\n1 2\n-3 4\n3 6\n2 3\n0 5', note: '−3/4 < 0/5 < 1/2 = 3/6 < 2/3. Ułamki 1/2 i 3/6 są równe, więc zostają w kolejności z wejścia. Różnych wartości jest 4.' }],
            hint: R`bool operator<(const Ulamek &o) const { return l * o.m < o.l * m; } i bool operator==(const Ulamek &o) const { return l * o.m == o.l * m; } — pola jako long long, bo iloczyn sięga 10¹⁸. Po stable_sort: int rozne = 1; for (int i = 1; i < n; i++) if (!(v[i] == v[i - 1])) rozne++;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(1, m)]);
                const rowne = (n) => Array.from({ length: n }, () => { const l = r.int(-5, 5), m = r.int(1, 5), k = r.int(1, 1000); return [l * k, m * k]; });
                return [d([[0, 1]]), d([[2, 4], [1, 2], [-1, 1], [5, 10], [-7, 7], [0, 3], [0, 1]]), d(los(20, 6)), d(los(1000, 1e9)), d(rowne(1000)), d(Array.from({ length: 300 }, () => { const b = r.int(500000000, 1e9); return r() < 0.5 ? [b - 1, b] : [b, b + 1 > 1e9 ? b : b + 1]; }))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1000) || t.length !== 1 + 2 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 2) if (!calk(t[i], -1e9, 1e9) || !calk(t[i + 1], 1, 1e9)) return 'zakres'; return null; },
            solve: (inp) => {
                const t = toks(inp); const u = [];
                for (let i = 1; i < t.length; i += 2) u.push([BigInt(t[i]), BigInt(t[i + 1]), `${t[i]}/${t[i + 1]}`]);
                const c = (a, b) => { const x = a[0] * b[1], y = b[0] * a[1]; return x < y ? -1 : x > y ? 1 : 0; };
                const s = u.slice().sort(c);
                let rozne = 1; for (let i = 1; i < s.length; i++) if (c(s[i], s[i - 1]) !== 0) rozne++;
                return [...s.map((x) => x[2]), `roznych wartosci: ${rozne}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Ulamek {
    long long l, m;
    bool operator<(const Ulamek &o) const {
        return l * o.m < o.l * m;
    }
    bool operator==(const Ulamek &o) const {
        return l * o.m == o.l * m;
    }
};
int main() {
    int n;
    cin >> n;
    vector<Ulamek> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].l >> v[i].m;
    stable_sort(v.begin(), v.end());
    int rozne = 1;
    for (int i = 0; i < n; i++) {
        cout << v[i].l << "/" << v[i].m << "\n";
        if (i > 0 && !(v[i] == v[i - 1])) rozne++;
    }
    cout << "roznych wartosci: " << rozne << "\n";
    return 0;
}`,
        },
        {
            id: 'st-przyjazdy', krok: 7, level: 'srednie',
            title: 'Tablica przyjazdów',
            short: 'Czas + minuty daje nowy Czas, a operator< porównuje dwa czasy. Z takimi klockami komparator pociągów jest krótki i czytelny.',
            tags: ['operator+ z liczbą', 'operator< w komparatorze', 'trzy kryteria'],
            statement: ['Na dworcu odjeżdża n pociągów; każdy ma nazwę, godzinę odjazdu HH:MM i czas jazdy w minutach (każdy dojeżdża tego samego dnia). Wypisz tablicę przyjazdów: pociągi od najwcześniejszego przyjazdu, przy równym przyjeździe — od wcześniejszego odjazdu, a jeśli i to równe — alfabetycznie po nazwie.',
                'Napisz strukturę Czas z polami h, m i operatorami Czas operator+(int minuty) const oraz bool operator<(const Czas &o) const (i operator== albo !=, jeśli go potrzebujesz). Pociąg to struktura z nazwą, odjazdem i przyjazdem.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa, odjazd HH:MM i czas jazdy.'],
            output_format: ['n wierszy: NAZWA HH:MM -> HH:MM (odjazd i przyjazd).'],
            constraints: ['1 ≤ n ≤ 1000', 'Nazwy pociągów mają od 1 do 15 znaków (wielkie litery i cyfry).', '1 ≤ czas jazdy ≤ 600; każdy pociąg przyjeżdża najpóźniej o 23:59.'],
            examples: [{ input: '4\nIC100 06:15 135\nTLK5 07:00 90\nR21 08:20 10\nEIP3 07:30 60', note: 'Przyjazdy: IC100 08:30, TLK5 08:30, R21 08:30, EIP3 08:30 — wszystkie o tej samej godzinie! Decyduje odjazd: 06:15, 07:00, 07:30, 08:20.' }],
            hint: R`Czas operator+(int minuty) const { int t = h * 60 + m + minuty; return {t / 60, t % 60}; }. operator< porównuje h * 60 + m. Komparator pociągów: if (a.przyjazd < b.przyjazd || b.przyjazd < a.przyjazd) return a.przyjazd < b.przyjazd; — i tak samo dla odjazdu, a na końcu nazwa.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => `${x[0]} ${hhmm(x[1])} ${x[2]}`).join('\n')}`;
                const naz = () => r.pick(['IC', 'TLK', 'R', 'EIP', 'KS', 'SKM', 'EC']) + r.int(1, 9999);
                const los = (n, okno) => Array.from({ length: n }, () => { const t = r.int(1, okno); const od = r.int(0, 1439 - t); return [naz(), od, t]; });
                const zbieg = (n) => Array.from({ length: n }, () => { const t = r.int(1, 600); return [naz(), 900 - t, t]; });
                return [d([['A1', 0, 1]]), d([['B', 600, 60], ['A', 600, 60], ['C', 540, 120], ['D', 1438, 1]]), d(los(20, 120)), d(los(1000, 600)), d(zbieg(300))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const m = l.match(/^([A-Z0-9]{1,15}) (\d\d):(\d\d) (\d+)$/); if (!m) return false; const od = Number(m[2]) * 60 + Number(m[3]), t = Number(m[4]); return Number(m[2]) < 24 && Number(m[3]) < 60 && calk(t, 1, 600) && od + t <= 1439; }) ? null : 'dane';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const [n, g, t] = l.split(' '); const [hh, mm] = g.split(':').map(Number); const od = hh * 60 + mm; return [n, od, od + Number(t)]; });
                return sortuj(u, (x) => [x[2], x[1], x[0]]).map((x) => `${x[0]} ${hhmm(x[1])} -> ${hhmm(x[2])}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Czas {
    int h, m;
    Czas operator+(int minuty) const {
        int t = h * 60 + m + minuty;
        return {t / 60, t % 60};
    }
    bool operator<(const Czas &o) const {
        return h * 60 + m < o.h * 60 + o.m;
    }
    bool operator!=(const Czas &o) const {
        return h != o.h || m != o.m;
    }
};
struct Pociag {
    string nazwa;
    Czas odjazd, przyjazd;
};
void wypisz(Czas c) {
    cout << setfill('0') << setw(2) << c.h << ":" << setw(2) << c.m;
}
int main() {
    int n;
    cin >> n;
    vector<Pociag> v(n);
    char dwukropek;
    for (int i = 0; i < n; i++) {
        int jazda;
        cin >> v[i].nazwa >> v[i].odjazd.h >> dwukropek >> v[i].odjazd.m >> jazda;
        v[i].przyjazd = v[i].odjazd + jazda;
    }
    sort(v.begin(), v.end(), [](const Pociag &a, const Pociag &b) {
        if (a.przyjazd != b.przyjazd) return a.przyjazd < b.przyjazd;
        if (a.odjazd != b.odjazd) return a.odjazd < b.odjazd;
        return a.nazwa < b.nazwa;
    });
    for (const Pociag &p : v) {
        cout << p.nazwa << " ";
        wypisz(p.odjazd);
        cout << " -> ";
        wypisz(p.przyjazd);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-kalkulator-ulamkow', krok: 7, level: 'srednie',
            title: 'Kalkulator ułamków',
            short: 'Cztery operatory + − * / na strukturze Ulamek, każdy oddaje ułamek już skrócony. Dzielenie przez zero trzeba wyłapać wcześniej.',
            tags: ['operatory + − * /', 'skracanie w operatorze', 'wczytywanie a/b'],
            statement: ['Kalkulator dostaje q działań w postaci a/b OP c/d, gdzie OP to +, -, * albo /. Dla każdego wypisz wynik jako ułamek nieskracalny z dodatnim mianownikiem (zero to 0/1). Jeśli trzeba podzielić przez ułamek równy zero, wypisz blad.',
                'Zdefiniuj w strukturze Ulamek operatory +, -, * i / (każdy oddaje nowy, już skrócony ułamek) i funkcję skracającą, która przenosi minus z mianownika do licznika.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy działanie a/b OP c/d (ze spacjami wokół OP).'],
            output_format: ['q wierszy z wynikami l/m albo słowem blad.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁴ ≤ a, c ≤ 10⁴, 1 ≤ b, d ≤ 10⁴'],
            examples: [{ input: '4\n1/2 + 1/3\n3/4 - 5/4\n-2/3 * 9/4\n7/5 / 0/2', note: '1/2 + 1/3 = 5/6, 3/4 − 5/4 = −2/4 = −1/2, −2/3 · 9/4 = −18/12 = −3/2, a dzielenia przez 0/2 nie da się wykonać.' }],
            hint: R`Wczytuj: cin >> a.l >> kreska >> a.m >> op >> c.l >> kreska >> c.m; (kreska i op to char). Dzielenie: a / c to a · (c.m / c.l) — gdy c.l == 0, wypisz blad, a gdy c.l < 0, minus wędruje do licznika w skracaniu. Iloczyny są małe (do 10⁸), ale i tak trzymaj pola w long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const u = (m) => `${r.int(-m, m)}/${r.int(1, m)}`;
                const los = (n, m) => Array.from({ length: n }, () => `${u(m)} ${r.pick(['+', '-', '*', '/'])} ${r() < 0.1 ? `0/${r.int(1, m)}` : u(m)}`);
                return [d(['0/1 + 0/1']), d(['10000/1 * 10000/1', '-10000/1 * 10000/1', '1/10000 / 10000/1', '1/10000 - 1/9999', '5/5 / -1/3', '0/7 / 3/4', '2/4 - 1/2']), d(los(20, 6)), d(los(1000, 10000)), d(los(500, 30))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => { const m = l.match(/^(-?\d+)\/(\d+) ([-+*/]) (-?\d+)\/(\d+)$/); return m && calk(Number(m[1]), -1e4, 1e4) && calk(Number(m[2]), 1, 1e4) && calk(Number(m[4]), -1e4, 1e4) && calk(Number(m[5]), 1, 1e4); }) ? null : 'dzialanie';
            },
            solve: (inp) => linie(inp).slice(1).map((l) => {
                const m = l.match(/^(-?\d+)\/(\d+) ([-+*/]) (-?\d+)\/(\d+)$/);
                const a = BigInt(m[1]), b = BigInt(m[2]), c = BigInt(m[4]), dd = BigInt(m[5]);
                if (m[3] === '+') return ulTxt(skrocB(a * dd + c * b, b * dd));
                if (m[3] === '-') return ulTxt(skrocB(a * dd - c * b, b * dd));
                if (m[3] === '*') return ulTxt(skrocB(a * c, b * dd));
                return c === 0n ? 'blad' : ulTxt(skrocB(a * dd, b * c));
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
struct Ulamek {
    long long l, m;
    Ulamek skroc() const {
        long long L = l, M = m;
        if (M < 0) {
            L = -L;
            M = -M;
        }
        long long g = nwd(llabs(L), M);
        return {L / g, M / g};
    }
    Ulamek operator+(const Ulamek &o) const {
        return Ulamek{l * o.m + o.l * m, m * o.m}.skroc();
    }
    Ulamek operator-(const Ulamek &o) const {
        return Ulamek{l * o.m - o.l * m, m * o.m}.skroc();
    }
    Ulamek operator*(const Ulamek &o) const {
        return Ulamek{l * o.l, m * o.m}.skroc();
    }
    Ulamek operator/(const Ulamek &o) const {
        return Ulamek{l * o.m, m * o.l}.skroc();
    }
};
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        Ulamek a, c;
        char kreska, op;
        cin >> a.l >> kreska >> a.m >> op >> c.l >> kreska >> c.m;
        Ulamek w;
        if (op == '+') w = a + c;
        else if (op == '-') w = a - c;
        else if (op == '*') w = a * c;
        else if (c.l == 0) {
            cout << "blad\n";
            continue;
        } else w = a / c;
        cout << w.l << "/" << w.m << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-ten-sam-ksztalt', krok: 7, level: 'srednie',
            title: 'Ten sam kształt',
            short: 'Dwie figury z kratek: czy to ta sama figura przesunięta? Sortujesz kratki, przesuwasz pierwszą do (0, 0) i porównujesz vectory operatorem ==.',
            tags: ['operator== i vector ==', 'sortowanie z operator<', 'normalizacja'],
            statement: ['Figura to zbiór różnych kratek (x, y) na kratkowanym papierze. Dla każdego z t testów sprawdź, czy dwie figury mają ten sam kształt, czyli czy jedną da się dostać z drugiej przez samo przesunięcie (bez obracania i odbijania). Wypisz TAK albo NIE.',
                'Pomysł: posortuj kratki każdej figury (operator<), a potem odejmij od każdej kratki współrzędne pierwszej — figura „przesuwa się” tak, że jej pierwsza kratka trafia w (0, 0). Dwie figury mają ten sam kształt dokładnie wtedy, gdy po takim przesunięciu ich vectory są równe. Porównanie v1 == v2 dla dwóch vectorów działa, gdy struktura ma operator==.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test to wiersz z k, k wierszy z kratkami pierwszej figury, wiersz z m i m wierszy z kratkami drugiej.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 50', '1 ≤ k, m ≤ 1000, suma wszystkich k i m najwyżej 6000', '−10⁶ ≤ x, y ≤ 10⁶; w figurze kratki się nie powtarzają'],
            examples: [{ input: '2\n3\n0 0\n1 0\n1 1\n3\n5 7\n6 8\n6 7\n3\n0 0\n1 0\n2 0\n3\n0 0\n0 1\n0 2', note: 'W pierwszym teście druga figura to pierwsza przesunięta o (5, 7) — kratki są tylko w innej kolejności. W drugim teście pozioma kreska i pionowa kreska to różne kształty, bo nie wolno obracać.' }],
            hint: R`Napisz funkcję void normalizuj(vector<Punkt> &f) { sort(f.begin(), f.end()); Punkt p = f[0]; for (Punkt &q : f) { q.x -= p.x; q.y -= p.y; } }. Po posortowaniu pierwsza kratka jest „najmniejsza”, a przesunięcie nie zmienia kolejności. Potem if (f1 == f2) — vector porównuje rozmiary i kolejne elementy operatorem ==.`,
            tests: (r) => {
                const d = (ts) => `${ts.length}\n${ts.map(([a, b]) => `${a.length}\n${a.map((p) => p.join(' ')).join('\n')}\n${b.length}\n${b.map((p) => p.join(' ')).join('\n')}`).join('\n')}`;
                const figura = (k, rozrzut) => { const s = new Map(); let x = 0, y = 0; while (s.size < k) { s.set(`${x} ${y}`, [x, y]); if (r() < 0.8) { const dd = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]); x += dd[0]; y += dd[1]; } else { x = r.int(-rozrzut, rozrzut); y = r.int(-rozrzut, rozrzut); } } return [...s.values()]; };
                const przesun = (f, dx, dy) => r.shuffle(f.map(([x, y]) => [x + dx, y + dy]));
                const test = (k, rozrzut, M) => {
                    const f = figura(k, rozrzut); const dx = r.int(-M, M), dy = r.int(-M, M); const z = r();
                    if (z < 0.5) return [r.shuffle(f), przesun(f, dx, dy)];
                    if (z < 0.7) { const g = przesun(f, dx, dy); const i = r.int(0, g.length - 1); const kand = [g[i][0] + r.pick([-1, 1]), g[i][1]]; if (!g.some((p) => p[0] === kand[0] && p[1] === kand[1])) g[i] = kand; return [f, g]; }
                    if (z < 0.85) return [f, przesun(f.map(([x, y]) => [y, x]), dx, dy)];
                    return [f, figura(k, rozrzut)];
                };
                const ogr = (ts) => ts.map(([a, b]) => [a.map(([x, y]) => [Math.max(-1e6, Math.min(1e6, x)), Math.max(-1e6, Math.min(1e6, y))]), b.map(([x, y]) => [Math.max(-1e6, Math.min(1e6, x)), Math.max(-1e6, Math.min(1e6, y))])]);
                return [d([[[[0, 0]], [[1000000, -1000000]]]]), d([[[[0, 0], [1, 0]], [[0, 0]]], [[[0, 0], [0, 1]], [[5, 5], [5, 6]]], [[[0, 0], [1, 1]], [[0, 1], [1, 0]]]]), d(Array.from({ length: 20 }, () => test(r.int(1, 8), 3, 20))), d(ogr(Array.from({ length: 3 }, () => test(1000, 50, 900000)))), d(Array.from({ length: 50 }, () => test(r.int(1, 50), 10, 1000)))];
            },
            check: (inp) => {
                const t = nums(inp); if (!calk(t[0], 1, 50)) return 't'; let i = 1, suma = 0;
                for (let k = 0; k < t[0]; k++) for (let f = 0; f < 2; f++) { const n = t[i]; if (!calk(n, 1, 1000)) return 'n'; suma += n; const s = new Set(); for (let j = 0; j < n; j++) { const x = t[i + 1 + 2 * j], y = t[i + 2 + 2 * j]; if (!calk(x, -1e6, 1e6) || !calk(y, -1e6, 1e6)) return 'zakres'; s.add(`${x} ${y}`); } if (s.size !== n) return 'powtorka'; i += 1 + 2 * n; }
                return i === t.length && suma <= 6000 ? null : 'dlugosc';
            },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const o = [];
                const czytaj = () => { const n = t[i]; const f = Array.from({ length: n }, (_, j) => [t[i + 1 + 2 * j], t[i + 2 + 2 * j]]); i += 1 + 2 * n; f.sort(cmpPkt); return f.map(([x, y]) => `${x - f[0][0]} ${y - f[0][1]}`).join(';'); };
                for (let k = 0; k < t[0]; k++) { const a = czytaj(), b = czytaj(); o.push(a === b ? 'TAK' : 'NIE'); }
                return o.join('\n');
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
    bool operator==(const Punkt &o) const {
        return x == o.x && y == o.y;
    }
};
vector<Punkt> wczytaj() {
    int k;
    cin >> k;
    vector<Punkt> f(k);
    for (int i = 0; i < k; i++) cin >> f[i].x >> f[i].y;
    return f;
}
void normalizuj(vector<Punkt> &f) {
    sort(f.begin(), f.end());
    Punkt p = f[0];
    for (Punkt &q : f) {
        q.x -= p.x;
        q.y -= p.y;
    }
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        vector<Punkt> a = wczytaj();
        vector<Punkt> b = wczytaj();
        normalizuj(a);
        normalizuj(b);
        if (a == b) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-dziennik-wizyt', krok: 7, level: 'srednie',
            title: 'Dziennik wizyt',
            short: 'Data jako klucz mapy: operator< na trzech polach i map<Data, …> sam układa dni chronologicznie. Do tego set osób na każdy dzień.',
            tags: ['Data jako klucz map', 'map<Data, set<string>>', 'kolejność chronologiczna'],
            statement: ['Recepcja zapisuje wizyty w przypadkowej kolejności: datę DD.MM.RRRR i imię gościa. Ta sama osoba może przyjść kilka razy jednego dnia. Dla każdego dnia, w którym ktoś był — chronologicznie — wypisz liczbę wizyt i liczbę różnych osób.',
                'Napisz strukturę Data z operatorem<, a potem użyj map<Data, int> wizyt i map<Data, set<string>> osoby (albo jednej mapy ze strukturą jako wartością). Mapa przechodzi klucze od najmniejszego, czyli od najwcześniejszej daty.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy data DD.MM.RRRR i imię.'],
            output_format: ['Po jednym wierszu dla każdego dnia: DD.MM.RRRR: wizyt W, osob O.'],
            constraints: ['1 ≤ n ≤ 900', 'Daty są poprawne, lata od 2020 do 2030; imiona mają od 1 do 15 liter (pierwsza wielka).'],
            examples: [{ input: '5\n03.02.2026 Ola\n28.01.2026 Kuba\n03.02.2026 Ola\n03.02.2026 Iga\n15.12.2025 Ola', note: 'Najwcześniej 15.12.2025, potem 28.01.2026. 3 lutego były trzy wizyty, ale tylko dwie różne osoby — Ola przyszła dwa razy.' }],
            hint: R`bool operator<(const Data &o) const { if (r != o.r) return r < o.r; if (m != o.m) return m < o.m; return d < o.d; }. Wczytanie: cin >> x.d >> kropka >> x.m >> kropka >> x.r >> imie;. Potem wizyt[x]++; osoby[x].insert(imie);, a na końcu for (auto [data, ile] : wizyt).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => `${dataTxt(x[0], x[1], x[2])} ${x[3]}`).join('\n')}`;
                const los = (n, dni, osob) => { const D = Array.from({ length: dni }, () => losData(r, 2020, 2030)); const O = unikalneImiona(r, osob); return Array.from({ length: n }, () => [...r.pick(D), r.pick(O)]); };
                return [d([[1, 1, 2020, 'Ala']]), d([[31, 12, 2029, 'A'], [1, 1, 2030, 'A'], [31, 12, 2029, 'A'], [1, 12, 2029, 'B'], [12, 1, 2029, 'C']]), d(los(20, 4, 3)), d(los(900, 600, 40)), d(los(900, 30, 5)), d(los(900, 900, 50))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 900) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const m = l.match(/^(\d\d)\.(\d\d)\.(\d{4}) ([A-Z][a-z]{0,14})$/); return m && P.czyPoprawnaData(Number(m[1]), Number(m[2]), Number(m[3])) && calk(Number(m[3]), 2020, 2030); }) ? null : 'dane';
            },
            solve: (inp) => {
                const m = new Map();
                for (const l of linie(inp).slice(1)) { const [dt, im] = l.split(' '); if (!m.has(dt)) m.set(dt, { w: 0, o: new Set() }); const x = m.get(dt); x.w++; x.o.add(im); }
                const klucz = (dt) => dt.slice(6) + dt.slice(3, 5) + dt.slice(0, 2);
                return [...m.keys()].sort((a, b) => cmpS(klucz(a), klucz(b))).map((dt) => `${dt}: wizyt ${m.get(dt).w}, osob ${m.get(dt).o.size}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Data {
    int d, m, r;
    bool operator<(const Data &o) const {
        if (r != o.r) return r < o.r;
        if (m != o.m) return m < o.m;
        return d < o.d;
    }
};
int main() {
    int n;
    cin >> n;
    map<Data, int> wizyt;
    map<Data, set<string>> osoby;
    char kropka;
    for (int i = 0; i < n; i++) {
        Data x;
        string imie;
        cin >> x.d >> kropka >> x.m >> kropka >> x.r >> imie;
        wizyt[x]++;
        osoby[x].insert(imie);
    }
    for (auto [x, ile] : wizyt) {
        cout << setfill('0') << setw(2) << x.d << "." << setw(2) << x.m << "." << x.r;
        cout << ": wizyt " << ile << ", osob " << osoby[x].size() << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 8 · struktury w strukturach i schematy olimpijskie
        {
            id: 'st-odcinki', krok: 8, level: 'latwe',
            title: 'Odcinki na planszy',
            short: 'Odcinek to struktura z dwoma Punktami w środku. Dostęp przez dwie kropki: o.a.x — najpierw odcinek, potem jego koniec, potem współrzędna.',
            tags: ['struktura w strukturze', 'o.a.x', 'poziome i pionowe'],
            statement: ['Na planszy narysowano n odcinków; każdy jest poziomy albo pionowy i ma dodatnią długość. Policz poziome i pionowe odcinki, ich łączną długość i znajdź najdłuższy (przy remisie — pierwszy na liście).',
                'Zadeklaruj struct Punkt { int x, y; }; i struct Odcinek { Punkt a, b; }; — odcinek składa się z dwóch punktów. Koniec odcinka to o.a, a jego współrzędna x to o.a.x.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy cztery liczby: x1 y1 x2 y2 — końce odcinka.'],
            output_format: ['Trzy wiersze: poziome: H, pionowe: V, potem razem: L i najdluzszy: x1 y1 x2 y2 (końce w kolejności z wejścia).'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ współrzędne ≤ 10⁶', 'Każdy odcinek ma x1 = x2 albo y1 = y2 (ale nie oba naraz).'],
            examples: [{ input: '3\n0 0 5 0\n2 -1 2 7\n-3 4 1 4', note: 'Odcinki 1 i 3 są poziome (długości 5 i 4), odcinek 2 jest pionowy (długość 8). Razem 17, najdłuższy jest drugi.' }],
            hint: R`Długość odcinka poziomego lub pionowego to abs(o.a.x - o.b.x) + abs(o.a.y - o.b.y) — jedna z różnic jest zerem. Odcinek jest poziomy, gdy o.a.y == o.b.y. Łączna długość sięga 2 · 10⁹ — long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const odc = (m) => { const x = r.int(-m, m), y = r.int(-m, m); let k; do { k = r.int(-m, m); } while (k === (r() < 0.5 ? x : y) && false); if (r() < 0.5) { let x2 = r.int(-m, m); if (x2 === x) x2 = x === m ? x - 1 : x + 1; return [x, y, x2, y]; } let y2 = r.int(-m, m); if (y2 === y) y2 = y === m ? y - 1 : y + 1; return [x, y, x, y2]; };
                return [d([[0, 0, 0, 1]]), d([[-1e6, -1e6, 1e6, -1e6], [1e6, 1e6, 1e6, -1e6], [3, 3, 3, 5], [5, 5, 3, 5]]), d(Array.from({ length: 12 }, () => odc(10))), d(Array.from({ length: 1000 }, () => odc(1e6))), d(Array.from({ length: 300 }, () => odc(2)))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1000) || t.length !== 1 + 4 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 4) { const [a, b, c, d] = t.slice(i, i + 4); if (![a, b, c, d].every((x) => calk(x, -1e6, 1e6))) return 'zakres'; if ((a === c) === (b === d)) return 'nie poziomy/pionowy'; } return null; },
            solve: (inp) => {
                const t = nums(inp); let H = 0, V = 0, S = 0, best = null, bd = -1;
                for (let i = 1; i < t.length; i += 4) { const o = t.slice(i, i + 4); if (o[1] === o[3]) H++; else V++; const dd = Math.abs(o[0] - o[2]) + Math.abs(o[1] - o[3]); S += dd; if (dd > bd) { bd = dd; best = o; } }
                return `poziome: ${H}, pionowe: ${V}\nrazem: ${S}\nnajdluzszy: ${best.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    int x, y;
};
struct Odcinek {
    Punkt a, b;
};
int dlugosc(const Odcinek &o) {
    return abs(o.a.x - o.b.x) + abs(o.a.y - o.b.y);
}
int main() {
    int n;
    cin >> n;
    vector<Odcinek> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].a.x >> v[i].a.y >> v[i].b.x >> v[i].b.y;
    int poziome = 0, pionowe = 0, best = 0;
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        if (v[i].a.y == v[i].b.y) poziome++;
        else pionowe++;
        razem += dlugosc(v[i]);
        if (dlugosc(v[i]) > dlugosc(v[best])) best = i;
    }
    cout << "poziome: " << poziome << ", pionowe: " << pionowe << "\n";
    cout << "razem: " << razem << "\n";
    Odcinek o = v[best];
    cout << "najdluzszy: " << o.a.x << " " << o.a.y << " " << o.b.x << " " << o.b.y << "\n";
    return 0;
}`,
        },
        {
            id: 'st-dziennik-ocen', krok: 8, level: 'latwe',
            title: 'Dziennik z ocenami',
            short: 'Uczeń ma imię i vector<int> ocen — struktura może trzymać w środku całą listę. Średnia, najwyższa i najniższa ocena dla każdego.',
            tags: ['vector w strukturze', 'metoda const', 'u.oceny.push_back'],
            statement: ['Dziennik ma n uczniów; każdy ma imię i listę ocen (od 1 do 6). Dla każdego ucznia wypisz średnią z dwiema cyframi po kropce, najwyższą i najniższą ocenę, a jeśli ma choć jedną jedynkę — dopisz (zagrozony). Na końcu wypisz ucznia z najwyższą średnią (przy remisie — pierwszego na liście).',
                'Zadeklaruj struct Uczen { string imie; vector<int> oceny; }; z metodą double srednia() const. Oceny wczytuj przez u.oceny.push_back(o).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, liczba ocen k i k ocen.'],
            output_format: ['n wierszy: IMIE: srednia X.XX, max A, min B (i ewentualnie (zagrozony)), a potem najlepszy: IMIE.'],
            constraints: ['1 ≤ n ≤ 500', '1 ≤ k ≤ 30', 'Imiona mają od 1 do 20 znaków (litery i cyfry, pierwsza wielka).', 'Żadna średnia nie wypada dokładnie w połowie między dwoma wynikami z dwoma miejscami po przecinku.'],
            examples: [{ input: '3\nOla 4 5 6 5 4\nKuba 3 1 4 6\nIga 2 5 5', note: 'Ola: 20 / 4 = 5.00. Kuba ma jedynkę — jest zagrożony, choć jego średnia to 3.67. Iga też ma 5.00, ale była niżej na liście, więc najlepsza jest Ola.' }],
            hint: R`Metoda: double srednia() const { int s = 0; for (int o : oceny) s += o; return (double)s / oceny.size(); }. Najlepszego szukaj bez zaokrągleń: porównuj sumę · liczba ocen drugiego ucznia, jak przy ułamkach — albo trzymaj sumę w osobnym polu.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => `${x[0]} ${x[1].length} ${x[1].join(' ')}`).join('\n')}`;
                const uczen = (s, kmax, lo) => { for (;;) { const k = r.int(1, kmax); const o = Array.from({ length: k }, () => r.int(lo, 6)); if (h.safe(o.reduce((a, b) => a + b, 0) / k, 2)) return [s, o]; } };
                const los = (n, kmax, lo) => unikalneImiona(r, n).map((s) => uczen(s, kmax, lo));
                return [d([['Ala', [1]]]), d([['A', [6, 6]], ['B', [6]], ['C', [1, 6, 6, 6, 6]]]), d(los(10, 6, 1)), d(los(500, 30, 1)), d(los(200, 3, 4))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 500) || L.length !== n + 1) return 'n';
                for (const l of L.slice(1)) { const t = l.split(' '); const k = Number(t[1]); if (!/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || !calk(k, 1, 30) || t.length !== k + 2) return 'dane'; const o = t.slice(2).map(Number); if (!o.every((x) => calk(x, 1, 6))) return 'oceny'; if (!h.safe(o.reduce((a, b) => a + b, 0) / k, 2)) return 'polowka'; }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], t.slice(2).map(Number)]; });
                const o = []; let best = null;
                for (const [n, oc] of u) {
                    const s = oc.reduce((a, b) => a + b, 0);
                    o.push(`${n}: srednia ${h.fx(s / oc.length, 2)}, max ${Math.max(...oc)}, min ${Math.min(...oc)}${oc.includes(1) ? ' (zagrozony)' : ''}`);
                    if (!best || s * best[2] > best[1] * oc.length) best = [n, s, oc.length];
                }
                o.push(`najlepszy: ${best[0]}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie;
    vector<int> oceny;
    int suma() const {
        int s = 0;
        for (int o : oceny) s += o;
        return s;
    }
    double srednia() const {
        return (double)suma() / oceny.size();
    }
};
int main() {
    int n;
    cin >> n;
    vector<Uczen> v(n);
    for (int i = 0; i < n; i++) {
        int k;
        cin >> v[i].imie >> k;
        for (int j = 0; j < k; j++) {
            int o;
            cin >> o;
            v[i].oceny.push_back(o);
        }
    }
    cout << fixed << setprecision(2);
    int best = 0;
    for (int i = 0; i < n; i++) {
        const Uczen &u = v[i];
        cout << u.imie << ": srednia " << u.srednia();
        cout << ", max " << *max_element(u.oceny.begin(), u.oceny.end());
        cout << ", min " << *min_element(u.oceny.begin(), u.oceny.end());
        if (count(u.oceny.begin(), u.oceny.end(), 1) > 0) cout << " (zagrozony)";
        cout << "\n";
        if (1LL * u.suma() * v[best].oceny.size() > 1LL * v[best].suma() * u.oceny.size()) best = i;
    }
    cout << "najlepszy: " << v[best].imie << "\n";
    return 0;
}`,
        },
        {
            id: 'st-druzyny', krok: 8, level: 'srednie',
            title: 'Siła drużyn',
            short: 'Drużyna to nazwa i vector<Zawodnik>. Moc drużyny liczysz z trzech najsilniejszych — sortowanie w środku struktury i sortowanie samych drużyn.',
            tags: ['vector struktur w strukturze', 'dwa sortowania', 'metoda licząca'],
            statement: ['Na turniej zgłosiło się m drużyn; każda ma nazwę i skład: zawodników z imieniem i siłą. Moc drużyny to suma sił jej trzech najsilniejszych zawodników (albo wszystkich, jeśli ma ich mniej niż trzech).',
                'Wypisz drużyny od najmocniejszej (przy równej mocy — alfabetycznie według nazwy), a przy każdej jej liderów: tych trzech (albo mniej) najsilniejszych zawodników, od najsilniejszego, a przy równej sile — alfabetycznie. Zadeklaruj struct Zawodnik { string imie; int sila; }; i struct Druzyna { string nazwa; vector<Zawodnik> sklad; };.'],
            input_format: ['W pierwszym wierszu m.', 'Każda drużyna to wiersz z nazwą i liczbą zawodników k, a potem k wierszy: imię i siła.'],
            output_format: ['m wierszy: NAZWA: moc M, liderzy: IMIE1, IMIE2, IMIE3.'],
            constraints: ['1 ≤ m ≤ 100, 1 ≤ k ≤ 30', 'Nazwy drużyn są różne (od 1 do 15 znaków: litery i _); imiona mają od 1 do 20 znaków (litery i cyfry), w drużynie się nie powtarzają.', '1 ≤ siła ≤ 10⁶'],
            examples: [{ input: '2\nOrly 4\nOla 70\nKuba 95\nIga 70\nAdam 40\nSokoly 2\nZosia 120\nEla 115', note: 'Orły: 95 + 70 + 70 = 235 (Iga i Ola mają po 70 — alfabetycznie Iga pierwsza). Sokoły mają tylko dwóch zawodników: 120 + 115 = 235. Remis mocy — alfabetycznie Orly przed Sokoly.' }],
            hint: R`Najpierw w każdej drużynie posortuj skład: sort(d.sklad.begin(), d.sklad.end(), …) — po sile malejąco, przy remisie po imieniu. Wtedy liderzy to pierwsze min(3, k) elementy, a moc to ich suma (zapisz ją w polu struktury). Potem posortuj vector<Druzyna> po mocy i nazwie.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([n, s]) => `${n} ${s.length}\n${s.map((x) => x.join(' ')).join('\n')}`).join('\n')}`;
                const druz = (m, kmax, smax) => unikalneSlowa(r, m, 2, 4).map((n) => [n[0].toUpperCase() + n.slice(1), unikalneImiona(r, r.int(1, kmax)).map((s) => [s, r.int(1, smax)])]);
                return [d([['Solo', [['Ala', 1]]]]), d([['B', [['X', 5], ['Y', 5]]], ['A', [['Z', 10]]], ['C', [['P', 3], ['Q', 3], ['R', 3], ['S', 3]]]]), d(druz(8, 6, 20)), d(druz(100, 30, 1000000)), d(druz(60, 5, 3))];
            },
            check: (inp) => {
                const L = linie(inp); const m = Number(L[0]); if (!calk(m, 1, 100)) return 'm'; let i = 1; const nz = new Set();
                for (let k = 0; k < m; k++) { const [n, c] = (L[i] || '').split(' '); const kk = Number(c); if (!/^[A-Za-z_]{1,15}$/.test(n) || nz.has(n) || !calk(kk, 1, 30)) return 'druzyna'; nz.add(n); const im = new Set(); for (let j = 1; j <= kk; j++) { const t = (L[i + j] || '').split(' '); if (t.length !== 2 || !/^[A-Za-z0-9]{1,20}$/.test(t[0]) || im.has(t[0]) || !calk(Number(t[1]), 1, 1e6)) return 'zawodnik'; im.add(t[0]); } i += 1 + kk; }
                return i === L.length ? null : 'dlugosc';
            },
            solve: (inp) => {
                const L = linie(inp); const m = Number(L[0]); let i = 1; const D = [];
                for (let k = 0; k < m; k++) { const [n, c] = L[i].split(' '); const s = L.slice(i + 1, i + 1 + Number(c)).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; }); i += 1 + Number(c); const top = sortuj(s, (x) => [x[1], x[0]], [-1, 1]).slice(0, 3); D.push([n, top.reduce((a, x) => a + x[1], 0), top]); }
                return sortuj(D, (x) => [x[1], x[0]], [-1, 1]).map((x) => `${x[0]}: moc ${x[1]}, liderzy: ${x[2].map((z) => z[0]).join(', ')}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zawodnik {
    string imie;
    int sila;
};
struct Druzyna {
    string nazwa;
    vector<Zawodnik> sklad;
    long long moc = 0;
};
int main() {
    int m;
    cin >> m;
    vector<Druzyna> v(m);
    for (int i = 0; i < m; i++) {
        int k;
        cin >> v[i].nazwa >> k;
        v[i].sklad.resize(k);
        for (int j = 0; j < k; j++) cin >> v[i].sklad[j].imie >> v[i].sklad[j].sila;
        sort(v[i].sklad.begin(), v[i].sklad.end(), [](const Zawodnik &a, const Zawodnik &b) {
            if (a.sila != b.sila) return a.sila > b.sila;
            return a.imie < b.imie;
        });
        for (int j = 0; j < k && j < 3; j++) v[i].moc += v[i].sklad[j].sila;
    }
    sort(v.begin(), v.end(), [](const Druzyna &a, const Druzyna &b) {
        if (a.moc != b.moc) return a.moc > b.moc;
        return a.nazwa < b.nazwa;
    });
    for (const Druzyna &d : v) {
        cout << d.nazwa << ": moc " << d.moc << ", liderzy: ";
        for (int j = 0; j < (int)d.sklad.size() && j < 3; j++) {
            if (j > 0) cout << ", ";
            cout << d.sklad[j].imie;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-banki', krok: 8, level: 'srednie',
            title: 'Przelewy między kontami',
            short: 'map<string, Konto> — imię prowadzi do całej struktury z saldem i licznikiem operacji. konta[imie].saldo zmienia pole w środku mapy.',
            tags: ['map<string, Konto>', 'pole struktury w mapie', 'raport alfabetyczny'],
            statement: ['Mały bank obsługuje q operacji (kwoty w groszach): WPLATA imie x, WYPLATA imie x i PRZELEW a b x (z konta a na konto b). Każde imię, które pojawi się w operacji, ma konto, zaczynające z saldem 0.',
                'Wypłata i przelew udają się tylko wtedy, gdy na koncie (a) jest co najmniej x — inaczej nic się nie zmienia i wypisz odrzucono: OPERACJA (cały wiersz polecenia). Udana operacja zwiększa licznik operacji każdego konta, którego dotyczy (przelew — obu). Na końcu wypisz raport: wszystkie konta alfabetycznie — imię, saldo w złotych i liczba udanych operacji.',
                'Zadeklaruj struct Konto { long long saldo = 0; int operacji = 0; }; i użyj map<string, Konto>.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedna operacja.'],
            output_format: ['Komunikaty o odrzuceniach (w kolejności), a potem po jednym wierszu na konto: IMIE Z.GG, operacji K.'],
            constraints: ['1 ≤ q ≤ 1000', 'Imiona mają od 1 do 15 liter (pierwsza wielka); w przelewie a ≠ b.', '1 ≤ x ≤ 10⁸'],
            examples: [{ input: '5\nWPLATA Ola 10000\nPRZELEW Ola Kuba 2550\nWYPLATA Kuba 3000\nPRZELEW Kuba Iga 2550\nWYPLATA Iga 1', note: 'Kuba ma tylko 25.50, więc wypłata 30.00 jest odrzucona. Przelew całych 25.50 do Igi się udaje. Ola: 2 operacje, Kuba: 2 (dostał przelew, wysłał przelew), Iga: 2.' }],
            hint: R`map<string, Konto> konta; — konta[imie] tworzy konto z wartościami domyślnymi, gdy go jeszcze nie ma. Przelew: if (konta[a].saldo >= x) { konta[a].saldo -= x; konta[b].saldo += x; konta[a].operacji++; konta[b].operacji++; } — ale najpierw „dotknij” konta b (konta[b];), żeby powstało także przy odrzuceniu.`,
            tests: (r) => {
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                const los = (q, osob, m) => { const O = unikalneImiona(r, osob); return Array.from({ length: q }, () => { const p = r(); const a = r.pick(O); if (p < 0.35) return `WPLATA ${a} ${r.int(1, m)}`; if (p < 0.6) return `WYPLATA ${a} ${r.int(1, m)}`; let b = r.pick(O); if (b === a) b = O[(O.indexOf(a) + 1) % O.length]; if (b === a) return `WPLATA ${a} ${r.int(1, m)}`; return `PRZELEW ${a} ${b} ${r.int(1, m)}`; }); };
                return [d(['WYPLATA Ala 1']), d(['WPLATA Ola 99999999', 'PRZELEW Ola Ela 99999999', 'PRZELEW Ela Ola 100000000', 'PRZELEW Ela Ola 99999999', 'WYPLATA Ola 99999999', 'WYPLATA Ola 1']), d(los(20, 4, 5000)), d(los(1000, 50, 100000000)), d(los(800, 6, 300))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => { const t = l.split(' '); if ((t[0] === 'WPLATA' || t[0] === 'WYPLATA') && t.length === 3) return czyImie(t[1], 15) && calk(Number(t[2]), 1, 1e8); return t[0] === 'PRZELEW' && t.length === 4 && czyImie(t[1], 15) && czyImie(t[2], 15) && t[1] !== t[2] && calk(Number(t[3]), 1, 1e8); }) ? null : 'operacja';
            },
            solve: (inp) => {
                const K = new Map(); const k = (n) => { if (!K.has(n)) K.set(n, { s: 0, o: 0 }); return K.get(n); }; const out = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'WPLATA') { const a = k(t[1]); a.s += Number(t[2]); a.o++; }
                    else if (t[0] === 'WYPLATA') { const a = k(t[1]); const x = Number(t[2]); if (a.s >= x) { a.s -= x; a.o++; } else out.push(`odrzucono: ${l}`); }
                    else { const a = k(t[1]), b = k(t[2]); const x = Number(t[3]); if (a.s >= x) { a.s -= x; b.s += x; a.o++; b.o++; } else out.push(`odrzucono: ${l}`); }
                }
                return [...out, ...[...K.keys()].sort(cmpS).map((n) => `${n} ${zl(K.get(n).s)}, operacji ${K.get(n).o}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Konto {
    long long saldo = 0;
    int operacji = 0;
};
int main() {
    int q;
    cin >> q;
    map<string, Konto> konta;
    for (int i = 0; i < q; i++) {
        string op;
        cin >> op;
        if (op == "WPLATA") {
            string a;
            long long x;
            cin >> a >> x;
            konta[a].saldo += x;
            konta[a].operacji++;
        } else if (op == "WYPLATA") {
            string a;
            long long x;
            cin >> a >> x;
            if (konta[a].saldo >= x) {
                konta[a].saldo -= x;
                konta[a].operacji++;
            } else {
                cout << "odrzucono: WYPLATA " << a << " " << x << "\n";
            }
        } else {
            string a, b;
            long long x;
            cin >> a >> b >> x;
            konta[b];
            if (konta[a].saldo >= x) {
                konta[a].saldo -= x;
                konta[b].saldo += x;
                konta[a].operacji++;
                konta[b].operacji++;
            } else {
                cout << "odrzucono: PRZELEW " << a << " " << b << " " << x << "\n";
            }
        }
    }
    for (auto &[imie, k] : konta) {
        cout << imie << " " << k.saldo / 100 << "." << setw(2) << setfill('0') << k.saldo % 100;
        cout << ", operacji " << k.operacji << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-scalanie-przedzialow', krok: 8, level: 'srednie',
            title: 'Scalanie przedziałów',
            short: 'Przedziały jako struktury, posortowane po początku. Idziesz od lewej i doklejasz każdy, który zachodzi na bieżący — klasyka olimpiad.',
            tags: ['struct Przedzial', 'sort po początku', 'scalanie w jednym przejściu'],
            statement: ['Malarz pomalował na płocie n pasów; pas to przedział [a, b] na osi (a < b). Pasy mogą na siebie zachodzić albo się stykać. Wypisz pomalowane kawałki płotu po scaleniu: przedziały, które mają choć jeden wspólny punkt (także tylko koniec), łączą się w jeden. Wypisz je od lewej i na końcu łączną pomalowaną długość.',
                'Zadeklaruj struct Przedzial { int a, b; }, posortuj vector przedziałów po a i przejdź po nim raz, trzymając bieżący scalony przedział.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy a i b.'],
            output_format: ['Scalone przedziały A B (po jednym w wierszu, od lewej), a potem wiersz pomalowane: L.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ a < b ≤ 10⁹'],
            examples: [{ input: '5\n6 9\n1 3\n2 5\n9 10\n12 14', note: 'Po sortowaniu: [1, 3] i [2, 5] zachodzą na siebie → [1, 5]. [6, 9] i [9, 10] stykają się w 9 → [6, 10]. [12, 14] jest osobno. Długość: 4 + 4 + 2 = 10.' }],
            hint: R`Po sortowaniu: Przedzial cur = v[0]; for (int i = 1; i < n; i++) { if (v[i].a <= cur.b) cur.b = max(cur.b, v[i].b); else { wypisz(cur); cur = v[i]; } } — i na końcu wypisz ostatni cur. Długość sumuj w long long: przedziały sięgają 2 · 10⁹.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m, dl) => Array.from({ length: n }, () => { const a = r.int(-m, m - 1); return [a, Math.min(m, a + r.int(1, dl))]; });
                return [d([[0, 1]]), d([[-1e9, 1e9], [0, 5], [-1e9, -999999999]]), d([[1, 2], [2, 3], [3, 4], [5, 6], [7, 8], [8, 9]]), d(los(15, 30, 5)), d(los(2000, 1e9, 1e6)), d(los(2000, 100000, 60)), d(los(1000, 10, 3))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 2000) || t.length !== 1 + 2 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 2) if (!calk(t[i], -1e9, 1e9) || !calk(t[i + 1], -1e9, 1e9) || t[i] >= t[i + 1]) return 'przedzial'; return null; },
            solve: (inp) => {
                const t = nums(inp); const v = []; for (let i = 1; i < t.length; i += 2) v.push([t[i], t[i + 1]]);
                v.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
                const o = []; let cur = v[0].slice(), S = 0;
                for (const x of v.slice(1)) { if (x[0] <= cur[1]) cur[1] = Math.max(cur[1], x[1]); else { o.push(cur.join(' ')); S += cur[1] - cur[0]; cur = x.slice(); } }
                o.push(cur.join(' ')); S += cur[1] - cur[0];
                o.push(`pomalowane: ${S}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Przedzial {
    int a, b;
};
int main() {
    int n;
    cin >> n;
    vector<Przedzial> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].a >> v[i].b;
    sort(v.begin(), v.end(), [](const Przedzial &x, const Przedzial &y) {
        if (x.a != y.a) return x.a < y.a;
        return x.b < y.b;
    });
    long long razem = 0;
    Przedzial cur = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i].a <= cur.b) {
            cur.b = max(cur.b, v[i].b);
        } else {
            cout << cur.a << " " << cur.b << "\n";
            razem += (long long)cur.b - cur.a;
            cur = v[i];
        }
    }
    cout << cur.a << " " << cur.b << "\n";
    razem += (long long)cur.b - cur.a;
    cout << "pomalowane: " << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'st-najwiecej-naraz', krok: 8, level: 'srednie',
            title: 'Najwięcej osób naraz',
            short: 'Każde wejście i wyjście to zdarzenie {czas, zmiana}. Sortujesz zdarzenia — wyjścia przed wejściami o tej samej minucie — i liczysz na bieżąco.',
            tags: ['struct Zdarzenie', 'sort zdarzeń z remisami', 'zamiatanie'],
            statement: ['W muzeum było n zwiedzających; każdy wszedł o godzinie WE i wyszedł o godzinie WY (WE < WY, obie HH:MM tego samego dnia). Osoba jest w muzeum od minuty WE do minuty tuż przed WY — kto wychodzi o 12:00, nie spotyka się z kimś, kto wchodzi o 12:00.',
                'Wypisz największą liczbę osób przebywających naraz w muzeum, godzinę, o której ta liczba pojawiła się pierwszy raz, i ile minut łącznie w ciągu dnia w muzeum była taka liczba osób. Każde wejście i wyjście zamień na zdarzenie struct Zdarzenie { int czas, zmiana; } (+1 albo −1) i posortuj je po czasie, a przy równym czasie wyjścia (−1) przed wejściami (+1).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy godziny wejścia i wyjścia HH:MM HH:MM.'],
            output_format: ['Trzy wiersze: najwiecej: K, pierwszy raz o HH:MM i przez M minut.'],
            constraints: ['1 ≤ n ≤ 2000'],
            examples: [{ input: '4\n10:00 12:00\n11:00 13:30\n12:00 12:30\n11:45 11:50', note: 'Od 11:45 do 11:50 w muzeum są trzy osoby — 5 minut. O 12:00 jedna osoba wychodzi i jedna wchodzi, więc są dwie, nie trzy.' }],
            hint: R`Zdarzenia: v.push_back({we, +1}); v.push_back({wy, -1});. Komparator: if (a.czas != b.czas) return a.czas < b.czas; return a.zmiana < b.zmiana; (−1 przed +1). Idąc po zdarzeniach, trzymaj liczbę osób; czas między zdarzeniem i a i + 1 (v[i + 1].czas − v[i].czas) dolicz do „minut z maksimum”, jeśli po zdarzeniu i liczba osób równa się maksimum.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${hhmm(x)} ${hhmm(y)}`).join('\n')}`;
                const los = (n, lo, hi, dl) => Array.from({ length: n }, () => { const a = r.int(lo, hi - 1); return [a, Math.min(hi, a + r.int(1, dl))]; });
                return [d([[0, 1439]]), d([[600, 720], [720, 780], [600, 720], [700, 721]]), d(los(10, 600, 720, 60)), d(los(2000, 0, 1439, 300)), d(los(2000, 600, 660, 5)), d(Array.from({ length: 500 }, () => [600, 660]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const m = l.match(/^(\d\d):(\d\d) (\d\d):(\d\d)$/); if (!m) return false; const a = Number(m[1]) * 60 + Number(m[2]), b = Number(m[3]) * 60 + Number(m[4]); return Number(m[1]) < 24 && Number(m[3]) < 24 && Number(m[2]) < 60 && Number(m[4]) < 60 && a < b; }) ? null : 'dane';
            },
            solve: (inp) => {
                const e = [];
                for (const l of linie(inp).slice(1)) { const [a, b] = l.split(' ').map((g) => { const [x, y] = g.split(':').map(Number); return x * 60 + y; }); e.push([a, 1], [b, -1]); }
                e.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
                let c = 0, mx = 0, kiedy = 0;
                for (const [t, z] of e) { c += z; if (c > mx) { mx = c; kiedy = t; } }
                c = 0; let min = 0;
                for (let i = 0; i < e.length; i++) { c += e[i][1]; if (c === mx && i + 1 < e.length) min += e[i + 1][0] - e[i][0]; }
                return `najwiecej: ${mx}\npierwszy raz o ${hhmm(kiedy)}\nprzez ${min} minut`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zdarzenie {
    int czas, zmiana;
};
int main() {
    int n;
    cin >> n;
    vector<Zdarzenie> v;
    char dwukropek;
    for (int i = 0; i < n; i++) {
        int h1, m1, h2, m2;
        cin >> h1 >> dwukropek >> m1 >> h2 >> dwukropek >> m2;
        v.push_back({h1 * 60 + m1, +1});
        v.push_back({h2 * 60 + m2, -1});
    }
    sort(v.begin(), v.end(), [](const Zdarzenie &a, const Zdarzenie &b) {
        if (a.czas != b.czas) return a.czas < b.czas;
        return a.zmiana < b.zmiana;
    });
    int teraz = 0, najwiecej = 0, kiedy = 0;
    for (const Zdarzenie &z : v) {
        teraz += z.zmiana;
        if (teraz > najwiecej) {
            najwiecej = teraz;
            kiedy = z.czas;
        }
    }
    teraz = 0;
    int minut = 0;
    for (int i = 0; i + 1 < (int)v.size(); i++) {
        teraz += v[i].zmiana;
        if (teraz == najwiecej) minut += v[i + 1].czas - v[i].czas;
    }
    cout << "najwiecej: " << najwiecej << "\n";
    cout << "pierwszy raz o " << setfill('0') << setw(2) << kiedy / 60 << ":" << setw(2) << kiedy % 60 << "\n";
    cout << "przez " << minut << " minut\n";
    return 0;
}`,
        },
        {
            id: 'st-konferencja', krok: 8, level: 'srednie',
            title: 'Konferencja',
            short: 'Jak wysłuchać jak najwięcej wykładów? Sortujesz je po godzinie końca i bierzesz zachłannie każdy, który się zmieści — struktura trzyma start i koniec razem.',
            tags: ['sort po końcu', 'algorytm zachłanny', 'struct Wyklad'],
            statement: ['Na konferencji jest n wykładów; każdy ma nazwę, początek i koniec (HH:MM, początek przed końcem). Ola chce wysłuchać jak najwięcej całych wykładów, a nie da się być na dwóch naraz. Nowy wykład może zacząć się dokładnie wtedy, gdy poprzedni się kończy.',
                'Wypisz największą możliwą liczbę wykładów oraz najwcześniejszą godzinę, o której Ola może skończyć ostatni z nich przy takiej największej liczbie. Sposób: posortuj wykłady po godzinie końca i idź po kolei — bierz każdy wykład, który zaczyna się nie wcześniej, niż skończył się ostatni wzięty. Taki wybór daje najwięcej wykładów i kończy każdy kolejny tak wcześnie, jak się da.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa, początek i koniec.'],
            output_format: ['Dwa wiersze: wykladow: K i ostatni konczy sie o HH:MM.'],
            constraints: ['1 ≤ n ≤ 2000', 'Nazwy mają od 1 do 20 znaków (małe litery i _).'],
            examples: [{ input: '5\ngrafy 09:00 10:30\nsortowanie 09:30 10:00\nstruktury 10:00 11:00\nrekurencja 10:30 11:30\ndp 11:00 12:00', note: 'Po sortowaniu po końcu: sortowanie (10:00), grafy (10:30), struktury (11:00), rekurencja (11:30), dp (12:00). Bierzemy sortowanie, struktury i dp — trzy wykłady, ostatni kończy się o 12:00.' }],
            hint: R`struct Wyklad { string nazwa; int start, koniec; };. Komparator: return a.koniec < b.koniec;. Potem int ile = 0, ostatni = -1; for (const Wyklad &w : v) if (w.start >= ostatni) { ile++; ostatni = w.koniec; }. Nazwy nie są potrzebne do wyniku — ale tak wyglądają prawdziwe dane.`,
            tests: (r) => {
                const NZ = ['grafy', 'sortowanie', 'struktury', 'rekurencja', 'dp', 'geometria', 'teoria_liczb', 'kombinatoryka', 'drzewa', 'napisy', 'hashowanie', 'bity', 'przeplyw', 'kopce', 'zachlanne'];
                const d = (a) => `${a.length}\n${a.map(([n, x, y]) => `${n} ${hhmm(x)} ${hhmm(y)}`).join('\n')}`;
                const los = (n, lo, hi, dl) => Array.from({ length: n }, () => { const a = r.int(lo, hi - 1); return [r.pick(NZ), a, Math.min(hi, a + r.int(1, dl))]; });
                return [d([['a', 0, 1]]), d([['a', 600, 660], ['b', 660, 720], ['c', 630, 690], ['d', 0, 1439]]), d(los(12, 480, 1080, 120)), d(los(2000, 0, 1439, 200)), d(los(2000, 600, 700, 3)), d(los(300, 0, 1439, 1439))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const m = l.match(/^([a-z_]{1,20}) (\d\d):(\d\d) (\d\d):(\d\d)$/); if (!m) return false; const a = Number(m[2]) * 60 + Number(m[3]), b = Number(m[4]) * 60 + Number(m[5]); return Number(m[2]) < 24 && Number(m[4]) < 24 && Number(m[3]) < 60 && Number(m[5]) < 60 && a < b; }) ? null : 'dane';
            },
            solve: (inp) => {
                const v = linie(inp).slice(1).map((l) => { const [, a, b] = l.split(' '); const f = (g) => { const [x, y] = g.split(':').map(Number); return x * 60 + y; }; return [f(a), f(b)]; });
                v.sort((x, y) => x[1] - y[1]);
                let ile = 0, ost = -1;
                for (const [a, b] of v) if (a >= ost) { ile++; ost = b; }
                return `wykladow: ${ile}\nostatni konczy sie o ${hhmm(ost)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Wyklad {
    string nazwa;
    int start, koniec;
};
int main() {
    int n;
    cin >> n;
    vector<Wyklad> v(n);
    char dwukropek;
    for (int i = 0; i < n; i++) {
        int h1, m1, h2, m2;
        cin >> v[i].nazwa >> h1 >> dwukropek >> m1 >> h2 >> dwukropek >> m2;
        v[i].start = h1 * 60 + m1;
        v[i].koniec = h2 * 60 + m2;
    }
    sort(v.begin(), v.end(), [](const Wyklad &a, const Wyklad &b) {
        return a.koniec < b.koniec;
    });
    int ile = 0, ostatni = -1;
    for (const Wyklad &w : v) {
        if (w.start >= ostatni) {
            ile++;
            ostatni = w.koniec;
        }
    }
    cout << "wykladow: " << ile << "\n";
    cout << "ostatni konczy sie o " << setfill('0') << setw(2) << ostatni / 60 << ":" << setw(2) << ostatni % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'st-wyciag', krok: 8, level: 'srednie',
            title: 'Narciarze i trasy',
            short: 'Pytania sortujesz razem z ich numerami, odpowiadasz po kolei rosnąco, a wyniki odkładasz do tablicy pod numerem pytania — i wypisujesz w kolejności z wejścia.',
            tags: ['zapytania z polem nr', 'dwa sortowania i dwa wskaźniki', 'odpowiedzi w tablicy'],
            statement: ['Ośrodek narciarski ma n tras; każda ma nazwę i trudność. W kolejce do wyciągu stoi q narciarzy; każdy ma imię i umiejętności s — może zjechać każdą trasą o trudności nie większej niż s.',
                'Dla każdego narciarza (w kolejności z kolejki) wypisz, iloma trasami może zjechać, i najtrudniejszą z nich (przy kilku trasach o tej samej największej trudności — tę, której nazwa jest pierwsza alfabetycznie). Polecany sposób: struct Narciarz { string imie; int s, nr; }, posortuj trasy po trudności (i nazwie), a narciarzy po s; idź po narciarzach i dokładaj kolejne trasy, a odpowiedź zapisz w tablicy pod numerem nr narciarza.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy: nazwa trasy i trudność.', 'Potem wiersz z q i q wierszy: imię narciarza i jego umiejętności.'],
            output_format: ['q wierszy: IMIE: K tras, najtrudniejsza NAZWA albo IMIE: 0 tras.'],
            constraints: ['1 ≤ n ≤ 2000, 1 ≤ q ≤ 500', 'Nazwy tras mają od 1 do 15 małych liter, imiona od 1 do 15 liter (pierwsza wielka).', '1 ≤ trudność, s ≤ 10⁹'],
            examples: [{ input: '4\nbiala 10\nczarna 40\nczerwona 25\nzielona 10\n3\nOla 30\nKuba 5\nIga 40', note: 'Ola zjedzie trasami o trudności 10, 10 i 25 — najtrudniejsza czerwona. Kuba nie zjedzie żadną. Iga — wszystkimi czterema.' }],
            hint: R`Trasy posortuj po (trudność, nazwa). Narciarzy z nr = i posortuj po s. Wskaźnik j przesuwaj, dopóki trasy[j].trudnosc <= s — wtedy liczba tras to j, a najtrudniejsza to pierwsza trasa o trudności trasy[j - 1].trudnosc (zapamiętuj ją, gdy trudność rośnie). Wynik: odp[n.nr] = …. Wypisz odp po kolei.`,
            tests: (r) => {
                const d = (t, n) => `${t.length}\n${t.map((x) => x.join(' ')).join('\n')}\n${n.length}\n${n.map((x) => x.join(' ')).join('\n')}`;
                const trasy = (n, m) => Array.from({ length: n }, () => [r.word(r.int(3, 10)), r.int(1, m)]);
                const nar = (q, m) => Array.from({ length: q }, () => [imie(r), r.int(1, m)]);
                return [d([['a', 5]], [['Ala', 4], ['Ola', 5]]), d([['b', 7], ['a', 7], ['c', 3], ['d', 7]], [['X', 7], ['Y', 6], ['Z', 1000000000]]), d(trasy(12, 50), nar(10, 60)), d(trasy(2000, 1e9), nar(500, 1e9)), d(trasy(2000, 30), nar(500, 35))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000)) return 'n';
                if (!L.slice(1, n + 1).every((l) => { const t = l.split(' '); return t.length === 2 && czyMale(t[0], 15) && calk(Number(t[1]), 1, 1e9); })) return 'trasa';
                const q = Number(L[n + 1]); if (!calk(q, 1, 500) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const t = l.split(' '); return t.length === 2 && czyImie(t[0], 15) && calk(Number(t[1]), 1, 1e9); }) ? null : 'narciarz';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const t = sortuj(L.slice(1, n + 1).map((l) => { const x = l.split(' '); return [x[0], Number(x[1])]; }), (x) => [x[1], x[0]]);
                return L.slice(n + 2).map((l) => {
                    const [im, s] = l.split(' '); const sv = Number(s);
                    let k = 0; while (k < t.length && t[k][1] <= sv) k++;
                    if (!k) return `${im}: 0 tras`;
                    let j = k - 1; while (j > 0 && t[j - 1][1] === t[k - 1][1]) j--;
                    return `${im}: ${k} tras, najtrudniejsza ${t[j][0]}`;
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Trasa {
    string nazwa;
    int trudnosc;
};
struct Narciarz {
    string imie;
    int s, nr;
};
int main() {
    int n;
    cin >> n;
    vector<Trasa> t(n);
    for (int i = 0; i < n; i++) cin >> t[i].nazwa >> t[i].trudnosc;
    int q;
    cin >> q;
    vector<Narciarz> v(q);
    for (int i = 0; i < q; i++) {
        cin >> v[i].imie >> v[i].s;
        v[i].nr = i;
    }
    sort(t.begin(), t.end(), [](const Trasa &a, const Trasa &b) {
        if (a.trudnosc != b.trudnosc) return a.trudnosc < b.trudnosc;
        return a.nazwa < b.nazwa;
    });
    sort(v.begin(), v.end(), [](const Narciarz &a, const Narciarz &b) {
        return a.s < b.s;
    });
    vector<string> odp(q);
    int j = 0, najtrudniejsza = -1;
    for (const Narciarz &x : v) {
        while (j < n && t[j].trudnosc <= x.s) {
            if (najtrudniejsza == -1 || t[j].trudnosc > t[najtrudniejsza].trudnosc) najtrudniejsza = j;
            j++;
        }
        if (j == 0) odp[x.nr] = x.imie + ": 0 tras";
        else odp[x.nr] = x.imie + ": " + to_string(j) + " tras, najtrudniejsza " + t[najtrudniejsza].nazwa;
    }
    for (int i = 0; i < q; i++) cout << odp[i] << "\n";
    return 0;
}`,
        },
    ];
};
