/* ============================================
   DECISION 2028 - ADS UI
   ============================================ */

window.app = window.app || {};
var app = window.app;

Object.assign(app, {
    openAdsModal: function() {
        var modal = document.getElementById('ads-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.populateAdsModal();
        }
    },

    closeAdsModal: function() {
        var modal = document.getElementById('ads-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    switchAdsTab: function(tab) {
        document.getElementById('tab-btn-tv').classList.remove('active');
        document.getElementById('tab-btn-digital').classList.remove('active');
        
        document.getElementById('ads-content-tv').style.display = 'none';
        document.getElementById('ads-content-digital').style.display = 'none';
        
        document.getElementById('tab-btn-' + tab).classList.add('active');
        document.getElementById('ads-content-' + tab).style.display = 'block';
    },

    populateAdsModal: function() {
        // Populate Markets
        var marketSelect = document.getElementById('ads-market-select');
        if (marketSelect && typeof MEDIA_MARKETS !== 'undefined') {
            marketSelect.innerHTML = '<option value="">Select Market...</option>';
            var sortedMarkets = [];
            for (var key in MEDIA_MARKETS) {
                if (MEDIA_MARKETS.hasOwnProperty(key)) {
                    sortedMarkets.push(MEDIA_MARKETS[key]);
                }
            }
            sortedMarkets.sort(function(a, b) {
                return b.reach - a.reach;
            });
            for (var i = 0; i < sortedMarkets.length; i++) {
                var m = sortedMarkets[i];
                var opt = document.createElement('option');
                opt.value = m.id;
                opt.text = m.label + ' (Pop: ' + (m.reach/1000000).toFixed(1) + 'M)';
                marketSelect.appendChild(opt);
            }
        }

        // Populate Digital States
        var stateSelect = document.getElementById('digi-state-select');
        if (stateSelect && typeof STATES !== 'undefined') {
            stateSelect.innerHTML = '<option value="">Select State...</option>';
            var stateKeys = Object.keys(STATES).sort();
            for (var j = 0; j < stateKeys.length; j++) {
                var st = STATES[stateKeys[j]];
                var opt = document.createElement('option');
                opt.value = stateKeys[j];
                opt.text = st.name;
                stateSelect.appendChild(opt);
            }
        }

        this.updateTVCostEstimate();

        // Attach listeners
        if (marketSelect) marketSelect.onchange = this.updateTVCostEstimate.bind(this);
        var tvInt = document.getElementById('ads-tv-intensity');
        var tvDur = document.getElementById('ads-tv-duration');
        if (tvInt) tvInt.onchange = this.updateTVCostEstimate.bind(this);
        if (tvDur) tvDur.onchange = this.updateTVCostEstimate.bind(this);
    },

    updateTVCostEstimate: function() {
        var marketSelect = document.getElementById('ads-market-select');
        var tvInt = document.getElementById('ads-tv-intensity');
        var tvDur = document.getElementById('ads-tv-duration');
        var costDisplay = document.getElementById('ads-tv-cost');

        if (!marketSelect || !tvInt || !tvDur || !costDisplay) return;

        var marketId = marketSelect.value;
        if (!marketId) {
            costDisplay.innerText = '$0.0M';
            return;
        }

        if (typeof DigitalAds !== 'undefined' && DigitalAds.getTVCost) {
            var cost = DigitalAds.getTVCost(marketId, parseInt(tvInt.value, 10), parseInt(tvDur.value, 10));
            costDisplay.innerText = '$' + cost.toFixed(2) + 'M';
            costDisplay.style.color = (gameData.funds >= cost) ? '#4CAF50' : '#DC3545';
        }
    },

    executeTVAd: function() {
        var marketId = document.getElementById('ads-market-select').value;
        var adType = document.getElementById('ads-tv-type').value;
        var intensity = parseInt(document.getElementById('ads-tv-intensity').value, 10);
        var duration = parseInt(document.getElementById('ads-tv-duration').value, 10);

        if (!marketId) {
            Utils.showToast("Please select a media market.");
            return;
        }

        if (typeof DigitalAds !== 'undefined') {
            var success = DigitalAds.buyTVAd(marketId, adType, intensity, duration);
            if (success) {
                this.closeAdsModal();
            }
        }
    },

    executeDigitalAd: function() {
        var stateCode = document.getElementById('digi-state-select').value;
        var segment = document.getElementById('digi-segment-select').value;
        var creative = document.getElementById('digi-creative-select').value;
        var budget = parseFloat(document.getElementById('digi-budget-slider').value);

        if (!stateCode) {
            Utils.showToast("Please select a target state.");
            return;
        }

        var platforms = ['ctv', 'meta', 'search', 'youtube', 'tiktok', 'display'];
        var allocs = {};
        var total = 0;
        for (var i = 0; i < platforms.length; i++) {
            var p = platforms[i];
            var el = document.getElementById('digi-' + p);
            var val = parseInt(el.value, 10) || 0;
            total += val;
            allocs[p] = val / 100;
        }

        if (total !== 100) {
            Utils.showToast("Platform allocations must equal 100%.");
            return;
        }

        var config = {
            totalBudget: budget,
            segment: segment,
            creative: creative,
            allocations: allocs
        };

        if (typeof DigitalAds !== 'undefined') {
            var success = DigitalAds.executeDigitalCampaign(stateCode, config);
            if (success) {
                this.closeAdsModal();
            }
        }
    }
});
