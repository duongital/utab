"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var version_exports = {};
__export(version_exports, {
  publishDates: () => publishDates,
  version: () => version
});
module.exports = __toCommonJS(version_exports);
const version = "3.5.1";
const publishDates = {
  major: "2024-09-13T14:36:29.063Z",
  minor: "2024-11-26T11:43:05.889Z",
  patch: "2024-11-30T22:04:36.728Z"
};
//# sourceMappingURL=version.js.map
