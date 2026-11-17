// Pomocniki do zadań z lekcji Input i Output (+).
//
// rozrzuc — rozkłada tokeny po „taśmie” (spacje, entery, puste wiersze), jak dane z prawdziwych zadań;
// imiona, słowa i zdania bez polskich liter (testy są w ASCII, żeby liczenie znaków było jednoznaczne);
// generator ciągu z lekcji o złożoności (xᵢ = (xᵢ₋₁ · a + b) mod m) do zadań z danymi „z przepisu”.

const Z = require('./zlozonosc-pomoc');

const IMIONA = ['Ala', 'Ola', 'Ela', 'Ewa', 'Iga', 'Ida', 'Ula', 'Zosia', 'Kasia', 'Basia', 'Hania', 'Lena', 'Maja', 'Nina',
    'Zuzia', 'Julia', 'Anna', 'Marta', 'Kuba', 'Jan', 'Adam', 'Olek', 'Bartek', 'Tomek', 'Igor', 'Antek', 'Franek', 'Staszek',
    'Wojtek', 'Szymon', 'Filip', 'Michal', 'Kacper', 'Leon', 'Tymon', 'Oskar', 'Piotr', 'Pawel', 'Marek', 'Karol', 'Zuzanna',
    'Wiktoria', 'Natalia', 'Aleksander', 'Maksymilian', 'Jagoda', 'Ksawery', 'Bogumila', 'Teodor', 'Jerzy'];
const NAZWISKA = ['Nowak', 'Kowalski', 'Wisniewska', 'Wojcik', 'Kowalczyk', 'Kaminska', 'Lewandowski', 'Zielinska', 'Szymanski',
    'Wozniak', 'Dabrowska', 'Kozlowski', 'Jankowska', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowska', 'Grabowski', 'Lis',
    'Pawlak', 'Michalska', 'Zajac', 'Krol', 'Wieczorek', 'Jablonska', 'Wrobel', 'Majewski', 'Olszewska', 'Stepien', 'Malinowski'];
const MIASTA = ['Krakow', 'Warszawa', 'Gdansk', 'Poznan', 'Wroclaw', 'Lodz', 'Lublin', 'Torun', 'Opole', 'Kielce', 'Nowy Sacz',
    'Zielona Gora', 'Bielsko Biala', 'Gorzow Wielkopolski', 'Stalowa Wola', 'Ostrow Mazowiecka', 'Rzeszow', 'Olsztyn', 'Elk', 'Hel'];
const SLOWA = ['ala', 'ma', 'kota', 'pies', 'dom', 'szkola', 'las', 'rzeka', 'gra', 'kod', 'dane', 'plik', 'wiersz', 'petla',
    'tablica', 'napis', 'liczba', 'zbior', 'wynik', 'test', 'olimpiada', 'zadanie', 'program', 'komputer', 'klawiatura', 'ekran',
    'mysz', 'okno', 'drzwi', 'lampa', 'ksiazka', 'zeszyt', 'olowek', 'kreda', 'lawka', 'boisko', 'pilka', 'rower', 'auto',
    'pociag', 'statek', 'most', 'droga', 'miasto', 'wies', 'gora', 'morze', 'jezioro', 'i', 'w', 'na', 'do', 'z', 'jest', 'bardzo',
    'dlugi', 'krotki', 'nowy', 'stary', 'szybki', 'wolny', 'dobry', 'zly', 'maly', 'duzy'];
const PRODUKTY = ['mleko', 'chleb', 'maslo', 'ser', 'jajka', 'jablka', 'gruszki', 'banany', 'ryz', 'makaron', 'cukier', 'sol',
    'herbata', 'kawa', 'woda', 'sok', 'szynka', 'kurczak', 'ryba', 'pomidory', 'ogorki', 'cebula', 'czosnek', 'marchew',
    'ziemniaki', 'jogurt', 'kefir', 'twarog', 'miod', 'dzem', 'platki', 'kakao', 'orzechy', 'rodzynki', 'maka'];

// Tokeny rozrzucone po wierszach. styl: 'mix' (spacje, entery, puste wiersze), 'wiersz' (jedna linia), 'kolumna' (po jednym w wierszu).
function rozrzuc(r, t, styl = 'mix') {
    if (!t.length) return '';
    let s = String(t[0]);
    for (let i = 1; i < t.length; i++) {
        let sep = ' ';
        if (styl === 'kolumna') sep = '\n';
        else if (styl === 'mix') {
            const p = r();
            sep = p < 0.6 ? ' ' : p < 0.85 ? '\n' : p < 0.93 ? '   ' : p < 0.97 ? '\n\n' : '\n\n\n';
        }
        s += sep + t[i];
    }
    return s;
}

const losy = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
const calk = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;
const czyLiczba = (t) => /^-?\d+$/.test(t);

// Zdanie z losowych słów: pierwsza litera wielka, kropka na końcu (bez polskich liter).
function zdanie(r, minW, maxW) {
    const n = r.int(minW, maxW);
    const w = Array.from({ length: n }, () => r.pick(SLOWA));
    const s = w.join(' ');
    return s[0].toUpperCase() + s.slice(1) + '.';
}
const imieNazwisko = (r) => `${r.pick(IMIONA)} ${r.pick(NAZWISKA)}`;

// Kwota w groszach jako „Z.GG” (sep = '.' albo ',').
const zlote = (gr, sep = '.') => {
    const g = BigInt(gr);
    const neg = g < 0n, a = neg ? -g : g;
    return `${neg ? '-' : ''}${a / 100n}${sep}${String(a % 100n).padStart(2, '0')}`;
};

module.exports = { ...Z, IMIONA, NAZWISKA, MIASTA, SLOWA, PRODUKTY, rozrzuc, losy, calk, czyLiczba, zdanie, imieNazwisko, zlote };
