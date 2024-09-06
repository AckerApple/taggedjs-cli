import { ParsedResults } from "./stringCastHtmlTagged.function.js";
type AllStrings = {
    strings: string[];
    valueCount: number;
};
export type Reconstructed = {
    code: string;
    allStrings: AllStrings[];
};
export declare function reconstructCode(parsedResults: ParsedResults, allVarName: string, funName?: string): Reconstructed;
export {};
