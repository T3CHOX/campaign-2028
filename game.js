// game.js

class GameEngine {
    constructor() {
        this.gameState = 'INTRO';
        this.party = null;
        this.player = null;
        this.vp = null;
        this.funds = 0;
        this.week = 1;
        this.maxWeeks = 12;
        this.states = {};
        
        this.init();
    }

    init() {
        // Load Data
        document.getElementById('scenario-text').innerText = SCENARIO_TEXT;
        this.states = JSON.parse(JSON.stringify(STATE_DATA)); // Deep copy polling data

        // Event Listeners
        document.getElementById('start-btn').addEventListener('click', () => this.setScreen('screen-party'));
        
        document.querySelectorAll('.party-card').forEach(card => {
            card.addEventListener('click', () => this.selectParty(card.dataset.party));
        });

        document.getElementById('campaign-btn').addEventListener('click', () => this.campaignInState());

        // Initialize Map
        this.renderMapStructure();
    }

    // --- NAVIGATION ---
    setScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    // --- STEP 1: PARTY SELECT ---
    selectParty(partyCode) {
        this.party = partyCode;
        const pData = PARTIES[partyCode];

        // Update Header Info
        document.getElementById('party-name').innerText = pData.name;
        document.getElementById('party-name').style.color = pData.color;
        document.getElementById('party-desc').innerText = pData.desc;
        document.getElementById('chair-name').innerText = pData.chair;
        document.getElementById('chair-img').src = pData.chair_img;
        document.getElementById('party-header-bar').style.borderLeftColor = pData.color;

        // Render Candidates
        const list = document.getElementById('candidate-list');
        list.innerHTML = '';
        
        CANDIDATES.filter(c => c.party === partyCode).forEach(c => {
            const el = document.createElement('div');
            el.className = 'candidate-card';
            el.innerHTML = `
                <img src="${c.img}" onerror="this.src='https://via.placeholder.com/80'">
                <div class="c-info">
                    <h3>${c.name}</h3>
                    <p class="c-desc">${c.desc}</p>
                    <p class="c-buff">${c.buff}</p>
                </div>
            `;
            el.onclick = () => this.selectCandidate(c);
            list.appendChild(el);
        });

        // Add "Create Custom" option
        const custom = document.createElement('div');
        custom.className = 'candidate-card';
        custom.style.justifyContent = 'center';
        custom.innerHTML = `<h3>+ Create Custom Candidate</h3>`;
        custom.onclick = () => this.createCustomCandidate();
        list.appendChild(custom);

        this.setScreen('screen-candidate');
    }

    createCustomCandidate() {
        const name = prompt("Enter your name:");
        const home = prompt("Home State Code (e.g. TX):").toUpperCase();
        if(name && STATE_DATA[home]) {
            const custom = { id: "custom", name: name, party: this.party, home: home, desc: "The Outsider", buff: "Grassroots Movement", img: "images/scenario.jpg" };
            this.selectCandidate(custom);
        } else {
            alert("Invalid State Code");
        }
    }

    // --- STEP 2: VP SELECT ---
    selectCandidate(c) {
        this.player = c;
        
        const list = document.getElementById('vp-list');
        list.innerHTML = '';

        // Potential VPs are others from same party
        CANDIDATES.filter(vp => vp.party === this.party && vp.id !== c.id).forEach(vp => {
            const el = document.createElement('div');
            el.className = 'candidate-card';
            el.innerHTML = `
                <img src="${vp.img}" onerror="this.src='https://via.placeholder.com/80'">
                <div class="c-info">
                    <h3>${vp.name}</h3>
                    <p class="c-desc">${vp.desc}</p>
                    <p class="c-buff">Boosts: ${vp.home}</p>
                </div>
            `;
            el.onclick = () => this.selectVP(vp);
            list.appendChild(el);
        });

        this.setScreen('screen-vp');
    }

    // --- STEP 3: START GAME ---
    selectVP(vp) {
        this.vp = vp;
        this.funds = 2000000; // Start with $2M
        
        // Apply Bonuses
        this.applyPollingBonus(this.player.home, 10);
        this.applyPollingBonus(this.vp.home, 5);

        // Start
        this.setScreen('screen-map');
        this.updateHUD();
        this.colorMap();
    }

    applyPollingBonus(stateId, amount) {
        if(this.states[stateId]) {
            if(this.party === 'D') this.states[stateId].polling += amount;
            else if (this.party === 'R') this.states[stateId].polling -= amount; // Lower is better for R
        }
    }

    // --- MAP SYSTEM ---
    renderMapStructure() {
        const svg = document.getElementById('us-map');
        for(const [id, pathData] of Object.entries(US_STATE_PATHS)) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("id", id);
            
            // Interaction
            path.addEventListener('click', () => this.selectState(id));
            path.addEventListener('mouseenter', (e) => this.showTooltip(e, id));
            path.addEventListener('mouseleave', () => this.hideTooltip());

            svg.appendChild(path);
        }
    }

    colorMap() {
        for(const [id, state] of Object.entries(this.states)) {
            const el = document.getElementById(id);
            if(!el) continue;

            let color = "#ccc"; // Tossup
            const p = state.polling;

            if (p >= 60) color = "#003f5c"; // Safe D
            else if (p >= 55) color = "#00AEF3"; // Likely D
            else if (p >= 52) color = "#58508d"; // Lean D
            else if (p <= 40) color = "#bc5090"; // Safe R
            else if (p <= 45) color = "#E81B23"; // Likely R
            else if (p <= 48) color = "#ff6361"; // Lean R

            el.style.fill = color;
        }
    }

    // --- GAMEPLAY LOOP ---
    selectState(stateId) {
        this.selectedState = stateId;
        const state = this.states[stateId];
        
        document.getElementById('selected-state-name').innerText = `${state.name} (${state.ev} EV)`;
        document.getElementById('state-info').innerText = `Current Polling: ${state.polling.toFixed(1)}% Dem`;
        
        const btn = document.getElementById('campaign-btn');
        btn.disabled = false;
        btn.innerText = `CAMPAIGN IN ${stateId} ($100k)`;
    }

    campaignInState() {
        if (this.funds < 100000) {
            alert("Insufficient Funds!");
            return;
        }

        this.funds -= 100000;
        
        // Campaign Logic
        const state = this.states[this.selectedState];
        const boost = (Math.random() * 1.5) + 0.5;
        
        if (this.party === 'D') state.polling += boost;
        else state.polling -= boost;

        this.week++;
        if(this.week > this.maxWeeks) this.endGame();
        
        this.updateHUD();
        this.colorMap();
        this.selectState(this.selectedState); // Refresh UI
    }

    // --- HUD & UTILS ---
    updateHUD() {
        document.getElementById('hud-candidate').innerText = this.player.name;
        document.getElementById('hud-turn').innerText = `${this.maxWeeks - this.week}`;
        document.getElementById('hud-funds').innerText = `$${(this.funds / 1000000).toFixed(1)}M`;
        
        // Calculate EV
        let demEV = 0;
        let gopEV = 0;
        
        for(const state of Object.values(this.states)) {
            if (state.polling >= 50) demEV += state.ev;
            else gopEV += state.ev;
        }
        
        document.getElementById('hud-ev').innerText = `${this.party === 'D' ? demEV : gopEV} / 270`;
    }

    showTooltip(e, id) {
        const state = this.states[id];
        const tip = document.getElementById('state-tooltip');
        tip.style.display = 'block';
        tip.style.left = e.pageX + 10 + 'px';
        tip.style.top = e.pageY + 10 + 'px';
        tip.innerHTML = `<strong>${state.name}</strong><br>${state.polling.toFixed(1)}% Dem`;
    }

    hideTooltip() {
        document.getElementById('state-tooltip').style.display = 'none';
    }

    endGame() {
        let demEV = 0;
        for(const state of Object.values(this.states)) {
            if (state.polling >= 50) demEV += state.ev;
        }
        
        const win = (this.party === 'D' && demEV >= 270) || (this.party === 'R' && demEV < 270);
        alert(win ? "YOU WON THE ELECTION!" : "You lost. Better luck next time.");
        location.reload();
    }
}

// Start
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
});
