@echo off
REM ===================================================================
REM  Codzienna synchronizacja rankingu zestawow (vjudge + CodeChef).
REM  Odpalane automatycznie o 12:00 przez Harmonogram zadan Windows:
REM      zadanie "T-Olimpians leaderboard"
REM  Recznie: kliknij dwa razy w ten plik.
REM
REM  Po synchronizacji wrzuc na hosting:
REM      materialy.html  +  vjudge-leaderboard.json
REM ===================================================================
setlocal
cd /d "%~dp0"

set "PY=C:\Users\kacpe\AppData\Local\Python\pythoncore-3.12-64\python.exe"
if not exist "%PY%" set "PY=python"

set "LOG=%~dp0sync-leaderboard.log"

REM log wiekszy niz ~1 MB zaczynamy od nowa
for %%A in ("%LOG%") do if %%~zA GTR 1048576 del "%LOG%"

echo. >> "%LOG%"
echo ================================================== >> "%LOG%"
echo [%DATE% %TIME%] start >> "%LOG%"

"%PY%" "%~dp0vjudge-scrape.py" >> "%LOG%" 2>&1
set "RC=%ERRORLEVEL%"

if "%RC%"=="0" (
    echo [%DATE% %TIME%] OK >> "%LOG%"
) else (
    echo [%DATE% %TIME%] BLAD - kod %RC% >> "%LOG%"
)

REM przy recznym uruchomieniu pokaz wynik zamiast znikac
if /i "%~1"=="quiet" goto :end
type "%LOG%" | more +0
echo.
echo Kod wyjscia: %RC%   (log: sync-leaderboard.log)
if not defined CI pause

:end
exit /b %RC%
