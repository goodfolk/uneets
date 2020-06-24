const fs = require('fs')

const IMPORT_ADD = "// [IMPORT_ADD]"
const OBJ_ADD = "// [OBJ_ADD]"

const insertInPosition = (str,insert,pos,lineBreak = '\n') => `${str.slice(0, pos)}${insert}${lineBreak}${str.slice(pos)}`

exports.attachJS = uneetName => {
  const uneetsFile = `${__dirname}/../../src/uneets/_base/uneets.js`
  let fileContents = fs.readFileSync(uneetsFile).toString()
  const isImported =
    fileContents.indexOf(uneetName) !== -1
  if (!isImported) {
    const importAddLine = fileContents.indexOf(IMPORT_ADD)
    const objAddLine = fileContents.indexOf(OBJ_ADD)
    if (!((importAddLine > -1) && (objAddLine > -1))) {
      console.error(`Can't find line markers on ${uneetsFile}.`)
      throw new Error(`Can't find line markers on ${uneetsFile}.`)
    }
    fileContents = insertInPosition(fileContents,`  '${uneetName}': ${uneetName},`,objAddLine)
    fileContents = insertInPosition(fileContents,`import ${uneetName} from '../${uneetName}/${uneetName}'`,importAddLine)
    fs.writeFileSync(uneetsFile, fileContents)
    console.log('JS file added to uneets.js imports')
  }
}

exports.attachCSS = uneetName => {
  const uneetsFile = `${__dirname}/../../src/uneets/_base/_uneets.pcss`
  const isImported =
    fs
      .readFileSync(uneetsFile)
      .toString()
      .indexOf(uneetName) !== -1
  if (!isImported) {
    fs.appendFileSync(uneetsFile, `@import '../${uneetName}/${uneetName}.pcss';\n`)
    console.log('CSS file added to _uneets.pcss imports')
  }
}
