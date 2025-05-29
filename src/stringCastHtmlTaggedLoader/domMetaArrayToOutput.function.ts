import { ParsedHtml } from "taggedjs"
import { Reconstructed } from "./output/reconstructCode.function.js"

export function domMetaArrayToOutput(
  reconstructed: Reconstructed,
  allDom: ParsedHtml[],
  varName: string,
  filePath: string,
) {
  const outputVarString = customStringify(allDom)
  const allStrings = `\n// @ts-ignore\nconst allStrings = {${varName}:${outputVarString}}`
  const output = reconstructed.code + allStrings
  return output;
}

function customStringify(obj: ParsedHtml[]) { 
  const funStrings = obj.map(o => JSON.stringify(o))
  const jsonString = '[' + funStrings.join(',') + ']'

  return jsonString.replace(/"__isFunction\*\*(.*?)\*\*isFunction__"/g, (match, p1) => {
      return p1 // .replace(/\\"/g, '"').replace(/\\n/g, '\n');
  });
}