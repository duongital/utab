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
var MinimapManager_exports = {};
__export(MinimapManager_exports, {
  MinimapManager: () => MinimapManager
});
module.exports = __toCommonJS(MinimapManager_exports);
var import_editor = require("@tldraw/editor");
var import_getRgba = require("./getRgba");
var import_minimap_webgl_setup = require("./minimap-webgl-setup");
var import_minimap_webgl_shapes = require("./minimap-webgl-shapes");
var _render_dec, _getCanvasPageBoundsArray_dec, _getZoom_dec, _getCanvasPageBounds_dec, _getCanvasClientPosition_dec, _getCanvasSize_dec, _getContentScreenBounds_dec, _getContentPageBounds_dec, _getDpr_dec, _close_dec, _init;
_close_dec = [import_editor.bind], _getDpr_dec = [import_editor.computed], _getContentPageBounds_dec = [import_editor.computed], _getContentScreenBounds_dec = [import_editor.computed], _getCanvasSize_dec = [import_editor.computed], _getCanvasClientPosition_dec = [import_editor.computed], _getCanvasPageBounds_dec = [import_editor.computed], _getZoom_dec = [import_editor.computed], _getCanvasPageBoundsArray_dec = [import_editor.computed], _render_dec = [import_editor.bind];
class MinimapManager {
  constructor(editor, elem, container) {
    this.editor = editor;
    this.elem = elem;
    this.container = container;
    __runInitializers(_init, 5, this);
    __publicField(this, "disposables", []);
    __publicField(this, "gl");
    __publicField(this, "shapeGeometryCache");
    __publicField(this, "colors");
    __publicField(this, "id", (0, import_editor.uniqueId)());
    __publicField(this, "canvasBoundingClientRect", (0, import_editor.atom)("canvasBoundingClientRect", new import_editor.Box()));
    __publicField(this, "originPagePoint", new import_editor.Vec());
    __publicField(this, "originPageCenter", new import_editor.Vec());
    __publicField(this, "isInViewport", false);
    this.gl = (0, import_minimap_webgl_setup.setupWebGl)(elem);
    this.shapeGeometryCache = editor.store.createComputedCache("webgl-geometry", (r) => {
      const bounds = editor.getShapeMaskedPageBounds(r.id);
      if (!bounds) return null;
      const arr = new Float32Array(12);
      (0, import_minimap_webgl_shapes.rectangle)(arr, 0, bounds.x, bounds.y, bounds.w, bounds.h);
      return arr;
    });
    this.colors = this._getColors();
    this.disposables.push(this._listenForCanvasResize(), (0, import_editor.react)("minimap render", this.render));
  }
  close() {
    return this.disposables.forEach((d) => d());
  }
  _getColors() {
    const style = getComputedStyle(this.editor.getContainer());
    return {
      shapeFill: (0, import_getRgba.getRgba)(style.getPropertyValue("--color-text-3").trim()),
      selectFill: (0, import_getRgba.getRgba)(style.getPropertyValue("--color-selected").trim()),
      viewportFill: (0, import_getRgba.getRgba)(style.getPropertyValue("--color-muted-1").trim()),
      background: (0, import_getRgba.getRgba)(style.getPropertyValue("--color-low").trim())
    };
  }
  // this should be called after dark/light mode changes have propagated to the dom
  updateColors() {
    this.colors = this._getColors();
  }
  getDpr() {
    return this.editor.getInstanceState().devicePixelRatio;
  }
  getContentPageBounds() {
    const viewportPageBounds = this.editor.getViewportPageBounds();
    const commonShapeBounds = this.editor.getCurrentPageBounds();
    return commonShapeBounds ? import_editor.Box.Expand(commonShapeBounds, viewportPageBounds) : viewportPageBounds;
  }
  getContentScreenBounds() {
    const contentPageBounds = this.getContentPageBounds();
    const topLeft = this.editor.pageToScreen(contentPageBounds.point);
    const bottomRight = this.editor.pageToScreen(
      new import_editor.Vec(contentPageBounds.maxX, contentPageBounds.maxY)
    );
    return new import_editor.Box(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }
  _getCanvasBoundingRect() {
    const { x, y, width, height } = this.elem.getBoundingClientRect();
    return new import_editor.Box(x, y, width, height);
  }
  getCanvasScreenBounds() {
    return this.canvasBoundingClientRect.get();
  }
  _listenForCanvasResize() {
    const observer = new ResizeObserver(() => {
      const rect = this._getCanvasBoundingRect();
      this.canvasBoundingClientRect.set(rect);
    });
    observer.observe(this.elem);
    observer.observe(this.container);
    return () => observer.disconnect();
  }
  getCanvasSize() {
    const rect = this.canvasBoundingClientRect.get();
    const dpr = this.getDpr();
    return new import_editor.Vec(rect.width * dpr, rect.height * dpr);
  }
  getCanvasClientPosition() {
    return this.canvasBoundingClientRect.get().point;
  }
  getCanvasPageBounds() {
    const canvasScreenBounds = this.getCanvasScreenBounds();
    const contentPageBounds = this.getContentPageBounds();
    const aspectRatio = canvasScreenBounds.width / canvasScreenBounds.height;
    let targetWidth = contentPageBounds.width;
    let targetHeight = targetWidth / aspectRatio;
    if (targetHeight < contentPageBounds.height) {
      targetHeight = contentPageBounds.height;
      targetWidth = targetHeight * aspectRatio;
    }
    const box = new import_editor.Box(0, 0, targetWidth, targetHeight);
    box.center = contentPageBounds.center;
    return box;
  }
  getZoom() {
    return this.getCanvasPageBounds().width / this.getCanvasScreenBounds().width;
  }
  getCanvasPageBoundsArray() {
    const { x, y, w, h } = this.getCanvasPageBounds();
    return new Float32Array([x, y, w, h]);
  }
  getMinimapPagePoint(clientX, clientY) {
    const canvasPageBounds = this.getCanvasPageBounds();
    const canvasScreenBounds = this.getCanvasScreenBounds();
    let x = clientX - canvasScreenBounds.x;
    let y = clientY - canvasScreenBounds.y;
    x *= canvasPageBounds.width / canvasScreenBounds.width;
    y *= canvasPageBounds.height / canvasScreenBounds.height;
    x += canvasPageBounds.minX;
    y += canvasPageBounds.minY;
    return new import_editor.Vec(x, y, 1);
  }
  minimapScreenPointToPagePoint(x, y, shiftKey = false, clampToBounds = false) {
    const { editor } = this;
    const vpPageBounds = editor.getViewportPageBounds();
    let { x: px, y: py } = this.getMinimapPagePoint(x, y);
    if (clampToBounds) {
      const shapesPageBounds = this.editor.getCurrentPageBounds() ?? new import_editor.Box();
      const minX = shapesPageBounds.minX - vpPageBounds.width / 2;
      const maxX = shapesPageBounds.maxX + vpPageBounds.width / 2;
      const minY = shapesPageBounds.minY - vpPageBounds.height / 2;
      const maxY = shapesPageBounds.maxY + vpPageBounds.height / 2;
      const lx = Math.max(0, minX + vpPageBounds.width - px);
      const rx = Math.max(0, -(maxX - vpPageBounds.width - px));
      const ly = Math.max(0, minY + vpPageBounds.height - py);
      const ry = Math.max(0, -(maxY - vpPageBounds.height - py));
      px += (lx - rx) / 2;
      py += (ly - ry) / 2;
      px = (0, import_editor.clamp)(px, minX, maxX);
      py = (0, import_editor.clamp)(py, minY, maxY);
    }
    if (shiftKey) {
      const { originPagePoint } = this;
      const dx = Math.abs(px - originPagePoint.x);
      const dy = Math.abs(py - originPagePoint.y);
      if (dx > dy) {
        py = originPagePoint.y;
      } else {
        px = originPagePoint.x;
      }
    }
    return new import_editor.Vec(px, py);
  }
  render() {
    const context = this.gl.context;
    const canvasSize = this.getCanvasSize();
    this.gl.setCanvasPageBounds(this.getCanvasPageBoundsArray());
    this.elem.width = canvasSize.x;
    this.elem.height = canvasSize.y;
    context.viewport(0, 0, canvasSize.x, canvasSize.y);
    context.clearColor(
      this.colors.background[0],
      this.colors.background[1],
      this.colors.background[2],
      1
    );
    context.clear(context.COLOR_BUFFER_BIT);
    const selectedShapes = new Set(this.editor.getSelectedShapeIds());
    const colors = this.colors;
    let selectedShapeOffset = 0;
    let unselectedShapeOffset = 0;
    const ids = this.editor.getCurrentPageShapeIdsSorted();
    for (let i = 0, len = ids.length; i < len; i++) {
      const shapeId = ids[i];
      const geometry = this.shapeGeometryCache.get(shapeId);
      if (!geometry) continue;
      const len2 = geometry.length;
      if (selectedShapes.has(shapeId)) {
        (0, import_minimap_webgl_setup.appendVertices)(this.gl.selectedShapes, selectedShapeOffset, geometry);
        selectedShapeOffset += len2;
      } else {
        (0, import_minimap_webgl_setup.appendVertices)(this.gl.unselectedShapes, unselectedShapeOffset, geometry);
        unselectedShapeOffset += len2;
      }
    }
    this.drawShapes(this.gl.unselectedShapes, unselectedShapeOffset, colors.shapeFill);
    this.drawShapes(this.gl.selectedShapes, selectedShapeOffset, colors.selectFill);
    this.drawViewport();
    this.drawCollaborators();
  }
  drawShapes(stuff, len, color) {
    this.gl.prepareTriangles(stuff, len);
    this.gl.setFillColor(color);
    this.gl.drawTriangles(len);
  }
  drawViewport() {
    const viewport = this.editor.getViewportPageBounds();
    const len = (0, import_minimap_webgl_shapes.roundedRectangle)(this.gl.viewport.vertices, viewport, 4 * this.getZoom());
    this.gl.prepareTriangles(this.gl.viewport, len);
    this.gl.setFillColor(this.colors.viewportFill);
    this.gl.drawTrianglesTransparently(len);
    if (import_editor.tlenv.isSafari) {
      this.gl.drawTrianglesTransparently(len);
      this.gl.drawTrianglesTransparently(len);
      this.gl.drawTrianglesTransparently(len);
    }
  }
  drawCollaborators() {
    const collaborators = this.editor.getCollaboratorsOnCurrentPage();
    if (!collaborators.length) return;
    const numSegmentsPerCircle = 20;
    const dataSizePerCircle = numSegmentsPerCircle * 6;
    const totalSize = dataSizePerCircle * collaborators.length;
    if (this.gl.collaborators.vertices.length < totalSize) {
      this.gl.collaborators.vertices = new Float32Array(totalSize);
    }
    const vertices = this.gl.collaborators.vertices;
    let offset = 0;
    const zoom = this.getZoom();
    for (const { cursor } of collaborators) {
      (0, import_minimap_webgl_shapes.pie)(vertices, {
        center: import_editor.Vec.From(cursor),
        radius: 3 * zoom,
        offset,
        numArcSegments: numSegmentsPerCircle
      });
      offset += dataSizePerCircle;
    }
    this.gl.prepareTriangles(this.gl.collaborators, totalSize);
    offset = 0;
    for (const { color } of collaborators) {
      this.gl.setFillColor((0, import_getRgba.getRgba)(color));
      this.gl.context.drawArrays(this.gl.context.TRIANGLES, offset / 2, dataSizePerCircle / 2);
      offset += dataSizePerCircle;
    }
  }
}
_init = __decoratorStart(null);
__decorateElement(_init, 1, "close", _close_dec, MinimapManager);
__decorateElement(_init, 1, "getDpr", _getDpr_dec, MinimapManager);
__decorateElement(_init, 1, "getContentPageBounds", _getContentPageBounds_dec, MinimapManager);
__decorateElement(_init, 1, "getContentScreenBounds", _getContentScreenBounds_dec, MinimapManager);
__decorateElement(_init, 1, "getCanvasSize", _getCanvasSize_dec, MinimapManager);
__decorateElement(_init, 1, "getCanvasClientPosition", _getCanvasClientPosition_dec, MinimapManager);
__decorateElement(_init, 1, "getCanvasPageBounds", _getCanvasPageBounds_dec, MinimapManager);
__decorateElement(_init, 1, "getZoom", _getZoom_dec, MinimapManager);
__decorateElement(_init, 1, "getCanvasPageBoundsArray", _getCanvasPageBoundsArray_dec, MinimapManager);
__decorateElement(_init, 1, "render", _render_dec, MinimapManager);
__decoratorMetadata(_init, MinimapManager);
//# sourceMappingURL=MinimapManager.js.map
