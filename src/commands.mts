import { init } from './init.command.mjs'
import { InteractiveCommand } from './command.utils.mjs'
import { bundle } from './bundle.command.mjs'

export const commands: {
  [name: string]: InteractiveCommand
} = {
  init, bundle
}
