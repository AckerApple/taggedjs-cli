// taggedjs-no-compile
import { string } from "./typings.js";
export function reconstructCode(parsedResults, allVarName, funName = 'html') {
    const allStrings = [];
    let allStringsIndex = 0;
    const transform = (item) => {
        if (typeof item === string) {
            return item;
        }
        else if (item instanceof Array) {
            return item.map((x) => {
                return transform(x);
            }).join('');
        }
        else if (typeof item === 'object') {
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
    };
    const transformedCode = parsedResults.map(transform).join('');
    return {
        code: transformedCode,
        allStrings
    };
}
//# sourceMappingURL=reconstructCode.function.js.map