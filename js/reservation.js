// Système de gestion des réservations
class ReservationManager {
  constructor() {
    this.form = document.getElementById("reservationForm")
    this.init()
  }

  init() {
    this.configurerDateMinimum()
    this.configurerEventListeners()
    this.configurerValidation()
  }

  configurerDateMinimum() {
    // Définir la date minimum à aujourd'hui
    const dateInput = document.getElementById("date")
    if (dateInput) {
      const aujourd = new Date()
      const dateMin = aujourd.toISOString().split("T")[0]
      dateInput.min = dateMin

      // Définir la date maximum à 3 mois
      const dateMax = new Date()
      dateMax.setMonth(dateMax.getMonth() + 3)
      dateInput.max = dateMax.toISOString().split("T")[0]
    }
  }

  configurerEventListeners() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.gererSoumission(e))
    }

    // Validation en temps réel
    const champs = this.form.querySelectorAll("input, select, textarea")
    champs.forEach((champ) => {
      champ.addEventListener("blur", () => this.validerChamp(champ))
      champ.addEventListener("input", () => this.supprimerErreur(champ))
    })

    // Gestion du nombre de personnes
    const personnesSelect = document.getElementById("personnes")
    if (personnesSelect) {
      personnesSelect.addEventListener("change", (e) => {
        if (e.target.value === "9+") {
          this.afficherMessageGroupeImportant()
        }
      })
    }
  }

  configurerValidation() {
    // Validation personnalisée pour le téléphone
    const telephoneInput = document.getElementById("telephone")
    if (telephoneInput) {
      telephoneInput.addEventListener("input", (e) => {
        // Formater le numéro automatiquement
        let value = e.target.value.replace(/\D/g, "")
        if (value.startsWith("225")) {
          value = "+" + value
        } else if (value.startsWith("0")) {
          value = "+225 " + value
        }
        e.target.value = value
      })
    }
  }

  async gererSoumission(e) {
    e.preventDefault()

    if (!this.validerFormulaire()) {
      return
    }

    this.afficherChargement()

    try {
      // Simuler l'envoi de la réservation
      await this.envoyerReservation()
      this.afficherConfirmation()
    } catch (error) {
      this.afficherErreur("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      this.masquerChargement()
    }
  }

  validerFormulaire() {
    let estValide = true
    const champsRequis = this.form.querySelectorAll("[required]")

    champsRequis.forEach((champ) => {
      if (!this.validerChamp(champ)) {
        estValide = false
      }
    })

    // Validation spécifique de la date
    const dateInput = document.getElementById("date")
    if (dateInput && dateInput.value) {
      const dateSelectionnee = new Date(dateInput.value)
      const aujourd = new Date()
      aujourd.setHours(0, 0, 0, 0)

      if (dateSelectionnee < aujourd) {
        this.afficherErreurChamp(dateInput, "La date ne peut pas être dans le passé")
        estValide = false
      }
    }

    // Validation de l'heure selon la date
    if (estValide) {
      estValide = this.validerHeureSelonDate()
    }

    return estValide
  }

  validerChamp(champ) {
    const valeur = champ.value.trim()
    let estValide = true
    let messageErreur = ""

    // Vérifier si le champ est requis
    if (champ.hasAttribute("required") && !valeur) {
      messageErreur = "Ce champ est obligatoire"
      estValide = false
    } else if (valeur) {
      // Validations spécifiques selon le type
      switch (champ.type) {
        case "email":
          if (!this.validerEmail(valeur)) {
            messageErreur = "Adresse email invalide"
            estValide = false
          }
          break
        case "tel":
          if (!this.validerTelephone(valeur)) {
            messageErreur = "Numéro de téléphone invalide"
            estValide = false
          }
          break
      }
    }

    if (estValide) {
      this.afficherSuccesChamp(champ)
    } else {
      this.afficherErreurChamp(champ, messageErreur)
    }

    return estValide
  }

  validerEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  validerTelephone(telephone) {
    // Accepter les formats ivoiriens
    const regex = /^(\+225|0)[0-9\s-]{8,}$/
    return regex.test(telephone)
  }

  validerHeureSelonDate() {
    const dateInput = document.getElementById("date")
    const heureSelect = document.getElementById("heure")

    if (!dateInput.value || !heureSelect.value) return true

    const dateSelectionnee = new Date(dateInput.value)
    const aujourd = new Date()

    // Si c'est aujourd'hui, vérifier que l'heure n'est pas passée
    if (dateSelectionnee.toDateString() === aujourd.toDateString()) {
      const heureActuelle = aujourd.getHours()
      const minuteActuelle = aujourd.getMinutes()
      const [heureReservation, minuteReservation] = heureSelect.value.split(":").map(Number)

      if (
        heureReservation < heureActuelle ||
        (heureReservation === heureActuelle && minuteReservation <= minuteActuelle)
      ) {
        this.afficherErreurChamp(heureSelect, "Cette heure est déjà passée")
        return false
      }
    }

    return true
  }

  afficherErreurChamp(champ, message) {
    const formGroup = champ.closest(".form-group")
    formGroup.classList.remove("success")
    formGroup.classList.add("error")

    let messageElement = formGroup.querySelector(".error-message")
    if (!messageElement) {
      messageElement = document.createElement("div")
      messageElement.className = "error-message"
      formGroup.appendChild(messageElement)
    }
    messageElement.textContent = message
  }

  afficherSuccesChamp(champ) {
    const formGroup = champ.closest(".form-group")
    formGroup.classList.remove("error")
    formGroup.classList.add("success")

    const messageElement = formGroup.querySelector(".error-message")
    if (messageElement) {
      messageElement.remove()
    }
  }

  supprimerErreur(champ) {
    const formGroup = champ.closest(".form-group")
    formGroup.classList.remove("error")

    const messageElement = formGroup.querySelector(".error-message")
    if (messageElement) {
      messageElement.remove()
    }
  }

  afficherMessageGroupeImportant() {
    const message = `
            Pour les groupes de 9 personnes ou plus, nous recommandons de nous contacter directement 
            au +225 07 XX XX XX XX pour organiser au mieux votre réservation.
        `

    if (confirm(message + "\n\nSouhaitez-vous continuer avec le formulaire ou préférez-vous nous appeler ?")) {
      // Continuer avec le formulaire
    } else {
      // Rediriger vers la page de contact ou ouvrir l'application téléphone
      window.location.href = "tel:+22507XXXXXXXX"
    }
  }

  async envoyerReservation() {
    // Simuler un délai d'envoi
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Ici, vous intégreriez l'envoi réel vers votre backend
    const donneesReservation = new FormData(this.form)
    const reservation = Object.fromEntries(donneesReservation)

    // Sauvegarder localement pour la démo
    this.sauvegarderReservation(reservation)

    return reservation
  }

  sauvegarderReservation(reservation) {
    const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
    reservation.id = Date.now().toString()
    reservation.statut = "en_attente"
    reservation.dateCreation = new Date().toISOString()

    reservations.push(reservation)
    localStorage.setItem("reservations", JSON.stringify(reservations))
  }

  afficherChargement() {
    this.form.classList.add("form-loading")
    const submitBtn = this.form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...'
    }
  }

  masquerChargement() {
    this.form.classList.remove("form-loading")
    const submitBtn = this.form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirmer la réservation'
    }
  }

  afficherConfirmation() {
    const modal = document.getElementById("modalConfirmationReservation")
    const detailsContainer = document.getElementById("reservationDetails")

    // Remplir les détails de la réservation
    const formData = new FormData(this.form)
    const details = this.creerDetailsReservation(formData)
    detailsContainer.innerHTML = details

    // Afficher le modal
    modal.classList.add("show")

    // Configurer les boutons
    this.configurerBoutonsConfirmation()
  }

  creerDetailsReservation(formData) {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    const formatHeure = (heureStr) => {
      return heureStr.replace(":", "h")
    }

    return `
            <div class="detail-row">
                <span class="detail-label">Nom:</span>
                <span class="detail-value">${formData.get("prenom")} ${formData.get("nom")}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formatDate(formData.get("date"))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Heure:</span>
                <span class="detail-value">${formatHeure(formData.get("heure"))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Personnes:</span>
                <span class="detail-value">${formData.get("personnes")} ${formData.get("personnes") === "1" ? "personne" : "personnes"}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${formData.get("email")}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Téléphone:</span>
                <span class="detail-value">${formData.get("telephone")}</span>
            </div>
            ${
              formData.get("occasion")
                ? `
                <div class="detail-row">
                    <span class="detail-label">Occasion:</span>
                    <span class="detail-value">${formData.get("occasion")}</span>
                </div>
            `
                : ""
            }
        `
  }

  configurerBoutonsConfirmation() {
    const fermerBtn = document.getElementById("fermerConfirmation")
    const nouvelleBtn = document.getElementById("nouvelleReservation")

    fermerBtn.onclick = () => {
      document.getElementById("modalConfirmationReservation").classList.remove("show")
      window.location.href = "index.html"
    }

    nouvelleBtn.onclick = () => {
      document.getElementById("modalConfirmationReservation").classList.remove("show")
      this.reinitialiserFormulaire()
    }
  }

  reinitialiserFormulaire() {
    this.form.reset()

    // Supprimer les classes de validation
    const formGroups = this.form.querySelectorAll(".form-group")
    formGroups.forEach((group) => {
      group.classList.remove("error", "success")
      const errorMessage = group.querySelector(".error-message")
      if (errorMessage) {
        errorMessage.remove()
      }
    })

    // Remettre la date minimum
    this.configurerDateMinimum()
  }

  afficherErreur(message) {
    alert(message) // Pour la démo, remplacer par une notification plus élégante
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new ReservationManager()
})
