document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Инициализация Particles.js (Более заметные)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 35, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#d8b4fe", "#fbcfe8", "#c7d2fe"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": false },
                "size": { "value": 4, "random": true }, // Сделали крупнее
                "line_linked": { "enable": true, "distance": 180, "color": "#cbd5e1", "opacity": 0.6, "width": 1.5 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 180, "line_linked": { "opacity": 1 } },
                    "repulse": { "distance": 150, "duration": 0.4 },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // 2. Прыгающие буквы для логотипа (Bouncing Letters)
    const logoElement = document.getElementById('bouncing-logo');
    if (logoElement) {
        const text = "Валерия";
        logoElement.innerHTML = '';
        logoElement.classList.add('bouncing-letters');
        
        const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#6366f1'];
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.classList.add('bouncing-letter');
            span.style.animationDelay = `${i * 0.1}s`;
            span.style.color = colors[i % colors.length];
            logoElement.appendChild(span);
        }
    }

    // 3. Вертикальный индикатор прогресса (Roadmap)
    const roadmapFill = document.querySelector('.roadmap-line-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (roadmapFill && timelineItems.length > 0) {
        window.addEventListener('scroll', () => {
            const container = document.querySelector('.roadmap-container');
            const rect = container.getBoundingClientRect();
            const winHeight = window.innerHeight;
            
            // Если секция видна на экране
            if (rect.top < winHeight && rect.bottom > 0) {
                // Вычисляем процент прохождения контейнера
                let scrolled = ((winHeight - rect.top) / (rect.height + winHeight / 2)) * 100;
                if (scrolled < 0) scrolled = 0;
                if (scrolled > 100) scrolled = 100;
                roadmapFill.style.height = scrolled + "%";

                // Активация кружочков и скрытие/появление карточек
                timelineItems.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    // Элемент считается активным, если он находится в определенной зоне видимости
                    if (itemRect.top < winHeight * 0.75 && itemRect.bottom > winHeight * 0.25) {
                        item.classList.add('active');
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    } else {
                        item.classList.remove('active');
                        item.style.opacity = '0.3'; // Полупрозрачные, либо можно ставить 0
                        item.style.transform = 'translateY(10px) scale(0.98)';
                    }
                    item.style.transition = 'all 0.5s ease-out';
                });
            }
        });
    }

    // 4. До / После Слайдер
    const sliderContainer = document.querySelector('.comparison-slider');
    const panelAfter = document.querySelector('.panel-after');
    const sliderHandle = document.querySelector('.slider-handle');

    if (sliderContainer && panelAfter && sliderHandle) {
        let isDragging = false;

        const updateSlider = (e) => {
            if (!isDragging) return;
            const rect = sliderContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
            }
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percent = (x / rect.width) * 100;
            sliderHandle.style.left = percent + '%';
            panelAfter.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
        };

        sliderHandle.addEventListener('mousedown', () => isDragging = true);
        sliderHandle.addEventListener('touchstart', () => isDragging = true, {passive: true});
        
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);
        
        window.addEventListener('mousemove', updateSlider);
        window.addEventListener('touchmove', updateSlider, {passive: true});
    }

    // 5. Квиз на 3 вопроса
    const questions = [
        { q: "Как правильно поставить ударение?", ans: ["звОнит", "звонИт"], correct: 1 },
        { q: "Где пишется буква 'А'?", ans: ["выр..внять", "р..внина"], correct: 1 },
        { q: "4 + 5 × 2 = ?", ans: ["18", "14"], correct: 1 }
    ];
    let currentQ = 0;

    const quizText = document.getElementById('quiz-question');
    const btnLeft = document.getElementById('quiz-btn-0');
    const btnRight = document.getElementById('quiz-btn-1');
    const quizResult = document.getElementById('quiz-result');
    const quizWrapper = document.getElementById('quiz-buttons');

    if (quizText && btnLeft && btnRight) {
        function loadQuestion(index) {
            quizText.innerHTML = questions[index].q;
            btnLeft.innerHTML = questions[index].ans[0];
            btnRight.innerHTML = questions[index].ans[1];
            btnLeft.className = "glass px-8 py-4 rounded-xl font-bold text-lg text-gray-700 hover:bg-white transition-all w-full md:w-auto";
            btnRight.className = "glass px-8 py-4 rounded-xl font-bold text-lg text-gray-700 hover:bg-white transition-all w-full md:w-auto";
            quizResult.classList.add('hidden');
        }
        
        function handleAnswer(selectedIdx) {
            if (selectedIdx === questions[currentQ].correct) {
                // Верно
                if (currentQ < questions.length - 1) {
                    currentQ++;
                    loadQuestion(currentQ);
                } else {
                    // Конец теста
                    quizWrapper.style.display = 'none';
                    quizResult.innerHTML = "Вы прошли тест на 5! 🎉 Жду вас на занятиях!";
                    quizResult.classList.remove('hidden', 'text-red-500');
                    quizResult.classList.add('text-green-600', 'text-2xl');
                    quizText.style.display = 'none';
                    if (typeof confetti !== 'undefined') {
                        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                    }
                }
            } else {
                // Ошибка
                const wrongBtn = selectedIdx === 0 ? btnLeft : btnRight;
                wrongBtn.classList.remove('glass', 'text-gray-700');
                wrongBtn.classList.add('bg-red-100', 'text-red-500');
                quizResult.innerHTML = "Упс, ошибка. Попробуйте еще раз!";
                quizResult.classList.remove('hidden', 'text-green-600');
                quizResult.classList.add('text-red-500');
            }
        }

        btnLeft.addEventListener('click', () => handleAnswer(0));
        btnRight.addEventListener('click', () => handleAnswer(1));
        
        loadQuestion(0);
    }

    // 6. GSAP Анимации
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".hero-text", { opacity: 0, x: -50, duration: 1.2, ease: "power3.out", delay: 0.2 });
        gsap.from(".hero-image", { opacity: 0, scale: 0.8, rotation: 5, duration: 1.5, ease: "back.out(1.7)", delay: 0.4 });
        gsap.from(".floating-badge", { opacity: 0, y: 30, scale: 0.5, duration: 1, stagger: 0.2, ease: "back.out(1.5)", delay: 1 });

        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
                opacity: 0, y: 50, scale: 0.98, duration: 1, ease: "power3.out"
            });
        });

        const counters = document.querySelectorAll('.counter-value');
        counters.forEach(counter => {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    const target = parseInt(counter.dataset.target);
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power1.out",
                        onUpdate: function() {
                            counter.innerHTML = Math.round(counter.innerHTML) + (counter.dataset.suffix || "");
                        }
                    });
                }
            });
        });
    }

    // 7. VanillaTilt для карточек
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 5, speed: 400, glare: true, "max-glare": 0.1, scale: 1.02
        });
    }

    // 8. Автоматическая подсветка при скролле (Для всех устройств)
    const litUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('lit-up');
            } else {
                entry.target.classList.remove('lit-up');
            }
        });
    }, { threshold: 0.6 }); // Срабатывает, когда 60% карточки на экране

    document.querySelectorAll('.subject-card, .format-ind, .format-group, .methodology-item').forEach(el => {
        litUpObserver.observe(el);
    });
});

// Глобальная функция для смайликов
window.spawnHearts = function(e) {
    if (e) e.preventDefault();
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        const emojis = ['❤️', '💖', '💗', '💕', '🥰', '😍'];
        heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.position = 'fixed';
        heart.style.left = (e.clientX || window.innerWidth / 2) + 'px';
        heart.style.top = (e.clientY || window.innerHeight / 2) + 'px';
        heart.style.fontSize = Math.random() * 24 + 16 + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = 9999;
        document.body.appendChild(heart);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(heart, {
                y: -150 - Math.random() * 200,
                x: (Math.random() - 0.5) * 200,
                rotation: (Math.random() - 0.5) * 90,
                opacity: 0,
                scale: 0.5,
                duration: 1.5 + Math.random(),
                ease: "power2.out",
                onComplete: () => heart.remove()
            });
        }
    }
}

// Клик по фото в Hero
window.photoClick = function(e) {
    if(e) e.preventDefault();
    window.spawnHearts(e);
    
    // Показать тост
    const toast = document.getElementById('toast-message');
    if (toast) {
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }
}

// Переключение темной темы
window.toggleDarkMode = function() {
    document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('dark');
    
    const icon = document.getElementById('theme-icon');
    if (icon) {
        if (document.body.classList.contains('dark')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            icon.classList.replace('text-gray-600', 'text-yellow-400');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            icon.classList.replace('text-yellow-400', 'text-gray-600');
        }
    }
}

// 8. Scroll Reveal (Intersection Observer)
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
});

// 9. Magnetic Buttons
document.addEventListener('DOMContentLoaded', () => {
    const magnets = document.querySelectorAll('.magnetic');
    
    magnets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
});

// 10. Lightbox для отзывов
window.openLightbox = function(card) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const img = card.querySelector('img');
    
    if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Запрет скролла
    }
}

window.closeLightbox = function(e) {
    if (e) e.preventDefault();
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = ''; // Возврат скролла
    }
}

// 11. Открытие отзывов (Lightbox)
let currentLightboxIndex = 0;
let lightboxImages = [];

window.openLightbox = function(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg && lightboxImages.length > 0) {
        currentLightboxIndex = index;
        lightboxImg.src = lightboxImages[currentLightboxIndex].src;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden'; 
    }
}

window.nextLightboxImage = function(e) {
    if (e) e.stopPropagation();
    if (lightboxImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex].src;
}

window.prevLightboxImage = function(e) {
    if (e) e.stopPropagation();
    if (lightboxImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex].src;
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('reviews-slider');
    if (!slider) return;

    const cards = slider.querySelectorAll('.review-card');
    cards.forEach((card, index) => {
        const img = card.querySelector('img');
        if (img) lightboxImages.push(img);

        card.addEventListener('click', (e) => {
            window.openLightbox(index);
        });
    });

    // Навигация с клавиатуры
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') window.nextLightboxImage();
            if (e.key === 'ArrowLeft') window.prevLightboxImage();
            if (e.key === 'Escape') window.closeLightbox();
        }

        const leadModal = document.getElementById('lead-modal');
        if (leadModal && !leadModal.classList.contains('hidden') && e.key === 'Escape') {
            window.closeLeadModal();
        }
    });
});

// 12. Логика формы заявки (Лид-магнит)
window.openLeadModal = function(format) {
    const modal = document.getElementById('lead-modal');
    const content = document.getElementById('lead-modal-content');
    const formatText = document.getElementById('lead-format-text');
    
    // Сбрасываем форму
    document.getElementById('lead-step-1').classList.remove('hidden');
    document.getElementById('lead-step-2').classList.add('hidden');
    document.getElementById('lead-name').value = '';
    document.getElementById('lead-contact').value = '';
    document.getElementById('lead-name-error').classList.add('hidden');
    document.getElementById('lead-contact-error').classList.add('hidden');

    if (formatText) formatText.innerHTML = `Формат: <span class="font-bold text-indigo-500">${format}</span>`;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Небольшая задержка для анимации opacity и scale
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
    
    document.body.style.overflow = 'hidden'; 
}

window.closeLeadModal = function(e) {
    if (e && e.target.id !== 'lead-modal' && e.type === 'click') return;
    
    const modal = document.getElementById('lead-modal');
    const content = document.getElementById('lead-modal-content');
    
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = ''; 
    }, 300);
}

window.nextLeadStep = function() {
    const name = document.getElementById('lead-name').value.trim();
    const contact = document.getElementById('lead-contact').value.trim();
    
    let isValid = true;
    
    if (!name) {
        document.getElementById('lead-name-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('lead-name-error').classList.add('hidden');
    }
    
    if (!contact) {
        document.getElementById('lead-contact-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('lead-contact-error').classList.add('hidden');
    }
    
    if (isValid) {
        // Прячем шаг 1, показываем шаг 2 (с анимацией)
        const step1 = document.getElementById('lead-step-1');
        const step2 = document.getElementById('lead-step-2');
        
        step1.style.opacity = '0';
        setTimeout(() => {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step2.style.opacity = '0';
            
            // Заставляем браузер применить классы перед сменой opacity
            void step2.offsetWidth; 
            
            step1.style.opacity = '1'; // Возвращаем для будущих открытий
            step2.style.opacity = '1';
            step2.style.transition = 'opacity 0.3s ease';
        }, 200);
    }
}

window.submitLead = function(network) {
    const name = document.getElementById('lead-name').value.trim();
    const contact = document.getElementById('lead-contact').value.trim();
    const formatElement = document.getElementById('lead-format-text');
    const formatSpan = formatElement ? formatElement.querySelector('span') : null;
    const format = formatSpan ? formatSpan.innerText : '';
    
    const text = `Здравствуйте! Меня зовут ${name}. Хочу записаться на занятия (${format}). Мой контакт для связи: ${contact}.`;
    
    // Старый надежный способ копирования текста (работает даже если вы открываете файл с компьютера, а не в интернете)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Скрываем элемент, чтобы он не мелькал на экране
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Ошибка копирования', err);
    }
    document.body.removeChild(textArea);
    
    const encodedText = encodeURIComponent(text);
    let url = '';
    
    if (network === 'telegram') {
        url = `https://t.me/i_m_wasserman?text=${encodedText}`;
        window.closeLeadModal();
        window.open(url, '_blank');
    } else if (network === 'vk') {
        url = `https://vk.me/01vasserman?text=${encodedText}`; 
        alert("Текст заявки скопирован! Нажмите «Вставить» в открывшемся диалоге ВКонтакте.");
        window.closeLeadModal();
        window.open(url, '_blank');
    } else if (network === 'max') {
        url = `https://max.ru/u/f9LHodD0cOJItowp_wsZaxanm_ybagtENCrywS6IjRGa22aMakHJkiu843c?text=${encodedText}`;
        alert("Текст заявки скопирован! Нажмите «Вставить» в открывшемся диалоге MAX.");
        window.closeLeadModal();
        window.open(url, '_blank');
    }
}
