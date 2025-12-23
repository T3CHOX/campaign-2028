document.addEventListener('DOMContentLoaded', () => {
    // Start on Intro
    goToScreen('intro-screen');
});

/* --- 1. DATA CONFIGURATION --- */

const ISSUES = [
    { id: 'econ', name: 'Economy' },
    { id: 'abort', name: 'Abortion' },
    { id: 'immig', name: 'Immigration' },
    { id: 'clim', name: 'Climate' },
    { id: 'gun', name: 'Gun Control' },
    { id: 'health', name: 'Healthcare' },
    { id: 'crime', name: 'Crime' },
    { id: 'foreign', name: 'Foreign Policy' }
];

const CANDIDATES = [
    {
        id: 'harris', name: 'Kamala Harris', 
        title: 'The Incumbent VP',
        desc: 'Strong establishment backing. High starting funds but polarized base.',
        funds: 60.0,
        stances: { econ: 60, abort: 100, immig: 50, clim: 85, gun: 90, health: 80, crime: 60, foreign: 75 }
    },
    {
        id: 'newsom', name: 'Gavin Newsom',
        title: 'The Governor',
        desc: 'Progressive champion. High charisma but struggles in the rust belt.',
        funds: 50.0,
        stances: { econ: 55, abort: 100, immig: 70, clim: 95, gun: 95, health: 90, crime: 50, foreign: 65 }
    },
    {
        id: 'whitmer', name: 'Gretchen Whitmer',
        title: 'The Rust Belt Warrior',
        desc: 'High appeal in swing states. Moderate funds.',
        funds: 45.0,
        stances: { econ: 70, abort: 90, immig: 55, clim: 75, gun: 70, health: 85, crime: 65, foreign: 60 }
    }
];

const VPS = [
    { id: 'shapiro', name: 'Josh Shapiro', desc: '+5% Polls in PA. Moderate appeal.', buff: { state: 'PA', amount: 5 } },
    { id: 'kelly', name: 'Mark Kelly', desc: '+5% Polls in AZ. Strong on Defense.', buff: { state: 'AZ', amount: 5 } },
    { id: 'cooper', name: 'Roy Cooper', desc: '+5% Polls in NC. Southern appeal.', buff: { state: 'NC', amount: 5 } }
];

/* --- 2. GAME STATE --- */
let game = {
    candidate: null,
    vp: null,
    funds: 0,
    weeks: 12,
    selectedState: null,
    // Data for Map (Simplified 0-100 Lean, 50=Tie)
    states: {
        "CA": { name: "California", ev: 54, lean: 85, priorities: { clim: 10, immig: 8 } },
        "TX": { name: "Texas", ev: 40, lean: 35, priorities: { immig: 10, gun: 9 } },
        "FL": { name: "Florida", ev: 30, lean: 40, priorities: { econ: 9, immig: 8 } },
        "NY": { name: "New York", ev: 28, lean: 80, priorities: { crime: 8, econ: 8 } },
        "PA": { name: "Pennsylvania", ev: 19, lean: 50.5, priorities: { econ: 10, energy: 9 } },
        "IL": { name: "Illinois", ev: 19, lean: 75, priorities: { crime: 8 } },
        "OH": { name: "Ohio", ev: 17, lean: 42, priorities: { trade: 9 } },
        "GA": { name: "Georgia", ev: 16, lean: 49.5, priorities: { econ: 8 } },
        "NC": { name: "North Carolina", ev: 16, lean: 49.0, priorities: { edu: 8 } },
        "MI": { name: "Michigan", ev: 15, lean: 52.0, priorities: { trade: 9 } },
        "NJ": { name: "New Jersey", ev: 14, lean: 65, priorities: { tax: 9 } },
        "VA": { name: "Virginia", ev: 13, lean: 58, priorities: { defense: 8 } },
        "WA": { name: "Washington", ev: 12, lean: 75, priorities: { clim: 9 } },
        "AZ": { name: "Arizona", ev: 11, lean: 49.8, priorities: { immig: 10 } },
        "MA": { name: "Massachusetts", ev: 11, lean: 85, priorities: { edu: 10 } },
        "TN": { name: "Tennessee", ev: 11, lean: 30, priorities: { gun: 9 } },
        "IN": { name: "Indiana", ev: 11, lean: 35, priorities: { trade: 8 } },
        "MN": { name: "Minnesota", ev: 10, lean: 55, priorities: { health: 8 } },
        "WI": { name: "Wisconsin", ev: 10, lean: 50.2, priorities: { econ: 9 } },
        "MD": { name: "Maryland", ev: 10, lean: 70, priorities: { edu: 8 } },
        "MO": { name: "Missouri", ev: 10, lean: 38, priorities: { gun: 8 } },
        "CO": { name: "Colorado", ev: 10, lean: 60, priorities: { clim: 8 } },
        "SC": { name: "South Carolina", ev: 9, lean: 38, priorities: { econ: 8 } },
        "AL": { name: "Alabama", ev: 9, lean: 25, priorities: { religion: 9 } },
        "LA": { name: "Louisiana", ev: 8, lean: 30, priorities: { energy: 9 } },
        "KY": { name: "Kentucky", ev: 8, lean: 28, priorities: { coal: 9 } },
        "OR": { name: "Oregon", ev: 8, lean: 70, priorities: { clim: 9 } },
        "OK": { name: "Oklahoma", ev: 7, lean: 20, priorities: { energy: 10 } },
        "CT": { name: "Connecticut", ev: 7, lean: 65, priorities: { gun: 8 } },
        "NV": { name: "Nevada", ev: 6, lean: 51.0, priorities: { econ: 10 } },
        "UT": { name: "Utah", ev: 6, lean: 25, priorities: { family: 9 } },
        "AR": { name: "Arkansas", ev: 6, lean: 25, priorities: { gun: 8 } },
        "IA": { name: "Iowa", ev: 6, lean: 40, priorities: { farm: 9 } },
        "KS": { name: "Kansas", ev: 6, lean: 35, priorities: { econ: 8 } },
        "MS": { name: "Mississippi", ev: 6, lean: 28, priorities: { health: 9 } },
        "NM": { name: "New Mexico", ev: 5, lean: 58, priorities: { immig: 7 } },
        "NE": { name: "Nebraska", ev: 5, lean: 30, priorities: { farm: 9 } },
        "WV": { name: "West Virginia", ev: 4, lean: 15, priorities: { energy: 10 } },
        "ID": { name: "Idaho", ev: 4, lean: 20, priorities: { gun: 9 } },
        "HI": { name: "Hawaii", ev: 4, lean: 80, priorities: { tour: 9 } },
        "NH": { name: "New Hampshire", ev: 4, lean: 54, priorities: { tax: 9 } },
        "ME": { name: "Maine", ev: 4, lean: 56, priorities: { fish: 8 } },
        "RI": { name: "Rhode Island", ev: 4, lean: 70, priorities: { econ: 7 } },
        "MT": { name: "Montana", ev: 4, lean: 38, priorities: { land: 9 } },
        "DE": { name: "Delaware", ev: 3, lean: 70, priorities: { corps: 8 } },
        "SD": { name: "South Dakota", ev: 3, lean: 25, priorities: { farm: 9 } },
        "ND": { name: "North Dakota", ev: 3, lean: 20, priorities: { energy: 9 } },
        "AK": { name: "Alaska", ev: 3, lean: 42, priorities: { oil: 10 } },
        "VT": { name: "Vermont", ev: 3, lean: 85, priorities: { health: 10 } },
        "WY": { name: "Wyoming", ev: 3, lean: 15, priorities: { energy: 10 } },
    }
};

// SVG Paths (Simplified polygons for visual map)
const PATHS = {
    "WA": "M 130,20 L 210,25 L 205,80 L 135,70 Z",
    "OR": "M 125,70 L 205,80 L 190,135 L 120,130 Z",
    "CA": "M 120,130 L 190,135 L 220,250 L 160,280 L 100,180 Z",
    "NV": "M 190,135 L 240,140 L 250,230 L 220,250 Z",
    "ID": "M 210,25 L 250,30 L 240,140 L 205,140 L 205,80 Z",
    "MT": "M 250,30 L 400,40 L 390,110 L 240,100 L 240,140 L 250,30 Z",
    "WY": "M 290,110 L 380,115 L 380,180 L 290,175 Z",
    "UT": "M 240,140 L 290,145 L 290,210 L 250,210 L 250,230 L 240,140 Z",
    "AZ": "M 220,250 L 250,230 L 290,235 L 280,330 L 210,310 Z",
    "CO": "M 290,175 L 380,180 L 380,245 L 290,240 Z",
    "NM": "M 290,240 L 370,245 L 370,330 L 280,330 L 290,235 Z",
    "ND": "M 390,40 L 470,45 L 470,90 L 390,90 Z",
    "SD": "M 390,90 L 470,90 L 475,140 L 380,140 L 380,115 Z",
    "NE": "M 380,140 L 475,140 L 480,190 L 380,190 L 380,180 Z",
    "KS": "M 380,190 L 490,195 L 495,245 L 380,245 L 380,245 Z",
    "OK": "M 370,245 L 495,245 L 495,290 L 400,290 L 400,260 L 370,260 Z",
    "TX": "M 370,260 L 400,260 L 400,290 L 510,300 L 520,400 L 440,480 L 380,420 L 330,350 Z",
    "MN": "M 470,45 L 530,50 L 510,120 L 470,120 Z",
    "IA": "M 470,120 L 530,120 L 540,160 L 480,160 L 475,140 Z",
    "MO": "M 480,160 L 560,160 L 560,230 L 500,230 L 495,245 L 490,195 Z",
    "AR": "M 495,245 L 560,245 L 550,300 L 510,300 L 495,290 Z",
    "LA": "M 510,300 L 550,300 L 560,350 L 580,380 L 530,390 L 510,340 Z",
    "WI": "M 530,50 L 580,60 L 580,130 L 530,120 Z",
    "IL": "M 530,120 L 580,130 L 580,210 L 540,220 L 540,160 Z",
    "MS": "M 550,300 L 590,300 L 580,380 L 560,350 Z",
    "MI": "M 580,60 L 650,70 L 640,150 L 580,130 Z",
    "IN": "M 580,130 L 630,135 L 620,200 L 580,210 Z",
    "KY": "M 540,220 L 620,200 L 680,210 L 660,250 L 560,230 Z",
    "TN": "M 560,230 L 660,250 L 640,280 L 550,260 L 560,245 Z",
    "AL": "M 590,300 L 630,300 L 620,380 L 580,380 Z",
    "OH": "M 630,135 L 680,130 L 690,190 L 620,200 Z",
    "GA": "M 630,300 L 680,310 L 680,380 L 620,380 Z",
    "FL": "M 620,380 L 730,390 L 760,490 L 680,480 L 650,400 Z",
    "NY": "M 690,70 L 770,60 L 770,120 L 720,130 L 690,120 Z",
    "PA": "M 690,120 L 760,125 L 750,170 L 690,160 Z",
    "WV": "M 660,190 L 710,180 L 720,210 L 680,210 Z",
    "VA": "M 680,210 L 760,200 L 770,250 L 680,250 L 660,250 Z",
    "NC": "M 640,280 L 750,260 L 780,300 L 680,310 Z",
    "SC": "M 680,310 L 780,300 L 760,350 L 680,350 Z",
    "ME": "M 790,30 L 840,40 L 830,90 L 790,80 Z",
    "VT": "M 770,60 L 790,60 L 790,100 L 770,100 Z",
    "NH": "M 790,60 L 810,65 L 800,105 L 790,100 Z",
    "MA": "M 770,100 L 820,100 L 820,115 L 770,115 Z",
    "RI": "M 800,115 L 820,115 L 820,125 L 800,125 Z",
    "CT": "M 770,115 L 800,115 L 800,125 L 770,125 Z",
    "NJ": "M 760,125 L 775,125 L 775,160 L 760,160 Z",
    "DE": "M 750,170 L 770,170 L 770,190 L 750,185 Z",
    "MD": "M 720,170 L 750,170 L 750,200 L 720,190 Z",
    "HI": "M 250,550 l 10,5 l -5,10 l -10,-5 z",
    "AK": "M 50,450 l 100,0 l 20,50 l -100,10 z"
};

/* --- 3. NAVIGATION LOGIC --- */
function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if(id === 'candidate-screen' && !document.getElementById('candidate-cards').hasChildNodes()) {
        initCandidates();
    }
    if(id === 'vp-screen' && !document.getElementById('vp-cards').hasChildNodes()) {
        initVPs();
    }
    if(id === 'game-screen') {
        startGame();
    }
}

/* --- 4. SELECTION SCREENS --- */
function initCandidates() {
    const container = document.getElementById('candidate-cards');
    CANDIDATES.forEach(c => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="portrait-placeholder">${c.name.charAt(0)}</div>
            <h3>${c.name}</h3>
            <p style="color:#94a3b8; font-size:0.8rem; text-transform:uppercase;">${c.title}</p>
            <p>${c.desc}</p>
            <p style="color:#4ade80; margin-top:10px;">Starting Funds: $${c.funds}M</p>
        `;
        div.onclick = () => selectCandidate(c, div);
        container.appendChild(div);
    });
}

function selectCandidate(c, el) {
    game.candidate = { ...c };
    document.querySelectorAll('#candidate-cards .card').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    
    // Show Platform Editor
    document.getElementById('platform-editor').classList.remove('hidden');
    renderSliders();
}

function renderSliders() {
    const grid = document.getElementById('stance-sliders');
    grid.innerHTML = '';
    
    ISSUES.forEach(issue => {
        const val = game.candidate.stances[issue.id] || 50;
        const row = document.createElement('div');
        row.className = 'slider-row';
        row.innerHTML = `
            <label>
                <span>${issue.name}</span>
                <span id="val-${issue.id}" style="color:var(--accent)">${val}</span>
            </label>
            <input type="range" min="0" max="100" value="${val}"
                oninput="updateStance('${issue.id}', this.value)">
        `;
        grid.appendChild(row);
    });
}

function updateStance(id, val) {
    game.candidate.stances[id] = parseInt(val);
    document.getElementById(`val-${id}`).innerText = val;
}

function initVPs() {
    const container = document.getElementById('vp-cards');
    container.innerHTML = '';
    VPS.forEach(vp => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${vp.name}</h3>
            <p>${vp.desc}</p>
        `;
        div.onclick = () => {
            game.vp = vp;
            document.querySelectorAll('#vp-cards .card').forEach(x => x.classList.remove('selected'));
            div.classList.add('selected');
            // Auto advance after brief delay
            setTimeout(() => goToScreen('game-screen'), 400);
        };
        container.appendChild(div);
    });
}

/* --- 5. MAIN GAME LOGIC --- */
function startGame() {
    // Apply VP Buff
    if(game.vp && game.states[game.vp.buff.state]) {
        game.states[game.vp.buff.state].lean += game.vp.buff.amount;
        showToast(`VP Bonus: +${game.vp.buff.amount}% in ${game.vp.buff.state}`);
    }

    game.funds = game.candidate.funds;
    updateHUD();
    renderMap();
    populateDropdown();
}

function updateHUD() {
    document.getElementById('hud-candidate').innerText = game.candidate.name;
    document.getElementById('hud-funds').innerText = `$${game.funds.toFixed(1)}M`;
    document.getElementById('hud-weeks').innerText = game.weeks;
    
    let ev = 0;
    for(let code in game.states) {
        if(game.states[code].lean > 50) ev += game.states[code].ev;
    }
    document.getElementById('hud-ev').innerText = `${ev} / 270`;
}

function renderMap() {
    const svg = document.getElementById('us-map');
    svg.innerHTML = '';
    
    for (const [code, d] of Object.entries(PATHS)) {
        if(!game.states[code]) continue;
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.id = `state-${code}`;
        path.style.fill = getFillColor(game.states[code].lean);
        
        // Interactions
        path.onclick = () => openStatePanel(code);
        path.onmousemove = (e) => showTooltip(e, code);
        path.onmouseout = hideTooltip;
        
        svg.appendChild(path);
    }
}

function getFillColor(lean) {
    // 45-55 is Tossup range
    if (lean >= 45 && lean <= 55) {
        // Grayish zone
        const dist = lean - 50; // -5 to +5
        // If dist > 0 (Dem lean), slightly blue-gray. If < 0, red-gray.
        if (Math.abs(dist) < 1) return "#94a3b8"; // Pure tossup
        if (dist > 0) return "#64748b"; // Leaning Dem Tossup (Darker Gray)
        return "#7f1d1d"; // Leaning Rep Tossup (Darkish Red Gray) - actually let's use lighter colors requested
        // User requested: 50/50 gray, closer states lighter colors.
        // Let's do:
        // 50 = Gray (#94a3b8)
        // 51-55 = Very light blue (#bfdbfe)
        // 45-49 = Very light red (#fecaca)
    }
    
    // Closer to 50 = Lighter. Further = Darker.
    if(lean > 50) {
        // Dem Side
        // 50 -> 100
        // We want 50 to be light, 100 to be dark blue.
        const opacity = 0.3 + ((lean - 50)/50) * 0.7;
        return `rgba(59, 130, 246, ${opacity})`;
    } else {
        // Rep Side
        // 50 -> 0
        const opacity = 0.3 + ((50 - lean)/50) * 0.7;
        return `rgba(239, 68, 68, ${opacity})`;
    }
}

function openStatePanel(code) {
    game.selectedState = code;
    const data = game.states[code];
    
    document.getElementById('empty-state-msg').classList.add('hidden');
    document.getElementById('state-panel').classList.remove('hidden');
    
    // Populate info
    document.getElementById('sp-name').innerText = data.name;
    document.getElementById('sp-ev').innerText = `${data.ev} EV`;
    
    // Lean Pip
    document.getElementById('sp-pip').style.left = `${data.lean}%`;
    
    // Issues
    const list = document.getElementById('sp-issue-list');
    list.innerHTML = '';
    const sortedIssues = ISSUES.map(i => ({...i, imp: data.priorities[i.id] || 4}))
                               .sort((a,b) => b.imp - a.imp).slice(0, 5);
                               
    sortedIssues.forEach(item => {
        const row = document.createElement('div');
        row.className = 'issue-item';
        row.innerHTML = `
            <span>${item.name}</span>
            <div class="bar-bg"><div class="bar-fill" style="width:${item.imp * 10}%"></div></div>
        `;
        list.appendChild(row);
    });
    
    // Reset Dropdown feedback
    document.getElementById('sp-feedback').innerText = "Select an issue...";
}

function populateDropdown() {
    const sel = document.getElementById('sp-issue-select');
    sel.innerHTML = '';
    ISSUES.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.innerText = i.name;
        sel.appendChild(opt);
    });
    
    sel.onchange = () => {
        if(!game.selectedState) return;
        const imp = game.states[game.selectedState].priorities[sel.value] || 4;
        const fb = document.getElementById('sp-feedback');
        fb.innerText = `Relevance: ${imp}/10`;
        fb.style.color = imp > 7 ? '#fbbf24' : '#94a3b8';
    };
}

function runCampaign() {
    if(!game.selectedState || game.funds < 0.1) {
        showToast("Not enough funds!");
        return;
    }
    
    game.funds -= 0.1;
    
    const issueID = document.getElementById('sp-issue-select').value;
    const state = game.states[game.selectedState];
    const relevance = state.priorities[issueID] || 4;
    
    // Calculate Shift
    // Base 1.5% + (Relevance * 0.2)
    const shift = 1.0 + (relevance * 0.3);
    state.lean += shift;
    if(state.lean > 100) state.lean = 100;
    
    updateHUD();
    renderMap(); // Redraw map colors
    openStatePanel(game.selectedState); // Update sidebar visuals
    
    showToast(`Campaign in ${state.name}: Polls +${shift.toFixed(1)}%`);
}

/* --- 6. UTILITIES --- */
function showTooltip(e, code) {
    const tt = document.getElementById('map-tooltip');
    const data = game.states[code];
    tt.style.display = 'block';
    tt.style.left = (e.pageX + 15) + 'px';
    tt.style.top = (e.pageY + 15) + 'px';
    tt.innerHTML = `<strong>${data.name}</strong><br>${data.lean.toFixed(1)}% Dem`;
}
function hideTooltip() { document.getElementById('map-tooltip').style.display = 'none'; }

function showToast(msg) {
    const t = document.getElementById('notification-toast');
    t.innerText = msg;
    t.style.opacity = 1;
    setTimeout(() => t.style.opacity = 0, 2500);
}
