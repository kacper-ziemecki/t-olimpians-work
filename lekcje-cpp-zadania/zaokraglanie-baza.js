// Zaokrąglanie — baza zadań na koniec lekcji: od rozgrzewki z jednym, dwoma pomysłami (pizza dla klasy, spływ
// kajakowy, ocena ze sprawdzianu, cena po rabacie, wypożyczalnia rowerów, płot, tankowanie, średnia temperatura,
// czytanie książki, bankomat) przez zadania średnie (średnia ważona, ocena w gwiazdkach, kratki na mapie, taksówka,
// licznik wyświetleń, cyfry znaczące, noty bez skrajnych, godziny pracy, dzień tygodnia za d dni, rozkład jazdy)
// po trudne (histogram, średnia wielkich liczb, podział mandatów, kwadraty i sześciany, spłata kredytu, odcinki
// na osi, tempo biegu) i wielki finał: wycieczka klasowa. Zadania idą od łatwych przez średnie do trudnych.
module.exports = (h) => {
    const { toks } = h;
    const { jedn, napis, stale, fdiv, cdiv, rdivUp, rdivAway, isqrt, icbrt, losowa } = require('./zaokraglanie-pomoc');
    const R = String.raw;
    const B = BigInt;
    const linie = (inp) => inp.replace(/\r/g, '').split('\n');
    const lista = (inp) => { const t = toks(inp); return { n: Number(t[0]), v: t.slice(1, 1 + Number(t[0])) }; };
    const zakres = (lo, hi) => (v) => B(v) >= B(lo) && B(v) <= B(hi);
    const pad2 = (x) => String(x).padStart(2, '0');
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];
    const hhmm = (t) => `${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`;
    const minuty = (s) => { const [a, b] = s.split(':').map(Number); return 60 * a + b; };

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'zao-b-pizza', krok: 9, level: 'latwe',
            title: 'Pizza dla klasy',
            short: 'Ile pizz zamówić, żeby każdy zjadł tyle kawałków, ile chce?',
            tags: ['dzielenie w górę', 'reszta'],
            statement: ['Na klasową imprezę zamawiacie pizzę. Przychodzi n osób, a każda zje k kawałków. Jedna pizza ma 8 kawałków. W pierwszym wierszu wypisz, ile pizz trzeba zamówić, żeby każdy zjadł tyle, ile chce, a w drugim — ile kawałków zostanie.'],
            input_format: ['Jeden wiersz: liczby całkowite n i k.'],
            output_format: ['Dwa wiersze: liczba pizz i liczba kawałków, które zostaną.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ k ≤ 8'],
            examples: [{ input: '25 3', note: 'Razem 75 kawałków. 9 pizz to tylko 72 kawałki, więc trzeba 10 — zostanie 5 kawałków.' }],
            hint: R`Najpierw policz, ile kawałków zjedzą wszyscy razem: n * k. Pizz potrzeba (kawalki + 7) / 8 — to dzielenie w górę. Zostanie pizze * 8 - kawalki.`,
            tests: (r) => ['1 1', '1 8', '8 1', '1000000 8', '999999 7', '16 4', ...Array.from({ length: 6 }, () => `${r.int(1, 1000)} ${r.int(1, 8)}`), `${r.int(1, 1000000)} ${r.int(1, 8)}`],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 1 && n <= 1e6 && k >= 1 && k <= 8 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(B); const kaw = n * k, p = cdiv(kaw, 8n); return `${p}\n${p * 8n - kaw}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long kawalki = n * k;
    long long pizze = (kawalki + 7) / 8;
    cout << pizze << "\n" << pizze * 8 - kawalki << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-kajaki', krok: 9, level: 'latwe',
            title: 'Spływ kajakowy',
            short: 'Kajaki dwuosobowe płatne za każdą rozpoczętą godzinę. Ile kajaków i ile złotych?',
            tags: ['dwa dzielenia w górę', 'iloczyn'],
            statement: ['Na spływ jedzie n osób. Kajaki są dwuosobowe, a wypożyczenie jednego kajaka kosztuje c zł za każdą rozpoczętą godzinę. Spływ trwa m minut. W pierwszym wierszu wypisz, ile kajaków trzeba wypożyczyć, a w drugim — ile zapłacicie razem.'],
            input_format: ['Jeden wiersz: liczby całkowite n, c i m.'],
            output_format: ['Dwa wiersze: liczba kajaków i łączny koszt w złotych.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ c ≤ 1000', '1 ≤ m ≤ 10⁴'],
            examples: [{ input: '7 25 150', note: '7 osób to 4 kajaki. 150 minut to 3 rozpoczęte godziny, więc 4 · 3 · 25 = 300 zł.' }],
            hint: R`Dwa dzielenia w górę: kajaki = (n + 1) / 2, godziny = (m + 59) / 60. Koszt to kajaki * godziny * c — może przekroczyć zakres int, więc licz w long long.`,
            tests: (r) => ['1 1 1', '2 1 60', '3 1 61', '10000 1000 10000', '9999 999 9999', ...Array.from({ length: 6 }, () => `${r.int(1, 100)} ${r.int(1, 100)} ${r.int(1, 600)}`), `${r.int(1, 10000)} ${r.int(1, 1000)} ${r.int(1, 10000)}`],
            check: (inp) => { const [n, c, m] = toks(inp).map(Number); return n >= 1 && n <= 1e4 && c >= 1 && c <= 1000 && m >= 1 && m <= 1e4 ? null : 'zakres'; },
            solve: (inp) => { const [n, c, m] = toks(inp).map(B); const k = cdiv(n, 2n); return `${k}\n${k * cdiv(m, 60n) * c}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, c, m;
    cin >> n >> c >> m;
    long long kajaki = (n + 1) / 2;
    long long godziny = (m + 59) / 60;
    cout << kajaki << "\n" << kajaki * godziny * c << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-sprawdzian', krok: 9, level: 'latwe',
            title: 'Ocena ze sprawdzianu',
            short: 'Procent punktów obcięty w dół i ocena według progów.',
            tags: ['100 * p / M', 'progi if / else'],
            statement: ['Za sprawdzian można było dostać M punktów. Procent zdobytych punktów liczymy z zaokrągleniem w dół do pełnych procentów. Ocenę wystawiamy według progów: poniżej 30% — 1, od 30% — 2, od 50% — 3, od 70% — 4, od 85% — 5, od 95% — 6. Dla każdego z n uczniów wypisz w osobnym wierszu jego procent i ocenę.'],
            input_format: ['W pierwszym wierszu liczby n i M.', 'W drugim wierszu n liczb całkowitych — punkty uczniów.'],
            output_format: ['n wierszy, w każdym procent i ocena.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ M ≤ 1000', '0 ≤ punkty ≤ M'],
            examples: [{ input: '4 40\n40 33 20 11', note: '33 z 40 to 82.5% — w dół 82%, czyli ocena 4.' }],
            hint: R`Procent w dół to 100 * p / M — na liczbach całkowitych, mnożenie przed dzieleniem. Ocenę wybierz drabinką if-ów, zaczynając od najwyższego progu: if (proc >= 95) … else if (proc >= 85) ….`,
            tests: (r) => {
                const t = (n, M) => `${n} ${M}\n${Array.from({ length: n }, () => r.int(0, M)).join(' ')}`;
                return ['1 1\n0', '1 1\n1', '1 100\n29', '6 100\n30 49 50 69 70 84', '3 20\n17 19 6', t(20, 40), t(200, 37), t(1000, 1000), t(1000, 999)];
            },
            check: (inp) => { const t = toks(inp).map(Number), M = t[1]; return M >= 1 && M <= 1000 && t.slice(2).every((p) => p >= 0 && p <= M) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(Number), M = t[1];
                return t.slice(2, 2 + t[0]).map((p) => {
                    const pr = Math.floor(100 * p / M);
                    const oc = pr >= 95 ? 6 : pr >= 85 ? 5 : pr >= 70 ? 4 : pr >= 50 ? 3 : pr >= 30 ? 2 : 1;
                    return `${pr} ${oc}`;
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, M;
    cin >> n >> M;
    for (int i = 0; i < n; i++) {
        int p;
        cin >> p;
        int proc = 100 * p / M;
        int ocena;
        if (proc >= 95) ocena = 6;
        else if (proc >= 85) ocena = 5;
        else if (proc >= 70) ocena = 4;
        else if (proc >= 50) ocena = 3;
        else if (proc >= 30) ocena = 2;
        else ocena = 1;
        cout << proc << " " << ocena << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-rabat', krok: 9, level: 'latwe',
            title: 'Cena po rabacie',
            short: 'Obniż ceny o r procent i zaokrąglij do pełnego grosza.',
            tags: ['grosze', 'do najbliższej', 'fixed i setprecision'],
            statement: ['Sklep obniża wszystkie ceny o r procent, a nową cenę zaokrągla do najbliższego grosza. Dla każdego z n produktów wypisz cenę po rabacie z dwiema cyframi po kropce. Gwarantujemy, że żadna nowa cena nie wypada dokładnie w połowie między dwoma groszami.'],
            input_format: ['W pierwszym wierszu liczby całkowite n i r.', 'W drugim wierszu n cen, każda z co najwyżej dwiema cyframi po kropce.'],
            output_format: ['n wierszy z nowymi cenami.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ r ≤ 99', '0.01 ≤ cena ≤ 100 000'],
            examples: [{ input: '3 15\n19.99 100 0.33', note: '19.99 · 0.85 = 16.9915, czyli 16.99 zł.' }],
            hint: R`Najbezpieczniej w groszach: g = llround(cena * 100). Nowa cena w groszach to g · (100 − r) / 100 zaokrąglone do najbliższej: (g * (100 - r) + 50) / 100. Wypisz ją jako złote: / 100, kropka i % 100 z setw(2) i setfill('0'). (Zadziała też round(cena * (100 - r)) / 100 z fixed i setprecision(2).)`,
            tests: (r) => {
                const t = (n, rr) => {
                    const c = [];
                    while (c.length < n) { const g = r.int(1, 10000000); if ((g * (100 - rr)) % 100 !== 50) c.push(r() < 0.5 ? napis(B(g), 2) : stale(B(g), 2)); }
                    return `${n} ${rr}\n${c.join(' ')}`;
                };
                return ['1 1\n0.01', '1 99\n100000', '2 50\n0.02 0.04', t(10, 15), t(100, 33), t(1000, 7), t(1000, 99)];
            },
            check: (inp) => { const t = toks(inp), rr = Number(t[1]); return rr >= 1 && rr <= 99 && t.slice(2).every((s) => { const g = jedn(s, 2); return g >= 1n && g <= 10000000n && (g * B(100 - rr)) % 100n !== 50n; }) ? null : 'zakres albo połówka'; },
            solve: (inp) => { const t = toks(inp), rr = B(t[1]); return t.slice(2, 2 + Number(t[0])).map((s) => stale(rdivUp(jedn(s, 2) * (100n - rr), 100n), 2)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, r;
    cin >> n >> r;
    for (int i = 0; i < n; i++) {
        double cena;
        cin >> cena;
        long long g = llround(cena * 100);
        long long nowa = (g * (100 - r) + 50) / 100;
        cout << nowa / 100 << "." << setw(2) << setfill('0') << nowa % 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-wypozyczalnia', krok: 9, level: 'latwe',
            title: 'Wypożyczalnia rowerów',
            short: 'Pierwsze 15 minut gratis, potem za każdą rozpoczętą godzinę.',
            tags: ['dzielenie w górę', 'if', 'suma'],
            statement: ['W wypożyczalni rowerów pierwsze 15 minut jest za darmo, a potem płacisz c zł za każdą rozpoczętą godzinę liczoną od 16. minuty. Za 15 minut nie płacisz nic, za 16 minut — za jedną godzinę, za 75 minut — też za jedną, a za 76 minut — już za dwie. Dla każdego z n klientów wypisz w osobnym wierszu jego opłatę, a w ostatnim wierszu — utarg wypożyczalni.'],
            input_format: ['W pierwszym wierszu liczby n i c.', 'W drugim wierszu n liczb — czasy wypożyczenia w minutach.'],
            output_format: ['n wierszy z opłatami i jeden wiersz z utargiem.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ c ≤ 100', '1 ≤ czas ≤ 10 000'],
            examples: [{ input: '4 8\n15 16 75 76' }],
            hint: R`Gdy czas jest najwyżej 15 minut, opłata to 0. W przeciwnym razie płatne godziny to (czas - 15 + 59) / 60 — dzielenie w górę minut po kwadransie gratis.`,
            tests: (r) => {
                const t = (n, c, hi) => `${n} ${c}\n${Array.from({ length: n }, () => r.int(1, hi)).join(' ')}`;
                return ['1 1\n1', '1 100\n10000', '6 5\n14 15 16 74 75 76', '3 10\n135 136 195', t(20, 8, 300), t(300, 12, 2000), t(1000, 100, 10000)];
            },
            check: (inp) => { const t = toks(inp).map(Number); return t[1] >= 1 && t[1] <= 100 && t.slice(2).every((x) => x >= 1 && x <= 10000) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(Number), c = t[1];
                const o = t.slice(2, 2 + t[0]).map((m) => (m <= 15 ? 0 : Math.ceil((m - 15) / 60) * c));
                return `${o.join('\n')}\n${o.reduce((a, b) => a + b, 0)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, c;
    cin >> n >> c;
    long long utarg = 0;
    for (int i = 0; i < n; i++) {
        int m;
        cin >> m;
        int oplata = 0;
        if (m > 15) oplata = (m - 15 + 59) / 60 * c;
        cout << oplata << "\n";
        utarg += oplata;
    }
    cout << utarg << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-plot', krok: 9, level: 'latwe',
            title: 'Płot',
            short: 'Słupki co k metrów i na obu końcach. Ile słupków i jak długie ostatnie przęsło?',
            tags: ['dzielenie w górę', 'o jeden więcej'],
            statement: ['Budujesz prosty płot o długości L metrów. Słupki stawiasz na początku płotu i dalej co k metrów, a ostatni słupek — na samym końcu płotu (ostatnie przęsło może więc być krótsze niż k). Wypisz, ile słupków potrzeba i ile metrów ma ostatnie przęsło.'],
            input_format: ['Jeden wiersz: liczby całkowite L i k.'],
            output_format: ['Jeden wiersz: liczba słupków i długość ostatniego przęsła.'],
            constraints: ['1 ≤ L ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '23 5', note: 'Przęsła mają 5, 5, 5, 5 i 3 metry — to 5 przęseł, czyli 6 słupków.' }, { input: '20 5' }],
            hint: R`Przęseł jest (L + k - 1) / k — dzielenie w górę. Słupków jest o jeden więcej niż przęseł. Ostatnie przęsło to L minus długość wszystkich poprzednich: L - (przesla - 1) * k.`,
            tests: (r) => ['1 1', '1 1000000000', '1000000000 1', '1000000000 1000000000', '1000000000 999999999', '999999999 1000000000', '10 3', '9 3', ...Array.from({ length: 4 }, () => `${r.int(1, 1000)} ${r.int(1, 50)}`), `${r.int(1, 1e9)} ${r.int(1, 1e9)}`],
            check: (inp) => { const [L, k] = toks(inp).map(Number); return L >= 1 && L <= 1e9 && k >= 1 && k <= 1e9 ? null : 'zakres'; },
            solve: (inp) => { const [L, k] = toks(inp).map(B); const p = cdiv(L, k); return `${p + 1n} ${L - (p - 1n) * k}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long L, k;
    cin >> L >> k;
    long long przesla = (L + k - 1) / k;
    cout << przesla + 1 << " " << L - (przesla - 1) * k << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-tankowanie', krok: 9, level: 'latwe',
            title: 'Tankowanie w trasie',
            short: 'Ile razy zatankujesz do pełna po drodze, jeśli wyjeżdżasz z pełnym bakiem?',
            tags: ['dzielenie w górę', 'jednostki', 'long long'],
            statement: ['Jedziesz w trasę długości d km. Samochód spala s litrów paliwa na 100 km, a bak mieści b litrów. Wyjeżdżasz z pełnym bakiem, a gdy bak się opróżni, tankujesz do pełna. Ile razy będziesz musiał zatankować po drodze?'],
            input_format: ['Jeden wiersz: liczby całkowite d, s i b.'],
            output_format: ['Jedna liczba — liczba tankowań.'],
            constraints: ['1 ≤ d ≤ 10⁶', '1 ≤ s ≤ 30', '1 ≤ b ≤ 100'],
            examples: [{ input: '1000 7 50', note: 'Spalisz 70 litrów, czyli potrzeba 2 pełnych baków. Pierwszy masz od początku, więc tankujesz raz.' }, { input: '500 6 30', note: 'Dokładnie 30 litrów — wystarczy jeden pełny bak.' }],
            hint: R`Spalone paliwo to d · s / 100 litrów, a pełnych baków potrzeba tyle, ile wynosi to podzielone przez b i zaokrąglone w górę. Na liczbach całkowitych: (d * s + 100 * b - 1) / (100 * b). Jeden bak masz od początku, więc tankowań jest o jedno mniej.`,
            tests: (r) => ['1 1 1', '100 1 1', '101 1 1', '1000000 30 1', '1000000 1 100', '500 6 30', '501 6 30', ...Array.from({ length: 6 }, () => `${r.int(1, 5000)} ${r.int(3, 15)} ${r.int(30, 80)}`), `${r.int(1, 1000000)} ${r.int(1, 30)} ${r.int(1, 100)}`],
            check: (inp) => { const [d, s, b] = toks(inp).map(Number); return d >= 1 && d <= 1e6 && s >= 1 && s <= 30 && b >= 1 && b <= 100 ? null : 'zakres'; },
            solve: (inp) => { const [d, s, b] = toks(inp).map(B); return String(cdiv(d * s, 100n * b) - 1n); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long d, s, b;
    cin >> d >> s >> b;
    long long baki = (d * s + 100 * b - 1) / (100 * b);
    cout << baki - 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-temperatura', krok: 9, level: 'latwe',
            title: 'Średnia temperatura',
            short: 'Średnia z pomiarów (także na minusie) zaokrąglona do dziesiątych.',
            tags: ['średnia double', 'round(x * 10) / 10', 'setprecision(1)'],
            statement: ['Stacja meteo zapisała n temperatur, każdą z co najwyżej jedną cyfrą po kropce (mogą być ujemne). Wypisz średnią temperaturę zaokrągloną do jednego miejsca po przecinku, z dokładnie jedną cyfrą po kropce. Gwarantujemy, że średnia nie wypada dokładnie w połowie między dwiema dziesiątymi częściami i że nie jest ujemną liczbą bliższą zera niż 0.05 (taka wypisałaby się jako -0.0).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur.'],
            output_format: ['Jedna liczba z jedną cyfrą po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '3\n12.3 14.1 9.8', note: 'Średnia to 36.2 / 3 = 12.0666…, czyli 12.1.' }, { input: '4\n-3.5 -2.1 0.4 -1.1', note: 'Średnia to −6.3 / 4 = −1.575, czyli −1.6.' }],
            hint: R`Zsumuj temperatury w zmiennej double i podziel przez n. Zaokrąglij do dziesiątych: round(srednia * 10) / 10, a wypisz z fixed i setprecision(1).`,
            tests: (r) => {
                const ok = (ks) => { const s = ks.reduce((a, b) => a + b, 0n), n = B(ks.length); const ab = s < 0n ? -s : s; if ((2n * ab) % (2n * n) === n) return false; return !(s < 0n && rdivAway(s, n) === 0n); };
                const zestaw = (n, lo, hi) => { for (;;) { const ks = Array.from({ length: n }, () => B(r.int(lo, hi))); if (ok(ks)) return fmt(ks.map((k) => napis(k, 1))); } };
                return ['1\n0', '1\n-50', '1\n50', '2\n-0.3 0.5', zestaw(5, -100, 100), zestaw(30, -500, 0), zestaw(300, -200, 300), zestaw(1000, -500, 500)];
            },
            check: (inp) => {
                const ks = lista(inp).v.map((s) => jedn(s, 1));
                if (!ks.every(zakres(-500, 500))) return 'zakres';
                const s = ks.reduce((a, b) => a + b, 0n), n = B(ks.length), ab = s < 0n ? -s : s;
                if ((2n * ab) % (2n * n) === n) return 'połówka';
                return s < 0n && rdivAway(s, n) === 0n ? 'minus zero' : null;
            },
            solve: (inp) => { const ks = lista(inp).v.map((s) => jedn(s, 1)); return stale(rdivAway(ks.reduce((a, b) => a + b, 0n), B(ks.length)), 1); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    double suma = 0;
    for (int i = 0; i < n; i++) {
        double t;
        cin >> t;
        suma += t;
    }
    double srednia = suma / n;
    cout << fixed << setprecision(1) << round(srednia * 10) / 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-ksiazka', krok: 9, level: 'latwe',
            title: 'Czytanie książki',
            short: 'Ile dni zajmie lektura i którego dnia Ola przeczyta daną stronę?',
            tags: ['dzielenie w górę', 'zapytania'],
            statement: ['Ola czyta książkę, która ma n stron, po p stron dziennie (ostatniego dnia może przeczytać mniej). W pierwszym wierszu wypisz, ile dni zajmie jej przeczytanie całej książki. Potem dla każdego z q zapytań s wypisz w osobnym wierszu, którego dnia Ola przeczyta stronę numer s (dni numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczby n i p.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q numerów stron.'],
            output_format: ['q + 1 wierszy.'],
            constraints: ['1 ≤ n, p ≤ 10⁹', '1 ≤ q ≤ 1000', '1 ≤ s ≤ n'],
            examples: [{ input: '100 15\n3\n1 15 16', note: 'Strony 1–15 Ola czyta pierwszego dnia, a stronę 16 — drugiego.' }],
            hint: R`Dni na całą książkę: (n + p - 1) / p. Stronę s Ola czyta dnia (s + p - 1) / p — tyle „porcji po p stron” trzeba zacząć, żeby do niej dojść.`,
            tests: (r) => {
                const t = (n, p, q) => `${n} ${p}\n${q}\n${Array.from({ length: q }, () => r.int(1, n)).join(' ')}`;
                return ['1 1\n1\n1', '1000000000 1\n2\n1 1000000000', '1000000000 1000000000\n1\n1000000000', '10 3\n10\n1 2 3 4 5 6 7 8 9 10', t(100, 15, 20), t(5000, 7, 300), t(1000000000, 999, 1000)];
            },
            check: (inp) => { const t = toks(inp).map(Number), n = t[0], p = t[1]; return n >= 1 && n <= 1e9 && p >= 1 && p <= 1e9 && t.slice(3).every((s) => s >= 1 && s <= n) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(B), n = t[0], p = t[1]; return [cdiv(n, p), ...t.slice(3, 3 + Number(t[2])).map((s) => cdiv(s, p))].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, p;
    int q;
    cin >> n >> p >> q;
    cout << (n + p - 1) / p << "\n";
    for (int i = 0; i < q; i++) {
        long long s;
        cin >> s;
        cout << (s + p - 1) / p << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-bankomat', krok: 9, level: 'latwe',
            title: 'Bankomat',
            short: 'Bankomat ma tylko jeden nominał. Najbliższe kwoty, które może wypłacić.',
            tags: ['wielokrotności k', 'w dół i w górę'],
            statement: ['Bankomat wypłaca tylko banknoty o nominale k zł. Dla każdej z n kwot, o które proszą klienci, wypisz w osobnym wierszu dwie liczby: największą kwotę nie większą od prośby, którą bankomat może wypłacić, i najmniejszą kwotę nie mniejszą od prośby.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n kwot.'],
            output_format: ['n wierszy, w każdym dwie kwoty.'],
            constraints: ['1 ≤ n ≤ 1000', 'k to 10, 20, 50, 100, 200 albo 500', '1 ≤ kwota ≤ 10⁹'],
            examples: [{ input: '3 50\n130 150 20', note: 'Za 20 zł bankomat nie wypłaci nic — w dół wychodzi 0.' }],
            hint: R`To zaokrąglenie do wielokrotności k: w dół a / k * k, a w górę (a + k - 1) / k * k. Kwoty mogą sięgać miliarda, więc a + k - 1 trzymaj w long long.`,
            tests: (r) => {
                const t = (n, k) => `${n} ${k}\n${Array.from({ length: n }, () => (r() < 0.2 ? k * r.int(1, Math.floor(1e9 / k)) : r.int(1, 1000000000))).join(' ')}`;
                return ['1 10\n1', '1 500\n1000000000', '1 500\n999999999', '4 20\n19 20 21 40', t(20, 50), t(200, 200), t(1000, 500), t(1000, 10)];
            },
            check: (inp) => { const t = toks(inp).map(Number); return [10, 20, 50, 100, 200, 500].includes(t[1]) && t.slice(2).every((a) => a >= 1 && a <= 1e9) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(B), k = t[1]; return t.slice(2, 2 + Number(t[0])).map((a) => `${a / k * k} ${cdiv(a, k) * k}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        long long a;
        cin >> a;
        cout << a / k * k << " " << (a + k - 1) / k * k << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'zao-b-srednia-wazona', krok: 9, level: 'srednie',
            title: 'Średnia ważona',
            short: 'Średnia z wagami zaokrąglona do setnych — i ocena według zaokrąglonej średniej.',
            tags: ['suma iloczynów', 'do setnych', 'progi na liczbach całkowitych'],
            statement: ['Oceny w dzienniku mają wagi (na przykład kartkówka 1, sprawdzian 3). Średnia ważona to suma iloczynów ocena · waga podzielona przez sumę wag. W pierwszym wierszu wypisz średnią ważoną ucznia zaokrągloną do dwóch miejsc po przecinku, z dokładnie dwiema cyframi po kropce. W drugim wierszu wypisz ocenę końcową, wystawianą według zaokrąglonej średniej: od 5.51 — 6, od 4.51 — 5, od 3.51 — 4, od 2.51 — 3, od 1.51 — 2, a poniżej — 1. Gwarantujemy, że średnia nie leży dokładnie w połowie między dwiema setnymi.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy ocena (od 1 do 6) i jej waga (od 1 do 5).'],
            output_format: ['Dwa wiersze: średnia z dwiema cyframi po kropce i ocena końcowa.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '4\n5 3\n6 1\n4 2\n5 1', note: 'Suma iloczynów 34, suma wag 7 — średnia 4.857…, czyli 4.86, a to ocena 5.' }],
            hint: R`W pętli zbieraj sumę iloczynów i sumę wag (long long). Średnią zaokrąglij do setnych: round(100.0 * suma / wagi) / 100 i wypisz z fixed i setprecision(2). Ocenę wybieraj według zaokrąglonej średniej — najbezpieczniej jako liczby całkowitej setnych: llround(100.0 * suma / wagi) >= 551 itd. Porównanie niezaokrąglonej średniej z 5.51 dałoby inny wynik na przykład dla 5.506.`,
            tests: (r) => {
                const zestaw = (n, lo) => {
                    for (;;) {
                        const p = Array.from({ length: n }, () => [r.int(lo, 6), r.int(1, 5)]);
                        const S = p.reduce((a, [o, w]) => a + o * w, 0), W = p.reduce((a, [, w]) => a + w, 0);
                        if ((200 * S) % (2 * W) !== W) return wiersze(p.map((x) => x.join(' ')));
                    }
                };
                return ['1\n6 5', '1\n1 1', '2\n5 1\n6 1', '3\n6 3\n5 1\n5 1', zestaw(5, 1), zestaw(12, 4), zestaw(50, 3), zestaw(300, 1), zestaw(1000, 5)];
            },
            check: (inp) => {
                const p = linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => toks(w).map(Number));
                if (!p.every(([o, w]) => o >= 1 && o <= 6 && w >= 1 && w <= 5)) return 'zakres';
                const S = p.reduce((a, [o, w]) => a + o * w, 0), W = p.reduce((a, [, w]) => a + w, 0);
                return (200 * S) % (2 * W) === W ? 'połówka' : null;
            },
            solve: (inp) => {
                const p = linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => toks(w).map(Number));
                const S = p.reduce((a, [o, w]) => a + o * w, 0), W = p.reduce((a, [, w]) => a + w, 0);
                const a = Number(rdivUp(100n * B(S), B(W)));
                const oc = a >= 551 ? 6 : a >= 451 ? 5 : a >= 351 ? 4 : a >= 251 ? 3 : a >= 151 ? 2 : 1;
                return `${stale(B(a), 2)}\n${oc}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0, wagi = 0;
    for (int i = 0; i < n; i++) {
        long long o, w;
        cin >> o >> w;
        suma += o * w;
        wagi += w;
    }
    long long setne = llround(100.0 * suma / wagi);
    cout << fixed << setprecision(2) << setne / 100.0 << "\n";
    int ocena;
    if (setne >= 551) ocena = 6;
    else if (setne >= 451) ocena = 5;
    else if (setne >= 351) ocena = 4;
    else if (setne >= 251) ocena = 3;
    else if (setne >= 151) ocena = 2;
    else ocena = 1;
    cout << ocena << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-gwiazdki', krok: 9, level: 'srednie',
            title: 'Ocena w gwiazdkach',
            short: 'Średnia ocen zaokrąglona do połowy gwiazdki.',
            tags: ['zaokrąglanie do 0.5', 'llround(2.0 * suma / n)', 'setprecision(1)'],
            statement: ['Sklep internetowy pokazuje ocenę produktu w gwiazdkach z dokładnością do połowy gwiazdki: średnią wszystkich ocen (liczby całkowite od 1 do 5) zaokrągla do najbliższej wielokrotności 0.5, a gdy średnia leży dokładnie w połowie między dwiema takimi wartościami — w górę. Dla każdego z t produktów wypisz wyświetlaną ocenę z jedną cyfrą po kropce (na przykład 4.5 albo 4.0).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczba ocen n, a po niej n ocen produktu.'],
            output_format: ['t wierszy z ocenami w gwiazdkach.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 100'],
            examples: [{ input: '3\n4 5 4 4 4\n3 1 2 2\n2 5 4', note: 'Średnia 4.25 leży dokładnie w połowie między 4.0 a 4.5 — idzie w górę, do 4.5. Średnia 1.67 jest najbliżej 1.5.' }],
            hint: R`Zaokrąglanie do wielokrotności 0.5 to zaokrąglanie do całości liczby dwa razy większej: polowki = llround(2.0 * suma / n), a wyświetlana ocena to polowki / 2.0 — wypisana z fixed i setprecision(1). Na liczbach całkowitych: polowki = (4 * suma + n) / (2 * n).`,
            tests: (r) => {
                const produkt = (n) => `${n} ${Array.from({ length: n }, () => r.int(1, 5)).join(' ')}`;
                const remis = () => { for (;;) { const n = 4 * r.int(1, 25), v = Array.from({ length: n }, () => r.int(1, 5)); const s = v.reduce((a, b) => a + b, 0); if ((4 * s) % (2 * n) === n) return `${n} ${v.join(' ')}`; } };
                return ['1\n1 1', '1\n1 5', '1\n4 5 4 4 4', '2\n4 1 1 1 2\n4 3 3 3 2', wiersze(Array.from({ length: 20 }, () => (r() < 0.4 ? remis() : produkt(r.int(1, 12))))), wiersze(Array.from({ length: 100 }, () => (r() < 0.3 ? remis() : produkt(r.int(1, 100)))))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const v = toks(w).map(Number); return v[0] >= 1 && v[0] <= 100 && v.length === v[0] + 1 && v.slice(1).every((x) => x >= 1 && x <= 5); }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const v = toks(w).map(Number), s = v.slice(1).reduce((a, b) => a + b, 0);
                return stale(rdivUp(4n * B(s), 2n * B(v[0])) * 5n, 1);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << fixed << setprecision(1);
    for (int i = 0; i < t; i++) {
        int n;
        cin >> n;
        int suma = 0;
        for (int j = 0; j < n; j++) {
            int o;
            cin >> o;
            suma += o;
        }
        long long polowki = llround(2.0 * suma / n);
        cout << polowki / 2.0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-mapa', krok: 9, level: 'srednie',
            title: 'Kratki na mapie',
            short: 'W ilu różnych kratkach coś znaleziono i gdzie najwięcej?',
            tags: ['floor', 'vector par', 'sort i grupy'],
            statement: ['Mapa jest podzielona na kwadratowe kratki o boku 1 km. Kratka (i, j) to wszystkie punkty (x, y), dla których i ≤ x < i + 1 oraz j ≤ y < j + 1. Ratownicy zgłosili n znalezisk o współrzędnych (x, y). W pierwszym wierszu wypisz, w ilu różnych kratkach coś znaleziono. W drugim wierszu wypisz kratkę z największą liczbą znalezisk (dwie liczby i, j) i tę liczbę. Gdy kilka kratek ma tyle samo znalezisk, wybierz tę o najmniejszym i, a przy równych i — o najmniejszym j.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy współrzędne x i y (z co najwyżej dwiema cyframi po kropce).'],
            output_format: ['Dwa wiersze: liczba różnych kratek oraz i, j i liczba znalezisk.'],
            constraints: ['1 ≤ n ≤ 4000', '−1000 ≤ x, y ≤ 1000'],
            examples: [{ input: '5\n0.5 0.5\n-0.5 0.3\n0.9 0.1\n-0.1 0.99\n3 -2', note: 'Kratki: (0, 0), (−1, 0), (0, 0), (−1, 0) i (3, −2). Kratki (−1, 0) i (0, 0) mają po 2 znaleziska — wygrywa (−1, 0), bo ma mniejsze i.' }],
            hint: R`Zamień każdy punkt na numer kratki: (long long)floor(x) i (long long)floor(y) — i zapisz jako parę w vectorze. Posortuj vector: równe kratki staną obok siebie, więc policzysz grupy jak w lekcji o sortowaniu. Pary sortują się najpierw po pierwszym, potem po drugim elemencie — dzięki temu pierwsza grupa o największej liczności to od razu ta z najmniejszym i i j.`,
            tests: (r) => {
                const pkt = (lo, hi) => `${losowa(r, lo, hi, 2).s} ${losowa(r, lo, hi, 2).s}`;
                return ['1\n0 0', '1\n-0.01 -0.01', '2\n1000 1000\n-1000 -1000', '4\n0.5 0.5\n-0.5 -0.5\n0.5 -0.5\n-0.5 0.5', wiersze(Array.from({ length: 30 }, () => pkt(-300, 300))), wiersze(Array.from({ length: 1000 }, () => pkt(-1000, 1000))), wiersze(Array.from({ length: 4000 }, () => pkt(-100000, 100000))), wiersze(Array.from({ length: 4000 }, () => pkt(-1500, 1500)))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => toks(w).every((s) => zakres(-100000, 100000)(jedn(s, 2)))) ? null : 'zakres'),
            solve: (inp) => {
                const m = new Map();
                linie(inp).slice(1, 1 + Number(toks(inp)[0])).forEach((w) => { const [x, y] = toks(w).map((s) => fdiv(jedn(s, 2), 100n)); const k = `${x} ${y}`; m.set(k, (m.get(k) || 0) + 1); });
                let best = null;
                for (const [k, c] of m) {
                    const [x, y] = k.split(' ').map(B);
                    if (!best || c > best.c || (c === best.c && (x < best.x || (x === best.x && y < best.y)))) best = { x, y, c };
                }
                return `${m.size}\n${best.x} ${best.y} ${best.c}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> k(n);
    for (int i = 0; i < n; i++) {
        double x, y;
        cin >> x >> y;
        k[i] = {(long long)floor(x), (long long)floor(y)};
    }
    sort(k.begin(), k.end());
    int rozne = 0, najwiecej = 0;
    pair<long long, long long> najlepsza;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && k[j] == k[i]) j++;
        rozne++;
        if (j - i > najwiecej) {
            najwiecej = j - i;
            najlepsza = k[i];
        }
        i = j;
    }
    cout << rozne << "\n" << najlepsza.first << " " << najlepsza.second << " " << najwiecej << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-taksowka', krok: 9, level: 'srednie',
            title: 'Taksówka',
            short: 'Opłata za rozpoczęte kilometry, a w nocy półtorej raza — w górę do grosza.',
            tags: ['dzielenie w górę', 'grosze', '3 * cena / 2 w górę'],
            statement: ['Taksówka liczy opłatę startową s groszy i k groszy za każdy rozpoczęty kilometr. W nocy cała kwota jest mnożona przez 1.5 i zaokrąglana w górę do pełnego grosza. Dla każdego z n kursów znasz jego długość w metrach i literę D (dzień) albo N (noc). Wypisz cenę każdego kursu w złotych, z dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczby n, s i k.', 'W każdym z kolejnych n wierszy długość kursu w metrach i litera D albo N.'],
            output_format: ['n wierszy z cenami.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ s, k ≤ 10 000', '1 ≤ długość ≤ 10⁶'],
            examples: [{ input: '3 799 300\n2500 D\n2500 N\n1000 N', note: '2500 m to 3 rozpoczęte kilometry: 799 + 900 = 1699 groszy. W nocy 1699 · 1.5 = 2548.5, w górę do 2549 groszy.' }],
            hint: R`Licz w groszach. Rozpoczęte kilometry to (metry + 999) / 1000. Cena nocna to dzienna razy 3/2 zaokrąglona w górę: (3 * cena + 1) / 2. Wypisz złote i grosze: cena / 100, kropka i cena % 100 z setw(2) i setfill('0').`,
            tests: (r) => {
                const t = (n, s, k) => `${n} ${s} ${k}\n${Array.from({ length: n }, () => `${r.int(1, r() < 0.5 ? 20000 : 1000000)} ${r.pick(['D', 'N'])}`).join('\n')}`;
                return ['1 1 1\n1 D', '1 1 1\n1 N', '1 10000 10000\n1000000 N', '4 800 300\n1000 D\n1001 D\n999 N\n1001 N', t(20, 799, 301), t(300, 1001, 333), t(1000, 9999, 9999)];
            },
            check: (inp) => { const t = toks(inp); return +t[1] >= 1 && +t[1] <= 10000 && +t[2] >= 1 && +t[2] <= 10000 && linie(inp).slice(1).every((w) => { const [m, p] = toks(w); return +m >= 1 && +m <= 1e6 && (p === 'D' || p === 'N'); }) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp), s = B(t[1]), k = B(t[2]);
                return linie(inp).slice(1, 1 + Number(t[0])).map((w) => {
                    const [m, p] = toks(w); let c = s + cdiv(B(m), 1000n) * k;
                    if (p === 'N') c = cdiv(3n * c, 2n);
                    return stale(c, 2);
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long s, k;
    cin >> n >> s >> k;
    for (int i = 0; i < n; i++) {
        long long metry;
        char pora;
        cin >> metry >> pora;
        long long cena = s + (metry + 999) / 1000 * k;
        if (pora == 'N') cena = (3 * cena + 1) / 2;
        cout << cena / 100 << "." << setw(2) << setfill('0') << cena % 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-licznik', krok: 9, level: 'srednie',
            title: 'Licznik wyświetleń',
            short: 'Skróć liczbę do 1.2k, 15.3M albo 2B — obcinając, a nie zaokrąglając.',
            tags: ['obcinanie do dziesiątych', 'dzielenie całkowite', 'long long'],
            statement: ['Pod filmami licznik wyświetleń jest skracany. Liczby mniejsze od 1000 pokazuje w całości. Liczby od 1000 do 999 999 pokazuje w tysiącach z literą k, z jedną cyfrą po kropce obciętą w dół (1234 → 1.2k, 12 345 → 12.3k, 999 999 → 999.9k). Liczby od miliona do 999 999 999 — w milionach z literą M (1 550 000 → 1.5M), a od miliarda — w miliardach z literą B. Jeśli cyfra po kropce wyszła 0, licznik nie pokazuje ani jej, ani kropki (1000 → 1k, 2 040 000 → 2M). Dla każdej z n liczb wypisz, co pokaże licznik.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n wierszy.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ liczba < 10¹²'],
            examples: [{ input: '6\n999 1000 1234 999999 1550000 2040000000' }],
            hint: R`Najpierw wybierz jednostkę: u = 1000 i litera k, u = 1 000 000 i M albo u = 1 000 000 000 i B. Liczba dziesiątych części jednostki to x / (u / 10) — dzielenie całkowite samo obcina w dół. Część całkowita to dziesiate / 10, a cyfra po kropce — dziesiate % 10; gdy jest zerem, nie wypisuj kropki. Liczby nie mieszczą się w int — long long.`,
            tests: (r) => {
                const jedna = () => { const e = r.int(0, 11); return String(r.big(e ? 10n ** B(e) : 0n, 10n ** B(e + 1) - 1n)); };
                return ['1\n0', '1\n999999999999', '9\n999 1000 1099 1100 999999 1000000 1099999 999999999 1000000000', '4\n10000 100000 120000 100100', fmt(Array.from({ length: 30 }, jedna)), fmt(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (lista(inp).v.every(zakres(0, '999999999999')) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => {
                const x = B(s);
                if (x < 1000n) return String(x);
                const [u, L] = x < 1000000n ? [1000n, 'k'] : x < 1000000000n ? [1000000n, 'M'] : [1000000000n, 'B'];
                const dz = x / (u / 10n);
                return `${dz / 10n}${dz % 10n ? `.${dz % 10n}` : ''}${L}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x < 1000) {
            cout << x << "\n";
            continue;
        }
        long long u;
        char litera;
        if (x < 1000000) { u = 1000; litera = 'k'; }
        else if (x < 1000000000) { u = 1000000; litera = 'M'; }
        else { u = 1000000000; litera = 'B'; }
        long long dziesiate = x / (u / 10);
        cout << dziesiate / 10;
        if (dziesiate % 10 != 0) cout << "." << dziesiate % 10;
        cout << litera << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-cyfry-znaczace', krok: 9, level: 'srednie',
            title: 'Cyfry znaczące',
            short: 'Zaokrąglij liczbę do k pierwszych cyfr: 123 456 → 120 000.',
            tags: ['liczba cyfr', 'potęga dziesiątki', 'do wielokrotności'],
            statement: ['Zaokrąglić liczbę do k cyfr znaczących to zostawić jej k pierwszych cyfr (zaokrąglając do najbliższej, połówki w górę), a resztę cyfr zamienić na zera. Na przykład 123 456 do 2 cyfr znaczących to 120 000, a do 3 cyfr — 123 000. 125 000 do 2 cyfr to 130 000, a 999 do 1 cyfry — 1000. Dla każdego z t zapytań n, k wypisz liczbę n zaokrągloną do k cyfr znaczących. Jeśli n ma co najwyżej k cyfr, zostaje bez zmian.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite n i k.'],
            output_format: ['t wierszy z wynikami.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸', '1 ≤ k ≤ 18'],
            examples: [{ input: '4\n123456 2\n125000 2\n999 1\n42 5' }],
            hint: R`Policz cyfry liczby n (pętlą: dziel przez 10, dopóki coś zostaje) i potęgę p = 10 do potęgi (cyfry − k) — pętlą mnożącą przez 10. Zaokrąglenie do najbliższej wielokrotności p to (n + p / 2) / p * p. Wszystko w long long — wynik może mieć o jedną cyfrę więcej niż n.`,
            tests: (r) => {
                const q = () => `${r.big(1, '1000000000000000000')} ${r.int(1, 18)}`;
                const m = () => `${r.int(1, 1000000)} ${r.int(1, 4)}`;
                return ['1\n1 1', '1\n1000000000000000000 1', '1\n999999999999999999 1', '1\n999999999999999999 17', '1\n950000000000000000 1', '3\n15 1\n14 1\n5 1',
                    wiersze(Array.from({ length: 40 }, m)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.5 ? q() : m())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [n, k] = toks(w); return zakres(1, '1000000000000000000')(n) && +k >= 1 && +k <= 18; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [ns, ks] = toks(w); const n = B(ns), d = ns.length, k = Number(ks);
                if (d <= k) return String(n);
                const p = 10n ** B(d - k);
                return String((n + p / 2n) / p * p);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n;
        int k;
        cin >> n >> k;
        int cyfry = 0;
        long long x = n;
        while (x > 0) {
            cyfry++;
            x /= 10;
        }
        if (cyfry <= k) {
            cout << n << "\n";
            continue;
        }
        long long p = 1;
        for (int j = 0; j < cyfry - k; j++) p *= 10;
        cout << (n + p / 2) / p * p << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-noty', krok: 9, level: 'srednie',
            title: 'Noty bez skrajnych',
            short: 'Odrzuć najwyższą i najniższą notę, a z reszty policz średnią do setnych.',
            tags: ['max i min', 'średnia do setnych', 'fixed i setprecision'],
            statement: ['Każdego zawodnika ocenia n sędziów (noty to liczby całkowite od 0 do 100). Odrzuca się jedną najwyższą i jedną najniższą notę, a z pozostałych liczy średnią, zaokrągloną do dwóch miejsc po przecinku. Dla każdego z t zawodników wypisz tę średnią z dokładnie dwiema cyframi po kropce. Gwarantujemy, że żadna średnia nie leży dokładnie w połowie między dwiema setnymi.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczba sędziów n, a po niej n not.'],
            output_format: ['t wierszy ze średnimi.'],
            constraints: ['1 ≤ t ≤ 100', '3 ≤ n ≤ 100'],
            examples: [{ input: '2\n5 80 95 85 60 90\n3 50 50 50', note: 'U pierwszego odrzucamy 95 i 60 — zostaje (80 + 85 + 90) / 3 = 85.00.' }],
            hint: R`Suma, max i min w jednej pętli (lekcja o max i min). Z pozostałych zostaje suma − max − min, a sędziów n − 2. Średnia do setnych: round(100.0 * reszta / (n - 2)) / 100, wypisana z fixed i setprecision(2).`,
            tests: (r) => {
                const zaw = (n) => {
                    for (;;) {
                        const v = Array.from({ length: n }, () => r.int(r() < 0.7 ? 50 : 0, 100));
                        const s = v.reduce((a, b) => a + b, 0) - Math.max(...v) - Math.min(...v);
                        if ((200 * s) % (2 * (n - 2)) !== n - 2) return `${n} ${v.join(' ')}`;
                    }
                };
                return ['1\n3 0 0 0', '1\n3 100 100 100', '1\n3 0 50 100', '2\n4 10 20 30 40\n6 1 2 3 4 5 6', wiersze(Array.from({ length: 20 }, () => zaw(r.int(3, 9)))), wiersze(Array.from({ length: 100 }, () => zaw(r.int(3, 100))))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => {
                const v = toks(w).map(Number), n = v[0], x = v.slice(1);
                if (!(n >= 3 && n <= 100 && x.length === n && x.every((a) => a >= 0 && a <= 100))) return false;
                const s = x.reduce((a, b) => a + b, 0) - Math.max(...x) - Math.min(...x);
                return (200 * s) % (2 * (n - 2)) !== n - 2;
            }) ? null : 'zakres albo połówka'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const v = toks(w).map(Number), x = v.slice(1);
                const s = x.reduce((a, b) => a + b, 0) - Math.max(...x) - Math.min(...x);
                return stale(rdivUp(100n * B(s), B(v[0] - 2)), 2);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << fixed << setprecision(2);
    for (int i = 0; i < t; i++) {
        int n;
        cin >> n;
        int suma = 0, maks = -1, mini = 101;
        for (int j = 0; j < n; j++) {
            int x;
            cin >> x;
            suma += x;
            maks = max(maks, x);
            mini = min(mini, x);
        }
        int reszta = suma - maks - mini;
        cout << round(100.0 * reszta / (n - 2)) / 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-godziny-pracy', krok: 9, level: 'srednie',
            title: 'Godziny pracy',
            short: 'Każda wizyta rozliczana za rozpoczęte kwadranse. Ile czasu i ile pieniędzy?',
            tags: ['hh:mm', 'dzielenie w górę', 'grosze'],
            statement: ['Fachowiec rozlicza się za każdy rozpoczęty kwadrans pracy, osobno za każdą wizytę. Dla n wizyt znasz godzinę rozpoczęcia i zakończenia (tego samego dnia, w formacie hh:mm; zakończenie jest późniejsze niż rozpoczęcie). Stawka to s groszy za kwadrans. W pierwszym wierszu wypisz łączny rozliczony czas w postaci „X h Y min”, a w drugim — należność w złotych z dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczby n i s.', 'W każdym z kolejnych n wierszy dwie godziny w formacie hh:mm — rozpoczęcie i zakończenie wizyty.'],
            output_format: ['Dwa wiersze: czas i należność.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ s ≤ 10 000'],
            examples: [{ input: '3 2500\n08:00 09:10\n13:05 13:20\n15:00 15:01', note: '70 minut to 5 rozpoczętych kwadransów, 15 minut — 1, a 1 minuta — też 1. Razem 7 kwadransów, czyli 1 h 45 min i 175.00 zł.' }],
            hint: R`Wczytuj godziny z separatorem: cin >> h1 >> c >> m1 >> h2 >> c >> m2;. Czas wizyty w minutach to różnica, a rozliczone kwadranse — (minuty + 14) / 15. Zsumuj kwadranse wszystkich wizyt; czas to kwadranse · 15 minut, a należność — kwadranse · s groszy.`,
            tests: (r) => {
                const wiz = () => { const a = r.int(0, 1438), b = r.int(a + 1, Math.min(1439, a + r.pick([30, 120, 600]))); return `${hhmm(a)} ${hhmm(b)}`; };
                const t = (n, s) => `${n} ${s}\n${Array.from({ length: n }, wiz).join('\n')}`;
                return ['1 1\n00:00 00:01', '1 10000\n00:00 23:59', '4 100\n10:00 10:15\n10:00 10:16\n10:00 10:30\n10:00 10:31', t(10, 2500), t(200, 1999), t(1000, 10000)];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b] = toks(w); return /^([01]\d|2[0-3]):[0-5]\d$/.test(a) && /^([01]\d|2[0-3]):[0-5]\d$/.test(b) && minuty(a) < minuty(b); }) ? null : 'zakres'),
            solve: (inp) => {
                const t = toks(inp), s = B(t[1]);
                const q = linie(inp).slice(1, 1 + Number(t[0])).reduce((acc, w) => { const [a, b] = toks(w); return acc + cdiv(B(minuty(b) - minuty(a)), 15n); }, 0n);
                const min = q * 15n;
                return `${min / 60n} h ${min % 60n} min\n${stale(q * s, 2)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long s;
    cin >> n >> s;
    long long kwadranse = 0;
    for (int i = 0; i < n; i++) {
        int h1, m1, h2, m2;
        char c;
        cin >> h1 >> c >> m1 >> h2 >> c >> m2;
        int minuty = (60 * h2 + m2) - (60 * h1 + m1);
        kwadranse += (minuty + 14) / 15;
    }
    long long czas = kwadranse * 15;
    long long grosze = kwadranse * s;
    cout << czas / 60 << " h " << czas % 60 << " min\n";
    cout << grosze / 100 << "." << setw(2) << setfill('0') << grosze % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-dzien-tygodnia', krok: 9, level: 'srednie',
            title: 'Za d dni',
            short: 'Jaki dzień tygodnia będzie za d dni — albo był d dni temu?',
            tags: ['dzielenie w dół', 'reszta 0..6', 'long long'],
            statement: ['Dzisiaj jest dzień tygodnia podany nazwą (bez polskich znaków: poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela). Dla każdego z q zapytań d wypisz nazwę dnia tygodnia, który wypada za d dni (d może być ujemne: −1 to wczoraj), oraz numer tygodnia, w którym leży ten dzień. Tygodnie zaczynają się w poniedziałek; bieżący tydzień ma numer 0, następny — 1, poprzedni — −1.'],
            input_format: ['W pierwszym wierszu nazwa dzisiejszego dnia.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb całkowitych d.'],
            output_format: ['q wierszy, w każdym nazwa dnia i numer tygodnia.'],
            constraints: ['1 ≤ q ≤ 800', '−10¹⁸ ≤ d ≤ 10¹⁸'],
            examples: [{ input: 'sroda\n4\n0 5 -3 -10', note: 'Za 5 dni od środy jest poniedziałek następnego tygodnia. 10 dni temu była niedziela sprzed dwóch tygodni.' }],
            hint: R`Zamień nazwę na numer (poniedziałek = 0, …, niedziela = 6) i dodaj d: t = dzis + d. Numer tygodnia to t / 7 zaokrąglone w dół — z poprawką, gdy reszta jest ujemna — a numer dnia to t - 7 * tydzien. Wszystko w long long.`,
            tests: (r) => {
                const t = (q, big) => `${r.pick(DNI)}\n${q}\n${Array.from({ length: q }, () => (big ? r.big('-1000000000000000000', '1000000000000000000') : r.int(-30, 30))).join(' ')}`;
                return ['poniedzialek\n1\n0', 'niedziela\n1\n1', 'poniedzialek\n1\n-1', 'niedziela\n2\n1000000000000000000 -1000000000000000000', t(20, false), t(300, false), t(800, true)];
            },
            check: (inp) => { const t = toks(inp); return DNI.includes(t[0]) && t.slice(2).every(zakres('-1000000000000000000', '1000000000000000000')) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp), dzis = B(DNI.indexOf(t[0]));
                return t.slice(2, 2 + Number(t[1])).map((s) => { const x = dzis + B(s), w = fdiv(x, 7n); return `${DNI[Number(x - 7n * w)]} ${w}`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string dni[7] = {"poniedzialek", "wtorek", "sroda", "czwartek", "piatek", "sobota", "niedziela"};
    string nazwa;
    int q;
    cin >> nazwa >> q;
    long long dzis = 0;
    for (int i = 0; i < 7; i++)
        if (dni[i] == nazwa) dzis = i;
    for (int i = 0; i < q; i++) {
        long long d;
        cin >> d;
        long long t = dzis + d;
        long long tydzien = t / 7;
        if (t % 7 < 0) tydzien--;
        cout << dni[t - 7 * tydzien] << " " << tydzien << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-rozklad', krok: 9, level: 'srednie',
            title: 'Rozkład jazdy',
            short: 'Pociągi co k minut od P do O. Kiedy odjedzie pasażer — o ile w ogóle?',
            tags: ['następna wielokrotność', 'hh:mm', 'warunek końca'],
            statement: ['Pierwszy pociąg odjeżdża o godzinie P, a kolejne co k minut — ostatni odjeżdża najpóźniej o godzinie O (wszystko jednego dnia). Dla każdego z q pasażerów, którzy przychodzą na peron o godzinie t, wypisz godzinę odjazdu najbliższego pociągu (który odjeżdża nie wcześniej niż o t) i czas czekania w minutach — albo BRAK, jeśli tego dnia nie odjeżdża już żaden pociąg.'],
            input_format: ['W pierwszym wierszu godziny P i O (w formacie hh:mm) i liczba k.', 'W drugim wierszu liczba q.', 'W każdym z kolejnych q wierszy godzina przyjścia pasażera.'],
            output_format: ['q wierszy: godzina odjazdu i czas czekania albo BRAK.'],
            constraints: ['P ≤ O', '1 ≤ k ≤ 1440', '1 ≤ q ≤ 1000'],
            examples: [{ input: '06:10 21:50 25\n4\n05:00\n06:10\n07:01\n21:59', note: 'Ostatni pociąg odjeżdża o 21:35 (kolejny byłby o 22:00, już po 21:50), więc pasażer z 21:59 nie odjedzie.' }],
            hint: R`Zamień godziny na minuty od północy. Ostatni odjazd to p + (o - p) / k * k. Gdy pasażer przychodzi najpóźniej o p, jedzie pierwszym pociągiem; w przeciwnym razie odjazd to p + (t - p + k - 1) / k * k — dzielenie w górę czasu, który minął od pierwszego odjazdu. Jeśli odjazd wypada po ostatnim — BRAK.`,
            tests: (r) => {
                const t = (q) => {
                    const p = r.int(0, 1200), o = r.int(p, 1439), k = r.int(1, r() < 0.5 ? 60 : 1440);
                    return `${hhmm(p)} ${hhmm(o)} ${k}\n${q}\n${Array.from({ length: q }, () => hhmm(r.int(0, 1439))).join('\n')}`;
                };
                return ['00:00 00:00 1\n2\n00:00\n00:01', '00:00 23:59 1440\n2\n00:00\n00:01', '12:00 12:00 5\n3\n11:59\n12:00\n12:01', '06:00 07:00 30\n4\n06:29\n06:30\n06:31\n07:00', t(20), t(300), t(1000)];
            },
            check: (inp) => { const [P, O, k] = toks(linie(inp)[0]); return minuty(P) <= minuty(O) && +k >= 1 && +k <= 1440 && linie(inp).slice(2).every((w) => /^([01]\d|2[0-3]):[0-5]\d$/.test(w.trim())) ? null : 'zakres'; },
            solve: (inp) => {
                const l = linie(inp), [P, O, ks] = toks(l[0]), p = minuty(P), o = minuty(O), k = Number(ks);
                const ost = p + Math.floor((o - p) / k) * k;
                return l.slice(2, 2 + Number(l[1])).map((w) => {
                    const t = minuty(w.trim()), od = t <= p ? p : p + Math.ceil((t - p) / k) * k;
                    return od > ost ? 'BRAK' : `${hhmm(od)} ${od - t}`;
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, m, k, q;
    char c;
    cin >> h >> c >> m;
    int p = 60 * h + m;
    cin >> h >> c >> m;
    int o = 60 * h + m;
    cin >> k >> q;
    int ostatni = p + (o - p) / k * k;
    for (int i = 0; i < q; i++) {
        cin >> h >> c >> m;
        int t = 60 * h + m;
        int odjazd;
        if (t <= p) odjazd = p;
        else odjazd = p + (t - p + k - 1) / k * k;
        if (odjazd > ostatni) cout << "BRAK\n";
        else cout << setw(2) << setfill('0') << odjazd / 60 << ":" << setw(2) << setfill('0') << odjazd % 60 << " " << odjazd - t << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'zao-b-histogram', krok: 9, level: 'trudne',
            title: 'Histogram',
            short: 'Rozdziel pomiary na przedziały szerokości w — bez potknięć na granicach.',
            tags: ['dzielenie w dół z minusem', 'liczenie w setnych', 'tablica liczników'],
            statement: ['Masz n pomiarów (liczby z co najwyżej dwiema cyframi po kropce, mogą być ujemne) i szerokość przedziału w. Przedział numer i to wszystkie liczby x, dla których i · w ≤ x < (i + 1) · w. Wypisz liczności wszystkich przedziałów — od tego, w którym leży najmniejszy pomiar, do tego, w którym leży największy, także pustych. Każdy przedział wypisz w osobnym wierszu: jego numer i liczbę pomiarów.'],
            input_format: ['W pierwszym wierszu liczba n i szerokość w (z co najwyżej dwiema cyframi po kropce).', 'W drugim wierszu n pomiarów.'],
            output_format: ['Kolejne przedziały, każdy w osobnym wierszu: numer i liczność.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ w ≤ 1000', '−1000 ≤ każdy pomiar ≤ 1000'],
            examples: [{ input: '7 2.5\n-3 -0.01 0 2.49 2.5 7.4 -2.5', note: 'Pomiar −3 leży w przedziale −2 (od −5 do −2.5), a pomiar 2.5 — już w przedziale 1 (od 2.5 do 5).' }],
            hint: R`Licz w setnych: X = llround(x * 100), W = llround(w * 100). Numer przedziału to X / W zaokrąglone w dół — z poprawką dla ujemnych reszt, jak w części 4. Wersja floor(x / w) na double potyka się na granicach (np. dla x = 3.3 i w = 1.1 daje 2 zamiast 3). Numery przedziałów mieszczą się między −1000 a 1000, więc wystarczy tablica liczników z przesunięciem o 1000.`,
            tests: (r) => {
                const t = (n, wk, granice) => {
                    const v = Array.from({ length: n }, () => {
                        if (granice && r() < 0.5) { const i = r.int(Math.ceil(-100000 / wk), Math.floor(100000 / wk)); return napis(B(i * wk), 2); }
                        return losowa(r, -100000, 100000, 2).s;
                    });
                    return `${n} ${napis(B(wk), 2)}\n${v.join(' ')}`;
                };
                return ['1 1\n0', '1 1000\n-1000', '2 1\n-1000 1000', '3 1.1\n3.3 -3.3 2.2', '4 1.3\n3.9 -3.9 2.6 1.3', t(20, 250, true), t(500, 110, true), t(10000, 100, false), t(10000, 130, true), t(3000, 100000, false)];
            },
            check: (inp) => { const t = toks(inp), w = jedn(t[1], 2); return w >= 100n && w <= 100000n && t.slice(2).every((s) => zakres(-100000, 100000)(jedn(s, 2))) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp), W = jedn(t[1], 2);
                const idx = t.slice(2, 2 + Number(t[0])).map((s) => Number(fdiv(jedn(s, 2), W)));
                const lo = Math.min(...idx), hi = Math.max(...idx), cnt = new Map();
                idx.forEach((i) => cnt.set(i, (cnt.get(i) || 0) + 1));
                const out = [];
                for (let i = lo; i <= hi; i++) out.push(`${i} ${cnt.get(i) || 0}`);
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    double w;
    cin >> n >> w;
    long long W = llround(w * 100);
    vector<int> licznik(2001, 0);
    int najmn = 1000, najw = -1000;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        long long X = llround(x * 100);
        long long p = X / W;
        if (X % W < 0) p--;
        licznik[p + 1000]++;
        najmn = min(najmn, (int)p);
        najw = max(najw, (int)p);
    }
    for (int p = najmn; p <= najw; p++) cout << p << " " << licznik[p + 1000] << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-srednia-duzych', krok: 9, level: 'trudne',
            title: 'Średnia wielkich liczb',
            short: 'Średnia tysiąca liczb do 10¹⁸ — suma nie mieści się w long long.',
            tags: ['iloraz i reszta', 'zaokrąglanie bez przepełnienia', 'long long'],
            statement: ['Masz n liczb całkowitych nieujemnych, każda do 10¹⁸. W pierwszym wierszu wypisz ich średnią zaokrągloną w dół, a w drugim — zaokrągloną do najbliższej liczby całkowitej (połówki w górę). Uwaga: suma tych liczb może nie mieścić się w long long!'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwa wiersze ze średnią w dół i do najbliższej.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '3\n1000000000000000000 1000000000000000000 1', note: 'Suma to 2 · 10¹⁸ + 1, a średnia 666666666666666667 — tu jeszcze suma mieści się w long long, ale przy tysiącu takich liczb już nie.' }, { input: '4\n1 2 3 4', note: 'Średnia 2.5 — w dół 2, do najbliższej 3.' }],
            hint: R`Rozbij każdą liczbę na iloraz i resztę z dzielenia przez n: a = q · n + r. Wtedy średnia to Σq + (Σr) / n, a obie sumy są już małe (Σq ≤ 10¹⁸, Σr < n²). Średnia w dół: Σq + (Σr) / n. Do najbliższej dodaj jeszcze 1, gdy reszta z (Σr) / n jest co najmniej połową n, czyli gdy 2 · ((Σr) % n) ≥ n.`,
            tests: (r) => {
                const duze = (n) => fmt(Array.from({ length: n }, () => r.big(r() < 0.8 ? '900000000000000000' : 0, '1000000000000000000')));
                return ['1\n0', '1\n1000000000000000000', '2\n0 1', '2\n1 2', '3\n1 1 2', fmt(Array(1000).fill('1000000000000000000')), fmt([...Array(999).fill('1000000000000000000'), '999999999999999999']),
                    fmt(Array.from({ length: 30 }, () => r.int(0, 100))), duze(10), duze(500), duze(1000)];
            },
            check: (inp) => (lista(inp).v.every(zakres(0, '1000000000000000000')) ? null : 'zakres'),
            solve: (inp) => { const { n, v } = lista(inp); const s = v.reduce((a, x) => a + B(x), 0n); return `${s / B(n)}\n${rdivUp(s, B(n))}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long sumaQ = 0, sumaR = 0;
    for (int i = 0; i < n; i++) {
        long long a;
        cin >> a;
        sumaQ += a / n;
        sumaR += a % n;
    }
    long long wDol = sumaQ + sumaR / n;
    long long reszta = sumaR % n;
    long long najblizsza = wDol + (2 * reszta >= n ? 1 : 0);
    cout << wDol << "\n" << najblizsza << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-mandaty', krok: 9, level: 'trudne',
            title: 'Podział mandatów',
            short: 'Metoda największych reszt: najpierw w dół, potem reszta mandatów dla największych ułamków.',
            tags: ['floor ilorazu', 'reszty z dzielenia', 'sortowanie z regułą'],
            statement: ['W wyborach do rady jest S mandatów i n komitetów; komitet numer i dostał vᵢ głosów, a wszystkich głosów oddano V. Mandaty dzielimy metodą największych reszt. Każdy komitet dostaje najpierw S · vᵢ / V mandatów zaokrąglone w dół. Mandaty, które zostały, rozdajemy po jednym komitetom z największą resztą — czyli z największą częścią ułamkową liczby S · vᵢ / V. Przy równych resztach pierwszeństwo ma komitet z mniejszym numerem. Wypisz liczbę mandatów każdego komitetu.'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n liczb vᵢ.'],
            output_format: ['Jeden wiersz: n liczb mandatów, w kolejności komitetów.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ S ≤ 1000', '1 ≤ vᵢ ≤ 10⁹'],
            examples: [{ input: '3 10\n4600 3500 1900', note: 'Wszystkich głosów jest 10 000. Komitety mają 4.6, 3.5 i 1.9 mandatu — w dół 4, 3 i 1. Zostały 2 mandaty: dostają je komitet 3 (reszta 0.9) i komitet 1 (reszta 0.6).' }],
            hint: R`Część ułamkowa liczby S · vᵢ / V to (S · vᵢ % V) / V — wszystkie mają ten sam mianownik V, więc wystarczy porównywać same reszty S · vᵢ % V, liczby całkowite. Zapisz pary (reszta, numer), posortuj je regułą „większa reszta pierwsza, a przy remisie mniejszy numer” i daj po mandacie pierwszym komitetom z listy. S · vᵢ sięga 10¹² — long long.`,
            tests: (r) => {
                const t = (n, S, hi) => `${n} ${S}\n${Array.from({ length: n }, () => r.int(1, hi)).join(' ')}`;
                return ['1 1\n1', '1 1000\n1000000000', '2 1\n1 1', '3 1\n1 1 1', '4 10\n1 1 1 1', '3 5\n1000000000 1000000000 1', t(5, 20, 1000), t(30, 100, 50000), t(1000, 1000, 1000000000), t(1000, 7, 1000000000), t(1000, 999, 10)];
            },
            check: (inp) => { const t = toks(inp).map(Number); return t[1] >= 1 && t[1] <= 1000 && t.slice(2).every((x) => x >= 1 && x <= 1e9) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(B), n = Number(t[0]), S = t[1], v = t.slice(2, 2 + n);
                const V = v.reduce((a, b) => a + b, 0n);
                const m = v.map((x) => (S * x) / V), rest = v.map((x, i) => ({ r: (S * x) % V, i }));
                let zostalo = Number(S - m.reduce((a, b) => a + b, 0n));
                rest.sort((a, b) => (a.r !== b.r ? (a.r > b.r ? -1 : 1) : a.i - b.i));
                for (let j = 0; j < zostalo; j++) m[rest[j].i] += 1n;
                return m.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> v(n);
    long long V = 0;
    for (auto &x : v) {
        cin >> x;
        V += x;
    }
    vector<long long> mandaty(n);
    vector<pair<long long, int>> reszty(n);
    long long rozdane = 0;
    for (int i = 0; i < n; i++) {
        mandaty[i] = S * v[i] / V;
        reszty[i] = {S * v[i] % V, i};
        rozdane += mandaty[i];
    }
    sort(reszty.begin(), reszty.end(), [](pair<long long, int> a, pair<long long, int> b) {
        if (a.first != b.first) return a.first > b.first;
        return a.second < b.second;
    });
    for (int j = 0; j < S - rozdane; j++) mandaty[reszty[j].second]++;
    for (int i = 0; i < n; i++) cout << mandaty[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-kwadraty-szesciany', krok: 9, level: 'trudne',
            title: 'Kwadraty i sześciany',
            short: 'Ile liczb z przedziału to kwadraty albo sześciany? Pierwiastki całkowite z poprawką.',
            tags: ['pierwiastek całkowity', 'cbrt z poprawką', 'włączanie i wyłączanie'],
            statement: ['Dla każdego z t zapytań a, b wypisz, ile liczb z przedziału od a do b (włącznie) jest kwadratem albo sześcianem liczby całkowitej. Liczby, które są jednym i drugim (jak 64 = 8² = 4³), liczymy raz.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite a i b.'],
            output_format: ['t wierszy z odpowiedziami.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ b ≤ 10¹⁸'],
            examples: [{ input: '3\n1 10\n1 100\n64 64', note: 'Od 1 do 10: 1, 4, 8, 9. Od 1 do 100: kwadraty 1, 4, …, 100 (10 liczb) i sześciany 1, 8, 27, 64 (4 liczby), ale 1 i 64 są w obu grupach — razem 12.' }],
            hint: R`Policz osobno dla x: kwadraty od 1 do x (pierwiastek całkowity), sześciany od 1 do x (cbrt z <cmath> z poprawką pętlą, tak jak przy sqrt) i liczby, które są jednym i drugim — to dokładnie szóste potęgi k⁶ ≤ x (k ≤ 1000, wystarczy pętla). Wynik dla x to kwadraty + sześciany − szóste potęgi, a dla przedziału: wynik dla b minus wynik dla a − 1.`,
            tests: (r) => {
                const q = () => { let a = r.big(1, '1000000000000000000'), b = r.big(1, '1000000000000000000'); if (a > b) [a, b] = [b, a]; return `${a} ${b}`; };
                const pot = () => { const e = r.pick([2n, 3n, 6n]), k = r.big(1, e === 2n ? 1000000000 : e === 3n ? 1000000 : 1000), x = k ** e + B(r.int(-1, 1)); const b = x + B(r.int(0, 2)); return x >= 1n && b <= 10n ** 18n ? `${x} ${b}` : '1 1'; };
                const m = () => { const a = r.int(1, 2000), b = r.int(a, 5000); return `${a} ${b}`; };
                return ['1\n1 1', '1\n2 3', '1\n1 1000000000000000000', '1\n999999999999999999 1000000000000000000', '1\n64 64', '2\n728 730\n46655 46657',
                    wiersze(Array.from({ length: 40 }, m)), wiersze(Array.from({ length: 1000 }, () => { const x = r(); return x < 0.35 ? q() : x < 0.75 ? pot() : m(); }))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b] = toks(w).map(B); return a >= 1n && a <= b && b <= 10n ** 18n; }) ? null : 'zakres'),
            solve: (inp) => {
                const szoste = (x) => { let k = 0n; while ((k + 1n) ** 6n <= x) k++; return k; };
                const f = (x) => isqrt(x) + icbrt(x) - szoste(x);
                return linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [a, b] = toks(w).map(B); return String(f(b) - f(a - 1n)); }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b;
        cin >> a >> b;
        long long wynik = 0;
        for (int krok = 0; krok < 2; krok++) {
            long long x = (krok == 0 ? b : a - 1);
            long long k2 = sqrt(x);
            while (k2 * k2 > x) k2--;
            while ((k2 + 1) * (k2 + 1) <= x) k2++;
            long long k3 = cbrt(x);
            while (k3 > 0 && k3 * k3 * k3 > x) k3--;
            while ((k3 + 1) * (k3 + 1) * (k3 + 1) <= x) k3++;
            long long k6 = 0;
            while ((k6 + 1) * (k6 + 1) * (k6 + 1) * (k6 + 1) * (k6 + 1) * (k6 + 1) <= x) k6++;
            long long f = k2 + k3 - k6;
            if (krok == 0) wynik += f;
            else wynik -= f;
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-kredyt', krok: 9, level: 'trudne',
            title: 'Spłata kredytu',
            short: 'Odsetki co miesiąc zaokrąglane do grosza. Ile miesięcy i ile w sumie?',
            tags: ['symulacja w groszach', 'do najbliższej', 'promile'],
            statement: ['Pożyczasz K złotych. Na koniec każdego miesiąca bank dolicza odsetki: p promili (tysięcznych części) bieżącego długu, zaokrąglone do najbliższego grosza (połówki w górę). Zaraz potem wpłacasz ratę r złotych — albo tyle, ile zostało do spłaty, jeśli to mniej niż rata. W pierwszym wierszu wypisz, ile miesięcy potrwa spłata, a w drugim — ile zapłacisz w sumie (w złotych, z dwiema cyframi po kropce). Gwarantujemy, że rata jest większa niż odsetki doliczone w pierwszym miesiącu, a spłata potrwa najwyżej 100 000 miesięcy.'],
            input_format: ['Jeden wiersz: kwota K, liczba całkowita p i rata r (K i r z co najwyżej dwiema cyframi po kropce).'],
            output_format: ['Dwa wiersze: liczba miesięcy i łączna wpłacona kwota.'],
            constraints: ['0.01 ≤ K ≤ 1 000 000', '0 ≤ p ≤ 50', '0.01 ≤ r ≤ 1 000 000'],
            examples: [{ input: '1000 10 300', note: 'Miesiąc 1: 1000 + 10 = 1010, po racie 710. Miesiąc 2: 710 + 7.10 = 717.10, po racie 417.10. Miesiąc 3: 417.10 + 4.17 = 421.27, po racie 121.27. Miesiąc 4: 121.27 + 1.21 = 122.48 — to mniej niż rata, więc spłacasz całość.' }],
            hint: R`Licz wszystko w groszach: d = llround(K * 100), rata = llround(r * 100). Odsetki od długu d to d · p / 1000 zaokrąglone do najbliższego grosza: (d * p * 2 + 1000) / 2000. W pętli while (d > 0): dolicz odsetki, wpłać min(rata, d), dodaj wpłatę do sumy i zwiększ licznik miesięcy.`,
            tests: (r) => {
                const sym = (K, p, rr) => { let d = K, m = 0; while (d > 0n && m <= 100000) { d += rdivUp(d * p, 1000n); d -= rr < d ? rr : d; m++; } return m; };
                const out = ['0.01 0 0.01', '1000000 0 1000000', '1000000 50 1000000', '100 0 1', '1000 10 300', '1 50 0.06'];
                while (out.length < 14) {
                    const K = B(r.int(1, 100000000)), p = B(r.int(0, 50)), ods = rdivUp(K * p, 1000n);
                    const rr = ods + B(r.int(1, Math.max(1, Number(K / B(r.int(2, 600))))));
                    if (rr > 100000000n || sym(K, p, rr) > 100000) continue;
                    out.push(`${napis(K, 2)} ${p} ${napis(rr, 2)}`);
                }
                return out;
            },
            check: (inp) => {
                const [Ks, ps, rs] = toks(inp), K = jedn(Ks, 2), p = B(ps), rr = jedn(rs, 2);
                if (!(K >= 1n && K <= 100000000n && p >= 0n && p <= 50n && rr >= 1n && rr <= 100000000n)) return 'zakres';
                if (rr <= rdivUp(K * p, 1000n)) return 'rata nie pokrywa odsetek';
                let d = K, m = 0;
                while (d > 0n) { d += rdivUp(d * p, 1000n); d -= rr < d ? rr : d; if (++m > 100000) return 'za długo'; }
                return null;
            },
            solve: (inp) => {
                const [Ks, ps, rs] = toks(inp), p = B(ps), rr = jedn(rs, 2);
                let d = jedn(Ks, 2), m = 0, suma = 0n;
                while (d > 0n) { d += rdivUp(d * p, 1000n); const w = rr < d ? rr : d; d -= w; suma += w; m++; }
                return `${m}\n${stale(suma, 2)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double K, r;
    long long p;
    cin >> K >> p >> r;
    long long dlug = llround(K * 100), rata = llround(r * 100);
    long long miesiace = 0, suma = 0;
    while (dlug > 0) {
        dlug += (dlug * p * 2 + 1000) / 2000;
        long long wplata = min(rata, dlug);
        dlug -= wplata;
        suma += wplata;
        miesiace++;
    }
    cout << miesiace << "\n";
    cout << suma / 100 << "." << setw(2) << setfill('0') << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-odcinki', krok: 9, level: 'trudne',
            title: 'Odcinki na osi',
            short: 'Ile liczb całkowitych przykrywa co najmniej jeden odcinek?',
            tags: ['ceil i floor końców', 'sortowanie przedziałów', 'scalanie'],
            statement: ['Na osi liczbowej narysowano n odcinków [aᵢ, bᵢ] (aᵢ ≤ bᵢ, końce mogą być ujemne i mieć cyfry po kropce). Ile liczb całkowitych należy do co najmniej jednego odcinka?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy końce odcinka aᵢ i bᵢ (z co najwyżej dwiema cyframi po kropce).'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 3000', '−10⁹ ≤ aᵢ ≤ bᵢ ≤ 10⁹'],
            examples: [{ input: '4\n-1.5 2.3\n2 4.9\n0.2 0.8\n10 10', note: 'Liczby całkowite w odcinkach: od −1 do 2, od 2 do 4, żadna i 10. Razem −1, 0, 1, 2, 3, 4 i 10 — siedem liczb.' }],
            hint: R`Każdy odcinek zamień na przedział liczb całkowitych od ceil(a) do floor(b); jeśli wyszło ceil(a) > floor(b), odcinek nie zawiera żadnej liczby całkowitej i można go pominąć. Posortuj przedziały (vector par) i przejdź po nich, scalając te, które na siebie nachodzą, jak w lekcji o parach. Na koniec zsumuj długości: koniec − początek + 1. Liczb może być bardzo dużo — long long.`,
            tests: (r) => {
                const odc = (lo, hi) => { const a = losowa(r, lo, hi, 2), b = losowa(r, lo, hi, 2); return a.k <= b.k ? `${a.s} ${b.s}` : `${b.s} ${a.s}`; };
                const krotki = () => { const a = r.int(-1000000, 1000000); const b = a + r.int(0, 300); return `${napis(B(a), 2)} ${napis(B(b), 2)}`; };
                return ['1\n0 0', '1\n0.1 0.9', '1\n-1000000000 1000000000', '2\n1 3\n4 6', '2\n1.5 3.5\n3.5 5.5', '3\n0.5 0.6\n-0.4 -0.3\n7 7',
                    wiersze(Array.from({ length: 30 }, () => odc(-2000, 2000))), wiersze(Array.from({ length: 2000 }, krotki)), wiersze(Array.from({ length: 3000 }, () => (r() < 0.5 ? odc('-100000000000', '100000000000') : krotki())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b] = toks(w).map((s) => jedn(s, 2)); return a <= b && a >= -100000000000n && b <= 100000000000n; }) ? null : 'zakres'),
            solve: (inp) => {
                const p = linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [a, b] = toks(w).map((s) => jedn(s, 2)); return [cdiv(a, 100n), fdiv(b, 100n)]; }).filter(([a, b]) => a <= b);
                p.sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0));
                let suma = 0n, cur = null;
                for (const [a, b] of p) {
                    if (cur && a <= cur[1]) { if (b > cur[1]) cur[1] = b; }
                    else { if (cur) suma += cur[1] - cur[0] + 1n; cur = [a, b]; }
                }
                if (cur) suma += cur[1] - cur[0] + 1n;
                return String(suma);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> p;
    for (int i = 0; i < n; i++) {
        double a, b;
        cin >> a >> b;
        long long od = (long long)ceil(a), doo = (long long)floor(b);
        if (od <= doo) p.push_back({od, doo});
    }
    sort(p.begin(), p.end());
    long long suma = 0;
    int i = 0;
    while (i < (int)p.size()) {
        long long od = p[i].first, doo = p[i].second;
        int j = i + 1;
        while (j < (int)p.size() && p[j].first <= doo) {
            doo = max(doo, p[j].second);
            j++;
        }
        suma += doo - od + 1;
        i = j;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-b-maraton', krok: 9, level: 'trudne',
            title: 'Tempo biegu',
            short: 'Średnie tempo na kilometr i przewidywany czas maratonu — co do sekundy.',
            tags: ['metry i sekundy', 'do najbliższej', 'h:mm:ss'],
            statement: ['Biegacz przebiegł D km w czasie hh:mm:ss. Dla każdego z t biegów wypisz w jednym wierszu dwie wartości: średnie tempo biegacza — ile minut i sekund zajmuje mu jeden kilometr — w formacie m:ss, zaokrąglone do najbliższej sekundy, oraz przewidywany czas maratonu (42.195 km) przy tej samej średniej prędkości, zaokrąglony do najbliższej sekundy, w formacie h:mm:ss. W obu przypadkach połówki sekundy zaokrąglamy w górę. Liczba minut tempa i liczba godzin maratonu mogą mieć więcej niż jedną cyfrę.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy dystans D w km (z co najwyżej trzema cyframi po kropce) i czas w formacie hh:mm:ss.'],
            output_format: ['t wierszy: tempo i czas maratonu.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ D ≤ 100', '00:00:01 ≤ czas ≤ 23:59:59'],
            examples: [{ input: '2\n10 00:50:00\n5.5 00:30:15', note: 'W pierwszym biegu kilometr zajmuje równo 300 s, czyli 5:00, a maraton: 3000 · 42195 / 10000 = 12658.5 s — połówka, więc 12659 s, czyli 3:30:59.' }],
            hint: R`Licz w metrach i sekundach: M = llround(D * 1000), T = 3600 * hh + 60 * mm + ss. Tempo w sekundach na kilometr to T · 1000 / M zaokrąglone do najbliższej: (2 * T * 1000 + M) / (2 * M). Maraton: (2 * T * 42195 + M) / (2 * M). Potem zamień sekundy na minuty i sekundy (albo godziny, minuty i sekundy) — sekundy i minuty wypisuj z setw(2) i setfill('0').`,
            tests: (r) => {
                const czas = (s) => `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`;
                const bieg = () => { const M = r.int(1000, 100000); const T = Math.min(86399, Math.max(1, Math.round(M * r.int(150, 600) / 1000) + r.int(-30, 30))); return `${napis(B(M), 3)} ${czas(T)}`; };
                return ['1\n1 00:00:01', '1\n100 23:59:59', '1\n42.195 03:00:00', '2\n10 00:50:00\n1 00:05:00', wiersze(Array.from({ length: 30 }, bieg)), wiersze(Array.from({ length: 1000 }, bieg))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [d, c] = toks(w); const M = jedn(d, 3); const m = c.match(/^(\d\d):([0-5]\d):([0-5]\d)$/); return M >= 1000n && M <= 100000n && m && +m[1] <= 23 && (+m[1] * 3600 + +m[2] * 60 + +m[3]) >= 1; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [d, c] = toks(w); const M = jedn(d, 3); const [hh, mm, ss] = c.split(':').map(Number); const T = B(3600 * hh + 60 * mm + ss);
                const tempo = rdivUp(T * 1000n, M), mar = rdivUp(T * 42195n, M);
                return `${tempo / 60n}:${pad2(tempo % 60n)} ${mar / 3600n}:${pad2((mar / 60n) % 60n)}:${pad2(mar % 60n)}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        double D;
        int hh, mm, ss;
        char c;
        cin >> D >> hh >> c >> mm >> c >> ss;
        long long M = llround(D * 1000);
        long long T = 3600 * hh + 60 * mm + ss;
        long long tempo = (2 * T * 1000 + M) / (2 * M);
        long long maraton = (2 * T * 42195 + M) / (2 * M);
        cout << tempo / 60 << ":" << setw(2) << setfill('0') << tempo % 60 << " ";
        cout << maraton / 3600 << ":" << setw(2) << setfill('0') << maraton / 60 % 60 << ":" << setw(2) << setfill('0') << maraton % 60 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-b-final', krok: 9, level: 'trudne',
            title: 'Wielki finał: wycieczka klasowa',
            short: 'Autobusy, rozpoczęte godziny, darmowe bilety, składka w górę do 10 groszy — wszystko naraz.',
            tags: ['dzielenie w górę', 'grosze', 'do wielokrotności', 'formatowanie kwot'],
            statement: [
                'Klasa jedzie na wycieczkę: u uczniów i o opiekunów. Odpowiedz na cztery pytania, każde w osobnym wierszu:',
                '1) Autobusy mają po k miejsc. Ile autobusów trzeba wynająć, żeby pojechali wszyscy (uczniowie i opiekunowie)?',
                '2) Wynajęcie jednego autobusu kosztuje A zł za każdą rozpoczętą godzinę, a wycieczka trwa m minut. Bilety do muzeum kupują tylko uczniowie, po B zł, ale na każdych pełnych 10 uczniów jeden bilet jest gratis. Ile kosztuje cała wycieczka? (w złotych, z dwiema cyframi po kropce)',
                '3) Koszt dzielimy po równo między uczniów, a składkę zaokrąglamy w górę do pełnych 10 groszy, żeby na pewno wystarczyło. Ile wynosi składka jednego ucznia? (w złotych, z dwiema cyframi po kropce)',
                '4) Ile groszy zostanie w kasie klasowej po opłaceniu wycieczki?',
            ],
            input_format: ['W pierwszym wierszu liczby całkowite u, o i k.', 'W drugim wierszu ceny A i B (z co najwyżej dwiema cyframi po kropce) i liczba całkowita m.'],
            output_format: ['Cztery wiersze z odpowiedziami na pytania 1–4.'],
            constraints: ['1 ≤ u ≤ 1000', '0 ≤ o ≤ 100', '1 ≤ k ≤ 100', '0.01 ≤ A, B ≤ 10 000', '1 ≤ m ≤ 10 000'],
            examples: [{ input: '27 3 50\n450 18.50 600', note: 'Jeden autobus na 10 godzin to 4500 zł. Biletów płatnych jest 27 − 2 = 25, czyli 462.50 zł. Razem 4962.50 zł. 496 250 gr / 27 = 18 379.6… gr, w górę do 10 groszy — 18 380 gr, czyli 183.80 zł. Zebrane 496 260 gr, więc zostaje 10 groszy.' }],
            hint: R`Wszystko licz w groszach (llround(A * 100), llround(B * 100)) i na liczbach całkowitych. Autobusy: (u + o + k − 1) / k. Rozpoczęte godziny: (m + 59) / 60. Darmowe bilety: u / 10. Składka w górę do pełnych 10 groszy to dzielenie w górę przez 10 · u, a potem razy 10: (koszt + 10 * u - 1) / (10 * u) * 10. Kwoty wypisuj jako złote: / 100, kropka i % 100 z setw(2) i setfill('0').`,
            tests: (r) => {
                const q = () => `${r.int(1, 1000)} ${r.int(0, 100)} ${r.int(1, 100)}\n${losowa(r, 1, 1000000, 2).s} ${losowa(r, 1, 1000000, 2).s} ${r.int(1, 10000)}`;
                const m2 = () => `${r.int(10, 40)} ${r.int(1, 4)} ${r.pick([20, 30, 45, 50, 60])}\n${losowa(r, 30000, 150000, 2).s} ${losowa(r, 500, 6000, 2).s} ${r.int(120, 900)}`;
                return ['1 0 1\n0.01 0.01 1', '1000 100 1\n10000 10000 10000', '10 0 10\n100 10 60', '9 1 10\n100 10 61', '20 2 22\n1000.50 15.99 480', m2(), m2(), m2(), q(), q(), q(), q()];
            },
            check: (inp) => {
                const [u, o, k, A, Bc, m] = toks(inp);
                const ok = +u >= 1 && +u <= 1000 && +o >= 0 && +o <= 100 && +k >= 1 && +k <= 100 && +m >= 1 && +m <= 10000;
                return ok && zakres(1, 1000000)(jedn(A, 2)) && zakres(1, 1000000)(jedn(Bc, 2)) ? null : 'zakres';
            },
            solve: (inp) => {
                const [us, os, ks, As, Bs, ms] = toks(inp), u = B(us), o = B(os), k = B(ks), m = B(ms);
                const autobusy = cdiv(u + o, k), koszt = autobusy * cdiv(m, 60n) * jedn(As, 2) + (u - u / 10n) * jedn(Bs, 2);
                const skladka = cdiv(koszt, 10n * u) * 10n;
                return [autobusy, stale(koszt, 2), stale(skladka, 2), skladka * u - koszt].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long u, o, k, m;
    double A, B;
    cin >> u >> o >> k >> A >> B >> m;
    long long autobusAgr = llround(A * 100), biletGr = llround(B * 100);
    long long autobusy = (u + o + k - 1) / k;                     // 1)
    long long godziny = (m + 59) / 60;
    long long platne = u - u / 10;
    long long koszt = autobusy * godziny * autobusAgr + platne * biletGr;   // 2)
    long long skladka = (koszt + 10 * u - 1) / (10 * u) * 10;    // 3)
    long long zostaje = skladka * u - koszt;                      // 4)
    cout << autobusy << "\n";
    cout << koszt / 100 << "." << setw(2) << setfill('0') << koszt % 100 << "\n";
    cout << skladka / 100 << "." << setw(2) << setfill('0') << skladka % 100 << "\n";
    cout << zostaje << "\n";
    return 0;
}`,
        },
    ];
};
