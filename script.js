/* ============================================
   DECISION 2028 - CAMPAIGN SIMULATOR
   Complete Rewrite with Election Night
   ============================================ */

/* --- CONFIGURATION --- */
const PARTIES = {
    D: { name: "Democratic Party", shortName: "Democrat", color: "#00AEF3", lightColor: "#99d6f7" },
    R: { name: "Republican Party", shortName: "Republican", color: "#E81B23", lightColor:  "#f7999f" },
    F: { name: "Forward Party", shortName: "Forward", color: "#F2C75C", lightColor:  "#f9e4a8" },
    G: { name: "Green Party", shortName: "Green", color: "#198754", lightColor: "#7bc9a4" },
    L: { name: "Libertarian Party", shortName: "Libertarian", color:  "#fd7e14", lightColor: "#fec89a" }
};

const ISSUES = [ 
    { id: 'econ', name: 'Economy' }, { id: 'jobs', name: 'Jobs' }, 
    { id:  'tax', name: 'Tax Policy' }, { id:  'health', name: 'Healthcare' }, 
    { id: 'immig', name: 'Immigration' }, { id: 'clim', name: 'Climate' }, 
    { id: 'gun', name: 'Gun Control' }, { id:  'abort', name: 'Abortion' }, 
    { id: 'foreign', name: 'Foreign Pol.' }, { id: 'crime', name: 'Crime' } 
];

const CANDIDATES = [
    // Democrats
    { id:  "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", stamina: 8, ai_skill: 8, lastName: "Harris", desc: "The incumbent Vice President running on the administration's record.", buff: "Incumbency" },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", stamina: 9, ai_skill:  9, lastName: "Newsom", desc:  "California Governor known for aggressive campaigning and fundraising.", buff: "War Chest" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer. jpg", stamina:  8, ai_skill:  9, lastName: "Whitmer", desc:  "Popular Michigan Governor with strong Rust Belt appeal.", buff: "Midwest Appeal" },
    { id: "buttigieg", name:  "Pete Buttigieg", party: "D", funds: 50, img: "images/buttigieg. jpg", stamina:  8, ai_skill:  8, lastName:  "Buttigieg", desc: "Transportation Secretary and skilled debater.", buff: "Media Savvy" },
    { id: "aoc", name: "Alexandria Ocasio-Cortez", party:  "D", funds:  45, img: "images/aoc.jpg", stamina: 10, ai_skill:  7, lastName: "Ocasio-Cortez", desc: "Progressive firebrand from New York.", buff: "Youth Vote" },
    
    // Republicans  
    { id:  "desantis", name:  "Ron DeSantis", party: "R", funds: 65, img: "images/desantis. jpg", stamina:  9, ai_skill: 9, lastName: "DeSantis", desc: "Florida Governor running on an 'anti-woke' platform.", buff: "Base Turnout" },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", stamina: 8, ai_skill: 7, lastName: "Vance", desc:  "Ohio Senator and populist voice for the working class.", buff: "Populism" },
    { id: "ramaswamy", name:  "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", stamina: 10, ai_skill:  6, lastName: "Ramaswamy", desc: "Biotech entrepreneur focused on dismantling bureaucracy.", buff: "Outsider Energy" },
    { id: "haley", name: "Nikki Haley", party: "R", funds: 55, img: "images/haley.jpg", stamina: 8, ai_skill:  8, lastName:  "Haley", desc: "Former UN Ambassador and South Carolina Governor.", buff: "Suburban Appeal" },
    
    // Forward Party
    { id:  "yang", name: "Andrew Yang", party: "F", funds: 35, img: "images/yang.jpg", stamina: 8, ai_skill:  5, lastName: "Yang", desc: "Forward Party founder promoting Universal Basic Income.", buff: "UBI Movement", debuff: "Third Party Penalty" },
    
    // Green Party
    { id: "stein", name: "Jill Stein", party: "G", funds: 8, img: "images/scenario.jpg", stamina: 6, ai_skill: 3, lastName: "Stein", desc:  "Perennial Green Party candidate focused on ecology.", buff: "Environmental Base", debuff: "Severe Third Party Penalty" },
    
    // Libertarian Party
    { id: "oliver", name: "Chase Oliver", party: "L", funds: 10, img: "images/scenario.jpg", stamina: 7, ai_skill: 3, lastName: "Oliver", desc: "Libertarian activist fighting for individual rights.", buff: "Liberty Movement", debuff: "Severe Third Party Penalty" }
];

const VPS = [
    // Democrat VPs
    { id:  "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg", ai_skill: 5, desc: "Governor of Pennsylvania." },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/kelly.jpg", ai_skill:  4, desc: "Senator from Arizona." },
    { id: "warnock", name: "Raphael Warnock", party: "D", state: "GA", img: "images/scenario.jpg", ai_skill: 4, desc: "Senator from Georgia." },
    { id: "pritzker", name:  "JB Pritzker", party: "D", state: "IL", img: "images/scenario.jpg", ai_skill: 4, desc: "Governor of Illinois." },
    
    // Republican VPs
    { id:  "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/scenario.jpg", ai_skill: 4, desc: "Senator from Florida." },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", img: "images/scenario.jpg", ai_skill: 3, desc: "Congresswoman from New York." },
    { id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", img: "images/scenario.jpg", ai_skill: 4, desc: "Senator from South Carolina." },
    { id: "noem", name: "Kristi Noem", party: "R", state: "SD", img: "images/scenario.jpg", ai_skill: 3, desc: "Governor of South Dakota." },
    
    // Forward Party VPs
    { id: "whitman", name: "Christine Todd Whitman", party: "F", state: "NJ", img: "images/scenario.jpg", ai_skill: 3, desc: "Former NJ Governor, moderate Republican." },
    { id: "yang_vp", name: "Tulsi Gabbard", party: "F", state: "HI", img: "images/scenario.jpg", ai_skill:  4, desc: "Former Congresswoman, Independent." },
    
    // Green Party VPs
    { id: "ware", name: "Butch Ware", party: "G", state: "CA", img: "images/scenario.jpg", ai_skill: 2, desc: "Academic and activist." },
    
    // Libertarian Party VPs
    { id: "cohen", name: "Mike ter Maat", party: "L", state: "FL", img: "images/scenario.jpg", ai_skill: 2, desc: "Libertarian economist." }
];

// Real poll closing times (EST) - format: [hour, minute]
// For split states, we handle separately
const POLL_CLOSE_TIMES = {
    "IN": [18, 0], "KY": [18, 0],  // 6 PM (parts)
    "GA": [19, 0], "SC": [19, 0], "VT": [19, 0], "VA": [19, 0],  // 7 PM
    "FL": [19, 0], // 7 PM (but panhandle at 8 PM - handled specially)
    "NH": [19, 0], "NC": [19, 30], "OH": [19, 30], "WV": [19, 30],
    "AL": [20, 0], "CT": [20, 0], "DE": [20, 0], "DC": [20, 0], 
    "IL": [20, 0], "ME": [20, 0], "MD":  [20, 0], "MA": [20, 0],
    "MI":  [20, 0], "MS": [20, 0], "MO": [20, 0], "NJ": [20, 0],
    "OK": [20, 0], "PA": [20, 0], "RI": [20, 0], "TN": [20, 0],
    "TX":  [20, 0], // Central parts at 8 EST
    "AR": [20, 30], "AZ": [21, 0], "CO": [21, 0], "KS": [21, 0],
    "LA": [21, 0], "MN": [21, 0], "NE": [21, 0], "NM": [21, 0],
    "NY": [21, 0], "ND": [21, 0], "SD":  [21, 0], "WI": [21, 0],
    "WY": [21, 0], "IA": [22, 0], "MT": [22, 0], "NV": [22, 0],
    "UT": [22, 0], "CA": [23, 0], "HI": [24, 0], "ID": [23, 0],
    "OR": [23, 0], "WA": [23, 0], "AK": [25, 0]
};

// Florida panhandle counties (Central Time - close 1 hour later)
const FLORIDA_PANHANDLE_FIPS = [
    "12005", "12013", "12029", "12033", "12037", "12039", "12045", 
    "12059", "12063", "12065", "12073", "12077", "12079", "12091", 
    "12113", "12123", "12129", "12131", "12133"
];

const INIT_STATES = {
    "AL":  {name:"Alabama",ev: 9,fips:"01"}, "AK":{name:"Alaska",ev:3,fips:"02"}, "AZ":{name:"Arizona",ev:11,fips:"04"},
    "AR":  {name:"Arkansas",ev:6,fips:"05"}, "CA":{name:"California",ev:54,fips:"06"}, "CO":{name:"Colorado",ev:10,fips:"08"},
    "CT": {name:"Connecticut",ev:7,fips:"09"}, "DE":{name:"Delaware",ev:3,fips:"10"}, "DC":{name:"District of Columbia",ev: 3,fips:"11"},
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
    "RI": {name:"Rhode Island",ev: 4,fips:"44"}, "SC":{name:"South Carolina",ev:9,fips:"45"}, "SD":{name:"South Dakota",ev:3,fips:"46"},
    "TN": {name:"Tennessee",ev:11,fips:"47"}, "TX":{name:"Texas",ev:40,fips:"48"}, "UT":{name:"Utah",ev:6,fips:"49"},
    "VT": {name:"Vermont",ev:3,fips:"50"}, "VA":{name:"Virginia",ev:13,fips:"51"}, "WA":{name:"Washington",ev:12,fips:"53"},
    "WV": {name:"West Virginia",ev: 4,fips:"54"}, "WI":{name:"Wisconsin",ev:10,fips:"55"}, "WY":{name:"Wyoming",ev:3,fips:"56"}
};

/* --- COUNTY CLASS --- */
class County {
    constructor(id, name, stateCode, realData = null) {
        this.id = id;
        this. name = name || id;
        this. stateCode = stateCode;
        this.fips = id. replace('c', '');
        
        this.turnout = 0.60;
        this.baseEnthusiasm = { D: 1.0, R:  1.0, F: 1.0, G: 1.0, L: 1.0 };
        
        if (realData) {
            this.type = realData.t || "Rural";
            this. population = realData.p || 10000;
            let v = realData.v || {};
            this.pcts = {
                D: v.D !== undefined ? v.D : 45,
                R:  v.R !== undefined ? v.R :  45,
                F: v.F !== undefined ? v. F : 2,
                G:  v.G !== undefined ? v.G :  1,
                L:  v.L !== undefined ? v.L :  1
            };
        } else {
            this.type = "Rural";
            this.population = 10000;
            this.pcts = { D: 45, R: 45, F: 3, G: 1, L: 1 };
        }
        
        // Election night tracking
        this.reportedPct = 0;
        this.reportedVotes = { D: 0, R: 0, F: 0, G: 0, L: 0 };
        this. finalVotes = null;
    }

    normalizePcts(thirdPartiesEnabled = true) {
        if (! thirdPartiesEnabled) {
            let total = this.pcts.D + this.pcts.R;
            if (total <= 0) total = 1;
            this.displayPcts = {
                D: (this.pcts. D / total) * 100,
                R: (this. pcts.R / total) * 100,
                F:  0, G: 0, L: 0
            };
        } else {
            let total = this.pcts.D + this. pcts.R + this.pcts. F + this.pcts.G + this.pcts.L;
            if (total <= 0) total = 1;
            this.displayPcts = {
                D: (this.pcts.D / total) * 100,
                R: (this.pcts.R / total) * 100,
                F: (this.pcts. F / total) * 100,
                G: (this. pcts.G / total) * 100,
                L:  (this.pcts.L / total) * 100
            };
        }
    }

    getRawVotes(thirdPartiesEnabled = true) {
        let activeVoters = this.population * this.turnout;
        let votes = {
            D: activeVoters * (this.pcts. D / 100) * this.baseEnthusiasm.D,
            R: activeVoters * (this.pcts. R / 100) * this.baseEnthusiasm.R,
            F:  thirdPartiesEnabled ?  activeVoters * (this.pcts.F / 100) * this.baseEnthusiasm. F : 0,
            G: thirdPartiesEnabled ?  activeVoters * (this.pcts.G / 100) * this.baseEnthusiasm. G : 0,
            L: thirdPartiesEnabled ?  activeVoters * (this.pcts.L / 100) * this.baseEnthusiasm. L : 0
        };
        return votes;
    }
    
    // Calculate how long this county takes to fully report (in simulation minutes)
    getReportingDuration() {
        // Bigger counties take longer:  30 min for small, up to 180 min for large
        if (this.population < 50000) return 30 + Math.random() * 30;
        if (this.population < 200000) return 60 + Math.random() * 60;
        if (this.population < 500000) return 90 + Math.random() * 60;
        return 120 + Math. random() * 60;
    }
}

/* --- MAIN APP --- */
const app = {
    data: {
        currentDate: new Date("2028-07-04"),
        electionDay: new Date("2028-11-07"),
        selectedParty: null,
        candidate: null,
        vp: null,
        opponents: [], // Can have multiple opponents
        funds: 0,
        energy: 8,
        maxEnergy: 8,
        thirdPartiesEnabled:  true,
        states: {},
        selectedState: null,
        activeCountyState: null,
        selectedCounty: null,
        viewMode: 'national',
        historyStack: [],
        logs: [],
        stateMapCache: null,
        countyMapCache: null,
        realCountyData: null
    },

    init:  async function() {
        console.log("🗳️ Decision 2028 Initializing...");
        
        // Load county data
        try {
            const res = await fetch('counties/county_data.json');
            if (res.ok) this.data.realCountyData = await res.json();
        } catch(e) { 
            console.warn("County data not found, using procedural generation. "); 
        }

        // Initialize states
        this.data.states = JSON.parse(JSON. stringify(INIT_STATES));
        
        for (let sCode in this.data. states) {
            let s = this.data. states[sCode];
            s.code = sCode;
            s.moe = (Math.random() * 2 + 1.5).toFixed(1);
            s.priorities = {};
            ISSUES.forEach(i => s.priorities[i. id] = Math.floor(Math.random() * 10) + 1);
            s.counties = this.generateCountiesForState(s, sCode);
            s.pollsClosed = false;
            s. called = false;
            s.calledFor = null;
            s. pcts = { D: 50, R: 50, F: 0, G: 0, L: 0 };
            this.recalcStatePoll(s);
        }
        
        console.log("✅ Decision 2028 Ready");
    },

    generateCountiesForState: function(state, stateCode) {
        let counties = [];
        if (this.data.realCountyData) {
            for (let fips in this.data.realCountyData) {
                if (fips. startsWith(state.fips)) {
                    let cData = this.data. realCountyData[fips];
                    counties.push(new County("c" + fips, cData.n, stateCode, cData));
                }
            }
        }
        if (counties.length === 0) {
            let num = Math.max(5, Math.floor(state.ev * 1.5));
            for (let i = 0; i < num; i++) {
                counties.push(new County(`c_${state.fips}_${i}`, `County ${i + 1}`, stateCode));
            }
        }
        return counties;
    },

    recalcStatePoll: function(state) {
        let t = { D: 0, R: 0, F: 0, G: 0, L: 0 };
        let totalVotes = 0;
        
        state.counties.forEach(c => {
            c.normalizePcts(this.data. thirdPartiesEnabled);
            let v = c.getRawVotes(this. data.thirdPartiesEnabled);
            t.D += v.D; t.R += v.R; t. F += v.F; t.G += v.G; t.L += v. L;
            totalVotes += (v.D + v.R + v. F + v.G + v.L);
        });
        
        if (totalVotes > 0) {
            state.pcts = {
                D: (t.D / totalVotes) * 100,
                R: (t.R / totalVotes) * 100,
                F: (t.F / totalVotes) * 100,
                G:  (t.G / totalVotes) * 100,
                L: (t. L / totalVotes) * 100
            };
        }
    },

    /* --- UNDO SYSTEM --- */
    saveState: function() {
        const snapshot = {
            funds: this.data. funds,
            energy: this.data. energy,
            date: this.data. currentDate.getTime(),
            states: {}
        };
        
        for (let sCode in this.data.states) {
            let s = this.data.states[sCode];
            snapshot.states[sCode] = {
                pcts: { ... s.pcts },
                counties: s.counties.map(c => ({
                    pcts: { ...c.pcts },
                    turnout: c.turnout,
                    baseEnthusiasm: { ...c.baseEnthusiasm }
                }))
            };
        }
        
        this.data.historyStack.push(snapshot);
        if (this.data. historyStack.length > 10) this.data.historyStack.shift();
    },

    undoLastAction: function() {
        if (this. data.historyStack.length === 0) {
            return this.showToast("Nothing to undo");
        }
        
        const prev = this.data. historyStack.pop();
        this.data.funds = prev.funds;
        this.data.energy = prev. energy;
        this.data.currentDate = new Date(prev.date);
        
        for (let sCode in prev.states) {
            let sPrev = prev.states[sCode];
            let sCurr = this.data.states[sCode];
            sCurr.pcts = { ... sPrev.pcts };
            
            sCurr.counties. forEach((c, i) => {
                if (sPrev.counties[i]) {
                    c.pcts = { ...sPrev.counties[i]. pcts };
                    c.turnout = sPrev.counties[i].turnout;
                    c.baseEnthusiasm = { ... sPrev.counties[i].baseEnthusiasm };
                    c.normalizePcts(this.data.thirdPartiesEnabled);
                }
            });
            this.recalcStatePoll(sCurr);
        }
        
        this.updateHUD();
        this.colorMap();
        if (this.data. selectedState) this.clickState(this.data. selectedState);
        this.showToast("Undo successful");
    },

    /* --- NAVIGATION --- */
    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    /* --- PARTY & CANDIDATE SELECTION --- */
    selParty: function(partyCode) {
        this.data.selectedParty = partyCode;
        this. renderCandidates(partyCode);
        this.goToScreen('candidate-screen');
    },

    renderCandidates:  function(partyCode) {
        const container = document.getElementById('candidate-cards');
        container. innerHTML = "";
        
        CANDIDATES.filter(c => c. party === partyCode).forEach(c => {
            container.innerHTML += `
                <div class="card" onclick="app.selCandidate('${c.id}')">
                    <div class="portrait"><img src="${c. img}" onerror="this. src='images/scenario.jpg'"></div>
                    <div class="card-info">
                        <h3>${c. name}</h3>
                        <p>${c.desc || ''}</p>
                        <p class="buff-text">✦ ${c.buff}</p>
                        ${c.debuff ? `<p class="debuff-text">⚠ ${c.debuff}</p>` : ''}
                    </div>
                </div>`;
        });
    },

    selCandidate: function(id) {
        this.data.candidate = CANDIDATES.find(c => c.id === id);
        this.data.maxEnergy = this. data.candidate.stamina;
        this.data.energy = this.data. maxEnergy;
        this.renderVPs(this.data.candidate.party);
        this.goToScreen('vp-screen');
    },

    renderVPs: function(partyCode) {
        const container = document.getElementById('vp-cards');
        container.innerHTML = "";
        
        const partyVPs = VPS. filter(v => v.party === partyCode);
        
        if (partyVPs.length === 0) {
            container.innerHTML = `<p style="color: #888;">No running mates available for this party.</p>`;
            return;
        }
        
        partyVPs.forEach(v => {
            container. innerHTML += `
                <div class="card" onclick="app. selVP('${v.id}')">
                    <div class="portrait"><img src="${v. img}" onerror="this.src='images/scenario.jpg'"></div>
                    <div class="card-info">
                        <h3>${v.name}</h3>
                        <p>${v.desc || ''}</p>
                        <p style="color: #888; font-size: 0.8rem;">Home State: ${v.state}</p>
                    </div>
                </div>`;
        });
    },

    selVP: function(id) {
        this. data.vp = VPS.find(v => v.id === id);
        this.renderOpponents();
        this.goToScreen('opponent-screen');
    },

    renderOpponents: function() {
        const majorContainer = document.getElementById('opponent-cards-major');
        const minorContainer = document.getElementById('opponent-cards-minor');
        majorContainer.innerHTML = "";
        minorContainer.innerHTML = "";
        
        // Determine rival major party
        let rivalParty = (this.data.selectedParty === 'D') ? 'R' : 'D';
        
        CANDIDATES.filter(c => c.party === rivalParty).forEach(c => {
            majorContainer.innerHTML += `
                <div class="card opponent-card" data-id="${c.id}" onclick="app.toggleOpponent('${c.id}')">
                    <div class="portrait"><img src="${c.img}" onerror="this.src='images/scenario.jpg'"></div>
                    <div class="card-info">
                        <h3>${c.name}</h3>
                        <p>${c.desc || ''}</p>
                    </div>
                    <div class="selected-check hidden">✓</div>
                </div>`;
        });
        
        // Third party candidates (excluding player's party)
        ['F', 'G', 'L']. filter(p => p !== this.data.selectedParty).forEach(party => {
            CANDIDATES.filter(c => c.party === party).forEach(c => {
                minorContainer.innerHTML += `
                    <div class="card opponent-card card-minor-opp" data-id="${c.id}" onclick="app.toggleOpponent('${c.id}')" style="border-top: 3px solid ${PARTIES[party].color}">
                        <div class="card-info">
                            <h3>${c.name}</h3>
                            <p style="color: ${PARTIES[party]. color}">${PARTIES[party].shortName}</p>
                        </div>
                        <div class="selected-check hidden">✓</div>
                    </div>`;
            });
        });
        
        // Auto-select first major party opponent
        setTimeout(() => {
            const firstMajor = majorContainer.querySelector('.opponent-card');
            if (firstMajor) this.toggleOpponent(firstMajor.dataset. id);
        }, 100);
    },

    toggleOpponent: function(id) {
        const card = document.querySelector(`.opponent-card[data-id="${id}"]`);
        if (! card) return;
        
        const check = card.querySelector('. selected-check');
        const candidate = CANDIDATES.find(c => c. id === id);
        
        // For major party, only allow one selection
        if (candidate.party === 'D' || candidate.party === 'R') {
            document.querySelectorAll('#opponent-cards-major .opponent-card').forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.selected-check').classList.add('hidden');
            });
            card.classList.add('selected');
            check.classList.remove('hidden');
            this.data.opponents = this.data.opponents. filter(o => o.party !== 'D' && o.party !== 'R');
            this.data.opponents.push(candidate);
        } else {
            // Third parties can be toggled
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                check.classList.add('hidden');
                this.data.opponents = this.data.opponents.filter(o => o.id !== id);
            } else {
                card.classList.add('selected');
                check.classList.remove('hidden');
                this.data.opponents.push(candidate);
            }
        }
    },

    toggleThirdParties: function() {
        this.data. thirdPartiesEnabled = document.getElementById('third-party-toggle').checked;
        const section = document.getElementById('third-party-section');
        section.style.display = this. data.thirdPartiesEnabled ? 'block' : 'none';
    },

    /* --- START GAME --- */
    startGame: function() {
        if (this.data. opponents.length === 0) {
            return this.showToast("Select at least one opponent");
        }
        
        this.data. funds = this.data.candidate.funds;
        
        // Apply third party debuff
        if (['F', 'G', 'L'].includes(this. data.selectedParty)) {
            this.data.funds = Math.floor(this.data. funds * 0.5);
            this.data.maxEnergy = Math. max(4, this.data.maxEnergy - 2);
            this.data.energy = this.data.maxEnergy;
        }
        
        this.goToScreen('game-screen');
        
        // Recalc all states
        for (let s in this.data. states) {
            let state = this.data. states[s];
            state.counties.forEach(c => c.normalizePcts(this.data. thirdPartiesEnabled));
            this.recalcStatePoll(state);
        }
        
        // Setup HUD
        document.getElementById('hud-img').src = this.data.candidate.img;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty]. name. toUpperCase();
        
        this.initMap();
        this.updateHUD();
    },

    /* --- MAP INITIALIZATION --- */
    initMap: async function() {
        const wrapper = document.getElementById('us-map-wrapper');
        wrapper.innerHTML = '<div class="loading-map">Loading map...</div>';
        
        try {
            const response = await fetch('map. svg');
            const svgText = await response.text();
            
            // Parse and modify the SVG
            const parser = new DOMParser();
            const svgDoc = parser. parseFromString(svgText, 'image/svg+xml');
            const svg = svgDoc. querySelector('svg');
            
            if (svg) {
                svg.id = 'us-map-svg';
                svg. setAttribute('viewBox', '0 0 959 593');
                
                // Add event listeners to all state paths
                svg.querySelectorAll('path').forEach(path => {
                    // Get state code from class (e.g., "al" -> "AL")
                    const stateClass = path.className. baseVal || path.classList[0];
                    const stateCode = stateClass ?  stateClass.toUpperCase() : path.id?. toUpperCase();
                    
                    if (stateCode && this.data.states[stateCode]) {
                        path. id = stateCode;
                        path. style.cursor = 'pointer';
                        path. onclick = () => this.clickState(stateCode);
                        path.ondblclick = () => { this.clickState(stateCode); this.enterStateView(); };
                        path.onmousemove = (e) => this.showTooltip(e, this.data.states[stateCode]);
                        path. onmouseleave = () => document.getElementById('map-tooltip').style.display = 'none';
                    }
                });
                
                wrapper.innerHTML = '';
                wrapper.appendChild(svg);
                this.data.stateMapCache = svgText;
                this.colorMap();
            }
        } catch (e) {
            console.error("Failed to load map:", e);
            wrapper. innerHTML = '<div class="error-map">Failed to load map</div>';
        }
    },

    clickState: function(code) {
        this.data.selectedState = code;
        this.data.selectedCounty = null;
        
        // Highlight selected state
        document.querySelectorAll('#us-map-svg path').forEach(p => p.classList.remove('selected'));
        const statePath = document.getElementById(code);
        if (statePath) statePath.classList.add('selected');
        
        this.updateSidebar(this.data.states[code], 'state');
    },

    colorMap: function() {
        for (let code in this.data. states) {
            let s = this. data.states[code];
            let path = document.getElementById(code);
            if (path) {
                let margin = s.pcts.D - s.pcts. R;
                path.style.fill = this.getMarginColor(margin);
            }
        }
        this.updateScore();
    },

    getMarginColor: function(margin) {
        let abs = Math.abs(margin);
        if (isNaN(abs) || abs < 0.5) return "#d1d1d1";
        
        if (margin > 0) { // Democrat leading
            if (abs > 25) return "#004080";
            if (abs > 15) return "#005a9c";
            if (abs > 5) return "#4da6ff";
            return "#99ccff";
        } else { // Republican leading
            if (abs > 25) return "#8b0000";
            if (abs > 15) return "#cc0000";
            if (abs > 5) return "#ff4d4d";
            return "#ff9999";
        }
    },

    /* --- COUNTY VIEW --- */
    enterStateView: function() {
        const s = this.data. states[this.data.selectedState];
        if (!s) return;
        
        this.data.activeCountyState = s;
        this.data.viewMode = 'state';
        
        document.getElementById('us-map-wrapper').classList.add('hidden');
        document.getElementById('county-view-wrapper').classList.remove('hidden');
        
        let margin = s.pcts.D - s. pcts.R;
        let leadStr = Math.abs(margin) < 0.1 ? "TOSS-UP" : `${margin > 0 ? "D" : "R"}+${Math.abs(margin).toFixed(1)}`;
        document.getElementById('cv-title').innerText = `${s.name. toUpperCase()} (${leadStr})`;
        document.getElementById('cv-stats').innerText = `${s.ev} Electoral Votes`;
        
        this.renderCountyMap(s);
    },

    closeCountyView: function() {
        this.data.viewMode = 'national';
        this.data.activeCountyState = null;
        this.data.selectedCounty = null;
        
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
        
        this.clickState(this.data.selectedState);
        this.colorMap();
    },

    renderCountyMap: async function(state) {
        const container = document.getElementById('county-map-container');
        container. innerHTML = '<div class="loading-map">Loading counties...</div>';
        
        try {
            if (! this.data.countyMapCache) {
                const response = await fetch('counties/uscountymap.svg');
                this.data.countyMapCache = await response.text();
            }
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(this.data.countyMapCache, "image/svg+xml");
            
            // Find state group or individual county paths
            let validPaths = [];
            const safeName = state.name. replace(/ /g, "_");
            let group = doc.getElementById(state.name) || doc.getElementById(safeName);
            
            if (group) {
                validPaths = Array.from(group. querySelectorAll('path, polygon'));
            } else {
                // Try finding by FIPS prefix
                doc.querySelectorAll('path, polygon').forEach(p => {
                    if (p.id && p.id. startsWith("c" + state.fips)) validPaths.push(p);
                });
            }
            
            // If still no paths, generate rectangles for each county
            if (validPaths.length === 0) {
                container.innerHTML = '';
                this.renderProceduralCountyMap(state, container);
                return;
            }
            
            const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            newSvg.id = 'county-svg';
            newSvg.setAttribute("viewBox", "0 0 990 627");
            
            validPaths.forEach((p, idx) => {
                const clone = p.cloneNode(true);
                const county = state.counties. find(c => c.id === p.id || c.id === 'c' + p.id);
                
                if (county) {
                    clone.id = county.id;
                    let margin = county.pcts.D - county. pcts.R;
                    clone. style.fill = this.getMarginColor(margin);
                    clone.style. stroke = "#fff";
                    clone.style.strokeWidth = "0.3px";
                    clone.style.cursor = "pointer";
                    
                    clone.onclick = (e) => {
                        e.stopPropagation();
                        this. data.selectedCounty = county;
                        this. updateSidebar(county, 'county');
                    };
                    clone.onmousemove = (e) => this.showTooltip(e, county, true);
                    clone.onmouseleave = () => document.getElementById('map-tooltip
