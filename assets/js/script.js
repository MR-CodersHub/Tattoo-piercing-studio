/* 
   DRAVEN 
   Interactivity & Animations
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Preloader with Failsafe
    const loader = document.querySelector('.loader-wrapper');
    const hideLoader = () => {
        if (!loader) return;
        if (loader.style.opacity === '0') return;
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.visibility = 'hidden';
            }, 800);
        }, 500);
    };

    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3000); // Failsafe: hide loader after 3s regardless

    // 3. Sticky Navbar & Active Link
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    const updateScrollState = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    // 4. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('toggle');
        }));
    }

    // 5. Scroll Reveal with Stagger
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100); 
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5b. Tilt Effect
    const tiltCards = document.querySelectorAll('.service-card, .blog-card, .artist-card, .flash-item, .pricing-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // 5c. Typing Effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.getAttribute('data-text');
        let i = 0;
        typingText.innerHTML = '';
        function type() {
            if (i < text.length) {
                typingText.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 80);
            }
        }
        setTimeout(type, 1500);
    }

    // 5d. Counters
    const counters = document.querySelectorAll('.number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetText = entry.target.innerText;
                const target = +targetText.replace('k', '').replace('+', '');
                const suffix = targetText.includes('k') ? 'k' : (targetText.includes('+') ? '+' : '');
                let count = 0;
                const updateCount = () => {
                    const inc = target / 50;
                    if (count < target) {
                        count += inc;
                        entry.target.innerText = Math.ceil(count) + suffix;
                        setTimeout(updateCount, 30);
                    } else {
                        entry.target.innerText = target + suffix;
                    }
                };
                updateCount();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // 6. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // 7. Lightbox
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const zoomBtns = document.querySelectorAll('.gallery-zoom');

        zoomBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = btn.getAttribute('href');
                lightboxImg.src = imgSrc;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 9. Form Validation & Submission
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const requiredInputs = form.querySelectorAll('[required]');
            const statusDiv = form.querySelector('.form-status') || document.getElementById('form-status');

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    btn.style.background = '#28a745';
                    
                    if (statusDiv) {
                        statusDiv.innerHTML = 'Your request has been sent successfully. We will contact you soon!';
                        statusDiv.className = 'form-status success';
                    }

                    form.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        if (statusDiv) statusDiv.style.display = 'none';
                    }, 4000);
                }, 2000);
            } else {
                if (statusDiv) {
                    statusDiv.innerHTML = 'Please fill in all required fields.';
                    statusDiv.className = 'form-status error';
                }
            }
        });
    });

    // 10. Testimonial Slider (Auto-scroll simulation)
    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialContainer.classList.add('active');
            startX = e.pageX - testimonialContainer.offsetLeft;
            scrollLeft = testimonialContainer.scrollLeft;
        });

        testimonialContainer.addEventListener('mouseleave', () => {
            isDown = false;
        });

        testimonialContainer.addEventListener('mouseup', () => {
            isDown = false;
        });

        testimonialContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialContainer.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // 11. Page Transitions
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname && !link.hash && !link.getAttribute('target')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const destination = link.getAttribute('href');
                const loader = document.querySelector('.loader-wrapper');
                
                loader.style.visibility = 'visible';
                loader.style.opacity = '1';
                
                setTimeout(() => {
                    window.location.href = destination;
                }, 800);
            });
        }
    });

    // ================================================================
    //  UTILITY CONTROLS: RTL + Theme Toggle (Main Site & Auth Pages)
    // ================================================================
    const userBtn = document.getElementById("user-btn");
    const themeToggle = document.getElementById("theme-toggle");
    const premiumDropdown = document.getElementById("user-dropdown");
    const body = document.body;

    // --- Helper: apply RTL state to all matching toggle buttons ---
    function applyRTLState(isRTL) {
        body.classList.toggle('rtl-mode', isRTL);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        // Sync all RTL toggle buttons on the page
        document.querySelectorAll('.rtl-toggle').forEach(btn => {
            btn.classList.toggle('active', isRTL);
        });
        localStorage.setItem('rtl-mode', String(isRTL));
    }

    // --- Helper: apply Theme state ---
    function applyThemeState(isLight) {
        body.classList.toggle('light-theme', isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    // ---- Inject RTL button into main-site .navbar-utility (if not already present) ----
    document.querySelectorAll('.navbar-utility').forEach((utility) => {
        if (!utility.querySelector('#rtl-toggle')) {
            const rtlBtn = document.createElement('button');
            rtlBtn.type = 'button';
            rtlBtn.id = 'rtl-toggle';
            rtlBtn.className = 'utility-btn rtl-toggle';
            rtlBtn.title = 'Toggle Right-to-Left layout';
            rtlBtn.setAttribute('aria-label', 'Toggle Right-to-Left layout');
            rtlBtn.innerHTML = '<i class="fa-solid fa-right-left"></i><span class="rtl-label">RTL</span>';
            utility.insertBefore(rtlBtn, utility.firstChild);
        }
    });

    // ---- Restore saved state on page load ----
    const savedTheme = localStorage.getItem('theme');
    const savedRTL   = localStorage.getItem('rtl-mode');

    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }
    if (savedRTL === 'true') {
        body.classList.add('rtl-mode');
        document.documentElement.dir = 'rtl';
        // Mark all RTL toggles active (after DOM is ready)
        document.querySelectorAll('.rtl-toggle').forEach(btn => btn.classList.add('active'));
    } else {
        document.documentElement.dir = 'ltr';
    }

    // ---- Main-site theme toggle (#theme-toggle in navbar) ----
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ---- Main-site RTL toggle (injected #rtl-toggle) ----
    const mainRTLToggle = document.getElementById('rtl-toggle');
    if (mainRTLToggle) {
        mainRTLToggle.addEventListener('click', () => {
            const isRTL = !body.classList.contains('rtl-mode');
            applyRTLState(isRTL);
        });
    }

    // ---- Auth-page theme toggle (#auth-theme-toggle) ----
    const authThemeToggle = document.getElementById('auth-theme-toggle');
    if (authThemeToggle) {
        authThemeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ---- Auth-page RTL toggle (#auth-rtl-toggle) ----
    const authRTLToggle = document.getElementById('auth-rtl-toggle');
    if (authRTLToggle) {
        authRTLToggle.addEventListener('click', () => {
            const isRTL = !body.classList.contains('rtl-mode');
            applyRTLState(isRTL);
        });
    }

    // 2. User Dropdown Logic
    if (userBtn && premiumDropdown) {
        userBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            premiumDropdown.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!premiumDropdown.contains(e.target) && e.target !== userBtn) {
                premiumDropdown.classList.remove("active");
            }
        });
    }

    // 3. Password Visibility Toggle
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);

            if (targetInput) {
                const type = targetInput.getAttribute('type') === 'password' ? 'text' : 'password';
                targetInput.setAttribute('type', type);

                // Toggle the icon class
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    });

});
