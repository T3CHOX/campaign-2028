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
    { id: "yang", name: "Andrew Yang", party: "I", funds: 90, img: "images/yang.jpg", buff: "Tech", desc: "Forward.", stamina: 8, base_appeal: 0 }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg" },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/kelly.jpg" },
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

/* --- COUNTY CLASS --- */
class County {
    constructor(id, name, stateType, realData=null, baseG=1, baseL=1) {
        this.id = id;
        this.name = name || id;

        if (realData) {
            this.type = realData.t || "Rural";
            this.population = realData.p || 10000;
            this.demographics = realData.d || {};
            this.pcts = {
                D: realData.v.D,
                R: realData.v.R,
                G: baseG * 0.5,
                L: baseL * 0.5
            };
        } else {
            // Fallback Procedural
            const rand = Math.random();
            this.type = stateType === 'Urban' ? (rand > 0.3 ? 'Urban' : 'Suburb') : 'Rural';
            let base = this.type === 'Urban' ? 500000 : 20000;
            this.population = Math.floor(base * (0.8 + Math.random()));
            let lean = this.type === 'Urban' ? 65 : 35;
            this.pcts = { D: lean, R: 100 - lean, G: baseG, L: baseL };
        }
        
        this.enthusiasm = { D: 1.0, R: 1.0 };
        this.normalizePcts();
    }

    normalizePcts() {
        let total = this.pcts.D + this.pcts.R + this.pcts.G + this.pcts.L;
        if(total === 0) total = 1;
        for(let k in this.pcts) this.pcts[k] = (this.pcts[k] / total) * 100;
    }

    getVotes() {
        return {
            D: this.population * (this.pcts.D/100) * this.enthusiasm.D * 0.6,
            R: this.population * (this.pcts.R/100) * this.enthusiasm.R * 0.6,
            G: this.population * (this.pcts.G/100) * 0.4,
            L: this.population * (this.pcts.L/100) * 0.4
        };
    }
}

/* --- MAIN APP --- */
const app = {
    data: {
        currentDate: new Date("2028-07-04"), electionDay: new Date("2028-11-07"),
        selectedParty: null, candidate: null, vp: null, opponent: null,
        funds: 0, energy: 8, maxEnergy: 8, thirdPartiesEnabled: true,
        states: {}, selectedState: null, activeCountyState: null,
        mapMode: 'political', masterMapCache: null, realCountyData: null,
        selectedCounty: null, aiFunds: 100
    },

    init: async function() {
        console.log("Initializing...");
        
        // Robust Fetch
        try {
            const res = await fetch('counties/county_data.json');
            if (res.ok) {
                this.data.realCountyData = await res.json();
                console.log("County Data Loaded.");
            }
        } catch(e) { console.warn("Using procedural data fallback."); }

        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        
        // Generate State Data
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            s.safeName = s.name.replace(/ /g, "_");
            s.flagUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_${s.safeName}.svg`;
            
            // Generate Counties
            s.counties = this.generateCountiesForState(s);
            this.recalcStatePoll(s);
        }
        
        this.renderParties();
        
        // Close menu listener
        document.getElementById('county-map-container').addEventListener('click', (e) => {
            if(e.target.tagName !== 'path' && e.target.tagName !== 'rect') {
                document.getElementById('county-menu').classList.add('hidden');
            }
        });
    },

    generateCountiesForState: function(state) {
        let counties = [];
        // Match Real Data
        if (this.data.realCountyData) {
            for (let fips in this.data.realCountyData) {
                if (fips.startsWith(state.fips)) {
                    let cData = this.data.realCountyData[fips];
                    counties.push(new County("c"+fips, cData.n, "Real", cData));
                }
            }
        }
        // Fallback
        if (counties.length === 0) {
            let num = Math.max(5, state.ev * 2);
            for(let i=0; i<num; i++) counties.push(new County(`c_${state.fips}_${i}`, `County ${i+1}`, i==0?"Urban":"Rural"));
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

    // --- GAME LOOP ---
    startGame: function() {
        if(!this.data.candidate) { alert("Please select a candidate first!"); return; }
        
        this.data.funds = this.data.candidate.funds;
        this.goToScreen('game-screen');
        
        const img = document.getElementById('hud-img');
        img.src = this.data.candidate.img; 
        img.style.display = 'block';
        img.className = `hud-border-${this.data.selectedParty}`;
        
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty].name.toUpperCase();
        
        this.initMap();
        this.updateHUD();
        this.colorMap();
    },

    nextWeek: function() {
        this.data.currentDate.setDate(this.data.currentDate.getDate() + 7);
        if(this.data.currentDate >= this.data.electionDay) {
            this.endGame();
            return;
        }

        // Regen
        this.data.energy = this.data.maxEnergy;
        this.data.funds += 2; // Passive income

        // AI Logic
        this.aiTurn();

        this.updateHUD();
        this.colorMap();
        
        // Refresh Current Views
        if(this.data.activeCountyState) {
            this.setCountyMapMode(this.data.mapMode);
            this.recalcStatePoll(this.data.activeCountyState);
            this.clickState(this.data.selectedState);
        } else if (this.data.selectedState) {
            this.clickState(this.data.selectedState);
        }

        this.showToast(`Week of ${this.data.currentDate.toLocaleDateString()}`);
    },

    aiTurn: function() {
        const aiParty = this.data.selectedParty === 'D' ? 'R' : 'D';
        // AI targets close states
        let targets = Object.values(this.data.states)
            .filter(s => Math.abs(s.pcts.D - s.pcts.R) < 10)
            .sort((a,b) => b.ev - a.ev); // Prioritize EVs

        for(let i=0; i<3 && i<targets.length; i++) {
            let s = targets[i];
            s.counties.forEach(c => {
                // AI Ad Buy
                if(aiParty === 'R') c.pcts.R += 0.4; else c.pcts.D += 0.4;
                c.normalizePcts();
            });
            this.recalcStatePoll(s);
        }
    },

    endGame: function() {
        let dEV = 0, rEV = 0;
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            if(s.pcts.D > s.pcts.R) dEV += s.ev; else rEV += s.ev;
        }
        let msg = dEV > rEV ? "DEMOCRATS WIN!" : "REPUBLICANS WIN!";
        if(dEV === rEV) msg = "TIED ELECTION!";
        alert(`ELECTION FINISHED!\n${msg}\nD: ${dEV} | R: ${rEV}`);
        location.reload();
    },

    // --- ACTIONS ---
    doCountyAction: function(action) {
        const c = this.data.selectedCounty;
        const s = this.data.activeCountyState;
        
        // --- NEIGHBOR EFFECT LOGIC ---
        // Boost selected county heavily, others in state lightly
        const applyEffect = (dBoost, rBoost, enthBoost) => {
            // Target
            if(this.data.selectedParty === 'D') c.pcts.D += dBoost; else c.pcts.R += rBoost;
            c.enthusiasm[this.data.selectedParty] += enthBoost;
            c.normalizePcts();

            // Ripple to neighbors (entire state simplified)
            s.counties.forEach(neighbor => {
                if(neighbor.id !== c.id) {
                    if(this.data.selectedParty === 'D') neighbor.pcts.D += (dBoost * 0.15); 
                    else neighbor.pcts.R += (rBoost * 0.15);
                    neighbor.normalizePcts();
                }
            });
        };

        if (action === 'rally') {
            if(this.data.energy < 1) return this.showToast("No Energy!");
            this.data.energy--;
            applyEffect(2.0, 2.0, 0.2); // Big shift
            this.showToast("Rally held!");
        } 
        else if (action === 'ad') {
            if(this.data.funds < 0.5) return this.showToast("Need $0.5M!");
            this.data.funds -= 0.5;
            applyEffect(3.5, 3.5, 0.05); // Huge shift
            this.showToast("Ad Blitz launched!");
        }
        else if (action === 'poll') {
            if(this.data.funds < 0.1) return this.showToast("Need $0.1M!");
            this.data.funds -= 0.1;
            alert(`${c.name} Poll:\nD: ${c.pcts.D.toFixed(1)}%\nR: ${c.pcts.R.toFixed(1)}%`);
        }

        // Update UI
        this.recalcStatePoll(s);
        this.updateHUD();
        this.setCountyMapMode(this.data.mapMode);
        this.clickState(this.data.selectedState); // Refresh sidebar bars
        document.getElementById('county-menu').classList.add('hidden');
    },

    // --- VISUALS ---
    getMarginColor: function(info) {
        let m = info.margin; 
        let party = info.party;
        let abs = Math.abs(m);
        
        if (abs < 1) return "#E0E0E0"; // Tossup Gray

        // Deep Colors for > 25% margin
        if (party === 'D') {
            if(abs > 25) return "#002a4d"; // Deep Navy
            if(abs > 15) return "#005a9c"; // Solid Blue
            if(abs > 5) return "#56a0d3";  // Likely Blue
            return "#a2cffe";              // Lean Blue
        } else {
            if(abs > 25) return "#5e0000"; // Deep Crimson
            if(abs > 15) return "#b30000"; // Solid Red
            if(abs > 5) return "#ff4d4d";  // Likely Red
            return "#ff9999";              // Lean Red
        }
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
        document.getElementById('score-dem').innerText = d; 
        document.getElementById('score-rep').innerText = r;
        let dp = (d/538)*100, rp = (r/538)*100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #00AEF3 ${dp}%, #333 ${dp}%, #333 ${100-rp}%, #E81B23 ${100-rp}%)`;
    },

    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('empty-msg').classList.add('hidden');
        
        let m = s.pcts.D - s.pcts.R;
        let lead = m > 0 ? "D" : "R";
        let col = m > 0 ? "blue" : "red";
        if(Math.abs(m)<0.1) { lead="TIED"; col="gray"; } else { lead = `${lead}+${Math.abs(m).toFixed(1)}`; }
        
        document.getElementById('sp-name').innerHTML = `${s.name} <span class="${col}" style="font-size:0.8em;">${lead}</span>`;
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

    // --- COUNTY MAP ---
    extractStateFromMaster: function(svgData, stateObj, container) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(svgData, "image/svg+xml");
        let group = doc.getElementById(stateObj.name);
        let validPaths = [];
        
        if(group) validPaths = Array.from(group.querySelectorAll('path, polygon'));
        else {
            let fips = stateObj.fips; 
            doc.querySelectorAll('path, polygon').forEach(p => { if(p.id && p.id.indexOf(fips) !== -1) validPaths.push(p); });
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
        container.innerHTML = ""; container.appendChild(newSvg);
        // Auto-zoom logic
        setTimeout(() => { try { let bbox = newSvg.getBBox(); if(bbox.width > 0) newSvg.setAttribute("viewBox", `${bbox.x-10} ${bbox.y-10} ${bbox.width+20} ${bbox.height+20}`); } catch(e){} }, 50);
    },

    colorCountyPath: function(path, c) {
        let fill = "#333";
        if(this.data.mapMode === 'political') {
            let m = c.pcts.D - c.pcts.R;
            fill = this.getMarginColor({ margin: m, party: m > 0 ? 'D':'R' });
        }
        path.style.fill = fill; path.style.stroke = "#111"; path.style.strokeWidth = "0.15px";
    },

    showCountyTooltip: function(e, c) {
        let tt = document.getElementById('county-tooltip');
        let m = c.pcts.D - c.pcts.R;
        let lead = m > 0 ? "D" : "R";
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        tt.innerHTML = `<span class="tooltip-leader" style="color:${col}">${c.name} ${lead}+${Math.abs(m).toFixed(1)}</span>
                        <div class="tip-row"><span class="blue">DEM ${c.pcts.D.toFixed(1)}%</span> <span class="red">REP ${c.pcts.R.toFixed(1)}%</span></div>
                        <div style="font-size:0.7em; color:#aaa; margin-top:3px">Pop: ${(c.population/1000).toFixed(1)}k</div>`;
        tt.style.left = (e.clientX+15)+"px"; tt.style.top = (e.clientY+15)+"px";
        tt.classList.remove('hidden');
    },

    // --- NAVIGATION ---
    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    selParty: function(k) { this.data.selectedParty = k; this.renderCands(k); this.goToScreen('candidate-screen'); },
    
    // --- UTILS ---
    updateHUD: function() {
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        const ec = document.getElementById('hud-energy'); ec.innerHTML="";
        for(let i=0; i<this.data.maxEnergy; i++) ec.innerHTML += `<div class="energy-pip ${i<this.data.energy?'active':''}"></div>`;
        document.getElementById('hud-date').innerText = this.data.currentDate.toLocaleDateString();
    },
    showTooltip: function(e, code) {
        const tt = document.getElementById('map-tooltip');
        const s = this.data.states[code];
        let m = s.pcts.D - s.pcts.R;
        let name = m > 0 ? "Dem" : "Rep"; 
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        tt.innerHTML = `<span class="tooltip-leader" style="color:${col}">${s.name} +${Math.abs(m).toFixed(1)}</span><div class="tip-row"><span class="blue">DEM ${s.pcts.D.toFixed(1)}%</span> <span class="red">REP ${s.pcts.R.toFixed(1)}%</span></div>`;
        tt.style.display='block'; tt.style.left=(e.clientX+15)+'px'; tt.style.top=(e.clientY+15)+'px';
    },
    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.style.opacity = 1; setTimeout(()=>t.style.opacity=0, 2000);
    },
    generateFallbackMap: function(container, stateObj) { /* (Same as before, placeholder logic) */ }
};

document.addEventListener('DOMContentLoaded', () => app.init());
