import { InteractiveCommand } from './command.utils.mjs'

async function handler() {
  await run()
  console.log(`✅ Successfully bundled taggedjs project`)
}

async function run() {
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
