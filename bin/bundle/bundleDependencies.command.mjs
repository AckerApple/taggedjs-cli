import * as path from 'path';
import { nameBundleDependenciesFor } from '../nameBundleDependenciesFor.function.mjs';
export const bundleDependencies = {
    vars: {},
    label: '🥡 bundle dependencies',
    command: {
        command: 'bundleDependencies',
        describe: 'When not using a compile process, this command updates your relative file JavaScript dependencies',
        handler,
    },
};
async function handler() {
    const fullJsonPath = path.join(process.cwd(), 'taggedjs.json');
    nameBundleDependenciesFor(fullJsonPath);
    console.log(`✅ Successfully bundled dependencies for non-compiling web code`);
}
//# sourceMappingURL=bundleDependencies.command.mjs.map