export const flattenObject = (obj: any, path = '') => {
  const flat: any = {}
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      Object.assign(flat, flattenObject(obj[key], path + key + '.'))
    } else {
      flat[path + key] = obj[key]
    }
  }
  return flat
}
