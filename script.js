/* --- CONFIGURATION --- */
const PARTIES = {
    D: { name: "Democratic", color: "#00AEF3", img: "images/harrison.jpg", desc: "Liberal platform focused on social equality and economic reform." },
    R: { name: "Republican", color: "#E81B23", img: "images/whatley.jpg", desc: "Conservative platform focused on deregulation and traditional values." },
    I: { name: "Independent", color: "#F2C75C", img: "images/scenario.jpg", desc: "Centrist coalition seeking electoral reform." },
    G: { name: "Green", color: "#198754", img: "images/scenario.jpg", desc: "Environmental justice and social democracy." },
    L: { name: "Libertarian", color: "#fd7e14", img: "images/scenario.jpg", desc: "Individual liberty and free markets." }
};

const ISSUES = [
    { id: 'econ', name: 'Economy: Inflation' }, { id: 'jobs', name: 'Economy: Jobs' },
    { id: 'tax', name: 'Tax Policy' }, { id: 'health', name: 'Healthcare' },
    { id: 'immig', name: 'Immigration' }, { id: 'clim', name: 'Climate Change' },
    { id: 'gun', name: 'Gun Control' }, { id: 'abort', name: 'Abortion Rights' },
    { id: 'foreign', name: 'Foreign Policy' }, { id: 'crime', name: 'Crime & Safety' }
];

const INTEREST_GROUPS = [
    { id: 'aa', name: 'African American' }, { id: 'his', name: 'Hispanic/Latino' },
    { id: 'union', name: 'Union Workers' }, { id: 'evang', name: 'Evangelicals' },
    { id: 'youth', name: 'Youth (<30)' }, { id: 'senior', name: 'Seniors (65+)' }
];

const CANDIDATES = [
    // Democrats
    { id: "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", buff: "Incumbent Advantage", desc: "Current Vice President.", stamina: 8 },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", buff: "Fundraising Machine", desc: "Governor of California.", stamina: 9 },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer.jpg", buff: "Rust Belt Appeal", desc: "Governor of Michigan.", stamina: 8 },
    { id: "shapiro", name: "Josh Shapiro", party: "D", funds: 50, img: "images/shapiro.jpg", buff: "Swing State King", desc: "Governor of Pennsylvania.", stamina: 8 },
    // Republicans
    { id: "desantis", name: "Ron DeSantis", party: "R", funds: 65, img: "images/desantis.jpg", buff: "Culture Warrior", desc: "Governor of Florida.", stamina: 9 },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", buff: "Populist Appeal", desc: "Senator from Ohio.", stamina: 8 },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", buff: "Outsider Energy", desc: "Tech Entrepreneur.", stamina: 10 },
    // Third Party
    { id: "yang", name: "Andrew Yang", party: "I", funds: 40, img: "images/yang.jpg", buff: "Tech Innovator", desc: "Forward Party Founder.", stamina: 8 },
    { id: "stein", name: "Jill Stein", party: "G", funds: 10, img: "images/scenario.jpg", buff: "Eco-Activist", desc: "Green Party Nominee.", stamina: 6 },
    { id: "oliver", name: "Chase Oliver", party: "L", funds: 12, img: "images/scenario.jpg", buff: "Liberty First", desc: "Libertarian Nominee.", stamina: 7 }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", desc: "Popular swing state governor.", img: "images/shapiro.jpg" },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", desc: "Astronaut & Senator.", img: "images/scenario.jpg" },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", desc: "Establishment bridge.", img: "images/scenario.jpg" },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", desc: "Strong aggressive campaigner.", img: "images/scenario.jpg" }
];

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
        selectedParty: null, candidate: null, vp: null, 
        opponent: null, opponentVP: null,
        funds: 0, energy: 8, maxEnergy: 8,
        thirdPartiesEnabled: true,
        states: {}, selectedState: null,
        turnSnapshot: null 
    },

    init: function() {
        console.log("App Initializing...");
        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        
        for(let s in this.data.states) {
            this.data.states[s].moe = (Math.random() * 2 + 1.5).toFixed(1);
            this.data.states[s].donorFatigue = 0; 
            
            this.data.states[s].priorities = {};
            ISSUES.forEach(i => this.data.states[s].priorities[i.id] = Math.floor(Math.random()*10)+1);
            
            this.data.states[s].demographics = {};
            INTEREST_GROUPS.forEach(ig => this.data.states[s].demographics[ig.id] = Math.floor(Math.random()*30)+5);
            
            this.data.states[s].greenShare = ['CA','OR','VT'].includes(s) ? 3.5 : 1.0;
            this.data.states[s].libShare = ['NH','MT','NV'].includes(s) ? 4.0 : 1.5;
        }
        
        this.renderParties();
        this.initIssues();
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    /* --- SETUP --- */
    renderParties: function() {
        const c = document.getElementById('party-cards');
        if(!c) return; c.innerHTML = "";
        ['D','R','I'].forEach(k => {
            const p = PARTIES[k];
            c.innerHTML += `<div class="card card-party" onclick="app.selParty('${k}')" style="background-image:url('${p.img}'); border-top:5px solid ${p.color}"><div class="party-overlay"><h3>${p.name} Party</h3><div class="party-desc">${p.desc}</div></div></div>`;
        });
    },
    selParty: function(k) { this.data.selectedParty = k; this.renderCands(k); this.goToScreen('candidate-screen'); },

    renderCands: function(pk) {
        const c = document.getElementById('candidate-cards');
        c.innerHTML = "";
        CANDIDATES.filter(x => x.party === pk).forEach(cand => {
            const img = cand.img ? `<img src="${cand.img}">` : "";
            c.innerHTML += `<div class="card" onclick="app.selCand('${cand.id}')"><div class="portrait">${img}</div><div class="card-info"><h3>${cand.name}</h3><p>${cand.desc}</p><p class="buff-text">Stamina: ${cand.stamina}</p></div></div>`;
        });
    },
    selCand: function(id) {
        this.data.candidate = CANDIDATES.find(x => x.id === id);
        this.data.maxEnergy = this.data.candidate.stamina;
        this.data.energy = this.data.maxEnergy;
        this.renderVPs(this.data.candidate.party);
        this.goToScreen('vp-screen');
    },

    renderVPs: function(pk) {
        const c = document.getElementById('vp-cards');
        c.innerHTML = "";
        const vps = VPS.filter(x => x.party === pk);
        
        if(vps.length === 0) {
            c.innerHTML = `<div class="card" onclick="app.renderOpp()"><div class="card-info"><h3>CONTINUE (NO VP)</h3></div></div>`;
            return;
        }

        vps.forEach(v => {
            const img = v.img ? `<img src="${v.img}">` : "";
            c.innerHTML += `<div class="card" onclick="app.selVP('${v.id}')"><div class="portrait">${img}</div><div class="card-info"><h3>${v.name}</h3><p>${v.state}</p></div></div>`;
        });
    },
    selVP: function(id) { 
        this.data.vp = VPS.find(x => x.id === id); 
        this.renderOpp();
    },

    // Step 1: Select Opponent Candidate
    renderOpp: function() {
        const maj = document.getElementById('opponent-cards-major');
        const min = document.getElementById('opponent-cards-minor');
        if(!maj || !min) return; 
        maj.innerHTML = ""; min.innerHTML = "";
        
        document.getElementById('opp-section-title').innerText = "SELECT OPPONENT CANDIDATE";

        let rivalP = (this.data.selectedParty === 'D') ? 'R' : 'D';
        if(this.data.selectedParty === 'I') rivalP = 'D';

        CANDIDATES.filter(x => x.party === rivalP).forEach(opp => {
            const img = opp.img ? `<img src="${opp.img}">` : "";
            maj.innerHTML += `<div class="card" onclick="app.selOpp('${opp.id}')"><div class="portrait">${img}</div><div class="card-info"><h3>${opp.name}</h3><p>${opp.desc}</p></div></div>`;
        });

        CANDIDATES.filter(x => ['G','L'].includes(x.party)).forEach(opp => {
            min.innerHTML += `<div class="card" style="transform:scale(0.9); border-top:3px solid ${PARTIES[opp.party].color}"><div class="card-info"><h3>${opp.name}</h3><p>${PARTIES[opp.party].name}</p></div></div>`;
        });
        
        this.goToScreen('opponent-screen');
    },
    selOpp: function(id) {
        this.data.opponent = CANDIDATES.find(x => x.id === id);
        this.renderOppVPs();
    },

    // Step 2: Select Opponent VP
    renderOppVPs: function() {
        const maj = document.getElementById('opponent-cards-major');
        maj.innerHTML = "";
        document.getElementById('opp-section-title').innerText = "SELECT OPPONENT'S RUNNING MATE";

        const vps = VPS.filter(x => x.party === this.data.opponent.party);
        
        if(vps.length === 0) {
            this.startGame();
            return;
        }

        vps.forEach(v => {
            const img = v.img ? `<img src="${v.img}">` : "";
            maj.innerHTML += `<div class="card" onclick="app.selOppVP('${v.id}')"><div class="portrait">${img}</div><div class="card-info"><h3>${v.name}</h3><p>${v.state}</p></div></div>`;
        });
    },
    selOppVP: function(id) {
        this.data.opponentVP = VPS.find(x => x.id === id);
        this.startGame();
    },

    toggleThirdParties: function() {
        this.data.thirdPartiesEnabled = document.getElementById('third-party-toggle').checked;
        document.getElementById('third-party-section').style.opacity = this.data.thirdPartiesEnabled ? "1" : "0.3";
    },

    /* --- GAME START --- */
    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        this.saveSnapshot(); 
        this.goToScreen('game-screen');
        
        const img = document.getElementById('hud-img');
        if(this.data.candidate.img) { img.src = this.data.candidate.img; img.style.display = "block"; }
        const pKey = this.data.selectedParty;
        img.className = `hud-border-${pKey}`;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name.toUpperCase();
        document.getElementById('hud-party-name').innerText = PARTIES[pKey].name.toUpperCase() + " NOMINEE";
        document.getElementById('hud-party-name').className = `cand-party text-${pKey}`;

        if(this.data.thirdPartiesEnabled) {
            for(let s in this.data.states) {
                let spoil = this.data.states[s].greenShare + this.data.states[s].libShare;
                if(this.data.states[s].poll > 50) this.data.states[s].poll -= (spoil * 0.6);
                else this.data.states[s].poll += (spoil * 0.6);
            }
        }

        this.initMap();
        this.updateHUD();
    },

    /* --- GAMEPLAY --- */
    initIssues: function() {
        const s = document.getElementById('issue-select');
        const r = document.getElementById('rally-issue-select');
        if(s) ISSUES.forEach(i => s.innerHTML += `<option value="${i.id}">${i.name}</option>`);
        if(r) ISSUES.forEach(i => r.innerHTML += `<option value="${i.id}">${i.name}</option>`);
    },

    fundraise: function() {
        if(this.data.energy < 1) return this.showToast("Need 1 Energy!");
        this.data.energy--;
        
        const s = this.data.states[this.data.selectedState];
        let base = 0.5; 
        let support = (this.data.selectedParty==='D' ? s.poll : (100-s.poll)) / 50;
        let fatigue = Math.pow(0.5, s.donorFatigue);
        
        let amt = base * (s.ev/5) * support * fatigue;
        if(amt < 0.1) amt = 0.1;
        
        this.data.funds += amt;
        s.donorFatigue++;
        
        this.updateHUD();
        this.showToast(`Raised $${amt.toFixed(1)}M in ${s.name}`);
    },

    setupRally: function() { document.getElementById('rally-options').classList.remove('hidden'); },
    
    executeRally: function() {
        if(this.data.energy < 2) return this.showToast("Need 2 Energy!");
        if(this.data.funds < 0.1) return this.showToast("Need $100k!");
        
        this.data.energy -= 2;
        this.data.funds -= 0.1;
        
        const s = this.data.states[this.data.selectedState];
        const iID = document.getElementById('rally-issue-select').value;
        const imp = s.priorities[iID] || 5;
        
        let boost = (imp/3) * (Math.random()*0.5 + 0.8);
        if(this.data.selectedParty==='D') s.poll += boost; else s.poll -= boost;
        if(s.poll>100) s.poll=100; if(s.poll<0) s.poll=0;
        
        document.getElementById('rally-options').classList.add('hidden');
        this.updateHUD();
        this.colorMap();
        this.clickState(this.data.selectedState);
        this.showToast("Rally Complete!");
    },

    runStateAd: function() {
        if(this.data.funds < 0.5) return this.showToast("Need $500k!");
        this.data.funds -= 0.5;
        const s = this.data.states[this.data.selectedState];
        const boost = 1.5;
        if(this.data.selectedParty==='D') s.poll += boost; else s.poll -= boost;
        this.updateHUD(); this.colorMap(); this.clickState(this.data.selectedState);
    },

    openStateBio: function() {
        const s = this.data.states[this.data.selectedState];
        const modal = document.getElementById('bio-modal');
        const content = document.getElementById('bio-content');
        
        let demoHTML = `<div class="ig-grid">`;
        for(let k in s.demographics) {
            let n = INTEREST_GROUPS.find(x=>x.id===k).name;
            demoHTML += `<div class="ig-tag"><span>${n}</span><span class="ig-val">${s.demographics[k]}%</span></div>`;
        }
        demoHTML += `</div>`;
        
        content.innerHTML = `
            <div class="bio-header" style="background:#333;">
                <div class="bio-title"><h2>${s.name}</h2></div>
            </div>
            <div class="bio-lore">"Key battleground with ${s.ev} Electoral Votes."</div>
            <h3>DEMOGRAPHICS</h3>${demoHTML}
            <h3 style="margin-top:20px;">POLLING</h3>
            <p><span class="blue">${s.poll.toFixed(1)}% D</span> vs <span class="red">${(100-s.poll).toFixed(1)}% R</span></p>
        `;
        modal.classList.remove('hidden');
    },

    /* --- TURN & AI --- */
    nextWeek: function() {
        if(this.data.currentDate >= this.data.electionDay) return alert("Election Day Reached! Tallying votes...");
        
        this.data.currentDate.setDate(this.data.currentDate.getDate()+7);
        
        let roll = this.data.energy;
        this.data.energy = Math.min(this.data.maxEnergy + roll, Math.floor(this.data.maxEnergy*1.5));
        
        for(let s in this.data.states) { if(this.data.states[s].donorFatigue > 0) this.data.states[s].donorFatigue--; }
        
        this.opponentTurn();
        this.saveSnapshot();
        
        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("Week Advanced.");
    },

    opponentTurn: function() {
        const playerIsDem = this.data.selectedParty === 'D';
        for(let code in this.data.states) {
            let s = this.data.states[code];
            s.poll += (Math.random()*0.6 - 0.3);
            let isSwing = (s.poll >= 45 && s.poll <= 55);
            let attackChance = isSwing ? 0.5 : 0.1;
            
            if(Math.random() < attackChance) {
                let shift = Math.random()*1.2 + 0.2;
                if(playerIsDem) s.poll -= shift; else s.poll += shift;
            }
            if(s.poll>100)s.poll=100; if(s.poll<0)s.poll=0;
        }
    },

    saveSnapshot: function() { this.data.turnSnapshot = JSON.stringify(this.data); },
    undoLastAction: function() {
        if(!this.data.turnSnapshot) return;
        if(confirm("Reset Turn?")) {
            const snap = JSON.parse(this.data.turnSnapshot);
            this.data.funds = snap.funds;
            this.data.energy = snap.energy;
            this.data.states = snap.states;
            this.updateHUD(); this.colorMap();
            if(this.data.selectedState) this.clickState(this.data.selectedState);
        }
    },

    /* --- MAP UTILS --- */
    initMap: function() {
        for(let code in this.data.states) {
            let p = document.getElementById(code);
            if(p) {
                p.onclick = () => this.clickState(code);
                p.onmousemove = (e) => this.showTooltip(e, code);
                p.onmouseleave = () => document.getElementById('map-tooltip').style.display='none';
            }
        }
        this.colorMap();
    },
    
    // Gradient Logic: White -> Color
    getMarginColor: function(poll) {
        let margin = poll - 50; 
        if(Math.abs(margin) < 0.5) return "#FFFFFF"; // Tie = White
        
        let intensity = Math.min(Math.abs(margin) / 15, 1); // 15% margin = full color
        
        if(margin > 0) { // Dem (Blue)
            let r = Math.round(255 - (255 * intensity));
            let g = Math.round(255 - (81 * intensity)); // 255 -> 174
            let b = Math.round(255 - (12 * intensity)); // 255 -> 243
            return `rgb(${0 + (1-intensity)*255}, ${174 + (1-intensity)*81}, ${243 + (1-intensity)*12})`; // Interpolate White to Blue #00AEF3
        } else { // Rep (Red)
            return `rgb(${232 + (1-intensity)*23}, ${27 + (1-intensity)*228}, ${35 + (1-intensity)*220})`; // Interpolate White to Red #E81B23
        }
    },

    colorMap: function() {
        for(let code in this.data.states) {
            let s = this.data.states[code];
            let p = document.getElementById(code);
            if(p) {
                p.style.fill = this.getMarginColor(s.poll);
                p.style.stroke = "white"; 
                p.style.strokeWidth = "0.5";
            }
        }
        this.updateScore();
    },

    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('empty-msg').classList.add('hidden');
        
        // Margin Text
        let margin = s.poll - 50;
        let mText = Math.abs(margin) < 0.1 ? "EVEN" : (margin > 0 ? `D+${margin.toFixed(1)}` : `R+${Math.abs(margin).toFixed(1)}`);
        let mColor = margin > 0 ? "#00AEF3" : "#E81B23";
        if(Math.abs(margin) < 0.1) mColor = "gray";

        document.getElementById('sp-name').innerHTML = `${s.name} <span style="font-size:0.8em; color:${mColor}; margin-left:8px;">${mText}</span>`;
        document.getElementById('sp-ev').innerText = s.ev + " EV";
        
        document.getElementById('poll-dem-bar').style.width = s.poll + "%";
        document.getElementById('poll-rep-bar').style.width = (100-s.poll) + "%";
        document.getElementById('poll-dem-val').innerText = s.poll.toFixed(1) + "%";
        document.getElementById('poll-rep-val').innerText = (100-s.poll).toFixed(1) + "%";
        
        const l = document.getElementById('sp-issues-list');
        l.innerHTML="";
        ISSUES.sort((a,b)=>s.priorities[b.id]-s.priorities[a.id]).slice(0,3).forEach(x=>{
            l.innerHTML+=`<div style="display:flex; justify-content:space-between; padding:2px; border-bottom:1px solid #333"><span>${x.name}</span><span style="color:gold">${s.priorities[x.id]}</span></div>`;
        });
    },

    updateHUD: function() {
        const opt = { month: 'short', day: 'numeric' };
        document.getElementById('hud-date').innerText = this.data.currentDate.toLocaleDateString('en-US', opt);
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        const ec = document.getElementById('hud-energy');
        ec.innerHTML="";
        for(let i=0; i<this.data.maxEnergy; i++) {
            ec.innerHTML += `<div class="energy-pip ${i<this.data.energy?'active':''}"></div>`;
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
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #00AEF3 ${dp}%, #333 ${dp}%, #333 ${100-rp}%, #E81B23 ${100-rp}%)`;
    },

    showTooltip: function(e, code) {
        const tt = document.getElementById('map-tooltip');
        const s = this.data.states[code];
        
        let margin = s.poll - 50;
        let leadName = "Tie";
        let color = "#fff";
        let marginVal = Math.abs(margin).toFixed(1);

        if(margin > 0) {
            color = "#00AEF3";
            leadName = (this.data.selectedParty === 'D') ? this.data.candidate.name.split(" ").pop() : this.data.opponent.name.split(" ").pop();
        } else if (margin < 0) {
            color = "#E81B23";
            leadName = (this.data.selectedParty === 'R') ? this.data.candidate.name.split(" ").pop() : this.data.opponent.name.split(" ").pop();
        }

        tt.innerHTML = `
            <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; color:#ccc;">${s.name}</div>
            <span class="tooltip-leader" style="color:${color}; font-size:1.4rem;">${leadName} +${marginVal}</span>
        `;
        tt.style.display='block'; tt.style.left=(e.clientX+15)+'px'; tt.style.top=(e.clientY+15)+'px';
    },

    log: function(msg) {
        const feed = document.getElementById('log-content');
        if(feed) { const div = document.createElement('div'); div.className = "log-entry"; div.innerText = `> ${msg}`; feed.prepend(div); }
    },
    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.style.opacity = 1; setTimeout(() => t.style.opacity = 0, 2000);
    },
    toggleThirdParties: function() {
        this.data.thirdPartiesEnabled = document.getElementById('third-party-toggle').checked;
        document.getElementById('third-party-section').style.opacity = this.data.thirdPartiesEnabled ? "1" : "0.3";
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
