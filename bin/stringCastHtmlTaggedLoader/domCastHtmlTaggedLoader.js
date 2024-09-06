"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domCastTagged_function_js_1 = __importDefault(require("./domCastTagged.function.js"));
function domCastHtmlTaggedLoader(source) {
    const resourcePath = this.resourcePath;
    return (0, domCastTagged_function_js_1.default)(source, resourcePath);
}
exports.default = domCastHtmlTaggedLoader;
//# sourceMappingURL=domCastHtmlTaggedLoader.js.map