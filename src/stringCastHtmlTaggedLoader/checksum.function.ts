import { ParsedResults } from './typings.js'

function checksum(str: string) {
  let checksum = 0;
  for (let i = 0; i < str.length; i++) {
    checksum += str.charCodeAt(i)
  }
  return checksum
}

export function checkSumParseResults(
  finalResults: string | ParsedResults
) {
  const stringsConcat = parsedResultsToStringArray(finalResults)
  
  const stringChecksum = checksum(stringsConcat)
  return stringChecksum
}

export function parsedResultsToStringArray(
  finalResults: string | ParsedResults
) {
  const stringsConcat = typeof finalResults === 'string' ? finalResults : finalResults.reduce((all, x) =>  {
    const strings = x.strings as string[]
    if(strings === undefined) {
      all.push( x as unknown as string )
      return all
    }

    const html = x.html
    all.push( html )
    // all.push( strings.join('') )

    return all
  }, [] as string[]).join('')

  return stringsConcat
}
