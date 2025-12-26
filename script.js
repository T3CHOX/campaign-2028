/* --- CONFIGURATION --- */
const PARTIES = {
    D: { name: "Democratic", color: "#00AEF3", img: "images/harrison.jpg", desc: "Liberal platform." },
    R: { name: "Republican", color: "#E81B23", img: "images/whatley.jpg", desc: "Conservative platform." },
    I: { name: "Independent", color: "#F2C75C", img: "images/scenario.jpg", desc: "Centrist coalition." },
    G: { name: "Green", color: "#198754", img: "images/scenario.jpg", desc: "Eco-Socialist." },
    L: { name: "Libertarian", color: "#fd7e14", img: "images/scenario.jpg", desc: "Individual liberty." }
};

const ISSUES = [
    { id: 'econ', name: 'Economy' }, { id: 'jobs', name: 'Jobs' },
    { id: 'tax', name: 'Tax Policy' }, { id: 'health', name: 'Healthcare' },
    { id: 'immig', name: 'Immigration' }, { id: 'clim', name: 'Climate' },
    { id: 'gun', name: 'Gun Control' }, { id: 'abort', name: 'Abortion' },
    { id: 'foreign', name: 'Foreign Pol.' }, { id: 'crime', name: 'Crime' }
];

// ADDED: ai_skill (1-10) determines how aggressive/smart the opponent is
const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", desc: "Current VP.", stamina: 8, ai_skill: 8 },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", desc: "CA Governor.", stamina: 9, ai_skill: 9 },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer.jpg", desc: "MI Governor.", stamina: 8, ai_skill: 9 },
    { id: "desantis", name: "Ron DeSantis", party: "R", funds: 65, img: "images/desantis.jpg", desc: "FL Governor.", stamina: 9, ai_skill: 9 },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", desc: "OH Senator.", stamina: 8, ai_skill: 7 },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", desc: "Tech Entrepreneur.", stamina: 10, ai_skill: 6 },
    { id: "yang", name: "Andrew Yang", party: "I", funds: 40, img: "images/yang.jpg", desc: "Forward Party.", stamina: 8, ai_skill: 5 },
    { id: "stein", name: "Jill Stein", party: "G", funds: 10, img: "images/scenario.jpg", desc: "Green Party.", stamina: 6, ai_skill: 3 },
    { id: "oliver", name: "Chase Oliver", party: "L", funds: 12, img: "images/scenario.jpg", desc: "Libertarian.", stamina: 7, ai_skill: 3 }
];

// ADDED: ai_skill (1-5) adds to the ticket's total formidable score
const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", desc: "Popular swing state governor.", img: "images/shapiro.jpg", ai_skill: 5 },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", desc: "Astronaut & Senator.", img: "images/scenario.jpg", ai_skill: 4 },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", desc: "Establishment bridge.", img: "images/scenario.jpg", ai_skill: 4 },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", desc: "Strong aggressive campaigner.", img: "images/scenario.jpg", ai_skill: 3 }
];

const INIT_STATES = {
    "AL": { name: "Alabama", ev: 9, fips: "01" }, "AK": { name: "Alaska", ev: 3, fips: "02" }, "AZ": { name: "Arizona", ev: 11, fips: "04" },
    "AR": { name: "Arkansas", ev: 6, fips: "05" }, "CA": { name: "California", ev: 54, fips: "06" }, "CO": { name: "Colorado", ev: 10, fips: "08" },
    "CT": { name: "Connecticut", ev: 7, fips: "09" }, "DE": { name: "Delaware", ev: 3, fips: "10" }, "DC": { name: "District of Columbia", ev: 3, fips: "11" },
    "FL": { name: "Florida", ev: 30, fips: "12" }, "GA": { name: "Georgia", ev: 16, fips: "13" }, "HI": { name: "Hawaii", ev: 4, fips: "15" },
    "ID": { name: "Idaho", ev: 4, fips: "16" }, "IL": { name: "Illinois", ev: 19, fips: "17" }, "IN": { name: "Indiana", ev: 11, fips: "18" },
    "IA": { name: "Iowa", ev: 6, fips: "19" }, "KS": { name: "Kansas", ev: 6, fips: "20" }, "KY": { name: "Kentucky", ev: 8, fips: "21" },
    "LA": { name: "Louisiana", ev: 8, fips: "22" }, "ME": { name: "Maine", ev: 4, fips: "23" }, "MD": { name: "Maryland", ev: 10, fips: "24" },
    "MA": { name: "Massachusetts", ev: 11, fips: "25" }, "MI": { name: "Michigan", ev: 15, fips: "26" }, "MN": { name: "Minnesota", ev: 10, fips: "27" },
    "MS": { name: "Mississippi", ev: 6, fips: "28" }, "MO": { name: "Missouri", ev: 10, fips: "29" }, "MT": { name: "Montana", ev: 4, fips: "30" },
    "NE": { name: "Nebraska", ev: 5, fips: "31" }, "NV": { name: "Nevada", ev: 6, fips: "32" }, "NH": { name: "New Hampshire", ev: 4, fips: "33" },
    "NJ": { name: "New Jersey", ev: 14, fips: "34" }, "NM": { name: "New Mexico", ev: 5, fips: "35" }, "NY": { name: "New York", ev: 28, fips: "36" },
    "NC": { name: "North Carolina", ev: 16, fips: "37" }, "ND": { name: "North Dakota", ev: 3, fips: "38" }, "OH": { name: "Ohio", ev: 17, fips: "39" },
    "OK": { name: "Oklahoma", ev: 7, fips: "40" }, "OR": { name: "Oregon", ev: 8, fips: "41" }, "PA": { name: "Pennsylvania", ev: 19, fips: "42" },
    "RI": { name: "Rhode Island", ev: 4, fips: "44" }, "SC": { name: "South Carolina", ev: 9, fips: "45" }, "SD": { name: "South Dakota", ev: 3, fips: "46" },
    "TN": { name: "Tennessee", ev: 11, fips: "47" }, "TX": { name: "Texas", ev: 40, fips: "48" }, "UT": { name: "Utah", ev: 6, fips: "49" },
    "VT": { name: "Vermont", ev: 3, fips: "50" }, "VA": { name: "Virginia", ev: 13, fips: "51" }, "WA": { name: "Washington", ev: 12, fips: "53" },
    "WV": { name: "West Virginia", ev: 4, fips: "54" }, "WI": { name: "Wisconsin", ev: 10, fips: "55" }, "WY": { name: "Wyoming", ev: 3, fips: "56" }
};

/* --- CIV & COUNTY ENGINE --- */
class County {
    constructor(id, name, stateType, realData=null, baseG=1, baseL=1) {
        this.id = id;
        this.name = name || id;

        if (realData) {
            this.type = realData.t || "Rural";
            this.population = realData.p || 10000;
            this.pcts = {
                D: realData.v.D,
                R: realData.v.R,
                G: baseG * 0.5,
                L: baseL * 0.5
            };
        } else {
            const rand = Math.random();
            if (stateType === 'Urban') this.type = rand > 0.4 ? 'Urban' : 'Suburb';
            else if (stateType === 'Rural') this.type = rand > 0.9 ? 'Urban' : 'Rural';
            else this.type = rand > 0.8 ? 'Urban' : (rand > 0.4 ? 'Suburb' : 'Rural');

            let base = this.type === 'Urban' ? 500000 : (this.type === 'Suburb' ? 100000 : 20000);
            this.population = Math.floor(base * (0.8 + Math.random() * 0.4));
            let lean = this.type === 'Urban' ? 65 : 35;
            this.pcts = { D: lean, R: 100 - lean, G: baseG, L: baseL };
        }
        
        this.normalizePcts();
        this.enthusiasm = { D: 1.0, R: 1.0 };
    }

    normalizePcts() {
        let total = this.pcts.D + this.pcts.R + this.pcts.G + this.pcts.L;
        if(total === 0) total=1;
        for(let k in this.pcts) this.pcts[k] = (this.pcts[k] / total) * 100;
    }

    getVotes() {
        return {
            D: this.population * (this.pcts.D/100) * this.enthusiasm.D,
            R: this.population * (this.pcts.R/100) * this.enthusiasm.R,
            G: this.population * (this.pcts.G/100),
            L: this.population * (this.pcts.L/100)
        };
    }
}

/* --- APP ENGINE --- */
const app = {
    data: {
        currentDate: new Date("2028-07-04"), electionDay: new Date("2028-11-07"),
        selectedParty: null, candidate: null, vp: null, opponent: null, opponentVP: null,
        funds: 0, energy: 8, maxEnergy: 8, thirdPartiesEnabled: true,
        states: {}, selectedState: null, activeCountyState: null,
        mapMode: 'political', masterMapCache: null, realCountyData: null,
        selectedCounty: null,
        // AI DATA
        aiDifficulty: 0, aiFunds: 100
    },

    init: async function() {
        console.log("App Initializing...");
        
        try {
            const res = await fetch('counties/county_data.json');
            if (res.ok) {
                this.data.realCountyData = await res.json();
                console.log("Loaded Real County Data");
            }
        } catch(e) { console.log("Using procedural data"); }

        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            let safeName = s.name.replace(/ /g, "_");
            s.flagUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_${safeName}.svg`;

            let baseG = ['CA','OR','VT','WA'].includes(sCode) ? 4.0 : 1.0;
            let baseL = ['NH','MT','NV','AK'].includes(sCode) ? 4.5 : 1.5;
            
            s.counties = this.generateCountiesForState(s, baseG, baseL);
            this.recalcStatePoll(s);
        }
        
        this.renderParties();
        
        document.getElementById('county-map-container').addEventListener('click', (e) => {
             if(e.target.tagName !== 'path' && e.target.tagName !== 'rect') {
                 document.getElementById('county-menu').classList.add('hidden');
             }
        });
    },

    generateCountiesForState: function(state, baseG, baseL) {
        let counties = [];
        if (this.data.realCountyData) {
            for (let fips in this.data.realCountyData) {
                if (fips.startsWith(state.fips)) {
                    let cData = this.data.realCountyData[fips];
                    let id = "c" + fips; 
                    counties.push(new County(id, cData.n, "Real", cData, baseG, baseL));
                }
            }
        }
        if (counties.length === 0) {
            let numCounties = Math.max(5, Math.floor(state.ev * 1.8)); 
            let safeName = state.name.replace(/ /g, "");
            counties.push(new County(`c_${safeName}_U`, "Metro City", "Urban", null, baseG, baseL));
            for(let i=0; i<Math.floor(numCounties * 0.3); i++) counties.push(new County(`c_${safeName}_S${i}`, `Suburb ${i+1}`, "Suburb", null, baseG, baseL));
            for(let i=0; i<numCounties * 0.7; i++) counties.push(new County(`c_${safeName}_R${i}`, `Rural Dist ${i+1}`, "Rural", null, baseG, baseL));
        }
        return counties;
    },

    recalcStatePoll: function(state) {
        let totals = { D:0, R:0, G:0, L:0 };
        let totalPop = 0;
        state.counties.forEach(c => {
            let v = c.getVotes();
            totals.D += v.D; totals.R += v.R; totals.G += v.G; totals.L += v.L;
            totalPop += (v.D+v.R+v.G+v.L);
        });
        if(totalPop > 0) {
            state.pcts = {
                D: (totals.D / totalPop) * 100, R: (totals.R / totalPop) * 100,
                G: (totals.G / totalPop) * 100, L: (totals.L / totalPop) * 100
            };
            state.totalPop = totalPop;
        }
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    // --- SETUP SCREENS ---
    renderParties: function() {
        const c = document.getElementById('party-cards'); 
        if(!c) return;
        c.innerHTML = "";
        ['D','R','I'].forEach(k => {
            const p = PARTIES[k];
            c.innerHTML += `<div class="card card-party" onclick="app.selParty('${k}')" style="background-image:url('${p.img}'); border-top:5px solid ${p.color}"><div class="party-overlay"><h3>${p.name} Party</h3><div class="party-desc">${p.desc}</div></div></div>`;
        });
    },
    selParty: function(k) { this.data.selectedParty = k; this.renderCands(k); this.goToScreen('candidate-screen'); },
    renderCands: function(pk) {
        const c = document.getElementById('candidate-cards'); c.innerHTML = "";
        CANDIDATES.filter(x => x.party === pk).forEach(cand => {
            c.innerHTML += `<div class="card" onclick="app.selCand('${cand.id}')"><div class="portrait"><img src="${cand.img}"></div><div class="card-info"><h3>${cand.name}</h3><p>${cand.desc}</p><p class="buff-text">Stamina: ${cand.stamina} | AI: ${cand.ai_skill}</p></div></div>`;
        });
    },
    selCand: function(id) {
        this.data.candidate = CANDIDATES.find(x => x.id === id);
        this.data.maxEnergy = this.data.candidate.stamina; this.data.energy = this.data.maxEnergy;
        this.renderVPs(this.data.candidate.party); this.goToScreen('vp-screen');
    },
    renderVPs: function(pk) {
        const c = document.getElementById('vp-cards'); c.innerHTML = "";
        const vps = VPS.filter(x => x.party === pk);
        if(vps.length === 0) { c.innerHTML = `<div class="card" onclick="app.renderOpp()"><div class="card-info"><h3>SKIP VP</h3></div></div>`; return; }
        vps.forEach(v => {
            c.innerHTML += `<div class="card" onclick="app.selVP('${v.id}')"><div class="portrait"><img src="${v.img}"></div><div class="card-info"><h3>${v.name}</h3></div></div>`;
        });
    },
    selVP: function(id) { this.data.vp = VPS.find(x => x.id === id); this.renderOpp(); },
    renderOpp: function() {
        const maj = document.getElementById('opponent-cards-major');
        const min = document.getElementById('opponent-cards-minor');
        maj.innerHTML = ""; min.innerHTML = "";
        let rival = this.data.selectedParty === 'D' ? 'R' : 'D';
        if(this.data.selectedParty === 'I') rival = 'D';
        CANDIDATES.filter(x => x.party === rival).forEach(o => {
            maj.innerHTML += `<div class="card" onclick="app.selOpp('${o.id}')"><div class="portrait"><img src="${o.img}"></div><div class="card-info"><h3>${o.name}</h3></div></div>`;
        });
        CANDIDATES.filter(x => ['G','L'].includes(x.party)).forEach(opp => {
            min.innerHTML += `<div class="card" style="transform:scale(0.9); border-top:3px solid ${PARTIES[opp.party].color}"><div class="card-info"><h3>${opp.name}</h3></div></div>`;
        });
        this.goToScreen('opponent-screen');
    },
    selOpp: function(id) { this.data.opponent = CANDIDATES.find(x => x.id === id); this.renderOppVP(); },
    renderOppVP: function() {
        const maj = document.getElementById('opponent-cards-major'); maj.innerHTML = "";
        document.getElementById('opp-section-title').innerText = "SELECT OPPONENT'S VP";
        const vps = VPS.filter(x => x.party === this.data.opponent.party);
        if(vps.length === 0) { this.startGame(); return; }
        vps.forEach(v => {
            maj.innerHTML += `<div class="card" onclick="app.selOppVP('${v.id}')"><div class="portrait"><img src="${v.img}"></div><div class="card-info"><h3>${v.name}</h3></div></div>`;
        });
    },
    selOppVP: function(id) { this.data.opponentVP = VPS.find(x => x.id === id); this.startGame(); },
    toggleThirdParties: function() { this.data.thirdPartiesEnabled = document.getElementById('third-party-toggle').checked; },

    /* --- GAME START & LOOP --- */
    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        
        // CALC AI DIFFICULTY
        let oppSkill = this.data.opponent.ai_skill || 5;
        let vpSkill = this.data.opponentVP ? (this.data.opponentVP.ai_skill || 3) : 0;
        this.data.aiDifficulty = oppSkill + vpSkill; // Total formidable score (e.g. 9 + 5 = 14)
        
        this.goToScreen('game-screen');
        const img = document.getElementById('hud-img');
        if(this.data.candidate.img) { img.src = this.data.candidate.img; img.style.display = "block"; }
        img.className = `hud-border-${this.data.selectedParty}`;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name.toUpperCase();
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty].name.toUpperCase();
        
        if(!this.data.thirdPartiesEnabled) {
            for(let s in this.data.states) { this.data.states[s].pcts.G=0; this.data.states[s].pcts.L=0; }
        }
        
        this.initMap(); this.updateHUD();
    },

    nextWeek: function() {
        this.data.currentDate.setDate(this.data.currentDate.getDate()+7);
        if(this.data.currentDate >= this.data.electionDay) { this.endGame(); return; }
        
        // AI TURN
        this.aiTurn();
        
        // PLAYER TURN RESET
        this.data.energy = this.data.maxEnergy;
        this.data.funds += 2; // Fundraising baseline
        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("New Week Started");
    },
    
    // --- OVERHAULED AI LOGIC ---
    aiTurn: function() {
        const difficulty = this.data.aiDifficulty; // e.g., 12
        const actionsPerTurn = Math.floor(difficulty / 3) + 1; // 12 -> 5 actions
        const strength = (difficulty / 10) * 2.0; // 12 -> 2.4% swing per action
        
        // 1. Identify Targets: Sort states by "Payoff" (EV / Margin)
        // This targets high EV states that are very close.
        let targets = Object.values(this.data.states).map(s => {
            let margin = Math.abs(s.pcts.D - s.pcts.R);
            // Score = EV / (Margin + 0.5) -- Low margin, High EV = Huge Score
            let score = s.ev / (margin + 0.5);
            return { state: s, score: score };
        });
        
        targets.sort((a,b) => b.score - a.score); // Highest score first
        
        // 2. Execute Actions
        let opponentParty = this.data.selectedParty === 'D' ? 'R' : 'D';
        
        for(let i=0; i<actionsPerTurn; i++) {
            let s = targets[i].state;
            
            // AI applies "Neighbor Effect" too to be formidable
            s.counties.forEach(c => {
                 if(opponentParty === 'R') c.pcts.R += (strength * 0.15); // Small bump to all counties
                 else c.pcts.D += (strength * 0.15);
                 c.normalizePcts();
            });
            
            // Major boost to a random county in that state (Simulate Rally)
            let randomCounty = s.counties[Math.floor(Math.random() * s.counties.length)];
            if(opponentParty === 'R') randomCounty.pcts.R += strength;
            else randomCounty.pcts.D += strength;
            randomCounty.normalizePcts();
            
            this.recalcStatePoll(s);
        }
    },
    
    endGame: function() {
        let d=0, r=0;
        for(let s in this.data.states) { if(this.data.states[s].pcts.D > 50) d+=this.data.states[s].ev; else r+=this.data.states[s].ev; }
        alert(`ELECTION OVER!\nDemocrats: ${d}\nRepublicans: ${r}`);
        location.reload();
    },

    /* --- MAP SYSTEM --- */
    enterStateView: function() {
        const s = this.data.states[this.data.selectedState];
        if(!s) return;
        this.data.activeCountyState = s;
        document.getElementById('cv-title').innerText = s.name.toUpperCase();
        document.getElementById('cv-flag').src = s.flagUrl;
        
        const container = document.getElementById('county-map-container');
        container.innerHTML = `<p style="color:#aaa;">Loading Map Data...</p>`;
        document.getElementById('county-modal').classList.remove('hidden');
        document.getElementById('county-menu').classList.add('hidden');
        
        if(this.data.masterMapCache) {
            this.extractStateFromMaster(this.data.masterMapCache, s, container);
        } else {
            fetch('counties/uscountymap.svg')
                .then(res => { if(!res.ok) throw new Error("No Master Map"); return res.text(); })
                .then(data => {
                    this.data.masterMapCache = data;
                    this.extractStateFromMaster(data, s, container);
                })
                .catch(err => {
                    console.warn("Map load failed", err);
                    this.generateFallbackMap(container, s);
                });
        }
    },

    extractStateFromMaster: function(svgData, stateObj, container) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(svgData, "image/svg+xml");
        let group = doc.getElementById(stateObj.name);
        let validPaths = [];
        
        if(group) {
            validPaths = Array.from(group.querySelectorAll('path, polygon'));
        } else {
            let fips = stateObj.fips; 
            let allPaths = doc.querySelectorAll('path, polygon');
            allPaths.forEach(p => {
                if(p.id && p.id.indexOf(fips) !== -1) validPaths.push(p);
            });
        }

        if(validPaths.length === 0) { this.generateFallbackMap(container, stateObj); return; }

        let newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvg.setAttribute("viewBox", "0 0 990 627"); 
        newSvg.style.width = "100%"; newSvg.style.height = "100%";
        
        validPaths.forEach(p => {
            let clone = p.cloneNode(true);
            let c = stateObj.counties.find(ct => ct.id === p.id);
            if(c) {
                clone.onclick = (e) => { e.stopPropagation(); this.clickCounty(e, stateObj.counties.indexOf(c)); };
                clone.onmousemove = (e) => this.showCountyTooltip(e, c);
                clone.onmouseleave = () => document.getElementById('county-tooltip').classList.add('hidden');
                this.colorCountyPath(clone, c);
            }
            newSvg.appendChild(clone);
        });

        container.innerHTML = "";
        container.appendChild(newSvg);
        
        setTimeout(() => {
            try {
                let bbox = newSvg.getBBox();
                if(bbox.width > 0) newSvg.setAttribute("viewBox", `${bbox.x-10} ${bbox.y-10} ${bbox.width+20} ${bbox.height+20}`);
            } catch(e) {}
        }, 50);
    },

    generateFallbackMap: function(container, stateObj) {
        container.innerHTML = "";
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 500 400");
        let cols = Math.ceil(Math.sqrt(stateObj.counties.length * 1.5));
        
        stateObj.counties.forEach((c, i) => {
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", (i % cols) * 45 + 10);
            rect.setAttribute("y", Math.floor(i / cols) * 45 + 10);
            rect.setAttribute("width", 40); rect.setAttribute("height", 40);
            
            rect.onclick = (e) => this.clickCounty(e, i); 
            rect.onmousemove = (e) => this.showCountyTooltip(e, c);
            rect.onmouseleave = () => document.getElementById('county-tooltip').classList.add('hidden');
            
            this.colorCountyPath(rect, c);
            svg.appendChild(rect);
        });
        container.appendChild(svg);
    },

    // --- DARKER HUE COLOR LOGIC ---
    getMarginColor: function(margin) {
        let abs = Math.abs(margin);
        if (abs < 0.5) return "#d1d1d1"; // Tossup Gray
        
        if (margin > 0) { // DEMOCRAT (Blue)
            if (abs > 60) return "#001a33"; // Deepest Navy
            if (abs > 40) return "#002a4d"; 
            if (abs > 25) return "#004080"; // Deep Blue (Safe)
            if (abs > 15) return "#005a9c"; // Solid Blue
            if (abs > 5)  return "#4da6ff"; // Lean Blue
            return "#99ccff";               // Tilt Blue
        } else { // REPUBLICAN (Red)
            if (abs > 60) return "#3d0000"; // Deepest Crimson
            if (abs > 40) return "#5e0000"; 
            if (abs > 25) return "#8b0000"; // Deep Red (Safe)
            if (abs > 15) return "#cc0000"; // Solid Red
            if (abs > 5)  return "#ff4d4d"; // Lean Red
            return "#ff9999";               // Tilt Red
        }
    },

    colorCountyPath: function(path, c) {
        let fill = "#333";
        if(this.data.mapMode === 'political') {
            let m = c.pcts.D - c.pcts.R;
            fill = this.getMarginColor(m);
        } else if(this.data.mapMode === 'fundraising') {
            let intensity = Math.min(c.population / 200000, 1);
            fill = `rgba(74, 222, 128, ${intensity})`;
        }
        path.style.fill = fill; 
        path.style.stroke = "#111"; 
        path.style.strokeWidth = "0.15px";
    },

    clickCounty: function(e, idx) {
        let c = this.data.activeCountyState.counties[idx];
        this.data.selectedCounty = c;
        
        const menu = document.getElementById('county-menu');
        document.getElementById('cm-name').innerText = c.name.toUpperCase();
        
        const actions = document.getElementById('cm-actions');
        actions.innerHTML = `
            <button class="cm-btn" onclick="app.doCountyAction('rally')">
                <span>🎤 Rally</span> <span class="cost">1 ENG</span>
            </button>
            <button class="cm-btn" onclick="app.doCountyAction('ad')">
                <span>📺 Local Ad</span> <span class="cost">$0.5M</span>
            </button>
            <button class="cm-btn" onclick="app.doCountyAction('poll')">
                <span>📊 Poll</span> <span class="cost">$0.1M</span>
            </button>
        `;

        let x = e.clientX + 10;
        let y = e.clientY + 10;
        if(x + 250 > window.innerWidth) x -= 260;
        if(y + 200 > window.innerHeight) y -= 210;

        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.remove('hidden');
    },

    doCountyAction: function(action) {
        const c = this.data.selectedCounty;
        const s = this.data.activeCountyState;
        
        // --- NEIGHBOR LOGIC (MEDIA MARKET RIPPLE) ---
        // Boost selected county by X, boost ALL OTHER counties in state by Y
        let directBoost = 0;
        let rippleBoost = 0;

        if (action === 'rally') {
            if(this.data.energy > 0) {
                this.data.energy--;
                directBoost = 2.5;
                rippleBoost = 0.2; 
                this.showToast(`Rally held in ${c.name}!`);
            } else return this.showToast("No Energy!");
        } else if (action === 'ad') {
            if(this.data.funds >= 0.5) {
                this.data.funds -= 0.5;
                directBoost = 4.0;
                rippleBoost = 0.5;
                this.showToast("Local Ad Run!");
            } else return this.showToast("Not enough Funds!");
        } else if (action === 'poll') {
            if(this.data.funds >= 0.1) {
                this.data.funds -= 0.1;
                alert(`${c.name} Internal Poll:\nD: ${c.pcts.D.toFixed(1)}%\nR: ${c.pcts.R.toFixed(1)}%`);
                document.getElementById('county-menu').classList.add('hidden');
                this.updateHUD();
                return;
            } else return this.showToast("Not enough Funds!");
        }

        // Apply Shifts
        if(this.data.selectedParty === 'D') {
            c.pcts.D += directBoost; c.enthusiasm.D += 0.1;
            s.counties.forEach(neigh => { if(neigh !== c) neigh.pcts.D += rippleBoost; });
        } else {
            c.pcts.R += directBoost; c.enthusiasm.R += 0.1;
            s.counties.forEach(neigh => { if(neigh !== c) neigh.pcts.R += rippleBoost; });
        }

        // Refresh Logic
        s.counties.forEach(ct => ct.normalizePcts()); // Re-normalize everyone
        this.recalcStatePoll(s);
        this.updateHUD();
        this.clickState(this.data.selectedState); // Update sidebar
        
        // Refresh Map Colors
        let container = document.getElementById('county-map-container');
        let paths = container.querySelectorAll('path, rect');
        paths.forEach(p => {
             // Re-color everyone because of Ripple Effect
             let ct = s.counties.find(x => x.id === p.id) || s.counties[p.getAttribute('data-idx')];
             if(ct) this.colorCountyPath(p, ct);
        });

        document.getElementById('county-menu').classList.add('hidden');
    },

    showCountyTooltip: function(e, c) {
        let tt = document.getElementById('county-tooltip');
        let m = c.pcts.D - c.pcts.R;
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        // HOVER MARGIN DISPLAY ADDED
        tt.innerHTML = `
            <span class="tooltip-leader" style="color:${col}">${c.name} +${Math.abs(m).toFixed(1)}</span>
            <div class="tip-row"><span class="blue">DEM ${c.pcts.D.toFixed(1)}%</span> <span class="red">REP ${c.pcts.R.toFixed(1)}%</span></div>
            <div style="font-size:0.75rem; color:#888; margin-top:4px;">Pop: ${(c.population/1000).toFixed(1)}k</div>
        `;
        tt.style.left = (e.clientX+15)+"px"; tt.style.top = (e.clientY+15)+"px";
        tt.classList.remove('hidden');
    },

    setCountyMapMode: function(mode) {
        this.data.mapMode = mode;
        if(this.data.activeCountyState) {
            let container = document.getElementById('county-map-container');
            let paths = container.querySelectorAll('path, polygon, rect');
            let s = this.data.activeCountyState;
            paths.forEach(p => {
                let c = s.counties.find(county => county.id === p.id) || s.counties[p.getAttribute('data-idx')];
                if(c) this.colorCountyPath(p, c);
            });
        }
    },
    
    setMapMode: function(mode) {
        this.data.mapMode = mode;
        this.colorMap();
    },

    closeCountyView: function() {
        document.getElementById('county-modal').classList.add('hidden');
        document.getElementById('county-menu').classList.add('hidden');
        this.data.activeCountyState = null;
        this.colorMap();
    },

    initMap: function() {
        for(let code in this.data.states) {
            let p = document.getElementById(code);
            if(p) {
                p.onclick = () => this.clickState(code);
                // DOUBLE CLICK FEATURE ADDED
                p.ondblclick = () => {
                    this.clickState(code);
                    this.enterStateView();
                };
                p.onmousemove = (e) => this.showTooltip(e, code);
                p.onmouseleave = () => document.getElementById('map-tooltip').style.display='none';
            }
        }
        this.colorMap();
    },
    colorMap: function() {
        for(let code in this.data.states) {
            let s = this.data.states[code];
            let p = document.getElementById(code);
            if(p) {
                let m = s.pcts.D - s.pcts.R;
                p.style.fill = this.getMarginColor(m);
                p.style.stroke = "#555";
            }
        }
        this.updateScore();
    },
    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('empty-msg').classList.add('hidden');
        
        let m = s.pcts.D - s.pcts.R;
        let lead = m > 0 ? "D" : "R";
        let col = m > 0 ? "blue" : "red";
        if(Math.abs(m)<0.1) { lead="EVEN"; col="gray"; } else { lead = `${lead}+${Math.abs(m).toFixed(1)}`; }
        
        document.getElementById('sp-name').innerHTML = `${s.name} <span class="${col}" style="font-size:0.8em; margin-left:10px;">${lead}</span>`;
        document.getElementById('sp-ev').innerText = s.ev + " EV";
        
        let wrap = document.querySelector('.poll-bar-wrap');
        wrap.innerHTML = `
            <div style="width:${s.pcts.D}%; background:#00AEF3;"></div>
            <div style="width:${s.pcts.G}%; background:#198754;"></div>
            <div style="width:${s.pcts.L}%; background:#fd7e14;"></div>
            <div style="width:${s.pcts.R}%; background:#E81B23;"></div>
        `;
        document.getElementById('poll-dem-val').innerText = s.pcts.D.toFixed(1)+"%";
        document.getElementById('poll-rep-val').innerText = s.pcts.R.toFixed(1)+"%";
    },
    
    // Stub Helpers
    updateHUD: function() {
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        const ec = document.getElementById('hud-energy'); ec.innerHTML="";
        for(let i=0; i<this.data.maxEnergy; i++) ec.innerHTML += `<div class="energy-pip ${i<this.data.energy?'active':''}"></div>`;
        document.getElementById('hud-date').innerText = this.data.currentDate.toLocaleDateString();
    },
    updateScore: function() {
        let d=0, r=0;
        for(let k in this.data.states) { if(this.data.states[k].pcts.D > this.data.states[k].pcts.R) d+=this.data.states[k].ev; else r+=this.data.states[k].ev; }
        document.getElementById('score-dem').innerText = d; document.getElementById('score-rep').innerText = r;
        let dp = (d/538)*100, rp = (r/538)*100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #00AEF3 ${dp}%, #333 ${dp}%, #333 ${100-rp}%, #E81B23 ${100-rp}%)`;
    },
    showTooltip: function(e, code) {
        const tt = document.getElementById('map-tooltip');
        const s = this.data.states[code];
        let m = s.pcts.D - s.pcts.R;
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        tt.innerHTML = `<span class="tooltip-leader" style="color:${col}">${s.name} +${Math.abs(m).toFixed(1)}</span><div class="tip-row"><span class="blue">DEM ${s.pcts.D.toFixed(1)}%</span> <span class="red">REP ${s.pcts.R.toFixed(1)}%</span></div>`;
        tt.style.display='block'; tt.style.left=(e.clientX+15)+'px'; tt.style.top=(e.clientY+15)+'px';
    },
    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.style.opacity = 1; setTimeout(()=>t.style.opacity=0, 2000);
    },
    fundraise: function(){ if(this.data.energy<1)return; this.data.energy--; this.data.funds+=0.5; this.updateHUD(); this.showToast("Funds Raised!"); },
    runStateAd: function(){ this.data.funds-=0.5; this.updateHUD(); this.showToast("Ad Campaign Live"); },
    openStateBio: function(){ document.getElementById('bio-modal').classList.remove('hidden'); }
};

document.addEventListener('DOMContentLoaded', () => app.init());
