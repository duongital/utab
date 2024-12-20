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
var minimap_webgl_setup_exports = {};
__export(minimap_webgl_setup_exports, {
  appendVertices: () => appendVertices,
  setupWebGl: () => setupWebGl
});
module.exports = __toCommonJS(minimap_webgl_setup_exports);
var import_minimap_webgl_shapes = require("./minimap-webgl-shapes");
function setupWebGl(canvas) {
  if (!canvas) throw new Error("Canvas element not found");
  const context = canvas.getContext("webgl2", {
    premultipliedAlpha: false
  });
  if (!context) throw new Error("Failed to get webgl2 context");
  const vertexShaderSourceCode = `#version 300 es
  precision mediump float;
  
  in vec2 shapeVertexPosition;

	uniform vec4 canvasPageBounds;

	// taken (with thanks) from
	// https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html
  void main() {
		// convert the position from pixels to 0.0 to 1.0
		vec2 zeroToOne = (shapeVertexPosition - canvasPageBounds.xy) / canvasPageBounds.zw;
	
		// convert from 0->1 to 0->2
		vec2 zeroToTwo = zeroToOne * 2.0;
	
		// convert from 0->2 to -1->+1 (clipspace)
		vec2 clipSpace = zeroToTwo - 1.0;
	
		gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }`;
  const vertexShader = context.createShader(context.VERTEX_SHADER);
  if (!vertexShader) {
    throw new Error("Failed to create vertex shader");
  }
  context.shaderSource(vertexShader, vertexShaderSourceCode);
  context.compileShader(vertexShader);
  if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
    throw new Error("Failed to compile vertex shader");
  }
  const fragmentShaderSourceCode = `#version 300 es
  precision mediump float;
  
	uniform vec4 fillColor;
  out vec4 outputColor;

  void main() {
	outputColor = fillColor;
  }`;
  const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
  if (!fragmentShader) {
    throw new Error("Failed to create fragment shader");
  }
  context.shaderSource(fragmentShader, fragmentShaderSourceCode);
  context.compileShader(fragmentShader);
  if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
    throw new Error("Failed to compile fragment shader");
  }
  const program = context.createProgram();
  if (!program) {
    throw new Error("Failed to create program");
  }
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    throw new Error("Failed to link program");
  }
  context.useProgram(program);
  const shapeVertexPositionAttributeLocation = context.getAttribLocation(
    program,
    "shapeVertexPosition"
  );
  if (shapeVertexPositionAttributeLocation < 0) {
    throw new Error("Failed to get shapeVertexPosition attribute location");
  }
  context.enableVertexAttribArray(shapeVertexPositionAttributeLocation);
  const canvasPageBoundsLocation = context.getUniformLocation(program, "canvasPageBounds");
  const fillColorLocation = context.getUniformLocation(program, "fillColor");
  const selectedShapesBuffer = context.createBuffer();
  if (!selectedShapesBuffer) throw new Error("Failed to create buffer");
  const unselectedShapesBuffer = context.createBuffer();
  if (!unselectedShapesBuffer) throw new Error("Failed to create buffer");
  return {
    context,
    selectedShapes: allocateBuffer(context, 1024),
    unselectedShapes: allocateBuffer(context, 4096),
    viewport: allocateBuffer(context, import_minimap_webgl_shapes.roundedRectangleDataSize),
    collaborators: allocateBuffer(context, 1024),
    prepareTriangles(stuff, len) {
      context.bindBuffer(context.ARRAY_BUFFER, stuff.buffer);
      context.bufferData(context.ARRAY_BUFFER, stuff.vertices, context.STATIC_DRAW, 0, len);
      context.enableVertexAttribArray(shapeVertexPositionAttributeLocation);
      context.vertexAttribPointer(
        shapeVertexPositionAttributeLocation,
        2,
        context.FLOAT,
        false,
        0,
        0
      );
    },
    drawTrianglesTransparently(len) {
      context.enable(context.BLEND);
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
      context.drawArrays(context.TRIANGLES, 0, len / 2);
      context.disable(context.BLEND);
    },
    drawTriangles(len) {
      context.drawArrays(context.TRIANGLES, 0, len / 2);
    },
    setFillColor(color) {
      context.uniform4fv(fillColorLocation, color);
    },
    setCanvasPageBounds(bounds) {
      context.uniform4fv(canvasPageBoundsLocation, bounds);
    }
  };
}
function allocateBuffer(context, size) {
  const buffer = context.createBuffer();
  if (!buffer) throw new Error("Failed to create buffer");
  return { buffer, vertices: new Float32Array(size) };
}
function appendVertices(bufferStuff, offset, data) {
  let len = bufferStuff.vertices.length;
  while (len < offset + data.length) {
    len *= 2;
  }
  if (len != bufferStuff.vertices.length) {
    const newVertices = new Float32Array(len);
    newVertices.set(bufferStuff.vertices);
    bufferStuff.vertices = newVertices;
  }
  bufferStuff.vertices.set(data, offset);
}
//# sourceMappingURL=minimap-webgl-setup.js.map
