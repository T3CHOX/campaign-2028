/* ============================================
   DECISION 2028 - MAIN ENTRY POINT
   ============================================ */

function initGameData() {
    for (var code in STATES) {
        gameData.states[code] = {
            name: STATES[code].name,
            ev: STATES[code].ev,
            lean: STATES[code].lean,
            code: code,
            margin: STATES[code].lean + (Math.random() - 0.5) * 10,
            visited: false,
            adSpent: 0,
            rallies: 0,
            reportedPct: 0,
            reportedVotes: { D: 0, R: 0 },
            called: false,
            calledFor: null,
            fundraisingVisits: 0
        };
    }
    
    // Enhance state data if states.js is loaded
    if (typeof enhanceStateData !== 'undefined') {
        enhanceStateData();
    }
    
    console.log("🗳️ Decision 2028 Initialized");
}

function startGame() {
    var isThirdParty = Utils.isThirdParty(gameData.selectedParty);
    
    if (isThirdParty) {
        if (!gameData.demTicket.pres || !gameData.demTicket.vp || 
            !gameData.repTicket.pres || !gameData.repTicket.vp) {
            Utils.showToast("Please select both Democratic and Republican tickets");
            return;
        }
    } else if (gameData.selectedParty === 'D') {
        if (!gameData.repTicket.pres || !gameData.repTicket.vp) {
            Utils.showToast("Please select the Republican ticket");
            return;
        }
    } else if (gameData.selectedParty === 'R') {
        if (!gameData.demTicket.pres || !gameData.demTicket.vp) {
            Utils.showToast("Please select the Democratic ticket");
            return;
        }
    }
    
    if (isThirdParty) {
        gameData.funds = Math.floor(gameData.funds * 0.5);
        gameData.maxEnergy = Math.max(4, gameData.maxEnergy - 2);
        gameData.energy = gameData.maxEnergy;
    }
    
    Screens.goTo('game-screen');
    Campaign.initMap();
    Campaign.updateHUD();
    Utils.addLog("Campaign begins!  Good luck, " + gameData.candidate.name + "!");
}

var app = {
    goToScreen: function(id) { Screens.goTo(id); },
    selParty: function(code) { Screens.selectParty(code); },
    selCandidate: function(id) { Screens.selectCandidate(id); },
    selVP: function(id) { Screens.selectVP(id); },
    startGame: function() { startGame(); },
    handleAction: function(action) { Campaign.handleAction(action); },
    openStateBio: function() { Campaign.openStateBio(); },
    nextWeek: function() { Campaign.nextWeek(); },
    undoLastAction: function() { Campaign.undoLastAction(); },
    closeCountyView: function() { Counties.closeCountyView(); },
    openCountyView: function() { 
        if (gameData.selectedState && typeof Counties !== 'undefined') {
            Counties.openCountyView(gameData.selectedState);
        }
    },
    openIssuesPanel: function() {
        // Placeholder for issues panel
        Utils.showToast("Issues panel coming soon!");
    },
    election: {
        togglePause: function() { Election.togglePause(); },
        setSpeed: function(s) { Election.setSpeed(s); },
        setMapMode: function(m) { Election.setMapMode(m); },
        closeWinnerOverlay: function() { Election.closeWinnerOverlay(); }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initGameData();
});
