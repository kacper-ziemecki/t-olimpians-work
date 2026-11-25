// Kopiec — ćwiczenia w trakcie lekcji, części 4–6: symulacje „weź największy, zmień, odłóż” (kamienie, połowienie,
// prezenty, kilka testów i czyszczenie kopca, gra w kupki, kopiec maksimum i minimum naraz, dużo poleceń z generatora),
// kopiec par i struktur (remisy, minus w jednym polu, kopiec minimum par, struktura z operatorem <) oraz kopiec
// ograniczony do k elementów, scalanie posortowanych list i mediana na dwóch kopcach.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kopiec-pomoc');
    const { calk, IMIONA, SLOWA, PQ, mniej, wiecej, mniejKrotka, wiecejKrotka, generuj, dobryGen, KOD_GEN, unikalneImiona } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const d1 = (a) => `${a.length}\n${a.join(' ')}`;
    const dk = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
    const malejaco = (a) => a.slice().sort((x, y) => y - x);
    const czyMale = (s, max = 15) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const czyImie = (s, max = 15) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const cmpStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

    return [
        // ================================================================ KROK 4 · symulacje
        {
            id: 'kop-kamienie', krok: 4, level: 'latwe',
            title: 'Ostatni kamień',
            short: 'Dwa najcięższe kamienie zderzają się: równe znikają, a z nierównych zostaje różnica, która wraca do kopca.',
            tags: ['dwa największe', 'wynik wraca do kopca', 'pętla do size() > 1'],
            statement: ['Na stole leży n kamieni o podanych wagach. W każdej turze bierzesz dwa najcięższe kamienie, x i y (x ≥ y), i zderzasz je. Jeśli ważą tyle samo, oba się rozpadają. Jeśli nie, kamień y się rozpada, a z kamienia x zostaje kamień o wadze x − y, który wraca na stół.',
                'Tury trwają, dopóki na stole są co najmniej dwa kamienie. Wypisz wagę kamienia, który został na końcu, albo 0, jeśli nie został żaden.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — wagi kamieni.'],
            output_format: ['Jedna liczba — waga ostatniego kamienia albo 0.'],
            constraints: ['1 ≤ n ≤ 10⁴', 'Wagi są liczbami całkowitymi od 1 do 10⁶.'],
            examples: [{ input: '6\n2 7 4 1 8 1', note: '8 i 7 dają 1, potem 4 i 2 dają 2, potem 2 i 1 dają 1, potem 1 i 1 znikają. Zostaje jeden kamień o wadze 1.' }],
            hint: R`while (pq.size() > 1) { int x = pq.top(); pq.pop(); int y = pq.top(); pq.pop(); if (x != y) pq.push(x - y); }. Na końcu: pq.empty() ? 0 : pq.top().`,
            tests: (r) => [d1([5]), d1([3, 3]), d1([10, 4]), d1([1, 1, 1]), d1(r.arr(15, 1, 20)), d1(r.arr(10000, 1, 1000000)), d1(r.arr(10000, 1, 2)), d1(r.arr(9999, 1000000, 1000000))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1e4) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const pq = new PQ(mniej, nums(inp).slice(1));
                while (pq.size > 1) { const x = pq.pop(), y = pq.pop(); if (x !== y) pq.push(x - y); }
                return String(pq.empty() ? 0 : pq.top());
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<int> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    while (pq.size() > 1) {
        int x = pq.top();
        pq.pop();
        int y = pq.top();
        pq.pop();
        if (x != y) pq.push(x - y);
    }
    if (pq.empty()) cout << 0 << "\n";
    else cout << pq.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-polowienie', krok: 4, level: 'latwe',
            title: 'Połowienie kupek',
            short: 'k razy zabierz połowę z największej kupki. Wierzch, pop, zmiana, push — a przy milionie ruchów szukanie największej pętlą nie zdąży.',
            tags: ['top → pop → push', 'milion ruchów', 'long long'],
            statement: ['Masz n kupek kamieni. W jednym ruchu wybierasz kupkę, na której jest najwięcej kamieni — powiedzmy x — i zabierasz z niej x/2 kamieni (dzielenie całkowite), więc na kupce zostaje x − x/2. Wykonaj dokładnie k ruchów i wypisz, ile kamieni zostało na wszystkich kupkach razem.',
                'Ruchów może być milion, więc szukanie największej kupki pętlą po wszystkich kupkach przy każdym ruchu jest za wolne. Trzymaj kupki w kopcu: weź wierzch, zdejmij go i wrzuć z powrotem zmniejszoną kupkę.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — liczby kamieni na kupkach.'],
            output_format: ['Jedna liczba — łączna liczba kamieni po k ruchach.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ k ≤ 10⁶', 'Na każdej kupce jest od 1 do 10⁹ kamieni.'],
            examples: [{ input: '3 2\n5 4 9', note: 'Z dziewiątki zabieramy 4 (zostaje 5). Teraz największe są dwie piątki — z jednej zabieramy 2 i zostaje 3. Razem 5 + 4 + 3 = 12.' }],
            hint: R`for (int i = 0; i < k; i++) { int x = pq.top(); pq.pop(); pq.push(x - x / 2); }. Na koniec zsumuj kopiec, opróżniając go — suma n kupek po miliard to long long. Kupka z jednym kamieniem już się nie zmniejsza (1 − 1/2 = 1), ale ruch i tak się liczy.`,
            tests: (r) => [dk([1], 1), dk([1], 1000000), dk([10, 10], 3), dk(r.arr(10, 1, 100), 7), dk(r.arr(5000, 1, 1000000000), 1000000), dk(r.arr(5000, 900000000, 1000000000), 10000), dk(r.arr(5000, 1, 1000000000), 1), dk(r.arr(5000, 1, 1000000000), 120000), dk(r.arr(100, 1, 1000000000), 1000000)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, 1e6) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1];
                const pq = new PQ(mniej, t.slice(2));
                for (let i = 0; i < k; i++) { const x = pq.pop(); pq.push(x - Math.floor(x / 2)); if (pq.top() === 1) break; }
                return String(pq.h.reduce((a, b) => a + b, 0));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    for (int i = 0; i < k; i++) {
        int x = pq.top();
        pq.pop();
        pq.push(x - x / 2);
    }
    long long suma = 0;
    while (!pq.empty()) {
        suma += pq.top();
        pq.pop();
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-prezenty', krok: 4, level: 'latwe',
            title: 'Prezenty pod choinką',
            short: 'Co sekundę z największego stosu prezentów zostaje tylko pierwiastek. Ile prezentów leży pod choinką po k sekundach?',
            tags: ['top → pop → push', 'sqrt', 'long long'],
            statement: ['Pod choinką leży n stosów prezentów. Co sekundę elf wybiera stos, na którym jest najwięcej prezentów — powiedzmy x — i zabiera z niego tyle, że zostaje dokładnie ⌊√x⌋ prezentów (pierwiastek zaokrąglony w dół).',
                'Wypisz, ile prezentów leży pod choinką po k sekundach.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — liczby prezentów na stosach.'],
            output_format: ['Jedna liczba — łączna liczba prezentów po k sekundach.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ k ≤ 10⁵', 'Na każdym stosie jest od 1 do 10⁹ prezentów.'],
            examples: [{ input: '5 4\n25 64 9 4 100', note: '100 → 10, potem 64 → 8, potem 25 → 5, potem 10 → 3. Zostaje 3 + 8 + 5 + 9 + 4 = 29.' }],
            hint: R`int x = pq.top(); pq.pop(); pq.push((int)sqrt(x));. Dla liczb do 10⁹ funkcja sqrt z <cmath> liczy dokładnie, a rzutowanie na int obcina w dół. Wynik końcowy w long long.`,
            tests: (r) => [dk([1], 5), dk([2], 1), dk([1000000000], 3), dk([16, 16, 16], 2), dk(r.arr(10, 1, 1000), 5), dk(r.arr(5000, 1, 1000000000), 100000), dk(r.arr(5000, 1, 1000000000), 3000), dk(r.arr(2000, 999000000, 1000000000), 1999)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, 1e5) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1];
                const pq = new PQ(mniej, t.slice(2));
                for (let i = 0; i < k; i++) { const x = pq.pop(); pq.push(Math.floor(Math.sqrt(x))); if (pq.top() === 1) break; }
                return String(pq.h.reduce((a, b) => a + b, 0));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    for (int i = 0; i < k; i++) {
        int x = pq.top();
        pq.pop();
        pq.push((int)sqrt(x));
    }
    long long suma = 0;
    while (!pq.empty()) {
        suma += pq.top();
        pq.pop();
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-kilka-testow', krok: 4, level: 'latwe',
            title: 'Kilka turniejów',
            short: 'Każdy test to osobny turniej — kopiec z poprzedniego testu nie może przejść na następny. Deklaruj go w pętli albo czyść.',
            tags: ['kilka testów', 'czyszczenie kopca', 'k największych'],
            statement: ['W jednym wejściu jest T turniejów. W każdym startowało n zawodników z podanymi wynikami. Dla każdego turnieju wypisz k najlepszych wyników, od najwyższego.',
                'Uważaj: kopiec nie ma funkcji clear(). Najprościej zadeklarować go wewnątrz pętli po testach — wtedy każdy test dostaje nowy, pusty kopiec. Można też go wyczyścić przypisaniem pq = priority_queue<int>();.'],
            input_format: ['W pierwszym wierszu liczba T.', 'Każdy test to dwa wiersze: liczby n i k, a w następnym n wyników.'],
            output_format: ['Dla każdego testu jeden wiersz: k najlepszych wyników od najwyższego.'],
            constraints: ['1 ≤ T ≤ 100', '1 ≤ k ≤ n ≤ 1000', 'Suma wszystkich n nie przekracza 2500.', 'Wyniki są z przedziału od 0 do 10⁵.'],
            examples: [{ input: '2\n4 2\n10 50 20 40\n3 3\n5 1 5', note: 'W pierwszym turnieju najlepsze są 50 i 40. W drugim wypisujemy wszystkie trzy wyniki — bez śladu po pierwszym turnieju.' }],
            hint: R`for (int t = 0; t < T; t++) { int n, k; cin >> n >> k; priority_queue<int> pq; … }. Jeśli kopiec stoi przed pętlą, w drugim teście zostałyby w nim wyniki z pierwszego (u nas: 30 i 20 z przykładu).`,
            tests: (r) => {
                const testy = (lista) => `${lista.length}\n${lista.map(([a, k]) => `${a.length} ${k}\n${a.join(' ')}`).join('\n')}`;
                const los = (ile, maxN, hi) => Array.from({ length: ile }, () => { const n = r.int(1, maxN); return [r.arr(n, 0, hi), r.int(1, n)]; });
                return [testy([[[7], 1]]), testy([[[1, 2], 1], [[3], 1]]), testy([[[5, 5, 5], 2], [[1], 1], [[9, 8], 2]]), testy(los(10, 8, 20)), testy(los(100, 25, 100000)), testy([[r.arr(1000, 0, 100000), 1000], [r.arr(1000, 0, 100000), 1], [r.arr(500, 0, 100000), 250]]), testy(los(60, 40, 5))];
            },
            check: (inp) => {
                const t = nums(inp);
                if (!calk(t[0], 1, 100)) return 'T';
                let p = 1, suma = 0;
                for (let j = 0; j < t[0]; j++) {
                    const n = t[p++], k = t[p++];
                    if (!calk(n, 1, 1000) || !calk(k, 1, n)) return 'n k';
                    suma += n;
                    for (let i = 0; i < n; i++) if (!calk(t[p++], 0, 1e5)) return 'wynik';
                }
                return p === t.length && suma <= 2500 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp), out = [];
                let p = 1;
                for (let j = 0; j < t[0]; j++) {
                    const n = t[p++], k = t[p++];
                    out.push(malejaco(t.slice(p, p + n)).slice(0, k).join(' '));
                    p += n;
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T;
    cin >> T;
    for (int t = 0; t < T; t++) {
        int n, k;
        cin >> n >> k;
        priority_queue<int> pq;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            pq.push(x);
        }
        for (int i = 0; i < k; i++) {
            cout << pq.top() << " ";
            pq.pop();
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-punkty-k-razy', krok: 4, level: 'srednie',
            title: 'Punkty w k ruchach',
            short: 'Zawsze bierz największą liczbę — dostajesz tyle punktów, a liczba kurczy się do jednej trzeciej (w górę) i wraca do kopca.',
            tags: ['zachłannie największy', 'dzielenie w górę', 'long long'],
            statement: ['Masz n liczb naturalnych i k ruchów. W każdym ruchu wybierasz jedną z liczb, x, dostajesz x punktów, a liczba x zamienia się na ⌈x / 3⌉ (jedna trzecia zaokrąglona w górę). Zdobądź jak najwięcej punktów.',
                'Najlepiej za każdym razem brać największą liczbę — zmniejszona wraca do puli i może jeszcze się przydać. Wypisz największą liczbę punktów po k ruchach.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jedna liczba — największa możliwa liczba punktów.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ k ≤ 10⁵', 'Liczby są z przedziału od 1 do 10⁹.'],
            examples: [{ input: '3 3\n10 1 3', note: 'Bierzemy 10 (zostaje ⌈10/3⌉ = 4), potem 4 (zostaje 2), potem 3. Razem 10 + 4 + 3 = 17.' }],
            hint: R`long long punkty = 0; for (k razy) { long long x = pq.top(); pq.pop(); punkty += x; pq.push((x + 2) / 3); }. (x + 2) / 3 to dzielenie przez 3 w górę — znasz je z lekcji Zaokrąglanie.`,
            tests: (r) => [dk([1], 1), dk([1], 100000), dk([9], 3), dk([10, 1, 3], 1), dk(r.arr(10, 1, 100), 10), dk(r.arr(5000, 1, 1000000000), 100000), dk(r.arr(5000, 1000000000, 1000000000), 5000), dk(r.arr(5000, 1, 1000000000), 17)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, 1e5) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1];
                const pq = new PQ(mniej, t.slice(2));
                let p = 0;
                for (let i = 0; i < k; i++) { const x = pq.pop(); p += x; pq.push(Math.ceil(x / 3)); }
                return String(p);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<long long> pq;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        pq.push(x);
    }
    long long punkty = 0;
    for (int i = 0; i < k; i++) {
        long long x = pq.top();
        pq.pop();
        punkty += x;
        pq.push((x + 2) / 3);
    }
    cout << punkty << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-gra-w-kupki', krok: 4, level: 'srednie',
            title: 'Gra w kupki',
            short: 'Ala i Bartek na zmianę biorą największą kupkę: połowa (w górę) to punkty, reszta wraca na stół. Kto ile zdobędzie?',
            tags: ['symulacja na zmianę', 'połowa w górę', 'long long'],
            statement: ['Na stole leży n kupek żetonów. Ala i Bartek grają na zmianę, zaczyna Ala. W swoim ruchu gracz bierze kupkę, na której jest najwięcej żetonów — powiedzmy x — zabiera z niej ⌈x / 2⌉ żetonów jako swoje punkty, a pozostałe ⌊x / 2⌋ żetonów odkłada na stół jako nową kupkę (o ile coś zostało).',
                'Gra kończy się, gdy na stole nie ma już żadnej kupki. Wypisz, ile punktów zdobyła Ala, a ile Bartek.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — wielkości kupek.'],
            output_format: ['Dwie liczby: punkty Ali i punkty Bartka.'],
            constraints: ['1 ≤ n ≤ 2000', 'Na każdej kupce jest od 1 do 10⁹ żetonów.'],
            examples: [{ input: '2\n5 3', note: 'Ala bierze 3 z piątki (zostaje 2). Bartek bierze 2 z trójki (zostaje 1). Ala bierze 1 z dwójki (zostaje 1). Bartek bierze 1, Ala bierze ostatnią 1. Ala ma 5, Bartek 3.' }],
            hint: R`long long pkt[2] = {0, 0}; int kto = 0; while (!pq.empty()) { long long x = pq.top(); pq.pop(); pkt[kto] += (x + 1) / 2; if (x / 2 > 0) pq.push(x / 2); kto = 1 - kto; }.`,
            tests: (r) => [d1([1]), d1([2]), d1([5, 3]), d1([4, 4, 4, 4]), d1(r.arr(10, 1, 100)), d1(r.arr(2000, 1, 1000000000)), d1(r.arr(2000, 1, 3)), d1(r.arr(1999, 1000000000, 1000000000))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const pq = new PQ(mniej, nums(inp).slice(1)), pkt = [0, 0];
                let kto = 0;
                while (pq.size) { const x = pq.pop(); pkt[kto] += Math.ceil(x / 2); if (Math.floor(x / 2) > 0) pq.push(Math.floor(x / 2)); kto = 1 - kto; }
                return pkt.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<long long> pq;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        pq.push(x);
    }
    long long pkt[2] = {0, 0};
    int kto = 0;
    while (!pq.empty()) {
        long long x = pq.top();
        pq.pop();
        pkt[kto] += (x + 1) / 2;
        if (x / 2 > 0) pq.push(x / 2);
        kto = 1 - kto;
    }
    cout << pkt[0] << " " << pkt[1] << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-lotnisko', krok: 4, level: 'srednie',
            title: 'Bilety na lotnisku',
            short: 'Bilet kosztuje tyle, ile wolnych miejsc zostało w samolocie. Kopiec maksimum daje największy zarobek, kopiec minimum — najmniejszy.',
            tags: ['kopiec maksimum i minimum', 'te same dane', 'pomijanie zer'],
            statement: ['Na lotnisku jest m samolotów, w i-tym zostało a_i wolnych miejsc. Po bilety ustawiło się n pasażerów. Każdy pasażer sam wybiera samolot (byle z wolnym miejscem), a cena biletu jest równa liczbie wolnych miejsc w wybranym samolocie w chwili zakupu. Po zakupie w tym samolocie jest o jedno wolne miejsce mniej.',
                'Lotnisko chce wiedzieć, ile najwięcej i ile najmniej może zarobić na tych n pasażerach. Najwięcej — gdy każdy wybiera samolot z największą liczbą wolnych miejsc (kopiec maksimum). Najmniej — gdy każdy wybiera samolot z najmniejszą dodatnią liczbą wolnych miejsc (kopiec minimum; samolot z zerem wolnych miejsc znika z kopca). Wolnych miejsc na pewno starczy dla wszystkich.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m liczb a_i.'],
            output_format: ['Dwie liczby: największy i najmniejszy możliwy zarobek.'],
            constraints: ['1 ≤ m ≤ 1000', '1 ≤ a_i ≤ 1000', '1 ≤ n ≤ 10⁴', 'Suma wszystkich a_i jest co najmniej n.'],
            examples: [{ input: '4 3\n2 1 1', note: 'Najdrożej: 2 + 1 + 1 + 1 = 5 (po pierwszym bilecie wszystkie samoloty mają po 1 miejscu). Najtaniej: 1 + 1 + 2 + 1 = 5.' },
                { input: '4 3\n2 2 2', note: 'Najdrożej 2 + 2 + 2 + 1 = 7, najtaniej 2 + 1 + 2 + 1 = 6 — najpierw wyprzedajemy do końca jeden samolot.' }],
            hint: R`Dwa kopce z tymi samymi a_i. Najdrożej: x = maks.top(); maks.pop(); zarobek += x; if (x > 1) maks.push(x - 1);. Najtaniej tak samo z kopcem minimum. Samolot z zerem wolnych miejsc nie wraca do kopca — inaczej kopiec minimum podawałby zero.`,
            tests: (r) => {
                const d = (n, a) => `${n} ${a.length}\n${a.join(' ')}`;
                const los = (m, hi, czesc) => { const a = r.arr(m, 1, hi); const s = a.reduce((x, y) => x + y, 0); return d(Math.max(1, Math.min(10000, Math.floor(s * czesc))), a); };
                return [d(1, [1]), d(3, [3]), d(4, [2, 2, 2]), d(6, [2, 2, 2]), los(10, 10, 0.5), los(1000, 1000, 0.02), los(1000, 10, 1), los(50, 1000, 0.2), los(300, 50, 0.7)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(m, 1, 1000) && calk(n, 1, 1e4) && t.length === m + 2 && t.slice(2).every((x) => calk(x, 1, 1000)) && t.slice(2).reduce((a, b) => a + b, 0) >= n ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), n = t[0];
                const licz = (m) => {
                    const pq = new PQ(m, t.slice(2));
                    let z = 0;
                    for (let i = 0; i < n; i++) { const x = pq.pop(); z += x; if (x > 1) pq.push(x - 1); }
                    return z;
                };
                return `${licz(mniej)} ${licz(wiecej)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    priority_queue<int> maks;
    priority_queue<int, vector<int>, greater<int>> mini;
    for (int i = 0; i < m; i++) {
        int a;
        cin >> a;
        maks.push(a);
        mini.push(a);
    }
    long long najwiecej = 0, najmniej = 0;
    for (int i = 0; i < n; i++) {
        int x = maks.top();
        maks.pop();
        najwiecej += x;
        if (x > 1) maks.push(x - 1);
        int y = mini.top();
        mini.pop();
        najmniej += y;
        if (y > 1) mini.push(y - 1);
    }
    cout << najwiecej << " " << najmniej << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-duzo-polecen', krok: 4, level: 'trudne',
            title: 'Milion poleceń',
            short: 'Liczby z generatora: podzielna przez 3 oznacza „zabierz największą”, inna — „dodaj”. Milion poleceń przejdzie tylko z kopcem.',
            tags: ['generator danych', 'milion operacji', 'O(n log n)'],
            statement: ['Wejście jest bardzo duże, więc zamiast liczb dostajesz pięć liczb n, s, a, b, m i sam generujesz ciąg x₁, …, xₙ: x₁ = s, a każda następna liczba to xᵢ = (xᵢ₋₁ · a + b) mod m (licz w long long).',
                'Przejdź ciąg od początku i traktuj każdą liczbę jak polecenie dla kopca: jeśli xᵢ dzieli się przez 3, zabierz z kopca największą liczbę i dodaj ją do sumy (jeśli kopiec jest pusty — nic nie rób); w przeciwnym razie wrzuć xᵢ do kopca.',
                'Wypisz sumę zabranych liczb i liczbę elementów, które zostały w kopcu. Przy milionie poleceń szukanie największej liczby pętlą po vectorze nie zdąży — kopiec robi to w kilkunastu krokach.'],
            input_format: ['Jeden wiersz: liczby n, s, a, b, m.'],
            output_format: ['Dwie liczby: suma zabranych liczb i liczba elementów w kopcu na końcu.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 2 3 1 10', note: 'Ciąg to 2, 7, 2, 7, 2, 7 — żadna liczba nie dzieli się przez 3, więc wszystkie trafiają do kopca. Suma 0, w kopcu 6 liczb.' },
                { input: '6 4 5 2 20', note: 'Ciąg to 4, 2, 12, 2, 12, 2. Liczba 12 dzieli się przez 3: pierwsza zabiera z kopca 4, druga zabiera 2. Suma 6, w kopcu zostają dwie dwójki.' }],
            hint: R`${KOD_GEN} Potem jedna pętla: if (x[i] % 3 == 0) { if (!pq.empty()) { suma += pq.top(); pq.pop(); } } else pq.push(x[i]);. Kopiec long long albo int (m ≤ 10⁹ mieści się w int), suma w long long.`,
            tests: () => ['1 0 0 0 1', '1 7 3 1 10', '10 1 2 3 100', '1000 123 4567 89 10007', '1000000 12345 48271 0 999999937', '1000000 1 16807 11 1000000000', '1000000 999 69621 3 999999937', '500000 5 21 7 1000000'],
            check: (inp) => (nums(inp).length === 5 && dobryGen(nums(inp), 0, 1e6, 1e9) ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m), pq = new PQ(mniej);
                let suma = 0;
                for (let i = 0; i < n; i++) {
                    if (x[i] % 3 === 0) { if (pq.size) suma += pq.pop(); } else pq.push(x[i]);
                }
                return `${suma} ${pq.size}`;
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
    priority_queue<long long> pq;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        if (x[i] % 3 == 0) {
            if (!pq.empty()) {
                suma += pq.top();
                pq.pop();
            }
        } else {
            pq.push(x[i]);
        }
    }
    cout << suma << " " << pq.size() << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 5 · pary i struktury
        {
            id: 'kop-sor', krok: 5, level: 'latwe',
            title: 'Izba przyjęć',
            short: 'Lekarz bierze najpilniejszego pacjenta, a przy równej pilności — tego, kto przyszedł wcześniej. Para {pilność, −numer}.',
            tags: ['kopiec par', 'minus w drugim polu', 'numer przyjścia'],
            statement: ['Na szpitalnej izbie przyjęć lekarz przyjmuje zawsze pacjenta o największej pilności (od 1 do 10). Jeśli kilku pacjentów ma tę samą pilność, pierwszeństwo ma ten, kto przyszedł wcześniej.',
                'Wykonaj q zdarzeń: PRZYCHODZI imię p — przychodzi pacjent o podanym imieniu i pilności p; LEKARZ — lekarz woła pacjenta: wypisz jego imię (pacjent opuszcza poczekalnię), a jeśli nikt nie czeka, wypisz nikt.',
                'Wskazówka: numeruj pacjentów w kolejności przyjścia i trzymaj w kopcu pary {pilność, −numer}. Większa pilność wygrywa, a przy remisie większe −numer, czyli mniejszy numer — wcześniejsze przyjście. Imiona trzymaj w vectorze pod numerami.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno zdarzenie: PRZYCHODZI imię p albo LEKARZ.'],
            output_format: ['Dla każdego zdarzenia LEKARZ jeden wiersz: imię pacjenta albo słowo nikt.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ p ≤ 10', 'Imiona to słowa z liter angielskiego alfabetu, najwyżej 12 znaków; mogą się powtarzać.'],
            examples: [{ input: '7\nPRZYCHODZI Ola 3\nPRZYCHODZI Jan 8\nPRZYCHODZI Ewa 3\nLEKARZ\nLEKARZ\nLEKARZ\nLEKARZ', note: 'Jan ma pilność 8 — idzie pierwszy. Ola i Ewa mają po 3, ale Ola przyszła wcześniej. Na koniec poczekalnia jest pusta.' }],
            hint: R`priority_queue<pair<int, int>> pq; vector<string> imiona;. Przy PRZYCHODZI: imiona.push_back(imie); pq.push({p, -(int)(imiona.size() - 1)});. Przy LEKARZ: int nr = -pq.top().second; cout << imiona[nr];.`,
            tests: (r) => {
                const los = (q, pPrz, pMax) => {
                    const L = [];
                    for (let i = 0; i < q; i++) L.push(r() < pPrz ? `PRZYCHODZI ${r.pick(IMIONA)} ${r.int(1, pMax)}` : 'LEKARZ');
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nLEKARZ', '3\nPRZYCHODZI Ala 5\nPRZYCHODZI Ola 5\nLEKARZ', '5\nPRZYCHODZI Ala 1\nPRZYCHODZI Ola 2\nPRZYCHODZI Ela 3\nLEKARZ\nLEKARZ', los(30, 0.6, 10), los(3000, 0.55, 10), los(3000, 0.7, 2), los(500, 0.5, 1)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'LEKARZ' || (/^PRZYCHODZI [A-Za-z]{1,12} \d+$/.test(l) && calk(Number(l.split(' ')[2]), 1, 10))) ? null : 'zdarzenie';
            },
            solve: (inp) => {
                const pq = new PQ(mniejKrotka), im = [], out = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'LEKARZ') { out.push(pq.empty() ? 'nikt' : im[-pq.pop()[1]]); continue; }
                    const [, i, p] = l.split(' ');
                    im.push(i);
                    pq.push([Number(p), -(im.length - 1)]);
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    priority_queue<pair<int, int>> pq;
    vector<string> imiona;
    for (int i = 0; i < q; i++) {
        string z;
        cin >> z;
        if (z == "PRZYCHODZI") {
            string imie;
            int p;
            cin >> imie >> p;
            imiona.push_back(imie);
            pq.push({p, -(int)(imiona.size() - 1)});
        } else if (pq.empty()) {
            cout << "nikt\n";
        } else {
            int nr = -pq.top().second;
            pq.pop();
            cout << imiona[nr] << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-najlepsi-uczniowie', krok: 5, level: 'latwe',
            title: 'Najlepsi uczniowie',
            short: 'Ranking: więcej punktów wyżej, przy remisie alfabetycznie. Imienia nie da się wziąć z minusem — minus idzie do punktów, a kopiec jest kopcem minimum.',
            tags: ['para {−punkty, imię}', 'kopiec minimum par', 'remis alfabetycznie'],
            statement: ['W klasie jest n uczniów, każdy ma inne imię i pewną liczbę punktów. Wypisz k najlepszych uczniów: od największej liczby punktów, a przy równej liczbie punktów — w kolejności alfabetycznej imion.',
                'Para {punkty, imię} w zwykłym kopcu przy remisie oddałaby imię dalsze w alfabecie — odwrotnie, niż chcemy. Imienia nie da się wziąć z minusem, ale punkty tak: wrzucaj pary {−punkty, imię} do kopca minimum par. Wtedy na wierzchu jest najmniejsze −punkty (czyli najwięcej punktów), a przy remisie — imię najwcześniejsze w alfabecie.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z kolejnych n wierszy imię i liczba punktów.'],
            output_format: ['k wierszy: imię i liczba punktów, od najlepszego ucznia.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', 'k ≤ 1000', 'Punkty są liczbami całkowitymi od 0 do 100.', 'Imiona są różne, mają najwyżej 15 znaków (litery i cyfry); porównujemy je jak napisy w C++.'],
            examples: [{ input: '5 3\nOla 90\nAdam 75\nEwa 90\nIgor 100\nBasia 75', note: 'Igor ma 100. Potem Ewa i Ola po 90 — alfabetycznie Ewa przed Olą.' }],
            hint: R`priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq; pq.push({-punkty, imie});. Przy wypisywaniu: -pq.top().first to punkty, pq.top().second to imię.`,
            tests: (r) => {
                const d = (u, k) => `${u.length} ${k}\n${u.map(([i, p]) => `${i} ${p}`).join('\n')}`;
                const los = (n, k, hi) => d(unikalneImiona(r, n).map((i) => [i, r.int(0, hi)]), k);
                return [d([['Ala', 5]], 1), d([['Ola', 7], ['Ala', 7]], 2), d([['Zenek', 0], ['Adam', 0], ['Maja', 1]], 2), los(10, 5, 10), los(2000, 1000, 100), los(2000, 7, 3), los(300, 300, 100), los(100, 50, 0)];
            },
            check: (inp) => {
                const L = linie(inp);
                const [n, k] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 2000) || !calk(k, 1, Math.min(n, 1000)) || L.length !== n + 1) return 'n k';
                const im = new Set();
                for (const l of L.slice(1)) { const [i, p] = l.split(' '); if (!/^[A-Za-z0-9]{1,15}$/.test(i) || !calk(Number(p), 0, 100) || im.has(i)) return 'uczeń'; im.add(i); }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp);
                const k = Number(L[0].split(' ')[1]);
                const u = L.slice(1).map((l) => { const [i, p] = l.split(' '); return [i, Number(p)]; });
                u.sort((a, b) => b[1] - a[1] || cmpStr(a[0], b[0]));
                return u.slice(0, k).map(([i, p]) => `${i} ${p}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    for (int i = 0; i < n; i++) {
        string imie;
        int punkty;
        cin >> imie >> punkty;
        pq.push({-punkty, imie});
    }
    for (int i = 0; i < k; i++) {
        cout << pq.top().second << " " << -pq.top().first << "\n";
        pq.pop();
    }
    return 0;
}`,
        },
        {
            id: 'kop-zadania-z-priorytetem', krok: 5, level: 'latwe',
            title: 'Lista zadań',
            short: 'Zrób najpierw zadanie o najwyższym priorytecie, a przy remisie — alfabetycznie pierwsze. Polecenia DODAJ, ZROB i ILE.',
            tags: ['para w kopcu minimum', 'polecenia', 'remisy'],
            statement: ['Prowadzisz listę zadań do zrobienia. Każde zadanie ma nazwę (słowo z małych liter) i priorytet. Wykonaj q poleceń:',
                'DODAJ nazwa p — dopisz zadanie o podanej nazwie i priorytecie p; ZROB — zrób najważniejsze zadanie: wypisz jego nazwę i skreśl je z listy (najważniejsze ma największy priorytet, a przy remisie — nazwę najwcześniejszą w alfabecie); jeśli lista jest pusta, wypisz nic. ILE — wypisz, ile zadań jest na liście.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia ZROB i ILE jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ q ≤ 3000', 'Priorytety są liczbami całkowitymi od 1 do 10⁶.', 'Nazwy mają od 1 do 12 małych liter; ta sama nazwa może się powtórzyć.'],
            examples: [{ input: '7\nDODAJ zakupy 2\nDODAJ lekcje 5\nDODAJ pranie 2\nZROB\nZROB\nILE\nZROB', note: 'Najpierw lekcje (priorytet 5). Zakupy i pranie mają po 2 — alfabetycznie pierwsze jest pranie. Zostają same zakupy.' }],
            hint: R`Kopiec minimum par {-p, nazwa}: na wierzchu najmniejsze -p, czyli największe p, a przy remisie — najmniejsza nazwa. Przy ZROB: if (pq.empty()) cout << "nic\n"; else { cout << pq.top().second << "\n"; pq.pop(); }.`,
            tests: (r) => {
                const los = (q, pDod, pMax, slowa) => {
                    const L = [];
                    for (let i = 0; i < q; i++) {
                        const u = r();
                        L.push(u < pDod ? `DODAJ ${r.pick(slowa)} ${r.int(1, pMax)}` : u < pDod + 0.08 ? 'ILE' : 'ZROB');
                    }
                    return `${q}\n${L.join('\n')}`;
                };
                const sl = SLOWA.filter((s) => /^[a-z]{1,12}$/.test(s));
                return ['1\nZROB', '2\nILE\nDODAJ a 1', '5\nDODAJ b 3\nDODAJ a 3\nDODAJ c 3\nZROB\nZROB', los(40, 0.6, 5, sl), los(3000, 0.55, 1000000, sl), los(3000, 0.6, 3, sl), los(1000, 0.5, 2, ['a', 'b', 'ab', 'ba', 'aa'])];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'ZROB' || l === 'ILE' || (/^DODAJ [a-z]{1,12} \d+$/.test(l) && calk(Number(l.split(' ')[2]), 1, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const pq = new PQ(wiecejKrotka), out = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'ILE') out.push(pq.size);
                    else if (l === 'ZROB') out.push(pq.empty() ? 'nic' : pq.pop()[1]);
                    else { const [, n, p] = l.split(' '); pq.push([-Number(p), n]); }
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            string nazwa;
            int pr;
            cin >> nazwa >> pr;
            pq.push({-pr, nazwa});
        } else if (p == "ILE") {
            cout << pq.size() << "\n";
        } else if (pq.empty()) {
            cout << "nic\n";
        } else {
            cout << pq.top().second << "\n";
            pq.pop();
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-najblizsze-punkty', krok: 5, level: 'srednie',
            title: 'Najbliższe gwiazdy',
            short: 'k punktów najbliżej środka układu: kwadrat odległości w long long, a para par {d, {x, y}} sama rozstrzyga remisy.',
            tags: ['para par', 'long long', 'kwadrat odległości'],
            statement: ['Na mapie nieba jest n gwiazd w punktach o współrzędnych całkowitych (x, y), a Ziemia jest w punkcie (0, 0). Wypisz k gwiazd najbliższych Ziemi, od najbliższej.',
                'Odległości nie trzeba liczyć z pierwiastkiem — wystarczy porównywać jej kwadrat x² + y². Przy równej odległości bliżej na liście jest gwiazda o mniejszym x, a przy równym x — o mniejszym y. Uwaga: x² dla x = 10⁶ to 10¹² — to się nie mieści w int.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z kolejnych n wierszy dwie liczby x i y.'],
            output_format: ['k wierszy: współrzędne gwiazd od najbliższej.'],
            constraints: ['1 ≤ k ≤ n ≤ 3000', 'k ≤ 1000', 'Współrzędne są z przedziału od −10⁶ do 10⁶; gwiazdy mogą się powtarzać.'],
            examples: [{ input: '5 3\n3 4\n-5 0\n1 1\n0 -1\n4 3', note: 'Kwadraty odległości: 25, 25, 2, 1 i 25. Najbliżej jest (0, −1), potem (1, 1). Trzy gwiazdy mają po 25 — z nich najmniejsze x ma (−5, 0).' }],
            hint: R`Kopiec minimum elementów pair<long long, pair<int, int>>: pq.push({1LL * x * x + 1LL * y * y, {x, y}});. Pary porównują się pole po polu, więc remis odległości rozstrzyga x, a potem y — dokładnie tak, jak chcemy.`,
            tests: (r) => {
                const d = (p, k) => `${p.length} ${k}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, k, M) => d(Array.from({ length: n }, () => [r.int(-M, M), r.int(-M, M)]), k);
                const okrag = [];
                for (const [x, y] of [[5, 0], [-5, 0], [0, 5], [0, -5], [3, 4], [-3, 4], [3, -4], [-4, -3], [4, 3]]) okrag.push([x, y]);
                return [d([[0, 0]], 1), d(okrag, 9), d([[1, 1], [1, 1], [-1, -1]], 2), los(20, 5, 10), los(3000, 1000, 1000000), los(3000, 1000, 3), los(1000, 1, 1000000), d([[1000000, 1000000], [-1000000, 1000000], [999999, -1000000]], 3)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, k] = t;
                return calk(n, 1, 3000) && calk(k, 1, Math.min(n, 1000)) && t.length === 2 * n + 2 && t.slice(2).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp), n = t[0], k = t[1];
                const p = [];
                for (let i = 0; i < n; i++) { const x = t[2 + 2 * i], y = t[3 + 2 * i]; p.push([x * x + y * y, x, y]); }
                p.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
                return p.slice(0, k).map((q) => `${q[1]} ${q[2]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<pair<long long, pair<int, int>>, vector<pair<long long, pair<int, int>>>, greater<pair<long long, pair<int, int>>>> pq;
    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        pq.push({1LL * x * x + 1LL * y * y, {x, y}});
    }
    for (int i = 0; i < k; i++) {
        cout << pq.top().second.first << " " << pq.top().second.second << "\n";
        pq.pop();
    }
    return 0;
}`,
        },
        {
            id: 'kop-czeste-slowa', krok: 5, level: 'srednie',
            title: 'Najczęstsze słowa',
            short: 'Mapa zlicza słowa, a kopiec par {−ile, słowo} wybiera k najczęstszych, przy remisie alfabetycznie.',
            tags: ['mapa + kopiec', 'para {−ile, słowo}', 'remis alfabetycznie'],
            statement: ['Wczytaj n słów i policz, ile razy wystąpiło każde z nich. Wypisz k najczęstszych słów razem z liczbą wystąpień: od najczęstszego, a przy równej liczbie wystąpień — w kolejności alfabetycznej.',
                'Zlicz słowa w map<string, int>, a potem przerzuć wszystkie pary z mapy do kopca minimum par {−ile, słowo} i zdejmij k razy wierzch.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n słów.'],
            output_format: ['k wierszy: słowo i liczba jego wystąpień.'],
            constraints: ['1 ≤ n ≤ 5000', 'k nie przekracza liczby różnych słów.', 'Słowa mają od 1 do 12 małych liter.'],
            examples: [{ input: '9 2\nala ma kota kot ma ale ala ma psa', note: 'Słowo ma występuje 3 razy, ala — 2 razy. Pozostałe słowa (ale, kot, kota, psa) wystąpiły raz.' }],
            hint: R`map<string, int> ile; for (…) ile[s]++;. for (auto [s, c] : ile) pq.push({-c, s});. Kopiec minimum par: priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>>.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                const sl = SLOWA.filter((s) => /^[a-z]{1,12}$/.test(s));
                const los = (n, ileRoznych, kFn) => { const baza = r.shuffle(sl).slice(0, ileRoznych); const a = Array.from({ length: n }, () => r.pick(baza)); return d(a, kFn(new Set(a).size)); };
                return [d(['a'], 1), d(['b', 'a', 'b', 'a'], 2), d(['x', 'y', 'z'], 3), los(30, 6, (u) => 3), los(5000, 40, (u) => u), los(5000, 5, (u) => 2), d(Array.from({ length: 4000 }, () => r.word(r.int(1, 3), 'ab')), 5), los(300, 30, () => 1)];
            },
            check: (inp) => {
                const t = toks(inp); const n = Number(t[0]), k = Number(t[1]);
                if (!calk(n, 1, 5000) || t.length !== n + 2 || !t.slice(2).every((s) => czyMale(s, 12))) return 'dane';
                return calk(k, 1, new Set(t.slice(2)).size) ? null : 'k';
            },
            solve: (inp) => {
                const t = toks(inp), k = Number(t[1]), m = new Map();
                for (const s of t.slice(2)) m.set(s, (m.get(s) || 0) + 1);
                return [...m].sort((a, b) => b[1] - a[1] || cmpStr(a[0], b[0])).slice(0, k).map(([s, c]) => `${s} ${c}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    map<string, int> ile;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        ile[s]++;
    }
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    for (auto [s, c] : ile) pq.push({-c, s});
    for (int i = 0; i < k; i++) {
        cout << pq.top().second << " " << -pq.top().first << "\n";
        pq.pop();
    }
    return 0;
}`,
        },
        {
            id: 'kop-indeksy-najwiekszych', krok: 5, level: 'srednie',
            title: 'Gdzie leżą największe',
            short: 'Nie wartości, tylko pozycje k największych liczb. Para {wartość, −pozycja}: przy remisie wygrywa wcześniejsza pozycja.',
            tags: ['para {wartość, −pozycja}', 'numery zamiast wartości', 'remisy'],
            statement: ['Wczytaj n liczb ponumerowanych od 1 do n. Wypisz numery pozycji k największych liczb, od największej liczby. Jeśli kilka liczb jest równych, wcześniej wypisz tę, która stoi bliżej początku (ma mniejszy numer).',
                'Trzymaj w kopcu pary {wartość, −pozycja}: większa wartość wygrywa, a przy remisie większe −pozycja, czyli mniejsza pozycja.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: k numerów pozycji.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', 'Liczby są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '6 4\n5 9 5 1 9 5', note: 'Dziewiątki stoją na pozycjach 2 i 5, potem piątki na pozycjach 1 i 3 (piątka z pozycji 6 się nie mieści).' }],
            hint: R`priority_queue<pair<int, int>> pq; for (int i = 1; i <= n; i++) { cin >> x; pq.push({x, -i}); }. Wypisuj -pq.top().second.`,
            tests: (r) => [dk([7], 1), dk([1, 1, 1], 3), dk([3, 1, 2], 2), dk(r.arr(12, 0, 3), 6), dk(r.arr(5000, -1000000000, 1000000000), 5000), dk(r.arr(5000, 0, 9), 2500), dk(r.arr(5000, 5, 5), 100)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1];
                const p = t.slice(2).map((x, i) => [x, i + 1]);
                p.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
                return p.slice(0, k).map((q) => q[1]).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<pair<int, int>> pq;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        pq.push({x, -i});
    }
    for (int i = 0; i < k; i++) {
        cout << -pq.top().second << " ";
        pq.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-aukcja', krok: 5, level: 'srednie',
            title: 'Aukcja',
            short: 'Struktura z operatorem <: najwyższa oferta wygrywa, a przy równej kwocie — złożona wcześniej. „Mniejsza” oferta to ta gorsza.',
            tags: ['struct z operator<', 'odwrócony porządek', 'polecenia'],
            statement: ['Dom aukcyjny zbiera oferty kupna. Każda oferta ma kupującego, kwotę i czas złożenia (numer polecenia). Wykonaj q poleceń:',
                'OFERTA kto kwota — kupujący kto składa ofertę; SPRZEDAJ — sprzedaj przedmiot najlepszej ofercie: wypisz kupującego i kwotę, a ofertę usuń. Najlepsza oferta ma największą kwotę, a przy równych kwotach — wcześniejszy czas złożenia. Jeśli nie ma żadnej oferty, wypisz brak.',
                'Napisz strukturę Oferta z polami kwota, czas i kto oraz operatorem <, który mówi, kiedy oferta jest GORSZA od innej — kopiec trzyma na wierzchu element „największy”, czyli najlepszy.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia SPRZEDAJ jeden wiersz: kupujący i kwota albo słowo brak.'],
            constraints: ['1 ≤ q ≤ 3000', 'Kwoty są liczbami całkowitymi od 1 do 10⁶.', 'Imiona kupujących to słowa z liter, najwyżej 12 znaków.'],
            examples: [{ input: '6\nOFERTA Ola 300\nOFERTA Kuba 500\nOFERTA Ewa 500\nSPRZEDAJ\nSPRZEDAJ\nSPRZEDAJ', note: 'Kuba i Ewa dają po 500, ale Kuba był pierwszy. Potem Ewa, a na koniec Ola.' }],
            hint: R`struct Oferta { int kwota, czas; string kto; bool operator<(const Oferta &o) const { if (kwota != o.kwota) return kwota < o.kwota; return czas > o.czas; } };. Późniejszy czas to gorsza oferta, dlatego czas > o.czas. Bez const na końcu operatora kopiec się nie skompiluje.`,
            tests: (r) => {
                const los = (q, pOf, kMax) => {
                    const L = [];
                    for (let i = 0; i < q; i++) L.push(r() < pOf ? `OFERTA ${r.pick(IMIONA)} ${r.int(1, kMax)}` : 'SPRZEDAJ');
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nSPRZEDAJ', '3\nOFERTA Ala 5\nOFERTA Ola 5\nSPRZEDAJ', los(30, 0.6, 10), los(3000, 0.55, 1000000), los(3000, 0.6, 3), los(800, 0.5, 1)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'SPRZEDAJ' || (/^OFERTA [A-Za-z]{1,12} \d+$/.test(l) && calk(Number(l.split(' ')[2]), 1, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const pq = new PQ((a, b) => (a.kwota !== b.kwota ? a.kwota < b.kwota : a.czas > b.czas)), out = [];
                linie(inp).slice(1).forEach((l, czas) => {
                    if (l === 'SPRZEDAJ') { if (pq.empty()) out.push('brak'); else { const o = pq.pop(); out.push(`${o.kto} ${o.kwota}`); } return; }
                    const [, kto, k] = l.split(' ');
                    pq.push({ kto, kwota: Number(k), czas });
                });
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Oferta {
    int kwota, czas;
    string kto;
    bool operator<(const Oferta &o) const {
        if (kwota != o.kwota) return kwota < o.kwota;
        return czas > o.czas;
    }
};
int main() {
    int q;
    cin >> q;
    priority_queue<Oferta> pq;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "OFERTA") {
            Oferta o;
            cin >> o.kto >> o.kwota;
            o.czas = i;
            pq.push(o);
        } else if (pq.empty()) {
            cout << "brak\n";
        } else {
            cout << pq.top().kto << " " << pq.top().kwota << "\n";
            pq.pop();
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-sortowanie-par', krok: 5, level: 'trudne',
            title: 'Pierwsze rosnąco, drugie malejąco',
            short: 'Własny porządek w kopcu: najpierw mniejsze a, a przy równym a — większe b. Pomyśl, co znaczy „mniejszy” dla operatora <.',
            tags: ['własny porządek', 'operator< albo minus', 'odwrócony kopiec'],
            statement: ['Wczytaj n par liczb (a, b) i wypisz je w takiej kolejności: najpierw para o najmniejszym a; jeśli kilka par ma to samo a, najpierw ta o największym b. Takie same pary wypisz tyle razy, ile wystąpiły.',
                'Zrób to kopcem. Możesz użyć struktury z własnym operatorem < (pamiętaj, że na wierzchu kopca jest element „największy”, więc para, która ma wyjść pierwsza, musi być według operatora największa) albo dobrać znaki w zwykłej parze.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby a i b.'],
            output_format: ['n wierszy: pary w podanej kolejności.'],
            constraints: ['1 ≤ n ≤ 1500', 'Liczby są z przedziału od −10⁴ do 10⁴.'],
            examples: [{ input: '5\n3 1\n1 5\n3 7\n1 2\n-2 0', note: 'Najmniejsze a = −2. Dwie pary z a = 1: najpierw (1, 5), bo większe b. Potem pary z a = 3: (3, 7) i (3, 1).' }],
            hint: R`Sposób z parą: kopiec maksimum par {-a, b} — największe -a to najmniejsze a, a przy remisie wygrywa większe b. Sposób ze strukturą: bool operator<(const Para &o) const { if (a != o.a) return a > o.a; return b < o.b; }.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map((q) => q.join(' ')).join('\n')}`;
                const los = (n, M, Mb) => d(Array.from({ length: n }, () => [r.int(-M, M), r.int(-Mb, Mb)]));
                return [d([[0, 0]]), d([[1, 1], [1, 2]]), d([[2, 5], [1, 5], [2, 5]]), los(15, 3, 5), los(1500, 10000, 10000), los(1500, 2, 10000), los(1000, 10000, 1), d([[-10000, -10000], [10000, 10000], [-10000, 10000]])];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1500) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, -1e4, 1e4)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), p = [];
                for (let i = 0; i < t[0]; i++) p.push([t[1 + 2 * i], t[2 + 2 * i]]);
                p.sort((x, y) => x[0] - y[0] || y[1] - x[1]);
                return p.map((q) => q.join(' ')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
struct Para {
    int a, b;
    bool operator<(const Para &o) const {
        if (a != o.a) return a > o.a;
        return b < o.b;
    }
};
int main() {
    int n;
    cin >> n;
    priority_queue<Para> pq;
    for (int i = 0; i < n; i++) {
        Para p;
        cin >> p.a >> p.b;
        pq.push(p);
    }
    while (!pq.empty()) {
        cout << pq.top().a << " " << pq.top().b << "\n";
        pq.pop();
    }
    return 0;
}`,
        },
        // ================================================================ KROK 6 · k największych, scalanie, mediana
        {
            id: 'kop-k-ty-na-biezaco', krok: 6, level: 'latwe',
            title: 'k-ty najlepszy na bieżąco',
            short: 'Klub k najlepszych: kopiec minimum z k wynikami, a na jego wierzchu — bramkarz, czyli k-ty najlepszy wynik.',
            tags: ['kopiec minimum rozmiaru k', 'bramkarz', 'strumień'],
            statement: ['Wyniki zawodników napływają jeden po drugim. Po każdym nowym wyniku wypisz k-ty najlepszy wynik spośród wszystkich dotychczasowych (równe wyniki liczą się osobno). Jeśli wyników jest jeszcze mniej niż k, wypisz minus (-).',
                'Trzymaj tylko k najlepszych wyników w kopcu minimum: nowy wynik wrzuć, a jeśli kopiec ma więcej niż k elementów, wyrzuć najmniejszy. Wtedy na wierzchu leży najsłabszy z k najlepszych — czyli właśnie k-ty najlepszy.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n wyników w kolejności napływania.'],
            output_format: ['Jeden wiersz: n odpowiedzi (liczba albo minus) oddzielonych spacjami.'],
            constraints: ['1 ≤ k ≤ n ≤ 3000', 'Wyniki są liczbami całkowitymi od 0 do 10⁶.'],
            examples: [{ input: '6 3\n4 5 8 2 9 3', note: 'Po trzech wynikach (4, 5, 8) trzeci najlepszy to 4. Dwójka nic nie zmienia. Po dziewiątce klub to 5, 8, 9 — bramkarzem jest 5.' }],
            hint: R`priority_queue<int, vector<int>, greater<int>> klub; klub.push(x); if (klub.size() > k) klub.pop(); if (klub.size() < k) cout << "- "; else cout << klub.top() << " ";.`,
            tests: (r) => [dk([5], 1), dk([1, 2], 2), dk([3, 3, 3], 2), dk(r.arr(15, 0, 20), 4), dk(r.arr(3000, 0, 1000000), 100), dk(r.arr(3000, 0, 1000000), 1), dk(r.arr(3000, 0, 1000000), 3000), dk(Array.from({ length: 200 }, (_, i) => i), 10), dk(Array.from({ length: 200 }, (_, i) => 200 - i), 10)],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 3000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1], klub = new PQ(wiecej), out = [];
                for (const x of t.slice(2)) { klub.push(x); if (klub.size > k) klub.pop(); out.push(klub.size < k ? '-' : klub.top()); }
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int, vector<int>, greater<int>> klub;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        klub.push(x);
        if ((int)klub.size() > k) klub.pop();
        if ((int)klub.size() < k) cout << "- ";
        else cout << klub.top() << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-k-najblizszych', krok: 6, level: 'srednie',
            title: 'k liczb najbliżej celu',
            short: 'Kopiec maksimum par {odległość, liczba} o rozmiarze k: na wierzchu najgorszy kandydat, którego wyrzucamy, gdy przyjdzie lepszy.',
            tags: ['kopiec rozmiaru k', 'para {|a − x|, a}', 'long long'],
            statement: ['Wczytaj n liczb i cel x. Wybierz k liczb, które leżą najbliżej x (odległość to |a − x|). Przy równej odległości bliższa jest liczba mniejsza. Wybrane liczby wypisz rosnąco.',
                'Trzymaj k najlepszych kandydatów w kopcu maksimum par {|a − x|, a} — na wierzchu jest najgorszy z nich (największa odległość, a przy remisie większa liczba). Gdy kopiec przekroczy k elementów, wyrzuć wierzch. Na koniec przerzuć liczby do vectora i posortuj. Uwaga: |a − x| może wynosić 2·10⁹ — to się nie mieści w int.'],
            input_format: ['W pierwszym wierszu liczby n, k i x.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: k wybranych liczb rosnąco.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', 'k ≤ 1000', 'Liczby i x są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '6 3 5\n1 9 4 6 3 7', note: 'Odległości od 5: 4, 4, 1, 1, 2, 2. Najbliżej są 4 i 6, potem 3 i 7 — przy remisie wygrywa mniejsza liczba, czyli 3.' }],
            hint: R`priority_queue<pair<long long, int>> pq; pq.push({llabs((long long)a - x), a}); if (pq.size() > k) pq.pop();. Na koniec: vector<int> w; while (!pq.empty()) { w.push_back(pq.top().second); pq.pop(); } sort(w.begin(), w.end());.`,
            tests: (r) => {
                const d = (a, k, x) => `${a.length} ${k} ${x}\n${a.join(' ')}`;
                return [d([5], 1, 5), d([1, 9], 1, 5), d([4, 6, 4, 6], 3, 5), d(r.arr(20, -10, 10), 5, 0), d(r.arr(5000, -1000000000, 1000000000), 1000, 0), d(r.arr(5000, -1000000000, 1000000000), 1000, 1000000000), d(r.arr(5000, -1000000000, -999990000), 700, 1000000000), d(r.arr(3000, 0, 20), 999, 10)];
            },
            check: (inp) => { const t = nums(inp); const [n, k, x] = t; return calk(n, 1, 5000) && calk(k, 1, Math.min(n, 1000)) && calk(x, -1e9, 1e9) && t.length === n + 3 && t.slice(3).every((v) => calk(v, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1], x = t[2];
                const a = t.slice(3).sort((p, q) => Math.abs(p - x) - Math.abs(q - x) || p - q).slice(0, k);
                return a.sort((p, q) => p - q).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    long long x;
    cin >> n >> k >> x;
    priority_queue<pair<long long, int>> pq;
    for (int i = 0; i < n; i++) {
        int a;
        cin >> a;
        pq.push({llabs(a - x), a});
        if ((int)pq.size() > k) pq.pop();
    }
    vector<int> w;
    while (!pq.empty()) {
        w.push_back(pq.top().second);
        pq.pop();
    }
    sort(w.begin(), w.end());
    for (int v : w) cout << v << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-suma-k-na-biezaco', krok: 6, level: 'srednie',
            title: 'Suma najlepszych na bieżąco',
            short: 'Milion wyników z generatora i po każdym suma k najlepszych. Kopiec rozmiaru k i suma poprawiana przy push i pop.',
            tags: ['generator danych', 'kopiec rozmiaru k', 'suma na bieżąco'],
            statement: ['Wyniki generujesz sam: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m (w long long). Po każdym wyniku xᵢ policz Sᵢ — sumę k najlepszych spośród x₁, …, xᵢ (jeśli wyników jest mniej niż k, to sumę wszystkich).',
                'Wypisz sumę S₁ + S₂ + … + Sₙ. Sortowanie po każdym wyniku byłoby za wolne. Trzymaj k najlepszych wyników w kopcu minimum i ich sumę w zmiennej: przy push dodawaj, przy pop odejmuj.'],
            input_format: ['Jeden wiersz: liczby n, s, a, b, m oraz k.'],
            output_format: ['Jedna liczba — suma S₁ + … + Sₙ.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m', '1 ≤ k ≤ 1000'],
            examples: [{ input: '5 3 2 1 10 2', note: 'Ciąg: 3, 7, 5, 1, 3. Sumy dwóch najlepszych: 3, 10, 12, 12, 12. Razem 49.' }],
            hint: R`${KOD_GEN} Potem: klub.push(x[i]); suma += x[i]; if (klub.size() > k) { suma -= klub.top(); klub.pop(); } razem += suma;. Razem może dojść do 10¹⁵ — long long.`,
            tests: () => ['1 5 0 0 10 1', '5 3 2 1 10 2', '10 1 7 3 100 20', '1000 17 31 7 1000 10', '1000000 12345 21 7 1000000 1000', '1000000 1 41 3 1000000 1', '1000000 5 21 7 1000000 500', '200000 999 33 11 1000000 1000'],
            check: (inp) => { const t = nums(inp); return t.length === 6 && dobryGen(t, 0, 1e6, 1e6) && calk(t[5], 1, 1000) ? null : 'dane'; },
            solve: (inp) => {
                const [n, s, a, b, m, k] = nums(inp);
                const x = generuj(n, s, a, b, m), klub = new PQ(wiecej);
                let suma = 0, razem = 0;
                for (let i = 0; i < n; i++) { klub.push(x[i]); suma += x[i]; if (klub.size > k) suma -= klub.pop(); razem += suma; }
                return String(razem);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m, k;
    cin >> n >> s >> a >> b >> m >> k;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    priority_queue<long long, vector<long long>, greater<long long>> klub;
    long long suma = 0, razem = 0;
    for (int i = 0; i < n; i++) {
        klub.push(x[i]);
        suma += x[i];
        if ((long long)klub.size() > k) {
            suma -= klub.top();
            klub.pop();
        }
        razem += suma;
    }
    cout << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-scal-listy', krok: 6, level: 'srednie',
            title: 'Scalanie k list',
            short: 'k posortowanych list w jedną: w kopcu po jednym kandydacie z każdej listy — {wartość, {lista, pozycja}}.',
            tags: ['scalanie list', 'para par', 'następny z tej samej listy'],
            statement: ['Masz k list liczb, każda jest posortowana niemalejąco. Scal je w jedną posortowaną listę i wypisz ją.',
                'Wrzuć do kopca minimum pierwszy element każdej niepustej listy razem z numerem listy i pozycją: {wartość, {lista, pozycja}}. Zdejmuj najmniejszy, wypisuj go i wrzucaj do kopca następny element z tej samej listy (jeśli jest). W kopcu jest zawsze najwyżej k elementów.'],
            input_format: ['W pierwszym wierszu liczba k.', 'W każdym z kolejnych k wierszy: długość listy d, a po niej d liczb posortowanych niemalejąco.'],
            output_format: ['Jeden wiersz: wszystkie liczby po scaleniu, niemalejąco.'],
            constraints: ['1 ≤ k ≤ 100', '0 ≤ d', 'Suma długości list jest od 1 do 2500.', 'Liczby są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '3\n3 1 4 9\n2 2 4\n0', note: 'Trzecia lista jest pusta. Wynik: 1 2 4 4 9.' }],
            hint: R`vector<vector<int>> L(k);. pq.push({L[i][0], {i, 0}}); dla niepustych list. Potem: auto [w, p] = pq.top(); pq.pop(); cout << w << " "; auto [i, j] = p; if (j + 1 < L[i].size()) pq.push({L[i][j + 1], {i, j + 1}});.`,
            tests: (r) => {
                const d = (L) => `${L.length}\n${L.map((l) => [l.length, ...l].join(' ')).join('\n')}`;
                const lista = (n, lo, hi) => r.arr(n, lo, hi).sort((a, b) => a - b);
                const los = (k, maxD, lo, hi) => { let L; do L = Array.from({ length: k }, () => lista(r.int(0, maxD), lo, hi)); while (!L.some((l) => l.length)); return d(L); };
                return [d([[5]]), d([[1, 2], [1, 2]]), d([[], [3], []]), los(5, 6, 0, 20), los(100, 25, -1000000, 1000000), los(2, 1200, -1000000, 1000000), los(50, 50, 0, 5), d(Array.from({ length: 100 }, (_, i) => [i]))];
            },
            check: (inp) => {
                const t = nums(inp);
                if (!calk(t[0], 1, 100)) return 'k';
                let p = 1, suma = 0;
                for (let j = 0; j < t[0]; j++) {
                    const dl = t[p++];
                    if (!calk(dl, 0, 2500)) return 'd';
                    const l = t.slice(p, p + dl);
                    p += dl; suma += dl;
                    if (!l.every((x, i) => calk(x, -1e6, 1e6) && (!i || l[i - 1] <= x))) return 'lista';
                }
                return p === t.length && suma >= 1 && suma <= 2500 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp), w = [];
                let p = 1;
                for (let j = 0; j < t[0]; j++) { const dl = t[p++]; w.push(...t.slice(p, p + dl)); p += dl; }
                return w.sort((a, b) => a - b).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    vector<vector<int>> L(k);
    for (int i = 0; i < k; i++) {
        int d;
        cin >> d;
        L[i].resize(d);
        for (int j = 0; j < d; j++) cin >> L[i][j];
    }
    priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<pair<int, pair<int, int>>>> pq;
    for (int i = 0; i < k; i++) {
        if (!L[i].empty()) pq.push({L[i][0], {i, 0}});
    }
    while (!pq.empty()) {
        auto [w, p] = pq.top();
        pq.pop();
        cout << w << " ";
        auto [i, j] = p;
        if (j + 1 < (int)L[i].size()) pq.push({L[i][j + 1], {i, j + 1}});
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-najmniejsze-sumy', krok: 6, level: 'trudne',
            title: 'Najmniejsze sumy par',
            short: 'Dwie posortowane tablice i k najmniejszych sum a_i + b_j. Kandydaci w kopcu: po zdjęciu (i, j) wchodzi (i, j + 1).',
            tags: ['kopiec kandydatów', 'scalanie wierszy', 'para par'],
            statement: ['Masz dwie tablice liczb posortowane niemalejąco: A (n liczb) i B (m liczb). Każda para pozycji (i, j) daje sumę A[i] + B[j] — razem n · m sum (równe sumy z różnych par liczą się osobno). Wypisz k najmniejszych z tych sum, rosnąco.',
                'Wszystkich sum może być 9 milionów, ale potrzebujemy tylko k. Pomyśl o każdym i jak o posortowanej liście A[i] + B[0], A[i] + B[1], … i scal te listy kopcem: na początku wrzuć {A[i] + B[0], {i, 0}} dla i < min(n, k), a po zdjęciu {suma, {i, j}} wrzuć następną sumę z tej samej listy: {A[i] + B[j + 1], {i, j + 1}}.'],
            input_format: ['W pierwszym wierszu liczby n, m i k.', 'W drugim wierszu n liczb tablicy A, w trzecim m liczb tablicy B (obie niemalejąco).'],
            output_format: ['Jeden wiersz: k najmniejszych sum rosnąco.'],
            constraints: ['1 ≤ n, m ≤ 3000', '1 ≤ k ≤ min(n · m, 2000)', 'Liczby są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '3 3 4\n1 7 11\n2 4 6', note: 'Najmniejsze sumy to 1 + 2 = 3, 1 + 4 = 5, 1 + 6 = 7 i 7 + 2 = 9.' }],
            hint: R`for (int i = 0; i < min(n, k); i++) pq.push({A[i] + B[0], {i, 0}});. Potem k razy: zdejmij wierzch, wypisz sumę, i jeśli j + 1 < m — wrzuć {A[i] + B[j + 1], {i, j + 1}}. Każdą parę (i, j) wrzucamy najwyżej raz, więc nie trzeba pamiętać, które już były.`,
            tests: (r) => {
                const d = (A, B, k) => `${A.length} ${B.length} ${k}\n${A.join(' ')}\n${B.join(' ')}`;
                const s = (n, lo, hi) => r.arr(n, lo, hi).sort((a, b) => a - b);
                return [d([1], [1], 1), d([1, 2], [3], 2), d([0, 0, 0], [0, 0], 6), d(s(10, 0, 30), s(8, 0, 30), 20), d(s(3000, 0, 1000000), s(3000, 0, 1000000), 2000), d(s(3000, 0, 5), s(3000, 0, 5), 2000), d(s(1, 0, 1000000), s(3000, 0, 1000000), 2000), d(s(3000, 0, 1000000), s(1, 0, 1000000), 2000), d(s(45, 0, 1000), s(44, 0, 1000), 1980)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m, k] = t;
                if (!calk(n, 1, 3000) || !calk(m, 1, 3000) || !calk(k, 1, Math.min(n * m, 2000)) || t.length !== n + m + 3) return 'dane';
                const A = t.slice(3, 3 + n), B = t.slice(3 + n);
                const ok = (a) => a.every((x, i) => calk(x, 0, 1e6) && (!i || a[i - 1] <= x));
                return ok(A) && ok(B) ? null : 'tablice';
            },
            solve: (inp) => {
                const t = nums(inp); const [n, m, k] = t;
                const A = t.slice(3, 3 + n), B = t.slice(3 + n);
                const pq = new PQ(wiecejKrotka), out = [];
                for (let i = 0; i < Math.min(n, k); i++) pq.push([A[i] + B[0], i, 0]);
                for (let c = 0; c < k; c++) { const [s, i, j] = pq.pop(); out.push(s); if (j + 1 < m) pq.push([A[i] + B[j + 1], i, j + 1]); }
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<int> A(n), B(m);
    for (int &x : A) cin >> x;
    for (int &x : B) cin >> x;
    priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<pair<int, pair<int, int>>>> pq;
    for (int i = 0; i < min(n, k); i++) pq.push({A[i] + B[0], {i, 0}});
    for (int c = 0; c < k; c++) {
        auto [s, p] = pq.top();
        pq.pop();
        cout << s << " ";
        auto [i, j] = p;
        if (j + 1 < m) pq.push({A[i] + B[j + 1], {i, j + 1}});
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-mediana-na-biezaco', krok: 6, level: 'srednie',
            title: 'Mediana na bieżąco',
            short: 'Dwa kopce: maksimum na mniejszą połowę, minimum na większą. Mediana leży na wierzchu dolnej połowy.',
            tags: ['dwa kopce', 'równoważenie rozmiarów', 'mediana'],
            statement: ['Liczby napływają jedna po drugiej. Po każdej nowej liczbie wypisz medianę wszystkich dotychczasowych liczb: gdyby je ustawić rosnąco, mediana stoi na środku. Przy parzystej liczbie liczb są dwie środkowe — wypisz mniejszą z nich.',
                'Trzymaj dwa kopce: dol — kopiec maksimum z mniejszą połową liczb, i gora — kopiec minimum z większą połową. Pilnuj, żeby dol miał tyle samo elementów co gora albo o jeden więcej. Wtedy mediana to zawsze dol.top().'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb w kolejności napływania.'],
            output_format: ['Jeden wiersz: n median oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '6\n5 15 1 3 8 7', note: 'Po kolei: {5} → 5; {5, 15} → 5; {1, 5, 15} → 5; {1, 3, 5, 15} → 3; {1, 3, 5, 8, 15} → 5; {1, 3, 5, 7, 8, 15} → 5.' }],
            hint: R`if (dol.empty() || x <= dol.top()) dol.push(x); else gora.push(x);. Potem równoważenie: if (dol.size() > gora.size() + 1) { gora.push(dol.top()); dol.pop(); } else if (gora.size() > dol.size()) { dol.push(gora.top()); gora.pop(); }. Wypisz dol.top().`,
            tests: (r) => [d1([7]), d1([1, 2]), d1([2, 1]), d1([3, 3, 3, 3]), d1(r.arr(15, -10, 10)), d1(r.arr(3000, -1000000, 1000000)), d1(Array.from({ length: 300 }, (_, i) => i)), d1(Array.from({ length: 300 }, (_, i) => 300 - i)), d1(r.arr(3000, 0, 2))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const dol = new PQ(mniej), gora = new PQ(wiecej), out = [];
                for (const x of nums(inp).slice(1)) {
                    if (dol.empty() || x <= dol.top()) dol.push(x); else gora.push(x);
                    if (dol.size > gora.size + 1) gora.push(dol.pop()); else if (gora.size > dol.size) dol.push(gora.pop());
                    out.push(dol.top());
                }
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<int> dol;
    priority_queue<int, vector<int>, greater<int>> gora;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (dol.empty() || x <= dol.top()) dol.push(x);
        else gora.push(x);
        if (dol.size() > gora.size() + 1) {
            gora.push(dol.top());
            dol.pop();
        } else if (gora.size() > dol.size()) {
            dol.push(gora.top());
            gora.pop();
        }
        cout << dol.top() << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-dwie-polowy', krok: 6, level: 'srednie',
            title: 'Dwie połowy',
            short: 'Te same dwa kopce, ale zamiast mediany — różnica sum górnej i dolnej połowy. Sumy poprawiane przy każdym przerzuceniu.',
            tags: ['dwa kopce', 'sumy połówek', 'long long'],
            statement: ['Liczby napływają jedna po drugiej. Po każdej nowej liczbie podziel wszystkie dotychczasowe liczby na dwie połowy: dolną — ⌈i/2⌉ najmniejszych — i górną — ⌊i/2⌋ największych (przy nieparzystej liczbie liczb środkowa trafia do dolnej połowy). Wypisz sumę górnej połowy minus sumę dolnej.',
                'Użyj dwóch kopców jak przy medianie i trzymaj sumę każdego z nich w osobnej zmiennej. Każde wrzucenie, zdjęcie i przerzucenie między kopcami musi poprawić odpowiednią sumę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jeden wiersz: n różnic oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od 0 do 10⁷.'],
            examples: [{ input: '5\n4 1 9 2 6', note: 'Po kolei: {4} → 0 − 4 = −4; {1 | 4} → 4 − 1 = 3; {1, 4 | 9} → 9 − 5 = 4; {1, 2 | 4, 9} → 13 − 3 = 10; {1, 2, 4 | 6, 9} → 15 − 7 = 8.' }],
            hint: R`long long sDol = 0, sGora = 0;. Przy dol.push(x): sDol += x. Przy przerzuceniu z dol do gora: int y = dol.top(); dol.pop(); sDol -= y; gora.push(y); sGora += y;. Wynik: sGora - sDol. Sumy tysięcy liczb do 10⁷ nie mieszczą się w int.`,
            tests: (r) => [d1([7]), d1([1, 2]), d1([5, 5, 5]), d1(r.arr(15, 0, 20)), d1(r.arr(2000, 0, 10000000)), d1(Array.from({ length: 300 }, (_, i) => i * 1000)), d1(r.arr(2000, 9999000, 10000000)), d1(r.arr(500, 0, 1))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e7)) ? null : 'dane'; },
            solve: (inp) => {
                const dol = new PQ(mniej), gora = new PQ(wiecej), out = [];
                let sd = 0, sg = 0;
                for (const x of nums(inp).slice(1)) {
                    if (dol.empty() || x <= dol.top()) { dol.push(x); sd += x; } else { gora.push(x); sg += x; }
                    if (dol.size > gora.size + 1) { const y = dol.pop(); sd -= y; gora.push(y); sg += y; } else if (gora.size > dol.size) { const y = gora.pop(); sg -= y; dol.push(y); sd += y; }
                    out.push(sg - sd);
                }
                return out.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<int> dol;
    priority_queue<int, vector<int>, greater<int>> gora;
    long long sDol = 0, sGora = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (dol.empty() || x <= dol.top()) {
            dol.push(x);
            sDol += x;
        } else {
            gora.push(x);
            sGora += x;
        }
        if (dol.size() > gora.size() + 1) {
            int y = dol.top();
            dol.pop();
            sDol -= y;
            gora.push(y);
            sGora += y;
        } else if (gora.size() > dol.size()) {
            int y = gora.top();
            gora.pop();
            sGora -= y;
            dol.push(y);
            sDol += y;
        }
        cout << sGora - sDol << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-mediana-szybko', krok: 6, level: 'trudne',
            title: 'Mediana miliona liczb',
            short: 'Milion liczb z generatora i mediana po każdej. Wstawianie do posortowanego vectora nie zdąży — dwa kopce tak.',
            tags: ['generator danych', 'dwa kopce', 'O(n log n)'],
            statement: ['Liczby generujesz sam: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m (w long long). Po każdej liczbie xᵢ policz medianę liczb x₁, …, xᵢ (przy parzystej liczbie liczb — mniejszą z dwóch środkowych) i wypisz sumę wszystkich n median.',
                'Liczb jest milion. Wstawianie każdej liczby we właściwe miejsce posortowanego vectora przesuwa średnio pół miliona elementów — razem setki miliardów kroków. Dwa kopce z poprzedniego ćwiczenia robią to samo w kilkudziesięciu krokach na liczbę.'],
            input_format: ['Jeden wiersz: liczby n, s, a, b, m.'],
            output_format: ['Jedna liczba — suma median.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 5 3 1 17', note: 'Ciąg: 5, 16, 15, 12, 3, 10. Mediany: 5, 5, 15, 12, 12, 10. Suma 59.' }],
            hint: R`${KOD_GEN} Dalej jak w „Mediana na bieżąco”, tylko zamiast wypisywać dol.top() dodaj go do sumy (long long — nawet 10¹⁵).`,
            tests: () => ['1 7 0 0 10', '6 5 3 1 17', '100 1 7 3 1000', '1000000 12345 48271 0 999999937', '1000000 1 16807 11 1000000000', '1000000 999 69621 3 999999937', '700000 5 21 7 1000000'],
            check: (inp) => (nums(inp).length === 5 && dobryGen(nums(inp), 0, 1e6, 1e9) ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m), dol = new PQ(mniej), gora = new PQ(wiecej);
                let suma = 0;
                for (let i = 0; i < n; i++) {
                    const v = x[i];
                    if (dol.empty() || v <= dol.top()) dol.push(v); else gora.push(v);
                    if (dol.size > gora.size + 1) gora.push(dol.pop()); else if (gora.size > dol.size) dol.push(gora.pop());
                    suma += dol.top();
                }
                return String(suma);
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
    priority_queue<long long> dol;
    priority_queue<long long, vector<long long>, greater<long long>> gora;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        if (dol.empty() || x[i] <= dol.top()) dol.push(x[i]);
        else gora.push(x[i]);
        if (dol.size() > gora.size() + 1) {
            gora.push(dol.top());
            dol.pop();
        } else if (gora.size() > dol.size()) {
            dol.push(gora.top());
            gora.pop();
        }
        suma += dol.top();
    }
    cout << suma << "\n";
    return 0;
}`,
        },
    ];
};
