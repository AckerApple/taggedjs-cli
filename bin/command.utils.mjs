import yargs from 'yargs';
import { askForCommandName } from './askForCommandName.function.mjs';
import { askForChoice } from './askForChoice.function.mjs';
import { askForConfirm } from './askForConfirm.function.mjs';
import { askForText } from './askForText.function.mjs';
export class IGNORE {
}
/** Safe way to handle commands
 * We tried attaching middleware to main yargs but it would not work.
 * A separate yargs() calls occurs here just for argument management
 */
export async function getInteractiveArgs(interactiveOptions) {
    const yargv = yargs()
        .option('interactive', {
        alias: 'i',
        type: 'boolean',
        description: 'Enables interaction via terminal',
    })
        .exitProcess(false)
        // .completion('completion')
        .parse(process.argv.slice(2));
    await interactiveMiddleware(yargv, interactiveOptions);
    return yargv;
}
async function interactiveMiddleware(args, interactiveOptions) {
    let commandName = args._[0]; // The first positional argument, which will be the command name regardless of where it is in argv
    if (!commandName) {
        commandName = await askForCommandName(interactiveOptions, args);
    }
    if (commandName) {
        const command = interactiveOptions[commandName];
        if (!command) {
            return process.argv; // no need to run
        }
        process.argv.push(commandName);
        const vars = command.vars;
        const interactives = { ...vars };
        const values = Object.values(interactives);
        if (values.length) {
            const answers = {};
            // loop each "vars" definition and interactively ask for answers to each arg var
            for (const arg of values) {
                if (arg.before) {
                    const result = arg.before(interactives);
                    if (result === IGNORE) {
                        arg.value = undefined;
                        continue;
                    }
                }
                const name = arg.name;
                if (arg.choices) {
                    answers[name] = await askForChoice(arg.choices, arg);
                }
                else if (arg.type === 'boolean') {
                    answers[name] = await askForConfirm(arg.message || name, arg);
                }
                else {
                    answers[name] = await askForText(arg.message || name, arg);
                }
                arg.value = answers[name];
            }
            // make the answers appears as process.argv items
            pushAnswers(answers, interactives, process.argv);
        }
    }
    return process.argv;
}
// pushes command prompt answers onto the process.argv array
function pushAnswers(answers, config, args) {
    Object.entries(answers).forEach(([key, value]) => {
        if (config[key].isPushValue) {
            args.push(value);
        }
        else {
            args.push(`--${key}`, value);
        }
    });
}
//# sourceMappingURL=command.utils.mjs.map