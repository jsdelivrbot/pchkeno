/* */ 
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var flashBridge = function flashBridge() {
    var _this = this;

    var popScroll = function popScroll(url, w, h) {
        var popwin = window.open(url, "win", "scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width=" + w + ",height=" + h);
        popwin.window.focus();
    };
    // SWF games inherently call this namespace and there is no way to change
    // it unless the game itself is modified
    global.PCHGames = global.PCHGames || {};
    global.PCHGames.gameStart = function (flashHash) {
        _this.startGame();
        _this.gameModel.onStarted.then(function (startResponse) {
            var myFlash = _this.gameLoader.getFlashMovie();
            var xmlString = startResponse.body.data.iw_response.response || "";
            var IWEreturnFlag = 0;
            if (startResponse.body.status === 'success') {
                IWEreturnFlag = 1;
            }
            myFlash.IWEreturn(IWEreturnFlag, xmlString.xmlResponse);
        });
    };

    global.PCHGames.gameEnd = function (flashHash, flashStatusCode, errorMsg) {
        _this.endGame();
    };

    global.PCHGames.fShowRules = function () {
        popScroll(_this.gameModel.game.rules, 400, 400);
    };

    global.PCHGames.fShowFacts = function () {
        popScroll(_this.gameModel.game.policy, 400, 400);
    };
};

exports.default = flashBridge;