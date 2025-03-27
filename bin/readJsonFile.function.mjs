import * as fs from 'fs';
export function readJsonFile(filePath) {
    const taggedjsString = fs.readFileSync(filePath).toString();
    return JSON.parse(taggedjsString);
}
//# sourceMappingURL=readJsonFile.function.mjs.map