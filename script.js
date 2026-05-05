// --- CONFIGURACIÓN DE DATOS ---
const PERSONAJES = ["Cazador", "Mago", "Guerrero", "Asesino", "Tanque", "Soporte", "Arquero", "Invocador", "Bárbaro", "Pícaro"];
const MODOS = ["Dominio", "Asalto", "Duelo", "Captura", "Supervivencia"];
const MAPAS = {
    "Dominio": ["Templo Antiguo", "Ciudadela"],
    "Asalto": ["Puente Roto", "Desierto"],
    "Duelo": ["Arena Sangrienta"],
    "Captura": ["Bosque Niebla"],
    "Supervivencia": ["Isla Calavera"]
};

const TIER_LISTS = {
    "Templo Antiguo": ["Mago", "Cazador", "Arquero", "Soporte"],
    "Ciudadela": ["Tanque", "Guerrero", "Asesino"],
    "Puente Roto": ["Arquero", "Mago", "Pícaro"],
};

// --- ESTADO DE LA APLICACIÓN ---
let state = {
    totalPartidas: 0,
    partidaActual: 1,
    bansGlobales: [], // Esto persistirá
    modo: "",
    mapa: "",
    bansLocales: []
};

function goToStep(num) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${num}`).classList.add('active');
}

function setPartidas(n) {
    state.totalPartidas = n;
    document.getElementById('total-games-num').innerText = n;
    document.getElementById('game-counter').classList.remove('hidden');
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

// Nueva función para manejar el flujo entre partidas
function nextMatch() {
    if (state.partidaActual < state.totalPartidas) {
        // Incrementar contador
        state.partidaActual++;
        document.getElementById('current-game-num').innerText = state.partidaActual;
        
        // Reiniciar selecciones temporales pero MANTENER bans globales
        state.modo = "";
        state.mapa = "";
        state.bansLocales = [];
        
        // Volver a la selección de modo
        renderModes();
        goToStep(4);
    } else {
        alert("Has completado todas las partidas.");
        location.reload(); // Reinicia todo
    }
}

function renderGrid(containerId, items, limit, targetArray, buttonId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    items.forEach(item => {
        const btn = document.createElement("button");
        btn.innerText = item;
        // Si el item ya está en el array (como bans globales persistentes), marcarlo
        if(targetArray.includes(item)) btn.classList.add("selected");

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
    container.innerHTML = "";
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
            // Filtrar personajes: no mostrar los que ya son Bans Globales para los Bans Locales
            const disponiblesParaBansLocales = PERSONAJES.filter(p => !state.bansGlobales.includes(p));
            renderGrid("local-grid", disponiblesParaBansLocales, 6, state.bansLocales, "btn-next-local");
            goToStep(6);
        };
        container.appendChild(btn);
    });
}

function showResults() {
    const container = document.getElementById("results-grid");
    const todosLosBans = [...state.bansGlobales, ...state.bansLocales];
    const baseList = TIER_LISTS[state.mapa] || PERSONAJES;
    const sugeridos = baseList.filter(p => !todosLosBans.includes(p));

    container.innerHTML = sugeridos.length > 0 
        ? sugeridos.map(p => `<div class="result-card"><h3>${p}</h3></div>`).join("")
        : "<p>No hay personajes recomendados disponibles.</p>";
    
    // Cambiar texto del botón si es la última partida
    if (state.partidaActual === state.totalPartidas) {
        document.getElementById('btn-next-match').classList.add('hidden');
        document.getElementById('btn-restart').classList.remove('hidden');
    }

    goToStep(7);
}