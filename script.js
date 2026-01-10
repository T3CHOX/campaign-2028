/* ============================================
   DECISION 2028 - CAMPAIGN SIMULATOR
   ============================================ */

const PARTIES = {
    D: { name: "Democratic Party", shortName: "Democrat", color: "#00AEF3" },
    R:  { name: "Republican Party", shortName:  "Republican", color:  "#E81B23" },
    F: { name: "Forward Party", shortName: "Forward", color: "#F2C75C" },
    G: { name: "Green Party", shortName: "Green", color: "#198754" },
    L: { name:  "Libertarian Party", shortName: "Libertarian", color: "#fd7e14" }
};

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party:  "D", funds:  60, img:  "images/harris. jpg", stamina:  8, desc: "The incumbent Vice President.", buff: "Incumbency" },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom. jpg", stamina:  9, desc:  "California Governor.", buff: "War Chest" },
    { id: "whitmer", name: "Gretchen Whitmer", party:  "D", funds:  55, img:  "images/whitmer.jpg", stamina: 8, desc: "Michigan Governor.", buff: "Midwest Appeal" },
    { id:  "buttigieg", name: "Pete Buttigieg", party: "D", funds: 50, img: "images/buttigieg.jpg", stamina: 8, desc: "Transportation Secretary.", buff: "Media Savvy" },
    { id: "aoc", name: "Alexandria Ocasio-Cortez", party:  "D", funds:  45, img:  "images/aoc.jpg", stamina: 10, desc: "Progressive firebrand.", buff: "Youth Vote" },
    { id: "desantis", name:  "Ron DeSantis", party: "R", funds: 65, img: "images/desantis. jpg", stamina:  9, desc: "Florida Governor.", buff: "Base Turnout" },
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
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/scenario.jpg", desc: "Senator from Florida." },
    { id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", img: "images/scenario.jpg", desc: "Senator from South Carolina." },
    { id: "whitman", name: "Christine Todd Whitman", party: "F", state: "NJ", img: "images/scenario.jpg", desc: "Former NJ Governor." },
    { id: "gabbard", name: "Tulsi Gabbard", party: "F", state: "HI", img: "images/scenario.jpg", desc: "Former Congresswoman." },
    { id: "ware", name: "Butch Ware", party: "G", state: "CA", img: "images/scenario.jpg", desc: "Academic and activist." },
    { id: "termaat", name: "Mike ter Maat", party: "L", state: "FL", img: "images/scenario.jpg", desc: "Libertarian economist." }
];

const app = {
    data: {
        selectedParty: null,
        candidate: null,
        vp: null,
        opponents: [],
        thirdPartiesEnabled: true
    },

    goToScreen:  function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList. remove('active'));
        document.getElementById(id).classList.add('active');
    },

    selParty: function(partyCode) {
        this.data.selectedParty = partyCode;
        this. renderCandidates(partyCode);
        this.goToScreen('candidate-screen');
    },

    renderCandidates: function(partyCode) {
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
                        ${c.debuff ?  `<p class="debuff-text">⚠ ${c.debuff}</p>` : ''}
                    </div>
                </div>`;
        });
    },

    selCandidate: function(id) {
        this.data.candidate = CANDIDATES.find(c => c.id === id);
        this.renderVPs(this.data.candidate. party);
        this.goToScreen('vp-screen');
    },

    renderVPs: function(partyCode) {
        const container = document.getElementById('vp-cards');
        container.innerHTML = "";
        
        VPS.filter(v => v. party === partyCode).forEach(v => {
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
        
        let rivalParty = (this.data.selectedParty === 'D') ? 'R' : 'D';
        
        CANDIDATES.filter(c => c.party === rivalParty).forEach(c => {
            majorContainer.innerHTML += `
                <div class="card opponent-card" data-id="${c.id}" onclick="app.toggleOpponent('${c. id}')">
                    <div class="portrait"><img src="${c.img}" onerror="this.src='images/scenario.jpg'"></div>
                    <div class="card-info">
                        <h3>${c.name}</h3>
                        <p>${c. desc || ''}</p>
                    </div>
                    <div class="selected-check hidden">✓</div>
                </div>`;
        });
        
        ['F', 'G', 'L'].filter(p => p !== this.data. selectedParty).forEach(party => {
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
        
        setTimeout(() => {
            const firstMajor = majorContainer.querySelector('.opponent-card');
            if (firstMajor) this.toggleOpponent(firstMajor.dataset. id);
        }, 100);
    },

    toggleOpponent: function(id) {
        const card = document.querySelector(`.opponent-card[data-id="${id}"]`);
        if (! card) return;
        
        const check = card.querySelector('. selected-check');
        const candidate = CANDIDATES.find(c => c.id === id);
        
        if (candidate. party === 'D' || candidate.party === 'R') {
            document.querySelectorAll('#opponent-cards-major . opponent-card').forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.selected-check').classList.add('hidden');
            });
            card.classList.add('selected');
            check.classList.remove('hidden');
            this.data.opponents = this.data.opponents.filter(o => o.party !== 'D' && o.party !== 'R');
            this.data.opponents.push(candidate);
        } else {
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

    startGame: function() {
        if (this.data.opponents.length === 0) {
            alert("Please select at least one opponent");
            return;
        }
        this.goToScreen('game-screen');
        this.initMap();
    },

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
                wrapper. innerHTML = '';
                wrapper.appendChild(svg);
            }
        } catch (e) {
            console.error("Failed to load map:", e);
            wrapper. innerHTML = '<div class="error-map">Failed to load map</div>';
        }
    },

    showToast: function(msg) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = msg;
            toast.style. opacity = 1;
            setTimeout(() => { toast.style.opacity = 0; }, 2000);
        }
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🗳️ Decision 2028 Ready");
});
