import * as path from "path";
import { bundleConfig } from "./bundle/bundleConfig.function.mjs";
import { readJsonFile } from "./readJsonFile.function.mjs";
import { getBaseConfig } from "./webpack.config.mjs";
import webpack from "webpack";
import fsExtra from "fs-extra/esm";
export async function nameBundleDependenciesFor(taggedjsJsonPath // fullpath
) {
    const rootPath = path.join(taggedjsJsonPath, '../');
    const taggedjsJson = readJsonFile(taggedjsJsonPath);
    const dependencies = taggedjsJson.dependencies;
    const promises = Object.entries(dependencies).map(async ([outName, dependency]) => {
        const packagePath = path.join(rootPath, dependency.entryPackage, 'package.json');
        const packConfig = getBaseConfig({
            ...dependency,
            entry: path.join(rootPath, dependency.entryPackage, dependency.entry),
            outDir: path.join(rootPath, dependency.outDir),
            outName: outName + '.js',
        });
        if (await fsExtra.pathExists(packagePath)) {
            const json = readJsonFile(packagePath);
            packConfig.plugins = [
                new webpack.BannerPlugin({
                    banner: `Version: ${json.version}`,
                    entryOnly: true,
                }),
            ];
        }
        bundleConfig(packConfig);
    });
    await Promise.all(promises);
}
//# sourceMappingURL=nameBundleDependenciesFor.function.mjs.map