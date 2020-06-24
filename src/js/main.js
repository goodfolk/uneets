import uneetAutoInit from './uneet-autoInit'
import uneetPolyfills from './uneet-polyfills'
import svg4everybody from './svg4everybody.min.js'
//import Modernizr from 'modernizr'

// Uneets uses this to enable mixins that target browsers specifically, mostly IE9, 10 and 11.
// https://gist.github.com/yoshuawuyts/8320300
const applyUserAgentAttributes = () => {
  var b = document.documentElement
  b.setAttribute('data-useragent', navigator.userAgent)
  b.setAttribute('data-platform', navigator.platform)
  b.className +=
    !!('ontouchstart' in window) || !!('onmsgesturechange' in window)
      ? ' touch'
      : ''
}

applyUserAgentAttributes()

document.addEventListener('DOMContentLoaded', function() {
  svg4everybody()
  uneetPolyfills()
  uneetAutoInit()
})

console.log('caca');