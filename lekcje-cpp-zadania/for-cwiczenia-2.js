// For loop — ćwiczenia w trakcie lekcji, części 5–8: for i napisy (także for (char c : s)), pętle zagnieżdżone,
// sprawdzanie wszystkich możliwości (przeszukiwanie zupełne) i szybkość pętli (ile obrotów zdąży się wykonać).
module.exports = (h) => {
    const { nums, toks, lines, join } = h;
    const R = String.raw;
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const range = (a, b) => { const o = []; for (let x = a; x <= b; x++) o.push(x); return o; };
    const pierwsza = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
    const dzielniki = (n) => { const lo = [], hi = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { lo.push(d); if (d !== n / d) hi.push(n / d); } return lo.concat(hi.reverse()); };
    const zdanie = (r, slow, alfabet = LITERY) => Array.from({ length: slow }, () => r.word(r.int(1, 9), alfabet)).join(' ');

    return [
        // ================================================================ KROK 5 · for i napisy
        {
            id: 'for-literuj', krok: 5, level: 'latwe',
            title: 'Literowanie',
            short: 'Wypisz słowo z myślnikami między literami: k-o-t. Bez myślnika na końcu!',
            tags: ['for po napisie', 's[i]', 'separator'],
            statement: ['Wczytaj słowo i wypisz jego litery oddzielone myślnikami, np. dla kot wynikiem jest k-o-t. Przed pierwszą literą i po ostatniej myślnika nie ma.'],
            input_format: ['Jedno słowo złożone z liter.'],
            output_format: ['Słowo z myślnikami między literami.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'kot' }, { input: 'a' }],
            hint: R`Myślnik wypisuj przed każdą literą oprócz pierwszej: for (int i = 0; i < s.length(); i++) { if (i > 0) cout << "-"; cout << s[i]; }. To sposób na każdy „separator między elementami”.`,
            tests: (r) => ['kot', 'a', 'ab', 'Olimpiada', r.word(1000), r.word(17, 'abcXYZ')],
            solve: (inp) => [...toks(inp)[0]].join('-'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    for (int i = 0; i < s.length(); i++) {
        if (i > 0) {
            cout << "-";
        }
        cout << s[i];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-samogloski', krok: 5, level: 'latwe',
            title: 'Samogłoski w zdaniu',
            short: 'Wczytaj cały wiersz przez getline i policz samogłoski: a, e, i, o, u, y.',
            tags: ['getline', 'for (char c : s)', '||'],
            statement: ['Wczytaj jeden wiersz tekstu (małe litery i spacje) i wypisz, ile jest w nim samogłosek. Samogłoski to a, e, i, o, u i y.'],
            input_format: ['Jeden wiersz złożony z małych liter i spacji.'],
            output_format: ['Jedna liczba.'],
            constraints: ['wiersz ma od 1 do 1000 znaków'],
            examples: [{ input: 'ala ma kota' }, { input: 'krwi' }],
            hint: R`Cały wiersz ze spacjami wczytasz przez getline(cin, s). Po znakach najwygodniej przejść pętlą for (char c : s) — c przyjmuje po kolei każdy znak napisu. Warunek: c == 'a' || c == 'e' || … || c == 'y'.`,
            tests: (r) => ['ala ma kota', 'krwi', 'y', 'b', 'aeiouy aeiouy', zdanie(r, 150), zdanie(r, 5)],
            solve: (inp) => String([...inp.trim()].filter((c) => 'aeiouy'.includes(c)).length),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int ile = 0;
    for (char c : s) {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-wielkie-litery', krok: 5, level: 'latwe',
            title: 'KRZYCZĄCY TEKST',
            short: 'Zamień wszystkie małe litery na wielkie — arytmetyka na kodach znaków.',
            tags: ['getline', 's[i] = …', "c - 'a' + 'A'"],
            statement: ['Wczytaj jeden wiersz tekstu i wypisz go z wszystkimi małymi literami (od a do z) zamienionymi na wielkie. Pozostałe znaki — wielkie litery, cyfry, spacje i znaki interpunkcyjne — zostaw bez zmian.'],
            input_format: ['Jeden wiersz tekstu (litery alfabetu angielskiego, cyfry, spacje i znaki . , ! ?).'],
            output_format: ['Ten sam wiersz z wielkimi literami.'],
            constraints: ['wiersz ma od 1 do 1000 znaków'],
            examples: [{ input: 'Ala ma 2 koty!' }],
            hint: R`Mała litera c zamienia się w wielką tak: c - 'a' + 'A' (odejmujesz kod a, dodajesz kod A). Możesz zmieniać znaki w samym napisie: if (s[i] >= 'a' && s[i] <= 'z') s[i] = s[i] - 'a' + 'A';, a na końcu wypisać s.`,
            tests: (r) => ['Ala ma 2 koty!', 'x', 'JUZ WIELKIE', 'abc, def. ghi? 123', zdanie(r, 120, 'abcdefghijklmnopqrstuvwxyzABC0123456789.,!?'), zdanie(r, 8)],
            solve: (inp) => inp.trim().replace(/[a-z]/g, (c) => c.toUpperCase()),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    for (int i = 0; i < s.length(); i++) {
        if (s[i] >= 'a' && s[i] <= 'z') {
            s[i] = s[i] - 'a' + 'A';
        }
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'for-palindrom-slowo', krok: 5, level: 'latwe',
            title: 'Słowo palindrom',
            short: 'Porównuj literę z początku z literą z końca: s[i] i s[n − 1 − i].',
            tags: ['for po połowie napisu', 's[n - 1 - i]'],
            statement: ['Wczytaj słowo złożone z małych liter i wypisz TAK, jeśli czytane od tyłu jest takie samo (np. kajak, anna), albo NIE w przeciwnym razie.'],
            input_format: ['Jedno słowo.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'kajak' }, { input: 'kotek' }],
            hint: R`Litera numer i od początku ma swoją parę numer n − 1 − i od końca. Wystarczy sprawdzić pierwszą połowę: for (int i = 0; i < n / 2; i++) if (s[i] != s[n - 1 - i]) ok = false;.`,
            tests: (r) => { const p = r.word(400, 'ab'); return ['kajak', 'kotek', 'a', 'ab', 'aa', 'anna', p + [...p].reverse().join(''), p + 'c' + [...p].reverse().join(''), p + 'cd' + [...p].reverse().join(''), r.word(30, 'ab')]; },
            solve: (inp) => { const s = toks(inp)[0]; return s === [...s].reverse().join('') ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    bool ok = true;
    for (int i = 0; i < n / 2; i++) {
        if (s[i] != s[n - 1 - i]) {
            ok = false;
            break;
        }
    }
    if (ok) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-suma-cyfr-tekstu', krok: 5, level: 'latwe',
            title: 'Cyfry ukryte w tekście',
            short: 'Zsumuj wszystkie cyfry w słowie złożonym z liter i cyfr: znak minus \'0\' to liczba.',
            tags: ['for (char c : s)', "c - '0'"],
            statement: ['Wczytaj słowo złożone z liter i cyfr, np. a1b22c7, i wypisz sumę wszystkich cyfr, które w nim występują (dla przykładu 1 + 2 + 2 + 7 = 12). Jeśli cyfr nie ma, wypisz 0.'],
            input_format: ['Jedno słowo z liter i cyfr.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'a1b22c7' }, { input: 'kot' }],
            hint: R`for (char c : s) { if (c >= '0' && c <= '9') suma += c - '0'; }. Znak '7' to nie liczba 7 — dopiero c - '0' zamienia go na 7, bo kody cyfr stoją w tablicy ASCII po kolei.`,
            tests: (r) => ['a1b22c7', 'kot', '9', '0000', '9'.repeat(1000), r.word(1000, 'abc0123456789'), r.word(40, 'xyz5')],
            solve: (inp) => String([...toks(inp)[0]].filter((c) => c >= '0' && c <= '9').reduce((s, c) => s + Number(c), 0)),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int suma = 0;
    for (char c : s) {
        if (c >= '0' && c <= '9') {
            suma += c - '0';
        }
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'for-roznice-slow', krok: 5, level: 'srednie',
            title: 'Ile liter się różni?',
            short: 'Dwa słowa tej samej długości: na ilu pozycjach mają różne litery?',
            tags: ['for po dwóch napisach', 's[i] != t[i]'],
            statement: ['Wczytaj dwa słowa tej samej długości i wypisz, na ilu pozycjach mają różne znaki. Na przykład kot i kit różnią się na jednej pozycji, a ala i ola — też na jednej.'],
            input_format: ['Jeden wiersz z dwoma słowami tej samej długości.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ długość słów ≤ 1000'],
            examples: [{ input: 'kot kit' }, { input: 'abcd dcba' }],
            hint: R`Jeden licznik i obsługuje oba napisy naraz: for (int i = 0; i < s.length(); i++) if (s[i] != t[i]) ile++;.`,
            tests: (r) => { const n = 1000; const a = r.word(n, 'ab'), b = r.word(n, 'ab'); return ['kot kit', 'abcd dcba', 'a a', 'a b', `${a} ${b}`, `${a} ${a}`, `${r.word(20)} ${r.word(20)}`]; },
            check: (inp) => { const [a, b] = toks(inp); return a.length === b.length ? null : 'różne długości'; },
            solve: (inp) => { const [a, b] = toks(inp); return String([...a].filter((c, i) => c !== b[i]).length); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    int ile = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s[i] != t[i]) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-bez-spacji', krok: 5, level: 'srednie',
            title: 'Usuń spacje',
            short: 'Zbuduj nowy napis bez spacji, dokładając znaki przez +=. Policz usunięte spacje.',
            tags: ['getline', 'budowanie napisu +=', 'licznik'],
            statement: ['Wczytaj jeden wiersz tekstu. W pierwszym wierszu wypisz ten tekst bez żadnych spacji, a w drugim — ile spacji usunięto.'],
            input_format: ['Jeden wiersz tekstu złożonego z liter i spacji (nie zaczyna się i nie kończy spacją).'],
            output_format: ['Dwa wiersze.'],
            constraints: ['wiersz ma od 1 do 1000 znaków'],
            examples: [{ input: 'Ala  ma   kota' }],
            hint: R`Zacznij od pustego napisu string wynik = "";. Dla każdego znaku: jeśli to spacja — zwiększ licznik, a w przeciwnym razie dołóż znak na koniec wyniku: wynik += c;.`,
            tests: (r) => ['Ala  ma   kota', 'kot', 'a b', Array.from({ length: 120 }, () => r.word(r.int(1, 5))).join(' '.repeat(r.int(1, 3))), Array.from({ length: 10 }, () => r.word(r.int(1, 6))).join('  ')],
            solve: (inp) => { const s = inp.trim(); return join(s.replace(/ /g, ''), String((s.match(/ /g) || []).length)); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    string wynik = "";
    int spacje = 0;
    for (char c : s) {
        if (c == ' ') {
            spacje++;
        } else {
            wynik += c;
        }
    }
    cout << wynik << "\n" << spacje << "\n";
    return 0;
}`,
        },
        {
            id: 'for-zamiana-par', krok: 5, level: 'srednie',
            title: 'Zamiana sąsiadów',
            short: 'Zamień miejscami pierwszą literę z drugą, trzecią z czwartą… Krok pętli co 2.',
            tags: ['for', 'i += 2', 'zamiana miejscami'],
            statement: ['Wczytaj słowo i zamień w nim miejscami litery parami: pierwszą z drugą, trzecią z czwartą i tak dalej. Jeśli słowo ma nieparzystą długość, ostatnia litera zostaje na swoim miejscu. Wypisz wynik — np. dla abcdefg jest to badcfeg.'],
            input_format: ['Jedno słowo.'],
            output_format: ['Słowo po zamianach.'],
            constraints: ['1 ≤ długość słowa ≤ 1000'],
            examples: [{ input: 'abcdefg' }, { input: 'kotek' }],
            hint: R`Pętla co dwa: for (int i = 0; i + 1 < s.length(); i += 2). W środku zamiana przez trzecią zmienną: char t = s[i]; s[i] = s[i + 1]; s[i + 1] = t;. Warunek i + 1 < długość pilnuje, żeby para miała drugą literę.`,
            tests: (r) => ['abcdefg', 'kotek', 'a', 'ab', r.word(1000), r.word(999), r.word(12, 'xyz')],
            solve: (inp) => { const s = [...toks(inp)[0]]; for (let i = 0; i + 1 < s.length; i += 2) [s[i], s[i + 1]] = [s[i + 1], s[i]]; return s.join(''); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    for (int i = 0; i + 1 < s.length(); i += 2) {
        char t = s[i];
        s[i] = s[i + 1];
        s[i + 1] = t;
    }
    cout << s << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · pętle zagnieżdżone
        {
            id: 'for-prostokat-liczb', krok: 6, level: 'latwe',
            title: 'Prostokąt z numerów wierszy',
            short: 'a wierszy po b liczb, a w każdym wierszu stoi jego numer.',
            tags: ['for w for', 'wiersze i kolumny'],
            statement: ['Wczytaj a i b i wypisz a wierszy, w każdym b liczb oddzielonych spacjami. W wierszu numer w (od 1) wszystkie liczby są równe w.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['a wierszy po b liczb.'],
            constraints: ['1 ≤ a, b ≤ 30'],
            examples: [{ input: '3 4' }],
            hint: R`for (int w = 1; w <= a; w++) { for (int k = 1; k <= b; k++) cout << w << " "; cout << "\n"; }. W pętli for licznik wewnętrznej pętli startuje od nowa sam — jest tworzony w jej nawiasie przy każdym wejściu.`,
            tests: (r) => ['3 4', '1 1', '30 30', '1 30', '30 1', `${r.int(2, 29)} ${r.int(2, 29)}`],
            solve: (inp) => { const [a, b] = nums(inp); return range(1, a).map((w) => Array(b).fill(w).join(' ')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    for (int w = 1; w <= a; w++) {
        for (int k = 1; k <= b; k++) {
            cout << w << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-trojkat-odwrocony', krok: 6, level: 'latwe',
            title: 'Trójkąt do góry nogami',
            short: 'n gwiazdek, potem n − 1, … aż do jednej.',
            tags: ['for w for', 'wewnętrzna zależy od zewnętrznej'],
            statement: ['Wczytaj n i narysuj odwrócony trójkąt z gwiazdek: w pierwszym wierszu n gwiazdek, w drugim n − 1, i tak dalej, w ostatnim jedna.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy z gwiazdkami.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '4' }],
            hint: R`Zewnętrzny licznik może maleć: for (int w = n; w >= 1; w--), a wewnętrzna pętla wypisuje w gwiazdek: for (int k = 0; k < w; k++).`,
            tests: (r) => ['4', '1', '2', '50', String(r.int(3, 49))],
            solve: (inp) => { const n = nums(inp)[0]; return range(1, n).reverse().map((w) => '*'.repeat(w)).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int w = n; w >= 1; w--) {
        for (int k = 0; k < w; k++) {
            cout << "*";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-trojkat-prawy', krok: 6, level: 'latwe',
            title: 'Trójkąt dosunięty w prawo',
            short: 'Najpierw kropki, potem gwiazdki — dwie wewnętrzne pętle w każdym wierszu.',
            tags: ['for w for', 'dwie wewnętrzne pętle'],
            statement: ['Wczytaj n i narysuj trójkąt dosunięty do prawej strony: w wierszu numer w (od 1 do n) najpierw stoi n − w kropek, a potem w gwiazdek.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy po n znaków.'],
            constraints: ['1 ≤ n ≤ 50'],
            examples: [{ input: '4' }],
            hint: R`W pętli wierszy stoją dwie pętle jedna po drugiej: for (int k = 0; k < n - w; k++) cout << ".";, a potem for (int k = 0; k < w; k++) cout << "*";. Każda ma własny licznik k — w for to żaden problem.`,
            tests: (r) => ['4', '1', '2', '50', String(r.int(3, 49))],
            solve: (inp) => { const n = nums(inp)[0]; return range(1, n).map((w) => '.'.repeat(n - w) + '*'.repeat(w)).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int w = 1; w <= n; w++) {
        for (int k = 0; k < n - w; k++) {
            cout << ".";
        }
        for (int k = 0; k < w; k++) {
            cout << "*";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-trojkat-liter', krok: 6, level: 'latwe',
            title: 'Trójkąt z liter',
            short: 'Wiersz w: litery od A do w-tej litery alfabetu. Pętla może liczyć znakami!',
            tags: ['for w for', "char c = 'A'"],
            statement: ['Wczytaj n i wypisz n wierszy. W wierszu numer w (od 1) stoi w pierwszych wielkich liter alfabetu angielskiego, bez spacji: A, AB, ABC, …'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy.'],
            constraints: ['1 ≤ n ≤ 26'],
            examples: [{ input: '4' }],
            hint: R`Licznikiem pętli może być znak: for (char c = 'A'; c < 'A' + w; c++) cout << c;. Znaki to w środku liczby (kody), więc c++ przechodzi do następnej litery.`,
            tests: (r) => ['4', '1', '26', '2', String(r.int(5, 25))],
            solve: (inp) => { const n = nums(inp)[0]; return range(1, n).map((w) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, w)).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int w = 1; w <= n; w++) {
        for (char c = 'A'; c < 'A' + w; c++) {
            cout << c;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-pary-liczb', krok: 6, level: 'latwe',
            title: 'Wszystkie pary',
            short: 'Wypisz każdą parę i < j z liczb od 1 do n — wewnętrzna pętla startuje od i + 1.',
            tags: ['for w for', 'j = i + 1', 'licznik'],
            statement: ['Wczytaj n i wypisz wszystkie pary liczb (i, j), w których 1 ≤ i < j ≤ n — każdą w osobnym wierszu, jako dwie liczby oddzielone spacją, w kolejności rosnącej i, a przy tym samym i — rosnącej j. W ostatnim wierszu wypisz par: K, gdzie K to liczba wypisanych par.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Pary, a potem wiersz z ich liczbą.'],
            constraints: ['1 ≤ n ≤ 40'],
            examples: [{ input: '4' }, { input: '1' }],
            hint: R`for (int i = 1; i <= n; i++) for (int j = i + 1; j <= n; j++) { wypisz i j; par++; }. Start j od i + 1 sprawia, że każda para pojawia się dokładnie raz i nigdy nie ma pary (i, i).`,
            tests: (r) => ['4', '1', '2', '40', String(r.int(5, 39))],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) o.push(`${i} ${j}`); return join(o, `par: ${o.length}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int par = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            cout << i << " " << j << "\n";
            par++;
        }
    }
    cout << "par: " << par << "\n";
    return 0;
}`,
        },
        {
            id: 'for-tabliczka-naglowki', krok: 6, level: 'srednie',
            title: 'Tabliczka z nagłówkami',
            short: 'Tabliczka mnożenia z wierszem i kolumną opisów, wyrównana przez setw(4).',
            tags: ['for w for', 'setw', 'formatowanie'],
            statement: [
                'Wczytaj n i wypisz tabliczkę mnożenia n × n z nagłówkami, dokładnie w takim układzie jak w przykładzie.',
                'Pierwszy wiersz to x | i liczby od 1 do n, każda w polu szerokości 4 (wyrównana do prawej). Drugi wiersz to --+ i n razy po cztery myślniki. Dalej n wierszy: numer wiersza w, spacja, kreska | i iloczyny w · 1, …, w · n, każdy w polu szerokości 4.',
            ],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n + 2 wierszy, jak w przykładzie.'],
            constraints: ['1 ≤ n ≤ 9'],
            examples: [{ input: '3' }],
            hint: R`Nagłówek: cout << "x |"; i pętla z cout << setw(4) << k;. Linia: cout << "--+"; i pętla z "----". Potem pętla wierszy, a w niej pętla kolumn z setw(4) << w * k. setw działa tylko na najbliższą liczbę, więc piszesz go przed każdą.`,
            tests: () => ['3', '1', '9', '5', '2', '7'],
            solve: (inp) => { const n = nums(inp)[0]; const p = (x) => String(x).padStart(4); const o = ['x |' + range(1, n).map(p).join(''), '--+' + '----'.repeat(n)]; for (let w = 1; w <= n; w++) o.push(`${w} |` + range(1, n).map((k) => p(w * k)).join('')); return o.join('\n'); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << "x |";
    for (int k = 1; k <= n; k++) {
        cout << setw(4) << k;
    }
    cout << "\n--+";
    for (int k = 1; k <= n; k++) {
        cout << "----";
    }
    cout << "\n";
    for (int w = 1; w <= n; w++) {
        cout << w << " |";
        for (int k = 1; k <= n; k++) {
            cout << setw(4) << w * k;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-piramida-cyfr', krok: 6, level: 'srednie',
            title: 'Piramida z cyfr',
            short: 'Kropki z lewej, a potem cyfry w górę i w dół: ..1, .121, 12321.',
            tags: ['for w for', 'trzy wewnętrzne pętle'],
            statement: ['Wczytaj n i narysuj piramidę wysokości n. W wierszu numer w (od 1 do n) najpierw stoi n − w kropek, potem cyfry od 1 do w, a potem cyfry od w − 1 w dół do 1 — wszystko bez spacji.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy.'],
            constraints: ['1 ≤ n ≤ 9'],
            examples: [{ input: '4' }],
            hint: R`W każdym wierszu trzy pętle po kolei: kropki (n − w razy), cyfry rosnąco for (int k = 1; k <= w; k++) i cyfry malejąco for (int k = w - 1; k >= 1; k--). Rozpisz sobie wiersz dla w = 3: dwie kropki przy n = 5, potem 123, potem 21.`,
            tests: () => ['4', '1', '2', '9', '6'],
            solve: (inp) => { const n = nums(inp)[0]; return range(1, n).map((w) => '.'.repeat(n - w) + range(1, w).join('') + range(1, w - 1).reverse().join('')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int w = 1; w <= n; w++) {
        for (int k = 0; k < n - w; k++) {
            cout << ".";
        }
        for (int k = 1; k <= w; k++) {
            cout << k;
        }
        for (int k = w - 1; k >= 1; k--) {
            cout << k;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-pary-podzielne', krok: 6, level: 'srednie',
            title: 'Pary o sumie podzielnej przez k',
            short: 'Ile jest par i < j, których suma dzieli się przez k? Pętla w pętli liczy wszystkie.',
            tags: ['for w for', 'j = i + 1', 'licznik', '%'],
            statement: ['Wczytaj n i k. Wypisz, ile jest par liczb (i, j), w których 1 ≤ i < j ≤ n, a suma i + j dzieli się przez k.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ k ≤ 6000'],
            examples: [{ input: '5 3', note: 'Pary: (1, 2), (1, 5), (2, 4), (4, 5).' }, { input: '4 1' }],
            hint: R`Dwie pętle jak przy wypisywaniu wszystkich par, tylko zamiast wypisywać — licz: if ((i + j) % k == 0) ile++;. Dla n = 3000 par jest ok. 4,5 miliona — komputer sprawdzi je w ułamku sekundy.`,
            tests: (r) => ['5 3', '4 1', '1 1', '2 3', '3000 1', '3000 6000', '3000 7', `${r.int(100, 3000)} ${r.int(2, 100)}`, `${r.int(1000, 3000)} ${r.int(100, 6000)}`],
            solve: (inp) => { const [n, k] = nums(inp); let c = 0; for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) if ((i + j) % k === 0) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    long long ile = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            if ((i + j) % k == 0) {
                ile++;
            }
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 7 · sprawdź wszystkie możliwości
        {
            id: 'for-kury-i-krowy', krok: 7, level: 'latwe',
            title: 'Kury i krowy',
            short: 'Na podwórku g głów i n nóg. Sprawdź każdą możliwą liczbę krów.',
            tags: ['for', 'przeszukiwanie zupełne'],
            statement: ['Na podwórku są tylko kury (2 nogi) i krowy (4 nogi). Razem mają g głów i n nóg. Ile jest kur, a ile krów?', 'Wypisz dwa wiersze: kury: x i krowy: y. Jeśli takiego podwórka nie da się ułożyć, wypisz BRAK.'],
            input_format: ['Jeden wiersz z liczbami g i n.'],
            output_format: ['Dwa wiersze albo słowo BRAK.'],
            constraints: ['1 ≤ g ≤ 1000', '1 ≤ n ≤ 5000'],
            examples: [{ input: '10 28' }, { input: '3 5' }],
            hint: R`Sprawdź po kolei każdą możliwą liczbę krów: for (int krowy = 0; krowy <= g; krowy++). Kur jest wtedy g − krowy, a nóg 2 · kury + 4 · krowy. Gdy liczba nóg się zgadza — znalazłeś odpowiedź.`,
            tests: (r) => { const g = r.int(1, 1000), k = r.int(0, g); return ['10 28', '3 5', '1 2', '1 4', '1000 4000', '1000 2000', '1000 3001', '5 30', `${g} ${2 * (g - k) + 4 * k}`, `${r.int(1, 1000)} ${r.int(1, 5000)}`]; },
            solve: (inp) => { const [g, n] = nums(inp); for (let k = 0; k <= g; k++) if (2 * (g - k) + 4 * k === n) return join(`kury: ${g - k}`, `krowy: ${k}`); return 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int g, n;
    cin >> g >> n;
    bool jest = false;
    for (int krowy = 0; krowy <= g; krowy++) {
        int kury = g - krowy;
        if (2 * kury + 4 * krowy == n) {
            cout << "kury: " << kury << "\n";
            cout << "krowy: " << krowy << "\n";
            jest = true;
            break;
        }
    }
    if (!jest) {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-trzycyfrowe-suma', krok: 7, level: 'latwe',
            title: 'Trzycyfrowe o sumie cyfr s',
            short: 'Trzy pętle — po jednej na każdą cyfrę — dają wszystkie liczby trzycyfrowe po kolei.',
            tags: ['trzy pętle for', 'cyfry'],
            statement: ['Wczytaj s i wypisz w jednym wierszu, rosnąco, wszystkie liczby trzycyfrowe, których suma cyfr jest równa s.'],
            input_format: ['Jedna liczba całkowita s.'],
            output_format: ['Jeden wiersz z liczbami.'],
            constraints: ['1 ≤ s ≤ 27'],
            examples: [{ input: '2' }, { input: '26' }],
            hint: R`Cyfra setek a od 1 do 9, dziesiątek b od 0 do 9, jedności c od 0 do 9 — trzy pętle jedna w drugiej. Gdy a + b + c == s, wypisz 100 * a + 10 * b + c. Kolejność pętli od razu daje liczby rosnąco.`,
            tests: () => ['2', '26', '1', '27', '13', '9', '20', '5'],
            solve: (inp) => { const s = nums(inp)[0]; return range(100, 999).filter((x) => String(x).split('').reduce((p, c) => p + Number(c), 0) === s).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int s;
    cin >> s;
    for (int a = 1; a <= 9; a++) {
        for (int b = 0; b <= 9; b++) {
            for (int c = 0; c <= 9; c++) {
                if (a + b + c == s) {
                    cout << 100 * a + 10 * b + c << " ";
                }
            }
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-zakupy', krok: 7, level: 'srednie',
            title: 'Wydaj co do grosza',
            short: 'Długopisy po a zł, zeszyty po b zł. Na ile sposobów wydasz dokładnie n zł?',
            tags: ['for', 'przeszukiwanie', '%'],
            statement: ['Długopis kosztuje a zł, a zeszyt b zł. Na ile różnych sposobów można wydać dokładnie n zł, kupując same długopisy i zeszyty? Sposoby różnią się liczbą długopisów lub zeszytów (można nie kupić żadnego z nich).'],
            input_format: ['Jeden wiersz z liczbami a, b i n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a, b ≤ 10⁶', '1 ≤ n ≤ 10⁶'],
            examples: [{ input: '2 3 12', note: '6 długopisów; 3 długopisy i 2 zeszyty; 4 zeszyty — trzy sposoby.' }, { input: '4 6 7' }],
            hint: R`Wystarczy jedna pętla — po liczbie długopisów x od 0, dopóki a · x ≤ n. Reszta pieniędzy, n − a · x, musi wtedy w całości pójść na zeszyty, czyli dzielić się przez b. Druga pętla po zeszytach jest niepotrzebna.`,
            tests: (r) => ['2 3 12', '4 6 7', '1 1 1', '1 1 1000000', '1000000 1000000 1000000', '7 11 1000000', '999999 1000000 999999', `${r.int(1, 100)} ${r.int(1, 100)} ${r.int(1, 1e6)}`, `${r.int(1, 1e5)} ${r.int(1, 1e5)} ${r.int(1, 1e6)}`],
            solve: (inp) => { const [a, b, n] = nums(inp); let c = 0; for (let x = 0; a * x <= n; x++) if ((n - a * x) % b === 0) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, n;
    cin >> a >> b >> n;
    int sposoby = 0;
    for (long long x = 0; a * x <= n; x++) {
        if ((n - a * x) % b == 0) {
            sposoby++;
        }
    }
    cout << sposoby << "\n";
    return 0;
}`,
        },
        {
            id: 'for-dwa-kwadraty', krok: 7, level: 'srednie',
            title: 'Suma dwóch kwadratów',
            short: 'Znajdź wszystkie pary a ≤ b, dla których a² + b² = n.',
            tags: ['for w for', 'przeszukiwanie', 'warunek a * a <= n'],
            statement: ['Wczytaj n i wypisz wszystkie pary liczb całkowitych nieujemnych a ≤ b, dla których a² + b² = n — każdą w osobnym wierszu, rosnąco według a. Jeśli takich par nie ma, wypisz NIE.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Pary a b albo słowo NIE.'],
            constraints: ['1 ≤ n ≤ 1 000 000'],
            examples: [{ input: '25', note: '25 = 0² + 5² = 3² + 4²' }, { input: '3' }],
            hint: R`for (int a = 0; 2 * a * a <= n; a++) — przy a ≤ b na pewno 2a² ≤ n. W środku druga pętla po b od a, dopóki a² + b² ≤ n. Licz po cichu, ile par znalazłeś, żeby na końcu wiedzieć, czy wypisać NIE.`,
            tests: (r) => ['25', '3', '1', '2', '1000000', '999999', '325', '5525', '845000', String(r.int(1, 1e6)), String(r.int(1, 700) ** 2 + r.int(1, 700) ** 2)],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let a = 0; 2 * a * a <= n; a++) for (let b = a; a * a + b * b <= n; b++) if (a * a + b * b === n) o.push(`${a} ${b}`); return o.length ? o.join('\n') : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int a = 0; 2 * a * a <= n; a++) {
        for (int b = a; a * a + b * b <= n; b++) {
            if (a * a + b * b == n) {
                cout << a << " " << b << "\n";
                ile++;
            }
        }
    }
    if (ile == 0) {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-trojkaty-obwod', krok: 7, level: 'srednie',
            title: 'Trójkąty o obwodzie p',
            short: 'Ile trójkątów o całkowitych bokach a ≤ b ≤ c ma obwód p? Trzeci bok wynika z dwóch.',
            tags: ['for w for', 'nierówność trójkąta'],
            statement: ['Wczytaj p i wypisz, ile jest różnych trójkątów o bokach całkowitych a ≤ b ≤ c i obwodzie a + b + c = p. Z trzech odcinków da się zbudować trójkąt tylko wtedy, gdy a + b > c.'],
            input_format: ['Jedna liczba całkowita p.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ p ≤ 3000'],
            examples: [{ input: '9', note: 'Trójkąty (1, 4, 4), (2, 3, 4) i (3, 3, 3).' }, { input: '4' }],
            hint: R`Wystarczą dwie pętle: po a i po b ≥ a. Trzeci bok jest wtedy wyznaczony: c = p − a − b. Policz trójkąt, jeśli c ≥ b (żeby zachować kolejność a ≤ b ≤ c) i a + b > c.`,
            tests: (r) => ['9', '4', '1', '3', '6', '3000', '2999', '12', String(r.int(10, 3000)), String(r.int(100, 500))],
            solve: (inp) => { const p = nums(inp)[0]; let c = 0; for (let a = 1; a <= p; a++) for (let b = a; a + 2 * b <= p; b++) { const z = p - a - b; if (z >= b && a + b > z) c++; } return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int p;
    cin >> p;
    int ile = 0;
    for (int a = 1; a <= p; a++) {
        for (int b = a; a + b + b <= p; b++) {
            int c = p - a - b;
            if (c >= b && a + b > c) {
                ile++;
            }
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-kody-pin', krok: 7, level: 'srednie',
            title: 'Kody PIN',
            short: 'Cztery pętle po cyfrach: kody o sumie s bez dwóch takich samych cyfr obok siebie.',
            tags: ['cztery pętle for', '&&', 'przeszukiwanie'],
            statement: ['Kod PIN ma cztery cyfry (od 0000 do 9999). Wczytaj s i wypisz w pierwszym wierszu, ile jest kodów, w których suma cyfr jest równa s i żadne dwie sąsiednie cyfry nie są takie same. W drugim wierszu wypisz najmniejszy taki kod (cztery cyfry, z zerami z przodu), a jeśli żadnego nie ma — BRAK.'],
            input_format: ['Jedna liczba całkowita s.'],
            output_format: ['Dwa wiersze.'],
            constraints: ['0 ≤ s ≤ 36'],
            examples: [{ input: '2' }, { input: '36' }],
            hint: R`Cztery pętle — po jednej na każdą cyfrę a, b, c, d od 0 do 9. Warunek: a + b + c + d == s && a != b && b != c && c != d. Najmniejszy kod to pierwszy znaleziony, bo pętle idą od 0000 w górę. Wypisz go jako cztery cyfry po kolei.`,
            tests: () => ['2', '36', '0', '1', '18', '35', '34', '10', '27'],
            solve: (inp) => { const s = nums(inp)[0]; let c = 0, first = null; for (let x = 0; x <= 9999; x++) { const d = String(x).padStart(4, '0').split('').map(Number); if (d[0] + d[1] + d[2] + d[3] === s && d[0] !== d[1] && d[1] !== d[2] && d[2] !== d[3]) { c++; if (first === null) first = d.join(''); } } return join(String(c), first || 'BRAK'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int s;
    cin >> s;
    int ile = 0;
    bool jest = false;
    int pa = 0, pb = 0, pc = 0, pd = 0;
    for (int a = 0; a <= 9; a++) {
        for (int b = 0; b <= 9; b++) {
            for (int c = 0; c <= 9; c++) {
                for (int d = 0; d <= 9; d++) {
                    if (a + b + c + d == s && a != b && b != c && c != d) {
                        ile++;
                        if (!jest) {
                            jest = true;
                            pa = a; pb = b; pc = c; pd = d;
                        }
                    }
                }
            }
        }
    }
    cout << ile << "\n";
    if (jest) {
        cout << pa << pb << pc << pd << "\n";
    } else {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-z-cyfra', krok: 7, level: 'srednie',
            title: 'Liczby z cyfrą d',
            short: 'Ile liczb od 1 do n ma w zapisie cyfrę d? Dla każdej liczby — pętla po jej cyfrach.',
            tags: ['for', 'pętla po cyfrach w środku', 'flaga'],
            statement: ['Wczytaj n i cyfrę d. Wypisz, ile liczb od 1 do n ma w swoim zapisie dziesiętnym co najmniej jedną cyfrę d.'],
            input_format: ['Jeden wiersz z liczbami n i d.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1 000 000', '0 ≤ d ≤ 9'],
            examples: [{ input: '30 3', note: '3, 13 i 23 — trzy liczby.' }, { input: '100 0' }],
            hint: R`Zewnętrzna pętla for po liczbach x od 1 do n, a w środku pętla po cyfrach kopii x (while (k > 0) { if (k % 10 == d) …; k /= 10; }). Gdy znajdziesz cyfrę d, zapamiętaj to we fladze i przerwij pętlę po cyfrach. Uwaga: kopię zmieniaj, a nie licznik x!`,
            tests: (r) => ['30 3', '100 0', '1 1', '1 0', '9 9', '1000000 0', '1000000 7', String(r.int(1000, 1e6)) + ' ' + r.int(0, 9), String(r.int(10, 1000)) + ' ' + r.int(0, 9)],
            solve: (inp) => { const [n, d] = nums(inp); let c = 0; for (let x = 1; x <= n; x++) if (String(x).includes(String(d))) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, d;
    cin >> n >> d;
    int ile = 0;
    for (int x = 1; x <= n; x++) {
        int k = x;
        bool ma = false;
        while (k > 0) {
            if (k % 10 == d) {
                ma = true;
                break;
            }
            k /= 10;
        }
        if (ma) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-rownanie-xyz', krok: 7, level: 'srednie',
            title: 'Trzy pudełka',
            short: 'Rozłóż n kulek do trzech pudełek o pojemnościach a, b i c. Dwie pętle wystarczą.',
            tags: ['for w for', 'trzecia wartość z dwóch', 'licznik'],
            statement: ['Masz n jednakowych kulek i trzy pudełka. W pierwszym mieści się najwyżej a kulek, w drugim najwyżej b, w trzecim najwyżej c. Na ile sposobów można rozłożyć wszystkie kulki do pudełek? Sposoby różnią się liczbą kulek w którymś pudełku (pudełko może zostać puste).'],
            input_format: ['Jeden wiersz z liczbami n, a, b i c.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ n, a, b, c ≤ 3000'],
            examples: [{ input: '3 1 1 3', note: '(0, 0, 3), (0, 1, 2), (1, 0, 2), (1, 1, 1).' }, { input: '10 2 2 2' }],
            hint: R`Pętla po x (kulki w pierwszym pudełku) i y (w drugim) — trzecie pudełko dostaje resztę, z = n − x − y. Policz sposób, jeśli z jest z przedziału od 0 do c. Trzecia pętla po z byłaby zbędna, bo z wynika z x i y.`,
            tests: (r) => ['3 1 1 3', '10 2 2 2', '0 0 0 0', '3000 3000 3000 3000', '3000 1000 1000 1000', '2000 3000 0 1500',`${r.int(0, 3000)} ${r.int(0, 3000)} ${r.int(0, 3000)} ${r.int(0, 3000)}`, `${r.int(0, 100)} ${r.int(0, 50)} ${r.int(0, 50)} ${r.int(0, 50)}`],
            solve: (inp) => { const [n, a, b, c] = nums(inp); let k = 0; for (let x = 0; x <= a && x <= n; x++) for (let y = 0; y <= b && x + y <= n; y++) if (n - x - y <= c) k++; return String(k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, a, b, c;
    cin >> n >> a >> b >> c;
    long long sposoby = 0;
    for (int x = 0; x <= a && x <= n; x++) {
        for (int y = 0; y <= b && x + y <= n; y++) {
            int z = n - x - y;
            if (z <= c) {
                sposoby++;
            }
        }
    }
    cout << sposoby << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · szybkość pętli
        {
            id: 'for-ile-operacji', krok: 8, level: 'srednie',
            title: 'Ile razy wykona się ile++?',
            short: 'Policz obroty pętli w pętli wzorem — dla n = 10⁹ symulacja trwałaby lata.',
            tags: ['liczba obrotów', 'wzór zamiast pętli', 'long long'],
            statement: [
                'Ile razy wykona się instrukcja ile++ w tym fragmencie: for (int i = 1; i <= n; i++) for (int j = i + 1; j <= n; j++) ile++;',
                'Wczytaj n i wypisz tę liczbę. Dla dużych n uruchomienie pętli trwałoby latami — trzeba policzyć wynik wzorem.',
            ],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10⁹'],
            examples: [{ input: '4', note: 'Dla i = 1 trzy obroty, dla i = 2 dwa, dla i = 3 jeden, dla i = 4 zero: razem 6.' }, { input: '1' }],
            hint: R`Wewnętrzna pętla robi n − 1, potem n − 2, …, 1, 0 obrotów. To suma 1 + 2 + … + (n − 1), czyli n · (n − 1) / 2. Licz w long long: n · (n − 1) dla n = 10⁹ to 10¹⁸.`,
            tests: (r) => ['4', '1', '2', '3', '1000000000', '999999999', '100000', String(r.int(10, 1e9)), String(r.int(1000, 1e6))],
            solve: (inp) => { const n = BigInt(toks(inp)[0]); return String(n * (n - 1n) / 2n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << n * (n - 1) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'for-kwadraty-przedzial', krok: 8, level: 'latwe',
            title: 'Kwadraty w przedziale',
            short: 'Ile kwadratów liczb całkowitych leży między a i b? Pętla po k, a nie po liczbach.',
            tags: ['for', 'k * k <= b', 'long long'],
            statement: ['Wczytaj a i b i wypisz, ile liczb z przedziału od a do b (włącznie) jest kwadratami liczb całkowitych dodatnich (1, 4, 9, 16, …).', 'Przedział może mieć bilion liczb — sprawdzanie każdej po kolei nie zdąży.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 10¹²'],
            examples: [{ input: '10 50', note: '16, 25, 36 i 49.' }, { input: '17 24' }],
            hint: R`Zamiast przechodzić po liczbach od a do b, przejdź po pierwiastkach: for (long long k = 1; k * k <= b; k++) i licz te k, dla których k * k >= a. Dla b = 10¹² pętla wykona tylko milion obrotów.`,
            tests: (r) => ['10 50', '17 24', '1 1', '1 1000000000000', '999999999999 1000000000000', '2 3', '4 4', `${r.int(1, 1e6)} ${r.int(1e6, 1e12)}`, `${r.int(1e9, 1e11)} ${r.int(1e11, 1e12)}`],
            check: (inp) => { const [a, b] = nums(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = nums(inp); let c = 0; for (let k = 1; k * k <= b; k++) if (k * k >= a) c++; return String(c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long ile = 0;
    for (long long k = 1; k * k <= b; k++) {
        if (k * k >= a) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-pierwsza-duza', krok: 8, level: 'latwe',
            title: 'Czy bilion jest pierwszy?',
            short: 'Test pierwszości dla n do 10¹² — dzielniki sprawdzasz tylko do pierwiastka.',
            tags: ['for', 'd * d <= n', 'break', 'long long'],
            statement: ['Wczytaj n i wypisz TAK, jeśli n jest liczbą pierwszą, albo NIE w przeciwnym razie. Liczba 1 nie jest pierwsza.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 10¹²'],
            examples: [{ input: '999999999989' }, { input: '999999000001' }],
            hint: R`for (long long d = 2; d * d <= n; d++) if (n % d == 0) { pierwsza = false; break; } — najwyżej milion obrotów. Pętla aż do n wykonałaby bilion obrotów: około 15 minut zamiast tysięcznej części sekundy.`,
            tests: (r) => ['999999000001', '1000000000039', '1', '2', '4', '1000000000000', '999999999989', '999966000289', '600851475143', String(r.int(2, 1e12)), String(2 * r.int(1, 5e11) - 1)].filter((s) => Number(s) <= 1e12),
            solve: (inp) => (pierwsza(Number(toks(inp)[0])) ? 'TAK' : 'NIE'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    bool pierwsza = (n >= 2);
    for (long long d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            pierwsza = false;
            break;
        }
    }
    if (pierwsza) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'for-liczba-dzielnikow', krok: 8, level: 'srednie',
            title: 'Ile dzielników?',
            short: 'Dzielniki chodzą parami: d i n / d. Wystarczy szukać do pierwiastka.',
            tags: ['for', 'pary dzielników', 'd * d == n'],
            statement: ['Wczytaj n i wypisz, ile ma dzielników (razem z 1 i samą liczbą n).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10¹²'],
            examples: [{ input: '12' }, { input: '36', note: 'Dzielniki: 1, 2, 3, 4, 6, 9, 12, 18, 36 — szóstka ma parę z samą sobą.' }],
            hint: R`Dla każdego d ≤ √n, które dzieli n, masz od razu dwa dzielniki: d i n / d. Wyjątek: gdy d * d == n, to ta sama liczba — licz ją raz. Pętla: for (long long d = 1; d * d <= n; d++).`,
            tests: (r) => ['12', '36', '1', '2', '1000000000000', '963761198400', '999999999989', '999999000001', '735134400', String(r.int(1, 1e12)), String(r.int(1, 1e6) ** 2)],
            solve: (inp) => String(dzielniki(Number(toks(inp)[0])).length),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long ile = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) {
            if (d * d == n) {
                ile += 1;
            } else {
                ile += 2;
            }
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'for-dzielniki-rosnaco', krok: 8, level: 'srednie',
            title: 'Dzielniki po kolei',
            short: 'Wypisz wszystkie dzielniki n rosnąco — dwie pętle: w górę do √n i z powrotem.',
            tags: ['dwie pętle for', 'd * d <= n', 'kolejność'],
            statement: ['Wczytaj n i wypisz w jednym wierszu wszystkie jego dzielniki w kolejności rosnącej.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz z dzielnikami.'],
            constraints: ['1 ≤ n ≤ 10¹⁰'],
            examples: [{ input: '36' }, { input: '13' }],
            hint: R`Pierwsza pętla idzie od d = 1 w górę, dopóki d * d <= n, i wypisuje małe dzielniki d. Druga idzie od tego samego miejsca w dół (od ostatniego d z d * d <= n do 1) i wypisuje „duże” dzielniki n / d — z pominięciem przypadku d * d == n, żeby pierwiastka nie wypisać dwa razy.`,
            // 6983776800 ma najwięcej dzielników (2304) spośród liczb do 10¹⁰; 9998000099 = 99989 · 99991, 9998200081 = 99991².
            tests: (r) => ['36', '13', '1', '2', '10000000000', '6983776800', '9998000099', '9999999967', String(r.int(1, 1e10)), String(r.int(1, 1e5) ** 2), '9998200081'],
            check: (inp) => { const n = Number(toks(inp)[0]); return Number.isInteger(n) && n >= 1 && n <= 1e10 ? null : 'n poza 1..10^10'; },
            solve: (inp) => dzielniki(Number(toks(inp)[0])).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long d = 1;
    for (; d * d <= n; d++) {
        if (n % d == 0) {
            cout << d << " ";
        }
    }
    for (d = d - 1; d >= 1; d--) {
        if (n % d == 0 && d * d != n) {
            cout << n / d << " ";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'for-suma-dzielnikow', krok: 8, level: 'srednie',
            title: 'Suma dzielników',
            short: 'Zsumuj wszystkie dzielniki n do 10¹², dodając od razu całe pary d i n / d.',
            tags: ['for', 'pary dzielników', 'long long'],
            statement: ['Wczytaj n i wypisz sumę wszystkich jego dzielników (razem z 1 i samą liczbą n).'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10¹²'],
            examples: [{ input: '12', note: '1 + 2 + 3 + 4 + 6 + 12 = 28' }, { input: '1' }],
            hint: R`Jak przy liczeniu dzielników, tylko zamiast 1 lub 2 dodajesz do sumy d i n / d (albo samo d, gdy d * d == n). Suma może przekroczyć 10¹² — long long.`,
            tests: (r) => ['12', '1', '2', '1000000000000', '963761198400', '999999999989', '999999000001', '997002999', String(r.int(1, 1e12)), String(r.int(1, 1e6) ** 2)],
            solve: (inp) => String(dzielniki(Number(toks(inp)[0])).reduce((s, x) => s + x, 0)),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long suma = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) {
            suma += d;
            if (d * d != n) {
                suma += n / d;
            }
        }
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'for-pary-o-sumie', krok: 8, level: 'srednie',
            title: 'Pary o sumie s — szybko',
            short: 'Ile par a < b z liczb 1…n ma sumę s? Jedna pętla zamiast dwóch.',
            tags: ['jedna pętla zamiast dwóch', 'b = s - a'],
            statement: ['Wczytaj n i s. Wypisz, ile jest par liczb (a, b), w których 1 ≤ a < b ≤ n oraz a + b = s.', 'Uwaga: n może wynosić 20 milionów. Dwie pętle — po a i po b — wykonałyby ok. 2 · 10¹⁴ obrotów, czyli liczyłyby się kilka dni.'],
            input_format: ['Jeden wiersz z liczbami n i s.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 2 · 10⁷', '1 ≤ s ≤ 4 · 10⁷'],
            examples: [{ input: '6 7', note: '(1, 6), (2, 5), (3, 4).' }, { input: '5 20' }],
            hint: R`Gdy wiesz już, ile wynosi a, to b nie jest dowolne — musi być równe s − a. Wystarczy więc jedna pętla po a, a w niej sprawdzenie, czy b = s − a spełnia warunki a < b i b ≤ n.`,
            tests: (r) => ['6 7', '5 20', '1 1', '2 3', '20000000 20000001', '20000000 40000000', '20000000 39999999', '20000000 2', `${r.int(1, 2e7)} ${r.int(1, 4e7)}`, `${r.int(1e6, 2e7)} ${r.int(1, 1e6)}`],
            solve: (inp) => { const [n, s] = nums(inp); const lo = Math.max(1, s - n); const hi = Math.min(n, Math.floor((s - 1) / 2)); return String(Math.max(0, hi - lo + 1)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, s;
    cin >> n >> s;
    int ile = 0;
    for (int a = 1; a <= n; a++) {
        int b = s - a;
        if (a < b && b <= n) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
    ];
};
