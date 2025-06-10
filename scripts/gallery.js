// Gallery Data
const galleryItems = [
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

function initThreeJS(containerId) {
    const container = document.getElementById(containerId);
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
        },
        undefined,
        function (error) {
            console.error('Error loading 3D model:', error);
        }
    );

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    renderer.render(scene, camera);
}

// Initialize 3D models
document.addEventListener('DOMContentLoaded', () => {
    const modelContainers = document.querySelectorAll('.model-container');
    modelContainers.forEach(container => {
        initThreeJS(container.id);
    });
});

// Gallery Filtering
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

// Floating Characters Animation
const floatingChars = document.querySelectorAll('.floating-char');

floatingChars.forEach(char => {
    // Random initial position
    char.style.left = `${Math.random() * 80}%`;
    char.style.top = `${Math.random() * 80}%`;
    
    // Random animation duration
    const duration = 5 + Math.random() * 3;
    char.style.animationDuration = `${duration}s`;
});

// Loading Animation
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
});

// Add hover effect to gallery items
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
}); 