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

let state = {
    usaBansGlobales: false,
    totalPartidas: 0,
    partidaActual: 1,
    bansGlobales: [],
    modo: "",
    mapa: "",
    bansLocales: [],
    
    // Variables de Draft
    esFirstPick: true,
    secuenciaTurnos: [], // Arreglo que define de quién es el turno: ['nosotros', 'rival', 'rival', ...]
    turnoActualIndex: 0,
    nuestrosPicks: [],
    rivalPicks: []
};

function calcularMejoresPicks() {
    const todosLosBansYPicks = [
        ...state.bansGlobales, 
        ...state.bansLocales, 
        ...state.nuestrosPicks, 
        ...state.rivalPicks
    ];
    
    // Filtrar los que ya no están disponibles
    let disponibles = BRAWLERS.filter(b => !todosLosBansYPicks.includes(b));
    let top15Mapa = MAP_DATA[state.modo][state.mapa].top15;

    let puntajes = disponibles.map(brawler => {
        let score = 0;
        
        // Regla 1: +1 si está en top 15
        if (top15Mapa.includes(brawler)) score += 1;

        // Evaluación contra picks del rival
        state.rivalPicks.forEach(rival => {
            // Regla 2: -1 si el rival me hace counter
            if (BRAWLER_COUNTERS[rival] && BRAWLER_COUNTERS[rival].includes(brawler)) {
                score -= 1;
            }
            // Regla 3: +1 si yo le hago counter al rival
            if (BRAWLER_COUNTERS[brawler] && BRAWLER_COUNTERS[brawler].includes(rival)) {
                score += 1;
            }
        });

        return { name: brawler, score: score };
    });

    // Ordenar de mayor a menor puntaje
    puntajes.sort((a, b) => b.score - a.score);
    return puntajes;
}

// --- FUNCIONES DE NAVEGACIÓN ---
function goToStep(num) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${num}`).classList.add('active');
    
    // Mostrar buscador solo en los pasos donde se eligen brawlers
    const searchContainer = document.getElementById('search-container');
    if ([3, 6, 8].includes(num)) {
        searchContainer.classList.remove('hidden');
        document.getElementById('search-bar').value = ""; // Limpiar busqueda
        filtrarBrawlers(); 
    } else {
        searchContainer.classList.add('hidden');
    }
}

function setUsaBansGlobales(usa) {
    state.usaBansGlobales = usa;
    goToStep(2);
}

function setPartidas(n) {
    state.totalPartidas = n;
    document.getElementById('total-games').innerText = n;
    document.getElementById('game-counter').classList.remove('hidden');
    
    if (state.usaBansGlobales) {
        renderBrawlerGrid("global-grid", state.bansGlobales, 5, "btn-next-global", true);
        goToStep(3);
    } else {
        renderModos();
        goToStep(4);
    }
}

// --- FUNCIÓN PARA DIBUJAR BRAWLERS CON IMÁGENES ---
// Permite rango dinámico (ej: 1 a 5 para globales, exactamente 6 para locales)
function renderBrawlerGrid(containerId, targetArray, limit, buttonId, isRange = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    
    BRAWLERS.forEach(brawler => {
        const btn = document.createElement("button");
        btn.className = "brawler-btn";
        btn.dataset.name = brawler; // Para el buscador
        
        // Imagen desde la carpeta Portraits
        btn.innerHTML = `<img src="Portraits/${brawler}_portrait.png" alt="${brawler}"><br>${brawler}`;
        
        if (targetArray.includes(brawler)) btn.classList.add("selected");
        
        // Excluir brawlers ya baneados globalmente si estamos en bans locales
        if (containerId === "local-grid" && state.bansGlobales.includes(brawler)) {
            btn.disabled = true;
            btn.classList.add("banned");
        }

        btn.onclick = () => {
            if (targetArray.includes(brawler)) {
                targetArray.splice(targetArray.indexOf(brawler), 1);
                btn.classList.remove("selected");
            } else if (targetArray.length < limit) {
                targetArray.push(brawler);
                btn.classList.add("selected");
            }
            
            const btnNext = document.getElementById(buttonId);
            if (isRange) {
                // Para bans globales: de 1 a 5
                btnNext.disabled = targetArray.length === 0;
            } else {
                // Para bans locales: exactamente 6
                btnNext.disabled = targetArray.length !== limit;
            }
        };
        container.appendChild(btn);
    });
}

// --- BUSCADOR ---
function filtrarBrawlers() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    document.querySelectorAll(".brawler-btn").forEach(btn => {
        if (btn.dataset.name.includes(query)) {
            btn.style.display = "inline-block";
        } else {
            btn.style.display = "none";
        }
    });
}

// --- MODOS Y MAPAS ---
function renderModos() {
    const container = document.getElementById("modes-grid");
    container.innerHTML = "";
    MODOS.forEach(m => {
        const btn = document.createElement("button");
        btn.innerText = m;
        btn.onclick = () => {
            state.modo = m;
            renderMapas(m);
            goToStep(5);
        };
        container.appendChild(btn);
    });
}

function renderMapas(modo) {
    const container = document.getElementById("maps-grid");
    container.innerHTML = "";
    Object.keys(MAP_DATA[modo]).forEach(mapa => {
        const btn = document.createElement("button");
        btn.innerText = mapa;
        btn.onclick = () => {
            state.mapa = mapa;
            renderBrawlerGrid("local-grid", state.bansLocales, 6, "btn-next-local");
            goToStep(6);
        };
        container.appendChild(btn);
    });
}

// --- LÓGICA DE DRAFT Y SECUENCIAS ---
function iniciarDraft(esFirstPick) {
    state.esFirstPick = esFirstPick;
    // Secuencia de turnos (Nosotros = 'N', Rival = 'R')
    if (esFirstPick) {
        state.secuenciaTurnos = ['N', 'R', 'R', 'N', 'N', 'R'];
    } else {
        state.secuenciaTurnos = ['R', 'N', 'N', 'R', 'R', 'N'];
    }
    
    state.turnoActualIndex = 0;
    state.nuestrosPicks = [];
    state.rivalPicks = [];
    
    actualizarPantallaDraft();
    goToStep(8);
}

function actualizarPantallaDraft() {
    const turnoLetra = state.secuenciaTurnos[state.turnoActualIndex];
    const indicator = document.getElementById("turn-indicator");
    
    if (state.turnoActualIndex >= 6) {
        indicator.innerText = "Draft Finalizado";
        document.getElementById("draft-selection-grid").innerHTML = "";
        document.getElementById("suggestions-container").innerHTML = "";
        
        if (state.partidaActual < state.totalPartidas) {
            document.getElementById("btn-next-match").classList.remove("hidden");
        } else {
            document.getElementById("btn-restart").classList.remove("hidden");
        }
        return;
    }

    indicator.innerText = turnoLetra === 'N' ? "Turno: NUESTRO EQUIPO" : "Turno: RIVAL";
    
    // Dibujar picks actuales
    document.getElementById("our-picks-container").innerHTML = state.nuestrosPicks.map(p => `<img src="Portraits/${p}_portrait.png" width="50">`).join("");
    document.getElementById("enemy-picks-container").innerHTML = state.rivalPicks.map(p => `<img src="Portraits/${p}_portrait.png" width="50">`).join("");

    // Calcular y mostrar sugerencias matemáticas
    let sugerencias = calcularMejoresPicks();
    let contSugerencias = document.getElementById("suggestions-container");
    contSugerencias.innerHTML = sugerencias.slice(0, 5).map(s => `
        <div class="sugerencia-card">
            <img src="Portraits/${s.name}_portrait.png" width="40"><br>
            ${s.name} (Puntaje: ${s.score})
        </div>
    `).join("");

    // Dibujar grilla para elegir el siguiente pick
    const grid = document.getElementById("draft-selection-grid");
    grid.innerHTML = "";
    
    const todosOcupados = [...state.bansGlobales, ...state.bansLocales, ...state.nuestrosPicks, ...state.rivalPicks];
    
    BRAWLERS.forEach(brawler => {
        const btn = document.createElement("button");
        btn.className = "brawler-btn";
        btn.dataset.name = brawler;
        btn.innerHTML = `<img src="Portraits/${brawler}_portrait.png" alt="${brawler}"><br>${brawler}`;
        
        if (todosOcupados.includes(brawler)) {
            btn.disabled = true;
            btn.classList.add("banned");
        } else {
            btn.onclick = () => registrarPick(brawler, turnoLetra);
        }
        grid.appendChild(btn);
    });
    
    filtrarBrawlers(); // Aplicar filtro si la barra de búsqueda tiene texto
}

function registrarPick(brawler, turnoLetra) {
    if (turnoLetra === 'N') {
        state.nuestrosPicks.push(brawler);
    } else {
        state.rivalPicks.push(brawler);
    }
    state.turnoActualIndex++;
    actualizarPantallaDraft();
}

function siguientePartida() {
    state.partidaActual++;
    document.getElementById("current-game").innerText = state.partidaActual;
    
    // Resetear variables de partida, mantener globales
    state.modo = "";
    state.mapa = "";
    state.bansLocales = [];
    document.getElementById("btn-next-match").classList.add("hidden");
    
    renderModos();
    goToStep(4);
}