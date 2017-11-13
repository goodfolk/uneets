class UBody extends Uneet {
  constructor(de) {
    super(de)
    this.stateEventNames = {
      wineDetailOverlayOpen: 'wineDetailOverlayOpen',
      wineDetailOverlayClose: 'wineDetailOverlayClose',
    }
    this.wineIdParamName = 'wineId'
    this.init()
  }

  init() {
    // general stuff
    this.mainHeader = this.createSingleChildUneet('u_main-header')
    this.mainNav = this.createSingleChildUneet('u_main-nav')

    // overlay
    const loadWineToOverlay = (domElement, wineData) => {
      this.overlay.loadContentToOverlay(domElement)
      const { wineId, wineName } = wineData
      const params = `${this.wineIdParamName}=${wineId}`
      const url = `${location.protocol}//${location.host}${location.pathname}?${params}`
      const title = `${document.title}: ${wineName}`
      this.loadOverlay(Uneet.noop)
      if (!wineData.preventStateChange) {
        this.changePage(title, url, this.stateEventNames.wineDetailOverlayOpen)
      }
    }

    const closeWineOverlay = () => {
      this.unloadOverlay(() => {
        this.__log('Overlay closed!')
        this.overlay.removeContentFromOverlay()
      }, this.stateEventNames.wineDetailOverlayClose)
      const title = `${document.title.split(':')[0]}`
      const url = `${location.protocol}//${location.host}${location.pathname}`
      this.changePage(title, url, this.stateEventNames.wineDetailOverlayClose)
    }

    this.overlay = this.createSingleChildUneet('u_overlay', [closeWineOverlay])

    // pages
    this.homepage = this.createSingleChildUneet('u_page-home')
    this.producerListing = this.createSingleChildUneet('u_page-producer-listing')
    this.producerDetail = this.createSingleChildUneet('u_page-producer-detail', [loadWineToOverlay])

    this.__initStateHandlers()
  }

  __initStateHandlers() {
    // when a state is popped
    window.onpopstate = (ev) => {
      this.__log('State popped!', ev.state)
      if ((ev.state === null) || (ev.state.type === this.stateEventNames.wineDetailOverlayClose)) {
        this.unloadOverlay(() => {
          this.__log('Overlay closed!')
          this.overlay.removeContentFromOverlay()
        }, this.stateEventNames.wineDetailOverlayClose)
      } else if (ev.state.type === this.stateEventNames.wineDetailOverlayOpen) {
        const wineId = Uneet.getURLParams(ev.state.url)[this.wineIdParamName]
        this.producerDetail.loadWine(wineId, true)
      }
    }
    // when a URL is loaded with a wine parameter
    const params = Uneet.getURLParams(window.location.href)
    if (Object.keys(params).length > 0) {
      if (params.wineId !== undefined) {
        this.producerDetail.loadWine(params.wineId, true)
      }
    }
  }

  loadOverlay(cb = Uneet.noop) {
    this._fadeInOverlay(() => {
      cb()
    })
  }

  unloadOverlay(cb = Uneet.noop) {
    this._fadeOutOverlay(() => {
      cb()
    })
  }

  changePage(title, url, type = '') {
    document.title = title
    const stateObj = {
      url: window.location.href,
      title: document.title,
      type,
    }
    this.__log('Changing State to: ', stateObj)
    window.history.pushState(stateObj, title, url)
  }

  _fadeInOverlay(callback = Uneet.noop) {
    this._toggleState('hasOpenOverlay', true)
    callback()
  }

  _fadeOutOverlay(callback = Uneet.noop) {
    this._toggleState('isClosingOverlay', true)
    const removeOverlayClasses = () => {
      this._toggleState('hasOpenOverlay', false)
      this._toggleState('isClosingOverlay', false)
    }
    window.setTimeout(() => {
      removeOverlayClasses()
      callback()
    }, 300)
  }
}

// exports default ccName
