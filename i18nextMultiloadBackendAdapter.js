(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.i18nextMultiloadBackendAdapter = factory());
}(this, (function () { 'use strict';

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



function createClassOnDemand(ClassOrObject) {
  if (!ClassOrObject) return null;
  if (typeof ClassOrObject === 'function') return new ClassOrObject();
  return ClassOrObject;
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    key: 'init',
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var i18nextOptions = arguments[2];

      this.services = services;
      this.options = defaults(options, this.options || {}, getDefaults());

      this.debouncedLoad = debounce(this.load, this.options.debounceInterval);

      if (this.options.backend) {
        this.backend = this.backend || createClassOnDemand(this.options.backend);
        this.backend.init(services, this.options.backendOption, i18nextOptions);
      }
      if (this.backend && !this.backend.readMulti) throw new Error('The wrapped backend does not support the readMulti function.');
    }
  }, {
    key: 'read',
    value: function read(language, namespace, callback) {
      this.pending.push({
        language: language,
        namespace: namespace,
        callback: callback
      });

      this.debouncedLoad();
    }
  }, {
    key: 'load',
    value: function load() {
      if (!this.backend || !this.pending.length) return;

      // reset pending
      var loading = this.pending;
      this.pending = [];

      // get all languages and namespaces needed to be loaded
      var toLoad = loading.reduce(function (mem, item) {
        if (mem.languages.indexOf(item.language) < 0) mem.languages.push(item.language);
        if (mem.namespaces.indexOf(item.namespace) < 0) mem.namespaces.push(item.namespace);
        return mem;
      }, { languages: [], namespaces: [] });

      // load
      this.backend.readMulti(toLoad.languages, toLoad.namespaces, function (err, data) {
        if (err) return loading.forEach(function (item) {
          return item.callback(err, data);
        });

        loading.forEach(function (item) {
          var translations = data[item.language] && data[item.language][item.namespace];
          item.callback(null, translations || {}); // if no error and no translations for that lng-ns pair return empty object
        });
      });
    }
  }, {
    key: 'create',
    value: function create(languages, namespace, key, fallbackValue) {
      if (!this.backend || !this.backend.create) return;
      this.backend.create(languages, namespace, key, fallbackValue);
    }
  }]);

  return Backend;
}();

Backend.type = 'backend';

return Backend;

})));
