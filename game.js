class GameEngine {
    constructor() {
        this.gameState = 'INTRO';
        this.player = null; 
        this.vp = null;
        this.funds = 0;
        this.turn = 1;
        this.maxTurns = 12; 
        this.states = [];
    }

    // --- SETUP PHASE ---
    
    selectCandidate(candidateId, party) {
        // Find candidate data
        const list = party === 'democrats' ? CANDIDATES.democrats : CANDIDATES.republicans;
        this.player = list.find(c => c.id === candidateId);
        this.player.party = party;
        
        // Reset States Logic (Deep Copy)
        this.states = JSON.parse(JSON.stringify(STATES_DATA));

        // Initial Funds Calculation
        this.funds = 2000000 * this.player.cash; 
        
        // Apply Candidate Home State Buff
        const home = this.states.find(s => s.id === this.player.home);
        if (home) home.polling += 10;

        // Move to VP Screen
        this.changeScreen('screen-vp');
        this.renderVP_Options();
    }

    renderVP_Options() {
        const container = document.getElementById('vp-options');
        container.innerHTML = '';
        
        // Filter VPs (D vs R)
        const partyCode = this.player.party === 'democrats' ? 'D' : 'R';
        const validVPs = VPS.filter(v => v.type === partyCode);

        validVPs.forEach(vp => {
            const btn = document.createElement('div');
            btn.className = 'card';
            btn.innerHTML = `<h3>${vp.name}</h3><p>${vp.effect}</p>`;
            btn.onclick = () => this.selectVP(vp);
            container.appendChild(btn);
        });
    }

    selectVP(vpObj) {
        this.vp = vpObj;
        
        // Apply VP Home State Buff
        const vpHome = this.states.find(s => s.id === this.vp.home);
        if (vpHome) vpHome.polling += 5;

        // Start Game
        this.gameState = 'PLAYING';
        this.changeScreen('screen-dashboard');
        this.updateDashboard();
    }

    // --- MAIN GAMEPLAY ---

    campaign(stateId) {
        const state = this.states.find(s => s.id === stateId);
        
        if (this.funds < state.cost) {
            alert("Not enough funds! Try fundraising.");
            return;
        }

        this.funds -= state.cost;

        // Calculate Polling Gain
        // Base gain 0.5% - 2.0%
        let boost = (Math.random() * 1.5) + 0.5;
        
        // Apply Candidate Special Modifiers
        if (this.player.poll_boost > 0) boost += this.player.poll_boost;
        
        // Diminishing returns if you already dominate (>60%)
        if (state.polling > 60) boost *= 0.5;

        state.polling += boost;
        
        this.nextTurn();
    }

    fundraise() {
        // Base fundraising
        let gain = 150000;
        
        // Multipliers
        gain *= this.player.cash;
        if (this.vp.effect.includes("Cash")) gain *= 1.2;

        this.funds += gain;
        alert(`Fundraising Blitz! You raised $${Math.floor(gain).toLocaleString()}`);
        this.nextTurn();
    }

    nextTurn() {
        this.turn++;
        
        // Random Event Check (30% chance)
        if (Math.random() < 0.3) {
            this.triggerRandomEvent();
        }

        if (this.turn > this.maxTurns) {
            this.endGame();
        } else {
            this.updateDashboard();
        }
    }

    triggerRandomEvent() {
        const events = [
            { text: "Scandal! Your polling drops.", shift: -1.5 },
            { text: "Viral Moment! You gain momentum.", shift: 1.5 },
            { text: "Debate Gaffe! Minor drop.", shift: -0.5 }
        ];
        const evt = events[Math.floor(Math.random() * events.length)];
        
        // Apply to all battleground states (polling between 45 and 55)
        this.states.forEach(s => {
            if (s.polling > 45 && s.polling < 55) {
                s.polling += evt.shift;
            }
        });
        alert(`BREAKING NEWS: ${evt.text}`);
    }

    // --- UI UPDATES ---

    get electoralVotes() {
        return this.states.reduce((total, s) => s.polling >= 50 ? total + s.ev : total, 0);
    }

    updateDashboard() {
        // Update Header
        document.getElementById('display-name').innerText = `${this.player.name} / ${this.vp.name}`;
        document.getElementById('display-funds').innerText = `$${Math.floor(this.funds).toLocaleString()}`;
        document.getElementById('display-ev').innerText = this.electoralVotes;
        document.getElementById('display-turn').innerText = `${this.turn}/${this.maxTurns}`;

        // Render States
        const list = document.getElementById('states-grid');
        list.innerHTML = '';
        
        // Sort states: Swing states (close to 50) first
        const sortedStates = [...this.states].sort((a, b) => {
            const gapA = Math.abs(a.polling - 50);
            const gapB = Math.abs(b.polling - 50);
            return gapA - gapB;
        });

        sortedStates.forEach(state => {
            const isWinning = state.polling >= 50;
            const card = document.createElement('div');
            card.className = `state-card ${isWinning ? 'win' : 'lose'}`;
            
            card.innerHTML = `
                <div class="state-header">
                    <span>${state.name}</span> <span>${state.ev} EV</span>
                </div>
                <div class="progress-bar">
                    <div class="fill" style="width: ${Math.min(state.polling, 100)}%"></div>
                </div>
                <div class="state-stats">
                    <span>${state.polling.toFixed(1)}%</span>
                    <span>$${(state.cost/1000).toFixed(0)}k</span>
                </div>
                <button class="campaign-btn" onclick="game.campaign('${state.id}')">VISIT STATE</button>
            `;
            list.appendChild(card);
        });
    }

    changeScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    endGame() {
        const ev = this.electoralVotes;
        let msg = ev >= 270 ? "CONGRATULATIONS! You have won the presidency." : "DEFEAT. You did not secure 270 electoral votes.";
        if(confirm(`${msg}\nFinal EV: ${ev}\n\nPlay again?`)) {
            location.reload();
        }
    }
}

// Initialize Game
const game = new GameEngine();