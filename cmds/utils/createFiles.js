const fs = require('fs')
const path = require('path')
const cfg = require('../../uneets.config')
const ensureDirectoryExistence = require('./ensureDirectory')

const createFile = (uneetName, theClass = '', destFilePath, utplFilePath) => {
  const contents = fs
    .readFileSync(utplFilePath)
    .toString()
    .replace(new RegExp('~~name~~', 'g'), uneetName)
    .replace(new RegExp('~~theClass~~', 'g'), theClass)
  ensureDirectoryExistence(destFilePath)
  if (!fs.existsSync(destFilePath)) {
    fs.writeFileSync(destFilePath, contents, err => {
      console.error(err)
    })
  } else {
    console.warn(`Did not create file ${destFilePath}, it already exists.`)
  }
}

exports.createJS = (uneetName, folder) => {
  const filePath = `${folder}/${uneetName}.js`
  createFile(
    uneetName,
    null,
    filePath,
    `${__dirname}/../base-files/base.js.utpl`
  )
}

exports.createCSS = (uneetName, folder, theClass) => {
  const filePath = `${folder}/${uneetName}.pcss`
  createFile(
    uneetName,
    theClass,
    filePath,
    `${__dirname}/../base-files/base.pcss.utpl`
  )
}

exports.createTemplate = (uneetName, folder, theClass) => {
  const filePath = cfg.templates.useTwig
    ? `${folder}/${uneetName}.html.twig`
    : `${folder}/${uneetName}.php`
  const baseFile = cfg.templates.useTwig
    ? `${__dirname}/../base-files/base.html.twig.utpl`
    : `${__dirname}/../base-files/base.php.utpl`
  createFile(uneetName, theClass, filePath, baseFile)
}
