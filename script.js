/* --- CONFIGURATION --- */
const PARTIES = {
    D: { name: "Democratic", color: "#00AEF3", img: "images/harrison.jpg" },
    R: { name: "Republican", color: "#E81B23", img: "images/whatley.jpg" }
};

const CANDIDATES = {
    'harris': { name: "Kamala Harris", party: "D", funds: 150, img: "images/harris.jpg", stamina: 8 },
    'desantis': { name: "Ron DeSantis", party: "R", funds: 180, img: "images/desantis.jpg", stamina: 9 }
};

// Simplified State Metadata
const INIT_STATES = {
    "AL":{name:"Alabama",ev:9,fips:"01"}, "AK":{name:"Alaska",ev:3,fips:"02"}, "AZ":{name:"Arizona",ev:11,fips:"04"},
    "AR":{name:"Arkansas",ev:6,fips:"05"}, "CA":{name:"California",ev:54,fips:"06"}, "CO":{name:"Colorado",ev:10,fips:"08"},
    "CT":{name:"Connecticut",ev:7,fips:"09"}, "DE":{name:"Delaware",ev:3,fips:"10"}, "DC":{name:"District of Columbia",ev:3,fips:"11"},
    "FL":{name:"Florida",ev:30,fips:"12"}, "GA":{name:"Georgia",ev:16,fips:"13"}, "HI":{name:"Hawaii",ev:4,fips:"15"},
    "ID":{name:"Idaho",ev:4,fips:"16"}, "IL":{name:"Illinois",ev:19,fips:"17"}, "IN":{name:"Indiana",ev:11,fips:"18"},
    "IA":{name:"Iowa",ev:6,fips:"19"}, "KS":{name:"Kansas",ev:6,fips:"20"}, "KY":{name:"Kentucky",ev:8,fips:"21"},
    "LA":{name:"Louisiana",ev:8,fips:"22"}, "ME":{name:"Maine",ev:4,fips:"23"}, "MD":{name:"Maryland",ev:10,fips:"24"},
    "MA":{name:"Massachusetts",ev:11,fips:"25"}, "MI":{name:"Michigan",ev:15,fips:"26"}, "MN":{name:"Minnesota",ev:10,fips:"27"},
    "MS":{name:"Mississippi",ev:6,fips:"28"}, "MO":{name:"Missouri",ev:10,fips:"29"}, "MT":{name:"Montana",ev:4,fips:"30"},
    "NE":{name:"Nebraska",ev:5,fips:"31"}, "NV":{name:"Nevada",ev:6,fips:"32"}, "NH":{name:"New Hampshire",ev:4,fips:"33"},
    "NJ":{name:"New Jersey",ev:14,fips:"34"}, "NM":{name:"New Mexico",ev:5,fips:"35"}, "NY":{name:"New York",ev:28,fips:"36"},
    "NC":{name:"North Carolina",ev:16,fips:"37"}, "ND":{name:"North Dakota",ev:3,fips:"38"}, "OH":{name:"Ohio",ev:17,fips:"39"},
    "OK":{name:"Oklahoma",ev:7,fips:"40"}, "OR":{name:"Oregon",ev:8,fips:"41"}, "PA":{name:"Pennsylvania",ev:19,fips:"42"},
    "RI":{name:"Rhode Island",ev:4,fips:"44"}, "SC":{name:"South Carolina",ev:9,fips:"45"}, "SD":{name:"South Dakota",ev:3,fips:"46"},
    "TN":{name:"Tennessee",ev:11,fips:"47"}, "TX":{name:"Texas",ev:40,fips:"48"}, "UT":{name:"Utah",ev:6,fips:"49"},
    "VT":{name:"Vermont",ev:3,fips:"50"}, "VA":{name:"Virginia",ev:13,fips:"51"}, "WA":{name:"Washington",ev:12,fips:"53"},
    "WV":{name:"West Virginia",ev:4,fips:"54"}, "WI":{name:"Wisconsin",ev:10,fips:"55"}, "WY":{name:"Wyoming",ev:3,fips:"56"}
};

/* --- COUNTY LOGIC --- */
class County {
    constructor(id, name, type, data) {
        this.id = id;
        this.name = name || id;
        this.type = type;
        
        if(data) {
            this.population = data.p || 5000;
            this.pcts = { D: data.v.D, R: data.v.R };
        } else {
            // Procedural Fallback
            this.population = type === 'Urban' ? 500000 : 20000;
            let lean = type === 'Urban' ? 65 : 35;
            this.pcts = { D: lean, R: 100 - lean };
        }
        this.enthusiasm = { D: 1.0, R: 1.0 };
    }

    normalizePcts() {
        let total = this.pcts.D + this.pcts.R;
        if(total === 0) total = 1;
        this.pcts.D = (this.pcts.D / total) * 100;
        this.pcts.R = (this.pcts.R / total) * 100;
    }

    getVotes() {
        return {
            D: this.population * (this.pcts.D/100) * this.enthusiasm.D,
            R: this.population * (this.pcts.R/100) * this.enthusiasm.R
        };
    }
}

/* --- MAIN APP --- */
const app = {
    data: {
        currentDate: new Date("2028-07-04"), electionDay: new Date("2028-11-07"),
        selectedParty: null, candidate: null,
        funds: 0, energy: 8, maxEnergy: 8,
        states: {}, selectedState: null, activeCountyState: null,
        mapMode: 'political', masterMapCache: null, realCountyData: null,
        selectedCounty: null
    },

    startQuickGame: async function(party) {
        this.data.selectedParty = party;
        let candKey = party === 'D' ? 'harris' : 'desantis';
        this.data.candidate = CANDIDATES[candKey];
        this.data.funds = this.data.candidate.funds;

        await this.initData(); // Load maps/data
        
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        // HUD Setup
        document.getElementById('hud-img').src = this.data.candidate.img;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[party].name.toUpperCase();
        
        this.initMap();
        this.updateHUD();
        this.colorMap();
    },

    initData: async function() {
        console.log("Loading Data...");
        try {
            const res = await fetch('counties/county_data.json');
            if(res.ok) this.data.realCountyData = await res.json();
        } catch(e) { console.warn("Using procedural generation."); }

        this.data.states = JSON.parse(JSON.stringify(INIT_STATES));
        
        // Populate States
        for(let sCode in this.data.states) {
            let s = this.data.states[sCode];
            s.safeName = s.name.replace(/ /g, "_");
            s.flagUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_${s.safeName}.svg`;
            s.counties = this.generateCounties(s);
            this.recalcStatePoll(s);
        }
    },

    generateCounties: function(state) {
        let list = [];
        if(this.data.realCountyData) {
            for(let fips in this.data.realCountyData) {
                if(fips.startsWith(state.fips)) {
                    let d = this.data.realCountyData[fips];
                    list.push(new County("c"+fips, d.n, d.t, d));
                }
            }
        }
        // Fallback
        if(list.length === 0) {
            let num = Math.max(5, state.ev * 2);
            for(let i=0; i<num; i++) list.push(new County(`c_${state.fips}_${i}`, `County ${i+1}`, i==0?"Urban":"Rural", null));
        }
        return list;
    },

    recalcStatePoll: function(state) {
        let d = 0, r = 0, pop = 0;
        state.counties.forEach(c => {
            let v = c.getVotes();
            d += v.D; r += v.R; pop += (v.D + v.R);
        });
        if(pop > 0) state.pcts = { D: (d/pop)*100, R: (r/pop)*100 };
    },

    // --- MAP INTERACTIONS ---
    initMap: function() {
        for(let code in this.data.states) {
            let p = document.getElementById(code);
            if(p) {
                p.onclick = () => this.clickState(code);
                p.ondblclick = () => { this.clickState(code); this.enterStateView(); };
                p.onmousemove = (e) => this.showTooltip(e, code);
                p.onmouseleave = () => document.getElementById('map-tooltip').classList.add('hidden');
            }
        }

        // Close County Menu on Map Click
        document.getElementById('county-map-container').addEventListener('click', (e) => {
            if(e.target.tagName !== 'path') document.getElementById('county-menu').classList.add('hidden');
        });
    },

    colorMap: function() {
        let dEv = 0, rEv = 0;
        for(let code in this.data.states) {
            let s = this.data.states[code];
            let p = document.getElementById(code);
            let margin = s.pcts.D - s.pcts.R;
            if(p) p.style.fill = this.getMarginColor(margin);
            
            if(margin > 0) dEv += s.ev; else rEv += s.ev;
        }
        document.getElementById('score-dem').innerText = dEv;
        document.getElementById('score-rep').innerText = rEv;
        let dPct = (dEv / 538) * 100;
        document.getElementById('ev-bar').style.background = `linear-gradient(90deg, #00AEF3 ${dPct}%, #333 ${dPct}%, #333 ${100-((rEv/538)*100)}%, #E81B23 ${100-((rEv/538)*100)}%)`;
    },

    // --- DEEP COLOR SYSTEM (UPDATED) ---
    getMarginColor: function(margin) {
        let abs = Math.abs(margin);
        if (abs < 0.5) return "#cfcfcf"; // Tie
        
        if (margin > 0) { // DEMOCRAT (Blue)
            if (abs > 60) return "#001a33"; // Deepest Navy
            if (abs > 40) return "#002a4d"; 
            if (abs > 25) return "#004080"; // Deep Blue
            if (abs > 15) return "#005a9c"; // Solid Blue
            if (abs > 5)  return "#4da6ff"; // Lean Blue
            return "#99ccff";               // Tilt Blue
        } else { // REPUBLICAN (Red)
            if (abs > 60) return "#3d0000"; // Deepest Crimson
            if (abs > 40) return "#5e0000"; 
            if (abs > 25) return "#8b0000"; // Deep Red
            if (abs > 15) return "#cc0000"; // Solid Red
            if (abs > 5)  return "#ff4d4d"; // Lean Red
            return "#ff9999";               // Tilt Red
        }
    },

    clickState: function(code) {
        this.data.selectedState = code;
        const s = this.data.states[code];
        document.getElementById('state-panel').classList.remove('hidden');
        document.getElementById('empty-msg').classList.add('hidden');
        
        let m = s.pcts.D - s.pcts.R;
        let lead = m > 0 ? "D" : "R";
        let col = m > 0 ? "blue" : "red";
        document.getElementById('sp-name').innerHTML = `${s.name} <span class="${col}" style="font-size:0.8em">${lead}+${Math.abs(m).toFixed(1)}</span>`;
        document.getElementById('sp-ev').innerText = s.ev + " EV";
        
        document.getElementById('poll-dem-val').innerText = s.pcts.D.toFixed(1) + "%";
        document.getElementById('poll-rep-val').innerText = s.pcts.R.toFixed(1) + "%";
        let bar = document.querySelector('.poll-bar-wrap');
        bar.innerHTML = `<div style="width:${s.pcts.D}%; background:#00AEF3"></div><div style="width:${s.pcts.R}%; background:#E81B23"></div>`;
    },

    // --- COUNTY MAP SYSTEM ---
    enterStateView: function() {
        const s = this.data.states[this.data.selectedState];
        if(!s) return;
        this.data.activeCountyState = s;
        document.getElementById('cv-title').innerText = s.name.toUpperCase();
        document.getElementById('cv-flag').src = s.flagUrl;
        document.getElementById('county-modal').classList.remove('hidden');
        document.getElementById('county-menu').classList.add('hidden');
        
        const container = document.getElementById('county-map-container');
        container.innerHTML = "<p style='color:#666'>Loading...</p>";
        
        if(this.data.masterMapCache) {
            this.renderCounties(s, container);
        } else {
            fetch('counties/uscountymap.svg')
                .then(r => r.text())
                .then(d => { this.data.masterMapCache = d; this.renderCounties(s, container); })
                .catch(() => this.renderProceduralCounties(s, container));
        }
    },

    renderCounties: function(state, container) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(this.data.masterMapCache, "image/svg+xml");
        
        // Find state group or paths
        let paths = [];
        let group = doc.getElementById(state.name);
        if(group) {
            paths = Array.from(group.querySelectorAll('path, polygon'));
        } else {
            let fips = state.fips; 
            doc.querySelectorAll('path').forEach(p => {
                if(p.id && p.id.indexOf(fips) !== -1) paths.push(p);
            });
        }
        
        if(paths.length === 0) { this.renderProceduralCounties(state, container); return; }

        let newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvg.setAttribute("viewBox", "0 0 990 627");
        
        paths.forEach(p => {
            let clone = p.cloneNode(true);
            let c = state.counties.find(ct => ct.id === p.id);
            if(c) {
                clone.style.fill = this.getMarginColor(c.pcts.D - c.pcts.R);
                clone.onclick = (e) => { e.stopPropagation(); this.openCountyMenu(e, c); };
                clone.onmousemove = (e) => this.showCountyTooltip(e, c);
                clone.onmouseleave = () => document.getElementById('county-tooltip').classList.add('hidden');
            }
            newSvg.appendChild(clone);
        });
        
        container.innerHTML = "";
        container.appendChild(newSvg);
        
        // Simple auto-zoom
        setTimeout(() => { try { let bbox = newSvg.getBBox(); if(bbox.width > 0) newSvg.setAttribute("viewBox", `${bbox.x-10} ${bbox.y-10} ${bbox.width+20} ${bbox.height+20}`); } catch(e){} }, 50);
    },

    renderProceduralCounties: function(state, container) {
        container.innerHTML = "";
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 500 400");
        let cols = Math.ceil(Math.sqrt(state.counties.length * 1.5));
        
        state.counties.forEach((c, i) => {
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", (i % cols) * 45 + 10);
            rect.setAttribute("y", Math.floor(i / cols) * 45 + 10);
            rect.setAttribute("width", 40); rect.setAttribute("height", 40);
            rect.style.fill = this.getMarginColor(c.pcts.D - c.pcts.R);
            rect.style.stroke = "#111";
            rect.style.strokeWidth = "1px";
            
            rect.onclick = (e) => { e.stopPropagation(); this.openCountyMenu(e, c); };
            rect.onmousemove = (e) => this.showCountyTooltip(e, c);
            rect.onmouseleave = () => document.getElementById('county-tooltip').classList.add('hidden');
            svg.appendChild(rect);
        });
        container.appendChild(svg);
    },

    // --- COUNTY ACTIONS ---
    openCountyMenu: function(e, c) {
        this.data.selectedCounty = c;
        const menu = document.getElementById('county-menu');
        const actions = document.getElementById('cm-actions');
        
        document.getElementById('cm-name').innerText = c.name.toUpperCase();
        
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
        
        let x = e.clientX + 15;
        let y = e.clientY + 15;
        if(x + 220 > window.innerWidth) x -= 240;
        if(y + 200 > window.innerHeight) y -= 220;
        
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.remove('hidden');
    },

    doCountyAction: function(act) {
        const c = this.data.selectedCounty;
        const s = this.data.activeCountyState;
        let party = this.data.selectedParty;
        
        // NEIGHBOR EFFECT LOGIC
        // "Direct" boost to county, "Ripple" boost to all other counties in state
        let directBoost = 0;
        let rippleBoost = 0;

        if (act === 'rally') {
            if(this.data.energy < 1) return this.showToast("Not enough Energy!");
            this.data.energy--;
            directBoost = 2.5; // Big local impact
            rippleBoost = 0.2; // Small state-wide impact
            this.showToast("Rally Successful!");
        } 
        else if (act === 'ad') {
            if(this.data.funds < 0.5) return this.showToast("Not enough Funds!");
            this.data.funds -= 0.5;
            directBoost = 4.0; // Huge local impact
            rippleBoost = 0.5; // Moderate state-wide impact
            this.showToast("Ad Blitz launched!");
        }
        else if (act === 'poll') {
            if(this.data.funds < 0.1) return this.showToast("Not enough Funds!");
            this.data.funds -= 0.1;
            alert(`${c.name} Internal Poll:\nD: ${c.pcts.D.toFixed(1)}%\nR: ${c.pcts.R.toFixed(1)}%`);
            document.getElementById('county-menu').classList.add('hidden');
            this.updateHUD();
            return;
        }

        // Apply Shifts
        if(party === 'D') {
            c.pcts.D += directBoost;
            c.enthusiasm.D += 0.1;
            s.counties.forEach(neighbor => neighbor.pcts.D += rippleBoost);
        } else {
            c.pcts.R += directBoost;
            c.enthusiasm.R += 0.1;
            s.counties.forEach(neighbor => neighbor.pcts.R += rippleBoost);
        }

        // Normalize & Refresh
        s.counties.forEach(ct => ct.normalizePcts());
        this.recalcStatePoll(s);
        this.updateHUD();
        this.clickState(this.data.selectedState); // Update Sidebar Stats
        
        // Re-color map - Update ALL paths to show ripple effect
        let container = document.getElementById('county-map-container');
        let paths = container.querySelectorAll('path, rect');
        paths.forEach(p => {
             // Find matching county object
             let ct = s.counties.find(x => x.id === p.id) || s.counties[p.getAttribute('data-idx')]; 
             if(ct) p.style.fill = this.getMarginColor(ct.pcts.D - ct.pcts.R);
        });

        document.getElementById('county-menu').classList.add('hidden');
    },

    // --- UTILS ---
    showTooltip: function(e, code) {
        const tt = document.getElementById('map-tooltip');
        const s = this.data.states[code];
        let m = s.pcts.D - s.pcts.R;
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        tt.innerHTML = `<span class="tooltip-leader" style="color:${col}">${s.name} +${Math.abs(m).toFixed(1)}</span><div class="tip-row"><span class="blue">DEM ${s.pcts.D.toFixed(1)}%</span> <span class="red">REP ${s.pcts.R.toFixed(1)}%</span></div>`;
        tt.style.display = 'block'; tt.style.left = (e.clientX+15)+'px'; tt.style.top = (e.clientY+15)+'px';
        tt.classList.remove('hidden');
    },

    showCountyTooltip: function(e, c) {
        let tt = document.getElementById('county-tooltip');
        let m = c.pcts.D - c.pcts.R;
        let col = m > 0 ? "#00AEF3" : "#E81B23";
        tt.innerHTML = `<span class="tooltip-leader" style="color:${col}">${c.name} +${Math.abs(m).toFixed(1)}</span>
                        <div class="tip-row"><span class="blue">D ${c.pcts.D.toFixed(1)}%</span> <span class="red">R ${c.pcts.R.toFixed(1)}%</span></div>
                        <div style="font-size:0.7em; color:#aaa; margin-top:4px;">Pop: ${(c.population/1000).toFixed(1)}k</div>`;
        tt.style.left = (e.clientX+15)+"px"; tt.style.top = (e.clientY+15)+"px";
        tt.classList.remove('hidden');
    },

    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.style.opacity = 1; setTimeout(()=>t.style.opacity=0, 2000);
    },

    updateHUD: function() {
        document.getElementById('hud-funds').innerText = `$${this.data.funds.toFixed(1)}M`;
        document.getElementById('hud-energy').innerHTML = Array(this.data.maxEnergy).fill(0).map((_,i) => 
            `<div class="energy-pip ${i < this.data.energy ? 'active' : ''}"></div>`
        ).join('');
        document.getElementById('hud-date').innerText = this.data.currentDate.toLocaleDateString(undefined, {month:'short', day:'numeric'});
    },

    closeCountyView: function() {
        document.getElementById('county-modal').classList.add('hidden');
        document.getElementById('county-menu').classList.add('hidden');
        this.data.activeCountyState = null;
        this.colorMap(); // Refresh national map
    },

    nextWeek: function() {
        this.data.currentDate.setDate(this.data.currentDate.getDate() + 7);
        if(this.data.currentDate >= this.data.electionDay) { this.endGame(); return; }
        
        // AI Turn
        this.aiTurn();
        
        this.data.energy = this.data.maxEnergy;
        this.data.funds += 1.5; 
        this.updateHUD();
        this.colorMap();
        if(this.data.selectedState) this.clickState(this.data.selectedState);
        this.showToast("New Week Started");
    },
    
    aiTurn: function() {
        // Simple AI Logic: Target swing states
        let targets = Object.values(this.data.states).filter(s => Math.abs(s.pcts.D - s.pcts.R) < 10);
        for(let i=0; i<3 && i<targets.length; i++) {
             targets[i].counties.forEach(c => {
                 if(this.data.selectedParty === 'D') c.pcts.R += 0.4; else c.pcts.D += 0.4;
                 c.normalizePcts();
             });
             this.recalcStatePoll(targets[i]);
        }
    },
    
    endGame: function() {
        let d = 0, r = 0;
        for(let s in this.data.states) { if(this.data.states[s].pcts.D > 50) d+=this.data.states[s].ev; else r+=this.data.states[s].ev; }
        alert(`ELECTION OVER!\nDemocrats: ${d}\nRepublicans: ${r}`);
        location.reload();
    },

    fundraise: function() {
        if(this.data.energy > 0) {
            this.data.energy--;
            this.data.funds += 2.0;
            this.updateHUD();
            this.showToast("Fundraised $2.0M");
        } else this.showToast("No Energy!");
    },

    doStateAction: function(act) { this.showToast("Feature coming soon!"); }
};

document.addEventListener('DOMContentLoaded', () => app.init());
