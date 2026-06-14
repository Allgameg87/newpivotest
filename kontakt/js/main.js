// Scroll to top on page load/refresh
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });

        // Ensure page starts at top
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 100);
        });

        // Alternative method for scroll to top
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }

        // Additional scroll to top on page refresh
        window.addEventListener('DOMContentLoaded', () => {
            window.scrollTo(0, 0);
        });

        // Force scroll to top immediately
        if (window.pageYOffset > 0) {
            window.scrollTo(0, 0);
        }

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

        // Mobile Menu Toggle
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

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            } else if (mobileMenu.classList.contains('active')) {
                unlockBodyScroll();
                lockBodyScroll();
            }
        });

        // Убрана форма. Никаких обработчиков отправки не требуется.

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe contact items and map card
        document.querySelectorAll('.contact-item, .map-card, .hours-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
