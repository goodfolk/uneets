/* ***************************************************************************
  uneets-config.js: Uneet Boilerplate config
*************************************************************************** */

//## Basic Variables
// Edit these to customize your project.
const distFolder = './dist'
const srcFolder = './src'

//## Advanced Variables
// edit at your own peril

//### Paths
const vars = {
  dist: distFolder, // main dist folder
  src: srcFolder, // main src folder
  uneetsFolder: `${srcFolder}/uneets`,
  commonFolder: `${srcFolder}/common`,
  php: {
    ignore: false,
    srcSubfolder: '/php',
    distSubFolder: '/php'
  },
  scss: {
    ignore: false,
    srcSubFolder: '/scss',
    entryFile: 'styles.scss',
    distSubFolder: '/css',
    outputFile: 'styles.css'
  },
  js: {
    ignore: false,
    srcSubfolder: '/js',
    distSubFolder: '/js',
    outputFile: 'all.js'
  }
};

//### Specific SCSS Config
vars.scss.config = {
  autoprefixerSettings: {
    browsers: [
      'iOS 8',
      'iOS 9',
      'last 2 ChromeAndroid versions',
      'last 2 Android versions',
      'last 2 ExplorerMobile versions',
      'ie 11',
      'last 2 Edge versions',
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Safari versions'
    ],
    cascade: false,
    flexbox: 'no-2009'
  },
  minify: true,
  autoprefix: true,
  useReset: true,
  useNormalize: true
}

//### Specific JS Config
vars.js.config = {
  babelConfig: {
    presets: [
      ['env', {
        targets: {
          browsers: [ 
            'iOS 8', 
            'iOS 9', 
            'last 2 ChromeAndroid versions', 
            'last 2 Android versions', 
            'last 2 ExplorerMobile versions',
            'ie 11', 
            'last 2 Edge versions',
            'last 2 Chrome versions', 
            'last 2 Firefox versions', 
            'last 2 Safari versions'
          ],
        }
      }]
    ]
  },
  minify: true
}

module.exports = vars
