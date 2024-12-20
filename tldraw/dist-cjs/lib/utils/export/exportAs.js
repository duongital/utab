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
var exportAs_exports = {};
__export(exportAs_exports, {
  exportAs: () => exportAs
});
module.exports = __toCommonJS(exportAs_exports);
var import_editor = require("@tldraw/editor");
var import_export = require("./export");
async function exportAs(editor, ids, format = "png", name, opts = {}) {
  if (!name) {
    name = `shapes at ${getTimestamp()}`;
    if (ids.length === 1) {
      const first = editor.getShape(ids[0]);
      if (editor.isShapeOfType(first, "frame")) {
        name = first.props.name ?? "frame";
      } else {
        name = `${(0, import_editor.sanitizeId)(first.id)} at ${getTimestamp()}`;
      }
    }
  }
  name += `.${format}`;
  const blob = await (0, import_export.exportToBlob)({ editor, ids, format, opts });
  const file = new File([blob], name, { type: blob.type });
  downloadFile(file);
}
function getTimestamp() {
  const now = /* @__PURE__ */ new Date();
  const year = String(now.getFullYear()).slice(2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}.${minutes}.${seconds}`;
}
function downloadFile(file) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(file);
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
}
//# sourceMappingURL=exportAs.js.map
