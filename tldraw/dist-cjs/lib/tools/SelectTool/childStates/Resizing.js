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
var Resizing_exports = {};
__export(Resizing_exports, {
  Resizing: () => Resizing,
  rotateSelectionHandle: () => rotateSelectionHandle
});
module.exports = __toCommonJS(Resizing_exports);
var import_editor = require("@tldraw/editor");
var import_selectHelpers = require("../selectHelpers");
class Resizing extends import_editor.StateNode {
  static id = "resizing";
  info = {};
  markId = "";
  // A switch to detect when the user is holding ctrl
  didHoldCommand = false;
  // we transition into the resizing state from the geo pointing state, which starts with a shape of size w: 1, h: 1,
  // so if the user drags x: +50, y: +50 after mouseDown, the shape will be w: 51, h: 51, which is too many pixels, alas
  // so we allow passing a further offset into this state to negate such issues
  creationCursorOffset = { x: 0, y: 0 };
  snapshot = {};
  onEnter(info) {
    const { isCreating = false, creatingMarkId, creationCursorOffset = { x: 0, y: 0 } } = info;
    this.info = info;
    this.didHoldCommand = false;
    this.parent.setCurrentToolIdMask(info.onInteractionEnd);
    this.creationCursorOffset = creationCursorOffset;
    this.snapshot = this._createSnapshot();
    this.markId = "";
    if (isCreating) {
      if (creatingMarkId) {
        this.markId = creatingMarkId;
      } else {
        const markId = this.editor.getMarkIdMatching(
          `creating:${this.editor.getOnlySelectedShapeId()}`
        );
        if (markId) {
          this.markId = markId;
        }
      }
    } else {
      this.markId = this.editor.markHistoryStoppingPoint("starting resizing");
    }
    if (isCreating) {
      this.editor.setCursor({ type: "cross", rotation: 0 });
    }
    this.handleResizeStart();
    this.updateShapes();
  }
  onTick({ elapsed }) {
    const { editor } = this;
    editor.edgeScrollManager.updateEdgeScrolling(elapsed);
  }
  onPointerMove() {
    this.updateShapes();
  }
  onKeyDown() {
    this.updateShapes();
  }
  onKeyUp() {
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
  cancel() {
    this.editor.bailToMark(this.markId);
    if (this.info.onInteractionEnd) {
      this.editor.setCurrentTool(this.info.onInteractionEnd, {});
    } else {
      this.parent.transition("idle");
    }
  }
  complete() {
    (0, import_selectHelpers.kickoutOccludedShapes)(this.editor, this.snapshot.selectedShapeIds);
    this.handleResizeEnd();
    if (this.info.isCreating && this.info.onCreate) {
      this.info.onCreate?.(this.editor.getOnlySelectedShape());
      return;
    }
    if (this.editor.getInstanceState().isToolLocked && this.info.onInteractionEnd) {
      this.editor.setCurrentTool(this.info.onInteractionEnd, {});
      return;
    }
    this.parent.transition("idle");
  }
  handleResizeStart() {
    const { shapeSnapshots } = this.snapshot;
    const changes = [];
    shapeSnapshots.forEach(({ shape }) => {
      const util = this.editor.getShapeUtil(shape);
      const change = util.onResizeStart?.(shape);
      if (change) {
        changes.push(change);
      }
    });
    if (changes.length > 0) {
      this.editor.updateShapes(changes);
    }
  }
  handleResizeEnd() {
    const { shapeSnapshots } = this.snapshot;
    const changes = [];
    shapeSnapshots.forEach(({ shape }) => {
      const current = this.editor.getShape(shape.id);
      const util = this.editor.getShapeUtil(shape);
      const change = util.onResizeEnd?.(shape, current);
      if (change) {
        changes.push(change);
      }
    });
    if (changes.length > 0) {
      this.editor.updateShapes(changes);
    }
  }
  updateShapes() {
    const { altKey, shiftKey } = this.editor.inputs;
    const {
      frames,
      shapeSnapshots,
      selectionBounds,
      cursorHandleOffset,
      selectedShapeIds,
      selectionRotation,
      canShapesDeform
    } = this.snapshot;
    let isAspectRatioLocked = shiftKey || !canShapesDeform;
    if (shapeSnapshots.size === 1) {
      const onlySnapshot = [...shapeSnapshots.values()][0];
      if (this.editor.isShapeOfType(onlySnapshot.shape, "text")) {
        isAspectRatioLocked = !(this.info.handle === "left" || this.info.handle === "right");
      }
    }
    const { ctrlKey } = this.editor.inputs;
    const currentPagePoint = this.editor.inputs.currentPagePoint.clone().sub(cursorHandleOffset).sub(this.creationCursorOffset);
    const originPagePoint = this.editor.inputs.originPagePoint.clone().sub(cursorHandleOffset);
    if (this.editor.getInstanceState().isGridMode && !ctrlKey) {
      const { gridSize } = this.editor.getDocumentSettings();
      currentPagePoint.snapToGrid(gridSize);
    }
    const dragHandle = this.info.handle;
    const scaleOriginHandle = rotateSelectionHandle(dragHandle, Math.PI);
    this.editor.snaps.clearIndicators();
    const shouldSnap = this.editor.user.getIsSnapMode() ? !ctrlKey : ctrlKey;
    if (shouldSnap && selectionRotation % import_editor.HALF_PI === 0) {
      const { nudge } = this.editor.snaps.shapeBounds.snapResizeShapes({
        dragDelta: import_editor.Vec.Sub(currentPagePoint, originPagePoint),
        initialSelectionPageBounds: this.snapshot.initialSelectionPageBounds,
        handle: rotateSelectionHandle(dragHandle, selectionRotation),
        isAspectRatioLocked,
        isResizingFromCenter: altKey
      });
      currentPagePoint.add(nudge);
    }
    const scaleOriginPage = import_editor.Vec.RotWith(
      altKey ? selectionBounds.center : selectionBounds.getHandlePoint(scaleOriginHandle),
      selectionBounds.point,
      selectionRotation
    );
    const distanceFromScaleOriginNow = import_editor.Vec.Sub(currentPagePoint, scaleOriginPage).rot(
      -selectionRotation
    );
    const distanceFromScaleOriginAtStart = import_editor.Vec.Sub(originPagePoint, scaleOriginPage).rot(
      -selectionRotation
    );
    const scale = import_editor.Vec.DivV(distanceFromScaleOriginNow, distanceFromScaleOriginAtStart);
    if (!Number.isFinite(scale.x)) scale.x = 1;
    if (!Number.isFinite(scale.y)) scale.y = 1;
    const isXLocked = dragHandle === "top" || dragHandle === "bottom";
    const isYLocked = dragHandle === "left" || dragHandle === "right";
    if (isAspectRatioLocked) {
      if (isYLocked) {
        scale.y = Math.abs(scale.x);
      } else if (isXLocked) {
        scale.x = Math.abs(scale.y);
      } else if (Math.abs(scale.x) > Math.abs(scale.y)) {
        scale.y = Math.abs(scale.x) * (scale.y < 0 ? -1 : 1);
      } else {
        scale.x = Math.abs(scale.y) * (scale.x < 0 ? -1 : 1);
      }
    } else {
      if (isXLocked) {
        scale.x = 1;
      }
      if (isYLocked) {
        scale.y = 1;
      }
    }
    if (!this.info.isCreating) {
      this.updateCursor({
        dragHandle,
        isFlippedX: scale.x < 0,
        isFlippedY: scale.y < 0,
        rotation: selectionRotation
      });
    }
    for (const id of shapeSnapshots.keys()) {
      const snapshot = shapeSnapshots.get(id);
      this.editor.resizeShape(id, scale, {
        initialShape: snapshot.shape,
        initialBounds: snapshot.bounds,
        initialPageTransform: snapshot.pageTransform,
        dragHandle,
        mode: selectedShapeIds.length === 1 && id === selectedShapeIds[0] ? "resize_bounds" : "scale_shape",
        scaleOrigin: scaleOriginPage,
        isAspectRatioLocked,
        scaleAxisRotation: selectionRotation,
        skipStartAndEndCallbacks: true
      });
    }
    if (this.editor.inputs.ctrlKey) {
      this.didHoldCommand = true;
      for (const { id, children } of frames) {
        if (!children.length) continue;
        const initial = shapeSnapshots.get(id).shape;
        const current = this.editor.getShape(id);
        if (!(initial && current)) continue;
        const dx = current.x - initial.x;
        const dy = current.y - initial.y;
        const delta = new import_editor.Vec(dx, dy).rot(-initial.rotation);
        if (delta.x !== 0 || delta.y !== 0) {
          for (const child of children) {
            this.editor.updateShape({
              id: child.id,
              type: child.type,
              x: child.x - delta.x,
              y: child.y - delta.y
            });
          }
        }
      }
    } else if (this.didHoldCommand) {
      this.didHoldCommand = false;
      for (const { children } of frames) {
        if (!children.length) continue;
        for (const child of children) {
          this.editor.updateShape({
            id: child.id,
            type: child.type,
            x: child.x,
            y: child.y
          });
        }
      }
    }
  }
  // ---
  updateCursor({
    dragHandle,
    isFlippedX,
    isFlippedY,
    rotation
  }) {
    const nextCursor = { ...this.editor.getInstanceState().cursor };
    switch (dragHandle) {
      case "top_left":
      case "bottom_right": {
        nextCursor.type = "nwse-resize";
        if (isFlippedX !== isFlippedY) {
          nextCursor.type = "nesw-resize";
        }
        break;
      }
      case "top_right":
      case "bottom_left": {
        nextCursor.type = "nesw-resize";
        if (isFlippedX !== isFlippedY) {
          nextCursor.type = "nwse-resize";
        }
        break;
      }
    }
    nextCursor.rotation = rotation;
    this.editor.setCursor(nextCursor);
  }
  onExit() {
    this.parent.setCurrentToolIdMask(void 0);
    this.editor.setCursor({ type: "default", rotation: 0 });
    this.editor.snaps.clearIndicators();
  }
  _createSnapshot() {
    const selectedShapeIds = this.editor.getSelectedShapeIds();
    const selectionRotation = this.editor.getSelectionRotation();
    const {
      inputs: { originPagePoint }
    } = this.editor;
    const selectionBounds = this.editor.getSelectionRotatedPageBounds();
    const dragHandlePoint = import_editor.Vec.RotWith(
      selectionBounds.getHandlePoint(this.info.handle),
      selectionBounds.point,
      selectionRotation
    );
    const cursorHandleOffset = import_editor.Vec.Sub(originPagePoint, dragHandlePoint);
    const shapeSnapshots = /* @__PURE__ */ new Map();
    const frames = [];
    selectedShapeIds.forEach((id) => {
      const shape = this.editor.getShape(id);
      if (shape) {
        if (shape.type === "frame") {
          frames.push({
            id,
            children: (0, import_editor.compact)(
              this.editor.getSortedChildIdsForParent(shape).map((id2) => this.editor.getShape(id2))
            )
          });
        }
        shapeSnapshots.set(shape.id, this._createShapeSnapshot(shape));
        if (this.editor.isShapeOfType(shape, "frame") && selectedShapeIds.length === 1)
          return;
        this.editor.visitDescendants(shape.id, (descendantId) => {
          const descendent = this.editor.getShape(descendantId);
          if (descendent) {
            shapeSnapshots.set(descendent.id, this._createShapeSnapshot(descendent));
            if (this.editor.isShapeOfType(descendent, "frame")) {
              return false;
            }
          }
        });
      }
    });
    const canShapesDeform = ![...shapeSnapshots.values()].some(
      (shape) => !(0, import_editor.areAnglesCompatible)(shape.pageRotation, selectionRotation) || shape.isAspectRatioLocked
    );
    return {
      shapeSnapshots,
      selectionBounds,
      cursorHandleOffset,
      selectionRotation,
      selectedShapeIds,
      canShapesDeform,
      initialSelectionPageBounds: this.editor.getSelectionPageBounds(),
      frames
    };
  }
  _createShapeSnapshot(shape) {
    const pageTransform = this.editor.getShapePageTransform(shape);
    const util = this.editor.getShapeUtil(shape);
    return {
      shape,
      bounds: this.editor.getShapeGeometry(shape).bounds,
      pageTransform,
      pageRotation: import_editor.Mat.Decompose(pageTransform).rotation,
      isAspectRatioLocked: util.isAspectRatioLocked(shape)
    };
  }
}
const ORDERED_SELECTION_HANDLES = [
  "top",
  "top_right",
  "right",
  "bottom_right",
  "bottom",
  "bottom_left",
  "left",
  "top_left"
];
function rotateSelectionHandle(handle, rotation) {
  rotation = rotation % import_editor.PI2;
  const numSteps = Math.round(rotation / (import_editor.PI / 4));
  const currentIndex = ORDERED_SELECTION_HANDLES.indexOf(handle);
  return ORDERED_SELECTION_HANDLES[(currentIndex + numSteps) % ORDERED_SELECTION_HANDLES.length];
}
//# sourceMappingURL=Resizing.js.map
