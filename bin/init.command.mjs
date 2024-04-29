import * as fsExtra from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as util from 'util';
import packageJson from './package.mjs';
import inquirer from 'inquirer';
import { IGNORE } from './command.utils.mjs';
const promiseExec = util.promisify(exec);
inquirer.prompt;
export const init = {
    vars: {
        language: {
            demandOption: true,
            type: 'string',
            defaultValue: 'typescript',
            choices: [{
                    name: 'ECMAScript - imports',
                    short: 'ecmascript',
                    value: 'ecmascript',
                    disabled: false
                }, {
                    name: 'JavaScript - requires',
                    short: 'javascript',
                    value: 'javascript',
                    disabled: false
                }, {
                    name: 'TypeScript - imports',
                    short: 'typescript',
                    value: 'typescript',
                    disabled: false,
                }],
        },
        projectName: {
            message: '🏗️ Project Name',
            demandOption: true,
            type: 'string',
        },
        folderName: {
            message: '📁 Folder Name',
            demandOption: true,
            type: 'string',
            before: (vars) => {
                vars.folderName.defaultValue = vars.projectName.value;
            }
        },
        bundle: {
            message: 'Include bundle step - creates src folder',
            demandOption: true,
            defaultValue: true,
            type: 'boolean',
            before: (vars) => {
                if (vars.language.value === 'typescript') {
                    return IGNORE;
                }
            }
        }
    },
    label: '💥 init',
    command: {
        command: 'init',
        describe: 'Create taggedjs driven project',
        handler,
    },
};
async function handler(args) {
    await run(args);
    console.log(`✅ Successfully initialized a taggedjs project`);
}
async function run(args) {
    const { folderName, projectName, language } = args;
    // Define folder name and package.json content
    const packageJsonContent = packageJson;
    packageJsonContent.name = projectName;
    // Create folder
    createFolder(folderName);
    // Create package.json file
    createPackageJson(folderName, packageJsonContent);
    const dependencies = { ...packageJsonContent.dependencies };
    if (language === 'typescript') {
        dependencies['typescript'] = '^5.3.3';
    }
    console.info('📦 Installing dependencies...');
    // Install npm packages
    await installPackages(folderName, Object.keys(dependencies));
    await copyProjectItems(args);
}
async function copyProjectItems({ language, folderName, bundle }) {
    let stamp = 'ts-stamp';
    switch (language) {
        case 'ecmascript':
            stamp = 'es-stamp';
            break;
        case 'javascript':
            stamp = 'js-stamp';
            break;
    }
    await copyItemsTo(stamp, folderName);

    console.info('📄 Preparing root folder files...');
    if (bundle === 'false') {
        await fsExtra.copy(path.join(folderName, 'src'), path.join(folderName));
        await fsExtra.remove(path.join(folderName, 'src'));
    }
    if (language === 'typescript') {
        await fsExtra.move(path.join(folderName, 'src', 'tsconfig.json'), path.join(folderName, 'tsconfig.json'), { overwrite: true });
    }
}
// Function to create a folder
const createFolder = (folderName) => {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
        console.log(`📁 Folder "${folderName}" created.`);
    }
    else {
        console.log(`📂 Folder "${folderName}" already exists.`);
    }
};
async function copyItemsTo(itemName, folderName) {
    await fsExtra.copy(itemName, path.join(folderName, 'src'));
}
// Function to create package.json file
const createPackageJson = (folderName, packageJsonContent) => {
    const filePath = `${folderName}/package.json`;
    fs.writeFileSync(filePath, JSON.stringify(packageJsonContent, null, 2));
    console.log(`package.json file created at "${filePath}".`);
};
// Function to install npm packages
async function installPackages(folderName, packages) {
    const command = `cd ${folderName} && npm install ${packages.join(' ')}`;
    const { stdout, stderr } = await promiseExec(command).catch((error) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        throw error;
    });
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    // install process report
    console.log(stdout);
}
//# sourceMappingURL=init.command.mjs.map