import Choice from 'inquirer/lib/objects/choice.js';
export declare class IGNORE {
}
/** Safe way to handle commands
 * We tried attaching middleware to main yargs but it would not work.
 * A separate yargs() calls occurs here just for argument management
 */
export declare function getInteractiveArgs(interactiveOptions: {
    [commandName: string]: {
        label?: string;
        vars: any;
    };
}): Promise<{
    [x: string]: unknown;
    interactive: boolean | undefined;
    _: (string | number)[];
    $0: string;
} | {
    [x: string]: unknown;
    interactive: boolean | undefined;
    _: (string | number)[];
    $0: string;
}>;
export type CommandVar = {
    name?: string;
    type?: 'boolean' | 'string';
    choices?: Choice[];
    message?: string;
    defaultValue?: string | number | unknown;
    demandOption?: boolean;
    /** Just before running you can check past choices */
    before?: (vars: CommandVars) => any;
    value?: unknown;
};
type ICommand = {
    command: string;
    describe: string;
    handler: (...args: any[]) => unknown;
};
export type CommandVars = Record<string, CommandVar>;
export type InteractiveCommand = {
    vars: CommandVars;
    label: string;
    command: ICommand;
};
export {};
