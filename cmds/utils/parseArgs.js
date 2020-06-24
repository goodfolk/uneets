const kebabCase = require('kebab-case')
const { CREATE, REMOVE } = require('./constants.js')

const parseArgs = (argv) => {
  
  const command = `${argv._[0]}`.toUpperCase()
  
  // check if it is create or remove
  if (![CREATE, REMOVE].includes(command)) {
    throw new Error('Command not recongized.')
    return null
  }

  const char0 = argv._[1].charAt(0).toUpperCase()
  
  // first char0 must be U or M
  if (!['U','M'].includes(char0)) {
    throw new Error('Uneet or Module name must start with "U" or "M".')
    return null
  }

  // second char1 must be uppercase
  const char1 = argv._[1].charAt(1)
  if (char1 !== char1.toUpperCase()) {
    throw new Error('Uneet or Module name must start with "U" or "M", followed by a "Name".')
    return null
  }

  const isModule = char0 === 'M'
  const jsClassName = argv._[1]
  const cssClassName = kebabCase(jsClassName).replace(`-${char0.toLowerCase()}-`, `${char0.toLowerCase()}_`)  

  return {
    command,
    jsClassName,
    cssClassName,
    isModule
  }
}

module.exports = parseArgs
