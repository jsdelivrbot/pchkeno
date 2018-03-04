/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.initGame = exports.PRIZE_TYPES = exports.GameOverScreen = exports.gameProxy = exports.GameService = exports.GameLoader = exports.GameModel = exports.GameManager = undefined;
var _GameModel = require('./GameModel');
var _GameModel2 = _interopRequireDefault(_GameModel);
var _GameLoader = require('./GameLoader');
var _GameLoader2 = _interopRequireDefault(_GameLoader);
var _Dispatcher = require('./Dispatcher');
var _Dispatcher2 = _interopRequireDefault(_Dispatcher);
var _GameService = require('./GameService');
var _GameService2 = _interopRequireDefault(_GameService);
var _gameProxy = require('./gameProxy');
var _gameProxy2 = _interopRequireDefault(_gameProxy);
var _GameManager = require('./GameManager');
var _GameManager2 = _interopRequireDefault(_GameManager);
var _GameOverScreen = require('./GameOverScreen');
var _GameOverScreen2 = _interopRequireDefault(_GameOverScreen);
var _PRIZE_TYPES = require('./PRIZE_TYPES');
var _PRIZE_TYPES2 = _interopRequireDefault(_PRIZE_TYPES);
var _utils = require('./utils');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function initGame(gameJson, opts) {
  var gm = new _GameManager2.default(gameJson, (0, _utils.objectAssign)({
    gameLoader: new _GameLoader2.default(),
    dispatcher: _Dispatcher2.default,
    service: new _GameService2.default(),
    gos: window.GOS,
    preloader: document.querySelector(".game-preloader")
  }, opts || {}));
  if (opts && opts.simulatorAjax) {
    gm.service.ajax = opts.simulatorAjax;
  }
  gm.init();
  return gm;
}
exports.GameManager = _GameManager2.default;
exports.GameModel = _GameModel2.default;
exports.GameLoader = _GameLoader2.default;
exports.GameService = _GameService2.default;
exports.gameProxy = _gameProxy2.default;
exports.GameOverScreen = _GameOverScreen2.default;
exports.PRIZE_TYPES = _PRIZE_TYPES2.default;
exports.initGame = initGame;
exports.default = initGame;
