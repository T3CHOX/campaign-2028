/* ============================================
   DECISION 2028 - ADVERTISING SYSTEM (TV & DIGITAL)
   ============================================ */

var DigitalAds = {
    // Platform configurations
    PLATFORMS: {
        'ctv':     { cpm: 32, frequency: 4.2, decay: 0.09 },
        'meta':    { cpm: 14, frequency: 6.8, decay: 0.16 },
        'search':  { cpm: 8,  frequency: 1.5, decay: 0.05 },
        'youtube': { cpm: 11, frequency: 3.1, decay: 0.12 },
        'tiktok':  { cpm: 6,  frequency: 9.0, decay: 0.22 },
        'display': { cpm: 4,  frequency: 12.0, decay: 0.18 }
    },

    // Ad Types
    AD_TYPES: {
        'positive': { persuasion: 1.05, turnout: 1.0, swingRepel: 0 },
        'attack':   { persuasion: 0.85, turnout: 0.5, swingRepel: 0.2 }, // Negative ad repels moderate voters slightly
        'issue':    { persuasion: 1.0, turnout: 0.8, swingRepel: 0 },
        'mobilize': { persuasion: 0.2, turnout: 2.0, swingRepel: 0 }
    },

    initDigitalAds: function() {
        gameData.ads = {
            tvSaturation: {}, // marketId -> saturation (0 to 1)
            digitalSaturation: {}, // stateCode -> { platform -> saturation }
            activeTVAds: [], // Ongoing TV buys
        };
        for (var code in STATES) {
            gameData.ads.digitalSaturation[code] = {
                ctv: 0, meta: 0, search: 0, youtube: 0, tiktok: 0, display: 0
            };
        }
    },

    // ----------------------------------------
    // TV ADS LOGIC (Media Markets)
    // ----------------------------------------

    getTVCost: function(marketId, intensity, durationWeeks) {
        if (typeof MEDIA_MARKETS === 'undefined' || !MEDIA_MARKETS[marketId]) return 0;
        var market = MEDIA_MARKETS[marketId];
        
        // Intensity multiplier: 1=Light, 2=Moderate, 3=Heavy
        var intensityMult = intensity === 1 ? 1.0 : (intensity === 2 ? 2.5 : 5.0);
        
        // Base cost: CPM * reach * intensity * duration / 1000
        var totalCost = (market.cpmBase * market.reach * intensityMult * durationWeeks) / 1000;
        
        // Convert to Millions
        return totalCost / 1000000;
    },

    buyTVAd: function(marketId, adType, intensity, durationWeeks, partyOverride) {
        var party = partyOverride || gameData.selectedParty;
        var cost = this.getTVCost(marketId, intensity, durationWeeks);
        
        if (party === gameData.selectedParty) {
            if (gameData.funds < cost) {
                Utils.showToast("Insufficient funds for TV ad buy.");
                return false;
            }
            gameData.funds -= cost;
        } else {
            var ticket = OpponentAI.getTicket(party);
            if (ticket && ticket.pres) {
                if ((ticket.pres.funds || 0) < cost) {
                    return false;
                }
                ticket.pres.funds = (ticket.pres.funds || 0) - cost;
            }
        }
        
        gameData.ads.activeTVAds.push({
            marketId: marketId,
            adType: adType,
            intensity: intensity,
            weeksRemaining: durationWeeks,
            cost: cost,
            party: party
        });

        var partyName = (PARTIES[party] && PARTIES[party].shortName) || party;
        Utils.addLog(`📺 ${partyName} purchased ${durationWeeks}-week TV ad in ${MEDIA_MARKETS[marketId].label} (-$${cost.toFixed(1)}M)`);
        if (typeof updateHUD === 'function') updateHUD();

        // Apply immediate effect for week 1
        this._processTVAd({ marketId: marketId, adType: adType, intensity: intensity, party: party });

        return true;
    },

    _processTVAd: function(ad) {
        var market = MEDIA_MARKETS[ad.marketId];
        if (!market) return;
        
        var typeData = this.AD_TYPES[ad.adType] || this.AD_TYPES['positive'];
        var party = ad.party || gameData.selectedParty;
        
        // Get saturation
        var sat = gameData.ads.tvSaturation[ad.marketId] || 0;
        var satMult = Math.max(0.1, 1.0 - (sat * 0.8)); // Diminishing returns

        // Shift calculation
        var baseShift = 0.005; // 0.5% margin shift base
        var intensityMult = ad.intensity === 1 ? 1.0 : (ad.intensity === 2 ? 1.8 : 2.5);
        var totalShift = baseShift * intensityMult * satMult * typeData.persuasion;
        var totalTurnout = 0.002 * intensityMult * satMult * typeData.turnout;
        
        // Apply shift to all counties in the media market
        var sign = party === 'D' ? 1 : (party === 'R' ? -1 : 0);
        var isTP = party !== 'D' && party !== 'R';

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (county.mediaMarket === ad.marketId && county.v) {
                var totalVotes = (county.v.D || 0) + (county.v.R || 0) + (county.v.I || 0) + (county.v.G || 0) + (county.v.L || 0);
                if (totalVotes === 0) continue;
                
                var shiftVotes = totalVotes * totalShift;
                
                if (isTP) {
                    var pullD = Math.min(shiftVotes * 0.5, county.v.D || 0);
                    var pullR = Math.min(shiftVotes * 0.5, county.v.R || 0);
                    county.v.D = Math.max(0, county.v.D - pullD);
                    county.v.R = Math.max(0, county.v.R - pullR);
                    county.v[party] = (county.v[party] || 0) + pullD + pullR;
                } else if (sign !== 0) {
                    var oppKey = party === 'D' ? 'R' : 'D';
                    var playerKey = party;
                    
                    if (shiftVotes > 0) {
                        var amount = Math.min(shiftVotes, county.v[oppKey] || 0);
                        county.v[oppKey] = Math.max(0, county.v[oppKey] - amount);
                        county.v[playerKey] = (county.v[playerKey] || 0) + amount;
                    } else if (shiftVotes < 0) {
                        var amount = Math.min(-shiftVotes, county.v[playerKey] || 0);
                        county.v[playerKey] = Math.max(0, county.v[playerKey] - amount);
                        county.v[oppKey] = (county.v[oppKey] || 0) + amount;
                    }
                }
            }
        }

        // Increase Saturation
        gameData.ads.tvSaturation[ad.marketId] = Math.min(1.0, sat + (ad.intensity * 0.15));
    },

    // ----------------------------------------
    // DIGITAL ADS LOGIC (Surgical Targeting)
    // ----------------------------------------

    executeDigitalCampaign: function(stateCode, config, partyOverride) {
        var party = partyOverride || gameData.selectedParty;
        
        if (party === gameData.selectedParty) {
            if (gameData.funds < config.totalBudget) {
                Utils.showToast("Insufficient funds.");
                return false;
            }
            gameData.funds -= config.totalBudget;
        } else {
            var ticket = OpponentAI.getTicket(party);
            if (ticket && ticket.pres) {
                if ((ticket.pres.funds || 0) < config.totalBudget) {
                    return false;
                }
                ticket.pres.funds = (ticket.pres.funds || 0) - config.totalBudget;
            }
        }

        // Faction check - Backfire logic
        var ticket = OpponentAI.getTicket(party);
        var candId = party === gameData.selectedParty ? (gameData.playerCandidate || "harris") : (ticket && ticket.pres ? ticket.pres.id : "trump");
        var cand = null;
        if (typeof Utils !== 'undefined' && Utils.getCandidateById) {
            cand = Utils.getCandidateById(candId);
        }
        var faction = cand ? cand.factionId : null;
        var backfire = false;
        
        if (typeof getFactionCompatibility === 'function' && faction) {
            var compat = getFactionCompatibility(faction, config.segment);
            if (compat < 0.6) backfire = true; // Terrible fit, backfires
        }

        var typeData = this.AD_TYPES[config.creative] || this.AD_TYPES['mobilize'];
        var totalPersuasion = 0;
        var totalTurnout = 0;
        
        var statePop = typeof Counties !== 'undefined' ? Counties.getStateRegisteredVoters(stateCode) : 1000000;
        if (statePop < 10000) statePop = 10000;

        for (var platform in config.allocations) {
            var share = config.allocations[platform];
            if (share <= 0) continue;
            var spend = config.totalBudget * share * 1000000;
            
            var pData = this.PLATFORMS[platform] || this.PLATFORMS['meta'];
            var impressions = (spend / pData.cpm) * 1000;
            
            var sat = gameData.ads.digitalSaturation[stateCode][platform] || 0;
            var satFactor = Math.max(0.2, 1 - sat);

            var reach = (impressions / pData.frequency);
            var reachPct = Math.min(1.0, reach / statePop);
            
            var pVal = reachPct * 0.02 * typeData.persuasion * satFactor;
            var tVal = reachPct * 0.01 * typeData.turnout * satFactor;

            if (backfire) {
                pVal *= -0.5; // Loses votes
                tVal *= 0.1;
            }

            totalPersuasion += pVal;
            totalTurnout += tVal;

            gameData.ads.digitalSaturation[stateCode][platform] = Math.min(1.0, sat + 0.1);
        }

        if (gameData.states[stateCode]) {
            var sign = party === 'D' ? 1 : (party === 'R' ? -1 : 0);
            var isTP = party !== 'D' && party !== 'R';
            
            if ((sign !== 0 || isTP) && typeof Counties !== 'undefined') {
                for (var fips in Counties.countyData) {
                    var county = Counties.countyData[fips];
                    if (county.s === stateCode && county.v) {
                        var totalVotes = (county.v.D || 0) + (county.v.R || 0) + (county.v.I || 0) + (county.v.G || 0) + (county.v.L || 0);
                        if (totalVotes === 0) continue;

                        // Further weight by segment presence
                        var segmentWeight = 1.0;
                        if (county.ig && county.ig[config.segment] !== undefined) {
                            segmentWeight = (county.ig[config.segment] / 100) * 1.5;
                        }

                        var shiftPct = totalPersuasion * segmentWeight;
                        var shiftVotes = totalVotes * shiftPct;

                        if (isTP) {
                            var pullD = Math.min(shiftVotes * 0.5, county.v.D || 0);
                            var pullR = Math.min(shiftVotes * 0.5, county.v.R || 0);
                            county.v.D = Math.max(0, county.v.D - pullD);
                            county.v.R = Math.max(0, county.v.R - pullR);
                            county.v[party] = (county.v[party] || 0) + pullD + pullR;
                        } else {
                            var shiftAmt = shiftVotes * sign;
                            var oppKey = party === 'D' ? 'R' : 'D';
                            var playerKey = party;
                            
                            if (shiftAmt > 0) {
                                var amount = Math.min(shiftAmt, county.v[oppKey] || 0);
                                county.v[oppKey] = Math.max(0, county.v[oppKey] - amount);
                                county.v[playerKey] = (county.v[playerKey] || 0) + amount;
                            } else if (shiftAmt < 0) {
                                var amount = Math.min(-shiftAmt, county.v[playerKey] || 0);
                                county.v[playerKey] = Math.max(0, county.v[playerKey] - amount);
                                county.v[oppKey] = (county.v[oppKey] || 0) + amount;
                            }
                        }
                    }
                }
                Counties.updateStateFromCounties(stateCode);
            }
            gameData.states[stateCode].digitalTurnoutBonus = (gameData.states[stateCode].digitalTurnoutBonus || 0) + totalTurnout;
        }

        var partyName = (PARTIES[party] && PARTIES[party].shortName) || party;
        if (backfire) {
            Utils.addLog(`⚠️ DIGITAL AD BACKFIRE in ${STATES[stateCode].name} for ${partyName}! Target segment '${config.segment}' rejected messaging. (-$${config.totalBudget}M)`);
        } else {
            Utils.addLog(`📱 ${partyName} ran Digital Campaign in ${STATES[stateCode].name} targeted at ${config.segment}. (-$${config.totalBudget}M)`);
        }
        
        return true;
    },

    processWeekly: function() {
        if (!gameData.ads) return;
        
        // Decay digital saturation
        for (var code in STATES) {
            var sats = gameData.ads.digitalSaturation[code];
            for (var p in sats) {
                if (sats[p] > 0) sats[p] = Math.max(0, sats[p] - 0.1);
            }
        }

        // Decay TV saturation
        for (var marketId in gameData.ads.tvSaturation) {
            var s = gameData.ads.tvSaturation[marketId];
            if (s > 0) gameData.ads.tvSaturation[marketId] = Math.max(0, s - 0.15);
        }

        // Process active TV Ads
        var activeAds = [];
        for (var i = 0; i < gameData.ads.activeTVAds.length; i++) {
            var ad = gameData.ads.activeTVAds[i];
            ad.weeksRemaining--;
            if (ad.weeksRemaining > 0) {
                this._processTVAd(ad);
                activeAds.push(ad);
            }
        }
        gameData.ads.activeTVAds = activeAds;
    }
};

// Hook into campaign weekly loop
if (typeof Campaign !== 'undefined') {
    let _originalDigitalNextWeek = Campaign.nextWeek;
    if (_originalDigitalNextWeek) {
        Campaign.nextWeek = function() {
            if (typeof DigitalAds !== 'undefined') DigitalAds.processWeekly();
            _originalDigitalNextWeek.apply(this, arguments);
        };
    }
}
