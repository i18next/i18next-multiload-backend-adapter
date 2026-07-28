### 2.3.1

- security: `extend()` iterates own enumerable keys only and skips `__proto__` / `constructor` / `prototype`. It merged with `for...in` and no own-property check, so a source object carrying an own `__proto__` key (as `JSON.parse` produces) reassigned the target's prototype, and an already-polluted `Object.prototype` had its inherited keys copied onto the target. The package itself never calls `extend()`, but it is published as part of `cjs/utils.js` / `esm/utils.js`, so it is kept and fixed rather than removed.
- chore: the same guard on `defaults()`. Its existing `=== undefined` check already blocked the pollution paths, so this is defense in depth and aligns the helper with the equivalents in `i18next-http-backend`, `i18next-fs-backend` and `i18next-http-middleware`.

### 2.3.0

- fix: separate cjs and mjs typings

### 2.2.2

- fix last build

### 2.2.1

- update dev deps

### 2.2.0

- types: export the backend options type

### 2.1.0

- extend to accept also backends with promise / async-await signature

### 2.0.0

- typescript fix for i18next v22

### 1.0.0

- typescript: add initial types

### 0.1.1
- initial version
