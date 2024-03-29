/* */ 
(function(Buffer, process) {
  (this.define || function(N, O) {
    this.sourceMapSupport = O();
  })("browser-source-map-support", function(N) {
    (function n(v, m, c) {
      function d(e, a) {
        if (!m[e]) {
          if (!v[e]) {
            var h = "function" == typeof require && require;
            if (!a && h)
              return h(e, !0);
            if (k)
              return k(e, !0);
            throw Error("Cannot find module '" + e + "'");
          }
          h = m[e] = {exports: {}};
          v[e][0].call(h.exports, function(a) {
            var c = v[e][1][a];
            return d(c ? c : a);
          }, h, h.exports, n, v, m, c);
        }
        return m[e].exports;
      }
      for (var k = "function" == typeof require && require,
          q = 0; q < c.length; q++)
        d(c[q]);
      return d;
    })({
      1: [function(n, v, m) {
        N = n("./source-map-support");
      }, {"./source-map-support": 19}],
      2: [function(n, v, m) {
        (function(c) {
          function d(c) {
            c = c.charCodeAt(0);
            if (43 === c || 45 === c)
              return 62;
            if (47 === c || 95 === c)
              return 63;
            if (48 > c)
              return -1;
            if (58 > c)
              return c - 48 + 52;
            if (91 > c)
              return c - 65;
            if (123 > c)
              return c - 97 + 26;
          }
          var k = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
          c.toByteArray = function(c) {
            function e(a) {
              u[b++] = a;
            }
            if (0 < c.length % 4)
              throw Error("Invalid string. Length must be a multiple of 4");
            var a = c.length;
            var h = "=" === c.charAt(a - 2) ? 2 : "=" === c.charAt(a - 1) ? 1 : 0;
            var u = new k(3 * c.length / 4 - h);
            var r = 0 < h ? c.length - 4 : c.length;
            var b = 0;
            for (a = 0; a < r; a += 4) {
              var f = d(c.charAt(a)) << 18 | d(c.charAt(a + 1)) << 12 | d(c.charAt(a + 2)) << 6 | d(c.charAt(a + 3));
              e((f & 16711680) >> 16);
              e((f & 65280) >> 8);
              e(f & 255);
            }
            2 === h ? (f = d(c.charAt(a)) << 2 | d(c.charAt(a + 1)) >> 4, e(f & 255)) : 1 === h && (f = d(c.charAt(a)) << 10 | d(c.charAt(a + 1)) << 4 | d(c.charAt(a + 2)) >> 2, e(f >> 8 & 255), e(f & 255));
            return u;
          };
          c.fromByteArray = function(c) {
            var e = c.length % 3,
                a = "",
                h;
            var d = 0;
            for (h = c.length - e; d < h; d += 3) {
              var r = (c[d] << 16) + (c[d + 1] << 8) + c[d + 2];
              r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >> 18 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >> 12 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >> 6 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r & 63);
              a += r;
            }
            switch (e) {
              case 1:
                r = c[c.length - 1];
                a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >> 2);
                a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r << 4 & 63);
                a += "==";
                break;
              case 2:
                r = (c[c.length - 2] << 8) + c[c.length - 1], a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >> 10), a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >> 4 & 63), a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r << 2 & 63), a += "=";
            }
            return a;
          };
        })("undefined" === typeof m ? this.base64js = {} : m);
      }, {}],
      3: [function(n, v, m) {}, {}],
      4: [function(n, v, m) {
        function c(g, l, b) {
          if (!(this instanceof c))
            return new c(g, l, b);
          var x = typeof g;
          if ("base64" === l && "string" === x)
            for (g = g.trim ? g.trim() : g.replace(/^\s+|\s+$/g, ""); 0 !== g.length % 4; )
              g += "=";
          if ("number" === x)
            var a = B(g);
          else if ("string" === x)
            a = c.byteLength(g, l);
          else if ("object" === x)
            a = B(g.length);
          else
            throw Error("First argument needs to be a number, array or string.");
          if (c._useTypedArrays)
            var f = c._augment(new Uint8Array(a));
          else
            f = this, f.length = a, f._isBuffer = !0;
          if (c._useTypedArrays && "number" === typeof g.byteLength)
            f._set(g);
          else {
            var e = g;
            if (L(e) || c.isBuffer(e) || e && "object" === typeof e && "number" === typeof e.length)
              for (l = 0; l < a; l++)
                c.isBuffer(g) ? f[l] = g.readUInt8(l) : f[l] = g[l];
            else if ("string" === x)
              f.write(g, 0, l);
            else if ("number" === x && !c._useTypedArrays && !b)
              for (l = 0; l < a; l++)
                f[l] = 0;
          }
          return f;
        }
        function d(g, l, b) {
          var x = "";
          for (b = Math.min(g.length, b); l < b; l++)
            x += String.fromCharCode(g[l]);
          return x;
        }
        function k(g, l, b, a) {
          a || (p("boolean" === typeof b, "missing or invalid endian"), p(void 0 !== l && null !== l, "missing offset"), p(l + 1 < g.length, "Trying to read beyond buffer length"));
          a = g.length;
          if (!(l >= a))
            return b ? (b = g[l], l + 1 < a && (b |= g[l + 1] << 8)) : (b = g[l] << 8, l + 1 < a && (b |= g[l + 1])), b;
        }
        function q(g, l, b, a) {
          a || (p("boolean" === typeof b, "missing or invalid endian"), p(void 0 !== l && null !== l, "missing offset"), p(l + 3 < g.length, "Trying to read beyond buffer length"));
          a = g.length;
          if (!(l >= a)) {
            var x;
            b ? (l + 2 < a && (x = g[l + 2] << 16), l + 1 < a && (x |= g[l + 1] << 8), x |= g[l], l + 3 < a && (x += g[l + 3] << 24 >>> 0)) : (l + 1 < a && (x = g[l + 1] << 16), l + 2 < a && (x |= g[l + 2] << 8), l + 3 < a && (x |= g[l + 3]), x += g[l] << 24 >>> 0);
            return x;
          }
        }
        function e(g, l, b, a) {
          a || (p("boolean" === typeof b, "missing or invalid endian"), p(void 0 !== l && null !== l, "missing offset"), p(l + 1 < g.length, "Trying to read beyond buffer length"));
          if (!(l >= g.length))
            return g = k(g, l, b, !0), g & 32768 ? -1 * (65535 - g + 1) : g;
        }
        function a(g, l, b, a) {
          a || (p("boolean" === typeof b, "missing or invalid endian"), p(void 0 !== l && null !== l, "missing offset"), p(l + 3 < g.length, "Trying to read beyond buffer length"));
          if (!(l >= g.length))
            return g = q(g, l, b, !0), g & 2147483648 ? -1 * (4294967295 - g + 1) : g;
        }
        function h(g, l, b, a) {
          a || (p("boolean" === typeof b, "missing or invalid endian"), p(l + 3 < g.length, "Trying to read beyond buffer length"));
          return J.read(g, l, b, 23, 4);
        }
        function u(g, l, b, a) {
          a || (p("boolean" === typeof b, "missing or invalid endian"), p(l + 7 < g.length, "Trying to read beyond buffer length"));
          return J.read(g, l, b, 52, 8);
        }
        function r(g, l, b, a, c) {
          c || (p(void 0 !== l && null !== l, "missing value"), p("boolean" === typeof a, "missing or invalid endian"), p(void 0 !== b && null !== b, "missing offset"), p(b + 1 < g.length, "trying to write beyond buffer length"), H(l, 65535));
          var x = g.length;
          if (!(b >= x))
            for (c = 0, x = Math.min(x - b, 2); c < x; c++)
              g[b + c] = (l & 255 << 8 * (a ? c : 1 - c)) >>> 8 * (a ? c : 1 - c);
        }
        function b(g, l, b, a, c) {
          c || (p(void 0 !== l && null !== l, "missing value"), p("boolean" === typeof a, "missing or invalid endian"), p(void 0 !== b && null !== b, "missing offset"), p(b + 3 < g.length, "trying to write beyond buffer length"), H(l, 4294967295));
          var x = g.length;
          if (!(b >= x))
            for (c = 0, x = Math.min(x - b, 4); c < x; c++)
              g[b + c] = l >>> 8 * (a ? c : 3 - c) & 255;
        }
        function f(g, l, b, a, c) {
          c || (p(void 0 !== l && null !== l, "missing value"), p("boolean" === typeof a, "missing or invalid endian"), p(void 0 !== b && null !== b, "missing offset"), p(b + 1 < g.length, "Trying to write beyond buffer length"), z(l, 32767, -32768));
          b >= g.length || (0 <= l ? r(g, l, b, a, c) : r(g, 65535 + l + 1, b, a, c));
        }
        function G(g, l, a, c, f) {
          f || (p(void 0 !== l && null !== l, "missing value"), p("boolean" === typeof c, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 3 < g.length, "Trying to write beyond buffer length"), z(l, 2147483647, -2147483648));
          a >= g.length || (0 <= l ? b(g, l, a, c, f) : b(g, 4294967295 + l + 1, a, c, f));
        }
        function t(g, b, a, c, f) {
          f || (p(void 0 !== b && null !== b, "missing value"), p("boolean" === typeof c, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 3 < g.length, "Trying to write beyond buffer length"), E(b, 3.4028234663852886E38, -3.4028234663852886E38));
          a >= g.length || J.write(g, b, a, c, 23, 4);
        }
        function M(g, b, a, c, f) {
          f || (p(void 0 !== b && null !== b, "missing value"), p("boolean" === typeof c, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 7 < g.length, "Trying to write beyond buffer length"), E(b, 1.7976931348623157E308, -1.7976931348623157E308));
          a >= g.length || J.write(g, b, a, c, 52, 8);
        }
        function I(g, b, a) {
          if ("number" !== typeof g)
            return a;
          g = ~~g;
          if (g >= b)
            return b;
          if (0 <= g)
            return g;
          g += b;
          return 0 <= g ? g : 0;
        }
        function B(g) {
          g = ~~Math.ceil(+g);
          return 0 > g ? 0 : g;
        }
        function L(g) {
          return (Array.isArray || function(g) {
            return "[object Array]" === Object.prototype.toString.call(g);
          })(g);
        }
        function C(g) {
          return 16 > g ? "0" + g.toString(16) : g.toString(16);
        }
        function y(g) {
          for (var b = [],
              a = 0; a < g.length; a++) {
            var c = g.charCodeAt(a);
            if (127 >= c)
              b.push(g.charCodeAt(a));
            else {
              var f = a;
              55296 <= c && 57343 >= c && a++;
              c = encodeURIComponent(g.slice(f, a + 1)).substr(1).split("%");
              for (f = 0; f < c.length; f++)
                b.push(parseInt(c[f], 16));
            }
          }
          return b;
        }
        function K(g) {
          for (var b = [],
              a = 0; a < g.length; a++)
            b.push(g.charCodeAt(a) & 255);
          return b;
        }
        function A(g, b, a, c) {
          for (var l = 0; l < c && !(l + a >= b.length || l >= g.length); l++)
            b[l + a] = g[l];
          return l;
        }
        function F(g) {
          try {
            return decodeURIComponent(g);
          } catch (l) {
            return String.fromCharCode(65533);
          }
        }
        function H(g, b) {
          p("number" === typeof g, "cannot write a non-number as a number");
          p(0 <= g, "specified a negative value for writing an unsigned value");
          p(g <= b, "value is larger than maximum value for type");
          p(Math.floor(g) === g, "value has a fractional component");
        }
        function z(g, b, a) {
          p("number" === typeof g, "cannot write a non-number as a number");
          p(g <= b, "value larger than maximum allowed value");
          p(g >= a, "value smaller than minimum allowed value");
          p(Math.floor(g) === g, "value has a fractional component");
        }
        function E(g, b, a) {
          p("number" === typeof g, "cannot write a non-number as a number");
          p(g <= b, "value larger than maximum allowed value");
          p(g >= a, "value smaller than minimum allowed value");
        }
        function p(g, b) {
          if (!g)
            throw Error(b || "Failed assertion");
        }
        var D = n("base64-js"),
            J = n("ieee754");
        m.Buffer = c;
        m.SlowBuffer = c;
        m.INSPECT_MAX_BYTES = 50;
        c.poolSize = 8192;
        c._useTypedArrays = function() {
          try {
            var g = new ArrayBuffer(0),
                b = new Uint8Array(g);
            b.foo = function() {
              return 42;
            };
            return 42 === b.foo() && "function" === typeof b.subarray;
          } catch (x) {
            return !1;
          }
        }();
        c.isEncoding = function(g) {
          switch (String(g).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "raw":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return !0;
            default:
              return !1;
          }
        };
        c.isBuffer = function(g) {
          return !(null === g || void 0 === g || !g._isBuffer);
        };
        c.byteLength = function(g, b) {
          g += "";
          switch (b || "utf8") {
            case "hex":
              var a = g.length / 2;
              break;
            case "utf8":
            case "utf-8":
              a = y(g).length;
              break;
            case "ascii":
            case "binary":
            case "raw":
              a = g.length;
              break;
            case "base64":
              a = D.toByteArray(g).length;
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              a = 2 * g.length;
              break;
            default:
              throw Error("Unknown encoding");
          }
          return a;
        };
        c.concat = function(g, b) {
          p(L(g), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array.");
          if (0 === g.length)
            return new c(0);
          if (1 === g.length)
            return g[0];
          var a;
          if ("number" !== typeof b)
            for (a = b = 0; a < g.length; a++)
              b += g[a].length;
          var l = new c(b),
              f = 0;
          for (a = 0; a < g.length; a++) {
            var e = g[a];
            e.copy(l, f);
            f += e.length;
          }
          return l;
        };
        c.prototype.write = function(g, b, a, f) {
          if (isFinite(b))
            isFinite(a) || (f = a, a = void 0);
          else {
            var l = f;
            f = b;
            b = a;
            a = l;
          }
          b = Number(b) || 0;
          l = this.length - b;
          a ? (a = Number(a), a > l && (a = l)) : a = l;
          f = String(f || "utf8").toLowerCase();
          switch (f) {
            case "hex":
              b = Number(b) || 0;
              f = this.length - b;
              a ? (a = Number(a), a > f && (a = f)) : a = f;
              f = g.length;
              p(0 === f % 2, "Invalid hex string");
              a > f / 2 && (a = f / 2);
              for (f = 0; f < a; f++)
                l = parseInt(g.substr(2 * f, 2), 16), p(!isNaN(l), "Invalid hex string"), this[b + f] = l;
              c._charsWritten = 2 * f;
              g = f;
              break;
            case "utf8":
            case "utf-8":
              g = c._charsWritten = A(y(g), this, b, a);
              break;
            case "ascii":
              g = c._charsWritten = A(K(g), this, b, a);
              break;
            case "binary":
              g = c._charsWritten = A(K(g), this, b, a);
              break;
            case "base64":
              g = c._charsWritten = A(D.toByteArray(g), this, b, a);
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              l = [];
              for (var e = 0; e < g.length; e++) {
                var h = g.charCodeAt(e);
                f = h >> 8;
                h %= 256;
                l.push(h);
                l.push(f);
              }
              g = c._charsWritten = A(l, this, b, a);
              break;
            default:
              throw Error("Unknown encoding");
          }
          return g;
        };
        c.prototype.toString = function(g, b, a) {
          g = String(g || "utf8").toLowerCase();
          b = Number(b) || 0;
          a = void 0 !== a ? Number(a) : a = this.length;
          if (a === b)
            return "";
          switch (g) {
            case "hex":
              g = this.length;
              if (!b || 0 > b)
                b = 0;
              if (!a || 0 > a || a > g)
                a = g;
              for (g = ""; b < a; b++)
                g += C(this[b]);
              a = g;
              break;
            case "utf8":
            case "utf-8":
              var c = g = "";
              for (a = Math.min(this.length, a); b < a; b++)
                127 >= this[b] ? (g += F(c) + String.fromCharCode(this[b]), c = "") : c += "%" + this[b].toString(16);
              a = g + F(c);
              break;
            case "ascii":
              a = d(this, b, a);
              break;
            case "binary":
              a = d(this, b, a);
              break;
            case "base64":
              a = 0 === b && a === this.length ? D.fromByteArray(this) : D.fromByteArray(this.slice(b, a));
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              a = this.slice(b, a);
              b = "";
              for (g = 0; g < a.length; g += 2)
                b += String.fromCharCode(a[g] + 256 * a[g + 1]);
              a = b;
              break;
            default:
              throw Error("Unknown encoding");
          }
          return a;
        };
        c.prototype.toJSON = function() {
          return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0)
          };
        };
        c.prototype.copy = function(g, b, a, f) {
          a || (a = 0);
          f || 0 === f || (f = this.length);
          b || (b = 0);
          if (f !== a && 0 !== g.length && 0 !== this.length)
            if (p(f >= a, "sourceEnd < sourceStart"), p(0 <= b && b < g.length, "targetStart out of bounds"), p(0 <= a && a < this.length, "sourceStart out of bounds"), p(0 <= f && f <= this.length, "sourceEnd out of bounds"), f > this.length && (f = this.length), g.length - b < f - a && (f = g.length - b + a), f -= a, 100 > f || !c._useTypedArrays)
              for (var l = 0; l < f; l++)
                g[l + b] = this[l + a];
            else
              g._set(this.subarray(a, a + f), b);
        };
        c.prototype.slice = function(b, a) {
          var g = this.length;
          b = I(b, g, 0);
          a = I(a, g, g);
          if (c._useTypedArrays)
            return c._augment(this.subarray(b, a));
          g = a - b;
          for (var f = new c(g, void 0, !0),
              l = 0; l < g; l++)
            f[l] = this[l + b];
          return f;
        };
        c.prototype.get = function(b) {
          console.log(".get() is deprecated. Access using array indexes instead.");
          return this.readUInt8(b);
        };
        c.prototype.set = function(b, a) {
          console.log(".set() is deprecated. Access using array indexes instead.");
          return this.writeUInt8(b, a);
        };
        c.prototype.readUInt8 = function(b, a) {
          a || (p(void 0 !== b && null !== b, "missing offset"), p(b < this.length, "Trying to read beyond buffer length"));
          if (!(b >= this.length))
            return this[b];
        };
        c.prototype.readUInt16LE = function(b, a) {
          return k(this, b, !0, a);
        };
        c.prototype.readUInt16BE = function(b, a) {
          return k(this, b, !1, a);
        };
        c.prototype.readUInt32LE = function(b, a) {
          return q(this, b, !0, a);
        };
        c.prototype.readUInt32BE = function(b, a) {
          return q(this, b, !1, a);
        };
        c.prototype.readInt8 = function(b, a) {
          a || (p(void 0 !== b && null !== b, "missing offset"), p(b < this.length, "Trying to read beyond buffer length"));
          if (!(b >= this.length))
            return this[b] & 128 ? -1 * (255 - this[b] + 1) : this[b];
        };
        c.prototype.readInt16LE = function(b, a) {
          return e(this, b, !0, a);
        };
        c.prototype.readInt16BE = function(b, a) {
          return e(this, b, !1, a);
        };
        c.prototype.readInt32LE = function(b, f) {
          return a(this, b, !0, f);
        };
        c.prototype.readInt32BE = function(b, f) {
          return a(this, b, !1, f);
        };
        c.prototype.readFloatLE = function(b, a) {
          return h(this, b, !0, a);
        };
        c.prototype.readFloatBE = function(b, a) {
          return h(this, b, !1, a);
        };
        c.prototype.readDoubleLE = function(b, a) {
          return u(this, b, !0, a);
        };
        c.prototype.readDoubleBE = function(b, a) {
          return u(this, b, !1, a);
        };
        c.prototype.writeUInt8 = function(b, a, f) {
          f || (p(void 0 !== b && null !== b, "missing value"), p(void 0 !== a && null !== a, "missing offset"), p(a < this.length, "trying to write beyond buffer length"), H(b, 255));
          a >= this.length || (this[a] = b);
        };
        c.prototype.writeUInt16LE = function(b, a, f) {
          r(this, b, a, !0, f);
        };
        c.prototype.writeUInt16BE = function(b, a, f) {
          r(this, b, a, !1, f);
        };
        c.prototype.writeUInt32LE = function(a, f, c) {
          b(this, a, f, !0, c);
        };
        c.prototype.writeUInt32BE = function(a, f, c) {
          b(this, a, f, !1, c);
        };
        c.prototype.writeInt8 = function(b, a, f) {
          f || (p(void 0 !== b && null !== b, "missing value"), p(void 0 !== a && null !== a, "missing offset"), p(a < this.length, "Trying to write beyond buffer length"), z(b, 127, -128));
          a >= this.length || (0 <= b ? this.writeUInt8(b, a, f) : this.writeUInt8(255 + b + 1, a, f));
        };
        c.prototype.writeInt16LE = function(b, a, c) {
          f(this, b, a, !0, c);
        };
        c.prototype.writeInt16BE = function(b, a, c) {
          f(this, b, a, !1, c);
        };
        c.prototype.writeInt32LE = function(b, a, f) {
          G(this, b, a, !0, f);
        };
        c.prototype.writeInt32BE = function(b, a, f) {
          G(this, b, a, !1, f);
        };
        c.prototype.writeFloatLE = function(b, a, f) {
          t(this, b, a, !0, f);
        };
        c.prototype.writeFloatBE = function(b, a, f) {
          t(this, b, a, !1, f);
        };
        c.prototype.writeDoubleLE = function(b, a, f) {
          M(this, b, a, !0, f);
        };
        c.prototype.writeDoubleBE = function(b, a, f) {
          M(this, b, a, !1, f);
        };
        c.prototype.fill = function(b, a, f) {
          b || (b = 0);
          a || (a = 0);
          f || (f = this.length);
          "string" === typeof b && (b = b.charCodeAt(0));
          p("number" === typeof b && !isNaN(b), "value is not a number");
          p(f >= a, "end < start");
          if (f !== a && 0 !== this.length)
            for (p(0 <= a && a < this.length, "start out of bounds"), p(0 <= f && f <= this.length, "end out of bounds"); a < f; a++)
              this[a] = b;
        };
        c.prototype.inspect = function() {
          for (var b = [],
              a = this.length,
              f = 0; f < a; f++)
            if (b[f] = C(this[f]), f === m.INSPECT_MAX_BYTES) {
              b[f + 1] = "...";
              break;
            }
          return "<Buffer " + b.join(" ") + ">";
        };
        c.prototype.toArrayBuffer = function() {
          if ("undefined" !== typeof Uint8Array) {
            if (c._useTypedArrays)
              return (new c(this)).buffer;
            for (var b = new Uint8Array(this.length),
                a = 0,
                f = b.length; a < f; a += 1)
              b[a] = this[a];
            return b.buffer;
          }
          throw Error("Buffer.toArrayBuffer not supported in this browser");
        };
        var w = c.prototype;
        c._augment = function(b) {
          b._isBuffer = !0;
          b._get = b.get;
          b._set = b.set;
          b.get = w.get;
          b.set = w.set;
          b.write = w.write;
          b.toString = w.toString;
          b.toLocaleString = w.toString;
          b.toJSON = w.toJSON;
          b.copy = w.copy;
          b.slice = w.slice;
          b.readUInt8 = w.readUInt8;
          b.readUInt16LE = w.readUInt16LE;
          b.readUInt16BE = w.readUInt16BE;
          b.readUInt32LE = w.readUInt32LE;
          b.readUInt32BE = w.readUInt32BE;
          b.readInt8 = w.readInt8;
          b.readInt16LE = w.readInt16LE;
          b.readInt16BE = w.readInt16BE;
          b.readInt32LE = w.readInt32LE;
          b.readInt32BE = w.readInt32BE;
          b.readFloatLE = w.readFloatLE;
          b.readFloatBE = w.readFloatBE;
          b.readDoubleLE = w.readDoubleLE;
          b.readDoubleBE = w.readDoubleBE;
          b.writeUInt8 = w.writeUInt8;
          b.writeUInt16LE = w.writeUInt16LE;
          b.writeUInt16BE = w.writeUInt16BE;
          b.writeUInt32LE = w.writeUInt32LE;
          b.writeUInt32BE = w.writeUInt32BE;
          b.writeInt8 = w.writeInt8;
          b.writeInt16LE = w.writeInt16LE;
          b.writeInt16BE = w.writeInt16BE;
          b.writeInt32LE = w.writeInt32LE;
          b.writeInt32BE = w.writeInt32BE;
          b.writeFloatLE = w.writeFloatLE;
          b.writeFloatBE = w.writeFloatBE;
          b.writeDoubleLE = w.writeDoubleLE;
          b.writeDoubleBE = w.writeDoubleBE;
          b.fill = w.fill;
          b.inspect = w.inspect;
          b.toArrayBuffer = w.toArrayBuffer;
          return b;
        };
      }, {
        "base64-js": 2,
        ieee754: 5
      }],
      5: [function(n, v, m) {
        m.read = function(c, d, k, q, e) {
          var a = 8 * e - q - 1;
          var h = (1 << a) - 1,
              u = h >> 1,
              r = -7;
          e = k ? e - 1 : 0;
          var b = k ? -1 : 1,
              f = c[d + e];
          e += b;
          k = f & (1 << -r) - 1;
          f >>= -r;
          for (r += a; 0 < r; k = 256 * k + c[d + e], e += b, r -= 8)
            ;
          a = k & (1 << -r) - 1;
          k >>= -r;
          for (r += q; 0 < r; a = 256 * a + c[d + e], e += b, r -= 8)
            ;
          if (0 === k)
            k = 1 - u;
          else {
            if (k === h)
              return a ? NaN : Infinity * (f ? -1 : 1);
            a += Math.pow(2, q);
            k -= u;
          }
          return (f ? -1 : 1) * a * Math.pow(2, k - q);
        };
        m.write = function(c, d, k, q, e, a) {
          var h,
              u = 8 * a - e - 1,
              r = (1 << u) - 1,
              b = r >> 1,
              f = 23 === e ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
          a = q ? 0 : a - 1;
          var G = q ? 1 : -1,
              t = 0 > d || 0 === d && 0 > 1 / d ? 1 : 0;
          d = Math.abs(d);
          isNaN(d) || Infinity === d ? (d = isNaN(d) ? 1 : 0, q = r) : (q = Math.floor(Math.log(d) / Math.LN2), 1 > d * (h = Math.pow(2, -q)) && (q--, h *= 2), d = 1 <= q + b ? d + f / h : d + f * Math.pow(2, 1 - b), 2 <= d * h && (q++, h /= 2), q + b >= r ? (d = 0, q = r) : 1 <= q + b ? (d = (d * h - 1) * Math.pow(2, e), q += b) : (d = d * Math.pow(2, b - 1) * Math.pow(2, e), q = 0));
          for (; 8 <= e; c[k + a] = d & 255, a += G, d /= 256, e -= 8)
            ;
          q = q << e | d;
          for (u += e; 0 < u; c[k + a] = q & 255, a += G, q /= 256, u -= 8)
            ;
          c[k + a - G] |= 128 * t;
        };
      }, {}],
      6: [function(n, v, m) {
        (function(c) {
          function d(a, c) {
            for (var e = 0,
                h = a.length - 1; 0 <= h; h--) {
              var b = a[h];
              "." === b ? a.splice(h, 1) : ".." === b ? (a.splice(h, 1), e++) : e && (a.splice(h, 1), e--);
            }
            if (c)
              for (; e--; e)
                a.unshift("..");
            return a;
          }
          function k(a, c) {
            if (a.filter)
              return a.filter(c);
            for (var e = [],
                h = 0; h < a.length; h++)
              c(a[h], h, a) && e.push(a[h]);
            return e;
          }
          var q = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          m.resolve = function() {
            for (var a = "",
                e = !1,
                u = arguments.length - 1; -1 <= u && !e; u--) {
              var r = 0 <= u ? arguments[u] : c.cwd();
              if ("string" !== typeof r)
                throw new TypeError("Arguments to path.resolve must be strings");
              r && (a = r + "/" + a, e = "/" === r.charAt(0));
            }
            a = d(k(a.split("/"), function(b) {
              return !!b;
            }), !e).join("/");
            return (e ? "/" : "") + a || ".";
          };
          m.normalize = function(a) {
            var c = m.isAbsolute(a),
                u = "/" === e(a, -1);
            (a = d(k(a.split("/"), function(a) {
              return !!a;
            }), !c).join("/")) || c || (a = ".");
            a && u && (a += "/");
            return (c ? "/" : "") + a;
          };
          m.isAbsolute = function(a) {
            return "/" === a.charAt(0);
          };
          m.join = function() {
            var a = Array.prototype.slice.call(arguments, 0);
            return m.normalize(k(a, function(a, c) {
              if ("string" !== typeof a)
                throw new TypeError("Arguments to path.join must be strings");
              return a;
            }).join("/"));
          };
          m.relative = function(a, c) {
            function e(b) {
              for (var a = 0; a < b.length && "" === b[a]; a++)
                ;
              for (var f = b.length - 1; 0 <= f && "" === b[f]; f--)
                ;
              return a > f ? [] : b.slice(a, f - a + 1);
            }
            a = m.resolve(a).substr(1);
            c = m.resolve(c).substr(1);
            for (var h = e(a.split("/")),
                b = e(c.split("/")),
                f = Math.min(h.length, b.length),
                G = f,
                t = 0; t < f; t++)
              if (h[t] !== b[t]) {
                G = t;
                break;
              }
            f = [];
            for (t = G; t < h.length; t++)
              f.push("..");
            f = f.concat(b.slice(G));
            return f.join("/");
          };
          m.sep = "/";
          m.delimiter = ":";
          m.dirname = function(a) {
            var c = q.exec(a).slice(1);
            a = c[0];
            c = c[1];
            if (!a && !c)
              return ".";
            c && (c = c.substr(0, c.length - 1));
            return a + c;
          };
          m.basename = function(a, c) {
            var e = q.exec(a).slice(1)[2];
            c && e.substr(-1 * c.length) === c && (e = e.substr(0, e.length - c.length));
            return e;
          };
          m.extname = function(a) {
            return q.exec(a).slice(1)[3];
          };
          var e = "b" === "ab".substr(-1) ? function(a, c, e) {
            return a.substr(c, e);
          } : function(a, c, e) {
            0 > c && (c = a.length + c);
            return a.substr(c, e);
          };
        }).call(this, n("node_modules/process/browser.js"));
      }, {"node_modules/process/browser.js": 7}],
      7: [function(n, v, m) {
        function c() {}
        n = v.exports = {};
        n.nextTick = function() {
          if ("undefined" !== typeof window && window.setImmediate)
            return function(c) {
              return window.setImmediate(c);
            };
          if ("undefined" !== typeof window && window.postMessage && window.addEventListener) {
            var c = [];
            window.addEventListener("message", function(d) {
              var k = d.source;
              k !== window && null !== k || "process-tick" !== d.data || (d.stopPropagation(), 0 < c.length && c.shift()());
            }, !0);
            return function(d) {
              c.push(d);
              window.postMessage("process-tick", "*");
            };
          }
          return function(c) {
            setTimeout(c, 0);
          };
        }();
        n.title = "browser";
        n.browser = !0;
        n.env = {};
        n.argv = [];
        n.on = c;
        n.once = c;
        n.off = c;
        n.emit = c;
        n.binding = function(c) {
          throw Error("process.binding is not supported");
        };
        n.cwd = function() {
          return "/";
        };
        n.chdir = function(c) {
          throw Error("process.chdir is not supported");
        };
      }, {}],
      8: [function(n, v, m) {
        function c() {
          this._array = [];
          this._set = Object.create(null);
        }
        var d = n("./util"),
            k = Object.prototype.hasOwnProperty;
        c.fromArray = function(d, e) {
          for (var a = new c,
              h = 0,
              k = d.length; h < k; h++)
            a.add(d[h], e);
          return a;
        };
        c.prototype.size = function() {
          return Object.getOwnPropertyNames(this._set).length;
        };
        c.prototype.add = function(c, e) {
          var a = d.toSetString(c),
              h = k.call(this._set, a),
              u = this._array.length;
          h && !e || this._array.push(c);
          h || (this._set[a] = u);
        };
        c.prototype.has = function(c) {
          c = d.toSetString(c);
          return k.call(this._set, c);
        };
        c.prototype.indexOf = function(c) {
          var e = d.toSetString(c);
          if (k.call(this._set, e))
            return this._set[e];
          throw Error('"' + c + '" is not in the set.');
        };
        c.prototype.at = function(c) {
          if (0 <= c && c < this._array.length)
            return this._array[c];
          throw Error("No element indexed by " + c);
        };
        c.prototype.toArray = function() {
          return this._array.slice();
        };
        m.ArraySet = c;
      }, {"./util": 17}],
      9: [function(n, v, m) {
        var c = n("./base64");
        m.encode = function(d) {
          var k = "",
              q = 0 > d ? (-d << 1) + 1 : (d << 1) + 0;
          do
            d = q & 31, q >>>= 5, 0 < q && (d |= 32), k += c.encode(d);
 while (0 < q);
          return k;
        };
        m.decode = function(d, k, q) {
          var e = d.length,
              a = 0,
              h = 0;
          do {
            if (k >= e)
              throw Error("Expected more digits in base 64 VLQ value.");
            var u = c.decode(d.charCodeAt(k++));
            if (-1 === u)
              throw Error("Invalid base64 digit: " + d.charAt(k - 1));
            var r = !!(u & 32);
            u &= 31;
            a += u << h;
            h += 5;
          } while (r);
          d = a >> 1;
          q.value = 1 === (a & 1) ? -d : d;
          q.rest = k;
        };
      }, {"./base64": 10}],
      10: [function(n, v, m) {
        var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
        m.encode = function(d) {
          if (0 <= d && d < c.length)
            return c[d];
          throw new TypeError("Must be between 0 and 63: " + d);
        };
        m.decode = function(c) {
          return 65 <= c && 90 >= c ? c - 65 : 97 <= c && 122 >= c ? c - 97 + 26 : 48 <= c && 57 >= c ? c - 48 + 52 : 43 == c ? 62 : 47 == c ? 63 : -1;
        };
      }, {}],
      11: [function(n, v, m) {
        function c(d, k, q, e, a, h) {
          var u = Math.floor((k - d) / 2) + d,
              r = a(q, e[u], !0);
          return 0 === r ? u : 0 < r ? 1 < k - u ? c(u, k, q, e, a, h) : h == m.LEAST_UPPER_BOUND ? k < e.length ? k : -1 : u : 1 < u - d ? c(d, u, q, e, a, h) : h == m.LEAST_UPPER_BOUND ? u : 0 > d ? -1 : d;
        }
        m.GREATEST_LOWER_BOUND = 1;
        m.LEAST_UPPER_BOUND = 2;
        m.search = function(d, k, q, e) {
          if (0 === k.length)
            return -1;
          d = c(-1, k.length, d, k, q, e || m.GREATEST_LOWER_BOUND);
          if (0 > d)
            return -1;
          for (; 0 <= d - 1 && 0 === q(k[d], k[d - 1], !0); )
            --d;
          return d;
        };
      }, {}],
      12: [function(n, v, m) {
        function c() {
          this._array = [];
          this._sorted = !0;
          this._last = {
            generatedLine: -1,
            generatedColumn: 0
          };
        }
        var d = n("./util");
        c.prototype.unsortedForEach = function(c, d) {
          this._array.forEach(c, d);
        };
        c.prototype.add = function(c) {
          var k = this._last,
              e = k.generatedLine,
              a = c.generatedLine,
              h = k.generatedColumn,
              u = c.generatedColumn;
          a > e || a == e && u >= h || 0 >= d.compareByGeneratedPositionsInflated(k, c) ? this._last = c : this._sorted = !1;
          this._array.push(c);
        };
        c.prototype.toArray = function() {
          this._sorted || (this._array.sort(d.compareByGeneratedPositionsInflated), this._sorted = !0);
          return this._array;
        };
        m.MappingList = c;
      }, {"./util": 17}],
      13: [function(n, v, m) {
        function c(c, d, e) {
          var a = c[d];
          c[d] = c[e];
          c[e] = a;
        }
        function d(k, m, e, a) {
          if (e < a) {
            var h = e - 1;
            c(k, Math.round(e + Math.random() * (a - e)), a);
            for (var u = k[a],
                r = e; r < a; r++)
              0 >= m(k[r], u) && (h += 1, c(k, h, r));
            c(k, h + 1, r);
            h += 1;
            d(k, m, e, h - 1);
            d(k, m, h + 1, a);
          }
        }
        m.quickSort = function(c, m) {
          d(c, m, 0, c.length - 1);
        };
      }, {}],
      14: [function(n, v, m) {
        function c(b) {
          var a = b;
          "string" === typeof b && (a = JSON.parse(b.replace(/^\)\]\}'/, "")));
          return null != a.sections ? new q(a) : new d(a);
        }
        function d(b) {
          var a = b;
          "string" === typeof b && (a = JSON.parse(b.replace(/^\)\]\}'/, "")));
          b = e.getArg(a, "version");
          var c = e.getArg(a, "sources"),
              t = e.getArg(a, "names", []),
              d = e.getArg(a, "sourceRoot", null),
              r = e.getArg(a, "sourcesContent", null),
              k = e.getArg(a, "mappings");
          a = e.getArg(a, "file", null);
          if (b != this._version)
            throw Error("Unsupported version: " + b);
          c = c.map(String).map(e.normalize).map(function(b) {
            return d && e.isAbsolute(d) && e.isAbsolute(b) ? e.relative(d, b) : b;
          });
          this._names = h.fromArray(t.map(String), !0);
          this._sources = h.fromArray(c, !0);
          this.sourceRoot = d;
          this.sourcesContent = r;
          this._mappings = k;
          this.file = a;
        }
        function k() {
          this.generatedColumn = this.generatedLine = 0;
          this.name = this.originalColumn = this.originalLine = this.source = null;
        }
        function q(b) {
          var a = b;
          "string" === typeof b && (a = JSON.parse(b.replace(/^\)\]\}'/, "")));
          b = e.getArg(a, "version");
          a = e.getArg(a, "sections");
          if (b != this._version)
            throw Error("Unsupported version: " + b);
          this._sources = new h;
          this._names = new h;
          var d = {
            line: -1,
            column: 0
          };
          this._sections = a.map(function(b) {
            if (b.url)
              throw Error("Support for url field in sections not implemented.");
            var a = e.getArg(b, "offset"),
                f = e.getArg(a, "line"),
                t = e.getArg(a, "column");
            if (f < d.line || f === d.line && t < d.column)
              throw Error("Section offsets must be ordered and non-overlapping.");
            d = a;
            return {
              generatedOffset: {
                generatedLine: f + 1,
                generatedColumn: t + 1
              },
              consumer: new c(e.getArg(b, "map"))
            };
          });
        }
        var e = n("./util"),
            a = n("./binary-search"),
            h = n("./array-set").ArraySet,
            u = n("./base64-vlq"),
            r = n("./quick-sort").quickSort;
        c.fromSourceMap = function(b) {
          return d.fromSourceMap(b);
        };
        c.prototype._version = 3;
        c.prototype.__generatedMappings = null;
        Object.defineProperty(c.prototype, "_generatedMappings", {get: function() {
            this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot);
            return this.__generatedMappings;
          }});
        c.prototype.__originalMappings = null;
        Object.defineProperty(c.prototype, "_originalMappings", {get: function() {
            this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot);
            return this.__originalMappings;
          }});
        c.prototype._charIsMappingSeparator = function(b, a) {
          var c = b.charAt(a);
          return ";" === c || "," === c;
        };
        c.prototype._parseMappings = function(b, a) {
          throw Error("Subclasses must implement _parseMappings");
        };
        c.GENERATED_ORDER = 1;
        c.ORIGINAL_ORDER = 2;
        c.GREATEST_LOWER_BOUND = 1;
        c.LEAST_UPPER_BOUND = 2;
        c.prototype.eachMapping = function(b, a, d) {
          a = a || null;
          switch (d || c.GENERATED_ORDER) {
            case c.GENERATED_ORDER:
              d = this._generatedMappings;
              break;
            case c.ORIGINAL_ORDER:
              d = this._originalMappings;
              break;
            default:
              throw Error("Unknown order of iteration.");
          }
          var f = this.sourceRoot;
          d.map(function(b) {
            var a = null === b.source ? null : this._sources.at(b.source);
            null != a && null != f && (a = e.join(f, a));
            return {
              source: a,
              generatedLine: b.generatedLine,
              generatedColumn: b.generatedColumn,
              originalLine: b.originalLine,
              originalColumn: b.originalColumn,
              name: null === b.name ? null : this._names.at(b.name)
            };
          }, this).forEach(b, a);
        };
        c.prototype.allGeneratedPositionsFor = function(b) {
          var c = e.getArg(b, "line"),
              d = {
                source: e.getArg(b, "source"),
                originalLine: c,
                originalColumn: e.getArg(b, "column", 0)
              };
          null != this.sourceRoot && (d.source = e.relative(this.sourceRoot, d.source));
          if (!this._sources.has(d.source))
            return [];
          d.source = this._sources.indexOf(d.source);
          var t = [];
          d = this._findMapping(d, this._originalMappings, "originalLine", "originalColumn", e.compareByOriginalPositions, a.LEAST_UPPER_BOUND);
          if (0 <= d) {
            var h = this._originalMappings[d];
            if (void 0 === b.column)
              for (c = h.originalLine; h && h.originalLine === c; )
                t.push({
                  line: e.getArg(h, "generatedLine", null),
                  column: e.getArg(h, "generatedColumn", null),
                  lastColumn: e.getArg(h, "lastGeneratedColumn", null)
                }), h = this._originalMappings[++d];
            else
              for (b = h.originalColumn; h && h.originalLine === c && h.originalColumn == b; )
                t.push({
                  line: e.getArg(h, "generatedLine", null),
                  column: e.getArg(h, "generatedColumn", null),
                  lastColumn: e.getArg(h, "lastGeneratedColumn", null)
                }), h = this._originalMappings[++d];
          }
          return t;
        };
        m.SourceMapConsumer = c;
        d.prototype = Object.create(c.prototype);
        d.prototype.consumer = c;
        d.fromSourceMap = function(b) {
          var a = Object.create(d.prototype),
              c = a._names = h.fromArray(b._names.toArray(), !0),
              t = a._sources = h.fromArray(b._sources.toArray(), !0);
          a.sourceRoot = b._sourceRoot;
          a.sourcesContent = b._generateSourcesContent(a._sources.toArray(), a.sourceRoot);
          a.file = b._file;
          b = b._mappings.toArray().slice();
          for (var u = a.__generatedMappings = [],
              m = a.__originalMappings = [],
              q = 0,
              n = b.length; q < n; q++) {
            var C = b[q],
                y = new k;
            y.generatedLine = C.generatedLine;
            y.generatedColumn = C.generatedColumn;
            C.source && (y.source = t.indexOf(C.source), y.originalLine = C.originalLine, y.originalColumn = C.originalColumn, C.name && (y.name = c.indexOf(C.name)), m.push(y));
            u.push(y);
          }
          r(a.__originalMappings, e.compareByOriginalPositions);
          return a;
        };
        d.prototype._version = 3;
        Object.defineProperty(d.prototype, "sources", {get: function() {
            return this._sources.toArray().map(function(b) {
              return null != this.sourceRoot ? e.join(this.sourceRoot, b) : b;
            }, this);
          }});
        d.prototype._parseMappings = function(b, a) {
          for (var c = 1,
              f = 0,
              d = 0,
              h = 0,
              m = 0,
              q = 0,
              n = b.length,
              y = 0,
              v = {},
              A = {},
              F = [],
              H = [],
              z,
              E,
              p,
              D,
              J; y < n; )
            if (";" === b.charAt(y))
              c++, y++, f = 0;
            else if ("," === b.charAt(y))
              y++;
            else {
              z = new k;
              z.generatedLine = c;
              for (D = y; D < n && !this._charIsMappingSeparator(b, D); D++)
                ;
              E = b.slice(y, D);
              if (p = v[E])
                y += E.length;
              else {
                for (p = []; y < D; )
                  u.decode(b, y, A), J = A.value, y = A.rest, p.push(J);
                if (2 === p.length)
                  throw Error("Found a source, but no line and column");
                if (3 === p.length)
                  throw Error("Found a source and line, but no column");
                v[E] = p;
              }
              z.generatedColumn = f + p[0];
              f = z.generatedColumn;
              1 < p.length && (z.source = m + p[1], m += p[1], z.originalLine = d + p[2], d = z.originalLine, z.originalLine += 1, z.originalColumn = h + p[3], h = z.originalColumn, 4 < p.length && (z.name = q + p[4], q += p[4]));
              H.push(z);
              "number" === typeof z.originalLine && F.push(z);
            }
          r(H, e.compareByGeneratedPositionsDeflated);
          this.__generatedMappings = H;
          r(F, e.compareByOriginalPositions);
          this.__originalMappings = F;
        };
        d.prototype._findMapping = function(b, c, e, d, h, r) {
          if (0 >= b[e])
            throw new TypeError("Line must be greater than or equal to 1, got " + b[e]);
          if (0 > b[d])
            throw new TypeError("Column must be greater than or equal to 0, got " + b[d]);
          return a.search(b, c, h, r);
        };
        d.prototype.computeColumnSpans = function() {
          for (var b = 0; b < this._generatedMappings.length; ++b) {
            var a = this._generatedMappings[b];
            if (b + 1 < this._generatedMappings.length) {
              var c = this._generatedMappings[b + 1];
              if (a.generatedLine === c.generatedLine) {
                a.lastGeneratedColumn = c.generatedColumn - 1;
                continue;
              }
            }
            a.lastGeneratedColumn = Infinity;
          }
        };
        d.prototype.originalPositionFor = function(b) {
          var a = {
            generatedLine: e.getArg(b, "line"),
            generatedColumn: e.getArg(b, "column")
          };
          b = this._findMapping(a, this._generatedMappings, "generatedLine", "generatedColumn", e.compareByGeneratedPositionsDeflated, e.getArg(b, "bias", c.GREATEST_LOWER_BOUND));
          if (0 <= b && (b = this._generatedMappings[b], b.generatedLine === a.generatedLine)) {
            a = e.getArg(b, "source", null);
            null !== a && (a = this._sources.at(a), null != this.sourceRoot && (a = e.join(this.sourceRoot, a)));
            var d = e.getArg(b, "name", null);
            null !== d && (d = this._names.at(d));
            return {
              source: a,
              line: e.getArg(b, "originalLine", null),
              column: e.getArg(b, "originalColumn", null),
              name: d
            };
          }
          return {
            source: null,
            line: null,
            column: null,
            name: null
          };
        };
        d.prototype.hasContentsOfAllSources = function() {
          return this.sourcesContent ? this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(b) {
            return null == b;
          }) : !1;
        };
        d.prototype.sourceContentFor = function(b, a) {
          if (!this.sourcesContent)
            return null;
          null != this.sourceRoot && (b = e.relative(this.sourceRoot, b));
          if (this._sources.has(b))
            return this.sourcesContent[this._sources.indexOf(b)];
          var c;
          if (null != this.sourceRoot && (c = e.urlParse(this.sourceRoot))) {
            var f = b.replace(/^file:\/\//, "");
            if ("file" == c.scheme && this._sources.has(f))
              return this.sourcesContent[this._sources.indexOf(f)];
            if ((!c.path || "/" == c.path) && this._sources.has("/" + b))
              return this.sourcesContent[this._sources.indexOf("/" + b)];
          }
          if (a)
            return null;
          throw Error('"' + b + '" is not in the SourceMap.');
        };
        d.prototype.generatedPositionFor = function(b) {
          var a = e.getArg(b, "source");
          null != this.sourceRoot && (a = e.relative(this.sourceRoot, a));
          if (!this._sources.has(a))
            return {
              line: null,
              column: null,
              lastColumn: null
            };
          a = this._sources.indexOf(a);
          a = {
            source: a,
            originalLine: e.getArg(b, "line"),
            originalColumn: e.getArg(b, "column")
          };
          b = this._findMapping(a, this._originalMappings, "originalLine", "originalColumn", e.compareByOriginalPositions, e.getArg(b, "bias", c.GREATEST_LOWER_BOUND));
          return 0 <= b && (b = this._originalMappings[b], b.source === a.source) ? {
            line: e.getArg(b, "generatedLine", null),
            column: e.getArg(b, "generatedColumn", null),
            lastColumn: e.getArg(b, "lastGeneratedColumn", null)
          } : {
            line: null,
            column: null,
            lastColumn: null
          };
        };
        m.BasicSourceMapConsumer = d;
        q.prototype = Object.create(c.prototype);
        q.prototype.constructor = c;
        q.prototype._version = 3;
        Object.defineProperty(q.prototype, "sources", {get: function() {
            for (var a = [],
                c = 0; c < this._sections.length; c++)
              for (var e = 0; e < this._sections[c].consumer.sources.length; e++)
                a.push(this._sections[c].consumer.sources[e]);
            return a;
          }});
        q.prototype.originalPositionFor = function(b) {
          var c = {
            generatedLine: e.getArg(b, "line"),
            generatedColumn: e.getArg(b, "column")
          },
              d = a.search(c, this._sections, function(a, b) {
                var c = a.generatedLine - b.generatedOffset.generatedLine;
                return c ? c : a.generatedColumn - b.generatedOffset.generatedColumn;
              });
          return (d = this._sections[d]) ? d.consumer.originalPositionFor({
            line: c.generatedLine - (d.generatedOffset.generatedLine - 1),
            column: c.generatedColumn - (d.generatedOffset.generatedLine === c.generatedLine ? d.generatedOffset.generatedColumn - 1 : 0),
            bias: b.bias
          }) : {
            source: null,
            line: null,
            column: null,
            name: null
          };
        };
        q.prototype.hasContentsOfAllSources = function() {
          return this._sections.every(function(a) {
            return a.consumer.hasContentsOfAllSources();
          });
        };
        q.prototype.sourceContentFor = function(a, c) {
          for (var b = 0; b < this._sections.length; b++) {
            var f = this._sections[b].consumer.sourceContentFor(a, !0);
            if (f)
              return f;
          }
          if (c)
            return null;
          throw Error('"' + a + '" is not in the SourceMap.');
        };
        q.prototype.generatedPositionFor = function(a) {
          for (var b = 0; b < this._sections.length; b++) {
            var c = this._sections[b];
            if (-1 !== c.consumer.sources.indexOf(e.getArg(a, "source"))) {
              var d = c.consumer.generatedPositionFor(a);
              if (d)
                return {
                  line: d.line + (c.generatedOffset.generatedLine - 1),
                  column: d.column + (c.generatedOffset.generatedLine === d.line ? c.generatedOffset.generatedColumn - 1 : 0)
                };
            }
          }
          return {
            line: null,
            column: null
          };
        };
        q.prototype._parseMappings = function(a, c) {
          this.__generatedMappings = [];
          this.__originalMappings = [];
          for (var b = 0; b < this._sections.length; b++)
            for (var f = this._sections[b],
                d = f.consumer._generatedMappings,
                h = 0; h < d.length; h++) {
              var k = d[h],
                  u = f.consumer._sources.at(k.source);
              null !== f.consumer.sourceRoot && (u = e.join(f.consumer.sourceRoot, u));
              this._sources.add(u);
              u = this._sources.indexOf(u);
              var m = f.consumer._names.at(k.name);
              this._names.add(m);
              m = this._names.indexOf(m);
              k = {
                source: u,
                generatedLine: k.generatedLine + (f.generatedOffset.generatedLine - 1),
                generatedColumn: k.generatedColumn + (f.generatedOffset.generatedLine === k.generatedLine ? f.generatedOffset.generatedColumn - 1 : 0),
                originalLine: k.originalLine,
                originalColumn: k.originalColumn,
                name: m
              };
              this.__generatedMappings.push(k);
              "number" === typeof k.originalLine && this.__originalMappings.push(k);
            }
          r(this.__generatedMappings, e.compareByGeneratedPositionsDeflated);
          r(this.__originalMappings, e.compareByOriginalPositions);
        };
        m.IndexedSourceMapConsumer = q;
      }, {
        "./array-set": 8,
        "./base64-vlq": 9,
        "./binary-search": 11,
        "./quick-sort": 13,
        "./util": 17
      }],
      15: [function(n, v, m) {
        function c(a) {
          a || (a = {});
          this._file = k.getArg(a, "file", null);
          this._sourceRoot = k.getArg(a, "sourceRoot", null);
          this._skipValidation = k.getArg(a, "skipValidation", !1);
          this._sources = new q;
          this._names = new q;
          this._mappings = new e;
          this._sourcesContents = null;
        }
        var d = n("./base64-vlq"),
            k = n("./util"),
            q = n("./array-set").ArraySet,
            e = n("./mapping-list").MappingList;
        c.prototype._version = 3;
        c.fromSourceMap = function(a) {
          var e = a.sourceRoot,
              d = new c({
                file: a.file,
                sourceRoot: e
              });
          a.eachMapping(function(a) {
            var b = {generated: {
                line: a.generatedLine,
                column: a.generatedColumn
              }};
            null != a.source && (b.source = a.source, null != e && (b.source = k.relative(e, b.source)), b.original = {
              line: a.originalLine,
              column: a.originalColumn
            }, null != a.name && (b.name = a.name));
            d.addMapping(b);
          });
          a.sources.forEach(function(c) {
            var b = a.sourceContentFor(c);
            null != b && d.setSourceContent(c, b);
          });
          return d;
        };
        c.prototype.addMapping = function(a) {
          var c = k.getArg(a, "generated"),
              e = k.getArg(a, "original", null),
              d = k.getArg(a, "source", null);
          a = k.getArg(a, "name", null);
          this._skipValidation || this._validateMapping(c, e, d, a);
          null != d && (d = String(d), this._sources.has(d) || this._sources.add(d));
          null != a && (a = String(a), this._names.has(a) || this._names.add(a));
          this._mappings.add({
            generatedLine: c.line,
            generatedColumn: c.column,
            originalLine: null != e && e.line,
            originalColumn: null != e && e.column,
            source: d,
            name: a
          });
        };
        c.prototype.setSourceContent = function(a, c) {
          var e = a;
          null != this._sourceRoot && (e = k.relative(this._sourceRoot, e));
          null != c ? (this._sourcesContents || (this._sourcesContents = Object.create(null)), this._sourcesContents[k.toSetString(e)] = c) : this._sourcesContents && (delete this._sourcesContents[k.toSetString(e)], 0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null));
        };
        c.prototype.applySourceMap = function(a, c, e) {
          var d = c;
          if (null == c) {
            if (null == a.file)
              throw Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');
            d = a.file;
          }
          var b = this._sourceRoot;
          null != b && (d = k.relative(b, d));
          var f = new q,
              h = new q;
          this._mappings.unsortedForEach(function(c) {
            if (c.source === d && null != c.originalLine) {
              var t = a.originalPositionFor({
                line: c.originalLine,
                column: c.originalColumn
              });
              null != t.source && (c.source = t.source, null != e && (c.source = k.join(e, c.source)), null != b && (c.source = k.relative(b, c.source)), c.originalLine = t.line, c.originalColumn = t.column, null != t.name && (c.name = t.name));
            }
            t = c.source;
            null == t || f.has(t) || f.add(t);
            c = c.name;
            null == c || h.has(c) || h.add(c);
          }, this);
          this._sources = f;
          this._names = h;
          a.sources.forEach(function(c) {
            var f = a.sourceContentFor(c);
            null != f && (null != e && (c = k.join(e, c)), null != b && (c = k.relative(b, c)), this.setSourceContent(c, f));
          }, this);
        };
        c.prototype._validateMapping = function(a, c, e, d) {
          if (!(a && "line" in a && "column" in a && 0 < a.line && 0 <= a.column && !c && !e && !d || a && "line" in a && "column" in a && c && "line" in c && "column" in c && 0 < a.line && 0 <= a.column && 0 < c.line && 0 <= c.column && e))
            throw Error("Invalid mapping: " + JSON.stringify({
              generated: a,
              source: e,
              original: c,
              name: d
            }));
        };
        c.prototype._serializeMappings = function() {
          for (var a = 0,
              c = 1,
              e = 0,
              m = 0,
              b = 0,
              f = 0,
              q = "",
              t,
              n,
              I,
              B = this._mappings.toArray(),
              v = 0,
              C = B.length; v < C; v++) {
            n = B[v];
            t = "";
            if (n.generatedLine !== c)
              for (a = 0; n.generatedLine !== c; )
                t += ";", c++;
            else if (0 < v) {
              if (!k.compareByGeneratedPositionsInflated(n, B[v - 1]))
                continue;
              t += ",";
            }
            t += d.encode(n.generatedColumn - a);
            a = n.generatedColumn;
            null != n.source && (I = this._sources.indexOf(n.source), t += d.encode(I - f), f = I, t += d.encode(n.originalLine - 1 - m), m = n.originalLine - 1, t += d.encode(n.originalColumn - e), e = n.originalColumn, null != n.name && (n = this._names.indexOf(n.name), t += d.encode(n - b), b = n));
            q += t;
          }
          return q;
        };
        c.prototype._generateSourcesContent = function(a, c) {
          return a.map(function(a) {
            if (!this._sourcesContents)
              return null;
            null != c && (a = k.relative(c, a));
            a = k.toSetString(a);
            return Object.prototype.hasOwnProperty.call(this._sourcesContents, a) ? this._sourcesContents[a] : null;
          }, this);
        };
        c.prototype.toJSON = function() {
          var a = {
            version: this._version,
            sources: this._sources.toArray(),
            names: this._names.toArray(),
            mappings: this._serializeMappings()
          };
          null != this._file && (a.file = this._file);
          null != this._sourceRoot && (a.sourceRoot = this._sourceRoot);
          this._sourcesContents && (a.sourcesContent = this._generateSourcesContent(a.sources, a.sourceRoot));
          return a;
        };
        c.prototype.toString = function() {
          return JSON.stringify(this.toJSON());
        };
        m.SourceMapGenerator = c;
      }, {
        "./array-set": 8,
        "./base64-vlq": 9,
        "./mapping-list": 12,
        "./util": 17
      }],
      16: [function(n, v, m) {
        function c(c, a, d, k, m) {
          this.children = [];
          this.sourceContents = {};
          this.line = null == c ? null : c;
          this.column = null == a ? null : a;
          this.source = null == d ? null : d;
          this.name = null == m ? null : m;
          this.$$$isSourceNode$$$ = !0;
          null != k && this.add(k);
        }
        var d = n("./source-map-generator").SourceMapGenerator,
            k = n("./util"),
            q = /(\r?\n)/;
        c.fromStringWithSourceMap = function(e, a, d) {
          function h(a, b) {
            if (null === a || void 0 === a.source)
              m.add(b);
            else {
              var f = d ? k.join(d, a.source) : a.source;
              m.add(new c(a.originalLine, a.originalColumn, f, b, a.name));
            }
          }
          var m = new c,
              b = e.split(q),
              f = function() {
                var a = b.shift(),
                    c = b.shift() || "";
                return a + c;
              },
              n = 1,
              t = 0,
              v = null;
          a.eachMapping(function(a) {
            if (null !== v)
              if (n < a.generatedLine)
                h(v, f()), n++, t = 0;
              else {
                var c = b[0];
                var e = c.substr(0, a.generatedColumn - t);
                b[0] = c.substr(a.generatedColumn - t);
                t = a.generatedColumn;
                h(v, e);
                v = a;
                return;
              }
            for (; n < a.generatedLine; )
              m.add(f()), n++;
            t < a.generatedColumn && (c = b[0], m.add(c.substr(0, a.generatedColumn)), b[0] = c.substr(a.generatedColumn), t = a.generatedColumn);
            v = a;
          }, this);
          0 < b.length && (v && h(v, f()), m.add(b.join("")));
          a.sources.forEach(function(b) {
            var c = a.sourceContentFor(b);
            null != c && (null != d && (b = k.join(d, b)), m.setSourceContent(b, c));
          });
          return m;
        };
        c.prototype.add = function(c) {
          if (Array.isArray(c))
            c.forEach(function(a) {
              this.add(a);
            }, this);
          else if (c.$$$isSourceNode$$$ || "string" === typeof c)
            c && this.children.push(c);
          else
            throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + c);
          return this;
        };
        c.prototype.prepend = function(c) {
          if (Array.isArray(c))
            for (var a = c.length - 1; 0 <= a; a--)
              this.prepend(c[a]);
          else if (c.$$$isSourceNode$$$ || "string" === typeof c)
            this.children.unshift(c);
          else
            throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + c);
          return this;
        };
        c.prototype.walk = function(c) {
          for (var a,
              e = 0,
              d = this.children.length; e < d; e++)
            a = this.children[e], a.$$$isSourceNode$$$ ? a.walk(c) : "" !== a && c(a, {
              source: this.source,
              line: this.line,
              column: this.column,
              name: this.name
            });
        };
        c.prototype.join = function(c) {
          var a,
              e = this.children.length;
          if (0 < e) {
            var d = [];
            for (a = 0; a < e - 1; a++)
              d.push(this.children[a]), d.push(c);
            d.push(this.children[a]);
            this.children = d;
          }
          return this;
        };
        c.prototype.replaceRight = function(c, a) {
          var e = this.children[this.children.length - 1];
          e.$$$isSourceNode$$$ ? e.replaceRight(c, a) : "string" === typeof e ? this.children[this.children.length - 1] = e.replace(c, a) : this.children.push("".replace(c, a));
          return this;
        };
        c.prototype.setSourceContent = function(c, a) {
          this.sourceContents[k.toSetString(c)] = a;
        };
        c.prototype.walkSourceContents = function(c) {
          for (var a = 0,
              e = this.children.length; a < e; a++)
            this.children[a].$$$isSourceNode$$$ && this.children[a].walkSourceContents(c);
          var d = Object.keys(this.sourceContents);
          a = 0;
          for (e = d.length; a < e; a++)
            c(k.fromSetString(d[a]), this.sourceContents[d[a]]);
        };
        c.prototype.toString = function() {
          var c = "";
          this.walk(function(a) {
            c += a;
          });
          return c;
        };
        c.prototype.toStringWithSourceMap = function(c) {
          var a = "",
              e = 1,
              k = 0,
              m = new d(c),
              b = !1,
              f = null,
              n = null,
              t = null,
              q = null;
          this.walk(function(c, d) {
            a += c;
            null !== d.source && null !== d.line && null !== d.column ? (f === d.source && n === d.line && t === d.column && q === d.name || m.addMapping({
              source: d.source,
              original: {
                line: d.line,
                column: d.column
              },
              generated: {
                line: e,
                column: k
              },
              name: d.name
            }), f = d.source, n = d.line, t = d.column, q = d.name, b = !0) : b && (m.addMapping({generated: {
                line: e,
                column: k
              }}), f = null, b = !1);
            for (var h = 0,
                r = c.length; h < r; h++)
              10 === c.charCodeAt(h) ? (e++, k = 0, h + 1 === r ? (f = null, b = !1) : b && m.addMapping({
                source: d.source,
                original: {
                  line: d.line,
                  column: d.column
                },
                generated: {
                  line: e,
                  column: k
                },
                name: d.name
              })) : k++;
          });
          this.walkSourceContents(function(a, b) {
            m.setSourceContent(a, b);
          });
          return {
            code: a,
            map: m
          };
        };
        m.SourceNode = c;
      }, {
        "./source-map-generator": 15,
        "./util": 17
      }],
      17: [function(n, v, m) {
        function c(a) {
          return (a = a.match(u)) ? {
            scheme: a[1],
            auth: a[2],
            host: a[3],
            port: a[4],
            path: a[5]
          } : null;
        }
        function d(a) {
          var b = "";
          a.scheme && (b += a.scheme + ":");
          b += "//";
          a.auth && (b += a.auth + "@");
          a.host && (b += a.host);
          a.port && (b += ":" + a.port);
          a.path && (b += a.path);
          return b;
        }
        function k(a) {
          var b = a,
              e = c(a);
          if (e) {
            if (!e.path)
              return a;
            b = e.path;
          }
          a = m.isAbsolute(b);
          b = b.split(/\/+/);
          for (var k,
              h = 0,
              n = b.length - 1; 0 <= n; n--)
            k = b[n], "." === k ? b.splice(n, 1) : ".." === k ? h++ : 0 < h && ("" === k ? (b.splice(n + 1, h), h = 0) : (b.splice(n, 2), h--));
          b = b.join("/");
          "" === b && (b = a ? "/" : ".");
          return e ? (e.path = b, d(e)) : b;
        }
        function q(a) {
          return a;
        }
        function e(a) {
          return h(a) ? "$" + a : a;
        }
        function a(a) {
          return h(a) ? a.slice(1) : a;
        }
        function h(a) {
          if (!a)
            return !1;
          var b = a.length;
          if (9 > b || 95 !== a.charCodeAt(b - 1) || 95 !== a.charCodeAt(b - 2) || 111 !== a.charCodeAt(b - 3) || 116 !== a.charCodeAt(b - 4) || 111 !== a.charCodeAt(b - 5) || 114 !== a.charCodeAt(b - 6) || 112 !== a.charCodeAt(b - 7) || 95 !== a.charCodeAt(b - 8) || 95 !== a.charCodeAt(b - 9))
            return !1;
          for (b -= 10; 0 <= b; b--)
            if (36 !== a.charCodeAt(b))
              return !1;
          return !0;
        }
        m.getArg = function(a, c, d) {
          if (c in a)
            return a[c];
          if (3 === arguments.length)
            return d;
          throw Error('"' + c + '" is a required argument.');
        };
        var u = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/,
            r = /^data:.+\,.+$/;
        m.urlParse = c;
        m.urlGenerate = d;
        m.normalize = k;
        m.join = function(a, e) {
          "" === a && (a = ".");
          "" === e && (e = ".");
          var b = c(e),
              f = c(a);
          f && (a = f.path || "/");
          if (b && !b.scheme)
            return f && (b.scheme = f.scheme), d(b);
          if (b || e.match(r))
            return e;
          if (f && !f.host && !f.path)
            return f.host = e, d(f);
          b = "/" === e.charAt(0) ? e : k(a.replace(/\/+$/, "") + "/" + e);
          return f ? (f.path = b, d(f)) : b;
        };
        m.isAbsolute = function(a) {
          return "/" === a.charAt(0) || !!a.match(u);
        };
        m.relative = function(a, c) {
          "" === a && (a = ".");
          a = a.replace(/\/$/, "");
          for (var b = 0; 0 !== c.indexOf(a + "/"); ) {
            var d = a.lastIndexOf("/");
            if (0 > d)
              return c;
            a = a.slice(0, d);
            if (a.match(/^([^\/]+:\/)?\/*$/))
              return c;
            ++b;
          }
          return Array(b + 1).join("../") + c.substr(a.length + 1);
        };
        n = !("__proto__" in Object.create(null));
        m.toSetString = n ? q : e;
        m.fromSetString = n ? q : a;
        m.compareByOriginalPositions = function(a, c, d) {
          var b = a.source - c.source;
          if (0 !== b)
            return b;
          b = a.originalLine - c.originalLine;
          if (0 !== b)
            return b;
          b = a.originalColumn - c.originalColumn;
          if (0 !== b || d)
            return b;
          b = a.generatedColumn - c.generatedColumn;
          if (0 !== b)
            return b;
          b = a.generatedLine - c.generatedLine;
          return 0 !== b ? b : a.name - c.name;
        };
        m.compareByGeneratedPositionsDeflated = function(a, c, d) {
          var b = a.generatedLine - c.generatedLine;
          if (0 !== b)
            return b;
          b = a.generatedColumn - c.generatedColumn;
          if (0 !== b || d)
            return b;
          b = a.source - c.source;
          if (0 !== b)
            return b;
          b = a.originalLine - c.originalLine;
          if (0 !== b)
            return b;
          b = a.originalColumn - c.originalColumn;
          return 0 !== b ? b : a.name - c.name;
        };
        m.compareByGeneratedPositionsInflated = function(a, c) {
          var b = a.generatedLine - c.generatedLine;
          if (0 !== b)
            return b;
          b = a.generatedColumn - c.generatedColumn;
          if (0 !== b)
            return b;
          b = a.source;
          var d = c.source;
          b = b === d ? 0 : b > d ? 1 : -1;
          if (0 !== b)
            return b;
          b = a.originalLine - c.originalLine;
          if (0 !== b)
            return b;
          b = a.originalColumn - c.originalColumn;
          0 === b && (b = a.name, d = c.name, b = b === d ? 0 : b > d ? 1 : -1);
          return b;
        };
      }, {}],
      18: [function(n, v, m) {
        m.SourceMapGenerator = n("./lib/source-map-generator").SourceMapGenerator;
        m.SourceMapConsumer = n("./lib/source-map-consumer").SourceMapConsumer;
        m.SourceNode = n("./lib/source-node").SourceNode;
      }, {
        "./lib/source-map-consumer": 14,
        "./lib/source-map-generator": 15,
        "./lib/source-node": 16
      }],
      19: [function(n, v, m) {
        (function(c, d) {
          function k() {
            return "browser" === K ? !0 : "node" === K ? !1 : "undefined" !== typeof window && "function" === typeof XMLHttpRequest && !(window.require && window.module && window.process && "renderer" === window.process.type);
          }
          function q(a) {
            return function(b) {
              for (var c = 0; c < a.length; c++) {
                var d = a[c](b);
                if (d)
                  return d;
              }
              return null;
            };
          }
          function e(a, b) {
            if (!a)
              return b;
            var c = I.dirname(a),
                d = /^\w+:\/\/[^\/]*/.exec(c);
            d = d ? d[0] : "";
            return d + I.resolve(c.slice(d.length), b);
          }
          function a(a) {
            var b = F[a.source];
            if (!b) {
              var c = D(a.source);
              c ? (b = F[a.source] = {
                url: c.url,
                map: new M(c.map)
              }, b.map.sourcesContent && b.map.sources.forEach(function(a, c) {
                var d = b.map.sourcesContent[c];
                if (d) {
                  var g = e(b.url, a);
                  A[g] = d;
                }
              })) : b = F[a.source] = {
                url: null,
                map: null
              };
            }
            return b && b.map && (c = b.map.originalPositionFor(a), null !== c.source) ? (c.source = e(b.url, c.source), c) : a;
          }
          function h(b) {
            var c = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(b);
            return c ? (b = a({
              source: c[2],
              line: +c[3],
              column: c[4] - 1
            }), "eval at " + c[1] + " (" + b.source + ":" + b.line + ":" + (b.column + 1) + ")") : (c = /^eval at ([^(]+) \((.+)\)$/.exec(b)) ? "eval at " + c[1] + " (" + h(c[2]) + ")" : b;
          }
          function u() {
            var a = "";
            if (this.isNative())
              a = "native";
            else {
              var b = this.getScriptNameOrSourceURL();
              !b && this.isEval() && (a = this.getEvalOrigin(), a += ", ");
              a = b ? a + b : a + "<anonymous>";
              b = this.getLineNumber();
              null != b && (a += ":" + b, (b = this.getColumnNumber()) && (a += ":" + b));
            }
            b = "";
            var c = this.getFunctionName(),
                d = !0,
                e = this.isConstructor();
            if (this.isToplevel() || e)
              e ? b += "new " + (c || "<anonymous>") : c ? b += c : (b += a, d = !1);
            else {
              e = this.getTypeName();
              "[object Object]" === e && (e = "null");
              var f = this.getMethodName();
              c ? (e && 0 != c.indexOf(e) && (b += e + "."), b += c, f && c.indexOf("." + f) != c.length - f.length - 1 && (b += " [as " + f + "]")) : b += e + "." + (f || "<anonymous>");
            }
            d && (b += " (" + a + ")");
            return b;
          }
          function r(a) {
            var b = {};
            Object.getOwnPropertyNames(Object.getPrototypeOf(a)).forEach(function(c) {
              b[c] = /^(?:is|get)/.test(c) ? function() {
                return a[c].call(a);
              } : a[c];
            });
            b.toString = u;
            return b;
          }
          function b(b) {
            if (b.isNative())
              return b;
            var c = b.getFileName() || b.getScriptNameOrSourceURL();
            if (c) {
              var d = b.getLineNumber(),
                  e = b.getColumnNumber() - 1;
              1 === d && 62 < e && !k() && !b.isEval() && (e -= 62);
              var f = a({
                source: c,
                line: d,
                column: e
              });
              b = r(b);
              b.getFileName = function() {
                return f.source;
              };
              b.getLineNumber = function() {
                return f.line;
              };
              b.getColumnNumber = function() {
                return f.column + 1;
              };
              b.getScriptNameOrSourceURL = function() {
                return f.source;
              };
              return b;
            }
            var m = b.isEval() && b.getEvalOrigin();
            m && (m = h(m), b = r(b), b.getEvalOrigin = function() {
              return m;
            });
            return b;
          }
          function f(a, c) {
            y && (A = {}, F = {});
            return a + c.map(function(a) {
              return "\n    at " + b(a);
            }).join("");
          }
          function v(a) {
            var b = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(a.stack);
            if (b) {
              a = b[1];
              var c = +b[2];
              b = +b[3];
              var d = A[a];
              if (!d && B && B.existsSync(a))
                try {
                  d = B.readFileSync(a, "utf8");
                } catch (x) {
                  d = "";
                }
              if (d && (d = d.split(/(?:\r\n|\r|\n)/)[c - 1]))
                return a + ":" + c + "\n" + d + "\n" + Array(b).join(" ") + "^";
            }
            return null;
          }
          function t() {
            var a = c.emit;
            c.emit = function(b) {
              if ("uncaughtException" === b) {
                var d = arguments[1] && arguments[1].stack,
                    e = 0 < this.listeners(b).length;
                if (d && !e) {
                  d = arguments[1];
                  if (e = v(d))
                    console.error(), console.error(e);
                  console.error(d.stack);
                  c.exit(1);
                  return;
                }
              }
              return a.apply(this, arguments);
            };
          }
          var M = n("source-map").SourceMapConsumer,
              I = n("path");
          try {
            var B = n("fs");
            B.existsSync && B.readFileSync || (B = null);
          } catch (J) {}
          var L = !1,
              C = !1,
              y = !1,
              K = "auto",
              A = {},
              F = {},
              H = /^data:application\/json[^,]+base64,/,
              z = [],
              E = [],
              p = q(z);
          z.push(function(a) {
            a = a.trim();
            if (a in A)
              return A[a];
            var b = null;
            if (!B) {
              var c = new XMLHttpRequest;
              c.open("GET", a, !1);
              c.send(null);
              b = null;
              4 === c.readyState && 200 === c.status && (b = c.responseText);
            } else if (B.existsSync(a))
              try {
                b = B.readFileSync(a, "utf8");
              } catch (l) {
                b = "";
              }
            return A[a] = b;
          });
          var D = q(E);
          E.push(function(a) {
            a: {
              if (k())
                try {
                  var b = new XMLHttpRequest;
                  b.open("GET", a, !1);
                  b.send(null);
                  var c = b.getResponseHeader("SourceMap") || b.getResponseHeader("X-SourceMap");
                  if (c) {
                    var f = c;
                    break a;
                  }
                } catch (P) {}
              f = p(a);
              b = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
              for (var h; c = b.exec(f); )
                h = c;
              f = h ? h[1] : null;
            }
            if (!f)
              return null;
            H.test(f) ? (h = f.slice(f.indexOf(",") + 1), h = (new d(h, "base64")).toString(), f = a) : (f = e(a, f), h = p(f));
            return h ? {
              url: f,
              map: h
            } : null;
          });
          m.wrapCallSite = b;
          m.getErrorSource = v;
          m.mapSourcePosition = a;
          m.retrieveSourceMap = D;
          m.install = function(a) {
            a = a || {};
            if (a.environment && (K = a.environment, -1 === ["node", "browser", "auto"].indexOf(K)))
              throw Error("environment " + K + " was unknown. Available options are {auto, browser, node}");
            a.retrieveFile && (a.overrideRetrieveFile && (z.length = 0), z.unshift(a.retrieveFile));
            a.retrieveSourceMap && (a.overrideRetrieveSourceMap && (E.length = 0), E.unshift(a.retrieveSourceMap));
            if (a.hookRequire && !k()) {
              try {
                var b = n("module");
              } catch (l) {}
              var d = b.prototype._compile;
              d.__sourceMapSupport || (b.prototype._compile = function(a, b) {
                A[b] = a;
                F[b] = void 0;
                return d.call(this, a, b);
              }, b.prototype._compile.__sourceMapSupport = !0);
            }
            y || (y = "emptyCacheBetweenOperations" in a ? a.emptyCacheBetweenOperations : !1);
            L || (L = !0, Error.prepareStackTrace = f);
            !C && ("handleUncaughtExceptions" in a ? a.handleUncaughtExceptions : 1) && "object" === typeof c && null !== c && "function" === typeof c.on && (C = !0, t());
          };
        }).call(this, n("node_modules/process/browser.js"), n("buffer").Buffer);
      }, {
        "node_modules/process/browser.js": 7,
        buffer: 4,
        fs: 3,
        module: 3,
        path: 6,
        "source-map": 18
      }]
    }, {}, [1]);
    return N;
  });
})(require('buffer').Buffer, require('process'));
