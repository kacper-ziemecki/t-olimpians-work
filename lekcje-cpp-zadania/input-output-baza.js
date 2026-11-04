// Input / Output — baza zadań na koniec tematu (krok 8).
// Kolejność = kolejność w lekcji i w sprawdzarce: najpierw łatwe, potem średnie, na końcu trudne.
// Każde zadanie łączy kilka zagadnień z lekcji (pole tags). Bez pętli i bez if.
module.exports = (h) => {
    const { reader, nums, toks, lines, join, fx, safe, dec, capital, padL, padR } = h;
    const R = String.raw;
    const K = 8;
    const MALE = 'abcdefghijklmnopqrstuvwxyz';
    const SLOWA = ['ala', 'ma', 'kota', 'bajtek', 'lubi', 'programowac', 'w', 'olimpiada', 'zadanie', 'jest', 'proste',
        'dzisiaj', 'pada', 'deszcz', 'szkola', 'kolo', 'informatyki', 'bity', 'komputer', 'liczy', 'szybko', 'nigdy', 'nie', 'poddawaj', 'sie'];
    const PRZEDMIOTY = ['matematyka', 'polski', 'informatyka', 'fizyka', 'biologia', 'chemia', 'historia', 'angielski', 'wf', 'muzyka'];
    const zdanie = (r, n) => capital(Array.from({ length: n }, () => r.pick(SLOWA)).join(' '));
    const osoba = (r) => `${capital(r.word(r.int(2, 9)))} ${capital(r.word(r.int(3, 12)))}`;
    const z2 = (n) => padL(n, 2, '0');
    const hhmm = (min) => `${z2(Math.floor(min / 60))}:${z2(min % 60)}`;
    const czas = (s) => { const m = s.match(/^(\d+):(\d+)$/); return Number(m[1]) * 60 + Number(m[2]); };
    const losHH = (r) => hhmm(r.int(0, 1439));

    return [
        // ================================================================ łatwe
        {
            id: 'io-bilet', krok: K, level: 'latwe',
            title: 'Bilet kolejowy',
            short: 'Imię i nazwisko w jednym wierszu, wagon i miejsce w drugim — wydrukuj bilet.',
            tags: ['getline', 'cin'],
            statement: ['Na wejściu jest imię i nazwisko pasażera (w jednym wierszu, ze spacją), a w drugim wierszu — numer wagonu i numer miejsca. Wypisz bilet w dwóch wierszach: Pasazer: IMIE NAZWISKO oraz Wagon W, miejsce M.'],
            input_format: ['Pierwszy wiersz: imię i nazwisko. Drugi wiersz: dwie liczby całkowite — wagon i miejsce.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['imię i nazwisko mają razem od 3 do 40 znaków', '1 ≤ wagon ≤ 20', '1 ≤ miejsce ≤ 120'],
            examples: [{ input: 'Jan Kowalski\n5 42' }],
            hint: R`Najpierw getline(cin, pasazer); — zabierze cały pierwszy wiersz razem ze spacją. Potem zwykłe cin >> wagon >> miejsce;. Taka kolejność (getline, potem cin) nie potrzebuje cin.ignore().`,
            tests: (r) => ['Ola Nowak\n1 1', 'Bajtazar Bitowski\n20 120', `${osoba(r)}\n${r.int(1, 20)} ${r.int(1, 120)}`, `${osoba(r)}\n${r.int(1, 20)} ${r.int(1, 120)}`, `${osoba(r)}\n${r.int(1, 20)} ${r.int(1, 120)}`],
            solve: (inp) => { const l = lines(inp.trim()); const [w, m] = toks(l[1]); return join(`Pasazer: ${l[0]}`, `Wagon ${w}, miejsce ${m}`); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string pasazer;
    int wagon, miejsce;
    getline(cin, pasazer);
    cin >> wagon >> miejsce;
    cout << "Pasazer: " << pasazer << "\n";
    cout << "Wagon " << wagon << ", miejsce " << miejsce << "\n";
    return 0;
}`,
        },
        {
            id: 'io-godzina-slownie', krok: K, level: 'latwe',
            title: 'Godzina odjazdu',
            short: 'Godzinę 07:05 zapisz jako „7 godz. 5 min”.',
            tags: ['char jako separator'],
            statement: ['Wczytaj godzinę odjazdu w formacie HH:MM i wypisz ją w postaci: H godz. M min — liczby bez zer na początku, np. 07:05 to 7 godz. 5 min.'],
            input_format: ['W jedynym wierszu godzina w formacie HH:MM.'],
            output_format: ['Jeden wiersz w postaci H godz. M min.'],
            constraints: ['00:00 ≤ godzina ≤ 23:59'],
            examples: [{ input: '07:05' }, { input: '18:30' }],
            hint: R`Wczytaj godzinę, dwukropek (char) i minutę: cin >> h >> c >> m;. Liczby wypisują się bez zer na początku same: cout << h << " godz. " << m << " min\n";`,
            tests: (r) => ['00:00', '23:59', '10:00', losHH(r), losHH(r), losHH(r)],
            solve: (inp) => { const [g, m] = inp.trim().split(':').map(Number); return `${g} godz. ${m} min`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h, m;
    char c;
    cin >> h >> c >> m;
    cout << h << " godz. " << m << " min\n";
    return 0;
}`,
        },
        {
            id: 'io-trzy-temperatury', krok: K, level: 'latwe',
            title: 'Trzy temperatury',
            short: 'Trzy pomiary w trzech wierszach → jeden wiersz z jedną cyfrą po kropce.',
            tags: ['fixed', 'setprecision', 'wiele wierszy'],
            statement: ['Wczytaj trzy temperatury (liczby rzeczywiste, każda w osobnym wierszu) i wypisz je w jednym wierszu, oddzielone napisem " | " (spacja, kreska, spacja), każdą z dokładnością do jednego miejsca po przecinku.'],
            input_format: ['Trzy wiersze, w każdym jedna liczba rzeczywista.'],
            output_format: ['Jeden wiersz, jak w przykładzie.'],
            constraints: ['−50 ≤ temperatura ≤ 50', 'każda ma co najwyżej dwie cyfry po kropce', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '21.46\n19\n-3.21' }],
            hint: R`Raz ustaw cout << fixed << setprecision(1);, a potem: cout << a << " | " << b << " | " << c << "\n";`,
            tests: (r) => {
                const out = [];
                while (out.length < 8) {
                    const v = [dec(r.int(-5000, 5000), 2), dec(r.int(-5000, 5000), 2), dec(r.int(-500, 500), 1)];
                    if (v.every((x) => safe(Number(x), 1))) out.push(v.join('\n'));
                }
                return out;
            },
            solve: (inp) => nums(inp).map((x) => fx(x, 1)).join(' | '),
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double a, b, c;
    cin >> a >> b >> c;
    cout << fixed << setprecision(1);
    cout << a << " | " << b << " | " << c << "\n";
    return 0;
}`,
        },
        {
            id: 'io-kod-pocztowy', krok: K, level: 'latwe',
            title: 'Kod pocztowy',
            short: 'Dwie liczby 2 i 495 → kod pocztowy 02-495.',
            tags: ['setw', 'setfill'],
            statement: ['Polski kod pocztowy ma postać XX-XXX, np. 02-495. Wczytaj dwie liczby całkowite — część przed kreską i część po kresce — i wypisz kod pocztowy, uzupełniając zerami z przodu: pierwszą część do dwóch cyfr, a drugą do trzech.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Kod pocztowy w postaci XX-XXX.'],
            constraints: ['0 ≤ a ≤ 99', '0 ≤ b ≤ 999'],
            examples: [{ input: '2 495' }, { input: '31 7' }],
            hint: R`cout << setfill('0') << setw(2) << a << "-" << setw(3) << b << "\n"; — setw trzeba powtórzyć przed każdą liczbą, a setfill wystarczy ustawić raz.`,
            tests: (r) => ['0 0', '99 999', '10 100', `${r.int(0, 99)} ${r.int(0, 999)}`, `${r.int(0, 9)} ${r.int(0, 99)}`, `${r.int(0, 99)} ${r.int(0, 9)}`],
            solve: (inp) => { const [a, b] = nums(inp); return `${z2(a)}-${padL(b, 3, '0')}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << setfill('0') << setw(2) << a << "-" << setw(3) << b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-cytat', krok: K, level: 'latwe',
            title: 'Cytat',
            short: 'Zdanie w cudzysłowie i autor po myślniku — wypisz cudzysłów z \\".',
            tags: ['getline', R`\"`],
            statement: ['W pierwszym wierszu wejścia jest cytat, a w drugim — jego autor (oba mogą mieć spacje). Wypisz jeden wiersz: cytat w cudzysłowie, spacja, minus, spacja i autor — dokładnie jak w przykładzie.'],
            input_format: ['Dwa wiersze: cytat i autor.'],
            output_format: [R`Jeden wiersz w postaci "CYTAT" - AUTOR.`],
            constraints: ['cytat ma od 1 do 100 znaków, a autor od 1 do 40', 'żaden wiersz nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: 'Nigdy sie nie poddawaj\nBajtek' }],
            hint: R`Oba wiersze wczytaj przez getline. Cudzysłów w tekście zapisujesz jako \": cout << "\"" << cytat << "\" - " << autor << "\n";`,
            tests: (r) => ['Raz\nX', `${zdanie(r, 4)}\n${osoba(r)}`, `${zdanie(r, 9)}\n${capital(r.word(6))}`, `${zdanie(r, 2)}\n${osoba(r)}`],
            solve: (inp) => { const l = lines(inp.trim()); return `"${l[0]}" - ${l[1]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string cytat, autor;
    getline(cin, cytat);
    getline(cin, autor);
    cout << "\"" << cytat << "\" - " << autor << "\n";
    return 0;
}`,
        },
        {
            id: 'io-trzy-inicjaly', krok: K, level: 'latwe',
            title: 'Trzy inicjały',
            short: 'Jan Maria Kowalski → J.M.K. — trzy słowa, trzy pierwsze litery.',
            tags: ['cin', 'string', 's[0]'],
            statement: ['W jedynym wierszu wejścia są trzy słowa: dwa imiona i nazwisko, każde zaczynające się wielką literą. Wypisz inicjały w postaci X.Y.Z. — pierwsze litery słów, każda z kropką, bez spacji.'],
            input_format: ['Jeden wiersz z trzema słowami oddzielonymi spacjami.'],
            output_format: ['Inicjały w postaci X.Y.Z.'],
            constraints: ['każde słowo ma od 1 do 20 liter alfabetu angielskiego'],
            examples: [{ input: 'Jan Maria Kowalski' }],
            hint: R`Tu nie potrzeba getline: trzy słowa wczytasz przez cin >> a >> b >> c;. Inicjał to pierwsza litera: a[0]. Wypisz: cout << a[0] << "." << b[0] << "." << c[0] << ".\n";`,
            tests: (r) => ['A B C', 'Anna Maria Nowak', `${capital(r.word(r.int(1, 20)))} ${capital(r.word(r.int(1, 20)))} ${capital(r.word(r.int(1, 20)))}`, `${capital(r.word(5))} ${capital(r.word(7))} ${capital(r.word(9))}`],
            solve: (inp) => toks(inp).map((w) => `${w[0]}.`).join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b, c;
    cin >> a >> b >> c;
    cout << a[0] << "." << b[0] << "." << c[0] << ".\n";
    return 0;
}`,
        },

        // ================================================================ średnie
        {
            id: 'io-data-iso', krok: K, level: 'srednie',
            title: 'Data w formacie ISO',
            short: 'Przepisz datę 04.11.2026 na 2026-11-04 — z zerami.',
            tags: ['char jako separator', 'setfill'],
            statement: ['W Polsce datę piszemy jako DD.MM.RRRR, a komputery najczęściej jako RRRR-MM-DD (format ISO). Wczytaj datę w pierwszym formacie i wypisz ją w drugim — miesiąc i dzień zawsze dwucyfrowe.'],
            input_format: ['W jedynym wierszu data w formacie DD.MM.RRRR.'],
            output_format: ['Data w formacie RRRR-MM-DD.'],
            constraints: ['01 ≤ DD ≤ 31', '01 ≤ MM ≤ 12', '1000 ≤ RRRR ≤ 9999'],
            examples: [{ input: '04.11.2026' }],
            hint: R`Wczytaj jak w ćwiczeniu z lekcji: cin >> d >> c >> m >> c >> r;. Wypisz z zerami: cout << r << "-" << setfill('0') << setw(2) << m << "-" << setw(2) << d << "\n";`,
            tests: (r) => ['01.01.1000', '31.12.9999', '09.05.2013', `${z2(r.int(1, 31))}.${z2(r.int(1, 12))}.${r.int(1000, 9999)}`, `${z2(r.int(1, 9))}.${z2(r.int(1, 9))}.${r.int(1000, 9999)}`],
            solve: (inp) => { const [d, m, y] = inp.trim().split('.').map(Number); return `${y}-${z2(m)}-${z2(d)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int d, m, r;
    char c;
    cin >> d >> c >> m >> c >> r;
    cout << r << "-" << setfill('0') << setw(2) << m << "-" << setw(2) << d << "\n";
    return 0;
}`,
        },
        {
            id: 'io-napiwek', krok: K, level: 'srednie',
            title: 'Rachunek z napiwkiem',
            short: 'Trzy dania z cenami — suma, napiwek 10% i kwota do zapłaty.',
            tags: ['cin', 'double', 'setprecision(2)'],
            statement: ['Na wejściu są trzy wiersze, w każdym nazwa dania (jedno słowo) i jego cena. Wypisz trzy wiersze: Razem: suma cen, Napiwek: 10% sumy oraz Do zaplaty: suma razem z napiwkiem — wszystkie kwoty z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['Trzy wiersze; w każdym słowo i liczba rzeczywista z dwiema cyframi po kropce.'],
            output_format: ['Trzy wiersze, jak w przykładzie.'],
            constraints: ['nazwa ma od 1 do 20 małych liter', '0.01 ≤ cena ≤ 999.99', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: 'zupa 12.50\npierogi 24.90\nkompot 6.00' }],
            hint: 'Nazwy dań trzeba wczytać, choć nie są potrzebne — inaczej nie dostaniesz się do cen. Napiwek to suma · 0.1, a do zapłaty — suma + napiwek. Raz ustaw fixed i setprecision(2).',
            tests: (r) => {
                const out = [];
                while (out.length < 8) {
                    const c = [r.int(1, 99999), r.int(1, 99999), r.int(1, 99999)].map((k) => dec(k, 2));
                    const s = Number(c[0]) + Number(c[1]) + Number(c[2]);
                    if (safe(s * 0.1, 2) && safe(s + s * 0.1, 2)) out.push(c.map((x) => `${r.word(r.int(1, 20))} ${x}`).join('\n'));
                }
                return out;
            },
            solve: (inp) => { const t = toks(inp); const s = Number(t[1]) + Number(t[3]) + Number(t[5]); const n = s * 0.1; return join(`Razem: ${fx(s, 2)}`, `Napiwek: ${fx(n, 2)}`, `Do zaplaty: ${fx(s + n, 2)}`); },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string d1, d2, d3;
    double c1, c2, c3;
    cin >> d1 >> c1 >> d2 >> c2 >> d3 >> c3;
    double suma = c1 + c2 + c3;
    double napiwek = suma * 0.1;
    cout << fixed << setprecision(2);
    cout << "Razem: " << suma << "\n";
    cout << "Napiwek: " << napiwek << "\n";
    cout << "Do zaplaty: " << suma + napiwek << "\n";
    return 0;
}`,
        },
        {
            id: 'io-stoper', krok: K, level: 'srednie',
            title: 'Stoper',
            short: 'Dwa okrążenia MM:SS — łączny czas w formacie MM:SS.',
            tags: ['char jako separator', '/ i %', 'setfill'],
            statement: ['Biegacz przebiegł dwa okrążenia. Wczytaj czas każdego z nich w formacie MM:SS (minuty i sekundy) i wypisz łączny czas, też w formacie MM:SS — minuty i sekundy zawsze co najmniej dwucyfrowe.'],
            input_format: ['W jedynym wierszu dwa czasy w formacie MM:SS oddzielone spacją.'],
            output_format: ['Łączny czas w formacie MM:SS.'],
            constraints: ['00 ≤ MM ≤ 49', '00 ≤ SS ≤ 59'],
            examples: [{ input: '01:45 02:30', note: '105 s + 150 s = 255 s, czyli 4 minuty i 15 sekund.' }],
            hint: R`Zamień oba czasy na sekundy (MM * 60 + SS) i dodaj. Z sumy s minuty to s / 60, a sekundy s % 60. Wypisz je z setfill('0') i setw(2).`,
            tests: (r) => ['00:00 00:00', '49:59 49:59', '00:30 00:30', '09:59 00:01', `${z2(r.int(0, 49))}:${z2(r.int(0, 59))} ${z2(r.int(0, 49))}:${z2(r.int(0, 59))}`, `${z2(r.int(0, 9))}:${z2(r.int(0, 59))} ${z2(r.int(0, 9))}:${z2(r.int(0, 59))}`],
            solve: (inp) => { const s = toks(inp).map(czas).reduce((a, b) => a + b, 0); return `${z2(Math.floor(s / 60))}:${z2(s % 60)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int m1, s1, m2, s2;
    char c;
    cin >> m1 >> c >> s1 >> m2 >> c >> s2;
    int s = m1 * 60 + s1 + m2 * 60 + s2;
    cout << setfill('0') << setw(2) << s / 60 << ":" << setw(2) << s % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-ulamek-procent', krok: K, level: 'srednie',
            title: 'Ułamek i procent',
            short: 'Ułamek a/b jako liczba z 4 cyframi po kropce i jako procent.',
            tags: ['char jako separator', 'double', 'setprecision'],
            statement: ['Wczytaj ułamek w postaci a/b i wypisz w pierwszym wierszu jego wartość z dokładnością do czterech miejsc po przecinku, a w drugim — ten sam ułamek w procentach, z dokładnością do jednego miejsca po przecinku i ze znakiem % na końcu.'],
            input_format: ['W jedynym wierszu ułamek w postaci a/b, bez spacji.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['0 ≤ a ≤ 1000', '1 ≤ b ≤ 1000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '3/8' }, { input: '1/3' }],
            hint: R`Wartość to (double)a / b, a procent — ta wartość razy 100. Precyzję możesz zmieniać między wierszami: cout << fixed << setprecision(4) << w << "\n" << setprecision(1) << w * 100 << "%\n";`,
            tests: (r) => {
                const out = [];
                for (const s of ['0/1', '1000/1', '1/1000', '7/7']) { const [a, b] = s.split('/').map(Number); if (safe(a / b, 4) && safe(a / b * 100, 1) && safe(100 * a / b, 1)) out.push(s); }
                while (out.length < 10) {
                    const a = r.int(0, 1000), b = r.int(1, 1000);
                    if (safe(a / b, 4) && safe(a / b * 100, 1) && safe(100 * a / b, 1)) out.push(`${a}/${b}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b] = inp.trim().split('/').map(Number); const w = a / b; return join(fx(w, 4), `${fx(w * 100, 1)}%`); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b;
    char c;
    cin >> a >> c >> b;
    double w = (double)a / b;
    cout << fixed << setprecision(4) << w << "\n";
    cout << setprecision(1) << w * 100 << "%\n";
    return 0;
}`,
        },
        {
            id: 'io-uczen-srednia', krok: K, level: 'srednie',
            title: 'Uczeń i jego średnia',
            short: 'Imię i nazwisko w jednym wierszu, cztery oceny w drugim → Imię Nazwisko: 4.25.',
            tags: ['getline', 'cin', 'setprecision'],
            statement: ['W pierwszym wierszu wejścia jest imię i nazwisko ucznia, a w drugim — cztery jego oceny (liczby całkowite od 1 do 6). Wypisz jeden wiersz: imię i nazwisko, dwukropek, spacja i średnia ocen z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['Pierwszy wiersz: imię i nazwisko. Drugi wiersz: cztery liczby całkowite.'],
            output_format: ['Jeden wiersz, jak w przykładzie.'],
            constraints: ['imię i nazwisko mają razem od 3 do 40 znaków', 'każda ocena jest od 1 do 6'],
            examples: [{ input: 'Ola Nowak\n5 4 4 4' }],
            hint: 'getline(cin, uczen); a potem cin >> a >> b >> c >> d;. Średnia to (a + b + c + d) / 4.0 — dzielenie przez 4.0, a nie przez 4!',
            tests: (r) => ['Jan Kowalski\n1 1 1 1', 'Anna Maria Nowak\n6 6 6 5', ...Array.from({ length: 4 }, () => `${osoba(r)}\n${Array.from({ length: 4 }, () => r.int(1, 6)).join(' ')}`)],
            solve: (inp) => { const l = lines(inp.trim()); const o = nums(l[1]); return `${l[0]}: ${fx((o[0] + o[1] + o[2] + o[3]) / 4, 2)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string uczen;
    int a, b, c, d;
    getline(cin, uczen);
    cin >> a >> b >> c >> d;
    cout << uczen << ": " << fixed << setprecision(2) << (a + b + c + d) / 4.0 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-tabela-wynikow', krok: K, level: 'srednie',
            title: 'Tabela wyników',
            short: 'Trzech graczy i ich punkty — równa tabelka z nagłówkiem.',
            tags: ['left/right', 'setw'],
            statement: ['Na wejściu są trzy wiersze, w każdym imię gracza (jedno słowo) i liczba jego punktów. Wypisz tabelę: najpierw nagłówek GRACZ i PUNKTY, a potem po jednym wierszu dla każdego gracza. W każdym wierszu imię (albo słowo GRACZ) jest dosunięte do lewej w polu o szerokości 10, a punkty (albo słowo PUNKTY) — do prawej w polu o szerokości 6.'],
            input_format: ['Trzy wiersze; w każdym słowo i liczba całkowita.'],
            output_format: ['Cztery wiersze tabeli, jak w przykładzie.'],
            constraints: ['imię ma od 1 do 9 liter alfabetu angielskiego', '0 ≤ punkty ≤ 99 999'],
            examples: [{ input: 'Ola 42\nBajtek 1337\nIza 7' }],
            hint: R`Każdy wiersz to: cout << left << setw(10) << imie << right << setw(6) << punkty << "\n";. Nagłówek wypisz tak samo, tylko ze słowami "GRACZ" i "PUNKTY".`,
            tests: (r) => ['A 0\nB 0\nC 0', 'Abcdefghi 99999\nX 1\nOla 500', ...Array.from({ length: 4 }, () => Array.from({ length: 3 }, () => `${capital(r.word(r.int(1, 9)))} ${r.int(0, 99999)}`).join('\n'))],
            solve: (inp) => { const t = toks(inp); const w = (a, b) => padR(a, 10) + padL(b, 6); return join(w('GRACZ', 'PUNKTY'), w(t[0], t[1]), w(t[2], t[3]), w(t[4], t[5])); },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string a, b, c;
    int pa, pb, pc;
    cin >> a >> pa >> b >> pb >> c >> pc;
    cout << left << setw(10) << "GRACZ" << right << setw(6) << "PUNKTY" << "\n";
    cout << left << setw(10) << a << right << setw(6) << pa << "\n";
    cout << left << setw(10) << b << right << setw(6) << pb << "\n";
    cout << left << setw(10) << c << right << setw(6) << pc << "\n";
    return 0;
}`,
        },
        {
            id: 'io-wiersz-arkusza', krok: K, level: 'srednie',
            title: 'Wiersz z arkusza',
            short: 'produkt,ilosc,cena — wczytaj getline do przecinka i policz wartość.',
            tags: ["getline(cin, s, ',')", 'double', 'setprecision'],
            statement: ['Arkusz kalkulacyjny zapisał wiersz zamówienia w postaci produkt,ilosc,cena — oddzielając dane przecinkami, np. kawa mielona,3,18.99. Nazwa produktu może mieć spacje. Wypisz: produkt: ilosc x cena = wartosc, gdzie cena i wartość mają dwie cyfry po kropce.'],
            input_format: ['Jeden wiersz w postaci produkt,ilosc,cena.'],
            output_format: ['Jeden wiersz, jak w przykładzie.'],
            constraints: ['nazwa ma od 1 do 30 znaków i nie zawiera przecinków', '1 ≤ ilość ≤ 1000', '0.01 ≤ cena ≤ 9999.99', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: 'kawa mielona,3,18.99' }],
            hint: R`getline(cin, produkt, ','); wczyta nazwę razem ze spacjami. Dalej: cin >> ilosc >> przecinek >> cena; (przecinek to char). Wartość to ilosc * cena.`,
            tests: (r) => {
                const out = ['x,1,0.01', 'chleb,1000,9999.99'];
                while (out.length < 8) {
                    const n = r.int(1, 1000), c = dec(r.int(1, 999999), 2);
                    const nazwa = r() < 0.5 ? r.word(r.int(1, 12)) : `${r.word(r.int(2, 8))} ${r.word(r.int(2, 10))}`;
                    if (safe(n * Number(c), 2)) out.push(`${nazwa},${n},${c}`);
                }
                return out;
            },
            solve: (inp) => { const [p, n, c] = inp.trim().split(','); const cena = Number(c); return `${p}: ${Number(n)} x ${fx(cena, 2)} = ${fx(Number(n) * cena, 2)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string produkt;
    int ilosc;
    char przecinek;
    double cena;
    getline(cin, produkt, ',');
    cin >> ilosc >> przecinek >> cena;
    cout << fixed << setprecision(2);
    cout << produkt << ": " << ilosc << " x " << cena << " = " << ilosc * cena << "\n";
    return 0;
}`,
        },
        {
            id: 'io-tempo-biegu', krok: K, level: 'srednie',
            title: 'Tempo biegu',
            short: 'Metry i czas MM:SS → prędkość w m/s i w km/h.',
            tags: ['char jako separator', 'double', 'setprecision'],
            statement: ['Wczytaj długość trasy w metrach i czas biegu w formacie MM:SS. Wypisz w pierwszym wierszu średnią prędkość w metrach na sekundę z dokładnością do dwóch miejsc po przecinku, a w drugim — w kilometrach na godzinę z dokładnością do jednego miejsca po przecinku (1 m/s = 3.6 km/h).'],
            input_format: ['W jedynym wierszu liczba całkowita (metry) i czas w formacie MM:SS.'],
            output_format: ['Dwa wiersze: prędkość w m/s i w km/h.'],
            constraints: ['1 ≤ metry ≤ 50 000', 'czas jest od 00:01 do 99:59', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '400 01:20', note: '400 m w 80 s to 5 m/s, czyli 18 km/h.' }],
            hint: 'Zamień czas na sekundy: s = mm * 60 + ss. Prędkość w m/s to (double)metry / s, a w km/h — to samo razy 3.6.',
            tests: (r) => {
                const out = [];
                const ok = (m, s) => safe(m / s, 2) && safe(m / s * 3.6, 1) && safe(m * 3.6 / s, 1);
                for (const [m, s] of [[1, 1], [50000, 5999], [100, 10]]) if (ok(m, s)) out.push(`${m} ${z2(Math.floor(s / 60))}:${z2(s % 60)}`);
                while (out.length < 10) {
                    const m = r.int(1, 50000), s = r.int(1, 5999);
                    if (ok(m, s)) out.push(`${m} ${z2(Math.floor(s / 60))}:${z2(s % 60)}`);
                }
                return out;
            },
            solve: (inp) => { const [m, t] = toks(inp); const s = czas(t); const v = Number(m) / s; return join(fx(v, 2), fx(v * 3.6, 1)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int metry, mm, ss;
    char c;
    cin >> metry >> mm >> c >> ss;
    int s = mm * 60 + ss;
    double v = (double)metry / s;
    cout << fixed << setprecision(2) << v << "\n";
    cout << setprecision(1) << v * 3.6 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-tablica-meczu', krok: K, level: 'srednie',
            title: 'Tablica wyników meczu',
            short: 'Gospodarze 3:1 Goscie — wypisz to w ramce o stałej szerokości.',
            tags: ['char jako separator', 'setw', 'left/right'],
            statement: ['Na wejściu jest wynik meczu w postaci: nazwa gospodarzy, wynik a:b i nazwa gości, np. Orly 3:1 Sokoly. Wypisz tablicę wyników w jednym wierszu: nawias kwadratowy, nazwa gospodarzy dosunięta do prawej w polu o szerokości 12, spacja, wynik a:b, spacja, nazwa gości dosunięta do lewej w polu o szerokości 12 i nawias zamykający.'],
            input_format: ['Jeden wiersz: słowo, wynik w postaci a:b i słowo, oddzielone spacjami.'],
            output_format: ['Jeden wiersz, jak w przykładzie.'],
            constraints: ['nazwy mają od 1 do 12 liter alfabetu angielskiego', '0 ≤ a, b ≤ 99'],
            examples: [{ input: 'Orly 3:1 Sokoly' }],
            hint: R`Wczytaj: cin >> dom >> a >> c >> b >> gosc;. Wypisz: cout << "[" << right << setw(12) << dom << " " << a << ":" << b << " " << left << setw(12) << gosc << "]\n";`,
            tests: (r) => ['A 0:0 B', 'Abcdefghijkl 99:99 Abcdefghijkl', ...Array.from({ length: 4 }, () => `${capital(r.word(r.int(1, 12)))} ${r.int(0, 9)}:${r.int(0, 9)} ${capital(r.word(r.int(1, 12)))}`)],
            solve: (inp) => { const [d, w, g] = toks(inp); const [a, b] = w.split(':').map(Number); return `[${padL(d, 12)} ${a}:${b} ${padR(g, 12)}]`; },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string dom, gosc;
    int a, b;
    char c;
    cin >> dom >> a >> c >> b >> gosc;
    cout << "[" << right << setw(12) << dom << " " << a << ":" << b << " " << left << setw(12) << gosc << "]\n";
    return 0;
}`,
        },
        {
            id: 'io-litery-zdania', krok: K, level: 'srednie',
            title: 'Pierwsza i ostatnia litera zdania',
            short: 'Wczytaj całe zdanie i wypisz jego długość oraz pierwszy i ostatni znak.',
            tags: ['getline', 's[0]', '.length()'],
            statement: ['Wczytaj wiersz tekstu (może mieć spacje) i wypisz w pierwszym wierszu jego długość, a w drugim — pierwszy i ostatni znak tego wiersza, oddzielone spacją.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Dwa wiersze: długość oraz pierwszy i ostatni znak.'],
            constraints: ['wiersz ma od 1 do 100 znaków i nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: 'Ala ma kota' }],
            hint: R`getline(cin, s); — potem s.length(), s[0] i s[s.length() - 1]. Gdybyś wczytał zdanie przez cin >> s, dostałbyś tylko pierwsze słowo — i złą ostatnią literę.`,
            tests: (r) => ['x', 'Ala ma kota', zdanie(r, 2), zdanie(r, 7), zdanie(r, 12)],
            solve: (inp) => { const s = lines(inp.trim())[0]; return join(s.length, `${s[0]} ${s[s.length - 1]}`); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    cout << s.length() << "\n";
    cout << s[0] << " " << s[s.length() - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'io-zaokraglanie-ceny', krok: K, level: 'srednie',
            title: 'Zaokrąglona cena',
            short: 'Cena z czterema cyframi po kropce → do groszy i do pełnych złotych.',
            tags: ['fixed', 'setprecision(2)', 'setprecision(0)'],
            statement: ['Hurtownia liczy ceny z dokładnością do czterech miejsc po przecinku. Wczytaj taką cenę i wypisz w pierwszym wierszu cenę zaokrągloną do groszy (dwa miejsca po przecinku), a w drugim — zaokrągloną do pełnych złotych, ze słowem zl po spacji.'],
            input_format: ['Jedna liczba rzeczywista z czterema cyframi po kropce.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['0 < cena < 100 000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '12.3456' }],
            hint: R`cout << fixed << setprecision(2) << c << "\n"; a potem cout << setprecision(0) << c << " zl\n"; — setprecision(0) zaokrągla do całości i nie wypisuje kropki.`,
            tests: (r) => {
                const out = [];
                for (const s of ['0.0001', '99999.9999', '1.4999']) if (safe(Number(s), 2) && safe(Number(s), 0)) out.push(s);
                while (out.length < 9) { const c = dec(r.int(1, 999999999), 4); if (safe(Number(c), 2) && safe(Number(c), 0)) out.push(c); }
                return out;
            },
            solve: (inp) => { const c = Number(toks(inp)[0]); return join(fx(c, 2), `${fx(c, 0)} zl`); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double c;
    cin >> c;
    cout << fixed << setprecision(2) << c << "\n";
    cout << setprecision(0) << c << " zl\n";
    return 0;
}`,
        },
        {
            id: 'io-plan-lekcji', krok: K, level: 'srednie',
            title: 'Plan lekcji',
            short: 'Godziny jako liczby i nazwy przedmiotów → plan w formacie 08:00 | matematyka.',
            tags: ['setw', 'setfill', 'cin'],
            statement: ['Na wejściu są trzy wiersze, w każdym godzina i minuta rozpoczęcia lekcji (dwie liczby całkowite) oraz nazwa przedmiotu (jedno słowo). Wypisz plan: dla każdej lekcji wiersz w postaci HH:MM | przedmiot, z godzinami i minutami zawsze dwucyfrowymi.'],
            input_format: ['Trzy wiersze; w każdym dwie liczby całkowite i słowo.'],
            output_format: ['Trzy wiersze, jak w przykładzie.'],
            constraints: ['0 ≤ godzina ≤ 23', '0 ≤ minuta ≤ 59', 'nazwa ma od 1 do 20 małych liter'],
            examples: [{ input: '8 0 matematyka\n8 55 informatyka\n9 50 polski' }],
            hint: R`Ustaw raz setfill('0'). Dla każdej lekcji: cout << setw(2) << h << ":" << setw(2) << m << " | " << przedmiot << "\n";. Uwaga: setfill nie przeszkadza przy napisach, bo setw stoi tylko przed liczbami.`,
            tests: (r) => ['0 0 a\n23 59 b\n12 5 c', ...Array.from({ length: 4 }, () => Array.from({ length: 3 }, () => `${r.int(7, 16)} ${r.int(0, 59)} ${r.pick(PRZEDMIOTY)}`).join('\n'))],
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < 9; i += 3) o.push(`${z2(t[i])}:${z2(t[i + 1])} | ${t[i + 2]}`); return o.join('\n'); },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    int h1, m1, h2, m2, h3, m3;
    string p1, p2, p3;
    cin >> h1 >> m1 >> p1 >> h2 >> m2 >> p2 >> h3 >> m3 >> p3;
    cout << setfill('0');
    cout << setw(2) << h1 << ":" << setw(2) << m1 << " | " << p1 << "\n";
    cout << setw(2) << h2 << ":" << setw(2) << m2 << " | " << p2 << "\n";
    cout << setw(2) << h3 << ":" << setw(2) << m3 << " | " << p3 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-ramka-z-nazwiskiem', krok: K, level: 'srednie',
            title: 'Imię i nazwisko w ramce',
            short: 'Wczytaj cały wiersz ze spacjami i otocz go ramką z gwiazdek.',
            tags: ['getline', 'string(n, c)', '.length()'],
            statement: ['Wczytaj imię i nazwisko (jeden wiersz, ze spacjami) i wypisz je w ramce z gwiazdek: górny brzeg z gwiazdek, wiersz z tekstem otoczonym z każdej strony gwiazdką i spacją, oraz dolny brzeg taki sam jak górny.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Trzy wiersze ramki, jak w przykładzie.'],
            constraints: ['wiersz ma od 1 do 50 znaków i nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: 'Jan Kowalski' }],
            hint: R`To jak „Słowo w ramce” z poprzedniej lekcji, tylko tekst trzeba wczytać przez getline, bo ma spacje. Brzeg to string(s.length() + 4, '*').`,
            tests: (r) => ['X', 'Ola Nowak', osoba(r), `${osoba(r)} ${capital(r.word(10))}`, zdanie(r, 6)],
            solve: (inp) => { const s = lines(inp.trim())[0]; const b = '*'.repeat(s.length + 4); return join(b, `* ${s} *`, b); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    string brzeg = string(s.length() + 4, '*');
    cout << brzeg << "\n";
    cout << "* " << s << " *\n";
    cout << brzeg << "\n";
    return 0;
}`,
        },

        // ================================================================ trudne
        {
            id: 'io-mnozenie-z-gwiazdka', krok: K, level: 'trudne',
            title: 'Kalkulator a*b',
            short: 'Działanie zapisane jako 3000000000*3 — liczby nie mieszczą się w int.',
            tags: ['char jako separator', 'long long', '%lld'],
            statement: ['Wczytaj działanie zapisane bez spacji w postaci a*b, np. 3000000000*3, i wypisz jego wynik.', 'Uwaga: same liczby a i b mogą być większe niż 2 miliardy, więc nie zmieszczą się nawet w int — trzeba je od razu wczytywać do long long.'],
            input_format: ['W jedynym wierszu działanie w postaci a*b, bez spacji.'],
            output_format: ['Jedna liczba — wynik mnożenia.'],
            constraints: ['1 ≤ a, b ≤ 3 · 10⁹'],
            examples: [{ input: '3000000000*3' }, { input: '12*12' }],
            hint: R`long long a, b; char gwiazdka; cin >> a >> gwiazdka >> b;. Największy wynik to 9 · 10¹⁸ — tuż poniżej limitu long long (około 9,22 · 10¹⁸). Z printf: scanf("%lld*%lld", &a, &b); printf("%lld\n", a * b);`,
            tests: (r) => ['1*1', '3000000000*3000000000', '2147483648*2', '3*2147483647', `${r.int(1, 3e9)}*${r.int(1, 3e9)}`, `${r.int(1, 3e9)}*${r.int(1, 1000)}`, `${r.int(1, 1e5)}*${r.int(1, 1e5)}`],
            solve: (inp) => { const [a, b] = inp.trim().split('*').map(BigInt); return String(a * b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    char gwiazdka;
    cin >> a >> gwiazdka >> b;
    cout << a * b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-czas-podrozy', krok: K, level: 'trudne',
            title: 'Czas podróży',
            short: 'Odjazd i przyjazd HH:MM — przyjazd może być następnego dnia.',
            tags: ['char jako separator', '%', 'setfill'],
            statement: ['Pociąg odjeżdża o godzinie A i przyjeżdża o godzinie B, obie w formacie HH:MM. Podróż trwa krócej niż dobę, ale może przejść przez północ — wtedy B jest „mniejsza” niż A, bo przyjazd jest już następnego dnia. Wypisz czas podróży w formacie H:MM (godziny bez zer na początku, minuty zawsze dwucyfrowe).'],
            input_format: ['W jedynym wierszu dwie godziny w formacie HH:MM: odjazd i przyjazd.'],
            output_format: ['Czas podróży w formacie H:MM.'],
            constraints: ['00:00 ≤ godziny ≤ 23:59', 'czas podróży jest mniejszy niż 24 godziny'],
            examples: [{ input: '22:30 01:15', note: 'Od 22:30 do północy jest 1:30, a od północy do 01:15 — 1:15. Razem 2:45.' }, { input: '08:10 12:05' }],
            hint: 'Zamień obie godziny na minuty od północy. Różnica (przyjazd − odjazd) jest ujemna, gdy pociąg przejedzie przez północ — dodaj wtedy 1440, czyli dobę. Bez if: (b − a + 1440) % 1440 działa w obu przypadkach.',
            tests: (r) => ['00:00 00:00', '23:59 00:00', '00:00 23:59', '12:00 11:59', losHH(r) + ' ' + losHH(r), losHH(r) + ' ' + losHH(r), losHH(r) + ' ' + losHH(r)],
            solve: (inp) => { const [a, b] = toks(inp).map(czas); const d = (b - a + 1440) % 1440; return `${Math.floor(d / 60)}:${z2(d % 60)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h1, m1, h2, m2;
    char c;
    cin >> h1 >> c >> m1 >> h2 >> c >> m2;
    int d = (h2 * 60 + m2 - (h1 * 60 + m1) + 1440) % 1440;
    cout << d / 60 << ":" << setfill('0') << setw(2) << d % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-strefy-czasowe', krok: K, level: 'trudne',
            title: 'Strefy czasowe',
            short: 'Godzina w Warszawie i przesunięcie strefy → godzina na miejscu.',
            tags: ['char jako separator', '% dla ujemnych', 'setfill'],
            statement: ['W Warszawie jest godzina HH:MM. Wczytaj ją oraz przesunięcie strefy czasowej innego miasta względem Warszawy (liczba całkowita godzin, może być ujemna — np. −6 dla Nowego Jorku) i wypisz, która godzina jest w tamtym mieście, w formacie HH:MM.'],
            input_format: ['W jedynym wierszu godzina w formacie HH:MM i liczba całkowita p.'],
            output_format: ['Godzina w formacie HH:MM.'],
            constraints: ['00:00 ≤ godzina ≤ 23:59', '−12 ≤ p ≤ 14'],
            examples: [{ input: '10:15 -6' }, { input: '20:00 9', note: '20:00 + 9 godzin to 05:00 następnego dnia.' }],
            hint: 'Policz minuty od północy i dodaj p · 60. Wynik może wyjść ujemny albo większy niż doba. Reszta z dzielenia przez 1440 dla liczb ujemnych w C++ też jest ujemna, więc zrób to tak: ((x % 1440) + 1440) % 1440 — dopiero to daje liczbę od 0 do 1439.',
            tests: (r) => ['00:00 -12', '23:59 14', '00:30 -1', '12:00 0', `${losHH(r)} ${r.int(-12, 14)}`, `${losHH(r)} ${r.int(-12, -1)}`, `${losHH(r)} ${r.int(1, 14)}`],
            solve: (inp) => { const [t, p] = toks(inp); const x = (((czas(t) + Number(p) * 60) % 1440) + 1440) % 1440; return hhmm(x); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h, m, p;
    char c;
    cin >> h >> c >> m >> p;
    int x = h * 60 + m + p * 60;
    x = (x % 1440 + 1440) % 1440;
    cout << setfill('0') << setw(2) << x / 60 << ":" << setw(2) << x % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-rozklad-jazdy', krok: K, level: 'trudne',
            title: 'Rozkład jazdy z przesiadką',
            short: 'Odjazd, dwa odcinki trasy i postój — wypisz wszystkie godziny HH:MM.',
            tags: ['char jako separator', '%', 'setfill'],
            statement: ['Autobus odjeżdża o godzinie HH:MM. Pierwszy odcinek trasy trwa a minut, potem autobus stoi na przystanku przez p minut, a drugi odcinek trwa b minut. Wypisz trzy wiersze: przyjazd na przystanek, odjazd z przystanku i przyjazd do celu — każdą godzinę w formacie HH:MM. Po 23:59 zegar wraca do 00:00.'],
            input_format: ['W jedynym wierszu godzina w formacie HH:MM oraz trzy liczby całkowite a, p i b.'],
            output_format: ['Trzy wiersze w formacie HH:MM.'],
            constraints: ['00:00 ≤ godzina ≤ 23:59', '0 ≤ a, p, b ≤ 10 000'],
            examples: [{ input: '23:20 25 10 40', note: '23:20 + 25 min = 23:45, + 10 min = 23:55, + 40 min = 00:35 następnego dnia.' }],
            hint: 'Pracuj na minutach od północy: x = h * 60 + m. Każdą kolejną godzinę dostajesz, dodając minuty, a do wypisania bierzesz x % 1440 i z tego x / 60 i x % 60 — z setfill(\'0\') i setw(2).',
            tests: (r) => ['00:00 0 0 0', '23:59 1 1 1', '12:00 10000 10000 10000', `${losHH(r)} ${r.int(0, 200)} ${r.int(0, 60)} ${r.int(0, 200)}`, `${losHH(r)} ${r.int(0, 10000)} ${r.int(0, 10000)} ${r.int(0, 10000)}`, `${losHH(r)} ${r.int(0, 90)} ${r.int(0, 30)} ${r.int(0, 90)}`],
            solve: (inp) => { const t = toks(inp); const [a, p, b] = t.slice(1).map(Number); const x = czas(t[0]); return join(hhmm((x + a) % 1440), hhmm((x + a + p) % 1440), hhmm((x + a + p + b) % 1440)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h, m, a, p, b;
    char c;
    cin >> h >> c >> m >> a >> p >> b;
    int x = h * 60 + m;
    int t1 = (x + a) % 1440, t2 = (x + a + p) % 1440, t3 = (x + a + p + b) % 1440;
    cout << setfill('0');
    cout << setw(2) << t1 / 60 << ":" << setw(2) << t1 % 60 << "\n";
    cout << setw(2) << t2 / 60 << ":" << setw(2) << t2 % 60 << "\n";
    cout << setw(2) << t3 / 60 << ":" << setw(2) << t3 % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-faktura', krok: K, level: 'trudne',
            title: 'Faktura',
            short: 'Klient w jednym wierszu, dwa produkty z ilością i ceną — wydrukuj fakturę z VAT-em.',
            tags: ['getline', 'setw', 'setfill', 'setprecision'],
            statement: [
                'W pierwszym wierszu wejścia jest nazwa klienta (może mieć spacje), a w dwóch kolejnych — produkty: nazwa (jedno słowo), ilość (liczba całkowita) i cena netto za sztukę. Wypisz fakturę, dokładnie jak w przykładzie: wiersz Klient: …, dwa wiersze z produktami, a potem wiersze Netto, VAT 23% i Brutto.',
                'W wierszu produktu nazwa jest dosunięta do lewej w polu szerokości 10 i dopełniona kropkami, ilość — do prawej w polu szerokości 4, a wartość (ilość · cena) — do prawej w polu szerokości 10, z dwiema cyframi po kropce. Netto to suma wartości obu produktów, VAT to netto · 0.23, a brutto to netto + VAT. Kwoty w ostatnich trzech wierszach są dosunięte do prawej w polu szerokości 10.',
            ],
            input_format: ['Pierwszy wiersz: nazwa klienta. Dwa kolejne wiersze: słowo, liczba całkowita i liczba rzeczywista z dwiema cyframi po kropce.'],
            output_format: ['Sześć wierszy faktury, jak w przykładzie.'],
            constraints: ['nazwa klienta ma od 1 do 40 znaków i nie zaczyna się ani nie kończy spacją', 'nazwa produktu ma od 1 do 9 małych liter', '1 ≤ ilość ≤ 999', '0.01 ≤ cena ≤ 9999.99', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: 'Szkola Podstawowa nr 5\nzeszyt 30 2.50\ndlugopis 12 3.99' }],
            hint: R`Klienta wczytaj przez getline, a produkty — zwykłym cin. Raz ustaw fixed i setprecision(2). Wiersz produktu: cout << left << setfill('.') << setw(10) << nazwa << right << setfill(' ') << setw(4) << ilosc << setw(10) << ilosc * cena << "\n";. Wiersz podsumowania: cout << "Netto:   " << setw(10) << netto << "\n"; — liczbę spacji w napisach dobierz tak, żeby wszystkie napisy miały 9 znaków.`,
            tests: (r) => {
                const out = [];
                const ok = (n1, c1, n2, c2) => { const net = n1 * c1 + n2 * c2; const vat = net * 0.23; return safe(n1 * c1, 2) && safe(n2 * c2, 2) && safe(net, 2) && safe(vat, 2) && safe(net + vat, 2) && safe(net * 1.23, 2); };
                while (out.length < 8) {
                    const n1 = r.int(1, 999), n2 = r.int(1, 999), c1 = dec(r.int(1, 999999), 2), c2 = dec(r.int(1, 99999), 2);
                    if (!ok(n1, Number(c1), n2, Number(c2))) continue;
                    const klient = r() < 0.5 ? `${capital(r.word(r.int(3, 10)))} ${capital(r.word(r.int(3, 12)))}` : `Firma ${capital(r.word(r.int(3, 14)))} nr ${r.int(1, 99)}`;
                    out.push(`${klient}\n${r.word(r.int(1, 9))} ${n1} ${c1}\n${r.word(r.int(1, 9))} ${n2} ${c2}`);
                }
                return out;
            },
            solve: (inp) => {
                const l = lines(inp.trim());
                const p = [toks(l[1]), toks(l[2])];
                const w = p.map(([, n, c]) => Number(n) * Number(c));
                const net = w[0] + w[1], vat = net * 0.23;
                const wiersz = ([nazwa, n], v) => padR(nazwa, 10, '.') + padL(Number(n), 4) + padL(fx(v, 2), 10);
                return join(`Klient: ${l[0]}`, wiersz(p[0], w[0]), wiersz(p[1], w[1]),
                    `Netto:   ${padL(fx(net, 2), 10)}`, `VAT 23%: ${padL(fx(vat, 2), 10)}`, `Brutto:  ${padL(fx(net + vat, 2), 10)}`);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string klient, p1, p2;
    int n1, n2;
    double c1, c2;
    getline(cin, klient);
    cin >> p1 >> n1 >> c1 >> p2 >> n2 >> c2;
    double w1 = n1 * c1, w2 = n2 * c2;
    double netto = w1 + w2, vat = netto * 0.23;
    cout << fixed << setprecision(2);
    cout << "Klient: " << klient << "\n";
    cout << left << setfill('.') << setw(10) << p1 << right << setfill(' ') << setw(4) << n1 << setw(10) << w1 << "\n";
    cout << left << setfill('.') << setw(10) << p2 << right << setfill(' ') << setw(4) << n2 << setw(10) << w2 << "\n";
    cout << "Netto:   " << setw(10) << netto << "\n";
    cout << "VAT 23%: " << setw(10) << vat << "\n";
    cout << "Brutto:  " << setw(10) << netto + vat << "\n";
    return 0;
}`,
        },
        {
            id: 'io-raport-zawodow', krok: K, level: 'trudne',
            title: 'Raport z zawodów',
            short: 'Imię i nazwisko;szkoła;punkty — getline do średnika i elegancki raport.',
            tags: ["getline(cin, s, ';')", 'double', 'setprecision'],
            statement: ['System zawodów zapisał wynik uczestnika w jednym wierszu: imię i nazwisko, średnik, nazwa szkoły, średnik i liczba punktów (na 250 możliwych), np. Ola Nowak;SP 12 Krakow;187. Wypisz raport w trzech wierszach: Uczestnik: …, Szkola: … oraz Wynik: P/250 (procent z jednym miejscem po przecinku i znak %).'],
            input_format: ['Jeden wiersz w postaci osoba;szkola;punkty.'],
            output_format: ['Trzy wiersze raportu, jak w przykładzie.'],
            constraints: ['osoba i szkoła mają od 1 do 40 znaków i nie zawierają średników', '0 ≤ punkty ≤ 250'],
            examples: [{ input: 'Ola Nowak;SP 12 Krakow;187' }],
            hint: R`getline(cin, osoba, ';'); getline(cin, szkola, ';'); cin >> pkt;. Procent to pkt * 100.0 / 250, z setprecision(1). Przy 250 możliwych punktach procent zawsze ma najwyżej jedną cyfrę po kropce, więc zaokrąglanie nie sprawi kłopotu.`,
            tests: (r) => ['A B;C;0', 'Bajtazar Bitowski;Liceum nr 1;250', ...Array.from({ length: 5 }, () => `${capital(r.word(r.int(2, 9)))} ${capital(r.word(r.int(3, 12)))};${r.pick(['SP', 'LO', 'Technikum'])} ${r.int(1, 99)} ${capital(r.word(r.int(4, 10)))};${r.int(0, 250)}`)],
            solve: (inp) => { const [o, s, p] = inp.trim().split(';'); const pkt = Number(p); return join(`Uczestnik: ${o}`, `Szkola: ${s}`, `Wynik: ${pkt}/250 (${fx(pkt * 100 / 250, 1)}%)`); },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string osoba, szkola;
    int pkt;
    getline(cin, osoba, ';');
    getline(cin, szkola, ';');
    cin >> pkt;
    cout << "Uczestnik: " << osoba << "\n";
    cout << "Szkola: " << szkola << "\n";
    cout << "Wynik: " << pkt << "/250 (" << fixed << setprecision(1) << pkt * 100.0 / 250 << "%)\n";
    return 0;
}`,
        },
        {
            id: 'io-suma-ulamkow', krok: K, level: 'trudne',
            title: 'Suma ułamków',
            short: 'a/b + c/d — wynik jako ułamek i jako liczba z trzema cyframi po kropce.',
            tags: ['char jako separator', 'long long', 'setprecision'],
            statement: ['Wczytaj działanie a/b + c/d (ze spacjami wokół plusa) i wypisz w pierwszym wierszu wynik jako ułamek (a·d + c·b)/(b·d) — bez skracania — a w drugim jego wartość dziesiętną z dokładnością do trzech miejsc po przecinku.'],
            input_format: ['W jedynym wierszu działanie w postaci a/b + c/d.'],
            output_format: ['Dwa wiersze: ułamek i jego wartość.'],
            constraints: ['1 ≤ a, b, c, d ≤ 100 000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '1/2 + 1/3', note: '1/2 + 1/3 = (1·3 + 1·2)/(2·3) = 5/6 ≈ 0.833.' }],
            hint: R`Wczytaj: cin >> a >> c1 >> b >> plus >> c >> c1 >> d; (c1 i plus to zmienne char). Liczniki i mianownik mogą sięgać 2 · 10¹⁰, więc licz na long long. Wartość to (double)licznik / mianownik.`,
            tests: (r) => {
                const out = [];
                for (const s of ['1/1 + 1/1', '100000/1 + 100000/1', '1/100000 + 1/100000', '3/4 + 1/4']) {
                    const [a, b, c, d] = s.match(/\d+/g).map(Number);
                    if (safe((a * d + c * b) / (b * d), 3)) out.push(s);
                }
                while (out.length < 10) {
                    const big = r() < 0.5, mx = big ? 100000 : 50;
                    const [a, b, c, d] = [r.int(1, mx), r.int(1, mx), r.int(1, mx), r.int(1, mx)];
                    if (safe((a * d + c * b) / (b * d), 3)) out.push(`${a}/${b} + ${c}/${d}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b, c, d] = inp.match(/\d+/g).map(BigInt); const l = a * d + c * b, m = b * d; return join(`${l}/${m}`, fx(Number(l) / Number(m), 3)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long a, b, c, d;
    char ukosnik, plus;
    cin >> a >> ukosnik >> b >> plus >> c >> ukosnik >> d;
    long long licznik = a * d + c * b;
    long long mianownik = b * d;
    cout << licznik << "/" << mianownik << "\n";
    cout << fixed << setprecision(3) << (double)licznik / mianownik << "\n";
    return 0;
}`,
        },
        {
            id: 'io-legitymacja', krok: K, level: 'trudne',
            title: 'Wielki finał: legitymacja szkolna',
            short: 'Imię i nazwisko, data urodzenia, klasa i numer — wydrukuj legitymację w ramce.',
            tags: ['getline', 'separatory', 'char', 'setw', 'setfill', 'left'],
            statement: [
                'Wydrukuj legitymację szkolną. Na wejściu są cztery wiersze: imię i nazwisko ucznia (ze spacjami), data urodzenia w formacie DD.MM.RRRR, klasa (cyfra i mała litera, np. 7b) oraz numer legitymacji (liczba całkowita).',
                'Legitymacja ma ramkę szerokości 32 znaków, jak w przykładzie: górny i dolny brzeg to plus, 30 minusów i plus, a każdy wiersz w środku to „| ”, tekst dosunięty do lewej w polu szerokości 28 i „ |”. W środku są cztery wiersze: LEGITYMACJA SZKOLNA, imię i nazwisko, data urodzenia w formacie RRRR-MM-DD z napisem „ur. ” oraz klasa (cyfra i WIELKA litera) z numerem legitymacji uzupełnionym zerami do 6 cyfr — dokładnie jak w przykładzie.',
            ],
            input_format: ['Cztery wiersze: imię i nazwisko, data DD.MM.RRRR, klasa (cyfra i mała litera, bez spacji), numer.'],
            output_format: ['Sześć wierszy legitymacji, jak w przykładzie.'],
            constraints: ['imię i nazwisko mają od 3 do 28 znaków i nie zaczynają się ani nie kończą spacją', '1 ≤ numer ≤ 999 999', 'cyfra klasy jest od 1 do 8'],
            examples: [{ input: 'Jan Kowalski\n04.05.2013\n7b\n123' }],
            hint: R`Najpierw getline(cin, uczen);, potem cin >> d >> c >> m >> c >> r >> nr_klasy >> litera >> numer; (klasa to int i char). Każdy wiersz w ramce składaj z kawałków: cout << "| " << left << setw(28) << uczen << " |\n";. Wiersze z datą i numerem łatwiej zbudować najpierw jako string — z to_string i dopisywaniem zer — albo wypisać kawałkami, pilnując, żeby razem miały 28 znaków.`,
            tests: (r) => ['Jan Kowalski\n04.05.2013\n7b\n123', 'Ola N\n01.01.2010\n1a\n999999', 'Anna Maria Wisniewska-Kowal\n31.12.2015\n8h\n1',
                ...Array.from({ length: 4 }, () => `${osoba(r)}\n${z2(r.int(1, 28))}.${z2(r.int(1, 12))}.${r.int(2008, 2020)}\n${r.int(1, 8)}${r.pick(MALE.split(''))}\n${r.int(1, 999999)}`)],
            check: (inp) => { const n = lines(inp.trim())[0].length; return n >= 3 && n <= 28 ? null : 'za długie nazwisko'; },
            solve: (inp) => {
                const l = lines(inp.trim());
                const [d, m, y] = l[1].split('.').map(Number);
                const klasa = l[2][0] + l[2][1].toUpperCase();
                const nr = padL(Number(l[3]), 6, '0');
                const w = (s) => `| ${padR(s, 28)} |`;
                const brzeg = '+' + '-'.repeat(30) + '+';
                return join(brzeg, w('LEGITYMACJA SZKOLNA'), w(l[0]), w(`ur. ${y}-${padL(m, 2, '0')}-${padL(d, 2, '0')}`), w(`klasa ${klasa}   nr ${nr}`), brzeg);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string uczen;
    int d, m, r, nrKlasy, numer;
    char c, litera;
    getline(cin, uczen);
    cin >> d >> c >> m >> c >> r >> nrKlasy >> litera >> numer;
    string brzeg = "+" + string(30, '-') + "+";
    cout << brzeg << "\n";
    cout << "| " << left << setw(28) << "LEGITYMACJA SZKOLNA" << " |\n";
    cout << "| " << left << setw(28) << uczen << " |\n";
    cout << "| ur. " << r << "-" << right << setfill('0') << setw(2) << m << "-" << setw(2) << d
         << setfill(' ') << setw(14) << "" << " |\n";
    cout << "| klasa " << nrKlasy << (char)(litera - 'a' + 'A') << "   nr " << setfill('0') << setw(6) << numer
         << setfill(' ') << setw(8) << "" << " |\n";
    cout << brzeg << "\n";
    return 0;
}`,
        },
    ];
};
