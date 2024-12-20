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
var useClipboardEvents_exports = {};
__export(useClipboardEvents_exports, {
  isValidHttpURL: () => isValidHttpURL,
  useMenuClipboardEvents: () => useMenuClipboardEvents,
  useNativeClipboardEvents: () => useNativeClipboardEvents
});
module.exports = __toCommonJS(useClipboardEvents_exports);
var import_editor = require("@tldraw/editor");
var import_lz_string = __toESM(require("lz-string"));
var import_react = require("react");
var import_clipboard = require("../../utils/clipboard");
var import_events = require("../context/events");
var import_pasteExcalidrawContent = require("./clipboard/pasteExcalidrawContent");
var import_pasteFiles = require("./clipboard/pasteFiles");
var import_pasteTldrawContent = require("./clipboard/pasteTldrawContent");
var import_pasteUrl = require("./clipboard/pasteUrl");
const expectedPasteFileMimeTypes = [
  import_clipboard.TLDRAW_CUSTOM_PNG_MIME_TYPE,
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml"
];
function stripHtml(html) {
  const doc = document.implementation.createHTMLDocument("");
  doc.documentElement.innerHTML = html.trim();
  return doc.body.textContent || doc.body.innerText || "";
}
const isValidHttpURL = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
const getValidHttpURLList = (url) => {
  const urls = url.split(/[\n\s]/);
  for (const url2 of urls) {
    try {
      const u = new URL(url2);
      if (!(u.protocol === "http:" || u.protocol === "https:")) {
        return;
      }
    } catch {
      return;
    }
  }
  return (0, import_editor.uniq)(urls);
};
const isSvgText = (text) => {
  return /^<svg/.test(text);
};
const INPUTS = ["input", "select", "textarea"];
function areShortcutsDisabled(editor) {
  const { activeElement } = document;
  return editor.menus.hasAnyOpenMenus() || activeElement && (activeElement.getAttribute("contenteditable") || INPUTS.indexOf(activeElement.tagName.toLowerCase()) > -1);
}
const handleText = (editor, data, point, sources) => {
  const validUrlList = getValidHttpURLList(data);
  if (validUrlList) {
    for (const url of validUrlList) {
      (0, import_pasteUrl.pasteUrl)(editor, url, point);
    }
  } else if (isValidHttpURL(data)) {
    (0, import_pasteUrl.pasteUrl)(editor, data, point);
  } else if (isSvgText(data)) {
    editor.markHistoryStoppingPoint("paste");
    editor.putExternalContent({
      type: "svg-text",
      text: data,
      point,
      sources
    });
  } else {
    editor.markHistoryStoppingPoint("paste");
    editor.putExternalContent({
      type: "text",
      text: data,
      point,
      sources
    });
  }
};
const handlePasteFromEventClipboardData = async (editor, clipboardData, point) => {
  if (editor.getEditingShapeId() !== null) return;
  if (!clipboardData) {
    throw Error("No clipboard data");
  }
  const things = [];
  for (const item of Object.values(clipboardData.items)) {
    switch (item.kind) {
      case "file": {
        things.push({
          type: "file",
          source: new Promise((r) => r(item.getAsFile()))
        });
        break;
      }
      case "string": {
        if (item.type === "text/html") {
          things.push({
            type: "html",
            source: new Promise((r) => item.getAsString(r))
          });
        } else if (item.type === "text/plain") {
          things.push({
            type: "text",
            source: new Promise((r) => item.getAsString(r))
          });
        } else {
          things.push({ type: item.type, source: new Promise((r) => item.getAsString(r)) });
        }
        break;
      }
    }
  }
  handleClipboardThings(editor, things, point);
};
const handlePasteFromClipboardApi = async (editor, clipboardItems, point) => {
  const things = [];
  for (const item of clipboardItems) {
    for (const type of expectedPasteFileMimeTypes) {
      if (item.types.includes(type)) {
        const blobPromise = item.getType(type).then((blob) => import_editor.FileHelpers.rewriteMimeType(blob, (0, import_clipboard.getCanonicalClipboardReadType)(type)));
        things.push({
          type: "blob",
          source: blobPromise
        });
        break;
      }
    }
    if (item.types.includes("text/html")) {
      things.push({
        type: "html",
        source: (async () => {
          const blob = await item.getType("text/html");
          return await import_editor.FileHelpers.blobToText(blob);
        })()
      });
    }
    if (item.types.includes("text/uri-list")) {
      things.push({
        type: "url",
        source: (async () => {
          const blob = await item.getType("text/uri-list");
          return await import_editor.FileHelpers.blobToText(blob);
        })()
      });
    }
    if (item.types.includes("text/plain")) {
      things.push({
        type: "text",
        source: (async () => {
          const blob = await item.getType("text/plain");
          return await import_editor.FileHelpers.blobToText(blob);
        })()
      });
    }
  }
  return await handleClipboardThings(editor, things, point);
};
async function handleClipboardThings(editor, things, point) {
  const files = things.filter(
    (t) => (t.type === "file" || t.type === "blob") && t.source !== null
  );
  if (files.length) {
    if (files.length > editor.options.maxFilesAtOnce) {
      throw Error("Too many files");
    }
    const fileBlobs = (0, import_editor.compact)(await Promise.all(files.map((t) => t.source)));
    return await (0, import_pasteFiles.pasteFiles)(editor, fileBlobs, point);
  }
  const results = await Promise.all(
    things.filter((t) => t.type !== "file").map(
      (t) => new Promise((r) => {
        const thing = t;
        if (thing.type === "file") {
          r({ type: "error", data: null, reason: "unexpected file" });
          return;
        }
        thing.source.then((text) => {
          const tldrawHtmlComment = text.match(/<div data-tldraw[^>]*>(.*)<\/div>/)?.[1];
          if (tldrawHtmlComment) {
            try {
              const jsonComment = import_lz_string.default.decompressFromBase64(tldrawHtmlComment);
              if (jsonComment === null) {
                r({
                  type: "error",
                  data: jsonComment,
                  reason: `found tldraw data comment but could not parse base64`
                });
                return;
              } else {
                const json = JSON.parse(jsonComment);
                if (json.type !== "application/tldraw") {
                  r({
                    type: "error",
                    data: json,
                    reason: `found tldraw data comment but JSON was of a different type: ${json.type}`
                  });
                }
                if (typeof json.data === "string") {
                  r({
                    type: "error",
                    data: json,
                    reason: "found tldraw json but data was a string instead of a TLClipboardModel object"
                  });
                  return;
                }
                r({ type: "tldraw", data: json.data });
                return;
              }
            } catch {
              r({
                type: "error",
                data: tldrawHtmlComment,
                reason: "found tldraw json but data was a string instead of a TLClipboardModel object"
              });
              return;
            }
          } else {
            if (thing.type === "html") {
              r({ type: "text", data: text, subtype: "html" });
              return;
            }
            if (thing.type === "url") {
              r({ type: "text", data: text, subtype: "url" });
              return;
            }
            try {
              const json = JSON.parse(text);
              if (json.type === "excalidraw/clipboard") {
                r({ type: "excalidraw", data: json });
                return;
              } else {
                r({ type: "text", data: text, subtype: "json" });
                return;
              }
            } catch {
              r({ type: "text", data: text, subtype: "text" });
              return;
            }
          }
          r({ type: "error", data: text, reason: "unhandled case" });
        });
      })
    )
  );
  for (const result of results) {
    if (result.type === "tldraw") {
      (0, import_pasteTldrawContent.pasteTldrawContent)(editor, result.data, point);
      return;
    }
  }
  for (const result of results) {
    if (result.type === "excalidraw") {
      (0, import_pasteExcalidrawContent.pasteExcalidrawContent)(editor, result.data, point);
      return;
    }
  }
  for (const result of results) {
    if (result.type === "text" && result.subtype === "html") {
      const rootNode = new DOMParser().parseFromString(result.data, "text/html");
      const bodyNode = rootNode.querySelector("body");
      const isHtmlSingleLink = bodyNode && Array.from(bodyNode.children).filter((el) => el.nodeType === 1).length === 1 && bodyNode.firstElementChild && bodyNode.firstElementChild.tagName === "A" && bodyNode.firstElementChild.hasAttribute("href") && bodyNode.firstElementChild.getAttribute("href") !== "";
      if (isHtmlSingleLink) {
        const href = bodyNode.firstElementChild.getAttribute("href");
        handleText(editor, href, point, results);
        return;
      }
      if (!results.some((r) => r.type === "text" && r.subtype !== "html") && result.data.trim()) {
        handleText(editor, stripHtml(result.data), point, results);
        return;
      }
    }
  }
  for (const result of results) {
    if (result.type === "text" && result.subtype === "url") {
      (0, import_pasteUrl.pasteUrl)(editor, result.data, point, results);
      return;
    }
  }
  for (const result of results) {
    if (result.type === "text" && result.subtype === "text" && result.data.trim()) {
      handleText(editor, result.data, point, results);
      return;
    }
  }
}
const handleNativeOrMenuCopy = async (editor) => {
  const content = await editor.resolveAssetsInContent(
    editor.getContentFromCurrentPage(editor.getSelectedShapeIds())
  );
  if (!content) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText("");
    }
    return;
  }
  const stringifiedClipboard = import_lz_string.default.compressToBase64(
    JSON.stringify({
      type: "application/tldraw",
      kind: "content",
      data: content
    })
  );
  if (typeof navigator === "undefined") {
    return;
  } else {
    const textItems = content.shapes.map((shape) => {
      const util = editor.getShapeUtil(shape);
      return util.getText(shape);
    }).filter(import_editor.isDefined);
    if (navigator.clipboard?.write) {
      const htmlBlob = new Blob([`<div data-tldraw>${stringifiedClipboard}</div>`], {
        type: "text/html"
      });
      let textContent = textItems.join(" ");
      if (textContent === "") {
        textContent = " ";
      }
      navigator.clipboard.write([
        new ClipboardItem({
          "text/html": htmlBlob,
          // What is this second blob used for?
          "text/plain": new Blob([textContent], { type: "text/plain" })
        })
      ]);
    } else if (navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`<div data-tldraw>${stringifiedClipboard}</div>`);
    }
  }
};
function useMenuClipboardEvents() {
  const editor = (0, import_editor.useEditor)();
  const trackEvent = (0, import_events.useUiEvents)();
  const copy = (0, import_react.useCallback)(
    async function onCopy(source) {
      if (editor.getSelectedShapeIds().length === 0) return;
      await handleNativeOrMenuCopy(editor);
      trackEvent("copy", { source });
    },
    [editor, trackEvent]
  );
  const cut = (0, import_react.useCallback)(
    async function onCut(source) {
      if (editor.getSelectedShapeIds().length === 0) return;
      await handleNativeOrMenuCopy(editor);
      editor.deleteShapes(editor.getSelectedShapeIds());
      trackEvent("cut", { source });
    },
    [editor, trackEvent]
  );
  const paste = (0, import_react.useCallback)(
    async function onPaste(data, source, point) {
      if (editor.getEditingShapeId() !== null) return;
      if (Array.isArray(data) && data[0] instanceof ClipboardItem) {
        handlePasteFromClipboardApi(editor, data, point);
        trackEvent("paste", { source: "menu" });
      } else {
        navigator.clipboard.read().then((clipboardItems) => {
          paste(clipboardItems, source, point);
        });
      }
    },
    [editor, trackEvent]
  );
  return {
    copy,
    cut,
    paste
  };
}
function useNativeClipboardEvents() {
  const editor = (0, import_editor.useEditor)();
  const trackEvent = (0, import_events.useUiEvents)();
  const appIsFocused = (0, import_editor.useValue)("editor.isFocused", () => editor.getInstanceState().isFocused, [
    editor
  ]);
  (0, import_react.useEffect)(() => {
    if (!appIsFocused) return;
    const copy = async (e) => {
      if (editor.getSelectedShapeIds().length === 0 || editor.getEditingShapeId() !== null || areShortcutsDisabled(editor)) {
        return;
      }
      (0, import_editor.preventDefault)(e);
      await handleNativeOrMenuCopy(editor);
      trackEvent("copy", { source: "kbd" });
    };
    async function cut(e) {
      if (editor.getSelectedShapeIds().length === 0 || editor.getEditingShapeId() !== null || areShortcutsDisabled(editor)) {
        return;
      }
      (0, import_editor.preventDefault)(e);
      await handleNativeOrMenuCopy(editor);
      editor.deleteShapes(editor.getSelectedShapeIds());
      trackEvent("cut", { source: "kbd" });
    }
    let disablingMiddleClickPaste = false;
    const pointerUpHandler = (e) => {
      if (e.button === 1) {
        disablingMiddleClickPaste = true;
        editor.timers.requestAnimationFrame(() => {
          disablingMiddleClickPaste = false;
        });
      }
    };
    const paste = (e) => {
      if (disablingMiddleClickPaste) {
        (0, import_editor.stopEventPropagation)(e);
        return;
      }
      if (editor.getEditingShapeId() !== null || areShortcutsDisabled(editor)) return;
      let point = void 0;
      let pasteAtCursor = false;
      if (editor.inputs.shiftKey) pasteAtCursor = true;
      if (editor.user.getIsPasteAtCursorMode()) pasteAtCursor = !pasteAtCursor;
      if (pasteAtCursor) point = editor.inputs.currentPagePoint;
      const pasteFromEvent = () => {
        if (e.clipboardData) {
          handlePasteFromEventClipboardData(editor, e.clipboardData, point);
        }
      };
      if (navigator.clipboard?.read) {
        navigator.clipboard.read().then(
          (clipboardItems) => {
            if (Array.isArray(clipboardItems) && clipboardItems[0] instanceof ClipboardItem) {
              handlePasteFromClipboardApi(editor, clipboardItems, point);
            }
          },
          () => {
            pasteFromEvent();
          }
        );
      } else {
        pasteFromEvent();
      }
      (0, import_editor.preventDefault)(e);
      trackEvent("paste", { source: "kbd" });
    };
    document.addEventListener("copy", copy);
    document.addEventListener("cut", cut);
    document.addEventListener("paste", paste);
    document.addEventListener("pointerup", pointerUpHandler);
    return () => {
      document.removeEventListener("copy", copy);
      document.removeEventListener("cut", cut);
      document.removeEventListener("paste", paste);
      document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, [editor, trackEvent, appIsFocused]);
}
//# sourceMappingURL=useClipboardEvents.js.map
