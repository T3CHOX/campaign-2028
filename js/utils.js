/* ============================================
   DECISION 2028 - UTILITY FUNCTIONS
   ============================================ */

var Utils = {
    showToast: function(msg) {
        var toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = msg;
            toast.style.opacity = 1;
            setTimeout(function() { toast.style.opacity = 0; }, 2500);
        }
    },

    addLog: function(message) {
        gameData.logs.unshift(message);
        if (gameData.logs.length > 50) gameData.logs.pop();
        
        var container = document.getElementById('log-content');
        if (container) {
            var html = '';
            for (var i = 0; i < gameData.logs.length; i++) {
                html += '<p>' + gameData.logs[i] + '</p>';
            }
            container.innerHTML = html;
        }
    },

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

    formatDate: function(date) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()] + ' ' + date.getDate();
    },

    formatTime: function(timeValue) {
        // Handle time past midnight (24 hours)
        var adjustedTime = timeValue;
        if (timeValue >= 24) {
            adjustedTime = timeValue - 24;
        }
        
        var hours = Math.floor(adjustedTime);
        var minutes = Math.floor((adjustedTime - hours) * 60);
        var ampm = hours >= 12 ? 'PM' : 'AM';
        var displayHours = hours > 12 ? hours - 12 : hours;
        if (displayHours === 0) displayHours = 12;
        return displayHours + ':' + (minutes < 10 ? '0' :  '') + minutes + ' ' + ampm;
    },

    isThirdParty: function(partyCode) {
        return partyCode === 'F' || partyCode === 'G' || partyCode === 'L';
    },

    shuffleArray: function(array) {
        var result = array.slice();
        for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    }
};
