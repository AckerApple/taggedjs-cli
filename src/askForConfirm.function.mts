//import inquirer from 'inquirer'
const inquirerPromise = import('inquirer')

export async function askForConfirm(
  message: string,
  { defaultValue }: any = { defaultValue: 'yes' },
) {
  // const inquirer = (await import('inquirer')).default
  const inquirer = (await inquirerPromise).default

  const commandNameOption = {
    type: 'list',
    name: 'confirm',
    message,
    default: defaultValue || 'yes',
    choices: ['yes', 'no'],
  }

  const answer = await inquirer.prompt([commandNameOption])
  return answer.confirm === 'yes' ? true : false
}
