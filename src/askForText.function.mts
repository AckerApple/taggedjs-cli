import { CommandVars } from './command.utils.mjs'

// import inquirer from 'inquirer'
const inquirerPromise = import('inquirer')

export async function askForText(
  message: string,
  { defaultValue, demandOption }: CommandVars,
) {
  // const inquirer = (await import('inquirer')).default
  const inquirer = (await inquirerPromise).default

  const commandNameOption: any = {
    type: 'input',
    name: 'inputText',
    message: message + ':',
    default: defaultValue,
  }

  if(demandOption) {
    const validator = (input: string) => input.trim() !== '' ? true : 'Input cannot be empty.'
    commandNameOption.validate = commandNameOption.validate || validator
  }

  const answer = await inquirer.prompt([commandNameOption])
  return answer.inputText
}
