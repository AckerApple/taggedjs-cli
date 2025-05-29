import { ParsedResults } from "./typings.js";
/** Loop parsed items to clone them. Maybe useless?
 * TODO: this function seem useless or its just cloning? */
export declare function extractTemplateParts(parsedResults: ParsedResults): ParsedResults;
export declare function stringCastHtml(code: string): string | ParsedResults;
/** Entire file string parsing starts here */
export declare function stringCastHtmlTagged(code: string, filePath: string): string | ParsedResults;
