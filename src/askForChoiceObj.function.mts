import inquirer from 'inquirer'
import Choice from 'inquirer/lib/objects/choice.js'
// const inquirerPromise = import('inquirer')

export async function askForChoiceObj(
  choices: Choice[] | {name: string, value:string}[],
  { message, isPushValue, defaultValue, name } = {
    name: 'result',
    message: 'Choose one',
    isPushValue: false,
    defaultValue: '',
  }
) {
  const commandNameOption = {
    type: 'list',
    name,
    message,
    default: defaultValue,
    isPushValue, // make the name/value pair become a process.env variable
    choices,
  }

  // const inquirer = (await import('inquirer')).default // ES module
  // const inquirer = (await inquirerPromise).default
  const answer = await inquirer.prompt([commandNameOption])

  return answer
}
