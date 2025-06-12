// Gallery Data
const galleryData = [
    {
        id: 1,
        category: 'anime',
        title: 'Anime Character 1',
        image: '../assets/images/anime1.jpg',
        description: 'Original character design inspired by modern anime style',
        tags: ['#anime', '#character', '#design']
    },
    {
        id: 2,
        category: '3d',
        title: '3D Model 1',
        model: '../assets/models/model1.glb',
        description: 'Interactive 3D model created with Three.js',
        tags: ['#3d', '#interactive', '#model']
    },
    // Add more items as needed
];

// Initialize Three.js for 3D models
let scene, camera, renderer, mixer, clock;
let modelsLoaded = 0;
let totalModels = 0;

function initThreeJS(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    totalModels++;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 5;
    clock = new THREE.Clock();

    // Load 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        '../assets/models/model1.glb',
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            // Set up animation mixer
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();

            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            model.scale.multiplyScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            
            modelsLoaded++;
            checkAllContentLoaded();
        },
        undefined,
        function (error) {
            console.error('Error loading 3D model:', error);
            modelsLoaded++;
            checkAllContentLoaded();
        }
    );

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Create gallery items dynamically
function createGalleryItems() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    galleryData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.category}`;
        galleryItem.setAttribute('data-category', item.category);

        const card3D = document.createElement('div');
        card3D.className = 'card-3d';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        if (item.category === '3d') {
            const modelContainer = document.createElement('div');
            modelContainer.className = 'model-container';
            modelContainer.id = `model${item.id}`;
            cardFront.appendChild(modelContainer);
        } else {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.onload = () => {
                modelsLoaded++;
                checkAllContentLoaded();
            };
            img.onerror = () => {
                console.error(`Error loading image: ${item.image}`);
                modelsLoaded++;
                checkAllContentLoaded();
            };
            cardFront.appendChild(img);
        }

        const title = document.createElement('h3');
        title.textContent = item.title;
        cardFront.appendChild(title);

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        const description = document.createElement('p');
        description.textContent = item.description;
        cardBack.appendChild(description);

        const tags = document.createElement('span');
        tags.className = 'tags';
        tags.textContent = item.tags.join(' ');
        cardBack.appendChild(tags);

        card3D.appendChild(cardFront);
        card3D.appendChild(cardBack);
        galleryItem.appendChild(card3D);
        galleryGrid.appendChild(galleryItem);
    });
}

// Check if all content is loaded
function checkAllContentLoaded() {
    const totalContent = galleryData.length;
    if (modelsLoaded >= totalContent) {
        hideLoadingScreen();
    }
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Create gallery items
    createGalleryItems();

    // Initialize 3D models
    const modelContainers = document.querySelectorAll('.model-container');
    modelContainers.forEach(container => {
        initThreeJS(container.id);
    });

    // Initialize gallery filtering
    initGalleryFiltering();
    
    // Initialize floating characters
    initFloatingChars();
    
    // Initialize gallery item hover effects
    initGalleryHoverEffects();

    // Set a timeout to hide loading screen if content takes too long
    setTimeout(hideLoadingScreen, 5000);
});

// Gallery Filtering
function initGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    // Add animation
                    item.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Floating Characters Animation
function initFloatingChars() {
    const floatingChars = document.querySelectorAll('.floating-char');

    floatingChars.forEach(char => {
        // Random initial position
        char.style.left = `${Math.random() * 80}%`;
        char.style.top = `${Math.random() * 80}%`;
        
        // Random animation duration
        const duration = 5 + Math.random() * 3;
        char.style.animationDuration = `${duration}s`;
    });
}

// Gallery Item Hover Effects
function initGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.02)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
} 