document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Adjust for fixed navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.getElementById('hamburger-menu').classList.remove('active');
                document.querySelector('.nav-links').classList.remove('active');
            }
        });
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNav = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active'); // Optional: for styling the icon (e.g., change to 'X')
        mobileNav.classList.toggle('active');
    });

    // Scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove class if you want animation to repeat on scroll up/down
                 // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Contact Form Placeholder (prevents actual submission)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Grazie per il tuo messaggio! (Invio simulato - backend non implementato)');
            // Qui potresti eventualmente resettare il form
            // this.reset();
        });
    }

});