// PRICE_PROJECT - Единый JS файл
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Приложение инициализировано');
    
    // Инициализация всех модулей
    initTime();
    initDockApps();
    initNotifications();
    initBackToTopButtons();
    initScrollAnimations();
    initButtonHandlers();
});

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
            
            // Обновляем активное состояние
            dockApps.forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем соответствующий контент
            document.querySelectorAll('.content-area').forEach(area => {
                area.classList.remove('active');
            });
            
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Плавная прокрутка к верху
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // УБИРАЕМ переинициализацию анимаций при переключении секций
                // setTimeout(refreshAnimations, 300); // ЗАКОММЕНТИРУЙ ЭТУ СТРОКУ
            }
        });
    });
    
    // Активируем домашнюю секцию по умолчанию
    const homeApp = document.querySelector('.dock-app[data-target="home"]');
    if (homeApp) {
        homeApp.click();
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
    // Добавляем CSS для анимации уведомлений
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
    setupSectionButtons();
}

function createMainButton() {
    // Проверяем, не создана ли уже кнопка
    if (document.querySelector('.back-to-top')) return;
    
    // Создаем элемент кнопки
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Вернуться наверх');
    backToTopBtn.setAttribute('title', 'Наверх');
    
    // Добавляем стили для кнопки
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
            z-index: 1000;
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
        
        .section-back-btn {
            display: block;
            margin: 2rem auto 0;
            padding: 0.8rem 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            color: var(--light);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            border: none;
        }
        .section-back-btn:hover {
            background: var(--primary);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
        }
        .section-back-btn i {
            margin-right: 0.5rem;
        }
        
        /* Скрываем кнопки в секциях на мобильных */
        @media (max-width: 768px) {
            .section-back-btn {
                display: none !important;
            }
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Добавляем кнопку в body
    document.body.appendChild(backToTopBtn);
    
    // Обработчики событий
    backToTopBtn.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTopVisibility);
    
    // Инициализация при загрузке
    toggleBackToTopVisibility();
}

function setupSectionButtons() {
    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSectionButtons);
    } else {
        setTimeout(addSectionButtons, 1000);
    }
    
    // Также добавляем кнопки при изменении размера окна
    window.addEventListener('resize', function() {
        setTimeout(addSectionButtons, 500);
    });
}

function addSectionButtons() {
    const sections = document.querySelectorAll('.content-section');
    const isMobile = window.innerWidth <= 768;
    
    // На мобильных не создаем кнопки в секциях
    if (isMobile) return;
    
    sections.forEach(section => {
        // Проверяем, нужна ли кнопка в этой секции и не создана ли уже
        if (section.scrollHeight > window.innerHeight * 1.5 && 
            !section.querySelector('.section-back-btn')) {
            
            const backBtn = document.createElement('button');
            backBtn.className = 'section-back-btn';
            backBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Наверх';
            backBtn.setAttribute('aria-label', 'Вернуться к началу секции');
            
            // Добавляем обработчик для плавной прокрутки к началу секции
            backBtn.addEventListener('click', () => {
                const sectionTop = section.offsetTop - 80; // Учитываем высоту статус-бара
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            });
            
            section.appendChild(backBtn);
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleBackToTopVisibility() {
    if (!backToTopBtn) return;
    
    if (window.pageYOffset > 300) {
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

    // Начинаем наблюдать за всеми анимированными элементами
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('[class*="fade-"], [class*="scale-"]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }, 500);
}

function addAnimationClasses() {
    // Секции и заголовки
    const sections = document.querySelectorAll('.content-section');
    const sectionTitles = document.querySelectorAll('.section-title');
    const heroSection = document.querySelector('.hero-section');
    
    // Карточки
    const missionCards = document.querySelectorAll('.mission-card');
    const resultCards = document.querySelectorAll('.result-card');
    const projectCards = document.querySelectorAll('.project-card');
    const dockApps = document.querySelectorAll('.dock-app');

    // Применяем анимации к элементам
    sections.forEach(section => {
        section.classList.add('fade-in-up');
    });

    sectionTitles.forEach((title, index) => {
        title.classList.add('fade-in-up', `stagger-delay-${(index % 5) + 1}`);
    });

    if (heroSection) {
        heroSection.classList.add('scale-in');
    }

    // Анимация карточек с разными направлениями
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

    // Анимация док-приложений
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
    // Переинициализация анимаций
    document.querySelectorAll('.animated').forEach(el => {
        el.classList.remove('animated');
    });
    
    setTimeout(() => {
        addAnimationClasses();
        setupAnimationObserver();
    }, 100);
}

// Слушаем событие смены контента
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

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ====================
window.App = {
    refreshAnimations: refreshAnimations,
    showNotification: showNotification
};

window.ScrollAnimations = { refresh: refreshAnimations };
window.Notifications = { show: showNotification };