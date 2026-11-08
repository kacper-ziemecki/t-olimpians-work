// String — baza zadań na koniec lekcji: od rozgrzewki z jednym pomysłem (akronimy, hashtagi, język P, wisielec),
// przez zadania średnie (GA-DE-RY-PO-LU-KI, PESEL, Morse, krzyżówka, IBAN) po trudne (okres napisu, justowanie,
// palindromy, olbrzymy, kwota słownie) i wielki finał: edytor tekstu. Zadania idą od łatwych przez średnie do trudnych.
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const SLOWA = ['kot', 'pies', 'dom', 'ala', 'ma', 'kota', 'szkola', 'olimpiada', 'program', 'tablica', 'napis', 'litera',
        'zadanie', 'komputer', 'klawiatura', 'ekran', 'myszka', 'kajak', 'anna', 'radar', 'zeszyt', 'lekcja', 'matematyka',
        'informatyka', 'jablko', 'gruszka', 'sliwka', 'banan', 'wisnia', 'kotek', 'kotlet', 'okno', 'domek', 'rower', 'samochod',
        'pociag', 'samolot', 'statek', 'las', 'rzeka', 'gora', 'morze', 'slonce', 'ksiezyc', 'gwiazda', 'deszcz', 'snieg', 'wiatr',
        'burza', 'tecza', 'oraz', 'albo', 'bardzo', 'dzisiaj', 'jutro', 'tama', 'arbuz', 'zebra', 'anakonda', 'aparat', 'traktor'];
    const lines = (s) => s.split('\n');
    const word = (r, a, b) => r.word(r.int(a, b));
    const slowo = (r) => r.pick(SLOWA);
    const zdanie = (r, a, b) => Array.from({ length: r.int(a, b) }, () => slowo(r)).join(' ');
    const mix = (r, s, p = 0.5) => [...s].map((c) => (r() < p ? c.toUpperCase() : c)).join('');
    const znaki = (r, n, alfabet) => Array.from({ length: n }, () => alfabet[Math.floor(r() * alfabet.length)]).join('');
    const isUp = (c) => c >= 'A' && c <= 'Z';
    const isLow = (c) => c >= 'a' && c <= 'z';
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const WIELKIE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const CYFRY = '0123456789';
    const liczba = (r, d) => (d === 1 ? r.pick(CYFRY) : r.pick('123456789') + znaki(r, d - 1, CYFRY));
    const p2 = (x) => String(x).padStart(2, '0');

    // Liczby rzymskie (do testów)
    const rzym = (n) => {
        const W = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
        let s = '';
        for (const [v, z] of W) while (n >= v) { s += z; n -= v; }
        return s;
    };
    // Alfabet Morse'a
    const MORSE = ['.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....', '..', '.---', '-.-', '.-..', '--', '-.', '---', '.--.', '--.-', '.-.', '...', '-', '..-', '...-', '.--', '-..-', '-.--', '--..'];
    // PESEL
    const WAGI = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const kontrolna = (s10) => (10 - ([...s10].reduce((a, c, i) => a + Number(c) * WAGI[i], 0) % 10)) % 10;
    // IBAN: reszta z dzielenia przez 97 po przestawieniu i zamianie liter na liczby
    const mod97 = (s) => { let r = 0; for (const c of s) { if (c >= '0' && c <= '9') r = (r * 10 + Number(c)) % 97; else r = (r * 100 + (c.charCodeAt(0) - 55)) % 97; } return r; };
    // Kwota słownie
    const J = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'piec', 'szesc', 'siedem', 'osiem', 'dziewiec'];
    const N = ['dziesiec', 'jedenascie', 'dwanascie', 'trzynascie', 'czternascie', 'pietnascie', 'szesnascie', 'siedemnascie', 'osiemnascie', 'dziewietnascie'];
    const D = ['', '', 'dwadziescia', 'trzydziesci', 'czterdziesci', 'piecdziesiat', 'szescdziesiat', 'siedemdziesiat', 'osiemdziesiat', 'dziewiecdziesiat'];
    const S = ['', 'sto', 'dwiescie', 'trzysta', 'czterysta', 'piecset', 'szescset', 'siedemset', 'osiemset', 'dziewiecset'];
    const trzy = (x) => { const w = []; const s = Math.floor(x / 100), d = Math.floor(x / 10) % 10, j = x % 10; if (s) w.push(S[s]); if (d === 1) w.push(N[j]); else { if (d) w.push(D[d]); if (j) w.push(J[j]); } return w; };
    const slownie = (n) => {
        if (n === 0) return 'zero';
        const t = Math.floor(n / 1000), r = n % 1000, w = [];
        if (t === 1) w.push('tysiac');
        else if (t > 1) { w.push(...trzy(t)); const j = t % 10, dz = t % 100; w.push(j >= 2 && j <= 4 && !(dz >= 12 && dz <= 14) ? 'tysiace' : 'tysiecy'); }
        if (r) w.push(...trzy(r));
        return w.join(' ');
    };
    // Edytor tekstu — wspólny symulator dla generatora testów i wzorcówki
    const edytuj = (s, polecenia, out) => {
        for (const p of polecenia) {
            const t = p.split(' ');
            if (t[0] === 'WSTAW') { const k = Number(t[1]); s = s.slice(0, k) + t[2] + s.slice(k); }
            else if (t[0] === 'USUN') { const k = Number(t[1]), d = Number(t[2]); s = s.slice(0, k) + s.slice(k + d); }
            else if (t[0] === 'ZAMIEN') { const a = t[1], b = t[2]; let q = s.indexOf(a); while (q !== -1) { s = s.slice(0, q) + b + s.slice(q + a.length); q = s.indexOf(a, q + b.length); } }
            else if (t[0] === 'WIELKIE') s = s.toUpperCase();
            else if (t[0] === 'MALE') s = s.toLowerCase();
            else if (t[0] === 'ODWROC') s = [...s].reverse().join('');
            else if (t[0] === 'ZLICZ') { let k = 0, q = s.indexOf(t[1]); while (q !== -1) { k++; q = s.indexOf(t[1], q + 1); } if (out) out.push(String(k)); }
            else if (t[0] === 'POKAZ') { if (out) out.push(s.length ? s : 'PUSTY'); }
        }
        return s;
    };

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'str-b-akronim', krok: 9, level: 'latwe',
            title: 'Akronim',
            short: 'polski zwiazek wedkarski → PZW: pierwsze litery słów, wielkimi literami.',
            tags: ['while (cin >> s)', 's[0]', 'toupper'],
            statement: ['Akronim to skrót złożony z pierwszych liter kolejnych słów, pisany wielkimi literami — jak PZW (Polski Związek Wędkarski) albo ZUS. Wczytaj nazwę i wypisz jej akronim.'],
            input_format: ['Jeden wiersz: słowa oddzielone spacjami.'],
            output_format: ['Akronim.'],
            constraints: ['Nazwa ma od 1 do 50 słów, każde od 1 do 20 liter.'],
            examples: [{ input: 'polski zwiazek wedkarski' }, { input: 'Olimpiada Informatyczna Juniorow' }],
            hint: R`Wczytuj słowa pętlą while (cin >> s) i do wyniku dopisuj (char)toupper(s[0]).`,
            tests: (r) => ['polski zwiazek wedkarski', 'Olimpiada Informatyczna Juniorow', 'x', 'zaklad ubezpieczen spolecznych',
                Array.from({ length: 10 }, () => mix(r, word(r, 1, 20), 0.2)).join(' '), Array.from({ length: 50 }, () => mix(r, slowo(r), r.pick([0, 0.5, 1]))).join(' ')],
            solve: (inp) => toks(inp).map((w) => w[0].toUpperCase()).join(''),
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, w = "";
    while (cin >> s) {
        w += (char)toupper(s[0]);
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-hashtag', krok: 9, level: 'latwe',
            title: 'Hashtag',
            short: 'wakacje nad MORZEM → #WakacjeNadMorzem: bez spacji, każde słowo z wielkiej litery.',
            tags: ['tolower', 'toupper', 'budowanie'],
            statement: ['Zamień tekst na hashtag: na początku znak #, potem wszystkie słowa sklejone bez spacji, przy czym każde słowo zaczyna się wielką literą, a jego pozostałe litery są małe.'],
            input_format: ['Jeden wiersz: słowa z liter oddzielone spacjami (czasem kilkoma).'],
            output_format: ['Hashtag.'],
            constraints: ['Tekst ma od 1 do 30 słów, każde od 1 do 20 liter.'],
            examples: [{ input: 'ala ma kota' }, { input: 'wakacje  nad MORZEM' }],
            hint: R`Słowa wczytuj przez cin >> s — sam pominie podwójne spacje. Każde słowo zamień na małe litery, potem s[0] = toupper(s[0]); i dopisz do wyniku, który zaczyna się od "#".`,
            tests: (r) => ['ala ma kota', 'wakacje  nad MORZEM', 'X', Array.from({ length: 30 }, () => mix(r, word(r, 1, 20), 0.3)).join(r.pick([' ', '  '])), mix(r, zdanie(r, 5, 10), 0.5)],
            solve: (inp) => '#' + toks(inp).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, w = "#";
    while (cin >> s) {
        for (char &c : s) c = tolower(c);
        s[0] = toupper(s[0]);
        w += s;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-bez-powtorzen', krok: 9, level: 'latwe',
            title: 'Usuń powtórzenia obok siebie',
            short: 'aaabccddd → abcd: z każdej serii takich samych liter zostaw jedną.',
            tags: ['s[i] != s[i - 1]', 'serie', 'budowanie'],
            statement: ['Klawiatura się zacina i czasem ta sama litera wpisuje się kilka razy pod rząd. Napraw słowo: z każdej serii takich samych liter stojących obok siebie zostaw tylko jedną.'],
            input_format: ['Jeden wiersz ze słowem z małych liter.'],
            output_format: ['Słowo bez powtórzeń obok siebie.'],
            constraints: ['Słowo ma od 1 do 10 000 liter.'],
            examples: [{ input: 'aaabccddd' }, { input: 'mississippi', note: 'Powtórzenia obok siebie to ss, ss i pp — zostaje po jednej literze z każdej pary.' }],
            hint: R`Buduj nowy napis: znak s[i] dopisuj, gdy i == 0 albo s[i] != s[i - 1]. Pierwszy znak dopisujesz zawsze.`,
            tests: (r) => ['aaabccddd', 'mississippi', 'a', 'aaaa', 'abab', [...word(r, 50, 100)].map((c) => c.repeat(r.int(1, 4))).join(''), znaki(r, 10000, 'ab'), [...word(r, 2000, 2000)].map((c) => c.repeat(r.int(1, 5))).join('').slice(0, 10000)],
            solve: (inp) => [...inp].filter((c, i) => i === 0 || c !== inp[i - 1]).join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, w = "";
    cin >> s;
    int n = s.length();
    for (int i = 0; i < n; i++) {
        if (i == 0 || s[i] != s[i - 1]) {
            w += s[i];
        }
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-jezyk-p', krok: 9, level: 'latwe',
            title: 'Język P',
            short: 'kot → kopot: po każdej samogłosce dopisz p i tę samą samogłoskę. Tajny język z podwórka.',
            tags: ['find w napisie samogłosek', 'budowanie', 'getline'],
            statement: ['Dzieci na podwórku rozmawiają tajnym językiem P: po każdej samogłosce dopisują literę p i tę samą samogłoskę jeszcze raz. „kot” to „kopot”, a „ala ma kota” — „apalapa mapa kopotapa”. Samogłoski to a, e, i, o, u, y. Przetłumacz tekst na język P.'],
            input_format: ['Jeden wiersz: małe litery i spacje.'],
            output_format: ['Tekst w języku P.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'ala ma kota' }, { input: 'programowanie jest super' }],
            hint: R`Buduj nowy napis. Każdy znak dopisuj, a jeśli jest samogłoską — dopisz jeszcze 'p' i ten sam znak. Samogłoskę rozpoznasz krótko: string sam = "aeiouy"; i warunek sam.find(c) != string::npos.`,
            tests: (r) => ['ala ma kota', 'programowanie jest super', 'krtn', 'aeiouy', zdanie(r, 10, 20), zdanie(r, 100, 200).slice(0, 1000).trim()],
            solve: (inp) => [...inp].map((c) => ('aeiouy'.includes(c) ? c + 'p' + c : c)).join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, w = "", sam = "aeiouy";
    getline(cin, s);
    for (char c : s) {
        w += c;
        if (sam.find(c) != string::npos) {
            w += 'p';
            w += c;
        }
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-rymy', krok: 9, level: 'latwe',
            title: 'Czy to się rymuje?',
            short: 'Dwa słowa rymują się, gdy kończą się tymi samymi dwiema literami. kot i plot — tak.',
            tags: ['substr(n - 2)', '==', 'n par'],
            statement: ['Młody poeta uznaje, że dwa słowa się rymują, gdy kończą się tymi samymi dwiema literami — jak „kot” i „plot” albo „lato” i „blato”. Dla każdej z n par słów wypisz TAK, jeśli się rymują, albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwa słowa.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', 'Każde słowo ma od 2 do 30 małych liter.'],
            examples: [{ input: '3\nkot plot\nlato zima\nmama tama' }],
            hint: R`Ostatnie dwie litery słowa a to a.substr(a.length() - 2). Porównaj je z ostatnimi dwiema literami b.`,
            tests: (r) => {
                const para = () => { const k = word(r, 2, 2); return r() < 0.5 ? `${word(r, 0, 10)}${k} ${word(r, 0, 10)}${k}` : `${word(r, 2, 30)} ${word(r, 2, 30)}`; };
                return ['3\nkot plot\nlato zima\nmama tama', '2\nab ab\nab ba', `100\n${Array.from({ length: 100 }, para).join('\n')}`];
            },
            check: (inp) => (toks(inp).slice(1).every((w) => w.length >= 2) ? null : 'za krótkie słowo'),
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) out.push(t[1 + 2 * i].slice(-2) === t[2 + 2 * i].slice(-2) ? 'TAK' : 'NIE'); return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string a, b;
        cin >> a >> b;
        if (a.substr(a.length() - 2) == b.substr(b.length() - 2)) {
            cout << "TAK\n";
        } else {
            cout << "NIE\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-b-lancuch-slow', krok: 9, level: 'latwe',
            title: 'Łańcuch słów',
            short: 'Gra w słowa: każde słowo zaczyna się na ostatnią literę poprzedniego. Kto pierwszy złamał zasadę?',
            tags: ['s[0]', 'ostatnia litera', 'poprzednie słowo'],
            statement: ['W grze w słowa każdy gracz mówi słowo, które zaczyna się na ostatnią literę słowa poprzedniego gracza: kot, tama, arbuz, zebra… Wczytaj n słów z jednej rozgrywki. Jeśli wszystkie przestrzegają zasady, wypisz TAK. W przeciwnym razie wypisz NIE i numer pierwszego słowa, które zasadę złamało (słowa numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów.'],
            output_format: ['TAK albo NIE i numer słowa.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 20 małych liter.'],
            examples: [{ input: '5\nkot tama arbuz zebra anakonda' }, { input: '4\nkot tama mysz zebra', note: 'tama kończy się na a, a mysz zaczyna na m — trzecie słowo łamie zasadę.' }],
            hint: R`Pamiętaj poprzednie słowo. Dla każdego kolejnego sprawdź, czy s[0] == poprzednie[poprzednie.length() - 1]. Przy pierwszym błędzie wypisz NIE i numer, i zakończ program.`,
            tests: (r) => {
                const lancuch = (n) => { const w = [word(r, 1, 20)]; for (let i = 1; i < n; i++) { const p = w[i - 1]; w.push(p[p.length - 1] + r.word(r.int(0, 19))); } return w; };
                const zepsuj = (w) => { const v = w.slice(); const i = r.int(1, v.length - 1); v[i] = (v[i][0] === 'z' ? 'a' : 'z') + v[i].slice(1); return v; };
                return ['5\nkot tama arbuz zebra anakonda', '4\nkot tama mysz zebra', '1\nx', '2\nab ba', '2\nab ab', `20\n${lancuch(20).join(' ')}`, `1000\n${lancuch(1000).join(' ')}`, `1000\n${zepsuj(lancuch(1000)).join(' ')}`, `30\n${zepsuj(lancuch(30)).join(' ')}`];
            },
            solve: (inp) => { const t = toks(inp); const w = t.slice(1, 1 + Number(t[0])); for (let i = 1; i < w.length; i++) if (w[i][0] !== w[i - 1][w[i - 1].length - 1]) return `NIE ${i + 1}`; return 'TAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string poprzednie, s;
    cin >> poprzednie;
    for (int i = 2; i <= n; i++) {
        cin >> s;
        if (s[0] != poprzednie[poprzednie.length() - 1]) {
            cout << "NIE " << i << "\n";
            return 0;
        }
        poprzednie = s;
    }
    cout << "TAK\n";
    return 0;
}`,
        },
        {
            id: 'str-b-wyrazy-wspak', krok: 9, level: 'latwe',
            title: 'Każde słowo wspak',
            short: 'Ala ma kota → alA am atok: odwróć każde słowo, ale zostaw kolejność słów.',
            tags: ['odwracanie', 'cin >> s', 'pętla od końca'],
            statement: ['Wczytaj zdanie i odwróć w nim każde słowo z osobna, zostawiając słowa w tej samej kolejności. Słowo to ciąg znaków bez spacji — razem z przecinkami i kropkami, które przy nim stoją. W wyniku oddziel słowa pojedynczymi spacjami.'],
            input_format: ['Jeden wiersz: słowa oddzielone spacjami.'],
            output_format: ['Zdanie z odwróconymi słowami.'],
            constraints: ['Zdanie ma od 1 do 500 słów, każde od 1 do 20 znaków.'],
            examples: [{ input: 'Ala ma kota' }, { input: 'Kot, pies i chomik.' }],
            hint: R`Wczytuj słowa przez cin >> s i każde wypisz od tyłu: for (int i = s.length() - 1; i >= 0; i--) cout << s[i];, a potem spację.`,
            tests: (r) => ['Ala ma kota', 'Kot, pies i chomik.', 'x', mix(r, zdanie(r, 10, 20), 0.2), Array.from({ length: 500 }, () => mix(r, word(r, 1, 19), 0.3) + r.pick(['', '', '', ',', '.'])).join(' ')],
            solve: (inp) => toks(inp).map((w) => [...w].reverse().join('')).join(' '),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    while (cin >> s) {
        for (int i = s.length() - 1; i >= 0; i--) {
            cout << s[i];
        }
        cout << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-litery-po-kolei', krok: 9, level: 'latwe',
            title: 'Litery po kolei',
            short: 'programowanie → aaegimnooprrw: ułóż litery alfabetycznie, licząc je w tablicy.',
            tags: ['int ile[26]', "string(k, c)", 'sortowanie przez zliczanie'],
            statement: ['Wczytaj słowo i wypisz jego litery ułożone w kolejności alfabetycznej. Każda litera ma wystąpić tyle razy, ile razy występuje w słowie.'],
            input_format: ['Jeden wiersz ze słowem z małych liter.'],
            output_format: ['Litery słowa w kolejności alfabetycznej.'],
            constraints: ['Słowo ma od 1 do 20 000 liter.'],
            examples: [{ input: 'programowanie' }, { input: 'kajak' }],
            hint: R`Sortowania jeszcze nie znasz, ale nie jest potrzebne. Policz litery w tablicy ile[26], a potem dla każdej litery od a do z dopisz ją tyle razy, ile wystąpiła: w += string(ile[k], (char)('a' + k));.`,
            tests: (r) => ['programowanie', 'kajak', 'z', 'zyxwvutsrqponmlkjihgfedcba', word(r, 50, 100), znaki(r, 20000, LITERY), znaki(r, 20000, 'zyx')],
            solve: (inp) => [...inp].sort().join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int ile[26] = {};
    for (char c : s) {
        ile[c - 'a']++;
    }
    string w = "";
    for (int k = 0; k < 26; k++) {
        w += string(ile[k], (char)('a' + k));
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-wisielec', krok: 9, level: 'latwe',
            title: 'Wisielec',
            short: 'Pokaż odgadnięte litery hasła, a w miejsce reszty podkreślniki. Ile było pudeł?',
            tags: ['bool odgadniete[26]', 'budowanie', 'różne litery'],
            statement: ['W grze w wisielca gracz zgaduje litery ukrytego słowa. Wczytaj słowo i napis z literami, które gracz już podał (mogą się powtarzać). W pierwszym wierszu wypisz słowo, w którym odgadnięte litery są widoczne, a każda nieodgadnięta zastąpiona jest znakiem _. W drugim wierszu wypisz liczbę pudeł, czyli różnych podanych liter, których w słowie nie ma.'],
            input_format: ['W pierwszym wierszu ukryte słowo.', 'W drugim wierszu podane litery (bez spacji).'],
            output_format: ['Dwa wiersze: słowo z odgadniętymi literami i liczba pudeł.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.', 'Podanych liter jest od 1 do 100 (małe litery).'],
            examples: [{ input: 'kotek\neakza', note: 'Litery e i k są w słowie. Pudła to a i z — a podane dwa razy liczy się jako jedno pudło.' }],
            hint: R`Zaznacz podane litery w tablicy bool podane[26] = {};, a litery słowa — w bool wSlowie[26] = {};. Wzór słowa budujesz pętlą po słowie: podane[c - 'a'] ? c : '_'. Pudła to litery k, dla których podane[k] i !wSlowie[k].`,
            tests: (r) => ['kotek\neakza', 'a\na', 'a\nb', 'olimpiada\nxyzq', `${slowo(r)}\n${znaki(r, 10, LITERY)}`, `${word(r, 50, 100)}\n${znaki(r, 100, LITERY)}`, `${word(r, 10, 20)}\n${znaki(r, 30, 'aeiouy')}`],
            solve: (inp) => { const [w, g] = toks(inp); const set = new Set(g); return `${[...w].map((c) => (set.has(c) ? c : '_')).join('')}\n${[...set].filter((c) => !w.includes(c)).length}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string slowo, podane;
    cin >> slowo >> podane;
    bool zgadniete[26] = {}, wSlowie[26] = {};
    for (char c : podane) zgadniete[c - 'a'] = true;
    for (char c : slowo) wSlowie[c - 'a'] = true;
    string wzor = "";
    for (char c : slowo) {
        if (zgadniete[c - 'a']) wzor += c;
        else wzor += '_';
    }
    int pudla = 0;
    for (int k = 0; k < 26; k++) {
        if (zgadniete[k] && !wSlowie[k]) pudla++;
    }
    cout << wzor << "\n" << pudla << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-sms', krok: 9, level: 'latwe',
            title: 'SMS na starym telefonie',
            short: 'Na klawiszu 2 są litery abc: a to jedno naciśnięcie, c — trzy. Ile naciśnięć zajmie SMS?',
            tags: ['tablica-ściąga', "c - 'a'", 'suma'],
            statement: ['Na starym telefonie litery są rozłożone na klawiszach: 2 — abc, 3 — def, 4 — ghi, 5 — jkl, 6 — mno, 7 — pqrs, 8 — tuv, 9 — wxyz. Żeby wpisać literę, naciska się jej klawisz tyle razy, którą jest na nim z kolei: a to 1 naciśnięcie, b — 2, c — 3, s — 4. Spacja to jedno naciśnięcie klawisza 0. Policz, ile naciśnięć potrzeba, żeby napisać wiadomość.'],
            input_format: ['Jeden wiersz: małe litery i spacje.'],
            output_format: ['Liczba naciśnięć.'],
            constraints: ['Wiadomość ma od 1 do 1000 znaków.'],
            examples: [{ input: 'ala ma kota', note: 'a(1) l(3) a(1) spacja(1) m(1) a(1) spacja(1) k(2) o(3) t(1) a(1) = 16.' }],
            hint: R`Wpisz liczbę naciśnięć dla każdej litery od a do z do tablicy: int ile[26] = {1, 2, 3, 1, 2, 3, …};. Uwaga na klawisze 7 i 9 — mają po cztery litery. Litera c kosztuje ile[c - 'a'], spacja — 1.`,
            tests: (r) => ['ala ma kota', 'abcdefghijklmnopqrstuvwxyz', 'z', 'ssss zzzz', zdanie(r, 10, 20), znaki(r, 1000, LITERY + ' ').trim() || 'a'],
            solve: (inp) => { const P = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 4]; return String([...inp].reduce((a, c) => a + (c === ' ' ? 1 : P[c.charCodeAt(0) - 97]), 0)); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int ile[26] = {1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 4};
    string s;
    getline(cin, s);
    int suma = 0;
    for (char c : s) {
        if (c == ' ') suma += 1;
        else suma += ile[c - 'a'];
    }
    cout << suma << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'str-b-gaderypoluki', krok: 9, level: 'srednie',
            title: 'GA-DE-RY-PO-LU-KI',
            short: 'Harcerski szyfr: g↔a, d↔e, r↔y, p↔o, l↔u, k↔i. Wielkość liter zostaje.',
            tags: ['klucz w napisie', 'find', 'para p ^ 1'],
            statement: ['GA-DE-RY-PO-LU-KI to szyfr harcerzy. Litery w parach GA, DE, RY, PO, LU, KI zamieniają się miejscami: g staje się a, a staje się g, d staje się e i tak dalej. Pozostałe litery i znaki zostają bez zmian, a wielkie litery pozostają wielkie. Zaszyfruj tekst. (Szyfrowanie i odszyfrowanie to w tym szyfrze to samo!)'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Zaszyfrowany tekst.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'Ala ma kota' }, { input: 'Czuwaj!' }],
            hint: R`Zapisz klucz jako napis: string klucz = "gaderypoluki";. Litera stojąca w kluczu na pozycji p (parzystej) ma parę na p + 1, a na pozycji nieparzystej — na p - 1. Szukaj w kluczu małej wersji litery (tolower), a wynik zamień z powrotem na wielką, jeśli oryginał był wielki.`,
            tests: (r) => ['Ala ma kota', 'Czuwaj!', 'gaderypoluki', 'GADERYPOLUKI', 'xyz 123', mix(r, zdanie(r, 20, 40), 0.3), mix(r, znaki(r, 1000, LITERY + ' .,!?'), 0.3)],
            solve: (inp) => { const K = 'gaderypoluki'; return [...inp].map((c) => { const p = K.indexOf(c.toLowerCase()); if (p < 0) return c; const z = K[p ^ 1]; return isUp(c) ? z.toUpperCase() : z; }).join(''); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string klucz = "gaderypoluki";
    string s;
    getline(cin, s);
    for (char &c : s) {
        int p = klucz.find((char)tolower(c));
        if (p == -1) continue;
        char z;
        if (p % 2 == 0) z = klucz[p + 1];
        else z = klucz[p - 1];
        if (isupper(c)) c = toupper(z);
        else c = z;
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-czas-trwania', krok: 9, level: 'srednie',
            title: 'Ile trwał film?',
            short: 'Start 23:15:00, koniec 01:02:30 — film skończył się po północy. Policz czas trwania.',
            tags: ['substr', 'stoi', 'zera z przodu'],
            statement: ['Wczytaj godzinę rozpoczęcia i godzinę zakończenia filmu w postaci HH:MM:SS. Film trwał krócej niż dobę; jeśli godzina zakończenia jest wcześniejsza niż rozpoczęcia, to znaczy, że film skończył się następnego dnia. Wypisz czas trwania w postaci HH:MM:SS, z zerami z przodu.'],
            input_format: ['Jeden wiersz: godzina rozpoczęcia i godzina zakończenia, oddzielone spacją.'],
            output_format: ['Czas trwania w postaci HH:MM:SS.'],
            constraints: ['Godziny od 00 do 23, minuty i sekundy od 00 do 59.', 'Godziny rozpoczęcia i zakończenia są różne.'],
            examples: [{ input: '18:30:00 20:45:15' }, { input: '23:15:00 01:02:30', note: 'Od 23:15:00 do północy mija 45 minut, a potem jeszcze 1 godzina, 2 minuty i 30 sekund.' }],
            hint: R`Zamień obie godziny na sekundy od północy: stoi(s.substr(0, 2)) * 3600 + stoi(s.substr(3, 2)) * 60 + stoi(s.substr(6, 2)). Różnica może wyjść ujemna — wtedy dodaj 24 · 3600. Na koniec rozłóż sekundy na godziny, minuty i sekundy i dopisz zera z przodu (setw i setfill albo zwykły if).`,
            check: (inp) => { const [a, b] = toks(inp); return a !== b ? null : 'te same godziny'; },
            tests: (r) => {
                const g = () => `${p2(r.int(0, 23))}:${p2(r.int(0, 59))}:${p2(r.int(0, 59))}`;
                const out = ['18:30:00 20:45:15', '23:15:00 01:02:30', '00:00:00 23:59:59', '23:59:59 00:00:00', '12:00:00 11:59:59', '00:00:01 00:00:02'];
                for (let i = 0; i < 6; i++) { const a = g(), b = g(); if (a !== b) out.push(`${a} ${b}`); }
                return out;
            },
            solve: (inp) => { const sek = (s) => Number(s.slice(0, 2)) * 3600 + Number(s.slice(3, 5)) * 60 + Number(s.slice(6, 8)); const [a, b] = toks(inp); const d = (sek(b) - sek(a) + 86400) % 86400; return `${p2(Math.floor(d / 3600))}:${p2(Math.floor(d / 60) % 60)}:${p2(d % 60)}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    int sa = stoi(a.substr(0, 2)) * 3600 + stoi(a.substr(3, 2)) * 60 + stoi(a.substr(6, 2));
    int sb = stoi(b.substr(0, 2)) * 3600 + stoi(b.substr(3, 2)) * 60 + stoi(b.substr(6, 2));
    int d = sb - sa;
    if (d < 0) d += 24 * 3600;
    int g = d / 3600, m = d / 60 % 60, s = d % 60;
    if (g < 10) cout << '0';
    cout << g << ':';
    if (m < 10) cout << '0';
    cout << m << ':';
    if (s < 10) cout << '0';
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-nawiasy', krok: 9, level: 'srednie',
            title: 'Nawiasy',
            short: 'Czy nawiasy są poprawnie sparowane? Jeśli tak — jak głęboko się zagnieżdżają?',
            tags: ['licznik otwartych', 'nigdy poniżej zera', 'maksimum'],
            statement: ['Napis składa się z nawiasów ( i ). Jest poprawny, gdy każdy nawias otwierający ma swój zamykający, który stoi za nim — jak w poprawnym wyrażeniu matematycznym. Na przykład (()()) jest poprawny, a ())( — nie. Jeśli napis jest poprawny, wypisz TAK i po spacji największą głębokość zagnieżdżenia, czyli największą liczbę nawiasów otwartych naraz. W przeciwnym razie wypisz NIE.'],
            input_format: ['Jeden wiersz z nawiasami.'],
            output_format: ['TAK i głębokość albo NIE.'],
            constraints: ['Napis ma od 1 do 50 000 znaków.'],
            examples: [{ input: '(()(()))', note: 'W środku są naraz otwarte trzy nawiasy.' }, { input: '())(' }, { input: '((' }],
            hint: R`Licz otwarte nawiasy: ( to +1, ) to -1. Napis jest zły, jeśli licznik choć raz spadnie poniżej zera (zamykasz coś, czego nie otwarto) albo na końcu nie wynosi 0. Głębokość to największa wartość licznika.`,
            tests: (r) => {
                const popr = (n) => { let s = '', otw = 0; for (let i = 0; i < n; i++) { if (otw > 0 && (r() < 0.5 || otw >= n - i)) { s += ')'; otw--; } else { s += '('; otw++; } } return s + ')'.repeat(otw); };
                return ['(()(()))', '())(', '((', '()', ')(', '(', ')', popr(100), popr(20000), '('.repeat(25000) + ')'.repeat(25000), popr(1000) + ')(', znaki(r, 50000, '()'), popr(30000).slice(0, -1)];
            },
            solve: (inp) => { let b = 0, m = 0, ok = true; for (const c of inp) { b += c === '(' ? 1 : -1; if (b < 0) ok = false; if (b > m) m = b; } return ok && b === 0 ? `TAK ${m}` : 'NIE'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int otwarte = 0, glebokosc = 0;
    bool ok = true;
    for (char c : s) {
        if (c == '(') otwarte++;
        else otwarte--;
        if (otwarte < 0) ok = false;
        if (otwarte > glebokosc) glebokosc = otwarte;
    }
    if (ok && otwarte == 0) {
        cout << "TAK " << glebokosc << "\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-b-rzymskie', krok: 9, level: 'srednie',
            title: 'Z rzymskich na arabskie',
            short: 'MCMXCIV → 1994. Mniejsza cyfra przed większą odejmuje się, w każdym innym przypadku dodaje.',
            tags: ['tablica-ściąga', 'find', 's[i + 1]'],
            statement: ['Cyfry rzymskie to I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Zwykle wartości cyfr się dodaje (XVI = 16), ale gdy mniejsza cyfra stoi przed większą, to się ją odejmuje (IV = 4, XC = 90, CM = 900). Zamień n liczb zapisanych po rzymsku na zwykłe liczby.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednej liczbie rzymskiej.'],
            output_format: ['n wierszy z wartościami.'],
            constraints: ['1 ≤ n ≤ 100', 'Liczby są od 1 do 3999 i zapisane poprawnie.'],
            examples: [{ input: '4\nXVI\nIV\nMCMXCIV\nMMXXVI' }],
            hint: R`Zapisz cyfry w napisie string znaki = "IVXLCDM"; i ich wartości w tablicy int w[7] = {1, 5, 10, 50, 100, 500, 1000};. Wartość znaku c to w[znaki.find(c)]. Idź po liczbie: jeśli wartość s[i] jest mniejsza od wartości s[i + 1] (i nie jesteś na końcu), odejmij ją, a w przeciwnym razie dodaj.`,
            tests: (r) => ['4\nXVI\nIV\nMCMXCIV\nMMXXVI', '3\nI\nMMMCMXCIX\nCDXLIV', `100\n${Array.from({ length: 100 }, () => rzym(r.int(1, 3999))).join('\n')}`],
            solve: (inp) => { const V = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }; return toks(inp).slice(1).map((s) => { let t = 0; for (let i = 0; i < s.length; i++) { const a = V[s[i]]; if (i + 1 < s.length && a < V[s[i + 1]]) t -= a; else t += a; } return t; }).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string znaki = "IVXLCDM";
    int w[7] = {1, 5, 10, 50, 100, 500, 1000};
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string s;
        cin >> s;
        int dl = s.length();
        int suma = 0;
        for (int i = 0; i < dl; i++) {
            int a = w[znaki.find(s[i])];
            if (i + 1 < dl && a < w[znaki.find(s[i + 1])]) {
                suma -= a;
            } else {
                suma += a;
            }
        }
        cout << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-b-kalkulator', krok: 9, level: 'srednie',
            title: 'Kalkulator',
            short: '12+34-5+100 → 141. Wyłuskaj liczby z napisu i pamiętaj znak przed każdą.',
            tags: ['liczba z cyfr', 'ostatni znak działania', 'wartownik'],
            statement: ['Wczytaj wyrażenie złożone z liczb naturalnych oraz znaków + i -, zapisane bez spacji, na przykład 12+34-5+100. Policz jego wartość. Wyrażenie zaczyna się liczbą i kończy liczbą.'],
            input_format: ['Jeden wiersz z wyrażeniem.'],
            output_format: ['Wartość wyrażenia.'],
            constraints: ['Wyrażenie ma od 1 do 1000 znaków.', 'Każda liczba w wyrażeniu jest od 0 do 10⁹.'],
            examples: [{ input: '12+34-5+100' }, { input: '5-10-20' }, { input: '2026' }],
            hint: R`Buduj bieżącą liczbę z cyfr (liczba = liczba * 10 + cyfra) i pamiętaj znak, który stał przed nią (na początku '+'). Gdy trafisz na + albo -, dodaj albo odejmij bieżącą liczbę według zapamiętanego znaku, zapamiętaj nowy znak i wyzeruj liczbę. Ostatnią liczbę rozlicz po pętli. Wynik może nie zmieścić się w int.`,
            check: (inp) => (/^\d+([+-]\d+)*$/.test(inp) && (inp.match(/\d+/g) || []).every((x) => Number(x) <= 1e9) ? null : 'złe wyrażenie'),
            tests: (r) => {
                const wyr = (k, maxd) => { let s = String(r.int(0, 10 ** maxd - 1)); for (let i = 1; i < k; i++) s += r.pick('+-') + String(r.int(0, 10 ** maxd - 1)); return s; };
                return ['12+34-5+100', '5-10-20', '2026', '0', '1000000000+1000000000', wyr(10, 3), wyr(90, 9), wyr(300, 2), `0-${Array.from({ length: 99 }, () => '1000000000').join('-')}`];
            },
            solve: (inp) => { let t = 0n; const m = inp.match(/[+-]?\d+/g); for (const x of m) t += BigInt(x); return t.toString(); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    cin >> s;
    s += '+';                 // wartownik: rozlicza ostatnią liczbę
    long long wynik = 0, liczba = 0;
    char znak = '+';
    for (char c : s) {
        if (isdigit(c)) {
            liczba = liczba * 10 + (c - '0');
        } else {
            if (znak == '+') wynik += liczba;
            else wynik -= liczba;
            znak = c;
            liczba = 0;
        }
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-pesel', krok: 9, level: 'srednie',
            title: 'PESEL',
            short: 'Sprawdź cyfrę kontrolną numeru PESEL i odczytaj z niego datę urodzenia i płeć.',
            tags: ['wagi cyfr', 'substr', 'miesiąc + 20'],
            statement: ['Numer PESEL ma 11 cyfr. Dwie pierwsze to końcówka roku urodzenia, dwie kolejne — miesiąc, potem dwie cyfry dnia. Miesiąc koduje też stulecie: dla urodzonych w latach 1900–1999 to po prostu 01–12, w latach 2000–2099 dodaje się 20 (21–32), w latach 2100–2199 — 40, w latach 2200–2299 — 60, a w latach 1800–1899 — 80. Dziesiąta cyfra jest parzysta u kobiet i nieparzysta u mężczyzn. Ostatnia cyfra jest kontrolna: mnożymy pierwsze dziesięć cyfr przez wagi 1, 3, 7, 9, 1, 3, 7, 9, 1, 3, dodajemy iloczyny, a cyfra kontrolna to (10 − suma % 10) % 10.', 'Dla każdego z n numerów wypisz NIEPOPRAWNY, jeśli cyfra kontrolna się nie zgadza. W przeciwnym razie wypisz datę urodzenia w postaci RRRR-MM-DD i po spacji literę K albo M.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym numerze PESEL (11 cyfr).'],
            output_format: ['n wierszy: data i płeć albo NIEPOPRAWNY.'],
            constraints: ['1 ≤ n ≤ 100', 'Jeśli cyfra kontrolna się zgadza, numer zawiera poprawną datę z lat 1800–2299.'],
            examples: [{ input: '3\n44051401359\n05230712343\n44051401358', note: 'Drugi numer: miesiąc 23 to marzec (23 − 20) roku 2005. Trzeci ma złą cyfrę kontrolną.' }],
            hint: R`Cyfra numer i to s[i] - '0'. Najpierw sprawdź cyfrę kontrolną (tablica wag int w[10] = {1, 3, 7, 9, 1, 3, 7, 9, 1, 3}). Potem odczytaj rok, miesiąc i dzień przez stoi(s.substr(…)) i przesuń miesiąc oraz stulecie według zakresu miesiąca. Zera z przodu w dacie dopisz sam.`,
            tests: (r) => {
                const dni = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const pesel = () => {
                    const rok = r.pick([r.int(1850, 1899), r.int(1900, 1999), r.int(1900, 1999), r.int(2000, 2099), r.int(2100, 2199), r.int(2200, 2299)]);
                    const m = r.int(1, 12), d = r.int(1, dni[m - 1]);
                    const off = rok < 1900 ? 80 : rok < 2000 ? 0 : rok < 2100 ? 20 : rok < 2200 ? 40 : 60;
                    const s10 = p2(rok % 100) + p2(m + off) + p2(d) + znaki(r, 4, CYFRY);
                    let s = s10 + kontrolna(s10);
                    if (r() < 0.3) { const i = r.int(0, 10); s = s.slice(0, i) + String((Number(s[i]) + r.int(1, 9)) % 10) + s.slice(i + 1); }
                    return s;
                };
                return ['3\n44051401359\n05230712343\n44051401358', `100\n${Array.from({ length: 100 }, pesel).join('\n')}`, `20\n${Array.from({ length: 20 }, pesel).join('\n')}`];
            },
            solve: (inp) => toks(inp).slice(1).map((s) => {
                if (kontrolna(s.slice(0, 10)) !== Number(s[10])) return 'NIEPOPRAWNY';
                let m = Number(s.slice(2, 4)); let st;
                if (m > 80) { st = 1800; m -= 80; } else if (m > 60) { st = 2200; m -= 60; } else if (m > 40) { st = 2100; m -= 40; } else if (m > 20) { st = 2000; m -= 20; } else st = 1900;
                return `${st + Number(s.slice(0, 2))}-${p2(m)}-${s.slice(4, 6)} ${Number(s[9]) % 2 ? 'M' : 'K'}`;
            }).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int w[10] = {1, 3, 7, 9, 1, 3, 7, 9, 1, 3};
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string s;
        cin >> s;
        int suma = 0;
        for (int i = 0; i < 10; i++) {
            suma += (s[i] - '0') * w[i];
        }
        if ((10 - suma % 10) % 10 != s[10] - '0') {
            cout << "NIEPOPRAWNY\n";
            continue;
        }
        int rok = stoi(s.substr(0, 2));
        int mies = stoi(s.substr(2, 2));
        if (mies > 80) { rok += 1800; mies -= 80; }
        else if (mies > 60) { rok += 2200; mies -= 60; }
        else if (mies > 40) { rok += 2100; mies -= 40; }
        else if (mies > 20) { rok += 2000; mies -= 20; }
        else { rok += 1900; }
        cout << rok << "-";
        if (mies < 10) cout << "0";
        cout << mies << "-" << s.substr(4, 2) << " ";
        if ((s[9] - '0') % 2 == 0) cout << "K\n";
        else cout << "M\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-b-morse', krok: 9, level: 'srednie',
            title: 'Alfabet Morse’a',
            short: '... --- ... → SOS. Odszyfruj wiadomość, szukając kodów w tablicy-ściądze.',
            tags: ['tablica napisów', 'porównanie napisów', "(char)('A' + k)"],
            statement: ['Każda litera w alfabecie Morse’a to ciąg kropek i kresek: A to .-, B to -..., C to -.-. itd. Pełna tabela: A .-, B -..., C -.-., D -.., E ., F ..-., G --., H ...., I .., J .---, K -.-, L .-.., M --, N -., O ---, P .--., Q --.-, R .-., S ..., T -, U ..-, V ...-, W .--, X -..-, Y -.--, Z --... W wiadomości kody liter są oddzielone spacjami, a słowa — ukośnikiem / otoczonym spacjami. Odszyfruj wiadomość: wypisz ją wielkimi literami, ze słowami oddzielonymi pojedynczymi spacjami.'],
            input_format: ['Jeden wiersz z zakodowaną wiadomością.'],
            output_format: ['Odszyfrowana wiadomość.'],
            constraints: ['Wiadomość ma od 1 do 200 liter.', 'Wszystkie kody są poprawne.'],
            examples: [{ input: '... --- ...' }, { input: '.- .-.. .- / -- .- / -.- --- - .-' }],
            hint: R`Wpisz kody do tablicy string kod[26] = {".-", "-...", …};. Wczytuj kawałki przez cin >> t. Ukośnik oznacza spację. Każdy inny kawałek porównaj po kolei z kod[0], kod[1], … — gdy kod[k] == t, to litera (char)('A' + k).`,
            tests: (r) => {
                const koduj = (tekst) => tekst.split(' ').map((w) => [...w].map((c) => MORSE[c.charCodeAt(0) - 65]).join(' ')).join(' / ');
                return ['... --- ...', '.- .-.. .- / -- .- / -.- --- - .-', koduj(WIELKIE), koduj('OLIMPIADA INFORMATYCZNA'), koduj(zdanie(r, 5, 10).toUpperCase()), koduj(Array.from({ length: 20 }, () => znaki(r, r.int(1, 10), WIELKIE)).join(' ').slice(0, 220).trim())];
            },
            solve: (inp) => toks(inp).map((t) => (t === '/' ? ' ' : String.fromCharCode(65 + MORSE.indexOf(t)))).join(''),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string kod[26] = {".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--",
                      "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."};
    string t, w = "";
    while (cin >> t) {
        if (t == "/") {
            w += ' ';
            continue;
        }
        for (int k = 0; k < 26; k++) {
            if (kod[k] == t) {
                w += (char)('A' + k);
                break;
            }
        }
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-krzyzowka', krok: 9, level: 'srednie',
            title: 'Krzyżówka',
            short: 'Dwa słowa krzyżują się na pierwszej wspólnej literze. Narysuj tę krzyżówkę z kropkami.',
            tags: ['find', 'siatka znaków', 'pętla w pętli'],
            statement: ['Słowo A ma zostać wpisane poziomo, a słowo B — pionowo, tak by krzyżowały się na wspólnej literze. Krzyżujemy na pierwszej literze słowa A, która występuje w słowie B, i to w miejscu jej pierwszego wystąpienia w B. Wypisz krzyżówkę jako prostokąt z tylu wierszy, ile liter ma B, i tylu kolumn, ile liter ma A. Puste pola wypełnij kropkami.'],
            input_format: ['Jeden wiersz: słowa A i B oddzielone spacją.'],
            output_format: ['Krzyżówka: tyle wierszy, ile liter ma B, każdy o długości A.'],
            constraints: ['Słowa mają od 1 do 30 małych liter.', 'Słowa mają co najmniej jedną wspólną literę.'],
            examples: [{ input: 'kot rower', note: 'Pierwsza litera słowa kot, która jest w słowie rower, to o — leży w kot na pozycji 1, a w rower na pozycji 1.' }, { input: 'abba ccbb' }],
            hint: R`Znajdź kolumnę i wiersz skrzyżowania: idź po literach A i dla każdej sprawdź B.find(A[i]) — pierwsza znaleziona daje kolumnę i oraz wiersz j. Potem dwie pętle: w wierszu j wypisz A, w kolumnie i wypisz literę B z bieżącego wiersza, a wszędzie indziej kropkę.`,
            check: (inp) => { const [a, b] = toks(inp); return [...a].some((c) => b.includes(c)) ? null : 'brak wspólnej litery'; },
            tests: (r) => {
                const para = (a, b) => { const A = word(r, a, b), B = word(r, a, b); return [...A].some((c) => B.includes(c)) ? `${A} ${B}` : `${A} ${B}${A[0]}`.slice(0, 2 * b + 1); };
                const out = ['kot rower', 'abba ccbb', 'a a', 'abc c', 'z xyz'];
                for (let i = 0; i < 5; i++) out.push(para(5, 15));
                out.push(para(30, 30), `${'a'.repeat(29)}z ${'z'.repeat(30)}`);
                return out.filter((t) => { const [a, b] = toks(t); return b.length <= 30 && [...a].some((c) => b.includes(c)); });
            },
            solve: (inp) => { const [A, B] = toks(inp); let i = 0; while (!B.includes(A[i])) i++; const j = B.indexOf(A[i]); return [...B].map((bc, w) => (w === j ? A : [...A].map((_, k) => (k === i ? bc : '.')).join(''))).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    int na = a.length(), nb = b.length();
    int kol = -1, wiersz = -1;
    for (int i = 0; i < na; i++) {
        int p = b.find(a[i]);
        if (p != -1) {
            kol = i;
            wiersz = p;
            break;
        }
    }
    for (int w = 0; w < nb; w++) {
        for (int k = 0; k < na; k++) {
            if (w == wiersz) cout << a[k];
            else if (k == kol) cout << b[w];
            else cout << '.';
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-b-obrot', krok: 9, level: 'srednie',
            title: 'Czy to obrót?',
            short: 'ekkot to obrócony kotek? Sprytna sztuczka: szukaj b w napisie a + a.',
            tags: ['a + a', 'find', 'obrót napisu'],
            statement: ['Obrót napisu o k to przeniesienie jego pierwszych k znaków na koniec: obrót „kotek” o 3 daje „ekkot”. Dla każdej z n par napisów a i b sprawdź, czy b jest jakimś obrotem a. Jeśli tak, wypisz TAK i po spacji najmniejsze k ≥ 0, dla którego obrót a o k daje b. W przeciwnym razie wypisz NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwa napisy a i b.'],
            output_format: ['n wierszy: TAK i k albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', 'Napisy mają od 1 do 1000 małych liter.'],
            examples: [{ input: '4\nkotek ekkot\nkotek kotek\nabc acb\nab abab', note: 'Każdy napis jest swoim obrotem o 0. abab ma inną długość niż ab, więc nie może być jego obrotem.' }],
            hint: R`Wszystkie obroty napisu a siedzą w napisie a + a: obrót o k zaczyna się w nim na pozycji k. Jeśli długości są równe, wystarczy (a + a).find(b) — wynik to od razu najmniejsze k, a -1 oznacza brak.`,
            tests: (r) => {
                const obr = (a, k) => a.slice(k) + a.slice(0, k);
                const para = (n, alf) => { const a = znaki(r, n, alf); const x = r(); if (x < 0.5) return `${a} ${obr(a, r.int(0, n - 1))}`; if (x < 0.75) return `${a} ${znaki(r, n, alf)}`; return `${a} ${znaki(r, r.int(1, 2 * n), alf)}`.slice(0, 2001); };
                return ['4\nkotek ekkot\nkotek kotek\nabc acb\nab abab', '2\na a\na b', `100\n${Array.from({ length: 100 }, () => para(r.int(1, 30), 'ab')).join('\n')}`, `20\n${Array.from({ length: 20 }, () => para(1000, 'abc')).join('\n')}`, `10\n${Array.from({ length: 10 }, () => { const a = 'ab'.repeat(500); return `${a} ${obr(a, r.int(0, 999))}`; }).join('\n')}`];
            },
            check: (inp) => (toks(inp).slice(1).every((x) => x.length >= 1 && x.length <= 1000) ? null : 'za długi napis'),
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; const k = a.length === b.length ? (a + a).indexOf(b) : -1; out.push(k < 0 ? 'NIE' : `TAK ${k}`); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string a, b;
        cin >> a >> b;
        int k = -1;
        if (a.length() == b.length()) {
            k = (a + a).find(b);
        }
        if (k == -1) {
            cout << "NIE\n";
        } else {
            cout << "TAK " << k << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-b-iban', krok: 9, level: 'srednie',
            title: 'Numer konta IBAN',
            short: 'Banki sprawdzają numery kont resztą z dzielenia przez 97 liczby z 30 cyfr. Zrób to samo.',
            tags: ['reszta z olbrzyma', 'litery na liczby', 'substr'],
            statement: ['Międzynarodowy numer konta IBAN zaczyna się od dwóch liter kraju (PL, DE…), po nich stoją dwie cyfry kontrolne i dalsza część numeru. Bank sprawdza numer tak: przenosi pierwsze cztery znaki na koniec, zamienia każdą literę na dwie cyfry (A = 10, B = 11, …, Z = 35) i liczy resztę z dzielenia powstałej olbrzymiej liczby przez 97. Numer jest poprawny, gdy ta reszta wynosi 1. Dla każdego z n numerów wypisz POPRAWNY albo NIEPOPRAWNY.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym numerze IBAN (wielkie litery i cyfry, bez spacji).'],
            output_format: ['n wierszy: POPRAWNY albo NIEPOPRAWNY.'],
            constraints: ['1 ≤ n ≤ 100', 'Numery mają od 15 do 34 znaków.'],
            examples: [{ input: '3\nPL61109010140000071219812874\nPL61109010140000071219812875\nGB29NWBK60161331926819', note: 'Drugi numer różni się od pierwszego tylko ostatnią cyfrą — i reszta przestaje się zgadzać.' }],
            hint: R`Najpierw t = s.substr(4) + s.substr(0, 4);. Potem licz resztę jak dla olbrzyma z lekcji: dla cyfry r = (r * 10 + cyfra) % 97, a dla litery — która daje dwie cyfry — r = (r * 100 + (c - 'A' + 10)) % 97.`,
            tests: (r) => {
                const KRAJE = [['PL', 24, CYFRY], ['DE', 18, CYFRY], ['FR', 23, CYFRY + 'AB'], ['GB', 18, CYFRY + WIELKIE], ['ES', 20, CYFRY], ['NO', 11, CYFRY], ['MT', 27, CYFRY + WIELKIE]];
                const iban = () => {
                    const [k, d, alf] = r.pick(KRAJE);
                    const bban = znaki(r, d, alf);
                    const kk = p2(98 - mod97(bban + k + '00'));
                    let s = k + kk + bban;
                    const x = r();
                    if (x < 0.25) { const i = r.int(4, s.length - 1); const z = s[i] >= '0' && s[i] <= '9' ? String((Number(s[i]) + r.int(1, 9)) % 10) : (s[i] === 'Z' ? 'A' : 'Z'); s = s.slice(0, i) + z + s.slice(i + 1); }
                    else if (x < 0.4) { const i = r.int(4, s.length - 2); s = s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2); }
                    return s;
                };
                return ['3\nPL61109010140000071219812874\nPL61109010140000071219812875\nGB29NWBK60161331926819', `100\n${Array.from({ length: 100 }, iban).join('\n')}`, `30\n${Array.from({ length: 30 }, iban).join('\n')}`];
            },
            solve: (inp) => toks(inp).slice(1).map((s) => (mod97(s.slice(4) + s.slice(0, 4)) === 1 ? 'POPRAWNY' : 'NIEPOPRAWNY')).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        string t = s.substr(4) + s.substr(0, 4);
        int r = 0;
        for (char c : t) {
            if (isdigit(c)) {
                r = (r * 10 + (c - '0')) % 97;
            } else {
                r = (r * 100 + (c - 'A' + 10)) % 97;
            }
        }
        cout << (r == 1 ? "POPRAWNY" : "NIEPOPRAWNY") << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'str-b-okres', krok: 9, level: 'trudne',
            title: 'Powtarzający się kawałek',
            short: 'abcabcabc to trzy razy abc. Znajdź najkrótszy kawałek, z którego powtórzeń składa się słowo.',
            tags: ['dzielniki długości', 's[i] == s[i - p]', 'substr'],
            statement: ['Wczytaj słowo i znajdź najkrótszy kawałek, z którego powtórzeń powstaje całe słowo: „abababab” to cztery razy „ab”, „aaaa” to cztery razy „a”, a „abcd” powstaje tylko z jednego „abcd”. Wypisz długość tego kawałka i sam kawałek.'],
            input_format: ['Jeden wiersz ze słowem z małych liter.'],
            output_format: ['Długość najkrótszego kawałka i ten kawałek, oddzielone spacją.'],
            constraints: ['Słowo ma od 1 do 20 000 liter.'],
            examples: [{ input: 'abababab' }, { input: 'abcabcabc' }, { input: 'abcab', note: 'Długość kawałka musi dzielić długość słowa. 5 dzieli się tylko przez 1 i 5, a „abcab” nie jest pięcioma literami a — zostaje całe słowo.' }],
            hint: R`Sprawdzaj kolejne długości p od 1 do n, ale tylko te, które dzielą n. Słowo jest powtórzeniem swoich p pierwszych liter dokładnie wtedy, gdy s[i] == s[i - p] dla każdego i od p do n - 1. Pierwsze p, które przejdzie test, jest odpowiedzią.`,
            tests: (r) => {
                const powt = (k, ile) => r.word(k).repeat(ile);
                return ['abababab', 'abcabcabc', 'abcab', 'a', 'aaaa', 'ab', powt(1, 20000), powt(7, 2000), powt(100, 200), powt(5000, 4), powt(3, 3) + 'x', znaki(r, 20000, 'ab'), powt(9999, 2), r.word(20000)];
            },
            check: (inp) => (inp.length <= 20000 ? null : 'za długie'),
            solve: (inp) => { const s = inp, n = s.length; for (let p = 1; p <= n; p++) { if (n % p) continue; let ok = true; for (let i = p; i < n; i++) if (s[i] !== s[i - p]) { ok = false; break; } if (ok) return `${p} ${s.slice(0, p)}`; } return ''; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    for (int p = 1; p <= n; p++) {
        if (n % p != 0) continue;
        bool ok = true;
        for (int i = p; i < n; i++) {
            if (s[i] != s[i - p]) {
                ok = false;
                break;
            }
        }
        if (ok) {
            cout << p << " " << s.substr(0, p) << "\n";
            break;
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-b-justowanie', krok: 9, level: 'trudne',
            title: 'Wyjustowany tekst',
            short: 'Ułóż słowa w wiersze o szerokości W i rozłóż spacje tak, by każdy wiersz kończył się równo.',
            tags: ['tablica napisów', 'rozkład spacji', 'ostatni wiersz'],
            statement: ['Gazety justują tekst: każdy wiersz ma dokładnie tę samą szerokość W, a brakujące miejsce wypełniają dodatkowe spacje między słowami. Ułóż słowa w wiersze tak: do każdego wiersza bierz po kolei tyle słów, ile się zmieści, jeśli oddzielić je pojedynczymi spacjami (długość nie może przekroczyć W). Potem rozłóż spacje: każdy wiersz oprócz ostatniego ma mieć dokładnie W znaków, a spacje rozkładamy między słowami możliwie równo — jeśli się nie da po równo, przerwy bardziej z lewej dostają o jedną spację więcej. Wiersz z jednym słowem zostaje bez dopełnienia. Ostatni wiersz piszemy zwyczajnie, z pojedynczymi spacjami.'],
            input_format: ['W pierwszym wierszu szerokość W.', 'Dalej tekst — słowa oddzielone spacjami i Enterami — aż do końca danych.'],
            output_format: ['Wyjustowany tekst.'],
            constraints: ['10 ≤ W ≤ 60', 'Tekst ma od 1 do 1000 słów, każde od 1 do W znaków.'],
            examples: [{ input: '16\nAla ma kota, a kot ma Ale. To bardzo stara historia.', note: 'Pierwszy wiersz: „Ala ma kota, a” ma 14 znaków, brakuje 2 spacji na 3 przerwy — dwie pierwsze przerwy dostają po jednej dodatkowej.' }],
            hint: R`Wczytaj wszystkie słowa do tablicy. Buduj wiersz od słowa i: dokładaj kolejne, dopóki suma długości + liczba przerw ≤ W. Dla wiersza ze słowami od i do j - 1 (nie ostatniego): spacji do rozdania jest W - suma długości, przerw j - i - 1; każda przerwa dostaje spacje / przerwy, a pierwsze spacje % przerwy przerw — jedną więcej.`,
            tests: (r) => {
                const tekst = (k, maxw) => Array.from({ length: k }, () => (r() < 0.7 ? mix(r, slowo(r), 0.1) : word(r, 1, maxw)) + (r() < 0.1 ? r.pick([',', '.']) : '')).map((w) => w.slice(0, maxw)).join(r.pick([' ', ' ', '\n']));
                return ['16\nAla ma kota, a kot ma Ale. To bardzo stara historia.', '10\nslowo', '10\naaaaaaaaaa bbbbbbbbbb c', `20\n${tekst(50, 20)}`, `60\n${tekst(1000, 15)}`, `10\n${tekst(300, 10)}`, `33\n${tekst(500, 33)}`];
            },
            check: (inp) => { const t = toks(inp); const W = Number(t[0]); return t.slice(1).every((w) => w.length <= W) ? null : 'słowo dłuższe niż W'; },
            solve: (inp) => {
                const t = toks(inp); const W = Number(t[0]); const w = t.slice(1); const out = [];
                let i = 0;
                while (i < w.length) {
                    let j = i + 1, len = w[i].length;
                    while (j < w.length && len + 1 + w[j].length <= W) { len += 1 + w[j].length; j++; }
                    if (j === w.length || j - i === 1) out.push(w.slice(i, j).join(' '));
                    else {
                        const gaps = j - i - 1, spaces = W - w.slice(i, j).reduce((a, x) => a + x.length, 0);
                        let line = '';
                        for (let k = i; k < j; k++) { line += w[k]; if (k < j - 1) line += ' '.repeat(Math.floor(spaces / gaps) + (k - i < spaces % gaps ? 1 : 0)); }
                        out.push(line);
                    }
                    i = j;
                }
                return out.join('\n');
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int W;
    cin >> W;
    string t[1005];
    int n = 0;
    while (cin >> t[n]) {
        n++;
    }
    int i = 0;
    while (i < n) {
        int j = i + 1;
        int dl = t[i].length();
        while (j < n && dl + 1 + (int)t[j].length() <= W) {
            dl += 1 + t[j].length();
            j++;
        }
        string wiersz = "";
        if (j == n || j - i == 1) {
            for (int k = i; k < j; k++) {
                if (k > i) wiersz += " ";
                wiersz += t[k];
            }
        } else {
            int litery = 0;
            for (int k = i; k < j; k++) litery += t[k].length();
            int przerwy = j - i - 1;
            int spacje = W - litery;
            for (int k = i; k < j; k++) {
                wiersz += t[k];
                if (k < j - 1) {
                    int ile = spacje / przerwy;
                    if (k - i < spacje % przerwy) ile++;
                    wiersz += string(ile, ' ');
                }
            }
        }
        cout << wiersz << "\n";
        i = j;
    }
    return 0;
}`,
        },
        {
            id: 'str-b-wzorzec-pytajniki', krok: 9, level: 'trudne',
            title: 'Wzorzec z pytajnikami',
            short: 'We wzorcu ? pasuje do każdej litery. Gdzie w tekście pasuje wzorzec k?t — a gdzie ??a?',
            tags: ['pętla w pętli', 'p[j] == ?', 'break'],
            statement: ['Wczytaj tekst i wzorzec. Wzorzec składa się z małych liter i znaków zapytania; znak ? pasuje do dowolnej litery, a litera — tylko do takiej samej litery. Wzorzec pasuje do tekstu na pozycji i, jeśli każdy znak wzorca pasuje do znaku tekstu stojącego pod nim, gdy wzorzec przyłożymy od pozycji i. Wypisz, na ilu pozycjach wzorzec pasuje, a jeśli choć na jednej — po spacji także pierwszą taką pozycję (licząc od zera).'],
            input_format: ['Jeden wiersz: tekst i wzorzec oddzielone spacją.'],
            output_format: ['Liczba dopasowań i pierwsza pozycja albo samo 0.'],
            constraints: ['Tekst ma od 1 do 2000 małych liter.', 'Wzorzec ma od 1 do 2000 znaków.'],
            examples: [{ input: 'kotkatkit k?t', note: 'k?t pasuje do kot (pozycja 0), kat (3) i kit (6).' }, { input: 'abc ????' }],
            hint: R`Dla każdej pozycji startowej i od 0 do n - m sprawdź wszystkie znaki wzorca: p[j] == '?' || p[j] == t[i + j]. Przy pierwszym niepasującym przerwij. Jeśli wzorzec jest dłuższy od tekstu, pętla po i nie wykona się ani razu — pilnuj, żeby n - m było liczone na int.`,
            tests: (r) => {
                const wzor = (t, m) => { const i = r.int(0, t.length - m); return [...t.slice(i, i + m)].map((c) => (r() < 0.3 ? '?' : c)).join(''); };
                const t1 = znaki(r, 2000, 'ab'), t2 = znaki(r, 2000, LITERY), t3 = 'a'.repeat(2000);
                return ['kotkatkit k?t', 'abc ????', 'a ?', 'a b', `${t1} ${wzor(t1, 10)}`, `${t1} ${wzor(t1, 1000)}`, `${t2} ${wzor(t2, 5)}`, `${t3} ${'?'.repeat(1000)}`, `${t3} ${'a'.repeat(999)}b`, `${t2} ${'?'.repeat(2000)}`, `${t1} ${znaki(r, 3, 'ab?')}`];
            },
            solve: (inp) => { const [t, p] = toks(inp); let k = 0, f = -1; for (let i = 0; i + p.length <= t.length; i++) { let ok = true; for (let j = 0; j < p.length; j++) if (p[j] !== '?' && p[j] !== t[i + j]) { ok = false; break; } if (ok) { k++; if (f < 0) f = i; } } return k ? `${k} ${f}` : '0'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string t, p;
    cin >> t >> p;
    int n = t.length(), m = p.length();
    int ile = 0, pierwsza = -1;
    for (int i = 0; i <= n - m; i++) {
        bool ok = true;
        for (int j = 0; j < m; j++) {
            if (p[j] != '?' && p[j] != t[i + j]) {
                ok = false;
                break;
            }
        }
        if (ok) {
            ile++;
            if (pierwsza == -1) pierwsza = i;
        }
    }
    if (ile == 0) {
        cout << 0 << "\n";
    } else {
        cout << ile << " " << pierwsza << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-b-najdluzszy-palindrom', krok: 9, level: 'trudne',
            title: 'Najdłuższy palindrom',
            short: 'Znajdź najdłuższy fragment słowa, który jest palindromem. Rozszerzaj od każdego środka.',
            tags: ['dwa wskaźniki', 'środek nieparzysty i parzysty', 'substr'],
            statement: ['Wczytaj słowo i znajdź jego najdłuższy fragment, który jest palindromem (czyta się tak samo od przodu i od tyłu). Fragment to kawałek słowa złożony z liter stojących obok siebie. Jeśli kilka najdłuższych palindromów ma tę samą długość, wybierz ten, który zaczyna się najwcześniej. Wypisz jego długość i sam palindrom.'],
            input_format: ['Jeden wiersz ze słowem z małych liter.'],
            output_format: ['Długość najdłuższego palindromu i ten palindrom.'],
            constraints: ['Słowo ma od 1 do 2000 liter.'],
            examples: [{ input: 'abakajakx', note: 'Palindromy to m.in. aba i kajak — kajak jest najdłuższy.' }, { input: 'abcd', note: 'Każda pojedyncza litera jest palindromem — wybieramy pierwszą.' }],
            hint: R`Każdy palindrom ma środek: jedną literę (długość nieparzysta) albo szczelinę między dwiema literami (parzysta). Dla każdego z 2n − 1 środków rozszerzaj dwa wskaźniki l i r w lewo i w prawo, dopóki s[l] == s[r] i nie wychodzisz poza słowo. Zapamiętuj najdłuższy znaleziony fragment.`,
            tests: (r) => {
                const wstaw = (s, p) => { const i = r.int(0, s.length - p.length); return s.slice(0, i) + p + s.slice(i + p.length); };
                const pal = (k) => { const h = r.word(k); return h + (r() < 0.5 ? r.word(1) : '') + [...h].reverse().join(''); };
                return ['abakajakx', 'abcd', 'a', 'aa', 'ab', 'kajak', znaki(r, 2000, 'ab'), wstaw(r.word(2000), pal(100)), 'a'.repeat(2000), wstaw(znaki(r, 2000, 'abc'), pal(400)), r.word(2000)];
            },
            solve: (inp) => { const s = inp, n = s.length; let bl = 0, bd = 1; for (let c = 0; c < 2 * n - 1; c++) { let l = Math.floor(c / 2), rr = l + (c % 2); while (l >= 0 && rr < n && s[l] === s[rr]) { l--; rr++; } const d = rr - l - 1; if (d > bd || (d === bd && l + 1 < bl)) { bd = d; bl = l + 1; } } return `${bd} ${s.slice(bl, bl + bd)}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    int najStart = 0, najDl = 1;
    for (int c = 0; c < 2 * n - 1; c++) {
        int l = c / 2;
        int r = l + c % 2;
        while (l >= 0 && r < n && s[l] == s[r]) {
            l--;
            r++;
        }
        int dl = r - l - 1;
        int start = l + 1;
        if (dl > najDl || (dl == najDl && start < najStart)) {
            najDl = dl;
            najStart = start;
        }
    }
    cout << najDl << " " << s.substr(najStart, najDl) << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-odejmowanie', krok: 9, level: 'trudne',
            title: 'Odejmowanie olbrzymów',
            short: 'a − b dla liczb z tysiąca cyfr: porównaj, odejmij pisemnie z pożyczką, usuń zera z przodu.',
            tags: ['porównanie olbrzymów', 'pożyczka', 'zera na początku'],
            statement: ['Wczytaj dwie nieujemne liczby całkowite a i b, z których każda może mieć nawet 1000 cyfr. Wypisz różnicę a − b. Wynik może być ujemny — wtedy zaczyna się od minusa. Wynik nie może zaczynać się od zera (chyba że to samo 0).'],
            input_format: ['Jeden wiersz: liczby a i b (bez zer na początku) oddzielone spacją.'],
            output_format: ['Różnica a − b.'],
            constraints: ['Każda liczba ma od 1 do 1000 cyfr.'],
            examples: [{ input: '1000 1', note: 'Pożyczka przechodzi przez trzy zera. Wynik 999 — bez zera z przodu.' }, { input: '123 456' }, { input: '777 777' }],
            hint: R`Najpierw ustal, która liczba jest większa (najpierw długość, potem zwykłe <). Jeśli a < b, zamień je i zapamiętaj minus. Potem odejmuj od końca: cyfra = a[i] - b[j] - pozyczka; jeśli ujemna, dodaj 10 i ustaw pożyczkę na 1. Wynik budujesz od końca — usuń zera, które zostały na jego początku, ale zostaw przynajmniej jedną cyfrę.`,
            check: (inp) => (toks(inp).every((x) => /^([1-9]\d*|0)$/.test(x)) ? null : 'zła liczba'),
            tests: (r) => ['1000 1', '123 456', '777 777', '0 0', '0 5', '5 0', `1${'0'.repeat(999)} 1`, `${liczba(r, 1000)} ${liczba(r, 1000)}`, `${liczba(r, 300)} ${liczba(r, 1000)}`, (() => { const a = liczba(r, 500); return `${a} ${a.slice(0, 400)}${znaki(r, 100, CYFRY)}`; })(), `${liczba(r, 20)} ${liczba(r, 19)}`],
            solve: (inp) => { const [a, b] = toks(inp); return (BigInt(a) - BigInt(b)).toString(); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    bool mniejsza;
    if (a.length() != b.length()) mniejsza = a.length() < b.length();
    else mniejsza = a < b;
    bool minus = false;
    if (mniejsza) {
        swap(a, b);
        minus = true;
    }
    string w = "";                    // wynik od końca
    int i = a.length() - 1, j = b.length() - 1, pozyczka = 0;
    while (i >= 0) {
        int cyfra = (a[i] - '0') - pozyczka;
        if (j >= 0) cyfra -= b[j] - '0';
        if (cyfra < 0) {
            cyfra += 10;
            pozyczka = 1;
        } else {
            pozyczka = 0;
        }
        w += (char)('0' + cyfra);
        i--;
        j--;
    }
    while (w.length() > 1 && w.back() == '0') {
        w.pop_back();                 // zera z przodu wyniku
    }
    if (w == "0") minus = false;
    if (minus) cout << "-";
    for (int k = w.length() - 1; k >= 0; k--) {
        cout << w[k];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-mnozenie', krok: 9, level: 'trudne',
            title: 'Mnożenie olbrzymów',
            short: 'Pomnóż dwie liczby po 500 cyfr — pisemnie, każda cyfra z każdą, z przeniesieniem na końcu.',
            tags: ['tablica cyfr wyniku', 'w[i + j]', 'przeniesienie'],
            statement: ['Wczytaj dwie nieujemne liczby całkowite, z których każda może mieć nawet 500 cyfr, i wypisz ich iloczyn — bez zer na początku.'],
            input_format: ['Jeden wiersz: dwie liczby (bez zer na początku) oddzielone spacją.'],
            output_format: ['Iloczyn.'],
            constraints: ['Każda liczba ma od 1 do 500 cyfr.'],
            examples: [{ input: '123 45' }, { input: '99999999999999999999 99999999999999999999' }, { input: '0 123456' }],
            hint: R`Cyfra a z pozycji i od końca razy cyfra b z pozycji j od końca trafia na pozycję i + j od końca wyniku. Zrób tablicę int w[1005] = {}; i dodawaj do w[i + j] wszystkie iloczyny cyfr. Dopiero na koniec przejdź po tablicy i porozdzielaj przeniesienia: w[k + 1] += w[k] / 10; w[k] %= 10;. Wypisz od najwyższej niezerowej pozycji.`,
            check: (inp) => (toks(inp).every((x) => /^([1-9]\d*|0)$/.test(x)) ? null : 'zła liczba'),
            tests: (r) => ['123 45', '99999999999999999999 99999999999999999999', '0 123456', '1 1', '5 0', `${'9'.repeat(500)} ${'9'.repeat(500)}`, `${liczba(r, 500)} ${liczba(r, 500)}`, `${liczba(r, 1)} ${liczba(r, 500)}`, `${liczba(r, 250)} ${liczba(r, 30)}`, `1${'0'.repeat(499)} 1${'0'.repeat(499)}`],
            solve: (inp) => { const [a, b] = toks(inp); return (BigInt(a) * BigInt(b)).toString(); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    int na = a.length(), nb = b.length();
    int w[1005] = {};
    for (int i = 0; i < na; i++) {
        for (int j = 0; j < nb; j++) {
            w[i + j] += (a[na - 1 - i] - '0') * (b[nb - 1 - j] - '0');
        }
    }
    int dl = na + nb;
    for (int k = 0; k < dl; k++) {
        w[k + 1] += w[k] / 10;
        w[k] %= 10;
    }
    int k = dl;
    while (k > 0 && w[k] == 0) {
        k--;
    }
    for (; k >= 0; k--) {
        cout << w[k];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-bez-powtorzen-fragment', krok: 9, level: 'trudne',
            title: 'Najdłuższy fragment bez powtórzeń',
            short: 'abcabcbb → abc. Dwa wskaźniki: przesuwaj początek okna za ostatnie wystąpienie powtórzonej litery.',
            tags: ['dwa wskaźniki', 'ostatnie wystąpienie', 'okno o zmiennej długości'],
            statement: ['Wczytaj słowo i znajdź jego najdłuższy fragment, w którym żadna litera się nie powtarza. Jeśli jest kilka takich fragmentów, wybierz ten, który zaczyna się najwcześniej. Wypisz jego długość i sam fragment.'],
            input_format: ['Jeden wiersz ze słowem z małych liter.'],
            output_format: ['Długość fragmentu i fragment, oddzielone spacją.'],
            constraints: ['Słowo ma od 1 do 50 000 liter.'],
            examples: [{ input: 'abcabcbb' }, { input: 'pwwkew', note: 'Fragmenty bez powtórzeń o długości 3 to wke i kew — wybieramy wcześniejszy.' }, { input: 'bbbb' }],
            hint: R`Okno od pozycji poczatek do i ma same różne litery. Pamiętaj w tablicy int ostatnio[26] (na start -1), gdzie ostatnio widziałeś każdą literę. Gdy litera s[i] była już w oknie (ostatnio[c] >= poczatek), przesuń początek na ostatnio[c] + 1. Po każdym kroku sprawdź, czy okno i - poczatek + 1 jest rekordowe.`,
            tests: (r) => ['abcabcbb', 'pwwkew', 'bbbb', 'a', 'abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyzabc', znaki(r, 50000, LITERY), znaki(r, 50000, 'abcde'), 'ab'.repeat(25000), r.word(1000) + 'abcdefghijklmnopqrstuvwxyz' + znaki(r, 1000, 'aa')],
            solve: (inp) => { const s = inp; const last = new Array(26).fill(-1); let st = 0, bd = 0, bs = 0; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i) - 97; if (last[c] >= st) st = last[c] + 1; last[c] = i; if (i - st + 1 > bd) { bd = i - st + 1; bs = st; } } return `${bd} ${s.slice(bs, bs + bd)}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.length();
    int ostatnio[26];
    for (int k = 0; k < 26; k++) ostatnio[k] = -1;
    int poczatek = 0, najDl = 0, najStart = 0;
    for (int i = 0; i < n; i++) {
        int c = s[i] - 'a';
        if (ostatnio[c] >= poczatek) {
            poczatek = ostatnio[c] + 1;
        }
        ostatnio[c] = i;
        if (i - poczatek + 1 > najDl) {
            najDl = i - poczatek + 1;
            najStart = poczatek;
        }
    }
    cout << najDl << " " << s.substr(najStart, najDl) << "\n";
    return 0;
}`,
        },
        {
            id: 'str-b-kwota-slownie', krok: 9, level: 'trudne',
            title: 'Kwota słownie',
            short: '2026 → dwa tysiace dwadziescia szesc. Tablice-ściągi słów i polska gramatyka: tysiąc, tysiące czy tysięcy?',
            tags: ['tablice napisów', 'separator', 'tysiace / tysiecy'],
            statement: ['Na przelewach i fakturach kwotę zapisuje się także słownie. Dla każdej z n liczb od 0 do 999 999 wypisz jej zapis słowny, bez polskich znaków, ze słowami oddzielonymi pojedynczymi spacjami. Słowa, których potrzebujesz:', 'jedności: jeden, dwa, trzy, cztery, piec, szesc, siedem, osiem, dziewiec; liczby od 10 do 19: dziesiec, jedenascie, dwanascie, trzynascie, czternascie, pietnascie, szesnascie, siedemnascie, osiemnascie, dziewietnascie; dziesiątki: dwadziescia, trzydziesci, czterdziesci, piecdziesiat, szescdziesiat, siedemdziesiat, osiemdziesiat, dziewiecdziesiat; setki: sto, dwiescie, trzysta, czterysta, piecset, szescset, siedemset, osiemset, dziewiecset.', 'Tysiące: 1000 to „tysiac” (bez „jeden”). Dla liczby tysięcy t większej od 1 piszemy t słownie i dalej „tysiace”, gdy ostatnia cyfra t to 2, 3 albo 4, ale dwie ostatnie cyfry nie są 12, 13 ani 14 — a w każdym innym przypadku „tysiecy”. Zero to „zero”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednej liczbie.'],
            output_format: ['n wierszy z zapisami słownymi.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ każda liczba ≤ 999 999'],
            examples: [{ input: '5\n0\n15\n2026\n512345\n101000', note: '512 tysięcy kończy się na 12 — więc „tysiecy”, nie „tysiace”. 101 tysięcy to „sto jeden tysiecy”.' }],
            hint: R`Zrób cztery tablice napisów: jedności, nastki (10–19), dziesiątki i setki. Liczbę od 1 do 999 zamienisz tak: setki = x / 100, dziesiątki = x / 10 % 10, jedności = x % 10; gdy dziesiątki to 1, bierzesz nastkę numer jedności. Całą liczbę rozbij na tysiące t = n / 1000 i resztę n % 1000. Słowa doklejaj z separatorem — najprościej każde poprzedzaj spacją, a na końcu wypisz napis bez pierwszego znaku.`,
            tests: (r) => {
                const out = ['5\n0\n15\n2026\n512345\n101000', '12\n1\n10\n11\n19\n20\n100\n1000\n1001\n2000\n5000\n12000\n999999',
                    '14\n22000\n25000\n21000\n112000\n122000\n113000\n114000\n104000\n200000\n300015\n4000\n13013\n90090\n700700'];
                out.push(`100\n${Array.from({ length: 100 }, () => r.int(0, 999999)).join('\n')}`, `50\n${Array.from({ length: 50 }, () => r.int(0, 2000)).join('\n')}`);
                return out;
            },
            solve: (inp) => toks(inp).slice(1).map((x) => slownie(Number(x))).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string J[10] = {"", "jeden", "dwa", "trzy", "cztery", "piec", "szesc", "siedem", "osiem", "dziewiec"};
    string N[10] = {"dziesiec", "jedenascie", "dwanascie", "trzynascie", "czternascie", "pietnascie",
                    "szesnascie", "siedemnascie", "osiemnascie", "dziewietnascie"};
    string D[10] = {"", "", "dwadziescia", "trzydziesci", "czterdziesci", "piecdziesiat", "szescdziesiat",
                    "siedemdziesiat", "osiemdziesiat", "dziewiecdziesiat"};
    string S[10] = {"", "sto", "dwiescie", "trzysta", "czterysta", "piecset", "szescset", "siedemset",
                    "osiemset", "dziewiecset"};
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n;
        cin >> n;
        if (n == 0) {
            cout << "zero\n";
            continue;
        }
        int grupy[2] = {n / 1000, n % 1000};
        string w = "";
        for (int g = 0; g < 2; g++) {
            int x = grupy[g];
            if (x == 0) continue;
            if (g == 0 && x == 1) {
                w += " tysiac";
                continue;
            }
            int s = x / 100, d = x / 10 % 10, j = x % 10;
            if (s > 0) w += " " + S[s];
            if (d == 1) {
                w += " " + N[j];
            } else {
                if (d > 1) w += " " + D[d];
                if (j > 0) w += " " + J[j];
            }
            if (g == 0) {
                int dz = x % 100;
                if (j >= 2 && j <= 4 && !(dz >= 12 && dz <= 14)) w += " tysiace";
                else w += " tysiecy";
            }
        }
        cout << w.substr(1) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-b-edytor', krok: 9, level: 'trudne',
            title: 'Wielki finał: edytor tekstu',
            short: 'Zbuduj mały edytor: wstawianie, usuwanie, zamiana, wielkie litery, odwracanie i zliczanie — polecenie po poleceniu.',
            tags: ['insert / erase', 'find + replace', 'wszystko naraz'],
            statement: ['Napisz mały edytor tekstu. Na początku edytor zawiera podany tekst. Potem wykonuje q poleceń, po kolei:', 'WSTAW p x — wstaw słowo x tak, by jego pierwsza litera stanęła na pozycji p (pozycje liczymy od zera; p może być równe długości tekstu — wtedy x trafia na koniec). USUN p k — usuń k znaków, zaczynając od pozycji p. ZAMIEN a b — zamień każde wystąpienie słowa a na słowo b, od lewej do prawej; po każdej zamianie szukaj dalej za wstawionym słowem b. WIELKIE — zamień wszystkie litery na wielkie. MALE — zamień wszystkie litery na małe. ODWROC — odwróć cały tekst. ZLICZ x — wypisz, ile razy słowo x występuje w tekście (licząc też wystąpienia, które na siebie nachodzą). POKAZ — wypisz cały tekst albo PUSTY, jeśli tekst jest pusty.'],
            input_format: ['W pierwszym wierszu początkowy tekst (może zawierać spacje).', 'W drugim wierszu liczba q.', 'W kolejnych q wierszach polecenia. Słowa x, a, b w poleceniach nie zawierają spacji.'],
            output_format: ['Wyniki poleceń ZLICZ i POKAZ, każdy w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 200', 'Tekst ma zawsze najwyżej 100 znaków.', 'Polecenia USUN zawsze mieszczą się w tekście, a WSTAW ma 0 ≤ p ≤ długość tekstu.'],
            examples: [{ input: 'Ala ma kota\n6\nZAMIEN kota psa\nWSTAW 0 Ola_i_\nPOKAZ\nZLICZ a\nWIELKIE\nPOKAZ' }],
            hint: R`Tekst wczytaj przez getline, potem cin >> q i w pętli cin >> polecenie. Każde polecenie to jedna gałąź if / else if i jedna z metod z części 6: insert, erase, find i replace (pamiętaj o szukaniu za wstawionym tekstem), toupper i tolower w pętli z &, swap do odwracania. Przed wypisaniem sprawdź empty().`,
            tests: (r) => {
                const gen = (q) => {
                    let s = mix(r, zdanie(r, 2, 8), 0.2).slice(0, 60).trim() || 'tekst';
                    const start = s, pol = [];
                    while (pol.length < q) {
                        const typ = r.pick(['WSTAW', 'WSTAW', 'USUN', 'USUN', 'ZAMIEN', 'ZAMIEN', 'WIELKIE', 'MALE', 'ODWROC', 'ZLICZ', 'ZLICZ', 'POKAZ', 'POKAZ', 'POKAZ']);
                        let p = typ;
                        if (typ === 'WSTAW') { const x = mix(r, r() < 0.5 ? slowo(r) : word(r, 1, 6), 0.2); if (s.length + x.length > 100) continue; p = `WSTAW ${r.int(0, s.length)} ${x}`; }
                        else if (typ === 'USUN') { if (!s.length) continue; const a = r.int(0, s.length - 1); p = `USUN ${a} ${r.int(1, Math.min(10, s.length - a))}`; }
                        else if (typ === 'ZAMIEN') { const a = s.length && r() < 0.7 ? s.substr(r.int(0, s.length - 1), r.int(1, 3)).replace(/ .*/, '') || 'a' : word(r, 1, 3); const b = mix(r, word(r, 1, 5), 0.2); const t = edytuj(s, [`ZAMIEN ${a} ${b}`]); if (t.length > 100) continue; p = `ZAMIEN ${a} ${b}`; }
                        else if (typ === 'ZLICZ') { const x = s.length && r() < 0.7 ? s.substr(r.int(0, s.length - 1), r.int(1, 2)).replace(/ .*/, '') || 'a' : word(r, 1, 2); p = `ZLICZ ${x}`; }
                        s = edytuj(s, [p]);
                        pol.push(p);
                    }
                    return `${start}\n${q}\n${pol.join('\n')}`;
                };
                return ['Ala ma kota\n6\nZAMIEN kota psa\nWSTAW 0 Ola_i_\nPOKAZ\nZLICZ a\nWIELKIE\nPOKAZ',
                    'kot\n5\nUSUN 0 3\nPOKAZ\nZLICZ a\nWSTAW 0 aa\nPOKAZ', 'banan\n4\nZAMIEN a aa\nPOKAZ\nZLICZ aa\nODWROC',
                    'abc\n3\nODWROC\nPOKAZ\nMALE', gen(20), gen(100), gen(200), gen(200)];
            },
            check: (inp) => { const L = lines(inp); let s = L[0]; const q = Number(L[1]); for (let i = 0; i < q; i++) { const t = L[2 + i].split(' '); if (t[0] === 'WSTAW' && !(Number(t[1]) >= 0 && Number(t[1]) <= s.length)) return 'zły WSTAW'; if (t[0] === 'USUN' && !(Number(t[1]) >= 0 && Number(t[1]) + Number(t[2]) <= s.length && Number(t[2]) >= 1)) return 'zły USUN'; s = edytuj(s, [L[2 + i]]); if (s.length > 100) return 'tekst za długi'; } return null; },
            solve: (inp) => { const L = lines(inp); const q = Number(L[1]); const out = []; edytuj(L[0], L.slice(2, 2 + q), out); return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string polecenie;
        cin >> polecenie;
        if (polecenie == "WSTAW") {
            int p;
            string x;
            cin >> p >> x;
            s.insert(p, x);
        } else if (polecenie == "USUN") {
            int p, ile;
            cin >> p >> ile;
            s.erase(p, ile);
        } else if (polecenie == "ZAMIEN") {
            string a, b;
            cin >> a >> b;
            int p = s.find(a);
            while (p != -1) {
                s.replace(p, a.length(), b);
                p = s.find(a, p + b.length());
            }
        } else if (polecenie == "WIELKIE") {
            for (char &c : s) c = toupper(c);
        } else if (polecenie == "MALE") {
            for (char &c : s) c = tolower(c);
        } else if (polecenie == "ODWROC") {
            int n = s.length();
            for (int i = 0; i < n / 2; i++) swap(s[i], s[n - 1 - i]);
        } else if (polecenie == "ZLICZ") {
            string x;
            cin >> x;
            int ile = 0;
            int p = s.find(x);
            while (p != -1) {
                ile++;
                p = s.find(x, p + 1);
            }
            cout << ile << "\n";
        } else if (polecenie == "POKAZ") {
            if (s.empty()) cout << "PUSTY\n";
            else cout << s << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
