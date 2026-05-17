/* 
   DRAVEN 
   Interactivity & Animations
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 15}px, 0)`;
        });

        document.querySelectorAll('a, button, .faq-question, .gallery-item, .choice-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2.5)';
                cursor.style.background = 'rgba(179, 0, 0, 0.5)';
                follower.style.transform += ' scale(1.5)';
                follower.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');
                cursor.style.background = '#ff0000';
                follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
                follower.style.borderColor = '#ff0000';
            });
        });
    }

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax Effect
        const parallaxImages = document.querySelectorAll('.parallax');
        parallaxImages.forEach(img => {
            const speed = 0.5;
            const yPos = -(window.pageYOffset * speed);
            img.style.transform = `translateY(${yPos}px)`;
        });
    });

    // 4. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('toggle');
    }));

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

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

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
    // Premium Navbar Utility - Logic
    const userBtn = document.getElementById("user-btn");
    const themeToggle = document.getElementById("theme-toggle");
    const premiumDropdown = document.getElementById("user-dropdown");
    const body = document.body;

    // 1. Theme Switcher Logic
    if (themeToggle) {
        // Initialize theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            body.classList.add("light-theme");
        }

        themeToggle.addEventListener("click", () => {
            body.classList.toggle("light-theme");
            const isLight = body.classList.contains("light-theme");
            localStorage.setItem("theme", isLight ? "light" : "dark");
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
