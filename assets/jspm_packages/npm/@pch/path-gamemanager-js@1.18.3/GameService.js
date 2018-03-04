/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.GameServiceCache = exports.METHODS = exports.GameServiceError = exports.GameServiceResponse = exports.GameServiceRequest = undefined;
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
var _PRIZE_TYPES = require('./PRIZE_TYPES');
var _PRIZE_TYPES2 = _interopRequireDefault(_PRIZE_TYPES);
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
var BASE_URL = Symbol("baseUrl");
var AJAX = Symbol("ajax");
var METHOD_POST = "post";
var METHOD_GET = "get";
var METHODS = {
  POST: METHOD_POST,
  GET: METHOD_GET
};
var GameService = function() {
  _createClass(GameService, null, [{
    key: "buildServiceUri",
    value: function buildServiceUri(template, properties) {
      var serviceUri = template;
      var lowProp;
      for (var prop in properties) {
        lowProp = prop.toLowerCase();
        if (properties.hasOwnProperty(prop)) {
          serviceUri = serviceUri.replace(new RegExp(escapeRegExp('{' + prop + '}'), 'ig'), encodeURIComponent(properties[prop]));
          if ((lowProp === "jtoken" || lowProp === "securitytoken" || lowProp === "security_token") && (!properties.hasOwnProperty("securityToken") && !properties.hasOwnProperty("security_token") || !properties.hasOwnProperty("jtoken") && !properties.hasOwnProperty("jToken"))) {
            serviceUri = serviceUri.replace(/\{jtoken\}/ig, encodeURIComponent(properties[prop]));
            serviceUri = serviceUri.replace(/\{securitytoken\}/ig, encodeURIComponent(properties[prop]));
            serviceUri = serviceUri.replace(/\{security_token\}/ig, encodeURIComponent(properties[prop]));
          }
        }
      }
      return serviceUri;
    }
  }, {
    key: "baseUrl",
    set: function set(url) {
      this[BASE_URL] = ("" + url).replace(/\/$/, '');
    },
    get: function get() {
      return this[BASE_URL];
    }
  }, {
    key: "ajax",
    set: function set(func) {
      this[AJAX] = func;
    },
    get: function get() {
      return this[AJAX] || $ && $.ajax;
    }
  }]);
  function GameService() {
    _classCallCheck(this, GameService);
    (0, _utils.objectAssign)(this, _eventsjs2.default);
    this.EVENTS = {REQUEST_CALLBACK: "onRequestCallback"};
  }
  _createClass(GameService, [{
    key: "getFullResourceUrl",
    value: function getFullResourceUrl(req) {
      return GameService.buildServiceUri(this.baseUrl, req.params);
    }
  }, {
    key: "doRequest",
    value: function doRequest(serviceRequest, callback) {
      var _this = this;
      var responseClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GameServiceResponse;
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      if (opts && opts.cache) {
        if (doCachedRequest(serviceRequest, callback, responseClass, opts)) {
          return;
        }
      }
      this.ajax((0, _utils.objectAssign)({
        type: serviceRequest.method,
        url: this.getFullResourceUrl(serviceRequest),
        headers: serviceRequest.headers,
        data: serviceRequest.serializedBody,
        timeout: serviceRequest.timeout ? serviceRequest.timeout * 1000 : 5000,
        success: function success(data, statusCode, xhr) {
          var resp = new responseClass(data, xhr.status);
          if (GameServiceError.isErrorResponse(resp) || resp.isErrorResponse()) {
            var err = GameServiceError.create(xhr);
            callback(err);
            _this.fireEvent(_this.EVENTS.REQUEST_CALLBACK, serviceRequest, err);
          } else {
            if (opts && opts.cache) {
              cacheResponse(serviceRequest, resp, opts);
            }
            callback(null, resp);
            _this.fireEvent(_this.EVENTS.REQUEST_CALLBACK, serviceRequest, null, resp);
          }
        },
        error: function error(xhr, errorType, _error) {
          var err = GameServiceError.create(xhr);
          callback(err);
          _this.fireEvent(_this.EVENTS.REQUEST_CALLBACK, serviceRequest, err);
        }
      }, this.isJsonP ? {
        jsonp: "callback",
        dataType: "jsonp",
        jsonpCallback: "cors"
      } : {}));
    }
  }, {
    key: "start",
    value: function start(jToken, gameId, gameData, serviceData, callback) {
      var req = new GameServiceRequest("start", {
        "jtoken": jToken,
        "gameid": gameId,
        "apidata": serviceData,
        "gamedata": gameData
      });
      return this.doRequest(req, callback);
    }
  }, {
    key: "end",
    value: function end(jToken, gameId, gameData, serviceData, callback) {
      var req = new GameServiceRequest("end", {
        "jtoken": jToken,
        "gameid": gameId,
        "apidata": serviceData,
        "gamedata": gameData
      });
      return this.doRequest(req, callback);
    }
  }, {
    key: "complete",
    value: function complete(jToken, serviceData, callback) {
      var req = new GameServiceRequest("complete", {
        "jtoken": jToken,
        "apidata": serviceData
      });
      return this.doRequest(req, callback);
    }
  }, {
    key: "gameEvent",
    value: function gameEvent(eventName, reqParams, callback) {
      var req = new GameServiceRequest(eventName, reqParams);
      return this.doRequest(req, callback);
    }
  }, {
    key: "nextGame",
    value: function nextGame(jToken, gameId, callback) {
      var req = new GameServiceRequest("getnextgame", {
        "jtoken": jToken,
        "gameid": gameId
      });
      return this.doRequest(req, callback);
    }
  }, {
    key: "forfeit",
    value: function forfeit(jToken, callback) {
      var req = new GameServiceRequest("forfeit", {"jtoken": jToken});
      return this.doRequest(req, callback);
    }
  }, {
    key: "baseUrl",
    set: function set(url) {
      this[BASE_URL] = url;
    },
    get: function get() {
      return this[BASE_URL] || GameService.baseUrl;
    }
  }, {
    key: "ajax",
    set: function set(func) {
      this[AJAX] = func;
    },
    get: function get() {
      return this[AJAX] || GameService.ajax;
    }
  }, {
    key: "isJsonP",
    get: function get() {
      return this.baseUrl.match(/[&\?]callback\b/);
    }
  }]);
  return GameService;
}();
function queryStringify(params) {
  var s = [];
  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      s.push(encodeURIComponent(k) + "=" + (params[k] !== null ? encodeURIComponent(params[k]) : ""));
    }
  }
  return s.join("&");
}
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var GameServiceRequest = function() {
  function GameServiceRequest(eventName, params, method, headers) {
    _classCallCheck(this, GameServiceRequest);
    this.method = method || METHOD_POST;
    this.params = (0, _utils.objectAssign)({event: eventName}, params || {});
    this.headers = {};
  }
  _createClass(GameServiceRequest, [{
    key: "jsonPosts",
    get: function get() {
      return this._jsonPosts !== false;
    },
    set: function set(val) {
      this._jsonPosts = !!val;
    }
  }, {
    key: "serializedBody",
    get: function get() {
      if (this.method == METHOD_POST) {
        return this.jsonPosts ? JSON.stringify(this.params || {}) : this.queryStringifiedBody;
      }
      return this.queryStringifiedBody;
    }
  }, {
    key: "queryStringifiedBody",
    get: function get() {
      return queryStringify(this.params);
    }
  }, {
    key: "hashKey",
    get: function get() {
      return this.method + "." + this.resource + "?" + this.queryStringifiedBody;
    }
  }]);
  return GameServiceRequest;
}();
var GameServiceResponse = function() {
  function GameServiceResponse(body, statusCode) {
    _classCallCheck(this, GameServiceResponse);
    this.body = body;
    this.responseText = body;
    if (typeof body === "string") {
      try {
        this.body = JSON.parse(body);
      } catch (e) {}
    }
    this.statusCode = statusCode;
  }
  _createClass(GameServiceResponse, [{
    key: "isErrorResponse",
    value: function isErrorResponse() {
      return this.body && this.body.error && this.body.error.code > 0;
    }
  }, {
    key: "isWinner",
    value: function isWinner() {
      var iwResponse = this.iwResponse;
      return iwResponse && iwResponse.wins && iwResponse.wins.length > 0;
    }
  }, {
    key: "isCashWinner",
    value: function isCashWinner() {
      return this.getCashWins().length > 0;
    }
  }, {
    key: "isTokenWinner",
    value: function isTokenWinner() {
      return this.getTokenWins().length > 0;
    }
  }, {
    key: "getWinsByType",
    value: function getWinsByType(type) {
      var typeWins = [];
      var iwResponse = this.iwResponse;
      if (!iwResponse && this.body.tokens && type == _PRIZE_TYPES2.default.TOKEN) {
        typeWins.push({
          type: _PRIZE_TYPES2.default.TOKEN,
          value: this.body.tokens
        });
      } else if (iwResponse && iwResponse.response && iwResponse.response.tokens && type == _PRIZE_TYPES2.default.TOKEN) {
        typeWins.push({
          type: _PRIZE_TYPES2.default.TOKEN,
          value: parseInt(iwResponse.response.tokens, 10)
        });
      } else {
        var wins = iwResponse && iwResponse.wins || [];
        wins.forEach(function(win) {
          if (win.type === type) {
            typeWins.push(win);
          }
        });
      }
      return typeWins;
    }
  }, {
    key: "getCashWins",
    value: function getCashWins() {
      return this.getWinsByType(_PRIZE_TYPES2.default.CASH);
    }
  }, {
    key: "getTokenWins",
    value: function getTokenWins() {
      return this.getWinsByType(_PRIZE_TYPES2.default.TOKEN);
    }
  }, {
    key: "iwResponse",
    get: function get() {
      if (!this.body) {
        return null;
      }
      if (this.body.data && this.body.data.iw_response) {
        return this.body.data.iw_response;
      }
      return this.body.iw_response;
    }
  }]);
  return GameServiceResponse;
}();
var GameServiceError = function() {
  function GameServiceError(statusCode, message, body) {
    _classCallCheck(this, GameServiceError);
    this.statusCode = statusCode;
    this.message = message;
    this.body = body;
  }
  _createClass(GameServiceError, null, [{
    key: "isErrorResponse",
    value: function isErrorResponse(resp) {
      return resp.body.status === "error" || resp.iwResponse && resp.iwResponse.error === true || resp.iwResponse && resp.iwResponse.type === "error";
    }
  }, {
    key: "createDefault",
    value: function createDefault() {
      return new GameServiceError(0, "", {
        status: 0,
        iw_response: {
          type: "error",
          data: {
            code: 37,
            message: "Network Error"
          }
        },
        "jToken": ""
      });
    }
  }, {
    key: "createFromResponse",
    value: function createFromResponse(resp) {
      return new GameServiceError(resp.statusCode, "", resp.body);
    }
  }, {
    key: "create",
    value: function create(xhr) {
      var body = {};
      try {
        body = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {
        body.message = xhr.responseText;
      }
      if (!body.iw_response) {
        return GameServiceError.createDefault();
      }
      return new GameServiceError(xhr.status, body.message || "", body);
    }
  }]);
  return GameServiceError;
}();
function getCacheKey(serviceRequest, opts) {
  var cacheScope = opts && opts.cacheScope || "";
  var cacheKey = "lotto.gameServiceRequest." + (cacheScope ? cacheScope + "." : "") + serviceRequest.hashKey;
  return cacheKey;
}
function getCacheStorage(opts) {
  return opts && opts.cacheStorage || sessionStorage;
}
function doCachedRequest(serviceRequest, callback, responseClass, opts) {
  var cacheKey = getCacheKey(serviceRequest, opts);
  var storage = getCacheStorage(opts);
  try {
    var cached = storage.getItem(cacheKey);
    cached = cached ? JSON.parse(cached) : null;
    if (cached) {
      var resp = new responseClass(cached.body, cached.statusCode);
      callback(null, resp);
      return true;
    }
  } catch (e) {
    console.log("ERROR", e);
  }
  return false;
}
function cacheResponse(serviceRequest, serviceResponse, opts) {
  var cacheKey = getCacheKey(serviceRequest, opts);
  var storage = getCacheStorage(opts);
  storage.setItem(cacheKey, JSON.stringify({
    body: serviceResponse.body,
    statusCode: serviceResponse.statusCode
  }));
}
var GameServiceCache = {
  getCacheKey: getCacheKey,
  doCachedRequest: doCachedRequest,
  cacheResponse: cacheResponse
};
exports.GameServiceRequest = GameServiceRequest;
exports.GameServiceResponse = GameServiceResponse;
exports.GameServiceError = GameServiceError;
exports.METHODS = METHODS;
exports.GameServiceCache = GameServiceCache;
exports.default = GameService;
