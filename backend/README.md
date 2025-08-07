# Sign Language Recognition Backend

Backend API cho ứng dụng nhận diện ngôn ngữ ký hiệu.

## Cài đặt

1. Tạo virtual environment:
```bash
python -m venv venv
```

2. Kích hoạt virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

## Chạy ứng dụng

```bash
python main.py
```

API sẽ chạy tại: http://localhost:5000

## API Endpoints

### Health Check
- **GET** `/` - Kiểm tra trạng thái API

### Text to Speech
- **POST** `/api/text-to-speech`
  - Body: `{"text": "văn bản", "language": "vi", "voice": "female"}`
  - Response: Thông tin file audio được tạo

### Speech to Text
- **POST** `/api/speech-to-text`
  - Form data: `audio` (file), `language` (string)
  - Response: Văn bản được chuyển đổi

### Recording
- **POST** `/api/start-recording` - Bắt đầu ghi âm
- **POST** `/api/stop-recording` - Dừng ghi âm
  - Body: `{"session_id": "recording_id"}`

### Utilities
- **GET** `/api/languages` - Danh sách ngôn ngữ hỗ trợ
- **GET** `/api/voices` - Danh sách giọng nói hỗ trợ
- **GET** `/api/download-audio/<filename>` - Tải file audio

## Cấu trúc thư mục

```
backend/
├── main.py              # API chính
├── text_to_speech.py    # Service chuyển văn bản thành giọng nói
├── speech_to_text.py    # Service chuyển giọng nói thành văn bản
├── requirements.txt     # Dependencies
├── README.md           # Tài liệu
├── audio_output/       # Thư mục chứa file audio được tạo
├── recordings/         # Thư mục chứa file ghi âm
└── temp/              # Thư mục tạm
```

## Tính năng

- ✅ Text to Speech với nhiều giọng nói và ngôn ngữ
- ✅ Speech to Text với hỗ trợ nhiều định dạng audio
- ✅ Ghi âm trực tiếp từ microphone
- ✅ API RESTful với CORS support
- ✅ Tải xuống file audio
- 🔄 Tích hợp AI models (sẽ phát triển)

## Phát triển tiếp

1. Tích hợp thư viện TTS thực tế (gTTS, pyttsx3)
2. Tích hợp thư viện STT thực tế (speech_recognition, Whisper)
3. Thêm AI models cho nhận diện ngôn ngữ ký hiệu
4. Cải thiện xử lý audio và video
5. Thêm authentication và rate limiting