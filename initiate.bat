@ECHO OFF

ECHO Installing Dependencies...
call npm install

ECHO Building...
call npm run build

pause