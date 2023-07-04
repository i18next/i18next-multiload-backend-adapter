import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

// serve translations
import express from 'express'
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
import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend'
import MultiLoadBackendAdapter from 'i18next-multiload-backend-adapter'
// const HttpBackend = require('../../cjs')
i18next.use(MultiLoadBackendAdapter).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en', 'de'],
  ns: ['ns1', 'ns2'],
  defaultNS: 'ns1',
  backend: {
    backend: HttpBackend,
    backendOption: {
      loadPath: 'http://localhost:8080/locales?lng={{lng}}&ns={{ns}}'
    }
  }
}, (err, t) => {
  if (err) return console.error(err)
  console.log(t('welcome'))
  console.log(t('welcome', { lng: 'de' }))
  console.log(t('bye', { ns: 'ns2' }))
  console.log(t('bye', { ns: 'ns2', lng: 'de' }))
})
