/* */ 
'use strict';
var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
var ignore = {
  hash: 1,
  query: 1
},
    URL;
module.exports = function lolcation(loc) {
  loc = loc || global.location || {};
  URL = URL || require('./index');
  var finaldestination = {},
      type = typeof loc,
      key;
  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore)
      delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore)
        continue;
      finaldestination[key] = loc[key];
    }
    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }
  return finaldestination;
};
