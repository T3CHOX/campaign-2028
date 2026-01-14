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
            fundraisingVisits: 0,
            lastCampaignDate: null,
            campaignActionsCount: 0
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
    
    // Initialize interest group support for all candidates
    initializeInterestGroupSupport();
    
    Screens.goTo('game-screen');
    Campaign.initMap();
    Campaign.updateHUD();
    Utils.addLog("Campaign begins!  Good luck, " + gameData.candidate.name + "!");
}

// Initialize interest group support percentages for all candidates
function initializeInterestGroupSupport() {
    gameData.interestGroupSupport = {};
    gameData.interestGroupChanges = {};
    
    // Get all candidates running (player, opponents, and third parties)
    var allCandidates = [];
    
    // Player's ticket
    if (gameData.candidate) {
        allCandidates.push({
            id: gameData.candidate.id,
            name: gameData.candidate.name,
            party: gameData.selectedParty
        });
    }
    
    // Democrat ticket
    if (gameData.demTicket.pres && gameData.selectedParty !== 'D') {
        allCandidates.push({
            id: gameData.demTicket.pres.id,
            name: gameData.demTicket.pres.name,
            party: 'D'
        });
    }
    
    // Republican ticket
    if (gameData.repTicket.pres && gameData.selectedParty !== 'R') {
        allCandidates.push({
            id: gameData.repTicket.pres.id,
            name: gameData.repTicket.pres.name,
            party: 'R'
        });
    }
    
    // Always include Jill Stein (Green) and Chase Oliver (Libertarian) as third parties
    allCandidates.push({
        id: 'stein',
        name: 'Jill Stein',
        party: 'G'
    });
    allCandidates.push({
        id: 'oliver',
        name: 'Chase Oliver',
        party: 'L'
    });
    
    // For each interest group, calculate initial support for each candidate
    if (typeof INTEREST_GROUPS === 'undefined') {
        console.warn('INTEREST_GROUPS not defined, skipping initialization');
        return;
    }
    
    for (var groupId in INTEREST_GROUPS) {
        var group = INTEREST_GROUPS[groupId];
        gameData.interestGroupSupport[groupId] = {};
        gameData.interestGroupChanges[groupId] = {};
        
        var totalSupport = 0;
        var supportValues = [];
        
        // Calculate base support for each candidate
        for (var i = 0; i < allCandidates.length; i++) {
            var cand = allCandidates[i];
            var baseSupport = 25; // Start with equal base
            
            // Apply group baseline lean (convert to support)
            if (cand.party === 'D') {
                baseSupport += Math.max(-group.baseline * 3, 0);
            } else if (cand.party === 'R') {
                baseSupport += Math.max(group.baseline * 3, 0);
            } else {
                baseSupport = baseSupport * 0.3; // Third parties get much less support
            }
            
            // Apply candidate-specific modifiers
            if (typeof CANDIDATE_GROUP_MODIFIERS !== 'undefined' && CANDIDATE_GROUP_MODIFIERS[cand.id] && CANDIDATE_GROUP_MODIFIERS[cand.id][groupId]) {
                baseSupport += CANDIDATE_GROUP_MODIFIERS[cand.id][groupId];
            }
            
            supportValues.push({ candId: cand.id, support: Math.max(baseSupport, 0.1) });
            totalSupport += Math.max(baseSupport, 0.1);
        }
        
        // Normalize to 100%
        for (var j = 0; j < supportValues.length; j++) {
            var pct = (supportValues[j].support / totalSupport) * 100;
            gameData.interestGroupSupport[groupId][supportValues[j].candId] = pct;
            gameData.interestGroupChanges[groupId][supportValues[j].candId] = 0; // No change initially
        }
    }
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
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        document.getElementById('issues-modal').classList.remove('hidden');
        this.renderIssuesPanel();
    },
    closeIssuesPanel: function() {
        document.getElementById('issues-modal').classList.add('hidden');
    },
    renderIssuesPanel: function() {
        var showThirdParty = document.getElementById('show-third-party-toggle').checked;
        var state = gameData.states[gameData.selectedState];
        var stateCode = gameData.selectedState;
        
        document.getElementById('issues-modal-title').innerText = 'ISSUE POSITIONS - ' + state.name;
        
        var issuesHtml = '';
        var categories = ['Economic', 'Social', 'Healthcare', 'Environment', 'Foreign', 'Governance'];
        
        for (var c = 0; c < categories.length; c++) {
            var category = categories[c];
            var categoryIssues = CORE_ISSUES.filter(function(issue) {
                return issue.category === category;
            });
            
            if (categoryIssues.length > 0) {
                issuesHtml += '<div class="issue-category-header">' + category + '</div>';
                
                for (var i = 0; i < categoryIssues.length; i++) {
                    var issue = categoryIssues[i];
                    var isLocked = gameData.lockedIssues && gameData.lockedIssues[issue.id];
                    
                    issuesHtml += '<div class="issue-item">';
                    issuesHtml += '<h3>' + issue.name;
                    if (isLocked) {
                        issuesHtml += ' <span class="pac-locked-badge">LOCKED</span>';
                    }
                    issuesHtml += '</h3>';
                    issuesHtml += '<div class="issue-scale">';
                    
                    // Get positions
                    var statePos = (STATE_ISSUE_POSITIONS[stateCode] && STATE_ISSUE_POSITIONS[stateCode][issue.id]) || 0;
                    var playerPos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issue.id]) || 0;
                    
                    // Convert positions from -10 to +10 to percentage for positioning
                    var stateLeft = ((statePos + 10) / 20) * 100;
                    var playerLeft = ((playerPos + 10) / 20) * 100;
                    
                    // State marker
                    issuesHtml += '<div class="issue-marker state" style="left: ' + stateLeft + '%" title="' + state.name + ' voters: ' + statePos + '"></div>';
                    
                    // Player marker
                    var playerColor = gameData.selectedParty === 'D' ? 'dem' : (gameData.selectedParty === 'R' ? 'rep' : '');
                    issuesHtml += '<div class="issue-marker player ' + playerColor + '" style="left: ' + playerLeft + '%" title="Your position: ' + playerPos + '"></div>';
                    
                    // ALWAYS show Democrat and Republican positions
                    var demPos = (gameData.demTicket.pres && gameData.demTicket.pres.issuePositions && gameData.demTicket.pres.issuePositions[issue.id]) || 0;
                    var repPos = (gameData.repTicket.pres && gameData.repTicket.pres.issuePositions && gameData.repTicket.pres.issuePositions[issue.id]) || 0;
                    
                    // Show Democrat position (unless player is Democrat)
                    if (gameData.selectedParty !== 'D') {
                        var demLeft = ((demPos + 10) / 20) * 100;
                        issuesHtml += '<div class="issue-marker dem" style="left: ' + demLeft + '%" title="Democrat: ' + demPos + '"></div>';
                    }
                    
                    // Show Republican position (unless player is Republican)
                    if (gameData.selectedParty !== 'R') {
                        var repLeft = ((repPos + 10) / 20) * 100;
                        issuesHtml += '<div class="issue-marker rep" style="left: ' + repLeft + '%" title="Republican: ' + repPos + '"></div>';
                    }
                    
                    // Show OTHER third party candidates only when toggle is on
                    if (showThirdParty) {
                        // If player is third party, show their position as player marker already
                        // So we don't need to show it again here
                        
                        // For now, this is where we'd add other third party candidates
                        // that are NOT the player, Democrat, or Republican
                    }
                    
                    issuesHtml += '</div>'; // close issue-scale
                    issuesHtml += '<div class="issue-labels"><span>Progressive (-10)</span><span>Center (0)</span><span>Conservative (+10)</span></div>';
                    
                    // Add shift position button if not locked
                    if (!isLocked) {
                        issuesHtml += '<div style="margin-top: 10px; text-align: center;">';
                        issuesHtml += '<button class="speech-issue-btn" style="padding: 8px 15px; display: inline-block; width: auto;" onclick="app.shiftIssuePosition(\'' + issue.id + '\')">Shift Position</button>';
                        issuesHtml += '</div>';
                    }
                    
                    issuesHtml += '</div>'; // close issue-item
                }
            }
        }
        
        document.getElementById('issues-scales').innerHTML = issuesHtml;
    },
    openNationalOverview: function() {
        document.getElementById('national-modal').classList.remove('hidden');
        this.renderNationalOverview();
    },
    closeNationalOverview: function() {
        document.getElementById('national-modal').classList.add('hidden');
    },
    renderNationalOverview: function() {
        // Calculate popular vote
        var totalVotes = { D: 0, R: 0, other: 0 };
        var tossupStates = [];
        
        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (Math.abs(s.margin) < 3) {
                tossupStates.push(s);
            }
            
            // Rough popular vote calculation based on state population and margins
            var stateVotes = s.ev * 500000; // Rough estimate
            if (s.margin > 0) {
                totalVotes.D += stateVotes * (0.5 + s.margin / 100);
                totalVotes.R += stateVotes * (0.5 - s.margin / 100);
            } else {
                totalVotes.R += stateVotes * (0.5 + Math.abs(s.margin) / 100);
                totalVotes.D += stateVotes * (0.5 - Math.abs(s.margin) / 100);
            }
        }
        
        var total = totalVotes.D + totalVotes.R + totalVotes.other;
        var demPct = (totalVotes.D / total * 100).toFixed(1);
        var repPct = (totalVotes.R / total * 100).toFixed(1);
        
        document.getElementById('popular-vote-display').innerHTML = 
            '<div class="vote-row"><span style="color: #00AEF3;">Democrat</span><span>' + demPct + '%</span></div>' +
            '<div class="vote-row"><span style="color: #E81B23;">Republican</span><span>' + repPct + '%</span></div>';
        
        // Electoral projection
        var demEV = 0, repEV = 0;
        for (var code2 in gameData.states) {
            var state = gameData.states[code2];
            if (state.margin > 0) demEV += state.ev;
            else repEV += state.ev;
        }
        
        document.getElementById('electoral-projection-display').innerHTML = 
            '<div class="vote-row"><span style="color: #00AEF3;">Democrat</span><span>' + demEV + ' EV</span></div>' +
            '<div class="vote-row"><span style="color: #E81B23;">Republican</span><span>' + repEV + ' EV</span></div>' +
            '<div style="margin-top: 15px; text-align: center; font-size: 1.1rem; color: #ffd700;">Needed to Win: 270 EV</div>';
        
        // Toss-up states
        var tossupHtml = '';
        if (tossupStates.length === 0) {
            tossupHtml = '<div style="text-align: center; color: #666;">No toss-up states</div>';
        } else {
            for (var i = 0; i < tossupStates.length; i++) {
                tossupHtml += '<span class="tossup-state-item">' + tossupStates[i].name + ' (' + tossupStates[i].ev + ')</span>';
            }
        }
        document.getElementById('tossup-states-list').innerHTML = tossupHtml;
    },
    openSpeechModal: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        
        var state = gameData.states[gameData.selectedState];
        var stateCode = gameData.selectedState;
        
        // Get top issues for the state
        var issueSource = CORE_ISSUES;
        var issuesHtml = '';
        
        for (var i = 0; i < issueSource.length; i++) {
            var issue = issueSource[i];
            var statePos = (STATE_ISSUE_POSITIONS[stateCode] && STATE_ISSUE_POSITIONS[stateCode][issue.id]) || 0;
            var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issue.id]) || 0;
            var alignment = 1 - (Math.abs(statePos - candidatePos) / 20);
            
            var alignmentText = '';
            var alignmentClass = '';
            if (alignment > 0.7) {
                alignmentText = 'Excellent alignment with ' + state.name + ' voters';
                alignmentClass = 'good';
            } else if (alignment > 0.4) {
                alignmentText = 'Good alignment with ' + state.name + ' voters';
                alignmentClass = 'good';
            } else {
                alignmentText = 'Weak alignment with ' + state.name + ' voters';
                alignmentClass = 'poor';
            }
            
            issuesHtml += '<button class="speech-issue-btn" onclick="Campaign.handleSpeech(\'' + issue.id + '\')">';
            issuesHtml += issue.name;
            issuesHtml += '<span class="issue-alignment ' + alignmentClass + '">' + alignmentText + '</span>';
            issuesHtml += '</button>';
        }
        
        document.getElementById('speech-issues-list').innerHTML = issuesHtml;
        document.getElementById('speech-modal').classList.remove('hidden');
    },
    closeSpeechModal: function() {
        document.getElementById('speech-modal').classList.add('hidden');
    },
    // PAC Endorsement System
    triggerPacOffer: function() {
        if (typeof PACS === 'undefined') return;
        
        // Don't offer if we already have too many endorsements
        if (gameData.pacEndorsements.length >= 3) return;
        
        // Random chance to trigger PAC offer during gameplay
        var pacKeys = Object.keys(PACS);
        var eligiblePacs = [];
        
        for (var i = 0; i < pacKeys.length; i++) {
            var pacId = pacKeys[i];
            var pac = PACS[pacId];
            
            // Check if already endorsed
            var alreadyEndorsed = false;
            for (var j = 0; j < gameData.pacEndorsements.length; j++) {
                if (gameData.pacEndorsements[j] === pacId) {
                    alreadyEndorsed = true;
                    break;
                }
            }
            
            if (!alreadyEndorsed) {
                // Check alignment with candidate position
                var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[pac.priority_issue]) || 0;
                var alignment = 1 - (Math.abs(candidatePos - pac.desired_position) / 20);
                
                // PAC will only offer if alignment is reasonable (>40%)
                if (alignment > 0.4) {
                    eligiblePacs.push(pacId);
                }
            }
        }
        
        if (eligiblePacs.length > 0) {
            // Select random eligible PAC
            var selectedPac = eligiblePacs[Math.floor(Math.random() * eligiblePacs.length)];
            gameData.currentPacOffer = selectedPac;
            this.showPacOffer(selectedPac);
        }
    },
    showPacOffer: function(pacId) {
        var pac = PACS[pacId];
        if (!pac) return;
        
        var issue = CORE_ISSUES.find(function(i) { return i.id === pac.priority_issue; });
        var issueName = issue ? issue.name : pac.priority_issue;
        
        var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[pac.priority_issue]) || 0;
        
        var html = '';
        html += '<div class="pac-detail-item">';
        html += '<strong>' + pac.name + '</strong>';
        html += '<p>' + pac.description + '</p>';
        html += '</div>';
        
        html += '<div class="pac-detail-item">';
        html += '<strong>Contribution: $' + pac.contribution + 'M</strong>';
        html += '<p>One-time campaign contribution</p>';
        html += '</div>';
        
        html += '<div class="pac-detail-item">';
        html += '<strong>Key Issue: ' + issueName + '</strong>';
        html += '<p>Your current position: ' + candidatePos + ' | Required position: ' + pac.desired_position + '</p>';
        html += '</div>';
        
        html += '<div class="pac-warning">';
        html += '<strong>⚠️ WARNING</strong>';
        html += '<p>Accepting this endorsement will LOCK your position on ' + issueName + '. You will not be able to shift your stance on this issue for the rest of the campaign.</p>';
        html += '<p>Declining will allow your opponent to receive this endorsement instead.</p>';
        html += '</div>';
        
        document.getElementById('pac-details').innerHTML = html;
        document.getElementById('pac-modal').classList.remove('hidden');
    },
    acceptPacEndorsement: function() {
        if (!gameData.currentPacOffer) return;
        
        var pac = PACS[gameData.currentPacOffer];
        
        // Add endorsement
        gameData.pacEndorsements.push(gameData.currentPacOffer);
        
        // Lock issue
        gameData.lockedIssues[pac.priority_issue] = true;
        
        // Add funds
        gameData.funds += pac.contribution;
        
        // Update candidate position to match PAC requirement (slight adjustment if needed)
        var candidatePos = gameData.candidate.issuePositions[pac.priority_issue] || 0;
        var positionDiff = Math.abs(candidatePos - pac.desired_position);
        if (positionDiff > 2) {
            // Move position closer to PAC requirement
            gameData.candidate.issuePositions[pac.priority_issue] = pac.desired_position;
        }
        
        Utils.addLog('Accepted endorsement from ' + pac.name + ' (+$' + pac.contribution + 'M)');
        Utils.showToast('PAC Endorsement: +$' + pac.contribution + 'M!');
        
        Campaign.updateHUD();
        this.closePacModal();
        gameData.currentPacOffer = null;
    },
    declinePacEndorsement: function() {
        if (!gameData.currentPacOffer) return;
        
        var pac = PACS[gameData.currentPacOffer];
        
        // Give endorsement to opponent (simplified - just log it)
        Utils.addLog('Declined ' + pac.name + ' endorsement. Opponent may receive it.');
        
        this.closePacModal();
        gameData.currentPacOffer = null;
    },
    closePacModal: function() {
        document.getElementById('pac-modal').classList.add('hidden');
    },
    // Issue Shift Mechanic
    shiftIssuePosition: function(issueId) {
        // Check if issue is locked
        if (gameData.lockedIssues && gameData.lockedIssues[issueId]) {
            Utils.showToast("This issue is locked by a PAC endorsement!");
            return;
        }
        
        var issue = CORE_ISSUES.find(function(i) { return i.id === issueId; });
        if (!issue) return;
        
        var currentPos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issueId]) || 0;
        
        // Prompt for new position
        var newPosStr = prompt("Shift your position on " + issue.name + "\nCurrent: " + currentPos + "\nEnter new position (-10 to +10):", currentPos);
        
        if (newPosStr === null) return; // User cancelled
        
        var newPos = parseFloat(newPosStr);
        
        if (isNaN(newPos) || newPos < -10 || newPos > 10) {
            Utils.showToast("Invalid position! Must be between -10 and +10");
            return;
        }
        
        var shift = Math.abs(newPos - currentPos);
        
        if (shift < 1) {
            Utils.showToast("Position shift too small!");
            return;
        }
        
        // Calculate credibility penalty using constant
        var credibilityPenalty = shift * GAME_CONSTANTS.CREDIBILITY_PENALTY_MULTIPLIER;
        
        // Apply debuff to all states
        for (var code in gameData.states) {
            if (gameData.selectedParty === 'D') {
                gameData.states[code].margin -= credibilityPenalty;
            } else if (gameData.selectedParty === 'R') {
                gameData.states[code].margin += credibilityPenalty;
            }
        }
        
        // Update position
        if (!gameData.candidate.issuePositions) {
            gameData.candidate.issuePositions = {};
        }
        gameData.candidate.issuePositions[issueId] = newPos;
        
        Utils.addLog("Shifted position on " + issue.name + " to " + newPos + " (credibility penalty: -" + credibilityPenalty.toFixed(1) + ")");
        Utils.showToast("Position shifted! Credibility penalty applied.");
        
        Campaign.colorMap();
        this.renderIssuesPanel();
    },
    
    openInterestGroups: function() {
        document.getElementById('interest-groups-modal').classList.remove('hidden');
        this.renderInterestGroups('all');
    },
    
    closeInterestGroups: function() {
        document.getElementById('interest-groups-modal').classList.add('hidden');
    },
    
    countyRally: function() {
        if (!gameData.selectedCounty) {
            Utils.showToast("Select a county first!");
            return;
        }
        Counties.rallyInCounty(gameData.selectedCounty);
    },
    
    countySpeech: function() {
        if (!gameData.selectedCounty) {
            Utils.showToast("Select a county first!");
            return;
        }
        // Open speech modal for county-specific campaigning
        Counties.openCountySpeechModal(gameData.selectedCounty);
    },
    
    filterInterestGroups: function(category) {
        // Update active tab
        var tabs = document.querySelectorAll('.ig-tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
            if (tabs[i].getAttribute('data-category') === category) {
                tabs[i].classList.add('active');
            }
        }
        this.renderInterestGroups(category);
    },
    
    renderInterestGroups: function(category) {
        var html = '';
        
        if (category === 'pacs') {
            // Show PACs & Special Interest Groups section
            html += '<div class="ig-main-section-title">PAC\'S & SPECIAL INTEREST GROUPS</div>';
            html += '<div class="pacs-grid">';
            
            for (var pacId in PACS) {
                var pac = PACS[pacId];
                html += '<div class="pac-card">';
                
                // Placeholder for logo/image
                html += '<div class="ig-logo-placeholder">📊</div>';
                
                html += '<div class="pac-name">' + pac.name + '</div>';
                html += '<div class="pac-desc">' + pac.description + '</div>';
                
                // Show candidate support if available
                if (gameData.interestGroupSupport && gameData.interestGroupSupport[pacId]) {
                    html += '<div class="pac-support">';
                    html += this.renderCandidateSupport(pacId);
                    html += '</div>';
                }
                
                html += '<div class="pac-details">';
                html += '<div><strong>Priority Issue:</strong> ' + (pac.priority_issue || 'Various') + '</div>';
                html += '<div><strong>Contribution:</strong> $' + pac.contribution + 'M</div>';
                html += '</div>';
                html += '</div>';
            }
            
            html += '</div>';
        } else {
            // Show Voter Blocks section
            html += '<div class="ig-main-section-title">VOTER BLOCKS</div>';
            
            // Group interest groups by category for organized display
            var groupedByCategory = {};
            for (var groupId in INTEREST_GROUPS) {
                var group = INTEREST_GROUPS[groupId];
                
                if (category !== 'all' && group.category !== category) {
                    continue;
                }
                
                if (!groupedByCategory[group.category]) {
                    groupedByCategory[group.category] = [];
                }
                groupedByCategory[group.category].push({ id: groupId, group: group });
            }
            
            // Render each category
            for (var cat in groupedByCategory) {
                html += '<div class="ig-section-title">' + cat + '</div>';
                html += '<div class="ig-cards-container">';
                
                var groups = groupedByCategory[cat];
                for (var i = 0; i < groups.length; i++) {
                    var groupId = groups[i].id;
                    var group = groups[i].group;
                    
                    html += '<div class="ig-card">';
                    
                    // Placeholder for logo/image
                    html += '<div class="ig-logo-placeholder">👥</div>';
                    
                    html += '<div class="ig-name">' + group.name + '</div>';
                    
                    // Show candidate support
                    if (gameData.interestGroupSupport && gameData.interestGroupSupport[groupId]) {
                        html += '<div class="ig-support">';
                        html += this.renderCandidateSupport(groupId);
                        html += '</div>';
                    }
                    
                    html += '</div>';
                }
                
                html += '</div>';
            }
        }
        
        document.getElementById('interest-groups-grid').innerHTML = html;
    },
    
    // Helper function to render candidate support for a group
    renderCandidateSupport: function(groupId) {
        var html = '';
        
        if (!gameData.interestGroupSupport || !gameData.interestGroupSupport[groupId]) {
            return html;
        }
        
        var groupSupport = gameData.interestGroupSupport[groupId];
        var groupChanges = gameData.interestGroupChanges[groupId] || {};
        
        // Get all candidates with their support values
        var candidates = [];
        for (var candId in groupSupport) {
            var candInfo = this.getCandidateInfo(candId);
            if (candInfo) {
                candidates.push({
                    id: candId,
                    name: candInfo.name,
                    party: candInfo.party,
                    support: groupSupport[candId],
                    change: groupChanges[candId] || 0
                });
            }
        }
        
        // Sort by support descending
        candidates.sort(function(a, b) { return b.support - a.support; });
        
        // Find max support for underlining
        var maxSupport = candidates.length > 0 ? candidates[0].support : 0;
        
        // Render each candidate
        for (var i = 0; i < candidates.length; i++) {
            var cand = candidates[i];
            var partyColor = this.getPartyColor(cand.party);
            var isLeader = (Math.abs(cand.support - maxSupport) < 0.01);
            
            html += '<div class="candidate-support-row">';
            
            // Candidate image in circle
            html += '<img src="images/' + cand.id + '.jpg" class="candidate-support-img" onerror="this.src=\'images/scenario.jpg\'">';
            
            // Candidate name and support percentage (party colored)
            var nameStyle = 'color: ' + partyColor + ';';
            if (isLeader) {
                nameStyle += ' text-decoration: underline;';
            }
            html += '<span class="candidate-support-name" style="' + nameStyle + '">' + cand.name + ': </span>';
            
            // Support percentage (party colored, underlined if leader)
            var supportStyle = 'color: ' + partyColor + ';';
            if (isLeader) {
                supportStyle += ' text-decoration: underline; font-weight: bold;';
            }
            html += '<span class="candidate-support-pct" style="' + supportStyle + '">' + cand.support.toFixed(1) + '%</span>';
            
            // Change indicator (very small, color coded)
            if (cand.change !== 0) {
                var changeColor = cand.change > 0 ? '#00ff00' : (cand.change < 0 ? '#ff0000' : '#ffff00');
                var changeText = (cand.change > 0 ? '+' : '') + cand.change.toFixed(2);
                html += ' <span class="candidate-support-change" style="color: ' + changeColor + '; font-size: 0.65em;">(' + changeText + ')</span>';
            }
            
            html += '</div>';
        }
        
        return html;
    },
    
    // Helper to get candidate info
    getCandidateInfo: function(candId) {
        // Check player
        if (gameData.candidate && gameData.candidate.id === candId) {
            return {
                name: gameData.candidate.name,
                party: gameData.selectedParty
            };
        }
        
        // Check democrat ticket
        if (gameData.demTicket.pres && gameData.demTicket.pres.id === candId) {
            return {
                name: gameData.demTicket.pres.name,
                party: 'D'
            };
        }
        
        // Check republican ticket
        if (gameData.repTicket.pres && gameData.repTicket.pres.id === candId) {
            return {
                name: gameData.repTicket.pres.name,
                party: 'R'
            };
        }
        
        // Check if it's a third party candidate
        if (candId === 'stein') {
            return { name: 'Jill Stein', party: 'G' };
        }
        if (candId === 'oliver') {
            return { name: 'Chase Oliver', party: 'L' };
        }
        
        // Fallback - check CANDIDATES array
        for (var i = 0; i < CANDIDATES.length; i++) {
            if (CANDIDATES[i].id === candId) {
                return {
                    name: CANDIDATES[i].name,
                    party: CANDIDATES[i].party
                };
            }
        }
        
        return null;
    },
    
    // Helper to get party color
    getPartyColor: function(party) {
        var colors = {
            'D': '#00AEF3',
            'R': '#E81B23',
            'G': '#198754',
            'L': '#fd7e14',
            'F': '#F2C75C'
        };
        return colors[party] || '#888';
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
