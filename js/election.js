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

        // Initialize county-level reporting data
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                county.reportedPct = 0;
                county.reportedVotes = { D: 0, R: 0, T: 0 };
            }
        }

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

        // Update county-level vote counts for each state's counties
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var code in gameData.states) {
                var s = gameData.states[code];
                var closeTime = POLL_CLOSE_TIMES[code] || 20;
                
                // Counties begin reporting when state's polls close
                if (this.time >= closeTime) {
                    var stateFips = STATES[code] ? STATES[code].fips : null;
                    if (!stateFips) continue;
                    
                    // Update each county in this state
                    for (var fips in Counties.countyData) {
                        var normalizedFips = Counties.normalizeFips(fips);
                        var paddedFips = fips.padStart(5, '0');
                        if (paddedFips.substring(0, 2) === stateFips) {
                            var county = Counties.countyData[fips];
                            
                            if (county.reportedPct < 100) {
                                // Base reporting rate with randomness
                                var baseIncrement = (Math.random() * 1.5 + 0.3) * this.speed * (s.countSpeed || 1.0);
                                
                                // CATCH-UP LOGIC: Force completion as time progresses
                                var catchUpMultiplier = 1.0;
                                if (this.time > 24) {
                                    // After 6.5 hours (11:30 PM), accelerate slow counties
                                    catchUpMultiplier = 1.5;
                                }
                                if (this.time > 25) {
                                    // After 7.5 hours (12:30 AM), accelerate more
                                    catchUpMultiplier = 3.0;
                                }
                                if (this.time > 26) {
                                    // After 8.5 hours (1:30 AM), force completion
                                    catchUpMultiplier = 10.0;
                                }
                                
                                var increment = baseIncrement * catchUpMultiplier;
                                county.reportedPct = Math.min(100, county.reportedPct + increment);
                                
                                // Force to 100% if very close
                                if (county.reportedPct > 99.5) {
                                    county.reportedPct = 100;
                                }
                                
                                // GUARANTEE 100%: Force completion after extended time
                                if (this.time > 27) {
                                    county.reportedPct = 100;
                                }
                                
                                // Calculate county reported votes with margin of error
                                if (county.v) {
                                    var demTurnout = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
                                    var repTurnout = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
                                    
                                    // Add margin of error (-3% to +3%) - only calculated once at 100%
                                    if (!county.marginOfError) {
                                        county.marginOfError = (Math.random() - 0.5) * 6; // -3% to +3%
                                    }
                                    
                                    var reportingFactor = county.reportedPct / 100;
                                    var errorFactor = 1.0 + (county.marginOfError / 100);
                                    
                                    // Calculate undecided-adjusted percentages
                                    var undecidedPct = county.undecided || 0;
                                    var decidedMultiplier = (100 - undecidedPct) / 100;
                                    
                                    county.reportedVotes.D = Math.floor((county.v.D || 0) * county.p / 100 * decidedMultiplier * demTurnout * reportingFactor * errorFactor);
                                    county.reportedVotes.R = Math.floor((county.v.R || 0) * county.p / 100 * decidedMultiplier * repTurnout * reportingFactor * errorFactor);
                                    county.reportedVotes.T = 0; // Third party votes minimal at county level for simplicity
                                }
                            }
                        }
                    }
                    
                    // Aggregate county votes to get state totals
                    this.aggregateCountyVotes(code);
                }
            }
        }

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

        // Call states based on results
        for (var code in gameData.states) {
            var s = gameData.states[code];
            
            if (!s.called && s.reportedPct > 0) {
                var total = s.reportedVotes.D + s.reportedVotes.R;
                var currentMargin = total > 0 ? ((s.reportedVotes.D - s.reportedVotes.R) / total) * 100 : 0;
                
                // Check if it's a VERY close call (< 0.5% margin per requirements)
                var isVeryCloseCall = Math.abs(s.margin) < 0.5;
                // Check if it's a close call (< 1.0% margin)
                var isCloseCall = Math.abs(s.margin) < 1.0;
                
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
                // VERY close calls (< 0.5%): Don't call until at least 98% reporting
                else if (isVeryCloseCall && s.reportedPct >= 98) {
                    s.called = true;
                    s.calledFor = currentMargin > 0 ?  'D' :  'R';

                    if (s.calledFor === 'D') {
                        this.demEV += s.ev;
                    } else {
                        this.repEV += s.ev;
                    }

                    this.addFeedItem(s.name + ' called for ' + (s.calledFor === 'D' ? 'Democrats' : 'Republicans') + ' (' + s.ev + ' EV) [EXTREMELY CLOSE]');
                    this.addRaceCall(code, s.calledFor);
                }
                // Close calls (0.5-1.0%): Don't call until at least 95% reporting
                else if (isCloseCall && !isVeryCloseCall && s.reportedPct >= 95) {
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
                // Can call earlier if margin is overwhelming (not close)
                else if (!isCloseCall && s.reportedPct >= 40) {
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

        this.updateDisplay();
        this.colorElectionMap();

        // Show winner overlay when someone reaches 270 and ALL votes are counted
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

    aggregateCountyVotes: function(stateCode) {
        // Aggregate all county votes for a state to get state totals
        var state = gameData.states[stateCode];
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) return;
        
        var totalDem = 0;
        var totalRep = 0;
        var totalT = 0;
        var totalReportedPct = 0;
        var countyCount = 0;
        
        for (var fips in Counties.countyData) {
            var normalizedFips = Counties.normalizeFips(fips);
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                totalDem += county.reportedVotes.D || 0;
                totalRep += county.reportedVotes.R || 0;
                totalT += county.reportedVotes.T || 0;
                totalReportedPct += county.reportedPct || 0;
                countyCount++;
            }
        }
        
        state.reportedVotes.D = totalDem;
        state.reportedVotes.R = totalRep;
        state.reportedVotes.T = totalT;
        
        // State reporting percentage is average of county reporting percentages
        state.reportedPct = countyCount > 0 ? totalReportedPct / countyCount : 0;
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
    
    skipToEnd: function() {
        // Instantly complete all vote counting at county level
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                county.reportedPct = 100;
                
                // Calculate final county votes with turnout
                if (county.v) {
                    var demTurnout = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
                    var repTurnout = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
                    
                    county.reportedVotes.D = Math.floor((county.v.D || 0) * demTurnout);
                    county.reportedVotes.R = Math.floor((county.v.R || 0) * repTurnout);
                    county.reportedVotes.T = 0;
                }
            }
        }
        
        // Aggregate county votes to states
        for (var code in gameData.states) {
            this.aggregateCountyVotes(code);
            
            var s = gameData.states[code];
            
            // Call the state if not already called
            if (!s.called) {
                s.called = true;
                s.calledFor = s.reportedVotes.D > s.reportedVotes.R ? 'D' : 'R';
                
                if (s.calledFor === 'D') {
                    this.demEV += s.ev;
                } else {
                    this.repEV += s.ev;
                }
            }
        }
        
        // Advance time to end
        this.time = 26;
        
        // Update display and show final results
        this.updateDisplay();
        this.colorElectionMap();
        
        // Mark all votes as counted and show results
        if (!this.allVotesCounted) {
            this.allVotesCounted = true;
            this.showFinalResults();
        }
    },

    openCountyElectionView: function(stateCode) {
        // Store the current state for the county view
        gameData.electionCountyViewState = stateCode;
        var state = gameData.states[stateCode];
        var self = this;
        
        // Create a modal overlay for county results
        var overlay = document.getElementById('county-election-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'county-election-overlay';
            overlay.className = 'modal-overlay';
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px;';
            document.body.appendChild(overlay);
        }
        
        // Build county results content with SVG map
        var html = '<div style="background: #1e1e1e; border: 2px solid #ffd700; border-radius: 10px; padding: 30px; max-width: 95%; max-height: 95%; overflow-y: auto;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #444; padding-bottom: 15px;">';
        html += '<h2 style="margin: 0; color: #ffd700;">' + state.name + ' - COUNTY RESULTS</h2>';
        html += '<button onclick="Election.closeCountyElectionView()" style="background: #444; border: none; color: white; padding: 8px 20px; cursor: pointer; border-radius: 4px; font-weight: bold;">CLOSE</button>';
        html += '</div>';
        
        // Show overall state results
        html += '<div style="background: #252525; padding: 15px; border-radius: 6px; margin-bottom: 20px;">';
        html += '<div style="text-align: center; font-size: 0.9rem; color: #888; margin-bottom: 10px;">' + Math.floor(state.reportedPct) + '% Reporting</div>';
        
        var total = state.reportedVotes.D + state.reportedVotes.R;
        var demPct = total > 0 ? (state.reportedVotes.D / total) * 100 : 50;
        var repPct = total > 0 ? (state.reportedVotes.R / total) * 100 : 50;
        
        html += '<div style="height: 30px; background: #333; border-radius: 4px; display: flex; overflow: hidden; margin-bottom: 10px;">';
        html += '<div style="width: ' + demPct + '%; background: #00AEF3;"></div>';
        html += '<div style="width: ' + repPct + '%; background: #E81B23;"></div>';
        html += '</div>';
        
        html += '<div style="display: flex; justify-content: space-between; font-size: 1.1rem;">';
        html += '<span style="color: #00AEF3; font-weight: bold;">' + demPct.toFixed(1) + '%</span>';
        html += '<span style="color: #E81B23; font-weight: bold;">' + repPct.toFixed(1) + '%</span>';
        html += '</div>';
        html += '</div>';
        
        // Interactive County SVG Map
        html += '<div style="background: #252525; padding: 15px; border-radius: 6px; margin-bottom: 20px;">';
        html += '<h3 style="margin: 0 0 15px 0; color: #ccc;">Interactive County Map</h3>';
        html += '<div id="county-election-map-wrapper" style="width: 100%; height: 500px; display: flex; justify-content: center; align-items: center; background: #1a1a1a; border-radius: 4px;">';
        html += '<div style="color: #888;">Loading county map...</div>';
        html += '</div>';
        html += '</div>';
        
        html += '</div>';
        
        overlay.innerHTML = html;
        overlay.style.display = 'flex';
        
        // Load county SVG map for the state
        setTimeout(function() {
            self.loadCountyElectionMap(stateCode);
        }, 100);
    },
    
    loadCountyElectionMap: function(stateCode) {
        var self = this;
        var wrapper = document.getElementById('county-election-map-wrapper');
        if (!wrapper) return;
        
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) {
            wrapper.innerHTML = '<div style="color: #888;">No county map available for this state</div>';
            return;
        }
        
        // Load the full US county map and filter to show only this state's counties
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/uscountymap.svg', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');
                
                if (svg) {
                    svg.id = 'county-election-map-svg';
                    svg.style.width = '100%';
                    svg.style.height = '100%';
                    
                    // Filter and color counties for this state
                    var paths = svg.querySelectorAll('path');
                    var countyCount = 0;
                    var stateCountyPaths = [];
                    
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var pathId = path.id;
                        
                        // County IDs in SVG are like "c01001" where 01 is state FIPS
                        if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                            var fips = pathId.substring(1); // Remove the 'c' prefix
                            var countyStateFips = fips.length === 5 ? fips.substring(0, 2) : fips.substring(0, 1);
                            
                            // Check if this county belongs to the state (handle both 1 and 2 digit state FIPS)
                            var matchesState = (countyStateFips === stateFips) || 
                                              (stateFips.length === 2 && countyStateFips === stateFips.charAt(1) && fips.length === 4);
                            
                            if (matchesState && Counties.countyData[fips]) {
                                countyCount++;
                                stateCountyPaths.push(path);
                                path.style.display = 'block';
                                path.style.cursor = 'pointer';
                                path.style.stroke = '#333';
                                path.style.strokeWidth = '1';
                                
                                // Color based on reported votes
                                self.colorCountyPath(path, fips, stateCode);
                                
                                // Add click handler
                                (function(f) {
                                    path.onclick = function() {
                                        Election.showCountyDetail(f);
                                    };
                                })(fips);
                            } else {
                                // Hide counties not in this state
                                path.style.display = 'none';
                            }
                        } else if (pathId && pathId !== 'counties' && pathId !== stateCode) {
                            // Hide non-county paths
                            path.style.display = 'none';
                        }
                    }
                    
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    
                    if (countyCount === 0) {
                        wrapper.innerHTML = '<div style="color: #888;">No counties found for this state</div>';
                    } else {
                        // Focus the view on this state's counties
                        self.focusOnStateCounties(svg, stateFips, stateCountyPaths);
                        
                        // Set up real-time updates
                        self.countyMapUpdateInterval = setInterval(function() {
                            if (!document.getElementById('county-election-map-svg')) {
                                clearInterval(self.countyMapUpdateInterval);
                                return;
                            }
                            self.updateCountyElectionMap(stateCode);
                        }, 500);
                    }
                } else {
                    wrapper.innerHTML = '<div style="color: #888;">County map could not be loaded</div>';
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div style="color: #888;">Failed to load county map</div>';
            }
        };
        xhr.send();
    },
    
    colorCountyPath: function(path, countyFips, stateCode) {
        var county = Counties.countyData[countyFips];
        
        if (!county || !county.reportedVotes) {
            path.style.fill = '#333333';
            return;
        }
        
        // Use county's own reported votes
        var demVotes = county.reportedVotes.D || 0;
        var repVotes = county.reportedVotes.R || 0;
        var countyTotal = demVotes + repVotes;
        
        if (countyTotal > 0) {
            var countyDemPct = (demVotes / countyTotal) * 100;
            var countyRepPct = (repVotes / countyTotal) * 100;
            var margin = countyDemPct - countyRepPct;
            
            // Use Utils.getMarginColor to color the county
            path.style.fill = Utils.getMarginColor(margin);
        } else {
            // No votes reported yet
            path.style.fill = '#333333';
        }
    },
    
    focusOnStateCounties: function(svg, stateFips, stateCountyPaths) {
        if (stateCountyPaths.length === 0) return;
        
        // Calculate union bounding box
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var j = 0; j < stateCountyPaths.length; j++) {
            var path = stateCountyPaths[j];
            try {
                var bb = path.getBBox();
                minX = Math.min(minX, bb.x);
                minY = Math.min(minY, bb.y);
                maxX = Math.max(maxX, bb.x + bb.width);
                maxY = Math.max(maxY, bb.y + bb.height);
            } catch (e) {
                // getBBox might fail on some paths, skip them
                continue;
            }
        }
        
        // Check if we got valid bounds
        if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
            return;
        }
        
        // Add padding (5% of bbox)
        var padX = (maxX - minX) * 0.05;
        var padY = (maxY - minY) * 0.05;
        minX -= padX;
        minY -= padY;
        maxX += padX;
        maxY += padY;
        
        // Set viewBox to focus on selected state
        svg.setAttribute('viewBox', minX + ' ' + minY + ' ' + (maxX - minX) + ' ' + (maxY - minY));
    },
    
    updateCountyElectionMap: function(stateCode) {
        var svg = document.getElementById('county-election-map-svg');
        if (!svg) return;
        
        var paths = svg.querySelectorAll('path');
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var countyFips = path.id;
            
            if (countyFips && Counties.countyData[countyFips]) {
                this.colorCountyPath(path, countyFips, stateCode);
            }
        }
    },
    
    renderCountyListFallback: function(stateCode) {
        var state = gameData.states[stateCode];
        var wrapper = document.getElementById('county-election-map-wrapper');
        if (!wrapper) return;
        
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) return;
        
        var html = '<div style="width: 100%; max-height: 450px; overflow-y: auto; padding: 10px;">';
        
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            var countyResults = [];
            
            for (var fips in Counties.countyData) {
                var normalizedFips = Counties.normalizeFips(fips);
                var paddedFips = fips.padStart(5, '0');
                if (paddedFips.substring(0, 2) === stateFips) {
                    var county = Counties.countyData[fips];
                    if (county.v) {
                        var demTurnout = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
                        var repTurnout = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
                        
                        var demVotes = (county.v.D || 0) * demTurnout;
                        var repVotes = (county.v.R || 0) * repTurnout;
                        var countyTotal = demVotes + repVotes;
                        
                        if (countyTotal > 0) {
                            var countyDemPct = (demVotes / countyTotal) * 100;
                            var countyRepPct = (repVotes / countyTotal) * 100;
                            var margin = countyDemPct - countyRepPct;
                            
                            countyResults.push({
                                fips: fips,
                                name: county.n || 'County',
                                demPct: countyDemPct,
                                repPct: countyRepPct,
                                margin: margin,
                                totalVotes: countyTotal,
                                reportingPct: state.reportedPct
                            });
                        }
                    }
                }
            }
            
            countyResults.sort(function(a, b) { return Math.abs(b.margin) - Math.abs(a.margin); });
            
            for (var i = 0; i < Math.min(20, countyResults.length); i++) {
                var cr = countyResults[i];
                var leader = cr.margin > 0 ? 'D' : 'R';
                var leaderColor = leader === 'D' ? '#00AEF3' : '#E81B23';
                var marginText = (cr.margin > 0 ? 'D+' : 'R+') + Math.abs(cr.margin).toFixed(1);
                
                html += '<div class="county-row" data-fips="' + cr.fips + '" style="padding: 8px; margin: 5px 0; background: #1a1a1a; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">';
                html += '<span style="color: #ccc;">' + cr.name + '</span>';
                html += '<div style="display: flex; gap: 15px; align-items: center;">';
                html += '<span style="color: #666; font-size: 0.85rem;">' + Math.floor(cr.reportingPct) + '%</span>';
                html += '<span style="color: ' + leaderColor + '; font-weight: bold;">' + marginText + '</span>';
                html += '</div>';
                html += '</div>';
            }
            
            if (countyResults.length > 20) {
                html += '<div style="text-align: center; color: #666; margin-top: 10px; font-size: 0.9rem;">+ ' + (countyResults.length - 20) + ' more counties</div>';
            }
        }
        
        html += '</div>';
        wrapper.innerHTML = html;
        
        // Add event listeners
        var countyRows = wrapper.querySelectorAll('.county-row');
        for (var i = 0; i < countyRows.length; i++) {
            countyRows[i].addEventListener('click', function() {
                var fips = this.getAttribute('data-fips');
                Election.showCountyDetail(fips);
            });
        }
    },
    
    closeCountyElectionView: function() {
        var overlay = document.getElementById('county-election-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        // Clear the update interval
        if (this.countyMapUpdateInterval) {
            clearInterval(this.countyMapUpdateInterval);
            this.countyMapUpdateInterval = null;
        }
    },
    
    showCountyDetail: function(fips) {
        // Show detailed vote breakdown for a specific county
        var county = Counties.countyData[fips];
        if (!county) return;
        
        var overlay = document.getElementById('county-detail-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'county-detail-overlay';
            overlay.className = 'modal-overlay';
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 20px;';
            document.body.appendChild(overlay);
        }
        
        // Use county's own reporting percentage
        var reportingPct = county.reportedPct || 0;
        
        // Use county's own reported votes
        var demVotes = county.reportedVotes.D || 0;
        var repVotes = county.reportedVotes.R || 0;
        var totalVotes = demVotes + repVotes;
        
        var demPct = totalVotes > 0 ? (demVotes / totalVotes) * 100 : 50;
        var repPct = totalVotes > 0 ? (repVotes / totalVotes) * 100 : 50;
        var margin = demPct - repPct;
        
        var html = '<div style="background: #1e1e1e; border: 2px solid #ffd700; border-radius: 10px; padding: 30px; max-width: 600px; width: 100%;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #444; padding-bottom: 15px;">';
        html += '<h2 style="margin: 0; color: #ffd700;">' + (county.n || 'County') + '</h2>';
        html += '<button onclick="Election.closeCountyDetail()" style="background: #444; border: none; color: white; padding: 8px 20px; cursor: pointer; border-radius: 4px; font-weight: bold;">BACK</button>';
        html += '</div>';
        
        // Reporting percentage
        html += '<div style="text-align: center; font-size: 0.9rem; color: #888; margin-bottom: 15px;">' + Math.floor(reportingPct) + '% Reporting</div>';
        
        // Vote bar
        html += '<div style="height: 40px; background: #333; border-radius: 4px; display: flex; overflow: hidden; margin-bottom: 15px;">';
        html += '<div style="width: ' + demPct + '%; background: #00AEF3; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">' + (demPct > 10 ? demPct.toFixed(1) + '%' : '') + '</div>';
        html += '<div style="width: ' + repPct + '%; background: #E81B23; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">' + (repPct > 10 ? repPct.toFixed(1) + '%' : '') + '</div>';
        html += '</div>';
        
        // Vote counts
        html += '<div style="background: #252525; padding: 20px; border-radius: 6px;">';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 15px;">';
        html += '<div>';
        html += '<div style="color: #00AEF3; font-weight: bold; font-size: 1.3rem;">' + demVotes.toLocaleString() + '</div>';
        html += '<div style="color: #888; font-size: 0.9rem;">Democrat</div>';
        html += '</div>';
        html += '<div style="text-align: right;">';
        html += '<div style="color: #E81B23; font-weight: bold; font-size: 1.3rem;">' + repVotes.toLocaleString() + '</div>';
        html += '<div style="color: #888; font-size: 0.9rem;">Republican</div>';
        html += '</div>';
        html += '</div>';
        
        // Margin
        var marginColor = margin > 0 ? '#00AEF3' : '#E81B23';
        var marginText = (margin > 0 ? 'D+' : 'R+') + Math.abs(margin).toFixed(1) + '%';
        html += '<div style="text-align: center; padding-top: 15px; border-top: 1px solid #444;">';
        html += '<div style="color: ' + marginColor + '; font-weight: bold; font-size: 1.5rem;">' + marginText + '</div>';
        html += '<div style="color: #888; font-size: 0.9rem;">Margin</div>';
        html += '</div>';
        html += '</div>';
        
        // County info
        html += '<div style="background: #252525; padding: 15px; border-radius: 6px; margin-top: 15px;">';
        html += '<div style="color: #888; font-size: 0.9rem;">Population: ' + (county.p || 0).toLocaleString() + '</div>';
        html += '<div style="color: #888; font-size: 0.9rem;">Type: ' + (county.t || 'Unknown') + '</div>';
        html += '</div>';
        
        html += '</div>';
        
        overlay.innerHTML = html;
        overlay.style.display = 'flex';
    },
    
    closeCountyDetail: function() {
        var overlay = document.getElementById('county-detail-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
};
