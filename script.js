const BRAWLERS = [
    "amber", "angelo", "ash", "barley", "bea", "belle", "berry", "bibi", "bonnie", "bo", 
    "brock", "bull", "buster", "buzz", "byron", "carl", "charlie", "chester", "chuck", 
    "clancy", "colette", "colt", "cordelius", "crow", "damian", "darryl", "doug", "draco", 
    "dynamike", "edgar", "elprimo", "emz", "eve", "fang", "finx", "frank", "gale", "gene", 
    "gigi", "gray", "griff", "grom", "gus", "hank", "jacky", "jae-yong", "janet", "jessie", 
    "juju", "kaze", "kenji", "kit", "larry&lawrie", "leon", "lily", "lola", "lou", "lumi", 
    "maisie", "mandy", "max", "meeple", "meg", "melodie", "mico", "mina", "moe", "mortis", 
    "mrp", "najia", "nani", "nita", "ollie", "otis", "pam", "pearl", "penny", "pierce", 
    "piper", "poco", "rico", "rosa", "rt", "ruffs", "sam", "sandy", "shade", "shelly", 
    "sirius", "spike", "sprout", "squeak", "starnova", "stu", "surge", "tara", "tick", 
    "trunk", "willow", "ziggy"
];

const BRAWLER_COUNTERS = {
    "amber": [],
    "angelo": [],
    "ash": [],
    "barley": [],
    "bea": [],
    "belle": [],
    "berry": [],
    "bibi": [],
    "bonnie": [],
    "bo": [],
    "brock": [],
    "bull": [],
    "buster": [],
    "buzz": [],
    "byron": [],
    "carl": [],
    "charlie": [],
    "chester": [],
    "chuck": [],
    "clancy": [],
    "colette": [],
    "colt": [],
    "cordelius": [],
    "crow": [],
    "damian": [],
    "darryl": [],
    "doug": [],
    "draco": [],
    "dynamike": [],
    "edgar": [],
    "elprimo": [],
    "emz": [],
    "eve": [],
    "fang": [],
    "finx": [],
    "frank": [],
    "gale": [],
    "gene": [],
    "gigi": [],
    "gray": [],
    "griff": [],
    "grom": [],
    "gus": [],
    "hank": [],
    "jacky": [],
    "jae-yong": [],
    "janet": [],
    "jessie": [],
    "juju": [],
    "kaze": [],
    "kenji": [],
    "kit": [],
    "larry&lawrie": [],
    "leon": [],
    "lily": [],
    "lola": [],
    "lou": [],
    "lumi": [],
    "maisie": [],
    "mandy": [],
    "max": [],
    "meeple": [],
    "meg": [],
    "melodie": [],
    "mico": [],
    "mina": [],
    "moe": [],
    "mortis": [],
    "mrp": [],
    "najia": [],
    "nani": [],
    "nita": [],
    "ollie": [],
    "otis": [],
    "pam": [],
    "pearl": [],
    "penny": [],
    "pierce": [],
    "piper": [],
    "poco": [],
    "rico": [],
    "rosa": [],
    "rt": [],
    "ruffs": [],
    "sam": [],
    "sandy": [],
    "shade": [],
    "shelly": [],
    "sirius": [],
    "spike": [],
    "sprout": [],
    "squeak": [],
    "starnova": [],
    "stu": [],
    "surge": [],
    "tara": [],
    "tick": [],
    "trunk": [],
    "willow": [],
    "ziggy": []
};

const MODOS = ["Brawl Ball", "Gem Grab", "Bounty", "Hot zone", "Knockout", "Heist"];

const MAP_DATA = {
    "Brawl Ball": {
        // Formato para añadir mapas:
        // "Nombre del Mapa 1": { top15: ["brawler1", "brawler2", "brawler3"] },
        // "Nombre del Mapa 2": { top15: [] }
    },
    "Gem Grab": {
        // Añadir mapas aquí
    },
    "Bounty": {
        // Añadir mapas aquí
    },
    "Hot zone": {
        // Añadir mapas aquí
    },
    "Knockout": {
        // Añadir mapas aquí
    },
    "Heist": {
        // Añadir mapas aquí
    }
};

// --- 2. ESTADO GENERAL ---
let state = {
    usaBansGlobales: false,
    totalPartidas: 0,
    partidaActual: 1,
    bansGlobales: [],
    modo: "",
    mapa: "",
    bansLocales: [],
    nuestrosPicks: [],
    rivalPicks: []
};

// --- 3. ESTADO DEL DRAFT (Por Fases) ---
let draftPhases = [];
let currentDraftPhase = 0;
let tempDraftSelection = []; // Guarda los brawlers que estás clickeando en el turno actual

// --- 4. FUNCIONES DE NAVEGACIÓN Y UI ---
function goToStep(num) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${num}`).classList.add('active');
    
    const searchContainer = document.getElementById('search-container');
    if ([3, 6, 8].includes(num)) {
        searchContainer.classList.remove('hidden');
        document.getElementById('search-bar').value = ""; 
        filtrarBrawlers(); 
    } else {
        searchContainer.classList.add('hidden');
    }
}

function filtrarBrawlers() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    document.querySelectorAll(".brawler-btn").forEach(btn => {
        btn.style.display = btn.dataset.name.includes(query) ? "flex" : "none";
    });
}

// Generador de Grillas Reutilizable
function renderBrawlerGrid(containerId, limit, targetArray, buttonId, cssClass, isRange = false, isDraft = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    
    // Calcular bloqueados (Solo se usan si NO es draft, en draft se calcula dinámicamente)
    let bloqueados = containerId === "local-grid" ? state.bansGlobales : [];

    BRAWLERS.forEach(brawler => {
        const btn = document.createElement("button");
        btn.className = "brawler-btn";
        btn.dataset.name = brawler;
        
        // Manejo de error de imagen: Si la imagen falla, muestra una imagen vacía o de fallback
        btn.innerHTML = `
            <div class="brawler-img-box">
                <img src="Portraits/${brawler}_portrait.png" alt="${brawler}" onerror="this.src='https://via.placeholder.com/60/1e293b/ffffff?text=?';">
            </div>
            <div class="brawler-name">${brawler}</div>
        `;
        
        if (targetArray.includes(brawler)) btn.classList.add(cssClass);
        if (bloqueados.includes(brawler)) { btn.disabled = true; btn.classList.add("banned"); }

        btn.onclick = () => {
            if (targetArray.includes(brawler)) {
                targetArray.splice(targetArray.indexOf(brawler), 1);
                btn.classList.remove(cssClass);
            } else if (targetArray.length < limit) {
                targetArray.push(brawler);
                btn.classList.add(cssClass);
            }
            
            if(!isDraft) {
                const btnNext = document.getElementById(buttonId);
                btnNext.disabled = isRange ? (targetArray.length === 0) : (targetArray.length !== limit);
            } else {
                validarBotonDraft();
            }
        };
        container.appendChild(btn);
    });
}

// --- 5. FLUJO INICIAL ---
function setUsaBansGlobales(usa) {
    state.usaBansGlobales = usa;
    goToStep(2);
}

function setPartidas(n) {
    state.totalPartidas = n;
    document.getElementById('total-games').innerText = n;
    document.getElementById('game-counter').classList.remove('hidden');
    
    if (state.usaBansGlobales) {
        renderBrawlerGrid("global-grid", 5, state.bansGlobales, "btn-next-global", "selected-ban", true, false);
        goToStep(3);
    } else {
        renderModos();
    }
}

function renderModos() {
    const container = document.getElementById("modes-grid");
    container.innerHTML = "";
    MODOS.forEach(m => {
        const btn = document.createElement("button");
        btn.className = "btn-secondary";
        btn.innerText = m;
        btn.onclick = () => { state.modo = m; renderMapas(m); };
        container.appendChild(btn);
    });
    goToStep(4);
}

function renderMapas(modo) {
    const container = document.getElementById("maps-grid");
    container.innerHTML = "";
    
    // Si el modo no existe en MAP_DATA, evita que explote
    const mapasDisponibles = MAP_DATA[modo] ? Object.keys(MAP_DATA[modo]) : [];
    
    if(mapasDisponibles.length === 0) {
        container.innerHTML = "<p>No hay mapas configurados para este modo.</p>";
    }

    mapasDisponibles.forEach(mapa => {
        const btn = document.createElement("button");
        btn.className = "btn-secondary";
        btn.innerText = mapa;
        btn.onclick = () => { 
            state.mapa = mapa; 
            renderBrawlerGrid("local-grid", 6, state.bansLocales, "btn-next-local", "selected-ban", false, false);
            goToStep(6);
        };
        container.appendChild(btn);
    });
    goToStep(5);
}

// --- 6. SISTEMA DE DRAFT MEJORADO ---
function iniciarDraft(esFirstPick) {
    if (esFirstPick) {
        draftPhases = [
            { team: 'N', count: 1 }, { team: 'R', count: 2 }, 
            { team: 'N', count: 2 }, { team: 'R', count: 1 }
        ];
    } else {
        draftPhases = [
            { team: 'R', count: 1 }, { team: 'N', count: 2 }, 
            { team: 'R', count: 2 }, { team: 'N', count: 1 }
        ];
    }
    
    currentDraftPhase = 0;
    state.nuestrosPicks = [];
    state.rivalPicks = [];
    tempDraftSelection = [];
    
    prepararPantallaTurnoDraft();
    goToStep(8);
}

function prepararPantallaTurnoDraft() {
    tempDraftSelection = [];
    const turnIndicator = document.getElementById("turn-indicator");
    const btnConfirm = document.getElementById("btn-confirm-draft");
    
    // Actualizar avatares elegidos arriba
    document.getElementById("our-picks-container").innerHTML = state.nuestrosPicks.map(p => `<img src="Portraits/${p}_portrait.png" onerror="this.src='https://via.placeholder.com/45?text=?'">`).join("");
    document.getElementById("enemy-picks-container").innerHTML = state.rivalPicks.map(p => `<img src="Portraits/${p}_portrait.png" onerror="this.src='https://via.placeholder.com/45?text=?'">`).join("");

    // Revisar si terminó el draft
    if (currentDraftPhase >= draftPhases.length) {
        turnIndicator.innerText = "¡DRAFT FINALIZADO!";
        turnIndicator.style.color = "#10b981";
        document.getElementById("draft-selection-grid").innerHTML = "";
        btnConfirm.classList.add("hidden");
        document.getElementById("suggestions-area").classList.add("hidden");
        
        if (state.partidaActual < state.totalPartidas) {
            document.getElementById("btn-next-match").classList.remove("hidden");
        } else {
            document.getElementById("btn-restart").classList.remove("hidden");
        }
        return;
    }

    const faseActual = draftPhases[currentDraftPhase];
    const esNuestro = faseActual.team === 'N';
    
    // Título del turno
    turnIndicator.innerText = esNuestro 
        ? `Turno de NUESTRO EQUIPO (Elige ${faseActual.count})` 
        : `Turno del RIVAL (Elige ${faseActual.count})`;
    turnIndicator.style.color = esNuestro ? "var(--primary)" : "var(--danger)";

    // Mostrar Botón Confirmar (oculto por defecto)
    btnConfirm.classList.remove("hidden");
    btnConfirm.disabled = true;

    // Calcular Sugerencias
    actualizarSugerencias();

    // Dibujar la grilla para seleccionar
    const cssClass = esNuestro ? "selected-us" : "selected-ban";
    renderBrawlerGrid("draft-selection-grid", faseActual.count, tempDraftSelection, "btn-confirm-draft", cssClass, false, true);
    
    // Bloquear los ya elegidos/baneados en la grilla visualmente
    bloquearElegidosEnDraft();
}

function bloquearElegidosEnDraft() {
    const todosOcupados = [...state.bansGlobales, ...state.bansLocales, ...state.nuestrosPicks, ...state.rivalPicks];
    document.querySelectorAll("#draft-selection-grid .brawler-btn").forEach(btn => {
        if (todosOcupados.includes(btn.dataset.name)) {
            btn.disabled = true;
            btn.classList.add("banned");
        }
    });
}

function validarBotonDraft() {
    const faseActual = draftPhases[currentDraftPhase];
    document.getElementById("btn-confirm-draft").disabled = (tempDraftSelection.length !== faseActual.count);
}

function confirmarPickDraft() {
    const faseActual = draftPhases[currentDraftPhase];
    if (faseActual.team === 'N') {
        state.nuestrosPicks.push(...tempDraftSelection);
    } else {
        state.rivalPicks.push(...tempDraftSelection);
    }
    
    currentDraftPhase++;
    prepararPantallaTurnoDraft();
}

// --- 7. MOTOR MATEMÁTICO DE SUGERENCIAS ---
function actualizarSugerencias() {
    const todosOcupados = [...state.bansGlobales, ...state.bansLocales, ...state.nuestrosPicks, ...state.rivalPicks];
    let disponibles = BRAWLERS.filter(b => !todosOcupados.includes(b));
    
    // Evitar crasheo si el mapa no tiene top15 configurado
    let top15Mapa = MAP_DATA[state.modo]?.[state.mapa]?.top15 || [];

    let puntajes = disponibles.map(brawler => {
        let score = 0;
        if (top15Mapa.includes(brawler)) score += 1;

        state.rivalPicks.forEach(rival => {
            // El rival me hace counter
            if (BRAWLER_COUNTERS[rival] && BRAWLER_COUNTERS[rival].includes(brawler)) score -= 1;
            // Yo le hago counter al rival
            if (BRAWLER_COUNTERS[brawler] && BRAWLER_COUNTERS[brawler].includes(rival)) score += 1;
        });
        return { name: brawler, score: score };
    });

    puntajes.sort((a, b) => b.score - a.score);
    
    const contSugerencias = document.getElementById("suggestions-container");
    contSugerencias.innerHTML = puntajes.slice(0, 5).map(s => `
        <div class="sug-card">
            <img src="Portraits/${s.name}_portrait.png" onerror="this.src='https://via.placeholder.com/30?text=?'">
            ${s.name} (+${s.score})
        </div>
    `).join("");
}

// --- 8. REINICIO DE PARTIDA ---
function siguientePartida() {
    state.partidaActual++;
    document.getElementById("current-game").innerText = state.partidaActual;
    
    state.modo = "";
    state.mapa = "";
    state.bansLocales = [];
    document.getElementById("btn-next-match").classList.add("hidden");
    document.getElementById("suggestions-area").classList.remove("hidden");
    
    renderModos();
}