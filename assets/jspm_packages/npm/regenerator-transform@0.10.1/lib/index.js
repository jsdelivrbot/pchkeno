/* */ 
"use strict";
exports.__esModule = true;
exports.default = function(context) {
  var plugin = {visitor: require('./visit').visitor};
  var version = context && context.version;
  if (version && parseInt(version, 10) >= 7) {
    plugin.name = "regenerator-transform";
  }
  return plugin;
};
