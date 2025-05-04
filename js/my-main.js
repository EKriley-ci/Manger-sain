// éléments pour le slide 
const images = document.querySelectorAll('.slide-images img');
const navItems = document.querySelectorAll('.slide-nav li');


let currentIndex = 0;
const interval = 7000;

// Affiche la diapositive en fonction de l'index
function showSlide(index){
    images.forEach((img , i) => {
        img.style.display = i === index ? 'block' : 'none'; // Affiche l'image correspondante
    })

    navItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('navActive'); // Ajoute la classe au li actif
        } else {
            item.classList.remove('navActive'); // Retire la classe des autres
        }
    });
}


// Fonction pour démarrer le diaporama
function startSlideShow() {
    showSlide(currentIndex); // Affiche la première image

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }, interval);
}

// Gérer le clic sur un élément de la navigation
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index; // Mettre à jour l'index en fonction de l'élément cliqué
        showSlide(currentIndex); // Affiche l'image correspondante
    });
});

// Lancer le diaporama
startSlideShow();

// Récupération des containers
const popularContainer = document.querySelector('.popular-product');
const allProductContainer = document.querySelector('.products-container');
const productTemplate = document.getElementById('productTemplate');

// Fonction pour générer une carte produit
function generateProduct(product) {
    const clone = productTemplate.content.cloneNode(true);

    const img = clone.querySelector('img');
    const name = clone.querySelector('h3');
    const desc = clone.querySelector('p');
    const price = clone.querySelector('#price');

    img.src = product.image;
    name.textContent = product.name;
    desc.textContent = product.description;
    price.textContent = product.price

    return clone;
}

// Fonction pour afficher des produits dans un container
function afficherProduits(produits, container) {
    if (!container) {
        console.error("Container introuvable !");
        return;
    }

    container.textContent = ""; // Nettoyer d'abord le container

    produits.forEach(produit => {
        const card = generateProduct(produit);
        container.appendChild(card);
    });
}

// Fetch des produits
let allProducts = [];

fetch("../data.json")
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data)) {
            console.error("Le fichier data.json doit contenir un tableau d'objets !");
            return;
        }
        allProducts = data;

        const popularProducts = allProducts.filter(p => p.type === "popular");

        // On affiche d'abord tous les produits dans la section menu
        afficherProduits(allProducts, allProductContainer);

        // Puis les produits populaires dans leur section spéciale
        afficherProduits(popularProducts, popularContainer);
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des produits :", error);
        allProductContainer.textContent = "Impossible de récupérer les données.";
    });
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
    
        // Filtrer les produits par rapport au mot clé
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    
        // Afficher les résultats filtrés
        afficherProduits(filteredProducts, allProductContainer);
    });
    

    function filtrerProduits(categorie) {
        let produitsFiltres = [];
    
        if (categorie === "all") {
            produitsFiltres = allProducts;
        } else {
            produitsFiltres = allProducts.filter(p => p.category === categorie);
        }
    
        afficherProduits(produitsFiltres, allProductContainer);
    }
    const reviewContainer = document.querySelector('.client-content')
const reviewTemplate = document.getElementById('reviewTemplate')
fetch('../client.json')
    .then(response => response.json())
    .then(data => {
        clients = data.clients
        clients.forEach(client =>{
            const clone = reviewTemplate.content.cloneNode(true)
            clone.querySelector('.message').textContent = client.message
            clone.querySelector('img').src = client.photo
            clone.querySelector('strong').textContent = client.nom
            clone.querySelector('.date').textContent = client.date
            reviewContainer.append(clone)
        })
    })
    .catch(error =>{
        console.error("Erreur lors de la récupération des produits :", error);})

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
        
            // Tu pourrais en rajouter d'autres facilement :
            // createSimpleSlider({
            //     containerSelector: ".autre-section",
            //     prevBtnSelector: "#autre-prev",
            //     nextBtnSelector: "#autre-next"
            // });
            createSimpleSlider({
                containerSelector : ".client-content",
                prevBtnSelector : "#clientPrev",
                nextBtnSelector : "#clientNext"
            });
            createSimpleSlider({
                containerSelector : ".userContainer",
                prevBtnSelector : "#membersPrev",
                nextBtnSelector : "#membersNext"
            })
        });


        // let allmembers = [];
        // document.addEventListener('DOMContentLoaded', () => {
        //     fetch('../members.json')
        //         .then(response => response.json())
        //         .then(data => {
        //             const membres = data.membres;
        //             const template = document.getElementById('membersTemplate');
        //             const containers = document.querySelectorAll('.userContainer');
        
        //             if (!template || containers.length === 0) {
        //                 console.warn("Template ou container introuvable sur cette page.");
        //                 return;
        //             }
        
        //             membres.forEach(membre => {
        //                 const clone = template.content.cloneNode(true);
        //                 clone.querySelector('img').src = membre.images;
        //                 clone.querySelector('.members-name').textContent = membre.nom;
        //                 clone.querySelector('.back').textContent = membre.desc;
        
        //                 containers.forEach(container => {
        //                     container.appendChild(clone.cloneNode(true)); // important : recloner
        //                 });
        //             });
        //         })
        //         .catch(error => {
        //             console.error("Erreur lors de la récupération des membres :", error);
        //         });
        // });
        