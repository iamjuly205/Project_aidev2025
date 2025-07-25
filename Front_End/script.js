// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

function updateTheme() {
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        themeToggle.textContent = '🌙';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.textContent = '🌟';
    }
    localStorage.setItem('darkTheme', isDarkTheme);
    updateThemeTooltip();
}

function updateThemeTooltip() {
    if (typeof currentLanguage !== 'undefined') {
        if (currentLanguage === 'vi') {
            if (isDarkTheme) {
                themeToggle.setAttribute('data-tooltip', 'Chế độ tối - Click để chuyển sang chế độ sáng');
            } else {
                themeToggle.setAttribute('data-tooltip', 'Chế độ sáng - Click để chuyển sang chế độ tối');
            }
        } else {
            if (isDarkTheme) {
                themeToggle.setAttribute('data-tooltip', 'Dark mode - Click to switch to light mode');
            } else {
                themeToggle.setAttribute('data-tooltip', 'Light mode - Click to switch to dark mode');
            }
        }
    }
}

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;

    // Add rotation animation to theme button
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);

    updateTheme();
});

// Initialize theme
updateTheme();

// Auth Modal elements (declare early to avoid reference errors)
const authModal = document.getElementById('authModal');
const authContainer = document.getElementById('container');
const authOverlay = document.getElementById('authOverlay');

// Hide auth modal function
function hideAuthModal() {
    if (authModal) {
        authModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Logo return to home functionality
const logoHome = document.getElementById('logoHome');

function updateLogoTooltip() {
    if (typeof currentLanguage !== 'undefined') {
        if (currentLanguage === 'vi') {
            logoHome.setAttribute('data-tooltip', 'Về trang chủ');
        } else {
            logoHome.setAttribute('data-tooltip', 'Return to home');
        }
    }
}

logoHome.addEventListener('click', () => {
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Close any open modals
    hideAuthModal();

    // Reset any active states
    if (authContainer) {
        authContainer.classList.remove('active');
    }
});

// Initialize logo tooltip
updateLogoTooltip();

// Authentication state management
let isLoggedIn = false;
let currentUser = null;

// Check if user is logged in from localStorage
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
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');

    if (isLoggedIn && currentUser) {
        // Hide login/register buttons and show user info
        loginBtn.textContent = `Xin chào, ${currentUser.name}`;
        loginBtn.style.background = '#4ecdc4';
        loginBtn.onclick = () => logout();

        registerBtn.textContent = 'Đăng Xuất';
        registerBtn.style.background = '#ff6b6b';
        registerBtn.onclick = () => logout();
    }
}

// Logout function
function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberLogin');

    // Reset UI
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');

    loginBtn.textContent = 'Đăng Nhập';
    loginBtn.style.background = '#ffd700';
    loginBtn.onclick = () => {
        showLoginModal();
    };

    registerBtn.textContent = 'Đăng Ký';
    registerBtn.style.background = '#ffa500';
    registerBtn.onclick = () => {
        showRegisterModal();
    };

    alert('Đã đăng xuất thành công!');
}

// Start button functionality with login check
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    // Add click animation
    startBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        startBtn.style.transform = 'scale(1)';
    }, 150);

    // Check if user is logged in
    if (isLoggedIn) {
        // User is logged in, redirect to dashboard
        redirectToDashboard();
    } else {
        // User not logged in, show login popup
        showLoginModal();

        // Add a message to encourage login
        const loginForm = document.getElementById('loginForm');
        const existingMessage = loginForm.querySelector('.login-message');
        if (!existingMessage) {
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
            message.innerHTML = '🚀 Vui lòng đăng nhập để sử dụng công cụ nhận diện ngôn ngữ ký hiệu!';
            loginForm.insertBefore(message, loginForm.firstChild);
        }
    }
});

// Redirect to dashboard function
function redirectToDashboard() {
    // Add loading animation
    startBtn.textContent = 'Đang chuyển hướng...';
    startBtn.disabled = true;

    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Add floating animation to hero section
const heroSection = document.querySelector('.hero-section');

setInterval(() => {
    heroSection.style.transform = 'translateY(-5px)';
    setTimeout(() => {
        heroSection.style.transform = 'translateY(0px)';
    }, 2000);
}, 4000);

// Add hover effects to buttons
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
    });
});

// Modern Auth Modal functionality
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const headerLoginBtn = document.querySelector('.btn-login');
const headerRegisterBtn = document.querySelector('.btn-register');

// Show auth modal with login form
function showLoginModal() {
    console.log('showLoginModal called');
    if (authModal) {
        authModal.classList.add('show');
        console.log('Modal show class added');
    }
    if (authContainer) {
        authContainer.classList.remove('active');
    }
    document.body.style.overflow = 'hidden';
}

// Show auth modal with register form
function showRegisterModal() {
    console.log('showRegisterModal called');
    if (authModal) {
        authModal.classList.add('show');
        console.log('Modal show class added');
    }
    if (authContainer) {
        authContainer.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}



// Toggle to register
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        if (authContainer) {
            authContainer.classList.add('active');
        }
    });
}

// Toggle to login
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (authContainer) {
            authContainer.classList.remove('active');
        }
    });
}

// Open login modal (always show for testing)
if (headerLoginBtn) {
    headerLoginBtn.addEventListener('click', () => {
        console.log('Login button clicked, isLoggedIn:', isLoggedIn);
        showLoginModal();
    });
}

// Open register modal (always show for testing)
if (headerRegisterBtn) {
    headerRegisterBtn.addEventListener('click', () => {
        console.log('Register button clicked, isLoggedIn:', isLoggedIn);
        showRegisterModal();
    });
}

// Close modal when clicking overlay
if (authOverlay) {
    authOverlay.addEventListener('click', hideAuthModal);
}

// Close modal when clicking outside container
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        hideAuthModal();
    }
});

// Language Translation System
const translations = {
    vi: {
        // Header
        'login': 'Đăng Nhập',
        'register': 'Đăng Ký',

        // Hero Section
        'hero-title': 'Công cụ hỗ trợ nhận diện ngôn ngữ ký hiệu',
        'start-btn': 'Bắt Đầu Ngay',

        // Register Form
        'create-account': 'Tạo Tài Khoản',
        'or-email-register': 'hoặc sử dụng email để đăng ký',
        'agree-terms': 'Tôi đồng ý với',
        'terms-of-use': 'điều khoản sử dụng',

        // Login Form
        'or-email-login': 'hoặc sử dụng email và mật khẩu',
        'remember-me': 'Ghi nhớ đăng nhập',
        'forgot-password': 'Quên mật khẩu?',

        // Toggle Panels
        'welcome-back': 'Chào Mừng Trở Lại!',
        'welcome-back-desc': 'Nhập thông tin cá nhân để sử dụng tất cả tính năng của trang web',
        'hello': 'Xin Chào!',
        'hello-desc': 'Đăng ký với thông tin cá nhân để sử dụng tất cả tính năng của trang web',

        // Placeholders
        'name': 'Họ và tên',
        'email': 'Email',
        'password': 'Mật khẩu'
    },
    en: {
        // Header
        'login': 'Login',
        'register': 'Register',

        // Hero Section
        'hero-title': 'Sign Language Recognition Support Tool',
        'start-btn': 'Get Started',

        // Register Form
        'create-account': 'Create Account',
        'or-email-register': 'or use email to register',
        'agree-terms': 'I agree with',
        'terms-of-use': 'terms of use',

        // Login Form
        'or-email-login': 'or use email and password',
        'remember-me': 'Remember me',
        'forgot-password': 'Forgot password?',

        // Toggle Panels
        'welcome-back': 'Welcome Back!',
        'welcome-back-desc': 'Enter your personal details to use all features of the website',
        'hello': 'Hello!',
        'hello-desc': 'Register with your personal details to use all features of the website',

        // Placeholders
        'name': 'Full Name',
        'email': 'Email',
        'password': 'Password'
    }
};

// Current language state
let currentLanguage = localStorage.getItem('language') || 'vi';

// Language toggle functionality
const languageToggle = document.getElementById('languageToggle');

function translatePage(lang) {
    console.log('translatePage called with lang:', lang);
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update document language
    document.documentElement.lang = lang;

    // Update page title
    if (lang === 'en') {
        document.title = 'Sign Language Recognition Tool';
    } else {
        document.title = 'Sign Language - Ngôn Ngữ Ký Hiệu';
    }
    console.log('Title updated to:', document.title);

    // Translate all elements with data-translate attribute
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

    // Update language toggle tooltip (keep 🌐 icon)
    if (languageToggle) {
        if (lang === 'vi') {
            languageToggle.setAttribute('data-tooltip', 'Tiếng Việt (VN) - Click để chuyển sang English');
        } else {
            languageToggle.setAttribute('data-tooltip', 'English (US) - Click to switch to Tiếng Việt');
        }
    }

    // Update other tooltips
    if (typeof updateThemeTooltip === 'function') {
        updateThemeTooltip();
    }
    if (typeof updateLogoTooltip === 'function') {
        updateLogoTooltip();
    }
}

// Language toggle event
if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        console.log('Language toggle clicked, current:', currentLanguage);
        const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
        console.log('Switching to:', newLang);
        translatePage(newLang);
    });
} else {
    console.log('Language toggle button not found');
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    translatePage(currentLanguage);
});

// Form submissions
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Basic validation
    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
    }

    // Add loading animation
    const submitBtn = loginForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang đăng nhập...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Here you would typically make an API call to your backend
        console.log('Login attempt:', { email, password, rememberMe });

        // For demo purposes, simulate successful login
        // In real app, you would get user data from API response
        const userData = {
            id: 1,
            name: email.split('@')[0], // Use email prefix as name for demo
            email: email,
            loginTime: new Date().toISOString()
        };

        // Set login state
        isLoggedIn = true;
        currentUser = userData;

        // Save to localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('rememberLogin', 'true');
        }

        // Update UI
        updateUIForLoggedInUser();

        // Show success message
        alert('Đăng nhập thành công!');

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Close modal
        hideAuthModal();

        // Clear form and remove login message
        loginForm.reset();
        const loginMessage = loginForm.querySelector('.login-message');
        if (loginMessage) {
            loginMessage.remove();
        }
    }, 1500);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    if (!agreeTerms) {
        alert('Vui lòng đồng ý với điều khoản sử dụng!');
        return;
    }

    // Add loading animation
    const submitBtn = registerForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang đăng ký...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Here you would typically make an API call to your backend
        console.log('Register attempt:', { name, email, password });

        // For demo purposes, simulate successful registration and auto-login
        const userData = {
            id: Date.now(), // Simple ID generation for demo
            name: name,
            email: email,
            loginTime: new Date().toISOString()
        };

        // Set login state (auto-login after registration)
        isLoggedIn = true;
        currentUser = userData;

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('rememberLogin', 'true');

        // Update UI
        updateUIForLoggedInUser();

        // Show success message
        alert('Đăng ký thành công! Bạn đã được tự động đăng nhập.');

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Close modal
        hideAuthModal();

        // Clear form
        registerForm.reset();
    }, 1500);
});

// Input validation and styling
const inputs = document.querySelectorAll('.form-group input');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#ff6b6b';
        } else {
            input.style.borderColor = '#4ecdc4';
        }
    });

    input.addEventListener('focus', () => {
        input.style.borderColor = '#ffd700';
    });
});

// Smooth scroll and page load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    // Check login status when page loads
    checkLoginStatus();

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});