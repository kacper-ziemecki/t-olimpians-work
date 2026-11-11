// Silnia — baza zadań na koniec lekcji (krok 9): od łatwych (jeden, dwa pomysły naraz) przez średnie
// (kilka pomysłów, trochę kombinatoryki) do trudnych (czynniki pierwsze silni, log10, numery ustawień
// i wielki finał). Zadania łączą silnię z tym, co uczeń zna z poprzednich lekcji: modulo, tablicami,
// napisami, vectorem, sortowaniem, max i min oraz zaokrąglaniem (floor).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./silnia-pomoc');
    const { fact, C, leg, krotnosc, rozklad, pierwsze } = P;
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const MODN = 1000000007;
    const zakresy = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i));
    const lista = (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])); };
    const zgodnaLista = (inp, ok) => { const t = toks(inp); const v = lista(inp); return v.length === Number(t[0]) && t.length === v.length + 1 && v.length >= 1 && v.every(ok); };
    // a · b mod p na liczbach (a, b < p < 2^30) bez utraty dokładności
    const mulmod = (a, b) => (((a * (b >>> 16)) % MODN) * 65536 + a * (b & 65535)) % MODN;
    const silnieDo = (x) => { const out = []; for (let i = 1; fact(i) <= x; i++) out.push(fact(i)); return out; };
    const derangement = (n) => { let a = 1n, b = 0n; if (n === 0) return 1n; for (let i = 2; i <= n; i++) { const c = B(i - 1) * (a + b); a = b; b = c; } return b; };
    const odstepy = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return [
        // ================================================================ łatwe
        {
            id: 'sil-b-turniej', krok: 9, level: 'latwe',
            title: 'Turniej każdy z każdym',
            short: 'Ile partii w turnieju każdy z każdym i ile możliwych tabel końcowych?',
            tags: ['n · (n − 1) / 2', 'n!', 'long long'],
            statement: ['W turnieju szachowym gra n zawodników i każdy gra z każdym dokładnie jedną partię. W pierwszym wierszu wypisz, ile partii zostanie rozegranych. W drugim — na ile sposobów może wyglądać końcowa tabela, jeśli wszyscy zawodnicy zajmą różne miejsca.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: liczba partii i liczba możliwych tabel końcowych.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '4', note: 'Partie: AB, AC, AD, BC, BD, CD. Tabel: 4! = 24.' }],
            hint: R`Partie to pary zawodników: każdy z n gra z n − 1 innymi, ale wtedy każdą partię liczymy dwa razy — stąd n · (n − 1) / 2. Tabela końcowa to ustawienie n zawodników w kolejce od pierwszego do ostatniego miejsca: n!. Obie liczby w long long.`,
            tests: () => zakresy(1, 20),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 20 ? null : 'n'; },
            solve: (inp) => { const n = Number(inp); return `${(n * (n - 1)) / 2}\n${fact(n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long f = 1;
    for (int i = 2; i <= n; i++) f *= i;
    cout << n * (n - 1) / 2 << "\n" << f << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-bal', krok: 9, level: 'latwe',
            title: 'Pary na balu',
            short: 'Ile sposobów na n par chłopak–dziewczyna i na rząd do zdjęcia „na przemian”?',
            tags: ['n!', '2 · n! · n!', 'mnożymy możliwości'],
            statement: ['Na bal przyszło n chłopców i n dziewczyn. W pierwszym wierszu wypisz, na ile sposobów można ich połączyć w n par chłopak–dziewczyna. W drugim — na ile sposobów można ustawić wszystkie 2n osób w jednym rzędzie do zdjęcia tak, żeby chłopcy i dziewczyny stali na przemian.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: liczba sposobów połączenia w pary i liczba ustawień rzędu.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '2', note: 'Pary: (Adam–Ewa, Bartek–Ola) albo (Adam–Ola, Bartek–Ewa). Rzędy: ABEO… — 2 · 2! · 2! = 8.' }],
            hint: R`Pary: pierwszy chłopak wybiera partnerkę spośród n dziewczyn, drugi spośród n − 1, … — razem n!. Rząd na przemian: chłopcy zajmują co drugie miejsce (n! ustawień), dziewczyny pozostałe miejsca (n! ustawień), a rząd może zaczynać się od chłopca albo od dziewczyny — razem 2 · n! · n!. Dla n = 10 to ponad 2,6 · 10¹³ — long long.`,
            tests: () => zakresy(1, 10),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 10 ? null : 'n'; },
            solve: (inp) => { const f = fact(Number(inp)); return `${f}\n${2n * f * f}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long f = 1;
    for (int i = 2; i <= n; i++) f *= i;
    cout << f << "\n" << 2 * f * f << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-matma-przed-fizyka', krok: 9, level: 'latwe',
            title: 'Matematyka przed fizyką',
            short: 'Plan n lekcji, w którym matematyka jest gdzieś przed fizyką — dokładnie połowa wszystkich.',
            tags: ['n! / 2', 'symetria', 'pary planów'],
            statement: ['W poniedziałek odbędzie się n różnych lekcji, w tym matematyka i fizyka. Na ile sposobów można ułożyć plan dnia (kolejność wszystkich n lekcji), jeśli matematyka musi być gdzieś przed fizyką — niekoniecznie tuż przed nią?'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba możliwych planów.'],
            constraints: ['2 ≤ n ≤ 20'],
            examples: [{ input: '3', note: 'Lekcje M, F, X: MFX, MXF, XMF — 3 plany z 3! = 6.' }],
            hint: R`Weź dowolny plan i zamień w nim miejscami matematykę z fizyką — dostaniesz inny plan, w którym te dwie lekcje są w odwrotnej kolejności. Wszystkie plany łączą się więc w pary i w każdej parze dokładnie jeden ma matematykę przed fizyką. Wynik to n! / 2.`,
            tests: () => zakresy(2, 20),
            check: (inp) => { const n = Number(inp); return n >= 2 && n <= 20 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp)) / 2n),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long f = 1;
    for (int i = 2; i <= n; i++) f *= i;
    cout << f / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-dyzurni', krok: 9, level: 'latwe',
            title: 'Dyżurni',
            short: 'Dwóch dyżurnych z równymi prawami albo główny i zastępca — kiedy kolejność ma znaczenie?',
            tags: ['n · (n − 1)', 'dzielimy przez 2', 'long long'],
            statement: ['W szkole jest n uczniów i trzeba wybrać dwóch dyżurnych. W pierwszym wierszu wypisz, na ile sposobów można to zrobić, gdy obaj dyżurni mają takie same obowiązki. W drugim — gdy jeden zostaje dyżurnym głównym, a drugi jego zastępcą.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwa wiersze: liczba wyborów bez ról i liczba wyborów z rolami.'],
            constraints: ['2 ≤ n ≤ 2 000 000 000'],
            examples: [{ input: '3', note: 'Bez ról: AB, AC, BC. Z rolami: AB, BA, AC, CA, BC, CB.' }],
            hint: R`Z rolami liczy się kolejność: główny — n możliwości, zastępca — n − 1, razem n · (n − 1). Bez ról każdą parę policzyliśmy dwa razy (A główny z B i B główny z A), więc dzielimy przez 2. Iloczyn sięga 4 · 10¹⁸ — wczytaj n do long long.`,
            tests: (r) => ['2', '3', '10', '2000000000', '1999999999', '1000000000', ...Array.from({ length: 4 }, () => String(r.int(2, 2000000000)))],
            check: (inp) => { const n = Number(inp); return n >= 2 && n <= 2e9 ? null : 'n'; },
            solve: (inp) => { const n = B(inp); return `${(n * (n - 1n)) / 2n}\n${n * (n - 1n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << n * (n - 1) / 2 << "\n" << n * (n - 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-seria-na-polce', krok: 9, level: 'latwe',
            title: 'Seria na półce',
            short: 'Tomy serii stoją razem i po kolei — sklej je w jedną grubą książkę.',
            tags: ['sklejanie', '(n − k + 1)!', 'long long'],
            statement: ['Na półce trzeba ustawić n różnych książek, wśród nich wszystkie k tomów jednej serii. Tomy serii muszą stać obok siebie i po kolei (od lewej: tom 1, tom 2, …, tom k), a pozostałe książki mogą stać dowolnie. Na ile sposobów można ustawić książki?'],
            input_format: ['Dwie liczby całkowite n i k.'],
            output_format: ['Jedna liczba — liczba ustawień.'],
            constraints: ['1 ≤ k ≤ n ≤ 20'],
            examples: [{ input: '4 2', note: 'Seria [T1 T2] i książki X, Y: trzy elementy, 3! = 6 ustawień.' }, { input: '5 5' }],
            hint: R`Sklej całą serię w jedną „grubą książkę” — w środku kolejność jest ustalona, więc nie ma tam żadnego wyboru. Ustawiasz więc n − k + 1 elementów: (n − k + 1)! sposobów.`,
            tests: (r) => ['1 1', '20 1', '20 20', '20 2', '4 2', '5 5', '19 3', ...Array.from({ length: 5 }, () => { const n = r.int(1, 20); return `${n} ${r.int(1, n)}`; })],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return k >= 1 && k <= n && n <= 20 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(Number); return String(fact(n - k + 1)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    long long w = 1;
    for (int i = 2; i <= n - k + 1; i++) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-silnie-w-przedziale', krok: 9, level: 'latwe',
            title: 'Silnie w przedziale',
            short: 'Ile różnych silni leży w przedziale [a, b]? Jedynkę liczymy raz.',
            tags: ['silnie do 19!', 'a ≤ f ≤ b', 'licznik'],
            statement: ['Wczytaj a i b i wypisz, ile różnych liczb z przedziału [a, b] jest silniami (czyli równa się n! dla jakiegoś n). Liczbę 1 liczymy jeden raz, choć 0! = 1! = 1.'],
            input_format: ['Dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — liczba silni w przedziale.'],
            constraints: ['1 ≤ a ≤ b ≤ 10¹⁸'],
            examples: [{ input: '1 100', note: '1, 2, 6 i 24.' }, { input: '7 23' }],
            hint: R`Przejdź po silniach od 1! = 1 w górę, dopóki nie przekroczą b (dla b ≤ 10¹⁸ skończysz najpóźniej na 20!, które jeszcze mieści się w long long), i licz te, które są ≥ a. Zaczynając od 1!, każdą wartość policzysz dokładnie raz.`,
            tests: (r) => ['1 1', '1 1000000000000000000', '2 2', '7 23', '24 24', '25 119', '121645100408832000 1000000000000000000', '121645100408832001 1000000000000000000', '1 100',
                ...Array.from({ length: 5 }, () => { const a = r.big(1, E18); return `${a} ${a + r.big(0, E18 - a)}`; }), ...Array.from({ length: 3 }, () => { const a = r.int(1, 1000); return `${a} ${a + r.int(0, 1000000)}`; })],
            check: (inp) => { const [a, b] = toks(inp).map(B); return a >= 1n && a <= b && b <= E18 ? null : 'zakres'; },
            solve: (inp) => { const [a, b] = toks(inp).map(B); return String(silnieDo(b).filter((f) => f >= a).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long f = 1;
    int i = 1, ile = 0;
    while (f <= b) {
        if (f >= a) ile++;
        i++;
        f *= i;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-ostatnia-cyfra-sumy', krok: 9, level: 'latwe',
            title: 'Ostatnia cyfra sumy silni',
            short: 'Ostatnia cyfra 1! + 2! + … + n! dla n do 10¹⁸ — od 5! dalej same zera.',
            tags: ['% 10', 'min(n, 4)', 'od 5! zero na końcu'],
            statement: ['Wczytaj n i wypisz ostatnią cyfrę sumy 1! + 2! + … + n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3', note: '1 + 2 + 6 = 9.' }, { input: '1000000000000000000' }],
            hint: R`Od 5! w górę każda silnia kończy się zerem, więc nie zmienia ostatniej cyfry sumy. Wystarczy zsumować silnie do min(n, 4) i wziąć resztę z dzielenia przez 10. Pętla do 10¹⁸ nie wchodzi w grę.`,
            tests: (r) => [...zakresy(1, 8), '1000000000000000000', '999999999999999999', ...Array.from({ length: 3 }, () => String(r.big(9, E18)))],
            check: (inp) => { const n = B(inp); return n >= 1n && n <= E18 ? null : 'n'; },
            solve: (inp) => { const n = Number(B(inp) > 4n ? 4n : B(inp)); let s = 0n; for (let i = 1; i <= n; i++) s += fact(i); return String(s % 10n); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long ile = min(n, 4LL);
    long long s = 1, suma = 0;
    for (int i = 1; i <= ile; i++) {
        s *= i;
        suma += s;
    }
    cout << suma % 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-czy-dzieli', krok: 9, level: 'latwe',
            title: 'Czy k dzieli n!?',
            short: 'Dla każdej pary: czy n! dzieli się przez k bez reszty? Tablica silni i %.',
            tags: ['tablica silni', 'f[n] % k == 0', 'long long'],
            statement: ['Wczytaj t par liczb n i k. Dla każdej pary wypisz w osobnym wierszu TAK, jeśli n! dzieli się przez k bez reszty, albo NIE w przeciwnym razie.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W kolejnych t wierszach po dwie liczby: n i k.'],
            output_format: ['t wierszy — w każdym TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 20', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '3\n5 8\n5 7\n10 1000', note: '5! = 120 = 15 · 8, ale 120 nie dzieli się przez 7. 10! = 3 628 800 dzieli się przez 1000? Ma tylko dwa zera na końcu — nie.' }],
            hint: R`n ≤ 20, więc n! mieści się w long long. Policz silnie raz do tablicy f[0..20] i dla każdej pary sprawdź f[n] % k == 0.`,
            tests: (r) => {
                const para = () => { const n = r.int(0, 20); const f = fact(n); const k = r() < 0.5 ? (() => { let d = 1n; for (let i = 2; i <= n; i++) if (r() < 0.4) d *= B(i); return d; })() : r.pick([B(r.int(1, 1000)), r.big(1, E18), f, f + 1n]); return `${n} ${k > E18 ? E18 : k}`; };
                return ['1\n0 1', '1\n20 1000000000000000000', '1\n20 608225502044160000', '3\n5 8\n5 7\n10 1000', `1000\n${Array.from({ length: 1000 }, para).join('\n')}`];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (t.length !== 1 + 2 * q || q > 1000) return 'liczba'; for (let i = 0; i < q; i++) { const n = Number(t[1 + 2 * i]), k = B(t[2 + 2 * i]); if (n < 0 || n > 20 || k < 1n || k > E18) return 'zakres'; } return null; },
            solve: (inp) => { const t = toks(inp); const out = []; for (let i = 0; i < Number(t[0]); i++) out.push(fact(Number(t[1 + 2 * i])) % B(t[2 + 2 * i]) === 0n ? 'TAK' : 'NIE'); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int t;
    cin >> t;
    for (int j = 0; j < t; j++) {
        int n;
        long long k;
        cin >> n >> k;
        cout << (f[n] % k == 0 ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-b-z-odstepami', krok: 9, level: 'latwe',
            title: 'Silnia z odstępami',
            short: 'Wypisz n! z cyframi w grupach po trzy: 3 628 800. to_string i spacje co trzy cyfry od końca.',
            tags: ['to_string', 'grupy po 3 cyfry', '(s.size() - i) % 3'],
            statement: ['Duże liczby łatwiej czytać, gdy cyfry są pogrupowane po trzy, licząc od końca. Wczytaj n i wypisz n! w takim zapisie: grupy po trzy cyfry oddzielone pojedynczymi spacjami (pierwsza grupa od lewej może mieć jedną, dwie albo trzy cyfry). Na przykład 10! = 3 628 800.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz — n! z odstępami.'],
            constraints: ['0 ≤ n ≤ 20'],
            examples: [{ input: '10' }, { input: '5' }, { input: '20' }],
            hint: R`Policz silnię w long long i zamień ją na napis: string s = to_string(w);. Potem wypisuj znak po znaku: przed cyfrą na pozycji i wstaw spację, jeśli i > 0 i liczba cyfr od tej pozycji do końca, czyli s.size() - i, dzieli się przez 3.`,
            tests: () => zakresy(0, 20),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 20 ? null : 'n'; },
            solve: (inp) => odstepy(String(fact(Number(inp)))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 2; i <= n; i++) w *= i;
    string s = to_string(w);
    for (int i = 0; i < (int)s.size(); i++) {
        if (i > 0 && (s.size() - i) % 3 == 0) cout << " ";
        cout << s[i];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-10-sekund', krok: 9, level: 'latwe',
            title: '10! sekund',
            short: '10! sekund to dokładnie 6 tygodni. Zamień n! sekund na tygodnie, dni, godziny, minuty i sekundy.',
            tags: ['dzielenie z resztą', '604 800 s w tygodniu', 'long long'],
            statement: ['Ciekawostka: 10! sekund to dokładnie 6 tygodni. Wczytaj n i zamień n! sekund na tygodnie, dni, godziny, minuty i sekundy. Wypisz w jednym wierszu pięć liczb: pełne tygodnie, a potem pozostałe dni (od 0 do 6), godziny (od 0 do 23), minuty (od 0 do 59) i sekundy (od 0 do 59).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz: tygodnie, dni, godziny, minuty i sekundy oddzielone spacjami.'],
            constraints: ['0 ≤ n ≤ 20'],
            examples: [{ input: '10' }, { input: '7', note: '7! = 5040 s = 1 godzina i 24 minuty.' }],
            hint: R`Tydzień ma 7 · 24 · 60 · 60 = 604 800 sekund, doba 86 400, godzina 3600, minuta 60. Dziel z resztą po kolei, jak w lekcji o modulo: tygodnie = s / 604800, s %= 604800, dni = s / 86400, s %= 86400 i tak dalej. 20! sekund to ponad 4 biliony tygodni — long long.`,
            tests: () => zakresy(0, 20),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 20 ? null : 'n'; },
            solve: (inp) => { let s = fact(Number(inp)); const out = []; for (const d of [604800n, 86400n, 3600n, 60n]) { out.push(String(s / d)); s %= d; } out.push(String(s)); return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long s = 1;
    for (int i = 2; i <= n; i++) s *= i;
    long long tyg = s / 604800;
    s %= 604800;
    long long dni = s / 86400;
    s %= 86400;
    long long godz = s / 3600;
    s %= 3600;
    long long minuty = s / 60;
    s %= 60;
    cout << tyg << " " << dni << " " << godz << " " << minuty << " " << s << "\n";
    return 0;
}`,
        },

        // ================================================================ średnie
        {
            id: 'sil-b-zera-dwoch-silni', krok: 9, level: 'srednie',
            title: 'Zera iloczynu dwóch silni',
            short: 'Iloma zerami kończy się a! · b!? Piątki obu silni się sumują.',
            tags: ['n / 5 + n / 25 + …', 'piątki się sumują', 'long long'],
            statement: ['Wczytaj a i b i wypisz, iloma zerami kończy się liczba a! · b!.'],
            input_format: ['Dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — liczba zer na końcu a! · b!.'],
            constraints: ['0 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '5 5', note: '120 · 120 = 14 400 — dwa zera.' }, { input: '10 25' }],
            hint: R`Zera robią pary 2 · 5. Piątek w a! · b! jest tyle, ile w a! i w b! razem, a dwójek — też razem. W każdej silni dwójek jest co najmniej tyle co piątek, więc w iloczynie też. Wynik to zera(a) + zera(b), gdzie zera(n) liczysz jak w części 6: while (n > 0) { n /= 5; z += n; }.`,
            tests: (r) => ['0 0', '5 5', '10 25', '4 4', '1000000000000000000 1000000000000000000', '24 24', '25 0', ...Array.from({ length: 6 }, () => `${r.pick([r.int(0, 100), r.big(0, E18)])} ${r.pick([r.int(0, 100), r.big(0, E18)])}`)],
            check: (inp) => { const [a, b] = toks(inp).map(B); return a >= 0n && b >= 0n && a <= E18 && b <= E18 ? null : 'zakres'; },
            solve: (inp) => { const [a, b] = toks(inp); return String(leg(a, 5) + leg(b, 5)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long z = 0;
    while (a > 0) {
        a /= 5;
        z += a;
    }
    while (b > 0) {
        b /= 5;
        z += b;
    }
    cout << z << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-pary-na-wycieczke', krok: 9, level: 'srednie',
            title: 'Pary na wycieczkę',
            short: 'Na ile sposobów 2n uczniów może podzielić się na pary? (2n − 1) · (2n − 3) · … · 1.',
            tags: ['silnia podwójna', '(2n − 1)!!', 'pierwszy wybiera parę'],
            statement: ['Na wycieczkę jedzie 2n uczniów, którzy mają podzielić się na n par (w autokarze siedzi się parami). Na ile sposobów mogą się podzielić? Liczy się tylko to, kto jest z kim w parze — nie kolejność par ani to, kto siedzi przy oknie.'],
            input_format: ['Jedna liczba całkowita n — liczba par.'],
            output_format: ['Jedna liczba — liczba podziałów na pary.'],
            constraints: ['1 ≤ n ≤ 17'],
            examples: [{ input: '2', note: 'Uczniowie A, B, C, D: AB i CD, AC i BD, AD i BC.' }, { input: '3' }],
            hint: R`Weź ucznia z najmniejszym numerem — jego parę możesz wybrać na 2n − 1 sposobów. Z pozostałych 2n − 2 uczniów znowu bierzesz tego z najmniejszym numerem: jego parę wybierasz na 2n − 3 sposoby… Razem (2n − 1) · (2n − 3) · … · 3 · 1 — silnia podwójna z części 2. Dla n = 17 to ponad 6 · 10¹⁸.`,
            tests: () => zakresy(1, 17),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 17 ? null : 'n'; },
            solve: (inp) => { let w = 1n; for (let i = 2 * Number(inp) - 1; i >= 1; i -= 2) w *= B(i); return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 2 * n - 1; i >= 1; i -= 2) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-samorzad', krok: 9, level: 'srednie',
            title: 'Samorząd klasowy',
            short: 'Przewodniczący, zastępca i k-osobowa komisja: n · (n − 1) · C(n − 2, k).',
            tags: ['role z kolejnością', 'C(n − 2, k)', 'mnożymy etapy'],
            statement: ['W klasie jest n uczniów. Wybieramy przewodniczącego, jego zastępcę i k-osobową komisję (członkowie komisji mają równe prawa). Nikt nie może pełnić dwóch funkcji naraz. Na ile sposobów można to zrobić?'],
            input_format: ['Dwie liczby całkowite n i k.'],
            output_format: ['Jedna liczba — liczba sposobów.'],
            constraints: ['2 ≤ n ≤ 40', '0 ≤ k ≤ n − 2'],
            examples: [{ input: '4 1', note: '4 · 3 = 12 par (przewodniczący, zastępca), a do komisji jedna z 2 pozostałych osób: 24.' }, { input: '5 2' }],
            hint: R`Najpierw role, w których liczy się kolejność: przewodniczący (n możliwości) i zastępca (n − 1). Potem komisję wybierasz spośród pozostałych n − 2 osób bez kolejności: C(n − 2, k), pętlą c = c * (m - k + i) / i. Wybory są niezależne, więc mnożymy. Największy wynik to około 5,5 · 10¹³.`,
            tests: (r) => ['2 0', '4 1', '5 2', '40 19', '40 38', '40 0', '40 20', ...Array.from({ length: 6 }, () => { const n = r.int(2, 40); return `${n} ${r.int(0, n - 2)}`; })],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 2 && n <= 40 && k >= 0 && k <= n - 2 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(Number); return String(B(n * (n - 1)) * C(n - 2, k)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long m = n - 2, c = 1;
    for (long long i = 1; i <= k; i++) c = c * (m - k + i) / i;
    cout << n * (n - 1) * c << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-lotto', krok: 9, level: 'srednie',
            title: 'Trafienia w lotto',
            short: 'Ile zakładów ma dokładnie t trafień? C(k, t) · C(n − k, k − t).',
            tags: ['C(k, t)', 'C(n − k, k − t)', 'dwie grupy liczb'],
            statement: ['W losowaniu wybiera się k różnych liczb spośród liczb od 1 do n. Gracz też skreśla k różnych liczb spośród n. Ile jest różnych zakładów (zestawów k skreślonych liczb), które mają dokładnie t trafień — czyli dokładnie t liczb wspólnych z wylosowanymi?'],
            input_format: ['Trzy liczby całkowite n, k i t.'],
            output_format: ['Jedna liczba — liczba zakładów z dokładnie t trafieniami.'],
            constraints: ['1 ≤ k ≤ n ≤ 60', '0 ≤ t ≤ k'],
            examples: [{ input: '49 6 6', note: 'Szóstkę trafia tylko jeden zakład.' }, { input: '49 6 3' }, { input: '5 3 0', note: 'Niewylosowane są tylko 2 liczby, a trzeba skreślić 3 — takich zakładów nie ma.' }],
            hint: R`Zakład z t trafieniami to t liczb wybranych spośród k wylosowanych — C(k, t) sposobów — i k − t liczb spośród n − k niewylosowanych — C(n − k, k − t) sposobów. Każda pierwsza część pasuje do każdej drugiej, więc mnożymy. Jeśli k − t > n − k, takich zakładów nie ma — wypisz 0 (sprawdź to ifem przed liczeniem).`,
            tests: (r) => ['49 6 6', '49 6 3', '49 6 0', '5 3 0', '60 30 15', '60 30 0', '60 60 60', '1 1 1', '1 1 0', '10 7 3', ...Array.from({ length: 6 }, () => { const n = r.int(1, 60); const k = r.int(1, n); return `${n} ${k} ${r.int(0, k)}`; })],
            check: (inp) => { const [n, k, t] = toks(inp).map(Number); return k >= 1 && k <= n && n <= 60 && t >= 0 && t <= k ? null : 'zakres'; },
            solve: (inp) => { const [n, k, t] = toks(inp).map(Number); return String(C(k, t) * C(n - k, k - t)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k, t;
    cin >> n >> k >> t;
    if (k - t > n - k) {
        cout << 0 << "\n";
        return 0;
    }
    long long c1 = 1, c2 = 1;
    for (long long i = 1; i <= t; i++) c1 = c1 * (k - t + i) / i;
    long long m = n - k, j = k - t;
    for (long long i = 1; i <= j; i++) c2 = c2 * (m - j + i) / i;
    cout << c1 * c2 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-droga-do-szkoly', krok: 9, level: 'srednie',
            title: 'Droga do szkoły',
            short: 'Wszystkie trasy minus trasy przez rozkopane skrzyżowanie.',
            tags: ['C(a + b, a)', 'odejmowanie złych tras', 'trasy przez punkt'],
            statement: ['Ania mieszka na skrzyżowaniu (0, 0), a szkoła stoi na skrzyżowaniu (a, b). Ania chodzi tylko na wschód (x rośnie o 1) albo na północ (y rośnie o 1). Dziś skrzyżowanie (x, y) jest rozkopane i nie da się przez nie przejść. Iloma trasami Ania może dojść do szkoły?'],
            input_format: ['Cztery liczby całkowite a, b, x i y.'],
            output_format: ['Jedna liczba — liczba tras omijających rozkopane skrzyżowanie.'],
            constraints: ['a + b ≤ 60', '0 ≤ x ≤ a, 0 ≤ y ≤ b', 'rozkopane skrzyżowanie to nie dom ani szkoła'],
            examples: [{ input: '2 2 1 1', note: 'Wszystkich tras jest 6, a przez (1, 1) prowadzą 4 z nich.' }, { input: '3 1 3 0' }],
            hint: R`Policz wszystkie trasy, C(a + b, a), i odejmij te, które przechodzą przez rozkopane skrzyżowanie — to trasy przez przystanek z części 8: C(x + y, x) · C((a − x) + (b − y), a − x). Wszystkie liczby mieszczą się w long long, bo C(60, 30) ≈ 1,2 · 10¹⁷.`,
            tests: (r) => {
                const out = ['2 2 1 1', '3 1 3 0', '30 30 15 15', '30 30 0 1', '30 30 30 29', '60 0 30 0', '1 1 1 0', '1 1 0 1', '59 1 20 0'];
                while (out.length < 15) { const a = r.int(0, 60); const b = r.int(0, 60 - a); const x = r.int(0, a), y = r.int(0, b); if ((x === 0 && y === 0) || (x === a && y === b)) continue; out.push(`${a} ${b} ${x} ${y}`); }
                return out;
            },
            check: (inp) => { const [a, b, x, y] = toks(inp).map(Number); return a >= 0 && b >= 0 && a + b <= 60 && x >= 0 && x <= a && y >= 0 && y <= b && !(x === 0 && y === 0) && !(x === a && y === b) ? null : 'zakres'; },
            solve: (inp) => { const [a, b, x, y] = toks(inp).map(Number); return String(C(a + b, a) - C(x + y, x) * C(a - x + b - y, a - x)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long dwumian(long long n, long long k) {
    long long c = 1;
    for (long long i = 1; i <= k; i++) c = c * (n - k + i) / i;
    return c;
}
int main() {
    long long a, b, x, y;
    cin >> a >> b >> x >> y;
    long long wszystkie = dwumian(a + b, a);
    long long przez = dwumian(x + y, x) * dwumian(a - x + b - y, a - x);
    cout << wszystkie - przez << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-mikolajki', krok: 9, level: 'srednie',
            title: 'Mikołajki',
            short: 'Ile losowań, w których nikt nie wylosował siebie? D(n) = (n − 1) · (D(n − 1) + D(n − 2)).',
            tags: ['nieporządki', 'dwie poprzednie wartości', 'long long'],
            statement: ['n osób losuje imiona do mikołajkowych prezentów: każdy losuje jedną karteczkę z imieniem, a wszystkie karteczki zostają rozlosowane. Losowanie jest udane, jeśli nikt nie wylosował samego siebie. Ile jest udanych losowań?'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba udanych losowań.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '3', note: 'Osoby 1, 2, 3 wylosowały 2, 3, 1 albo 3, 1, 2.' }, { input: '4' }, { input: '1' }],
            hint: R`Oznacz wynik przez D(n). D(1) = 0 (jedna osoba może wylosować tylko siebie), D(2) = 1, a dla n ≥ 3: D(n) = (n − 1) · (D(n − 1) + D(n − 2)). Skąd? Osoba 1 wylosowała kogoś — powiedzmy osobę j (n − 1 możliwości). Albo j wylosowała osobę 1 (wtedy pozostałe n − 2 osoby to osobne udane losowanie), albo nie (wtedy to jak udane losowanie n − 1 osób, w którym j zastępuje osobę 1). Licz D w pętli, trzymając dwie poprzednie wartości.`,
            tests: () => zakresy(1, 20),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 20 ? null : 'n'; },
            solve: (inp) => String(derangement(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long a = 1, b = 0; // D(0) i D(1)
    for (int i = 2; i <= n; i++) {
        long long c = (i - 1) * (a + b);
        a = b;
        b = c;
    }
    cout << b << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-rozklad-silni', krok: 9, level: 'srednie',
            title: 'Rozkład silni na czynniki',
            short: 'Wypisz n! jako 2^8 * 3^4 * 5^2 * 7^1 — sito i wzór Legendre’a.',
            tags: ['sito Eratostenesa', 'n / p + n / p² + …', 'separator *'],
            statement: ['Wczytaj n i wypisz rozkład liczby n! na czynniki pierwsze w postaci p1^e1 * p2^e2 * …, z liczbami pierwszymi w kolejności rosnącej (każdy czynnik z wykładnikiem, także gdy wykładnik to 1). Na przykład 10! = 2^8 * 3^4 * 5^2 * 7^1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz — rozkład n! na czynniki pierwsze.'],
            constraints: ['2 ≤ n ≤ 10 000'],
            examples: [{ input: '10' }, { input: '2' }],
            hint: R`Do n! wchodzą wszystkie liczby pierwsze ≤ n i tylko one — znajdź je sitem Eratostenesa (lekcja o tablicach). Wykładnik każdej liczby pierwszej p to n / p + n / p² + … (wzór z części 6: while (m > 0) { m /= p; e += m; }). Wypisuj " * " przed każdym czynnikiem oprócz pierwszego.`,
            tests: (r) => ['2', '3', '4', '10', '25', '100', '9973', '9999', '10000', ...Array.from({ length: 4 }, () => String(r.int(2, 10000)))],
            check: (inp) => { const n = Number(inp); return n >= 2 && n <= 10000 ? null : 'n'; },
            solve: (inp) => { const n = Number(inp); return pierwsze(n).map((p) => `${p}^${leg(n, p)}`).join(' * '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<bool> zlozona(n + 1, false);
    bool pierwszy = true;
    for (int p = 2; p <= n; p++) {
        if (zlozona[p]) continue;
        for (int j = 2 * p; j <= n; j += p) zlozona[j] = true;
        int m = n, e = 0;
        while (m > 0) {
            m /= p;
            e += m;
        }
        if (!pierwszy) cout << " * ";
        cout << p << "^" << e;
        pierwszy = false;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-numer-ustawienia', krok: 9, level: 'srednie',
            title: 'Numer ustawienia',
            short: 'Który w kolejności słownikowej jest ten układ liczb 1..n? Licz bloki po (n − 1)!, (n − 2)!, …',
            tags: ['permutacje', 'bloki po (n − 1)!', 'mniejsze niewykorzystane'],
            statement: ['Wszystkie ustawienia liczb od 1 do n układamy w kolejności słownikowej i numerujemy od 1. Dla n = 3 to: 1 2 3 (numer 1), 1 3 2 (2), 2 1 3 (3), 2 3 1 (4), 3 1 2 (5) i 3 2 1 (6). Wczytaj ustawienie i wypisz jego numer.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu ustawienie liczb od 1 do n (każda dokładnie raz).'],
            output_format: ['Jedna liczba — numer ustawienia.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '3\n2 3 1' }, { input: '4\n4 3 2 1', note: 'Ostatnie ustawienie ma numer 4! = 24.' }],
            hint: R`Spójrz na pierwszą liczbę. Wszystkie ustawienia zaczynające się od mniejszej liczby są wcześniej, a każdy taki początek ma (n − 1)! ustawień. Jeśli pierwsza liczba to 3, przed naszym jest 2 · (n − 1)! ustawień. Potem tak samo z drugą: policz, ile jeszcze niewykorzystanych liczb jest od niej mniejszych, i pomnóż przez (n − 2)!. I tak dalej, a na końcu dodaj 1. Wynik sięga 20! — long long.`,
            tests: (r) => {
                const perm = (n) => r.shuffle(zakresy(1, n)).join(' ');
                return ['1\n1', '3\n2 3 1', '4\n4 3 2 1', `20\n${zakresy(1, 20).join(' ')}`, `20\n${zakresy(1, 20).reverse().join(' ')}`, '2\n2 1', ...Array.from({ length: 8 }, () => { const n = r.int(2, 20); return `${n}\n${perm(n)}`; })];
            },
            check: (inp) => { const t = toks(inp).map(Number); const n = t[0]; const v = t.slice(1); return n >= 1 && n <= 20 && v.length === n && [...v].sort((a, b) => a - b).every((x, i) => x === i + 1) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(Number); const n = t[0]; const v = t.slice(1);
                const uzyte = new Set(); let nr = 0n;
                for (let i = 0; i < n; i++) { let mn = 0; for (let x = 1; x < v[i]; x++) if (!uzyte.has(x)) mn++; nr += B(mn) * fact(n - 1 - i); uzyte.add(v[i]); }
                return String(nr + 1n);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> p(n);
    for (int &x : p) cin >> x;
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    vector<bool> uzyta(n + 1, false);
    long long nr = 0;
    for (int i = 0; i < n; i++) {
        int mniejsze = 0;
        for (int x = 1; x < p[i]; x++) {
            if (!uzyta[x]) mniejsze++;
        }
        nr += mniejsze * f[n - 1 - i];
        uzyta[p[i]] = true;
    }
    cout << nr + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-iloczyn-silni-mod', krok: 9, level: 'srednie',
            title: 'Iloczyn silni modulo',
            short: '1! · 2! · … · n! mod 10⁹ + 7 — bieżąca silnia i bieżący iloczyn w jednej pętli.',
            tags: ['f = f * i % MOD', 'w = w * f % MOD', 'dwa akumulatory'],
            statement: ['Wczytaj n i wypisz resztę z dzielenia iloczynu 1! · 2! · 3! · … · n! przez 1 000 000 007.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — iloczyn silni modulo 10⁹ + 7.'],
            constraints: ['1 ≤ n ≤ 10 000 000'],
            examples: [{ input: '4', note: '1 · 2 · 6 · 24 = 288.' }, { input: '10000000' }],
            hint: R`Jak w sumie silni, tylko z mnożeniem: f = f * i % MOD (teraz f to reszta z i!) i wynik = wynik * f % MOD. Obie zmienne w long long — iloczyn dwóch reszt sięga 10¹⁸.`,
            tests: () => ['1', '2', '3', '4', '10', '13', '100', '1000000', '9999999', '10000000', '5000000'],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 10000000 ? null : 'n'; },
            solve: (inp) => { const n = Number(inp); let f = 1, w = 1; for (let i = 1; i <= n; i++) { f = mulmod(f, i); w = mulmod(w, f); } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    long long n;
    cin >> n;
    long long f = 1, w = 1;
    for (long long i = 1; i <= n; i++) {
        f = f * i % MOD;
        w = w * f % MOD;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-silnia-z-d-cyframi', krok: 9, level: 'srednie',
            title: 'Silnia z d cyframi',
            short: 'Najmniejsze n, którego silnia ma co najmniej d cyfr — logarytmy dokładane po kolei.',
            tags: ['log10', 'floor(L) + 1 >= d', 'pętla aż do skutku'],
            statement: ['Wczytaj d i wypisz najmniejsze n, dla którego liczba n! ma co najmniej d cyfr.'],
            input_format: ['Jedna liczba całkowita d.'],
            output_format: ['Jedna liczba — najmniejsze takie n.'],
            constraints: ['1 ≤ d ≤ 5 565 709 (tyle cyfr ma 1 000 000!)'],
            examples: [{ input: '3', note: '4! = 24 ma dwie cyfry, a 5! = 120 — trzy.' }, { input: '1', note: '0! = 1 ma już jedną cyfrę.' }, { input: '1000' }],
            hint: R`Dokładaj kolejne logarytmy: L = log10(1) + log10(2) + … + log10(n) i zatrzymaj się przy pierwszym n, dla którego floor(L) + 1 ≥ d (liczba cyfr z części 7). Zacznij od n = 0 i L = 0 — wtedy d = 1 obsłuży się samo. Odpowiedź nie przekroczy miliona.`,
            tests: (r) => {
                P.logi(1000000);
                const LA = P.LA();
                const odp = (d) => { let lo = 0, hi = 1000000; while (lo < hi) { const m = (lo + hi) >> 1; if (Math.floor(LA[m]) + 1 >= d) hi = m; else lo = m + 1; } return lo; };
                const ok = (d) => { const n = odp(d); return P.cyfryBezpieczne(n) && (n === 0 || P.cyfryBezpieczne(n - 1)); };
                const kand = ['1', '2', '3', '7', '19', '20', '158', '1000', '2568', '2569', '5565709', '5565708', ...Array.from({ length: 12 }, () => String(r.pick([r.int(1, 1000), r.int(1, 5565709)])))];
                return kand.filter((d) => ok(Number(d)));
            },
            check: (inp) => { const d = Number(inp); return d >= 1 && d <= 5565709 ? null : 'd'; },
            solve: (inp) => {
                const d = Number(inp);
                P.logi(1000000);
                const LA = P.LA();
                let lo = 0, hi = 1000000;
                while (lo < hi) { const m = (lo + hi) >> 1; if (Math.floor(LA[m]) + 1 >= d) hi = m; else lo = m + 1; }
                if (!P.cyfryBezpieczne(lo) || (lo > 0 && !P.cyfryBezpieczne(lo - 1))) throw new Error(`silnia z ${d} cyframi: za blisko granicy`);
                return String(lo);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long d;
    cin >> d;
    int n = 0;
    double L = 0;
    while ((long long)floor(L) + 1 < d) {
        n++;
        L += log10(n);
    }
    cout << n << "\n";
    return 0;
}`,
        },

        // ================================================================ trudne
        {
            id: 'sil-b-ostatnia-niezerowa', krok: 9, level: 'trudne',
            title: 'Ostatnia niezerowa cyfra olbrzyma',
            short: 'n do miliona: usuń z iloczynu pary 2 · 5, resztę mnóż modulo 10.',
            tags: ['usuń dwójki i piątki', 'w = w * x % 10', 'nadmiar dwójek'],
            statement: ['Wczytaj n i wypisz ostatnią niezerową cyfrę liczby n!. Tym razem n sięga miliona — silni nie da się policzyć nawet cyfra po cyfrze.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ n ≤ 1 000 000'],
            examples: [{ input: '10', note: '10! = 3 628 800.' }, { input: '1000000' }],
            hint: R`Zera na końcu robią pary 2 · 5 — trzeba je usunąć, zanim zaczniemy patrzeć na ostatnią cyfrę. Dla każdego i od 1 do n: x = i; dopóki x dzieli się przez 5 — dziel i licz piątki; dopóki dzieli się przez 2 — dziel i licz dwójki. To, co zostało z x, domnóż do wyniku modulo 10: w = w * (x % 10) % 10. Na końcu dwójek jest więcej niż piątek — te bez pary trzeba jeszcze domnożyć: (dwójki − piątki) razy w = w * 2 % 10.`,
            tests: (r) => ['0', '1', '4', '5', '10', '14', '15', '25', '100', '1000', '999999', '1000000', '390625', ...Array.from({ length: 5 }, () => String(r.int(2, 1000000)))],
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000000 ? null : 'n'; },
            solve: (inp) => {
                const n = Number(inp);
                let w = 1, d2 = 0, d5 = 0;
                for (let i = 2; i <= n; i++) { let x = i; while (x % 5 === 0) { x /= 5; d5++; } while (x % 2 === 0) { x /= 2; d2++; } w = (w * (x % 10)) % 10; }
                for (let k = 0; k < d2 - d5; k++) w = (w * 2) % 10;
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    long long dwojki = 0, piatki = 0;
    for (int i = 2; i <= n; i++) {
        int x = i;
        while (x % 5 == 0) {
            x /= 5;
            piatki++;
        }
        while (x % 2 == 0) {
            x /= 2;
            dwojki++;
        }
        w = w * (x % 10) % 10;
    }
    for (long long k = 0; k < dwojki - piatki; k++) w = w * 2 % 10;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-zera-w-systemie', krok: 9, level: 'trudne',
            title: 'Zera w innym systemie',
            short: 'Zera na końcu n! w systemie o podstawie b: rozłóż b i weź najrzadszy czynnik.',
            tags: ['rozkład b na czynniki', 'wzór Legendre’a', 'min po czynnikach'],
            statement: ['W systemie o podstawie b liczba kończy się tyloma zerami, ile razy dzieli się przez b. Na przykład 10! = 3 628 800 = 2⁸ · 14 175, więc w systemie dwójkowym kończy się 8 zerami, a w systemie dwunastkowym — 4 zerami (bo 12 = 2² · 3, a 10! zawiera 2⁸ i 3⁴).', 'Wczytaj n i b i wypisz, iloma zerami kończy się n! zapisane w systemie o podstawie b.'],
            input_format: ['Dwie liczby całkowite n i b.'],
            output_format: ['Jedna liczba — liczba zer na końcu n! w systemie o podstawie b.'],
            constraints: ['0 ≤ n ≤ 10¹⁸', '2 ≤ b ≤ 1 000 000'],
            examples: [{ input: '10 12' }, { input: '10 2' }, { input: '100 10' }],
            hint: R`Rozłóż b na czynniki pierwsze (dzielenie próbne do √b). Dla każdego czynnika p w potędze e policz wykładnik p w n! wzorem z części 6 (oznacz go v) i podziel: v / e mówi, ile pełnych „kopii” p^e mieści się w n!. Liczba zer to najmniejsza z tych wartości — decyduje najrzadszy czynnik, tak jak w systemie dziesiętnym decydowały piątki.`,
            tests: (r) => ['10 12', '10 2', '100 10', '0 2', '1 1000000', '1000000000000000000 2', '1000000000000000000 999983', '1000000000000000000 1000000', '1000000000000000000 720720', '5 1000000', '1000000 1000000',
                '100 49', '48 64', '1000000000000000000 524288', ...Array.from({ length: 6 }, () => `${r.pick([r.int(0, 1000), r.big(0, E18)])} ${r.int(2, 1000000)}`)],
            check: (inp) => { const t = toks(inp); const n = B(t[0]), b = Number(t[1]); return n >= 0n && n <= E18 && b >= 2 && b <= 1000000 ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp); let best = null; for (const [p, e] of rozklad(t[1])) { const v = leg(t[0], p) / e; if (best === null || v < best) best = v; } return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, b;
    cin >> n >> b;
    long long wynik = LLONG_MAX;
    for (long long p = 2; p <= b; p++) {
        if (p * p > b) p = b; // to, co zostało z b, jest liczbą pierwszą
        if (b % p != 0) continue;
        long long e = 0;
        while (b % p == 0) {
            b /= p;
            e++;
        }
        long long m = n, v = 0;
        while (m > 0) {
            m /= p;
            v += m;
        }
        wynik = min(wynik, v / e);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-najmniejsza-podzielna', krok: 9, level: 'trudne',
            title: 'Najmniejsza silnia podzielna przez k',
            short: 'Najmniejsze n, dla którego k dzieli n! — dla każdego czynnika p^e zbieraj p-ki po wielokrotnościach p.',
            tags: ['rozkład k na czynniki', 'wielokrotności p', 'max po czynnikach'],
            statement: ['Wczytaj k i wypisz najmniejsze dodatnie n, dla którego n! dzieli się przez k.'],
            input_format: ['Jedna liczba całkowita k.'],
            output_format: ['Jedna liczba — najmniejsze takie n.'],
            constraints: ['1 ≤ k ≤ 10¹²'],
            examples: [{ input: '10', note: '5! = 120 dzieli się przez 10, a 4! = 24 — nie.' }, { input: '16', note: '6! = 720 = 16 · 45, a 5! = 120 nie dzieli się przez 16.' }, { input: '1' }],
            hint: R`Rozłóż k na czynniki pierwsze (dzielenie próbne do √k, czyli najwyżej do miliona). Dla każdego czynnika p w potędze e znajdź najmniejsze m, którego silnia zawiera co najmniej e czynników p: idź po wielokrotnościach p (p, 2p, 3p, …) i dla każdej dodawaj, ile razy dzieli się przez p, aż uzbierasz e. Odpowiedź to największe z tych m — i co najmniej 1.`,
            tests: (r) => ['1', '2', '10', '16', '7', '1000000000000', '999999999989', '720', '1024', '362880', '524288', '999966000289', '2432902008', ...Array.from({ length: 6 }, () => String(r.pick([r.int(1, 1000000), r.big(1, 1000000000000n)])))],
            check: (inp) => { const k = B(inp); return k >= 1n && k <= 1000000000000n ? null : 'k'; },
            solve: (inp) => {
                let best = 1n;
                for (const [p, e] of rozklad(inp)) { let m = 0n, s = 0n; while (s < e) { m += p; s += krotnosc(m, p); } if (m > best) best = m; }
                return String(best);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long k;
    cin >> k;
    long long wynik = 1;
    for (long long p = 2; p <= k; p++) {
        if (p * p > k) p = k; // to, co zostało z k, jest liczbą pierwszą
        if (k % p != 0) continue;
        long long e = 0;
        while (k % p == 0) {
            k /= p;
            e++;
        }
        long long m = 0, s = 0;
        while (s < e) {
            m += p;
            long long x = m;
            while (x % p == 0) {
                x /= p;
                s++;
            }
        }
        wynik = max(wynik, m);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-dzielniki-silni', krok: 9, level: 'trudne',
            title: 'Ile dzielników ma silnia?',
            short: 'Liczba dzielników n! to (e₁ + 1) · (e₂ + 1) · … — sito, Legendre i modulo.',
            tags: ['sito', 'wykładniki z Legendre’a', '(e + 1) · …'],
            statement: ['Wczytaj n i wypisz, ile dzielników ma liczba n! — jako resztę z dzielenia przez 1 000 000 007. Na przykład 4! = 24 ma 8 dzielników: 1, 2, 3, 4, 6, 8, 12 i 24.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba dzielników n! modulo 10⁹ + 7.'],
            constraints: ['1 ≤ n ≤ 1 000 000'],
            examples: [{ input: '4', note: '24 = 2³ · 3¹, więc dzielników jest (3 + 1) · (1 + 1) = 8.' }, { input: '10' }, { input: '1000000' }],
            hint: R`Jeśli liczba ma rozkład p₁^e₁ · p₂^e₂ · …, to każdy jej dzielnik to p₁^a₁ · p₂^a₂ · … z 0 ≤ aᵢ ≤ eᵢ — dla p₁ masz e₁ + 1 możliwości, dla p₂ — e₂ + 1… Dzielników jest więc (e₁ + 1) · (e₂ + 1) · …. Liczby pierwsze do n znajdź sitem, wykładniki policz wzorem z części 6, a iloczyn licz modulo 10⁹ + 7 (long long).`,
            tests: (r) => ['1', '2', '3', '4', '10', '20', '100', '1000', '65536', '999999', '1000000', ...Array.from({ length: 3 }, () => String(r.int(1, 1000000)))],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 1000000 ? null : 'n'; },
            solve: (inp) => { const n = Number(inp); let w = 1; for (const p of pierwsze(n)) { let m = n, e = 0; while (m > 0) { m = Math.floor(m / p); e += m; } w = mulmod(w, (e + 1) % MODN); } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    int n;
    cin >> n;
    vector<bool> zlozona(n + 1, false);
    long long w = 1;
    for (int p = 2; p <= n; p++) {
        if (zlozona[p]) continue;
        for (long long j = 1LL * p * p; j <= n; j += p) zlozona[j] = true;
        long long m = n, e = 0;
        while (m > 0) {
            m /= p;
            e += m;
        }
        w = w * ((e + 1) % MOD) % MOD;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-numer-anagramu', krok: 9, level: 'trudne',
            title: 'Numer słowa w słowniku',
            short: 'Który alfabetycznie jest ten anagram swoich liter? Numer ustawienia z powtórzeniami.',
            tags: ['liczniki liter', 'm! / (a! · b! · …)', 'mniejsze litery najpierw'],
            statement: ['Wszystkie różne słowa, które da się ułożyć z liter danego słowa (każdej litery używamy tyle razy, ile razy występuje), układamy w kolejności alfabetycznej i numerujemy od 1. Na przykład dla słowa mama: aamm (1), amam (2), amma (3), maam (4), mama (5), mmaa (6). Wczytaj słowo i wypisz jego numer.'],
            input_format: ['Jedno słowo z małych liter alfabetu angielskiego.'],
            output_format: ['Jedna liczba — numer słowa.'],
            constraints: ['1 ≤ długość słowa ≤ 20'],
            examples: [{ input: 'mama' }, { input: 'kot', note: 'kot, kto, okt, otk, tko, tok — kot jest pierwszy.' }, { input: 'tok' }],
            hint: R`Jak w zadaniu „Numer ustawienia”, tylko z powtórzeniami. Trzymaj liczniki pozostałych liter. Na pozycji i, dla każdej litery c mniejszej od s[i], która jeszcze została, policz, ile słów zaczyna się od s[0..i − 1] i potem od c: to liczba anagramów liter, które zostaną po zabraniu jednego c — m! / (a! · b! · …) z części 8, gdzie m to liczba pozostałych liter. Dodaj te liczby, zabierz literę s[i] i idź dalej. Na końcu dodaj 1.`,
            tests: (r) => ['a', 'mama', 'kot', 'tok', 'aaaaaaaaaaaaaaaaaaaa', 'tsrqponmlkjihgfedcba', 'abcdefghijklmnopqrst', 'mississippi', 'bbbbbbbbbbaaaaaaaaaa', 'zyxzyxzyxzyxzyxzyxzz',
                ...Array.from({ length: 6 }, () => r.word(r.int(1, 20), r.pick(['ab', 'abc', 'abcdef', 'abcdefghijklmnopqrstuvwxyz'])))],
            check: (inp) => (/^[a-z]{1,20}$/.test(inp) ? null : 'słowo'),
            solve: (inp) => {
                const cnt = new Array(26).fill(0);
                for (const c of inp) cnt[c.charCodeAt(0) - 97]++;
                const anag = () => { let m = cnt.reduce((a, b) => a + b, 0); let w = fact(m); for (const c of cnt) w /= fact(c); return w; };
                let nr = 0n;
                for (const ch of inp) {
                    const x = ch.charCodeAt(0) - 97;
                    for (let c = 0; c < x; c++) if (cnt[c] > 0) { cnt[c]--; nr += anag(); cnt[c]++; }
                    cnt[x]--;
                }
                return String(nr + 1n);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    int ile[26] = {0};
    for (char c : s) ile[c - 'a']++;
    int m = s.size();
    long long nr = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        int x = s[i] - 'a';
        for (int c = 0; c < x; c++) {
            if (ile[c] == 0) continue;
            ile[c]--;
            long long w = f[m - 1];
            for (int j = 0; j < 26; j++) w /= f[ile[j]];
            nr += w;
            ile[c]++;
        }
        ile[x]--;
        m--;
    }
    cout << nr + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-cukierki', krok: 9, level: 'trudne',
            title: 'Cukierki dla dzieci',
            short: 'n jednakowych cukierków dla k dzieci: gwiazdki i kreski, czyli C(n + k − 1, k − 1).',
            tags: ['gwiazdki i kreski', 'C(n + k − 1, k − 1)', 'każdy co najmniej 1'],
            statement: ['Mama ma n jednakowych cukierków i rozdaje je k dzieciom — wszystkie cukierki muszą zostać rozdane. Sposoby różnią się tym, ile cukierków dostaje które dziecko.', 'W pierwszym wierszu wypisz, na ile sposobów mama może to zrobić, jeśli niektóre dzieci mogą nie dostać nic. W drugim — jeśli każde dziecko musi dostać co najmniej jeden cukierek.'],
            input_format: ['Dwie liczby całkowite n i k.'],
            output_format: ['Dwa wiersze: liczba sposobów bez warunku i z warunkiem „każdy co najmniej jeden”.'],
            constraints: ['0 ≤ n', '1 ≤ k', 'n + k ≤ 61'],
            examples: [{ input: '4 2', note: 'Bez warunku: 0+4, 1+3, 2+2, 3+1, 4+0. Każdy co najmniej jeden: 1+3, 2+2, 3+1.' }, { input: '2 3', note: 'Trojgu dzieciom nie da się dać po cukierku, mając tylko 2.' }],
            hint: R`Ułóż cukierki w rzędzie (gwiazdki) i wstaw między nie k − 1 kresek: wszystko przed pierwszą kreską dostaje pierwsze dziecko, między pierwszą a drugą — drugie, i tak dalej. Każdy podział to rząd n gwiazdek i k − 1 kresek na n + k − 1 miejscach — wybierasz tylko, gdzie stoją kreski: C(n + k − 1, k − 1). Gdy każde dziecko ma dostać coś, daj najpierw każdemu po cukierku i rozdziel pozostałe n − k dowolnie: C(n − 1, k − 1), a gdy n < k — 0.`,
            tests: (r) => ['4 2', '2 3', '0 1', '0 5', '60 1', '1 60', '30 31', '31 30', '45 16', '5 5', '6 5', ...Array.from({ length: 6 }, () => { const k = r.int(1, 61); return `${r.int(0, 61 - k)} ${k}`; })],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 0 && k >= 1 && n + k <= 61 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(Number); return `${C(n + k - 1, k - 1)}\n${n < k ? 0n : C(n - 1, k - 1)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long a = 1;
    for (long long i = 1; i <= k - 1; i++) a = a * (n + i) / i;
    long long b = 0;
    if (n >= k) {
        b = 1;
        for (long long i = 1; i <= k - 1; i++) b = b * (n - k + i) / i;
    }
    cout << a << "\n" << b << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-pierwsze-cyfry', krok: 9, level: 'trudne',
            title: 'Pierwsze trzy cyfry olbrzyma',
            short: 'Trzy pierwsze cyfry n! dla n do miliona: (int)pow(10, f + 2).',
            tags: ['log10', 'część ułamkowa', 'pow(10, f + 2)'],
            statement: ['Wczytaj n i wypisz trzy pierwsze cyfry liczby n!. Na przykład 10! = 3 628 800 zaczyna się od 362.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba trzycyfrowa.'],
            constraints: ['10 ≤ n ≤ 1 000 000'],
            examples: [{ input: '10' }, { input: '100', note: '100! = 93326215443944… — zaczyna się od 933.' }],
            hint: R`Jak w zadaniu „Pierwsza cyfra silni”: L = log10(1) + … + log10(n), f = L − floor(L) i n! = 10^f · 10^floor(L), gdzie 1 ≤ 10^f < 10. Pierwsze trzy cyfry to część całkowita z 10^f · 100 = 10^(f + 2), czyli (int)pow(10, f + 2).`,
            tests: (r) => ['10', '11', '20', '25', '100', '1000', '10000', '100000', '999999', '1000000', ...Array.from({ length: 12 }, () => String(r.pick([r.int(10, 1000), r.int(10, 1000000)])))].filter((n) => P.pierwszeBezpieczne(Number(n), 3)),
            check: (inp) => { const n = Number(inp); return n >= 10 && n <= 1000000 && P.pierwszeBezpieczne(n, 3) ? null : 'n'; },
            solve: (inp) => String(P.pierwszeCyfry(Number(inp), 3)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    double L = 0;
    for (int i = 1; i <= n; i++) L += log10(i);
    double f = L - floor(L);
    cout << (int)pow(10, f + 2) << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-b-wielki-final', krok: 9, level: 'trudne',
            title: 'Wielki finał: kalkulator silni',
            short: 'Sześć poleceń w jednym programie: silnia, zera, modulo, cyfry, dwumian i „czy to silnia?”.',
            tags: ['wszystko z lekcji', 'tablica logarytmów', 'string z poleceniem'],
            statement: ['Napisz kalkulator silni, który wykona q poleceń. Każde polecenie to słowo i jedna albo dwie liczby:',
                'SILNIA n — wypisz n! (0 ≤ n ≤ 20);',
                'ZERA n — wypisz, iloma zerami kończy się n! (0 ≤ n ≤ 10¹⁸);',
                'MOD n m — wypisz n! mod m (0 ≤ n ≤ 10¹⁸, 2 ≤ m ≤ 100 000);',
                'CYFRY n — wypisz, ile cyfr ma n! (0 ≤ n ≤ 1 000 000);',
                'DWUMIAN n k — wypisz C(n, k) (0 ≤ k ≤ n ≤ 60);',
                'CZY x — wypisz najmniejsze n, dla którego n! = x, albo NIE (1 ≤ x ≤ 10¹⁸).',
                'Wynik każdego polecenia wypisz w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W kolejnych q wierszach polecenia.'],
            output_format: ['q wierszy — wyniki kolejnych poleceń.'],
            constraints: ['1 ≤ q ≤ 1000', 'liczby w poleceniach jak w treści'],
            examples: [{ input: '6\nSILNIA 5\nZERA 100\nMOD 6 7\nCYFRY 1000000\nDWUMIAN 49 6\nCZY 120' }],
            hint: R`Wczytuj słowo do stringa i rozgałęź się ifami. SILNIA — tablica f[0..20]. ZERA — while (n > 0) { n /= 5; z += n; }. MOD — jeśli n ≥ m, to 0, a inaczej pętla w = w * i % m. CYFRY — tysiąc poleceń po milion logarytmów to za dużo: policz raz tablicę L[i] = L[i − 1] + log10(i) (milion liczb double, poza main) i wypisuj (long long)floor(L[n]) + 1. DWUMIAN — c = c * (n - k + i) / i. CZY — kolejne silnie, dopóki są mniejsze od x.`,
            tests: (r) => {
                const bezp = () => { for (;;) { const n = r.pick([r.int(0, 30), r.int(0, 1000000)]); if (P.cyfryBezpieczne(n)) return n; } };
                const pol = () => {
                    const k = r.int(0, 5);
                    if (k === 0) return `SILNIA ${r.int(0, 20)}`;
                    if (k === 1) return `ZERA ${r.pick([r.int(0, 1000), r.big(0, E18)])}`;
                    if (k === 2) { const m = r.int(2, 100000); return `MOD ${r.pick([r.int(0, m - 1), r.int(0, 100000), r.big(0, E18)])} ${m}`; }
                    if (k === 3) return `CYFRY ${bezp()}`;
                    if (k === 4) { const n = r.int(0, 60); return `DWUMIAN ${n} ${r.int(0, n)}`; }
                    return `CZY ${r() < 0.5 ? fact(r.int(0, 19)) : r.pick([r.big(1, E18), fact(r.int(2, 19)) + 1n])}`;
                };
                return ['1\nSILNIA 0', '1\nCZY 1', '1\nMOD 99999 100000', '1\nCYFRY 0', '3\nZERA 0\nZERA 1000000000000000000\nDWUMIAN 60 30',
                    `1000\n${Array.from({ length: 1000 }, pol).join('\n')}`, `200\n${Array.from({ length: 200 }, () => `MOD ${r.int(90000, 99998)} 99999`).join('\n')}`];
            },
            check: (inp) => {
                const L = inp.split('\n'); const q = Number(L[0]); if (L.length !== q + 1 || q > 1000) return 'liczba';
                for (const l of L.slice(1)) {
                    const [c, a, b] = l.split(' ');
                    if (c === 'SILNIA' && !(Number(a) >= 0 && Number(a) <= 20)) return l;
                    if (c === 'ZERA' && !(B(a) >= 0n && B(a) <= E18)) return l;
                    if (c === 'MOD' && !(B(a) >= 0n && B(a) <= E18 && Number(b) >= 2 && Number(b) <= 100000)) return l;
                    if (c === 'CYFRY' && !(Number(a) >= 0 && Number(a) <= 1000000 && P.cyfryBezpieczne(Number(a)))) return l;
                    if (c === 'DWUMIAN' && !(Number(b) >= 0 && Number(b) <= Number(a) && Number(a) <= 60)) return l;
                    if (c === 'CZY' && !(B(a) >= 1n && B(a) <= E18)) return l;
                    if (!['SILNIA', 'ZERA', 'MOD', 'CYFRY', 'DWUMIAN', 'CZY'].includes(c)) return l;
                }
                return null;
            },
            solve: (inp) => inp.split('\n').slice(1).map((l) => {
                const [c, a, b] = l.split(' ');
                if (c === 'SILNIA') return String(fact(Number(a)));
                if (c === 'ZERA') return String(leg(a, 5));
                if (c === 'MOD') { const n = B(a), m = B(b); if (n >= m) return '0'; let w = 1n; for (let i = 2n; i <= n; i++) w = (w * i) % m; return String(w); }
                if (c === 'CYFRY') return String(P.cyfry(Number(a)));
                if (c === 'DWUMIAN') return String(C(Number(a), Number(b)));
                const x = B(a); let n = 0; while (fact(n) < x) n++; return fact(n) === x ? String(n) : 'NIE';
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
double L[1000001];
int main() {
    long long f[21];
    f[0] = 1;
    for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
    L[0] = 0;
    for (int i = 1; i <= 1000000; i++) L[i] = L[i - 1] + log10(i);
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        string c;
        cin >> c;
        if (c == "SILNIA") {
            int n;
            cin >> n;
            cout << f[n] << "\n";
        } else if (c == "ZERA") {
            long long n, z = 0;
            cin >> n;
            while (n > 0) {
                n /= 5;
                z += n;
            }
            cout << z << "\n";
        } else if (c == "MOD") {
            long long n, m;
            cin >> n >> m;
            if (n >= m) {
                cout << 0 << "\n";
                continue;
            }
            long long w = 1;
            for (long long i = 2; i <= n; i++) w = w * i % m;
            cout << w << "\n";
        } else if (c == "CYFRY") {
            int n;
            cin >> n;
            cout << (long long)floor(L[n]) + 1 << "\n";
        } else if (c == "DWUMIAN") {
            long long n, k, w = 1;
            cin >> n >> k;
            for (long long i = 1; i <= k; i++) w = w * (n - k + i) / i;
            cout << w << "\n";
        } else {
            long long x, w = 1;
            cin >> x;
            int n = 0;
            while (w < x) {
                n++;
                w *= n;
            }
            if (w == x) cout << n << "\n";
            else cout << "NIE\n";
        }
    }
    return 0;
}`,
        },
    ];
};
