import webpack from 'webpack';
export function bundleConfig(config) {
    const compiler = webpack(config);
    return runBundle(compiler);
}
function runBundle(compiler) {
    return new Promise(async (res, rej) => {
        compiler.run((err, stats) => {
            if (err) {
                console.error('🌎📦 🔴 bundle error', Object.keys(err));
                return rej({});
            }
            if (stats && stats.compilation.errors.length) {
                const error = stats.compilation.errors[0];
                console.error('🌎📦 🔴 compilation bundle error', error.message, error.module?._errors, {
                    compilerPath: compiler.compilerPath,
                    outputPath: compiler.outputPath,
                });
                return rej({} /*error*/);
            }
            res(stats);
            if (stats) {
                const assets = stats.compilation.assets;
                console.debug('🌎📦 ✅ bundled sizes in kilobytes', Object.entries(assets).reduce((all, [name, value]) => {
                    all[name] = value.size() / 1000;
                    return all;
                }, {}));
            }
        });
    });
}
//# sourceMappingURL=bundleConfig.function.mjs.map