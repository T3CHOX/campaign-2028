/* ============================================
   DECISION 2028 - UTILITY FUNCTIONS
   Helper functions used across modules
   ============================================ */

const Utils = {
    // Show toast notification
    showToast:  function(msg) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = msg;
            toast. style.opacity = 1;
            setTimeout(() => { toast.style.opacity = 0; }, 2500);
        }
    },

    // Add to campaign log
    addLog: function(message) {
        gameData.logs.unshift(message);
        if (gameData.logs.length > 50) gameData.logs.pop();
        
        const container = document. getElementById('log-content');
        if (container) {
            container. innerHTML = gameData. logs.map(l => '<p>' + l + '</p>').join('');
        }
    },

    // Get margin-based color for map
    getMarginColor: function(margin) {
        if (margin > 20) return "#004080";
        if (margin > 10) return "#0066cc";
        if (margin > 5) return "#4da6ff";
        if (margin > 0) return "#99ccff";
        if (margin > -5) return "#ff9999";
        if (margin > -10) return "#ff4d4d";
        if (margin > -20) return "#cc0000";
        return "#800000";
    },

    // Format date for display
    formatDate: function(date) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()] + ' ' + date.getDate();
    },

    // Format time for election night
    formatTime: function(timeValue) {
        let hours = Math.floor(timeValue);
        let minutes = Math.floor((timeValue - hours) * 60);
        let ampm = hours >= 12 ?  'PM' :  'AM';
        let displayHours = hours > 12 ? hours - 12 :  hours;
        if (displayHours === 0) displayHours = 12;
        return displayHours + ': ' + minutes.toString().padStart(2, '0') + ' ' + ampm;
    },

    // Check if party is third party
    isThirdParty: function(partyCode) {
        return ['F', 'G', 'L'].includes(partyCode);
    },

    // Deep clone an object
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Shuffle array
    shuffleArray: function(array) {
        return array.slice().sort(() => Math.random() - 0.5);
    }
};
