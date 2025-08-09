@echo off
echo 🗑️ Đang xóa các file không cần thiết...

REM Xóa các file documentation thừa
del "CLEANUP_SCRIPT.md" 2>nul
del "CODE_ISSUES_REPORT.md" 2>nul
del "ELEVENLABS_SETUP.md" 2>nul
del "INTEGRATION_SUMMARY.md" 2>nul
del "MANUAL_UPDATE_GUIDE.md" 2>nul
del "SIMPLE_STEPS.md" 2>nul
del "TEST_CHỨC_NĂNG.md" 2>nul
del "VOICE_CONFIG_UPDATE.md" 2>nul
del "VOICE_UPDATE_INSTRUCTIONS.md" 2>nul

REM Xóa file JavaScript trùng lặp
del "Front_End\voice-options.js" 2>nul

REM Xóa cache Python
rmdir /s /q "backend\__pycache__" 2>nul
rmdir /s /q "backend\temp" 2>nul

echo ✅ Đã xóa xong các file không cần thiết!
echo.
echo 📁 CẤU TRÚC DỰ ÁN SAU KHI DỌN DẸP:
echo.
echo d:\Project_aidev2025\
echo ├── .git\
echo ├── .gitignore
echo ├── README.md
echo ├── HƯỚNG_DẪN_HOÀN_CHỈNH.md
echo ├── backend\
echo │   ├── .env.example
echo │   ├── audio_output\
echo │   ├── main.py
echo │   ├── recordings\
echo │   ├── requirements.txt
echo │   ├── speech_to_text.py
echo │   └── text_to_speech.py
echo └── Front_End\
echo     ├── index.html
echo     ├── script.js
echo     ├── script-elevenlabs.js
echo     └── styles.css
echo.
echo 🚀 Bây giờ bạn có thể chạy dự án với:
echo    cd backend
echo    python main.py
echo.
pause