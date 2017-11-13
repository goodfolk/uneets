var uCamelCase = require('uppercamelcase');

module.exports.scssBase = function(name) {
  return '.' + name + ' {\n' + '}'
}

module.exports.jsBase = function(name) {
  var ccName = uCamelCase(name)
  var file = '';
  file += '/* globals Uneet */\n';
  file += 'class ' + ccName + ' extends ' + 'Uneet {\n';
  file += '\tconstructor(de) {\n';
  file += '\t\tsuper(de)\n';
  file += '\t\tthis.init()\n';
  file += '\t}\n';
  file += '\n';
  file += '\tinit () {\n';
  file += '\t\tthis.__log(`No code added to Uneet ${this.constructor.name} on '+name+'.js`)\n';
  file += '\t}\n';
  file += '}\n';
  file += '\n';
  file += '// exports default '+ccName+' \n';
  return file;
}

module.exports.hbsBase = function(name) {
  var file = '';
  file += '<div class=\'' + name + '\'>\n';
  file += '</div>\n';
  return file;
}

module.exports.phpBase = function(name) {
  return '<?php // ' + name + ' ?>\n';
}
