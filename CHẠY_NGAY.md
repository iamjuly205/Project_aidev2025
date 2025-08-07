# 🚀 CHẠY DỰ ÁN NGAY - CHỈ 3 BƯỚC

## ✅ **BƯỚC 1: LẤY GOOGLE API KEY (2 phút)**

1. Vào: https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project có sẵn
3. Enable 2 APIs:
   - **Text-to-Speech API**
   - **Speech-to-Text API**
4. Tạo API Key: "APIs & Services" → "Credentials" → "Create Credentials" → "API Key"
5. Copy API key (dạng: AIzaSyC...)

## ✅ **BƯỚC 2: CẤU HÌNH API KEY**

```bash
# 1. Tạo file .env
cd d:\Project_aidev2025\backend
copy .env.example .env

# 2. Mở file .env và thay đổi:
GOOGLE_API_KEY=AIzaSyC...your-actual-api-key-here
```

## ✅ **BƯỚC 3: CHẠY DỰ ÁN**

### Terminal 1 - Backend:
```bash
cd d:\Project_aidev2025\backend
pip install -r requirements.txt
python main.py
```

### Terminal 2 - Frontend:
```bash
cd d:\Project_aidev2025\Front_End
python -m http.server 8000
```

### Truy cập:
- **Website**: http://localhost:8000
- **API**: http://localhost:5000

---

## 🎯 **KIỂM TRA NHANH**

1. **Backend hoạt động**: Mở http://localhost:5000 → Thấy JSON response
2. **Frontend hoạt động**: Mở http://localhost:8000 → Thấy trang đăng nhập
3. **Tính năng hoạt động**: Đăng nhập → Dashboard → Test Text-to-Speech

---

## 🎉 **HOÀN THÀNH!**

Bây giờ bạn có:
- ✅ Text-to-Speech với Google API
- ✅ Speech-to-Text với Google API  
- ✅ Giao diện đẹp, responsive
- ✅ Đăng nhập/đăng ký
- ✅ Dark/Light theme
- ✅ Đa ngôn ngữ (Việt/Anh)

**Chỉ cần API key là chạy được ngay! 🚀**