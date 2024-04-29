"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const taggedjs_1 = require("taggedjs");
const app_tag_1 = require("./app.tag");
const run = () => {
    document.querySelectorAll('app').forEach(element => {
        (0, taggedjs_1.tagElement)(app_tag_1.app, element, {});
    });
};
exports.run = run;
