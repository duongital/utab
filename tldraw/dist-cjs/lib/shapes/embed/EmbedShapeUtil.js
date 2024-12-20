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
var EmbedShapeUtil_exports = {};
__export(EmbedShapeUtil_exports, {
  EmbedShapeUtil: () => EmbedShapeUtil
});
module.exports = __toCommonJS(EmbedShapeUtil_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var import_defaultEmbedDefinitions = require("../../defaultEmbedDefinitions");
var import_embeds = require("../../utils/embeds/embeds");
var import_rotated_box_shadow = require("../shared/rotated-box-shadow");
const getSandboxPermissions = (permissions) => {
  return Object.entries(permissions).filter(([_perm, isEnabled]) => isEnabled).map(([perm]) => perm).join(" ");
};
class EmbedShapeUtil extends import_editor.BaseBoxShapeUtil {
  static type = "embed";
  static props = import_editor.embedShapeProps;
  static migrations = import_editor.embedShapeMigrations;
  embedDefinitions = import_defaultEmbedDefinitions.DEFAULT_EMBED_DEFINITIONS;
  setEmbedDefinitions(definitions) {
    this.embedDefinitions = definitions;
  }
  getEmbedDefinitions() {
    return this.embedDefinitions;
  }
  getEmbedDefinition(url) {
    return (0, import_embeds.getEmbedInfo)(this.embedDefinitions, url);
  }
  getText(shape) {
    return shape.props.url;
  }
  hideSelectionBoundsFg(shape) {
    return !this.canResize(shape);
  }
  canEdit() {
    return true;
  }
  canResize(shape) {
    return !!this.getEmbedDefinition(shape.props.url)?.definition?.doesResize;
  }
  canEditInReadOnly() {
    return true;
  }
  getDefaultProps() {
    return {
      w: 300,
      h: 300,
      url: ""
    };
  }
  isAspectRatioLocked(shape) {
    const embedInfo = this.getEmbedDefinition(shape.props.url);
    return embedInfo?.definition.isAspectRatioLocked ?? false;
  }
  onResize(shape, info) {
    const isAspectRatioLocked = this.isAspectRatioLocked(shape);
    const embedInfo = this.getEmbedDefinition(shape.props.url);
    let minWidth = embedInfo?.definition.minWidth ?? 200;
    let minHeight = embedInfo?.definition.minHeight ?? 200;
    if (isAspectRatioLocked) {
      const aspectRatio = shape.props.w / shape.props.h;
      if (aspectRatio > 1) {
        minWidth *= aspectRatio;
      } else {
        minHeight /= aspectRatio;
      }
    }
    return (0, import_editor.resizeBox)(shape, info, { minWidth, minHeight });
  }
  component(shape) {
    const svgExport = (0, import_editor.useSvgExportContext)();
    const { w, h, url } = shape.props;
    const isEditing = (0, import_editor.useIsEditing)(shape.id);
    const embedInfo = this.getEmbedDefinition(url);
    const isHoveringWhileEditingSameShape = (0, import_editor.useValue)(
      "is hovering",
      () => {
        const { editingShapeId, hoveredShapeId } = this.editor.getCurrentPageState();
        if (editingShapeId && hoveredShapeId !== editingShapeId) {
          const editingShape = this.editor.getShape(editingShapeId);
          if (editingShape && this.editor.isShapeOfType(editingShape, "embed")) {
            return true;
          }
        }
        return false;
      },
      []
    );
    const pageRotation = this.editor.getShapePageTransform(shape).rotation();
    if (svgExport) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.HTMLContainer, { className: "tl-embed-container", id: shape.id, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: "tl-embed",
          style: {
            border: 0,
            boxShadow: (0, import_rotated_box_shadow.getRotatedBoxShadow)(pageRotation),
            borderRadius: embedInfo?.definition.overrideOutlineRadius ?? 8,
            background: embedInfo?.definition.backgroundColor ?? "var(--color-background)",
            width: w,
            height: h
          }
        }
      ) });
    }
    const isInteractive = isEditing || isHoveringWhileEditingSameShape;
    const isIframe = typeof window !== "undefined" && (window !== window.top || window.self !== window.parent);
    if (isIframe && embedInfo?.definition.type === "tldraw") return null;
    if (embedInfo?.definition.type === "github_gist") {
      const idFromGistUrl = embedInfo.url.split("/").pop();
      if (!idFromGistUrl) throw Error("No gist id!");
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.HTMLContainer, { className: "tl-embed-container", id: shape.id, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Gist,
        {
          id: idFromGistUrl,
          width: (0, import_editor.toDomPrecision)(w),
          height: (0, import_editor.toDomPrecision)(h),
          isInteractive,
          pageRotation
        }
      ) });
    }
    const sandbox = getSandboxPermissions({
      ...import_defaultEmbedDefinitions.embedShapePermissionDefaults,
      ...embedInfo?.definition.overridePermissions ?? {}
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.HTMLContainer, { className: "tl-embed-container", id: shape.id, children: embedInfo?.definition ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "iframe",
      {
        className: "tl-embed",
        sandbox,
        src: embedInfo.embedUrl,
        width: (0, import_editor.toDomPrecision)(w),
        height: (0, import_editor.toDomPrecision)(h),
        draggable: false,
        frameBorder: "0",
        referrerPolicy: "no-referrer-when-downgrade",
        style: {
          border: 0,
          pointerEvents: isInteractive ? "auto" : "none",
          // Fix for safari <https://stackoverflow.com/a/49150908>
          zIndex: isInteractive ? "" : "-1",
          boxShadow: (0, import_rotated_box_shadow.getRotatedBoxShadow)(pageRotation),
          borderRadius: embedInfo?.definition.overrideOutlineRadius ?? 8,
          background: embedInfo?.definition.backgroundColor
        }
      }
    ) : null });
  }
  indicator(shape) {
    const embedInfo = this.getEmbedDefinition(shape.props.url);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        width: (0, import_editor.toDomPrecision)(shape.props.w),
        height: (0, import_editor.toDomPrecision)(shape.props.h),
        rx: embedInfo?.definition.overrideOutlineRadius ?? 8,
        ry: embedInfo?.definition.overrideOutlineRadius ?? 8
      }
    );
  }
  getInterpolatedProps(startShape, endShape, t) {
    return {
      ...t > 0.5 ? endShape.props : startShape.props,
      w: (0, import_editor.lerp)(startShape.props.w, endShape.props.w, t),
      h: (0, import_editor.lerp)(startShape.props.h, endShape.props.h, t)
    };
  }
}
function Gist({
  id,
  file,
  isInteractive,
  width,
  height,
  style,
  pageRotation
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "iframe",
    {
      className: "tl-embed",
      draggable: false,
      width: (0, import_editor.toDomPrecision)(width),
      height: (0, import_editor.toDomPrecision)(height),
      frameBorder: "0",
      scrolling: "no",
      seamless: true,
      referrerPolicy: "no-referrer-when-downgrade",
      style: {
        ...style,
        pointerEvents: isInteractive ? "all" : "none",
        // Fix for safari <https://stackoverflow.com/a/49150908>
        zIndex: isInteractive ? "" : "-1",
        boxShadow: (0, import_rotated_box_shadow.getRotatedBoxShadow)(pageRotation)
      },
      srcDoc: `
			<html>
				<head>
					<base target="_blank">
				</head>
				<body>
					<script src=${`https://gist.github.com/${id}.js${file ? `?file=${file}` : ""}`}></script>
					<style type="text/css">
						* { margin: 0px; }
						table { height: 100%; background-color: red; }
						.gist { background-color: none; height: 100%;  }
						.gist .gist-file { height: calc(100vh - 2px); padding: 0px; display: grid; grid-template-rows: 1fr auto; }
					</style>
				</body>
			</html>`
    }
  );
}
//# sourceMappingURL=EmbedShapeUtil.js.map
