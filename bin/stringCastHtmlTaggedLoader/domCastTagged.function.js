"use strict";
// taggedjs-no-compile
Object.defineProperty(exports, "__esModule", { value: true });
const checksum_function_js_1 = require("./checksum.function.js");
const reconstructCode_function_js_1 = require("./reconstructCode.function.js");
const reconstructedToOutput_function_js_1 = require("./reconstructedToOutput.function.js");
const stringCastHtmlTagged_function_js_1 = require("./stringCastHtmlTagged.function.js");
function domCastTagged(code, filePath) {
    // return code
    if (code.includes('taggedjs-no-compile')) {
        return code;
    }
    const finalResults = (0, stringCastHtmlTagged_function_js_1.stringCastHtml)(code);
    // was not intended to be parsed
    if (typeof finalResults === stringCastHtmlTagged_function_js_1.string) {
        return finalResults;
    }
    const stringChecksum = (0, checksum_function_js_1.checkSumParseResults)(finalResults);
    // create a variableName that will change based on sum of content (helps HMR detect changes to tag functions)
    const allVarName = `allStrings${stringChecksum}`;
    const reconstructed = (0, reconstructCode_function_js_1.reconstructCode)(finalResults, allVarName, 'html.dom');
    return (0, reconstructedToOutput_function_js_1.reconstructedToOutput)(reconstructed, allVarName, filePath);
}
exports.default = domCastTagged;
//# sourceMappingURL=domCastTagged.function.js.map