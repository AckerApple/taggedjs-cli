import { bundleConfig } from './bundleConfig.function.mjs'
import { InteractiveCommand } from './command.utils.mjs'
import { getConfig, getTaggedJsConfig } from './webpack.config.mjs'
import * as fsExtra from 'fs-extra'
import * as path from 'path'

async function handler() {
  console.debug('🌎📦 bundling...')
  const pwd = process.cwd()
  await bundleTaggedJsPath(pwd)  
  console.log(`✅ Successfully bundled taggedjs project`)
}

export const bundle: InteractiveCommand = {
  vars: {},
  label: '📦 bundle',
  command: {
    command: 'bundle',
    describe: 'Creates web ready file',
    handler,
  } as any,
}

export async function bundleTaggedJsPath(pwd: string) {
  const config = getConfig(pwd)
  await bundleConfig(config)

  const indexEntry = config.entry as string
  const taggedConfig = getTaggedJsConfig(pwd)
  const entry = path.join(indexEntry, '../')
  const outDir = taggedConfig.outDir
  const outPath  = path.join(pwd, outDir)
  copyPasteRelativeList([
    'index.html',
    'assets',
  ], entry, outPath)

  return config
}

function copyPasteRelativeList(
  list: string[],
  fromPath: string,
  toPath: string,
) {
  list.forEach(name => {
    const fullPath = path.join(fromPath, name)
    const outPath = path.join(toPath, name)
    fsExtra.copy(fullPath, outPath)
  })
}
