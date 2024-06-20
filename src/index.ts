import * as core from '@actions/core'
import { generateCssMap } from './generateCssMap'
import { replaceSvgColors } from './replaceSvgColors'

const main = () => {
  const svgFolderPath = core.getInput('svg-folder-path', { required: true })
  const tokenSetInputPath = core.getInput('token-set-input-path', { required: true })
  const dryRun = core.getBooleanInput('dry-run')
  const tokenSetKey = core.getInput('token-set-key')
  const preferDeepKey = core.getBooleanInput('prefer-deep-key')
  const cssMapOutputPath = core.getInput('css-map-output-path')
  const fileExtensions = core.getInput('file-extensions')
  const injectIntoHtml = core.getBooleanInput('inject-into-html')
  const htmlPath = core.getInput('html-path')
  const cssOutputPath = core.getInput('css-output-path')
  const cssFileHref = core.getInput('css-file-href')

  let fileExtensionsArray: string[] | undefined = undefined
  if (fileExtensions) {
    try {
      fileExtensionsArray = JSON.parse(fileExtensions)
    } catch (error) {
      console.error('Error parsing file extensions', error)
      return
    }
  }

  const cssMap = generateCssMap({
    tokenSetInputPath,
    tokenSetKey,
    preferDeepKey,
    cssMapOutputPath,
  })

  if (!cssMap) {
    console.error('No cssMap generated!')
    return
  }

  replaceSvgColors({
    folderPath: svgFolderPath,
    cssMap: cssMap,
    fileExtensions: fileExtensionsArray,
    dryRun,
    injectIntoHtml,
    htmlPath,
    cssFileOutputPath: cssOutputPath,
    cssFileHref,
  })
}

main()
