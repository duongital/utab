"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var DragAndDropManager_exports = {};
__export(DragAndDropManager_exports, {
  DragAndDropManager: () => DragAndDropManager
});
module.exports = __toCommonJS(DragAndDropManager_exports);
var import_editor = require("@tldraw/editor");
var import_selectHelpers = require("./selectHelpers");
var _dispose_dec, _init;
const INITIAL_POINTER_LAG_DURATION = 20;
const FAST_POINTER_LAG_DURATION = 100;
_dispose_dec = [import_editor.bind];
class DragAndDropManager {
  constructor(editor) {
    this.editor = editor;
    __runInitializers(_init, 5, this);
    __publicField(this, "prevDroppingShapeId", null);
    __publicField(this, "droppingNodeTimer", null);
    __publicField(this, "first", true);
    editor.disposables.add(this.dispose);
  }
  updateDroppingNode(movingShapes, cb) {
    if (this.first) {
      this.editor.setHintingShapes(
        movingShapes.map((s) => this.editor.findShapeAncestor(s, (v) => v.type !== "group")).filter((s) => s)
      );
      this.prevDroppingShapeId = this.editor.getDroppingOverShape(this.editor.inputs.originPagePoint, movingShapes)?.id ?? null;
      this.first = false;
    }
    if (this.droppingNodeTimer === null) {
      this.setDragTimer(movingShapes, INITIAL_POINTER_LAG_DURATION, cb);
    } else if (this.editor.inputs.pointerVelocity.len() > 0.5) {
      clearTimeout(this.droppingNodeTimer);
      this.setDragTimer(movingShapes, FAST_POINTER_LAG_DURATION, cb);
    }
  }
  setDragTimer(movingShapes, duration, cb) {
    this.droppingNodeTimer = this.editor.timers.setTimeout(() => {
      this.editor.run(() => {
        this.handleDrag(this.editor.inputs.currentPagePoint, movingShapes, cb);
      });
      this.droppingNodeTimer = null;
    }, duration);
  }
  handleDrag(point, movingShapes, cb) {
    movingShapes = (0, import_editor.compact)(movingShapes.map((shape) => this.editor.getShape(shape.id)));
    const nextDroppingShapeId = this.editor.getDroppingOverShape(point, movingShapes)?.id ?? null;
    if (nextDroppingShapeId === this.prevDroppingShapeId) {
      this.hintParents(movingShapes);
      return;
    }
    const { prevDroppingShapeId } = this;
    const prevDroppingShape = prevDroppingShapeId && this.editor.getShape(prevDroppingShapeId);
    const nextDroppingShape = nextDroppingShapeId && this.editor.getShape(nextDroppingShapeId);
    if (prevDroppingShape) {
      this.editor.getShapeUtil(prevDroppingShape).onDragShapesOut?.(prevDroppingShape, movingShapes);
    }
    if (nextDroppingShape) {
      this.editor.getShapeUtil(nextDroppingShape).onDragShapesOver?.(nextDroppingShape, movingShapes);
    }
    this.hintParents(movingShapes);
    cb?.();
    this.prevDroppingShapeId = nextDroppingShapeId;
  }
  hintParents(movingShapes) {
    const shapesGroupedByAncestor = /* @__PURE__ */ new Map();
    for (const shape of movingShapes) {
      const ancestor = this.editor.findShapeAncestor(shape, (v) => v.type !== "group");
      if (!ancestor) continue;
      if (!shapesGroupedByAncestor.has(ancestor.id)) {
        shapesGroupedByAncestor.set(ancestor.id, []);
      }
      shapesGroupedByAncestor.get(ancestor.id).push(shape.id);
    }
    const hintingShapes = [];
    for (const [ancestorId, shapeIds] of shapesGroupedByAncestor) {
      const ancestor = this.editor.getShape(ancestorId);
      if (!ancestor) continue;
      if ((0, import_selectHelpers.getOccludedChildren)(this.editor, ancestor).length < shapeIds.length) {
        hintingShapes.push(ancestor.id);
      }
    }
    this.editor.setHintingShapes(hintingShapes);
  }
  dropShapes(shapes) {
    const { prevDroppingShapeId } = this;
    this.handleDrag(this.editor.inputs.currentPagePoint, shapes);
    if (prevDroppingShapeId) {
      const shape = this.editor.getShape(prevDroppingShapeId);
      if (!shape) return;
      this.editor.getShapeUtil(shape).onDropShapesOver?.(shape, shapes);
    }
  }
  clear() {
    this.prevDroppingShapeId = null;
    if (this.droppingNodeTimer !== null) {
      clearTimeout(this.droppingNodeTimer);
    }
    this.droppingNodeTimer = null;
    this.editor.setHintingShapes([]);
    this.first = true;
  }
  dispose() {
    this.clear();
  }
}
_init = __decoratorStart(null);
__decorateElement(_init, 1, "dispose", _dispose_dec, DragAndDropManager);
__decoratorMetadata(_init, DragAndDropManager);
//# sourceMappingURL=DragAndDropManager.js.map
