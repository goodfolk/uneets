class UBody extends Uneet {
  constructor (domElement) {
    super(domElement)
    this.__childrenUneets = {}
    this.__init()
  }

  __init () {
    this.mainHeader = this.__initUneet('u_main-header', 'UMainHeader', true)
    this.desktopHomeAnimation = this.__initUneet('u_desktop-home-animation', 'UDesktopHomeAnimation', true)
    this.mainFooter = this.__initUneet('u_main-footer', 'UMainFooter', true)
    this.attorneyBios = this.__initUneet('u_attorney-bio', 'UAttorneyBio')
    this.__cookieName = 'skipAnimation'

    window.onload = () => {
      const skipAnimation = window.getCookie(this.__cookieName)
      if (skipAnimation === 'TRUE') {
        this.mainHeader.skipAnimation()
        this.mainFooter.skipAnimation()
        this.desktopHomeAnimation.skipAnimation()
      } else {
        window.setCookie(this.__cookieName, 'TRUE', 7)
        setTimeout(() => {
          this.mainHeader.uncover()
          this.mainFooter.uncover()
          this.desktopHomeAnimation.uncover()
        }, 3000)
      }
    }
  }

  __initUneet (cssClass, jsClass, isOneOnly = false, ...args) {
    // generic, initialization of uneets.
    const theClass = window[jsClass]
    const theElems = this._e.querySelectorAll('.' + cssClass)
    if (theElems.length > 0) {
      if ((!isOneOnly) && (theElems.length > 1)) {
        const objs = []
        theElems.forEach((e) => {
          const theObj = new theClass(e, ...args)
          objs.push(theObj)
        })
        this.__childrenUneets[cssClass] = objs
        return objs
      } else {
        const theObj = new theClass(theElems[0])
        return theObj
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const bodyDE = document.querySelectorAll('body.u_body')[0]
  if (bodyDE !== undefined) {
    const body = new UBody(bodyDE)
    body.__noop()
  }
}, false)
