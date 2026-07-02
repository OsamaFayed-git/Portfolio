document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenuOverlay.classList.toggle('open', isMenuOpen);
        mobileMenuBtn.innerHTML = isMenuOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
        lucide.createIcons();
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => { if (isMenuOpen) toggleMenu(); });
    });

    // 3. Scroll Animations (Fade Up)
    const elementsToAnimate = [
        ...document.querySelectorAll('.philosophy-card'),
        ...document.querySelectorAll('.skill-category'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.social-card')
    ];
    elementsToAnimate.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elementsToAnimate.forEach(el => observer.observe(el));

    // 4. Active Nav Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY > sectionTop && window.scrollY <= sectionTop + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });

    // 5. Copy Email on Click
    const emailCard = document.getElementById('email-card');
    if (emailCard) {
        emailCard.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailCard.getAttribute('href').replace('mailto:', '');
            const textSpan = document.getElementById('email-text');
            const iconEl = emailCard.querySelector('svg, i');
            const originalText = textSpan.textContent;

            const showCopied = () => {
                textSpan.textContent = 'Copied to clipboard!';
                if (iconEl) iconEl.outerHTML = '<i data-lucide="check"></i>';
                lucide.createIcons();
                setTimeout(() => {
                    textSpan.textContent = originalText;
                    const checkIcon = emailCard.querySelector('svg, i');
                    if (checkIcon) checkIcon.outerHTML = '<i data-lucide="mail"></i>';
                    lucide.createIcons();
                }, 1800);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(showCopied).catch(() => fallbackCopy(email, showCopied));
            } else {
                fallbackCopy(email, showCopied);
            }
        });
    }

    function fallbackCopy(text, onSuccess) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            onSuccess();
        } catch (err) {
            console.error('Copy failed', err);
        }
        document.body.removeChild(textArea);
    }
});
