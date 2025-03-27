import { ArgumentsCamelCase } from 'yargs';
/** Used during interactive mode when command name not present */
export declare function askForCommandName(interactiveOptions: {
    [commandName: string]: {
        label?: string;
        vars: any;
    };
}, args: ArgumentsCamelCase<{
    interactive: boolean | undefined;
}>): Promise<any>;
