// Complete Fixed Script for Sign Language App
console.log('🚀 Script loading...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing...');
    
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
    
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', function() {
            console.log('🚀 Start button clicked');
            showModal(false);
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
        if (elements.themeToggle && typeof currentLanguage !== 'undefined') {
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
                elements.languageToggle.setAttribute('data-tooltip', 'English (US) - Click to switch to Tiếng Việt');
            }
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
            console.log('🏠 Logo clicked - scrolling to top');
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
    
    // Initialize everything
    updateTheme();
    translatePage(currentLanguage);
    
    console.log('🎉 All initialization complete!');
});

console.log('📝 Script file loaded');
