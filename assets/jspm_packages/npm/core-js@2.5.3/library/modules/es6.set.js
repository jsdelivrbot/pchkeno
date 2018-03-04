/* */ 
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';
module.exports = require('./_collection')(SET, function(get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }}, strong);
