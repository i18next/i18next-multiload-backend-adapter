const arr = []
const each = arr.forEach
const slice = arr.slice

export function defaults (obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (const prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop]
      }
    }
  })
  return obj
}

export function extend (obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (const prop in source) {
        obj[prop] = source[prop]
      }
    }
  })
  return obj
}

export function createClassOnDemand (ClassOrObject) {
  if (!ClassOrObject) return null
  if (typeof ClassOrObject === 'function') return new ClassOrObject()
  return ClassOrObject
}

export function debounce (func, wait, immediate) {
  let timeout
  return function () {
    const context = this; const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
};
