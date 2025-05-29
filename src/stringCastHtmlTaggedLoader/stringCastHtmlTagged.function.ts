// taggedjs-no-compile

import { checkSumParseResults } from "./checksum.function.js"
import { parseHtmlTemplates } from "./parseHtmlTemplates.function.js"
import { reconstructCode } from "./output/reconstructCode.function.js"
import { ParsedResult, ParsedResults, string } from "./typings.js";

/** Loop parsed items to clone them. Maybe useless?
 * TODO: this function seem useless or its just cloning? */
export function extractTemplateParts(parsedResults: ParsedResults): ParsedResults {
  return parsedResults.map(item => {
    if (typeof item === string) {
      return item;
    } else {
      const { html, strings, values } = item;
      return { html, strings, values };
    }
  });
}

/** Loop parsed results looking for html`` to parse */
function recursiveTemplateParse(
  parsedResults: ParsedResults
): ParsedResults {
  const recurseValues = (values: string[]) => {
    return values.map(value => {
      if (value.includes('html`')) {
        const parsed = parseHtmlTemplates(value)
        const result = parseHtmlResults(value, parsed)
        return result
      }
      return value;
    });
  };

  return parsedResults.map(item => {
    if(typeof item === 'object') {
      if (item.html) {
        item.values = recurseValues(item.values as string[]);
      }
    }

    return item;
  });
}

export function stringCastHtml(code: string) {
  const parsedResults = parseHtmlTemplates(code);
  return parseHtmlResults(code, parsedResults)
}

function parseHtmlResults(
  code: string,
  parsedResults: (string | ParsedResult)[]
) {
  if (parsedResults.every((template: any) => typeof template === string)) {
    return code;
  }
  const detailedResults = extractTemplateParts(parsedResults as any);
  return recursiveTemplateParse(detailedResults);
}

/** Entire file string parsing starts here */
export function stringCastHtmlTagged(
  code: string,
  filePath: string
) {
  // return code
  if(code.includes('taggedjs-no-compile')) {
    return code
  }

  const finalResults = stringCastHtml(code)

  if(typeof finalResults === string) {
    return finalResults
  }

  const stringChecksum = checkSumParseResults(finalResults)
  // create a variableName that will change based on sum of content (helps HMR detect changes to tag functions)
  const allVarName = `allStrings${stringChecksum}`

  const reconstructed = reconstructCode(finalResults as ParsedResults, allVarName)

  const allStringJson = JSON.stringify(reconstructed.allStrings)
  const allStrings = `\nconst allStrings: (string[])[] = {${allVarName}: ${allStringJson}}`;
  const output = reconstructed.code + allStrings;

  return output;
}
