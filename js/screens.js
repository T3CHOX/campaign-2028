/* ============================================
   DECISION 2028 - SCREEN MANAGEMENT
   ============================================ */

var Screens = {
    goTo: function(screenId) {
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }
        document.getElementById(screenId).classList.add('active');
    },

    selectParty: function(partyCode) {
        gameData.selectedParty = partyCode;
        this.renderCandidates(partyCode);
        this.goTo('candidate-screen');
    },

    renderCandidates:  function(partyCode) {
        var container = document.getElementById('candidate-cards');
        container.innerHTML = "";
        
        for (var i = 0; i < CANDIDATES.length; i++) {
            var c = CANDIDATES[i];
            if (c.party === partyCode) {
                var card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('data-id', c.id);
                card.onclick = (function(id) {
                    return function() { Screens.selectCandidate(id); };
                })(c.id);
                
                card.innerHTML = 
                    '<div class="portrait"><img src="' + c.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                    '<div class="card-info">' +
                        '<h3>' + c.name + '</h3>' +
                        '<p>' + (c.desc || '') + '</p>' +
                        '<p class="buff-text">✦ ' + c.buff + '</p>' +
                        (c.debuff ? '<p class="debuff-text">⚠ ' + c.debuff + '</p>' : '') +
                    '</div>';
                container.appendChild(card);
            }
        }
    },

    selectCandidate: function(id) {
        for (var i = 0; i < CANDIDATES.length; i++) {
            if (CANDIDATES[i].id === id) {
                gameData.candidate = CANDIDATES[i];
                // Add issue positions from CANDIDATE_POSITIONS if available
                if (typeof CANDIDATE_POSITIONS !== 'undefined' && CANDIDATE_POSITIONS[id]) {
                    gameData.candidate.issuePositions = CANDIDATE_POSITIONS[id];
                }
                break;
            }
        }
        gameData.maxEnergy = gameData.candidate.stamina;
        gameData.energy = gameData.maxEnergy;
        gameData.funds = gameData.candidate.funds;
        this.renderVPs(gameData.candidate.party);
        this.goTo('vp-screen');
    },

    renderVPs: function(partyCode) {
        var container = document.getElementById('vp-cards');
        container.innerHTML = "";
        
        for (var i = 0; i < VPS.length; i++) {
            var v = VPS[i];
            if (v.party === partyCode) {
                var card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('data-id', v.id);
                card.onclick = (function(id) {
                    return function() { Screens.selectVP(id); };
                })(v.id);
                
                card.innerHTML = 
                    '<div class="portrait"><img src="' + v.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                    '<div class="card-info">' +
                        '<h3>' + v.name + '</h3>' +
                        '<p>' + (v.desc || '') + '</p>' +
                        '<p style="color: #888888; font-size: 0.8rem;">Home State: ' + v.state + '</p>' +
                    '</div>';
                container.appendChild(card);
            }
        }
    },

    selectVP: function(id) {
        for (var i = 0; i < VPS.length; i++) {
            if (VPS[i].id === id) {
                gameData.vp = VPS[i];
                break;
            }
        }
        
        if (gameData.selectedParty === 'D') {
            gameData.demTicket = { pres: gameData.candidate, vp: gameData.vp };
        } else if (gameData.selectedParty === 'R') {
            gameData.repTicket = { pres: gameData.candidate, vp: gameData.vp };
        }
        
        this.renderOpponentScreen();
        this.goTo('opponent-screen');
    },

    renderOpponentScreen: function() {
        var container = document.getElementById('opponent-selection-container');
        container.innerHTML = '';
        
        var isThirdParty = Utils.isThirdParty(gameData.selectedParty);
        var instructions = document.getElementById('opponent-instructions');
        
        if (isThirdParty) {
            instructions.innerText = 'As a third party candidate, you must select both the Democratic AND Republican tickets.';
            
            container.innerHTML = 
                '<div class="opponent-section">' +
                    '<h3 style="color: #00AEF3;">Select Democratic Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column"><h4>Presidential Nominee</h4><div class="cards-row" id="dem-pres-cards"></div></div>' +
                        '<div class="ticket-column"><h4>Running Mate</h4><div class="cards-row" id="dem-vp-cards"></div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="opponent-section">' +
                    '<h3 style="color: #E81B23;">Select Republican Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column"><h4>Presidential Nominee</h4><div class="cards-row" id="rep-pres-cards"></div></div>' +
                        '<div class="ticket-column"><h4>Running Mate</h4><div class="cards-row" id="rep-vp-cards"></div></div>' +
                    '</div>' +
                '</div>';
            
            this.renderTicketCards('D', 'dem');
            this.renderTicketCards('R', 'rep');
        } else {
            var rivalParty = gameData.selectedParty === 'D' ?  'R' :  'D';
            var rivalName = rivalParty === 'D' ? 'Democratic' : 'Republican';
            var rivalColor = rivalParty === 'D' ?  '#00AEF3' : '#E81B23';
            
            instructions.innerText = 'Select the ' + rivalName + ' ticket you will face in the general election.';
            
            container.innerHTML = 
                '<div class="opponent-section">' +
                    '<h3 style="color:  ' + rivalColor + ';">Select ' + rivalName + ' Ticket</h3>' +
                    '<div class="ticket-selection">' +
                        '<div class="ticket-column"><h4>Presidential Nominee</h4><div class="cards-row" id="' + rivalParty.toLowerCase() + '-pres-cards"></div></div>' +
                        '<div class="ticket-column"><h4>Running Mate</h4><div class="cards-row" id="' + rivalParty.toLowerCase() + '-vp-cards"></div></div>' +
                    '</div>' +
                '</div>';
            
            this.renderTicketCards(rivalParty, rivalParty.toLowerCase());
        }
        
        this.updateStartButton();
    },

    renderTicketCards: function(party, prefix) {
        var presContainer = document.getElementById(prefix + '-pres-cards');
        var vpContainer = document.getElementById(prefix + '-vp-cards');
        
        if (! presContainer || !vpContainer) return;
        
        presContainer.innerHTML = '';
        vpContainer.innerHTML = '';
        
        var partyColor = PARTIES[party].color;
        
        for (var i = 0; i < CANDIDATES.length; i++) {
            var c = CANDIDATES[i];
            if (c.party === party) {
                var card = document.createElement('div');
                card.className = 'card opponent-card';
                card.setAttribute('data-id', c.id);
                card.setAttribute('data-type', 'pres');
                card.setAttribute('data-party', party);
                card.style.borderColor = 'transparent';
                card.onclick = (function(cardEl, p) {
                    return function() { Screens.selectOpponentCard(cardEl, p, 'pres'); };
                })(card, party);
                
                card.innerHTML = 
                    '<div class="portrait"><img src="' + c.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                    '<div class="card-info"><h3>' + c.name + '</h3><p>' + (c.desc || '') + '</p></div>';
                presContainer.appendChild(card);
            }
        }
        
        for (var j = 0; j < VPS.length; j++) {
            var v = VPS[j];
            if (v.party === party) {
                var vpCard = document.createElement('div');
                vpCard.className = 'card opponent-card';
                vpCard.setAttribute('data-id', v.id);
                vpCard.setAttribute('data-type', 'vp');
                vpCard.setAttribute('data-party', party);
                vpCard.style.borderColor = 'transparent';
                vpCard.onclick = (function(cardEl, p) {
                    return function() { Screens.selectOpponentCard(cardEl, p, 'vp'); };
                })(vpCard, party);
                
                vpCard.innerHTML = 
                    '<div class="portrait"><img src="' + v.img + '" onerror="this.src=\'images/scenario.jpg\'"></div>' +
                    '<div class="card-info"><h3>' + v.name + '</h3><p>' + (v.desc || '') + '</p><p style="color:  #888888; font-size: 0.8rem;">Home State: ' + v.state + '</p></div>';
                vpContainer.appendChild(vpCard);
            }
        }
    },

    selectOpponentCard: function(cardElement, party, type) {
        var partyColor = PARTIES[party].color;
        var prefix = party.toLowerCase();
        var containerId = prefix + '-' + type + '-cards';
        
        var container = document.getElementById(containerId);
        var cards = container.querySelectorAll('.opponent-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.borderColor = 'transparent';
            cards[i].classList.remove('selected');
        }
        
        cardElement.style.borderColor = partyColor;
        cardElement.style.borderWidth = '3px';
        cardElement.classList.add('selected');
        
        var id = cardElement.getAttribute('data-id');
        
        if (party === 'D') {
            if (type === 'pres') {
                for (var j = 0; j < CANDIDATES.length; j++) {
                    if (CANDIDATES[j].id === id) {
                        gameData.demTicket.pres = CANDIDATES[j];
                        // Add issue positions
                        if (typeof CANDIDATE_POSITIONS !== 'undefined' && CANDIDATE_POSITIONS[id]) {
                            gameData.demTicket.pres.issuePositions = CANDIDATE_POSITIONS[id];
                        }
                        break;
                    }
                }
            } else {
                for (var k = 0; k < VPS.length; k++) {
                    if (VPS[k].id === id) {
                        gameData.demTicket.vp = VPS[k];
                        break;
                    }
                }
            }
        } else if (party === 'R') {
            if (type === 'pres') {
                for (var m = 0; m < CANDIDATES.length; m++) {
                    if (CANDIDATES[m].id === id) {
                        gameData.repTicket.pres = CANDIDATES[m];
                        // Add issue positions
                        if (typeof CANDIDATE_POSITIONS !== 'undefined' && CANDIDATE_POSITIONS[id]) {
                            gameData.repTicket.pres.issuePositions = CANDIDATE_POSITIONS[id];
                        }
                        break;
                    }
                }
            } else {
                for (var n = 0; n < VPS.length; n++) {
                    if (VPS[n].id === id) {
                        gameData.repTicket.vp = VPS[n];
                        break;
                    }
                }
            }
        }
        
        this.updateStartButton();
    },

    updateStartButton: function() {
        var btn = document.getElementById('start-campaign-btn');
        var isThirdParty = Utils.isThirdParty(gameData.selectedParty);
        
        var canStart = false;
        
        if (isThirdParty) {
            canStart = gameData.demTicket.pres && gameData.demTicket.vp && 
                       gameData.repTicket.pres && gameData.repTicket.vp;
        } else if (gameData.selectedParty === 'D') {
            canStart = gameData.repTicket.pres && gameData.repTicket.vp;
        } else if (gameData.selectedParty === 'R') {
            canStart = gameData.demTicket.pres && gameData.demTicket.vp;
        }
        
        btn.disabled = ! canStart;
        btn.style.opacity = canStart ? '1' :  '0.5';
        btn.style.cursor = canStart ? 'pointer' : 'not-allowed';
    }
};
