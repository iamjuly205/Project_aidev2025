// Script hoàn chỉnh với Audio Player và Speech Recognition thật
console.log('🚀 Đang tải script với chức năng thật...');

// Biến global cho audio player
let currentAudio = null;
let isPlaying = false;

// Biến global cho speech recognition
let recognition = null;
let isRecording = false;
let recordingTimer = null;
let recordingTime = 0;

// Các hàm Dashboard (đưa lên đầu để hoisting)
function showDashboard() {
    console.log('🎯 Hiển thị dashboard');
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';

    // Cập nhật tiêu đề trang
    const currentLanguage = localStorage.getItem('language') || 'vi';
    document.title = currentLanguage === 'vi' ? 'Dashboard - Sign Language' : 'Dashboard - Sign Language';

    // Khởi tạo chức năng dashboard
    initializeDashboard();
}

function showHomePage() {
    console.log('🏠 Hiển thị trang chủ');
    
    // Ẩn dashboard và hiển thị trang chủ
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('dashboardPage').style.display = 'none';
    
    // Reset các style của body có thể gây cản trở
    document.body.style.overflow = 'auto';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.height = '';
    
    // Cập nhật tiêu đề trang
    const currentLanguage = localStorage.getItem('language') || 'vi';
    document.title = currentLanguage === 'vi' ? 'Sign Language - Ngôn Ngữ Ký Hiệu' : 'Sign Language Recognition Tool';
    
    // Đảm bảo header được định vị đúng
    const header = document.querySelector('.header');
    if (header) {
        header.style.position = '';
        header.style.top = '';
        header.style.zIndex = '';
        header.style.transform = '';
    }
    
    // Reset style container
    const container = document.querySelector('.container');
    if (container) {
        container.style.paddingTop = '';
        container.style.position = '';
        container.style.height = '';
    }
    
    // Buộc tính toán lại layout
    window.requestAnimationFrame(() => {
        document.body.offsetHeight; // Buộc repaint
    });
}

// ===== AUDIO PLAYER FUNCTIONS =====
function initializeAudioPlayer() {
    console.log('🎵 Khởi tạo Audio Player');
    
    const playBtn = document.getElementById('playBtn');
    const downloadAudioBtn = document.getElementById('downloadAudioBtn');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            console.log('🎵 Play button clicked');
            
            if (window.currentAudioInfo && window.currentAudioInfo.audio_filename) {
                if (!isPlaying) {
                    playAudio();
                } else {
                    pauseAudio();
                }
            } else {
                const currentLanguage = localStorage.getItem('language') || 'vi';
                const alertMessage = currentLanguage === 'vi'
                    ? 'Chưa có file âm thanh để phát. Vui lòng tạo âm thanh trước!'
                    : 'No audio file to play. Please create audio first!';
                alert(alertMessage);
            }
        });
    }
    
    if (downloadAudioBtn) {
        downloadAudioBtn.addEventListener('click', function() {
            console.log('📥 Download button clicked');
            
            if (window.currentAudioInfo && window.currentAudioInfo.audio_filename) {
                const downloadUrl = `http://localhost:5000/api/download-audio/${window.currentAudioInfo.audio_filename}`;
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = window.currentAudioInfo.audio_filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                console.log('📥 Download started:', window.currentAudioInfo.audio_filename);
            } else {
                const currentLanguage = localStorage.getItem('language') || 'vi';
                const alertMessage = currentLanguage === 'vi'
                    ? 'Chưa có file âm thanh để tải xuống!'
                    : 'No audio file to download!';
                alert(alertMessage);
            }
        });
    }
}

function playAudio() {
    if (!window.currentAudioInfo) {
        console.error('❌ Không có thông tin audio');
        return;
    }
    
    console.log('▶️ Bắt đầu phát audio:', window.currentAudioInfo.audio_filename);
    
    const audioUrl = `http://localhost:5000/api/download-audio/${window.currentAudioInfo.audio_filename}`;
    
    // Tạo audio element mới nếu chưa có hoặc file khác
    if (!currentAudio || currentAudio.src !== audioUrl) {
        // Dừng audio cũ nếu có
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        currentAudio = new Audio(audioUrl);
        
        // Xử lý sự kiện khi metadata được tải
        currentAudio.addEventListener('loadedmetadata', function() {
            console.log('📊 Audio metadata loaded, duration:', currentAudio.duration);
            const totalTimeDisplay = document.getElementById('totalTime');
            if (totalTimeDisplay) {
                totalTimeDisplay.textContent = formatTime(currentAudio.duration);
            }
        });
        
        // Cập nhật progress bar
        currentAudio.addEventListener('timeupdate', function() {
            const progressFill = document.getElementById('progressFill');
            const currentTimeDisplay = document.getElementById('currentTime');
            
            if (progressFill && currentTimeDisplay && currentAudio.duration) {
                const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                progressFill.style.width = progress + '%';
                currentTimeDisplay.textContent = formatTime(currentAudio.currentTime);
            }
        });
        
        // Xử lý khi audio kết thúc
        currentAudio.addEventListener('ended', function() {
            console.log('⏹️ Audio ended');
            resetAudioPlayer();
        });
        
        // Xử lý lỗi
        currentAudio.addEventListener('error', function(e) {
            console.error('❌ Lỗi phát audio:', e);
            const currentLanguage = localStorage.getItem('language') || 'vi';
            const errorMessage = currentLanguage === 'vi'
                ? 'Không thể phát file âm thanh. Vui lòng kiểm tra kết nối và thử lại.'
                : 'Cannot play audio file. Please check connection and try again.';
            alert(errorMessage);
            resetAudioPlayer();
        });
        
        // Xử lý khi có thể phát
        currentAudio.addEventListener('canplay', function() {
            console.log('✅ Audio ready to play');
        });
    }
    
    // Phát audio
    currentAudio.play().then(() => {
        console.log('▶️ Audio playing');
        isPlaying = true;
        updatePlayButton();
    }).catch(error => {
        console.error('❌ Lỗi phát audio:', error);
        const currentLanguage = localStorage.getItem('language') || 'vi';
        const errorMessage = currentLanguage === 'vi'
            ? 'Không thể phát file âm thanh. Vui lòng kiểm tra kết nối backend.'
            : 'Cannot play audio file. Please check backend connection.';
        alert(errorMessage);
        resetAudioPlayer();
    });
}

function pauseAudio() {
    if (currentAudio) {
        console.log('⏸️ Pause audio');
        currentAudio.pause();
        isPlaying = false;
        updatePlayButton();
    }
}

function resetAudioPlayer() {
    console.log('🔄 Reset audio player');
    
    isPlaying = false;
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    updatePlayButton();
    
    // Reset progress bar
    const progressFill = document.getElementById('progressFill');
    const currentTimeDisplay = document.getElementById('currentTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    if (currentTimeDisplay) {
        currentTimeDisplay.textContent = '0:00';
    }
    if (totalTimeDisplay) {
        totalTimeDisplay.textContent = '0:00';
    }
}

function updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        const icon = playBtn.querySelector('i');
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause';
                playBtn.classList.add('playing');
                playBtn.title = 'Pause';
            } else {
                icon.className = 'fas fa-play';
                playBtn.classList.remove('playing');
                playBtn.title = 'Play';
            }
        }
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === null || seconds === undefined) {
        return '0:00';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ===== SPEECH RECOGNITION FUNCTIONS =====
function initializeSpeechRecognition() {
    console.log('🎤 Khởi tạo Speech Recognition');
    
    // Kiểm tra hỗ trợ Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('❌ Trình duyệt không hỗ trợ Web Speech API');
        const speechToTextOutput = document.getElementById('speechToTextOutput');
        if (speechToTextOutput) {
            speechToTextOutput.value = 'Trình duyệt không hỗ trợ Web Speech API. Vui lòng sử dụng Chrome hoặc Edge.';
        }
        return;
    }
    
    // Khởi tạo Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Cấu hình Speech Recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // Thiết lập ngôn ngữ mặc định
    const currentLanguage = localStorage.getItem('language') || 'vi';
    recognition.lang = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';
    
    // Xử lý kết quả
    recognition.onresult = function(event) {
        console.log('🎤 Speech recognition result:', event);
        
        const result = event.results[0][0];
        const transcript = result.transcript;
        const confidence = result.confidence;
        
        console.log('📝 Transcript:', transcript);
        console.log('🎯 Confidence:', confidence);
        
        // Hiển thị kết quả
        const speechToTextOutput = document.getElementById('speechToTextOutput');
        if (speechToTextOutput) {
            speechToTextOutput.value = transcript;
            
            // Hiển thị nút download
            const downloadTextBtn = document.getElementById('downloadTextBtn');
            if (downloadTextBtn) {
                downloadTextBtn.style.display = 'flex';
            }
        }
        
        // Cập nhật trạng thái
        stopRecording();
    };
    
    // Xử lý lỗi
    recognition.onerror = function(event) {
        console.error('❌ Speech recognition error:', event.error);
        
        const speechToTextOutput = document.getElementById('speechToTextOutput');
        if (speechToTextOutput) {
            const currentLanguage = localStorage.getItem('language') || 'vi';
            let errorMessage = '';
            
            switch(event.error) {
                case 'no-speech':
                    errorMessage = currentLanguage === 'vi' 
                        ? 'Không phát hiện giọng nói. Vui lòng thử lại.'
                        : 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = currentLanguage === 'vi'
                        ? 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.'
                        : 'Cannot access microphone. Please check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = currentLanguage === 'vi'
                        ? 'Quyền truy cập microphone bị từ chối. Vui lòng cho phép truy cập.'
                        : 'Microphone access denied. Please allow access.';
                    break;
                default:
                    errorMessage = currentLanguage === 'vi'
                        ? `Lỗi nhận diện giọng nói: ${event.error}`
                        : `Speech recognition error: ${event.error}`;
            }
            
            speechToTextOutput.value = errorMessage;
        }
        
        stopRecording();
    };
    
    // Xử lý khi bắt đầu
    recognition.onstart = function() {
        console.log('🎤 Speech recognition started');
    };
    
    // Xử lý khi kết thúc
    recognition.onend = function() {
        console.log('🎤 Speech recognition ended');
        stopRecording();
    };
    
    console.log('✅ Speech Recognition đã được khởi tạo');
}

function startRecording() {
    if (!recognition) {
        console.error('❌ Speech Recognition chưa được khởi tạo');
        return;
    }
    
    console.log('��� Bắt đầu ghi âm');
    
    isRecording = true;
    recordingTime = 0;
    
    // Cập nhật UI
    const micIcon = document.getElementById('micIcon');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTimer = document.getElementById('recordingTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const convertSpeechBtn = document.getElementById('convertSpeechBtn');
    const speechToTextOutput = document.getElementById('speechToTextOutput');
    
    if (micIcon) {
        micIcon.classList.add('recording');
    }
    
    if (recordingStatus) {
        const currentLanguage = localStorage.getItem('language') || 'vi';
        recordingStatus.textContent = currentLanguage === 'vi'
            ? 'Đang ghi âm... Nhấn lại để dừng'
            : 'Recording... Click again to stop';
    }
    
    if (recordingTimer) {
        recordingTimer.style.display = 'block';
    }
    
    if (convertSpeechBtn) {
        convertSpeechBtn.style.display = 'none';
    }
    
    if (speechToTextOutput) {
        const currentLanguage = localStorage.getItem('language') || 'vi';
        speechToTextOutput.value = currentLanguage === 'vi'
            ? 'Đang lắng nghe...'
            : 'Listening...';
    }
    
    // Bắt đầu timer
    recordingTimer = setInterval(() => {
        recordingTime++;
        const minutes = Math.floor(recordingTime / 60);
        const seconds = recordingTime % 60;
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
    
    // Cập nhật ngôn ngữ cho recognition
    const currentLanguage = localStorage.getItem('language') || 'vi';
    recognition.lang = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';
    
    // Bắt đầu recognition
    try {
        recognition.start();
    } catch (error) {
        console.error('❌ Lỗi bắt đầu recognition:', error);
        stopRecording();
    }
}

function stopRecording() {
    console.log('🎤 Dừng ghi âm');
    
    isRecording = false;
    
    // Dừng recognition
    if (recognition) {
        try {
            recognition.stop();
        } catch (error) {
            console.log('Recognition đã dừng');
        }
    }
    
    // Dừng timer
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    
    // Cập nhật UI
    const micIcon = document.getElementById('micIcon');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTimerDiv = document.getElementById('recordingTimer');
    
    if (micIcon) {
        micIcon.classList.remove('recording');
    }
    
    if (recordingStatus) {
        const currentLanguage = localStorage.getItem('language') || 'vi';
        recordingStatus.textContent = currentLanguage === 'vi'
            ? 'Nhấn microphone để ghi âm'
            : 'Click microphone to record';
    }
    
    if (recordingTimerDiv) {
        recordingTimerDiv.style.display = 'none';
    }
}

function initializeDashboard() {
    console.log('🔧 Khởi tạo dashboard');

    // Thiết lập các tab sidebar
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Xóa class active khỏi tất cả tabs và contents
            sidebarTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Thêm class active cho tab được click và content tương ứng
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            console.log('📋 Chuyển sang tab:', targetTab);
        });
    });

    // Thiết lập chức năng text-to-speech
    const textToSpeechBtn = document.getElementById('textToSpeechBtn');
    if (textToSpeechBtn) {
        textToSpeechBtn.addEventListener('click', function() {
            const textInput = document.getElementById('textInput');
            const voiceSelect = document.getElementById('voiceSelect');
            const languageSelect = document.getElementById('languageSelect');
            
            if (textInput) {
                const text = textInput.value.trim();
                const voice = voiceSelect ? voiceSelect.value : 'female';
                const language = languageSelect ? languageSelect.value : 'vi';
                
                if (!text) {
                    const currentLanguage = localStorage.getItem('language') || 'vi';
                    const alertMessage = currentLanguage === 'vi'
                        ? 'Vui lòng nhập nội dung cần chuyển đổi!'
                        : 'Please enter text to convert!';
                    alert(alertMessage);
                    return;
                }
                
                console.log('🔊 Xử lý văn bản:', text, 'Giọng:', voice, 'Ngôn ngữ:', language);
                
                // Hiển thị controls âm thanh
                const audioControlsPanel = document.querySelector('.audio-controls-panel');
                const audioStatus = document.querySelector('.audio-status');
                
                if (audioStatus) {
                    audioStatus.innerHTML = '<div style="color: #007bff;">🔄 Đang tạo âm thanh...</div>';
                }
                
                // Gọi backend API để chuyển văn bản thành giọng nói
                fetch('http://localhost:5000/api/text-to-speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                        language: language,
                        voice: voice
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('✅ Phản hồi TTS:', data);
                    if (audioStatus) {
                        if (data.success) {
                            // Hiển thị thông tin chi tiết về giọng nói
                            const voiceInfo = data.voice_description || `${voice} ${language}`;
                            const engineInfo = data.engine === 'google_cloud' ? 'Google Cloud (Chất lượng cao)' : 'gTTS (Chuẩn)';
                            
                            audioStatus.innerHTML = `
                                <div style="color: #28a745; font-weight: 500;">
                                    ✅ Âm thanh đã được tạo thành công!
                                </div>
                                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">
                                    🎵 Giọng: ${voiceInfo}<br>
                                    🔧 Engine: ${engineInfo}<br>
                                    📁 Kích thước: ${(data.file_size / 1024).toFixed(1)} KB
                                </div>
                            `;
                            
                            if (audioControlsPanel) {
                                audioControlsPanel.style.display = 'flex';
                            }
                            
                            // Lưu thông tin âm thanh để play và download
                            window.currentAudioInfo = data;
                            
                            // Reset audio player để chuẩn bị cho file mới
                            resetAudioPlayer();
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

    // Thiết lập chức năng speech-to-text với Web Speech API thật
    const micContainer = document.getElementById('micContainer');
    const downloadTextBtn = document.getElementById('downloadTextBtn');
    const speechToTextOutput = document.getElementById('speechToTextOutput');

    if (micContainer) {
        micContainer.addEventListener('click', function() {
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        });
    }

    // Thiết lập chức năng download text
    if (downloadTextBtn) {
        downloadTextBtn.addEventListener('click', function() {
            const text = speechToTextOutput ? speechToTextOutput.value : '';
            if (text && text.trim()) {
                const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'speech-to-text-result.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                console.log('📥 Text downloaded');
            } else {
                const currentLanguage = localStorage.getItem('language') || 'vi';
                const alertMessage = currentLanguage === 'vi'
                    ? 'Chưa có văn bản để tải xuống!'
                    : 'No text to download!';
                alert(alertMessage);
            }
        });
    }

    // Khởi tạo Audio Player và Speech Recognition
    initializeAudioPlayer();
    initializeSpeechRecognition();
}

// Phần còn lại của script giữ nguyên...
// (Các hàm authentication, theme, language, etc.)

// Kiểm tra người dùng đã đăng nhập chưa
function checkExistingLogin() {
    const savedUser = localStorage.getItem('currentUser');
    console.log('🔍 Kiểm tra đăng nhập hiện tại:', savedUser);

    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
        try {
            const userData = JSON.parse(savedUser);
            if (userData && userData.name) {
                console.log('✅ Tìm thấy người dùng:', userData.name);
                return userData;
            }
        } catch (e) {
            console.error('❌ Lỗi parse dữ liệu người dùng:', e);
            localStorage.removeItem('currentUser');
        }
    }

    console.log('ℹ️ Không tìm thấy người dùng hợp lệ, ở lại trang chủ');
    return false;
}

// Đợi DOM được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM đã tải, đang khởi tạo...');

    // Kiểm tra người dùng đã đăng nhập nhưng vẫn ở trang chủ
    const existingUser = checkExistingLogin();

    // Lấy tất cả elements với kiểm tra lỗi
    const elements = {
        authModal: document.getElementById('authModal'),
        authContainer: document.getElementById('container'),
        authOverlay: document.getElementById('authOverlay'),
        themeToggle: document.getElementById('themeToggle'),
        languageToggle: document.getElementById('languageToggle'),
        logoHome: document.getElementById('logoHome'),
        headerLoginBtn: document.querySelector('.btn-login'),
        headerRegisterBtn: document.querySelector('.btn-register'),
        startBtn: document.getElementById('startBtn'),
        registerBtn: document.getElementById('register'),
        loginBtn: document.getElementById('login')
    };
    
    // Log các elements đã tìm thấy
    console.log('🔍 Elements đã tìm thấy:');
    Object.keys(elements).forEach(key => {
        console.log(`  ${key}: ${elements[key] ? '✅' : '❌'}`);
    });
    
    // Các hàm modal
    function showModal(showRegister = false) {
        console.log(`📱 Hiển thị modal (đăng ký: ${showRegister})`);
        if (elements.authModal) {
            elements.authModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            if (elements.authContainer) {
                if (showRegister) {
                    elements.authContainer.classList.add('active');
                } else {
                    elements.authContainer.classList.remove('active');
                }
            }
        }
    }
    
    function hideModal() {
        console.log('❌ Ẩn modal');
        if (elements.authModal) {
            elements.authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Event listeners cho các nút
    if (elements.headerLoginBtn) {
        elements.headerLoginBtn.addEventListener('click', function() {
            console.log('🔑 Nút đăng nhập header được click');
            showModal(false);
        });
    }
    
    if (elements.headerRegisterBtn) {
        elements.headerRegisterBtn.addEventListener('click', function() {
            console.log('📝 Nút đăng ký header được click');
            showModal(true);
        });
    }
    
    // Quản lý trạng thái xác thực
    let isLoggedIn = !!existingUser;
    let currentUser = existingUser || null;

    // Kiểm tra trạng thái đăng nhập
    function checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        const rememberLogin = localStorage.getItem('rememberLogin');

        if (savedUser && rememberLogin === 'true') {
            isLoggedIn = true;
            currentUser = JSON.parse(savedUser);
            updateUIForLoggedInUser();
        }
    }

    // Cập nhật UI khi người dùng đã đăng nhập
    function updateUIForLoggedInUser() {
        if (isLoggedIn && currentUser && elements.headerLoginBtn && elements.headerRegisterBtn) {
            // Cập nhật nút đăng nhập để hiển thị tên người dùng (với hỗ trợ ngôn ngữ)
            const currentLanguage = localStorage.getItem('language') || 'vi';
            const greeting = currentLanguage === 'vi' ? `Xin chào, ${currentUser.name}` : `Hello, ${currentUser.name}`;
            elements.headerLoginBtn.textContent = greeting;
            elements.headerLoginBtn.style.background = '#4ecdc4';

            // Cập nhật nút đăng ký thành đăng xuất (với hỗ trợ ngôn ngữ)
            const logoutText = currentLanguage === 'vi' ? 'Đăng Xuất' : 'Logout';
            elements.headerRegisterBtn.textContent = logoutText;
            elements.headerRegisterBtn.style.background = '#ff6b6b';

            // Xóa event listeners cũ và thêm mới
            elements.headerLoginBtn.replaceWith(elements.headerLoginBtn.cloneNode(true));
            elements.headerRegisterBtn.replaceWith(elements.headerRegisterBtn.cloneNode(true));

            // Lấy references mới
            elements.headerLoginBtn = document.querySelector('.btn-login');
            elements.headerRegisterBtn = document.querySelector('.btn-register');

            // Thêm chức năng đăng xuất
            if (elements.headerRegisterBtn) {
                elements.headerRegisterBtn.addEventListener('click', logout);
            }
        }
    }

    // Hàm đăng xuất
    function logout() {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');

        // Reset UI về trạng thái đã đăng xuất
        resetUIToLoggedOut();

        // Hiển thị trang chủ thay vì modal
        showHomePage();
    }

    // Reset UI về trạng thái đã đăng xuất
    function resetUIToLoggedOut() {
        if (elements.headerLoginBtn && elements.headerRegisterBtn) {
            const currentLanguage = localStorage.getItem('language') || 'vi';
            // Reset nút đăng nhập
            elements.headerLoginBtn.textContent = currentLanguage === 'vi' ? 'Đăng Nhập' : 'Login';
            elements.headerLoginBtn.style.background = '#ffd700';

            // Reset nút đăng ký
            elements.headerRegisterBtn.textContent = currentLanguage === 'vi' ? 'Đăng Ký' : 'Register';
            elements.headerRegisterBtn.style.background = '#ffa500';

            // Xóa event listeners cũ và thêm lại các listeners gốc
            elements.headerLoginBtn.replaceWith(elements.headerLoginBtn.cloneNode(true));
            elements.headerRegisterBtn.replaceWith(elements.headerRegisterBtn.cloneNode(true));

            // Lấy references mới
            elements.headerLoginBtn = document.querySelector('.btn-login');
            elements.headerRegisterBtn = document.querySelector('.btn-register');

            // Thêm lại event listeners gốc
            if (elements.headerLoginBtn) {
                elements.headerLoginBtn.addEventListener('click', () => showModal(false));
            }
            if (elements.headerRegisterBtn) {
                elements.headerRegisterBtn.addEventListener('click', () => showModal(true));
            }
        }
    }

    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', function() {
            console.log('🚀 Nút bắt đầu được click');

            // Kiểm tra người dùng đã đăng nhập chưa
            if (isLoggedIn) {
                // Người dùng đã đăng nhập, hiển thị dashboard
                console.log('✅ Người dùng đã đăng nhập, hiển thị dashboard');
                const currentLanguage = localStorage.getItem('language') || 'vi';
                const redirectingText = currentLanguage === 'vi' ? 'Đang chuyển hướng...' : 'Redirecting...';
                elements.startBtn.textContent = redirectingText;
                elements.startBtn.disabled = true;

                setTimeout(() => {
                    showDashboard();
                    elements.startBtn.textContent = currentLanguage === 'vi' ? 'Bắt Đầu Ngay' : 'Get Started';
                    elements.startBtn.disabled = false;
                }, 1000);
            } else {
                // Người dùng chưa đăng nhập, hiển thị modal đăng nhập
                console.log('❌ Người dùng chưa đăng nhập, hiển thị modal');
                showModal(false);

                // Thêm thông báo khuyến khích
                setTimeout(() => {
                    const loginForm = document.getElementById('loginForm');
                    if (loginForm && !loginForm.querySelector('.login-message')) {
                        const message = document.createElement('div');
                        message.className = 'login-message';
                        message.style.cssText = `
                            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                            padding: 15px;
                            border-radius: 10px;
                            margin-bottom: 20px;
                            text-align: center;
                            color: #1976d2;
                            font-size: 0.9rem;
                            border-left: 4px solid #2196f3;
                        `;
                        const currentLanguage = localStorage.getItem('language') || 'vi';
                        const messageText = currentLanguage === 'vi'
                            ? '🚀 Vui lòng đăng nhập để sử dụng công cụ nhận diện ngôn ngữ ký hiệu!'
                            : '🚀 Please login to use the sign language recognition tool!';
                        message.innerHTML = messageText;
                        loginForm.insertBefore(message, loginForm.firstChild);
                    }
                }, 100);
            }
        });
    }
    
    if (elements.registerBtn) {
        elements.registerBtn.addEventListener('click', function() {
            console.log('📝 Nút đăng ký modal được click');
            if (elements.authContainer) {
                elements.authContainer.classList.add('active');
            }
        });
    }
    
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', function() {
            console.log('🔑 Nút đăng nhập modal được click');
            if (elements.authContainer) {
                elements.authContainer.classList.remove('active');
            }
        });
    }
    
    if (elements.authOverlay) {
        elements.authOverlay.addEventListener('click', hideModal);
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === elements.authModal) {
            hideModal();
        }
    });
    
    // Chức năng theme
    let isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    
    function updateTheme() {
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            if (elements.themeToggle) elements.themeToggle.textContent = '🌙';
        } else {
            document.body.classList.remove('dark-theme');
            if (elements.themeToggle) elements.themeToggle.textContent = '🌟';
        }
        localStorage.setItem('darkTheme', isDarkTheme);
        updateThemeTooltip();
    }
    
    function updateThemeTooltip() {
        const currentLanguage = localStorage.getItem('language') || 'vi';
        if (elements.themeToggle) {
            if (currentLanguage === 'vi') {
                if (isDarkTheme) {
                    elements.themeToggle.setAttribute('data-tooltip', 'Chế độ tối - Click để chuyển sang chế độ sáng');
                } else {
                    elements.themeToggle.setAttribute('data-tooltip', 'Chế độ sáng - Click để chuyển sang chế độ tối');
                }
            } else {
                if (isDarkTheme) {
                    elements.themeToggle.setAttribute('data-tooltip', 'Dark mode - Click to switch to light mode');
                } else {
                    elements.themeToggle.setAttribute('data-tooltip', 'Light mode - Click to switch to dark mode');
                }
            }
        }
    }
    
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            console.log('🌟 Toggle theme được click');
            isDarkTheme = !isDarkTheme;
            
            // Thêm animation xoay
            elements.themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                elements.themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
            
            updateTheme();
        });
    }
    
    // Chức năng ngôn ngữ
    let currentLanguage = localStorage.getItem('language') || 'vi';
    
    const translations = {
        vi: {
            'login': 'Đăng Nhập',
            'register': 'Đăng Ký',
            'hero-title': 'Công cụ hỗ trợ nhận diện ngôn ngữ ký hiệu',
            'start-btn': 'Bắt Đầu Ngay',
            'create-account': 'Tạo Tài Khoản',
            'or-email-register': 'hoặc sử dụng email để đăng ký',
            'agree-terms': 'Tôi đồng ý với',
            'terms-of-use': 'điều khoản sử dụng',
            'or-email-login': 'hoặc sử dụng email và mật khẩu',
            'remember-me': 'Ghi nhớ đăng nhập',
            'forgot-password': 'Quên mật khẩu?',
            'welcome-back': 'Chào Mừng Trở Lại!',
            'welcome-back-desc': 'Nhập thông tin cá nhân để sử dụng tất cả t��nh năng của trang web',
            'hello': 'Xin Chào!',
            'hello-desc': 'Đăng ký với thông tin cá nhân để sử dụng tất cả tính năng của trang web',
            'name': 'Họ và tên',
            'email': 'Email',
            'password': 'Mật khẩu'
        },
        en: {
            'login': 'Login',
            'register': 'Register',
            'hero-title': 'Sign Language Recognition Support Tool',
            'start-btn': 'Get Started',
            'create-account': 'Create Account',
            'or-email-register': 'or use email to register',
            'agree-terms': 'I agree with',
            'terms-of-use': 'terms of use',
            'or-email-login': 'or use email and password',
            'remember-me': 'Remember me',
            'forgot-password': 'Forgot password?',
            'welcome-back': 'Welcome Back!',
            'welcome-back-desc': 'Enter your personal details to use all features of the website',
            'hello': 'Hello!',
            'hello-desc': 'Register with your personal details to use all features of the website',
            'name': 'Full Name',
            'email': 'Email',
            'password': 'Password'
        }
    };
    
    function translatePage(lang) {
        console.log(`🌐 Dịch sang: ${lang}`);
        currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Cập nhật tiêu đề trang
        if (lang === 'en') {
            document.title = 'Sign Language Recognition Tool';
        } else {
            document.title = 'Sign Language - Ngôn Ngữ Ký Hiệu';
        }

        // Dịch các elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Dịch placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Cập nhật tooltips
        updateThemeTooltip();
        updateLogoTooltip();

        // Cập nhật tooltip toggle ngôn ngữ
        if (elements.languageToggle) {
            if (lang === 'vi') {
                elements.languageToggle.setAttribute('data-tooltip', 'Tiếng Việt (VN) - Click để chuyển sang English');
            } else {
                elements.languageToggle.setAttribute('data-tooltip', 'English (US) - Click to switch to Vietnamese');
            }
        }

        // Cập nhật UI người dùng đã đăng nhập với ngôn ngữ mới
        if (isLoggedIn) {
            updateUIForLoggedInUser();
        }
    }
    
    if (elements.languageToggle) {
        elements.languageToggle.addEventListener('click', function() {
            console.log('🌐 Toggle ngôn ngữ được click');
            const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
            translatePage(newLang);
        });
    }
    
    // Chức năng logo
    function updateLogoTooltip() {
        if (elements.logoHome) {
            if (currentLanguage === 'vi') {
                elements.logoHome.setAttribute('data-tooltip', 'Về trang chủ');
            } else {
                elements.logoHome.setAttribute('data-tooltip', 'Return to home');
            }
        }
    }
    
    if (elements.logoHome) {
        elements.logoHome.addEventListener('click', () => {
            console.log('🏠 Logo được click - trở về trang chủ');
            
            // Hiển thị trang chủ với cleanup đúng cách
            showHomePage();
            
            // Scroll lên đầu mượt mà
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Đóng bất kỳ modal nào đang mở
            hideModal();
            
            // Reset trạng thái auth container
            if (elements.authContainer) {
                elements.authContainer.classList.remove('active');
            }
        });
    }
    
    // Xử lý submit form
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🔑 Form đăng nhập được submit');

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            if (!email || !password) {
                const alertMessage = currentLanguage === 'vi'
                    ? 'Vui lòng nhập đầy đủ email và mật khẩu!'
                    : 'Please enter both email and password!';
                alert(alertMessage);
                return;
            }

            // Mô phỏng quá trình đăng nhập
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const loggingInText = currentLanguage === 'vi' ? 'Đang đăng nhập...' : 'Logging in...';
            submitBtn.textContent = loggingInText;
            submitBtn.disabled = true;

            setTimeout(() => {
                // Tạo dữ liệu người dùng (trong app thực tế, sẽ đến từ API)
                const userData = {
                    id: 1,
                    name: email.split('@')[0],
                    email: email,
                    loginTime: new Date().toISOString()
                };

                // Đặt trạng thái đăng nhập
                isLoggedIn = true;
                currentUser = userData;

                // Luôn lưu người dùng hiện tại cho session, lưu preference ghi nhớ riêng
                localStorage.setItem('currentUser', JSON.stringify(userData));

                if (rememberMe) {
                    localStorage.setItem('rememberLogin', 'true');
                } else {
                    localStorage.removeItem('rememberLogin');
                }

                // Cập nhật UI
                updateUIForLoggedInUser();

                // Ẩn modal nhưng ở lại trang chủ
                hideModal();

                // Reset form
                loginForm.reset();
                const loginMessage = loginForm.querySelector('.login-message');
                if (loginMessage) {
                    loginMessage.remove();
                }

                // Reset nút
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Không hiển thị thông báo thành công nữa
                console.log('✅ Đăng nhập thành công');
            }, 1500);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Form đăng ký được submit');

            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            if (!name || !email || !password) {
                const alertMessage = currentLanguage === 'vi'
                    ? 'Vui lòng nhập đầy đủ thông tin!'
                    : 'Please fill in all information!';
                alert(alertMessage);
                return;
            }

            if (password.length < 6) {
                const passwordAlert = currentLanguage === 'vi'
                    ? 'Mật khẩu phải có ít nhất 6 ký tự!'
                    : 'Password must be at least 6 characters!';
                alert(passwordAlert);
                return;
            }

            if (!agreeTerms) {
                const termsAlert = currentLanguage === 'vi'
                    ? 'Vui lòng đồng ý với điều khoản sử dụng!'
                    : 'Please agree to the terms of use!';
                alert(termsAlert);
                return;
            }

            // Mô phỏng quá trình đăng ký
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const registeringText = currentLanguage === 'vi' ? 'Đang đăng ký...' : 'Registering...';
            submitBtn.textContent = registeringText;
            submitBtn.disabled = true;

            setTimeout(() => {
                // Tạo dữ liệu người dùng (trong app thực tế, sẽ đến từ API)
                const userData = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    loginTime: new Date().toISOString()
                };

                // Tự động đăng nhập sau khi đăng ký
                isLoggedIn = true;
                currentUser = userData;

                // Lưu vào localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('rememberLogin', 'true');

                // Cập nhật UI
                updateUIForLoggedInUser();

                // Ẩn modal nhưng ở lại trang chủ
                hideModal();

                // Reset form
                registerForm.reset();

                // Reset nút
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Không hiển thị thông báo thành công nữa
                console.log('✅ Đăng ký thành công');
            }, 1500);
        });
    }

    // Khởi tạo mọi thứ
    checkLoginStatus(); // Kiểm tra trạng thái đăng nhập trước
    updateTheme();
    translatePage(currentLanguage);

    // Nếu người dùng đã đăng nhập, cập nhật UI nhưng ở lại trang chủ
    if (isLoggedIn && currentUser) {
        updateUIForLoggedInUser();
        console.log('✅ Người dùng đã đăng nhập, sẵn sàng truy cập dashboard');
    }

    console.log('🎉 Hoàn thành khởi tạo tất cả!');
});

console.log('📝 File script với chức năng thật đã được tải');