/* */ 
"format cjs";
/*
 * Global dispatcher object.
 *
 * Dispatcher does not enforce any conventions for event names
 * so consuming modules are responsible for consistency etc
 * Suggestion is for modules to create an EVENTS object and define
 * event constants to avoid issues such as typos.
 */
var Dispatcher = function () {
  var listeners = {};

  function dispatch(evt) {
    var args = Array.prototype.slice.call(arguments);
    args = args.slice(1, args.length);

    if (listeners[evt]) {
      listeners[evt].forEach(function (listener) {
        listener.apply(null, args.length > 0 ? args : undefined);
      });
    }
  }

  // evt can be multiple events separated by spaces
  function listen(evt, cb) {
    var evts = evt.split(" ");

    evts.forEach(function (e) {
      if (!listeners[e]) {
        listeners[e] = [];
      }

      listeners[e].push(cb);
    });
  }

  // unhook all handers of event
  function unlisten(evt) {
    if (arguments.length == 1) {
      listeners[evt] = [];
    } else {
      // remove a specific handler
      var handler = Array.prototype.slice.call(arguments)[1];
      listeners[evt] = listeners[evt].filter(function (func) {
        return func != handler;
      });
    }
  }
  return {
    dispatch: dispatch,
    on: listen,
    off: unlisten
  };
}();
window.PathDispatcher = window.PathDispatcher || Dispatcher;
