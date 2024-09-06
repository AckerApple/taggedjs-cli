import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function getTaggedJsConfig(pathTo) {
    const taggedjsStampPath = path.join(__dirname, '../', 'taggedjs.stamp.json');
    const taggedjsString = fs.readFileSync(taggedjsStampPath).toString();
    const taggedjsJson = JSON.parse(taggedjsString);
    return taggedjsJson;
}
export function getConfig(pathTo = process.cwd()) {
    const taggedjsJson = getTaggedJsConfig(pathTo);
    const outDir = path.resolve(pathTo, taggedjsJson.outDir, 'assets', 'js');
    const entry = path.resolve(pathTo, taggedjsJson.entry); // : './src/index.ts'
    return getBaseConfig({ outDir, entry });
}
export function getBaseConfig({ entry, outDir, outName = 'bundle.js' }) {
    return {
        mode: 'development',
        devtool: 'source-map',
        entry,
        output: {
            filename: outName,
            path: outDir,
            // libraryTarget: 'module',
            chunkFormat: 'commonjs',
            // chunkFormat: 'module',
        },
        experiments: {
            outputModule: true,
        },
        target: 'node',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
            // taggedjs: path.resolve(dirname, '../main/ts'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
    };
}
//# sourceMappingURL=webpack.config.mjs.map