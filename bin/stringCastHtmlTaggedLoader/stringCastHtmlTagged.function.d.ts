import { ParsedResults } from "./typings.js";
export declare function extractTemplateParts(parsedResults: ParsedResults): ParsedResults;
export declare function stringCastHtml(code: string): string | ParsedResults;
export declare function stringCastHtmlTagged(code: string, filePath: string): string | ParsedResults;
