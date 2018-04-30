/* ***************************************************************************
  uneets-base-files.js: Base files for new uneets
  Contains functions that provide the base content of all new Uneet files (php, scss, js)
*************************************************************************** */

import uCamelCase from 'uppercamelcase';

export function scssBase(name) {
  return `
.${name} {
    
}
`}

export function jsBase(name) {
  const ccName = uCamelCase(name)
  return `
class ${ccName} extends Uneet {
  constructor(de) {
    super(de)
    this._init()
  }

  _init() {
    this.__log(\`No code added to Uneet \${this.constructor.name} on ${name}.js \`)
  }
}

exports default ${ccName}
`}

export function phpBase (name) {
  return `
<?php // ' + ${name} + ' ?>
<div class="${name}">
</div>
`}
