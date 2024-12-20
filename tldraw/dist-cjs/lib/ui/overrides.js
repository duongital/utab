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
var overrides_exports = {};
__export(overrides_exports, {
  mergeOverrides: () => mergeOverrides,
  useDefaultHelpers: () => useDefaultHelpers,
  useMergedOverrides: () => useMergedOverrides,
  useMergedTranslationOverrides: () => useMergedTranslationOverrides
});
module.exports = __toCommonJS(overrides_exports);
var import_editor = require("@tldraw/editor");
var import_react = require("react");
var import_constants = require("./constants");
var import_breakpoints = require("./context/breakpoints");
var import_dialogs = require("./context/dialogs");
var import_toasts = require("./context/toasts");
var import_useTranslation = require("./hooks/useTranslation/useTranslation");
function useDefaultHelpers() {
  const { addToast, removeToast, clearToasts } = (0, import_toasts.useToasts)();
  const { addDialog, clearDialogs, removeDialog } = (0, import_dialogs.useDialogs)();
  const breakpoint = (0, import_breakpoints.useBreakpoint)();
  const isMobile = breakpoint < import_constants.PORTRAIT_BREAKPOINT.TABLET_SM;
  const msg = (0, import_useTranslation.useTranslation)();
  return (0, import_react.useMemo)(
    () => ({
      addToast,
      removeToast,
      clearToasts,
      addDialog,
      removeDialog,
      clearDialogs,
      msg,
      isMobile
    }),
    [addDialog, addToast, clearDialogs, clearToasts, msg, removeDialog, removeToast, isMobile]
  );
}
function mergeOverrides(overrides, defaultHelpers) {
  const mergedTranslations = {};
  for (const override of overrides) {
    if (override.translations) {
      for (const [key, value] of (0, import_editor.objectMapEntries)(override.translations)) {
        let strings = mergedTranslations[key];
        if (!strings) {
          strings = mergedTranslations[key] = {};
        }
        Object.assign(strings, value);
      }
    }
  }
  return {
    actions: (editor, schema) => {
      for (const override of overrides) {
        if (override.actions) {
          schema = override.actions(editor, schema, defaultHelpers);
        }
      }
      return schema;
    },
    tools: (editor, schema, helpers) => {
      for (const override of overrides) {
        if (override.tools) {
          schema = override.tools(editor, schema, { ...defaultHelpers, ...helpers });
        }
      }
      return schema;
    },
    translations: mergedTranslations
  };
}
function useShallowArrayEquality(array) {
  return (0, import_react.useMemo)(() => array, array);
}
function useMergedTranslationOverrides(overrides) {
  const overridesArray = useShallowArrayEquality(
    overrides == null ? [] : Array.isArray(overrides) ? overrides : [overrides]
  );
  return (0, import_react.useMemo)(() => {
    const mergedTranslations = {};
    for (const override of overridesArray) {
      if (override.translations) {
        for (const [key, value] of (0, import_editor.objectMapEntries)(override.translations)) {
          let strings = mergedTranslations[key];
          if (!strings) {
            strings = mergedTranslations[key] = {};
          }
          Object.assign(strings, value);
        }
      }
    }
    return mergedTranslations;
  }, [overridesArray]);
}
function useMergedOverrides(overrides) {
  const defaultHelpers = useDefaultHelpers();
  const overridesArray = useShallowArrayEquality(
    overrides == null ? [] : Array.isArray(overrides) ? overrides : [overrides]
  );
  return (0, import_react.useMemo)(
    () => mergeOverrides(overridesArray, defaultHelpers),
    [overridesArray, defaultHelpers]
  );
}
//# sourceMappingURL=overrides.js.map
