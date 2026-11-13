// Zbiór — baza zadań na koniec lekcji: od rozgrzewki (lotto, słowa użyte raz, kawałki napisu, różne cyfry,
// Collatz, reszty z potęg, płot, szyfr, sudoku), przez zadania średnie (wspólni znajomi, Recamán, odważniki,
// izba przyjęć, fragment podzielny przez k, rezerwacje, ciągi kolejnych liczb, pierwsza unikalna litera,
// k-ta dozwolona liczba), po trudne (mex na żywo, aleja, łączenie odcinków, pokoje, sala egzaminacyjna,
// bliskie wartości, najdłuższy rosnący podciąg) i wielki finał: giełda.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./zbior-pomoc');
    const { Zbior, cmp, cmpPar, rozne, unikalne, generuj, losGen, dobryGen, KOD_GEN } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const losy = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const calk = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;
    const GEN_OPIS_B = 'Liczby powstają z generatora: x₁ = s, a każda następna to xᵢ = (xᵢ₋₁ · a + b) mod m.';
    const KOD_GEN_B = KOD_GEN;
    // Sala egzaminacyjna: krzesło, na którym usiądzie nowy uczeń (zaj — Zbior zajętych), albo -1, gdy wszystkie są zajęte.
    const siada = (n, zaj) => {
        const a = zaj.a;
        if (!a.length) return 0;
        let naj = -1, odl = 0;
        if (a[0] > 0) { naj = 0; odl = a[0]; }
        for (let i = 1; i < a.length; i++) { const d = a[i] - a[i - 1]; if (d >= 2 && Math.floor(d / 2) > odl) { naj = Math.floor((a[i - 1] + a[i]) / 2); odl = Math.floor(d / 2); } }
        if (a[a.length - 1] < n - 1 && n - 1 - a[a.length - 1] > odl) naj = n - 1;
        return naj;
    };

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'zb-b-lotto', krok: 9, level: 'latwe',
            title: 'Lotto',
            short: 'Wylosowano 6 liczb. Ile trafień ma każdy kupon? Zbiór wylosowanych i count.',
            tags: ['count', 'część wspólna', 'kilka kuponów'],
            statement: ['W losowaniu Lotto padło 6 różnych liczb od 1 do 49. Gracze wypełnili t kuponów — na każdym jest 6 różnych liczb od 1 do 49. Dla każdego kuponu wypisz, ile liczb z kuponu zostało wylosowanych.'],
            input_format: ['W pierwszym wierszu 6 wylosowanych liczb.', 'W drugim wierszu liczba kuponów t.', 'W każdym z następnych t wierszy 6 liczb z kuponu.'],
            output_format: ['t wierszy — liczba trafień na każdym kuponie.'],
            constraints: ['1 ≤ t ≤ 2000', 'Wszystkie liczby od 1 do 49; liczby w jednym wierszu są różne.'],
            examples: [{ input: '1 7 12 23 34 45\n3\n1 2 3 4 5 6\n7 12 23 34 45 1\n8 9 10 11 13 14', note: 'Pierwszy kupon trafił tylko jedynkę, drugi — wszystkie sześć liczb (kolejność nie ma znaczenia), trzeci — nic.' }],
            hint: R`Wylosowane liczby wstaw do zbioru. Dla każdego kuponu wczytaj 6 liczb i dodawaj count każdej z nich — to liczba trafień.`,
            tests: (r) => { const kupon = () => r.shuffle(Array.from({ length: 49 }, (_, i) => i + 1)).slice(0, 6); const t = (n) => `${kupon().join(' ')}\n${n}\n${Array.from({ length: n }, () => kupon().join(' ')).join('\n')}`; return ['1 2 3 4 5 6\n1\n1 2 3 4 5 6', '1 2 3 4 5 6\n1\n44 45 46 47 48 49', t(10), t(500), t(2000), t(2000)]; },
            check: (inp) => { const t = nums(inp); if (t.length < 7) return 'długość'; const n = t[6]; if (!calk(n, 1, 2000) || t.length !== 7 + 6 * n) return 't'; const wiersze = [t.slice(0, 6), ...Array.from({ length: n }, (_, i) => t.slice(7 + 6 * i, 13 + 6 * i))]; return wiersze.every((w) => w.every((x) => calk(x, 1, 49)) && new Set(w).size === 6) ? null : 'wiersz'; },
            solve: (inp) => { const t = nums(inp); const los = new Set(t.slice(0, 6)); return Array.from({ length: t[6] }, (_, i) => String(t.slice(7 + 6 * i, 13 + 6 * i).filter((x) => los.has(x)).length)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    set<int> wylosowane;
    for (int i = 0; i < 6; i++) {
        int x;
        cin >> x;
        wylosowane.insert(x);
    }
    int t;
    cin >> t;
    while (t--) {
        int trafienia = 0;
        for (int i = 0; i < 6; i++) {
            int x;
            cin >> x;
            trafienia += wylosowane.count(x);
        }
        cout << trafienia << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-tylko-raz', krok: 9, level: 'latwe',
            title: 'Słowa użyte tylko raz',
            short: 'Które słowa pojawiły się w tekście dokładnie raz? Dwa zbiory: „raz” i „więcej”.',
            tags: ['dwa zbiory', 'erase', 'set<string>'],
            statement: ['Dostajesz tekst — n słów. Wypisz alfabetycznie słowa, które wystąpiły w tekście dokładnie raz, każde w osobnym wierszu. Jeśli takich słów nie ma, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter a–z.'],
            output_format: ['Słowa użyte raz, alfabetycznie, każde w osobnym wierszu — albo BRAK.'],
            constraints: ['1 ≤ n ≤ 2000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '7\nkot pies kot mysz ryba pies kot', note: 'Kot i pies się powtarzają. Raz wystąpiły tylko mysz i ryba.' }],
            hint: R`Trzymaj dwa zbiory: raz — słowa widziane dokładnie raz, i wiecej — widziane co najmniej dwa razy. Dla każdego słowa: jeśli jest w wiecej — nic; jeśli jest w raz — usuń je z raz i wstaw do wiecej; w przeciwnym razie wstaw do raz. Na końcu wypisz zbiór raz (albo BRAK, gdy jest pusty).`,
            tests: (r) => { const t = (n, pula) => { const p = unikalne(r, pula, () => r.word(r.int(1, 10))); return `${n}\n${Array.from({ length: n }, () => r.pick(p)).join(' ')}`; }; return ['1\nkot', '2\nkot kot', '3\nb a b', t(20, 10), t(500, 400), t(2000, 2000), t(2000, 1500), t(2000, 50)]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z]{1,10}$/.test(w)) ? null : 'słowo'; },
            solve: (inp) => { const ile = new Map(); toks(inp).slice(1).forEach((w) => ile.set(w, (ile.get(w) || 0) + 1)); const w = rozne([...ile].filter(([, c]) => c === 1).map(([s]) => s)); return w.length ? w.join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<string> raz, wiecej;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        if (wiecej.count(w)) continue;
        if (raz.count(w)) {
            raz.erase(w);
            wiecej.insert(w);
        } else raz.insert(w);
    }
    if (raz.empty()) cout << "BRAK\n";
    for (string w : raz) cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-kawalki', krok: 9, level: 'latwe',
            title: 'Różne kawałki napisu',
            short: 'Ile różnych kawałków długości k ma napis? substr i set<string>.',
            tags: ['substr', 'set<string>', 'size()'],
            statement: ['Kawałek napisu to kilka kolejnych liter bez przerw. Dostajesz napis s i liczbę k. Ile różnych kawałków o długości dokładnie k zawiera s?'],
            input_format: ['W pierwszym wierszu napis s z małych liter.', 'W drugim wierszu liczba k.'],
            output_format: ['Jedna liczba — liczba różnych kawałków długości k.'],
            constraints: ['1 ≤ długość s ≤ 2000', '1 ≤ k ≤ min(20, długość s)'],
            examples: [{ input: 'abababa\n3', note: 'Kawałki długości 3: aba, bab, aba, bab, aba — różne są tylko dwa.' }],
            hint: R`Kawałek długości k zaczynający się na pozycji i to s.substr(i, k) (lekcja String). Pozycje i idą od 0 do s.size() - k. Wstaw wszystkie kawałki do set<string> i wypisz rozmiar.`,
            tests: (r) => ['a\n1', 'aaaa\n2', 'abcd\n4', `${r.word(30, 'ab')}\n3`, `${r.word(500, 'abc')}\n5`, `${r.word(2000)}\n1`, `${r.word(2000)}\n20`, `${r.word(2000, 'ab')}\n10`, `${'ab'.repeat(1000)}\n7`],
            check: (inp) => { const [s, k] = toks(inp); if (!/^[a-z]{1,2000}$/.test(s)) return 's'; return calk(Number(k), 1, Math.min(20, s.length)) && toks(inp).length === 2 ? null : 'k'; },
            solve: (inp) => { const [s, k] = toks(inp); const kk = Number(k); const z = new Set(); for (let i = 0; i + kk <= s.length; i++) z.add(s.substr(i, kk)); return String(z.size); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    set<string> kawalki;
    for (int i = 0; i + k <= (int)s.size(); i++) kawalki.insert(s.substr(i, k));
    cout << kawalki.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-rozne-cyfry', krok: 9, level: 'latwe',
            title: 'Liczby o różnych cyfrach',
            short: 'Ile liczb z przedziału [a, b] ma same różne cyfry? Zbiór cyfr ma tyle elementów, ile liczba ma cyfr.',
            tags: ['set<char>', 'to_string', 'size() == długość'],
            statement: ['Liczba ma różne cyfry, jeśli żadna cyfra nie występuje w jej zapisie dwa razy — np. 1023 tak, a 1213 nie. Ile liczb z przedziału od a do b (włącznie) ma różne cyfry?'],
            input_format: ['Jeden wiersz z dwiema liczbami a i b.'],
            output_format: ['Jedna liczba — ile liczb ma różne cyfry.'],
            constraints: ['1 ≤ a ≤ b ≤ 10⁹', 'b − a ≤ 100 000'],
            examples: [{ input: '1 20', note: 'Wszystkie liczby od 1 do 20 poza 11 — razem 19.' }],
            hint: R`Dla każdej liczby x zamień ją na napis (to_string(x)) i wstaw jej znaki do set<char>. Cyfry są różne dokładnie wtedy, gdy zbiór ma tyle elementów, ile napis znaków. Pamiętaj o nowym zbiorze dla każdej liczby.`,
            tests: (r) => { const t = (len) => { const a = r.int(1, 1e9 - len); return `${a} ${a + len}`; }; return ['1 1', '11 11', '1 100', '987654300 987654321', t(100), t(100000), t(100000), '999900000 1000000000', '1 100000']; },
            check: (inp) => { const [a, b] = nums(inp); return toks(inp).length === 2 && calk(a, 1, 1e9) && calk(b, a, 1e9) && b - a <= 100000 ? null : 'a, b'; },
            solve: (inp) => { const [a, b] = nums(inp); let w = 0; for (let x = a; x <= b; x++) { const s = String(x); if (new Set(s).size === s.length) w++; } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    int ile = 0;
    for (long long x = a; x <= b; x++) {
        string s = to_string(x);
        set<char> cyfry(s.begin(), s.end());
        if (cyfry.size() == s.size()) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-collatz', krok: 9, level: 'latwe',
            title: 'Spotkanie ciągów Collatza',
            short: 'Dwa ciągi Collatza w końcu się spotykają. Która liczba pierwszego ciągu jako pierwsza pojawia się w drugim?',
            tags: ['zbiór ciągu', 'count', 'long long'],
            statement: ['Ciąg Collatza liczby x: jeśli x jest parzyste, następna liczba to x / 2, a jeśli nieparzyste — 3x + 1. Ciąg kończy się, gdy dojdzie do 1. Na przykład dla 6: 6, 3, 10, 5, 16, 8, 4, 2, 1.',
                'Dla każdej z t par liczb a i b znajdź pierwszą liczbę w ciągu a (licząc od samego a), która występuje też w ciągu b (licząc samo b). Wypisz tę liczbę i jej numer w ciągu a (a ma numer 0).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby a i b.'],
            output_format: ['t wierszy — w każdym wspólna liczba i jej numer w ciągu a.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ a, b ≤ 10⁶'],
            examples: [{ input: '2\n6 7\n5 5', note: 'Ciąg 7: 7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, … W ciągu 6 pierwsza taka liczba to 10 (numer 2). W drugiej parze spotkanie następuje od razu.' }],
            hint: R`Najpierw wygeneruj cały ciąg b i wstaw jego liczby do zbioru. Potem idź ciągiem a od początku i zatrzymaj się na pierwszej liczbie, którą zbiór zna — na pewno taka jest, bo oba ciągi kończą się jedynką. Uwaga: wyrazy ciągu potrafią przekroczyć zakres int (dla liczb poniżej miliona sięgają ok. 5,7 · 10¹⁰) — long long.`,
            tests: (r) => { const t = (n, hi) => `${n}\n${Array.from({ length: n }, () => `${r.int(1, hi)} ${r.int(1, hi)}`).join('\n')}`; return ['1\n1 1', '1\n1 27', '1\n27 1', '3\n2 4\n4 2\n3 3', t(10, 50), t(100, 1e6), '2\n837799 704623\n77031 113383', t(100, 1000)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 100) || t.length !== 1 + 2 * n) return 't'; return t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const out = []; for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; const s = new Set(); for (let x = b; ; x = x % 2 ? 3 * x + 1 : x / 2) { s.add(x); if (x === 1) break; } let x = a, k = 0; while (!s.has(x)) { x = x % 2 ? 3 * x + 1 : x / 2; k++; } out.push(`${x} ${k}`); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        set<long long> ciagB;
        long long x = b;
        while (true) {
            ciagB.insert(x);
            if (x == 1) break;
            if (x % 2 == 0) x /= 2;
            else x = 3 * x + 1;
        }
        long long y = a;
        int numer = 0;
        while (!ciagB.count(y)) {
            if (y % 2 == 0) y /= 2;
            else y = 3 * y + 1;
            numer++;
        }
        cout << y << " " << numer << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-reszty-poteg', krok: 9, level: 'latwe',
            title: 'Reszty z potęg',
            short: 'a¹, a², a³, … modulo m w końcu się zapętlają. Ile różnych reszt się pojawi?',
            tags: ['zbiór reszt', 'wykrywanie pętli', 'long long'],
            statement: ['Dla liczb a i m rozważ reszty z dzielenia przez m kolejnych potęg: a¹ mod m, a² mod m, a³ mod m, … Ten ciąg w końcu zaczyna się powtarzać. Ile różnych reszt w nim występuje?'],
            input_format: ['Jeden wiersz z dwiema liczbami a i m.'],
            output_format: ['Jedna liczba — liczba różnych reszt.'],
            constraints: ['1 ≤ a ≤ 10⁹', '1 ≤ m ≤ 200 000'],
            examples: [{ input: '2 10', note: 'Reszty: 2, 4, 8, 6, 2, 4, … — różne są cztery.' }, { input: '3 7', note: 'Reszty: 3, 2, 6, 4, 5, 1, 3, … — sześć różnych.' }],
            hint: R`Licz kolejne reszty: r = a mod m, a każda następna to (r · a) mod m. Zatrzymaj się, gdy reszta się powtórzy — zbiór powie, czy już była. Iloczyn r · a może sięgać 2 · 10⁵ · 10⁹ — licz w long long albo najpierw zmniejsz a do a mod m.`,
            tests: () => ['1 1', '5 1', '1 7', '2 10', '10 1000', '1000000000 199999', '3 200000', '7 199999', '123456789 196608', '2 131072'],
            check: (inp) => { const [a, m] = nums(inp); return toks(inp).length === 2 && calk(a, 1, 1e9) && calk(m, 1, 200000) ? null : 'a, m'; },
            solve: (inp) => { const [a, m] = nums(inp); const s = new Set(); let x = a % m; while (!s.has(x)) { s.add(x); x = (x * (a % m)) % m; } return String(s.size); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, m;
    cin >> a >> m;
    set<long long> reszty;
    long long x = a % m;
    while (!reszty.count(x)) {
        reszty.insert(x);
        x = x * a % m;
    }
    cout << reszty.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-plot', krok: 9, level: 'latwe',
            title: 'Pomalowany płot',
            short: 'Malarze malują kawałki płotu, często te same deski. Ile różnych desek jest pomalowanych?',
            tags: ['insert w pętli', 'size()', 'nakładające się przedziały'],
            statement: ['Płot ma bardzo dużo desek ponumerowanych kolejnymi liczbami. n malarzy maluje każdy jeden kawałek: od deski a do deski b włącznie. Kawałki mogą na siebie zachodzić. Ile różnych desek jest pomalowanych?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby a i b.'],
            output_format: ['Jedna liczba — liczba pomalowanych desek.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ a ≤ b ≤ 10⁹', 'b − a < 200 (każdy malarz maluje najwyżej 200 desek)'],
            examples: [{ input: '3\n1 4\n3 6\n10 10', note: 'Pomalowane deski: 1–6 i 10, razem 7.' }],
            hint: R`Każdy malarz to krótka pętla od a do b — wstaw każdą deskę do zbioru. Deski pomalowane kilka razy zbiór policzy raz. Numery sięgają miliarda, więc tablica się nie nada, a zbiór — tak.`,
            tests: (r) => { const t = (n, hi, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(1, hi); return `${a} ${Math.min(1e9, a + r.int(0, dl))}`; }).join('\n')}`; return ['1\n5 5', '2\n1 3\n1 3', '2\n1 3\n4 6', t(10, 50, 10), t(1000, 1e9, 199), t(1000, 2000, 199), t(1000, 100, 199), `2\n999999801 1000000000\n1 199`]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 1000) || t.length !== 1 + 2 * n) return 'n'; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 1, 1e9) || !calk(b, a, 1e9) || b - a >= 200) return 'przedział'; } return null; },
            solve: (inp) => { const t = nums(inp); const s = new Set(); for (let i = 0; i < t[0]; i++) for (let x = t[1 + 2 * i]; x <= t[2 + 2 * i]; x++) s.add(x); return String(s.size); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> deski;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        for (int x = a; x <= b; x++) deski.insert(x);
    }
    cout << deski.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-najwiecej-liter', krok: 9, level: 'latwe',
            title: 'Najbardziej różnorodne słowo',
            short: 'Które słowo ma najwięcej różnych liter? Przy remisie — pierwsze z listy.',
            tags: ['set<char>', 'maksimum', 'remis: pierwsze'],
            statement: ['Dostajesz n słów. Wypisz słowo, które ma najwięcej różnych liter, i tę liczbę liter. Jeśli kilka słów ma tyle samo różnych liter, wypisz to, które jest najwcześniej na liście.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy jedno słowo z małych liter a–z.'],
            output_format: ['Słowo i liczba jego różnych liter, oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 2000', 'Każde słowo ma od 1 do 50 liter.'],
            examples: [{ input: '4\nmama\nkot\nabrakadabra\nzebra', note: 'abrakadabra ma 5 różnych liter (a, b, r, k, d), zebra też 5 — wygrywa wcześniejsza abrakadabra.' }],
            hint: R`Dla każdego słowa zbuduj zbiór jego liter: set<char> l(w.begin(), w.end()). Porównuj l.size() z najlepszym wynikiem i zmieniaj odpowiedź tylko przy ściśle większej liczbie — wtedy przy remisie zostanie pierwsze słowo.`,
            tests: (r) => { const t = (n, len, alf) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(1, len), alf)).join('\n')}`; return ['1\na', '3\naa\nbb\ncc', '3\nab\nabc\nabd', t(20, 10, 'abcdef'), t(2000, 50, 'abcdefghijklmnopqrstuvwxyz'), t(2000, 50, 'abcdefgh'), t(2000, 5, 'xyz')]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z]{1,50}$/.test(w)) ? null : 'słowo'; },
            solve: (inp) => { let best = '', ile = 0; toks(inp).slice(1).forEach((w) => { const k = new Set(w).size; if (k > ile) { ile = k; best = w; } }); return `${best} ${ile}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string najlepsze = "";
    int najwiecej = 0;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        set<char> litery(w.begin(), w.end());
        if ((int)litery.size() > najwiecej) {
            najwiecej = litery.size();
            najlepsze = w;
        }
    }
    cout << najlepsze << " " << najwiecej << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-szyfr', krok: 9, level: 'latwe',
            title: 'Szyfr z kluczem',
            short: 'Alfabet szyfru: litery klucza bez powtórzeń, potem reszta alfabetu. Zaszyfruj wiadomość.',
            tags: ['zbiór „już użyte”', 'kolejność z wejścia', 'getline'],
            statement: ['Szyfr z kluczem działa tak. Z klucza (słowa) budujemy alfabet szyfru: najpierw litery klucza w kolejności, w jakiej występują, ale każdą tylko przy jej pierwszym wystąpieniu, a potem pozostałe litery od a do z, których w kluczu nie było. Na przykład dla klucza „zebra” alfabet szyfru to zebracdfghijklmnopqstuvwxy.',
                'Szyfrowanie zamienia każdą literę wiadomości na literę alfabetu szyfru stojącą na tym samym miejscu: a na pierwszą literę alfabetu szyfru, b na drugą itd. Spacje zostają spacjami. Wypisz alfabet szyfru i zaszyfrowaną wiadomość.'],
            input_format: ['W pierwszym wierszu klucz (małe litery a–z).', 'W drugim wierszu wiadomość (małe litery a–z i pojedyncze spacje między słowami).'],
            output_format: ['W pierwszym wierszu alfabet szyfru (26 liter).', 'W drugim wierszu zaszyfrowana wiadomość.'],
            constraints: ['Klucz ma od 1 do 100 liter.', 'Wiadomość ma od 1 do 10 000 znaków.'],
            examples: [{ input: 'zebra\nala ma kota', note: 'a zamienia się na z (pierwsza litera alfabetu szyfru), l na j (dwunasta), m na k, k na i, o na m, t na s.' }],
            hint: R`Zbiór „użyte” pilnuje, które litery są już w alfabecie szyfru. Przejdź klucz: każdą literę, której jeszcze nie ma w zbiorze, dopisz do alfabetu i wstaw do zbioru. Potem pętla od 'a' do 'z' dopisuje litery, których zbiór nie zna. Wiadomość wczytaj przez getline (po cin >> klucz najpierw zjedz koniec wiersza: cin.ignore() albo getline dwa razy). Litera c zamienia się na alfabet[c - 'a'].`,
            tests: (r) => { const wiad = (n) => { const w = []; let dl = 0; while (dl < n) { const s = r.word(r.int(1, 8)); w.push(s); dl += s.length + 1; } return w.join(' ').slice(0, n).replace(/ +$/, '') || 'a'; }; return ['a\na', 'abcdefghijklmnopqrstuvwxyz\nhello world', 'zyx\nabc xyz', 'zebra\nzebra', `${r.word(10)}\n${wiad(100)}`, `${r.word(100)}\n${wiad(10000)}`, `${r.word(100, 'qwerty')}\n${wiad(5000)}`]; },
            check: (inp) => { const l = inp.replace(/\r/g, '').split('\n'); if (l.length !== 2) return 'dwa wiersze'; if (!/^[a-z]{1,100}$/.test(l[0])) return 'klucz'; return /^[a-z]+( [a-z]+)*$/.test(l[1]) && l[1].length <= 10000 ? null : 'wiadomość'; },
            solve: (inp) => { const [k, w] = inp.replace(/\r/g, '').split('\n'); const uz = new Set(); let alf = ''; for (const c of k + 'abcdefghijklmnopqrstuvwxyz') if (!uz.has(c)) { uz.add(c); alf += c; } return `${alf}\n${[...w].map((c) => (c === ' ' ? ' ' : alf[c.charCodeAt(0) - 97])).join('')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string klucz, wiadomosc;
    cin >> klucz;
    cin.ignore();
    getline(cin, wiadomosc);
    set<char> uzyte;
    string alfabet = "";
    for (char c : klucz)
        if (!uzyte.count(c)) {
            uzyte.insert(c);
            alfabet += c;
        }
    for (char c = 'a'; c <= 'z'; c++)
        if (!uzyte.count(c)) {
            uzyte.insert(c);
            alfabet += c;
        }
    for (char &c : wiadomosc)
        if (c != ' ') c = alfabet[c - 'a'];
    cout << alfabet << "\n" << wiadomosc << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-sudoku', krok: 9, level: 'latwe',
            title: 'Poprawne sudoku?',
            short: 'Każdy wiersz, kolumna i kwadrat 3 × 3 muszą mieć 9 różnych cyfr. Zbiór o rozmiarze 9.',
            tags: ['zbiór 9 cyfr', 'clear()', 'kwadraty 3 × 3'],
            statement: ['Rozwiązane sudoku to plansza 9 × 9 wypełniona cyframi od 1 do 9 tak, że w każdym wierszu, w każdej kolumnie i w każdym z dziewięciu kwadratów 3 × 3 każda cyfra występuje dokładnie raz.',
                'Dla każdej z t plansz wypisz TAK, jeśli jest poprawnie rozwiązanym sudoku, albo NIE.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każda plansza to 9 wierszy po 9 cyfr oddzielonych spacjami.'],
            output_format: ['t wierszy — TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 30', 'Każda liczba na planszy to cyfra od 1 do 9.'],
            examples: [{ input: '1\n5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9', note: 'To poprawnie rozwiązane sudoku.' }],
            hint: R`Plansza ma tylko cyfry od 1 do 9, więc wiersz jest dobry dokładnie wtedy, gdy zbiór jego cyfr ma 9 elementów. Sprawdź tak 9 wierszy, 9 kolumn i 9 kwadratów (kwadrat o lewym górnym rogu (3a, 3b) to pola (3a + i, 3b + j) dla i, j od 0 do 2). Przed każdym sprawdzeniem wyczyść zbiór.`,
            tests: (r) => {
                const plansza = (dobra) => {
                    const cyf = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    const pasy = r.shuffle([0, 1, 2]), kol = r.shuffle([0, 1, 2]);
                    const wier = pasy.flatMap((p) => r.shuffle([0, 1, 2]).map((w) => p * 3 + w));
                    const kolumny = kol.flatMap((p) => r.shuffle([0, 1, 2]).map((w) => p * 3 + w));
                    const g = wier.map((w) => kolumny.map((c) => cyf[(w * 3 + Math.floor(w / 3) + c) % 9]));
                    if (!dobra) { const typ = r.int(0, 2); const a = r.int(0, 8), b = r.int(0, 8); if (typ === 0) { let c = r.int(0, 8); while (c === b) c = r.int(0, 8); [g[a][b], g[a][c]] = [g[a][c], g[a][b]]; } else if (typ === 1) { g[a][b] = g[a][b] % 9 + 1; } else { const c = (b + 3) % 9; [g[a][b], g[a][c]] = [g[a][c], g[a][b]]; } }
                    return g.map((w) => w.join(' ')).join('\n');
                };
                const t = (n) => `${n}\n${Array.from({ length: n }, () => plansza(r() < 0.5)).join('\n')}`;
                const zlyKwadrat = () => `1\n${Array.from({ length: 9 }, (_, w) => Array.from({ length: 9 }, (_, c) => (w + c) % 9 + 1).join(' ')).join('\n')}`;
                return [zlyKwadrat(), `1\n${plansza(true)}`, `1\n${plansza(false)}`, t(10), t(30), t(30)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 30) || t.length !== 1 + 81 * n) return 't'; return t.slice(1).every((x) => calk(x, 1, 9)) ? null : 'cyfra'; },
            solve: (inp) => {
                const t = nums(inp); const out = [];
                for (let k = 0; k < t[0]; k++) {
                    const g = Array.from({ length: 9 }, (_, w) => t.slice(1 + 81 * k + 9 * w, 1 + 81 * k + 9 * w + 9));
                    let ok = true;
                    for (let i = 0; i < 9; i++) {
                        if (new Set(g[i]).size !== 9) ok = false;
                        if (new Set(g.map((w) => w[i])).size !== 9) ok = false;
                        const a = Math.floor(i / 3) * 3, b = (i % 3) * 3; const kw = []; for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) kw.push(g[a + x][b + y]);
                        if (new Set(kw).size !== 9) ok = false;
                    }
                    out.push(ok ? 'TAK' : 'NIE');
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        vector<vector<int>> g(9, vector<int>(9));
        for (int i = 0; i < 9; i++)
            for (int j = 0; j < 9; j++) cin >> g[i][j];
        bool ok = true;
        set<int> s;
        for (int i = 0; i < 9; i++) {
            s.clear();
            for (int j = 0; j < 9; j++) s.insert(g[i][j]);
            if (s.size() != 9) ok = false;
            s.clear();
            for (int j = 0; j < 9; j++) s.insert(g[j][i]);
            if (s.size() != 9) ok = false;
            s.clear();
            int a = i / 3 * 3, b = i % 3 * 3;
            for (int x = 0; x < 3; x++)
                for (int y = 0; y < 3; y++) s.insert(g[a + x][b + y]);
            if (s.size() != 9) ok = false;
        }
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'zb-b-wspolni-znajomi', krok: 9, level: 'srednie',
            title: 'Wspólni znajomi',
            short: 'Każdy uczeń ma swój zbiór znajomych — vector zbiorów. Ilu wspólnych znajomych mają x i y?',
            tags: ['vector<set<int>>', 'część wspólna', 'pytania'],
            statement: ['W szkole jest n uczniów o numerach od 1 do n i m znajomości (każda działa w obie strony; ta sama znajomość mogła zostać zapisana kilka razy). Dla każdego z q pytań x y wypisz, ilu wspólnych znajomych mają uczniowie x i y.'],
            input_format: ['W pierwszym wierszu liczby n, m i q.', 'W każdym z następnych m wierszy znajomość: dwa różne numery uczniów.', 'W każdym z następnych q wierszy pytanie: dwa różne numery x i y.'],
            output_format: ['q wierszy — liczba wspólnych znajomych.'],
            constraints: ['2 ≤ n ≤ 1000', '1 ≤ m ≤ 10 000', '1 ≤ q ≤ 1000'],
            examples: [{ input: '5 6 3\n1 2\n1 3\n2 3\n3 4\n2 4\n4 5\n1 4\n2 3\n1 5', note: 'Znajomi: 1 — {2, 3}, 2 — {1, 3, 4}, 3 — {1, 2, 4}, 4 — {2, 3, 5}, 5 — {4}. Uczniowie 1 i 4 mają wspólnych znajomych 2 i 3.' }],
            hint: R`Utwórz vector<set<int>> znajomi(n + 1) — osobny zbiór dla każdego ucznia. Znajomość a b to znajomi[a].insert(b) i znajomi[b].insert(a) (powtórki odpadną same). Dla pytania przejdź zbiór znajomych x i policz tych, których ma też y: znajomi[y].count(z).`,
            tests: (r) => {
                const t = (n, m, q) => { const kr = Array.from({ length: m }, () => { const a = r.int(1, n); let b = r.int(1, n - 1); if (b >= a) b++; return `${a} ${b}`; }); const py = Array.from({ length: q }, () => { const a = r.int(1, n); let b = r.int(1, n - 1); if (b >= a) b++; return `${a} ${b}`; }); return `${n} ${m} ${q}\n${kr.join('\n')}\n${py.join('\n')}`; };
                return ['2 1 1\n1 2\n1 2', '3 2 1\n1 3\n2 3\n1 2', '4 4 2\n1 2\n2 1\n1 3\n3 2\n1 2\n3 4', t(10, 20, 10), t(100, 1000, 300), t(1000, 10000, 1000), t(30, 10000, 1000), t(1000, 50, 1000)];
            },
            check: (inp) => { const t = nums(inp); const [n, m, q] = t; if (!calk(n, 2, 1000) || !calk(m, 1, 10000) || !calk(q, 1, 1000) || t.length !== 3 + 2 * (m + q)) return 'n, m, q'; for (let i = 0; i < m + q; i++) { const a = t[3 + 2 * i], b = t[4 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return 'para'; } return null; },
            solve: (inp) => { const t = nums(inp); const [n, m, q] = t; const z = Array.from({ length: n + 1 }, () => new Set()); for (let i = 0; i < m; i++) { const a = t[3 + 2 * i], b = t[4 + 2 * i]; z[a].add(b); z[b].add(a); } const out = []; for (let i = 0; i < q; i++) { const x = t[3 + 2 * (m + i)], y = t[4 + 2 * (m + i)]; let w = 0; for (const v of z[x]) if (z[y].has(v)) w++; out.push(String(w)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, q;
    cin >> n >> m >> q;
    vector<set<int>> znajomi(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        znajomi[a].insert(b);
        znajomi[b].insert(a);
    }
    while (q--) {
        int x, y;
        cin >> x >> y;
        int wspolni = 0;
        for (int z : znajomi[x])
            if (znajomi[y].count(z)) wspolni++;
        cout << wspolni << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-recaman', krok: 9, level: 'srednie',
            title: 'Ciąg Recamána',
            short: 'Cofnij się o k, jeśli wolno i jeszcze tam nie byłeś — inaczej idź o k do przodu. Zbiór odwiedzonych.',
            tags: ['zbiór wartości ciągu', 'count', 'symulacja'],
            statement: ['Ciąg Recamána zaczyna się od a₀ = 0. Dla k = 1, 2, 3, … wyraz aₖ to aₖ₋₁ − k, jeśli ta liczba jest dodatnia i nie wystąpiła jeszcze w ciągu; w przeciwnym razie aₖ = aₖ₋₁ + k. Początek ciągu: 0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, …',
                'Dla danego n wypisz aₙ oraz liczbę różnych wartości wśród a₀, a₁, …, aₙ.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Dwie liczby: aₙ i liczba różnych wartości wśród a₀…aₙ.'],
            constraints: ['0 ≤ n ≤ 100 000'],
            examples: [{ input: '10', note: 'a₁₀ = 11, a wszystkie 11 wyrazów od a₀ do a₁₀ są różne.' }, { input: '24', note: 'a₂₄ = 42, ale 42 pojawiło się już jako a₂₀ — dlatego różnych wartości jest 24, a nie 25.' }],
            hint: R`Trzymaj zbiór wartości, które już wystąpiły (na start {0}). W kroku k policz kandydata a − k; jeśli jest > 0 i zbiór go nie zna (count == 0), to nowy wyraz, w przeciwnym razie nowy wyraz to a + k. Wstaw nowy wyraz do zbioru — gdy już był, zbiór się nie zmieni, więc na końcu size() to liczba różnych wartości.`,
            tests: () => ['0', '1', '10', '24', '100', '1000', '54321', '99999', '100000'],
            check: (inp) => (toks(inp).length === 1 && calk(Number(inp.trim()), 0, 100000) ? null : 'n'),
            solve: (inp) => { const n = Number(inp.trim()); const s = new Set([0]); let a = 0; for (let k = 1; k <= n; k++) { a = a - k > 0 && !s.has(a - k) ? a - k : a + k; s.add(a); } return `${a} ${s.size}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<long long> byly = {0};
    long long a = 0;
    for (int k = 1; k <= n; k++) {
        if (a - k > 0 && !byly.count(a - k)) a = a - k;
        else a = a + k;
        byly.insert(a);
    }
    cout << a << " " << byly.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-odwazniki', krok: 9, level: 'srednie',
            title: 'Odważniki',
            short: 'Jakie masy zważysz kompletem odważników na jednej szalce? Zbiór sum, który rośnie z każdym odważnikiem.',
            tags: ['zbiór sum', 'kopia zbioru', 'pierwsza brakująca'],
            statement: ['Masz n odważników o podanych masach. Kładziesz na szalce dowolny niepusty zestaw odważników — zważysz wtedy przedmiot o masie równej ich sumie. Ile różnych mas możesz zważyć? Wypisz też najmniejszą dodatnią masę całkowitą, której zważyć się nie da.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n mas odważników.'],
            output_format: ['Dwie liczby: liczba różnych mas i najmniejsza masa, której nie da się zważyć.'],
            constraints: ['1 ≤ n ≤ 15', '1 ≤ masa ≤ 10⁶'],
            examples: [{ input: '3\n1 2 4', note: 'Da się zważyć każdą masę od 1 do 7 — siedem mas. Najmniejsza niemożliwa to 8.' }, { input: '3\n1 1 3', note: 'Sumy: 1, 2, 3, 4, 5 — pięć mas, najmniejsza niemożliwa to 6.' }],
            hint: R`Zacznij od zbioru sum {0} (pusta szalka). Dla każdego odważnika w: zrób kopię zbioru i dla każdej sumy s ze starego zbioru wstaw do kopii s + w; kopia staje się nowym zbiorem. Na końcu usuń 0. Najmniejszą niemożliwą masę znajdziesz, przechodząc zbiór rosnąco: zacznij od 1 i zwiększaj, dopóki kolejny element jest równy szukanej liczbie.`,
            tests: (r) => { const t = (n, hi) => `${n}\n${losy(r, n, 1, hi).join(' ')}`; return ['1\n1', '1\n5', '2\n3 3', '4\n1 2 4 8', t(5, 10), t(10, 100), t(15, 1e6), t(15, 3), `15\n${Array.from({ length: 15 }, (_, i) => 2 ** i).join(' ')}`, t(15, 1000)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 15) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'masa'; },
            solve: (inp) => { const w = nums(inp).slice(1); let s = new Set([0]); for (const x of w) { const nowe = new Set(s); for (const v of s) nowe.add(v + x); s = nowe; } s.delete(0); let brak = 1; while (s.has(brak)) brak++; return `${s.size} ${brak}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> sumy = {0};
    for (int i = 0; i < n; i++) {
        int w;
        cin >> w;
        set<int> nowe = sumy;
        for (int s : sumy) nowe.insert(s + w);
        sumy = nowe;
    }
    sumy.erase(0);
    int brak = 1;
    for (int s : sumy) {
        if (s == brak) brak++;
        else if (s > brak) break;
    }
    cout << sumy.size() << " " << brak << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-dwie-szalki', krok: 9, level: 'srednie',
            title: 'Odważniki na dwóch szalkach',
            short: 'Odważnik może leżeć przy przedmiocie, na drugiej szalce albo zostać w pudełku. Ile mas zważysz?',
            tags: ['zbiór różnic', 'trzy możliwości', 'liczby ujemne'],
            statement: ['Masz n odważników i wagę szalkową. Przedmiot kładziesz na lewej szalce. Każdy odważnik możesz położyć na lewej szalce (obok przedmiotu), na prawej szalce albo nie używać go wcale. Waga jest w równowadze, gdy masa przedmiotu = (suma na prawej) − (suma odważników na lewej).',
                'Ile różnych dodatnich mas przedmiotów możesz w ten sposób zważyć?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n mas odważników.'],
            output_format: ['Jedna liczba — liczba różnych dodatnich mas.'],
            constraints: ['1 ≤ n ≤ 10', '1 ≤ masa ≤ 100 000'],
            examples: [{ input: '2\n1 3', note: 'Masy: 1 (1 po prawej), 2 (3 po prawej, 1 przy przedmiocie), 3 i 4 (oba po prawej). Razem cztery.' }],
            hint: R`Zbiór możliwych różnic „prawa − lewa” zacznij od {0}. Dla każdego odważnika w nowy zbiór zawiera, dla każdej starej różnicy d: d (odważnik w pudełku), d + w (na prawej) i d − w (na lewej). Na końcu policz różnice większe od zera — np. przechodząc zbiór od upper_bound(0).`,
            tests: (r) => { const t = (n, hi) => `${n}\n${losy(r, n, 1, hi).join(' ')}`; return ['1\n7', '2\n5 5', '3\n1 3 9', '4\n1 3 9 27', t(5, 20), t(10, 100), t(10, 100000), t(10, 5)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 100000)) ? null : 'masa'; },
            solve: (inp) => { const w = nums(inp).slice(1); let s = new Set([0]); for (const x of w) { const nowe = new Set(); for (const d of s) { nowe.add(d); nowe.add(d + x); nowe.add(d - x); } s = nowe; } return String([...s].filter((d) => d > 0).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> roznice = {0};
    for (int i = 0; i < n; i++) {
        int w;
        cin >> w;
        set<int> nowe;
        for (int d : roznice) {
            nowe.insert(d);
            nowe.insert(d + w);
            nowe.insert(d - w);
        }
        roznice = nowe;
    }
    int ile = 0;
    for (auto it = roznice.upper_bound(0); it != roznice.end(); it++) ile++;
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-izba-przyjec', krok: 9, level: 'srednie',
            title: 'Izba przyjęć',
            short: 'Najpierw najpilniejsi, przy remisie — kto pierwszy przyszedł. Zbiór par (−priorytet, numer przyjścia).',
            tags: ['set<pair>', 'sztuczka z minusem', 'kolejka priorytetowa'],
            statement: ['Na izbę przyjęć przychodzą pacjenci. Każdy dostaje priorytet (im większy, tym pilniej trzeba go przyjąć). Wykonaj q zdarzeń:',
                'PRZYCHODZI imie p — pacjent o podanym imieniu i priorytecie p dołącza do kolejki,',
                'LEKARZ — lekarz przyjmuje pacjenta z najwyższym priorytetem, a spośród takich — tego, który przyszedł najwcześniej. Wypisz jego imię albo PUSTO, jeśli nikt nie czeka.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy zdarzenie.'],
            output_format: ['Odpowiedzi na zdarzenia LEKARZ, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ p ≤ 10', 'Imię to od 1 do 8 małych liter (imiona mogą się powtarzać).', 'Jest co najmniej jedno zdarzenie LEKARZ.'],
            examples: [{ input: '6\nPRZYCHODZI ola 2\nPRZYCHODZI adam 5\nPRZYCHODZI ewa 5\nLEKARZ\nLEKARZ\nLEKARZ', note: 'Adam i Ewa mają priorytet 5, ale Adam przyszedł wcześniej. Ola z priorytetem 2 czeka najdłużej.' }],
            hint: R`Numeruj pacjentów w kolejności przychodzenia i zapisuj imiona w vectorze. W zbiorze trzymaj pary (-p, numer): zbiór sortuje rosnąco, więc minus stawia najwyższy priorytet na początku, a przy remisie wygrywa mniejszy numer, czyli wcześniejsze przyjście. LEKARZ bierze *s.begin() i usuwa go ze zbioru.`,
            tests: (r) => { const t = (q, pmax) => { const w = []; for (let i = 0; i < q; i++) w.push(r() < 0.6 ? `PRZYCHODZI ${r.word(r.int(1, 8))} ${r.int(1, pmax)}` : 'LEKARZ'); if (!w.includes('LEKARZ')) w[q - 1] = 'LEKARZ'; return `${q}\n${w.join('\n')}`; }; return ['1\nLEKARZ', '3\nPRZYCHODZI a 1\nPRZYCHODZI a 1\nLEKARZ', '4\nPRZYCHODZI z 1\nPRZYCHODZI y 10\nLEKARZ\nLEKARZ', t(20, 3), t(500, 10), t(3000, 10), t(3000, 1)]; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 3000)) return 'q'; let i = 1, ile = 0, lek = 0; while (i < t.length) { const p = t[i++]; ile++; if (p === 'PRZYCHODZI') { if (!/^[a-z]{1,8}$/.test(t[i++])) return 'imię'; if (!calk(Number(t[i++]), 1, 10)) return 'p'; } else if (p === 'LEKARZ') lek++; else return 'zdarzenie'; } return ile === q && lek ? null : 'liczba zdarzeń'; },
            solve: (inp) => { const t = toks(inp); const s = new Zbior(cmpPar); const imiona = []; const out = []; let i = 1; while (i < t.length) { const p = t[i++]; if (p === 'PRZYCHODZI') { imiona.push(t[i++]); s.add([-Number(t[i++]), imiona.length - 1]); } else if (!s.size) out.push('PUSTO'); else { const [, nr] = s.a[0]; s.a.splice(0, 1); out.push(imiona[nr]); } } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<string> imiona;
    set<pair<int, int>> kolejka;     // (-priorytet, numer przyjścia)
    while (q--) {
        string zd;
        cin >> zd;
        if (zd == "PRZYCHODZI") {
            string imie;
            int p;
            cin >> imie >> p;
            imiona.push_back(imie);
            kolejka.insert({-p, (int)imiona.size() - 1});
        } else if (kolejka.empty()) {
            cout << "PUSTO\n";
        } else {
            int nr = kolejka.begin()->second;
            kolejka.erase(kolejka.begin());
            cout << imiona[nr] << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-podzielny-fragment', krok: 9, level: 'srednie',
            title: 'Fragment podzielny przez k',
            short: 'Pierwszy fragment o sumie podzielnej przez k. Dwie sumy prefiksowe z tą samą resztą.',
            tags: ['sumy prefiksowe', 'zbiór reszt', 'long long'],
            statement: ['Dostajesz n liczb i liczbę k. Szukasz fragmentu (kilku kolejnych liczb, co najmniej jednej), którego suma dzieli się przez k. Spośród wszystkich takich fragmentów wybierz ten, który kończy się najwcześniej, a jeśli kilka kończy się w tym samym miejscu — najkrótszy.',
                'Wypisz numery jego pierwszej i ostatniej liczby (licząc od 1) albo NIE, jeśli takiego fragmentu nie ma.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwie liczby l i r albo NIE.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ k ≤ 10⁹', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5 7\n3 5 1 6 2', note: 'Sumy prefiksowe: 0, 3, 8, 9, 15 — reszty z dzielenia przez 7: 0, 3, 1, 2, 1. Reszta 1 powtarza się po raz pierwszy na pozycji 4, a wcześniej była po 2 liczbach: fragment od 3. do 4. liczby (1 + 6 = 7).' }],
            hint: R`Suma fragmentu od l do r to P[r] − P[l − 1]; dzieli się przez k dokładnie wtedy, gdy P[r] i P[l − 1] dają tę samą resztę z dzielenia przez k. Trzymaj zbiór reszt sum prefiksowych (na start reszta 0 dla pustego początku) — pierwsze r, dla którego reszta już była, to koniec fragmentu. Do tej chwili wszystkie reszty były różne, więc wcześniejsza pozycja z tą resztą jest tylko jedna: znajdziesz ją, przechodząc sumy drugi raz. Sumy mogą sięgać 10¹³ — long long.`,
            tests: (r) => { const t = (n, k, hi) => `${n} ${k}\n${losy(r, n, 1, hi).join(' ')}`; return ['1 1\n5', '1 2\n5', '3 10\n1 2 3', '2 3\n1 1', t(10, 7, 20), t(1000, 1e9, 1e9), t(8000, 1e9, 1e9), t(8000, 7999, 1e9), t(8000, 1000, 1e9), t(8000, 3, 1)]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; if (!calk(n, 1, 8000) || !calk(k, 1, 1e9) || t.length !== n + 2) return 'n, k'; return t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const [n, k] = t; const B = BigInt(k); const gdzie = new Map([[0n, 0]]); let s = 0n; for (let r = 1; r <= n; r++) { s = (s + BigInt(t[1 + r])) % B; if (gdzie.has(s)) return `${gdzie.get(s) + 1} ${r}`; gdzie.set(s, r); } return 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> P(n + 1, 0);
    set<long long> reszty = {0};
    int r = -1;
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        P[i] = P[i - 1] + x;
        if (r == -1 && reszty.count(P[i] % k)) r = i;
        reszty.insert(P[i] % k);
    }
    if (r == -1) {
        cout << "NIE\n";
        return 0;
    }
    int l = 0;
    while (P[l] % k != P[r] % k) l++;
    cout << l + 1 << " " << r << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-rezerwacje', krok: 9, level: 'srednie',
            title: 'Rezerwacje sali',
            short: 'Rezerwacja wchodzi, jeśli nie nachodzi na żadną przyjętą. Sprawdź tylko dwie sąsiednie — lower_bound na parach.',
            tags: ['set<pair>', 'lower_bound', 'sąsiedzi przedziału'],
            statement: ['Sala jest wynajmowana na przedziały czasu. Prośba o rezerwację to dwie liczby a i b: sala zajęta od chwili a do chwili b (a < b; rezerwacje [a, b) i [b, c) się nie nakładają — jedna kończy się dokładnie wtedy, gdy zaczyna druga).',
                'Prośby przychodzą po kolei. Prośba zostaje przyjęta, jeśli nie nakłada się na żadną wcześniej przyjętą rezerwację. Dla każdej prośby wypisz TAK (przyjęta) albo NIE.'],
            input_format: ['W pierwszym wierszu liczba próśb q.', 'W każdym z następnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy — TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 3000', '0 ≤ a < b ≤ 10⁹'],
            examples: [{ input: '5\n10 20\n15 25\n20 30\n5 10\n0 11', note: 'Druga prośba nachodzi na pierwszą. Trzecia i czwarta tylko stykają się z przyjętymi — są w porządku. Ostatnia nachodzi na [10, 20).' }],
            hint: R`Przyjęte rezerwacje trzymaj w set<pair<int, int>> jako (początek, koniec) — nie nakładają się, więc są posortowane po początkach. Dla nowej [a, b) wystarczy sprawdzić dwie: pierwszą, która zaczyna się nie wcześniej niż a (it = s.lower_bound({a, 0})) — kolizja, gdy it->first < b — oraz tę tuż przed nią — kolizja, gdy prev(it)->second > a. Pamiętaj o end() i begin().`,
            tests: (r) => { const t = (q, hi, dl) => `${q}\n${Array.from({ length: q }, () => { const a = r.int(0, hi - 1); return `${a} ${Math.min(hi, a + r.int(1, dl))}`; }).join('\n')}`; return ['1\n0 1', '2\n0 10\n10 20', '2\n0 10\n9 20', '3\n5 6\n0 100\n6 7', t(20, 100, 15), t(1000, 1e5, 300), t(3000, 1e9, 1e6), t(3000, 1e9, 1e5), t(3000, 10000, 3)]; },
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 3000) || t.length !== 1 + 2 * q) return 'q'; for (let i = 0; i < q; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 0, 1e9) || !calk(b, a + 1, 1e9)) return 'przedział'; } return null; },
            solve: (inp) => { const t = nums(inp); const przyj = []; const out = []; for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; const kol = przyj.some(([c, d]) => a < d && c < b); if (!kol) przyj.push([a, b]); out.push(kol ? 'NIE' : 'TAK'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<pair<int, int>> sala;
    while (q--) {
        int a, b;
        cin >> a >> b;
        auto it = sala.lower_bound({a, 0});
        bool kolizja = false;
        if (it != sala.end() && it->first < b) kolizja = true;
        if (it != sala.begin() && prev(it)->second > a) kolizja = true;
        if (kolizja) cout << "NIE\n";
        else {
            sala.insert({a, b});
            cout << "TAK\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-kolejne-liczby', krok: 9, level: 'srednie',
            title: 'Najdłuższy ciąg kolejnych liczb',
            short: 'Jaki najdłuższy ciąg x, x + 1, x + 2, … da się złożyć z liczb na liście? Zbiór i przejście rosnąco.',
            tags: ['zbiór rosnąco', 'serie', 'sąsiad o 1 większy'],
            statement: ['Dostajesz n liczb całkowitych w dowolnej kolejności (mogą się powtarzać). Znajdź najdłuższy ciąg kolejnych liczb całkowitych x, x + 1, x + 2, …, x + L − 1, z których każda występuje na liście. Wypisz L i x — a jeśli najdłuższych ciągów jest kilka, ten o najmniejszym x.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby: L i x.'],
            constraints: ['1 ≤ n ≤ 10 000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '8\n100 4 200 1 3 2 101 102', note: 'Najdłuższy jest ciąg 1, 2, 3, 4 (L = 4). Ciąg 100, 101, 102 ma tylko 3 liczby.' }],
            hint: R`Wrzuć liczby do zbioru — powtórki znikną, a liczby ułożą się rosnąco. Przejdź zbiór i licz długość bieżącej serii: jeśli x jest o 1 większe od poprzedniego elementu, seria trwa; w przeciwnym razie zaczyna się nowa seria od x. Zmieniaj najlepszy wynik tylko przy ściśle dłuższej serii — wtedy zostanie najmniejsze x.`,
            tests: (r) => { const t = (n, hi) => `${n}\n${losy(r, n, -hi, hi).join(' ')}`; return ['1\n5', '3\n7 7 7', '4\n-1 1 0 -2', '5\n10 20 30 40 50', t(30, 20), t(5000, 10000), t(10000, 1e6), t(10000, 6000), `10000\n${Array.from({ length: 10000 }, (_, i) => (i % 2 ? i : -i)).join(' ')}`]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const s = rozne(nums(inp).slice(1)); let best = 0, start = 0, dl = 0; for (let i = 0; i < s.length; i++) { dl = i > 0 && s[i] === s[i - 1] + 1 ? dl + 1 : 1; if (dl > best) { best = dl; start = s[i] - dl + 1; } } return `${best} ${start}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    int najl = 0, start = 0, dl = 0, poprz = 0;
    bool pierwszy = true;
    for (int x : s) {
        if (!pierwszy && x == poprz + 1) dl++;
        else dl = 1;
        if (dl > najl) {
            najl = dl;
            start = x - dl + 1;
        }
        poprz = x;
        pierwszy = false;
    }
    cout << najl << " " << start << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-pierwsza-unikalna', krok: 9, level: 'srednie',
            title: 'Pierwsza niepowtórzona litera',
            short: 'Po każdej literze: która litera jako pierwsza wystąpiła dotąd tylko raz? Zbiór par (pozycja, litera).',
            tags: ['set<pair<int, char>>', 'erase', 'na bieżąco'],
            statement: ['Litery napisu przychodzą po kolei. Po każdej literze wypisz literę, która wystąpiła dotąd dokładnie raz, a spośród takich — tę, która pojawiła się najwcześniej. Jeśli żadna litera nie wystąpiła dotąd dokładnie raz, wypisz znak -.',
                'Odpowiedzi wypisz razem, jako jeden napis o długości takiej jak napis wejściowy.'],
            input_format: ['Jeden wiersz — napis z małych liter a–z.'],
            output_format: ['Jeden napis z odpowiedzi po każdej literze.'],
            constraints: ['Napis ma od 1 do 10 000 liter.'],
            examples: [{ input: 'abacbd', note: 'Po „a”: a. Po „ab”: a. Po „aba”: a już się powtórzyła, pierwsza pojedyncza to b. Po „abac”: b. Po „abacb”: c. Po „abacbd”: c.' }, { input: 'aabb', note: 'Po drugiej literze żadna litera nie jest pojedyncza.' }],
            hint: R`W zbiorze par (pozycja pierwszego wystąpienia, litera) trzymaj litery, które wystąpiły dotąd dokładnie raz — najmniejsza para to odpowiedź. Zapamiętuj w tablicy, gdzie każda litera wystąpiła pierwszy raz i ile razy już była. Przy pierwszym wystąpieniu litery wstaw parę, przy drugim — usuń ją. Po każdej literze wypisz s.begin()->second albo -, gdy zbiór jest pusty.`,
            tests: (r) => ['a', 'aa', 'abc', 'abcabc', r.word(30, 'abc'), r.word(1000, 'abcdefghij'), r.word(10000), r.word(10000, 'ab'), 'abcdefghijklmnopqrstuvwxyz'.repeat(300) + 'z'],
            check: (inp) => (/^[a-z]{1,10000}$/.test(inp.trim()) ? null : 'napis'),
            solve: (inp) => { const s = inp.trim(); const ile = {}; const kol = []; let out = ''; for (const c of s) { ile[c] = (ile[c] || 0) + 1; if (ile[c] === 1) kol.push(c); const p = kol.find((x) => ile[x] === 1); out += p || '-'; } return out; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    vector<int> pierwsza(26, -1), ile(26, 0);
    set<pair<int, char>> pojedyncze;
    string odp = "";
    for (int i = 0; i < (int)s.size(); i++) {
        int c = s[i] - 'a';
        ile[c]++;
        if (ile[c] == 1) {
            pierwsza[c] = i;
            pojedyncze.insert({i, s[i]});
        } else if (ile[c] == 2) {
            pojedyncze.erase({pierwsza[c], s[i]});
        }
        if (pojedyncze.empty()) odp += '-';
        else odp += pojedyncze.begin()->second;
    }
    cout << odp << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-kta-dozwolona', krok: 9, level: 'srednie',
            title: 'k-ta dozwolona liczba',
            short: 'Niektóre liczby są zakazane. Jaka jest k-ta dozwolona dodatnia liczba? Przesuwaj odpowiedź o każdą zakazaną po drodze.',
            tags: ['zbiór rosnąco', 'przesuwanie odpowiedzi', 'long long'],
            statement: ['Niektóre dodatnie liczby całkowite są zakazane. Dozwolone liczby, ułożone rosnąco, tworzą ciąg — np. gdy zakazane są 2, 3 i 7, dozwolone to 1, 4, 5, 6, 8, 9, 10, … Dla każdego z q pytań k wypisz k-tą dozwoloną liczbę.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n zakazanych liczb (mogą się powtarzać).', 'W każdym z następnych q wierszy jedno pytanie k.'],
            output_format: ['q wierszy — k-te dozwolone liczby.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ q ≤ 1000', '1 ≤ zakazana liczba ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '3 4\n2 3 7\n1\n2\n5\n6', note: 'Dozwolone: 1, 4, 5, 6, 8, 9, … Pierwsza to 1, druga 4, piąta 8, szósta 9.' }],
            hint: R`Gdyby nic nie było zakazane, odpowiedzią byłoby k. Każda zakazana liczba, którą „mijamy” po drodze, przesuwa odpowiedź o jeden dalej. Przejdź zbiór zakazanych rosnąco, zaczynając od x = k: jeśli zakazana z ≤ x, zwiększ x o 1; gdy trafisz na z > x — koniec, bo dalsze zakazane są jeszcze większe. Zbiór usunie powtórki, które inaczej przesunęłyby x za daleko. x może przekroczyć 10⁹ — long long.`,
            tests: (r) => { const t = (n, q, hi, kmax) => `${n} ${q}\n${losy(r, n, 1, hi).join(' ')}\n${losy(r, q, 1, kmax).join('\n')}`; return ['1 1\n1\n1', '1 2\n5\n4\n5', '3 3\n1 2 3\n1\n2\n3', '4 2\n2 2 2 3\n1\n2', t(10, 20, 30, 30), t(1000, 1000, 2000, 2000), t(8000, 1000, 1e9, 1e9), t(8000, 1000, 10000, 10000), `5 2\n999999996 999999997 999999998 999999999 1000000000\n1000000000\n999999995`]; },
            check: (inp) => { const t = nums(inp); const [n, q] = t; if (!calk(n, 1, 8000) || !calk(q, 1, 1000) || t.length !== 2 + n + q) return 'n, q'; if (!t.slice(2, 2 + n).every((x) => calk(x, 1, 1e9))) return 'zakazana'; return t.slice(2 + n).every((x) => calk(x, 1, 1e9)) ? null : 'k'; },
            solve: (inp) => { const t = nums(inp); const [n] = t; const z = rozne(t.slice(2, 2 + n)); return t.slice(2 + n).map((k) => { let x = k; for (const f of z) { if (f <= x) x++; else break; } return String(x); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    set<long long> zakazane;
    for (int i = 0; i < n; i++) {
        long long z;
        cin >> z;
        zakazane.insert(z);
    }
    while (q--) {
        long long x;
        cin >> x;
        for (long long z : zakazane) {
            if (z <= x) x++;
            else break;
        }
        cout << x << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'zb-b-mex', krok: 9, level: 'trudne',
            title: 'Najmniejsza wolna liczba na żywo',
            short: 'Liczby dochodzą i znikają, a pytamy o najmniejszą nieobecną. Trzymaj zbiór BRAKUJĄCYCH liczb.',
            tags: ['zbiór brakujących', '*begin()', 'dwa zbiory'],
            statement: ['Zbiór S liczb nieujemnych jest na początku pusty. Wykonaj q poleceń:',
                'DODAJ x — wstaw x do S (jeśli już jest, nic się nie zmienia),',
                'USUN x — usuń x z S (jeśli go nie ma, nic się nie dzieje),',
                'MEX — wypisz najmniejszą liczbę całkowitą nieujemną, której nie ma w S.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie (DODAJ i USUN z liczbą x).'],
            output_format: ['Odpowiedzi na polecenia MEX, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 5000', '0 ≤ x ≤ 10⁹', 'Jest co najmniej jedno polecenie MEX.'],
            examples: [{ input: '7\nDODAJ 0\nDODAJ 1\nMEX\nDODAJ 3\nMEX\nUSUN 0\nMEX', note: 'Po dodaniu 0 i 1 najmniejsza wolna to 2 — trójka tego nie zmienia. Po usunięciu zera wolne jest znów 0.' }],
            hint: R`Odpowiedź nigdy nie przekracza q (w S jest najwyżej q liczb, więc któraś z liczb 0…q jest wolna). Trzymaj drugi zbiór brak = {0, 1, …, q} — liczby z tego zakresu, których nie ma w S. DODAJ x: wstaw do S i, jeśli x ≤ q, usuń x z brak. USUN x: jeśli x był w S, usuń go z S i, jeśli x ≤ q, wstaw do brak. MEX to po prostu *brak.begin().`,
            tests: (r) => { const t = (q, hi) => { const w = []; const by = []; for (let i = 0; i < q; i++) { const p = r.pick(['DODAJ', 'DODAJ', 'DODAJ', 'USUN', 'MEX']); if (p === 'MEX') w.push('MEX'); else { const x = p === 'USUN' && by.length && r() < 0.8 ? r.pick(by) : r.int(0, hi); if (p === 'DODAJ') by.push(x); w.push(`${p} ${x}`); } } if (!w.includes('MEX')) w[q - 1] = 'MEX'; return `${q}\n${w.join('\n')}`; }; return ['1\nMEX', '2\nDODAJ 1\nMEX', '3\nDODAJ 1000000000\nDODAJ 0\nMEX', '4\nUSUN 0\nDODAJ 0\nDODAJ 0\nMEX', t(30, 10), t(1000, 300), t(5000, 1500), t(5000, 1e9), t(5000, 6000)]; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 5000)) return 'q'; let i = 1, ile = 0, pyt = 0; while (i < t.length) { const p = t[i++]; ile++; if (p === 'DODAJ' || p === 'USUN') { if (!calk(Number(t[i++]), 0, 1e9)) return 'x'; } else if (p === 'MEX') pyt++; else return 'polecenie'; } return ile === q && pyt ? null : 'liczba poleceń'; },
            solve: (inp) => { const t = toks(inp); const s = new Set(); const out = []; let i = 1; while (i < t.length) { const p = t[i++]; if (p === 'DODAJ') s.add(Number(t[i++])); else if (p === 'USUN') s.delete(Number(t[i++])); else { let m = 0; while (s.has(m)) m++; out.push(String(m)); } } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<int> S, brak;
    for (int i = 0; i <= q; i++) brak.insert(i);
    for (int k = 0; k < q; k++) {
        string p;
        cin >> p;
        if (p == "MEX") {
            cout << *brak.begin() << "\n";
            continue;
        }
        int x;
        cin >> x;
        if (p == "DODAJ") {
            S.insert(x);
            if (x <= q) brak.erase(x);
        } else if (S.count(x)) {
            S.erase(x);
            if (x <= q) brak.insert(x);
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-aleja', krok: 9, level: 'trudne',
            title: 'Drzewa w alei',
            short: 'Po każdym posadzonym drzewie: najdłuższy pusty odcinek alei. Zbiór pozycji i multiset długości przerw.',
            tags: ['set + multiset', 'sąsiedzi nowego', 'erase(find)'],
            statement: ['Aleja ma długość L: zaczyna się w punkcie 0, a kończy w punkcie L. Kolejno sadzi się n drzew, każde w innym punkcie całkowitym między 1 a L − 1.',
                'Po posadzeniu każdego drzewa wypisz długość najdłuższego pustego odcinka alei — największą odległość między sąsiednimi drzewami, przy czym początek (0) i koniec (L) alei liczą się jak drzewa.'],
            input_format: ['W pierwszym wierszu liczby L i n.', 'W drugim wierszu n różnych pozycji drzew, w kolejności sadzenia.'],
            output_format: ['n wierszy — najdłuższy pusty odcinek po każdym drzewie.'],
            constraints: ['2 ≤ L ≤ 10⁹', '1 ≤ n ≤ 2000', 'n ≤ L − 1'],
            examples: [{ input: '10 3\n3 7 5', note: 'Po 3: odcinki 3 i 7. Po 7: 3, 4, 3 — najdłuższy 4. Po 5: 3, 2, 2, 3.' }],
            hint: R`Trzymaj set pozycji (na start {0, L}) i multiset długości odcinków (na start {L}). Nowe drzewo x dzieli odcinek między sąsiadami a < x < b: usuń z multisetu JEDNĄ kopię b − a i wstaw x − a oraz b − x. Sąsiadów znajdziesz przez it = pozycje.insert(x).first, prev(it) i next(it). Odpowiedź to *odcinki.rbegin().`,
            tests: (r) => { const t = (L, n) => `${L} ${n}\n${unikalne(r, n, () => r.int(1, L - 1)).join(' ')}`; return ['2 1\n1', '10 3\n3 7 5', '5 4\n1 2 3 4', '5 4\n4 3 2 1', t(100, 20), t(1e9, 2000), t(3000, 2000), t(2001, 2000)]; },
            check: (inp) => { const t = nums(inp); const [L, n] = t; if (!calk(L, 2, 1e9) || !calk(n, 1, 2000) || n > L - 1 || t.length !== n + 2) return 'L, n'; const a = t.slice(2); if (!a.every((x) => calk(x, 1, L - 1))) return 'pozycja'; return new Set(a).size === n ? null : 'powtórzona pozycja'; },
            solve: (inp) => { const t = nums(inp); const L = t[0]; const s = new Zbior(); s.add(0); s.add(L); const odc = new Zbior(undefined, true); odc.add(L); return t.slice(2).map((x) => { s.add(x); const i = s.lower(x); const a = s.a[i - 1], b = s.a[i + 1]; odc.del(b - a); odc.add(x - a); odc.add(b - x); return String(odc.max()); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int L, n;
    cin >> L >> n;
    set<int> pozycje = {0, L};
    multiset<int> odcinki = {L};
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        auto it = pozycje.insert(x).first;
        int a = *prev(it), b = *next(it);
        odcinki.erase(odcinki.find(b - a));
        odcinki.insert(x - a);
        odcinki.insert(b - x);
        cout << *odcinki.rbegin() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-odcinki', krok: 9, level: 'trudne',
            title: 'Łączenie odcinków',
            short: 'Odcinki dokładane po kolei sklejają się, gdy nachodzą albo się stykają. Ile kawałków po każdym kroku?',
            tags: ['set<pair>', 'scalanie', 'it = s.erase(it)'],
            statement: ['Na osi liczbowej rysuje się po kolei n odcinków [a, b] (z końcami, a ≤ b). Odcinki, które na siebie nachodzą albo mają wspólny punkt, zlewają się w jeden kawałek — np. [1, 3] i [3, 5] tworzą kawałek [1, 5], ale [1, 3] i [4, 5] to dwa osobne kawałki.',
                'Po narysowaniu każdego odcinka wypisz, z ilu osobnych kawałków składa się rysunek.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby a i b.'],
            output_format: ['n wierszy — liczba kawałków po każdym odcinku.'],
            constraints: ['1 ≤ n ≤ 4000', '0 ≤ a ≤ b ≤ 10⁹'],
            examples: [{ input: '4\n1 3\n5 6\n3 5\n10 12', note: 'Odcinek [3, 5] styka się z [1, 3] i z [5, 6] — wszystko zlewa się w jeden kawałek [1, 6]. Potem [10, 12] jest osobno.' }],
            hint: R`Trzymaj kawałki jako rozłączne pary (początek, koniec) w set<pair<int, int>>. Nowy odcinek [a, b] łączy się ze wszystkimi kawałkami, które zaczynają się nie dalej niż b i kończą nie wcześniej niż a. Znajdź pierwszy taki: it = s.upper_bound({a, INT_MAX}) i cofnij się o jeden, jeśli poprzedni kawałek kończy się w punkcie ≥ a. Potem w pętli, dopóki it->first <= b: rozszerz [a, b] o ten kawałek i usuń go — it = s.erase(it) zwraca strzałkę na następny element. Na koniec wstaw [a, b] i wypisz s.size().`,
            tests: (r) => { const t = (n, hi, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, hi); return `${a} ${Math.min(1e9, a + r.int(0, dl))}`; }).join('\n')}`; return ['1\n0 0', '2\n1 3\n3 5', '2\n1 3\n4 5', '3\n10 20\n0 5\n0 100', '4\n1 1\n3 3\n5 5\n1 5', t(30, 100, 5), t(1000, 1e6, 500), t(4000, 1e9, 1e5), t(4000, 1e6, 100), t(4000, 50000, 3)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 4000) || t.length !== 1 + 2 * n) return 'n'; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 0, 1e9) || !calk(b, a, 1e9)) return 'odcinek'; } return null; },
            solve: (inp) => { const t = nums(inp); let k = []; const out = []; for (let i = 0; i < t[0]; i++) { let a = t[1 + 2 * i], b = t[2 + 2 * i]; const zost = []; for (const [c, d] of k) { if (c <= b && d >= a) { a = Math.min(a, c); b = Math.max(b, d); } else zost.push([c, d]); } zost.push([a, b]); k = zost; out.push(String(k.length)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<pair<int, int>> kawalki;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        auto it = kawalki.upper_bound({a, INT_MAX});
        if (it != kawalki.begin() && prev(it)->second >= a) it--;
        while (it != kawalki.end() && it->first <= b) {
            a = min(a, it->first);
            b = max(b, it->second);
            it = kawalki.erase(it);
        }
        kawalki.insert({a, b});
        cout << kawalki.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-pokoje', krok: 9, level: 'trudne',
            title: 'Przydział pokoi',
            short: 'Goście w hotelu, każdy na swoje dni. Pokój zwalnia się dzień po wyjeździe. Ile pokoi i kto gdzie śpi?',
            tags: ['dwa zbiory', 'set<pair> zajętych', 'set wolnych numerów'],
            statement: ['Do hotelu przyjeżdża n gości. Gość i jest w hotelu od dnia aᵢ do dnia bᵢ włącznie — pokój po nim można dać innemu gościowi najwcześniej w dniu bᵢ + 1.',
                'Hotel przydziela pokoje tak: rozpatruje gości w kolejności dnia przyjazdu (przy tym samym dniu — w kolejności z wejścia). Gdy gość przyjeżdża, dostaje wolny pokój o najmniejszym numerze; jeśli żaden pokój nie jest wolny, hotel otwiera nowy pokój o kolejnym numerze (pierwszy pokój ma numer 1).',
                'Wypisz, ile pokoi trzeba było otworzyć, a potem numery pokoi wszystkich gości w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby aᵢ i bᵢ.'],
            output_format: ['W pierwszym wierszu liczba pokoi.', 'W drugim wierszu n numerów pokoi, oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ aᵢ ≤ bᵢ ≤ 10⁹'],
            examples: [{ input: '3\n1 2\n2 4\n4 4', note: 'Gość 1 bierze pokój 1. Gość 2 przyjeżdża w dniu 2, a gość 1 wyjeżdża dopiero po dniu 2 — potrzebny jest pokój 2. W dniu 4 pokój 1 jest już wolny (gość 2 wciąż zajmuje pokój 2).' }],
            hint: R`Posortuj gości po dniu przyjazdu (np. vector par (a, numer gościa)). Trzymaj dwa zbiory: zajęte — pary (dzień wyjazdu, numer pokoju) — i wolne — numery pokoi. Przy przyjeździe w dniu a najpierw zwolnij wszystkie pokoje, których gość wyjechał przed dniem a: dopóki zajete.begin()->first < a, przenoś pokój do wolnych. Potem weź *wolne.begin() albo otwórz nowy pokój. Zapisz numer pokoju pod numerem gościa, żeby na końcu wypisać w kolejności z wejścia.`,
            tests: (r) => { const t = (n, hi, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(1, hi); return `${a} ${Math.min(1e9, a + r.int(0, dl))}`; }).join('\n')}`; return ['1\n5 5', '2\n1 1\n2 2', '2\n1 2\n2 3', '3\n5 9\n1 3\n1 3', t(20, 30, 5), t(500, 1000, 50), t(3000, 1e9, 1e8), t(3000, 10000, 100), t(3000, 100, 1000)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 3000) || t.length !== 1 + 2 * n) return 'n'; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 1, 1e9) || !calk(b, a, 1e9)) return 'pobyt'; } return null; },
            solve: (inp) => {
                const t = nums(inp); const n = t[0]; const g = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i], i]);
                const kol = g.slice().sort((p, q) => p[0] - q[0] || p[2] - q[2]); const pokoj = new Array(n); const koniec = []; let ile = 0;
                for (const [a, b, i] of kol) { let wyb = -1; for (let p = 0; p < ile; p++) if (koniec[p] < a) { wyb = p; break; } if (wyb === -1) { wyb = ile++; } koniec[wyb] = b; pokoj[i] = wyb + 1; }
                return `${ile}\n${pokoj.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n), b(n);
    vector<pair<long long, int>> kolejnosc(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i] >> b[i];
        kolejnosc[i] = {a[i], i};
    }
    sort(kolejnosc.begin(), kolejnosc.end());
    set<pair<long long, int>> zajete;   // (dzień wyjazdu, pokój)
    set<int> wolne;
    vector<int> pokoj(n);
    int ile = 0;
    for (auto [dzien, i] : kolejnosc) {
        while (!zajete.empty() && zajete.begin()->first < dzien) {
            wolne.insert(zajete.begin()->second);
            zajete.erase(zajete.begin());
        }
        int p;
        if (wolne.empty()) p = ++ile;
        else {
            p = *wolne.begin();
            wolne.erase(wolne.begin());
        }
        pokoj[i] = p;
        zajete.insert({b[i], p});
    }
    cout << ile << "\n";
    for (int i = 0; i < n; i++) cout << pokoj[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-egzamin', krok: 9, level: 'trudne',
            title: 'Sala egzaminacyjna',
            short: 'Każdy wchodzący siada jak najdalej od innych. Który to fotel? Przejdź zbiór zajętych i porównaj przerwy.',
            tags: ['set zajętych', 'przerwy między sąsiadami', 'remis: najmniejszy numer'],
            statement: ['W sali egzaminacyjnej stoi w jednym rzędzie n krzeseł o numerach od 0 do n − 1. Wykonaj q zdarzeń:',
                'WCHODZI — wchodzi uczeń i siada na wolnym krześle, które jest jak najdalej od najbliższego siedzącego ucznia. Jeśli kilka krzeseł jest równie dobrych, wybiera to o najmniejszym numerze. Gdy sala jest pusta, siada na krześle 0. Wypisz numer krzesła albo BRAK, gdy wszystkie krzesła są zajęte (wtedy uczeń wychodzi).',
                'WYCHODZI p — uczeń z krzesła p wychodzi (dane są poprawne: krzesło p jest zajęte).'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z następnych q wierszy zdarzenie.'],
            output_format: ['Odpowiedzi na zdarzenia WCHODZI, każda w osobnym wierszu.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ q ≤ 2000', 'Jest co najmniej jedno zdarzenie WCHODZI.'],
            examples: [{ input: '10 6\nWCHODZI\nWCHODZI\nWCHODZI\nWCHODZI\nWYCHODZI 4\nWCHODZI', note: 'Pierwszy siada na 0, drugi na 9 (najdalej od 0), trzeci na 4 (w połowie). Czwarty ma do wyboru 2 i 6 (oba w odległości 2) — bierze 2. Po wyjściu ucznia z 4 najlepsze jest krzesło 5 (odległość 3).' }],
            hint: R`Trzymaj zbiór zajętych krzeseł i dla każdego WCHODZI przejdź go po kolei, licząc kandydatów w kolejności rosnących numerów: krzesło 0 (jeśli wolne; odległość = pierwsze zajęte), środek każdej przerwy między sąsiadami a i b (krzesło (a + b) / 2, odległość (b − a) / 2, o ile b − a ≥ 2) oraz krzesło n − 1 (jeśli wolne; odległość = n − 1 − ostatnie zajęte). Zmieniaj wybór tylko przy ściśle większej odległości. Liczby sięgają 10⁹ — uważaj na a + b w int.`,
            tests: (r) => { const t = (n, q) => { const zaj = new Zbior(); const w = []; for (let i = 0; i < q; i++) { if (zaj.size && r() < 0.3) { const p = r.pick(zaj.a); zaj.del(p); w.push(`WYCHODZI ${p}`); continue; } w.push('WCHODZI'); const s = siada(n, zaj); if (s >= 0) zaj.add(s); } return `${n} ${q}\n${w.join('\n')}`; }; return ['1 2\nWCHODZI\nWCHODZI', '2 3\nWCHODZI\nWCHODZI\nWCHODZI', '5 4\nWCHODZI\nWCHODZI\nWYCHODZI 0\nWCHODZI', t(10, 30), t(7, 50), t(1000, 500), t(1e9, 2000), t(100, 2000)]; },
            check: (inp) => { const t = toks(inp); const [n, q] = [Number(t[0]), Number(t[1])]; if (!calk(n, 1, 1e9) || !calk(q, 1, 2000)) return 'n, q'; const zaj = new Zbior(); let i = 2, ile = 0, wch = 0; while (i < t.length) { const p = t[i++]; ile++; if (p === 'WCHODZI') { wch++; const s = siada(n, zaj); if (s >= 0) zaj.add(s); } else if (p === 'WYCHODZI') { const x = Number(t[i++]); if (!zaj.has(x)) return 'wychodzi z wolnego krzesła'; zaj.del(x); } else return 'zdarzenie'; } return ile === q && wch ? null : 'liczba zdarzeń'; },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const zaj = new Zbior(); const out = []; let i = 2; while (i < t.length) { const p = t[i++]; if (p === 'WCHODZI') { const s = siada(n, zaj); if (s < 0) out.push('BRAK'); else { zaj.add(s); out.push(String(s)); } } else zaj.del(Number(t[i++])); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    int q;
    cin >> n >> q;
    set<long long> zajete;
    while (q--) {
        string z;
        cin >> z;
        if (z == "WYCHODZI") {
            long long p;
            cin >> p;
            zajete.erase(p);
            continue;
        }
        if (zajete.empty()) {
            zajete.insert(0);
            cout << 0 << "\n";
            continue;
        }
        long long najl = -1, odl = 0;
        long long pierwsze = *zajete.begin(), ostatnie = *zajete.rbegin();
        if (pierwsze > 0) {
            najl = 0;
            odl = pierwsze;
        }
        for (auto it = next(zajete.begin()); it != zajete.end(); it++) {
            long long a = *prev(it), b = *it;
            if (b - a >= 2 && (b - a) / 2 > odl) {
                najl = (a + b) / 2;
                odl = (b - a) / 2;
            }
        }
        if (ostatnie < n - 1 && n - 1 - ostatnie > odl) {
            najl = n - 1;
            odl = n - 1 - ostatnie;
        }
        if (najl == -1) cout << "BRAK\n";
        else {
            zajete.insert(najl);
            cout << najl << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-b-bliskie', krok: 9, level: 'trudne',
            title: 'Bliskie wartości w pobliżu',
            short: 'Czy są dwie pozycje odległe o najwyżej k, których wartości różnią się o najwyżej t? Okno w multisecie i lower_bound.',
            tags: ['okno w multisecie', 'lower_bound(x − t)', 'pierwsze trafienie'],
            statement: ['Dostajesz n liczb x₁, …, xₙ oraz liczby k i t. Szukasz dwóch pozycji i < j, dla których j − i ≤ k oraz |xᵢ − xⱼ| ≤ t.',
                'Jeśli takie pozycje istnieją, wypisz TAK i najmniejsze j, dla którego da się dobrać pasujące i. W przeciwnym razie wypisz NIE.'],
            input_format: ['W pierwszym wierszu liczby n, k i t.', 'W drugim wierszu n liczb.'],
            output_format: ['TAK i liczba j albo NIE.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ k ≤ n', '0 ≤ t ≤ 2 · 10⁸', '−10⁸ ≤ xᵢ ≤ 10⁸'],
            examples: [{ input: '6 2 5\n10 20 30 25 1 40', note: 'Dla j = 4 (wartość 25) w oknie dwóch poprzednich pozycji są 20 i 30 — obie różnią się o 5. Wcześniejsze j nie mają pary.' }, { input: '4 1 0\n1 2 1 2', note: 'Równe wartości stoją za daleko od siebie (odległość 2 > k = 1).' }],
            hint: R`Idź po j od lewej, trzymając w multisecie wartości z okna pozycji j − k … j − 1. Dla xⱼ sprawdź it = okno.lower_bound(xⱼ − t): jeśli it != okno.end() i *it <= xⱼ + t, znalazłeś parę — to najmniejsze j. W przeciwnym razie wstaw xⱼ, a gdy okno ma już k + 1 elementów, usuń jedną kopię wartości sprzed k pozycji. Licz w long long (xⱼ − t może zejść poniżej −3 · 10⁸, a to jeszcze się mieści, ale bezpieczniej).`,
            tests: (r) => { const t = (n, k, tt, hi) => `${n} ${k} ${tt}\n${losy(r, n, -hi, hi).join(' ')}`; return ['1 1 0\n5', '2 1 0\n5 5', '2 1 3\n1 5', '3 1 2\n1 10 3', t(30, 3, 2, 50), t(1000, 10, 100, 1e6), t(8000, 8000, 0, 1e8), t(8000, 50, 1000, 1e8), t(8000, 1, 0, 1e8), t(8000, 300, 20000, 1e8)]; },
            check: (inp) => { const t = nums(inp); const [n, k, tt] = t; if (!calk(n, 1, 8000) || !calk(k, 1, n) || !calk(tt, 0, 2e8) || t.length !== n + 3) return 'n, k, t'; return t.slice(3).every((x) => calk(x, -1e8, 1e8)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const [n, k, tt] = t; const x = t.slice(3); for (let j = 1; j < n; j++) for (let i = Math.max(0, j - k); i < j; i++) if (Math.abs(x[i] - x[j]) <= tt) return `TAK ${j + 1}`; return 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    long long t;
    cin >> n >> k >> t;
    vector<long long> x(n);
    for (long long &v : x) cin >> v;
    multiset<long long> okno;
    for (int j = 0; j < n; j++) {
        auto it = okno.lower_bound(x[j] - t);
        if (it != okno.end() && *it <= x[j] + t) {
            cout << "TAK " << j + 1 << "\n";
            return 0;
        }
        okno.insert(x[j]);
        if ((int)okno.size() > k) okno.erase(okno.find(x[j - k]));
    }
    cout << "NIE\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-podciag', krok: 9, level: 'trudne',
            title: 'Najdłuższy rosnący podciąg — szybko',
            short: '200 000 liczb z generatora. Najdłuższy ściśle rosnący podciąg w O(n log n) — sztuczka ze zbiorem.',
            tags: ['generator', 'insert + erase(next(it))', 'O(n log n)'],
            statement: [GEN_OPIS_B + ' Podciąg to wybrane wyrazy ciągu w ich oryginalnej kolejności (nie muszą stać obok siebie). Jaką długość ma najdłuższy ściśle rosnący podciąg?'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — długość najdłuższego ściśle rosnącego podciągu.'],
            constraints: ['1 ≤ n ≤ 200 000', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 3 5 2 11', note: 'Ciąg: 3, 6, 10, 8, 9, 3. Najdłuższy rosnący podciąg to 3, 6, 8, 9 — długość 4.' }],
            hint: 'Sprawdzanie wszystkich podciągów, a nawet zwykłe O(n²), nie zdąży. Sztuczka: trzymaj zbiór „końcówek”. Dla każdej liczby x: wstaw ją (auto [it, nowy] = s.insert(x);) i — tylko jeśli była nowa — usuń element, który stoi za nią w zbiorze (o ile next(it) != s.end()). Gdy x już był w zbiorze, nic nie zmieniaj: równa liczba nie przedłuży ściśle rosnącego podciągu. Rozmiar zbioru na końcu to długość najdłuższego ściśle rosnącego podciągu — zbiór pilnuje, żeby dla każdej długości końcówka była jak najmniejsza. Generator: ' + KOD_GEN_B,
            tests: (r) => ['1 5 1 0 10', '5 0 1 1 100', '5 4 1 999 1000', '6 3 5 2 11', losGen(r, 1000, 1e6), losGen(r, 200000, 1e9), '200000 7 5 3 1048576', losGen(r, 200000, 1000), '200000 0 1 1 200000', '200000 199999 1 199999 200000'],
            check: (inp) => (toks(inp).length === 5 && dobryGen(toks(inp), 0, 200000, 1e9) ? null : 'generator'),
            solve: (inp) => { const [n, s, a, b, m] = nums(inp); const x = generuj(n, s, a, b, m); const ogon = []; for (const v of x) { let l = 0, r = ogon.length; while (l < r) { const mid = (l + r) >> 1; if (ogon[mid] < v) l = mid + 1; else r = mid; } ogon[l] = v; } return String(ogon.length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    set<long long> konce;
    long long x = s;
    for (long long i = 0; i < n; i++) {
        auto [it, nowy] = konce.insert(x);
        if (nowy && next(it) != konce.end()) konce.erase(next(it));
        x = (x * a + b) % m;
    }
    cout << konce.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-b-gielda', krok: 9, level: 'trudne',
            title: 'Wielki finał: giełda',
            short: 'Oferty kupna i sprzedaży czekają w dwóch multisetach. Nowa oferta zawiera transakcję z najlepszą pasującą — albo czeka.',
            tags: ['dwa multisety', 'begin i rbegin', 'erase(it)', 'finał'],
            statement: ['Na giełdzie handluje się jednym towarem, zawsze po jednej sztuce. Oferty przychodzą po kolei:',
                'KUPUJE p — ktoś chce kupić sztukę i zapłaci najwyżej p. Jeśli czeka oferta sprzedaży z ceną ≤ p, transakcja dochodzi do skutku z najtańszą taką ofertą, po jej cenie — wypisz tę cenę (oferta sprzedaży znika). W przeciwnym razie oferta kupna czeka — wypisz CZEKA.',
                'SPRZEDAJE p — ktoś chce sprzedać sztukę za co najmniej p. Jeśli czeka oferta kupna z ceną ≥ p, transakcja dochodzi do skutku z najwyższą taką ofertą, po jej cenie — wypisz tę cenę (oferta kupna znika). W przeciwnym razie oferta sprzedaży czeka — wypisz CZEKA.',
                'NAJLEPSZE — wypisz najwyższą czekającą ofertę kupna i najniższą czekającą ofertę sprzedaży (zamiast brakującej wypisz -).',
                'Po wszystkich ofertach wypisz jeszcze jeden wiersz: łączną wartość wszystkich transakcji, liczbę czekających ofert kupna i liczbę czekających ofert sprzedaży.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy oferta albo NAJLEPSZE.'],
            output_format: ['Odpowiedź na każdy wiersz (cena, CZEKA albo dwie wartości dla NAJLEPSZE), a na końcu wiersz podsumowania.'],
            constraints: ['1 ≤ q ≤ 2000', '1 ≤ p ≤ 10 000'],
            examples: [{ input: '7\nSPRZEDAJE 50\nSPRZEDAJE 40\nKUPUJE 45\nKUPUJE 45\nNAJLEPSZE\nSPRZEDAJE 44\nKUPUJE 60', note: 'Pierwszy kupujący trafia na sprzedaż za 40. Drugi nie znajduje nic po ≤ 45 i czeka — wtedy najlepsze oferty to kupno 45 i sprzedaż 50. Sprzedający za 44 trafia na czekające kupno 45 i dostaje 45. Ostatni kupuje za 50. Razem 40 + 45 + 50 = 135, nikt nie czeka.' }],
            hint: R`Dwa multisety: kupno i sprzedaz (oferty o tej samej cenie to różne oferty!). KUPUJE p: jeśli sprzedaz nie jest pusta i *sprzedaz.begin() <= p — transakcja po cenie *sprzedaz.begin(), usuń tę jedną ofertę (erase(begin())). SPRZEDAJE p: jeśli kupno nie jest puste i *kupno.rbegin() >= p — transakcja po cenie *kupno.rbegin(), usuń ją przez erase(prev(kupno.end())). W przeciwnym razie wstaw ofertę do właściwego multisetu. Sumę transakcji trzymaj w long long.`,
            tests: (r) => { const t = (q, lo, hi) => `${q}\n${Array.from({ length: q }, () => { const p = r.pick(['KUPUJE', 'SPRZEDAJE', 'KUPUJE', 'SPRZEDAJE', 'NAJLEPSZE']); return p === 'NAJLEPSZE' ? p : `${p} ${r.int(lo, hi)}`; }).join('\n')}`; return ['1\nNAJLEPSZE', '2\nKUPUJE 10\nSPRZEDAJE 10', '2\nKUPUJE 9\nSPRZEDAJE 10', '4\nKUPUJE 5\nKUPUJE 7\nSPRZEDAJE 1\nNAJLEPSZE', t(30, 1, 20), t(500, 90, 110), t(2000, 1, 10000), t(2000, 4990, 5010), t(2000, 1, 3)]; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 2000)) return 'q'; let i = 1, ile = 0; while (i < t.length) { const p = t[i++]; ile++; if (p === 'KUPUJE' || p === 'SPRZEDAJE') { if (!calk(Number(t[i++]), 1, 10000)) return 'p'; } else if (p !== 'NAJLEPSZE') return 'oferta'; } return ile === q ? null : 'liczba ofert'; },
            solve: (inp) => {
                const t = toks(inp); const kup = new Zbior(undefined, true), spr = new Zbior(undefined, true); const out = []; let suma = 0; let i = 1;
                while (i < t.length) {
                    const p = t[i++];
                    if (p === 'NAJLEPSZE') { out.push(`${kup.size ? kup.max() : '-'} ${spr.size ? spr.min() : '-'}`); continue; }
                    const c = Number(t[i++]);
                    if (p === 'KUPUJE') { if (spr.size && spr.min() <= c) { const v = spr.min(); spr.a.splice(0, 1); suma += v; out.push(String(v)); } else { kup.add(c); out.push('CZEKA'); } }
                    else if (kup.size && kup.max() >= c) { const v = kup.max(); kup.a.pop(); suma += v; out.push(String(v)); } else { spr.add(c); out.push('CZEKA'); }
                }
                out.push(`${suma} ${kup.size} ${spr.size}`);
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    multiset<int> kupno, sprzedaz;
    long long suma = 0;
    while (q--) {
        string o;
        cin >> o;
        if (o == "NAJLEPSZE") {
            if (kupno.empty()) cout << "- ";
            else cout << *kupno.rbegin() << " ";
            if (sprzedaz.empty()) cout << "-\n";
            else cout << *sprzedaz.begin() << "\n";
            continue;
        }
        int p;
        cin >> p;
        if (o == "KUPUJE") {
            if (!sprzedaz.empty() && *sprzedaz.begin() <= p) {
                int cena = *sprzedaz.begin();
                sprzedaz.erase(sprzedaz.begin());
                suma += cena;
                cout << cena << "\n";
            } else {
                kupno.insert(p);
                cout << "CZEKA\n";
            }
        } else {
            if (!kupno.empty() && *kupno.rbegin() >= p) {
                int cena = *kupno.rbegin();
                kupno.erase(prev(kupno.end()));
                suma += cena;
                cout << cena << "\n";
            } else {
                sprzedaz.insert(p);
                cout << "CZEKA\n";
            }
        }
    }
    cout << suma << " " << kupno.size() << " " << sprzedaz.size() << "\n";
    return 0;
}`,
        },
    ];
};
