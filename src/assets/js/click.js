 document.addEventListener("DOMContentLoaded", function() {
        const profileBtn = document.getElementById('profile-btn');
        const profileMenu = document.getElementById('profile-menu');

        profileBtn.addEventListener('click', function() {
            // Basculer la classe 'show' pour afficher ou masquer le menu
            profileMenu.classList.toggle('show');
             console.log('SHOW.');
  // Mettre à jour l'état aria-expanded
            const expanded = profileBtn.getAttribute('aria-expanded') === 'true';
            profileBtn.setAttribute('aria-expanded', !expanded);
        });

        // Fermer le menu si l'utilisateur clique en dehors
        document.addEventListener('click', function(event) {
            if (!profileBtn.contains(event.target) && !profileMenu.contains(event.target)) {
                profileMenu.classList.remove('show');
                profileBtn.setAttribute('aria-expanded', 'false');
                console.log('HIDE.');
            }
        });
    });
