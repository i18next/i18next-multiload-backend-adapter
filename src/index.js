import * as utils from './utils.js';

function getDefaults() {
  return {
    debounceInterval: 50,

    // Default: true; This option allows to fetch namespaces for multiple languages at once or to fetch them per language
    multiLanguage: true
  };
}

class Backend {
  constructor(services, options = {}) {
    this.type = 'backend';
    this.pending = [];

    this.init(services, options);
  }

  init(services, options = {}, i18nextOptions) {
    this.services = services;
    this.options = utils.defaults(options, this.options || {}, getDefaults());

    this.debouncedLoad = utils.debounce(this.load, this.options.debounceInterval);

    if (this.options.backend) {
      this.backend = this.backend || utils.createClassOnDemand(this.options.backend);
      this.backend.init(services, this.options.backendOption, i18nextOptions);
    }
    if (this.backend && !this.backend.readMulti)
      throw new Error('The wrapped backend does not support the readMulti function.');
  }

  read(language, namespace, callback) {
    this.pending.push({
      language,
      namespace,
      callback
    });

    this.debouncedLoad();
  }

  load() {
    if (!this.backend || !this.pending.length) return;

    // Reset pending
    const loading = this.pending; // [{ language, namespace, callback }]
    this.pending = [];

    // Build the lang/namespace/callback object
    // { language: { namespace: callback } }
    const namespacePerLanguage = {};
    loading.forEach(({ language, namespace, callback }) => {
      namespacePerLanguage[language] = namespacePerLanguage[language] || {};
      namespacePerLanguage[language][namespace] =
        namespacePerLanguage[language][namespace] || callback; // Just making sure we do not have duplicates
    });

    let toLoad; // [{ languages, namespaces }]
    // Create only 1 object as we fetch everything at once
    if (this.options.multiLanguage) {
      toLoad = [
        {
          languages: Object.keys(namespacePerLanguage),
          namespaces: Object.keys(namespacePerLanguage).reduce((acc, language) => {
            const namespaces = Object.keys(namespacePerLanguage[language]);

            namespaces.forEach(ns => {
              if (acc.indexOf(ns) === -1) {
                acc.push(ns);
              }
            });

            return acc;
          }, [])
        }
      ];
      // Create 1 object per language as we fetch multiple namespace per language
    } else {
      toLoad = Object.keys(namespacePerLanguage).map(language => {
        return { languages: [language], namespaces: Object.keys(namespacePerLanguage[language]) };
      });
    }

    // load
    toLoad.forEach(({ languages, namespaces }) => {
      this.backend.readMulti(languages, namespaces, (err, data) => {
        languages.forEach(language => {
          namespaces.forEach(namespace => {
            const callback = (namespacePerLanguage[language] || {})[namespace];

            if (!callback) {
              return null;
            }

            if (err) {
              return callback(err, null);
            }

            let translations;
            if (this.options.multiLanguage) {
              translations = (data[language] || {})[namespace] || {};
            } else {
              translations = data[namespace] || {};
            }

            callback(null, translations);
          });
        });
      });
    });
  }

  create(languages, namespace, key, fallbackValue) {
    if (!this.backend || !this.backend.create) return;
    this.backend.create(languages, namespace, key, fallbackValue);
  }
}

Backend.type = 'backend';

export default Backend;
