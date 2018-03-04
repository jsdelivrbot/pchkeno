/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.LegacyGOSManager = exports.GOSManager = undefined;
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
var _GameOverScreen = require('./GameOverScreen');
var _GameOverScreen2 = _interopRequireDefault(_GameOverScreen);
var _utils = require('./utils');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var GOSManager = function() {
  function GOSManager(gosModule) {
    _classCallCheck(this, GOSManager);
    this.gos = gosModule;
  }
  _createClass(GOSManager, [{
    key: "reset",
    value: function reset() {
      if (this.gos) {
        this.gos.reset();
      }
    }
  }, {
    key: "setup",
    value: function setup(gameModel, startResponse) {
      if (this.gos) {
        this.gos.setup(null, startResponse);
      }
    }
  }, {
    key: "setupGameFailed",
    value: function setupGameFailed(gameModel, errResponse) {
      if (this.gos) {
        this.gos.setup(errResponse);
      }
    }
  }, {
    key: "setupGameEnded",
    value: function setupGameEnded(gameModel, endResponse) {
      if (this.gos) {
        var data = endResponse.body.data || {};
        if (data.autoClaim) {
          this.gos.setAutoClaim(true);
        }
        this.gos.setPathStatus(endResponse.body.path && endResponse.body.path.status);
        this.gos.open();
      }
    }
  }]);
  return GOSManager;
}();
var LegacyGOSManager = function() {
  function LegacyGOSManager(gosModule) {
    _classCallCheck(this, LegacyGOSManager);
    this.gos = gosModule;
  }
  _createClass(LegacyGOSManager, [{
    key: "reset",
    value: function reset() {}
  }, {
    key: "setup",
    value: function setup(gameModel, startResponse) {
      if (!this.gos) {
        return;
      }
      var data = startResponse.body.data;
      var response = {};
      var gosData = {};
      if (data && data.iw_response) {
        response = data.iw_response.response || data.iw_response;
      }
      if (startResponse.body.status !== 'error' && response.type !== 'error') {
        gosData = (0, _utils.objectAssign)({}, {
          error: false,
          tokenDesc: gameModel.getGamePlayDesc(),
          prizeType: response.data && response.data.prizeType,
          prizeValue: response.data && response.data.prizeValue
        });
        gosData = (0, _utils.objectAssign)(gosData, response.data && response.data.gos || {});
      } else {
        gosData = (0, _utils.objectAssign)({error: true}, response && response.data && response.data.gos || {});
      }
      this.gos.setup(gosData);
    }
  }, {
    key: "setupGameFailed",
    value: function setupGameFailed(gameModel, errResponse) {
      if (!this.gos) {
        return;
      }
      var data = errResponse && errResponse.body || {};
      var response = null;
      var gosData = {};
      if (data.iw_response) {
        response = data.iw_response.response || data.iw_response;
      }
      gosData = (0, _utils.objectAssign)({error: true}, typeof response !== 'undefined' && response.data ? response.data.gos : null);
      this.gos.setup(gosData);
    }
  }, {
    key: "setupGameEnded",
    value: function setupGameEnded(gameModel, endResponse) {
      if (!this.gos) {
        return;
      }
      var data = endResponse.body.data || {};
      if (data.autoClaim) {
        this.gos.setAutoClaim(true);
      }
      this.gos.open();
    }
  }]);
  return LegacyGOSManager;
}();
function factory(gosModule) {
  if (gosModule && !(gosModule instanceof _GameOverScreen2.default)) {
    return new LegacyGOSManager(gosModule);
  }
  return new GOSManager(gosModule);
}
exports.GOSManager = GOSManager;
exports.LegacyGOSManager = LegacyGOSManager;
exports.default = factory;
