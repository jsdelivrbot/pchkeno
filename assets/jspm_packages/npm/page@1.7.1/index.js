/* */ 
(function(process) {
  'use strict';
  var pathtoRegexp = require('path-to-regexp');
  module.exports = page;
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';
  var location = ('undefined' !== typeof window) && (window.history.location || window.location);
  var dispatch = true;
  var decodeURLComponents = true;
  var base = '';
  var running;
  var hashbang = false;
  var prevContext;
  function page(path, fn) {
    if ('function' === typeof path) {
      return page('*', path);
    }
    if ('function' === typeof fn) {
      var route = new Route((path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
    } else {
      page.start(path);
    }
  }
  page.callbacks = [];
  page.exits = [];
  page.current = '';
  page.len = 0;
  page.base = function(path) {
    if (0 === arguments.length)
      return base;
    base = path;
  };
  page.start = function(options) {
    options = options || {};
    if (running)
      return;
    running = true;
    if (false === options.dispatch)
      dispatch = false;
    if (false === options.decodeURLComponents)
      decodeURLComponents = false;
    if (false !== options.popstate)
      window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang)
      hashbang = true;
    if (!dispatch)
      return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };
  page.stop = function() {
    if (!running)
      return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };
  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch)
      page.dispatch(ctx);
    if (false !== ctx.handled && false !== push)
      ctx.pushState();
    return ctx;
  };
  page.back = function(path, state) {
    if (page.len > 0) {
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    } else {
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };
  page.redirect = function(from, to) {
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace((to));
        }, 0);
      });
    }
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };
  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save();
    if (false !== dispatch)
      page.dispatch(ctx);
    return ctx;
  };
  page.dispatch = function(ctx) {
    var prev = prevContext,
        i = 0,
        j = 0;
    prevContext = ctx;
    function nextExit() {
      var fn = page.exits[j++];
      if (!fn)
        return nextEnter();
      fn(prev, nextExit);
    }
    function nextEnter() {
      var fn = page.callbacks[i++];
      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn)
        return unhandled(ctx);
      fn(ctx, nextEnter);
    }
    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };
  function unhandled(ctx) {
    if (ctx.handled)
      return;
    var current;
    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }
    if (current === ctx.canonicalPath)
      return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }
    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') {
      return val;
    }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }
  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base))
      path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');
    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang)
      this.path = this.path.replace('#!', '') || '/';
    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#'))
        return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }
  page.Context = Context;
  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };
  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };
  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path, this.keys = [], options);
  }
  page.Route = Route;
  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params))
        return fn(ctx, next);
      next();
    };
  };
  Route.prototype.match = function(path, params) {
    var keys = this.keys,
        qsIndex = path.indexOf('?'),
        pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
        m = this.regexp.exec(decodeURIComponent(pathname));
    if (!m)
      return false;
    for (var i = 1,
        len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }
    return true;
  };
  var onpopstate = (function() {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded)
        return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  function onclick(e) {
    if (1 !== which(e))
      return;
    if (e.metaKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    var el = e.path ? e.path[0] : e.target;
    while (el && 'A' !== el.nodeName)
      el = el.parentNode;
    if (!el || 'A' !== el.nodeName)
      return;
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external')
      return;
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link))
      return;
    if (link && link.indexOf('mailto:') > -1)
      return;
    if (el.target)
      return;
    if (!sameOrigin(el.href))
      return;
    var path = el.pathname + el.search + (el.hash || '');
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }
    var orig = path;
    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }
    if (hashbang)
      path = path.replace('#!', '');
    if (base && orig === path)
      return;
    e.preventDefault();
    page.show(orig);
  }
  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }
  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port)
      origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }
  page.sameOrigin = sameOrigin;
})(require('process'));
