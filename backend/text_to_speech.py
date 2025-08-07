"""
Enhanced Text to Speech functionality with Google APIs
Supports multiple TTS engines: Google Cloud TTS, gTTS, pyttsx3
"""

import os
import json
import base64
from typing import Optional, Dict, Any
from gtts import gTTS
import pyttsx3
from io import BytesIO
import tempfile
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TextToSpeechService:
    def __init__(self):
        self.supported_languages = {
            'vi': 'Vietnamese',
            'en': 'English'
        }
        self.supported_voices = {
            'male': 'Male Voice',
            'female': 'Female Voice'
        }
        
        # Initialize Google Cloud TTS if credentials available
        self.google_client = None
        self._init_google_client()
        
        # Initialize pyttsx3 engine
        self.pyttsx3_engine = None
        self._init_pyttsx3_engine()
    
    def _init_google_client(self):
        """Initialize Google Cloud Text-to-Speech client"""
        try:
            # Try to import Google Cloud TTS
            from google.cloud import texttospeech
            
            # Check for service account credentials
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
            
            if credentials_path and os.path.exists(credentials_path):
                os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
                self.google_client = texttospeech.TextToSpeechClient()
                print("✅ Google Cloud TTS initialized with service account file")
            elif service_account_json:
                # Parse JSON credentials
                credentials_info = json.loads(service_account_json)
                from google.oauth2 import service_account
                credentials = service_account.Credentials.from_service_account_info(credentials_info)
                self.google_client = texttospeech.TextToSpeechClient(credentials=credentials)
                print("✅ Google Cloud TTS initialized with service account JSON")
            else:
                print("⚠️ Google Cloud TTS credentials not found, using fallback methods")
                
        except ImportError:
            print("⚠️ Google Cloud TTS library not installed")
        except Exception as e:
            print(f"⚠️ Failed to initialize Google Cloud TTS: {e}")
    
    def _init_pyttsx3_engine(self):
        """Initialize pyttsx3 TTS engine"""
        try:
            self.pyttsx3_engine = pyttsx3.init()
            print("✅ pyttsx3 TTS engine initialized")
        except Exception as e:
            print(f"⚠️ Failed to initialize pyttsx3: {e}")
    
    def convert_text_to_speech_google_cloud(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """Convert text to speech using Google Cloud TTS"""
        try:
            from google.cloud import texttospeech
            
            if not self.google_client:
                raise Exception("Google Cloud TTS client not initialized")
            
            # Set up the input text
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Configure voice parameters
            language_code = 'vi-VN' if language == 'vi' else 'en-US'
            voice_name = None
            
            if language == 'vi':
                voice_name = 'vi-VN-Standard-A' if voice == 'female' else 'vi-VN-Standard-B'
            else:
                voice_name = 'en-US-Standard-C' if voice == 'female' else 'en-US-Standard-B'
            
            voice = texttospeech.VoiceSelectionParams(
                language_code=language_code,
                name=voice_name,
                ssml_gender=texttospeech.SsmlVoiceGender.FEMALE if voice == 'female' else texttospeech.SsmlVoiceGender.MALE
            )
            
            # Configure audio output
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            # Perform the text-to-speech request
            response = self.google_client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            # Save audio to file
            audio_filename = f"google_tts_{hash(text)}_{language}_{voice}.mp3"
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
                "file_size": len(response.audio_content),
            }
            
        except Exception as e:
            print(f"❌ Google Cloud TTS error: {e}")
            raise e
    
    def convert_text_to_speech_gtts(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """Convert text to speech using gTTS (Google Text-to-Speech)"""
        try:
            # gTTS language codes
            lang_code = 'vi' if language == 'vi' else 'en'
            
            # Create gTTS object
            tts = gTTS(text=text, lang=lang_code, slow=False)
            
            # Save to file
            audio_filename = f"gtts_{hash(text)}_{language}_{voice}.mp3"
            audio_path = os.path.join("audio_output", audio_filename)
            os.makedirs("audio_output", exist_ok=True)
            
            tts.save(audio_path)
            
            # Get file size
            file_size = os.path.getsize(audio_path)
            
            return {
                "success": True,
                "engine": "gtts",
                "audio_path": audio_path,
                "audio_filename": audio_filename,
                "text": text,
                "language": language,
                "voice": voice,
                "file_size": file_size,
            }
            
        except Exception as e:
            print(f"❌ gTTS error: {e}")
            raise e
    
    def convert_text_to_speech_pyttsx3(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """Convert text to speech using pyttsx3"""
        try:
            if not self.pyttsx3_engine:
                raise Exception("pyttsx3 engine not initialized")
            
            # Configure voice
            voices = self.pyttsx3_engine.getProperty('voices')
            if voices:
                # Try to find appropriate voice
                for v in voices:
                    if voice == 'female' and 'female' in v.name.lower():
                        self.pyttsx3_engine.setProperty('voice', v.id)
                        break
                    elif voice == 'male' and 'male' in v.name.lower():
                        self.pyttsx3_engine.setProperty('voice', v.id)
                        break
            
            # Set speech rate
            self.pyttsx3_engine.setProperty('rate', 150)
            
            # Save to file
            audio_filename = f"pyttsx3_{hash(text)}_{language}_{voice}.wav"
            audio_path = os.path.join("audio_output", audio_filename)
            os.makedirs("audio_output", exist_ok=True)
            
            self.pyttsx3_engine.save_to_file(text, audio_path)
            self.pyttsx3_engine.runAndWait()
            
            # Get file size
            file_size = os.path.getsize(audio_path) if os.path.exists(audio_path) else 0
            
            return {
                "success": True,
                "engine": "pyttsx3",
                "audio_path": audio_path,
                "audio_filename": audio_filename,
                "text": text,
                "language": language,
                "voice": voice,
                "file_size": file_size,
            }
            
        except Exception as e:
            print(f"❌ pyttsx3 error: {e}")
            raise e
    
    def convert_text_to_speech(self, text: str, language: str = 'vi', voice: str = 'female') -> Dict[str, Any]:
        """
        Convert text to speech using the best available engine
        
        Args:
            text (str): Text to convert
            language (str): Language code ('vi' or 'en')
            voice (str): Voice type ('male' or 'female')
            
        Returns:
            Dict containing audio file info and metadata
        """
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        if language not in self.supported_languages:
            raise ValueError(f"Unsupported language: {language}")
        
        if voice not in self.supported_voices:
            raise ValueError(f"Unsupported voice: {voice}")
        
        # Try engines in order of preference
        engines_to_try = []
        
        # Check environment preference
        preferred_engine = os.getenv('TTS_ENGINE', 'auto').lower()
        
        if preferred_engine == 'google' and self.google_client:
            engines_to_try.append('google_cloud')
        elif preferred_engine == 'gtts':
            engines_to_try.append('gtts')
        elif preferred_engine == 'pyttsx3':
            engines_to_try.append('pyttsx3')
        else:
            # Auto mode - try in order of quality
            if self.google_client:
                engines_to_try.append('google_cloud')
            engines_to_try.extend(['gtts', 'pyttsx3'])
        
        last_error = None
        
        for engine in engines_to_try:
            try:
                if engine == 'google_cloud':
                    return self.convert_text_to_speech_google_cloud(text, language, voice)
                elif engine == 'gtts':
                    return self.convert_text_to_speech_gtts(text, language, voice)
                elif engine == 'pyttsx3':
                    return self.convert_text_to_speech_pyttsx3(text, language, voice)
            except Exception as e:
                last_error = e
                print(f"⚠️ Engine {engine} failed: {e}")
                continue
        
        # If all engines failed
        raise Exception(f"All TTS engines failed. Last error: {last_error}")
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return self.supported_languages
    
    def get_supported_voices(self) -> Dict[str, str]:
        """Get list of supported voices"""
        return self.supported_voices
    
    def get_available_engines(self) -> Dict[str, bool]:
        """Get status of available TTS engines"""
        return {
            "google_cloud": self.google_client is not None,
            "gtts": True,  # gTTS should always be available if installed
            "pyttsx3": self.pyttsx3_engine is not None
        }

# Example usage
if __name__ == "__main__":
    tts_service = TextToSpeechService()
    
    print("Available engines:", tts_service.get_available_engines())
    
    # Test conversion
    try:
        result = tts_service.convert_text_to_speech(
            text="Xin chào, đây là công cụ chuyển văn bản thành giọng nói",
            language="vi",
            voice="female"
        )
        
        print("✅ TTS Success:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"❌ TTS Failed: {e}")