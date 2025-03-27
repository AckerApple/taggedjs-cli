import * as fsExtra from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as util from 'util';
import packageJson from './package.mjs';
import inquirer from 'inquirer';
import { IGNORE } from './command.utils.mjs';
import { readJsonFile } from './readJsonFile.function.mjs';
import { nameBundleDependenciesFor } from './nameBundleDependenciesFor.function.mjs';
import { bundleTaggedJsPath } from './bundle/bundle.command.mjs';
const promiseExec = util.promisify(exec);
inquirer.prompt;
export const newCommand = {
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
    label: '💥 new',
    command: {
        command: 'new',
        describe: 'Create taggedjs driven project',
        handler,
    },
};
async function handler(args) {
    await run({
        ...args,
        bundle: args.bundle === 'false' ? false : true
    });
    console.log(`✅ Successfully initialized a taggedjs project`);
}
async function run(args) {
    const { folderName, projectName, language, } = args;
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
        dependencies['ts-loader'] = '^9.5.1';
    }
    console.info('📦 Installing dependencies...');
    // Install npm packages
    await installPackages(folderName, Object.keys(dependencies));
    await copyProjectItems(args);
}
async function copyProjectItems({ language, folderName, bundle, }) {
    let stamp = 'ts-stamp';
    switch (language) {
        case 'ecmascript':
            stamp = 'es-stamp';
            break;
        case 'javascript':
            stamp = 'js-stamp';
            break;
    }
    const promises = [];
    promises.push(fsExtra.copy(stamp, path.join(folderName, 'src')));
    console.info('📄 Preparing root folder files...');
    const src = 'src';
    const srcDynamic = bundle ? src : '';
    promises.push(fsExtra.copy('.gitignore', path.join(folderName, '.gitignore')), fsExtra.copy('.vscode', path.join(folderName, '.vscode')));
    if (!bundle) {
        await fsExtra.copy(path.join(folderName, src), path.join(folderName));
        await fsExtra.remove(path.join(folderName, src));
    }
    if (language === 'typescript') {
        promises.push(fsExtra.copy(path.join('tsconfig.stamp.json'), path.join(folderName, 'tsconfig.json'), { overwrite: true }));
    }
    const taggedjsJson = readJsonFile('taggedjs.stamp.json');
    if (['javascript', 'ecmascript'].includes(language)) {
        taggedjsJson.entry = path.join('./', srcDynamic, 'index.js');
    }
    if (!bundle) {
        taggedjsJson.dependencies = {
            taggedjs: {
                entryPackage: './node_modules/taggedjs',
                entry: './js/index.js',
                outDir: ''
            },
            'taggedjs-animate-css': {
                // variableName: 'taggedjsAnimateCss',
                entryPackage: './node_modules/taggedjs-animate-css',
                entry: './js/index.js',
                outDir: ''
            },
            'taggedjs-dump': {
                // variableName: 'taggedjsDump',
                entryPackage: './node_modules/taggedjs-dump',
                entry: './js/index.js',
                outDir: ''
            }
        };
    }
    const taggedjsJsonPath = path.join(folderName, 'taggedjs.json');
    fs.writeFileSync(taggedjsJsonPath, JSON.stringify(taggedjsJson, null, 2));
    const fullFolderPath = path.join(process.cwd(), folderName);
    if (bundle) {
        promises.push(bundleTaggedJsPath(fullFolderPath));
    }
    else {
        const fullJsonPath = path.join(process.cwd(), taggedjsJsonPath);
        promises.push(nameBundleDependenciesFor(fullJsonPath));
    }
    await Promise.all(promises);
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
//# sourceMappingURL=new.command.mjs.map