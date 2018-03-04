/* */ 
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
* this remains as a backwards compatible facade
* that the existing games call. It interfaces with GameManager
*/
// internal variables
var startFunction;
var interruptFunction;

var _pendingEventListeners = [];

// internal singelton used to proxy game events to the parent page
var gameProxy = {
    // initalize game once iframe is loaded
    initGame: function initGame(args) {
        startFunction({
            user: args.user,
            game: args.game || args.data && args.data.item || {}
        });
    },
    // send gameEvent data for backend service
    gameEvent: function gameEvent(event, data, cb) {
        console.log("gameEvent", event, data);
        switch (event) {
            case "start":
                this.manager.startGame(data);
                if (cb) {
                    this.manager.gameModel.onStarted.then(function (resp) {
                        if (resp.body.data && resp.body.data.iw_response) {
                            cb(resp.body.data && resp.body.data.iw_response);
                        } else if (resp.body.iw_response) {
                            cb(resp.body.iw_response);
                        } else if (resp.body.data) {
                            cb(resp.body.data);
                        } else {
                            db(resp.body);
                        }
                    });
                }
                break;
            case "end":
                this.manager.endGame(data);
                if (cb) {
                    this.manager.gameModel.onEnded.then(function (resp) {
                        if (resp.body.data && resp.body.data.iw_response) {
                            cb(resp.body.data && resp.body.data.iw_response);
                        } else if (resp.body.iw_response) {
                            cb(resp.body.iw_response);
                        } else if (resp.body.data) {
                            cb(resp.body.data);
                        } else {
                            db(resp.body);
                        }
                    });
                }
                break;
            default:
                this.manager.gameEvent(event, data, function (err, resp) {
                    if (!cb) {
                        return;
                    }
                    if (err) {
                        cb(err.body && err.body.iw_response || err.body && err.body.data || err.body);
                    } else {
                        cb(resp.body && resp.body.iw_response || resp.body && resp.body.data || resp.body);
                    }
                });
                //this.manager.dispatchEvent(data);
                break;
        }
    },
    // gameStart alias to gameEvent
    gameStart: function gameStart(cb) {
        this.gameEvent("start", null, cb);
        //this.gameStart = function() {}; // only callable once
    },
    // gameEnd alias to gameEvent
    gameEnd: function gameEnd(cb) {
        this.gameEvent("end", null, cb);
        //this.gameEnd = function() {}; // only callable once
    },
    // function the game registers to be called later to start the game
    registerStartFunction: function registerStartFunction(fn) {
        startFunction = fn;
        this.registerLoaded();
    },
    // function game registers to be called when interrupt is fired
    registerInterruptFunction: function registerInterruptFunction(fn) {
        interruptFunction = fn;
    },
    interruptGame: function interruptGame(args) {
        if (interruptFunction) {
            interruptFunction(args);
        }
    },
    setGameManager: function setGameManager(manager) {
        this.manager = manager;
        this.registerLoaded();
        if (_pendingEventListeners.length > 0) {
            for (var i = 0, n = _pendingEventListeners.length; i < n; i++) {
                this.manager.on.apply(this.manager, _pendingEventListeners[i]);
            }
            _pendingEventListeners = [];
        }
    },
    isCurrentManager: function isCurrentManager(manager) {
        return manager === this.manager;
    },
    registerLoaded: function registerLoaded() {
        var _this = this;

        if (this.manager && startFunction) {
            this.manager.gameModel.onLoaded.then(function () {
                _this.initGame(_this.manager.gameModel);
            });
        }
    },

    resetProxy: function resetProxy() {
        _pendingEventListeners = [];
        this.manager = null;
        startFunction = null;
        interruptFunction = null;
    },

    // pub/sub proxying to game manager
    // add event listener, see @pch/eventsjs for arguments
    on: function on() {
        if (this.manager) {
            return this.manager.on.apply(this.manager, arguments);
        } else {
            _pendingEventListeners.push(Array.prototype.slice.call(arguments));
        }
    },
    addEventListener: function addEventListener() {
        // alias to on()
        return this.on.apply(this, arguments);
    },

    // remove event listener, see @pch/eventsjs for arguments
    off: function off() {
        if (this.manager) {
            return this.manager.off.apply(this.manager, arguments);
        } else if (_pendingEventListeners.length > 0) {
            var args = Array.prototype.slice.call(arguments);
            var toRemove = [];
            for (var i = 0, n = _pendingEventListeners.length; i < n; i++) {
                if (arraysEqual(_pendingEventListeners[i], args)) {
                    toRemove.push(i);
                }
            }
            for (i = 0, n = toRemove.length; i < n; i++) {
                _pendingEventListeners.splice(i, 1);
            }
        }
    },
    removeEventListener: function removeEventListener() {
        // alias to off()
        return this.off.apply(this, arguments);
    },

    // fire event, see @pch/eventsjs for arguments
    fireEvent: function fireEvent() {
        if (this.manager) {
            return this.manager.fireEvent.apply(this.manager, arguments);
        }
    }
};

function arraysEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null || b === null) {
        return false;
    }
    if (a.length != b.length) {
        return false;
    }

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

// we need to set a global reference to our gameProxy
// because this is what the games call
window.PCH = window.PCH || {};
window.PCH.gameProxy = gameProxy;

// make the internal object public
exports.default = gameProxy;