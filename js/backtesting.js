/* ============================================
   DECISION 2028 - VALIDATION & BACKTESTING HARNESS
   Ticket 14: Validation metrics (Brier Score, Log Loss) & Monte Carlo Simulation
   ============================================ */

var Backtesting = {
    
    /**
     * Evaluates model predictions against known election outcomes.
     * @param {Object} predictions - Map of { stateCode: predictedWinProb (0-1) } or { stateCode: predictedVoteShare (0-1) }
     * @param {Object} actualResults - Map of { stateCode: actualPlayerVoteShare (0-1) } or { stateCode: winnerParty }
     * @returns {Object} { brierScore, logLoss, nStates, accuracy }
     */
    evaluatePredictions: function(predictions, actualResults) {
        if (!predictions || !actualResults) return { brierScore: null, logLoss: null };

        var totalBrier = 0;
        var totalLogLoss = 0;
        var correct = 0;
        var states = Object.keys(actualResults);
        var n = states.length;

        if (n === 0) return { brierScore: 0, logLoss: 0, accuracy: 0 };

        for (var i = 0; i < n; i++) {
            var state = states[i];
            var predicted = predictions[state] !== undefined ? predictions[state] : 0.5;
            
            // Normalize predicted probability to 0-1 scale if in 0-100 scale
            if (predicted > 1.0) predicted /= 100.0;

            var actualShare = actualResults[state];
            var actualWin = 0;
            if (typeof actualShare === 'number') {
                if (actualShare > 1.0) actualShare /= 100.0;
                actualWin = (actualShare >= 0.5) ? 1 : 0;
            } else if (typeof actualShare === 'string') {
                actualWin = (actualShare === 'D' || actualShare === (gameData && gameData.selectedParty)) ? 1 : 0;
            }

            // Brier Score component: (p - y)^2
            totalBrier += Math.pow(predicted - actualWin, 2);

            // Log Loss component: -(y * ln(p) + (1-y) * ln(1-p))
            var epsilon = 1e-9;
            var p = clamp(predicted, epsilon, 1 - epsilon);
            totalLogLoss += -(actualWin * Math.log(p) + (1 - actualWin) * Math.log(1 - p));

            if ((predicted >= 0.5 && actualWin === 1) || (predicted < 0.5 && actualWin === 0)) {
                correct++;
            }
        }

        return {
            brierScore: totalBrier / n, // 0 = perfect, 0.25 = random 50/50 guessing
            logLoss: totalLogLoss / n,
            accuracy: (correct / n) * 100,
            nStates: n
        };
    },

    /**
     * Backtests against a historical election polling dataset.
     */
    backtestAgainstHistoricalElection: function(historicalPollingData, actualResults) {
        var predictions = {};
        
        if (typeof historicalPollingData === 'object' && !Array.isArray(historicalPollingData)) {
            predictions = historicalPollingData;
        } else if (Array.isArray(historicalPollingData)) {
            // Aggregate historical polls by state
            var stateSums = {};
            var stateWeights = {};
            for (var i = 0; i < historicalPollingData.length; i++) {
                var p = historicalPollingData[i];
                var st = p.state;
                if (!st) continue;
                var n = p.sampleSize || 800;
                var w = Math.sqrt(n / 1000);
                var val = (p.pollValue !== undefined ? p.pollValue : (p.D || 50));
                if (val > 1) val /= 100.0;
                stateSums[st] = (stateSums[st] || 0) + val * w;
                stateWeights[st] = (stateWeights[st] || 0) + w;
            }
            for (var s in stateSums) {
                predictions[s] = stateSums[s] / stateWeights[s];
            }
        }

        return this.evaluatePredictions(predictions, actualResults);
    },

    /**
     * Runs a Monte Carlo ensemble of election simulations to calculate EV percentiles and win probabilities.
     * @param {Object} [scenarioConfig] - Optional scenario settings
     * @param {number} [numRuns=1000] - Number of simulation runs
     * @returns {Object} { outcomes, median, p10, p90, winProbability }
     */
    runMonteCarloEnsemble: function(scenarioConfig, numRuns) {
        var runs = numRuns || 1000;
        var outcomes = [];
        var playerParty = (gameData && gameData.selectedParty) ? gameData.selectedParty : 'D';

        for (var i = 0; i < runs; i++) {
            var playerEV = 0;

            for (var code in STATES) {
                var s = STATES[code];
                var baseProb = 0.5 + (s.lean || 0) / 100.0;
                
                // Add state-specific and national systematic noise
                var natShock = gaussianNoise(0, 0.025);
                var stateShock = gaussianNoise(0, 0.04);
                var simProb = clamp(baseProb + natShock + stateShock, 0, 1);

                if (playerParty === 'D') {
                    if (simProb >= 0.5) playerEV += s.ev;
                } else if (playerParty === 'R') {
                    if (simProb < 0.5) playerEV += s.ev;
                } else {
                    if (Math.random() < 0.08) playerEV += s.ev;
                }
            }
            outcomes.push(playerEV);
        }

        outcomes.sort(function(a, b) { return a - b; });

        var wins = outcomes.filter(function(ev) { return ev >= 270; }).length;

        return {
            totalRuns: runs,
            outcomes: outcomes,
            median: outcomes[Math.floor(runs / 2)],
            p10: outcomes[Math.floor(runs * 0.10)],
            p90: outcomes[Math.floor(runs * 0.90)],
            winProbability: wins / runs
        };
    }
};

// Global exports
window.Backtesting = Backtesting;
function backtestAgainstHistoricalElection(historicalPollingData, actualResults) {
    return Backtesting.backtestAgainstHistoricalElection(historicalPollingData, actualResults);
}
function runMonteCarloEnsemble(scenarioConfig, numRuns) {
    return Backtesting.runMonteCarloEnsemble(scenarioConfig, numRuns);
}
