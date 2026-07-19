function afficherSubjects() {
    return `
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2>Banque de Sujets 💡</h2>
                <p class="text-muted mb-0">Stockez et piochez vos idées de posts pour CANUT PC.</p>
            </div>
            <button class="btn btn-warning fw-bold text-dark shadow-sm" id="btn-idee-aleatoire">
                <i class="bi bi-dice-5-fill me-2"></i>Idée aléatoire !
            </button>
        </header>

        <div id="zone-alerte-idee" class="mb-4"></div>

        <div class="row">
            <!-- Formulaire d'ajout de sujet -->
            <div class="col-md-4 mb-4">
                <div class="card p-3 shadow-sm bg-white border-0 rounded-3">
                    <h5 class="card-title mb-3 fw-bold text-warning">Ajouter une idée</h5>
                    <form id="form-sujet">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Sujet / Thématique</label>
                            <input type="text" id="sujet-texte" class="form-control" required placeholder="Ex: Raccourci Windows + L">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Catégorie</label>
                            <select id="sujet-categorie" class="form-select">
                                <option value="Tips">Tips 🛠️</option>
                                <option value="RetroNews">RetroNews ⏳</option>
                                <option value="Linux">Linux 🐧</option>
                                <option value="Arnaques">Arnaques ⚠️</option>
                                <option value="Le Saviez-vous ?">Le Saviez-vous ? 🤔</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-warning w-100 fw-bold text-dark">Ajouter à la banque</button>
                    </form>
                </div>
            </div>

            <!-- Liste des sujets -->
            <div class="col-md-8">
                <div class="card p-3 shadow-sm bg-white border-0 rounded-3">
                    <h5 class="card-title mb-3 fw-bold text-secondary">Votre catalogue d'idées</h5>
                    <div id="liste-sujets" class="list-group gap-2" style="max-height: 500px; overflow-y: auto;">
                        <!-- Injecté par JS -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initialiserEvenementsSubjects() {
    const form = document.getElementById("form-sujet");
    const btnAleatoire = document.getElementById("btn-idee-aleatoire");

    // Remplir le catalogue par défaut s'il n'y a rien
    verifierEtInitialiserSujetsParDefaut();

    // Événement : Ajouter un sujet
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const texte = document.getElementById("sujet-texte").value;
        const categorie = document.getElementById("sujet-categorie").value;

        const nouveauSujet = {
            id: "sujet_" + Date.now(),
            texte: texte,
            categorie: categorie
        };

        let sujets = JSON.parse(localStorage.getItem("canut_sujets")) || [];
        sujets.unshift(nouveauSujet); // Ajoute en haut de liste
        localStorage.setItem("canut_sujets", JSON.stringify(sujets));

        form.reset();
        afficherListeSujets();
    });

    // Événement : Idée aléatoire
    btnAleatoire.addEventListener("click", () => {
        const sujets = JSON.parse(localStorage.getItem("canut_sujets")) || [];
        const alerteDiv = document.getElementById("zone-alerte-idee");

        if (sujets.length === 0) return;

        const indexHasard = Math.floor(Math.random() * sujets.length);
        const idee = sujets[indexHasard];

        alerteDiv.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show border-0 shadow p-4" role="alert">
                <h5 class="alert-heading fw-bold"><i class="bi bi-lightbulb-fill me-2"></i>Sujet pioché au hasard :</h5>
                <p class="mb-2 fs-4">"${idee.texte}"</p>
                <span class="badge bg-dark mb-2">Catégorie : ${idee.categorie}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    });

    afficherListeSujets();
}

function afficherListeSujets() {
    const listDiv = document.getElementById("liste-sujets");
    const sujets = JSON.parse(localStorage.getItem("canut_sujets")) || [];

    if (sujets.length === 0) {
        listDiv.innerHTML = `<p class="text-muted text-center my-4">Aucune idée dans la banque.</p>`;
        return;
    }

    listDiv.innerHTML = sujets.map(sujet => {
        let badgeColor = "bg-secondary";
        if (sujet.categorie === "Tips") badgeColor = "bg-success";
        if (sujet.categorie === "RetroNews") badgeColor = "bg-primary";
        if (sujet.categorie === "Linux") badgeColor = "bg-dark";
        if (sujet.categorie === "Arnaques") badgeColor = "bg-danger";
        if (sujet.categorie === "Le Saviez-vous ?") badgeColor = "bg-info text-dark";

        return `
            <div class="list-group-item d-flex justify-content-between align-items-center border rounded-3 p-3 shadow-sm bg-light">
                <div>
                    <span class="badge ${badgeColor} mb-1">${sujet.categorie}</span>
                    <p class="mb-0 fw-bold text-dark">${sujet.texte}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="supprimerSujet('${sujet.id}')">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </div>
        `;
    }).join("");
}

function verifierEtInitialiserSujetsParDefaut() {
    let sujetsExistants = localStorage.getItem("canut_sujets");
    
    // Si la clé n'existe pas ou qu'elle est vide [], on met ton catalogue complet
    if (!sujetsExistants || JSON.parse(sujetsExistants).length === 0) {
        const catalogueInitial = [];
        const donneesBrutes = {
            "Tips": ["Phishing", "Sauvegardes", "SSD", "Wi-Fi", "Nettoyage", "Clavier", "Écran", "Windows + L", "Gestionnaire de mots de passe", "Raccourcis clavier"],
            "RetroNews": ["Disquettes", "Windows 95", "Clé USB", "Minitel", "Modem 56k", "MSN", "CD-ROM", "Premier virus", "Premier disque dur"],
            "Linux": ["Linux Mint", "Ubuntu", "Open Source", "LibreOffice", "Firefox", "Steam", "Mises à jour", "Sécurité"],
            "Arnaques": ["Faux colis", "Faux Microsoft", "Faux PayPal", "Faux CPF", "Faux QR Code", "Marketplace", "LeBonCoin", "Deepfake"],
            "Le Saviez-vous ?": ["Pourquoi AZERTY", "Pourquoi Bluetooth", "Pourquoi USB", "Pourquoi SSD", "Pourquoi 'bug'", "Pourquoi les touches F1-F12"]
        };

        let compteur = 0;
        for (const [categorie, listItems] of Object.entries(donneesBrutes)) {
            listItems.forEach(texte => {
                catalogueInitial.push({
                    id: `sujet_defaut_${compteur++}`,
                    texte: texte,
                    categorie: categorie
                });
            });
        }
        localStorage.setItem("canut_sujets", JSON.stringify(catalogueInitial));
    }
}

window.supprimerSujet = function(id) {
    if (confirm("Supprimer cette idée ?")) {
        let sujets = JSON.parse(localStorage.getItem("canut_sujets")) || [];
        sujets = sujets.filter(s => s.id !== id);
        localStorage.setItem("canut_sujets", JSON.stringify(sujets));
        afficherListeSujets();
    }
};