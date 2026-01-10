/* ============================================
   DECISION 2028 - SCREEN MANAGEMENT
   Navigation and UI rendering for selection screens
   ============================================ */

const Screens = {
    // Navigate to a screen
    goTo: function(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList. remove('active'));
        document.getElementById(screenId).classList.add('active');
    },

    // Party selection
    selectParty: function(partyCode) {
        gameData.selectedParty = partyCode;
        this.renderCandidates(partyCode);
        this.goTo('candidate-screen');
    },

    // Render candidate cards
    renderCandidates: function(partyCode) {
        const container = document.getElementById('candidate-cards');
        container. innerHTML = "";
        
        CANDIDATES.filter(c => c.party === partyCode).forEach(c => {
            let card = document.createElement('div');
            card.className = 'card';
            card. onclick = () => Screens.selectCandidate(c. id);
            card.innerHTML = 
                '<div class="portrait"><img src="' + c.img + '" onerror="this. src=\'images/scenario.jpg\'"></div>' +
                '<div class="card-info">' +
                    '<h3>' + c.name + '</h3>' +
                    '<p>' + (c.desc || '') + '</p>' +
                    '<p class="buff-text">✦ ' + c. buff + '</p>' +
                    (c.debuff ? '<p class="debuff-text">⚠ ' + c.debuff + '</p>' : '') +
                '</div>';
            container.appendChild(card);
        });
    },

    // Select presidential candidate
    selectCandidate: function(id) {
        gameData.candidate = CANDIDATES.find(c => c.id === id);
        gameData.maxEnergy = gameData.candidate.stamina;
        gameData.energy = gameData.maxEnergy;
        gameData.funds = gameData.candidate.funds;
        this.renderVPs(gameData.candidate. party);
        this.goTo('vp-screen');
    },

    // Render VP cards
    renderVPs: function(partyCode) {
        const container = document.getElementById('vp-cards');
        container.innerHTML = "";
        
        VPS.filter(v => v. party === partyCode).forEach(v => {
            let card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => Screens.selectVP(v.id);
            card.innerHTML = 
                '<div class="portrait"><img src="' + v.img + '" onerror="this.src=\'images/scenario. jpg\'"></div>' +
                '<div class="card-info">' +
                    '<h3>' + v.name + '</h3>' +
                    '<p>' + (v. desc || '') + '</p>' +
                    '<p style="color: #888; font-size: 0.8rem;">Home State: ' + v. state + '</p>' +
                '</div>';
            container.appendChild(card);
        });
    },

    // Select VP
    selectVP: function(id) {
        gameData.vp = VPS.find(v => v.id === id);
        
        if (gameData.selectedParty === 'D') {
            gameData. demTicket = { pres: gameData.candidate, vp: gameData.vp };
        } else if (gameData.selectedParty === 'R') {
            gameData.repTicket = { pres: gameData.candidate, vp: gameData.vp };
        }
        
        this.renderOpponentScreen();
        this.goTo('opponent-screen');
    },

    // Render opponent selection screen
    renderOpponentScreen: function() {
        const container = document.getElementById('opponent-selection-container');
        container. innerHTML = '';
        
        const isThirdParty = Utils.isThirdParty(gameData. selectedParty);
        const instructions = document.getElementById('opponent-instructions');
        
        if (isThirdParty) {
            instructions. innerText = 'As a third party candidate, you must select both the Democratic AND Republican tickets to compete against. ';
            
            container.innerHTML = 
                '<div class="opponent-section">' +
                    '<h3>Select Democratic Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column"><h4>Presidential Nominee</h4><div class="cards-row" id="dem-pres-cards"></div></div>' +
                        '<div class="ticket-column"><h4>Running Mate</h4><div class="cards-row" id="dem-vp-cards"></div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="opponent-section">' +
                    '<h3>Select Republican Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column"><h4>Presidential Nominee</h4><div class="cards-row" id="rep-pres-cards"></div></div>' +
                        '<div class="ticket-column"><h4>Running Mate</h4><div class="cards-row" id="rep-vp-cards"></div></div>' +
                    '</div>' +
                '</div>';
            
            this.renderTicketCards('D', 'dem');
            this.renderTicketCards('R', 'rep');
        } else {
            const rivalParty = gameData.selectedParty === 'D' ?  'R' :  'D';
            const rivalName = rivalParty === 'D' ? 'Democratic' : 'Republican';
            
            instructions.innerText = 'Select the ' + rivalName + ' ticket you will face in the general election.';
            
            container.innerHTML = 
                '<div class="opponent-section">' +
                    '<h3>Select ' + rivalName + ' Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column"><h4>Presidential Nominee</h4><div class="cards-row" id="' + rivalParty. toLowerCase() + '-pres-cards"></div></div>' +
                        '<div class="ticket-column"><h4>Running Mate</h4><div class="cards-row" id="' + rivalParty. toLowerCase() + '-vp-cards"></div></div>' +
                    '</div>' +
                '</div>';
            
            this.renderTicketCards(rivalParty, rivalParty. toLowerCase());
        }
        
        this.updateStartButton();
    },

    // Render ticket selection cards
    renderTicketCards: function(party, prefix) {
        const presContainer = document.getElementById(prefix + '-pres-cards');
        const vpContainer = document.getElementById(prefix + '-vp-cards');
        
        if (! presContainer || !vpContainer) return;
        
        presContainer.innerHTML = '';
        vpContainer. innerHTML = '';
        
        CANDIDATES.filter(c => c.party === party).forEach(c => {
            let card = document.createElement('div');
            card.className = 'card opponent-card';
            card.dataset.id = c.id;
            card.dataset.type = 'pres';
            card. dataset.party = party;
            card.style.borderColor = 'transparent';
            card.onclick = function() { Screens.selectOpponentCard(this, party, 'pres'); };
            card.innerHTML = 
                '<div class="portrait"><img src="' + c.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                '<div class="card-info"><h3>' + c.name + '</h3><p>' + (c.desc || '') + '</p></div>';
            presContainer.appendChild(card);
        });
        
        VPS.filter(v => v.party === party).forEach(v => {
            let card = document.createElement('div');
            card.className = 'card opponent-card';
            card. dataset.id = v.id;
            card.dataset.type = 'vp';
            card. dataset.party = party;
            card. style.borderColor = 'transparent';
            card.onclick = function() { Screens.selectOpponentCard(this, party, 'vp'); };
            card. innerHTML = 
                '<div class="portrait"><img src="' + v.img + '" onerror="this.src=\'images/scenario. jpg\'"></div>' +
                '<div class="card-info"><h3>' + v.name + '</h3><p>' + (v.desc || '') + '</p><p style="color:  #888; font-size: 0.8rem;">Home State: ' + v. state + '</p></div>';
            vpContainer.appendChild(card);
        });
    },

    // Select opponent card
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
                gameData.demTicket. pres = CANDIDATES.find(c => c.id === id);
            } else {
                gameData.demTicket.vp = VPS.find(v => v.id === id);
            }
        } else if (party === 'R') {
            if (type === 'pres') {
                gameData. repTicket.pres = CANDIDATES. find(c => c.id === id);
            } else {
                gameData. repTicket.vp = VPS. find(v => v.id === id);
            }
        }
        
        this.updateStartButton();
    },

    // Update start button state
    updateStartButton: function() {
        const btn = document.getElementById('start-campaign-btn');
        const isThirdParty = Utils.isThirdParty(gameData. selectedParty);
        
        let canStart = false;
        
        if (isThirdParty) {
            canStart = gameData.demTicket.pres && gameData.demTicket.vp && 
                       gameData.repTicket.pres && gameData.repTicket.vp;
        } else if (gameData.selectedParty === 'D') {
            canStart = gameData.repTicket.pres && gameData.repTicket.vp;
        } else {
            canStart = gameData.demTicket.pres && gameData.demTicket.vp;
        }
        
        btn. disabled = !canStart;
        btn.style.opacity = canStart ? '1' : '0.5';
    }
};
