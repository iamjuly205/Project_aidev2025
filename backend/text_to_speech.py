"""
Dịch vụ chuyển văn bản thành giọng nói với ElevenLabs API
Chỉ sử dụng ElevenLabs API - Đã loại bỏ hoàn toàn Google TTS và gTTS
"""

import os
import hashlib
import requests
from typing import Dict, Any
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()

class TextToSpeechService:
    def __init__(self):
        """Khởi tạo dịch vụ Text-to-Speech với ElevenLabs API"""
        # ElevenLabs API configuration
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
        self.elevenlabs_base_url = "https://api.elevenlabs.io/v1"
        
        # Ngôn ngữ được hỗ trợ
        self.supported_languages = {
            'vi': 'Tiếng Việt',
            'en': 'English'
        }
        
        # Cấu hình giọng nói ElevenLabs theo ngôn ngữ - 2 giọng nữ và 2 giọng nam
        self.voice_configs = {
            'vi': {  # Tiếng Việt
                'female': {
                    'voice1': {
                        'voice_id': 'foH7s9fX31wFFH2yqrFa',  # Huyen - Female (Vietnamese)
                        'name': 'Huyền',
                        'description': 'Giọng miền Bắc'
                    },
                    'voice2': {
                        'voice_id': 'A5w1fw5x0uXded1LDvZp',  # Nhu - Female (Vietnamese)
                        'name': 'Như',
                        'description': 'Giọng nữ dịu dàng, chuyên nghiệp'
                    }
                },
                'male': {
                    'voice1': {
                        'voice_id': 'BUPPIXeDaJWBz696iXRS',  # VietDung - Male (Vietnamese)
                        'name': 'Việt Dũng',
                        'description': 'Giọng nam mạnh mẽ, tự tin'
                    },
                    'voice2': {
                        'voice_id': '7hsfEc7irDn6E8br0qfw',  # Ly Hai - Male (Vietnamese)
                        'name': 'Ly Hai',
                        'description': 'Giọng miền Nam'
                    }
                }
            },
            'en': {  # Tiếng Anh
                'female': {
                    'voice1': {
                        'voice_id': 'pBZVCk298iJlHAcHQwLr',  # Leoni Vergara - Female English
                        'name': 'Leoni Vergara',
                        'description': 'Young, energetic female voice'
                    },
                    'voice2': {
                        'voice_id': '2qfp6zPuviqeCOZIE9RZ',  # Christina - Female English
                        'name': 'Christina',
                        'description': 'Gentle, professional female voice'
                    }
                },
                'male': {
                    'voice1': {
                        'voice_id': 'wAGzRVkxKEs8La0lmdrE',  # Sully - Male English
                        'name': 'Sully',
                        'description': 'Strong, confident male voice'
                    },
                    'voice2': {
                        'voice_id': 'MFZUKuGQUsGJPQjTS4wC',  # Jon - Male English
                        'name': 'Jon',
                        'description': 'Young, friendly male voice'
                    }
                }
            }
        }
        
        # Giọng nói được hỗ trợ
        self.supported_voices = {
            'male': 'Giọng Nam',
            'female': 'Giọng Nữ'
        }
        
        print("✅ Dịch vụ Text-to-Speech với ElevenLabs API đã được khởi tạo")
        if self.elevenlabs_api_key:
            print("✅ ElevenLabs API Key đã được cấu hình")
        else:
            print("❌ ElevenLabs API Key chưa được cấu hình!")
            raise Exception("ElevenLabs API Key là bắt buộc!")

    def convert_text_to_speech(self, text: str, language: str = 'vi', voice: str = 'female', voice_id: str = None) -> Dict[str, Any]:
        """Chuyển văn bản thành giọng nói bằng ElevenLabs API"""
        try:
            if not self.elevenlabs_api_key:
                raise Exception("ElevenLabs API Key chưa được cấu hình")
            
            # Kiểm tra đầu vào
            if not text.strip():
                raise ValueError("Văn bản không được để trống")
            
            if language not in self.supported_languages:
                raise ValueError(f"Ngôn ngữ không được hỗ trợ: {language}")
            
            if voice not in self.supported_voices:
                raise ValueError(f"Giọng nói không được hỗ trợ: {voice}")
            
            # Lấy voice_id nếu không được cung cấp
            if not voice_id:
                # Mặc định sử dụng voice1 cho mỗi giới tính theo ngôn ngữ
                voice_id = self.voice_configs[language][voice]['voice1']['voice_id']
            
            # Tìm thông tin giọng nói
            voice_info = None
            for lang in self.voice_configs:
                for gender in self.voice_configs[lang]:
                    for voice_key, config in self.voice_configs[lang][gender].items():
                        if config['voice_id'] == voice_id:
                            voice_info = config
                            break
                    if voice_info:
                        break
                if voice_info:
                    break
            
            if not voice_info:
                voice_info = self.voice_configs[language][voice]['voice1']
                voice_id = voice_info['voice_id']
            
            # Chuẩn bị request
            url = f"{self.elevenlabs_base_url}/text-to-speech/{voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.elevenlabs_api_key
            }
            
            data = {
                "text": text,
                "model_id": "eleven_multilingual_v2",  # Model hỗ trợ đa ngôn ngữ
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                    "style": 0.0,
                    "use_speaker_boost": True
                }
            }
            
            print(f"🔊 Đang gọi ElevenLabs API với voice: {voice_info['name']} ({voice_id})")
            
            # Gửi request
            response = requests.post(url, json=data, headers=headers, timeout=30)
            
            if response.status_code != 200:
                error_msg = f"ElevenLabs API error: {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail.get('detail', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text}"
                raise Exception(error_msg)
            
            # Lưu âm thanh vào file
            text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
            audio_filename = f"elevenlabs_{text_hash}_{language}_{voice}_{voice_info['name']}.mp3"
            audio_path = os.path.join("audio_output", audio_filename)
            os.makedirs("audio_output", exist_ok=True)
            
            with open(audio_path, "wb") as f:
                f.write(response.content)
            
            file_size = len(response.content)
            
            return {
                "success": True,
                "engine": "elevenlabs",
                "audio_path": audio_path,
                "audio_filename": audio_filename,
                "text": text,
                "language": language,
                "voice": voice,
                "voice_id": voice_id,
                "voice_name": voice_info['name'],
                "voice_description": voice_info['description'],
                "file_size": file_size,
                "quality": "premium"
            }
            
        except Exception as e:
            print(f"❌ Lỗi ElevenLabs TTS: {e}")
            raise e

    def get_voice_options(self, language: str = 'vi') -> Dict[str, Any]:
        """Lấy danh sách tùy chọn giọng nói chi tiết cho ElevenLabs theo ngôn ngữ"""
        lang_config = self.voice_configs.get(language, self.voice_configs['vi'])
        
        result = {
            'female_voices': [],
            'male_voices': []
        }
        
        # Thêm giọng nữ
        for voice_key, voice_config in lang_config['female'].items():
            result['female_voices'].append({
                'id': voice_key,
                'voice_id': voice_config['voice_id'],
                'name': voice_config['name'],
                'description': voice_config['description']
            })
        
        # Thêm giọng nam
        for voice_key, voice_config in lang_config['male'].items():
            result['male_voices'].append({
                'id': voice_key,
                'voice_id': voice_config['voice_id'],
                'name': voice_config['name'],
                'description': voice_config['description']
            })
        
        return result

    def get_voice_by_id(self, voice_id: str) -> Dict[str, Any]:
        """Lấy thông tin giọng nói theo voice_id"""
        for language in self.voice_configs:
            for gender in self.voice_configs[language]:
                for voice_key, config in self.voice_configs[language][gender].items():
                    if config['voice_id'] == voice_id:
                        return {
                            'language': language,
                            'gender': gender,
                            'voice_key': voice_key,
                            'voice_id': voice_id,
                            'name': config['name'],
                            'description': config['description']
                        }
        return None
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Lấy danh sách ngôn ngữ được hỗ trợ"""
        return self.supported_languages
    
    def get_supported_voices(self) -> Dict[str, str]:
        """Lấy danh sách giọng nói được hỗ trợ"""
        return self.supported_voices
    
    def get_available_engines(self) -> Dict[str, bool]:
        """Lấy trạng thái các TTS engines có sẵn"""
        return {
            "elevenlabs": self.elevenlabs_api_key is not None
        }
    
    def get_voice_samples(self) -> Dict[str, Any]:
        """Lấy văn bản mẫu để test giọng nói"""
        return {
            'vi': {
                'sample_text': 'Xin chào, đây là giọng nói tiếng Việt từ ElevenLabs. Chất lượng âm thanh rất tốt và phát âm chuẩn.',
                'female_description': 'Giọng nữ ElevenLabs tự nhiên, phát âm chuẩn, dễ nghe',
                'male_description': 'Giọng nam ElevenLabs tự nhiên, phát âm chuẩn, truyền cảm'
            },
            'en': {
                'sample_text': 'Hello, this is English voice from ElevenLabs. The audio quality is excellent with clear pronunciation.',
                'female_description': 'Natural ElevenLabs female voice, clear and pleasant',
                'male_description': 'Natural ElevenLabs male voice, professional and clear'
            }
        }

    def test_voice_by_id(self, voice_id: str, text: str = None, language: str = 'vi') -> Dict[str, Any]:
        """Test giọng nói bằng voice_id cụ thể"""
        if not text:
            samples = self.get_voice_samples()
            text = samples[language]['sample_text']
        
        voice_info = self.get_voice_by_id(voice_id)
        if not voice_info:
            raise ValueError(f"Voice ID không tồn tại: {voice_id}")
        
        return self.convert_text_to_speech(
            text=text,
            language=language,
            voice=voice_info['gender'],
            voice_id=voice_id
        )

# Ví dụ sử dụng
if __name__ == "__main__":
    try:
        tts_service = TextToSpeechService()
        
        print("🔊 Engines có sẵn:", tts_service.get_available_engines())
        print("🎵 Voice options (VI):", tts_service.get_voice_options('vi'))
        print("🎵 Voice options (EN):", tts_service.get_voice_options('en'))
        
        # Test chuyển đổi
        result = tts_service.convert_text_to_speech(
            text="Xin chào, tôi là giọng nữ tiếng Việt từ ElevenLabs",
            language="vi",
            voice="female"
        )
        print("✅ Test thành công:")
        print(f"   - Engine: {result['engine']}")
        print(f"   - Voice: {result['voice_name']}")
        print(f"   - File: {result['audio_filename']}")
        print(f"   - Size: {result['file_size']} bytes")
        
    except Exception as e:
        print(f"❌ Test thất bại: {e}")