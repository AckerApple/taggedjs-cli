async function handler() {
    await run();
    console.log(`✅ Successfully bundled taggedjs project`);
}
async function run() {
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
//# sourceMappingURL=bundle.command.mjs.map