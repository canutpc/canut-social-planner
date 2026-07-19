function afficherStats() {
    // 1. Récupération des données
    const publications = JSON.parse(localStorage.getItem("canut_publications")) || [];
    const sujets = JSON.parse(localStorage.getItem("canut_sujets")) || [];

    // 2. Calculs temporels (Passés vs Futurs)
    const maintenant = new Date();
    let postsPasses = 0;
    let postsFuturs = 0;

    publications.forEach(pub => {
        const datePub = new Date(`${pub.date}T${pub.heure}`);
        if (datePub < maintenant) {
            postsPasses++;
        } else {
            postsFuturs++;
        }
    });

    // 3. Calculs des Catégories les plus utilisées
    // (Puisqu'on n'a pas encore le lien direct sujet-publication, on se base sur les idées en stock)
    const categoriesIdees = {};
    sujets.forEach(s => {
        categoriesIdees[s.categorie] = (categoriesIdees[s.categorie] || 0) + 1;
    });

    // Génération des barres de progression pour les catégories d'idées
    let htmlCategories = "";
    if (sujets.length > 0) {
        Object.entries(categoriesIdees).forEach(([cat, count]) => {
            const pourcentage = Math.round((count / sujets.length) * 100);
            let colorClass = "bg-secondary";
            if (cat === "Tips") colorClass = "bg-success";
            if (cat === "RetroNews") colorClass = "bg-primary";
            if (cat === "Linux") colorClass = "bg-dark";
            if (cat === "Arnaques") colorClass = "bg-danger";
            if (cat === "Le Saviez-vous ?") colorClass = "bg-info text-dark";

            htmlCategories += `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-semibold">${cat}</span>
                        <span class="text-muted">${count} idée(s) (${pourcentage}%)</span>
                    </div>
                    <div class="progress" style="height: 10px;">
                        <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${pourcentage}%"></div>
                    </div>
                </div>
            `;
        });
    } else {
        htmlCategories = `<p class="text-muted text-center my-3">Aucune idée en réserve pour le moment.</p>`;
    }

    // 4. Qualité des publications (Hashtags)
    let postsAvecHashtags = 0;
    publications.forEach(pub => {
        if (pub.hashtags && pub.hashtags.length > 0) {
            postsAvecHashtags++;
        }
    });
    const pourcentHashtags = publications.length > 0 ? Math.round((postsAvecHashtags / publications.length) * 100) : 0;

    return `
        <header class="mb-4">
            <h2>Analyses & Statistiques 📊</h2>
            <p class="text-muted">Suivez la régularité et le contenu de votre stratégie éditoriale.</p>
        </header>

        <!-- Ligne des indicateurs -->
        <div class="row mb-4">
            <div class="col-md-4 mb-3">
                <div class="card p-3 shadow-sm bg-white border-0 rounded-3 d-flex flex-row align-items-center">
                    <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-3 me-3">
                        <i class="bi bi-collection-fill fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Total Publications</h6>
                        <h3 class="fw-bold mb-0">${publications.length}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card p-3 shadow-sm bg-white border-0 rounded-3 d-flex flex-row align-items-center">
                    <div class="bg-success bg-opacity-10 text-success p-3 rounded-3 me-3">
                        <i class="bi bi-check-circle-fill fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Déjà Publiées</h6>
                        <h3 class="fw-bold mb-0">${postsPasses}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card p-3 shadow-sm bg-white border-0 rounded-3 d-flex flex-row align-items-center">
                    <div class="bg-info bg-opacity-10 text-info p-3 rounded-3 me-3">
                        <i class="bi bi-hourglass-split fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">En Attente (Planifiées)</h6>
                        <h3 class="fw-bold mb-0">${postsFuturs}</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Colonne Répartition des idées -->
            <div class="col-md-6 mb-4">
                <div class="card p-4 shadow-sm bg-white border-0 rounded-3 h-100">
                    <h5 class="fw-bold text-secondary mb-4">
                        <i class="bi bi-pie-chart-fill me-2"></i>Équilibre de votre banque d'idées
                    </h5>
                    ${htmlCategories}
                </div>
            </div>

            <!-- Colonne Qualité SEO / Rseaux Sociaux -->
            <div class="col-md-6 mb-4">
                <div class="card p-4 shadow-sm bg-white border-0 rounded-3 h-100">
                    <h5 class="fw-bold text-secondary mb-4">
                        <i class="bi bi-award-fill me-2"></i>Optimisation des posts
                    </h5>
                    <div class="text-center my-auto py-3">
                        <div class="fs-1 fw-bold text-primary mb-2">${pourcentHashtags}%</div>
                        <h6 class="fw-semibold">Des publications incluent des #Hashtags</h6>
                        <p class="text-muted small px-3">Ajouter des hashtags permet d'augmenter la visibilité de CANUT PC auprès des utilisateurs cibles sur Facebook.</p>
                        <div class="progress mx-auto style="max-width: 80%; height: 8px;">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: ${pourcentHashtags}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initialiserEvenementsStats() {
    // Cette vue est purement informative au chargement, pas d'événements dynamiques complexes requis
}