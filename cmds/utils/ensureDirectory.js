const fs = require('fs')
const path = require('path')

const ensureDirectoryExistence = filePath => {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

module.exports = ensureDirectoryExistence

