import kebabCase from 'kebab-case'

export const getFuncNameAsClass = func => {
  const regex = /function ([^\(]*)/
  return kebabCase(regex.exec(func)[1]).replace('-u-', 'u_')
}

export const parse = val => {
  // float and int
  if (val.indexOf('.') > -1) {
    const float = parseFloat(val)
    if (!isNaN(float)) return float
  } else {
    const int = parseInt(val)
    if (!isNaN(int)) return int
  }
  try {
    const jsonval = JSON.parse(val)
    return jsonval
  } catch {
    return val
  }
}
