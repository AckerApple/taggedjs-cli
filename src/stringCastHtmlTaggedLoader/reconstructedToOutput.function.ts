// taggedjs-no-compile

import { Reconstructed } from "./reconstructCode.function.js"
import { getDomMeta } from "taggedjs/js/tag/domMetaCollector.js"
import { domMetaArrayToOutput } from "./domMetaArrayToOutput.function.js"

export function reconstructedToOutput(
  reconstructed: Reconstructed,
  varName: string,
  filePath: string,
) {  
  const allDom = reconstructed.allStrings.map((data) => {
    const {strings, valueCount} = data
    const values: any[] = []
    
    if(valueCount) {
      values.push(...','.repeat(valueCount - 1).split(','))
    }
    
    const map = getDomMeta(strings, values)
    return map
  })

  return domMetaArrayToOutput(reconstructed, allDom, varName, filePath)
}
