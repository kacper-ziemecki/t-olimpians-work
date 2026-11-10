// Max / Min — baza zadań na koniec lekcji: od rozgrzewki z jednym pomysłem (pogoda, najszybszy biegacz, promocja 3 za 2,
// strata do lidera, fotoradar, najlepszy skok, dobowe wahania, ramka wokół punktów, bankomat, przerwa między autobusami)
// przez zadania średnie (najdziwniejszy wynik, dwie kasy, najcieplejszy dzień tygodnia, moment transakcji, iloczyn trzech,
// puchar, wspólne pole, spotkanie, wycieczka, najlepszy wiersz i kolumna) po trudne (deszczówka, dwie transakcje,
// naszyjnik, górka, iloczyn fragmentu, ścieżka po planszy, ławka) i wielki finał: wyprawa w góry.
// Zadania idą od łatwych przez średnie do trudnych.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]) }; };
    const wiersze = (a) => `${a.length}\n${a.map((p) => p.join(' ')).join('\n')}`;
    const bmax = (a, b) => (a > b ? a : b);
    const bmin = (a, b) => (a < b ? a : b);
    const big = (a) => a.map(BigInt);
    const cmpB = (x, y) => (x < y ? -1 : x > y ? 1 : 0);

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'mm-b-pogoda', krok: 10, level: 'latwe',
            title: 'Pogoda w maju',
            short: 'Najwyższa i najniższa temperatura miesiąca — i ile było najcieplejszych dni.',
            tags: ['max i min', 'licznik wystąpień rekordu'],
            statement: ['Masz temperatury z n dni maja. Wypisz w jednym wierszu: najwyższą temperaturę, najniższą temperaturę oraz liczbę dni, w których było najcieplej (temperatura równa najwyższej).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Jeden wiersz: trzy liczby.'],
            constraints: ['1 ≤ n ≤ 31', '−10 ≤ każda temperatura ≤ 35'],
            examples: [{ input: '7\n12 18 21 15 21 9 20' }],
            hint: R`Dwa rekordy (maks i mini) oraz licznik: przy nowym maksimum ile = 1, przy wyrównaniu maksimum ile++.`,
            tests: (r) => ['1\n-10', '3\n35 35 35', '4\n-1 -5 -1 -9', fmt(arr(r, 10, 5, 15)), fmt(arr(r, 31, -10, 35)), fmt(arr(r, 31, 18, 20))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.max(...v); return `${m} ${Math.min(...v)} ${v.filter((x) => x === m).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks = INT_MIN, mini = INT_MAX, ile = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        if (t > maks) {
            maks = t;
            ile = 1;
        } else if (t == maks) {
            ile++;
        }
        mini = min(mini, t);
    }
    cout << maks << " " << mini << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-najszybszy', krok: 10, level: 'latwe',
            title: 'Najszybszy biegacz',
            short: 'Imiona i czasy biegu — kto wygrał? Najlepszy czas to najkrótszy!',
            tags: ['najlepszy czas = min', 'rekord z imieniem'],
            statement: ['Na zawodach biegowych zapisano imię każdego z n zawodników i jego czas w sekundach. Wypisz imię i czas zwycięzcy, czyli zawodnika z najkrótszym czasem. Jeśli kilku zawodników ma ten sam najlepszy czas, wygrywa ten, który jest wcześniej na liście.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię i czas.'],
            output_format: ['Jeden wiersz: imię i czas zwycięzcy.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ czas ≤ 100 000', 'Imię ma od 2 do 12 liter: wielka, a potem małe.'],
            examples: [{ input: '4\nOla 653\nKuba 598\nEwa 598\nJan 701' }],
            hint: R`„Najlepszy czas” to najkrótszy, czyli minimum. Obok rekordu trzymaj imię i zmieniaj oba przy if (czas < najlepszy) — ostry znak zostawi wcześniejszego zawodnika przy remisie.`,
            tests: (r) => {
                const t = (n, lo, hi) => wiersze(Array.from({ length: n }, () => [r.pick(IMIONA), r.int(lo, hi)]));
                return ['1\nAla 1', '3\nOla 9\nJan 9\nEwa 9', t(10, 50, 60), t(1000, 1, 100000), t(1000, 600, 605)];
            },
            solve: (inp) => { const t = toks(inp); let kto = t[1], c = Number(t[2]); for (let i = 1; i < Number(t[0]); i++) { const x = Number(t[2 + 2 * i]); if (x < c) { c = x; kto = t[1 + 2 * i]; } } return `${kto} ${c}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string kto;
    int najlepszy;
    cin >> kto >> najlepszy;
    for (int i = 1; i < n; i++) {
        string imie;
        int czas;
        cin >> imie >> czas;
        if (czas < najlepszy) {
            najlepszy = czas;
            kto = imie;
        }
    }
    cout << kto << " " << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-promocja', krok: 10, level: 'latwe',
            title: 'Promocja 3 za 2',
            short: 'Każdy klient kupuje trzy produkty i nie płaci za najtańszy. Ile zapłacili wszyscy?',
            tags: ['suma − min({…})', 'long long'],
            statement: ['W sklepie trwa promocja: kto kupuje trzy produkty, nie płaci za najtańszy z nich. Do kasy podeszło n klientów, każdy z dokładnie trzema produktami. Ile łącznie zapłacili wszyscy klienci?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy trzy liczby całkowite — ceny produktów jednego klienta.'],
            output_format: ['Jedna liczba — łączna kwota.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda cena ≤ 10⁶'],
            examples: [{ input: '2\n10 25 7\n30 30 30', note: 'Pierwszy klient płaci 35, drugi 60.' }],
            hint: R`Każdy klient płaci a + b + c - min({a, b, c}). Sumę wszystkich klientów trzymaj w long long — może przekroczyć 2 miliardy.`,
            tests: (r) => {
                const t = (n, lo, hi) => wiersze(Array.from({ length: n }, () => arr(r, 3, lo, hi)));
                return ['1\n1 1 1', '1\n1000000 1000000 1', t(10, 1, 100), t(1000, 1, 1e6), t(1000, 999000, 1e6)];
            },
            solve: (inp) => { const a = nums(inp); let s = 0; for (let i = 0; i < a[0]; i++) { const p = a.slice(1 + 3 * i, 4 + 3 * i); s += p[0] + p[1] + p[2] - Math.min(...p); } return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        long long a, b, c;
        cin >> a >> b >> c;
        razem += a + b + c - min({a, b, c});
    }
    cout << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-strata-do-lidera', krok: 10, level: 'latwe',
            title: 'Strata do lidera',
            short: 'Ile punktów brakuje każdemu zawodnikowi do lidera?',
            tags: ['dwa przejścia', 'maks − x', 'vector'],
            statement: ['Po pierwszym dniu zawodów każdy z n zawodników ma pewną liczbę punktów. Dla każdego zawodnika wypisz, ile punktów brakuje mu do lidera, czyli zawodnika z największą liczbą punktów (lider ma stratę 0). Wyniki wypisz w jednym wierszu, w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — punkty zawodników.'],
            output_format: ['Jeden wiersz: n liczb.'],
            constraints: ['1 ≤ n ≤ 2500', '0 ≤ każda liczba punktów ≤ 10⁶'],
            examples: [{ input: '5\n17 23 9 23 20' }],
            hint: R`Najpierw znajdź lidera (*max_element albo pętla z rekordem), a potem przejdź drugi raz po vectorze i wypisz maks - v[i].`,
            tests: (r) => ['1\n0', '3\n5 5 5', fmt(arr(r, 20, 0, 30)), fmt(arr(r, 2500, 0, 1e6)), fmt(arr(r, 2500, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.max(...v); return v.map((x) => m - x).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int lider = *max_element(v.begin(), v.end());
    for (auto x : v) cout << lider - x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-fotoradar', krok: 10, level: 'latwe',
            title: 'Fotoradar',
            short: 'Najszybszy samochód, o ile przekroczył limit i ilu kierowców jechało za szybko.',
            tags: ['rekord', 'max(0, vmax − L)', 'licznik'],
            statement: ['Fotoradar zmierzył prędkość n samochodów. Dozwolona prędkość to L km/h. Wypisz w jednym wierszu: największą zmierzoną prędkość, o ile najszybszy samochód przekroczył limit (0, jeśli nie przekroczył) oraz liczbę samochodów, które jechały szybciej niż L.'],
            input_format: ['W pierwszym wierszu liczby n i L.', 'W drugim wierszu n liczb całkowitych — prędkości.'],
            output_format: ['Jeden wiersz: trzy liczby.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ L ≤ 200', '1 ≤ każda prędkość ≤ 300'],
            examples: [{ input: '5 50\n48 63 50 71 39', note: 'Najszybszy jechał 71 km/h, czyli 21 ponad limit. Za szybko jechały dwa samochody (63 i 71); 50 to jeszcze nie przekroczenie.' }],
            hint: R`Rekord prędkości i licznik samochodów z v > L. Przekroczenie to max(0, vmax - L) — podłoga z części 6.`,
            tests: (r) => {
                const t = (n, L, lo, hi) => `${n} ${L}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 200\n300', '1 50\n50', '3 100\n20 30 40', t(20, 50, 30, 70), t(5000, 90, 1, 300), t(5000, 140, 60, 139)];
            },
            solve: (inp) => { const a = nums(inp); const [n, L] = a; const v = a.slice(2, 2 + n); const m = Math.max(...v); return `${m} ${Math.max(0, m - L)} ${v.filter((x) => x > L).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, L;
    cin >> n >> L;
    int vmax = 0, ile = 0;
    for (int i = 0; i < n; i++) {
        int v;
        cin >> v;
        vmax = max(vmax, v);
        if (v > L) ile++;
    }
    cout << vmax << " " << max(0, vmax - L) << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-najlepszy-skok', krok: 10, level: 'latwe',
            title: 'Najlepszy skok konkursu',
            short: 'Każdy oddał trzy skoki. Jaki był najlepszy wynik konkursu i kto go uzyskał?',
            tags: ['max({a, b, c})', 'rekord z numerem'],
            statement: ['W konkursie skoku w dal każdy z n zawodników oddał trzy skoki (w centymetrach; 0 oznacza skok spalony). Wynik zawodnika to jego najlepszy skok. Wypisz najlepszy wynik konkursu i numer zawodnika, który go uzyskał (zawodników numerujemy od 1). Jeśli kilku zawodników ma ten sam najlepszy wynik, podaj najmniejszy numer.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy trzy liczby całkowite — skoki zawodnika.'],
            output_format: ['Jeden wiersz: najlepszy wynik i numer zawodnika.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każdy skok ≤ 900'],
            examples: [{ input: '3\n512 548 0\n601 0 590\n0 601 455', note: 'Zawodnicy 2 i 3 skoczyli po 601 — wygrywa numer 2.' }],
            hint: R`Dla każdego zawodnika policz max({a, b, c}), a potem zrób z tego rekord razem z numerem zawodnika. Ostry znak > zostawi najmniejszy numer przy remisie.`,
            tests: (r) => {
                const t = (n, lo, hi) => wiersze(Array.from({ length: n }, () => arr(r, 3, lo, hi).map((x) => (r() < 0.1 ? 0 : x))));
                return ['1\n0 0 0', '2\n500 0 0\n0 0 500', t(10, 400, 600), t(1000, 300, 900), t(1000, 880, 900)];
            },
            solve: (inp) => { const a = nums(inp); let b = -1, nr = 0; for (let i = 0; i < a[0]; i++) { const m = Math.max(...a.slice(1 + 3 * i, 4 + 3 * i)); if (m > b) { b = m; nr = i + 1; } } return `${b} ${nr}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najl = -1, numer = 0;
    for (int i = 1; i <= n; i++) {
        int a, b, c;
        cin >> a >> b >> c;
        int wynik = max({a, b, c});
        if (wynik > najl) {
            najl = wynik;
            numer = i;
        }
    }
    cout << najl << " " << numer << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-dobowe-wahania', krok: 10, level: 'latwe',
            title: 'Dobowe wahania',
            short: 'Którego dnia różnica między najzimniejszą a najcieplejszą porą była największa?',
            tags: ['rekord różnicy', 'numer dnia', 'remis'],
            statement: ['Przez n dni notowano najniższą i najwyższą temperaturę dnia. Wahanie dobowe to różnica między nimi. Wypisz numer dnia (dni numerujemy od 1) o największym wahaniu dobowym oraz to wahanie. Przy remisie podaj najwcześniejszy dzień.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby całkowite: najniższa i najwyższa temperatura dnia.'],
            output_format: ['Jeden wiersz: numer dnia i wahanie.'],
            constraints: ['1 ≤ n ≤ 3000', '−50 ≤ najniższa ≤ najwyższa ≤ 50'],
            examples: [{ input: '4\n2 9\n-3 5\n4 6\n0 8', note: 'Wahania: 7, 8, 2, 8. Największe ma dzień 2 (dzień 4 tylko je wyrównuje).' }],
            hint: R`Dla każdego dnia policz najwyższa − najniższa i zrób z tego rekord z numerem dnia. Ostry znak > zostawi najwcześniejszy dzień.`,
            check: (inp) => { const a = nums(inp); for (let i = 0; i < a[0]; i++) if (a[1 + 2 * i] > a[2 + 2 * i]) return 'min > max'; return null; },
            tests: (r) => {
                const t = (n, lo, hi) => wiersze(Array.from({ length: n }, () => { const x = r.int(lo, hi), y = r.int(lo, hi); return [Math.min(x, y), Math.max(x, y)]; }));
                return ['1\n5 5', '2\n-50 50\n-50 50', t(10, -10, 10), t(3000, -50, 50), t(3000, 0, 3)];
            },
            solve: (inp) => { const a = nums(inp); let b = -1, nr = 0; for (let i = 0; i < a[0]; i++) { const d = a[2 + 2 * i] - a[1 + 2 * i]; if (d > b) { b = d; nr = i + 1; } } return `${nr} ${b}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najw = -1, dzien = 0;
    for (int i = 1; i <= n; i++) {
        int mn, mx;
        cin >> mn >> mx;
        if (mx - mn > najw) {
            najw = mx - mn;
            dzien = i;
        }
    }
    cout << dzien << " " << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-ramka', krok: 10, level: 'latwe',
            title: 'Ramka wokół punktów',
            short: 'Najmniejszy prostokąt, w którym mieszczą się wszystkie punkty. Jakie ma pole?',
            tags: ['cztery rekordy', 'min i max x oraz y', 'long long'],
            statement: ['Na planszy narysowano n punktów o współrzędnych całkowitych. Wypisz pole najmniejszego prostokąta o bokach równoległych do osi, który zawiera wszystkie punkty (punkty mogą leżeć na jego brzegu). Jeśli wszystkie punkty leżą na jednej prostej poziomej albo pionowej, pole wynosi 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby całkowite x i y.'],
            output_format: ['Jedna liczba — pole prostokąta.'],
            constraints: ['1 ≤ n ≤ 3000', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '4\n1 2\n-3 5\n4 -1\n0 0', note: 'x od −3 do 4 (szerokość 7), y od −1 do 5 (wysokość 6).' }],
            hint: R`Cztery rekordy naraz: najmniejsze i największe x oraz najmniejsze i największe y. Pole = (maxX − minX) · (maxY − minY) może sięgać 4·10¹⁸ — licz w long long.`,
            tests: (r) => {
                const t = (n, lo, hi) => wiersze(Array.from({ length: n }, () => arr(r, 2, lo, hi)));
                return ['1\n5 5', '2\n-1000000000 -1000000000\n1000000000 1000000000', '3\n1 1\n1 5\n1 9', t(10, -10, 10), t(3000, -1e9, 1e9), t(3000, 0, 100)];
            },
            solve: (inp) => {
                const a = big(toks(inp)); const n = Number(a[0]); let x1 = a[1], x2 = a[1], y1 = a[2], y2 = a[2];
                for (let i = 0; i < n; i++) { const x = a[1 + 2 * i], y = a[2 + 2 * i]; x1 = bmin(x1, x); x2 = bmax(x2, x); y1 = bmin(y1, y); y2 = bmax(y2, y); }
                return String((x2 - x1) * (y2 - y1));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long minX = LLONG_MAX, maxX = LLONG_MIN, minY = LLONG_MAX, maxY = LLONG_MIN;
    for (int i = 0; i < n; i++) {
        long long x, y;
        cin >> x >> y;
        minX = min(minX, x);
        maxX = max(maxX, x);
        minY = min(minY, y);
        maxY = max(maxY, y);
    }
    cout << (maxX - minX) * (maxY - minY) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-bankomat', krok: 10, level: 'latwe',
            title: 'Bankomat',
            short: 'Wypłata to najmniejsze z trzech: prośba, limit bankomatu i stan konta.',
            tags: ['min({…}) z trzech ograniczeń', 'symulacja'],
            statement: ['Na koncie jest S złotych, a bankomat wypłaca jednorazowo najwyżej L złotych. Klient po kolei prosi n razy o wypłatę podanych kwot. Bankomat wypłaca tyle, o ile klient prosi — ale nie więcej niż L i nie więcej, niż zostało na koncie. W pierwszym wierszu wypisz kwoty faktycznie wypłacone przy kolejnych prośbach, a w drugim — ile zostało na koncie.'],
            input_format: ['W pierwszym wierszu liczby S, L i n.', 'W drugim wierszu n liczb całkowitych — kwoty, o które prosi klient.'],
            output_format: ['Dwa wiersze: n wypłaconych kwot i stan konta na końcu.'],
            constraints: ['0 ≤ S ≤ 10⁹', '1 ≤ L ≤ 100 000', '1 ≤ n ≤ 2000', '1 ≤ każda kwota ≤ 10⁶'],
            examples: [{ input: '1000 300 5\n200 500 400 250 100', note: 'Wypłaty: 200, 300 (limit), 300 (limit), 200 (tyle zostało na koncie), 0.' }],
            hint: R`Wypłata to min({prosba, L, konto}) — najmniejsze z trzech ograniczeń. Po każdej wypłacie zmniejsz konto.`,
            tests: (r) => {
                const t = (S, L, n, lo, hi) => `${S} ${L} ${n}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['0 100 2\n5 5', '7 100000 1\n1000000', t(5000, 300, 20, 1, 1000), t(1e9, 100000, 2000, 1, 1e6), t(123456789, 5000, 2000, 1000, 200000)];
            },
            solve: (inp) => { const a = nums(inp); let [S, L, n] = a; const out = []; for (let i = 0; i < n; i++) { const w = Math.min(a[3 + i], L, S); S -= w; out.push(w); } return `${out.join(' ')}\n${S}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int S, L, n;
    cin >> S >> L >> n;
    for (int i = 0; i < n; i++) {
        int prosba;
        cin >> prosba;
        int wyplata = min({prosba, L, S});
        S -= wyplata;
        cout << wyplata << " ";
    }
    cout << "\n" << S << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-przerwa', krok: 10, level: 'latwe',
            title: 'Najdłuższa przerwa między autobusami',
            short: 'Godziny przyjazdów autobusów — jak długo najdłużej trzeba czekać i od kiedy?',
            tags: ['rekord różnic sąsiadów', 'pozycja rekordu'],
            statement: ['Na przystanek przyjeżdża n autobusów. Znasz godziny ich przyjazdów w minutach od północy, w kolejności rosnącej. Wypisz, ile minut trwa najdłuższa przerwa między dwoma kolejnymi autobusami i o której minucie ta przerwa się zaczyna. Jeśli najdłuższych przerw jest kilka, podaj najwcześniejszą.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n rosnących liczb całkowitych — minuty przyjazdów.'],
            output_format: ['Jeden wiersz: długość przerwy i minuta jej początku.'],
            constraints: ['2 ≤ n ≤ 1440', '0 ≤ każda minuta ≤ 1439', 'Minuty są ściśle rosnące.'],
            examples: [{ input: '5\n300 330 420 450 540', note: 'Przerwy: 30, 90, 30, 90. Pierwsza 90-minutowa zaczyna się w minucie 330.' }],
            hint: R`Przerwa między autobusami i − 1 oraz i to t[i] - t[i - 1]. Zrób z tego rekord i zapamiętaj t[i - 1], czyli minutę, w której przerwa się zaczyna.`,
            check: (inp) => { const v = czytaj(inp).v; for (let i = 1; i < v.length; i++) if (v[i] <= v[i - 1]) return 'nie rosnie'; return v[0] >= 0 && v[v.length - 1] <= 1439 ? null : 'zakres'; },
            tests: (r) => {
                const t = (n) => fmt(r.shuffle(Array.from({ length: 1440 }, (_, i) => i)).slice(0, n).sort((x, y) => x - y));
                return ['2\n0 1439', '3\n0 1 2', '4\n10 20 30 40', t(10), t(100), t(1440), t(700)];
            },
            solve: (inp) => { const v = czytaj(inp).v; let b = -1, s = 0; for (let i = 1; i < v.length; i++) if (v[i] - v[i - 1] > b) { b = v[i] - v[i - 1]; s = v[i - 1]; } return `${b} ${s}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int poprz;
    cin >> poprz;
    int najdl = -1, start = 0;
    for (int i = 1; i < n; i++) {
        int t;
        cin >> t;
        if (t - poprz > najdl) {
            najdl = t - poprz;
            start = poprz;
        }
        poprz = t;
    }
    cout << najdl << " " << start << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'mm-b-najdziwniejszy', krok: 10, level: 'srednie',
            title: 'Najdziwniejszy wynik',
            short: 'Wynik najdalej od średniej — policzony bez ani jednego ułamka.',
            tags: ['abs(n · x − S)', 'dwa przejścia', 'long long', 'remis'],
            statement: ['W klasie jest n wyników sprawdzianu. Najdziwniejszy wynik to ten, który leży najdalej od średniej wszystkich wyników. Wypisz go. Jeśli kilka wyników jest tak samo daleko od średniej, wypisz najmniejszy z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wyniki.'],
            output_format: ['Jedna liczba — najdziwniejszy wynik.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ każdy wynik ≤ 10⁶'],
            examples: [{ input: '5\n70 72 75 90 68', note: 'Średnia to 75. Najdalej od niej jest 90 (o 15).' }, { input: '2\n10 20', note: 'Średnia 15 — oba wyniki są tak samo daleko, wypisujemy mniejszy.' }],
            hint: R`Zamiast liczyć średnią S / n (ułamek!), porównuj odległości pomnożone przez n: abs(n·x − S). Kolejność odległości się nie zmienia, a wszystko zostaje w liczbach całkowitych — tylko w long long. Najpierw jedna pętla na sumę, potem druga na rekord.`,
            tests: (r) => ['1\n7', '3\n5 5 5', '3\n0 5 10', '4\n0 0 1000000 1000000', fmt(arr(r, 30, 0, 100)), fmt(arr(r, 5000, 0, 1e6)), fmt(arr(r, 5000, 500, 520))],
            solve: (inp) => { const v = czytaj(inp).v; const n = v.length; const S = v.reduce((a, b) => a + b, 0); let b = v[0]; for (const x of v) { const d = Math.abs(n * x - S), db = Math.abs(n * b - S); if (d > db || (d === db && x < b)) b = x; } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    long long S = 0;
    for (auto &x : v) {
        cin >> x;
        S += x;
    }
    long long naj = v[0];
    for (auto x : v) {
        long long d = llabs(n * x - S), dn = llabs(n * naj - S);
        if (d > dn || (d == dn && x < naj)) naj = x;
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-dwie-kasy', krok: 10, level: 'srednie',
            title: 'Dwie kasy',
            short: 'Każdy klient idzie do kasy, która zwolni się pierwsza. Kiedy skończy się obsługa?',
            tags: ['min — która kasa wolna', 'max — koniec pracy', 'long long'],
            statement: ['W sklepie są dwie kasy, na początku obie wolne. Wszyscy klienci stoją w kolejce od początku i podchodzą po kolei: każdy idzie do kasy, która zwolni się najwcześniej (przy remisie — do kasy 1), i jest obsługiwany przez podaną liczbę minut. Kasa zaczyna obsługiwać następnego klienta od razu po poprzednim. Po ilu minutach od otwarcia zostanie obsłużony ostatni klient?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — czasy obsługi kolejnych klientów.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każdy czas ≤ 10⁶'],
            examples: [{ input: '5\n4 2 3 5 1', note: 'Kasa 1: 4, potem 5 (koniec 9). Kasa 2: 2, 3, 1 (koniec 6). Ostatni klient skończy po 9 minutach.' }],
            hint: R`Pamiętaj dwie liczby: k1 i k2 — kiedy zwolni się kasa 1 i kasa 2. Klient idzie tam, gdzie liczba jest mniejsza (przy remisie do kasy 1), i dodajesz do niej jego czas. Odpowiedź to max(k1, k2). Czasy sumują się do miliardów — long long.`,
            tests: (r) => ['1\n7', '2\n5 5', '3\n10 1 1', '4\n1 1 1 10', fmt(arr(r, 20, 1, 10)), fmt(arr(r, 5000, 1, 1e6)), fmt(arr(r, 5000, 999999, 1e6))],
            solve: (inp) => { let k1 = 0, k2 = 0; for (const c of czytaj(inp).v) { if (k1 <= k2) k1 += c; else k2 += c; } return String(Math.max(k1, k2)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long k1 = 0, k2 = 0;
    for (int i = 0; i < n; i++) {
        long long c;
        cin >> c;
        if (k1 <= k2) k1 += c;
        else k2 += c;
    }
    cout << max(k1, k2) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-najcieplejszy-dzien-okresu', krok: 10, level: 'srednie',
            title: 'Najcieplejszy dzień każdego okresu',
            short: 'Dla każdego okresu k kolejnych dni — najwyższa temperatura w tym okresie.',
            tags: ['okno k dni', 'max_element na kawałku'],
            statement: ['Masz temperatury z n kolejnych dni. Dla każdego okresu k kolejnych dni — pierwszy zaczyna się w dniu 1, drugi w dniu 2 i tak dalej, aż do ostatniego, który kończy się w dniu n — wypisz najwyższą temperaturę w tym okresie. Wyniki wypisz w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Jeden wiersz: n − k + 1 liczb.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '7 3\n2 5 1 8 7 3 4', note: 'Okresy: 2 5 1, 5 1 8, 1 8 7, 8 7 3, 7 3 4.' }],
            hint: R`Okresów jest n − k + 1. Dla okresu zaczynającego się w pudełku i (licząc od 0) najwyższa temperatura to *max_element(t.begin() + i, t.begin() + i + k).`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n-50', '3 3\n1 9 2', '4 1\n4 3 2 1', t(20, 4, -10, 10), t(2000, 7, -50, 50), t(2000, 2000, -50, 50), t(2000, 50, -5, 5)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const t = a.slice(2, 2 + n); const out = []; for (let i = 0; i + k <= n; i++) out.push(Math.max(...t.slice(i, i + k))); return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    for (int i = 0; i + k <= n; i++) {
        cout << *max_element(t.begin() + i, t.begin() + i + k) << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-moment-transakcji', krok: 10, level: 'srednie',
            title: 'Najlepszy moment na transakcję',
            short: 'Największy zysk z kupna i sprzedaży — oraz dni, w których to zrobić.',
            tags: ['najlepszy zysk', 'pozycja minimum', 'remisy'],
            statement: ['Znasz ceny akcji z n kolejnych dni. Możesz kupić akcję w jednym dniu i sprzedać ją w którymś późniejszym. Wypisz największy możliwy zysk oraz numery dni kupna i sprzedaży (dni numerujemy od 1). Jeśli najlepszych transakcji jest kilka, wybierz tę z najwcześniejszym dniem sprzedaży, a przy dalszym remisie — z najwcześniejszym dniem kupna. Jeśli żadna transakcja nie daje dodatniego zysku, wypisz tylko 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — ceny.'],
            output_format: ['Jeden wiersz: zysk, dzień kupna i dzień sprzedaży — albo samo 0.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda cena ≤ 10⁹'],
            examples: [{ input: '6\n7 1 5 3 6 4', note: 'Kupno w dniu 2 po 1, sprzedaż w dniu 5 po 6.' }, { input: '3\n5 5 5' }],
            hint: R`Rozbuduj najlepszy zysk z części 8. Obok mini trzymaj dzień, w którym ta cena pojawiła się pierwszy raz (aktualizuj tylko przy cena < mini), a obok zysku — dni kupna i sprzedaży (aktualizuj tylko przy zysku większym od dotychczasowego).`,
            tests: (r) => ['1\n5', '2\n1 2', '2\n2 1', '5\n1 5 1 5 5', '6\n3 1 4 1 5 9', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 5000, 1, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => 5000 - i)), fmt(arr(r, 5000, 1, 4))],
            solve: (inp) => {
                const v = czytaj(inp).v; let mn = v[0], dm = 0, z = 0, k = -1, s = -1;
                for (let i = 1; i < v.length; i++) { if (v[i] - mn > z) { z = v[i] - mn; k = dm; s = i; } if (v[i] < mn) { mn = v[i]; dm = i; } }
                return z > 0 ? `${z} ${k + 1} ${s + 1}` : '0';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> c(n);
    for (auto &x : c) cin >> x;
    int mini = c[0], dzienMin = 0;
    int zysk = 0, kupno = -1, sprzedaz = -1;
    for (int i = 1; i < n; i++) {
        if (c[i] - mini > zysk) {
            zysk = c[i] - mini;
            kupno = dzienMin;
            sprzedaz = i;
        }
        if (c[i] < mini) {
            mini = c[i];
            dzienMin = i;
        }
    }
    if (zysk > 0) cout << zysk << " " << kupno + 1 << " " << sprzedaz + 1 << "\n";
    else cout << 0 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-iloczyn-trzech', krok: 10, level: 'srednie',
            title: 'Iloczyn trzech liczb',
            short: 'Trzy liczby o największym iloczynie — dwie bardzo ujemne mogą zmienić wszystko.',
            tags: ['trzy największe i dwie najmniejsze', 'long long', 'max dwóch kandydatów'],
            statement: ['Wczytaj n liczb całkowitych (także ujemnych). Wybierz trzy liczby stojące na różnych pozycjach tak, żeby ich iloczyn był jak największy. Wypisz ten iloczyn.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największy iloczyn.'],
            constraints: ['3 ≤ n ≤ 5000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5\n-10 -10 1 3 2', note: '(−10) · (−10) · 3 = 300 to więcej niż 3 · 2 · 1 = 6.' }, { input: '4\n-5 -4 -3 -2', note: 'Same ujemne: najlepiej wziąć trzy największe, (−2) · (−3) · (−4) = −24.' }],
            hint: R`Kandydaci są dwaj: iloczyn trzech największych liczb oraz iloczyn dwóch najmniejszych i największej. Znajdź m1, m2, m3, s1 i s2 jednym przejściem (albo posortuj) i weź większy kandydat. Iloczyn sięga 10¹⁸ — long long.`,
            tests: (r) => ['3\n1 2 3', '3\n-1000000 -1000000 -1000000', '3\n-1000000 1000000 1000000', '4\n-1000000 -1000000 0 1000000', '5\n0 0 0 -1 -1', fmt(arr(r, 30, -20, 20)), fmt(arr(r, 5000, -1e6, 1e6)), fmt(arr(r, 5000, -1e6, -1)), fmt(arr(r, 5000, 0, 1e6))],
            solve: (inp) => { const v = big(czytaj(inp).v).sort(cmpB); const n = v.length; return String(bmax(v[n - 1] * v[n - 2] * v[n - 3], v[0] * v[1] * v[n - 1])); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    sort(v.begin(), v.end());
    long long a = v[n - 1] * v[n - 2] * v[n - 3];
    long long b = v[0] * v[1] * v[n - 1];
    cout << max(a, b) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-puchar', krok: 10, level: 'srednie',
            title: 'Puchar',
            short: 'Turniej pucharowy, w którym zawsze wygrywa silniejszy. Kto zagra w finale?',
            tags: ['max_element na połówkach', 'myślenie zamiast symulacji'],
            statement: ['W turnieju pucharowym startuje n zawodników, gdzie n jest potęgą dwójki. W pierwszej rundzie grają ze sobą zawodnicy 1 i 2, 3 i 4, 5 i 6 i tak dalej; zwycięzcy przechodzą dalej i w kolejnej rundzie znów grają parami w tej samej kolejności, aż zostanie jeden. W każdym meczu wygrywa zawodnik o większej sile (wszystkie siły są różne). Wypisz siłę zwycięzcy turnieju i siłę zawodnika, który przegrał finał.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb całkowitych — siły zawodników w kolejności drabinki.'],
            output_format: ['Jeden wiersz: siła zwycięzcy i siła finalisty.'],
            constraints: ['2 ≤ n ≤ 4096, n jest potęgą dwójki', '1 ≤ każda siła ≤ 10⁹, wszystkie siły są różne'],
            examples: [{ input: '8\n5 12 3 9 14 1 7 6', note: 'Lewa połowa drabinki (5 12 3 9) wyłoni 12, prawa (14 1 7 6) — 14. W finale 14 pokonuje 12.' }],
            hint: R`Nie trzeba symulować meczów! Zwycięzca turnieju to najsilniejszy zawodnik. W finale spotykają się zwycięzcy obu połówek drabinki — więc finalista to najsilniejszy zawodnik tej połowy, w której nie ma zwycięzcy. Uwaga: drugi najsilniejszy zawodnik wcale nie musi grać w finale.`,
            check: (inp) => { const v = czytaj(inp).v; const n = v.length; return (n & (n - 1)) === 0 && n >= 2 && new Set(v).size === n ? null : 'zle n albo powtorzenia'; },
            tests: (r) => {
                const t = (n, hi) => fmt(r.shuffle(Array.from(new Set(arr(r, n * 3, 1, hi)))).slice(0, n));
                return ['2\n1 2', '2\n1000000000 1', '4\n4 3 2 1', '4\n1 4 3 2', t(8, 100), t(64, 1e9), t(4096, 1e9), t(1024, 5000)];
            },
            solve: (inp) => { const v = czytaj(inp).v; const p = v.length / 2; const a = Math.max(...v.slice(0, p)), b = Math.max(...v.slice(p)); return `${Math.max(a, b)} ${Math.min(a, b)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int lewa = *max_element(v.begin(), v.begin() + n / 2);
    int prawa = *max_element(v.begin() + n / 2, v.end());
    cout << max(lewa, prawa) << " " << min(lewa, prawa) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-wspolne-pole-wielu', krok: 10, level: 'srednie',
            title: 'Wspólne pole wielu prostokątów',
            short: 'n prostokątów na planszy — jakie pole ma część wspólna wszystkich?',
            tags: ['cztery rekordy', 'max(0LL, …)', 'long long'],
            statement: ['Na planszy narysowano n prostokątów o bokach równoległych do osi. Każdy opisują współrzędne lewego dolnego rogu (x1, y1) i prawego górnego rogu (x2, y2). Wypisz pole części wspólnej wszystkich prostokątów (0, jeśli takiej części nie ma albo jest tylko odcinkiem lub punktem).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy cztery liczby całkowite x1, y1, x2, y2.'],
            output_format: ['Jedna liczba — pole części wspólnej.'],
            constraints: ['1 ≤ n ≤ 1500', '−10⁹ ≤ każda współrzędna ≤ 10⁹', 'x1 < x2 oraz y1 < y2'],
            examples: [{ input: '3\n0 0 10 10\n2 3 12 8\n-5 1 7 9', note: 'Część wspólna: x od 2 do 7, y od 3 do 8 — pole 5 · 5 = 25.' }],
            hint: R`Część wspólna to prostokąt od (największe x1, największe y1) do (najmniejsze x2, najmniejsze y2) — cztery rekordy w jednej pętli. Szerokość i wysokość licz przez max(0LL, …), a pole w long long.`,
            check: (inp) => { const a = nums(inp); for (let i = 0; i < a[0]; i++) { const p = a.slice(1 + 4 * i, 5 + 4 * i); if (!(p[0] < p[2] && p[1] < p[3])) return 'zly prostokat'; } return null; },
            tests: (r) => {
                const wokol = (n, cx, cy, d) => wiersze(Array.from({ length: n }, () => [cx - r.int(1, d), cy - r.int(1, d), cx + r.int(1, d), cy + r.int(1, d)]));
                const losowe = (n, lo, hi) => wiersze(Array.from({ length: n }, () => { const x = r.int(lo, hi - 1), y = r.int(lo, hi - 1); return [x, y, r.int(x + 1, hi), r.int(y + 1, hi)]; }));
                return ['1\n-1000000000 -1000000000 1000000000 1000000000', '2\n0 0 5 5\n5 0 9 5', '2\n0 0 4 4\n1 1 2 2', wokol(10, 0, 0, 10), wokol(1500, 0, 0, 1e9 - 1), wokol(1500, 777, -555, 1e6), losowe(5, -20, 20), losowe(1500, -1e9, 1e9)];
            },
            solve: (inp) => {
                const a = big(toks(inp)); const n = Number(a[0]); let X1 = a[1], Y1 = a[2], X2 = a[3], Y2 = a[4];
                for (let i = 0; i < n; i++) { const p = a.slice(1 + 4 * i, 5 + 4 * i); X1 = bmax(X1, p[0]); Y1 = bmax(Y1, p[1]); X2 = bmin(X2, p[2]); Y2 = bmin(Y2, p[3]); }
                return String(bmax(0n, X2 - X1) * bmax(0n, Y2 - Y1));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long X1 = LLONG_MIN, Y1 = LLONG_MIN, X2 = LLONG_MAX, Y2 = LLONG_MAX;
    for (int i = 0; i < n; i++) {
        long long a, b, c, d;
        cin >> a >> b >> c >> d;
        X1 = max(X1, a);
        Y1 = max(Y1, b);
        X2 = min(X2, c);
        Y2 = min(Y2, d);
    }
    cout << max(0LL, X2 - X1) * max(0LL, Y2 - Y1) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-spotkanie', krok: 10, level: 'srednie',
            title: 'Spotkanie w połowie drogi',
            short: 'Gdzie spotkać się, żeby osoba z najdalszą drogą miała jak najbliżej?',
            tags: ['max − min', 'zaokrąglenie w górę', 'myślenie'],
            statement: ['Przy długiej, prostej ulicy mieszka n przyjaciół, każdy w domu o podanym numerze (numery mogą się powtarzać). Chcą spotkać się przed domem o pewnym numerze całkowitym (nie musi to być dom kogoś z nich) i wybierają go tak, żeby osoba, która ma najdalej, miała jak najbliżej. Odległość między domami a i b to |a − b|. Wypisz, ile wynosi wtedy droga osoby, która idzie najdalej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — numery domów.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ każdy numer ≤ 10⁹'],
            examples: [{ input: '4\n3 11 7 4', note: 'Spotkanie przed domem 7: najdalej mają osoby z domów 3 i 11 — po 4.' }, { input: '2\n2 7', note: 'Spotkanie przed domem 4 albo 5 — ktoś przejdzie 3.' }],
            hint: R`Liczą się tylko dwie skrajne osoby: mieszkająca pod najmniejszym i pod największym numerem. Spotkanie najlepiej zrobić w połowie drogi między nimi. Jeśli odległość d = max − min jest nieparzysta, środek nie wypada na numerze całkowitym i ktoś musi przejść o pół domu więcej — wynik to (d + 1) / 2.`,
            tests: (r) => ['1\n5', '2\n0 1000000000', '2\n0 999999999', '3\n7 7 7', '2\n0 1', fmt(arr(r, 20, 0, 50)), fmt(arr(r, 5000, 0, 1e9)), fmt(arr(r, 5000, 500, 503))],
            solve: (inp) => { const v = czytaj(inp).v; const d = Math.max(...v) - Math.min(...v); return String(Math.floor((d + 1) / 2)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int mx = INT_MIN, mn = INT_MAX;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        mx = max(mx, x);
        mn = min(mn, x);
    }
    int d = mx - mn;
    cout << (d + 1) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-wycieczka', krok: 10, level: 'srednie',
            title: 'Pogoda na wycieczkę',
            short: 'k dni wycieczki, których najzimniejszy dzień jest jak najcieplejszy.',
            tags: ['najlepszy z najgorszych', 'min w oknie', 'max z minimów'],
            statement: ['Masz prognozę temperatur na n kolejnych dni. Planujesz wycieczkę trwającą k kolejnych dni i chcesz, żeby najzimniejszy dzień wycieczki był jak najcieplejszy. Wypisz temperaturę najzimniejszego dnia najlepszej wycieczki i numer jej pierwszego dnia (dni numerujemy od 1; przy remisie — najwcześniejszy).'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — temperatury.'],
            output_format: ['Jeden wiersz: temperatura i numer dnia.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', '−30 ≤ każda temperatura ≤ 40'],
            examples: [{ input: '7 3\n5 9 6 7 6 2 8', note: 'Najzimniejsze dni kolejnych wycieczek: 5, 6, 6, 2, 2. Najlepiej wyjechać w dniu 2.' }],
            hint: R`Dla każdego okresu k dni policz najzimniejszy dzień (*min_element na kawałku), a spośród tych minimów weź największe razem z numerem pierwszego dnia. Ostry znak > zostawi najwcześniejszą wycieczkę.`,
            check: (inp) => { const a = nums(inp); return a[1] >= 1 && a[1] <= a[0] ? null : 'zle k'; },
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 1\n-30', '3 3\n4 1 9', '4 1\n4 9 2 9', t(20, 4, -10, 10), t(2000, 7, -30, 40), t(2000, 2000, -30, 40), t(2000, 30, 10, 14)];
            },
            solve: (inp) => { const a = nums(inp); const [n, k] = a; const t = a.slice(2, 2 + n); let b = -Infinity, st = 0; for (let i = 0; i + k <= n; i++) { const m = Math.min(...t.slice(i, i + k)); if (m > b) { b = m; st = i; } } return `${b} ${st + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    int najl = INT_MIN, start = 0;
    for (int i = 0; i + k <= n; i++) {
        int m = *min_element(t.begin() + i, t.begin() + i + k);
        if (m > najl) {
            najl = m;
            start = i;
        }
    }
    cout << najl << " " << start + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-wiersz-i-kolumna', krok: 10, level: 'srednie',
            title: 'Najlepszy wiersz i najlepsza kolumna',
            short: 'Który wiersz i która kolumna tabeli mają największą sumę?',
            tags: ['sumy wierszy i kolumn', 'rekord z numerem', 'vector 2D'],
            statement: ['Wczytaj tabelę liczb całkowitych o w wierszach i k kolumnach. Wypisz numer wiersza o największej sumie liczb i numer kolumny o największej sumie liczb (wiersze i kolumny numerujemy od 1; przy remisie — najmniejszy numer).'],
            input_format: ['W pierwszym wierszu liczby w i k.', 'W kolejnych w wierszach po k liczb całkowitych.'],
            output_format: ['Jeden wiersz: numer wiersza i numer kolumny.'],
            constraints: ['1 ≤ w, k ≤ 100', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3 4\n3 8 1 6\n7 2 9 4\n5 5 0 8', note: 'Sumy wierszy: 18, 22, 18. Sumy kolumn: 15, 15, 10, 18.' }],
            hint: R`Policz sumę każdego wiersza i każdej kolumny, a potem w każdej grupie wybierz największą razem z numerem. Sumy mogą być ujemne, więc rekord zacznij od pierwszej sumy (albo od INT_MIN), a nie od zera.`,
            tests: (r) => {
                const tab = (w, k, lo, hi) => `${w} ${k}\n${Array.from({ length: w }, () => arr(r, k, lo, hi).join(' ')).join('\n')}`;
                return ['1 1\n-7', '2 2\n-1 -1\n-1 -1', '2 3\n1 2 3\n3 2 1', tab(5, 4, -9, 9), tab(100, 100, -1e6, 1e6), tab(100, 100, -1, 1), tab(40, 70, -1e6, -1)];
            },
            solve: (inp) => {
                const a = nums(inp); const [w, k] = a; const t = []; for (let i = 0; i < w; i++) t.push(a.slice(2 + i * k, 2 + (i + 1) * k));
                const sw = t.map((row) => row.reduce((s, x) => s + x, 0)); const sk = []; for (let j = 0; j < k; j++) sk.push(t.reduce((s, row) => s + row[j], 0));
                return `${sw.indexOf(Math.max(...sw)) + 1} ${sk.indexOf(Math.max(...sk)) + 1}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int w, k;
    cin >> w >> k;
    vector<vector<int>> t(w, vector<int>(k));
    for (auto &wiersz : t)
        for (auto &x : wiersz) cin >> x;
    vector<int> sw(w, 0), sk(k, 0);
    for (int i = 0; i < w; i++)
        for (int j = 0; j < k; j++) {
            sw[i] += t[i][j];
            sk[j] += t[i][j];
        }
    cout << max_element(sw.begin(), sw.end()) - sw.begin() + 1 << " ";
    cout << max_element(sk.begin(), sk.end()) - sk.begin() + 1 << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'mm-b-deszczowka', krok: 10, level: 'trudne',
            title: 'Deszczówka',
            short: 'Słupki różnej wysokości, a po deszczu woda w dołkach. Ile jej się zebrało?',
            tags: ['tablice pm i sm', 'min(pm[i], sm[i]) − h[i]', 'long long'],
            statement: [
                'Teren widziany z boku to n słupków o szerokości 1 i podanych wysokościach, stojących obok siebie. Spadł deszcz i woda zebrała się w dołkach między słupkami (a to, co spływa poza skrajne słupki, ucieka).',
                'Nad słupkiem i woda sięga do wysokości równej mniejszej z dwóch liczb: najwyższego słupka na lewo od i (wliczając sam słupek i) oraz najwyższego słupka na prawo od i (też wliczając i). Nad słupkiem stoi więc tyle wody, o ile ta wysokość przekracza jego własną. Ile jednostek wody zebrało się łącznie?',
            ],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wysokości słupków od lewej.'],
            output_format: ['Jedna liczba — ilość wody.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ każda wysokość ≤ 10⁹'],
            examples: [{ input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', note: 'Woda stoi nad słupkami numer 3 (1), 5 (1), 6 (2), 7 (1) i 10 (1) — razem 6.' }],
            hint: R`Policz pm[i] — najwyższy słupek od 0 do i — i sm[i] — najwyższy od i do n − 1 (pętla od końca). Nad słupkiem i stoi min(pm[i], sm[i]) - h[i] wody. Sumuj w long long: wody może być nawet 5·10¹².`,
            tests: (r) => ['1\n5', '3\n5 0 5', '3\n0 5 0', '5\n5 4 3 2 1', '4\n1000000000 0 0 1000000000', fmt(arr(r, 30, 0, 10)), fmt(arr(r, 5000, 0, 1e9)),
                fmt(Array.from({ length: 5000 }, (_, i) => (i === 0 || i === 4999 ? 1e9 : r.int(0, 10)))), fmt(Array.from({ length: 5000 }, (_, i) => Math.abs(2500 - i) * 1000))],
            solve: (inp) => {
                const v = czytaj(inp).v; const n = v.length; const pm = [], sm = [];
                for (let i = 0; i < n; i++) pm[i] = i ? Math.max(pm[i - 1], v[i]) : v[i];
                for (let i = n - 1; i >= 0; i--) sm[i] = i < n - 1 ? Math.max(sm[i + 1], v[i]) : v[i];
                let s = 0n; for (let i = 0; i < n; i++) s += BigInt(Math.min(pm[i], sm[i]) - v[i]);
                return String(s);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> h(n);
    for (auto &x : h) cin >> x;
    vector<long long> pm(n), sm(n);
    pm[0] = h[0];
    for (int i = 1; i < n; i++) pm[i] = max(pm[i - 1], h[i]);
    sm[n - 1] = h[n - 1];
    for (int i = n - 2; i >= 0; i--) sm[i] = max(sm[i + 1], h[i]);
    long long woda = 0;
    for (int i = 0; i < n; i++) woda += min(pm[i], sm[i]) - h[i];
    cout << woda << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-dwie-transakcje', krok: 10, level: 'trudne',
            title: 'Dwie transakcje',
            short: 'Najwyżej dwie transakcje kupna i sprzedaży, jedna po drugiej. Jaki największy łączny zysk?',
            tags: ['najlepszy zysk od lewej i od prawej', 'podział w dniu i', 'tablice'],
            statement: ['Znasz ceny akcji z n kolejnych dni. Możesz przeprowadzić najwyżej dwie transakcje — każda to kupno jednej akcji w jakimś dniu i sprzedaż jej w dniu późniejszym. Transakcje nie mogą na siebie zachodzić: drugą możesz zacząć (kupić) najwcześniej w dniu, w którym zakończyłeś pierwszą (sprzedałeś). Możesz też zrobić tylko jedną transakcję albo żadnej. Jaki największy łączny zysk możesz osiągnąć?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — ceny z kolejnych dni.'],
            output_format: ['Jedna liczba — największy łączny zysk.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ każda cena ≤ 10⁹'],
            examples: [{ input: '8\n3 3 5 0 0 3 1 4', note: 'Kupno po 0, sprzedaż po 3 (zysk 3), potem kupno po 1, sprzedaż po 4 (zysk 3). Razem 6.' }, { input: '5\n1 2 3 4 5', note: 'Jedna transakcja: kupno po 1, sprzedaż po 5.' }],
            hint: R`Policz L[i] — najlepszy zysk jednej transakcji zakończonej najpóźniej w dniu i (najlepszy zysk z części 8, zapisywany po każdym dniu) — oraz P[i] — najlepszy zysk jednej transakcji rozpoczętej najwcześniej w dniu i (to samo od końca: idziesz od prawej i pamiętasz najwyższą cenę). Odpowiedź to największe L[i] + P[i]. Wynik może przekroczyć zakres int — long long.`,
            tests: (r) => ['1\n5', '2\n1 1000000000', '3\n3 2 1', '4\n1 1000000000 1 1000000000', '6\n1 5 2 8 3 10', fmt(arr(r, 30, 1, 20)), fmt(arr(r, 5000, 1, 1e9)), fmt(Array.from({ length: 5000 }, (_, i) => 1 + Math.abs(2500 - i) * 1000)), fmt(arr(r, 5000, 1, 5))],
            solve: (inp) => {
                const v = czytaj(inp).v; const n = v.length; const L = [], P = [];
                let mn = Infinity, b = 0; for (let i = 0; i < n; i++) { mn = Math.min(mn, v[i]); b = Math.max(b, v[i] - mn); L[i] = b; }
                let mx = -Infinity; b = 0; for (let i = n - 1; i >= 0; i--) { mx = Math.max(mx, v[i]); b = Math.max(b, mx - v[i]); P[i] = b; }
                let w = 0; for (let i = 0; i < n; i++) w = Math.max(w, L[i] + P[i]);
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> c(n);
    for (auto &x : c) cin >> x;
    vector<long long> L(n), P(n);
    long long mini = LLONG_MAX, najl = 0;
    for (int i = 0; i < n; i++) {
        mini = min(mini, c[i]);
        najl = max(najl, c[i] - mini);
        L[i] = najl;
    }
    long long maks = LLONG_MIN;
    najl = 0;
    for (int i = n - 1; i >= 0; i--) {
        maks = max(maks, c[i]);
        najl = max(najl, maks - c[i]);
        P[i] = najl;
    }
    long long wynik = 0;
    for (int i = 0; i < n; i++) wynik = max(wynik, L[i] + P[i]);
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-naszyjnik', krok: 10, level: 'trudne',
            title: 'Naszyjnik z koralików',
            short: 'Największa suma fragmentu — ale koraliki są ułożone w kółko.',
            tags: ['Kadane dla max i dla min', 'suma całości − najgorszy fragment', 'long long'],
            statement: ['Naszyjnik składa się z n koralików ułożonych w kółko — koralik n sąsiaduje z koralikiem 1. Na każdym koraliku jest liczba całkowita (dodatnia albo ujemna). Wybierz niepusty fragment kolejnych koralików o największej sumie i wypisz tę sumę. Fragment może przechodzić przez miejsce, w którym koralik n łączy się z koralikiem 1, ale żadnego koralika nie można wziąć dwa razy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — liczby na kolejnych koralikach.'],
            output_format: ['Jedna liczba — największa suma fragmentu.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n5 -3 -2 6 -1', note: 'Najlepszy fragment przechodzi przez łączenie: 6, −1, 5 — suma 10.' }, { input: '3\n-2 -3 -1' }],
            hint: R`Fragment, który nie przechodzi przez łączenie, znajdzie zwykły Kadane. Fragment, który przez nie przechodzi, to cały naszyjnik bez pewnego kawałka „ze środka” — więc najlepszy taki to suma wszystkich minus najmniejsza suma fragmentu (Kadane z min zamiast max). Odpowiedź to większa z tych liczb. Uwaga: gdy wszystkie liczby są ujemne, „wszystko minus najgorszy fragment” oznacza pusty fragment — wtedy liczy się tylko zwykły Kadane.`,
            tests: (r) => ['1\n-7', '1\n7', '2\n-1 5', '4\n3 -100 3 3', '3\n-1 -1 -1', '5\n1000000000 1000000000 -1 1000000000 1000000000', fmt(arr(r, 30, -10, 10)), fmt(arr(r, 5000, -1e9, 1e9)),
                fmt(arr(r, 5000, -1e9, -1)), fmt(Array.from({ length: 5000 }, (_, i) => (i > 1000 && i < 4000 ? -r.int(1, 1e6) : r.int(1, 1e6))))],
            solve: (inp) => {
                const v = big(czytaj(inp).v); let o = v[0], b = v[0], om = v[0], bm = v[0], S = v[0];
                for (let i = 1; i < v.length; i++) { const x = v[i]; S += x; o = bmax(x, o + x); b = bmax(b, o); om = bmin(x, om + x); bm = bmin(bm, om); }
                return String(b < 0n ? b : bmax(b, S - bm));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    long long obMax = v[0], najMax = v[0], obMin = v[0], najMin = v[0], suma = v[0];
    for (int i = 1; i < n; i++) {
        long long x = v[i];
        suma += x;
        obMax = max(x, obMax + x);
        najMax = max(najMax, obMax);
        obMin = min(x, obMin + x);
        najMin = min(najMin, obMin);
    }
    if (najMax < 0) cout << najMax << "\n";
    else cout << max(najMax, suma - najMin) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-gorka', krok: 10, level: 'trudne',
            title: 'Najdłuższa górka',
            short: 'Fragment, który najpierw ściśle rośnie, a potem ściśle maleje. Jak długi może być?',
            tags: ['rekordy z lewej i z prawej', 'up[i] i down[i]', 'max'],
            statement: ['Górka to fragment ciągu (kawałek złożony z sąsiednich liczb), który najpierw ściśle rośnie, a potem ściśle maleje — i obie części są niepuste, na przykład 1 4 7 3 2 albo 2 5 1. Wypisz liczbę elementów najdłuższej górki w ciągu albo 0, jeśli w ciągu nie ma żadnej górki.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '9\n2 1 4 7 3 2 5 6 1', note: 'Górki: 1 4 7 3 2 (5 liczb) i 2 5 6 1 (4 liczby).' }, { input: '4\n3 3 3 3' }],
            hint: R`Policz up[i] — ile liczb ma najdłuższy ściśle rosnący fragment kończący się w i — i down[i] — ile liczb ma najdłuższy ściśle malejący fragment zaczynający się w i (pętla od końca). Liczba i może być szczytem górki, gdy up[i] ≥ 2 i down[i] ≥ 2; taka górka ma up[i] + down[i] − 1 liczb. Zrób z tego rekord.`,
            tests: (r) => ['1\n5', '3\n1 2 1', '3\n1 2 3', '3\n3 2 1', '5\n1 2 2 2 1', '7\n1 2 3 4 3 2 1', fmt(arr(r, 40, 0, 5)), fmt(arr(r, 5000, -1e9, 1e9)),
                fmt(Array.from({ length: 5000 }, (_, i) => 2500 - Math.abs(2500 - i))), fmt(Array.from({ length: 5000 }, (_, i) => i % 50 < 25 ? i % 50 : 50 - (i % 50)))],
            solve: (inp) => {
                const v = czytaj(inp).v; const n = v.length; const up = Array(n).fill(1), dn = Array(n).fill(1);
                for (let i = 1; i < n; i++) if (v[i] > v[i - 1]) up[i] = up[i - 1] + 1;
                for (let i = n - 2; i >= 0; i--) if (v[i] > v[i + 1]) dn[i] = dn[i + 1] + 1;
                let b = 0; for (let i = 0; i < n; i++) if (up[i] >= 2 && dn[i] >= 2) b = Math.max(b, up[i] + dn[i] - 1);
                return String(b);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    vector<int> up(n, 1), down(n, 1);
    for (int i = 1; i < n; i++)
        if (v[i] > v[i - 1]) up[i] = up[i - 1] + 1;
    for (int i = n - 2; i >= 0; i--)
        if (v[i] > v[i + 1]) down[i] = down[i + 1] + 1;
    int najl = 0;
    for (int i = 0; i < n; i++)
        if (up[i] >= 2 && down[i] >= 2) najl = max(najl, up[i] + down[i] - 1);
    cout << najl << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-iloczyn-fragmentu', krok: 10, level: 'trudne',
            title: 'Największy iloczyn fragmentu',
            short: 'Kawałek ciągu o największym iloczynie — trzeba pilnować i maksimum, i minimum.',
            tags: ['największy i najmniejszy na bieżąco', 'minus razy minus', 'long long'],
            statement: ['Wczytaj ciąg n liczb całkowitych z przedziału od −3 do 3. Wypisz największy iloczyn niepustego fragmentu, czyli kawałka złożonego z sąsiednich liczb.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największy iloczyn.'],
            constraints: ['1 ≤ n ≤ 36', '−3 ≤ każda liczba ≤ 3'],
            examples: [{ input: '5\n2 3 -2 4 -1', note: 'Najlepiej wziąć cały ciąg: dwa minusy dają plus, iloczyn 48.' }, { input: '3\n-2 0 -1', note: 'Najlepszy fragment to samo 0.' }],
            hint: R`Jak w Kadane, ale trzymaj dwie wartości: największy (mx) i najmniejszy (mn) iloczyn fragmentu kończącego się na bieżącej liczbie x — bo bardzo ujemny iloczyn pomnożony przez liczbę ujemną staje się bardzo dodatni. Nowe mx = max({x, mx·x, mn·x}), nowe mn = min({x, mx·x, mn·x}) — oba licz ze STARYCH wartości. Iloczyny sięgają 3³⁶ — long long.`,
            tests: (r) => ['1\n-3', '1\n0', '2\n-3 -3', '3\n-1 -1 -1', '4\n0 -2 0 -3', fmt(Array(36).fill(3)), fmt(Array(36).fill(-3)), fmt(Array(35).fill(-3)),
                ...Array.from({ length: 5 }, () => fmt(arr(r, r.int(1, 36), -3, 3))), fmt(arr(r, 36, -3, 3).map((x) => (x === 0 ? 2 : x)))],
            solve: (inp) => {
                const v = big(czytaj(inp).v); let mx = v[0], mn = v[0], b = v[0];
                for (let i = 1; i < v.length; i++) { const x = v[i]; const c = [x, mx * x, mn * x]; mx = c.reduce(bmax); mn = c.reduce(bmin); b = bmax(b, mx); }
                return String(b);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    for (auto &x : v) cin >> x;
    long long mx = v[0], mn = v[0], najl = v[0];
    for (int i = 1; i < n; i++) {
        long long x = v[i];
        long long a = mx * x, b = mn * x;
        mx = max({x, a, b});
        mn = min({x, a, b});
        najl = max(najl, mx);
    }
    cout << najl << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-sciezka', krok: 10, level: 'trudne',
            title: 'Ścieżka po planszy',
            short: 'Idziesz tylko w prawo albo w dół i zbierasz monety. Ile najwięcej uzbierasz?',
            tags: ['najlepszy wynik do każdego pola', 'max(z góry, z lewej)', 'vector 2D'],
            statement: ['Na planszy w × k w każdym polu leży pewna liczba monet — liczba całkowita, która może być ujemna (to kara). Zaczynasz w lewym górnym polu, kończysz w prawym dolnym i w każdym kroku możesz przejść o jedno pole w prawo albo o jedno pole w dół. Zbierasz monety ze wszystkich pól na swojej trasie, także ze startowego i końcowego. Ile najwięcej monet możesz zebrać?'],
            input_format: ['W pierwszym wierszu liczby w i k.', 'W kolejnych w wierszach po k liczb całkowitych.'],
            output_format: ['Jedna liczba — największa suma monet.'],
            constraints: ['1 ≤ w, k ≤ 100', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '3 3\n1 3 1\n1 5 1\n4 2 1', note: 'Trasa 1 → 3 → 5 → 2 → 1 daje 12.' }],
            hint: R`Dla każdego pola policz najlepszy wynik trasy, która kończy się w tym polu. Do pola (i, j) można dojść tylko z góry albo z lewej, więc najlepszy[i][j] = t[i][j] + max(najlepszy[i − 1][j], najlepszy[i][j − 1]). W pierwszym wierszu i w pierwszej kolumnie jest tylko jedna droga. To rekord „na bieżąco”, tylko w dwóch wymiarach!`,
            tests: (r) => {
                const tab = (w, k, lo, hi) => `${w} ${k}\n${Array.from({ length: w }, () => arr(r, k, lo, hi).join(' ')).join('\n')}`;
                return ['1 1\n-5', '1 4\n1 -2 3 -4', '4 1\n1\n-2\n3\n-4', '2 2\n1 -1000\n-1000 1', tab(5, 6, -9, 9), tab(100, 100, -1000, 1000), tab(100, 100, -1000, -1), tab(80, 100, -5, 20)];
            },
            solve: (inp) => {
                const a = nums(inp); const [w, k] = a; const d = [];
                for (let i = 0; i < w; i++) {
                    d.push([]);
                    for (let j = 0; j < k; j++) {
                        const x = a[2 + i * k + j];
                        const z = []; if (i) z.push(d[i - 1][j]); if (j) z.push(d[i][j - 1]);
                        d[i][j] = x + (z.length ? Math.max(...z) : 0);
                    }
                }
                return String(d[w - 1][k - 1]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int w, k;
    cin >> w >> k;
    vector<vector<int>> t(w, vector<int>(k)), naj(w, vector<int>(k));
    for (auto &wiersz : t)
        for (auto &x : wiersz) cin >> x;
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < k; j++) {
            if (i == 0 && j == 0) naj[i][j] = t[i][j];
            else if (i == 0) naj[i][j] = t[i][j] + naj[i][j - 1];
            else if (j == 0) naj[i][j] = t[i][j] + naj[i - 1][j];
            else naj[i][j] = t[i][j] + max(naj[i - 1][j], naj[i][j - 1]);
        }
    }
    cout << naj[w - 1][k - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-lawka', krok: 10, level: 'trudne',
            title: 'Ławka w parku',
            short: 'Usiądź na wolnym miejscu jak najdalej od najbliższej osoby.',
            tags: ['najbliższy z lewej i z prawej', 'min z dwóch odległości', 'max po miejscach'],
            statement: ['Na długiej ławce jest n miejsc w rzędzie. Opisuje je napis złożony z cyfr: 1 oznacza miejsce zajęte, a 0 — wolne. Co najmniej jedno miejsce jest zajęte i co najmniej jedno wolne. Siadasz na wolnym miejscu i chcesz, żeby odległość do najbliższej siedzącej osoby była jak największa. Wypisz tę największą możliwą odległość (odległość między miejscami i oraz j to |i − j|).'],
            input_format: ['Jeden napis z cyfr 0 i 1.'],
            output_format: ['Jedna liczba.'],
            constraints: ['Napis ma od 2 do 50 000 znaków.'],
            examples: [{ input: '1000101', note: 'Najlepiej usiąść na trzecim miejscu — do obu sąsiadów jest po 2 miejsca.' }, { input: '0001', note: 'Najlepiej usiąść na pierwszym miejscu, 3 miejsca od jedynej osoby.' }],
            hint: R`Dla każdego miejsca policz odległość do najbliższej osoby z lewej (przejście od lewej: pamiętasz numer ostatniego zajętego miejsca) i z prawej (przejście od prawej). Dla wolnego miejsca liczy się mniejsza z tych odległości, a odpowiedź to największa z nich. Gdy po którejś stronie nikt nie siedzi, ta strona się nie liczy — przyjmij tam bardzo dużą odległość.`,
            check: (inp) => { const s = toks(inp)[0]; return /^[01]+$/.test(s) && s.includes('0') && s.includes('1') && s.length >= 2 ? null : 'zly napis'; },
            tests: (r) => {
                const los = (n, p) => { for (;;) { const s = Array.from({ length: n }, () => (r() < p ? '1' : '0')).join(''); if (s.includes('0') && s.includes('1')) return s; } };
                return ['10', '01', '101', '1001', '10001', '0000000001', '1000000000', los(30, 0.3), los(50000, 0.01), los(50000, 0.5), '1' + '0'.repeat(49998) + '1'];
            },
            solve: (inp) => {
                const s = toks(inp)[0]; const n = s.length; const L = Array(n).fill(Infinity), P = Array(n).fill(Infinity);
                let ost = -1; for (let i = 0; i < n; i++) { if (s[i] === '1') ost = i; if (ost >= 0) L[i] = i - ost; }
                ost = -1; for (let i = n - 1; i >= 0; i--) { if (s[i] === '1') ost = i; if (ost >= 0) P[i] = ost - i; }
                let b = 0; for (let i = 0; i < n; i++) if (s[i] === '0') b = Math.max(b, Math.min(L[i], P[i]));
                return String(b);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    vector<int> lewo(n, INT_MAX), prawo(n, INT_MAX);
    int ostatnie = -1;
    for (int i = 0; i < n; i++) {
        if (s[i] == '1') ostatnie = i;
        if (ostatnie >= 0) lewo[i] = i - ostatnie;
    }
    ostatnie = -1;
    for (int i = n - 1; i >= 0; i--) {
        if (s[i] == '1') ostatnie = i;
        if (ostatnie >= 0) prawo[i] = ostatnie - i;
    }
    int najl = 0;
    for (int i = 0; i < n; i++)
        if (s[i] == '0') najl = max(najl, min(lewo[i], prawo[i]));
    cout << najl << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-b-final-wyprawa', krok: 10, level: 'trudne',
            title: 'Wielki finał: wyprawa w góry',
            short: 'Pięć pytań o jeden szlak górski — i pięć schematów z tej lekcji naraz.',
            tags: ['rekordy', 'skoki sąsiadów', 'najdłuższa seria', 'najlepszy zysk', 'pobite rekordy'],
            statement: [
                'Szlak górski opisuje n punktów pomiarowych, ponumerowanych od początku szlaku; dla każdego znasz wysokość nad poziomem morza. Odpowiedz na pięć pytań, każdą odpowiedź w osobnym wierszu:',
                '1) Jaka jest wysokość najwyższego i najniższego punktu szlaku? (dwie liczby w jednym wierszu)',
                '2) Jaka jest największa różnica wysokości między dwoma sąsiednimi punktami (bez znaku)?',
                '3) Ile punktów ma najdłuższe podejście — najdłuższy fragment kolejnych punktów, w którym każdy jest wyżej od poprzedniego?',
                '4) Jakie jest największe przewyższenie, czyli największa wartość hⱼ − hᵢ dla i < j? Jeśli szlak nigdzie nie wznosi się ponad żaden wcześniejszy punkt, wypisz 0.',
                '5) Ile razy, idąc od startu, osiągamy nową, najwyższą dotąd wysokość? Punkt startowy też się liczy.',
            ],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wysokości kolejnych punktów.'],
            output_format: ['Pięć wierszy z odpowiedziami na pytania 1–5.'],
            constraints: ['2 ≤ n ≤ 5000', '0 ≤ każda wysokość ≤ 9000'],
            examples: [{ input: '8\n1200 1350 1300 1500 1700 1650 1900 1100', note: 'Najdłuższe podejście to 1300 1500 1700. Największe przewyższenie: 1900 − 1200 = 700. Nowe rekordy: 1200, 1350, 1500, 1700, 1900.' }],
            hint: R`Rozbij zadanie na pięć znanych schematów: dwa rekordy (max i min), rekord różnic sąsiadów, najdłuższy rosnący fragment (obecny i najlepszy), najlepszy zysk (najniższy punkt do tej pory) i liczenie pobitych rekordów. Wszystko zmieścisz w jednej pętli po punktach — albo w kilku, jeśli tak jest czytelniej. Uważaj, żeby każdy rekord zaczynał od dobrej wartości.`,
            tests: (r) => ['2\n0 9000', '2\n9000 0', '3\n500 500 500', '5\n1 2 3 4 5', '5\n5 4 3 2 1', fmt(arr(r, 30, 1000, 1100)), fmt(arr(r, 5000, 0, 9000)),
                fmt(Array.from({ length: 5000 }, (_, i) => 4500 + Math.round(4000 * Math.sin(i / 300)) + r.int(-50, 50))), fmt(Array.from({ length: 5000 }, (_, i) => Math.min(9000, Math.floor(i * 1.7))))],
            check: (inp) => (czytaj(inp).v.every((x) => x >= 0 && x <= 9000) ? null : 'zakres'),
            solve: (inp) => {
                const v = czytaj(inp).v; const n = v.length;
                let skok = 0, ob = 1, naj = 1, mn = v[0], prz = 0, rek = 0, best = -1;
                for (let i = 0; i < n; i++) {
                    if (i) { skok = Math.max(skok, Math.abs(v[i] - v[i - 1])); ob = v[i] > v[i - 1] ? ob + 1 : 1; naj = Math.max(naj, ob); prz = Math.max(prz, v[i] - mn); mn = Math.min(mn, v[i]); }
                    if (v[i] > best) { rek++; best = v[i]; }
                }
                return [`${Math.max(...v)} ${Math.min(...v)}`, skok, naj, prz, rek].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for (auto &x : h) cin >> x;
    int maks = h[0], mini = h[0];     // 1) najwyższy i najniższy
    int skok = 0;                     // 2) największy skok sąsiadów
    int obecny = 1, podejscie = 1;    // 3) najdłuższe podejście
    int dotad = h[0], przew = 0;      // 4) najniższy dotąd i przewyższenie
    int rekordow = 1;                 // 5) nowe rekordy (start się liczy)
    for (int i = 1; i < n; i++) {
        if (h[i] > maks) rekordow++;  // przed aktualizacją maks!
        maks = max(maks, h[i]);
        mini = min(mini, h[i]);
        skok = max(skok, abs(h[i] - h[i - 1]));
        if (h[i] > h[i - 1]) obecny++;
        else obecny = 1;
        podejscie = max(podejscie, obecny);
        przew = max(przew, h[i] - dotad);
        dotad = min(dotad, h[i]);
    }
    cout << maks << " " << mini << "\n" << skok << "\n" << podejscie << "\n" << przew << "\n" << rekordow << "\n";
    return 0;
}`,
        },
    ];
};
