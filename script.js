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

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", funds: 150, img: "images/harris.jpg", buff: "Incumbent", desc: "Current VP.", stamina: 8, base_appeal: 0 },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 200, img: "images/newsom.jpg", buff: "Fundraiser", desc: "CA Governor.", stamina: 9, base_appeal: -2 },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 120, img: "images/whitmer.jpg", buff: "Midwest", desc: "MI Governor.", stamina: 8, base_appeal: 3 },
    { id: "desantis", name: "Ron DeSantis", party: "R", funds: 180, img: "images/desantis.jpg", buff: "Culture War", desc: "FL Governor.", stamina: 9, base_appeal: -1 },
    { id: "vance", name: "JD Vance", party: "R", funds: 100, img: "images/vance.jpg", buff: "Populist", desc: "OH Senator.", stamina: 8, base_appeal: 1 },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", funds: 220, img: "images/ramaswamy.jpg", buff: "Outsider", desc: "Entrepreneur.", stamina: 10, base_appeal: -3 },
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg" },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/scenario.jpg" },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/scenario.jpg" },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", img: "images/scenario.jpg" }
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

class County {
    constructor(id, name, stateType, realData=null, baseG=1, baseL=1) {
        this.id = id;
        this.name = name || id;
        
        if (realData) {
            this.type = realData.t || "Rural";
            this.population = realData.p || 10000;
            this.pcts = { D: realData.v.D, R: realData.v.R, G: baseG * 0.5, L: baseL * 0.5 };
        } else {
            let base = stateType === 'Urban' ? 500000 : 20000;
            this.population = Math.floor(base * (0.8 + Math.random()));
            this.type = stateType;
            let lean = stateType === 'Urban' ? 65 : 35;
            this.pcts = { D: lean, R: 100 - lean, G: baseG, L: baseL };
        }
        
        // Enthusiasm modifiers (start at 1.0)
        this.enthusiasm = { D: 1.0, R: 1.0 };
        this.normalizePcts();
    }

    normalizePcts() {
        let total = this.pcts.D + this.pcts.R + this.pcts.G + this.pcts.L;
        for(let k in this.pcts) this.pcts[k] = (this.pcts[k] / total) * 100;
    }

    getVotes() {
        // Votes = Pop * Turnout (Enthusiasm) * Pct
        return {
            D: this.population * (this.pcts.D/100) * this.enthusiasm.D * 0.6, // 0.6 is base turnout
            R: this.population * (this.pcts.R/100) * this.enthusiasm.R * 0.6,
            G: this.population * (this.pcts.G/100) * 0.4,
            L: this.population * (this.pcts.L/100) * 0.4
        };
    }
}

const app = {
    data: {
        currentDate: new Date("2028-07-04"), electionDay: new Date("2028-11-07"),
        selectedParty: null, candidate: null, vp: null, opponent: null,
        funds: 0, energy: 8, maxEnergy: 8, thirdPartiesEnabled: true,
        states: {}, selectedState: null, activeCountyState: null,
        mapMode: 'political', masterMapCache: null, realCountyData: null,
        selectedCounty: null,
        aiFunds: 150 // AI warchest
    },

    init: async function() {
        try {
            const res = await fetch('counties/county_data.json');
            if (res.ok) this.data.realCountyData = await res.json();
        } catch(e) { console.log("Using procedural data."); }

        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            s.safeName = s.name.replace(/ /g, "_");
            s.flagUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_${s.safeName}.svg`;
            s.counties = this.generateCountiesForState(s);
            this.recalcStatePoll(s);
        }
        this.renderParties();
        
        // Hide county menu on map click
        document.getElementById('county-map-container').addEventListener('click', (e) => {
             if(e.target.tagName !== 'path' && e.target.tagName !== 'rect') {
                 document.getElementById('county-menu').classList.add('hidden');
             }
        });
    },

    generateCountiesForState: function(state) {
        let counties = [];
        if (this.data.realCountyData) {
            for (let fips in this.data.realCountyData) {
                if (fips.startsWith(state.fips)) {
                    let cData = this.data.realCountyData[fips];
                    counties.push(new County("c"+fips, cData.n, "Real", cData));
                }
            }
        }
        if (counties.length === 0) {
            let num = Math.max(5, state.ev * 2);
            for(let i=0; i<num; i++) counties.push(new County(`c_${state.fips}_${i}`, `County ${i+1}`, i==0?"Urban":"Rural", null));
        }
        return counties;
    },

    recalcStatePoll: function(state) {
        let t = { D:0, R:0, G:0, L:0, Pop:0 };
        state.counties.forEach(c => {
            let v = c.getVotes();
            t.D += v.D; t.R += v.R; t.G += v.G; t.L += v.L;
            t.Pop += (v.D+v.R+v.G+v.L);
        });
        if(t.Pop > 0) {
            state.pcts = { D:(t.D/t.Pop)*100, R:(t.R/t.Pop)*100, G:(t.G/t.Pop)*100, L:(t.L/t.Pop)*100 };
        }
    },

    // --- GAMEPLAY FLOW ---
    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        this.goToScreen('game-screen');
        
        // Set Candidate Display
        document.getElementById('hud-img').src = this.data.candidate.img;
        document.getElementById('hud-img').style.display = 'block';
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty].name.toUpperCase();
        
        // Apply Initial Candidate Buffs (Swing)
        const shift = this.data.candidate.base_appeal;
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            s.counties.forEach(c => {
                if(this.data.selectedParty === 'D') c.pcts.D += shift; else c.pcts.R += shift;
                c.normalizePcts();
            });
            this.recalcStatePoll(s);
        }
        
        this.initMap();
        this.updateHUD();
    },

    nextWeek: function() {
        // 1. Advance Date
        this.data.currentDate.setDate(this.data.currentDate.getDate() + 7);
        if(this.data.currentDate >= this.data.electionDay) {
            this.endGame();
            return;
        }

        // 2. Replenish Energy
        this.data.energy = this.data.maxEnergy;

        // 3. AI Turn
        this.aiTurn();

        // 4. Update Visuals
        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        
        this.showToast(`Week of ${this.data.currentDate.toLocaleDateString()}`);
    },

    aiTurn: function() {
        const aiParty = this.data.selectedParty === 'D' ? 'R' : 'D';
        const states = Object.values(this.data.states);
        
        // AI Strategy: Find close states (margin < 8%) with high EV
        let targets = states.filter(s => Math.abs(s.pcts.D - s.pcts.R) < 8)
                            .sort((a,b) => b.ev - a.ev); // Sort by EV descending
        
        // AI spends energy/funds on top 3 targets
        let actions = 0;
        for (let s of targets) {
            if (actions > 5) break;
            if (Math.random() > 0.3) {
                // AI "Ads" effect: shifts state by 0.2%
                s.counties.forEach(c => {
                    if (aiParty === 'R') c.pcts.R += 0.3; else c.pcts.D += 0.3;
                    c.normalizePcts();
                });
                this.recalcStatePoll(s);
                actions++;
            }
        }
        // AI Fundraising
        this.data.aiFunds += Math.floor(Math.random() * 5); 
    },

    endGame: function() {
        let dEV = 0, rEV = 0;
        let dPop = 0, rPop = 0;

        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            this.recalcStatePoll(s); // Final Tally
            if(s.pcts.D > s.pcts.R) dEV += s.ev; else rEV += s.ev;
        }

        let winner = dEV >= 270 ? "DEMOCRATS WIN!" : "REPUBLICANS WIN!";
        if(dEV === 269 && rEV === 269) winner = "CONTINGENT ELECTION!";

        alert(`ELECTION OVER!\n\n${winner}\n\nDemocrats: ${dEV} EV\nRepublicans: ${rEV} EV`);
        location.reload(); // Reset for now
    },

    // --- ACTIONS ---
    doCountyAction: function(action) {
        const c = this.data.selectedCounty;
        const s = this.data.activeCountyState;
        
        if (action === 'rally') {
            if(this.data.energy > 0) {
                this.data.energy--;
                // Boost turnout for your party
                if(this.data.selectedParty === 'D') c.enthusiasm.D += 0.15; else c.enthusiasm.R += 0.15;
                this.showToast(`Rally in ${c.name} successful!`);
            } else return this.showToast("No Energy!");
        } 
        else if (action === 'ad') {
            if(this.data.funds >= 0.5) {
                this.data.funds -= 0.5;
                // Swing voters
                if(this.data.selectedParty === 'D') c.pcts.D += 1.5; else c.pcts.R += 1.5;
                c.normalizePcts();
                this.showToast("Local Ad Campaign launched!");
            } else return this.showToast("Need $0.5M!");
        }
        else if (action === 'poll') {
            if(this.data.funds >= 0.1) {
                this.data.funds -= 0.1;
                alert(`${c.name} Internal Poll:\nD: ${c.pcts.D.toFixed(1)}%\nR: ${c.pcts.R.toFixed(1)}%`);
            } else return this.showToast("Need $0.1M!");
        }

        this.recalcStatePoll(s);
        this.updateHUD();
        this.setCountyMapMode(this.data.mapMode);
        this.clickState(this.data.selectedState);
        document.getElementById('county-menu').classList.add('hidden');
    },
    
    // --- UI/MAP FUNCTIONS ---
    getMarginColor: function(info) {
        let m = Math.abs(info.margin);
        if (isNaN(m) || m < 0.5) return "#FFFFFF";
        let i = Math.min(m/15, 1); // 15% margin = full color saturation
        if(info.party === 'D') return `rgb(${Math.round(255-(255*i))}, ${Math.round(255-(81*i))}, ${Math.round(255-(12*i))})`;
        else return `rgb(${Math.round(255-(23*i))}, ${Math.round(255-(228*i))}, ${Math.round(255-(220*i))})`;
    },

    initMap: function() {
        for(let code in this.data.states) {
            let p = document.getElementById(code);
            if(p) {
                p.onclick = () => this.clickState(code);
                p.ondblclick = () => { this.clickState(code); this.enterStateView(); };
                p.onmousemove = (e) => this.showTooltip(e, code);
                p.onmouseleave = () => document.getElementById('map-tooltip').style.display='none';
            }
        }
        this.colorMap();
    },

    colorMap: function() {
        let d=0, r=0;
        for(let code in this.data.states) {
            let s = this.data.states[code];
            let p = document.getElementById(code);
            if(p) {
                let m = s.pcts.D - s.pcts.R;
                p.style.fill = this.getMarginColor({margin: m, party: m>0?'D':'R'});
            }
            if(s.pcts.D > s.pcts.R) d+=s.ev; else r+=s.ev;
        }
        // Update EV Bar
        document.getElementById('score-dem').innerText = d; 
        document.getElementById('score-rep').innerText = r;
        let dp = (d/538)*100, rp = (r/538)*100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #00AEF3 ${dp}%, #333 ${dp}%, #333 ${100-rp}%, #E81B23 ${100-rp}%)`;
    },

    // ... (Keep existing UI navigation renderParties, selParty, renderCands, selCand, etc. from previous version) ...
    // To save space, I will assume the Setup Screen functions (renderParties down to toggleThirdParties) remain exactly as they were. 
    // Just ensure `startGame` is updated as written above.

    // --- SETUP SCREENS (Re-pasted for completeness safety) ---
    renderParties: function() {
        const c = document.getElementById('party-cards'); if(!c) return; c.innerHTML = "";
        ['D','R','I'].forEach(k => {
            const p = PARTIES[k];
            c.innerHTML += `<div class="card card-party" onclick="app.selParty('${k}')" style="background-image:url('${p.img}'); border-top:5px solid ${p.color}"><div class="party-overlay"><h3>${p.name} Party</h3><div class="party-desc">${p.desc}</div></div></div>`;
        });
    },
    selParty: function(k) { this.data.selectedParty = k; this.renderCands(k); this.goToScreen('candidate-screen'); },
    renderCands: function(pk) {
        const c = document.getElementById('candidate-cards'); c.innerHTML = "";
        CANDIDATES.filter(x => x.party === pk).forEach(cand => {
            c.innerHTML += `<div class="card" onclick="app.selCand('${cand.id}')"><div class="portrait"><img src="${cand.img}"></div><div class="card-info"><h3>${cand.name}</h3><p>${cand.desc}</p><p class="buff-text">Stamina: ${cand.stamina}</p></div></div>`;
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
    
    // --- MAP RENDERING ---
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
        
        if(this.data.masterMapCache) this.extractStateFromMaster(this.data.masterMapCache, s, container);
        else {
            fetch('counties/uscountymap.svg')
                .then(res => { if(!res.ok) throw new Error("Load Fail"); return res.text(); })
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
        
        if(group) validPaths = Array.from(group.querySelectorAll('path, polygon'));
        else {
            let fips = stateObj.fips; 
            let allPaths = doc.querySelectorAll('path, polygon');
            allPaths.forEach(p => { if(p.id && p.id.indexOf(fips) !== -1) validPaths.push(p); });
        }

        if(validPaths.length === 0) { this.generateFallbackMap(container, stateObj); return; }

        let newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvg.setAttribute("viewBox", "0 0 990 627");
