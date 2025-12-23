const app = {
    data: {
        candidate: null,
        vp: null,
        funds: 0,
        weeks: 11,
        selectedState: null,
    },
    
    // Game constants
    issues: [
        { id: 'econ', name: 'Economy' },
        { id: 'immig', name: 'Immigration' },
        { id: 'abort', name: 'Abortion' },
        { id: 'clim', name: 'Climate' },
        { id: 'gun', name: 'Guns' },
        { id: 'foreign', name: 'Foreign Pol' },
        { id: 'crime', name: 'Crime' },
        { id: 'health', name: 'Healthcare' }
    ],

    candidates: [
        { id: 'harris', name: 'Kamala Harris', funds: 60, stances: { econ: 60, immig: 55, abort: 100, clim: 85, gun: 90, foreign: 75, crime: 60, health: 80 } },
        { id: 'newsom', name: 'Gavin Newsom', funds: 50, stances: { econ: 65, immig: 70, abort: 100, clim: 95, gun: 95, foreign: 65, crime: 50, health: 90 } }
    ],

    vps: [
        { id: 'shapiro', name: 'Josh Shapiro', buffState: 'PA' },
        { id: 'kelly', name: 'Mark Kelly', buffState: 'AZ' },
        { id: 'walz', name: 'Tim Walz', buffState: 'WI' }
    ],

    // FULL MAP DATA (Simplified Geometry for Performance)
    states: {
        "AL": { name: "Alabama", ev: 9, lean: 25, priorities: { crime: 8, immig: 7 } },
        "AK": { name: "Alaska", ev: 3, lean: 42, priorities: { econ: 9 } },
        "AZ": { name: "Arizona", ev: 11, lean: 49.5, priorities: { immig: 10, econ: 8 } },
        "AR": { name: "Arkansas", ev: 6, lean: 30, priorities: { gun: 8 } },
        "CA": { name: "California", ev: 54, lean: 85, priorities: { clim: 10, immig: 9 } },
        "CO": { name: "Colorado", ev: 10, lean: 60, priorities: { clim: 8 } },
        "CT": { name: "Connecticut", ev: 7, lean: 65, priorities: { gun: 7 } },
        "DE": { name: "Delaware", ev: 3, lean: 70, priorities: { econ: 7 } },
        "DC": { name: "District of Columbia", ev: 3, lean: 95, priorities: { crime: 8 } },
        "FL": { name: "Florida", ev: 30, lean: 42, priorities: { econ: 9, immig: 9 } },
        "GA": { name: "Georgia", ev: 16, lean: 49.2, priorities: { econ: 8, crime: 8 } },
        "HI": { name: "Hawaii", ev: 4, lean: 75, priorities: { clim: 9 } },
        "ID": { name: "Idaho", ev: 4, lean: 20, priorities: { gun: 9 } },
        "IL": { name: "Illinois", ev: 19, lean: 70, priorities: { crime: 9 } },
        "IN": { name: "Indiana", ev: 11, lean: 35, priorities: { econ: 8 } },
        "IA": { name: "Iowa", ev: 6, lean: 40, priorities: { econ: 9 } },
        "KS": { name: "Kansas", ev: 6, lean: 35, priorities: { econ: 8 } },
        "KY": { name: "Kentucky", ev: 8, lean: 30, priorities: { econ: 9 } },
        "LA": { name: "Louisiana", ev: 8, lean: 35, priorities: { econ: 8 } },
        "ME": { name: "Maine", ev: 4, lean: 58, priorities: { clim: 7 } },
        "MD": { name: "Maryland", ev: 10, lean: 75, priorities: { crime: 7 } },
        "MA": { name: "Massachusetts", ev: 11, lean: 80, priorities: { clim: 8 } },
        "MI": { name: "Michigan", ev: 15, lean: 51.5, priorities: { econ: 10, foreign: 8 } },
        "MN": { name: "Minnesota", ev: 10, lean: 56, priorities: { health: 8 } },
        "MS": { name: "Mississippi", ev: 6, lean: 30, priorities: { health: 9 } },
        "MO": { name: "Missouri", ev: 10, lean: 38, priorities: { gun: 8 } },
        "MT": { name: "Montana", ev: 4, lean: 38, priorities: { gun: 9 } },
        "NE": { name: "Nebraska", ev: 5, lean: 32, priorities: { econ: 8 } },
        "NV": { name: "Nevada", ev: 6, lean: 50.5, priorities: { econ: 10, immig: 8 } },
        "NH": { name: "New Hampshire", ev: 4, lean: 54, priorities: { econ: 8 } },
        "NJ": { name: "New Jersey", ev: 14, lean: 62, priorities: { econ: 9 } },
        "NM": { name: "New Mexico", ev: 5, lean: 58, priorities: { immig: 8 } },
        "NY": { name: "New York", ev: 28, lean: 75, priorities: { crime: 9, econ: 8 } },
        "NC": { name: "North Carolina", ev: 16, lean: 48.5, priorities: { econ: 8, health: 8 } },
        "ND": { name: "North Dakota", ev: 3, lean: 20, priorities: { econ: 9 } },
        "OH": { name: "Ohio", ev: 17, lean: 42, priorities: { econ: 10 } },
        "OK": { name: "Oklahoma", ev: 7, lean: 25, priorities: { econ: 9 } },
        "OR": { name: "Oregon", ev: 8, lean: 68, priorities: { clim: 9 } },
        "PA": { name: "Pennsylvania", ev: 19, lean: 50.2, priorities: { econ: 10, foreign: 7 } },
        "RI": { name: "Rhode Island", ev: 4, lean: 70, priorities: { econ: 8 } },
        "SC": { name: "South Carolina", ev: 9, lean: 40, priorities: { econ: 8 } },
        "SD": { name: "South Dakota", ev: 3, lean: 25, priorities: { econ: 8 } },
        "TN": { name: "Tennessee", ev: 11, lean: 32, priorities: { gun: 8 } },
        "TX": { name: "Texas", ev: 40, lean: 43, priorities: { immig: 10, gun: 9 } },
        "UT": { name: "Utah", ev: 6, lean: 30, priorities: { econ: 8 } },
        "VT": { name: "Vermont", ev: 3, lean: 80, priorities: { clim: 9 } },
        "VA": { name: "Virginia", ev: 13, lean: 57, priorities: { econ: 8 } },
        "WA": { name: "Washington", ev: 12, lean: 72, priorities: { clim: 8 } },
        "WV": { name: "West Virginia", ev: 4, lean: 15, priorities: { econ: 10 } },
        "WI": { name: "Wisconsin", ev: 10, lean: 50.1, priorities: { econ: 9 } },
        "WY": { name: "Wyoming", ev: 3, lean: 15, priorities: { gun: 10 } }
    },

    paths: {
        "HI": "M 250,550 l 10,5 l -5,10 l -10,-5 z",
        "AK": "M 50,450 l 100,0 l 20,50 l -100,10 z",
        "WA": "M 130,20 L 210,25 L 205,80 L 135,70 Z",
        "OR": "M 125,70 L 205,80 L 190,135 L 120,130 Z",
        "CA": "M 120,130 L 190,135 L 220,250 L 160,280 L 100,180 Z",
        "ID": "M 210,25 L 250,30 L 240,140 L 205,140 L 205,80 Z",
        "NV": "M 190,135 L 240,140 L 250,230 L 220,250 Z",
        "UT": "M 240,140 L 290,145 L 290,210 L 250,210 L 250,230 L 240,140 Z",
        "AZ": "M 220,250 L 250,230 L 290,235 L 280,330 L 210,310 Z",
        "MT": "M 250,30 L 400,40 L 390,110 L 240,100 L 240,140 L 250,30 Z",
        "WY": "M 290,110 L 380,115 L 380,180 L 290,175 Z",
        "CO": "M 290,175 L 380,180 L 380,245 L 290,240 Z",
        "NM": "M 290,240 L 370,245 L 370,330 L 280,330 L 290,235 Z",
        "ND": "M 390,40 L 470,45 L 470,90 L 390,90 Z",
        "SD": "M 390,90 L 470,90 L 475,140 L 380,140 L 380,115 Z",
        "NE": "M 380,140 L 475,140 L 480,190 L 380,190 L 380,180 Z",
        "KS": "M 380,190 L 490,195 L 495,245 L 380,245 L 380,245 Z",
        "OK": "M 370,245 L 495,245 L 495,290 L 400,290 L 400,260 L 370,260 Z",
        "TX": "M 370,260 L 400,260 L 400,290 L 510,300 L 520,400 L 440,480 L 380,420 L 330,350 Z",
        "MN": "M 470,45 L 530,50 L 510,120 L 470,120 Z",
        "IA": "M 470,120 L 530,120 L 540,160 L 480,160 L 475,140 Z",
        "MO": "M 480,160 L 560,160 L 560,230 L 500,230 L 495,245 L 490,195 Z",
        "AR": "M 495,245 L 560,245 L 550,300 L 510,300 L 495,290 Z",
        "LA": "M 510,300 L 550,300 L 560,350 L 580,380 L 530,390 L 510,340 Z",
        "WI": "M 530,50 L 580,60 L 580,130 L 530,120 Z",
        "IL": "M 530,120 L 580,130 L 580,210 L 540,220 L 540,160 Z",
        "MS": "M 550,300 L 590,300 L 580,380 L 560,350 Z",
        "MI": "M 580,60 L 650,70 L 640,150 L 580,130 Z",
        "IN": "M 580,130 L 630,135 L 620,200 L 580,210 Z",
        "KY": "M 540,220 L 620,200 L 680,210 L 660,250 L 560,230 Z",
        "TN": "M 560,230 L 660,250 L 640,280 L 550,260 L 560,245 Z",
        "AL": "M 590,300 L 630,300 L 620,380 L 580,380 Z",
        "OH": "M 630,135 L 680,130 L 690,190 L 620,200 Z",
        "GA": "M 630,300 L 680,310 L 680,380 L 620,380 Z",
        "FL": "M 620,380 L 730,390 L 760,490 L 680,480 L 650,400 Z",
        "NY": "M 690,70 L 770,60 L 770,120 L 720,130 L 690,120 Z",
        "PA": "M 690,120 L 760,125 L 750,170 L 690,160 Z",
        "WV": "M 660,190 L 710,180 L 720,210 L 680,210 Z",
        "VA": "M 680,210 L 760,200 L 770,250 L 680,250 L 660,250 Z",
        "NC": "M 640,280 L 750,260 L 780,300 L 680,310 Z",
        "SC": "M 680,310 L 780,300 L 760,350 L 680,350 Z",
        "ME": "M 790,30 L 840,40 L 830,90 L 790,80 Z",
        "VT": "M 770,60 L 790,60 L 790,100 L 770,100 Z",
        "NH": "M 790,60 L 810,65 L 800,105 L 790,100 Z",
        "MA": "M 770,100 L 820,100 L 820,115 L 770,115 Z",
        "RI": "M 800,115 L 820,115 L 820,125 L 800,125 Z",
        "CT": "M 770,115 L 800,115 L 800,125 L 770,125 Z",
        "NJ": "M 760,125 L 775,125 L 775,160 L 760,160 Z",
        "DE": "M 750,170 L 770,170 L 770,190 L 750,185 Z",
        "MD": "M 720,170 L 750,170 L 750,200 L 720,190 Z",
        "DC": "M 750,200 L 760,200 L 760,210 L 750,210 Z"
    },

    // Logic
    init: function() {
        this.renderCandidates();
        this.renderVPs();
        this.initIssues();
        console.log("App Initialized");
    },

    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if(id === 'game-screen') this.startGame();
    },

    renderCandidates: function() {
        const row = document.getElementById('candidate-cards');
        this.candidates.forEach(c => {
            const el = document.createElement('div');
            el.className = 'card';
            el.innerHTML = `<div class="portrait">${c.name.charAt(0)}</div><h3>${c.name}</h3><p>Funds: $${c.funds}M</p>`;
            el.onclick = () => this.selectCandidate(c, el);
            row.appendChild(el);
        });
    },

    selectCandidate: function(c, el) {
        this.data.candidate = {...c}; // Clone
        document.querySelectorAll('#candidate-cards .card').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('stance-editor').classList.remove('hidden');
        
        // Render Sliders
        const grid = document.getElementById('stance-sliders');
        grid.innerHTML = '';
        this.issues.forEach(iss => {
            const val = this.data.candidate.stances[iss.id];
            grid.innerHTML += `
                <div class="slider-row">
                    <label>${iss.name} <span>${val}</span></label>
                    <input type="range" min="0" max="100" value="${val}" oninput="app.updateStance('${iss.id}', this.value)">
                </div>`;
        });
    },

    updateStance: function(id, val) {
        this.data.candidate.stances[id] = parseInt(val);
    },

    renderVPs: function() {
        const row = document.getElementById('vp-cards');
        this.vps.forEach(vp => {
            const el = document.createElement('div');
            el.className = 'card';
            el.innerHTML = `<h3>${vp.name}</h3><p>Boosts: ${vp.buffState}</p>`;
            el.onclick = () => {
                this.data.vp = vp;
                document.querySelectorAll('#vp-cards .card').forEach(x => x.classList.remove('selected'));
                el.classList.add('selected');
                setTimeout(() => this.goToScreen('game-screen'), 300);
            };
            row.appendChild(el);
        });
    },

    initIssues: function() {
        const sel = document.getElementById('issue-select');
        this.issues.forEach(i => {
            sel.innerHTML += `<option value="${i.id}">${i.name}</option>`;
        });
        sel.onchange = () => this.updateIssueImpact();
    },

    startGame: function() {
        this.data.funds = this.data.candidate.funds;
        
        // VP Effect
        if(this.data.vp) {
            this.states[this.data.vp.buffState].lean += 5;
        }

        this.updateHUD();
        this.renderMap();
    },

    updateHUD: function() {
        document.getElementById('hud-cand').innerText = this.data.candidate.name;
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        document.getElementById('hud-weeks').innerText = this.data.weeks;
        
        let demEV = 0;
        for(let s in this.states) {
            if(this.states[s].lean > 50) demEV += this.states[s].ev;
        }
        document.getElementById('hud-ev').innerText = `${demEV} / 270`;
    },

    renderMap: function() {
        const svg = document.getElementById('us-map');
        svg.innerHTML = '';
        for(let code in this.paths) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", this.paths[code]);
            path.id = `s-${code}`;
            path.onclick = () => this.selectState(code);
            path.onmousemove = (e) => this.showTooltip(e, code);
            path.onmouseout = () => document.getElementById('tooltip').style.display='none';
            svg.appendChild(path);
        }
        this.paintMap();
    },

    paintMap: function() {
        for(let code in this.paths) {
            const s = this.states[code];
            const p = document.getElementById(`s-${code}`);
            if(!s || !p) continue;

            let color;
            // Coloring Logic: 50=Gray, Closer=Lighter
            if(s.lean >= 45 && s.lean <= 55) {
                // Tossup Range
                const dist = s.lean - 50; // -5 to +5
                if(Math.abs(dist) < 1) color = "#64748b"; // Pure Gray
                else if(dist > 0) color = "#93c5fd"; // Very Light Blue
                else color = "#fca5a5"; // Very Light Red
            } else if(s.lean > 55) {
                // Blue Side: 55(Light) -> 100(Dark)
                const opacity = 0.4 + ((s.lean - 55)/45)*0.6;
                color = `rgba(37, 99, 235, ${opacity})`;
            } else {
                // Red Side: 45(Light) -> 0(Dark)
                const opacity = 0.4 + ((45 - s.lean)/45)*0.6;
                color = `rgba(220, 38, 38, ${opacity})`;
            }
            p.style.fill = color;
        }
    },

    selectState: function(code) {
        this.data.selectedState = code;
        const s = this.states[code];
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('sp-name').innerText = `${s.name} (${s.ev} EV)`;
        document.getElementById('sp-lean-bar').style.width = `${s.lean}%`;
        
        // Issues List
        const list = document.getElementById('sp-issues-list');
        list.innerHTML = '';
        const sorted = this.issues.map(i => ({...i, imp: s.priorities[i.id]||4}))
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
        const imp = this.states[this.data.selectedState].priorities[iId] || 4;
        document.getElementById('issue-impact').innerText = `Relevance: ${imp}/10`;
    },

    campaign: function() {
        if(!this.data.selectedState || this.data.funds < 0.1) return;
        
        this.data.funds -= 0.1;
        const iId = document.getElementById('issue-select').value;
        const s = this.states[this.data.selectedState];
        const imp = s.priorities[iId] || 4;
        
        // Shift logic: +Lean
        s.lean += (1 + (imp/5));
        if(s.lean > 100) s.lean = 100;

        this.updateHUD();
        this.paintMap();
        this.selectState(this.data.selectedState); // Refresh bar
        this.showToast(`Campaigned in ${s.name}!`);
    },

    showTooltip: function(e, code) {
        const tt = document.getElementById('tooltip');
        tt.style.display = 'block';
        tt.style.left = (e.pageX + 10) + 'px';
        tt.style.top = (e.pageY + 10) + 'px';
        tt.innerText = `${this.states[code].name}: ${this.states[code].lean.toFixed(1)}% (D)`;
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
