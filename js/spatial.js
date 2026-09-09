/* ============================================
   DECISION 2028 - SPATIAL AUTOCORRELATION ENGINE
   Ticket 13: Spatial lag smoothing for county results
   ============================================ */

var Spatial = {
    adjacencyList: {},
    centroids: null,
    isInitialized: false,

    init: function(callback) {
        if (this.isInitialized && Object.keys(this.adjacencyList).length > 0) {
            if (callback) callback();
            return;
        }

        var self = this;
        // Fetch county centroids from just_the_centroids.json
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'just_the_centroids.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        self.centroids = JSON.parse(xhr.responseText);
                        self.buildAdjacencyGraph(6); // k=6 nearest neighbors
                        self.isInitialized = true;
                        console.log('✓ Spatial adjacency graph built for ' + Object.keys(self.adjacencyList).length + ' counties');
                    } catch (e) {
                        console.warn('⚠️ Error parsing centroids JSON:', e);
                    }
                } else {
                    console.warn('⚠️ Failed to load just_the_centroids.json');
                }
                if (callback) callback();
            }
        };
        xhr.send();
    },

    buildAdjacencyGraph: function(kNeighbors) {
        var k = kNeighbors || 6;
        if (!this.centroids) return;

        var entries = [];
        for (var key in this.centroids) {
            var fips = key.startsWith('c') ? key.substring(1) : key;
            var c = this.centroids[key];
            if (c && typeof c.centroidX === 'number' && typeof c.centroidY === 'number') {
                entries.push({ fips: fips.padStart(5, '0'), x: c.centroidX, y: c.centroidY });
            }
        }

        this.adjacencyList = {};

        // For each county, find k nearest neighbors by Euclidean distance of centroids
        for (var i = 0; i < entries.length; i++) {
            var origin = entries[i];
            var distances = [];

            for (var j = 0; j < entries.length; j++) {
                if (i === j) continue;
                var target = entries[j];
                var dx = origin.x - target.x;
                var dy = origin.y - target.y;
                var distSq = dx * dx + dy * dy;
                distances.push({ fips: target.fips, distSq: distSq });
            }

            distances.sort(function(a, b) { return a.distSq - b.distSq; });
            var nearest = [];
            for (var n = 0; n < Math.min(k, distances.length); n++) {
                nearest.push(distances[n].fips);
            }
            this.adjacencyList[origin.fips] = nearest;
        }
    },

    /**
     * Applies spatial autocorrelation smoothing to county swings/shifts.
     * @param {Array<Object>} counties - Array of county objects ({ fips, rawSwing, ... })
     * @param {Object} [customAdjacency] - Optional custom adjacency map
     */
    applySpatialSmoothing: function(counties, customAdjacency) {
        if (!counties || counties.length === 0) return;
        var adj = customAdjacency || this.adjacencyList;
        var rho = (typeof SPATIAL_CONFIG !== 'undefined' && SPATIAL_CONFIG.RHO_SPATIAL_LAG !== undefined)
            ? SPATIAL_CONFIG.RHO_SPATIAL_LAG : 0.15;

        var fipsToCountyMap = {};
        for (var i = 0; i < counties.length; i++) {
            var c = counties[i];
            var fips = (c.fips || c.id || '').padStart(5, '0');
            fipsToCountyMap[fips] = c;
        }

        var smoothedSwings = {};

        for (var j = 0; j < counties.length; j++) {
            var county = counties[j];
            var fipsKey = (county.fips || county.id || '').padStart(5, '0');
            var neighbors = adj[fipsKey] || [];

            var raw = (county.rawSwing !== undefined) ? county.rawSwing : (county.marginShift || county.margin || 0);

            if (neighbors.length === 0) {
                smoothedSwings[fipsKey] = raw;
                continue;
            }

            var sum = 0;
            var validNeighbors = 0;

            for (var n = 0; n < neighbors.length; n++) {
                var nFips = neighbors[n];
                var neighborCounty = fipsToCountyMap[nFips];
                if (neighborCounty) {
                    var nRaw = (neighborCounty.rawSwing !== undefined)
                        ? neighborCounty.rawSwing
                        : (neighborCounty.marginShift || neighborCounty.margin || 0);
                    sum += nRaw;
                    validNeighbors++;
                }
            }

            var neighborAvg = validNeighbors > 0 ? (sum / validNeighbors) : raw;
            smoothedSwings[fipsKey] = (1 - rho) * raw + rho * neighborAvg;
        }

        // Apply back to counties
        for (var k = 0; k < counties.length; k++) {
            var countyObj = counties[k];
            var fipsTarget = (countyObj.fips || countyObj.id || '').padStart(5, '0');
            countyObj.finalSwing = smoothedSwings[fipsTarget];
            if (countyObj.rawSwing !== undefined) {
                countyObj.rawSwing = countyObj.finalSwing;
            }
        }
    }
};

// Standalone export
function applySpatialSmoothing(counties, adjacencyList) {
    Spatial.applySpatialSmoothing(counties, adjacencyList);
}
