"""
Dịch vụ chuyển văn bản thành giọng nói với Google APIs
Hỗ trợ đầy đủ giọng nam/nữ và tiếng Việt/Anh
"""

import os
import json
import hashlib
from typing import Dict, Any
from gtts import gTTS
import pyttsx3
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()

class TextToSpeechService:
    def __init__(self):
        """Khởi tạo dịch vụ Text-to-Speech"""
        # Ngôn ngữ được hỗ trợ
        self.supported_languages = {
            'vi': 'Tiếng Việt',
            'en': 'English'
        }
        
        # Giọng nói được hỗ trợ
        self.supported_voices = {
            'male': 'Giọng Nam',
            'female': 'Giọng Nữ'
        }
        
        # Khởi tạo Google Cloud TTS nếu có credentials
        self.google_client = None
        self._khoi_tao_google_client()
        
        # Khởi tạo pyttsx3 engine
        self.pyttsx3_engine = None
        self._khoi_tao_pyttsx3_engine()
        
        print("✅ Dịch vụ Text-to-Speech đã được khởi tạo")
    
    def _khoi_tao_google_client(self):
        """Khởi tạo Google Cloud Text-to-Speech client"""
        try:
            from google.cloud import texttospeech
            
            # Kiểm tra service account credentials
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
            
            if credentials_path and os.path.exists(credentials_path):
                os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
                self.google_client = texttospeech.TextToSpeechClient()
                print("✅ Google Cloud TTS đã khởi tạo với service account file")
            elif service_account_json:
                # Parse JSON credentials
                credentials_info = json.loads(service_account_json)
                from google.oauth2 import service_account
                credentials = service_account.Credentials.from_service_account_info(credentials_info)
                self.google_client = texttospeech.TextToSpeechClient(credentials=credentials)
                print("✅ Google Cloud TTS đã khởi tạo với service account JSON")
            else:
                print("⚠️ Không tìm thấy Google Cloud TTS credentials, sử dụng phương pháp dự phòng")
                
        except ImportError:
            print("⚠️ Thư viện Google Cloud TTS chưa được cài đặt")
        except Exception as e:
            print(f"⚠️ Lỗi khởi tạo Google Cloud TTS: {e}")
    
    def _khoi_tao_pyttsx3_engine(self):
        """Khởi tạo pyttsx3 TTS engine"""
        try:
            self.pyttsx3_engine = pyttsx3.init()
            print("✅ pyttsx3 TTS engine đã được khởi tạo")
        except Exception as e:
            print(f"⚠️ Lỗi khởi tạo pyttsx3: {e}")
    
    def _lay_cau_hinh_giong_noi_toi_uu(self, language: str, voice: str) -> Dict[str, Any]:
        """Lấy cấu hình giọng nói tối ưu cho Google Cloud TTS"""
        try:
            from google.cloud import texttospeech
            
            # Cấu hình giọng nói được tối ưu hóa
            voice_configs = {
                'vi': {
                    'female': {
                        'language_code': 'vi-VN',
                        'voice_name': 'vi-VN-Standard-A',  # Giọng nữ Việt Nam tự nhiên
                        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
                        'description': 'Giọng nữ Việt Nam chuẩn - Chất lượng cao'
                    },
                    'male': {
                        'language_code': 'vi-VN',
                        'voice_name': 'vi-VN-Standard-B',  # Giọng nam Việt Nam tự nhiên
                        'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
                        'description': 'Giọng nam Việt Nam chuẩn - Chất lượng cao'
                    }
                },
                'en': {
                    'female': {
                        'language_code': 'en-US',
                        'voice_name': 'en-US-Standard-C',  # Giọng nữ Mỹ tự nhiên
                        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
                        'description': 'US English Female Standard - High Quality'
                    },
                    'male': {
                        'language_code': 'en-US',
                        'voice_name': 'en-US-Standard-B',  # Giọng nam Mỹ tự nhiên
                        'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
                        'description': 'US English Male Standard - High Quality'
                    }
                }
            }
            
            return voice_configs.get(language, voice_configs['vi']).get(voice, voice_configs['vi']['female'])
        except ImportError:
            # Fallback nếu Google Cloud không có sẵn
            return {
                'language_code': 'vi-VN' if language == 'vi' else 'en-US',
                'voice_name': f'{language}-{voice}',
                'description': f'{language} {voice} voice'
            }
    
    def chuyen_van_ban_thanh_giong_noi_google_cloud(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """Chuyển văn bản thành giọng nói bằng Google Cloud TTS với cài đặt tối ưu"""
        try:
            from google.cloud import texttospeech
            
            if not self.google_client:
                raise Exception("Google Cloud TTS client chưa được khởi tạo")
            
            # Thiết lập văn bản đầu vào
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Lấy cấu hình giọng nói tối ưu
            voice_config = self._lay_cau_hinh_giong_noi_toi_uu(language, voice)
            
            # Cấu hình tham số giọng nói
            voice_params = texttospeech.VoiceSelectionParams(
                language_code=voice_config['language_code'],
                name=voice_config['voice_name'],
                ssml_gender=voice_config['ssml_gender']
            )
            
            # Cấu hình đầu ra âm thanh với chất lượng cao
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=1.0,    # Tốc độ nói bình thường
                pitch=0.0,            # Cao độ bình thường
                volume_gain_db=0.0,   # Âm lượng bình thường
                sample_rate_hertz=24000  # Tần số mẫu chất lượng cao
            )
            
            # Thực hiện yêu cầu text-to-speech
            response = self.google_client.synthesize_speech(
                input=synthesis_input,
                voice=voice_params,
                audio_config=audio_config
            )
            
            # Lưu âm thanh vào file
            text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
            audio_filename = f"google_tts_{text_hash}_{language}_{voice}.mp3"
            audio_path = os.path.join("audio_output", audio_filename)
            os.makedirs("audio_output", exist_ok=True)
            
            with open(audio_path, "wb") as out:
                out.write(response.audio_content)
            
            return {
                "success": True,
                "engine": "google_cloud",
                "audio_path": audio_path,
                "audio_filename": audio_filename,
                "text": text,
                "language": language,
                "voice": voice,
                "voice_name": voice_config['voice_name'],
                "voice_description": voice_config['description'],
                "file_size": len(response.audio_content),
                "quality": "high"
            }
            
        except Exception as e:
            print(f"❌ Lỗi Google Cloud TTS: {e}")
            raise e
    
    def chuyen_van_ban_thanh_giong_noi_gtts(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """Chuyển văn bản thành giọng nói bằng gTTS (Google Text-to-Speech) - Phiên bản miễn phí"""
        try:
            # Mã ngôn ngữ gTTS
            lang_code = 'vi' if language == 'vi' else 'en'
            
            # gTTS không hỗ trợ chọn giọng, nhưng có thể điều chỉnh tốc độ
            slow = False  # Tốc độ bình thường để chất lượng tốt hơn
            
            # Tạo đối tượng gTTS
            tts = gTTS(text=text, lang=lang_code, slow=slow)
            
            # Lưu vào file
            text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
            audio_filename = f"gtts_{text_hash}_{language}_{voice}.mp3"
            audio_path = os.path.join("audio_output", audio_filename)
            os.makedirs("audio_output", exist_ok=True)
            
            tts.save(audio_path)
            
            # Lấy kích thước file
            file_size = os.path.getsize(audio_path)
            
            return {
                "success": True,
                "engine": "gtts",
                "audio_path": audio_path,
                "audio_filename": audio_filename,
                "text": text,
                "language": language,
                "voice": voice,
                "voice_description": f"gTTS {self.supported_languages[language]} voice",
                "file_size": file_size,
                "quality": "standard"
            }
            
        except Exception as e:
            print(f"❌ Lỗi gTTS: {e}")
            raise e
    
    def convert_text_to_speech(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """
        Chuyển văn bản thành giọng nói bằng engine tốt nhất có sẵn
        Ưu tiên: Google Cloud TTS > gTTS > pyttsx3
        """
        # Kiểm tra đầu vào
        if not text.strip():
            raise ValueError("Văn bản không được để trống")
        
        if language not in self.supported_languages:
            raise ValueError(f"Ngôn ngữ không được hỗ trợ: {language}")
        
        if voice not in self.supported_voices:
            raise ValueError(f"Giọng nói không được hỗ trợ: {voice}")
        
        # Thử các engine theo thứ tự chất lượng
        engines_to_try = []
        
        # Kiểm tra engine ưu tiên từ môi trường
        preferred_engine = os.getenv('TTS_ENGINE', 'auto').lower()
        
        if preferred_engine == 'google' and self.google_client:
            engines_to_try.append('google_cloud')
        elif preferred_engine == 'gtts':
            engines_to_try.append('gtts')
        else:
            # Chế độ tự động - thử theo thứ tự chất lượng
            if self.google_client:
                engines_to_try.append('google_cloud')
            engines_to_try.append('gtts')
        
        last_error = None
        
        for engine in engines_to_try:
            try:
                print(f"🔊 Đang thử TTS engine: {engine}")
                
                if engine == 'google_cloud':
                    result = self.chuyen_van_ban_thanh_giong_noi_google_cloud(text, language, voice)
                    print(f"✅ Google Cloud TTS thành công: {result.get('voice_name', 'unknown')}")
                    return result
                elif engine == 'gtts':
                    result = self.chuyen_van_ban_thanh_giong_noi_gtts(text, language, voice)
                    print(f"✅ gTTS thành công")
                    return result
                    
            except Exception as e:
                last_error = e
                print(f"⚠️ Engine {engine} thất bại: {e}")
                continue
        
        # Nếu tất cả engine đều thất bại
        raise Exception(f"Tất cả TTS engines đều thất bại. Lỗi cuối: {last_error}")
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Lấy danh sách ngôn ngữ được hỗ trợ"""
        return self.supported_languages
    
    def get_supported_voices(self) -> Dict[str, str]:
        """Lấy danh sách giọng nói được hỗ trợ"""
        return self.supported_voices
    
    def get_available_engines(self) -> Dict[str, bool]:
        """Lấy trạng thái các TTS engines có sẵn"""
        return {
            "google_cloud": self.google_client is not None,
            "gtts": True,  # gTTS luôn có sẵn nếu được cài đặt
            "pyttsx3": self.pyttsx3_engine is not None
        }
    
    def get_voice_samples(self) -> Dict[str, Any]:
        """Lấy văn bản mẫu để test giọng nói"""
        return {
            'vi': {
                'sample_text': 'Xin chào, đây là giọng nói tiếng Việt. Chất lượng âm thanh rất tốt và phát âm chuẩn.',
                'female_description': 'Giọng nữ Việt Nam tự nhiên, phát âm chuẩn, dễ nghe',
                'male_description': 'Giọng nam Việt Nam tự nhiên, phát âm chuẩn, truyền cảm'
            },
            'en': {
                'sample_text': 'Hello, this is English voice. The audio quality is excellent with clear pronunciation.',
                'female_description': 'Natural US English female voice, clear and pleasant',
                'male_description': 'Natural US English male voice, professional and clear'
            }
        }

# Ví dụ sử dụng
if __name__ == "__main__":
    tts_service = TextToSpeechService()
    
    print("🔊 Engines có sẵn:", tts_service.get_available_engines())
    print("🎵 Mẫu giọng nói:", json.dumps(tts_service.get_voice_samples(), indent=2, ensure_ascii=False))
    
    # Test chuyển đổi
    try:
        # Test giọng nữ tiếng Việt
        result = tts_service.convert_text_to_speech(
            text="Xin chào, tôi là giọng nữ tiếng Việt",
            language="vi",
            voice="female"
        )
        print("✅ Test giọng nữ tiếng Việt thành công:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # Test giọng nam tiếng Anh
        result = tts_service.convert_text_to_speech(
            text="Hello, I am an English male voice",
            language="en",
            voice="male"
        )
        print("✅ Test giọng nam tiếng Anh thành công:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"❌ Test TTS thất bại: {e}")