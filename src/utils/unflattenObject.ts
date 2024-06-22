export const unflattenObject = (obj: any) => {
  const unflat: any = {}
  for (let key in obj) {
    const keys = key.split('.')
    let current = unflat
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {}
    }
    current[keys[keys.length - 1]] = obj[key]
  }
  return unflat
}
