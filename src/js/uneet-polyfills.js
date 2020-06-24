const uneetPolyfills = () => {
  window.HTMLElement.prototype.hasClass = function(className) {
    return this.classList.contains(className)
  }
  window.HTMLElement.prototype.addClass = function(className) {
    this.classList.add(className)
  }
  window.HTMLElement.prototype.removeClass = function(className) {
    this.classList.remove(className)
  }
  window.HTMLElement.prototype.toggleClass = function(className, force = null) {
    if (force === null) {
      if (this.hasClass(className)) {
        this.removeClass(className)
      } else {
        this.addClass(className)
      }
    } else if (force) {
      this.addClass(className)
    } else {
      this.removeClass(className)
    }
  }
  window.HTMLElement.remove = function() {
    this.parentNode.removeChild(this)
  }
  window.HTMLElement.prototype.onClick = function(callback) {
    this.onclick = callback
  }
  /* eslint-disable */
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this)
      }
    }
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }
  /* eslint-enable */
  window.HTMLElement.prototype.onHover = function(callbackIn, callbackOut) {
    this.addEventListener('mouseover', callbackIn)
    this.addEventListener('mouseout', callbackOut)
  }

  window.isTouch = function() {
    // requires Modernizr
    return document.querySelector('html').hasClass('touchevents')
  }

  window.isForceTouch = function() {
    // requires Modernizr
    return document.querySelector('html').hasClass('forcetouch')
  }
}

export default uneetPolyfills
