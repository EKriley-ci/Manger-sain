// ✅ SYSTÈME DE PANIER UNIFIÉ ET CORRIGÉ
class PanierIntegration {
  constructor() {
    this.panierManager = null
    this.init()
  }

  init() {
    // Attendre que les produits soient chargés
    document.addEventListener("produitsCharges", () => {
      console.log("📦 Produits chargés, intégration du panier...")
      this.integrerBoutonsPanier()
    })

    // Fallback si l'événement n'est pas déclenché
    setTimeout(() => {
      this.integrerBoutonsPanier()
    }, 2000)

    this.ajouterLienPanier()
    this.initialiserBadgePanier()
    this.configurerObserver()
  }

  configurerObserver() {
    // Observer pour détecter les nouveaux produits ajoutés dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const nouveauxProduits = Array.from(mutation.addedNodes).filter(
            (node) => node.nodeType === 1 && node.classList && node.classList.contains("product-carte"),
          )

          if (nouveauxProduits.length > 0) {
            console.log(`🔄 ${nouveauxProduits.length} nouveaux produits détectés`)
            this.integrerBoutonsSpecifiques(nouveauxProduits)
          }
        }
      })
    })

    // Observer les conteneurs de produits
    const containers = [document.querySelector(".popular-product"), document.querySelector(".products-container")]

    containers.forEach((container) => {
      if (container) {
        observer.observe(container, { childList: true, subtree: true })
      }
    })
  }

  integrerBoutonsPanier() {
    const boutonsCommande = document.querySelectorAll(".order-btn")
    console.log(`🛒 Trouvé ${boutonsCommande.length} boutons de commande`)

    if (boutonsCommande.length === 0) {
      console.warn("⚠️ Aucun bouton .order-btn trouvé")
      return
    }

    const productCartes = Array.from(boutonsCommande)
      .map((btn) => btn.closest(".product-carte"))
      .filter((carte) => carte !== null)

    this.integrerBoutonsSpecifiques(productCartes)
  }

  integrerBoutonsSpecifiques(productCartes) {
    productCartes.forEach((productCarte) => {
      if (!productCarte) return

      const bouton = productCarte.querySelector(".order-btn")
      if (!bouton || bouton.dataset.panierIntegre) return

      // Marquer comme intégré
      bouton.dataset.panierIntegre = "true"

      // Extraire les informations du produit
      const nom = productCarte.querySelector(".product-name, h3")?.textContent?.trim()
      const prixElement = productCarte.querySelector('#price, .product-price, [id*="price"]')
      const prixText = prixElement?.textContent || "0"
      const prix = Number.parseInt(prixText.replace(/\D/g, "")) || 0
      const image = productCarte.querySelector("img")?.src || "/placeholder.svg?height=300&width=300"

      if (!nom || prix <= 0) {
        console.warn("⚠️ Produit invalide:", { nom, prix })
        return
      }

      console.log("✅ Produit intégré:", { nom, prix, image })

      // Configurer le bouton
      bouton.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const produit = {
          id: this.generateProductId(nom),
          nom: nom,
          prix: prix,
          image: image,
        }

        this.ajouterAuPanier(produit)
      }

      // Changer le texte du bouton
      if (this.isFontAwesomeLoaded()) {
        bouton.innerHTML = '<i class="fas fa-cart-plus"></i>Commander'
      } else {
        bouton.innerHTML = "🛒Commander"
      }
    })
  }

  ajouterAuPanier(produit) {
    console.log("🛒 Ajout au panier:", produit)

    // Initialiser le manager si nécessaire
    if (!this.panierManager) {
      this.panierManager = new PanierManager()
    }

    this.panierManager.ajouterAuPanier(produit)
  }

  generateProductId(nom) {
    return nom
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  isFontAwesomeLoaded() {
    return (
      document.querySelector('link[href*="font-awesome"]') ||
      window.FontAwesome ||
      document.querySelector("i.fas, i.far, i.fab")
    )
  }

  ajouterLienPanier() {
    // Ajouter le lien panier au menu PC
    const navUl = document.querySelector("header .pc-menu nav ul")

    if (navUl && !document.querySelector(".panier-link-pc")) {
      const panierLi = document.createElement("li")
      panierLi.innerHTML = `
                <a href="panier.html" class="panier-link panier-link-pc">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Panier</span>
                    <span class="cart-badge" id="panierBadgePC">0</span>
                </a>
            `
      navUl.appendChild(panierLi)
    }
  }

  initialiserBadgePanier() {
    const panier = JSON.parse(localStorage.getItem("panier") || "[]")
    const totalItems = panier.reduce((total, item) => total + (item.quantite || 0), 0)

    // Mettre à jour tous les badges
    const badges = document.querySelectorAll("#panierBadge, #panierBadgePC")
    badges.forEach((badge) => {
      if (badge) {
        badge.textContent = totalItems
        badge.style.display = totalItems > 0 ? "flex" : "none"
      }
    })
  }
}

// ✅ GESTIONNAIRE DE PANIER SIMPLIFIÉ POUR L'INTÉGRATION
class PanierManager {
  constructor() {
    this.panier = this.chargerPanier()
  }

  chargerPanier() {
    const panierStock = localStorage.getItem("panier")
    return panierStock ? JSON.parse(panierStock) : []
  }

  sauvegarderPanier() {
    localStorage.setItem("panier", JSON.stringify(this.panier))
    this.mettreAJourBadge()
  }

  ajouterAuPanier(produit) {
    const articleExistant = this.panier.find((item) => item.id === produit.id)

    if (articleExistant) {
      articleExistant.quantite += 1
    } else {
      this.panier.push({
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.image,
        quantite: 1,
      })
    }

    this.sauvegarderPanier()
    this.afficherNotificationAjout(produit.nom)
  }

  mettreAJourBadge() {
    const totalItems = this.panier.reduce((total, item) => total + item.quantite, 0)
    const badges = document.querySelectorAll("#panierBadge, #panierBadgePC")

    badges.forEach((badge) => {
      if (badge) {
        badge.textContent = totalItems
        badge.style.display = totalItems > 0 ? "flex" : "none"
      }
    })
  }

  afficherNotificationAjout(nomProduit) {
    // Supprimer les notifications existantes
    document.querySelectorAll(".notification-ajout").forEach((n) => n.remove())

    const notification = document.createElement("div")
    notification.className = "notification-ajout"
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span>${nomProduit} ajouté au panier</span>
            </div>
        `

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `

    document.body.appendChild(notification)

    // Animation
    setTimeout(() => (notification.style.transform = "translateX(0)"), 100)
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
}

// ✅ STYLES CSS POUR LE PANIER
const panierStyles = document.createElement("style")
panierStyles.textContent = `
    .panier-link {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        padding: 0.5rem 1rem !important;
        background: #F9B233 !important;
        color: white !important;
        border-radius: 25px !important;
        text-decoration: none !important;
        font-weight: bold !important;
        transition: all 0.3s ease !important;
        font-size: 0.9rem !important;
    }

    .panier-link:hover {
        background: #C78E28 !important;
        color: white !important;
        transform: translateY(-2px) !important;
    }

    .cart-badge {
        position: absolute !important;
        top: -8px !important;
        right: -8px !important;
        background: #dc3545 !important;
        color: white !important;
        border-radius: 50% !important;
        width: 20px !important;
        height: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 0.75rem !important;
        font-weight: bold !important;
        min-width: 20px !important;
    }

    .order-btn i {
        margin-right: 0.5rem;
    }

    .error-message, .empty-message {
        text-align: center;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 10px;
        margin: 1rem;
    }

    .error-message p, .empty-message p {
        margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
        .panier-link-pc {
            display: none !important;
        }
    }
`
document.head.appendChild(panierStyles)

// ✅ INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initialisation du système de panier...")
  window.panierIntegration = new PanierIntegration()
})
