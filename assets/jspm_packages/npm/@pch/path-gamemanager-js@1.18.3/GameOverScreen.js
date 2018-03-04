/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.EVENTS = undefined;
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
var _Dispatcher = require('./Dispatcher');
var _Dispatcher2 = _interopRequireDefault(_Dispatcher);
var _utils = require('./utils');
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
var EVENTS = {
  OPEN: 'gosOpen',
  CLOSE: 'gosClose',
  CONTINUE: 'gosContinue',
  FORFEIT: 'gosForfeit',
  CREATE_PASS: 'gosCreatePass',
  CREATE_PASS_SUCCESS: 'gosCreatePassSuccess'
};
var CONTINUE_BTN_SHOW_CLASS = 'gos__continue-btn--show';
var CLAIM_BTN_SHOW_CLASS = 'gos__claim-btn--show';
var GOS_SHOW_CLASS = "gos--show";
var GOS_CLOSE_CLASS = "gos--close";
var CASH_WIN_CLASS = "gos--cash-win";
var TOKEN_WIN_CLASS = "gos--token-win";
var WIN_SHOW_CLASS = "gos__win--show";
var REG_CLASS = "gos--signedin";
var FULL_REG_CLASS = "gos--fullreg";
var TD_ERROR_CLASS = 'td';
var PATH_FINISHED_CLASS = "gos--path-finished";
var PATH_COMPLETED_CLASS = "gos--path-completed";
var PATH_FINISHED = "finished";
var PATH_COMPLETED = "completed";
var GameOverScreen = function() {
  function GameOverScreen(opts) {
    _classCallCheck(this, GameOverScreen);
    this.opts = Object.assign({
      errorMessages: {
        top: 'We are experiencing technical difficulties',
        main: '',
        youScored: "",
        bottom: 'We are sorry for this inconvenience. Please try again!'
      },
      winMessages: {
        top: "",
        main: "",
        youScored: "You Scored",
        bottom: ""
      }
    }, opts || {});
    if (opts.rootNode) {
      this.mount(opts.rootNode);
    }
    this.dispatcher = opts.dispatcher || _Dispatcher2.default;
    this._autoClaim = false;
    (0, _utils.objectAssign)(this, _eventsjs2.default);
    this.EVENTS = (0, _utils.objectAssign)({}, EVENTS);
  }
  _createClass(GameOverScreen, [{
    key: "mount",
    value: function mount(rootNode) {
      this.rootNode = rootNode;
      this.elements = {
        gos: this.rootNode.querySelector(".gos") || this.rootNode,
        p13n_name: this.rootNode.querySelector(".gos__p13n__name"),
        top_msg: this.rootNode.querySelector('.gos__top-text'),
        main_msg: this.rootNode.querySelector('.gos__main-text'),
        you_won: this.rootNode.querySelector('.gos__you-won'),
        bottom_msg: this.rootNode.querySelector('.gos__bottom-text'),
        claim_btn: this.rootNode.querySelector('.gos__claim-btn'),
        continue_btn: this.rootNode.querySelector('.gos__continue-btn'),
        nothanks_text: this.rootNode.querySelector('.gos__forfeit'),
        inputsContainer: this.rootNode.querySelector('.gos__sso-inputs-container'),
        claimCode: this.rootNode.querySelector('.gos__claim-code'),
        password: this.rootNode.querySelector('#gos_pass'),
        confirmPassword: this.rootNode.querySelector('#gos_confirmpass'),
        persist: this.rootNode.querySelector('#gos_persist')
      };
      if (this.opts.user) {
        if (this.opts.user.gmt) {
          this.elements.gos.classList.add("gos--signedin");
          if (this.elements.p13n_name) {
            this.elements.p13n_name.innerText = this.opts.user.firstName || this.opts.user.email;
          }
        }
        if (this.opts.user.isFullyRegistered) {
          this.elements.gos.classList.add("gos--fullreg");
        }
      }
    }
  }, {
    key: "openClaim",
    value: function openClaim(url) {
      var w = 400,
          h = 400;
      var popwin = window.open(url, "win", "scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width=" + w + ",height=" + h + "");
      popwin.window.focus();
    }
  }, {
    key: "setAutoClaim",
    value: function setAutoClaim(val) {
      this._autoClaim = val;
      if (this._autoClaim) {
        this.showContinueButton();
      } else {
        this.showClaimButton();
      }
    }
  }, {
    key: "setPathStatus",
    value: function setPathStatus(status) {
      this.elements.gos.classList.remove(PATH_FINISHED_CLASS);
      this.elements.gos.classList.remove(PATH_COMPLETED_CLASS);
      if (status) {
        switch (status) {
          case PATH_COMPLETED:
            this.elements.gos.classList.add(PATH_COMPLETED_CLASS);
            break;
          case PATH_FINISHED:
            this.elements.gos.classList.add(PATH_FINISHED_CLASS);
            break;
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(eventName) {
      if (this.dispatcher) {
        this.dispatcher.dispatch(eventName);
      }
      this.fireEvent(eventName);
    }
  }, {
    key: "showClaimButton",
    value: function showClaimButton() {
      this.elements.continue_btn.classList.remove(CONTINUE_BTN_SHOW_CLASS);
      this.elements.claim_btn.classList.add(CLAIM_BTN_SHOW_CLASS);
    }
  }, {
    key: "showContinueButton",
    value: function showContinueButton() {
      this.elements.continue_btn.classList.add(CONTINUE_BTN_SHOW_CLASS);
      this.elements.claim_btn.classList.remove(CLAIM_BTN_SHOW_CLASS);
    }
  }, {
    key: "open",
    value: function open() {
      this.elements.gos.classList.add(GOS_SHOW_CLASS);
      if (this.opts.animInClass) {
        this.elements.gos.classList.add(this.opts.animInClass);
      }
      this.dispatchEvent(EVENTS.OPEN);
    }
  }, {
    key: "close",
    value: function close() {
      if (this.opts.animOutClass) {
        this.elements.gos.classList.add(this.opts.animOutClass);
      } else {
        this.elements.gos.classList.remove(GOS_SHOW_CLASS);
        this.elements.gos.classList.add(GOS_CLOSE_CLASS);
      }
      this.dispatchEvent(EVENTS.CLOSE);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.elements.gos.classList.remove(GOS_SHOW_CLASS);
      this.elements.gos.classList.remove(GOS_CLOSE_CLASS);
      this.elements.gos.classList.remove(TD_ERROR_CLASS);
      this.elements.gos.classList.remove(CASH_WIN_CLASS);
      this.elements.gos.classList.remove(TOKEN_WIN_CLASS);
      this.elements.gos.classList.remove(PATH_FINISHED_CLASS);
      this.elements.gos.classList.remove(PATH_COMPLETED_CLASS);
      if (this.opts.animOutClass) {
        this.elements.gos.classList.remove(this.opts.animOutClass);
      }
      this.showContinueButton();
      this.elements.top_msg.innerHTML = "";
      this.elements.main_msg.innerHTML = "";
      this.elements.you_won.innerText = "";
      this.elements.bottom_msg.innerHTML = "";
      this.elements.claimCode.innerText = "";
      var wins = this.rootNode.querySelectorAll("." + WIN_SHOW_CLASS);
      if (wins) {
        for (var i = 0; i < wins.length; i++) {
          wins[i].classList.remove(WIN_SHOW_CLASS);
          wins[i].querySelector(".gos__win__text").innerHTML = "";
        }
      }
      this.hasError = false;
    }
  }, {
    key: "setup",
    value: function setup(errResponse, serviceResponse) {
      var gosClass = [],
          messages = {};
      if (errResponse) {
        gosClass.push(TD_ERROR_CLASS);
        messages = this.getErrorMessages(errResponse);
        this.hasError = true;
      } else {
        var cashWins = serviceResponse.isCashWinner() ? serviceResponse.getCashWins() : null;
        var tokenWins = serviceResponse.isTokenWinner() ? serviceResponse.getTokenWins() : null;
        if (!cashWins && !tokenWins) {
          throw new Error('GOS must have prizeType information');
        }
        if (cashWins) {
          gosClass.push(CASH_WIN_CLASS);
        }
        if (tokenWins) {
          gosClass.push(TOKEN_WIN_CLASS);
        }
        messages = Object.assign({}, this.getWinMessages(serviceResponse));
        if (cashWins) {
          var claimInfo = cashWins[0].claim_info;
          if (claimInfo) {
            messages.claimCode = claimInfo.code || "";
            messages.claimUrl = claimInfo.form_url || "";
            this.claimInfo = claimInfo;
          }
          this.hasCashWin = true;
        }
        if (cashWins && !this._autoClaim) {
          this.showClaimButton();
        } else {
          this.showContinueButton();
        }
        if (cashWins) {
          cashWins.forEach(this.setupWin.bind(this));
        }
        if (tokenWins) {
          tokenWins.forEach(this.setupWin.bind(this));
        }
      }
      for (var i = 0,
          n = gosClass.length; i < n; i++) {
        this.elements.gos.classList.add(gosClass[i]);
      }
      this.elements.top_msg.innerHTML = messages.top || "";
      this.elements.main_msg.innerHTML = messages.main || "";
      this.elements.you_won.innerText = messages.youScored || "";
      this.elements.bottom_msg.innerHTML = messages.bottom || "";
      this.elements.claimCode.innerText = messages.claimCode || "";
      this.elements.claim_btn.addEventListener('click', this.onClaimClick.bind(this), false);
      this.elements.continue_btn.addEventListener('click', this.onContinueClick.bind(this), false);
      this.elements.nothanks_text.addEventListener('click', this.onForfeitClick.bind(this), false);
      if (errResponse) {
        this.open();
      }
    }
  }, {
    key: "getErrorMessages",
    value: function getErrorMessages(errResponse) {
      return this.opts.errorMessages;
    }
  }, {
    key: "getWinMessages",
    value: function getWinMessages(serviceResponse) {
      return this.opts.winMessages;
    }
  }, {
    key: "setupWin",
    value: function setupWin(win) {
      var winClass = win.type.toLowerCase();
      var winNode = this.rootNode.querySelector(".gos__win--" + winClass);
      winNode.querySelector(".gos__win__text").innerHTML = this.getWinHTML(win);
      winNode.classList.add(WIN_SHOW_CLASS);
    }
  }, {
    key: "getWinHTML",
    value: function getWinHTML(win) {
      return win.description;
    }
  }, {
    key: "onForfeitClick",
    value: function onForfeitClick(ev) {
      this.dispatchEvent(EVENTS.FORFEIT);
    }
  }, {
    key: "onClaimClick",
    value: function onClaimClick(ev) {
      ev.preventDefault();
      if (this.dispatchPassword()) {
        return;
      }
      this.openClaim(this.claimInfo.form_url);
      this.dispatchEvent(EVENTS.CONTINUE);
    }
  }, {
    key: "onContinueClick",
    value: function onContinueClick(ev) {
      ev.preventDefault();
      if (this.dispatchPassword()) {
        return;
      }
      this.dispatchEvent(EVENTS.CONTINUE);
    }
  }, {
    key: "getPasswordElement",
    value: function getPasswordElement() {
      return this.elements.password;
    }
  }, {
    key: "getConfirmPasswordElement",
    value: function getConfirmPasswordElement() {
      return this.elements.confirmPassword;
    }
  }, {
    key: "getPersistElement",
    value: function getPersistElement() {
      return this.elements.persist;
    }
  }, {
    key: "dispatchPassword",
    value: function dispatchPassword() {
      if (this.userNeedsPassword && (this.hasError || !this.hasCashWin)) {
        this.dispatchEvent(EVENTS.CREATE_PASS, this.elements.inputsContainer, this.elements.password, this.elements.confirmPassword, this.elements.persist && this.elements.persist.checked);
        return true;
      }
      return false;
    }
  }]);
  return GameOverScreen;
}();
exports.EVENTS = EVENTS;
exports.default = GameOverScreen;
