const MIN_TIME = 900

const loader = document.getElementById("loader")
const start = performance.now()

window.addEventListener("load", () => {
  const elapsed = performance.now() - start
  const delay = Math.max(0, MIN_TIME - elapsed)

  setTimeout(() => {
    loader.classList.add("hide")
  }, delay)
})

// ✅ CORRECTION : Observer pour les animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show")
    }
  })
})

document.querySelectorAll(".scroll-animation").forEach((el) => observer.observe(el))

// ✅ CORRECTION : Avis clients avec gestion d'erreur
const reviewContainer = document.querySelector(".client-content")
const reviewTemplate = document.getElementById("reviewTemplate")

// Données de démonstration si le fichier JSON n'existe pas
const clientsDemo = [
  {
    nom: "Aicha Koné",
    message: "Excellente cuisine ivoirienne ! Les saveurs sont authentiques et le service impeccable.",
    photo: "images/client/Aicha.png",
    date: "Entrepreneur",
  },
  {
    nom: "Mamadou Traoré",
    message: "Le meilleur attiéké de la ville ! Je recommande vivement ce restaurant.",
    photo: "images/client/Aicha.png",
    date: "Chef d'entreprise",
  },
  {
    nom: "Fatou Diabaté",
    message: "Ambiance chaleureuse et plats délicieux. Une vraie découverte culinaire !",
    photo: "images/client/Aicha.png",
    date: "Étudiante",
  },
]

if (reviewContainer && reviewTemplate) {
  // Essayer de charger le fichier JSON, sinon utiliser les données de démo
  fetch("./client.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fichier client.json non trouvé")
      }
      return response.json()
    })
    .then((data) => {
      const clients = data.clients || data
      afficherAvisClients(clients)
    })
    .catch((error) => {
      console.log("📝 Utilisation des avis clients de démonstration")
      afficherAvisClients(clientsDemo)
    })
}

function afficherAvisClients(clients) {
  if (!reviewContainer || !reviewTemplate) return

  clients.forEach((client) => {
    const clone = reviewTemplate.content.cloneNode(true)
    clone.querySelector(".message").textContent = client.message
    clone.querySelector("img").src = client.photo
    clone.querySelector("img").alt = client.nom
    clone.querySelector("strong").textContent = client.nom
    clone.querySelector(".date").textContent = client.date
    reviewContainer.appendChild(clone)
  })
}

// ✅ SLIDERS GÉNÉRIQUES AMÉLIORÉS
function createSimpleSlider({ containerSelector, prevBtnSelector, nextBtnSelector }) {
  const container = document.querySelector(containerSelector)
  const prevBtn = document.querySelector(prevBtnSelector)
  const nextBtn = document.querySelector(nextBtnSelector)

  if (!container || !prevBtn || !nextBtn) {
    console.warn(`⚠️ Slider non initialisé: ${containerSelector}`)
    return
  }

  nextBtn.addEventListener("click", () => {
    const firstChild = container.firstElementChild
    if (firstChild) {
      container.appendChild(firstChild)
    }
  })

  prevBtn.addEventListener("click", () => {
    const lastChild = container.lastElementChild
    if (lastChild) {
      container.insertBefore(lastChild, container.firstElementChild)
    }
  })

  console.log(`✅ Slider initialisé: ${containerSelector}`)
}

// ✅ INITIALISATION DES SLIDERS
document.addEventListener("DOMContentLoaded", () => {
  // Attendre un peu pour que les produits soient chargés
  setTimeout(() => {
    createSimpleSlider({
      containerSelector: ".popular-product",
      prevBtnSelector: "#prev",
      nextBtnSelector: "#next",
    })

    createSimpleSlider({
      containerSelector: ".client-content",
      prevBtnSelector: "#clientPrev",
      nextBtnSelector: "#clientNext",
    })

    createSimpleSlider({
      containerSelector: ".userContainer",
      prevBtnSelector: "#membersPrev",
      nextBtnSelector: "#membersNext",
    })
  }, 1000)
})
