// For loop — baza zadań na koniec tematu (krok 9).
// Kolejność = kolejność w lekcji i w sprawdzarce: najpierw łatwe, potem średnie, na końcu trudne.
// Każde zadanie łączy kilka zagadnień z lekcji (pole tags). Bez tablic — ich jeszcze nie znamy.
module.exports = (h) => {
    const { nums, toks, join, fx, safe } = h;
    const R = String.raw;
    const K = 9;
    const z2 = (n) => String(n).padStart(2, '0');
    const range = (a, b) => { const o = []; for (let x = a; x <= b; x++) o.push(x); return o; };
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const pierwsza = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
    const sumaDzielnikowWlasciwych = (n) => { if (n === 1) return 0; let s = 1; for (let d = 2; d * d <= n; d++) if (n % d === 0) { s += d; if (d !== n / d) s += n / d; } return s; };
    const sumCyfr = (n) => { let s = 0; while (n > 0) { s += n % 10; n = Math.floor(n / 10); } return s; };
    const IMIONA = ['Ala', 'Ola', 'Kuba', 'Zosia', 'Antek', 'Igor', 'Maja', 'Lena', 'Franek', 'Hania', 'Tymek', 'Julia', 'Stas', 'Nina', 'Wojtek', 'Ewa'];

    return [
        // ================================================================ łatwe
        {
            id: 'for-kwadrat-sumy', krok: K, level: 'latwe',
            title: 'Kwadrat sumy kontra suma kwadratów',
            short: 'Policz (1 + … + n)² oraz 1² + … + n² i wypisz różnicę.',
            tags: ['for', 'dwa akumulatory', 'long long'],
            statement: ['Wczytaj n. Policz kwadrat sumy liczb od 1 do n, czyli (1 + 2 + … + n)², oraz sumę kwadratów tych liczb, czyli 1² + 2² + … + n². Wypisz różnicę: kwadrat sumy minus suma kwadratów.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '3', note: '(1 + 2 + 3)² = 36, a 1 + 4 + 9 = 14. Różnica: 22.' }, { input: '10' }],
            hint: R`Jedna pętla, dwa akumulatory: suma += i; sumaKw += i * i;. Kwadrat sumy policz dopiero po pętli. Dla n = 10 000 kwadrat sumy ma 16 cyfr — long long.`,
            tests: (r) => ['3', '10', '1', '2', '10000', '9999', String(r.int(3, 9998))],
            solve: (inp) => { const n = nums(inp)[0]; let s = 0, q = 0; for (let i = 1; i <= n; i++) { s += i; q += i * i; } return String(s * s - q); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long suma = 0, sumaKw = 0;
    for (long long i = 1; i <= n; i++) {
        suma += i;
        sumaKw += i * i;
    }
    cout << suma * suma - sumaKw << "\n";
    return 0;
}`,
        },
        {
            id: 'for-alfabet', krok: K, level: 'latwe',
            title: 'Kawałek alfabetu',
            short: 'Wypisz litery od c1 do c2 — licznikiem pętli jest znak.',
            tags: ['for po znakach', "char c = c1; c <= c2; c++"],
            statement: ['Wczytaj dwie małe litery c1 i c2 (c1 nie stoi w alfabecie dalej niż c2). W pierwszym wierszu wypisz wszystkie litery od c1 do c2 włącznie, oddzielone spacjami, a w drugim — ile ich jest.'],
            input_format: ['Jeden wiersz z dwiema małymi literami.'],
            output_format: ['Dwa wiersze.'],
            constraints: ['litery alfabetu angielskiego, c1 ≤ c2'],
            examples: [{ input: 'c h' }, { input: 'a z' }],
            hint: R`for (char c = c1; c <= c2; c++) cout << c << " ";. Liczbę liter policzysz licznikiem albo od razu wzorem c2 − c1 + 1.`,
            tests: (r) => { const a = r.int(0, 25), b = r.int(a, 25); return ['c h', 'a z', 'q q', 'a b', 'y z', `${LITERY[a]} ${LITERY[b]}`]; },
            check: (inp) => { const [a, b] = toks(inp); return a <= b ? null : 'c1 > c2'; },
            solve: (inp) => { const [a, b] = toks(inp); const o = []; for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c++) o.push(String.fromCharCode(c)); return join(o.join(' '), String(o.length)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c1, c2;
    cin >> c1 >> c2;
    int ile = 0;
    for (char c = c1; c <= c2; c++) {
        cout << c << " ";
        ile++;
    }
    cout << "\n" << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-co-k-ty-znak', krok: K, level: 'latwe',
            title: 'Co k-ty znak',
            short: 'Sklej znaki z pozycji k, 2k, 3k, … — uwaga, w napisie numerujemy od zera.',
            tags: ['for po napisie', 'i += k', 'numeracja od 0'],
            statement: ['Wczytaj słowo i liczbę k. Wypisz napis złożony ze znaków, które stoją na pozycjach k, 2k, 3k, … (pozycje liczymy od 1). Jeśli k jest większe od długości słowa, wypisz BRAK.'],
            input_format: ['Jeden wiersz: słowo i liczba k.'],
            output_format: ['Jeden napis albo słowo BRAK.'],
            constraints: ['1 ≤ długość słowa ≤ 1000', '1 ≤ k ≤ 2000'],
            examples: [{ input: 'programowanie 3' }, { input: 'kot 4' }],
            hint: R`Pozycja k (liczona od 1) to indeks k − 1 w napisie. Pętla: for (int i = k - 1; i < s.length(); i += k) wynik += s[i];. Gdy pętla nic nie dołożyła, wypisz BRAK.`,
            tests: (r) => ['programowanie 3', 'kot 4', 'a 1', 'kot 3', `${r.word(1000)} 1`, `${r.word(1000)} 999`, `${r.word(50)} ${r.int(2, 10)}`, `${r.word(10)} 2000`],
            solve: (inp) => { const [s, k] = toks(inp); let o = ''; for (let i = Number(k) - 1; i < s.length; i += Number(k)) o += s[i]; return o || 'BRAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    string wynik = "";
    for (int i = k - 1; i < s.length(); i += k) {
        wynik += s[i];
    }
    if (wynik == "") {
        cout << "BRAK\n";
    } else {
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-upaly', krok: K, level: 'latwe',
            title: 'Upalne dni',
            short: 'Ile dni było upalnych (powyżej 30 stopni) i który był pierwszy?',
            tags: ['for', 'licznik', 'pierwsze wystąpienie'],
            statement: ['Wczytaj n, a potem temperatury z n kolejnych dni (dni numerujemy od 1). W pierwszym wierszu wypisz upalne dni: c, gdzie c to liczba dni z temperaturą powyżej 30 stopni. W drugim wierszu wypisz pierwszy upal: d — numer pierwszego takiego dnia, albo pierwszy upal: brak, jeśli upałów nie było.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 365', 'temperatury od −30 do 45'],
            examples: [{ input: '7\n28 31 30 33 25 35 29' }, { input: '2\n10 12' }],
            hint: R`Licznik zwiększasz przy każdym upale, a numer dnia zapamiętujesz tylko przy pierwszym (gdy zmienna pierwszy wciąż wynosi 0). Pętla od 1: for (int d = 1; d <= n; d++) — wtedy d to od razu numer dnia.`,
            tests: (r) => ['7\n28 31 30 33 25 35 29', '2\n10 12', '1\n31', '1\n30', `365\n${r.arr(365, -30, 45).join(' ')}`, `20\n${r.arr(20, 20, 35).join(' ')}`],
            solve: (inp) => { const a = nums(inp).slice(1); const i = a.findIndex((t) => t > 30); return join(`upalne dni: ${a.filter((t) => t > 30).length}`, `pierwszy upal: ${i < 0 ? 'brak' : i + 1}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int upalne = 0, pierwszy = 0;
    for (int d = 1; d <= n; d++) {
        int t;
        cin >> t;
        if (t > 30) {
            upalne++;
            if (pierwszy == 0) {
                pierwszy = d;
            }
        }
    }
    cout << "upalne dni: " << upalne << "\n";
    if (pierwszy == 0) {
        cout << "pierwszy upal: brak\n";
    } else {
        cout << "pierwszy upal: " << pierwszy << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-ciag-powtorzen', krok: K, level: 'latwe',
            title: 'Jedynka raz, dwójka dwa razy',
            short: 'Wypisz 1 2 2 3 3 3 4 4 4 4 … — liczba i powtarza się i razy.',
            tags: ['for w for', 'wewnętrzna zależy od zewnętrznej'],
            statement: ['Wczytaj n i wypisz w jednym wierszu ciąg, w którym liczba 1 występuje raz, liczba 2 — dwa razy, liczba 3 — trzy razy, i tak dalej aż do liczby n, która występuje n razy.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z liczbami.'],
            constraints: ['1 ≤ n ≤ 40'],
            examples: [{ input: '4' }],
            hint: R`Zewnętrzna pętla wybiera liczbę i, wewnętrzna wypisuje ją i razy: for (int k = 0; k < i; k++) cout << i << " ";.`,
            tests: (r) => ['4', '1', '2', '40', String(r.int(5, 39))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let i = 1; i <= n; i++) for (let k = 0; k < i; k++) o.push(i); return o.join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int k = 0; k < i; k++) {
            cout << i << " ";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-wykres', krok: K, level: 'latwe',
            title: 'Wykres słupkowy',
            short: 'Dla każdej liczby narysuj słupek z tylu znaków #, ile wynosi.',
            tags: ['for w for', 'cin w pętli'],
            statement: ['Wczytaj n, a potem n liczb całkowitych od 0 do 50. Dla każdej liczby v wypisz w osobnym wierszu: v, dwukropek, spację i v znaków #.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb.'],
            output_format: ['n wierszy, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 50', '0 ≤ każda liczba ≤ 50'],
            examples: [{ input: '4\n3 7 0 5' }],
            hint: R`W pętli wczytującej liczby stoi druga pętla: for (int k = 0; k < v; k++) cout << "#";. Dla v = 0 wewnętrzna pętla nie wykona się ani razu — i dobrze.`,
            tests: (r) => ['4\n3 7 0 5', '1\n0', '1\n50', `50\n${r.arr(50, 0, 50).join(' ')}`, `8\n${r.arr(8, 0, 10).join(' ')}`],
            solve: (inp) => nums(inp).slice(1).map((v) => `${v}: ${'#'.repeat(v)}`).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int v;
        cin >> v;
        cout << v << ": ";
        for (int k = 0; k < v; k++) {
            cout << "#";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-celsjusz', krok: K, level: 'latwe',
            title: 'Tabela Celsjusz — Fahrenheit',
            short: 'Od a do b co k stopni Celsjusza: przelicz na Fahrenheity z jednym miejscem po przecinku.',
            tags: ['for', 'i += k', 'double', 'setprecision'],
            statement: ['Temperaturę w stopniach Fahrenheita liczy się ze wzoru F = C · 9 / 5 + 32. Wczytaj a, b i k i wypisz tabelę: dla C = a, a + k, a + 2k, … (nie większych od b) wypisz w osobnym wierszu C, napis -> i F z jednym miejscem po przecinku.'],
            input_format: ['Jeden wiersz z liczbami całkowitymi a, b i k.'],
            output_format: ['Wiersze w postaci C -> F, jak w przykładzie.'],
            constraints: ['−50 ≤ a ≤ b ≤ 150', '1 ≤ k ≤ 50'],
            examples: [{ input: '0 40 10' }],
            hint: R`Pętla for (int c = a; c <= b; c += k), w środku double f = c * 9.0 / 5 + 32;. Zapis 9.0 (a nie 9) wymusza liczenie na double. Na początku programu ustaw raz cout << fixed << setprecision(1).`,
            tests: (r) => ['0 40 10', '-50 150 1', '-40 -40 5', '37 38 50', `${r.int(-50, 0)} ${r.int(0, 150)} ${r.int(1, 20)}`],
            check: (inp) => { const [a, b, k] = nums(inp); if (a > b) return 'a > b'; for (let c = a; c <= b; c += k) if (!safe(c * 9 / 5 + 32, 1)) return 'połówka'; return null; },
            solve: (inp) => { const [a, b, k] = nums(inp); const o = []; for (let c = a; c <= b; c += k) o.push(`${c} -> ${fx(c * 9.0 / 5 + 32, 1)}`); return o.join('\n'); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b, k;
    cin >> a >> b >> k;
    cout << fixed << setprecision(1);
    for (int c = a; c <= b; c += k) {
        double f = c * 9.0 / 5 + 32;
        cout << c << " -> " << f << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-pary-wieksza', krok: K, level: 'latwe',
            title: 'Większa z każdej pary',
            short: 'n par liczb: dla każdej wypisz większą, a na końcu — ile par było remisowych.',
            tags: ['for', 'dwie liczby w obrocie', 'licznik'],
            statement: ['Wczytaj n, a potem n par liczb całkowitych. Dla każdej pary wypisz w osobnym wierszu większą z dwóch liczb. W ostatnim wierszu wypisz rowne: k, gdzie k to liczba par, w których obie liczby są równe.'],
            input_format: ['W pierwszym wierszu n, w każdym z kolejnych n wierszy dwie liczby.'],
            output_format: ['n + 1 wierszy.'],
            constraints: ['1 ≤ n ≤ 1000', 'liczby od −10⁹ do 10⁹'],
            examples: [{ input: '3\n4 9\n-2 -7\n5 5' }],
            hint: R`W każdym obrocie wczytaj dwie liczby, wypisz większą (if albo max(a, b)) i jeśli a == b, zwiększ licznik remisów.`,
            tests: (r) => ['3\n4 9\n-2 -7\n5 5', '1\n0 0', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${r.int(1, 3)} ${r.int(1, 3)}`).join('\n')}`],
            solve: (inp) => { const a = nums(inp); const n = a[0]; const o = []; let k = 0; for (let i = 0; i < n; i++) { const x = a[1 + 2 * i], y = a[2 + 2 * i]; o.push(String(Math.max(x, y))); if (x === y) k++; } return join(o, `rowne: ${k}`); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    int rowne = 0;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        cout << max(a, b) << "\n";
        if (a == b) {
            rowne++;
        }
    }
    cout << "rowne: " << rowne << "\n";
    return 0;
}`,
        },
        {
            id: 'for-silnie', krok: K, level: 'latwe',
            title: 'Wszystkie silnie po kolei',
            short: 'Wypisz 1!, 2!, …, n! jedną pętlą — każda silnia to poprzednia razy i.',
            tags: ['for', 'iloczyn na bieżąco', 'long long'],
            statement: ['Wczytaj n i wypisz n wierszy: w wierszu i jest napis i! = wartość silni i!, np. 4! = 24.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy w postaci i! = wartość.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '5' }],
            hint: R`Nie licz każdej silni od nowa! i! = (i − 1)! · i, więc wystarczy jedna zmienna long long s = 1; i w pętli: s *= i; wypisz s.`,
            tests: () => ['5', '1', '20', '13', '2'],
            solve: (inp) => { const n = nums(inp)[0]; let s = 1n; const o = []; for (let i = 1; i <= n; i++) { s *= BigInt(i); o.push(`${i}! = ${s}`); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long s = 1;
    for (int i = 1; i <= n; i++) {
        s *= i;
        cout << i << "! = " << s << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ średnie
        {
            id: 'for-liczby-nivena', krok: K, level: 'srednie',
            title: 'Liczby Nivena',
            short: 'Ile liczb z przedziału dzieli się przez sumę swoich cyfr? Pętla po cyfrach w pętli po liczbach.',
            tags: ['for', 'suma cyfr w środku', 'licznik'],
            statement: ['Liczba Nivena dzieli się bez reszty przez sumę swoich cyfr, np. 18 (1 + 8 = 9, a 18 dzieli się przez 9) albo 201 (suma cyfr 3). Wczytaj a i b i wypisz, ile liczb Nivena jest w przedziale od a do b.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 1 000 000'],
            examples: [{ input: '10 20', note: '10, 12, 18 i 20.' }, { input: '1 9' }],
            hint: R`Dla każdej liczby x z przedziału policz sumę jej cyfr na kopii (pętla while z % 10 i / 10), a potem sprawdź x % suma == 0. Kopia jest konieczna — licznika pętli for nie wolno niszczyć.`,
            tests: (r) => ['10 20', '1 9', '1 1', '1 1000000', '999999 1000000', `${r.int(1, 5e5)} ${r.int(5e5, 1e6)}`, `${r.int(1, 1000)} ${r.int(1000, 5000)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let c = 0; for (let x = a; x <= b; x++) if (x % sumCyfr(x) === 0) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int ile = 0;
    for (int x = a; x <= b; x++) {
        int suma = 0;
        for (int k = x; k > 0; k /= 10) {
            suma += k % 10;
        }
        if (x % suma == 0) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-seria-rosnaca', krok: K, level: 'srednie',
            title: 'Najdłuższy wzrost',
            short: 'Najdłuższy fragment ciągu, w którym każda liczba jest większa od poprzedniej.',
            tags: ['for', 'poprzednia liczba', 'seria i rekord'],
            statement: ['Wczytaj n, a potem n liczb całkowitych. Wypisz długość najdłuższego spójnego fragmentu (kilku liczb stojących obok siebie), w którym każda liczba jest większa od poprzedniej. Pojedyncza liczba to fragment o długości 1.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10 000', 'każda liczba od −10⁹ do 10⁹'],
            examples: [{ input: '8\n5 1 2 4 4 7 8 9' }, { input: '3\n3 2 1' }],
            hint: R`Bieżąca seria: gdy x > poprz, seria++; w przeciwnym razie seria = 1. Po każdej liczbie aktualizuj rekord. Pamiętaj o poprz = x; na końcu obrotu.`,
            tests: (r) => ['8\n5 1 2 4 4 7 8 9', '3\n3 2 1', '1\n7', `10000\n${range(1, 10000).join(' ')}`, `10000\n${r.arr(10000, -1e9, 1e9).join(' ')}`, `40\n${r.arr(40, 1, 6).join(' ')}`],
            solve: (inp) => { const a = nums(inp).slice(1); let best = 1, cur = 1; for (let i = 1; i < a.length; i++) { cur = a[i] > a[i - 1] ? cur + 1 : 1; best = Math.max(best, cur); } return String(best); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, poprz;
    cin >> n >> poprz;
    int seria = 1, rekord = 1;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        if (x > poprz) {
            seria++;
        } else {
            seria = 1;
        }
        if (seria > rekord) {
            rekord = seria;
        }
        poprz = x;
    }
    cout << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'for-trojkat-floyda', krok: K, level: 'srednie',
            title: 'Trójkąt Floyda',
            short: 'Kolejne liczby naturalne ułożone w trójkąt: 1 / 2 3 / 4 5 6 / …',
            tags: ['for w for', 'licznik poza pętlami'],
            statement: ['Wczytaj n i wypisz n wierszy trójkąta Floyda: w wierszu numer w jest w kolejnych liczb naturalnych, a liczby idą dalej od miejsca, w którym skończył się poprzedni wiersz — 1, potem 2 3, potem 4 5 6 i tak dalej.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy z liczbami oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 60'],
            examples: [{ input: '4' }],
            hint: R`Oprócz liczników pętli potrzebujesz trzeciej zmiennej — następnej liczby do wypisania. Tworzysz ją przed obiema pętlami (int x = 1;), a w wewnętrznej wypisujesz x i zwiększasz: cout << x << " "; x++;. Dzięki temu nie zeruje się między wierszami.`,
            tests: (r) => ['4', '1', '2', '60', String(r.int(5, 59))],
            solve: (inp) => { const n = nums(inp)[0]; let x = 1; const o = []; for (let w = 1; w <= n; w++) { const row = []; for (let k = 0; k < w; k++) row.push(x++); o.push(row.join(' ')); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int x = 1;
    for (int w = 1; w <= n; w++) {
        for (int k = 0; k < w; k++) {
            cout << x << " ";
            x++;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-romb', krok: K, level: 'srednie',
            title: 'Romb',
            short: 'Choinka i odwrócona choinka razem — szerokość wiersza najpierw rośnie, potem maleje.',
            tags: ['for w for', 'dwie połówki', 'wzór na szerokość'],
            statement: ['Wczytaj n i narysuj romb z gwiazdek o 2n − 1 wierszach. W najszerszym, środkowym wierszu jest 2n − 1 gwiazdek, a każdy wiersz wyżej i niżej ma o dwie gwiazdki mniej, aż do jednej. Gwiazdki są wyśrodkowane: z lewej strony dopisz tyle kropek, ile trzeba (z prawej — nic).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['2n − 1 wierszy.'],
            constraints: ['1 ≤ n ≤ 30'],
            examples: [{ input: '3' }],
            hint: R`Najprościej dwiema pętlami wierszy: pierwsza dla w od 1 do n (n − w kropek i 2w − 1 gwiazdek, jak w choince), druga dla w od n − 1 w dół do 1 — z tym samym wnętrzem. Można też jedną pętlą po wierszach i wzorem na w.`,
            tests: (r) => ['3', '1', '2', '30', String(r.int(4, 29))],
            solve: (inp) => { const n = nums(inp)[0]; const row = (w) => '.'.repeat(n - w) + '*'.repeat(2 * w - 1); const o = []; for (let w = 1; w <= n; w++) o.push(row(w)); for (let w = n - 1; w >= 1; w--) o.push(row(w)); return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int r = 1; r <= 2 * n - 1; r++) {
        int w = r;
        if (r > n) {
            w = 2 * n - r;
        }
        for (int k = 0; k < n - w; k++) {
            cout << ".";
        }
        for (int k = 0; k < 2 * w - 1; k++) {
            cout << "*";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-litera-x', krok: K, level: 'srednie',
            title: 'Litera X',
            short: 'Kwadrat n × n z # na obu przekątnych — warunek na numer wiersza i kolumny.',
            tags: ['for w for', 'przekątne', '||'],
            statement: ['Wczytaj n i narysuj kwadrat n × n, w którym na obu przekątnych stoi znak #, a na pozostałych polach kropka. Wiersze i kolumny numerujemy od 0: pole (w, k) leży na przekątnej, gdy w = k albo w + k = n − 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy po n znaków.'],
            constraints: ['1 ≤ n ≤ 40'],
            examples: [{ input: '5' }, { input: '4' }],
            hint: R`Dwie pętle od 0 do n − 1, a w środku: if (w == k || w + k == n - 1) cout << "#"; else cout << ".";.`,
            tests: (r) => ['5', '4', '1', '2', '40', '39', String(r.int(6, 38))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let w = 0; w < n; w++) { let s = ''; for (let k = 0; k < n; k++) s += w === k || w + k === n - 1 ? '#' : '.'; o.push(s); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < n; k++) {
            if (w == k || w + k == n - 1) {
                cout << "#";
            } else {
                cout << ".";
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-warstwy', krok: K, level: 'srednie',
            title: 'Warstwy kwadratu',
            short: 'Każde pole to numer warstwy: odległość od najbliższego brzegu plus 1.',
            tags: ['for w for', 'minimum z czterech', 'wzór na pole'],
            statement: ['Wczytaj n i wypisz kwadrat n × n z cyfr. Brzeg kwadratu to warstwa 1, pola tuż przy brzegu — warstwa 2, i tak dalej do środka. W każdym polu wypisz numer jego warstwy (bez spacji między cyframi).', 'Gdy wiersze i kolumny numerujemy od 0, numer warstwy pola (w, k) to najmniejsza z liczb w, k, n − 1 − w, n − 1 − k, powiększona o 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy po n cyfr.'],
            constraints: ['1 ≤ n ≤ 18'],
            examples: [{ input: '5' }],
            hint: R`W środku dwóch pętli policz m = min(min(w, k), min(n - 1 - w, n - 1 - k)) i wypisz m + 1. Funkcja min przyjmuje dwie liczby, więc minimum z czterech składasz z trzech wywołań min.`,
            tests: () => ['5', '1', '2', '18', '17', '6'],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let w = 0; w < n; w++) { let s = ''; for (let k = 0; k < n; k++) s += Math.min(w, k, n - 1 - w, n - 1 - k) + 1; o.push(s); } return o.join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < n; k++) {
            int m = min(min(w, k), min(n - 1 - w, n - 1 - k));
            cout << m + 1;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-najczestsza-litera', krok: K, level: 'srednie',
            title: 'Najczęstsza litera',
            short: 'Dla każdej litery od a do z policz, ile razy występuje — i wybierz rekordzistkę.',
            tags: ['for po literach', 'for po napisie w środku', 'rekord'],
            statement: ['Wczytaj słowo złożone z małych liter. Wypisz literę, która występuje w nim najczęściej, i po spacji — ile razy występuje. Jeśli kilka liter ma tę samą największą liczbę wystąpień, wypisz tę, która jest najwcześniej w alfabecie.'],
            input_format: ['Jedno słowo.'],
            output_format: ['Litera i liczba.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'abrakadabra' }, { input: 'kot' }],
            hint: R`Bez tablic też się da: zewnętrzna pętla po literach for (char c = 'a'; c <= 'z'; c++), wewnętrzna liczy, ile razy c występuje w słowie. Rekord aktualizuj przy ile > najwiecej — ostra nierówność daje literę najwcześniejszą w alfabecie.`,
            tests: (r) => ['abrakadabra', 'kot', 'z', 'zzzaaa', r.word(1000), r.word(1000, 'xyz'), r.word(30, 'abc')],
            solve: (inp) => { const s = toks(inp)[0]; let best = '', bc = 0; for (const c of LITERY) { const k = [...s].filter((x) => x === c).length; if (k > bc) { bc = k; best = c; } } return `${best} ${bc}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    char najlepsza = 'a';
    int najwiecej = 0;
    for (char c = 'a'; c <= 'z'; c++) {
        int ile = 0;
        for (char x : s) {
            if (x == c) {
                ile++;
            }
        }
        if (ile > najwiecej) {
            najwiecej = ile;
            najlepsza = c;
        }
    }
    cout << najlepsza << " " << najwiecej << "\n";
    return 0;
}`,
        },
        {
            id: 'for-anagramy', krok: K, level: 'srednie',
            title: 'Anagramy',
            short: 'Czy dwa słowa mają dokładnie te same litery? Porównaj liczbę wystąpień każdej litery.',
            tags: ['for po literach', 'liczenie w dwóch napisach', 'flaga'],
            statement: ['Dwa słowa są anagramami, gdy składają się z tych samych liter w tych samych ilościach, tylko w innej kolejności — np. kebab i babek. Wczytaj dwa słowa z małych liter i wypisz TAK, jeśli są anagramami, albo NIE.'],
            input_format: ['Jeden wiersz z dwoma słowami.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ długość każdego słowa ≤ 1000'],
            examples: [{ input: 'kebab babek' }, { input: 'kot kto' }, { input: 'ala lala' }],
            hint: R`Dla każdej litery c od a do z policz jej wystąpienia w pierwszym i w drugim słowie (dwie wewnętrzne pętle). Jeśli dla którejś litery liczby się różnią — to nie są anagramy (możesz od razu break).`,
            tests: (r) => { const s = r.word(1000, 'abcde'); const t = r.shuffle([...s]).join(''); const u = t.slice(0, -1) + (t[t.length - 1] === 'a' ? 'b' : 'a'); return ['kebab babek', 'kot kto', 'ala lala', 'a a', 'a b', `${s} ${t}`, `${s} ${u}`, `${r.word(20, 'ab')} ${r.word(20, 'ab')}`]; },
            solve: (inp) => { const [a, b] = toks(inp); const n = (s) => [...s].sort().join(''); return n(a) === n(b) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    bool anagramy = true;
    for (char c = 'a'; c <= 'z'; c++) {
        int ileS = 0, ileT = 0;
        for (char x : s) {
            if (x == c) ileS++;
        }
        for (char x : t) {
            if (x == c) ileT++;
        }
        if (ileS != ileT) {
            anagramy = false;
            break;
        }
    }
    if (anagramy) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-kompresja', krok: K, level: 'srednie',
            title: 'Kompresja napisu',
            short: 'aaabcc → a3bc2: zamień każdą serię jednakowych liter na literę i długość serii.',
            tags: ['for po napisie', 'seria', 'budowanie napisu'],
            statement: ['Wczytaj słowo i zapisz je krócej: każdą serię jednakowych liter stojących obok siebie zastąp jedną taką literą, a za nią dopisz długość serii — ale tylko wtedy, gdy seria ma więcej niż jedną literę. Na przykład aaabcc zamienia się w a3bc2.'],
            input_format: ['Jedno słowo złożone z małych liter.'],
            output_format: ['Skompresowane słowo.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'aaabcc' }, { input: 'kot' }, { input: 'zzzzzzzzzzzz' }],
            hint: R`Przechodź po słowie i licz długość bieżącej serii. Seria kończy się, gdy następny znak jest inny albo gdy dotarłeś do końca słowa — wtedy wypisz literę i (jeśli seria > 1) jej długość, a licznik ustaw z powrotem na 1.`,
            tests: (r) => ['aaabcc', 'kot', 'zzzzzzzzzzzz', 'a', 'ab', 'aab', 'abb', 'z'.repeat(1000), r.word(1000, 'ab'), r.word(60, 'aab')],
            solve: (inp) => toks(inp)[0].replace(/(.)\1*/g, (m, c) => (m.length > 1 ? c + m.length : c)),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    int seria = 1;
    for (int i = 0; i < n; i++) {
        if (i + 1 < n && s[i + 1] == s[i]) {
            seria++;
        } else {
            cout << s[i];
            if (seria > 1) {
                cout << seria;
            }
            seria = 1;
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-hetman', krok: K, level: 'srednie',
            title: 'Pola atakowane przez hetmana',
            short: 'Hetman bije w pionie, poziomie i po skosach. Ile pól szachownicy n × n atakuje?',
            tags: ['for w for', 'warunek na skos', 'wartość bezwzględna'],
            statement: ['Na szachownicy n × n stoi hetman w wierszu w i kolumnie k (numerowanych od 1). Hetman atakuje każde pole w tym samym wierszu, w tej samej kolumnie i na obu przekątnych przechodzących przez jego pole. Wypisz, ile pól atakuje (bez pola, na którym stoi).'],
            input_format: ['Jeden wiersz z liczbami n, w i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ w, k ≤ n'],
            examples: [{ input: '8 1 1' }, { input: '8 4 5' }],
            hint: R`Przejdź po wszystkich polach (a, b) dwiema pętlami. Pole jest atakowane, gdy a == w albo b == k albo |a − w| == |b − k| (ten sam skos) — i nie jest polem hetmana. Dla n = 1000 to milion pól — zdąży.`,
            tests: (r) => { const n = r.int(2, 1000); return ['8 1 1', '8 4 5', '1 1 1', '2 1 2', '1000 1 1', '1000 500 500', '1000 1000 1', `${n} ${r.int(1, n)} ${r.int(1, n)}`, `${r.int(3, 30)} 2 3`]; },
            check: (inp) => { const [n, w, k] = nums(inp); return w <= n && k <= n ? null : 'poza planszą'; },
            solve: (inp) => { const [n, w, k] = nums(inp); let c = 0; for (let a = 1; a <= n; a++) for (let b = 1; b <= n; b++) { if (a === w && b === k) continue; if (a === w || b === k || Math.abs(a - w) === Math.abs(b - k)) c++; } return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, w, k;
    cin >> n >> w >> k;
    int ile = 0;
    for (int a = 1; a <= n; a++) {
        for (int b = 1; b <= n; b++) {
            if (a == w && b == k) {
                continue;
            }
            int da = a - w, db = b - k;
            if (da < 0) da = -da;
            if (db < 0) db = -db;
            if (a == w || b == k || da == db) {
                ile++;
            }
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-sumy-kolejnych', krok: K, level: 'srednie',
            title: 'Sumy kolejnych liczb',
            short: 'Na ile sposobów n jest sumą co najmniej dwóch kolejnych liczb naturalnych? 15 = 4 + 5 + 6.',
            tags: ['for w for', 'break', 'suma do progu'],
            statement: ['Niektóre liczby da się zapisać jako sumę kilku (co najmniej dwóch) kolejnych liczb naturalnych, np. 15 = 1 + 2 + 3 + 4 + 5 = 4 + 5 + 6 = 7 + 8. Wczytaj n. W pierwszym wierszu wypisz, na ile sposobów da się to zrobić, a w kolejnych — wszystkie te sposoby w postaci od a do b (a to pierwszy, b ostatni składnik), rosnąco według a.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Liczba sposobów, a potem po jednym wierszu na każdy sposób.'],
            constraints: ['1 ≤ n ≤ 100 000'],
            examples: [{ input: '15' }, { input: '8' }],
            hint: R`Dla każdego możliwego początku a (od 1) dodawaj kolejne liczby a, a + 1, a + 2, … w wewnętrznej pętli, dopóki suma jest mniejsza od n. Gdy suma == n i składników było co najmniej dwa — mamy sposób. Gdy suma przekroczy n — break i następny początek.`,
            tests: (r) => ['15', '8', '1', '2', '3', '100000', '99999', '65536', '45045', String(r.int(4, 1e5))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let a = 1; a < n; a++) { let s = 0; for (let b = a; ; b++) { s += b; if (s === n && b > a) { o.push(`od ${a} do ${b}`); break; } if (s >= n) break; } } return join(String(o.length), o); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int a = 1; a < n; a++) {
        int s = 0;
        for (int b = a; ; b++) {
            s += b;
            if (s >= n) {
                if (s == n && b > a) {
                    ile++;
                }
                break;
            }
        }
    }
    cout << ile << "\n";
    for (int a = 1; a < n; a++) {
        int s = 0;
        for (int b = a; ; b++) {
            s += b;
            if (s >= n) {
                if (s == n && b > a) {
                    cout << "od " << a << " do " << b << "\n";
                }
                break;
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'for-zegar-suma-cyfr', krok: K, level: 'srednie',
            title: 'Godziny o sumie cyfr s',
            short: 'Pętla po godzinach i pętla po minutach: ile razy w ciągu doby suma cyfr zegara wynosi s?',
            tags: ['for w for', 'cyfry', 'setw i setfill'],
            statement: ['Zegar cyfrowy pokazuje godziny od 00:00 do 23:59. Wczytaj s. W pierwszym wierszu wypisz liczba: c — ile razy w ciągu doby suma czterech cyfr na zegarze wynosi s. W drugim wypisz pierwsza: HH:MM — najwcześniejszą taką godzinę, albo pierwsza: brak.'],
            input_format: ['Jedna liczba całkowita s.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['0 ≤ s ≤ 30'],
            examples: [{ input: '24' }, { input: '1' }],
            hint: R`for (int g = 0; g < 24; g++) for (int m = 0; m < 60; m++) — i suma g / 10 + g % 10 + m / 10 + m % 10. Najwcześniejsza godzina to pierwsza znaleziona. Wypisz ją z zerami z przodu: setw(2) i setfill('0').`,
            tests: () => ['24', '1', '0', '25', '30', '10', '19', '6', '14'],
            solve: (inp) => { const s = nums(inp)[0]; let c = 0, first = null; for (let g = 0; g < 24; g++) for (let m = 0; m < 60; m++) if (sumCyfr(g) + sumCyfr(m) === s) { c++; if (!first) first = `${z2(g)}:${z2(m)}`; } return join(`liczba: ${c}`, `pierwsza: ${first || 'brak'}`); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int s;
    cin >> s;
    int ile = 0, pg = -1, pm = -1;
    for (int g = 0; g < 24; g++) {
        for (int m = 0; m < 60; m++) {
            if (g / 10 + g % 10 + m / 10 + m % 10 == s) {
                ile++;
                if (pg == -1) {
                    pg = g;
                    pm = m;
                }
            }
        }
    }
    cout << "liczba: " << ile << "\n";
    if (pg == -1) {
        cout << "pierwsza: brak\n";
    } else {
        cout << "pierwsza: " << setfill('0') << setw(2) << pg << ":" << setw(2) << pm << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ trudne
        {
            id: 'for-trojki-pitagorejskie', krok: K, level: 'trudne',
            title: 'Trójki pitagorejskie',
            short: 'Wszystkie trójkąty prostokątne o bokach całkowitych do n: a² + b² = c².',
            tags: ['trzy pętle for', 'przeszukiwanie', 'kolejność wyników'],
            statement: ['Trójka pitagorejska to trzy liczby całkowite a < b < c, dla których a² + b² = c² — np. 3, 4, 5. Wczytaj n i wypisz wszystkie trójki pitagorejskie z c ≤ n, każdą w osobnym wierszu (a b c), uporządkowane rosnąco według a, a przy równym a — według b. W ostatnim wierszu wypisz trojek: k.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Trójki, a potem wiersz z ich liczbą.'],
            constraints: ['1 ≤ n ≤ 300'],
            examples: [{ input: '15' }, { input: '4' }],
            hint: R`Trzy pętle: a od 1, b od a + 1, c od b + 1 — każda do n. Kolejność pętli od razu daje wymaganą kolejność wyników. Dla n = 300 to ok. 4,5 miliona sprawdzeń. Trzecia pętla nie jest konieczna (c da się wyznaczyć z a i b), ale tu wystarcza.`,
            tests: (r) => ['15', '4', '1', '5', '300', '299', '100', String(r.int(6, 299))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let a = 1; a <= n; a++) for (let b = a + 1; b <= n; b++) for (let c = b + 1; c <= n; c++) if (a * a + b * b === c * c) o.push(`${a} ${b} ${c}`); return join(o, `trojek: ${o.length}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int a = 1; a <= n; a++) {
        for (int b = a + 1; b <= n; b++) {
            for (int c = b + 1; c <= n; c++) {
                if (a * a + b * b == c * c) {
                    cout << a << " " << b << " " << c << "\n";
                    ile++;
                }
            }
        }
    }
    cout << "trojek: " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-palindrom-iloczyn', krok: K, level: 'trudne',
            title: 'Największy palindromiczny iloczyn',
            short: 'Sprawdź wszystkie iloczyny x · y z przedziału i znajdź największy palindrom.',
            tags: ['for w for', 'odwracanie liczby', 'rekord'],
            statement: ['Wczytaj a i b. Rozważ wszystkie iloczyny x · y, w których a ≤ x ≤ y ≤ b. Wypisz największy z nich, który jest palindromem (czytany od tyłu daje tę samą liczbę, np. 9009 = 91 · 99). Jeśli żaden iloczyn nie jest palindromem, wypisz BRAK.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba albo słowo BRAK.'],
            constraints: ['1 ≤ a ≤ b ≤ 999'],
            examples: [{ input: '10 99' }, { input: '100 999' }, { input: '10 10' }],
            hint: R`Dwie pętle: x od a do b i y od x do b. Dla każdego iloczynu odwróć go (pętla po cyfrach na kopii) i porównaj z oryginałem. Rekord zmieniaj tylko wtedy, gdy palindrom jest większy od dotychczasowego. Możesz przyspieszyć: jeśli x · y nie przekracza rekordu, sprawdzanie palindromu nie ma sensu.`,
            tests: (r) => ['10 99', '100 999', '10 10', '1 1', '1 9', '11 11', '900 999', '1 999', `${r.int(1, 500)} ${r.int(500, 999)}`, `${r.int(10, 60)} ${r.int(60, 99)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let best = -1; for (let x = a; x <= b; x++) for (let y = x; y <= b; y++) { const p = x * y; if (p > best) { const s = String(p); if (s === [...s].reverse().join('')) best = p; } } return best < 0 ? 'BRAK' : String(best); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int najlepszy = -1;
    for (int x = a; x <= b; x++) {
        for (int y = x; y <= b; y++) {
            int p = x * y;
            if (p <= najlepszy) {
                continue;
            }
            int odwr = 0;
            for (int k = p; k > 0; k /= 10) {
                odwr = odwr * 10 + k % 10;
            }
            if (odwr == p) {
                najlepszy = p;
            }
        }
    }
    if (najlepszy == -1) {
        cout << "BRAK\n";
    } else {
        cout << najlepszy << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-dwojkowe-palindromy', krok: K, level: 'trudne',
            title: 'Palindromy w systemie dwójkowym',
            short: 'Ile liczb z przedziału ma zapis dwójkowy czytany tak samo od tyłu? 9 = 1001₂.',
            tags: ['for', 'odwracanie w systemie dwójkowym', '% 2 i / 2'],
            statement: ['Wczytaj a i b i wypisz, ile liczb z przedziału od a do b ma zapis dwójkowy (bez zer z przodu) będący palindromem. Na przykład 9 to 1001 w systemie dwójkowym — palindrom, a 6 to 110 — nie.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 1 000 000'],
            examples: [{ input: '1 10', note: '1, 3, 5, 7 i 9 — zapisy 1, 11, 101, 111 i 1001.' }, { input: '10 14' }],
            hint: R`Odwracanie liczby, które znasz z systemu dziesiętnego, działa też w dwójkowym — tylko z dwójką: odwr = odwr * 2 + k % 2; k /= 2;. Liczba jest palindromem dwójkowym, gdy odwrócona równa się oryginałowi.`,
            tests: (r) => ['1 10', '10 14', '1 1', '2 2', '1 1000000', '999000 1000000', `${r.int(1, 5e5)} ${r.int(5e5, 1e6)}`, `${r.int(1, 1000)} ${r.int(1000, 70000)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let c = 0; for (let x = a; x <= b; x++) { const s = x.toString(2); if (s === [...s].reverse().join('')) c++; } return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int ile = 0;
    for (int x = a; x <= b; x++) {
        int odwr = 0;
        for (int k = x; k > 0; k /= 2) {
            odwr = odwr * 2 + k % 2;
        }
        if (odwr == x) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-goldbach', krok: K, level: 'trudne',
            title: 'Hipoteza Goldbacha',
            short: 'Zapisz liczbę parzystą jako sumę dwóch liczb pierwszych — z najmniejszym pierwszym składnikiem.',
            tags: ['for', 'test pierwszości w środku', 'break', 'long long'],
            statement: ['Hipoteza Goldbacha mówi, że każdą liczbę parzystą większą od 2 da się zapisać jako sumę dwóch liczb pierwszych. Nikt tego nie udowodnił, ale komputery sprawdziły to dla ogromnych liczb.', 'Wczytaj parzyste n i wypisz n = p + q, gdzie p i q to liczby pierwsze, p ≤ q, a p jest najmniejsze z możliwych.'],
            input_format: ['Jedna parzysta liczba całkowita n.'],
            output_format: ['Jeden wiersz w postaci n = p + q.'],
            constraints: ['4 ≤ n ≤ 10¹², n parzyste'],
            examples: [{ input: '28' }, { input: '4' }],
            hint: R`Sprawdzaj kolejne p od 2 w górę: jeśli p i n − p są pierwsze — wypisz i break. Test pierwszości do pierwiastka zrób jako pętlę wewnętrzną (albo dwie: dla p i dla n − p). Dla n do 10¹² liczby n − p są duże, więc licznik dzielników trzymaj w long long.`,
            tests: (r) => ['28', '4', '6', '8', '1000000000000', '999999999998', '98', '3325581707333960528'.slice(0, 12).replace(/[13579]$/, '8'), String(2 * r.int(2, 5e11)), String(2 * r.int(2, 5e5))],
            check: (inp) => { const n = Number(toks(inp)[0]); return n % 2 === 0 && n >= 4 && n <= 1e12 ? null : 'złe n'; },
            solve: (inp) => { const n = Number(toks(inp)[0]); for (let p = 2; ; p++) if (pierwsza(p) && pierwsza(n - p)) return `${n} = ${p} + ${n - p}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    for (long long p = 2; ; p++) {
        bool ok = true;
        for (long long d = 2; d * d <= p; d++) {
            if (p % d == 0) {
                ok = false;
                break;
            }
        }
        if (!ok) {
            continue;
        }
        long long q = n - p;
        for (long long d = 2; d * d <= q; d++) {
            if (q % d == 0) {
                ok = false;
                break;
            }
        }
        if (ok) {
            cout << n << " = " << p << " + " << q << "\n";
            break;
        }
    }
    return 0;
}`,
        },
        {
            id: 'for-zaprzyjaznione', krok: K, level: 'trudne',
            title: 'Liczby zaprzyjaźnione',
            short: '220 i 284: suma dzielników jednej to druga. Znajdź wszystkie takie pary do n.',
            tags: ['for', 'suma dzielników do pierwiastka', 'para warunków'],
            statement: ['Dwie różne liczby są zaprzyjaźnione, jeśli suma dzielników każdej z nich (bez niej samej) jest równa drugiej liczbie. Najmniejsza para to 220 i 284: dzielniki 220 (bez 220) sumują się do 284, a dzielniki 284 (bez 284) — do 220.', 'Wczytaj n i wypisz wszystkie pary liczb zaprzyjaźnionych a < b ≤ n, każdą w osobnym wierszu, rosnąco według a. Jeśli nie ma żadnej, wypisz BRAK.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Pary a b albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 30 000'],
            examples: [{ input: '1500' }, { input: '100' }],
            hint: R`Dla każdego a od 1 do n policz s(a) — sumę dzielników bez samej liczby (pętla do pierwiastka, dodając pary d i a / d). Jeśli b = s(a) jest większe od a, nie większe od n, a s(b) == a — wypisz parę. Warunek b > a sprawia, że każda para pojawi się raz.`,
            tests: (r) => ['1500', '100', '1', '220', '284', '30000', '10000', '6232', String(r.int(1, 30000))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let a = 1; a <= n; a++) { const b = sumaDzielnikowWlasciwych(a); if (b > a && b <= n && sumaDzielnikowWlasciwych(b) === a) o.push(`${a} ${b}`); } return o.length ? o.join('\n') : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int a = 1; a <= n; a++) {
        int b = 0;
        if (a > 1) {
            b = 1;
            for (int d = 2; d * d <= a; d++) {
                if (a % d == 0) {
                    b += d;
                    if (d != a / d) b += a / d;
                }
            }
        }
        if (b > a && b <= n) {
            int s = 1;
            for (int d = 2; d * d <= b; d++) {
                if (b % d == 0) {
                    s += d;
                    if (d != b / d) s += b / d;
                }
            }
            if (s == a) {
                cout << a << " " << b << "\n";
                ile++;
            }
        }
    }
    if (ile == 0) {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-look-and-say', krok: K, level: 'trudne',
            title: 'Ciąg „patrz i mów”',
            short: '1, 11, 21, 1211, 111221… — każdy wyraz opisuje na głos poprzedni.',
            tags: ['for po napisie', 'serie', 'budowanie napisu', 'pętla w pętli'],
            statement: ['Pierwszy wyraz ciągu to 1. Każdy kolejny powstaje przez przeczytanie na głos poprzedniego, seria po serii: 1 to „jedna jedynka”, więc drugi wyraz to 11; 11 to „dwie jedynki” — 21; 21 to „jedna dwójka, jedna jedynka” — 1211; dalej 111221, 312211, …', 'Wczytaj n i wypisz n-ty wyraz ciągu.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n-ty wyraz ciągu (jako napis z cyfr).'],
            constraints: ['1 ≤ n ≤ 25'],
            examples: [{ input: '5' }, { input: '1' }],
            hint: R`Trzymaj wyraz jako string. Zewnętrzna pętla robi n − 1 kroków. W każdym kroku przejdź po napisie i dla każdej serii takich samych cyfr dołóż do nowego napisu długość serii i cyfrę (nowy += to_string(seria); nowy += s[i];). Na końcu kroku s = nowy.`,
            tests: () => ['5', '1', '2', '3', '10', '25', '20', '15'],
            solve: (inp) => { const n = nums(inp)[0]; let s = '1'; for (let k = 1; k < n; k++) s = s.replace(/(.)\1*/g, (m, c) => m.length + c); return s; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string s = "1";
    for (int krok = 1; krok < n; krok++) {
        string nowy = "";
        int seria = 1;
        for (int i = 0; i < s.length(); i++) {
            if (i + 1 < s.length() && s[i + 1] == s[i]) {
                seria++;
            } else {
                nowy += to_string(seria);
                nowy += s[i];
                seria = 1;
            }
        }
        s = nowy;
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'for-kalendarz', krok: K, level: 'trudne',
            title: 'Kartka z kalendarza',
            short: 'Wydrukuj miesiąc jako siatkę tygodni: puste pola na początku, setw(2) i nowy wiersz po niedzieli.',
            tags: ['for', 'setw', 'pozycja w tygodniu', '%'],
            statement: [
                'Wczytaj liczbę dni miesiąca d i numer dnia tygodnia, w którym wypada pierwszy dzień miesiąca (1 — poniedziałek, …, 7 — niedziela). Wypisz kartkę z kalendarza dokładnie w takim układzie jak w przykładzie.',
                'Pierwszy wiersz to Pn Wt Sr Cz Pt So Nd. Dalej każdy wiersz to jeden tydzień od poniedziałku do niedzieli: każdy dzień zajmuje pole szerokości 2 (liczby wyrównane do prawej), a pola są oddzielone pojedynczą spacją. Pola przed pierwszym dniem miesiąca są puste (spacje). Po ostatnim dniu miesiąca wiersz się kończy.',
            ],
            input_format: ['Jeden wiersz z liczbami d i p.'],
            output_format: ['Kartka kalendarza, jak w przykładzie.'],
            constraints: ['28 ≤ d ≤ 31', '1 ≤ p ≤ 7'],
            examples: [{ input: '30 3' }, { input: '28 1' }],
            hint: R`Zmienna poz to numer pola w tygodniu (od 1 do 7). Najpierw wypisz p − 1 pustych pól po trzy spacje (dwie na pole i jedna oddzielająca). Potem pętla po dniach: cout << setw(2) << dzien;, a następnie — jeśli to było pole numer 7 — przejście do nowego wiersza i poz = 1, a w przeciwnym razie spacja i poz++.`,
            tests: () => { const o = []; for (const d of [28, 29, 30, 31]) for (const p of [1, 3, 5, 7]) o.push(`${d} ${p}`); o.unshift('30 3', '28 1'); return o; },
            solve: (inp) => {
                const [d, p] = nums(inp); const o = ['Pn Wt Sr Cz Pt So Nd']; let line = '   '.repeat(p - 1); let poz = p;
                for (let day = 1; day <= d; day++) { line += String(day).padStart(2); if (poz === 7) { o.push(line); line = ''; poz = 1; } else { line += ' '; poz++; } }
                if (line.trim()) o.push(line);
                return o.map((l) => l.replace(/\s+$/, '')).join('\n');
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int d, p;
    cin >> d >> p;
    cout << "Pn Wt Sr Cz Pt So Nd\n";
    for (int i = 1; i < p; i++) {
        cout << "   ";
    }
    int poz = p;
    for (int dzien = 1; dzien <= d; dzien++) {
        cout << setw(2) << dzien;
        if (poz == 7) {
            cout << "\n";
            poz = 1;
        } else {
            cout << " ";
            poz++;
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-konkurs', krok: K, level: 'trudne',
            title: 'Wielki finał: wyniki konkursu',
            short: 'Imiona i punkty za k zadań: sumy, najlepsze zadanie każdego, zwycięzca, średnia i statystyki.',
            tags: ['for w for', 'string', 'rekordy', 'setprecision', 'wszystko naraz'],
            statement: [
                'W konkursie programistycznym startowało n uczestników, a każdy rozwiązywał k zadań — za każde dostał od 0 do 100 punktów. Dla każdego uczestnika znasz imię i k wyników.',
                'Najpierw wypisz po jednym wierszu dla każdego uczestnika, w kolejności z wejścia: imie: suma pkt, najlepsze zadanie: m — gdzie suma to łączna liczba punktów, a m to najwyższy wynik tego uczestnika za pojedyncze zadanie.',
                'Potem wypisz cztery wiersze: zwyciezca: imie (suma) — uczestnik z największą sumą (przy remisie ten, który był wcześniej na liście); srednia: X — średnia suma punktów, z dwoma miejscami po przecinku; setki: c — ile razy ktoś zdobył za zadanie komplet 100 punktów; bez zera: z — ilu uczestników nie ma ani jednego zadania za 0 punktów.',
            ],
            input_format: ['W pierwszym wierszu n i k, w każdym z kolejnych n wierszy imię (bez spacji i polskich liter) i k liczb.'],
            output_format: ['n + 4 wierszy, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ k ≤ 10', '0 ≤ każdy wynik ≤ 100'],
            examples: [{ input: '3 4\nAla 100 50 0 70\nKuba 90 90 90 90\nOla 100 100 20 10' }],
            hint: R`Zewnętrzna pętla po uczestnikach: wczytaj imię, wyzeruj sumę, ustaw maksimum, flagę „miał zero” na false. Wewnętrzna po zadaniach: wczytaj wynik, dodaj do sumy, popraw maksimum, policz setki i zera. Po wewnętrznej pętli wypisz wiersz uczestnika i zaktualizuj dane do podsumowania (zwycięzca, suma wszystkich sum, licznik „bez zera”). Podsumowanie — po zewnętrznej pętli.`,
            tests: (r) => {
                const out = ['3 4\nAla 100 50 0 70\nKuba 90 90 90 90\nOla 100 100 20 10', '1 1\nZosia 0', '2 3\nAla 100 100 100\nOla 100 100 100'];
                while (out.length < 9) {
                    const n = r.pick([r.int(2, 8), r.int(50, 100)]), k = r.int(1, 10);
                    const rows = Array.from({ length: n }, () => `${r.pick(IMIONA)} ${Array.from({ length: k }, () => r.pick([0, 100, r.int(0, 100), r.int(0, 100)])).join(' ')}`);
                    const inp = `${n} ${k}\n${rows.join('\n')}`;
                    const sums = rows.map((l) => l.split(' ').slice(1).map(Number).reduce((a, b) => a + b, 0));
                    if (safe(sums.reduce((a, b) => a + b, 0) / n, 2)) out.push(inp);
                }
                return out;
            },
            check: (inp) => { const t = toks(inp); const n = +t[0], k = +t[1]; let tot = 0; for (let i = 0; i < n; i++) for (let j = 0; j < k; j++) tot += +t[2 + i * (k + 1) + 1 + j]; return safe(tot / n, 2) ? null : 'połówka'; },
            solve: (inp) => {
                const t = toks(inp); const n = +t[0], k = +t[1]; const o = []; let best = -1, kto = '', tot = 0, setki = 0, bezZera = 0;
                for (let i = 0; i < n; i++) {
                    const base = 2 + i * (k + 1); const imie = t[base]; const w = t.slice(base + 1, base + 1 + k).map(Number);
                    const s = w.reduce((a, b) => a + b, 0); o.push(`${imie}: ${s} pkt, najlepsze zadanie: ${Math.max(...w)}`);
                    if (s > best) { best = s; kto = imie; }
                    tot += s; setki += w.filter((x) => x === 100).length; if (!w.includes(0)) bezZera++;
                }
                return join(o, `zwyciezca: ${kto} (${best})`, `srednia: ${fx(tot / n, 2)}`, `setki: ${setki}`, `bez zera: ${bezZera}`);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    string zwyciezca;
    int najlepszaSuma = -1;
    long long wszystkie = 0;
    int setki = 0, bezZera = 0;
    for (int i = 0; i < n; i++) {
        string imie;
        cin >> imie;
        int suma = 0, maks = 0;
        bool zero = false;
        for (int j = 0; j < k; j++) {
            int w;
            cin >> w;
            suma += w;
            if (w > maks) maks = w;
            if (w == 100) setki++;
            if (w == 0) zero = true;
        }
        cout << imie << ": " << suma << " pkt, najlepsze zadanie: " << maks << "\n";
        if (suma > najlepszaSuma) {
            najlepszaSuma = suma;
            zwyciezca = imie;
        }
        wszystkie += suma;
        if (!zero) bezZera++;
    }
    cout << "zwyciezca: " << zwyciezca << " (" << najlepszaSuma << ")\n";
    cout << "srednia: " << fixed << setprecision(2) << (double)wszystkie / n << "\n";
    cout << "setki: " << setki << "\n";
    cout << "bez zera: " << bezZera << "\n";
    return 0;
}`,
        },
    ];
};
