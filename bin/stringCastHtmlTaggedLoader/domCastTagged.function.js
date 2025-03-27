// taggedjs-no-compile
import { checkSumParseResults } from "./checksum.function.js";
import { reconstructCode } from "./reconstructCode.function.js";
import { reconstructedToOutput } from "./reconstructedToOutput.function.js";
import { string } from "./typings.js";
import { stringCastHtml } from "./stringCastHtmlTagged.function.js";
export default function domCastTagged(code, filePath) {
    // return code
    if (code.includes('taggedjs-no-compile')) {
        return code;
    }
    const finalResults = stringCastHtml(code);
    // was not intended to be parsed
    if (typeof finalResults === string) {
        return finalResults;
    }
    const stringChecksum = checkSumParseResults(finalResults);
    // create a variableName that will change based on sum of content (helps HMR detect changes to tag functions)
    const allVarName = `allStrings${stringChecksum}`;
    const reconstructed = reconstructCode(finalResults, allVarName, 'html.dom');
    return reconstructedToOutput(reconstructed, allVarName, filePath);
}
//# sourceMappingURL=domCastTagged.function.js.map