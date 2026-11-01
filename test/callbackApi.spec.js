import expect from 'expect.js'
import Backend from '../lib/index.js'

// i18next >= 26.7: a declared calling convention, also for the wrapped backend
describe('multiload backend adapter with i18next 26.7', () => {
  it('declares the callback form', () => {
    expect(Backend.callbackApi).to.be(true)
  })

  it("follows the wrapped backend's callbackApi instead of its number of parameters", async () => {
    const created = []
    const wrapped = {
      init () {},
      callbackApi: false,
      readMulti: (languages, namespaces, unused) => Promise.resolve({ en: { translation: { from: 'promise' } } }),
      create: (languages, namespace, key, fallbackValue, options) => {
        created.push(options.isUpdate)
        return Promise.resolve()
      }
    }
    const backend = new Backend({}, { backend: wrapped })
    const data = await new Promise((resolve, reject) =>
      backend.read('en', 'translation', (err, d) => (err ? reject(err) : resolve(d))))
    expect(data).to.eql({ from: 'promise' })
    backend.create(['en'], 'translation', 'key', 'value', () => {}, { isUpdate: true })
    expect(created).to.eql([true])
  })
})
