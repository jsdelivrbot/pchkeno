/* */ 
(function(process) {
  !function(a) {
    function b(a, b, e) {
      return 4 === arguments.length ? c.apply(this, arguments) : void d(a, {
        declarative: !0,
        deps: b,
        declare: e
      });
    }
    function c(a, b, c, e) {
      d(a, {
        declarative: !1,
        deps: b,
        executingRequire: c,
        execute: e
      });
    }
    function d(a, b) {
      b.name = a, a in o || (o[a] = b), b.normalizedDeps = b.deps;
    }
    function e(a, b) {
      if (b[a.groupIndex] = b[a.groupIndex] || [], -1 == p.call(b[a.groupIndex], a)) {
        b[a.groupIndex].push(a);
        for (var c = 0,
            d = a.normalizedDeps.length; d > c; c++) {
          var f = a.normalizedDeps[c],
              g = o[f];
          if (g && !g.evaluated) {
            var h = a.groupIndex + (g.declarative != a.declarative);
            if (void 0 === g.groupIndex || g.groupIndex < h) {
              if (void 0 !== g.groupIndex && (b[g.groupIndex].splice(p.call(b[g.groupIndex], g), 1), 0 == b[g.groupIndex].length))
                throw new TypeError("Mixed dependency cycle detected");
              g.groupIndex = h;
            }
            e(g, b);
          }
        }
      }
    }
    function f(a) {
      var b = o[a];
      b.groupIndex = 0;
      var c = [];
      e(b, c);
      for (var d = !!b.declarative == c.length % 2,
          f = c.length - 1; f >= 0; f--) {
        for (var g = c[f],
            i = 0; i < g.length; i++) {
          var k = g[i];
          d ? h(k) : j(k);
        }
        d = !d;
      }
    }
    function g(a) {
      return s[a] || (s[a] = {
        name: a,
        dependencies: [],
        exports: {},
        importers: []
      });
    }
    function h(b) {
      if (!b.module) {
        var c = b.module = g(b.name),
            d = b.module.exports,
            e = b.declare.call(a, function(a, b) {
              if (c.locked = !0, "object" == typeof a)
                for (var e in a)
                  d[e] = a[e];
              else
                d[a] = b;
              for (var f = 0,
                  g = c.importers.length; g > f; f++) {
                var h = c.importers[f];
                if (!h.locked)
                  for (var i = 0; i < h.dependencies.length; ++i)
                    h.dependencies[i] === c && h.setters[i](d);
              }
              return c.locked = !1, b;
            }, {id: b.name});
        c.setters = e.setters, c.execute = e.execute;
        for (var f = 0,
            i = b.normalizedDeps.length; i > f; f++) {
          var j,
              k = b.normalizedDeps[f],
              l = o[k],
              m = s[k];
          m ? j = m.exports : l && !l.declarative ? j = l.esModule : l ? (h(l), m = l.module, j = m.exports) : j = n(k), m && m.importers ? (m.importers.push(c), c.dependencies.push(m)) : c.dependencies.push(null), c.setters[f] && c.setters[f](j);
        }
      }
    }
    function i(a) {
      var b,
          c = o[a];
      if (c)
        c.declarative ? m(a, []) : c.evaluated || j(c), b = c.module.exports;
      else if (b = n(a), !b)
        throw new Error("Unable to load dependency " + a + ".");
      return (!c || c.declarative) && b && b.__useDefault ? b.default : b;
    }
    function j(b) {
      if (!b.module) {
        var c = {},
            d = b.module = {
              exports: c,
              id: b.name
            };
        if (!b.executingRequire)
          for (var e = 0,
              f = b.normalizedDeps.length; f > e; e++) {
            var g = b.normalizedDeps[e],
                h = o[g];
            h && j(h);
          }
        b.evaluated = !0;
        var l = b.execute.call(a, function(a) {
          for (var c = 0,
              d = b.deps.length; d > c; c++)
            if (b.deps[c] == a)
              return i(b.normalizedDeps[c]);
          throw new TypeError("Module " + a + " not declared as a dependency.");
        }, c, d);
        void 0 !== l && (d.exports = l), c = d.exports, c && c.__esModule ? b.esModule = c : b.esModule = k(c);
      }
    }
    function k(b) {
      var c = {};
      if (("object" == typeof b || "function" == typeof b) && b !== a)
        if (q)
          for (var d in b)
            "default" !== d && l(c, b, d);
        else {
          var e = b && b.hasOwnProperty;
          for (var d in b)
            "default" === d || e && !b.hasOwnProperty(d) || (c[d] = b[d]);
        }
      return c.default = b, r(c, "__useDefault", {value: !0}), c;
    }
    function l(a, b, c) {
      try {
        var d;
        (d = Object.getOwnPropertyDescriptor(b, c)) && r(a, c, d);
      } catch (d) {
        return a[c] = b[c], !1;
      }
    }
    function m(b, c) {
      var d = o[b];
      if (d && !d.evaluated && d.declarative) {
        c.push(b);
        for (var e = 0,
            f = d.normalizedDeps.length; f > e; e++) {
          var g = d.normalizedDeps[e];
          -1 == p.call(c, g) && (o[g] ? m(g, c) : n(g));
        }
        d.evaluated || (d.evaluated = !0, d.module.execute.call(a));
      }
    }
    function n(a) {
      if (u[a])
        return u[a];
      if ("@node/" == a.substr(0, 6))
        return u[a] = k(t(a.substr(6)));
      var b = o[a];
      if (!b)
        throw "Module " + a + " not present.";
      return f(a), m(a, []), o[a] = void 0, b.declarative && r(b.module.exports, "__esModule", {value: !0}), u[a] = b.declarative ? b.module.exports : b.esModule;
    }
    var o = {},
        p = Array.prototype.indexOf || function(a) {
          for (var b = 0,
              c = this.length; c > b; b++)
            if (this[b] === a)
              return b;
          return -1;
        },
        q = !0;
    try {
      Object.getOwnPropertyDescriptor({a: 0}, "a");
    } catch (a) {
      q = !1;
    }
    var r;
    !function() {
      try {
        Object.defineProperty({}, "a", {}) && (r = Object.defineProperty);
      } catch (a) {
        r = function(a, b, c) {
          try {
            a[b] = c.value || c.get.call(a);
          } catch (a) {}
        };
      }
    }();
    var s = {},
        t = "undefined" != typeof System && System._nodeRequire || "undefined" != typeof require && "undefined" != typeof require.resolve && "undefined" != typeof process && process.platform && require,
        u = {"@empty": {}};
    return function(a, d, e, f) {
      return function(g) {
        g(function(g) {
          for (var h = {
            _nodeRequire: t,
            register: b,
            registerDynamic: c,
            get: n,
            set: function(a, b) {
              u[a] = b;
            },
            newModule: function(a) {
              return a;
            }
          },
              i = 0; i < d.length; i++)
            (function(a, b) {
              b && b.__esModule ? u[a] = b : u[a] = k(b);
            })(d[i], arguments[i]);
          f(h);
          var j = n(a[0]);
          if (a.length > 1)
            for (var i = 1; i < a.length; i++)
              n(a[i]);
          return e ? j.default : j;
        });
      };
    };
  }("undefined" != typeof self ? self : global)(["1"], [], !1, function(a) {
    this.require, this.exports, this.module;
    a.register("2", [], function(a) {
      "use strict";
      function b(a, b) {
        if (a === b)
          return !0;
        if (null === a || null === b)
          return !1;
        if (a.length != b.length)
          return !1;
        for (var c = 0; c < a.length; ++c)
          if (a[c] !== b[c])
            return !1;
        return !0;
      }
      var c,
          d,
          e,
          f;
      return {
        setters: [],
        execute: function() {
          e = [], f = {
            initGame: function(a) {
              c({
                user: a.user,
                game: a.game || a.data && a.data.item || {}
              });
            },
            gameEvent: function(a, b, c) {
              switch (console.log("gameEvent", a, b), a) {
                case "start":
                  this.manager.startGame(b), c && this.manager.gameModel.onStarted.then(function(a) {
                    a.body.data && a.body.data.iw_response ? c(a.body.data && a.body.data.iw_response) : a.body.iw_response ? c(a.body.iw_response) : a.body.data ? c(a.body.data) : db(a.body);
                  });
                  break;
                case "end":
                  this.manager.endGame(b), c && this.manager.gameModel.onEnded.then(function(a) {
                    a.body.data && a.body.data.iw_response ? c(a.body.data && a.body.data.iw_response) : a.body.iw_response ? c(a.body.iw_response) : a.body.data ? c(a.body.data) : db(a.body);
                  });
                  break;
                default:
                  this.manager.gameEvent(a, b, function(a, b) {
                    c && c(a ? a.body && a.body.iw_response || a.body && a.body.data || a.body : b.body && b.body.iw_response || b.body && b.body.data || b.body);
                  });
              }
            },
            gameStart: function(a) {
              this.gameEvent("start", null, a);
            },
            gameEnd: function(a) {
              this.gameEvent("end", null, a);
            },
            registerStartFunction: function(a) {
              c = a, this.registerLoaded();
            },
            registerInterruptFunction: function(a) {
              d = a;
            },
            interruptGame: function(a) {
              d && d(a);
            },
            setGameManager: function(a) {
              if (this.manager = a, this.registerLoaded(), e.length > 0) {
                for (var b = 0,
                    c = e.length; b < c; b++)
                  this.manager.on.apply(this.manager, e[b]);
                e = [];
              }
            },
            isCurrentManager: function(a) {
              return a === this.manager;
            },
            registerLoaded: function() {
              var a = this;
              this.manager && c && this.manager.gameModel.onLoaded.then(function() {
                a.initGame(a.manager.gameModel);
              });
            },
            resetProxy: function() {
              e = [], this.manager = null, c = null, d = null;
            },
            on: function() {
              return this.manager ? this.manager.on.apply(this.manager, arguments) : void e.push(Array.prototype.slice.call(arguments));
            },
            addEventListener: function() {
              return this.on.apply(this, arguments);
            },
            off: function() {
              if (this.manager)
                return this.manager.off.apply(this.manager, arguments);
              if (e.length > 0) {
                for (var a = Array.prototype.slice.call(arguments),
                    c = [],
                    d = 0,
                    f = e.length; d < f; d++)
                  b(e[d], a) && c.push(d);
                for (d = 0, f = c.length; d < f; d++)
                  e.splice(d, 1);
              }
            },
            removeEventListener: function() {
              return this.off.apply(this, arguments);
            },
            fireEvent: function() {
              if (this.manager)
                return this.manager.fireEvent.apply(this.manager, arguments);
            }
          }, window.PCH = window.PCH || {}, window.PCH.gameProxy = f, a("default", f);
        }
      };
    }), a.registerDynamic("3", ["4", "5"], !0, function(a, b, c) {
      var d = (this || self, a("4")),
          e = a("5");
      c.exports = function(a) {
        return function(b, c) {
          var f,
              g,
              h = String(e(b)),
              i = d(c),
              j = h.length;
          return i < 0 || i >= j ? a ? "" : void 0 : (f = h.charCodeAt(i), f < 55296 || f > 56319 || i + 1 === j || (g = h.charCodeAt(i + 1)) < 56320 || g > 57343 ? a ? h.charAt(i) : f : a ? h.slice(i, i + 2) : (f - 55296 << 10) + (g - 56320) + 65536);
        };
      };
    }), a.registerDynamic("6", ["3", "7"], !0, function(a, b, c) {
      "use strict";
      var d = (this || self, a("3")(!0));
      a("7")(String, "String", function(a) {
        this._t = String(a), this._i = 0;
      }, function() {
        var a,
            b = this._t,
            c = this._i;
        return c >= b.length ? {
          value: void 0,
          done: !0
        } : (a = d(b, c), this._i += a.length, {
          value: a,
          done: !1
        });
      });
    }), a.registerDynamic("8", [], !0, function(a, b, c) {
      this || self;
      c.exports = function() {};
    }), a.registerDynamic("9", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a, b) {
        return {
          value: b,
          done: !!a
        };
      };
    }), a.registerDynamic("a", ["b", "c", "d", "e", "f"], !0, function(a, b, c) {
      "use strict";
      var d = (this || self, a("b")),
          e = a("c"),
          f = a("d"),
          g = {};
      a("e")(g, a("f")("iterator"), function() {
        return this;
      }), c.exports = function(a, b, c) {
        a.prototype = d.create(g, {next: e(1, c)}), f(a, b + " Iterator");
      };
    }), a.registerDynamic("7", ["10", "11", "12", "e", "13", "14", "a", "d", "b", "f"], !0, function(a, b, c) {
      "use strict";
      var d = (this || self, a("10")),
          e = a("11"),
          f = a("12"),
          g = a("e"),
          h = a("13"),
          i = a("14"),
          j = a("a"),
          k = a("d"),
          l = a("b").getProto,
          m = a("f")("iterator"),
          n = !([].keys && "next" in [].keys()),
          o = "@@iterator",
          p = "keys",
          q = "values",
          r = function() {
            return this;
          };
      c.exports = function(a, b, c, s, t, u, v) {
        j(c, b, s);
        var w,
            x,
            y = function(a) {
              if (!n && a in C)
                return C[a];
              switch (a) {
                case p:
                  return function() {
                    return new c(this, a);
                  };
                case q:
                  return function() {
                    return new c(this, a);
                  };
              }
              return function() {
                return new c(this, a);
              };
            },
            z = b + " Iterator",
            A = t == q,
            B = !1,
            C = a.prototype,
            D = C[m] || C[o] || t && C[t],
            E = D || y(t);
        if (D) {
          var F = l(E.call(new a));
          k(F, z, !0), !d && h(C, o) && g(F, m, r), A && D.name !== q && (B = !0, E = function() {
            return D.call(this);
          });
        }
        if (d && !v || !n && !B && C[m] || g(C, m, E), i[b] = E, i[z] = r, t)
          if (w = {
            values: A ? E : y(q),
            keys: u ? E : y(p),
            entries: A ? y("entries") : E
          }, v)
            for (x in w)
              x in C || f(C, x, w[x]);
          else
            e(e.P + e.F * (n || B), b, w);
        return w;
      };
    }), a.registerDynamic("15", ["8", "9", "14", "16", "7"], !0, function(a, b, c) {
      "use strict";
      var d = (this || self, a("8")),
          e = a("9"),
          f = a("14"),
          g = a("16");
      c.exports = a("7")(Array, "Array", function(a, b) {
        this._t = g(a), this._i = 0, this._k = b;
      }, function() {
        var a = this._t,
            b = this._k,
            c = this._i++;
        return !a || c >= a.length ? (this._t = void 0, e(1)) : "keys" == b ? e(0, c) : "values" == b ? e(0, a[c]) : e(0, [c, a[c]]);
      }, "values"), f.Arguments = f.Array, d("keys"), d("values"), d("entries");
    }), a.registerDynamic("17", ["15", "14"], !0, function(a, b, c) {
      this || self;
      a("15");
      var d = a("14");
      d.NodeList = d.HTMLCollection = d.Array;
    }), a.registerDynamic("18", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a, b, c) {
        if (!(a instanceof b))
          throw TypeError(c + ": use the 'new' operator!");
        return a;
      };
    }), a.registerDynamic("19", ["1a"], !0, function(a, b, c) {
      var d = (this || self, a("1a"));
      c.exports = function(a, b, c, e) {
        try {
          return e ? b(d(c)[0], c[1]) : b(c);
        } catch (b) {
          var f = a.return;
          throw void 0 !== f && d(f.call(a)), b;
        }
      };
    }), a.registerDynamic("1b", ["14", "f"], !0, function(a, b, c) {
      var d = (this || self, a("14")),
          e = a("f")("iterator"),
          f = Array.prototype;
      c.exports = function(a) {
        return void 0 !== a && (d.Array === a || f[e] === a);
      };
    }), a.registerDynamic("4", [], !0, function(a, b, c) {
      var d = (this || self, Math.ceil),
          e = Math.floor;
      c.exports = function(a) {
        return isNaN(a = +a) ? 0 : (a > 0 ? e : d)(a);
      };
    }), a.registerDynamic("1c", ["4"], !0, function(a, b, c) {
      var d = (this || self, a("4")),
          e = Math.min;
      c.exports = function(a) {
        return a > 0 ? e(d(a), 9007199254740991) : 0;
      };
    }), a.registerDynamic("1d", ["1e", "f"], !0, function(a, b, c) {
      var d = (this || self, a("1e")),
          e = a("f")("toStringTag"),
          f = "Arguments" == d(function() {
            return arguments;
          }());
      c.exports = function(a) {
        var b,
            c,
            g;
        return void 0 === a ? "Undefined" : null === a ? "Null" : "string" == typeof(c = (b = Object(a))[e]) ? c : f ? d(b) : "Object" == (g = d(b)) && "function" == typeof b.callee ? "Arguments" : g;
      };
    }), a.registerDynamic("14", [], !0, function(a, b, c) {
      this || self;
      c.exports = {};
    }), a.registerDynamic("1f", ["1d", "f", "14", "20"], !0, function(a, b, c) {
      var d = (this || self, a("1d")),
          e = a("f")("iterator"),
          f = a("14");
      c.exports = a("20").getIteratorMethod = function(a) {
        if (void 0 != a)
          return a[e] || a["@@iterator"] || f[d(a)];
      };
    }), a.registerDynamic("21", ["22", "19", "1b", "1a", "1c", "1f"], !0, function(a, b, c) {
      var d = (this || self, a("22")),
          e = a("19"),
          f = a("1b"),
          g = a("1a"),
          h = a("1c"),
          i = a("1f");
      c.exports = function(a, b, c, j) {
        var k,
            l,
            m,
            n = i(a),
            o = d(c, j, b ? 2 : 1),
            p = 0;
        if ("function" != typeof n)
          throw TypeError(a + " is not iterable!");
        if (f(n))
          for (k = h(a.length); k > p; p++)
            b ? o(g(l = a[p])[0], l[1]) : o(a[p]);
        else
          for (m = n.call(a); !(l = m.next()).done; )
            e(m, o, l.value, b);
      };
    }), a.registerDynamic("23", ["b", "24", "1a", "22"], !0, function(a, b, c) {
      var d = (this || self, a("b").getDesc),
          e = a("24"),
          f = a("1a"),
          g = function(a, b) {
            if (f(a), !e(b) && null !== b)
              throw TypeError(b + ": can't set as prototype!");
          };
      c.exports = {
        set: Object.setPrototypeOf || ("__proto__" in {} ? function(b, c, e) {
          try {
            e = a("22")(Function.call, d(Object.prototype, "__proto__").set, 2), e(b, []), c = !(b instanceof Array);
          } catch (a) {
            c = !0;
          }
          return function(a, b) {
            return g(a, b), c ? a.__proto__ = b : e(a, b), a;
          };
        }({}, !1) : void 0),
        check: g
      };
    }), a.registerDynamic("25", [], !0, function(a, b, c) {
      this || self;
      c.exports = Object.is || function(a, b) {
        return a === b ? 0 !== a || 1 / a === 1 / b : a != a && b != b;
      };
    }), a.registerDynamic("26", ["1a", "27", "f"], !0, function(a, b, c) {
      var d = (this || self, a("1a")),
          e = a("27"),
          f = a("f")("species");
      c.exports = function(a, b) {
        var c,
            g = d(a).constructor;
        return void 0 === g || void 0 == (c = d(g)[f]) ? b : e(c);
      };
    }), a.registerDynamic("28", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a, b, c) {
        var d = void 0 === c;
        switch (b.length) {
          case 0:
            return d ? a() : a.call(c);
          case 1:
            return d ? a(b[0]) : a.call(c, b[0]);
          case 2:
            return d ? a(b[0], b[1]) : a.call(c, b[0], b[1]);
          case 3:
            return d ? a(b[0], b[1], b[2]) : a.call(c, b[0], b[1], b[2]);
          case 4:
            return d ? a(b[0], b[1], b[2], b[3]) : a.call(c, b[0], b[1], b[2], b[3]);
        }
        return a.apply(c, b);
      };
    }), a.registerDynamic("29", ["2a"], !0, function(a, b, c) {
      this || self;
      c.exports = a("2a").document && document.documentElement;
    }), a.registerDynamic("2b", ["24", "2a"], !0, function(a, b, c) {
      var d = (this || self, a("24")),
          e = a("2a").document,
          f = d(e) && d(e.createElement);
      c.exports = function(a) {
        return f ? e.createElement(a) : {};
      };
    }), a.registerDynamic("2c", ["22", "28", "29", "2b", "2a", "1e", "2d"], !0, function(a, b, c) {
      this || self;
      !function(b) {
        var d,
            e,
            f,
            g = a("22"),
            h = a("28"),
            i = a("29"),
            j = a("2b"),
            k = a("2a"),
            b = k.process,
            l = k.setImmediate,
            m = k.clearImmediate,
            n = k.MessageChannel,
            o = 0,
            p = {},
            q = "onreadystatechange",
            r = function() {
              var a = +this;
              if (p.hasOwnProperty(a)) {
                var b = p[a];
                delete p[a], b();
              }
            },
            s = function(a) {
              r.call(a.data);
            };
        l && m || (l = function(a) {
          for (var b = [],
              c = 1; arguments.length > c; )
            b.push(arguments[c++]);
          return p[++o] = function() {
            h("function" == typeof a ? a : Function(a), b);
          }, d(o), o;
        }, m = function(a) {
          delete p[a];
        }, "process" == a("1e")(b) ? d = function(a) {
          b.nextTick(g(r, a, 1));
        } : n ? (e = new n, f = e.port2, e.port1.onmessage = s, d = g(f.postMessage, f, 1)) : k.addEventListener && "function" == typeof postMessage && !k.importScripts ? (d = function(a) {
          k.postMessage(a + "", "*");
        }, k.addEventListener("message", s, !1)) : d = q in j("script") ? function(a) {
          i.appendChild(j("script"))[q] = function() {
            i.removeChild(this), r.call(a);
          };
        } : function(a) {
          setTimeout(g(r, a, 1), 0);
        }), c.exports = {
          set: l,
          clear: m
        };
      }(a("2d"));
    }), a.registerDynamic("2e", ["2a", "2c", "1e", "2d"], !0, function(a, b, c) {
      this || self;
      !function(b) {
        var d,
            e,
            f,
            g = a("2a"),
            h = a("2c").set,
            i = g.MutationObserver || g.WebKitMutationObserver,
            b = g.process,
            j = g.Promise,
            k = "process" == a("1e")(b),
            l = function() {
              var a,
                  c,
                  f;
              for (k && (a = b.domain) && (b.domain = null, a.exit()); d; )
                c = d.domain, f = d.fn, c && c.enter(), f(), c && c.exit(), d = d.next;
              e = void 0, a && a.enter();
            };
        if (k)
          f = function() {
            b.nextTick(l);
          };
        else if (i) {
          var m = 1,
              n = document.createTextNode("");
          new i(l).observe(n, {characterData: !0}), f = function() {
            n.data = m = -m;
          };
        } else
          f = j && j.resolve ? function() {
            j.resolve().then(l);
          } : function() {
            h.call(g, l);
          };
        c.exports = function(a) {
          var c = {
            fn: a,
            next: void 0,
            domain: k && b.domain
          };
          e && (e.next = c), d || (d = c, f()), e = c;
        };
      }(a("2d"));
    }), a.registerDynamic("2f", ["12"], !0, function(a, b, c) {
      var d = (this || self, a("12"));
      c.exports = function(a, b) {
        for (var c in b)
          d(a, c, b[c]);
        return a;
      };
    }), a.registerDynamic("30", ["20", "b", "31", "f"], !0, function(a, b, c) {
      "use strict";
      var d = (this || self, a("20")),
          e = a("b"),
          f = a("31"),
          g = a("f")("species");
      c.exports = function(a) {
        var b = d[a];
        f && b && !b[g] && e.setDesc(b, g, {
          configurable: !0,
          get: function() {
            return this;
          }
        });
      };
    }), a.registerDynamic("32", ["f"], !0, function(a, b, c) {
      var d = (this || self, a("f")("iterator")),
          e = !1;
      try {
        var f = [7][d]();
        f.return = function() {
          e = !0;
        }, Array.from(f, function() {
          throw 2;
        });
      } catch (a) {}
      c.exports = function(a, b) {
        if (!b && !e)
          return !1;
        var c = !1;
        try {
          var f = [7],
              g = f[d]();
          g.next = function() {
            return {done: c = !0};
          }, f[d] = function() {
            return g;
          }, a(f);
        } catch (a) {}
        return c;
      };
    }), a.registerDynamic("33", [], !0, function(a, b, c) {
      function d() {
        throw new Error("setTimeout has not been defined");
      }
      function e() {
        throw new Error("clearTimeout has not been defined");
      }
      function f(a) {
        if (l === setTimeout)
          return setTimeout(a, 0);
        if ((l === d || !l) && setTimeout)
          return l = setTimeout, setTimeout(a, 0);
        try {
          return l(a, 0);
        } catch (b) {
          try {
            return l.call(null, a, 0);
          } catch (b) {
            return l.call(this, a, 0);
          }
        }
      }
      function g(a) {
        if (m === clearTimeout)
          return clearTimeout(a);
        if ((m === e || !m) && clearTimeout)
          return m = clearTimeout, clearTimeout(a);
        try {
          return m(a);
        } catch (b) {
          try {
            return m.call(null, a);
          } catch (b) {
            return m.call(this, a);
          }
        }
      }
      function h() {
        q && o && (q = !1, o.length ? p = o.concat(p) : r = -1, p.length && i());
      }
      function i() {
        if (!q) {
          var a = f(h);
          q = !0;
          for (var b = p.length; b; ) {
            for (o = p, p = []; ++r < b; )
              o && o[r].run();
            r = -1, b = p.length;
          }
          o = null, q = !1, g(a);
        }
      }
      function j(a, b) {
        this.fun = a, this.array = b;
      }
      function k() {}
      var l,
          m,
          n = (this || self, c.exports = {});
      !function() {
        try {
          l = "function" == typeof setTimeout ? setTimeout : d;
        } catch (a) {
          l = d;
        }
        try {
          m = "function" == typeof clearTimeout ? clearTimeout : e;
        } catch (a) {
          m = e;
        }
      }();
      var o,
          p = [],
          q = !1,
          r = -1;
      n.nextTick = function(a) {
        var b = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var c = 1; c < arguments.length; c++)
            b[c - 1] = arguments[c];
        p.push(new j(a, b)), 1 !== p.length || q || f(i);
      }, j.prototype.run = function() {
        this.fun.apply(null, this.array);
      }, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = k, n.addListener = k, n.once = k, n.off = k, n.removeListener = k, n.removeAllListeners = k, n.emit = k, n.prependListener = k, n.prependOnceListener = k, n.listeners = function(a) {
        return [];
      }, n.binding = function(a) {
        throw new Error("process.binding is not supported");
      }, n.cwd = function() {
        return "/";
      }, n.chdir = function(a) {
        throw new Error("process.chdir is not supported");
      }, n.umask = function() {
        return 0;
      };
    }), a.registerDynamic("34", ["33"], !0, function(a, b, c) {
      this || self;
      c.exports = a("33");
    }), a.registerDynamic("35", ["34"], !0, function(b, c, d) {
      this || self;
      d.exports = a._nodeRequire ? process : b("34");
    }), a.registerDynamic("2d", ["35"], !0, function(a, b, c) {
      this || self;
      c.exports = a("35");
    }), a.registerDynamic("36", ["b", "10", "2a", "22", "1d", "11", "24", "1a", "27", "18", "21", "23", "25", "f", "26", "2e", "31", "2f", "d", "30", "20", "32", "2d"], !0, function(a, b, c) {
      this || self;
      !function(b) {
        "use strict";
        var c,
            d = a("b"),
            e = a("10"),
            f = a("2a"),
            g = a("22"),
            h = a("1d"),
            i = a("11"),
            j = a("24"),
            k = a("1a"),
            l = a("27"),
            m = a("18"),
            n = a("21"),
            o = a("23").set,
            p = a("25"),
            q = a("f")("species"),
            r = a("26"),
            s = a("2e"),
            t = "Promise",
            b = f.process,
            u = "process" == h(b),
            v = f[t],
            w = function() {},
            x = function(a) {
              var b,
                  c = new v(w);
              return a && (c.constructor = function(a) {
                a(w, w);
              }), (b = v.resolve(c)).catch(w), b === c;
            },
            y = function() {
              function b(a) {
                var c = new v(a);
                return o(c, b.prototype), c;
              }
              var c = !1;
              try {
                if (c = v && v.resolve && x(), o(b, v), b.prototype = d.create(v.prototype, {constructor: {value: b}}), b.resolve(5).then(function() {}) instanceof b || (c = !1), c && a("31")) {
                  var e = !1;
                  v.resolve(d.setDesc({}, "then", {get: function() {
                      e = !0;
                    }})), c = e;
                }
              } catch (a) {
                c = !1;
              }
              return c;
            }(),
            z = function(a, b) {
              return !(!e || a !== v || b !== c) || p(a, b);
            },
            A = function(a) {
              var b = k(a)[q];
              return void 0 != b ? b : a;
            },
            B = function(a) {
              var b;
              return !(!j(a) || "function" != typeof(b = a.then)) && b;
            },
            C = function(a) {
              var b,
                  c;
              this.promise = new a(function(a, d) {
                if (void 0 !== b || void 0 !== c)
                  throw TypeError("Bad Promise constructor");
                b = a, c = d;
              }), this.resolve = l(b), this.reject = l(c);
            },
            D = function(a) {
              try {
                a();
              } catch (a) {
                return {error: a};
              }
            },
            E = function(a, c) {
              if (!a.n) {
                a.n = !0;
                var d = a.c;
                s(function() {
                  for (var e = a.v,
                      g = 1 == a.s,
                      h = 0,
                      i = function(b) {
                        var c,
                            d,
                            f = g ? b.ok : b.fail,
                            h = b.resolve,
                            i = b.reject;
                        try {
                          f ? (g || (a.h = !0), c = f === !0 ? e : f(e), c === b.promise ? i(TypeError("Promise-chain cycle")) : (d = B(c)) ? d.call(c, h, i) : h(c)) : i(e);
                        } catch (a) {
                          i(a);
                        }
                      }; d.length > h; )
                    i(d[h++]);
                  d.length = 0, a.n = !1, c && setTimeout(function() {
                    var c,
                        d,
                        g = a.p;
                    F(g) && (u ? b.emit("unhandledRejection", e, g) : (c = f.onunhandledrejection) ? c({
                      promise: g,
                      reason: e
                    }) : (d = f.console) && d.error && d.error("Unhandled promise rejection", e)), a.a = void 0;
                  }, 1);
                });
              }
            },
            F = function(a) {
              var b,
                  c = a._d,
                  d = c.a || c.c,
                  e = 0;
              if (c.h)
                return !1;
              for (; d.length > e; )
                if (b = d[e++], b.fail || !F(b.promise))
                  return !1;
              return !0;
            },
            G = function(a) {
              var b = this;
              b.d || (b.d = !0, b = b.r || b, b.v = a, b.s = 2, b.a = b.c.slice(), E(b, !0));
            },
            H = function(a) {
              var b,
                  c = this;
              if (!c.d) {
                c.d = !0, c = c.r || c;
                try {
                  if (c.p === a)
                    throw TypeError("Promise can't be resolved itself");
                  (b = B(a)) ? s(function() {
                    var d = {
                      r: c,
                      d: !1
                    };
                    try {
                      b.call(a, g(H, d, 1), g(G, d, 1));
                    } catch (a) {
                      G.call(d, a);
                    }
                  }) : (c.v = a, c.s = 1, E(c, !1));
                } catch (a) {
                  G.call({
                    r: c,
                    d: !1
                  }, a);
                }
              }
            };
        y || (v = function(a) {
          l(a);
          var b = this._d = {
            p: m(this, v, t),
            c: [],
            a: void 0,
            s: 0,
            d: !1,
            v: void 0,
            h: !1,
            n: !1
          };
          try {
            a(g(H, b, 1), g(G, b, 1));
          } catch (a) {
            G.call(b, a);
          }
        }, a("2f")(v.prototype, {
          then: function(a, b) {
            var c = new C(r(this, v)),
                d = c.promise,
                e = this._d;
            return c.ok = "function" != typeof a || a, c.fail = "function" == typeof b && b, e.c.push(c), e.a && e.a.push(c), e.s && E(e, !1), d;
          },
          catch: function(a) {
            return this.then(void 0, a);
          }
        })), i(i.G + i.W + i.F * !y, {Promise: v}), a("d")(v, t), a("30")(t), c = a("20")[t], i(i.S + i.F * !y, t, {reject: function(a) {
            var b = new C(this),
                c = b.reject;
            return c(a), b.promise;
          }}), i(i.S + i.F * (!y || x(!0)), t, {resolve: function(a) {
            if (a instanceof v && z(a.constructor, this))
              return a;
            var b = new C(this),
                c = b.resolve;
            return c(a), b.promise;
          }}), i(i.S + i.F * !(y && a("32")(function(a) {
          v.all(a).catch(function() {});
        })), t, {
          all: function(a) {
            var b = A(this),
                c = new C(b),
                e = c.resolve,
                f = c.reject,
                g = [],
                h = D(function() {
                  n(a, !1, g.push, g);
                  var c = g.length,
                      h = Array(c);
                  c ? d.each.call(g, function(a, d) {
                    var g = !1;
                    b.resolve(a).then(function(a) {
                      g || (g = !0, h[d] = a, --c || e(h));
                    }, f);
                  }) : e(h);
                });
            return h && f(h.error), c.promise;
          },
          race: function(a) {
            var b = A(this),
                c = new C(b),
                d = c.reject,
                e = D(function() {
                  n(a, !1, function(a) {
                    b.resolve(a).then(c.resolve, d);
                  });
                });
            return e && d(e.error), c.promise;
          }
        });
      }(a("2d"));
    }), a.registerDynamic("37", ["38", "6", "17", "36", "20"], !0, function(a, b, c) {
      this || self;
      a("38"), a("6"), a("17"), a("36"), c.exports = a("20").Promise;
    }), a.registerDynamic("39", ["37"], !0, function(a, b, c) {
      this || self;
      c.exports = {
        default: a("37"),
        __esModule: !0
      };
    }), a.register("3a", ["39", "3c", "3d", "3e", "3b"], function(a) {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p;
      return {
        setters: [function(a) {
          b = a.default;
        }, function(a) {
          c = a.default;
        }, function(a) {
          d = a.default;
        }, function(a) {
          e = a.default;
        }, function(a) {
          f = a.objectAssign;
        }],
        execute: function() {
          "use strict";
          g = e("loaded"), h = e("loadedResolve"), i = e("loadedReject"), j = e("started"), k = e("startedResolve"), l = e("startedReject"), m = e("ended"), n = e("endedResolve"), o = e("endedReject"), p = function() {
            function a(c) {
              var e = this;
              d(this, a), f(this, c), this._onLoaded = new b(function(a, b) {
                e[h] = a, e[i] = b;
              }), this._onStarted = new b(function(a, b) {
                e[k] = a, e[l] = b;
              }), this._onEnded = new b(function(a, b) {
                e[n] = a, e[o] = b;
              });
            }
            return c(a, [{
              key: "setLoadedResponse",
              value: function(a, b) {
                return void 0 !== this[g] ? void console.log("loaded already set") : void(a ? (this.errorResponse = a, this[g] = !1, this[i](a)) : (this.loadedResponse = b, this[g] = !0, this[h](b)));
              }
            }, {
              key: "setStartedResponse",
              value: function(a, b) {
                return void 0 !== this[j] ? void console.log("started already set") : void(a ? (this.errorResponse = a, this[j] = !1, this[l](a)) : (this.startResponse = b, this[j] = !0, this[k](b)));
              }
            }, {
              key: "setEndedResponse",
              value: function(a, b) {
                return void 0 !== this[m] ? void console.log("ended already set") : void(a ? (this[m] = !1, this.errorResponse = a, this[o](a)) : (this[m] = !0, this.endResponse = b, this[n](b)));
              }
            }, {
              key: "getServiceData",
              value: function() {
                return this.service && this.service.data || null;
              }
            }, {
              key: "getReturnUrl",
              value: function() {
                return this.returnURL || this.service.data && this.service.data.returnURL || "/";
              }
            }, {
              key: "getGameId",
              value: function() {
                return this.game && this.game.id || this.getItemId();
              }
            }, {
              key: "getGamePlayDesc",
              value: function() {
                return this.game && this.game.playDesc || "";
              }
            }, {
              key: "getItemId",
              value: function() {
                return this.item && this.item.id || this.itemId;
              }
            }, {
              key: "getPathId",
              value: function() {
                return this.path && this.path.path_id || this.pathId;
              }
            }, {
              key: "getDevice",
              value: function() {
                return this.device || "desktop";
              }
            }, {
              key: "getAppCode",
              value: function() {
                return this.appCode;
              }
            }, {
              key: "getUserEmail",
              value: function() {
                return this.user && this.user.email || this.email;
              }
            }, {
              key: "getUserGmt",
              value: function() {
                return this.user && this.user.gmt || this.gmt;
              }
            }, {
              key: "getSecurityToken",
              value: function() {
                return this.security_token || this.jToken;
              }
            }, {
              key: "updateSecurityTokenFromResponse",
              value: function(a) {
                this.jToken = a.body && a.body.jToken || a.body.jtoken || null, this.security_token = a.body && a.body.security_token || a.body.data && a.body.data.security_token || this.security_token;
              }
            }, {
              key: "isFlashGame",
              get: function() {
                return "SWF" === this.type;
              }
            }, {
              key: "hasLoaded",
              get: function() {
                return this[g] === !0;
              }
            }, {
              key: "onLoaded",
              get: function() {
                return this._onLoaded;
              }
            }, {
              key: "hasStarted",
              get: function() {
                return this[j] === !0;
              }
            }, {
              key: "onStarted",
              get: function() {
                return this._onStarted;
              }
            }, {
              key: "hasEnded",
              get: function() {
                return this[m] === !0;
              }
            }, {
              key: "onEnded",
              get: function() {
                return this._onEnded;
              }
            }, {
              key: "errorResponse",
              get: function() {
                return this._errorResponse;
              },
              set: function(a) {
                this._errorResponse = a, this.errorMessage = a.body;
              }
            }, {
              key: "hasErrored",
              get: function() {
                return !!this.errorResponse || "string" == typeof this.errorMessage && this.errorMessage.length > 0;
              }
            }]), a;
          }(), a("default", p);
        }
      };
    }), a.register("3f", ["3c", "3d"], function(a) {
      var b,
          c,
          d,
          e;
      return {
        setters: [function(a) {
          b = a.default;
        }, function(a) {
          c = a.default;
        }],
        execute: function() {
          "use strict";
          d = window, e = function() {
            function a() {
              c(this, a);
            }
            return b(a, [{
              key: "loadGame",
              value: function(a, b) {
                return a.hasErrored ? void b(a.errorMessage) : void(a.isFlashGame ? this.loadGameSWF(a, b) : this.loadGameHTML(a, b));
              }
            }, {
              key: "loadGameSWF",
              value: function(a, b) {
                this.flashObject = "htmlgame_frame_div";
                var c = {
                  firstname: a.user.firstName,
                  lastname: a.user.lastName || "",
                  bgImgUrl: a.images.background,
                  panelImgUrl: a.images.panel,
                  lTileImgUrl: a.images.largeTile,
                  sTileImgUrl: a.images.smallTile,
                  jtoken: a.jToken
                },
                    d = {
                      allowScriptAccess: "always",
                      wmode: "opaque"
                    },
                    e = {
                      id: this.flashObject,
                      name: this.flashObject
                    };
                swfobject.embedSWF(a.url, this.flashObject, 700, 350, "9.0.0", "http://cdn.pch.com/spectrum/packagecomponents/swfObject/expressInstall.swf", c, d, e), b(null);
              }
            }, {
              key: "getFlashMovie",
              value: function() {
                var a = this.flashObject;
                return d.navigator.appName.indexOf("Microsoft") != -1 ? d[a] : d.document[a];
              }
            }, {
              key: "loadGameHTML",
              value: function(a, b) {
                b(null);
              }
            }]), a;
          }(), a("default", e);
        }
      };
    }), a.registerDynamic("31", ["40"], !0, function(a, b, c) {
      this || self;
      c.exports = !a("40")(function() {
        return 7 != Object.defineProperty({}, "a", {get: function() {
            return 7;
          }}).a;
      });
    }), a.registerDynamic("e", ["b", "c", "31"], !0, function(a, b, c) {
      var d = (this || self, a("b")),
          e = a("c");
      c.exports = a("31") ? function(a, b, c) {
        return d.setDesc(a, b, e(1, c));
      } : function(a, b, c) {
        return a[b] = c, a;
      };
    }), a.registerDynamic("12", ["e"], !0, function(a, b, c) {
      this || self;
      c.exports = a("e");
    }), a.registerDynamic("13", [], !0, function(a, b, c) {
      var d = (this || self, {}.hasOwnProperty);
      c.exports = function(a, b) {
        return d.call(a, b);
      };
    }), a.registerDynamic("d", ["b", "13", "f"], !0, function(a, b, c) {
      var d = (this || self, a("b").setDesc),
          e = a("13"),
          f = a("f")("toStringTag");
      c.exports = function(a, b, c) {
        a && !e(a = c ? a : a.prototype, f) && d(a, f, {
          configurable: !0,
          value: b
        });
      };
    }), a.registerDynamic("41", ["2a"], !0, function(a, b, c) {
      var d = this || self,
          d = a("2a"),
          e = "__core-js_shared__",
          f = d[e] || (d[e] = {});
      c.exports = function(a) {
        return f[a] || (f[a] = {});
      };
    }), a.registerDynamic("42", [], !0, function(a, b, c) {
      var d = (this || self, 0),
          e = Math.random();
      c.exports = function(a) {
        return "Symbol(".concat(void 0 === a ? "" : a, ")_", (++d + e).toString(36));
      };
    }), a.registerDynamic("f", ["41", "42", "2a"], !0, function(a, b, c) {
      var d = (this || self, a("41")("wks")),
          e = a("42"),
          f = a("2a").Symbol;
      c.exports = function(a) {
        return d[a] || (d[a] = f && f[a] || (f || e)("Symbol." + a));
      };
    }), a.registerDynamic("43", ["b", "16"], !0, function(a, b, c) {
      var d = (this || self, a("b")),
          e = a("16");
      c.exports = function(a, b) {
        for (var c,
            f = e(a),
            g = d.getKeys(f),
            h = g.length,
            i = 0; h > i; )
          if (f[c = g[i++]] === b)
            return c;
      };
    }), a.registerDynamic("44", ["16", "b"], !0, function(a, b, c) {
      var d = (this || self, a("16")),
          e = a("b").getNames,
          f = {}.toString,
          g = "object" == typeof window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
          h = function(a) {
            try {
              return e(a);
            } catch (a) {
              return g.slice();
            }
          };
      c.exports.get = function(a) {
        return g && "[object Window]" == f.call(a) ? h(a) : e(d(a));
      };
    }), a.registerDynamic("45", ["b"], !0, function(a, b, c) {
      var d = (this || self, a("b"));
      c.exports = function(a) {
        var b = d.getKeys(a),
            c = d.getSymbols;
        if (c)
          for (var e,
              f = c(a),
              g = d.isEnum,
              h = 0; f.length > h; )
            g.call(a, e = f[h++]) && b.push(e);
        return b;
      };
    }), a.registerDynamic("46", ["1e"], !0, function(a, b, c) {
      var d = (this || self, a("1e"));
      c.exports = Array.isArray || function(a) {
        return "Array" == d(a);
      };
    }), a.registerDynamic("24", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a) {
        return "object" == typeof a ? null !== a : "function" == typeof a;
      };
    }), a.registerDynamic("1a", ["24"], !0, function(a, b, c) {
      var d = (this || self, a("24"));
      c.exports = function(a) {
        if (!d(a))
          throw TypeError(a + " is not an object!");
        return a;
      };
    }), a.registerDynamic("16", ["47", "5"], !0, function(a, b, c) {
      var d = (this || self, a("47")),
          e = a("5");
      c.exports = function(a) {
        return d(e(a));
      };
    }), a.registerDynamic("c", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a, b) {
        return {
          enumerable: !(1 & a),
          configurable: !(2 & a),
          writable: !(4 & a),
          value: b
        };
      };
    }), a.registerDynamic("10", [], !0, function(a, b, c) {
      this || self;
      c.exports = !0;
    }), a.registerDynamic("48", ["b", "2a", "13", "31", "11", "12", "40", "41", "d", "42", "f", "43", "44", "45", "46", "1a", "16", "c", "10"], !0, function(a, b, c) {
      "use strict";
      var d = this || self,
          e = a("b"),
          d = a("2a"),
          f = a("13"),
          g = a("31"),
          h = a("11"),
          i = a("12"),
          j = a("40"),
          k = a("41"),
          l = a("d"),
          m = a("42"),
          n = a("f"),
          o = a("43"),
          p = a("44"),
          q = a("45"),
          r = a("46"),
          s = a("1a"),
          t = a("16"),
          u = a("c"),
          v = e.getDesc,
          w = e.setDesc,
          x = e.create,
          y = p.get,
          z = d.Symbol,
          A = d.JSON,
          B = A && A.stringify,
          C = !1,
          D = n("_hidden"),
          E = e.isEnum,
          F = k("symbol-registry"),
          G = k("symbols"),
          H = "function" == typeof z,
          I = Object.prototype,
          J = g && j(function() {
            return 7 != x(w({}, "a", {get: function() {
                return w(this, "a", {value: 7}).a;
              }})).a;
          }) ? function(a, b, c) {
            var d = v(I, b);
            d && delete I[b], w(a, b, c), d && a !== I && w(I, b, d);
          } : w,
          K = function(a) {
            var b = G[a] = x(z.prototype);
            return b._k = a, g && C && J(I, a, {
              configurable: !0,
              set: function(b) {
                f(this, D) && f(this[D], a) && (this[D][a] = !1), J(this, a, u(1, b));
              }
            }), b;
          },
          L = function(a) {
            return "symbol" == typeof a;
          },
          M = function(a, b, c) {
            return c && f(G, b) ? (c.enumerable ? (f(a, D) && a[D][b] && (a[D][b] = !1), c = x(c, {enumerable: u(0, !1)})) : (f(a, D) || w(a, D, u(1, {})), a[D][b] = !0), J(a, b, c)) : w(a, b, c);
          },
          N = function(a, b) {
            s(a);
            for (var c,
                d = q(b = t(b)),
                e = 0,
                f = d.length; f > e; )
              M(a, c = d[e++], b[c]);
            return a;
          },
          O = function(a, b) {
            return void 0 === b ? x(a) : N(x(a), b);
          },
          P = function(a) {
            var b = E.call(this, a);
            return !(b || !f(this, a) || !f(G, a) || f(this, D) && this[D][a]) || b;
          },
          Q = function(a, b) {
            var c = v(a = t(a), b);
            return !c || !f(G, b) || f(a, D) && a[D][b] || (c.enumerable = !0), c;
          },
          R = function(a) {
            for (var b,
                c = y(t(a)),
                d = [],
                e = 0; c.length > e; )
              f(G, b = c[e++]) || b == D || d.push(b);
            return d;
          },
          S = function(a) {
            for (var b,
                c = y(t(a)),
                d = [],
                e = 0; c.length > e; )
              f(G, b = c[e++]) && d.push(G[b]);
            return d;
          },
          T = function(a) {
            if (void 0 !== a && !L(a)) {
              for (var b,
                  c,
                  d = [a],
                  e = 1,
                  f = arguments; f.length > e; )
                d.push(f[e++]);
              return b = d[1], "function" == typeof b && (c = b), !c && r(b) || (b = function(a, b) {
                if (c && (b = c.call(this, a, b)), !L(b))
                  return b;
              }), d[1] = b, B.apply(A, d);
            }
          },
          U = j(function() {
            var a = z();
            return "[null]" != B([a]) || "{}" != B({a: a}) || "{}" != B(Object(a));
          });
      H || (z = function() {
        if (L(this))
          throw TypeError("Symbol is not a constructor");
        return K(m(arguments.length > 0 ? arguments[0] : void 0));
      }, i(z.prototype, "toString", function() {
        return this._k;
      }), L = function(a) {
        return a instanceof z;
      }, e.create = O, e.isEnum = P, e.getDesc = Q, e.setDesc = M, e.setDescs = N, e.getNames = p.get = R, e.getSymbols = S, g && !a("10") && i(I, "propertyIsEnumerable", P, !0));
      var V = {
        for: function(a) {
          return f(F, a += "") ? F[a] : F[a] = z(a);
        },
        keyFor: function(a) {
          return o(F, a);
        },
        useSetter: function() {
          C = !0;
        },
        useSimple: function() {
          C = !1;
        }
      };
      e.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), function(a) {
        var b = n(a);
        V[a] = H ? b : K(b);
      }), C = !0, h(h.G + h.W, {Symbol: z}), h(h.S, "Symbol", V), h(h.S + h.F * !H, "Object", {
        create: O,
        defineProperty: M,
        defineProperties: N,
        getOwnPropertyDescriptor: Q,
        getOwnPropertyNames: R,
        getOwnPropertySymbols: S
      }), A && h(h.S + h.F * (!H || U), "JSON", {stringify: T}), l(z, "Symbol"), l(Math, "Math", !0), l(d.JSON, "JSON", !0);
    }), a.registerDynamic("38", [], !0, function(a, b, c) {
      "format cjs";
      this || self;
    }), a.registerDynamic("49", ["48", "38", "20"], !0, function(a, b, c) {
      this || self;
      a("48"), a("38"), c.exports = a("20").Symbol;
    }), a.registerDynamic("4a", ["49"], !0, function(a, b, c) {
      this || self;
      c.exports = a("49");
    }), a.registerDynamic("3e", ["4a"], !0, function(a, b, c) {
      this || self;
      c.exports = {
        default: a("4a"),
        __esModule: !0
      };
    }), a.register("4b", ["3c", "3d", "3e", "3b", "4c", "4d"], function(a) {
      function b(a) {
        var b = [];
        for (var c in a)
          a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + (null !== a[c] ? encodeURIComponent(a[c]) : ""));
        return b.join("&");
      }
      function c(a) {
        return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }
      function d(a, b) {
        var c = b && b.cacheScope || "",
            d = "lotto.gameServiceRequest." + (c ? c + "." : "") + a.hashKey;
        return d;
      }
      function e(a) {
        return a && a.cacheStorage || sessionStorage;
      }
      function f(a, b, c, f) {
        var g = d(a, f),
            h = e(f);
        try {
          var i = h.getItem(g);
          if (i = i ? JSON.parse(i) : null) {
            var j = new c(i.body, i.statusCode);
            return b(null, j), !0;
          }
        } catch (a) {
          console.log("ERROR", a);
        }
        return !1;
      }
      function g(a, b, c) {
        var f = d(a, c),
            g = e(c);
        g.setItem(f, JSON.stringify({
          body: b.body,
          statusCode: b.statusCode
        }));
      }
      var h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w;
      return {
        setters: [function(a) {
          h = a.default;
        }, function(a) {
          i = a.default;
        }, function(a) {
          j = a.default;
        }, function(a) {
          k = a.objectAssign;
        }, function(a) {
          l = a.default;
        }, function(a) {
          m = a.default;
        }],
        execute: function() {
          "use strict";
          n = j("baseUrl"), o = j("ajax"), p = "post", q = "get", r = {
            POST: p,
            GET: q
          }, s = function() {
            function a() {
              i(this, a), k(this, m), this.EVENTS = {REQUEST_CALLBACK: "onRequestCallback"};
            }
            return h(a, null, [{
              key: "buildServiceUri",
              value: function(a, b) {
                var d,
                    e = a;
                for (var f in b)
                  d = f.toLowerCase(), b.hasOwnProperty(f) && (e = e.replace(new RegExp(c("{" + f + "}"), "ig"), encodeURIComponent(b[f])), "jtoken" !== d && "securitytoken" !== d && "security_token" !== d || (b.hasOwnProperty("securityToken") || b.hasOwnProperty("security_token")) && (b.hasOwnProperty("jtoken") || b.hasOwnProperty("jToken")) || (e = e.replace(/\{jtoken\}/gi, encodeURIComponent(b[f])), e = e.replace(/\{securitytoken\}/gi, encodeURIComponent(b[f])), e = e.replace(/\{security_token\}/gi, encodeURIComponent(b[f]))));
                return e;
              }
            }, {
              key: "baseUrl",
              set: function(a) {
                this[n] = ("" + a).replace(/\/$/, "");
              },
              get: function() {
                return this[n];
              }
            }, {
              key: "ajax",
              set: function(a) {
                this[o] = a;
              },
              get: function() {
                return this[o] || $ && $.ajax;
              }
            }]), h(a, [{
              key: "getFullResourceUrl",
              value: function(b) {
                return a.buildServiceUri(this.baseUrl, b.params);
              }
            }, {
              key: "doRequest",
              value: function(a, b) {
                var c = this,
                    d = arguments.length <= 2 || void 0 === arguments[2] ? u : arguments[2],
                    e = arguments.length <= 3 || void 0 === arguments[3] ? null : arguments[3];
                e && e.cache && f(a, b, d, e) || this.ajax(k({
                  type: a.method,
                  url: this.getFullResourceUrl(a),
                  headers: a.headers,
                  data: a.serializedBody,
                  timeout: a.timeout ? 1e3 * a.timeout : 5e3,
                  success: function(f, h, i) {
                    var j = new d(f, i.status);
                    if (v.isErrorResponse(j) || j.isErrorResponse()) {
                      var k = v.create(i);
                      b(k), c.fireEvent(c.EVENTS.REQUEST_CALLBACK, a, k);
                    } else
                      e && e.cache && g(a, j, e), b(null, j), c.fireEvent(c.EVENTS.REQUEST_CALLBACK, a, null, j);
                  },
                  error: function(d, e, f) {
                    var g = v.create(d);
                    b(g), c.fireEvent(c.EVENTS.REQUEST_CALLBACK, a, g);
                  }
                }, this.isJsonP ? {
                  jsonp: "callback",
                  dataType: "jsonp",
                  jsonpCallback: "cors"
                } : {}));
              }
            }, {
              key: "start",
              value: function(a, b, c, d, e) {
                var f = new t("start", {
                  jtoken: a,
                  gameid: b,
                  apidata: d,
                  gamedata: c
                });
                return this.doRequest(f, e);
              }
            }, {
              key: "end",
              value: function(a, b, c, d, e) {
                var f = new t("end", {
                  jtoken: a,
                  gameid: b,
                  apidata: d,
                  gamedata: c
                });
                return this.doRequest(f, e);
              }
            }, {
              key: "complete",
              value: function(a, b, c) {
                var d = new t("complete", {
                  jtoken: a,
                  apidata: b
                });
                return this.doRequest(d, c);
              }
            }, {
              key: "gameEvent",
              value: function(a, b, c) {
                var d = new t(a, b);
                return this.doRequest(d, c);
              }
            }, {
              key: "nextGame",
              value: function(a, b, c) {
                var d = new t("getnextgame", {
                  jtoken: a,
                  gameid: b
                });
                return this.doRequest(d, c);
              }
            }, {
              key: "forfeit",
              value: function(a, b) {
                var c = new t("forfeit", {jtoken: a});
                return this.doRequest(c, b);
              }
            }, {
              key: "baseUrl",
              set: function(a) {
                this[n] = a;
              },
              get: function() {
                return this[n] || a.baseUrl;
              }
            }, {
              key: "ajax",
              set: function(a) {
                this[o] = a;
              },
              get: function() {
                return this[o] || a.ajax;
              }
            }, {
              key: "isJsonP",
              get: function() {
                return this.baseUrl.match(/[&\?]callback\b/);
              }
            }]), a;
          }(), t = function() {
            function a(b, c, d, e) {
              i(this, a), this.method = d || p, this.params = k({event: b}, c || {}), this.headers = {};
            }
            return h(a, [{
              key: "jsonPosts",
              get: function() {
                return this._jsonPosts !== !1;
              },
              set: function(a) {
                this._jsonPosts = !!a;
              }
            }, {
              key: "serializedBody",
              get: function() {
                return this.method == p && this.jsonPosts ? JSON.stringify(this.params || {}) : this.queryStringifiedBody;
              }
            }, {
              key: "queryStringifiedBody",
              get: function() {
                return b(this.params);
              }
            }, {
              key: "hashKey",
              get: function() {
                return this.method + "." + this.resource + "?" + this.queryStringifiedBody;
              }
            }]), a;
          }(), u = function() {
            function a(b, c) {
              if (i(this, a), this.body = b, this.responseText = b, "string" == typeof b)
                try {
                  this.body = JSON.parse(b);
                } catch (a) {}
              this.statusCode = c;
            }
            return h(a, [{
              key: "isErrorResponse",
              value: function() {
                return this.body && this.body.error && this.body.error.code > 0;
              }
            }, {
              key: "isWinner",
              value: function() {
                var a = this.iwResponse;
                return a && a.wins && a.wins.length > 0;
              }
            }, {
              key: "isCashWinner",
              value: function() {
                return this.getCashWins().length > 0;
              }
            }, {
              key: "isTokenWinner",
              value: function() {
                return this.getTokenWins().length > 0;
              }
            }, {
              key: "getWinsByType",
              value: function(a) {
                var b = [],
                    c = this.iwResponse;
                if (!c && this.body.tokens && a == l.TOKEN)
                  b.push({
                    type: l.TOKEN,
                    value: this.body.tokens
                  });
                else if (c && c.response && c.response.tokens && a == l.TOKEN)
                  b.push({
                    type: l.TOKEN,
                    value: parseInt(c.response.tokens, 10)
                  });
                else {
                  var d = c && c.wins || [];
                  d.forEach(function(c) {
                    c.type === a && b.push(c);
                  });
                }
                return b;
              }
            }, {
              key: "getCashWins",
              value: function() {
                return this.getWinsByType(l.CASH);
              }
            }, {
              key: "getTokenWins",
              value: function() {
                return this.getWinsByType(l.TOKEN);
              }
            }, {
              key: "iwResponse",
              get: function() {
                return this.body ? this.body.data && this.body.data.iw_response ? this.body.data.iw_response : this.body.iw_response : null;
              }
            }]), a;
          }(), v = function() {
            function a(b, c, d) {
              i(this, a), this.statusCode = b, this.message = c, this.body = d;
            }
            return h(a, null, [{
              key: "isErrorResponse",
              value: function(a) {
                return "error" === a.body.status || a.iwResponse && a.iwResponse.error === !0 || a.iwResponse && "error" === a.iwResponse.type;
              }
            }, {
              key: "createDefault",
              value: function() {
                return new a(0, "", {
                  status: 0,
                  iw_response: {
                    type: "error",
                    data: {
                      code: 37,
                      message: "Network Error"
                    }
                  },
                  jToken: ""
                });
              }
            }, {
              key: "createFromResponse",
              value: function(b) {
                return new a(b.statusCode, "", b.body);
              }
            }, {
              key: "create",
              value: function(b) {
                var c = {};
                try {
                  c = b.responseText ? JSON.parse(b.responseText) : {};
                } catch (a) {
                  c.message = b.responseText;
                }
                return c.iw_response ? new a(b.status, c.message || "", c) : a.createDefault();
              }
            }]), a;
          }(), w = {
            getCacheKey: d,
            doCachedRequest: f,
            cacheResponse: g
          }, a("GameServiceRequest", t), a("GameServiceResponse", u), a("GameServiceError", v), a("METHODS", r), a("GameServiceCache", w), a("default", s);
        }
      };
    }), a.register("4e", [], function(a) {
      "use strict";
      var b;
      return {
        setters: [],
        execute: function() {
          b = function() {
            var a = this,
                b = function(a, b, c) {
                  var d = window.open(a, "win", "scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width=" + b + ",height=" + c);
                  d.window.focus();
                };
            global.PCHGames = global.PCHGames || {}, global.PCHGames.gameStart = function(b) {
              a.startGame(), a.gameModel.onStarted.then(function(b) {
                var c = a.gameLoader.getFlashMovie(),
                    d = b.body.data.iw_response.response || "",
                    e = 0;
                "success" === b.body.status && (e = 1), c.IWEreturn(e, d.xmlResponse);
              });
            }, global.PCHGames.gameEnd = function(b, c, d) {
              a.endGame();
            }, global.PCHGames.fShowRules = function() {
              b(a.gameModel.game.rules, 400, 400);
            }, global.PCHGames.fShowFacts = function() {
              b(a.gameModel.game.policy, 400, 400);
            };
          }, a("default", b);
        }
      };
    }), a.register("4f", ["50", "3c", "3d", "3b"], function(a) {
      function b(a) {
        return !a || a instanceof c ? new g(a) : new h(a);
      }
      var c,
          d,
          e,
          f,
          g,
          h;
      return {
        setters: [function(a) {
          c = a.default;
        }, function(a) {
          d = a.default;
        }, function(a) {
          e = a.default;
        }, function(a) {
          f = a.objectAssign;
        }],
        execute: function() {
          "use strict";
          g = function() {
            function a(b) {
              e(this, a), this.gos = b;
            }
            return d(a, [{
              key: "reset",
              value: function() {
                this.gos && this.gos.reset();
              }
            }, {
              key: "setup",
              value: function(a, b) {
                this.gos && this.gos.setup(null, b);
              }
            }, {
              key: "setupGameFailed",
              value: function(a, b) {
                this.gos && this.gos.setup(b);
              }
            }, {
              key: "setupGameEnded",
              value: function(a, b) {
                if (this.gos) {
                  var c = b.body.data || {};
                  c.autoClaim && this.gos.setAutoClaim(!0), this.gos.setPathStatus(b.body.path && b.body.path.status), this.gos.open();
                }
              }
            }]), a;
          }(), h = function() {
            function a(b) {
              e(this, a), this.gos = b;
            }
            return d(a, [{
              key: "reset",
              value: function() {}
            }, {
              key: "setup",
              value: function(a, b) {
                if (this.gos) {
                  var c = b.body.data,
                      d = {},
                      e = {};
                  c && c.iw_response && (d = c.iw_response.response || c.iw_response), "error" !== b.body.status && "error" !== d.type ? (e = f({}, {
                    error: !1,
                    tokenDesc: a.getGamePlayDesc(),
                    prizeType: d.data && d.data.prizeType,
                    prizeValue: d.data && d.data.prizeValue
                  }), e = f(e, d.data && d.data.gos || {})) : e = f({error: !0}, d && d.data && d.data.gos || {}), this.gos.setup(e);
                }
              }
            }, {
              key: "setupGameFailed",
              value: function(a, b) {
                if (this.gos) {
                  var c = b && b.body || {},
                      d = null,
                      e = {};
                  c.iw_response && (d = c.iw_response.response || c.iw_response), e = f({error: !0}, "undefined" != typeof d && d.data ? d.data.gos : null), this.gos.setup(e);
                }
              }
            }, {
              key: "setupGameEnded",
              value: function(a, b) {
                if (this.gos) {
                  var c = b.body.data || {};
                  c.autoClaim && this.gos.setAutoClaim(!0), this.gos.open();
                }
              }
            }]), a;
          }(), a("GOSManager", g), a("LegacyGOSManager", h), a("default", b);
        }
      };
    }), a.register("51", ["52", "3c", "3d", "3a", "3f", "4b", "3b", "4e", "4f", "4d"], function(a) {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r;
      return {
        setters: [function(a) {
          b = a.default;
        }, function(a) {
          c = a.default;
        }, function(a) {
          d = a.default;
        }, function(a) {
          e = a.default;
        }, function(a) {
          f = a.default;
        }, function(a) {
          g = a.default, h = a.GameServiceError;
        }, function(a) {
          i = a.objectAssign;
        }, function(a) {
          j = a.default;
        }, function(a) {
          k = a.default;
        }, function(a) {
          l = a.default;
        }],
        execute: function() {
          "use strict";
          m = "gosOpen", n = "gosCreatePassSuccess", o = "gosForfeit", p = "gosContinue", q = window, r = function() {
            function a(c, e) {
              d(this, a), e = e || {}, i(this, l), this.on = this.addEventListener, this.off = this.removeEventListener, this.gameLoader = e.gameLoader || new f, this.dispatcher = e.dispatcher || b, this.service = e.service || new g, this.gosManager = k(e.gos), this.preloader = e.preloader, this.resetGame(c), this._onGOSOpen = this.onGOSOpen.bind(this), this.dispatcher.on(m, this._onGOSOpen), this._onGOSCreatePassSuccess = this.onGOSCreatePassSuccess.bind(this), this.dispatcher.on(n, this._onGOSCreatePassSuccess), this._onGOSForfeit = this.onGOSForfeit.bind(this), this.dispatcher.on(o, this._onGOSForfeit), this.EVENTS = {
                gameloaded: "gameLoad",
                start: "gameStart",
                end: "gameEnd",
                techerror: "gameTechError"
              };
            }
            return c(a, null, [{
              key: "constructGameJsonFromIWEResponse",
              value: function(a, b) {
                var c = i({}, a || {});
                return b = b || {}, c.game = c.item || c.game || {}, c.game.path = c.path, c.serviceUri = b.serviceUri, c.user = b.user, b.basePackageDomainOverride && (c.game.base_package_url = c.game.base_package_url.replace(/^(https?:)?\/\/[^\/]+\/?/, b.basePackageDomainOverride)), c.service = {data: {token: c.security_token}}, c;
              }
            }]), c(a, [{
              key: "dispose",
              value: function() {
                PCH.gameProxy.isCurrentManager(this) && PCH.gameProxy.resetProxy(), this.gosManager.reset();
              }
            }, {
              key: "resetGame",
              value: function(a) {
                this.gameModel = new e(a), this.service.baseUrl = g.buildServiceUri(this.gameModel.serviceUri, {
                  appCode: this.gameModel.getAppCode(),
                  device: this.gameModel.getDevice(),
                  pathId: this.gameModel.getPathId(),
                  itemId: this.gameModel.getItemId(),
                  email: this.gameModel.getUserEmail(),
                  gmt: this.gameModel.getUserGmt()
                }), this.gameModel.onLoaded.then(this.onGameLoaded.bind(this)).catch(this.onGameFailed.bind(this)), this.gameModel.onStarted.then(this.onGameStarted.bind(this)).catch(this.onGameFailed.bind(this)), this.gameModel.onEnded.then(this.onGameEnded.bind(this)).catch(this.onGameFailed.bind(this));
              }
            }, {
              key: "setProxy",
              value: function() {
                PCH.gameProxy.setGameManager(this);
              }
            }, {
              key: "init",
              value: function() {
                var a = this;
                this.gameLoader.loadGame(this.gameModel, function(b, c) {
                  a.gameModel.setLoadedResponse(b, c), a.gameModel.isFlashGame && j.bind(a), a.hidePreloader();
                }), this.setProxy();
              }
            }, {
              key: "loadGame",
              value: function() {
                this.init();
              }
            }, {
              key: "hidePreloader",
              value: function() {
                if (this.preloader)
                  if ("string" == typeof this.preloader) {
                    var a = document.querySelector(this.preloader);
                    a && (a.style.display = "none");
                  } else
                    this.preloader instanceof HTMLElement ? this.preloader.style.display = "none" : this.preloader.hide && "function" == typeof this.preloader.hide && this.preloader.hide();
              }
            }, {
              key: "onGameLoaded",
              value: function() {
                this.dispatcher.dispatch(this.EVENTS.gameloaded);
              }
            }, {
              key: "onGameStarted",
              value: function(a) {
                this.gameModel.updateSecurityTokenFromResponse(a), this.gosManager.setup(this.gameModel, a), this.dispatcher.dispatch(this.EVENTS.start, this.gameModel.startResponse.body);
              }
            }, {
              key: "onGameFailed",
              value: function(a) {
                console.log("onGameFailed", a), this.gosManager.setupGameFailed(this.gameModel, a), this.dispatchEvent({event: "techerror"});
              }
            }, {
              key: "onGameEnded",
              value: function(a) {
                this.gameModel.updateSecurityTokenFromResponse(a), this.gosManager.setupGameEnded(this.gameModel, a), this.dispatcher.dispatch(this.EVENTS.end, a.body);
              }
            }, {
              key: "onGOSOpen",
              value: function() {
                q.PCH && q.PCH.uniExp && q.PCH.uniExp.tokenCenter && this.gos && this.gos.isTokenWin() && q.PCH.uniExp.tokenCenter.showLastActivity(this.gos.getActivityData()), this.dispatcher.off(m, this._onGOSOpen), this._onGOSOpen = null;
              }
            }, {
              key: "onGOSCreatePassSuccess",
              value: function() {
                var a = this;
                this.service.complete(this.gameModel.getSecurityToken(), this.gameModel.getServiceData(), function(b, c) {
                  a.dispatcher.dispatch(p);
                }), this.dispatcher.off(n, this._onGOSCreatePassSuccess), this._onGOSCreatePassSuccess = null;
              }
            }, {
              key: "onGOSForfeit",
              value: function() {
                var a = this;
                this.service.forfeit(this.gameModel.getSecurityToken(), function(b, c) {
                  a.dispatcher.dispatch(o);
                }), this.dispatcher.off(o, this._onGOSForfeit), this._onGOSForfeit = null;
              }
            }, {
              key: "startGame",
              value: function(a) {
                var b = this;
                this.service.start(this.gameModel.getSecurityToken(), this.gameModel.getGameId(), a, this.gameModel.getServiceData(), function(a, c) {
                  c && c.body.path && c.body.path.status && "progress" !== c.body.path.status ? b.gameModel.setStartedResponse(h.createFromResponse(c)) : b.gameModel.setStartedResponse(a, c);
                });
              }
            }, {
              key: "endGame",
              value: function(a) {
                var b = this;
                this.service.end(this.gameModel.getSecurityToken(), this.gameModel.getGameId(), a, this.gameModel.getServiceData(), function(a, c) {
                  b.gameModel.setEndedResponse(a, c);
                });
              }
            }, {
              key: "interruptGame",
              value: function(a) {
                PCH.gameProxy.isCurrentManager(this) && (PCH.gameProxy.interruptGame(a), !this.gameModel.hasStarted && PCH.interruptAction && PCH.interruptAction());
              }
            }, {
              key: "gameEvent",
              value: function(a, b, c) {
                return this.service.gameEvent(a, i({
                  jtoken: this.gameModel.getSecurityToken(),
                  gameid: this.gameModel.getGameId(),
                  gamedata: b,
                  apidata: this.gameModel.getServiceData()
                }, b || {}), c);
              }
            }, {
              key: "redirect",
              value: function() {
                window.location.href = this.gameModel.getReturnUrl();
              }
            }, {
              key: "error",
              value: function(a) {
                console.error(a);
              }
            }, {
              key: "dispatchEvent",
              value: function(a) {
                var b = a.event;
                "function" == typeof this[b] && this[b](a), this.EVENTS[b] ? this.dispatcher.dispatch(this.EVENTS[b], a) : this.dispatcher.dispatch("game" + b.charAt(0).toUpperCase() + b.slice(1), a);
              }
            }, {
              key: "addRequestEventListener",
              value: function(a, b) {
                this.service.addEvent(this.service.EVENTS.REQUEST_CALLBACK, function(c, d, e) {
                  c.params.event === a && (d ? b(d) : b(null, e));
                });
              }
            }]), a;
          }(), a("default", r);
        }
      };
    }), a.registerDynamic("53", ["b"], !0, function(a, b, c) {
      var d = (this || self, a("b"));
      c.exports = function(a, b, c) {
        return d.setDesc(a, b, c);
      };
    }), a.registerDynamic("54", ["53"], !0, function(a, b, c) {
      this || self;
      c.exports = {
        default: a("53"),
        __esModule: !0
      };
    }), a.registerDynamic("3c", ["54"], !0, function(a, b, c) {
      "use strict";
      var d = (this || self, a("54").default);
      b.default = function() {
        function a(a, b) {
          for (var c = 0; c < b.length; c++) {
            var e = b[c];
            e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), d(a, e.key, e);
          }
        }
        return function(b, c, d) {
          return c && a(b.prototype, c), d && a(b, d), b;
        };
      }(), b.__esModule = !0;
    }), a.registerDynamic("3d", [], !0, function(a, b, c) {
      "use strict";
      this || self;
      b.default = function(a, b) {
        if (!(a instanceof b))
          throw new TypeError("Cannot call a class as a function");
      }, b.__esModule = !0;
    }), a.registerDynamic("2a", [], !0, function(a, b, c) {
      var d = this || self,
          d = c.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
      "number" == typeof __g && (__g = d);
    }), a.registerDynamic("27", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a) {
        if ("function" != typeof a)
          throw TypeError(a + " is not a function!");
        return a;
      };
    }), a.registerDynamic("22", ["27"], !0, function(a, b, c) {
      var d = (this || self, a("27"));
      c.exports = function(a, b, c) {
        if (d(a), void 0 === b)
          return a;
        switch (c) {
          case 1:
            return function(c) {
              return a.call(b, c);
            };
          case 2:
            return function(c, d) {
              return a.call(b, c, d);
            };
          case 3:
            return function(c, d, e) {
              return a.call(b, c, d, e);
            };
        }
        return function() {
          return a.apply(b, arguments);
        };
      };
    }), a.registerDynamic("11", ["2a", "20", "22"], !0, function(a, b, c) {
      var d = this || self,
          d = a("2a"),
          e = a("20"),
          f = a("22"),
          g = "prototype",
          h = function(a, b, c) {
            var i,
                j,
                k,
                l = a & h.F,
                m = a & h.G,
                n = a & h.S,
                o = a & h.P,
                p = a & h.B,
                q = a & h.W,
                r = m ? e : e[b] || (e[b] = {}),
                s = m ? d : n ? d[b] : (d[b] || {})[g];
            m && (c = b);
            for (i in c)
              j = !l && s && i in s, j && i in r || (k = j ? s[i] : c[i], r[i] = m && "function" != typeof s[i] ? c[i] : p && j ? f(k, d) : q && s[i] == k ? function(a) {
                var b = function(b) {
                  return this instanceof a ? new a(b) : a(b);
                };
                return b[g] = a[g], b;
              }(k) : o && "function" == typeof k ? f(Function.call, k) : k, o && ((r[g] || (r[g] = {}))[i] = k));
          };
      h.F = 1, h.G = 2, h.S = 4, h.P = 8, h.B = 16, h.W = 32, c.exports = h;
    }), a.registerDynamic("b", [], !0, function(a, b, c) {
      var d = (this || self, Object);
      c.exports = {
        create: d.create,
        getProto: d.getPrototypeOf,
        isEnum: {}.propertyIsEnumerable,
        getDesc: d.getOwnPropertyDescriptor,
        setDesc: d.defineProperty,
        setDescs: d.defineProperties,
        getKeys: d.keys,
        getNames: d.getOwnPropertyNames,
        getSymbols: d.getOwnPropertySymbols,
        each: [].forEach
      };
    }), a.registerDynamic("5", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a) {
        if (void 0 == a)
          throw TypeError("Can't call method on  " + a);
        return a;
      };
    }), a.registerDynamic("55", ["5"], !0, function(a, b, c) {
      var d = (this || self, a("5"));
      c.exports = function(a) {
        return Object(d(a));
      };
    }), a.registerDynamic("1e", [], !0, function(a, b, c) {
      var d = (this || self, {}.toString);
      c.exports = function(a) {
        return d.call(a).slice(8, -1);
      };
    }), a.registerDynamic("47", ["1e"], !0, function(a, b, c) {
      var d = (this || self, a("1e"));
      c.exports = Object("z").propertyIsEnumerable(0) ? Object : function(a) {
        return "String" == d(a) ? a.split("") : Object(a);
      };
    }), a.registerDynamic("40", [], !0, function(a, b, c) {
      this || self;
      c.exports = function(a) {
        try {
          return !!a();
        } catch (a) {
          return !0;
        }
      };
    }), a.registerDynamic("56", ["b", "55", "47", "40"], !0, function(a, b, c) {
      var d = (this || self, a("b")),
          e = a("55"),
          f = a("47");
      c.exports = a("40")(function() {
        var a = Object.assign,
            b = {},
            c = {},
            d = Symbol(),
            e = "abcdefghijklmnopqrst";
        return b[d] = 7, e.split("").forEach(function(a) {
          c[a] = a;
        }), 7 != a({}, b)[d] || Object.keys(a({}, c)).join("") != e;
      }) ? function(a, b) {
        for (var c = e(a),
            g = arguments,
            h = g.length,
            i = 1,
            j = d.getKeys,
            k = d.getSymbols,
            l = d.isEnum; h > i; )
          for (var m,
              n = f(g[i++]),
              o = k ? j(n).concat(k(n)) : j(n),
              p = o.length,
              q = 0; p > q; )
            l.call(n, m = o[q++]) && (c[m] = n[m]);
        return c;
      } : Object.assign;
    }), a.registerDynamic("57", ["11", "56"], !0, function(a, b, c) {
      var d = (this || self, a("11"));
      d(d.S + d.F, "Object", {assign: a("56")});
    }), a.registerDynamic("20", [], !0, function(a, b, c) {
      var d = (this || self, c.exports = {version: "1.2.6"});
      "number" == typeof __e && (__e = d);
    }), a.registerDynamic("58", ["57", "20"], !0, function(a, b, c) {
      this || self;
      a("57"), c.exports = a("20").Object.assign;
    }), a.registerDynamic("59", ["58"], !0, function(a, b, c) {
      this || self;
      c.exports = {
        default: a("58"),
        __esModule: !0
      };
    }), a.register("52", [], function(a) {
      "use strict";
      var b;
      return {
        setters: [],
        execute: function() {
          b = {
            dispatch: function() {
              if (window.PathDispatcher)
                return window.PathDispatcher.dispatch.apply(window.PathDispatcher, arguments);
            },
            on: function() {
              if (window.PathDispatcher)
                return window.PathDispatcher.on.apply(window.PathDispatcher, arguments);
            },
            off: function() {
              if (window.PathDispatcher)
                return window.PathDispatcher.off.apply(window.PathDispatcher, arguments);
            }
          }, a("default", b);
        }
      };
    }), a.registerDynamic("5a", [], !0, function(a, b, c) {
      "use strict";
      this || self;
      Object.defineProperty(b, "__esModule", {value: !0});
      var d = {
        getEvents: function(a) {
          return this._customEventHandlers || (this._customEventHandlers = {}), a ? this._customEventHandlers[this.getEventName(a)] || [] : this._customEventHandlers;
        },
        getEventName: function(a) {
          return a.replace(/^on/, "").toLowerCase();
        },
        addEvent: function(a, b) {
          var c = this.getEvents();
          a = this.getEventName(a), void 0 === c[a] && (c[a] = []), c[a].push(b);
        },
        addEventListener: function() {
          return this.addEvent.apply(this, arguments);
        },
        removeEvent: function(a, b) {
          a = this.getEventName(a);
          var c = this.getEvents();
          if (void 0 !== c[a]) {
            var d = c[a].indexOf(b);
            d > -1 && c[a].splice(d, 1);
          }
        },
        removeEventListener: function() {
          return this.removeEventListener.apply(this, arguments);
        },
        fireEvent: function(a) {
          var b = Array.prototype.slice.call(arguments, 1);
          a = this.getEventName(a);
          var c = this.getEvents()[a];
          if (void 0 !== c) {
            for (var d = [],
                e = c.length,
                f = e; f--; )
              d[f] = c[f];
            for (f = 0; f < e; f++)
              d[f].apply(null, b);
          }
        },
        propagateEvent: function(a, b) {
          this.addEvent(a, this.fireEvent.bind(b, a));
        }
      };
      b.default = d;
    }), a.registerDynamic("4d", ["5a"], !0, function(a, b, c) {
      this || self;
      c.exports = a("5a");
    }), a.register("50", ["52", "59", "3c", "3d", "3b", "4d"], function(a) {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w;
      return {
        setters: [function(a) {
          b = a.default;
        }, function(a) {
          c = a.default;
        }, function(a) {
          d = a.default;
        }, function(a) {
          e = a.default;
        }, function(a) {
          f = a.objectAssign;
        }, function(a) {
          g = a.default;
        }],
        execute: function() {
          "use strict";
          h = {
            OPEN: "gosOpen",
            CLOSE: "gosClose",
            CONTINUE: "gosContinue",
            FORFEIT: "gosForfeit",
            CREATE_PASS: "gosCreatePass",
            CREATE_PASS_SUCCESS: "gosCreatePassSuccess"
          }, i = "gos__continue-btn--show", j = "gos__claim-btn--show", k = "gos--show", l = "gos--close", m = "gos--cash-win", n = "gos--token-win", o = "gos__win--show", p = "gos--signedin", q = "gos--fullreg", r = "td", s = "gos--path-finished", t = "gos--path-completed", u = "finished", v = "completed", w = function() {
            function a(d) {
              e(this, a), this.opts = c({
                errorMessages: {
                  top: "We are experiencing technical difficulties",
                  main: "",
                  youScored: "",
                  bottom: "We are sorry for this inconvenience. Please try again!"
                },
                winMessages: {
                  top: "",
                  main: "",
                  youScored: "You Scored",
                  bottom: ""
                }
              }, d || {}), d.rootNode && this.mount(d.rootNode), this.dispatcher = d.dispatcher || b, this._autoClaim = !1, f(this, g), this.EVENTS = f({}, h);
            }
            return d(a, [{
              key: "mount",
              value: function(a) {
                this.rootNode = a, this.elements = {
                  gos: this.rootNode.querySelector(".gos") || this.rootNode,
                  p13n_name: this.rootNode.querySelector(".gos__p13n__name"),
                  top_msg: this.rootNode.querySelector(".gos__top-text"),
                  main_msg: this.rootNode.querySelector(".gos__main-text"),
                  you_won: this.rootNode.querySelector(".gos__you-won"),
                  bottom_msg: this.rootNode.querySelector(".gos__bottom-text"),
                  claim_btn: this.rootNode.querySelector(".gos__claim-btn"),
                  continue_btn: this.rootNode.querySelector(".gos__continue-btn"),
                  nothanks_text: this.rootNode.querySelector(".gos__forfeit"),
                  inputsContainer: this.rootNode.querySelector(".gos__sso-inputs-container"),
                  claimCode: this.rootNode.querySelector(".gos__claim-code"),
                  password: this.rootNode.querySelector("#gos_pass"),
                  confirmPassword: this.rootNode.querySelector("#gos_confirmpass"),
                  persist: this.rootNode.querySelector("#gos_persist")
                }, this.opts.user && (this.opts.user.gmt && (this.elements.gos.classList.add("gos--signedin"), this.elements.p13n_name && (this.elements.p13n_name.innerText = this.opts.user.firstName || this.opts.user.email)), this.opts.user.isFullyRegistered && this.elements.gos.classList.add("gos--fullreg"));
              }
            }, {
              key: "openClaim",
              value: function(a) {
                var b = 400,
                    c = 400,
                    d = window.open(a, "win", "scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width=" + b + ",height=" + c);
                d.window.focus();
              }
            }, {
              key: "setAutoClaim",
              value: function(a) {
                this._autoClaim = a, this._autoClaim ? this.showContinueButton() : this.showClaimButton();
              }
            }, {
              key: "setPathStatus",
              value: function(a) {
                if (this.elements.gos.classList.remove(s), this.elements.gos.classList.remove(t), a)
                  switch (a) {
                    case v:
                      this.elements.gos.classList.add(t);
                      break;
                    case u:
                      this.elements.gos.classList.add(s);
                  }
              }
            }, {
              key: "dispatchEvent",
              value: function(a) {
                this.dispatcher && this.dispatcher.dispatch(a), this.fireEvent(a);
              }
            }, {
              key: "showClaimButton",
              value: function() {
                this.elements.continue_btn.classList.remove(i), this.elements.claim_btn.classList.add(j);
              }
            }, {
              key: "showContinueButton",
              value: function() {
                this.elements.continue_btn.classList.add(i), this.elements.claim_btn.classList.remove(j);
              }
            }, {
              key: "open",
              value: function() {
                this.elements.gos.classList.add(k), this.opts.animInClass && this.elements.gos.classList.add(this.opts.animInClass), this.dispatchEvent(h.OPEN);
              }
            }, {
              key: "close",
              value: function() {
                this.opts.animOutClass ? this.elements.gos.classList.add(this.opts.animOutClass) : (this.elements.gos.classList.remove(k), this.elements.gos.classList.add(l)), this.dispatchEvent(h.CLOSE);
              }
            }, {
              key: "reset",
              value: function() {
                this.elements.gos.classList.remove(k), this.elements.gos.classList.remove(l), this.elements.gos.classList.remove(r), this.elements.gos.classList.remove(m), this.elements.gos.classList.remove(n), this.elements.gos.classList.remove(s), this.elements.gos.classList.remove(t), this.opts.animOutClass && this.elements.gos.classList.remove(this.opts.animOutClass), this.showContinueButton(), this.elements.top_msg.innerHTML = "", this.elements.main_msg.innerHTML = "", this.elements.you_won.innerText = "", this.elements.bottom_msg.innerHTML = "", this.elements.claimCode.innerText = "";
                var a = this.rootNode.querySelectorAll("." + o);
                if (a)
                  for (var b = 0; b < a.length; b++)
                    a[b].classList.remove(o), a[b].querySelector(".gos__win__text").innerHTML = "";
                this.hasError = !1;
              }
            }, {
              key: "setup",
              value: function(a, b) {
                var d = [],
                    e = {};
                if (a)
                  d.push(r), e = this.getErrorMessages(a), this.hasError = !0;
                else {
                  var f = b.isCashWinner() ? b.getCashWins() : null,
                      g = b.isTokenWinner() ? b.getTokenWins() : null;
                  if (!f && !g)
                    throw new Error("GOS must have prizeType information");
                  if (f && d.push(m), g && d.push(n), e = c({}, this.getWinMessages(b)), f) {
                    var h = f[0].claim_info;
                    h && (e.claimCode = h.code || "", e.claimUrl = h.form_url || "", this.claimInfo = h), this.hasCashWin = !0;
                  }
                  f && !this._autoClaim ? this.showClaimButton() : this.showContinueButton(), f && f.forEach(this.setupWin.bind(this)), g && g.forEach(this.setupWin.bind(this));
                }
                for (var i = 0,
                    j = d.length; i < j; i++)
                  this.elements.gos.classList.add(d[i]);
                this.elements.top_msg.innerHTML = e.top || "", this.elements.main_msg.innerHTML = e.main || "", this.elements.you_won.innerText = e.youScored || "", this.elements.bottom_msg.innerHTML = e.bottom || "", this.elements.claimCode.innerText = e.claimCode || "", this.elements.claim_btn.addEventListener("click", this.onClaimClick.bind(this), !1), this.elements.continue_btn.addEventListener("click", this.onContinueClick.bind(this), !1), this.elements.nothanks_text.addEventListener("click", this.onForfeitClick.bind(this), !1), a && this.open();
              }
            }, {
              key: "getErrorMessages",
              value: function(a) {
                return this.opts.errorMessages;
              }
            }, {
              key: "getWinMessages",
              value: function(a) {
                return this.opts.winMessages;
              }
            }, {
              key: "setupWin",
              value: function(a) {
                var b = a.type.toLowerCase(),
                    c = this.rootNode.querySelector(".gos__win--" + b);
                c.querySelector(".gos__win__text").innerHTML = this.getWinHTML(a), c.classList.add(o);
              }
            }, {
              key: "getWinHTML",
              value: function(a) {
                return a.description;
              }
            }, {
              key: "onForfeitClick",
              value: function(a) {
                this.dispatchEvent(h.FORFEIT);
              }
            }, {
              key: "onClaimClick",
              value: function(a) {
                a.preventDefault(), this.dispatchPassword() || (this.openClaim(this.claimInfo.form_url), this.dispatchEvent(h.CONTINUE));
              }
            }, {
              key: "onContinueClick",
              value: function(a) {
                a.preventDefault(), this.dispatchPassword() || this.dispatchEvent(h.CONTINUE);
              }
            }, {
              key: "getPasswordElement",
              value: function() {
                return this.elements.password;
              }
            }, {
              key: "getConfirmPasswordElement",
              value: function() {
                return this.elements.confirmPassword;
              }
            }, {
              key: "getPersistElement",
              value: function() {
                return this.elements.persist;
              }
            }, {
              key: "dispatchPassword",
              value: function() {
                return !(!this.userNeedsPassword || !this.hasError && this.hasCashWin) && (this.dispatchEvent(h.CREATE_PASS, this.elements.inputsContainer, this.elements.password, this.elements.confirmPassword, this.elements.persist && this.elements.persist.checked), !0);
              }
            }]), a;
          }(), a("EVENTS", h), a("default", w);
        }
      };
    }), a.register("4c", [], function(a) {
      "use strict";
      var b,
          c;
      return {
        setters: [],
        execute: function() {
          b = {
            CASH: "MONETARY",
            TOKEN: "TOKEN",
            LUCKY7: "LUCKY7"
          }, c = {
            CASH: "CASH",
            HARDGOOD: "HARDGOOD",
            EGIFTCARD: "EGIFTCARD"
          }, a("PRIZE_TYPES", b), a("SUB_PRIZE_TYPES", c), a("default", b);
        }
      };
    }), a.register("3b", [], function(a) {
      "use strict";
      function b(a, b) {
        if (!b)
          return a;
        for (var c in b)
          b.hasOwnProperty(c) && (a[c] = b[c]);
        return a;
      }
      return {
        setters: [],
        execute: function() {
          a("objectAssign", b);
        }
      };
    }), a.register("1", ["2", "50", "51", "52", "3a", "3f", "4b", "4c", "3b"], function(a) {
      "use strict";
      function b(a, b) {
        var c = new e(a, k({
          gameLoader: new h,
          dispatcher: f,
          service: new i,
          gos: window.GOS,
          preloader: document.querySelector(".game-preloader")
        }, b || {}));
        return b && b.simulatorAjax && (c.service.ajax = b.simulatorAjax), c.init(), c;
      }
      var c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k;
      return {
        setters: [function(a) {
          c = a.default;
        }, function(a) {
          d = a.default;
        }, function(a) {
          e = a.default;
        }, function(a) {
          f = a.default;
        }, function(a) {
          g = a.default;
        }, function(a) {
          h = a.default;
        }, function(a) {
          i = a.default;
        }, function(a) {
          j = a.default;
        }, function(a) {
          k = a.objectAssign;
        }],
        execute: function() {
          a("GameManager", e), a("GameModel", g), a("GameLoader", h), a("GameService", i), a("gameProxy", c), a("GameOverScreen", d), a("PRIZE_TYPES", j), a("initGame", b), a("default", b);
        }
      };
    });
  })(function(a) {
    PCHGameManager = a();
  });
  function init_pchcom_gamemanager(e, a, o) {
    console.log("init pchcom game manager"), Object.assign(e, {
      iframeParent: document.getElementById("htmlgame_frame_div"),
      wsURL: PCH.GAMES.gameInfo.scoreSubmitURL,
      gameProxyUrl: IWGAME.gameProxyURL,
      cacheBuster: 123,
      videoAdTimeout: 700,
      maxAdDuration: 7e4,
      timeoutDuration: 15e3,
      outlineFrameDiv: "#htmlgame_frame_outline",
      adHolder: "#iw_outer_ad_holder",
      callBackFunction: "pchcom_callback",
      gameOverScreenID: "#iwgos",
      gameOverScreenHolder: "#gosholder",
      gameOverScreenAmountHolder: "#amount",
      width: window.innerWidth,
      height: window.innerHeight,
      iwTokenThreshold: IWGAME.iwTokenThreshold
    });
    var t = a.apiData,
        n = a.init;
    n.serviceUri = e.wsURL, n.service && (n.service.url = n.serviceUri, n.service.data = t);
    var i = a.parentInit;
    i && (i.service.url = e.wsURL);
    var r = new o(n, {gos: window.GOS});
    window.location.href.match(/_simulator=1/) && window.AjaxSimulator && (console.log("using simulator"), r.service.ajax = window.AjaxSimulator.ajax);
    var s,
        c = {
          0: "",
          1: "silver",
          2: "gold",
          tokenwin: "t_win",
          tokenloose: "t_loose",
          cashwin: "cash",
          techDiff: "t_diff",
          prodlineup: "cashoff-prodlineup",
          claimURL: "",
          gameId: "",
          gameStartError: !1,
          tokenWon: 0,
          gos_gatag: ""
        },
        m = !0,
        l = !1;
    PCHGames.initializeGame = function() {
      PCHGames.gameId = n.game.id, PCHGames.gameTokenDescription = n.displayTitle;
    }, PCHGames.gameLoad = function() {
      console.log("PCHGames.gameLoad"), r.loadGame(), s = setTimeout(function() {
        console.log("gameLoadFailureTimeout called"), v({
          status: 0,
          score: 0,
          tokens: 0
        });
      }, 1e4), "MOBILE" != PCH.device ? $(PCHGames.flashContainerId).show() : ($(".upper-layer").addClass("hidenav"), $(".bonus_progress").addClass("hidden")), r.gameModel.onLoaded.then(function() {
        clearTimeout(s);
      });
    };
    var d = function() {
      var e = window.matchMedia("(orientation: landscape)").matches ? "l" : "p";
      e != PCH.GAMES.gameJson.init.game.orientation ? ($("body").addClass("showerror"), setTimeout(function() {
        $("#rotate_error").height($("html").height());
      }, 1e3), $("#btm_msg span").html("l" == e ? "landscape" : "portrait"), m = !1) : ($("body").removeClass("showerror"), l || m || (n.game.height = window.innerHeight, n.game.width = window.innerWidth, PCHGames.gameLoad(), l = !0));
    },
        g = function(e) {
          PCHGames.flashGameEnd(e.body);
        },
        u = function(a) {
          a = a.body, $("#forfeit").after('<div class="gosnavlinks all"><span id="gameshome" class="all">Token Games Home</span><span id="gamescat" class="all">More ' + PCH.GAMES.gameInfo.categoryName + ' Games</span><div class="clear"></div></div>'), $("#gameshome").on("click", function(e) {
            e.preventDefault(), window.location.href = "/games";
          }), $("#gamescat").on("click", function(e) {
            e.preventDefault(), window.location.href = window.location.href.split(PCH.GAMES.gameInfo.gameAlias)[0];
          }), PCHGames.gameId = {
            gameid: PCH.GAMES.gameInfo.gameId,
            securitytoken: a.securityToken ? a.securityToken : PCH.GAMES.gameJson.init.securityToken,
            gameType: "SBG"
          }, document.querySelector(e.gameOverScreenAmountHolder).innerHTML = "", 0 != a.status && PCHGames.GOSgamesUpdate("#amount", PCH.GAMES.gameInfo.isTournament, PCHUSER.type, a.score, a.tokens, a.tokenMultiplier), PCH.GAMES.gameInfo.isTournament && (document.querySelector(e.gameOverScreenID).classList.add("stampOn"), 0 != a.status && h(a.tokens)), document.querySelector(e.gameOverScreenHolder).classList.add("t_loose"), document.querySelector(e.gameOverScreenHolder).classList.add(c[PCHUSER.type]), 0 == a.tokens ? ($("#congrats_nicejob .t_loose").html("TOO BAD!"), $("#message .silver").html("Create a password to start BANKING TOKENS NOW!")) : PCH.GAMES.gameJson.init.positiveMessage && $("#congrats_nicejob .t_loose").html(PCH.GAMES.gameJson.init.positiveMessage), 0 == a.status && (document.querySelector(e.gameOverScreenHolder).classList.add("t_diff"), a.response ? 1015 == a.response.apiErrorCode && (document.querySelector(e.gameOverScreenHolder).classList.remove(c[1]), document.querySelector(e.gameOverScreenHolder).classList.add(c[2]), $("#congrats_nicejob .t_loose").addClass("double_play").html("Sorry, it appears that you are already playing another game at the same time. Please remember to submit one score before playing another game. Please close all other browsers and refresh this page to play this game again.")) : $("#congrats_nicejob .t_loose").html("We are experiencing technical difficulties.")), 1 == PCHUSER.type && $("#contBtn div").html("Continue"), document.querySelector(e.outlineFrameDiv).classList.add("hide"), document.querySelector(e.gameOverScreenID).classList.add("show"), 1 != PCHUSER.type && $(".bonus_progress").removeClass("hidden"), $(".alltime").removeClass("hidden"), PCH.gameEndLeaderBoard(), d = function() {}, PCHGA.trackEvent(PCHGames.gaGameCategory, "complete", PCH.GAMES.gaCategory + "/" + PCH.GAMES.gaGameName), 1 == PCHUSER.type && PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + "/" + PCH.GAMES.gaGameName + "/GameOverSilver"), 2 == PCHUSER.type && PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + "/" + PCH.GAMES.gaGameName + "/GameOverGold");
        },
        h = function(e) {
          p({
            div: "span.gosAmountHolder",
            stop: e,
            callback: function() {
              $("#gosholder").prepend('<div class="stampOnGOS all"><img class="all" src="/pch_media/images/games/gm-home-featured-cup.jpg"></div>'), $(".stampOnGOS").addClass("stampOnGOSAnimation"), $("#iwgos #gosholder #congrats_nicejob").animate({"margin-top": "65px"}, 500);
            }
          });
        },
        p = function(e) {
          var a = e || {};
          if (a.start = a.start || 0, a.intervals = a.intervals || (a.stop - a.start) / 20, !a.div || !a.stop)
            return "function" == typeof a.callback && (a.callback_parameters ? a.callback(a.callback_parameters) : a.callback()), !1;
          var o = $(a.div),
              t = a.start;
          o.html(a.start).parent().addClass("countUpAnimation");
          var n = setInterval(function() {
            t += a.intervals, t <= a.stop ? o.html(parseInt(t)) : (clearInterval(n), "function" == typeof a.callback && (a.callback_parameters ? a.callback(a.callback_parameters) : a.callback()));
          }, 100);
          p.resetGOS = function() {
            o.parent().removeClass("countUpAnimation"), $("#iwgos #amount").css({"font-size": "4.4em"});
          };
        },
        v = "MOBILE" != PCH.device ? g : u;
    return r.gameModel.onEnded.then(v), pchcom_gamemanager.triggerCallback = function(e) {
      console.log("---\x3e triggerCallback", e), "function" == typeof r[e.event] && r[e.event](e);
    }, pchcom_gamemanager.triggerLibFunction = function(e) {
      console.log("---\x3e triggerLibFunction", e), "function" == typeof r[e] && r[e]();
    }, "MOBILE" == PCH.device && (globalOrientationTrigger = function() {}, window.addEventListener("orientationchange", function() {
      try {
        clearInterval(PCH.orientaionTimer);
      } catch (e) {}
      PCH.orientaionTimer = setTimeout(d, 500);
    }), d()), pchcom_gamemanager;
  }
  function pchcom_callback(e) {
    console.log("pchcom_callback", e), pchcom_gamemanager.triggerCallback(e);
  }
  PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {}, void 0 === PCHMINIBOOTSTRAP.htmlgameBaseURL && (PCHMINIBOOTSTRAP.htmlgameBaseURL = ""), "MOBILE" == PCH.device && (IWGAME.gameJson.init.game.width = window.innerWidth, IWGAME.gameJson.init.game.height = window.innerHeight, IWGAME.gameJson.init.game.device = PCH.device.toLocaleLowerCase());
  var pchcom_gamemanager = {};
  PCHGames.docReadyCallback = function() {
    return !0;
  };
  var PCHGames = PCHGames || {},
      PCHAd = PCHAd || {};
  PCHGames.flashObject = "iw_flash_holder", PCHGames.flashContainerId = "#inner_content", PCHGames.installFlashContainer = "#inner_content", PCHGames.urlAppendParam = "?", -1 !== window.location.href.indexOf("?") && (PCHGames.urlAppendParam = "&"), PCHGames.redirecURL = window.location.href + PCHGames.urlAppendParam + "pchaction=createpw", PCHGames.flashLoaded = !1, PCHGames.iwPostGameMessageHolder = "#iw_message_holder", PCHGames.iwPlayNextButton = ".play_more_button", PCHGames.goldClass = ".gold ", PCHGames.silverClass = ".silver ", PCHGames.goldClassName = "gold", PCHGames.silverClassName = "silver", PCHGames.techDiffClass = ".tech_difficulties", PCHGames.techDiffClassName = "tech_difficulties", PCHGames.noTokens = ".no_tokens", PCHGames.noTokensClassName = "no_tokens", PCHGames.alreadyPlayedClass = ".already_played", PCHGames.alreadyPlayedClassName = "already_played", PCHGames.productLineupClass = ".cashoff-prodlineup", PCHGames.productLineupClassName = " cashoff-prodlineup", PCHGames.winTypeCashClassName = "cash", PCHGames.resetGOSCallbacks = [], PCHGames.GOSOverrideList = [], PCHGames.ajaxError = "-1", PCHGames.errorCode = "-1", PCHGames.hasTechnicalError = "-1", PCHGames.gameErrorCode = "", PCHGames.gameStartResponse = "", PCHGames.stopNavaway = !1, PCHGames.tokenSplurgeGame = "instantwintokensplurge", PCHGames.GAParam = "", PCHGames.iwAdContainers = "#iw_top_ad,#iw_top_ad .visual,.visual.iwrightad", PCHAd.timeoutDuration = 2e4, PCHAd.maxAdDuration = 7e4, PCHGames.postGameLoadProcessing = function() {
    $(".ajaxLoader").remove(), $(PCHGames.flashContainerId).show(), $("#main").trigger("gameStartInstantWin"), $(".iwrightnongoogle").show(), setTimeout(function() {
      $("#disclaimer-box").show();
    }, 2e3);
  }, PCHGames.gameStartCentralCb = function(e) {
    if ($(document).off("keydown"), PCHGames.gameStartResponse = e, PCHGames.jToken = e.jtoken, PCHGames.isFlashGame)
      var a = PCHGames.thisMovie(PCHGames.flashObject);
    if (PCHGames.iwGameType !== PCHGames.tokenSplurgeGame) {
      var s = "",
          t = "0",
          n = 0;
      2 == e.status ? (t = "0", n = 1) : (t = "1", n = 0, PCHGames.gameErrorCode = e.iw_response.data.code), PCHGames.hasTechnicalError = t, s = e.iw_response.response, gameStartResponse = s, PCHGames.isFlashGame && a.IWEreturn(n, s.xmlResponse);
    } else
      2 == e.status ? (window.onbeforeunload = function() {
        var e = "";
        if (e += "\nWARNING!\n", e += "You Are About to Forfeit ALL of Your Tokens & Opportunities on Token Splurge for Today!\n", e += "Are You Sure You Want to Leave?\n", !PCHGames.stopNavaway)
          return e;
      }, PCHGames.hasTechnicalError = "0", PCHGames.isFlashGame && a.gameStartStatus(1)) : (PCHGames.hasTechnicalError = "1", PCHGames.isFlashGame && a.gameStartStatus(e.status));
  }, PCHGames.gameEndCentralCb = function(e, a) {
    PCHGames.jToken = e.jtoken;
    var s = (winningAmount = "", !1),
        t = "TD";
    PCHGames.GOSOverrideList.props = {
      override: "",
      callback: "",
      callback_params: []
    };
    var n = PCHGames.checkGOSError(e);
    if (n.hasError)
      t = n.gosType ? n.gosType : t, winningAmount = n.winningAmount ? PCHGames.getWinningAmountMarkup({
        description: n.winningAmount + "TOKENS",
        amount: n.winningAmount,
        isMonetaryWin: !1
      }) : winningAmount;
    else {
      if (PCHGames.iwGameType == PCHGames.tokenSplurgeGame && (PCHGames.gameStartResponse.iw_response.response = {}, PCHGames.gameStartResponse.iw_response.response.type = e.iw_response.response.type, PCHGames.gameStartResponse.iw_response.response.data = {}, PCHGames.gameStartResponse.iw_response.response.data.prizeValue = e.iw_response.response.data.prizeValue, PCHGames.gameStartResponse.iw_response.response.data.prizeType = {}, PCHGames.gameStartResponse.iw_response.response.data.prizeType.id = e.iw_response.response.data.prizeType.id, PCHGames.gameStartResponse.iw_response.response.data.description = e.iw_response.response.data.description, e.iw_response.response.data.gos && (PCHGames.gameStartResponse.iw_response.response.data.gos = e.iw_response.response.data.gos)), isNaN(parseInt(PCHGames.gameStartResponse.iw_response.response.data.prizeValue, 10)) || (winningAmount = PCHGames.getWinningAmountMarkup({
        description: PCHGames.gameStartResponse.iw_response.response.data.description,
        amount: PCHGames.gameStartResponse.iw_response.response.data.prizeValue,
        isMonetaryWin: !1
      })), 6 == PCHGames.gameStartResponse.iw_response.response.data.prizeType.id || 0 == PCHGames.gameStartResponse.iw_response.response.data.prizeType.id)
        s = !0, t = "TL";
      else if (void 0 !== PCHGames.gameStartResponse.iw_response.response.data.claimCode && "" !== PCHGames.gameStartResponse.iw_response.response.data.claimCode) {
        var o = gameStartResponse;
        PCHGames.claimCode = o.data.claimCode, winningAmount = PCHGames.getWinningAmountMarkup({
          description: o.data.description,
          amount: o.data.prizeValue,
          isMonetaryWin: !0
        }), $(PCHGames.iwPostGameMessageHolder).append("<div id='cc_holder'>" + PCHGames.claimCode + "</div>"), PCHGames.resetGOSCallbacks.push(function() {
          $("#cc_holder").remove();
        }), t = "MW";
      }
      PCHGames.gameStartResponse.iw_response.response.data.gosOfferSpectrumURL && (PCHGames.GOSOverrideList.push({
        override: "PL",
        callback: PCHGames.setupProductLineup,
        callback_params: [PCHGames.gameStartResponse.iw_response.response.data.gosOfferText, PCHGames.gameStartResponse.iw_response.response.data.gosOfferSpectrumURL]
      }), PCHGames.GAParam = $(PCHGames.gameStartResponse.iw_response.response.data.gosOfferText).find(".gatag_hidden").html()), PCHGames.gameStartResponse.iw_response.response.data.gos && (PCHGames.setupGOSMessageOverride({
        newStatus: "CG",
        overwriteData: PCHGames.gameStartResponse.iw_response.response.data.gos
      }), PCHGames.GOSOverrideList.push({
        override: "CG",
        callback: function() {
          if (PCHGames.gameStartResponse.iw_response.response.data.gos.button_markup) {
            var e = $(PCHGames.iwPlayNextButton).clone().find("a").html(PCHGames.gameStartResponse.iw_response.response.data.gos.button_markup).parent();
            $(PCHGames.iwPlayNextButton).hide(), e.addClass("gos_overwrite").insertAfter(PCHGames.iwPlayNextButton);
          }
        },
        callback_params: []
      }));
    }
    if (1 == PCHUSER.type)
      PCHGames.GAParam = "/GameOverSilver" + PCHGames.GAParam;
    else if (2 == PCHUSER.type && (PCHGames.GAParam = "/GameOverGold" + PCHGames.GAParam, s)) {
      PCHGames.updateTokenBalance();
      var i = "";
      i = 0 != $(winningAmount).length ? $(winningAmount).html() : winningAmount.replace(/\D/g, "");
      var m = {
        value: i,
        description: PCHGames.gameTokenDescription
      };
      PCH.uniExp.tokenCenter && PCH.uniExp.tokenCenter.showLastActivity(m);
    }
    if (void 0 === e.iw_response.response.vip)
      var r = !1;
    else
      var r = !0;
    0 !== PCHGames.gameStartResponse.iw_response.response.data.show_gos && (PCHGames.setupGOS({
      _statusType: t,
      _amount: winningAmount,
      _overrides: PCHGames.GOSOverrideList,
      _isVIP: r
    }), $("html.ie .gameover_msg_open").trigger("click")), e.status, PCHGames.stopNavaway = !0;
  }, PCHGames.setupGOS = function(e) {
    var a = $.extend(!0, {}, PCHGames.GOSSettingsObj[PCHUSER.type][e._statusType]);
    if (e._overrides)
      for (var s = 0; s < e._overrides.length; s++)
        if ("" != e._overrides[s].override) {
          var t = PCHGames.GOSSettingsObj[PCHUSER.type][e._overrides[s].override];
          for (key in t)
            a[key] = t[key];
        }
    "" != e._amount ? a.prize_amt_holder = e._amount : "" == e._amount && $(PCHGames.iwPostGameMessageHolder).addClass(PCHGames.noTokensClassName);
    for (key in a)
      "function" != typeof a[key] ? 0 != a[key].length ? $(PCHGames.GOSSettingsObj.domMap[key]).html(a[key]) : $(PCHGames.GOSSettingsObj.domMap[key]).addClass("hide") : "function" == typeof a[key] && $(PCHGames.GOSSettingsObj.domMap[key]).on("click", a[key]);
    if (e._overrides)
      for (var s = 0; s < e._overrides.length; s++)
        "function" == typeof e._overrides[s].callback && e._overrides[s].callback.apply(void 0, e._overrides[s].callback_params);
    if (e._isVIP)
      if ($(PCHGames.iwPostGameMessageHolder).addClass("vip"), 0 != $("span.gosAmountHolder").length) {
        var n = parseFloat($("span.gosAmountHolder").html().replace(/,/g, ""));
        $("span.gosAmountHolder").html("0"), setTimeout(function() {
          PCHGames.VIPAnimation(n);
        }, 500);
      } else
        PCHGames.VIPAnimation.animationCallback();
    $(PCHGames.iwPostGameMessageHolder).addClass(a.gosClass), 1 == PCHUSER.type && void 0 !== window.bonusTokensGosMsg && $("#iw_message_holder.cash").length < 1 && (void 0 !== PCHGames.gameCount ? PCHGames.gameIndex == PCHGames.gameCount && ($("#token_value_holder").append('<span class="bonus-token">' + window.bonusTokensGosMsg + "</span>"), $(".silver #iw_inner_message_holder").css({height: "auto"})) : ($("#token_value_holder").append('<span class="bonus-token">' + window.bonusTokensGosMsg + "</span>"), $(".silver #iw_inner_message_holder").css({height: "auto"}))), PCHGames.GATagFire(PCHGames.GAParam);
  }, PCHGames.resetGOS = function() {
    PCHGames.GAParam = "", PCHGames.GOSOverrideList = [], $("#iw_message_holder .hide").removeClass("hide"), $(PCHGames.flashContainerId).append($("<div/>", {class: "ajaxLoader"})), $(PCHGames.iwPostGameMessageHolder).removeClass(), $(PCHGames.GOSSettingsObj.domMap.button_cb).off("click"), $(PCHGames.GOSSettingsObj.domMap.nothanks_cb).off("click");
    for (var e = 0; e < PCHGames.resetGOSCallbacks.length; e++)
      "function" == typeof PCHGames.resetGOSCallbacks[e] && PCHGames.resetGOSCallbacks[e](), PCHGames.resetGOSCallbacks.splice(e, 1), e--;
  }, PCHGames.setupProductLineup = function(e, a) {
    $(e).insertBefore("#tokenamount"), $("<span class='line2'>& Play More Games!</span>").insertAfter(".line1"), PCHGames.PLPlayButtonOverride = function() {
      PCHGames.GATagFire(PCHGames.GAParam + "/ClaimRewardsBtnClk"), window.location.href = a;
    }, PCHGames.PLnoThanksButtonOverride = function() {
      PCHGames.GATagFire(PCHGames.GAParam + "/NoThanksBtnClk"), PCHGames.goldButtonCallback();
    }, PCHGames.setupProductLineup.resetOverride = function() {
      $(".line2,#plussign,#cashoff,.gatag_hidden").remove();
    }, PCHGames.resetGOSCallbacks.push(PCHGames.setupProductLineup.resetOverride);
  }, PCHGames.stampOnAnimation = function(e) {
    PCHGames.countUpAnimation({
      div: "span.gosAmountHolder",
      stop: e,
      callback: PCHGames.stampOnAnimation.animationCallback
    });
  }, PCHGames.stampOnAnimation.animationCallback = function(e) {
    var a = "/components/com_pchcom_content/assets/images/sf_exclusive.png";
    e && (a = e.src), $("#iw_inner_message_holder").prepend('<div class="stampOnGOS"><img src="' + a + '"></div>'), $("html").hasClass("cssanimations") ? $(".stampOnGOS").addClass("stampOnGOSAnimation") : ($(".stampOnGOS").css({opacity: "1"}), $(".stampOnGOS").fadeIn()), $(".user_message .nicejob").animate({"margin-left": "125px"}, 500), PCHGames.resetGOSCallbacks.push(function() {
      $(".stampOnGOS").remove(), $(".user_message .nicejob").css({"margin-left": "0px"});
    });
  }, PCHGames.VIPAnimation = function(e) {
    PCHGames.countUpAnimation({
      div: "span.gosAmountHolder",
      stop: e,
      callback: PCHGames.VIPAnimation.animationCallback
    });
  }, PCHGames.VIPAnimation.animationCallback = function(e) {
    var a = "/pchcom_media/images/vip_badge.png";
    e && (a = e.src), $("#iw_inner_message_holder").prepend('<div class="vipStamp"><img src="' + a + '"></div>'), $("html").hasClass("cssanimations") ? $(".vipStamp").addClass("vipStampAnimation") : ($(".vipStamp").css({opacity: "1"}), $(".vipStamp").fadeIn()), $(".user_message .nicejob").animate({"margin-left": "125px"}, 500), PCHGames.resetGOSCallbacks.push(function() {
      $(".vipStamp").remove(), $(".user_message .nicejob").css({"margin-left": "0px"});
    });
  }, PCHGames.countUpAnimation = function(e) {
    var a = e || {};
    if (a.start = a.start || 0, a.intervals = a.intervals || (a.stop - a.start) / 20, !a.div || !a.stop)
      return "function" == typeof a.callback && (a.callback_parameters ? a.callback(a.callback_parameters) : a.callback()), !1;
    var s = $(a.div),
        t = "70px",
        n = "countUpAnimation";
    s.parent().text().trim().length + a.stop.toString().length > 14 && (n = "smallerfont", t = "50px");
    var o = a.start;
    $("html").hasClass("cssanimations") ? s.html(a.start).parent().addClass(n) : $("#token_value_holder #tokenamount").animate({"font-size": t}, 500);
    var i = setInterval(function() {
      o += a.intervals, o <= a.stop ? s.html(addCommas(parseInt(o))) : (s.html(addCommas(parseInt(a.stop))), clearInterval(i), "function" == typeof a.callback && (a.callback_parameters ? a.callback(a.callback_parameters) : a.callback()));
    }, 100);
    PCHGames.countUpAnimation.resetGOS = function() {
      s.parent().removeClass(n), $("#token_value_holder #tokenamount").css({"font-size": "45px"});
    }, PCHGames.resetGOSCallbacks.push(PCHGames.countUpAnimation.resetGOS);
  }, PCHGames.setupGOSMessageOverride = function(e) {
    var a = {},
        s = $();
    return e.overwriteData.top && (a.main_msg = e.overwriteData.top, e.overwriteData.top_sub && (a.main_msg += " " + e.overwriteData.top_sub)), e.overwriteData.main && (a.bottom_msg = e.overwriteData.main), e.overwriteData.button && (a.button_msg = e.overwriteData.button), e.overwriteData.bottom && (a.nothanks_text = e.overwriteData.bottom), e.overwriteData.main_np && (s = $(".silver_createpwd_msg").clone().html(e.overwriteData.main_np), $(".silver_createpwd_msg").hide(), s.addClass("gos_overwrite").insertAfter(".silver_createpwd_msg")), PCHGames.GOSSettingsObj[PCHUSER.type][e.newStatus] = a, PCHGames.setupGOSMessageOverride.resetGOS = function() {
      $(PCHGames.iwPlayNextButton + ".gos_overwrite").add(s).remove(), $(".silver_createpwd_msg").add(PCHGames.iwPlayNextButton).show();
    }, PCHGames.resetGOSCallbacks.push(PCHGames.setupGOSMessageOverride.resetGOS), e.newStatus;
  }, PCHGames.attachEvents = function() {
    function e() {
      return $(PCHGames.iwPostGameMessageHolder).animate({top: "-400px"}, 300), !1;
    }
    console.log("attaching events"), $(document).keydown(function(e) {
      if (13 == e.which && PCHGames.isFlashGame) {
        var a = PCHGames.thisMovie(PCHGames.flashObject);
        "function" == typeof a.flashStart && a.flashStart();
      }
    }), $("#iw_message_holder #silver_set_password #PW,#iw_message_holder #silver_set_password #CP").on("keyup", function(e) {
      13 === e.which && $(".play_more_button a").trigger("click");
    }), $("#PW,#CP").on("focus", function() {
      $(this).parent().find("span").addClass("light");
    }), $("#PW,#CP").on("blur", function() {
      $(this).parent().find("span").removeClass("light");
    }), $("#PW,#CP").on("keyup", function() {
      "" === $.trim($(this).val()) ? $(this).parent().find("span").show() : $(this).parent().find("span").hide();
    }), $("html").hasClass("cssanimations") || ($("html.ie .gameover_msg_close").on("click", function() {}), $("html.ie .gameover_msg_open").on("click", function() {
      $(PCHGames.iwPostGameMessageHolder).animate({top: "-15px"}, 200, "linear", function() {
        $(PCHGames.iwPostGameMessageHolder).animate({top: "-1px"}, 75, function() {
          $(PCHGames.iwPostGameMessageHolder).animate({top: "-15px"}, 75, function() {
            $(PCHGames.iwPostGameMessageHolder).animate({top: "-29px"}, 75, function() {
              $(PCHGames.iwPostGameMessageHolder).animate({top: "-15px"}, 75);
            });
          });
        });
      });
    }), $("html.ie " + PCHGames.goldClass + PCHGames.iwPlayNextButton).on("click", e), $("html.ie " + PCHGames.silverClass + "#forfeit").on("click", e)), $(".gameover_msg_close").on("click", function() {
      PCHSSOProxy.clearErrors();
    }), $(".gameover_msg_open").on("click", function() {
      PCHSSOProxy.clearErrors(), $(PCHGames.iwPostGameMessageHolder).removeClass("closed");
    }), PCHGames.silverForfeitCallback = function(e) {
      return e.preventDefault(), $(PCHGames.iwPostGameMessageHolder).addClass("hideall"), setTimeout(function() {
        $(PCHGames.iwPostGameMessageHolder).removeClass();
      }, 300), PCHSSOProxy.clearErrors(), 0 != PCHGames.pathGameId ? gaTagLbox = "CreatePassword_BankTokenForPath" : gaTagLbox = "CreatePassword_BankTokens", PCHGA.trackEvent("SSO", "cancel", gaTagLbox), PCHGames.nextStep(), !1;
    }, PCHGames.goldButtonCallback = function(e) {
      return e && e.preventDefault(), $(PCHGames.iwPostGameMessageHolder).addClass("hideall"), setTimeout(function() {
        $(PCHGames.iwPostGameMessageHolder).removeClass();
      }, 300), setTimeout(function() {
        PCHGames.nextStep();
      }, 300), !1;
    }, PCHGames.silverButtonCallback = function(e) {
      e.preventDefault();
      var a = PCHGames.gameCount == PCHGames.currentGameIndex ? PCHGames.returnURL : PCHGames.redirecURL;
      if ($(this).hasClass("disabled"))
        return !1;
      $(this).addClass("disabled");
      var s = $("#keepmesigned").is(":checked");
      0 != PCHGames.pathGameId ? gaTagLbox = "CreatePassword_BankTokenForPath" : gaTagLbox = "CreatePassword_BankTokens", PCHSSOProxy.createPassword(gaTagLbox, PCHGames.gameId, $("#ssoholder"), $("#PW"), $("#CP"), s, !1, a, "", !0);
    }, PCHGames.productLineupCallback = function(e) {
      window.location.href = e;
    }, PCHGames.cashWinCallback = function(e) {
      return e.preventDefault(), PCHGames.fClaim("", "", PCHGames.claimCode, ""), PCHGames.goldButtonCallback(), !0;
    }, PCHGames.GOSSettingsObj = {
      classNames: {},
      domMap: {
        top_msg: ".top_message",
        main_msg: ".nicejob",
        prize_amt_holder: "#token_value_holder #tokenamount",
        bottom_msg: "#gold_message",
        button_msg: "#continue_message",
        button_text: ".play_more_button .line1",
        nothanks_text: "#forfeit a",
        gosClass: "",
        button_cb: PCHGames.iwPlayNextButton,
        nothanks_cb: "#forfeit"
      },
      1: {
        TL: {
          gosClass: PCHGames.silverClassName,
          top_msg: "",
          main_msg: "NICE JOB! You've scored",
          bottom_msg: "",
          button_msg: "Click below to Play More Instant Win Games!",
          button_text: "Continue",
          button_cb: PCHGames.silverButtonCallback,
          nothanks_text: "No thanks, I want to forfeit my tokens.",
          nothanks_cb: PCHGames.silverForfeitCallback
        },
        MW: {
          gosClass: PCHGames.goldClassName + " " + PCHGames.winTypeCashClassName,
          top_msg: "",
          main_msg: "CONGRATULATIONS! You've Won",
          bottom_msg: "You can expect to receive your check in the mail within the next 3 - 5 weeks!",
          button_msg: "Click Below to Play More Instant Win Games!",
          button_text: "Continue",
          button_cb: PCHGames.goldButtonCallback,
          nothanks_text: "",
          nothanks_cb: PCHGames.silverForfeitCallback
        },
        TD: {
          gosClass: PCHGames.silverClassName + " " + PCHGames.techDiffClassName,
          top_msg: "We are experiencing technical difficulties.",
          main_msg: "As a Thank You for your patience You've Been Granted",
          bottom_msg: "",
          button_msg: "Click Below to Play More Instant Win Games",
          button_text: "Continue",
          button_cb: PCHGames.silverButtonCallback,
          nothanks_text: "No thanks, I want to forfeit my tokens.",
          nothanks_cb: PCHGames.silverForfeitCallback
        },
        AP: {
          gosClass: PCHGames.silverClassName + " " + PCHGames.alreadyPlayedClassName,
          top_msg: "This game has been already played.",
          main_msg: "",
          bottom_msg: "",
          button_msg: "Click Below to Play More Instant Win Games",
          button_text: "Continue",
          button_cb: PCHGames.silverButtonCallback,
          nothanks_text: "",
          nothanks_cb: PCHGames.silverForfeitCallback
        },
        SBG: {
          top_msg: "",
          main_msg: "YOU'RE A SUPERSTAR!",
          bottom_msg: "",
          button_msg: ""
        }
      },
      2: {
        TL: {
          gosClass: PCHGames.goldClassName,
          top_msg: "",
          main_msg: "NICE JOB! You've scored",
          bottom_msg: "Don’t forget to redeem your tokens for MORE chances to WIN!",
          button_msg: "Click below to Play More Instant Win Games!",
          button_text: "Continue",
          button_cb: PCHGames.goldButtonCallback,
          nothanks_text: "",
          nothanks_cb: ""
        },
        MW: {
          gosClass: PCHGames.goldClassName + " " + PCHGames.winTypeCashClassName,
          top_msg: "",
          main_msg: "CONGRATULATIONS! You've Won",
          bottom_msg: "You can expect to receive your check in the mail within the next 3 - 5 weeks!",
          button_msg: "Click Below to Play More Instant Win Games!",
          button_text: "Continue",
          button_cb: PCHGames.goldButtonCallback,
          nothanks_text: "",
          nothanks_cb: ""
        },
        TD: {
          gosClass: PCHGames.goldClassName + " " + PCHGames.techDiffClassName,
          top_msg: "We are experiencing technical difficulties",
          main_msg: "AS A THANK YOU FOR YOUR PATIENCE <br/> YOU'VE BEEN GRANTED",
          bottom_msg: "We are sorry for this inconvenience. Please try again!",
          button_msg: "",
          button_text: "Continue",
          button_cb: PCHGames.goldButtonCallback,
          nothanks_text: "No thanks, I want to forfeit my tokens.",
          nothanks_cb: ""
        },
        AP: {
          gosClass: PCHGames.goldClassName + " " + PCHGames.alreadyPlayedClassName,
          top_msg: "This game has been already played.",
          main_msg: "",
          bottom_msg: "",
          button_msg: "Click Below to Play More Instant Win Games!",
          button_text: "Continue",
          button_cb: PCHGames.goldButtonCallback,
          nothanks_text: "",
          nothanks_cb: ""
        },
        PL: {
          gosClass: PCHGames.goldClassName + " " + PCHGames.productLineupClassName,
          button_text: "Claim Reward",
          bottom_msg: "",
          button_msg: "",
          button_cb: function(e) {
            e.preventDefault(), PCHGames.PLPlayButtonOverride();
          },
          nothanks_text: "No Thanks, Play More Instant Win Games Now!",
          nothanks_cb: function(e) {
            e.preventDefault();
          }
        },
        SBG: {
          top_msg: "",
          main_msg: "YOU'RE A SUPERSTAR!",
          bottom_msg: "",
          button_msg: "",
          button_text: "Play Again",
          button_cb: function(e) {
            e.preventDefault(), PCH.GAMES.SBGPlayButtonOverride();
          }
        }
      }
    };
  }, PCHGames.fShowRules = function() {
    PCHGames.popScroll(PCHGames.rules, 400, 400);
  }, PCHGames.fShowFacts = function() {
    PCHGames.popScroll(PCHGames.facts, 400, 400);
  }, PCHGames.popScroll = function(e, a, s) {
    popwin = window.open(e, "win", "scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width=" + a + ",height=" + s), popwin.window.focus();
  }, PCHGames.updateTokenBalance = function() {
    void 0 !== PCH.uniExp.tokenCenter && void 0 !== PCH.uniExp.tokenCenter.updateTokenBalance && PCH.uniExp.tokenCenter.updateTokenBalance();
  }, PCHGames.GATagFire = function(e) {
    PCHGames.gaGameCategory = PCHGames.gaGameCategory || "InstantWin";
    var a = PCHGames.gameDisplayName || "";
    e = e || "", PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + "/" + a + e);
  }, PCHGames.updateGameCount = function(e) {
    e && $("#gameCount").html(e);
  }, PCHGames.updateProgress = function(e) {
    e && $("#currGameNumber").html(e);
  }, PCHGames.getWinningAmountMarkup = function(e) {
    var e = e || {},
        a = e.isMonetaryWin || !1,
        s = e.description || "100 TOKENS",
        t = e.amount || 100,
        n = "TOKENS";
    if (-1 != s.indexOf(t))
      ;
    else {
      if (-1 == s.indexOf(addCommas(t)))
        return s;
      t = addCommas(t);
    }
    var o = s.split(t);
    return o[1] && (n = o[1].trim()), (a ? "$" : "") + "<span class='gosAmountHolder'>" + addCommas(t).toUpperCase() + "</span> " + n.toUpperCase();
  }, PCHGames.makeSplashPageMarkup = function(e) {
    e.idName = e.idName || "", e.text1 = e.text1 || "", e.text2 = e.text2 || "", e.text3 = e.text3 || "", e.text4 = e.text4 || "", e.gaText = e.gaText || "", e.insetDiv = e.insetDiv || "";
    var a = '<div class="done_msg_holder" id="' + e.idName + '"><div class="done_msg_header">' + e.text1 + '</div><div class="done_msg_body"><div class="done_msg_text1">' + e.text2 + '</div><div class="done_msg_text2">' + e.text3 + '</div><div class="done_msg_text3">' + e.text4 + '</div></div><div class="done_msg_btn_holder"><a href="/"data-onclick="PCHGA.trackEvent(' + e.gaText + ',\'click\', PCHGames.gameGaDisplayName)"><imgsrc="/components/com_pchcom_content/assets/images/cont_btn.png" /></a></div></div>';
    $(e.insetDiv).prepend(a);
  }, PCHGames.TriggerSplashPages = function(e, a) {
    var s = 2e3;
    return 0 != PCHGames.pathGameId && void 0 !== PCHGames.splashSessionDisplay && PCHGames.splashSessionDisplay && void 0 !== PCHGames.splashPostPathDisplay && "YES" == PCHGames.splashPostPathDisplay && void 0 !== PCHGames.splashRedirectSeconds && PCHGames.splashRedirectSeconds && (PCHGA.trackEvent("IWNiceWork", "View", PCHGames.gameGaDisplayName), PCHGA.trackEvent("PathSplashpage", "complete", PCHGames.pathCompleteGATag + "/IWSplash"), PCHGA.trackEvent("InstantWin", "complete", PCHGames.gameGaDisplayName + "/IWSplash"), a ? $(a).hide() : $("#iw_flash_outer_holder").hide(), $("#iw_progress_holder").hide(), $("#done_msg_holder_gameover").show(), (s = parseInt(PCHGames.splashRedirectSeconds, 10)) && (s *= 1e3)), e && window.setTimeout(function() {
      window.location.href = e;
    }, s), !1;
  }, console.log("here"), function() {
    console.log("doc ready"), PCHGames.attachEvents(), PCHGames.docReadyCallback = PCHGames.docReadyCallback || function() {
      return !1;
    }, PCHGames.docReadyCallback();
  }();
})(require('process'));
