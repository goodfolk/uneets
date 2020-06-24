const fs = require('fs')
const cfg = require('../../uneets.config')

const trashFolder = cfg.trash.dest
const uneetsFolder = cfg.uneets.src

const removeFile = (srcPath, destPath) => {
  const now = Date.now().toString()
  fs.renameSync(srcPath, `${destPath}-${now}`)
}

exports.removeFolder = (uneetName) => {
  const dest = `${trashFolder}/${uneetName}`
  const src = `${uneetsFolder}/${uneetName}`
  removeFile(src,dest)
  console.warn('Uneet files were moved to trash!')
}