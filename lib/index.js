import * as utils from './utils.js'

function getDefaults () {
  return {
    debounceInterval: 50
  }
}

class Backend {
  constructor (services, options = {}) {
    this.type = 'backend'
    this.pending = []

    this.init(services, options)
  }

  init (services, options = {}, i18nextOptions) {
    this.services = services
    this.options = utils.defaults(options, this.options || {}, getDefaults())

    this.debouncedLoad = utils.debounce(this.load, this.options.debounceInterval)

    if (this.options.backend) {
      this.backend = this.backend || utils.createClassOnDemand(this.options.backend)
      this.backend.init(services, this.options.backendOption, i18nextOptions)
    }
    if (this.backend && !this.backend.readMulti) throw new Error('The wrapped backend does not support the readMulti function.')
  }

  read (language, namespace, callback) {
    this.pending.push({
      language,
      namespace,
      callback
    })

    this.debouncedLoad()
  }

  load () {
    if (!this.backend || !this.pending.length) return

    // reset pending
    const loading = this.pending
    this.pending = []

    // get all languages and namespaces needed to be loaded
    const toLoad = loading.reduce((mem, item) => {
      if (mem.languages.indexOf(item.language) < 0) mem.languages.push(item.language)
      if (mem.namespaces.indexOf(item.namespace) < 0) mem.namespaces.push(item.namespace)
      return mem
    }, { languages: [], namespaces: [] })

    // load
    const resolver = (err, data) => {
      if (err) return loading.forEach(item => item.callback(err, data))

      loading.forEach(item => {
        const translations = data[item.language] && data[item.language][item.namespace]
        item.callback(null, translations || {}) // if no error and no translations for that lng-ns pair return empty object
      })
    }
    const fc = this.backend.readMulti.bind(this.backend)
    if (fc.length === 2) {
      // no callback
      try {
        const r = fc(toLoad.languages, toLoad.namespaces)
        if (r && typeof r.then === 'function') {
          // promise
          r.then((data) => resolver(null, data)).catch(resolver)
        } else {
          // sync
          resolver(null, r)
        }
      } catch (err) {
        resolver(err)
      }
      return
    }

    // normal with callback
    fc(toLoad.languages, toLoad.namespaces, resolver)
  }

  create (languages, namespace, key, fallbackValue, clb = () => {}, opts = {}) {
    if (!this.backend || !this.backend.create) return

    const fc = this.backend.create.bind(this.backend)
    if (fc.length < 6) {
      // no callback
      try {
        let r
        if (fc.length === 5) { // future callback-less api for i18next-locize-backend
          r = fc(languages, namespace, key, fallbackValue, opts)
        } else {
          r = fc(languages, namespace, key, fallbackValue)
        }
        if (r && typeof r.then === 'function') {
          // promise
          r.then((data) => clb(null, data)).catch(clb)
        } else {
          // sync
          clb(null, r)
        }
      } catch (err) {
        clb(err)
      }
      return
    }

    // normal with callback
    fc(languages, namespace, key, fallbackValue, clb /* unused callback */, opts)
  }
}

Backend.type = 'backend'

export default Backend
