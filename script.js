// Main script.js - Core functionality for the main page
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const loadingScreen = document.querySelector('.loading-screen');
    const loaderText = document.querySelector('.loader-text');
    const floatingContact = document.querySelector('.floating-contact');
    
    // Hide floating contact and prevent scrolling
    body.classList.add('loading');
    if (floatingContact) {
        floatingContact.style.display = 'none';
    }
    
    // Wait for text animation to complete
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Show floating contact and allow scrolling
            body.classList.remove('loading');
            if (floatingContact) {
                floatingContact.style.display = 'flex';
            }
        }, 500);
    }, 2000); // Adjust this timing based on your animation duration
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.getElementById('back-to-top');

    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Scroll reveal animation
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.section-title, .about-content, .project-grid, .contact-content');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.75) {
                element.classList.add('reveal');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
}); 