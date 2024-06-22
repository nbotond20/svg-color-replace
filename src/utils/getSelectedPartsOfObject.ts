import { flattenObject } from './flattenObject'
import { unflattenObject } from './unflattenObject'

export type RecursiveObject = { [key: string]: RecursiveObject | string }
export const getSelectedPartsOfObject = (object: any, keys: string[]) => {
  // Flatten the object
  const flatObj = flattenObject(object)

  const seSepSeTokens = Object.keys(flatObj)
    .filter(objKey => keys.some(key => objKey.includes(key)))
    .reduce<RecursiveObject>((obj, key) => {
      obj[key] = flatObj[key]
      return obj
    }, {})

  // Unflat the object
  return unflattenObject(seSepSeTokens)
}
