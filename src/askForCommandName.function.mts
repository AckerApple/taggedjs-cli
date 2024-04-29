import yargs, { ArgumentsCamelCase } from 'yargs'
import { askForChoiceObj } from './askForChoiceObj.function.mjs'

/** Used during interactive mode when command name not present */
export async function askForCommandName(
  interactiveOptions: {[commandName: string]: {label?: string, vars: any}},
  args: ArgumentsCamelCase<{
    interactive: boolean | undefined;
  }>
) {
  const choices = [
    { name: 'ℹ️ help', value: 'help' },
    ...Object.entries(interactiveOptions).map(([ops, config]) => {
      if (config.label) {
        return { name: config.label, value: ops }
      }

      return ops
    }),
  ]

  const answer = await askForChoiceObj(
    choices as any,
    {
      name: 'commandName',
      isPushValue: true,
    } as any
  )
  args._.push(answer.commandName)
  const isHelp = answer.commandName === 'help'

  if (isHelp) {
    // args._.push('test-data --help')
    process.argv.push('--help')
  }
  
  return isHelp ? '' : answer.commandName
}
