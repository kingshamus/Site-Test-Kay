let currentIndex = 0;
const imageWidth = 320; // Width of image + margin (300px + 20px)
const maxImages = 100;
const extensions = ['jpg', 'jpeg', 'png', 'gif'];

// Generate possible image filenames (e.g., 1.jpg, 1.png, 2.jpg, etc.)
const possibleImages = [];
for (let i = 1; i <= maxImages; i++) {
    extensions.forEach(ext => {
        possibleImages.push(`${i}.${ext}`);
    });
}

const gallery = document.getElementById('gallery-images');
let loadedImages = 0;

// Load images that exist
possibleImages.forEach(filename => {
    if (loadedImages >= maxImages) return;

    const imgElement = document.createElement('img');
    imgElement.src = `ARTWORK/${filename}?v=${Date.now()}`; // Cache busting
    imgElement.alt = `Artwork ${filename}`;

    // Check if image loads successfully
    imgElement.onload = () => {
        if (loadedImages < maxImages) {
            imgElement.classList.add('loaded'); // Show image
            gallery.appendChild(imgElement);
            loadedImages++;
        }
    };
    // Skip if image doesn't exist
    imgElement.onerror = () => {
        imgElement.remove();
    };
});

function scrollCarousel(direction) {
    const gallery = document.getElementById('gallery-images');
    const totalImages = Math.min(gallery.getElementsByTagName('img').length, maxImages);

    // Update current index with wrap-around
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalImages - 1; // Jump to last image
    } else if (currentIndex >= totalImages) {
        currentIndex = 0; // Jump to first image
    }

    // Move the carousel
    gallery.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
}