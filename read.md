Przeniesienie aplikacji faktury (front) na inny komputer:

Skopiuj aplikację na nowy komputer
npm install
npm run build
npm install -g serve
serve -s build

.bat:
@echo off
cd /d "C:\sciezka\do\twojego\projektu"
start http://localhost:8081
serve -s build -l 8081
pause
