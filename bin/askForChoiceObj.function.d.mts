import Choice from 'inquirer/lib/objects/choice.js';
export declare function askForChoiceObj(choices: Choice[] | {
    name: string;
    value: string;
}[], { message, isPushValue, defaultValue, name }?: {
    name: string;
    message: string;
    isPushValue: boolean;
    defaultValue: string;
}): Promise<any>;
