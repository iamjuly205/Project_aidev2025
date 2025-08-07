# 🚀 HƯỚNG DẪN CHẠY TRANG WEB SIGN LANGUAGE

## 📋 BƯỚC 1: CHẠY BACKEND SERVER

### Mở Command Prompt/Terminal đầu tiên:
```bash
# Di chuyển đến thư mục backend
cd d:\Project_aidev2025\backend

# Chạy server backend
python main.py
```

### Kết quả mong đợi:
```
🚀 Starting Sign Language Backend API...
📡 API will be available at: http://localhost:5000
📋 Available endpoints:
  - GET  /                     - Health check
  - POST /api/text-to-speech   - Convert text to speech
  - POST /api/speech-to-text   - Convert speech to text
  - POST /api/start-recording  - Start audio recording
  - POST /api/stop-recording   - Stop audio recording
  - GET  /api/languages        - Get supported languages
  - GET  /api/voices           - Get supported voices
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

**⚠️ QUAN TRỌNG: Giữ cửa sổ này mở và không đóng!**

---

## 📋 BƯỚC 2: CHẠY FRONTEND

### Phương án A: Mở trực tiếp (Đơn giản)
```
Nhấp đúp vào file: d:\Project_aidev2025\Front_End\index.html
```

### Phương án B: Chạy HTTP Server (Khuyến nghị)
Mở Command Prompt/Terminal thứ hai:
```bash
# Di chuyển đến thư mục frontend
cd d:\Project_aidev2025\Front_End

# Chạy HTTP server
python -m http.server 8000
```

Sau đó mở trình duyệt và truy cập: **http://localhost:8000**

---

## 🎯 KIỂM TRA HOẠT ĐỘNG

### 1. Kiểm tra Backend:
- Mở trình duyệt và truy cập: http://localhost:5000
- Bạn sẽ thấy thông báo JSON: `{"status": "running", "message": "Sign Language Backend API", "version": "1.0.0"}`

### 2. Kiểm tra Frontend:
- Trang web hiển thị bình thường
- Có thể đăng nhập/đăng ký
- Có thể chuyển đổi theme và ngôn ngữ

### 3. Kiểm tra tính năng:
- **Text to Speech**: Nhập văn bản → Chọn giọng/ngôn ngữ → Nhấn mũi tên
- **Speech to Text**: Nhấn microphone → Ghi âm → Nhấn mũi tên chuyển đổi

---

## ❌ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "Backend server chưa chạy"
**Nguyên nhân**: Backend chưa được khởi động
**Giải pháp**: 
1. Mở Command Prompt
2. Chạy: `cd d:\Project_aidev2025\backend`
3. Chạy: `python main.py`

### Lỗi: "python không được nhận diện"
**Nguyên nhân**: Python chưa được cài đặt hoặc ch��a thêm vào PATH
**Giải pháp**: 
1. Tải Python từ: https://python.org
2. Cài đặt và chọn "Add to PATH"

### Lỗi: "pip install failed"
**Nguyên nhân**: Thiếu quyền hoặc kết nối mạng
**Giải pháp**: 
1. Chạy Command Prompt với quyền Administrator
2. Thử lại: `pip install -r requirements.txt`

### Lỗi: "Port 5000 đã được sử dụng"
**Nguyên nhân**: Có ứng dụng khác đang dùng port 5000
**Giải pháp**: 
1. Đóng ứng dụng khác
2. Hoặc thay đổi port trong `main.py`: `app.run(port=5001)`

---

## 🎉 TÍNH NĂNG HIỆN TẠI

### ✅ Đã hoạt động:
- ✅ Giao diện đăng nhập/đăng ký
- ✅ Chuyển đổi theme (sáng/tối)
- ✅ Chuyển đổi ngôn ngữ (Việt/Anh)
- ✅ Dashboard với 3 tab chức năng
- ✅ Giao diện Text-to-Speech với API
- ✅ Giao diện Speech-to-Text với API
- ✅ Responsive design

### 🔄 Đang phát triển:
- 🔄 Tích hợp AI models thực tế
- 🔄 Xử lý audio/video thực tế
- 🔄 Lưu trữ file và database

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, hãy kiểm tra:
1. **Console log** trong trình duyệt (F12 → Console)
2. **Terminal output** của backend server
3. **Network tab** để xem API calls

**Chúc bạn thành công! 🎉**