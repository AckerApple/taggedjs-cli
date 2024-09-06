import * as fs from 'fs'

export function readJsonFile(filePath: string) {
  const taggedjsString = fs.readFileSync(filePath).toString()
  return JSON.parse(taggedjsString)
}