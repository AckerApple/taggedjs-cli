import { ParsedResult } from "./typings.js"

export function removeInterpolatedValues(input: string) {
    const strings: string[] = [];
    const values: string[] = [];
    let lastIndex = 0;
    let index = 0;

    while (index < input.length) {
        if (input[index] === '$' && input[index + 1] === '{') {
            strings.push(input.substring(lastIndex, index));
            index += 2; // Skip over ${

            let braceCount = 1;
            let valueStart = index;
            let inString = false;
            let stringChar = '';

            while (index < input.length && braceCount > 0) {
                const char = input[index];

                if (inString) {
                    if (char === stringChar) {
                        inString = false;
                    }
                } else {
                    if (char === '"' || char === "'") {
                        inString = true;
                        stringChar = char;
                    } else if (char === '{') {
                        braceCount++;
                    } else if (char === '}') {
                        braceCount--;
                    }
                }

                index++;
            }

            const valueContent = input.substring(valueStart, index - 1).trim();
            values.push(valueContent);
            lastIndex = index;
        } else {
            index++;
        }
    }

    if (lastIndex < input.length) {
        strings.push(input.substring(lastIndex));
    }

    return { strings, values };
}

export function parseHtmlTemplates(code: string): (string | ParsedResult)[] {
    const results: (string | ParsedResult)[] = [];
    let lastIndex = 0;
    let index = 0;

    while (index < code.length) {
        if (code.startsWith('html`', index)) {
            if (index > lastIndex) {
                results.push(code.substring(lastIndex, index));
            }

            index += 5; // Skip over html`
            const start = index;
            let braceCount = 1;

            while (index < code.length && braceCount > 0) {
                if (code[index] === '`') {
                    braceCount--;
                } else if (code[index] === '$' && code[index + 1] === '{') {
                    index += 2;
                    let nestedBraceCount = 1;
                    while (index < code.length && nestedBraceCount > 0) {
                        if (code[index] === '{') {
                            nestedBraceCount++;
                        } else if (code[index] === '}') {
                            nestedBraceCount--;
                        }
                        index++;
                    }
                } else {
                    index++;
                }
            }

            const parsedHtml = code.substring(start, index);
            const { strings, values } = removeInterpolatedValues(parsedHtml);

            const nestedResults = values.map(value => {
                if (value.startsWith('html`') && value.endsWith('`')) {
                    return value;
                }
                return value;
            });

            results.push({ html: parsedHtml, strings, values: nestedResults });
            lastIndex = index + 1;
        } else {
            index++;
        }
    }

    if (lastIndex < code.length) {
        results.push(code.substring(lastIndex));
    }

    return results;
}