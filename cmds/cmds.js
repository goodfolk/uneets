const minimist = require('minimist');

const { CREATE, REMOVE } = require('./utils/constants');
const parseArgs = require('./utils/parseArgs');
const { createFiles, removeFiles } = require('./utils/commands');


const argv = minimist(process.argv.slice(2))
const parsedArgs = parseArgs(argv)

if (parsedArgs !== null) {
  switch (parsedArgs.command) {
    case CREATE: 
      createFiles(parsedArgs.cssClassName, parsedArgs.jsClassName, parsedArgs.isModule);
      break;
    case REMOVE:
      removeFiles(parsedArgs.jsClassName, parsedArgs.isModule);
      break;
    default: 
      console.log(`Please specify a command: "create" or "remove"`)
  }
}




