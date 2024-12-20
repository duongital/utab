"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var useTools_exports = {};
__export(useTools_exports, {
  ToolsContext: () => ToolsContext,
  ToolsProvider: () => ToolsProvider,
  useTools: () => useTools
});
module.exports = __toCommonJS(useTools_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var React = __toESM(require("react"));
var import_EmbedDialog = require("../components/EmbedDialog");
var import_dialogs = require("../context/dialogs");
var import_events = require("../context/events");
var import_useInsertMedia = require("./useInsertMedia");
const ToolsContext = React.createContext(null);
function ToolsProvider({ overrides, children }) {
  const editor = (0, import_editor.useEditor)();
  const trackEvent = (0, import_events.useUiEvents)();
  const { addDialog } = (0, import_dialogs.useDialogs)();
  const insertMedia = (0, import_useInsertMedia.useInsertMedia)();
  const tools = React.useMemo(() => {
    const toolsArray = [
      {
        id: "select",
        label: "tool.select",
        icon: "tool-pointer",
        kbd: "v",
        readonlyOk: true,
        onSelect(source) {
          if (editor.isIn("select")) {
            const currentNode = editor.root.getCurrent();
            currentNode.exit({}, currentNode.id);
            currentNode.enter({}, currentNode.id);
          }
          editor.setCurrentTool("select");
          trackEvent("select-tool", { source, id: "select" });
        }
      },
      {
        id: "hand",
        label: "tool.hand",
        icon: "tool-hand",
        kbd: "h",
        readonlyOk: true,
        onSelect(source) {
          editor.setCurrentTool("hand");
          trackEvent("select-tool", { source, id: "hand" });
        }
      },
      {
        id: "eraser",
        label: "tool.eraser",
        icon: "tool-eraser",
        kbd: "e",
        onSelect(source) {
          editor.setCurrentTool("eraser");
          trackEvent("select-tool", { source, id: "eraser" });
        }
      },
      {
        id: "draw",
        label: "tool.draw",
        icon: "tool-pencil",
        kbd: "d,b,x",
        onSelect(source) {
          editor.setCurrentTool("draw");
          trackEvent("select-tool", { source, id: "draw" });
        }
      },
      ...[...import_editor.GeoShapeGeoStyle.values].map((id) => ({
        id,
        label: `tool.${id}`,
        meta: {
          geo: id
        },
        kbd: id === "rectangle" ? "r" : id === "ellipse" ? "o" : void 0,
        icon: "geo-" + id,
        onSelect(source) {
          editor.run(() => {
            editor.setStyleForNextShapes(import_editor.GeoShapeGeoStyle, id);
            editor.setCurrentTool("geo");
            trackEvent("select-tool", { source, id: `geo-${id}` });
          });
        }
      })),
      {
        id: "arrow",
        label: "tool.arrow",
        icon: "tool-arrow",
        kbd: "a",
        onSelect(source) {
          editor.setCurrentTool("arrow");
          trackEvent("select-tool", { source, id: "arrow" });
        }
      },
      {
        id: "line",
        label: "tool.line",
        icon: "tool-line",
        kbd: "l",
        onSelect(source) {
          editor.setCurrentTool("line");
          trackEvent("select-tool", { source, id: "line" });
        }
      },
      {
        id: "frame",
        label: "tool.frame",
        icon: "tool-frame",
        kbd: "f",
        onSelect(source) {
          editor.setCurrentTool("frame");
          trackEvent("select-tool", { source, id: "frame" });
        }
      },
      {
        id: "text",
        label: "tool.text",
        icon: "tool-text",
        kbd: "t",
        onSelect(source) {
          editor.setCurrentTool("text");
          trackEvent("select-tool", { source, id: "text" });
        }
      },
      {
        id: "asset",
        label: "tool.asset",
        icon: "tool-media",
        kbd: "$u",
        onSelect(source) {
          insertMedia();
          trackEvent("select-tool", { source, id: "media" });
        }
      },
      {
        id: "note",
        label: "tool.note",
        icon: "tool-note",
        kbd: "n",
        onSelect(source) {
          editor.setCurrentTool("note");
          trackEvent("select-tool", { source, id: "note" });
        }
      },
      {
        id: "laser",
        label: "tool.laser",
        readonlyOk: true,
        icon: "tool-laser",
        kbd: "k",
        onSelect(source) {
          editor.setCurrentTool("laser");
          trackEvent("select-tool", { source, id: "laser" });
        }
      },
      {
        id: "embed",
        label: "tool.embed",
        icon: "dot",
        onSelect(source) {
          addDialog({ component: import_EmbedDialog.EmbedDialog });
          trackEvent("select-tool", { source, id: "embed" });
        }
      },
      {
        id: "highlight",
        label: "tool.highlight",
        icon: "tool-highlight",
        // TODO: pick a better shortcut
        kbd: "!d",
        onSelect(source) {
          editor.setCurrentTool("highlight");
          trackEvent("select-tool", { source, id: "highlight" });
        }
      }
    ];
    toolsArray.push();
    const tools2 = Object.fromEntries(toolsArray.map((t) => [t.id, t]));
    if (overrides) {
      return overrides(editor, tools2, { insertMedia });
    }
    return tools2;
  }, [overrides, editor, trackEvent, insertMedia, addDialog]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolsContext.Provider, { value: tools, children });
}
function useTools() {
  const ctx = React.useContext(ToolsContext);
  if (!ctx) {
    throw new Error("useTools must be used within a ToolProvider");
  }
  return ctx;
}
//# sourceMappingURL=useTools.js.map
