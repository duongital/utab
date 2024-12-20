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
var Tldraw_exports = {};
__export(Tldraw_exports, {
  Tldraw: () => Tldraw
});
module.exports = __toCommonJS(Tldraw_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var import_react = require("react");
var import_TldrawHandles = require("./canvas/TldrawHandles");
var import_TldrawScribble = require("./canvas/TldrawScribble");
var import_TldrawSelectionBackground = require("./canvas/TldrawSelectionBackground");
var import_TldrawSelectionForeground = require("./canvas/TldrawSelectionForeground");
var import_TldrawShapeIndicators = require("./canvas/TldrawShapeIndicators");
var import_defaultBindingUtils = require("./defaultBindingUtils");
var import_defaultExternalContentHandlers = require("./defaultExternalContentHandlers");
var import_defaultShapeTools = require("./defaultShapeTools");
var import_defaultShapeUtils = require("./defaultShapeUtils");
var import_defaultSideEffects = require("./defaultSideEffects");
var import_defaultTools = require("./defaultTools");
var import_TldrawUi = require("./ui/TldrawUi");
var import_components = require("./ui/context/components");
var import_toasts = require("./ui/context/toasts");
var import_usePreloadAssets = require("./ui/hooks/usePreloadAssets");
var import_useTranslation = require("./ui/hooks/useTranslation/useTranslation");
var import_assetUrls = require("./utils/static-assets/assetUrls");
function Tldraw(props) {
  const {
    children,
    maxImageDimension,
    maxAssetSize,
    acceptedImageMimeTypes,
    acceptedVideoMimeTypes,
    onMount,
    components = {},
    shapeUtils = [],
    bindingUtils = [],
    tools = [],
    embeds,
    ...rest
  } = props;
  const _components = (0, import_editor.useShallowObjectIdentity)(components);
  const componentsWithDefault = (0, import_react.useMemo)(
    () => ({
      Scribble: import_TldrawScribble.TldrawScribble,
      ShapeIndicators: import_TldrawShapeIndicators.TldrawShapeIndicators,
      CollaboratorScribble: import_TldrawScribble.TldrawScribble,
      SelectionForeground: import_TldrawSelectionForeground.TldrawSelectionForeground,
      SelectionBackground: import_TldrawSelectionBackground.TldrawSelectionBackground,
      Handles: import_TldrawHandles.TldrawHandles,
      ..._components
    }),
    [_components]
  );
  const _shapeUtils = (0, import_editor.useShallowArrayIdentity)(shapeUtils);
  const shapeUtilsWithDefaults = (0, import_react.useMemo)(
    () => [...import_defaultShapeUtils.defaultShapeUtils, ..._shapeUtils],
    [_shapeUtils]
  );
  const _bindingUtils = (0, import_editor.useShallowArrayIdentity)(bindingUtils);
  const bindingUtilsWithDefaults = (0, import_react.useMemo)(
    () => [...import_defaultBindingUtils.defaultBindingUtils, ..._bindingUtils],
    [_bindingUtils]
  );
  const _tools = (0, import_editor.useShallowArrayIdentity)(tools);
  const toolsWithDefaults = (0, import_react.useMemo)(
    () => [...import_defaultTools.defaultTools, ...import_defaultShapeTools.defaultShapeTools, ..._tools],
    [_tools]
  );
  const _imageMimeTypes = (0, import_editor.useShallowArrayIdentity)(
    acceptedImageMimeTypes ?? import_editor.DEFAULT_SUPPORTED_IMAGE_TYPES
  );
  const _videoMimeTypes = (0, import_editor.useShallowArrayIdentity)(
    acceptedVideoMimeTypes ?? import_editor.DEFAULT_SUPPORT_VIDEO_TYPES
  );
  const mediaMimeTypes = (0, import_react.useMemo)(
    () => [..._imageMimeTypes, ..._videoMimeTypes],
    [_imageMimeTypes, _videoMimeTypes]
  );
  const assets = (0, import_assetUrls.useDefaultEditorAssetsWithOverrides)(rest.assetUrls);
  const { done: preloadingComplete, error: preloadingError } = (0, import_usePreloadAssets.usePreloadAssets)(assets);
  if (preloadingError) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorScreen, { children: "Could not load assets. Please refresh the page." });
  }
  if (!preloadingComplete) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.LoadingScreen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.DefaultSpinner, {}) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_editor.TldrawEditor,
    {
      initialState: "select",
      ...rest,
      components: componentsWithDefault,
      shapeUtils: shapeUtilsWithDefaults,
      bindingUtils: bindingUtilsWithDefaults,
      tools: toolsWithDefaults,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_TldrawUi.TldrawUi, { ...rest, components: componentsWithDefault, mediaMimeTypes, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          InsideOfEditorAndUiContext,
          {
            maxImageDimension,
            maxAssetSize,
            acceptedImageMimeTypes: _imageMimeTypes,
            acceptedVideoMimeTypes: _videoMimeTypes,
            onMount,
            embeds
          }
        ),
        children
      ] })
    }
  );
}
function InsideOfEditorAndUiContext({
  maxImageDimension = 5e3,
  maxAssetSize = 10 * 1024 * 1024,
  // 10mb
  acceptedImageMimeTypes = import_editor.DEFAULT_SUPPORTED_IMAGE_TYPES,
  acceptedVideoMimeTypes = import_editor.DEFAULT_SUPPORT_VIDEO_TYPES,
  onMount,
  embeds
}) {
  const editor = (0, import_editor.useEditor)();
  const toasts = (0, import_toasts.useToasts)();
  const msg = (0, import_useTranslation.useTranslation)();
  (0, import_editor.useOnMount)(() => {
    const embedUtil = editor.getShapeUtil("embed");
    if (embedUtil && embeds) {
      embedUtil.setEmbedDefinitions(embeds);
    }
    const unsubs = [];
    unsubs.push((0, import_defaultSideEffects.registerDefaultSideEffects)(editor));
    (0, import_defaultExternalContentHandlers.registerDefaultExternalContentHandlers)(
      editor,
      {
        maxImageDimension,
        maxAssetSize,
        acceptedImageMimeTypes,
        acceptedVideoMimeTypes
      },
      {
        toasts,
        msg
      }
    );
    unsubs.push(editor.store.props.onMount(editor));
    unsubs.push(onMount?.(editor));
    return () => {
      unsubs.forEach((fn) => fn?.());
    };
  });
  const { Canvas } = (0, import_editor.useEditorComponents)();
  const { ContextMenu } = (0, import_components.useTldrawUiComponents)();
  if (ContextMenu) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextMenu, {});
  }
  if (Canvas) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {});
  }
  return null;
}
//# sourceMappingURL=Tldraw.js.map
