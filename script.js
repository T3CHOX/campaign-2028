/* ============================================
   DECISION 2028 - CAMPAIGN SIMULATOR
   COMPLETE FUNCTIONAL VERSION
   ============================================ */

const PARTIES = {
    D: { name: "Democratic Party", shortName: "Democrat", color: "#00AEF3" },
    R:  { name: "Republican Party", shortName:  "Republican", color:  "#E81B23" },
    F: { name: "Forward Party", shortName: "Forward", color: "#F2C75C" },
    G: { name: "Green Party", shortName: "Green", color: "#198754" },
    L: { name:  "Libertarian Party", shortName: "Libertarian", color: "#fd7e14" }
};

const ISSUES = [
    { id: 'econ', name: 'Economy' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'tax', name: 'Tax Policy' },
    { id: 'health', name: 'Healthcare' },
    { id: 'immig', name: 'Immigration' },
    { id: 'clim', name: 'Climate' },
    { id: 'gun', name: 'Gun Control' },
    { id: 'abort', name: 'Abortion' },
    { id: 'foreign', name: 'Foreign Policy' },
    { id: 'crime', name: 'Crime' }
];

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", stamina: 8, desc: "The incumbent Vice President.", buff: "Incumbency" },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", stamina: 9, desc: "California Governor.", buff: "War Chest" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer.jpg", stamina: 8, desc: "Michigan Governor.", buff: "Midwest Appeal" },
    { id: "buttigieg", name:  "Pete Buttigieg", party: "D", funds: 50, img: "images/buttigieg.jpg", stamina:  8, desc: "Transportation Secretary.", buff: "Media Savvy" },
    { id: "aoc", name: "Alexandria Ocasio-Cortez", party:  "D", funds:  45, img: "images/aoc.jpg", stamina: 10, desc: "Progressive firebrand.", buff: "Youth Vote" },
    { id: "desantis", name:  "Ron DeSantis", party: "R", funds: 65, img: "images/desantis.jpg", stamina:  9, desc:  "Florida Governor.", buff: "Base Turnout" },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", stamina: 8, desc: "Ohio Senator.", buff: "Populism" },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", stamina: 10, desc: "Biotech entrepreneur.", buff: "Outsider Energy" },
    { id: "haley", name: "Nikki Haley", party: "R", funds: 55, img: "images/haley.jpg", stamina: 8, desc: "Former UN Ambassador.", buff: "Suburban Appeal" },
    { id: "yang", name: "Andrew Yang", party: "F", funds: 35, img: "images/yang.jpg", stamina: 8, desc: "Forward Party founder.", buff: "UBI Movement", debuff: "Third Party Penalty" },
    { id: "stein", name: "Jill Stein", party: "G", funds: 8, img: "images/scenario.jpg", stamina: 6, desc: "Green Party candidate.", buff: "Environmental Base", debuff: "Severe Third Party Penalty" },
    { id: "oliver", name: "Chase Oliver", party: "L", funds: 10, img: "images/scenario.jpg", stamina: 7, desc: "Libertarian activist.", buff: "Liberty Movement", debuff: "Severe Third Party Penalty" }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg", desc: "Governor of Pennsylvania." },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/kelly.jpg", desc: "Senator from Arizona." },
    { id: "warnock", name: "Raphael Warnock", party: "D", state: "GA", img: "images/scenario.jpg", desc: "Senator from Georgia." },
    { id: "pritzker", name:  "JB Pritzker", party: "D", state: "IL", img: "images/scenario.jpg", desc: "Governor of Illinois." },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/scenario.jpg", desc: "Senator from Florida." },
    { id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", img: "images/scenario.jpg", desc: "Senator from South Carolina." },
    { id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", img: "images/scenario.jpg", desc: "Congresswoman from New York." },
    { id: "noem", name: "Kristi Noem", party: "R", state: "SD", img: "images/scenario.jpg", desc: "Governor of South Dakota." },
    { id: "whitman", name: "Christine Todd Whitman", party: "F", state: "NJ", img: "images/scenario.jpg", desc: "Former NJ Governor." },
    { id: "gabbard", name: "Tulsi Gabbard", party: "F", state: "HI", img: "images/scenario.jpg", desc: "Former Congresswoman." },
    { id: "ware", name: "Butch Ware", party: "G", state: "CA", img: "images/scenario.jpg", desc: "Academic and activist." },
    { id: "termaat", name: "Mike ter Maat", party: "L", state: "FL", img: "images/scenario.jpg", desc: "Libertarian economist." }
];

const STATES = {
    "AL": { name: "Alabama", ev: 9, lean: -20 },
    "AK": { name:  "Alaska", ev:  3, lean:  -15 },
    "AZ": { name: "Arizona", ev: 11, lean: 0 },
    "AR": { name: "Arkansas", ev: 6, lean: -25 },
    "CA": { name:  "California", ev:  54, lean: 25 },
    "CO": { name:  "Colorado", ev:  10, lean: 8 },
    "CT": { name:  "Connecticut", ev:  7, lean: 12 },
    "DE": { name:  "Delaware", ev:  3, lean:  15 },
    "DC": { name: "District of Columbia", ev: 3, lean: 80 },
    "FL": { name:  "Florida", ev:  30, lean: -3 },
    "GA": { name:  "Georgia", ev:  16, lean: 0 },
    "HI": { name: "Hawaii", ev: 4, lean: 25 },
    "ID": { name:  "Idaho", ev:  4, lean: -30 },
    "IL": { name:  "Illinois", ev:  19, lean: 15 },
    "IN": { name:  "Indiana", ev:  11, lean: -15 },
    "IA": { name: "Iowa", ev: 6, lean: -8 },
    "KS": { name: "Kansas", ev: 6, lean: -18 },
    "KY": { name: "Kentucky", ev: 8, lean: -25 },
    "LA": { name:  "Louisiana", ev:  8, lean:  -20 },
    "ME": { name:  "Maine", ev:  4, lean: 8 },
    "MD": { name:  "Maryland", ev:  10, lean: 25 },
    "MA": { name:  "Massachusetts", ev:  11, lean: 25 },
    "MI": { name:  "Michigan", ev:  15, lean: 1 },
    "MN": { name: "Minnesota", ev: 10, lean: 3 },
    "MS": { name:  "Mississippi", ev:  6, lean:  -18 },
    "MO": { name: "Missouri", ev: 10, lean: -15 },
    "MT": { name:  "Montana", ev:  4, lean:  -15 },
    "NE": { name: "Nebraska", ev: 5, lean: -18 },
    "NV": { name: "Nevada", ev: 6, lean: 1 },
    "NH": { name:  "New Hampshire", ev: 4, lean: 5 },
    "NJ": { name: "New Jersey", ev: 14, lean: 12 },
    "NM": { name: "New Mexico", ev: 5, lean: 8 },
    "NY": { name: "New York", ev:  28, lean: 20 },
    "NC": { name:  "North Carolina", ev: 16, lean: -1 },
    "ND": { name: "North Dakota", ev: 3, lean: -30 },
    "OH": { name:  "Ohio", ev:  17, lean: -8 },
    "OK": { name:  "Oklahoma", ev:  7, lean: -35 },
    "OR": { name:  "Oregon", ev:  8, lean: 12 },
    "PA": { name:  "Pennsylvania", ev:  19, lean: 0 },
    "RI": { name: "Rhode Island", ev: 4, lean: 18 },
    "SC": { name:  "South Carolina", ev: 9, lean: -12 },
    "SD": { name:  "South Dakota", ev: 3, lean: -25 },
    "TN": { name: "Tennessee", ev: 11, lean: -25 },
    "TX": { name:  "Texas", ev:  40, lean: -5 },
    "UT": { name: "Utah", ev: 6, lean: -18 },
    "VT": { name: "Vermont", ev: 3, lean: 25 },
    "VA": { name:  "Virginia", ev:  13, lean: 5 },
    "WA": { name: "Washington", ev: 12, lean: 15 },
    "WV": { name: "West Virginia", ev: 4, lean: -35 },
    "WI": { name: "Wisconsin", ev: 10, lean: 0 },
    "WY": { name: "Wyoming", ev: 3, lean: -40 }
};

const POLL_CLOSE_TIMES = {
    "IN": 18, "KY": 18, "GA": 19, "SC": 19, "VT": 19, "VA": 19, "FL": 19, "NH": 19,
    "NC": 19.5, "OH": 19.5, "WV": 19.5, "AL": 20, "CT": 20, "DE": 20, "DC": 20,
    "IL": 20, "ME": 20, "MD": 20, "MA": 20, "MI": 20, "MS": 20, "MO": 20, "NJ": 20,
    "OK": 20, "PA": 20, "RI": 20, "TN": 20, "TX": 20, "AR": 20.5, "AZ": 21, "CO": 21,
    "KS": 21, "LA": 21, "MN": 21, "NE": 21, "NM": 21, "NY": 21, "ND": 21, "SD": 21,
    "WI": 21, "WY": 21, "IA": 22, "MT": 22, "NV": 22, "UT": 22, "CA": 23, "HI": 24,
    "ID": 23, "OR": 23, "WA": 23, "AK": 25
};

/* ============================================
   MAIN APP OBJECT
   ============================================ */

const app = {
    data: {
        currentDate: new Date("2028-07-04"),
        electionDay: new Date("2028-11-03"),
        selectedParty: null,
        candidate: null,
        vp: null,
        demTicket: { pres: null, vp: null },
        repTicket: { pres: null, vp: null },
        thirdPartyTickets: [],
        thirdPartiesEnabled: true,
        funds: 50,
        energy: 8,
        maxEnergy: 8,
        states: {},
        selectedState: null,
        historyStack: [],
        logs: []
    },

    /* ============================================
       ELECTION NIGHT SYSTEM
       ============================================ */
    election: {
        time: 17. 5,
        speed: 1,
        paused: false,
        interval: null,
        mapMode: 'leader',
        demEV: 0,
        repEV: 0,
        winnerShown: false,

        start:  function() {
            this.time = 17.5;
            this.demEV = 0;
            this. repEV = 0;
            this.winnerShown = false;
            
            for (let code in app.data.states) {
                let s = app.data. states[code];
                s.reportedPct = 0;
                s.reportedVotes = { D: 0, R: 0 };
                s.called = false;
                s.calledFor = null;
            }
            
            document.getElementById('elec-dem-name').innerText = app.data.demTicket.pres ?  app.data.demTicket.pres.name. toUpperCase() : 'DEMOCRAT';
            document. getElementById('elec-rep-name').innerText = app.data.repTicket. pres ? app. data.repTicket.pres.name.toUpperCase() : 'REPUBLICAN';
            document. getElementById('elec-dem-img').src = app.data.demTicket.pres ? app.data.demTicket. pres.img :  'images/scenario.jpg';
            document.getElementById('elec-rep-img').src = app.data.repTicket.pres ? app.data.repTicket.pres. img : 'images/scenario.jpg';
            
            document.getElementById('election-feed-content').innerHTML = '';
            document.getElementById('race-calls-content').innerHTML = '';
            
            this.loadElectionMap();
            this.updateDisplay();
            
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => {
                if (!this.paused) {
                    this.tick();
                }
            }, 100);
        },

        tick: function() {
            this.time += 0.005 * this.speed;
            
            for (let code in app.data.states) {
                let s = app.data. states[code];
                let closeTime = POLL_CLOSE_TIMES[code] || 20;
                
                if (this.time >= closeTime && !s.called) {
                    if (s.reportedPct < 100) {
                        let increment = (Math.random() * 1. 5 + 0.3) * this.speed;
                        s.reportedPct = Math.min(100, s.reportedPct + increment);
                        
                        let totalVotes = s. ev * 120000;
                        let demPct = 50 + s.margin + (Math.random() - 0.5) * 3;
                        let repPct = 100 - demPct;
                        
                        s.reportedVotes. D = Math.floor(totalVotes * (demPct / 100) * (s.reportedPct / 100));
                        s.reportedVotes.R = Math.floor(totalVotes * (repPct / 100) * (s.reportedPct / 100));
                    }
                    
                    if (s.reportedPct >= 40 && ! s.called) {
                        let margin = s.margin;
                        let threshold = 100 - s.reportedPct;
                        
                        if (Math.abs(margin) > threshold + 8) {
                            s.called = true;
                            s.calledFor = margin > 0 ?  'D' : 'R';
                            
                            if (s.calledFor === 'D') {
                                this.demEV += s.ev;
                            } else {
                                this.repEV += s.ev;
                            }
                            
                            this.addFeedItem(s.name + ' called for ' + (s.calledFor === 'D' ? 'Democrats' : 'Republicans') + ' (' + s.ev + ' EV)');
                            this.addRaceCall(code, s.calledFor);
                        }
                    }
                }
            }
            
            this.updateDisplay();
            this.colorElectionMap();
            
            if ((this.demEV >= 270 || this.repEV >= 270) && !this.winnerShown) {
                this.showWinner();
            }
        },

        updateDisplay: function() {
            let hours = Math.floor(this.time);
            let minutes = Math.floor((this.time - hours) * 60);
            let ampm = hours >= 12 ? 'PM' : 'AM';
            let displayHours = hours > 12 ? hours - 12 :  hours;
            if (displayHours === 0) displayHours = 12;
            
            document.getElementById('election-time').innerText = displayHours + ':' + minutes.toString().padStart(2, '0') + ' ' + ampm;
            document.getElementById('elec-dem-ev').innerText = this.demEV;
            document.getElementById('elec-rep-ev').innerText = this.repEV;
            
            let demWidth = (this.demEV / 538) * 50;
            let repWidth = (this. repEV / 538) * 50;
            document.getElementById('elec-bar-dem').style.width = demWidth + '%';
            document.getElementById('elec-bar-rep').style.width = repWidth + '%';
        },

        loadElectionMap: async function() {
            const wrapper = document.getElementById('election-map-wrapper');
            try {
                const response = await fetch('map.svg');
                const svgText = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser. parseFromString(svgText, 'image/svg+xml');
                const svg = svgDoc.querySelector('svg');
                
                if (svg) {
                    svg.id = 'election-map-svg';
                    svg.querySelectorAll('path').forEach(path => {
                        let code = path.id;
                        if (code && app.data.states[code]) {
                            path.style. cursor = 'pointer';
                            path. onclick = () => app.election.selectState(code);
                        }
                    });
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    this.colorElectionMap();
                }
            } catch (e) {
                wrapper.innerHTML = '<div class="error-map">Failed to load map</div>';
            }
        },

        colorElectionMap: function() {
            for (let code in app.data.states) {
                let s = app.data. states[code];
                let path = document.querySelector('#election-map-svg #' + code);
                if (path) {
                    if (this.mapMode === 'projected') {
                        if (s.called) {
                            path.style.fill = s.calledFor === 'D' ?  '#00AEF3' : '#E81B23';
                        } else {
                            path. style.fill = '#444';
                        }
                    } else {
                        if (s.reportedPct > 0) {
                            let margin = s.reportedVotes. D - s.reportedVotes.R;
                            let totalVotes = s. reportedVotes.D + s.reportedVotes.R;
                            let pctMargin = totalVotes > 0 ? (margin / totalVotes) * 100 : 0;
                            path.style.fill = app.getMarginColor(pctMargin);
                        } else {
                            path.style.fill = '#333';
                        }
                    }
                }
            }
        },

        selectState: function(code) {
            let s = app.data.states[code];
            document.getElementById('election-state-info').classList.remove('hidden');
            document. getElementById('elec-state-name').innerText = s.name;
            document.getElementById('elec-state-ev').innerText = s.ev + ' EV';
            document.getElementById('elec-pct-reporting').innerText = Math.floor(s.reportedPct) + '%';
            
            let total = s.reportedVotes.D + s.reportedVotes.R;
            let demPct = total > 0 ?  (s.reportedVotes.D / total) * 100 : 50;
            let repPct = total > 0 ? (s.reportedVotes.R / total) * 100 : 50;
            
            document. getElementById('elec-state-bar-dem').style.width = demPct + '%';
            document.getElementById('elec-state-bar-rep').style.width = repPct + '%';
            document.getElementById('elec-state-dem-votes').innerText = s.reportedVotes.D. toLocaleString();
            document.getElementById('elec-state-rep-votes').innerText = s. reportedVotes. R.toLocaleString();
            document.getElementById('elec-state-dem-pct').innerText = demPct. toFixed(1) + '%';
            document.getElementById('elec-state-rep-pct').innerText = repPct.toFixed(1) + '%';
            
            let projEl = document.getElementById('elec-projection');
            if (s.called) {
                projEl.innerHTML = '<span class="proj-status ' + (s.calledFor === 'D' ? 'called-dem' : 'called-rep') + '">CALLED FOR ' + (s.calledFor === 'D' ? 'DEMOCRATS' : 'REPUBLICANS') + '</span>';
            } else if (s.reportedPct > 0) {
                projEl.innerHTML = '<span class="proj-status">TOO CLOSE TO CALL</span>';
            } else {
                projEl. innerHTML = '<span class="proj-status">POLLS NOT CLOSED</span>';
            }
        },

        addFeedItem: function(text) {
            let hours = Math.floor(this.time);
            let minutes = Math.floor((this. time - hours) * 60);
            let ampm = hours >= 12 ?  'PM' :  'AM';
            let displayHours = hours > 12 ? hours - 12 : hours;
            
            let feed = document.getElementById('election-feed-content');
            let item = document.createElement('div');
            item.className = 'feed-item';
            item.innerHTML = '<span class="feed-time">' + displayHours + ':' + minutes.toString().padStart(2, '0') + ' ' + ampm + '</span><span class="feed-text">' + text + '</span>';
            feed. insertBefore(item, feed.firstChild);
        },

        addRaceCall: function(code, party) {
            let container = document.getElementById('race-calls-content');
            let chip = document.createElement('span');
            chip.className = 'race-call-chip ' + (party === 'D' ? 'dem' : 'rep');
            chip.innerText = code;
            container. appendChild(chip);
        },

        showWinner: function() {
            this.winnerShown = true;
            let winner = this.demEV >= 270 ?  'D' : 'R';
            let cand = winner === 'D' ? app.data.demTicket.pres : app.data. repTicket.pres;
            
            document.getElementById('winner-img').src = cand ?  cand.img : 'images/scenario. jpg';
            document.getElementById('winner-name').innerText = cand ? cand.name : (winner === 'D' ? 'Democrat' : 'Republican');
            document.getElementById('winner-party').innerText = winner === 'D' ?  'DEMOCRATIC PARTY' : 'REPUBLICAN PARTY';
            document.getElementById('winner-ev-count').innerText = winner === 'D' ? this.demEV :  this.repEV;
            document.getElementById('winner-overlay').classList.remove('hidden');
        },

        closeWinnerOverlay: function() {
            document.getElementById('winner-overlay').classList.add('hidden');
        },

        togglePause: function() {
            this.paused = ! this.paused;
            document.getElementById('btn-pause').innerText = this.paused ? '▶️' : '⏸️';
        },

        setSpeed: function(speed) {
            this. speed = speed;
            document.querySelectorAll('. time-btn').forEach(b => b.classList.remove('active'));
            if (event && event.target) event.target.classList. add('active');
        },

        setMapMode: function(mode) {
            this.mapMode = mode;
            document.getElementById('mode-leader').classList.toggle('active', mode === 'leader');
            document. getElementById('mode-projected').classList.toggle('active', mode === 'projected');
            this.colorElectionMap();
        }
    },

    /* ============================================
       INITIALIZATION
       ============================================ */
    init: function() {
        for (let code in STATES) {
            this.data.states[code] = {
                name: STATES[code].name,
                ev:  STATES[code].ev,
                lean: STATES[code].lean,
                code: code,
                margin: STATES[code].lean + (Math.random() - 0.5) * 10,
                visited: false,
                adSpent: 0,
                rallies: 0,
                reportedPct: 0,
                reportedVotes: { D: 0, R: 0 },
                called: false,
                calledFor: null
            };
        }
        console.log("🗳️ Decision 2028 Initialized");
    },

    /* ============================================
       NAVIGATION
       ============================================ */
    goToScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    /* ============================================
       PARTY SELECTION
       ============================================ */
    selParty: function(partyCode) {
        this.data.selectedParty = partyCode;
        this.renderCandidates(partyCode);
        this.goToScreen('candidate-screen');
    },

    renderCandidates:  function(partyCode) {
        const container = document.getElementById('candidate-cards');
        container.innerHTML = "";
        
        CANDIDATES.filter(c => c. party === partyCode).forEach(c => {
            let card = document.createElement('div');
            card.className = 'card';
            card. onclick = () => app.selCandidate(c. id);
            card.innerHTML = 
                '<div class="portrait"><img src="' + c.img + '" onerror="this. src=\'images/scenario. jpg\'"></div>' +
                '<div class="card-info">' +
                    '<h3>' + c. name + '</h3>' +
                    '<p>' + (c.desc || '') + '</p>' +
                    '<p class="buff-text">✦ ' + c. buff + '</p>' +
                    (c.debuff ? '<p class="debuff-text">⚠ ' + c.debuff + '</p>' : '') +
                '</div>';
            container.appendChild(card);
        });
    },

    /* ============================================
       CANDIDATE SELECTION
       ============================================ */
    selCandidate: function(id) {
        this.data.candidate = CANDIDATES.find(c => c.id === id);
        this.data.maxEnergy = this. data.candidate.stamina;
        this.data.energy = this.data.maxEnergy;
        this.data.funds = this.data.candidate. funds;
        this.renderVPs(this.data. candidate.party);
        this.goToScreen('vp-screen');
    },

    renderVPs: function(partyCode) {
        const container = document.getElementById('vp-cards');
        container.innerHTML = "";
        
        VPS.filter(v => v.party === partyCode).forEach(v => {
            let card = document. createElement('div');
            card.className = 'card';
            card.onclick = () => app.selVP(v. id);
            card.innerHTML = 
                '<div class="portrait"><img src="' + v.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                '<div class="card-info">' +
                    '<h3>' + v.name + '</h3>' +
                    '<p>' + (v.desc || '') + '</p>' +
                    '<p style="color: #888; font-size: 0.8rem;">Home State: ' + v. state + '</p>' +
                '</div>';
            container.appendChild(card);
        });
    },

    /* ============================================
       VP SELECTION
       ============================================ */
    selVP:  function(id) {
        this.data.vp = VPS.find(v => v.id === id);
        
        if (this. data.selectedParty === 'D') {
            this.data. demTicket = { pres: this. data.candidate, vp: this.data.vp };
        } else if (this.data. selectedParty === 'R') {
            this.data. repTicket = { pres: this. data.candidate, vp: this.data.vp };
        }
        
        this.renderOpponentScreen();
        this.goToScreen('opponent-screen');
    },

    /* ============================================
       OPPONENT SELECTION
       ============================================ */
    renderOpponentScreen: function() {
        const container = document.getElementById('opponent-selection-container');
        container.innerHTML = '';
        
        const isThirdParty = ['F', 'G', 'L'].includes(this. data.selectedParty);
        const instructions = document.getElementById('opponent-instructions');
        
        if (isThirdParty) {
            instructions.innerText = 'As a third party candidate, you must select both the Democratic AND Republican tickets to compete against. ';
            
            container.innerHTML = 
                '<div class="opponent-section">' +
                    '<h3>Select Democratic Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column">' +
                            '<h4>Presidential Nominee</h4>' +
                            '<div class="cards-row" id="dem-pres-cards"></div>' +
                        '</div>' +
                        '<div class="ticket-column">' +
                            '<h4>Running Mate</h4>' +
                            '<div class="cards-row" id="dem-vp-cards"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="opponent-section">' +
                    '<h3>Select Republican Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column">' +
                            '<h4>Presidential Nominee</h4>' +
                            '<div class="cards-row" id="rep-pres-cards"></div>' +
                        '</div>' +
                        '<div class="ticket-column">' +
                            '<h4>Running Mate</h4>' +
                            '<div class="cards-row" id="rep-vp-cards"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            this.renderTicketCards('D', 'dem');
            this.renderTicketCards('R', 'rep');
        } else {
            const rivalParty = this.data. selectedParty === 'D' ?  'R' :  'D';
            const rivalName = rivalParty === 'D' ? 'Democratic' : 'Republican';
            
            instructions.innerText = 'Select the ' + rivalName + ' ticket you will face in the general election.';
            
            container.innerHTML = 
                '<div class="opponent-section">' +
                    '<h3>Select ' + rivalName + ' Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column">' +
                            '<h4>Presidential Nominee</h4>' +
                            '<div class="cards-row" id="' + rivalParty. toLowerCase() + '-pres-cards"></div>' +
                        '</div>' +
                        '<div class="ticket-column">' +
                            '<h4>Running Mate</h4>' +
                            '<div class="cards-row" id="' + rivalParty.toLowerCase() + '-vp-cards"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            this.renderTicketCards(rivalParty, rivalParty. toLowerCase());
        }
        
        this.updateStartButton();
    },

    renderTicketCards: function(party, prefix) {
        const presContainer = document.getElementById(prefix + '-pres-cards');
        const vpContainer = document.getElementById(prefix + '-vp-cards');
        
        if (! presContainer || !vpContainer) return;
        
        presContainer.innerHTML = '';
        vpContainer. innerHTML = '';
        
        const partyColor = PARTIES[party].color;
        
        CANDIDATES.filter(c => c. party === party).forEach(c => {
            let card = document.createElement('div');
            card.className = 'card opponent-card';
            card.dataset.id = c.id;
            card.dataset.type = 'pres';
            card. dataset.party = party;
            card.style.borderColor = 'transparent';
            card.onclick = function() { app.selectOpponentCard(this, party, 'pres'); };
            card.innerHTML = 
                '<div class="portrait"><img src="' + c.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                '<div class="card-info">' +
                    '<h3>' + c.name + '</h3>' +
                    '<p>' + (c.desc || '') + '</p>' +
                '</div>';
            presContainer.appendChild(card);
        });
        
        VPS.filter(v => v.party === party).forEach(v => {
            let card = document.createElement('div');
            card.className = 'card opponent-card';
            card. dataset.id = v.id;
            card.dataset.type = 'vp';
            card. dataset.party = party;
            card. style.borderColor = 'transparent';
            card.onclick = function() { app.selectOpponentCard(this, party, 'vp'); };
            card.innerHTML = 
                '<div class="portrait"><img src="' + v. img + '" onerror="this. src=\'images/scenario.jpg\'"></div>' +
                '<div class="card-info">' +
                    '<h3>' + v. name + '</h3>' +
                    '<p>' + (v.desc || '') + '</p>' +
                    '<p style="color: #888; font-size: 0.8rem;">Home State:  ' + v.state + '</p>' +
                '</div>';
            vpContainer. appendChild(card);
        });
    },

    selectOpponentCard: function(cardElement, party, type) {
        const partyColor = PARTIES[party].color;
        const prefix = party. toLowerCase();
        const containerType = type === 'pres' ? 'pres' : 'vp';
        
        const container = document.getElementById(prefix + '-' + containerType + '-cards');
        container.querySelectorAll('.opponent-card').forEach(c => {
            c.style.borderColor = 'transparent';
            c.classList.remove('selected');
        });
        
        cardElement.style.borderColor = partyColor;
        cardElement.classList. add('selected');
        
        const id = cardElement.dataset.id;
        
        if (party === 'D') {
            if (type === 'pres') {
                this.data.demTicket.pres = CANDIDATES.find(c => c.id === id);
            } else {
                this.data.demTicket.vp = VPS.find(v => v.id === id);
            }
        } else if (party === 'R') {
            if (type === 'pres') {
                this.data.repTicket. pres = CANDIDATES.find(c => c.id === id);
            } else {
                this. data.repTicket.vp = VPS.find(v => v.id === id);
            }
        }
        
        this.updateStartButton();
    },

    updateStartButton: function() {
        const btn = document.getElementById('start-campaign-btn');
        const isThirdParty = ['F', 'G', 'L']. includes(this.data.selectedParty);
        
        let canStart = false;
        
        if (isThirdParty) {
            canStart = this.data.demTicket. pres && this.data.demTicket.vp && 
                       this.data.repTicket.pres && this.data. repTicket.vp;
        } else if (this.data. selectedParty === 'D') {
            canStart = this.data.repTicket.pres && this.data. repTicket.vp;
        } else {
            canStart = this.data.demTicket.pres && this.data. demTicket.vp;
        }
        
        btn.disabled = !canStart;
        btn.style.opacity = canStart ? '1' : '0.5';
    },

    toggleThirdParties: function() {
        this.data.thirdPartiesEnabled = document.getElementById('third-party-toggle').checked;
    },

    /* ============================================
       START GAME
       ============================================ */
    startGame: function() {
        const isThirdParty = ['F', 'G', 'L'].includes(this. data.selectedParty);
        
        if (isThirdParty) {
            if (! this.data.demTicket.pres || !this.data.demTicket. vp || 
                !this. data.repTicket.pres || ! this.data.repTicket.vp) {
                this.showToast("Please select both Democratic and Republican tickets");
                return;
            }
        } else if (this.data. selectedParty === 'D') {
            if (!this. data.repTicket.pres || ! this.data.repTicket.vp) {
                this.showToast("Please select the Republican ticket");
                return;
            }
        } else {
            if (!this.data. demTicket.pres || !this. data.demTicket.vp) {
                this.showToast("Please select the Democratic ticket");
                return;
            }
        }
        
        if (isThirdParty) {
            this. data.funds = Math.floor(this.data.funds * 0.5);
            this.data.maxEnergy = Math.max(4, this.data. maxEnergy - 2);
            this.data.energy = this.data.maxEnergy;
        }
        
        this.goToScreen('game-screen');
        this.initMap();
        this.updateHUD();
        this.addLog("Campaign begins!  Good luck, " + this.data. candidate.name + "!");
    },

    /* ============================================
       MAP FUNCTIONS
       ============================================ */
    initMap: async function() {
        const wrapper = document.getElementById('us-map-wrapper');
        wrapper.innerHTML = '<div class="loading-map">Loading map...</div>';
        
        try {
            const response = await fetch('map.svg');
            const svgText = await response.text();
            const parser = new DOMParser();
            const svgDoc = parser. parseFromString(svgText, 'image/svg+xml');
            const svg = svgDoc. querySelector('svg');
            
            if (svg) {
                svg.id = 'us-map-svg';
                svg.querySelectorAll('path').forEach(path => {
                    let code = path.id;
                    if (code && this.data.states[code]) {
                        path.style. cursor = 'pointer';
                        path.onclick = () => this.clickState(code);
                        path.onmousemove = (e) => this.showTooltip(e, this.data.states[code]);
                        path.onmouseleave = () => document.getElementById('map-tooltip').style.display = 'none';
                    }
                });
                wrapper.innerHTML = '';
                wrapper.appendChild(svg);
                this.colorMap();
            }
        } catch (e) {
            console.error("Failed to load map:", e);
            wrapper.innerHTML = '<div class="error-map">Failed to load map.  Make sure map.svg exists.</div>';
        }
    },

    showTooltip: function(e, state) {
        const tooltip = document.getElementById('map-tooltip');
        let marginText = Math.abs(state.margin).toFixed(1);
        let leaning = state.margin > 0 ? 'D+' : 'R+';
        if (Math.abs(state. margin) < 1) {
            leaning = 'TOSS-UP';
        } else {
            leaning = leaning + marginText;
        }
        
        tooltip.innerHTML = 
            '<span class="tooltip-title">' + state. name + '</span>' +
            '<div class="tooltip-divider"></div>' +
            '<span class="tooltip-leader" style="color: ' + (state.margin > 0 ?  '#00AEF3' : '#E81B23') + '">' + leaning + '</span>' +
            '<span class="tooltip-stats">' + state. ev + ' Electoral Votes</span>';
        tooltip.style.display = 'block';
        tooltip.style. left = (e.clientX + 15) + 'px';
        tooltip. style.top = (e.clientY + 15) + 'px';
    },

    clickState: function(code) {
        this.data.selectedState = code;
        document.querySelectorAll('#us-map-svg path').forEach(p => p.classList.remove('selected'));
        const path = document.getElementById(code);
        if (path) path.classList.add('selected');
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        let s = this.data. states[code];
        document.getElementById('sp-name').innerText = s.name;
        document. getElementById('sp-ev').innerText = s.ev + ' EV';
        
        let demPct = 50 + s.margin / 2;
        let repPct = 50 - s.margin / 2;
        demPct = Math.max(0, Math.min(100, demPct));
        repPct = Math.max(0, Math.min(100, repPct));
        
        document.getElementById('poll-bar-wrap').innerHTML = 
            '<div style="width: ' + demPct + '%; background:  #00AEF3;"></div>' +
            '<div style="width: ' + repPct + '%; background: #E81B23;"></div>';
        document.getElementById('poll-dem-val').innerText = demPct.toFixed(1) + '%';
        document. getElementById('poll-rep-val').innerText = repPct. toFixed(1) + '%';
        
        let issuesList = document.getElementById('sp-issues-list');
        issuesList.innerHTML = '';
        let shuffled = ISSUES.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        shuffled.forEach(i => {
            issuesList.innerHTML += '<span class="issue-tag">' + i. name + '</span>';
        });
    },

    colorMap: function() {
        for (let code in this.data.states) {
            let s = this.data. states[code];
            let path = document.getElementById(code);
            if (path) {
                path.style. fill = this.getMarginColor(s.margin);
            }
        }
        this.updateScore();
    },

    getMarginColor: function(margin) {
        if (margin > 20) return "#004080";
        if (margin > 10) return "#0066cc";
        if (margin > 5) return "#4da6ff";
        if (margin > 0) return "#99ccff";
        if (margin > -5) return "#ff9999";
        if (margin > -10) return "#ff4d4d";
        if (margin > -20) return "#cc0000";
        return "#800000";
    },

    updateScore:  function() {
        let demEV = 0, repEV = 0;
        for (let code in this.data.states) {
            let s = this.data. states[code];
            if (s.margin > 0) demEV += s. ev;
            else repEV += s.ev;
        }
        document.getElementById('score-dem').innerText = demEV;
        document.getElementById('score-rep').innerText = repEV;
        
        let demPct = (demEV / 538) * 100;
        document.getElementById('ev-bar').style.background = 'linear-gradient(to right, #00AEF3 ' + demPct + '%, #E81B23 ' + demPct + '%)';
    },

    /* ============================================
       HUD UPDATE
       ============================================ */
    updateHUD: function() {
        document.getElementById('hud-img').src = this.data.candidate.img;
        document.getElementById('hud-cand-name').innerText = this.data.candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[this.data.selectedParty]. name. toUpperCase();
        document.getElementById('hud-funds').innerText = '$' + this.data.funds. toFixed(1) + 'M';
        
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        document.getElementById('hud-date').innerText = months[this.data.currentDate. getMonth()] + ' ' + this.data.currentDate.getDate();
        
        let energyHtml = '';
        for (let i = 0; i < this.data.maxEnergy; i++) {
            energyHtml += '<div class="energy-pip ' + (i < this.data.energy ? 'active' : '') + '"></div>';
        }
        document. getElementById('hud-energy').innerHTML = energyHtml;
    },

    /* ============================================
       CAMPAIGN ACTIONS
       ============================================ */
    handleAction: function(action) {
        if (! this.data.selectedState) {
            return this.showToast("Select a state first!");
        }
        
        let s = this.data. states[this.data.selectedState];
        let cost = { energy: 1, funds: 0 };
        let effect = 0;
        let message = '';
        
        switch (action) {
            case 'fundraise':
                if (this.data.energy < 1) return this.showToast("Not enough energy!");
                let raised = 2 + Math.random() * 3;
                this. data.funds += raised;
                message = 'Raised $' + raised. toFixed(1) + 'M in ' + s.name;
                cost.energy = 1;
                break;
            case 'rally':
                if (this.data.energy < 2) return this.showToast("Need 2 energy for rally!");
                if (this.data. funds < 1) return this.showToast("Need $1M for rally!");
                effect = 1 + Math.random() * 2;
                cost.energy = 2;
                cost. funds = 1;
                s.rallies++;
                s.visited = true;
                message = 'Rally in ' + s.name + '! +' + effect. toFixed(1) + ' points';
                break;
            case 'ad':
                if (this.data.funds < 3) return this.showToast("Need $3M for ad blitz!");
                effect = 0.5 + Math.random() * 1.5;
                cost.funds = 3;
                cost.energy = 0;
                s. adSpent += 3;
                message = 'Ad blitz in ' + s. name + '! +' + effect.toFixed(1) + ' points';
                break;
        }
        
        this.saveState();
        this.data.energy -= cost.energy;
        this.data.funds -= cost.funds;
        
        if (this.data.selectedParty === 'D') {
            s.margin += effect;
        } else if (this.data. selectedParty === 'R') {
            s.margin -= effect;
        } else {
            s.margin += effect * 0.3;
        }
        
        this. addLog(message);
        this.updateHUD();
        this.colorMap();
        this.clickState(this.data.selectedState);
        this.showToast(message);
    },

    openStateBio: function() {
        if (! this.data.selectedState) return;
        let s = this.data.states[this. data.selectedState];
        
        let marginText = Math.abs(s.margin).toFixed(1);
        let leaning = s.margin > 0 ? 'D+' + marginText : 'R+' + marginText;
        if (Math.abs(s.margin) < 2) leaning = 'TOSS-UP';
        
        document.getElementById('bio-title').innerText = s.name + ' - Intelligence Report';
        document.getElementById('bio-content').innerHTML = 
            '<div class="bio-stat"><strong>Electoral Votes:</strong> ' + s.ev + '</div>' +
            '<div class="bio-stat"><strong>Current Polling:</strong> <span style="color: ' + (s.margin > 0 ?  '#00AEF3' : '#E81B23') + '">' + leaning + '</span></div>' +
            '<div class="bio-stat"><strong>Campaign Visits:</strong> ' + (s.visited ? 'Yes' : 'Not yet') + '</div>' +
            '<div class="bio-stat"><strong>Ad Spending:</strong> $' + s.adSpent.toFixed(1) + 'M</div>' +
            '<div class="bio-stat"><strong>Rallies Held:</strong> ' + s.rallies + '</div>';
        document.getElementById('bio-modal').classList.remove('hidden');
    },

    closeCountyView: function() {
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
    },

    /* ============================================
       TURN MANAGEMENT
       ============================================ */
    nextWeek: function() {
        this.saveState();
        this.data.currentDate. setDate(this. data.currentDate. getDate() + 7);
        this.data.energy = this.data. maxEnergy;
        
        this.opponentTurn();
        
        if (this.data. currentDate >= this.data.electionDay) {
            this.addLog("Election Day has arrived!");
            this.goToScreen('election-screen');
            this.election. start();
            return;
        }
        
        this.updateHUD();
        this.addLog("Week advanced - " + this.data.currentDate.toLocaleDateString());
        this.showToast("Week advanced!");
    },

    opponentTurn:  function() {
        const states = Object.keys(this.data.states);
        const numActions = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numActions; i++) {
            const randomState = states[Math.floor(Math. random() * states.length)];
            const s = this. data.states[randomState];
            const effect = 0.5 + Math.random() * 1.5;
            
            if (this.data.selectedParty === 'D') {
                s.margin -= effect;
            } else if (this. data.selectedParty === 'R') {
                s. margin += effect;
            } else {
                if (Math.random() > 0.5) {
                    s.margin += effect * 0.5;
                } else {
                    s.margin -= effect * 0.5;
                }
            }
        }
        
        this.colorMap();
    },

    /* ============================================
       UNDO SYSTEM
       ============================================ */
    saveState: function() {
        const snapshot = {
            funds: this.data. funds,
            energy: this.data. energy,
            date: this.data. currentDate.getTime(),
            states: {}
        };
        
        for (let code in this.data. states) {
            snapshot.states[code] = {
                margin: this.data. states[code].margin,
                visited: this.data. states[code].visited,
                adSpent: this. data.states[code].adSpent,
                rallies:  this.data.states[code].rallies
            };
        }
        
        this.data.historyStack.push(snapshot);
        if (this.data. historyStack.length > 20) this.data.historyStack.shift();
    },

    undoLastAction: function() {
        if (this. data.historyStack.length === 0) {
            return this.showToast("Nothing to undo!");
        }
        
        const prev = this.data. historyStack.pop();
        this.data.funds = prev.funds;
        this.data.energy = prev.energy;
        this.data.currentDate = new Date(prev.date);
        
        for (let code in prev.states) {
            this.data. states[code].margin = prev.states[code].margin;
            this.data. states[code].visited = prev.states[code].visited;
            this.data. states[code].adSpent = prev. states[code].adSpent;
            this.data.states[code].rallies = prev.states[code].rallies;
        }
        
        this.updateHUD();
        this.colorMap();
        if (this.data. selectedState) this.clickState(this.data.selectedState);
        this.showToast("Action undone!");
    },

    /* ============================================
       LOGGING & TOASTS
       ============================================ */
    addLog: function(message) {
        this.data.logs. unshift(message);
        if (this.data. logs.length > 50) this.data.logs.pop();
        
        const container = document.getElementById('log-content');
        container. innerHTML = this.data.logs. map(l => '<p>' + l + '</p>').join('');
    },

    showToast: function(msg) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = msg;
            toast.style.opacity = 1;
            setTimeout(() => { toast.style.opacity = 0; }, 2500);
        }
    }
};

/* ============================================
   INITIALIZATION ON PAGE LOAD
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});
