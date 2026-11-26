// Liczby dwójkowe — ćwiczenia w trakcie lekcji, części 1–3: dwie cyfry (wagi pozycji, żarówki, potęgi dwójki, liczenie
// po dwójkowemu, ile liczb na k bitach), zamiana w obie strony (dzielenie przez 2 i reszty, w = w · 2 + bit, zero, długość
// zapisu, jedynki, stała szerokość) oraz inne systemy (dowolna podstawa, szesnastkowy, kolory, grupowanie bitów).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./liczby-dwojkowe-pomoc');
    const { calk, dw, zSystemu, naSystem, naKBitach, jedynki, dlugosc, losBin, czyDw, czy01, calkB, czyWSystemie } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const B = (x) => BigInt(x);
    const MAX18 = 10n ** 18n;
    // q i lista: „q\nx1\nx2…”
    const lista = (a) => `${a.length}\n${a.join('\n')}`;
    // q liczb BigInt z zakresu [lo, hi] plus podane na sztywno
    const losowe = (r, ile, lo, hi) => Array.from({ length: ile }, () => r.big(lo, hi));
    const zakresB = (t, lo, hi) => t.every((x) => calkB(x, lo, hi));

    return [
        // ================================================================ KROK 1 · dwie cyfry
        {
            id: 'ld-potegi-dwojki', krok: 1, level: 'latwe',
            title: 'Potęgi dwójki',
            short: 'Wypisz 1, 2, 4, 8, … aż do 2ⁿ. Każda potęga to poprzednia razy 2 — i od 2³¹ potrzebny jest long long.',
            tags: ['p = p * 2', 'long long', 'wagi pozycji'],
            statement: ['Wagi kolejnych pozycji w zapisie dwójkowym to potęgi dwójki: 1, 2, 4, 8, 16, … Każda jest dwa razy większa od poprzedniej.',
                'Wczytaj n i wypisz wszystkie potęgi dwójki od 2⁰ = 1 do 2ⁿ, każdą w osobnym wierszu. Zacznij od 1 i za każdym razem mnóż przez 2. Uwaga: 2³¹ = 2 147 483 648 nie mieści się już w int — użyj long long.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n + 1 wierszy: w wierszu numer k (licząc od zera) liczba 2ᵏ.'],
            constraints: ['0 ≤ n ≤ 62'],
            examples: [{ input: '5', note: 'Potęgi od 2⁰ do 2⁵: 1, 2, 4, 8, 16 i 32. Każda kolejna to poprzednia razy 2.' }],
            hint: R`long long p = 1; potem pętla for (int k = 0; k <= n; k++) { cout << p << "\n"; p = p * 2; }. Z int program „przekręci się” przy 2³¹ i zacznie wypisywać liczby ujemne albo zera.`,
            tests: () => ['0', '1', '10', '16', '30', '31', '32', '40', '62', '50'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 0, 62) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let k = 0; k <= n; k++) o.push(String(1n << B(k))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long p = 1;
    for (int k = 0; k <= n; k++) {
        cout << p << "\n";
        if (k < n) p = p * 2;
    }
    return 0;
}`,
        },
        {
            id: 'ld-wagi-zarowek', krok: 1, level: 'latwe',
            title: 'Wagi zapalonych żarówek',
            short: 'Żarówka numer k (licząc od prawej, od zera) waży 2ᵏ. Dodaj wagi zapalonych żarówek — to jest pokazywana liczba.',
            tags: ['waga 2ᵏ', 'suma wag', 'long long'],
            statement: ['W rzędzie stoją żarówki ponumerowane od prawej strony: 0, 1, 2, 3, … Żarówka numer k ma wagę 2ᵏ — żarówka 0 waży 1, żarówka 1 waży 2, żarówka 2 waży 4, żarówka 3 waży 8 i tak dalej.',
                'Liczba pokazywana przez rząd żarówek to suma wag zapalonych żarówek (zgaszone ważą zero). Wczytaj numery zapalonych żarówek i wypisz tę liczbę.'],
            input_format: ['W pierwszym wierszu liczba n — ile żarówek jest zapalonych.', 'W drugim wierszu n różnych numerów zapalonych żarówek, w dowolnej kolejności.'],
            output_format: ['Jedna liczba — suma wag zapalonych żarówek.'],
            constraints: ['1 ≤ n ≤ 63', 'Numery żarówek są różne i należą do przedziału od 0 do 62.'],
            examples: [{ input: '3\n0 2 3', note: 'Zapalone są żarówki 0, 2 i 3, czyli wagi 1, 4 i 8. Razem 13 — tak wygląda 13 zapisane dwójkowo: 1101.' },
                { input: '2\n5 1', note: 'Wagi 32 i 2 — razem 34. Kolejność numerów nie ma znaczenia.' }],
            hint: R`Dla każdego numeru k policz 2ᵏ: long long w = 1; i k razy w = w * 2;. Dodaj w do sumy (też long long). Dla żarówki 62 waga to 4 611 686 018 427 387 904 — w int się nie zmieści.`,
            tests: (r) => {
                const t = ['1\n0', '1\n62', '1\n31', '2\n30 31', '4\n0 1 2 3', '3\n32 0 1'];
                t.push(`63\n${r.shuffle(Array.from({ length: 63 }, (_, i) => i)).join(' ')}`);
                for (let i = 0; i < 5; i++) { const n = r.int(1, 40); t.push(`${n}\n${r.shuffle(Array.from({ length: 63 }, (_, i2) => i2)).slice(0, n).join(' ')}`); }
                t.push(`5\n${r.shuffle([2, 4, 6, 8, 10]).join(' ')}`);
                return t;
            },
            check: (inp) => { const t = nums(inp); const k = t.slice(1); return calk(t[0], 1, 63) && k.length === t[0] && k.every((x) => calk(x, 0, 62)) && new Set(k).size === k.length ? null : 'dane'; },
            solve: (inp) => String(nums(inp).slice(1).reduce((s, k) => s + (1n << B(k)), 0n)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        long long w = 1;
        for (int j = 0; j < k; j++) w = w * 2;
        suma += w;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-odczytaj-zarowki', krok: 1, level: 'latwe',
            title: 'Odczytaj liczbę z żarówek',
            short: 'Napis z zer i jedynek to rząd żarówek. Idź od prawej: waga 1, 2, 4, 8…, i dodawaj wagi tam, gdzie stoi 1.',
            tags: ['od prawej do lewej', 'waga *= 2', 'napis z 0 i 1'],
            statement: ['Rząd żarówek zapisano napisem z zer i jedynek: 1 to żarówka zapalona, 0 — zgaszona. Ostatni znak napisu to żarówka o wadze 1, przedostatni — o wadze 2, jeszcze wcześniejszy — o wadze 4 i tak dalej: każda pozycja w lewo waży dwa razy więcej.',
                'Dla każdego napisu wypisz liczbę, którą pokazują żarówki. Napisy mogą zaczynać się od zer — zgaszone żarówki z lewej strony nic nie zmieniają.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jeden napis z zer i jedynek.'],
            output_format: ['q wierszy — liczba pokazywana przez każdy rząd żarówek.'],
            constraints: ['1 ≤ q ≤ 300', 'Każdy napis ma od 1 do 62 znaków.'],
            examples: [{ input: '4\n1101\n00101\n1\n10000000', note: '1101: od prawej wagi 1, 2, 4, 8 — zapalone 1, 4 i 8, razem 13. 00101: 1 + 4 = 5 (zera z przodu nic nie zmieniają). 10000000: tylko waga 128.' }],
            hint: R`long long waga = 1, suma = 0; for (int i = s.size() - 1; i >= 0; i--) { if (s[i] == '1') suma += waga; waga = waga * 2; }. Pętla idzie od ostatniego znaku, bo to on ma wagę 1.`,
            tests: (r) => {
                const t = [lista(['0', '1', '10', '11', '000', '0001'])];
                t.push(lista(Array.from({ length: 300 }, () => losBin(r, r.int(1, 62), true))));
                t.push(lista(['1'.repeat(62), '1' + '0'.repeat(61), '0'.repeat(62), '0'.repeat(61) + '1']));
                t.push(lista(Array.from({ length: 50 }, () => losBin(r, r.int(1, 20)))));
                t.push(lista(Array.from({ length: 31 }, (_, i) => '1' + '0'.repeat(i))));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((s) => czy01(s, 62)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => String(zSystemu(s))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string s;
        cin >> s;
        long long waga = 1, suma = 0;
        for (int i = s.size() - 1; i >= 0; i--) {
            if (s[i] == '1') suma += waga;
            if (i > 0) waga = waga * 2;
        }
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-szachownica', krok: 1, level: 'latwe',
            title: 'Ryż na szachownicy',
            short: 'Na polu 1 jedno ziarenko, na każdym następnym dwa razy więcej. Ile leży na polu k, a ile razem na polach od 1 do k?',
            tags: ['2ᵏ⁻¹ i 2ᵏ − 1', 'long long', 'granica typu'],
            statement: ['Według legendy wynalazca szachów poprosił króla o nagrodę w ryżu: na pierwszym polu szachownicy jedno ziarenko, na drugim dwa, na trzecim cztery — na każdym kolejnym polu dwa razy więcej niż na poprzednim.',
                'Wczytaj k i wypisz dwie liczby: ile ziarenek leży na polu numer k oraz ile ziarenek leży razem na polach od 1 do k. Zauważ, że razem zawsze wychodzi o jedno ziarenko mniej niż na następnym polu — jak 1 + 2 + 4 = 7, a na czwartym polu leży 8.'],
            input_format: ['Jedna liczba całkowita k.'],
            output_format: ['Dwie liczby oddzielone spacją: liczba ziarenek na polu k i liczba ziarenek na polach od 1 do k.'],
            constraints: ['1 ≤ k ≤ 63'],
            examples: [{ input: '4', note: 'Na polach leży kolejno 1, 2, 4 i 8 ziarenek. Na czwartym polu 8, a razem 1 + 2 + 4 + 8 = 15.' },
                { input: '1', note: 'Na pierwszym polu jedno ziarenko i razem też jedno.' }],
            hint: R`Najprościej w pętli: long long pole = 1, razem = 1; i dla kolejnych pól pole = pole * 2; razem += pole;. Nie licz razem jako 2ᵏ − 1 przez obliczenie 2ᵏ: dla k = 63 liczba 2⁶³ nie mieści się w long long (największy long long to 2⁶³ − 1).`,
            tests: () => ['1', '2', '3', '10', '20', '31', '32', '33', '62', '63', '40'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 63) ? null : 'dane'; },
            solve: (inp) => { const k = B(nums(inp)[0]); return `${1n << (k - 1n)} ${(1n << k) - 1n}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    long long pole = 1, razem = 1;
    for (int i = 2; i <= k; i++) {
        pole = pole * 2;
        razem += pole;
    }
    cout << pole << " " << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-ile-zarowek', krok: 1, level: 'latwe',
            title: 'Ile żarówek na kody',
            short: 'Na k żarówkach da się ustawić 2ᵏ różnych kodów. Dla każdego n znajdź najmniejsze k, przy którym 2ᵏ ≥ n.',
            tags: ['2ᵏ możliwości', 'podwajanie w pętli', 'najmniejsze k'],
            statement: ['Każda żarówka jest zapalona albo zgaszona, więc jedna żarówka daje 2 różne kody, dwie żarówki — 4 kody, trzy — 8. Każda dodatkowa żarówka podwaja liczbę kodów: na k żarówkach jest ich 2ᵏ.',
                'Szyfrant chce dać każdemu z n tajnych agentów inny kod. Dla każdego n wypisz najmniejszą liczbę żarówek k, przy której kodów wystarczy dla wszystkich, czyli 2ᵏ ≥ n.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — najmniejsze k dla każdego n.'],
            constraints: ['1 ≤ q ≤ 1000', '2 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n8\n9\n2\n1000', note: 'Dla 8 agentów wystarczą 3 żarówki (2³ = 8). Dziewiąty agent wymaga czwartej żarówki (2⁴ = 16). Dwóm agentom wystarczy jedna żarówka, a tysiącowi — 10 żarówek (2¹⁰ = 1024).' }],
            hint: R`long long p = 1; int k = 0; while (p < n) { p = p * 2; k++; }. Liczbę n wczytaj do long long. Dla n = 10¹⁸ wyjdzie k = 60, a p dojdzie do 2⁶⁰ — mieści się w long long.`,
            tests: (r) => {
                const t = [lista(['2', '3', '4', '5', '7', '8', '9', '16', '17', '1024', '1025'])];
                const pot = []; for (let k = 1; k <= 59; k++) { pot.push(String(1n << B(k))); pot.push(String((1n << B(k)) + 1n)); pot.push(String((1n << B(k)) - 1n)); }
                t.push(lista(pot.filter((x) => B(x) >= 2n)));
                t.push(lista(['1000000000000000000', String((1n << 59n) + 1n), String(1n << 59n), '999999999999999999']));
                t.push(lista(losowe(r, 1000, 2n, MAX18).map(String)));
                t.push(lista(Array.from({ length: 300 }, () => String(r.int(2, 5000)))));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 2, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => { const n = B(x); let k = 0, p = 1n; while (p < n) { p *= 2n; k++; } return String(k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        long long p = 1;
        int k = 0;
        while (p < n) {
            p = p * 2;
            k++;
        }
        cout << k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-rozklad-na-potegi', krok: 1, level: 'srednie',
            title: 'Rozkład na potęgi dwójki',
            short: 'Zapisz x jako sumę różnych potęg dwójki, od największej: 13 = 8 + 4 + 1. Bierz zawsze największą potęgę, która się mieści.',
            tags: ['największa potęga ≤ x', 'odejmowanie', 'wypisywanie sumy'],
            statement: ['Każdą dodatnią liczbę da się zapisać jako sumę różnych potęg dwójki — i to dokładnie jeden raz. To właśnie jest zapis dwójkowy: potęgi, które biorą udział w sumie, to zapalone żarówki.',
                'Takiej sumy szuka się jak reszty w sklepie: weź największą potęgę dwójki, która nie przekracza x, odejmij ją od x i powtarzaj z tym, co zostało, aż zostanie zero. Dla każdej liczby wypisz jej rozkład w postaci x = a + b + … (potęgi od największej).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba x.'],
            output_format: ['q wierszy w postaci x = a + b + c — potęgi dwójki od największej, oddzielone napisem „ + ”. Jeśli x samo jest potęgą dwójki, wiersz ma postać x = x.'],
            constraints: ['1 ≤ q ≤ 20', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n8\n1\n100', note: '13: największa potęga ≤ 13 to 8, zostaje 5. Dla 5 największa to 4, zostaje 1. Potem 1. Ósemka jest potęgą dwójki, więc 8 = 8. 100 = 64 + 32 + 4.' }],
            hint: R`W pętli while (x > 0): znajdź p = 1 i podwajaj, dopóki p * 2 <= x. Wypisz p (przed każdą potęgą oprócz pierwszej wypisz " + "), potem x -= p. Wszystko w long long.`,
            tests: (r) => {
                const t = [lista(['1', '2', '3', '7', '8', '255', '256', '1000'])];
                t.push(lista(['1000000000000000000', String((1n << 59n) - 1n), String(1n << 59n), '999999999999999999']));
                t.push(lista(Array.from({ length: 20 }, () => String((1n << 59n) - 1n - B(r.int(0, 3))))));
                t.push(lista(losowe(r, 20, 1n, MAX18).map(String)));
                t.push(lista(Array.from({ length: 20 }, () => String(r.int(1, 100000)))));
                t.push(lista(Array.from({ length: 20 }, (_, i) => String((1n << B(i * 3)) + (i % 2 ? 1n : 0n)))));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 20) && t.length === q + 1 && zakresB(t.slice(1), 1, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => {
                const x = B(s); const p = []; let y = x;
                while (y > 0n) { let q = 1n; while (q * 2n <= y) q *= 2n; p.push(String(q)); y -= q; }
                return `${x} = ${p.join(' + ')}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        cin >> x;
        cout << x << " =";
        bool pierwsza = true;
        while (x > 0) {
            long long p = 1;
            while (p * 2 <= x) p = p * 2;
            if (!pierwsza) cout << " +";
            cout << " " << p;
            pierwsza = false;
            x -= p;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-licznik-dwojkowy', krok: 1, level: 'srednie',
            title: 'Licznik dwójkowy',
            short: 'Licznik z k cyframi zaczyna od samych zer i dodaje jeden: od prawej jedynki zmieniają się w zera, aż pierwsze zero zmieni się w jedynkę.',
            tags: ['liczenie po dwójkowemu', 'przeniesienie', 'napis jako licznik'],
            statement: ['Licznik ma k okienek, a w każdym może być tylko 0 albo 1. Na początku pokazuje same zera. Każde kliknięcie dodaje jeden — tak jak liczenie po dwójkowemu: idziesz od prawej strony i każdą jedynkę zamieniasz na zero, aż trafisz na zero — to zero zamieniasz na jedynkę i koniec. To dokładnie to samo, co przy liczeniu dziesiętnym 199 → 200, tylko że „przekręca się” już cyfra 1, a nie 9.',
                'Wypisz kolejne stany licznika od 0 do n, każdy w osobnym wierszu.'],
            input_format: ['Dwie liczby n i k.'],
            output_format: ['n + 1 wierszy: stany licznika po 0, 1, 2, …, n kliknięciach, każdy jako k cyfr 0 i 1.'],
            constraints: ['1 ≤ k ≤ 12', '0 ≤ n < 2ᵏ', 'n ≤ 1000'],
            examples: [{ input: '5 3', note: '000, potem 001. Przy drugim kliknięciu ostatnia jedynka zmienia się w zero, a zero przed nią — w jedynkę: 010. Dalej 011, potem dwie jedynki „przekręcają się” na zera i wychodzi 100, a na końcu 101.' }],
            hint: R`string s(k, '0'); — napis z k zer. Wypisz go, a potem n razy: int i = k - 1; while (s[i] == '1') { s[i] = '0'; i--; } s[i] = '1'; i znowu wypisz. Pętla while się zatrzyma, bo n < 2ᵏ — licznik nigdy nie dojdzie do samych jedynek, kiedy trzeba jeszcze dodawać.`,
            tests: () => ['0 1', '1 1', '3 2', '7 3', '15 4', '16 5', '100 7', '1000 10', '1000 12', '255 8', '63 12'],
            check: (inp) => { const t = nums(inp); return t.length === 2 && calk(t[1], 1, 12) && calk(t[0], 0, Math.min(1000, 2 ** t[1] - 1)) ? null : 'dane'; },
            solve: (inp) => { const [n, k] = nums(inp); return Array.from({ length: n + 1 }, (_, i) => i.toString(2).padStart(k, '0')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    string s(k, '0');
    cout << s << "\n";
    for (int krok = 0; krok < n; krok++) {
        int i = k - 1;
        while (s[i] == '1') {
            s[i] = '0';
            i--;
        }
        s[i] = '1';
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-porownaj-zarowki', krok: 1, level: 'srednie',
            title: 'Który rząd pokazuje więcej',
            short: 'Dwa rzędy żarówek tej samej długości (nawet 1000). Jedna żarówka waży więcej niż wszystkie na prawo od niej razem — decyduje pierwsza różnica od lewej.',
            tags: ['2ᵏ > 2ᵏ − 1', 'pierwsza różnica', 'za długie na long long'],
            statement: ['Dwa rzędy po m żarówek pokazują dwie liczby dwójkowe (napisy z zer i jedynek tej samej długości, mogą zaczynać się od zer). Która liczba jest większa?',
                'Napisy mogą mieć nawet 1000 znaków, więc nie zamienisz ich na long long. Ale nie trzeba: żarówka o wadze 2ᵏ waży więcej niż wszystkie żarówki na prawo od niej razem, bo 1 + 2 + 4 + … + 2ᵏ⁻¹ = 2ᵏ − 1. Dlatego o wyniku decyduje pierwsza od lewej pozycja, na której rzędy się różnią: większa jest ta liczba, która ma tam jedynkę.'],
            input_format: ['W pierwszym wierszu liczba q — ile par rzędów trzeba porównać.', 'Potem q par wierszy: dwa napisy z zer i jedynek tej samej długości.'],
            output_format: ['q wierszy: pierwsza, jeśli większa jest liczba z pierwszego napisu, druga — jeśli z drugiego, albo rowne, jeśli liczby są równe.'],
            constraints: ['1 ≤ q ≤ 20', 'Napisy w parze mają tę samą długość m, 1 ≤ m ≤ 1000.'],
            examples: [{ input: '3\n0110\n0101\n1000\n0111\n101\n101', note: '0110 i 0101: pierwsza różnica na trzeciej pozycji — w pierwszym napisie jest tam 1, więc większa jest pierwsza liczba (6 > 5). 1000 to 8, a 0111 to tylko 7: jedna żarówka o wadze 8 przeważa trzy pozostałe razem. Trzecia para to dwa razy 101 — liczby są równe.' }],
            hint: R`Przejdź pętlą od i = 0 i znajdź pierwsze miejsce, gdzie a[i] != b[i]. Kto ma tam '1', ten wygrywa; jeśli takiego miejsca nie ma — rowne. Ponieważ napisy mają tę samą długość, ten sam wynik daje zwykłe porównanie napisów: if (a > b).`,
            tests: (r) => {
                const para = (m, rozne) => { const a = losBin(r, m, true); let b = a; if (rozne) { const i = r.int(0, m - 1); b = a.slice(0, i) + (a[i] === '0' ? '1' : '0') + losBin(r, m - i - 1, true); } return [a, b.slice(0, m)]; };
                const t = [`3\n0\n1\n1\n0\n0\n0`];
                for (let k = 0; k < 4; k++) {
                    const pary = Array.from({ length: 20 }, (_, j) => (j % 4 === 3 ? para(r.int(1, 1000), false) : para(r.int(1, k === 0 ? 10 : 1000), true)));
                    t.push(`${pary.length}\n${pary.map((p) => (r() < 0.5 ? p : [p[1], p[0]]).join('\n')).join('\n')}`);
                }
                t.push(`2\n1${'0'.repeat(999)}\n0${'1'.repeat(999)}\n${'1'.repeat(1000)}\n${'1'.repeat(999)}0`);
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); if (!calk(q, 1, 20) || l.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) { const a = l[1 + 2 * i], b = l[2 + 2 * i]; if (!czy01(a, 1000) || !czy01(b, 1000) || a.length !== b.length) return 'para'; } return null; },
            solve: (inp) => { const l = L(inp); const q = Number(l[0]); const o = []; for (let i = 0; i < q; i++) { const a = l[1 + 2 * i], b = l[2 + 2 * i]; o.push(a > b ? 'pierwsza' : a < b ? 'druga' : 'rowne'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string a, b;
        cin >> a >> b;
        string wynik = "rowne";
        for (int i = 0; i < (int)a.size(); i++) {
            if (a[i] != b[i]) {
                if (a[i] == '1') wynik = "pierwsza";
                else wynik = "druga";
                break;
            }
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 2 · zamiana w obie strony
        {
            id: 'ld-na-dwojkowy', krok: 2, level: 'latwe',
            title: 'Z dziesiętnego na dwójkowy',
            short: 'Dziel przez 2 i zbieraj reszty — od dołu do góry dają zapis dwójkowy. Nie zapomnij o zerze: pętla while się wtedy nie wykona.',
            tags: ['n % 2 i n /= 2', 'doklejanie z przodu', 'zero'],
            statement: ['Dla każdej liczby n wypisz jej zapis dwójkowy bez zer na początku.',
                'Sposób z lekcji: dziel liczbę przez 2 i zapisuj reszty z dzielenia. Pierwsza reszta to ostatnia cyfra zapisu (waga 1), następna — przedostatnia i tak dalej, więc każdą nową cyfrę doklejaj z przodu napisu. Liczba 0 ma zapis 0 — ale pętla while (n > 0) dla zera nie wykona się ani razu, więc zero obsłuż osobno.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — zapis dwójkowy każdej liczby.'],
            constraints: ['1 ≤ q ≤ 300', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n0\n1\n64', note: '13 : 2 = 6 reszta 1, 6 : 2 = 3 reszta 0, 3 : 2 = 1 reszta 1, 1 : 2 = 0 reszta 1. Reszty od dołu: 1101. Zero to po prostu 0, jedynka — 1, a 64 = 2⁶ to jedynka i sześć zer.' }],
            hint: R`string s = ""; while (n > 0) { s = char('0' + n % 2) + s; n /= 2; } a przed pętlą if (n == 0) s = "0";. char(…) jest potrzebne: bez niego '0' + n % 2 to liczba, a liczby nie da się dodać do napisu.`,
            tests: (r) => {
                const t = [lista(Array.from({ length: 17 }, (_, i) => String(i)))];
                t.push(lista(['0', '1000000000000000000', String((1n << 59n) - 1n), String(1n << 59n), '999999999999999999', '2147483647', '2147483648', '4294967296']));
                t.push(lista(losowe(r, 300, 0n, MAX18).map(String)));
                t.push(lista(Array.from({ length: 300 }, () => String(r.int(0, 1000)))));
                t.push(lista(Array.from({ length: 60 }, (_, i) => String(1n << B(i)))));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 300) && t.length === q + 1 && zakresB(t.slice(1), 0, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => dw(x)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        string s = "";
        if (n == 0) s = "0";
        while (n > 0) {
            s = char('0' + n % 2) + s;
            n /= 2;
        }
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-na-dziesietny', krok: 2, level: 'latwe',
            title: 'Z dwójkowego na dziesiętny',
            short: 'Czytaj cyfry od lewej i rób w = w · 2 + cyfra — tak samo jak przy budowaniu liczby dziesiętnej z cyfr, tylko razy 2.',
            tags: ['w = w * 2 + bit', 's[i] - \'0\'', 'od lewej'],
            statement: ['Dla każdego napisu z zer i jedynek wypisz liczbę, którą zapisuje (napis może zaczynać się od zer).',
                'Użyj sposobu „od lewej”: zacznij od w = 0 i dla każdej kolejnej cyfry od lewej zrób w = w · 2 + cyfra. Każde mnożenie przez 2 przesuwa dotychczasowe cyfry o jedną pozycję w lewo — tak jak przy budowaniu liczby dziesiętnej z cyfr robiłeś w = w · 10 + cyfra.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jeden napis z zer i jedynek.'],
            output_format: ['q wierszy — wartość każdego napisu.'],
            constraints: ['1 ≤ q ≤ 300', 'Każdy napis ma od 1 do 60 znaków.'],
            examples: [{ input: '3\n1101\n0011\n100000', note: '1101: w = 0 → 0·2 + 1 = 1 → 1·2 + 1 = 3 → 3·2 + 0 = 6 → 6·2 + 1 = 13. 0011 to 3, a 100000 to 32.' }],
            hint: R`long long w = 0; for (char c : s) w = w * 2 + (c - '0');. c - '0' zamienia znak '0' albo '1' na liczbę 0 albo 1 (kody znaków stoją obok siebie).`,
            tests: (r) => [lista(['0', '1', '10', '11', '0000', '0110']), lista(Array.from({ length: 300 }, () => losBin(r, r.int(1, 60), true))),
                lista(['1'.repeat(60), '1' + '0'.repeat(59), '0'.repeat(60), '0'.repeat(59) + '1', '01'.repeat(30)]), lista(Array.from({ length: 100 }, () => losBin(r, r.int(1, 12))))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((s) => czy01(s, 60)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => String(zSystemu(s))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string s;
        cin >> s;
        long long w = 0;
        for (char c : s) w = w * 2 + (c - '0');
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-dlugosc-zapisu', krok: 2, level: 'latwe',
            title: 'Ile cyfr ma zapis dwójkowy',
            short: 'Policz, ile razy da się podzielić przez 2, zanim zostanie zero — tyle cyfr ma zapis. A zero ma jedną cyfrę!',
            tags: ['dzielenie przez 2', 'licznik', 'zero to 1 cyfra'],
            statement: ['Dla każdej liczby n wypisz, ile cyfr ma jej zapis dwójkowy (bez zer na początku).',
                'Każde dzielenie przez 2 z odrzuceniem reszty „zjada” jedną cyfrę z końca zapisu — tak jak dzielenie przez 10 zjada ostatnią cyfrę dziesiętną. Wystarczy więc policzyć, ile razy trzeba podzielić przez 2, żeby dojść do zera. Uwaga na zero: jego zapis to 0, czyli jedna cyfra, choć dzielić nie trzeba ani razu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — liczba cyfr zapisu dwójkowego każdej liczby.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '5\n13\n1\n0\n8\n7', note: '13 = 1101 ma 4 cyfry. 1 ma jedną. 0 też ma jedną cyfrę. 8 = 1000 ma 4 cyfry, a 7 = 111 — tylko 3: siódemka to ostatnia liczba z trzema cyframi.' }],
            hint: R`int ile = 0; while (n > 0) { n /= 2; ile++; } i na końcu if (ile == 0) ile = 1;. Liczbę wczytuj do long long.`,
            tests: (r) => {
                const t = [lista(Array.from({ length: 33 }, (_, i) => String(i)))];
                const p = []; for (let k = 0; k < 60; k++) { p.push(String(1n << B(k))); p.push(String((1n << B(k)) - 1n)); }
                t.push(lista(p));
                t.push(lista(losowe(r, 1000, 0n, MAX18).map(String)));
                t.push(lista(['0', '1000000000000000000', '0', '1']));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 0, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => String(dlugosc(x))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        int ile = 0;
        while (n > 0) {
            n /= 2;
            ile++;
        }
        if (ile == 0) ile = 1;
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-ile-jedynek', krok: 2, level: 'latwe',
            title: 'Ile jedynek',
            short: 'Reszta z dzielenia przez 2 to kolejna cyfra zapisu. Dziel i dodawaj reszty — ich suma to liczba jedynek.',
            tags: ['n % 2', 'zliczanie', 'bez napisu'],
            statement: ['Dla każdej liczby n wypisz, ile jedynek jest w jej zapisie dwójkowym — czyli ile żarówek trzeba zapalić, żeby ją pokazać.',
                'Nie musisz budować napisu: przy dzieleniu przez 2 każda reszta (0 albo 1) to kolejna cyfra zapisu, od końca. Wystarczy je zsumować.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — liczba jedynek w zapisie dwójkowym każdej liczby.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n0\n255\n1024', note: '13 = 1101 — trzy jedynki. Zero nie ma żadnej. 255 = 11111111 — osiem. 1024 = 2¹⁰ — jedna jedynka i dziesięć zer.' }],
            hint: R`int ile = 0; while (n > 0) { ile += n % 2; n /= 2; }. Dla zera pętla się nie wykona i wyjdzie 0 — tym razem to dobra odpowiedź.`,
            tests: (r) => {
                const t = [lista(Array.from({ length: 40 }, (_, i) => String(i)))];
                const p = []; for (let k = 0; k < 60; k++) { p.push(String(1n << B(k))); p.push(String((1n << B(k)) - 1n)); }
                t.push(lista(p));
                t.push(lista(losowe(r, 1000, 0n, MAX18).map(String)));
                t.push(lista(['1000000000000000000', '999999999999999999', '0']));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 0, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => String(jedynki(x))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        int ile = 0;
        while (n > 0) {
            ile += n % 2;
            n /= 2;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-na-k-bitach', krok: 2, level: 'latwe',
            title: 'Zapis na k bitach',
            short: 'Zapisz n dokładnie k cyframi dwójkowymi — z zerami z przodu. Pętla wykonuje się k razy, niezależnie od wielkości n.',
            tags: ['dokładnie k cyfr', 'pętla k razy', 'zera z przodu'],
            statement: ['Komputer trzyma liczby w komórkach o stałej liczbie bitów — 8, 16, 32 albo 64. Wolne miejsca z lewej strony wypełnia zerami.',
                'Dla każdej pary n, k wypisz zapis dwójkowy liczby n na dokładnie k bitach: z tyloma zerami z przodu, żeby cyfr było k. Zamiast pętli while (n > 0) zrób pętlę, która wykona się dokładnie k razy.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby n i k.'],
            output_format: ['q wierszy — zapis n na dokładnie k bitach.'],
            constraints: ['1 ≤ q ≤ 300', '1 ≤ k ≤ 60', '0 ≤ n < 2ᵏ (liczba mieści się na k bitach)', 'n ≤ 10¹⁸'],
            examples: [{ input: '4\n13 8\n13 4\n0 5\n1 1', note: '13 to 1101, a na 8 bitach dochodzą cztery zera z przodu: 00001101. Na 4 bitach zer nie trzeba. Zero na pięciu bitach to 00000.' }],
            hint: R`string s = ""; for (int i = 0; i < k; i++) { s = char('0' + n % 2) + s; n /= 2; }. Dla małych k możesz też użyć bitset<k>, ale k musi być wtedy stałą wpisaną w kod — tutaj k zmienia się w każdym wierszu.`,
            tests: (r) => {
                const t = [lista(['0 1', '1 1', '2 2', '3 2', '0 60', '5 3', '5 8', '255 8', '256 9'])];
                t.push(lista(Array.from({ length: 300 }, () => { const k = r.int(1, 60); const max = k === 60 ? MAX18 : (1n << B(k)) - 1n; return `${r.big(0n, max)} ${k}`; })));
                t.push(lista(['1000000000000000000 60', `${(1n << 59n) - 1n} 59`, `${(1n << 59n)} 60`, '7 60']));
                t.push(lista(Array.from({ length: 100 }, () => `${r.int(0, 15)} ${r.int(4, 16)}`)));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 300) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) { const n = t[1 + 2 * i], k = Number(t[2 + 2 * i]); if (!calk(k, 1, 60) || !calkB(n, 0, MAX18) || B(n) >= (1n << B(k))) return 'n k'; } return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(naKBitach(t[1 + 2 * i], Number(t[2 + 2 * i]))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        int k;
        cin >> n >> k;
        string s = "";
        for (int i = 0; i < k; i++) {
            s = char('0' + n % 2) + s;
            n /= 2;
        }
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-dwojkowy-palindrom', krok: 2, level: 'srednie',
            title: 'Dwójkowy palindrom',
            short: 'Czy zapis dwójkowy n czyta się tak samo od lewej i od prawej? 9 = 1001 tak, 10 = 1010 nie.',
            tags: ['zapis jako napis', 'palindrom', 'reverse'],
            statement: ['Palindrom to napis, który czytany od tyłu wygląda tak samo, np. kajak. Liczba 9 to dwójkowo 1001 — palindrom. Liczba 10 to 1010 — od tyłu 0101, więc nie.',
                'Dla każdej liczby n sprawdź, czy jej zapis dwójkowy (bez zer na początku) jest palindromem.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '5\n9\n10\n1\n6\n7', note: '9 = 1001 — TAK. 10 = 1010 — NIE. 1 to jedna cyfra — TAK. 6 = 110 — od tyłu 011, NIE. 7 = 111 — TAK.' }],
            hint: R`Zbuduj zapis dwójkowy w napisie s (jak w zadaniu „Z dziesiętnego na dwójkowy”), zrób kopię string t = s; reverse(t.begin(), t.end()); i porównaj: s == t. Ciekawostka: przy doklejaniu reszt z tyłu (s += …) od razu dostajesz zapis od tyłu.`,
            tests: (r) => {
                const pal = () => { const L2 = r.int(1, 59); const pol = losBin(r, Math.ceil(L2 / 2)); const s = pol + [...pol.slice(0, Math.floor(L2 / 2))].reverse().join(''); return String(zSystemu(s)); };
                const t = [lista(Array.from({ length: 40 }, (_, i) => String(i + 1)))];
                t.push(lista(Array.from({ length: 1000 }, (_, i) => (i % 2 ? pal() : String(r.big(1n, MAX18))))));
                t.push(lista(['1000000000000000000', String((1n << 59n) - 1n), String((1n << 59n) + 1n), String(1n << 59n)]));
                t.push(lista(Array.from({ length: 200 }, () => (r() < 0.5 ? pal() : String(r.int(1, 5000))))));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 1, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => { const s = dw(x); return s === [...s].reverse().join('') ? 'TAK' : 'NIE'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        string s = "";
        while (n > 0) {
            s = char('0' + n % 2) + s;
            n /= 2;
        }
        string od_tylu = s;
        reverse(od_tylu.begin(), od_tylu.end());
        if (s == od_tylu) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-odwrocone-bity', krok: 2, level: 'srednie',
            title: 'Liczba z odwróconych bitów',
            short: 'Zapisz n dwójkowo, odwróć cyfry i odczytaj z powrotem: 13 = 1101 → 1011 = 11. Da się to zrobić bez żadnego napisu.',
            tags: ['w = w * 2 + n % 2', 'odwracanie cyfr', 'zera z przodu znikają'],
            statement: ['Weź zapis dwójkowy liczby n (bez zer na początku), odwróć kolejność cyfr i odczytaj, jaką liczbę teraz zapisuje. Na przykład 13 = 1101 po odwróceniu daje 1011 = 11, a 6 = 110 daje 011 = 3 (zero z przodu nic nie znaczy).',
                'Da się to zrobić bez napisu, tak jak w lekcji Modulo odwracałeś cyfry dziesiętne: odcinaj ostatni bit (n % 2, n /= 2) i od razu doklejaj go na koniec nowej liczby (w = w · 2 + bit).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — liczba z odwróconych bitów.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n6\n8\n9', note: '13 = 1101 → 1011 = 11. 6 = 110 → 011 = 3. 8 = 1000 → 0001 = 1. 9 = 1001 to palindrom, więc zostaje 9.' }],
            hint: R`long long w = 0; while (n > 0) { w = w * 2 + n % 2; n /= 2; }. Bit, który z n wychodzi ostatni (najstarszy), do w wchodzi ostatni — czyli na najmłodszą pozycję.`,
            tests: (r) => [lista(Array.from({ length: 64 }, (_, i) => String(i + 1))), lista(losowe(r, 1000, 1n, MAX18).map(String)),
                lista(['1000000000000000000', String((1n << 59n) - 1n), String(1n << 59n), '1', String((1n << 59n) + 1n)]),
                lista(Array.from({ length: 60 }, (_, i) => String(1n << B(i))))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 1, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => String(zSystemu([...dw(x)].reverse().join('')))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        long long w = 0;
        while (n > 0) {
            w = w * 2 + n % 2;
            n /= 2;
        }
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-najwiecej-jedynek', krok: 2, level: 'srednie',
            title: 'Najwięcej zapalonych żarówek',
            short: 'Która z liczb ma najwięcej jedynek w zapisie dwójkowym? Przy remisie wygrywa mniejsza. Wypisz ją i jej zapis.',
            tags: ['liczenie jedynek', 'rekord z remisem', 'zapis dwójkowy'],
            statement: ['Każda z n liczb jest pokazywana na rzędzie żarówek. Znajdź liczbę, która zapala najwięcej żarówek, czyli ma najwięcej jedynek w zapisie dwójkowym. Jeśli kilka liczb ma tyle samo jedynek, wybierz najmniejszą z nich.',
                'Wypisz tę liczbę i jej zapis dwójkowy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: wybrana liczba i jej zapis dwójkowy (bez zer na początku), oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 10 000', 'Liczby są z przedziału od 0 do 10⁹.'],
            examples: [{ input: '5\n8 7 12 11 6', note: '8 = 1000 (1 jedynka), 7 = 111 (3), 12 = 1100 (2), 11 = 1011 (3), 6 = 110 (2). Po trzy jedynki mają 7 i 11 — wygrywa mniejsza, 7.' }],
            hint: R`Napisz funkcję int ileJedynek(int x) z pętlą while (x > 0) { ile += x % 2; x /= 2; }. Potem zwykły rekord z lekcji Max / Min: lepsza jest liczba z większą liczbą jedynek, a przy remisie — mniejsza.`,
            tests: (r) => {
                const t = [`1\n0`, `3\n0 0 0`, `4\n1 2 4 8`, `3\n1000000000 999999999 536870911`];
                t.push(`10000\n${r.arr(10000, 0, 1000000000).join(' ')}`);
                t.push(`50\n${r.arr(50, 0, 100).join(' ')}`);
                t.push(`6\n${r.shuffle([1023, 2046, 1535, 3071, 4094, 511]).join(' ')}`);
                t.push(`5000\n${r.arr(5000, 0, 1023).join(' ')}`);
                return t;
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); let best = a[0]; for (const x of a) { const j = jedynki(x), jb = jedynki(best); if (j > jb || (j === jb && x < best)) best = x; } return `${best} ${dw(best)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int ileJedynek(int x) {
    int ile = 0;
    while (x > 0) {
        ile += x % 2;
        x /= 2;
    }
    return ile;
}
int main() {
    int n;
    cin >> n;
    int best = -1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (best == -1 || ileJedynek(x) > ileJedynek(best) || (ileJedynek(x) == ileJedynek(best) && x < best)) best = x;
    }
    string s = "";
    int y = best;
    if (y == 0) s = "0";
    while (y > 0) {
        s = char('0' + y % 2) + s;
        y /= 2;
    }
    cout << best << " " << s << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · inne systemy
        {
            id: 'ld-na-system', krok: 3, level: 'latwe',
            title: 'Na system o podstawie k',
            short: 'Ten sam przepis co przy dwójkowym, tylko dzielisz przez k: reszty od dołu to cyfry zapisu w systemie k.',
            tags: ['n % k i n /= k', 'dowolna podstawa', 'zero'],
            statement: ['W systemie o podstawie k są cyfry od 0 do k − 1, a wagi pozycji to potęgi k: 1, k, k², k³, … System dziesiętny to k = 10, dwójkowy — k = 2.',
                'Dla każdej pary n, k wypisz zapis liczby n w systemie o podstawie k (bez zer na początku). Przepis jest ten sam co dla dwójkowego: dziel przez k i zbieraj reszty od dołu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby n i k.'],
            output_format: ['q wierszy — zapis n w systemie o podstawie k.'],
            constraints: ['1 ≤ q ≤ 300', '0 ≤ n ≤ 10¹⁸', '2 ≤ k ≤ 10'],
            examples: [{ input: '4\n13 2\n13 3\n100 8\n0 7', note: '13 w trójkowym: 13 : 3 = 4 r. 1, 4 : 3 = 1 r. 1, 1 : 3 = 0 r. 1 — zapis 111 (9 + 3 + 1). 100 w ósemkowym to 144 (64 + 4·8 + 4). Zero w każdym systemie to 0.' }],
            hint: R`To samo co z dwójką: if (n == 0) s = "0"; while (n > 0) { s = char('0' + n % k) + s; n /= k; }. Podstawa nie przekracza 10, więc wszystkie cyfry to zwykłe cyfry 0–9.`,
            tests: (r) => [lista(['0 2', '1 3', '9 10', '10 10', '8 8', '7 8', '13 2', '26 3', '27 3']),
                lista(Array.from({ length: 300 }, () => `${r.big(0n, MAX18)} ${r.int(2, 10)}`)),
                lista(['1000000000000000000 2', '1000000000000000000 3', '1000000000000000000 9', '999999999999999999 10', '0 10']),
                lista(Array.from({ length: 100 }, () => `${r.int(0, 1000)} ${r.int(2, 10)}`))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 300) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) if (!calkB(t[1 + 2 * i], 0, MAX18) || !calk(Number(t[2 + 2 * i]), 2, 10)) return 'n k'; return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(naSystem(t[1 + 2 * i], Number(t[2 + 2 * i]))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        int k;
        cin >> n >> k;
        string s = "";
        if (n == 0) s = "0";
        while (n > 0) {
            s = char('0' + n % k) + s;
            n /= k;
        }
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-z-systemu', krok: 3, level: 'latwe',
            title: 'Z systemu o podstawie k',
            short: 'Czytaj cyfry od lewej i rób w = w · k + cyfra. Dla k = 2 to znany przepis, dla k = 10 — zwykłe wczytywanie liczby.',
            tags: ['w = w * k + c', 'dowolna podstawa', 'od lewej'],
            statement: ['Dla każdej pary k, s wypisz, jaką liczbę zapisuje napis s w systemie o podstawie k.',
                'Przepis „od lewej” działa w każdym systemie: zacznij od w = 0 i dla każdej cyfry od lewej zrób w = w · k + cyfra.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczba k i napis s — zapis liczby w systemie o podstawie k (same cyfry od 0 do k − 1, bez zer na początku, chyba że liczba to 0).'],
            output_format: ['q wierszy — wartość każdego zapisu w systemie dziesiętnym.'],
            constraints: ['1 ≤ q ≤ 300', '2 ≤ k ≤ 10', 'Zapisana liczba nie przekracza 10¹⁸.'],
            examples: [{ input: '4\n3 111\n8 144\n2 1101\n10 2024', note: '111 trójkowo: w = 1, potem 1·3 + 1 = 4, potem 4·3 + 1 = 13. 144 ósemkowo to 1·64 + 4·8 + 4 = 100. W systemie dziesiętnym wychodzi ta sama liczba.' }],
            hint: R`long long w = 0; for (char c : s) w = w * k + (c - '0');. To dokładnie ten sam kod co dla dwójki — zamiast 2 stoi k.`,
            tests: (r) => [lista(['2 0', '2 1', '3 10', '10 10', '8 7', '8 10', '9 88']),
                lista(Array.from({ length: 300 }, () => { const k = r.int(2, 10); return `${k} ${naSystem(r.big(0n, MAX18), k)}`; })),
                lista([`2 ${dw(MAX18)}`, `3 ${naSystem(MAX18, 3)}`, `9 ${naSystem(MAX18, 9)}`, '10 1000000000000000000']),
                lista(Array.from({ length: 100 }, () => { const k = r.int(2, 10); return `${k} ${naSystem(r.int(0, 2000), k)}`; }))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 300) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) { const k = Number(t[1 + 2 * i]), s = t[2 + 2 * i]; if (!calk(k, 2, 10) || !czyWSystemie(s, k) || (s.length > 1 && s[0] === '0') || zSystemu(s, k) > MAX18) return 'k s'; } return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(String(zSystemu(t[2 + 2 * i], Number(t[1 + 2 * i])))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        int k;
        string s;
        cin >> k >> s;
        long long w = 0;
        for (char c : s) w = w * k + (c - '0');
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-szesnastkowo', krok: 3, level: 'latwe',
            title: 'Zapis szesnastkowy',
            short: 'Dziel przez 16; reszty od 10 do 15 zapisuj literami A–F. Albo pozwól zrobić to cout << hex << uppercase.',
            tags: ['cyfry A–F', 'n % 16', 'cout << hex'],
            statement: ['System szesnastkowy ma szesnaście cyfr: 0–9, a potem litery A (10), B (11), C (12), D (13), E (14) i F (15). Programiści lubią go, bo jedna cyfra szesnastkowa to dokładnie cztery bity.',
                'Dla każdej liczby n wypisz jej zapis szesnastkowy wielkimi literami, bez zer na początku.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — zapis szesnastkowy każdej liczby (wielkie litery).'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '5\n255\n16\n2024\n0\n3054', note: '255 = 15·16 + 15, czyli FF. 16 to 10 (jedna szesnastka, zero jedności). 2024 = 7·256 + 14·16 + 8, czyli 7E8. 3054 to BEE.' }],
            hint: R`Napis z cyframi: string cyfry = "0123456789ABCDEF"; i w pętli s = cyfry[n % 16] + s; n /= 16;. Albo krócej: cout << hex << uppercase << n << "\n"; — pamiętaj, że hex zostaje włączony dla wszystkich kolejnych liczb.`,
            tests: (r) => [lista(Array.from({ length: 40 }, (_, i) => String(i))), lista(losowe(r, 1000, 0n, MAX18).map(String)),
                lista(['255', '256', '4095', '4096', '65535', '1000000000000000000', String((1n << 59n) - 1n), '3054', '48879']),
                lista(Array.from({ length: 300 }, () => String(r.int(0, 100000))))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 0, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => naSystem(x, 16)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    string cyfry = "0123456789ABCDEF";
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        string s = "";
        if (n == 0) s = "0";
        while (n > 0) {
            s = cyfry[n % 16] + s;
            n /= 16;
        }
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-kolor-html', krok: 3, level: 'latwe',
            title: 'Kolor ze strony internetowej',
            short: 'Kolor #FF8000 to trzy liczby szesnastkowe: czerwony FF, zielony 80, niebieski 00. Zamień każdą parę cyfr na liczbę 0–255.',
            tags: ['dwie cyfry szesnastkowe', 'litery A–F i a–f', '16 · a + b'],
            statement: ['Na stronach internetowych kolory zapisuje się w postaci #RRGGBB: po krzyżyku trzy pary cyfr szesnastkowych — ile jest czerwonego (RR), zielonego (GG) i niebieskiego (BB). Każda para to liczba od 00 do FF, czyli od 0 do 255. Na przykład #FF8000 to pomarańczowy: czerwony 255, zielony 128, niebieski 0.',
                'Dla każdego koloru wypisz trzy liczby dziesiętne. Litery mogą być wielkie albo małe — #ff8000 to ten sam kolor.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jeden kolor w postaci #RRGGBB.'],
            output_format: ['q wierszy: trzy liczby (czerwony, zielony, niebieski) oddzielone spacjami.'],
            constraints: ['1 ≤ q ≤ 1000', 'Każdy kolor to krzyżyk i sześć cyfr szesnastkowych (0–9, A–F albo a–f).'],
            examples: [{ input: '3\n#FF8000\n#1e90ff\n#000000', note: '#FF8000: FF = 15·16 + 15 = 255, 80 = 8·16 = 128, 00 = 0. #1e90ff: 1e = 30, 90 = 144, ff = 255. Czarny to same zera.' }],
            hint: R`Napisz funkcję int cyfra(char c): dla '0'–'9' zwróć c - '0', dla 'A'–'F' zwróć c - 'A' + 10, dla 'a'–'f' — c - 'a' + 10. Para s[1], s[2] to cyfra(s[1]) * 16 + cyfra(s[2]), i tak samo dla pozycji 3–4 i 5–6.`,
            tests: (r) => {
                const hexc = () => { const c = '0123456789ABCDEFabcdef'; let s = '#'; for (let i = 0; i < 6; i++) s += c[r.int(0, c.length - 1)]; return s; };
                return [lista(['#000000', '#FFFFFF', '#ffffff', '#FF0000', '#00ff00', '#0000FF', '#808080', '#7F7F7F']), lista(Array.from({ length: 1000 }, hexc)), lista(['#AbCdEf', '#123456', '#fEdCbA', '#0a0B0c'])];
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((s) => /^#[0-9A-Fa-f]{6}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => [1, 3, 5].map((i) => String(parseInt(s.slice(i, i + 2), 16))).join(' ')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int cyfra(char c) {
    if (c >= '0' && c <= '9') return c - '0';
    if (c >= 'A' && c <= 'F') return c - 'A' + 10;
    return c - 'a' + 10;
}
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string s;
        cin >> s;
        for (int i = 1; i <= 5; i += 2) {
            cout << cyfra(s[i]) * 16 + cyfra(s[i + 1]);
            if (i < 5) cout << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-grupowanie-bitow', krok: 3, level: 'srednie',
            title: 'Grupowanie bitów po cztery',
            short: 'Bardzo długą liczbę dwójkową zamień na szesnastkową bez liczenia wartości: dziel bity na czwórki od prawej, każda czwórka to jedna cyfra.',
            tags: ['4 bity = 1 cyfra hex', 'od prawej', 'za długie na long long'],
            statement: ['Jedna cyfra szesnastkowa to dokładnie cztery bity: 0000 = 0, 0001 = 1, …, 1010 = A, …, 1111 = F. Dlatego zamiana z dwójkowego na szesnastkowy jest prosta: dzielisz bity na grupy po cztery, zaczynając od prawej strony, i każdą grupę zamieniasz na jedną cyfrę. Jeśli w ostatniej grupie z lewej brakuje bitów, dopisujesz zera z przodu.',
                'Napis z zer i jedynek może mieć nawet 10 000 znaków — takiej liczby nie zmieścisz w żadnym typie, ale grupowanie działa dla dowolnej długości. Wypisz zapis szesnastkowy wielkimi literami, bez zer na początku (zero to 0).'],
            input_format: ['Jeden napis z zer i jedynek (może zaczynać się od zer).'],
            output_format: ['Zapis szesnastkowy tej liczby (wielkie litery, bez zer na początku).'],
            constraints: ['Napis ma od 1 do 10 000 znaków.'],
            examples: [{ input: '11111110', note: 'Grupy od prawej: 1110 i 1111. 1111 = F, 1110 = E — wynik FE (254).' },
                { input: '0001011', note: 'Od prawej: 1011 = B, a z lewej zostaje 000 — po dopisaniu zera 0000 = 0. Zera z przodu odrzucamy, wynik B.' }],
            hint: R`Najpierw dopisz zera z przodu, aż długość będzie podzielna przez 4: while (s.size() % 4 != 0) s = "0" + s;. Potem dla i = 0, 4, 8, … policz grupę: v = 8·(s[i]-'0') + 4·(s[i+1]-'0') + 2·(s[i+2]-'0') + (s[i+3]-'0') i dopisz cyfry[v]. Na końcu usuń zera z przodu wyniku (ale zostaw jedną cyfrę).`,
            tests: (r) => ['0', '1', '1111', '10000', '0000', '00000000', '1010101010', losBin(r, 10000), losBin(r, 9999, true), '0'.repeat(9996) + '1011', losBin(r, 61), losBin(r, 4997), '1'.repeat(10000)],
            check: (inp) => (czy01(inp.trim(), 10000) ? null : 'dane'),
            solve: (inp) => naSystem(zSystemu(inp.trim()), 16),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    while (s.size() % 4 != 0) s = "0" + s;
    string cyfry = "0123456789ABCDEF";
    string w = "";
    for (int i = 0; i < (int)s.size(); i += 4) {
        int v = 8 * (s[i] - '0') + 4 * (s[i + 1] - '0') + 2 * (s[i + 2] - '0') + (s[i + 3] - '0');
        w += cyfry[v];
    }
    int p = 0;
    while (p + 1 < (int)w.size() && w[p] == '0') p++;
    cout << w.substr(p) << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-suma-cyfr-systemu', krok: 3, level: 'latwe',
            title: 'Suma cyfr w systemie k',
            short: 'Reszty z dzielenia przez k to cyfry zapisu w systemie k. Dodawaj je — napisu nie potrzebujesz.',
            tags: ['n % k', 'suma cyfr', 'cyfry powyżej 9'],
            statement: ['Dla każdej pary n, k wypisz sumę cyfr zapisu liczby n w systemie o podstawie k. Cyfry zapisane literami liczą się według swojej wartości: A = 10, B = 11, …, F = 15.',
                'Na przykład 255 szesnastkowo to FF, więc suma cyfr to 15 + 15 = 30, a dwójkowo 255 = 11111111 i suma cyfr to 8 — czyli liczba jedynek.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby n i k.'],
            output_format: ['q wierszy — suma cyfr n w systemie o podstawie k.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸', '2 ≤ k ≤ 16'],
            examples: [{ input: '4\n255 16\n255 2\n2024 10\n100 3', note: '255 = FF (16): 15 + 15 = 30. 255 = 11111111 (2): 8. 2024 (10): 2 + 0 + 2 + 4 = 8. 100 = 10201 (3): 1 + 0 + 2 + 0 + 1 = 4.' }],
            hint: R`int suma = 0; while (n > 0) { suma += n % k; n /= k; }. Reszta n % k to wartość cyfry, więc litery A–F w ogóle nie są potrzebne.`,
            tests: (r) => [lista(['0 2', '1 16', '15 16', '16 16', '255 16', '255 2', '100 3', '999999999999999999 10']),
                lista(Array.from({ length: 1000 }, () => `${r.big(0n, MAX18)} ${r.int(2, 16)}`)), lista(Array.from({ length: 15 }, (_, i) => `1000000000000000000 ${i + 2}`))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 1000) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) if (!calkB(t[1 + 2 * i], 0, MAX18) || !calk(Number(t[2 + 2 * i]), 2, 16)) return 'n k'; return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) { let n = B(t[1 + 2 * i]); const k = B(t[2 + 2 * i]); let s = 0n; while (n > 0n) { s += n % k; n /= k; } o.push(String(s)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        int k;
        cin >> n >> k;
        int suma = 0;
        while (n > 0) {
            suma += n % k;
            n /= k;
        }
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-z-systemu-do-systemu', krok: 3, level: 'srednie',
            title: 'Z systemu do systemu',
            short: 'Zapis w systemie a zamień na zapis w systemie b. Najprościej przez zwykłą liczbę: najpierw w = w · a + c, potem dzielenie przez b.',
            tags: ['dwa kroki', 'cyfry 0–9 i A–F', 'funkcje'],
            statement: ['Dla każdej trójki a, b, s zamień zapis s liczby w systemie o podstawie a na zapis tej samej liczby w systemie o podstawie b.',
                'Najprościej zrobić to w dwóch krokach: najpierw zamień s na zwykłą liczbę (w = w · a + cyfra), a potem tę liczbę na system b (dzielenie przez b i reszty od dołu). Cyfry od 10 do 15 zapisuj wielkimi literami A–F — i w wejściu, i w wyjściu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczby a i b oraz napis s — zapis w systemie a (cyfry 0–9 i A–F, bez zer na początku, chyba że liczba to 0).'],
            output_format: ['q wierszy — zapis tej samej liczby w systemie b.'],
            constraints: ['1 ≤ q ≤ 300', '2 ≤ a, b ≤ 16', 'Zapisana liczba nie przekracza 10¹⁸.'],
            examples: [{ input: '3\n2 16 11111111\n16 2 7E8\n10 3 13', note: '11111111 dwójkowo to 255, czyli FF szesnastkowo. 7E8 szesnastkowo to 2024, czyli 11111101000 dwójkowo. 13 trójkowo to 111.' }],
            hint: R`Dwie funkcje: long long wartosc(string s, int a) z w = w * a + cyfra(c) oraz string zapis(long long n, int b) z cyfry[n % b] i n /= b. Cyfrę znaku policz jak w zadaniu z kolorami: c - '0' dla cyfr, c - 'A' + 10 dla liter.`,
            tests: (r) => [lista(['2 10 0', '10 2 0', '2 16 11111111', '16 2 7E8', '10 3 13', '16 10 FF', '8 2 777', '2 8 111111']),
                lista(Array.from({ length: 300 }, () => { const a = r.int(2, 16), b = r.int(2, 16); return `${a} ${b} ${naSystem(r.big(0n, MAX18), a)}`; })),
                lista([`10 2 1000000000000000000`, `2 16 ${dw(MAX18)}`, `16 3 ${naSystem(MAX18, 16)}`, `3 16 ${naSystem(MAX18, 3)}`]),
                lista(Array.from({ length: 100 }, () => { const a = r.int(2, 16), b = r.int(2, 16); return `${a} ${b} ${naSystem(r.int(0, 5000), a)}`; }))],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 300) || t.length !== 3 * q + 1) return 'dane'; for (let i = 0; i < q; i++) { const a = Number(t[1 + 3 * i]), b = Number(t[2 + 3 * i]), s = t[3 + 3 * i]; if (!calk(a, 2, 16) || !calk(b, 2, 16) || !czyWSystemie(s, a) || (s.length > 1 && s[0] === '0') || zSystemu(s, a) > MAX18) return 'a b s'; } return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(naSystem(zSystemu(t[3 + 3 * i], Number(t[1 + 3 * i])), Number(t[2 + 3 * i]))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string cyfry = "0123456789ABCDEF";
long long wartosc(string s, int a) {
    long long w = 0;
    for (char c : s) w = w * a + (int)cyfry.find(c);
    return w;
}
string zapis(long long n, int b) {
    if (n == 0) return "0";
    string s = "";
    while (n > 0) {
        s = cyfry[n % b] + s;
        n /= b;
    }
    return s;
}
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        int a, b;
        string s;
        cin >> a >> b >> s;
        cout << zapis(wartosc(s, a), b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-palindrom-w-systemach', krok: 3, level: 'srednie',
            title: 'Palindrom w systemach',
            short: 'W których systemach od 2 do 16 zapis n czyta się tak samo od obu stron? 9 = 1001 dwójkowo i 100 trójkowo, więc dwójkowy tak, trójkowy nie.',
            tags: ['zapis w systemie k', 'palindrom', 'pętla po podstawach'],
            statement: ['Ta sama liczba w różnych systemach wygląda różnie. 9 to dwójkowo 1001 (palindrom), trójkowo 100 (nie), a ósemkowo 11 (palindrom).',
                'Dla każdej liczby n wypisz w kolejności rosnącej wszystkie podstawy k od 2 do 16, w których zapis n jest palindromem. Zapis z jednej cyfry (gdy n < k) też jest palindromem. Jeśli nie ma żadnej takiej podstawy, wypisz brak.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy: podstawy oddzielone spacjami albo słowo brak.'],
            constraints: ['1 ≤ q ≤ 300', '1 ≤ n ≤ 10⁹'],
            examples: [{ input: '3\n9\n10\n1000', note: '9: dwójkowo 1001 i ósemkowo 11 to palindromy, a od podstawy 10 w górę dziewiątka jest jedną cyfrą — jedna cyfra to zawsze palindrom. 10: trójkowo 101, czwórkowo 22, dziewiątkowo 11, a od podstawy 11 to jedna cyfra A. 1000 jest palindromem tylko w systemie dziewiątkowym: 1331 = 729 + 3·81 + 3·9 + 1.' }],
            hint: R`Wystarczy wektor cyfr — nie trzeba zamieniać ich na litery: vector<int> c; while (x > 0) { c.push_back(x % k); x /= k; }. Palindrom to c[i] == c[c.size() - 1 - i] dla każdego i. Pamiętaj, żeby dla każdej podstawy zaczynać od kopii n.`,
            tests: (r) => [lista(Array.from({ length: 100 }, (_, i) => String(i + 1))), lista(Array.from({ length: 300 }, () => String(r.int(1, 1e9)))),
                lista(['1000000000', '585', '1001', '2047', '65535', '255', '4095', '999999999']), lista(Array.from({ length: 300 }, () => String(r.int(1, 2000))))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 300) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((n) => { const ok = []; for (let k = 2; k <= 16; k++) { const s = n.toString(k); if (s === [...s].reverse().join('')) ok.push(k); } return ok.length ? ok.join(' ') : 'brak'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool palindrom(long long n, int k) {
    vector<int> c;
    while (n > 0) {
        c.push_back(n % k);
        n /= k;
    }
    for (int i = 0; i < (int)c.size(); i++)
        if (c[i] != c[c.size() - 1 - i]) return false;
    return true;
}
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        vector<int> ok;
        for (int k = 2; k <= 16; k++)
            if (palindrom(n, k)) ok.push_back(k);
        if (ok.empty()) cout << "brak";
        for (int i = 0; i < (int)ok.size(); i++) {
            if (i) cout << " ";
            cout << ok[i];
        }
        cout << "\n";
    }
    return 0;
}`,
        },
    ];
};
