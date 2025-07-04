// Loading Screen
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

// Three.js Background Setup
let scene, camera, renderer, particles;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 2;
}

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0001;
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize Three.js
initThreeJS();
animate();
window.addEventListener('resize', onWindowResize);

// Navigation
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile navigation toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Active navigation link
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 100;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu after clicking
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Back to top button
const backToTop = document.getElementById('back-to-top');

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

// Project data
const projects = [
    {
        title: "SHOEPALACE(E-commerce)",
        description: "This is a shoe buying website designed to provide users with an easy and enjoyable online shopping experience for footwear.",
        image: "assets/images/projects/pro-1.png",
        technologies: ["HTML", "CSS", "JavaScript"],
        category: "web",
        link: "https://shoepalace-9b1e.onrender.com/"
    },
    {
        title: "HOSTCANON",
        description: "This is a web hosting service platform that allows users to browse hosting plans and manage their domains effortlessly.",
        image: "assets/images/projects/pro-2.png",
        technologies: ["Php", "MySQL", "JavaScript"],
        category: "web",
        link: "https://hostcanon.onrender.com/"
    },
    // {
    //     title: "Mobile Game UI",
    //     description: "Anime-style mobile game interface design",
    //     image: "https://via.placeholder.com/300x200",
    //     technologies: ["Figma", "Adobe XD", "Illustrator"],
    //     category: "mobile",
    //     link: "#"
    // }
];

// Create project cards
function createProjectCards() {
    const projectGrid = document.querySelector('.project-grid');
    projectGrid.innerHTML = ''; // Clear existing cards
    
    projects.forEach(project => {
        const card = createProjectCard(project);
        projectGrid.appendChild(card);
    });
}

function createProjectCard(project) {
    const template = document.getElementById('project-template');
    const card = template.content.cloneNode(true);
    
    // Set data-category attribute
    const projectCard = card.querySelector('.project-card');
    projectCard.setAttribute('data-category', project.category);
    
    // Set project image
    const img = card.querySelector('.project-image img');
    img.src = project.image;
    img.alt = project.title;
    
    // Set project title and description
    const title = card.querySelector('.project-content h3');
    title.textContent = project.title;
    
    const description = card.querySelector('.project-content p');
    description.textContent = project.description;
    
    // Set project technologies
    const techContainer = card.querySelector('.project-tech');
    project.technologies.forEach(tech => {
        const span = document.createElement('span');
        span.textContent = tech;
        techContainer.appendChild(span);
    });
    
    // Set project link
    const link = card.querySelector('.view-project');
    link.href = project.link;
    
    return card;
}

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Initialize project cards
createProjectCards();

// Form handling
const contactForm = document.getElementById('contact-form');
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('focus', () => {
        group.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        if (!input.value) {
            group.classList.remove('focused');
        }
    });
});

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Add loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Reset form
        this.reset();
        formGroups.forEach(group => group.classList.remove('focused'));
        
        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.classList.add('success');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
});

// Scroll reveal animation
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

// Floating Contact Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBtn');
    const socialLinks = document.getElementById('socialLinks');

    if (contactBtn && socialLinks) {
        // Toggle social links
        contactBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            contactBtn.classList.toggle('active');
            socialLinks.classList.toggle('show');
        });

        // Close social links when clicking outside
        document.addEventListener('click', function(e) {
            if (!contactBtn.contains(e.target) && !socialLinks.contains(e.target)) {
                contactBtn.classList.remove('active');
                socialLinks.classList.remove('show');
            }
        });

        // Prevent social links from closing when clicking inside
        socialLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}); 