@echo off
:: Tenta encontrar o VS Code automaticamente
where code >nul 2>&1
if %errorlevel% equ 0 (
    code "C:\\megaman"
    exit /b
)

:: Se não encontrar, tenta os locais comuns de instalação
if exist "C:\Program Files\Microsoft VS Code\Code.exe" (
    start "" "C:\Program Files\Microsoft VS Code\Code.exe" "C:\megaman"
    exit /b
)

if exist "%USERPROFILE%\AppData\Local\Programs\Microsoft VS Code\Code.exe" (
    start "" "%USERPROFILE%\AppData\Local\Programs\Microsoft VS Code\Code.exe" "C:\megaman"
    exit /b
)

echo Não foi possível encontrar o VS Code instalado neste computador.
echo Por favor, instale o VS Code ou ajuste o caminho manualmente neste arquivo BAT.
pause