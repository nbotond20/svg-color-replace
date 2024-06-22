export const getObjectValueWithNestedKey = (obj: any, key: string) => {
  const keys = key.split('.')

  return keys.reduce((acc, currentKey) => {
    return acc[currentKey.toString()]
  }, obj)
}
