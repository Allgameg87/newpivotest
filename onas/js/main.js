// Mobile Menu Toggle
        // Header: hide on scroll down, show on scroll up
        (function initHeaderScroll() {
            const header = document.querySelector('header');
            if (!header) return;

            let headerHeight = 110;
            let lastScrollY = window.scrollY;
            let isHidden = false;
            let ticking = false;

            function syncHeaderHeight() {
                headerHeight = Math.ceil(header.offsetHeight);
                header.style.setProperty('--header-height', `${headerHeight}px`);
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

        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const menuCloseBtn = document.querySelector('.menu-close-btn');

        let menuScrollY = 0;

        function lockBodyScroll() {
            if (document.documentElement.classList.contains('mobile-menu-open')) return;

            menuScrollY = window.scrollY;
            document.documentElement.classList.add('mobile-menu-open');
            document.body.classList.add('mobile-menu-open');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${menuScrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = 'auto';
        }

        function unlockBodyScroll() {
            if (!document.documentElement.classList.contains('mobile-menu-open')) return;

            document.documentElement.classList.remove('mobile-menu-open');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            window.scrollTo(0, menuScrollY);
        }

        function openMenu() {
            const headerEl = document.querySelector('header');
            if (headerEl) {
                headerEl.style.setProperty('--header-height', `${Math.ceil(headerEl.offsetHeight)}px`);
            }
            mobileMenuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            lockBodyScroll();
        }

        function closeMenu() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            unlockBodyScroll();
        }

        mobileMenuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking close button
        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', closeMenu);
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Close mobile menu when clicking on overlay
        // mobileMenuOverlay.addEventListener('click', closeMenu); // Убираем overlay

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            } else if (mobileMenu.classList.contains('active')) {
                unlockBodyScroll();
                lockBodyScroll();
            }
        });

        // GSAP Animations
        gsap.registerPlugin(ScrollTrigger);

        // Hero animations
        gsap.from('.hero-content h1', {
            opacity: 0,
            y: 100,
            duration: 1.5,
            ease: 'power4.out'
        });

        gsap.from('.hero-content p', {
            opacity: 0,
            y: 50,
            duration: 1.5,
            delay: 0.3,
            ease: 'power4.out'
        });

        // Section animations
        gsap.utils.toArray('.section h2').forEach(heading => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // History section — плавное появление текста и изображения
        const historyContent = document.querySelector('.history-content');
        if (historyContent) {
            const historyScroll = {
                trigger: historyContent,
                start: 'top 85%',
                toggleActions: 'play none none none'
            };

            gsap.fromTo('.history-text',
                { opacity: 0, x: -48, y: 24 },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 1.4,
                    ease: 'power2.out',
                    scrollTrigger: historyScroll
                }
            );

            gsap.fromTo('.history-image',
                { opacity: 0, x: 48, y: 24, scale: 0.96 },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1.4,
                    delay: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: historyScroll
                }
            );
        }

        // Values cards
        gsap.from('.value-card', {
            scrollTrigger: {
                trigger: '.values-grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });

        // CTA section
        gsap.from('.cta-section h2', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.cta-button', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 80%'
            },
            opacity: 0,
            scale: 0.8,
            duration: 1,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });

        // Footer animation
        gsap.from('footer p', {
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 90%'
            },
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.out'
        });
