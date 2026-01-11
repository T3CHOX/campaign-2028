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
    winnerShown: false,

    start: function() {
        var self = this;
        this.time = 17.5;
        this.demEV = 0;
        this.repEV = 0;
        this.winnerShown = false;

        for (var code in gameData.states) {
            var s = gameData.states[code];
            s.reportedPct = 0;
            s.reportedVotes = { D: 0, R: 0 };
            s.called = false;
            s.calledFor = null;
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

        for (var code in gameData.states) {
            var s = gameData.states[code];
            var closeTime = POLL_CLOSE_TIMES[code] || 20;

            if (this.time >= closeTime && !s.called) {
                if (s.reportedPct < 100) {
                    var increment = (Math.random() * 1.5 + 0.3) * this.speed;
                    s.reportedPct = Math.min(100, s.reportedPct + increment);

                    var totalVotes = s.ev * 120000;
                    var demPct = 50 + s.margin + (Math.random() - 0.5) * 3;
                    var repPct = 100 - demPct;

                    s.reportedVotes.D = Math.floor(totalVotes * (demPct / 100) * (s.reportedPct / 100));
                    s.reportedVotes.R = Math.floor(totalVotes * (repPct / 100) * (s.reportedPct / 100));
                }

                if (s.reportedPct >= 40 && !s.called) {
                    var margin = s.margin;
                    var threshold = 100 - s.reportedPct;

                    if (Math.abs(margin) > threshold + 8) {
                        s.called = true;
                        s.calledFor = margin > 0 ?  'D' :  'R';

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

        if ((this.demEV >= 270 || this.repEV >= 270) && !this.winnerShown) {
            this.showWinner();
        }
    },

    updateDisplay: function() {
        document.getElementById('election-time').innerText = Utils.formatTime(this.time);
        document.getElementById('elec-dem-ev').innerText = this.demEV;
        document.getElementById('elec-rep-ev').innerText = this.repEV;

        var demWidth = (this.demEV / 538) * 50;
        var repWidth = (this.repEV / 538) * 50;
        document.getElementById('elec-bar-dem').style.width = demWidth + '%';
        document.getElementById('elec-bar-rep').style.width = repWidth + '%';
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

    closeWinnerOverlay: function() {
        document.getElementById('winner-overlay').classList.add('hidden');
    },

    togglePause: function() {
        this.paused = ! this.paused;
        document.getElementById('btn-pause').innerText = this.paused ? '▶️' : '⏸️';
    },

    setSpeed: function(speed) {
        this.speed = speed;
        var btns = document.querySelectorAll('.time-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }
    },

    setMapMode: function(mode) {
        this.mapMode = mode;
        document.getElementById('mode-leader').classList.toggle('active', mode === 'leader');
        document.getElementById('mode-projected').classList.toggle('active', mode === 'projected');
        this.colorElectionMap();
    }
};
