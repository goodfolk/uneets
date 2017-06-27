// .u_main-header
class UMainHeader extends Uneet {
  constructor (domElement) {
    super(domElement)
    this.__init()
  }

  __init () {
    // create the main nav
    const mainNavDOMElem = this._e.querySelectorAll('.u_main-nav')[0]
    this.mainNav = new UMainNav(mainNavDOMElem)

    // create the main nav button
    const navBtnDOMElem = this._e.querySelectorAll('.u_mobile-nav-btn')[0]
    this.mobileNavBtn = new UMobileNavBtn(navBtnDOMElem, (ev) => {
      this.mainNav.toggle()
    })
  }

  uncover () {
    this._e.addClass('isUncovered')
    this.mainNav.uncover()
  }

  skipAnimation () {
    this._e.addClass('isAnimationSkipped')
    this._e.addClass('isUncovered')
    this.mainNav.skipAnimation()
  }
}
