// Liczby dwójkowe — ćwiczenia w trakcie lekcji, części 4–6: działania pisemne na napisach dwójkowych (dodawanie
// z przeniesieniem, plus jeden, razy 2 i przez 2, porównywanie, mnożenie egipskie i pisemne, odejmowanie), bity w pamięci
// (zakresy typów, unsigned i zawijanie, kod U2, przepełnienie int, znaki jako bajty) oraz operatory bitowe & | ^ ~ << >>.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./liczby-dwojkowe-pomoc');
    const { calk, dw, zSystemu, naKBitach, jedynki, losBin, czyDw, czy01, calkB, u2, zU2, zawin, zawinU, bezZer, SLOWA } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const B = (x) => BigInt(x);
    const MAX18 = 10n ** 18n;
    const lista = (a) => `${a.length}\n${a.join('\n')}`;
    const zakresB = (t, lo, hi) => t.every((x) => calkB(x, lo, hi));
    // q par „a b” liczb BigInt
    const pary = (r, ile, lo, hi) => Array.from({ length: ile }, () => `${r.big(lo, hi)} ${r.big(lo, hi)}`);
    const sprPary = (inp, maxQ, lo, hi) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, maxQ) && t.length === 2 * q + 1 && zakresB(t.slice(1), lo, hi) ? null : 'dane'; };
    // zdanie ASCII bez spacji na początku i końcu
    const zdanieAscii = (r, slowa) => { const w = Array.from({ length: slowa }, () => r.pick(SLOWA)); const s = w.join(' '); return s[0].toUpperCase() + s.slice(1); };

    return [
        // ================================================================ KROK 4 · działania pisemne
        {
            id: 'ld-dodawanie-pisemne', krok: 4, level: 'latwe',
            title: 'Dodawanie pisemne',
            short: 'Dodaj dwie liczby dwójkowe po 1000 cyfr: od prawej, w kolumnach, z przeniesieniem. 1 + 1 = 10 — piszesz 0, jeden dalej.',
            tags: ['od prawej', 'przeniesienie', 'napisy'],
            statement: ['Dodawanie pisemne po dwójkowemu wygląda tak samo jak w szkole, tylko cyfry są dwie: 0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10 (piszesz 0 i przenosisz 1 do następnej kolumny), a 1 + 1 + 1 z przeniesienia = 11 (piszesz 1 i przenosisz 1).',
                'Liczby mają nawet 1000 cyfr, więc nie zmieszczą się w long long — dodawaj je jako napisy: od prawej strony, kolumna po kolumnie, pamiętając przeniesienie. Wypisz sumę bez zer na początku.'],
            input_format: ['Dwa wiersze, w każdym liczba dwójkowa bez zer na początku (albo 0).'],
            output_format: ['Suma tych liczb zapisana dwójkowo, bez zer na początku.'],
            constraints: ['Każda liczba ma od 1 do 1000 cyfr.'],
            examples: [{ input: '1011\n111', note: 'Od prawej: 1 + 1 = 10 — piszemy 0, przenosimy 1. 1 + 1 + 1 = 11 — piszemy 1, przenosimy 1. 0 + 1 + 1 = 10 — piszemy 0, przenosimy 1. 1 + 1 = 10 — piszemy 0 i na końcu dopisujemy przeniesioną jedynkę: 10010 (11 + 7 = 18).' }],
            hint: R`int i = a.size() - 1, j = b.size() - 1, p = 0; string w = ""; while (i >= 0 || j >= 0 || p > 0) { int s = p; if (i >= 0) s += a[i--] - '0'; if (j >= 0) s += b[j--] - '0'; w += char('0' + s % 2); p = s / 2; } — cyfry wyniku wychodzą od końca, więc na koniec reverse(w.begin(), w.end());.`,
            tests: (r) => [['0', '0'], ['1', '0'], ['0', '1'], ['1', '1'], ['111', '1'], ['1011', '111'], [losBin(r, 1000), losBin(r, 1000)], [losBin(r, 1000), '1'], ['1'.repeat(1000), '1'.repeat(1000)],
                [losBin(r, 999), losBin(r, 3)], [losBin(r, 60), losBin(r, 59)], ['1'.repeat(500), '1']].map((p) => p.join('\n')),
            check: (inp) => { const l = L(inp); return l.length === 2 && l.every((s) => czyDw(s, 1000)) ? null : 'dane'; },
            solve: (inp) => { const [a, b] = L(inp); return dw(zSystemu(a) + zSystemu(b)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    int i = a.size() - 1, j = b.size() - 1, p = 0;
    string w = "";
    while (i >= 0 || j >= 0 || p > 0) {
        int s = p;
        if (i >= 0) s += a[i--] - '0';
        if (j >= 0) s += b[j--] - '0';
        w += char('0' + s % 2);
        p = s / 2;
    }
    reverse(w.begin(), w.end());
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-plus-jeden', krok: 4, level: 'latwe',
            title: 'Plus jeden i ile cyfr się zmieniło',
            short: 'Dodaj 1 do długiej liczby dwójkowej: jedynki z prawej zamieniają się w zera, a pierwsze zero — w jedynkę. Policz, ile cyfr się zmieniło.',
            tags: ['jedynki na końcu', 'nowa cyfra z przodu', 'przeniesienie'],
            statement: ['Dodawanie jedynki po dwójkowemu to łańcuch przeniesień: idziesz od prawej, każdą jedynkę zamieniasz na zero, a pierwsze napotkane zero — na jedynkę. Jeśli zera w ogóle nie było (same jedynki), z przodu pojawia się nowa jedynka: 111 + 1 = 1000.',
                'Wczytaj liczbę dwójkową, wypisz ją po dodaniu jedynki oraz liczbę cyfr, które się zmieniły (nowa jedynka z przodu też się liczy jako zmiana).'],
            input_format: ['Jeden wiersz: liczba dwójkowa bez zer na początku (albo 0).'],
            output_format: ['W pierwszym wierszu liczba po dodaniu jedynki.', 'W drugim wierszu liczba zmienionych cyfr.'],
            constraints: ['Liczba ma od 1 do 1000 cyfr.'],
            examples: [{ input: '1011', note: 'Dwie jedynki z prawej zamieniają się w zera, a zero przed nimi — w jedynkę: 1100. Zmieniły się trzy cyfry.' },
                { input: '111', note: 'Same jedynki: wszystkie trzy zamieniają się w zera i z przodu dochodzi nowa jedynka — 1000, cztery zmiany.' }],
            hint: R`int i = s.size() - 1, zmiany = 0; while (i >= 0 && s[i] == '1') { s[i] = '0'; i--; zmiany++; }. Potem: if (i >= 0) s[i] = '1'; else s = "1" + s; i jeszcze zmiany++;.`,
            tests: (r) => ['0', '1', '10', '11', '1011', '111', '1000', '1'.repeat(1000), losBin(r, 1000), losBin(r, 999) + '0', '1' + '0'.repeat(500) + '1'.repeat(499), losBin(r, 40) + '1'.repeat(20)],
            check: (inp) => (czyDw(inp.trim(), 1000) ? null : 'dane'),
            solve: (inp) => { const s = inp.trim(); const w = dw(zSystemu(s) + 1n); let ile = 0; const m = w.length; const a = s.padStart(m, '#'); for (let i = 0; i < m; i++) if (a[i] !== w[i]) ile++; return `${w}\n${ile}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int i = s.size() - 1, zmiany = 0;
    while (i >= 0 && s[i] == '1') {
        s[i] = '0';
        i--;
        zmiany++;
    }
    if (i >= 0) s[i] = '1';
    else s = "1" + s;
    zmiany++;
    cout << s << "\n" << zmiany << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-razy-dwa-przez-dwa', krok: 4, level: 'srednie',
            title: 'Polecenia na liczbie dwójkowej',
            short: 'Razy 2 to dopisanie zera z prawej, przez 2 — skreślenie ostatniej cyfry, a +1 — łańcuch przeniesień. Uważaj na zero!',
            tags: ['dopisz 0', 'skreśl ostatnią', 'zero razy dwa'],
            statement: ['Na liczbie dwójkowej zapisanej napisem wykonaj po kolei q poleceń: *2 (pomnóż przez 2), /2 (podziel przez 2, odrzucając resztę) i +1 (dodaj jeden). Wypisz wynik po wszystkich poleceniach.',
                'Mnożenie przez 2 po dwójkowemu to dopisanie zera na końcu — tak jak mnożenie przez 10 po dziesiętnemu. Dzielenie przez 2 to skreślenie ostatniej cyfry. Uważaj na dwa przypadki: zero razy dwa to nadal 0 (a nie 00), a po skreśleniu jedynej cyfry zostaje 0.'],
            input_format: ['W pierwszym wierszu liczba dwójkowa bez zer na początku (albo 0).', 'W drugim wierszu liczba poleceń q.', 'W każdym z kolejnych q wierszy jedno polecenie: *2, /2 albo +1.'],
            output_format: ['Liczba po wykonaniu wszystkich poleceń, zapisana dwójkowo bez zer na początku.'],
            constraints: ['Początkowa liczba ma od 1 do 100 cyfr.', '1 ≤ q ≤ 1000'],
            examples: [{ input: '101\n4\n*2\n+1\n/2\n/2', note: '101 (5) → *2 → 1010 (10) → +1 → 1011 (11) → /2 → 101 (5) → /2 → 10 (2).' },
                { input: '0\n3\n*2\n+1\n/2', note: '0 razy 2 to wciąż 0. Plus jeden — 1. Podzielone przez 2 daje 0: skreślamy jedyną cyfrę i zostaje zero.' }],
            hint: R`*2: if (s != "0") s += '0';. /2: if (s.size() == 1) s = "0"; else s.pop_back();. +1: jak w zadaniu „Plus jeden”. Polecenia wczytuj jako napisy: string p; cin >> p; if (p == "*2") …`,
            tests: (r) => {
                const t = ['1\n1\n/2', '0\n1\n*2', '0\n1\n+1', '1\n2\n*2\n*2', '101\n4\n*2\n+1\n/2\n/2'];
                for (let k = 0; k < 5; k++) { const ops = Array.from({ length: 1000 }, () => r.pick(['*2', '/2', '+1', k % 2 ? '*2' : '+1'])); t.push(`${losBin(r, r.int(1, 100))}\n${ops.length}\n${ops.join('\n')}`); }
                t.push(`${'1'.repeat(100)}\n200\n${Array.from({ length: 200 }, () => '/2').join('\n')}`);
                t.push(`1\n1000\n${Array.from({ length: 1000 }, () => '+1').join('\n')}`);
                t.push(`${losBin(r, 50)}\n600\n${Array.from({ length: 600 }, (_, i) => (i < 300 ? '*2' : '+1')).join('\n')}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[1]); return czyDw(l[0], 100) && calk(q, 1, 1000) && l.length === q + 2 && l.slice(2).every((p) => ['*2', '/2', '+1'].includes(p)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); let x = zSystemu(l[0]); for (const p of l.slice(2)) { if (p === '*2') x *= 2n; else if (p === '/2') x /= 2n; else x += 1n; } return dw(x); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int q;
    cin >> s >> q;
    for (int k = 0; k < q; k++) {
        string p;
        cin >> p;
        if (p == "*2") {
            if (s != "0") s += '0';
        } else if (p == "/2") {
            if (s.size() == 1) s = "0";
            else s.pop_back();
        } else {
            int i = s.size() - 1;
            while (i >= 0 && s[i] == '1') {
                s[i] = '0';
                i--;
            }
            if (i >= 0) s[i] = '1';
            else s = "1" + s;
        }
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-porownaj-dwojkowe', krok: 4, level: 'latwe',
            title: 'Porównywanie długich liczb dwójkowych',
            short: 'Najpierw zetnij zera z przodu. Dłuższa liczba jest większa, a przy równej długości decyduje pierwsza różnica od lewej.',
            tags: ['zera z przodu', 'długość', 'pierwsza różnica'],
            statement: ['Dla każdej pary liczb dwójkowych zapisanych napisami (mogą zaczynać się od zer i mieć różne długości) sprawdź, która jest większa.',
                'Sposób: najpierw usuń zera z przodu (zostaw przynajmniej jedną cyfrę). Teraz dłuższa liczba jest większa — jej najstarsza jedynka waży więcej niż cała krótsza liczba. Jeśli długości są równe, decyduje pierwsza od lewej różnica, jak w zadaniu z rzędami żarówek.'],
            input_format: ['W pierwszym wierszu liczba q.', 'Potem q par wierszy: dwa napisy z zer i jedynek.'],
            output_format: ['q wierszy: znak < (pierwsza mniejsza), > (pierwsza większa) albo = (równe).'],
            constraints: ['1 ≤ q ≤ 20', 'Każdy napis ma od 1 do 1000 znaków.'],
            examples: [{ input: '3\n0011\n101\n1000\n111\n00\n0', note: '0011 to 11 (3), a 101 to 5 — pierwsza mniejsza. 1000 (8) jest dłuższa od 111 (7), więc większa. 00 i 0 to obie zero.' }],
            hint: R`Funkcja string bezZer(string s) { int p = 0; while (p + 1 < s.size() && s[p] == '0') p++; return s.substr(p); }. Potem: if (a.size() != b.size()) — mniejsza jest krótsza; w przeciwnym razie porównaj napisy a < b.`,
            tests: (r) => {
                const t = ['1\n0\n0', '1\n1\n0', '2\n0001\n1\n10\n01'];
                for (let k = 0; k < 4; k++) {
                    const ps = Array.from({ length: 20 }, (_, j) => { const zera1 = '0'.repeat(r.int(0, j % 3 ? 5 : 300)), zera2 = '0'.repeat(r.int(0, 5)); const a = losBin(r, r.int(1, 600)); let b = j % 4 === 0 ? a : losBin(r, j % 2 ? a.length : r.int(1, 600)); return [zera1 + a, zera2 + b]; });
                    t.push(`20\n${ps.map((p) => p.join('\n')).join('\n')}`);
                }
                t.push(`2\n${'0'.repeat(999)}1\n1\n${'0'.repeat(500)}${'1'.repeat(500)}\n${'1'.repeat(499)}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 20) && l.length === 2 * q + 1 && l.slice(1).every((s) => czy01(s, 1000)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const o = []; for (let i = 0; i < Number(l[0]); i++) { const x = zSystemu(l[1 + 2 * i]), y = zSystemu(l[2 + 2 * i]); o.push(x < y ? '<' : x > y ? '>' : '='); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string bezZer(string s) {
    int p = 0;
    while (p + 1 < (int)s.size() && s[p] == '0') p++;
    return s.substr(p);
}
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string a, b;
        cin >> a >> b;
        a = bezZer(a);
        b = bezZer(b);
        char w;
        if (a.size() != b.size()) w = a.size() < b.size() ? '<' : '>';
        else if (a == b) w = '=';
        else w = a < b ? '<' : '>';
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-mnozenie-egipskie', krok: 4, level: 'srednie',
            title: 'Mnożenie egipskie',
            short: 'Połów a, podwajaj b i dodawaj b tam, gdzie a jest nieparzyste. To mnożenie po dwójkowemu — bity a mówią, które podwojenia wziąć.',
            tags: ['połowienie i podwajanie', 'nieparzyste = bit 1', 'long long'],
            statement: ['Starożytni Egipcjanie mnożyli, umiejąc tylko podwajać i połowić. Zapisz w wierszu a i b. Potem w kolejnych wierszach a dziel przez 2 (odrzucając resztę), a b mnóż przez 2 — aż a dojdzie do 1. Wynik mnożenia to suma tych b, przy których a jest nieparzyste.',
                'Dlaczego to działa? Nieparzyste a w kolejnych wierszach to dokładnie jedynki w zapisie dwójkowym a, a b w tych wierszach to b · 1, b · 2, b · 4, … Na przykład 13 = 8 + 4 + 1, więc 13 · 7 = 7 · 8 + 7 · 4 + 7 · 1. Wypisz całą tabelkę i wynik.'],
            input_format: ['Dwie liczby a i b.'],
            output_format: ['Kolejne wiersze tabelki: a i b oddzielone spacją, a jeśli a jest nieparzyste — jeszcze spacja i znak +. Ostatni wiersz tabelki ma a = 1.', 'Na końcu wiersz wynik: X, gdzie X = a · b.'],
            constraints: ['1 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '13 7', note: 'Wiersze: 13 7 + (13 nieparzyste), 6 14, 3 28 +, 1 56 +. Suma oznaczonych b: 7 + 28 + 56 = 91 = 13 · 7.' }],
            hint: R`long long a, b, wynik = 0; while (a >= 1) { cout << a << " " << b; if (a % 2 == 1) { cout << " +"; wynik += b; } cout << "\n"; a /= 2; b *= 2; } i na końcu cout << "wynik: " << wynik;. b rośnie do miliardów razy 2²⁹ — long long jest konieczny.`,
            tests: (r) => ['1 1', '13 7', '2 5', '1 1000000000', '1000000000 1000000000', '999999999 3', '1024 3', '255 255', `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1000)} ${r.int(1, 1e9)}`, `536870912 999999999`],
            check: (inp) => { const t = nums(inp); return t.length === 2 && t.every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { let [a, b] = toks(inp).map(B); const o = []; let w = 0n; while (a >= 1n) { o.push(`${a} ${b}${a % 2n ? ' +' : ''}`); if (a % 2n) w += b; a /= 2n; b *= 2n; } o.push(`wynik: ${w}`); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long wynik = 0;
    while (a >= 1) {
        cout << a << " " << b;
        if (a % 2 == 1) {
            cout << " +";
            wynik += b;
        }
        cout << "\n";
        a /= 2;
        b *= 2;
    }
    cout << "wynik: " << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-kroki-do-zera', krok: 4, level: 'srednie',
            title: 'Kroki do zera',
            short: 'Parzystą liczbę dziel przez 2, nieparzystą zmniejszaj o 1. Ile kroków do zera? Liczba ma do 100 000 cyfr dwójkowych — licz na napisie.',
            tags: ['ostatnia cyfra = parzystość', 'skreślanie cyfry', 'za długie na typy'],
            statement: ['Zaczynasz od liczby n. W każdym kroku: jeśli n jest parzyste, dzielisz je przez 2; jeśli nieparzyste — odejmujesz 1. Ile kroków trzeba, żeby dojść do zera?',
                'Liczba jest podana dwójkowo i ma nawet 100 000 cyfr. Po dwójkowemu oba ruchy są proste: parzystość widać po ostatniej cyfrze (0 — parzysta), dzielenie przez 2 to skreślenie ostatniego zera, a odjęcie 1 od liczby nieparzystej zamienia ostatnią jedynkę na zero.'],
            input_format: ['Jeden wiersz: liczba n zapisana dwójkowo, bez zer na początku.'],
            output_format: ['Jedna liczba — liczba kroków do zera.'],
            constraints: ['Zapis ma od 1 do 100 000 cyfr, n ≥ 1.'],
            examples: [{ input: '1101', note: '13 → 12 (−1) → 6 (:2) → 3 (:2) → 2 (−1) → 1 (:2) → 0 (−1). Razem 6 kroków.' },
                { input: '1', note: 'Jedynka jest nieparzysta: jeden krok −1 i już jest zero.' }],
            hint: R`Pętla, dopóki napis nie jest "0": jeśli s.back() == '0', to s.pop_back(); (dzielenie przez 2), a jeśli '1' — zamień ją na '0' (odjęcie 1), a jeśli to była jedyna cyfra, napis staje się "0". Licz kroki w long long. Ciekawostka: wynik to (liczba cyfr − 1) + liczba jedynek — sprawdzisz dlaczego?`,
            tests: (r) => ['1', '10', '11', '1101', '1000000', '1'.repeat(100000), losBin(r, 100000), '1' + '0'.repeat(99999), losBin(r, 50000, false, 0.1), losBin(r, 64), losBin(r, 7)],
            check: (inp) => { const s = inp.trim(); return czyDw(s, 100000) && s !== '0' ? null : 'dane'; },
            solve: (inp) => { const s = inp.trim(); let c = 0; for (const ch of s) if (ch === '1') c++; return String(s.length - 1 + c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    long long kroki = 0;
    while (s != "0") {
        if (s.back() == '0') s.pop_back();
        else if (s.size() == 1) s = "0";
        else s.back() = '0';
        kroki++;
    }
    cout << kroki << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-odejmowanie-pisemne', krok: 4, level: 'srednie',
            title: 'Odejmowanie pisemne',
            short: 'Odejmuj od prawej. Gdy na górze 0, a na dole 1 — pożycz z następnej kolumny: 10 − 1 = 1. Na koniec zetnij zera z przodu.',
            tags: ['pożyczka', 'od prawej', 'zera z przodu wyniku'],
            statement: ['Wczytaj dwie liczby dwójkowe a ≥ b (bez zer na początku, do 1000 cyfr) i wypisz ich różnicę a − b.',
                'Odejmowanie pisemne po dwójkowemu: od prawej, kolumna po kolumnie. 1 − 0 = 1, 1 − 1 = 0, 0 − 0 = 0, a gdy trzeba od 0 odjąć 1, pożyczasz jedynkę z następnej kolumny: 10 − 1 = 1, a w następnej kolumnie odejmujesz o 1 więcej. Wynik może zaczynać się od zer — usuń je (zero to 0).'],
            input_format: ['Dwa wiersze: liczby a i b zapisane dwójkowo, a ≥ b.'],
            output_format: ['Różnica a − b zapisana dwójkowo, bez zer na początku.'],
            constraints: ['Każda liczba ma od 1 do 1000 cyfr.', 'a ≥ b'],
            examples: [{ input: '10010\n111', note: '18 − 7 = 11. Od prawej: 0 − 1 — pożyczamy, wychodzi 1. W drugiej kolumnie 1 − 1 − 1 (pożyczka) — znów pożyczamy: 1. Dalej 0 − 1 − 1 — pożyczka: 0. Dalej 1 − 0 − 1 = 0, na końcu 1. Wynik 01011, czyli 1011.' }],
            hint: R`int i = a.size() - 1, j = b.size() - 1, poz = 0; while (i >= 0) { int d = (a[i] - '0') - poz - (j >= 0 ? b[j] - '0' : 0); if (d < 0) { d += 2; poz = 1; } else poz = 0; w += char('0' + d); i--; j--; }. Potem reverse i usunięcie zer z przodu.`,
            tests: (r) => {
                const t = [['0', '0'], ['1', '1'], ['1', '0'], ['10', '1'], ['10010', '111'], ['1000000', '1'], ['1'.repeat(1000), '1'.repeat(1000)], ['1' + '0'.repeat(999), '1']];
                for (let k = 0; k < 5; k++) { const a = losBin(r, r.int(500, 1000)); const b = dw(r.big(0n, zSystemu(a))); t.push([a, b]); }
                t.push(['1' + '0'.repeat(999), '1'.repeat(999)]);
                return t.map((p) => p.join('\n'));
            },
            check: (inp) => { const l = L(inp); return l.length === 2 && l.every((s) => czyDw(s, 1000)) && zSystemu(l[0]) >= zSystemu(l[1]) ? null : 'dane'; },
            solve: (inp) => { const [a, b] = L(inp); return dw(zSystemu(a) - zSystemu(b)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    int i = a.size() - 1, j = b.size() - 1, poz = 0;
    string w = "";
    while (i >= 0) {
        int d = (a[i] - '0') - poz - (j >= 0 ? b[j] - '0' : 0);
        if (d < 0) {
            d += 2;
            poz = 1;
        } else poz = 0;
        w += char('0' + d);
        i--;
        j--;
    }
    while (w.size() > 1 && w.back() == '0') w.pop_back();
    reverse(w.begin(), w.end());
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-mnozenie-pisemne', krok: 4, level: 'srednie',
            title: 'Mnożenie pisemne',
            short: 'Po dwójkowemu tabliczka mnożenia ma tylko 0 i 1: dla każdej jedynki w b dodaj a przesunięte o tyle miejsc w lewo.',
            tags: ['przesuń i dodaj', 'dodawanie napisów', 'funkcje'],
            statement: ['Wczytaj dwie liczby dwójkowe a i b (do 300 cyfr) i wypisz ich iloczyn.',
                'Mnożenie pisemne po dwójkowemu jest prostsze niż po dziesiętnemu: mnożenie a przez cyfrę b daje albo 0, albo samo a. Dla każdej jedynki w b, stojącej na pozycji j od prawej (licząc od 0), dodaj do wyniku a z dopisanymi j zerami na końcu (czyli a · 2ʲ). Dodawanie robisz tak jak w zadaniu „Dodawanie pisemne”.'],
            input_format: ['Dwa wiersze: liczby a i b zapisane dwójkowo, bez zer na początku (albo 0).'],
            output_format: ['Iloczyn a · b zapisany dwójkowo, bez zer na początku.'],
            constraints: ['Każda liczba ma od 1 do 300 cyfr.'],
            examples: [{ input: '101\n11', note: 'Jedynki w b = 11 stoją na pozycjach 0 i 1, więc wynik to 101 + 1010 = 1111 (5 · 3 = 15).' },
                { input: '1101\n0', note: 'Coś razy zero to zero.' }],
            hint: R`Napisz funkcję string dodaj(string a, string b) z zadania o dodawaniu. Potem string wynik = "0"; for (int j = 0; j < b.size(); j++) if (b[b.size() - 1 - j] == '1') wynik = dodaj(wynik, a + string(j, '0'));. Uważaj, żeby nie dopisywać zer do samego zera — wystarczy na początku sprawdzić, czy a albo b to "0".`,
            tests: (r) => [['0', '0'], ['1', '0'], ['0', '111'], ['1', '1'], ['101', '11'], ['11', '11'], ['1101', '1101'], [losBin(r, 300), losBin(r, 300)], ['1'.repeat(300), '1'.repeat(300)], [losBin(r, 300), '1'], [losBin(r, 150), losBin(r, 299)], [losBin(r, 32), losBin(r, 32)]].map((p) => p.join('\n')),
            check: (inp) => { const l = L(inp); return l.length === 2 && l.every((s) => czyDw(s, 300)) ? null : 'dane'; },
            solve: (inp) => { const [a, b] = L(inp); return dw(zSystemu(a) * zSystemu(b)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string dodaj(string a, string b) {
    int i = a.size() - 1, j = b.size() - 1, p = 0;
    string w = "";
    while (i >= 0 || j >= 0 || p > 0) {
        int s = p;
        if (i >= 0) s += a[i--] - '0';
        if (j >= 0) s += b[j--] - '0';
        w += char('0' + s % 2);
        p = s / 2;
    }
    reverse(w.begin(), w.end());
    return w;
}
int main() {
    string a, b;
    cin >> a >> b;
    if (a == "0" || b == "0") {
        cout << "0\n";
        return 0;
    }
    string wynik = "0";
    for (int j = 0; j < (int)b.size(); j++)
        if (b[b.size() - 1 - j] == '1') wynik = dodaj(wynik, a + string(j, '0'));
    cout << wynik << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 5 · bity w pamięci
        {
            id: 'ld-zakres-na-k-bitach', krok: 5, level: 'latwe',
            title: 'Zakres liczb na k bitach',
            short: 'Na k bitach bez znaku: od 0 do 2ᵏ − 1. Ze znakiem (kod U2): od −2ᵏ⁻¹ do 2ᵏ⁻¹ − 1. Dla k = 64 uważaj — 1ULL << 64 nie działa.',
            tags: ['unsigned', 'kod U2', 'unsigned long long'],
            statement: ['Na k bitach zmieści się 2ᵏ różnych wartości. Typ bez znaku (unsigned) używa ich na liczby od 0 do 2ᵏ − 1. Typ ze znakiem (kod U2) dzieli je na pół: od −2ᵏ⁻¹ do 2ᵏ⁻¹ − 1 — ujemnych jest o jedną więcej, bo zero zajmuje miejsce po stronie nieujemnej.',
                'Dla każdego k wypisz trzy liczby: największą liczbę bez znaku na k bitach, najmniejszą liczbę ze znakiem i największą liczbę ze znakiem. Dla k = 32 dostaniesz zakresy unsigned int i int, a dla k = 64 — unsigned long long i long long.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba k.'],
            output_format: ['q wierszy: trzy liczby oddzielone spacjami — 2ᵏ − 1, −2ᵏ⁻¹ i 2ᵏ⁻¹ − 1.'],
            constraints: ['1 ≤ q ≤ 64', '1 ≤ k ≤ 64'],
            examples: [{ input: '4\n1\n8\n32\n64', note: 'Na 1 bicie: bez znaku 0 albo 1, ze znakiem −1 albo 0. Na 8 bitach: do 255 albo od −128 do 127. Na 32 bitach — zakres unsigned int i int. Na 64 bitach — największy unsigned long long i zakres long long.' }],
            hint: R`unsigned long long m = 1ULL << (k - 1); to 2ᵏ⁻¹ (k − 1 ≤ 63, więc się da). Wtedy 2ᵏ − 1 = m - 1 + m (dla k = 64 przesunięcie o 64 jest zabronione, a ta suma dalej działa), największa ze znakiem to m - 1, a najmniejsza to -(long long)(m - 1) - 1.`,
            tests: (r) => [lista(Array.from({ length: 64 }, (_, i) => String(i + 1))), lista(['64', '63', '1', '2']), lista(r.shuffle(Array.from({ length: 64 }, (_, i) => String(i + 1))).slice(0, 20)), lista(['32', '16', '8'])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 64) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 64)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((k) => { const m = 1n << B(k - 1); return `${2n * m - 1n} ${-m} ${m - 1n}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        int k;
        cin >> k;
        unsigned long long m = 1ULL << (k - 1);
        unsigned long long bezZnaku = m - 1 + m;
        long long maks = (long long)(m - 1);
        long long mini = -maks - 1;
        cout << bezZnaku << " " << mini << " " << maks << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-ktory-typ', krok: 5, level: 'latwe',
            title: 'W jakim typie się zmieści',
            short: 'char ma 8 bitów (−128..127), short 16, int 32, long long 64. Dla każdej liczby wypisz najmniejszy typ, który ją pomieści.',
            tags: ['char, short, int, long long', 'zakresy', 'INT_MAX'],
            statement: ['Typy całkowite ze znakiem różnią się liczbą bitów: char ma 8 bitów (od −128 do 127), short — 16 bitów (od −32 768 do 32 767), int — 32 bity (od −2 147 483 648 do 2 147 483 647), a long long — 64 bity.',
                'Dla każdej liczby wypisz nazwę najmniejszego z tych typów, w którym się zmieści: char, short, int albo long long.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba całkowita x.'],
            output_format: ['q wierszy: char, short, int albo long long.'],
            constraints: ['1 ≤ q ≤ 1000', '−9 · 10¹⁸ ≤ x ≤ 9 · 10¹⁸'],
            examples: [{ input: '5\n100\n-128\n128\n40000\n3000000000', note: '100 i −128 mieszczą się w char. 128 już nie (char kończy się na 127), ale w short tak. 40 000 przekracza 32 767 — potrzebny int. 3 miliardy nie mieszczą się w int.' }],
            hint: R`Wczytaj x do long long i porównuj z granicami: if (x >= -128 && x <= 127) … else if (x >= -32768 && x <= 32767) … else if (x >= INT_MIN && x <= INT_MAX) … else long long. INT_MIN i INT_MAX są w <climits> (bits/stdc++.h je ma).`,
            tests: (r) => {
                const gr = ['-128', '127', '128', '-129', '-32768', '32767', '32768', '-32769', '-2147483648', '2147483647', '2147483648', '-2147483649', '0', '9000000000000000000', '-9000000000000000000'];
                const t = [lista(gr)];
                t.push(lista(Array.from({ length: 1000 }, () => { const z = r.int(0, 3); const lim = [127n, 40000n, 3000000000n, 9000000000000000000n][z]; return String(r.big(-lim, lim)); })));
                t.push(lista(Array.from({ length: 300 }, () => String(r.int(-300, 300)))));
                return t;
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), -9000000000000000000n, 9000000000000000000n) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { const x = B(s); return x >= -128n && x <= 127n ? 'char' : x >= -32768n && x <= 32767n ? 'short' : x >= -2147483648n && x <= 2147483647n ? 'int' : 'long long'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        cin >> x;
        if (x >= -128 && x <= 127) cout << "char\n";
        else if (x >= -32768 && x <= 32767) cout << "short\n";
        else if (x >= INT_MIN && x <= INT_MAX) cout << "int\n";
        else cout << "long long\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-licznik-kilometrow', krok: 5, level: 'latwe',
            title: 'Licznik kilometrów',
            short: 'Licznik ma k bitów i po 2ᵏ − 1 przekręca się na 0 — dokładnie jak typ bez znaku. Po każdej trasie wypisz, co pokazuje.',
            tags: ['zawijanie', '% 2ᵏ', 'unsigned'],
            statement: ['Stary licznik kilometrów ma k bitów, więc pokazuje liczby od 0 do 2ᵏ − 1. Gdy pokazuje 2ᵏ − 1 (same jedynki) i przybędzie kilometr, przekręca się na 0 — tak samo zachowuje się każdy typ bez znaku w C++, na przykład unsigned char po 255 przechodzi w 0.',
                'Licznik pokazuje na początku x. Samochód przejeżdża kolejno q tras. Po każdej trasie wypisz, co pokazuje licznik. Pokazywana liczba to po prostu prawdziwa suma kilometrów modulo 2ᵏ.'],
            input_format: ['W pierwszym wierszu liczby k, x i q.', 'W drugim wierszu q liczb — długości kolejnych tras w kilometrach.'],
            output_format: ['q wierszy — stan licznika po każdej trasie.'],
            constraints: ['1 ≤ k ≤ 30', '0 ≤ x < 2ᵏ', '1 ≤ q ≤ 1000', 'Każda trasa ma od 0 do 10⁹ kilometrów.'],
            examples: [{ input: '4 13 3\n2 5 100', note: 'Licznik 4-bitowy pokazuje od 0 do 15. 13 + 2 = 15. 15 + 5 = 20, ale 20 mod 16 = 4 — licznik się przekręcił. 4 + 100 = 104, a 104 mod 16 = 8.' }],
            hint: R`long long m = 1LL << k; i po każdej trasie x = (x + a) % m;. Wszystko w long long: x + a może przekroczyć 2 miliardy.`,
            tests: (r) => {
                const t = ['1 0 3\n1 1 1', '4 13 3\n2 5 100', '8 255 2\n1 255', '30 0 1\n1000000000'];
                for (let i = 0; i < 4; i++) { const k = r.int(1, 30); t.push(`${k} ${r.int(0, 2 ** k - 1)} 1000\n${r.arr(1000, 0, i % 2 ? 1e9 : 20).join(' ')}`); }
                t.push(`30 1073741823 5\n1 999999999 1000000000 0 73741824`);
                return t;
            },
            check: (inp) => { const t = nums(inp); const [k, x, q] = t; return calk(k, 1, 30) && calk(x, 0, 2 ** k - 1) && calk(q, 1, 1000) && t.length === q + 3 && t.slice(3).every((a) => calk(a, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp).map(B); const m = 1n << t[0]; let x = t[1]; return t.slice(3).map((a) => String((x = (x + a) % m))).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long k, x;
    int q;
    cin >> k >> x >> q;
    long long m = 1LL << k;
    for (int i = 0; i < q; i++) {
        long long a;
        cin >> a;
        x = (x + a) % m;
        cout << x << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-kod-u2', krok: 5, level: 'srednie',
            title: 'Zapisz liczbę w kodzie U2',
            short: 'Liczba ujemna x na k bitach to zapis liczby x + 2ᵏ. −1 na 8 bitach to 11111111, −128 to 10000000.',
            tags: ['x + 2ᵏ', 'k bitów', 'liczby ujemne'],
            statement: ['W kodzie U2 (tak C++ trzyma int i long long) najstarszy bit ma wagę ujemną: na k bitach waży −2ᵏ⁻¹ zamiast +2ᵏ⁻¹. Dzięki temu liczby nieujemne zapisuje się zwyczajnie, a liczbę ujemną x — jako zwykły zapis liczby x + 2ᵏ. Na przykład na 8 bitach −1 to zapis 255, czyli 11111111, a −128 to zapis 128, czyli 10000000.',
                'Dla każdej pary x, k wypisz kod U2 liczby x na dokładnie k bitach.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby x i k.'],
            output_format: ['q wierszy — kod U2 liczby x: dokładnie k cyfr 0 i 1.'],
            constraints: ['1 ≤ q ≤ 300', '2 ≤ k ≤ 32', '−2ᵏ⁻¹ ≤ x ≤ 2ᵏ⁻¹ − 1'],
            examples: [{ input: '4\n5 8\n-1 8\n-128 8\n-3 4', note: '5 na 8 bitach to zwykłe 00000101. −1 → 255 → 11111111. −128 → 128 → 10000000. −3 na 4 bitach → 13 → 1101.' }],
            hint: R`long long v = x; if (v < 0) v += 1LL << k; a potem zapisz v na dokładnie k bitach: pętla k razy z s = char('0' + v % 2) + s; v /= 2;.`,
            tests: (r) => {
                const t = [lista(['0 2', '1 2', '-1 2', '-2 2', '5 8', '-1 8', '-128 8', '127 8', '-3 4', '-2147483648 32', '2147483647 32', '-1 32'])];
                t.push(lista(Array.from({ length: 300 }, () => { const k = r.int(2, 32); const m = 2 ** (k - 1); return `${r.int(-m, m - 1)} ${k}`; })));
                t.push(lista(Array.from({ length: 100 }, () => `${r.int(-8, 7)} 4`)));
                return t;
            },
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 300) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) { const x = t[1 + 2 * i], k = t[2 + 2 * i]; if (!calk(k, 2, 32) || !calk(x, -(2 ** (k - 1)), 2 ** (k - 1) - 1)) return 'x k'; } return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(u2(t[1 + 2 * i], Number(t[2 + 2 * i]))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        int k;
        cin >> x >> k;
        long long v = x;
        if (v < 0) v += 1LL << k;
        string s = "";
        for (int i = 0; i < k; i++) {
            s = char('0' + v % 2) + s;
            v /= 2;
        }
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-z-kodu-u2', krok: 5, level: 'srednie',
            title: 'Odczytaj kod U2',
            short: 'Odczytaj napis jak zwykłą liczbę dwójkową, a jeśli pierwszy bit to 1 — odejmij 2ᵏ. 1111 to −1, 1000 to −8.',
            tags: ['waga −2ᵏ⁻¹', 'odejmij 2ᵏ', 'pierwszy bit = znak'],
            statement: ['Dla każdego napisu z zer i jedynek długości k wypisz liczbę, którą zapisuje w kodzie U2 na k bitach.',
                'Najprościej: odczytaj napis jak zwykłą liczbę dwójkową. Jeśli pierwszy (najstarszy) bit to 0, to już wynik. Jeśli 1 — liczba jest ujemna i od odczytanej wartości trzeba odjąć 2ᵏ, bo ten bit naprawdę waży −2ᵏ⁻¹, a nie +2ᵏ⁻¹.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jeden napis z zer i jedynek.'],
            output_format: ['q wierszy — wartość każdego kodu U2.'],
            constraints: ['1 ≤ q ≤ 300', 'Każdy napis ma od 2 do 62 znaków.'],
            examples: [{ input: '4\n0101\n1111\n1000\n11111110', note: '0101 zaczyna się od zera, więc to zwykłe 5. 1111 to 15 − 16 = −1. 1000 to 8 − 16 = −8 — najmniejsza liczba na 4 bitach. 11111110 to 254 − 256 = −2.' }],
            hint: R`long long v = 0; for (char c : s) v = v * 2 + (c - '0'); if (s[0] == '1') v -= 1LL << s.size();. Napis ma najwyżej 62 znaki, więc 2⁶² mieści się w long long.`,
            tests: (r) => [lista(['00', '01', '10', '11', '0101', '1111', '1000', '11111110', '10000000', '01111111', '1' + '0'.repeat(61), '1'.repeat(62), '0' + '1'.repeat(61)]),
                lista(Array.from({ length: 300 }, () => losBin(r, r.int(2, 62), true))), lista(Array.from({ length: 50 }, () => losBin(r, 8, true)))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((s) => czy01(s, 62) && s.length >= 2) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => String(zU2(s))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string s;
        cin >> s;
        long long v = 0;
        for (char c : s) v = v * 2 + (c - '0');
        if (s[0] == '1') v -= 1LL << s.size();
        cout << v << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-symulator-przepelnienia', krok: 5, level: 'srednie',
            title: 'Symulator przepełnienia',
            short: 'Co naprawdę wyjdzie w int, gdy wynik nie mieści się w 32 bitach? Policz wynik w long long i „zawiń” go do zakresu int.',
            tags: ['przepełnienie', 'zawijanie mod 2³²', 'int kontra long long'],
            statement: ['Gdy wynik działania na int nie mieści się w 32 bitach, procesor zostawia tylko 32 najmłodsze bity, a C++ czyta je w kodzie U2. Dlatego 2 147 483 647 + 1 daje −2 147 483 648, a 100 000 · 100 000 daje 1 410 065 408. (Formalnie przepełnienie int to w C++ błąd, ale na naszych komputerach wygląda dokładnie tak.)',
                'Dla każdego działania a op b na liczbach typu int wypisz dwie liczby: wynik, jaki da int, i prawdziwy wynik.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy działanie: liczba a, znak +, - albo * i liczba b, oddzielone spacjami.'],
            output_format: ['q wierszy: wynik w int i prawdziwy wynik, oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', 'a i b mieszczą się w int: −2 147 483 648 ≤ a, b ≤ 2 147 483 647.'],
            examples: [{ input: '3\n2147483647 + 1\n100000 * 100000\n5 - 7', note: 'INT_MAX + 1 przekręca się na najmniejszego int-a. 10¹⁰ = 2 · 2³² + 1 410 065 408 — zostaje reszta 1 410 065 408 (mniejsza od 2³¹, więc dodatnia). 5 − 7 = −2 mieści się bez problemu.' }],
            hint: R`Policz prawdziwy wynik y w long long (zrzutuj a na long long przed mnożeniem!). Zawinięcie: long long m = 1LL << 32; long long x = ((y % m) + m) % m; if (x >= (1LL << 31)) x -= m;.`,
            tests: (r) => {
                const g = ['2147483647', '-2147483648', '1', '-1', '0', '65536', '46341', '100000', '-100000'];
                const t = [lista(['2147483647 + 1', '-2147483648 - 1', '100000 * 100000', '5 - 7', '65536 * 65536', '46341 * 46341', '-2147483648 * -1', '-2147483648 * -2147483648', '2147483647 * 2147483647', '0 * -5'])];
                t.push(lista(Array.from({ length: 1000 }, () => { const a = r() < 0.3 ? r.pick(g) : String(r.int(-2147483648, 2147483647)); const b = r() < 0.3 ? r.pick(g) : String(r.int(-2147483648, 2147483647)); return `${a} ${r.pick(['+', '-', '*'])} ${b}`; })));
                t.push(lista(Array.from({ length: 300 }, () => `${r.int(-50000, 50000)} ${r.pick(['+', '-', '*'])} ${r.int(-50000, 50000)}`)));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => { const p = w.split(' '); return p.length === 3 && ['+', '-', '*'].includes(p[1]) && calkB(p[0], -2147483648n, 2147483647n) && calkB(p[2], -2147483648n, 2147483647n); }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [a, op, b] = w.split(' '); const x = B(a), y = B(b); const v = op === '+' ? x + y : op === '-' ? x - y : x * y; return `${zawin(v, 32)} ${v}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    long long m = 1LL << 32;
    for (int t = 0; t < q; t++) {
        long long a, b;
        char op;
        cin >> a >> op >> b;
        long long y;
        if (op == '+') y = a + b;
        else if (op == '-') y = a - b;
        else y = a * b;
        long long x = ((y % m) + m) % m;
        if (x >= (1LL << 31)) x -= m;
        cout << x << " " << y << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-napis-w-bitach', krok: 5, level: 'latwe',
            title: 'Napis w bitach',
            short: 'Każdy znak to jeden bajt: 8 bitów. Wypisz kod każdego znaku dwójkowo, na 8 cyfrach — A to 01000001.',
            tags: ['char to liczba', '8 bitów', 'getline'],
            statement: ['Dla komputera litera to też liczba — jej kod ASCII. Wielka litera A ma kod 65, czyli dwójkowo 01000001, spacja ma kod 32, a cyfra 0 — kod 48. Każdy znak zajmuje jeden bajt, czyli 8 bitów.',
                'Wczytaj cały wiersz tekstu (razem ze spacjami) i wypisz kod każdego znaku zapisany dwójkowo na dokładnie 8 bitach.'],
            input_format: ['Jeden wiersz tekstu: litery, cyfry, spacje i znaki przestankowe (zwykłe znaki ASCII, bez polskich liter).'],
            output_format: ['Jeden wiersz: kody kolejnych znaków, każdy na 8 bitach, oddzielone spacjami.'],
            constraints: ['Wiersz ma od 1 do 200 znaków i nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: 'Ala ma kota', note: 'A = 65 = 01000001, l = 108 = 01101100, a = 97 = 01100001, spacja = 32 = 00100000 i tak dalej. Zauważ, że wielka i mała litera różnią się jednym bitem — tym o wadze 32.' },
                { input: 'C++', note: 'C = 67, a plus ma kod 43 = 00101011.' }],
            hint: R`string s; getline(cin, s); a potem dla każdego znaku: int v = c; i zapis na 8 bitach pętlą (jak w zadaniu „Zapis na k bitach”). Krócej: cout << bitset<8>(c);.`,
            tests: (r) => ['A', 'a', '0', 'Ala ma kota', 'C++', 'Hello, World!', zdanieAscii(r, 30).slice(0, 200).trim(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789', '~!@#$%^&*()_+{}|:<>?', zdanieAscii(r, 5)],
            check: (inp) => { const s = inp; return s.length >= 1 && s.length <= 200 && /^[\x20-\x7e]+$/.test(s) && s[0] !== ' ' && s[s.length - 1] !== ' ' ? null : 'dane'; },
            solve: (inp) => [...inp].map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    for (int i = 0; i < (int)s.size(); i++) {
        int v = s[i];
        string b = "";
        for (int k = 0; k < 8; k++) {
            b = char('0' + v % 2) + b;
            v /= 2;
        }
        if (i) cout << " ";
        cout << b;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-tajna-wiadomosc', krok: 5, level: 'srednie',
            title: 'Tajna wiadomość',
            short: 'Długi napis z zer i jedynek dziel na kawałki po 8 bitów. Każdy kawałek to kod jednego znaku — odczytaj go i wypisz jako char.',
            tags: ['po 8 bitów', 'char(kod)', 'substr'],
            statement: ['Szpieg przesłał wiadomość jako jeden długi ciąg zer i jedynek. Każdy znak wiadomości zapisał jako swój kod ASCII na 8 bitach, a kody zakodowanych znaków skleił bez odstępów.',
                'Odczytaj wiadomość: podziel ciąg na kawałki po 8 bitów, każdy kawałek zamień na liczbę, a liczbę — na znak.'],
            input_format: ['Jeden wiersz: ciąg zer i jedynek o długości podzielnej przez 8.'],
            output_format: ['Odczytana wiadomość (zwykłe znaki ASCII: litery, cyfry, spacje i znaki przestankowe).'],
            constraints: ['Ciąg ma od 8 do 4000 znaków.', 'Wiadomość nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: '010010000110100100100001', note: 'Kawałki: 01001000 = 72 = H, 01101001 = 105 = i, 00100001 = 33 = !. Wiadomość to Hi!.' }],
            hint: R`for (int i = 0; i < s.size(); i += 8) { int v = 0; for (int j = i; j < i + 8; j++) v = v * 2 + (s[j] - '0'); cout << char(v); }. char(v) wypisuje znak o kodzie v, a nie liczbę.`,
            tests: (r) => { const kod = (s) => [...s].map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(''); return ['A', 'Hi!', 'Ala ma kota', zdanieAscii(r, 40).slice(0, 500).trim(), 'Spotkanie o 7:30 przy moscie.', '0123456789', zdanieAscii(r, 8) + '?'].map(kod); },
            check: (inp) => { const s = inp.trim(); if (!czy01(s, 4000) || s.length % 8) return 'dane'; for (let i = 0; i < s.length; i += 8) { const v = parseInt(s.slice(i, i + 8), 2); if (v < 32 || v > 126) return 'znak'; } return null; },
            solve: (inp) => { const s = inp.trim(); let o = ''; for (let i = 0; i < s.length; i += 8) o += String.fromCharCode(parseInt(s.slice(i, i + 8), 2)); return o; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    for (int i = 0; i < (int)s.size(); i += 8) {
        int v = 0;
        for (int j = i; j < i + 8; j++) v = v * 2 + (s[j] - '0');
        cout << char(v);
    }
    cout << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · operatory bitowe
        {
            id: 'ld-and-or-xor', krok: 6, level: 'latwe',
            title: 'AND, OR i XOR',
            short: 'Dla każdej pary wypisz a & b, a | b oraz a ^ b. Operatory działają na każdej parze bitów osobno — i na long long też.',
            tags: ['&', '|', '^'],
            statement: ['Operatory bitowe działają na każdej parze bitów osobno: a & b ma jedynkę tam, gdzie obie liczby mają jedynkę; a | b — tam, gdzie choć jedna ma jedynkę; a ^ b — tam, gdzie dokładnie jedna ma jedynkę (czyli tam, gdzie bity są różne).',
                'Dla każdej pary liczb wypisz trzy wyniki: a & b, a | b i a ^ b.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy: trzy liczby a & b, a | b i a ^ b oddzielone spacjami.'],
            constraints: ['1 ≤ q ≤ 400', '0 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '2\n12 10\n5 3', note: '12 = 1100, 10 = 1010. Wspólna jedynka tylko na pozycji o wadze 8: 12 & 10 = 8. Jedynki w którejkolwiek: 1110 = 14. Różne bity: 0110 = 6. Dla 5 = 101 i 3 = 011: 1, 7 i 6.' }],
            hint: R`long long a, b; cin >> a >> b; cout << (a & b) << " " << (a | b) << " " << (a ^ b) << "\n";. Nawiasy są konieczne — bez nich cout << a & b się nie skompiluje.`,
            tests: (r) => [lista(['12 10', '5 3', '0 0', '0 7', '7 7', '1000000000000000000 999999999999999999', `${(1n << 59n) - 1n} ${1n << 59n}`]), lista(pary(r, 400, 0n, MAX18)), lista(Array.from({ length: 300 }, () => `${r.int(0, 255)} ${r.int(0, 255)}`))],
            check: (inp) => sprPary(inp, 400, 0n, MAX18),
            solve: (inp) => { const t = toks(inp).map(B); const o = []; for (let i = 0; i < Number(t[0]); i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; o.push(`${a & b} ${a | b} ${a ^ b}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long a, b;
        cin >> a >> b;
        cout << (a & b) << " " << (a | b) << " " << (a ^ b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-przesuniecia', krok: 6, level: 'latwe',
            title: 'Przesunięcia w lewo i w prawo',
            short: 'x << k mnoży przez 2ᵏ, x >> k dzieli przez 2ᵏ (bez reszty). Gdy wynik przekracza int, przesuwaj long long.',
            tags: ['<< mnoży', '>> dzieli', 'long long przed przesunięciem'],
            statement: ['Przesunięcie bitów w lewo o k miejsc (x << k) dopisuje k zer z prawej strony zapisu dwójkowego, czyli mnoży liczbę przez 2ᵏ. Przesunięcie w prawo (x >> k) skreśla k ostatnich cyfr, czyli dzieli przez 2ᵏ i odrzuca resztę.',
                'Dla każdej pary x, k wypisz x << k oraz x >> k. Uwaga: x << k może wyjść poza zakres int, więc x musi być typu long long, zanim go przesuniesz.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby x i k.'],
            output_format: ['q wierszy: x << k i x >> k oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ x ≤ 10⁹', '0 ≤ k ≤ 30'],
            examples: [{ input: '3\n5 2\n13 1\n1000000000 30', note: '5 = 101: w lewo o 2 to 10100 = 20, w prawo o 2 to 1. 13 = 1101: 11010 = 26 i 110 = 6. Miliard razy 2³⁰ to ponad 10¹⁸ — w int by się nie zmieścił.' }],
            hint: R`long long x; int k; cin >> x >> k; cout << (x << k) << " " << (x >> k) << "\n";. Gdyby x było int-em, x << 30 przekręciłoby się — przesuwa się w typie lewej strony.`,
            tests: (r) => [lista(['5 2', '13 1', '0 30', '1 0', '1 30', '1000000000 30', '1000000000 0', '7 3', '1023 10']), lista(Array.from({ length: 1000 }, () => `${r.int(0, 1e9)} ${r.int(0, 30)}`)), lista(Array.from({ length: 31 }, (_, k) => `${r.int(0, 100)} ${k}`))],
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 1000) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) if (!calk(t[1 + 2 * i], 0, 1e9) || !calk(t[2 + 2 * i], 0, 30)) return 'x k'; return null; },
            solve: (inp) => { const t = toks(inp).map(B); const o = []; for (let i = 0; i < Number(t[0]); i++) { const x = t[1 + 2 * i], k = t[2 + 2 * i]; o.push(`${x << k} ${x >> k}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        int k;
        cin >> x >> k;
        cout << (x << k) << " " << (x >> k) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-potega-dwojki', krok: 6, level: 'latwe',
            title: 'Czy to potęga dwójki',
            short: 'Potęga dwójki ma jedną jedynkę. Odjęcie 1 zamienia ją na zero, a zera za nią — na jedynki, więc x & (x − 1) daje 0.',
            tags: ['x & (x - 1)', 'nawiasy', 'jedna jedynka'],
            statement: ['Potęga dwójki ma w zapisie dwójkowym dokładnie jedną jedynkę: 8 = 1000, 64 = 1000000. Odejmij od niej 1: jedynka zmienia się w zero, a wszystkie zera za nią — w jedynki (8 − 1 = 7 = 0111). Te dwie liczby nie mają ani jednej wspólnej jedynki, więc x & (x − 1) = 0. Dla każdej innej dodatniej liczby najstarsza jedynka zostaje i wynik nie jest zerem.',
                'Dla każdej liczby x sprawdź, czy jest potęgą dwójki.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba x.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '5\n8\n12\n1\n1024\n1023', note: '8 & 7 = 1000 & 0111 = 0 — TAK. 12 & 11 = 1100 & 1011 = 1000 ≠ 0 — NIE. 1 = 2⁰ — TAK. 1024 = 2¹⁰ — TAK. 1023 to same jedynki — NIE.' }],
            hint: R`if ((x & (x - 1)) == 0) cout << "TAK\n"; — nawiasy wokół x & (x - 1) są konieczne. Bez nich x & (x - 1) == 0 znaczy x & ((x - 1) == 0), bo == ma wyższy priorytet niż &.`,
            tests: (r) => {
                const p = []; for (let k = 0; k < 60; k++) { p.push(String(1n << B(k))); if (k > 1) p.push(String((1n << B(k)) - 1n)); p.push(String((1n << B(k)) + 1n)); }
                return [lista(Array.from({ length: 40 }, (_, i) => String(i + 1))), lista(p), lista(Array.from({ length: 1000 }, () => String(r.big(1n, MAX18)))), lista(['1000000000000000000', String(1n << 59n), '576460752303423488'])];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && zakresB(t.slice(1), 1n, MAX18) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((x) => ((B(x) & (B(x) - 1n)) === 0n ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        cin >> x;
        if ((x & (x - 1)) == 0) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-samotna-liczba', krok: 6, level: 'latwe',
            title: 'Samotna liczba',
            short: 'Każda liczba występuje dwa razy, tylko jedna — raz. XOR wszystkich: pary się znoszą (a ^ a = 0) i zostaje samotna.',
            tags: ['a ^ a = 0', 'a ^ 0 = a', 'kolejność bez znaczenia'],
            statement: ['W ciągu n liczb każda wartość występuje dokładnie dwa razy — z wyjątkiem jednej, która występuje raz. Znajdź ją.',
                'Można sortować albo liczyć mapą, ale jest sztuczka z XOR: a ^ a = 0, a ^ 0 = a, a kolejność działań nie ma znaczenia. Jeśli zXOR-ujesz wszystkie liczby, każda para się zniesie i zostanie samotna liczba. Wystarczy jedna zmienna, bez żadnej tablicy.'],
            input_format: ['W pierwszym wierszu nieparzysta liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba — ta, która występuje tylko raz.'],
            constraints: ['1 ≤ n ≤ 9999, n nieparzyste', 'Liczby są z przedziału od 1 do 10⁹.'],
            examples: [{ input: '7\n4 9 2 9 4 7 2', note: '4 ^ 9 ^ 2 ^ 9 ^ 4 ^ 7 ^ 2: obie czwórki, dziewiątki i dwójki się znoszą, zostaje 7.' }],
            hint: R`int w = 0; for (int i = 0; i < n; i++) { int x; cin >> x; w ^= x; } cout << w;. Zapis w ^= x znaczy w = w ^ x, tak jak w += x.`,
            tests: (r) => {
                const gen = (n2, lo, hi) => { const s = new Set(); while (s.size < n2 + 1) s.add(r.int(lo, hi)); const v = [...s]; const sam = v.pop(); return r.shuffle([...v, ...v, sam]); };
                return [[5], gen(0, 1, 10), gen(1, 1, 10), gen(3, 1, 9), gen(4999, 1, 1e9), gen(100, 1, 200), gen(2000, 1, 1e9), [1000000000, 1, 1]].map((a) => `${a.length}\n${a.join(' ')}`);
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 9999) || n % 2 === 0 || t.length !== n + 1 || !t.slice(1).every((x) => calk(x, 1, 1e9))) return 'dane'; const c = new Map(); for (const x of t.slice(1)) c.set(x, (c.get(x) || 0) + 1); const raz = [...c.values()].filter((v) => v === 1).length; return raz === 1 && [...c.values()].every((v) => v === 1 || v === 2) ? null : 'pary'; },
            solve: (inp) => String(nums(inp).slice(1).reduce((w, x) => w ^ x, 0)),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int w = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        w ^= x;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-szyfr-xor', krok: 6, level: 'latwe',
            title: 'Szyfr XOR',
            short: 'Każdy kod znaku XOR-owano z kluczem K. Żeby odszyfrować, XOR-uj jeszcze raz z tym samym K — (c ^ K) ^ K = c.',
            tags: ['(c ^ K) ^ K = c', 'char(kod)', 'szyfrowanie'],
            statement: ['Szyfr XOR jest prosty: każdy znak wiadomości zamienia się na liczbę (kod ASCII) i XOR-uje z tajnym kluczem K. Wychodzą liczby, które wyglądają przypadkowo.',
                'Odszyfrowanie robi się tak samo: wystarczy jeszcze raz zXOR-ować z tym samym kluczem, bo (c ^ K) ^ K = c ^ (K ^ K) = c ^ 0 = c. Odczytaj wiadomość.'],
            input_format: ['W pierwszym wierszu klucz K i liczba n.', 'W drugim wierszu n liczb — zaszyfrowane kody kolejnych znaków.'],
            output_format: ['Odszyfrowana wiadomość w jednym wierszu.'],
            constraints: ['0 ≤ K ≤ 255', '1 ≤ n ≤ 1000', 'Po odszyfrowaniu wychodzą zwykłe znaki ASCII (litery, cyfry, spacje, znaki przestankowe); wiadomość nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: '42 3\n98 67 11', note: '98 ^ 42 = 72 (H), 67 ^ 42 = 105 (i), 11 ^ 42 = 33 (!). Wiadomość to Hi!.' }],
            hint: R`int K, n; cin >> K >> n; for (…) { int x; cin >> x; cout << char(x ^ K); }. char(…) zamienia liczbę na znak — bez tego zobaczysz liczby zamiast liter.`,
            tests: (r) => { const sz = (s, K) => `${K} ${s.length}\n${[...s].map((c) => c.charCodeAt(0) ^ K).join(' ')}`; return [sz('Hi!', 42), sz('A', 0), sz('Ala ma kota', 255), sz('Tajne haslo: XOR-123', 7), sz(zdanieAscii(r, 100).slice(0, 1000).trim(), r.int(0, 255)), sz(zdanieAscii(r, 10), 32), sz('0123456789', 15)]; },
            check: (inp) => { const t = nums(inp); const [K, n] = t; if (!calk(K, 0, 255) || !calk(n, 1, 1000) || t.length !== n + 2) return 'dane'; const s = t.slice(2).map((x) => x ^ K); return s.every((v) => v >= 32 && v <= 126) && s[0] !== 32 && s[n - 1] !== 32 ? null : 'znaki'; },
            solve: (inp) => { const t = nums(inp); return t.slice(2).map((x) => String.fromCharCode(x ^ t[0])).join(''); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int K, n;
    cin >> K >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        cout << char(x ^ K);
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-odleglosc-hamminga', krok: 6, level: 'latwe',
            title: 'Odległość Hamminga',
            short: 'Na ilu pozycjach bity a i b się różnią? a ^ b ma jedynki dokładnie tam — wystarczy je policzyć.',
            tags: ['a ^ b', 'liczenie jedynek', 'long long'],
            statement: ['Odległość Hamminga dwóch liczb to liczba pozycji, na których ich zapisy dwójkowe mają różne bity. Używa się jej przy przesyłaniu danych: mówi, ile bitów zepsuło się po drodze.',
                'Operator ^ daje jedynkę dokładnie tam, gdzie bity są różne — więc odległość Hamminga to liczba jedynek w a ^ b.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy — odległość Hamminga każdej pary.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n12 10\n7 0\n5 5', note: '12 ^ 10 = 0110 — dwie jedynki, więc 12 i 10 różnią się na dwóch pozycjach. 7 = 111 różni się od zera na trzech pozycjach. Te same liczby — odległość 0.' }],
            hint: R`long long x = a ^ b; int ile = 0; while (x > 0) { ile += x & 1; x >>= 1; }. Albo gotowa funkcja __builtin_popcountll(a ^ b) — z ll na końcu, bo liczby są typu long long.`,
            tests: (r) => [lista(['12 10', '7 0', '5 5', '0 0', '1000000000000000000 0', `${(1n << 59n) - 1n} 0`, `${1n << 59n} ${(1n << 59n) - 1n}`]), lista(pary(r, 1000, 0n, MAX18)), lista(Array.from({ length: 200 }, () => `${r.int(0, 1023)} ${r.int(0, 1023)}`))],
            check: (inp) => sprPary(inp, 1000, 0n, MAX18),
            solve: (inp) => { const t = toks(inp).map(B); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(String(jedynki(t[1 + 2 * i] ^ t[2 + 2 * i]))); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long a, b;
        cin >> a >> b;
        long long x = a ^ b;
        int ile = 0;
        while (x > 0) {
            ile += x & 1;
            x >>= 1;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-daszek-to-nie-potega', krok: 6, level: 'latwe',
            title: 'Daszek to nie potęga',
            short: 'W C++ a ^ b to XOR, a nie a do potęgi b: 2 ^ 3 daje 1, nie 8. Wypisz oba wyniki — XOR i prawdziwą potęgę (liczoną pętlą).',
            tags: ['^ to XOR', 'potęga pętlą', 'nie pow dla liczb całkowitych'],
            statement: ['Na kalkulatorze i w matematyce 2^3 oznacza 2 do potęgi 3, czyli 8. W C++ znak ^ to XOR, więc 2 ^ 3 daje 10 ^ 11 = 01, czyli 1. To jeden z najczęstszych błędów początkujących — kompilator czasem nawet ostrzega: „did you mean 1 << 3?”.',
                'Dla każdej pary a, b wypisz a ^ b (XOR) oraz a do potęgi b. Potęgę licz pętlą na long long — funkcja pow liczy na liczbach z przecinkiem i dla dużych wyników gubi ostatnie cyfry.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy: a ^ b i a do potęgi b, oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ a ≤ 1000', '0 ≤ b ≤ 62', 'a do potęgi b nie przekracza 9 · 10¹⁸ (mieści się w long long).'],
            examples: [{ input: '3\n2 3\n10 2\n3 39', note: '2 ^ 3 = 1, ale 2³ = 8. 10 ^ 2 = 1010 ^ 0010 = 1000 = 8, a 10² = 100. 3³⁹ = 4 052 555 153 018 976 267 — przez pow wyszłoby 4 052 555 153 018 976 256.' }],
            hint: R`long long p = 1; for (int i = 0; i < b; i++) p *= a; i cout << (a ^ b) << " " << p << "\n";. Nawiasy przy a ^ b są potrzebne — bez nich cout << a ^ b się nie skompiluje.`,
            tests: (r) => {
                const pot = (a, b) => B(a) ** B(b);
                const MAXP = 9n * MAX18;
                const losPara = () => { for (;;) { const a = r.int(1, 1000), b = r.int(0, 62); if (pot(a, b) <= MAXP) return `${a} ${b}`; } };
                return [lista(['2 3', '10 2', '3 39', '1 62', '2 62', '1000 6', '7 0', '5 5', '999 6', '6 24']), lista(Array.from({ length: 1000 }, losPara)), lista(Array.from({ length: 63 }, (_, b) => `2 ${b}`))];
            },
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 1000) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 1, 1000) || !calk(b, 0, 62) || B(a) ** B(b) > 9n * MAX18) return 'a b'; } return null; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; o.push(`${a ^ b} ${B(a) ** B(b)}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long a, b;
        cin >> a >> b;
        long long p = 1;
        for (int i = 0; i < b; i++) p *= a;
        cout << (a ^ b) << " " << p << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-dzielenie-a-przesuniecie', krok: 6, level: 'srednie',
            title: 'Dzielenie a przesunięcie',
            short: 'Dla liczb ujemnych x / 2 i x >> 1 dają różne wyniki: −7 / 2 = −3 (w stronę zera), a −7 >> 1 = −4 (w dół). Wypisz oba.',
            tags: ['/ ucina w stronę zera', '>> zaokrągla w dół', 'liczby ujemne'],
            statement: ['Dla liczb nieujemnych x >> k to to samo co x / 2ᵏ. Dla ujemnych — nie! Dzielenie / w C++ ucina część ułamkową w stronę zera: −7 / 2 = −3. Przesunięcie >> zaokrągla zawsze w dół: −7 >> 1 = −4, bo −3,5 zaokrąglone w dół to −4.',
                'Dla każdej pary x, k wypisz x / 2ᵏ (zwykłe dzielenie całkowite w C++) oraz x >> k.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby x i k.'],
            output_format: ['q wierszy: x / 2ᵏ i x >> k, oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁹ ≤ x ≤ 10⁹', '0 ≤ k ≤ 30'],
            examples: [{ input: '4\n-7 1\n7 1\n-1 5\n-8 2', note: '−7 / 2 = −3, ale −7 >> 1 = −4. Dla 7 oba dają 3. −1 / 32 = 0, a −1 >> 5 = −1 (same jedynki w kodzie U2 zostają jedynkami). −8 dzieli się przez 4 bez reszty, więc oba dają −2.' }],
            hint: R`int x, k; cin >> x >> k; cout << x / (1 << k) << " " << (x >> k) << "\n";. Dla k = 30 liczba 1 << 30 mieści się w int, więc tu wystarczy zwykłe 1.`,
            tests: (r) => [lista(['-7 1', '7 1', '-1 5', '-8 2', '0 30', '-1000000000 30', '1000000000 30', '-1 0', '-3 1', '-5 2']), lista(Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(0, 30)}`)), lista(Array.from({ length: 300 }, () => `${r.int(-20, 20)} ${r.int(0, 4)}`))],
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 1000) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) if (!calk(t[1 + 2 * i], -1e9, 1e9) || !calk(t[2 + 2 * i], 0, 30)) return 'x k'; return null; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 0; i < t[0]; i++) { const x = t[1 + 2 * i], k = t[2 + 2 * i]; o.push(`${Math.trunc(x / 2 ** k)} ${x >> k}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        int x, k;
        cin >> x >> k;
        cout << x / (1 << k) << " " << (x >> k) << "\n";
    }
    return 0;
}`,
        },
    ];
};
