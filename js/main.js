const MIN_TIME = 900;

const loader = document.getElementById("loader");
const start = performance.now();

window.addEventListener("load", () => {
  const elapsed = performance.now() - start;
  const delay = Math.max(0, MIN_TIME - elapsed);

  setTimeout(() => {
    loader.classList.add("hide");
  }, delay);
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  });
  
  document.querySelectorAll('.scroll-animation').forEach(el => observer.observe(el));
  

// ------------------ Avis clients ------------------
const reviewContainer = document.querySelector('.client-content');
const reviewTemplate = document.getElementById('reviewTemplate');

fetch('../client.json')
    .then(response => response.json())
    .then(data => {
        const clients = data.clients;
        clients.forEach(client => {
            const clone = reviewTemplate.content.cloneNode(true);
            clone.querySelector('.message').textContent = client.message;
            clone.querySelector('img').src = client.photo;
            clone.querySelector('strong').textContent = client.nom;
            clone.querySelector('.date').textContent = client.date;
            reviewContainer.append(clone);
        });
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des avis clients :", error);
    });

// ------------------ Sliders génériques ------------------
function createSimpleSlider({ containerSelector, prevBtnSelector, nextBtnSelector }) {
    const container = document.querySelector(containerSelector);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);

    if (!container || !prevBtn || !nextBtn) return;

    nextBtn.addEventListener("click", () => {
        const firstChild = container.firstElementChild;
        if (firstChild) container.appendChild(firstChild);
    });

    prevBtn.addEventListener("click", () => {
        const lastChild = container.lastElementChild;
        if (lastChild) container.insertBefore(lastChild, container.firstElementChild);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    createSimpleSlider({
        containerSelector: ".popular-product",
        prevBtnSelector: "#prev",
        nextBtnSelector: "#next"
    });

    createSimpleSlider({
        containerSelector: ".client-content",
        prevBtnSelector: "#clientPrev",
        nextBtnSelector: "#clientNext"
    });

    createSimpleSlider({
        containerSelector: ".userContainer",
        prevBtnSelector: "#membersPrev",
        nextBtnSelector: "#membersNext"
    });
});
