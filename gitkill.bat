:: Versão Windows
@echo off
set /p confirm="Confirmar git add/commit/push? (s/n): "
if "%confirm%"=="s" (
    git add .
    git commit -m ":white_check_mark: :bug: :rocket: :alien: :robot: atualizado"
    git push origin main
)
pause