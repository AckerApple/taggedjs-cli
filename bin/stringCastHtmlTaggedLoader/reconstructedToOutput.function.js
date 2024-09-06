"use strict";
// taggedjs-no-compile
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructedToOutput = void 0;
const domMetaCollector_js_1 = require("taggedjs/js/tag/domMetaCollector.js");
const domMetaArrayToOutput_function_js_1 = require("./domMetaArrayToOutput.function.js");
function reconstructedToOutput(reconstructed, varName, filePath) {
    const allDom = reconstructed.allStrings.map((data) => {
        const { strings, valueCount } = data;
        const values = [];
        if (valueCount) {
            values.push(...','.repeat(valueCount - 1).split(','));
        }
        const map = (0, domMetaCollector_js_1.getDomMeta)(strings, values);
        return map;
    });
    return (0, domMetaArrayToOutput_function_js_1.domMetaArrayToOutput)(reconstructed, allDom, varName, filePath);
}
exports.reconstructedToOutput = reconstructedToOutput;
//# sourceMappingURL=reconstructedToOutput.function.js.map