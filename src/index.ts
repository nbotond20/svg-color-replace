import * as core from '@actions/core'
import { generateBaseCssMap } from './generateCssMaps'
import { replaceSvgColors } from './replaceSvgColors'
import { parseAsArray } from './utils/parseAsArray'
import { generateSVGsWithCSS } from './generateSVGsWithCSS'

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
const svgOutputFolderPath = core.getInput('svg-output-folder-path')
const markGeneratedSVGFiles = core.getBooleanInput('mark-generated-files')

core.debug(`svgFolderPath: ${svgFolderPath}`)
core.debug(`tokenSetInputPaths: ${tokenSetInputPaths}`)
core.debug(`baseTokenSetInputPath: ${baseTokenSetInputPath}`)
core.debug(`dryRun: ${dryRun}`)
core.debug(`tokenSetKeys: ${tokenSetKeys}`)
core.debug(`preferDeepKey: ${preferDeepKey}`)
core.debug(`fileExtensions: ${fileExtensions}`)
core.debug(`injectIntoHtml: ${injectIntoHtml}`)
core.debug(`htmlPath: ${htmlPath}`)
core.debug(`cssFileOutputFolderPath: ${cssFileOutputFolderPath}`)
core.debug(`cssFileHrefPrefix: ${cssFileHrefPrefix}`)
core.debug(`svgOutputFolderPath: ${svgOutputFolderPath}`)
core.debug(`markGeneratedSVGFiles: ${markGeneratedSVGFiles}`)

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

generateSVGsWithCSS({
  svgFolderPath,
  baseTokenSetInputPath,
  tokenSetInputPaths: tokenSetInputPathsArray,
  cssFileHrefPrefix,
  cssFileOutputFolderPath,
  dryRun,
  fileExtensions: fileExtensionsArray,
  htmlPath,
  injectIntoHtml,
  markGeneratedSVGFiles,
  preferDeepKey,
  svgOutputFolderPath,
  tokenSetKeys: tokenSetKeysArray,
})
