// Blog Data
const blogPosts = [
    {
        id: 1,
        title: "Creating Anime-Inspired Web Experiences",
        category: "tech",
        date: "March 15, 2024",
        image: "../assets/images/blog/featured.jpg",
        excerpt: "Exploring the intersection of anime aesthetics and modern web development...",
        content: "Full blog post content here..."
    },
    {
        id: 2,
        title: "Top Anime Art Styles in 2024",
        category: "anime",
        date: "March 10, 2024",
        image: "../assets/images/blog/post1.jpg",
        excerpt: "Discover the latest trends in anime art and design...",
        content: "Full blog post content here..."
    },
    // Add more blog posts as needed
];

// Category Filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const blogGrid = document.querySelector('.blog-grid');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const category = button.getAttribute('data-category');
        filterPosts(category);
    });
});

function filterPosts(category) {
    const posts = document.querySelectorAll('.blog-post:not(.featured)');
    
    posts.forEach(post => {
        if (category === 'all' || post.getAttribute('data-category') === category) {
            post.style.display = 'block';
            // Add animation
            post.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            post.style.display = 'none';
        }
    });
}

// Search Functionality
const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        // If search is empty, show all posts
        filterPosts('all');
        return;
    }

    const posts = document.querySelectorAll('.blog-post');
    
    posts.forEach(post => {
        const title = post.querySelector('h2, h3').textContent.toLowerCase();
        const content = post.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            post.style.display = 'block';
            // Highlight search term
            highlightText(post, searchTerm);
        } else {
            post.style.display = 'none';
        }
    });
});

function highlightText(element, searchTerm) {
    const text = element.innerHTML;
    const highlightedText = text.replace(
        new RegExp(searchTerm, 'gi'),
        match => `<span class="highlight">${match}</span>`
    );
    element.innerHTML = highlightedText;
}

// Add highlight style
const style = document.createElement('style');
style.textContent = `
    .highlight {
        background-color: var(--accent-color);
        color: var(--primary-color);
        padding: 0 2px;
        border-radius: 2px;
    }
`;
document.head.appendChild(style);

// Infinite Scroll
let page = 1;
const postsPerPage = 6;
let loading = false;

function loadMorePosts() {
    if (loading) return;
    loading = true;

    // Simulate loading more posts
    setTimeout(() => {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const newPosts = blogPosts.slice(start, end);

        if (newPosts.length > 0) {
            newPosts.forEach(post => {
                const postElement = createPostElement(post);
                blogGrid.appendChild(postElement);
            });
            page++;
        }

        loading = false;
    }, 1000);
}

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    article.setAttribute('data-category', post.category);
    
    article.innerHTML = `
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}">
            <div class="post-category">${post.category}</div>
        </div>
        <div class="post-content">
            <h3>${post.title}</h3>
            <div class="post-meta">
                <span class="date">${post.date}</span>
                <span class="category">${post.category}</span>
            </div>
            <p>${post.excerpt}</p>
            <a href="#" class="read-more">Read More</a>
        </div>
    `;
    
    return article;
}

// Intersection Observer for infinite scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadMorePosts();
        }
    });
}, { threshold: 0.5 });

// Observe the last post
const lastPost = document.querySelector('.blog-post:last-child');
if (lastPost) {
    observer.observe(lastPost);
}

// Add hover effect to blog posts
const blogPosts = document.querySelectorAll('.blog-post');
blogPosts.forEach(post => {
    post.addEventListener('mouseenter', () => {
        post.style.transform = 'translateY(-5px)';
    });

    post.addEventListener('mouseleave', () => {
        post.style.transform = 'translateY(0)';
    });
});

// Add parallax effect to blog header
const blogHeader = document.querySelector('.blog-header');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    blogHeader.style.backgroundPositionY = `${scrolled * 0.5}px`;
}); 