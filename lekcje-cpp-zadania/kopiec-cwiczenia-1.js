// Kopiec — ćwiczenia w trakcie lekcji, części 1–3: pierwszy kopiec (priority_queue: push, top, pop, size, empty,
// wyjmowanie od największego, powtórzenia, kopia kopca, porównanie z kolejką i stosem), kopiec minimum (greater,
// sztuczka z minusem, kopiec napisów, łączenie dwóch najmniejszych) oraz kopiec binarny w tablicy (rodzic i dzieci,
// wysokość, poziomy, warunek kopca, przesiewanie w górę i w dół, własny kopiec, sortowanie przez kopcowanie).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kopiec-pomoc');
    const { calk, SLOWA, IMIONA, PQ, wiecej, tPush, tPop, wDol, czyKopiec, poziomy } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const d1 = (a) => `${a.length}\n${a.join(' ')}`;
    const malejaco = (a) => a.slice().sort((x, y) => y - x);
    const rosnaco = (a) => a.slice().sort((x, y) => x - y);
    const czyMale = (s, max = 15) => new RegExp(`^[a-z]{1,${max}}$`).test(s);

    return [
        // ================================================================ KROK 1 · pierwszy kopiec
        {
            id: 'kop-od-najwiekszej', krok: 1, level: 'latwe',
            title: 'Od największej do najmniejszej',
            short: 'Wszystkie liczby do priority_queue, a potem top i pop, dopóki coś zostało — wyjdą od największej. Powtórzenia też.',
            tags: ['push', 'while (!pq.empty())', 'top i pop'],
            statement: ['Wczytaj n liczb całkowitych i wrzuć każdą do kopca priority_queue<int> poleceniem push.',
                'Potem wyjmuj liczby z kopca, dopóki nie jest pusty: wypisz liczbę z wierzchu (top) i usuń ją (pop). Kopiec zawsze oddaje największą liczbę, jaka w nim jest, więc liczby wyjdą od największej do najmniejszej. Liczby, które się powtarzają, wychodzą tyle razy, ile razy je wrzucono.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb od największej do najmniejszej, oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '6\n5 9 1 7 9 3', note: 'Największa jest 9 — i to dwa razy, więc wychodzi dwa razy z rzędu. Potem 7, 5, 3 i na końcu 1.' }],
            hint: R`priority_queue<int> pq; i w pętli: cin >> x; pq.push(x);. Potem while (!pq.empty()) { cout << pq.top() << " "; pq.pop(); }. Najpierw top (odczyt), dopiero potem pop (usunięcie) — pop niczego nie oddaje.`,
            tests: (r) => [d1([7]), d1([2, 1]), d1([1, 2]), d1([4, 4, 4]), d1([-5, 3, -1, 2, 0]), d1(r.arr(10, -9, 9)), d1(r.arr(2000, -1000000, 1000000)),
                d1(Array.from({ length: 60 }, (_, i) => i + 1)), d1(r.arr(500, 1, 20))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => malejaco(nums(inp).slice(1)).join(' '),
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
    while (!pq.empty()) {
        cout << pq.top() << " ";
        pq.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-na-wierzchu', krok: 1, level: 'latwe',
            title: 'Co leży na wierzchu',
            short: 'Po każdej wrzuconej liczbie zajrzyj na wierzch: top() pokazuje największą z dotychczasowych i niczego nie zabiera.',
            tags: ['push', 'top po każdej zmianie', 'top nie usuwa'],
            statement: ['Wczytuj kolejno n liczb i każdą wrzucaj do kopca priority_queue<int>. Zaraz po każdym wrzuceniu wypisz, jaka liczba leży na wierzchu kopca (top).',
                'Nie usuwaj niczego z kopca — top() tylko pokazuje wierzch. Na wierzchu zawsze leży największa z liczb wrzuconych do tej pory.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb — wierzch kopca po każdym wrzuceniu, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '6\n3 1 4 1 5 9', note: 'Po trójce na wierzchu jest 3. Jedynka jest mniejsza, więc wierzch się nie zmienia. Czwórka wskakuje na wierzch, potem 5 i 9.' }],
            hint: R`W pętli: cin >> x; pq.push(x); cout << pq.top() << " ";. Kopca nie trzeba opróżniać — wystarczy zaglądać na wierzch po każdym push.`,
            tests: (r) => [d1([5]), d1([1, 2, 3]), d1([3, 2, 1]), d1([-4, -8, -2, -9]), d1(r.arr(12, 1, 30)), d1(r.arr(2000, -1000000, 1000000)), d1(r.arr(300, 0, 5))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => { let m = -Infinity; return nums(inp).slice(1).map((x) => (m = Math.max(m, x))).join(' '); },
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
        cout << pq.top() << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-podium', krok: 1, level: 'latwe',
            title: 'Podium',
            short: 'Trzy najlepsze wyniki z zawodów: trzy razy top i pop — ale tylko wtedy, gdy kopiec nie jest pusty.',
            tags: ['pop k razy', 'empty przed top', 'remisy'],
            statement: ['Na zawodach startowało n zawodników, a każdy zdobył pewną liczbę punktów. Wypisz trzy najwyższe wyniki, od najwyższego — złoto, srebro i brąz.',
                'Wrzuć wszystkie wyniki do kopca priority_queue<int>, a potem wyjmij z niego trzy razy element z wierzchu. Jeśli zawodników jest mniej niż trzech, wypisz tyle wyników, ilu było zawodników — zanim zajrzysz na wierzch, sprawdź, czy kopiec nie jest pusty. Równe wyniki wypisujemy osobno, tak jak w kopcu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — wyniki zawodników.'],
            output_format: ['Jeden wiersz: trzy najwyższe wyniki (albo wszystkie, jeśli jest ich mniej) od najwyższego, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', 'Wyniki są liczbami całkowitymi od 0 do 10⁶.'],
            examples: [{ input: '5\n12 7 30 7 18', note: 'Najwyższy wynik to 30, potem 18 i 12. Siódemki się nie załapały.' },
                { input: '2\n5 5', note: 'Dwóch zawodników, obaj po 5 punktów — wypisujemy oba wyniki.' }],
            hint: R`for (int i = 0; i < 3; i++) { if (pq.empty()) break; cout << pq.top() << " "; pq.pop(); }. Bez sprawdzenia empty() program z jednym zawodnikiem sięgnąłby do pustego kopca.`,
            tests: (r) => [d1([42]), d1([0, 0]), d1([1, 2, 3]), d1([9, 9, 9, 9]), d1(r.arr(10, 0, 50)), d1(r.arr(1000, 0, 1000000)), d1(r.arr(200, 0, 3)), d1([5, 1000000])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => malejaco(nums(inp).slice(1)).slice(0, 3).join(' '),
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
    for (int i = 0; i < 3; i++) {
        if (pq.empty()) break;
        cout << pq.top() << " ";
        pq.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-polecenia', krok: 1, level: 'latwe',
            title: 'Polecenia dla kopca',
            short: 'DODAJ, WIERZCH, ZABIERZ i ILE — wszystkie polecenia kopca naraz, a przy pustym kopcu odpowiedź PUSTO zamiast błędu.',
            tags: ['polecenia', 'pusty kopiec', 'size'],
            statement: ['Masz pusty kopiec priority_queue<int>. Wykonaj po kolei q poleceń:',
                'DODAJ x — wrzuć liczbę x do kopca (nic nie wypisuj); WIERZCH — wypisz liczbę z wierzchu kopca; ZABIERZ — wypisz liczbę z wierzchu i usuń ją z kopca; ILE — wypisz, ile liczb jest w kopcu.',
                'Jeśli przy poleceniu WIERZCH albo ZABIERZ kopiec jest pusty, wypisz słowo PUSTO i niczego nie zmieniaj.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia WIERZCH, ZABIERZ i ILE jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ q ≤ 2000', 'W poleceniu DODAJ liczba x jest z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '9\nDODAJ 5\nDODAJ 8\nWIERZCH\nDODAJ 3\nZABIERZ\nZABIERZ\nILE\nZABIERZ\nZABIERZ', note: 'Na wierzchu najpierw 8. ZABIERZ wypisuje i usuwa 8, potem 5. Zostaje sama trójka (ILE daje 1), po jej zabraniu kopiec jest pusty — ostatnie ZABIERZ wypisuje PUSTO.' }],
            hint: R`string p; cin >> p; if (p == "DODAJ") { cin >> x; pq.push(x); } else if (p == "WIERZCH") { if (pq.empty()) cout << "PUSTO\n"; else cout << pq.top() << "\n"; } … Przy ZABIERZ: najpierw wypisz top(), potem pop().`,
            tests: (r) => {
                const los = (q, pDod) => {
                    const L = [];
                    for (let i = 0; i < q; i++) {
                        const u = r();
                        if (u < pDod) L.push(`DODAJ ${r.int(-1000000, 1000000)}`);
                        else L.push(r.pick(['WIERZCH', 'ZABIERZ', 'ZABIERZ', 'ILE']));
                    }
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nWIERZCH', '3\nZABIERZ\nILE\nDODAJ 7', '5\nDODAJ -3\nDODAJ -1\nWIERZCH\nZABIERZ\nWIERZCH', los(30, 0.5), los(200, 0.4), los(2000, 0.55), los(2000, 0.3)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => /^(WIERZCH|ZABIERZ|ILE)$/.test(l) || (/^DODAJ -?\d+$/.test(l) && calk(Number(l.split(' ')[1]), -1e6, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const pq = new PQ(), out = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, x] = l.split(' ');
                    if (p === 'DODAJ') pq.push(Number(x));
                    else if (p === 'ILE') out.push(pq.size);
                    else if (pq.empty()) out.push('PUSTO');
                    else { out.push(pq.top()); if (p === 'ZABIERZ') pq.pop(); }
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    priority_queue<int> pq;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            int x;
            cin >> x;
            pq.push(x);
        } else if (p == "ILE") {
            cout << pq.size() << "\n";
        } else if (pq.empty()) {
            cout << "PUSTO\n";
        } else {
            cout << pq.top() << "\n";
            if (p == "ZABIERZ") pq.pop();
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-stan-po-kazdym', krok: 1, level: 'srednie',
            title: 'Cały kopiec po każdym poleceniu',
            short: 'Do środka kopca nie zajrzysz — ale jego kopię możesz opróżnić. Po każdym poleceniu wypisz całą zawartość od największej.',
            tags: ['kopia kopca', 'brak indeksów', 'funkcja z kopią'],
            statement: ['Masz pusty kopiec priority_queue<int> i q poleceń: DODAJ x — wrzuć x do kopca; ZABIERZ — usuń liczbę z wierzchu (jeśli kopiec jest pusty, nic się nie dzieje).',
                'Po każdym poleceniu wypisz w osobnym wierszu całą zawartość kopca od największej do najmniejszej liczby albo słowo pusty, jeśli kopiec jest pusty.',
                'Kopiec nie ma indeksów ani pętli po elementach, więc żeby wypisać zawartość i jej nie stracić, zrób kopię (priority_queue<int> kopia = pq;) i opróżnij kopię. Oryginał zostaje nietknięty.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie: DODAJ x albo ZABIERZ.'],
            output_format: ['q wierszy — zawartość kopca po każdym poleceniu (liczby oddzielone spacjami) albo słowo pusty.'],
            constraints: ['1 ≤ q ≤ 60', 'W poleceniu DODAJ liczba x jest z przedziału od 1 do 99.'],
            examples: [{ input: '5\nDODAJ 4\nDODAJ 9\nDODAJ 4\nZABIERZ\nZABIERZ', note: 'Po trzech DODAJ kopiec zawiera 9, 4 i 4. Pierwsze ZABIERZ usuwa dziewiątkę, drugie — jedną z czwórek.' }],
            hint: R`Napisz funkcję void wypisz(priority_queue<int> k) — bez &, więc dostaje kopię: while (!k.empty()) { cout << k.top() << " "; k.pop(); }. Jeśli od razu k.empty(), wypisz pusty. Wywołuj ją po każdym poleceniu.`,
            tests: (r) => {
                const los = (q, pDod) => {
                    const L = [];
                    for (let i = 0; i < q; i++) L.push(r() < pDod ? `DODAJ ${r.int(1, 99)}` : 'ZABIERZ');
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nZABIERZ', '2\nDODAJ 7\nZABIERZ', '4\nDODAJ 1\nDODAJ 2\nDODAJ 3\nDODAJ 3', los(20, 0.6), los(60, 0.75), los(60, 0.5), los(60, 1)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 60) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'ZABIERZ' || (/^DODAJ \d+$/.test(l) && calk(Number(l.split(' ')[1]), 1, 99))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const pq = new PQ(), out = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, x] = l.split(' ');
                    if (p === 'DODAJ') pq.push(Number(x));
                    else if (!pq.empty()) pq.pop();
                    out.push(pq.empty() ? 'pusty' : pq.posortowane().join(' '));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(priority_queue<int> k) {
    if (k.empty()) {
        cout << "pusty\n";
        return;
    }
    while (!k.empty()) {
        cout << k.top() << " ";
        k.pop();
    }
    cout << "\n";
}
int main() {
    int q;
    cin >> q;
    priority_queue<int> pq;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            int x;
            cin >> x;
            pq.push(x);
        } else if (!pq.empty()) {
            pq.pop();
        }
        wypisz(pq);
    }
    return 0;
}`,
        },
        {
            id: 'kop-suma-k-najwiekszych', krok: 1, level: 'srednie',
            title: 'Suma k największych',
            short: 'Wrzuć wszystko do kopca i zdejmij k razy — suma tych liczb potrzebuje long long.',
            tags: ['pop k razy', 'long long', 'suma'],
            statement: ['Wczytaj n liczb naturalnych i liczbę k. Policz sumę k największych spośród nich (jeśli największa liczba występuje kilka razy, każde wystąpienie liczy się osobno).',
                'Wrzuć liczby do kopca priority_queue<int> i k razy zdejmij wierzch, dodając go do sumy. Uważaj na typ sumy: tysiące liczb rzędu miliarda nie mieszczą się w int.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jedna liczba — suma k największych liczb.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', 'Liczby są z przedziału od 0 do 10⁹.'],
            examples: [{ input: '6 3\n4 10 2 10 7 1', note: 'Trzy największe to 10, 10 i 7 — razem 27.' }],
            hint: R`long long suma = 0; for (int i = 0; i < k; i++) { suma += pq.top(); pq.pop(); }. Skoro k ≤ n, kopiec nie zrobi się pusty przed czasem.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d([5], 1), d([1, 2, 3], 3), d([0, 0, 0, 1], 2), d(r.arr(20, 0, 100), 7), d(r.arr(5000, 0, 1000000000), 5000), d(r.arr(5000, 900000000, 1000000000), 4000), d(r.arr(3000, 0, 9), 1), d(r.arr(100, 1, 1000000000), 50)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); return String(malejaco(t.slice(2)).slice(0, t[1]).reduce((a, b) => a + b, 0)); },
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
    long long suma = 0;
    for (int i = 0; i < k; i++) {
        suma += pq.top();
        pq.pop();
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-trzy-pojemniki', krok: 1, level: 'srednie',
            title: 'Kolejka, stos i kopiec',
            short: 'Te same liczby trafiają do queue, stack i priority_queue. Kolejka oddaje najstarszą, stos — najnowszą, a kopiec — największą.',
            tags: ['queue, stack, priority_queue', 'front i top', 'kolejność wychodzenia'],
            statement: ['Wczytaj n liczb i każdą wrzuć do trzech pojemników naraz: do kolejki queue<int>, do stosu stack<int> i do kopca priority_queue<int>.',
                'Potem opróżnij po kolei każdy pojemnik, wypisując liczby w kolejności, w jakiej z niego wychodzą. Kolejka oddaje najpierw liczbę, która czeka najdłużej (front), stos — tę wrzuconą ostatnio (top), a kopiec — największą (top).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy wiersze: kolejka: …, stos: … oraz kopiec: … — liczby w kolejności wychodzenia, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 500', 'Liczby są z przedziału od 0 do 10⁴.'],
            examples: [{ input: '5\n3 8 1 8 5', note: 'Kolejka oddaje liczby w kolejności wejścia, stos od końca, a kopiec od największej: 8 8 5 3 1.' }],
            hint: R`queue<int> q; stack<int> s; priority_queue<int> pq; — w pętli trzy razy push. Kolejkę opróżniasz przez front() i pop(), stos i kopiec przez top() i pop(). Zwróć uwagę: w kolejce wierzch nazywa się front, a w stosie i kopcu — top.`,
            tests: (r) => [d1([1]), d1([1, 2]), d1([2, 1, 3]), d1([7, 7, 7]), d1(r.arr(15, 0, 20)), d1(r.arr(500, 0, 10000)), d1(Array.from({ length: 30 }, (_, i) => 30 - i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 500) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e4)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1);
                return [`kolejka: ${a.join(' ')}`, `stos: ${a.slice().reverse().join(' ')}`, `kopiec: ${malejaco(a).join(' ')}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    queue<int> q;
    stack<int> s;
    priority_queue<int> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        q.push(x);
        s.push(x);
        pq.push(x);
    }
    cout << "kolejka:";
    while (!q.empty()) {
        cout << " " << q.front();
        q.pop();
    }
    cout << "\nstos:";
    while (!s.empty()) {
        cout << " " << s.top();
        s.pop();
    }
    cout << "\nkopiec:";
    while (!pq.empty()) {
        cout << " " << pq.top();
        pq.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-ile-razy', krok: 1, level: 'srednie',
            title: 'Ile razy, od największej',
            short: 'Równe liczby wychodzą z kopca jedna za drugą. Zliczaj je w trakcie wyjmowania: wartość i liczba powtórzeń, od największej.',
            tags: ['powtórzenia', 'porównanie z poprzednią', 'top i pop'],
            statement: ['Wczytaj n liczb. Wypisz każdą różną wartość, która wystąpiła, razem z liczbą jej wystąpień — od największej wartości do najmniejszej.',
                'Wrzuć liczby do kopca priority_queue<int>. Gdy będziesz je wyjmować, równe liczby wyjdą jedna po drugiej, więc wystarczy liczyć, ile razy z rzędu wyszła ta sama wartość. Nie używaj tablicy liczników ani mapy — ćwiczymy kopiec.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dla każdej różnej wartości, od największej, jeden wiersz: wartość i liczba jej wystąpień, oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od −100 do 100.'],
            examples: [{ input: '7\n4 9 4 1 9 9 2', note: 'Dziewiątka wychodzi trzy razy z rzędu, potem dwie czwórki, dwójka i jedynka.' }],
            hint: R`int x = pq.top(); pq.pop(); int ile = 1; while (!pq.empty() && pq.top() == x) { pq.pop(); ile++; } cout << x << " " << ile << "\n"; — a to wszystko w pętli while (!pq.empty()). Warunek !pq.empty() musi być przed pq.top().`,
            tests: (r) => [d1([5]), d1([3, 3]), d1([-1, 1]), d1([2, 2, 1, 1, 2]), d1(r.arr(12, 1, 4)), d1(r.arr(2000, -100, 100)), d1(r.arr(2000, 0, 3)), d1(Array.from({ length: 201 }, (_, i) => i - 100))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -100, 100)) ? null : 'dane'; },
            solve: (inp) => {
                const m = new Map();
                for (const x of nums(inp).slice(1)) m.set(x, (m.get(x) || 0) + 1);
                return malejaco([...m.keys()]).map((x) => `${x} ${m.get(x)}`).join('\n');
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
    while (!pq.empty()) {
        int x = pq.top();
        pq.pop();
        int ile = 1;
        while (!pq.empty() && pq.top() == x) {
            pq.pop();
            ile++;
        }
        cout << x << " " << ile << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 2 · kopiec minimum
        {
            id: 'kop-od-najmniejszej', krok: 2, level: 'latwe',
            title: 'Od najmniejszej do największej',
            short: 'Kopiec minimum: priority_queue<int, vector<int>, greater<int>> — na wierzchu najmniejsza, więc liczby wychodzą rosnąco.',
            tags: ['greater<int>', 'kopiec minimum', 'opróżnianie'],
            statement: ['Wczytaj n liczb całkowitych i wypisz je od najmniejszej do największej.',
                'Użyj kopca minimum: priority_queue<int, vector<int>, greater<int>>. W takim kopcu na wierzchu leży zawsze najmniejsza liczba, więc wystarczy go opróżnić tak samo jak zwykły kopiec — top, pop, dopóki nie jest pusty. (Możesz też użyć zwykłego kopca i sztuczki z minusem: wrzucaj −x, a przy wyjmowaniu wypisuj −top().)'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb od najmniejszej do największej, oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '6\n5 -2 9 1 -2 7', note: 'Najmniejsza jest −2 (dwa razy), potem 1, 5, 7 i 9.' }],
            hint: R`priority_queue<int, vector<int>, greater<int>> pq; — reszta jak w zwykłym kopcu: push w pętli, a potem while (!pq.empty()) { cout << pq.top() << " "; pq.pop(); }.`,
            tests: (r) => [d1([3]), d1([2, 1]), d1([-1000000000, 1000000000, 0]), d1([6, 6, 6]), d1(r.arr(15, -20, 20)), d1(r.arr(2000, -1000000000, 1000000000)), d1(Array.from({ length: 50 }, (_, i) => 50 - i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => rosnaco(nums(inp).slice(1)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    while (!pq.empty()) {
        cout << pq.top() << " ";
        pq.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-k-ta-najmniejsza', krok: 2, level: 'latwe',
            title: 'k-ta najmniejsza',
            short: 'Z kopca minimum zdejmij k − 1 najmniejszych — na wierzchu zostanie k-ta. Powtórzenia liczą się osobno.',
            tags: ['kopiec minimum', 'pop k − 1 razy', 'top'],
            statement: ['Wczytaj n liczb i liczbę k. Wypisz k-tą najmniejszą liczbę, czyli tę, która stałaby na k-tym miejscu, gdyby ustawić wszystkie liczby od najmniejszej do największej (równe liczby zajmują osobne miejsca).',
                'Wrzuć liczby do kopca minimum, zdejmij z niego k − 1 razy wierzch, a potem wypisz liczbę, która jest na wierzchu.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — k-ta najmniejsza.'],
            constraints: ['1 ≤ k ≤ n ≤ 5000', 'Liczby są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '6 3\n7 2 9 2 5 1', note: 'Po kolei: 1, 2, 2, 5, 7, 9. Trzecia jest druga dwójka.' }],
            hint: R`for (int i = 0; i < k - 1; i++) pq.pop(); cout << pq.top();. Kopiec ma n ≥ k elementów, więc po k − 1 zdjęciach na pewno coś na nim zostaje.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d([4], 1), d([3, 1, 2], 3), d([5, 5, 5, 1], 2), d(r.arr(20, -10, 10), 10), d(r.arr(5000, -1000000000, 1000000000), 2500), d(r.arr(5000, 1, 3), 4000), d(r.arr(300, 0, 1000), 1), d(r.arr(300, 0, 1000), 300)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 5000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); return String(rosnaco(t.slice(2))[t[1] - 1]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
    }
    for (int i = 0; i < k - 1; i++) pq.pop();
    cout << pq.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-slownik', krok: 2, level: 'latwe',
            title: 'Słownik w dwie strony',
            short: 'Kopiec napisów: zwykły oddaje słowo najpóźniejsze w alfabecie, a kopiec minimum — najwcześniejsze.',
            tags: ['priority_queue<string>', 'greater<string>', 'porządek alfabetyczny'],
            statement: ['Wczytaj n słów zapisanych małymi literami. W pierwszym wierszu wypisz je w kolejności alfabetycznej, a w drugim — w odwrotnej.',
                'Napisy porównują się jak w słowniku, więc kopiec napisów też działa: zwykły priority_queue<string> oddaje najpierw słowo, które w słowniku stoi najdalej, a kopiec minimum priority_queue<string, vector<string>, greater<string>> — to, które stoi najbliżej początku. Użyj dwóch kopców. Powtórzone słowa wypisuj tyle razy, ile wystąpiły.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów oddzielonych spacjami.'],
            output_format: ['Dwa wiersze: słowa alfabetycznie i słowa w odwrotnej kolejności alfabetycznej.'],
            constraints: ['1 ≤ n ≤ 300', 'Słowa mają od 1 do 10 małych liter (bez polskich znaków).'],
            examples: [{ input: '5\nkot pies ala kotek ala', note: 'Krótsze słowo, które jest początkiem dłuższego, stoi w słowniku wcześniej: kot przed kotek.' }],
            hint: R`priority_queue<string, vector<string>, greater<string>> rosn; priority_queue<string> mal; — każde słowo do obu. Potem opróżnij najpierw jeden, wypisz "\n", a potem drugi.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const sl = () => (r() < 0.5 ? r.pick(SLOWA).toLowerCase() : r.word(r.int(1, 10)));
                return [d(['a']), d(['b', 'a']), d(['ab', 'a', 'abc', 'b']), d(['zzz', 'zz', 'z']), d(Array.from({ length: 20 }, sl)), d(Array.from({ length: 300 }, sl)), d(Array.from({ length: 50 }, () => r.word(r.int(1, 2), 'ab')))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 300) && t.length === n + 1 && t.slice(1).every((s) => czyMale(s, 10)) ? null : 'dane'; },
            solve: (inp) => { const a = toks(inp).slice(1).sort(); return a.join(' ') + '\n' + a.slice().reverse().join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<string, vector<string>, greater<string>> rosn;
    priority_queue<string> mal;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        rosn.push(s);
        mal.push(s);
    }
    while (!rosn.empty()) {
        cout << rosn.top() << " ";
        rosn.pop();
    }
    cout << "\n";
    while (!mal.empty()) {
        cout << mal.top() << " ";
        mal.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-numerki', krok: 2, level: 'latwe',
            title: 'Numerki w urzędzie',
            short: 'Petenci przychodzą z numerkami w dowolnej kolejności, a urzędnik woła zawsze najmniejszy czekający numer.',
            tags: ['kopiec minimum', 'polecenia', 'nikt nie czeka'],
            statement: ['W urzędzie każdy petent pobiera numerek, ale przychodzi do poczekalni o różnych porach, więc numerki pojawiają się w dowolnej kolejności. Urzędnik zawsze woła najmniejszy numer spośród osób, które teraz czekają.',
                'Wykonaj q zdarzeń: PRZYCHODZI x — do poczekalni wchodzi osoba z numerkiem x; WOLA — urzędnik woła osobę z najmniejszym numerkiem: wypisz ten numer, a osoba wychodzi z poczekalni. Jeśli nikt nie czeka, wypisz nikt.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno zdarzenie: PRZYCHODZI x albo WOLA.'],
            output_format: ['Dla każdego zdarzenia WOLA jeden wiersz: wywołany numer albo słowo nikt.'],
            constraints: ['1 ≤ q ≤ 3000', 'Numerki są różnymi liczbami naturalnymi od 1 do 10⁶.'],
            examples: [{ input: '7\nPRZYCHODZI 17\nPRZYCHODZI 4\nWOLA\nPRZYCHODZI 9\nWOLA\nWOLA\nWOLA', note: 'Najpierw czekają 17 i 4 — wołany jest numer 4. Potem przychodzi 9, więc kolejne wołania to 9 i 17. Na koniec poczekalnia jest pusta.' }],
            hint: R`priority_queue<int, vector<int>, greater<int>> poczekalnia;. Przy WOLA: if (poczekalnia.empty()) cout << "nikt\n"; else { cout << poczekalnia.top() << "\n"; poczekalnia.pop(); }.`,
            tests: (r) => {
                const los = (q, pPrzyjscie) => {
                    const uzyte = new Set(), L = [];
                    for (let i = 0; i < q; i++) {
                        if (r() < pPrzyjscie) { let x; do x = r.int(1, 1000000); while (uzyte.has(x)); uzyte.add(x); L.push(`PRZYCHODZI ${x}`); } else L.push('WOLA');
                    }
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nWOLA', '2\nPRZYCHODZI 5\nWOLA', '4\nPRZYCHODZI 3\nPRZYCHODZI 2\nPRZYCHODZI 1\nWOLA', los(30, 0.6), los(3000, 0.5), los(3000, 0.7), los(500, 0.3)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                const uzyte = new Set();
                for (const l of L.slice(1)) {
                    if (l === 'WOLA') continue;
                    const m = l.match(/^PRZYCHODZI (\d+)$/);
                    if (!m || !calk(Number(m[1]), 1, 1e6) || uzyte.has(m[1])) return 'zdarzenie';
                    uzyte.add(m[1]);
                }
                return null;
            },
            solve: (inp) => {
                const pq = new PQ(wiecej), out = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'WOLA') out.push(pq.empty() ? 'nikt' : pq.pop());
                    else pq.push(Number(l.split(' ')[1]));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    priority_queue<int, vector<int>, greater<int>> poczekalnia;
    for (int i = 0; i < q; i++) {
        string z;
        cin >> z;
        if (z == "PRZYCHODZI") {
            int x;
            cin >> x;
            poczekalnia.push(x);
        } else if (poczekalnia.empty()) {
            cout << "nikt\n";
        } else {
            cout << poczekalnia.top() << "\n";
            poczekalnia.pop();
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-wolne-miejsca', krok: 2, level: 'srednie',
            title: 'Wolne miejsca w kinie',
            short: 'Rezerwacja daje zawsze najmniejszy wolny numer miejsca, a zwolnione miejsca wracają do kopca minimum.',
            tags: ['kopiec minimum', 'wracanie do kopca', 'brak miejsc'],
            statement: ['W kinie jest n miejsc ponumerowanych od 1 do n i na początku wszystkie są wolne. System rezerwacji obsługuje q poleceń:',
                'REZERWUJ — zajmij wolne miejsce o najmniejszym numerze i wypisz ten numer; jeśli wszystkie miejsca są zajęte, wypisz brak. ZWOLNIJ x — miejsce x (na pewno teraz zajęte) staje się znowu wolne; nic nie wypisuj.',
                'Trzymaj numery wolnych miejsc w kopcu minimum. Na początku wrzuć do niego wszystkie numery od 1 do n.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy jedno polecenie: REZERWUJ albo ZWOLNIJ x.'],
            output_format: ['Dla każdego polecenia REZERWUJ jeden wiersz: numer miejsca albo słowo brak.'],
            constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ q ≤ 3000', 'W poleceniu ZWOLNIJ x miejsce x jest w tej chwili zajęte.'],
            examples: [{ input: '3 7\nREZERWUJ\nREZERWUJ\nREZERWUJ\nREZERWUJ\nZWOLNIJ 2\nREZERWUJ\nREZERWUJ', note: 'Trzy rezerwacje dają miejsca 1, 2 i 3, czwarta — brak. Po zwolnieniu dwójki następna rezerwacja dostaje miejsce 2, a kolejna znowu brak.' }],
            hint: R`for (int i = 1; i <= n; i++) wolne.push(i);. REZERWUJ: if (wolne.empty()) cout << "brak\n"; else { cout << wolne.top() << "\n"; wolne.pop(); }. ZWOLNIJ: wolne.push(x);.`,
            tests: (r) => {
                const los = (n, q, pRez) => {
                    const zajete = [], zaj = new Set(), L = [];
                    let wolnych = n;
                    const wolne = new PQ(wiecej, Array.from({ length: n }, (_, i) => i + 1));
                    for (let i = 0; i < q; i++) {
                        if (!zajete.length || r() < pRez) {
                            L.push('REZERWUJ');
                            if (wolnych) { const x = wolne.pop(); wolnych--; zaj.add(x); zajete.push(x); }
                        } else {
                            const j = r.int(0, zajete.length - 1), x = zajete[j];
                            zajete[j] = zajete[zajete.length - 1]; zajete.pop(); zaj.delete(x);
                            wolne.push(x); wolnych++;
                            L.push(`ZWOLNIJ ${x}`);
                        }
                    }
                    return `${n} ${q}\n${L.join('\n')}`;
                };
                return ['1 1\nREZERWUJ', '1 3\nREZERWUJ\nREZERWUJ\nZWOLNIJ 1', los(5, 30, 0.6), los(10, 200, 0.55), los(100000, 3000, 0.7), los(50, 3000, 0.52), los(2000, 3000, 0.8)];
            },
            check: (inp) => {
                const L = linie(inp);
                const [n, q] = L[0].split(' ').map(Number);
                if (!calk(n, 1, 1e5) || !calk(q, 1, 3000) || L.length !== q + 1) return 'n q';
                const zaj = new Set(), wolne = new PQ(wiecej, Array.from({ length: Math.min(n, 3001) }, (_, i) => i + 1));
                for (const l of L.slice(1)) {
                    if (l === 'REZERWUJ') { if (wolne.size) zaj.add(wolne.pop()); continue; }
                    const m = l.match(/^ZWOLNIJ (\d+)$/);
                    if (!m || !zaj.has(Number(m[1]))) return 'zwolnienie wolnego miejsca';
                    zaj.delete(Number(m[1])); wolne.push(Number(m[1]));
                }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp);
                const n = Number(L[0].split(' ')[0]);
                const wolne = new PQ(wiecej), out = [];
                for (let i = 1; i <= n; i++) wolne.push(i);
                for (const l of L.slice(1)) {
                    if (l === 'REZERWUJ') out.push(wolne.empty() ? 'brak' : wolne.pop());
                    else wolne.push(Number(l.split(' ')[1]));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    priority_queue<int, vector<int>, greater<int>> wolne;
    for (int i = 1; i <= n; i++) wolne.push(i);
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "REZERWUJ") {
            if (wolne.empty()) {
                cout << "brak\n";
            } else {
                cout << wolne.top() << "\n";
                wolne.pop();
            }
        } else {
            int x;
            cin >> x;
            wolne.push(x);
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-laczenie-lin', krok: 2, level: 'srednie',
            title: 'Łączenie lin',
            short: 'Połączenie dwóch lin kosztuje sumę ich długości. Zawsze łącz dwie najkrótsze — a nowa lina wraca do kopca minimum.',
            tags: ['dwa najmniejsze', 'wynik wraca do kopca', 'long long'],
            statement: ['Masz n lin o podanych długościach. W jednym ruchu możesz połączyć dwie liny w jedną — nowa lina ma długość równą sumie długości obu, a połączenie kosztuje tyle, ile wynosi ta suma. Połącz wszystkie liny w jedną, płacąc w sumie jak najmniej, i wypisz ten najmniejszy koszt.',
                'Najtaniej jest zawsze łączyć dwie najkrótsze liny (długie liny są wtedy doliczane najrzadziej). Trzymaj długości w kopcu minimum: zdejmij dwie najmniejsze, dodaj ich sumę do kosztu i wrzuć nową linę z powrotem do kopca. Powtarzaj, dopóki w kopcu jest więcej niż jedna lina. Gdy lina jest tylko jedna, koszt wynosi 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — długości lin.'],
            output_format: ['Jedna liczba — najmniejszy łączny koszt.'],
            constraints: ['1 ≤ n ≤ 10⁴', 'Długości są liczbami całkowitymi od 1 do 10⁶.'],
            examples: [{ input: '4\n4 3 2 6', note: 'Łączymy 2 i 3 (koszt 5), potem 4 i 5 (koszt 9), na koniec 6 i 9 (koszt 15). Razem 5 + 9 + 15 = 29.' }],
            hint: R`while (pq.size() > 1) { long long a = pq.top(); pq.pop(); long long b = pq.top(); pq.pop(); koszt += a + b; pq.push(a + b); }. Długości rosną, a koszt sumuje się wiele razy — kopiec i koszt w long long.`,
            tests: (r) => [d1([5]), d1([1, 1]), d1([1, 2, 3]), d1([10, 10, 10, 10]), d1(r.arr(20, 1, 100)), d1(r.arr(10000, 1, 1000000)), d1(r.arr(10000, 999000, 1000000)), d1(r.arr(5000, 1, 3))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1e4) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const pq = new PQ(wiecej, nums(inp).slice(1));
                let koszt = 0;
                while (pq.size > 1) { const a = pq.pop(), b = pq.pop(); koszt += a + b; pq.push(a + b); }
                return String(koszt);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    for (int i = 0; i < n; i++) {
        long long d;
        cin >> d;
        pq.push(d);
    }
    long long koszt = 0;
    while (pq.size() > 1) {
        long long a = pq.top();
        pq.pop();
        long long b = pq.top();
        pq.pop();
        koszt += a + b;
        pq.push(a + b);
    }
    cout << koszt << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-do-progu', krok: 2, level: 'srednie',
            title: 'Mieszanie do progu',
            short: 'Bierz dwie najmniejsze liczby x ≤ y i wrzucaj 2x + y, dopóki najmniejsza nie dojdzie do progu. Ile ruchów — albo −1.',
            tags: ['dwa najmniejsze', 'warunek na wierzchu', 'long long'],
            statement: ['Masz n liczb naturalnych i próg k. W jednym ruchu bierzesz dwie najmniejsze liczby x i y (x ≤ y), usuwasz je i wrzucasz jedną nową liczbę 2·x + y. Ruchy wykonujesz tak długo, aż wszystkie liczby będą większe lub równe k.',
                'Wypisz liczbę wykonanych ruchów. Jeśli zostanie tylko jedna liczba, a wciąż jest mniejsza od k, wypisz −1. Jeśli już na początku wszystkie liczby są co najmniej k, odpowiedzią jest 0.',
                'Trzymaj liczby w kopcu minimum — wtedy najmniejsza jest zawsze na wierzchu, a o tym, czy trzeba dalej mieszać, decyduje wierzch: dopóki top() < k.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['Jedna liczba — liczba ruchów albo −1.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ k ≤ 10⁹', 'Liczby są z przedziału od 1 do 10⁹.'],
            examples: [{ input: '5 10\n2 11 10 1 3', note: 'Najpierw 1 i 2 dają 2·1 + 2 = 4. Potem 3 i 4 dają 10. Teraz najmniejsza jest 10 — gotowe po 2 ruchach.' },
                { input: '2 100\n1 2', note: 'Jeden ruch daje 4 i zostaje sama czwórka, mniejsza od 100 — odpowiedź −1.' }],
            hint: R`while (pq.size() > 1 && pq.top() < k) { long long x = pq.top(); pq.pop(); long long y = pq.top(); pq.pop(); pq.push(2 * x + y); ruchy++; }. Po pętli: if (pq.top() < k) cout << -1; else cout << ruchy;. Nowe liczby mogą przekroczyć int — użyj long long.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d([5], 5), d([5], 6), d([1, 1], 3), d([1, 1], 4), d([10, 20, 30], 5), d(r.arr(20, 1, 50), 100), d(r.arr(10000, 1, 1000000000), 1000000000), d(r.arr(10000, 1, 1000), 1000000000), d(r.arr(3000, 1, 100), 500), d(r.arr(10, 1, 3), 1000000000)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 1, 1e9) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp), k = t[1];
                const pq = new PQ(wiecej, t.slice(2));
                let ruchy = 0;
                while (pq.size > 1 && pq.top() < k) { const x = pq.pop(), y = pq.pop(); pq.push(2 * x + y); ruchy++; }
                return String(pq.top() < k ? -1 : ruchy);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        pq.push(x);
    }
    int ruchy = 0;
    while (pq.size() > 1 && pq.top() < k) {
        long long x = pq.top();
        pq.pop();
        long long y = pq.top();
        pq.pop();
        pq.push(2 * x + y);
        ruchy++;
    }
    if (pq.top() < k) cout << -1 << "\n";
    else cout << ruchy << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-kieszonkowe', krok: 2, level: 'srednie',
            title: 'Kieszonkowe',
            short: 'Oszczędności rosną co dzień, a za każdym razem kupujesz najtańsze zabawki, na które cię stać. Zaglądasz na wierzch, zanim zdejmiesz.',
            tags: ['kopiec minimum', 'top przed pop', 'long long'],
            statement: ['W sklepie jest n zabawek o podanych cenach. Przez d kolejnych dni Kuba dostaje kieszonkowe: i-tego dnia m_i złotych, które dokłada do swoich oszczędności.',
                'Każdego dnia, po dostaniu kieszonkowego, Kuba kupuje po kolei najtańszą zabawkę ze sklepu — dopóki starcza mu oszczędności i w sklepie coś zostało. Kupiona zabawka znika ze sklepu, a jej cena jest odejmowana od oszczędności.',
                'Wypisz, ile zabawek Kuba kupił każdego dnia. W drugim wierszu wypisz, ile pieniędzy mu na końcu zostało i ile zabawek zostało w sklepie.'],
            input_format: ['W pierwszym wierszu liczby n i d.', 'W drugim wierszu n cen zabawek.', 'W trzecim wierszu d liczb — kieszonkowe w kolejnych dniach.'],
            output_format: ['W pierwszym wierszu d liczb — ile zabawek kupiono każdego dnia.', 'W drugim wierszu dwie liczby: pozostałe oszczędności i liczba zabawek w sklepie.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ d ≤ 3000', 'Ceny są z przedziału od 1 do 10⁶.', 'Kieszonkowe jest z przedziału od 0 do 10⁶.'],
            examples: [{ input: '5 3\n4 10 3 3 50\n5 6 4', note: 'Dzień 1: ma 5 zł, kupuje zabawkę za 3 (zostają 2 zł) — na następną (3 zł) już nie starcza. Dzień 2: ma 8 zł, kupuje za 3 i za 4 (zostaje 1 zł). Dzień 3: ma 5 zł — za mało na 10. Na końcu 5 zł i 2 zabawki w sklepie.' }],
            hint: R`while (!sklep.empty() && sklep.top() <= oszczednosci) { oszczednosci -= sklep.top(); sklep.pop(); kupione++; }. Oszczędności mogą urosnąć do miliardów — long long.`,
            tests: (r) => {
                const d = (a, m) => `${a.length} ${m.length}\n${a.join(' ')}\n${m.join(' ')}`;
                return [d([5], [4]), d([5], [5]), d([1, 1, 1], [0, 3, 1]), d([7, 2], [0, 0, 0]), d(r.arr(20, 1, 30), r.arr(10, 0, 20)), d(r.arr(5000, 1, 1000000), r.arr(3000, 0, 1000000)),
                    d(r.arr(5000, 900000, 1000000), r.arr(3000, 0, 1000000)), d(r.arr(5000, 1, 100), r.arr(3000, 0, 50)), d(r.arr(3, 1000000, 1000000), r.arr(3000, 1000000, 1000000))];
            },
            check: (inp) => {
                const t = nums(inp); const [n, dd] = t;
                return calk(n, 1, 5000) && calk(dd, 1, 3000) && t.length === n + dd + 2 && t.slice(2, 2 + n).every((x) => calk(x, 1, 1e6)) && t.slice(2 + n).every((x) => calk(x, 0, 1e6)) ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); const [n, dd] = t;
                const sklep = new PQ(wiecej, t.slice(2, 2 + n));
                let osz = 0;
                const out = [];
                for (const m of t.slice(2 + n, 2 + n + dd)) {
                    osz += m;
                    let k = 0;
                    while (sklep.size && sklep.top() <= osz) { osz -= sklep.pop(); k++; }
                    out.push(k);
                }
                return out.join(' ') + '\n' + osz + ' ' + sklep.size;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, d;
    cin >> n >> d;
    priority_queue<int, vector<int>, greater<int>> sklep;
    for (int i = 0; i < n; i++) {
        int c;
        cin >> c;
        sklep.push(c);
    }
    long long oszczednosci = 0;
    for (int i = 0; i < d; i++) {
        int m;
        cin >> m;
        oszczednosci += m;
        int kupione = 0;
        while (!sklep.empty() && sklep.top() <= oszczednosci) {
            oszczednosci -= sklep.top();
            sklep.pop();
            kupione++;
        }
        cout << kupione << " ";
    }
    cout << "\n" << oszczednosci << " " << sklep.size() << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · kopiec binarny w tablicy
        {
            id: 'kop-rodzina', krok: 3, level: 'latwe',
            title: 'Rodzina w tablicy',
            short: 'W kopcu w tablicy od 1 rodzic pola i to i/2, a dzieci to 2i i 2i + 1 — o ile mieszczą się w n. Przy ogromnym n potrzebny long long.',
            tags: ['rodzic i/2', 'dzieci 2i i 2i + 1', 'long long'],
            statement: ['Kopiec trzymamy w tablicy t[1..n]: korzeń drzewa jest w polu 1, a pole i ma rodzica w polu i/2 (dzielenie całkowite) oraz dzieci w polach 2i i 2i + 1 — ale tylko te dzieci, których numery nie przekraczają n.',
                'Dla każdego z T pytań (n, i) wypisz numer pola rodzica, lewego dziecka i prawego dziecka pola i. Jeśli któregoś z nich nie ma (korzeń nie ma rodzica, a dzieci za n nie istnieją), wypisz w tym miejscu 0.'],
            input_format: ['W pierwszym wierszu liczba T.', 'W każdym z kolejnych T wierszy dwie liczby n i i.'],
            output_format: ['Dla każdego pytania jeden wiersz: trzy liczby — rodzic, lewe dziecko i prawe dziecko (0, gdy nie istnieje).'],
            constraints: ['1 ≤ T ≤ 400', '1 ≤ i ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n10 1\n10 5\n10 4\n10 7', note: 'Korzeń 1 nie ma rodzica, jego dzieci to 2 i 3. Pole 5 ma rodzica 2 i tylko lewe dziecko 10 (11 > n). Pole 4 ma dzieci 8 i 9. Pole 7 jest liściem: dzieci 14 i 15 nie mieszczą się w 10.' }],
            hint: R`long long n, i; — liczby do 10¹⁸ nie mieszczą się w int, a 2i + 1 tym bardziej. Rodzic: i == 1 ? 0 : i / 2. Lewe dziecko: 2 * i <= n ? 2 * i : 0. Prawe: 2 * i + 1 <= n ? 2 * i + 1 : 0.`,
            tests: (r) => {
                const q = (pary) => `${pary.length}\n${pary.map((p) => p.join(' ')).join('\n')}`;
                const B = (x) => BigInt(x);
                const losP = (maxN) => { const n = r.big(1n, maxN); return [n, r.big(1n, n)]; };
                const male = [];
                for (let n = 1; n <= 8; n++) for (let i = 1; i <= n; i++) male.push([n, i]);
                return [q([[1, 1]]), q(male), q(Array.from({ length: 400 }, () => losP(10n ** 18n))), q(Array.from({ length: 300 }, () => losP(1000n))),
                    q([[B(10) ** 18n, B(10) ** 18n], [B(10) ** 18n, B(5) * B(10) ** 17n], [B(10) ** 18n, B(5) * B(10) ** 17n - 1n], [B(10) ** 18n, 1n], [B(2) ** 59n, B(2) ** 58n]])];
            },
            check: (inp) => {
                const t = toks(inp);
                const T = Number(t[0]);
                if (!calk(T, 1, 400) || t.length !== 2 * T + 1) return 'T';
                for (let j = 0; j < T; j++) { const n = BigInt(t[1 + 2 * j]), i = BigInt(t[2 + 2 * j]); if (!(i >= 1n && i <= n && n <= 10n ** 18n)) return 'n i'; }
                return null;
            },
            solve: (inp) => {
                const t = toks(inp).slice(1).map((x) => BigInt(x)), out = [];
                for (let j = 0; j < t.length; j += 2) {
                    const n = t[j], i = t[j + 1];
                    out.push(`${i === 1n ? 0n : i / 2n} ${2n * i <= n ? 2n * i : 0n} ${2n * i + 1n <= n ? 2n * i + 1n : 0n}`);
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T;
    cin >> T;
    for (int k = 0; k < T; k++) {
        long long n, i;
        cin >> n >> i;
        long long rodzic = (i == 1 ? 0 : i / 2);
        long long lewe = (2 * i <= n ? 2 * i : 0);
        long long prawe = (2 * i + 1 <= n ? 2 * i + 1 : 0);
        cout << rodzic << " " << lewe << " " << prawe << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-wysokosc', krok: 3, level: 'latwe',
            title: 'Ile pięter ma kopiec',
            short: 'Kopiec z n elementami ma tylko około log₂ n pięter — nawet przy 10¹⁸ elementach to 60 pięter. Policz je dzieleniem przez 2.',
            tags: ['wysokość drzewa', 'dzielenie przez 2', 'log₂ n'],
            statement: ['Kopiec z n elementami to drzewo, w którym kolejne piętra są wypełnione do końca: na piętrze pierwszym jest 1 element (korzeń), na drugim 2, na trzecim 4, na czwartym 8 i tak dalej — każde piętro jest dwa razy większe od poprzedniego. Tylko ostatnie piętro może być niepełne.',
                'Dla każdego z T pytań wypisz, ile pięter ma kopiec z n elementami i ile elementów leży na jego ostatnim piętrze. Liczba pięter mówi, ile najwyżej zamian wykonuje push i pop — dlatego kopiec jest taki szybki.'],
            input_format: ['W pierwszym wierszu liczba T.', 'W każdym z kolejnych T wierszy jedna liczba n.'],
            output_format: ['Dla każdego pytania jeden wiersz: liczba pięter i liczba elementów na ostatnim piętrze.'],
            constraints: ['1 ≤ T ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n1\n7\n10\n1000000', note: 'Siedem elementów to trzy pełne piętra (1 + 2 + 4). Dziesięć to trzy pełne piętra i 3 elementy na czwartym. Milion elementów mieści się na 20 piętrach.' }],
            hint: R`Piętro, na którym leży element n, to liczba dzieleń przez 2 potrzebnych, żeby z n dojść do zera: while (x > 0) { x /= 2; pietra++; }. Pełne piętra nad ostatnim mieszczą 2^(pietra − 1) − 1 elementów, a reszta leży na ostatnim. Pamiętaj o long long — także w potęgach dwójki: 1LL << k.`,
            tests: (r) => {
                const q = (a) => `${a.length}\n${a.join('\n')}`;
                const pot = [];
                for (let k = 0n; k < 60n; k++) { pot.push(2n ** k); pot.push(2n ** k - 1n); }
                return [q([1]), q(Array.from({ length: 40 }, (_, i) => i + 1)), q(pot.filter((x) => x >= 1n && x <= 10n ** 18n)), q(Array.from({ length: 1000 }, () => r.big(1n, 10n ** 18n))), q([10n ** 18n, 10n ** 18n - 1n, 2n ** 59n + 1n])];
            },
            check: (inp) => { const t = toks(inp); const T = Number(t[0]); return calk(T, 1, 1000) && t.length === T + 1 && t.slice(1).every((x) => BigInt(x) >= 1n && BigInt(x) <= 10n ** 18n) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => {
                const n = BigInt(s);
                let p = 0n, x = n;
                while (x > 0n) { x /= 2n; p++; }
                return `${p} ${n - (2n ** (p - 1n) - 1n)}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T;
    cin >> T;
    for (int k = 0; k < T; k++) {
        long long n;
        cin >> n;
        long long x = n, pietra = 0;
        while (x > 0) {
            x /= 2;
            pietra++;
        }
        long long pelne = (1LL << (pietra - 1)) - 1;
        cout << pietra << " " << n - pelne << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-poziomy', krok: 3, level: 'latwe',
            title: 'Kopiec piętro po piętrze',
            short: 'Tablica kopca to drzewo zapisane piętrami: piętro k to pola od 2^(k−1) do 2^k − 1. Wypisz każde piętro w osobnym wierszu.',
            tags: ['piętra drzewa', 'potęgi dwójki', 'tablica od 1'],
            statement: ['Dostajesz kopiec zapisany w tablicy t[1..n]. Wypisz go piętro po piętrze: w pierwszym wierszu korzeń t[1], w drugim t[2] i t[3], w trzecim t[4] do t[7], w czwartym t[8] do t[15] i tak dalej — piętro k zawiera pola od 2^(k−1) do 2^k − 1. Ostatnie piętro może być niepełne: kończy się na polu n.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — tablica t[1..n].'],
            output_format: ['Kolejne piętra kopca, każde w osobnym wierszu, liczby oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '10\n90 70 80 30 60 50 20 10 25 5', note: 'Piętra mają 1, 2, 4 i 3 elementy (ostatnie jest niepełne: pola 8, 9 i 10).' }],
            hint: R`for (int od = 1; od <= n; od *= 2) { for (int i = od; i < 2 * od && i <= n; i++) cout << t[i] << " "; cout << "\n"; }. Tablicę deklaruj o jeden większą i zapisuj od t[1].`,
            tests: (r) => {
                const kopiec = (a) => { const t = [0]; for (const x of a) tPush(t, x); return t.slice(1); };
                return [d1([5]), d1([9, 4]), d1(kopiec([1, 2, 3])), d1(kopiec(r.arr(7, 0, 99))), d1(kopiec(r.arr(16, 0, 99))), d1(kopiec(r.arr(2000, 0, 1000000))), d1(kopiec(r.arr(1023, 0, 9))), d1(kopiec(r.arr(1024, 0, 9)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp), n = a[0], out = [];
                for (let od = 1; od <= n; od *= 2) out.push(a.slice(od, Math.min(2 * od, n + 1)).join(' '));
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> t(n + 1);
    for (int i = 1; i <= n; i++) cin >> t[i];
    for (int od = 1; od <= n; od *= 2) {
        for (int i = od; i < 2 * od && i <= n; i++) cout << t[i] << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-czy-kopiec', krok: 3, level: 'srednie',
            title: 'Czy to jest kopiec?',
            short: 'Warunek kopca: każdy rodzic jest nie mniejszy od swoich dzieci, czyli t[i/2] ≥ t[i] dla każdego i ≥ 2. Znajdź pierwsze miejsce, w którym się psuje.',
            tags: ['warunek kopca', 't[i/2] ≥ t[i]', 'kilka testów'],
            statement: ['Tablica t[1..n] jest kopcem maksimum, jeśli każdy element jest nie mniejszy od swoich dzieci — czyli dla każdego i od 2 do n zachodzi t[i/2] ≥ t[i]. Równe wartości są w porządku.',
                'Dla każdej z T tablic sprawdź, czy jest kopcem. Jeśli jest, wypisz TAK. Jeśli nie, wypisz NIE oraz najmniejszy numer pola i, dla którego t[i/2] < t[i].'],
            input_format: ['W pierwszym wierszu liczba T.', 'Każdy test to dwa wiersze: liczba n, a w następnym n liczb — tablica t[1..n].'],
            output_format: ['Dla każdego testu jeden wiersz: TAK albo NIE i numer pola.'],
            constraints: ['1 ≤ T ≤ 100', '1 ≤ n ≤ 1000', 'Suma wszystkich n nie przekracza 10⁴.', 'Liczby są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '3\n6\n9 7 8 7 1 8\n5\n9 7 8 7 8\n1\n4', note: 'Pierwsza tablica jest kopcem (równe 8 pod 8 są w porządku). W drugiej pole 5 ma wartość 8, a jego rodzic, pole 2, tylko 7. Jednoelementowa tablica zawsze jest kopcem.' }],
            hint: R`for (int i = 2; i <= n; i++) if (t[i / 2] < t[i]) { zly = i; break; }. Zacznij od zly = 0 i zeruj go przed każdym testem.`,
            tests: (r) => {
                const testy = (lista) => `${lista.length}\n${lista.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                const kopiec = (a) => { const t = [0]; for (const x of a) tPush(t, x); return t.slice(1); };
                // psuje warunek kopca w jednym miejscu: dziecko robi się większe od rodzica (indeksy od 0)
                const popsuj = (a) => {
                    const b = a.slice();
                    if (b.length < 2) return b;
                    const i = r.int(1, b.length - 1), p = ((i + 1) >> 1) - 1;
                    if (b[p] < 1000000) b[i] = b[p] + r.int(1, Math.min(5, 1000000 - b[p]));
                    else { b[i] = 1000000; b[p] = 999999; }
                    return b;
                };
                const zestaw = (ile, n, lo, hi) => Array.from({ length: ile }, () => { const k = kopiec(r.arr(r.int(1, n), lo, hi)); return r() < 0.5 ? k : popsuj(k); });
                return [testy([[1]]), testy([[2, 1], [1, 2], [3, 3, 3]]), testy(zestaw(20, 10, 0, 9)), testy(zestaw(100, 100, 0, 1000000)), testy(zestaw(10, 1000, 0, 5)), testy(zestaw(10, 1000, 0, 1000000)), testy([r.arr(1000, 0, 1000000)])];
            },
            check: (inp) => {
                const t = nums(inp);
                const T = t[0];
                if (!calk(T, 1, 100)) return 'T';
                let p = 1, suma = 0;
                for (let j = 0; j < T; j++) { const n = t[p++]; if (!calk(n, 1, 1000)) return 'n'; suma += n; for (let i = 0; i < n; i++) if (!calk(t[p++], 0, 1e6)) return 'liczba'; }
                return p === t.length && suma <= 1e4 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp), out = [];
                let p = 1;
                for (let j = 0; j < t[0]; j++) {
                    const n = t[p++];
                    const a = [0, ...t.slice(p, p + n)];
                    p += n;
                    const zly = czyKopiec(a);
                    out.push(zly ? `NIE ${zly}` : 'TAK');
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T;
    cin >> T;
    for (int k = 0; k < T; k++) {
        int n;
        cin >> n;
        vector<int> t(n + 1);
        for (int i = 1; i <= n; i++) cin >> t[i];
        int zly = 0;
        for (int i = 2; i <= n; i++) {
            if (t[i / 2] < t[i]) {
                zly = i;
                break;
            }
        }
        if (zly == 0) cout << "TAK\n";
        else cout << "NIE " << zly << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-w-gore', krok: 3, level: 'srednie',
            title: 'Przesiewanie w górę',
            short: 'Nowy element staje na końcu tablicy i zamienia się z rodzicem, dopóki rodzic jest mniejszy. Policz zamiany przy każdym wstawieniu.',
            tags: ['przesiewanie w górę', 'zamiana z rodzicem', 'własny push'],
            statement: ['Zbuduj własny kopiec maksimum w tablicy t[1..n] (bez priority_queue). Na początku kopiec jest pusty. Wstaw do niego po kolei n liczb, każdą tak:',
                'nowa liczba staje na końcu tablicy (w polu o numerze równym nowej liczbie elementów); potem, dopóki nie jest w korzeniu i jej rodzic (pole i/2) jest od niej mniejszy, zamień ją z rodzicem i przejdź na jego miejsce. Gdy rodzic jest większy albo równy — stop.',
                'Wypisz, ile zamian wykonało każde wstawienie, a w drugim wierszu — całą tablicę kopca po wstawieniu wszystkich liczb.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb w kolejności wstawiania.'],
            output_format: ['W pierwszym wierszu n liczb — liczby zamian przy kolejnych wstawieniach.', 'W drugim wierszu tablica t[1..n] na końcu.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '5\n3 5 8 1 9', note: 'Piątka zamienia się z trójką (1 zamiana). Ósemka staje w polu 3 i zamienia się z piątką z korzenia (1). Jedynka zostaje pod trójką (0). Dziewiątka idzie z pola 5 do pola 2, a potem do korzenia (2 zamiany).' }],
            hint: R`t.push_back(x); int i = t.size() - 1; while (i > 1 && t[i / 2] < t[i]) { swap(t[i / 2], t[i]); i /= 2; zamiany++; }. Weź vector<int> t(1); — pole t[0] zostaje puste, żeby liczyć od 1.`,
            tests: (r) => [d1([7]), d1([1, 2]), d1([2, 1]), d1([1, 2, 3, 4, 5, 6, 7]), d1([5, 5, 5, 5]), d1(r.arr(12, 0, 20)), d1(r.arr(2000, 0, 1000000)), d1(Array.from({ length: 1000 }, (_, i) => i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const t = [0], z = [];
                for (const x of nums(inp).slice(1)) z.push(tPush(t, x));
                return z.join(' ') + '\n' + t.slice(1).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> t(1);
    for (int k = 0; k < n; k++) {
        int x;
        cin >> x;
        t.push_back(x);
        int i = t.size() - 1, zamiany = 0;
        while (i > 1 && t[i / 2] < t[i]) {
            swap(t[i / 2], t[i]);
            i /= 2;
            zamiany++;
        }
        cout << zamiany << " ";
    }
    cout << "\n";
    for (int i = 1; i < (int)t.size(); i++) cout << t[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kop-w-dol', krok: 3, level: 'srednie',
            title: 'Przesiewanie w dół',
            short: 'Zdejmowanie korzenia: ostatni element wskakuje na górę i zamienia się z większym dzieckiem, dopóki jest od niego mniejszy.',
            tags: ['przesiewanie w dół', 'większe dziecko', 'własny pop'],
            statement: ['Dostajesz poprawny kopiec maksimum w tablicy t[1..n] i liczbę k. Wykonaj k razy własne zdjęcie wierzchu (bez priority_queue):',
                'zapamiętaj korzeń t[1] (to największy element); przenieś ostatni element tablicy na miejsce korzenia i skróć tablicę o jedno pole; potem przesiewaj go w dół: dopóki ma choć jedno dziecko, wybierz większe z dzieci (gdy dzieci są równe — lewe, czyli pole 2i), i jeśli to dziecko jest większe od niego, zamień je i przejdź na miejsce dziecka; w przeciwnym razie stop.',
                'Wypisz zdjęte korzenie w kolejności zdejmowania, a w drugim wierszu tablicę, która została (albo słowo pusty).'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — kopiec t[1..n].'],
            output_format: ['W pierwszym wierszu k zdjętych liczb.', 'W drugim wierszu tablica t po k zdjęciach albo słowo pusty.'],
            constraints: ['1 ≤ k ≤ n ≤ 2000', 'Liczby są z przedziału od 0 do 10⁶.', 'Tablica z wejścia jest poprawnym kopcem maksimum.'],
            examples: [{ input: '6 2\n9 7 8 3 5 1', note: 'Zdejmujemy 9: jedynka wskakuje do korzenia, zamienia się z większym dzieckiem 8 — zostaje 8 7 1 3 5. Zdejmujemy 8: piątka wskakuje do korzenia i zamienia się z siódemką: 7 5 1 3.' }],
            hint: R`int top = t[1]; t[1] = t.back(); t.pop_back(); int i = 1, n = t.size() - 1; while (2 * i <= n) { int c = 2 * i; if (c + 1 <= n && t[c + 1] > t[c]) c++; if (t[c] > t[i]) { swap(t[c], t[i]); i = c; } else break; }.`,
            tests: (r) => {
                const kopiec = (a) => { const t = [0]; for (const x of a) tPush(t, x); return t.slice(1); };
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d([4], 1), d([5, 5], 1), d(kopiec([1, 2, 3]), 3), d(kopiec(r.arr(10, 0, 9)), 4), d(kopiec(r.arr(2000, 0, 1000000)), 1000), d(kopiec(r.arr(2000, 0, 3)), 2000), d(kopiec(r.arr(300, 0, 1000)), 7), d([9, 9, 9, 9, 9], 3)];
            },
            check: (inp) => {
                const t = nums(inp); const [n, k] = t;
                if (!calk(n, 1, 2000) || !calk(k, 1, n) || t.length !== n + 2 || !t.slice(2).every((x) => calk(x, 0, 1e6))) return 'dane';
                return czyKopiec([0, ...t.slice(2)]) ? 'to nie kopiec' : null;
            },
            solve: (inp) => {
                const a = nums(inp), k = a[1], t = [0, ...a.slice(2)], zd = [];
                for (let j = 0; j < k; j++) zd.push(tPop(t).top);
                return zd.join(' ') + '\n' + (t.length > 1 ? t.slice(1).join(' ') : 'pusty');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> t(n + 1);
    for (int i = 1; i <= n; i++) cin >> t[i];
    for (int j = 0; j < k; j++) {
        cout << t[1] << " ";
        t[1] = t.back();
        t.pop_back();
        int m = t.size() - 1, i = 1;
        while (2 * i <= m) {
            int c = 2 * i;
            if (c + 1 <= m && t[c + 1] > t[c]) c++;
            if (t[c] > t[i]) {
                swap(t[c], t[i]);
                i = c;
            } else {
                break;
            }
        }
    }
    cout << "\n";
    if (t.size() == 1) cout << "pusty\n";
    else {
        for (int i = 1; i < (int)t.size(); i++) cout << t[i] << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kop-wlasny-kopiec', krok: 3, level: 'trudne',
            title: 'Własny kopiec',
            short: 'Cały kopiec od zera: DODAJ przesiewa w górę, ZABIERZ — w dół, a TABLICA pokazuje, jak naprawdę wygląda tablica w środku.',
            tags: ['własny push i pop', 'funkcje na vectorze', 'stan tablicy'],
            statement: ['Napisz własny kopiec maksimum w tablicy t[1..n] — bez priority_queue — i wykonaj q poleceń:',
                'DODAJ x — wstaw x (na koniec tablicy i przesiewanie w górę: zamieniaj z rodzicem, dopóki rodzic jest mniejszy); ZABIERZ — wypisz korzeń i usuń go (ostatni element na miejsce korzenia i przesiewanie w dół: zamieniaj z większym dzieckiem, przy równych dzieciach z lewym, dopóki to dziecko jest większe); WIERZCH — wypisz korzeń; TABLICA — wypisz całą tablicę t[1..n].',
                'Jeśli przy ZABIERZ albo WIERZCH kopiec jest pusty, wypisz PUSTO. Przy TABLICA dla pustego kopca wypisz pusty.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia ZABIERZ, WIERZCH i TABLICA jeden wiersz z odpowiedzią.'],
            constraints: ['1 ≤ q ≤ 2000', 'W kopcu nigdy nie ma więcej niż 200 liczb.', 'Liczby są z przedziału od 1 do 999.', 'Poleceń TABLICA jest najwyżej 20.'],
            examples: [{ input: '8\nDODAJ 4\nDODAJ 7\nDODAJ 2\nDODAJ 9\nTABLICA\nZABIERZ\nTABLICA\nWIERZCH', note: 'Po czterech DODAJ tablica to 9 7 2 4 (dziewiątka przeszła z pola 4 przez pole 2 do korzenia). ZABIERZ wypisuje 9, czwórka wskakuje do korzenia i zamienia się z siódemką: 7 4 2.' }],
            hint: R`Napisz dwie funkcje na vector<int> &t: void dodaj(vector<int> &t, int x) i int zabierz(vector<int> &t). Bez & funkcja zmieniałaby kopię i kopiec by się nie zmieniał. Pusty kopiec to t.size() == 1 (pole t[0] nieużywane).`,
            tests: (r) => {
                const los = (q, pDod, pTab) => {
                    const L = [];
                    let n = 0, tab = 0;
                    for (let i = 0; i < q; i++) {
                        const u = r();
                        if (u < pTab && tab < 20) { L.push('TABLICA'); tab++; }
                        else if (u < pTab + pDod && n < 200) { L.push(`DODAJ ${r.int(1, 999)}`); n++; }
                        else if (r() < 0.75) { L.push('ZABIERZ'); if (n) n--; }
                        else L.push('WIERZCH');
                    }
                    return `${q}\n${L.join('\n')}`;
                };
                return ['1\nTABLICA', '3\nZABIERZ\nWIERZCH\nDODAJ 5', '6\nDODAJ 5\nDODAJ 5\nDODAJ 5\nTABLICA\nZABIERZ\nTABLICA', los(40, 0.6, 0.15), los(2000, 0.55, 0.01), los(2000, 0.8, 0.008), los(400, 0.45, 0.05)];
            },
            check: (inp) => {
                const L = linie(inp);
                const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                let n = 0, tab = 0;
                for (const l of L.slice(1)) {
                    if (l === 'TABLICA') tab++;
                    else if (l === 'ZABIERZ') { if (n) n--; }
                    else if (l === 'WIERZCH') continue;
                    else { const m = l.match(/^DODAJ (\d+)$/); if (!m || !calk(Number(m[1]), 1, 999)) return 'polecenie'; n++; if (n > 200) return 'za duży kopiec'; }
                }
                return tab <= 20 ? null : 'za dużo TABLICA';
            },
            solve: (inp) => {
                const t = [0], out = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'TABLICA') out.push(t.length > 1 ? t.slice(1).join(' ') : 'pusty');
                    else if (l === 'WIERZCH') out.push(t.length > 1 ? t[1] : 'PUSTO');
                    else if (l === 'ZABIERZ') out.push(t.length > 1 ? tPop(t).top : 'PUSTO');
                    else tPush(t, Number(l.split(' ')[1]));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void dodaj(vector<int> &t, int x) {
    t.push_back(x);
    int i = t.size() - 1;
    while (i > 1 && t[i / 2] < t[i]) {
        swap(t[i / 2], t[i]);
        i /= 2;
    }
}
int zabierz(vector<int> &t) {
    int wynik = t[1];
    t[1] = t.back();
    t.pop_back();
    int n = t.size() - 1, i = 1;
    while (2 * i <= n) {
        int c = 2 * i;
        if (c + 1 <= n && t[c + 1] > t[c]) c++;
        if (t[c] > t[i]) {
            swap(t[c], t[i]);
            i = c;
        } else {
            break;
        }
    }
    return wynik;
}
int main() {
    int q;
    cin >> q;
    vector<int> t(1);
    for (int k = 0; k < q; k++) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            int x;
            cin >> x;
            dodaj(t, x);
        } else if (p == "TABLICA") {
            if (t.size() == 1) cout << "pusty";
            for (int i = 1; i < (int)t.size(); i++) cout << t[i] << " ";
            cout << "\n";
        } else if (t.size() == 1) {
            cout << "PUSTO\n";
        } else if (p == "WIERZCH") {
            cout << t[1] << "\n";
        } else {
            cout << zabierz(t) << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'kop-kopcowanie', krok: 3, level: 'trudne',
            title: 'Sortowanie przez kopcowanie',
            short: 'Heapsort w miejscu: budowa kopca od dołu, potem korzeń na koniec i przesiewanie w dół w coraz krótszej tablicy.',
            tags: ['budowa od dołu', 'heapsort', 'licznik zamian'],
            statement: ['Posortuj n liczb rosnąco algorytmem sortowania przez kopcowanie, w tej samej tablicy t[1..n], bez priority_queue i bez sort:',
                '1) Budowa kopca od dołu: dla i od n/2 w dół do 1 przesiewaj w dół element z pola i (w całej tablicy t[1..n]). 2) Sortowanie: dla m od n w dół do 2 zamień t[1] z t[m], a potem przesiewaj w dół element z pola 1, ale tylko w tablicy t[1..m−1] — pole m jest już na swoim miejscu.',
                'Przesiewanie w dół jest takie jak w kopcu: dopóki pole ma choć jedno dziecko w obrabianej części tablicy, wybierz większe dziecko (przy równych — lewe) i zamień, jeśli jest większe od elementu; w przeciwnym razie stop.',
                'Wypisz tablicę po budowie kopca, tablicę na końcu (posortowaną) oraz dwie liczby: ile zamian wykonało przesiewanie w dół podczas budowy, a ile podczas sortowania (zamian t[1] z t[m] nie licz).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Trzy wiersze: tablica po budowie kopca, tablica posortowana oraz dwie liczby zamian.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '6\n3 1 4 1 5 9', note: 'Budowa: pole 3 (4) zamienia się z 9, pole 2 (1) — z 5, pole 1 (3) — z 9, a potem jeszcze z 4. Wychodzi 9 5 4 1 1 3 po 4 zamianach. Sortowanie przenosi kolejne największe na koniec.' }],
            hint: R`Jedna funkcja void wDol(vector<int> &t, int i, int n, long long &zamiany) wystarczy na oba etapy — różni się tylko n. Budowa: for (int i = n / 2; i >= 1; i--) wDol(t, i, n, z1);. Sortowanie: for (int m = n; m >= 2; m--) { swap(t[1], t[m]); wDol(t, 1, m - 1, z2); }.`,
            tests: (r) => [d1([5]), d1([2, 1]), d1([1, 2]), d1([3, 3, 3]), d1([1, 2, 3, 4, 5, 6, 7]), d1([7, 6, 5, 4, 3, 2, 1]), d1(r.arr(12, 0, 20)), d1(r.arr(2000, 0, 1000000)), d1(r.arr(2000, 0, 2)), d1(Array.from({ length: 1500 }, (_, i) => i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp), n = a[0], t = [0, ...a.slice(1)];
                let z1 = 0, z2 = 0;
                for (let i = Math.floor(n / 2); i >= 1; i--) z1 += wDol(t, i, n);
                const po = t.slice(1).join(' ');
                for (let m = n; m >= 2; m--) { [t[1], t[m]] = [t[m], t[1]]; z2 += wDol(t, 1, m - 1); }
                return [po, t.slice(1).join(' '), `${z1} ${z2}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wDol(vector<int> &t, int i, int n, long long &zamiany) {
    while (2 * i <= n) {
        int c = 2 * i;
        if (c + 1 <= n && t[c + 1] > t[c]) c++;
        if (t[c] > t[i]) {
            swap(t[c], t[i]);
            i = c;
            zamiany++;
        } else {
            break;
        }
    }
}
int main() {
    int n;
    cin >> n;
    vector<int> t(n + 1);
    for (int i = 1; i <= n; i++) cin >> t[i];
    long long z1 = 0, z2 = 0;
    for (int i = n / 2; i >= 1; i--) wDol(t, i, n, z1);
    for (int i = 1; i <= n; i++) cout << t[i] << " ";
    cout << "\n";
    for (int m = n; m >= 2; m--) {
        swap(t[1], t[m]);
        wDol(t, 1, m - 1, z2);
    }
    for (int i = 1; i <= n; i++) cout << t[i] << " ";
    cout << "\n" << z1 << " " << z2 << "\n";
    return 0;
}`,
        },
    ];
};
