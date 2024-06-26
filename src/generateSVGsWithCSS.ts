import { generateBaseCssMap } from './generateCssMaps'
import { replaceSvgColors } from './replaceSvgColors'
import { parseAsArray } from './utils/parseAsArray'

interface GenerateSVGsWithCSSProps {
  svgFolderPath: string
  tokenSetInputPaths: string[]
  baseTokenSetInputPath: string
  dryRun?: boolean
  tokenSetKeys?: string[]
  preferDeepKey?: boolean
  fileExtensions?: string[]
  injectIntoHtml?: boolean
  htmlPath?: string
  cssFileOutputFolderPath?: string
  cssFileHrefPrefix?: string
  svgOutputFolderPath?: string
  markGeneratedSVGFiles?: boolean
}

export const generateSVGsWithCSS = ({
  baseTokenSetInputPath,
  cssFileHrefPrefix,
  cssFileOutputFolderPath,
  dryRun,
  fileExtensions,
  htmlPath,
  injectIntoHtml,
  markGeneratedSVGFiles,
  preferDeepKey,
  svgFolderPath,
  svgOutputFolderPath,
  tokenSetInputPaths,
  tokenSetKeys,
}: GenerateSVGsWithCSSProps) => {
  let fileExtensionsArray: string[] = []
  if (fileExtensions) {
    fileExtensionsArray = parseAsArray(fileExtensions, 'file-extensions')
  }

  let tokenSetKeysArray: string[] | undefined = undefined
  if (tokenSetKeys) {
    tokenSetKeysArray = parseAsArray(tokenSetKeys, 'token-set-keys')
  }

  let tokenSetInputPathsArray: string[] | undefined = undefined
  tokenSetInputPathsArray = parseAsArray(tokenSetInputPaths, 'token-set-input-paths')

  const baseCssMap = generateBaseCssMap({
    tokenSetKeys: tokenSetKeysArray,
    baseTokenSetInputPath,
    preferDeepKey,
  })

  if (Object.keys(baseCssMap).length === 0) {
    console.warn('No baseCssMap generated!')
  }

  replaceSvgColors({
    markGeneratedSVGFiles,
    svgOutputFolderPath,
    tokenSetInputPaths: tokenSetInputPathsArray,
    folderPath: svgFolderPath,
    cssMap: baseCssMap.cssMap,
    baseCssMapName: baseCssMap.name,
    fileExtensions: fileExtensionsArray,
    dryRun,
    injectIntoHtml,
    htmlPath,
    cssFileHrefPrefix,
    cssFileOutputFolderPath,
  })
}
