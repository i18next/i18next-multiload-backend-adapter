(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.i18nextMultiloadBackendAdapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var utils = _interopRequireWildcard(require("./utils.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function getDefaults() {
  return {
    debounceInterval: 50
  };
}
var Backend = function () {
  function Backend(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Backend);
    this.type = 'backend';
    this.pending = [];
    this.init(services, options);
  }
  return _createClass(Backend, [{
    key: "init",
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var i18nextOptions = arguments.length > 2 ? arguments[2] : undefined;
      this.services = services;
      this.options = utils.defaults(options, this.options || {}, getDefaults());
      this.debouncedLoad = utils.debounce(this.load, this.options.debounceInterval);
      if (this.options.backend) {
        this.backend = this.backend || utils.createClassOnDemand(this.options.backend);
        this.backend.init(services, this.options.backendOption, i18nextOptions);
      }
      if (this.backend && !this.backend.readMulti) throw new Error('The wrapped backend does not support the readMulti function.');
    }
  }, {
    key: "read",
    value: function read(language, namespace, callback) {
      this.pending.push({
        language: language,
        namespace: namespace,
        callback: callback
      });
      this.debouncedLoad();
    }
  }, {
    key: "load",
    value: function load() {
      if (!this.backend || !this.pending.length) return;
      var loading = this.pending;
      this.pending = [];
      var toLoad = loading.reduce(function (mem, item) {
        if (mem.languages.indexOf(item.language) < 0) mem.languages.push(item.language);
        if (mem.namespaces.indexOf(item.namespace) < 0) mem.namespaces.push(item.namespace);
        return mem;
      }, {
        languages: [],
        namespaces: []
      });
      var resolver = function resolver(err, data) {
        if (err) return loading.forEach(function (item) {
          return item.callback(err, data);
        });
        loading.forEach(function (item) {
          var translations = data[item.language] && data[item.language][item.namespace];
          item.callback(null, translations || {});
        });
      };
      var fc = this.backend.readMulti.bind(this.backend);
      if (fc.length === 2) {
        try {
          var r = fc(toLoad.languages, toLoad.namespaces);
          if (r && typeof r.then === 'function') {
            r.then(function (data) {
              return resolver(null, data);
            }).catch(resolver);
          } else {
            resolver(null, r);
          }
        } catch (err) {
          resolver(err);
        }
        return;
      }
      fc(toLoad.languages, toLoad.namespaces, resolver);
    }
  }, {
    key: "create",
    value: function create(languages, namespace, key, fallbackValue) {
      var clb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
      var opts = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      if (!this.backend || !this.backend.create) return;
      var fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          var r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === 'function') {
            r.then(function (data) {
              return clb(null, data);
            }).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
        return;
      }
      fc(languages, namespace, key, fallbackValue, clb, opts);
    }
  }]);
}();
Backend.type = 'backend';
var _default = exports.default = Backend;
module.exports = exports.default;
},{"./utils.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClassOnDemand = createClassOnDemand;
exports.debounce = debounce;
exports.defaults = defaults;
exports.extend = extend;
var arr = [];
var each = arr.forEach;
var slice = arr.slice;
var UNSAFE_KEYS = ['__proto__', 'constructor', 'prototype'];
function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var _i = 0, _Object$keys = Object.keys(source); _i < _Object$keys.length; _i++) {
        var prop = _Object$keys[_i];
        if (UNSAFE_KEYS.indexOf(prop) > -1) continue;
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function extend(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var _i2 = 0, _Object$keys2 = Object.keys(source); _i2 < _Object$keys2.length; _i2++) {
        var prop = _Object$keys2[_i2];
        if (UNSAFE_KEYS.indexOf(prop) > -1) continue;
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function createClassOnDemand(ClassOrObject) {
  if (!ClassOrObject) return null;
  if (typeof ClassOrObject === 'function') return new ClassOrObject();
  return ClassOrObject;
}
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
;
},{}]},{},[1])(1)
});
