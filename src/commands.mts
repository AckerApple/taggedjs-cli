// import { init } from './new.command.mjs'
import * as path from 'path'
import fsExtra, { readJSON } from "fs-extra/esm"
import { newCommand } from './new.command.mjs'
import { bundleDependencies } from './bundleDependencies.command.mjs'
import { InteractiveCommand } from './command.utils.mjs'
import { bundle } from './bundle.command.mjs'

export const commands: {
  [name: string]: InteractiveCommand
} = {
  // init,
  new: newCommand,
}

const taggedjsPath = path.join(process.cwd(),'taggedjs.json')
const exists = await fsExtra.pathExists(taggedjsPath)

if(exists) {
  const taggedjsJson = await readJSON(taggedjsPath)
  commands.bundle = bundle

  if( taggedjsJson.dependencies ) {
    commands.bundleDependencies = bundleDependencies
  }
} else {
  console.info('')
  console.info('🆕 create project mode')
  console.info('')
}