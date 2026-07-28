import expect from 'expect.js'
import { defaults, extend } from '../lib/utils.js'

describe('utils prototype-key guards', () => {
  afterEach(() => {
    delete Object.prototype.polluted
  })

  it('extend() does not reassign the target prototype via a JSON-parsed __proto__ key', () => {
    const target = {}
    extend(target, JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}'))
    expect(target.ok).to.be(1)
    expect(({}).polluted).to.be(undefined)
    expect(Object.getPrototypeOf(target)).to.be(Object.prototype)
  })

  it('extend() does not copy inherited properties from an already-polluted prototype', () => {
    Object.prototype.polluted = 'yes' // eslint-disable-line no-extend-native
    const target = extend({}, { ok: 1 })
    expect(Object.prototype.hasOwnProperty.call(target, 'polluted')).to.be(false)
  })

  it('defaults() ignores a __proto__ key carried by a JSON-parsed source', () => {
    const target = {}
    defaults(target, JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}'))
    expect(target.ok).to.be(1)
    expect(({}).polluted).to.be(undefined)
    expect(Object.getPrototypeOf(target)).to.be(Object.prototype)
  })

  it('still merges normal options as before', () => {
    expect(defaults({ a: 1 }, { a: 9, b: 2 }, { c: 3 })).to.eql({ a: 1, b: 2, c: 3 })
    expect(extend({ a: 1 }, { a: 9, b: 2 })).to.eql({ a: 9, b: 2 })
  })
})
