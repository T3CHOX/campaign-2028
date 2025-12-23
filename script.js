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
    { id: 'crime', name: 'Criminal Justice' },
    { id: 'edu', name: 'Education' },
    { id: 'trade', name: 'Trade' },
    { id: 'tech', name: 'Tech Regulation' }
];

const CANDIDATES = [
    {
        id: 'harris', name: "Kamala Harris",
        img: "https://via.placeholder.com/150/0000FF/808080?text=Kamala", // Replace with real URL
        desc: "Current VP. Strong on Social Issues.",
        funds: 50.0,
        stances: { econ: 65, abort: 100, immig: 55, clim: 85, gun: 90, foreign: 75, lgbt: 100, edu: 85, health: 80, crime: 60, trade: 60, dem: 95 }
    },
    {
        id: 'newsom', name: "Gavin Newsom",
        img: "https://via.placeholder.com/150/0000FF/808080?text=Gavin", // Replace with real URL
        desc: "Governor of CA. Progressive platform.",
        funds: 60.0,
        stances: { econ: 60, abort: 100, immig: 70, clim: 95, gun: 95, foreign: 65, lgbt: 100, edu: 90, health: 90, crime: 50, trade: 70, dem: 90 }
    }
];

const VPS = [
    { id: 'shapiro', name: "Josh Shapiro", desc: "PA Governor. Rust Belt boost.", buffState: "PA" },
    { id: 'kelly', name: "Mark Kelly", desc: "AZ Senator. Border/Gun moderate.", buffState: "AZ" },
    { id: 'walz', name: "Tim Walz", desc: "MN Governor. Midwest appeal.", buffState: "MN" }
];

// Simplified State Data
const STATES_DATA = {
    "AL": { name: "Alabama", ev: 9, lean: 15, priorities: { crime: 8, immig: 7 } },
    "AK": { name: "Alaska", ev: 3, lean: 20, priorities: { clim: 6, econ: 8 } },
    "AZ": { name: "Arizona", ev: 11, lean: 49.5, priorities: { immig: 10, econ: 8 } },
    "CA": { name: "California", ev: 54, lean: 85, priorities: { clim: 10, lgbt: 9 } },
    "FL": { name: "Florida", ev: 30, lean: 35, priorities: { immig: 8, econ: 9 } },
    "GA": { name: "Georgia", ev: 16, lean: 49.8, priorities: { dem: 9, econ: 8 } },
    "MI": { name: "Michigan", ev: 15, lean: 51, priorities: { trade: 10, econ: 9 } },
    "NV": { name: "Nevada", ev: 6, lean: 50.5, priorities: { econ: 10, immig: 8 } },
    "NY": { name: "New York", ev: 28, lean: 85, priorities: { crime: 8, housing: 9 } },
    "NC": { name: "North Carolina", ev: 16, lean: 48, priorities: { edu: 8, econ: 9 } },
    "OH": { name: "Ohio", ev: 17, lean: 30, priorities: { trade: 9, econ: 9 } },
    "PA": { name: "Pennsylvania", ev: 19, lean: 50.2, priorities: { econ: 10, energy: 9 } },
    "TX": { name: "Texas", ev: 40, lean: 35, priorities: { immig: 10, energy: 9 } },
    "WI": { name: "Wisconsin", ev: 10, lean: 50.1, priorities: { econ: 9, dairy: 8 } }
    // Add other states as needed...
};

// SVG Paths (Abbreviated for length, same as before)
const STATE_PATHS = {
    "WA": "M 130,20 L 210,25 L 205,80 L 135,70 Z",
    "OR": "M 125,70 L 205,80 L 190,135 L 120,130 Z",
    "CA": "M 120,130 L 190,135 L 220,250 L 160,280 L 100,180 Z",
    "NV": "M 190,135 L 240,140 L 250,230 L 220,250 Z",
    "AZ": "M 220,250 L 250,230 L 290,235 L 280,330 L 210,310 Z",
    "TX": "M 370,260 L 400,260 L 400,290 L 510,300 L 520,400 L 440,480 L 380,420 L 330,350 Z",
    "FL": "M 620,380 L 730,390 L 760,490 L 680,480 L 650,400 Z",
    "NY": "M 690,70 L 770,60 L 770,120 L 720,130 L 690,120 Z",
    "PA": "M 690,120 L 760,125 L 750,170 L 690,160 Z",
    "MI": "M 580,60 L 650,70 L 640,150 L 580,130 Z",
    "GA": "M 630,300 L 680,310 L 680,380 L 620,380 Z",
    "OH": "M 630,135 L 680,130 L 690,190 L 620,200 Z",
    "NC": "M 640,280 L 750,260 L 780,300 L 680,310 Z",
    "WI": "M 530,50 L 580,60 L 580,130 L 530,120 Z"
    // Keep adding the paths from the previous iteration here
};

/* --- LOGIC --- */

let selectedCandidate = null;
let selectedVP = null;
let selectedState = null;

// 1. Initialize
function init() {
    renderCandidates();
    renderMap();
    populateIssueSelect();
}

// 2. Candidate Screen
function renderCandidates() {
    const container = document.getElementById('candidate-cards');
    CANDIDATES.forEach(c => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="portrait-box"><img src="${c.img}" alt="${c.name}"></div>
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
        `;
        div.onclick = () => selectCandidate(c, div);
        container.appendChild(div);
    });
}

function selectCandidate(cand, el) {
    selectedCandidate = { ...cand }; // clone
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    
    // Show Sliders
    const editor = document.getElementById('policy-editor');
    editor.classList.remove('hidden');
    const grid = document.getElementById('stance-sliders');
    grid.innerHTML = '';
    
    ISSUES.forEach(issue => {
        const val = selectedCandidate.stances[issue.id] || 50;
        const div = document.createElement('div');
        div.className = 'slider-item';
        div.innerHTML = `
            <label>${issue.name} (<span id="val-${issue.id}">${val}</span>)</label>
            <input type="range" min="0" max="100" value="${val}" 
                oninput="updateStance('${issue.id}', this.value)">
        `;
        grid.appendChild(div);
    });
}

function updateStance(id, val) {
    selectedCandidate.stances[id] = parseInt(val);
    document.getElementById(`val-${id}`).innerText = val;
}

function goToVP() {
    document.getElementById('selection-screen').classList.remove('active');
    document.getElementById('vp-screen').classList.add('active');
    renderVPs();
}

// 3. VP Screen
function renderVPs() {
    const container = document.getElementById('vp-cards');
    if(container.children.length > 0) return;
    
    VPS.forEach(vp => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3>${vp.name}</h3><p>${vp.desc}</p>`;
        div.onclick = () => {
            selectedVP = vp;
            startGame();
        };
        container.appendChild(div);
    });
}

function backToCandidate() {
    document.getElementById('vp-screen').classList.remove('active');
    document.getElementById('selection-screen').classList.add('active');
}

// 4. Game Screen
function startGame() {
    document.getElementById('vp-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // Apply VP Buff
    if (selectedVP && STATES_DATA[selectedVP.buffState]) {
        STATES_DATA[selectedVP.buffState].lean += 5;
    }

    // Set Header
    document.getElementById('header-candidate').innerText = selectedCandidate.name;
    document.getElementById('funds-display').innerText = `$${selectedCandidate.funds}M`;
    
    updateMap();
}

function renderMap() {
    const svg = document.getElementById('us-map');
    for (const [code, d] of Object.entries(STATE_PATHS)) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("id", `state-${code}`);
        path.onclick = () => selectState(code);
        path.onmousemove = (e) => showTooltip(e, code);
        path.onmouseout = () => document.getElementById('tooltip').style.display = 'none';
        svg.appendChild(path);
    }
}

function updateMap() {
    let ev = 0;
    for (const [code, data] of Object.entries(STATES_DATA)) {
        const path = document.getElementById(`state-${code}`);
        if(path) {
            path.style.fill = getStateColor(data.lean);
            if(data.lean > 50) ev += data.ev;
        }
    }
    document.getElementById('ev-display').innerText = `${ev} / 270`;
}

function getStateColor(lean) {
    if (lean >= 45 && lean <= 55) {
        const dist = lean - 50;
        if (Math.abs(dist) < 1) return "#b0b0b0"; // Pure Tossup
        return dist > 0 ? "#93c5fd" : "#fca5a5"; 
    }
    if (lean > 55) {
        const intensity = (lean - 55) / 45; 
        return `rgba(0, 174, 243, ${0.4 + (intensity * 0.6)})`;
    } else {
        const intensity = (45 - lean) / 45;
        return `rgba(232, 27, 35, ${0.4 + (intensity * 0.6)})`;
    }
}

function selectState(code) {
    selectedState = code;
    const data = STATES_DATA[code];
    const panel = document.getElementById('state-panel');
    
    document.getElementById('empty-state-msg').style.display = 'none';
    panel.style.display = 'block';
    
    document.getElementById('state-name').innerText = data.name;
    document.getElementById('state-ev').innerText = `${data.ev} EV`;
    
    // Status
    let status = "Tossup";
    if (data.lean > 55) status = "Lean Dem";
    if (data.lean < 45) status = "Lean Rep";
    document.getElementById('state-status').innerText = status;

    // Bar
    document.getElementById('lean-marker').style.left = `${data.lean}%`;

    // Issues
    const list = document.getElementById('state-issues-list');
    list.innerHTML = '';
    const relevant = ISSUES.map(i => ({...i, imp: data.priorities[i.id]||4}))
                           .sort((a,b)=>b.imp-a.imp).slice(0,5);
    relevant.forEach(i => {
        const div = document.createElement('div');
        div.className = 'issue-item';
        div.innerHTML = `<span>${i.name}</span><div class="issue-track"><div class="issue-fill" style="width:${i.imp*10}%"></div></div>`;
        list.appendChild(div);
    });
}

function populateIssueSelect() {
    const sel = document.getElementById('issue-select');
    ISSUES.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.innerText = i.name;
        sel.appendChild(opt);
    });
    sel.onchange = () => {
        if(!selectedState) return;
        const imp = STATES_DATA[selectedState].priorities[sel.value] || 4;
        document.getElementById('issue-feedback').innerText = `Importance: ${imp}/10`;
    }
}

function runCampaign() {
    if (!selectedState || selectedCandidate.funds < 0.1) return;
    selectedCandidate.funds -= 0.1;
    document.getElementById('funds-display').innerText = `$${selectedCandidate.funds.toFixed(1)}M`;
    
    const imp = STATES_DATA[selectedState].priorities[document.getElementById('issue-select').value] || 4;
    STATES_DATA[selectedState].lean += (1.5 + (imp/5)); 
    if(STATES_DATA[selectedState].lean > 100) STATES_DATA[selectedState].lean = 100;
    
    updateMap();
    selectState(selectedState);
    
    const notif = document.getElementById('notification-area');
    notif.innerText = `Campaign successful in ${STATES_DATA[selectedState].name}`;
    notif.style.opacity = 1;
    setTimeout(()=>notif.style.opacity=0, 2000);
}

function showTooltip(e, code) {
    const tt = document.getElementById('tooltip');
    tt.style.display = 'block';
    tt.style.left = (e.clientX + 15) + 'px';
    tt.style.top = (e.clientY + 15) + 'px';
    tt.innerText = `${STATES_DATA[code].name}: ${STATES_DATA[code].lean.toFixed(1)}% (D)`;
}

init();
