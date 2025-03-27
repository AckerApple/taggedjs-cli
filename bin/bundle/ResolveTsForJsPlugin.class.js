export class ResolveTsForJsPlugin {
    apply(compiler) {
        // Access the normal module factory
        compiler.hooks.normalModuleFactory.tap("ResolveTsForJsPlugin", (nmf) => {
            nmf.hooks.beforeResolve.tapAsync("ResolveTsForJsPlugin", (resolveData, callback) => {
                if (!resolveData)
                    return callback();
                const isTsSourceFile = resolveData.contextInfo.issuer.search(/\.ts$/) > 0;
                // Check if the request ends with '.js'
                if (isTsSourceFile && resolveData.request.endsWith('.js')) {
                    // Change the request from .js to .ts without returning it
                    resolveData.request = resolveData.request.replace(/\.js$/, '.ts');
                }
                // Continue the process without returning the object
                callback();
            });
        });
    }
}
export default ResolveTsForJsPlugin;
//# sourceMappingURL=ResolveTsForJsPlugin.class.js.map