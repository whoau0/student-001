@echo off
chcp 65001 > nul
title 내 공부방 AI 서비스 실행기
echo ===================================================
echo   🏠 [내 공부방] AI 맞춤 학습 자료 생성기를 실행합니다.
echo ===================================================
echo.
echo 잠시만 기다려 주세요...
start http://localhost:3001
call npm.cmd run dev
pause
