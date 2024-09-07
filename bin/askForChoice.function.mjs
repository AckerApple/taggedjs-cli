import { askForChoiceObj } from "./askForChoiceObj.function.mjs";
// export type Choice = string | {name:string, value:string}
export async function askForChoice(choices, options) {
    options.name = options.name || 'result';
    return (await askForChoiceObj(choices, options))[options.name];
}
//# sourceMappingURL=askForChoice.function.mjs.map