/* ============================================
   DECISION 2028 - WEEKLY NEWSPAPER / GOOGLE NEWS BROAD SHEET ENGINE
   ============================================ */

var Newspaper = {
    OUTLETS: [
        {
            id: 'associated_press',
            name: 'The National Chronicle',
            tagline: 'The Independent Wire of Record · Comprehensive Campaign Coverage',
            bias: 'neutral',
            badge: 'NATIONAL WIRE',
            badgeClass: 'bias-neutral',
            color: '#1f2937',
            accent: '#3b82f6',
            reporters: ['Marcus Brody', 'Arthur Vance', 'Elena Rostova', 'David Chen']
        },
        {
            id: 'sentinel',
            name: 'The Daily Sentinel',
            tagline: 'Defending Liberty, Free Markets, and the Heartland',
            bias: 'conservative',
            badge: 'CONSERVATIVE',
            badgeClass: 'bias-conservative',
            color: '#7f1d1d',
            accent: '#dc2626',
            reporters: ['Hunter Vance', 'Sarah Caldwell', 'Bradley Stone', 'Clint Harrison']
        },
        {
            id: 'dispatch',
            name: 'The Progressive Dispatch',
            tagline: 'The Voice of Labor, Justice, and Political Reform',
            bias: 'progressive',
            badge: 'PROGRESSIVE',
            badgeClass: 'bias-progressive',
            color: '#1e3a8a',
            accent: '#2563eb',
            reporters: ['Maya Lin-Chen', 'Derrick Thorne', 'Elena Ramos', 'Micah Sanders']
        },
        {
            id: 'insider',
            name: 'The Beltway Insider',
            tagline: 'Inside Scoops, Whispers, and Unfiltered Campaign Gossip',
            bias: 'sensationalist',
            badge: 'INSIDER GOSSIP',
            badgeClass: 'bias-sensationalist',
            color: '#92400e',
            accent: '#d97706',
            reporters: ['Chloe Davenport', 'Gabe Sterling', 'Tori Brooks', 'Nate Vance']
        }
    ],

    EXTRA_OUTLETS: [
        {
            id: 'financial',
            name: 'The Financial Standard',
            tagline: 'Markets, Capital Flows, and Campaign Economics',
            bias: 'business',
            badge: 'MARKETS & FISCAL',
            badgeClass: 'bias-business',
            color: '#065f46',
            accent: '#059669',
            reporters: ['Julian Sterling', 'Victoria Croft', 'Aaron Sterling-Vance']
        },
        {
            id: 'heartland',
            name: 'The Heartland Gazette',
            tagline: 'Ground Truth from Main Street and Industrial Communities',
            bias: 'regional',
            badge: 'HEARTLAND BEAT',
            badgeClass: 'bias-regional',
            color: '#475569',
            accent: '#64748b',
            reporters: ['Hank Miller', 'Rachel Kowalski', 'Jim Beauregard']
        }
    ],

    currentOutletIndex: 0,
    currentCategory: 'all',

    getAllOutlets: function() {
        return this.OUTLETS.concat(this.EXTRA_OUTLETS);
    },

    getOutlet: function(id) {
        var all = this.getAllOutlets();
        if (id) {
            var found = all.find(function(o) { return o.id === id || o.bias === id; });
            if (found) return found;
        }
        return this.OUTLETS[this.currentOutletIndex % this.OUTLETS.length];
    },

    cycleOutlet: function() {
        this.currentOutletIndex = (this.currentOutletIndex + 1) % this.OUTLETS.length;
        this.render();
    },

    // Pool of realistic, dynamic national & economic events that rotate
    NATIONAL_EVENTS_POOL: [
        {
            category: 'national',
            tag: 'ECONOMIC PULSE',
            outletId: 'financial',
            headline: 'INFLATION RATE COOLS TO 2.4% AS MARKETS ANTICIPATE MONETARY EASING',
            blurb: 'The Bureau of Labor Statistics reported wholesale consumer prices ticked downward for the second straight month. Federal Reserve officials hinted that benchmark borrowing costs may ease, igniting fierce debate along the campaign trail over credit for the cooling inflation trajectory.'
        },
        {
            category: 'national',
            tag: 'LABOR & JOBS',
            outletId: 'dispatch',
            headline: 'AUTO & CLEAN ENERGY WORKERS RATIFY HISTORIC CONTRACT IN RUST BELT',
            blurb: 'Union leaders announced a landmark agreement guaranteeing higher base wages and job guarantees at industrial plants in Michigan and Ohio. Grassroots organizers called it a victory for manufacturing workers, while business columnists warned of higher production overhead.'
        },
        {
            category: 'national',
            tag: 'SUPREME COURT',
            outletId: 'sentinel',
            headline: 'HIGH COURT AGREES TO REVIEW FEDERAL REGULATORY REACH IN LANDMARK SUIT',
            blurb: 'The Supreme Court signaled it will hear oral arguments challenging unelected federal rulemaking over commerce and energy. Conservative legal scholars praised the docket addition as a long-overdue check on the administrative state, while progressive groups voiced deep alarm.'
        },
        {
            category: 'national',
            tag: 'ENERGY & COMMODITIES',
            outletId: 'financial',
            headline: 'DOMESTIC CRUDE OIL TOUCHES MULTI-MONTH LOWS, EASING PUMP PRICES',
            blurb: 'Record domestic refining capacity and steady crude production sent retail gasoline prices down an average of 14 cents per gallon nationwide. Campaign operatives in suburban swing districts welcomed the price drop as relief for commuting families.'
        },
        {
            category: 'national',
            tag: 'CAPITOL HILL',
            outletId: 'associated_press',
            headline: 'BIPARTISAN COMMITTEE UNVEILS REVISED BORDER SECURITY & ASYLUM DRAFT',
            blurb: 'A bipartisan group of senators released a compromised legislative blueprint expanding border patrol funding and revamping asylum screening proceedings. Both party wings quickly mobilized, with populists decrying loopholes and advocates questioning detention caps.'
        },
        {
            category: 'national',
            tag: 'AGRICULTURE & TRADE',
            outletId: 'heartland',
            headline: 'HEARTLAND GRAIN COOPERATIVES REPORT RECORD EXPORT SHIPMENTS TO ASIA',
            blurb: 'Midwestern agricultural terminals reported strong autumn export volume for soybeans and feed grain, providing vital cash flow to family farms amid stalled negotiations over the multi-year Congressional Farm Bill.'
        },
        {
            category: 'national',
            tag: 'TECH & AI',
            outletId: 'insider',
            headline: 'SENATE PANEL PROBES AI CAMPAIGN DISINFORMATION AND DIGITAL AD TRANSPARENCY',
            blurb: 'Silicon Valley tech executives spent hours in a tense Congressional hearing facing sharp questions on synthetic voice ads and micro-targeting transparency. Campaign strategists privately acknowledge digital operations are heavily testing autonomous media generators.'
        },
        {
            category: 'national',
            tag: 'HEALTHCARE & DRUGS',
            outletId: 'dispatch',
            headline: 'FEDERAL PRESCRIPTION DRUG PRICE CAPS EXPAND TO TEN MORE MEDICATIONS',
            blurb: 'Federal health regulators finalized price-negotiation terms for widely used cardiovascular and diabetes medications, delivering noticeable out-of-pocket savings to older voters and sparking clashes between pharmaceutical lobbyists and healthcare advocates.'
        }
    ],

    // Palace intrigue & gossip scoops
    WHISPERS_POOL: [
        {
            category: 'whispers',
            tag: 'BELTWAY SCOOP',
            outletId: 'insider',
            headline: 'OVERHEARD AT CAPITAL GRILLE: PRIVATE DONOR FRETTING OVER EARLY MAP',
            blurb: 'Over ribeyes and dry martinis, high-dollar bundlers were overheard whispering about unreleased tracking numbers. Several key benefactors are reportedly quietly hedging their bets, withholding third-tranche checks until the early-state picture solidifies.'
        },
        {
            category: 'whispers',
            tag: 'CAMPAIGN LEAKS',
            outletId: 'insider',
            headline: 'STAFF SPATS REPORTED IN ADJACENT WAR ROOM OVER DEBATE STRATEGY',
            blurb: 'Aides are privately venting about debate preparation friction. Sources describe mock debate sessions spiraling into heated disagreements over whether to adopt a sharp contrast approach or pivot to uplifting general-election themes.'
        },
        {
            category: 'whispers',
            tag: 'HOTEL SUITE WHISPERS',
            outletId: 'insider',
            headline: 'SUPER PAC ENVOYS QUIETLY SHOP TELEVISION RESERVATIONS FOR SUPER TUESDAY',
            blurb: 'Media buyers affiliated with outside expenditure committees have placed tentative multi-million dollar holds on broadcast inventory across Atlanta, Charlotte, and Phoenix, signaling an impending autumn airwaves war.'
        }
    ],

    generateContent: function() {
        var isPrimary = typeof PrimaryNative !== 'undefined' && PrimaryNative.active();
        var cand = gameData.candidate;
        var candName = cand ? cand.name : 'Candidate';
        var candParty = gameData.selectedParty || 'D';
        var week = gameData.currentWeek || 0;
        var dateStr = gameData.currentDate ? gameData.currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Election Season 2028';

        var articles = [];
        var leadArticle = null;

        // -------------------------------------------------------------
        // 1. LEAD STORY (Primary Contest Result or General Polling Tracker)
        // -------------------------------------------------------------
        if (isPrimary && typeof PrimaryCampaign !== 'undefined') {
            var pState = PrimaryCampaign.state();
            var recentContests = (pState ? pState.contests : []).filter(function(c) {
                return c.status === 'complete' && c.result;
            });
            var lastContest = recentContests.length ? recentContests[recentContests.length - 1] : null;

            if (lastContest && lastContest.result) {
                var rank = Object.keys(lastContest.result.votes).sort(function(a, b) {
                    return lastContest.result.votes[b] - lastContest.result.votes[a];
                });
                var winnerActor = PrimaryCampaign.actor(rank[0]);
                var winnerName = winnerActor ? winnerActor.candidate.name : 'Frontrunner';
                var margin = ((lastContest.result.shares[rank[0]] || 0) - (lastContest.result.shares[rank[1]] || 0)).toFixed(1);
                var delWon = lastContest.result.delegates[rank[0]] || 0;

                leadArticle = {
                    id: 'lead-1',
                    category: 'lead',
                    tag: 'PRIMARY SHOWDOWN',
                    outlet: this.getOutlet('associated_press'),
                    reporter: 'Marcus Brody · Chief Political Analyst',
                    time: 'This Week',
                    headline: winnerName.toUpperCase() + ' CAPTURES ' + lastContest.name.toUpperCase() + ' IN DECISIVE CONTEST',
                    blurb: winnerName + ' claimed victory in the ' + lastContest.name + ' primary, earning ' + (lastContest.result.shares[rank[0]] || 0).toFixed(1) + '% of the popular vote and securing ' + delWon + ' pledged delegates. The +' + margin + '% victory margin reverberated through opposing campaign headquarters as the primary calendar rapidly advances toward upcoming delegations.'
                };
            }
        }

        if (!leadArticle) {
            var poll = (typeof Utils !== 'undefined' && Utils.getNationalPollingByParty) ? Utils.getNationalPollingByParty() : null;
            if (!poll) poll = { D: 48.2, R: 47.9 };
            var dPct = (poll.D !== undefined ? poll.D : 48.2).toFixed(1);
            var rPct = (poll.R !== undefined ? poll.R : 47.9).toFixed(1);

            leadArticle = {
                id: 'lead-1',
                category: 'lead',
                tag: 'BATTLEGROUND TRACKER',
                outlet: this.getOutlet('associated_press'),
                reporter: 'Arthur Vance · National Wire Desk',
                time: 'Weekly Report',
                headline: 'TIGHT DEADLOCK: TRACKING SURVEYS SHOW RAZOR-THIN BATTLEGROUND MARGINS',
                blurb: 'National and state battleground tracking averages indicate an ultra-competitive electoral map with ' + dPct + '% Dem vs ' + rPct + '% Rep. Campaign pollsters report suburban corridors and industrial working-class counties remain volatile, prompting unprecedented advertising investments across key media markets.'
            };
        }
        articles.push(leadArticle);

        // -------------------------------------------------------------
        // 2. OPPONENT CANDIDATE REPORTS ("What all the other candidates are doing")
        // -------------------------------------------------------------
        if (isPrimary && typeof PrimaryCampaign !== 'undefined') {
            var pState = PrimaryCampaign.state();
            var playerId = pState ? pState.playerId : null;
            var actors = pState ? Object.values(pState.actors) : [];
            var activeRivals = actors.filter(function(a) {
                return a.id !== playerId && a.status === 'active' && a.party === candParty;
            });

            // If none in same party, include opponents across the aisle
            if (!activeRivals.length) {
                activeRivals = actors.filter(function(a) {
                    return a.id !== playerId && a.status === 'active';
                });
            }

            // Shuffle or prioritize active rivals
            var chosenRivals = activeRivals.slice(0, 3);
            for (var r = 0; r < chosenRivals.length; r++) {
                var riv = chosenRivals[r];
                var rivName = riv.candidate.name;
                var rivFaction = riv.candidate.factionId || riv.candidate.faction || 'moderate';
                var rivHome = riv.candidate.homeState || 'US';
                var rivFunds = (riv.funds || 0).toFixed(1);
                var rivRaised = (riv.raised || 0).toFixed(1);

                // Check upcoming contests to name where they campaign
                var upContests = PrimaryCampaign.upcoming(riv.party, 4);
                var targetStateName = upContests.length ? upContests[r % upContests.length].name : (STATES[rivHome] ? STATES[rivHome].name : 'Iowa');

                // Determine biased story angle
                if (riv.scandals && riv.scandals.length > 0) {
                    articles.push({
                        id: 'opp-' + riv.id,
                        category: 'opponents',
                        tag: 'OPPONENT SCANDAL',
                        outlet: this.getOutlet('insider'),
                        reporter: 'Chloe Davenport · Beltway Insider',
                        time: 'Yesterday',
                        headline: 'PRESSURE MOUNTS ON ' + rivName.toUpperCase() + ' OVER EMBARRASSING HEADQUARTERS CONTROVERSY',
                        blurb: 'Rival aides report intense closed-door tension inside ' + rivName + '’s headquarters following disclosures of internal mismanagement. Opponents are sharpening debate attack lines while donors press for immediate damage control.'
                    });
                } else if (riv.funds < 2.5) {
                    articles.push({
                        id: 'opp-' + riv.id,
                        category: 'opponents',
                        tag: 'WAR CHEST CRUNCH',
                        outlet: this.getOutlet('financial'),
                        reporter: 'Julian Sterling · Senior Economics Editor',
                        time: '2 days ago',
                        headline: rivName.toUpperCase() + ' RUNNING ON LOW FUMES AS CASH RESERVES DROP TO $' + rivFunds + 'M',
                        blurb: 'Federal election filings indicate ' + rivName + ' faces mounting burn rates after costly media reservations in early states. Staffers are reportedly scaling back regional field travel to conserve resources for critical primary ballots.'
                    });
                } else if (rivFaction.includes('prog') || rivFaction.includes('left')) {
                    // Progressive candidate report
                    var pOutlet = (r % 2 === 0) ? this.getOutlet('dispatch') : this.getOutlet('sentinel');
                    if (pOutlet.bias === 'progressive') {
                        articles.push({
                            id: 'opp-' + riv.id,
                            category: 'opponents',
                            tag: 'OPPONENT TRAIL',
                            outlet: pOutlet,
                            reporter: 'Maya Lin-Chen · Labor Beat',
                            time: 'This Week',
                            headline: rivName.toUpperCase() + ' MOBILIZES MASSIVE RALLY IN ' + targetStateName.toUpperCase() + ' ON WORKER RIGHTS',
                            blurb: rivName + ' drew thousands of spirited supporters in ' + targetStateName + ', unveiling a robust agenda prioritizing union protections and clean energy investments. Grassroots organizers voiced optimism about climbing poll momentum.'
                        });
                    } else {
                        articles.push({
                            id: 'opp-' + riv.id,
                            category: 'opponents',
                            tag: 'OPPONENT WATCH',
                            outlet: pOutlet,
                            reporter: 'Hunter Vance · National Affairs',
                            time: '3 days ago',
                            headline: rivName.toUpperCase() + ' DOUBLES DOWN ON COSTLY PROGRESSIVE SPENDING IN ' + targetStateName.toUpperCase(),
                            blurb: 'Conservative analysts voiced sharp skepticism as ' + rivName + ' promoted multi-trillion dollar social programs during a tour of ' + targetStateName + '. Critics warned the platform risks alienating pragmatic swing voters.'
                        });
                    }
                } else if (rivFaction.includes('maga') || rivFaction.includes('pop') || rivFaction.includes('rel')) {
                    // Conservative candidate report
                    var cOutlet = (r % 2 === 0) ? this.getOutlet('sentinel') : this.getOutlet('dispatch');
                    if (cOutlet.bias === 'conservative') {
                        articles.push({
                            id: 'opp-' + riv.id,
                            category: 'opponents',
                            tag: 'OPPONENT TRAIL',
                            outlet: cOutlet,
                            reporter: 'Sarah Caldwell · Heartland Desk',
                            time: 'This Week',
                            headline: rivName.toUpperCase() + ' PACKS ARENA IN ' + targetStateName.toUpperCase() + ' WITH FIERY ADDRESS',
                            blurb: 'A capacity crowd cheered ' + rivName + ' in ' + targetStateName + ' as the candidate championed border security, deregulation, and judicial discipline. Campaign strategists noted surging grassroots donor contributions.'
                        });
                    } else {
                        articles.push({
                            id: 'opp-' + riv.id,
                            category: 'opponents',
                            tag: 'OPPONENT WATCH',
                            outlet: cOutlet,
                            reporter: 'Derrick Thorne · Policy Analyst',
                            time: '4 days ago',
                            headline: rivName.toUpperCase() + ' STOKES CULTURE WAR CONTROVERSY AT ' + targetStateName.toUpperCase() + ' STOP',
                            blurb: 'Civil rights advocates called out ' + rivName + ' for inflammatory remarks targeting voting regulations and educational curriculums during a weekend campaign stop in ' + targetStateName + '.'
                        });
                    }
                } else {
                    // Moderate / Establishment report
                    articles.push({
                        id: 'opp-' + riv.id,
                        category: 'opponents',
                        tag: 'OPPONENT BLITZ',
                        outlet: this.getOutlet('associated_press'),
                        reporter: 'Marcus Brody · Wire Correspondent',
                        time: 'This Week',
                        headline: rivName.toUpperCase() + ' EXPANDS FIELD OPERATIONS AND AD BUYS ACROSS ' + targetStateName.toUpperCase(),
                        blurb: 'With a reported war chest of $' + rivFunds + 'M, ' + rivName + ' opened several new regional field offices in ' + targetStateName + ', targeting suburban moderates and non-affiliated independent voters ahead of delegate selection.'
                    });
                }
            }
        } else {
            // General Election Opponent Reports
            var oppPres = (candParty === 'D' && gameData.repTicket) ? gameData.repTicket.pres : (gameData.demTicket ? gameData.demTicket.pres : null);
            var oppVp = (candParty === 'D' && gameData.repTicket) ? gameData.repTicket.vp : (gameData.demTicket ? gameData.demTicket.vp : null);
            var oppName = oppPres ? oppPres.name : 'The Opposition Ticket';
            var oppVpName = oppVp ? oppVp.name : 'Running Mate';

            articles.push({
                id: 'opp-gen-1',
                category: 'opponents',
                tag: 'OPPONENT BLITZ',
                outlet: this.getOutlet('associated_press'),
                reporter: 'Marcus Brody · Wire Correspondent',
                time: 'This Week',
                headline: oppName.toUpperCase() + ' BLITZES RUST BELT AND SUN BELT WITH MULTI-MILLION AD BLOCKS',
                blurb: oppName + '’s campaign reserved extensive broadcast commercial slots across Pennsylvania, Michigan, and Wisconsin this week. Strategists are focusing messaging on economic stability and industrial competitiveness in crucial swing counties.'
            });

            articles.push({
                id: 'opp-gen-2',
                category: 'opponents',
                tag: 'VP TRAIL',
                outlet: this.getOutlet('insider'),
                reporter: 'Chloe Davenport · Beltway Insider',
                time: 'Yesterday',
                headline: oppVpName.toUpperCase() + ' DISPATCHED ON AGGRESSIVE COUNTY TOUR TO SHORE UP SUBURBS',
                blurb: oppVpName + ' headlined a series of packed regional forums in key battleground counties. Leaked memos indicate the campaign is prioritizing moderate suburban women and independent ticket-splitters.'
            });
        }

        // -------------------------------------------------------------
        // 3. PLAYER'S RECENT CAMPAIGN MOVES (Trail, Town Halls, Rallies, Ads)
        // -------------------------------------------------------------
        var logs = (gameData.logs || []).slice(-10).reverse();
        var playerStoryFound = false;

        for (var i = 0; i < logs.length; i++) {
            var raw = logs[i];
            var txt = typeof raw === 'string' ? raw : (raw.text || '');

            if (txt.includes('Town Hall') || txt.includes('townhall')) {
                articles.push({
                    id: 'player-th',
                    category: 'player',
                    tag: 'ON THE TRAIL',
                    outlet: this.getOutlet('heartland'),
                    reporter: 'Hank Miller · Heartland Beat',
                    time: 'Recent Event',
                    headline: candName.toUpperCase() + ' FIELDS SHARP CONSTITUENT INQUIRIES AT PACKED TOWN HALL',
                    blurb: candName + ' faced unscripted, spirited dialogue from local voters during a county town hall forum. Attendees probed the campaign on policy specifics and economic timelines, with local observers noting strong community engagement.'
                });
                playerStoryFound = true;
                break;
            } else if (txt.includes('Rally') || txt.includes('rally')) {
                var pOutlet = (candParty === 'D') ? this.getOutlet('dispatch') : this.getOutlet('sentinel');
                articles.push({
                    id: 'player-rally',
                    category: 'player',
                    tag: 'RALLY COVERAGE',
                    outlet: pOutlet,
                    reporter: pOutlet.reporters[0] + ' · Campaign Trail',
                    time: 'Recent Event',
                    headline: candName.toUpperCase() + ' ENERGIZES THOUSANDS OF SUPPORTERS IN SPIRITED RALLY',
                    blurb: 'Supporters packed the venue as ' + candName + ' delivered a high-energy keynote address outlining the campaign’s core platform pillars. Opposing campaign monitors quickly issued counter-statements questioning the feasibility of the proposed measures.'
                });
                playerStoryFound = true;
                break;
            } else if (txt.includes('Ad') || txt.includes('ad') || txt.includes('bought') || txt.includes('broadcast')) {
                articles.push({
                    id: 'player-ad',
                    category: 'player',
                    tag: 'AIRWAVES PUSH',
                    outlet: this.getOutlet('insider'),
                    reporter: 'Chloe Davenport · Beltway Insider',
                    time: 'Recent Event',
                    headline: candName.toUpperCase() + ' EXPANDS AD BLITZ ACROSS TARGETED MEDIA MARKETS',
                    blurb: candName + '’s campaign escalated its television and digital presence with a new wave of focused spots. Media analysts estimate the media purchase represents a decisive push to influence undecided voters in key population centers.'
                });
                playerStoryFound = true;
                break;
            }
        }

        if (!playerStoryFound) {
            articles.push({
                id: 'player-funds',
                category: 'player',
                tag: 'WAR CHEST DISPATCH',
                outlet: this.getOutlet('financial'),
                reporter: 'Julian Sterling · Senior Economics Editor',
                time: 'This Week',
                headline: candName.toUpperCase() + ' ENTERS WEEK WITH $' + (gameData.funds || 0).toFixed(1) + 'M IN CAMPAIGN WAR CHEST',
                blurb: 'Financial disclosures show ' + candName + ' maintains strong liquidity heading into upcoming tour dates. Campaign strategists confirmed funds are allocated toward field organizer salaries and digital reservations.'
            });
        }

        // -------------------------------------------------------------
        // 4. RANDOM RELEVANT WORLD / NATIONAL NEWS EVENTS (Deterministic by week)
        // -------------------------------------------------------------
        var eventIndex1 = (week * 3 + 1) % this.NATIONAL_EVENTS_POOL.length;
        var eventIndex2 = (week * 3 + 4) % this.NATIONAL_EVENTS_POOL.length;
        var ev1 = this.NATIONAL_EVENTS_POOL[eventIndex1];
        var ev2 = this.NATIONAL_EVENTS_POOL[eventIndex2];

        articles.push({
            id: 'nat-1',
            category: 'national',
            tag: ev1.tag,
            outlet: this.getOutlet(ev1.outletId),
            reporter: this.getOutlet(ev1.outletId).reporters[0] + ' · National Affairs',
            time: 'This Week',
            headline: ev1.headline,
            blurb: ev1.blurb
        });

        if (eventIndex1 !== eventIndex2) {
            articles.push({
                id: 'nat-2',
                category: 'national',
                tag: ev2.tag,
                outlet: this.getOutlet(ev2.outletId),
                reporter: this.getOutlet(ev2.outletId).reporters[1] || this.getOutlet(ev2.outletId).reporters[0],
                time: 'This Week',
                headline: ev2.headline,
                blurb: ev2.blurb
            });
        }

        // -------------------------------------------------------------
        // 5. BELTWAY WHISPERS / INSIDER GOSSIP
        // -------------------------------------------------------------
        var scoop = this.WHISPERS_POOL[week % this.WHISPERS_POOL.length];
        articles.push({
            id: 'whisper-1',
            category: 'whispers',
            tag: scoop.tag,
            outlet: this.getOutlet(scoop.outletId),
            reporter: 'Chloe Davenport · Chief Palace Intrigue Columnist',
            time: 'Exclusive Scoop',
            headline: scoop.headline,
            blurb: scoop.blurb
        });

        // Backward compatibility blurbs for existing test runners
        var blurbs = articles.slice(1, 4).map(function(a) {
            return {
                title: a.headline,
                text: a.blurb
            };
        });

        return {
            outlet: this.getOutlet(),
            dateStr: dateStr,
            week: week,
            lead: leadArticle,
            articles: articles,
            blurbs: blurbs,
            isPrimary: isPrimary
        };
    },

    show: function() {
        if (gameData.suppressNewspaper) return;
        var modal = document.getElementById('newspaper-modal');
        if (!modal) {
            this.createModalDOM();
            modal = document.getElementById('newspaper-modal');
        }
        if (modal) {
            this.render();
            modal.classList.remove('hidden');
        }
    },

    close: function() {
        var modal = document.getElementById('newspaper-modal');
        if (modal) modal.classList.add('hidden');
    },

    toggleSuppress: function(checked) {
        gameData.suppressNewspaper = !!checked;
        if (checked && typeof Utils !== 'undefined') {
            Utils.showToast('Newspaper popup muted for remaining turns.');
        }
    },

    setCategory: function(cat) {
        this.currentCategory = cat || 'all';
        var pills = document.querySelectorAll('.news-pill');
        for (var i = 0; i < pills.length; i++) {
            if (pills[i].getAttribute('data-cat') === this.currentCategory) {
                pills[i].classList.add('active');
            } else {
                pills[i].classList.remove('active');
            }
        }
        var cards = document.querySelectorAll('.newspaper-card, .newspaper-hero-card');
        for (var j = 0; j < cards.length; j++) {
            var cardCat = cards[j].getAttribute('data-cat');
            if (this.currentCategory === 'all' || cardCat === this.currentCategory) {
                cards[j].style.display = '';
            } else {
                cards[j].style.display = 'none';
            }
        }
    },

    createModalDOM: function() {
        if (document.getElementById('newspaper-modal')) return;
        var div = document.createElement('div');
        div.id = 'newspaper-modal';
        div.className = 'modal hidden';
        div.onclick = function(e) {
            if (e.target === div) Newspaper.close();
        };
        div.innerHTML = '<div class="newspaper-container" id="newspaper-container"></div>';
        document.body.appendChild(div);
    },

    render: function() {
        var container = document.getElementById('newspaper-container');
        if (!container) return;
        var data = this.generateContent();
        var articles = data.articles || [];

        // Count categories for pill badges
        var counts = { all: articles.length, lead: 0, opponents: 0, player: 0, national: 0, whispers: 0 };
        articles.forEach(function(a) {
            if (counts[a.category] !== undefined) counts[a.category]++;
        });

        var html = '<div class="newspaper-sheet">';

        // 1. Newspaper Top Masthead
        html += '<header class="newspaper-masthead">' +
            '<div class="newspaper-dateline">' +
                '<span>VOL. CXXVIII No. ' + (40 + data.week) + '</span>' +
                '<span>' + data.dateStr.toUpperCase() + '</span>' +
                '<span>NATIONAL DIGEST & OPPONENT DISPATCHES · $2.50</span>' +
            '</div>' +
            '<div class="newspaper-branding-row">' +
                '<div class="newspaper-title-group">' +
                    '<h1 class="newspaper-title">THE NATIONAL DISPATCH</h1>' +
                    '<div class="newspaper-tagline">Weekly Intelligence Feed · Multi-Outlet Opponent Wire & National Affairs</div>' +
                '</div>' +
                '<button class="newspaper-close-btn" onclick="Newspaper.close()" title="Close Newsletter" aria-label="Close">&times;</button>' +
            '</div>' +
        '</header>';

        // 2. Google News-Style Topic Pills Bar
        html += '<nav class="newspaper-nav-bar" role="tablist">' +
            '<span class="newspaper-nav-label">SECTIONS:</span>' +
            '<button class="news-pill' + (this.currentCategory === 'all' ? ' active' : '') + '" data-cat="all" onclick="Newspaper.setCategory(\'all\')">All Reports (' + counts.all + ')</button>' +
            '<button class="news-pill' + (this.currentCategory === 'opponents' ? ' active' : '') + '" data-cat="opponents" onclick="Newspaper.setCategory(\'opponents\')">Rival Candidates (' + counts.opponents + ')</button>' +
            '<button class="news-pill' + (this.currentCategory === 'player' ? ' active' : '') + '" data-cat="player" onclick="Newspaper.setCategory(\'player\')">Campaign Trail (' + counts.player + ')</button>' +
            '<button class="news-pill' + (this.currentCategory === 'national' ? ' active' : '') + '" data-cat="national" onclick="Newspaper.setCategory(\'national\')">National & Economy (' + counts.national + ')</button>' +
            '<button class="news-pill' + (this.currentCategory === 'whispers' ? ' active' : '') + '" data-cat="whispers" onclick="Newspaper.setCategory(\'whispers\')">Beltway Whispers (' + counts.whispers + ')</button>' +
        '</nav>';

        // 3. News Feed Container
        html += '<div class="newspaper-feed">';

        // Lead Hero Article
        if (data.lead) {
            var lead = data.lead;
            var leadOutlet = lead.outlet || Newspaper.getOutlet();
            html += '<article class="newspaper-hero-card" data-cat="lead" style="display:' + (this.currentCategory === 'all' || this.currentCategory === 'lead' ? '' : 'none') + '; border-left-color:' + leadOutlet.accent + ';">' +
                '<div class="news-meta-row">' +
                    '<span class="news-outlet-name">' + leadOutlet.name + '</span>' +
                    '<span class="news-bias-badge ' + (leadOutlet.badgeClass || 'bias-neutral') + '">' + (leadOutlet.badge || leadOutlet.bias.toUpperCase()) + '</span>' +
                    '<span class="news-bullet">·</span>' +
                    '<span class="news-time">' + lead.time + '</span>' +
                '</div>' +
                '<div class="news-tag-badge">★ TOP REPORT · ' + lead.tag + '</div>' +
                '<h2 class="newspaper-hero-headline">' + lead.headline + '</h2>' +
                '<div class="news-byline">By ' + lead.reporter + '</div>' +
                '<p class="newspaper-hero-blurb">' + lead.blurb + '</p>' +
            '</article>';
        }

        // Grid of Biased News Stories
        html += '<div class="newspaper-grid">';
        for (var i = 0; i < articles.length; i++) {
            var art = articles[i];
            if (art.category === 'lead') continue; // already displayed as hero

            var o = art.outlet || Newspaper.getOutlet();
            var isVisible = (this.currentCategory === 'all' || this.currentCategory === art.category);

            html += '<div class="newspaper-card" data-cat="' + art.category + '" style="display:' + (isVisible ? '' : 'none') + '; border-top-color:' + o.accent + ';">' +
                '<div class="news-card-meta">' +
                    '<span class="news-outlet-name">' + o.name + '</span>' +
                    '<span class="news-bias-badge ' + (o.badgeClass || 'bias-neutral') + '">' + (o.badge || o.bias.toUpperCase()) + '</span>' +
                    '<span class="news-time">' + art.time + '</span>' +
                '</div>' +
                '<div class="news-tag-badge">[' + art.tag + ']</div>' +
                '<h3 class="news-card-headline">' + art.headline + '</h3>' +
                '<div class="news-byline">By ' + art.reporter + '</div>' +
                '<p class="news-card-blurb">' + art.blurb + '</p>' +
            '</div>';
        }
        html += '</div>'; // .newspaper-grid

        html += '</div>'; // .newspaper-feed

        // 4. Footer with Mute and Continue
        html += '<footer class="newspaper-footer">' +
            '<label class="newspaper-mute-label">' +
                '<input type="checkbox" ' + (gameData.suppressNewspaper ? 'checked' : '') + ' onchange="Newspaper.toggleSuppress(this.checked)"> ' +
                'Skip automatic weekly popup for future turns' +
            '</label>' +
            '<button class="newspaper-done-btn" onclick="Newspaper.close()">CONTINUE CAMPAIGN →</button>' +
        '</footer>';

        html += '</div>'; // .newspaper-sheet
        container.innerHTML = html;
    }
};

window.Newspaper = Newspaper;
