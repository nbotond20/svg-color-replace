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
exports.generateCssMap = void 0;
const fs = __importStar(require("fs"));
const generateCssMap = ({ tokenSetInputPath: inputPath, cssMapOutputPath: outputPath, tokenSetKey, preferDeepKey, }) => {
    if (!inputPath) {
        console.error('Please provide input path!');
        return;
    }
    const cssVariablesMap = {};
    let file;
    try {
        file = fs.readFileSync(inputPath, 'utf8');
    }
    catch (error) {
        console.error('Error reading file', error);
        return;
    }
    let parsedFile;
    try {
        parsedFile = JSON.parse(file);
    }
    catch (error) {
        console.error('Error parsing JSON', error);
        return;
    }
    let seSepSeTokens;
    if (tokenSetKey) {
        try {
            seSepSeTokens = parsedFile[tokenSetKey];
        }
        catch (error) {
            console.error(`Error getting tokenSetKey (${tokenSetKey}) from JSON object`, error);
            return;
        }
    }
    else {
        seSepSeTokens = file;
    }
    const visitMap = (obj, path = '') => {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                visitMap(obj[key], path + key + '-');
            }
            else {
                if (!cssVariablesMap[obj[key]]) {
                    cssVariablesMap[obj[key]] = [];
                }
                cssVariablesMap[obj[key]].push(`--${path}${key}`);
            }
        }
    };
    visitMap(seSepSeTokens);
    const cssVariablesMapJsonContent = JSON.stringify(cssVariablesMap);
    /* Visit the new object's every key and order the value array by the number of "-"" symbols in it. Put the lower number first. */
    for (let key in cssVariablesMap) {
        cssVariablesMap[key].sort((a, b) => {
            return preferDeepKey ? b.split('-').length - a.split('-').length : a.split('-').length - b.split('-').length;
        });
    }
    if (outputPath) {
        try {
            fs.writeFileSync(outputPath, cssVariablesMapJsonContent, 'utf8');
        }
        catch (error) {
            console.error('Error writing file', error);
            return;
        }
    }
    return cssVariablesMap;
};
exports.generateCssMap = generateCssMap;
//# sourceMappingURL=generateCssMap.js.map