import fs from 'fs'
import path from 'path'
import { CssMap } from './generateCssMaps'
import { getUniqueSVGColorsFromString } from './utils/getUniqueSVGColorsFromString'
import { getObjectPathFromCssVariable } from './utils/getObjectPathFromCssVariable'
import { RecursiveObject } from './utils/getSelectedPartsOfObject'
import { getObjectValueWithNestedKey } from './utils/getObjectValueWithNestedKey'
import { getCssVariableFromObjectPath } from './utils/getCssVariableFromObjectPath'
import { getFileNameFromPath } from './utils/getFileNameFromPath'

interface Props {
  tokenSetInputPaths: string[]
  folderPath: string
  cssMap: CssMap
  baseCssMapName: string
  fileExtensions?: string[]
  dryRun?: boolean
  injectIntoHtml?: boolean
  htmlPath?: string
  cssFileHrefPrefix?: string
  cssFileOutputFolderPath?: string
  svgOutputFolderPath?: string
  markGeneratedSVGFiles?: boolean
}

export const replaceSvgColors = ({
  folderPath,
  cssMap,
  fileExtensions,
  dryRun,
  injectIntoHtml,
  htmlPath,
  baseCssMapName,
  cssFileHrefPrefix,
  cssFileOutputFolderPath,
  tokenSetInputPaths,
  svgOutputFolderPath,
  markGeneratedSVGFiles,
}: Props) => {
  let folder

  try {
    folder = fs.readdirSync(folderPath)
  } catch (error) {
    console.error('Error reading folder', error)
    return
  }

  const fileExtensionsSet = new Set(fileExtensions)

  if (fileExtensions && fileExtensions.length > 0) {
    folder = folder.filter(file => fileExtensionsSet.has(path.extname(file)))
  }

  // Create color : css variable map
  const globalColorCssVariableMap: { [key: string]: string } = {}
  /* Loop through all files in the folder and replace the FILL and STROKE colors with the css variables. If there are more than one css variables for the given color pick the first one. */
  folder.forEach(file => {
    const filePath = path.join(folderPath, file)
    let data: string
    try {
      data = fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      console.error('Error reading file', error)
      return
    }

    // Match all STROKE and FILL colors in the SVG file. The color can be in HEX or color name format.
    const uniqueColors = getUniqueSVGColorsFromString(data)

    // Create color : css variable map
    const colorCssVariableMap: { [key: string]: string } = {}
    uniqueColors.forEach(color => {
      const cssVariable = cssMap[color]?.[0]
      if (cssVariable) {
        colorCssVariableMap[color] = cssVariable
        globalColorCssVariableMap[color] = cssVariable
      }
    })

    // Replace the colors with the css variables "var(--color)". Ignore case sensitivity.
    let newData = data
    for (let color in colorCssVariableMap) {
      const re = new RegExp(color, 'gi')
      newData = newData.replace(re, `var(${colorCssVariableMap[color]})`)
    }

    // if markGeneratedSVGFiles is true, add .generated. to the file name
    const fileNameToWrite = markGeneratedSVGFiles
      ? `${path.basename(file, path.extname(file))}.generated${path.extname(file)}`
      : file

    const outputFilePath = svgOutputFolderPath
      ? path.join(svgOutputFolderPath, fileNameToWrite)
      : path.join(folderPath, fileNameToWrite)

    // Create the output folder if it doesn't exist
    if (svgOutputFolderPath) {
      const outputFolder = path.dirname(outputFilePath)
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
      }
    }

    // Replace the file with the new data
    !dryRun && fs.writeFileSync(outputFilePath, newData, 'utf8')
  })

  /* Create base CSS files */
  const cssFilePath = path.join(cssFileOutputFolderPath ?? '.', `${baseCssMapName}.css`)
  if (Object.keys(globalColorCssVariableMap).length !== 0 && !dryRun) {
    // Generate CSS file with the color : css variable map
    let cssData = `/* Generated file based on the theme JSON object ${baseCssMapName}  */\n\n.${baseCssMapName} {\n`
    for (let color in globalColorCssVariableMap) {
      cssData += `  ${globalColorCssVariableMap[color]}: ${color};\n`
    }
    cssData += '}\n'

    fs.writeFileSync(cssFilePath, cssData, 'utf8')

    // Inject the CSS file into the HTML file
    if (injectIntoHtml) {
      console.log(`Injecting CSS file into the HTML file (${baseCssMapName})`)
      // htmlPath or default root index.html
      const htmlFilePath = htmlPath || path.join('.', 'index.html')
      let htmlData = fs.readFileSync(htmlFilePath, 'utf8')

      const cssHref = cssFileHrefPrefix ? `${cssFileHrefPrefix}/${baseCssMapName}.css` : `${baseCssMapName}.css`

      // Check if it's already injected
      if (htmlData.includes(cssHref ?? 'svg-colors.generated.css')) {
        console.log(`CSS file already injected into the HTML file (${baseCssMapName})`)
      } else {
        htmlData = htmlData.replace('</head>', `  <link rel="stylesheet" href="${cssHref}" />\n  </head>`)

        fs.writeFileSync(htmlFilePath, htmlData, 'utf8')
      }
    }
  } else {
    !dryRun && console.warn('No colors found in the SVG files! No CSS file generated.')
  }

  /* Create CSS files for all other theme objects */
  const themeKeys = Object.values(globalColorCssVariableMap).map(getObjectPathFromCssVariable)

  for (let tokenSetInputPath of tokenSetInputPaths) {
    let file: string
    try {
      file = fs.readFileSync(tokenSetInputPath, 'utf8')
    } catch {
      throw new Error(`Error reading token set file ${tokenSetInputPath}`)
    }

    let parsedFile: RecursiveObject
    try {
      parsedFile = JSON.parse(file)
    } catch {
      throw new Error(`Error parsing JSON file ${tokenSetInputPath}`)
    }

    const fileName = getFileNameFromPath(tokenSetInputPath)

    const cssKeyValueMap: { [key: string]: string } = {}
    // Create map of themeKeys transformed to css variables : theme values
    themeKeys.forEach(key => {
      const value = getObjectValueWithNestedKey(parsedFile, key)
      const cssVariable = getCssVariableFromObjectPath(key)

      cssKeyValueMap[cssVariable] = value
    })

    // Generate CSS file with the css variable : theme value map
    let cssData = `/* Generated file based on the theme JSON object ${fileName} */\n\n.${fileName} {\n`
    for (let cssVariable in cssKeyValueMap) {
      cssData += `  ${cssVariable}: ${cssKeyValueMap[cssVariable]};\n`
    }
    cssData += '}\n'

    const cssFilePath = path.join(cssFileOutputFolderPath ?? '.', `${fileName}.css`)
    fs.writeFileSync(cssFilePath, cssData, 'utf8')

    // Inject the CSS file into the HTML file
    if (injectIntoHtml) {
      console.log(`Injecting CSS file into the HTML file (${fileName})`)
      // htmlPath or default root index.html
      const htmlFilePath = htmlPath || path.join('.', 'index.html')
      let htmlData = fs.readFileSync(htmlFilePath, 'utf8')

      const cssHref = cssFileHrefPrefix ? `${cssFileHrefPrefix}/${fileName}.css` : `${fileName}.css`

      // Check if it's already injected
      if (htmlData.includes(cssHref ?? 'svg-colors.generated.css')) {
        console.log(`CSS file already injected into the HTML file (${fileName})`)
      } else {
        htmlData = htmlData.replace('</head>', `  <link rel="stylesheet" href="${cssHref}" />\n  </head>`)

        fs.writeFileSync(htmlFilePath, htmlData, 'utf8')
      }
    }
  }
}
