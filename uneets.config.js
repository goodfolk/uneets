const srcPath = './src'
const destPath = './dist'

module.exports = {
  uneets: {
    src: `${srcPath}/uneets`
  },
  assets: {
    src: `${srcPath}/assets`,
    dest: `${destPath}/assets`
  },
  svgs: {
    src: `${srcPath}/svgs`,
    dest: `${destPath}/assets`
  },
  css: {
    src: `${srcPath}/css`,
    entryFilename: 'main.pcss',
    dest: `${destPath}/css`,
    outputFilename: 'main.css'
  },
  js: {
    src: `${srcPath}/js`,
    dest: `${destPath}/js`
  },
  templates: {
    dest: `${destPath}/templates`,
    useTwig: true
  },
  trash: {
    dest: `${srcPath}/../.uneets-trash`
  },
  livereload: {
    enable: true
  }
}
