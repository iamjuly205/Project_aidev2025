# 📁 CẤU TRÚC DỰ ÁN - FILES CHÍNH

## 🎯 **FILES QUAN TRỌNG CẦN GIỮ**

### **📂 Backend (Python) - `backend/`**
```
backend/
├── main.py              ⭐ FILE CHÍNH - API Server
├── text_to_speech.py    ⭐ FILE CHÍNH - ElevenLabs TTS
├── speech_to_text.py    ⭐ FILE CHÍNH - Speech Recognition
├── requirements.txt     ⭐ FILE CHÍNH - Dependencies
├── .env.example         ⭐ FILE CHÍNH - Config template
├── audio_output/        📁 Thư mục lưu audio
└── recordings/          📁 Thư mục lưu recordings
```

### **📂 Frontend (HTML/CSS/JS) - `Front_End/`**
```
Front_End/
├── index.html           ⭐ FILE CHÍNH - Giao diện chính
├── script.js            ⭐ FILE CHÍNH - JavaScript chính
├── script-elevenlabs.js ⭐ FILE CHÍNH - ElevenLabs integration
└── styles.css           ⭐ FILE CHÍNH - CSS styling
```

### **📂 Root Directory**
```
d:\Project_aidev2025/
├── README.md                    ⭐ FILE CHÍNH - Hướng dẫn dự án
├── HƯỚNG_DẪN_HOÀN_CHỈNH.md    📖 Hướng dẫn chi tiết
├── .gitignore                   🔧 Git config
└── .git/                        🔧 Git repository
```

## 🗑️ **FILES CẦN XÓA (KHÔNG QUAN TRỌNG)**

### **❌ Documentation files thừa:**
- `CLEANUP_SCRIPT.md`
- `CODE_ISSUES_REPORT.md`
- `ELEVENLABS_SETUP.md`
- `INTEGRATION_SUMMARY.md`
- `MANUAL_UPDATE_GUIDE.md`
- `SIMPLE_STEPS.md`
- `TEST_CHỨC_NĂNG.md`
- `VOICE_CONFIG_UPDATE.md`
- `VOICE_UPDATE_INSTRUCTIONS.md`

### **❌ Frontend files thừa:**
- `Front_End/voice-options.js` (trùng với script-elevenlabs.js)

### **❌ Backend cache/temp:**
- `backend/__pycache__/` (Python cache)
- `backend/temp/` (temporary files)

## 🚀 **CÁCH CHẠY DỰ ÁN**

### **Bước 1: Dọn dẹp files**
Chạy file: `DELETE_UNNECESSARY_FILES.bat`

### **Bước 2: Cấu hình ElevenLabs**
```bash
cd backend
copy .env.example .env
# Chỉnh sửa .env và thêm ELEVENLABS_API_KEY
```

### **Bước 3: Cài đặt dependencies**
```bash
pip install -r requirements.txt
```

### **Bước 4: Chạy backend**
```bash
python main.py
```

### **Bước 5: Chạy frontend**
```bash
cd ../Front_End
python -m http.server 8000
```

## 📋 **CHỨC NĂNG CHÍNH**

### **🔊 Text-to-Speech (ElevenLabs)**
- 2 giọng nữ + 2 giọng nam cho tiếng Việt
- 2 giọng nữ + 2 giọng nam cho tiếng Anh
- Chất lượng cao từ ElevenLabs API

### **🎤 Speech-to-Text**
- Nhận diện giọng nói thành văn bản
- Hỗ trợ tiếng Việt và tiếng Anh

### **🌐 Web Interface**
- Giao diện thân thiện
- Chuyển đổi ngôn ngữ
- Chọn giọng nói

## ⚠️ **LƯU Ý QUAN TRỌNG**

1. **ElevenLabs API Key** là bắt buộc
2. **Chỉ sử dụng ElevenLabs** - đã loại bỏ Google TTS
3. **Backend chạy port 5000**, Frontend chạy port 8000
4. **Voice ID đã được cập nhật** cho cả tiếng Việt và tiếng Anh

## 🎯 **FILES CHÍNH CẦN QUAN TÂM**

1. **`backend/main.py`** - API server chính
2. **`backend/text_to_speech.py`** - ElevenLabs TTS service
3. **`Front_End/index.html`** - Giao diện chính
4. **`Front_End/script-elevenlabs.js`** - ElevenLabs integration

**Chỉ cần quan tâm 4 files này là đủ để hiểu và sử dụng dự án!**