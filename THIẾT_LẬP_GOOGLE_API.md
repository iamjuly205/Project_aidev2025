# 🔑 THIẾT LẬP GOOGLE API - HƯỚNG DẪN NHANH

## 🎯 **BƯỚC 1: LẤY GOOGLE API KEY (5 phút)**

### 1. Truy cập Google Cloud Console:
```
https://console.cloud.google.com/
```

### 2. Tạo hoặc chọn Project:
- Click "Select a project" → "New Project"
- Đặt tên: "Sign Language App"
- Click "Create"

### 3. Enable APIs:
- Vào "APIs & Services" → "Library"
- Tìm và enable:
  - ✅ **Text-to-Speech API**
  - ✅ **Speech-to-Text API**

### 4. Tạo API Key:
- Vào "APIs & Services" → "Credentials"
- Click "Create Credentials" → "API Key"
- Copy API Key (dạng: AIzaSyC...)

### 5. Cấu hình API Key:
- Click "Restrict Key"
- Chọn "API restrictions"
- Chọn: Text-to-Speech API, Speech-to-Text API
- Save

---

## 🔧 **BƯỚC 2: CẤU HÌNH PROJECT**

### 1. Tạo file .env:
```bash
cd d:\Project_aidev2025\backend
copy .env.example .env
```

### 2. Chỉnh sửa file .env:
```env
# Thay your-google-api-key bằng API key thực của bạn
GOOGLE_API_KEY=AIzaSyC...your-actual-api-key

# Thay your-project-id bằng project ID thực
GOOGLE_CLOUD_PROJECT_ID=sign-language-app-123456

# Engine preferences
TTS_ENGINE=gtts
STT_ENGINE=speech_recognition
```

---

## 🚀 **BƯỚC 3: CÀI ĐẶT VÀ CHẠY**

### 1. Cài đặt dependencies:
```bash
cd d:\Project_aidev2025\backend
pip install -r requirements.txt
```

### 2. Kiểm tra thiết lập:
```bash
python setup_google_api.py
```

### 3. Chạy backend:
```bash
python main.py
```

### 4. Chạy frontend:
```bash
# Mở terminal mới
cd d:\Project_aidev2025\Front_End
python -m http.server 8000
```

### 5. Truy cập:
- Frontend: http://localhost:8000
- Backend: http://localhost:5000

---

## ✅ **KIỂM TRA HOẠT ĐỘNG**

### 1. Test Backend API:
Mở trình duyệt: http://localhost:5000
Kết quả mong đợi:
```json
{
  "status": "running",
  "message": "Sign Language Backend API",
  "available_engines": {
    "tts": {"gtts": true, "pyttsx3": true},
    "stt": {"speech_recognition": true, "google_api_key": true}
  }
}
```

### 2. Test Text-to-Speech:
- Vào website → Đăng nhập → Dashboard
- Tab "Văn bản thành giọng nói"
- Nhập text: "Xin chào"
- Chọn giọng và ngôn ngữ
- Click mũi tên →

### 3. Test Speech-to-Text:
- Tab "Giọng nói thành văn bản"
- Click microphone để ghi âm
- Nói vài từ
- Click mũi tên để chuyển đổi

---

## 🔧 **XỬ LÝ LỖI THƯỜNG GẶP**

### ❌ Lỗi: "API key not valid"
**Giải pháp:**
1. Kiểm tra API key trong file .env
2. Đảm bảo APIs đã được enable
3. Kiểm tra API restrictions

### ❌ Lỗi: "pip install failed"
**Giải pháp:**
```bash
# Cài từng package riêng
pip install flask flask-cors
pip install gtts pyttsx3
pip install speech_recognition pydub
```

### ❌ Lỗi: "No module named 'pyaudio'"
**Giải pháp:**
```bash
# Windows
pip install pipwin
pipwin install pyaudio

# Hoặc
pip install pyaudio --only-binary=all
```

### ❌ Lỗi: "Backend connection failed"
**Giải pháp:**
1. Đảm bảo backend đang chạy (python main.py)
2. Kiểm tra port 5000 không bị chiếm
3. Tắt firewall/antivirus tạm thời

---

## 🎉 **TÍNH NĂNG SAU KHI THIẾT LẬP**

### ✅ Text-to-Speech:
- ✅ Chuyển văn bản tiếng Việt/Anh thành giọng nói
- ✅ Chọn giọng nam/nữ
- ✅ Tải xuống file audio MP3
- ✅ Chất lượng cao với Google APIs

### ✅ Speech-to-Text:
- ✅ Ghi âm trực tiếp từ microphone
- ✅ Chuyển giọng nói thành văn bản
- ✅ Hỗ trợ tiếng Việt/Anh
- ✅ Tải xuống file văn bản

### ✅ Giao diện:
- ✅ Responsive design
- ✅ Dark/Light theme
- ✅ Đa ngôn ngữ UI
- ✅ Hiệu ứng đẹp mắt

---

## 📞 **HỖ TRỢ**

Nếu gặp vấn đề:
1. Kiểm tra Console log (F12)
2. Kiểm tra Terminal output
3. Đảm bảo .env file đúng format
4. Test API trực tiếp: http://localhost:5000

**Chúc bạn thành công! 🎉**