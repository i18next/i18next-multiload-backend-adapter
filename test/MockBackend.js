import * as utils from '../lib/utils.js'

class MockBackend {
  // constructor (services, options = {}) { /* irrelevant */ }

  init (services, options = {}, i18nextOptions) {
    this.services = services
    this.options = utils.defaults(options, this.options || {})
    this.added = {}
  }

  readMulti (languages, namespaces, callback) {
    const res = {}
    languages.forEach(l => {
      res[l] = namespaces.reduce((mem, n) => {
        mem[n] = { foo: 'bar' }
        return mem
      }, {})
    })
    setTimeout(() => {
      callback(null, res)
    }, 50)
  }
  // readMulti (languages, namespaces) {
  //   const res = {}
  //   languages.forEach(l => {
  //     res[l] = namespaces.reduce((mem, n) => {
  //       mem[n] = { foo: 'bar' }
  //       return mem
  //     }, {})
  //   })
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(res)
  //     }, 50)
  //   })
  // }

  create (languages, namespace, key, fallbackValue) {
    this.added[`${languages}.${namespace}.${key}`] = fallbackValue
  }
}
MockBackend.type = 'backend'

export default MockBackend
