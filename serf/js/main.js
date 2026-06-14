// Старт сверху при заходе
        window.addEventListener('load', () => {
            setTimeout(() => { window.scrollTo(0, 0); }, 50);
        });

        // Header: hide on scroll down, show on scroll up
        (function initHeaderScroll() {
            const header = document.querySelector('header');
            if (!header) return;

            let lastScrollY = window.scrollY;
            let isHidden = false;
            let ticking = false;

            function syncHeaderHeight() {
                header.style.setProperty('--header-height', `${Math.ceil(header.offsetHeight)}px`);
            }

            function setHeaderState(hidden) {
                const atTop = window.scrollY <= 12;

                if (atTop) {
                    hidden = false;
                }

                if (isHidden === hidden) {
                    header.classList.toggle('scrolled', !atTop && !hidden);
                    return;
                }

                isHidden = hidden;
                header.classList.toggle('header-hidden', hidden);
                header.classList.toggle('scrolled', !atTop && !hidden);
            }

            syncHeaderHeight();
            window.addEventListener('load', syncHeaderHeight);
            window.addEventListener('resize', syncHeaderHeight);

            header.querySelectorAll('img').forEach(img => {
                if (!img.complete) {
                    img.addEventListener('load', syncHeaderHeight, { once: true });
                }
            });

            function updateHeaderScroll() {
                const currentScrollY = window.scrollY;
                const menuOpen = document.body.classList.contains('mobile-menu-open') ||
                    document.querySelector('.mobile-menu.active');

                if (menuOpen) {
                    setHeaderState(false);
                    lastScrollY = currentScrollY;
                    ticking = false;
                    return;
                }

                if (currentScrollY <= 12) {
                    setHeaderState(false);
                } else {
                    const delta = currentScrollY - lastScrollY;

                    if (delta > 1) {
                        setHeaderState(true);
                    } else if (delta < -1) {
                        setHeaderState(false);
                    }
                }

                lastScrollY = currentScrollY;
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateHeaderScroll);
                    ticking = true;
                }
            }, { passive: true });
        })();

        // Mobile menu
        const toggle = document.querySelector('.mobile-menu-toggle');
        const drawer = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const closeIcon = document.querySelector('.menu-close-btn');

        function openMenu(){
            const headerEl = document.querySelector('header');
            if (headerEl) {
                headerEl.style.setProperty('--header-height', `${Math.ceil(headerEl.offsetHeight)}px`);
            }
            toggle.classList.add('active');
            drawer.classList.add('active');
            if (window.innerWidth >= 769 && overlay) {
                overlay.classList.add('active');
            }
            if (window.innerWidth >= 769) {
                document.body.classList.add('mobile-menu-open');
            }
            document.body.classList.add('nav-open');
        }
        function closeMenu(){
            toggle.classList.remove('active');
            drawer.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (window.innerWidth >= 769) {
                document.body.classList.remove('mobile-menu-open');
            }
            document.body.classList.remove('nav-open');
        }

        toggle.addEventListener('click', () => { drawer.classList.contains('active') ? closeMenu() : openMenu(); });
        // На главной overlay не закрывает меню — поведение оставим идентичным
        // overlay.addEventListener('click', closeMenu);
        document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));
        if (closeIcon) closeIcon.addEventListener('click', closeMenu);

        // Поведение при ресайзе — как на главной
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
            if (window.innerWidth < 769) { document.body.classList.remove('mobile-menu-open'); }
            document.body.classList.remove('nav-open');
        });

        // GSAP animations (только карточки)

        if (window.ScrollTrigger){
            gsap.utils.toArray('.certificate-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: card, start: 'top 85%' },
                    opacity: 0, y: 40, duration: 0.8, delay: i * 0.05, ease: 'power3.out'
                });
            });
        }

        // Автоматическая загрузка сертификатов
        const certificateGrid = document.getElementById('certificateGrid');
        
        // Список сертификатов для автозагрузки (формат: serf 1.jpg, serf 2.jpg и т.д.)
        const certificateFiles = [
            'serf 1.jpg',
            'serf 2.jpg', 
            'serf 3.jpg',
            'serf 4.jpg',
            'serf 5.jpg',
            'serf 6.jpg'
        ];

        // Названия и описания для сертификатов
        const certificateInfo = {
            'serf 1.jpg': {
                title: 'Сертификат соответствия №1',
                description: 'Сертификат соответствия пивоваренной продукции требованиям ГОСТ и ТР ТС.'
            },
            'serf 2.jpg': {
                title: 'Сертификат безопасности №2',
                description: 'Подтверждение безопасности пищевых продуктов и соблюдения санитарных норм на производстве.'
            },
            'serf 3.jpg': {
                title: 'Декларация соответствия №3',
                description: 'Соответствие пива и пивных напитков техническим регламентам Таможенного союза.'
            },
            'serf 4.jpg': {
                title: 'Сертификат качества сырья №4',
                description: 'Подтверждение качества солода, хмеля и питьевой воды, используемых при варке.'
            },
            'serf 5.jpg': {
                title: 'Гигиенический сертификат №5',
                description: 'Подтверждение соблюдения санитарно-гигиенических норм производства.'
            },
            'serf 6.jpg': {
                title: 'Сертификат менеджмента качества №6',
                description: 'Сертификат системы менеджмента качества ISO 9001.'
            }
        };

        // Функция для загрузки сертификатов
        async function loadCertificates() {
            const loadedCertificates = [];
            
            // Пытаемся загрузить каждый сертификат
            for (const filename of certificateFiles) {
                try {
                    const img = new Image();
                    img.src = `images/${filename}`;
                    
                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            const info = certificateInfo[filename];
                            loadedCertificates.push({
                                filename: filename,
                                title: info.title,
                                description: info.description,
                                src: img.src
                            });
                            resolve();
                        };
                        img.onerror = () => resolve(); // Не прерываем загрузку, если файл не найден
                    });
                } catch (error) {
                    console.log(`Сертификат ${filename} не найден`);
                }
            }

            // Если сертификаты найдены, отображаем их
            if (loadedCertificates.length > 0) {
                certificateGrid.innerHTML = '';
                loadedCertificates.forEach(cert => {
                    const cardHTML = `
                        <div class="certificate-card" data-caption="${cert.title}">
                            <img src="${cert.src}" alt="${cert.title}" loading="lazy" />
                            <div class="certificate-overlay"><button type="button">Открыть</button></div>
                            <h3>${cert.title}</h3>
                            <p>${cert.description}</p>
                        </div>
                    `;
                    certificateGrid.insertAdjacentHTML('beforeend', cardHTML);
                });
            } else {
                // Если сертификаты не найдены, показываем информационное сообщение
                showNoCertificatesMessage();
            }
            
            // Инициализируем лайтбокс после загрузки
            initializeLightbox();
        }

        // Функция для показа сообщения об отсутствии сертификатов
        function showNoCertificatesMessage() {
            const messageHTML = `
                <div class="certificate-card" style="grid-column: 1 / -1; text-align: center; padding: 60px 40px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
                    <h3>Сертификаты не найдены</h3>
                    <p>Для отображения сертификатов поместите файлы изображений в папку <code>images/</code> с именами:</p>
                    <p style="margin-top: 15px; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 5px;">
                        serf 1.jpg<br>
                        serf 2.jpg<br>
                        serf 3.jpg<br>
                        serf 4.jpg<br>
                        serf 5.jpg<br>
                        serf 6.jpg
                    </p>
                </div>
            `;
            certificateGrid.innerHTML = messageHTML;
        }

        // Lightbox logic
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox-image');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        let cards = [];
        let images = [];
        let current = 0;

        function initializeLightbox() {
            cards = Array.from(document.querySelectorAll('.certificate-card'));
            images = cards.map(c => ({
                src: c.querySelector('img')?.getAttribute('src') || '',
                caption: c.getAttribute('data-caption') || c.querySelector('h3')?.textContent || ''
            })).filter(img => img.src); // Фильтруем карточки без изображений
            
            // Добавляем обработчики событий
            cards.forEach((card, idx) => {
                if (card.querySelector('img')) { // Только для карточек с изображениями
                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        show(idx);
                    });
                }
            });
        }

        function show(index){
            if (images.length === 0) return;
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;
            current = index;
            lightboxImg.src = images[current].src;
            lightboxCaption.textContent = images[current].caption;
            lightbox.classList.add('active');
        }
        function hide(){ lightbox.classList.remove('active'); }
        function next(){ show(current + 1); }
        function prev(){ show(current - 1); }

        // Обработчики лайтбокса
        closeBtn.addEventListener('click', hide);
        nextBtn.addEventListener('click', next);
        prevBtn.addEventListener('click', prev);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hide(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') hide();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });

        // Запускаем загрузку сертификатов при загрузке страницы
        document.addEventListener('DOMContentLoaded', loadCertificates);
