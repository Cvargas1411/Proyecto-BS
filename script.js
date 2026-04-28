// --- CONFIGURACIÓN DE DATOS (Edita esto) ---
const PERSONAJES = ["Cazador", "Mago", "Guerrero", "Asesino", "Tanque", "Soporte", "Arquero", "Invocador", "Bárbaro", "Pícaro"];
const MODOS = ["Dominio", "Asalto", "Duelo", "Captura", "Supervivencia"];
const MAPAS = {
    "Dominio": ["Templo Antiguo", "Ciudadela"],
    "Asalto": ["Puente Roto", "Desierto"],
    "Duelo": ["Arena Sangrienta"],
    "Captura": ["Bosque Niebla"],
    "Supervivencia": ["Isla Calavera"]
};

// Define quién es mejor en cada mapa (esto filtrará los resultados)
const TIER_LISTS = {
    "Templo Antiguo": ["Mago", "Cazador", "Arquero", "Soporte"],
    "Ciudadela": ["Tanque", "Guerrero", "Asesino"],
    "Puente Roto": ["Arquero", "Mago", "Pícaro"],
    // Agrega el resto de los mapas aquí...
};

// --- LÓGICA DEL APP ---
let state = {
    partidas: 0,
    bansGlobales: [],
    modo: "",
    mapa: "",
    bansLocales: []
};

function goToStep(num) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${num}`).classList.add('active');
}

function setPartidas(n) {
    state.partidas = n;
    goToStep(2);
}

function toggleGlobalBans(wantsBans) {
    if (wantsBans) {
        renderGrid("global-grid", PERSONAJES, 3, state.bansGlobales, "btn-next-global");
        goToStep(3);
    } else {
        renderModes();
        goToStep(4);
    }
}

function renderGrid(containerId, items, limit, targetArray, buttonId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    items.forEach(item => {
        const btn = document.createElement("button");
        btn.innerText = item;
        btn.onclick = () => {
            if (targetArray.includes(item)) {
                targetArray.splice(targetArray.indexOf(item), 1);
                btn.classList.remove("selected");
            } else if (targetArray.length < limit) {
                targetArray.push(item);
                btn.classList.add("selected");
            }
            document.getElementById(buttonId).disabled = targetArray.length !== limit;
        };
        container.appendChild(btn);
    });
}

function renderModes() {
    const container = document.getElementById("modes-grid");
    MODOS.forEach(m => {
        const btn = document.createElement("button");
        btn.innerText = m;
        btn.onclick = () => {
            state.modo = m;
            renderMaps(m);
            goToStep(5);
        };
        container.appendChild(btn);
    });
}

function renderMaps(modo) {
    const container = document.getElementById("maps-grid");
    container.innerHTML = "";
    MAPAS[modo].forEach(mapa => {
        const btn = document.createElement("button");
        btn.innerText = mapa;
        btn.onclick = () => {
            state.mapa = mapa;
            renderGrid("local-grid", PERSONAJES.filter(p => !state.bansGlobales.includes(p)), 6, state.bansLocales, "btn-next-local");
            goToStep(6);
        };
        container.appendChild(btn);
    });
}

function showResults() {
    const container = document.getElementById("results-grid");
    const todosLosBans = [...state.bansGlobales, ...state.bansLocales];
    
    // Si no hay tier list definida para el mapa, mostramos todos los disponibles
    const baseList = TIER_LISTS[state.mapa] || PERSONAJES;
    const sugeridos = baseList.filter(p => !todosLosBans.includes(p));

    container.innerHTML = sugeridos.length > 0 
        ? sugeridos.map(p => `<div class="result-card"><h3>${p}</h3></div>`).join("")
        : "<p>No hay personajes recomendados disponibles.</p>";
    
    goToStep(7);
}