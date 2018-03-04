/* */ 
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Dispatcher = {
    dispatch: function dispatch() {
        if (window.PathDispatcher) {
            return window.PathDispatcher.dispatch.apply(window.PathDispatcher, arguments);
        }
    },
    on: function on() {
        if (window.PathDispatcher) {
            return window.PathDispatcher.on.apply(window.PathDispatcher, arguments);
        }
    },
    off: function off() {
        if (window.PathDispatcher) {
            return window.PathDispatcher.off.apply(window.PathDispatcher, arguments);
        }
    }
};
exports.default = Dispatcher;