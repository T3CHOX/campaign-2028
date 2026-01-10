/* ============================================
   DECISION 2028 - MAIN ENTRY POINT
   App initialization and global event handlers
   ============================================ */

// Initialize game state
function initGameData() {
    for (let code in STATES) {
        gameData.states[code] = {
            name: STATES[code].name,
            ev: STATES[code].ev,
            lean: STATES[code].lean,
            code: code,
            margin: STATES[code].lean + (Math.random() - 0.5) * 10,
            visited:  false,
            adSpent: 0,
            rallies: 0,
            reportedPct: 0,
            reportedVotes: { D: 0, R: 0 },
            called: false,
            calledFor: null
        };
    }
    console.log("🗳️ Decision 2028 Initialized");
}

// Start game after opponent selection
function startGame() {
    const isThirdParty = Utils.isThirdParty(gameData. selectedParty);
    
    if (isThirdParty) {
        if (! gameData.demTicket. pres || !gameData.demTicket.vp || 
            !gameData.repTicket. pres || !gameData.repTicket.vp) {
            Utils.showToast("Please select both Democratic and Republican tickets");
            return;
        }
    } else if (gameData.selectedParty === 'D') {
        if (!gameData. repTicket.pres || !gameData. repTicket.vp) {
            Utils. showToast("Please select the Republican ticket");
            return;
        }
    } else {
        if (!gameData.demTicket.pres || !gameData. demTicket.vp) {
            Utils. showToast("Please select the Democratic ticket");
            return;
        }
    }
    
    if (isThirdParty) {
        gameData.funds = Math.floor(gameData.funds * 0.5);
        gameData.maxEnergy = Math. max(4, gameData.maxEnergy - 2);
        gameData.energy = gameData.maxEnergy;
    }
    
    Screens.goTo('game-screen');
    Campaign.initMap();
    Campaign.updateHUD();
    Utils.addLog("Campaign begins!  Good luck, " + gameData.candidate.name + "!");
}

// Global app object for HTML onclick handlers
const app = {
    goToScreen: (id) => Screens.goTo(id),
    selParty: (code) => Screens.selectParty(code),
    selCandidate: (id) => Screens.selectCandidate(id),
    selVP: (id) => Screens.selectVP(id),
    selectOpponentCard: (el, party, type) => Screens.selectOpponentCard(el, party, type),
    startGame: () => startGame(),
    handleAction: (action) => Campaign.handleAction(action),
    openStateBio: () => Campaign.openStateBio(),
    nextWeek: () => Campaign.nextWeek(),
    undoLastAction: () => Campaign.undoLastAction(),
    closeCountyView:  () => Campaign.closeCountyView(),
    election: {
        togglePause: () => Election.togglePause(),
        setSpeed: (s) => Election.setSpeed(s),
        setMapMode:  (m) => Election.setMapMode(m),
        closeWinnerOverlay:  () => Election.closeWinnerOverlay()
    }
};

// Initialize on page load
document. addEventListener('DOMContentLoaded', function() {
    initGameData();
});
