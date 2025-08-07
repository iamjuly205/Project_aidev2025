"""
Google API Setup Helper
Giúp thiết lập và kiểm tra Google APIs
"""

import os
import json
from dotenv import load_dotenv

def setup_google_api():
    """Hướng dẫn thiết lập Google API"""
    
    print("🔧 THIẾT LẬP GOOGLE API")
    print("=" * 50)
    
    # Check if .env file exists
    env_file = ".env"
    if not os.path.exists(env_file):
        print("📝 Tạo file .env...")
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write("""# Google Cloud API Configuration
# Điền thông tin API của bạn vào đây

# Google Cloud Project ID
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Google API Key (cho gTTS và Speech Recognition)
GOOGLE_API_KEY=your-google-api-key

# Google Cloud Service Account Key File Path
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# API Engine Preferences
TTS_ENGINE=gtts
STT_ENGINE=speech_recognition
""")
        print("✅ Đã tạo file .env")
    
    print("\n🔑 CÁC LOẠI API KEY BẠN CẦN:")
    print("-" * 30)
    
    print("\n1. 🆓 GOOGLE API KEY (Miễn phí - Khuyến nghị)")
    print("   - Dùng cho: gTTS và Speech Recognition")
    print("   - Cách lấy:")
    print("     a) Truy cập: https://console.cloud.google.com/")
    print("     b) Tạo project mới hoặc chọn project có sẵn")
    print("     c) Vào 'APIs & Services' > 'Credentials'")
    print("     d) Click 'Create Credentials' > 'API Key'")
    print("     e) Copy API key và paste vào file .env")
    
    print("\n2. 🏢 GOOGLE CLOUD SERVICE ACCOUNT (Nâng cao)")
    print("   - Dùng cho: Google Cloud TTS/STT (chất lượng cao)")
    print("   - Cách lấy:")
    print("     a) Truy cập: https://console.cloud.google.com/")
    print("     b) Vào 'IAM & Admin' > 'Service Accounts'")
    print("     c) Click 'Create Service Account'")
    print("     d) Thêm roles: 'Cloud Text-to-Speech API User', 'Cloud Speech API User'")
    print("     e) Tạo key (JSON) và download")
    print("     f) Đặt đường dẫn file JSON vào GOOGLE_APPLICATION_CREDENTIALS")
    
    print("\n📋 ENABLE CÁC API CẦN THIẾT:")
    print("-" * 30)
    print("1. Text-to-Speech API")
    print("2. Speech-to-Text API")
    print("3. Cloud Translation API (tùy chọn)")
    
    print("\n🔧 KIỂM TRA CẤU HÌNH:")
    print("-" * 30)
    
    # Load and check environment
    load_dotenv()
    
    api_key = os.getenv('GOOGLE_API_KEY')
    credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT_ID')
    
    print(f"✅ API Key: {'Có' if api_key and api_key != 'your-google-api-key' else '❌ Chưa có'}")
    print(f"✅ Service Account: {'Có' if credentials_path and os.path.exists(credentials_path) else '❌ Chưa có'}")
    print(f"✅ Project ID: {'Có' if project_id and project_id != 'your-project-id' else '❌ Chưa có'}")
    
    print("\n🚀 BƯỚC TIẾP THEO:")
    print("-" * 30)
    print("1. Điền thông tin API vào file .env")
    print("2. Cài đặt dependencies: pip install -r requirements.txt")
    print("3. Chạy server: python main.py")
    print("4. Test tính năng trên website")

def test_google_api():
    """Test Google API connections"""
    print("\n🧪 KIỂM TRA KẾT NỐI API")
    print("=" * 50)
    
    load_dotenv()
    
    # Test gTTS
    try:
        from gtts import gTTS
        tts = gTTS("Test", lang='en')
        print("✅ gTTS: Hoạt động")
    except Exception as e:
        print(f"❌ gTTS: Lỗi - {e}")
    
    # Test Speech Recognition
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        print("✅ SpeechRecognition: Hoạt động")
    except Exception as e:
        print(f"❌ SpeechRecognition: Lỗi - {e}")
    
    # Test Google Cloud TTS
    try:
        from google.cloud import texttospeech
        client = texttospeech.TextToSpeechClient()
        print("✅ Google Cloud TTS: Hoạt động")
    except Exception as e:
        print(f"❌ Google Cloud TTS: Lỗi - {e}")
    
    # Test Google Cloud Speech
    try:
        from google.cloud import speech
        client = speech.SpeechClient()
        print("✅ Google Cloud Speech: Hoạt động")
    except Exception as e:
        print(f"❌ Google Cloud Speech: Lỗi - {e}")

if __name__ == "__main__":
    setup_google_api()
    test_google_api()
    
    print("\n" + "="*50)
    print("🎉 HOÀN THÀNH THIẾT LẬP!")
    print("📧 Nếu cần hỗ trợ, hãy kiểm tra:")
    print("   - File .env đã được điền đúng thông tin")
    print("   - APIs đã được enable trên Google Cloud Console")
    print("   - Dependencies đã được cài đặt đầy đủ")
    print("="*50)