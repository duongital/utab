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
var DefaultMainMenuContent_exports = {};
__export(DefaultMainMenuContent_exports, {
  DefaultMainMenuContent: () => DefaultMainMenuContent,
  EditSubmenu: () => EditSubmenu,
  ExportFileContentSubMenu: () => ExportFileContentSubMenu,
  ExtrasGroup: () => ExtrasGroup,
  LockGroup: () => LockGroup,
  MiscMenuGroup: () => MiscMenuGroup,
  PreferencesGroup: () => PreferencesGroup,
  UndoRedoGroup: () => UndoRedoGroup,
  ViewSubmenu: () => ViewSubmenu
});
module.exports = __toCommonJS(DefaultMainMenuContent_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var import_menu_hooks = require("../../hooks/menu-hooks");
var import_ColorSchemeMenu = require("../ColorSchemeMenu");
var import_DefaultHelpMenuContent = require("../HelpMenu/DefaultHelpMenuContent");
var import_LanguageMenu = require("../LanguageMenu");
var import_menu_items = require("../menu-items");
var import_TldrawUiMenuActionItem = require("../primitives/menus/TldrawUiMenuActionItem");
var import_TldrawUiMenuGroup = require("../primitives/menus/TldrawUiMenuGroup");
var import_TldrawUiMenuSubmenu = require("../primitives/menus/TldrawUiMenuSubmenu");
function DefaultMainMenuContent() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSubmenu, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewSubmenu, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportFileContentSubMenu, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtrasGroup, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesGroup, {})
  ] });
}
function ExportFileContentSubMenu() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuSubmenu.TldrawUiMenuSubmenu, { id: "export-all-as", label: "context-menu.export-all-as", size: "small", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "export-all-as-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "export-all-as-svg" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "export-all-as-png" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "export-all-as-json" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "export-all-as-bg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleTransparentBgMenuItem, {}) })
  ] });
}
function EditSubmenu() {
  const editor = (0, import_editor.useEditor)();
  const selectToolActive = (0, import_editor.useValue)(
    "isSelectToolActive",
    () => editor.getCurrentToolId() === "select",
    [editor]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuSubmenu.TldrawUiMenuSubmenu, { id: "edit", label: "menu.edit", disabled: !selectToolActive, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UndoRedoGroup, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ClipboardMenuGroup, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ConversionsMenuGroup, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiscMenuGroup, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGroup, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "select-all", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.SelectAllMenuItem, {}) })
  ] });
}
function MiscMenuGroup() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "misc", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.GroupMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.UngroupMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.EditLinkMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleAutoSizeMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.RemoveFrameMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.FitFrameToContentMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ConvertToEmbedMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ConvertToBookmarkMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.FlattenMenuItem, {})
  ] });
}
function LockGroup() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "lock", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleLockMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.UnlockAllMenuItem, {})
  ] });
}
function UndoRedoGroup() {
  const canUndo = (0, import_menu_hooks.useCanUndo)();
  const canRedo = (0, import_menu_hooks.useCanRedo)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "undo-redo", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "undo", disabled: !canUndo }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "redo", disabled: !canRedo })
  ] });
}
function ViewSubmenu() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuSubmenu.TldrawUiMenuSubmenu, { id: "view", label: "menu.view", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "view-actions", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "zoom-in" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "zoom-out" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ZoomTo100MenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ZoomToFitMenuItem, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ZoomToSelectionMenuItem, {})
  ] }) });
}
function ExtrasGroup() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "extras", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "insert-embed" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuActionItem.TldrawUiMenuActionItem, { actionId: "insert-media" })
  ] });
}
function PreferencesGroup() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "preferences", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuSubmenu.TldrawUiMenuSubmenu, { id: "preferences", label: "menu.preferences", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "preferences-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleSnapModeItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleToolLockItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleGridItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleWrapModeItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleFocusModeItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleEdgeScrollingItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleReduceMotionItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleDynamicSizeModeItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.TogglePasteAtCursorItem, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_menu_items.ToggleDebugModeItem, {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_TldrawUiMenuGroup.TldrawUiMenuGroup, { id: "color-scheme", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ColorSchemeMenu.ColorSchemeMenu, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_LanguageMenu.LanguageMenu, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_DefaultHelpMenuContent.KeyboardShortcutsMenuItem, {})
  ] });
}
//# sourceMappingURL=DefaultMainMenuContent.js.map
