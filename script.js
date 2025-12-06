let locomotiveScroll;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение инициализировано');
    
    // Инициализируем плавный скролл только на десктопах
    if (!isMobileDevice()) {
        initSmoothScroll();
    }
    
    initThemeToggle();
    initTime();
    initDockApps();
    initHeroVisualClicks();
    initNotifications();
    initBackToTopButtons();
    initScrollAnimations();
    initButtonHandlers();
    initServiceNavigation();
});

// ==================== ОПРЕДЕЛЕНИЕ МОБИЛЬНОГО УСТРОЙСТВА ====================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
}

// ==================== ЛОКОМОТИВ СКРОЛЛ ====================
function initSmoothScroll() {
    // Если мобильное устройство, не инициализируем Locomotive Scroll
    if (isMobileDevice()) {
        console.log('Плавный скролл отключен на мобильном устройстве');
        return;
    }
    
    setTimeout(() => {
        const scrollContainer = document.querySelector('.main-container');
        if (!scrollContainer) {
            console.error('Не найден .main-container');
            return;
        }
        
        scrollContainer.setAttribute('data-scroll-container', '');
        
        locomotiveScroll = new LocomotiveScroll({
            el: scrollContainer,
            smooth: true,
            multiplier: 1.3,
            class: 'is-inview',
            inertia: 0.7,
            getDirection: true,
            smartphone: {
                smooth: false,  // Отключаем на смартфонах
                breakpoint: 1024
            },
            tablet: {
                smooth: false,  // Отключаем на планшетах
                breakpoint: 1024
            }
        });
        
        console.log('Locomotive Scroll инициализирован');
        
        window.addEventListener('load', function() {
            if (locomotiveScroll) locomotiveScroll.update();
        });
        
        window.addEventListener('resize', function() {
            if (locomotiveScroll) locomotiveScroll.update();
        });
        
    }, 100);
}

function updateScroll() {
    if (locomotiveScroll) {
        setTimeout(() => {
            locomotiveScroll.update();
        }, 50);
    }
}

// ==================== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ====================
function initThemeToggle() {
    if (!document.getElementById('themeToggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.id = 'themeToggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Сменить тему';
        themeToggle.setAttribute('aria-label', 'Переключить тему');
        
        const statusActions = document.querySelector('.status-actions');
        if (statusActions) {
            statusActions.insertBefore(themeToggle, statusActions.firstChild);
        }
    }
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
        
        updateScroll();
    });
}

// ==================== ВРЕМЯ ====================
let timeInterval;

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function initTime() {
    updateTime();
    timeInterval = setInterval(updateTime, 60000);
}

// ==================== НАВИГАЦИЯ ====================
function initDockApps() {
    const dockApps = document.querySelectorAll('.dock-app');
    
    dockApps.forEach(app => {
        app.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showSection(target);
        });
    });
    
    showSection('home');
}

// ==================== НАВИГАЦИЯ К УСЛУГАМ ====================
function initHeroVisualClicks() {
    document.querySelectorAll('.card-link').forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            navigateToService(serviceType);
        });
    });
}

function navigateToService(serviceId) {
    showSection('services');
    
    setTimeout(() => {
        const targetCard = document.getElementById(serviceId);
        if (targetCard) {
            if (locomotiveScroll) {
                locomotiveScroll.scrollTo(targetCard, {
                    offset: -80,
                    duration: 800
                });
            } else {
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            highlightCard(targetCard);
        }
        
        updateScroll();
    }, 300);
}

function highlightCard(card) {
    const originalBoxShadow = card.style.boxShadow;
    const originalBorderColor = card.style.borderColor;
    
    card.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.5), 0 10px 25px rgba(0, 122, 255, 0.3)';
    card.style.borderColor = 'var(--primary)';
    card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    
    setTimeout(() => {
        card.style.boxShadow = originalBoxShadow;
        card.style.borderColor = originalBorderColor;
    }, 3000);
}

function showSection(sectionId) {
    document.querySelectorAll('.content-area').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        document.querySelectorAll('.dock-app').forEach(app => {
            app.classList.remove('active');
            if (app.getAttribute('data-target') === sectionId) {
                app.classList.add('active');
            }
        });
        
        updateScroll();
    }
}

function initServiceNavigation() {
    const hash = window.location.hash.substring(1);
    if (hash && ['lending', 'korp', 'magazin'].includes(hash)) {
        setTimeout(() => {
            navigateToService(hash);
        }, 800);
    }
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function initNotifications() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==================== КНОПКИ "НАВЕРХ" ====================
let backToTopBtn = null;

function initBackToTopButtons() {
    createMainButton();
}

function createMainButton() {
    if (document.querySelector('.back-to-top')) return;
    
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Вернуться наверх');
    backToTopBtn.setAttribute('title', 'Наверх');
    
    const styles = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 9999;
            backdrop-filter: blur(20px);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            color: white;
            font-size: 1.2rem;
            border: none;
            outline: none;
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .back-to-top:hover {
            background: var(--secondary);
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 122, 255, 0.3);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        if (locomotiveScroll) {
            locomotiveScroll.scrollTo(0, {
                duration: 1000,
                easing: [0.25, 0.1, 0.25, 1],
                disableLerp: false
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    window.addEventListener('scroll', toggleBackToTopVisibility);
    toggleBackToTopVisibility();
}

function scrollToTop() {
    if (locomotiveScroll) {
        locomotiveScroll.scrollTo(0, {
            duration: 1000,
            easing: [0.25, 0.1, 0.25, 1],
            disableLerp: false
        });
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function toggleBackToTopVisibility() {
    if (!backToTopBtn) return;
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

// ==================== АНИМАЦИИ ====================
function initScrollAnimations() {
    addAnimationStyles();
    setupAnimationObserver();
    addAnimationClasses();
    initHoverAnimations();
}

function addAnimationStyles() {
    const animationStyles = `
        .fade-in-up { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
        .fade-in-up.animated { opacity: 1; transform: translateY(0); }
        
        .fade-in-left { opacity: 0; transform: translateX(-30px); transition: all 0.6s ease; }
        .fade-in-left.animated { opacity: 1; transform: translateX(0); }
        
        .fade-in-right { opacity: 0; transform: translateX(30px); transition: all 0.6s ease; }
        .fade-in-right.animated { opacity: 1; transform: translateX(0); }
        
        .scale-in { opacity: 0; transform: scale(0.8); transition: all 0.6s ease; }
        .scale-in.animated { opacity: 1; transform: scale(1); }
        
        .stagger-delay-1 { transition-delay: 0.1s; }
        .stagger-delay-2 { transition-delay: 0.2s; }
        .stagger-delay-3 { transition-delay: 0.3s; }
        .stagger-delay-4 { transition-delay: 0.4s; }
        .stagger-delay-5 { transition-delay: 0.5s; }
    `;

    if (!document.querySelector('#animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'animation-styles';
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
    }
}

function setupAnimationObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    setTimeout(() => {
        const animatedElements = document.querySelectorAll('[class*="fade-"], [class*="scale-"]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }, 500);
}

function addAnimationClasses() {
    const sections = document.querySelectorAll('.content-section');
    const sectionTitles = document.querySelectorAll('.section-title');
    const heroSection = document.querySelector('.hero-section');
    
    const missionCards = document.querySelectorAll('.mission-card');
    const resultCards = document.querySelectorAll('.result-card');
    const projectCards = document.querySelectorAll('.project-card');
    const dockApps = document.querySelectorAll('.dock-app');

    sections.forEach(section => {
        section.classList.add('fade-in-up');
    });

    sectionTitles.forEach((title, index) => {
        title.classList.add('fade-in-up', `stagger-delay-${(index % 5) + 1}`);
    });

    if (heroSection) {
        heroSection.classList.add('scale-in');
    }

    missionCards.forEach((card, index) => {
        const animationType = index % 3 === 0 ? 'fade-in-left' : 
                            index % 3 === 1 ? 'fade-in-right' : 'fade-in-up';
        card.classList.add(animationType, `stagger-delay-${(index % 5) + 1}`);
    });

    resultCards.forEach((card, index) => {
        card.classList.add('fade-in-up', `stagger-delay-${(index % 5) + 1}`);
    });

    projectCards.forEach((card, index) => {
        const animationType = index % 2 === 0 ? 'fade-in-left' : 'fade-in-right';
        card.classList.add(animationType, `stagger-delay-${(index % 5) + 1}`);
    });

    dockApps.forEach((app, index) => {
        app.classList.add('scale-in', `stagger-delay-${(index % 6) + 1}`);
    });
}

function initHoverAnimations() {
    const hoverCards = document.querySelectorAll('.mission-card, .result-card, .project-card');
    
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function refreshAnimations() {
    document.querySelectorAll('.animated').forEach(el => {
        el.classList.remove('animated');
    });
    
    setTimeout(() => {
        addAnimationClasses();
        setupAnimationObserver();
    }, 100);
}

document.addEventListener('contentChanged', refreshAnimations);

// ==================== ОБРАБОТЧИКИ КНОПОК ====================
function initButtonHandlers() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showNotification('Функция в разработке');
            }
        });
    });
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function openTelegram() {
    window.open('https://t.me/V8R878', '_blank');
}

function openPortfolio() {
    window.open('https://telegra.ph/INFO-MARKET-10-17', '_blank');
}

function openChannel() {
    window.open('https://t.me/INFOMARKET38', '_blank');
}

function submitForm(event) {
    event.preventDefault();
    alert('Спасибо! Мы свяжемся с вами в течение часа.');
    event.target.reset();
}

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ====================
window.App = {
    showSection: showSection,
    navigateToService: navigateToService,
    openTelegram: openTelegram,
    openPortfolio: openPortfolio,
    openChannel: openChannel,
    submitForm: submitForm,
    refreshAnimations: refreshAnimations,
    showNotification: showNotification,
    updateScroll: updateScroll
};

window.ScrollAnimations = { refresh: refreshAnimations };
window.Notifications = { show: showNotification };