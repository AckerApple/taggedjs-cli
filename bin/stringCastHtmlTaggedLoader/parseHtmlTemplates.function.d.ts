import { ParsedResult } from "./typings.js";
export declare function removeInterpolatedValues(input: string): {
    strings: string[];
    values: string[];
};
/** Read entire string looking for html`` to parse against */
export declare function parseHtmlTemplates(code: string): (string | ParsedResult)[];
