document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenuOverlay.classList.add('open');
            // Change icon to 'X' (lucide handles icon replacement differently, 
            // a simple way is to toggle class if using webfonts, or replace innerHTML if using script)
            mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
            lucide.createIcons();
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileMenuOverlay.classList.remove('open');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // 3. Scroll Animations (Fade Up)
    // Add fade-up class to elements we want to animate
    const elementsToAnimate = [
        ...document.querySelectorAll('.philosophy-card'),
        ...document.querySelectorAll('.skill-category'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.social-card')
    ];

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // 4. Active Nav Link Highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // offset for navbar
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });



    // --- 1. COPY EMAIL FUNCTIONALITY ---
const emailCard = document.querySelector('a[href^="mailto:"]');
if (emailCard) {
    emailCard.addEventListener('click', function(e) {
        e.preventDefault(); // Prevents the default mail app from opening
        
        const email = this.getAttribute('href').replace('mailto:', '');
        
        // Attempt to copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            const textSpan = this.querySelector('span');
            const originalText = textSpan.textContent;
            const svgIcon = this.querySelector('svg'); // Lucide replaces <i> with <svg>
            
            // Visual feedback: Change text and highlight icon
            textSpan.textContent = 'Copied!';
            if (svgIcon) {
                svgIcon.style.color = 'var(--accent)'; 
            }
            
            // Revert back to original state after 2 seconds
            setTimeout(() => {
                textSpan.textContent = originalText;
                if (svgIcon) {
                    svgIcon.style.color = ''; 
                }
            }, 2000);
            
        }).catch(err => {
            // Fallback for older browsers or non-HTTPS environments
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const textSpan = this.querySelector('span');
            textSpan.textContent = 'Copied!';
            setTimeout(() => { textSpan.textContent = 'Copy Email'; }, 2000);
        });
    });
}

// --- 2. NAVBAR SCROLL EFFECT ---
// Adds the 'scrolled' class to the navbar when you scroll down (matches your CSS)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- 3. MOBILE MENU TOGGLE ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.toggle('open');
        // Prevent background scrolling when menu is open
        document.body.style.overflow = mobileMenuOverlay.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// --- 4. SCROLL ANIMATIONS (Intersection Observer) ---
// Triggers the 'visible' class when elements scroll into view (matches your CSS .fade-up)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements with the fade-up class (if you add them to your HTML later)
document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});
    
});
