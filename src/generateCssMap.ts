import * as fs from 'fs'

export type CssMap = { [key: string]: string[] }

interface Props {
  tokenSetInputPath: string
  tokenSetKey?: string
  preferDeepKey?: boolean
  cssMapOutputPath?: string
}

export const generateCssMap = ({
  tokenSetInputPath: inputPath,
  cssMapOutputPath: outputPath,
  tokenSetKey,
  preferDeepKey,
}: Props) => {
  if (!inputPath) {
    console.error('Please provide input path!')
    return
  }

  const cssVariablesMap: CssMap = {}

  let file: string
  try {
    file = fs.readFileSync(inputPath, 'utf8')
  } catch (error) {
    console.error('Error reading file', error)
    return
  }

  let parsedFile
  try {
    parsedFile = JSON.parse(file)
  } catch (error) {
    console.error('Error parsing JSON', error)
    return
  }

  let seSepSeTokens
  if (tokenSetKey) {
    try {
      seSepSeTokens = parsedFile[tokenSetKey]
    } catch (error) {
      console.error(`Error getting tokenSetKey (${tokenSetKey}) from JSON object`, error)
      return
    }
  } else {
    seSepSeTokens = file
  }

  const visitMap = (obj: any, path = '') => {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        visitMap(obj[key], path + key + '-')
      } else {
        if (!cssVariablesMap[obj[key]]) {
          cssVariablesMap[obj[key]] = []
        }
        cssVariablesMap[obj[key]].push(`--${path}${key}`)
      }
    }
  }
  visitMap(seSepSeTokens)

  const cssVariablesMapJsonContent = JSON.stringify(cssVariablesMap)

  /* Visit the new object's every key and order the value array by the number of "-"" symbols in it. Put the lower number first. */
  for (let key in cssVariablesMap) {
    cssVariablesMap[key].sort((a, b) => {
      return preferDeepKey ? b.split('-').length - a.split('-').length : a.split('-').length - b.split('-').length
    })
  }

  if (outputPath) {
    try {
      fs.writeFileSync(outputPath, cssVariablesMapJsonContent, 'utf8')
    } catch (error) {
      console.error('Error writing file', error)
      return
    }
  }

  return cssVariablesMap
}
