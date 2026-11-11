// Wartość bezwzględna — baza zadań na koniec lekcji: od rozgrzewki (reszta czy dopłata, trzech przyjaciół, ciepło-zimno,
// dwie windy, litera X, fala na stawie) przez zadania średnie (najbardziej podobny kolor, najbliższy kwadrat, podział taśmy,
// najbliższa stacja, pole trójkąta, wskazówki zegara, ranking rzutów) do trudnych (najbliżsi na torze, stabilny fragment,
// pole działki, najbliższy palindrom, kurier zachłanny) i wielkiego finału — teleturnieju „Zgadnij liczbę”.
// Zadania łączą zagadnienia z całej lekcji i z poprzednich lekcji (sortowanie, sumy prefiksowe, tablice 2D, pary).
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const MLD = 1000000000;
    const wZakresie = (xs, lo, hi) => xs.every((x) => /^-?\d+$/.test(String(x)) && Number(x) >= lo && Number(x) <= hi);
    const losowe = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const IMIONA = ['Ala', 'Bartek', 'Cela', 'Darek', 'Ewa', 'Franek', 'Gosia', 'Henio', 'Iza', 'Janek', 'Kasia', 'Leon', 'Magda', 'Nikodem',
        'Ola', 'Piotr', 'Roksana', 'Szymon', 'Tola', 'Witek', 'Zosia', 'Adam', 'Basia', 'Igor', 'Julia', 'Kuba', 'Lena', 'Marek', 'Natalia', 'Oskar'];
    // n różnych imion: najpierw z listy, potem wymyślone (wielka litera i małe litery)
    const imiona = (r, n) => {
        const s = new Set(r.shuffle(IMIONA).slice(0, Math.min(n, IMIONA.length)));
        while (s.size < n) s.add(r.word(1, 'ABCDEFGHIJKLMNOPRSTUWZ') + r.word(r.int(2, 9), 'aeiouyklmnprstwzbcdg'));
        return r.shuffle([...s]);
    };
    const pol = (D) => `${Math.floor(D / 2)}.${D % 2 ? 5 : 0}`; // D/2 z jedną cyfrą po kropce (D ≥ 0)

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'abs-b-reszta', krok: 9, level: 'latwe',
            title: 'Reszta czy dopłata?',
            short: 'Klient zapłacił z groszy za zakupy za c groszy. Reszta, dopłata czy równo?',
            tags: ['abs(z - c)', 'znak różnicy', 'if'],
            statement: ['W sklepie przy kasie obsługiwano t klientów. Zakupy klienta kosztowały c groszy, a klient dał z groszy. Dla każdego klienta wypisz w osobnym wierszu: reszta X, jeśli dał za dużo (X to kwota do wydania); doplata X, jeśli dał za mało (X to brakująca kwota); rowno, jeśli dał dokładnie tyle, ile trzeba.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: c i z.'],
            output_format: ['t wierszy — reszta X, doplata X albo rowno.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ c, z ≤ 10⁹'],
            examples: [{ input: '3\n1250 2000\n800 500\n700 700' }],
            hint: R`Kwota do wydania albo dopłacenia to w obu przypadkach abs(z - c) — moduł mówi „ile”, a znak różnicy z - c mówi „w którą stronę”. Najpierw sprawdź, czy z == c, potem z > c (reszta) i w przeciwnym razie dopłata.`,
            tests: (r) => ['1\n1 1', `2\n1 ${MLD}\n${MLD} 1`, '3\n5 6\n6 5\n5 5', ...[20, 500, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => { const c = r.int(1, MLD); return `${c} ${r.int(0, 5) ? r.int(1, MLD) : c}`; }).join('\n')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), 1, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const c = t[1 + 2 * i], z = t[2 + 2 * i]; out.push(z === c ? 'rowno' : z > c ? `reszta ${z - c}` : `doplata ${c - z}`); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int c, z;
        cin >> c >> z;
        if (z == c) cout << "rowno\n";
        else if (z > c) cout << "reszta " << abs(z - c) << "\n";
        else cout << "doplata " << abs(z - c) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-trzech-przyjaciol', krok: 9, level: 'latwe',
            title: 'Trzech przyjaciół',
            short: 'Trzech przyjaciół przy jednej ulicy chce się spotkać i przejść razem jak najmniej. Ile przejdą?',
            tags: ['mediana trzech liczb', 'max − min', 'suma odległości'],
            statement: ['Trzech przyjaciół mieszka przy jednej prostej ulicy, w punktach a, b i c. Chcą się spotkać w jednym punkcie i przejść razem jak najmniej. Dla każdego z t zapytań wypisz w osobnym wierszu najmniejszą łączną drogę.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby a, b, c.'],
            output_format: ['t wierszy — najmniejsze łączne drogi.'],
            constraints: ['1 ≤ t ≤ 1000', '|a|, |b|, |c| ≤ 10⁹'],
            examples: [{ input: '2\n1 9 4\n5 5 5', note: 'Najlepiej spotkać się u środkowego przyjaciela (w punkcie 4): 3 + 5 + 0 = 8.' }],
            hint: R`Najlepsze miejsce to mediana, czyli środkowa z trzech liczb. Ale jest jeszcze prościej: skrajni przyjaciele i tak muszą razem pokonać całą drogę między sobą, a środkowy nie musi iść wcale. Wynik to max(a, b, c) − min(a, b, c) — w C++ max({a, b, c}) - min({a, b, c}).`,
            tests: (r) => [`2\n${-MLD} ${MLD} 0\n${MLD} ${MLD} ${-MLD}`, '3\n0 0 0\n1 2 3\n3 2 1', ...[20, 500, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => losowe(r, 3, -MLD, MLD).join(' ')).join('\n')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 3 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const v = t.slice(1 + 3 * i, 4 + 3 * i); out.push(Math.max(...v) - Math.min(...v)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, b, c;
        cin >> a >> b >> c;
        cout << max({a, b, c}) - min({a, b, c}) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-punktualnosc', krok: 9, level: 'latwe',
            title: 'Punktualność pociągów',
            short: 'Opóźnienia pociągów (ujemne — przed czasem): ile pociągów było punktualnych i jakie było największe odstępstwo?',
            tags: ['abs(d) <= k', 'największy moduł', 'liczenie'],
            statement: ['Dla n pociągów znamy opóźnienie w minutach: liczba dodatnia to spóźnienie, ujemna — przyjazd przed czasem, 0 — przyjazd o czasie. Pociąg jest punktualny, jeśli rozminął się z rozkładem co najwyżej o k minut, w jedną albo w drugą stronę.', 'Wypisz w pierwszym wierszu liczbę punktualnych pociągów, a w drugim — największe odstępstwo od rozkładu (bez znaku).'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — opóźnienia.'],
            output_format: ['Dwa wiersze: liczba punktualnych pociągów i największe odstępstwo.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ k ≤ 60', '−600 ≤ każde opóźnienie ≤ 600'],
            examples: [{ input: '6 5\n3 -7 0 12 -5 6', note: 'Punktualne są pociągi z opóźnieniem 3, 0 i −5. Największe odstępstwo to 12 minut.' }],
            hint: R`Pociąg jest punktualny, gdy abs(d) <= k — przyjazd 5 minut przed czasem też łamie rozkład. Największe odstępstwo to rekord abs(d) — nie samo d, bo pociąg, który przyjechał 20 minut za wcześnie, rozminął się z rozkładem bardziej niż spóźniony o 12.`,
            tests: (r) => ['1 0\n0', '1 0\n-600', '3 60\n-60 60 61', '4 10\n-600 -3 2 -599', ...[[15, 5], [2000, 10], [10000, 3], [10000, 60]].map(([n, k]) => `${n} ${k}\n${losowe(r, n, -600, 600).map((x) => (r.int(0, 2) ? Math.trunc(x / 20) : x)).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 10000 && t.length === n + 2 && wZakresie([t[1]], 0, 60) && wZakresie(t.slice(2), -600, 600) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), k = t[1], v = t.slice(2); return `${v.filter((x) => Math.abs(x) <= k).length}\n${Math.max(...v.map(Math.abs))}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int punktualne = 0, naj = 0;
    for (int i = 0; i < n; i++) {
        int d;
        cin >> d;
        if (abs(d) <= k) punktualne++;
        naj = max(naj, abs(d));
    }
    cout << punktualne << "\n" << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-cieplo-zimno', krok: 9, level: 'latwe',
            title: 'Ciepło, zimno',
            short: 'Po każdym strzale podpowiedź: cieplej, zimniej, tak samo — albo TRAFIONY.',
            tags: ['abs(x - s)', 'poprzedni strzał', 'porównanie odległości'],
            statement: ['W grze „ciepło-zimno” ktoś pomyślał liczbę s, a gracz strzela n razy. Po każdym strzale słyszy podpowiedź:', '• TRAFIONY, jeśli strzał jest równy s,', '• w przeciwnym razie po pierwszym strzale słyszy pierwszy, a po każdym kolejnym: cieplej, jeśli nowy strzał jest bliżej s niż poprzedni strzał; zimniej, jeśli dalej; tak samo, jeśli tak samo daleko.', 'Wypisz po kolei wszystkie usłyszane podpowiedzi, każdą w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczby s i n.', 'W drugim wierszu n liczb całkowitych — kolejne strzały.'],
            output_format: ['n wierszy — podpowiedzi.'],
            constraints: ['1 ≤ n ≤ 1000', '|s|, |każdy strzał| ≤ 10⁹'],
            examples: [{ input: '50 5\n10 80 45 55 50', note: 'Odległości od 50: 40, 30, 5, 5 i 0.' }],
            hint: R`Zapamiętuj odległość poprzedniego strzału od s. Dla każdego strzału: jeśli x == s — TRAFIONY; w przeciwnym razie, jeśli to pierwszy strzał — pierwszy; inaczej porównaj d = abs(x - s) z odległością poprzedniego strzału. Na końcu każdego kroku zapisz d jako „poprzednią”.`,
            tests: (r) => {
                const gen = (n, R2) => { const s = r.int(-R2, R2); const v = []; for (let i = 0; i < n; i++) v.push(r.int(0, 9) === 0 ? s : r.int(0, 3) === 0 && i ? 2 * s - v[i - 1] : r.int(-R2, R2)); return `${s} ${n}\n${v.map((x) => Math.max(-MLD, Math.min(MLD, x))).join(' ')}`; };
                return ['5 1\n5', '5 1\n6', `0 3\n${MLD} ${-MLD} 0`, '7 4\n7 7 8 6', gen(12, 20), gen(400, MLD), gen(1000, MLD), gen(60, 4)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[1]); return n >= 1 && n <= 1000 && t.length === n + 2 && wZakresie([t[0], ...t.slice(2)], -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), s = t[0], v = t.slice(2), out = []; let pop = -1; v.forEach((x, i) => { const d = Math.abs(x - s); out.push(d === 0 ? 'TRAFIONY' : i === 0 ? 'pierwszy' : d < pop ? 'cieplej' : d > pop ? 'zimniej' : 'tak samo'); pop = d; }); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long s;
    int n;
    cin >> s >> n;
    long long poprzednia = -1;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        long long d = abs(x - s);
        if (d == 0) cout << "TRAFIONY\n";
        else if (i == 0) cout << "pierwszy\n";
        else if (d < poprzednia) cout << "cieplej\n";
        else if (d > poprzednia) cout << "zimniej\n";
        else cout << "tak samo\n";
        poprzednia = d;
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-ktora-winda', krok: 9, level: 'latwe',
            title: 'Która winda przyjedzie?',
            short: 'Dwie windy na poziomach e1 i e2. Przyjeżdża ta, która ma bliżej — przy remisie winda 1.',
            tags: ['abs(e - p)', 'remis', 'dwie odległości'],
            statement: ['W budynku są dwie windy: pierwsza stoi na poziomie e1, druga na poziomie e2. Ktoś wzywa windę z poziomu p. Przyjeżdża ta winda, która ma bliżej; jeśli obie mają tak samo daleko, przyjeżdża winda numer 1.', 'Dla każdego z t wezwań wypisz w osobnym wierszu numer windy, która przyjedzie, i liczbę pięter, które przejedzie. Każde wezwanie rozpatrujemy osobno — windy zawsze startują ze swoich poziomów e1 i e2.'],
            input_format: ['W pierwszym wierszu liczby e1, e2 i t.', 'W drugim wierszu t liczb — poziomy wezwań.'],
            output_format: ['t wierszy — numer windy i liczba pięter.'],
            constraints: ['1 ≤ t ≤ 1000', '−20 ≤ e1, e2, każdy poziom ≤ 200'],
            examples: [{ input: '2 8 3\n5 7 -1', note: 'Na wezwanie z poziomu 5 obie windy mają po 3 piętra — jedzie winda 1.' }],
            hint: R`Dla każdego wezwania policz d1 = abs(e1 - p) i d2 = abs(e2 - p). Jeśli d1 <= d2, jedzie winda 1 (przy remisie też ona), w przeciwnym razie winda 2.`,
            tests: (r) => ['0 0 2\n0 5', '-20 200 3\n90 91 89', '5 5 3\n-20 200 5', ...Array.from({ length: 5 }, (_, i) => { const n = [10, 100, 1000, 1000, 50][i]; return `${r.int(-20, 200)} ${r.int(-20, 200)} ${n}\n${losowe(r, n, -20, 200).join(' ')}`; })],
            check: (inp) => { const t = toks(inp), n = Number(t[2]); return n >= 1 && n <= 1000 && t.length === n + 3 && wZakresie([t[0], t[1], ...t.slice(3)], -20, 200) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), e1 = t[0], e2 = t[1]; return t.slice(3).map((p) => { const d1 = Math.abs(e1 - p), d2 = Math.abs(e2 - p); return d1 <= d2 ? `1 ${d1}` : `2 ${d2}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int e1, e2, t;
    cin >> e1 >> e2 >> t;
    for (int k = 0; k < t; k++) {
        int p;
        cin >> p;
        int d1 = abs(e1 - p), d2 = abs(e2 - p);
        if (d1 <= d2) cout << 1 << " " << d1 << "\n";
        else cout << 2 << " " << d2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-litera-x', krok: 9, level: 'latwe',
            title: 'Litera X',
            short: 'Narysuj literę X w kwadracie: gwiazdka tam, gdzie |i| = |j|.',
            tags: ['abs(i) == abs(j)', 'rysowanie', 'przekątne'],
            statement: ['Wczytaj n i narysuj literę X w kwadracie z 2n + 1 wierszy po 2n + 1 znaków. Wiersze i kolumny numerujemy od −n do n. Na polu (i, j) postaw gwiazdkę *, gdy |i| = |j|, a kropkę . w przeciwnym razie.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['2n + 1 wierszy po 2n + 1 znaków.'],
            constraints: ['0 ≤ n ≤ 40'],
            examples: [{ input: '2' }],
            hint: R`Pole leży na jednej z dwóch przekątnych, gdy jest „tyle samo w bok, ile w górę” od środka: abs(i) == abs(j). Dwie pętle od -n do n i warunek — dokładnie jak przy rombie z lekcji.`,
            tests: () => ['0', '1', '3', '5', '9', '17', '28', '40'],
            check: (inp) => (/^\d+$/.test(inp) && Number(inp) <= 40 ? null : 'n'),
            solve: (inp) => { const n = Number(inp), w = []; for (let i = -n; i <= n; i++) { let s = ''; for (let j = -n; j <= n; j++) s += Math.abs(i) === Math.abs(j) ? '*' : '.'; w.push(s); } return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = -n; i <= n; i++) {
        for (int j = -n; j <= n; j++) {
            if (abs(i) == abs(j)) cout << '*';
            else cout << '.';
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-odleglosc-od-odcinka', krok: 9, level: 'latwe',
            title: 'Odległość od odcinka',
            short: 'Jak daleko jest punkt x od odcinka [a, b]? Zero, jeśli leży na nim, a w przeciwnym razie — do bliższego końca.',
            tags: ['przedział', 'bliższy koniec', 'min z dwóch odległości'],
            statement: ['Na osi liczbowej leży odcinek od a do b (a ≤ b). Odległość punktu x od odcinka to 0, jeśli x leży na odcinku (końce się liczą), a w przeciwnym razie — odległość x od bliższego końca odcinka. Dla każdego z q punktów wypisz w osobnym wierszu jego odległość od odcinka.'],
            input_format: ['W pierwszym wierszu liczby a, b i q.', 'W drugim wierszu q liczb całkowitych — punkty.'],
            output_format: ['q wierszy — odległości.'],
            constraints: ['|a|, |b| ≤ 10⁹', 'a ≤ b', '1 ≤ q ≤ 1000', '|każdy punkt| ≤ 10⁹'],
            examples: [{ input: '3 8 4\n5 1 10 8', note: '5 i 8 leżą na odcinku. 1 jest 2 od końca 3, a 10 — 2 od końca 8.' }],
            hint: R`Jeśli a <= x && x <= b, odległość to 0. W przeciwnym razie to min(abs(x - a), abs(x - b)) — do bliższego z końców. Inny zapis bez ifa: max(0, max(a - x, x - b)).`,
            tests: (r) => [`0 0 3\n0 1 -1`, `${-MLD} ${MLD} 2\n${MLD} ${-MLD}`, `${MLD} ${MLD} 2\n${-MLD} ${MLD}`, ...[[10, 20], [300, MLD], [1000, MLD], [40, 5]].map(([q, R2]) => { const a = r.int(-R2, R2), b = r.int(a, R2); return `${a} ${b} ${q}\n${losowe(r, q, -R2, R2).join(' ')}`; })],
            check: (inp) => { const t = toks(inp), q = Number(t[2]); return q >= 1 && q <= 1000 && t.length === q + 3 && wZakresie([t[0], t[1], ...t.slice(3)], -MLD, MLD) && Number(t[0]) <= Number(t[1]) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), a = t[0], b = t[1]; return t.slice(3).map((x) => (x >= a && x <= b ? 0 : Math.min(Math.abs(x - a), Math.abs(x - b)))).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    int q;
    cin >> a >> b >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        if (a <= x && x <= b) cout << 0 << "\n";
        else cout << min(abs(x - a), abs(x - b)) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-spacer-po-osi', krok: 9, level: 'latwe',
            title: 'Spacer po osi',
            short: 'Polecenia L k i P k. Jak daleko od startu jesteś na końcu, a jak daleko byłeś najdalej?',
            tags: ['pozycja ze znakiem', 'abs(poz)', 'long long'],
            statement: ['Ala stoi w punkcie 0 osi liczbowej i wykonuje n poleceń. Polecenie L k oznacza k kroków w lewo, a P k — k kroków w prawo.', 'Wypisz w pierwszym wierszu, jak daleko od startu stoi Ala po wykonaniu wszystkich poleceń, a w drugim — jak daleko od startu była w najdalszym momencie spaceru.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy litera L albo P i liczba k.'],
            output_format: ['Dwa wiersze: odległość na końcu i największa odległość w trakcie spaceru.'],
            constraints: ['1 ≤ n ≤ 8000', '1 ≤ k ≤ 10⁶'],
            examples: [{ input: '4\nP 5\nL 8\nL 4\nP 3', note: 'Kolejne pozycje: 5, −3, −7, −4. Na końcu 4 od startu, najdalej było 7 (w punkcie −7).' }],
            hint: R`Trzymaj pozycję ze znakiem (long long — 8000 poleceń po milion kroków to 8 · 10⁹): L odejmuje k, P dodaje k. Po każdym poleceniu odległość od startu to abs(pozycja) — porównaj ją z dotychczasowym rekordem. Najdalej Ala jest zawsze na końcu któregoś polecenia, bo w trakcie polecenia idzie w jedną stronę.`,
            tests: (r) => ['1\nP 1', '1\nL 1000000', '2\nP 7\nL 7', `8000\n${Array.from({ length: 8000 }, () => 'P 1000000').join('\n')}`, `6\nL 3\nP 3\nP 3\nL 3\nL 3\nP 3`,
                ...[20, 3000, 8000].map((n) => `${n}\n${Array.from({ length: n }, () => `${r.pick(['L', 'P'])} ${r.int(1, 1000000)}`).join('\n')}`), `8000\n${Array.from({ length: 8000 }, (_, i) => `${i < 4000 ? 'L' : r.pick(['L', 'P', 'P'])} ${r.int(1, 1000000)}`).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); if (!(n >= 1 && n <= 8000 && t.length === 2 * n + 1)) return 'n'; for (let i = 0; i < n; i++) if (!/^[LP]$/.test(t[1 + 2 * i]) || !wZakresie([t[2 + 2 * i]], 1, 1000000)) return 'polecenie'; return null; },
            solve: (inp) => { const t = toks(inp); let p = 0, m = 0; for (let i = 0; i < Number(t[0]); i++) { p += (t[1 + 2 * i] === 'L' ? -1 : 1) * Number(t[2 + 2 * i]); m = Math.max(m, Math.abs(p)); } return `${Math.abs(p)}\n${m}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long poz = 0, naj = 0;
    for (int i = 0; i < n; i++) {
        char c;
        long long k;
        cin >> c >> k;
        if (c == 'L') poz -= k;
        else poz += k;
        naj = max(naj, abs(poz));
    }
    cout << abs(poz) << "\n" << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-synoptyk', krok: 9, level: 'latwe',
            title: 'Pomyłki synoptyka',
            short: 'Prognoza i prawdziwa temperatura przez n dni: łączna pomyłka, dzień największej pomyłki i dni bez pomyłki.',
            tags: ['suma modułów', 'rekord', 'liczenie zer'],
            statement: ['Przez n dni synoptyk przewidywał temperaturę, a potem zapisywano temperaturę prawdziwą. Pomyłka w danym dniu to różnica między prognozą a prawdziwą temperaturą, bez znaku.', 'Wypisz w jednym wierszu trzy liczby: łączną pomyłkę ze wszystkich dni, numer dnia z największą pomyłką (dni numerujemy od 1; przy remisie — najwcześniejszy) i liczbę dni, w których prognoza była idealna.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n prognoz, w trzecim — n prawdziwych temperatur.'],
            output_format: ['Trzy liczby w jednym wierszu.'],
            constraints: ['1 ≤ n ≤ 5000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '4\n5 -2 10 3\n7 -2 4 1', note: 'Pomyłki: 2, 0, 6, 2. Razem 10, największa w dniu 3, jeden dzień idealny.' }],
            hint: R`Wczytaj obie listy do tablic, a potem w jednej pętli policz pomyłkę dnia abs(prognoza[i] - prawda[i]), dodaj ją do sumy, sprawdź rekord (podmieniaj przy ściśle większej) i policz zera.`,
            tests: (r) => ['1\n0\n0', '1\n-50\n50', '3\n1 2 3\n1 2 3', '4\n0 0 0 0\n5 -5 5 -5', ...[12, 1000, 5000].map((n) => `${n}\n${losowe(r, n, -50, 50).join(' ')}\n${losowe(r, n, -50, 50).join(' ')}`), `${200}\n${Array(200).fill(10).join(' ')}\n${losowe(r, 200, 8, 12).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -50, 50) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[0]; let s = 0, k = 0, z = 0; for (let i = 0; i < n; i++) { const d = Math.abs(t[1 + i] - t[1 + n + i]); s += d; if (d === 0) z++; if (d > Math.abs(t[1 + k] - t[1 + n + k])) k = i; } return `${s} ${k + 1} ${z}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> p(n), t(n);
    for (int i = 0; i < n; i++) cin >> p[i];
    for (int i = 0; i < n; i++) cin >> t[i];
    int suma = 0, naj = 0, idealne = 0;
    for (int i = 0; i < n; i++) {
        int d = abs(p[i] - t[i]);
        suma += d;
        if (d == 0) idealne++;
        if (d > abs(p[naj] - t[naj])) naj = i;
    }
    cout << suma << " " << naj + 1 << " " << idealne << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-fala', krok: 9, level: 'latwe',
            title: 'Fala na stawie',
            short: 'Kamień wpada w pole (r, c). Na każdym polu wypisz ostatnią cyfrę czasu |i − r| + |j − c|, po którym dojdzie tam fala.',
            tags: ['abs(i - r) + abs(j - c)', 'rysowanie', '% 10'],
            statement: ['Prostokątny staw ma h wierszy i w kolumn, numerowanych od 1. W pole (r, c) wpadł kamień. Fala rozchodzi się wzdłuż wierszy i kolumn: na pole (i, j) dociera po |i − r| + |j − c| sekundach.', 'Wypisz mapę stawu: h wierszy po w cyfr (bez spacji), gdzie na polu (i, j) stoi ostatnia cyfra czasu, po którym fala dotrze do tego pola.'],
            input_format: ['Jeden wiersz z liczbami h, w, r, c.'],
            output_format: ['h wierszy po w cyfr.'],
            constraints: ['1 ≤ h, w ≤ 100', '1 ≤ r ≤ h', '1 ≤ c ≤ w'],
            examples: [{ input: '3 5 2 2' }],
            hint: R`Dwie pętle: i od 1 do h, j od 1 do w. Czas to abs(i - r) + abs(j - c), a jego ostatnia cyfra to reszta z dzielenia przez 10. To romb z lekcji, tylko ze środkiem w dowolnym miejscu i obciętym brzegiem.`,
            tests: (r) => ['1 1 1 1', '1 100 1 1', '100 1 50 1', '100 100 100 100', '100 100 1 1', '9 9 5 5', ...Array.from({ length: 4 }, () => { const hh = r.int(1, 100), ww = r.int(1, 100); return `${hh} ${ww} ${r.int(1, hh)} ${r.int(1, ww)}`; })],
            check: (inp) => { const t = toks(inp).map(Number); return t.length === 4 && t[0] >= 1 && t[0] <= 100 && t[1] >= 1 && t[1] <= 100 && t[2] >= 1 && t[2] <= t[0] && t[3] >= 1 && t[3] <= t[1] ? null : 'zakres'; },
            solve: (inp) => { const [H, W, rr, c] = toks(inp).map(Number), out = []; for (let i = 1; i <= H; i++) { let s = ''; for (let j = 1; j <= W; j++) s += (Math.abs(i - rr) + Math.abs(j - c)) % 10; out.push(s); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, w, r, c;
    cin >> h >> w >> r >> c;
    for (int i = 1; i <= h; i++) {
        for (int j = 1; j <= w; j++) {
            cout << (abs(i - r) + abs(j - c)) % 10;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'abs-b-podobny-kolor', krok: 9, level: 'srednie',
            title: 'Najbardziej podobny kolor',
            short: 'Kolor to trzy liczby R, G, B. Która farba z palety jest najbliżej szukanego koloru?',
            tags: ['suma trzech modułów', 'rekord', 'remis: mniejszy numer'],
            statement: ['Kolor na ekranie zapisuje się trzema liczbami od 0 do 255: R (czerwony), G (zielony) i B (niebieski). Różnica dwóch kolorów to suma różnic ich składowych, każdej bez znaku: |R₁ − R₂| + |G₁ − G₂| + |B₁ − B₂|.', 'Malarz ma paletę n farb ponumerowanych od 1 i chce uzyskać kolor (R, G, B). Wypisz numer farby najbardziej podobnej do szukanego koloru i różnicę między nimi. Przy remisie wybierz farbę o mniejszym numerze.'],
            input_format: ['W pierwszym wierszu szukany kolor: R G B.', 'W drugim wierszu liczba n.', 'W każdym z następnych n wierszy kolor farby: trzy liczby.'],
            output_format: ['Dwie liczby w jednym wierszu: numer farby i różnica.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ każda składowa ≤ 255'],
            examples: [{ input: '200 100 50\n3\n255 255 255\n190 110 60\n0 0 0', note: 'Różnice: 55 + 155 + 205 = 415, 10 + 10 + 10 = 30 i 200 + 100 + 50 = 350.' }],
            hint: R`To rekord „najbliżej celu”, tylko odległość ma trzy części: abs(r - R) + abs(g - G) + abs(b - B). Zapamiętuj numer najlepszej farby i jej różnicę; podmieniaj przy ściśle mniejszej różnicy.`,
            tests: (r) => {
                const kol = () => losowe(r, 3, 0, 255).join(' ');
                const gen = (n) => { const c = kol(); const cc = c.split(' ').map(Number); return `${c}\n${n}\n${Array.from({ length: n }, () => (r.int(0, 4) ? kol() : cc.map((x) => Math.max(0, Math.min(255, x + r.int(-6, 6)))).join(' '))).join('\n')}`; };
                return ['0 0 0\n1\n0 0 0', '0 0 0\n2\n255 255 255\n255 255 255', '128 128 128\n3\n120 128 128\n128 136 128\n128 128 120', gen(10), gen(500), gen(5000), gen(5000)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[3]); return n >= 1 && n <= 5000 && t.length === 3 * n + 4 && wZakresie([...t.slice(0, 3), ...t.slice(4)], 0, 255) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[3]; let k = 0, best = Infinity; for (let i = 0; i < n; i++) { const d = Math.abs(t[4 + 3 * i] - t[0]) + Math.abs(t[5 + 3 * i] - t[1]) + Math.abs(t[6 + 3 * i] - t[2]); if (d < best) { best = d; k = i; } } return `${k + 1} ${best}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, G, B, n;
    cin >> R >> G >> B >> n;
    int najNr = 0, najD = 1000;
    for (int i = 1; i <= n; i++) {
        int r, g, b;
        cin >> r >> g >> b;
        int d = abs(r - R) + abs(g - G) + abs(b - B);
        if (d < najD) {
            najD = d;
            najNr = i;
        }
    }
    cout << najNr << " " << najD << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-najblizszy-kwadrat', krok: 9, level: 'srednie',
            title: 'Najbliższy kwadrat',
            short: 'Dla każdej liczby n do 10¹² znajdź kwadrat liczby całkowitej, który leży najbliżej n.',
            tags: ['sqrt z poprawką', 'dwóch kandydatów', 'long long'],
            statement: ['Kwadrat liczby całkowitej to liczba postaci k · k: 0, 1, 4, 9, 16, … Dla każdej z t liczb n wypisz w osobnym wierszu kwadrat liczby całkowitej, który leży najbliżej n.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych n.'],
            output_format: ['t wierszy — najbliższe kwadraty.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹²'],
            examples: [{ input: '4\n10 13 0 1000000000000', note: '10 leży 1 od 9 i 6 od 16. 13 leży 4 od 9 i 3 od 16.' }],
            hint: R`Niech k = (long long)sqrt(n) — z lekcji o zaokrąglaniu wiesz, że dla dużych n trzeba je poprawić pętlami: while (k * k > n) k--; while ((k + 1) * (k + 1) <= n) k++;. Wtedy k² ≤ n < (k + 1)² i najbliższy kwadrat to jeden z tych dwóch — porównaj n - k * k z (k + 1) * (k + 1) - n. Remisu nie będzie: środek między k² i (k + 1)² nie jest liczbą całkowitą.`,
            tests: (r) => ['1\n0', '1\n1000000000000', '6\n1 2 3 4 5 6', `5\n${[999999, 1000000, 1000001, 999999000000, 999998000001].join(' ')}`,
                `20\n${Array.from({ length: 20 }, (_, i) => { const k = r.int(1, 999999); return k * k + (i % 2 ? k : k + 1); }).join(' ')}`,
                ...[10, 500, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => (r.int(0, 2) ? r.int(0, 1000000000000) : r.int(0, 10000))).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === n + 1 && wZakresie(t.slice(1), 0, 1000000000000) ? null : 'zakres'; },
            solve: (inp) => toks(inp).slice(1).map(Number).map((n) => { let k = Math.floor(Math.sqrt(n)); while (k * k > n) k--; while ((k + 1) * (k + 1) <= n) k++; const a = k * k, b = (k + 1) * (k + 1); if (n - a === b - n) throw new Error('remis?'); return String(n - a < b - n ? a : b); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n;
        cin >> n;
        long long k = (long long)sqrt((double)n);
        while (k * k > n) k--;
        while ((k + 1) * (k + 1) <= n) k++;
        long long a = k * k, b = (k + 1) * (k + 1);
        if (n - a < b - n) cout << a << "\n";
        else cout << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-podzial-tasmy', krok: 9, level: 'srednie',
            title: 'Podział taśmy',
            short: 'Przetnij taśmę z liczbami tak, żeby sumy obu kawałków różniły się jak najmniej. Sumy prefiksowe!',
            tags: ['sumy prefiksowe', 'abs(lewa - prawa)', 'long long'],
            statement: ['Na taśmie zapisano n liczb całkowitych. Taśmę przecinamy w jednym z n − 1 miejsc między sąsiednimi liczbami: lewy kawałek to k pierwszych liczb, a prawy — wszystkie pozostałe (1 ≤ k ≤ n − 1).', 'Wypisz najmniejszą możliwą wartość |suma lewego kawałka − suma prawego kawałka| oraz najmniejsze k, dla którego jest ona osiągana.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby w jednym wierszu: najmniejsza różnica i k.'],
            constraints: ['2 ≤ n ≤ 10 000', '|każda liczba| ≤ 10⁶'],
            examples: [{ input: '5\n3 1 2 4 3', note: 'Cięcia: 3 | 10 → 7, 4 | 9 → 5, 6 | 7 → 1, 10 | 3 → 7. Najlepsze jest k = 3.' }],
            hint: R`Policz najpierw sumę całej taśmy S. Potem idź od lewej, dodając kolejne liczby do sumy lewego kawałka L: prawy kawałek ma wtedy S − L, a różnica to abs(L - (S - L)). Jedno przejście, bez liczenia sum od nowa. Sumy mogą mieć 10¹⁰ — long long.`,
            tests: (r) => ['2\n5 5', '2\n-1000000 1000000', '3\n0 0 0', '4\n1 1 1 1000000', '6\n-3 7 -2 2 5 -9',
                ...[[10, 50], [2000, 1000000], [10000, 1000000], [10000, 3]].map(([n, R2]) => `${n}\n${losowe(r, n, -R2, R2).join(' ')}`), `10000\n${losowe(r, 10000, 0, 1000000).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 2 && n <= 10000 && t.length === n + 1 && wZakresie(t.slice(1), -1000000, 1000000) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); const S = v.reduce((a, x) => a + x, 0); let L = 0, best = Infinity, bk = 0; for (let k = 1; k < v.length; k++) { L += v[k - 1]; const d = Math.abs(L - (S - L)); if (d < best) { best = d; bk = k; } } return `${best} ${bk}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    long long S = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        S += a[i];
    }
    long long L = 0, naj = -1;
    int najK = 0;
    for (int k = 1; k < n; k++) {
        L += a[k - 1];
        long long d = abs(L - (S - L));
        if (naj < 0 || d < naj) {
            naj = d;
            najK = k;
        }
    }
    cout << naj << " " << najK << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-najblizsza-stacja', krok: 9, level: 'srednie',
            title: 'Najbliższa stacja',
            short: 'Dla każdego kilometra autostrady: jak daleko do najbliższej stacji benzynowej?',
            tags: ['abs(i - j)', 'min po stacjach', 'dwa przejścia'],
            statement: ['Autostrada ma n kilometrów, ponumerowanych od 1 do n. Na niektórych kilometrach stoją stacje benzynowe — opisuje je napis z n znaków: 1 oznacza stację na tym kilometrze, a 0 — jej brak. Na autostradzie jest co najmniej jedna stacja.', 'Dla każdego kilometra wypisz odległość (w kilometrach) do najbliższej stacji. Wypisz wszystkie n liczb w jednym wierszu, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu napis z n znaków 0 i 1.'],
            output_format: ['Jeden wiersz z n liczbami.'],
            constraints: ['1 ≤ n ≤ 4000', 'w napisie jest co najmniej jedna jedynka'],
            examples: [{ input: '7\n0010001', note: 'Stacje stoją na kilometrach 3 i 7.' }],
            hint: R`Najprościej: zapisz numery kilometrów ze stacjami w vectorze, a potem dla każdego kilometra i znajdź najmniejsze abs(i - j) po wszystkich stacjach j (najwyżej 4000 · 4000 porównań). Szybciej: dwa przejścia — od lewej licz odległość do ostatniej stacji z lewej, od prawej do najbliższej z prawej, i bierz mniejszą.`,
            tests: (r) => {
                const gen = (n, p) => { const s = Array.from({ length: n }, () => (r.int(1, 1000) <= p ? '1' : '0')); if (!s.includes('1')) s[r.int(0, n - 1)] = '1'; return `${n}\n${s.join('')}`; };
                return ['1\n1', '2\n10', '2\n01', `4000\n1${'0'.repeat(3999)}`, `4000\n${'0'.repeat(3999)}1`, `4000\n${'0'.repeat(1999)}1${'0'.repeat(2000)}`, gen(15, 200), gen(1000, 30), gen(4000, 5), gen(4000, 500)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 4000 && t.length === 2 && t[1].length === n && /^[01]+$/.test(t[1]) && t[1].includes('1') ? null : 'zakres'; },
            solve: (inp) => { const s = toks(inp)[1], n = s.length, st = []; for (let i = 0; i < n; i++) if (s[i] === '1') st.push(i); const out = []; let k = 0; for (let i = 0; i < n; i++) { while (k + 1 < st.length && Math.abs(st[k + 1] - i) <= Math.abs(st[k] - i)) k++; out.push(Math.abs(st[k] - i)); } return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    string s;
    cin >> n >> s;
    vector<int> stacje;
    for (int i = 0; i < n; i++) if (s[i] == '1') stacje.push_back(i);
    for (int i = 0; i < n; i++) {
        int naj = n;
        for (int j : stacje) naj = min(naj, abs(i - j));
        cout << naj << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-spotkanie-szybko', krok: 9, level: 'srednie',
            title: 'Spotkanie jak najszybciej',
            short: 'Wszyscy idą naraz, po 1 na minutę. Po ilu minutach mogą być razem i w którym najmniejszym punkcie?',
            tags: ['max − min', 'dzielenie w górę', 'najdalsi decydują'],
            statement: ['Przy prostej ulicy stoi n przyjaciół, w punktach o współrzędnych całkowitych. Wszyscy ruszają jednocześnie; co minutę każdy może przesunąć się o 1 w lewo albo w prawo albo stać w miejscu. Chcą jak najszybciej zebrać się wszyscy w jednym punkcie o współrzędnej całkowitej.', 'Wypisz najmniejszą liczbę minut, po której mogą być razem, oraz najmniejszy punkt, w którym mogą się wtedy spotkać.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — pozycje.'],
            output_format: ['Dwie liczby w jednym wierszu: liczba minut i punkt spotkania.'],
            constraints: ['1 ≤ n ≤ 8000', '|każda pozycja| ≤ 10⁹'],
            examples: [{ input: '4\n1 9 4 6', note: 'Skrajni przyjaciele (1 i 9) muszą przejść łącznie 8, więc potrzeba co najmniej 4 minut — wystarczy spotkać się w punkcie 5.' }, { input: '3\n0 3 1', note: 'Po 2 minutach mogą być razem w punkcie 1 albo 2 — najmniejszy to 1.' }],
            hint: R`Tu liczy się czas, nie suma dróg — decydują tylko dwie skrajne osoby. Niech d = max − min. Co minutę skrajni zbliżają się najwyżej o 2, więc potrzeba T = (d + 1) / 2 minut (dzielenie w górę), i tyle wystarczy. Punkt p jest dobry, gdy każdy dojdzie w T minut: |x − p| ≤ T dla wszystkich, czyli max − T ≤ p ≤ min + T. Najmniejszy taki punkt to max − T.`,
            tests: (r) => ['1\n5', '2\n-7 7', '2\n0 1', `2\n${-MLD} ${MLD}`, '3\n4 4 4', ...[[10, 30], [1000, MLD], [8000, MLD], [7999, 100]].map(([n, R2]) => `${n}\n${losowe(r, n, -R2, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 8000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let mn = Infinity, mx = -Infinity; for (const x of v) { mn = Math.min(mn, x); mx = Math.max(mx, x); } const T = Math.floor((mx - mn + 1) / 2); return `${T} ${mx - T}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long mn = LLONG_MAX, mx = LLONG_MIN;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        mn = min(mn, x);
        mx = max(mx, x);
    }
    long long T = (mx - mn + 1) / 2;
    cout << T << " " << mx - T << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-pole-trojkata', krok: 9, level: 'srednie',
            title: 'Pole trójkąta',
            short: 'Pole trójkąta z trzech punktów: moduł z jednego wyrażenia podzielony przez 2 — całkowite albo „i pół”.',
            tags: ['abs z wyrażenia', 'long long', '.0 albo .5'],
            statement: ['Trójkąt ma wierzchołki w punktach (x₁, y₁), (x₂, y₂) i (x₃, y₃) o współrzędnych całkowitych. Jego pole można policzyć ze wzoru P = |(x₂ − x₁) · (y₃ − y₁) − (x₃ − x₁) · (y₂ − y₁)| / 2. Bez modułu wzór dawałby wynik ujemny, gdy wierzchołki są podane zgodnie z ruchem wskazówek zegara.', 'Dla każdego z t trójkątów wypisz w osobnym wierszu jego pole z dokładnie jedną cyfrą po kropce — pole jest zawsze liczbą całkowitą albo „i pół”. Jeśli punkty leżą na jednej prostej, pole wynosi 0.0.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy sześć liczb: x₁ y₁ x₂ y₂ x₃ y₃.'],
            output_format: ['t wierszy — pola z jedną cyfrą po kropce.'],
            constraints: ['1 ≤ t ≤ 1000', '|każda współrzędna| ≤ 10⁶'],
            examples: [{ input: '3\n0 0 4 0 0 3\n0 0 1 1 2 2\n0 0 0 1 1 0', note: 'Pierwszy trójkąt ma przyprostokątne 4 i 3, więc pole 6. Drugi jest „płaski”. Trzeci ma pole 0,5 (wierzchołki zgodnie ze wskazówkami zegara — bez modułu wyszłoby −0.5).' }],
            hint: R`Policz D = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) w long long (iloczyny sięgają 4 · 10¹²). Pole to D / 2: wypisz D / 2 (dzielenie całkowite), kropkę, i 5, jeśli D jest nieparzyste, albo 0, jeśli parzyste. Wtedy nie potrzebujesz liczb z przecinkiem.`,
            tests: (r) => ['1\n0 0 0 0 0 0', '1\n-1000000 -1000000 1000000 -1000000 1000000 1000000', '1\n-1000000 -1000000 1000000 1000000 1000000 -1000000', '2\n0 0 1 0 0 1\n0 0 0 1 1 0',
                ...[[10, 10], [500, 1000000], [1000, 1000000], [100, 3]].map(([n, R2]) => `${n}\n${Array.from({ length: n }, () => losowe(r, 6, -R2, R2).join(' ')).join('\n')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 6 * n + 1 && wZakresie(t.slice(1), -1000000, 1000000) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const [a, b, c, d, e, f] = t.slice(1 + 6 * i, 7 + 6 * i); out.push(pol(Math.abs((c - a) * (f - b) - (e - a) * (d - b)))); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x1, y1, x2, y2, x3, y3;
        cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3;
        long long D = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
        cout << D / 2 << "." << (D % 2 == 1 ? 5 : 0) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-pary-o-roznicy', krok: 9, level: 'srednie',
            title: 'Pary o różnicy k',
            short: 'Ile jest par pozycji, na których liczby różnią się dokładnie o k? Sprawdź wszystkie pary.',
            tags: ['pary i < j', 'abs(a[i] - a[j]) == k', 'k = 0'],
            statement: ['Wczytaj n liczb całkowitych i liczbę k. Policz pary pozycji (i, j), gdzie i < j, na których liczby różnią się dokładnie o k, czyli |aᵢ − aⱼ| = k.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['2 ≤ n ≤ 2000', '0 ≤ k ≤ 2 · 10⁹', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '5 2\n1 5 3 4 2', note: 'Pary liczb: (1, 3), (5, 3) i (4, 2).' }, { input: '4 0\n7 7 1 7', note: 'Dla k = 0 liczymy pary równych liczb: trzy siódemki tworzą 3 pary.' }],
            hint: R`Dwie pętle: i od 0, j od i + 1, i warunek abs(a[i] - a[j]) == k. Par jest najwyżej około dwóch milionów — tyle porównań to chwila. Różnica może mieć 2 miliardy, więc liczby trzymaj w long long.`,
            tests: (r) => ['2 0\n5 5', '2 2000000000\n1000000000 -1000000000', `2 ${MLD}\n${MLD} 0`, '5 1\n1 2 3 4 5', `2000 0\n${Array(2000).fill(7).join(' ')}`,
                ...[[10, 3, 10], [1000, 5, 30], [2000, 17, 200], [2000, 123456, MLD]].map(([n, k, R2]) => `${n} ${k}\n${losowe(r, n, -R2, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 2 && n <= 2000 && t.length === n + 2 && wZakresie([t[1]], 0, 2 * MLD) && wZakresie(t.slice(2), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), k = t[1], v = t.slice(2); let c = 0; for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (Math.abs(v[i] - v[j]) === k) c++; return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    long long pary = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (abs(a[i] - a[j]) == k) pary++;
        }
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-wskazowki', krok: 9, level: 'srednie',
            title: 'Wskazówki zegara',
            short: 'Mniejszy kąt między wskazówkami o godzinie h:m. Licz w półstopniach, a na końcu wypisz .5, gdy trzeba.',
            tags: ['abs(60·h − 11·m)', 'min(d, 720 − d)', 'półstopnie'],
            statement: ['Zegar ma wskazówkę godzinową i minutową. Minutowa obraca się o 6° na każdą minutę. Godzinowa obraca się o 30° na każdą godzinę i dodatkowo o pół stopnia na każdą minutę. O godzinie h:m wskazówki tworzą dwa kąty, które razem dają 360°.', 'Dla każdej z t godzin wypisz w osobnym wierszu mniejszy z tych kątów w stopniach — jako liczbę całkowitą albo liczbę zakończoną na .5. Godziny są podane w formacie 24-godzinnym (13:00 na tarczy wygląda jak 1:00).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: h i m.'],
            output_format: ['t wierszy — kąty, na przykład 90 albo 22.5.'],
            constraints: ['1 ≤ t ≤ 1440', '0 ≤ h ≤ 23', '0 ≤ m ≤ 59'],
            examples: [{ input: '3\n3 0\n12 30\n9 45', note: 'O 9:45 godzinowa jest w 292,5°, a minutowa w 270° — kąt 22,5°.' }],
            hint: R`Pół stopnia psuje liczby całkowite, więc licz w półstopniach: godzinowa stoi w 60 · (h % 12) + m, minutowa w 12 · m półstopni. Różnica d = abs(60 * (h % 12) - 11 * m), a mniejszy kąt to min(d, 720 - d) półstopni. Wypisz go podzielonego przez 2: d / 2, a jeśli d jest nieparzyste — jeszcze ".5".`,
            tests: (r) => {
                const wszystkie = [];
                for (let hh = 0; hh < 24; hh++) for (let m = 0; m < 60; m++) wszystkie.push(`${hh} ${m}`);
                return ['1\n0 0', '1\n12 0', '1\n6 0', '1\n18 0', '4\n3 15\n3 16\n15 17\n23 59', `1440\n${wszystkie.join('\n')}`, `30\n${Array.from({ length: 30 }, () => r.pick(wszystkie)).join('\n')}`, `500\n${r.shuffle(wszystkie).slice(0, 500).join('\n')}`];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); if (!(n >= 1 && n <= 1440 && t.length === 2 * n + 1)) return 'n'; for (let i = 0; i < n; i++) if (!wZakresie([t[1 + 2 * i]], 0, 23) || !wZakresie([t[2 + 2 * i]], 0, 59)) return 'godzina'; return null; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const hh = t[1 + 2 * i], m = t[2 + 2 * i]; let d = Math.abs(60 * (hh % 12) - 11 * m); d = Math.min(d, 720 - d); out.push(d % 2 ? `${(d - 1) / 2}.5` : String(d / 2)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int h, m;
        cin >> h >> m;
        int d = abs(60 * (h % 12) - 11 * m);   // w półstopniach
        d = min(d, 720 - d);
        cout << d / 2;
        if (d % 2 == 1) cout << ".5";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-ranking-rzutow', krok: 9, level: 'srednie',
            title: 'Ranking rzutów do celu',
            short: 'Posortuj zawodników według odległości rzutu od celu, a przy remisie alfabetycznie.',
            tags: ['sort z lambdą', 'abs(x - T)', 'remis: alfabet'],
            statement: ['W zawodach w rzucie do celu cel stoi w punkcie T. Każdy z n zawodników rzucił raz, a jego kula upadła w punkcie x. Lepszy jest rzut, który upadł bliżej celu.', 'Wypisz imiona zawodników od najlepszego do najgorszego, każde w osobnym wierszu. Przy remisie wyżej stoi zawodnik, którego imię jest wcześniej w alfabecie.'],
            input_format: ['W pierwszym wierszu liczby T i n.', 'W każdym z następnych n wierszy imię i punkt upadku kuli.'],
            output_format: ['n wierszy — imiona w kolejności rankingu.'],
            constraints: ['1 ≤ n ≤ 1000', '|T|, |każde x| ≤ 10⁹', 'imiona są różne, składają się z liter (od 1 do 20)'],
            examples: [{ input: '100 4\nOla 97\nJan 110\nAla 103\nEwa 100', note: 'Odległości: Ola 3, Jan 10, Ala 3, Ewa 0. Ala i Ola mają remis — Ala jest wcześniej w alfabecie.' }],
            hint: R`Zapisz zawodników w vectorze par (imię, x) albo dwóch tablicach i posortuj z własną regułą — lambdą z [&], żeby widziała T (lekcja o sortowaniu): najpierw porównaj abs(x - T), a przy równych odległościach — imiona zwykłym <. Imiona z wielkiej litery porównują się poprawnie.`,
            tests: (r) => {
                const gen = (n, R2) => { const T = r.int(-R2, R2); const im = imiona(r, n); return `${T} ${n}\n${im.map((s) => `${s} ${r.int(0, 3) ? Math.max(-R2, Math.min(R2, T + r.int(-20, 20))) : r.int(-R2, R2)}`).join('\n')}`; };
                return ['5 1\nZosia 5', `0 2\nZenon ${MLD}\nAdam ${-MLD}`, '10 3\nCela 12\nBeata 8\nAda 10', gen(10, 30), gen(300, MLD), gen(1000, MLD), gen(60, 5)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[1]); if (!(n >= 1 && n <= 1000 && t.length === 2 * n + 2)) return 'n'; const s = new Set(); for (let i = 0; i < n; i++) { if (!/^[A-Za-z]{1,20}$/.test(t[2 + 2 * i]) || !wZakresie([t[3 + 2 * i]], -MLD, MLD)) return 'zawodnik'; s.add(t[2 + 2 * i]); } return s.size === n && wZakresie([t[0]], -MLD, MLD) ? null : 'imiona'; },
            solve: (inp) => { const t = toks(inp), T = Number(t[0]), n = Number(t[1]), z = []; for (let i = 0; i < n; i++) z.push([t[2 + 2 * i], Math.abs(Number(t[3 + 2 * i]) - T)]); z.sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)); return z.map((x) => x[0]).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long T;
    int n;
    cin >> T >> n;
    vector<pair<string, long long>> z(n);
    for (int i = 0; i < n; i++) cin >> z[i].first >> z[i].second;
    sort(z.begin(), z.end(), [&](const pair<string, long long> &a, const pair<string, long long> &b) {
        long long da = abs(a.second - T), db = abs(b.second - T);
        if (da != db) return da < db;
        return a.first < b.first;
    });
    for (int i = 0; i < n; i++) cout << z[i].first << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-odleglosc-od-parku', krok: 9, level: 'srednie',
            title: 'Odległość od parku',
            short: 'Park to prostokąt. Ile kroków (w pionie i poziomie) od domu do najbliższego punktu parku?',
            tags: ['odległość od przedziału', 'osobno x i y', 'long long'],
            statement: ['W mieście o ulicach w kratkę park jest prostokątem: zajmuje wszystkie punkty (x, y), dla których x₁ ≤ x ≤ x₂ i y₁ ≤ y ≤ y₂. Dla każdego z q domów wypisz w osobnym wierszu, ile kroków w pionie i poziomie dzieli dom od najbliższego punktu parku. Dom stojący w parku albo na jego brzegu ma odległość 0.'],
            input_format: ['W pierwszym wierszu cztery liczby: x₁ y₁ x₂ y₂.', 'W drugim wierszu liczba q.', 'W każdym z następnych q wierszy współrzędne domu: x i y.'],
            output_format: ['q wierszy — odległości.'],
            constraints: ['|każda współrzędna| ≤ 10⁹', 'x₁ ≤ x₂, y₁ ≤ y₂', '1 ≤ q ≤ 1000'],
            examples: [{ input: '0 0 4 3\n4\n2 1\n6 5\n-1 2\n5 -3', note: 'Dom (6, 5) jest 2 w prawo i 2 do góry od narożnika (4, 3): razem 4.' }],
            hint: R`Odległość miejska rozkłada się na część poziomą i pionową, a każdą liczysz jak odległość od odcinka: w poziomie dx = 0, gdy x1 <= x <= x2, a w przeciwnym razie odległość do bliższego końca (max(0, max(x1 - x, x - x2)) robi to w jednej linijce). Tak samo dy. Wynik to dx + dy — w long long.`,
            tests: (r) => {
                const gen = (q, R2) => { const x1 = r.int(-R2, R2), x2 = r.int(x1, R2), y1 = r.int(-R2, R2), y2 = r.int(y1, R2); return `${x1} ${y1} ${x2} ${y2}\n${q}\n${Array.from({ length: q }, () => `${r.int(-R2, R2)} ${r.int(-R2, R2)}`).join('\n')}`; };
                return [`0 0 0 0\n3\n0 0\n${MLD} ${MLD}\n${-MLD} ${-MLD}`, `${-MLD} ${-MLD} ${MLD} ${MLD}\n2\n0 0\n${MLD} ${-MLD}`, `${MLD} ${MLD} ${MLD} ${MLD}\n1\n${-MLD} ${-MLD}`, gen(12, 10), gen(300, MLD), gen(1000, MLD), gen(50, 4)];
            },
            check: (inp) => { const t = toks(inp), q = Number(t[4]); return q >= 1 && q <= 1000 && t.length === 2 * q + 5 && wZakresie([...t.slice(0, 4), ...t.slice(5)], -MLD, MLD) && Number(t[0]) <= Number(t[2]) && Number(t[1]) <= Number(t[3]) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), [x1, y1, x2, y2] = t, out = []; for (let i = 0; i < t[4]; i++) { const x = t[5 + 2 * i], y = t[6 + 2 * i]; out.push(Math.max(0, x1 - x, x - x2) + Math.max(0, y1 - y, y - y2)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x1, y1, x2, y2;
    int q;
    cin >> x1 >> y1 >> x2 >> y2 >> q;
    for (int i = 0; i < q; i++) {
        long long x, y;
        cin >> x >> y;
        long long dx = 0, dy = 0;
        if (x < x1 || x > x2) dx = min(abs(x - x1), abs(x - x2));
        if (y < y1 || y > y2) dy = min(abs(y - y1), abs(y - y2));
        cout << dx + dy << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'abs-b-dwie-windy-w-akcji', krok: 9, level: 'trudne',
            title: 'Dwie windy w akcji',
            short: 'Symulacja: na każde wezwanie jedzie bliższa winda i zostaje na miejscu. Które windy jeździły i ile razem?',
            tags: ['symulacja', 'abs(w - p)', 'remis', 'long long'],
            statement: ['W budynku są dwie windy, obie zaczynają na parterze (poziom 0). Kolejno przychodzi n wezwań z podanych poziomów. Na każde wezwanie odpowiada ta winda, która jest w tej chwili bliżej poziomu wezwania; przy remisie — winda numer 1. Winda jedzie na poziom wezwania i tam zostaje (do następnego wezwania).', 'Wypisz w pierwszym wierszu numery wind, które obsłużyły kolejne wezwania, oddzielone spacjami, a w drugim — ile pięter przejechały obie windy razem.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — poziomy kolejnych wezwań.'],
            output_format: ['W pierwszym wierszu n numerów wind, w drugim jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10 000', '−100 ≤ każdy poziom ≤ 10 000'],
            examples: [{ input: '5\n5 3 -2 6 0', note: 'Na wezwanie z 5 obie windy mają po 5 pięter — jedzie winda 1. Potem: 3 (winda 1 ma 2 piętra, winda 2 — 3), −2 (winda 2 ma bliżej), 6 i 0. Razem 5 + 2 + 2 + 3 + 2 = 14.' }],
            hint: R`Trzymaj dwie zmienne: gdzie jest winda 1 i gdzie winda 2 (na start obie 0). Dla każdego wezwania p policz d1 = abs(w1 - p) i d2 = abs(w2 - p); jeśli d1 <= d2, jedzie winda 1: dodaj d1 do sumy i ustaw w1 = p, w przeciwnym razie to samo z windą 2. Ważne: windy zostają tam, dokąd pojechały — to zmienia odpowiedzi na kolejne wezwania.`,
            tests: (r) => ['1\n0', '1\n-100', '2\n10000 -100', '4\n5 5 5 5', `10000\n${Array.from({ length: 10000 }, (_, i) => (i % 2 ? 10000 : -100)).join(' ')}`,
                ...[[12, -5, 20], [1000, -100, 10000], [10000, -100, 10000], [10000, -100, 50]].map(([n, lo, hi]) => `${n}\n${losowe(r, n, lo, hi).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 10000 && t.length === n + 1 && wZakresie(t.slice(1), -100, 10000) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let a = 0, b = 0, s = 0; const kto = []; for (const p of v) { const d1 = Math.abs(a - p), d2 = Math.abs(b - p); if (d1 <= d2) { s += d1; a = p; kto.push(1); } else { s += d2; b = p; kto.push(2); } } return `${kto.join(' ')}\n${s}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w1 = 0, w2 = 0, suma = 0;
    for (int i = 0; i < n; i++) {
        long long p;
        cin >> p;
        long long d1 = abs(w1 - p), d2 = abs(w2 - p);
        if (d1 <= d2) {
            suma += d1;
            w1 = p;
            cout << 1 << " ";
        } else {
            suma += d2;
            w2 = p;
            cout << 2 << " ";
        }
    }
    cout << "\n" << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-najblizsi-na-torze', krok: 9, level: 'trudne',
            title: 'Najbliżsi na torze',
            short: 'Samochody na okrągłym torze. Najmniejsza odległość między dwoma z nich — pamiętaj o parze przez linię startu.',
            tags: ['sort', 'sąsiedzi po sortowaniu', 'min(d, L − d)'],
            statement: ['Tor wyścigowy to okrąg o długości L metrów. Pozycję na torze opisuje liczba od 0 do L − 1 — liczba metrów od linii startu, mierzona zgodnie z kierunkiem jazdy (po L − 1 znowu jest 0). Na torze stoi n samochodów, każdy w innej pozycji.', 'Odległość dwóch samochodów to długość krótszej z dwóch dróg po torze między nimi. Wypisz najmniejszą odległość między dwoma samochodami.'],
            input_format: ['W pierwszym wierszu liczby L i n.', 'W drugim wierszu n różnych liczb — pozycje samochodów.'],
            output_format: ['Jedna liczba — najmniejsza odległość.'],
            constraints: ['2 ≤ n ≤ 8000', 'n ≤ L ≤ 10⁹', '0 ≤ każda pozycja ≤ L − 1, pozycje są różne'],
            examples: [{ input: '100 3\n10 95 50', note: 'Samochody w 95 i 10 dzieli tylko 15 metrów — przez linię startu (95 → 99 → 0 → 10).' }],
            hint: R`Posortuj pozycje. Najbliższa para stoi obok siebie na torze — czyli są to sąsiedzi po posortowaniu albo pierwszy i ostatni samochód (para „przez linię startu”). Dla każdej takiej pary policz d = różnicę pozycji i odległość po torze min(d, L - d), jak na tarczy zamka. Wynik to najmniejsza z tych wartości.`,
            tests: (r) => {
                const gen = (L, n) => { const s = new Set(); while (s.size < n) s.add(r.int(0, L - 1)); return `${L} ${n}\n${r.shuffle([...s]).join(' ')}`; };
                return ['2 2\n0 1', `${MLD} 2\n0 ${MLD - 1}`, `${MLD} 2\n0 ${MLD / 2}`, '10 10\n0 1 2 3 4 5 6 7 8 9', '100 4\n0 25 50 75', gen(1000, 10), gen(MLD, 500), gen(MLD, 8000), gen(8000, 8000), gen(20000, 8000)];
            },
            check: (inp) => { const t = toks(inp).map(Number), L = t[0], n = t[1]; return n >= 2 && n <= 8000 && L >= n && L <= MLD && t.length === n + 2 && t.slice(2).every((x) => Number.isInteger(x) && x >= 0 && x < L) && new Set(t.slice(2)).size === n ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), L = t[0], v = t.slice(2).sort((a, b) => a - b); const od = (d) => Math.min(d, L - d); let best = od(v[v.length - 1] - v[0]); for (let i = 1; i < v.length; i++) best = Math.min(best, od(v[i] - v[i - 1])); return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long L;
    int n;
    cin >> L >> n;
    vector<long long> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    sort(v.begin(), v.end());
    long long d = v[n - 1] - v[0];
    long long naj = min(d, L - d);
    for (int i = 1; i < n; i++) {
        d = v[i] - v[i - 1];
        naj = min(naj, min(d, L - d));
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-stabilny-fragment', krok: 9, level: 'trudne',
            title: 'Stabilny fragment',
            short: 'Najdłuższy fragment kolejnych pomiarów, w którym każde dwa różnią się co najwyżej o k.',
            tags: ['max − min ≤ k', 'fragmenty', 'dwie pętle z przerwaniem'],
            statement: ['Wczytaj n pomiarów temperatury i liczbę k. Fragment to kilka kolejnych pomiarów (co najmniej jeden). Fragment jest stabilny, jeśli każde dwa pomiary w nim różnią się co najwyżej o k, czyli |aᵢ − aⱼ| ≤ k dla każdych dwóch pomiarów z fragmentu.', 'Wypisz długość najdłuższego stabilnego fragmentu i numer pomiaru, od którego się zaczyna (pomiary numerujemy od 1; jeśli najdłuższych fragmentów jest kilka, wybierz ten, który zaczyna się najwcześniej).'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — pomiary.'],
            output_format: ['Dwie liczby w jednym wierszu: długość i numer pierwszego pomiaru.'],
            constraints: ['1 ≤ n ≤ 3000', '0 ≤ k ≤ 2 · 10⁹', '|każdy pomiar| ≤ 10⁹'],
            examples: [{ input: '8 3\n5 7 4 9 8 10 6 2', note: 'Fragmenty 5 7 4 (od pomiaru 1) i 9 8 10 (od pomiaru 4) mają po 3 pomiary — wygrywa wcześniejszy.' }],
            hint: R`„Każde dwa różnią się co najwyżej o k” znaczy dokładnie: największy minus najmniejszy ≤ k (najdalsze są właśnie te dwa). Dla każdego początku i rozszerzaj fragment w prawo, aktualizując na bieżąco max i min, dopóki max - min <= k; gdy warunek pęknie — przerwij (break), bo dłuższe fragmenty od tego i też będą złe. Zapamiętuj najdłuższy; przy równej długości nie podmieniaj.`,
            tests: (r) => {
                const bladz = (n, k, krok) => { const v = [r.int(-1000, 1000)]; for (let i = 1; i < n; i++) v.push(Math.max(-MLD, Math.min(MLD, v[i - 1] + r.int(-krok, krok)))); return `${n} ${k}\n${v.join(' ')}`; };
                return ['1 0\n5', '2 0\n5 5', '2 0\n5 6', '3 2000000000\n-1000000000 1000000000 0', '5 1\n1 2 3 4 5', '6 0\n7 7 3 3 3 7',
                    bladz(20, 4, 3), bladz(3000, 50, 10), bladz(3000, 1000, 100), `3000 ${MLD}\n${losowe(r, 3000, -MLD, MLD).join(' ')}`, bladz(3000, 0, 1)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 3000 && t.length === n + 2 && wZakresie([t[1]], 0, 2 * MLD) && wZakresie(t.slice(2), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), k = t[1], v = t.slice(2); let bl = 0, bs = 0; for (let i = 0; i < v.length; i++) { let mx = v[i], mn = v[i]; for (let j = i; j < v.length; j++) { mx = Math.max(mx, v[j]); mn = Math.min(mn, v[j]); if (mx - mn > k) break; if (j - i + 1 > bl) { bl = j - i + 1; bs = i; } } } return `${bl} ${bs + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int najDl = 0, najStart = 0;
    for (int i = 0; i < n; i++) {
        long long mx = a[i], mn = a[i];
        for (int j = i; j < n; j++) {
            mx = max(mx, a[j]);
            mn = min(mn, a[j]);
            if (mx - mn > k) break;
            if (j - i + 1 > najDl) {
                najDl = j - i + 1;
                najStart = i;
            }
        }
    }
    cout << najDl << " " << najStart + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-pole-dzialki', krok: 9, level: 'trudne',
            title: 'Pole działki',
            short: 'Pole wielokąta ze wzoru sznurowadłowego: suma iloczynów po kolejnych wierzchołkach, moduł i połowa.',
            tags: ['wzór sznurowadłowy', 'abs na końcu', 'long long'],
            statement: ['Działka ma kształt wielokąta o n wierzchołkach (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ) podanych po kolei wzdłuż brzegu — zgodnie z ruchem wskazówek zegara albo przeciwnie. Brzeg działki nigdzie się nie przecina.', 'Pole wielokąta liczy się ze wzoru sznurowadłowego: P = |S| / 2, gdzie S = (x₁y₂ − x₂y₁) + (x₂y₃ − x₃y₂) + … + (xₙ₋₁yₙ − xₙyₙ₋₁) + (xₙy₁ − x₁yₙ) — w każdym nawiasie są dwa kolejne wierzchołki, a ostatni łączymy z pierwszym. Wypisz pole działki z dokładnie jedną cyfrą po kropce.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy współrzędne kolejnego wierzchołka: x i y.'],
            output_format: ['Jedna liczba z jedną cyfrą po kropce (całkowita albo „i pół”).'],
            constraints: ['3 ≤ n ≤ 1000', '|każda współrzędna| ≤ 10⁶'],
            examples: [{ input: '4\n0 0\n4 0\n4 3\n0 3', note: 'Prostokąt 4 × 3: S = 0 + 12 + 12 + 0 = 24, pole 12.' }, { input: '3\n0 0\n0 1\n1 0', note: 'Wierzchołki zgodnie z ruchem wskazówek zegara: S = −1, a pole to |−1| / 2 = 0.5.' }],
            hint: R`W pętli dla i od 0 do n − 1 weź wierzchołek i oraz następny j = (i + 1) % n (dla ostatniego następnym jest pierwszy) i dodaj x[i] * y[j] - x[j] * y[i]. Iloczyny sięgają 10¹², a suma — 10¹⁵: long long. Na końcu S = abs(S) (znak mówi tylko, w którą stronę obchodzimy brzeg) i wypisz S / 2, kropkę oraz 5 albo 0 — jak przy polu trójkąta.`,
            tests: (r) => {
                const wielokat = (n, R2, odwr) => {
                    for (;;) {
                        const pkt = new Map();
                        while (pkt.size < n) {
                            const kat = r() * 2 * Math.PI, prom = R2 * (0.2 + 0.8 * r());
                            const x = Math.round(prom * Math.cos(kat)), y = Math.round(prom * Math.sin(kat));
                            if (x === 0 && y === 0) continue;
                            const a = Math.atan2(y, x);
                            if (![...pkt.values()].some((p) => p.a === a)) pkt.set(`${x} ${y}`, { x, y, a });
                        }
                        const v = [...pkt.values()].sort((p, q) => p.a - q.a);
                        let ok = true;
                        for (let i = 0; i < n; i++) { const g = (v[(i + 1) % n].a - v[i].a + 2 * Math.PI) % (2 * Math.PI); if (g >= Math.PI - 1e-9) ok = false; }
                        if (!ok) continue;
                        const w = v.map((p) => `${p.x} ${p.y}`);
                        if (odwr) w.reverse();
                        const s = r.int(0, n - 1);
                        return `${n}\n${w.slice(s).concat(w.slice(0, s)).join('\n')}`;
                    }
                };
                return ['3\n0 0\n1 0\n0 1', '3\n-1000000 -1000000\n1000000 -1000000\n1000000 1000000', '4\n-1000000 -1000000\n-1000000 1000000\n1000000 1000000\n1000000 -1000000',
                    '6\n0 0\n4 0\n4 1\n1 1\n1 3\n0 3', '3\n0 0\n2 2\n4 4',
                    wielokat(5, 10, false), wielokat(8, 100, true), wielokat(300, 1000000, false), wielokat(1000, 1000000, true), wielokat(1000, 1000000, false)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 3 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -1000000, 1000000) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[0]; let S = 0; for (let i = 0; i < n; i++) { const j = (i + 1) % n; S += t[1 + 2 * i] * t[2 + 2 * j] - t[1 + 2 * j] * t[2 + 2 * i]; } return pol(Math.abs(S)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
    long long S = 0;
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        S += x[i] * y[j] - x[j] * y[i];
    }
    S = abs(S);
    cout << S / 2 << "." << (S % 2 == 1 ? 5 : 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-najblizszy-palindrom', krok: 9, level: 'trudne',
            title: 'Najbliższy palindrom',
            short: 'Dla każdej liczby znajdź najbliższą liczbę-palindrom. Szukaj na zmianę w dół i w górę — przy remisie mniejsza.',
            tags: ['szukanie na zmianę w dół i w górę', 'odwracanie liczby', 'remis: mniejszy'],
            statement: ['Liczba jest palindromem, jeśli czytana od tyłu jest taka sama, na przykład 7, 121 albo 4554. Dla każdej z t liczb n wypisz w osobnym wierszu palindrom leżący najbliżej n (może to być samo n). Jeśli dwa palindromy są tak samo blisko n, wypisz mniejszy.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W drugim wierszu t liczb całkowitych n.'],
            output_format: ['t wierszy — najbliższe palindromy.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10⁹'],
            examples: [{ input: '4\n123 10 99 4554', note: '123 leży 2 od 121 i 8 od 131. 10 leży 1 od 9 i 1 od 11 — remis, więc mniejszy: 9.' }],
            hint: R`Sprawdzaj kandydatów po kolei od odległości d = 0 w górę: najpierw n - d (jeśli nie jest ujemne), potem n + d — pierwszy palindrom, który znajdziesz, jest najbliższy, a dzięki kolejności przy remisie wygra mniejszy. Czy x jest palindromem: odwróć go cyframi (odw = odw * 10 + y % 10; y /= 10; w pętli) i porównaj z x — w long long. Palindromy nigdy nie leżą od siebie dalej niż o kilkanaście tysięcy, więc takie szukanie jest szybkie.`,
            tests: (r) => ['1\n0', '1\n1000000000', '1\n999999999', '6\n10 11 12 99 100 101', '5\n1000 1001 1099 1100 1111', `4\n100000000 99999999 100010001 100005001`,
                `30\n${losowe(r, 30, 0, 1000).join(' ')}`, `100\n${losowe(r, 100, 0, MLD).join(' ')}`, `100\n${Array.from({ length: 100 }, () => r.int(100000000, 999999999)).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 100 && t.length === n + 1 && wZakresie(t.slice(1), 0, MLD) ? null : 'zakres'; },
            solve: (inp) => { const pal = (x) => { const s = String(x); return s === [...s].reverse().join(''); }; return toks(inp).slice(1).map(Number).map((n) => { for (let d = 0; ; d++) { if (n - d >= 0 && pal(n - d)) return String(n - d); if (pal(n + d)) return String(n + d); } }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long n;
        cin >> n;
        long long wynik = -1;
        for (long long d = 0; wynik < 0; d++) {
            long long kand[2] = {n - d, n + d};
            for (int q = 0; q < 2 && wynik < 0; q++) {
                long long x = kand[q];
                if (x < 0) continue;
                long long y = x, odw = 0;
                while (y > 0) {
                    odw = odw * 10 + y % 10;
                    y /= 10;
                }
                if (odw == x) wynik = x;
            }
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-b-odleglosci-w-miescie', krok: 9, level: 'trudne',
            title: 'Wszystkie odległości w mieście',
            short: 'Suma odległości miejskich między wszystkimi parami domów — x i y osobno, z sortowaniem.',
            tags: ['osobno x i y', 'sort i sumy prefiksowe', 'long long'],
            statement: ['W mieście o ulicach w kratkę stoi n domów, w punktach o współrzędnych całkowitych. Dla każdej pary domów liczymy odległość miejską |x₁ − x₂| + |y₁ − y₂|. Wypisz sumę tych odległości dla wszystkich par domów (każdą parę liczymy raz).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy współrzędne domu: x i y.'],
            output_format: ['Jedna liczba — suma odległości wszystkich par.'],
            constraints: ['2 ≤ n ≤ 4000', '|każda współrzędna| ≤ 10⁶'],
            examples: [{ input: '3\n0 0\n2 5\n4 1', note: 'Pary: 2 + 5 = 7, 4 + 1 = 5 i 2 + 4 = 6. Razem 18.' }],
            hint: R`Suma rozkłada się na sumę różnic x i sumę różnic y — liczysz je osobno. Dla jednej współrzędnej: posortuj liczby; liczba v[i] jest większa od wszystkich i liczb przed nią, więc wnosi i · v[i] − (suma liczb przed nią). Jedno przejście z bieżącą sumą. Można też dwiema pętlami po wszystkich parach — 8 milionów par to jeszcze dość szybko. Wynik w long long.`,
            tests: (r) => {
                const gen = (n, R2) => `${n}\n${Array.from({ length: n }, () => `${r.int(-R2, R2)} ${r.int(-R2, R2)}`).join('\n')}`;
                return ['2\n0 0\n0 0', '2\n-1000000 -1000000\n1000000 1000000', '4\n0 0\n0 1\n1 0\n1 1', `4000\n${Array.from({ length: 4000 }, (_, i) => (i % 2 ? '1000000 1000000' : '-1000000 -1000000')).join('\n')}`, gen(10, 10), gen(500, 1000000), gen(4000, 1000000), gen(4000, 20)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 2 && n <= 4000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -1000000, 1000000) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[0]; const czesc = (v) => { v.sort((a, b) => a - b); let s = 0, pref = 0; v.forEach((x, i) => { s += i * x - pref; pref += x; }); return s; }; const xs = [], ys = []; for (let i = 0; i < n; i++) { xs.push(t[1 + 2 * i]); ys.push(t[2 + 2 * i]); } return String(czesc(xs) + czesc(ys)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> xs(n), ys(n);
    for (int i = 0; i < n; i++) cin >> xs[i] >> ys[i];
    long long wynik = 0;
    for (int q = 0; q < 2; q++) {
        vector<long long> &v = (q == 0 ? xs : ys);
        sort(v.begin(), v.end());
        long long pref = 0;
        for (int i = 0; i < n; i++) {
            wynik += (long long)i * v[i] - pref;
            pref += v[i];
        }
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-kurier', krok: 9, level: 'trudne',
            title: 'Kurier zachłanny',
            short: 'Kurier zawsze jedzie pod najbliższy nieodwiedzony adres (odległość miejska). Wypisz kolejność i długość trasy.',
            tags: ['najbliższy nieodwiedzony', 'tablica odwiedzin', 'odległość miejska', 'long long'],
            statement: ['Kurier wyjeżdża z magazynu w punkcie (0, 0) miasta o ulicach w kratkę i ma dostarczyć n paczek pod adresy ponumerowane od 1. Zawsze jedzie pod adres, który leży najbliżej jego obecnego miejsca (w odległości miejskiej), spośród adresów, pod którymi jeszcze nie był. Przy remisie wybiera adres o mniejszym numerze. Po dostarczeniu ostatniej paczki wraca do magazynu.', 'Wypisz w pierwszym wierszu numery adresów w kolejności odwiedzania, a w drugim — długość całej trasy razem z powrotem.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy współrzędne adresu: x i y (adresy mogą się powtarzać).'],
            output_format: ['W pierwszym wierszu n numerów, w drugim jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '|każda współrzędna| ≤ 10⁶'],
            examples: [{ input: '4\n3 1\n-2 0\n1 1\n5 5', note: 'Z (0, 0) adresy 2 i 3 są po 2 — wygrywa 2. Potem 3 (4 kroki), 1 (2 kroki), 4 (6 kroków) i powrót (10). Razem 24.' }],
            hint: R`Tablica bool odwiedzony[1000] i pozycja kuriera (cx, cy). W pętli wykonywanej n razy przejdź po wszystkich nieodwiedzonych adresach i wybierz ten z najmniejszym abs(x - cx) + abs(y - cy) (podmieniaj tylko przy ściśle mniejszym — przy remisie zostanie mniejszy numer). Dodaj odległość do trasy, oznacz adres i przenieś tam kuriera. Na koniec dodaj powrót abs(cx) + abs(cy). Trasa w long long.`,
            tests: (r) => {
                const gen = (n, R2) => `${n}\n${Array.from({ length: n }, () => `${r.int(-R2, R2)} ${r.int(-R2, R2)}`).join('\n')}`;
                return ['1\n0 0', '1\n-1000000 1000000', '3\n1 0\n0 1\n-1 0', '4\n2 2\n2 2\n-2 -2\n-2 -2', gen(8, 5), gen(100, 1000), gen(1000, 1000000), gen(1000, 10)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -1000000, 1000000) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(Number), n = t[0], odw = Array(n).fill(false), kol = [];
                let cx = 0, cy = 0, s = 0;
                for (let k = 0; k < n; k++) {
                    let b = -1, bd = 0;
                    for (let i = 0; i < n; i++) { if (odw[i]) continue; const d = Math.abs(t[1 + 2 * i] - cx) + Math.abs(t[2 + 2 * i] - cy); if (b < 0 || d < bd) { b = i; bd = d; } }
                    odw[b] = true; kol.push(b + 1); s += bd; cx = t[1 + 2 * b]; cy = t[2 + 2 * b];
                }
                return `${kol.join(' ')}\n${s + Math.abs(cx) + Math.abs(cy)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
    vector<bool> odwiedzony(n, false);
    long long cx = 0, cy = 0, trasa = 0;
    for (int k = 0; k < n; k++) {
        int naj = -1;
        long long najD = 0;
        for (int i = 0; i < n; i++) {
            if (odwiedzony[i]) continue;
            long long d = abs(x[i] - cx) + abs(y[i] - cy);
            if (naj < 0 || d < najD) {
                naj = i;
                najD = d;
            }
        }
        odwiedzony[naj] = true;
        cout << naj + 1 << " ";
        trasa += najD;
        cx = x[naj];
        cy = y[naj];
    }
    trasa += abs(cx) + abs(cy);
    cout << "\n" << trasa << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-b-teleturniej', krok: 9, level: 'trudne',
            title: 'Wielki finał: teleturniej „Zgadnij liczbę”',
            short: 'Punkty za bliskość strzału, premia dla najbliższych w rundzie i ranking z remisami — wszystko naraz.',
            tags: ['max(0, 10 − |strzał − sekret|)', 'najbliżsi z remisami', 'sort z lambdą', 'pary i vector'],
            statement: ['W teleturnieju gra n zawodników przez m rund. W każdej rundzie prowadzący ma sekretną liczbę, a każdy zawodnik podaje swój strzał. Punkty w rundzie liczymy tak:', '• każdy zawodnik dostaje max(0, 10 − |strzał − sekret|) punktów — trafienie to 10 punktów, pomyłka o 3 to 7 punktów, a pomyłka o 10 lub więcej — 0,', '• dodatkowo zawodnicy, którzy w tej rundzie byli najbliżej sekretu (może ich być kilku), dostają premię 5 punktów.', 'Po wszystkich rundach wypisz ranking: w każdym wierszu imię zawodnika i jego łączną liczbę punktów, od najlepszego. Przy równej liczbie punktów wyżej stoi zawodnik, który zdobył więcej premii, a przy dalszym remisie — ten, którego imię jest wcześniej w alfabecie.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n różnych imion zawodników.', 'W każdym z następnych m wierszy: sekret, a po nim n strzałów — w kolejności zawodników z drugiego wiersza.'],
            output_format: ['n wierszy — imię i liczba punktów, w kolejności rankingu.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ m ≤ 100', '|każda liczba| ≤ 10⁶', 'imiona są różne, składają się z liter (od 1 do 20)'],
            examples: [
                { input: '3 2\nAla Bartek Cela\n50 47 55 50\n10 12 8 30', note: 'Runda 1: 7, 5 i 10 punktów, premia dla Celi (trafiła). Runda 2: 8, 8 i 0, premia dla Ali i Bartka. Razem: Ala 20, Bartek 18, Cela 15.' },
                { input: '2 1\nZosia Adam\n0 3 -3', note: 'Oboje mają po 7 punktów i po premii — o kolejności decyduje alfabet.' },
            ],
            hint: R`Dla każdej rundy: najpierw policz odległości wszystkich zawodników abs(strzał - sekret) i znajdź najmniejszą. Potem dodaj każdemu max(0, 10 - odległość), a tym, których odległość jest równa najmniejszej — jeszcze 5 punktów i +1 do licznika premii. Ranking: vector indeksów (albo struktur) posortowany lambdą: najpierw więcej punktów, potem więcej premii, potem imię <. Odległość mieści się w int, ale 10 - odległość bywa mocno ujemne — dlatego max(0, …).`,
            tests: (r) => {
                const gen = (n, m, R2, roz) => {
                    const im = imiona(r, n);
                    const rundy = Array.from({ length: m }, () => { const s = r.int(-R2, R2); return [s, ...Array.from({ length: n }, () => Math.max(-R2, Math.min(R2, r.int(0, 4) ? s + r.int(-roz, roz) : r.int(-R2, R2))))].join(' '); });
                    return `${n} ${m}\n${im.join(' ')}\n${rundy.join('\n')}`;
                };
                return ['1 1\nSolo 5 5', '2 2\nAa Ab\n0 1 -1\n0 -1 1', `2 1\nX Y\n${1000000} ${-1000000} ${1000000}`, gen(4, 3, 20, 6), gen(10, 20, 1000, 12), gen(100, 100, 1000000, 15), gen(100, 100, 30, 4), gen(50, 60, 1000000, 9)];
            },
            check: (inp) => {
                const t = toks(inp), n = Number(t[0]), m = Number(t[1]);
                if (!(n >= 1 && n <= 100 && m >= 1 && m <= 100 && t.length === 2 + n + m * (n + 1))) return 'n m';
                const im = t.slice(2, 2 + n);
                if (!im.every((s) => /^[A-Za-z]{1,20}$/.test(s)) || new Set(im).size !== n) return 'imiona';
                return wZakresie(t.slice(2 + n), -1000000, 1000000) ? null : 'liczby';
            },
            solve: (inp) => {
                const t = toks(inp), n = Number(t[0]), m = Number(t[1]), im = t.slice(2, 2 + n);
                const pkt = Array(n).fill(0), prem = Array(n).fill(0);
                for (let k = 0; k < m; k++) {
                    const w = t.slice(2 + n + k * (n + 1), 2 + n + (k + 1) * (n + 1)).map(Number);
                    const d = w.slice(1).map((g) => Math.abs(g - w[0]));
                    const mn = Math.min(...d);
                    d.forEach((x, i) => { pkt[i] += Math.max(0, 10 - x); if (x === mn) { pkt[i] += 5; prem[i]++; } });
                }
                const kol = im.map((_, i) => i).sort((a, b) => pkt[b] - pkt[a] || prem[b] - prem[a] || (im[a] < im[b] ? -1 : im[a] > im[b] ? 1 : 0));
                return kol.map((i) => `${im[i]} ${pkt[i]}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> imie(n);
    for (int i = 0; i < n; i++) cin >> imie[i];
    vector<int> punkty(n, 0), premie(n, 0);
    for (int k = 0; k < m; k++) {
        int sekret;
        cin >> sekret;
        vector<int> d(n);
        int najD = INT_MAX;
        for (int i = 0; i < n; i++) {
            int strzal;
            cin >> strzal;
            d[i] = abs(strzal - sekret);
            najD = min(najD, d[i]);
        }
        for (int i = 0; i < n; i++) {
            punkty[i] += max(0, 10 - d[i]);
            if (d[i] == najD) {
                punkty[i] += 5;
                premie[i]++;
            }
        }
    }
    vector<int> kol(n);
    for (int i = 0; i < n; i++) kol[i] = i;
    sort(kol.begin(), kol.end(), [&](int a, int b) {
        if (punkty[a] != punkty[b]) return punkty[a] > punkty[b];
        if (premie[a] != premie[b]) return premie[a] > premie[b];
        return imie[a] < imie[b];
    });
    for (int i : kol) cout << imie[i] << " " << punkty[i] << "\n";
    return 0;
}`,
        },
    ];
};
