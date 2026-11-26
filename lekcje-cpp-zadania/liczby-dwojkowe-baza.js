// Liczby dwójkowe — baza zadań na koniec lekcji: 10 łatwych (bity w prostych przebraniach), 10 średnich (XOR, kody, maski,
// adresy IP, gra Nim) i 8 trudnych (liczenie po bitach do 10¹⁸, największy XOR i suma XOR-ów dla dużych danych z generatora,
// spotkanie w połowie, hetmany na maskach, BFS z kluczami) — a na koniec wielki finał: mały procesor 8-bitowy.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./liczby-dwojkowe-pomoc');
    const { calk, dw, zSystemu, naSystem, naKBitach, jedynki, losBin, czyDw, czy01, calkB, SLOWA, generuj, dobryGen, KOD_GEN } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const B = (x) => BigInt(x);
    const MAX18 = 10n ** 18n;
    const lista = (a) => `${a.length}\n${a.join('\n')}`;
    const zakresB = (t, lo, hi) => t.every((x) => calkB(x, lo, hi));
    const sprLista = (inp, maxQ, lo, hi) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, maxQ) && t.length === q + 1 && zakresB(t.slice(1), lo, hi) ? null : 'dane'; };
    const losoweB = (r, ile, lo, hi) => Array.from({ length: ile }, () => String(r.big(lo, hi)));
    const jedynkiN = (x) => { let c = 0; while (x > 0) { c += x & 1; x >>>= 1; } return c; };
    const pad2 = (x) => String(x).padStart(2, '0');
    const hex2 = (x) => x.toString(16).toUpperCase().padStart(2, '0');
    const zdanieAscii = (r, slowa) => { const w = Array.from({ length: slowa }, () => r.pick(SLOWA)); const s = w.join(' '); return s[0].toUpperCase() + s.slice(1); };

    return [
        // ================================================================ BAZA · łatwe
        {
            id: 'ld-b-zegar-dwojkowy', krok: 9, level: 'latwe',
            title: 'Zegar dwójkowy',
            short: 'Zegar pokazuje godziny na 5 żarówkach, a minuty i sekundy na 6. Zamień każdą godzinę HH:MM:SS na trzy rzędy bitów.',
            tags: ['zapis na k bitach', 'wczytywanie z dwukropkami', 'ile bitów wystarczy'],
            statement: ['Zegar dwójkowy pokazuje czas trzema rzędami żarówek. Godzina (od 0 do 23) mieści się na 5 bitach, bo 2⁵ = 32 > 23, a minuty i sekundy (od 0 do 59) — na 6 bitach, bo 2⁶ = 64 > 59.',
                'Dla każdej godziny w postaci HH:MM:SS wypisz trzy zapisy dwójkowe: godzinę na dokładnie 5 bitach oraz minuty i sekundy na dokładnie 6 bitach.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy czas w postaci HH:MM:SS (zawsze po dwie cyfry).'],
            output_format: ['q wierszy: trzy zapisy dwójkowe (5, 6 i 6 bitów) oddzielone spacjami.'],
            constraints: ['1 ≤ q ≤ 300', '0 ≤ HH ≤ 23, 0 ≤ MM ≤ 59, 0 ≤ SS ≤ 59'],
            examples: [{ input: '2\n13:45:07\n00:00:59', note: '13 = 01101, 45 = 101101, 7 = 000111. Północ to same zera, a 59 sekund to 111011.' }],
            hint: R`int g, m, s; char c; cin >> g >> c >> m >> c >> s; — dwukropki wczytują się do zmiennej c i można o nich zapomnieć. Potem funkcja string bity(int x, int k) z pętlą wykonywaną k razy.`,
            tests: (r) => { const cz = () => `${pad2(r.int(0, 23))}:${pad2(r.int(0, 59))}:${pad2(r.int(0, 59))}`; return [lista(['13:45:07', '00:00:59', '23:59:59', '00:00:00', '12:00:00', '01:02:03']), lista(Array.from({ length: 300 }, cz)), lista(Array.from({ length: 24 }, (_, g) => `${pad2(g)}:${pad2(g * 2)}:${pad2(59 - g)}`))]; },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((w) => { const m = w.match(/^(\d\d):(\d\d):(\d\d)$/); return m && Number(m[1]) <= 23 && Number(m[2]) <= 59 && Number(m[3]) <= 59; }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [g, m, s] = w.split(':').map(Number); return `${naKBitach(g, 5)} ${naKBitach(m, 6)} ${naKBitach(s, 6)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string bity(int x, int k) {
    string s = "";
    for (int i = 0; i < k; i++) {
        s = char('0' + x % 2) + s;
        x /= 2;
    }
    return s;
}
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        int g, m, s;
        char c;
        cin >> g >> c >> m >> c >> s;
        cout << bity(g, 5) << " " << bity(m, 6) << " " << bity(s, 6) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-najdluzsza-seria', krok: 9, level: 'latwe',
            title: 'Najdłuższa seria jedynek',
            short: 'Ile najwięcej jedynek stoi obok siebie w zapisie dwójkowym? 1101110 ma serię trzech. Licz bieżącą serię i zapamiętuj rekord.',
            tags: ['bieżąca seria', 'rekord', 'kolejne bity'],
            statement: ['Dla każdej liczby n wypisz długość najdłuższej serii jedynek stojących obok siebie w jej zapisie dwójkowym.',
                'Bity możesz odczytywać od końca (n % 2, n /= 2). Trzymaj długość bieżącej serii: przy jedynce zwiększ ją o 1 i sprawdź rekord, przy zerze — wyzeruj.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — długość najdłuższej serii jedynek.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n110\n7\n1024', note: '110 = 1101110 — najdłuższa seria to trzy jedynki. 7 = 111 — trzy. 1024 = 10000000000 — pojedyncza jedynka.' }],
            hint: R`int seria = 0, rekord = 0; while (n > 0) { if (n % 2 == 1) { seria++; rekord = max(rekord, seria); } else seria = 0; n /= 2; }.`,
            tests: (r) => [lista(Array.from({ length: 40 }, (_, i) => String(i + 1))), lista(losoweB(r, 1000, 1n, MAX18)), lista(['1000000000000000000', String((1n << 59n) - 1n), String(((1n << 30n) - 1n) << 20n), String(0b101010101n)]), lista(Array.from({ length: 300 }, () => String(zSystemu(losBin(r, r.int(1, 59), false, 0.8)))))],
            check: (inp) => sprLista(inp, 1000, 1n, MAX18),
            solve: (inp) => toks(inp).slice(1).map((x) => String(Math.max(...dw(x).split('0').map((s) => s.length)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        int seria = 0, rekord = 0;
        while (n > 0) {
            if (n % 2 == 1) {
                seria++;
                rekord = max(rekord, seria);
            } else seria = 0;
            n /= 2;
        }
        cout << rekord << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-zera-w-zapisie', krok: 9, level: 'latwe',
            title: 'Zgaszone żarówki',
            short: 'Ile zer jest w zapisie dwójkowym n (bez zer na początku)? Zero ma jedną cyfrę — i jest nią zero.',
            tags: ['liczba cyfr − jedynki', 'zero', 'n % 2'],
            statement: ['Dla każdej liczby n wypisz, ile zer jest w jej zapisie dwójkowym bez zer na początku — czyli ile żarówek jest zgaszonych między najstarszą zapaloną a końcem rzędu.',
                'Uwaga na zero: jego zapis to 0, więc ma jedno zero.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — liczba zer w zapisie dwójkowym.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n10\n7\n0\n64', note: '10 = 1010 ma dwa zera. 7 = 111 nie ma żadnego. 0 to jedno zero. 64 = 1000000 — sześć zer.' }],
            hint: R`if (n == 0) wynik = 1; else { while (n > 0) { if (n % 2 == 0) ile++; n /= 2; } }. Albo: liczba cyfr minus liczba jedynek.`,
            tests: (r) => [lista(Array.from({ length: 40 }, (_, i) => String(i))), lista(losoweB(r, 1000, 0n, MAX18)), lista(['0', '1000000000000000000', String(1n << 59n), String((1n << 59n) - 1n)])],
            check: (inp) => sprLista(inp, 1000, 0n, MAX18),
            solve: (inp) => toks(inp).slice(1).map((x) => String([...dw(x)].filter((c) => c === '0').length)).join('\n'),
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
        if (n == 0) ile = 1;
        while (n > 0) {
            if (n % 2 == 0) ile++;
            n /= 2;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-najblizsza-potega', krok: 9, level: 'latwe',
            title: 'Najbliższa potęga dwójki w górę',
            short: 'Najmniejsza potęga dwójki, która nie jest mniejsza od n. Podwajaj p od 1, dopóki p < n — dla 10¹⁸ dojdziesz do 2⁶⁰.',
            tags: ['podwajanie', 'potęga ≥ n', 'long long'],
            statement: ['Programy często rezerwują pamięć w kawałkach, których rozmiar jest potęgą dwójki. Dla każdej liczby n wypisz najmniejszą potęgę dwójki, która jest większa albo równa n.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — najmniejsza potęga dwójki ≥ n.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n5\n8\n1\n1000', note: 'Dla 5 to 8. Ósemka sama jest potęgą dwójki. Dla 1 to 2⁰ = 1. Dla 1000 to 1024.' }],
            hint: R`long long p = 1; while (p < n) p *= 2;. Jeśli n jest potęgą dwójki — (n & (n - 1)) == 0 — wynik to samo n.`,
            tests: (r) => { const p = []; for (let k = 0; k < 60; k++) { p.push(String(1n << B(k))); p.push(String((1n << B(k)) + 1n)); } return [lista(Array.from({ length: 40 }, (_, i) => String(i + 1))), lista(p), lista(losoweB(r, 1000, 1n, MAX18)), lista(['1000000000000000000', String((1n << 59n) + 1n)])]; },
            check: (inp) => sprLista(inp, 1000, 1n, MAX18),
            solve: (inp) => toks(inp).slice(1).map((x) => { let p = 1n; while (p < B(x)) p *= 2n; return String(p); }).join('\n'),
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
        while (p < n) p *= 2;
        cout << p << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-kalkulator-dwoch-przyciskow', krok: 9, level: 'latwe',
            title: 'Kalkulator z dwoma przyciskami',
            short: 'Kalkulator ma tylko +1 i ×2 i startuje od zera. Ile najmniej naciśnięć, żeby dostać n? Odpowiedź siedzi w zapisie dwójkowym n.',
            tags: ['czytanie bitów od lewej', 'liczba cyfr + jedynki', 'od tyłu: −1 i :2'],
            statement: ['Zepsuty kalkulator ma tylko dwa przyciski: +1 i ×2. Na ekranie jest 0. Jaka jest najmniejsza liczba naciśnięć, po której na ekranie będzie n?',
                'Pomyśl po dwójkowemu: ×2 dopisuje zero na końcu zapisu, a +1 zamienia końcowe zero w jedynkę. Najlepiej budować n od najstarszej cyfry: pierwszą jedynkę daje +1, a każda następna cyfra to ×2, po którym — jeśli cyfra jest jedynką — jeszcze +1. Możesz też iść od tyłu: z n parzystego cofasz się przez :2, z nieparzystego — przez −1, aż dojdziesz do zera.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — najmniejsza liczba naciśnięć.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n5\n8\n0\n1', note: '5 = 101: +1 (1), ×2 (2), ×2 (4), +1 (5) — 4 naciśnięcia. 8 = 1000: +1, potem trzy razy ×2 — też 4. Dla 0 nic nie trzeba naciskać, a 1 to jedno +1.' }],
            hint: R`Od tyłu: while (n > 0) { if (n % 2 == 1) n -= 1; else n /= 2; ile++; }. Każde −1 to jedna jedynka, a każde :2 — jedna cyfra poza pierwszą.`,
            tests: (r) => [lista(Array.from({ length: 40 }, (_, i) => String(i))), lista(losoweB(r, 1000, 0n, MAX18)), lista(['1000000000000000000', String((1n << 59n) - 1n), String(1n << 59n), '0'])],
            check: (inp) => sprLista(inp, 1000, 0n, MAX18),
            solve: (inp) => toks(inp).slice(1).map((x) => { const n = B(x); return n === 0n ? '0' : String(dw(n).length - 1 + jedynki(n)); }).join('\n'),
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
            if (n % 2 == 1) n -= 1;
            else n /= 2;
            ile++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-wielkie-i-male', krok: 9, level: 'latwe',
            title: 'Wielkie i małe litery',
            short: 'Wielka i mała litera różnią się jednym bitem — tym o wadze 32. Zamień wielkość każdej litery jednym XOR-em: c ^ 32.',
            tags: ['c ^ 32', 'bit o wadze 32', 'tylko litery'],
            statement: ['Kod litery A to 65 = 01000001, a litery a — 97 = 01100001. Różnią się dokładnie jednym bitem, tym o wadze 32. Tak jest z każdą literą alfabetu łacińskiego, więc przełączenie tego bitu (c ^ 32) zamienia wielką literę na małą i małą na wielką.',
                'Wczytaj wiersz tekstu i zamień wielkość każdej litery. Pozostałe znaki (cyfry, spacje, znaki przestankowe) zostaw bez zmian — dla nich XOR z 32 dałby bzdury.'],
            input_format: ['Jeden wiersz tekstu ze zwykłych znaków ASCII.'],
            output_format: ['Ten sam wiersz z zamienioną wielkością liter.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków i nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: 'Ala ma Kota, 123!', note: 'Ala zmienia się w aLA, ma — w MA, a Kota — w kOTA. Cyfry, przecinek, spacje i wykrzyknik zostają bez zmian.' }],
            hint: R`string s; getline(cin, s); for (char &c : s) if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) c ^= 32;. Znak & przy char &c sprawia, że zmieniasz litery w samym napisie.`,
            tests: (r) => ['A', 'z', 'Ala ma Kota, 123!', 'HELLO world', '@[`{', zdanieAscii(r, 150).slice(0, 1000).trim(), 'aBcDeFgHiJkLmNoPqRsTuVwXyZ', zdanieAscii(r, 6).toUpperCase() + ' 2024'],
            check: (inp) => (inp.length >= 1 && inp.length <= 1000 && /^[\x20-\x7e]+$/.test(inp) && inp[0] !== ' ' && inp[inp.length - 1] !== ' ' ? null : 'dane'),
            solve: (inp) => [...inp].map((c) => (/[A-Za-z]/.test(c) ? String.fromCharCode(c.charCodeAt(0) ^ 32) : c)).join(''),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    for (char &c : s)
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) c ^= 32;
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-mieszanie-kolorow', krok: 9, level: 'latwe',
            title: 'Mieszanie kolorów',
            short: 'Kolor #RRGGBB to jedna 24-bitowa liczba. Wytnij kanały przesunięciem i & 255, uśrednij, sklej z powrotem przesunięciami i |.',
            tags: ['(c >> 16) & 255', 'sklejanie przez << i |', 'hex na 2 cyfrach'],
            statement: ['Kolor #RRGGBB to jedna liczba 24-bitowa: czerwony zajmuje bity 16–23, zielony 8–15, a niebieski 0–7. Kanał wyciąga się przesunięciem i maską: czerwony to (c >> 16) & 255, zielony (c >> 8) & 255, niebieski c & 255. Z kanałów skleja się kolor z powrotem: (r << 16) | (g << 8) | b.',
                'Dla każdej pary kolorów wypisz ich mieszankę: każdy kanał to średnia z obu kolorów zaokrąglona w dół. Wynik wypisz w postaci #RRGGBB wielkimi literami (zawsze po dwie cyfry na kanał).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwa kolory #RRGGBB oddzielone spacją (litery wielkie albo małe).'],
            output_format: ['q wierszy — kolor mieszanki w postaci #RRGGBB (wielkie litery).'],
            constraints: ['1 ≤ q ≤ 1000'],
            examples: [{ input: '2\n#FF0000 #0000FF\n#ffffff #000001', note: 'Czerwony i niebieski dają (255 + 0) / 2 = 127 = 7F w czerwonym i niebieskim kanale: fioletowy #7F007F. Biały z prawie czarnym: 127, 127 i (255 + 1) / 2 = 128 = 80.' }],
            hint: R`Kolor zamień na liczbę: int c = stoi(s.substr(1), nullptr, 16);. Kanały: (c >> 16) & 255 itd. Wypisywanie: cout << "#" << uppercase << hex << setw(6) << setfill('0') << wynik << dec << "\n"; — setw(6) i setfill('0') dopiszą zera z przodu.`,
            tests: (r) => { const kol = () => '#' + Array.from({ length: 6 }, () => '0123456789ABCDEFabcdef'[r.int(0, 21)]).join(''); return [lista(['#FF0000 #0000FF', '#ffffff #000001', '#000000 #000000', '#FFFFFF #FFFFFF', '#010101 #000000', '#0F0F0F #F0F0F0']), lista(Array.from({ length: 1000 }, () => `${kol()} ${kol()}`))]; },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => /^#[0-9A-Fa-f]{6} #[0-9A-Fa-f]{6}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [a, b] = w.split(' ').map((s) => parseInt(s.slice(1), 16)); let o = '#'; for (const sh of [16, 8, 0]) o += hex2((((a >> sh) & 255) + ((b >> sh) & 255)) >> 1); return o; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string s1, s2;
        cin >> s1 >> s2;
        int a = stoi(s1.substr(1), nullptr, 16);
        int b = stoi(s2.substr(1), nullptr, 16);
        int wynik = 0;
        for (int sh = 16; sh >= 0; sh -= 8) {
            int ka = (a >> sh) & 255, kb = (b >> sh) & 255;
            wynik |= ((ka + kb) / 2) << sh;
        }
        cout << "#" << uppercase << hex << setw(6) << setfill('0') << wynik << dec << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-sortowanie-dwojkowych', krok: 9, level: 'latwe',
            title: 'Sortowanie liczb dwójkowych',
            short: 'Posortuj długie liczby dwójkowe (z zerami z przodu) według wartości. Zwykłe sortowanie napisów tu nie działa: "10" < "9"… i "011" < "10".',
            tags: ['komparator', 'długość po ścięciu zer', 'napisy'],
            statement: ['Posortuj n liczb zapisanych dwójkowo rosnąco według wartości. Liczby mogą mieć do 80 cyfr i zera na początku, więc nie zamienisz ich na long long. Wypisz je dokładnie w takiej postaci, w jakiej je wczytano (razem z zerami z przodu).',
                'Zwykłe sortowanie napisów nie wystarczy: napis 011 jest mniejszy od 1 (bo zaczyna się od zera), choć liczba 3 jest większa od 1. Porównuj tak jak w lekcji: najpierw zetnij zera z przodu, potem dłuższa liczba jest większa, a przy równej długości decyduje porównanie napisów. Jeśli dwie liczby są równe, wcześniej postaw krótszy napis.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy jedna liczba dwójkowa (napis z zer i jedynek).'],
            output_format: ['n wierszy — liczby po posortowaniu, w oryginalnej postaci.'],
            constraints: ['1 ≤ n ≤ 300', 'Każdy napis ma od 1 do 80 znaków.'],
            examples: [{ input: '5\n101\n011\n1\n00\n0001', note: 'Wartości: 5, 3, 1, 0 i 1. Najpierw zero (00), potem dwie jedynki — krótszy napis 1 przed 0001 — potem 011 (3) i 101 (5).' }],
            hint: R`Funkcja string bezZer(const string &s). Komparator: string x = bezZer(a), y = bezZer(b); if (x.size() != y.size()) return x.size() < y.size(); if (x != y) return x < y; return a.size() < b.size();. Użyj go w sort.`,
            tests: (r) => {
                const los = () => '0'.repeat(r.int(0, r() < 0.3 ? 20 : 2)) + losBin(r, r.int(1, 60));
                return ['1\n0', '2\n1\n0', '5\n101\n011\n1\n00\n0001', `300\n${Array.from({ length: 300 }, los).join('\n')}`, `100\n${Array.from({ length: 100 }, () => losBin(r, r.int(1, 6), true)).join('\n')}`, `50\n${Array.from({ length: 50 }, () => '0'.repeat(r.int(0, 20)) + losBin(r, 60)).join('\n')}`];
            },
            check: (inp) => { const l = L(inp); const n = Number(l[0]); return calk(n, 1, 300) && l.length === n + 1 && l.slice(1).every((s) => czy01(s, 80)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).sort((a, b) => { const x = zSystemu(a), y = zSystemu(b); if (x !== y) return x < y ? -1 : 1; return a.length - b.length; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string bezZer(const string &s) {
    int p = 0;
    while (p + 1 < (int)s.size() && s[p] == '0') p++;
    return s.substr(p);
}
int main() {
    int n;
    cin >> n;
    vector<string> v(n);
    for (auto &s : v) cin >> s;
    sort(v.begin(), v.end(), [](const string &a, const string &b) {
        string x = bezZer(a), y = bezZer(b);
        if (x.size() != y.size()) return x.size() < y.size();
        if (x != y) return x < y;
        return a.size() < b.size();
    });
    for (auto &s : v) cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-przelaczniki-na-przedziale', krok: 9, level: 'latwe',
            title: 'Przełączniki na przedziale',
            short: 'Rząd do 60 przełączników to jeden long long. Przełączenie przedziału a..b to XOR z maską jedynek na pozycjach od a do b.',
            tags: ['maska przedziału', '^=', '__builtin_popcountll'],
            statement: ['W rzędzie stoi n przełączników ponumerowanych od 0 do n − 1. Na początku wszystkie są wyłączone. Wykonaj q poleceń: przelacz a b — przełącz wszystkie przełączniki od a do b włącznie; ile — wypisz, ile przełączników jest włączonych; stan — wypisz stan wszystkich przełączników jako napis n znaków (od przełącznika 0 do n − 1, 1 = włączony).',
                'Cały rząd zmieści się w jednej zmiennej long long. Maska z jedynkami na pozycjach od a do b to ((1LL << (b + 1)) − 1) ^ ((1LL << a) − 1): jedynki na pozycjach 0..b bez jedynek na pozycjach 0..a − 1.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy polecenie: przelacz a b, ile albo stan.'],
            output_format: ['Dla każdego polecenia ile i stan — jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ n ≤ 60', '1 ≤ q ≤ 400', '0 ≤ a ≤ b < n', 'Jest co najmniej jedno polecenie ile albo stan.'],
            examples: [{ input: '6 5\nprzelacz 1 3\nstan\nprzelacz 2 5\nile\nstan', note: 'Po pierwszym przełączeniu włączone są 1, 2 i 3: 011100. Drugie przełącza 2–5: 2 i 3 gasną, 4 i 5 się włączają — włączone 1, 4 i 5, czyli 3 przełączniki: 010011.' }],
            hint: R`long long x = 0; przelacz: x ^= ((1LL << (b + 1)) - 1) ^ ((1LL << a) - 1);. ile: __builtin_popcountll(x). stan: for (int i = 0; i < n; i++) cout << ((x >> i) & 1);.`,
            tests: (r) => {
                const t = ['1 2\nprzelacz 0 0\nile', '6 5\nprzelacz 1 3\nstan\nprzelacz 2 5\nile\nstan', '60 3\nprzelacz 0 59\nile\nstan'];
                for (const n of [60, 60, 13, 37]) { const ops = Array.from({ length: 400 }, () => { const p = r(); if (p < 0.6) { const a = r.int(0, n - 1), b = r.int(a, n - 1); return `przelacz ${a} ${b}`; } return p < 0.8 ? 'ile' : 'stan'; }); ops.push('ile'); ops.shift(); t.push(`${n} ${ops.length}\n${ops.join('\n')}`); }
                return t;
            },
            check: (inp) => { const l = L(inp); const [n, q] = l[0].split(' ').map(Number); if (!calk(n, 1, 60) || !calk(q, 1, 400) || l.length !== q + 1) return 'dane'; let pyt = 0; for (const w of l.slice(1)) { if (w === 'ile' || w === 'stan') { pyt++; continue; } const m = w.match(/^przelacz (\d+) (\d+)$/); if (!m || Number(m[1]) > Number(m[2]) || Number(m[2]) >= n) return 'polecenie'; } return pyt ? null : 'brak pytań'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); let x = 0n; const o = []; for (const w of l.slice(1)) { if (w === 'ile') o.push(String(jedynki(x))); else if (w === 'stan') { let s = ''; for (let i = 0; i < n; i++) s += String((x >> B(i)) & 1n); o.push(s); } else { const [, a, b] = w.split(' ').map(Number); x ^= ((1n << B(b + 1)) - 1n) ^ ((1n << B(a)) - 1n); } } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    long long x = 0;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "przelacz") {
            int a, b;
            cin >> a >> b;
            x ^= ((1LL << (b + 1)) - 1) ^ ((1LL << a) - 1);
        } else if (p == "ile") {
            cout << __builtin_popcountll(x) << "\n";
        } else {
            for (int k = 0; k < n; k++) cout << ((x >> k) & 1);
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-data-w-liczbie', krok: 9, level: 'latwe',
            title: 'Data w jednej liczbie',
            short: 'W systemie plików FAT data zajmuje 16 bitów: rok − 1980 na 7 bitach, miesiąc na 4, dzień na 5. Pakuj przez << i |, rozpakowuj przez >> i &.',
            tags: ['pakowanie: << i |', 'rozpakowanie: >> i &', 'pola bitowe'],
            statement: ['W systemie plików FAT (pendrive’y, karty pamięci) data zapisania pliku zajmuje tylko 16 bitów: najstarsze 7 bitów to rok minus 1980 (od 0 do 127), następne 4 bity — miesiąc (od 1 do 12), a najmłodsze 5 bitów — dzień (od 1 do 31). Cała data to liczba x = ((rok − 1980) << 9) | (miesiac << 5) | dzien.',
                'Wykonaj q poleceń: pakuj d m r — wypisz liczbę x dla dnia d, miesiąca m i roku r; rozpakuj x — wypisz dzień, miesiąc i rok zapisane w x. Rozpakowanie to przesunięcie w prawo i wycięcie bitów maską: dzień = x & 31, miesiąc = (x >> 5) & 15, rok = (x >> 9) + 1980.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy polecenie: pakuj d m r albo rozpakuj x.'],
            output_format: ['q wierszy: dla pakuj — liczba x, dla rozpakuj — trzy liczby d m r oddzielone spacjami.'],
            constraints: ['1 ≤ q ≤ 1000', 'Daty są poprawne, z lat od 1980 do 2107.', 'W poleceniu rozpakuj liczba x zawsze zapisuje poprawną datę.'],
            examples: [{ input: '2\npakuj 26 11 2026\nrozpakuj 23153', note: '2026 − 1980 = 46: 46 << 9 = 23552, 11 << 5 = 352, a dzień 26 — razem 23552 + 352 + 26 = 23930. 23153: dzień 23153 & 31 = 17, miesiąc (23153 >> 5) & 15 = 3, rok (23153 >> 9) + 1980 = 45 + 1980 = 2025.' }],
            hint: R`Polecenie wczytaj jako napis. pakuj: cout << ((r - 1980) << 9 | m << 5 | d);. rozpakuj: cout << (x & 31) << " " << ((x >> 5) & 15) << " " << (x >> 9) + 1980;.`,
            tests: (r) => {
                const data = () => { const rok = r.int(1980, 2107), m = r.int(1, 12); const dni = [31, (rok % 4 === 0 && (rok % 100 !== 0 || rok % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; return [r.int(1, dni), m, rok]; };
                const pak = ([d, m, rok]) => ((rok - 1980) << 9) | (m << 5) | d;
                const pol = () => { const d = data(); return r() < 0.5 ? `pakuj ${d.join(' ')}` : `rozpakuj ${pak(d)}`; };
                return [lista(['pakuj 26 11 2026', 'rozpakuj 23153', 'pakuj 1 1 1980', 'rozpakuj 33', 'pakuj 31 12 2107', `rozpakuj ${pak([31, 12, 2107])}`]), lista(Array.from({ length: 1000 }, pol)), lista(Array.from({ length: 50 }, () => `rozpakuj ${pak(data())}`))];
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => /^pakuj \d+ \d+ \d+$/.test(w) || /^rozpakuj \d+$/.test(w)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const p = w.split(' '); if (p[0] === 'pakuj') { const [d, m, rok] = p.slice(1).map(Number); return String(((rok - 1980) << 9) | (m << 5) | d); } const x = Number(p[1]); return `${x & 31} ${(x >> 5) & 15} ${(x >> 9) + 1980}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string p;
        cin >> p;
        if (p == "pakuj") {
            int d, m, r;
            cin >> d >> m >> r;
            cout << ((r - 1980) << 9 | m << 5 | d) << "\n";
        } else {
            int x;
            cin >> x;
            cout << (x & 31) << " " << ((x >> 5) & 15) << " " << (x >> 9) + 1980 << "\n";
        }
    }
    return 0;
}`,
        },
        // ================================================================ BAZA · średnie
        {
            id: 'ld-b-xor-od-1-do-n', krok: 9, level: 'srednie',
            title: 'XOR od 1 do n',
            short: 'Policz 1 ^ 2 ^ 3 ^ … ^ n dla n do 10¹⁸. Pętla nie zdąży — wypisz wyniki dla małych n i znajdź regułę, która powtarza się co 4.',
            tags: ['wzór co 4', 'n % 4', 'szukanie reguły'],
            statement: ['Dla każdej liczby n wypisz XOR wszystkich liczb od 1 do n, czyli 1 ^ 2 ^ 3 ^ … ^ n.',
                'Liczby sięgają 10¹⁸, więc pętla po wszystkich nie zdąży. Napisz najpierw krótki program, który wypisze wyniki dla n od 1 do 20 — zobaczysz regułę, która powtarza się co cztery liczby i zależy tylko od reszty n % 4.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — wartość 1 ^ 2 ^ … ^ n.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '5\n1\n2\n3\n4\n5', note: '1 = 1. 1 ^ 2 = 3. 1 ^ 2 ^ 3 = 0. Do tego ^ 4 daje 4, a ^ 5 — znowu 1. Zauważ, że przy n podzielnym przez 4 wynikiem jest samo n.' }],
            hint: R`Reguła: n % 4 == 0 → n, n % 4 == 1 → 1, n % 4 == 2 → n + 1, n % 4 == 3 → 0. Dlaczego? Każda czwórka kolejnych liczb 4k, 4k + 1, 4k + 2, 4k + 3 daje razem XOR równy 0.`,
            tests: (r) => [lista(Array.from({ length: 100 }, (_, i) => String(i + 1))), lista(losoweB(r, 1000, 1n, MAX18)), lista(['1000000000000000000', '999999999999999999', '999999999999999998', '999999999999999997'])],
            check: (inp) => sprLista(inp, 1000, 1n, MAX18),
            solve: (inp) => toks(inp).slice(1).map((x) => { const n = B(x); const m = n % 4n; return String(m === 0n ? n : m === 1n ? 1n : m === 2n ? n + 1n : 0n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        long long w;
        if (n % 4 == 0) w = n;
        else if (n % 4 == 1) w = 1;
        else if (n % 4 == 2) w = n + 1;
        else w = 0;
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-z-kodu-graya', krok: 9, level: 'srednie',
            title: 'Z kodu Graya z powrotem',
            short: 'Kod Graya g = i ^ (i >> 1). Odzyskaj i: pierwszy bit przepisz, a każdy następny bit i to XOR poprzedniego bitu i z bitem g.',
            tags: ['XOR bit po bicie', 'od lewej', 'odwracanie kodu'],
            statement: ['Kod Graya liczby i to g = i ^ (i >> 1). Mając sam kod g, można odzyskać i. Najstarszy bit i jest taki sam jak najstarszy bit g. Każdy następny bit i (idąc w prawo) to XOR poprzedniego bitu i z bitem g na tej samej pozycji.',
                'Dla każdego kodu Graya podanego jako napis z zer i jedynek wypisz liczbę i, której jest kodem (dziesiętnie).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy kod Graya — napis z zer i jedynek (może zaczynać się od zer).'],
            output_format: ['q wierszy — liczba i dla każdego kodu.'],
            constraints: ['1 ≤ q ≤ 300', 'Każdy napis ma od 1 do 60 znaków.'],
            examples: [{ input: '3\n110\n0101\n111', note: '110: pierwszy bit 1, potem 1 ^ 1 = 0, potem 0 ^ 0 = 0 — i = 100 = 4 (i rzeczywiście 4 ^ 2 = 6 = 110). 0101 → 0110 = 6. 111 → 101 = 5.' }],
            hint: R`int b = 0; long long i = 0; for (char c : g) { b ^= (c - '0'); i = i * 2 + b; }. Zmienna b to bieżący bit liczby i — XOR wszystkich bitów g od początku do tego miejsca.`,
            tests: (r) => [lista(['0', '1', '10', '11', '110', '0101', '111', '1000', '0000']), lista(Array.from({ length: 300 }, () => losBin(r, r.int(1, 60), true))), lista(Array.from({ length: 64 }, (_, i) => (i ^ (i >> 1)).toString(2).padStart(6, '0')))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((s) => czy01(s, 60)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((g) => { let b = 0; let s = ''; for (const c of g) { b ^= Number(c); s += b; } return String(zSystemu(s)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        string g;
        cin >> g;
        int b = 0;
        long long i = 0;
        for (char c : g) {
            b ^= (c - '0');
            i = i * 2 + b;
        }
        cout << i << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-dwie-bez-pary', krok: 9, level: 'srednie',
            title: 'Dwie liczby bez pary',
            short: 'Wszystkie liczby są parami — oprócz dwóch. XOR całości to a ^ b; jego najniższa jedynka dzieli liczby na dwie grupy, w każdej zostaje jedna samotna.',
            tags: ['XOR całości', 'x & -x', 'podział na grupy'],
            statement: ['W ciągu n liczb każda wartość występuje dokładnie dwa razy, z wyjątkiem dwóch różnych wartości a i b, które występują po razie. Znajdź je.',
                'XOR wszystkich liczb to a ^ b — pary się znoszą. Ponieważ a ≠ b, ta liczba ma gdzieś jedynkę; weź najniższą: d = x & −x. Na tej pozycji a i b mają różne bity. Podziel wszystkie liczby na dwie grupy według tego bitu — w każdej grupie pary dalej się znoszą, a zostaje dokładnie jedna z samotnych liczb.'],
            input_format: ['W pierwszym wierszu parzysta liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwie samotne liczby w kolejności rosnącej, oddzielone spacją.'],
            constraints: ['2 ≤ n ≤ 10 000, n parzyste', 'Liczby są z przedziału od 1 do 10⁹.'],
            examples: [{ input: '6\n4 7 9 4 9 2', note: 'XOR wszystkiego: 7 ^ 2 = 111 ^ 010 = 101. Najniższa jedynka ma wagę 1. Liczby z tym bitem: 7, 9, 9 — XOR daje 7. Bez niego: 4, 4, 2 — XOR daje 2. Wynik 2 7.' }],
            hint: R`int x = 0; for (int v : a) x ^= v; int d = x & -x; int p = 0, q = 0; for (int v : a) if (v & d) p ^= v; else q ^= v;. Na końcu wypisz min(p, q) i max(p, q).`,
            tests: (r) => {
                const gen = (pary, lo, hi) => { const s = new Set(); while (s.size < pary + 2) s.add(r.int(lo, hi)); const v = [...s]; const [a, b] = [v.pop(), v.pop()]; return r.shuffle([...v, ...v, a, b]); };
                return [[1, 2], [5, 1000000000], gen(1, 1, 10), gen(2, 1, 9), gen(4999, 1, 1e9), gen(100, 1, 300), [6, 4, 6, 4, 12, 8], gen(3000, 1, 1e9)].map((a) => `${a.length}\n${a.join(' ')}`);
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 2, 10000) || n % 2 || t.length !== n + 1 || !t.slice(1).every((x) => calk(x, 1, 1e9))) return 'dane'; const c = new Map(); for (const x of t.slice(1)) c.set(x, (c.get(x) || 0) + 1); const raz = [...c.values()].filter((v) => v === 1).length; return raz === 2 && [...c.values()].every((v) => v === 1 || v === 2) ? null : 'pary'; },
            solve: (inp) => { const c = new Map(); for (const x of nums(inp).slice(1)) c.set(x, (c.get(x) || 0) + 1); return [...c].filter(([, v]) => v === 1).map(([k]) => k).sort((a, b) => a - b).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    int x = 0;
    for (int &v : a) {
        cin >> v;
        x ^= v;
    }
    int d = x & -x;
    int p = 0, q = 0;
    for (int v : a) {
        if (v & d) p ^= v;
        else q ^= v;
    }
    cout << min(p, q) << " " << max(p, q) << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-and-przedzialu', krok: 9, level: 'srednie',
            title: 'AND całego przedziału',
            short: 'AND wszystkich liczb od a do b to ich wspólny początek zapisu dwójkowego z zerami na końcu. Przesuwaj a i b w prawo, aż się zrównają.',
            tags: ['wspólny prefiks bitów', 'przesuwanie obu', 'long long'],
            statement: ['Dla każdej pary a ≤ b wypisz AND wszystkich liczb całkowitych od a do b włącznie: a & (a + 1) & … & b. Liczby sięgają 10¹⁸, więc pętla po przedziale nie zdąży.',
                'Zauważ: jeśli na jakiejś pozycji bit zmienia się gdzieś w przedziale, to w wyniku jest tam zero — a każdy bit poniżej pierwszej różnicy między a i b na pewno się zmienia. Zostaje więc wspólny początek zapisów a i b, a reszta to zera. Przesuwaj a i b w prawo, aż staną się równe, licząc przesunięcia, a potem przesuń wynik z powrotem w lewo.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy — AND wszystkich liczb od a do b.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ a ≤ b ≤ 10¹⁸'],
            examples: [{ input: '3\n12 15\n5 7\n8 8', note: '12 = 1100, 13 = 1101, 14 = 1110, 15 = 1111: wspólny początek 11, reszta to zera — 1100 = 12. 5 = 101, 6 = 110 i 7 = 111 mają wspólny tylko najstarszy bit: 100 = 4. Jedna liczba to po prostu ona sama.' }],
            hint: R`int k = 0; while (a != b) { a >>= 1; b >>= 1; k++; } cout << (a << k);. Wszystko w long long.`,
            tests: (r) => { const t = [lista(['12 15', '5 7', '8 8', '0 0', '0 1000000000000000000', '1 1', '7 8', '1000000000000000000 1000000000000000000', `${1n << 59n} ${(1n << 59n) + 12345n}`])]; t.push(lista(Array.from({ length: 1000 }, () => { const a = r.big(0n, MAX18); const b = r() < 0.5 ? a + r.big(0n, 1000n) : r.big(a, MAX18); return `${a} ${b > MAX18 ? MAX18 : b}`; }))); return t; },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 1000) || t.length !== 2 * q + 1 || !zakresB(t.slice(1), 0n, MAX18)) return 'dane'; for (let i = 0; i < q; i++) if (B(t[1 + 2 * i]) > B(t[2 + 2 * i])) return 'a > b'; return null; },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) { let a = B(t[1 + 2 * i]), b = B(t[2 + 2 * i]); let k = 0n; while (a !== b) { a >>= 1n; b >>= 1n; k++; } o.push(String(a << k)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long a, b;
        cin >> a >> b;
        int k = 0;
        while (a != b) {
            a >>= 1;
            b >>= 1;
            k++;
        }
        cout << (a << k) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-adres-ip', krok: 9, level: 'srednie',
            title: 'Adres IP i maska sieci',
            short: 'Adres IP to 32 bity, a /p mówi, ile pierwszych bitów to numer sieci. Adres sieci to IP & maska, rozgłoszeniowy — IP | ~maska.',
            tags: ['4 bajty w jednej liczbie', 'maska p jedynek', 'unsigned'],
            statement: ['Adres IP, na przykład 192.168.1.130, to 32 bity zapisane jako cztery bajty: 192, 168, 1 i 130. Zapis 192.168.1.130/26 dodatkowo mówi, że pierwsze 26 bitów to numer sieci, a pozostałe 6 — numer komputera w tej sieci. Maska sieci ma p jedynek z przodu i zera dalej.',
                'Dla każdego adresu wypisz adres sieci (IP & maska — bity komputera wyzerowane) oraz adres rozgłoszeniowy (IP | ~maska — bity komputera ustawione na jedynki), oba w postaci czterech liczb z kropkami.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy adres w postaci a.b.c.d/p.'],
            output_format: ['q wierszy: adres sieci i adres rozgłoszeniowy oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 300', '0 ≤ a, b, c, d ≤ 255', '0 ≤ p ≤ 32'],
            examples: [{ input: '3\n192.168.1.130/26\n10.20.30.40/8\n1.2.3.4/32', note: '130 = 10000010, a w /26 bity komputera to ostatnie 6: sieć zaczyna się od 10000000 = 128, a kończy na 10111111 = 191. W /8 sieć to 10.0.0.0, a rozgłoszeniowy 10.255.255.255. /32 to jeden komputer — oba adresy są takie same.' }],
            hint: R`Złóż adres w unsigned int: ip = (a << 24) | (b << 16) | (c << 8) | d;. Maska: unsigned int m = (p == 0) ? 0 : 0xFFFFFFFFu << (32 - p); — przesunięcie o 32 jest zabronione, dlatego p = 0 osobno. Bajty wypisuj jako (x >> 24) & 255, (x >> 16) & 255 itd.`,
            tests: (r) => { const ip = () => `${r.int(0, 255)}.${r.int(0, 255)}.${r.int(0, 255)}.${r.int(0, 255)}/${r.int(0, 32)}`; return [lista(['192.168.1.130/26', '10.20.30.40/8', '1.2.3.4/32', '1.2.3.4/0', '255.255.255.255/1', '0.0.0.0/32', '172.16.5.4/12', '128.0.0.1/31']), lista(Array.from({ length: 300 }, ip)), lista(Array.from({ length: 33 }, (_, p) => `200.150.100.50/${p}`))]; },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((w) => { const m = w.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/); return m && [1, 2, 3, 4].every((i) => Number(m[i]) <= 255) && Number(m[5]) <= 32; }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [ip, p] = w.split('/'); const x = ip.split('.').reduce((a, v) => a * 256 + Number(v), 0); const pp = Number(p); const m = pp === 0 ? 0 : 2 ** 32 - 2 ** (32 - pp); const siec = (x & m) >>> 0, rozg = (x | (~m >>> 0)) >>> 0; const txt = (v) => [24, 16, 8, 0].map((s) => (v >>> s) & 255).join('.'); return `${txt(siec)} ${txt(rozg)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(unsigned int x) {
    cout << ((x >> 24) & 255) << "." << ((x >> 16) & 255) << "." << ((x >> 8) & 255) << "." << (x & 255);
}
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        unsigned int a, b, c, d;
        int p;
        char z;
        cin >> a >> z >> b >> z >> c >> z >> d >> z >> p;
        unsigned int ip = (a << 24) | (b << 16) | (c << 8) | d;
        unsigned int m = (p == 0) ? 0 : 0xFFFFFFFFu << (32 - p);
        wypisz(ip & m);
        cout << " ";
        wypisz(ip | ~m);
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-bez-sasiednich-jedynek', krok: 9, level: 'srednie',
            title: 'Bez dwóch jedynek obok siebie',
            short: 'Wypisz wszystkie napisy z n bitów, w których żadne dwie jedynki nie stoją obok siebie. Sprawdzenie maski to jedno działanie: m & (m >> 1).',
            tags: ['m & (m >> 1)', 'wszystkie maski', 'zapis na n bitach'],
            statement: ['Wypisz w kolejności rosnącej wszystkie napisy z n zer i jedynek, w których żadne dwie jedynki nie stoją obok siebie, a na końcu — ile ich jest.',
                'Każdy napis to maska m od 0 do 2ⁿ − 1. Dwie sąsiednie jedynki istnieją dokładnie wtedy, gdy m i m przesunięte o jeden w prawo mają wspólną jedynkę — czyli (m & (m >> 1)) != 0.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Kolejne napisy (każdy dokładnie n znaków) w kolejności rosnących masek, każdy w osobnym wierszu.', 'W ostatnim wierszu liczba tych napisów.'],
            constraints: ['1 ≤ n ≤ 12'],
            examples: [{ input: '3', note: 'Spośród 8 napisów odpadają 011, 110 i 111. Zostaje 5: 000, 001, 010, 100 i 101.' }],
            hint: R`for (int m = 0; m < (1 << n); m++) if ((m & (m >> 1)) == 0) { for (int k = n - 1; k >= 0; k--) cout << ((m >> k) & 1); cout << "\n"; ile++; }. Ciekawostka: liczby 2, 3, 5, 8, 13, … to ciąg Fibonacciego.`,
            tests: () => ['1', '2', '3', '4', '5', '8', '10', '12', '11'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 12) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let m = 0; m < 1 << n; m++) if ((m & (m >> 1)) === 0) o.push(m.toString(2).padStart(n, '0')); o.push(String(o.length)); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int m = 0; m < (1 << n); m++) {
        if ((m & (m >> 1)) != 0) continue;
        for (int k = n - 1; k >= 0; k--) cout << ((m >> k) & 1);
        cout << "\n";
        ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-nastepna-z-tyloma-jedynkami', krok: 9, level: 'srednie',
            title: 'Następna liczba z tyloma samymi jedynkami',
            short: 'Najmniejsza liczba większa od x z tą samą liczbą jedynek: przesuń najniższą jedynkę, która ma zero po lewej, o jedno miejsce w lewo, a jedynki za nią zsuń na sam koniec.',
            tags: ['ostatnie „01” → „10”', 'jedynki na koniec', 'napis albo bity'],
            statement: ['Dla każdej liczby x wypisz najmniejszą liczbę większą od x, która ma w zapisie dwójkowym tyle samo jedynek co x. Liczby sięgają 10¹⁸ — szukanie kolejnych liczb po jednej może trwać bardzo długo (z 2⁵⁹ trzeba by dojść aż do 2⁶⁰).',
                'Sposób na napisie: dopisz zero z przodu zapisu x. Idąc od prawej, znajdź pierwsze miejsce, gdzie przed jedynką stoi zero (para 01). Zamień tę parę na 10, a wszystkie jedynki, które stały na prawo od niej, przesuń na sam koniec napisu (zera przed nimi). Odczytaj wynik.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba x.'],
            output_format: ['q wierszy — najmniejsza większa liczba z tą samą liczbą jedynek.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4\n6\n7\n12\n1', note: '6 → 0110: pierwsza od prawej para 01 stoi na samym początku. Po zamianie na 10 mamy 1010, a jedynkę stojącą za parą zsuwamy na koniec: 1001 = 9. 7 → 0111 → 1011 = 11. 12 → 01100 → 10001 = 17. 1 → 01 → 10 = 2.' }],
            hint: R`Na bitach: long long c = x & -x; long long r = x + c; wynik = r | (((x ^ r) >> 2) / c);. Na napisie: s = "0" + zapis(x); szukasz od prawej i takiego, że s[i] == '0' && s[i+1] == '1', zamieniasz, a potem w s.substr(i + 2) ustawiasz wszystkie jedynki na końcu (np. sort).`,
            tests: (r) => [lista(Array.from({ length: 64 }, (_, i) => String(i + 1))), lista(losoweB(r, 1000, 1n, MAX18)), lista(['1000000000000000000', String(1n << 59n), String((1n << 59n) - 1n), String(((1n << 20n) - 1n) << 30n), '576460752303423487'])],
            check: (inp) => sprLista(inp, 1000, 1n, MAX18),
            solve: (inp) => toks(inp).slice(1).map((s) => { const x = B(s); const c = x & -x; const r2 = x + c; return String(r2 | (((x ^ r2) >> 2n) / c)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long x;
        cin >> x;
        long long c = x & -x;
        long long r = x + c;
        long long wynik = r | (((x ^ r) >> 2) / c);
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-lampki-i-przelaczniki', krok: 9, level: 'srednie',
            title: 'Lampki i przełączniki',
            short: 'Każdy przełącznik zmienia stan kilku lampek — to XOR z jego maską. Naciśnięcie dwa razy nic nie daje, więc szukasz podzbioru przełączników, który zapali wszystkie lampki.',
            tags: ['XOR masek', 'podzbiory przełączników', 'najmniej naciśnięć'],
            statement: ['Na tablicy jest m lampek (od 0 do m − 1), część z nich świeci. Pod tablicą jest n przełączników — każdy zmienia stan określonych lampek (świecące gasną, zgaszone się zapalają). Jakie najmniej naciśnięć zapali wszystkie lampki naraz?',
                'Stan lampek to maska, a naciśnięcie przełącznika — XOR z jego maską. Kolejność naciśnięć nie ma znaczenia, a dwukrotne naciśnięcie tego samego przełącznika niczego nie zmienia. Wystarczy więc sprawdzić każdy podzbiór przełączników — każdą maskę od 0 do 2ⁿ − 1. Jeśli nie da się zapalić wszystkich lampek, wypisz −1.'],
            input_format: ['W pierwszym wierszu liczby m i n.', 'W drugim wierszu napis z m znaków 0 i 1 — stan lampek od lampki 0 (1 = świeci).', 'W każdym z kolejnych n wierszy liczba c, a po niej c różnych numerów lampek, które zmienia przełącznik.'],
            output_format: ['Jedna liczba — najmniejsza liczba naciśnięć albo −1.'],
            constraints: ['1 ≤ m ≤ 60', '1 ≤ n ≤ 20', '0 ≤ c ≤ m'],
            examples: [{ input: '4 3\n1010\n2 1 3\n2 0 1\n1 2', note: 'Świecą lampki 0 i 2. Pierwszy przełącznik zapala 1 i 3 — po jednym naciśnięciu świecą wszystkie. Wynik 1.' },
                { input: '2 1\n00\n1 0', note: 'Jedyny przełącznik zmienia tylko lampkę 0 — lampki 1 nie da się zapalić. Wynik −1.' }],
            hint: R`Maski w long long: stan |= 1LL << i dla świecących, maska[j] |= 1LL << lampka. Cel: long long pelna = (1LL << m) - 1; for (int s = 0; s < (1 << n); s++) { long long x = stan; for (j…) if ((s >> j) & 1) x ^= maska[j]; if (x == pelna) best = min(best, __builtin_popcount(s)); }.`,
            tests: (r) => {
                const prz = (m, p) => { const u = []; for (let j = 0; j < m; j++) if (r() < p) u.push(j); return `${u.length}${u.length ? ' ' + r.shuffle(u).join(' ') : ''}`; };
                const t = ['1 1\n0\n1 0', '1 1\n1\n0', '4 3\n1010\n2 1 3\n2 0 1\n1 2', '2 1\n00\n1 0'];
                for (const [m, n, p] of [[60, 20, 0.1], [60, 20, 0.5], [20, 20, 0.2], [30, 12, 0.3], [60, 20, 0.03]]) t.push(`${m} ${n}\n${losBin(r, m, true)}\n${Array.from({ length: n }, () => prz(m, p)).join('\n')}`);
                // rozwiązywalny przez kilka konkretnych przełączników
                const m = 40, n = 20; const maski = Array.from({ length: n }, () => prz(m, 0.3));
                const wyb = [3, 7, 11, 19]; let st = (1n << B(m)) - 1n; for (const j of wyb) for (const x of maski[j].split(' ').slice(1)) st ^= 1n << B(x);
                t.push(`${m} ${n}\n${Array.from({ length: m }, (_, i) => String((st >> B(i)) & 1n)).join('')}\n${maski.join('\n')}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const [m, n] = l[0].split(' ').map(Number); return calk(m, 1, 60) && calk(n, 1, 20) && l.length === n + 2 && /^[01]+$/.test(l[1]) && l[1].length === m && l.slice(2).every((w) => { const p = w.split(' ').map(Number); return calk(p[0], 0, m) && p.length === p[0] + 1 && p.slice(1).every((x) => calk(x, 0, m - 1)) && new Set(p.slice(1)).size === p[0]; }) ? null : 'dane'; },
            solve: (inp) => {
                const l = L(inp); const [m, n] = l[0].split(' ').map(Number);
                const msk =l.slice(2).map((w) => { let a = 0, b = 0; for (const s of w.split(' ').slice(1)) { const i = Number(s); if (i < 30) a |= 1 << i; else b |= 1 << (i - 30); } return [a, b]; });
                let sa = 0, sb = 0; for (let i = 0; i < m; i++) if (l[1][i] === '1') { if (i < 30) sa |= 1 << i; else sb |= 1 << (i - 30); }
                const pa = m >= 30 ? (2 ** 30 - 1) : (2 ** m - 1), pb = m > 30 ? 2 ** (m - 30) - 1 : 0;
                const A =new Int32Array(1 << n), Bx = new Int32Array(1 << n); A[0] = sa; Bx[0] = sb;
                let best = (sa === pa && sb === pb) ? 0 : -1;
                for (let s = 1; s < 1 << n; s++) { const low = s & -s; const j = 31 - Math.clz32(low); A[s] = A[s ^ low] ^ msk[j][0]; Bx[s] = Bx[s ^ low] ^ msk[j][1]; if (A[s] === pa && Bx[s] === pb) { const c = jedynkiN(s); if (best < 0 || c < best) best = c; } }
                return String(best);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int m, n;
    cin >> m >> n;
    string s;
    cin >> s;
    long long stan = 0;
    for (int i = 0; i < m; i++)
        if (s[i] == '1') stan |= 1LL << i;
    vector<long long> maska(n, 0);
    for (int j = 0; j < n; j++) {
        int c;
        cin >> c;
        for (int k = 0; k < c; k++) {
            int x;
            cin >> x;
            maska[j] |= 1LL << x;
        }
    }
    long long pelna = (1LL << m) - 1;
    int best = -1;
    for (int sub = 0; sub < (1 << n); sub++) {
        long long x = stan;
        for (int j = 0; j < n; j++)
            if ((sub >> j) & 1) x ^= maska[j];
        if (x == pelna) {
            int ile = __builtin_popcount(sub);
            if (best == -1 || ile < best) best = ile;
        }
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-max-xor-pary', krok: 9, level: 'srednie',
            title: 'Największy XOR pary',
            short: 'Wybierz dwie liczby o największym XOR-ze. Dla n ≤ 3000 sprawdzisz wszystkie pary — to około 4,5 miliona działań.',
            tags: ['wszystkie pary', '^', 'rekord'],
            statement: ['Dla ciągu n liczb znajdź największą wartość a_i ^ a_j dla dwóch różnych pozycji i ≠ j.',
                'Par jest n · (n − 1) / 2 — dla n = 3000 to około 4,5 miliona, a każda wymaga jednego XOR-a. Komputer sprawdzi je wszystkie w ułamku sekundy. (W bazie trudnych zadań czeka to samo zadanie dla 200 000 liczb — tam trzeba już sprytu.)'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba — największy XOR pary.'],
            constraints: ['2 ≤ n ≤ 3000', 'Liczby są z przedziału od 0 do 10⁹.'],
            examples: [{ input: '4\n3 10 5 25', note: '5 ^ 25 = 00101 ^ 11001 = 11100 = 28. Żadna inna para nie daje więcej (na przykład 10 ^ 25 = 19, 3 ^ 25 = 26).' }],
            hint: R`int best = 0; for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) best = max(best, a[i] ^ a[j]);. Wynik mieści się w int, bo liczby są mniejsze od 2³⁰.`,
            tests: (r) => [[0, 0], [1, 2], [3, 10, 5, 25], r.arr(3000, 0, 1e9), r.arr(3000, 0, 1000), r.arr(100, 1e9 - 1000, 1e9), [7, 7, 7], [536870912, 536870911], r.arr(2999, 0, 1e9)].map((a) => `${a.length}\n${a.join(' ')}`),
            check: (inp) => { const t = nums(inp); return calk(t[0], 2, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); let best = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) { const v = (a[i] ^ a[j]) >>> 0; if (v > best) best = v; } return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    int best = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            best = max(best, a[i] ^ a[j]);
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-gra-nim', krok: 9, level: 'srednie',
            title: 'Gra Nim',
            short: 'Pierwszy gracz wygrywa, gdy XOR wszystkich kupek nie jest zerem. Dobry ruch zmienia jedną kupkę a na a ^ X — ile jest takich ruchów?',
            tags: ['XOR kupek', '(a ^ X) < a', 'teoria gier'],
            statement: ['W grze Nim leży n kupek zapałek. Gracze na zmianę zabierają dowolną dodatnią liczbę zapałek z jednej wybranej kupki. Wygrywa ten, kto zabierze ostatnią zapałkę. Obaj grają najlepiej, jak się da.',
                'Ta gra ma znane rozwiązanie: niech X to XOR rozmiarów wszystkich kupek. Jeśli X = 0, przegrywa gracz, który ma ruch (każdy jego ruch zostawi X ≠ 0, a przeciwnik zawsze może przywrócić zero). Jeśli X ≠ 0, gracz zaczynający wygrywa — dobrym ruchem jest zmniejszenie jakiejś kupki a do rozmiaru a ^ X, o ile a ^ X < a. Wypisz, kto wygra, a jeśli pierwszy — na ile sposobów może wykonać zwycięski pierwszy ruch.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n rozmiarów kupek.'],
            output_format: ['drugi, jeśli wygrywa drugi gracz, albo pierwszy K, gdzie K to liczba zwycięskich pierwszych ruchów.'],
            constraints: ['1 ≤ n ≤ 10 000', 'Kupki mają od 1 do 10⁹ zapałek.'],
            examples: [{ input: '3\n3 4 5', note: 'X = 3 ^ 4 ^ 5 = 2 ≠ 0 — wygrywa pierwszy. Kupka 3: 3 ^ 2 = 1 < 3, więc można zabrać 2 zapałki. Kupka 4: 4 ^ 2 = 6 > 4 — nie da się. Kupka 5: 5 ^ 2 = 7 > 5 — też nie. Jeden zwycięski ruch.' },
                { input: '2\n7 7', note: 'X = 0 — cokolwiek zrobi pierwszy, drugi powtórzy to samo na drugiej kupce. Wygrywa drugi.' }],
            hint: R`int X = 0; for (int a : kupki) X ^= a; if (X == 0) cout << "drugi"; else { int K = 0; for (int a : kupki) if ((a ^ X) < a) K++; cout << "pierwszy " << K; }. Nawiasy wokół a ^ X są konieczne — < ma wyższy priorytet niż ^.`,
            tests: (r) => {
                const zero = (n) => { for (;;) { const a = r.arr(n - 1, 1, 1e9); const x = a.reduce((p, v) => p ^ v, 0); if (x >= 1 && x <= 1e9) return r.shuffle([...a, x]); } };
                return [[1], [5], [7, 7], [3, 4, 5], [1, 2, 3], r.arr(10000, 1, 1e9), zero(10000), r.arr(50, 1, 20), zero(30), r.arr(9999, 1, 7)].map((a) => `${a.length}\n${a.join(' ')}`);
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const X = a.reduce((p, v) => p ^ v, 0); if (X === 0) return 'drugi'; return `pierwszy ${a.filter((v) => (v ^ X) < v).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    int X = 0;
    for (int &v : a) {
        cin >> v;
        X ^= v;
    }
    if (X == 0) {
        cout << "drugi\n";
        return 0;
    }
    int K = 0;
    for (int v : a)
        if ((v ^ X) < v) K++;
    cout << "pierwszy " << K << "\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · trudne
        {
            id: 'ld-b-jedynki-od-1-do-n', krok: 9, level: 'trudne',
            title: 'Wszystkie jedynki od 1 do n',
            short: 'Ile jedynek mają razem zapisy dwójkowe liczb od 1 do n, dla n do 10¹⁷? Policz osobno dla każdej pozycji — bit k zmienia się co 2ᵏ.',
            tags: ['osobno każdy bit', 'okres 2ᵏ⁺¹', 'long long'],
            statement: ['Wypisz, ile jedynek mają razem zapisy dwójkowe wszystkich liczb od 1 do n. Liczby sięgają 10¹⁷, więc liczenie po kolei nie zdąży.',
                'Policz jedynki osobno dla każdej pozycji. Wypisz w kolumnie liczby 0, 1, 2, 3, … i spójrz na bit numer k: najpierw 2ᵏ zer, potem 2ᵏ jedynek, potem znowu 2ᵏ zer — wzór powtarza się co 2ᵏ⁺¹ liczb. Wśród liczb od 0 do n (czyli n + 1 liczb) jest więc (n + 1) / 2ᵏ⁺¹ pełnych powtórzeń, każde z 2ᵏ jedynkami, a z niepełnej reszty r = (n + 1) % 2ᵏ⁺¹ jedynek jest max(0, r − 2ᵏ).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba n.'],
            output_format: ['q wierszy — łączna liczba jedynek w zapisach liczb od 1 do n.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ n ≤ 10¹⁷'],
            examples: [{ input: '3\n5\n1\n8', note: '1, 10, 11, 100, 101 — jedynek jest 1 + 1 + 2 + 1 + 2 = 7. Dla n = 1 jest jedna. Do 8 dochodzą jeszcze 110 (2), 111 (3) i 1000 (1): razem 13.' }],
            hint: R`for (int k = 0; k < 60; k++) { long long okres = 1LL << (k + 1); suma += (n + 1) / okres * (1LL << k); long long r = (n + 1) % okres - (1LL << k); if (r > 0) suma += r; }. Sprawdź wzór na małych n z rozwiązaniem „po kolei”.`,
            tests: (r) => [lista(Array.from({ length: 100 }, (_, i) => String(i + 1))), lista(losoweB(r, 1000, 1n, 10n ** 17n)), lista(['100000000000000000', String((1n << 56n) - 1n), String(1n << 56n), '99999999999999999'])],
            check: (inp) => sprLista(inp, 1000, 1n, 10n ** 17n),
            solve: (inp) => toks(inp).slice(1).map((x) => { const n = B(x); let s = 0n; for (let k = 0n; k < 60n; k++) { const ok = 1n << (k + 1n); s += ((n + 1n) / ok) * (1n << k); const rr = ((n + 1n) % ok) - (1n << k); if (rr > 0n) s += rr; } return String(s); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long n;
        cin >> n;
        long long suma = 0;
        for (int k = 0; k < 60; k++) {
            long long okres = 1LL << (k + 1);
            suma += (n + 1) / okres * (1LL << k);
            long long r = (n + 1) % okres - (1LL << k);
            if (r > 0) suma += r;
        }
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-liczby-z-k-jedynkami', krok: 9, level: 'trudne',
            title: 'Liczby z dokładnie k jedynkami',
            short: 'Ile liczb od 1 do N ma dokładnie k jedynek? Idź po bitach N od najstarszego: gdy w N stoi 1, a Ty postawisz 0, resztę bitów wybierasz dowolnie — to dwumian Newtona.',
            tags: ['trójkąt Pascala', 'bity N od góry', 'C(i, k − u)'],
            statement: ['Dla każdej pary N, k wypisz, ile liczb od 1 do N ma w zapisie dwójkowym dokładnie k jedynek. N sięga 10¹⁸.',
                'Przyda się trójkąt Pascala z lekcji Silnia: liczba sposobów wyboru j pozycji spośród i to C(i, j). Przechodź po bitach N od najstarszego i licz, ile jedynek już „zużyłeś” (u). Gdy bit numer i liczby N to 1, możesz postawić tam 0 — wtedy każda liczba z dowolnymi i młodszymi bitami jest mniejsza od N, a jedynek potrzebujesz jeszcze k − u: to C(i, k − u) liczb. Potem stawiasz 1, tak jak w N, i u rośnie o jeden. Na końcu doliczasz samo N, jeśli ma dokładnie k jedynek.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby N i k.'],
            output_format: ['q wierszy — liczba liczb od 1 do N z dokładnie k jedynkami.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ N ≤ 10¹⁸', '1 ≤ k ≤ 60'],
            examples: [{ input: '3\n10 2\n7 3\n1000000000000000000 30', note: 'Do 10 dwie jedynki mają 3, 5, 6, 9 i 10 — pięć liczb. Do 7 trzy jedynki ma tylko 7 = 111. Ostatni wynik jest ogromny — tylko wzór da tu radę.' }],
            hint: R`long long C[64][64] — trójkąt Pascala (C[i][0] = 1, C[i][j] = C[i-1][j-1] + C[i-1][j]). Potem for (int i = 60; i >= 0; i--) if ((N >> i) & 1) { int p = k - u; if (p >= 0 && p <= i) wynik += C[i][p]; u++; } i na końcu if (__builtin_popcountll(N) == k) wynik++;.`,
            tests: (r) => [lista(Array.from({ length: 60 }, (_, i) => `${i + 1} ${r.int(1, 3)}`)), lista(Array.from({ length: 1000 }, () => `${r.big(1n, MAX18)} ${r.int(1, 60)}`)), lista(Array.from({ length: 300 }, () => `${r.big(1n, MAX18)} ${r.int(20, 40)}`)), lista(['1000000000000000000 30', '1 1', String((1n << 59n) - 1n) + ' 59', String((1n << 59n)) + ' 1', '1000000000000000000 60'])],
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 1000) || t.length !== 2 * q + 1) return 'dane'; for (let i = 0; i < q; i++) if (!calkB(t[1 + 2 * i], 1n, MAX18) || !calk(Number(t[2 + 2 * i]), 1, 60)) return 'N k'; return null; },
            solve: (inp) => {
                const C = Array.from({ length: 64 }, () => Array(64).fill(0n)); for (let i = 0; i < 64; i++) { C[i][0] = 1n; for (let j = 1; j <= i; j++) C[i][j] = C[i - 1][j - 1] + C[i - 1][j]; }
                const t = toks(inp); const o = [];
                for (let z = 0; z < Number(t[0]); z++) { const N = B(t[1 + 2 * z]); const k = Number(t[2 + 2 * z]); let w = 0n, u = 0; for (let i = 60; i >= 0; i--) if ((N >> B(i)) & 1n) { const p = k - u; if (p >= 0 && p <= i) w += C[i][p]; u++; } if (jedynki(N) === k) w++; o.push(String(w)); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long C[64][64];
int main() {
    for (int i = 0; i < 64; i++) {
        C[i][0] = 1;
        for (int j = 1; j <= i; j++) C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
    }
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        long long N;
        int k;
        cin >> N >> k;
        long long wynik = 0;
        int u = 0;
        for (int i = 60; i >= 0; i--) {
            if ((N >> i) & 1) {
                int p = k - u;
                if (p >= 0 && p <= i) wynik += C[i][p];
                u++;
            }
        }
        if (__builtin_popcountll(N) == k) wynik++;
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'ld-b-max-xor-duze', krok: 9, level: 'trudne',
            title: 'Największy XOR dla 200 000 liczb',
            short: 'To samo co „Największy XOR pary”, ale liczb jest 200 000 — par jest 20 miliardów. Buduj wynik bit po bicie od najstarszego i sprawdzaj, czy da się go osiągnąć.',
            tags: ['zachłannie od najstarszego bitu', 'prefiksy x >> k', 'sort i wyszukiwanie binarne'],
            statement: ['Ciąg n liczb jest generowany przepisem z lekcji Złożoność czasowa: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Znajdź największą wartość xᵢ ^ xⱼ dla dwóch różnych pozycji.',
                'Par jest około 2 · 10¹⁰ — za dużo. Ale wynik możesz budować od najstarszego bitu: wyższy bit waży więcej niż wszystkie niższe razem, więc najpierw sprawdź, czy da się dostać jedynkę na bicie 29, potem — przy tym, co już ustalone — na bicie 28 i tak dalej. Pytanie „czy istnieją dwie liczby, których XOR zaczyna się od bitów kand?” sprowadza się do pytania, czy dla jakiegoś x istnieje y z (y >> k) = (x >> k) ^ (kand >> k) — a to wyszukiwanie binarne w posortowanych liczbach.'],
            input_format: ['Jeden wiersz: liczby n, s, a, b i m.'],
            output_format: ['Jedna liczba — największy XOR pary.'],
            constraints: ['2 ≤ n ≤ 200 000', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 2 100', note: 'Ciąg: 3, 23, 63, 43, 3 (bo 43 · 7 + 2 = 303, a 303 mod 100 = 3). Największy XOR daje para 3 i 63: 000011 ^ 111111 = 111100 = 60.' }],
            hint: R`Wygeneruj x (long long, jak w lekcji: ${KOD_GEN}) i posortuj. long long best = 0; for (int k = 29; k >= 0; k--) { long long kand = best | (1LL << k); vector<long long> p(n); for (i…) p[i] = x[i] >> k; bool jest = false; for (i…) if (binary_search(p.begin(), p.end(), p[i] ^ (kand >> k))) { jest = true; break; } if (jest) best = kand; }.`,
            tests: (r) => {
                const P = 999999937, MN = [48271, 16807, 69621, 39373];
                const t = ['2 0 0 0 1', '2 5 1 1 10', '5 3 7 2 100', '10 1 2 3 1000', `200000 ${r.int(0, P - 1)} ${MN[0]} ${r.int(1, P - 1)} ${P}`, `200000 ${r.int(0, P - 1)} ${MN[1]} ${r.int(1, P - 1)} ${P}`, `150000 ${r.int(0, P - 1)} ${MN[2]} ${r.int(1, P - 1)} ${P}`];
                t.push(`200000 1 ${MN[3]} 12345 999983`);
                t.push(`100000 ${r.int(0, 1023)} 21 7 1024`);
                return t;
            },
            check: (inp) => (dobryGen(toks(inp), 0, 200000, 1e9) && nums(inp)[0] >= 2 && toks(inp).length === 5 ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp); const x = Array.from(generuj(n, s, a, b, m)).sort((p, q) => p - q);
                let best = 0;
                for (let k = 29; k >= 0; k--) { const kand = best | (1 << k); const set = new Set(); let jest = false; for (const v of x) { const p = v >> k; if (set.has(p ^ (kand >> k))) { jest = true; break; } set.add(p); } if (jest) best = kand; }
                return String(best);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    sort(x.begin(), x.end());
    long long best = 0;
    vector<long long> p(n);
    for (int k = 29; k >= 0; k--) {
        long long kand = best | (1LL << k);
        for (int i = 0; i < n; i++) p[i] = x[i] >> k;
        bool jest = false;
        for (int i = 0; i < n && !jest; i++)
            if (binary_search(p.begin(), p.end(), p[i] ^ (kand >> k))) jest = true;
        if (jest) best = kand;
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-suma-xor-par', krok: 9, level: 'trudne',
            title: 'Suma XOR-ów wszystkich par',
            short: 'Dla miliona liczb zsumuj XOR każdej pary. Liczy się osobno każdy bit: jeśli c liczb ma bit k zapalony, to c · (n − c) par ma go w XOR-ze.',
            tags: ['osobno każdy bit', 'c · (n − c) · 2ᵏ', 'generator danych'],
            statement: ['Ciąg n liczb jest generowany przepisem: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m (liczby są mniejsze od 2²⁰). Wypisz sumę xᵢ ^ xⱼ po wszystkich parach i < j.',
                'Dla miliona liczb par jest pół biliona — nie ma mowy o sprawdzaniu ich po kolei. Pomyśl osobno o każdym bicie k: XOR pary ma na nim jedynkę dokładnie wtedy, gdy jedna liczba z pary ma ten bit zapalony, a druga nie. Jeśli c liczb ma bit k zapalony, takich par jest c · (n − c), a każda dokłada do sumy 2ᵏ.'],
            input_format: ['Jeden wiersz: liczby n, s, a, b i m.'],
            output_format: ['Jedna liczba — suma XOR-ów wszystkich par.'],
            constraints: ['2 ≤ n ≤ 1 000 000', '1 ≤ m ≤ 2²⁰ = 1 048 576', '0 ≤ s, a, b < m'],
            examples: [{ input: '3 1 2 1 10', note: 'Ciąg: 1, 3, 7. Pary: 1 ^ 3 = 2, 1 ^ 7 = 6, 3 ^ 7 = 4 — razem 12.' }],
            hint: R`Wygeneruj x (long long). Dla każdego k od 0 do 19 policz c — ile liczb ma (x[i] >> k) & 1 — i dodaj (long long)c * (n - c) * (1LL << k). Wynik sięga 2,7 · 10¹⁷ — long long jest konieczny.`,
            tests: (r) => { const P = 1048573; return ['2 0 0 0 1', '2 1 0 0 2', '3 1 2 1 10', '10 5 3 1 16', `1000000 ${r.int(0, P - 1)} 21 ${r.int(1, P - 1)} ${P}`, `1000000 ${r.int(0, 1048575)} 5 3 1048576`, `500000 ${r.int(0, P - 1)} 48271 ${r.int(1, P - 1)} ${P}`, `999999 7 1 1 1048576`]; },
            check: (inp) => (dobryGen(toks(inp), 0, 1000000, 1048576) && nums(inp)[0] >= 2 && toks(inp).length === 5 ? null : 'dane'),
            solve: (inp) => { const [n, s, a, b, m] = nums(inp); const x = generuj(n, s, a, b, m); let suma = 0n; for (let k = 0; k < 20; k++) { let c = 0; for (let i = 0; i < n; i++) if ((x[i] >> k) & 1) c++; suma += B(c) * B(n - c) * (1n << B(k)); } return String(suma); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    long long suma = 0;
    for (int k = 0; k < 20; k++) {
        long long c = 0;
        for (int i = 0; i < n; i++)
            if ((x[i] >> k) & 1) c++;
        suma += c * (n - c) * (1LL << k);
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-polowki', krok: 9, level: 'trudne',
            title: 'Spotkanie w połowie',
            short: 'Podzbiorów 36 liczb jest 68 miliardów. Podziel liczby na dwie połowy po 18: wszystkie sumy każdej połowy to tylko 262 144 liczby — i wystarczy je dopasować.',
            tags: ['meet in the middle', 'sumy połówek', 'sort i lower_bound'],
            statement: ['Dla n liczb wypisz, na ile sposobów można wybrać niepusty podzbiór o sumie dokładnie S. Liczb jest do 36, więc 2³⁶ ≈ 68 miliardów masek to za dużo.',
                'Sztuczka „spotkanie w połowie”: podziel liczby na pierwszą połowę (do 18 liczb) i drugą. Policz sumy wszystkich podzbiorów pierwszej połowy — to najwyżej 2¹⁸ = 262 144 liczby — i posortuj je. Każdy podzbiór całości to podzbiór pierwszej połowy plus podzbiór drugiej. Dla każdej sumy t podzbioru drugiej połowy policz więc, ile sum pierwszej połowy jest równych S − t (lower_bound i upper_bound z lekcji Sortowanie).'],
            input_format: ['W pierwszym wierszu liczby n i S.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba — liczba niepustych podzbiorów o sumie S.'],
            constraints: ['1 ≤ n ≤ 36', '1 ≤ S ≤ 4 · 10¹³', 'Liczby są z przedziału od 1 do 10¹².'],
            examples: [{ input: '5 10\n1 2 3 4 5', note: 'Sumę 10 dają {1, 2, 3, 4}, {1, 4, 5}, {2, 3, 5} — trzy podzbiory.' }],
            hint: R`int h = n / 2; vector<long long> L; for (int m = 0; m < (1 << h); m++) { suma bitów z pierwszej połowy } sort(L.begin(), L.end());. Potem dla każdej maski drugiej połowy z sumą t: wynik += upper_bound(…, S - t) - lower_bound(…, S - t);. Pusty podzbiór ma sumę 0, a S ≥ 1, więc sam się nie policzy.`,
            tests: (r) => {
                const t = ['1 5\n5', '1 5\n4', '5 10\n1 2 3 4 5', `36 18\n${Array(36).fill(1).join(' ')}`];
                const zSumy = (a) => { const S = a.filter(() => r() < 0.5).reduce((x, y) => x + y, 0) || a[0]; return `${a.length} ${S}\n${a.join(' ')}`; };
                t.push(zSumy(r.arr(36, 1, 100)));
                t.push(zSumy(Array.from({ length: 36 }, () => Number(r.big(1n, 1000000000000n)))));
                t.push(zSumy(r.arr(35, 1, 20)));
                t.push(zSumy(r.arr(36, 1, 1000000)));
                t.push(`36 1000000000000\n${Array.from({ length: 36 }, () => r.int(1, 1e9)).join(' ')}`);
                return t;
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 36) && calkB(t[1], 1n, 4n * 10n ** 13n) && t.length === n + 2 && zakresB(t.slice(2), 1n, 10n ** 12n) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, S] = t; const a = t.slice(2); const hh = Math.floor(n / 2);
                const sumy = (arr) => { const k = arr.length; const s = new Float64Array(1 << k); for (let m = 1; m < 1 << k; m++) { const low = m & -m; s[m] = s[m ^ low] + arr[31 - Math.clz32(low)]; } return s; };
                const lewe = sumy(a.slice(0, hh)), prawe = sumy(a.slice(hh));
                const licz = new Map(); for (const v of lewe) licz.set(v, (licz.get(v) || 0) + 1);
                let w = 0; for (const v of prawe) w += licz.get(S - v) || 0;
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    int h = n / 2, r = n - h;
    vector<long long> L(1 << h);
    for (int m = 0; m < (1 << h); m++) {
        long long s = 0;
        for (int i = 0; i < h; i++)
            if ((m >> i) & 1) s += a[i];
        L[m] = s;
    }
    sort(L.begin(), L.end());
    long long wynik = 0;
    for (int m = 0; m < (1 << r); m++) {
        long long t = 0;
        for (int i = 0; i < r; i++)
            if ((m >> i) & 1) t += a[h + i];
        long long szukana = S - t;
        wynik += upper_bound(L.begin(), L.end(), szukana) - lower_bound(L.begin(), L.end(), szukana);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-hetmany', krok: 9, level: 'trudne',
            title: 'Hetmany na maskach',
            short: 'Ustaw n hetmanów, żeby się nie biły. Kolumny i obie przekątne zajęte przez poprzednie wiersze trzymaj w trzech maskach — wolne pola to jedna linijka.',
            tags: ['rekurencja', 'maski kolumn i przekątnych', 'wolne & -wolne'],
            statement: ['Na szachownicy n × n trzeba ustawić n hetmanów tak, żeby żadne dwa się nie atakowały — nie mogą stać w tym samym wierszu, kolumnie ani na tej samej przekątnej. Na ile sposobów da się to zrobić?',
                'Stawiaj hetmany wiersz po wierszu rekurencją, jak w lekcji Rekurencja. Pola atakowane przez hetmany z poprzednich wierszy trzymaj w trzech maskach: zajęte kolumny, przekątne „w lewo” i przekątne „w prawo”. Przy przejściu do następnego wiersza maska przekątnych przesuwa się o jeden bit w lewo albo w prawo. Wolne pola w wierszu to ~(kol | p1 | p2) obcięte do n bitów, a kolejne wolne pole wyciągasz przez wolne & −wolne.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jedna liczba — liczba ustawień.'],
            constraints: ['1 ≤ n ≤ 14'],
            examples: [{ input: '4', note: 'Są dokładnie dwa ustawienia: hetmany w kolumnach 2, 4, 1, 3 (licząc od góry) oraz ich lustrzane odbicie 3, 1, 4, 2.' }, { input: '8', note: 'Słynne zadanie o ośmiu hetmanach — 92 ustawienia.' }],
            hint: R`void szukaj(int w, int kol, int p1, int p2) { if (w == n) { ile++; return; } int wolne = ((1 << n) - 1) & ~(kol | p1 | p2); while (wolne) { int b = wolne & -wolne; wolne ^= b; szukaj(w + 1, kol | b, (p1 | b) << 1, (p2 | b) >> 1); } }. Wywołaj szukaj(0, 0, 0, 0).`,
            tests: () => Array.from({ length: 14 }, (_, i) => String(i + 1)),
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 14) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const pel = (1 << n) - 1; let ile = 0; const szukaj = (w, kol, p1, p2) => { if (w === n) { ile++; return; } let wolne = pel & ~(kol | p1 | p2); while (wolne) { const b = wolne & -wolne; wolne ^= b; szukaj(w + 1, kol | b, ((p1 | b) << 1) & pel, (p2 | b) >> 1); } }; szukaj(0, 0, 0, 0); return String(ile); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
long long ile;
void szukaj(int w, int kol, int p1, int p2) {
    if (w == n) {
        ile++;
        return;
    }
    int wolne = ((1 << n) - 1) & ~(kol | p1 | p2);
    while (wolne) {
        int b = wolne & -wolne;
        wolne ^= b;
        szukaj(w + 1, kol | b, (p1 | b) << 1, (p2 | b) >> 1);
    }
}
int main() {
    ile = 0;   // zerowanie przed testem
    cin >> n;
    szukaj(0, 0, 0, 0);
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-zbieranie-kluczy', krok: 9, level: 'trudne',
            title: 'Klucze i drzwi',
            short: 'BFS po planszy, ale stan to pole i zebrane klucze — klucze trzymasz w masce 6 bitów. To samo pole z innymi kluczami to inny stan.',
            tags: ['BFS', 'stan = (pole, maska)', 'dist[w][k][maska]'],
            statement: ['Na planszy h × w są wolne pola (.), ściany (#), start S, wyjście W, klucze a–f i drzwi A–F. W jednym ruchu przechodzisz na sąsiednie pole (góra, dół, lewo, prawo), które nie jest ścianą. Na drzwi X możesz wejść tylko wtedy, gdy masz już klucz x. Wejście na pole z kluczem zabiera klucz na zawsze. Jaka jest najmniejsza liczba ruchów od S do W?',
                'Zwykły BFS z lekcji Kolejka tu nie wystarczy: to samo pole z innymi kluczami w kieszeni to zupełnie inna sytuacja. Stanem jest więc trójka (wiersz, kolumna, klucze), gdzie zebrane klucze to maska 6 bitów (klucz a — bit 0, …, f — bit 5). Stanów jest najwyżej 50 · 50 · 64 = 160 000. Jeśli wyjścia nie da się osiągnąć, wypisz −1.'],
            input_format: ['W pierwszym wierszu liczby h i w.', 'W każdym z kolejnych h wierszy napis z w znaków: ., #, S, W, a–f, A–F.'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów albo −1.'],
            constraints: ['2 ≤ h, w ≤ 50', 'Na planszy jest dokładnie jedno S i jedno W, a każdy klucz występuje najwyżej raz (drzwi mogą się powtarzać).'],
            examples: [{ input: '3 5\nSa.A.\n###.#\nW.B.b', note: 'Bierzemy klucz a (1 ruch), przechodzimy przez drzwi A i schodzimy na dół (5. ruch), zabieramy klucz b (6), wracamy przez drzwi B do wyjścia — razem 10 ruchów.' },
                { input: '2 3\nS#W\n.A.', note: 'Do wyjścia prowadzą tylko drzwi A, a klucza a na planszy nie ma: −1.' }],
            hint: R`int dist[50][50][64]; wypełnij -1. Kolejka trójek {w, k, m}. Z (w, k, m) idź na sąsiada (nw, nk): ściana — nie; drzwi X — tylko gdy (m >> (X - 'A')) & 1; nowa maska nm = m, a jeśli na polu jest klucz x, to nm |= 1 << (x - 'a'). Jeśli dist[nw][nk][nm] == -1 — wstaw. Wynik: pierwszy zdjęty stan na polu W.`,
            tests: (r) => {
                const plansza = (h, w, sciany, klucze, drzwi, zamknijE) => {
                    for (;;) {
                        const g = Array.from({ length: h }, () => Array.from({ length: w }, () => (r() < sciany ? '#' : '.')));
                        const wolne = () => { for (;;) { const a = r.int(0, h - 1), b = r.int(0, w - 1); if (g[a][b] === '.') return [a, b]; } };
                        const [sa, sb] = wolne(); g[sa][sb] = 'S'; const [ea, eb] = wolne(); g[ea][eb] = 'W';
                        if (zamknijE) { const lit = 'ABCDEF'[r.int(0, Math.max(0, klucze - 1))]; for (const [da, db] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = ea + da, y = eb + db; if (x >= 0 && y >= 0 && x < h && y < w && g[x][y] !== 'S') g[x][y] = r() < 0.5 ? lit : '#'; } }
                        for (let k = 0; k < klucze; k++) { const [a, b] = wolne(); g[a][b] = 'abcdef'[k]; }
                        for (let k = 0; k < drzwi; k++) { const [a, b] = wolne(); g[a][b] = 'ABCDEF'[r.int(0, 5)]; }
                        if (g.flat().filter((c) => c === 'S').length === 1 && g.flat().filter((c) => c === 'W').length === 1) return `${h} ${w}\n${g.map((x) => x.join('')).join('\n')}`;
                    }
                };
                const t = ['3 5\nSa.A.\n###.#\nW.B.b', '2 3\nS#W\n.A.', '2 2\nSW\n..', '2 2\nS#\n#W'];
                t.push(plansza(50, 50, 0.25, 6, 40, true), plansza(50, 50, 0.3, 6, 80, true), plansza(50, 50, 0.1, 3, 20, true), plansza(30, 40, 0.35, 6, 30, false), plansza(50, 50, 0.2, 0, 0, false), plansza(20, 20, 0.2, 2, 10, true), plansza(50, 50, 0.15, 6, 200, true), plansza(10, 50, 0.3, 4, 15, true));
                return t;
            },
            check: (inp) => { const l = L(inp); const [h, w] = l[0].split(' ').map(Number); if (!calk(h, 2, 50) || !calk(w, 2, 50) || l.length !== h + 1) return 'dane'; const g = l.slice(1); if (!g.every((x) => x.length === w && /^[.#SWa-fA-F]+$/.test(x))) return 'plansza'; const all = g.join(''); if (all.split('S').length !== 2 || all.split('W').length !== 2) return 'S/W'; for (const k of 'abcdef') if (all.split(k).length > 2) return 'klucz'; return null; },
            solve: (inp) => {
                const l = L(inp); const [h, w] = l[0].split(' ').map(Number); const g = l.slice(1);
                const dist = new Int32Array(h * w * 64).fill(-1); const q = new Int32Array(h * w * 64); let qh = 0, qt = 0;
                let s = 0; for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (g[i][j] === 'S') s = i * w + j;
                dist[s * 64] = 0; q[qt++] = s * 64;
                while (qh < qt) {
                    const st = q[qh++]; const m = st & 63, pole = st >> 6; const i = Math.floor(pole / w), j = pole % w;
                    if (g[i][j] === 'W') return String(dist[st]);
                    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                        const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= h || b >= w) continue; const c = g[a][b];
                        if (c === '#') continue; if (c >= 'A' && c <= 'F' && !((m >> (c.charCodeAt(0) - 65)) & 1)) continue;
                        let nm = m; if (c >= 'a' && c <= 'f') nm |= 1 << (c.charCodeAt(0) - 97);
                        const ns = (a * w + b) * 64 + nm; if (dist[ns] < 0) { dist[ns] = dist[st] + 1; q[qt++] = ns; }
                    }
                }
                return '-1';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int dist[50][50][64];
int main() {
    int h, w;
    cin >> h >> w;
    vector<string> g(h);
    for (auto &s : g) cin >> s;
    memset(dist, -1, sizeof(dist));
    queue<array<int, 3>> q;
    for (int i = 0; i < h; i++)
        for (int j = 0; j < w; j++)
            if (g[i][j] == 'S') {
                dist[i][j][0] = 0;
                q.push({i, j, 0});
            }
    int dw[4] = {1, -1, 0, 0}, dk[4] = {0, 0, 1, -1};
    int wynik = -1;
    while (!q.empty()) {
        auto [i, j, m] = q.front();
        q.pop();
        if (g[i][j] == 'W') {
            wynik = dist[i][j][m];
            break;
        }
        for (int d = 0; d < 4; d++) {
            int a = i + dw[d], b = j + dk[d];
            if (a < 0 || b < 0 || a >= h || b >= w) continue;
            char c = g[a][b];
            if (c == '#') continue;
            if (c >= 'A' && c <= 'F' && !((m >> (c - 'A')) & 1)) continue;
            int nm = m;
            if (c >= 'a' && c <= 'f') nm |= 1 << (c - 'a');
            if (dist[a][b][nm] == -1) {
                dist[a][b][nm] = dist[i][j][m] + 1;
                q.push({a, b, nm});
            }
        }
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'ld-b-final-procesor', krok: 9, level: 'trudne',
            title: 'Wielki finał: mały procesor 8-bitowy',
            short: 'Napisz symulator procesora z czterema rejestrami 8-bitowymi, flagami zera i przeniesienia, działaniami bitowymi, przesunięciami i skokami. PRINT pokazuje rejestr dziesiętnie, dwójkowo, szesnastkowo i w kodzie U2.',
            tags: ['zawijanie mod 256', 'flagi Z i P', 'symulacja z skokami'],
            statement: ['Mały procesor ma cztery rejestry A, B, C, D — każdy to 8 bitów, czyli liczba od 0 do 255 — oraz dwie flagi: Z (wynik był zerem) i P (przeniesienie). Na początku wszystko jest zerem. Program to n linii ponumerowanych od 1, w każdej jedno polecenie. Procesor zaczyna od linii 1 i wykonuje polecenia po kolei, chyba że skok każe przejść gdzie indziej. Kończy pracę po HALT albo po wyjściu za ostatnią linię.',
                'Polecenia z wynikiem (r to rejestr, v — rejestr albo liczba od 0 do 255): MOV r v — r = v (flagi bez zmian). ADD r v — r = (r + v) mod 256, P = 1, gdy r + v > 255. SUB r v — r = (r − v) mod 256, P = 1, gdy r < v. AND r v, OR r v, XOR r v — działanie bitowe, P = 0. NOT r — odwraca wszystkie 8 bitów, P = 0. SHL r k i SHR r k (1 ≤ k ≤ 7) — przesunięcie o k bitów w lewo albo w prawo w obrębie 8 bitów; P = 1, gdy wypadła choć jedna jedynka. INC r i DEC r — dodanie albo odjęcie jedynki z zawinięciem; P jak przy ADD r 1 i SUB r 1. Każde polecenie z wynikiem oprócz MOV ustawia Z = 1, gdy nowa wartość r to 0, a w przeciwnym razie Z = 0.',
                'Skoki (t to numer linii): JMP t — zawsze; JZ t — gdy Z = 1; JNZ t — gdy Z = 0; JP t — gdy P = 1. PRINT r wypisuje wiersz r = d = bbbbbbbb = 0xHH = s, gdzie d to wartość rejestru, b — jego 8 bitów, HH — dwie cyfry szesnastkowe (wielkie litery), a s — wartość w kodzie U2 (d − 256, gdy d ≥ 128). HALT kończy program. Na sam koniec — zawsze — wypisz wiersz koniec: A=… B=… C=… D=… Z=… P=… ze stanem rejestrów (dziesiętnie) i flag.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z n kolejnych wierszy jedno polecenie: nazwa i argumenty oddzielone spacjami.'],
            output_format: ['Wiersze wypisane przez PRINT, a na końcu wiersz koniec: … .'],
            constraints: ['1 ≤ n ≤ 1000', 'Argumenty są poprawne: rejestry to A, B, C, D, liczby v od 0 do 255, k od 1 do 7, a numery linii w skokach od 1 do n.', 'Każdy program kończy pracę po wykonaniu najwyżej 100 000 poleceń, a PRINT wykona się najwyżej 500 razy.'],
            examples: [{ input: '8\nMOV A 200\nMOV B 100\nADD A B\nPRINT A\nJP 7\nHALT\nPRINT B\nHALT', note: '200 + 100 = 300, a 300 mod 256 = 44 i P = 1 — dlatego JP skacze do linii 7 i wypisuje jeszcze B. 44 = 00101100 = 0x2C.' },
                { input: '8\nMOV A 5\nMOV B 0\nADD B A\nDEC A\nJNZ 3\nPRINT B\nNOT B\nPRINT B', note: 'Pętla w liniach 3–5 dodaje 5 + 4 + 3 + 2 + 1 = 15. Po odjęciu jedynki od 1 wychodzi 0, Z = 1 i JNZ już nie skacze. NOT zamienia 00001111 na 11110000 = 240, czyli −16 w kodzie U2.' }],
            hint: R`Trzymaj int R[4], Z, P i wczytaj program do vector<string> op oraz argumentów (liczba argumentów zależy od nazwy polecenia). Pomocnicza funkcja int wart(string v) zwraca R[v[0] - 'A'], gdy v to nazwa rejestru, albo stoi(v). Po każdym poleceniu z wynikiem r &= 255 i Z = (r == 0). Pętla wykonania: int i = 1; while (i >= 1 && i <= n) { … i = nastepna; }.`,
            tests: (r) => {
                const REJ = ['A', 'B', 'C', 'D'];
                const v = () => (r() < 0.5 ? r.pick(REJ) : String(r.int(0, 255)));
                const losPol = (n, skoki) => {
                    const p = r();
                    if (skoki && p < 0.12) return `${r.pick(['JMP', 'JZ', 'JNZ', 'JP', 'JZ', 'JNZ'])} ${r.int(1, n)}`;
                    if (p < 0.2) return `PRINT ${r.pick(REJ)}`;
                    if (p < 0.204) return 'HALT';
                    const op = r.pick(['MOV', 'ADD', 'SUB', 'AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR', 'INC', 'DEC', 'ADD', 'SUB', 'MOV']);
                    if (op === 'NOT' || op === 'INC' || op === 'DEC') return `${op} ${r.pick(REJ)}`;
                    if (op === 'SHL' || op === 'SHR') return `${op} ${r.pick(REJ)} ${r.int(1, 7)}`;
                    return `${op} ${r.pick(REJ)} ${v()}`;
                };
                const program = (n, skoki) => { for (;;) { const pr = Array.from({ length: n }, () => losPol(n, skoki)); const txt = `${n}\n${pr.join('\n')}`; const w = procesor(txt); if (w.ok && w.wypisy > 0 && w.wypisy <= 500) return txt; } };
                const t = [
                    '8\nMOV A 200\nMOV B 100\nADD A B\nPRINT A\nJP 7\nHALT\nPRINT B\nHALT',
                    '8\nMOV A 5\nMOV B 0\nADD B A\nDEC A\nJNZ 3\nPRINT B\nNOT B\nPRINT B',
                    '1\nHALT',
                    // mnożenie przez przesunięcia i dodawanie: 13 · 11 i 20 · 15 (z zawinięciem)
                    '13\nMOV A 13\nMOV B 11\nMOV C 0\nMOV D 8\nSHR B 1\nJP 8\nJMP 9\nADD C A\nSHL A 1\nDEC D\nJNZ 5\nPRINT C\nHALT',
                    '13\nMOV A 20\nMOV B 15\nMOV C 0\nMOV D 8\nSHR B 1\nJP 8\nJMP 9\nADD C A\nSHL A 1\nDEC D\nJNZ 5\nPRINT C\nHALT',
                    // liczenie jedynek w A = 181
                    '10\nMOV A 181\nMOV B 0\nMOV C 8\nSHR A 1\nJP 7\nJMP 8\nINC B\nDEC C\nJNZ 4\nPRINT B',
                    // ciąg Fibonacciego mod 256
                    '9\nMOV A 0\nMOV B 1\nMOV D 15\nPRINT A\nMOV C A\nADD C B\nMOV A B\nMOV B C\nDEC D',
                    '12\nMOV A 0\nMOV B 1\nMOV D 15\nPRINT A\nMOV C A\nADD C B\nMOV A B\nMOV B C\nDEC D\nJNZ 4\nPRINT D\nPRINT C',
                    // odliczanie przez zero: 3, 2, 1, 0, 255 (−1)
                    '6\nMOV A 3\nPRINT A\nDEC A\nJP 6\nJMP 2\nPRINT A',
                    // wszystkie polecenia po kolei
                    '20\nMOV A 170\nMOV B 85\nOR A B\nPRINT A\nAND A B\nPRINT A\nMOV A 240\nXOR A 255\nPRINT A\nNOT A\nPRINT A\nSHL A 3\nPRINT A\nSHR A 7\nPRINT A\nSUB A 1\nPRINT A\nINC A\nJZ 20\nPRINT A',
                    // dwie pętle jedna w drugiej — około 90 000 wykonanych poleceń
                    '10\nMOV D 90\nMOV C 250\nADD A 3\nXOR B A\nDEC C\nJNZ 3\nPRINT A\nPRINT B\nDEC D\nJNZ 2',
                    program(200, false), program(500, false), program(300, true), program(1000, true), program(60, true), program(150, true),
                ];
                return t;
            },
            check: (inp) => { const w = procesor(inp, true); return w.ok && w.wypisy <= 500 ? null : 'program: ' + w.blad; },
            solve: (inp) => procesor(inp).wyjscie,
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int R[4], Z, P;
bool czyRej(const string &s) { return s.size() == 1 && s[0] >= 'A' && s[0] <= 'D'; }
int wart(const string &s) { return czyRej(s) ? R[s[0] - 'A'] : stoi(s); }
void wypisz(char nazwa, int d) {
    string cyfry = "0123456789ABCDEF";
    cout << nazwa << " = " << d << " = ";
    for (int k = 7; k >= 0; k--) cout << ((d >> k) & 1);
    cout << " = 0x" << cyfry[d >> 4] << cyfry[d & 15] << " = " << (d >= 128 ? d - 256 : d) << "\n";
}
int main() {
    R[0] = R[1] = R[2] = R[3] = 0;   // zerowanie przed testem
    Z = P = 0;
    int n;
    cin >> n;
    vector<string> op(n + 1), x(n + 1), y(n + 1);
    for (int i = 1; i <= n; i++) {
        cin >> op[i];
        string o = op[i];
        if (o == "HALT") continue;
        cin >> x[i];
        if (o == "MOV" || o == "ADD" || o == "SUB" || o == "AND" || o == "OR" || o == "XOR" || o == "SHL" || o == "SHR") cin >> y[i];
    }
    int i = 1;
    while (i >= 1 && i <= n) {
        string o = op[i];
        int nast = i + 1;
        if (o == "HALT") break;
        if (o == "JMP" || o == "JZ" || o == "JNZ" || o == "JP") {
            int t = stoi(x[i]);
            if (o == "JMP" || (o == "JZ" && Z) || (o == "JNZ" && !Z) || (o == "JP" && P)) nast = t;
        } else if (o == "PRINT") {
            wypisz(x[i][0], R[x[i][0] - 'A']);
        } else {
            int &r = R[x[i][0] - 'A'];
            if (o == "MOV") r = wart(y[i]);
            else {
                if (o == "ADD") { int v = wart(y[i]); P = r + v > 255; r = (r + v) & 255; }
                else if (o == "SUB") { int v = wart(y[i]); P = r < v; r = (r - v) & 255; }
                else if (o == "AND") { r &= wart(y[i]); P = 0; }
                else if (o == "OR") { r |= wart(y[i]); P = 0; }
                else if (o == "XOR") { r ^= wart(y[i]); P = 0; }
                else if (o == "NOT") { r = ~r & 255; P = 0; }
                else if (o == "SHL") { int k = stoi(y[i]); P = (r << k) > 255; r = (r << k) & 255; }
                else if (o == "SHR") { int k = stoi(y[i]); P = (r & ((1 << k) - 1)) != 0; r >>= k; }
                else if (o == "INC") { P = r == 255; r = (r + 1) & 255; }
                else if (o == "DEC") { P = r == 0; r = (r - 1) & 255; }
                Z = r == 0;
            }
        }
        i = nast;
    }
    cout << "koniec: A=" << R[0] << " B=" << R[1] << " C=" << R[2] << " D=" << R[3] << " Z=" << Z << " P=" << P << "\n";
    return 0;
}`,
        },
    ];
};

// Symulator procesora z finału (wzorzec dla testów). spr = true — tylko sprawdza poprawność programu.
function procesor(inp, spr = false) {
    const l = inp.split('\n');
    const n = Number(l[0]);
    const w = { ok: false, wypisy: 0, wyjscie: '', blad: '' };
    if (!Number.isInteger(n) || n < 1 || n > 1000 || l.length !== n + 1) { w.blad = 'n'; return w; }
    const REJ = { A: 0, B: 1, C: 2, D: 3 };
    const czyV = (s) => s in REJ || (/^\d{1,3}$/.test(s) && Number(s) <= 255);
    const pr = [null];
    for (let i = 1; i <= n; i++) {
        const p = l[i].split(' ');
        const o = p[0];
        const dwa = ['MOV', 'ADD', 'SUB', 'AND', 'OR', 'XOR'];
        let dobre = false;
        if (o === 'HALT') dobre = p.length === 1;
        else if (dwa.includes(o)) dobre = p.length === 3 && p[1] in REJ && czyV(p[2]);
        else if (o === 'SHL' || o === 'SHR') dobre = p.length === 3 && p[1] in REJ && /^[1-7]$/.test(p[2]);
        else if (['NOT', 'INC', 'DEC', 'PRINT'].includes(o)) dobre = p.length === 2 && p[1] in REJ;
        else if (['JMP', 'JZ', 'JNZ', 'JP'].includes(o)) dobre = p.length === 2 && /^\d+$/.test(p[1]) && Number(p[1]) >= 1 && Number(p[1]) <= n;
        if (!dobre) { w.blad = `linia ${i}: ${l[i]}`; return w; }
        pr.push(p);
    }
    const R = [0, 0, 0, 0];
    let Z = 0, P = 0, i = 1, kroki = 0;
    const out = [];
    const wart = (s) => (s in REJ ? R[REJ[s]] : Number(s));
    while (i >= 1 && i <= n) {
        if (++kroki > 100000) { w.blad = 'za dużo kroków'; return w; }
        const [o, a, b] = pr[i];
        let nast = i + 1;
        if (o === 'HALT') break;
        if (o === 'JMP' || o === 'JZ' || o === 'JNZ' || o === 'JP') {
            if (o === 'JMP' || (o === 'JZ' && Z) || (o === 'JNZ' && !Z) || (o === 'JP' && P)) nast = Number(a);
        } else if (o === 'PRINT') {
            const d = R[REJ[a]];
            out.push(`${a} = ${d} = ${d.toString(2).padStart(8, '0')} = 0x${d.toString(16).toUpperCase().padStart(2, '0')} = ${d >= 128 ? d - 256 : d}`);
            if (out.length > 500) { w.blad = 'za dużo PRINT'; return w; }
        } else {
            const k = REJ[a];
            let r = R[k];
            if (o === 'MOV') r = wart(b);
            else {
                if (o === 'ADD') { const v = wart(b); P = r + v > 255 ? 1 : 0; r = (r + v) & 255; }
                else if (o === 'SUB') { const v = wart(b); P = r < v ? 1 : 0; r = (r - v) & 255; }
                else if (o === 'AND') { r &= wart(b); P = 0; }
                else if (o === 'OR') { r |= wart(b); P = 0; }
                else if (o === 'XOR') { r ^= wart(b); P = 0; }
                else if (o === 'NOT') { r = ~r & 255; P = 0; }
                else if (o === 'SHL') { const s = Number(b); P = (r << s) > 255 ? 1 : 0; r = (r << s) & 255; }
                else if (o === 'SHR') { const s = Number(b); P = (r & ((1 << s) - 1)) !== 0 ? 1 : 0; r >>= s; }
                else if (o === 'INC') { P = r === 255 ? 1 : 0; r = (r + 1) & 255; }
                else if (o === 'DEC') { P = r === 0 ? 1 : 0; r = (r - 1) & 255; }
                Z = r === 0 ? 1 : 0;
            }
            R[k] = r;
        }
        i = nast;
    }
    out.push(`koniec: A=${R[0]} B=${R[1]} C=${R[2]} D=${R[3]} Z=${Z} P=${P}`);
    w.ok = true; w.wypisy = out.length - 1; w.wyjscie = out.join('\n');
    void spr;
    return w;
}
