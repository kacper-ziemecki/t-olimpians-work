// Tablice — ćwiczenia w trakcie lekcji, części 1–4: pierwsza tablica (indeksy, klamry, tablice-ściągi),
// tablica i pętla (wczytywanie, wypisywanie, wypełnianie), przeglądanie (suma, maksimum, szukanie, sąsiedzi, pary)
// i zmienianie tablicy (zamiana, przesuwanie, odwracanie, usuwanie, wstawianie). Uczeń zna cały pierwszy etap:
// typy, wejście i wyjście, if / else, pętle while i for, napisy i modulo — ale jeszcze nie funkcje, vector ani sort.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const lin = (a) => a.join(' ');
    const arrIn = (a) => `${a.length}\n${lin(a)}`;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas', 'Julka', 'Tymon', 'Nina', 'Bartek'];
    const ZODIAK = ['szczur', 'bawol', 'tygrys', 'krolik', 'smok', 'waz', 'kon', 'koza', 'malpa', 'kogut', 'pies', 'swinia'];
    const F1 = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const MIES = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'wrzesnia', 'pazdziernika', 'listopada', 'grudnia'];
    const p2 = (x) => String(x).padStart(2, '0');
    // n liczb po pytaniach: "n\n…\nq\n…"
    const zPytaniami = (t, qs) => `${arrIn(t)}\n${qs.length}\n${qs.join('\n')}`;

    return [
        // ================================================================ KROK 1 · pierwsza tablica
        {
            id: 'tab-piec-od-tylu', krok: 1, level: 'latwe',
            title: 'Pięć liczb od tyłu',
            short: 'Wczytaj dokładnie pięć liczb do tablicy i wypisz je w odwrotnej kolejności.',
            tags: ['int t[5]', 'indeksy od 0', 'od tyłu'],
            statement: ['Wczytaj pięć liczb całkowitych do tablicy int t[5], a potem wypisz je w jednym wierszu w odwrotnej kolejności — od ostatniej do pierwszej, oddzielone spacjami.'],
            input_format: ['Jeden wiersz z pięcioma liczbami całkowitymi.'],
            output_format: ['Jeden wiersz: te same liczby od ostatniej do pierwszej.'],
            constraints: ['−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '1 2 3 4 5' }, { input: '10 -3 7 7 0' }],
            hint: R`Wczytaj liczby pętlą: for (int i = 0; i < 5; i++) cin >> t[i];. Wypisuj od t[4] w dół do t[0]: for (int i = 4; i >= 0; i--). Ostatni element tablicy o rozmiarze 5 ma indeks 4, a nie 5.`,
            tests: (r) => ['1 2 3 4 5', '10 -3 7 7 0', '0 0 0 0 0', '1000000000 -1000000000 5 -5 42',
                ...Array.from({ length: 4 }, () => lin(r.arr(5, -1000, 1000))), lin(r.arr(5, -1e9, 1e9))],
            solve: (inp) => nums(inp).slice(0, 5).reverse().join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[5];
    for (int i = 0; i < 5; i++) {
        cin >> t[i];
    }
    for (int i = 4; i >= 0; i--) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-k-ty-element', krok: 1, level: 'latwe',
            title: 'K-ta od początku i od końca',
            short: 'Z dziesięciu liczb wypisz k-tą od początku i k-tą od końca.',
            tags: ['t[k - 1]', 'numeracja od 1', 'od końca'],
            statement: ['Wczytaj dziesięć liczb całkowitych, a potem liczbę k. Wypisz w jednym wierszu dwie liczby: k-tą liczbę od początku i k-tą liczbę od końca. Liczby numerujemy od 1: pierwsza od początku to ta wczytana jako pierwsza, a pierwsza od końca — ta wczytana jako ostatnia.'],
            input_format: ['W pierwszym wierszu dziesięć liczb całkowitych.', 'W drugim wierszu liczba k.'],
            output_format: ['Dwie liczby oddzielone spacją: k-ta od początku i k-ta od końca.'],
            constraints: ['1 ≤ k ≤ 10', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '5 8 1 9 3 7 2 6 4 0\n3', note: 'Trzecia od początku to 1 (pudełko t[2]), a trzecia od końca to 2 (pudełko t[7]).' }],
            hint: R`k-ta od początku leży w pudełku k - 1. Ostatnia liczba (pierwsza od końca) leży w pudełku 9, przedostatnia w pudełku 8 — czyli k-ta od końca w pudełku 10 - k. Sprawdź oba wzory dla k = 1 i k = 10.`,
            check: (inp) => { const k = nums(inp)[10]; return k >= 1 && k <= 10 ? null : 'k poza zakresem'; },
            tests: (r) => {
                const t = () => lin(r.arr(10, -1e6, 1e6));
                return ['5 8 1 9 3 7 2 6 4 0\n3', `${t()}\n1`, `${t()}\n10`, '1 2 3 4 5 6 7 8 9 10\n5', '1 2 3 4 5 6 7 8 9 10\n6',
                    `${t()}\n${r.int(1, 10)}`, `${t()}\n${r.int(1, 10)}`, `${lin(r.arr(10, 0, 9))}\n${r.int(1, 10)}`];
            },
            solve: (inp) => { const v = nums(inp); const t = v.slice(0, 10), k = v[10]; return `${t[k - 1]} ${t[10 - k]}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[10];
    for (int i = 0; i < 10; i++) {
        cin >> t[i];
    }
    int k;
    cin >> k;
    cout << t[k - 1] << " " << t[10 - k] << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-pierwszy-srodkowy-ostatni', krok: 1, level: 'latwe',
            title: 'Pierwsza, środkowa, ostatnia',
            short: 'Wczytaj nieparzyście wiele liczb i wypisz pierwszą, środkową i ostatnią.',
            tags: ['t[0]', 't[n / 2]', 't[n - 1]'],
            statement: ['Wczytaj nieparzystą liczbę n, a potem n liczb całkowitych. Wypisz w jednym wierszu trzy liczby: pierwszą, środkową i ostatnią. Środkowa to ta, przed którą i za którą stoi tyle samo liczb.'],
            input_format: ['W pierwszym wierszu nieparzysta liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy liczby oddzielone spacjami: pierwsza, środkowa i ostatnia.'],
            constraints: ['1 ≤ n ≤ 99, n jest nieparzyste', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [
                { input: '5\n4 8 15 16 23', note: 'Środkowa jest 15: przed nią stoją dwie liczby i za nią dwie. Leży w pudełku 2, czyli 5 / 2.' },
                { input: '1\n7', note: 'Gdy liczba jest tylko jedna, jest naraz pierwsza, środkowa i ostatnia.' },
            ],
            hint: R`Pierwsza to t[0], ostatnia t[n - 1]. Dla n = 5 środkowa leży w pudełku 2, dla n = 7 — w pudełku 3: to zawsze n / 2 (dzielenie całkowite). Zrób tablicę z zapasem, np. int t[100];.`,
            check: (inp) => { const v = nums(inp); return v[0] % 2 === 1 && v[0] <= 99 && v.length === v[0] + 1 ? null : 'złe n'; },
            tests: (r) => ['5\n4 8 15 16 23', '1\n7', '3\n-1 0 1', '7\n1 2 3 4 5 6 7', arrIn(r.arr(99, -1e9, 1e9)),
                arrIn(r.arr(2 * r.int(1, 20) + 1, -100, 100)), arrIn(r.arr(2 * r.int(20, 49) + 1, 0, 1000))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1); return `${t[0]} ${t[Math.floor(n / 2)]} ${t[n - 1]}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    cout << t[0] << " " << t[n / 2] << " " << t[n - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-dyzury', krok: 1, level: 'latwe',
            title: 'Grafik dyżurów',
            short: 'Imiona dyżurnych od poniedziałku do niedzieli są w tablicy. Kto ma dyżur w dniu numer d?',
            tags: ['string dyzur[7]', 'tablica-ściąga', 'd - 1'],
            statement: ['W klasie ustalono grafik dyżurów na cały tydzień: w poniedziałek dyżur ma jedna osoba, we wtorek druga i tak dalej, aż do niedzieli. W pierwszym wierszu wejścia jest siedem imion — kolejno dyżurni od poniedziałku (dzień 1) do niedzieli (dzień 7). Potem jest liczba q i q numerów dni. Dla każdego numeru wypisz w osobnym wierszu imię dyżurnego.'],
            input_format: ['W pierwszym wierszu siedem imion.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q numerów dni (od 1 do 7).'],
            output_format: ['q wierszy z imionami dyżurnych.'],
            constraints: ['1 ≤ q ≤ 100', 'Imiona mają od 1 do 20 liter, bez spacji.'],
            examples: [{ input: 'Ola Jan Ewa Igor Zosia Adam Basia\n3\n1 7 3', note: 'Dzień 1 to pudełko 0 (Ola), dzień 7 — pudełko 6 (Basia).' }],
            hint: R`Wczytaj imiona do tablicy string dyzur[7] pętlą od 0 do 6. Dzień numer d leży w pudełku d - 1, więc wypisujesz dyzur[d - 1].`,
            tests: (r) => {
                const im = () => lin(r.shuffle(IMIONA).slice(0, 7));
                const qs = (q) => Array.from({ length: q }, () => r.int(1, 7));
                return ['Ola Jan Ewa Igor Zosia Adam Basia\n3\n1 7 3', `${im()}\n7\n1 2 3 4 5 6 7`, `${im()}\n7\n7 6 5 4 3 2 1`,
                    `${im()}\n1\n4`, 'A B C D E F G\n5\n2 2 2 2 2', `${im()}\n100\n${lin(qs(100))}`, `${im()}\n20\n${lin(qs(20))}`];
            },
            solve: (inp) => { const t = toks(inp); const d = t.slice(0, 7), q = Number(t[7]); return t.slice(8, 8 + q).map((x) => d[Number(x) - 1]).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string dyzur[7];
    for (int i = 0; i < 7; i++) {
        cin >> dyzur[i];
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int d;
        cin >> d;
        cout << dyzur[d - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-punkty-f1', krok: 1, level: 'latwe',
            title: 'Punkty w Formule 1',
            short: 'Za miejsca 1–10 są punkty z tablicy, za dalsze — zero. Policz punkty kierowcy za cały sezon.',
            tags: ['int pkt[10]', 'tablica-ściąga', 'sprawdź indeks'],
            statement: ['W wyścigu Formuły 1 punkty dostaje pierwszych dziesięciu kierowców: za 1. miejsce 25 punktów, a za kolejne miejsca 18, 15, 12, 10, 8, 6, 4, 2 i 1. Od 11. miejsca w dół punktów nie ma. Wczytaj liczbę wyścigów n i miejsca, które kierowca zajął w kolejnych wyścigach. Wypisz, ile punktów zdobył w sumie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — miejsca w kolejnych wyścigach.'],
            output_format: ['Jedna liczba — suma punktów.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każde miejsce ≤ 20'],
            examples: [{ input: '4\n1 3 12 10', note: '25 + 15 + 0 + 1 = 41.' }],
            hint: R`Punkty zapisz w tablicy int pkt[10] = {25, 18, 15, 12, 10, 8, 6, 4, 2, 1};. Za miejsce m dostajesz pkt[m - 1] — ale tylko wtedy, gdy m <= 10. Bez tego sprawdzenia dla m = 12 sięgniesz po pudełko pkt[11], którego nie ma!`,
            tests: (r) => ['4\n1 3 12 10', arrIn(Array(100).fill(1)), arrIn([11, 12, 15, 20, 19]),
                arrIn(Array.from({ length: 20 }, (_, i) => i + 1)), '1\n10', '1\n11', arrIn(r.arr(100, 1, 20)), arrIn(r.arr(30, 1, 12))],
            solve: (inp) => { const v = nums(inp); let s = 0; for (const m of v.slice(1, 1 + v[0])) if (m <= 10) s += F1[m - 1]; return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int pkt[10] = {25, 18, 15, 12, 10, 8, 6, 4, 2, 1};
    int n;
    cin >> n;
    int suma = 0;
    for (int i = 0; i < n; i++) {
        int m;
        cin >> m;
        if (m <= 10) {
            suma += pkt[m - 1];
        }
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-chinski-zodiak', krok: 1, level: 'latwe',
            title: 'Chiński zodiak',
            short: 'Zwierzęta chińskiego kalendarza powtarzają się co 12 lat. Dla każdego roku wypisz jego zwierzę.',
            tags: ['string zw[12]', 'tablica-ściąga', '% 12'],
            statement: [
                'W kalendarzu chińskim każdy rok ma swoje zwierzę, a zwierzęta powtarzają się co 12 lat w stałej kolejności: szczur, bawol, tygrys, krolik, smok, waz, kon, koza, malpa, kogut, pies, swinia.',
                'Rok 2020 był rokiem szczura, 2021 — bawołu, 2024 — smoka, a 2032 znów będzie rokiem szczura. Dla każdego z q lat wypisz jego zwierzę — małymi literami i bez polskich znaków, dokładnie jak w nazwach powyżej.',
            ],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q lat.'],
            output_format: ['q wierszy z nazwami zwierząt.'],
            constraints: ['1 ≤ q ≤ 100', '1 ≤ każdy rok ≤ 10 000'],
            examples: [{ input: '4\n2020 2024 2026 1999', note: '2026 to rok konia, a 1999 — królika.' }],
            hint: R`Zwierzęta zapisz w tablicy string zw[12] w podanej kolejności. Rok 2020 to pudełko 0, 2021 — pudełko 1 i tak dalej, w kółko co 12. Potrzebujesz reszty z dzielenia przez 12, ale przesuniętej tak, żeby dla 2020 wyszło 0: dodaj do roku taką liczbę, żeby 2020 + ta liczba dzieliło się przez 12.`,
            tests: (r) => ['4\n2020 2024 2026 1999', arrIn(Array.from({ length: 12 }, (_, i) => 2020 + i)), arrIn(Array.from({ length: 12 }, (_, i) => i + 1)),
                '3\n10000 2032 2008', arrIn(r.arr(100, 1, 10000)), arrIn(r.arr(10, 1900, 2100))],
            solve: (inp) => { const v = nums(inp); return v.slice(1, 1 + v[0]).map((y) => ZODIAK[(y + 8) % 12]).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string zw[12] = {"szczur", "bawol", "tygrys", "krolik", "smok", "waz",
                     "kon", "koza", "malpa", "kogut", "pies", "swinia"};
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int r;
        cin >> r;
        cout << zw[(r + 8) % 12] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-data-slownie', krok: 1, level: 'latwe',
            title: 'Data słownie',
            short: 'Zamień datę DD.MM.RRRR na zapis słowny, na przykład 07.11.2026 na 7 listopada 2026.',
            tags: ['string miesiac[12]', 'separator char', 'm - 1'],
            statement: [
                'Wczytaj datę w formacie DD.MM.RRRR i wypisz ją słownie: dzień bez zera z przodu, nazwę miesiąca w takiej formie, jak mówimy „7 listopada”, i rok.',
                'Nazwy miesięcy pisz małymi literami i bez polskich znaków: stycznia, lutego, marca, kwietnia, maja, czerwca, lipca, sierpnia, wrzesnia, pazdziernika, listopada, grudnia.',
            ],
            input_format: ['Jeden wiersz z datą w formacie DD.MM.RRRR — dzień i miesiąc są zawsze dwucyfrowe.'],
            output_format: ['Dzień, nazwa miesiąca i rok oddzielone spacjami.'],
            constraints: ['Data jest poprawna.', '1000 ≤ RRRR ≤ 9999'],
            examples: [{ input: '07.11.2026' }, { input: '31.12.1999' }],
            hint: R`Z lekcji o wejściu i wyjściu: int d, m, r; char k1, k2; cin >> d >> k1 >> m >> k2 >> r; wczyta liczby, a kropki trafią do k1 i k2. Liczba 07 wczytana do int to po prostu 7. Nazwy miesięcy trzymaj w tablicy string miesiac[12] i wypisz miesiac[m - 1].`,
            check: (inp) => (/^\d\d\.\d\d\.\d{4}$/.test(inp) ? null : 'zły format'),
            tests: (r) => ['07.11.2026', '31.12.1999', '01.01.2000', '29.02.2024', '15.08.1000', '30.09.9999',
                ...Array.from({ length: 6 }, () => `${p2(r.int(1, 28))}.${p2(r.int(1, 12))}.${r.int(1000, 9999)}`)],
            solve: (inp) => { const m = inp.match(/^(\d\d)\.(\d\d)\.(\d{4})$/); return `${Number(m[1])} ${MIES[Number(m[2]) - 1]} ${m[3]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string miesiac[12] = {"stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca",
                          "sierpnia", "wrzesnia", "pazdziernika", "listopada", "grudnia"};
    int d, m, r;
    char k1, k2;
    cin >> d >> k1 >> m >> k2 >> r;
    cout << d << " " << miesiac[m - 1] << " " << r << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-cennik', krok: 1, level: 'srednie',
            title: 'Cennik w sklepiku',
            short: 'Ceny pięciu produktów są w tablicy. Policz koszt zakupów i wypisz go w złotych i groszach.',
            tags: ['tablica-ściąga', 'cena[p - 1]', 'grosze', 'setw i setfill'],
            statement: ['Sklepik szkolny sprzedaje pięć produktów ponumerowanych od 1 do 5. W pierwszym wierszu wejścia są ich ceny w groszach. Potem jest liczba k i numery k kupionych produktów — ten sam produkt może być kupiony kilka razy. Wypisz łączną kwotę w złotych w postaci ZŁ.GR, z dokładnie dwiema cyframi groszy, na przykład 12.05.'],
            input_format: ['W pierwszym wierszu pięć liczb: ceny produktów 1–5 w groszach.', 'W drugim wierszu liczba k.', 'W trzecim wierszu k numerów produktów (od 1 do 5).'],
            output_format: ['Łączna kwota w postaci ZŁ.GR.'],
            constraints: ['1 ≤ cena ≤ 100 000', '1 ≤ k ≤ 1000'],
            examples: [
                { input: '250 199 1000 75 330\n4\n1 4 4 2', note: '250 + 75 + 75 + 199 = 599 groszy, czyli 5.99 zł.' },
                { input: '1 2 3 4 5\n2\n1 1', note: '2 grosze to 0.02 zł.' },
            ],
            hint: R`Ceny wczytaj do tablicy int cena[5]. Dla każdego numeru p dodaj cena[p - 1] do sumy. Na koniec złote to suma / 100, a grosze to suma % 100 — wypisane z setw(2) i setfill('0') (biblioteka iomanip), żeby 5 groszy wyszło jako 05.`,
            tests: (r) => ['250 199 1000 75 330\n4\n1 4 4 2', '1 2 3 4 5\n2\n1 1', '100 200 300 400 500\n1\n3', '100000 100000 100000 100000 100000\n1000\n' + lin(r.arr(1000, 1, 5)),
                `${lin(r.arr(5, 1, 999))}\n5\n1 2 3 4 5`, `${lin(r.arr(5, 1, 100000))}\n${50}\n${lin(r.arr(50, 1, 5))}`, '105 1 1 1 1\n1\n1'],
            solve: (inp) => { const v = nums(inp); const c = v.slice(0, 5), k = v[5]; let s = 0; for (const p of v.slice(6, 6 + k)) s += c[p - 1]; return `${Math.floor(s / 100)}.${p2(s % 100)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int cena[5];
    for (int i = 0; i < 5; i++) {
        cin >> cena[i];
    }
    int k;
    cin >> k;
    long long suma = 0;
    for (int j = 0; j < k; j++) {
        int p;
        cin >> p;
        suma += cena[p - 1];
    }
    cout << suma / 100 << "." << setw(2) << setfill('0') << suma % 100 << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · tablica i pętla
        {
            id: 'tab-tam-i-z-powrotem', krok: 2, level: 'latwe',
            title: 'Tam i z powrotem',
            short: 'Wczytaj n liczb i wypisz je dwa razy: najpierw po kolei, potem od tyłu.',
            tags: ['tablica z zapasem', 'i < n', 'od tyłu'],
            statement: ['Wczytaj liczbę n, a potem n liczb całkowitych. W pierwszym wierszu wypisz je w tej samej kolejności, w jakiej je wczytałeś, a w drugim — od ostatniej do pierwszej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze po n liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n10 20 30 40' }],
            hint: R`Zrób tablicę z zapasem, int t[1000];, i trzy pętle: wczytującą (od 0 do n - 1), wypisującą po kolei i wypisującą od tyłu: for (int i = n - 1; i >= 0; i--). Między wierszami wypisz "\n".`,
            tests: (r) => ['4\n10 20 30 40', '1\n7', '2\n-5 5', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(r.int(5, 30), -100, 100)), arrIn(r.arr(500, 0, 9))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]); return `${lin(t)}\n${lin(t.slice().reverse())}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n";
    for (int i = n - 1; i >= 0; i--) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-co-drugi', krok: 2, level: 'latwe',
            title: 'Najpierw co druga',
            short: 'Wypisz liczby z pozycji 1, 3, 5, …, a w drugim wierszu z pozycji 2, 4, 6, …',
            tags: ['i += 2', 'pozycja a indeks', 'dwa przejścia'],
            statement: ['Wczytaj n liczb. W pierwszym wierszu wypisz liczby stojące na pozycjach nieparzystych — pierwszą, trzecią, piątą i tak dalej. W drugim wierszu wypisz liczby z pozycji parzystych — drugą, czwartą, szóstą i tak dalej. Pozycje liczymy od 1, tak jak ludzie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: liczby z pozycji nieparzystych i liczby z pozycji parzystych.'],
            constraints: ['2 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [
                { input: '6\n5 8 2 7 4 1', note: 'Pozycje 1, 3 i 5 to pudełka t[0], t[2] i t[4] — liczby 5, 2 i 4.' },
                { input: '3\n9 9 1' },
            ],
            hint: R`Pozycja p (od 1) to pudełko p - 1. Pozycje nieparzyste 1, 3, 5, … to więc pudełka 0, 2, 4, …: for (int i = 0; i < n; i += 2). Pozycje parzyste to pudełka 1, 3, 5, …: ta sama pętla, ale od i = 1.`,
            tests: (r) => ['6\n5 8 2 7 4 1', '3\n9 9 1', '2\n1 2', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(999, 0, 99)), arrIn(r.arr(r.int(4, 20), -50, 50))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]); return `${lin(t.filter((_, i) => i % 2 === 0))}\n${lin(t.filter((_, i) => i % 2 === 1))}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n; i += 2) {
        cout << t[i] << " ";
    }
    cout << "\n";
    for (int i = 1; i < n; i += 2) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-fragment', krok: 2, level: 'latwe',
            title: 'Fragment listy',
            short: 'Dla każdego pytania a b wypisz liczby od a-tej do b-tej.',
            tags: ['od a - 1 do b - 1', 'pytania', 'pętla w pętli'],
            statement: ['Wczytaj n liczb, a potem q pytań. Każde pytanie to dwie liczby a i b. Dla każdego pytania wypisz w osobnym wierszu liczby od a-tej do b-tej włącznie (liczby numerujemy od 1).'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb.', 'W trzecim wierszu q, a w każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy — wybrane fragmenty.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 100', '1 ≤ a ≤ b ≤ n'],
            examples: [{ input: '6\n5 8 2 7 4 1\n3\n2 4\n1 6\n5 5' }],
            hint: R`Pytanie o liczby od a-tej do b-tej to pudełka od a - 1 do b - 1 włącznie: for (int i = a - 1; i <= b - 1; i++). Liczby wczytujesz raz, a potem w pętli po pytaniach wiele razy korzystasz z tej samej tablicy.`,
            check: (inp) => { const v = nums(inp); const n = v[0], q = v[n + 1]; for (let j = 0; j < q; j++) { const a = v[n + 2 + 2 * j], b = v[n + 3 + 2 * j]; if (!(a >= 1 && a <= b && b <= n)) return 'złe pytanie'; } return null; },
            tests: (r) => {
                const big = r.arr(1000, 0, 99);
                const qs = (n, q, maxLen) => Array.from({ length: q }, () => { const a = r.int(1, n); const b = Math.min(n, a + r.int(0, maxLen - 1)); return `${a} ${b}`; });
                const t2 = r.arr(30, -1000, 1000);
                return ['6\n5 8 2 7 4 1\n3\n2 4\n1 6\n5 5', '1\n42\n1\n1 1', zPytaniami(big, ['1 1000', '1000 1000', '500 520']),
                    zPytaniami(big, qs(1000, 60, 80)), zPytaniami(t2, qs(30, 100, 30))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n), q = v[n + 1]; const o = []; for (let j = 0; j < q; j++) { const a = v[n + 2 + 2 * j], b = v[n + 3 + 2 * j]; o.push(lin(t.slice(a - 1, b))); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int a, b;
        cin >> a >> b;
        for (int i = a - 1; i <= b - 1; i++) {
            cout << t[i] << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-w-nawiasach', krok: 2, level: 'latwe',
            title: 'Lista w nawiasach',
            short: 'Wypisz liczby od tyłu w nawiasach kwadratowych, oddzielone przecinkami: [3, 2, 1].',
            tags: ['separator', 'przecinek przed elementem', 'od tyłu'],
            statement: ['Wczytaj n liczb i wypisz je od ostatniej do pierwszej w postaci listy: w nawiasach kwadratowych, oddzielone przecinkiem i spacją. Po ostatniej liczbie nie ma przecinka. Na przykład dla 1 2 3 wypisz [3, 2, 1].'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz z listą.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1 2 3' }, { input: '1\n42', note: 'Jedna liczba — bez żadnego przecinka.' }],
            hint: R`Pętla idzie od i = n - 1 w dół do 0, więc pierwsza wypisywana liczba to ta z i = n - 1. Przecinek wypisuj przed każdą liczbą oprócz pierwszej wypisywanej: if (i < n - 1) cout << ", ";.`,
            tests: (r) => ['3\n1 2 3', '1\n42', '2\n-1 -2', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(10, 0, 9)), arrIn(r.arr(r.int(2, 50), -500, 500))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]); return `[${t.slice().reverse().join(', ')}]`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    cout << "[";
    for (int i = n - 1; i >= 0; i--) {
        if (i < n - 1) {
            cout << ", ";
        }
        cout << t[i];
    }
    cout << "]\n";
    return 0;
}`,
        },
        {
            id: 'tab-potegi-dwojki', krok: 2, level: 'latwe',
            title: 'Potęgi dwójki z tablicy',
            short: 'Wypełnij tablicę potęgami dwójki, a potem odpowiadaj na pytania: ile to 2 do potęgi k?',
            tags: ['p[i] = p[i - 1] * 2', 'long long', 'przygotuj raz'],
            statement: ['Wypełnij tablicę long long p[63] tak, żeby p[k] było równe 2 do potęgi k: p[0] = 1, a każde kolejne pudełko jest dwa razy większe od poprzedniego. Potem wczytaj q pytań — w każdym jedną liczbę k — i dla każdego wypisz 2 do potęgi k.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb k.'],
            output_format: ['q wierszy — kolejne potęgi dwójki.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ k ≤ 62'],
            examples: [{ input: '4\n0 1 10 62' }],
            hint: R`p[0] = 1; a potem for (int i = 1; i < 63; i++) p[i] = p[i - 1] * 2;. Tablica musi być typu long long — 2 do potęgi 62 to ponad 4 · 10¹⁸, a int mieści tylko około 2 · 10⁹. Na każde pytanie odpowiadasz jednym odczytem: cout << p[k].`,
            tests: (r) => ['4\n0 1 10 62', arrIn(Array.from({ length: 63 }, (_, i) => i)), arrIn(Array.from({ length: 63 }, (_, i) => 62 - i)), '1\n31', '2\n32 30', arrIn(r.arr(1000, 0, 62))],
            solve: (inp) => { const v = nums(inp); return v.slice(1, 1 + v[0]).map((k) => String(2n ** BigInt(k))).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long p[63];
    p[0] = 1;
    for (int i = 1; i < 63; i++) {
        p[i] = p[i - 1] * 2;
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int k;
        cin >> k;
        cout << p[k] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-schody', krok: 2, level: 'srednie',
            title: 'Schody po jednym, dwa, trzy',
            short: 'Na ile sposobów wejdziesz po n stopniach, robiąc kroki o 1, 2 albo 3 stopnie? Tablica z poprzednich wyników.',
            tags: ['s[i] z trzech poprzednich', 'long long', 'jak Fibonacci'],
            statement: [
                'Na schody o n stopniach wchodzimy, przeskakując za każdym razem o 1, 2 albo 3 stopnie. Na ile różnych sposobów można wejść na samą górę? Na przykład na 3 stopnie da się wejść na 4 sposoby: 1+1+1, 1+2, 2+1 i 3.',
                'Podpowiedź z matematyki: ostatni krok na górę był o 1, 2 albo 3 stopnie. Dlatego liczba sposobów dla n stopni to suma liczb sposobów dla n − 1, n − 2 i n − 3 stopni. Przyjmij, że na 0 stopni można wejść na 1 sposób (nic nie robiąc), na 1 stopień — na 1 sposób, a na 2 stopnie — na 2 sposoby (1+1 i 2).',
                'Odpowiedz na q pytań.',
            ],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb n.'],
            output_format: ['q wierszy — liczby sposobów dla kolejnych n.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 70'],
            examples: [{ input: '5\n3 4 5 10 0', note: 's[4] = s[3] + s[2] + s[1] = 4 + 2 + 1 = 7, a s[5] = 7 + 4 + 2 = 13.' }],
            hint: R`Ustaw s[0] = 1, s[1] = 1, s[2] = 2, a potem w pętli od i = 3 do 70: s[i] = s[i - 1] + s[i - 2] + s[i - 3]. Policz całą tablicę raz, przed pytaniami. Wyniki szybko rosną — tablica musi być long long.`,
            tests: (r) => ['5\n3 4 5 10 0', arrIn(Array.from({ length: 71 }, (_, i) => i)), '3\n70 69 1', '1\n2', arrIn(r.arr(1000, 0, 70))],
            solve: (inp) => {
                const v = nums(inp);
                const s = [1n, 1n, 2n];
                for (let i = 3; i <= 70; i++) s.push(s[i - 1] + s[i - 2] + s[i - 3]);
                if (s[70] >= 2n ** 63n) throw new Error('s[70] nie mieści się w long long');
                return v.slice(1, 1 + v[0]).map((n) => String(s[n])).join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long s[71];
    s[0] = 1;
    s[1] = 1;
    s[2] = 2;
    for (int i = 3; i <= 70; i++) {
        s[i] = s[i - 1] + s[i - 2] + s[i - 3];
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int n;
        cin >> n;
        cout << s[n] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-skladanie-paska', krok: 2, level: 'latwe',
            title: 'Składanie paska',
            short: 'Złóż pasek z liczbami na pół — pierwsza na ostatnią, druga na przedostatnią… — i wypisz sumy.',
            tags: ['t[n - 1 - i]', 'i < n / 2', 'środek'],
            statement: ['Na pasku papieru zapisano n liczb. Składamy pasek na pół tak, że pierwsza liczba trafia na ostatnią, druga na przedostatnią i tak dalej. Wypisz w jednym wierszu sumy liczb, które się nałożyły: najpierw pierwszej z ostatnią, potem drugiej z przedostatnią itd. Jeśli n jest nieparzyste, środkowa liczba nie ma pary — wypisz ją na końcu bez zmian.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz z sumami (i ewentualnie środkową liczbą na końcu).'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [
                { input: '6\n1 2 3 4 5 6', note: '1 + 6, 2 + 5 i 3 + 4.' },
                { input: '5\n10 20 30 40 50', note: 'Trzydziestka leży na środku i zostaje sama.' },
            ],
            hint: R`Liczba „i-ta od końca” leży w pudełku n - 1 - i. Pętla for (int i = 0; i < n / 2; i++) wypisuje t[i] + t[n - 1 - i]. Jeśli n % 2 == 1, dopisz na końcu t[n / 2].`,
            tests: (r) => ['6\n1 2 3 4 5 6', '5\n10 20 30 40 50', '1\n-7', '2\n5 -5', arrIn(r.arr(1000, -1e6, 1e6)), arrIn(r.arr(999, -1e6, 1e6)), arrIn(r.arr(r.int(3, 15), 0, 9))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); const o = []; for (let i = 0; i < Math.floor(n / 2); i++) o.push(t[i] + t[n - 1 - i]); if (n % 2) o.push(t[Math.floor(n / 2)]); return lin(o); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n / 2; i++) {
        cout << t[i] + t[n - 1 - i] << " ";
    }
    if (n % 2 == 1) {
        cout << t[n / 2];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-skoki', krok: 2, level: 'srednie',
            title: 'Skoki po tablicy',
            short: 'Każda liczba mówi, na którą pozycję skoczyć. Zacznij od pierwszej i wypisz pozycje po kolejnych skokach.',
            tags: ['indeks z pudełka', 'numeracja od 1', 'poz = t[poz]'],
            statement: ['W tablicy jest n liczb, a każda z nich jest numerem pozycji od 1 do n. Pionek stoi na pozycji 1. W jednym skoku pionek odczytuje liczbę zapisaną na swojej pozycji i przeskakuje na pozycję o tym numerze. Wypisz w jednym wierszu numery pozycji, na których pionek wylądował po każdym z k skoków.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb od 1 do n.'],
            output_format: ['k liczb — pozycje po kolejnych skokach.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 1000'],
            examples: [{ input: '5 4\n3 1 4 5 2', note: 'Z pozycji 1 skok na 3, z 3 na 4, z 4 na 5, a z 5 na 2.' }],
            hint: R`Najwygodniej numerować pudełka od 1: zrób int t[1001]; i wczytuj do t[1] … t[n]. Wtedy skok to po prostu poz = t[poz];. Jeśli wolisz pudełka od 0, skok to poz = t[poz - 1];.`,
            tests: (r) => {
                const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                return ['5 4\n3 1 4 5 2', '1 3\n1', '3 5\n2 3 1', `1000 1000\n${lin(perm(1000))}`, `1000 1000\n${lin(r.arr(1000, 1, 1000))}`,
                    `20 50\n${lin(r.arr(20, 1, 20))}`, `7 10\n${lin(perm(7))}`];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], k = v[1], t = v.slice(2, 2 + n); let p = 1; const o = []; for (let s = 0; s < k; s++) { p = t[p - 1]; o.push(p); } return lin(o); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1001];
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        cin >> t[i];
    }
    int poz = 1;
    for (int s = 0; s < k; s++) {
        poz = t[poz];
        cout << poz << " ";
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · przeglądanie
        {
            id: 'tab-powyzej-sredniej', krok: 3, level: 'latwe',
            title: 'Lepsze od średniej',
            short: 'Ile liczb jest większych od średniej? Wypisz ich liczbę i je same.',
            tags: ['dwa przejścia', 'średnia', 't[i] * n > suma'],
            statement: ['Wczytaj n liczb całkowitych i policz ich średnią. W pierwszym wierszu wypisz, ile liczb jest od niej większych (ściśle większych), a w drugim — te liczby w kolejności z wejścia. Jeśli żadna liczba nie jest większa od średniej, drugi wiersz zostaw pusty.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu liczba, w drugim — liczby większe od średniej.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [
                { input: '5\n4 8 15 16 23', note: 'Średnia to 13,2 — większe od niej są 15, 16 i 23.' },
                { input: '4\n5 5 5 5', note: 'Średnia to 5 i żadna piątka nie jest od niej większa.' },
            ],
            hint: R`Pierwsze przejście liczy sumę (w long long), drugie porównuje każdą liczbę ze średnią. Możesz policzyć double sr = (double)suma / n; albo obejść się bez ułamków i sprawdzać t[i] * n > suma — wtedy mnóż w long long: (long long)t[i] * n.`,
            tests: (r) => ['5\n4 8 15 16 23', '4\n5 5 5 5', '1\n-3', '3\n-1 0 1', '2\n1000000 -1000000', arrIn(r.arr(1000, -1e6, 1e6)), arrIn(r.arr(999, 0, 3)), arrIn(r.arr(r.int(5, 30), -20, 20))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); const s = t.reduce((a, b) => a + b, 0); const w = t.filter((x) => x * n > s); return `${w.length}\n${lin(w)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
        suma += t[i];
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        if ((long long)t[i] * n > suma) {
            ile++;
        }
    }
    cout << ile << "\n";
    for (int i = 0; i < n; i++) {
        if ((long long)t[i] * n > suma) {
            cout << t[i] << " ";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-gdzie-rekordy', krok: 3, level: 'latwe',
            title: 'Gdzie są rekordy?',
            short: 'Wypisz pozycję pierwszej największej i ostatniej najmniejszej liczby.',
            tags: ['indeks maksimum', '> czy >=', 'pozycja od 1'],
            statement: ['Wczytaj n liczb. Wypisz dwie liczby: pozycję, na której po raz pierwszy stoi największa wartość, i pozycję, na której po raz ostatni stoi najmniejsza wartość. Pozycje liczymy od 1.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n4 9 2 9 -1 7 -1', note: 'Największa jest 9 — pierwszy raz na pozycji 2. Najmniejsza jest −1 — ostatni raz na pozycji 7.' }],
            hint: R`Pamiętaj indeksy, nie wartości: gdzieMax = 0 i gdzieMin = 0, a potem pętla od i = 1. Dla pierwszego maksimum warunek t[i] > t[gdzieMax], dla ostatniego minimum t[i] <= t[gdzieMin] — znak równości przesuwa wynik na późniejsze wystąpienia. Na końcu wypisz indeksy powiększone o 1.`,
            tests: (r) => ['7\n4 9 2 9 -1 7 -1', '1\n5', '4\n3 3 3 3', '5\n-5 -4 -3 -2 -1', '5\n5 4 3 2 1', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(1000, 0, 5)), arrIn(r.arr(r.int(5, 20), -3, 3))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); let gM = 0, gm = 0; for (let i = 1; i < n; i++) { if (t[i] > t[gM]) gM = i; if (t[i] <= t[gm]) gm = i; } return `${gM + 1} ${gm + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int gdzieMax = 0, gdzieMin = 0;
    for (int i = 1; i < n; i++) {
        if (t[i] > t[gdzieMax]) {
            gdzieMax = i;
        }
        if (t[i] <= t[gdzieMin]) {
            gdzieMin = i;
        }
    }
    cout << gdzieMax + 1 << " " << gdzieMin + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-szukaj', krok: 3, level: 'latwe',
            title: 'Gdzie jest ta liczba?',
            short: 'Dla każdego pytania x wypisz pozycję pierwszego wystąpienia x albo BRAK.',
            tags: ['szukanie', 'break', '−1 znaczy brak'],
            statement: ['Wczytaj n liczb, a potem q pytań. W każdym pytaniu jest jedna liczba x. Dla każdego pytania wypisz w osobnym wierszu pozycję (od 1), na której x stoi po raz pierwszy, albo słowo BRAK, jeśli x nie ma wśród liczb.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb.', 'W trzecim wierszu q, w czwartym q liczb x.'],
            output_format: ['q wierszy — pozycja albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 1000', '−10⁹ ≤ wszystkie liczby ≤ 10⁹'],
            examples: [{ input: '6\n5 3 8 3 9 1\n3\n3 7 1' }],
            hint: R`Dla każdego pytania ustaw gdzie = -1 i przejdź po tablicy. Przy pierwszym t[i] == x zapisz gdzie = i i przerwij pętlę przez break. Jeśli po pętli gdzie wciąż jest -1, wypisz BRAK, a w przeciwnym razie gdzie + 1.`,
            tests: (r) => {
                const t = r.arr(1000, 1, 2000);
                const t2 = r.arr(50, -10, 10);
                return ['6\n5 3 8 3 9 1\n3\n3 7 1', '1\n0\n2\n0 1', `${arrIn(t)}\n${arrIn(r.arr(1000, 1, 2000))}`, `${arrIn(t2)}\n${arrIn(r.arr(40, -12, 12))}`,
                    `${arrIn(r.arr(1000, -1e9, 1e9))}\n5\n1 2 3 4 5`];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n), q = v[n + 1]; return v.slice(n + 2, n + 2 + q).map((x) => { const g = t.indexOf(x); return g < 0 ? 'BRAK' : String(g + 1); }).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int x;
        cin >> x;
        int gdzie = -1;
        for (int i = 0; i < n; i++) {
            if (t[i] == x) {
                gdzie = i;
                break;
            }
        }
        if (gdzie == -1) {
            cout << "BRAK\n";
        } else {
            cout << gdzie + 1 << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'tab-wszystkie-rozne', krok: 3, level: 'latwe',
            title: 'Bez powtórzeń?',
            short: 'Sprawdź, czy wszystkie liczby są różne — porównaj każdą parę. Jeśli nie, wskaż pierwszą parę równych.',
            tags: ['pary i < j', 'flaga bool', 'TAK / NIE'],
            statement: ['Wczytaj n liczb i wypisz TAK, jeśli wszystkie są różne, albo NIE, jeśli któraś wartość się powtarza. W drugim przypadku wypisz w drugim wierszu pozycje (od 1) pierwszej znalezionej pary równych liczb: i oraz j, gdzie i < j. Szukaj w kolejności: najpierw najmniejsze i, a przy nim najmniejsze j.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['TAK albo NIE, a przy NIE w drugim wierszu dwie pozycje.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [
                { input: '5\n4 1 7 3 9' },
                { input: '6\n5 2 8 2 5 1', note: 'Pierwsza para w kolejności sprawdzania to pozycje 1 i 5 (dwie piątki) — para dwójek (2, 4) ma większe i.' },
            ],
            hint: R`Dwie pętle: for (int i = 0; i < n; i++) i w niej for (int j = i + 1; j < n; j++). Przy pierwszym t[i] == t[j] zapamiętaj i oraz j i ustaw flagę bool znaleziono = true. Żeby zatrzymać obie pętle, dopisz do ich warunków && !znaleziono.`,
            tests: (r) => {
                const rozne = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i * 7 - 3000));
                const zPowt = (n) => { const a = rozne(n); a[r.int(n / 2, n - 1)] = a[r.int(0, n / 2 - 1)]; return a; };
                return ['5\n4 1 7 3 9', '6\n5 2 8 2 5 1', '1\n1', '2\n3 3', arrIn(rozne(1000)), arrIn(zPowt(1000)), arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(30, 1, 40))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (t[i] === t[j]) return `NIE\n${i + 1} ${j + 1}`; return 'TAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    bool znaleziono = false;
    int pi = 0, pj = 0;
    for (int i = 0; i < n && !znaleziono; i++) {
        for (int j = i + 1; j < n && !znaleziono; j++) {
            if (t[i] == t[j]) {
                znaleziono = true;
                pi = i;
                pj = j;
            }
        }
    }
    if (znaleziono) {
        cout << "NIE\n" << pi + 1 << " " << pj + 1 << "\n";
    } else {
        cout << "TAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-czy-rosnacy', krok: 3, level: 'srednie',
            title: 'Jak zmienia się ciąg?',
            short: 'Rozpoznaj, czy ciąg jest rosnący, malejący, stały, czy żaden z nich.',
            tags: ['sąsiedzi', 'i < n - 1', 'flagi bool'],
            statement: ['Wczytaj n liczb. Wypisz ROSNACY, jeśli każda liczba (oprócz pierwszej) jest większa od poprzedniej; MALEJACY — jeśli każda jest mniejsza od poprzedniej; STALY — jeśli wszystkie są równe; a w każdym innym przypadku INNY.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedno słowo: ROSNACY, MALEJACY, STALY albo INNY.'],
            constraints: ['2 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n1 3 7 8' }, { input: '3\n5 5 5' }, { input: '4\n1 2 2 3', note: 'Druga dwójka nie jest większa od pierwszej — to nie jest ciąg rosnący.' }],
            hint: R`Trzy flagi, na start wszystkie true: rosnacy, malejacy, staly. W pętli po parach sąsiadów (i od 0 do n - 2) każda para może zepsuć niektóre flagi: jeśli t[i + 1] <= t[i], ciąg nie jest rosnący; jeśli t[i + 1] >= t[i] — nie jest malejący; jeśli t[i + 1] != t[i] — nie jest stały. Na końcu sprawdź flagi po kolei.`,
            tests: (r) => {
                const ros = (n) => { let x = r.int(-1e6, 0); return Array.from({ length: n }, () => (x += r.int(1, 1000))); };
                return ['4\n1 3 7 8', '3\n5 5 5', '4\n1 2 2 3', '2\n2 1', '2\n7 7', '2\n-1 1', arrIn(ros(1000)), arrIn(ros(1000).reverse()), arrIn(Array(1000).fill(-42)),
                    arrIn((() => { const a = ros(500); a[250] = a[249]; return a; })()), '5\n3 2 1 2 3', arrIn(r.arr(20, 1, 5))];
            },
            solve: (inp) => {
                const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n);
                let ro = true, ma = true, st = true;
                for (let i = 0; i < n - 1; i++) { if (t[i + 1] <= t[i]) ro = false; if (t[i + 1] >= t[i]) ma = false; if (t[i + 1] !== t[i]) st = false; }
                return ro ? 'ROSNACY' : ma ? 'MALEJACY' : st ? 'STALY' : 'INNY';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    bool rosnacy = true, malejacy = true, staly = true;
    for (int i = 0; i < n - 1; i++) {
        if (t[i + 1] <= t[i]) {
            rosnacy = false;
        }
        if (t[i + 1] >= t[i]) {
            malejacy = false;
        }
        if (t[i + 1] != t[i]) {
            staly = false;
        }
    }
    if (rosnacy) {
        cout << "ROSNACY\n";
    } else if (malejacy) {
        cout << "MALEJACY\n";
    } else if (staly) {
        cout << "STALY\n";
    } else {
        cout << "INNY\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-szczyty', krok: 3, level: 'srednie',
            title: 'Szczyty górskie',
            short: 'Znajdź wszystkie szczyty — punkty trasy wyższe od obu sąsiadów.',
            tags: ['t[i - 1], t[i], t[i + 1]', 'brzegi', 'licznik'],
            statement: ['Wysokości kolejnych punktów na trasie to n liczb. Szczyt to punkt, który jest wyższy (ściśle) od obu swoich sąsiadów — od punktu przed nim i od punktu za nim. Pierwszy i ostatni punkt trasy nie są szczytami, bo mają tylko jednego sąsiada. W pierwszym wierszu wypisz liczbę szczytów, a w drugim ich pozycje (od 1) w kolejności rosnącej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wysokości.'],
            output_format: ['W pierwszym wierszu liczba szczytów, w drugim ich pozycje (pusty wiersz, gdy szczytów nie ma).'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ wysokość ≤ 10⁶'],
            examples: [{ input: '8\n1 3 2 5 5 4 6 1', note: 'Szczyty są na pozycjach 2 (3 > 1 i 3 > 2) oraz 7 (6 > 4 i 6 > 1). Dwie piątki nie są szczytami — żadna nie jest wyższa od sąsiadki.' }],
            hint: R`Sprawdzaj tylko punkty od i = 1 do i = n - 2 — wtedy t[i - 1] i t[i + 1] zawsze istnieją. Warunek szczytu: t[i] > t[i - 1] && t[i] > t[i + 1]. Pozycje zbierz w drugiej pętli albo w osobnej tablicy.`,
            tests: (r) => ['8\n1 3 2 5 5 4 6 1', '1\n5', '2\n1 9', '3\n1 2 1', '5\n5 4 3 2 1', '7\n1 3 1 3 1 3 1', arrIn(r.arr(1000, 0, 1e6)), arrIn(r.arr(1000, 0, 2)), arrIn(r.arr(r.int(5, 25), 0, 9))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); const o = []; for (let i = 1; i < n - 1; i++) if (t[i] > t[i - 1] && t[i] > t[i + 1]) o.push(i + 1); return `${o.length}\n${lin(o)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int ile = 0;
    for (int i = 1; i < n - 1; i++) {
        if (t[i] > t[i - 1] && t[i] > t[i + 1]) {
            ile++;
        }
    }
    cout << ile << "\n";
    for (int i = 1; i < n - 1; i++) {
        if (t[i] > t[i - 1] && t[i] > t[i + 1]) {
            cout << i + 1 << " ";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-najwiekszy-skok', krok: 3, level: 'srednie',
            title: 'Największy skok temperatury',
            short: 'Znajdź dwa kolejne dni z największą zmianą temperatury — w górę albo w dół.',
            tags: ['sąsiedzi', 'wartość bezwzględna', 'maksimum z pozycją'],
            statement: ['Wczytaj temperatury z n kolejnych dni. Znajdź dwa sąsiednie dni, między którymi temperatura zmieniła się najbardziej — wszystko jedno, czy wzrosła, czy spadła. Wypisz wielkość tej zmiany (liczbę nieujemną) i numer pierwszego z tych dwóch dni (dni numerujemy od 1). Jeśli takich par jest kilka, wybierz najwcześniejszą.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur.'],
            output_format: ['Dwie liczby: wielkość zmiany i numer dnia.'],
            constraints: ['2 ≤ n ≤ 1000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '6\n3 5 -2 0 8 7', note: 'Zmiany to 2, 7, 2, 8 i 1. Największa, 8, jest między dniem 4 a dniem 5.' }],
            hint: R`Dla każdej pary sąsiadów policz d = t[i + 1] - t[i], a jeśli d < 0, zamień je na -d (tak liczyłeś wartość bezwzględną w lekcji o if). Największe d szukaj schematem maksimum z pozycją — znak > zostawi najwcześniejszą parę.`,
            tests: (r) => ['6\n3 5 -2 0 8 7', '2\n5 5', '2\n-50 50', '4\n10 0 10 0', arrIn(r.arr(1000, -50, 50)), arrIn(r.arr(1000, -5, 5)), arrIn(r.arr(r.int(5, 15), -50, 50))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); let best = -1, g = 0; for (let i = 0; i < n - 1; i++) { const d = Math.abs(t[i + 1] - t[i]); if (d > best) { best = d; g = i; } } return `${best} ${g + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int naj = -1, gdzie = 0;
    for (int i = 0; i < n - 1; i++) {
        int d = t[i + 1] - t[i];
        if (d < 0) {
            d = -d;
        }
        if (d > naj) {
            naj = d;
            gdzie = i;
        }
    }
    cout << naj << " " << gdzie + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-pary-o-sumie', krok: 3, level: 'srednie',
            title: 'Pary o sumie k',
            short: 'Ile jest par liczb stojących na różnych pozycjach, które razem dają k?',
            tags: ['pary i < j', 'licznik', 'long long'],
            statement: ['Wczytaj n liczb i liczbę k. Policz, ile jest par pozycji i < j takich, że liczba z pozycji i plus liczba z pozycji j daje dokładnie k. Każdą parę pozycji liczymy raz.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ wszystkie liczby, także k ≤ 10⁹'],
            examples: [{ input: '5 10\n3 7 5 5 7', note: 'Pary pozycji: (1, 2), (1, 5) i (3, 4).' }],
            hint: R`Dwie pętle: i od 0, j od i + 1. Uwaga na zakres: suma dwóch liczb do 10⁹ może nie zmieścić się w int — porównuj (long long)t[i] + t[j] == k albo trzymaj liczby w long long.`,
            tests: (r) => ['5 10\n3 7 5 5 7', '1 2\n1', '2 2\n1 1', `1000 0\n${lin(Array(1000).fill(0))}`, `1000 2000000000\n${lin(Array(1000).fill(1e9))}`,
                `1000 ${r.int(0, 100)}\n${lin(r.arr(1000, 0, 100))}`, `1000 0\n${lin(r.arr(1000, -1e9, 1e9).map((x, i) => (i % 2 ? x : -x)))}`, `30 ${r.int(-5, 5)}\n${lin(r.arr(30, -5, 5))}`],
            solve: (inp) => { const v = nums(inp); const n = v[0], k = v[1], t = v.slice(2, 2 + n); let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (t[i] + t[j] === k) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long t[1000];
    int n;
    long long k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[i] + t[j] == k) {
                ile++;
            }
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · zmienianie tablicy
        {
            id: 'tab-przytnij', krok: 4, level: 'latwe',
            title: 'Przytnij do skali',
            short: 'Popraw wyniki spoza skali od 0 do 100 i policz, ile było poprawek.',
            tags: ['zmiana każdego elementu', 'if w pętli', 'licznik'],
            statement: ['Automat wpisał wyniki testu w punktach, ale czasem się myli: zdarzają się liczby ujemne i liczby większe od 100. Popraw tablicę: każdy wynik mniejszy od 0 zamień na 0, a każdy większy od 100 — na 100. W pierwszym wierszu wypisz poprawioną tablicę, a w drugim, ile liczb trzeba było zmienić.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['W pierwszym wierszu poprawione wyniki, w drugim liczba poprawek.'],
            constraints: ['1 ≤ n ≤ 1000', '−1000 ≤ wynik ≤ 1000'],
            examples: [{ input: '6\n55 -3 100 120 0 101', note: 'Zmieniają się trzy liczby: −3, 120 i 101. Setka i zero są w skali.' }],
            hint: R`W jednej pętli: if (t[i] < 0) { t[i] = 0; zmiany++; } i drugi if dla t[i] > 100. Potem osobna pętla, która wypisze całą tablicę, i na końcu licznik zmian.`,
            tests: (r) => ['6\n55 -3 100 120 0 101', '1\n50', '3\n-1000 1000 0', arrIn(r.arr(1000, -1000, 1000)), arrIn(r.arr(500, 0, 100)), arrIn(r.arr(r.int(5, 30), -150, 250))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]); let z = 0; const o = t.map((x) => { if (x < 0) { z++; return 0; } if (x > 100) { z++; return 100; } return x; }); return `${lin(o)}\n${z}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int zmiany = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] < 0) {
            t[i] = 0;
            zmiany++;
        }
        if (t[i] > 100) {
            t[i] = 100;
            zmiany++;
        }
    }
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n" << zmiany << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-zamien-min-max', krok: 4, level: 'latwe',
            title: 'Zamień najmniejszą z największą',
            short: 'Znajdź pierwszą największą i pierwszą najmniejszą liczbę i zamień je miejscami.',
            tags: ['indeks maksimum', 'indeks minimum', 'swap'],
            statement: ['Wczytaj n liczb. Znajdź pozycję pierwszego wystąpienia największej liczby i pozycję pierwszego wystąpienia najmniejszej liczby, zamień te dwie liczby miejscami i wypisz całą tablicę. Jeśli wszystkie liczby są równe, tablica się nie zmieni.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Tablica po zamianie.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n4 9 2 9 1 1', note: 'Pierwsza dziewiątka (pozycja 2) zamienia się z pierwszą jedynką (pozycja 5).' }],
            hint: R`Najpierw znajdź oba indeksy: gdzieMax i gdzieMin (start od 0, pętla od 1, znaki > i <). Dopiero potem jedna zamiana: swap(t[gdzieMax], t[gdzieMin]);.`,
            tests: (r) => ['6\n4 9 2 9 1 1', '1\n3', '3\n7 7 7', '2\n1 2', '5\n5 4 3 2 1', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(1000, 0, 3)), arrIn(r.arr(r.int(4, 20), -9, 9))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); let gM = 0, gm = 0; for (let i = 1; i < n; i++) { if (t[i] > t[gM]) gM = i; if (t[i] < t[gm]) gm = i; } [t[gM], t[gm]] = [t[gm], t[gM]]; return lin(t); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int gdzieMax = 0, gdzieMin = 0;
    for (int i = 1; i < n; i++) {
        if (t[i] > t[gdzieMax]) {
            gdzieMax = i;
        }
        if (t[i] < t[gdzieMin]) {
            gdzieMin = i;
        }
    }
    swap(t[gdzieMax], t[gdzieMin]);
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-krok-w-bok', krok: 4, level: 'latwe',
            title: 'Krok w lewo, krok w prawo',
            short: 'Przesuń tablicę w kółko o jedno miejsce w lewo, a potem oryginał o jedno w prawo.',
            tags: ['przesuwanie w kółko', 'zapamiętaj skrajny', 'kolejność pętli'],
            statement: ['Wczytaj n liczb. W pierwszym wierszu wypisz tablicę przesuniętą w kółko o jedno miejsce w lewo — pierwsza liczba trafia na koniec. W drugim wierszu wypisz pierwotną tablicę przesuniętą w kółko o jedno miejsce w prawo — ostatnia liczba trafia na początek.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwa wiersze: przesunięcie w lewo i przesunięcie w prawo.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 2 3 4 5' }],
            hint: R`Uważaj, żeby drugie przesunięcie zrobić na pierwotnej tablicy! Najprościej skopiuj ją pętlą do drugiej tablicy i każdą przesuń osobno. W lewo: zapamiętaj t[0], przesuń od lewej (t[i] = t[i + 1]) i wpisz zapamiętaną liczbę na koniec. W prawo: zapamiętaj ostatnią i przesuwaj od końca (t[i] = t[i - 1]).`,
            tests: (r) => ['5\n1 2 3 4 5', '1\n9', '2\n1 2', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(r.int(3, 20), 0, 50))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); return `${lin(t.slice(1).concat(t[0]))}\n${lin([t[n - 1]].concat(t.slice(0, n - 1)))}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a[1000], b[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        b[i] = a[i];
    }
    int pierwszy = a[0];
    for (int i = 0; i < n - 1; i++) {
        a[i] = a[i + 1];
    }
    a[n - 1] = pierwszy;
    int ostatni = b[n - 1];
    for (int i = n - 1; i > 0; i--) {
        b[i] = b[i - 1];
    }
    b[0] = ostatni;
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
    cout << "\n";
    for (int i = 0; i < n; i++) {
        cout << b[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-obrot-w-lewo-o-k', krok: 4, level: 'srednie',
            title: 'Karuzela w lewo',
            short: 'Przesuń tablicę w kółko o k miejsc w lewo — a k może być ogromne.',
            tags: ['k % n', 'zawijanie', 't[(i + k) % n]'],
            statement: ['Wczytaj n liczb i liczbę k. Przesuń tablicę w kółko o k miejsc w lewo: każdy element przesuwa się o k pozycji w stronę początku, a elementy, które „wypadają” z początku, wracają na koniec. Wypisz wynik.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Tablica po przesunięciu.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k ≤ 10⁹', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [
                { input: '5 2\n1 2 3 4 5' },
                { input: '3 1000000000\n7 8 9', note: '10⁹ = 3 · 333333333 + 1, więc to tak, jakby przesunąć o 1.' },
            ],
            hint: R`Pełne obroty niczego nie zmieniają, więc zacznij od k = k % n. Po przesunięciu w lewo o k na pozycji i stoi element, który był k miejsc dalej: w[i] = t[(i + k) % n]. Możesz też niczego nie przestawiać, tylko od razu wypisać t[(i + k) % n] dla i od 0 do n - 1.`,
            tests: (r) => ['5 2\n1 2 3 4 5', '3 1000000000\n7 8 9', '1 5\n42', '4 0\n1 2 3 4', '4 4\n1 2 3 4', `1000 ${r.int(0, 1e9)}\n${lin(r.arr(1000, -1e9, 1e9))}`,
                `1000 999\n${lin(r.arr(1000, 0, 9))}`, (() => { const n = r.int(5, 30); return `${n} ${r.int(0, 100)}\n${lin(r.arr(n, 0, 50))}`; })()],
            check: (inp) => { const v = nums(inp); return v.length === v[0] + 2 ? null : 'zła liczba liczb'; },
            solve: (inp) => { const v = nums(inp); const n = v[0], k = v[1] % n, t = v.slice(2, 2 + n); return lin(t.map((_, i) => t[(i + k) % n])); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    k = k % n;
    for (int i = 0; i < n; i++) {
        cout << t[(i + k) % n] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-odwroc-fragment', krok: 4, level: 'srednie',
            title: 'Odwróć fragment',
            short: 'Wykonaj q odwróceń fragmentów od a-tego do b-tego elementu i wypisz tablicę.',
            tags: ['dwa indeksy l i r', 'swap', 'while (l < r)'],
            statement: ['Wczytaj n liczb, a potem q poleceń. Każde polecenie to dwie liczby a i b: odwróć kolejność elementów od a-tego do b-tego włącznie (pozycje od 1). Polecenia wykonuj po kolei, każde na tablicy zmienionej przez poprzednie. Na koniec wypisz tablicę.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb.', 'W trzecim wierszu q, a w każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['Tablica po wszystkich poleceniach.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 1000', '1 ≤ a ≤ b ≤ n'],
            examples: [{ input: '6\n1 2 3 4 5 6\n2\n2 5\n1 3', note: 'Po pierwszym poleceniu: 1 5 4 3 2 6. Po drugim: 4 5 1 3 2 6.' }],
            hint: R`Dla każdego polecenia ustaw l = a - 1 i r = b - 1 (indeksy od 0), a potem: while (l < r) { swap(t[l], t[r]); l++; r--; }.`,
            check: (inp) => { const v = nums(inp); const n = v[0], q = v[n + 1]; for (let j = 0; j < q; j++) { const a = v[n + 2 + 2 * j], b = v[n + 3 + 2 * j]; if (!(a >= 1 && a <= b && b <= n)) return 'złe polecenie'; } return null; },
            tests: (r) => {
                const qs = (n, q) => Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(1, n); return `${Math.min(a, b)} ${Math.max(a, b)}`; });
                const id = (n) => Array.from({ length: n }, (_, i) => i + 1);
                return ['6\n1 2 3 4 5 6\n2\n2 5\n1 3', '1\n5\n1\n1 1', zPytaniami(id(10), ['1 10']), zPytaniami(id(10), ['1 10', '1 10']),
                    zPytaniami(id(1000), qs(1000, 1000)), zPytaniami(r.arr(30, -99, 99), qs(30, 15))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n), q = v[n + 1]; for (let j = 0; j < q; j++) { let l = v[n + 2 + 2 * j] - 1, rr = v[n + 3 + 2 * j] - 1; while (l < rr) { [t[l], t[rr]] = [t[rr], t[l]]; l++; rr--; } } return lin(t); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int a, b;
        cin >> a >> b;
        int l = a - 1, r = b - 1;
        while (l < r) {
            swap(t[l], t[r]);
            l++;
            r--;
        }
    }
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-zera-na-koniec', krok: 4, level: 'latwe',
            title: 'Zera na koniec',
            short: 'Przenieś wszystkie zera na koniec tablicy, nie zmieniając kolejności pozostałych liczb.',
            tags: ['dwa indeksy', 't[k] = t[i]', 'k++'],
            statement: ['Wczytaj n liczb. Przestaw je tak, żeby wszystkie zera znalazły się na końcu, a pozostałe liczby stały na początku w takiej samej kolejności jak na wejściu. Wypisz wynik.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Tablica z zerami na końcu.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n0 3 0 0 5 1 0 2' }],
            hint: R`Schemat z lekcji: k = 0, a w pętli po i każdą niezerową liczbę przepisz do t[k] i zwiększ k. Po pętli pudełka od k do n - 1 wypełnij zerami — tyle właśnie było zer.`,
            tests: (r) => ['8\n0 3 0 0 5 1 0 2', '1\n0', '1\n7', '4\n0 0 0 0', '4\n1 2 3 4', '5\n-1 0 -2 0 -3', arrIn(r.arr(1000, -2, 2)), arrIn(r.arr(1000, -1e9, 1e9).map((x, i) => (i % 3 ? x : 0))), arrIn(r.arr(r.int(5, 20), 0, 3))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]); const nz = t.filter((x) => x !== 0); return lin(nz.concat(Array(t.length - nz.length).fill(0))); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] != 0) {
            t[k] = t[i];
            k++;
        }
    }
    for (int i = k; i < n; i++) {
        t[i] = 0;
    }
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-wykreslanka', krok: 4, level: 'srednie',
            title: 'Wykreślanka',
            short: 'Wykonaj q usunięć: za każdym razem wykreśl p-ty element obecnej listy.',
            tags: ['usuwanie', 'przesuń w lewo', 'n--'],
            statement: ['Wczytaj n liczb, a potem q poleceń. Każde polecenie to jedna liczba p: usuń z listy element stojący w tej chwili na pozycji p (pozycje od 1). Elementy za nim przesuwają się o jedno miejsce do przodu. Po wykonaniu wszystkich poleceń wypisz, co zostało z listy. Jeśli lista jest pusta, wypisz PUSTA.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb.', 'W trzecim wierszu q, w czwartym q liczb p.'],
            output_format: ['Lista po usunięciach albo PUSTA.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ n', 'p nigdy nie jest większe od obecnej długości listy.'],
            examples: [{ input: '5\n5 6 7 8 9\n2\n2 3', note: 'Po usunięciu 2. elementu zostaje 5 7 8 9. Teraz 3. element to 8 — zostaje 5 7 9.' }],
            hint: R`Trzymaj obecną długość listy w zmiennej n. Usunięcie pozycji p: for (int i = p - 1; i < n - 1; i++) t[i] = t[i + 1]; a potem n--;. Na koniec sprawdź, czy n == 0.`,
            check: (inp) => { const v = nums(inp); let n = v[0]; const q = v[n + 1]; for (const p of v.slice(n + 2, n + 2 + q)) { if (p < 1 || p > n) return 'p poza listą'; n--; } return null; },
            tests: (r) => {
                const usun = (n, q) => { const o = []; let len = n; for (let j = 0; j < q; j++) { o.push(r.int(1, len)); len--; } return o; };
                const mk = (t, ps) => `${arrIn(t)}\n${ps.length}\n${lin(ps)}`;
                return ['5\n5 6 7 8 9\n2\n2 3', mk([4], [1]), mk([1, 2, 3], [3, 2, 1]), mk([1, 2, 3], [1, 1]), mk(r.arr(1000, -1e9, 1e9), usun(1000, 500)),
                    mk(r.arr(1000, 0, 99), usun(1000, 999)), mk(r.arr(20, 1, 9), usun(20, 7))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n), q = v[n + 1]; for (const p of v.slice(n + 2, n + 2 + q)) t.splice(p - 1, 1); return t.length ? lin(t) : 'PUSTA'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int p;
        cin >> p;
        for (int i = p - 1; i < n - 1; i++) {
            t[i] = t[i + 1];
        }
        n--;
    }
    if (n == 0) {
        cout << "PUSTA\n";
    } else {
        for (int i = 0; i < n; i++) {
            cout << t[i] << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-wstawianie', krok: 4, level: 'srednie',
            title: 'Wstawianie do listy',
            short: 'Zacznij od pustej listy i wykonaj q wstawień: liczba x ma stanąć na pozycji p.',
            tags: ['wstawianie', 'w prawo od końca', 'n++'],
            statement: ['Na początku lista jest pusta. Wykonaj q poleceń. Każde polecenie to dwie liczby p i x: wstaw liczbę x tak, żeby stanęła na pozycji p (pozycje od 1), a elementy od dotychczasowej p-tej pozycji dalej przesuwają się o jedno miejsce w prawo. Pozycja p jest zawsze od 1 do obecnej długości listy powiększonej o 1 — największe p oznacza wstawienie na sam koniec. Wypisz listę po wszystkich poleceniach.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby p i x.'],
            output_format: ['Lista po wszystkich wstawieniach.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁹ ≤ x ≤ 10⁹'],
            examples: [{ input: '4\n1 5\n1 3\n3 9\n2 7', note: 'Kolejno: 5, potem 3 5, potem 3 5 9, a na koniec 3 7 5 9.' }],
            hint: R`Zrób tablicę z zapasem (1000 pudełek) i trzymaj obecną długość n, na start 0. Wstawienie: najpierw zrób miejsce — for (int i = n; i > p - 1; i--) t[i] = t[i - 1]; — potem t[p - 1] = x; i n++;. Przesuwasz w prawo, więc idziesz od końca.`,
            check: (inp) => { const v = nums(inp); let len = 0; for (let j = 0; j < v[0]; j++) { const p = v[1 + 2 * j]; if (p < 1 || p > len + 1) return 'zła pozycja'; len++; } return null; },
            tests: (r) => {
                const mk = (q, f) => { const o = []; for (let j = 0; j < q; j++) o.push(`${f(j + 1)} ${r.int(-1e9, 1e9)}`); return `${q}\n${o.join('\n')}`; };
                return ['4\n1 5\n1 3\n3 9\n2 7', '1\n1 -4', '3\n1 1\n2 2\n3 3', '3\n1 1\n1 2\n1 3', mk(1000, (len1) => r.int(1, len1)), mk(1000, () => 1), mk(1000, (len1) => len1), mk(25, (len1) => r.int(1, len1))];
            },
            solve: (inp) => { const v = nums(inp); const t = []; for (let j = 0; j < v[0]; j++) t.splice(v[1 + 2 * j] - 1, 0, v[2 + 2 * j]); return lin(t); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n = 0;
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        int p, x;
        cin >> p >> x;
        for (int i = n; i > p - 1; i--) {
            t[i] = t[i - 1];
        }
        t[p - 1] = x;
        n++;
    }
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
    ];
};
