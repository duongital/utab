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
var TldrawSelectionForeground_exports = {};
__export(TldrawSelectionForeground_exports, {
  MobileRotateHandle: () => MobileRotateHandle,
  RotateCornerHandle: () => RotateCornerHandle,
  TldrawSelectionForeground: () => TldrawSelectionForeground
});
module.exports = __toCommonJS(TldrawSelectionForeground_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_editor = require("@tldraw/editor");
var import_classnames = __toESM(require("classnames"));
var import_react = require("react");
var import_useReadonly = require("../ui/hooks/useReadonly");
var import_TldrawCropHandles = require("./TldrawCropHandles");
const TldrawSelectionForeground = (0, import_editor.track)(function TldrawSelectionForeground2({
  bounds,
  rotation
}) {
  const editor = (0, import_editor.useEditor)();
  const rSvg = (0, import_react.useRef)(null);
  const isReadonlyMode = (0, import_useReadonly.useReadonly)();
  const topEvents = (0, import_editor.useSelectionEvents)("top");
  const rightEvents = (0, import_editor.useSelectionEvents)("right");
  const bottomEvents = (0, import_editor.useSelectionEvents)("bottom");
  const leftEvents = (0, import_editor.useSelectionEvents)("left");
  const topLeftEvents = (0, import_editor.useSelectionEvents)("top_left");
  const topRightEvents = (0, import_editor.useSelectionEvents)("top_right");
  const bottomRightEvents = (0, import_editor.useSelectionEvents)("bottom_right");
  const bottomLeftEvents = (0, import_editor.useSelectionEvents)("bottom_left");
  const isDefaultCursor = editor.getInstanceState().cursor.type === "default";
  const isCoarsePointer = editor.getInstanceState().isCoarsePointer;
  const onlyShape = editor.getOnlySelectedShape();
  const isLockedShape = onlyShape && editor.isShapeOrAncestorLocked(onlyShape);
  const expandOutlineBy = onlyShape ? editor.getShapeUtil(onlyShape).expandSelectionOutlinePx(onlyShape) : 0;
  (0, import_editor.useTransform)(rSvg, bounds?.x, bounds?.y, 1, editor.getSelectionRotation(), {
    x: -expandOutlineBy,
    y: -expandOutlineBy
  });
  if (onlyShape && editor.isShapeHidden(onlyShape)) return null;
  if (!bounds) return null;
  bounds = bounds.clone().expandBy(expandOutlineBy).zeroFix();
  const zoom = editor.getZoomLevel();
  const isChangingStyle = editor.getInstanceState().isChangingStyle;
  const width = bounds.width;
  const height = bounds.height;
  const size = 8 / zoom;
  const isTinyX = width < size * 2;
  const isTinyY = height < size * 2;
  const isSmallX = width < size * 4;
  const isSmallY = height < size * 4;
  const isSmallCropX = width < size * 5;
  const isSmallCropY = height < size * 5;
  const mobileHandleMultiplier = isCoarsePointer ? 1.75 : 1;
  const targetSize = 6 / zoom * mobileHandleMultiplier;
  const targetSizeX = (isSmallX ? targetSize / 2 : targetSize) * (mobileHandleMultiplier * 0.75);
  const targetSizeY = (isSmallY ? targetSize / 2 : targetSize) * (mobileHandleMultiplier * 0.75);
  const showSelectionBounds = (onlyShape ? !editor.getShapeUtil(onlyShape).hideSelectionBoundsFg(onlyShape) : true) && !isChangingStyle;
  let shouldDisplayBox = showSelectionBounds && editor.isInAny(
    "select.idle",
    "select.brushing",
    "select.scribble_brushing",
    "select.pointing_canvas",
    "select.pointing_selection",
    "select.pointing_shape",
    "select.crop.idle",
    "select.crop.pointing_crop",
    "select.crop.pointing_crop_handle",
    "select.pointing_resize_handle"
  ) || showSelectionBounds && editor.isIn("select.resizing") && onlyShape && editor.isShapeOfType(onlyShape, "text");
  if (onlyShape && shouldDisplayBox) {
    if (import_editor.tlenv.isFirefox && editor.isShapeOfType(onlyShape, "embed")) {
      shouldDisplayBox = false;
    }
  }
  const showCropHandles = editor.isInAny(
    "select.crop.idle",
    "select.crop.pointing_crop",
    "select.crop.pointing_crop_handle"
  ) && !isChangingStyle && !isReadonlyMode;
  const shouldDisplayControls = editor.isInAny(
    "select.idle",
    "select.pointing_selection",
    "select.pointing_shape",
    "select.crop.idle"
  ) && !isChangingStyle && !isReadonlyMode;
  const showCornerRotateHandles = !isCoarsePointer && !(isTinyX || isTinyY) && (shouldDisplayControls || showCropHandles) && (onlyShape ? !editor.getShapeUtil(onlyShape).hideRotateHandle(onlyShape) : true) && !isLockedShape;
  const showMobileRotateHandle = isCoarsePointer && (!isSmallX || !isSmallY) && (shouldDisplayControls || showCropHandles) && (onlyShape ? !editor.getShapeUtil(onlyShape).hideRotateHandle(onlyShape) : true) && !isLockedShape;
  const showResizeHandles = shouldDisplayControls && (onlyShape ? editor.getShapeUtil(onlyShape).canResize(onlyShape) && !editor.getShapeUtil(onlyShape).hideResizeHandles(onlyShape) : true) && !showCropHandles && !isLockedShape;
  const hideAlternateCornerHandles = isTinyX || isTinyY;
  const showOnlyOneHandle = isTinyX && isTinyY;
  const hideAlternateCropHandles = isSmallCropX || isSmallCropY;
  const showHandles = showResizeHandles || showCropHandles;
  const hideRotateCornerHandles = !showCornerRotateHandles;
  const hideMobileRotateHandle = !shouldDisplayControls || !showMobileRotateHandle;
  const hideTopLeftCorner = !shouldDisplayControls || !showHandles;
  const hideTopRightCorner = !shouldDisplayControls || !showHandles || hideAlternateCornerHandles;
  const hideBottomLeftCorner = !shouldDisplayControls || !showHandles || hideAlternateCornerHandles;
  const hideBottomRightCorner = !shouldDisplayControls || !showHandles || showOnlyOneHandle && !showCropHandles;
  let hideVerticalEdgeTargets = true;
  let hideHorizontalEdgeTargets = true;
  if (showCropHandles) {
    hideVerticalEdgeTargets = hideAlternateCropHandles;
    hideHorizontalEdgeTargets = hideAlternateCropHandles;
  } else if (showResizeHandles) {
    hideVerticalEdgeTargets = hideAlternateCornerHandles || showOnlyOneHandle || isCoarsePointer;
    const isMobileAndTextShape = isCoarsePointer && onlyShape && onlyShape.type === "text";
    hideHorizontalEdgeTargets = hideVerticalEdgeTargets && !isMobileAndTextShape;
  }
  const textHandleHeight = Math.min(24 / zoom, height - targetSizeY * 3);
  const showTextResizeHandles = shouldDisplayControls && isCoarsePointer && onlyShape && editor.isShapeOfType(onlyShape, "text") && textHandleHeight * zoom >= 4;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "tl-overlays__item tl-selection__fg", "data-testid": "selection-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { ref: rSvg, children: [
    shouldDisplayBox && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: "tl-selection__fg__outline",
        width: (0, import_editor.toDomPrecision)(width),
        height: (0, import_editor.toDomPrecision)(height)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RotateCornerHandle,
      {
        "data-testid": "selection.rotate.top-left",
        cx: 0,
        cy: 0,
        targetSize,
        corner: "top_left_rotate",
        cursor: isDefaultCursor ? (0, import_editor.getCursor)("nwse-rotate", rotation) : void 0,
        isHidden: hideRotateCornerHandles
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RotateCornerHandle,
      {
        "data-testid": "selection.rotate.top-right",
        cx: width + targetSize * 3,
        cy: 0,
        targetSize,
        corner: "top_right_rotate",
        cursor: isDefaultCursor ? (0, import_editor.getCursor)("nesw-rotate", rotation) : void 0,
        isHidden: hideRotateCornerHandles
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RotateCornerHandle,
      {
        "data-testid": "selection.rotate.bottom-left",
        cx: 0,
        cy: height + targetSize * 3,
        targetSize,
        corner: "bottom_left_rotate",
        cursor: isDefaultCursor ? (0, import_editor.getCursor)("swne-rotate", rotation) : void 0,
        isHidden: hideRotateCornerHandles
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RotateCornerHandle,
      {
        "data-testid": "selection.rotate.bottom-right",
        cx: width + targetSize * 3,
        cy: height + targetSize * 3,
        targetSize,
        corner: "bottom_right_rotate",
        cursor: isDefaultCursor ? (0, import_editor.getCursor)("senw-rotate", rotation) : void 0,
        isHidden: hideRotateCornerHandles
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MobileRotateHandle,
      {
        "data-testid": "selection.rotate.mobile",
        cx: isSmallX ? -targetSize * 1.5 : width / 2,
        cy: isSmallX ? height / 2 : -targetSize * 1.5,
        size,
        isHidden: hideMobileRotateHandle
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideVerticalEdgeTargets
        }),
        "data-testid": "selection.resize.top",
        "aria-label": "top target",
        pointerEvents: "all",
        x: 0,
        y: (0, import_editor.toDomPrecision)(0 - (isSmallY ? targetSizeY * 2 : targetSizeY)),
        width: (0, import_editor.toDomPrecision)(width),
        height: (0, import_editor.toDomPrecision)(Math.max(1, targetSizeY * 2)),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("ns-resize", rotation) } : void 0,
        ...topEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideHorizontalEdgeTargets
        }),
        "data-testid": "selection.resize.right",
        "aria-label": "right target",
        pointerEvents: "all",
        x: (0, import_editor.toDomPrecision)(width - (isSmallX ? 0 : targetSizeX)),
        y: 0,
        height: (0, import_editor.toDomPrecision)(height),
        width: (0, import_editor.toDomPrecision)(Math.max(1, targetSizeX * 2)),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("ew-resize", rotation) } : void 0,
        ...rightEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideVerticalEdgeTargets
        }),
        "data-testid": "selection.resize.bottom",
        "aria-label": "bottom target",
        pointerEvents: "all",
        x: 0,
        y: (0, import_editor.toDomPrecision)(height - (isSmallY ? 0 : targetSizeY)),
        width: (0, import_editor.toDomPrecision)(width),
        height: (0, import_editor.toDomPrecision)(Math.max(1, targetSizeY * 2)),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("ns-resize", rotation) } : void 0,
        ...bottomEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideHorizontalEdgeTargets
        }),
        "data-testid": "selection.resize.left",
        "aria-label": "left target",
        pointerEvents: "all",
        x: (0, import_editor.toDomPrecision)(0 - (isSmallX ? targetSizeX * 2 : targetSizeX)),
        y: 0,
        height: (0, import_editor.toDomPrecision)(height),
        width: (0, import_editor.toDomPrecision)(Math.max(1, targetSizeX * 2)),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("ew-resize", rotation) } : void 0,
        ...leftEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideTopLeftCorner
        }),
        "data-testid": "selection.target.top-left",
        "aria-label": "top-left target",
        pointerEvents: "all",
        x: (0, import_editor.toDomPrecision)(0 - (isSmallX ? targetSizeX * 2 : targetSizeX * 1.5)),
        y: (0, import_editor.toDomPrecision)(0 - (isSmallY ? targetSizeY * 2 : targetSizeY * 1.5)),
        width: (0, import_editor.toDomPrecision)(targetSizeX * 3),
        height: (0, import_editor.toDomPrecision)(targetSizeY * 3),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("nwse-resize", rotation) } : void 0,
        ...topLeftEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideTopRightCorner
        }),
        "data-testid": "selection.target.top-right",
        "aria-label": "top-right target",
        pointerEvents: "all",
        x: (0, import_editor.toDomPrecision)(width - (isSmallX ? 0 : targetSizeX * 1.5)),
        y: (0, import_editor.toDomPrecision)(0 - (isSmallY ? targetSizeY * 2 : targetSizeY * 1.5)),
        width: (0, import_editor.toDomPrecision)(targetSizeX * 3),
        height: (0, import_editor.toDomPrecision)(targetSizeY * 3),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("nesw-resize", rotation) } : void 0,
        ...topRightEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideBottomRightCorner
        }),
        "data-testid": "selection.target.bottom-right",
        "aria-label": "bottom-right target",
        pointerEvents: "all",
        x: (0, import_editor.toDomPrecision)(width - (isSmallX ? targetSizeX : targetSizeX * 1.5)),
        y: (0, import_editor.toDomPrecision)(height - (isSmallY ? targetSizeY : targetSizeY * 1.5)),
        width: (0, import_editor.toDomPrecision)(targetSizeX * 3),
        height: (0, import_editor.toDomPrecision)(targetSizeY * 3),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("nwse-resize", rotation) } : void 0,
        ...bottomRightEvents
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "rect",
      {
        className: (0, import_classnames.default)("tl-transparent", {
          "tl-hidden": hideBottomLeftCorner
        }),
        "data-testid": "selection.target.bottom-left",
        "aria-label": "bottom-left target",
        pointerEvents: "all",
        x: (0, import_editor.toDomPrecision)(0 - (isSmallX ? targetSizeX * 3 : targetSizeX * 1.5)),
        y: (0, import_editor.toDomPrecision)(height - (isSmallY ? 0 : targetSizeY * 1.5)),
        width: (0, import_editor.toDomPrecision)(targetSizeX * 3),
        height: (0, import_editor.toDomPrecision)(targetSizeY * 3),
        style: isDefaultCursor ? { cursor: (0, import_editor.getCursor)("nesw-resize", rotation) } : void 0,
        ...bottomLeftEvents
      }
    ),
    showResizeHandles && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "rect",
        {
          "data-testid": "selection.resize.top-left",
          className: (0, import_classnames.default)("tl-corner-handle", {
            "tl-hidden": hideTopLeftCorner
          }),
          "aria-label": "top_left handle",
          x: (0, import_editor.toDomPrecision)(0 - size / 2),
          y: (0, import_editor.toDomPrecision)(0 - size / 2),
          width: (0, import_editor.toDomPrecision)(size),
          height: (0, import_editor.toDomPrecision)(size)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "rect",
        {
          "data-testid": "selection.resize.top-right",
          className: (0, import_classnames.default)("tl-corner-handle", {
            "tl-hidden": hideTopRightCorner
          }),
          "aria-label": "top_right handle",
          x: (0, import_editor.toDomPrecision)(width - size / 2),
          y: (0, import_editor.toDomPrecision)(0 - size / 2),
          width: (0, import_editor.toDomPrecision)(size),
          height: (0, import_editor.toDomPrecision)(size)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "rect",
        {
          "data-testid": "selection.resize.bottom-right",
          className: (0, import_classnames.default)("tl-corner-handle", {
            "tl-hidden": hideBottomRightCorner
          }),
          "aria-label": "bottom_right handle",
          x: (0, import_editor.toDomPrecision)(width - size / 2),
          y: (0, import_editor.toDomPrecision)(height - size / 2),
          width: (0, import_editor.toDomPrecision)(size),
          height: (0, import_editor.toDomPrecision)(size)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "rect",
        {
          "data-testid": "selection.resize.bottom-left",
          className: (0, import_classnames.default)("tl-corner-handle", {
            "tl-hidden": hideBottomLeftCorner
          }),
          "aria-label": "bottom_left handle",
          x: (0, import_editor.toDomPrecision)(0 - size / 2),
          y: (0, import_editor.toDomPrecision)(height - size / 2),
          width: (0, import_editor.toDomPrecision)(size),
          height: (0, import_editor.toDomPrecision)(size)
        }
      )
    ] }),
    showTextResizeHandles && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "rect",
        {
          "data-testid": "selection.text-resize.left.handle",
          className: "tl-text-handle",
          "aria-label": "bottom_left handle",
          x: (0, import_editor.toDomPrecision)(0 - size / 4),
          y: (0, import_editor.toDomPrecision)(height / 2 - textHandleHeight / 2),
          rx: size / 4,
          width: (0, import_editor.toDomPrecision)(size / 2),
          height: (0, import_editor.toDomPrecision)(textHandleHeight)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "rect",
        {
          "data-testid": "selection.text-resize.right.handle",
          className: "tl-text-handle",
          "aria-label": "bottom_left handle",
          rx: size / 4,
          x: (0, import_editor.toDomPrecision)(width - size / 4),
          y: (0, import_editor.toDomPrecision)(height / 2 - textHandleHeight / 2),
          width: (0, import_editor.toDomPrecision)(size / 2),
          height: (0, import_editor.toDomPrecision)(textHandleHeight)
        }
      )
    ] }),
    showCropHandles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_TldrawCropHandles.TldrawCropHandles,
      {
        ...{
          size,
          width,
          height,
          hideAlternateHandles: hideAlternateCropHandles
        }
      }
    )
  ] }) });
});
const RotateCornerHandle = function RotateCornerHandle2({
  cx,
  cy,
  targetSize,
  corner,
  cursor,
  isHidden,
  "data-testid": testId
}) {
  const events = (0, import_editor.useSelectionEvents)(corner);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "rect",
    {
      className: (0, import_classnames.default)("tl-transparent", "tl-rotate-corner", { "tl-hidden": isHidden }),
      "data-testid": testId,
      "aria-label": `${corner} target`,
      pointerEvents: "all",
      x: (0, import_editor.toDomPrecision)(cx - targetSize * 3),
      y: (0, import_editor.toDomPrecision)(cy - targetSize * 3),
      width: (0, import_editor.toDomPrecision)(Math.max(1, targetSize * 3)),
      height: (0, import_editor.toDomPrecision)(Math.max(1, targetSize * 3)),
      cursor,
      ...events
    }
  );
};
const SQUARE_ROOT_PI = Math.sqrt(Math.PI);
const MobileRotateHandle = function RotateHandle({
  cx,
  cy,
  size,
  isHidden,
  "data-testid": testId
}) {
  const events = (0, import_editor.useSelectionEvents)("mobile_rotate");
  const editor = (0, import_editor.useEditor)();
  const zoom = (0, import_editor.useValue)("zoom level", () => editor.getZoomLevel(), [editor]);
  const bgRadius = Math.max(14 * (1 / zoom), 20 / Math.max(1, zoom));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "circle",
      {
        "data-testid": testId,
        pointerEvents: "all",
        className: (0, import_classnames.default)("tl-transparent", "tl-mobile-rotate__bg", { "tl-hidden": isHidden }),
        cx,
        cy,
        r: bgRadius,
        ...events
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "circle",
      {
        className: (0, import_classnames.default)("tl-mobile-rotate__fg", { "tl-hidden": isHidden }),
        cx,
        cy,
        r: size / SQUARE_ROOT_PI
      }
    )
  ] });
};
//# sourceMappingURL=TldrawSelectionForeground.js.map
