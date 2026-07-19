function afficherCalendar() {
    return `
        <header class="mb-4">
            <h2>Planning Éditorial 📅</h2>
            <p class="text-muted">Visualisez et organisez vos publications Facebook de manière intuitive.</p>
        </header>

        <div class="card p-4 shadow-sm bg-white border-0 rounded-3">
            <!-- On force une hauteur minimale pour que le calendrier s'affiche -->
            <div id="calendar-container" style="min-height: 650px;"></div>
        </div>
    `;
}

function initialiserEvenementsCalendar() {
    const calendarEl = document.getElementById('calendar-container');
    if (!calendarEl) return;

    const publications = JSON.parse(localStorage.getItem("canut_publications")) || [];

    // Traduction de tes posts au format FullCalendar
    const evenements = publications.map(pub => {
        return {
            id: pub.id,
            title: `📱 ${pub.titre}`,
            start: `${pub.date}T${pub.heure}`,
            extendedProps: {
                texte: pub.texte
            },
            backgroundColor: '#2563eb',
            borderColor: '#2563eb',
            textColor: '#ffffff'
        };
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        firstDay: 1,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        buttonText: {
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine"
        },
        events: evenements,
        eventClick: function(info) {
            alert(`Publication : ${info.event.title}\n\nMessage :\n${info.event.extendedProps.texte}`);
        }
    });

    calendar.render();
}