/* */ 
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var global = window;

/**
* GameLoader class
*
* This class handles loading the game into the page.
* As games should now be embedded inline in the page already,
* the loader will normally do nothing. 
* You can provide your own GameLoader implementation to the GameManager instance
* if you have other requirements
*/

var GameLoader = function () {
    function GameLoader() {
        _classCallCheck(this, GameLoader);
    }

    _createClass(GameLoader, [{
        key: 'loadGame',


        /**
        * Load the game content into the page
        *
        * @param object The game data/config
        * @param function The callback function to fire when done, accepts error as first arg if failed, otherwise second arg is the success response (if any)
        */
        value: function loadGame(gameModel, callback) {

            // Check if game ready to load
            if (gameModel.hasErrored) {
                callback(gameModel.errorMessage);
                return;
            }

            if (gameModel.isFlashGame) {
                this.loadGameSWF(gameModel, callback);
            } else {
                this.loadGameHTML(gameModel, callback);
            }
        }
    }, {
        key: 'loadGameSWF',
        value: function loadGameSWF(gameModel, callback) {
            this.flashObject = 'htmlgame_frame_div';

            var flashvars = {
                firstname: gameModel.user.firstName,
                lastname: gameModel.user.lastName || '',
                bgImgUrl: gameModel.images.background,
                panelImgUrl: gameModel.images.panel,
                lTileImgUrl: gameModel.images.largeTile,
                sTileImgUrl: gameModel.images.smallTile,
                jtoken: gameModel.jToken
            };

            var params = {
                allowScriptAccess: "always",
                wmode: "opaque"
            };

            var attributes = {
                id: this.flashObject, //PCHGames.flashObject,
                name: this.flashObject //PCHGames.flashObject
            };

            swfobject.embedSWF(gameModel.url, this.flashObject, 700, 350, "9.0.0", "http://cdn.pch.com/spectrum/packagecomponents/swfObject/expressInstall.swf", flashvars, params, attributes);

            callback(null);
        }
    }, {
        key: 'getFlashMovie',
        value: function getFlashMovie() {
            var movieName = this.flashObject;
            if (global.navigator.appName.indexOf("Microsoft") != -1) {
                return global[movieName];
            } else {
                return global.document[movieName];
            }
        }
    }, {
        key: 'loadGameHTML',
        value: function loadGameHTML(gameModel, callback) {
            // html games now expected to be inline in page already
            callback(null);
        }
    }]);

    return GameLoader;
}();

exports.default = GameLoader;