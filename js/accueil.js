const images = document.querySelectorAll('.slide-images img');
const navItems = document.querySelectorAll('.slide-nav li');

let currentIndex = 0;
const interval = 7000;

function showSlide(index) {
    images.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
    });

    navItems.forEach((item, i) => {
        item.classList.toggle('navActive', i === index);
    });
}

function startSlideShow() {
    showSlide(currentIndex);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }, interval);
}

navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
    });
});

startSlideShow();
