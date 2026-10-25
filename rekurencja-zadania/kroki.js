// Kroki kursu rekurencji = zagadnienia tematu „Funkcje rekurencyjne” w kompendium (net.html)
// i działy „Rekurencja / krok N: …” w zadania-tematowe-app/zadania.html.
// Każdy krok: prezentacja (pdf-src/build-prezentacja-rekurencja-N.js) → filmy Strivera → zadania.

const SITE = 'https://t-olimpians.com';
const STRIVER = 'take U forward (Striver)';
const yt = (id, title, duration) => ({ title, url: `https://www.youtube.com/watch?v=${id}`, author: STRIVER, duration });

const TEMAT_NOTE =
    'Rekurencja od zera w 6 krokach — dla kogoś, kto jeszcze nigdy nie napisał funkcji wołającej samą siebie. ' +
    'W każdym kroku najpierw przejrzyj prezentację (slajdy krok po kroku, z kodem i śledzeniem wywołań), ' +
    'potem obejrzyj filmy Strivera z playlisty „Recursion (Basics to Advanced) and Backtracking”, a na końcu zrób zadania ' +
    'T-Olimpians z automatyczną sprawdzarką C++ (każde ma wskazówkę). Kroki budują jeden na drugim — przerabiaj je po kolei.';

const KROKI = [
    {
        nr: 1,
        name: 'Krok 1 · Pierwsze kroki — funkcja, która woła samą siebie',
        category: 'Rekurencja / krok 1: pierwsze kroki',
        note: 'Funkcja, która wywołuje samą siebie: warunek stopu, kolejne kopie funkcji na stosie wywołań, ' +
            'kod przed wywołaniem (w drodze w dół) i po wywołaniu (w drodze powrotnej). Zadania tylko wypisują — ' +
            'odliczanie, napisy, gwiazdki, cyfry, zapis dwójkowy.',
        slides: { file: 'prezentacja-rekurencja-1-pierwsze-kroki', label: 'Pierwsze kroki' },
        videos: [
            yt('yVdKa8dnKiE', 'Re 1. Introduction to Recursion | Recursion Tree | Stack Space | Strivers A2Z DSA Course', '22:46'),
            yt('un6PLygfXrA', 'Re 2. Problems on Recursion | Strivers A2Z DSA Course', '22:04'),
        ],
        extraLinks: [
            { label: 'lekcja: Rekurencja w C++', url: `${SITE}/c++_logika/rekurencja.html` },
            { label: 'wszystkie zadania z rekurencji', url: `${SITE}/zadania-tematowe-app/zadania.html?szukaj=Rekurencja` },
        ],
    },
    {
        nr: 2,
        name: 'Krok 2 · Rekurencja, która zwraca wynik',
        category: 'Rekurencja / krok 2: funkcje zwracające wynik',
        note: 'Funkcje rekurencyjne z return: suma, silnia, potęga, cyfry liczby, tablice i napisy (indeks jako parametr), ' +
            'NWD. Zaufaj mniejszemu wywołaniu: „jeśli f(n − 1) już działa, jak z niego zrobić f(n)?”. ' +
            'Rekurencja z parametrem (akumulatorem) kontra rekurencja zwracająca wynik.',
        slides: { file: 'prezentacja-rekurencja-2-zwracanie-wyniku', label: 'Rekurencja, która zwraca wynik' },
        videos: [
            yt('69ZCDFy-OUo', 'Re 3. Parameterised and Functional Recursion | Strivers A2Z DSA Course', '18:14'),
            yt('twuC1F6gLI8', 'Re 4. Problems on Functional Recursion | Strivers A2Z DSA Course', '19:48'),
        ],
    },
    {
        nr: 3,
        name: 'Krok 3 · Wiele wywołań — drzewo rekurencji i memoizacja',
        category: 'Rekurencja / krok 3: drzewo rekurencji i memoizacja',
        note: 'Funkcja, która woła siebie dwa razy: Fibonacci, wieże Hanoi, drzewo wywołań i to, dlaczego potrafi być ' +
            'ogromne. Memoizacja — zapamiętywanie wyników w tablicy — i pierwsze zadania „ile jest sposobów?”: ' +
            'schody, ścieżki na planszy, trójkąt Pascala, żaba, rozkłady liczby. To most do programowania dynamicznego.',
        slides: { file: 'prezentacja-rekurencja-3-drzewo-i-memoizacja', label: 'Drzewo rekurencji i memoizacja' },
        videos: [
            yt('kvRjNm4rVBE', 'Re 5. Multiple Recursion Calls | Problems | Strivers A2Z DSA Course', '16:45'),
        ],
    },
    {
        nr: 4,
        name: 'Krok 4 · Generowanie: ciągi, podzbiory, permutacje',
        category: 'Rekurencja / krok 4: generowanie wszystkich możliwości',
        note: 'Rekurencja, która przegląda wszystkie możliwości: ciągi zero-jedynkowe, „bierz / nie bierz” (podzbiory), ' +
            'kombinacje, permutacje, nawiasowania. Cofanie wyboru (push_back / pop_back) i trzy wzorce: wypisz wszystkie, ' +
            'znajdź jedno, policz.',
        slides: { file: 'prezentacja-rekurencja-4-generowanie', label: 'Generowanie wszystkich możliwości' },
        videos: [
            yt('AxNNVECce8c', 'L6. Recursion on Subsequences | Printing Subsequences', '25:01'),
            yt('eQCS_v3bw0Q', 'L7. All Kind of Patterns in Recursion | Print All | Print one | Count', '34:12'),
            yt('OyZFFqQtu98', 'L8. Combination Sum | Recursion | Leetcode | C++ | Java', '27:00'),
            yt('G1fRTGRxXU8', 'L9. Combination Sum II | Leetcode | Recursion | Java | C++', '32:37'),
            yt('rYkfBRtMJr8', 'L10. Subset Sum I | Recursion | C++ | Java', '24:25'),
            yt('RIn3gOkbhQE', 'L11. Subset Sum II | Leetcode | Recursion', '30:16'),
            yt('YK78FU5Ffjw', 'L12. Print all Permutations of a String/Array | Recursion | Approach - 1', '19:07'),
            yt('f2ic2Rsc9pU', 'L13. Print all Permutations of a String/Array | Recursion | Approach - 2', '18:14'),
            yt('wT7gcXLYoao', 'L18. K-th Permutation Sequence | Leetcode', '24:41'),
        ],
    },
    {
        nr: 5,
        name: 'Krok 5 · Backtracking — szukanie z wycofywaniem',
        category: 'Rekurencja / krok 5: backtracking',
        note: 'Próbuj, sprawdzaj, wycofuj się: hetmany, labirynty, sudoku, kolorowanie grafu, podział na palindromy, ' +
            'wykreślanka. Obcinanie gałęzi, które na pewno nie dadzą rozwiązania.',
        slides: { file: 'prezentacja-rekurencja-5-backtracking', label: 'Backtracking' },
        videos: [
            yt('i05Ju7AftcM', 'L14. N-Queens | Leetcode Hard | Backtracking', '36:55'),
            yt('FWAIf_EVUKE', 'L15. Sudoko Solver | Backtracking', '26:10'),
            yt('wuVwUK25Rfc', 'L16. M-Coloring Problem | Backtracking', '24:37'),
            yt('WBgsABoClE0', 'L17. Palindrome Partitioning | Leetcode | Recursion | C++ | Java', '24:34'),
            yt('bLGZhJlt4y0', 'L19. Rat in A Maze | Backtracking', '25:10'),
        ],
    },
    {
        nr: 6,
        name: 'Krok 6 · Dziel i zwyciężaj',
        category: 'Rekurencja / krok 6: dziel i zwyciężaj',
        note: 'Podziel problem na połowy, rozwiąż każdą rekurencyjnie, połącz wyniki: szybkie potęgowanie, wyszukiwanie ' +
            'binarne, sortowanie przez scalanie, zliczanie inwersji, quickselect, fraktale i napisy definiowane rekurencyjnie.',
        slides: { file: 'prezentacja-rekurencja-6-dziel-i-zwyciezaj', label: 'Dziel i zwyciężaj' },
        videos: [
            yt('ogjf7ORKfd8', 'Merge Sort | Algorithm | Pseudocode | Dry Run | Code | Strivers A2Z DSA Course', '49:43'),
            yt('WIrA4YexLRQ', 'Quick Sort For Beginners | Strivers A2Z DSA Course', '35:17'),
            yt('AseUmwVNaoY', 'Count Inversions in an Array | Brute and Optimal', '24:17'),
        ],
    },
];

module.exports = { SITE, KROKI, TEMAT_NOTE };
