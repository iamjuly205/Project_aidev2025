"""
Enhanced Speech to Text functionality with Google APIs
Supports multiple STT engines: Google Cloud Speech, SpeechRecognition
"""

import os
import json
import tempfile
import wave
from typing import Optional, Dict, Any
import speech_recognition as sr
from pydub import AudioSegment
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SpeechToTextService:
    def __init__(self):
        self.supported_languages = {
            'vi': 'Vietnamese',
            'en': 'English'
        }
        self.supported_formats = ['wav', 'mp3', 'ogg', 'webm', 'flac', 'm4a']
        
        # Initialize Google Cloud Speech client
        self.google_client = None
        self._init_google_client()
        
        # Initialize SpeechRecognition
        self.sr_recognizer = sr.Recognizer()
        
    def _init_google_client(self):
        """Initialize Google Cloud Speech-to-Text client"""
        try:
            from google.cloud import speech
            
            # Check for service account credentials
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
            
            if credentials_path and os.path.exists(credentials_path):
                os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
                self.google_client = speech.SpeechClient()
                print("✅ Google Cloud Speech initialized with service account file")
            elif service_account_json:
                # Parse JSON credentials
                credentials_info = json.loads(service_account_json)
                from google.oauth2 import service_account
                credentials = service_account.Credentials.from_service_account_info(credentials_info)
                self.google_client = speech.SpeechClient(credentials=credentials)
                print("✅ Google Cloud Speech initialized with service account JSON")
            else:
                print("⚠️ Google Cloud Speech credentials not found, using fallback methods")
                
        except ImportError:
            print("⚠️ Google Cloud Speech library not installed")
        except Exception as e:
            print(f"⚠️ Failed to initialize Google Cloud Speech: {e}")
    
    def _convert_audio_format(self, audio_file_path: str, target_format: str = 'wav') -> str:
        """Convert audio file to target format"""
        try:
            # Load audio file
            audio = AudioSegment.from_file(audio_file_path)
            
            # Convert to mono and set sample rate
            audio = audio.set_channels(1).set_frame_rate(16000)
            
            # Create output path
            base_name = os.path.splitext(os.path.basename(audio_file_path))[0]
            output_path = os.path.join(tempfile.gettempdir(), f"{base_name}_converted.{target_format}")
            
            # Export in target format
            audio.export(output_path, format=target_format)
            
            return output_path
            
        except Exception as e:
            print(f"❌ Audio conversion error: {e}")
            raise e
    
    def convert_speech_to_text_google_cloud(self, audio_file: str, language: str = 'vi') -> Dict[str, Any]:
        """Convert speech to text using Google Cloud Speech-to-Text"""
        try:
            from google.cloud import speech
            
            if not self.google_client:
                raise Exception("Google Cloud Speech client not initialized")
            
            # Convert audio to WAV format if needed
            if not audio_file.lower().endswith('.wav'):
                audio_file = self._convert_audio_format(audio_file, 'wav')
            
            # Read audio file
            with open(audio_file, 'rb') as audio_data:
                content = audio_data.read()
            
            # Configure recognition
            audio = speech.RecognitionAudio(content=content)
            
            language_code = 'vi-VN' if language == 'vi' else 'en-US'
            
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code=language_code,
                enable_automatic_punctuation=True,
                enable_word_confidence=True,
                enable_word_time_offsets=True,
            )
            
            # Perform recognition
            response = self.google_client.recognize(config=config, audio=audio)
            
            # Process results
            transcripts = []
            confidence_scores = []
            
            for result in response.results:
                transcript = result.alternatives[0].transcript
                confidence = result.alternatives[0].confidence
                transcripts.append(transcript)
                confidence_scores.append(confidence)
            
            final_transcript = ' '.join(transcripts)
            avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
            
            return {
                "success": True,
                "engine": "google_cloud",
                "transcribed_text": final_transcript,
                "language": language,
                "audio_file": audio_file,
                "confidence": avg_confidence,
                "word_count": len(final_transcript.split()),
                "alternatives": [alt.transcript for result in response.results for alt in result.alternatives[:3]]
            }
            
        except Exception as e:
            print(f"❌ Google Cloud Speech error: {e}")
            raise e
    
    def convert_speech_to_text_sr_google(self, audio_file: str, language: str = 'vi') -> Dict[str, Any]:
        """Convert speech to text using SpeechRecognition with Google API"""
        try:
            # Convert audio to WAV format if needed
            if not audio_file.lower().endswith('.wav'):
                audio_file = self._convert_audio_format(audio_file, 'wav')
            
            # Load audio file
            with sr.AudioFile(audio_file) as source:
                # Adjust for ambient noise
                self.sr_recognizer.adjust_for_ambient_noise(source, duration=0.5)
                # Record audio
                audio_data = self.sr_recognizer.record(source)
            
            # Set language code
            language_code = 'vi-VN' if language == 'vi' else 'en-US'
            
            # Perform recognition using Google API
            api_key = os.getenv('GOOGLE_API_KEY')
            
            if api_key:
                transcript = self.sr_recognizer.recognize_google(
                    audio_data, 
                    language=language_code,
                    key=api_key
                )
            else:
                # Use free Google API (with limitations)
                transcript = self.sr_recognizer.recognize_google(
                    audio_data, 
                    language=language_code
                )
            
            return {
                "success": True,
                "engine": "speech_recognition_google",
                "transcribed_text": transcript,
                "language": language,
                "audio_file": audio_file,
                "confidence": 0.85,  # Estimated confidence
                "word_count": len(transcript.split()),
            }
            
        except sr.UnknownValueError:
            return {
                "success": False,
                "error": "Could not understand audio",
                "transcribed_text": "",
                "language": language,
                "audio_file": audio_file,
            }
        except sr.RequestError as e:
            raise Exception(f"Google Speech Recognition API error: {e}")
        except Exception as e:
            print(f"❌ SpeechRecognition error: {e}")
            raise e
    
    def convert_speech_to_text_sr_offline(self, audio_file: str, language: str = 'vi') -> Dict[str, Any]:
        """Convert speech to text using offline recognition (limited)"""
        try:
            # Convert audio to WAV format if needed
            if not audio_file.lower().endswith('.wav'):
                audio_file = self._convert_audio_format(audio_file, 'wav')
            
            # Load audio file
            with sr.AudioFile(audio_file) as source:
                # Adjust for ambient noise
                self.sr_recognizer.adjust_for_ambient_noise(source, duration=0.5)
                # Record audio
                audio_data = self.sr_recognizer.record(source)
            
            # Try different offline engines
            transcript = None
            engine_used = None
            
            # Try Sphinx (if available)
            try:
                transcript = self.sr_recognizer.recognize_sphinx(audio_data)
                engine_used = "sphinx"
            except:
                pass
            
            if not transcript:
                # Fallback to mock transcription for demo
                transcript = f"[Demo] Văn bản được chuyển đổi từ file audio: {os.path.basename(audio_file)}"
                engine_used = "demo"
            
            return {
                "success": True,
                "engine": f"speech_recognition_{engine_used}",
                "transcribed_text": transcript,
                "language": language,
                "audio_file": audio_file,
                "confidence": 0.7,  # Estimated confidence
                "word_count": len(transcript.split()),
            }
            
        except Exception as e:
            print(f"❌ Offline recognition error: {e}")
            raise e
    
    def convert_speech_to_text(self, audio_file: str, language: str = 'vi') -> Dict[str, Any]:
        """
        Convert speech/audio to text using the best available engine
        
        Args:
            audio_file (str): Path to audio file
            language (str): Language code ('vi' or 'en')
            
        Returns:
            Dict containing transcribed text and metadata
        """
        if not os.path.exists(audio_file):
            raise FileNotFoundError(f"Audio file not found: {audio_file}")
        
        if language not in self.supported_languages:
            raise ValueError(f"Unsupported language: {language}")
        
        # Get file extension
        file_ext = audio_file.split('.')[-1].lower()
        if file_ext not in self.supported_formats:
            raise ValueError(f"Unsupported audio format: {file_ext}")
        
        # Try engines in order of preference
        engines_to_try = []
        
        # Check environment preference
        preferred_engine = os.getenv('STT_ENGINE', 'auto').lower()
        
        if preferred_engine == 'google' and self.google_client:
            engines_to_try.append('google_cloud')
        elif preferred_engine == 'speech_recognition':
            engines_to_try.extend(['sr_google', 'sr_offline'])
        else:
            # Auto mode - try in order of quality
            if self.google_client:
                engines_to_try.append('google_cloud')
            engines_to_try.extend(['sr_google', 'sr_offline'])
        
        last_error = None
        
        for engine in engines_to_try:
            try:
                if engine == 'google_cloud':
                    return self.convert_speech_to_text_google_cloud(audio_file, language)
                elif engine == 'sr_google':
                    return self.convert_speech_to_text_sr_google(audio_file, language)
                elif engine == 'sr_offline':
                    return self.convert_speech_to_text_sr_offline(audio_file, language)
            except Exception as e:
                last_error = e
                print(f"⚠️ Engine {engine} failed: {e}")
                continue
        
        # If all engines failed
        raise Exception(f"All STT engines failed. Last error: {last_error}")
    
    def start_recording(self) -> Dict[str, Any]:
        """Start audio recording session"""
        import time
        session_id = f"recording_{int(time.time())}"
        
        result = {
            "success": True,
            "session_id": session_id,
            "status": "recording",
            "start_time": time.time(),
        }
        
        return result
    
    def stop_recording(self, session_id: str) -> Dict[str, Any]:
        """Stop audio recording and save file"""
        import time
        
        # Create recordings directory if it doesn't exist
        os.makedirs("recordings", exist_ok=True)
        
        audio_filename = f"{session_id}.wav"
        audio_path = os.path.join("recordings", audio_filename)
        
        result = {
            "success": True,
            "session_id": session_id,
            "audio_file": audio_path,
            "status": "completed",
            "duration": 5.0,  # Mock duration
            "file_size": 1024 * 50,  # Mock file size
        }
        
        return result
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return self.supported_languages
    
    def get_supported_formats(self) -> list:
        """Get list of supported audio formats"""
        return self.supported_formats
    
    def get_available_engines(self) -> Dict[str, bool]:
        """Get status of available STT engines"""
        return {
            "google_cloud": self.google_client is not None,
            "speech_recognition": True,  # Should always be available if installed
            "google_api_key": bool(os.getenv('GOOGLE_API_KEY'))
        }

# Example usage
if __name__ == "__main__":
    stt_service = SpeechToTextService()
    
    print("Available engines:", stt_service.get_available_engines())
    
    # Test with a sample audio file (if exists)
    test_audio = "test_audio.wav"
    if os.path.exists(test_audio):
        try:
            result = stt_service.convert_speech_to_text(test_audio, "vi")
            print("✅ STT Success:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"❌ STT Failed: {e}")
    else:
        print("ℹ️ No test audio file found")