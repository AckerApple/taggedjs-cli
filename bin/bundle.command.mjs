import { bundleConfig } from './bundleConfig.function.mjs';
import { getConfig, getTaggedJsConfig } from './webpack.config.mjs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
async function handler() {
    console.debug('🌎📦 bundling...');
    const pwd = process.cwd();
    await bundleTaggedJsPath(pwd);
    console.log(`✅ Successfully bundled taggedjs project`);
}
export const bundle = {
    vars: {},
    label: '📦 bundle',
    command: {
        command: 'bundle',
        describe: 'Creates web ready file',
        handler,
    },
};
export async function bundleTaggedJsPath(pwd) {
    const config = getConfig(pwd);
    await bundleConfig(config);
    const indexEntry = config.entry;
    const taggedConfig = getTaggedJsConfig(pwd);
    const entry = path.join(indexEntry, '../');
    const outDir = taggedConfig.outDir;
    const outPath = path.join(pwd, outDir);
    copyPasteRelativeList([
        'index.html',
        'assets',
    ], entry, outPath);
    return config;
}
function copyPasteRelativeList(list, fromPath, toPath) {
    list.forEach(name => {
        const fullPath = path.join(fromPath, name);
        const outPath = path.join(toPath, name);
        fsExtra.copy(fullPath, outPath);
    });
}
//# sourceMappingURL=bundle.command.mjs.map