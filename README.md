# Introduction

[![npm version](https://img.shields.io/npm/v/i18next-multiload-backend-adapter.svg?style=flat-square)](https://www.npmjs.com/package/i18next-multiload-backend-adapter)

This is a i18next backend to enable [another backend's](https://www.i18next.com/overview/plugins-and-utils#backends) multiload behaviour of loading multiple lng-ns combinations with one request.

Your backend needs to return this structure:
```js
{
  [lang] : {
    [namespaceA]: {},
    [namespaceB]: {},
    // ...etc
  },
  [lang2] : {
    // ...etc
  }
}
```

[Here](https://github.com/i18next/i18next-multiload-backend-adapter/tree/master/examples) you can find a simplified example.

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/i18next-multiload-backend-adapter) or [downloaded](https://github.com/i18next/i18next-chained-backend/blob/master/i18nextMultiloadBackendAdapter.min.js) from this repo.

```
# npm package
$ npm install i18next-multiload-backend-adapter
```

Wiring up:

```js
import i18next from 'i18next';
import BackendAdapter from 'i18next-multiload-backend-adapter';

i18next
  .use(BackendAdapter)
  .init(i18nextOptions);
```

- As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.
- If you don't use a module loader it will be added to `window.i18nextMultiloadBackendAdapter`

## Backend Options

```js
{
  // array of existing i18next backends from https://www.i18next.com/plugins-and-utils.html#backends
  backend: BackendSupportingMultiload,

  // array of options in order of backends above
  backendOption: { /* options of adapted backend */ },

  // interval to wait for calling readMulti after receiving a read
  debounceInterval: 50
}
```

Options can be passed in:

**preferred** - by setting options.backend in i18next.init:

```js
import i18next from 'i18next';
import BackendAdapter from 'i18next-multiload-backend-adapter';

i18next
  .use(Backend)
  .init({
    backend: options
  });
```

on construction:

```js
  import BackendAdapter from 'i18next-multiload-backend-adapter';
  const Backend = new BackendAdapter(null, options);
```

via calling init:

```js
  import BackendAdapter from 'i18next-multiload-backend-adapter';
  const Backend = new BackendAdapter();
  Backend.init(options);
```

### more complete sample

```js
import i18next from 'i18next';
import BackendAdapter from 'i18next-multiload-backend-adapter';
import Http from 'i18next-http-backend'; // have a own http fallback

i18next
  .use(BackendAdapter)
  .init({
    backend: {
      backend: Http,
      backendOption: {
        loadPath: '/locales?lng={{lng}}&ns={{ns}}' // http load path for my own fallback
      }
    }
  });
```

## TypeScript

To properly type the backend options, you can import the `MultiloadBackendOptions` interface and use it as a generic type parameter to the i18next's `init` method, e.g.:

```ts
import i18n from 'i18next'
import BackendAdapter, { MultiloadBackendOptions } from 'i18next-multiload-backend-adapter'

i18n
  .use(BackendAdapter)
  .init<MultiloadBackendOptions>({
    backend: {
      backend: Http,
      backendOption: {
        loadPath: '/locales?lng={{lng}}&ns={{ns}}' // http load path for my own fallback
      }
    },

    // other i18next options
  })
```

--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>
