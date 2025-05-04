const popularContainer = document.querySelector('.popular-product');
const allProductContainer = document.querySelector('.products-container');
const productTemplate = document.getElementById('productTemplate');
let allProducts = [];

function generateProduct(product) {
    const clone = productTemplate.content.cloneNode(true);

    clone.querySelector('img').src = product.image;
    clone.querySelector('h3').textContent = product.name;
    clone.querySelector('p').textContent = product.description;
    clone.querySelector('#price').textContent = product.price;

    return clone;
}

function afficherProduits(produits, container) {
    if (!container) {
        console.error("Container introuvable !");
        return;
    }

    container.textContent = "";
    produits.forEach(produit => {
        const card = generateProduct(produit);
        container.appendChild(card);
    });
}

fetch("../data.json")
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data)) {
            console.error("Le fichier data.json doit contenir un tableau !");
            return;
        }

        allProducts = data;
        const popularProducts = allProducts.filter(p => p.type === "popular");

        afficherProduits(allProducts, allProductContainer);
        afficherProduits(popularProducts, popularContainer);
    })
    .catch(error => {
        console.error("Erreur lors du fetch des produits :", error);
        allProductContainer.textContent = "Impossible de récupérer les données.";
    });

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );

        afficherProduits(filtered, allProductContainer);
    });
}
function filtrerProduits(categorie) {
    const loader = document.getElementById('chargement');
    const container = allProductContainer;

    if (!loader || !container) return;

    loader.classList.remove('hidden');
    container.innerHTML = ""; // Vide les produits actuels

    setTimeout(() => {
        let filtres = categorie === "all"
            ? allProducts
            : allProducts.filter(p => p.category === categorie);

        if (filtres.length > 0) {
            afficherProduits(filtres, container);

            // Ajoute une animation de fade-in
            const cards = container.querySelectorAll('.product-card');
            cards.forEach(card => {
                card.classList.add('fade-in');
            });
        } else {
            container.innerHTML = `
                <p class="empty-message">
                    Désolé, le <strong>${categorie}</strong> n’est pas dans notre menu pour le moment.
                </p>
            `;
        }

        loader.classList.add('hidden');
    }, 600); // Délai simulé pour effet "chargement"
}
