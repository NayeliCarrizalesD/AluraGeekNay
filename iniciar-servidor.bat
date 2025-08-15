@echo off
echo ===================================
echo     ALURA GEEK - SERVIDOR JSON
echo ===================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado.
    echo Por favor, instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js detectado: 
node --version

REM Verificar si existe package.json
if not exist "package.json" (
    echo.
    echo ERROR: No se encontró package.json
    echo Creando package.json...
    echo.
    
    echo { > package.json
    echo   "name": "alura-geek", >> package.json
    echo   "version": "1.0.0", >> package.json
    echo   "description": "Proyecto Alura Geek", >> package.json
    echo   "main": "index.html", >> package.json
    echo   "scripts": { >> package.json
    echo     "start": "json-server --watch db.json --port 3000", >> package.json
    echo     "dev": "json-server --watch db.json --port 3000 --host 0.0.0.0" >> package.json
    echo   }, >> package.json
    echo   "devDependencies": { >> package.json
    echo     "json-server": "^0.17.0" >> package.json
    echo   } >> package.json
    echo } >> package.json
)

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo.
    echo Instalando dependencias...
    echo Esto puede tardar unos minutos...
    echo.
    npm install
    
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Falló la instalación de dependencias
        echo Intentando con json-server global...
        npm install -g json-server
    )
)

REM Verificar si db.json existe
if not exist "db.json" (
    echo.
    echo ERROR: No se encontró db.json
    echo Este archivo es necesario para el funcionamiento del servidor.
    echo.
    pause
    exit /b 1
)

echo.
echo ===================================
echo  INICIANDO SERVIDOR JSON...
echo ===================================
echo.
echo ✓ Servidor corriendo en: http://localhost:3000
echo ✓ API de productos: http://localhost:3000/productos
echo ✓ Panel de administración: http://localhost:3000
echo.
echo Para detener el servidor, presiona Ctrl+C
echo.
echo ===================================

REM Intentar iniciar el servidor
json-server --watch db.json --port 3000

REM Si falla, intentar con npx
if %errorlevel% neq 0 (
    echo.
    echo Intentando con npx...
    npx json-server --watch db.json --port 3000
)

REM Si aún falla, intentar con npm start
if %errorlevel% neq 0 (
    echo.
    echo Intentando con npm start...
    npm start
)

echo.
echo ===================================
echo El servidor se ha detenido.
echo ===================================
pause
