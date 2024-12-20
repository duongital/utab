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
var Idle_exports = {};
__export(Idle_exports, {
  GRID_INCREMENT: () => GRID_INCREMENT,
  Idle: () => Idle,
  MAJOR_NUDGE_FACTOR: () => MAJOR_NUDGE_FACTOR,
  MINOR_NUDGE_FACTOR: () => MINOR_NUDGE_FACTOR
});
module.exports = __toCommonJS(Idle_exports);
var import_editor = require("@tldraw/editor");
var import_getHitShapeOnCanvasPointerDown = require("../../selection-logic/getHitShapeOnCanvasPointerDown");
var import_getShouldEnterCropModeOnPointerDown = require("../../selection-logic/getShouldEnterCropModeOnPointerDown");
var import_selectOnCanvasPointerUp = require("../../selection-logic/selectOnCanvasPointerUp");
var import_updateHoveredShapeId = require("../../selection-logic/updateHoveredShapeId");
var import_selectHelpers = require("../selectHelpers");
const SKIPPED_KEYS_FOR_AUTO_EDITING = [
  "Delete",
  "Backspace",
  "[",
  "]",
  "Enter",
  " ",
  "Shift",
  "Tab"
];
class Idle extends import_editor.StateNode {
  static id = "idle";
  onEnter() {
    this.parent.setCurrentToolIdMask(void 0);
    (0, import_updateHoveredShapeId.updateHoveredShapeId)(this.editor);
    this.editor.setCursor({ type: "default", rotation: 0 });
  }
  onExit() {
    import_updateHoveredShapeId.updateHoveredShapeId.cancel();
  }
  onPointerMove() {
    (0, import_updateHoveredShapeId.updateHoveredShapeId)(this.editor);
  }
  onPointerDown(info) {
    const shouldEnterCropMode = info.ctrlKey && (0, import_getShouldEnterCropModeOnPointerDown.getShouldEnterCropMode)(this.editor);
    switch (info.target) {
      case "canvas": {
        const hitShape = (0, import_getHitShapeOnCanvasPointerDown.getHitShapeOnCanvasPointerDown)(this.editor);
        if (hitShape && !hitShape.isLocked) {
          this.onPointerDown({
            ...info,
            shape: hitShape,
            target: "shape"
          });
          return;
        }
        const selectedShapeIds = this.editor.getSelectedShapeIds();
        const onlySelectedShape = this.editor.getOnlySelectedShape();
        const {
          inputs: { currentPagePoint }
        } = this.editor;
        if (selectedShapeIds.length > 1 || onlySelectedShape && !this.editor.getShapeUtil(onlySelectedShape).hideSelectionBoundsBg(onlySelectedShape)) {
          if (isPointInRotatedSelectionBounds(this.editor, currentPagePoint)) {
            this.onPointerDown({
              ...info,
              target: "selection"
            });
            return;
          }
        }
        this.parent.transition("pointing_canvas", info);
        break;
      }
      case "shape": {
        const { shape } = info;
        if (this.isOverArrowLabelTest(shape)) {
          this.parent.transition("pointing_arrow_label", info);
          break;
        }
        if (this.editor.isShapeOrAncestorLocked(shape)) {
          this.parent.transition("pointing_canvas", info);
          break;
        }
        this.parent.transition("pointing_shape", info);
        break;
      }
      case "handle": {
        if (this.editor.getIsReadonly()) break;
        if (this.editor.inputs.altKey) {
          this.parent.transition("pointing_shape", info);
        } else {
          this.parent.transition("pointing_handle", info);
        }
        break;
      }
      case "selection": {
        switch (info.handle) {
          case "mobile_rotate":
          case "top_left_rotate":
          case "top_right_rotate":
          case "bottom_left_rotate":
          case "bottom_right_rotate": {
            if (shouldEnterCropMode) {
              this.parent.transition("crop.pointing_crop_handle", info);
            } else {
              if (info.accelKey) {
                this.parent.transition("brushing", info);
                break;
              }
              this.parent.transition("pointing_rotate_handle", info);
            }
            break;
          }
          case "top":
          case "right":
          case "bottom":
          case "left":
          case "top_left":
          case "top_right":
          case "bottom_left":
          case "bottom_right": {
            if (shouldEnterCropMode) {
              this.parent.transition("crop.pointing_crop_handle", info);
            } else {
              if (info.accelKey) {
                this.parent.transition("brushing", info);
                break;
              }
              this.parent.transition("pointing_resize_handle", info);
            }
            break;
          }
          default: {
            const hoveredShape = this.editor.getHoveredShape();
            if (hoveredShape && !this.editor.getSelectedShapeIds().includes(hoveredShape.id) && !hoveredShape.isLocked) {
              this.onPointerDown({
                ...info,
                shape: hoveredShape,
                target: "shape"
              });
              return;
            }
            this.parent.transition("pointing_selection", info);
          }
        }
        break;
      }
    }
  }
  onDoubleClick(info) {
    if (this.editor.inputs.shiftKey || info.phase !== "up") return;
    if (info.ctrlKey || info.shiftKey) return;
    switch (info.target) {
      case "canvas": {
        const hoveredShape = this.editor.getHoveredShape();
        const hitShape = hoveredShape && !this.editor.isShapeOfType(hoveredShape, "group") ? hoveredShape : this.editor.getSelectedShapeAtPoint(this.editor.inputs.currentPagePoint) ?? this.editor.getShapeAtPoint(this.editor.inputs.currentPagePoint, {
          margin: this.editor.options.hitTestMargin / this.editor.getZoomLevel(),
          hitInside: false
        });
        const focusedGroupId = this.editor.getFocusedGroupId();
        if (hitShape) {
          if (this.editor.isShapeOfType(hitShape, "group")) {
            (0, import_selectOnCanvasPointerUp.selectOnCanvasPointerUp)(this.editor, info);
            return;
          } else {
            const parent = this.editor.getShape(hitShape.parentId);
            if (parent && this.editor.isShapeOfType(parent, "group")) {
              if (focusedGroupId && parent.id === focusedGroupId) {
              } else {
                (0, import_selectOnCanvasPointerUp.selectOnCanvasPointerUp)(this.editor, info);
                return;
              }
            }
          }
          this.onDoubleClick({
            ...info,
            shape: hitShape,
            target: "shape"
          });
          return;
        }
        if (!this.editor.inputs.shiftKey) {
          this.handleDoubleClickOnCanvas(info);
        }
        break;
      }
      case "selection": {
        if (this.editor.getIsReadonly()) break;
        const onlySelectedShape = this.editor.getOnlySelectedShape();
        if (onlySelectedShape) {
          const util = this.editor.getShapeUtil(onlySelectedShape);
          if (!this.canInteractWithShapeInReadOnly(onlySelectedShape)) {
            return;
          }
          if (info.handle === "right" || info.handle === "left" || info.handle === "top" || info.handle === "bottom") {
            const change = util.onDoubleClickEdge?.(onlySelectedShape);
            if (change) {
              this.editor.markHistoryStoppingPoint("double click edge");
              this.editor.updateShapes([change]);
              (0, import_selectHelpers.kickoutOccludedShapes)(this.editor, [onlySelectedShape.id]);
              return;
            }
          }
          if (util.canCrop(onlySelectedShape) && !this.editor.isShapeOrAncestorLocked(onlySelectedShape)) {
            this.parent.transition("crop", info);
            return;
          }
          if (this.shouldStartEditingShape(onlySelectedShape)) {
            this.startEditingShape(
              onlySelectedShape,
              info,
              true
              /* select all */
            );
          }
        }
        break;
      }
      case "shape": {
        const { shape } = info;
        const util = this.editor.getShapeUtil(shape);
        if (shape.type !== "video" && shape.type !== "embed" && this.editor.getIsReadonly()) break;
        if (util.onDoubleClick) {
          const change = util.onDoubleClick?.(shape);
          if (change) {
            this.editor.updateShapes([change]);
            return;
          }
        }
        if (util.canCrop(shape) && !this.editor.isShapeOrAncestorLocked(shape)) {
          this.editor.markHistoryStoppingPoint("select and crop");
          this.editor.select(info.shape?.id);
          this.parent.transition("crop", info);
          return;
        }
        if (this.shouldStartEditingShape(shape)) {
          this.startEditingShape(
            shape,
            info,
            true
            /* select all */
          );
        } else {
          this.handleDoubleClickOnCanvas(info);
        }
        break;
      }
      case "handle": {
        if (this.editor.getIsReadonly()) break;
        const { shape, handle } = info;
        const util = this.editor.getShapeUtil(shape);
        const changes = util.onDoubleClickHandle?.(shape, handle);
        if (changes) {
          this.editor.updateShapes([changes]);
        } else {
          if (this.shouldStartEditingShape(shape)) {
            this.startEditingShape(
              shape,
              info,
              true
              /* select all */
            );
          }
        }
      }
    }
  }
  onRightClick(info) {
    switch (info.target) {
      case "canvas": {
        const hoveredShape = this.editor.getHoveredShape();
        const hitShape = hoveredShape && !this.editor.isShapeOfType(hoveredShape, "group") ? hoveredShape : this.editor.getShapeAtPoint(this.editor.inputs.currentPagePoint, {
          margin: this.editor.options.hitTestMargin / this.editor.getZoomLevel(),
          hitInside: false,
          hitLabels: true,
          hitLocked: true,
          hitFrameInside: true,
          renderingOnly: true
        });
        if (hitShape) {
          this.onRightClick({
            ...info,
            shape: hitShape,
            target: "shape"
          });
          return;
        }
        const selectedShapeIds = this.editor.getSelectedShapeIds();
        const onlySelectedShape = this.editor.getOnlySelectedShape();
        const {
          inputs: { currentPagePoint }
        } = this.editor;
        if (selectedShapeIds.length > 1 || onlySelectedShape && !this.editor.getShapeUtil(onlySelectedShape).hideSelectionBoundsBg(onlySelectedShape)) {
          if (isPointInRotatedSelectionBounds(this.editor, currentPagePoint)) {
            this.onRightClick({
              ...info,
              target: "selection"
            });
            return;
          }
        }
        this.editor.selectNone();
        break;
      }
      case "shape": {
        const { selectedShapeIds } = this.editor.getCurrentPageState();
        const { shape } = info;
        const targetShape = this.editor.getOutermostSelectableShape(
          shape,
          (parent) => !selectedShapeIds.includes(parent.id)
        );
        if (!selectedShapeIds.includes(targetShape.id) && !this.editor.findShapeAncestor(
          targetShape,
          (shape2) => selectedShapeIds.includes(shape2.id)
        )) {
          this.editor.markHistoryStoppingPoint("selecting shape");
          this.editor.setSelectedShapes([targetShape.id]);
        }
        break;
      }
    }
  }
  onCancel() {
    if (this.editor.getFocusedGroupId() !== this.editor.getCurrentPageId() && this.editor.getSelectedShapeIds().length > 0) {
      this.editor.popFocusedGroupId();
    } else {
      this.editor.markHistoryStoppingPoint("clearing selection");
      this.editor.selectNone();
    }
  }
  onKeyDown(info) {
    switch (info.code) {
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown": {
        this.nudgeSelectedShapes(false);
        return;
      }
    }
    if (import_editor.debugFlags["editOnType"].get()) {
      if (!SKIPPED_KEYS_FOR_AUTO_EDITING.includes(info.key) && !info.altKey && !info.ctrlKey) {
        const onlySelectedShape = this.editor.getOnlySelectedShape();
        if (onlySelectedShape && // If it's a note shape, then edit on type
        this.editor.isShapeOfType(onlySelectedShape, "note") && // If it's not locked or anything
        this.shouldStartEditingShape(onlySelectedShape)) {
          this.startEditingShape(
            onlySelectedShape,
            {
              ...info,
              target: "shape",
              shape: onlySelectedShape
            },
            true
            /* select all */
          );
          return;
        }
      }
    }
  }
  onKeyRepeat(info) {
    switch (info.code) {
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown": {
        this.nudgeSelectedShapes(true);
        break;
      }
    }
  }
  onKeyUp(info) {
    switch (info.code) {
      case "Enter": {
        const selectedShapes = this.editor.getSelectedShapes();
        if (selectedShapes.every((shape) => this.editor.isShapeOfType(shape, "group"))) {
          this.editor.setSelectedShapes(
            selectedShapes.flatMap((shape) => this.editor.getSortedChildIdsForParent(shape.id))
          );
          return;
        }
        const onlySelectedShape = this.editor.getOnlySelectedShape();
        if (onlySelectedShape && this.shouldStartEditingShape(onlySelectedShape)) {
          this.startEditingShape(
            onlySelectedShape,
            {
              ...info,
              target: "shape",
              shape: onlySelectedShape
            },
            true
            /* select all */
          );
          return;
        }
        if ((0, import_getShouldEnterCropModeOnPointerDown.getShouldEnterCropMode)(this.editor)) {
          this.parent.transition("crop", info);
        }
        break;
      }
    }
  }
  shouldStartEditingShape(shape = this.editor.getOnlySelectedShape()) {
    if (!shape) return false;
    if (this.editor.isShapeOrAncestorLocked(shape) && shape.type !== "embed") return false;
    if (!this.canInteractWithShapeInReadOnly(shape)) return false;
    return this.editor.getShapeUtil(shape).canEdit(shape);
  }
  startEditingShape(shape, info, shouldSelectAll) {
    if (this.editor.isShapeOrAncestorLocked(shape) && shape.type !== "embed") return;
    this.editor.markHistoryStoppingPoint("editing shape");
    (0, import_selectHelpers.startEditingShapeWithLabel)(this.editor, shape, shouldSelectAll);
    this.parent.transition("editing_shape", info);
  }
  isOverArrowLabelTest(shape) {
    if (!shape) return false;
    const pointInShapeSpace = this.editor.getPointInShapeSpace(
      shape,
      this.editor.inputs.currentPagePoint
    );
    if (this.editor.isShapeOfType(shape, "arrow")) {
      const labelGeometry = this.editor.getShapeGeometry(shape).children[1];
      if (labelGeometry && (0, import_editor.pointInPolygon)(pointInShapeSpace, labelGeometry.vertices)) {
        return true;
      }
    }
    return false;
  }
  handleDoubleClickOnCanvas(info) {
    if (this.editor.getIsReadonly()) return;
    if (!this.editor.options.createTextOnCanvasDoubleClick) return;
    this.editor.markHistoryStoppingPoint("creating text shape");
    const id = (0, import_editor.createShapeId)();
    const { x, y } = this.editor.inputs.currentPagePoint;
    this.editor.createShapes([
      {
        id,
        type: "text",
        x,
        y,
        props: {
          text: "",
          autoSize: true
        }
      }
    ]);
    const shape = this.editor.getShape(id);
    if (!shape) return;
    const util = this.editor.getShapeUtil(shape);
    if (this.editor.getIsReadonly()) {
      if (!util.canEditInReadOnly(shape)) {
        return;
      }
    }
    this.editor.setEditingShape(id);
    this.editor.select(id);
    this.parent.transition("editing_shape", info);
  }
  nudgeSelectedShapes(ephemeral = false) {
    const {
      editor: {
        inputs: { keys }
      }
    } = this;
    const shiftKey = keys.has("ShiftLeft");
    const delta = new import_editor.Vec(0, 0);
    if (keys.has("ArrowLeft")) delta.x -= 1;
    if (keys.has("ArrowRight")) delta.x += 1;
    if (keys.has("ArrowUp")) delta.y -= 1;
    if (keys.has("ArrowDown")) delta.y += 1;
    if (delta.equals(new import_editor.Vec(0, 0))) return;
    if (!ephemeral) this.editor.markHistoryStoppingPoint("nudge shapes");
    const { gridSize } = this.editor.getDocumentSettings();
    const step = this.editor.getInstanceState().isGridMode ? shiftKey ? gridSize * GRID_INCREMENT : gridSize : shiftKey ? MAJOR_NUDGE_FACTOR : MINOR_NUDGE_FACTOR;
    const selectedShapeIds = this.editor.getSelectedShapeIds();
    this.editor.nudgeShapes(selectedShapeIds, delta.mul(step));
    (0, import_selectHelpers.kickoutOccludedShapes)(this.editor, selectedShapeIds);
  }
  canInteractWithShapeInReadOnly(shape) {
    if (!this.editor.getIsReadonly()) return true;
    const util = this.editor.getShapeUtil(shape);
    if (util.canEditInReadOnly(shape)) return true;
    return false;
  }
}
const MAJOR_NUDGE_FACTOR = 10;
const MINOR_NUDGE_FACTOR = 1;
const GRID_INCREMENT = 5;
function isPointInRotatedSelectionBounds(editor, point) {
  const selectionBounds = editor.getSelectionRotatedPageBounds();
  if (!selectionBounds) return false;
  const selectionRotation = editor.getSelectionRotation();
  if (!selectionRotation) return selectionBounds.containsPoint(point);
  return (0, import_editor.pointInPolygon)(
    point,
    selectionBounds.corners.map((c) => import_editor.Vec.RotWith(c, selectionBounds.point, selectionRotation))
  );
}
//# sourceMappingURL=Idle.js.map
