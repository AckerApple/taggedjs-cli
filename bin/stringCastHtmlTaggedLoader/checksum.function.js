function checksum(str) {
    let checksum = 0;
    for (let i = 0; i < str.length; i++) {
        checksum += str.charCodeAt(i);
    }
    return checksum;
}
export function checkSumParseResults(finalResults) {
    const stringsConcat = parsedResultsToStringArray(finalResults);
    const stringChecksum = checksum(stringsConcat);
    return stringChecksum;
}
export function parsedResultsToStringArray(finalResults) {
    const stringsConcat = typeof finalResults === 'string' ? finalResults : finalResults.reduce((all, x) => {
        const strings = x.strings;
        if (strings === undefined) {
            all.push(x);
            return all;
        }
        const html = x.html;
        all.push(html);
        // all.push( strings.join('') )
        return all;
    }, []).join('');
    return stringsConcat;
}
//# sourceMappingURL=checksum.function.js.map