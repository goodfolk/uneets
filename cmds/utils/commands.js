const { createJS, createCSS, createTemplate } = require('./createFiles')
const { removeFolder } = require('./removeFiles')
const { attachCSS, attachJS } = require('./attachers')
const { detachCSS, detachJS } = require('./detachers')

module.exports = {
  createFiles: (cssClassName, jsClassName, isModule) => {
    if (!isModule) {
      createJS(jsClassName, `./src/uneets/${jsClassName}`)
      attachJS(jsClassName)
    }
    createCSS(jsClassName, `./src/uneets/${jsClassName}`, cssClassName)
    createTemplate(jsClassName, `./src/uneets/${jsClassName}`, cssClassName)
    attachCSS(jsClassName)
  },
  removeFiles: (jsClassName, isModule)=> {
    detachCSS(jsClassName)
    if (!isModule) {
      detachJS(jsClassName)
    }
    removeFolder(jsClassName)
  }
}