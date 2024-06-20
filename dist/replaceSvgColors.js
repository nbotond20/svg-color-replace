"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSvgColors = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const replaceSvgColors = ({ folderPath, cssMap, fileExtensions, dryRun, injectIntoHtml, htmlPath, cssFileOutputPath, }) => {
    let folder;
    try {
        folder = fs_1.default.readdirSync(folderPath);
    }
    catch (error) {
        console.error('Error reading folder', error);
        return;
    }
    console.log('folder', folder);
    // Create color : css variable map
    const globalColorCssVariableMap = {};
    const fileExtensionsSet = new Set(fileExtensions);
    if (fileExtensions && fileExtensions.length > 0) {
        folder = folder.filter(file => fileExtensionsSet.has(path_1.default.extname(file)));
    }
    /* Loop through all files in the folder and replace the FILL and STROKE colors with the css variables. If there are more than one css variables for the given color pick the first one. */
    folder.forEach(file => {
        const filePath = path_1.default.join(folderPath, file);
        let data;
        try {
            data = fs_1.default.readFileSync(filePath, 'utf8');
        }
        catch (error) {
            console.error('Error reading file', error);
            return;
        }
        // Match all STROKE and FILL colors in the SVG file. The color can be in HEX or color name format.
        const colors = data
            .match(/(fill|stroke)="(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)"/g)
            ?.map(color => {
            const colorName = color.split('=')[1].replace(/"/g, '');
            const isHex = colorName.match(/#[0-9A-Fa-f]{3,6}/);
            if (isHex) {
                return colorName.toLocaleLowerCase();
            }
            return undefined;
        })
            .filter(Boolean);
        const uniqueColors = colors ? Array.from(new Set(colors)) : [];
        // Create color : css variable map
        const colorCssVariableMap = {};
        uniqueColors.forEach(color => {
            const cssVariable = cssMap[color]?.[0];
            if (cssVariable) {
                colorCssVariableMap[color] = cssVariable;
                globalColorCssVariableMap[color] = cssVariable;
            }
        });
        // Replace the colors with the css variables "var(--color)". Ignore case sensitivity.
        let newData = data;
        for (let color in colorCssVariableMap) {
            const re = new RegExp(color, 'gi');
            newData = newData.replace(re, `var(${colorCssVariableMap[color]})`);
        }
        console.log('File updated:', filePath);
        // Replace the file with the new data
        !dryRun && fs_1.default.writeFileSync(filePath, newData, 'utf8');
    });
    if (Object.keys(globalColorCssVariableMap).length !== 0 && !dryRun) {
        // Generate CSS file with the color : css variable map
        const cssFilePath = path_1.default.join(folderPath, cssFileOutputPath ?? 'svg-colors.generated.css');
        let cssData = '/* Generated file based on SVG files. It contains the color from the theme JSON object  */\n\n:root {\n';
        for (let color in globalColorCssVariableMap) {
            cssData += `  ${globalColorCssVariableMap[color]}: ${color};\n`;
        }
        cssData += '}\n';
        fs_1.default.writeFileSync(cssFilePath, cssData, 'utf8');
    }
    else {
        !dryRun && console.warn('No colors found in the SVG files! No CSS file generated.');
    }
    // Inject the CSS file into the HTML file
    if (injectIntoHtml && !dryRun) {
        console.log('Injecting CSS file into the HTML file');
        // htmlPath or default root index.html
        const htmlFilePath = htmlPath || path_1.default.join('.', 'index.html');
        let htmlData = fs_1.default.readFileSync(htmlFilePath, 'utf8');
        htmlData = htmlData.replace('</head>', `  <link rel="stylesheet" href="${cssFileOutputPath ?? 'svg-colors.generated.css'}">\n</head>`);
        fs_1.default.writeFileSync(htmlFilePath, htmlData, 'utf8');
    }
};
exports.replaceSvgColors = replaceSvgColors;
//# sourceMappingURL=replaceSvgColors.js.map