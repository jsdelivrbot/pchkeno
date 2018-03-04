/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _GameModel = require('./GameModel');
var _GameModel2 = _interopRequireDefault(_GameModel);
var _GameLoader = require('./GameLoader');
var _GameLoader2 = _interopRequireDefault(_GameLoader);
var _Dispatcher = require('./Dispatcher');
var _Dispatcher2 = _interopRequireDefault(_Dispatcher);
var _GameService = require('./GameService');
var _GameService2 = _interopRequireDefault(_GameService);
var _utils = require('./utils');
var _flashBridge = require('./flashBridge');
var _flashBridge2 = _interopRequireDefault(_flashBridge);
var _GOSManager = require('./GOSManager');
var _GOSManager2 = _interopRequireDefault(_GOSManager);
var _eventsjs = require('@pch/eventsjs');
var _eventsjs2 = _interopRequireDefault(_eventsjs);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var GOS_OPEN = "gosOpen";
var GOS_CREATE_PASS_SUCCESS = "gosCreatePassSuccess";
var GOS_FORFEIT = "gosForfeit";
var GOS_CONTINUE = "gosContinue";
var global = window;
var GameManager = function() {
  _createClass(GameManager, null, [{
    key: "constructGameJsonFromIWEResponse",
    value: function constructGameJsonFromIWEResponse(data, opts) {
      var initJson = (0, _utils.objectAssign)({}, data || {});
      opts = opts || {};
      initJson.game = initJson.item || initJson.game || {};
      initJson.game.path = initJson.path;
      initJson.serviceUri = opts.serviceUri;
      initJson.user = opts.user;
      if (opts.basePackageDomainOverride) {
        initJson.game.base_package_url = initJson.game.base_package_url.replace(/^(https?:)?\/\/[^\/]+\/?/, opts.basePackageDomainOverride);
      }
      initJson.service = {data: {token: initJson.security_token}};
      return initJson;
    }
  }]);
  function GameManager(gameJson, opts) {
    _classCallCheck(this, GameManager);
    opts = opts || {};
    (0, _utils.objectAssign)(this, _eventsjs2.default);
    this.on = this.addEventListener;
    this.off = this.removeEventListener;
    this.gameLoader = opts.gameLoader || new _GameLoader2.default();
    this.dispatcher = opts.dispatcher || _Dispatcher2.default;
    this.service = opts.service || new _GameService2.default();
    this.gosManager = (0, _GOSManager2.default)(opts.gos);
    this.preloader = opts.preloader;
    this.resetGame(gameJson);
    this._onGOSOpen = this.onGOSOpen.bind(this);
    this.dispatcher.on(GOS_OPEN, this._onGOSOpen);
    this._onGOSCreatePassSuccess = this.onGOSCreatePassSuccess.bind(this);
    this.dispatcher.on(GOS_CREATE_PASS_SUCCESS, this._onGOSCreatePassSuccess);
    this._onGOSForfeit = this.onGOSForfeit.bind(this);
    this.dispatcher.on(GOS_FORFEIT, this._onGOSForfeit);
    this.EVENTS = {
      gameloaded: 'gameLoad',
      start: 'gameStart',
      end: 'gameEnd',
      techerror: 'gameTechError'
    };
  }
  _createClass(GameManager, [{
    key: "dispose",
    value: function dispose() {
      if (PCH.gameProxy.isCurrentManager(this)) {
        PCH.gameProxy.resetProxy();
      }
      this.gosManager.reset();
    }
  }, {
    key: "resetGame",
    value: function resetGame(gameJson) {
      this.gameModel = new _GameModel2.default(gameJson);
      this.service.baseUrl = _GameService2.default.buildServiceUri(this.gameModel.serviceUri, {
        appCode: this.gameModel.getAppCode(),
        device: this.gameModel.getDevice(),
        pathId: this.gameModel.getPathId(),
        itemId: this.gameModel.getItemId(),
        email: this.gameModel.getUserEmail(),
        gmt: this.gameModel.getUserGmt()
      });
      this.gameModel.onLoaded.then(this.onGameLoaded.bind(this)).catch(this.onGameFailed.bind(this));
      this.gameModel.onStarted.then(this.onGameStarted.bind(this)).catch(this.onGameFailed.bind(this));
      this.gameModel.onEnded.then(this.onGameEnded.bind(this)).catch(this.onGameFailed.bind(this));
    }
  }, {
    key: "setProxy",
    value: function setProxy() {
      PCH.gameProxy.setGameManager(this);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      this.gameLoader.loadGame(this.gameModel, function(err, resp) {
        _this.gameModel.setLoadedResponse(err, resp);
        if (_this.gameModel.isFlashGame) {
          _flashBridge2.default.bind(_this);
        }
        _this.hidePreloader();
      });
      this.setProxy();
    }
  }, {
    key: "loadGame",
    value: function loadGame() {
      this.init();
    }
  }, {
    key: "hidePreloader",
    value: function hidePreloader() {
      if (!this.preloader) {
        return;
      }
      if (typeof this.preloader === "string") {
        var preloader = document.querySelector(this.preloader);
        if (preloader) {
          preloader.style.display = "none";
        }
      } else if (this.preloader instanceof HTMLElement) {
        this.preloader.style.display = "none";
      } else if (this.preloader.hide && typeof this.preloader.hide === "function") {
        this.preloader.hide();
      }
    }
  }, {
    key: "onGameLoaded",
    value: function onGameLoaded() {
      this.dispatcher.dispatch(this.EVENTS.gameloaded);
    }
  }, {
    key: "onGameStarted",
    value: function onGameStarted(startResponse) {
      this.gameModel.updateSecurityTokenFromResponse(startResponse);
      this.gosManager.setup(this.gameModel, startResponse);
      this.dispatcher.dispatch(this.EVENTS.start, this.gameModel.startResponse.body);
    }
  }, {
    key: "onGameFailed",
    value: function onGameFailed(errResponse) {
      console.log("onGameFailed", errResponse);
      this.gosManager.setupGameFailed(this.gameModel, errResponse);
      this.dispatchEvent({"event": "techerror"});
    }
  }, {
    key: "onGameEnded",
    value: function onGameEnded(endResponse) {
      this.gameModel.updateSecurityTokenFromResponse(endResponse);
      this.gosManager.setupGameEnded(this.gameModel, endResponse);
      this.dispatcher.dispatch(this.EVENTS.end, endResponse.body);
    }
  }, {
    key: "onGOSOpen",
    value: function onGOSOpen() {
      if (global.PCH && global.PCH.uniExp && global.PCH.uniExp.tokenCenter) {
        if (this.gos && this.gos.isTokenWin()) {
          global.PCH.uniExp.tokenCenter.showLastActivity(this.gos.getActivityData());
        }
      }
      this.dispatcher.off(GOS_OPEN, this._onGOSOpen);
      this._onGOSOpen = null;
    }
  }, {
    key: "onGOSCreatePassSuccess",
    value: function onGOSCreatePassSuccess() {
      var _this2 = this;
      this.service.complete(this.gameModel.getSecurityToken(), this.gameModel.getServiceData(), function(err, resp) {
        if (err) {}
        _this2.dispatcher.dispatch(GOS_CONTINUE);
      });
      this.dispatcher.off(GOS_CREATE_PASS_SUCCESS, this._onGOSCreatePassSuccess);
      this._onGOSCreatePassSuccess = null;
    }
  }, {
    key: "onGOSForfeit",
    value: function onGOSForfeit() {
      var _this3 = this;
      this.service.forfeit(this.gameModel.getSecurityToken(), function(err, resp) {
        if (err) {}
        _this3.dispatcher.dispatch(GOS_FORFEIT);
      });
      this.dispatcher.off(GOS_FORFEIT, this._onGOSForfeit);
      this._onGOSForfeit = null;
    }
  }, {
    key: "startGame",
    value: function startGame(gameData) {
      var _this4 = this;
      this.service.start(this.gameModel.getSecurityToken(), this.gameModel.getGameId(), gameData, this.gameModel.getServiceData(), function(err, resp) {
        if (resp && resp.body.path && resp.body.path.status && resp.body.path.status !== "progress") {
          _this4.gameModel.setStartedResponse(_GameService.GameServiceError.createFromResponse(resp));
        } else {
          _this4.gameModel.setStartedResponse(err, resp);
        }
      });
    }
  }, {
    key: "endGame",
    value: function endGame(gameData) {
      var _this5 = this;
      this.service.end(this.gameModel.getSecurityToken(), this.gameModel.getGameId(), gameData, this.gameModel.getServiceData(), function(err, resp) {
        _this5.gameModel.setEndedResponse(err, resp);
      });
    }
  }, {
    key: "interruptGame",
    value: function interruptGame(args) {
      if (PCH.gameProxy.isCurrentManager(this)) {
        PCH.gameProxy.interruptGame(args);
        if (!this.gameModel.hasStarted && PCH.interruptAction) {
          PCH.interruptAction();
        }
      }
    }
  }, {
    key: "gameEvent",
    value: function gameEvent(eventName, data, callback) {
      return this.service.gameEvent(eventName, (0, _utils.objectAssign)({
        "jtoken": this.gameModel.getSecurityToken(),
        "gameid": this.gameModel.getGameId(),
        "gamedata": data,
        "apidata": this.gameModel.getServiceData()
      }, data || {}), callback);
    }
  }, {
    key: "redirect",
    value: function redirect() {
      window.location.href = this.gameModel.getReturnUrl();
    }
  }, {
    key: "error",
    value: function error(msg) {
      console.error(msg);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(ev) {
      var eventName = ev.event;
      if (typeof this[eventName] === 'function') {
        this[eventName](ev);
      }
      if (this.EVENTS[eventName]) {
        this.dispatcher.dispatch(this.EVENTS[eventName], ev);
      } else {
        this.dispatcher.dispatch('game' + eventName.charAt(0).toUpperCase() + eventName.slice(1), ev);
      }
    }
  }, {
    key: "addRequestEventListener",
    value: function addRequestEventListener(eventName, callback) {
      this.service.addEvent(this.service.EVENTS.REQUEST_CALLBACK, function(req, err, resp) {
        if (req.params.event !== eventName) {
          return;
        } else if (err) {
          callback(err);
        } else {
          callback(null, resp);
        }
      });
    }
  }]);
  return GameManager;
}();
exports.default = GameManager;
