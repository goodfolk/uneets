export const __isIE11 = function() {
  return !!window.MSInputMethodContext && !!document.documentMode
}
export const __isEdge = function() {
  return window.navigator.userAgent.indexOf('Edge') > -1
}

export const __isDOMElement = domElement => {
  if (domElement) {
    if (domElement.nodeType === 1) {
      return domElement
    }
  }
  const err = 'Invalid DOM Element'
  const errMsg =
    'Passed domElement is not a Node of Node.ELEMENT_NODE (1) type.'
  this.__throwUneetError(err, errMsg, domElement)
  return domElement
}
