import { getFuncNameAsClass, parse } from './uneet-utils.js'
import { __isDOMElement, __isEdge, __isIE11 } from './web-utils.js'
import cookie from 'js-cookie'
import { ATTR_PREFIXES } from '../../js/uneet-constants'

const uneetsDefaultDebugLevel = 2
const uneetsDebugLevelCookieName = 'UneetsDebug'

const noop = () => {}

class Uneet {
  /**
   * Creates the Uneet, creates the DOM element reference, establishes debug messages, parses the attributes
   * @param  {Element} e -Dom Element to attach to the Uneet
   */
  constructor(e) {
    this._e = __isDOMElement(e)
    this.__setDebugLevel(uneetsDefaultDebugLevel)
    this.__parseAttributes()
  }

  /**
   * Creates a Uneet by receiving a class and looking for DOM Element children of the parent Uneet
   * @param  {Class} theClass - The class to create the instance from
   * @param  {Object} opts - Option to pass to the new Uneet
   * @param  {Element} domElement=null - Single DOM element to create from (instead of querying)
   */
  createChildUneet(theClass, opts, domElement = null) {
    const cssClassName = getFuncNameAsClass(theClass.toString())
    domElement = domElement || this._e.querySelector(`.${cssClassName}`) || null
    if (domElement !== null) {
      return new theClass(domElement, opts)
    } else {
      this.__throwUneetError(
        'Error creating child uneet',
        `Uneet markup not found for selector '.${cssClassName}'`
      )
      return undefined
    }
  }

  /**
   * Creates Uneets by receiving a class and looking for DOM Element children of the parent Uneet
   * @param  {Class} theClass - The class to create the instances from
   * @param  {Object} opts - Option to pass to each created Uneet
   * @param  {NodeList} domElements=null - Force elements to use in generation (instead of querying)
   */
  createChildUneets(theClass, opts, domElements = null) {
    const objs = []
    const cssClassName = getFuncNameAsClass(theClass.toString())
    domElements =
      domElements || this._e.querySelectorAll(`.${cssClassName}`) || null
    if (domElements !== null) {
      domElements.forEach(domElement => {
        objs.push(new theClass(domElement, opts))
      })
      return objs
    } else {
      this.__throwUneetError(
        'Error creating child uneet',
        `Uneet markup not found for selector '.${cssClassName}'`
      )
      return undefined
    }
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

  /**
   * Parses the attributes in the DOMElement and adds them as attributes of the Uneet
   * e.g. an attribute of u-name or data-u-name will be created as this.name in the Uneet
   */
  __parseAttributes() {
    const attrs = this._e.attributes
    Array.from(attrs).forEach(attr => {
      ATTR_PREFIXES.forEach((prefix)=>{
        if (attr.name.indexOf(prefix) === 0) {
          const objAttrName = attr.name.replace(prefix, '')
          this[objAttrName] = parse(attr.value)
        }
      })
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

  static getURLParams(pURL) {
    const result = {}
    if (pURL.indexOf('?') >= 0) {
      const query = pURL.split('?')[1]
      query.split('&').forEach(part => {
        const item = part.split('=')
        result[item[0]] = decodeURIComponent(item[1])
      })
    }
    return result
  }

  static setDebugLevel(debugLevel = uneetsDefaultDebugLevel) {
    try {
      cookie.set(uneetsDebugLevelCookieName, { debugLevel })
    } catch (e) {
      return false
    }
    return true
  }

  static getDebugLevel() {
    const obj = cookie.get(uneetsDebugLevelCookieName)
    return obj === undefined ? 0 : obj.debugLevel
  }

  static clearDebugLevel() {
    cookie.set(uneetsDebugLevelCookieName, {
      debugLevel: uneetsDefaultDebugLevel
    })
  }

  static setGlobal(name,value){
    if (!(typeof window.uneetGlobals === 'object' && window.uneetGlobals !== null)) {
      window.uneetGlobals = {}
    }
    window.uneetGlobals[name] = value
  }

  __setDebugLevel(debugLevel = uneetsDefaultDebugLevel) {
    // 0 = no debug
    // 1 = error
    // 2 = warn
    // 3 = info
    // 4 = log (dev)
    this.__debugLevel = Math.max(debugLevel, Uneet.getDebugLevel())
    this.__log = noop
    this.__warn = noop
    this.__error = noop
    if (window.console !== undefined) {
      if (this.__debugLevel >= 4) {
        if (!__isIE11() && !__isEdge()) {
          this.__log = window.console.log
        } else {
          this.__log = (...args) => {
            window.console.log(...args)
          }
        }
      }
      if (this.__debugLevel >= 3) {
        if (!__isIE11() && !__isEdge()) {
          this.__info = window.console.info
        } else {
          this.__info = (...args) => {
            window.console.info(...args)
          }
        }
      }
      if (this.__debugLevel >= 2) {
        if (!__isIE11() && !__isEdge()) {
          this.__warn = window.console.warn
        } else {
          this.__warn = (...args) => {
            window.console.warn(...args)
          }
        }
      }
      if (this.__debugLevel >= 1) {
        if (!__isIE11() && !__isEdge()) {
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

export default Uneet
