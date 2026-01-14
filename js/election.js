/* ============================================
   DECISION 2028 - ELECTION NIGHT
   ============================================ */

var Election = {
    time: 17.5,
    speed: 1,
    paused: false,
    interval: null,
    mapMode: 'leader',
    demEV: 0,
    repEV: 0,
    thirdPartyEV: 0,
    winnerShown: false,
    allVotesCounted: false,

    start: function() {
        var self = this;
        this.time = 17.5;
        this.demEV = 0;
        this.repEV = 0;
        this.thirdPartyEV = 0;
        this.winnerShown = false;
        this.allVotesCounted = false;

        for (var code in gameData.states) {
            var s = gameData.states[code];
            s.reportedPct = 0;
            s.reportedVotes = { D: 0, R: 0, T: 0 };
            s.called = false;
            s.calledFor = null;
            s.countSpeed = 1.0; // Normal speed for most states
            
            // Close margin states count slower
            if (Math.abs(s.margin) < 3) {
                s.countSpeed = 0.6; // 40% slower for entertainment
            }
        }

        document.getElementById('elec-dem-name').innerText = gameData.demTicket.pres ?  gameData.demTicket.pres.name.toUpperCase() : 'DEMOCRAT';
        document.getElementById('elec-rep-name').innerText = gameData.repTicket.pres ? gameData.repTicket.pres.name.toUpperCase() : 'REPUBLICAN';
        document.getElementById('elec-dem-img').src = gameData.demTicket.pres ? gameData.demTicket.pres.img : 'images/scenario.jpg';
        document.getElementById('elec-rep-img').src = gameData.repTicket.pres ? gameData.repTicket.pres.img : 'images/scenario.jpg';

        document.getElementById('election-feed-content').innerHTML = '';
        document.getElementById('race-calls-content').innerHTML = '';

        this.loadElectionMap();
        this.updateDisplay();

        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(function() {
            if (!self.paused) {
                self.tick();
            }
        }, 100);
    },

    tick: function() {
        this.time += 0.005 * this.speed;

        // Check if all votes are counted
        var allCounted = true;
        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (s.reportedPct < 100) {
                allCounted = false;
                break;
            }
        }
        
        if (allCounted && !this.allVotesCounted) {
            this.allVotesCounted = true;
            this.showFinalResults();
        }

        for (var code in gameData.states) {
            var s = gameData.states[code];
            var closeTime = POLL_CLOSE_TIMES[code] || 20;

            if (this.time >= closeTime && !s.called) {
                if (s.reportedPct < 100) {
                    // Apply count speed modifier (slower for close states)
                    var increment = (Math.random() * 1.5 + 0.3) * this.speed * (s.countSpeed || 1.0);
                    s.reportedPct = Math.min(100, s.reportedPct + increment);

                    var totalVotes = s.ev * 120000;
                    
                    // Calculate realistic vote percentages including third parties
                    var thirdPartyPct = 1.5 + (Math.random() * 1.5); // 1.5-3% for third parties
                    
                    // Implement "red mirage" - Republicans do better early, Democrats catch up later
                    var reportingFactor = s.reportedPct / 100;
                    var redMirageEffect = 0;
                    
                    if (reportingFactor < 0.5) {
                        // Early reporting: Republicans +3 to +5 points
                        redMirageEffect = -3 - (Math.random() * 2);
                    } else if (reportingFactor < 0.8) {
                        // Mid reporting: Reduce bonus to +1 to +2
                        redMirageEffect = -1 - (Math.random() * 1);
                    }
                    // After 80%, no red mirage effect
                    
                    var demPct = 50 + s.margin + redMirageEffect + (Math.random() - 0.5) * 3;
                    var repPct = 100 - demPct - thirdPartyPct;
                    
                    // Adjust if negative
                    if (repPct < 0) {
                        thirdPartyPct += repPct;
                        repPct = 0;
                    }
                    if (demPct < 0) {
                        thirdPartyPct += demPct;
                        demPct = 0;
                    }

                    s.reportedVotes.D = Math.floor(totalVotes * (demPct / 100) * (s.reportedPct / 100));
                    s.reportedVotes.R = Math.floor(totalVotes * (repPct / 100) * (s.reportedPct / 100));
                    s.reportedVotes.T = Math.floor(totalVotes * (thirdPartyPct / 100) * (s.reportedPct / 100));
                }

                // Call state at 100% reporting OR if margin is clear enough earlier
                if (!s.called) {
                    var total = s.reportedVotes.D + s.reportedVotes.R;
                    var currentMargin = total > 0 ? ((s.reportedVotes.D - s.reportedVotes.R) / total) * 100 : 0;
                    
                    // MUST call at 100% reporting
                    if (s.reportedPct >= 99.9) {
                        s.called = true;
                        s.calledFor = s.reportedVotes.D > s.reportedVotes.R ? 'D' : 'R';
                        
                        if (s.calledFor === 'D') {
                            this.demEV += s.ev;
                        } else {
                            this.repEV += s.ev;
                        }

                        this.addFeedItem(s.name + ' called for ' + (s.calledFor === 'D' ? 'Democrats' : 'Republicans') + ' (' + s.ev + ' EV)');
                        this.addRaceCall(code, s.calledFor);
                    }
                    // Can call earlier if margin is overwhelming
                    else if (s.reportedPct >= 40) {
                        var threshold = 100 - s.reportedPct;
                        
                        if (Math.abs(currentMargin) > threshold + 8) {
                            s.called = true;
                            s.calledFor = currentMargin > 0 ?  'D' :  'R';

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
        }

        this.updateDisplay();
        this.colorElectionMap();

        // Only show winner overlay when someone reaches 270 and we haven't shown it yet
        if ((this.demEV >= 270 || this.repEV >= 270) && !this.winnerShown && allCounted) {
            this.showWinner();
        }
    },

    updateDisplay: function() {
        document.getElementById('election-time').innerText = Utils.formatTime(this.time);
        document.getElementById('elec-dem-ev').innerText = this.demEV;
        document.getElementById('elec-rep-ev').innerText = this.repEV;

        // Calculate bar widths - 269 is the exact middle (50%)
        // Each EV = (1/538) * 100% of the total width
        var demWidth = (this.demEV / 538) * 100;
        var repWidth = (this.repEV / 538) * 100;
        
        document.getElementById('elec-bar-dem').style.width = demWidth + '%';
        document.getElementById('elec-bar-rep').style.width = repWidth + '%';
        
        // If third parties are enabled and have EVs, show them
        if (gameData.thirdPartiesEnabled && this.thirdPartyEV > 0) {
            var thirdPartyBar = document.getElementById('elec-bar-third');
            if (thirdPartyBar) {
                var thirdWidth = (this.thirdPartyEV / 538) * 100;
                thirdPartyBar.style.width = thirdWidth + '%';
                thirdPartyBar.style.display = 'block';
            }
        }
    },

    loadElectionMap: function() {
        var self = this;
        var wrapper = document.getElementById('election-map-wrapper');
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'map.svg', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');

                if (svg) {
                    svg.id = 'election-map-svg';
                    var paths = svg.querySelectorAll('path');
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var code = path.id;
                        if (code && gameData.states[code]) {
                            path.style.cursor = 'pointer';
                            (function(c) {
                                path.onclick = function() { Election.selectState(c); };
                                path.ondblclick = function(e) {
                                    e.stopPropagation();
                                    // Double-click to open county view during election
                                    if (typeof Counties !== 'undefined') {
                                        Election.openCountyElectionView(c);
                                    }
                                };
                            })(code);
                        }
                    }
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    self.colorElectionMap();
                }
            }
        };
        xhr.send();
    },

    colorElectionMap: function() {
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var path = document.querySelector('#election-map-svg #' + code);
            if (path) {
                if (this.mapMode === 'projected') {
                    if (s.called) {
                        path.style.fill = s.calledFor === 'D' ?  '#00AEF3' : '#E81B23';
                    } else {
                        path.style.fill = '#444444';
                    }
                } else {
                    if (s.reportedPct > 0) {
                        var margin = s.reportedVotes.D - s.reportedVotes.R;
                        var totalVotes = s.reportedVotes.D + s.reportedVotes.R;
                        var pctMargin = totalVotes > 0 ? (margin / totalVotes) * 100 : 0;
                        path.style.fill = Utils.getMarginColor(pctMargin);
                    } else {
                        path.style.fill = '#333333';
                    }
                }
            }
        }
    },

    selectState: function(code) {
        var s = gameData.states[code];
        document.getElementById('election-state-info').classList.remove('hidden');
        document.getElementById('elec-state-name').innerText = s.name;
        document.getElementById('elec-state-ev').innerText = s.ev + ' EV';
        document.getElementById('elec-pct-reporting').innerText = Math.floor(s.reportedPct) + '%';

        var total = s.reportedVotes.D + s.reportedVotes.R;
        var demPct = total > 0 ?  (s.reportedVotes.D / total) * 100 : 50;
        var repPct = total > 0 ? (s.reportedVotes.R / total) * 100 : 50;

        document.getElementById('elec-state-bar-dem').style.width = demPct + '%';
        document.getElementById('elec-state-bar-rep').style.width = repPct + '%';
        document.getElementById('elec-state-dem-votes').innerText = s.reportedVotes.D.toLocaleString();
        document.getElementById('elec-state-rep-votes').innerText = s.reportedVotes.R.toLocaleString();
        document.getElementById('elec-state-dem-pct').innerText = demPct.toFixed(1) + '%';
        document.getElementById('elec-state-rep-pct').innerText = repPct.toFixed(1) + '%';

        var projEl = document.getElementById('elec-projection');
        if (s.called) {
            projEl.innerHTML = '<span class="proj-status ' + (s.calledFor === 'D' ? 'called-dem' : 'called-rep') + '">CALLED FOR ' + (s.calledFor === 'D' ? 'DEMOCRATS' : 'REPUBLICANS') + '</span>';
        } else if (s.reportedPct >= 100) {
            // At 100%, if not called yet (shouldn't happen), show too close to call
            projEl.innerHTML = '<span class="proj-status">TOO CLOSE TO CALL</span>';
        } else if (s.reportedPct > 0) {
            projEl.innerHTML = '<span class="proj-status">TOO CLOSE TO CALL</span>';
        } else {
            projEl.innerHTML = '<span class="proj-status">POLLS NOT CLOSED</span>';
        }
    },

    addFeedItem: function(text) {
        var feed = document.getElementById('election-feed-content');
        var item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = '<span class="feed-time">' + Utils.formatTime(this.time) + '</span><span class="feed-text">' + text + '</span>';
        feed.insertBefore(item, feed.firstChild);
    },

    addRaceCall:  function(code, party) {
        var container = document.getElementById('race-calls-content');
        var chip = document.createElement('span');
        chip.className = 'race-call-chip ' + (party === 'D' ? 'dem' : 'rep');
        chip.innerText = code;
        container.appendChild(chip);
    },

    showWinner: function() {
        this.winnerShown = true;
        var winner = this.demEV >= 270 ?  'D' : 'R';
        var cand = winner === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;

        document.getElementById('winner-img').src = cand ?  cand.img :  'images/scenario.jpg';
        document.getElementById('winner-name').innerText = cand ? cand.name : (winner === 'D' ? 'Democrat' : 'Republican');
        document.getElementById('winner-party').innerText = winner === 'D' ?  'DEMOCRATIC PARTY' : 'REPUBLICAN PARTY';
        document.getElementById('winner-ev-count').innerText = winner === 'D' ? this.demEV :  this.repEV;
        document.getElementById('winner-overlay').classList.remove('hidden');
    },

    showFinalResults: function() {
        // Determine winner
        var winner, loser, winnerEV, loserEV;
        var isPlayerWinner = false;
        
        if (this.demEV > this.repEV) {
            winner = gameData.demTicket;
            loser = gameData.repTicket;
            winnerEV = this.demEV;
            loserEV = this.repEV;
            if (gameData.selectedParty === 'D') isPlayerWinner = true;
        } else {
            winner = gameData.repTicket;
            loser = gameData.demTicket;
            winnerEV = this.repEV;
            loserEV = this.demEV;
            if (gameData.selectedParty === 'R') isPlayerWinner = true;
        }
        
        // Build the final results overlay
        var resultsHTML = '<div class="final-results-content">';
        
        if (isPlayerWinner) {
            resultsHTML += '<div class="result-banner win">🎉 CONGRATULATIONS! 🎉</div>';
            resultsHTML += '<h1 class="result-title">VICTORY!</h1>';
        } else {
            resultsHTML += '<div class="result-banner lose">ELECTION RESULTS</div>';
            resultsHTML += '<h1 class="result-title">DEFEAT</h1>';
        }
        
        // Winner ticket
        resultsHTML += '<div class="result-ticket winner-ticket">';
        resultsHTML += '<div class="ticket-header">PRESIDENT-ELECT</div>';
        resultsHTML += '<div class="ticket-candidates">';
        resultsHTML += '<div class="ticket-pres">';
        resultsHTML += '<img src="' + (winner.pres ? winner.pres.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (winner.pres ? winner.pres.name : 'Candidate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-vp">';
        resultsHTML += '<img src="' + (winner.vp ? winner.vp.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (winner.vp ? winner.vp.name : 'Running Mate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-ev">' + winnerEV + ' Electoral Votes</div>';
        resultsHTML += '</div>';
        
        // Loser ticket
        resultsHTML += '<div class="result-ticket loser-ticket">';
        resultsHTML += '<div class="ticket-header">RUNNER-UP</div>';
        resultsHTML += '<div class="ticket-candidates">';
        resultsHTML += '<div class="ticket-pres">';
        resultsHTML += '<img src="' + (loser.pres ? loser.pres.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (loser.pres ? loser.pres.name : 'Candidate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-vp">';
        resultsHTML += '<img src="' + (loser.vp ? loser.vp.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (loser.vp ? loser.vp.name : 'Running Mate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-ev">' + loserEV + ' Electoral Votes</div>';
        resultsHTML += '</div>';
        
        // Campaign summary
        resultsHTML += '<div class="campaign-summary">';
        resultsHTML += '<h2>CAMPAIGN SUMMARY</h2>';
        
        if (isPlayerWinner) {
            resultsHTML += '<p>After a hard-fought campaign, you have emerged victorious! ';
            resultsHTML += 'Your strategic decisions, tireless campaigning, and connection with voters ';
            resultsHTML += 'across the nation have culminated in this historic win.</p>';
            resultsHTML += '<p>As you prepare to take office, the American people look to you with ';
            resultsHTML += 'hope and expectation. Your journey from candidate to President-elect ';
            resultsHTML += 'has been nothing short of remarkable.</p>';
        } else {
            resultsHTML += '<p>Despite your best efforts, the election has gone to your opponent. ';
            resultsHTML += 'While this outcome is not what you hoped for, you ran a spirited campaign ';
            resultsHTML += 'and made your voice heard across the nation.</p>';
            resultsHTML += '<p>Sometimes victory doesn\'t come on the first try. Take what you\'ve ';
            resultsHTML += 'learned from this experience and consider what you might do differently ';
            resultsHTML += 'in the future.</p>';
        }
        
        resultsHTML += '</div>';
        
        // Buttons
        resultsHTML += '<div class="result-buttons">';
        resultsHTML += '<button class="result-btn" onclick="Election.toggleResultsView()">VIEW ELECTION NIGHT</button>';
        resultsHTML += '<button class="result-btn" onclick="location.reload()">NEW CAMPAIGN</button>';
        resultsHTML += '</div>';
        
        resultsHTML += '</div>';
        
        // Create or update the final results overlay
        var overlay = document.getElementById('final-results-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'final-results-overlay';
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = resultsHTML;
        overlay.classList.remove('hidden');
    },
    
    toggleResultsView: function() {
        var finalResults = document.getElementById('final-results-overlay');
        if (finalResults) {
            finalResults.classList.toggle('hidden');
        }
    },

    closeWinnerOverlay: function() {
        document.getElementById('winner-overlay').classList.add('hidden');
    },

    togglePause: function() {
        this.paused = ! this.paused;
        document.getElementById('btn-pause').innerText = this.paused ? '▶️' : '⏸️';
    },

    setSpeed: function(speed) {
        this.speed = speed;
        // Unpause when setting a new speed
        if (this.paused && speed > 0) {
            this.paused = false;
            document.getElementById('btn-pause').innerText = '⏸️';
        }
        var btns = document.querySelectorAll('.time-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }
        // Highlight the active speed button
        document.getElementById('btn-' + speed + 'x').classList.add('active');
    },

    setMapMode: function(mode) {
        this.mapMode = mode;
        document.getElementById('mode-leader').classList.toggle('active', mode === 'leader');
        document.getElementById('mode-projected').classList.toggle('active', mode === 'projected');
        this.colorElectionMap();
    },

    openCountyElectionView: function(stateCode) {
        // Store the current state for the county view
        gameData.electionCountyViewState = stateCode;
        
        // Show alert for now - county election view would need full implementation
        alert('County-level results for ' + gameData.states[stateCode].name + ' - Feature coming soon!');
        
        // In a full implementation, this would:
        // 1. Load county map SVG
        // 2. Color counties by reported results
        // 3. Show county-level vote counts
        // 4. Keep state sidebar visible
        // 5. Add tooltips on county hover
    }
};
