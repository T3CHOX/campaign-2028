/* --- USER DATA INCORPORATED --- */

const SCENARIO_TEXT = "The year is 2028. The nation is at a crossroads. Following a tumultuous decade, the electorate is fractured. The Rust Belt is trending right, the Sun Belt is trending left, and new coalitions are forming. You must navigate the primaries and manage your resources to win 270 Electoral Votes.";

const PARTIES = {
    D: { name: "Democratic Party", color: "#00AEF3" },
    R: { name: "Republican Party", color: "#E81B23" },
    I: { name: "Independent", color: "#F2C75C" }
};

const CANDIDATES = [
    { id: "newsom", name: "Gavin Newsom", party: "D", home: "CA", desc: "Governor of California.", buff: "Fundraising Machine (Cash x1.2)", img: "images/newsom.jpg" },
    { id: "harris", name: "Kamala Harris", party: "D", home: "CA", desc: "Former Vice President.", buff: "Base Turnout (+Safe D States)", img: "images/harris.jpg" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", home: "MI", desc: "Governor of Michigan.", buff: "Rust Belt Appeal (+MI/WI/PA)", img: "images/whitmer.jpg" },
    { id: "shapiro", name: "Josh Shapiro", party: "D", home: "PA", desc: "Popular PA Governor.", buff: "Swing State King (+PA)", img: "images/shapiro.jpg" },
    { id: "buttigieg", name: "Pete Buttigieg", party: "D", home: "MI", desc: "Transportation Secretary.", buff: "Media Darling (+Global Polls)", img: "images/buttigieg.jpg" },
    { id: "vance", name: "JD Vance", party: "R", home: "OH", desc: "The populist standard-bearer.", buff: "Rust Belt Appeal (+OH/PA)", img: "images/vance.jpg" },
    { id: "desantis", name: "Ron DeSantis", party: "R", home: "FL", desc: "Governor of Florida.", buff: "Culture Warrior (+FL/TX)", img: "images/desantis.jpg" },
    { id: "haley", name: "Nikki Haley", party: "R", home: "SC", desc: "Former UN Ambassador.", buff: "Suburban Appeal (+VA/CO)", img: "images/haley.jpg" },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", home: "OH", desc: "Tech Entrepreneur.", buff: "Self-Funder (Start with $5M)", img: "images/vance.jpg" },
    { id: "yang", name: "Andrew Yang", party: "I", home: "NY", desc: "Forward Party Founder.", buff: "UBI Appeal (+Youth Vote)", img: "images/yang.jpg" }
];

// Merging User Polling Data with Default Issue Priorities so the game is playable
const USER_STATE_DATA = {
    "AL": { name: "Alabama", ev: 9, polling: 35 }, "AK": { name: "Alaska", ev: 3, polling: 42 }, "AZ": { name: "Arizona", ev: 11, polling: 49 },
    "AR": { name: "Arkansas", ev: 6, polling: 35 }, "CA": { name: "California", ev: 54, polling: 65 }, "CO": { name: "Colorado", ev: 10, polling: 56 },
    "CT": { name: "Connecticut", ev: 7, polling: 59 }, "DE": { name: "Delaware", ev: 3, polling: 60 }, "DC": { name: "District of Columbia", ev: 3, polling: 90 },
    "FL": { name: "Florida", ev: 30, polling: 45 }, "GA": { name: "Georgia", ev: 16, polling: 48 }, "HI": { name: "Hawaii", ev: 4, polling: 68 },
    "ID": { name: "Idaho", ev: 4, polling: 30 }, "IL": { name: "Illinois", ev: 19, polling: 57 }, "IN": { name: "Indiana", ev: 11, polling: 40 },
    "IA": { name: "Iowa", ev: 6, polling: 43 }, "KS": { name: "Kansas", ev: 6, polling: 40 }, "KY": { name: "Kentucky", ev: 8, polling: 35 },
    "LA": { name: "Louisiana", ev: 8, polling: 38 }, "ME": { name: "Maine", ev: 4, polling: 55 }, "MD": { name: "Maryland", ev: 10, polling: 63 },
    "MA": { name: "Massachusetts", ev: 11, polling: 65 }, "MI": { name: "Michigan", ev: 15, polling: 51 }, "MN": { name: "Minnesota", ev: 10, polling: 53 },
    "MS": { name: "Mississippi", ev: 6, polling: 38 }, "MO": { name: "Missouri", ev: 10, polling: 41 }, "MT": { name: "Montana", ev: 4, polling: 40 },
    "NE": { name: "Nebraska", ev: 5, polling: 38 }, "NV": { name: "Nevada", ev: 6, polling: 50 }, "NH": { name: "New Hampshire", ev: 4, polling: 52 },
    "NJ": { name: "New Jersey", ev: 14, polling: 58 }, "NM": { name: "New Mexico", ev: 5, polling: 54 }, "NY": { name: "New York", ev: 28, polling: 60 },
    "NC": { name: "North Carolina", ev: 16, polling: 48 }, "ND": { name: "North Dakota", ev: 3, polling: 30 }, "OH": { name: "Ohio", ev: 17, polling: 45 },
    "OK": { name: "Oklahoma", ev: 7, polling: 32 }, "OR": { name: "Oregon", ev: 8, polling: 58 }, "PA": { name: "Pennsylvania", ev: 19, polling: 50 },
    "RI": { name: "Rhode Island", ev: 4, polling: 60 }, "SC": { name: "South Carolina", ev: 9, polling: 42 }, "SD": { name: "South Dakota", ev: 3, polling: 35 },
    "TN": { name: "Tennessee", ev: 11, polling: 37 }, "TX": { name: "Texas", ev: 40, polling: 43 }, "UT": { name: "Utah", ev: 6, polling: 38 },
    "VT": { name: "Vermont", ev: 3, polling: 65 }, "VA": { name: "Virginia", ev: 13, polling: 54 }, "WA": { name: "Washington", ev: 12, polling: 60 },
    "WV": { name: "West Virginia", ev: 4, polling: 28 }, "WI": { name: "Wisconsin", ev: 10, polling: 50 }, "WY": { name: "Wyoming", ev: 3, polling: 25 }
};

// Fallback Issue Priorities (so the game works even though user data didn't have it)
const DEFAULT_PRIORITIES = {
    "CA": { clim: 10, immig: 8 }, "TX": { immig: 10, gun: 9 }, "PA": { econ: 10, energy: 9 },
    "FL": { econ: 9, immig: 8 }, "NY": { crime: 8, econ: 8 }, "IL": { crime: 9 },
    "OH": { econ: 10 }, "MI": { econ: 10, foreign: 8 }, "AZ": { immig: 10 },
    "NV": { econ: 10 }, "WI": { econ: 9 }, "GA": { econ: 8 }, "NC": { econ: 8 }
};

const ISSUES = [
    { id: 'econ', name: 'Economy' }, { id: 'immig', name: 'Immigration' },
    { id: 'abort', name: 'Abortion' }, { id: 'clim', name: 'Climate' },
    { id: 'gun', name: 'Guns' }, { id: 'foreign', name: 'Foreign Pol' },
    { id: 'crime', name: 'Crime' }, { id: 'health', name: 'Healthcare' }
];

/* --- MAIN APP LOGIC --- */

const app = {
    data: {
        candidate: null,
        funds: 5.0,
        weeks: 12,
        selectedState: null,
        states: {}
    },

    init: function() {
        console.log("Initializing Campaign 2028...");
        
        // 1. Merge User Data with Logic
        this.data.states = JSON.parse(JSON.stringify(USER_STATE_DATA));
        for(let code in this.data.states) {
            // Assign random priorities if specific ones aren't defined
            this.data.states[code].priorities = DEFAULT_PRIORITIES[code] || { econ: 8, crime: 5 };
            // Ensure polling exists (defaults to 50 if missing)
            if(this.data.states[code].polling === undefined) this.data.states[code].polling = 50;
        }

        // 2. Setup Intro
        document.getElementById('scenario-text').innerText = SCENARIO_TEXT;
        
        // 3. Render Candidates
        this.renderCandidates();
        this.initIssues();
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    renderCandidates: function() {
        const row = document.getElementById('candidate-cards');
        row.innerHTML = '';
        
        CANDIDATES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'card';
            // Handle images vs placeholder
            const imgHTML = c.img && c.img !== "" 
                ? `<img src="${c.img}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` 
                : "";
            
            el.innerHTML = `
                <div class="portrait">
                    <div class="party-badge party-${c.party}">${c.party}</div>
                    ${imgHTML}
                    <div class="portrait-placeholder" ${imgHTML ? 'style="display:none"' : ''}>${c.name.charAt(0)}</div>
                </div>
                <h3>${c.name}</h3>
                <p>${c.desc}</p>
                <p class="buff-text">${c.buff}</p>
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
        sel.onchange = () => this.updateIssueImpact();
    },

    startGame: function() {
        if(!this.data.candidate) return;
        this.goToScreen('game-screen');
        this.updateHUD();
        
        // --- YOUR REQUESTED MAP LOGIC ---
        this.renderMapStructure();
    },

    // --- YOUR MAP LOGIC INTEGRATION ---
    async renderMapStructure() {
        const container = document.getElementById('map-container');
        try {
            // Fetch external SVG as requested
            const response = await fetch('map.svg');
            if(!response.ok) throw new Error("Map file not found");
            const svgText = await response.text();
            container.innerHTML = svgText;

            // Wait for DOM to parse the SVG then init
            setTimeout(() => {
                this.initMapInteractions();
                this.colorMap();
            }, 50);

        } catch (e) {
            console.error(e);
            // Fallback if user doesn't have map.svg or is blocked by CORS
            container.innerHTML = `
                <div style="text-align:center; padding-top:100px; color:#64748b;">
                    <h3>Map Loading Error</h3>
                    <p>Browser blocked local file access or 'map.svg' is missing.</p>
                    <p>Please ensure <strong>map.svg</strong> is in the folder.</p>
                </div>`;
        }
    },

    initMapInteractions() {
        const svg = document.querySelector('svg');
        if(!svg) return;

        // Loop through our data keys (AL, AK, etc)
        for(const stateId of Object.keys(this.data.states)) {
            const lowercaseCode = stateId.toLowerCase();
            
            // Your logic: Find by class (e.g. .tx)
            let path = svg.querySelector(`.${lowercaseCode}`);
            
            if(path) {
                path.id = stateId; 
                path.onclick = () => this.clickState(stateId);
                path.onmouseenter = (e) => this.showTooltip(e, stateId);
                path.onmouseleave = () => this.hideTooltip();
                
                // Visual overrides
                path.style.cursor = "pointer";
                path.style.stroke = "#ffffff";
                path.style.strokeWidth = "0.5px";
                path.style.transition = "fill 0.3s ease";
            }
        }
    },

    colorMap() {
        for(let code in this.data.states) {
            const s = this.data.states[code];
            const p = document.getElementById(code);
            if(!p) continue;

            let color;
            // Using 'polling' (0-100% Dem)
            // 45-55 is Tossup
            if(s.polling >= 45 && s.polling <= 55) {
                const dist = s.polling - 50; 
                if(Math.abs(dist) < 1) color = "#94a3b8"; // Pure Gray
                else if(dist > 0) color = "#93c5fd"; // Light Blue
                else color = "#fca5a5"; // Light Red
            } else if(s.polling > 55) {
                // Dem Blue
                const opacity = 0.4 + ((s.polling - 55)/45)*0.6;
                color = `rgba(0, 174, 243, ${opacity})`; // User's Party Color
            } else {
                // Rep Red
                const opacity = 0.4 + ((45 - s.polling)/45)*0.6;
                color = `rgba(232, 27, 35, ${opacity})`; // User's Party Color
            }
            p.style.fill = color;
        }
    },
    // ---------------------------------

    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        document.getElementById('sp-name').innerText = `${s.name} (${s.ev} EV)`;
        document.getElementById('sp-lean-bar').style.width = `${s.polling}%`;
        
        // Render Issues
        const list = document.getElementById('sp-issues-list');
        list.innerHTML = '';
        const sorted = ISSUES.map(i => ({...i, imp: s.priorities[i.id]||4}))
            .sort((a,b)=>b.imp-a.imp).slice(0,5);
        
        sorted.forEach(x => {
            list.innerHTML += `
                <div class="item"><span>${x.name}</span>
                <div class="bar-track"><div class="bar-val" style="width:${x.imp*10}%"></div></div></div>`;
        });
        
        this.updateIssueImpact();
    },

    updateIssueImpact: function() {
        if(!this.data.selectedState) return;
        const iId = document.getElementById('issue-select').value;
        const imp = this.data.states[this.data.selectedState].priorities[iId] || 4;
        document.getElementById('issue-impact').innerText = `Relevance: ${imp}/10`;
    },

    campaign: function() {
        if(!this.data.selectedState || this.data.funds < 0.1) return;
        
        this.data.funds -= 0.1;
        const iId = document.getElementById('issue-select').value;
        const s = this.data.states[this.data.selectedState];
        const imp = s.priorities[iId] || 4;
        
        // Shift Polling
        s.polling += (1 + (imp/5));
        if(s.polling > 100) s.polling = 100;

        this.updateHUD();
        this.colorMap();
        this.clickState(this.data.selectedState); // Refresh UI
        this.showToast(`Campaigned in ${s.name}!`);
    },

    updateHUD: function() {
        document.getElementById('hud-cand').innerText = this.data.candidate.name;
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        document.getElementById('hud-weeks').innerText = this.data.weeks;
        
        let demEV = 0;
        for(let s in this.data.states) {
            if(this.data.states[s].polling > 50) demEV += this.data.states[s].ev;
        }
        document.getElementById('hud-ev').innerText = `${demEV} / 270`;
    },

    showTooltip: function(e, code) {
        const tt = document.getElementById('tooltip');
        tt.style.display = 'block';
        tt.style.left = (e.pageX + 10) + 'px';
        tt.style.top = (e.pageY + 10) + 'px';
        tt.innerText = `${this.data.states[code].name}: ${this.data.states[code].polling.toFixed(1)}% Dem`;
    },
    
    hideTooltip: function() {
        document.getElementById('tooltip').style.display = 'none';
    },

    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.opacity = 1;
        setTimeout(() => t.style.opacity = 0, 2000);
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => app.init());
