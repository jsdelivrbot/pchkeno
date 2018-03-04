/* */ 
'use strict';
var required = require('requires-port'),
    lolcation = require('./lolcation'),
    qs = require('querystringify'),
    protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
var rules = [['#', 'hash'], ['?', 'query'], ['/', 'pathname'], ['@', 'auth', 1], [NaN, 'host', undefined, 1, 1], [/:(\d+)$/, 'port', undefined, 1], [NaN, 'hostname', undefined, 1, 1]];
function extractProtocol(address) {
  var match = protocolre.exec(address);
  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
      i = path.length,
      last = path[i - 1],
      unshift = false,
      up = 0;
  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0)
        unshift = true;
      path.splice(i, 1);
      up--;
    }
  }
  if (unshift)
    path.unshift('');
  if (last === '.' || last === '..')
    path.push('');
  return path.join('/');
}
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }
  var relative,
      extracted,
      parse,
      instruction,
      index,
      key,
      instructions = rules.slice(),
      type = typeof location,
      url = this,
      i = 0;
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }
  if (parser && 'function' !== typeof parser)
    parser = qs.parse;
  location = lolcation(location);
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;
  if (!extracted.slashes)
    instructions[2] = [/(.*)/, 'pathname'];
  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];
    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }
    url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');
    if (instruction[4])
      url[key] = url[key].toLowerCase();
  }
  if (parser)
    url.query = parser(url.query);
  if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
    url.pathname = resolve(url.pathname, location.pathname);
  }
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }
  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';
  url.href = url.toString();
}
URL.prototype.set = function set(part, value, fn) {
  var url = this;
  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }
      url[part] = value;
      break;
    case 'port':
      url[part] = value;
      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname + ':' + value;
      }
      break;
    case 'hostname':
      url[part] = value;
      if (url.port)
        value += ':' + url.port;
      url.host = value;
      break;
    case 'host':
      url[part] = value;
      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }
      break;
    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;
    case 'pathname':
      url.pathname = value.charAt(0) === '/' ? value : '/' + value;
      break;
    default:
      url[part] = value;
  }
  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];
    if (ins[4])
      url[ins[1]] = url[ins[1]].toLowerCase();
  }
  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';
  url.href = url.toString();
  return url;
};
URL.prototype.toString = function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify)
    stringify = qs.stringify;
  var query,
      url = this,
      protocol = url.protocol;
  if (protocol && protocol.charAt(protocol.length - 1) !== ':')
    protocol += ':';
  var result = protocol + (url.slashes ? '//' : '');
  if (url.username) {
    result += url.username;
    if (url.password)
      result += ':' + url.password;
    result += '@';
  }
  result += url.host + url.pathname;
  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query)
    result += '?' !== query.charAt(0) ? '?' + query : query;
  if (url.hash)
    result += url.hash;
  return result;
};
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;
module.exports = URL;
