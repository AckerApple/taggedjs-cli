// taggedjs-no-compile

import { ParsedResults, string } from "../typings.js"

type AllStrings = {
  strings:string[]
  valueCount: number
}

export type Reconstructed = {
  code: string,
  allStrings: AllStrings[],
}

export function reconstructCode(
  parsedResults: ParsedResults,
  allVarName: string,
  funName = 'html',
): Reconstructed {
  const allStrings: AllStrings[] = []
  let allStringsIndex = 0

  const transform = (item: any): any => {
    if (typeof item === string) {
      return item
    }
    
    if (item instanceof Array) {
      return item.map((x: any) => transform(x)).join('')
    }
    
    // html`` values handled here
    if (typeof item === 'object') {
      return reconstructHtml(funName, allVarName, item, allStrings, allStringsIndex, transform)
    }
  }

  const transformedCode = parsedResults.map(transform).join('')

  return {
    code: transformedCode,
    allStrings
  }
}

function reconstructHtml(
  funName: string,
  allVarName: string,
  item: any,
  allStrings: AllStrings[],
  allStringsIndex: number,
  transform: (item: any) => any,
) {
  const { strings, values } = item
  const slimStrings: string[] = strings.map((originalSource: string) =>
    originalSource.replace(/>( )?\s*/g, '>$1').replace(/( )?\s*</g, '$1<')
  )
  
  allStrings.push({
    strings: slimStrings,
    valueCount: values.length,
  })
  const currentStringsIndex = allStringsIndex++

  const transformedValues = values.map((value: unknown) => {
    if (typeof value === string) {
      return value
    } else {
      return transform(value)
    }
  })

  if(!transformedValues.length) {
    return `${funName}(allStrings.${allVarName}[${currentStringsIndex}])`
  }

  return `${funName}(allStrings.${allVarName}[${currentStringsIndex}], ${transformedValues.join(', ')})`
}