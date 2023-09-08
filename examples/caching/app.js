import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend'
import MultiLoadBackendAdapter from 'i18next-multiload-backend-adapter'
import ChainedBackend from 'i18next-chained-backend'
import FSBackend from 'i18next-fs-backend'

const __dirname = dirname(fileURLToPath(import.meta.url))

// serve translations
const app = express()
app.get('/locales', async (req, res) => {
  const lngs = req.query.lng.split(' ')
  const nss = req.query.ns.split(' ')
  const ret = {}
  for (const lng of lngs) {
    ret[lng] = ret[lng] || {}
    for (const ns of nss) {
      ret[lng][ns] = JSON.parse((await readFile(join(__dirname, `locales/${lng}/${ns}.json`))).toString())
    }
  }
  res.json(ret)
})
app.listen(8080)

// i18next in action...
// const HttpBackend = require('../../cjs')
i18next.use(ChainedBackend).init({
  // debug: true,
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en', 'de'],
  ns: ['ns1', 'ns2'],
  defaultNS: 'ns1',
  backend: {
    backends: [
      FSBackend,
      MultiLoadBackendAdapter
    ],
    backendOptions: [{
      loadPath: './locales_cache/{{lng}}/{{ns}}.json',
      addPath: './locales_cache/{{lng}}/{{ns}}.json',
      expirationTime: 15 * 1000 // all 15 seconds the cache should be deleted
    }, {
      backend: HttpBackend,
      backendOption: {
        loadPath: 'http://localhost:8080/locales?lng={{lng}}&ns={{ns}}'
      }
    }]
  }
}, (err, t) => {
  if (err) return console.error(err)
  setInterval(() => {
    i18next.reloadResources() // retrigger a new fetch...
    console.log(t('welcome'))
    console.log(t('welcome', { lng: 'de' }))
    console.log(t('bye', { ns: 'ns2' }))
    console.log(t('bye', { ns: 'ns2', lng: 'de' }))
    console.log('.........')
  }, 5000)
})
