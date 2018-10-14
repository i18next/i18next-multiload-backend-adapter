import * as utils from '../src/utils.js';

const translationKeys = { foo: 'bar' };

class MockBackend {
  constructor(services, options = {}) {
    this.calls = [];
    /* irrelevant */
  }

  init(services, options = {}, i18nextOptions) {
    this.services = services;
    this.options = utils.defaults(options, this.options || {});
    this.added = {};
  }

  readMulti(languages, namespaces, callback) {
    this.calls.push({ languages, namespaces });

    const namespacesResult = namespaces.reduce((acc, namespace) => {
      return { ...acc, [namespace]: translationKeys };
    }, {});

    let res = {};
    if (languages.length === 1) {
      res = namespacesResult;
    } else {
      res = languages.reduce((acc, language) => {
        return { ...acc, [language]: namespacesResult };
      }, {});
    }

    callback(null, res);
  }

  create(languages, namespace, key, fallbackValue) {
    this.added[`${languages}.${namespace}.${key}`] = fallbackValue;
  }
}

MockBackend.type = 'backend';

export default MockBackend;
