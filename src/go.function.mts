import yargs from 'yargs'
import { CommandVar, getInteractiveArgs } from "./command.utils.mjs"
import { commands } from "./commands.mjs"

export async function go() {

  // default set the "label" property of interactive options
  Object.values(commands).forEach((config) =>
    Object.entries(config.vars || {} as CommandVar).forEach(
      ([key, option]: [string, any]) => (option.name = option.name || key)
    )
  )

  const isInteractive = process.argv.includes('-i')
  
  isInteractive
    ? await getInteractiveArgs(commands)
    : process.argv.slice(2)

  if(isInteractive) {
    process.argv = process.argv.filter(arg => arg !== '-i')
  }

  const args = process.argv.slice(2)

  if (!args.length) {
    args.push('--help')
  }

  let myYargs = yargs()
  .scriptName('tj')
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Enable request logging',
  })

  Object.entries(commands).forEach(([key]) => {
    const command = (commands as any)[key].command
    myYargs = myYargs.command(command)
  })
  
  return myYargs.command({
    command: 'help',
    describe: 'help',
    handler: (args) => {
      args.push('--help')
    },
  })
  // .strictCommands()
  .demandCommand(1)
  //.parse(process.argv.slice(2))
  .completion('completion')
  .fail((msg, err, yargs) => {
    if (err) {
      throw err
    }

    if (msg) {
      console.error(msg)
      yargs.showHelp()
    }

    process.exit(1)
  })
  .parse(args)
}
