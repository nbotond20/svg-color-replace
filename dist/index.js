"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const generateCssMap_1 = require("./generateCssMap");
const replaceSvgColors_1 = require("./replaceSvgColors");
const main = () => {
    const svgFolderPath = core.getInput('svg-folder-path', { required: true });
    const tokenSetInputPath = core.getInput('token-set-input-path', { required: true });
    const dryRun = core.getBooleanInput('dry-run');
    const tokenSetKey = core.getInput('token-set-key');
    const preferDeepKey = core.getBooleanInput('prefer-deep-key');
    const cssMapOutputPath = core.getInput('css-map-output-path');
    const fileExtensions = core.getInput('file-extensions');
    const injectIntoHtml = core.getBooleanInput('inject-into-html');
    const htmlPath = core.getInput('html-path');
    const cssOutputPath = core.getInput('css-output-path');
    let fileExtensionsArray = undefined;
    if (fileExtensions) {
        try {
            fileExtensionsArray = JSON.parse(fileExtensions);
        }
        catch (error) {
            console.error('Error parsing file extensions', error);
            return;
        }
    }
    const cssMap = (0, generateCssMap_1.generateCssMap)({
        tokenSetInputPath,
        tokenSetKey,
        preferDeepKey,
        cssMapOutputPath,
    });
    if (!cssMap) {
        console.error('No cssMap generated!');
        return;
    }
    (0, replaceSvgColors_1.replaceSvgColors)({
        folderPath: svgFolderPath,
        cssMap: cssMap,
        fileExtensions: fileExtensionsArray,
        dryRun,
        injectIntoHtml,
        htmlPath,
        cssFileOutputPath: cssOutputPath,
    });
};
main();
//# sourceMappingURL=index.js.map