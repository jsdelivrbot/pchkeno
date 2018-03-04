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
var _utils = require('./utils');
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var LOADED = Symbol("loaded");
var LOADED_RESOLVE = Symbol("loadedResolve");
var LOADED_REJECT = Symbol("loadedReject");
var STARTED = Symbol("started");
var STARTED_RESOLVE = Symbol("startedResolve");
var STARTED_REJECT = Symbol("startedReject");
var ENDED = Symbol("ended");
var ENDED_RESOLVE = Symbol("endedResolve");
var ENDED_REJECT = Symbol("endedReject");
var GameModel = function() {
  function GameModel(gameJson) {
    var _this = this;
    _classCallCheck(this, GameModel);
    (0, _utils.objectAssign)(this, gameJson);
    this._onLoaded = new Promise(function(resolve, reject) {
      _this[LOADED_RESOLVE] = resolve;
      _this[LOADED_REJECT] = reject;
    });
    this._onStarted = new Promise(function(resolve, reject) {
      _this[STARTED_RESOLVE] = resolve;
      _this[STARTED_REJECT] = reject;
    });
    this._onEnded = new Promise(function(resolve, reject) {
      _this[ENDED_RESOLVE] = resolve;
      _this[ENDED_REJECT] = reject;
    });
  }
  _createClass(GameModel, [{
    key: "setLoadedResponse",
    value: function setLoadedResponse(err, resp) {
      if (this[LOADED] !== undefined) {
        console.log("loaded already set");
        return;
      }
      if (err) {
        this.errorResponse = err;
        this[LOADED] = false;
        this[LOADED_REJECT](err);
      } else {
        this.loadedResponse = resp;
        this[LOADED] = true;
        this[LOADED_RESOLVE](resp);
      }
    }
  }, {
    key: "setStartedResponse",
    value: function setStartedResponse(err, startResponse) {
      if (this[STARTED] !== undefined) {
        console.log("started already set");
        return;
      }
      if (err) {
        this.errorResponse = err;
        this[STARTED] = false;
        this[STARTED_REJECT](err);
      } else {
        this.startResponse = startResponse;
        this[STARTED] = true;
        this[STARTED_RESOLVE](startResponse);
      }
    }
  }, {
    key: "setEndedResponse",
    value: function setEndedResponse(err, endResponse) {
      if (this[ENDED] !== undefined) {
        console.log("ended already set");
        return;
      }
      if (err) {
        this[ENDED] = false;
        this.errorResponse = err;
        this[ENDED_REJECT](err);
      } else {
        this[ENDED] = true;
        this.endResponse = endResponse;
        this[ENDED_RESOLVE](endResponse);
      }
    }
  }, {
    key: "getServiceData",
    value: function getServiceData() {
      return this.service && this.service.data || null;
    }
  }, {
    key: "getReturnUrl",
    value: function getReturnUrl() {
      return this.returnURL || this.service.data && this.service.data.returnURL || "/";
    }
  }, {
    key: "getGameId",
    value: function getGameId() {
      return this.game && this.game.id || this.getItemId();
    }
  }, {
    key: "getGamePlayDesc",
    value: function getGamePlayDesc() {
      return this.game && this.game.playDesc || "";
    }
  }, {
    key: "getItemId",
    value: function getItemId() {
      return this.item && this.item.id || this.itemId;
    }
  }, {
    key: "getPathId",
    value: function getPathId() {
      return this.path && this.path.path_id || this.pathId;
    }
  }, {
    key: "getDevice",
    value: function getDevice() {
      return this.device || "desktop";
    }
  }, {
    key: "getAppCode",
    value: function getAppCode() {
      return this.appCode;
    }
  }, {
    key: "getUserEmail",
    value: function getUserEmail() {
      return this.user && this.user.email || this.email;
    }
  }, {
    key: "getUserGmt",
    value: function getUserGmt() {
      return this.user && this.user.gmt || this.gmt;
    }
  }, {
    key: "getSecurityToken",
    value: function getSecurityToken() {
      return this.security_token || this.jToken;
    }
  }, {
    key: "updateSecurityTokenFromResponse",
    value: function updateSecurityTokenFromResponse(resp) {
      this.jToken = resp.body && resp.body.jToken || resp.body.jtoken || null;
      this.security_token = resp.body && resp.body.security_token || resp.body.data && resp.body.data.security_token || this.security_token;
    }
  }, {
    key: "isFlashGame",
    get: function get() {
      return this.type === "SWF";
    }
  }, {
    key: "hasLoaded",
    get: function get() {
      return this[LOADED] === true;
    }
  }, {
    key: "onLoaded",
    get: function get() {
      return this._onLoaded;
    }
  }, {
    key: "hasStarted",
    get: function get() {
      return this[STARTED] === true;
    }
  }, {
    key: "onStarted",
    get: function get() {
      return this._onStarted;
    }
  }, {
    key: "hasEnded",
    get: function get() {
      return this[ENDED] === true;
    }
  }, {
    key: "onEnded",
    get: function get() {
      return this._onEnded;
    }
  }, {
    key: "errorResponse",
    get: function get() {
      return this._errorResponse;
    },
    set: function set(resp) {
      this._errorResponse = resp;
      this.errorMessage = resp.body;
    }
  }, {
    key: "hasErrored",
    get: function get() {
      if (this.errorResponse) {
        return true;
      }
      return typeof this.errorMessage === 'string' && this.errorMessage.length > 0;
    }
  }]);
  return GameModel;
}();
exports.default = GameModel;
