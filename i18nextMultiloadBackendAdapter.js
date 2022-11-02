(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.i18nextMultiloadBackendAdapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var utils = _interopRequireWildcard(require("./utils.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
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
  _createClass(Backend, [{
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

      this.backend.readMulti(toLoad.languages, toLoad.namespaces, function (err, data) {
        if (err) return loading.forEach(function (item) {
          return item.callback(err, data);
        });
        loading.forEach(function (item) {
          var translations = data[item.language] && data[item.language][item.namespace];
          item.callback(null, translations || {});
        });
      });
    }
  }, {
    key: "create",
    value: function create(languages, namespace, key, fallbackValue) {
      if (!this.backend || !this.backend.create) return;
      this.backend.create(languages, namespace, key, fallbackValue);
    }
  }]);
  return Backend;
}();
Backend.type = 'backend';
var _default = Backend;
exports.default = _default;
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
function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function extend(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
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
