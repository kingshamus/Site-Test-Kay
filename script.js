let currentIndex = 0;
const maxImages = 100;
const extensions = ['jpg', 'jpeg', 'png', 'gif'];

// Set imageWidth based on screen size
const imageWidth = window.innerWidth <= 600 ? 220 : 320;

// Generate possible image filenames
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
    imgElement.src = `ARTWORK/${filename}?v=${Date.now()}`;
    imgElement.alt = `Artwork ${filename}`;

    // Add click event to open modal
    imgElement.onclick = () => openModal(imgElement.src, imgElement.alt);

    imgElement.onload = () => {
        if (loadedImages < maxImages) {
            imgElement.classList.add('loaded');
            gallery.appendChild(imgElement);
            loadedImages++;
        }
    };
    imgElement.onerror = () => {
        imgElement.remove();
    };
});

function scrollCarousel(direction) {
    const gallery = document.getElementById('gallery-images');
    const totalImages = Math.min(gallery.getElementsByTagName('img').length, maxImages);

    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalImages - 1;
    } else if (currentIndex >= totalImages) {
        currentIndex = 0;
    }

    gallery.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
}

function openModal(src, alt) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('active');
}