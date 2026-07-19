function afficherDashboard() {
    // Récupérer les publications
    const publications = JSON.parse(localStorage.getItem("canut_publications")) || [];
    
    // Filtrer pour n'avoir que les publications futures ou du jour
    const maintenant = new Date();
    const publicationsFutures = publications.filter(pub => new Date(`${pub.date}T${pub.heure}`) >= maintenant);

    // Trier pour avoir la plus proche en premier
    publicationsFutures.sort((a, b) => new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`));

    let blocProchainePub = "";

    if (publicationsFutures.length > 0) {
        const prochaine = publicationsFutures[0];
        const dateFormatee = new Date(prochaine.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
        
        blocProchainePub = `
            <p class="text-primary mb-1 fw-bold"><i class="bi bi-clock me-1"></i>${dateFormatee} - ${prochaine.heure}</p>
            <strong class="fs-5 d-block text-dark">${prochaine.titre}</strong>
            <p class="text-muted text-truncate mt-2 mb-0">${prochaine.texte}</p>
        `;
    } else {
        blocProchainePub = `
            <p class="text-muted mb-0">Aucune publication planifiée à venir.</p>
        `;
    }

    return `
        <header class="mb-4">
            <h2>Bonjour Jean-Louis 👋</h2>
            <p class="text-muted">Voici l'état de votre planning aujourd'hui.</p>
        </header>

        <section class="row">
            <div class="col-md-6 col-lg-4">
                <div class="custom-dashboard-card p-4 shadow-sm bg-white border-0 rounded-3">
                    <h5 class="text-secondary mb-3 fw-bold">Prochaine publication</h5>
                    ${blocProchainePub}
                </div>
            </div>
        </section>
    `;
}