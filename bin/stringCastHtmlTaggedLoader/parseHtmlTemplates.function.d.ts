import { ParsedResult } from "./typings.js";
export declare function removeInterpolatedValues(input: string): {
    strings: string[];
    values: string[];
};
export declare function parseHtmlTemplates(code: string): (string | ParsedResult)[];
