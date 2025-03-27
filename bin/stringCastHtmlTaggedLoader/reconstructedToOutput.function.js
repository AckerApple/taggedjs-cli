// taggedjs-no-compile
import { getDomMeta } from "taggedjs/js/tag/domMetaCollector.js";
import { domMetaArrayToOutput } from "./domMetaArrayToOutput.function.js";
export function reconstructedToOutput(reconstructed, varName, filePath) {
    const allDom = reconstructed.allStrings.map((data) => {
        const { strings, valueCount } = data;
        const values = [];
        if (valueCount) {
            values.push(...','.repeat(valueCount - 1).split(','));
        }
        const map = getDomMeta(strings, values);
        return map;
    });
    return domMetaArrayToOutput(reconstructed, allDom, varName, filePath);
}
//# sourceMappingURL=reconstructedToOutput.function.js.map