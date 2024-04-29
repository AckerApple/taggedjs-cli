"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const taggedjs_1 = require("taggedjs");
exports.app = (0, taggedjs_1.tag)(() => {
    return (0, taggedjs_1.html) `
    hello world
  `;
});
