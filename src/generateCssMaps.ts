import * as fs from 'fs'
import { flattenObject } from './utils/flattenObject'
import { unflattenObject } from './utils/unflattenObject'
import { getSelectedPartsOfObject } from './utils/getSelectedPartsOfObject'
import { getFileNameFromPath } from './utils/getFileNameFromPath'

interface Props {
  baseTokenSetInputPath: string
  tokenSetKeys?: string[]
  preferDeepKey?: boolean
}

export type CssMap = { [key: string]: string[] }

export const generateBaseCssMap = ({ baseTokenSetInputPath, tokenSetKeys, preferDeepKey }: Props) => {
  let file: string
  try {
    file = fs.readFileSync(baseTokenSetInputPath, 'utf8')
  } catch {
    throw new Error('Error reading base token set file')
  }

  let parsedFile
  try {
    parsedFile = JSON.parse(file)
  } catch {
    throw new Error('Error parsing JSON file')
  }

  let seSepSeTokens: any = {}
  if (tokenSetKeys?.length) {
    try {
      seSepSeTokens = getSelectedPartsOfObject(parsedFile, tokenSetKeys)
    } catch {
      throw new Error(`Error getting one of tokenSetKeys from JSON object`)
    }
  } else {
    seSepSeTokens = parsedFile
  }

  const baseCssVariablesMap: CssMap = {}
  const visitMap = (obj: any, path = '') => {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        visitMap(obj[key], path + key + '-')
      } else {
        if (!baseCssVariablesMap[obj[key]]) {
          baseCssVariablesMap[obj[key]] = []
        }
        baseCssVariablesMap[obj[key]].push(`--${path}${key}`)
      }
    }
  }
  visitMap(seSepSeTokens)

  /* Visit the new object's every key and order the value array by the number of "-"" symbols in it. Put the lower number first. */
  for (let key in baseCssVariablesMap) {
    baseCssVariablesMap[key].sort((a, b) => {
      return preferDeepKey ? b.split('-').length - a.split('-').length : a.split('-').length - b.split('-').length
    })
  }

  const fileName = getFileNameFromPath(baseTokenSetInputPath)

  return {
    name: fileName,
    cssMap: baseCssVariablesMap,
  }
}
