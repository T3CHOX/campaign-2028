/* --- CONFIGURATION & DATA --- */
const PARTIES = {
    D: { name: "Democratic", color: "#0056b3" },
    R: { name: "Republican", color: "#d32f2f" },
    I: { name: "Independent", color: "#d4a017" },
    G: { name: "Green", color: "#198754" },
    L: { name: "Libertarian", color: "#fd7e14" }
};

// Expanded Issue List (12 Issues)
const ISSUES = [
    { id: 'econ', name: 'Economy: Inflation' },
    { id: 'jobs', name: 'Economy: Jobs' },
    { id: 'tax', name: 'Tax Policy' },
    { id: 'health', name: 'Healthcare' },
    { id: 'immig', name: 'Immigration' },
    { id: 'clim', name: 'Climate Change' },
    { id: 'gun', name: 'Gun Control' },
    { id: 'abort', name: 'Abortion Rights' },
    { id: 'foreign', name: 'Foreign Policy' },
    { id: 'edu', name: 'Education' },
    { id: 'crime', name: 'Crime & Safety' },
    { id: 'socsec', name: 'Social Security' }
];

// Interest Groups
const INTEREST_GROUPS = [
    { id: 'aa', name: 'African American' },
    { id: 'his', name: 'Hispanic/Latino' },
    { id: 'union', name: 'Union Workers' },
    { id: 'evang', name: 'Evangelicals' },
    { id: 'youth', name: 'Youth (<30)' },
    { id: 'senior', name: 'Seniors (65+)' },
    { id: 'rural', name: 'Rural Voters' },
    { id: 'sub', name: 'Suburban' }
];

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", stamina: 8 },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", stamina: 9 },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer.jpg", stamina: 8 },
    { id: "desantis", name: "Ron DeSantis", party: "R", funds: 65, img: "images/desantis.jpg", stamina: 9 },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", stamina: 8 },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", stamina: 10 }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA" },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ" },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL" },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY" }
];

// Base State Data (EVs + Polling)
const INIT_STATES = {
    "AL": { name: "Alabama", ev: 9, poll: 35 }, "AK": { name: "Alaska", ev: 3, poll: 42 }, "AZ": { name: "Arizona", ev: 11, poll: 49.5 },
    "AR": { name: "Arkansas", ev: 6, poll: 35 }, "CA": { name: "California", ev: 54, poll: 65 }, "CO": { name: "Colorado", ev: 10, poll: 56 },
    "CT": { name: "Connecticut", ev: 7, poll: 59 }, "DE": { name: "Delaware", ev: 3, poll: 62 }, "DC": { name: "D.C.", ev: 3, poll: 92 },
    "FL": { name: "Florida", ev: 30, poll: 46 }, "GA": { name: "Georgia", ev: 16, poll: 49.2 }, "HI": { name: "Hawaii", ev: 4, poll: 68 },
    "ID": { name: "Idaho", ev: 4, poll: 30 }, "IL": { name: "Illinois", ev: 19, poll: 57 }, "IN": { name: "Indiana", ev: 11, poll: 40 },
    "IA": { name: "Iowa", ev: 6, poll: 43 }, "KS": { name: "Kansas", ev: 6, poll: 40 }, "KY": { name: "Kentucky", ev: 8, poll: 35 },
    "LA": { name: "Louisiana", ev: 8, poll: 38 }, "ME": { name: "Maine", ev: 4, poll: 55 }, "MD": { name: "Maryland", ev: 10, poll: 65 },
    "MA": { name: "Massachusetts", ev: 11, poll: 68 }, "MI": { name: "Michigan", ev: 15, poll: 51.5 }, "MN": { name: "Minnesota", ev: 10, poll: 54 },
    "MS": { name: "Mississippi", ev: 6, poll: 38 }, "MO": { name: "Missouri", ev: 10, poll: 42 }, "MT": { name: "Montana", ev: 4, poll: 40 },
    "NE": { name: "Nebraska", ev: 5, poll: 38 }, "NV": { name: "Nevada", ev: 6, poll: 50.5 }, "NH": { name: "New Hampshire", ev: 4, poll: 53 },
    "NJ": { name: "New Jersey", ev: 14, poll: 58 }, "NM": { name: "New Mexico", ev: 5, poll: 54 }, "NY": { name: "New York", ev: 28, poll: 62 },
    "NC": { name: "North Carolina", ev: 16, poll: 48.5 }, "ND": { name: "North Dakota", ev: 3, poll: 30 }, "OH": { name: "Ohio", ev: 17, poll: 45 },
    "OK": { name: "Oklahoma", ev: 7, poll: 32 }, "OR": { name: "Oregon", ev: 8, poll: 58 }, "PA": { name: "Pennsylvania", ev: 19, poll: 50.2 },
    "RI": { name: "Rhode Island", ev: 4, poll: 60 }, "SC": { name: "South Carolina", ev: 9, poll: 42 }, "SD": { name: "South Dakota", ev: 3, poll: 35 },
    "TN": { name: "Tennessee", ev: 11, poll: 37 }, "TX": { name: "Texas", ev: 40, poll: 44 }, "UT": { name: "Utah", ev: 6, poll: 38 },
    "VT": { name: "Vermont", ev: 3, poll: 66 }, "VA": { name: "Virginia", ev: 13, poll: 54 }, "WA": { name: "Washington", ev: 12, poll: 60 },
    "WV": { name: "West Virginia", ev: 4, poll: 28 }, "WI": { name: "Wisconsin", ev: 10, poll: 50.8 }, "WY": { name: "Wyoming", ev: 3, poll: 25 }
};

/* --- APP ENGINE --- */
const app = {
    data: {
        currentDate: new Date("2028-07-04"),
        electionDay: new Date("2028-11-07"),
        
        selectedParty: null,
        candidate: null,
        vp: null,
        opponent: null,
        
        funds: 0,
        energy: 8,
        maxEnergy: 8,
        
        states: {},
        selectedState: null,
        
        // Undo System
        historyStack: [],
        turnStartSnapshot: null
    },

    init: function() {
        // Initialize States with advanced data
        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        
        for(let s in this.data.states) {
            // Generate Random Issue Priorities (1-10)
            this.data.states[s].priorities = {};
            ISSUES.forEach(i => {
                this.data.states[s].priorities[i.id] = Math.floor(Math.random() * 10) + 1;
            });

            // Generate Random Demographics (Interest Groups)
            this.data.states[s].demographics = {};
            INTEREST_GROUPS.forEach(ig => {
                // Rough randomization logic for flavor
                this.data.states[s].demographics[ig.id] = Math.floor(Math.random() * 30) + 5; 
            });
            
            this.data.states[s].moe = (Math.random() * 2 + 1.5).toFixed(1);
            this.data.states[s].donorFatigue = 0; // New Mechanic
        }

        this.renderParties();
        this.initIssues();
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    /* --- SETUP PHASE --- */
    renderParties: function() {
        const c = document.getElementById('party-cards');
        if(!c) return; c.innerHTML = "";
        for(let k in PARTIES) {
            if(k==='G'||k==='L') continue;
            c.innerHTML += `<div class="card" onclick="app.selParty('${k}')" style="border-top:5px solid ${PARTIES[k].color}"><div class="card-info"><h3>${PARTIES[k].name}</h3><p>${PARTIES[k].desc}</p></div></div>`;
        }
    },
    selParty: function(k) { this.data.selectedParty = k; this.renderCands(k); this.goToScreen('candidate-screen'); },

    renderCands: function(pk) {
        const c = document.getElementById('candidate-cards');
        c.innerHTML = "";
        const list = CANDIDATES.filter(x => x.party === pk);
        list.forEach(cand => {
            const img = cand.img ? `<img src="${cand.img}">` : "";
            c.innerHTML += `<div class="card" onclick="app.selCand('${cand.id}')"><div class="portrait">${img}</div><div class="card-info"><h3>${cand.name}</h3><p>${cand.desc}</p><p class="buff-text">Stamina: ${cand.stamina}</p></div></div>`;
        });
    },
    selCand: function(id) { 
        this.data.candidate = CANDIDATES.find(x => x.id === id); 
        this.data.maxEnergy = this.data.candidate.stamina; // Set Stamina
        this.data.energy = this.data.maxEnergy;
        this.renderVPs(this.data.candidate.party); 
        this.goToScreen('vp-screen'); 
    },

    renderVPs: function(pk) {
        const c = document.getElementById('vp-cards');
        c.innerHTML = "";
        VPS.filter(x => x.party === pk).forEach(v => {
            c.innerHTML += `<div class="card" onclick="app.selVP('${v.id}')"><div class="card-info"><h3>${v.name}</h3><p>${v.state}</p></div></div>`;
        });
    },
    selVP: function(id) { 
        this.data.vp = VPS.find(x => x.id === id); 
        this.renderOpponent();
        this.goToScreen('opponent-screen'); 
    },

    renderOpponent: function() {
        const c = document.getElementById('opponent-cards-major');
        c.innerHTML = "";
        let rivalP = (this.data.selectedParty === 'D') ? 'R' : 'D';
        CANDIDATES.filter(x => x.party === rivalP).forEach(opp => {
            c.innerHTML += `<div class="card" onclick="app.selOpp('${opp.id}')"><div class="card-info"><h3>${opp.name}</h3><p>${PARTIES[opp.party].name}</p></div></div>`;
        });
    },
    selOpp: function(id) {
        this.data.opponent = CANDIDATES.find(x => x.id === id);
        this.startGame();
    },

    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        this.saveTurnSnapshot(); // Save initial state
        this.goToScreen('game-screen');
        
        // HUD Setup
        const p = this.data.selectedParty;
        document.getElementById('hud-img').src = this.data.candidate.img || "";
        document.getElementById('hud-img').style.display = "block";
        document.getElementById('hud-img').className = `hud-border-${p}`;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name.toUpperCase();
        document.getElementById('hud-party-name').innerText = PARTIES[p].name.toUpperCase();

        this.initMap();
        this.updateHUD();
    },

    /* --- GAME LOOP: TIME & ENERGY --- */
    updateHUD: function() {
        // Date
        const opt = { month: 'short', day: 'numeric' };
        document.getElementById('hud-date').innerText = this.data.currentDate.toLocaleDateString('en-US', opt);
        
        // Money
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        
        // Energy Pips
        const eCont = document.getElementById('hud-energy');
        eCont.innerHTML = "";
        for(let i=0; i<this.data.maxEnergy; i++) {
            const pip = document.createElement('div');
            pip.className = `energy-pip ${i < this.data.energy ? 'active' : ''}`;
            eCont.appendChild(pip);
        }
    },

    nextWeek: function() {
        if(this.data.currentDate >= this.data.electionDay) return alert("Election Day Reached!");

        // 1. Advance Time
        this.data.currentDate.setDate(this.data.currentDate.getDate() + 7);
        
        // 2. Restore Energy (Stacking Logic)
        const rollover = this.data.energy; 
        this.data.energy = Math.min(this.data.maxEnergy + rollover, Math.floor(this.data.maxEnergy * 1.5)); // Cap at 1.5x
        
        // 3. Reset Fatigue slightly
        for(let s in this.data.states) {
            if(this.data.states[s].donorFatigue > 0) this.data.states[s].donorFatigue--;
        }

        // 4. Opponent Moves
        this.opponentTurn();

        // 5. Save Snapshot for Undo
        this.saveTurnSnapshot();
        
        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("New Week Begun!");
    },

    /* --- UNDO SYSTEM --- */
    saveTurnSnapshot: function() {
        this.data.turnStartSnapshot = JSON.stringify(this.data);
    },
    resetTurn: function() {
        if(confirm("Reset entire week?")) {
            const snap = JSON.parse(this.data.turnStartSnapshot);
            // Restore keys except history logic
            this.data.funds = snap.funds;
            this.data.energy = snap.energy;
            this.data.states = snap.states;
            this.updateHUD();
            this.colorMap();
            if(this.data.selectedState) this.clickState(this.data.selectedState);
        }
    },
    // Simple undo just calls reset for now in this iteration, expanded stack later
    undoLastAction: function() { this.resetTurn(); },

    /* --- CORE MECHANICS --- */
    
    // 1. FUNDRAISING
    fundraise: function() {
        if(this.data.energy < 1) return this.showToast("Not enough energy!");
        
        this.data.energy--;
        const s = this.data.states[this.data.selectedState];
        
        // Formula: Base * EV * Support * FatiguePenalty
        let base = 0.5; // $500k base
        let supportMod = (this.data.selectedParty === 'D' ? s.poll : (100-s.poll)) / 50;
        let fatigueMod = Math.pow(0.5, s.donorFatigue); // Halves each time
        
        let amount = base * (s.ev / 5) * supportMod * fatigueMod;
        if(amount < 0.1) amount = 0.1;

        this.data.funds += amount;
        s.donorFatigue++; // Add fatigue
        
        this.showToast(`Raised $${amount.toFixed(1)}M in ${s.name}`);
        this.updateHUD();
    },

    // 2. RALLIES (Campaign)
    setupRally: function() {
        document.getElementById('rally-options').classList.remove('hidden');
    },
    executeRally: function() {
        if(this.data.energy < 2) return this.showToast("Need 2 Energy!");
        if(this.data.funds < 0.1) return this.showToast("Need $100k!");
        
        this.data.energy -= 2;
        this.data.funds -= 0.1;
        
        const issueId = document.getElementById('rally-issue-select').value;
        const s = this.data.states[this.data.selectedState];
        const imp = s.priorities[issueId] || 5;
        
        // Boost calculation
        let boost = (imp / 3) * (Math.random() * 0.5 + 0.8);
        if(this.data.selectedParty === 'D') s.poll += boost; else s.poll -= boost;
        
        // Clamp
        if(s.poll > 100) s.poll = 100; if(s.poll < 0) s.poll = 0;
        
        document.getElementById('rally-options').classList.add('hidden');
        this.updateHUD();
        this.colorMap();
        this.clickState(this.data.selectedState);
        this.showToast(`Rally held! Polls shifted.`);
    },

    // 3. ADS
    runStateAd: function() {
        if(this.data.funds < 0.5) return this.showToast("Need $500k!");
        this.data.funds -= 0.5; // 0 Energy cost for Ads
        
        const s = this.data.states[this.data.selectedState];
        const boost = 1.5;
        if(this.data.selectedParty === 'D') s.poll += boost; else s.poll -= boost;
        
        this.updateHUD();
        this.colorMap();
        this.clickState(this.data.selectedState);
    },

    /* --- MAP & BIO --- */
    initMap: function() {
        for(let code in this.data.states) {
            let path = document.getElementById(code);
            if(path) {
                path.onclick = () => this.clickState(code);
                path.onmousemove = (e) => this.showTooltip(e, code);
                path.onmouseleave = () => document.getElementById('map-tooltip').style.display='none';
            }
        }
        this.colorMap();
    },
    colorMap: function() {
        for(let code in this.data.states) {
            const s = this.data.states[code];
            const p = document.getElementById(code);
            if(p) {
                let fill = "#64748b"; // Tossup
                if(s.poll > 53) fill = "#0056b3";
                else if(s.poll > 50) fill = "#4fa1ff";
                else if(s.poll < 47) fill = "#d32f2f";
                else if(s.poll <= 50) fill = "#ff6b6b";
                p.style.fill = fill;
            }
        }
        this.updateScore();
    },
    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('empty-msg').classList.add('hidden');
        
        document.getElementById('sp-name').innerText = s.name;
        document.getElementById('sp-ev').innerText = s.ev + " EV";
        
        // Bars
        document.getElementById('poll-dem-bar').style.width = s.poll + "%";
        document.getElementById('poll-rep-bar').style.width = (100-s.poll) + "%";
        document.getElementById('poll-dem-val').innerText = s.poll.toFixed(1) + "%";
        document.getElementById('poll-rep-val').innerText = (100-s.poll).toFixed(1) + "%";
        
        // Issues
        const list = document.getElementById('sp-issues-list');
        list.innerHTML = "";
        ISSUES.sort((a,b) => s.priorities[b.id] - s.priorities[a.id]).slice(0,3).forEach(x => {
            list.innerHTML += `<div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:2px;"><span>${x.name}</span><span style="color:gold">${s.priorities[x.id]}/10</span></div>`;
        });
    },
    
    // Bio Modal
    openStateBio: function() {
        const s = this.data.states[this.data.selectedState];
        const modal = document.getElementById('bio-modal');
        const content = document.getElementById('bio-content');
        
        // Determine Flag URL (Placeholder logic)
        const flagUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png`; 
        // Note: Real flags would require assets/al.png etc.
        
        // Build Demographics HTML
        let demoHTML = `<div class="ig-grid">`;
        for(let key in s.demographics) {
            const igName = INTEREST_GROUPS.find(x => x.id === key).name;
            demoHTML += `<div class="ig-tag"><span>${igName}</span><span class="ig-val">${s.demographics[key]}%</span></div>`;
        }
        demoHTML += `</div>`;

        content.innerHTML = `
            <div class="bio-header" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://source.unsplash.com/800x200/?${s.name},landscape')">
                <div class="bio-flag"><img src="${flagUrl}"></div>
                <div class="bio-title"><h2>${s.name}</h2></div>
            </div>
            <div class="bio-lore">"A key battleground with ${s.ev} Electoral Votes. The population is diverse with strong interest groups."</div>
            <h3>DEMOGRAPHICS</h3>
            ${demoHTML}
            <h3 style="margin-top:20px;">POLLING HISTORY</h3>
            <p>Current: <span class="blue">${s.poll.toFixed(1)}% D</span> vs <span class="red">${(100-s.poll).toFixed(1)}% R</span></p>
        `;
        
        modal.classList.remove('hidden');
    },

    /* --- HELPERS --- */
    initIssues: function() {
        const s = document.getElementById('issue-select');
        const r = document.getElementById('rally-issue-select');
        ISSUES.forEach(i => {
            const opt = `<option value="${i.id}">${i.name}</option>`;
            if(s) s.innerHTML += opt;
            if(r) r.innerHTML += opt;
        });
    },
    showTooltip: function(e, code) {
        const tt = document.getElementById('map-tooltip');
        const s = this.data.states[code];
        tt.innerHTML = `<h4>${s.name}</h4><div>D: ${s.poll.toFixed(1)}%</div><div>R: ${(100-s.poll).toFixed(1)}%</div>`;
        tt.style.display='block'; tt.style.left=(e.clientX+15)+'px'; tt.style.top=(e.clientY+15)+'px';
    },
    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.style.opacity = 1; setTimeout(() => t.style.opacity = 0, 2000);
    },
    opponentTurn: function() {
        // Simple AI: Shifts polls slightly against player
        for(let s in this.data.states) {
            let shift = (Math.random() * 1.5) - 0.5;
            if(this.data.selectedParty === 'D') this.data.states[s].poll -= shift;
            else this.data.states[s].poll += shift;
        }
    },
    updateScore: function() {
        let d=0, r=0;
        for(let k in this.data.states) {
            if(this.data.states[k].poll >= 50) d+=this.data.states[k].ev; else r+=this.data.states[k].ev;
        }
        document.getElementById('score-dem').innerText = d;
        document.getElementById('score-rep').innerText = r;
        const dp = (d/538)*100; const rp = (r/538)*100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #0056b3 ${dp}%, #333 ${dp}%, #333 ${100-rp}%, #d32f2f ${100-rp}%)`;
    },
    toggleThirdParties: function() { /* Logic handled in startGame */ }
};

document.addEventListener('DOMContentLoaded', () => app.init());
