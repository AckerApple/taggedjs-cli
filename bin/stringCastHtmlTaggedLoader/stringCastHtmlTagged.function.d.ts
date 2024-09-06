export type ParsedResult = {
    html: string;
    values?: unknown[];
    strings?: string[];
};
export type ParsedResults = ParsedResult[];
export declare const string = "string";
export declare function extractTemplateParts(parsedResults: ParsedResults): ParsedResults;
export declare function stringCastHtml(code: string): string | ParsedResults;
export declare function stringCastHtmlTagged(code: string, filePath: string): string | ParsedResults;
