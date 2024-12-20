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
var actions_exports = {};
__export(actions_exports, {
  ActionsContext: () => ActionsContext,
  ActionsProvider: () => ActionsProvider,
  unwrapLabel: () => unwrapLabel,
  useActions: () => useActions
});
module.exports = __toCommonJS(actions_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var React = __toESM(require("react"));
var import_selectHelpers = require("../../tools/SelectTool/selectHelpers");
var import_frames = require("../../utils/frames/frames");
var import_EditLinkDialog = require("../components/EditLinkDialog");
var import_EmbedDialog = require("../components/EmbedDialog");
var import_useClipboardEvents = require("../hooks/useClipboardEvents");
var import_useCopyAs = require("../hooks/useCopyAs");
var import_useExportAs = require("../hooks/useExportAs");
var import_useFlatten = require("../hooks/useFlatten");
var import_useGetEmbedDefinition = require("../hooks/useGetEmbedDefinition");
var import_useInsertMedia = require("../hooks/useInsertMedia");
var import_useIsMultiplayer = require("../hooks/useIsMultiplayer");
var import_usePrint = require("../hooks/usePrint");
var import_useTranslation = require("../hooks/useTranslation/useTranslation");
var import_dialogs = require("./dialogs");
var import_events = require("./events");
var import_toasts = require("./toasts");
const ActionsContext = React.createContext(null);
function makeActions(actions) {
  return Object.fromEntries(actions.map((action) => [action.id, action]));
}
function getExportName(editor, defaultName) {
  const selectedShapes = editor.getSelectedShapes();
  if (selectedShapes.length === 0) {
    return editor.getDocumentSettings().name || defaultName;
  }
  return void 0;
}
function ActionsProvider({ overrides, children }) {
  const editor = (0, import_editor.useEditor)();
  const showCollaborationUi = (0, import_useIsMultiplayer.useShowCollaborationUi)();
  const { addDialog, clearDialogs } = (0, import_dialogs.useDialogs)();
  const { clearToasts, addToast } = (0, import_toasts.useToasts)();
  const msg = (0, import_useTranslation.useTranslation)();
  const insertMedia = (0, import_useInsertMedia.useInsertMedia)();
  const printSelectionOrPages = (0, import_usePrint.usePrint)();
  const { cut, copy, paste } = (0, import_useClipboardEvents.useMenuClipboardEvents)();
  const copyAs = (0, import_useCopyAs.useCopyAs)();
  const exportAs = (0, import_useExportAs.useExportAs)();
  const defaultDocumentName = msg("document.default-name");
  const getEmbedDefinition = (0, import_useGetEmbedDefinition.useGetEmbedDefinition)();
  const trackEvent = (0, import_events.useUiEvents)();
  const actions = React.useMemo(() => {
    function mustGoBackToSelectToolFirst() {
      if (!editor.isIn("select")) {
        editor.complete();
        editor.setCurrentTool("select");
        return false;
      }
      return false;
    }
    function canApplySelectionAction() {
      return editor.isIn("select") && editor.getSelectedShapeIds().length > 0;
    }
    const actionItems = [
      {
        id: "edit-link",
        label: "action.edit-link",
        icon: "link",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("edit-link", { source });
          editor.markHistoryStoppingPoint("edit-link");
          addDialog({ component: import_EditLinkDialog.EditLinkDialog });
        }
      },
      {
        id: "insert-embed",
        label: "action.insert-embed",
        kbd: "$i",
        onSelect(source) {
          trackEvent("insert-embed", { source });
          addDialog({ component: import_EmbedDialog.EmbedDialog });
        }
      },
      {
        id: "insert-media",
        label: "action.insert-media",
        kbd: "$u",
        onSelect(source) {
          trackEvent("insert-media", { source });
          insertMedia();
        }
      },
      {
        id: "undo",
        label: "action.undo",
        icon: "undo",
        kbd: "$z",
        onSelect(source) {
          trackEvent("undo", { source });
          editor.undo();
        }
      },
      {
        id: "redo",
        label: "action.redo",
        icon: "redo",
        kbd: "$!z",
        onSelect(source) {
          trackEvent("redo", { source });
          editor.redo();
        }
      },
      {
        id: "export-as-svg",
        label: {
          default: "action.export-as-svg",
          menu: "action.export-as-svg.short",
          ["context-menu"]: "action.export-as-svg.short"
        },
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("export-as", { format: "svg", source });
          exportAs(ids, "svg", getExportName(editor, defaultDocumentName));
        }
      },
      {
        id: "export-as-png",
        label: {
          default: "action.export-as-png",
          menu: "action.export-as-png.short",
          ["context-menu"]: "action.export-as-png.short"
        },
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("export-as", { format: "png", source });
          exportAs(ids, "png", getExportName(editor, defaultDocumentName));
        }
      },
      {
        id: "export-as-json",
        label: {
          default: "action.export-as-json",
          menu: "action.export-as-json.short",
          ["context-menu"]: "action.export-as-json.short"
        },
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("export-as", { format: "json", source });
          exportAs(ids, "json", getExportName(editor, defaultDocumentName));
        }
      },
      {
        id: "export-all-as-svg",
        label: {
          default: "action.export-all-as-svg",
          menu: "action.export-all-as-svg.short",
          ["context-menu"]: "action.export-all-as-svg.short"
        },
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("export-all-as", { format: "svg", source });
          exportAs(
            Array.from(editor.getCurrentPageShapeIds()),
            "svg",
            getExportName(editor, defaultDocumentName)
          );
        }
      },
      {
        id: "export-all-as-png",
        label: {
          default: "action.export-all-as-png",
          menu: "action.export-all-as-png.short",
          ["context-menu"]: "action.export-all-as-png.short"
        },
        readonlyOk: true,
        onSelect(source) {
          const ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("export-all-as", { format: "png", source });
          exportAs(ids, "png", getExportName(editor, defaultDocumentName));
        }
      },
      {
        id: "export-all-as-json",
        label: {
          default: "action.export-all-as-json",
          menu: "action.export-all-as-json.short",
          ["context-menu"]: "action.export-all-as-json.short"
        },
        readonlyOk: true,
        onSelect(source) {
          const ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("export-all-as", { format: "json", source });
          exportAs(ids, "json", getExportName(editor, defaultDocumentName));
        }
      },
      {
        id: "copy-as-svg",
        label: {
          default: "action.copy-as-svg",
          menu: "action.copy-as-svg.short",
          ["context-menu"]: "action.copy-as-svg.short"
        },
        kbd: "$!c",
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("copy-as", { format: "svg", source });
          copyAs(ids, "svg");
        }
      },
      {
        id: "copy-as-png",
        label: {
          default: "action.copy-as-png",
          menu: "action.copy-as-png.short",
          ["context-menu"]: "action.copy-as-png.short"
        },
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("copy-as", { format: "png", source });
          copyAs(ids, "png");
        }
      },
      {
        id: "copy-as-json",
        label: {
          default: "action.copy-as-json",
          menu: "action.copy-as-json.short",
          ["context-menu"]: "action.copy-as-json.short"
        },
        readonlyOk: true,
        onSelect(source) {
          let ids = editor.getSelectedShapeIds();
          if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
          if (ids.length === 0) return;
          trackEvent("copy-as", { format: "json", source });
          copyAs(ids, "json");
        }
      },
      {
        id: "toggle-auto-size",
        label: "action.toggle-auto-size",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("toggle-auto-size", { source });
          editor.markHistoryStoppingPoint("toggling auto size");
          const shapes = editor.getSelectedShapes().filter(
            (shape) => editor.isShapeOfType(shape, "text") && shape.props.autoSize === false
          );
          editor.updateShapes(
            shapes.map((shape) => {
              return {
                id: shape.id,
                type: shape.type,
                props: {
                  ...shape.props,
                  w: 8,
                  autoSize: true
                }
              };
            })
          );
          (0, import_selectHelpers.kickoutOccludedShapes)(
            editor,
            shapes.map((shape) => shape.id)
          );
        }
      },
      {
        id: "open-embed-link",
        label: "action.open-embed-link",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("open-embed-link", { source });
          const ids = editor.getSelectedShapeIds();
          const warnMsg = "No embed shapes selected";
          if (ids.length !== 1) {
            console.error(warnMsg);
            return;
          }
          const shape = editor.getShape(ids[0]);
          if (!shape || !editor.isShapeOfType(shape, "embed")) {
            console.error(warnMsg);
            return;
          }
          (0, import_editor.openWindow)(shape.props.url, "_blank");
        }
      },
      {
        id: "select-zoom-tool",
        readonlyOk: true,
        kbd: "z",
        onSelect(source) {
          if (editor.root.getCurrent()?.id === "zoom") return;
          trackEvent("zoom-tool", { source });
          if (!(editor.inputs.shiftKey || editor.inputs.ctrlKey)) {
            const currentTool = editor.root.getCurrent();
            if (currentTool && currentTool.getCurrent()?.id === "idle") {
              editor.setCurrentTool("zoom", { onInteractionEnd: currentTool.id, maskAs: "zoom" });
            }
          }
        }
      },
      {
        id: "convert-to-bookmark",
        label: "action.convert-to-bookmark",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          editor.run(() => {
            trackEvent("convert-to-bookmark", { source });
            const shapes = editor.getSelectedShapes();
            const createList = [];
            const deleteList = [];
            for (const shape of shapes) {
              if (!shape || !editor.isShapeOfType(shape, "embed") || !shape.props.url)
                continue;
              const newPos = new import_editor.Vec(shape.x, shape.y);
              newPos.rot(-shape.rotation);
              newPos.add(new import_editor.Vec(shape.props.w / 2 - 300 / 2, shape.props.h / 2 - 320 / 2));
              newPos.rot(shape.rotation);
              const partial = {
                id: (0, import_editor.createShapeId)(),
                type: "bookmark",
                rotation: shape.rotation,
                x: newPos.x,
                y: newPos.y,
                opacity: 1,
                props: {
                  url: shape.props.url
                }
              };
              createList.push(partial);
              deleteList.push(shape.id);
            }
            editor.markHistoryStoppingPoint("convert shapes to bookmark");
            editor.deleteShapes(deleteList);
            editor.createShapes(createList);
          });
        }
      },
      {
        id: "convert-to-embed",
        label: "action.convert-to-embed",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("convert-to-embed", { source });
          editor.run(() => {
            const ids = editor.getSelectedShapeIds();
            const shapes = (0, import_editor.compact)(ids.map((id) => editor.getShape(id)));
            const createList = [];
            const deleteList = [];
            for (const shape of shapes) {
              if (!editor.isShapeOfType(shape, "bookmark")) continue;
              const { url } = shape.props;
              const embedInfo = getEmbedDefinition(url);
              if (!embedInfo) continue;
              if (!embedInfo.definition) continue;
              const { width, height } = embedInfo.definition;
              const newPos = new import_editor.Vec(shape.x, shape.y);
              newPos.rot(-shape.rotation);
              newPos.add(new import_editor.Vec(shape.props.w / 2 - width / 2, shape.props.h / 2 - height / 2));
              newPos.rot(shape.rotation);
              const shapeToCreate = {
                id: (0, import_editor.createShapeId)(),
                type: "embed",
                x: newPos.x,
                y: newPos.y,
                rotation: shape.rotation,
                props: {
                  url,
                  w: width,
                  h: height
                }
              };
              createList.push(shapeToCreate);
              deleteList.push(shape.id);
            }
            editor.markHistoryStoppingPoint("convert shapes to embed");
            editor.deleteShapes(deleteList);
            editor.createShapes(createList);
          });
        }
      },
      {
        id: "duplicate",
        kbd: "$d",
        label: "action.duplicate",
        icon: "duplicate",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("duplicate-shapes", { source });
          const instanceState = editor.getInstanceState();
          let ids;
          let offset;
          if (instanceState.duplicateProps) {
            ids = instanceState.duplicateProps.shapeIds;
            offset = instanceState.duplicateProps.offset;
          } else {
            ids = editor.getSelectedShapeIds();
            const commonBounds = import_editor.Box.Common((0, import_editor.compact)(ids.map((id) => editor.getShapePageBounds(id))));
            offset = editor.getCameraOptions().isLocked ? {
              // same as the adjacent note margin
              x: editor.options.adjacentShapeMargin,
              y: editor.options.adjacentShapeMargin
            } : {
              x: commonBounds.width + editor.options.adjacentShapeMargin,
              y: 0
            };
          }
          editor.markHistoryStoppingPoint("duplicate shapes");
          editor.duplicateShapes(ids, offset);
          if (instanceState.duplicateProps) {
            editor.updateInstanceState({
              duplicateProps: {
                ...instanceState.duplicateProps,
                shapeIds: editor.getSelectedShapeIds()
              }
            });
          }
        }
      },
      {
        id: "ungroup",
        label: "action.ungroup",
        kbd: "$!g",
        icon: "ungroup",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("ungroup-shapes", { source });
          editor.markHistoryStoppingPoint("ungroup");
          editor.ungroupShapes(editor.getSelectedShapeIds());
        }
      },
      {
        id: "group",
        label: "action.group",
        kbd: "$g",
        icon: "group",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("group-shapes", { source });
          const onlySelectedShape = editor.getOnlySelectedShape();
          if (onlySelectedShape && editor.isShapeOfType(onlySelectedShape, "group")) {
            editor.markHistoryStoppingPoint("ungroup");
            editor.ungroupShapes(editor.getSelectedShapeIds());
          } else {
            editor.markHistoryStoppingPoint("group");
            editor.groupShapes(editor.getSelectedShapeIds());
          }
        }
      },
      {
        id: "remove-frame",
        label: "action.remove-frame",
        kbd: "$!f",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          trackEvent("remove-frame", { source });
          const selectedShapes = editor.getSelectedShapes();
          if (selectedShapes.length > 0 && selectedShapes.every((shape) => editor.isShapeOfType(shape, "frame"))) {
            editor.markHistoryStoppingPoint("remove-frame");
            (0, import_frames.removeFrame)(
              editor,
              selectedShapes.map((shape) => shape.id)
            );
          }
        }
      },
      {
        id: "fit-frame-to-content",
        label: "action.fit-frame-to-content",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          trackEvent("fit-frame-to-content", { source });
          const onlySelectedShape = editor.getOnlySelectedShape();
          if (onlySelectedShape && editor.isShapeOfType(onlySelectedShape, "frame")) {
            editor.markHistoryStoppingPoint("fit-frame-to-content");
            (0, import_frames.fitFrameToContent)(editor, onlySelectedShape.id);
          }
        }
      },
      {
        id: "align-left",
        label: "action.align-left",
        kbd: "?A",
        icon: "align-left",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("align-shapes", { operation: "left", source });
          editor.markHistoryStoppingPoint("align left");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.alignShapes(selectedShapeIds, "left");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "align-center-horizontal",
        label: {
          default: "action.align-center-horizontal",
          ["context-menu"]: "action.align-center-horizontal.short"
        },
        kbd: "?H",
        icon: "align-center-horizontal",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("align-shapes", { operation: "center-horizontal", source });
          editor.markHistoryStoppingPoint("align center horizontal");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.alignShapes(selectedShapeIds, "center-horizontal");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "align-right",
        label: "action.align-right",
        kbd: "?D",
        icon: "align-right",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("align-shapes", { operation: "right", source });
          editor.markHistoryStoppingPoint("align right");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.alignShapes(selectedShapeIds, "right");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "align-center-vertical",
        label: {
          default: "action.align-center-vertical",
          ["context-menu"]: "action.align-center-vertical.short"
        },
        kbd: "?V",
        icon: "align-center-vertical",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("align-shapes", { operation: "center-vertical", source });
          editor.markHistoryStoppingPoint("align center vertical");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.alignShapes(selectedShapeIds, "center-vertical");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "align-top",
        label: "action.align-top",
        icon: "align-top",
        kbd: "?W",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("align-shapes", { operation: "top", source });
          editor.markHistoryStoppingPoint("align top");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.alignShapes(selectedShapeIds, "top");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "align-bottom",
        label: "action.align-bottom",
        icon: "align-bottom",
        kbd: "?S",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("align-shapes", { operation: "bottom", source });
          editor.markHistoryStoppingPoint("align bottom");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.alignShapes(selectedShapeIds, "bottom");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "distribute-horizontal",
        label: {
          default: "action.distribute-horizontal",
          ["context-menu"]: "action.distribute-horizontal.short"
        },
        icon: "distribute-horizontal",
        kbd: "?!h",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("distribute-shapes", { operation: "horizontal", source });
          editor.markHistoryStoppingPoint("distribute horizontal");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.distributeShapes(selectedShapeIds, "horizontal");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "distribute-vertical",
        label: {
          default: "action.distribute-vertical",
          ["context-menu"]: "action.distribute-vertical.short"
        },
        icon: "distribute-vertical",
        kbd: "?!V",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("distribute-shapes", { operation: "vertical", source });
          editor.markHistoryStoppingPoint("distribute vertical");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.distributeShapes(selectedShapeIds, "vertical");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "stretch-horizontal",
        label: {
          default: "action.stretch-horizontal",
          ["context-menu"]: "action.stretch-horizontal.short"
        },
        icon: "stretch-horizontal",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("stretch-shapes", { operation: "horizontal", source });
          editor.markHistoryStoppingPoint("stretch horizontal");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.stretchShapes(selectedShapeIds, "horizontal");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "stretch-vertical",
        label: {
          default: "action.stretch-vertical",
          ["context-menu"]: "action.stretch-vertical.short"
        },
        icon: "stretch-vertical",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("stretch-shapes", { operation: "vertical", source });
          editor.markHistoryStoppingPoint("stretch vertical");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.stretchShapes(selectedShapeIds, "vertical");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "flip-horizontal",
        label: {
          default: "action.flip-horizontal",
          ["context-menu"]: "action.flip-horizontal.short"
        },
        kbd: "!h",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("flip-shapes", { operation: "horizontal", source });
          editor.markHistoryStoppingPoint("flip horizontal");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.flipShapes(selectedShapeIds, "horizontal");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "flip-vertical",
        label: { default: "action.flip-vertical", ["context-menu"]: "action.flip-vertical.short" },
        kbd: "!v",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("flip-shapes", { operation: "vertical", source });
          editor.markHistoryStoppingPoint("flip vertical");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.flipShapes(selectedShapeIds, "vertical");
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "pack",
        label: "action.pack",
        icon: "pack",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("pack-shapes", { source });
          editor.markHistoryStoppingPoint("pack");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.packShapes(selectedShapeIds, editor.options.adjacentShapeMargin);
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "stack-vertical",
        label: {
          default: "action.stack-vertical",
          ["context-menu"]: "action.stack-vertical.short"
        },
        icon: "stack-vertical",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("stack-shapes", { operation: "vertical", source });
          editor.markHistoryStoppingPoint("stack-vertical");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.stackShapes(selectedShapeIds, "vertical", 16);
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "stack-horizontal",
        label: {
          default: "action.stack-horizontal",
          ["context-menu"]: "action.stack-horizontal.short"
        },
        icon: "stack-horizontal",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("stack-shapes", { operation: "horizontal", source });
          editor.markHistoryStoppingPoint("stack-horizontal");
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.stackShapes(selectedShapeIds, "horizontal", 16);
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "bring-to-front",
        label: "action.bring-to-front",
        kbd: "]",
        icon: "bring-to-front",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("reorder-shapes", { operation: "toFront", source });
          editor.markHistoryStoppingPoint("bring to front");
          editor.bringToFront(editor.getSelectedShapeIds());
        }
      },
      {
        id: "bring-forward",
        label: "action.bring-forward",
        icon: "bring-forward",
        kbd: "?]",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("reorder-shapes", { operation: "forward", source });
          editor.markHistoryStoppingPoint("bring forward");
          editor.bringForward(editor.getSelectedShapeIds());
        }
      },
      {
        id: "send-backward",
        label: "action.send-backward",
        icon: "send-backward",
        kbd: "?[",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("reorder-shapes", { operation: "backward", source });
          editor.markHistoryStoppingPoint("send backward");
          editor.sendBackward(editor.getSelectedShapeIds());
        }
      },
      {
        id: "send-to-back",
        label: "action.send-to-back",
        icon: "send-to-back",
        kbd: "[",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("reorder-shapes", { operation: "toBack", source });
          editor.markHistoryStoppingPoint("send to back");
          editor.sendToBack(editor.getSelectedShapeIds());
        }
      },
      {
        id: "cut",
        label: "action.cut",
        kbd: "$x",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          editor.markHistoryStoppingPoint("cut");
          cut(source);
        }
      },
      {
        id: "copy",
        label: "action.copy",
        kbd: "$c",
        readonlyOk: true,
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          copy(source);
        }
      },
      {
        id: "paste",
        label: "action.paste",
        kbd: "$v",
        onSelect(source) {
          navigator.clipboard?.read().then((clipboardItems) => {
            paste(
              clipboardItems,
              source,
              source === "context-menu" ? editor.inputs.currentPagePoint : void 0
            );
          }).catch(() => {
            addToast({
              title: msg("action.paste-error-title"),
              description: msg("action.paste-error-description"),
              severity: "error"
            });
          });
        }
      },
      {
        id: "select-all",
        label: "action.select-all",
        kbd: "$a",
        readonlyOk: true,
        onSelect(source) {
          editor.run(() => {
            if (mustGoBackToSelectToolFirst()) return;
            trackEvent("select-all-shapes", { source });
            editor.markHistoryStoppingPoint("select all kbd");
            editor.selectAll();
          });
        }
      },
      {
        id: "select-none",
        label: "action.select-none",
        readonlyOk: true,
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("select-none-shapes", { source });
          editor.markHistoryStoppingPoint("select none");
          editor.selectNone();
        }
      },
      {
        id: "delete",
        label: "action.delete",
        kbd: "\u232B,del,backspace",
        icon: "trash",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("delete-shapes", { source });
          editor.markHistoryStoppingPoint("delete");
          editor.deleteShapes(editor.getSelectedShapeIds());
        }
      },
      {
        id: "rotate-cw",
        label: "action.rotate-cw",
        icon: "rotate-cw",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("rotate-cw", { source });
          editor.markHistoryStoppingPoint("rotate-cw");
          const offset = editor.getSelectionRotation() % (import_editor.HALF_PI / 2);
          const dontUseOffset = (0, import_editor.approximately)(offset, 0) || (0, import_editor.approximately)(offset, import_editor.HALF_PI / 2);
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.rotateShapesBy(selectedShapeIds, import_editor.HALF_PI / 2 - (dontUseOffset ? 0 : offset));
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "rotate-ccw",
        label: "action.rotate-ccw",
        icon: "rotate-ccw",
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("rotate-ccw", { source });
          editor.markHistoryStoppingPoint("rotate-ccw");
          const offset = editor.getSelectionRotation() % (import_editor.HALF_PI / 2);
          const offsetCloseToZero = (0, import_editor.approximately)(offset, 0);
          const selectedShapeIds = editor.getSelectedShapeIds();
          editor.rotateShapesBy(selectedShapeIds, offsetCloseToZero ? -(import_editor.HALF_PI / 2) : -offset);
          (0, import_selectHelpers.kickoutOccludedShapes)(editor, selectedShapeIds);
        }
      },
      {
        id: "zoom-in",
        label: "action.zoom-in",
        kbd: "$=,=",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("zoom-in", { source });
          editor.zoomIn(void 0, {
            animation: { duration: editor.options.animationMediumMs }
          });
        }
      },
      {
        id: "zoom-out",
        label: "action.zoom-out",
        kbd: "$-,-",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("zoom-out", { source });
          editor.zoomOut(void 0, {
            animation: { duration: editor.options.animationMediumMs }
          });
        }
      },
      {
        id: "zoom-to-100",
        label: "action.zoom-to-100",
        icon: "reset-zoom",
        kbd: "!0",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("reset-zoom", { source });
          editor.resetZoom(void 0, {
            animation: { duration: editor.options.animationMediumMs }
          });
        }
      },
      {
        id: "zoom-to-fit",
        label: "action.zoom-to-fit",
        kbd: "!1",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("zoom-to-fit", { source });
          editor.zoomToFit({ animation: { duration: editor.options.animationMediumMs } });
        }
      },
      {
        id: "zoom-to-selection",
        label: "action.zoom-to-selection",
        kbd: "!2",
        readonlyOk: true,
        onSelect(source) {
          if (!canApplySelectionAction()) return;
          if (mustGoBackToSelectToolFirst()) return;
          trackEvent("zoom-to-selection", { source });
          editor.zoomToSelection({ animation: { duration: editor.options.animationMediumMs } });
        }
      },
      {
        id: "toggle-snap-mode",
        label: {
          default: "action.toggle-snap-mode",
          menu: "action.toggle-snap-mode.menu"
        },
        onSelect(source) {
          trackEvent("toggle-snap-mode", { source });
          editor.user.updateUserPreferences({ isSnapMode: !editor.user.getIsSnapMode() });
        },
        checkbox: true
      },
      {
        id: "toggle-dark-mode",
        label: {
          default: "action.toggle-dark-mode",
          menu: "action.toggle-dark-mode.menu"
        },
        kbd: "$/",
        readonlyOk: true,
        onSelect(source) {
          const value = editor.user.getIsDarkMode() ? "light" : "dark";
          trackEvent("color-scheme", { source, value });
          editor.user.updateUserPreferences({
            colorScheme: value
          });
        },
        checkbox: true
      },
      {
        id: "toggle-wrap-mode",
        label: {
          default: "action.toggle-wrap-mode",
          menu: "action.toggle-wrap-mode.menu"
        },
        readonlyOk: true,
        onSelect(source) {
          trackEvent("toggle-wrap-mode", { source });
          editor.user.updateUserPreferences({
            isWrapMode: !editor.user.getIsWrapMode()
          });
        },
        checkbox: true
      },
      {
        id: "toggle-dynamic-size-mode",
        label: {
          default: "action.toggle-dynamic-size-mode",
          menu: "action.toggle-dynamic-size-mode.menu"
        },
        readonlyOk: false,
        onSelect(source) {
          trackEvent("toggle-dynamic-size-mode", { source });
          editor.user.updateUserPreferences({
            isDynamicSizeMode: !editor.user.getIsDynamicResizeMode()
          });
        },
        checkbox: true
      },
      {
        id: "toggle-paste-at-cursor",
        label: {
          default: "action.toggle-paste-at-cursor",
          menu: "action.toggle-paste-at-cursor.menu"
        },
        readonlyOk: false,
        onSelect(source) {
          trackEvent("toggle-paste-at-cursor", { source });
          editor.user.updateUserPreferences({
            isPasteAtCursorMode: !editor.user.getIsPasteAtCursorMode()
          });
        },
        checkbox: true
      },
      {
        id: "toggle-reduce-motion",
        label: {
          default: "action.toggle-reduce-motion",
          menu: "action.toggle-reduce-motion.menu"
        },
        readonlyOk: true,
        onSelect(source) {
          trackEvent("toggle-reduce-motion", { source });
          editor.user.updateUserPreferences({
            animationSpeed: editor.user.getAnimationSpeed() === 0 ? 1 : 0
          });
        },
        checkbox: true
      },
      {
        id: "toggle-edge-scrolling",
        label: {
          default: "action.toggle-edge-scrolling",
          menu: "action.toggle-edge-scrolling.menu"
        },
        readonlyOk: true,
        onSelect(source) {
          trackEvent("toggle-edge-scrolling", { source });
          editor.user.updateUserPreferences({
            edgeScrollSpeed: editor.user.getEdgeScrollSpeed() === 0 ? 1 : 0
          });
        },
        checkbox: true
      },
      {
        id: "toggle-transparent",
        label: {
          default: "action.toggle-transparent",
          menu: "action.toggle-transparent.menu",
          ["context-menu"]: "action.toggle-transparent.context-menu"
        },
        readonlyOk: true,
        onSelect(source) {
          trackEvent("toggle-transparent", { source });
          editor.updateInstanceState({
            exportBackground: !editor.getInstanceState().exportBackground
          });
        },
        checkbox: true
      },
      {
        id: "toggle-tool-lock",
        label: {
          default: "action.toggle-tool-lock",
          menu: "action.toggle-tool-lock.menu"
        },
        kbd: "q",
        onSelect(source) {
          trackEvent("toggle-tool-lock", { source });
          editor.updateInstanceState({ isToolLocked: !editor.getInstanceState().isToolLocked });
        },
        checkbox: true
      },
      {
        id: "unlock-all",
        label: "action.unlock-all",
        onSelect(source) {
          trackEvent("unlock-all", { source });
          const updates = [];
          for (const shape of editor.getCurrentPageShapes()) {
            if (shape.isLocked) {
              updates.push({ id: shape.id, type: shape.type, isLocked: false });
            }
          }
          if (updates.length > 0) {
            editor.updateShapes(updates);
          }
        }
      },
      {
        id: "toggle-focus-mode",
        label: {
          default: "action.toggle-focus-mode",
          menu: "action.toggle-focus-mode.menu"
        },
        readonlyOk: true,
        kbd: "$.",
        checkbox: true,
        onSelect(source) {
          editor.timers.requestAnimationFrame(() => {
            editor.run(() => {
              trackEvent("toggle-focus-mode", { source });
              clearDialogs();
              clearToasts();
              editor.updateInstanceState({ isFocusMode: !editor.getInstanceState().isFocusMode });
            });
          });
        }
      },
      {
        id: "toggle-grid",
        label: {
          default: "action.toggle-grid",
          menu: "action.toggle-grid.menu"
        },
        readonlyOk: true,
        kbd: "$'",
        onSelect(source) {
          trackEvent("toggle-grid-mode", { source });
          editor.updateInstanceState({ isGridMode: !editor.getInstanceState().isGridMode });
        },
        checkbox: true
      },
      {
        id: "toggle-debug-mode",
        label: {
          default: "action.toggle-debug-mode",
          menu: "action.toggle-debug-mode.menu"
        },
        readonlyOk: true,
        onSelect(source) {
          trackEvent("toggle-debug-mode", { source });
          editor.updateInstanceState({
            isDebugMode: !editor.getInstanceState().isDebugMode
          });
        },
        checkbox: true
      },
      {
        id: "print",
        label: "action.print",
        kbd: "$p",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("print", { source });
          printSelectionOrPages();
        }
      },
      {
        id: "exit-pen-mode",
        label: "action.exit-pen-mode",
        icon: "cross-2",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("exit-pen-mode", { source });
          editor.updateInstanceState({ isPenMode: false });
        }
      },
      {
        id: "stop-following",
        label: "action.stop-following",
        icon: "cross-2",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("stop-following", { source });
          editor.stopFollowingUser();
        }
      },
      {
        id: "back-to-content",
        label: "action.back-to-content",
        icon: "arrow-left",
        readonlyOk: true,
        onSelect(source) {
          trackEvent("zoom-to-content", { source });
          const bounds = editor.getSelectionPageBounds() ?? editor.getCurrentPageBounds();
          if (!bounds) return;
          editor.zoomToBounds(bounds, {
            targetZoom: Math.min(1, editor.getZoomLevel()),
            animation: { duration: 220 }
          });
        }
      },
      {
        id: "toggle-lock",
        label: "action.toggle-lock",
        kbd: "!l",
        onSelect(source) {
          editor.markHistoryStoppingPoint("locking");
          trackEvent("toggle-lock", { source });
          editor.toggleLock(editor.getSelectedShapeIds());
        }
      },
      {
        id: "move-to-new-page",
        label: "context.pages.new-page",
        onSelect(source) {
          const newPageId = import_editor.PageRecordType.createId();
          const ids = editor.getSelectedShapeIds();
          editor.run(() => {
            editor.markHistoryStoppingPoint("move_shapes_to_page");
            editor.createPage({ name: msg("page-menu.new-page-initial-name"), id: newPageId });
            editor.moveShapesToPage(ids, newPageId);
          });
          trackEvent("move-to-new-page", { source });
        }
      },
      {
        id: "select-white-color",
        label: "color-style.white",
        kbd: "?t",
        onSelect(source) {
          const style = import_editor.DefaultColorStyle;
          editor.run(() => {
            editor.markHistoryStoppingPoint("change-color");
            if (editor.isIn("select")) {
              editor.setStyleForSelectedShapes(style, "white");
            }
            editor.setStyleForNextShapes(style, "white");
          });
          trackEvent("set-style", { source, id: style.id, value: "white" });
        }
      },
      {
        id: "select-fill-fill",
        label: "fill-style.fill",
        kbd: "?f",
        onSelect(source) {
          const style = import_editor.DefaultFillStyle;
          editor.run(() => {
            editor.markHistoryStoppingPoint("change-fill");
            if (editor.isIn("select")) {
              editor.setStyleForSelectedShapes(style, "fill");
            }
            editor.setStyleForNextShapes(style, "fill");
          });
          trackEvent("set-style", { source, id: style.id, value: "fill" });
        }
      },
      {
        id: "flatten-to-image",
        label: "action.flatten-to-image",
        kbd: "!f",
        onSelect: async (source) => {
          const ids = editor.getSelectedShapeIds();
          if (ids.length === 0) return;
          editor.markHistoryStoppingPoint("flattening to image");
          trackEvent("flatten-to-image", { source });
          const newShapeIds = await (0, import_useFlatten.flattenShapesToImages)(
            editor,
            ids,
            editor.options.flattenImageBoundsExpand
          );
          if (newShapeIds?.length) {
            editor.setSelectedShapes(newShapeIds);
          }
        }
      }
    ];
    if (showCollaborationUi) {
      actionItems.push({
        id: "open-cursor-chat",
        label: "action.open-cursor-chat",
        readonlyOk: true,
        kbd: "/",
        onSelect(source) {
          trackEvent("open-cursor-chat", { source });
          if (editor.getInstanceState().isCoarsePointer) {
            return;
          }
          editor.timers.requestAnimationFrame(() => {
            editor.updateInstanceState({ isChatting: true });
          });
        }
      });
    }
    const actions2 = makeActions(actionItems);
    if (overrides) {
      return overrides(editor, actions2, void 0);
    }
    return actions2;
  }, [
    editor,
    trackEvent,
    overrides,
    addDialog,
    addToast,
    insertMedia,
    exportAs,
    copyAs,
    cut,
    copy,
    paste,
    clearDialogs,
    clearToasts,
    printSelectionOrPages,
    msg,
    defaultDocumentName,
    showCollaborationUi,
    getEmbedDefinition
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionsContext.Provider, { value: asActions(actions), children });
}
function useActions() {
  const ctx = React.useContext(ActionsContext);
  if (!ctx) {
    throw new Error("useTools must be used within a ToolProvider");
  }
  return ctx;
}
function asActions(actions) {
  return actions;
}
function unwrapLabel(label, menuType) {
  return label ? typeof label === "string" ? label : menuType ? label[menuType] ?? label["default"] : void 0 : void 0;
}
//# sourceMappingURL=actions.js.map
