// ===== ELEVENLABS VOICE OPTIONS INTEGRATION =====
// Thêm vào cuối file script.js hiện tại

// Biến global cho voice options
let voiceOptionsData = null;

function loadVoiceOptionsFromBackend() {
    const language = document.getElementById('languageSelect')?.value || 'vi';
    console.log('🎵 Đang tải danh sách giọng nói cho ngôn ngữ:', language);
    
    fetch(`http://localhost:5000/api/voice-options?language=${language}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                voiceOptionsData = data.voice_options;
                console.log('✅ Đã tải danh sách giọng nói:', voiceOptionsData);
                updateVoiceSelectFromGender();
            } else {
                console.error('❌ Lỗi tải danh sách giọng nói:', data.error);
                setDefaultVoiceOptionsData();
            }
        })
        .catch(error => {
            console.error('❌ Lỗi kết nối khi tải giọng nói:', error);
            setDefaultVoiceOptionsData();
        });
}

// Thêm event listener cho language select
const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
    languageSelect.addEventListener('change', function() {
        console.log('���� Thay đổi ngôn ngữ:', this.value);
        loadVoiceOptionsFromBackend();
    });
}

function setDefaultVoiceOptionsData() {
    console.log('🔄 Sử dụng danh sách giọng nói mặc định');
    voiceOptionsData = {
        female_voices: [
            { id: 'voice1', name: 'Bella', description: 'Giọng nữ trẻ trung, năng động', voice_id: 'EXAVITQu4vr4xnSDxMaL' },
            { id: 'voice2', name: 'Elli', description: 'Giọng nữ dịu dàng, chuyên nghiệp', voice_id: 'MF3mGyEYCl7XYWbV9V6O' },
            { id: 'voice3', name: 'Dorothy', description: 'Giọng nữ trưởng thành, ấm áp', voice_id: 'ThT5KcBeYPX3keUQqHPh' }
        ],
        male_voices: [
            { id: 'voice1', name: 'Arnold', description: 'Giọng nam mạnh mẽ, tự tin', voice_id: 'VR6AewLTigWG4xSOukaG' },
            { id: 'voice2', name: 'Antoni', description: 'Giọng nam trẻ trung, thân thiện', voice_id: 'ErXwobaYiN019PkySvjV' }
        ]
    };
    updateVoiceSelectFromGender();
}

function updateVoiceSelectFromGender() {
    const genderSelect = document.getElementById('genderSelect');
    const voiceSelect = document.getElementById('voiceSelect');
    
    if (!genderSelect || !voiceSelect || !voiceOptionsData) {
        console.log('⚠️ Không thể cập nhật voice select - thiếu elements hoặc data');
        return;
    }
    
    const selectedGender = genderSelect.value;
    const voices = selectedGender === 'female' ? voiceOptionsData.female_voices : voiceOptionsData.male_voices;
    
    // Xóa các options cũ
    voiceSelect.innerHTML = '';
    
    // Thêm các options mới
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.voice_id || voice.id;
        option.textContent = `${voice.name} - ${voice.description}`;
        voiceSelect.appendChild(option);
    });
    
    console.log(`🎵 Đã cập nhật ${voices.length} giọng nói cho ${selectedGender}`);
}

// Cập nhật hàm initializeDashboard để tích hợp ElevenLabs
function initializeDashboardWithElevenLabs() {
    console.log('🔧 Khởi tạo dashboard với ElevenLabs');

    // Tải danh sách giọng nói
    loadVoiceOptionsFromBackend();

    // Thiết lập event listener cho gender select
    const genderSelect = document.getElementById('genderSelect');
    if (genderSelect) {
        genderSelect.addEventListener('change', function() {
            console.log('👤 Thay đổi giới tính:', this.value);
            updateVoiceSelectFromGender();
        });
    }

    // Override text-to-speech function để hỗ trợ ElevenLabs
    const textToSpeechBtn = document.getElementById('textToSpeechBtn');
    if (textToSpeechBtn) {
        // Xóa event listeners cũ
        textToSpeechBtn.replaceWith(textToSpeechBtn.cloneNode(true));
        const newTextToSpeechBtn = document.getElementById('textToSpeechBtn');
        
        newTextToSpeechBtn.addEventListener('click', function() {
            const textInput = document.getElementById('textInput');
            const genderSelect = document.getElementById('genderSelect');
            const voiceSelect = document.getElementById('voiceSelect');
            const languageSelect = document.getElementById('languageSelect');
            
            if (textInput) {
                const text = textInput.value.trim();
                const gender = genderSelect ? genderSelect.value : 'female';
                const voiceId = voiceSelect ? voiceSelect.value : null;
                const language = languageSelect ? languageSelect.value : 'vi';
                
                if (!text) {
                    const currentLanguage = localStorage.getItem('language') || 'vi';
                    const alertMessage = currentLanguage === 'vi'
                        ? 'Vui lòng nhập nội dung cần chuyển đổi!'
                        : 'Please enter text to convert!';
                    alert(alertMessage);
                    return;
                }
                
                console.log('🔊 Xử lý văn bản với ElevenLabs:', text, 'Giới tính:', gender, 'Voice ID:', voiceId, 'Ngôn ngữ:', language);
                
                // Hiển thị controls âm thanh
                const audioControlsPanel = document.querySelector('.audio-controls-panel');
                const audioStatus = document.querySelector('.audio-status');
                
                if (audioStatus) {
                    audioStatus.innerHTML = '<div style="color: #007bff;">🔄 Đang tạo âm thanh với ElevenLabs...</div>';
                }
                
                // Chuẩn bị payload cho API
                const payload = {
                    text: text,
                    language: language,
                    voice: gender
                };
                
                // Thêm voice_id nếu có
                if (voiceId) {
                    payload.voice_id = voiceId;
                }
                
                // Gọi backend API để chuyển văn bản thành giọng nói
                fetch('http://localhost:5000/api/text-to-speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('✅ Phản hồi TTS:', data);
                    if (audioStatus) {
                        if (data.success) {
                            // Hiển thị thông tin chi tiết về giọng nói
                            const voiceInfo = data.voice_description || `${gender} ${language}`;
                            const voiceName = data.voice_name || 'Unknown';
                            let engineInfo = '';
                            
                            switch(data.engine) {
                                case 'elevenlabs':
                                    engineInfo = '🎵 ElevenLabs (Premium)';
                                    break;
                                case 'google_cloud':
                                    engineInfo = '🔧 Google Cloud (Chất lượng cao)';
                                    break;
                                case 'gtts':
                                    engineInfo = '📢 gTTS (Chuẩn)';
                                    break;
                                default:
                                    engineInfo = data.engine || 'Unknown';
                            }
                            
                            audioStatus.innerHTML = `
                                <div style="color: #28a745; font-weight: 500;">
                                    ✅ Âm thanh đã được tạo thành công!
                                </div>
                                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">
                                    🎤 Giọng: ${voiceName}<br>
                                    📝 Mô tả: ${voiceInfo}<br>
                                    ${engineInfo}<br>
                                    📁 Kích thước: ${(data.file_size / 1024).toFixed(1)} KB
                                </div>
                            `;
                            
                            if (audioControlsPanel) {
                                audioControlsPanel.style.display = 'flex';
                            }
                            
                            // Lưu thông tin âm thanh để play và download
                            window.currentAudioInfo = data;
                            
                            // Reset audio player để chuẩn bị cho file mới
                            if (typeof resetAudioPlayer === 'function') {
                                resetAudioPlayer();
                            }
                        } else {
                            audioStatus.innerHTML = `
                                <div style="color: #dc3545; font-weight: 500;">
                                    ❌ Lỗi: ${data.error || 'Không thể tạo âm thanh'}
                                </div>
                            `;
                        }
                    }
                })
                .catch(error => {
                    console.error('❌ Lỗi TTS:', error);
                    if (audioStatus) {
                        audioStatus.innerHTML = `
                            <div style="color: #dc3545; font-weight: 500;">
                                ❌ Lỗi kết nối
                            </div>
                            <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">
                                Vui lòng kiểm tra backend server tại:<br>
                                <code>http://localhost:5000</code>
                            </div>
                        `;
                    }
                });
            }
        });
    }
}

// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo script.js đã tải xong
    setTimeout(() => {
        if (document.getElementById('dashboardPage') && document.getElementById('dashboardPage').style.display !== 'none') {
            initializeDashboardWithElevenLabs();
        }
    }, 1000);
});

console.log('🎵 ElevenLabs integration script đã được tải');