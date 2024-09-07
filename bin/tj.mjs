#!./node_modules/.bin/ts-node
import { go } from './go.function.mjs';
go().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=tj.mjs.map