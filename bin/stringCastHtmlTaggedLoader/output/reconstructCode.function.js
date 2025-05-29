// taggedjs-no-compile
import { string } from "../typings.js";
export function reconstructCode(parsedResults, allVarName, funName = 'html') {
    const allStrings = [];
    let allStringsIndex = 0;
    const transform = (item) => {
        if (typeof item === string) {
            return item;
        }
        if (item instanceof Array) {
            return item.map((x) => transform(x)).join('');
        }
        // html`` values handled here
        if (typeof item === 'object') {
            return reconstructHtml(funName, allVarName, item, allStrings, allStringsIndex, transform);
        }
    };
    const transformedCode = parsedResults.map(transform).join('');
    return {
        code: transformedCode,
        allStrings
    };
}
function reconstructHtml(funName, allVarName, item, allStrings, allStringsIndex, transform) {
    const { strings, values } = item;
    const slimStrings = strings.map((originalSource) => originalSource.replace(/>( )?\s*/g, '>$1').replace(/( )?\s*</g, '$1<'));
    allStrings.push({
        strings: slimStrings,
        valueCount: values.length,
    });
    const currentStringsIndex = allStringsIndex++;
    const transformedValues = values.map((value) => {
        if (typeof value === string) {
            return value;
        }
        else {
            return transform(value);
        }
    });
    if (!transformedValues.length) {
        return `${funName}(allStrings.${allVarName}[${currentStringsIndex}])`;
    }
    return `${funName}(allStrings.${allVarName}[${currentStringsIndex}], ${transformedValues.join(', ')})`;
}
//# sourceMappingURL=reconstructCode.function.js.map