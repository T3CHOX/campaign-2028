/* --- CONFIGURATION --- */
const PARTIES = {
    D: { name: "Democratic", color: "#0056b3", desc: "Liberal platform focused on social equity." },
    R: { name: "Republican", color: "#d32f2f", desc: "Conservative platform focused on deregulation." },
    I: { name: "Independent", color: "#d4a017", desc: "Centrist platform focused on reform." }
};

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", desc: "Incumbent VP.", funds: 60, img: "images/harris.jpg", buff: "Incumbent Advantage" },
    { id: "newsom", name: "Gavin Newsom", party: "D", desc: "CA Governor.", funds: 75, img: "images/newsom.jpg", buff: "Fundraising Machine" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", desc: "MI Governor.", funds: 55, img: "images/whitmer.jpg", buff: "Rust Belt Appeal" },
    { id: "desantis", name: "Ron DeSantis", party: "R", desc: "FL Governor.", funds: 65, img: "images/desantis.jpg", buff: "Culture Warrior" },
    { id: "vance", name: "JD Vance", party: "R", desc: "OH Senator.", funds: 50, img: "images/vance.jpg", buff: "Populist Appeal" },
    { id: "yang", name: "Andrew Yang", party: "I", desc: "Forward Party.", funds: 40, img: "images/yang.jpg", buff: "Tech Innovator" }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", desc: "Popular swing state governor." },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", desc: "Astronaut & Senator." },
    { id: "cooper", name: "Roy Cooper", party: "D", state: "NC", desc: "Moderate southern appeal." },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", desc: "Establishment bridge." },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", desc: "Strong aggressive campaigner." }
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

const ISSUES = [
    { id: 'econ', name: 'Economy' }, { id: 'immig', name: 'Border Security' },
    { id: 'abort', name: 'Reproductive Rights' }, { id: 'clim', name: 'Climate Change' }
];

/* --- APP LOGIC --- */
const app = {
    data: { 
        selectedParty: null,
        candidate: null, 
        vp: null,
        funds: 0, 
        weeks: 14, 
        actionsLeft: 3, 
        states: {}, 
        selectedState: null 
    },

    init: function() {
        console.log("App Initializing...");
        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        for(let s in this.data.states) {
            this.data.states[s].moe = (Math.random() * 2 + 2).toFixed(1);
            this.data.states[s].priorities = {};
            ISSUES.forEach(i => this.data.states[s].priorities[i.id] = Math.floor(Math.random()*10)+1);
        }
        
        this.renderParties();
        this.initIssues();
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    /* --- PARTY SELECTION --- */
    renderParties: function() {
        const container = document.getElementById('party-cards');
        if(!container) return;
        container.innerHTML = "";
        
        for(let key in PARTIES) {
            const p = PARTIES[key];
            const el = document.createElement('div');
            el.className = "card";
            el.innerHTML = `
                <div class="card-info" style="border-top: 5px solid ${p.color}; padding-top:20px;">
                    <h3>${p.name} Party</h3>
                    <p>${p.desc}</p>
                </div>
            `;
            el.onclick = () => {
                this.data.selectedParty = key;
                this.renderCandidates(key);
                this.goToScreen('candidate-screen');
            };
            container.appendChild(el);
        }
    },

    /* --- CANDIDATE SELECTION --- */
    renderCandidates: function(partyKey) {
        const container = document.getElementById('candidate-cards');
        container.innerHTML = "";
        
        // Filter by party
        const filtered = CANDIDATES.filter(c => c.party === partyKey);
        
        if(filtered.length === 0) {
            container.innerHTML = "<p>No candidates available for this party in the demo.</p>";
            return;
        }

        filtered.forEach(c => {
            const el = document.createElement('div');
            el.className = 'card';
            // Image handling with fallback
            const imgHTML = c.img ? `<img src="${c.img}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : "";
            el.innerHTML = `
                <div class="portrait">
                    ${imgHTML}
                    <div class="portrait-placeholder" ${imgHTML ? 'style="display:none"' : ''}>${c.name.charAt(0)}</div>
                </div>
                <div class="card-info">
                    <h3>${c.name}</h3>
                    <p>${c.desc}</p>
                    <p class="buff-text">Buff: ${c.buff}</p>
                    <p style="color:#4ade80">Funds: $${c.funds}M</p>
                </div>
            `;
            el.onclick = () => {
                this.data.candidate = c;
                this.renderVPs(c.party);
                this.goToScreen('vp-screen');
            };
            container.appendChild(el);
        });
    },

    /* --- VP SELECTION --- */
    renderVPs: function(partyKey) {
        const container = document.getElementById('vp-cards');
        container.innerHTML = "";
        const filtered = VPS.filter(v => v.party === partyKey);
        
        filtered.forEach(v => {
            const el = document.createElement('div');
            el.className = 'card';
            el.innerHTML = `
                <div class="card-info">
                    <h3>${v.name}</h3>
                    <p>Home: ${v.state}</p>
                    <p>${v.desc}</p>
                </div>
            `;
            el.onclick = () => {
                this.data.vp = v;
                // Apply VP Buff immediately
                if(this.data.states[v.state]) {
                    this.data.states[v.state].poll += 5; // Home state boost
                }
                this.startGame();
            };
            container.appendChild(el);
        });
    },

    initIssues: function() {
        const sel = document.getElementById('issue-select');
        ISSUES.forEach(i => {
            sel.innerHTML += `<option value="${i.id}">${i.name}</option>`;
        });
    },

    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        this.goToScreen('game-screen');
        
        // Setup HUD
        const img = document.getElementById('hud-img');
        if(this.data.candidate.img) {
            img.src = this.data.candidate.img;
            img.style.display = "block";
        }
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name.toUpperCase();
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty].name.toUpperCase() + " NOMINEE";
        
        this.updateHUD();
        this.initMap();
        this.log("Campaign started.");
    },

    /* --- MAP & GAMEPLAY --- */
    initMap: function() {
        const svg = document.getElementById('us-map-svg');
        for(let code in this.data.states) {
            let path = document.getElementById(code);
            if(path) {
                path.onclick = () => this.clickState(code);
                path.onmouseenter = () => path.style.opacity = 0.8;
                path.onmouseleave = () => path.style.opacity = 1;
                path.style.cursor = "pointer";
                path.style.transition = "fill 0.3s";
            }
        }
        this.colorMap();
    },

    colorMap: function() {
        for(let code in this.data.states) {
            const s = this.data.states[code];
            const p = document.getElementById(code);
            if(!p) continue;

            let fill;
            if(s.poll > 55) fill = "#0056b3";      // Safe Dem
            else if(s.poll > 50) fill = "#4fa1ff"; // Lean Dem
            else if(s.poll > 45) fill = "#ff6b6b"; // Lean Rep
            else fill = "#d32f2f";                 // Safe Rep
            
            // Tossup Gray (48-52)
            if(s.poll >= 48 && s.poll <= 52) fill = "#64748b"; 

            p.style.fill = fill;
            p.style.stroke = "white";
            p.style.strokeWidth = "1";
        }
        this.updateScore();
    },

    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        document.getElementById('sp-name').innerText = s.name;
        document.getElementById('sp-ev').innerText = s.ev + " EV";
        document.getElementById('sp-moe').innerText = `MOE: ±${s.moe}%`;

        const dVal = s.poll.toFixed(1);
        const rVal = (100 - s.poll).toFixed(1);
        document.getElementById('poll-dem-bar').style.width = dVal + "%";
        document.getElementById('poll-rep-bar').style.width = rVal + "%";
        document.getElementById('poll-dem-val').innerText = dVal + "%";
        document.getElementById('poll-rep-val').innerText = rVal + "%";

        const list = document.getElementById('sp-issues-list');
        list.innerHTML = '';
        ISSUES.sort((a,b) => s.priorities[b.id] - s.priorities[a.id]).slice(0,3).forEach(x => {
            list.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.8rem; border-bottom:1px solid #333;"><span>${x.name}</span><span style="color:#ffd700">${s.priorities[x.id]}/10</span></div>`;
        });
    },

    runStateAd: function() {
        if(this.data.actionsLeft <= 0) return this.showToast("No actions left this week!");
        if(this.data.funds < 0.5) return this.showToast("Insufficient funds ($500k needed)");

        this.data.funds -= 0.5;
        this.data.actionsLeft--;
        
        const s = this.data.states[this.data.selectedState];
        // If selected party is Dem, add to poll. If Rep, subtract.
        const boost = (Math.random() * 1.5) + 0.5;
        
        if(this.data.selectedParty === 'D') s.poll += boost;
        else if(this.data.selectedParty === 'R') s.poll -= boost;
        else {
            // Independent logic: Pull towards 50?
            if(s.poll > 50) s.poll -= boost; else s.poll += boost;
        }

        // Clamp
        if(s.poll > 100) s.poll = 100;
        if(s.poll < 0) s.poll = 0;

        this.log(`State Ad in ${s.name}: Poll Shifted`);
        this.updateHUD();
        this.colorMap();
        this.clickState(this.data.selectedState);
    },

    runNationalAd: function() {
        if(this.data.actionsLeft <= 0) return this.showToast("No actions left!");
        if(this.data.funds < 2.5) return this.showToast("Insufficient funds ($2.5M needed)");

        this.data.funds -= 2.5;
        this.data.actionsLeft--;

        for(let code in this.data.states) {
            const boost = (Math.random() * 0.5); 
            if(this.data.selectedParty === 'D') this.data.states[code].poll += boost;
            else if(this.data.selectedParty === 'R') this.data.states[code].poll -= boost;
        }

        this.log("National Ad Buy Complete.");
        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
    },

    nextWeek: function() {
        this.data.weeks--;
        this.data.actionsLeft = 3;
        
        // Opponent Logic (Undo player progress)
        for(let code in this.data.states) {
            // Random fluctuations + "Opponent Attack"
            let attack = 0;
            // 30% chance opponent targets a state you are winning
            if(this.data.selectedParty === 'D' && this.data.states[code].poll > 50 && Math.random() > 0.7) {
                attack = (Math.random() * 1.5);
                this.data.states[code].poll -= attack;
            } else if (this.data.selectedParty === 'R' && this.data.states[code].poll < 50 && Math.random() > 0.7) {
                 attack = (Math.random() * 1.5);
                 this.data.states[code].poll += attack;
            }
        }
        
        // Events
        if(Math.random() > 0.8) {
             document.getElementById('modal-overlay').classList.remove('hidden');
             document.getElementById('event-text').innerText = "Breaking News: Opponent scandal shakes up the polls in swing states!";
        }

        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("New Week Started");
        this.log("Week Advanced. Polls updated.");
    },

    updateHUD: function() {
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        document.getElementById('action-points').innerText = `${this.data.actionsLeft}/3 LEFT`;
    },

    updateScore: function() {
        let dem = 0, rep = 0;
        for(let code in this.data.states) {
            const s = this.data.states[code];
            if(s.poll >= 50) dem += s.ev;
            else rep += s.ev;
        }
        document.getElementById('score-dem').innerText = dem;
        document.getElementById('score-rep').innerText = rep;
        
        const total = 538;
        const demPct = (dem / total) * 100;
        const repPct = (rep / total) * 100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #0056b3 ${demPct}%, #333 ${demPct}%, #333 ${100-repPct}%, #d32f2f ${100-repPct}%)`;
    },

    log: function(msg) {
        const feed = document.getElementById('log-content');
        feed.innerHTML = `<div class="log-entry">${msg}</div>` + feed.innerHTML;
    },

    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.opacity = 1;
        setTimeout(() => t.style.opacity = 0, 2000);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
