document.addEventListener('DOMContentLoaded', () => {
    fetch('../members.json')
        .then(response => response.json())
        .then(data => {
            const membres = data.membres;
            const template = document.getElementById('membersTemplate');
            const containers = document.querySelectorAll('.userContainer');

            if (!template || containers.length === 0) {
                console.warn("Template ou container introuvable pour les membres.");
                return;
            }

            membres.forEach(membre => {
                const clone = template.content.cloneNode(true);
                clone.querySelector('img').src = membre.images;
                clone.querySelector('.members-name').textContent = membre.nom;
                clone.querySelector('.back').textContent = membre.desc;

                containers.forEach(container => {
                    container.appendChild(clone.cloneNode(true)); // Très important : clone à nouveau
                });
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des membres :", error);
        });
});
