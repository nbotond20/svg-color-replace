import * as core from '@actions/core'
import { generateBaseCssMap } from './generateCssMaps'
import { replaceSvgColors } from './replaceSvgColors'
import { parseAsArray } from './utils/parseAsArray'

const svgFolderPath = core.getInput('svg-folder-path', { required: true })
const tokenSetInputPaths = core.getInput('token-set-input-paths', { required: true })
const baseTokenSetInputPath = core.getInput('base-token-set-input-path', { required: true })
const dryRun = core.getBooleanInput('dry-run')
const tokenSetKeys = core.getInput('token-set-keys')
const preferDeepKey = core.getBooleanInput('prefer-deep-key')
const fileExtensions = core.getInput('file-extensions')
const injectIntoHtml = core.getBooleanInput('inject-into-html')
const htmlPath = core.getInput('html-path')
const cssFileOutputFolderPath = core.getInput('css-file-output-folder-path')
const cssFileHrefPrefix = core.getInput('css-file-href-prefix')

let fileExtensionsArray: string[] | undefined = undefined
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
