// Système de gestion du panier
class PanierManager {
  constructor() {
    this.panier = this.chargerPanier()
    this.init()
  }

  init() {
    this.afficherPanier()
    this.configurerEventListeners()
    this.mettreAJourBadge()
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
    this.afficherPanier()
    this.afficherNotificationAjout(produit.nom)
  }

  supprimerDuPanier(id) {
    this.panier = this.panier.filter((item) => item.id !== id)
    this.sauvegarderPanier()
    this.afficherPanier()
  }

  modifierQuantite(id, nouvelleQuantite) {
    const article = this.panier.find((item) => item.id === id)
    if (article && nouvelleQuantite > 0) {
      article.quantite = nouvelleQuantite
    } else if (nouvelleQuantite === 0) {
      this.supprimerDuPanier(id)
      return
    }
    this.sauvegarderPanier()
    this.afficherPanier()
  }

  viderPanier() {
    this.panier = []
    this.sauvegarderPanier()
    this.afficherPanier()
  }

  calculerSousTotal() {
    return this.panier.reduce((total, item) => total + item.prix * item.quantite, 0)
  }

  calculerTotal() {
    const sousTotal = this.calculerSousTotal()
    const fraisLivraison = sousTotal > 0 ? 500 : 0
    return sousTotal + fraisLivraison
  }

  afficherPanier() {
    const panierVide = document.getElementById("panierVide")
    const panierArticles = document.getElementById("panierArticles")
    const commandeResume = document.getElementById("commandeResume")

    if (this.panier.length === 0) {
      panierVide.style.display = "block"
      panierArticles.style.display = "none"
      commandeResume.style.display = "none"
    } else {
      panierVide.style.display = "none"
      panierArticles.style.display = "block"
      commandeResume.style.display = "block"

      // Afficher les articles
      panierArticles.innerHTML = this.panier.map((item) => this.creerArticleHTML(item)).join("")

      // Mettre à jour le résumé
      this.mettreAJourResume()
    }
  }

  creerArticleHTML(item) {
    return `
            <div class="article-carte" data-id="${item.id}">
                <div class="article-image">
                    <img src="${item.image}" alt="${item.nom}" loading="lazy">
                </div>
                <div class="article-details">
                    <h4>${item.nom}</h4>
                    <div class="article-prix">${item.prix}</div>
                    <div class="quantite-controls">
                        <button class="btn-quantite" onclick="panierManager.modifierQuantite('${item.id}', ${item.quantite - 1})" ${item.quantite <= 1 ? "disabled" : ""}>
                            -
                        </button>
                        <input type="number" class="quantite-input" value="${item.quantite}" 
                               onchange="panierManager.modifierQuantite('${item.id}', parseInt(this.value))" min="1">
                        <button class="btn-quantite" onclick="panierManager.modifierQuantite('${item.id}', ${item.quantite + 1})">
                            +
                        </button>
                    </div>
                </div>
                <button class="btn-supprimer" onclick="panierManager.supprimerDuPanier('${item.id}')">
                    Supprimer
                </button>
            </div>
        `
  }

  mettreAJourResume() {
    const sousTotal = this.calculerSousTotal()
    const total = this.calculerTotal()
    const fraisLivraison = sousTotal > 0 ? 500 : 0

    document.getElementById("sousTotal").textContent = `${sousTotal} FCFA`
    document.getElementById("fraisLivraison").textContent = `${fraisLivraison} FCFA`
    document.getElementById("total").textContent = `${total} FCFA`
  }

  mettreAJourBadge() {
    const badge = document.getElementById("panierBadge")
    const totalItems = this.panier.reduce((total, item) => total + item.quantite, 0)

    if (badge) {
      badge.textContent = totalItems
      badge.style.display = totalItems > 0 ? "flex" : "none"
    }
  }

  afficherNotificationAjout(nomProduit) {
    // Créer une notification temporaire
    const notification = document.createElement("div")
    notification.className = "notification-ajout"
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span>${nomProduit} ajouté au panier</span>
            </div>
        `

    // Ajouter les styles
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

    // Animation d'apparition
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Suppression automatique
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  configurerEventListeners() {
    // Bouton commander
    const btnCommander = document.getElementById("btnCommander")
    if (btnCommander) {
      btnCommander.addEventListener("click", () => this.ouvrirModalCommande())
    }

    // Modal de commande
    this.configurerModalCommande()
  }

  ouvrirModalCommande() {
    if (this.panier.length === 0) {
      alert("Votre panier est vide !")
      return
    }

    const modal = document.getElementById("modalCommande")
    modal.classList.add("show")
  }

  fermerModalCommande() {
    const modal = document.getElementById("modalCommande")
    modal.classList.remove("show")

    // Réinitialiser l'état du modal
    document.getElementById("qrScanner").style.display = "none"
    document.getElementById("livraisonForm").style.display = "none"
    document.querySelector(".options-service").style.display = "block"

    // Retirer les classes actives
    document.querySelectorAll(".option-card").forEach((card) => {
      card.classList.remove("active")
    })
  }

  configurerModalCommande() {
    // Fermeture du modal
    const closeModal = document.getElementById("closeModal")
    if (closeModal) {
      closeModal.addEventListener("click", () => this.fermerModalCommande())
    }

    // Clic en dehors du modal
    const modal = document.getElementById("modalCommande")
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.fermerModalCommande()
        }
      })
    }

    // Options de service
    this.configurerOptionsService()
  }

  configurerOptionsService() {
    // Option service à table
    const optionTable = document.getElementById("optionTable")
    if (optionTable) {
      optionTable.addEventListener("click", () => {
        this.selectionnerOption("table")
        this.afficherQRScanner()
      })
    }

    // Option livraison
    const optionLivraison = document.getElementById("optionLivraison")
    if (optionLivraison) {
      optionLivraison.addEventListener("click", () => {
        this.selectionnerOption("livraison")
        this.afficherFormulaireLivraison()
      })
    }

    // Confirmer table avec QR
    const confirmerTable = document.getElementById("confirmerTable")
    if (confirmerTable) {
      confirmerTable.addEventListener("click", () => {
        this.confirmerCommandeTable()
      })
    }

    // Formulaire de livraison
    const formLivraison = document.getElementById("formLivraison")
    if (formLivraison) {
      formLivraison.addEventListener("submit", (e) => {
        e.preventDefault()
        this.confirmerCommandeLivraison()
      })
    }
  }

  selectionnerOption(type) {
    document.querySelectorAll(".option-card").forEach((card) => {
      card.classList.remove("active")
    })

    if (type === "table") {
      document.getElementById("optionTable").classList.add("active")
    } else {
      document.getElementById("optionLivraison").classList.add("active")
    }
  }

  afficherQRScanner() {
    document.querySelector(".options-service").style.display = "none"
    document.getElementById("qrScanner").style.display = "block"

    // Générer un QR code de démonstration
    this.genererQRCodeDemo()
  }

  afficherFormulaireLivraison() {
    document.querySelector(".options-service").style.display = "none"
    document.getElementById("livraisonForm").style.display = "block"
  }

  genererQRCodeDemo() {
    // Pour la démo, on utilise un placeholder QR code
    const qrCodeDemo = document.getElementById("qrCodeDemo")
    if (qrCodeDemo) {
      // On peut utiliser un service de génération de QR code ou un placeholder
      qrCodeDemo.src = "/placeholder.svg?height=200&width=200&text=TABLE-5-QR"
    }
  }

  confirmerCommandeTable() {
    const numeroCommande = this.genererNumeroCommande()
    const message = `Votre commande sera servie à la Table 5. Notre équipe sera informée dans quelques instants.`

    this.finaliserCommande(numeroCommande, message)
  }

  confirmerCommandeLivraison() {
    const nom = document.getElementById("nom").value
    const telephone = document.getElementById("telephone").value
    const adresse = document.getElementById("adresse").value

    if (!nom || !telephone || !adresse) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }

    const numeroCommande = this.genererNumeroCommande()
    const message = `Votre commande sera livrée à l'adresse indiquée dans 30-45 minutes. Nous vous contacterons au ${telephone}.`

    this.finaliserCommande(numeroCommande, message)
  }

  genererNumeroCommande() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `MS${timestamp.toString().slice(-6)}${random.toString().padStart(3, "0")}`
  }

  finaliserCommande(numeroCommande, message) {
    // Fermer le modal de commande
    this.fermerModalCommande()

    // Afficher le modal de confirmation
    this.afficherConfirmation(numeroCommande, message)

    // Vider le panier
    this.viderPanier()
  }

  afficherConfirmation(numeroCommande, message) {
    const modalConfirmation = document.getElementById("modalConfirmation")
    const messageConfirmation = document.getElementById("messageConfirmation")
    const numeroElement = document.getElementById("numeroCommande")

    messageConfirmation.textContent = message
    numeroElement.textContent = numeroCommande

    modalConfirmation.classList.add("show")

    // Configurer le bouton de continuer
    const continuerBtn = document.getElementById("continuerShopping")
    continuerBtn.onclick = () => {
      modalConfirmation.classList.remove("show")
      window.location.href = "plats.html"
    }
  }
}

// Fonction globale pour ajouter au panier (utilisée par les boutons de commande)
function ajouterAuPanier(produit) {
  if (window.panierManager) {
    window.panierManager.ajouterAuPanier(produit)
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  window.panierManager = new PanierManager()
})
