/* --- CONFIGURATION --- */
const PARTIES = {
    D: { name: "Democratic", color: "#00AEF3", img: "images/harrison.jpg" },
    R: { name: "Republican", color: "#E81B23", img: "images/whatley.jpg" },
    G: { name: "Green", color: "#198754" },
    L: { name: "Libertarian", color: "#fd7e14" },
    O: { name: "Independent", color: "#F2C75C" }
};

const ISSUES = [ 
    { id: 'econ', name: 'Economy' }, { id: 'jobs', name: 'Jobs' }, 
    { id: 'tax', name: 'Tax Policy' }, { id: 'health', name: 'Healthcare' }, 
    { id: 'immig', name: 'Immigration' }, { id: 'clim', name: 'Climate' }, 
    { id: 'gun', name: 'Gun Control' }, { id: 'abort', name: 'Abortion' }, 
    { id: 'foreign', name: 'Foreign Pol.' }, { id: 'crime', name: 'Crime' } 
];

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", stamina: 8, ai_skill: 8, lastName: "Harris" },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", stamina: 9, ai_skill: 9, lastName: "Newsom" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer.jpg", stamina: 8, ai_skill: 9, lastName: "Whitmer" },
    { id: "desantis", name: "Ron DeSantis", party: "R", funds: 65, img: "images/desantis.jpg", stamina: 9, ai_skill: 9, lastName: "DeSantis" },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", stamina: 8, ai_skill: 7, lastName: "Vance" },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", stamina: 10, ai_skill: 6, lastName: "Ramaswamy" },
    { id: "yang", name: "Andrew Yang", party: "I", funds: 40, img: "images/yang.jpg", stamina: 8, ai_skill: 5, lastName: "Yang" },
    { id: "stein", name: "Jill Stein", party: "G", funds: 10, img: "images/scenario.jpg", stamina: 6, ai_skill: 3, lastName: "Stein" },
    { id: "oliver", name: "Chase Oliver", party: "L", funds: 12, img: "images/scenario.jpg", stamina: 7, ai_skill: 3, lastName: "Oliver" }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg", ai_skill: 5 },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/scenario.jpg", ai_skill: 4 },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/scenario.jpg", ai_skill: 4 },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", img: "images/scenario.jpg", ai_skill: 3 }
];

const INIT_STATES = {
    "AL": {name:"Alabama",ev:9,fips:"01"}, "AK":{name:"Alaska",ev:3,fips:"02"}, "AZ":{name:"Arizona",ev:11,fips:"04"},
    "AR": {name:"Arkansas",ev:6,fips:"05"}, "CA":{name:"California",ev:54,fips:"06"}, "CO":{name:"Colorado",ev:10,fips:"08"},
    "CT": {name:"Connecticut",ev:7,fips:"09"}, "DE":{name:"Delaware",ev:3,fips:"10"}, "DC":{name:"District of Columbia",ev:3,fips:"11"},
    "FL": {name:"Florida",ev:30,fips:"12"}, "GA":{name:"Georgia",ev:16,fips:"13"}, "HI":{name:"Hawaii",ev:4,fips:"15"},
    "ID": {name:"Idaho",ev:4,fips:"16"}, "IL":{name:"Illinois",ev:19,fips:"17"}, "IN":{name:"Indiana",ev:11,fips:"18"},
    "IA": {name:"Iowa",ev:6,fips:"19"}, "KS":{name:"Kansas",ev:6,fips:"20"}, "KY":{name:"Kentucky",ev:8,fips:"21"},
    "LA": {name:"Louisiana",ev:8,fips:"22"}, "ME":{name:"Maine",ev:4,fips:"23"}, "MD":{name:"Maryland",ev:10,fips:"24"},
    "MA": {name:"Massachusetts",ev:11,fips:"25"}, "MI":{name:"Michigan",ev:15,fips:"26"}, "MN":{name:"Minnesota",ev:10,fips:"27"},
    "MS": {name:"Mississippi",ev:6,fips:"28"}, "MO":{name:"Missouri",ev:10,fips:"29"}, "MT":{name:"Montana",ev:4,fips:"30"},
    "NE": {name:"Nebraska",ev:5,fips:"31"}, "NV":{name:"Nevada",ev:6,fips:"32"}, "NH":{name:"New Hampshire",ev:4,fips:"33"},
    "NJ": {name:"New Jersey",ev:14,fips:"34"}, "NM":{name:"New Mexico",ev:5,fips:"35"}, "NY":{name:"New York",ev:28,fips:"36"},
    "NC": {name:"North Carolina",ev:16,fips:"37"}, "ND":{name:"North Dakota",ev:3,fips:"38"}, "OH":{name:"Ohio",ev:17,fips:"39"},
    "OK": {name:"Oklahoma",ev:7,fips:"40"}, "OR":{name:"Oregon",ev:8,fips:"41"}, "PA":{name:"Pennsylvania",ev:19,fips:"42"},
    "RI": {name:"Rhode Island",ev:4,fips:"44"}, "SC":{name:"South Carolina",ev:9,fips:"45"}, "SD":{name:"South Dakota",ev:3,fips:"46"},
    "TN": {name:"Tennessee",ev:11,fips:"47"}, "TX":{name:"Texas",ev:40,fips:"48"}, "UT":{name:"Utah",ev:6,fips:"49"},
    "VT": {name:"Vermont",ev:3,fips:"50"}, "VA":{name:"Virginia",ev:13,fips:"51"}, "WA":{name:"Washington",ev:12,fips:"53"},
    "WV": {name:"West Virginia",ev:4,fips:"54"}, "WI":{name:"Wisconsin",ev:10,fips:"55"}, "WY":{name:"Wyoming",ev:3,fips:"56"}
};

/* --- COUNTY CLASS --- */
class County {
    constructor(id, name, stateType, realData=null, baseG=1, baseL=1) {
        this.id = id;
        this.name = name || id;
        
        if (realData) {
            this.type = realData.t || "Rural";
            this.population = realData.p || 10000;
            // SAFE PERCENTAGE LOADING
            this.pcts = {
                D: realData.v ? realData.v.D : 45,
                R: realData.v ? realData.v.R : 45,
                G: (realData.v && realData.v.G) ? realData.v.G : 0,
                L: (realData.v && realData.v.L) ? realData.v.L : 0,
                O: (realData.v && realData.v.O) ? realData.v.O : 0
            };
        } else {
            // PROCEDURAL FALLBACK
            this.type = stateType === 'Urban' ? 'Urban' : 'Rural';
            this.population = 10000;
            this.pcts = { D: 45, R: 45, G: 1, L: 1, O: 8 };
        }
        
        this.enthusiasm = { D: 1.0, R: 1.0 };
        this.normalizePcts();
    }

    normalizePcts() {
        if (!app.data.thirdPartiesEnabled) {
            let total = this.pcts.D + this.pcts.R;
            if(total===0) total=1;
            this.displayPcts = {
                D: (this.pcts.D / total) * 100,
                R: (this.pcts.R / total) * 100,
                G: 0, L: 0, O: 0
            };
        } else {
            this.displayPcts = { ...this.pcts };
        }
    }

    getVotes() {
        let d = this.population * (this.pcts.D/100) * this.enthusiasm.D;
        let r = this.population * (this.pcts.R/100) * this.enthusiasm.R;
        let g = this.population * (this.pcts.G/100);
        let l = this.population * (this.pcts.L/100);
        let o = this.population * (this.pcts.O/100);
        
        if (!app.data.thirdPartiesEnabled) { g=0; l=0; o=0; }
        return { D:d, R:r, G:g, L:l, O:o };
    }
}

/* --- APP CORE --- */
const app = {
    data: {
        currentDate: new Date("2028-07-04"), electionDay: new Date("2028-11-07"),
        selectedParty: null, candidate: null, vp: null, opponent: null, opponentVP: null,
        funds: 0, energy: 8, maxEnergy: 8, thirdPartiesEnabled: true,
        states: {}, selectedState: null, activeCountyState: null,
        mapMode: 'political', masterMapCache: null, realCountyData: null,
        selectedCounty: null, aiDifficulty: 0, viewMode: 'national',
        historyStack: []
    },

    init: async function() {
        console.log("App Initializing...");
        try {
            const res = await fetch('counties/county_data.json');
            if (res.ok) this.data.realCountyData = await res.json();
        } catch(e) { console.log("Data load warning: " + e); }

        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            s.moe = (Math.random()*2 + 1.5).toFixed(1);
            let safeName = s.name.replace(/ /g, "_");
            s.flagUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_${safeName}.svg`;
            s.counties = this.generateCountiesForState(s, 1, 1);
            this.recalcStatePoll(s);
        }
        this.renderParties();
    },

    generateCountiesForState: function(state, baseG, baseL) {
        let counties = [];
        if (this.data.realCountyData) {
            for (let fips in this.data.realCountyData) {
                if (fips.startsWith(state.fips)) {
                    let cData = this.data.realCountyData[fips];
                    counties.push(new County("c"+fips, cData.n, "Real", cData, baseG, baseL));
                }
            }
        }
        if (counties.length === 0) {
            let num = Math.max(5, state.ev * 1.5);
            for(let i=0; i<num; i++) counties.push(new County(`c_${state.fips}_${i}`, `County ${i+1}`, "Rural"));
        }
        return counties;
    },

    recalcStatePoll: function(state) {
        let t = {D:0,R:0,G:0,L:0,O:0};
        let pop = 0;
        state.counties.forEach(c => {
            let v = c.getVotes();
            t.D += v.D; t.R += v.R; t.G += v.G; t.L += v.L; t.O += v.O;
            pop += (v.D+v.R+v.G+v.L+v.O);
        });
        
        if(pop > 0) {
            let divisor = this.data.thirdPartiesEnabled ? pop : (t.D + t.R);
            if(divisor===0) divisor=1;
            state.pcts = {
                D: (t.D / divisor) * 100, R: (t.R / divisor) * 100,
                G: (t.G / divisor) * 100, L: (t.L / divisor) * 100, O: (t.O / divisor) * 100
            };
        }
    },

    /* --- ACTIONS --- */
    handleAction: function(type) {
        // Save history for Undo
        const snap = JSON.parse(JSON.stringify({
            states: this.data.states,
            funds: this.data.funds,
            energy: this.data.energy,
            date: this.data.currentDate.getTime()
        }));
        this.data.historyStack.push(snap);
        if(this.data.historyStack.length > 5) this.data.historyStack.shift();

        // Target Logic
        let target = this.data.viewMode==='state' && this.data.selectedCounty ? this.data.selectedCounty : this.data.states[this.data.selectedState];
        let stateObj = this.data.viewMode==='state' ? this.data.activeCountyState : target;
        let isCounty = this.data.viewMode==='state' && this.data.selectedCounty;

        let boost = 0, ripple = 0, costF = 0, costE = 0;

        if (type === 'rally') {
            costE = isCounty ? 1 : 2;
            if(this.data.energy < costE) return this.showToast("No Energy");
            this.data.energy -= costE;
            // NERFED: 1.5% local, 0.2% ripple
            boost = isCounty ? 1.5 : 0.5;
            ripple = isCounty ? 0.2 : 0;
        } else if (type === 'ad') {
            costF = isCounty ? 0.5 : 2.0;
            if(this.data.funds < costF) return this.showToast("No Funds");
            this.data.funds -= costF;
            // NERFED: 2.5% local, 0.5% ripple
            boost = isCounty ? 2.5 : 1.0;
            ripple = isCounty ? 0.5 : 0;
        } else if (type === 'fundraise') {
            if(this.data.energy < 1) return this.showToast("No Energy");
            this.data.energy--;
            this.data.funds += 2.0;
            this.updateHUD();
            this.showToast("Funds Raised");
            return;
        }

        // Apply Boosts
        if(this.data.selectedParty === 'D') {
            target.pcts.D += boost; target.enthusiasm.D += 0.1;
            if(ripple > 0) stateObj.counties.forEach(n => { if(n !== target) n.pcts.D += ripple; });
        } else {
            target.pcts.R += boost; target.enthusiasm.R += 0.1;
            if(ripple > 0) stateObj.counties.forEach(n => { if(n !== target) n.pcts.R += ripple; });
        }

        // Refresh Data & UI
        if (isCounty) {
            stateObj.counties.forEach(c => c.normalizePcts());
            this.recalcStatePoll(stateObj);
            // Recolor Map
            let container = document.getElementById('county-map-container');
            let paths = container.querySelectorAll('path, rect');
            paths.forEach(p => {
                let c = stateObj.counties.find(x => x.id === p.id) || stateObj.counties[p.getAttribute('data-idx')];
                if(c) this.colorCountyPath(p, c);
            });
        } else {
            target.counties.forEach(c => {
                if(this.data.selectedParty==='D') c.pcts.D += boost; else c.pcts.R += boost;
                c.normalizePcts();
            });
            this.recalcStatePoll(target);
        }

        this.updateSidebar(target, isCounty ? 'county' : 'state');
        this.updateHUD();
        this.showToast("Action Complete");
    },

    undoLastAction: function() {
        if(this.data.historyStack.length === 0) return this.showToast("Nothing to Undo");
        const prev = this.data.historyStack.pop();
        this.data.funds = prev.funds;
        this.data.energy = prev.energy;
        this.data.currentDate = new Date(prev.date);
        
        for(let sCode in prev.states) {
            let sPrev = prev.states[sCode];
            let sCurr = this.data.states[sCode];
            sCurr.pcts = sPrev.pcts;
            sCurr.counties.forEach((c, i) => {
                c.pcts = sPrev.counties[i].pcts;
                c.enthusiasm = sPrev.counties[i].enthusiasm;
                c.normalizePcts();
            });
        }
        this.updateHUD(); this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("Undo Successful");
    },

    /* --- MAP & NAVIGATION --- */
    goToScreen: function(id) { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); },
    
    renderParties: function() { 
        const c=document.getElementById('party-cards'); if(c) { c.innerHTML=""; ['D','R','I'].forEach(k=>{ c.innerHTML+=`<div class="card card-party" onclick="app.selParty('${k}')" style="background-image:url('${PARTIES[k].img}'); border-top:5px solid ${PARTIES[k].color}"><div class="party-overlay"><h3>${PARTIES[k].name}</h3></div></div>`; }); }
    },
    selParty: function(k){ this.data.selectedParty=k; this.renderCands(k); this.goToScreen('candidate-screen'); },
    renderCands: function(pk){ const c=document.getElementById('candidate-cards'); c.innerHTML=""; CANDIDATES.filter(x=>x.party===pk).forEach(x=>{ c.innerHTML+=`<div class="card" onclick="app.selCand('${x.id}')"><div class="portrait"><img src="${x.img}"></div><div class="card-info"><h3>${x.id.toUpperCase()}</h3></div></div>`; }); },
    selCand: function(id){ this.data.candidate=CANDIDATES.find(x=>x.id===id); this.data.maxEnergy=this.data.candidate.stamina; this.data.energy=this.data.maxEnergy; this.renderVPs(this.data.candidate.party); this.goToScreen('vp-screen'); },
    renderVPs: function(pk){ const c=document.getElementById('vp-cards'); c.innerHTML=""; VPS.filter(x=>x.party===pk).forEach(x=>{ c.innerHTML+=`<div class="card" onclick="app.selVP('${x.id}')"><div class="portrait"><img src="${x.img}"></div><div class="card-info"><h3>${x.name}</h3></div></div>`; }); },
    selVP: function(id){ this.data.vp=VPS.find(x=>x.id===id); this.renderOpp(); },
    renderOpp: function(){ const c=document.getElementById('opponent-cards-major'); c.innerHTML=""; let rival=this.data.selectedParty==='D'?'R':'D'; CANDIDATES.filter(x=>x.party===rival).forEach(x=>{ c.innerHTML+=`<div class="card" onclick="app.selOpp('${x.id}')"><div class="portrait"><img src="${x.img}"></div><div class="card-info"><h3>${x.id.toUpperCase()}</h3></div></div>`;}); this.goToScreen('opponent-screen'); },
    selOpp: function(id){ this.data.opponent=CANDIDATES.find(x=>x.id===id); this.startGame(); },
    toggleThirdParties: function() { this.data.thirdPartiesEnabled = document.getElementById('third-party-toggle').checked; },

    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        this.data.aiDifficulty = (this.data.opponent.ai_skill || 5) + 3;
        this.goToScreen('game-screen');
        
        // Initial Calculation
        for(let s in this.data.states) {
            let state = this.data.states[s];
            state.counties.forEach(c => c.normalizePcts());
            this.recalcStatePoll(state);
        }
        
        document.getElementById('hud-img').src = this.data.candidate.img;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.lastName;
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty].name;
        this.initMap(); this.updateHUD();
    },

    /* --- MAP LOGIC --- */
    initMap: function() {
        for(let code in this.data.states) {
            let p = document.getElementById(code);
            if(p) {
                p.onclick = () => this.clickState(code);
                p.ondblclick = () => { this.clickState(code); this.enterStateView(); };
                p.onmousemove = (e) => this.showTooltip(e, this.data.states[code]);
                p.onmouseleave = () => document.getElementById('map-tooltip').style.display='none';
            }
        }
        this.colorMap();
    },
    clickState: function(code) {
        this.data.selectedState = code;
        this.updateSidebar(this.data.states[code], 'state');
    },
    colorMap: function() {
        for(let code in this.data.states) {
            let s = this.data.states[code];
            let p = document.getElementById(code);
            if(p) {
                let m = s.pcts.D - s.pcts.R;
                p.style.fill = this.getMarginColor(m);
            }
        }
        this.updateScore();
    },

    /* --- COUNTY VIEW & RETURN BUTTON --- */
    enterStateView: function() {
        const s = this.data.states[this.data.selectedState];
        if(!s) return;
        this.data.activeCountyState = s;
        this.data.viewMode = 'state';
        
        document.getElementById('us-map-svg').classList.add('hidden');
        document.getElementById('county-view-wrapper').classList.remove('hidden');
        
        // Show/Hide Sidebar Buttons
        document.getElementById('btn-entercountymap').classList.add('hidden');
        document.getElementById('btn-returnmap').classList.remove('hidden');
        
        // Margin in Header
        let m = s.pcts.D - s.pcts.R;
        let leadStr = Math.abs(m) < 0.1 ? "EVEN" : `${m>0?"D":"R"}+${Math.abs(m).toFixed(1)}`;
        document.getElementById('cv-title').innerText = `${s.name.toUpperCase()} (${leadStr})`;
        
        const container = document.getElementById('county-map-container');
        container.innerHTML = "Loading...";
        
        if(this.data.masterMapCache) { this.renderCounties(s, container); }
        else {
            fetch('counties/uscountymap.svg').then(r=>r.text()).then(d=>{ this.data.masterMapCache=d; this.renderCounties(s, container); });
        }
    },
    closeCountyView: function() {
        this.data.viewMode = 'national';
        this.data.activeCountyState = null;
        this.data.selectedCounty = null;
        
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-svg').classList.remove('hidden');
        
        // Restore Sidebar Buttons
        document.getElementById('btn-entercountymap').classList.remove('hidden');
        document.getElementById('btn-returnmap').classList.add('hidden');
        
        this.clickState(this.data.selectedState);
        this.colorMap();
    },
    renderCounties: function(state, container) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(this.data.masterMapCache, "image/svg+xml");
        let safeName = state.name.replace(/ /g, "_");
        let group = doc.getElementById(state.name) || doc.getElementById(safeName);
        let validPaths = [];
        
        if(group) { validPaths = Array.from(group.querySelectorAll('path, polygon')); }
        else {
            let fips = state.fips; 
            doc.querySelectorAll('path, polygon').forEach(p => { if(p.id && p.id.startsWith("c" + fips)) validPaths.push(p); });
        }

        let newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvg.setAttribute("viewBox", "0 0 990 627");
        validPaths.forEach(p => {
            let clone = p.cloneNode(true);
            let c = state.counties.find(ct => ct.id === p.id);
            if(c) {
                clone.style.fill = this.getMarginColor(c.pcts.D - c.pcts.R);
                clone.onclick = (e) => { e.stopPropagation(); this.data.selectedCounty=c; this.updateSidebar(c, 'county'); };
                clone.onmousemove = (e) => this.showTooltip(e, c, true);
                clone.onmouseleave = () => document.getElementById('map-tooltip').style.display='none';
            }
            newSvg.appendChild(clone);
        });
        container.innerHTML = ""; container.appendChild(newSvg);
        // Zoom
        setTimeout(() => {
            try {
                let bbox = newSvg.getBBox();
                if(bbox.width > 0) newSvg.setAttribute("viewBox", `${bbox.x-10} ${bbox.y-10} ${bbox.width+20} ${bbox.height+20}`);
            } catch(e) {}
        }, 50);
    },

    /* --- HELPERS --- */
    updateSidebar: function(obj, type) {
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('empty-msg').classList.add('hidden');
        let m = obj.pcts.D - obj.pcts.R;
        let col = m > 0 ? "blue" : "red";
        document.getElementById('sp-name').innerHTML = `${obj.name} <span class="${col}" style="font-size:0.8em">${m>0?"D":"R"}+${Math.abs(m).toFixed(1)}</span>`;
        document.getElementById('sp-ev').innerText = type==='state' ? obj.ev+" EV" : (obj.population/1000).toFixed(1)+"k Pop";
        document.getElementById('poll-dem-val').innerText = obj.pcts.D.toFixed(1)+"%";
        document.getElementById('poll-rep-val').innerText = obj.pcts.R.toFixed(1)+"%";
        document.querySelector('.poll-bar-wrap').innerHTML = `<div style="width:${obj.pcts.D}%; background:#00AEF3"></div><div style="width:${obj.pcts.R}%; background:#E81B23"></div>`;
        document.getElementById('action-menu-title').innerText = type==='state'?"STATE STRATEGY":"COUNTY ACTIONS";
    },
    
    getMarginColor: function(margin) {
        let abs = Math.abs(margin);
        if (abs < 0.5) return "#d1d1d1";
        if (margin > 0) {
            if(abs>25) return "#004080"; if(abs>15) return "#005a9c"; if(abs>5) return "#4da6ff"; return "#99ccff";
        } else {
            if(abs>25) return "#8b0000"; if(abs>15) return "#cc0000"; if(abs>5) return "#ff4d4d"; return "#ff9999";
        }
    },
    
    showTooltip: function(e, obj, isCounty=false) {
        let tt = document.getElementById('map-tooltip');
        let m = obj.pcts.D - obj.pcts.R;
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        let leader = m > 0 ? (this.data.selectedParty==='D'?this.data.candidate.lastName:this.data.opponent.lastName) : (this.data.selectedParty==='R'?this.data.candidate.lastName:this.data.opponent.lastName);
        if(!leader) leader = m > 0 ? "Democrat" : "Republican";
        
        let tp = (this.data.thirdPartiesEnabled && (obj.pcts.G > 1 || obj.pcts.L > 1)) ? `<div style="font-size:0.7em; color:#aaa; margin-top:5px; border-top:1px solid #444; padding-top:2px;">G: ${obj.pcts.G.toFixed(1)}% | L: ${obj.pcts.L.toFixed(1)}%</div>` : "";

        tt.innerHTML = `<span class="tooltip-title">${obj.name}</span><div class="tooltip-divider"></div><span class="tooltip-leader" style="color:${col}">${leader} +${Math.abs(m).toFixed(1)}</span>${tp}`;
        tt.style.display='block'; tt.style.left=(e.clientX+15)+'px'; tt.style.top=(e.clientY+15)+'px';
    },
    
    updateHUD: function() {
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        document.getElementById('hud-energy').innerHTML = Array(this.data.maxEnergy).fill(0).map((_,i) => `<div class="energy-pip ${i < this.data.energy ? 'active' : ''}"></div>`).join('');
        document.getElementById('hud-date').innerText = this.data.currentDate.toLocaleDateString();
    },
    updateScore: function() {
        let d=0, r=0; for(let k in this.data.states) { if(this.data.states[k].pcts.D > this.data.states[k].pcts.R) d+=this.data.states[k].ev; else r+=this.data.states[k].ev; }
        document.getElementById('score-dem').innerText = d; document.getElementById('score-rep').innerText = r;
        let dp = (d/538)*100, rp = (r/538)*100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #00AEF3 ${dp}%, #333 ${dp}%, #333 ${100-rp}%, #E81B23 ${100-rp}%)`;
    },
    showToast: function(msg) { const t=document.getElementById('toast'); t.innerText=msg; t.style.opacity=1; setTimeout(()=>t.style.opacity=0, 2000); },
    
    nextWeek: function() {
        this.data.currentDate.setDate(this.data.currentDate.getDate()+7);
        if(this.data.currentDate >= this.data.electionDay) { alert("Election Over!"); location.reload(); return; }
        this.aiTurn();
        this.data.energy = this.data.maxEnergy; this.data.funds += 2;
        this.updateHUD(); this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("New Week Started");
    },
    aiTurn: function() {
        let targets = Object.values(this.data.states).filter(s => Math.abs(s.pcts.D - s.pcts.R) < 10);
        for(let i=0; i<3 && i<targets.length; i++) {
             targets[i].counties.forEach(c => {
                 if(this.data.selectedParty === 'D') c.pcts.R += 0.4; else c.pcts.D += 0.4;
                 c.normalizePcts();
             });
             this.recalcStatePoll(targets[i]);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
