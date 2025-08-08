# 🎯 SIGN LANGUAGE RECOGNITION TOOL

Công cụ nhận diện ngôn ngữ ký hiệu với Text-to-Speech và Speech-to-Text hoàn chỉnh

## 📁 **CẤU TRÚC DỰ ÁN (ĐÃ DỌN DẸP)**

```
d:\Project_aidev2025\
├── backend\                    # Python Flask API
│   ├── .env                   # ✅ Cấu hình API keys
│   ├── main.py               # ✅ Server chính (CHẠY FILE NÀY)
│   ├── text_to_speech.py     # ✅ Dịch vụ TTS với gTTS
│   ├── speech_to_text.py     # ✅ Dịch vụ STT với Web Speech API
│   ├── requirements.txt      # ✅ Dependencies Python
│   ├── audio_output\         # 📁 File âm thanh được tạo
│   ├── recordings\           # 📁 File ghi âm
│   └── temp\                 # 📁 File tạm thời
├── Front_End\                 # Website
│   ├── index.html            # ✅ Trang chính (MỞ FILE NÀY)
│   ├── script.js             # ✅ JavaScript với Audio Player
│   └── styles.css            # ✅ CSS styling responsive
├── .gitignore                # 🚫 Loại trừ file không cần thiết
├── README.md                 # 📖 File này (HƯỚNG DẪN CHÍNH)
├── HƯỚNG_DẪN_HOÀN_CHỈNH.md  # 📚 Hướng dẫn chi tiết
└── TEST_CHỨC_NĂNG.md         # 🧪 Hướng dẫn test
```

## 🚀 **CHẠY DỰ ÁN - 3 BƯỚC ĐƠN GIẢN**

### BƯỚC 1: Cài đặt thư viện
```bash
cd d:\Project_aidev2025\backend
pip install -r requirements.txt
```

### BƯỚC 2: Chạy Backend
```bash
python main.py
```
**Kết quả:** Thấy thông báo "✅ Hệ thống đã sẵn sàng!"

### BƯỚC 3: Chạy Frontend
```bash
# Mở terminal mới
cd d:\Project_aidev2025\Front_End
python -m http.server 8000
```
**Hoặc:** Nhấp đúp vào file `index.html`

### BƯỚC 4: Sử dụng
- Mở trình duyệt: http://localhost:8000
- Đăng nhập bằng email bất kỳ
- Click "Bắt Đầu Ngay" → Vào Dashboard
- Test Text-to-Speech và Speech-to-Text

## 🎵 **TÍNH NĂNG HOÀN CHỈNH**

### 🔊 **Text-to-Speech:**
- ✅ **Giọng nam/nữ** tiếng Việt/Anh với gTTS
- ✅ **Audio Player** với Play/Pause/Progress/Timer
- ✅ **Download MP3** chất lượng cao
- ✅ **API thực tế** kết nối backend

### 🎤 **Speech-to-Text:**
- ✅ **Web Speech API** bật microphone thật
- ✅ **Nhận diện giọng nói** thực tế (không demo)
- ✅ **Đa ngôn ngữ** vi-VN/en-US tự động
- ✅ **Download TXT** văn bản đã chuyển đổi

### 🎨 **Giao diện:**
- ✅ **Responsive Design** - Hoạt động mọi thiết bị
- ✅ **Dark/Light Theme** - Chuyển đổi mượt mà
- ✅ **Đa ngôn ngữ UI** - Tiếng Việt/English
- ✅ **Modern UI/UX** - Animations và transitions

## 🔧 **XỬ LÝ LỖI THÔNG MINH**

### ❌ **Text-to-Speech:**
- Backend offline → Thông báo kết nối
- API lỗi → Hiển thị lỗi cụ thể
- File không tạo được → Hướng dẫn khắc phục

### ❌ **Speech-to-Text:**
- Trình duyệt không hỗ trợ → Khuyên dùng Chrome/Edge
- Microphone bị từ chối → Hướng dẫn cấp quyền
- Không nghe thấy → Thông báo thử lại

## 📚 **TÀI LIỆU**

- **[HƯỚNG_DẪN_HOÀN_CHỈNH.md](HƯỚNG_DẪN_HOÀN_CHỈNH.md)** - Hướng dẫn chi tiết từng bước
- **[TEST_CHỨC_NĂNG.md](TEST_CHỨC_NĂNG.md)** - Checklist test đầy đủ

## 🔑 **FILES QUAN TRỌNG CẦN NHỚ**

1. **`backend/main.py`** - 🚀 Chạy file này để khởi động server
2. **`Front_End/index.html`** - 🌐 Mở file này để vào website
3. **`backend/.env`** - ⚙️ Cấu hình API key Google
4. **`backend/requirements.txt`** - 📦 Danh sách thư viện cần cài

## 🎯 **CÔNG NGHỆ SỬ DỤNG**

- **Backend:** Python Flask, Google Text-to-Speech (gTTS)
- **Frontend:** HTML5, CSS3, JavaScript ES6, Web Speech API
- **APIs:** Google APIs, Web Speech Recognition
- **Audio:** MP3 generation, Real-time playback
- **UI/UX:** Responsive design, Dark/Light themes

## 🎊 **TRẠNG THÁI DỰ ÁN**

- ✅ **Text-to-Speech**: Hoạt động 100% với Google APIs
- ✅ **Speech-to-Text**: Hoạt động 100% với Web Speech API
- ✅ **Audio Player**: Hoàn chỉnh như Spotify mini
- ✅ **Download**: Tải được file MP3 và TXT thực tế
- ✅ **Error Handling**: Xử lý lỗi thông minh
- ✅ **Responsive**: Hoạt động mọi thiết bị
- ✅ **Production Ready**: Sẵn sàng triển khai

**🎉 DỰ ÁN ĐÃ HOÀN THÀNH VÀ SẴN SÀNG SỬ DỤNG! 🎉**