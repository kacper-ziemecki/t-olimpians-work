// String — ćwiczenia w trakcie lekcji, części 5–8: porównywanie napisów (kolejność słownikowa, olbrzymy,
// wielkość liter), fragmenty i szukanie (substr, find, rfind, erase, insert, replace), napisy i liczby
// (cyfry, to_string, olbrzymy cyfra po cyfrze, system dwójkowy) i napisy na olimpiadzie (liczniki liter,
// szyfry z modulo, okna, sumy prefiksowe, tablica napisów). Uczeń zna pierwszy etap i tablice.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const SLOWA = ['kot', 'pies', 'dom', 'ala', 'ma', 'kota', 'szkola', 'olimpiada', 'program', 'tablica', 'napis', 'litera',
        'zadanie', 'komputer', 'klawiatura', 'ekran', 'myszka', 'kajak', 'anna', 'radar', 'zeszyt', 'lekcja', 'matematyka',
        'informatyka', 'jablko', 'gruszka', 'sliwka', 'banan', 'wisnia', 'kotek', 'kotlet', 'okno', 'domek', 'rower', 'samochod',
        'pociag', 'samolot', 'statek', 'las', 'rzeka', 'gora', 'morze', 'slonce', 'ksiezyc', 'gwiazda', 'deszcz', 'snieg', 'wiatr',
        'burza', 'tecza', 'a', 'i', 'w', 'z', 'na', 'do', 'od', 'pod', 'nad', 'oraz', 'albo', 'bardzo', 'dzisiaj', 'jutro'];
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Jo', 'Al'];
    const NAZWISKA = ['Nowak', 'Kowalski', 'Wisniewska', 'Wojcik', 'Kaminski', 'Lewandowska', 'Zielinski', 'Szymanska', 'Wozniak',
        'Dabrowski', 'Kozlowska', 'Jankowski', 'Mazur', 'Krawczyk', 'Piotrowski', 'Grabowska', 'Nowakowski', 'Krol', 'Ek', 'Bak', 'Lis'];
    const lines = (s) => s.split('\n');
    const word = (r, a, b) => r.word(r.int(a, b));
    const slowo = (r) => r.pick(SLOWA);
    const zdanie = (r, a, b) => Array.from({ length: r.int(a, b) }, () => slowo(r)).join(' ');
    const mix = (r, s, p = 0.5) => [...s].map((c) => (r() < p ? c.toUpperCase() : c)).join('');
    const znaki = (r, n, alfabet) => Array.from({ length: n }, () => alfabet[Math.floor(r() * alfabet.length)]).join('');
    const isUp = (c) => c >= 'A' && c <= 'Z';
    const isLow = (c) => c >= 'a' && c <= 'z';
    const LITERY = 'abcdefghijklmnopqrstuvwxyz';
    const CYFRY = '0123456789';
    // liczba bez zer na początku (albo samo 0)
    const liczba = (r, d) => (d === 1 ? r.pick(CYFRY) : r.pick('123456789') + znaki(r, d - 1, CYFRY));
    const porLiczb = (a, b) => (a.length !== b.length ? a.length - b.length : a < b ? -1 : a > b ? 1 : 0);

    return [
        // ================================================================ KROK 5 · porównywanie
        {
            id: 'str-logowanie', krok: 5, level: 'latwe',
            title: 'Logowanie',
            short: 'Sprawdź próby logowania: dobry login i hasło, zły login albo złe hasło.',
            tags: ['==', '!=', 'else if'],
            statement: ['Konto w szkolnym systemie ma login i hasło. Wczytaj je, a potem n prób logowania — każda to wpisany login i wpisane hasło. Dla każdej próby wypisz ZALOGOWANO, gdy login i hasło są dokładnie takie jak na koncie; BLEDNY LOGIN, gdy login jest inny; albo BLEDNE HASLO, gdy login się zgadza, ale hasło nie. Wielkość liter ma znaczenie.'],
            input_format: ['W pierwszym wierszu login i hasło konta.', 'W drugim wierszu liczba n.', 'W kolejnych n wierszach próby: login i hasło.'],
            output_format: ['n wierszy: ZALOGOWANO, BLEDNY LOGIN albo BLEDNE HASLO.'],
            constraints: ['1 ≤ n ≤ 100', 'Loginy i hasła mają od 1 do 20 znaków (litery i cyfry).'],
            examples: [{ input: 'admin Sezam123\n4\nadmin Sezam123\nAdmin Sezam123\nadmin sezam123\nroot Sezam123', note: 'W drugiej próbie login zaczyna się wielką literą — to już inny login.' }],
            hint: R`Najpierw sprawdź login: if (l != login) — BLEDNY LOGIN. W przeciwnym razie (else if) sprawdź hasło. Porównujesz napisy zwykłym == i !=, wielkość liter ma znaczenie sama z siebie.`,
            tests: (r) => {
                const out = ['admin Sezam123\n4\nadmin Sezam123\nAdmin Sezam123\nadmin sezam123\nroot Sezam123'];
                const gen = (n) => {
                    const l = mix(r, word(r, 3, 10), 0.2), p = znaki(r, r.int(4, 20), LITERY + CYFRY + 'ABC');
                    const proby = Array.from({ length: n }, () => {
                        const a = r() < 0.7 ? l : r() < 0.5 ? mix(r, l, 0.5) : word(r, 1, 20);
                        const b = r() < 0.6 ? p : r() < 0.5 ? mix(r, p, 0.5) : znaki(r, r.int(1, 20), LITERY + CYFRY);
                        return `${a} ${b}`;
                    });
                    return `${l} ${p}\n${n}\n${proby.join('\n')}`;
                };
                out.push(gen(5), gen(30), gen(100), 'a 1\n3\na 1\nA 1\na 2');
                return out;
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[2]); const out = []; for (let i = 0; i < n; i++) { const a = t[3 + 2 * i], b = t[4 + 2 * i]; out.push(a !== t[0] ? 'BLEDNY LOGIN' : b !== t[1] ? 'BLEDNE HASLO' : 'ZALOGOWANO'); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string login, haslo;
    int n;
    cin >> login >> haslo >> n;
    for (int i = 0; i < n; i++) {
        string l, h;
        cin >> l >> h;
        if (l != login) {
            cout << "BLEDNY LOGIN\n";
        } else if (h != haslo) {
            cout << "BLEDNE HASLO\n";
        } else {
            cout << "ZALOGOWANO\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-kolejnosc-w-dzienniku', krok: 5, level: 'latwe',
            title: 'Kolejność w dzienniku',
            short: 'Dwie osoby: kto jest pierwszy w dzienniku? Najpierw decyduje nazwisko, potem imię.',
            tags: ['<', 'dwa klucze', 'kolejność słownikowa'],
            statement: ['W dzienniku uczniowie stoją w kolejności alfabetycznej nazwisk, a gdy nazwiska są takie same — w kolejności alfabetycznej imion. Wczytaj dwie osoby i wypisz je w kolejności z dziennika, każdą w osobnym wierszu, w postaci „Imie Nazwisko”.'],
            input_format: ['Dwa wiersze, w każdym imię i nazwisko jednej osoby.'],
            output_format: ['Dwa wiersze: osoby w kolejności z dziennika.'],
            constraints: ['Imiona i nazwiska mają od 2 do 20 liter: pierwsza wielka, pozostałe małe.'],
            examples: [{ input: 'Ola Nowak\nAdam Kowalski', note: 'Kowalski jest przed Nowak, więc Adam idzie pierwszy, choć Ola jest wcześniej w alfabecie.' }, { input: 'Zofia Nowak\nAnna Nowak' }],
            hint: R`Pierwsza osoba idzie pierwsza, gdy n1 < n2 albo gdy n1 == n2 i i1 < i2. Wszystkie słowa zaczynają się wielką literą, a dalej mają małe — więc zwykłe porównanie napisów daje kolejność alfabetyczną.`,
            tests: (r) => {
                const os = () => `${r.pick(IMIONA)} ${r.pick(NAZWISKA)}`;
                const out = ['Ola Nowak\nAdam Kowalski', 'Zofia Nowak\nAnna Nowak', 'Jan Kowal\nJan Kowalski', 'Ewa Lis\nEwa Lis', 'Al Bak\nAla Bak'];
                for (let i = 0; i < 6; i++) out.push(`${os()}\n${os()}`);
                const n = r.pick(NAZWISKA); out.push(`${r.pick(IMIONA)} ${n}\n${r.pick(IMIONA)} ${n}`);
                return out;
            },
            solve: (inp) => { const [i1, n1, i2, n2] = toks(inp); const pierwsza = n1 < n2 || (n1 === n2 && i1 <= i2); return pierwsza ? `${i1} ${n1}\n${i2} ${n2}` : `${i2} ${n2}\n${i1} ${n1}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string i1, n1, i2, n2;
    cin >> i1 >> n1 >> i2 >> n2;
    if (n1 < n2 || (n1 == n2 && i1 <= i2)) {
        cout << i1 << " " << n1 << "\n" << i2 << " " << n2 << "\n";
    } else {
        cout << i2 << " " << n2 << "\n" << i1 << " " << n1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-bez-wielkosci', krok: 5, level: 'latwe',
            title: 'Bez względu na wielkość liter',
            short: 'Czy dwa słowa są takie same, jeśli nie patrzymy na wielkość liter? KoT = kot.',
            tags: ['tolower', 'kopia napisu', '=='],
            statement: ['Dla każdej z n par słów sprawdź, czy słowa są takie same, gdy nie zwracamy uwagi na wielkość liter — na przykład „KoT” i „kOt” są takie same, a „kot” i „kat” nie. Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwa słowa.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', 'Słowa mają od 1 do 30 liter.'],
            examples: [{ input: '4\nKoT kOt\nkot kat\nOlimpiada OLIMPIADA\nkot kotek' }],
            hint: R`Zamień oba słowa na małe litery (pętla for (char &c : s) c = tolower(c);) i dopiero wtedy porównaj przez ==. Różna długość od razu daje NIE — == też to wie.`,
            tests: (r) => {
                const para = () => { const w = word(r, 1, 30); const x = r() < 0.6 ? mix(r, w, 0.5) : r() < 0.5 ? mix(r, w.slice(0, -1) + 'q', 0.5) : word(r, 1, 30); return `${mix(r, w, 0.5)} ${x}`; };
                return ['4\nKoT kOt\nkot kat\nOlimpiada OLIMPIADA\nkot kotek', '2\na A\nA b', `20\n${Array.from({ length: 20 }, para).join('\n')}`, `100\n${Array.from({ length: 100 }, para).join('\n')}`];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) out.push(t[1 + 2 * i].toLowerCase() === t[2 + 2 * i].toLowerCase() ? 'TAK' : 'NIE'); return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string a, b;
        cin >> a >> b;
        for (char &c : a) c = tolower(c);
        for (char &c : b) c = tolower(c);
        cout << (a == b ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-slownik-bez-wielkosci', krok: 5, level: 'srednie',
            title: 'Pierwsze i ostatnie w słowniku',
            short: 'Najmniejsze i największe słowo — ale porządek ma być prawdziwie alfabetyczny, bez patrzenia na wielkość liter.',
            tags: ['minimum i maksimum', 'tolower', 'oryginał i kopia'],
            statement: ['Wczytaj n słów, w których wielkie i małe litery są wymieszane. Wypisz słowo, które w słowniku stałoby najwcześniej, i słowo, które stałoby najpóźniej — przy czym kolejność ma być alfabetyczna bez względu na wielkość liter (dla porównania „Zebra” to to samo co „zebra”). Wypisz te słowa tak, jak zostały wczytane, każde w osobnym wierszu. Jeśli kilka słów jest równych bez względu na wielkość liter, wybierz to, które pojawiło się najwcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów.'],
            output_format: ['Dwa wiersze: najwcześniejsze i najpóźniejsze słowo w oryginalnej postaci.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 20 liter.'],
            examples: [{ input: '4\nZebra antylopa Kot bawol', note: 'Bez względu na wielkość: antylopa < bawol < kot < zebra. Zwykłe porównanie napisów postawiłoby Kot i Zebra na początku, bo wielkie litery są przed małymi.' }],
            hint: R`Trzymaj rekordy w dwóch postaciach: oryginał (do wypisania) i kopię małymi literami (do porównań). Dla każdego słowa zrób kopię małymi literami i porównuj ją z kopią rekordu. Zmieniaj rekord tylko przy ostrej nierówności, wtedy przy remisie zostanie słowo wcześniejsze.`,
            tests: (r) => {
                const lista = (n) => Array.from({ length: n }, () => mix(r, r() < 0.5 ? slowo(r) : word(r, 1, 20), r.pick([0, 0.2, 0.5, 1])));
                return ['4\nZebra antylopa Kot bawol', '1\nX', '3\nkot KOT Kot', '3\nAla ala ALA', `10\n${lista(10).join(' ')}`, `200\n${lista(200).join(' ')}`, `1000\n${lista(1000).join(' ')}`];
            },
            solve: (inp) => { const t = toks(inp); const w = t.slice(1, 1 + Number(t[0])); let a = 0, b = 0; w.forEach((x, i) => { const l = x.toLowerCase(); if (l < w[a].toLowerCase()) a = i; if (l > w[b].toLowerCase()) b = i; }); return `${w[a]}\n${w[b]}`; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int n;
    cin >> n;
    string najm, najmMale, najw, najwMale;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        string m = s;
        for (char &c : m) c = tolower(c);
        if (i == 0 || m < najmMale) {
            najm = s;
            najmMale = m;
        }
        if (i == 0 || m > najwMale) {
            najw = s;
            najwMale = m;
        }
    }
    cout << najm << "\n" << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'str-olbrzymy-min-max', krok: 5, level: 'srednie',
            title: 'Najmniejszy i największy olbrzym',
            short: 'Liczby po 50 cyfr nie zmieszczą się w long long. Porównuj je jako napisy — ale mądrze.',
            tags: ['olbrzymy', 'najpierw długość', 'minimum i maksimum'],
            statement: ['Wczytaj n nieujemnych liczb całkowitych, z których każda może mieć nawet 50 cyfr — za dużo dla long long. Wypisz najmniejszą i największą z nich, każdą w osobnym wierszu. Liczby nie zaczynają się od zera, chyba że to samo 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednej liczbie.'],
            output_format: ['Dwa wiersze: najmniejsza i największa liczba.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każda liczba ma od 1 do 50 cyfr.'],
            examples: [{ input: '5\n99\n100\n7\n1000000000000000000000\n123', note: 'Jako napisy „99” > „100”, ale jako liczby 99 < 100 — dłuższa liczba jest większa.' }],
            hint: R`Liczba a jest mniejsza od b, gdy jest krótsza, a przy równej długości — gdy a < b jako napis. Zapisz ten warunek raz i używaj go w obu porównaniach z rekordami (minimum i maksimum startują od pierwszej liczby).`,
            tests: (r) => {
                const out = ['5\n99\n100\n7\n1000000000000000000000\n123', '1\n0', '3\n0\n10\n9'];
                const lista = (n, a, b) => Array.from({ length: n }, () => liczba(r, r.int(a, b)));
                out.push(`10\n${lista(10, 1, 50).join('\n')}`, `1000\n${lista(1000, 1, 50).join('\n')}`, `200\n${lista(200, 49, 50).join('\n')}`, `100\n${lista(100, 18, 20).join('\n')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp).slice(1); let a = t[0], b = t[0]; for (const x of t) { if (porLiczb(x, a) < 0) a = x; if (porLiczb(x, b) > 0) b = x; } return `${a}\n${b}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string najm, najw;
    cin >> najm;
    najw = najm;
    for (int i = 1; i < n; i++) {
        string x;
        cin >> x;
        bool mniejsza, wieksza;
        if (x.length() != najm.length()) mniejsza = x.length() < najm.length();
        else mniejsza = x < najm;
        if (x.length() != najw.length()) wieksza = x.length() > najw.length();
        else wieksza = x > najw;
        if (mniejsza) najm = x;
        if (wieksza) najw = x;
    }
    cout << najm << "\n" << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'str-czy-alfabetycznie', krok: 5, level: 'latwe',
            title: 'Lista w porządku?',
            short: 'Czy słowa stoją w kolejności alfabetycznej? Jeśli nie — gdzie pierwszy raz jest źle?',
            tags: ['t[i] > t[i + 1]', 'tablica napisów', 'sąsiedzi'],
            statement: ['Wczytaj listę n słów i sprawdź, czy stoją w kolejności alfabetycznej — każde następne słowo jest takie samo jak poprzednie albo dalej w słowniku. Jeśli tak, wypisz TAK. Jeśli nie, wypisz NIE, a po spacji numer k pierwszego słowa, po którym stoi słowo wcześniejsze w alfabecie (słowa numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter.'],
            output_format: ['TAK albo NIE i numer k.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 20 małych liter.'],
            examples: [{ input: '5\nala ania anna ewa ola' }, { input: '5\nala ania kot ewa ola', note: 'Po słowie numer 3 (kot) stoi ewa, która jest wcześniej w alfabecie.' }],
            hint: R`Słowa możesz porównywać na bieżąco: pamiętaj poprzednie słowo i porównuj z nim każde nowe. Gdy poprzednie > obecne, wypisz NIE i numer poprzedniego — i nie sprawdzaj już dalej.`,
            tests: (r) => {
                const out = ['5\nala ania anna ewa ola', '5\nala ania kot ewa ola', '1\nz', '2\nb a', '3\nkot kot kot', '2\nkot kotek', '2\nkotek kot'];
                const uporz = (n) => Array.from({ length: n }, () => word(r, 1, 6)).sort();
                const zepsuj = (a) => { const b = a.slice(); const i = r.int(0, b.length - 2); [b[i], b[i + 1]] = [b[i + 1], b[i]]; return b; };
                out.push(`10\n${uporz(10).join(' ')}`, `1000\n${uporz(1000).join(' ')}`, `1000\n${zepsuj(uporz(1000)).join(' ')}`, `50\n${zepsuj(uporz(50)).join(' ')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); const w = t.slice(1, 1 + Number(t[0])); for (let i = 0; i + 1 < w.length; i++) if (w[i] > w[i + 1]) return `NIE ${i + 1}`; return 'TAK'; },
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
        if (poprzednie > s) {
            cout << "NIE " << i - 1 << "\n";
            return 0;
        }
        poprzednie = s;
    }
    cout << "TAK\n";
    return 0;
}`,
        },
        {
            id: 'str-miejsce-w-slowniku', krok: 5, level: 'srednie',
            title: 'Miejsce w słowniku',
            short: 'Dla każdego słowa podaj, na którym miejscu stałoby w słowniku — bez sortowania.',
            tags: ['tablica napisów', 'pętla w pętli', 'licz mniejsze'],
            statement: ['Wczytaj n słów. Dla każdego z nich wypisz, na którym miejscu stałoby po ułożeniu całej listy w kolejności alfabetycznej. Miejsce słowa to 1 plus liczba słów z listy, które są od niego ostro mniejsze. Takie same słowa dostają więc to samo miejsce. Wypisz n liczb w kolejności słów z wejścia.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter.'],
            output_format: ['Jeden wiersz z n liczbami oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 20 małych liter.'],
            examples: [{ input: '5\nola ala ewa ala zosia', note: 'Mniejszych od „ola” jest trzy słowa (ala, ewa, ala), więc stoi na miejscu 4. Oba „ala” są na miejscu 1.' }],
            hint: R`Wczytaj słowa do tablicy string t[1005]. Dla każdego i policz pętlą po j, ile jest słów t[j] < t[i] — miejsce to ta liczba plus 1. To około miliona porównań — w sam raz.`,
            tests: (r) => {
                const lista = (n, a, b) => Array.from({ length: n }, () => (r() < 0.3 ? slowo(r) : word(r, a, b)));
                return ['5\nola ala ewa ala zosia', '1\nkot', '3\nc b a', `10\n${lista(10, 1, 4).join(' ')}`, `300\n${lista(300, 1, 3).join(' ')}`, `1000\n${lista(1000, 1, 20).join(' ')}`];
            },
            solve: (inp) => { const t = toks(inp); const w = t.slice(1, 1 + Number(t[0])); return w.map((x) => 1 + w.filter((y) => y < x).length).join(' '); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n; i++) {
        int miejsce = 1;
        for (int j = 0; j < n; j++) {
            if (t[j] < t[i]) miejsce++;
        }
        cout << miejsce << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-wspolny-poczatek', krok: 5, level: 'latwe',
            title: 'Wspólny początek',
            short: 'Jak długi jest wspólny początek dwóch słów? kotek i kotlet — „kot”.',
            tags: ['while', 'a[i] == b[i]', 'skrócone obliczanie'],
            statement: ['Dla każdej z n par słów znajdź ich najdłuższy wspólny początek, czyli najdłuższy napis, od którego zaczynają się oba słowa. Wypisz jego długość, a jeśli jest większa od zera — po spacji także sam ten początek.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwa słowa.'],
            output_format: ['n wierszy: długość wspólnego początku i ten początek (albo samo 0).'],
            constraints: ['1 ≤ n ≤ 100', 'Słowa mają od 1 do 100 małych liter.'],
            examples: [{ input: '4\nkotek kotlet\nala ola\nkot kotek\nanna anna' }],
            hint: R`Idź od początku, dopóki i jest mniejsze od obu długości i znaki są równe: while (i < na && i < nb && a[i] == b[i]) i++;. Kolejność warunków chroni przed zajrzeniem poza krótsze słowo. Wspólny początek to i pierwszych znaków.`,
            tests: (r) => {
                const para = () => { const p = word(r, 0, 10); return `${p}${word(r, 1, 50)} ${p}${word(r, r.pick([0, 1, 1]), 50)}`.replace(/^ /, 'a ').trim(); };
                const out = ['4\nkotek kotlet\nala ola\nkot kotek\nanna anna', '1\na a', '1\na b'];
                out.push(`20\n${Array.from({ length: 20 }, para).join('\n')}`, `100\n${Array.from({ length: 100 }, para).join('\n')}`);
                return out;
            },
            check: (inp) => (lines(inp).slice(1).every((l) => toks(l).length === 2) ? null : 'para bez dwóch słów'),
            solve: (inp) => { const L = lines(inp).slice(1); return L.map((l) => { const [a, b] = toks(l); let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i ? `${i} ${a.slice(0, i)}` : '0'; }).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string a, b;
        cin >> a >> b;
        int na = a.length(), nb = b.length();
        int i = 0;
        while (i < na && i < nb && a[i] == b[i]) {
            i++;
        }
        if (i == 0) {
            cout << 0 << "\n";
        } else {
            cout << i << " " << a.substr(0, i) << "\n";
        }
    }
    return 0;
}`,
        },

        // ================================================================ KROK 6 · fragmenty i szukanie
        {
            id: 'str-poczatek-koniec', krok: 6, level: 'latwe',
            title: 'Początek i koniec',
            short: 'Wytnij ze słowa pierwsze k i ostatnie k liter.',
            tags: ['substr(0, k)', 'substr(n - k)', 'przedrostek i przyrostek'],
            statement: ['Wczytaj słowo i liczbę k. Wypisz w pierwszym wierszu pierwsze k liter słowa, a w drugim — ostatnie k liter.'],
            input_format: ['Jeden wiersz: słowo i liczba k.'],
            output_format: ['Dwa wiersze: początek i koniec słowa.'],
            constraints: ['Słowo ma od 1 do 100 małych liter.', '1 ≤ k ≤ długość słowa'],
            examples: [{ input: 'kotlet 3' }, { input: 'olimpiada 9', note: 'Gdy k to cała długość, początek i koniec to całe słowo.' }],
            hint: R`Początek: s.substr(0, k). Koniec zaczyna się na pozycji n - k, więc to s.substr(n - k) — bez drugiej liczby, do samego końca.`,
            check: (inp) => { const [s, k] = toks(inp); return Number(k) >= 1 && Number(k) <= s.length ? null : 'złe k'; },
            tests: (r) => {
                const out = ['kotlet 3', 'olimpiada 9', 'a 1', 'ab 1'];
                for (let i = 0; i < 6; i++) { const s = word(r, 1, 100); out.push(`${s} ${r.int(1, s.length)}`); }
                return out;
            },
            solve: (inp) => { const [s, k] = toks(inp); return `${s.slice(0, Number(k))}\n${s.slice(s.length - Number(k))}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    int n = s.length();
    cout << s.substr(0, k) << "\n";
    cout << s.substr(n - k) << "\n";
    return 0;
}`,
        },
        {
            id: 'str-login', krok: 6, level: 'latwe',
            title: 'Login do dziennika',
            short: 'Jan Kowalski → jankow: trzy litery imienia i trzy nazwiska, małymi literami.',
            tags: ['substr(0, 3)', 'tolower', 'krótsze słowa'],
            statement: ['Szkoła tworzy loginy do dziennika elektronicznego. Login to pierwsze trzy litery imienia i zaraz za nimi pierwsze trzy litery nazwiska, wszystko małymi literami. Jeśli imię albo nazwisko ma mniej niż trzy litery, bierzemy je całe. Wypisz loginy dla n osób.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach imię i nazwisko.'],
            output_format: ['n wierszy z loginami.'],
            constraints: ['1 ≤ n ≤ 100', 'Imiona i nazwiska mają od 1 do 20 liter.'],
            examples: [{ input: '3\nJan Kowalski\nOla Ek\nIGNACY nowak', note: 'Ek ma tylko dwie litery, więc bierzemy je całe: olaek.' }],
            hint: R`s.substr(0, 3) jest bezpieczne nawet dla krótszych słów — bierze tyle liter, ile jest. Sklej oba kawałki, a potem zamień cały login na małe litery pętlą z tolower.`,
            tests: (r) => {
                const os = () => `${mix(r, r.pick(IMIONA), r.pick([0, 0, 1]))} ${mix(r, r.pick(NAZWISKA), r.pick([0, 0, 1]))}`;
                return ['3\nJan Kowalski\nOla Ek\nIGNACY nowak', '2\nA B\nAb Cd', `20\n${Array.from({ length: 20 }, os).join('\n')}`, `100\n${Array.from({ length: 100 }, () => `${mix(r, word(r, 1, 20), 0.3)} ${mix(r, word(r, 1, 20), 0.3)}`).join('\n')}`];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) out.push((t[1 + 2 * i].slice(0, 3) + t[2 + 2 * i].slice(0, 3)).toLowerCase()); return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string imie, nazwisko;
        cin >> imie >> nazwisko;
        string login = imie.substr(0, 3) + nazwisko.substr(0, 3);
        for (char &c : login) c = tolower(c);
        cout << login << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-data-iso', krok: 6, level: 'latwe',
            title: 'Data na odwrót',
            short: '25.12.2026 → 2026-12-25: przestaw kawałki daty wycinane przez substr.',
            tags: ['substr', 'stałe pozycje', 'sklejanie'],
            statement: ['W Polsce datę zapisujemy jako DD.MM.RRRR, a komputery najchętniej jako RRRR-MM-DD — wtedy kolejność alfabetyczna dat to kolejność w czasie. Zamień n dat z polskiego zapisu na komputerowy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednej dacie w postaci DD.MM.RRRR.'],
            output_format: ['n wierszy z datami w postaci RRRR-MM-DD.'],
            constraints: ['1 ≤ n ≤ 100', 'Dzień i miesiąc mają zawsze dwie cyfry, rok — cztery.'],
            examples: [{ input: '2\n25.12.2026\n01.05.1999' }],
            hint: R`Dzień to s.substr(0, 2), miesiąc s.substr(3, 2), a rok s.substr(6, 4). Sklej je w nowej kolejności z myślnikami: rok + "-" + miesiac + "-" + dzien.`,
            tests: (r) => {
                const d = () => `${String(r.int(1, 28)).padStart(2, '0')}.${String(r.int(1, 12)).padStart(2, '0')}.${r.int(1000, 2999)}`;
                return ['2\n25.12.2026\n01.05.1999', '1\n31.01.2000', `10\n${Array.from({ length: 10 }, d).join('\n')}`, `100\n${Array.from({ length: 100 }, d).join('\n')}`];
            },
            solve: (inp) => toks(inp).slice(1).map((s) => `${s.slice(6, 10)}-${s.slice(3, 5)}-${s.slice(0, 2)}`).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        cout << s.substr(6, 4) << "-" << s.substr(3, 2) << "-" << s.substr(0, 2) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-gdzie-wzorzec', krok: 6, level: 'latwe',
            title: 'Gdzie jest wzorzec?',
            short: 'Znajdź pierwsze i ostatnie wystąpienie fragmentu w tekście — find i rfind.',
            tags: ['find', 'rfind', 'npos'],
            statement: ['Wczytaj tekst i szukany fragment (wzorzec). Wypisz pozycję pierwszego i pozycję ostatniego wystąpienia wzorca w tekście — pozycję liczymy od zera, jest to numer pierwszego znaku wystąpienia. Jeśli wzorzec występuje tylko raz, obie liczby są równe. Jeśli nie występuje wcale, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu tekst (może zawierać spacje).', 'W drugim wierszu wzorzec (może zawierać spacje, ale nie zaczyna się ani nie kończy spacją).'],
            output_format: ['Dwie liczby oddzielone spacją albo BRAK.'],
            constraints: ['Tekst ma od 1 do 1000 znaków.', 'Wzorzec ma od 1 do 20 znaków.'],
            examples: [{ input: 'ala ma kota a kot ma ale\nkot' }, { input: 'ala ma kota\nma k' }, { input: 'ala ma kota\npies' }],
            hint: R`Oba wiersze wczytaj przez getline — wzorzec też może mieć spacje. Pierwsze wystąpienie to tekst.find(wzorzec), ostatnie — tekst.rfind(wzorzec). Brak sprawdzisz porównaniem z string::npos.`,
            tests: (r) => {
                const out = ['ala ma kota a kot ma ale\nkot', 'ala ma kota\nma k', 'ala ma kota\npies', 'aaaa\naa', 'x\nx'];
                const t1 = zdanie(r, 50, 100).slice(0, 1000).trim();
                out.push(`${t1}\n${slowo(r)}`, `${t1}\nkot`, `${zdanie(r, 5, 20)}\nzzz`);
                const t2 = znaki(r, 1000, 'ab'); out.push(`${t2}\n${znaki(r, 5, 'ab')}`, `${t2}\n${znaki(r, 12, 'ab')}`);
                return out;
            },
            check: (inp) => { const p = lines(inp)[1]; return p && p === p.trim() ? null : 'zły wzorzec'; },
            solve: (inp) => { const [t, p] = lines(inp); const a = t.indexOf(p); return a < 0 ? 'BRAK' : `${a} ${t.lastIndexOf(p)}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string tekst, wzorzec;
    getline(cin, tekst);
    getline(cin, wzorzec);
    if (tekst.find(wzorzec) == string::npos) {
        cout << "BRAK\n";
    } else {
        cout << tekst.find(wzorzec) << " " << tekst.rfind(wzorzec) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-ile-wystapien', krok: 6, level: 'srednie',
            title: 'Ile razy wzorzec?',
            short: 'Policz wszystkie wystąpienia — także te, które na siebie nachodzą: „aa” w „aaaa” to 3.',
            tags: ['find(x, p + 1)', 'pętla while', 'nakładanie'],
            statement: ['Wczytaj napis i wzorzec. Policz, ile razy wzorzec występuje w napisie. Liczą się wszystkie wystąpienia, także te, które na siebie nachodzą: w napisie „aaaa” wzorzec „aa” występuje 3 razy (od pozycji 0, 1 i 2).'],
            input_format: ['Jeden wiersz: napis i wzorzec oddzielone spacją.'],
            output_format: ['Liczba wystąpień.'],
            constraints: ['Napis ma od 1 do 1000 małych liter.', 'Wzorzec ma od 1 do 10 małych liter.'],
            examples: [{ input: 'aaaa aa' }, { input: 'abrakadabra abra' }, { input: 'kot pies' }],
            hint: R`int p = s.find(w); while (p != -1) { licznik++; p = s.find(w, p + 1); }. Szukanie od p + 1 (a nie od p + długość wzorca) znajduje też wystąpienia, które nachodzą na poprzednie.`,
            tests: (r) => {
                const out = ['aaaa aa', 'abrakadabra abra', 'kot pies', 'a a', 'a aa'];
                out.push(`${znaki(r, 1000, 'a')} ${'a'.repeat(10)}`, `${znaki(r, 1000, 'ab')} ${znaki(r, 3, 'ab')}`, `${znaki(r, 1000, 'abc')} ${znaki(r, 2, 'abc')}`,
                    `${'abab'.repeat(250)} abab`, `${word(r, 500, 1000)} ${r.word(1)}`);
                return out;
            },
            solve: (inp) => { const [s, w] = toks(inp); let k = 0, p = s.indexOf(w); while (p !== -1) { k++; p = s.indexOf(w, p + 1); } return String(k); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, w;
    cin >> s >> w;
    int ile = 0;
    int p = s.find(w);
    while (p != -1) {
        ile++;
        p = s.find(w, p + 1);
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'str-rozszerzenie', krok: 6, level: 'latwe',
            title: 'Rozszerzenie pliku',
            short: 'zdjecie.wakacje.jpg → jpg. Szukaj ostatniej kropki: rfind.',
            tags: ['rfind', 'substr(p + 1)', 'BRAK'],
            statement: ['Rozszerzenie pliku to część nazwy za ostatnią kropką: w „zadanie.cpp” to cpp, a w „archiwum.tar.gz” — gz. Dla każdej z n nazw plików wypisz rozszerzenie albo BRAK, jeśli w nazwie nie ma kropki.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach nazwy plików (bez spacji).'],
            output_format: ['n wierszy: rozszerzenie albo BRAK.'],
            constraints: ['1 ≤ n ≤ 100', 'Nazwy mają od 1 do 50 znaków: liter, cyfr, kropek, podkreślników i myślników.', 'Nazwa nie zaczyna się ani nie kończy kropką.'],
            examples: [{ input: '4\nzadanie.cpp\narchiwum.tar.gz\nMakefile\nfoto_2026.JPG' }],
            hint: R`int p = nazwa.rfind('.'); — ostatnia kropka albo -1, gdy jej nie ma. Rozszerzenie to wszystko za kropką: nazwa.substr(p + 1).`,
            check: (inp) => (toks(inp).slice(1).every((x) => x[0] !== '.' && x[x.length - 1] !== '.') ? null : 'kropka na brzegu'),
            tests: (r) => {
                const EXT = ['cpp', 'txt', 'jpg', 'JPG', 'png', 'pdf', 'gz', 'zip', 'html', 'mp3', 'c', 'h', 'docx'];
                const nazwa = () => {
                    let s = znaki(r, r.int(1, 15), LITERY + CYFRY + '_-');
                    for (let k = r.pick([0, 1, 1, 1, 2, 3]); k > 0; k--) s += '.' + (r() < 0.7 ? r.pick(EXT) : znaki(r, r.int(1, 6), LITERY + CYFRY));
                    return s.slice(0, 50).replace(/\.+$/, '') || 'a';
                };
                return ['4\nzadanie.cpp\narchiwum.tar.gz\nMakefile\nfoto_2026.JPG', '2\na.b\nab', `30\n${Array.from({ length: 30 }, nazwa).join('\n')}`, `100\n${Array.from({ length: 100 }, nazwa).join('\n')}`];
            },
            solve: (inp) => toks(inp).slice(1).map((x) => { const p = x.lastIndexOf('.'); return p < 0 ? 'BRAK' : x.slice(p + 1); }).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string nazwa;
        cin >> nazwa;
        int p = nazwa.rfind('.');
        if (p == -1) {
            cout << "BRAK\n";
        } else {
            cout << nazwa.substr(p + 1) << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-email', krok: 6, level: 'srednie',
            title: 'Adres e-mail',
            short: 'Rozetnij adres na użytkownika i domenę — o ile adres ma sens.',
            tags: ['find', 'rfind', 'substr'],
            statement: ['Dla każdego z n napisów sprawdź, czy wygląda jak adres e-mail: zawiera dokładnie jeden znak @, a przed nim i za nim stoi co najmniej po jednym znaku. Jeśli tak, wypisz część przed @ (użytkownika) i część za @ (domenę), oddzielone spacją. W przeciwnym razie wypisz NIEPOPRAWNY.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym napisie bez spacji.'],
            output_format: ['n wierszy: użytkownik i domena albo NIEPOPRAWNY.'],
            constraints: ['1 ≤ n ≤ 100', 'Napisy mają od 1 do 50 znaków: liter, cyfr, kropek, podkreślników i znaków @.'],
            examples: [{ input: '5\njan.kowalski@szkola.pl\nola@@gmail.com\n@onet.pl\nadam.nowak\nx@y', note: 'Drugi ma dwa znaki @, trzeci nie ma nic przed @, czwarty nie ma @ wcale.' }],
            hint: R`Dokładnie jeden @ to taki, którego pierwsze i ostatnie wystąpienie są w tym samym miejscu: find('@') == rfind('@') i różne od -1. Przed @ musi coś być (p > 0) i za nim też (p < n - 1).`,
            tests: (r) => {
                const zn = LITERY + CYFRY + '._';
                const adres = () => {
                    const x = r();
                    if (x < 0.55) return `${znaki(r, r.int(1, 15), zn)}@${znaki(r, r.int(1, 15), zn)}`;
                    if (x < 0.7) return `${znaki(r, r.int(1, 15), zn)}@${znaki(r, r.int(0, 5), zn)}@${znaki(r, r.int(1, 10), zn)}`;
                    if (x < 0.8) return `@${znaki(r, r.int(1, 15), zn)}`;
                    if (x < 0.9) return `${znaki(r, r.int(1, 15), zn)}@`;
                    return znaki(r, r.int(1, 20), zn);
                };
                return ['5\njan.kowalski@szkola.pl\nola@@gmail.com\n@onet.pl\nadam.nowak\nx@y', '3\n@\n@@\na@b@c', `30\n${Array.from({ length: 30 }, adres).join('\n')}`, `100\n${Array.from({ length: 100 }, adres).join('\n')}`];
            },
            solve: (inp) => toks(inp).slice(1).map((s) => { const p = s.indexOf('@'); if (p < 0 || p !== s.lastIndexOf('@') || p === 0 || p === s.length - 1) return 'NIEPOPRAWNY'; return `${s.slice(0, p)} ${s.slice(p + 1)}`; }).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        int dl = s.length();
        int p = s.find('@');
        int q = s.rfind('@');
        if (p == -1 || p != q || p == 0 || p == dl - 1) {
            cout << "NIEPOPRAWNY\n";
        } else {
            cout << s.substr(0, p) << " " << s.substr(p + 1) << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'str-zamien-wszystkie', krok: 6, level: 'srednie',
            title: 'Zamień wszystkie',
            short: 'Podmień w tekście każde wystąpienie słowa a na słowo b — find i replace w pętli.',
            tags: ['find', 'replace', 'p + b.length()'],
            statement: ['Wczytaj tekst oraz dwa słowa a i b. Zamień w tekście każde wystąpienie a na b i wypisz wynik. Zamieniamy od lewej do prawej: po każdej zamianie szukamy kolejnego wystąpienia a dopiero za wstawionym słowem b. Tekst wstawiony podczas zamiany nie jest już przeszukiwany.'],
            input_format: ['W pierwszym wierszu tekst (może zawierać spacje).', 'W drugim wierszu słowa a i b oddzielone spacją.'],
            output_format: ['Tekst po zamianach.'],
            constraints: ['Tekst ma od 1 do 500 znaków.', 'Słowa a i b mają od 1 do 10 znaków (bez spacji).'],
            examples: [
                { input: 'kot i kot i kotek\nkot pies' },
                { input: 'banan\na aa', note: 'Każde a zamienia się na aa. Szukanie od pozycji za wstawionym „aa” sprawia, że nowych liter a już nie zamieniamy — inaczej program nigdy by się nie skończył.' },
            ],
            hint: R`int p = tekst.find(a); while (p != -1) { tekst.replace(p, a.length(), b); p = tekst.find(a, p + b.length()); }. Kluczowe jest p + b.length() — szukamy za wstawionym słowem.`,
            tests: (r) => {
                const out = ['kot i kot i kotek\nkot pies', 'banan\na aa', 'aaaa\naa b', 'abc\nx y', 'x\nx yyyyyyyyyy'];
                const t = zdanie(r, 30, 60).slice(0, 500).trim();
                out.push(`${t}\na e`, `${t}\nkot pies`, `${t}\n${slowo(r)} ${word(r, 1, 10)}`, `${znaki(r, 500, 'ab')}\nab ba`, `${znaki(r, 500, 'a')}\na aaaaaaaaaa`, `${znaki(r, 500, 'ab ')}\nb bab`);
                return out;
            },
            check: (inp) => { const L = lines(inp); return L[0].length <= 500 && toks(L[1]).length === 2 ? null : 'złe dane'; },
            solve: (inp) => { const L = lines(inp); let s = L[0]; const [a, b] = toks(L[1]); let p = s.indexOf(a); while (p !== -1) { s = s.slice(0, p) + b + s.slice(p + a.length); p = s.indexOf(a, p + b.length); } return s; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string tekst, a, b;
    getline(cin, tekst);
    cin >> a >> b;
    int p = tekst.find(a);
    while (p != -1) {
        tekst.replace(p, a.length(), b);
        p = tekst.find(a, p + b.length());
    }
    cout << tekst << "\n";
    return 0;
}`,
        },
        {
            id: 'str-reakcja', krok: 6, level: 'srednie',
            title: 'Reakcja łańcuchowa',
            short: 'Usuwaj wzorzec z napisu tak długo, aż zniknie. Uwaga: po usunięciu mogą powstać nowe wystąpienia!',
            tags: ['find', 'erase', 'pętla do skutku'],
            statement: ['W laboratorium napis reaguje z wzorcem: najbardziej z lewej stojące wystąpienie wzorca znika, a części napisu przed nim i za nim się łączą. Po połączeniu może powstać nowe wystąpienie wzorca — wtedy reakcja trwa dalej. Napis przestaje reagować, gdy wzorca już w nim nie ma. Wypisz, co zostanie z napisu, albo PUSTY, jeśli zniknie cały.'],
            input_format: ['Jeden wiersz: napis i wzorzec oddzielone spacją.'],
            output_format: ['Napis po reakcji albo PUSTY.'],
            constraints: ['Napis ma od 1 do 2000 małych liter.', 'Wzorzec ma od 1 do 10 małych liter.'],
            examples: [
                { input: 'aabcbc abc', note: 'aabcbc → usuwamy abc z pozycji 1 → abc → usuwamy znowu → nic nie zostaje.' },
                { input: 'kotkotek kot', note: 'kotkotek → kotek → ek.' },
            ],
            hint: R`Pętla: dopóki s.find(w) != -1, usuń to wystąpienie przez s.erase(p, w.length()). Za każdym razem szukaj od początku napisu — po połączeniu nowe wystąpienie może zacząć się wcześniej niż poprzednie.`,
            tests: (r) => {
                const out = ['aabcbc abc', 'kotkotek kot', 'abc d', 'a a', 'aaaa aa'];
                const buduj = (w, base, ile) => { let s = base; for (let i = 0; i < ile; i++) { const p = r.int(0, s.length); s = s.slice(0, p) + w + s.slice(p); } return s.slice(0, 2000) || 'a'; };
                out.push(`${buduj('abc', '', 600)} abc`, `${buduj('ab', 'ba', 999)} ab`, `${buduj('kot', znaki(r, 50, 'kot'), 300)} kot`,
                    `${buduj('xyzzy', znaki(r, 30, 'xyz'), 300)} xyzzy`, `${znaki(r, 2000, 'ab')} ab`, `${znaki(r, 2000, 'abc')} ${znaki(r, 3, 'abc')}`);
                return out;
            },
            solve: (inp) => { let [s, w] = toks(inp); let p = s.indexOf(w); while (p !== -1) { s = s.slice(0, p) + s.slice(p + w.length); p = s.indexOf(w); } return s || 'PUSTY'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, w;
    cin >> s >> w;
    int p = s.find(w);
    while (p != -1) {
        s.erase(p, w.length());
        p = s.find(w);
    }
    if (s.empty()) {
        cout << "PUSTY\n";
    } else {
        cout << s << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 7 · napisy i liczby
        {
            id: 'str-cyfry-slownie', krok: 7, level: 'latwe',
            title: 'Cyfry słownie',
            short: '305 → trzy zero piec. Tablica-ściąga z nazwami cyfr i c - \'0\' jako indeks.',
            tags: ["c - '0'", 'tablica napisów', 'olbrzym'],
            statement: ['Dyktując numer przez telefon, czytamy go cyfra po cyfrze. Wczytaj liczbę — może mieć nawet sto cyfr — i wypisz nazwy jej kolejnych cyfr oddzielone spacjami. Nazwy cyfr to: zero, jeden, dwa, trzy, cztery, piec, szesc, siedem, osiem, dziewiec.'],
            input_format: ['Jeden wiersz z liczbą (ciągiem cyfr).'],
            output_format: ['Nazwy cyfr oddzielone spacjami.'],
            constraints: ['Liczba ma od 1 do 100 cyfr.'],
            examples: [{ input: '305' }, { input: '600100200' }],
            hint: R`Wpisz nazwy do tablicy string nazwy[10] = {"zero", "jeden", …};. Liczbę wczytaj jako napis (sto cyfr nie zmieści się w long long). Nazwa cyfry c to nazwy[c - '0'].`,
            tests: (r) => ['305', '600100200', '0', '9876543210', znaki(r, 100, CYFRY), znaki(r, 37, CYFRY)],
            solve: (inp) => { const N = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'piec', 'szesc', 'siedem', 'osiem', 'dziewiec']; return [...inp.trim()].map((c) => N[Number(c)]).join(' '); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string nazwy[10] = {"zero", "jeden", "dwa", "trzy", "cztery", "piec", "szesc", "siedem", "osiem", "dziewiec"};
    string s;
    cin >> s;
    for (char c : s) {
        cout << nazwy[c - '0'] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-cyfry-iloczynu', krok: 7, level: 'latwe',
            title: 'Cyfry iloczynu',
            short: 'Pomnóż dwie liczby i powiedz, ile cyfr ma wynik i jaka jest suma jego cyfr — przez to_string.',
            tags: ['to_string', 'long long', 'suma cyfr'],
            statement: ['Dla każdej z n par liczb a i b policz iloczyn a · b. Wypisz, ile cyfr ma ten iloczyn, a po spacji — sumę jego cyfr.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby a i b.'],
            output_format: ['n wierszy: liczba cyfr iloczynu i suma jego cyfr.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3\n12 12\n999999999 999999999\n0 5', note: '12 · 12 = 144: trzy cyfry, suma 9. Drugi iloczyn ma 18 cyfr.' }],
            hint: R`Iloczyn może mieć 18 cyfr, więc licz go w long long: long long x = a * b; (a i b też jako long long!). Potem string s = to_string(x); — liczba cyfr to s.length(), a sumę policzysz pętlą z c - '0'.`,
            tests: (r) => {
                const out = ['3\n12 12\n999999999 999999999\n0 5', '1\n1 1', '1\n1000000000 1000000000'];
                out.push(`100\n${Array.from({ length: 100 }, () => `${r.int(0, 1e9)} ${r.int(0, r.pick([10, 1000, 1e6, 1e9]))}`).join('\n')}`);
                return out;
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) { const s = (BigInt(t[1 + 2 * i]) * BigInt(t[2 + 2 * i])).toString(); out.push(`${s.length} ${[...s].reduce((a, c) => a + Number(c), 0)}`); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long a, b;
        cin >> a >> b;
        string s = to_string(a * b);
        int suma = 0;
        for (char c : s) {
            suma += c - '0';
        }
        cout << s.length() << " " << suma << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-test-podzielnosci', krok: 7, level: 'srednie',
            title: 'Test podzielności olbrzyma',
            short: 'Przez które liczby od 2 do 12 dzieli się liczba z tysiąca cyfr?',
            tags: ['reszta z olbrzyma', '(r * 10 + d) % k', 'pętla po k'],
            statement: ['Wczytaj liczbę, która może mieć nawet 1000 cyfr. Wypisz wszystkie liczby k od 2 do 12, przez które dzieli się bez reszty — w kolejności rosnącej, oddzielone spacjami. Jeśli nie dzieli się przez żadną z nich, wypisz BRAK.'],
            input_format: ['Jeden wiersz z liczbą (bez zer na początku).'],
            output_format: ['Dzielniki od 2 do 12 oddzielone spacjami albo BRAK.'],
            constraints: ['Liczba ma od 1 do 1000 cyfr i jest dodatnia.'],
            examples: [{ input: '360', note: '360 dzieli się przez 2, 3, 4, 5, 6, 8, 9, 10 i 12, ale nie przez 7 ani 11.' }, { input: '1000000000000000000000000000007' }],
            hint: R`Dla każdego k od 2 do 12 policz resztę z dzielenia olbrzyma przez k sposobem z lekcji: r = (r * 10 + (c - '0')) % k dla kolejnych cyfr. Jeśli r == 0 — k dzieli liczbę.`,
            check: (inp) => (/^[1-9]\d*$/.test(inp) ? null : 'zła liczba'),
            tests: (r) => {
                const out = ['360', '1000000000000000000000000000007', '1', '27720', '13', '11'];
                out.push(liczba(r, 1000), liczba(r, 500) + '0', (BigInt(liczba(r, 300)) * 27720n).toString(), (BigInt(liczba(r, 200)) * 77n).toString(), liczba(r, 50));
                return out;
            },
            solve: (inp) => { const x = BigInt(inp); const d = []; for (let k = 2; k <= 12; k++) if (x % BigInt(k) === 0n) d.push(k); return d.length ? d.join(' ') : 'BRAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    bool jakis = false;
    for (int k = 2; k <= 12; k++) {
        int r = 0;
        for (char c : s) {
            r = (r * 10 + (c - '0')) % k;
        }
        if (r == 0) {
            cout << k << " ";
            jakis = true;
        }
    }
    if (!jakis) {
        cout << "BRAK";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'str-przestaw-cyfry', krok: 7, level: 'srednie',
            title: 'Przestaw cyfry',
            short: 'Z tych samych cyfr ułóż największą i najmniejszą liczbę. Uwaga na zera na początku!',
            tags: ['liczniki cyfr', 'ile[c - \'0\']', 'zero na początku'],
            statement: ['Wczytaj liczbę, która może mieć bardzo dużo cyfr. Przestawiając jej cyfry, ułóż największą i najmniejszą możliwą liczbę. Liczba nie może zaczynać się od zera (chyba że jest to samo 0). Wypisz największą w pierwszym wierszu, a najmniejszą — w drugim.'],
            input_format: ['Jeden wiersz z liczbą (bez zer na początku).'],
            output_format: ['Dwa wiersze: największa i najmniejsza liczba z tych samych cyfr.'],
            constraints: ['Liczba ma od 1 do 10 000 cyfr.'],
            examples: [{ input: '30521', note: 'Największa: cyfry malejąco. Najmniejsza: 0 nie może stać na początku, więc najpierw najmniejsza niezerowa cyfra (1), potem reszta rosnąco.' }, { input: '1000' }],
            hint: R`Policz cyfry w tablicy ile[10] (cyfra c trafia do ile[c - '0']). Największa: cyfry od 9 do 0, każda tyle razy, ile wystąpiła. Najmniejsza: najpierw jedna najmniejsza cyfra różna od zera, potem wszystkie pozostałe od 0 do 9. Napisy buduj przez +=.`,
            check: (inp) => (/^([1-9]\d*|0)$/.test(inp) ? null : 'zła liczba'),
            tests: (r) => ['30521', '1000', '0', '7', '10', '9876543210', liczba(r, 100), liczba(r, 10000), '1' + '0'.repeat(9999), znaki(r, 1, '123456789') + znaki(r, 5000, '0011')],
            solve: (inp) => {
                const d = [...inp].sort();
                const max = d.slice().reverse().join('');
                const i = d.findIndex((c) => c !== '0');
                if (i < 0) return `${max}\n${max}`;
                const min = d[i] + d.slice(0, i).join('') + d.slice(i + 1).join('');
                return `${max}\n${min}`;
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int ile[10] = {};
    for (char c : s) {
        ile[c - '0']++;
    }
    string najw = "";
    for (int d = 9; d >= 0; d--) {
        najw += string(ile[d], (char)('0' + d));
    }
    string najm = "";
    for (int d = 1; d <= 9; d++) {
        if (ile[d] > 0) {
            najm += (char)('0' + d);
            ile[d]--;
            break;
        }
    }
    for (int d = 0; d <= 9; d++) {
        najm += string(ile[d], (char)('0' + d));
    }
    cout << najw << "\n" << najm << "\n";
    return 0;
}`,
        },
        {
            id: 'str-z-dwojkowego', krok: 7, level: 'latwe',
            title: 'Z dwójkowego na dziesiętny',
            short: 'Napis z zer i jedynek zamień na liczbę: w = w * 2 + cyfra.',
            tags: ['w * 2 + (c - \'0\')', 'long long', 'system dwójkowy'],
            statement: ['Dla każdego z n napisów złożonych z zer i jedynek, czyli liczb zapisanych w systemie dwójkowym, wypisz ich wartość w zwykłym systemie dziesiątkowym. Napisy mogą zaczynać się od zer.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym napisie z zer i jedynek.'],
            output_format: ['n wierszy z wartościami.'],
            constraints: ['1 ≤ n ≤ 100', 'Napisy mają od 1 do 62 znaków.'],
            examples: [{ input: '4\n101101\n1\n0000\n11111111' }],
            hint: R`Idź po znakach od lewej: w = w * 2 + (c - '0');. Napis może mieć 62 znaki, więc wartość nie zmieści się w int — użyj long long.`,
            tests: (r) => ['4\n101101\n1\n0000\n11111111', `2\n${'1'.repeat(62)}\n1${'0'.repeat(61)}`, `100\n${Array.from({ length: 100 }, () => znaki(r, r.int(1, 62), '01')).join('\n')}`],
            solve: (inp) => toks(inp).slice(1).map((b) => BigInt('0b' + b).toString()).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string b;
        cin >> b;
        long long w = 0;
        for (char c : b) {
            w = w * 2 + (c - '0');
        }
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-na-dwojkowy', krok: 7, level: 'latwe',
            title: 'Na dwójkowy',
            short: 'Zapisz liczbę w systemie dwójkowym: reszty z dzielenia przez 2, doklejane z przodu.',
            tags: ['n % 2', 'doklejanie z przodu', 'zero osobno'],
            statement: ['Dla każdej z n liczb wypisz jej zapis w systemie dwójkowym, bez zer na początku. Zero zapisujemy jako 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednej liczbie.'],
            output_format: ['n wierszy z zapisami dwójkowymi.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '4\n45\n0\n1\n1024' }],
            hint: R`Dopóki n > 0: dopisz z przodu cyfrę n % 2 — b = (char)('0' + n % 2) + b; — i podziel n przez 2. Dla zera pętla nie wykona się ani razu, więc obsłuż je osobno.`,
            tests: (r) => ['4\n45\n0\n1\n1024', '2\n1000000000000000000\n999999999999999999', `100\n${Array.from({ length: 100 }, () => String(r.big(0, r.pick([10n, 1000n, 10n ** 9n, 10n ** 18n])))).join('\n')}`],
            solve: (inp) => toks(inp).slice(1).map((x) => BigInt(x).toString(2)).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        string b = "";
        if (n == 0) {
            b = "0";
        }
        while (n > 0) {
            b = (char)('0' + n % 2) + b;
            n /= 2;
        }
        cout << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-najwieksza-w-tekscie', krok: 7, level: 'srednie',
            title: 'Największa liczba w tekście',
            short: 'W tekście ukryte są liczby, niektóre po 50 cyfr. Znajdź największą — porównując napisy.',
            tags: ['budowanie liczby', 'olbrzymy', 'najpierw długość'],
            statement: ['Wczytaj wiersz tekstu, w którym między literami, spacjami i znakami przestankowymi stoją liczby. Liczba to ciąg cyfr stojących obok siebie, otoczony znakami, które nie są cyframi (albo początkiem lub końcem tekstu). Liczby mogą mieć nawet 50 cyfr i nie zaczynają się od zera, chyba że to samo 0. Wypisz największą liczbę z tekstu albo BRAK, jeśli w tekście nie ma cyfr.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['Największa liczba albo BRAK.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'W 2026 roku sprzedano 99 rowerow i 100 hulajnog.' }, { input: 'brak liczb!' }],
            hint: R`Buduj bieżącą liczbę jako napis: cyfrę doklejasz (biezaca += c), a na znaku, który nie jest cyfrą, porównujesz bieżącą z rekordem i zerujesz ją (biezaca = ""). Nie zapomnij o liczbie na samym końcu tekstu. Porównanie olbrzymów: najpierw długość, przy równej długości — zwykłe <.`,
            check: (inp) => ((inp.match(/\d+/g) || []).every((x) => x === '0' || x[0] !== '0') && inp.length <= 1000 ? null : 'zero na początku liczby'),
            tests: (r) => {
                const tekst = (k, maxd) => {
                    let s = '';
                    for (let i = 0; i < k; i++) {
                        s += r() < 0.4 ? liczba(r, r.int(1, maxd)) : slowo(r);
                        s += r.pick([' ', ' ', ', ', '.', '-', 'x', ' i ']);
                    }
                    return s.slice(0, 1000).replace(/\d+$/, (m) => (m.length > 1 && m[0] === '0' ? '7' : m)).trim();
                };
                return ['W 2026 roku sprzedano 99 rowerow i 100 hulajnog.', 'brak liczb!', '0', 'a0b0c', '12345', tekst(20, 5), tekst(100, 50), tekst(100, 20), tekst(300, 3), `${liczba(r, 50)} i ${liczba(r, 50)} oraz ${liczba(r, 49)}`];
            },
            solve: (inp) => { const m = inp.match(/\d+/g); if (!m) return 'BRAK'; let b = m[0]; for (const x of m) if (porLiczb(x, b) > 0) b = x; return b; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, biezaca = "", najw = "";
    getline(cin, s);
    s += ' ';                       // wartownik: każda liczba kończy się nie-cyfrą
    for (char c : s) {
        if (isdigit(c)) {
            biezaca += c;
        } else if (!biezaca.empty()) {
            bool wieksza;
            if (biezaca.length() != najw.length()) wieksza = biezaca.length() > najw.length();
            else wieksza = biezaca > najw;
            if (najw.empty() || wieksza) najw = biezaca;
            biezaca = "";
        }
    }
    if (najw.empty()) {
        cout << "BRAK\n";
    } else {
        cout << najw << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-olbrzym-razy-cyfra', krok: 7, level: 'srednie',
            title: 'Olbrzym razy cyfra',
            short: 'Pomnóż liczbę z tysiąca cyfr przez jedną cyfrę — pisemnie, od końca, z przeniesieniem.',
            tags: ['mnożenie pisemne', 'przeniesienie', 'od końca'],
            statement: ['Wczytaj liczbę, która może mieć nawet 1000 cyfr, i cyfrę d. Wypisz iloczyn tej liczby i d — bez zer na początku.'],
            input_format: ['Jeden wiersz: liczba (bez zer na początku) i cyfra d, oddzielone spacją.'],
            output_format: ['Iloczyn.'],
            constraints: ['Liczba ma od 1 do 1000 cyfr.', '0 ≤ d ≤ 9'],
            examples: [{ input: '999 9' }, { input: '123456789012345678901234567890 7' }, { input: '5000 0' }],
            hint: R`Idź od ostatniej cyfry: iloczyn = (s[i] - '0') * d + przeniesienie; do wyniku idzie iloczyn % 10, dalej — iloczyn / 10. Po pętli dopisz przeniesienie, jeśli zostało. Mnożenie przez 0 daje 0 — obsłuż je osobno, inaczej wyjdzie 0000.`,
            check: (inp) => { const [s] = toks(inp); return /^([1-9]\d*|0)$/.test(s) ? null : 'zła liczba'; },
            tests: (r) => ['999 9', '123456789012345678901234567890 7', '5000 0', '0 7', '1 1', `${'9'.repeat(1000)} 9`, `${liczba(r, 1000)} ${r.int(2, 9)}`, `${liczba(r, 500)} 1`, `${liczba(r, 77)} 5`],
            solve: (inp) => { const [s, d] = toks(inp); return (BigInt(s) * BigInt(d)).toString(); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int d;
    cin >> s >> d;
    if (d == 0 || s == "0") {
        cout << 0 << "\n";
        return 0;
    }
    string wynik = "";
    int przeniesienie = 0;
    for (int i = s.length() - 1; i >= 0; i--) {
        int iloczyn = (s[i] - '0') * d + przeniesienie;
        wynik += (char)('0' + iloczyn % 10);
        przeniesienie = iloczyn / 10;
    }
    if (przeniesienie > 0) {
        wynik += (char)('0' + przeniesienie);
    }
    int n = wynik.length();
    for (int i = 0; i < n / 2; i++) {
        swap(wynik[i], wynik[n - 1 - i]);
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'str-dodawanie-dwojkowe', krok: 7, level: 'srednie',
            title: 'Dodawanie dwójkowe',
            short: 'Dodaj dwie liczby zapisane w systemie dwójkowym — tysiąc cyfr, pisemnie.',
            tags: ['dodawanie pisemne', '% 2 i / 2', 'dwa indeksy od końca'],
            statement: ['Wczytaj dwie liczby zapisane w systemie dwójkowym — mogą mieć nawet po 1000 cyfr. Wypisz ich sumę, też w systemie dwójkowym, bez zer na początku.'],
            input_format: ['Jeden wiersz: dwie liczby dwójkowe oddzielone spacją (bez zer na początku, chyba że to samo 0).'],
            output_format: ['Suma w systemie dwójkowym.'],
            constraints: ['Każda liczba ma od 1 do 1000 cyfr.'],
            examples: [{ input: '1011 110', note: '11 + 6 = 17, czyli 10001.' }, { input: '0 0' }],
            hint: R`To dodawanie pisemne z lekcji, tylko w systemie dwójkowym: do wyniku idzie suma % 2, a przeniesienie to suma / 2. Dwa indeksy od końca i warunek pętli: i >= 0 || j >= 0 || przeniesienie > 0.`,
            check: (inp) => (toks(inp).every((x) => /^(1[01]*|0)$/.test(x)) ? null : 'zła liczba'),
            tests: (r) => {
                const b = (n) => (n === 1 ? r.pick('01') : '1' + znaki(r, n - 1, '01'));
                return ['1011 110', '0 0', '1 1', '0 1', `${'1'.repeat(1000)} 1`, `${b(1000)} ${b(1000)}`, `${b(1000)} ${b(10)}`, `${b(3)} ${b(700)}`];
            },
            solve: (inp) => { const [a, b] = toks(inp); return (BigInt('0b' + a) + BigInt('0b' + b)).toString(2); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    string wynik = "";
    int i = a.length() - 1, j = b.length() - 1;
    int przeniesienie = 0;
    while (i >= 0 || j >= 0 || przeniesienie > 0) {
        int suma = przeniesienie;
        if (i >= 0) {
            suma += a[i] - '0';
            i--;
        }
        if (j >= 0) {
            suma += b[j] - '0';
            j--;
        }
        wynik = (char)('0' + suma % 2) + wynik;
        przeniesienie = suma / 2;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · olimpiada
        {
            id: 'str-pangram', krok: 8, level: 'latwe',
            title: 'Pangram',
            short: 'Czy zdanie zawiera wszystkie 26 liter alfabetu? Jeśli nie — których brakuje?',
            tags: ['bool bylo[26]', 'tolower', "c - 'a'"],
            statement: ['Pangram to zdanie, w którym występuje każda z 26 liter alfabetu łacińskiego (od a do z) — na przykład „The quick brown fox jumps over the lazy dog”. Wielkość liter nie ma znaczenia. Wczytaj zdanie i wypisz TAK, jeśli jest pangramem. W przeciwnym razie wypisz NIE, a w drugim wierszu wszystkie brakujące litery — małe, w kolejności alfabetycznej, bez spacji.'],
            input_format: ['Jeden wiersz tekstu.'],
            output_format: ['TAK albo NIE i wiersz z brakującymi literami.'],
            constraints: ['Wiersz ma od 1 do 1000 znaków.'],
            examples: [{ input: 'The quick brown fox jumps over the lazy dog' }, { input: 'Ala ma kota' }],
            hint: R`Tablica bool bylo[26] = {}; i dla każdej litery: bylo[tolower(c) - 'a'] = true;. Potem pętla po k od 0 do 25: jeśli !bylo[k], to litera (char)('a' + k) brakuje.`,
            tests: (r) => ['The quick brown fox jumps over the lazy dog', 'Ala ma kota', '123', 'abcdefghijklmnopqrstuvwxyz', 'Pchnac w te lodz jeza lub osm skrzyn fig',
                mix(r, znaki(r, 1000, LITERY + ' .,'), 0.3), mix(r, znaki(r, 60, LITERY.slice(0, 25) + ' '), 0.5), zdanie(r, 30, 60)],
            solve: (inp) => { const b = new Set([...inp.toLowerCase()].filter(isLow)); const brak = [...LITERY].filter((c) => !b.has(c)).join(''); return brak ? `NIE\n${brak}` : 'TAK'; },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    bool bylo[26] = {};
    for (char c : s) {
        if (isalpha(c)) {
            bylo[tolower(c) - 'a'] = true;
        }
    }
    string brak = "";
    for (int k = 0; k < 26; k++) {
        if (!bylo[k]) {
            brak += (char)('a' + k);
        }
    }
    if (brak.empty()) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n" << brak << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-vigenere', krok: 8, level: 'srednie',
            title: 'Szyfr Vigenère’a',
            short: 'Każda litera przesuwa się o inną wartość, wyznaczoną przez kolejną literę klucza.',
            tags: ['modulo', 'klucz w kółko', 'j % m'],
            statement: ['Szyfr Vigenère’a to ulepszony szyfr Cezara: każda litera tekstu przesuwa się w alfabecie o inną wartość. Przesunięcia wyznacza słowo-klucz: litera a oznacza przesunięcie o 0, b — o 1, …, z — o 25. Pierwsza litera tekstu przesuwa się zgodnie z pierwszą literą klucza, druga — z drugą i tak dalej; gdy klucz się skończy, zaczynamy go od początku. Znaki, które nie są literami, przepisujemy bez zmian i nie zużywają one liter klucza. Wielkie litery pozostają wielkie, a małe — małe. Zaszyfruj tekst.'],
            input_format: ['W pierwszym wierszu klucz (małe litery).', 'W drugim wierszu tekst do zaszyfrowania.'],
            output_format: ['Zaszyfrowany tekst.'],
            constraints: ['Klucz ma od 1 do 20 liter.', 'Tekst ma od 1 do 1000 znaków.'],
            examples: [{ input: 'lemon\nATTACK AT DAWN', note: 'A + l (11) = L, T + e (4) = X, T + m (12) = F… Spacje przepisujemy i nie przesuwają one klucza.' }, { input: 'b\nAla ma kota!' }],
            hint: R`Trzymaj licznik j — ile liter już zaszyfrowano. Dla litery przesunięcie to k = klucz[j % m] - 'a', gdzie m to długość klucza; potem j++. Sama zamiana: c = 'a' + (c - 'a' + k) % 26 (dla wielkich z 'A').`,
            tests: (r) => ['lemon\nATTACK AT DAWN', 'b\nAla ma kota!', 'a\nbez zmian', 'z\nabc XYZ', `${word(r, 1, 20)}\n${mix(r, zdanie(r, 20, 40), 0.3)}`, `${word(r, 5, 10)}\n${mix(r, znaki(r, 1000, LITERY + ' .,!?0123'), 0.4)}`],
            solve: (inp) => { const [k, t] = lines(inp); let j = 0; return [...t].map((c) => { if (!isLow(c) && !isUp(c)) return c; const sh = k.charCodeAt(j++ % k.length) - 97; const base = isLow(c) ? 97 : 65; return String.fromCharCode(base + (c.charCodeAt(0) - base + sh) % 26); }).join(''); },
            cpp: R`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string klucz, s;
    getline(cin, klucz);
    getline(cin, s);
    int m = klucz.length();
    int j = 0;
    for (char &c : s) {
        if (!isalpha(c)) continue;
        int k = klucz[j % m] - 'a';
        j++;
        if (islower(c)) {
            c = 'a' + (c - 'a' + k) % 26;
        } else {
            c = 'A' + (c - 'A' + k) % 26;
        }
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'str-palindrom-z-liter', krok: 8, level: 'latwe',
            title: 'Palindrom z rozsypanych liter',
            short: 'Czy z liter słowa da się ułożyć palindrom? Policz, ile liter występuje nieparzyście wiele razy.',
            tags: ['int ile[26]', 'nieparzyste liczniki', 'TAK / NIE'],
            statement: ['Litery słowa wysypały się z pudełka. Czy da się je ułożyć w palindrom — słowo czytane tak samo od przodu i od tyłu — używając wszystkich liter? Na przykład z „kajak” i „akajk” się da (kajak), a z „kot” nie. Dla każdego z n słów wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po jednym słowie z małych liter.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', 'Słowa mają od 1 do 1000 liter.'],
            examples: [{ input: '4\nakajk\nkot\naabb\nabcabcx' }],
            hint: R`W palindromie litery stoją parami: pierwsza z ostatnią, druga z przedostatnią. Tylko jedna litera — środkowa — może nie mieć pary. Policz litery w tablicy ile[26] i sprawdź, ile z nich występuje nieparzyście wiele razy: 0 albo 1 — TAK, więcej — NIE.`,
            tests: (r) => {
                const pal = (n) => { const h = r.word(n); return r.shuffle([...h + (r() < 0.5 ? r.word(1) : '') + h]).join(''); };
                const lista = (k) => Array.from({ length: k }, () => (r() < 0.5 ? pal(r.int(1, 500)) : word(r, 1, 30)));
                return ['4\nakajk\nkot\naabb\nabcabcx', '2\na\nab', `20\n${lista(20).join('\n')}`, `100\n${Array.from({ length: 100 }, () => (r() < 0.5 ? pal(r.int(1, 10)) : znaki(r, r.int(1, 12), 'abc'))).join('\n')}`];
            },
            solve: (inp) => toks(inp).slice(1).map((w) => { const c = {}; for (const x of w) c[x] = (c[x] || 0) + 1; return Object.values(c).filter((v) => v % 2).length <= 1 ? 'TAK' : 'NIE'; }).join('\n'),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        int ile[26] = {};
        for (char c : s) {
            ile[c - 'a']++;
        }
        int nieparzyste = 0;
        for (int k = 0; k < 26; k++) {
            if (ile[k] % 2 == 1) nieparzyste++;
        }
        cout << (nieparzyste <= 1 ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-okna-bez-powtorzen', krok: 8, level: 'srednie',
            title: 'Okna bez powtórzeń',
            short: 'Ile fragmentów długości k ma same różne litery? Przesuwaj okno i licz różne litery na bieżąco.',
            tags: ['okno', 'int ile[26]', 'liczba różnych'],
            statement: ['Wczytaj słowo i liczbę k. Policz, ile jest fragmentów słowa o długości dokładnie k, w których żadna litera się nie powtarza. Fragment to kawałek słowa złożony z liter stojących obok siebie; fragmenty zaczynające się w różnych miejscach liczymy osobno, nawet jeśli wyglądają tak samo.'],
            input_format: ['Jeden wiersz: słowo i liczba k.'],
            output_format: ['Liczba fragmentów bez powtórzeń.'],
            constraints: ['Słowo ma od 1 do 50 000 małych liter.', '1 ≤ k ≤ długość słowa'],
            examples: [{ input: 'abcabcbb 3', note: 'Fragmenty długości 3: abc, bca, cab, abc, bcb, cbb. Bez powtórzeń są cztery pierwsze.' }, { input: 'aaaa 2' }],
            hint: R`Przesuwaj okno jak w lekcji, ale zamiast jednej liczby trzymaj liczniki liter w oknie (int ile[26]) i zmienną roznych — ile liter ma licznik większy od zera. Gdy licznik litery rośnie z 0 do 1, roznych++; gdy spada z 1 do 0, roznych--. Okno jest dobre, gdy roznych == k.`,
            check: (inp) => { const [s, k] = toks(inp); return Number(k) >= 1 && Number(k) <= s.length && s.length <= 50000 ? null : 'złe k'; },
            tests: (r) => ['abcabcbb 3', 'aaaa 2', 'a 1', 'abc 3', 'abcdefghijklmnopqrstuvwxyz 26', `${znaki(r, 50000, LITERY)} 5`, `${znaki(r, 50000, LITERY)} 26`, `${znaki(r, 50000, 'abcdef')} 4`, `${znaki(r, 1000, LITERY)} 1`, `${znaki(r, 30000, LITERY)} 30`],
            solve: (inp) => { const [s, ks] = toks(inp); const k = Number(ks); const ile = new Array(26).fill(0); let roz = 0, w = 0; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i) - 97; if (ile[c]++ === 0) roz++; if (i >= k) { const d = s.charCodeAt(i - k) - 97; if (--ile[d] === 0) roz--; } if (i >= k - 1 && roz === k) w++; } return String(w); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    int n = s.length();
    int ile[26] = {};
    int roznych = 0, dobre = 0;
    for (int i = 0; i < n; i++) {
        if (ile[s[i] - 'a'] == 0) roznych++;
        ile[s[i] - 'a']++;
        if (i >= k) {
            ile[s[i - k] - 'a']--;
            if (ile[s[i - k] - 'a'] == 0) roznych--;
        }
        if (i >= k - 1 && roznych == k) dobre++;
    }
    cout << dobre << "\n";
    return 0;
}`,
        },
        {
            id: 'str-litery-we-fragmencie', krok: 8, level: 'srednie',
            title: 'Litery we fragmencie',
            short: 'Tysiące pytań „ile liter c jest między l a r?” — sumy prefiksowe dla każdej litery.',
            tags: ['sumy prefiksowe', 'p[26][…]', 'p[r] - p[l - 1]'],
            statement: ['Wczytaj słowo, a potem q pytań. Każde pytanie składa się z dwóch liczb l i r oraz litery c i brzmi: ile razy litera c występuje wśród liter słowa od l-tej do r-tej (licząc od 1, włącznie)? Odpowiedz na wszystkie pytania.'],
            input_format: ['W pierwszym wierszu słowo.', 'W drugim wierszu liczba q.', 'W kolejnych q wierszach pytania: l, r i litera c.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['Słowo ma od 1 do 30 000 małych liter.', '1 ≤ q ≤ 2000', '1 ≤ l ≤ r ≤ długość słowa'],
            examples: [{ input: 'abracadabra\n3\n1 11 a\n2 5 r\n4 8 b' }],
            hint: R`Zrób sumy prefiksowe dla każdej litery osobno: p[c][i] to liczba liter c wśród pierwszych i liter słowa. Tablica int p[26][30005] jest duża — zadeklaruj ją globalnie, przed main. Odpowiedź to p[c - 'a'][r] - p[c - 'a'][l - 1].`,
            check: (inp) => { const t = toks(inp); const n = t[0].length; const q = Number(t[1]); for (let i = 0; i < q; i++) { const l = Number(t[2 + 3 * i]), r2 = Number(t[3 + 3 * i]); if (!(l >= 1 && l <= r2 && r2 <= n)) return 'zły przedział'; } return null; },
            tests: (r) => {
                const out = ['abracadabra\n3\n1 11 a\n2 5 r\n4 8 b'];
                const gen = (n, q, alf) => {
                    const s = znaki(r, n, alf);
                    const pyt = Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(1, n); return `${Math.min(a, b)} ${Math.max(a, b)} ${r.pick(alf)}`; });
                    return `${s}\n${q}\n${pyt.join('\n')}`;
                };
                out.push(gen(1, 1, 'a'), gen(50, 20, 'ab'), gen(30000, 2000, LITERY), gen(30000, 2000, 'abc'), gen(5000, 1000, 'xyz'));
                return out;
            },
            solve: (inp) => {
                const t = toks(inp); const s = t[0], n = s.length, q = Number(t[1]);
                const p = Array.from({ length: 26 }, () => new Int32Array(n + 1));
                for (let i = 1; i <= n; i++) { const c = s.charCodeAt(i - 1) - 97; for (let k = 0; k < 26; k++) p[k][i] = p[k][i - 1] + (k === c ? 1 : 0); }
                const out = [];
                for (let i = 0; i < q; i++) { const l = Number(t[2 + 3 * i]), r2 = Number(t[3 + 3 * i]), c = t[4 + 3 * i].charCodeAt(0) - 97; out.push(p[c][r2] - p[c][l - 1]); }
                return out.join('\n');
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int p[26][30005];
int main() {
    string s;
    cin >> s;
    int n = s.length();
    for (int c = 0; c < 26; c++) {
        p[c][0] = 0;
        for (int i = 1; i <= n; i++) {
            p[c][i] = p[c][i - 1] + (s[i - 1] - 'a' == c);
        }
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int l, r;
        char c;
        cin >> l >> r >> c;
        cout << p[c - 'a'][r] - p[c - 'a'][l - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-slownik-frekwencyjny', krok: 8, level: 'srednie',
            title: 'Słownik frekwencyjny',
            short: 'Wypisz każde słowo tekstu jeden raz — z liczbą jego wystąpień, w kolejności pierwszego pojawienia się.',
            tags: ['tablica napisów', 'czy już było', 'pętla w pętli'],
            statement: ['Językoznawcy badają teksty, licząc, ile razy występuje w nich każde słowo. Wczytaj n słów i wypisz każde różne słowo dokładnie raz, a po spacji — ile razy wystąpiło w całym tekście. Słowa wypisuj w kolejności, w jakiej pojawiły się w tekście po raz pierwszy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter.'],
            output_format: ['Dla każdego różnego słowa wiersz: słowo i liczba jego wystąpień.'],
            constraints: ['1 ≤ n ≤ 1000', 'Słowa mają od 1 do 15 liter.'],
            examples: [{ input: '8\nkot pies kot mysz pies kot ala ala' }],
            hint: R`Wczytaj słowa do tablicy. Dla każdego i sprawdź najpierw, czy to samo słowo stało już wcześniej (jakieś j < i z t[j] == t[i]). Jeśli tak — pomiń je, już zostało wypisane. Jeśli nie — policz jego wystąpienia w całej tablicy i wypisz.`,
            tests: (r) => {
                const lista = (n, pula) => Array.from({ length: n }, () => r.pick(pula));
                const pula = Array.from({ length: 300 }, () => word(r, 1, 15));
                return ['8\nkot pies kot mysz pies kot ala ala', '1\nx', '3\na a a', `20\n${lista(20, SLOWA).join(' ')}`, `1000\n${lista(1000, SLOWA).join(' ')}`, `1000\n${lista(1000, pula).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => word(r, 10, 15)).join(' ')}`];
            },
            solve: (inp) => { const t = toks(inp).slice(1); const m = new Map(); for (const w of t) m.set(w, (m.get(w) || 0) + 1); return [...m].map(([w, k]) => `${w} ${k}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n; i++) {
        bool bylo = false;
        for (int j = 0; j < i; j++) {
            if (t[j] == t[i]) {
                bylo = true;
                break;
            }
        }
        if (bylo) continue;
        int ile = 0;
        for (int j = i; j < n; j++) {
            if (t[j] == t[i]) ile++;
        }
        cout << t[i] << " " << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-zepsuta-klawiatura', krok: 8, level: 'latwe',
            title: 'Zepsuta klawiatura',
            short: 'Znak < to Backspace: kasuje ostatnią literę. Co naprawdę zostało napisane?',
            tags: ['push_back', 'pop_back', 'empty()'],
            statement: ['W edytorze tekstu klawisz Backspace zapisuje się w historii jako znak <. Każdy < kasuje ostatni znak dotychczas napisanego tekstu — a jeśli tekst jest pusty, nic nie robi. Na podstawie historii naciśnięć klawiszy odtwórz tekst, który ostatecznie został napisany. Jeśli nic nie zostało, wypisz PUSTO.'],
            input_format: ['Jeden wiersz: historia naciśnięć — litery, cyfry i znaki <.'],
            output_format: ['Ostatecznie napisany tekst albo PUSTO.'],
            constraints: ['Historia ma od 1 do 20 000 znaków.'],
            examples: [{ input: 'kotr<ek', note: 'Napisane: k, o, t, r, potem < kasuje r, dalej e i k: kotek.' }, { input: 'a<<<b', note: 'Dwa ostatnie < trafiają w pusty tekst i nic nie robią.' }, { input: 'abc<<<' }],
            hint: R`Buduj wynik od pustego napisu. Zwykły znak — w.push_back(c). Znak < — w.pop_back(), ale tylko gdy !w.empty(): pop_back na pustym napisie to błąd!`,
            tests: (r) => ['kotr<ek', 'a<<<b', 'abc<<<', '<', 'x', znaki(r, 20000, LITERY + CYFRY + '<<<'), znaki(r, 20000, 'ab<'), znaki(r, 1000, 'a<<'), znaki(r, 20000, LITERY + '<')],
            solve: (inp) => { const w = []; for (const c of inp) { if (c === '<') w.pop(); else w.push(c); } return w.join('') || 'PUSTO'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, w = "";
    cin >> s;
    for (char c : s) {
        if (c == '<') {
            if (!w.empty()) {
                w.pop_back();
            }
        } else {
            w.push_back(c);
        }
    }
    if (w.empty()) {
        cout << "PUSTO\n";
    } else {
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'str-litery-bez-pary', krok: 8, level: 'latwe',
            title: 'Litery bez pary',
            short: 'Które litery występują w słowie dokładnie raz? Wypisz je alfabetycznie.',
            tags: ['int ile[26]', 'ile[k] == 1', "(char)('a' + k)"],
            statement: ['Wczytaj słowo i wypisz, w kolejności alfabetycznej i bez spacji, wszystkie litery, które występują w nim dokładnie raz. Jeśli takich liter nie ma, wypisz BRAK.'],
            input_format: ['Jeden wiersz ze słowem z małych liter.'],
            output_format: ['Litery występujące dokładnie raz albo BRAK.'],
            constraints: ['Słowo ma od 1 do 50 000 liter.'],
            examples: [{ input: 'programowanie', note: 'a, o i r występują po dwa razy. Pozostałe litery — po razie.' }, { input: 'aabb' }],
            hint: R`Policz litery w tablicy ile[26]. Potem pętla po k od 0 do 25: jeśli ile[k] == 1, dopisz (char)('a' + k) do wyniku. Pętla po literach alfabetu sama daje kolejność alfabetyczną.`,
            tests: (r) => ['programowanie', 'aabb', 'z', 'abcdefghijklmnopqrstuvwxyz', znaki(r, 30, LITERY), znaki(r, 50000, LITERY), znaki(r, 50000, LITERY) + 'zz', `${znaki(r, 20, 'abc')}${'xyz'}`],
            solve: (inp) => { const c = {}; for (const x of inp) c[x] = (c[x] || 0) + 1; const w = [...LITERY].filter((x) => c[x] === 1).join(''); return w || 'BRAK'; },
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
        if (ile[k] == 1) {
            w += (char)('a' + k);
        }
    }
    cout << (w.empty() ? "BRAK" : w) << "\n";
    return 0;
}`,
        },
    ];
};
