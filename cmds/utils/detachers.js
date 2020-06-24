const fs = require('fs')

exports.detachJS = (uneetName) => {
  const uneetsFile = `${__dirname}/../../src/uneets/_base/uneets.js`
  const lineToFind1 = `  '${uneetName}': ${uneetName},\n`
  const lineToFind2 = `import ${uneetName} from '../${uneetName}/${uneetName}'\n`
  let fileContents = fs.readFileSync(uneetsFile).toString()
  fileContents = fileContents.replace(lineToFind1,'')
  fileContents = fileContents.replace(lineToFind2,'')
  fs.writeFileSync(uneetsFile, fileContents)
  console.log('JS file dettached from uneets.js imports')
}

exports.detachCSS = (uneetName) => {
  const uneetsFile = `${__dirname}/../../src/uneets/_base/_uneets.pcss`
  const lineToFind = `@import '../${uneetName}/${uneetName}.pcss';\n`
  let fileContents = fs.readFileSync(uneetsFile).toString()
  fileContents = fileContents.replace(lineToFind,'')
  fs.writeFileSync(uneetsFile, fileContents)
  console.log('CSS file dettached from _uneets.pcss imports')
}