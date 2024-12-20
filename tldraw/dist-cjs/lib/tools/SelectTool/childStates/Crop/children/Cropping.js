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
var Cropping_exports = {};
__export(Cropping_exports, {
  Cropping: () => Cropping
});
module.exports = __toCommonJS(Cropping_exports);
var import_editor = require("@tldraw/editor");
var import_selectHelpers = require("../../../selectHelpers");
var import_PointingResizeHandle = require("../../PointingResizeHandle");
var import_crop_constants = require("../crop-constants");
class Cropping extends import_editor.StateNode {
  static id = "cropping";
  info = {};
  markId = "";
  snapshot = {};
  onEnter(info) {
    this.info = info;
    this.markId = this.editor.markHistoryStoppingPoint("cropping");
    this.snapshot = this.createSnapshot();
    this.updateShapes();
  }
  onPointerMove() {
    this.updateShapes();
  }
  onPointerUp() {
    this.complete();
  }
  onComplete() {
    this.complete();
  }
  onCancel() {
    this.cancel();
  }
  updateCursor() {
    const selectedShape = this.editor.getSelectedShapes()[0];
    if (!selectedShape) return;
    const cursorType = import_PointingResizeHandle.CursorTypeMap[this.info.handle];
    this.editor.setCursor({ type: cursorType, rotation: this.editor.getSelectionRotation() });
  }
  getDefaultCrop() {
    return {
      topLeft: { x: 0, y: 0 },
      bottomRight: { x: 1, y: 1 }
    };
  }
  updateShapes() {
    const { shape, cursorHandleOffset } = this.snapshot;
    if (!shape) return;
    const util = this.editor.getShapeUtil("image");
    if (!util) return;
    const props = shape.props;
    const currentPagePoint = this.editor.inputs.currentPagePoint.clone().sub(cursorHandleOffset);
    const originPagePoint = this.editor.inputs.originPagePoint.clone().sub(cursorHandleOffset);
    const change = currentPagePoint.clone().sub(originPagePoint).rot(-shape.rotation);
    const crop = props.crop ?? this.getDefaultCrop();
    const newCrop = (0, import_editor.structuredClone)(crop);
    const newPoint = new import_editor.Vec(shape.x, shape.y);
    const pointDelta = new import_editor.Vec(0, 0);
    const w = 1 / (crop.bottomRight.x - crop.topLeft.x) * props.w;
    const h = 1 / (crop.bottomRight.y - crop.topLeft.y) * props.h;
    let hasCropChanged = false;
    switch (this.info.handle) {
      case "top":
      case "top_left":
      case "top_right": {
        if (h < import_crop_constants.MIN_CROP_SIZE) break;
        hasCropChanged = true;
        newCrop.topLeft.y = newCrop.topLeft.y + change.y / h;
        const heightAfterCrop = h * (newCrop.bottomRight.y - newCrop.topLeft.y);
        if (heightAfterCrop < import_crop_constants.MIN_CROP_SIZE) {
          newCrop.topLeft.y = newCrop.bottomRight.y - import_crop_constants.MIN_CROP_SIZE / h;
          pointDelta.y = (newCrop.topLeft.y - crop.topLeft.y) * h;
        } else {
          if (newCrop.topLeft.y <= 0) {
            newCrop.topLeft.y = 0;
            pointDelta.y = (newCrop.topLeft.y - crop.topLeft.y) * h;
          } else {
            pointDelta.y = change.y;
          }
        }
        break;
      }
      case "bottom":
      case "bottom_left":
      case "bottom_right": {
        if (h < import_crop_constants.MIN_CROP_SIZE) break;
        hasCropChanged = true;
        newCrop.bottomRight.y = Math.min(1, newCrop.bottomRight.y + change.y / h);
        const heightAfterCrop = h * (newCrop.bottomRight.y - newCrop.topLeft.y);
        if (heightAfterCrop < import_crop_constants.MIN_CROP_SIZE) {
          newCrop.bottomRight.y = newCrop.topLeft.y + import_crop_constants.MIN_CROP_SIZE / h;
        }
        break;
      }
    }
    switch (this.info.handle) {
      case "left":
      case "top_left":
      case "bottom_left": {
        if (w < import_crop_constants.MIN_CROP_SIZE) break;
        hasCropChanged = true;
        newCrop.topLeft.x = newCrop.topLeft.x + change.x / w;
        const widthAfterCrop = w * (newCrop.bottomRight.x - newCrop.topLeft.x);
        if (widthAfterCrop < import_crop_constants.MIN_CROP_SIZE) {
          newCrop.topLeft.x = newCrop.bottomRight.x - import_crop_constants.MIN_CROP_SIZE / w;
          pointDelta.x = (newCrop.topLeft.x - crop.topLeft.x) * w;
        } else {
          if (newCrop.topLeft.x <= 0) {
            newCrop.topLeft.x = 0;
            pointDelta.x = (newCrop.topLeft.x - crop.topLeft.x) * w;
          } else {
            pointDelta.x = change.x;
          }
        }
        break;
      }
      case "right":
      case "top_right":
      case "bottom_right": {
        if (w < import_crop_constants.MIN_CROP_SIZE) break;
        hasCropChanged = true;
        newCrop.bottomRight.x = Math.min(1, newCrop.bottomRight.x + change.x / w);
        const widthAfterCrop = w * (newCrop.bottomRight.x - newCrop.topLeft.x);
        if (widthAfterCrop < import_crop_constants.MIN_CROP_SIZE) {
          newCrop.bottomRight.x = newCrop.topLeft.x + import_crop_constants.MIN_CROP_SIZE / w;
        }
        break;
      }
    }
    if (!hasCropChanged) return;
    newPoint.add(pointDelta.rot(shape.rotation));
    const partial = {
      id: shape.id,
      type: shape.type,
      x: newPoint.x,
      y: newPoint.y,
      props: {
        crop: newCrop,
        w: (newCrop.bottomRight.x - newCrop.topLeft.x) * w,
        h: (newCrop.bottomRight.y - newCrop.topLeft.y) * h
      }
    };
    this.editor.updateShapes([partial]);
    this.updateCursor();
  }
  complete() {
    this.updateShapes();
    (0, import_selectHelpers.kickoutOccludedShapes)(this.editor, [this.snapshot.shape.id]);
    if (this.info.onInteractionEnd) {
      this.editor.setCurrentTool(this.info.onInteractionEnd, this.info);
    } else {
      this.editor.setCroppingShape(null);
      this.editor.setCurrentTool("select.idle");
    }
  }
  cancel() {
    this.editor.bailToMark(this.markId);
    if (this.info.onInteractionEnd) {
      this.editor.setCurrentTool(this.info.onInteractionEnd, this.info);
    } else {
      this.editor.setCroppingShape(null);
      this.editor.setCurrentTool("select.idle");
    }
  }
  createSnapshot() {
    const selectionRotation = this.editor.getSelectionRotation();
    const {
      inputs: { originPagePoint }
    } = this.editor;
    const shape = this.editor.getOnlySelectedShape();
    const selectionBounds = this.editor.getSelectionRotatedPageBounds();
    const dragHandlePoint = import_editor.Vec.RotWith(
      selectionBounds.getHandlePoint(this.info.handle),
      selectionBounds.point,
      selectionRotation
    );
    const cursorHandleOffset = import_editor.Vec.Sub(originPagePoint, dragHandlePoint);
    return {
      shape,
      cursorHandleOffset
    };
  }
}
//# sourceMappingURL=Cropping.js.map
