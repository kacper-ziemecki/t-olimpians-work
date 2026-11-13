// Pomocniki do zadań z lekcji Zbiór.
//
// Zbior — posortowany zbiór (albo multizbiór) na zwykłej tablicy: wyszukiwanie binarne i splice.
// Wystarcza do kilkudziesięciu tysięcy operacji w testach; dla wielkich danych używamy Set i sortowania.
// Porównanie cmp działa jak w C++: liczby, BigInt i napisy ASCII (kolejność bajtów) oraz pary [a, b].

const gen = require('./zlozonosc-pomoc');

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const cmpPar = (p, q) => cmp(p[0], q[0]) || cmp(p[1], q[1]);

class Zbior {
    constructor(porownaj = cmp, multi = false) { this.a = []; this.c = porownaj; this.multi = multi; }
    lower(x) { let l = 0, r = this.a.length; while (l < r) { const m = (l + r) >> 1; if (this.c(this.a[m], x) < 0) l = m + 1; else r = m; } return l; }
    upper(x) { let l = 0, r = this.a.length; while (l < r) { const m = (l + r) >> 1; if (this.c(this.a[m], x) <= 0) l = m + 1; else r = m; } return l; }
    has(x) { const i = this.lower(x); return i < this.a.length && this.c(this.a[i], x) === 0; }
    count(x) { return this.upper(x) - this.lower(x); }
    // wstawia; w zwykłym zbiorze zwraca false, gdy element już był
    add(x) {
        const i = this.lower(x);
        if (!this.multi && i < this.a.length && this.c(this.a[i], x) === 0) return false;
        this.a.splice(this.multi ? this.upper(x) : i, 0, x);
        return true;
    }
    // usuwa jedną kopię (jak erase(find(x)))
    del(x) { const i = this.lower(x); if (i < this.a.length && this.c(this.a[i], x) === 0) { this.a.splice(i, 1); return true; } return false; }
    // usuwa wszystkie kopie (jak erase(x)), zwraca ich liczbę
    delAll(x) { const l = this.lower(x), r = this.upper(x); this.a.splice(l, r - l); return r - l; }
    get size() { return this.a.length; }
    min() { return this.a[0]; }
    max() { return this.a[this.a.length - 1]; }
}

// Kopiec minimum (do symulacji „zawsze bierz najmniejszy” na wielkich danych).
class Kopiec {
    constructor(porownaj = cmp) { this.h = []; this.c = porownaj; }
    get size() { return this.h.length; }
    top() { return this.h[0]; }
    push(x) { const h = this.h; h.push(x); let i = h.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.c(h[i], h[p]) >= 0) break; [h[i], h[p]] = [h[p], h[i]]; i = p; } }
    pop() {
        const h = this.h, top = h[0], last = h.pop();
        if (h.length) {
            h[0] = last;
            let i = 0;
            for (;;) {
                const l = 2 * i + 1, r = l + 1;
                let m = i;
                if (l < h.length && this.c(h[l], h[m]) < 0) m = l;
                if (r < h.length && this.c(h[r], h[m]) < 0) m = r;
                if (m === i) break;
                [h[i], h[m]] = [h[m], h[i]];
                i = m;
            }
        }
        return top;
    }
}

const rosnaco = (a) => a.slice().sort(cmp);
const rozne = (a) => [...new Set(a)].sort(cmp);
// unikalne losowe słowa / liczby
function unikalne(r, ile, los) { const s = new Set(); let proby = 0; while (s.size < ile) { s.add(los()); if (++proby > ile * 50) throw new Error('za mało różnych wartości do wylosowania'); } return [...s]; }
const imie = (r, min = 3, max = 8) => { const w = r.word(r.int(min, max)); return w[0].toUpperCase() + w.slice(1); };

module.exports = { ...gen, cmp, cmpPar, Zbior, Kopiec, rosnaco, rozne, unikalne, imie };
