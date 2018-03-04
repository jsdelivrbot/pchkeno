window.PCH = window.PCH || {};
window.PCH.LEVELS = window.PCH.LEVELS || {};
PCH.LEVELS.triggerLevelUpCelebration = function(opts) {
    if (!opts) opts = {};
    var _celebrationEndCallback = function() {
        if (typeof opts.celebrationEndCallback == "function") {
            return opts.celebrationEndCallback;
        } else {
            return function() {};
        }
    }
    var environment = function() {
        if (window.location.host.indexOf("dev") != -1) {
            return "dev.";
        }
        if (window.location.host.indexOf("qa") != -1) {
            return "qa.";
        }
        if (window.location.host.indexOf("stg") != -1) {
            return "stg.";
        } else {
            return "";
        }
    }();
    if (window.levelUpCelebrationFileLoaded) {
        PCH.LEVELS.init({
            env: environment,
            gameEndCallback: _celebrationEndCallback()
        })
    } else {
        var cacheBuster = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        $.getScript(window.location.protocol+"//www." + environment + "pch.com/pch_media/js/levelUpCelebration.js?v="+cacheBuster, function() {
            PCH.LEVELS.init({
                env: environment,
                gameEndCallback: _celebrationEndCallback()
            })
        });
    }
}
