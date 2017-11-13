/* eslint no-underscore-dangle: 0 */

const uneetsDefaultDebugLevel = 2
const uneetsDebugLevelCookieName = 'UneetsDebug'

class Uneet {
  constructor(e) {
    this._e = this.__isDOMElement(e)
    this.__setDebugLevel(uneetsDefaultDebugLevel)
    this.__parseAttributes(this._e)
  }

  static __upperCamelize(str) {
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    const myStr = str.replace(/^[_.\- ]+/, '')
      .toLowerCase()
      .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase())
    return myStr.charAt(0).toUpperCase() + myStr.slice(1)
  }

  createSingleChildUneet(className, paramsArray = []) {
    const uneetName = Uneet.__upperCamelize(className)
    const domElem = this._e.querySelector(`.${className}`)
    if (domElem) {
      const newUneet = new window[uneetName](domElem, ...paramsArray)
      return newUneet
    }
    return null
  }

  createChildUneets(className, paramsArray = []) {
    const uneetName = Uneet.__upperCamelize(className)
    const domElems = Array.from(this._e.querySelectorAll(`.${className}`))
    const newUneets = []
    domElems.forEach((de) => {
      const newUneet = new window[uneetName](de, ...paramsArray)
      newUneets.push(newUneet)
    })
    return newUneets
  }

  _toggleState(stateName, force = null) {
    const prevState = this[stateName]
    if (force !== null) {
      this[stateName] = force
    } else {
      this[stateName] = !this[stateName]
    }
    this._e.toggleClass(stateName, this[stateName])
    // returns whether it changed or not
    return prevState !== this[stateName]
  }

  __isDOMElement(domElement) {
    if (domElement) {
      if (domElement.nodeType === 1) {
        return domElement
      }
    }
    const err = 'Invalid DOM Element'
    const errMsg = 'Passed domElement is not a Node of Node.ELEMENT_NODE (1) type.'
    this.__throwUneetError(err, errMsg, domElement)
    return domElement
  }

  __parseAttributes(domElement) {
    function parseToPrimitive(value) {
      // http://stackoverflow.com/questions/17556310/parse-a-string-into-primitive-values-in-javascript
      try {
        return JSON.parse(value)
      } catch (e) {
        return value.toString()
      }
    }

    const attrs = domElement.attributes
    Array.from(attrs).forEach((attr) => {
      if (attr.name.indexOf('u-') > -1) {
        const objAttrName = attr.name.replace('u-', '')
        this[objAttrName] = parseToPrimitive(attr.value)
      }
    })
  }

  __throwUneetError(error, message, obj = this) {
    function UneetException(err, msg, ob) {
      this.message = msg
      this.name = 'UneetException'
      this._error = err
      if (ob !== null) {
        this.obj = ob
      }
    }
    throw new UneetException(error, message, obj)
  }

  static noop() {
  }

  static storeCookie(cname, obj, duration = 100000) {
    // http://clubmate.fi/setting-and-reading-cookies-with-javascript/
    ((name, value, days) => {
      let expires
      if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = `; expires=${date.toGMTString()}`
      } else {
        expires = ''
      }
      document.cookie = `${name}=${value}${expires}; path=/`
    })(cname, window.btoa(JSON.stringify(obj)), duration)
  }

  static retrieveCookie(cname) {
    const cookie = ((name) => {
      const nameEQ = `${name}=`
      const ca = document.cookie.split(';')
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length)
        }
      }
      return null
    })(cname)
    if (cookie) {
      return JSON.parse(window.atob(cookie))
    }
    return null
  }

  // eslint-disable-next-line class-methods-use-this
  static ajax(url, successCb = Uneet.noop, errorCb = Uneet.noop, protocol = 'GET') {
    // <3 http://youmightnotneedjquery.com/
    const request = new XMLHttpRequest()
    request.open(protocol, url, true)
    function onLoad() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        successCb(this)
      } else {
        // We reached our target server, but it returned an error
        errorCb(this)
      }
    }
    request.onload = onLoad
    request.onerror = errorCb
    request.send()
  }

  // Thanks to: https://gist.github.com/beaucharman/1f93fdd7c72860736643d1ab274fee1a
  static debounce(callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => callback.apply(context, callbackArgs)

    function debounced(...rest) {
      callbackArgs = rest
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }

    return debounced
  }

  // Thanks to: https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
  static throttle(callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => {
      callback.apply(context, callbackArgs)
      timeout = null
    }

    function throttled(...rest) {
      if (!timeout) {
        callbackArgs = rest
        timeout = setTimeout(later, wait)
      }
    }

    return throttled
  }

  static getURLParams(pURL) {
    const result = {}
    if (pURL.indexOf('?') >= 0) {
      const query = pURL.split('?')[1]
      query.split('&').forEach((part) => {
        const item = part.split('=')
        result[item[0]] = decodeURIComponent(item[1])
      })
    }
    return result
  }

  static setDebugLevel(debugLevel = uneetsDefaultDebugLevel) {
    try {
      Uneet.storeCookie(uneetsDebugLevelCookieName, { debugLevel })
    } catch (e) {
      return false
    }
    return true
  }

  static getDebugLevel() {
    const obj = Uneet.retrieveCookie(uneetsDebugLevelCookieName)
    return (obj === null) ? 0 : obj.debugLevel
  }

  static clearDebugLevel() {
    Uneet.storeCookie(uneetsDebugLevelCookieName, { debugLevel: uneetsDefaultDebugLevel })
  }

  __setDebugLevel(debugLevel = uneetsDefaultDebugLevel) {
    // 0 = no debug
    // 1 = error
    // 2 = warn
    // 3 = info
    // 4 = log (dev)
    this.__debugLevel = Math.max(debugLevel, Uneet.getDebugLevel())
    this.__log = Uneet.noop
    this.__warn = Uneet.noop
    this.__error = Uneet.noop
    if (window.console !== undefined) {
      if (this.__debugLevel >= 4) {
        if ((!window.__isIE11()) && (!window.__isEdge())) {
          this.__log = window.console.log
        } else {
          this.__log = (...args) => {
            window.console.log(...args)
          }
        }
      }
      if (this.__debugLevel >= 3) {
        if ((!window.__isIE11()) && (!window.__isEdge())) {
          this.__info = window.console.info
        } else {
          this.__info = (...args) => {
            window.console.info(...args)
          }
        }
      }
      if (this.__debugLevel >= 2) {
        if ((!window.__isIE11()) && (!window.__isEdge())) {
          this.__warn = window.console.warn
        } else {
          this.__warn = (...args) => {
            window.console.warn(...args)
          }
        }
      }
      if (this.__debugLevel >= 1) {
        if ((!window.__isIE11()) && (!window.__isEdge())) {
          this.__error = window.console.error
        } else {
          this.__error = (...args) => {
            window.console.error(...args)
          }
        }
      }
    }
  }
}
