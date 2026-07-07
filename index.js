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

    // 6. Lightbox Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxStage = lightbox.querySelector('.lightbox-stage');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxDots = lightbox.querySelector('.lightbox-dots');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

    let galleryItems = [];
    let currentSlide = 0;

    function openLightbox(mediaEl) {
        const galleryData = mediaEl.getAttribute('data-gallery');
        if (!galleryData) return;

        try {
            galleryItems = JSON.parse(galleryData);
        } catch (e) {
            console.error('Invalid gallery data', e);
            return;
        }

        if (galleryItems.length === 0) return;

        currentSlide = 0;
        renderSlide();
        renderDots();
        updateCounter();
        updateNavButtons();

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';

        // Pause any playing video
        const video = lightboxStage.querySelector('video');
        if (video) video.pause();

        galleryItems = [];
        lightboxStage.innerHTML = '';
    }

    function renderSlide() {
        // Pause any existing video before switching
        const oldVideo = lightboxStage.querySelector('video');
        if (oldVideo) oldVideo.pause();

        const item = galleryItems[currentSlide];
        lightboxStage.innerHTML = '';

        if (item.type === 'youtube') {
            let videoId = '';

            if (item.src.includes('youtu.be/')) {
                videoId = item.src.split('youtu.be/')[1].split('?')[0];
            } else if (item.src.includes('youtube.com/embed/')) {
                videoId = item.src.split('youtube.com/embed/')[1].split('?')[0];
            } else if (item.src.includes('v=')) {
                videoId = item.src.split('v=')[1].split('&')[0];
            } else {
                videoId = item.src;
            }

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
            iframe.title = item.alt || 'YouTube Video Player';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.allowFullscreen = true;
            lightboxStage.appendChild(iframe);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            if (item.alt) video.title = item.alt;
            lightboxStage.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt || '';
            lightboxStage.appendChild(img);
        }
    }

    function renderDots() {
        lightboxDots.innerHTML = '';
        if (galleryItems.length <= 1) return;

        galleryItems.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'lightbox-dot' + (i === currentSlide ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentSlide = i;
                renderSlide();
                updateDots();
                updateCounter();
                updateNavButtons();
            });
            lightboxDots.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = lightboxDots.querySelectorAll('.lightbox-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function updateCounter() {
        if (galleryItems.length <= 1) {
            lightboxCounter.textContent = '';
            return;
        }
        lightboxCounter.textContent = `${currentSlide + 1} / ${galleryItems.length}`;
    }

    function updateNavButtons() {
        lightboxPrev.disabled = currentSlide === 0;
        lightboxNext.disabled = currentSlide === galleryItems.length - 1;
    }

    function goToSlide(direction) {
        const next = currentSlide + direction;
        if (next < 0 || next >= galleryItems.length) return;
        currentSlide = next;
        renderSlide();
        updateDots();
        updateCounter();
        updateNavButtons();
    }

    // Wire up gallery click on project media
    document.querySelectorAll('.project-media.has-gallery').forEach(media => {
        media.addEventListener('click', () => openLightbox(media));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => goToSlide(-1));
    lightboxNext.addEventListener('click', () => goToSlide(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToSlide(-1);
        if (e.key === 'ArrowRight') goToSlide(1);
    });
});