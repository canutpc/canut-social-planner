document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const navLinks = document.querySelectorAll(".sidebar nav a");

    // Fonction pour injecter la bonne vue et gérer la classe active
    function changerVue(nomVue) {
        // 1. Injection du contenu HTML
        if (nomVue === "dashboard") {
            app.innerHTML = afficherDashboard();
        } else if (nomVue === "publications") {
            app.innerHTML = afficherPublications();
            if (typeof initialiserEvenementsPublications === "function") {
                initialiserEvenementsPublications();
            }
        } else if (nomVue === "subjects") {
            app.innerHTML = afficherSubjects();
            if (typeof initialiserEvenementsSubjects === "function") {
                initialiserEvenementsSubjects();
            }
        } else if (nomVue === "calendar") {
            app.innerHTML = afficherCalendar();
            if (typeof initialiserEvenementsCalendar === "function") {
                setTimeout(() => {
                    initialiserEvenementsCalendar();
                }, 10);
            }
        } else if (nomVue === "stats") {
            app.innerHTML = afficherStats();
            if (typeof initialiserEvenementsStats === "function") {
                initialiserEvenementsStats();
            }
        } else if (nomVue === "settings") {
            app.innerHTML = afficherSettings();
            if (typeof initialiserEvenementsSettings === "function") {
                initialiserEvenementsSettings();
            }
        } else {
            app.innerHTML = `<div class="container mt-4"><h2>Vue ${nomVue} en cours de développement... 🚧</h2></div>`;
        }

        // 2. Mise à jour visuelle de l'onglet actif (Sidebar)
        navLinks.forEach(link => link.classList.remove("active"));

        if (nomVue === "dashboard") {
            navLinks[0].classList.add("active");
        } else if (nomVue === "calendar") {
            navLinks[1].classList.add("active");
        } else if (nomVue === "publications") {
            navLinks[2].classList.add("active");
        } else if (nomVue === "subjects") {
            navLinks[3].classList.add("active");
        } else if (nomVue === "stats") {
            navLinks[4].classList.add("active");
        } else if (nomVue === "settings") {
            navLinks[5].classList.add("active");
        }
    }

    // Écouter les clics sur les liens en fonction de leur position (index)
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Empêche la page de se recharger

            if (index === 0) {
                changerVue("dashboard");
            } else if (index === 1) {
                changerVue("calendar");
            } else if (index === 2) {
                changerVue("publications");
            } else if (index === 3) {
                changerVue("subjects");
            } else if (index === 4) {
                changerVue("stats");
            } else if (index === 5) {
                changerVue("settings");
            }
        });
    });

    // Chargement initial au démarrage
    changerVue("dashboard");
});