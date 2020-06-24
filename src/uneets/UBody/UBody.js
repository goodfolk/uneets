/* UBody */

import Uneet from '../_base/uneetJS.js'
import UTplHome from '../UTplHome/UTplHome'
import UTpl404 from '../UTpl404/UTpl404'

class UBody extends Uneet {
  constructor(de) {
    super(de)
    this.init()
  }

  init() {
    this.initTemplates()
  }

  initTemplates() {
    // Create UTplArticleListingPage, if found
    this.home = this.createIfFound(UTplHome)
    this.home = this.createIfFound(UTpl404)
  }

  createIfFound(theClass, paramsObj = null, multiple = false) {
    let createdUneet
    try {
      const createFunction = multiple
        ? (a, b) => this.createChildUneets(a, b)
        : (a, b) => this.createChildUneet(a, b)
      createdUneet = createFunction(theClass, paramsObj)
    } catch (err) {
      this.__log(err)
    }
    return createdUneet
  }

}

export default UBody
