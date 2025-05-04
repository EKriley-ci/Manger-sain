document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const lastNameInput = document.getElementById("lastName6");
    const sujetInput = document.getElementById("sujet");
    const messageInput = document.getElementById("message");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Empêche l'envoi par défaut
  
      // Réinitialisation des erreurs
      removeErrors();
  
      let hasError = false;
  
      if (nameInput.value.trim() === "") {
        showError(nameInput, "Le nom est requis");
        hasError = true;
      }
  
      if (lastNameInput.value.trim() === "") {
        showError(lastNameInput, "Le prénom est requis");
        hasError = true;
      }
  
      if (messageInput.value.trim().length < 10) {
        showError(messageInput, "Le message doit faire au moins 10 caractères");
        hasError = true;
      }
  
      if (!hasError) {
        alert("Message envoyé avec succès !");
        form.reset(); // Réinitialise le formulaire
      }
    });
  
    function showError(input, message) {
      const error = document.createElement("small");
      error.classList.add("error");
      error.textContent = message;
      input.classList.add("input-error");
      input.parentElement.appendChild(error);
    }
  
    function removeErrors() {
      document.querySelectorAll(".error").forEach(el => el.remove());
      document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    }
  });
  