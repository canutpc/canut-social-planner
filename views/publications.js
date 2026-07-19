function afficherPublications() {
    return `
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2>Mes Publications 📝</h2>
                <p class="text-muted mb-0">Rédigez, générez et planifiez vos posts Facebook.</p>
            </div>
            <button class="btn btn-primary fw-bold shadow-sm" id="btn-nouvelle-pub">
                <i class="bi bi-plus-lg me-2"></i>Nouveau post
            </button>
        </header>

        <!-- Formulaire caché par défaut -->
        <div class="card p-4 shadow-sm bg-white border-0 rounded-3 mb-4 d-none" id="form-container">
            <h5 class="mb-3 fw-bold text-secondary border-bottom pb-2">Créer / Modifier une publication</h5>
            <form id="form-publication">
                <input type="hidden" id="pub-id">
                
                <div class="row">
                    <div class="col-md-8 mb-3">
                        <label class="form-label fw-semibold">Titre de la publication (en interne)</label>
                        <div class="input-group">
                            <input type="text" id="pub-titre" class="form-control" required placeholder="Ex: Astuce pour nettoyer son clavier">
                            <button type="button" class="btn btn-warning fw-bold" id="btn-generer-ia">
                                <i class="bi bi-magic me-1"></i> Rédiger avec l'IA
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label fw-semibold">Date</label>
                        <input type="date" id="pub-date" class="form-control" required>
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label fw-semibold">Heure</label>
                        <input type="time" id="pub-heure" class="form-control" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold">Texte pour Facebook</label>
                    <textarea id="pub-texte" class="form-control" rows="5" required placeholder="Tapez votre texte ou utilisez le bouton magique..."></textarea>
                </div>

                <div class="mb-4">
                    <label class="form-label fw-semibold">Hashtags (séparés par des virgules)</label>
                    <input type="text" id="pub-hashtags" class="form-control" placeholder="informatique, astuce, canutpc">
                </div>

                <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-light" id="btn-annuler">Annuler</button>
                    <button type="submit" class="btn btn-success fw-bold">Enregistrer la planification</button>
                </div>
            </form>
        </div>

        <!-- Liste des publications -->
        <div class="row" id="liste-publications">
            <!-- Injecté par JS -->
        </div>
    `;
}

function initialiserEvenementsPublications() {
    const btnNouvelle = document.getElementById("btn-nouvelle-pub");
    const formContainer = document.getElementById("form-container");
    const form = document.getElementById("form-publication");
    const btnAnnuler = document.getElementById("btn-annuler");
    const btnGenererIA = document.getElementById("btn-generer-ia");

    // Afficher le formulaire
    btnNouvelle.addEventListener("click", () => {
        form.reset();
        document.getElementById("pub-id").value = "";
        formContainer.classList.remove("d-none");
    });

    // Cacher le formulaire
    btnAnnuler.addEventListener("click", () => {
        formContainer.classList.add("d-none");
    });

    // ÉVÉNEMENT : ASSISTANT IA MAGIQUE
    btnGenererIA.addEventListener("click", () => {
        const titre = document.getElementById("pub-titre").value.trim();
        const champTexte = document.getElementById("pub-texte");
        const champHashtags = document.getElementById("pub-hashtags");
        
        if (!titre) {
            alert("⚠️ Veuillez d'abord taper un sujet ou un titre pour que l'IA s'en inspire !");
            return;
        }

        // Effet visuel de chargement
        btnGenererIA.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Rédaction...`;
        btnGenererIA.disabled = true;

        // Simulation du temps de réflexion de l'IA (1.5 secondes)
        setTimeout(() => {
            const accroches = [
                "Vous en avez marre des problèmes informatiques ? 🤯",
                "Aujourd'hui chez CANUT PC, on vous partage notre meilleur secret ! 🤫",
                "C'est la question que tout le monde nous pose en boutique. 👇",
                "Attention, cette astuce va changer votre vie numérique ! ✨"
            ];
            
            const conclusions = [
                "Passez nous voir en boutique si vous avez besoin d'aide ! 🛠️",
                "Partagez cette astuce à un ami qui en aurait bien besoin. 🔄",
                "Un doute ? CANUT PC est là pour vous accompagner. 🤝",
                "N'hésitez pas à nous poser vos questions en commentaire ! 💬"
            ];

            const accrocheHasard = accroches[Math.floor(Math.random() * accroches.length)];
            const conclusionHasard = conclusions[Math.floor(Math.random() * conclusions.length)];

            champTexte.value = `${accrocheHasard}\n\nSujet du jour : ${titre.toUpperCase()}\n\n[L'IA a préparé cette trame. Vous pouvez développer votre conseil ici, expliquer comment faire, ou décrire le service que vous proposez pour ce problème...]\n\n${conclusionHasard}`;
            
            // Génération de hashtags basés sur les mots du titre
            const motsCles = titre.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(m => m.length > 3);
            champHashtags.value = ["canutpc", "informatique", "lyon", ...motsCles].join(", ");

            // Rétablir le bouton
            btnGenererIA.innerHTML = `<i class="bi bi-magic me-1"></i> Rédiger avec l'IA`;
            btnGenererIA.disabled = false;
        }, 1500);
    });

    // Sauvegarder (Création ou Modification)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const id = document.getElementById("pub-id").value;
        const titre = document.getElementById("pub-titre").value;
        const date = document.getElementById("pub-date").value;
        const heure = document.getElementById("pub-heure").value;
        const texte = document.getElementById("pub-texte").value;
        const hashtagsTexte = document.getElementById("pub-hashtags").value;
        
        const hashtags = hashtagsTexte.split(",").map(tag => tag.trim().replace(/^#/, '')).filter(tag => tag !== "");

        const nouvellePub = {
            id: id || "pub_" + Date.now(),
            titre, date, heure, texte, hashtags
        };

        let publications = JSON.parse(localStorage.getItem("canut_publications")) || [];

        if (id) {
            const index = publications.findIndex(p => p.id === id);
            if (index !== -1) publications[index] = nouvellePub;
        } else {
            publications.push(nouvellePub);
        }

        localStorage.setItem("canut_publications", JSON.stringify(publications));
        
        formContainer.classList.add("d-none");
        afficherListePublications();
    });

    afficherListePublications();
}

function afficherListePublications() {
    const listDiv = document.getElementById("liste-publications");
    let publications = JSON.parse(localStorage.getItem("canut_publications")) || [];

    // Trier de la plus récente à la plus ancienne
    publications.sort((a, b) => new Date(`${b.date}T${b.heure}`) - new Date(`${a.date}T${a.heure}`));

    if (publications.length === 0) {
        listDiv.innerHTML = `<div class="col-12"><p class="text-muted text-center my-4">Aucune publication planifiée.</p></div>`;
        return;
    }

    listDiv.innerHTML = publications.map(pub => {
        const dateFormatee = new Date(pub.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
        const hashtagsHtml = pub.hashtags.map(tag => `<span class="badge bg-light text-primary border me-1">#${tag}</span>`).join("");

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm border-0 bg-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold text-dark mb-0">${pub.titre}</h5>
                            <span class="badge bg-primary text-white"><i class="bi bi-clock me-1"></i>${pub.heure}</span>
                        </div>
                        <h6 class="card-subtitle mb-3 text-muted small">${dateFormatee}</h6>
                        <p class="card-text text-secondary bg-light p-3 rounded" style="font-size: 0.9rem; white-space: pre-wrap;">${pub.texte}</p>
                        <div class="mb-3">${hashtagsHtml}</div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 pt-0 d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="modifierPublication('${pub.id}')">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="supprimerPublication('${pub.id}')">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

window.supprimerPublication = function(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
        let publications = JSON.parse(localStorage.getItem("canut_publications")) || [];
        publications = publications.filter(p => p.id !== id);
        localStorage.setItem("canut_publications", JSON.stringify(publications));
        afficherListePublications();
    }
};

window.modifierPublication = function(id) {
    let publications = JSON.parse(localStorage.getItem("canut_publications")) || [];
    const pub = publications.find(p => p.id === id);

    if (pub) {
        document.getElementById("pub-id").value = pub.id;
        document.getElementById("pub-titre").value = pub.titre;
        document.getElementById("pub-date").value = pub.date;
        document.getElementById("pub-heure").value = pub.heure;
        document.getElementById("pub-texte").value = pub.texte;
        document.getElementById("pub-hashtags").value = pub.hashtags.join(", ");
        
        document.getElementById("form-container").classList.remove("d-none");
        window.scrollTo(0, 0);
    }
};