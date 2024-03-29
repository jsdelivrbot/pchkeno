/* */ 
(function(Buffer, process) {
  (this.define || function(N, O) {
    this.sourceMapSupport = O();
  })("browser-source-map-support", function(N) {
    (function h(u, l, b) {
      function q(g, f) {
        if (!l[g]) {
          if (!u[g]) {
            var n = "function" == typeof require && require;
            if (!f && n)
              return n(g, !0);
            if (w)
              return w(g, !0);
            throw Error("Cannot find module '" + g + "'");
          }
          n = l[g] = {exports: {}};
          u[g][0].call(n.exports, function(f) {
            var c = u[g][1][f];
            return q(c ? c : f);
          }, n, n.exports, h, u, l, b);
        }
        return l[g].exports;
      }
      for (var w = "function" == typeof require && require,
          z = 0; z < b.length; z++)
        q(b[z]);
      return q;
    })({
      1: [function(h, u, l) {
        N = h("./source-map-support");
      }, {"./source-map-support": 18}],
      2: [function(h, u, l) {}, {}],
      3: [function(h, u, l) {
        function b(e, k, t) {
          if (!(this instanceof b))
            return new b(e, k, t);
          var a = typeof e;
          if ("base64" === k && "string" === a)
            for (e = e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, ""); 0 !== e.length % 4; )
              e += "=";
          var c;
          if ("number" === a)
            c = x(e);
          else if ("string" === a)
            c = b.byteLength(e, k);
          else if ("object" === a)
            c = x(e.length);
          else
            throw Error("First argument needs to be a number, array or string.");
          var d;
          b._useTypedArrays ? d = b._augment(new Uint8Array(c)) : (d = this, d.length = c, d._isBuffer = !0);
          if (b._useTypedArrays && "number" === typeof e.byteLength)
            d._set(e);
          else {
            var f = e;
            if (J(f) || b.isBuffer(f) || f && "object" === typeof f && "number" === typeof f.length)
              for (k = 0; k < c; k++)
                b.isBuffer(e) ? d[k] = e.readUInt8(k) : d[k] = e[k];
            else if ("string" === a)
              d.write(e, 0, k);
            else if ("number" === a && !b._useTypedArrays && !t)
              for (k = 0; k < c; k++)
                d[k] = 0;
          }
          return d;
        }
        function q(e, k, t) {
          var a = "";
          for (t = Math.min(e.length, t); k < t; k++)
            a += String.fromCharCode(e[k]);
          return a;
        }
        function w(e, k, t, a) {
          a || (p("boolean" === typeof t, "missing or invalid endian"), p(void 0 !== k && null !== k, "missing offset"), p(k + 1 < e.length, "Trying to read beyond buffer length"));
          a = e.length;
          if (!(k >= a))
            return t ? (t = e[k], k + 1 < a && (t |= e[k + 1] << 8)) : (t = e[k] << 8, k + 1 < a && (t |= e[k + 1])), t;
        }
        function z(e, k, t, a) {
          a || (p("boolean" === typeof t, "missing or invalid endian"), p(void 0 !== k && null !== k, "missing offset"), p(k + 3 < e.length, "Trying to read beyond buffer length"));
          a = e.length;
          if (!(k >= a)) {
            var d;
            t ? (k + 2 < a && (d = e[k + 2] << 16), k + 1 < a && (d |= e[k + 1] << 8), d |= e[k], k + 3 < a && (d += e[k + 3] << 24 >>> 0)) : (k + 1 < a && (d = e[k + 1] << 16), k + 2 < a && (d |= e[k + 2] << 8), k + 3 < a && (d |= e[k + 3]), d += e[k] << 24 >>> 0);
            return d;
          }
        }
        function g(e, k, t, a) {
          a || (p("boolean" === typeof t, "missing or invalid endian"), p(void 0 !== k && null !== k, "missing offset"), p(k + 1 < e.length, "Trying to read beyond buffer length"));
          if (!(k >= e.length))
            return e = w(e, k, t, !0), e & 32768 ? -1 * (65535 - e + 1) : e;
        }
        function f(e, k, t, a) {
          a || (p("boolean" === typeof t, "missing or invalid endian"), p(void 0 !== k && null !== k, "missing offset"), p(k + 3 < e.length, "Trying to read beyond buffer length"));
          if (!(k >= e.length))
            return e = z(e, k, t, !0), e & 2147483648 ? -1 * (4294967295 - e + 1) : e;
        }
        function n(e, k, t, a) {
          a || (p("boolean" === typeof t, "missing or invalid endian"), p(k + 3 < e.length, "Trying to read beyond buffer length"));
          return M.read(e, k, t, 23, 4);
        }
        function m(e, k, t, a) {
          a || (p("boolean" === typeof t, "missing or invalid endian"), p(k + 7 < e.length, "Trying to read beyond buffer length"));
          return M.read(e, k, t, 52, 8);
        }
        function c(e, k, t, a, d) {
          d || (p(void 0 !== k && null !== k, "missing value"), p("boolean" === typeof a, "missing or invalid endian"), p(void 0 !== t && null !== t, "missing offset"), p(t + 1 < e.length, "trying to write beyond buffer length"), K(k, 65535));
          var c = e.length;
          if (!(t >= c))
            for (d = 0, c = Math.min(c - t, 2); d < c; d++)
              e[t + d] = (k & 255 << 8 * (a ? d : 1 - d)) >>> 8 * (a ? d : 1 - d);
        }
        function a(e, k, a, d, c) {
          c || (p(void 0 !== k && null !== k, "missing value"), p("boolean" === typeof d, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 3 < e.length, "trying to write beyond buffer length"), K(k, 4294967295));
          var t = e.length;
          if (!(a >= t))
            for (c = 0, t = Math.min(t - a, 4); c < t; c++)
              e[a + c] = k >>> 8 * (d ? c : 3 - c) & 255;
        }
        function d(e, k, a, d, f) {
          f || (p(void 0 !== k && null !== k, "missing value"), p("boolean" === typeof d, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 1 < e.length, "Trying to write beyond buffer length"), D(k, 32767, -32768));
          a >= e.length || (0 <= k ? c(e, k, a, d, f) : c(e, 65535 + k + 1, a, d, f));
        }
        function A(e, k, t, d, c) {
          c || (p(void 0 !== k && null !== k, "missing value"), p("boolean" === typeof d, "missing or invalid endian"), p(void 0 !== t && null !== t, "missing offset"), p(t + 3 < e.length, "Trying to write beyond buffer length"), D(k, 2147483647, -2147483648));
          t >= e.length || (0 <= k ? a(e, k, t, d, c) : a(e, 4294967295 + k + 1, t, d, c));
        }
        function I(e, k, a, d, c) {
          c || (p(void 0 !== k && null !== k, "missing value"), p("boolean" === typeof d, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 3 < e.length, "Trying to write beyond buffer length"), G(k, 3.4028234663852886E38, -3.4028234663852886E38));
          a >= e.length || M.write(e, k, a, d, 23, 4);
        }
        function B(e, k, a, d, c) {
          c || (p(void 0 !== k && null !== k, "missing value"), p("boolean" === typeof d, "missing or invalid endian"), p(void 0 !== a && null !== a, "missing offset"), p(a + 7 < e.length, "Trying to write beyond buffer length"), G(k, 1.7976931348623157E308, -1.7976931348623157E308));
          a >= e.length || M.write(e, k, a, d, 52, 8);
        }
        function C(e, k, a) {
          if ("number" !== typeof e)
            return a;
          e = ~~e;
          if (e >= k)
            return k;
          if (0 <= e)
            return e;
          e += k;
          return 0 <= e ? e : 0;
        }
        function x(e) {
          e = ~~Math.ceil(+e);
          return 0 > e ? 0 : e;
        }
        function J(e) {
          return (Array.isArray || function(e) {
            return "[object Array]" === Object.prototype.toString.call(e);
          })(e);
        }
        function L(e) {
          return 16 > e ? "0" + e.toString(16) : e.toString(16);
        }
        function r(e) {
          for (var k = [],
              a = 0; a < e.length; a++) {
            var d = e.charCodeAt(a);
            if (127 >= d)
              k.push(e.charCodeAt(a));
            else {
              var c = a;
              55296 <= d && 57343 >= d && a++;
              d = encodeURIComponent(e.slice(c, a + 1)).substr(1).split("%");
              for (c = 0; c < d.length; c++)
                k.push(parseInt(d[c], 16));
            }
          }
          return k;
        }
        function E(e) {
          for (var k = [],
              a = 0; a < e.length; a++)
            k.push(e.charCodeAt(a) & 255);
          return k;
        }
        function y(e, k, a, d) {
          for (var c = 0; c < d && !(c + a >= k.length || c >= e.length); c++)
            k[c + a] = e[c];
          return c;
        }
        function F(e) {
          try {
            return decodeURIComponent(e);
          } catch (k) {
            return String.fromCharCode(65533);
          }
        }
        function K(e, k) {
          p("number" === typeof e, "cannot write a non-number as a number");
          p(0 <= e, "specified a negative value for writing an unsigned value");
          p(e <= k, "value is larger than maximum value for type");
          p(Math.floor(e) === e, "value has a fractional component");
        }
        function D(e, k, a) {
          p("number" === typeof e, "cannot write a non-number as a number");
          p(e <= k, "value larger than maximum allowed value");
          p(e >= a, "value smaller than minimum allowed value");
          p(Math.floor(e) === e, "value has a fractional component");
        }
        function G(e, k, a) {
          p("number" === typeof e, "cannot write a non-number as a number");
          p(e <= k, "value larger than maximum allowed value");
          p(e >= a, "value smaller than minimum allowed value");
        }
        function p(e, k) {
          if (!e)
            throw Error(k || "Failed assertion");
        }
        var H = h("base64-js"),
            M = h("ieee754");
        l.Buffer = b;
        l.SlowBuffer = b;
        l.INSPECT_MAX_BYTES = 50;
        b.poolSize = 8192;
        b._useTypedArrays = function() {
          try {
            var e = new ArrayBuffer(0),
                k = new Uint8Array(e);
            k.foo = function() {
              return 42;
            };
            return 42 === k.foo() && "function" === typeof k.subarray;
          } catch (t) {
            return !1;
          }
        }();
        b.isEncoding = function(e) {
          switch (String(e).toLowerCase()) {
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
        b.isBuffer = function(e) {
          return !(null === e || void 0 === e || !e._isBuffer);
        };
        b.byteLength = function(e, k) {
          var a;
          e += "";
          switch (k || "utf8") {
            case "hex":
              a = e.length / 2;
              break;
            case "utf8":
            case "utf-8":
              a = r(e).length;
              break;
            case "ascii":
            case "binary":
            case "raw":
              a = e.length;
              break;
            case "base64":
              a = H.toByteArray(e).length;
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              a = 2 * e.length;
              break;
            default:
              throw Error("Unknown encoding");
          }
          return a;
        };
        b.concat = function(e, a) {
          p(J(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array.");
          if (0 === e.length)
            return new b(0);
          if (1 === e.length)
            return e[0];
          var k;
          if ("number" !== typeof a)
            for (k = a = 0; k < e.length; k++)
              a += e[k].length;
          var d = new b(a),
              c = 0;
          for (k = 0; k < e.length; k++) {
            var f = e[k];
            f.copy(d, c);
            c += f.length;
          }
          return d;
        };
        b.prototype.write = function(e, a, d, c) {
          if (isFinite(a))
            isFinite(d) || (c = d, d = void 0);
          else {
            var k = c;
            c = a;
            a = d;
            d = k;
          }
          a = Number(a) || 0;
          k = this.length - a;
          d ? (d = Number(d), d > k && (d = k)) : d = k;
          c = String(c || "utf8").toLowerCase();
          switch (c) {
            case "hex":
              a = Number(a) || 0;
              c = this.length - a;
              d ? (d = Number(d), d > c && (d = c)) : d = c;
              c = e.length;
              p(0 === c % 2, "Invalid hex string");
              d > c / 2 && (d = c / 2);
              for (c = 0; c < d; c++)
                k = parseInt(e.substr(2 * c, 2), 16), p(!isNaN(k), "Invalid hex string"), this[a + c] = k;
              b._charsWritten = 2 * c;
              e = c;
              break;
            case "utf8":
            case "utf-8":
              e = b._charsWritten = y(r(e), this, a, d);
              break;
            case "ascii":
              e = b._charsWritten = y(E(e), this, a, d);
              break;
            case "binary":
              e = b._charsWritten = y(E(e), this, a, d);
              break;
            case "base64":
              e = b._charsWritten = y(H.toByteArray(e), this, a, d);
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              for (var f,
                  k = [],
                  t = 0; t < e.length; t++)
                f = e.charCodeAt(t), c = f >> 8, f %= 256, k.push(f), k.push(c);
              e = b._charsWritten = y(k, this, a, d);
              break;
            default:
              throw Error("Unknown encoding");
          }
          return e;
        };
        b.prototype.toString = function(e, a, d) {
          e = String(e || "utf8").toLowerCase();
          a = Number(a) || 0;
          d = void 0 !== d ? Number(d) : d = this.length;
          if (d === a)
            return "";
          switch (e) {
            case "hex":
              e = this.length;
              if (!a || 0 > a)
                a = 0;
              if (!d || 0 > d || d > e)
                d = e;
              for (e = ""; a < d; a++)
                e += L(this[a]);
              d = e;
              break;
            case "utf8":
            case "utf-8":
              var k = e = "";
              for (d = Math.min(this.length, d); a < d; a++)
                127 >= this[a] ? (e += F(k) + String.fromCharCode(this[a]), k = "") : k += "%" + this[a].toString(16);
              d = e + F(k);
              break;
            case "ascii":
              d = q(this, a, d);
              break;
            case "binary":
              d = q(this, a, d);
              break;
            case "base64":
              d = 0 === a && d === this.length ? H.fromByteArray(this) : H.fromByteArray(this.slice(a, d));
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              d = this.slice(a, d);
              a = "";
              for (e = 0; e < d.length; e += 2)
                a += String.fromCharCode(d[e] + 256 * d[e + 1]);
              d = a;
              break;
            default:
              throw Error("Unknown encoding");
          }
          return d;
        };
        b.prototype.toJSON = function() {
          return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0)
          };
        };
        b.prototype.copy = function(e, a, d, c) {
          d || (d = 0);
          c || 0 === c || (c = this.length);
          a || (a = 0);
          if (c !== d && 0 !== e.length && 0 !== this.length)
            if (p(c >= d, "sourceEnd < sourceStart"), p(0 <= a && a < e.length, "targetStart out of bounds"), p(0 <= d && d < this.length, "sourceStart out of bounds"), p(0 <= c && c <= this.length, "sourceEnd out of bounds"), c > this.length && (c = this.length), e.length - a < c - d && (c = e.length - a + d), c -= d, 100 > c || !b._useTypedArrays)
              for (var k = 0; k < c; k++)
                e[k + a] = this[k + d];
            else
              e._set(this.subarray(d, d + c), a);
        };
        b.prototype.slice = function(e, a) {
          var d = this.length;
          e = C(e, d, 0);
          a = C(a, d, d);
          if (b._useTypedArrays)
            return b._augment(this.subarray(e, a));
          for (var d = a - e,
              k = new b(d, void 0, !0),
              c = 0; c < d; c++)
            k[c] = this[c + e];
          return k;
        };
        b.prototype.get = function(e) {
          console.log(".get() is deprecated. Access using array indexes instead.");
          return this.readUInt8(e);
        };
        b.prototype.set = function(e, a) {
          console.log(".set() is deprecated. Access using array indexes instead.");
          return this.writeUInt8(e, a);
        };
        b.prototype.readUInt8 = function(e, a) {
          a || (p(void 0 !== e && null !== e, "missing offset"), p(e < this.length, "Trying to read beyond buffer length"));
          if (!(e >= this.length))
            return this[e];
        };
        b.prototype.readUInt16LE = function(e, a) {
          return w(this, e, !0, a);
        };
        b.prototype.readUInt16BE = function(e, a) {
          return w(this, e, !1, a);
        };
        b.prototype.readUInt32LE = function(e, a) {
          return z(this, e, !0, a);
        };
        b.prototype.readUInt32BE = function(e, a) {
          return z(this, e, !1, a);
        };
        b.prototype.readInt8 = function(e, a) {
          a || (p(void 0 !== e && null !== e, "missing offset"), p(e < this.length, "Trying to read beyond buffer length"));
          if (!(e >= this.length))
            return this[e] & 128 ? -1 * (255 - this[e] + 1) : this[e];
        };
        b.prototype.readInt16LE = function(e, a) {
          return g(this, e, !0, a);
        };
        b.prototype.readInt16BE = function(e, a) {
          return g(this, e, !1, a);
        };
        b.prototype.readInt32LE = function(e, a) {
          return f(this, e, !0, a);
        };
        b.prototype.readInt32BE = function(e, a) {
          return f(this, e, !1, a);
        };
        b.prototype.readFloatLE = function(e, a) {
          return n(this, e, !0, a);
        };
        b.prototype.readFloatBE = function(e, a) {
          return n(this, e, !1, a);
        };
        b.prototype.readDoubleLE = function(e, a) {
          return m(this, e, !0, a);
        };
        b.prototype.readDoubleBE = function(e, a) {
          return m(this, e, !1, a);
        };
        b.prototype.writeUInt8 = function(e, a, d) {
          d || (p(void 0 !== e && null !== e, "missing value"), p(void 0 !== a && null !== a, "missing offset"), p(a < this.length, "trying to write beyond buffer length"), K(e, 255));
          a >= this.length || (this[a] = e);
        };
        b.prototype.writeUInt16LE = function(e, a, d) {
          c(this, e, a, !0, d);
        };
        b.prototype.writeUInt16BE = function(e, a, d) {
          c(this, e, a, !1, d);
        };
        b.prototype.writeUInt32LE = function(e, d, c) {
          a(this, e, d, !0, c);
        };
        b.prototype.writeUInt32BE = function(e, d, c) {
          a(this, e, d, !1, c);
        };
        b.prototype.writeInt8 = function(e, a, d) {
          d || (p(void 0 !== e && null !== e, "missing value"), p(void 0 !== a && null !== a, "missing offset"), p(a < this.length, "Trying to write beyond buffer length"), D(e, 127, -128));
          a >= this.length || (0 <= e ? this.writeUInt8(e, a, d) : this.writeUInt8(255 + e + 1, a, d));
        };
        b.prototype.writeInt16LE = function(e, a, c) {
          d(this, e, a, !0, c);
        };
        b.prototype.writeInt16BE = function(a, c, f) {
          d(this, a, c, !1, f);
        };
        b.prototype.writeInt32LE = function(a, d, c) {
          A(this, a, d, !0, c);
        };
        b.prototype.writeInt32BE = function(a, d, c) {
          A(this, a, d, !1, c);
        };
        b.prototype.writeFloatLE = function(a, d, c) {
          I(this, a, d, !0, c);
        };
        b.prototype.writeFloatBE = function(a, d, c) {
          I(this, a, d, !1, c);
        };
        b.prototype.writeDoubleLE = function(a, d, c) {
          B(this, a, d, !0, c);
        };
        b.prototype.writeDoubleBE = function(a, d, c) {
          B(this, a, d, !1, c);
        };
        b.prototype.fill = function(a, d, c) {
          a || (a = 0);
          d || (d = 0);
          c || (c = this.length);
          "string" === typeof a && (a = a.charCodeAt(0));
          p("number" === typeof a && !isNaN(a), "value is not a number");
          p(c >= d, "end < start");
          if (c !== d && 0 !== this.length)
            for (p(0 <= d && d < this.length, "start out of bounds"), p(0 <= c && c <= this.length, "end out of bounds"); d < c; d++)
              this[d] = a;
        };
        b.prototype.inspect = function() {
          for (var a = [],
              d = this.length,
              c = 0; c < d; c++)
            if (a[c] = L(this[c]), c === l.INSPECT_MAX_BYTES) {
              a[c + 1] = "...";
              break;
            }
          return "<Buffer " + a.join(" ") + ">";
        };
        b.prototype.toArrayBuffer = function() {
          if ("undefined" !== typeof Uint8Array) {
            if (b._useTypedArrays)
              return (new b(this)).buffer;
            for (var a = new Uint8Array(this.length),
                d = 0,
                c = a.length; d < c; d += 1)
              a[d] = this[d];
            return a.buffer;
          }
          throw Error("Buffer.toArrayBuffer not supported in this browser");
        };
        var v = b.prototype;
        b._augment = function(a) {
          a._isBuffer = !0;
          a._get = a.get;
          a._set = a.set;
          a.get = v.get;
          a.set = v.set;
          a.write = v.write;
          a.toString = v.toString;
          a.toLocaleString = v.toString;
          a.toJSON = v.toJSON;
          a.copy = v.copy;
          a.slice = v.slice;
          a.readUInt8 = v.readUInt8;
          a.readUInt16LE = v.readUInt16LE;
          a.readUInt16BE = v.readUInt16BE;
          a.readUInt32LE = v.readUInt32LE;
          a.readUInt32BE = v.readUInt32BE;
          a.readInt8 = v.readInt8;
          a.readInt16LE = v.readInt16LE;
          a.readInt16BE = v.readInt16BE;
          a.readInt32LE = v.readInt32LE;
          a.readInt32BE = v.readInt32BE;
          a.readFloatLE = v.readFloatLE;
          a.readFloatBE = v.readFloatBE;
          a.readDoubleLE = v.readDoubleLE;
          a.readDoubleBE = v.readDoubleBE;
          a.writeUInt8 = v.writeUInt8;
          a.writeUInt16LE = v.writeUInt16LE;
          a.writeUInt16BE = v.writeUInt16BE;
          a.writeUInt32LE = v.writeUInt32LE;
          a.writeUInt32BE = v.writeUInt32BE;
          a.writeInt8 = v.writeInt8;
          a.writeInt16LE = v.writeInt16LE;
          a.writeInt16BE = v.writeInt16BE;
          a.writeInt32LE = v.writeInt32LE;
          a.writeInt32BE = v.writeInt32BE;
          a.writeFloatLE = v.writeFloatLE;
          a.writeFloatBE = v.writeFloatBE;
          a.writeDoubleLE = v.writeDoubleLE;
          a.writeDoubleBE = v.writeDoubleBE;
          a.fill = v.fill;
          a.inspect = v.inspect;
          a.toArrayBuffer = v.toArrayBuffer;
          return a;
        };
      }, {
        "base64-js": 4,
        ieee754: 5
      }],
      4: [function(h, u, l) {
        (function(b) {
          function q(b) {
            b = b.charCodeAt(0);
            if (43 === b || 45 === b)
              return 62;
            if (47 === b || 95 === b)
              return 63;
            if (48 > b)
              return -1;
            if (58 > b)
              return b - 48 + 52;
            if (91 > b)
              return b - 65;
            if (123 > b)
              return b - 97 + 26;
          }
          var w = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
          b.toByteArray = function(b) {
            function g(c) {
              a[d++] = c;
            }
            var f,
                n,
                m,
                c,
                a;
            if (0 < b.length % 4)
              throw Error("Invalid string. Length must be a multiple of 4");
            f = b.length;
            c = "=" === b.charAt(f - 2) ? 2 : "=" === b.charAt(f - 1) ? 1 : 0;
            a = new w(3 * b.length / 4 - c);
            n = 0 < c ? b.length - 4 : b.length;
            var d = 0;
            for (f = 0; f < n; f += 4)
              m = q(b.charAt(f)) << 18 | q(b.charAt(f + 1)) << 12 | q(b.charAt(f + 2)) << 6 | q(b.charAt(f + 3)), g((m & 16711680) >> 16), g((m & 65280) >> 8), g(m & 255);
            2 === c ? (m = q(b.charAt(f)) << 2 | q(b.charAt(f + 1)) >> 4, g(m & 255)) : 1 === c && (m = q(b.charAt(f)) << 10 | q(b.charAt(f + 1)) << 4 | q(b.charAt(f + 2)) >> 2, g(m >> 8 & 255), g(m & 255));
            return a;
          };
          b.fromByteArray = function(b) {
            var g,
                f = b.length % 3,
                n = "",
                m,
                c;
            g = 0;
            for (c = b.length - f; g < c; g += 3)
              m = (b[g] << 16) + (b[g + 1] << 8) + b[g + 2], m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >> 18 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >> 12 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >> 6 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m & 63), n += m;
            switch (f) {
              case 1:
                m = b[b.length - 1];
                n += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >> 2);
                n += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m << 4 & 63);
                n += "==";
                break;
              case 2:
                m = (b[b.length - 2] << 8) + b[b.length - 1], n += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >> 10), n += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >> 4 & 63), n += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m << 2 & 63), n += "=";
            }
            return n;
          };
        })("undefined" === typeof l ? this.base64js = {} : l);
      }, {}],
      5: [function(h, u, l) {
        l.read = function(b, q, w, h, g) {
          var f;
          f = 8 * g - h - 1;
          var n = (1 << f) - 1,
              m = n >> 1,
              c = -7;
          g = w ? g - 1 : 0;
          var a = w ? -1 : 1,
              d = b[q + g];
          g += a;
          w = d & (1 << -c) - 1;
          d >>= -c;
          for (c += f; 0 < c; w = 256 * w + b[q + g], g += a, c -= 8)
            ;
          f = w & (1 << -c) - 1;
          w >>= -c;
          for (c += h; 0 < c; f = 256 * f + b[q + g], g += a, c -= 8)
            ;
          if (0 === w)
            w = 1 - m;
          else {
            if (w === n)
              return f ? NaN : Infinity * (d ? -1 : 1);
            f += Math.pow(2, h);
            w -= m;
          }
          return (d ? -1 : 1) * f * Math.pow(2, w - h);
        };
        l.write = function(b, q, w, h, g, f) {
          var n,
              m = 8 * f - g - 1,
              c = (1 << m) - 1,
              a = c >> 1,
              d = 23 === g ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
          f = h ? 0 : f - 1;
          var A = h ? 1 : -1,
              I = 0 > q || 0 === q && 0 > 1 / q ? 1 : 0;
          q = Math.abs(q);
          isNaN(q) || Infinity === q ? (q = isNaN(q) ? 1 : 0, h = c) : (h = Math.floor(Math.log(q) / Math.LN2), 1 > q * (n = Math.pow(2, -h)) && (h--, n *= 2), q = 1 <= h + a ? q + d / n : q + d * Math.pow(2, 1 - a), 2 <= q * n && (h++, n /= 2), h + a >= c ? (q = 0, h = c) : 1 <= h + a ? (q = (q * n - 1) * Math.pow(2, g), h += a) : (q = q * Math.pow(2, a - 1) * Math.pow(2, g), h = 0));
          for (; 8 <= g; b[w + f] = q & 255, f += A, q /= 256, g -= 8)
            ;
          h = h << g | q;
          for (m += g; 0 < m; b[w + f] = h & 255, f += A, h /= 256, m -= 8)
            ;
          b[w + f - A] |= 128 * I;
        };
      }, {}],
      6: [function(h, u, l) {
        function b() {}
        h = u.exports = {};
        h.nextTick = function() {
          if ("undefined" !== typeof window && window.setImmediate)
            return function(b) {
              return window.setImmediate(b);
            };
          if ("undefined" !== typeof window && window.postMessage && window.addEventListener) {
            var b = [];
            window.addEventListener("message", function(h) {
              var q = h.source;
              q !== window && null !== q || "process-tick" !== h.data || (h.stopPropagation(), 0 < b.length && b.shift()());
            }, !0);
            return function(h) {
              b.push(h);
              window.postMessage("process-tick", "*");
            };
          }
          return function(b) {
            setTimeout(b, 0);
          };
        }();
        h.title = "browser";
        h.browser = !0;
        h.env = {};
        h.argv = [];
        h.on = b;
        h.once = b;
        h.off = b;
        h.emit = b;
        h.binding = function(b) {
          throw Error("process.binding is not supported");
        };
        h.cwd = function() {
          return "/";
        };
        h.chdir = function(b) {
          throw Error("process.chdir is not supported");
        };
      }, {}],
      7: [function(h, u, l) {
        (function(b) {
          function h(f, b) {
            for (var n = 0,
                c = f.length - 1; 0 <= c; c--) {
              var a = f[c];
              "." === a ? f.splice(c, 1) : ".." === a ? (f.splice(c, 1), n++) : n && (f.splice(c, 1), n--);
            }
            if (b)
              for (; n--; n)
                f.unshift("..");
            return f;
          }
          function w(f, b) {
            if (f.filter)
              return f.filter(b);
            for (var n = [],
                c = 0; c < f.length; c++)
              b(f[c], c, f) && n.push(f[c]);
            return n;
          }
          var u = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          l.resolve = function() {
            for (var f = "",
                n = !1,
                m = arguments.length - 1; -1 <= m && !n; m--) {
              var c = 0 <= m ? arguments[m] : b.cwd();
              if ("string" !== typeof c)
                throw new TypeError("Arguments to path.resolve must be strings");
              c && (f = c + "/" + f, n = "/" === c.charAt(0));
            }
            f = h(w(f.split("/"), function(a) {
              return !!a;
            }), !n).join("/");
            return (n ? "/" : "") + f || ".";
          };
          l.normalize = function(f) {
            var b = l.isAbsolute(f),
                m = "/" === g(f, -1);
            (f = h(w(f.split("/"), function(c) {
              return !!c;
            }), !b).join("/")) || b || (f = ".");
            f && m && (f += "/");
            return (b ? "/" : "") + f;
          };
          l.isAbsolute = function(f) {
            return "/" === f.charAt(0);
          };
          l.join = function() {
            var f = Array.prototype.slice.call(arguments, 0);
            return l.normalize(w(f, function(f, b) {
              if ("string" !== typeof f)
                throw new TypeError("Arguments to path.join must be strings");
              return f;
            }).join("/"));
          };
          l.relative = function(f, b) {
            function n(a) {
              for (var d = 0; d < a.length && "" === a[d]; d++)
                ;
              for (var c = a.length - 1; 0 <= c && "" === a[c]; c--)
                ;
              return d > c ? [] : a.slice(d, c - d + 1);
            }
            f = l.resolve(f).substr(1);
            b = l.resolve(b).substr(1);
            for (var c = n(f.split("/")),
                a = n(b.split("/")),
                d = Math.min(c.length, a.length),
                g = d,
                h = 0; h < d; h++)
              if (c[h] !== a[h]) {
                g = h;
                break;
              }
            d = [];
            for (h = g; h < c.length; h++)
              d.push("..");
            d = d.concat(a.slice(g));
            return d.join("/");
          };
          l.sep = "/";
          l.delimiter = ":";
          l.dirname = function(f) {
            var b = u.exec(f).slice(1);
            f = b[0];
            b = b[1];
            if (!f && !b)
              return ".";
            b && (b = b.substr(0, b.length - 1));
            return f + b;
          };
          l.basename = function(b, n) {
            var f = u.exec(b).slice(1)[2];
            n && f.substr(-1 * n.length) === n && (f = f.substr(0, f.length - n.length));
            return f;
          };
          l.extname = function(b) {
            return u.exec(b).slice(1)[3];
          };
          var g = "b" === "ab".substr(-1) ? function(b, n, g) {
            return b.substr(n, g);
          } : function(b, g, m) {
            0 > g && (g = b.length + g);
            return b.substr(g, m);
          };
        }).call(this, h("node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"));
      }, {"node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 6}],
      8: [function(h, u, l) {
        l.SourceMapGenerator = h("./source-map/source-map-generator").SourceMapGenerator;
        l.SourceMapConsumer = h("./source-map/source-map-consumer").SourceMapConsumer;
        l.SourceNode = h("./source-map/source-node").SourceNode;
      }, {
        "./source-map/source-map-consumer": 13,
        "./source-map/source-map-generator": 14,
        "./source-map/source-node": 15
      }],
      9: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          function g() {
            this._array = [];
            this._set = {};
          }
          var f = b("./util");
          g.fromArray = function(b, f) {
            for (var c = new g,
                a = 0,
                d = b.length; a < d; a++)
              c.add(b[a], f);
            return c;
          };
          g.prototype.add = function(b, g) {
            var c = this.has(b),
                a = this._array.length;
            c && !g || this._array.push(b);
            c || (this._set[f.toSetString(b)] = a);
          };
          g.prototype.has = function(b) {
            return Object.prototype.hasOwnProperty.call(this._set, f.toSetString(b));
          };
          g.prototype.indexOf = function(b) {
            if (this.has(b))
              return this._set[f.toSetString(b)];
            throw Error('"' + b + '" is not in the set.');
          };
          g.prototype.at = function(b) {
            if (0 <= b && b < this._array.length)
              return this._array[b];
            throw Error("No element indexed by " + b);
          };
          g.prototype.toArray = function() {
            return this._array.slice();
          };
          h.ArraySet = g;
        });
      }, {
        "./util": 16,
        amdefine: 17
      }],
      10: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          var g = b("./base64");
          h.encode = function(b) {
            var f = "",
                m = 0 > b ? (-b << 1) + 1 : (b << 1) + 0;
            do
              b = m & 31, m >>>= 5, 0 < m && (b |= 32), f += g.encode(b);
 while (0 < m);
            return f;
          };
          h.decode = function(b) {
            var f = 0,
                m = b.length,
                c = 0,
                a = 0,
                d,
                h;
            do {
              if (f >= m)
                throw Error("Expected more digits in base 64 VLQ value.");
              h = g.decode(b.charAt(f++));
              d = !!(h & 32);
              h &= 31;
              c += h << a;
              a += 5;
            } while (d);
            m = c >> 1;
            return {
              value: 1 === (c & 1) ? -m : m,
              rest: b.slice(f)
            };
          };
        });
      }, {
        "./base64": 11,
        amdefine: 17
      }],
      11: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          var g = {},
              f = {};
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach(function(b, m) {
            g[b] = m;
            f[m] = b;
          });
          h.encode = function(b) {
            if (b in f)
              return f[b];
            throw new TypeError("Must be between 0 and 63: " + b);
          };
          h.decode = function(b) {
            if (b in g)
              return g[b];
            throw new TypeError("Not a valid base 64 digit: " + b);
          };
        });
      }, {amdefine: 17}],
      12: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          function g(b, h, m, c, a) {
            var d = Math.floor((h - b) / 2) + b,
                f = a(m, c[d], !0);
            return 0 === f ? c[d] : 0 < f ? 1 < h - d ? g(d, h, m, c, a) : c[d] : 1 < d - b ? g(b, d, m, c, a) : 0 > b ? null : c[b];
          }
          h.search = function(b, h, m) {
            return 0 < h.length ? g(-1, h.length, b, h, m) : null;
          };
        });
      }, {amdefine: 17}],
      13: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          function g(a) {
            var d = a;
            "string" === typeof a && (d = JSON.parse(a.replace(/^\)\]\}'/, "")));
            a = f.getArg(d, "version");
            var c = f.getArg(d, "sources"),
                b = f.getArg(d, "names", []),
                g = f.getArg(d, "sourceRoot", null),
                h = f.getArg(d, "sourcesContent", null),
                x = f.getArg(d, "mappings"),
                d = f.getArg(d, "file", null);
            if (a != this._version)
              throw Error("Unsupported version: " + a);
            this._names = m.fromArray(b, !0);
            this._sources = m.fromArray(c, !0);
            this.sourceRoot = g;
            this.sourcesContent = h;
            this._mappings = x;
            this.file = d;
          }
          var f = b("./util"),
              n = b("./binary-search"),
              m = b("./array-set").ArraySet,
              c = b("./base64-vlq");
          g.fromSourceMap = function(a) {
            var d = Object.create(g.prototype);
            d._names = m.fromArray(a._names.toArray(), !0);
            d._sources = m.fromArray(a._sources.toArray(), !0);
            d.sourceRoot = a._sourceRoot;
            d.sourcesContent = a._generateSourcesContent(d._sources.toArray(), d.sourceRoot);
            d.file = a._file;
            d.__generatedMappings = a._mappings.slice().sort(f.compareByGeneratedPositions);
            d.__originalMappings = a._mappings.slice().sort(f.compareByOriginalPositions);
            return d;
          };
          g.prototype._version = 3;
          Object.defineProperty(g.prototype, "sources", {get: function() {
              return this._sources.toArray().map(function(a) {
                return this.sourceRoot ? f.join(this.sourceRoot, a) : a;
              }, this);
            }});
          g.prototype.__generatedMappings = null;
          Object.defineProperty(g.prototype, "_generatedMappings", {get: function() {
              this.__generatedMappings || (this.__generatedMappings = [], this.__originalMappings = [], this._parseMappings(this._mappings, this.sourceRoot));
              return this.__generatedMappings;
            }});
          g.prototype.__originalMappings = null;
          Object.defineProperty(g.prototype, "_originalMappings", {get: function() {
              this.__originalMappings || (this.__generatedMappings = [], this.__originalMappings = [], this._parseMappings(this._mappings, this.sourceRoot));
              return this.__originalMappings;
            }});
          g.prototype._parseMappings = function(a, d) {
            for (var b = 1,
                g = 0,
                h = 0,
                m = 0,
                x = 0,
                n = 0,
                q = /^[,;]/,
                r = a,
                l; 0 < r.length; )
              if (";" === r.charAt(0))
                b++, r = r.slice(1), g = 0;
              else if ("," === r.charAt(0))
                r = r.slice(1);
              else {
                l = {};
                l.generatedLine = b;
                r = c.decode(r);
                l.generatedColumn = g + r.value;
                g = l.generatedColumn;
                r = r.rest;
                if (0 < r.length && !q.test(r.charAt(0))) {
                  r = c.decode(r);
                  l.source = this._sources.at(x + r.value);
                  x += r.value;
                  r = r.rest;
                  if (0 === r.length || q.test(r.charAt(0)))
                    throw Error("Found a source, but no line and column");
                  r = c.decode(r);
                  l.originalLine = h + r.value;
                  h = l.originalLine;
                  l.originalLine += 1;
                  r = r.rest;
                  if (0 === r.length || q.test(r.charAt(0)))
                    throw Error("Found a source and line, but no column");
                  r = c.decode(r);
                  l.originalColumn = m + r.value;
                  m = l.originalColumn;
                  r = r.rest;
                  0 < r.length && !q.test(r.charAt(0)) && (r = c.decode(r), l.name = this._names.at(n + r.value), n += r.value, r = r.rest);
                }
                this.__generatedMappings.push(l);
                "number" === typeof l.originalLine && this.__originalMappings.push(l);
              }
            this.__generatedMappings.sort(f.compareByGeneratedPositions);
            this.__originalMappings.sort(f.compareByOriginalPositions);
          };
          g.prototype._findMapping = function(a, d, c, b, f) {
            if (0 >= a[c])
              throw new TypeError("Line must be greater than or equal to 1, got " + a[c]);
            if (0 > a[b])
              throw new TypeError("Column must be greater than or equal to 0, got " + a[b]);
            return n.search(a, d, f);
          };
          g.prototype.originalPositionFor = function(a) {
            a = {
              generatedLine: f.getArg(a, "line"),
              generatedColumn: f.getArg(a, "column")
            };
            if (a = this._findMapping(a, this._generatedMappings, "generatedLine", "generatedColumn", f.compareByGeneratedPositions)) {
              var d = f.getArg(a, "source", null);
              d && this.sourceRoot && (d = f.join(this.sourceRoot, d));
              return {
                source: d,
                line: f.getArg(a, "originalLine", null),
                column: f.getArg(a, "originalColumn", null),
                name: f.getArg(a, "name", null)
              };
            }
            return {
              source: null,
              line: null,
              column: null,
              name: null
            };
          };
          g.prototype.sourceContentFor = function(a) {
            if (!this.sourcesContent)
              return null;
            this.sourceRoot && (a = f.relative(this.sourceRoot, a));
            if (this._sources.has(a))
              return this.sourcesContent[this._sources.indexOf(a)];
            var d;
            if (this.sourceRoot && (d = f.urlParse(this.sourceRoot))) {
              var c = a.replace(/^file:\/\//, "");
              if ("file" == d.scheme && this._sources.has(c))
                return this.sourcesContent[this._sources.indexOf(c)];
              if ((!d.path || "/" == d.path) && this._sources.has("/" + a))
                return this.sourcesContent[this._sources.indexOf("/" + a)];
            }
            throw Error('"' + a + '" is not in the SourceMap.');
          };
          g.prototype.generatedPositionFor = function(a) {
            a = {
              source: f.getArg(a, "source"),
              originalLine: f.getArg(a, "line"),
              originalColumn: f.getArg(a, "column")
            };
            this.sourceRoot && (a.source = f.relative(this.sourceRoot, a.source));
            return (a = this._findMapping(a, this._originalMappings, "originalLine", "originalColumn", f.compareByOriginalPositions)) ? {
              line: f.getArg(a, "generatedLine", null),
              column: f.getArg(a, "generatedColumn", null)
            } : {
              line: null,
              column: null
            };
          };
          g.GENERATED_ORDER = 1;
          g.ORIGINAL_ORDER = 2;
          g.prototype.eachMapping = function(a, d, c) {
            d = d || null;
            switch (c || g.GENERATED_ORDER) {
              case g.GENERATED_ORDER:
                c = this._generatedMappings;
                break;
              case g.ORIGINAL_ORDER:
                c = this._originalMappings;
                break;
              default:
                throw Error("Unknown order of iteration.");
            }
            var b = this.sourceRoot;
            c.map(function(a) {
              var d = a.source;
              d && b && (d = f.join(b, d));
              return {
                source: d,
                generatedLine: a.generatedLine,
                generatedColumn: a.generatedColumn,
                originalLine: a.originalLine,
                originalColumn: a.originalColumn,
                name: a.name
              };
            }).forEach(a, d);
          };
          h.SourceMapConsumer = g;
        });
      }, {
        "./array-set": 9,
        "./base64-vlq": 10,
        "./binary-search": 12,
        "./util": 16,
        amdefine: 17
      }],
      14: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          function g(c) {
            this._file = n.getArg(c, "file");
            this._sourceRoot = n.getArg(c, "sourceRoot", null);
            this._sources = new m;
            this._names = new m;
            this._mappings = [];
            this._sourcesContents = null;
          }
          var f = b("./base64-vlq"),
              n = b("./util"),
              m = b("./array-set").ArraySet;
          g.prototype._version = 3;
          g.fromSourceMap = function(c) {
            var a = c.sourceRoot,
                d = new g({
                  file: c.file,
                  sourceRoot: a
                });
            c.eachMapping(function(c) {
              var b = {generated: {
                  line: c.generatedLine,
                  column: c.generatedColumn
                }};
              c.source && (b.source = c.source, a && (b.source = n.relative(a, b.source)), b.original = {
                line: c.originalLine,
                column: c.originalColumn
              }, c.name && (b.name = c.name));
              d.addMapping(b);
            });
            c.sources.forEach(function(a) {
              var b = c.sourceContentFor(a);
              b && d.setSourceContent(a, b);
            });
            return d;
          };
          g.prototype.addMapping = function(c) {
            var a = n.getArg(c, "generated"),
                d = n.getArg(c, "original", null),
                b = n.getArg(c, "source", null);
            c = n.getArg(c, "name", null);
            this._validateMapping(a, d, b, c);
            b && !this._sources.has(b) && this._sources.add(b);
            c && !this._names.has(c) && this._names.add(c);
            this._mappings.push({
              generatedLine: a.line,
              generatedColumn: a.column,
              originalLine: null != d && d.line,
              originalColumn: null != d && d.column,
              source: b,
              name: c
            });
          };
          g.prototype.setSourceContent = function(c, a) {
            var d = c;
            this._sourceRoot && (d = n.relative(this._sourceRoot, d));
            null !== a ? (this._sourcesContents || (this._sourcesContents = {}), this._sourcesContents[n.toSetString(d)] = a) : (delete this._sourcesContents[n.toSetString(d)], 0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null));
          };
          g.prototype.applySourceMap = function(c, a) {
            a || (a = c.file);
            var d = this._sourceRoot;
            d && (a = n.relative(d, a));
            var b = new m,
                f = new m;
            this._mappings.forEach(function(g) {
              if (g.source === a && g.originalLine) {
                var h = c.originalPositionFor({
                  line: g.originalLine,
                  column: g.originalColumn
                });
                null !== h.source && (g.source = d ? n.relative(d, h.source) : h.source, g.originalLine = h.line, g.originalColumn = h.column, null !== h.name && null !== g.name && (g.name = h.name));
              }
              (h = g.source) && !b.has(h) && b.add(h);
              (g = g.name) && !f.has(g) && f.add(g);
            }, this);
            this._sources = b;
            this._names = f;
            c.sources.forEach(function(a) {
              var b = c.sourceContentFor(a);
              b && (d && (a = n.relative(d, a)), this.setSourceContent(a, b));
            }, this);
          };
          g.prototype._validateMapping = function(c, a, d, b) {
            if (!(c && "line" in c && "column" in c && 0 < c.line && 0 <= c.column && !a && !d && !b || c && "line" in c && "column" in c && a && "line" in a && "column" in a && 0 < c.line && 0 <= c.column && 0 < a.line && 0 <= a.column && d))
              throw Error("Invalid mapping: " + JSON.stringify({
                generated: c,
                source: d,
                original: a,
                name: b
              }));
          };
          g.prototype._serializeMappings = function() {
            var c = 0,
                a = 1,
                d = 0,
                b = 0,
                g = 0,
                h = 0,
                m = "",
                x;
            this._mappings.sort(n.compareByGeneratedPositions);
            for (var l = 0,
                q = this._mappings.length; l < q; l++) {
              x = this._mappings[l];
              if (x.generatedLine !== a)
                for (c = 0; x.generatedLine !== a; )
                  m += ";", a++;
              else if (0 < l) {
                if (!n.compareByGeneratedPositions(x, this._mappings[l - 1]))
                  continue;
                m += ",";
              }
              m += f.encode(x.generatedColumn - c);
              c = x.generatedColumn;
              x.source && (m += f.encode(this._sources.indexOf(x.source) - h), h = this._sources.indexOf(x.source), m += f.encode(x.originalLine - 1 - b), b = x.originalLine - 1, m += f.encode(x.originalColumn - d), d = x.originalColumn, x.name && (m += f.encode(this._names.indexOf(x.name) - g), g = this._names.indexOf(x.name)));
            }
            return m;
          };
          g.prototype._generateSourcesContent = function(c, a) {
            return c.map(function(d) {
              if (!this._sourcesContents)
                return null;
              a && (d = n.relative(a, d));
              d = n.toSetString(d);
              return Object.prototype.hasOwnProperty.call(this._sourcesContents, d) ? this._sourcesContents[d] : null;
            }, this);
          };
          g.prototype.toJSON = function() {
            var c = {
              version: this._version,
              file: this._file,
              sources: this._sources.toArray(),
              names: this._names.toArray(),
              mappings: this._serializeMappings()
            };
            this._sourceRoot && (c.sourceRoot = this._sourceRoot);
            this._sourcesContents && (c.sourcesContent = this._generateSourcesContent(c.sources, c.sourceRoot));
            return c;
          };
          g.prototype.toString = function() {
            return JSON.stringify(this);
          };
          h.SourceMapGenerator = g;
        });
      }, {
        "./array-set": 9,
        "./base64-vlq": 10,
        "./util": 16,
        amdefine: 17
      }],
      15: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          function g(b, c, a, d, f) {
            this.children = [];
            this.sourceContents = {};
            this.line = void 0 === b ? null : b;
            this.column = void 0 === c ? null : c;
            this.source = void 0 === a ? null : a;
            this.name = void 0 === f ? null : f;
            null != d && this.add(d);
          }
          var f = b("./source-map-generator").SourceMapGenerator,
              n = b("./util");
          g.fromStringWithSourceMap = function(b, c) {
            function a(a, c) {
              null === a || void 0 === a.source ? d.add(c) : d.add(new g(a.originalLine, a.originalColumn, a.source, c, a.name));
            }
            var d = new g,
                f = b.split("\n"),
                h = 1,
                m = 0,
                n = null;
            c.eachMapping(function(c) {
              if (null === n) {
                for (; h < c.generatedLine; )
                  d.add(f.shift() + "\n"), h++;
                if (m < c.generatedColumn) {
                  var b = f[0];
                  d.add(b.substr(0, c.generatedColumn));
                  f[0] = b.substr(c.generatedColumn);
                  m = c.generatedColumn;
                }
              } else {
                if (h < c.generatedLine) {
                  var g = "";
                  do
                    g += f.shift() + "\n", h++, m = 0;
 while (h < c.generatedLine);
                  m < c.generatedColumn && (b = f[0], g += b.substr(0, c.generatedColumn), f[0] = b.substr(c.generatedColumn), m = c.generatedColumn);
                } else
                  b = f[0], g = b.substr(0, c.generatedColumn - m), f[0] = b.substr(c.generatedColumn - m), m = c.generatedColumn;
                a(n, g);
              }
              n = c;
            }, this);
            a(n, f.join("\n"));
            c.sources.forEach(function(a) {
              var b = c.sourceContentFor(a);
              b && d.setSourceContent(a, b);
            });
            return d;
          };
          g.prototype.add = function(b) {
            if (Array.isArray(b))
              b.forEach(function(c) {
                this.add(c);
              }, this);
            else if (b instanceof g || "string" === typeof b)
              b && this.children.push(b);
            else
              throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + b);
            return this;
          };
          g.prototype.prepend = function(b) {
            if (Array.isArray(b))
              for (var c = b.length - 1; 0 <= c; c--)
                this.prepend(b[c]);
            else if (b instanceof g || "string" === typeof b)
              this.children.unshift(b);
            else
              throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + b);
            return this;
          };
          g.prototype.walk = function(b) {
            for (var c,
                a = 0,
                d = this.children.length; a < d; a++)
              c = this.children[a], c instanceof g ? c.walk(b) : "" !== c && b(c, {
                source: this.source,
                line: this.line,
                column: this.column,
                name: this.name
              });
          };
          g.prototype.join = function(b) {
            var c,
                a,
                d = this.children.length;
            if (0 < d) {
              c = [];
              for (a = 0; a < d - 1; a++)
                c.push(this.children[a]), c.push(b);
              c.push(this.children[a]);
              this.children = c;
            }
            return this;
          };
          g.prototype.replaceRight = function(b, c) {
            var a = this.children[this.children.length - 1];
            a instanceof g ? a.replaceRight(b, c) : "string" === typeof a ? this.children[this.children.length - 1] = a.replace(b, c) : this.children.push("".replace(b, c));
            return this;
          };
          g.prototype.setSourceContent = function(b, c) {
            this.sourceContents[n.toSetString(b)] = c;
          };
          g.prototype.walkSourceContents = function(b) {
            for (var c = 0,
                a = this.children.length; c < a; c++)
              this.children[c] instanceof g && this.children[c].walkSourceContents(b);
            for (var d = Object.keys(this.sourceContents),
                c = 0,
                a = d.length; c < a; c++)
              b(n.fromSetString(d[c]), this.sourceContents[d[c]]);
          };
          g.prototype.toString = function() {
            var b = "";
            this.walk(function(c) {
              b += c;
            });
            return b;
          };
          g.prototype.toStringWithSourceMap = function(b) {
            var c = "",
                a = 1,
                d = 0,
                g = new f(b),
                h = !1,
                m = null,
                n = null,
                l = null,
                q = null;
            this.walk(function(b, f) {
              c += b;
              null !== f.source && null !== f.line && null !== f.column ? (m === f.source && n === f.line && l === f.column && q === f.name || g.addMapping({
                source: f.source,
                original: {
                  line: f.line,
                  column: f.column
                },
                generated: {
                  line: a,
                  column: d
                },
                name: f.name
              }), m = f.source, n = f.line, l = f.column, q = f.name, h = !0) : h && (g.addMapping({generated: {
                  line: a,
                  column: d
                }}), m = null, h = !1);
              b.split("").forEach(function(b) {
                "\n" === b ? (a++, d = 0) : d++;
              });
            });
            this.walkSourceContents(function(a, b) {
              g.setSourceContent(a, b);
            });
            return {
              code: c,
              map: g
            };
          };
          h.SourceNode = g;
        });
      }, {
        "./source-map-generator": 14,
        "./util": 16,
        amdefine: 17
      }],
      16: [function(h, u, l) {
        if ("function" !== typeof b)
          var b = h("amdefine")(u, h);
        b(function(b, h, l) {
          function g(a) {
            return (a = a.match(m)) ? {
              scheme: a[1],
              auth: a[3],
              host: a[4],
              port: a[6],
              path: a[7]
            } : null;
          }
          function f(a) {
            var b = a.scheme + "://";
            a.auth && (b += a.auth + "@");
            a.host && (b += a.host);
            a.port && (b += ":" + a.port);
            a.path && (b += a.path);
            return b;
          }
          function n(a, b) {
            var d = a || "",
                c = b || "";
            return (d > c) - (d < c);
          }
          h.getArg = function(a, b, c) {
            if (b in a)
              return a[b];
            if (3 === arguments.length)
              return c;
            throw Error('"' + b + '" is a required argument.');
          };
          var m = /([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/,
              c = /^data:.+\,.+/;
          h.urlParse = g;
          h.urlGenerate = f;
          h.join = function(a, b) {
            var d;
            return b.match(m) || b.match(c) ? b : "/" === b.charAt(0) && (d = g(a)) ? (d.path = b, f(d)) : a.replace(/\/$/, "") + "/" + b;
          };
          h.toSetString = function(a) {
            return "$" + a;
          };
          h.fromSetString = function(a) {
            return a.substr(1);
          };
          h.relative = function(a, b) {
            a = a.replace(/\/$/, "");
            var c = g(a);
            return "/" == b.charAt(0) && c && "/" == c.path ? b.slice(1) : 0 === b.indexOf(a + "/") ? b.substr(a.length + 1) : b;
          };
          h.compareByOriginalPositions = function(a, b, c) {
            var d;
            return (d = n(a.source, b.source)) || (d = a.originalLine - b.originalLine) || (d = a.originalColumn - b.originalColumn) || c || (d = n(a.name, b.name)) ? d : (d = a.generatedLine - b.generatedLine) ? d : a.generatedColumn - b.generatedColumn;
          };
          h.compareByGeneratedPositions = function(a, b, c) {
            var d;
            return (d = a.generatedLine - b.generatedLine) || (d = a.generatedColumn - b.generatedColumn) || c || (d = n(a.source, b.source)) || (d = a.originalLine - b.originalLine) ? d : (d = a.originalColumn - b.originalColumn) ? d : n(a.name, b.name);
          };
        });
      }, {amdefine: 17}],
      17: [function(h, u, l) {
        (function(b, l) {
          u.exports = function(q, u) {
            function g(a, b) {
              var c;
              if (a && "." === a.charAt(0) && b) {
                c = b.split("/");
                c = c.slice(0, c.length - 1);
                var d = c = c.concat(a.split("/")),
                    f,
                    g;
                for (f = 0; d[f]; f += 1)
                  if (g = d[f], "." === g)
                    d.splice(f, 1), --f;
                  else if (".." === g)
                    if (1 !== f || ".." !== d[2] && ".." !== d[0])
                      0 < f && (d.splice(f - 1, 2), f -= 2);
                    else
                      break;
                a = c.join("/");
              }
              return a;
            }
            function f(a) {
              return function(b) {
                return g(b, a);
              };
            }
            function n(a) {
              function b(b) {
                d[a] = b;
              }
              b.fromText = function(a, b) {
                throw Error("amdefine does not implement load.fromText");
              };
              return b;
            }
            function m(a, b, c) {
              var f,
                  g,
                  h;
              if (a)
                g = d[a] = {}, h = {
                  id: a,
                  uri: l,
                  exports: g
                }, f = B(u, g, h, a);
              else {
                if (w)
                  throw Error("amdefine with no module ID cannot be called more than once per file.");
                w = !0;
                g = q.exports;
                h = q;
                f = B(u, g, h, q.id);
              }
              b && (b = b.map(function(a) {
                return f(a);
              }));
              b = "function" === typeof c ? c.apply(h.exports, b) : c;
              void 0 !== b && (h.exports = b, a && (d[a] = h.exports));
            }
            function c(b, c, d) {
              Array.isArray(b) ? (d = c, c = b, b = void 0) : "string" !== typeof b && (d = b, b = c = void 0);
              c && !Array.isArray(c) && (d = c, c = void 0);
              c || (c = ["require", "exports", "module"]);
              b ? a[b] = [b, c, d] : m(b, c, d);
            }
            var a = {},
                d = {},
                w = !1,
                z = h("path"),
                B,
                C;
            B = function(a, c, d, f) {
              function h(g, h) {
                if ("string" === typeof g)
                  return C(a, c, d, g, f);
                g = g.map(function(b) {
                  return C(a, c, d, b, f);
                });
                h && b.nextTick(function() {
                  h.apply(null, g);
                });
              }
              h.toUrl = function(a) {
                return 0 === a.indexOf(".") ? g(a, z.dirname(d.filename)) : a;
              };
              return h;
            };
            u = u || function() {
              return q.require.apply(q, arguments);
            };
            C = function(b, c, h, l, q) {
              var r = l.indexOf("!"),
                  u = l;
              if (-1 === r) {
                l = g(l, q);
                if ("require" === l)
                  return B(b, c, h, q);
                if ("exports" === l)
                  return c;
                if ("module" === l)
                  return h;
                if (d.hasOwnProperty(l))
                  return d[l];
                if (a[l])
                  return m.apply(null, a[l]), d[l];
                if (b)
                  return b(u);
                throw Error("No module with ID: " + l);
              }
              u = l.substring(0, r);
              l = l.substring(r + 1, l.length);
              r = C(b, c, h, u, q);
              l = r.normalize ? r.normalize(l, f(q)) : g(l, q);
              d[l] || r.load(l, B(b, c, h, q), n(l), {});
              return d[l];
            };
            c.require = function(b) {
              if (d[b])
                return d[b];
              if (a[b])
                return m.apply(null, a[b]), d[b];
            };
            c.amd = {};
            return c;
          };
        }).call(this, h("node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), "/node_modules/source-map/node_modules/amdefine/amdefine.js");
      }, {
        "node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 6,
        path: 7
      }],
      18: [function(h, u, l) {
        (function(b, q) {
          function u() {
            return "browser" === E ? !0 : "node" === E ? !1 : "undefined" !== typeof window && "function" === typeof XMLHttpRequest && !(window.require && window.module && window.process && "renderer" === window.process.type);
          }
          function z(a) {
            return function(b) {
              for (var c = 0; c < a.length; c++) {
                var d = a[c](b);
                if (d)
                  return d;
              }
              return null;
            };
          }
          function g(a, b) {
            if (!a)
              return b;
            var c = C.dirname(a),
                d = /^\w+:\/\/[^\/]*/.exec(c),
                d = d ? d[0] : "";
            return d + C.resolve(c.slice(d.length), b);
          }
          function f(a) {
            var b = F[a.source];
            if (!b) {
              var c = H(a.source);
              c ? (b = F[a.source] = {
                url: c.url,
                map: new B(c.map)
              }, b.map.sourcesContent && b.map.sources.forEach(function(a, c) {
                var d = b.map.sourcesContent[c];
                if (d) {
                  var e = g(b.url, a);
                  y[e] = d;
                }
              })) : b = F[a.source] = {
                url: null,
                map: null
              };
            }
            return b && b.map && (c = b.map.originalPositionFor(a), null !== c.source) ? (c.source = g(b.url, c.source), c) : a;
          }
          function n(a) {
            var b = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(a);
            return b ? (a = f({
              source: b[2],
              line: +b[3],
              column: b[4] - 1
            }), "eval at " + b[1] + " (" + a.source + ":" + a.line + ":" + (a.column + 1) + ")") : (b = /^eval at ([^(]+) \((.+)\)$/.exec(a)) ? "eval at " + b[1] + " (" + n(b[2]) + ")" : a;
          }
          function m() {
            var a,
                b = "";
            this.isNative() ? b = "native" : (a = this.getScriptNameOrSourceURL(), !a && this.isEval() && (b = this.getEvalOrigin(), b += ", "), b = a ? b + a : b + "<anonymous>", a = this.getLineNumber(), null != a && (b += ":" + a, (a = this.getColumnNumber()) && (b += ":" + a)));
            a = "";
            var c = this.getFunctionName(),
                d = !0,
                f = this.isConstructor();
            if (this.isToplevel() || f)
              f ? a += "new " + (c || "<anonymous>") : c ? a += c : (a += b, d = !1);
            else {
              f = this.getTypeName();
              "[object Object]" === f && (f = "null");
              var g = this.getMethodName();
              c ? (f && 0 != c.indexOf(f) && (a += f + "."), a += c, g && c.indexOf("." + g) != c.length - g.length - 1 && (a += " [as " + g + "]")) : a += f + "." + (g || "<anonymous>");
            }
            d && (a += " (" + b + ")");
            return a;
          }
          function c(a) {
            var b = {};
            Object.getOwnPropertyNames(Object.getPrototypeOf(a)).forEach(function(c) {
              b[c] = /^(?:is|get)/.test(c) ? function() {
                return a[c].call(a);
              } : a[c];
            });
            b.toString = m;
            return b;
          }
          function a(a) {
            if (a.isNative())
              return a;
            var b = a.getFileName() || a.getScriptNameOrSourceURL();
            if (b) {
              var d = a.getLineNumber(),
                  g = a.getColumnNumber() - 1;
              1 !== d || u() || a.isEval() || (g -= 62);
              var h = f({
                source: b,
                line: d,
                column: g
              });
              a = c(a);
              a.getFileName = function() {
                return h.source;
              };
              a.getLineNumber = function() {
                return h.line;
              };
              a.getColumnNumber = function() {
                return h.column + 1;
              };
              a.getScriptNameOrSourceURL = function() {
                return h.source;
              };
              return a;
            }
            var l = a.isEval() && a.getEvalOrigin();
            l && (l = n(l), a = c(a), a.getEvalOrigin = function() {
              return l;
            });
            return a;
          }
          function d(b, c) {
            r && (y = {}, F = {});
            return b + c.map(function(b) {
              return "\n    at " + a(b);
            }).join("");
          }
          function A(a) {
            var b = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(a.stack);
            if (b) {
              a = b[1];
              var c = +b[2],
                  b = +b[3],
                  d = y[a];
              !d && x.existsSync(a) && (d = x.readFileSync(a, "utf8"));
              if (d && (d = d.split(/(?:\r\n|\r|\n)/)[c - 1]))
                return a + ":" + c + "\n" + d + "\n" + Array(b).join(" ") + "^";
            }
            return null;
          }
          function I() {
            var a = b.emit;
            b.emit = function(c) {
              if ("uncaughtException" === c) {
                var d = arguments[1] && arguments[1].stack,
                    f = 0 < this.listeners(c).length;
                if (d && !f) {
                  d = arguments[1];
                  if (f = A(d))
                    console.error(), console.error(f);
                  console.error(d.stack);
                  b.exit(1);
                  return;
                }
              }
              return a.apply(this, arguments);
            };
          }
          var B = h("source-map").SourceMapConsumer,
              C = h("path"),
              x = h("fs"),
              J = !1,
              L = !1,
              r = !1,
              E = "auto",
              y = {},
              F = {},
              K = /^data:application\/json[^,]+base64,/,
              D = [],
              G = [],
              p = z(D);
          D.push(function(a) {
            a = a.trim();
            if (a in y)
              return y[a];
            try {
              if (u()) {
                var b = new XMLHttpRequest;
                b.open("GET", a, !1);
                b.send(null);
                var c = null;
                4 === b.readyState && 200 === b.status && (c = b.responseText);
              } else
                c = x.readFileSync(a, "utf8");
            } catch (k) {
              c = null;
            }
            return y[a] = c;
          });
          var H = z(G);
          G.push(function(a) {
            var b;
            a: {
              var c;
              if (u() && (c = new XMLHttpRequest, c.open("GET", a, !1), c.send(null), c = c.getResponseHeader("SourceMap") || c.getResponseHeader("X-SourceMap"))) {
                b = c;
                break a;
              }
              c = p(a);
              for (var d = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg,
                  f; f = d.exec(c); )
                b = f;
              b = b ? b[1] : null;
            }
            if (!b)
              return null;
            K.test(b) ? (b = b.slice(b.indexOf(",") + 1), c = (new q(b, "base64")).toString(), b = a) : (b = g(a, b), c = p(b));
            return c ? {
              url: b,
              map: c
            } : null;
          });
          l.wrapCallSite = a;
          l.getErrorSource = A;
          l.mapSourcePosition = f;
          l.retrieveSourceMap = H;
          l.install = function(a) {
            a = a || {};
            if (a.environment && (E = a.environment, -1 === ["node", "browser", "auto"].indexOf(E)))
              throw Error("environment " + E + " was unknown. Available options are {auto, browser, node}");
            a.retrieveFile && (a.overrideRetrieveFile && (D.length = 0), D.unshift(a.retrieveFile));
            a.retrieveSourceMap && (a.overrideRetrieveSourceMap && (G.length = 0), G.unshift(a.retrieveSourceMap));
            if (a.hookRequire && !u()) {
              var c = h("module"),
                  e = c.prototype._compile;
              e.__sourceMapSupport || (c.prototype._compile = function(a, b) {
                y[b] = a;
                F[b] = void 0;
                return e.call(this, a, b);
              }, c.prototype._compile.__sourceMapSupport = !0);
            }
            r || (r = "emptyCacheBetweenOperations" in a ? a.emptyCacheBetweenOperations : !1);
            J || (J = !0, Error.prepareStackTrace = d);
            !L && ("handleUncaughtExceptions" in a ? a.handleUncaughtExceptions : 1) && "object" === typeof b && null !== b && "function" === typeof b.on && (L = !0, I());
          };
        }).call(this, h("node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), h("buffer").Buffer);
      }, {
        "node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 6,
        buffer: 3,
        fs: 2,
        module: 2,
        path: 7,
        "source-map": 8
      }]
    }, {}, [1]);
    return N;
  });
})(require('buffer').Buffer, require('process'));
