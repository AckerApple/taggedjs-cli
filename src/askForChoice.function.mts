import Choice from "inquirer/lib/objects/choice.js"
import { askForChoiceObj } from "./askForChoiceObj.function.mjs"

// export type Choice = string | {name:string, value:string}

export async function askForChoice(
  choices: Choice[],
  options: any,
) {
  options.name = options.name || 'result'
  return (await askForChoiceObj(choices, options))[options.name]
}
