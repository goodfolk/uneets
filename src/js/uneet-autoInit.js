// UPDATE: Uneets no longer need to be manually initialized unless explicitly specified
// Create your base Uneet here.
// window.upage = new UBody(document.querySelector('.u_body'))

import { WINDOW_OBJ_KEY, CLASS_PREFIX, ATTR_PREFIXES, NOINIT_SUFFIX, AUTO_INIT_KEY } from './uneet-constants'
import uneetsClasses from '../uneets/_base/uneets'

import pascalcase from 'pascalcase'


const getClassName = (domElement) => {
  const classes = Array.from(domElement.classList).filter((className)=>
    (className.indexOf(CLASS_PREFIX) > -1)
  ).map((className)=>pascalcase(className)) 
  return classes.length > 0 ? classes[0] : null
}

const initWindowObj = () => {
  window[WINDOW_OBJ_KEY] = {
    objs: []
  }
}

const uneetsAutoInit = () => {
  initWindowObj();
  // query for: 
  // - starts with u_ (prefix) but
  // - does not contain any of the attr prefixes (u-, data-u-, u_, data-u_)
  // - does not have "--" or "__" in the class name
  const query = `[class^='${CLASS_PREFIX}']${ATTR_PREFIXES.reduce((acc,prefix)=>`${acc}:not([${prefix}${NOINIT_SUFFIX}])`,'')}:not([class*='--']):not([class*='__'])`
  console.debug(`Querying for autoinit as per: ${query}`)
  const autoInitDOMElements = document.querySelectorAll(query);
  autoInitDOMElements.forEach(domElement=>{
    const className = getClassName(domElement);
    const theClass = uneetsClasses[className];
    const opts = {}
    opts[AUTO_INIT_KEY] = true
    window[WINDOW_OBJ_KEY].objs.push(new theClass(domElement, opts))
    console.info(`Uneets: Autoinitializing ${className} from:`, domElement);
  })
}

export default uneetsAutoInit