// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    // Add rotation animation to theme button
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
    
    // Save theme preference
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
});

// Load saved theme
const savedTheme = localStorage.getItem('darkTheme');
if (savedTheme === 'true') {
    body.classList.add('dark-theme');
}

// Start button functionality
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    // Add click animation
    startBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        startBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Add your navigation logic here
    alert('Chức năng đang được phát triển!');
});

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

// Smooth scroll and page load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});