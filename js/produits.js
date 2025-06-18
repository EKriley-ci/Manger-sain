const popularContainer = document.querySelector(".popular-product")
const allProductContainer = document.querySelector(".products-container")
const productTemplate = document.getElementById("productTemplate")
let allProducts = []

function generateProduct(product) {
  const clone = productTemplate.content.cloneNode(true)

  clone.querySelector("img").src = product.image
  clone.querySelector("img").alt = product.name
  clone.querySelector("h3").textContent = product.name
  clone.querySelector("p").textContent = product.description
  clone.querySelector("#price").textContent = product.price

  return clone
}

function afficherProduits(produits, container) {
  if (!container) {
    console.error("Container introuvable !")
    return
  }

  container.innerHTML = "" // Utiliser innerHTML au lieu de textContent
  produits.forEach((produit) => {
    const card = generateProduct(produit)
    container.appendChild(card)
  })

  // Déclencher l'événement pour notifier que les produits sont chargés
  document.dispatchEvent(new CustomEvent("produitsCharges", { detail: produits }))
}

// ✅ CORRECTION : Chemin correct vers data.json (à la racine)
fetch("./data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
  .then((data) => {
    if (!Array.isArray(data)) {
      console.error("Le fichier data.json doit contenir un tableau !")
      return
    }

    allProducts = data
    const popularProducts = allProducts.filter((p) => p.type === "popular")

    // Afficher les produits
    if (allProductContainer) {
      afficherProduits(allProducts, allProductContainer)
    }
    if (popularContainer) {
      afficherProduits(popularProducts, popularContainer)
    }

    console.log(`${allProducts.length} produits chargés avec succès`)
  })
  .catch((error) => {
    console.error("Erreur lors du fetch des produits :", error)
    if (allProductContainer) {
      allProductContainer.innerHTML = `
                <div class="error-message">
                    <p>❌ Impossible de charger les produits</p>
                    <p>Vérifiez que le fichier data.json existe à la racine du projet</p>
                </div>
            `
    }
  })

// Recherche
const searchInput = document.getElementById("searchInput")
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()

    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm),
    )

    if (allProductContainer) {
      afficherProduits(filtered, allProductContainer)
    }
  })
}

// Filtrage par catégorie
function filtrerProduits(categorie) {
  const loader = document.getElementById("chargement")
  const container = allProductContainer

  if (!container) return

  if (loader) {
    loader.classList.remove("hidden")
  }

  setTimeout(() => {
    const filtres = categorie === "all" ? allProducts : allProducts.filter((p) => p.category === categorie)

    if (filtres.length > 0) {
      afficherProduits(filtres, container)
    } else {
      container.innerHTML = `
                <div class="empty-message">
                    <p>😔 Désolé, aucun <strong>${categorie}</strong> n'est disponible pour le moment.</p>
                    <button onclick="filtrerProduits('all')" class="secondary-btn">Voir tous les plats</button>
                </div>
            `
    }

    if (loader) {
      loader.classList.add("hidden")
    }
  }, 300)
}

// Rendre la fonction globale
window.filtrerProduits = filtrerProduits
