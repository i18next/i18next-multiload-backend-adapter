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
    this.backend.readMulti(toLoad.languages, toLoad.namespaces, (err, data) => {
      if (err) return loading.forEach(item => item.callback(err, data))

      loading.forEach(item => {
        const translations = data[item.language] && data[item.language][item.namespace]
        item.callback(null, translations || {}) // if no error and no translations for that lng-ns pair return empty object
      })
    })
  }

  create (languages, namespace, key, fallbackValue) {
    if (!this.backend || !this.backend.create) return
    this.backend.create(languages, namespace, key, fallbackValue)
  }
}

Backend.type = 'backend'

export default Backend
