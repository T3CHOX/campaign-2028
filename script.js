/* --- CONFIGURATION & DATA --- */
const PARTIES = { D: "#0056b3", R: "#d32f2f", I: "#d4a017" };

// Game Calendar: Starts July 4, 2028
const START_DATE = new Date("2028-07-04");
let currentDate = new Date(START_DATE);

const ISSUES = [
    { id: 'econ', name: 'Economy' }, { id: 'immig', name: 'Border Security' },
    { id: 'abort', name: 'Reproductive Rights' }, { id: 'clim', name: 'Climate Change' },
    { id: 'gun', name: 'Gun Safety' }, { id: 'foreign', name: 'Foreign Policy' }
];

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", desc: "Incumbent VP. Strong base, polarized swing.", funds: 60, img: "images/harris.jpg", buff: "incumbent" },
    { id: "newsom", name: "Gavin Newsom", party: "D", desc: "CA Governor. High charisma, high funding.", funds: 75, img: "images/newsom.jpg", buff: "cash" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", desc: "MI Governor. Rust belt appeal.", funds: 55, img: "images/whitmer.jpg", buff: "rustbelt" },
    { id: "shapiro", name: "Josh Shapiro", party: "D", desc: "PA Governor. Moderate appeal.", funds: 50, img: "images/shapiro.jpg", buff: "swing" }
];

// Initial Polling Data (D Vote Share)
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

/* --- BACKUP MAP DATA (Inline SVG Paths) --- */
const PATHS = {
    "WA": "M 130,20 L 210,25 L 205,80 L 135,70 Z", "OR": "M 125,70 L 205,80 L 190,135 L 120,130 Z",
    "CA": "M 120,130 L 190,135 L 220,250 L 160,280 L 100,180 Z", "NV": "M 190,135 L 240,140 L 250,230 L 220,250 Z",
    "ID": "M 210,25 L 250,30 L 240,140 L 205,140 L 205,80 Z", "AZ": "M 220,250 L 250,230 L 290,235 L 280,330 L 210,310 Z",
    "UT": "M 240,140 L 290,145 L 290,210 L 250,210 L 250,230 L 240,140 Z", "MT": "M 250,30 L 400,40 L 390,110 L 240,100 L 240,140 L 250,30 Z",
    "WY": "M 290,110 L 380,115 L 380,180 L 290,175 Z", "CO": "M 290,175 L 380,180 L 380,245 L 290,240 Z",
    "NM": "M 290,240 L 370,245 L 370,330 L 280,330 L 290,235 Z", "TX": "M 370,260 L 400,260 L 400,290 L 510,300 L 520,400 L 440,480 L 380,420 L 330,350 Z",
    "ND": "M 390,40 L 470,45 L 470,90 L 390,90 Z", "SD": "M 390,90 L 470,90 L 475,140 L 380,140 L 380,115 Z",
    "NE": "M 380,140 L 475,140 L 480,190 L 380,190 L 380,180 Z", "KS": "M 380,190 L 490,195 L 495,245 L 380,245 L 380,245 Z",
    "OK": "M 370,245 L 495,245 L 495,290 L 400,290 L 400,260 L 370,260 Z", "MN": "M 470,45 L 530,50 L 510,120 L 470,120 Z",
    "IA": "M 470,120 L 530,120 L 540,160 L 480,160 L 475,140 Z", "MO": "M 480,160 L 560,160 L 560,230 L 500,230 L 495,245 L 490,195 Z",
    "AR": "M 495,245 L 560,245 L 550,300 L 510,300 L 495,290 Z", "LA": "M 510,300 L 550,300 L 560,350 L 580,380 L 530,390 L 510,340 Z",
    "WI": "M 530,50 L 580,60 L 580,130 L 530,120 Z", "IL": "M 530,120 L 580,130 L 580,210 L 540,220 L 540,160 Z",
    "MS": "M 550,300 L 590,300 L 580,380 L 560,350 Z", "MI": "M 580,60 L 650,70 L 640,150 L 580,130 Z",
    "IN": "M 580,130 L 630,135 L 620,200 L 580,210 Z", "KY": "M 540,220 L 620,200 L 680,210 L 660,250 L 560,230 Z",
    "TN": "M 560,230 L 660,250 L 640,280 L 550,260 L 560,245 Z", "AL": "M 590,300 L 630,300 L 620,380 L 580,380 Z",
    "OH": "M 630,135 L 680,130 L 690,190 L 620,200 Z", "GA": "M 630,300 L 680,310 L 680,380 L 620,380 Z",
    "FL": "M 620,380 L 730,390 L 760,490 L 680,480 L 650,400 Z", "NY": "M 690,70 L 770,60 L 770,120 L 720,130 L 690,120 Z",
    "PA": "M 690,120 L 760,125 L 750,170 L 690,160 Z", "WV": "M 660,190 L 710,180 L 720,210 L 680,210 Z",
    "VA": "M 680,210 L 760,200 L 770,250 L 680,250 L 660,250 Z", "NC": "M 640,280 L 750,260 L 780,300 L 680,310 Z",
    "SC": "M 680,310 L 780,300 L 760,350 L 680,350 Z", "ME": "M 790,30 L 840,40 L 830,90 L 790,80 Z",
    "NH": "M 790,60 L 810,65 L 800,105 L 790,100 Z", "VT": "M 770,60 L 790,60 L 790,100 L 770,100 Z",
    "MA": "M 770,100 L 820,100 L 820,115 L 770,115 Z", "RI": "M 800,115 L 820,115 L 820,125 L 800,125 Z",
    "CT": "M 770,115 L 800,115 L 800,125 L 770,125 Z", "NJ": "M 760,125 L 775,125 L 775,160 L 760,160 Z",
    "DE": "M 750,170 L 770,170 L 770,190 L 750,185 Z", "MD": "M 720,170 L 750,170 L 750,200 L 720,190 Z",
    "DC": "M 750,200 L 760,200 L 760,210 L 750,210 Z", "HI": "M 250,550 l 10,5 l -5,10 l -10,-5 z",
    "AK": "M 50,450 l 100,0 l 20,50 l -100,10 z"
};

const app = {
    data: { candidate: null, funds: 0, weeks: 14, actionsLeft: 3, states: {}, selectedState: null },

    init: function() {
        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        // Add random priorities & MOE
        for(let s in this.data.states) {
            this.data.states[s].moe = (Math.random() * 2 + 2).toFixed(1); // 2.0 - 4.0%
            this.data.states[s].priorities = {};
            ISSUES.forEach(i => {
                this.data.states[s].priorities[i.id] = Math.floor(Math.random() * 10) + 1;
            });
        }
        
        document.getElementById('scenario-text').innerText = "The 2028 Election cycle has begun. Choose your candidate to lead the Democratic ticket against a resurgent Republican party.";
        this.renderCandidates();
        this.initIssues();
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    renderCandidates: function() {
        const row = document.getElementById('candidate-cards');
        CANDIDATES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'card';
            const imgHTML = c.img ? `<img src="${c.img}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : "";
            el.innerHTML = `
                <div class="portrait">
                    <div class="party-badge party-${c.party}">${c.party}</div>
                    ${imgHTML}
                    <div class="portrait-placeholder" ${imgHTML ? 'style="display:none"' : ''}>${c.name.charAt(0)}</div>
                </div>
                <div class="card-info">
                    <h3>${c.name}</h3>
                    <p>${c.desc}</p>
                    <p style="color:#4ade80">Funds: $${c.funds}M</p>
                </div>
            `;
            el.onclick = () => this.selectCandidate(c, el);
            row.appendChild(el);
        });
    },

    selectCandidate: function(c, el) {
        this.data.candidate = {...c};
        document.querySelectorAll('.card').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('stance-editor').classList.remove('hidden');
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
        const badge = document.getElementById('hud-img');
        if(this.data.candidate.img) {
            badge.src = this.data.candidate.img;
            badge.style.display = "block";
        }
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name.toUpperCase();
        
        this.updateHUD();
        this.loadMap();
        this.log("Campaign started. Welcome to the war room.");
    },

    /* --- MAP SYSTEM --- */
    async loadMap() {
        const container = document.getElementById('map-container');
        try {
            // Try fetching local file first
            const res = await fetch('map.svg');
            if(!res.ok) throw new Error("Local map failed");
            container.innerHTML = await res.text();
            this.initMapInteractions();
            this.colorMap();
        } catch(e) {
            console.log("Using fallback map");
            // Fallback: Generate SVG from PATHS object
            let svgHTML = `<svg viewBox="0 0 950 600">`;
            for(let code in PATHS) {
                svgHTML += `<path id="${code}" d="${PATHS[code]}" class="state-path"></path>`;
            }
            svgHTML += `</svg>`;
            container.innerHTML = svgHTML;
            this.initMapInteractions();
            this.colorMap();
        }
    },

    initMapInteractions() {
        const svg = document.querySelector('svg');
        for(let code in this.data.states) {
            let path = document.getElementById(code) || svg.querySelector(`.${code.toLowerCase()}`);
            if(path) {
                path.id = code; // ensure ID
                path.onclick = () => this.clickState(code);
                path.onmouseenter = (e) => this.hoverState(e, code);
                path.onmouseleave = () => this.hideTooltip();
            }
        }
    },

    colorMap() {
        for(let code in this.data.states) {
            const s = this.data.states[code];
            const p = document.getElementById(code);
            if(!p) continue;

            let fill;
            if(s.poll > 55) fill = PARTIES.D;
            else if(s.poll > 50) fill = "#4fa1ff"; // Lean D
            else if(s.poll > 45) fill = "#ff6b6b"; // Lean R
            else fill = PARTIES.R;
            
            // Third party splash (random logic simulation)
            if(Math.random() > 0.95) s.poll -= 1; // Ind spoiler effect

            // Gray for tossup zone (48-52)
            if(s.poll >= 48 && s.poll <= 52) fill = "#64748b"; 

            p.style.fill = fill;
        }
        this.updateScore();
    },

    /* --- GAMEPLAY ACTIONS --- */
    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        document.getElementById('sp-name').innerText = s.name;
        document.getElementById('sp-ev').innerText = s.ev + " EV";
        document.getElementById('sp-moe').innerText = `MOE: ±${s.moe}%`;

        // Update Poll Bar
        const dVal = s.poll.toFixed(1);
        const rVal = (100 - s.poll).toFixed(1);
        document.getElementById('poll-dem-bar').style.width = dVal + "%";
        document.getElementById('poll-rep-bar').style.width = rVal + "%";
        document.getElementById('poll-dem-val').innerText = dVal + "%";
        document.getElementById('poll-rep-val').innerText = rVal + "%";

        // Issues
        const list = document.getElementById('sp-issues-list');
        list.innerHTML = '';
        const sorted = ISSUES.map(i => ({...i, imp: s.priorities[i.id]}))
                             .sort((a,b) => b.imp - a.imp).slice(0, 3);
        sorted.forEach(x => {
            list.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.8rem; border-bottom:1px solid #333;"><span>${x.name}</span><span style="color:#gold">${x.imp}/10</span></div>`;
        });
    },

    runStateAd: function() {
        if(this.data.actionsLeft <= 0) return this.showToast("No actions left this week!");
        if(this.data.funds < 0.5) return this.showToast("Insufficient funds ($500k needed)");

        this.data.funds -= 0.5;
        this.data.actionsLeft--;
        
        const s = this.data.states[this.data.selectedState];
        const boost = (Math.random() * 1.5) + 0.5; // 0.5% - 2.0% boost
        s.poll += boost;
        if(s.poll > 100) s.poll = 100;

        this.log(`State Ad in ${s.name}: Polling +${boost.toFixed(1)}%`, "good");
        this.refreshStateView();
    },

    runNationalAd: function() {
        if(this.data.actionsLeft <= 0) return this.showToast("No actions left!");
        if(this.data.funds < 2.5) return this.showToast("Insufficient funds ($2.5M needed)");

        this.data.funds -= 2.5;
        this.data.actionsLeft--;

        let totalShift = 0;
        for(let code in this.data.states) {
            const boost = (Math.random() * 0.5); 
            this.data.states[code].poll += boost;
            totalShift += boost;
        }

        this.log(`National Ad Campaign launched. Avg bump: +0.25%`, "good");
        this.refreshStateView();
    },

    /* --- TURN SYSTEM & AI --- */
    nextWeek: function() {
        // Advance Date
        currentDate.setDate(currentDate.getDate() + 7);
        this.data.weeks--;
        this.data.actionsLeft = 3; // Reset actions

        // Opponent Turn (AI)
        this.opponentTurn();

        // Check for Events
        this.checkForEvents();

        this.updateHUD();
        this.refreshStateView();
        this.showToast("New Week Started");
    },

    opponentTurn: function() {
        // AI Logic: Find closest states (45-55) and attack
        let attacks = 0;
        const maxAttacks = 3;
        
        // 1. Defend vulnerable R states (45-50% D)
        for(let code in this.data.states) {
            if(attacks >= maxAttacks) break;
            let s = this.data.states[code];
            
            // If it's Lean R but D is creeping up (45-49%), AI defends
            if(s.poll >= 45 && s.poll < 50) {
                let shift = (Math.random() * 1.5) + 0.5;
                s.poll -= shift; // Move back to R
                this.log(`GOP defends ${s.name} (-${shift.toFixed(1)}%)`, "bad");
                attacks++;
            }
        }

        // 2. Attack Lean D states (50-55% D)
        for(let code in this.data.states) {
            if(attacks >= maxAttacks) break;
            let s = this.data.states[code];
            if(s.poll >= 50 && s.poll < 55) {
                let shift = (Math.random() * 1.2) + 0.3;
                s.poll -= shift;
                this.log(`GOP attacks ${s.name} (-${shift.toFixed(1)}%)`, "bad");
                attacks++;
            }
        }
    },

    checkForEvents: function() {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Late Sept Debate
        if(currentDate.getMonth() === 8 && currentDate.getDate() > 20 && !this.debated) {
            this.debated = true;
            document.getElementById('modal-overlay').classList.remove('hidden');
        }
    },

    resolveDebate: function(tactic) {
        document.getElementById('modal-overlay').classList.add('hidden');
        let outcome = Math.random();
        let msg = "";
        
        if(tactic === 'attack') {
            if(outcome > 0.5) {
                this.globalShift(2); msg = "Attacks landed! Huge boost.";
            } else {
                this.globalShift(-1.5); msg = "Backfired. Voters disliked the tone.";
            }
        } else if(tactic === 'policy') {
            this.globalShift(0.5); msg = "Solid performance. Small boost.";
        } else {
            this.globalShift(-0.2); msg = "Played it too safe. No impact.";
        }
        this.log("Debate Result: " + msg, outcome > 0.5 ? "good" : "bad");
        this.refreshStateView();
    },

    globalShift: function(amount) {
        for(let code in this.data.states) {
            this.data.states[code].poll += amount;
        }
    },

    /* --- UTILS --- */
    updateHUD: function() {
        const dateOptions = { month: 'short', day: 'numeric' };
        document.getElementById('hud-date').innerText = currentDate.toLocaleDateString('en-US', dateOptions);
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
        
        // Update bar visuals
        const total = 538;
        const demPct = (dem / total) * 100;
        const repPct = (rep / total) * 100;
        const bar = document.getElementById('ev-bar');
        bar.style.background = `linear-gradient(90deg, #0056b3 ${demPct}%, #333 ${demPct}%, #333 ${100-repPct}%, #d32f2f ${100-repPct}%)`;
    },

    refreshStateView: function() {
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
    },

    log: function(msg, type="") {
        const feed = document.getElementById('log-content');
        feed.innerHTML = `<div class="log-entry ${type}">[${currentDate.getMonth()+1}/${currentDate.getDate()}] ${msg}</div>` + feed.innerHTML;
    },

    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.opacity = 1;
        setTimeout(() => t.style.opacity = 0, 2000);
    },

    hoverState: function(e, code) {
        // Optional tooltip logic if desired
    },
    hideTooltip: function() {
        // Hide tooltip
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
