// Complete Fixed Script for Sign Language App
console.log('🚀 Script loading...');

// Dashboard Functions (moved to top for hoisting)
function showDashboard() {
    console.log('🎯 Showing dashboard');
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';

    // Update page title
    const currentLanguage = localStorage.getItem('language') || 'vi';
    document.title = currentLanguage === 'vi' ? 'Dashboard - Sign Language' : 'Dashboard - Sign Language';

    // Initialize dashboard functionality
    initializeDashboard();
}

function showHomePage() {
    console.log('🏠 Showing home page');
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('dashboardPage').style.display = 'none';

    // Update page title
    const currentLanguage = localStorage.getItem('language') || 'vi';
    document.title = currentLanguage === 'vi' ? 'Sign Language - Ngôn Ngữ Ký Hiệu' : 'Sign Language Recognition Tool';
}

function initializeDashboard() {
    console.log('🔧 Initializing dashboard');

    // Setup sidebar tabs
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            sidebarTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            console.log('📋 Switched to tab:', targetTab);
        });
    });

    // Setup text-to-speech functionality
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
                
                console.log('Processing text:', text, 'Voice:', voice, 'Language:', language);
                
                // Show audio controls
                const audioControlsPanel = document.querySelector('.audio-controls-panel');
                const audioStatus = document.querySelector('.audio-status');
                
                if (audioStatus) {
                    audioStatus.textContent = 'Đang tạo âm thanh...';
                }
                
                // Simulate processing
                setTimeout(() => {
                    if (audioStatus) {
                        audioStatus.textContent = `Âm thanh đã được tạo (${voice}, ${language})`;
                    }
                    if (audioControlsPanel) {
                        audioControlsPanel.style.display = 'flex';
                    }
                }, 2000);
            }
        });
    }

    // Setup speech-to-text functionality
    const micContainer = document.getElementById('micContainer');
    const micIcon = document.getElementById('micIcon');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTimer = document.getElementById('recordingTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const convertSpeechBtn = document.getElementById('convertSpeechBtn');
    const speechToTextOutput = document.getElementById('speechToTextOutput');
    const downloadTextBtn = document.getElementById('downloadTextBtn');
    
    let isRecording = false;
    let recordingInterval;
    let recordingTime = 0;

    if (micContainer) {
        micContainer.addEventListener('click', function() {
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        });
    }

    function startRecording() {
        isRecording = true;
        recordingTime = 0;
        
        if (micIcon) {
            micIcon.classList.add('recording');
        }
        
        if (recordingStatus) {
            recordingStatus.textContent = 'Đang ghi âm... Nhấn lại để dừng';
        }
        
        if (recordingTimer) {
            recordingTimer.style.display = 'block';
        }
        
        // Start timer
        recordingInterval = setInterval(() => {
            recordingTime++;
            const minutes = Math.floor(recordingTime / 60);
            const seconds = recordingTime % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
        
        console.log('🎤 Recording started');
    }

    function stopRecording() {
        isRecording = false;
        
        if (micIcon) {
            micIcon.classList.remove('recording');
        }
        
        if (recordingStatus) {
            recordingStatus.textContent = 'Ghi âm hoàn tất. Nhấn mũi tên để chuyển đổi thành văn bản';
        }
        
        if (recordingTimer) {
            recordingTimer.style.display = 'none';
        }
        
        if (convertSpeechBtn) {
            convertSpeechBtn.style.display = 'block';
        }
        
        clearInterval(recordingInterval);
        console.log('🎤 Recording stopped');
    }

    if (convertSpeechBtn) {
        convertSpeechBtn.addEventListener('click', function() {
            if (speechToTextOutput) {
                speechToTextOutput.value = 'Đang xử lý âm thanh...';
                
                // Simulate processing
                setTimeout(() => {
                    speechToTextOutput.value = 'Đây là văn bản được chuyển đổi từ giọng nói của bạn. Thời gian ghi âm: ' + timerDisplay.textContent;
                    
                    if (downloadTextBtn) {
                        downloadTextBtn.style.display = 'flex';
                    }
                }, 2000);
            }
            
            convertSpeechBtn.style.display = 'none';
        });
    }

    // Setup download functionality
    if (downloadTextBtn) {
        downloadTextBtn.addEventListener('click', function() {
            const text = speechToTextOutput.value;
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'speech-to-text-result.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

// Check if user is already logged in
function checkExistingLogin() {
    const savedUser = localStorage.getItem('currentUser');
    console.log('🔍 Checking existing login:', savedUser);

    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
        try {
            const userData = JSON.parse(savedUser);
            if (userData && userData.name) {
                console.log('✅ User found:', userData.name);
                return userData;
            }
        } catch (e) {
            console.error('❌ Error parsing saved user:', e);
            localStorage.removeItem('currentUser');
        }
    }

    console.log('ℹ️ No valid user found, staying on home page');
    return false;
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing...');

    // Check if user is already logged in but stay on home page
    const existingUser = checkExistingLogin();
    // User will stay on home page regardless of login status
    // They can click "Get Started" to access dashboard

    // Get all elements with error checking
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
    
    // Log which elements were found
    console.log('🔍 Elements found:');
    Object.keys(elements).forEach(key => {
        console.log(`  ${key}: ${elements[key] ? '✅' : '❌'}`);
    });
    
    // Modal functions
    function showModal(showRegister = false) {
        console.log(`📱 Showing modal (register: ${showRegister})`);
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
        console.log('❌ Hiding modal');
        if (elements.authModal) {
            elements.authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Event listeners for buttons
    if (elements.headerLoginBtn) {
        elements.headerLoginBtn.addEventListener('click', function() {
            console.log('🔑 Header login button clicked');
            showModal(false);
        });
    }
    
    if (elements.headerRegisterBtn) {
        elements.headerRegisterBtn.addEventListener('click', function() {
            console.log('📝 Header register button clicked');
            showModal(true);
        });
    }
    
    // Authentication state management
    let isLoggedIn = !!existingUser;
    let currentUser = existingUser || null;

    // Check login status
    function checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        const rememberLogin = localStorage.getItem('rememberLogin');

        if (savedUser && rememberLogin === 'true') {
            isLoggedIn = true;
            currentUser = JSON.parse(savedUser);
            updateUIForLoggedInUser();
        }
    }

    // Update UI when user is logged in
    function updateUIForLoggedInUser() {
        if (isLoggedIn && currentUser && elements.headerLoginBtn && elements.headerRegisterBtn) {
            // Update login button to show user name (with language support)
            const currentLanguage = localStorage.getItem('language') || 'vi';
            const greeting = currentLanguage === 'vi' ? `Xin chào, ${currentUser.name}` : `Hello, ${currentUser.name}`;
            elements.headerLoginBtn.textContent = greeting;
            elements.headerLoginBtn.style.background = '#4ecdc4';

            // Update register button to logout (with language support)
            const logoutText = currentLanguage === 'vi' ? 'Đăng Xuất' : 'Logout';
            elements.headerRegisterBtn.textContent = logoutText;
            elements.headerRegisterBtn.style.background = '#ff6b6b';

            // Remove original event listeners and add new ones
            elements.headerLoginBtn.replaceWith(elements.headerLoginBtn.cloneNode(true));
            elements.headerRegisterBtn.replaceWith(elements.headerRegisterBtn.cloneNode(true));

            // Get new references
            elements.headerLoginBtn = document.querySelector('.btn-login');
            elements.headerRegisterBtn = document.querySelector('.btn-register');

            // Add logout functionality
            if (elements.headerRegisterBtn) {
                elements.headerRegisterBtn.addEventListener('click', logout);
            }
        }
    }

    // Logout function
    function logout() {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');

        // Reset UI to logged out state
        resetUIToLoggedOut();

        // Show home page instead of modal
        showHomePage();
    }

    // Reset UI to logged out state
    function resetUIToLoggedOut() {
        if (elements.headerLoginBtn && elements.headerRegisterBtn) {
            const currentLanguage = localStorage.getItem('language') || 'vi';
            // Reset login button
            elements.headerLoginBtn.textContent = currentLanguage === 'vi' ? 'Đăng Nhập' : 'Login';
            elements.headerLoginBtn.style.background = '#ffd700';

            // Reset register button
            elements.headerRegisterBtn.textContent = currentLanguage === 'vi' ? 'Đăng Ký' : 'Register';
            elements.headerRegisterBtn.style.background = '#ffa500';

            // Remove old event listeners and add original ones back
            elements.headerLoginBtn.replaceWith(elements.headerLoginBtn.cloneNode(true));
            elements.headerRegisterBtn.replaceWith(elements.headerRegisterBtn.cloneNode(true));

            // Get new references
            elements.headerLoginBtn = document.querySelector('.btn-login');
            elements.headerRegisterBtn = document.querySelector('.btn-register');

            // Add original event listeners back
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
            console.log('🚀 Start button clicked');

            // Check if user is logged in
            if (isLoggedIn) {
                // User is logged in, show dashboard
                console.log('✅ User logged in, showing dashboard');
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
                // User not logged in, show login modal
                console.log('❌ User not logged in, showing modal');
                showModal(false);

                // Add encouraging message
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
            console.log('📝 Modal register button clicked');
            if (elements.authContainer) {
                elements.authContainer.classList.add('active');
            }
        });
    }
    
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', function() {
            console.log('🔑 Modal login button clicked');
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
    
    // Theme functionality
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
            console.log('🌟 Theme toggle clicked');
            isDarkTheme = !isDarkTheme;
            
            // Add rotation animation
            elements.themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                elements.themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
            
            updateTheme();
        });
    }
    
    // Language functionality
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
            'welcome-back-desc': 'Nhập thông tin cá nhân để sử dụng tất cả tính năng của trang web',
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
        console.log(`🌐 Translating to: ${lang}`);
        currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Update page title
        if (lang === 'en') {
            document.title = 'Sign Language Recognition Tool';
        } else {
            document.title = 'Sign Language - Ngôn Ngữ Ký Hiệu';
        }

        // Translate elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update tooltips
        updateThemeTooltip();
        updateLogoTooltip();

        // Update language toggle tooltip
        if (elements.languageToggle) {
            if (lang === 'vi') {
                elements.languageToggle.setAttribute('data-tooltip', 'Tiếng Việt (VN) - Click để chuyển sang English');
            } else {
                elements.languageToggle.setAttribute('data-tooltip', 'English (US) - Click to switch to Vietnamese');
            }
        }

        // Update logged in user UI with new language
        if (isLoggedIn) {
            updateUIForLoggedInUser();
        }
    }
    
    if (elements.languageToggle) {
        elements.languageToggle.addEventListener('click', function() {
            console.log('🌐 Language toggle clicked');
            const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
            translatePage(newLang);
        });
    }
    
    // Logo functionality
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
            console.log('🏠 Logo clicked - returning to home');
            // Show home page (works for single page app)
            showHomePage();
            // Scroll to top and close modal
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            hideModal();
            if (elements.authContainer) {
                elements.authContainer.classList.remove('active');
            }
        });
    }
    
    // Form submission handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🔑 Login form submitted');

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            if (!email || !password) {
                const alertMessage = currentLanguage === 'vi'
                    ? 'Vui lòng nhập ��ầy đủ email và mật khẩu!'
                    : 'Please enter both email and password!';
                alert(alertMessage);
                return;
            }

            // Simulate login process
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const loggingInText = currentLanguage === 'vi' ? 'Đang đăng nhập...' : 'Logging in...';
            submitBtn.textContent = loggingInText;
            submitBtn.disabled = true;

            setTimeout(() => {
                // Create user data (in real app, this would come from API)
                const userData = {
                    id: 1,
                    name: email.split('@')[0],
                    email: email,
                    loginTime: new Date().toISOString()
                };

                // Set login state
                isLoggedIn = true;
                currentUser = userData;

                // Always save current user for session, save remember preference separately
                localStorage.setItem('currentUser', JSON.stringify(userData));

                if (rememberMe) {
                    localStorage.setItem('rememberLogin', 'true');
                } else {
                    localStorage.removeItem('rememberLogin');
                }

                // Update UI
                updateUIForLoggedInUser();

                // Hide modal but stay on home page
                hideModal();

                // Reset form
                loginForm.reset();
                const loginMessage = loginForm.querySelector('.login-message');
                if (loginMessage) {
                    loginMessage.remove();
                }

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                const successMessage = currentLanguage === 'vi'
                    ? 'Đăng nhập thành công! Nhấn "Bắt Đầu Ngay" để truy cập dashboard.'
                    : 'Login successful! Click "Get Started" to access dashboard.';
                alert(successMessage);
            }, 1500);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Register form submitted');

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

            // Simulate register process
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const registeringText = currentLanguage === 'vi' ? 'Đang đăng ký...' : 'Registering...';
            submitBtn.textContent = registeringText;
            submitBtn.disabled = true;

            setTimeout(() => {
                // Create user data (in real app, this would come from API)
                const userData = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    loginTime: new Date().toISOString()
                };

                // Auto-login after registration
                isLoggedIn = true;
                currentUser = userData;

                // Save to localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('rememberLogin', 'true');

                // Update UI
                updateUIForLoggedInUser();

                // Hide modal but stay on home page
                hideModal();

                // Reset form
                registerForm.reset();

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                const registerSuccessMessage = currentLanguage === 'vi'
                    ? 'Đăng ký thành công! Nhấn "Bắt Đầu Ngay" để truy cập dashboard.'
                    : 'Registration successful! Click "Get Started" to access dashboard.';
                alert(registerSuccessMessage);
            }, 1500);
        });
    }

    // Initialize everything
    checkLoginStatus(); // Check login status first
    updateTheme();
    translatePage(currentLanguage);

    // If user is already logged in, update UI but stay on home page
    if (isLoggedIn && currentUser) {
        updateUIForLoggedInUser();
        console.log('✅ User is logged in, ready for dashboard access');
    }

    console.log('🎉 All initialization complete!');
});

console.log('📝 Script file loaded');