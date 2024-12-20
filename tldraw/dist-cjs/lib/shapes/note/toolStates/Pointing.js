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
var Pointing_exports = {};
__export(Pointing_exports, {
  Pointing: () => Pointing,
  createNoteShape: () => createNoteShape,
  getNoteShapeAdjacentPositionOffset: () => getNoteShapeAdjacentPositionOffset
});
module.exports = __toCommonJS(Pointing_exports);
var import_editor = require("@tldraw/editor");
var import_noteHelpers = require("../noteHelpers");
class Pointing extends import_editor.StateNode {
  static id = "pointing";
  dragged = false;
  info = {};
  markId = "";
  shape = {};
  onEnter() {
    const { editor } = this;
    const id = (0, import_editor.createShapeId)();
    this.markId = editor.markHistoryStoppingPoint(`creating_note:${id}`);
    const center = this.editor.inputs.originPagePoint.clone();
    const offset = getNoteShapeAdjacentPositionOffset(
      this.editor,
      center,
      this.editor.user.getIsDynamicResizeMode() ? 1 / this.editor.getZoomLevel() : 1
    );
    if (offset) {
      center.sub(offset);
    }
    this.shape = createNoteShape(this.editor, id, center);
  }
  onPointerMove(info) {
    if (this.editor.inputs.isDragging) {
      this.editor.setCurrentTool("select.translating", {
        ...info,
        target: "shape",
        shape: this.shape,
        onInteractionEnd: "note",
        isCreating: true,
        creatingMarkId: this.markId,
        onCreate: () => {
          this.editor.setEditingShape(this.shape.id);
          this.editor.setCurrentTool("select.editing_shape");
        }
      });
    }
  }
  onPointerUp() {
    this.complete();
  }
  onInterrupt() {
    this.cancel();
  }
  onComplete() {
    this.complete();
  }
  onCancel() {
    this.cancel();
  }
  complete() {
    if (this.editor.getInstanceState().isToolLocked) {
      this.parent.transition("idle");
    } else {
      this.editor.setEditingShape(this.shape.id);
      this.editor.setCurrentTool("select.editing_shape", {
        ...this.info,
        target: "shape",
        shape: this.shape
      });
    }
  }
  cancel() {
    this.editor.bailToMark(this.markId);
    this.parent.transition("idle", this.info);
  }
}
function getNoteShapeAdjacentPositionOffset(editor, center, scale) {
  let min = import_noteHelpers.NOTE_ADJACENT_POSITION_SNAP_RADIUS / editor.getZoomLevel();
  let offset;
  for (const pit of (0, import_noteHelpers.getAvailableNoteAdjacentPositions)(editor, 0, scale, 0)) {
    const deltaToPit = import_editor.Vec.Sub(center, pit);
    const dist = deltaToPit.len();
    if (dist < min) {
      min = dist;
      offset = deltaToPit;
    }
  }
  return offset;
}
function createNoteShape(editor, id, center) {
  const newPoint = (0, import_editor.maybeSnapToGrid)(center, editor);
  editor.createShape({
    id,
    type: "note",
    x: newPoint.x,
    y: newPoint.y,
    props: {
      scale: editor.user.getIsDynamicResizeMode() ? 1 / editor.getZoomLevel() : 1
    }
  }).select(id);
  const shape = editor.getShape(id);
  const bounds = editor.getShapeGeometry(shape).bounds;
  editor.updateShapes([
    {
      id,
      type: "note",
      x: shape.x - bounds.width / 2,
      y: shape.y - bounds.height / 2
    }
  ]);
  return editor.getShape(id);
}
//# sourceMappingURL=Pointing.js.map
