// Silnia — ćwiczenia w trakcie lekcji, części 1–3: czym jest silnia (ustawienia w kolejce, 0! = 1,
// okrągły stół, osoby obok siebie), silnia w pętli krok po kroku (ślad, pętla w dół, iloczyn od a do b,
// co druga liczba, suma silni) oraz granice typów (int do 12!, long long do 20!, sprawdzanie przed mnożeniem).
// Uczeń zna pierwszy etap, tablice, napisy, pary, vector, sortowanie, max i min oraz zaokrąglanie.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const { fact, iloczyn } = require('./silnia-pomoc');
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const zakresy = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i));
    const lista = (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])); };

    // kolejne ustawienie liter w kolejności słownikowej (jak next_permutation); null, gdy to ostatnie
    const nastepne = (a) => {
        a = a.slice();
        let i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i < 0) return null;
        let j = a.length - 1;
        while (a[j] <= a[i]) j--;
        [a[i], a[j]] = [a[j], a[i]];
        const tail = a.splice(i + 1).reverse();
        return a.concat(tail);
    };
    const rozneLitery = (r, n) => r.shuffle('abcdefghijklmnopqrstuvwxyz'.split('')).slice(0, n).join('');

    return [
        // ================================================================ KROK 1 · czym jest silnia
        {
            id: 'sil-kolejka', krok: 1, level: 'latwe',
            title: 'Kolejka po lody',
            short: 'Na ile sposobów n osób może ustawić się w kolejce? Policz n! pętlą.',
            tags: ['n!', 'pętla for', 'start od 1'],
            statement: ['Przed budką z lodami czeka n osób. Na ile różnych sposobów mogą ustawić się w kolejce? Dwa ustawienia są różne, jeśli choć jedna osoba stoi w nich na innym miejscu.', 'Wczytaj n i wypisz liczbę różnych ustawień.'],
            input_format: ['Jedna liczba całkowita n — liczba osób.'],
            output_format: ['Jedna liczba — liczba różnych ustawień kolejki.'],
            constraints: ['1 ≤ n ≤ 12'],
            examples: [{ input: '3', note: 'Osoby A, B, C: ABC, ACB, BAC, BCA, CAB, CBA — sześć ustawień.' }, { input: '1' }],
            hint: R`Na pierwsze miejsce może stanąć każda z n osób, na drugie — każda z pozostałych n − 1 i tak dalej. Razem n · (n − 1) · … · 1, czyli n!. Zacznij od int w = 1; i w pętli od 1 do n mnóż w przez kolejne liczby. Przy n ≤ 12 wynik mieści się w int (12! = 479 001 600).`,
            tests: () => zakresy(1, 12),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 12 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    for (int i = 1; i <= n; i++) {
        w *= i;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-kilka-silni', krok: 1, level: 'latwe',
            title: 'Kilka silni naraz',
            short: 'Policz silnię każdej z t liczb — także 0!. Wynik zaczynaj od 1 dla każdej liczby osobno.',
            tags: ['0! = 1', 'pętla w pętli', 'reset przed każdą liczbą'],
            statement: ['Wczytaj t liczb. Dla każdej liczby n wypisz w osobnym wierszu wartość n!. Pamiętaj, że 0! = 1.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym silnia odpowiedniej liczby.'],
            constraints: ['1 ≤ t ≤ 13', '0 ≤ każda liczba ≤ 12'],
            examples: [{ input: '4\n3 0 5 1', note: '3! = 6, 0! = 1, 5! = 120, 1! = 1.' }],
            hint: R`Dla każdej liczby policz silnię od nowa: ustaw w = 1, a potem pomnóż przez 1, 2, …, n. Najczęstszy błąd: w = 1 stoi przed pętlą po t i wynik poprzedniej liczby „przecieka” do następnej. Ustawiaj w = 1 wewnątrz zewnętrznej pętli. Dla n = 0 wewnętrzna pętla nie wykona się ani razu i zostanie 1 — dokładnie tyle, ile trzeba.`,
            tests: (r) => ['1\n0', '1\n12', '13\n0 1 2 3 4 5 6 7 8 9 10 11 12', '13\n12 11 10 9 8 7 6 5 4 3 2 1 0', '5\n4 4 4 0 0',
                ...Array.from({ length: 4 }, () => { const t = r.int(2, 13); return `${t}\n${r.arr(t, 0, 12).join(' ')}`; })],
            check: (inp) => { const t = toks(inp); const v = lista(inp).map(Number); return v.length === Number(t[0]) && t.length === v.length + 1 && v.every((x) => x >= 0 && x <= 12) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => String(fact(Number(x)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int n;
        cin >> n;
        int w = 1;
        for (int i = 1; i <= n; i++) w *= i;
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-rozpisz', krok: 1, level: 'latwe',
            title: 'Rozpisana silnia',
            short: 'Wypisz 5! = 1 * 2 * 3 * 4 * 5 = 120 — gwiazdki tylko między liczbami.',
            tags: ['separator', 'pętla for', '0! = 1'],
            statement: ['Wczytaj n i wypisz silnię rozpisaną na iloczyn — dokładnie w formacie z przykładów: najpierw n!, potem znak =, potem kolejne liczby od 1 do n rozdzielone gwiazdkami, a na końcu znak = i wynik.', 'Wyjątek: 0! nie ma czego rozpisywać — wtedy wypisz tylko 0! = 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz w formacie z przykładów (spacje wokół znaków = i *).'],
            constraints: ['0 ≤ n ≤ 12'],
            examples: [{ input: '5' }, { input: '1' }, { input: '0' }],
            hint: R`Najpierw wypisz n << "! = ". Dla n = 0 dopisz tylko 1 i koniec. W przeciwnym razie wypisz 1, a potem w pętli od 2 do n — " * " i liczbę i (gwiazdka idzie PRZED każdą liczbą oprócz pierwszej). W tej samej pętli mnóż wynik, a na końcu dopisz " = " i wynik.`,
            tests: () => zakresy(0, 12),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 12 ? null : 'n'; },
            solve: (inp) => {
                const n = Number(inp);
                if (n === 0) return '0! = 1';
                return `${n}! = ${zakresy(1, n).join(' * ')} = ${fact(n)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n << "! = ";
    if (n == 0) {
        cout << 1 << "\n";
        return 0;
    }
    int w = 1;
    cout << 1;
    for (int i = 2; i <= n; i++) {
        cout << " * " << i;
        w *= i;
    }
    cout << " = " << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-ola-pierwsza', krok: 1, level: 'latwe',
            title: 'Ola stoi pierwsza',
            short: 'Jedna osoba ma ustalone miejsce, reszta ustawia się dowolnie — (n − 1)!.',
            tags: ['(n − 1)!', 'drzewko wyborów', '0! = 1'],
            statement: ['Do kolejki po autograf ustawia się n osób. Ola przyszła pierwsza i na pewno stoi na początku kolejki, a pozostałe osoby mogą ustawić się za nią w dowolnej kolejności.', 'Ile jest możliwych ustawień całej kolejki?'],
            input_format: ['Jedna liczba całkowita n — liczba osób razem z Olą.'],
            output_format: ['Jedna liczba — liczba możliwych ustawień.'],
            constraints: ['1 ≤ n ≤ 13'],
            examples: [{ input: '4', note: 'Ola stoi na początku, a trzy pozostałe osoby ustawiają się za nią na 3! = 6 sposobów.' }, { input: '1', note: 'W kolejce jest tylko Ola — jedno ustawienie.' }],
            hint: R`Miejsce Oli jest ustalone, więc zostaje ustawić n − 1 osób na n − 1 miejscach: (n − 1)! sposobów. Policz silnię z n − 1 tak samo jak zwykle — pętla od 1 do n − 1. Dla n = 1 pętla nie wykona się ani razu i zostanie 1 (bo 0! = 1).`,
            tests: () => zakresy(1, 13),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 13 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp) - 1)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    for (int i = 1; i <= n - 1; i++) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-dwie-polki', krok: 1, level: 'latwe',
            title: 'Dwie półki',
            short: 'Książki przestawiamy tylko w obrębie swojej półki. Ile wyglądów mają obie półki razem?',
            tags: ['a! · b!', 'dwie silnie', 'mnożymy możliwości'],
            statement: ['Na górnej półce stoi a różnych książek, a na dolnej — b innych różnych książek. Książki nie zmieniają półek, ale na każdej półce można je dowolnie poprzestawiać.', 'Na ile sposobów mogą wyglądać obie półki razem?'],
            input_format: ['Dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — liczba możliwych wyglądów obu półek.'],
            constraints: ['0 ≤ a, b', 'a + b ≤ 12'],
            examples: [{ input: '2 3', note: 'Górna półka: 2! = 2 ustawienia, dolna: 3! = 6. Każde ustawienie górnej pasuje do każdego ustawienia dolnej: 2 · 6 = 12.' }, { input: '0 4', note: 'Pusta półka ma jedno ustawienie (0! = 1).' }],
            hint: R`Policz a! i b! — dwie osobne pętle, każda z wynikiem startującym od 1. Każdy wygląd górnej półki łączy się z każdym wyglądem dolnej, więc wyniki mnożymy: a! · b!. Iloczyn nie przekroczy 12!, więc int wystarczy.`,
            tests: (r) => ['0 0', '12 0', '0 12', '6 6', '1 1', '11 1', '5 7', ...Array.from({ length: 5 }, () => { const a = r.int(0, 12); return `${a} ${r.int(0, 12 - a)}`; })],
            check: (inp) => { const [a, b] = toks(inp).map(Number); return a >= 0 && b >= 0 && a + b <= 12 ? null : 'zakres'; },
            solve: (inp) => { const [a, b] = toks(inp).map(Number); return String(fact(a) * fact(b)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int fa = 1, fb = 1;
    for (int i = 1; i <= a; i++) fa *= i;
    for (int i = 1; i <= b; i++) fb *= i;
    cout << fa * fb << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-okragly-stol', krok: 1, level: 'srednie',
            title: 'Okrągły stół',
            short: 'Rozsadzenia różniące się tylko obrotem stołu są takie same. Ile jest naprawdę różnych?',
            tags: ['(n − 1)!', 'obroty', 'n! / n'],
            statement: ['Przy okrągłym stole z n fotelami siada n rycerzy. Dwa rozsadzenia uznajemy za takie same, jeśli jedno da się otrzymać z drugiego przez obrót całego stołu — liczy się tylko to, kto siedzi obok kogo i w jakiej kolejności (zgodnie z ruchem wskazówek zegara), a nie to, który to fotel.', 'Na ile różnych sposobów rycerze mogą usiąść?'],
            input_format: ['Jedna liczba całkowita n — liczba rycerzy.'],
            output_format: ['Jedna liczba — liczba różnych rozsadzeń.'],
            constraints: ['1 ≤ n ≤ 13'],
            examples: [{ input: '3', note: 'A, B, C albo A, C, B (patrząc zgodnie z ruchem wskazówek zegara od A). Każde inne rozsadzenie to obrót jednego z tych dwóch.' }, { input: '4' }],
            hint: R`Posadź pierwszego rycerza gdziekolwiek — przy okrągłym stole wszystkie fotele są takie same, bo obrót niczego nie zmienia. Pozostali rycerze siadają na już ustalonych miejscach: (n − 1)! sposobów. Inaczej: ustawień w rzędzie jest n!, a każde rozsadzenie przy stole odpowiada n ustawieniom (n obrotów), więc n! / n = (n − 1)!.`,
            tests: () => zakresy(1, 13),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 13 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp) - 1)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    for (int i = 2; i <= n - 1; i++) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-obok-siebie', krok: 1, level: 'srednie',
            title: 'Ala i Bartek obok siebie',
            short: 'Dwie osoby chcą stać obok siebie. Sklej je w jedną „parę” i policz ustawienia.',
            tags: ['2 · (n − 1)!', 'sklejanie', 'drzewko wyborów'],
            statement: ['Do zdjęcia klasowego w jednym rzędzie ustawia się n osób, wśród nich Ala i Bartek, którzy koniecznie chcą stać obok siebie — w dowolnej kolejności: Ala może stać z lewej albo z prawej strony Bartka.', 'Na ile sposobów można ustawić cały rząd?'],
            input_format: ['Jedna liczba całkowita n — liczba osób razem z Alą i Bartkiem.'],
            output_format: ['Jedna liczba — liczba ustawień, w których Ala i Bartek stoją obok siebie.'],
            constraints: ['2 ≤ n ≤ 12'],
            examples: [{ input: '3', note: 'Osoby A (Ala), B (Bartek) i C: ABC, BAC, CAB, CBA — cztery ustawienia.' }, { input: '2' }],
            hint: R`Sklej Alę i Bartka w jedną „parę”. Teraz ustawiasz n − 1 elementów (parę i n − 2 pozostałych osób): (n − 1)! sposobów. W środku pary są jeszcze dwie możliwości — Ala z lewej albo z prawej — więc wynik to 2 · (n − 1)!.`,
            tests: () => zakresy(2, 12),
            check: (inp) => { const n = Number(inp); return n >= 2 && n <= 12 ? null : 'n'; },
            solve: (inp) => String(2n * fact(Number(inp) - 1)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 1;
    for (int i = 1; i <= n - 1; i++) w *= i;
    cout << 2 * w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-ustawienia-liter', krok: 1, level: 'srednie',
            title: 'Wszystkie ustawienia liter',
            short: 'Wypisz n! i wszystkie ustawienia liter słowa w kolejności alfabetycznej.',
            tags: ['n!', 'sort', 'next_permutation'],
            statement: ['Wczytaj słowo złożone z n różnych małych liter. W pierwszym wierszu wypisz, ile jest różnych ustawień tych liter. Potem wypisz wszystkie te ustawienia, każde w osobnym wierszu, w kolejności alfabetycznej (słownikowej).'],
            input_format: ['Jedno słowo z różnych małych liter alfabetu angielskiego.'],
            output_format: ['W pierwszym wierszu liczba ustawień, a potem wszystkie ustawienia w kolejności alfabetycznej.'],
            constraints: ['1 ≤ długość słowa ≤ 6', 'litery w słowie nie powtarzają się'],
            examples: [{ input: 'kot', note: '3 litery, więc 3! = 6 ustawień.' }, { input: 'a' }],
            hint: R`Liczba ustawień to silnia z długości słowa (s.size()) — policz ją pętlą. Ustawienia wypisz tak jak w lekcji o vectorze: najpierw sort(s.begin(), s.end()), żeby zacząć od najmniejszego ustawienia, a potem do { cout << s << "\n"; } while (next_permutation(s.begin(), s.end()));. Możesz też liczyć obroty tej pętli — wyjdzie dokładnie n!.`,
            tests: (r) => ['ab', 'ba', 'abcdef', 'zyxwvu', 'z', 'qwerty', 'dom', ...Array.from({ length: 5 }, () => rozneLitery(r, r.int(1, 6)))],
            check: (inp) => (/^[a-z]{1,6}$/.test(inp) && new Set(inp).size === inp.length ? null : 'słowo'),
            solve: (inp) => {
                let a = inp.split('').sort();
                const out = [String(fact(a.length))];
                while (a) { out.push(a.join('')); a = nastepne(a); }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int w = 1;
    for (int i = 1; i <= (int)s.size(); i++) w *= i;
    cout << w << "\n";
    sort(s.begin(), s.end());
    do {
        cout << s << "\n";
    } while (next_permutation(s.begin(), s.end()));
    return 0;
}`,
        },

        // ================================================================ KROK 2 · silnia w pętli
        {
            id: 'sil-silnia', krok: 2, level: 'latwe',
            title: 'Silnia w long long',
            short: 'Policz n! dla n do 20. Wynik startuje od 1 i mieszka w long long.',
            tags: ['long long w = 1', 'w *= i', 'i <= n'],
            statement: ['Wczytaj n i wypisz n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — n!.'],
            constraints: ['0 ≤ n ≤ 20'],
            examples: [{ input: '5' }, { input: '0', note: '0! = 1 — pętla nie wykona się ani razu.' }, { input: '20' }],
            hint: R`long long w = 1; for (int i = 1; i <= n; i++) w *= i; — i to wszystko. Wynik trzymaj w long long: 20! = 2 432 902 008 176 640 000 nie zmieści się w int. Sprawdź swój program dla n = 0 (ma wyjść 1) i dla n = 20.`,
            tests: () => zakresy(0, 20),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 20 ? null : 'n'; },
            solve: (inp) => String(fact(Number(inp))),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 1; i <= n; i++) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-slad', krok: 2, level: 'latwe',
            title: 'Ślad pętli',
            short: 'Po każdym obrocie pętli wypisz i oraz aktualny wynik w — jak w tabelce śladu.',
            tags: ['ślad pętli', 'cout w pętli', 'long long'],
            statement: ['Wypisz ślad pętli, która liczy n!. Wynik w startuje od 1, a pętla mnoży go kolejno przez 1, 2, …, n. Po każdym obrocie wypisz jeden wiersz: numer obrotu i oraz aktualną wartość w, oddzielone spacją.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['n wierszy — w każdym liczby i oraz w po pomnożeniu.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '4' }],
            hint: R`Wypisuj wewnątrz pętli, zaraz po w *= i;. To dokładnie tabelka śladu z lekcji: kolumna i i kolumna w. Ostatni wiersz zawiera n i n!.`,
            tests: () => ['1', '2', '7', '12', '13', '19', '20'],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 20 ? null : 'n'; },
            solve: (inp) => zakresy(1, Number(inp)).map((i) => `${i} ${fact(Number(i))}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 1; i <= n; i++) {
        w *= i;
        cout << i << " " << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-od-tylu', krok: 2, level: 'latwe',
            title: 'Silnia od tyłu',
            short: 'Wypisz 5 * 4 * 3 * 2 * 1 = 120 — pętla w dół i ten sam wynik.',
            tags: ['pętla w dół', 'i--', 'separator'],
            statement: ['Wczytaj n i wypisz iloczyn liczb od n do 1 w kolejności malejącej, a potem znak = i wynik — dokładnie w formacie z przykładów.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz w formacie z przykładów.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '5' }, { input: '1' }],
            hint: R`Pętla w dół: for (int i = n; i >= 1; i--). Mnożenie można robić w dowolnej kolejności — wynik wyjdzie ten sam, co przy liczeniu od 1. Wypisz najpierw n, a potem w pętli od n − 1 w dół — " * " i liczbę. Wynik w long long.`,
            tests: () => ['1', '2', '3', '9', '13', '18', '20'],
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 20 ? null : 'n'; },
            solve: (inp) => { const n = Number(inp); return `${zakresy(1, n).reverse().join(' * ')} = ${fact(n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = n; i >= 1; i--) {
        if (i < n) cout << " * ";
        cout << i;
        w *= i;
    }
    cout << " = " << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-ujemne', krok: 2, level: 'latwe',
            title: 'Silnia tylko dla nieujemnych',
            short: 'Dla ujemnego n wypisz BRAK — pętla sama z siebie dałaby tu 1.',
            tags: ['if przed pętlą', 'n < 0', '0! = 1'],
            statement: ['Wczytaj t liczb całkowitych. Dla każdej liczby n wypisz w osobnym wierszu n!, a jeśli n jest ujemne — słowo BRAK (silnia liczby ujemnej nie istnieje).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym silnia albo słowo BRAK.'],
            constraints: ['1 ≤ t ≤ 100', '−1000 ≤ każda liczba ≤ 20'],
            examples: [{ input: '4\n3 -2 0 20' }],
            hint: R`Najpierw if: dla n < 0 od razu wypisz BRAK. Uwaga: pętla for (int i = 1; i <= n; i++) dla ujemnego n nie wykona się ani razu i zostawi w = 1 — bez tego ifa program wypisałby 1, a to błąd. Dla każdej liczby zaczynaj od w = 1.`,
            tests: (r) => ['1\n-1', '1\n0', '1\n-1000', '2\n20 -20', '21\n' + zakresy(0, 20).join(' '),
                ...Array.from({ length: 3 }, () => { const t = r.int(5, 100); return `${t}\n${Array.from({ length: t }, () => (r() < 0.3 ? r.int(-1000, -1) : r.int(0, 20))).join(' ')}`; })],
            check: (inp) => { const v = lista(inp).map(Number); return v.length === Number(toks(inp)[0]) && v.every((x) => x >= -1000 && x <= 20) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((x) => (Number(x) < 0 ? 'BRAK' : String(fact(Number(x))))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int n;
        cin >> n;
        if (n < 0) {
            cout << "BRAK\n";
            continue;
        }
        long long w = 1;
        for (int i = 1; i <= n; i++) w *= i;
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-od-a-do-b', krok: 2, level: 'latwe',
            title: 'Iloczyn od a do b',
            short: 'Silnia, która nie zaczyna się od jedynki: a · (a + 1) · … · b.',
            tags: ['pętla od a do b', 'long long', 'iloczyn'],
            statement: ['Wczytaj dwie liczby a i b (a ≤ b) i wypisz iloczyn wszystkich liczb całkowitych od a do b: a · (a + 1) · … · b.'],
            input_format: ['Dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — iloczyn.'],
            constraints: ['1 ≤ a ≤ b ≤ 1 000 000', 'iloczyn jest nie większy niż 9 · 10¹⁸ (mieści się w long long)'],
            examples: [{ input: '5 7', note: '5 · 6 · 7 = 210.' }, { input: '4 4' }, { input: '1 20', note: 'Od 1 do 20 to po prostu 20!.' }],
            hint: R`To jak silnia, tylko pętla zaczyna się od a: long long w = 1; for (long long i = a; i <= b; i++) w *= i;. Liczby sięgają miliona, a wynik — prawie 10¹⁹, więc wynik koniecznie w long long. Zwróć uwagę: iloczyn od a do b to b! podzielone przez (a − 1)!, ale tak go nie licz — b! dla dużego b nie zmieści się w żadnym typie.`,
            tests: (r) => {
                const out = ['1 1', '1000000 1000000', '999999 1000000', '1 20', '2 20', '21 33', '100 108', '999990 999992'];
                for (let k = 0; k < 8; k++) {
                    const a = r.pick([r.int(1, 30), r.int(1, 1000), r.int(1, 1000000)]);
                    let b = a;
                    while (b < 1000000 && iloczyn(a, b + 1) <= 9n * E18 && r() < 0.85) b++;
                    out.push(`${a} ${b}`);
                }
                return out;
            },
            check: (inp) => { const [a, b] = toks(inp).map(Number); return a >= 1 && a <= b && b <= 1000000 && iloczyn(a, b) <= 9n * E18 ? null : 'zakres'; },
            solve: (inp) => { const [a, b] = toks(inp).map(Number); return String(iloczyn(a, b)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long w = 1;
    for (long long i = a; i <= b; i++) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-co-druga', krok: 2, level: 'srednie',
            title: 'Co druga liczba',
            short: 'Silnia podwójna: 7!! = 7 · 5 · 3 · 1. Pętla, która skacze co 2.',
            tags: ['n!!', 'i -= 2', 'long long'],
            statement: ['Silnia podwójna n!! to iloczyn co drugiej liczby od n w dół: dla nieparzystego n — wszystkich liczb nieparzystych od 1 do n, a dla parzystego — wszystkich parzystych od 2 do n. Na przykład 7!! = 7 · 5 · 3 · 1 = 105, a 8!! = 8 · 6 · 4 · 2 = 384. Umowa: 0!! = 1.', 'Wczytaj n i wypisz n!!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — n!!.'],
            constraints: ['0 ≤ n ≤ 33'],
            examples: [{ input: '7' }, { input: '8' }, { input: '0' }],
            hint: R`Pętla, która w każdym obrocie zmniejsza licznik o 2: for (int i = n; i >= 1; i -= 2) w *= i;. Dla n = 0 pętla nie wykona się ani razu i zostanie 1. Uwaga: n!! to nie (n!)! — to zupełnie inna, dużo mniejsza liczba. Dla n = 33 wynik przekracza 6 · 10¹⁸ — long long.`,
            tests: () => zakresy(0, 33),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 33 ? null : 'n'; },
            solve: (inp) => { let w = 1n; for (let i = Number(inp); i >= 1; i -= 2) w *= B(i); return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = n; i >= 1; i -= 2) w *= i;
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-suma', krok: 2, level: 'srednie',
            title: 'Suma silni',
            short: '1! + 2! + … + n! w jednej pętli — każda silnia z poprzedniej.',
            tags: ['dwa akumulatory', 's *= i', 'suma += s'],
            statement: ['Wczytaj n i wypisz sumę 1! + 2! + … + n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — suma silni.'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '4', note: '1 + 2 + 6 + 24 = 33.' }, { input: '1' }],
            hint: R`Nie licz każdej silni od nowa. W jednej pętli trzymaj dwie zmienne: s (bieżąca silnia) i suma. W każdym obrocie najpierw s *= i (teraz s to i!), a potem suma += s. Obie w long long — suma aż do 20! to około 2,56 · 10¹⁸.`,
            tests: () => zakresy(1, 20),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 20 ? null : 'n'; },
            solve: (inp) => { let s = 0n; for (let i = 1; i <= Number(inp); i++) s += fact(i); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long s = 1, suma = 0;
    for (int i = 1; i <= n; i++) {
        s *= i;
        suma += s;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-naprzemian', krok: 2, level: 'srednie',
            title: 'Plus, minus, plus…',
            short: 'Policz 1! − 2! + 3! − 4! + … ± n!. Wynik bywa ujemny.',
            tags: ['i % 2', 'suma ze znakiem', 'long long'],
            statement: ['Wczytaj n i wypisz wartość wyrażenia 1! − 2! + 3! − 4! + … ± n!, w którym znaki plus i minus występują na przemian: silnie liczb nieparzystych dodajemy, a parzystych — odejmujemy.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — wartość wyrażenia (może być ujemna).'],
            constraints: ['1 ≤ n ≤ 20'],
            examples: [{ input: '4', note: '1 − 2 + 6 − 24 = −19.' }, { input: '3', note: '1 − 2 + 6 = 5.' }],
            hint: R`Tak jak w sumie silni: w pętli najpierw s *= i, a potem — jeśli i jest nieparzyste (i % 2 == 1) — wynik += s, a w przeciwnym razie wynik -= s. Wynik może być ujemny i ogromny, więc long long (nie unsigned!).`,
            tests: () => zakresy(1, 20),
            check: (inp) => { const n = Number(inp); return n >= 1 && n <= 20 ? null : 'n'; },
            solve: (inp) => { let s = 0n; for (let i = 1; i <= Number(inp); i++) s += (i % 2 ? 1n : -1n) * fact(i); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long s = 1, wynik = 0;
    for (int i = 1; i <= n; i++) {
        s *= i;
        if (i % 2 == 1) wynik += s;
        else wynik -= s;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · granice typów
        {
            id: 'sil-jaki-typ', krok: 3, level: 'latwe',
            title: 'Jaki typ wystarczy?',
            short: 'int, long long czy ZA DUZO? Wystarczą dwie granice: 12! i 20!.',
            tags: ['int do 12!', 'long long do 20!', 'if / else if'],
            statement: ['Wczytaj n i wypisz najmniejszy typ, w którym zmieści się n!: słowo int albo long long. Jeśli n! nie mieści się nawet w long long, wypisz ZA DUZO.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz: int, long long albo ZA DUZO.'],
            constraints: ['0 ≤ n ≤ 1000'],
            examples: [{ input: '12' }, { input: '13' }, { input: '21' }],
            hint: R`Nie licz silni dla dużych n — przepełnienie i tak zepsułoby wynik, a program nawet by nie ostrzegł. Wystarczą granice z lekcji: int mieści silnie do 12! (479 001 600), a long long — do 20! (około 2,4 · 10¹⁸). Trzy przypadki: n ≤ 12, n ≤ 20 i reszta.`,
            tests: () => [...zakresy(0, 25), '100', '999', '1000'],
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 1000 ? null : 'n'; },
            solve: (inp) => { const f = fact(Number(inp)); return f <= 2147483647n ? 'int' : f <= 9223372036854775807n ? 'long long' : 'ZA DUZO'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n <= 12) cout << "int\n";
    else if (n <= 20) cout << "long long\n";
    else cout << "ZA DUZO\n";
    return 0;
}`,
        },
        {
            id: 'sil-ile-cyfr', krok: 3, level: 'latwe',
            title: 'Ile cyfr ma n!',
            short: 'Policz silnię, a potem jej cyfry — dzieląc przez 10.',
            tags: ['long long', 'while (w > 0)', 'w /= 10'],
            statement: ['Wczytaj n i wypisz, ile cyfr ma liczba n!.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba cyfr n!.'],
            constraints: ['0 ≤ n ≤ 20'],
            examples: [{ input: '5', note: '5! = 120 ma 3 cyfry.' }, { input: '0' }, { input: '20' }],
            hint: R`Policz silnię w long long, a potem jej cyfry pętlą z lekcji o pętli while: dopóki liczba jest większa od zera — dziel ją przez 10 i licz obroty. Wynik 1 (dla n = 0 i n = 1) ma jedną cyfrę — taka pętla wykona się raz, więc wszystko się zgadza. Możesz też użyć to_string(w).size().`,
            tests: () => zakresy(0, 20),
            check: (inp) => { const n = Number(inp); return n >= 0 && n <= 20 ? null : 'n'; },
            solve: (inp) => String(String(fact(Number(inp))).length),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 1; i <= n; i++) w *= i;
    int cyfry = 0;
    while (w > 0) {
        cyfry++;
        w /= 10;
    }
    cout << cyfry << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-silnie-do-x', krok: 3, level: 'latwe',
            title: 'Silnie nie większe niż x',
            short: 'Wypisz 1!, 2!, 3!, … dopóki nie przekroczą x.',
            tags: ['while', 'w *= ++i', 'x do 10¹⁸'],
            statement: ['Wczytaj liczbę x i wypisz w jednym wierszu wszystkie silnie 1!, 2!, 3!, …, które nie są większe od x — w kolejności rosnącej, oddzielone spacjami.'],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Jeden wiersz — silnie nie większe od x.'],
            constraints: ['1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '130' }, { input: '1' }],
            hint: R`Trzymaj i oraz w = i!. Dopóki w ≤ x: wypisz w, potem i++ i w *= i. Czy następna silnia się nie przepełni? Dla x ≤ 10¹⁸ największa wypisana silnia to najwyżej 19!, a następna — 20! — wciąż mieści się w long long. Więc tu zwykłe mnożenie wystarczy (w następnym zadaniu już nie zawsze).`,
            tests: (r) => ['1', '2', '5', '6', '719', '720', '1000000000000000000', '121645100408832000', '121645100408831999',
                ...Array.from({ length: 4 }, () => String(r.big(1, E18)))],
            check: (inp) => { const x = B(inp); return x >= 1n && x <= E18 ? null : 'x'; },
            solve: (inp) => { const x = B(inp); const out = []; for (let i = 1; fact(i) <= x; i++) out.push(String(fact(i))); return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x;
    cin >> x;
    long long w = 1;
    int i = 1;
    while (w <= x) {
        if (i > 1) cout << " ";
        cout << w;
        i++;
        w *= i;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-pierwsza-wieksza', krok: 3, level: 'srednie',
            title: 'Pierwsza silnia większa od x',
            short: 'Najmniejsze n, dla którego n! > x — i sama silnia.',
            tags: ['while (w <= x)', 'n++', 'warunek stopu'],
            statement: ['Wczytaj x i wypisz najmniejsze n, dla którego n! > x, a obok — samą wartość n!.'],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Jeden wiersz: liczby n i n! oddzielone spacją.'],
            constraints: ['1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '100', note: '4! = 24 ≤ 100, a 5! = 120 > 100.' }, { input: '120', note: '5! = 120 nie jest większe od 120 — dopiero 6! = 720.' }],
            hint: R`Zacznij od n = 0 i w = 1 (bo 0! = 1). Dopóki w ≤ x: n++ i w *= n. Gdy pętla się skończy, w to pierwsza silnia większa od x, a n — jej numer. Przepełnienia nie ma: dla x ≤ 10¹⁸ pętla zatrzyma się najpóźniej na 20!.`,
            tests: (r) => ['1', '2', '5', '6', '23', '24', '25', '3628799', '3628800', '1000000000000000000', '121645100408832000', '121645100408831999',
                ...Array.from({ length: 4 }, () => String(r.big(1, E18))), ...Array.from({ length: 3 }, () => String(r.int(1, 1000000)))],
            check: (inp) => { const x = B(inp); return x >= 1n && x <= E18 ? null : 'x'; },
            solve: (inp) => { const x = B(inp); let n = 0; while (fact(n) <= x) n++; return `${n} ${fact(n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x;
    cin >> x;
    int n = 0;
    long long w = 1;
    while (w <= x) {
        n++;
        w *= n;
    }
    cout << n << " " << w << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-w-budzecie', krok: 3, level: 'srednie',
            title: 'Największa silnia w budżecie',
            short: 'Największe n, dla którego n! ≤ x. Sprawdzaj, zanim pomnożysz: w ≤ x / (n + 1).',
            tags: ['w <= x / (n + 1)', 'sprawdzanie przed mnożeniem', 'long long'],
            statement: ['Wczytaj x i wypisz największe n, dla którego n! ≤ x.'],
            input_format: ['Jedna liczba całkowita x.'],
            output_format: ['Jedna liczba — największe n, dla którego n! ≤ x.'],
            constraints: ['1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '130', note: '5! = 120 ≤ 130, a 6! = 720 > 130.' }, { input: '1', note: '1! = 1 ≤ 1, a 2! = 2 > 1.' }, { input: '720' }],
            hint: R`Licz kolejne silnie, dopóki następna mieści się w x. Następna silnia to w · (n + 1), a warunek w · (n + 1) ≤ x możesz sprawdzić bez mnożenia: w ≤ x / (n + 1) (dzielenie całkowite). To nawyk, który chroni przed przepełnieniem — tutaj akurat by do niego nie doszło, ale w następnych zadaniach już tak.`,
            tests: (r) => ['1', '2', '3', '5', '6', '7', '719', '720', '721', '1000000000000000000', '121645100408832000', '121645100408831999', '6402373705728000', '6402373705727999',
                ...Array.from({ length: 4 }, () => String(r.big(1, E18))), ...Array.from({ length: 2 }, () => String(r.int(1, 100000)))],
            check: (inp) => { const x = B(inp); return x >= 1n && x <= E18 ? null : 'x'; },
            solve: (inp) => { const x = B(inp); let n = 1; while (fact(n + 1) <= x) n++; return String(n); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x;
    cin >> x;
    long long w = 1;
    int n = 1;
    while (w <= x / (n + 1)) {
        n++;
        w *= n;
    }
    cout << n << "\n";
    return 0;
}`,
        },
        {
            id: 'sil-czy-silnia', krok: 3, level: 'srednie',
            title: 'Czy to silnia?',
            short: 'Dla każdej liczby: której silnią jest — albo NIE.',
            tags: ['while (w < x)', 'w == x', 'x = 1 to 0!'],
            statement: ['Wczytaj t liczb. Dla każdej liczby x sprawdź, czy jest silnią jakiejś liczby: jeśli tak, wypisz najmniejsze n, dla którego n! = x, a jeśli nie — wypisz NIE. Każda odpowiedź w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych.'],
            output_format: ['t wierszy — w każdym liczba n albo słowo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '5\n120 1 100 2 6227020800', note: '1 = 0! (i też 1!), więc najmniejsze n to 0.' }],
            hint: R`Dla każdej liczby x licz kolejne silnie od 0! = 1, dopóki są mniejsze od x: while (w < x) { n++; w *= n; }. Po pętli sprawdź, czy trafiłeś dokładnie: w == x. Dla x = 1 pętla nie wykona się ani razu i zostanie n = 0 — dobrze, bo 0! = 1. Pamiętaj, żeby dla każdej liczby zaczynać od n = 0 i w = 1.`,
            tests: (r) => {
                const f = (n) => String(fact(n));
                const jedna = () => (r() < 0.5 ? f(r.int(0, 19)) : r() < 0.5 ? String(fact(r.int(2, 19)) + B(r.pick([-1, 1, 2]))) : String(r.big(1, E18)));
                return ['1\n1', '1\n2', '1\n3', `20\n${Array.from({ length: 20 }, (_, i) => f(i)).join(' ')}`, '2\n1000000000000000000 121645100408832000',
                    `50\n${Array.from({ length: 50 }, jedna).join(' ')}`, `1000\n${Array.from({ length: 1000 }, jedna).join(' ')}`];
            },
            check: (inp) => { const v = lista(inp).map(B); return v.length === Number(toks(inp)[0]) && v.every((x) => x >= 1n && x <= E18) ? null : 'zakres'; },
            solve: (inp) => lista(inp).map((s) => { const x = B(s); let n = 0; while (fact(n) < x) n++; return fact(n) === x ? String(n) : 'NIE'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x;
        cin >> x;
        int n = 0;
        long long w = 1;
        while (w < x) {
            n++;
            w *= n;
        }
        if (w == x) cout << n << "\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-czy-przekracza', krok: 3, level: 'srednie',
            title: 'Czy n! przekracza x?',
            short: 'n do miliarda, a n! nie mieści się nigdzie. Przerwij, zanim przekroczysz x.',
            tags: ['w > x / i', 'break', 'bez przepełnienia'],
            statement: ['Wczytaj t par liczb n i x. Dla każdej pary wypisz w osobnym wierszu TAK, jeśli n! > x, albo NIE w przeciwnym razie.', 'Uwaga: n może być bardzo duże — tak duże, że n! nie zmieści się w żadnym typie.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W kolejnych t wierszach po dwie liczby: n i x.'],
            output_format: ['t wierszy — w każdym TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10⁹', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4\n5 100\n5 120\n1000000000 999999999999999999\n0 1' }],
            hint: R`Licz silnię, ale przerwij, zanim przekroczy x: przed pomnożeniem przez i sprawdź, czy w > x / i. Jeśli tak, to w · i > x — odpowiedź to na pewno TAK (dalsze mnożenie już tylko zwiększa wynik), więc break. Jeśli pętla dojdzie do końca, porównaj w > x. Dzięki temu w nigdy się nie przepełni, a pętla kończy się po najwyżej dwudziestu kilku obrotach nawet dla n = 10⁹.`,
            tests: (r) => {
                const para = () => {
                    const n = r.pick([r.int(0, 25), r.int(0, 25), r.int(0, 1000000000)]);
                    let x;
                    if (n <= 20 && r() < 0.6) x = fact(n) + B(r.pick([-1, 0, 0, 1])); else x = r.big(1, E18);
                    if (x < 1n) x = 1n;
                    if (x > E18) x = E18;
                    return `${n} ${x}`;
                };
                return ['1\n0 1', '1\n1 1', '1\n2 1', '1\n20 1000000000000000000', '1\n19 121645100408832000', '1\n19 121645100408831999', '1\n1000000000 1000000000000000000',
                    `30\n${Array.from({ length: 30 }, para).join('\n')}`, `1000\n${Array.from({ length: 1000 }, para).join('\n')}`];
            },
            check: (inp) => { const t = toks(inp); const k = Number(t[0]); if (t.length !== 1 + 2 * k) return 'liczba'; for (let i = 0; i < k; i++) { const n = Number(t[1 + 2 * i]), x = B(t[2 + 2 * i]); if (n < 0 || n > 1e9 || x < 1n || x > E18) return 'zakres'; } return null; },
            solve: (inp) => {
                const t = toks(inp); const out = [];
                for (let i = 0; i < Number(t[0]); i++) {
                    const n = Number(t[1 + 2 * i]), x = B(t[2 + 2 * i]);
                    let w = 1n, tak = false;
                    for (let k = 2; k <= n; k++) { w *= B(k); if (w > x) { tak = true; break; } }
                    out.push(tak || w > x ? 'TAK' : 'NIE');
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long n, x;
        cin >> n >> x;
        long long w = 1;
        bool wieksza = false;
        for (long long i = 2; i <= n; i++) {
            if (w > x / i) {
                wieksza = true;
                break;
            }
            w *= i;
        }
        if (w > x) wieksza = true;
        cout << (wieksza ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sil-bezpieczny-iloczyn', krok: 3, level: 'srednie',
            title: 'Bezpieczny iloczyn',
            short: 'Pomnóż n liczb, ale gdy iloczyn przekroczy 10¹⁸ — wypisz ZA DUZO.',
            tags: ['LIMIT / a', 'sprawdzanie przed mnożeniem', 'long long'],
            statement: ['Wczytaj n liczb dodatnich i policz ich iloczyn. Jeśli iloczyn jest większy od 10¹⁸, wypisz ZA DUZO. W przeciwnym razie wypisz iloczyn.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych dodatnich.'],
            output_format: ['Jeden wiersz: iloczyn albo ZA DUZO.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1000000 1000000 1000000', note: 'Dokładnie 10¹⁸ — jeszcze nie za dużo.' }, { input: '3\n1000000000 1000000000 2' }],
            hint: R`10⁹ · 10⁹ · 10⁹ przepełni nawet long long, więc sprawdzaj PRZED każdym mnożeniem: jeśli w > LIMIT / a, to w · a > LIMIT — wypisz ZA DUZO i zakończ program. Granicę zapisz jako long long LIMIT = 1000000000000000000LL;. Liczby są dodatnie, więc iloczyn tylko rośnie — skoro raz przekroczył granicę, to już pod nią nie wróci.`,
            tests: (r) => {
                const out = ['1\n1', '1\n1000000000', '2\n1000000000 1000000000', '2\n1000000000 999999999', '3\n1000000000 1000000000 1', '3\n1000000000 1000000000 2',
                    `1000\n${Array(1000).fill(1).join(' ')}`, `60\n${Array(59).fill(2).join(' ')} 1`, `60\n${Array(60).fill(2).join(' ')}`, '3\n999999999 1000000000 2',
                    `20\n${Array(18).fill(10).join(' ')} 1 1`, `19\n${Array(19).fill(10).join(' ')}`];
                for (let k = 0; k < 6; k++) {
                    const v = [];
                    let p = 1n;
                    const limit = r() < 0.5 ? E18 : E18 * 1000n;
                    while (v.length < 1000) {
                        const a = r.pick([1, 2, 3, r.int(1, 100), r.int(1, 1000000000)]);
                        if (p * B(a) > limit) break;
                        p *= B(a);
                        v.push(a);
                    }
                    out.push(`${v.length}\n${r.shuffle(v).join(' ')}`);
                }
                return out;
            },
            check: (inp) => { const v = lista(inp).map(Number); return v.length === Number(toks(inp)[0]) && v.length >= 1 && v.every((x) => x >= 1 && x <= 1e9) ? null : 'zakres'; },
            solve: (inp) => { let p = 1n; for (const x of lista(inp)) p *= B(x); return p > E18 ? 'ZA DUZO' : String(p); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long LIMIT = 1000000000000000000LL;
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 0; i < n; i++) {
        long long a;
        cin >> a;
        if (w > LIMIT / a) {
            cout << "ZA DUZO\n";
            return 0;
        }
        w *= a;
    }
    cout << w << "\n";
    return 0;
}`,
        },
    ];
};
