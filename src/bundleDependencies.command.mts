import * as fsExtra from 'fs-extra'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import * as util from 'util'
import packageJson from './package.mjs'
import inquirer from 'inquirer'
import { IGNORE, InteractiveCommand } from './command.utils.mjs'
import { readJsonFile } from './readJsonFile.function.mjs'
import { nameBundleDependenciesFor } from './nameBundleDependenciesFor.function.mjs'

export const bundleDependencies: InteractiveCommand = {
  vars: {
  },
  label: '🥡 bundle dependencies',
  command: {
    command: 'bundleDependencies',
    describe: 'When not using a compile process, this command updates your relative file JavaScript dependencies',
    handler,
  } as any,
}

async function handler() {
  const fullJsonPath = path.join(process.cwd(), 'taggedjs.json')
  nameBundleDependenciesFor(fullJsonPath)
  console.log(`✅ Successfully bundled dependencies for non-compiling web code`)
}
