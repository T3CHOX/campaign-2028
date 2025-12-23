class GameController {
    constructor() {
        this.player = {}; 
        this.vp = {};
        this.party = "";
        this.init();
    }

    init() {
        // Set Intro Text
        document.getElementById('scenario-text').innerText = SCENARIO_TEXT;
        this.showScreen('screen-intro');
    }

    // --- SCREEN 1: INTRO ---
    startGame() {
        this.showScreen('screen-party');
    }

    // --- SCREEN 2: PARTY SELECT ---
    selectParty(partyCode) {
        this.party = partyCode;
        
        // Populate Party Summary Info
        const info = PARTIES[partyCode];
        document.getElementById('party-name').innerText = info.name;
        document.getElementById('party-desc').innerText = info.desc;
        document.getElementById('chair-name').innerText = `Party Chair: ${info.chair}`;
        document.getElementById('chair-img').src = info.chair_img;
        document.getElementById('party-header').style.backgroundColor = info.color;

        // Populate Candidate List
        const list = document.getElementById('candidate-list');
        list.innerHTML = '';
        
        // Filter candidates by party
        const options = CANDIDATES.filter(c => c.party === partyCode);
        
        options.forEach(c => {
            const item = document.createElement('div');
            item.className = 'candidate-card';
            item.onclick = () => this.confirmCandidate(c);
            item.innerHTML = `
                <img src="${c.img}" alt="${c.name}">
                <div class="c-info">
                    <h3>${c.name}</h3>
                    <span class="home-badge">${c.home}</span>
                    <p>${c.desc}</p>
                </div>
            `;
            list.appendChild(item);
        });

        // Add Custom Candidate Option
        const custom = document.createElement('div');
        custom.className = 'candidate-card custom-card';
        custom.onclick = () => this.openCustomCreator();
        custom.innerHTML = `<h3>+ Create Custom Candidate</h3>`;
        list.appendChild(custom);

        this.showScreen('screen-candidate');
    }

    // --- SCREEN 3: CANDIDATE SELECT ---
    confirmCandidate(cObj) {
        this.player = cObj;
        this.setupVPScreen();
    }

    openCustomCreator() {
        const name = prompt("Enter Candidate Name:");
        const home = prompt("Enter Home State (e.g. CA):");
        if(name && home) {
            const customObj = { id: "custom", name: name, party: this.party, home: home, desc: "A rising star defying expectations.", img: "https://via.placeholder.com/150?text=YOU" };
            this.confirmCandidate(customObj);
        }
    }

    // --- SCREEN 4: VP SELECT ---
    setupVPScreen() {
        const list = document.getElementById('vp-list');
        list.innerHTML = '';

        // VP List = All candidates of same party MINUS the player
        const potentialVPs = CANDIDATES.filter(c => c.party === this.party && c.id !== this.player.id);

        potentialVPs.forEach(c => {
            const item = document.createElement('div');
            item.className = 'candidate-card';
            item.onclick = () => this.startGameplay(c);
            item.innerHTML = `
                <img src="${c.img}" alt="${c.name}">
                <div class="c-info">
                    <h3>${c.name}</h3>
                    <p class="bonus-text">Bonus: Boosts ${c.home}</p>
                </div>
            `;
            list.appendChild(item);
        });

        this.showScreen('screen-vp');
    }

    // --- SCREEN 5: THE GAME MAP ---
    startGameplay(vpObj) {
        this.vp = vpObj;
        this.showScreen('screen-map');
        this.renderMap();
    }

    renderMap() {
        // This is a simplified "Block Map" to simulate the CSV Map visually
        // In a real version, we would inject an SVG here.
        const mapContainer = document.getElementById('us-map');
        mapContainer.innerHTML = '';

        // We iterate through our data (simulating the CSV)
        for (const [stateCode, data] of Object.entries(INITIAL_MAP_DATA)) {
            const tile = document.createElement('div');
            tile.className = 'map-tile';
            
            // Determine Color based on Party (Wikipedia Colors)
            let color = '#ccc'; // Tossup
            if (data.lean === 'D') color = PARTIES.D.color;
            if (data.lean === 'R') color = PARTIES.R.color;
            
            tile.style.backgroundColor = color;
            tile.innerHTML = `<strong>${stateCode}</strong><br>${data.ev}`;
            mapContainer.appendChild(tile);
        }
    }

    // Utility
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
}

const game = new GameController();
