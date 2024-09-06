"use strict";
// taggedjs-no-compile
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringCastHtmlTagged = exports.stringCastHtml = exports.extractTemplateParts = exports.string = void 0;
const checksum_function_js_1 = require("./checksum.function.js");
const parseHtmlTemplates_function_js_1 = require("./parseHtmlTemplates.function.js");
const reconstructCode_function_js_1 = require("./reconstructCode.function.js");
exports.string = 'string';
// TODO: this function seem useless or its just cloning?
function extractTemplateParts(parsedResults) {
    return parsedResults.map(item => {
        if (typeof item === exports.string) {
            return item;
        }
        else {
            const { html, strings, values } = item;
            return { html, strings, values };
        }
    });
}
exports.extractTemplateParts = extractTemplateParts;
function recursiveTemplateParse(parsedResults) {
    const recurseValues = (values) => {
        return values.map(value => {
            if (value.includes('html`')) {
                const parsed = (0, parseHtmlTemplates_function_js_1.parseHtmlTemplates)(value);
                const result = parseHtmlResults(value, parsed);
                return result;
            }
            return value;
        });
    };
    return parsedResults.map(item => {
        if (typeof item === 'object') {
            if (item.html) {
                item.values = recurseValues(item.values);
            }
        }
        return item;
    });
}
function stringCastHtml(code) {
    const parsedResults = (0, parseHtmlTemplates_function_js_1.parseHtmlTemplates)(code);
    return parseHtmlResults(code, parsedResults);
}
exports.stringCastHtml = stringCastHtml;
function parseHtmlResults(code, parsedResults) {
    if (parsedResults.every((template) => typeof template === exports.string)) {
        return code;
    }
    const detailedResults = extractTemplateParts(parsedResults);
    return recursiveTemplateParse(detailedResults);
}
function stringCastHtmlTagged(code, filePath) {
    // return code
    if (code.includes('taggedjs-no-compile')) {
        return code;
    }
    const finalResults = stringCastHtml(code);
    if (typeof finalResults === exports.string) {
        return finalResults;
    }
    const stringChecksum = (0, checksum_function_js_1.checkSumParseResults)(finalResults);
    // create a variableName that will change based on sum of content (helps HMR detect changes to tag functions)
    const allVarName = `allStrings${stringChecksum}`;
    const reconstructed = (0, reconstructCode_function_js_1.reconstructCode)(finalResults, allVarName);
    const allStringJson = JSON.stringify(reconstructed.allStrings);
    const allStrings = `\nconst allStrings: (string[])[] = {${allVarName}: ${allStringJson}}`;
    const output = reconstructed.code + allStrings;
    return output;
}
exports.stringCastHtmlTagged = stringCastHtmlTagged;
//# sourceMappingURL=stringCastHtmlTagged.function.js.map