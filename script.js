let currentIndex = 0;
const maxImages = 100;
const extensions = ['jpg', 'jpeg', 'png', 'gif'];

const imageWidth = window.innerWidth <= 600 ? 220 : 320;

const possibleImages = [];
for (let i = 1; i <= maxImages; i++) {
    extensions.forEach(ext => {
        possibleImages.push(`${i}.${ext}`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Set up IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                console.log(`Fade-in element ${index} is intersecting:`, entry.target);
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px' // Trigger earlier to ensure visibility
    });

    // Observe initial fade-in elements
    const fadeInElements = document.querySelectorAll('.fade-in');
    console.log('Initial fade-in elements found:', fadeInElements.length);
    fadeInElements.forEach((element, index) => {
        console.log(`Observing initial element ${index}:`, element);
        observer.observe(element);
    });

    // Gallery logic
    const gallery = document.getElementById('gallery-images');
    let loadedImages = 0;

    if (gallery) {
        possibleImages.forEach(filename => {
            if (loadedImages >= maxImages) return;

            const imgElement = document.createElement('img');
            imgElement.src = `ARTWORK/${filename}?v=${Date.now()}`;
            imgElement.alt = `Artwork ${filename}`;

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
    }

    // Blog content logic
    const blogContent = document.getElementById('blog-content');
    if (blogContent) {
        console.log('Fetching blog posts...');
        const fetchPromises = [];
        for (let i = 100; i >= 1; i--) {
            fetchPromises.push(
                fetch(`BLOG/${i}.txt?v=${Date.now()}`)
                    .then(response => {
                        if (!response.ok) throw new Error(`File ${i}.txt not found`);
                        return response.text().then(text => ({ id: i, text }));
                    })
                    .catch(error => {
                        console.log(`Skipping ${i}.txt: ${error.message}`);
                        return null;
                    })
            );
        }

        Promise.all(fetchPromises).then(results => {
            const validPosts = results.filter(result => result !== null);
            console.log('Valid posts found:', validPosts.length);

            if (validPosts.length === 0) {
                const pElement = document.createElement('p');
                pElement.classList.add('fade-in');
                pElement.textContent = 'No blog posts found. Please check back later!';
                blogContent.appendChild(pElement);
                observer.observe(pElement);
                return;
            }

            validPosts.forEach(post => {
                console.log(`Processing post ${post.id}:`, post.text);
                // Create post container
                const postDiv = document.createElement('div');
                postDiv.classList.add('blog-post', 'fade-in');
                // Add post title
                const title = document.createElement('h3');
                title.classList.add('fade-in');
                title.textContent = `Post ${post.id}`;
                postDiv.appendChild(title);
                // Split text into paragraphs
                const paragraphs = post.text.replace(/\r\n|\r/g, '\n').split('\n').filter(p => p.trim() !== '');
                paragraphs.forEach((paragraph, index) => {
                    const pElement = document.createElement('p');
                    pElement.classList.add('fade-in');
                    pElement.textContent = paragraph.trim();
                    postDiv.appendChild(pElement);
                    console.log(`Added paragraph ${index} for post ${post.id}:`, pElement.textContent);
                });
                blogContent.appendChild(postDiv);
                // Observe all fade-in elements in this post
                postDiv.querySelectorAll('.fade-in').forEach((element, index) => {
                    console.log(`Observing post ${post.id} element ${index}:`, element);
                    observer.observe(element);
                });
            });

            // Fallback: Force visibility after a delay if elements are not visible
            setTimeout(() => {
                blogContent.querySelectorAll('.fade-in:not(.visible)').forEach((element, index) => {
                    console.log(`Forcing visibility for element ${index}:`, element);
                    element.classList.add('visible');
                });
            }, 1000);
        });
    }
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