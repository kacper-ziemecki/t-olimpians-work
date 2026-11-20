// Funkcje — ćwiczenia w trakcie lekcji, części 4–6: funkcje-pytania (bool, return warunku, return w pętli, każda ścieżka
// z return, funkcje-pytania w pętlach), zasięg (zmienne lokalne i globalne, globalne tablice, czyszczenie przed testem,
// duża tablica globalnie, stan gry w zmiennych globalnych) oraz referencje (&: zmiana oryginału, kilka wyników naraz,
// ta sama funkcja dla różnych zmiennych, napis zmieniany w miejscu, koszt kopiowania vectora i const &).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./funkcje-pomoc');
    const { calk, czyPierwsza, sumaCyfr, odwroc, czyPoprawnaData, generuj, dobryGen } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');

    return [
        // ================================================================ KROK 4 · funkcje-pytania
        {
            id: 'fun-izogramy', krok: 4, level: 'latwe',
            title: 'Słowa bez powtórzonych liter',
            short: 'Izogram to słowo, w którym żadna litera się nie powtarza. bool izogram(s) kończy pracę przy pierwszej powtórce.',
            tags: ['funkcja bool', 'return w pętli', 'pętla w pętli'],
            statement: ['Izogram to słowo, w którym każda litera występuje najwyżej raz — na przykład kot albo biurko. Słowo mama nie jest izogramem.',
                'Napisz funkcję bool izogram(string s). Gdy tylko znajdziesz dwie takie same litery, od razu zwróć false. Dla każdego z n słów wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy jedno słowo.'],
            output_format: ['n wierszy: TAK, gdy słowo jest izogramem, NIE w przeciwnym razie.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 30 małych liter.'],
            examples: [{ input: '4\nkot\nmama\nzeszyt\nbiurko', note: 'W mama powtarza się m i a, w zeszyt — z. kot i biurko mają same różne litery.' }],
            hint: R`bool izogram(string s) { for (int i = 0; i < s.size(); i++) for (int j = i + 1; j < s.size(); j++) if (s[i] == s[j]) return false; return true; }. return false przerywa obie pętle i całą funkcję. Do return true dochodzimy tylko wtedy, gdy żadna para się nie powtórzyła.`,
            tests: (r) => {
                const iz = (n) => r.shuffle('abcdefghijklmnopqrstuvwxyz'.split('')).slice(0, n).join('');
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const los = () => (r() < 0.5 ? iz(r.int(1, 26)) : r.word(r.int(1, 30)));
                return [d(['a']), d(['aa', 'ab', 'abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyza']), d(Array.from({ length: 20 }, los)), d(Array.from({ length: 1000 }, los))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((s) => /^[a-z]{1,30}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => (new Set(s).size === s.length ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool izogram(string s) {
    for (int i = 0; i < (int)s.size(); i++)
        for (int j = i + 1; j < (int)s.size(); j++)
            if (s[i] == s[j]) return false;
    return true;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        if (izogram(s)) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-rosnace-cyfry', krok: 4, level: 'latwe',
            title: 'Cyfry jak po schodach',
            short: 'Ile liczb z przedziału ma cyfry rosnące od lewej do prawej, jak 1359? bool rosnace(x) i licznik w pętli po przedziale.',
            tags: ['funkcja bool', 'cyfry od końca', 'liczenie spełniających'],
            statement: ['Liczba ma cyfry „jak po schodach”, jeśli każda jej cyfra jest większa od cyfry stojącej przed nią (z lewej): 1359 i 7 tak, ale 1123 i 980 nie.',
                'Napisz funkcję bool rosnace(int x) i dla każdego z q przedziałów [a, b] policz, ile liczb z przedziału ma tę własność.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy liczby a i b.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ q ≤ 10', '1 ≤ a ≤ b ≤ 10⁶'],
            examples: [{ input: '1\n1 20', note: 'Wszystkie cyfry 1–9 (każda ma jedną cyfrę) i liczby 12, 13, …, 19 — razem 17. Liczby 10, 11 i 20 odpadają.' }],
            hint: R`Najłatwiej sprawdzać od końca: ostatnia cyfra to x % 10, przedostatnia (x / 10) % 10. bool rosnace(int x) { while (x >= 10) { if (x % 10 <= (x / 10) % 10) return false; x /= 10; } return true; }. W main: for (int i = a; i <= b; i++) if (rosnace(i)) ile++;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([[1, 1]]), d([[10, 11], [123456, 123456], [123457, 123457], [1, 1000000]]), d(Array.from({ length: 10 }, () => { const a = r.int(1, 999000); return [a, a + r.int(0, 1000)]; })), d(Array.from({ length: 10 }, () => [r.int(1, 10), 1000000]))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) && t.slice(1).every((x, i, a) => i % 2 === 0 || a[i - 1] <= x) ? null : 'dane'; },
            solve: (inp) => {
                const ok = (x) => { const c = String(x); for (let i = 1; i < c.length; i++) if (c[i] <= c[i - 1]) return false; return true; };
                const pref = new Int32Array(1000001); for (let i = 1; i <= 1000000; i++) pref[i] = pref[i - 1] + (ok(i) ? 1 : 0);
                const t = nums(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) o.push(pref[t[i + 1]] - pref[t[i] - 1]); return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool rosnace(int x) {
    while (x >= 10) {
        if (x % 10 <= (x / 10) % 10) return false;
        x /= 10;
    }
    return true;
}
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        int ile = 0;
        for (int i = a; i <= b; i++)
            if (rosnace(i)) ile++;
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-data-poprawna', krok: 4, level: 'srednie',
            title: 'Czy taka data istnieje?',
            short: 'Trzy funkcje, które się wołają: przestepny(r), dniWMiesiacu(m, r) i poprawna(d, m, r). Czy 29.02 to prawdziwa data — zależy od roku.',
            tags: ['funkcje bool', 'funkcja woła funkcję', 'wczesny return'],
            statement: ['Formularz w szkolnym systemie przyjmuje datę jako trzy liczby: dzień, miesiąc i rok. Sprawdź, które daty naprawdę istnieją (w kalendarzu gregoriańskim).',
                'Rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400. Luty ma wtedy 29 dni, w innych latach 28. Kwiecień, czerwiec, wrzesień i listopad mają 30 dni, pozostałe miesiące — 31.',
                'Napisz funkcje bool przestepny(int r), int dniWMiesiacu(int m, int r) i bool poprawna(int d, int m, int r) — każda następna korzysta z poprzedniej.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy trzy liczby: d, m i r.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ d, m ≤ 99', '1 ≤ r ≤ 9999'],
            examples: [{ input: '4\n29 2 2024\n29 2 2023\n31 4 2025\n15 13 2020', note: '2024 jest przestępny, więc 29 lutego istnieje; w 2023 — nie. Kwiecień ma 30 dni. Miesiąca 13 nie ma.' }],
            hint: R`bool poprawna(int d, int m, int r) { if (m < 1 || m > 12) return false; if (d < 1) return false; return d <= dniWMiesiacu(m, r); } — miesiąc sprawdź najpierw, bo dniWMiesiacu(13, r) nie ma sensu. Najczęstsze pułapki: rok 1900 nie jest przestępny, a 2000 jest.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const blisko = () => { const m = r.int(0, 13); return [r.int(26, 32), m, r.pick([1900, 2000, 2024, 2023, 2100, 2400, 1600, 4, 1, 9999, r.int(1, 9999)])]; };
                return [d([[1, 1, 1]]), d([[29, 2, 1900], [29, 2, 2000], [29, 2, 2100], [29, 2, 2400], [31, 12, 9999], [0, 1, 2000], [1, 0, 2000], [31, 6, 2020], [31, 7, 2020]]),
                    d(Array.from({ length: 50 }, blisko)), d(Array.from({ length: 1000 }, () => (r() < 0.6 ? blisko() : [r.int(0, 99), r.int(0, 99), r.int(1, 9999)])))];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 1000) || t.length !== 3 * n + 1) return 'n'; for (let i = 1; i < t.length; i += 3) if (!calk(t[i], 0, 99) || !calk(t[i + 1], 0, 99) || !calk(t[i + 2], 1, 9999)) return 'zakres'; return null; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 1; i < t.length; i += 3) o.push(czyPoprawnaData(t[i], t[i + 1], t[i + 2]) ? 'TAK' : 'NIE'); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool przestepny(int r) {
    return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
}
int dniWMiesiacu(int m, int r) {
    if (m == 2) {
        if (przestepny(r)) return 29;
        return 28;
    }
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}
bool poprawna(int d, int m, int r) {
    if (m < 1 || m > 12) return false;
    if (d < 1) return false;
    return d <= dniWMiesiacu(m, r);
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int d, m, r;
        cin >> d >> m >> r;
        cout << (poprawna(d, m, r) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-haslo-reguly', krok: 4, level: 'srednie',
            title: 'Co jest nie tak z hasłem?',
            short: 'Pięć reguł hasła sprawdzanych po kolei — wypisz pierwszą złamaną albo OK. Funkcje-pytania maCyfre, maWielka… i ocena z wczesnymi return.',
            tags: ['funkcje bool', 'wczesny return', 'funkcja zwracająca string'],
            statement: ['Serwis sprawdza hasła według pięciu reguł, zawsze w tej kolejności:',
                '1) co najmniej 8 znaków — inaczej ZA KROTKIE; 2) co najmniej jedna cyfra — inaczej BRAK CYFRY; 3) co najmniej jedna wielka litera — inaczej BRAK WIELKIEJ LITERY; 4) co najmniej jedna mała litera — inaczej BRAK MALEJ LITERY; 5) co najmniej jeden ze znaków !@#$%^&* — inaczej BRAK ZNAKU SPECJALNEGO.',
                'Dla każdego hasła wypisz komunikat pierwszej złamanej reguły albo OK, gdy hasło spełnia wszystkie. Napisz funkcje bool maCyfre(string s), bool maWielka(string s), bool maMala(string s), bool maSpecjalny(string s) oraz string ocena(string s).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy jedno hasło (bez spacji).'],
            output_format: ['n wierszy z komunikatami.'],
            constraints: ['1 ≤ n ≤ 1000', 'Hasło ma od 1 do 30 znaków: litery angielskie, cyfry i znaki !@#$%^&*'],
            examples: [{ input: '4\nKot123\nKotki123\nKotki!23\nkotki!23', note: 'Kot123 ma tylko 6 znaków. Kotki123 nie ma znaku specjalnego. Kotki!23 jest OK. kotki!23 nie ma wielkiej litery — i to jest pierwsza złamana reguła.' }],
            hint: R`Każda funkcja-pytanie to pętla z return true przy pierwszym trafieniu, np. bool maCyfre(string s) { for (char c : s) if (c >= '0' && c <= '9') return true; return false; }. string ocena(string s) { if (s.size() < 8) return "ZA KROTKIE"; if (!maCyfre(s)) return "BRAK CYFRY"; … return "OK"; } — każdy return kończy funkcję, więc wypisze się tylko pierwszy problem.`,
            tests: (r) => {
                const SP = '!@#$%^&*';
                const AL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + SP;
                const z = (n) => r.word(n, AL);
                const zBez = (n, bez) => r.word(n, AL.split('').filter((c) => !bez.includes(c)).join(''));
                const los = () => { const p = r(); if (p < 0.15) return z(r.int(1, 7)); if (p < 0.3) return zBez(r.int(8, 20), '0123456789'); if (p < 0.45) return zBez(r.int(8, 20), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'); if (p < 0.6) return zBez(r.int(8, 20), 'abcdefghijklmnopqrstuvwxyz'); if (p < 0.75) return zBez(r.int(8, 20), SP); return z(r.int(8, 30)); };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['a']), d(['Abcdefg1!', 'ABCDEFG1!', 'abcdefg1!', 'Abcdefgh!', 'Abcdefg12', '1234567', '!!!!!!!!']), d(Array.from({ length: 30 }, los)), d(Array.from({ length: 1000 }, los))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((s) => /^[A-Za-z0-9!@#$%^&*]{1,30}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => {
                if (s.length < 8) return 'ZA KROTKIE';
                if (!/[0-9]/.test(s)) return 'BRAK CYFRY';
                if (!/[A-Z]/.test(s)) return 'BRAK WIELKIEJ LITERY';
                if (!/[a-z]/.test(s)) return 'BRAK MALEJ LITERY';
                if (!/[!@#$%^&*]/.test(s)) return 'BRAK ZNAKU SPECJALNEGO';
                return 'OK';
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool maCyfre(string s) {
    for (char c : s)
        if (c >= '0' && c <= '9') return true;
    return false;
}
bool maWielka(string s) {
    for (char c : s)
        if (c >= 'A' && c <= 'Z') return true;
    return false;
}
bool maMala(string s) {
    for (char c : s)
        if (c >= 'a' && c <= 'z') return true;
    return false;
}
bool maSpecjalny(string s) {
    string specjalne = "!@#$%^&*";
    for (char c : s)
        for (char z : specjalne)
            if (c == z) return true;
    return false;
}
string ocena(string s) {
    if (s.size() < 8) return "ZA KROTKIE";
    if (!maCyfre(s)) return "BRAK CYFRY";
    if (!maWielka(s)) return "BRAK WIELKIEJ LITERY";
    if (!maMala(s)) return "BRAK MALEJ LITERY";
    if (!maSpecjalny(s)) return "BRAK ZNAKU SPECJALNEGO";
    return "OK";
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        cout << ocena(s) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-lustrzane-pierwsze', krok: 4, level: 'srednie',
            title: 'Pierwsza w obie strony',
            short: 'Czy liczba i jej lustro (13 i 31) są obie pierwsze? Dwie funkcje: czyPierwsza z wczesnym return i odwroc — złożone w jednym warunku.',
            tags: ['funkcja bool', 'pierwszość do √n', 'dwie funkcje w warunku'],
            statement: ['Liczba jest pierwsza w obie strony, jeśli jest pierwsza ona sama i jej lustro — liczba o tych samych cyfrach w odwrotnej kolejności. 13 jest taka (31 też jest pierwsza), ale 23 nie (32 jest parzysta).',
                'Napisz bool czyPierwsza(long long x), która sprawdza dzielniki tylko do √x i kończy się przy pierwszym znalezionym, oraz long long odwroc(long long x). Dla każdej liczby wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu q.', 'W drugim wierszu q liczb.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10⁹'],
            examples: [{ input: '4\n13 23 2 11', note: '13 i 31 — obie pierwsze. 23 tak, ale 32 nie. 2 i 11 są swoimi lustrami i są pierwsze.' }],
            hint: R`bool czyPierwsza(long long x) { if (x < 2) return false; for (long long d = 2; d * d <= x; d++) if (x % d == 0) return false; return true; }. W main jeden warunek: if (czyPierwsza(x) && czyPierwsza(odwroc(x))). Dzięki d * d <= x pętla robi najwyżej ok. 31 623 obrotów dla x ≈ 10⁹, a nie miliard.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const pierwsza = (lo, hi) => { for (;;) { const x = r.int(lo, hi); if (czyPierwsza(x)) return x; } };
                const emirp = (lo, hi) => { for (;;) { const x = pierwsza(lo, hi); if (czyPierwsza(odwroc(x))) return x; } };
                return [d([1]), d([1000000000, 999999937, 739397, 10, 2, 3, 5, 7]), d(Array.from({ length: 30 }, (_, i) => i + 1)), d(Array.from({ length: 1000 }, () => (r() < 0.5 ? emirp(100000000, 999999999) : r() < 0.5 ? pierwsza(1, 1000000000) : r.int(1, 1000000000))))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((x) => (czyPierwsza(x) && czyPierwsza(odwroc(x)) ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool czyPierwsza(long long x) {
    if (x < 2) return false;
    for (long long d = 2; d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}
long long odwroc(long long x) {
    long long w = 0;
    while (x > 0) {
        w = w * 10 + x % 10;
        x /= 10;
    }
    return w;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        if (czyPierwsza(x) && czyPierwsza(odwroc(x))) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-obcinane-pierwsze', krok: 4, level: 'srednie',
            title: 'Pierwsza po każdym obcięciu',
            short: '7393, 739, 73 i 7 — wszystkie pierwsze. Funkcja-pytanie, która w pętli obcina ostatnią cyfrę i woła czyPierwsza.',
            tags: ['funkcja bool woła funkcję bool', 'return false w pętli', 'obcinanie cyfr'],
            statement: ['Liczbę nazwiemy uparcie pierwszą, jeśli jest pierwsza i pozostaje pierwsza po każdym obcięciu ostatniej cyfry — aż zostanie jedna cyfra. 7393 jest uparcie pierwsza: 7393, 739, 73 i 7 to liczby pierwsze. 41 nie jest: 4 nie jest pierwsza.',
                'Napisz bool czyPierwsza(long long x) i bool uparta(long long x). Dla każdej liczby wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu q.', 'W drugim wierszu q liczb.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10⁹'],
            examples: [{ input: '4\n7393 41 2399 10', note: '2399, 239, 23 i 2 są pierwsze — TAK. 10 nie jest pierwsza.' }],
            hint: R`bool uparta(long long x) { while (x > 0) { if (!czyPierwsza(x)) return false; x /= 10; } return true; } — x /= 10 obcina ostatnią cyfrę. Jedna funkcja bool używa drugiej, a pierwsze false kończy sprawdzanie.`,
            tests: (r) => {
                const up = (x) => { while (x > 0) { if (!czyPierwsza(x)) return false; x = Math.floor(x / 10); } return true; };
                const wszystkie = []; let fala = [2, 3, 5, 7];
                while (fala.length) { wszystkie.push(...fala); const nowa = []; for (const x of fala) for (const c of [1, 3, 7, 9]) { const y = x * 10 + c; if (y <= 1e9 && czyPierwsza(y)) nowa.push(y); } fala = nowa; }
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const prawie = () => { const x = r.pick(wszystkie); return x * 10 + r.pick([1, 3, 7, 9]); };
                return [d([1]), d(wszystkie), d(Array.from({ length: 200 }, prawie).filter((x) => x <= 1e9)), d(Array.from({ length: 1000 }, () => (r() < 0.3 ? r.pick(wszystkie) : r() < 0.5 ? Math.min(1e9, prawie()) : r.int(1, 1000000000))))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((x) => { while (x > 0) { if (!czyPierwsza(x)) return 'NIE'; x = Math.floor(x / 10); } return 'TAK'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool czyPierwsza(long long x) {
    if (x < 2) return false;
    for (long long d = 2; d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}
bool uparta(long long x) {
    while (x > 0) {
        if (!czyPierwsza(x)) return false;
        x /= 10;
    }
    return true;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        cout << (uparta(x) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-niven-za-rogiem', krok: 4, level: 'srednie',
            title: 'Najbliższa liczba Nivena',
            short: 'Liczba Nivena dzieli się przez sumę swoich cyfr (18: 1 + 8 = 9). Szukamy najmniejszej takiej ≥ x pętlą while (!niven(x)) x++.',
            tags: ['funkcja bool w warunku pętli', 'suma cyfr', 'szukanie pierwszej spełniającej'],
            statement: ['Liczba Nivena to liczba podzielna przez sumę swoich cyfr: 18 jest liczbą Nivena (18 : 9 = 2), a 19 nie (19 nie dzieli się przez 10).',
                'Napisz funkcje int sumaCyfr(long long x) i bool niven(long long x). Dla każdego zapytania x wypisz najmniejszą liczbę Nivena, która jest większa lub równa x.'],
            input_format: ['W pierwszym wierszu q.', 'W drugim wierszu q liczb.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10¹²'],
            examples: [{ input: '3\n10 11 13', note: '10 dzieli się przez 1 — od razu jest liczbą Nivena. Od 11 trzeba dojść do 12 (12 : 3 = 4). Od 13 — aż do 18.' }],
            hint: R`bool niven(long long x) { return x % sumaCyfr(x) == 0; }. Szukanie to krótka pętla: while (!niven(x)) x++; cout << x;. Funkcja-pytanie w warunku while czyta się jak zdanie: „dopóki x nie jest liczbą Nivena, idź dalej”.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d([1000000000000, 999999999999, 99, 100, 101]), d(Array.from({ length: 50 }, (_, i) => i + 1)), d(Array.from({ length: 1000 }, () => r.int(1, 999999) * 1000000 + r.int(0, 999999))), d(r.arr(1000, 1, 1000000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e12)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((x) => { while (x % sumaCyfr(x) !== 0) x++; return x; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int sumaCyfr(long long x) {
    int s = 0;
    while (x > 0) {
        s += x % 10;
        x /= 10;
    }
    return s;
}
bool niven(long long x) {
    return x % sumaCyfr(x) == 0;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        while (!niven(x)) x++;
        cout << x << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-filtr-liczb', krok: 4, level: 'srednie',
            title: 'Filtr liczb',
            short: 'Zapytanie „ile liczb z przedziału jest pierwszych i palindromami?”. Pięć funkcji-pytań i jedna, która sprawdza wszystkie warunki z listy.',
            tags: ['kilka funkcji bool', 'funkcja z pętlą po warunkach', 'wczesny return false'],
            statement: ['Każda litera to jedna własność liczby: P — liczba pierwsza, K — kwadrat liczby całkowitej, L — palindrom (czyta się tak samo od tyłu), N — liczba nieparzysta, S — parzysta suma cyfr.',
                'Każde zapytanie to przedział [a, b] i napis z liter. Policz liczby z przedziału, które mają wszystkie wymienione własności. Napisz osobną funkcję bool dla każdej własności i funkcję bool spelnia(int x, string w), która przechodzi po literach w i zwraca false przy pierwszej niespełnionej.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy: a, b i napis w.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ q ≤ 100', '1 ≤ a ≤ b ≤ 10⁵', 'Suma długości wszystkich przedziałów nie przekracza 3 · 10⁵.', 'w ma od 1 do 5 różnych liter spośród P, K, L, N, S.'],
            examples: [{ input: '2\n1 100 PL\n1 50 KN', note: 'Pierwsze palindromy do 100: 2, 3, 5, 7, 11 — pięć. Nieparzyste kwadraty do 50: 1, 9, 25, 49 — cztery.' }],
            hint: R`bool spelnia(int x, string w) { for (char c : w) { if (c == 'P' && !czyPierwsza(x)) return false; if (c == 'K' && !czyKwadrat(x)) return false; … } return true; }. czyKwadrat: int k = 0; while ((k + 1) * (k + 1) <= x) k++; return k * k == x; — albo z sqrt i poprawką. czyPalindrom: porównaj x z odwroc(x).`,
            tests: (r) => {
                const lit = () => r.shuffle(['P', 'K', 'L', 'N', 'S']).slice(0, r.int(1, 5)).join('');
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const przedzialy = (q, dl) => Array.from({ length: q }, () => { const a = r.int(1, 100000 - dl + 1); return [a, a + r.int(0, dl - 1), lit()]; });
                return [d([[1, 1, 'K']]), d([[1, 100000, 'P'], [1, 100000, 'KL'], [1, 100000, 'LNS']]), d(przedzialy(30, 2000)), d(przedzialy(100, 3000))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 100) || L.length !== q + 1) return 'q'; let s = 0;
                for (const l of L.slice(1)) { const m = l.match(/^(\d+) (\d+) ([PKLNS]{1,5})$/); if (!m || !calk(Number(m[1]), 1, 1e5) || !calk(Number(m[2]), Number(m[1]), 1e5) || new Set(m[3]).size !== m[3].length) return 'zapytanie'; s += Number(m[2]) - Number(m[1]) + 1; }
                return s <= 300000 ? null : 'suma';
            },
            solve: (inp) => {
                const kw = (x) => { const k = Math.round(Math.sqrt(x)); return k * k === x; };
                const W = { P: czyPierwsza, K: kw, L: (x) => odwroc(x) === x, N: (x) => x % 2 === 1, S: (x) => sumaCyfr(x) % 2 === 0 };
                return linie(inp).slice(1).map((l) => { const [a, b, w] = l.split(' '); let k = 0; for (let x = Number(a); x <= Number(b); x++) if (w.split('').every((c) => W[c](x))) k++; return k; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool czyPierwsza(int x) {
    if (x < 2) return false;
    for (int d = 2; d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}
bool czyKwadrat(int x) {
    int k = 0;
    while ((k + 1) * (k + 1) <= x) k++;
    return k * k == x;
}
int odwroc(int x) {
    int w = 0;
    while (x > 0) {
        w = w * 10 + x % 10;
        x /= 10;
    }
    return w;
}
bool czyPalindrom(int x) {
    return odwroc(x) == x;
}
bool sumaParzysta(int x) {
    int s = 0;
    while (x > 0) {
        s += x % 10;
        x /= 10;
    }
    return s % 2 == 0;
}
bool spelnia(int x, string w) {
    for (char c : w) {
        if (c == 'P' && !czyPierwsza(x)) return false;
        if (c == 'K' && !czyKwadrat(x)) return false;
        if (c == 'L' && !czyPalindrom(x)) return false;
        if (c == 'N' && x % 2 == 0) return false;
        if (c == 'S' && !sumaParzysta(x)) return false;
    }
    return true;
}
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int a, b;
        string w;
        cin >> a >> b >> w;
        int ile = 0;
        for (int x = a; x <= b; x++)
            if (spelnia(x, w)) ile++;
        cout << ile << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 5 · zasięg: lokalne i globalne
        {
            id: 'fun-bramka', krok: 5, level: 'latwe',
            title: 'Bramka na stadionie',
            short: 'Licznik kibiców i rekord trzymane w zmiennych globalnych. Funkcje wejdz(k), wyjdz(k) i pokaz() — każda widzi te same zmienne.',
            tags: ['zmienne globalne', 'funkcje zmieniające stan', 'polecenia'],
            statement: ['Bramka na stadionie liczy kibiców. Dostaje polecenia: WEJDZ k (weszło k osób), WYJDZ k (wyszło k osób — nigdy więcej, niż jest w środku) oraz ILE (wypisz, ilu kibiców jest teraz na stadionie).',
                'Na końcu wypisz rekord — największą liczbę kibiców, jaka była naraz na stadionie (na początku stadion jest pusty). Trzymaj liczbę kibiców i rekord w zmiennych globalnych, a każde polecenie obsługuj osobną funkcją.'],
            input_format: ['W pierwszym wierszu q — liczba poleceń.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu z liczbą kibiców dla każdego polecenia ILE, a na końcu wiersz Rekord: R'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ k ≤ 10⁴'],
            examples: [{ input: '5\nWEJDZ 300\nWYJDZ 120\nILE\nWEJDZ 50\nILE', note: 'Po dwóch poleceniach jest 180 osób, potem 230. Najwięcej naraz było 300 — zaraz po pierwszym wejściu.' }],
            hint: R`Nad funkcjami: int naStadionie = 0, rekord = 0;. void wejdz(int k) { naStadionie += k; if (naStadionie > rekord) rekord = naStadionie; }, void wyjdz(int k) { naStadionie -= k; }, void pokaz() { cout << naStadionie << "\n"; }. Funkcje nie dostają licznika w parametrze — widzą zmienną globalną.`,
            tests: (r) => {
                const los = (q) => { let s = 0; const o = []; for (let i = 0; i < q; i++) { const p = r(); if (p < 0.4) { const k = r.int(1, 10000); s += k; o.push(`WEJDZ ${k}`); } else if (p < 0.7 && s > 0) { const k = r.int(1, Math.min(s, 10000)); s -= k; o.push(`WYJDZ ${k}`); } else o.push('ILE'); } return `${q}\n${o.join('\n')}`; };
                return ['1\nILE', '3\nWEJDZ 10000\nWYJDZ 10000\nILE', los(10), los(300), los(1000)];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q'; let s = 0; for (const l of L.slice(1)) { if (l === 'ILE') continue; const m = l.match(/^(WEJDZ|WYJDZ) (\d+)$/); if (!m || !calk(Number(m[2]), 1, 1e4)) return 'polecenie'; s += m[1] === 'WEJDZ' ? Number(m[2]) : -Number(m[2]); if (s < 0) return 'ujemnie'; } return null; },
            solve: (inp) => { let s = 0, rek = 0; const o = []; for (const l of linie(inp).slice(1)) { const [p, k] = l.split(' '); if (p === 'WEJDZ') { s += Number(k); rek = Math.max(rek, s); } else if (p === 'WYJDZ') s -= Number(k); else o.push(s); } o.push(`Rekord: ${rek}`); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int naStadionie = 0, rekord = 0;
void wejdz(int k) {
    naStadionie += k;
    if (naStadionie > rekord) rekord = naStadionie;
}
void wyjdz(int k) {
    naStadionie -= k;
}
void pokaz() {
    cout << naStadionie << "\n";
}
int main() {
    naStadionie = 0;
    rekord = 0;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "WEJDZ") {
            int k;
            cin >> k;
            wejdz(k);
        } else if (p == "WYJDZ") {
            int k;
            cin >> k;
            wyjdz(k);
        } else pokaz();
    }
    cout << "Rekord: " << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-pytania-fragmenty', krok: 5, level: 'latwe',
            title: 'Pytania o fragmenty',
            short: 'Globalna tablica i trzy funkcje, które ją czytają: suma, największa i najmniejsza na fragmencie od a do b.',
            tags: ['globalna tablica', 'funkcje z parametrami a, b', 'long long'],
            statement: ['Masz ciąg n liczb (pozycje od 1 do n) i q pytań. Pytanie S a b — podaj sumę liczb na pozycjach od a do b; MAX a b — największą z nich; MIN a b — najmniejszą.',
                'Trzymaj ciąg w globalnej tablicy long long t[1005] (i n w globalnej zmiennej), a odpowiedzi licz funkcjami long long suma(int a, int b), long long najwieksza(int a, int b) i long long najmniejsza(int a, int b).'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.', 'W trzecim wierszu q, a w każdym z q kolejnych jedno pytanie.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n, q ≤ 1000', '1 ≤ a ≤ b ≤ n', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n4 -2 7 1 3\n3\nS 1 3\nMAX 2 5\nMIN 1 5', note: '4 − 2 + 7 = 9. Na pozycjach 2–5 stoją −2, 7, 1, 3 — największa to 7. Najmniejsza w całym ciągu to −2.' }],
            hint: R`Nad funkcjami: int n; long long t[1005];. long long suma(int a, int b) { long long s = 0; for (int i = a; i <= b; i++) s += t[i]; return s; }. Pozostałe dwie wyglądają podobnie — zacznij od t[a] i porównuj. Tablicy nie trzeba przekazywać: każda funkcja ją widzi.`,
            tests: (r) => {
                const d = (a, Q) => `${a.length}\n${a.join(' ')}\n${Q.length}\n${Q.join('\n')}`;
                const pyt = (n, q) => Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(a, n); return `${r.pick(['S', 'MAX', 'MIN'])} ${a} ${b}`; });
                return [d([5], ['S 1 1', 'MAX 1 1', 'MIN 1 1']), d(r.arr(10, -9, 9), pyt(10, 20)), d(r.arr(1000, -1000000000, 1000000000), pyt(1000, 1000)), d(Array(1000).fill(1000000000), ['S 1 1000', 'MIN 1 1000', 'MAX 500 500'])];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const t = L[1].split(' ').map(Number); const q = Number(L[2]);
                if (!calk(n, 1, 1000) || t.length !== n || !t.every((x) => calk(x, -1e9, 1e9)) || !calk(q, 1, 1000) || L.length !== q + 3) return 'dane';
                return L.slice(3).every((l) => { const m = l.match(/^(S|MAX|MIN) (\d+) (\d+)$/); return m && calk(Number(m[2]), 1, n) && calk(Number(m[3]), Number(m[2]), n); }) ? null : 'pytanie';
            },
            solve: (inp) => { const L = linie(inp); const t = L[1].split(' ').map(Number); return L.slice(3).map((l) => { const [p, a, b] = l.split(' '); const f = t.slice(Number(a) - 1, Number(b)); return p === 'S' ? f.reduce((s, x) => s + x, 0) : p === 'MAX' ? Math.max(...f) : Math.min(...f); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
long long t[1005];
long long suma(int a, int b) {
    long long s = 0;
    for (int i = a; i <= b; i++) s += t[i];
    return s;
}
long long najwieksza(int a, int b) {
    long long w = t[a];
    for (int i = a + 1; i <= b; i++)
        if (t[i] > w) w = t[i];
    return w;
}
long long najmniejsza(int a, int b) {
    long long w = t[a];
    for (int i = a + 1; i <= b; i++)
        if (t[i] < w) w = t[i];
    return w;
}
int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> t[i];
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string p;
        int a, b;
        cin >> p >> a >> b;
        if (p == "S") cout << suma(a, b) << "\n";
        else if (p == "MAX") cout << najwieksza(a, b) << "\n";
        else cout << najmniejsza(a, b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-akwarium', krok: 5, level: 'latwe',
            title: 'Akwarium',
            short: 'Dolewanie i odlewanie wody do akwarium o ograniczonej pojemności. Poziom wody i to, co się wylało, żyją w zmiennych globalnych.',
            tags: ['zmienne globalne', 'funkcje z warunkami', 'long long'],
            statement: ['Akwarium mieści P litrów i na początku jest puste. DOLEJ x — dolewamy x litrów; to, co się nie zmieści, wylewa się na podłogę. ODLEJ x — odlewamy x litrów, a jeśli w akwarium jest mniej, odlewamy wszystko. POKAZ — wypisz, ile litrów jest teraz w akwarium.',
                'Na końcu wypisz, ile litrów łącznie wylało się na podłogę. Napisz funkcje void dolej(long long x), void odlej(long long x) i void pokaz(), które zmieniają i czytają zmienne globalne.'],
            input_format: ['W pierwszym wierszu P i q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersz z poziomem wody dla każdego POKAZ, a na końcu wiersz Wylano: W'],
            constraints: ['1 ≤ P ≤ 10⁹, 1 ≤ q ≤ 1000', '1 ≤ x ≤ 10⁹'],
            examples: [{ input: '100 5\nDOLEJ 70\nDOLEJ 50\nPOKAZ\nODLEJ 500\nPOKAZ', note: 'Po dolaniu 50 litrów do 70 akwarium ma 100, a 20 litrów się wylewa. Odlewamy wszystko, co jest — zostaje 0.' }],
            hint: R`Globalnie: long long P, poziom = 0, wylano = 0;. void dolej(long long x) { poziom += x; if (poziom > P) { wylano += poziom - P; poziom = P; } } i void odlej(long long x) { if (x > poziom) x = poziom; poziom -= x; }. Wylana woda może przekroczyć 2 · 10⁹ — long long.`,
            tests: (r) => {
                const los = (P, q, mx) => `${P} ${q}\n${Array.from({ length: q }, () => { const p = r(); return p < 0.45 ? `DOLEJ ${r.int(1, mx)}` : p < 0.75 ? `ODLEJ ${r.int(1, mx)}` : 'POKAZ'; }).join('\n')}`;
                return ['1 1\nPOKAZ', '1000000000 3\nDOLEJ 1000000000\nDOLEJ 1000000000\nPOKAZ', los(100, 20, 60), los(1000000000, 1000, 1000000000), los(7, 1000, 10)];
            },
            check: (inp) => { const L = linie(inp); const [Pp, q] = L[0].split(' ').map(Number); if (!calk(Pp, 1, 1e9) || !calk(q, 1, 1000) || L.length !== q + 1) return 'P q'; return L.slice(1).every((l) => l === 'POKAZ' || ((m) => m && calk(Number(m[2]), 1, 1e9))(l.match(/^(DOLEJ|ODLEJ) (\d+)$/))) ? null : 'polecenie'; },
            solve: (inp) => { const L = linie(inp); const Pp = Number(L[0].split(' ')[0]); let p = 0, w = 0; const o = []; for (const l of L.slice(1)) { const [c, x] = l.split(' '); if (c === 'DOLEJ') { p += Number(x); if (p > Pp) { w += p - Pp; p = Pp; } } else if (c === 'ODLEJ') p -= Math.min(p, Number(x)); else o.push(p); } o.push(`Wylano: ${w}`); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long P, poziom = 0, wylano = 0;
void dolej(long long x) {
    poziom += x;
    if (poziom > P) {
        wylano += poziom - P;
        poziom = P;
    }
}
void odlej(long long x) {
    if (x > poziom) x = poziom;
    poziom -= x;
}
void pokaz() {
    cout << poziom << "\n";
}
int main() {
    poziom = 0;
    wylano = 0;
    int q;
    cin >> P >> q;
    for (int i = 0; i < q; i++) {
        string c;
        cin >> c;
        if (c == "DOLEJ") {
            long long x;
            cin >> x;
            dolej(x);
        } else if (c == "ODLEJ") {
            long long x;
            cin >> x;
            odlej(x);
        } else pokaz();
    }
    cout << "Wylano: " << wylano << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-kroki-euklidesa', krok: 5, level: 'srednie',
            title: 'Kroki Euklidesa',
            short: 'NWD liczone algorytmem Euklidesa, a globalny licznik zapisuje, ile było dzieleń z resztą. Przed każdą parą licznik trzeba wyzerować.',
            tags: ['globalny licznik', 'algorytm Euklidesa', 'zerowanie przed wywołaniem'],
            statement: ['Algorytm Euklidesa liczy NWD dwóch liczb tak: dopóki b ≠ 0, policz r = a mod b, a potem a = b i b = r. Gdy b = 0, NWD to a. Na przykład dla 12 i 18: (12, 18) → (18, 12) → (12, 6) → (6, 0), więc NWD = 6 po 3 dzieleniach z resztą.',
                'Napisz long long nwd(long long a, long long b), która przy każdym dzieleniu z resztą zwiększa globalny licznik kroki. Dla każdej pary wypisz NWD i liczbę kroków.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby a i b.'],
            output_format: ['t wierszy: NWD i liczba kroków.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n12 18\n18 12\n7 7', note: 'Dla (18, 12) wystarczą 2 kroki: (18, 12) → (12, 6) → (6, 0). Dla (7, 7): jeden krok, bo 7 mod 7 = 0.' }],
            hint: R`Globalnie: int kroki = 0;. W nwd: while (b != 0) { long long r = a % b; a = b; b = r; kroki++; } return a;. W main przed każdą parą: kroki = 0; — bez tego licznik pamiętałby kroki z poprzednich par, bo zmienna globalna żyje przez cały program.`,
            tests: (r) => {
                const F = [1n, 1n]; while (F[F.length - 1] <= 10n ** 18n) F.push(F[F.length - 1] + F[F.length - 2]); F.pop();
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const fib = F.slice(1).map((x, i) => [F[i + 1], F[i]]).slice(-10);
                const big = () => r.big(1, 10n ** 18n);
                return [d([[1n, 1n]]), d([[10n ** 18n, 1n], [1n, 10n ** 18n], ...fib, [F[F.length - 2], F[F.length - 1]]]), d(Array.from({ length: 30 }, () => [BigInt(r.int(1, 100)), BigInt(r.int(1, 100))])), d(Array.from({ length: 1000 }, () => { const g = r.big(1, 1000000n); return [g * r.big(1, 1000000000000n), g * r.big(1, 1000000000000n)]; })), d(Array.from({ length: 1000 }, () => [big(), big()]))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === 2 * n + 1 && t.slice(1).every((x) => /^[1-9]\d{0,18}$/.test(x) && BigInt(x) <= 10n ** 18n) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp).slice(1).map(BigInt); const o = []; for (let i = 0; i < t.length; i += 2) { let a = t[i], b = t[i + 1], k = 0; while (b !== 0n) { const rr = a % b; a = b; b = rr; k++; } o.push(`${a} ${k}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int kroki = 0;
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
        kroki++;
    }
    return a;
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b;
        cin >> a >> b;
        kroki = 0;
        long long g = nwd(a, b);
        cout << g << " " << kroki << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-czysta-tablica', krok: 5, level: 'srednie',
            title: 'Nowy test, czysta tablica',
            short: 'Wiele testów i globalna tablica liczników. Funkcja wyczysc() przed każdym testem — bez niej drugi test zobaczy liczniki z pierwszego.',
            tags: ['globalna tablica liczników', 'czyszczenie przed testem', 'kilka funkcji na jednym stanie'],
            statement: ['W każdym z t testów dostajesz n liczb od 1 do 1000. Dla każdego testu wypisz, ile jest wśród nich różnych wartości, i najczęstszą wartość (przy remisie — najmniejszą).',
                'Użyj globalnej tablicy int ile[1001] i funkcji: void wyczysc() (zeruje liczniki), void dodaj(int x), int rozne() i int najczestsza(). Pamiętaj, że globalna tablica nie zeruje się sama między testami.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: wiersz z n i wiersz z n liczbami.'],
            output_format: ['t wierszy: liczba różnych wartości i najczęstsza wartość.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 1000', 'Suma wszystkich n nie przekracza 2 · 10⁴.', '1 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '2\n5\n3 7 3 1 7\n3\n2 2 9', note: 'W pierwszym teście są 3 różne wartości; 3 i 7 występują po dwa razy — wygrywa mniejsza, 3. W drugim teście: 2 różne, najczęstsza 2.' }],
            hint: R`void wyczysc() { for (int i = 0; i <= 1000; i++) ile[i] = 0; } — wywołaj ją na początku każdego testu. rozne() liczy, ile pól ile[x] jest większych od 0; najczestsza() szuka największego licznika, przechodząc x od 1 w górę i zmieniając wynik tylko przy >, dzięki czemu przy remisie zostaje mniejsza wartość.`,
            tests: (r) => {
                const d = (T) => `${T.length}\n${T.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                return [d([[1]]), d([[5, 5, 1], [1, 5, 5], [1000, 1, 1000, 1]]), d(Array.from({ length: 20 }, () => r.arr(r.int(1, 30), 1, 10))), d(Array.from({ length: 1000 }, () => r.arr(r.int(1, 20), 1, 1000))), d(Array.from({ length: 20 }, () => r.arr(1000, 1, r.pick([3, 50, 1000]))))];
            },
            check: (inp) => { const t = nums(inp); let i = 1, s = 0; if (!calk(t[0], 1, 1000)) return 't'; for (let k = 0; k < t[0]; k++) { const n = t[i++]; if (!calk(n, 1, 1000)) return 'n'; s += n; for (let j = 0; j < n; j++) if (!calk(t[i++], 1, 1000)) return 'liczba'; } return i === t.length && s <= 20000 ? null : 'suma'; },
            solve: (inp) => { const t = nums(inp); let i = 1; const o = []; for (let k = 0; k < t[0]; k++) { const n = t[i++]; const c = new Map(); for (let j = 0; j < n; j++) { const x = t[i++]; c.set(x, (c.get(x) || 0) + 1); } let b = 0, bc = 0; for (const [x, v] of c) if (v > bc || (v === bc && x < b)) { b = x; bc = v; } o.push(`${c.size} ${b}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int ile[1001];
void wyczysc() {
    for (int i = 0; i <= 1000; i++) ile[i] = 0;
}
void dodaj(int x) {
    ile[x]++;
}
int rozne() {
    int k = 0;
    for (int i = 1; i <= 1000; i++)
        if (ile[i] > 0) k++;
    return k;
}
int najczestsza() {
    int w = 1;
    for (int i = 2; i <= 1000; i++)
        if (ile[i] > ile[w]) w = i;
    return w;
}
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        wyczysc();
        int n;
        cin >> n;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            dodaj(x);
        }
        cout << rozne() << " " << najczestsza() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-tablica-z-przepisu', krok: 5, level: 'srednie',
            title: 'Tablica z przepisu',
            short: 'Trzy miliony liczb z generatora, posortowanych — i pytania o k-tą najmniejszą. Tak duża tablica musi być globalna, bo w main wywróci program.',
            tags: ['duża tablica globalna', 'generator danych', 'sort'],
            statement: ['Ciąg n liczb powstaje z przepisu z lekcji o złożoności: x₁ = s, a każdy następny to xᵢ = (xᵢ₋₁ · a + b) mod m. Posortuj ciąg rosnąco i odpowiedz na q pytań: jaka liczba stoi na pozycji p (liczonej od 1) w posortowanym ciągu?',
                'Liczb może być aż 3 miliony. Tablica int t[3000000] utworzona w main nie zmieści się na stosie i program się wywróci — utwórz ją jako zmienną globalną (albo użyj vectora).'],
            input_format: ['W pierwszym wierszu n, s, a, b, m.', 'W drugim wierszu q, a w trzecim q pozycji p.'],
            output_format: ['q wierszy z liczbami stojącymi na pytanych pozycjach.'],
            constraints: ['1 ≤ n ≤ 3 · 10⁶', '1 ≤ m ≤ 10⁹, 0 ≤ s, a, b < m', '1 ≤ q ≤ 1000, 1 ≤ p ≤ n'],
            examples: [{ input: '5 3 2 1 10\n3\n1 3 5', note: 'Ciąg: 3, 7 (= 3 · 2 + 1), 5 (= 15 mod 10), 1 (= 11 mod 10), 3. Posortowany: 1, 3, 3, 5, 7. Na pozycjach 1, 3 i 5 stoją 1, 3 i 7.' }],
            hint: R`Nad main: int t[3000000];. Iloczyn x · a może sięgnąć 10¹⁸, więc licz w long long: long long x = s; for (int i = 0; i < n; i++) { t[i] = x; x = (x * a + b) % m; }. Potem sort(t, t + n); i dla każdego pytania cout << t[p - 1] << "\n";.`,
            time_limit: '2 s',
            tests: (r) => {
                const pyt = (n, q) => Array.from({ length: q }, () => r.int(1, n));
                const d = (n, m, q) => `${n} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${m}\n${q}\n${pyt(n, q).join(' ')}`;
                return ['1 5 0 0 7\n1\n1', d(10, 100, 10), d(1000, 1000000000, 100), `3000000 12345 103515245 12345 1000000000\n1000\n${[1, 3000000, ...pyt(3000000, 998)].join(' ')}`, `2999999 7 21 7 1000000\n1000\n${pyt(2999999, 1000).join(' ')}`];
            },
            check: (inp) => { const t = nums(inp); if (!dobryGen(t, 0, 3000000, 1e9)) return 'gen'; const q = t[5]; return calk(q, 1, 1000) && t.length === q + 6 && t.slice(6).every((p) => calk(p, 1, t[0])) ? null : 'pytania'; },
            solve: (inp) => { const t = nums(inp); const x = generuj(t[0], t[1], t[2], t[3], t[4]); x.sort(); return t.slice(6).map((p) => x[p - 1]).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int t[3000000];
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    long long x = s;
    for (int i = 0; i < n; i++) {
        t[i] = x;
        x = (x * a + b) % m;
    }
    sort(t, t + n);
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int p;
        cin >> p;
        cout << t[p - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-punkty-druzyn', krok: 5, level: 'srednie',
            title: 'Tabela punktów na żywo',
            short: 'Mecze dopisują punkty do globalnej tablicy, a pytanie LIDER przeszukuje ją funkcją. Wygrana 3 pkt, remis 1, przegrana 0.',
            tags: ['globalna tablica', 'funkcja zmieniająca i funkcja szukająca', 'polecenia'],
            statement: ['W lidze gra n drużyn o numerach od 1 do n, na początku każda ma 0 punktów. Polecenie MECZ a b x y znaczy: drużyna a strzeliła x goli, a drużyna b — y goli. Za wygraną drużyna dostaje 3 punkty, za remis obie po 1, za przegraną 0.',
                'Na polecenie LIDER wypisz numer drużyny z największą liczbą punktów (przy remisie — z najmniejszym numerem) i jej punkty. Napisz funkcje void mecz(int a, int b, int x, int y) i int lider(), które korzystają z globalnej tablicy punktów.'],
            input_format: ['W pierwszym wierszu n i q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Dla każdego LIDER wiersz: druzyna D: P pkt'],
            constraints: ['2 ≤ n ≤ 1000, 1 ≤ q ≤ 2000', 'a ≠ b, 0 ≤ x, y ≤ 20'],
            examples: [{ input: '3 4\nMECZ 1 2 2 0\nLIDER\nMECZ 2 3 1 1\nLIDER', note: 'Po pierwszym meczu drużyna 1 ma 3 punkty. Remis daje drużynom 2 i 3 po punkcie — liderem wciąż jest drużyna 1.' }],
            hint: R`Globalnie: int n; int punkty[1001];. void mecz(int a, int b, int x, int y) { if (x > y) punkty[a] += 3; else if (x < y) punkty[b] += 3; else { punkty[a]++; punkty[b]++; } }. int lider() { int w = 1; for (int i = 2; i <= n; i++) if (punkty[i] > punkty[w]) w = i; return w; } — zwraca numer, a punkty odczytasz z tablicy.`,
            tests: (r) => {
                const los = (n, q) => `${n} ${q}\n${Array.from({ length: q }, () => { if (r() < 0.3) return 'LIDER'; const a = r.int(1, n); let b; do b = r.int(1, n); while (b === a); return `MECZ ${a} ${b} ${r.int(0, 5)} ${r.int(0, 5)}`; }).join('\n')}`;
                return ['2 1\nLIDER', '2 3\nMECZ 2 1 20 0\nMECZ 1 2 0 0\nLIDER', los(4, 20), los(1000, 2000), los(3, 2000)];
            },
            check: (inp) => { const L = linie(inp); const [n, q] = L[0].split(' ').map(Number); if (!calk(n, 2, 1000) || !calk(q, 1, 2000) || L.length !== q + 1) return 'n q'; return L.slice(1).every((l) => l === 'LIDER' || ((m) => m && calk(Number(m[1]), 1, n) && calk(Number(m[2]), 1, n) && m[1] !== m[2] && calk(Number(m[3]), 0, 20) && calk(Number(m[4]), 0, 20))(l.match(/^MECZ (\d+) (\d+) (\d+) (\d+)$/))) ? null : 'polecenie'; },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0].split(' ')[0]); const p = new Array(n + 1).fill(0); const o = []; for (const l of L.slice(1)) { if (l === 'LIDER') { let w = 1; for (let i = 2; i <= n; i++) if (p[i] > p[w]) w = i; o.push(`druzyna ${w}: ${p[w]} pkt`); continue; } const [, a, b, x, y] = l.split(' ').map(Number); if (x > y) p[a] += 3; else if (x < y) p[b] += 3; else { p[a]++; p[b]++; } } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
int punkty[1001];
void mecz(int a, int b, int x, int y) {
    if (x > y) punkty[a] += 3;
    else if (x < y) punkty[b] += 3;
    else {
        punkty[a]++;
        punkty[b]++;
    }
}
int lider() {
    int w = 1;
    for (int i = 2; i <= n; i++)
        if (punkty[i] > punkty[w]) w = i;
    return w;
}
int main() {
    for (int i = 0; i <= 1000; i++) punkty[i] = 0;
    int q;
    cin >> n >> q;
    for (int k = 0; k < q; k++) {
        string p;
        cin >> p;
        if (p == "MECZ") {
            int a, b, x, y;
            cin >> a >> b >> x >> y;
            mecz(a, b, x, y);
        } else {
            int w = lider();
            cout << "druzyna " << w << ": " << punkty[w] << " pkt\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-postac-w-grze', krok: 5, level: 'srednie',
            title: 'Postać w grze',
            short: 'Życie, złoto, doświadczenie i poziom bohatera w zmiennych globalnych. Walka, leczenie i awans to osobne funkcje — a po śmierci gra się kończy.',
            tags: ['stan w zmiennych globalnych', 'funkcja woła funkcję', 'flaga końca gry'],
            statement: ['Bohater zaczyna z 100 punktami życia, 0 złota, 0 doświadczenia i na poziomie 1. Polecenia:',
                'WALKA o z — bohater traci o punktów życia. Jeśli wciąż ma więcej niż 0, zdobywa z złota i 40 doświadczenia; za każde pełne 100 doświadczenia awansuje o poziom (doświadczenie zmniejsza się o 100). Jeśli życie spadnie do 0 lub niżej, wypisz KONIEC GRY — od tej chwili wszystkie dalsze polecenia są ignorowane.',
                'LECZ k — jeśli bohater ma co najmniej k złota, płaci k i odzyskuje k punktów życia (ale nie więcej niż do 100); w przeciwnym razie wypisz ZA MALO ZLOTA. STAN — wypisz: zycie Z, zloto G, poziom P, doswiadczenie D.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersze wypisywane przez polecenia, w kolejności.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ o ≤ 200, 0 ≤ z ≤ 1000, 1 ≤ k ≤ 1000', 'Program zawsze wypisuje co najmniej jeden wiersz.'],
            examples: [{ input: '6\nWALKA 30 50\nWALKA 20 10\nWALKA 10 0\nSTAN\nLECZ 100\nLECZ 40', note: 'Po trzech walkach: życie 40, złoto 60, doświadczenie 120 — więc był awans na poziom 2 i zostało 20. Na leczenie za 100 nie starcza złota; za 40 — tak, życie wraca do 80.' }],
            hint: R`Globalnie: int zycie = 100, zloto = 0, poziom = 1, dosw = 0; bool koniec = false;. void awans() { while (dosw >= 100) { poziom++; dosw -= 100; } } wywołuj z walka(). W main na początku pętli: if (koniec) continue; — ale polecenie i tak trzeba wczytać do końca, żeby nie rozjechało się czytanie.`,
            tests: (r) => {
                const los = (q, dmg) => `${q}\n${Array.from({ length: q }, () => { const p = r(); return p < 0.55 ? `WALKA ${r.int(0, dmg)} ${r.int(0, 100)}` : p < 0.8 ? `LECZ ${r.int(1, 80)}` : 'STAN'; }).join('\n')}`;
                return ['1\nSTAN', '4\nWALKA 100 5\nSTAN\nLECZ 1\nWALKA 0 0', '3\nWALKA 99 1000\nLECZ 1000\nSTAN', los(20, 15), los(300, 8), los(1000, 6), los(1000, 3)];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q'; return L.slice(1).every((l) => l === 'STAN' || ((m) => m && calk(Number(m[1]), 0, 200) && calk(Number(m[2]), 0, 1000))(l.match(/^WALKA (\d+) (\d+)$/)) || ((m) => m && calk(Number(m[1]), 1, 1000))(l.match(/^LECZ (\d+)$/))) ? null : 'polecenie'; },
            solve: (inp) => {
                let z = 100, g = 0, p = 1, d = 0, k = false; const o = [];
                for (const l of linie(inp).slice(1)) {
                    if (k) continue; const [c, a, b] = l.split(' ');
                    if (c === 'WALKA') { z -= Number(a); if (z <= 0) { o.push('KONIEC GRY'); k = true; continue; } g += Number(b); d += 40; while (d >= 100) { p++; d -= 100; } }
                    else if (c === 'LECZ') { const x = Number(a); if (g >= x) { g -= x; z = Math.min(100, z + x); } else o.push('ZA MALO ZLOTA'); }
                    else o.push(`zycie ${z}, zloto ${g}, poziom ${p}, doswiadczenie ${d}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int zycie, zloto, poziom, dosw;
bool koniec;
void awans() {
    while (dosw >= 100) {
        poziom++;
        dosw -= 100;
    }
}
void walka(int o, int z) {
    zycie -= o;
    if (zycie <= 0) {
        cout << "KONIEC GRY\n";
        koniec = true;
        return;
    }
    zloto += z;
    dosw += 40;
    awans();
}
void lecz(int k) {
    if (zloto < k) {
        cout << "ZA MALO ZLOTA\n";
        return;
    }
    zloto -= k;
    zycie = min(100, zycie + k);
}
void stan() {
    cout << "zycie " << zycie << ", zloto " << zloto << ", poziom " << poziom << ", doswiadczenie " << dosw << "\n";
}
int main() {
    zycie = 100;
    zloto = 0;
    poziom = 1;
    dosw = 0;
    koniec = false;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string c;
        cin >> c;
        int a = 0, b = 0;
        if (c == "WALKA") cin >> a >> b;
        else if (c == "LECZ") cin >> a;
        if (koniec) continue;
        if (c == "WALKA") walka(a, b);
        else if (c == "LECZ") lecz(a);
        else stan();
    }
    return 0;
}`,
        },

        // ================================================================ KROK 6 · referencje
        {
            id: 'fun-ile-zamian', krok: 6, level: 'latwe',
            title: 'Trzy liczby i licznik zamian',
            short: 'Trzy porównania z zamianą porządkują trzy liczby. Funkcja zamienJesli(x, y, licznik) zmienia oryginały — wszystkie trzy parametry z &.',
            tags: ['parametry przez referencję', 'zamiana dwóch zmiennych', 'licznik przez &'],
            statement: ['Trzy liczby a, b, c można uporządkować trzema krokami: popraw parę (a, b), potem parę (b, c), a na koniec znowu (a, b). „Popraw parę” znaczy: jeśli pierwsza liczba jest większa od drugiej, zamień je miejscami.',
                'Napisz void zamienJesli(int &x, int &y, int &licznik), która poprawia parę i zwiększa licznik, gdy zrobiła zamianę. Dla każdej trójki wypisz uporządkowane liczby i liczbę wykonanych zamian.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy trzy liczby a, b, c.'],
            output_format: ['t wierszy: trzy liczby rosnąco i liczba zamian.'],
            constraints: ['1 ≤ t ≤ 600', '−10⁹ ≤ a, b, c ≤ 10⁹'],
            examples: [{ input: '3\n3 1 2\n1 2 3\n3 2 1', note: '3 1 2: zamiana w (a, b) daje 1 3 2, zamiana w (b, c) daje 1 2 3 — dwie zamiany. 3 2 1 wymaga wszystkich trzech.' }],
            hint: R`void zamienJesli(int &x, int &y, int &licznik) { if (x > y) { int pom = x; x = y; y = pom; licznik++; } }. W main: int k = 0; zamienJesli(a, b, k); zamienJesli(b, c, k); zamienJesli(a, b, k);. Bez & funkcja zamieniłaby tylko swoje kopie i w main nic by się nie zmieniło.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const perm = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1], [5, 5, 5], [5, 5, 1], [1, 5, 5], [5, 1, 5]];
                return [d([[0, 0, 0]]), d(perm), d(Array.from({ length: 50 }, () => r.arr(3, -5, 5))), d(Array.from({ length: 600 }, () => r.arr(3, -1000000000, 1000000000)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 600) && t.length === 3 * t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 1; i < t.length; i += 3) { const v = t.slice(i, i + 3); let k = 0; const z = (p, q) => { if (v[p] > v[q]) { [v[p], v[q]] = [v[q], v[p]]; k++; } }; z(0, 1); z(1, 2); z(0, 1); o.push(`${v.join(' ')} ${k}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void zamienJesli(int &x, int &y, int &licznik) {
    if (x > y) {
        int pom = x;
        x = y;
        y = pom;
        licznik++;
    }
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        int a, b, c;
        cin >> a >> b >> c;
        int k = 0;
        zamienJesli(a, b, k);
        zamienJesli(b, c, k);
        zamienJesli(a, b, k);
        cout << a << " " << b << " " << c << " " << k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-skrajne', krok: 6, level: 'latwe',
            title: 'Skrajne wartości w każdym teście',
            short: 'Jedna funkcja, dwa wyniki: skrajne(v, mn, mx) wpisuje najmniejszą i największą do zmiennych z main. vector bez kopiowania — przez const &.',
            tags: ['dwa wyniki przez &', 'const vector<int> &', 'wiele testów'],
            statement: ['W każdym z t testów dostajesz listę liczb. Wypisz najmniejszą i największą z nich.',
                'Napisz funkcję void skrajne(const vector<int> &v, int &mn, int &mx), która niczego nie zwraca przez return — oba wyniki wpisuje do zmiennych przekazanych przez referencję. Listę przekaż przez const &: funkcja jej nie kopiuje i nie może jej zmienić.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: wiersz z n i wiersz z n liczbami.'],
            output_format: ['t wierszy: najmniejsza i największa liczba testu.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, a suma wszystkich n nie przekracza 10⁴.', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '2\n4\n3 -7 10 2\n1\n5', note: 'W pierwszym teście: −7 i 10. Lista z jedną liczbą ma ją jednocześnie jako minimum i maksimum.' }],
            hint: R`void skrajne(const vector<int> &v, int &mn, int &mx) { mn = v[0]; mx = v[0]; for (int x : v) { if (x < mn) mn = x; if (x > mx) mx = x; } }. W main: int a, b; skrajne(v, a, b); cout << a << " " << b << "\n"; — po wywołaniu a i b mają już wyniki.`,
            tests: (r) => {
                const d = (T) => `${T.length}\n${T.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                return [d([[0]]), d([[1000000000, -1000000000], [-1000000000, 1000000000], [7, 7, 7]]), d(Array.from({ length: 30 }, () => r.arr(r.int(1, 10), -100, 100))), d(Array.from({ length: 1000 }, () => r.arr(r.int(1, 10), -1000000000, 1000000000))), d([r.arr(9000, -1000000000, 1000000000)])];
            },
            check: (inp) => { const t = nums(inp); let i = 1, s = 0; if (!calk(t[0], 1, 1000)) return 't'; for (let k = 0; k < t[0]; k++) { const n = t[i++]; if (!calk(n, 1, 10000)) return 'n'; s += n; for (let j = 0; j < n; j++) if (!calk(t[i++], -1e9, 1e9)) return 'liczba'; } return i === t.length && s <= 10000 ? null : 'suma'; },
            solve: (inp) => { const t = nums(inp); let i = 1; const o = []; for (let k = 0; k < t[0]; k++) { const n = t[i++]; const a = t.slice(i, i + n); i += n; let mn = a[0], mx = a[0]; for (const x of a) { if (x < mn) mn = x; if (x > mx) mx = x; } o.push(`${mn} ${mx}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void skrajne(const vector<int> &v, int &mn, int &mx) {
    mn = v[0];
    mx = v[0];
    for (int x : v) {
        if (x < mn) mn = x;
        if (x > mx) mx = x;
    }
}
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; i++) cin >> v[i];
        int a, b;
        skrajne(v, a, b);
        cout << a << " " << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-sklepik', krok: 6, level: 'latwe',
            title: 'Sklepik w grze',
            short: 'bool kup(zloto, cena) mówi przez return, czy się udało, a przez & zmniejsza złoto gracza. Sprzedaż oddaje połowę ceny.',
            tags: ['bool i referencja razem', 'int &', 'polecenia'],
            statement: ['Gracz zaczyna z G sztukami złota. KUP c — jeśli ma co najmniej c złota, płaci c i wypisz OK; jeśli nie, nic się nie zmienia i wypisz ZA MALO. SPRZEDAJ c — gracz sprzedaje przedmiot wart c i dostaje połowę tej kwoty (zaokrągloną w dół).',
                'Napisz funkcje bool kup(int &zloto, int cena) i void sprzedaj(int &zloto, int cena). Na końcu wypisz stan złota.'],
            input_format: ['W pierwszym wierszu G i q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersz OK albo ZA MALO dla każdego KUP, a na końcu wiersz Zloto: G'],
            constraints: ['0 ≤ G ≤ 10⁶, 1 ≤ q ≤ 1000', '1 ≤ c ≤ 10⁶'],
            examples: [{ input: '100 4\nKUP 70\nKUP 50\nSPRZEDAJ 45\nKUP 50', note: 'Po pierwszym zakupie zostaje 30 — na drugi nie starcza. Sprzedaż za 45 daje 22, czyli razem 52 — trzeci zakup się udaje i zostają 2 sztuki złota.' }],
            hint: R`bool kup(int &zloto, int cena) { if (zloto < cena) return false; zloto -= cena; return true; } — return mówi „udało się albo nie”, a & pozwala zmienić złoto w main. W main: if (kup(zloto, c)) cout << "OK\n"; else cout << "ZA MALO\n";.`,
            tests: (r) => {
                const los = (G, q, mx) => `${G} ${q}\n${Array.from({ length: q }, () => `${r() < 0.6 ? 'KUP' : 'SPRZEDAJ'} ${r.int(1, mx)}`).join('\n')}`;
                return ['0 1\nKUP 1', '1000000 3\nKUP 1000000\nSPRZEDAJ 1\nKUP 1', los(500, 20, 200), los(1000000, 1000, 1000000), los(0, 1000, 50)];
            },
            check: (inp) => { const L = linie(inp); const [G, q] = L[0].split(' ').map(Number); if (!calk(G, 0, 1e6) || !calk(q, 1, 1000) || L.length !== q + 1) return 'G q'; return L.slice(1).every((l) => ((m) => m && calk(Number(m[2]), 1, 1e6))(l.match(/^(KUP|SPRZEDAJ) (\d+)$/))) && L.slice(1).some((l) => l.startsWith('KUP')) ? null : 'polecenie'; },
            solve: (inp) => { const L = linie(inp); let g = Number(L[0].split(' ')[0]); const o = []; for (const l of L.slice(1)) { const [c, x] = l.split(' '); const v = Number(x); if (c === 'KUP') { if (g >= v) { g -= v; o.push('OK'); } else o.push('ZA MALO'); } else g += Math.floor(v / 2); } o.push(`Zloto: ${g}`); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool kup(int &zloto, int cena) {
    if (zloto < cena) return false;
    zloto -= cena;
    return true;
}
void sprzedaj(int &zloto, int cena) {
    zloto += cena / 2;
}
int main() {
    int zloto, q;
    cin >> zloto >> q;
    for (int i = 0; i < q; i++) {
        string c;
        int x;
        cin >> c >> x;
        if (c == "KUP") {
            if (kup(zloto, x)) cout << "OK\n";
            else cout << "ZA MALO\n";
        } else sprzedaj(zloto, x);
    }
    cout << "Zloto: " << zloto << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-cyfry-osobno', krok: 6, level: 'latwe',
            title: 'Cyfry parzyste i nieparzyste osobno',
            short: 'Z 2041 powstają dwa napisy: „204” z cyfr parzystych i „1” z nieparzystych. Funkcja zwraca oba wyniki przez dwa parametry string &.',
            tags: ['string &', 'dwa wyniki przez referencję', 'znak po znaku'],
            statement: ['Z cyfr liczby x zbuduj dwa napisy: pierwszy z cyfr parzystych (0, 2, 4, 6, 8), drugi z nieparzystych — w obu zachowaj kolejność, w jakiej cyfry stoją w x. Pusty napis wypisz jako brak.',
                'Napisz funkcję void rozdziel(string x, string &parzyste, string &nieparzyste). Liczbę wczytuj jako napis — wtedy zera w środku i na końcu zostaną na swoich miejscach.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy liczba x.'],
            output_format: ['n wierszy: napis z cyfr parzystych i napis z cyfr nieparzystych, oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', 'x ma od 1 do 18 cyfr i nie zaczyna się od zera.'],
            examples: [{ input: '3\n2041\n135\n86420', note: '2041: cyfry parzyste 2, 0, 4 i nieparzysta 1. 135 nie ma parzystych cyfr. 86420 nie ma nieparzystych.' }],
            hint: R`void rozdziel(string x, string &p, string &np) { p = ""; np = ""; for (char c : x) { if ((c - '0') % 2 == 0) p += c; else np += c; } }. Na początku wyczyść oba napisy — nie wiadomo, co w nich było przed wywołaniem. W main: if (p == "") cout << "brak"; else cout << p;.`,
            tests: (r) => {
                const lic = (n, al = '0123456789') => r.pick('123456789') + r.word(n - 1, al);
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['1']), d(['2', '10', '20', '13579', '24680', '100000000000000000']), d(Array.from({ length: 30 }, () => lic(r.int(1, 6)))), d(Array.from({ length: 1000 }, () => lic(r.int(1, 18), r.pick(['0123456789', '13579', '02468']))))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((x) => /^[1-9]\d{0,17}$/.test(x)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => { const p = x.split('').filter((c) => Number(c) % 2 === 0).join(''), np = x.split('').filter((c) => Number(c) % 2 === 1).join(''); return `${p || 'brak'} ${np || 'brak'}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void rozdziel(string x, string &p, string &np) {
    p = "";
    np = "";
    for (char c : x) {
        if ((c - '0') % 2 == 0) p += c;
        else np += c;
    }
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string x, p, np;
        cin >> x;
        rozdziel(x, p, np);
        if (p == "") cout << "brak";
        else cout << p;
        cout << " ";
        if (np == "") cout << "brak";
        else cout << np;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-licznik-km', krok: 6, level: 'srednie',
            title: 'Licznik kilometrów',
            short: 'Licznik w samochodzie to napis z cyfr, który po 999 przeskakuje na 000. Funkcja dodajJeden(string &licznik) zmienia napis w miejscu.',
            tags: ['string &', 'przeniesienie przy dodawaniu', 'zmiana w miejscu'],
            statement: ['Stary samochód ma mechaniczny licznik kilometrów z ustaloną liczbą cyfr. Każdy przejechany kilometr dodaje 1 do licznika; gdy wszystkie cyfry są dziewiątkami, licznik przeskakuje na same zera.',
                'Napisz funkcję void dodajJeden(string &licznik), która dodaje 1 do napisu z cyframi (z przeniesieniem, jak przy dodawaniu pisemnym). Dla każdego samochodu wypisz stan licznika po przejechaniu k kilometrów.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy stan licznika (napis z cyfr, może zaczynać się od zer) i liczba k.'],
            output_format: ['q wierszy ze stanem licznika po k kilometrach — z tą samą liczbą cyfr.'],
            constraints: ['1 ≤ q ≤ 10', 'Licznik ma od 1 do 18 cyfr.', '0 ≤ k ≤ 10⁵'],
            examples: [{ input: '2\n0997 5\n99 1', note: '0997 → 0998 → 0999 → 1000 → 1001 → 1002. Licznik 99 po jednym kilometrze pokazuje 00.' }],
            hint: R`void dodajJeden(string &s) { int i = s.size() - 1; while (i >= 0 && s[i] == '9') { s[i] = '0'; i--; } if (i >= 0) s[i]++; } — dziewiątki z końca zamieniają się w zera, a pierwsza cyfra, która nie jest dziewiątką, rośnie o 1. Gdy i spadnie do −1, wszystkie cyfry były dziewiątkami i licznik się przekręcił. W main wywołaj ją k razy.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([['0', 0]]), d([['9', 1], ['999999999999999999', 1], ['000000000000000000', 100000], ['5', 100000]]), d(Array.from({ length: 10 }, () => [r.word(r.int(1, 6), '0123456789'), r.int(0, 2000)])), d(Array.from({ length: 10 }, () => [r.word(r.int(1, 18), r.pick(['0123456789', '9', '89'])), r.int(90000, 100000)]))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 10) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^(\d{1,18}) (\d+)$/); return m && calk(Number(m[2]), 0, 1e5); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [s, k] = l.split(' '); const M = 10n ** BigInt(s.length); return String((BigInt(s) + BigInt(k)) % M).padStart(s.length, '0'); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void dodajJeden(string &s) {
    int i = s.size() - 1;
    while (i >= 0 && s[i] == '9') {
        s[i] = '0';
        i--;
    }
    if (i >= 0) s[i]++;
}
int main() {
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        string licznik;
        int k;
        cin >> licznik >> k;
        for (int i = 0; i < k; i++) dodajJeden(licznik);
        cout << licznik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-dwa-roboty', krok: 6, level: 'srednie',
            title: 'Dwa roboty, jedna funkcja',
            short: 'Ta sama funkcja ruch(kierunek, x, y) przesuwa raz robota A, raz robota B — zależnie od tego, czyje zmienne podasz przez referencję.',
            tags: ['ta sama funkcja dla różnych zmiennych', 'int &', 'symulacja'],
            statement: ['Na kratce stoją dwa roboty: A w punkcie (0, 0) i B w punkcie (xb, yb). Polecenie składa się z litery robota i kierunku: G — w górę (y + 1), D — w dół (y − 1), L — w lewo (x − 1), P — w prawo (x + 1).',
                'Po każdym ruchu sprawdź, czy roboty stoją w tym samym punkcie — wtedy jest spotkanie. Wypisz końcowe pozycje obu robotów i liczbę spotkań. Ruch obu robotów obsługuje jedna funkcja void ruch(char kierunek, int &x, int &y).'],
            input_format: ['W pierwszym wierszu xb, yb i q.', 'W każdym z q kolejnych wierszy: litera robota (A albo B) i kierunek.'],
            output_format: ['Trzy wiersze: A: x y, B: x y oraz Spotkania: k'],
            constraints: ['−100 ≤ xb, yb ≤ 100, 1 ≤ q ≤ 10⁴'],
            examples: [{ input: '2 0 3\nA P\nB L\nA P', note: 'Po drugim poleceniu oba roboty stoją w (1, 0) — spotkanie. Potem A idzie do (2, 0), a B zostaje w (1, 0).' }],
            hint: R`void ruch(char k, int &x, int &y) { if (k == 'G') y++; else if (k == 'D') y--; else if (k == 'L') x--; else x++; }. W main: if (kto == 'A') ruch(k, ax, ay); else ruch(k, bx, by); — funkcja jest jedna, a & sprawia, że zmienia te zmienne, które jej podasz. Po każdym ruchu: if (ax == bx && ay == by) spotkania++;.`,
            tests: (r) => {
                const los = (xb, yb, q, wA) => `${xb} ${yb} ${q}\n${Array.from({ length: q }, () => `${r() < wA ? 'A' : 'B'} ${r.pick('GDLP')}`).join('\n')}`;
                return ['0 0 1\nA G', '0 1 2\nA G\nA D', los(1, 1, 20, 0.5), los(3, -2, 1000, 0.5), los(0, 0, 10000, 0.5), los(-100, 100, 10000, 0.9)];
            },
            check: (inp) => { const L = linie(inp); const [xb, yb, q] = L[0].split(' ').map(Number); return calk(xb, -100, 100) && calk(yb, -100, 100) && calk(q, 1, 1e4) && L.length === q + 1 && L.slice(1).every((l) => /^[AB] [GDLP]$/.test(l)) ? null : 'dane'; },
            solve: (inp) => {
                const L = linie(inp); const [xb, yb] = L[0].split(' ').map(Number); const p = { A: [0, 0], B: [xb, yb] }; let s = 0;
                for (const l of L.slice(1)) { const [kto, k] = l.split(' '); const v = p[kto]; if (k === 'G') v[1]++; else if (k === 'D') v[1]--; else if (k === 'L') v[0]--; else v[0]++; if (p.A[0] === p.B[0] && p.A[1] === p.B[1]) s++; }
                return `A: ${p.A.join(' ')}\nB: ${p.B.join(' ')}\nSpotkania: ${s}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void ruch(char k, int &x, int &y) {
    if (k == 'G') y++;
    else if (k == 'D') y--;
    else if (k == 'L') x--;
    else x++;
}
int main() {
    int ax = 0, ay = 0, bx, by, q;
    cin >> bx >> by >> q;
    int spotkania = 0;
    for (int i = 0; i < q; i++) {
        char kto, k;
        cin >> kto >> k;
        if (kto == 'A') ruch(k, ax, ay);
        else ruch(k, bx, by);
        if (ax == bx && ay == by) spotkania++;
    }
    cout << "A: " << ax << " " << ay << "\n";
    cout << "B: " << bx << " " << by << "\n";
    cout << "Spotkania: " << spotkania << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-dwie-listy', krok: 6, level: 'srednie',
            title: 'Dwie listy, te same funkcje',
            short: 'Polecenia dla list A i B: dodaj, zwiększ wszystkie, odwróć, suma, wypisz. Każda funkcja dostaje vector przez & — raz A, raz B.',
            tags: ['vector przez &', 'const & do czytania', 'wybór listy referencją'],
            statement: ['Masz dwie listy liczb, A i B, na początku puste. Polecenia (X to A albo B): DODAJ X v — dopisz v na koniec listy X; PLUS X v — dodaj v do każdej liczby z listy X; ODWROC X — odwróć kolejność listy X; SUMA X — wypisz sumę liczb listy X (pusta lista ma sumę 0); WYPISZ X — wypisz liczby listy X oddzielone spacjami albo słowo pusta.',
                'Napisz funkcje, które dostają listę przez referencję: zmieniające — vector<long long> &, a tylko czytające — const vector<long long> &.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersze wypisywane przez SUMA i WYPISZ, w kolejności poleceń.'],
            constraints: ['1 ≤ q ≤ 2000', '−10⁶ ≤ v ≤ 10⁶', 'Wszystkie polecenia WYPISZ razem wypisują najwyżej 2000 liczb.', 'Co najmniej jedno polecenie to SUMA albo WYPISZ.'],
            examples: [{ input: '6\nDODAJ A 5\nDODAJ A 7\nDODAJ B 1\nPLUS A 10\nODWROC A\nWYPISZ A', note: 'A to najpierw 5 7, po PLUS — 15 17, a po odwróceniu 17 15. Lista B zostaje nietknięta.' }],
            hint: R`void plusWszystkim(vector<long long> &v, long long x) { for (long long &e : v) e += x; } i long long suma(const vector<long long> &v). Listę wybierzesz referencją: vector<long long> &L = (X == "A") ? A : B; — potem wywołujesz funkcje z L. Uwaga: funkcji nie nazywaj plus — tak nazywa się coś w bibliotece std i kompilator zgłosi niejednoznaczność.`,
            tests: (r) => {
                const los = (q, wyp) => { const n = { A: 0, B: 0 }; let w = 0; const o = []; for (let i = 0; i < q; i++) { const X = r.pick('AB'); const p = r(); if (p < 0.45) { o.push(`DODAJ ${X} ${r.int(-1000000, 1000000)}`); n[X]++; } else if (p < 0.6) o.push(`PLUS ${X} ${r.int(-1000000, 1000000)}`); else if (p < 0.7) o.push(`ODWROC ${X}`); else if (p < 0.9 || w + n[X] > wyp) o.push(`SUMA ${X}`); else { o.push(`WYPISZ ${X}`); w += n[X]; } } return `${q}\n${o.join('\n')}`; };
                return ['1\nSUMA A', '3\nWYPISZ B\nDODAJ B -1000000\nWYPISZ B', los(30, 100), los(2000, 2000), los(2000, 300)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q'; const n = { A: 0, B: 0 }; let w = 0, wy = 0;
                for (const l of L.slice(1)) { let m; if ((m = l.match(/^(DODAJ|PLUS) ([AB]) (-?\d+)$/))) { if (!calk(Number(m[3]), -1e6, 1e6)) return 'v'; if (m[1] === 'DODAJ') n[m[2]]++; } else if ((m = l.match(/^(ODWROC|SUMA|WYPISZ) ([AB])$/))) { if (m[1] === 'WYPISZ') w += n[m[2]]; if (m[1] !== 'ODWROC') wy++; } else return 'polecenie'; }
                return w <= 2000 && wy > 0 ? null : 'wypisz';
            },
            solve: (inp) => {
                const S = { A: [], B: [] }; const o = [];
                for (const l of linie(inp).slice(1)) { const [c, X, v] = l.split(' '); const L = S[X]; if (c === 'DODAJ') L.push(Number(v)); else if (c === 'PLUS') for (let i = 0; i < L.length; i++) L[i] += Number(v); else if (c === 'ODWROC') L.reverse(); else if (c === 'SUMA') o.push(L.reduce((s, x) => s + x, 0)); else o.push(L.length ? L.join(' ') : 'pusta'); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void dodaj(vector<long long> &v, long long x) {
    v.push_back(x);
}
void plusWszystkim(vector<long long> &v, long long x) {
    for (long long &e : v) e += x;
}
void odwroc(vector<long long> &v) {
    reverse(v.begin(), v.end());
}
long long suma(const vector<long long> &v) {
    long long s = 0;
    for (long long e : v) s += e;
    return s;
}
void wypisz(const vector<long long> &v) {
    if (v.empty()) {
        cout << "pusta\n";
        return;
    }
    for (int i = 0; i < (int)v.size(); i++) {
        if (i > 0) cout << " ";
        cout << v[i];
    }
    cout << "\n";
}
int main() {
    vector<long long> A, B;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string c, X;
        cin >> c >> X;
        vector<long long> &L = (X == "A") ? A : B;
        if (c == "DODAJ") {
            long long v;
            cin >> v;
            dodaj(L, v);
        } else if (c == "PLUS") {
            long long v;
            cin >> v;
            plusWszystkim(L, v);
        } else if (c == "ODWROC") odwroc(L);
        else if (c == "SUMA") cout << suma(L) << "\n";
        else wypisz(L);
    }
    return 0;
}`,
        },
        {
            id: 'fun-pytania-do-listy', krok: 6, level: 'srednie',
            title: 'Pytania do wielkiej listy',
            short: '200 000 pytań do listy 200 000 liczb. Funkcja z vectorem przez wartość kopiuje go przy każdym pytaniu i nie zdąży — z const & zdąży z zapasem.',
            tags: ['const vector<int> &', 'koszt kopiowania', 'upper_bound'],
            statement: ['Liczby powstają z przepisu: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Pierwsze n liczb tworzy listę, a kolejne q liczb to pytania. Dla każdego pytania y policz, ile liczb z listy jest nie większych niż y. Wypisz sumę odpowiedzi na wszystkie pytania.',
                'Posortuj listę raz, a odpowiedź na pytanie licz funkcją int ileNieWiekszych(const vector<int> &v, int y) z upper_bound. Spróbuj też wersji, w której parametr to zwykłe vector<int> v — i zobacz, co powie sprawdzarka.'],
            input_format: ['Jeden wiersz: n, q, s, a, b, m.'],
            output_format: ['Jedna liczba — suma odpowiedzi na wszystkie pytania.'],
            constraints: ['1 ≤ n, q ≤ 2 · 10⁵', '1 ≤ m ≤ 10⁹, 0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 3 2 1 10', note: 'Ciąg: 3, 7, 5, 1, 3, 7, 5, 1. Lista to 3, 7, 5, 1, 3 (posortowana: 1, 3, 3, 5, 7), pytania: 7, 5, 1. Odpowiedzi: 5, 4 i 1 — razem 10.' }],
            hint: R`int ileNieWiekszych(const vector<int> &v, int y) { return upper_bound(v.begin(), v.end(), y) - v.begin(); } — upper_bound w posortowanym vectorze wskazuje pierwszy element większy od y. Bez & każde z 200 000 wywołań kopiowałoby 200 000 liczb: razem 4 · 10¹⁰ kopiowań — wiele sekund. Sumę trzymaj w long long.`,
            tests: (r) => {
                const g = (n, q, m) => `${n} ${q} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${m}`;
                return ['1 1 0 0 0 1', g(10, 10, 100), g(1000, 1000, 1000000000), `200000 200000 123 21 7 1000000`, `200000 200000 98765 103515245 12345 1000000000`, g(200000, 200000, 1000000000)];
            },
            check: (inp) => { const t = nums(inp); if (t.length !== 6 || !t.every(Number.isInteger)) return 'dane'; const [n, q, s, a, b, m] = t; return calk(n, 1, 2e5) && calk(q, 1, 2e5) && calk(m, 1, 1e9) && calk(s, 0, m - 1) && calk(a, 0, m - 1) && calk(b, 0, m - 1) ? null : 'zakres'; },
            solve: (inp) => {
                const [n, q, s, a, b, m] = nums(inp); const x = generuj(n + q, s, a, b, m); const v = x.slice(0, n).sort(); let w = 0;
                for (let i = n; i < n + q; i++) { const y = x[i]; let lo = 0, hi = n; while (lo < hi) { const md = (lo + hi) >> 1; if (v[md] <= y) lo = md + 1; else hi = md; } w += lo; }
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int ileNieWiekszych(const vector<int> &v, int y) {
    return upper_bound(v.begin(), v.end(), y) - v.begin();
}
int main() {
    long long n, q, s, a, b, m;
    cin >> n >> q >> s >> a >> b >> m;
    vector<int> v(n);
    long long x = s;
    for (int i = 0; i < n; i++) {
        v[i] = x;
        x = (x * a + b) % m;
    }
    sort(v.begin(), v.end());
    long long wynik = 0;
    for (int i = 0; i < q; i++) {
        wynik += ileNieWiekszych(v, x);
        x = (x * a + b) % m;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
    ];
};
