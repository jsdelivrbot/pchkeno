/* */ 
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);
$export($export.S, 'Object', {entries: function entries(it) {
    return $entries(it);
  }});
