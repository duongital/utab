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
var VideoShapeUtil_exports = {};
__export(VideoShapeUtil_exports, {
  VideoShapeUtil: () => VideoShapeUtil
});
module.exports = __toCommonJS(VideoShapeUtil_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var import_classnames = __toESM(require("classnames"));
var import_react = require("react");
var import_BrokenAssetIcon = require("../shared/BrokenAssetIcon");
var import_HyperlinkButton = require("../shared/HyperlinkButton");
var import_useImageOrVideoAsset = require("../shared/useImageOrVideoAsset");
var import_usePrefersReducedMotion = require("../shared/usePrefersReducedMotion");
class VideoShapeUtil extends import_editor.BaseBoxShapeUtil {
  static type = "video";
  static props = import_editor.videoShapeProps;
  static migrations = import_editor.videoShapeMigrations;
  canEdit() {
    return true;
  }
  isAspectRatioLocked() {
    return true;
  }
  getDefaultProps() {
    return {
      w: 100,
      h: 100,
      assetId: null,
      time: 0,
      playing: true,
      url: ""
    };
  }
  component(shape) {
    const { asset, url } = (0, import_useImageOrVideoAsset.useImageOrVideoAsset)({
      shapeId: shape.id,
      assetId: shape.props.assetId
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoShape, { editor: this.editor, shape, asset, url });
  }
  indicator(shape) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { width: (0, import_editor.toDomPrecision)(shape.props.w), height: (0, import_editor.toDomPrecision)(shape.props.h) });
  }
  async toSvg(shape) {
    const image = await serializeVideo(this.editor, shape);
    if (!image) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", { href: image, width: shape.props.w, height: shape.props.h });
  }
}
const VideoShape = (0, import_react.memo)(function VideoShape2({
  editor,
  shape,
  asset,
  url
}) {
  const showControls = editor.getShapeGeometry(shape).bounds.w * editor.getZoomLevel() >= 110;
  const isEditing = (0, import_editor.useIsEditing)(shape.id);
  const prefersReducedMotion = (0, import_usePrefersReducedMotion.usePrefersReducedMotion)();
  const { Spinner } = (0, import_editor.useEditorComponents)();
  const rVideo = (0, import_react.useRef)(null);
  const [isLoaded, setIsLoaded] = (0, import_react.useState)(false);
  const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const fullscreenChange = () => setIsFullscreen(document.fullscreenElement === rVideo.current);
    document.addEventListener("fullscreenchange", fullscreenChange);
    return () => document.removeEventListener("fullscreenchange", fullscreenChange);
  });
  const handleLoadedData = (0, import_react.useCallback)((e) => {
    const video = e.currentTarget;
    if (!video) return;
    setIsLoaded(true);
  }, []);
  (0, import_react.useEffect)(() => {
    const video = rVideo.current;
    if (!video) return;
    if (isEditing) {
      if (document.activeElement !== video) {
        video.focus();
      }
    }
  }, [isEditing, isLoaded]);
  (0, import_react.useEffect)(() => {
    if (prefersReducedMotion) {
      const video = rVideo.current;
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    }
  }, [rVideo, prefersReducedMotion]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_editor.HTMLContainer,
      {
        id: shape.id,
        style: {
          color: "var(--color-text-3)",
          backgroundColor: asset ? "transparent" : "var(--color-low)",
          border: asset ? "none" : "1px solid var(--color-low-border)"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tl-counter-scaled", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tl-video-container", children: !asset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_BrokenAssetIcon.BrokenAssetIcon, {}) : Spinner && !asset.props.src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {}) : url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "video",
            {
              ref: rVideo,
              style: isEditing ? { pointerEvents: "all" } : !isLoaded ? { display: "none" } : void 0,
              className: (0, import_classnames.default)("tl-video", `tl-video-shape-${shape.id.split(":")[1]}`, {
                "tl-video-is-fullscreen": isFullscreen
              }),
              width: "100%",
              height: "100%",
              draggable: false,
              playsInline: true,
              autoPlay: true,
              muted: true,
              loop: true,
              disableRemotePlayback: true,
              disablePictureInPicture: true,
              controls: isEditing && showControls,
              onLoadedData: handleLoadedData,
              hidden: !isLoaded,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", { src: url })
            }
          ),
          !isLoaded && Spinner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {})
        ] }) : null }) })
      }
    ),
    "url" in shape.props && shape.props.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_HyperlinkButton.HyperlinkButton, { url: shape.props.url })
  ] });
});
async function serializeVideo(editor, shape) {
  const assetUrl = await editor.resolveAssetUrl(shape.props.assetId, {
    shouldResolveToOriginal: true
  });
  if (!assetUrl) return null;
  const video = await import_editor.MediaHelpers.loadVideo(assetUrl);
  return import_editor.MediaHelpers.getVideoFrameAsDataUrl(video, 0);
}
//# sourceMappingURL=VideoShapeUtil.js.map
