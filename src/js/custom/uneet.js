/***************************************
Uneet
Base class for any Uneet.
****************************************/

class Uneet {
  constructor (e) {
    this.__setDebugLevel(0)
    this._e = this.__isDOMElement(e)
    this.__parseAttributes(this._e)
  }

  __isDOMElement (domElement) {
    if (domElement.nodeType === 1) {
      return domElement
    } else {
      this.__throwUneetError('Invalid DOM Element', 'Passed domElement is not a Node of Node.ELEMENT_NODE (1) type.', domElement)
      return domElement
    }
  }

  __parseAttributes (domElement) {
    function parseToPrimitive (value) {
      // http://stackoverflow.com/questions/17556310/parse-a-string-into-primitive-values-in-javascript
      try {
        return JSON.parse(value)
      } catch (e) {
        return value.toString()
      }
    }

    const attrs = domElement.attributes
    attrs.forEach((attr) => {
      if (attr.name.indexOf('u-') > -1) {
        const objAttrName = attr.name.replace('u-', '')
        this[objAttrName] = parseToPrimitive(attr.value)
      }
    })
  }

  __throwUneetError (error, message, obj = null) {
    function UneetException (error, message, obj) {
      this.message = message
      this.name = 'UneetException'
      this._error = error
      if (obj !== null) {
        this.obj = obj
      }
    }
    throw new UneetException(error, message, obj)
  }

  // Thanks to: https://gist.github.com/beaucharman/1f93fdd7c72860736643d1ab274fee1a
  __debounce (callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => callback.apply(context, callbackArgs)

    return function () {
      callbackArgs = arguments
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Thanks to: https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
  __throttle (callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => {
      callback.apply(context, callbackArgs)
      timeout = null
    }

    return function () {
      if (!timeout) {
        callbackArgs = arguments
        timeout = setTimeout(later, wait)
      }
    }
  }

  __noop () {}

  __ajax (url, successCb, errorCb, protocol = 'GET') {
    // <3 http://youmightnotneedjquery.com/
    const request = new XMLHttpRequest()
    request.open(protocol, url, true)
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        successCb(this)
      } else {
        // We reached our target server, but it returned an error
        errorCb(this)
      }
    }
    request.onerror = errorCb
    request.send()
  }

  __setDebugLevel (debugLevel = 0) {
    // 0 = no debug
    // 1 = error
    // 2 = warn
    // 3 = log
    this.__debugLevel = debugLevel
    this.__log = this.__noop
    this.__warn = this.__noop
    this.__error = this.__noop
    if (window.console !== undefined) {
      if (this.__debugLevel >= 3) {
        if ((!window.__isIE11()) && (!window.__isEdge())) {
          this.__log = window.console.log
        } else {
          this.__log = (...args) => {
            window.console.log(...args)
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

/***************************************
Extending DOM Classes
****************************************/
window.__isIE11 = function () {
  return !!window.MSInputMethodContext && !!document.documentMode
}

window.__isEdge = function () {
  return window.navigator.userAgent.indexOf('Edge') > -1
}
window.NodeList.prototype.forEach = Array.prototype.forEach
window.HTMLCollection.prototype.forEach = Array.prototype.forEach
window.NamedNodeMap.prototype.forEach = function (callback) {
  if (this === null) {
    throw new TypeError('Cannot run forEach on undefined')
  }

  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  for (var i = 0; i < this.length; i++) {
    callback(this[i])
  }
}
window.HTMLElement.prototype.hasClass = function (className) {
  return (this.className.indexOf(className) > -1)
}
window.HTMLElement.prototype.addClass = function (className) {
  this.classList.add(className)
}
window.HTMLElement.prototype.removeClass = function (className) {
  this.classList.remove(className)
}
window.HTMLElement.prototype.toggleClass = function (className, force = null) {
  if (force === null) {
    if (this.hasClass(className)) {
      this.removeClass(className)
    } else {
      this.addClass(className)
    }
  } else {
    if (force) {
      this.addClass(className)
    } else {
      this.removeClass(className)
    }
  }
}
window.HTMLElement.prototype.remove = function () {
  this.parentNode.removeChild(this)
}
window.HTMLElement.prototype.onClick = function (callback) {
  this.onclick = callback
}
window.HTMLElement.prototype.onHover = function (callbackIn, callbackOut) {
  this.addEventListener('mouseover', callbackIn)
  this.addEventListener('mouseout', callbackOut)
}
window.setCookie = function (cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
window.getCookie = function (cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
