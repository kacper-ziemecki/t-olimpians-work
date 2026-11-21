# Kalendarz lekcji — wdrożenie backendu (Google Apps Script)

Nowa strona `kalendarz.html` potrzebuje nowego backendu (`Code.gs`). **Najpierw
zaktualizuj backend, dopiero potem wgraj stronę.** Nowy backend obsługuje też
starą stronę (`busyWeek` i `book`), więc w międzyczasie nic się nie zepsuje.

## 1. Podmień kod

1. Wejdź na <https://script.google.com> i otwórz projekt, który stoi za obecnym
   adresem `APPS_SCRIPT_URL` (ten sam, który jest w `kalendarz.html`).
2. **Zrób kopię starego kodu** (np. wklej go do pliku `stary-Code.gs.txt`).
3. Zastąp całą zawartość `Code.gs` plikiem `apps-script/Code.gs`.

## 2. Włącz Google Calendar API

W edytorze po lewej: **Usługi → + → Google Calendar API → Dodaj**
(identyfikator musi zostać `Calendar`).

Albo: **Ustawienia projektu → zaznacz „Pokaż plik manifestu appsscript.json”**
i wklej zawartość `apps-script/appsscript.json`.

## 3. Ustaw hasło panelu nauczyciela

**Ustawienia projektu (⚙) → Właściwości skryptu → Dodaj właściwość**

| Właściwość       | Wartość               |
|------------------|-----------------------|
| `ADMIN_PASSWORD` | Twoje hasło do panelu |

Hasła nie wpisuj do kodu.

### 3a. (opcjonalnie) Płatności kartą, BLIK i Google Pay — Stripe

Przelew na konto działa od razu, bez tego kroku. Żeby uczniowie (albo rodzice)
mogli płacić kartą, BLIK-iem i Google Pay, potrzebne jest konto u operatora
płatności. Kalendarz współpracuje ze **Stripe**. **Firma nie jest potrzebna:**
Stripe przyjmuje osoby prywatne i wypłaca pieniądze na konto osobiste.

1. **Załóż konto** na <https://dashboard.stripe.com/register> (kraj: Polska).
   Jako rodzaj działalności wybierz **osobę fizyczną / jednoosobową działalność**
   (nie spółkę). Branża: edukacja / korepetycje, strona: `https://t-olimpians.com`.
   Stripe poprosi o dane osobowe i dokument tożsamości — to robisz tylko Ty.
2. **Konto do wypłat:** `PL36 1090 1623 0000 0001 5199 7290`. Musi być na Twoje
   imię i nazwisko — Stripe porównuje je z danymi konta.
3. **Settings → Public details:** nazwa widoczna dla płacących `T-Olimpians`,
   opis na wyciągu karty (statement descriptor) np. `T-OLIMPIANS`, mail kontaktowy.
4. **Settings → Payment methods:** włącz **Cards**, **BLIK** i **Google Pay**
   (Apple Pay też warto, Przelewy24 — jeśli chcesz).
5. **Settings → Customer emails:** włącz „Successful payments”, żeby płacący
   dostał mailem potwierdzenie płatności.
6. **Najpierw test.** Przełącz panel Stripe na **Test mode**, w **Developers → API
   keys** skopiuj **Secret key** (`sk_test_…`) i dodaj go w Apps Script:
   **Ustawienia projektu → Właściwości skryptu → Dodaj**:

   | Właściwość          | Wartość     |
   |---------------------|-------------|
   | `STRIPE_SECRET_KEY` | `sk_test_…` |

   Uruchom funkcję **`setup`**. Ustawia ona sprawdzanie płatności co 10 minut
   i wypisuje w logu stan konta Stripe. Potem wdróż nową wersję (krok 6).
   Zapłać za dowolną lekcję kartą testową `4242 4242 4242 4242` (dowolna
   przyszła data i CVC) albo BLIK-iem z dowolnym 6-cyfrowym kodem. Lekcja
   powinna dostać ✓, a Ty — maila „💳 Opłacona lekcja”.
7. **Na żywo.** Gdy Stripe zatwierdzi konto, zmień wartość `STRIPE_SECRET_KEY` na
   `sk_live_…` i uruchom funkcję **`stripeStatus`**. Log pokaże, czy przyjmowanie
   płatności, wypłaty i BLIK są włączone.

Klucza nie wpisuj do kodu i nikomu go nie wysyłaj. Stripe może przy weryfikacji
poprosić, żeby na stronie były zasady zwrotów i odwołań lekcji oraz kontakt.

**Jak płyną pieniądze:** płacący → Stripe → Twoje konto. Wypłaty są automatyczne
i zbiorcze: pierwsza zwykle po ok. 7 dniach, potem co kilka dni roboczych.
Prowizje Stripe (listopad 2026): BLIK 1,6% + 1 zł, karty z EOG 1,5% + 1 zł
(premium 1,9% + 1 zł), Google Pay jak karta. Bez opłat miesięcznych, wypłaty
bez opłat. Z lekcji za 150 zł zostaje 146,75 zł (karta) albo 146,60 zł (BLIK).

**Tytuły:** przelew ma tytuł „Lekcja Jan Kowalski 24.10.2026 17:00”, a kod QR
ten sam, skrócony do 32 znaków. Odbiorca: `PAY_RECIPIENT` z `CONFIG` (imię
i nazwisko właściciela konta). Płatność przez Stripe ma ten sam opis w panelu
Stripe (Płatności) i metadane `uczen` oraz `termin`. Wypłata ze Stripe to jeden
przelew za kilka lekcji. Które lekcje się na nią składają, widać w panelu Stripe
(Wypłaty → szczegóły wypłaty).

**Co kalendarz robi sam:**
- Lekcja oznacza się jako opłacona zaraz po powrocie ze Stripe. Gdy ktoś zamknie
  kartę wcześniej, dzieje się to w ciągu kilkunastu minut.
- Drugi „Zapłać” za tę samą lekcję (np. rodzic i uczeń) otwiera tę samą stronę
  płatności, więc nie da się zapłacić dwa razy.
- Odwołanie lekcji zamyka jej otwartą płatność. Jeśli lekcja była już opłacona
  albo ktoś zapłacił za odwołaną, dostajesz mail „⚠️ Płatność do rozliczenia”.
  Zwrot robisz w panelu Stripe (Płatności → Zwróć).
- „Cofnij” przy opłaconej lekcji to Twoja decyzja — Stripe jej nie nadpisze.

**Bez firmy (działalność nierejestrowana):** w 2026 r. limit przychodu to
10 813,50 zł na kwartał (225% płacy minimalnej). Liczą się wszystkie lekcje, nie
tylko te opłacone przez Stripe. Po przekroczeniu masz 7 dni na rejestrację
w CEIDG. Zasady rozliczenia: <https://www.podatki.gov.pl> (Działalność
nierejestrowana), w razie wątpliwości zapytaj księgowego.

### 3b. (opcjonalnie) Bot Discord — przypomnienia na kanałach uczniów

Bot jest w osobnym folderze `Documents\t-olimpians-discord-bot` (pełna instrukcja
w jego `README.md`). Po stronie kalendarza:

1. Wybierz funkcję **`discordKey`** → **▶ Uruchom**. Tworzy ona właściwość skryptu
   `DISCORD_BOT_KEY` i wypisuje w logu klucz oraz adres backendu do pliku `.env` bota.
2. W panelu nauczyciela → „Wszyscy uczniowie, ceny i Discord” wpisz każdemu
   uczniowi nick z Discorda.

Dopóki nie ma `DISCORD_BOT_KEY`, kalendarz nie zapisuje zmian dla bota.

## 4. Sprawdź ustawienia na górze `Code.gs` (`CONFIG`)

- `CALENDAR_ID`: `'primary'`, czyli główny kalendarz konta, tak jak w starym
  skrypcie. Nie trzeba zmieniać.
- `NOTIFY_EMAILS`: maile o zmianach idą na `t.olympians.poland@gmail.com`,
  tak jak dotąd. Możesz dopisać kolejne adresy.
- `DAY_START` / `DAY_END`: domyślne godziny rezerwacji (10:00–21:00), dopóki nie
  ustawisz własnych w panelu (patrz niżej: „Godziny dostępności”).
- `PUBLIC_NAMES`: jak uczniowie widzą cudze lekcje. Masz do wyboru `'short'`
  („Jan K.”), `'full'` (pełne imię i nazwisko) albo `'hidden'` (tylko „Zajęte”).
  Ty w panelu zawsze widzisz wszystko.
- `APP_URL`: adres strony, używany w linkach w mailach.
- `PAY_ACCOUNT` / `PAY_RECIPIENT`: numer konta do przelewów i nazwa odbiorcy,
  którą płacący widzi w swoim banku. Przy koncie osobistym to imię i nazwisko
  właściciela konta (`'Kacper Ziemecki'`), bo banki coraz częściej porównują
  nazwę odbiorcy z numerem konta.

## 5. Uruchom `setup` (także po każdej aktualizacji, która prosi o nowe uprawnienia)

Na górze edytora wybierz funkcję **`setup`** → **▶ Uruchom** → zezwól na
dostęp (Kalendarz, Gmail, wyzwalacze). Funkcja ustawia codzienne zadanie
o 3:00, które dopisuje kolejne tygodnie lekcji „do odwołania”, i **przenosi
stare rezerwacje** („Konsultacja indywidualna – … (T-Olimpians)”) do nowego
systemu. Stare rezerwacje dostają imię, email, kolor i dają się przesuwać.
W logu zobaczysz, ile ich przeniosło i na jaki adres będą szły
powiadomienia. Migrację możesz też uruchomić osobno funkcją
`migrateOldBookings`; drugie uruchomienie niczego nie zdubluje.

## 6. Wdróż nową wersję (ten sam adres!)

**Wdróż → Zarządzaj wdrożeniami → ✏️ (edytuj) przy obecnej aplikacji
internetowej → Wersja: „Nowa wersja” → Wdróż.**

Nie klikaj „Nowe wdrożenie”, bo zmieni się adres URL i trzeba by go
podmienić w `kalendarz.html`.

## 7. Wgraj stronę

Wgraj na serwer z folderu `kalendarz-app/`:

- `kalendarz.html`,
- `sw.js` i `manifest.webmanifest` (aplikacja na telefon i powiadomienia),
- cały folder `icons/`.

Folderu `apps-script/` nie trzeba wgrywać (nie ma w nim haseł, ale na stronie
jest niepotrzebny).

## Jak z tego korzystać

- **Panel nauczyciela:** `…/kalendarz.html?kacperos` albo link „Panel nauczyciela”
  w stopce. Po zalogowaniu widzisz pełne dane uczniów i możesz dodawać lekcje
  dowolnym osobom (także poza godzinami). Możesz przeciągać lekcje, zmieniać
  ich termin (**⇄ Zamień termin**) i odwoływać je bez czyjejkolwiek zgody.
- **Godziny dostępności:** w panelu → sekcja „Godziny i limity lekcji” → **🕒 Zmień godziny i limity**. Każdy dzień tygodnia
  ma własne przedziały (np. pon 17:00–20:00, wt 10:00–12:00 i 16:00–20:00),
  a dzień można całkiem wyłączyć. Uczniowie mogą rezerwować tylko w tych
  godzinach i pilnuje tego także backend. Istniejące lekcje i serie zostają bez
  zmian, a Ty w panelu dalej dodajesz lekcje o dowolnej porze.
- **Limit lekcji na dzień:** w tym samym oknie każdy dzień ma pole „Limit lekcji
  na dzień” (np. pn: 1 h, sb: 5 h). Liczą się wszystkie lekcje tego dnia. Uczeń
  nie zarezerwuje lekcji ani nie przeniesie jej na dzień, który przekroczyłby
  limit. W serii takie dni można pominąć jak zajęte. W kalendarzu pełny dzień
  jest oznaczony, a nagłówek pokazuje, ile zostało. Ty w panelu możesz
  świadomie przekroczyć limit („Tak, dodaj mimo to”).
- **Tryb ekranu (TV / duży monitor):** przycisk ⛶, klawisz `F` albo
  `…/kalendarz.html?tv`. Cały tydzień mieści się na jednym ekranie, a kalendarz
  sam się odświeża.
- **Uczniowie** po pierwszej rezerwacji są zalogowani na tym urządzeniu. Na
  innych urządzeniach logują się linkiem „Moje lekcje” z maila. Mogą zmieniać
  termin swoich lekcji (**⇄ Zamień termin**) i je odwoływać. Zamiany lekcji
  między uczniami nie ma.
- **Maile do Ciebie** przychodzą przy nowej lekcji lub serii, zmianie terminu,
  odwołaniu i płatności kartą (oraz „Płatność do rozliczenia”, gdy ktoś zapłacił
  za odwołaną albo już opłaconą lekcję).
- **Aplikacja na telefon:** na Androidzie przycisk „Zainstaluj” (baner nad
  kalendarzem albo „Moje lekcje”). Na iPhonie i iPadzie: Safari → Udostępnij →
  „Do ekranu początkowego”. Zainstalowana aplikacja na iPhonie ma osobną pamięć,
  więc uczeń loguje się w niej **kodem z maila** („Moje lekcje” → „Wyślij mi kod”).
- **Powiadomienia na telefon** włączają się same w zainstalowanej aplikacji, gdy
  ktoś jest w niej zalogowany (uczeń kodem z maila, Ty hasłem do panelu). Telefon
  raz zapyta systemowo „Zezwolić na powiadomienia?” — to okienko jest wymagane
  przez system i nie da się go pominąć. W zwykłej karcie przeglądarki powiadomień
  nie ma. Wylogowanie z aplikacji je wyłącza. Uczeń
  dostaje powiadomienie, gdy ktoś inny (np. Ty) zmieni termin jego lekcji albo
  ją odwoła. Ty dostajesz powiadomienie o każdej rezerwacji, zmianie terminu,
  odwołaniu i płatności — także o zmianach, które robisz sam w panelu na innym
  urządzeniu (telefon, z którego robisz zmianę, nie dostaje powiadomienia o niej;
  wyłączysz to w `NOTIFY_ON_ADMIN_ACTIONS`). Na iPhonie i iPadzie potrzebny jest
  iOS 16.4 lub nowszy, a pytanie o zgodę pojawia się po pierwszym stuknięciu
  w aplikację.
- **Ceny i płatności:** w panelu → „Wszyscy uczniowie i ceny” wpisujesz cenę
  za lekcję każdego ucznia. Każdy, kto kliknie lekcję w kalendarzu (przeszłą
  albo przyszłą), widzi **💳 Zapłać za lekcję**: kwotę, numer konta, tytuł
  przelewu („Lekcja uczeń data godzina”) z przyciskami „Kopiuj” i kod QR do
  aplikacji banku, a gdy Stripe jest włączony — także kartę, BLIK i Google Pay.
  Płatność przez Stripe oznacza lekcję sama. Gdy dojdzie zwykły przelew, kliknij
  lekcję → **✓ Oznacz jako opłaconą**. Opłacone lekcje
  mają zielony znaczek ✓, a panel pokazuje „opłacone 1/2” przy każdym uczniu.
  Inni widzą w tytule skrócone imię („Jan K.”), uczeń i Ty — pełne.
- **Synchronizacja:** źródłem prawdy jest Twój Kalendarz Google. Jeśli
  przesuniesz albo usuniesz lekcję bezpośrednio w Google Calendar, strona pokaże
  to w ciągu ~20 s. Twoje prywatne wydarzenia uczniowie widzą tylko jako
  „Zajęte”, bez tytułu.

## Warto wiedzieć

- Uczniowie, którzy w starej wersji kliknęli „Dodaj lekcję do kalendarza”,
  mają u siebie osobną kopię wydarzenia, która nie zmieni się sama. O każdej
  zmianie dostaną maila. Nowe rezerwacje trafiają do nich jako zaproszenie
  z Twojego kalendarza, więc przesunięcia widzą automatycznie.
- Darmowe konto Gmail może wysłać przez Apps Script około 100 maili dziennie.
  Rezerwacja i zmiana terminu zużywają po 2 (dla Ciebie i dla ucznia).
