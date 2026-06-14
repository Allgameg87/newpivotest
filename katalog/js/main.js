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

        // Catalog volume filters
        document.addEventListener('DOMContentLoaded', () => {
            const filterBtns = document.querySelectorAll('.catalog-filters .filter-btn');
            const productItems = document.querySelectorAll('.products-catalog .product-item');
            const emptyMessage = document.getElementById('catalogEmpty');
            let filterTimeline = null;

            if (!filterBtns.length || !productItems.length) return;

            function getProductVolume(item) {
                if (item.dataset.volume) return item.dataset.volume;

                const title = item.querySelector('.product-info h3')?.textContent || '';
                if (/0[,.]5\s*л/i.test(title)) return '0.5';
                if (/30\s*л/i.test(title)) return '30';
                if (/3\s*л/i.test(title)) return '3';
                return '';
            }

            function resetProductItemStyles(item) {
                if (typeof gsap !== 'undefined') {
                    gsap.set(item, { clearProps: 'all' });
                }
                item.style.removeProperty('opacity');
                item.style.removeProperty('visibility');
                item.style.removeProperty('transform');
            }

            function setFilterVisibility(filter) {
                let visibleCount = 0;

                productItems.forEach(item => {
                    const isVisible = filter === 'all' || getProductVolume(item) === filter;
                    resetProductItemStyles(item);
                    item.classList.toggle('hidden', !isVisible);

                    if (isVisible) {
                        visibleCount += 1;
                    }
                });

                if (emptyMessage) {
                    emptyMessage.classList.toggle('visible', visibleCount === 0);
                }

                return visibleCount;
            }

            function applyCatalogFilter(filter) {
                if (filterTimeline) {
                    filterTimeline.kill();
                    filterTimeline = null;
                }

                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(productItems);
                }

                const visibleCount = setFilterVisibility(filter);

                if (visibleCount === 0 || typeof gsap === 'undefined') {
                    return;
                }

                const visibleItems = [...productItems].filter(item => !item.classList.contains('hidden'));

                gsap.set(visibleItems, { opacity: 0, y: 20, scale: 0.98 });

                filterTimeline = gsap.timeline({
                    onComplete: () => {
                        filterTimeline = null;
                    }
                });

                filterTimeline.to(visibleItems, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.38,
                    stagger: 0.035,
                    ease: 'power2.out',
                    clearProps: 'transform,opacity'
                });
            }

            setFilterVisibility('all');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.classList.contains('active')) return;

                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    applyCatalogFilter(btn.dataset.filter);
                });
            });
        });

        // Prevent any unwanted animations on page load
        document.addEventListener('DOMContentLoaded', () => {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'transform 0.4s, box-shadow 0.4s';
            });
        });

        // Mobile Menu Toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const menuCloseBtn = document.querySelector('.menu-close-btn');

        function openMenu() {
            const headerEl = document.querySelector('header');
            if (headerEl) {
                headerEl.style.setProperty('--header-height', `${Math.ceil(headerEl.offsetHeight)}px`);
            }
            mobileMenuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            
            // Блокируем прокрутку только на ПК (769px и больше)
            if (window.innerWidth >= 769) {
                document.body.classList.add('mobile-menu-open');
            }
        }

        function closeMenu() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            
            // Разблокируем прокрутку только на ПК
            if (window.innerWidth >= 769) {
                document.body.classList.remove('mobile-menu-open');
            }
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
            link.addEventListener('click', function(e) {
                // Небольшая задержка перед закрытием меню, чтобы дать время для перехода
                setTimeout(closeMenu, 100);
            });
        });

        // Close mobile menu when clicking outside (но не на ссылки)
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && 
                !mobileMenu.contains(e.target) && 
                !e.target.closest('.mobile-menu a')) {
                closeMenu();
            }
        });

        // Close mobile menu when clicking on overlay
        // mobileMenuOverlay.addEventListener('click', closeMenu); // Убираем overlay

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
            
            // Убираем блокировку прокрутки при переходе на мобильную версию
            if (window.innerWidth < 769) {
                document.body.classList.remove('mobile-menu-open');
            }
        });

        // Enhanced Smooth Scroll function
        function smoothScrollTo(targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Smooth Scroll for desktop navigation - удалено, так как теперь используется только мобильное меню

        // Smooth Scroll for mobile navigation (только для внутренних якорных ссылок)
        document.querySelectorAll('.mobile-menu a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    smoothScrollTo(targetElement);
                }
            });
        });

        // Smooth Scroll for CTA button "Наши продукты"
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    smoothScrollTo(targetElement);
                }
            });
        }

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

        // GSAP Animations
        if (typeof gsap !== 'undefined') {
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }

            gsap.from('.catalog h2', {
                opacity: 0,
                y: -30,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.2
            });

            gsap.from('.catalog-subtitle', {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: 'power3.out',
                delay: 0.4
            });

            gsap.from('.catalog-filters', {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.55
            });

            // Анимация без opacity — иначе карточки могут остаться невидимыми
            gsap.from('.product-item', {
                y: 40,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.7,
                clearProps: 'transform'
            });

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.from('footer p', {
                    scrollTrigger: {
                        trigger: 'footer',
                        start: 'top 90%'
                    },
                    opacity: 0,
                    y: 50,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power2.out'
                });
            }

            gsap.from('.logo img', {
                opacity: 0,
                x: -50,
                duration: 1,
                ease: 'power3.out'
            });
        }
