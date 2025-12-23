/* --- DATA --- */

const ISSUES = [
    { id: 'econ', name: 'Economy' },
    { id: 'abort', name: 'Abortion' },
    { id: 'immig', name: 'Immigration' },
    { id: 'clim', name: 'Climate Change' },
    { id: 'gun', name: 'Gun Control' },
    { id: 'foreign', name: 'Foreign Policy' },
    { id: 'dem', name: 'Democracy' },
    { id: 'health', name: 'Healthcare' },
    { id: 'crime', name: 'Crime/Safety' },
    { id: 'edu', name: 'Education' },
    { id: 'trade', name: 'Trade' },
    { id: 'tech', name: 'Tech Regulation' }
];

const CANDIDATES = [
    {
        id: 'harris',
        name: 'Kamala Harris',
        party: 'Dem',
        desc: 'Current Vice President. Strong on social issues, polarizing on crime.',
        funds: 15.0,
        baseStances: {
            econ: 60, abort: 100, immig: 55, clim: 85, gun: 90, 
            foreign: 70, dem: 95, health: 80, crime: 60, edu: 85, trade: 60, tech: 70
        }
    },
    {
        id: 'newsom',
        name: 'Gavin Newsom',
        party: 'Dem',
        desc: 'Governor of CA. Slick debater, strong progressive, but viewed as elitist.',
        funds: 20.0,
        baseStances: {
            econ: 65, abort: 100, immig: 80, clim: 95, gun: 95, 
            foreign: 60, dem: 80, health: 90, crime: 50, edu: 80, trade: 70, tech: 90
        }
    }
];

const VPS = [
    { 
        id: 'shapiro', name: 'Josh Shapiro', 
        desc: 'Governor of PA. Huge boost in the Rust Belt.',
        buffs: { state: 'PA', amount: 5, issue: 'econ' } 
    },
    { 
        id: 'kelly', name: 'Mark Kelly', 
        desc: 'Senator from AZ. Strong on Border/Guns.',
        buffs: { state: 'AZ', amount: 5, issue: 'gun' } 
    },
    { 
        id: 'walz', name: 'Tim Walz', 
        desc: 'Governor of MN. Mid-western appeal.',
        buffs: { state: 'MN', amount: 4, issue: 'labor' } // 'labor' maps to econ loosely in logic
    }
];

// Simplified State Data (Lean: 0=Rep, 100=Dem)
// Priorities: key=issueID, val=importance(1-10)
const STATES = {
    "CA": { name: "California", ev: 54, lean: 85, priorities: { clim: 10, immig: 8 } },
    "TX": { name: "Texas", ev: 40, lean: 35, priorities: { immig: 10, gun: 9, energy: 9 } },
    "FL": { name: "Florida", ev: 30, lean: 38, priorities: { econ: 9, immig: 8 } },
    "NY": { name: "New York", ev: 28, lean: 80, priorities: { crime: 8, econ: 8 } },
    "PA": { name: "Pennsylvania", ev: 19, lean: 50.5, priorities: { econ: 10, energy: 9 } },
    "IL": { name: "Illinois", ev: 19, lean: 75, priorities: { crime: 8 } },
    "OH": { name: "Ohio", ev: 17, lean: 42, priorities: { trade: 9, econ: 9 } },
    "GA": { name: "Georgia", ev: 16, lean: 49.8, priorities: { dem: 9, econ: 8 } },
    "NC": { name: "North Carolina", ev: 16, lean: 48.5, priorities: { edu: 8, econ: 8 } },
    "MI": { name: "Michigan", ev: 15, lean: 51.2, priorities: { trade: 9, dem: 8 } },
    "AZ": { name: "Arizona", ev: 11, lean: 49.5, priorities: { immig: 10, water: 9 } },
    "WI": { name: "Wisconsin", ev: 10, lean: 50.1, priorities: { econ: 9, dem: 8 } },
    "NV": { name: "Nevada", ev: 6, lean: 50.2, priorities: { econ: 10, immig: 8 } },
    // Fillers for visual completeness
    "WA": { name: "Washington", ev: 12, lean: 78, priorities: { clim: 9 } },
    "OR": { name: "Oregon", ev: 8, lean: 72, priorities: { clim: 9 } },
    "ID": { name: "Idaho", ev: 4, lean: 20, priorities: { gun: 9 } },
    "UT": { name: "Utah", ev: 6, lean: 25, priorities: { family: 9 } },
    "CO": { name: "Colorado", ev: 10, lean: 62, priorities: { clim: 8 } },
    "NM": { name: "New Mexico", ev: 5, lean: 60, priorities: { immig: 7 } },
    "MN": { name: "Minnesota", ev: 10, lean: 55, priorities: { health: 8 } },
    "VA": { name: "Virginia", ev: 13, lean: 56, priorities: { defense: 8 } },
    "SC": { name: "South Carolina", ev: 9, lean: 38, priorities: { econ: 8 } },
    "AL": { name: "Alabama", ev: 9, lean: 25, priorities: { religion: 9 } },
    "LA": { name: "Louisiana", ev: 8, lean: 30, priorities: { energy: 9 } },
    "KY": { name: "Kentucky", ev: 8, lean: 28, priorities: { coal: 9 } },
    "TN": { name: "Tennessee", ev: 11, lean: 30, priorities: { gun: 9 } },
    "IN": { name: "Indiana", ev: 11, lean: 35, priorities: { trade: 8 } },
    "MO": { name: "Missouri", ev: 10, lean: 38, priorities: { gun: 8 } },
    "OK": { name: "Oklahoma", ev: 7, lean: 20, priorities: { energy: 10 } },
    "AR": { name: "Arkansas", ev: 6, lean: 25, priorities: { gun: 8 } },
    "MS": { name: "Mississippi", ev: 6, lean: 28, priorities: { health: 9 } },
    "KS": { name: "Kansas", ev: 6, lean: 35, priorities: { econ: 8 } },
    "IA": { name: "Iowa", ev: 6, lean: 40, priorities: { farm: 9 } },
    "NE": { name: "Nebraska", ev: 5, lean: 30, priorities: { farm: 9 } },
    "WV": { name: "West Virginia", ev: 4, lean: 15, priorities: { energy: 10 } },
    "MD": { name: "Maryland", ev: 10, lean: 75, priorities: { edu: 8 } },
    "DE": { name: "Delaware", ev: 3, lean: 70, priorities: { corps: 8 } },
    "NJ": { name: "New Jersey", ev: 14, lean: 65, priorities: { tax: 9 } },
    "CT": { name: "Connecticut", ev: 7, lean: 68, priorities: { gun: 8 } },
    "MA": { name: "Massachusetts", ev: 11, lean: 80, priorities: { edu: 10 } },
    "VT": { name: "Vermont", ev: 3, lean: 85, priorities: { health: 10 } },
    "NH": { name: "New Hampshire", ev: 4, lean: 54, priorities: { tax: 9 } },
    "ME": { name: "Maine", ev: 4, lean: 58, priorities: { fish: 8 } },
    "RI": { name: "Rhode Island", ev: 4, lean: 70, priorities: { econ: 7 } },
    "MT": { name: "Montana", ev: 4, lean: 38, priorities: { land: 9 } },
    "WY": { name: "Wyoming", ev: 3, lean: 15, priorities: { energy: 10 } },
    "ND": { name: "North Dakota", ev: 3, lean: 20, priorities: { energy: 9 } },
    "SD": { name: "South Dakota", ev: 3, lean: 25, priorities: { farm: 9 } },
    "AK": { name: "Alaska", ev: 3, lean: 42, priorities: { oil: 10 } },
    "HI": { name: "Hawaii", ev: 4, lean: 80, priorities: { tour: 9 } }
};

// Simplified SVG Paths for visual representation
const PATHS = {
    // A subset of paths for the example to work. In a full version, all 50 states are needed.
    // I will include the critical ones for a visual demo.
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

/* --- STATE MANAGEMENT --- */

let gameState = {
    candidate: null,
    vp: null,
    funds: 0,
    weeks: 12,
    selectedState: null
};

/* --- INIT & NAVIGATION --- */

function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'candidate-screen') loadCandidates();
    if (screenId === 'vp-screen') loadVPs();
    if (screenId === 'game-screen') startGame();
}

/* --- CANDIDATE SELECTION --- */

function loadCandidates() {
    const container = document.getElementById('candidate-cards');
    container.innerHTML = '';
    
    CANDIDATES.forEach(cand => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3>${cand.name}</h3><p>${cand.desc}</p><p style="color:#4ade80; margin-top:5px;">$${cand.funds}M Funds</p>`;
        div.onclick = () => selectCandidate(cand, div);
        container.appendChild(div);
    });
}

function selectCandidate(cand, el) {
    gameState.candidate = { ...cand }; // Clone
    document.querySelectorAll('#candidate-cards .card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    
    // Show Stance Editor
    renderSliders();
    document.getElementById('stance-editor').classList.remove('hidden');
}

function renderSliders() {
    const cont = document.getElementById('stance-sliders-container');
    cont.innerHTML = '';
    
    ISSUES.forEach(issue => {
        const val = gameState.candidate.baseStances[issue.id] || 50;
        const row = document.createElement('div');
        row.className = 'slider-row';
        row.innerHTML = `
            <label>${issue.name}</label>
            <input type="range" min="0" max="100" value="${val}" 
                oninput="updateStance('${issue.id}', this.value)">
            <span id="val-${issue.id}">${val}</span>
        `;
        cont.appendChild(row);
    });
}

function updateStance(id, val) {
    gameState.candidate.baseStances[id] = parseInt(val);
    document.getElementById(`val-${id}`).innerText = val;
}

function confirmCandidate() {
    if (!gameState.candidate) return;
    goToScreen('vp-screen');
}

/* --- VP SELECTION --- */

function loadVPs() {
    const container = document.getElementById('vp-cards');
    container.innerHTML = '';
    
    VPS.forEach(vp => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3>${vp.name}</h3><p>${vp.desc}</p>`;
        div.onclick = () => {
            document.querySelectorAll('#vp-cards .card').forEach(c => c.classList.remove('selected'));
            div.classList.add('selected');
            gameState.vp = vp;
            // Delay for effect then start
            setTimeout(() => goToScreen('game-screen'), 500);
        };
        container.appendChild(div);
    });
}

/* --- MAIN GAME --- */

function startGame() {
    gameState.funds = gameState.candidate.funds;
    document.getElementById('header-candidate').innerText = gameState.candidate.name;
    document.getElementById('funds-display').innerText = `$${gameState.funds.toFixed(1)}M`;
    
    // Apply VP Buffs
    if (gameState.vp && gameState.vp.buffs) {
        const b = gameState.vp.buffs;
        if (STATES[b.state]) {
            STATES[b.state].lean += b.amount;
        }
    }

    renderMap();
    populateIssues();
}

function renderMap() {
    const svg = document.getElementById('us-map');
    svg.innerHTML = ''; // Clear existing
    
    let totalEV = 0;

    for (const [code, pathData] of Object.entries(PATHS)) {
        if (!STATES[code]) continue;
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("id", `state-${code}`);
        
        // Coloring Logic
        const lean = STATES[code].lean;
        path.style.fill = getLeanColor(lean);
        
        path.onclick = () => selectState(code);
        path.onmousemove = (e) => showTooltip(e, code);
        path.onmouseout = () => document.getElementById('tooltip').style.display = 'none';

        svg.appendChild(path);

        // EV Counter
        if (lean > 50) totalEV += STATES[code].ev;
    }
    
    document.getElementById('ev-display').innerText = `${totalEV} / 270`;
}

function getLeanColor(lean) {
    // 50/50 States are Gray
    // 45-55 scale
    if (lean >= 45 && lean <= 55) {
        // Calculate closeness to 50
        const dist = lean - 50; // -5 to +5
        if (Math.abs(dist) < 1) return "#94a3b8"; // Pure Tossup Gray
        return dist > 0 ? "#93c5fd" : "#fca5a5"; // Pale Blue or Pale Red
    }
    if (lean > 55) {
        // Blue Scale
        const alpha = 0.4 + ((lean - 55) / 45) * 0.6;
        return `rgba(37, 99, 235, ${alpha})`;
    } else {
        // Red Scale
        const alpha = 0.4 + ((45 - lean) / 45) * 0.6;
        return `rgba(220, 38, 38, ${alpha})`;
    }
}

function selectState(code) {
    gameState.selectedState = code;
    const data = STATES[code];
    const panel = document.getElementById('state-info-panel');
    
    document.getElementById('empty-state-msg').style.display = 'none';
    panel.classList.remove('hidden');
    
    document.getElementById('state-name').innerText = `${data.name} (${data.ev} EV)`;
    
    // Lean Marker
    const marker = document.getElementById('lean-marker');
    marker.style.left = `${data.lean}%`;
    
    // Render Issues List
    const list = document.getElementById('state-issues-list');
    list.innerHTML = '';
    
    const relevantIssues = ISSUES.map(i => ({
        ...i,
        imp: data.priorities[i.id] || 4
    })).sort((a,b) => b.imp - a.imp).slice(0, 5);
    
    relevantIssues.forEach(i => {
        const row = document.createElement('div');
        row.className = 'issue-row';
        row.innerHTML = `<span>${i.name}</span><div class="bar-track"><div class="bar-fill" style="width:${i.imp*10}%"></div></div>`;
        list.appendChild(row);
    });
}

function populateIssues() {
    const sel = document.getElementById('issue-select');
    sel.innerHTML = '';
    ISSUES.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.innerText = i.name;
        sel.appendChild(opt);
    });
}

function campaignInState() {
    if (!gameState.selectedState || gameState.funds < 0.1) return;
    
    const code = gameState.selectedState;
    const issueId = document.getElementById('issue-select').value;
    const stateData = STATES[code];
    
    // Campaign Logic
    // Cost
    gameState.funds -= 0.1;
    document.getElementById('funds-display').innerText = `$${gameState.funds.toFixed(1)}M`;
    
    // Impact Calculation
    // Base 1.5% shift + bonus if issue is important
    const importance = stateData.priorities[issueId] || 4;
    let shift = 1.5 + (importance / 5);
    
    // If candidate stance is very far from safe state, reduced effect? 
    // For simplicity: always positive shift for player in this sim
    stateData.lean += shift;
    if (stateData.lean > 100) stateData.lean = 100;
    
    // Update visual
    renderMap();
    selectState(code); // Update sidebar bar
    
    showNotification(`Campaigned in ${stateData.name}! Polls +${shift.toFixed(1)}%`);
}

function showTooltip(e, code) {
    const tt = document.getElementById('tooltip');
    tt.style.display = 'block';
    tt.style.left = (e.pageX + 10) + 'px';
    tt.style.top = (e.pageY + 10) + 'px';
    tt.innerText = `${STATES[code].name}: ${STATES[code].lean.toFixed(1)}% D`;
}

function showNotification(msg) {
    const n = document.getElementById('notification-area');
    n.innerText = msg;
    n.style.opacity = 1;
    setTimeout(() => n.style.opacity = 0, 2000);
}
