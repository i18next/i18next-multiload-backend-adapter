# Introduction

[![Travis](https://img.shields.io/travis/i18next/i18next-multiload-backend-adapter/master.svg?style=flat-square)](https://travis-ci.org/i18next-multiload-backend-adapter)
[![Coveralls](https://img.shields.io/coveralls/i18next/i18next-multiload-backend-adapter/master.svg?style=flat-square)](https://coveralls.io/github/i18next/i18next-multiload-backend-adapter)
[![npm version](https://img.shields.io/npm/v/i18next-multiload-backend-adapter.svg?style=flat-square)](https://www.npmjs.com/package/i18next-multiload-backend-adapter)
[![David](https://img.shields.io/david/i18next/i18next-multiload-backend-adapter.svg?style=flat-square)](https://david-dm.org/i18next/i18next-multiload-backend-adapter)

This is a i18next backend to enable [another backend's](https://www.i18next.com/plugins-and-utils.html#backends) multiload behaviour of loading multiple lng-ns combinations with one request.

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
import XHR from 'i18next-xhr-backend'; // have a own xhr fallback

i18next
  .use(BackendAdapter)
  .init({
    backend: {
      backend: XHR,
      backendOption: {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // xhr load path for my own fallback
      }
    }
  });
```

--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>
