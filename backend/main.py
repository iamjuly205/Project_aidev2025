"""
Main backend application
Handles API endpoints and service coordination
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
from text_to_speech import TextToSpeechService
from speech_to_text import SpeechToTextService

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize services
print("🔧 Initializing services...")
tts_service = TextToSpeechService()
stt_service = SpeechToTextService()

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Sign Language Backend API",
        "version": "1.0.0",
        "available_engines": {
            "tts": tts_service.get_available_engines(),
            "stt": stt_service.get_available_engines()
        }
    })

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    """Convert text to speech"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({"success": False, "error": "Text is required"}), 400
        
        text = data['text']
        language = data.get('language', 'vi')
        voice = data.get('voice', 'female')
        
        print(f"🔊 TTS Request: text='{text[:50]}...', lang={language}, voice={voice}")
        
        result = tts_service.convert_text_to_speech(text, language, voice)
        
        print(f"✅ TTS Success: {result.get('engine', 'unknown')} engine used")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    """Convert speech to text"""
    try:
        # Handle file upload
        if 'audio' not in request.files:
            return jsonify({"success": False, "error": "Audio file is required"}), 400
        
        audio_file = request.files['audio']
        language = request.form.get('language', 'vi')
        
        if audio_file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        print(f"🎤 STT Request: file={audio_file.filename}, lang={language}")
        
        # Save uploaded file temporarily
        temp_path = os.path.join("temp", audio_file.filename)
        os.makedirs("temp", exist_ok=True)
        audio_file.save(temp_path)
        
        # Process the audio
        result = stt_service.convert_speech_to_text(temp_path, language)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        print(f"✅ STT Success: {result.get('engine', 'unknown')} engine used")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ STT Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/start-recording', methods=['POST'])
def start_recording():
    """Start audio recording"""
    try:
        result = stt_service.start_recording()
        print(f"🎤 Recording started: {result.get('session_id')}")
        return jsonify(result)
    except Exception as e:
        print(f"❌ Start recording error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/stop-recording', methods=['POST'])
def stop_recording():
    """Stop audio recording"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({"success": False, "error": "Session ID is required"}), 400
        
        result = stt_service.stop_recording(session_id)
        print(f"🎤 Recording stopped: {session_id}")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Stop recording error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/download-audio/<filename>', methods=['GET'])
def download_audio(filename):
    """Download generated audio file"""
    try:
        file_path = os.path.join("audio_output", filename)
        if os.path.exists(file_path):
            print(f"📥 Audio download: {filename}")
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"success": False, "error": "File not found"}), 404
    except Exception as e:
        print(f"❌ Download error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/languages', methods=['GET'])
def get_languages():
    """Get supported languages"""
    return jsonify({
        "success": True,
        "tts_languages": tts_service.get_supported_languages(),
        "stt_languages": stt_service.get_supported_languages()
    })

@app.route('/api/voices', methods=['GET'])
def get_voices():
    """Get supported voices for TTS"""
    return jsonify({
        "success": True,
        "voices": tts_service.get_supported_voices()
    })

@app.route('/api/engines', methods=['GET'])
def get_engines():
    """Get available engines status"""
    return jsonify({
        "success": True,
        "tts_engines": tts_service.get_available_engines(),
        "stt_engines": stt_service.get_available_engines()
    })

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs("audio_output", exist_ok=True)
    os.makedirs("recordings", exist_ok=True)
    os.makedirs("temp", exist_ok=True)
    
    print("🚀 Starting Sign Language Backend API...")
    print("📡 API will be available at: http://localhost:5000")
    print("📋 Available endpoints:")
    print("  - GET  /                     - Health check")
    print("  - POST /api/text-to-speech   - Convert text to speech")
    print("  - POST /api/speech-to-text   - Convert speech to text")
    print("  - POST /api/start-recording  - Start audio recording")
    print("  - POST /api/stop-recording   - Stop audio recording")
    print("  - GET  /api/languages        - Get supported languages")
    print("  - GET  /api/voices           - Get supported voices")
    print("  - GET  /api/engines          - Get available engines")
    print("  - GET  /api/download-audio/<filename> - Download audio file")
    
    print("\n🔧 Engine Status:")
    print("TTS Engines:", tts_service.get_available_engines())
    print("STT Engines:", stt_service.get_available_engines())
    
    app.run(debug=True, host='0.0.0.0', port=5000)