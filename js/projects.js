// Projects functionality - Single source of truth for project management
document.addEventListener('DOMContentLoaded', () => {
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
        }
    ];

    // Create project cards
    function createProjectCards() {
        const projectGrid = document.querySelector('.project-grid');
        if (!projectGrid) return;
        
        projectGrid.innerHTML = ''; // Clear existing cards
        
        projects.forEach(project => {
            const card = createProjectCard(project);
            projectGrid.appendChild(card);
        });
    }

    function createProjectCard(project) {
        const template = document.getElementById('project-template');
        if (!template) return document.createElement('div');
        
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
}); 