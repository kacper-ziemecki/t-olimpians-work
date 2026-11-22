// Struct — ćwiczenia w trakcie lekcji, części 4–6: struktury w funkcjach (parametr jako kopia, & i const &, funkcja
// zwracająca strukturę, kilka wyników naraz), sortowanie struktur (komparator, kilka kryteriów, remisy, numery sprzed
// sortowania, miejsca ex aequo) oraz metody, wartości domyślne pól i konstruktory.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./struct-pomoc');
    const { IMIONA, NAZWISKA, calk, zlote, pad2, hhmm, mmss, dataTxt, losData, unikalneImiona, unikalneSlowa, sortuj, skrocB, ulTxt, nwdB } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const imie = (r) => r.pick(IMIONA);
    const czyImie = (s, max) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const czyMale = (s, max) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const zl = (g) => zlote(g, '.');
    // Zamek szyfrowy (st-zamek-szyfrowy): symulacja poleceń — wzorcówka i generator testów.
    function symuluj(kod0, pol) {
        let kod = kod0, otwarty = false, zabl = false, bl = 0; const o = [];
        for (const l of pol) {
            const t = l.split(' ');
            if (t[0] === 'WPISZ') {
                if (zabl) o.push('zablokowany');
                else if (otwarty) o.push('juz otwarty');
                else if (t[1] === kod) { otwarty = true; bl = 0; o.push('otwarty'); }
                else { bl++; if (bl === 3) { zabl = true; o.push('zly kod, zamek zablokowany'); } else o.push('zly kod'); }
            } else if (t[0] === 'ZAMKNIJ') { if (otwarty) { otwarty = false; o.push('zamkniety'); } else o.push('juz zamkniety'); }
            else if (t[0] === 'ZMIEN') { if (otwarty && t[1] === kod) { kod = t[2]; o.push('kod zmieniony'); } else o.push('odmowa'); }
            else if (t[0] === 'ODBLOKUJ') { zabl = false; bl = 0; o.push('odblokowany'); }
            else o.push(zabl ? 'zablokowany' : otwarty ? 'otwarty' : 'zamkniety');
        }
        return { o, kod, otwarty };
    }

    return [
        // ================================================================ KROK 4 · struktury w funkcjach
        {
            id: 'st-trasa-kuriera', krok: 4, level: 'latwe',
            title: 'Trasa kuriera',
            short: 'Funkcja int odleglosc(Punkt a, Punkt b) dostaje dwa punkty i oddaje odległość. Długość trasy i najdłuższy odcinek.',
            tags: ['funkcja z parametrami Punkt', 'odległość taksówkowa', 'long long'],
            statement: ['Kurier jeździ po mieście o prostokątnej siatce ulic i odwiedza n punktów w podanej kolejności. Między dwoma punktami jedzie najkrótszą drogą po ulicach, czyli |x₁ − x₂| + |y₁ − y₂| kwartałów.',
                'Napisz funkcję long long odleglosc(Punkt a, Punkt b) i użyj jej, żeby policzyć długość całej trasy oraz znaleźć najdłuższy odcinek (od punktu i do punktu i + 1, punkty numerujemy od 1). Przy remisie wybierz odcinek, który jest wcześniej.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy współrzędne x i y punktu.'],
            output_format: ['Dwa wiersze: trasa: D i najdluzszy odcinek: I -> J (D).'],
            constraints: ['2 ≤ n ≤ 1000', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '4\n0 0\n3 4\n-2 4\n-2 -3', note: 'Odcinki: 7, 5 i 7 — razem 19. Najdłuższe są pierwszy i trzeci; wygrywa wcześniejszy (1 → 2).' }],
            hint: R`long long odleglosc(Punkt a, Punkt b) { return llabs(a.x - b.x) + llabs(a.y - b.y); } — współrzędne do 10⁹, więc różnica może mieć 2 · 10⁹ i pola Punkt muszą być long long. W main: vector<Punkt> v(n); i pętla po i od 0 do n − 2 z odleglosc(v[i], v[i + 1]).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m)]);
                return [d([[0, 0], [0, 0]]), d([[-1e9, -1e9], [1e9, 1e9], [-1e9, -1e9]]), d(los(10, 10)), d(los(1000, 1e9)), d(los(500, 3))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 2, 1000) && t.length === 1 + 2 * t[0] && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const n = t[0];
                const p = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]);
                let suma = 0, best = -1, bi = 0;
                for (let i = 0; i + 1 < n; i++) { const dd = P.manh(p[i], p[i + 1]); suma += dd; if (dd > best) { best = dd; bi = i; } }
                return `trasa: ${suma}\nnajdluzszy odcinek: ${bi + 1} -> ${bi + 2} (${best})`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    long long x, y;
};
long long odleglosc(Punkt a, Punkt b) {
    return llabs(a.x - b.x) + llabs(a.y - b.y);
}
int main() {
    int n;
    cin >> n;
    vector<Punkt> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].x >> v[i].y;
    long long trasa = 0, najdluzszy = -1;
    int skad = 0;
    for (int i = 0; i + 1 < n; i++) {
        long long d = odleglosc(v[i], v[i + 1]);
        trasa += d;
        if (d > najdluzszy) {
            najdluzszy = d;
            skad = i;
        }
    }
    cout << "trasa: " << trasa << "\n";
    cout << "najdluzszy odcinek: " << skad + 1 << " -> " << skad + 2 << " (" << najdluzszy << ")\n";
    return 0;
}`,
        },
        {
            id: 'st-srodek-odcinka', krok: 4, level: 'latwe',
            title: 'Środek odcinka',
            short: 'Funkcja zwraca strukturę: PunktD srodek(Punkt a, Punkt b). Środek może mieć połówki, więc wynik trzyma współrzędne w double.',
            tags: ['funkcja zwracająca strukturę', 'double w polach', 'setprecision(1)'],
            statement: ['Dla każdego z q odcinków podanych końcami A i B wypisz środek odcinka. Środek ma współrzędne ((xA + xB) / 2, (yA + yB) / 2) — mogą to być połówki.',
                'Końce trzymaj w strukturze Punkt { long long x, y; }, a wynik — w drugiej strukturze PunktD { double x, y; }. Napisz funkcję PunktD srodek(Punkt a, Punkt b), która oddaje cały środek naraz. Współrzędne wypisuj z jedną cyfrą po kropce.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy cztery liczby: xA yA xB yB.'],
            output_format: ['q wierszy: współrzędne środka z jedną cyfrą po kropce, oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁹ ≤ każda współrzędna ≤ 10⁹'],
            examples: [{ input: '3\n0 0 4 2\n1 1 2 2\n-5 3 2 -3', note: 'Środki: (2, 1), (1.5, 1.5) i (−1.5, 0).' }],
            hint: R`PunktD srodek(Punkt a, Punkt b) { PunktD s; s.x = (a.x + b.x) / 2.0; s.y = (a.y + b.y) / 2.0; return s; } — dzielenie przez 2.0, a nie przez 2, bo inaczej połówka by zginęła. Wypisuj: cout << fixed << setprecision(1) << s.x << " " << s.y << "\n";.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m), r.int(-m, m), r.int(-m, m)]);
                return [d([[0, 0, 0, 0], [1, -1, 0, 0], [-1, 1, 0, 0]]), d([[1e9, 1e9, 1e9 - 1, -1e9], [-1e9, -1e9, -1e9, -1e9 + 1]]), d(los(20, 10)), d(los(1000, 1e9)), d(los(300, 2))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === 1 + 4 * t[0] && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const o = [];
                for (let i = 0; i < t[0]; i++) { const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i); o.push(`${((a + c) / 2).toFixed(1)} ${((b + d) / 2).toFixed(1)}`); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    long long x, y;
};
struct PunktD {
    double x, y;
};
PunktD srodek(Punkt a, Punkt b) {
    PunktD s;
    s.x = (a.x + b.x) / 2.0;
    s.y = (a.y + b.y) / 2.0;
    return s;
}
int main() {
    int q;
    cin >> q;
    cout << fixed << setprecision(1);
    for (int i = 0; i < q; i++) {
        Punkt a, b;
        cin >> a.x >> a.y >> b.x >> b.y;
        PunktD s = srodek(a, b);
        cout << s.x << " " << s.y << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-plan-dnia', krok: 4, level: 'latwe',
            title: 'Plan dnia',
            short: 'Czas dodaj(Czas c, int minuty) i void wypisz(Czas c) — dwie małe funkcje, a z nich cały harmonogram zajęć.',
            tags: ['funkcja zwracająca Czas', 'funkcja wypisująca', 'modulo 24 h'],
            statement: ['Ola planuje dzień. Zaczyna o podanej godzinie i robi kolejno n rzeczy — każda ma nazwę i czas trwania w minutach; następna zaczyna się dokładnie wtedy, gdy kończy się poprzednia. Zegar jest 24-godzinny: po 23:59 jest 00:00.',
                'Wypisz harmonogram: dla każdej czynności godzinę początku i końca w formacie HH:MM-HH:MM i nazwę, a na końcu godzinę zakończenia całego planu. Napisz funkcje Czas dodaj(Czas c, int minuty) oraz void wypisz(Czas c).'],
            input_format: ['W pierwszym wierszu godzina startu HH:MM i n.', 'W każdym z n kolejnych wierszy nazwa czynności i liczba minut.'],
            output_format: ['n wierszy HH:MM-HH:MM nazwa i wiersz koniec: HH:MM.'],
            constraints: ['1 ≤ n ≤ 1000', 'Nazwy mają od 1 do 20 znaków (małe litery i _).', '1 ≤ minuty ≤ 600'],
            examples: [{ input: '07:30 4\nsniadanie 25\nszkola 400\nobiad 45\ntrening 90', note: '07:30 + 25 min = 07:55, potem 400 minut szkoły do 14:35, obiad do 15:20 i trening do 16:50.' }],
            hint: R`Czas dodaj(Czas c, int minuty) { int t = (c.h * 60 + c.m + minuty) % (24 * 60); Czas w; w.h = t / 60; w.m = t % 60; return w; }. W pętli: Czas koniec = dodaj(teraz, ile); wypisz(teraz); cout << "-"; wypisz(koniec); … i na koniec obrotu teraz = koniec;.`,
            tests: (r) => {
                const ZAJ = ['sniadanie', 'szkola', 'obiad', 'trening', 'lekcje', 'spacer', 'czytanie', 'kolacja', 'gra', 'basen', 'programowanie', 'sen', 'zakupy', 'muzyka', 'odrabianie_lekcji'];
                const d = (st, a) => `${hhmm(st)} ${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.pick(ZAJ), r.int(1, m)]);
                return [d(0, [['sen', 1]]), d(23 * 60 + 59, [['sen', 1], ['sen', 600], ['sen', 600], ['sen', 600]]), d(r.int(0, 1439), los(12, 120)), d(r.int(0, 1439), los(1000, 600)), d(r.int(0, 1439), los(200, 5))];
            },
            check: (inp) => {
                const L = linie(inp); const m = L[0].match(/^(\d\d):(\d\d) (\d+)$/); if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return 'start';
                const n = Number(m[3]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 2 && /^[a-z_]{1,20}$/.test(t[0]) && calk(Number(t[1]), 1, 600); }) ? null : 'dane';
            },
            solve: (inp) => {
                const L = linie(inp); const [g, mi] = L[0].split(' ')[0].split(':').map(Number);
                let t = g * 60 + mi; const o = [];
                for (const l of L.slice(1)) { const [na, x] = l.split(' '); const k = (t + Number(x)) % 1440; o.push(`${hhmm(t)}-${hhmm(k)} ${na}`); t = k; }
                o.push(`koniec: ${hhmm(t)}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Czas {
    int h, m;
};
Czas dodaj(Czas c, int minuty) {
    int t = (c.h * 60 + c.m + minuty) % (24 * 60);
    Czas w;
    w.h = t / 60;
    w.m = t % 60;
    return w;
}
void wypisz(Czas c) {
    cout << setfill('0') << setw(2) << c.h << ":" << setw(2) << c.m;
}
int main() {
    Czas teraz;
    char dwukropek;
    int n;
    cin >> teraz.h >> dwukropek >> teraz.m >> n;
    for (int i = 0; i < n; i++) {
        string nazwa;
        int ile;
        cin >> nazwa >> ile;
        Czas koniec = dodaj(teraz, ile);
        wypisz(teraz);
        cout << "-";
        wypisz(koniec);
        cout << " " << nazwa << "\n";
        teraz = koniec;
    }
    cout << "koniec: ";
    wypisz(teraz);
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'st-skracanie-ulamkow', krok: 4, level: 'latwe',
            title: 'Skracanie ułamków',
            short: 'Ulamek skroc(Ulamek u) — funkcja dostaje ułamek i oddaje nowy, skrócony, z dodatnim mianownikiem. NWD z lekcji o rekurencji.',
            tags: ['funkcja zwracająca Ulamek', 'NWD', 'znak w mianowniku'],
            statement: ['Dla każdego z t ułamków l/m wypisz ułamek skrócony do postaci nieskracalnej, w której mianownik jest dodatni. Ułamek równy zero wypisz jako 0/1.',
                'Napisz funkcję Ulamek skroc(Ulamek u), która oddaje skrócony ułamek (oraz pomocniczą funkcję long long nwd(long long a, long long b)). Minus może stać w liczniku, w mianowniku albo w obu — zawsze przenieś go do licznika.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby l i m.'],
            output_format: ['t wierszy w formacie l/m.'],
            constraints: ['1 ≤ t ≤ 500', '−10¹⁸ ≤ l ≤ 10¹⁸, 1 ≤ |m| ≤ 10¹⁸'],
            examples: [{ input: '4\n6 8\n-10 -4\n7 -21\n0 -5', note: '6/8 = 3/4, −10/−4 = 5/2, 7/−21 = −1/3, a 0/−5 = 0/1.' }],
            hint: R`Najpierw znak: if (u.m < 0) { u.l = -u.l; u.m = -u.m; }. Potem long long g = nwd(llabs(u.l), u.m); — dla l = 0 wyjdzie g = m, więc 0/m zamieni się w 0/1. Na koniec u.l /= g; u.m /= g; return u;. Funkcja dostaje kopię, więc może ją swobodnie zmieniać.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const B = (x) => BigInt(x);
                const los = () => { const g = r.big(1, 1000000); const l = r.big(-1000000000000n, 1000000000000n); let m = r.big(1, 1000000000000n); if (r() < 0.5) m = -m; return [l * g, m * g]; };
                const duze = () => { let l = r.big(-1000000000000000000n, 1000000000000000000n); let m = r.big(1, 1000000000000000000n); if (r() < 0.5) m = -m; return [l, m]; };
                return [d([[0, 1], [0, -1000000000000000000n], [1, 1], [-1, -1]].map((x) => x.map(B))), d([[1000000000000000000n, -1000000000000000000n], [-1000000000000000000n, 999999999999999999n], [576460752303423488n, 288230376151711744n]]),
                    d(Array.from({ length: 20 }, () => [r.int(-50, 50), r.pick([-1, 1]) * r.int(1, 50)])), d(Array.from({ length: 500 }, () => (r() < 0.5 ? los() : duze())))];
            },
            check: (inp) => {
                const t = toks(inp); if (!calk(Number(t[0]), 1, 500) || t.length !== 1 + 2 * Number(t[0])) return 't';
                const M = 10n ** 18n;
                for (let i = 1; i < t.length; i += 2) { const l = BigInt(t[i]), m = BigInt(t[i + 1]); if (l < -M || l > M || m === 0n || m < -M || m > M) return 'zakres'; }
                return null;
            },
            solve: (inp) => {
                const t = toks(inp); const o = [];
                for (let i = 1; i < t.length; i += 2) o.push(ulTxt(skrocB(t[i], t[i + 1])));
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Ulamek {
    long long l, m;
};
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
Ulamek skroc(Ulamek u) {
    if (u.m < 0) {
        u.l = -u.l;
        u.m = -u.m;
    }
    long long g = nwd(llabs(u.l), u.m);
    u.l /= g;
    u.m /= g;
    return u;
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        Ulamek u;
        cin >> u.l >> u.m;
        Ulamek s = skroc(u);
        cout << s.l << "/" << s.m << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-katalog-ksiazek', krok: 4, level: 'latwe',
            title: 'Katalog biblioteki',
            short: 'Książka wczytaj() oddaje gotowy rekord, a void wypisz(const Ksiazka &k) drukuje wiersz tabeli. main tylko decyduje, co pokazać.',
            tags: ['funkcja wczytująca strukturę', 'const & w parametrze', 'tabela z setw'],
            statement: ['Biblioteka ma n książek; każda to tytuł (jedno słowo, zamiast spacji podkreślenia), autor, rok wydania i liczba stron. Czytelnik pyta o książki wydane w roku R albo później.',
                'Wypisz tabelę takich książek w kolejności z katalogu: tytuł wyrównany do lewej w polu szerokości 20, autor do lewej w polu szerokości 15, rok i liczba stron wyrównana do prawej w polu szerokości 6. Na końcu wypisz razem stron: S. Napisz funkcje Ksiazka wczytaj() i void wypisz(const Ksiazka &k).'],
            input_format: ['W pierwszym wierszu n i R.', 'W każdym z n kolejnych wierszy tytuł, autor, rok i liczba stron.'],
            output_format: ['Wiersze tabeli (być może żaden) i wiersz razem stron: S.'],
            constraints: ['1 ≤ n ≤ 500', 'Tytuły mają od 1 do 19 znaków (litery i _), autorzy od 1 do 14 liter.', '1500 ≤ rok, R ≤ 2026, 1 ≤ strony ≤ 5000'],
            examples: [{ input: '3 1900\nPan_Tadeusz Mickiewicz 1834 340\nFerdydurke Gombrowicz 1937 288\nSolaris Lem 1961 224', note: 'Pan Tadeusz jest starszy niż 1900, więc w tabeli są dwie książki: 288 + 224 = 512 stron.' }],
            hint: R`Ksiazka wczytaj() { Ksiazka k; cin >> k.tytul >> k.autor >> k.rok >> k.strony; return k; }. W wypisz: cout << left << setw(20) << k.tytul << setw(15) << k.autor << right << k.rok << setw(6) << k.strony << "\n";. Uwaga: left i right zostają włączone, dopóki ich nie zmienisz.`,
            tests: (r) => {
                const TYT = ['Pan_Tadeusz', 'Lalka', 'Quo_Vadis', 'Ferdydurke', 'Solaris', 'Krzyzacy', 'Potop', 'Chlopi', 'Wesele', 'Dziady', 'Kordian', 'Balladyna', 'Przedwiosnie', 'Zbrodnia_i_kara', 'Maly_Ksiaze', 'Hobbit', 'Opowiesci', 'Mistrz_i_Malgorzata', 'Rok_Orwella', 'Folwark_zwierzecy', 'Bajki', 'Cyberiada', 'Akademia_Kleksa'];
                const AUT = ['Mickiewicz', 'Prus', 'Sienkiewicz', 'Gombrowicz', 'Lem', 'Reymont', 'Wyspianski', 'Slowacki', 'Zeromski', 'Dostojewski', 'Tolkien', 'Orwell', 'Krasicki', 'Brzechwa', 'Bulhakow', 'Exupery'];
                const d = (R0, a) => `${a.length} ${R0}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n) => Array.from({ length: n }, () => [r.pick(TYT), r.pick(AUT), r.int(1500, 2026), r.int(1, 5000)]);
                return [d(2026, [['Hobbit', 'Tolkien', 1937, 310]]), d(1500, [['X', 'Y', 1500, 1], ['Mistrz_i_Malgorzata', 'Szymborskaxyzw', 2026, 5000]]), d(1900, los(15)), d(1800, los(500)), d(2026, los(100))];
            },
            check: (inp) => {
                const L = linie(inp); const [n, R0] = L[0].split(' ').map(Number); if (!calk(n, 1, 500) || !calk(R0, 1500, 2026) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 4 && /^[A-Za-z_]{1,19}$/.test(t[0]) && /^[A-Za-z]{1,14}$/.test(t[1]) && calk(Number(t[2]), 1500, 2026) && calk(Number(t[3]), 1, 5000); }) ? null : 'dane';
            },
            solve: (inp) => {
                const L = linie(inp); const R0 = Number(L[0].split(' ')[1]); const o = []; let s = 0;
                for (const l of L.slice(1)) { const [t, a, rok, st] = l.split(' '); if (Number(rok) >= R0) { o.push(`${t.padEnd(20)}${a.padEnd(15)}${rok}${st.padStart(6)}`); s += Number(st); } }
                o.push(`razem stron: ${s}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Ksiazka {
    string tytul, autor;
    int rok, strony;
};
Ksiazka wczytaj() {
    Ksiazka k;
    cin >> k.tytul >> k.autor >> k.rok >> k.strony;
    return k;
}
void wypisz(const Ksiazka &k) {
    cout << left << setw(20) << k.tytul << setw(15) << k.autor << right << k.rok << setw(6) << k.strony << "\n";
}
int main() {
    int n, R;
    cin >> n >> R;
    int razem = 0;
    for (int i = 0; i < n; i++) {
        Ksiazka k = wczytaj();
        if (k.rok >= R) {
            wypisz(k);
            razem += k.strony;
        }
    }
    cout << "razem stron: " << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'st-statystyka', krok: 4, level: 'srednie',
            title: 'Statystyka w jednej funkcji',
            short: 'Funkcja ma oddać cztery wyniki naraz: minimum, maksimum, sumę i liczbę parzystych. Najprościej — w strukturze.',
            tags: ['kilka wyników w strukturze', 'const vector<int> &', 'wiele testów'],
            statement: ['Dla każdego z t zestawów liczb policz najmniejszą i największą liczbę, sumę oraz to, ile liczb jest parzystych.',
                'Napisz strukturę Wynik z czterema polami i funkcję Wynik policz(const vector<int> &v), która oddaje wszystkie cztery wyniki naraz. W main tylko wczytuj zestawy, wołaj funkcję i wypisuj pola wyniku.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy zestaw to wiersz z n i wiersz z n liczbami całkowitymi.'],
            output_format: ['t wierszy: min A max B suma S parzystych P.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 5000, w sumie najwyżej 8000 liczb', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '2\n5\n3 -8 12 7 0\n1\n-5', note: 'Pierwszy zestaw: min −8, max 12, suma 14, parzyste: −8, 12 i 0. Drugi: jedna liczba −5 — nieparzysta.' }],
            hint: R`struct Wynik { int mn, mx; long long suma; int parzystych; };. W policz zacznij od w.mn = w.mx = v[0], w.suma = 0, w.parzystych = 0. Parzystość ujemnych: x % 2 == 0 działa także dla −8 (reszta 0), ale nie pisz x % 2 == 1 dla nieparzystych — dla −5 reszta to −1.`,
            tests: (r) => {
                const d = (zs) => `${zs.length}\n${zs.map((z) => `${z.length}\n${z.join(' ')}`).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => r.int(-m, m));
                return [d([[0], [7], [-1000000000, 1000000000]]), d(Array.from({ length: 100 }, () => los(r.int(1, 10), 20))), d([los(5000, 1e9), los(3000, 1e9)]), d([Array(5000).fill(1e9), Array(3000).fill(-1e9)]), d(Array.from({ length: 30 }, () => los(r.int(1, 250), 1e9)))];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 100)) return 't';
                let i = 1, razem = 0;
                for (let k = 0; k < T; k++) { const n = t[i]; if (!calk(n, 1, 5000)) return 'n'; razem += n; if (!t.slice(i + 1, i + 1 + n).every((x) => calk(x, -1e9, 1e9))) return 'liczby'; i += 1 + n; }
                return i === t.length && razem <= 8000 ? null : 'dlugosc';
            },
            solve: (inp) => {
                const t = nums(inp); const o = []; let i = 1;
                for (let k = 0; k < t[0]; k++) {
                    const n = t[i], v = t.slice(i + 1, i + 1 + n); i += 1 + n;
                    o.push(`min ${Math.min(...v)} max ${Math.max(...v)} suma ${v.reduce((a, b) => a + b, 0)} parzystych ${v.filter((x) => x % 2 === 0).length}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Wynik {
    int mn, mx;
    long long suma;
    int parzystych;
};
Wynik policz(const vector<int> &v) {
    Wynik w;
    w.mn = v[0];
    w.mx = v[0];
    w.suma = 0;
    w.parzystych = 0;
    for (int x : v) {
        w.mn = min(w.mn, x);
        w.mx = max(w.mx, x);
        w.suma += x;
        if (x % 2 == 0) w.parzystych++;
    }
    return w;
}
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; i++) cin >> v[i];
        Wynik w = policz(v);
        cout << "min " << w.mn << " max " << w.mx << " suma " << w.suma << " parzystych " << w.parzystych << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-suma-ulamkow', krok: 4, level: 'srednie',
            title: 'Suma ułamków krok po kroku',
            short: 'Ulamek dodaj(Ulamek a, Ulamek b) i skroc — z dwóch funkcji budujesz kalkulator, który po każdym ułamku pokazuje sumę.',
            tags: ['funkcja z dwiema strukturami', 'skracanie po każdym kroku', 'long long'],
            statement: ['Na tablicy jest n ułamków. Dodawaj je po kolei i po każdym dodaniu wypisz dotychczasową sumę jako ułamek nieskracalny z dodatnim mianownikiem (zero to 0/1).',
                'Napisz funkcje Ulamek skroc(Ulamek u) oraz Ulamek dodaj(Ulamek a, Ulamek b), która liczy a.l · b.m + b.l · a.m przez a.m · b.m i od razu skraca wynik. Skracaj po każdym dodawaniu — inaczej mianownik szybko urósłby ponad zakres long long.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy licznik i mianownik.'],
            output_format: ['n wierszy — sumy po kolejnych ułamkach.'],
            constraints: ['1 ≤ n ≤ 100', '−100 ≤ licznik ≤ 100, 1 ≤ mianownik ≤ 30'],
            examples: [{ input: '4\n1 2\n1 3\n1 6\n-5 4', note: '1/2, potem 1/2 + 1/3 = 5/6, potem 5/6 + 1/6 = 1/1, a na końcu 1 − 5/4 = −1/4.' }],
            hint: R`Ulamek dodaj(Ulamek a, Ulamek b) { Ulamek w; w.l = a.l * b.m + b.l * a.m; w.m = a.m * b.m; return skroc(w); }. Zacznij od sumy {0, 1}. Mianowniki są dodatnie, więc w skroc wystarczy podzielić przez nwd(|l|, m).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n) => Array.from({ length: n }, () => [r.int(-100, 100), r.int(1, 30)]);
                const pierwsze = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
                return [d([[0, 7]]), d([[1, 2], [-1, 2], [3, 30], [-1, 10]]), d(los(10)), d(los(100)), d(Array.from({ length: 100 }, (_, i) => [r.pick([-1, 1]) * 100, pierwsze[i % 10] * (i % 3 === 0 ? 1 : 1)])), d(Array.from({ length: 100 }, (_, i) => [1, 30 - (i % 29)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 100) || t.length !== 1 + 2 * t[0]) return 'n'; for (let i = 1; i < t.length; i += 2) if (!calk(t[i], -100, 100) || !calk(t[i + 1], 1, 30)) return 'zakres'; return null; },
            solve: (inp) => {
                const t = toks(inp); let s = [0n, 1n]; const o = [];
                for (let i = 1; i < t.length; i += 2) { const l = BigInt(t[i]), m = BigInt(t[i + 1]); s = skrocB(s[0] * m + l * s[1], s[1] * m); o.push(ulTxt(s)); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Ulamek {
    long long l, m;
};
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
Ulamek skroc(Ulamek u) {
    long long g = nwd(llabs(u.l), u.m);
    u.l /= g;
    u.m /= g;
    return u;
}
Ulamek dodaj(Ulamek a, Ulamek b) {
    Ulamek w;
    w.l = a.l * b.m + b.l * a.m;
    w.m = a.m * b.m;
    return skroc(w);
}
int main() {
    int n;
    cin >> n;
    Ulamek suma = {0, 1};
    for (int i = 0; i < n; i++) {
        Ulamek x;
        cin >> x.l >> x.m;
        suma = dodaj(suma, x);
        cout << suma.l << "/" << suma.m << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-pojedynek', krok: 4, level: 'srednie',
            title: 'Pojedynek rycerzy',
            short: 'void atakuj(const Rycerz &a, Rycerz &b) — atakujący tylko czytany, broniący się zmieniany. Kto wygra i ile zostanie mu życia?',
            tags: ['const & i & w jednej funkcji', 'symulacja', 'max(1, …)'],
            statement: ['Dwaj rycerze walczą na zmianę: najpierw atakuje pierwszy, potem drugi, potem znowu pierwszy i tak dalej. Każdy rycerz ma imię, punkty życia (hp), atak i obronę. Cios zadaje obrażenia równe atakowi napastnika minus obrona obrońcy — ale zawsze co najmniej 1. Walka kończy się, gdy hp któregoś rycerza spadnie do 0 lub niżej.',
                'Napisz funkcję void atakuj(const Rycerz &a, Rycerz &b), w której a zadaje cios b. Dla każdego z t pojedynków wypisz zwycięzcę, ile hp mu zostało i ile ciosów zadano w całej walce.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy pojedynek to dwa wiersze; w każdym imię, hp, atak i obrona rycerza.'],
            output_format: ['t wierszy: wygrywa IMIE, zostalo H hp, ciosow K.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ hp ≤ 10 000, 0 ≤ atak, obrona ≤ 100', 'Imiona mają od 1 do 15 liter (pierwsza wielka); w pojedynku są różne.'],
            examples: [{ input: '2\nLancelot 30 12 4\nGawain 28 9 6\nAla 5 0 50\nOla 2 0 0', note: 'Lancelot zadaje 12 − 6 = 6, Gawain 9 − 4 = 5. Po 5 ciosach Lancelota Gawain ma −2 hp, a Lancelotowi zostało 30 − 4 · 5 = 10. W drugiej walce cios to zawsze 1: Ala wygrywa po trzech ciosach (dwóch swoich i jednym Oli).' }],
            hint: R`void atakuj(const Rycerz &a, Rycerz &b) { b.hp -= max(1, a.atak - b.obrona); }. W pętli: atakuj(r1, r2); ciosy++; if (r2.hp <= 0) — wygrał r1; inaczej atakuj(r2, r1); ciosy++; itd. Bez & przy b funkcja zmieniłaby tylko kopię i walka trwałaby wiecznie.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x.join(' ')}\n${y.join(' ')}`).join('\n')}`;
                const ryc = (hm) => { const [a, b] = unikalneImiona(r, 2); return [[a, r.int(1, hm), r.int(0, 100), r.int(0, 100)], [b, r.int(1, hm), r.int(0, 100), r.int(0, 100)]]; };
                return [d([[['A', 1, 0, 0], ['B', 1, 0, 0]]]), d([[['Ola', 10000, 0, 100], ['Ela', 10000, 0, 100]], [['Iga', 10000, 100, 0], ['Ula', 1, 0, 0]]]), d(Array.from({ length: 10 }, () => ryc(100))), d(Array.from({ length: 100 }, () => ryc(10000)))];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 100) || L.length !== 1 + 2 * t) return 't';
                for (let i = 1; i < L.length; i++) { const x = L[i].split(' '); if (x.length !== 4 || !czyImie(x[0], 15) || !calk(Number(x[1]), 1, 10000) || !calk(Number(x[2]), 0, 100) || !calk(Number(x[3]), 0, 100)) return 'rycerz'; if (i % 2 === 0 && x[0] === L[i - 1].split(' ')[0]) return 'imiona'; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const o = [];
                for (let i = 1; i < L.length; i += 2) {
                    const a = L[i].split(' '), b = L[i + 1].split(' ');
                    const R1 = { n: a[0], hp: Number(a[1]), at: Number(a[2]), ob: Number(a[3]) }, R2 = { n: b[0], hp: Number(b[1]), at: Number(b[2]), ob: Number(b[3]) };
                    let k = 0, w = null;
                    for (;;) {
                        R2.hp -= Math.max(1, R1.at - R2.ob); k++; if (R2.hp <= 0) { w = R1; break; }
                        R1.hp -= Math.max(1, R2.at - R1.ob); k++; if (R1.hp <= 0) { w = R2; break; }
                    }
                    o.push(`wygrywa ${w.n}, zostalo ${w.hp} hp, ciosow ${k}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Rycerz {
    string imie;
    int hp, atak, obrona;
};
void atakuj(const Rycerz &a, Rycerz &b) {
    b.hp -= max(1, a.atak - b.obrona);
}
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        Rycerz r1, r2;
        cin >> r1.imie >> r1.hp >> r1.atak >> r1.obrona;
        cin >> r2.imie >> r2.hp >> r2.atak >> r2.obrona;
        int ciosy = 0;
        while (true) {
            atakuj(r1, r2);
            ciosy++;
            if (r2.hp <= 0) {
                cout << "wygrywa " << r1.imie << ", zostalo " << r1.hp << " hp, ciosow " << ciosy << "\n";
                break;
            }
            atakuj(r2, r1);
            ciosy++;
            if (r1.hp <= 0) {
                cout << "wygrywa " << r2.imie << ", zostalo " << r2.hp << " hp, ciosow " << ciosy << "\n";
                break;
            }
        }
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · sortowanie struktur
        {
            id: 'st-ranking', krok: 5, level: 'latwe',
            title: 'Ranking graczy',
            short: 'sort z lambdą: najpierw więcej punktów, a przy remisie nick alfabetycznie. Dwa kryteria w jednym komparatorze.',
            tags: ['sort z komparatorem', 'dwa kryteria', 'malejąco i rosnąco'],
            statement: ['Serwer gry ma listę n graczy: nick i liczbę punktów. Wypisz ranking: gracze od największej liczby punktów, a przy równej liczbie punktów — alfabetycznie według nicku. Przed każdym graczem stoi jego pozycja na liście.',
                'Graczy trzymaj w vector<Gracz> i posortuj jednym wywołaniem sort z komparatorem — lambdą, która mówi, czy gracz a ma stać przed graczem b.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nick i punkty.'],
            output_format: ['n wierszy: POZYCJA. NICK PUNKTY.'],
            constraints: ['1 ≤ n ≤ 1000', 'Nicki są różne, mają od 1 do 12 małych liter.', '0 ≤ punkty ≤ 10⁹'],
            examples: [{ input: '5\nzeus 1200\nara 950\nbaltazar 1200\nmilo 3000\ncyryl 950', note: 'milo ma najwięcej. zeus i baltazar mają po 1200 — pierwszy alfabetycznie jest baltazar. Tak samo ara przed cyrylem.' }],
            hint: R`sort(v.begin(), v.end(), [](const Gracz &a, const Gracz &b) { if (a.punkty != b.punkty) return a.punkty > b.punkty; return a.nick < b.nick; });. Komparator odpowiada na pytanie „czy a stoi przed b?” — przy remisie punktów decyduje drugie kryterium.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => unikalneSlowa(r, n, 1, 5).map((s) => [s, r.int(0, m)]);
                return [d([['solo', 0]]), d([['c', 5], ['b', 5], ['a', 5], ['d', 1000000000]]), d(los(12, 10)), d(los(1000, 1000000000)), d(los(800, 20))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                const s = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 2 || !czyMale(t[0], 12) || s.has(t[0]) || !calk(Number(t[1]), 0, 1e9)) return 'dane'; s.add(t[0]); }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; });
                return sortuj(u, (x) => [x[1], x[0]], [-1, 1]).map((x, i) => `${i + 1}. ${x[0]} ${x[1]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Gracz {
    string nick;
    int punkty;
};
int main() {
    int n;
    cin >> n;
    vector<Gracz> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].nick >> v[i].punkty;
    sort(v.begin(), v.end(), [](const Gracz &a, const Gracz &b) {
        if (a.punkty != b.punkty) return a.punkty > b.punkty;
        return a.nick < b.nick;
    });
    for (int i = 0; i < n; i++) cout << i + 1 << ". " << v[i].nick << " " << v[i].punkty << "\n";
    return 0;
}`,
        },
        {
            id: 'st-lista-alfabetyczna', krok: 5, level: 'latwe',
            title: 'Lista alfabetyczna',
            short: 'Dziennik układa się według nazwisk, a przy tych samych nazwiskach — według imion. Sortujesz po dwóch polach napisowych.',
            tags: ['sort po napisach', 'kryterium dodatkowe', 'nazwisko i imię'],
            statement: ['Sekretariat układa listę uczniów do dziennika: alfabetycznie według nazwiska, a gdy nazwiska są takie same — według imienia. Wypisz listę w formacie NAZWISKO IMIE z numerem w dzienniku.',
                'Porównanie napisów w C++ (a.nazwisko < b.nazwisko) działa jak w słowniku dla małych liter; wszystkie nazwiska i imiona zaczynają się wielką literą, a dalej mają małe, więc wynik jest taki, jakiego się spodziewasz.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i nazwisko.'],
            output_format: ['n wierszy: NUMER. NAZWISKO IMIE.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona i nazwiska mają od 1 do 20 liter: pierwsza wielka, reszta małe.'],
            examples: [{ input: '4\nZosia Nowak\nAdam Lis\nAnna Nowak\nKuba Adamczyk', note: 'Najpierw Adamczyk, potem Lis, a dwie Nowak ustawiamy według imion: Anna przed Zosią.' }],
            hint: R`Komparator: if (a.nazwisko != b.nazwisko) return a.nazwisko < b.nazwisko; return a.imie < b.imie;. Wypisuj najpierw nazwisko, potem imię.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, naz) => Array.from({ length: n }, () => [imie(r), r.pick(naz)]);
                return [d([['Ala', 'Nowak']]), d([['Ola', 'Lis'], ['Ola', 'Lis'], ['Ala', 'Lis'], ['Ela', 'Li'], ['Ula', 'Lisowski']]), d(los(15, NAZWISKA)), d(los(1000, NAZWISKA)), d(los(300, ['Nowak', 'Kowalski', 'Krol']))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 2 && czyImie(t[0], 20) && czyImie(t[1], 20); }) ? null : 'dane'; },
            solve: (inp) => sortuj(linie(inp).slice(1).map((l) => l.split(' ')), (x) => [x[1], x[0]]).map((x, i) => `${i + 1}. ${x[1]} ${x[0]}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie, nazwisko;
};
int main() {
    int n;
    cin >> n;
    vector<Uczen> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].imie >> v[i].nazwisko;
    sort(v.begin(), v.end(), [](const Uczen &a, const Uczen &b) {
        if (a.nazwisko != b.nazwisko) return a.nazwisko < b.nazwisko;
        return a.imie < b.imie;
    });
    for (int i = 0; i < n; i++) cout << i + 1 << ". " << v[i].nazwisko << " " << v[i].imie << "\n";
    return 0;
}`,
        },
        {
            id: 'st-punkty-od-srodka', krok: 5, level: 'latwe',
            title: 'Punkty od środka',
            short: 'Sortowanie po wartości liczonej: kwadrat odległości od (0, 0). Remisy rozstrzyga x, a potem y.',
            tags: ['sort po wartości liczonej', 'x² + y² w long long', 'trzy kryteria'],
            statement: ['Na tarczy strzelniczej jest n trafień — punktów (x, y), środek tarczy to (0, 0). Wypisz trafienia od najbliższego środka do najdalszego. Przy tej samej odległości wcześniej jest punkt z mniejszym x, a przy tym samym x — z mniejszym y.',
                'Porównuj kwadraty odległości x² + y² — to liczby całkowite, więc nie ma kłopotu z pierwiastkami i zaokrągleniami.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy x i y.'],
            output_format: ['n wierszy z punktami w nowej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ x, y ≤ 10⁹ (punkty mogą się powtarzać)'],
            examples: [{ input: '5\n3 4\n-5 0\n0 1\n4 -3\n1 0', note: 'Odległości: 5, 5, 1, 5, 1. Najpierw (0, 1) i (1, 0) — po x. Potem trzy punkty w odległości 5: (−5, 0), (3, 4), (4, −3).' }],
            hint: R`Przy współrzędnych do 10⁹ kwadrat ma 10¹⁸, a suma dwóch — 2 · 10¹⁸: long long jeszcze wystarcza (do ok. 9,2 · 10¹⁸), int — nie. Napisz funkcję long long d2(const Punkt &p) { return p.x * p.x + p.y * p.y; } (pola jako long long) i użyj jej w komparatorze.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m)]);
                const okr = () => { const o = []; for (const [a, b] of [[3, 4], [4, 3], [5, 0], [0, 5]]) for (const sa of [-1, 1]) for (const sb of [-1, 1]) o.push([a * sa, b * sb]); return r.shuffle(o); };
                return [d([[0, 0]]), d([[1e9, 1e9], [-1e9, -1e9], [1e9, -1e9], [0, 0], [0, 0]]), d(okr()), d(los(20, 3)), d(los(1000, 1e9)), d(los(1000, 5))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === 1 + 2 * t[0] && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const p = Array.from({ length: t[0] }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]);
                const k = (q) => BigInt(q[0]) * BigInt(q[0]) + BigInt(q[1]) * BigInt(q[1]);
                return p.slice().sort((a, b) => { const x = k(a), y = k(b); if (x !== y) return x < y ? -1 : 1; return a[0] - b[0] || a[1] - b[1]; }).map((q) => q.join(' ')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Punkt {
    long long x, y;
};
long long d2(const Punkt &p) {
    return p.x * p.x + p.y * p.y;
}
int main() {
    int n;
    cin >> n;
    vector<Punkt> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].x >> v[i].y;
    sort(v.begin(), v.end(), [](const Punkt &a, const Punkt &b) {
        if (d2(a) != d2(b)) return d2(a) < d2(b);
        if (a.x != b.x) return a.x < b.x;
        return a.y < b.y;
    });
    for (const Punkt &p : v) cout << p.x << " " << p.y << "\n";
    return 0;
}`,
        },
        {
            id: 'st-kalendarz', krok: 5, level: 'latwe',
            title: 'Kalendarz wydarzeń',
            short: 'Daty sortujesz pole po polu: rok, miesiąc, dzień — a dla tego samego dnia alfabetycznie po nazwie.',
            tags: ['sort dat', 'cztery kryteria', 'format DD.MM.RRRR'],
            statement: ['Szkolny kalendarz ma n wydarzeń: nazwę i datę. Wypisz wydarzenia chronologicznie, a wydarzenia z tego samego dnia — alfabetycznie według nazwy. Datę wypisuj jako DD.MM.RRRR.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa wydarzenia i data: dzień, miesiąc, rok.'],
            output_format: ['n wierszy: DD.MM.RRRR NAZWA.'],
            constraints: ['1 ≤ n ≤ 1000', 'Nazwy mają od 1 do 20 znaków (małe litery i _).', 'Daty są poprawne, lata od 2000 do 2030.'],
            examples: [{ input: '4\nwycieczka 12 5 2027\nklasowka 3 11 2026\nakademia 12 5 2027\nbal 31 1 2027', note: 'Klasówka jest w 2026, potem bal w styczniu 2027. 12.05.2027 są dwa wydarzenia — alfabetycznie akademia przed wycieczką.' }],
            hint: R`Komparator: if (a.r != b.r) return a.r < b.r; if (a.m != b.m) return a.m < b.m; if (a.d != b.d) return a.d < b.d; return a.nazwa < b.nazwa;. Wypisanie z zerami: setfill('0') i setw(2) przed dniem i miesiącem.`,
            tests: (r) => {
                const NZ = ['wycieczka', 'klasowka', 'akademia', 'bal', 'dzien_sportu', 'wywiadowka', 'konkurs', 'olimpiada', 'koncert', 'egzamin', 'ferie', 'wakacje', 'kino', 'teatr', 'zebranie', 'apel'];
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, r1, r2) => Array.from({ length: n }, () => [r.pick(NZ), ...losData(r, r1, r2)]);
                return [d([['apel', 1, 9, 2026]]), d([['b', 1, 1, 2000], ['a', 1, 1, 2000], ['c', 31, 12, 2030], ['a', 2, 1, 2000]]), d(los(15, 2026, 2027)), d(los(1000, 2000, 2030)), d(los(300, 2026, 2026).map((x) => [x[0], r.int(1, 3), 9, 2026]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 4 && /^[a-z_]{1,20}$/.test(t[0]) && P.czyPoprawnaData(Number(t[1]), Number(t[2]), Number(t[3])) && calk(Number(t[3]), 2000, 2030); }) ? null : 'dane';
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1]), Number(t[2]), Number(t[3])]; });
                return sortuj(u, (x) => [x[3], x[2], x[1], x[0]]).map((x) => `${dataTxt(x[1], x[2], x[3])} ${x[0]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Wydarzenie {
    string nazwa;
    int d, m, r;
};
int main() {
    int n;
    cin >> n;
    vector<Wydarzenie> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].nazwa >> v[i].d >> v[i].m >> v[i].r;
    sort(v.begin(), v.end(), [](const Wydarzenie &a, const Wydarzenie &b) {
        if (a.r != b.r) return a.r < b.r;
        if (a.m != b.m) return a.m < b.m;
        if (a.d != b.d) return a.d < b.d;
        return a.nazwa < b.nazwa;
    });
    for (const Wydarzenie &w : v)
        cout << setfill('0') << setw(2) << w.d << "." << setw(2) << w.m << "." << w.r << " " << w.nazwa << "\n";
    return 0;
}`,
        },
        {
            id: 'st-ex-aequo', krok: 5, level: 'srednie',
            title: 'Miejsca ex aequo',
            short: 'Po sortowaniu ten sam wynik daje to samo miejsce, a następne miejsce przeskakuje: 1, 2, 2, 4. Patrzysz na sąsiada w posortowanym vectorze.',
            tags: ['sort i sąsiedzi', 'miejsca ex aequo', 'dwa kryteria'],
            statement: ['Na zawodach n zawodników dostało punkty. Ułóż listę wyników: od największej liczby punktów, a przy równej liczbie punktów alfabetycznie według imienia.',
                'Miejsca przydziela się ex aequo: zawodnicy z tą samą liczbą punktów dzielą miejsce, a następne miejsce przeskakuje o tyle osób, ile je dzieliło (np. 1, 2, 2, 4). Inaczej mówiąc — miejsce zawodnika to 1 + liczba zawodników z większą liczbą punktów.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i punkty.'],
            output_format: ['n wierszy: MIEJSCE. IMIE PUNKTY.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona są różne, mają od 1 do 20 znaków (litery i cyfry, pierwsza wielka).', '0 ≤ punkty ≤ 100'],
            examples: [{ input: '6\nOla 90\nKuba 75\nIga 90\nAdam 60\nEla 75\nJan 75', note: 'Iga i Ola dzielą 1. miejsce, więc trzej zawodnicy z 75 pkt są na 3. miejscu (Ela, Jan, Kuba), a Adam — na 6.' }],
            hint: R`Po sortowaniu idź po vectorze z licznikiem i: jeśli i == 0 albo v[i].punkty != v[i - 1].punkty, to miejsce = i + 1; inaczej miejsce zostaje takie jak u poprzednika.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (n, lo, hi) => unikalneImiona(r, n).map((s) => [s, r.int(lo, hi)]);
                return [d([['Ala', 0]]), d([['A', 5], ['B', 5], ['C', 5]]), d(los(12, 70, 75)), d(los(1000, 0, 100)), d(los(500, 98, 100))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                const s = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); if (t.length !== 2 || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || s.has(t[0]) || !calk(Number(t[1]), 0, 100)) return 'dane'; s.add(t[0]); }
                return null;
            },
            solve: (inp) => {
                const u = sortuj(linie(inp).slice(1).map((l) => { const t = l.split(' '); return [t[0], Number(t[1])]; }), (x) => [x[1], x[0]], [-1, 1]);
                let m = 0;
                return u.map((x, i) => { if (i === 0 || x[1] !== u[i - 1][1]) m = i + 1; return `${m}. ${x[0]} ${x[1]}`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zawodnik {
    string imie;
    int punkty;
};
int main() {
    int n;
    cin >> n;
    vector<Zawodnik> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].imie >> v[i].punkty;
    sort(v.begin(), v.end(), [](const Zawodnik &a, const Zawodnik &b) {
        if (a.punkty != b.punkty) return a.punkty > b.punkty;
        return a.imie < b.imie;
    });
    int miejsce = 0;
    for (int i = 0; i < n; i++) {
        if (i == 0 || v[i].punkty != v[i - 1].punkty) miejsce = i + 1;
        cout << miejsce << ". " << v[i].imie << " " << v[i].punkty << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-numery-startowe', krok: 5, level: 'srednie',
            title: 'Numery startowe',
            short: 'Po sortowaniu nie wiesz już, kto był który — chyba że numer startowy zapiszesz w polu struktury, zanim zaczniesz sortować.',
            tags: ['pole nr sprzed sortowania', 'tablica miejsc', 'zapytania'],
            statement: ['W biegu wystartowało n zawodników z numerami 1, 2, …, n (w kolejności z wejścia); każdy ma imię i czas w sekundach. Wypisz wyniki: od najkrótszego czasu, a przy równym czasie — od mniejszego numeru startowego. Czas wypisuj jako MM:SS.',
                'Potem odpowiedz na q pytań: na którym miejscu skończył zawodnik z numerem k? Numer startowy zapisz w polu struktury, zanim posortujesz vector — po sortowaniu pozycja w vectorze nie mówi już nic o numerze.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy: imię i czas w sekundach.', 'Potem wiersz z q i wiersz z q numerami startowymi.'],
            output_format: ['n wierszy MIEJSCE. NR IMIE MM:SS, a potem q wierszy: nr K: miejsce M.'],
            constraints: ['1 ≤ n ≤ 600, 1 ≤ q ≤ 400', 'Imiona mają od 1 do 15 liter (pierwsza wielka).', '1 ≤ czas ≤ 5999'],
            examples: [{ input: '4\nOla 754\nKuba 698\nIga 754\nAdam 1203\n2\n3 1', note: 'Kuba (nr 2) jest pierwszy. Ola (nr 1) i Iga (nr 3) mają ten sam czas — wyżej mniejszy numer, czyli Ola. Zawodnik nr 3 zajął 3. miejsce, nr 1 — 2.' }],
            hint: R`Przy wczytywaniu: v[i].nr = i + 1;. Po sortowaniu zbuduj tablicę miejsc: vector<int> miejsce(n + 1); for (int i = 0; i < n; i++) miejsce[v[i].nr] = i + 1;. Wtedy odpowiedź na pytanie to miejsce[k].`,
            tests: (r) => {
                const d = (a, q) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}\n${q.length}\n${q.join(' ')}`;
                const los = (n, lo, hi) => Array.from({ length: n }, () => [imie(r), r.int(lo, hi)]);
                const zap = (n, q) => Array.from({ length: q }, () => r.int(1, n));
                return [d([['Ala', 5999]], [1]), d([['A', 60], ['B', 60], ['C', 59], ['D', 60]], [1, 2, 3, 4]), d(los(15, 600, 700), zap(15, 10)), d(los(600, 1, 5999), zap(600, 400)), d(los(500, 900, 905), zap(500, 300))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 600)) return 'n';
                if (!L.slice(1, n + 1).every((l) => { const t = l.split(' '); return t.length === 2 && czyImie(t[0], 15) && calk(Number(t[1]), 1, 5999); })) return 'zawodnik';
                const q = Number(L[n + 1]); if (!calk(q, 1, 400) || L.length !== n + 3) return 'q';
                const z = L[n + 2].split(' ').map(Number); return z.length === q && z.every((x) => calk(x, 1, n)) ? null : 'pytania';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]);
                const u = L.slice(1, n + 1).map((l, i) => { const t = l.split(' '); return [i + 1, t[0], Number(t[1])]; });
                const s = sortuj(u, (x) => [x[2], x[0]]); const mc = []; s.forEach((x, i) => { mc[x[0]] = i + 1; });
                return [...s.map((x, i) => `${i + 1}. ${x[0]} ${x[1]} ${mmss(x[2])}`), ...L[n + 2].split(' ').map((k) => `nr ${k}: miejsce ${mc[Number(k)]}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Biegacz {
    int nr;
    string imie;
    int czas;
};
int main() {
    int n;
    cin >> n;
    vector<Biegacz> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i].imie >> v[i].czas;
        v[i].nr = i + 1;
    }
    sort(v.begin(), v.end(), [](const Biegacz &a, const Biegacz &b) {
        if (a.czas != b.czas) return a.czas < b.czas;
        return a.nr < b.nr;
    });
    vector<int> miejsce(n + 1);
    for (int i = 0; i < n; i++) {
        miejsce[v[i].nr] = i + 1;
        cout << i + 1 << ". " << v[i].nr << " " << v[i].imie << " ";
        cout << setfill('0') << setw(2) << v[i].czas / 60 << ":" << setw(2) << v[i].czas % 60 << "\n";
    }
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int k;
        cin >> k;
        cout << "nr " << k << ": miejsce " << miejsce[k] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-srednia-ocen', krok: 5, level: 'srednie',
            title: 'Ranking średnich',
            short: 'Sortowanie po średniej bez double: porównujesz sumaA · ileB z sumaB · ileA. Średnią wypisujesz dopiero na końcu.',
            tags: ['porównanie ułamków w komparatorze', 'suma i liczba ocen w strukturze', 'setprecision(2)'],
            statement: ['Każdy z n uczniów ma kilka ocen. Ułóż ranking od najwyższej średniej, a przy równych średnich — alfabetycznie według imienia. Wypisz imię i średnią z dwiema cyframi po kropce.',
                'W strukturze trzymaj sumę ocen i ich liczbę. W komparatorze nie dziel — średnia a jest większa od średniej b dokładnie wtedy, gdy a.suma · b.ile > b.suma · a.ile. Dzielenie (na double) zrób dopiero przy wypisywaniu.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię, liczba ocen k i k ocen.'],
            output_format: ['n wierszy: IMIE SREDNIA (z dwiema cyframi po kropce).'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona są różne, mają od 1 do 20 znaków (litery i cyfry, pierwsza wielka).', '1 ≤ k ≤ 20, oceny od 1 do 6', 'Żadna średnia nie wypada dokładnie w połowie między dwoma wynikami z dwoma miejscami po przecinku.'],
            examples: [{ input: '4\nOla 3 5 5 4\nKuba 2 6 3\nIga 4 4 5 5 6\nAdam 1 5', note: 'Średnie: Ola 4.67, Kuba 4.50, Iga 5.00, Adam 5.00. Iga i Adam mają po 5 — alfabetycznie Adam pierwszy.' }],
            hint: R`struct Uczen { string imie; int suma, ile; };. Komparator: long long lewa = 1LL * a.suma * b.ile, prawa = 1LL * b.suma * a.ile; if (lewa != prawa) return lewa > prawa; return a.imie < b.imie;. Wypisanie: cout << fixed << setprecision(2) << (double)u.suma / u.ile.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => `${x[0]} ${x[1].length} ${x[1].join(' ')}`).join('\n')}`;
                const uczen = (s, kmax) => { for (;;) { const k = r.int(1, kmax); const o = Array.from({ length: k }, () => r.int(1, 6)); if (h.safe(o.reduce((a, b) => a + b, 0) / k, 2)) return [s, o]; } };
                const los = (n, kmax) => unikalneImiona(r, n).map((s) => uczen(s, kmax));
                return [d([['Ala', [6]]]), d([['B', [5, 4]], ['A', [4, 5]], ['C', [6, 3]], ['D', [3, 6, 6, 3]]]), d(los(12, 5)), d(los(1000, 20)), d(los(400, 2))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                const s = new Set();
                for (const l of L.slice(1)) { const t = l.split(' '); const k = Number(t[1]); if (!/^[A-Z][A-Za-z0-9]{0,19}$/.test(t[0]) || s.has(t[0]) || !calk(k, 1, 20) || t.length !== k + 2) return 'dane'; s.add(t[0]); const o = t.slice(2).map(Number); if (!o.every((x) => calk(x, 1, 6))) return 'oceny'; if (!h.safe(o.reduce((a, b) => a + b, 0) / k, 2)) return 'polowka'; }
                return null;
            },
            solve: (inp) => {
                const u = linie(inp).slice(1).map((l) => { const t = l.split(' '); return { n: t[0], s: t.slice(2).reduce((a, b) => a + Number(b), 0), k: Number(t[1]) }; });
                u.sort((a, b) => { const x = a.s * b.k, y = b.s * a.k; if (x !== y) return y - x; return a.n < b.n ? -1 : a.n > b.n ? 1 : 0; });
                return u.map((x) => `${x.n} ${h.fx(x.s / x.k, 2)}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Uczen {
    string imie;
    int suma, ile;
};
int main() {
    int n;
    cin >> n;
    vector<Uczen> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i].imie >> v[i].ile;
        v[i].suma = 0;
        for (int j = 0; j < v[i].ile; j++) {
            int o;
            cin >> o;
            v[i].suma += o;
        }
    }
    sort(v.begin(), v.end(), [](const Uczen &a, const Uczen &b) {
        long long lewa = 1LL * a.suma * b.ile, prawa = 1LL * b.suma * a.ile;
        if (lewa != prawa) return lewa > prawa;
        return a.imie < b.imie;
    });
    cout << fixed << setprecision(2);
    for (const Uczen &u : v) cout << u.imie << " " << (double)u.suma / u.ile << "\n";
    return 0;
}`,
        },
        {
            id: 'st-plan-lekcji', krok: 5, level: 'srednie',
            title: 'Plan lekcji',
            short: 'Dni tygodnia jako napisy pon, wt, sr… — alfabet nie zna ich kolejności. Komparator zamienia dzień na numer funkcją pomocniczą.',
            tags: ['klucz liczony funkcją', 'sort po numerze dnia', 'godzina jako minuty'],
            statement: ['Lekcje w planie są zapisane w przypadkowej kolejności: dzień tygodnia (pon, wt, sr, czw, pt), godzina rozpoczęcia HH:MM i przedmiot. Wypisz plan uporządkowany: od poniedziałku do piątku, w ramach dnia według godziny, a przy tej samej godzinie (różne grupy) — alfabetycznie według przedmiotu.',
                'Napisz funkcję int numerDnia(const string &d), która zamienia skrót dnia na liczbę 0–4, i użyj jej w komparatorze. Porównując same napisy, dostałbyś czw, pon, pt, sr, wt — alfabetycznie, ale nie po kolei.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy dzień, godzina HH:MM i przedmiot.'],
            output_format: ['n wierszy w formacie z wejścia, w nowej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', 'Godziny od 07:00 do 18:59, przedmioty od 1 do 20 znaków (małe litery i _).'],
            examples: [{ input: '5\nsr 08:00 fizyka\npon 09:50 matematyka\npt 08:00 wf\npon 08:00 polski\nsr 08:00 chemia', note: 'Najpierw poniedziałek (08:00 przed 09:50), potem środa — dwie lekcje o 08:00, alfabetycznie chemia przed fizyką — i piątek.' }],
            hint: R`int numerDnia(const string &d) { if (d == "pon") return 0; if (d == "wt") return 1; if (d == "sr") return 2; if (d == "czw") return 3; return 4; }. Godzinę wczytaj jako h, ':' i m, a do porównań używaj h * 60 + m.`,
            tests: (r) => {
                const DZ = ['pon', 'wt', 'sr', 'czw', 'pt'];
                const PR = ['matematyka', 'polski', 'angielski', 'fizyka', 'chemia', 'biologia', 'historia', 'geografia', 'wf', 'informatyka', 'muzyka', 'plastyka', 'religia', 'godz_wych', 'niemiecki'];
                const d = (a) => `${a.length}\n${a.map((x) => `${x[0]} ${hhmm(x[1])} ${x[2]}`).join('\n')}`;
                const los = (n, godz) => Array.from({ length: n }, () => [r.pick(DZ), r.pick(godz), r.pick(PR)]);
                const lek = [480, 535, 590, 655, 710, 765, 820, 870, 920, 970];
                return [d([['pt', 7 * 60, 'wf']]), d([['wt', 480, 'b'], ['pon', 1139, 'a'], ['czw', 480, 'z'], ['czw', 480, 'a'], ['sr', 600, 'x'], ['pt', 420, 'y']]), d(los(20, lek)), d(los(1000, Array.from({ length: 720 }, (_, i) => 420 + i))), d(los(300, [480, 535]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const m = l.match(/^(pon|wt|sr|czw|pt) (\d\d):(\d\d) ([a-z_]{1,20})$/); if (!m) return false; const t = Number(m[2]) * 60 + Number(m[3]); return Number(m[3]) < 60 && t >= 420 && t <= 1139; }) ? null : 'dane';
            },
            solve: (inp) => {
                const DZ = ['pon', 'wt', 'sr', 'czw', 'pt'];
                const u = linie(inp).slice(1).map((l) => l.split(' '));
                return sortuj(u, (x) => [DZ.indexOf(x[0]), x[1], x[2]]).map((x) => x.join(' ')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Lekcja {
    string dzien;
    int h, m;
    string przedmiot;
};
int numerDnia(const string &d) {
    if (d == "pon") return 0;
    if (d == "wt") return 1;
    if (d == "sr") return 2;
    if (d == "czw") return 3;
    return 4;
}
int main() {
    int n;
    cin >> n;
    vector<Lekcja> v(n);
    char dwukropek;
    for (int i = 0; i < n; i++) cin >> v[i].dzien >> v[i].h >> dwukropek >> v[i].m >> v[i].przedmiot;
    sort(v.begin(), v.end(), [](const Lekcja &a, const Lekcja &b) {
        if (numerDnia(a.dzien) != numerDnia(b.dzien)) return numerDnia(a.dzien) < numerDnia(b.dzien);
        if (a.h * 60 + a.m != b.h * 60 + b.m) return a.h * 60 + a.m < b.h * 60 + b.m;
        return a.przedmiot < b.przedmiot;
    });
    for (const Lekcja &l : v)
        cout << l.dzien << " " << setfill('0') << setw(2) << l.h << ":" << setw(2) << l.m << " " << l.przedmiot << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · metody i konstruktory
        {
            id: 'st-prostokat-metody', krok: 6, level: 'latwe',
            title: 'Prostokąt z metodami',
            short: 'Prostokąt sam liczy swoje pole i obwód, sam mówi, czy jest kwadratem i czy zawiera punkt. Metody widzą pola bez kropki.',
            tags: ['metody', 'metoda zmieniająca pola', 'metoda z parametrem'],
            statement: ['Prostokąt o bokach równoległych do osi podano dwoma przeciwległymi wierzchołkami (x1, y1) i (x2, y2) — w dowolnej kolejności. Napisz strukturę Prostokat z polami x1, y1, x2, y2 i metodami:',
                'void popraw() — ustawia pola tak, żeby x1 ≤ x2 i y1 ≤ y2 (zamienia je, jeśli trzeba); long long pole(); long long obwod(); bool kwadrat(); bool zawiera(long long x, long long y) — czy punkt leży w prostokącie albo na jego brzegu.',
                'Wypisz pole, obwód i to, czy prostokąt jest kwadratem, a potem dla każdego z q punktów odpowiedz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu x1 y1 x2 y2.', 'W drugim wierszu q, potem q wierszy z punktami x y.'],
            output_format: ['Wiersze pole P, obwod O, kwadrat: TAK/NIE, a potem q wierszy TAK albo NIE.'],
            constraints: ['−10⁹ ≤ wszystkie współrzędne ≤ 10⁹, x1 ≠ x2, y1 ≠ y2', '1 ≤ q ≤ 1000'],
            examples: [{ input: '4 5 -1 2\n4\n0 3\n4 2\n5 3\n-1 6', note: 'Po popraw() prostokąt to x od −1 do 4 i y od 2 do 5: boki 5 i 3, pole 15, obwód 16. (4, 2) leży na rogu — liczy się. (5, 3) i (−1, 6) są poza.' }],
            hint: R`Metoda to funkcja wewnątrz struct: long long pole() { return (x2 - x1) * (y2 - y1); }. Widzi pola swojego prostokąta bez pisania p.x1. W main: Prostokat p; cin >> p.x1 >> p.y1 >> p.x2 >> p.y2; p.popraw(); cout << "pole " << p.pole() << "\n";. W popraw użyj swap(x1, x2), gdy x1 > x2.`,
            tests: (r) => {
                const d = (p, q) => `${p.join(' ')}\n${q.length}\n${q.map((x) => x.join(' ')).join('\n')}`;
                const M = 1e9;
                const pr = (m) => { for (;;) { const a = [r.int(-m, m), r.int(-m, m), r.int(-m, m), r.int(-m, m)]; if (a[0] !== a[2] && a[1] !== a[3]) return a; } };
                const pk = (p, q, m) => { const lx = Math.min(p[0], p[2]), hx = Math.max(p[0], p[2]), ly = Math.min(p[1], p[3]), hy = Math.max(p[1], p[3]); return Array.from({ length: q }, () => { const z = r(); if (z < 0.3) return [r.int(lx, hx), r.int(ly, hy)]; if (z < 0.5) return [r.pick([lx, hx]), r.int(ly, hy)]; if (z < 0.6) return [r.pick([lx, hx]), r.pick([ly, hy])]; if (z < 0.8) return [r.pick([lx - 1, hx + 1]), r.int(ly, hy)]; return [r.int(-m, m), r.int(-m, m)]; }).map((x) => x.map((y) => Math.max(-M, Math.min(M, y)))); };
                const t = [];
                const p1 = [-M, -M, M, M]; t.push(d(p1, pk(p1, 10, M)));
                const p2 = [3, 7, 0, 4]; t.push(d(p2, pk(p2, 20, 10)));
                const p3 = pr(20); t.push(d(p3, pk(p3, 30, 25)));
                const p4 = pr(M); t.push(d(p4, pk(p4, 1000, M)));
                const p5 = [5, 5, 6, 6]; t.push(d(p5, pk(p5, 100, 8)));
                return t;
            },
            check: (inp) => {
                const L = linie(inp); const p = L[0].split(' ').map(Number); if (p.length !== 4 || !p.every((x) => calk(x, -1e9, 1e9)) || p[0] === p[2] || p[1] === p[3]) return 'prostokat';
                const q = Number(L[1]); if (!calk(q, 1, 1000) || L.length !== q + 2) return 'q';
                return L.slice(2).every((l) => { const t = l.split(' ').map(Number); return t.length === 2 && t.every((x) => calk(x, -1e9, 1e9)); }) ? null : 'punkt';
            },
            solve: (inp) => {
                const L = linie(inp); const p = L[0].split(' ').map(BigInt);
                const lx = p[0] < p[2] ? p[0] : p[2], hx = p[0] < p[2] ? p[2] : p[0], ly = p[1] < p[3] ? p[1] : p[3], hy = p[1] < p[3] ? p[3] : p[1];
                const o = [`pole ${(hx - lx) * (hy - ly)}`, `obwod ${2n * (hx - lx + hy - ly)}`, `kwadrat: ${hx - lx === hy - ly ? 'TAK' : 'NIE'}`];
                for (const l of L.slice(2)) { const [x, y] = l.split(' ').map(BigInt); o.push(x >= lx && x <= hx && y >= ly && y <= hy ? 'TAK' : 'NIE'); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Prostokat {
    long long x1, y1, x2, y2;
    void popraw() {
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
    }
    long long pole() {
        return (x2 - x1) * (y2 - y1);
    }
    long long obwod() {
        return 2 * (x2 - x1 + y2 - y1);
    }
    bool kwadrat() {
        return x2 - x1 == y2 - y1;
    }
    bool zawiera(long long x, long long y) {
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }
};
int main() {
    Prostokat p;
    cin >> p.x1 >> p.y1 >> p.x2 >> p.y2;
    p.popraw();
    cout << "pole " << p.pole() << "\n";
    cout << "obwod " << p.obwod() << "\n";
    cout << "kwadrat: " << (p.kwadrat() ? "TAK" : "NIE") << "\n";
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x, y;
        cin >> x >> y;
        cout << (p.zawiera(x, y) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-konto', krok: 6, level: 'latwe',
            title: 'Konto w banku',
            short: 'Saldo startuje od wartości domyślnej 0. Metody wplac i wyplac pilnują, żeby nie wypłacić więcej, niż jest na koncie.',
            tags: ['wartość domyślna pola', 'metoda bool', 'metoda zmieniająca pole'],
            statement: ['Napisz strukturę Konto z polami wlasciciel i saldo (saldo ma wartość domyślną 0 — zapisaną przy polu: long long saldo = 0;) oraz metodami void wplac(long long x), bool wyplac(long long x) i void wypisz().',
                'Obsłuż q operacji na koncie jednej osoby (kwoty w groszach): WPLATA x — dopisuje x do salda; WYPLATA x — jeśli saldo jest co najmniej x, zmniejsza je o x, a w przeciwnym razie nic nie zmienia i wypisuje odmowa, brakuje Z.GG; SALDO — wypisuje IMIE: Z.GG.'],
            input_format: ['W pierwszym wierszu imię właściciela.', 'W drugim wierszu q, potem q wierszy z operacjami.'],
            output_format: ['Wiersze wypisane przez operacje WYPLATA (tylko odmowy) i SALDO.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10⁹', 'Imię ma od 1 do 15 liter (pierwsza wielka).', 'Jest co najmniej jedno polecenie SALDO.'],
            examples: [{ input: 'Ola\n5\nWPLATA 5000\nWYPLATA 1999\nSALDO\nWYPLATA 3100\nSALDO', note: 'Po wpłacie 50.00 i wypłacie 19.99 zostaje 30.01. Wypłata 31.00 się nie udaje — brakuje 0.99 — i saldo zostaje bez zmian.' }],
            hint: R`bool wyplac(long long x) { if (x > saldo) return false; saldo -= x; return true; }. W main: if (!k.wyplac(x)) { cout << "odmowa, brakuje "; kwota(x - k.saldo); }. Saldo może urosnąć do 10¹² groszy — long long.`,
            tests: (r) => {
                const d = (im, o) => `${im}\n${o.length}\n${o.join('\n')}`;
                const los = (q, m) => { const o = []; while (o.length < q - 1) { const p = r(); o.push(p < 0.4 ? `WPLATA ${r.int(1, m)}` : p < 0.8 ? `WYPLATA ${r.int(1, m)}` : 'SALDO'); } o.push('SALDO'); return o; };
                return [d('Ala', ['SALDO']), d('Bo', ['WYPLATA 1', 'WPLATA 1', 'WYPLATA 1', 'WYPLATA 1', 'SALDO', 'WPLATA 1000000000', 'WYPLATA 999999999', 'SALDO']), d(imie(r), los(20, 10000)), d(imie(r), los(1000, 1000000000)), d(imie(r), Array.from({ length: 1000 }, (_, i) => (i % 2 ? 'SALDO' : 'WPLATA 1000000000')))];
            },
            check: (inp) => {
                const L = linie(inp); if (!czyImie(L[0], 15)) return 'imie';
                const q = Number(L[1]); if (!calk(q, 1, 1000) || L.length !== q + 2) return 'q';
                let s = 0;
                for (const l of L.slice(2)) { const t = l.split(' '); if (t[0] === 'SALDO' && t.length === 1) s++; else if (!((t[0] === 'WPLATA' || t[0] === 'WYPLATA') && t.length === 2 && calk(Number(t[1]), 1, 1e9))) return 'operacja'; }
                return s ? null : 'brak SALDO';
            },
            solve: (inp) => {
                const L = linie(inp); let s = 0; const o = [];
                for (const l of L.slice(2)) {
                    const [c, x] = l.split(' '); const v = Number(x);
                    if (c === 'WPLATA') s += v; else if (c === 'WYPLATA') { if (v > s) o.push(`odmowa, brakuje ${zl(v - s)}`); else s -= v; } else o.push(`${L[0]}: ${zl(s)}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void kwota(long long g) {
    cout << g / 100 << "." << setw(2) << setfill('0') << g % 100 << "\n";
}
struct Konto {
    string wlasciciel;
    long long saldo = 0;
    void wplac(long long x) {
        saldo += x;
    }
    bool wyplac(long long x) {
        if (x > saldo) return false;
        saldo -= x;
        return true;
    }
    void wypisz() {
        cout << wlasciciel << ": ";
        kwota(saldo);
    }
};
int main() {
    Konto k;
    cin >> k.wlasciciel;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string op;
        cin >> op;
        if (op == "SALDO") {
            k.wypisz();
            continue;
        }
        long long x;
        cin >> x;
        if (op == "WPLATA") {
            k.wplac(x);
        } else if (!k.wyplac(x)) {
            cout << "odmowa, brakuje ";
            kwota(x - k.saldo);
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-robot-kierunki', krok: 6, level: 'latwe',
            title: 'Robot z kompasem',
            short: 'Robot pamięta pozycję i kierunek, a metody lewo(), prawo() i naprzod(k) zmieniają jego stan. Startowe wartości dają pola domyślne.',
            tags: ['pola z wartościami domyślnymi', 'metody zmieniające stan', 'kierunki N E S W'],
            statement: ['Robot startuje w punkcie (0, 0), zwrócony na północ (N). Kierunki to N (w górę, y rośnie), E (w prawo, x rośnie), S (w dół) i W (w lewo). Robot wykonuje n poleceń: L — obrót w lewo o 90°, R — obrót w prawo o 90°, F k — k kroków naprzód.',
                'Napisz strukturę Robot z polami int x = 0, y = 0; char kier = \'N\'; i metodami void lewo(), void prawo(), void naprzod(int k). Po wszystkich poleceniach wypisz pozycję i kierunek oraz największą odległość |x| + |y| od startu, w jakiej robot był po którymś poleceniu F.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy polecenie L, R albo F k.'],
            output_format: ['Dwa wiersze: pozycja X Y, kierunek K i najdalej: D.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 1000'],
            examples: [{ input: '6\nF 3\nR\nF 2\nR\nR\nF 7', note: 'Po F 3 robot jest w (0, 3), po obrocie w prawo patrzy na E i idzie do (2, 3) — odległość 5. Dwa obroty w prawo to W, więc F 7 kończy w (−5, 3): odległość 8.' }],
            hint: R`Obrót w prawo: N → E → S → W → N; w lewo odwrotnie. Najprościej trzymać string KIER = "NESW" i indeks — prawo to (i + 1) % 4, lewo to (i + 3) % 4. W naprzod: if (kier == 'N') y += k; i tak dalej. Odległość sprawdzaj po każdym F — w czasie jednego ruchu po prostej największa jest na którymś końcu.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => { const p = r(); return p < 0.2 ? 'L' : p < 0.4 ? 'R' : `F ${r.int(1, m)}`; });
                return [d(['L']), d(['F 1000', 'F 1000', 'R', 'R', 'F 1000', 'L', 'L', 'L', 'F 5']), d(los(12, 10)), d(los(1000, 1000)), d(Array.from({ length: 1000 }, (_, i) => (i % 2 ? 'L' : `F ${r.int(1, 1000)}`)))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n'; return L.slice(1).every((l) => l === 'L' || l === 'R' || (/^F \d+$/.test(l) && calk(Number(l.slice(2)), 1, 1000))) ? null : 'polecenie'; },
            solve: (inp) => {
                const K = 'NESW', dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];
                let x = 0, y = 0, k = 0, mx = 0;
                for (const l of linie(inp).slice(1)) {
                    if (l === 'L') k = (k + 3) % 4; else if (l === 'R') k = (k + 1) % 4; else { const s = Number(l.slice(2)); x += dx[k] * s; y += dy[k] * s; mx = Math.max(mx, Math.abs(x) + Math.abs(y)); }
                }
                return `pozycja ${x} ${y}, kierunek ${K[k]}\nnajdalej: ${mx}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Robot {
    int x = 0, y = 0;
    char kier = 'N';
    void prawo() {
        if (kier == 'N') kier = 'E';
        else if (kier == 'E') kier = 'S';
        else if (kier == 'S') kier = 'W';
        else kier = 'N';
    }
    void lewo() {
        prawo();
        prawo();
        prawo();
    }
    void naprzod(int k) {
        if (kier == 'N') y += k;
        if (kier == 'E') x += k;
        if (kier == 'S') y -= k;
        if (kier == 'W') x -= k;
    }
};
int main() {
    int n;
    cin >> n;
    Robot rob;
    int najdalej = 0;
    for (int i = 0; i < n; i++) {
        char c;
        cin >> c;
        if (c == 'L') rob.lewo();
        else if (c == 'R') rob.prawo();
        else {
            int k;
            cin >> k;
            rob.naprzod(k);
            najdalej = max(najdalej, abs(rob.x) + abs(rob.y));
        }
    }
    cout << "pozycja " << rob.x << " " << rob.y << ", kierunek " << rob.kier << "\n";
    cout << "najdalej: " << najdalej << "\n";
    return 0;
}`,
        },
        {
            id: 'st-stoper', krok: 6, level: 'latwe',
            title: 'Stoper z okrążeniami',
            short: 'Stoper sam liczy łączny czas i pamięta najszybsze okrążenie. Każde wywołanie metody okrazenie(s) aktualizuje kilka pól naraz.',
            tags: ['stan w polach', 'metoda aktualizująca kilka pól', 'format MM:SS'],
            statement: ['Trener mierzy czasy okrążeń zawodnika. Napisz strukturę Stoper z polami (z wartościami domyślnymi) razem = 0, licznik = 0, najlepszy = 0, nrNajlepszego = 0 i metodą void okrazenie(int s), która dolicza okrążenie trwające s sekund: zwiększa licznik i łączny czas i sprawdza, czy to nowe najszybsze okrążenie (przy remisie najszybsze zostaje wcześniejsze).',
                'Po każdym okrążeniu wypisz okrazenie I: MM:SS, razem MM:SS, a na końcu najszybsze: okrazenie K (MM:SS).'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n czasów okrążeń w sekundach.'],
            output_format: ['n wierszy z okrążeniami i wiersz o najszybszym okrążeniu.'],
            constraints: ['1 ≤ n ≤ 30', '1 ≤ czas okrążenia ≤ 199'],
            examples: [{ input: '4\n75 71 80 71', note: 'Łącznie: 01:15, 02:26, 03:46, 04:57. Najszybsze jest 71 s — dwa razy, więc wygrywa okrążenie 2.' }],
            hint: R`void okrazenie(int s) { licznik++; razem += s; if (licznik == 1 || s < najlepszy) { najlepszy = s; nrNajlepszego = licznik; } }. Czas MM:SS: setw(2) << setfill('0') << s / 60 << ":" << setw(2) << s % 60 — zrób z tego funkcję.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d(Array(30).fill(199)), d([90, 80, 70, 60, 70, 60]), d(Array.from({ length: 30 }, () => r.int(1, 199))), d(Array.from({ length: 12 }, () => r.int(60, 65)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 30) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 199)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp).slice(1); let s = 0, b = 0, nb = 0; const o = [];
                t.forEach((x, i) => { s += x; if (i === 0 || x < b) { b = x; nb = i + 1; } o.push(`okrazenie ${i + 1}: ${mmss(x)}, razem ${mmss(s)}`); });
                o.push(`najszybsze: okrazenie ${nb} (${mmss(b)})`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void czas(int s) {
    cout << setfill('0') << setw(2) << s / 60 << ":" << setw(2) << s % 60;
}
struct Stoper {
    int razem = 0, licznik = 0, najlepszy = 0, nrNajlepszego = 0;
    void okrazenie(int s) {
        licznik++;
        razem += s;
        if (licznik == 1 || s < najlepszy) {
            najlepszy = s;
            nrNajlepszego = licznik;
        }
    }
};
int main() {
    int n;
    cin >> n;
    Stoper st;
    for (int i = 0; i < n; i++) {
        int s;
        cin >> s;
        st.okrazenie(s);
        cout << "okrazenie " << st.licznik << ": ";
        czas(s);
        cout << ", razem ";
        czas(st.razem);
        cout << "\n";
    }
    cout << "najszybsze: okrazenie " << st.nrNajlepszego << " (";
    czas(st.najlepszy);
    cout << ")\n";
    return 0;
}`,
        },
        {
            id: 'st-zamek-szyfrowy', krok: 6, level: 'srednie',
            title: 'Zamek szyfrowy',
            short: 'Zamek to stan (otwarty, zablokowany, liczba błędów) i metody, które go zmieniają. Trzy złe kody blokują zamek do wizyty serwisanta.',
            tags: ['stan w kilku polach', 'metody z regułami', 'symulacja poleceń'],
            statement: ['Szafka w szatni ma zamek szyfrowy. Na początku jest zamknięta, niezablokowana i bez błędnych prób. Obsłuż q poleceń:',
                'WPISZ k — gdy zamek jest zablokowany: zablokowany; gdy jest otwarty: juz otwarty; gdy k to poprawny kod: zamek się otwiera, licznik błędów wraca do 0 — wypisz otwarty; w przeciwnym razie licznik błędów rośnie o 1 i wypisz zly kod, a jeśli to już trzecia błędna próba z rzędu — zamek się blokuje i wypisz zly kod, zamek zablokowany. ZAMKNIJ — gdy zamek jest otwarty, zamyka go (zamkniety), inaczej juz zamkniety. ZMIEN a b — gdy zamek jest otwarty i a to obecny kod, kod zmienia się na b (kod zmieniony), inaczej odmowa. ODBLOKUJ — serwisant zdejmuje blokadę i zeruje licznik błędów (odblokowany). STAN — zablokowany, otwarty albo zamkniety.',
                'Napisz strukturę Zamek z polami i metodą dla każdego polecenia.'],
            input_format: ['W pierwszym wierszu początkowy kod.', 'W drugim wierszu q, potem q wierszy z poleceniami.'],
            output_format: ['q wierszy — odpowiedzi zamka.'],
            constraints: ['1 ≤ q ≤ 1000', 'Kody to napisy z 4–8 cyfr.'],
            examples: [{ input: '1234\n8\nWPISZ 1111\nWPISZ 1234\nZMIEN 1234 4321\nZAMKNIJ\nWPISZ 1234\nWPISZ 0000\nWPISZ 9999\nWPISZ 4321', note: 'Pomyłka, potem poprawny kod otwiera zamek i zeruje błędy. Kod zmienia się na 4321, zamek się zamyka, a trzy złe kody z rzędu go blokują — nawet dobry kod już nie pomaga.' }],
            hint: R`struct Zamek { string kod; bool otwarty = false, zablokowany = false; int bledne = 0; … };. Każde polecenie to jedna metoda, która sprawdza warunki w kolejności z treści i wypisuje odpowiedź. Kody porównuj jako napisy — 0042 to nie to samo co 42.`,
            tests: (r) => {
                const kod = () => Array.from({ length: r.int(4, 8) }, () => r.int(0, 9)).join('');
                const d = (k, o) => `${k}\n${o.length}\n${o.join('\n')}`;
                const sesja = (q) => {
                    let k = kod(); const k0 = k; let otw = false; const o = [];
                    while (o.length < q) {
                        const p = r();
                        if (p < 0.35) o.push(`WPISZ ${r() < 0.5 ? k : kod()}`);
                        else if (p < 0.5) o.push('ZAMKNIJ');
                        else if (p < 0.62) { const nk = kod(); o.push(`ZMIEN ${r() < 0.7 ? k : kod()} ${nk}`); }
                        else if (p < 0.72) o.push('ODBLOKUJ');
                        else o.push('STAN');
                        // śledzimy kod, żeby WPISZ często trafiało (symulacja jak w solve)
                        const s = symuluj(k0, o); k = s.kod; otw = s.otwarty;
                    }
                    return d(k0, o);
                };
                return [d('0000', ['STAN']), d('0042', ['WPISZ 4200', 'WPISZ 00042', 'WPISZ 0042', 'WPISZ 0042', 'ZAMKNIJ', 'ZAMKNIJ', 'ZMIEN 0042 1111', 'STAN', 'WPISZ 1111', 'WPISZ 2222', 'WPISZ 3333', 'WPISZ 0042', 'STAN', 'ZMIEN 0042 9999', 'ODBLOKUJ', 'STAN', 'WPISZ 0042', 'ZMIEN 0042 12345678', 'ZAMKNIJ', 'WPISZ 12345678']), sesja(30), sesja(1000), sesja(300)];
            },
            check: (inp) => {
                const L = linie(inp); if (!/^\d{4,8}$/.test(L[0])) return 'kod';
                const q = Number(L[1]); if (!calk(q, 1, 1000) || L.length !== q + 2) return 'q';
                return L.slice(2).every((l) => /^(WPISZ \d{4,8}|ZAMKNIJ|ZMIEN \d{4,8} \d{4,8}|ODBLOKUJ|STAN)$/.test(l)) ? null : 'polecenie';
            },
            solve: (inp) => { const L = linie(inp); return symuluj(L[0], L.slice(2)).o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Zamek {
    string kod;
    bool otwarty = false, zablokowany = false;
    int bledne = 0;
    void wpisz(const string &k) {
        if (zablokowany) {
            cout << "zablokowany\n";
        } else if (otwarty) {
            cout << "juz otwarty\n";
        } else if (k == kod) {
            otwarty = true;
            bledne = 0;
            cout << "otwarty\n";
        } else {
            bledne++;
            if (bledne == 3) {
                zablokowany = true;
                cout << "zly kod, zamek zablokowany\n";
            } else {
                cout << "zly kod\n";
            }
        }
    }
    void zamknij() {
        if (otwarty) {
            otwarty = false;
            cout << "zamkniety\n";
        } else {
            cout << "juz zamkniety\n";
        }
    }
    void zmien(const string &a, const string &b) {
        if (otwarty && a == kod) {
            kod = b;
            cout << "kod zmieniony\n";
        } else {
            cout << "odmowa\n";
        }
    }
    void odblokuj() {
        zablokowany = false;
        bledne = 0;
        cout << "odblokowany\n";
    }
    void stan() {
        if (zablokowany) cout << "zablokowany\n";
        else if (otwarty) cout << "otwarty\n";
        else cout << "zamkniety\n";
    }
};
int main() {
    Zamek z;
    cin >> z.kod;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "WPISZ") {
            string k;
            cin >> k;
            z.wpisz(k);
        } else if (p == "ZAMKNIJ") {
            z.zamknij();
        } else if (p == "ZMIEN") {
            string a, b;
            cin >> a >> b;
            z.zmien(a, b);
        } else if (p == "ODBLOKUJ") {
            z.odblokuj();
        } else {
            z.stan();
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-data-metody', krok: 6, level: 'srednie',
            title: 'Kalendarz z metodami',
            short: 'Data, która sama wie, czy rok jest przestępny, ile dni ma miesiąc i jak przejść do jutra. Metody wołają inne metody.',
            tags: ['metoda wołająca metodę', 'rok przestępny', 'void nastepny()'],
            statement: ['Napisz strukturę Data z polami d, m, r i metodami: bool przestepny(), int dniWMiesiacu() (korzysta z przestepny), void nastepny() — przesuwa datę na następny dzień (także przez koniec miesiąca i roku) — oraz int dzienRoku() — numer dnia w roku (1 stycznia to 1).',
                'Dla każdego z t zapytań wypisz datę po k dniach i jej numer dnia w roku. Rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy data (d m r) i k.'],
            output_format: ['t wierszy: DD.MM.RRRR, dzien roku N.'],
            constraints: ['1 ≤ t ≤ 100', 'Daty są poprawne, lata od 1900 do 2100.', '0 ≤ k ≤ 100 000'],
            examples: [{ input: '3\n28 2 2024 1\n31 12 2025 1\n1 3 1900 365', note: '2024 jest przestępny, więc po 28 lutego jest 29 lutego (dzień 60.). Po sylwestrze 2025 jest 1.01.2026. Rok 1900 nie jest przestępny — 365 dni po 1 marca 1900 jest 1 marca 1901.' }],
            hint: R`void nastepny() { d++; if (d > dniWMiesiacu()) { d = 1; m++; if (m > 12) { m = 1; r++; } } }. dzienRoku: zsumuj dni miesięcy przed m — do tego wygodnie jest na chwilę zmienić m w kopii: Data x = *this; … albo napisać pętlę z tablicą długości miesięcy.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                return [d([[1, 1, 1900, 0], [31, 12, 2100, 0]]), d([[28, 2, 2000, 1], [28, 2, 1900, 1], [28, 2, 2100, 1], [29, 2, 2024, 365], [31, 1, 2025, 28]]), d(Array.from({ length: 20 }, () => [...losData(r, 1990, 2030), r.int(0, 400)])), d(Array.from({ length: 100 }, () => [...losData(r, 1900, 2100), r.int(0, 100000)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 100) || t.length !== 1 + 4 * t[0]) return 't'; for (let i = 1; i < t.length; i += 4) if (!P.czyPoprawnaData(t[i], t[i + 1], t[i + 2]) || !calk(t[i + 2], 1900, 2100) || !calk(t[i + 3], 0, 100000)) return 'dane'; return null; },
            solve: (inp) => {
                const t = nums(inp); const o = [];
                for (let i = 1; i < t.length; i += 4) {
                    const [dd, mm, rr] = P.zNumeru(P.numerDnia(t[i], t[i + 1], t[i + 2]) + t[i + 3]);
                    o.push(`${dataTxt(dd, mm, rr)}, dzien roku ${P.numerDnia(dd, mm, rr) - P.numerDnia(1, 1, rr) + 1}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Data {
    int d, m, r;
    bool przestepny() {
        return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
    }
    int dniWMiesiacu() {
        if (m == 2) return przestepny() ? 29 : 28;
        if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
        return 31;
    }
    void nastepny() {
        d++;
        if (d > dniWMiesiacu()) {
            d = 1;
            m++;
            if (m > 12) {
                m = 1;
                r++;
            }
        }
    }
    int dzienRoku() {
        Data x = {1, 1, r};
        int nr = 1;
        while (x.m != m || x.d != d) {
            x.nastepny();
            nr++;
        }
        return nr;
    }
};
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        Data x;
        int k;
        cin >> x.d >> x.m >> x.r >> k;
        for (int j = 0; j < k; j++) x.nastepny();
        cout << setfill('0') << setw(2) << x.d << "." << setw(2) << x.m << "." << x.r << ", dzien roku " << x.dzienRoku() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'st-poziomy-postaci', krok: 6, level: 'srednie',
            title: 'Poziomy postaci',
            short: 'Metoda dodajXP może dać kilka awansów naraz — pętla while w środku metody, a próg na następny poziom liczy inna metoda.',
            tags: ['pętla w metodzie', 'metoda licząca próg', 'kilka awansów naraz'],
            statement: ['W grze postać zaczyna na poziomie 1 z 0 punktami doświadczenia (xp). Żeby awansować z poziomu p na p + 1, potrzeba 100 · p xp: gdy xp osiągnie ten próg, odejmujemy go, a poziom rośnie o 1 — i może od razu awansować dalej, jeśli xp wciąż wystarcza.',
                'Napisz strukturę Postac z polami nick, poziom = 1, xp = 0 i metodami long long potrzeba() oraz void dodajXP(long long x). Obsłuż q zdarzeń: XP x — postać dostaje x punktów (każdy awans wypisz jako NICK awansuje na poziom P), STAN — wypisz NICK: poziom P, xp X/Y, gdzie Y to próg na następny poziom.'],
            input_format: ['W pierwszym wierszu nick.', 'W drugim wierszu q, potem q wierszy ze zdarzeniami.'],
            output_format: ['Komunikaty o awansach i stanie, w kolejności zdarzeń.'],
            constraints: ['1 ≤ q ≤ 400', '1 ≤ x ≤ 10 000', 'Nick ma od 1 do 12 znaków (litery i cyfry).'],
            examples: [{ input: 'Smok7\n4\nXP 50\nSTAN\nXP 290\nSTAN', note: 'Po 50 xp: poziom 1, 50/100. Dostaje 290: ma 340 — awans na 2 (zostaje 240), awans na 3 (zostaje 40), bo próg na 3 to 200. Próg na 4 to 300.' }],
            hint: R`void dodajXP(long long x) { xp += x; while (xp >= potrzeba()) { xp -= potrzeba(); poziom++; cout << nick << " awansuje na poziom " << poziom << "\n"; } }. Kolejność ma znaczenie: najpierw odejmij próg obecnego poziomu, dopiero potem zwiększ poziom.`,
            tests: (r) => {
                const d = (n, o) => `${n}\n${o.length}\n${o.join('\n')}`;
                const los = (q, m) => Array.from({ length: q }, () => (r() < 0.7 ? `XP ${r.int(1, m)}` : 'STAN'));
                return [d('A', ['STAN']), d('Gracz1', ['XP 99', 'STAN', 'XP 1', 'STAN', 'XP 10000', 'STAN']), d('Rycerz', los(20, 500)), d('Mag2026', los(400, 10000)), d('x', Array(400).fill('XP 10000'))];
            },
            check: (inp) => { const L = linie(inp); if (!/^[A-Za-z0-9]{1,12}$/.test(L[0])) return 'nick'; const q = Number(L[1]); if (!calk(q, 1, 400) || L.length !== q + 2) return 'q'; return L.slice(2).every((l) => l === 'STAN' || (/^XP \d+$/.test(l) && calk(Number(l.slice(3)), 1, 10000))) ? null : 'zdarzenie'; },
            solve: (inp) => {
                const L = linie(inp); const n = L[0]; let p = 1, xp = 0; const o = [];
                for (const l of L.slice(2)) {
                    if (l === 'STAN') { o.push(`${n}: poziom ${p}, xp ${xp}/${100 * p}`); continue; }
                    xp += Number(l.slice(3));
                    while (xp >= 100 * p) { xp -= 100 * p; p++; o.push(`${n} awansuje na poziom ${p}`); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Postac {
    string nick;
    int poziom = 1;
    long long xp = 0;
    long long potrzeba() {
        return 100LL * poziom;
    }
    void dodajXP(long long x) {
        xp += x;
        while (xp >= potrzeba()) {
            xp -= potrzeba();
            poziom++;
            cout << nick << " awansuje na poziom " << poziom << "\n";
        }
    }
    void stan() {
        cout << nick << ": poziom " << poziom << ", xp " << xp << "/" << potrzeba() << "\n";
    }
};
int main() {
    Postac p;
    cin >> p.nick;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string z;
        cin >> z;
        if (z == "XP") {
            long long x;
            cin >> x;
            p.dodajXP(x);
        } else {
            p.stan();
        }
    }
    return 0;
}`,
        },
        {
            id: 'st-termometr', krok: 6, level: 'srednie',
            title: 'Termometr ze statystyką',
            short: 'Termometr pamięta liczbę pomiarów, sumę, minimum i maksimum. Metody dodaj, reset i srednia — i obsługa „jeszcze nic nie zmierzono”.',
            tags: ['statystyka w polach', 'metoda reset', 'pusty stan'],
            statement: ['Inteligentny termometr zbiera pomiary. Napisz strukturę Termometr z polami ile = 0, suma = 0, mn, mx i metodami void dodaj(int t), void reset() (zapomina wszystkie pomiary), bool pusty() i double srednia().',
                'Obsłuż q poleceń: POMIAR t — nowy pomiar; SREDNIA — wypisz srednia: X.XX; MIN i MAX — wypisz min: T albo max: T; RESET — zapomnij pomiary (nic nie wypisuje). Jeśli od ostatniego resetu (albo od początku) nie było pomiarów, SREDNIA, MIN i MAX wypisują brak pomiarow.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersze wypisane przez SREDNIA, MIN i MAX.'],
            constraints: ['1 ≤ q ≤ 1000', '−50 ≤ t ≤ 50', 'Średnia nigdy nie wypada dokładnie w połowie między dwoma wynikami z dwoma miejscami po przecinku.', 'Program wypisuje co najmniej jeden wiersz.'],
            examples: [{ input: '8\nMAX\nPOMIAR 12\nPOMIAR -3\nPOMIAR 7\nSREDNIA\nMIN\nRESET\nSREDNIA', note: 'Na początku nie ma pomiarów. Średnia z 12, −3 i 7 to 16 / 3 = 5.33, minimum −3. Po RESET znowu nic nie ma.' }],
            hint: R`void dodaj(int t) { if (ile == 0) { mn = t; mx = t; } else { mn = min(mn, t); mx = max(mx, t); } ile++; suma += t; }. reset() ustawia ile = 0 i suma = 0 — mn i mx nie trzeba czyścić, bo przy pierwszym pomiarze i tak się nadpiszą.`,
            tests: (r) => {
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                const sesja = (q, pReset) => {
                    const o = []; let ile = 0, s = 0;
                    while (o.length < q) {
                        const p = r();
                        if (p < 0.55) { const t = r.int(-50, 50); o.push(`POMIAR ${t}`); ile++; s += t; }
                        else if (p < 0.55 + pReset) { o.push('RESET'); ile = 0; s = 0; }
                        else if (p < 0.8) { if (ile === 0 || h.safe(s / ile, 2)) o.push('SREDNIA'); }
                        else o.push(r() < 0.5 ? 'MIN' : 'MAX');
                    }
                    o.push('MAX');
                    return o;
                };
                return [d(['SREDNIA']), d(['POMIAR -50', 'POMIAR 50', 'SREDNIA', 'MIN', 'MAX', 'RESET', 'MIN', 'POMIAR 0', 'MAX', 'SREDNIA']), d(sesja(25, 0.05)), d(sesja(999, 0.02)), d(sesja(500, 0.15))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q';
                let ile = 0, s = 0, wyp = 0;
                for (const l of L.slice(1)) {
                    if (/^POMIAR -?\d+$/.test(l)) { const t = Number(l.slice(7)); if (!calk(t, -50, 50)) return 't'; ile++; s += t; }
                    else if (l === 'RESET') { ile = 0; s = 0; }
                    else if (l === 'SREDNIA') { wyp++; if (ile && !h.safe(s / ile, 2)) return 'polowka'; }
                    else if (l === 'MIN' || l === 'MAX') wyp++;
                    else return 'polecenie';
                }
                return wyp ? null : 'nic nie wypisuje';
            },
            solve: (inp) => {
                let ile = 0, s = 0, mn = 0, mx = 0; const o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l.startsWith('POMIAR')) { const t = Number(l.slice(7)); if (!ile) { mn = t; mx = t; } else { mn = Math.min(mn, t); mx = Math.max(mx, t); } ile++; s += t; }
                    else if (l === 'RESET') { ile = 0; s = 0; }
                    else if (!ile) o.push('brak pomiarow');
                    else if (l === 'SREDNIA') o.push(`srednia: ${h.fx(s / ile, 2)}`);
                    else if (l === 'MIN') o.push(`min: ${mn}`);
                    else o.push(`max: ${mx}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Termometr {
    int ile = 0;
    long long suma = 0;
    int mn = 0, mx = 0;
    void dodaj(int t) {
        if (ile == 0) {
            mn = t;
            mx = t;
        } else {
            mn = min(mn, t);
            mx = max(mx, t);
        }
        ile++;
        suma += t;
    }
    void reset() {
        ile = 0;
        suma = 0;
    }
    bool pusty() {
        return ile == 0;
    }
    double srednia() {
        return (double)suma / ile;
    }
};
int main() {
    int q;
    cin >> q;
    Termometr t;
    cout << fixed << setprecision(2);
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "POMIAR") {
            int x;
            cin >> x;
            t.dodaj(x);
        } else if (p == "RESET") {
            t.reset();
        } else if (t.pusty()) {
            cout << "brak pomiarow\n";
        } else if (p == "SREDNIA") {
            cout << "srednia: " << t.srednia() << "\n";
        } else if (p == "MIN") {
            cout << "min: " << t.mn << "\n";
        } else {
            cout << "max: " << t.mx << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
