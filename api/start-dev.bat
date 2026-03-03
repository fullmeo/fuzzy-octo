@echo off
echo Starting Fuzzy-Octo API in development mode...
echo ============================================

echo [INFO] Current directory: %CD%
echo [INFO] Node version: %NODE_VERSION%
node -v
echo [INFO] NPM version:
npm -v

echo.
echo [INFO] Installing dependencies...
npm install

echo.
echo [INFO] Starting server...
set NODE_ENV=development
set DEBUG=*
node -e "console.log('Node.js can execute code')"

:: Démarrer le serveur
echo.
echo [INFO] Starting server with ts-node...
npx ts-node src/index.ts

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start server. Exit code: %ERRORLEVEL%
    pause
) else (
    echo.
    echo [INFO] Server started successfully on port 3000
    echo [INFO] Press any key to stop the server...
    pause > nul
)
