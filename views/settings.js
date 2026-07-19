function afficherSettings() {
    return `
        <header class="mb-4">
            <h2>Paramètres & Sauvegardes ⚙️</h2>
            <p class="text-muted">Gérez vos données, exportez vos planifications ou restaurez une sauvegarde existante.</p>
        </header>

        <div class="row">
            <!-- Carte Export -->
            <div class="col-md-6 mb-4">
                <div class="card p-4 shadow-sm bg-white border-0 rounded-3 h-100">
                    <h5 class="fw-bold text-primary mb-3">
                        <i class="bi bi-download me-2"></i>Exporter les données
                    </h5>
                    <p class="text-secondary">Téléchargez l'intégralité de votre CANUT Planner (publications planifiées et banque de sujets) dans un fichier unique sécurisé au format JSON.</p>
                    <div class="mt-auto">
                        <button class="btn btn-primary w-100 fw-bold" id="btn-export-json">
                            Générer et télécharger la sauvegarde
                        </button>
                    </div>
                </div>
            </div>

            <!-- Carte Import -->
            <div class="col-md-6 mb-4">
                <div class="card p-4 shadow-sm bg-white border-0 rounded-3 h-100">
                    <h5 class="fw-bold text-success mb-3">
                        <i class="bi bi-upload me-2"></i>Importer une sauvegarde
                    </h5>
                    <p class="text-secondary">Sélectionnez un fichier de sauvegarde <code>.json</code> précédemment exporté pour restaurer vos données sur cette machine.</p>
                    <div class="mt-auto">
                        <input type="file" id="input-import-json" class="form-control mb-3" accept=".json">
                        <button class="btn btn-success w-100 fw-bold" id="btn-import-json">
                            Restaurer la sauvegarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initialiserEvenementsSettings() {
    const btnExport = document.getElementById("btn-export-json");
    const btnImport = document.getElementById("btn-import-json");
    const inputImport = document.getElementById("input-import-json");

    // 1. ÉVÉNEMENT : EXPORTATION JSON
    btnExport.addEventListener("click", () => {
        // On récupère toutes les données de l'application
        const dataBackup = {
            publications: JSON.parse(localStorage.getItem("canut_publications")) || [],
            sujets: JSON.parse(localStorage.getItem("canut_sujets")) || []
        };

        // Conversion en chaîne de caractères JSON lisible
        const jsonString = JSON.stringify(dataBackup, null, 2);
        
        // Création du fichier téléchargeable à la volée
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `canut_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Nettoyage
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 2. ÉVÉNEMENT : IMPORTATION JSON
    btnImport.addEventListener("click", () => {
        const fichier = inputImport.files[0];

        if (!fichier) {
            alert("⚠️ Veuillez d'abord sélectionner un fichier .json à importer.");
            return;
        }

        if (confirm("⚠️ Attention : Importer ce fichier écrasera vos données actuelles. Souhaitez-vous continuer ?")) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const donneesRestorees = JSON.parse(e.target.result);

                    // Vérification sommaire de la structure du fichier JSON
                    if (donneesRestorees.publications || donneesRestorees.sujets) {
                        if (donneesRestorees.publications) {
                            localStorage.setItem("canut_publications", JSON.stringify(donneesRestorees.publications));
                        }
                        if (donneesRestorees.sujets) {
                            localStorage.setItem("canut_sujets", JSON.stringify(donneesRestorees.sujets));
                        }
                        
                        alert("✨ Importation réussie ! Vos données ont été restaurées avec succès.");
                        window.location.reload(); // On recharge l'application pour appliquer les changements
                    } else {
                        alert("❌ Erreur : Le fichier JSON sélectionné n'a pas le bon format.");
                    }
                } catch (err) {
                    alert("❌ Erreur lors de la lecture du fichier JSON. Assurez-vous qu'il n'est pas corrompu.");
                    console.error(err);
                }
            };

            reader.readAsText(fichier);
        }
    });
}