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
var defaultExternalContentHandlers_exports = {};
__export(defaultExternalContentHandlers_exports, {
  centerSelectionAroundPoint: () => centerSelectionAroundPoint,
  createEmptyBookmarkShape: () => createEmptyBookmarkShape,
  createShapesForAssets: () => createShapesForAssets,
  getMediaAssetInfoPartial: () => getMediaAssetInfoPartial,
  registerDefaultExternalContentHandlers: () => registerDefaultExternalContentHandlers
});
module.exports = __toCommonJS(defaultExternalContentHandlers_exports);
var import_editor = require("@tldraw/editor");
var import_default_shape_constants = require("./shapes/shared/default-shape-constants");
var import_assets = require("./utils/assets/assets");
var import_text = require("./utils/text/text");
function registerDefaultExternalContentHandlers(editor, {
  maxImageDimension,
  maxAssetSize,
  acceptedImageMimeTypes,
  acceptedVideoMimeTypes
}, { toasts, msg }) {
  editor.registerExternalAssetHandler("file", async ({ file, assetId }) => {
    const isImageType = acceptedImageMimeTypes.includes(file.type);
    const isVideoType = acceptedVideoMimeTypes.includes(file.type);
    if (!isImageType && !isVideoType) {
      toasts.addToast({
        title: msg("assets.files.type-not-allowed"),
        severity: "error"
      });
    }
    (0, import_editor.assert)(isImageType || isVideoType, `File type not allowed: ${file.type}`);
    if (file.size > maxAssetSize) {
      toasts.addToast({
        title: msg("assets.files.size-too-big"),
        severity: "error"
      });
    }
    (0, import_editor.assert)(
      file.size <= maxAssetSize,
      `File size too big: ${(file.size / 1024).toFixed()}kb > ${(maxAssetSize / 1024).toFixed()}kb`
    );
    const hash = (0, import_editor.getHashForBuffer)(await file.arrayBuffer());
    assetId = assetId ?? import_editor.AssetRecordType.createId(hash);
    const assetInfo = await getMediaAssetInfoPartial(file, assetId, isImageType, isVideoType);
    if (isFinite(maxImageDimension)) {
      const size = { w: assetInfo.props.w, h: assetInfo.props.h };
      const resizedSize = (0, import_assets.containBoxSize)(size, { w: maxImageDimension, h: maxImageDimension });
      if (size !== resizedSize && import_editor.MediaHelpers.isStaticImageType(file.type)) {
        assetInfo.props.w = resizedSize.w;
        assetInfo.props.h = resizedSize.h;
      }
    }
    assetInfo.props.src = await editor.uploadAsset(assetInfo, file);
    return import_editor.AssetRecordType.create(assetInfo);
  });
  editor.registerExternalAssetHandler("url", async ({ url }) => {
    let meta;
    try {
      const resp = await (0, import_editor.fetch)(url, {
        method: "GET",
        mode: "no-cors"
      });
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      meta = {
        image: doc.head.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
        favicon: doc.head.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href") ?? doc.head.querySelector('link[rel="icon"]')?.getAttribute("href") ?? "",
        title: doc.head.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? url,
        description: doc.head.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? ""
      };
      if (!meta.image.startsWith("http")) {
        meta.image = new URL(meta.image, url).href;
      }
      if (!meta.favicon.startsWith("http")) {
        meta.favicon = new URL(meta.favicon, url).href;
      }
    } catch (error) {
      console.error(error);
      toasts.addToast({
        title: msg("assets.url.failed"),
        severity: "error"
      });
      meta = { image: "", favicon: "", title: "", description: "" };
    }
    return {
      id: import_editor.AssetRecordType.createId((0, import_editor.getHashForString)(url)),
      typeName: "asset",
      type: "bookmark",
      props: {
        src: url,
        description: meta.description,
        image: meta.image,
        favicon: meta.favicon,
        title: meta.title
      },
      meta: {}
    };
  });
  editor.registerExternalContentHandler("svg-text", async ({ point, text }) => {
    const position = point ?? (editor.inputs.shiftKey ? editor.inputs.currentPagePoint : editor.getViewportPageBounds().center);
    const svg = new DOMParser().parseFromString(text, "image/svg+xml").querySelector("svg");
    if (!svg) {
      throw new Error("No <svg/> element present");
    }
    let width = parseFloat(svg.getAttribute("width") || "0");
    let height = parseFloat(svg.getAttribute("height") || "0");
    if (!(width && height)) {
      document.body.appendChild(svg);
      const box = svg.getBoundingClientRect();
      document.body.removeChild(svg);
      width = box.width;
      height = box.height;
    }
    const asset = await editor.getAssetForExternalContent({
      type: "file",
      file: new File([text], "asset.svg", { type: "image/svg+xml" })
    });
    if (!asset) throw Error("Could not create an asset");
    createShapesForAssets(editor, [asset], position);
  });
  editor.registerExternalContentHandler(
    "embed",
    ({ point, url, embed }) => {
      const position = point ?? (editor.inputs.shiftKey ? editor.inputs.currentPagePoint : editor.getViewportPageBounds().center);
      const { width, height } = embed;
      const id = (0, import_editor.createShapeId)();
      const shapePartial = {
        id,
        type: "embed",
        x: position.x - (width || 450) / 2,
        y: position.y - (height || 450) / 2,
        props: {
          w: width,
          h: height,
          url
        }
      };
      editor.createShapes([shapePartial]).select(id);
    }
  );
  editor.registerExternalContentHandler("files", async ({ point, files }) => {
    if (files.length > editor.options.maxFilesAtOnce) {
      throw Error("Too many files");
    }
    const position = point ?? (editor.inputs.shiftKey ? editor.inputs.currentPagePoint : editor.getViewportPageBounds().center);
    const pagePoint = new import_editor.Vec(position.x, position.y);
    const assets = [];
    const assetsToUpdate = [];
    for (const file of files) {
      if (file.size > maxAssetSize) {
        toasts.addToast({
          title: msg("assets.files.size-too-big"),
          severity: "error"
        });
        console.warn(
          `File size too big: ${(file.size / 1024).toFixed()}kb > ${(maxAssetSize / 1024).toFixed()}kb`
        );
        continue;
      }
      if (!file.type) {
        toasts.addToast({
          title: msg("assets.files.upload-failed"),
          severity: "error"
        });
        console.error("No mime type");
        continue;
      }
      if (!acceptedImageMimeTypes.concat(acceptedVideoMimeTypes).includes(file.type)) {
        toasts.addToast({
          title: msg("assets.files.type-not-allowed"),
          severity: "error"
        });
        console.warn(`${file.name} not loaded - Mime type not allowed ${file.type}.`);
        continue;
      }
      const isImageType = acceptedImageMimeTypes.includes(file.type);
      const isVideoType = acceptedVideoMimeTypes.includes(file.type);
      const hash = (0, import_editor.getHashForBuffer)(await file.arrayBuffer());
      const assetId = import_editor.AssetRecordType.createId(hash);
      const assetInfo = await getMediaAssetInfoPartial(file, assetId, isImageType, isVideoType);
      let temporaryAssetPreview;
      if (isImageType) {
        temporaryAssetPreview = editor.createTemporaryAssetPreview(assetId, file);
      }
      assets.push(assetInfo);
      assetsToUpdate.push({ asset: assetInfo, file, temporaryAssetPreview });
    }
    Promise.allSettled(
      assetsToUpdate.map(async (assetAndFile) => {
        try {
          const newAsset = await editor.getAssetForExternalContent({
            type: "file",
            file: assetAndFile.file
          });
          if (!newAsset) {
            throw Error("Could not create an asset");
          }
          editor.updateAssets([{ ...newAsset, id: assetAndFile.asset.id }]);
        } catch (error) {
          toasts.addToast({
            title: msg("assets.files.upload-failed"),
            severity: "error"
          });
          console.error(error);
          return;
        }
      })
    );
    createShapesForAssets(editor, assets, pagePoint);
  });
  editor.registerExternalContentHandler("text", async ({ point, text }) => {
    const p = point ?? (editor.inputs.shiftKey ? editor.inputs.currentPagePoint : editor.getViewportPageBounds().center);
    const defaultProps = editor.getShapeUtil("text").getDefaultProps();
    const textToPaste = (0, import_text.cleanupText)(text);
    const onlySelectedShape = editor.getOnlySelectedShape();
    if (onlySelectedShape && "text" in onlySelectedShape.props) {
      editor.updateShapes([
        {
          id: onlySelectedShape.id,
          type: onlySelectedShape.type,
          props: {
            text: textToPaste
          }
        }
      ]);
      return;
    }
    let w;
    let h;
    let autoSize;
    let align = "middle";
    const isMultiLine = textToPaste.split("\n").length > 1;
    const isRtl = (0, import_text.isRightToLeftLanguage)(textToPaste);
    if (isMultiLine) {
      align = isMultiLine ? isRtl ? "end" : "start" : "middle";
    }
    const rawSize = editor.textMeasure.measureText(textToPaste, {
      ...import_default_shape_constants.TEXT_PROPS,
      fontFamily: import_default_shape_constants.FONT_FAMILIES[defaultProps.font],
      fontSize: import_default_shape_constants.FONT_SIZES[defaultProps.size],
      maxWidth: null
    });
    const minWidth = Math.min(
      isMultiLine ? editor.getViewportPageBounds().width * 0.9 : 920,
      Math.max(200, editor.getViewportPageBounds().width * 0.9)
    );
    if (rawSize.w > minWidth) {
      const shrunkSize = editor.textMeasure.measureText(textToPaste, {
        ...import_default_shape_constants.TEXT_PROPS,
        fontFamily: import_default_shape_constants.FONT_FAMILIES[defaultProps.font],
        fontSize: import_default_shape_constants.FONT_SIZES[defaultProps.size],
        maxWidth: minWidth
      });
      w = shrunkSize.w;
      h = shrunkSize.h;
      autoSize = false;
      align = isRtl ? "end" : "start";
    } else {
      w = rawSize.w;
      h = rawSize.h;
      autoSize = true;
    }
    if (p.y - h / 2 < editor.getViewportPageBounds().minY + 40) {
      p.y = editor.getViewportPageBounds().minY + 40 + h / 2;
    }
    editor.createShapes([
      {
        id: (0, import_editor.createShapeId)(),
        type: "text",
        x: p.x - w / 2,
        y: p.y - h / 2,
        props: {
          text: textToPaste,
          // if the text has more than one line, align it to the left
          textAlign: align,
          autoSize,
          w
        }
      }
    ]);
  });
  editor.registerExternalContentHandler("url", async ({ point, url }) => {
    const embedUtil = editor.getShapeUtil("embed");
    const embedInfo = embedUtil?.getEmbedDefinition(url);
    if (embedInfo) {
      return editor.putExternalContent({
        type: "embed",
        url: embedInfo.url,
        point,
        embed: embedInfo.definition
      });
    }
    const position = point ?? (editor.inputs.shiftKey ? editor.inputs.currentPagePoint : editor.getViewportPageBounds().center);
    const assetId = import_editor.AssetRecordType.createId((0, import_editor.getHashForString)(url));
    const shape = createEmptyBookmarkShape(editor, url, position);
    let asset = editor.getAsset(assetId);
    let shouldAlsoCreateAsset = false;
    if (!asset) {
      shouldAlsoCreateAsset = true;
      try {
        const bookmarkAsset = await editor.getAssetForExternalContent({ type: "url", url });
        if (!bookmarkAsset) throw Error("Could not create an asset");
        asset = bookmarkAsset;
      } catch {
        toasts.addToast({
          title: msg("assets.url.failed"),
          severity: "error"
        });
        return;
      }
    }
    editor.run(() => {
      if (shouldAlsoCreateAsset) {
        editor.createAssets([asset]);
      }
      editor.updateShapes([
        {
          id: shape.id,
          type: shape.type,
          props: {
            assetId: asset.id
          }
        }
      ]);
    });
  });
}
async function getMediaAssetInfoPartial(file, assetId, isImageType, isVideoType) {
  let fileType = file.type;
  if (file.type === "video/quicktime") {
    fileType = "video/mp4";
  }
  const size = isImageType ? await import_editor.MediaHelpers.getImageSize(file) : await import_editor.MediaHelpers.getVideoSize(file);
  const isAnimated = await import_editor.MediaHelpers.isAnimated(file) || isVideoType;
  const assetInfo = {
    id: assetId,
    type: isImageType ? "image" : "video",
    typeName: "asset",
    props: {
      name: file.name,
      src: "",
      w: size.w,
      h: size.h,
      fileSize: file.size,
      mimeType: fileType,
      isAnimated
    },
    meta: {}
  };
  return assetInfo;
}
async function createShapesForAssets(editor, assets, position) {
  if (!assets.length) return [];
  const currentPoint = import_editor.Vec.From(position);
  const partials = [];
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    switch (asset.type) {
      case "image": {
        partials.push({
          id: (0, import_editor.createShapeId)(),
          type: "image",
          x: currentPoint.x,
          y: currentPoint.y,
          opacity: 1,
          props: {
            assetId: asset.id,
            w: asset.props.w,
            h: asset.props.h
          }
        });
        currentPoint.x += asset.props.w;
        break;
      }
      case "video": {
        partials.push({
          id: (0, import_editor.createShapeId)(),
          type: "video",
          x: currentPoint.x,
          y: currentPoint.y,
          opacity: 1,
          props: {
            assetId: asset.id,
            w: asset.props.w,
            h: asset.props.h
          }
        });
        currentPoint.x += asset.props.w;
      }
    }
  }
  editor.run(() => {
    const assetsToCreate = assets.filter((asset) => !editor.getAsset(asset.id));
    if (assetsToCreate.length) {
      editor.createAssets(assetsToCreate);
    }
    editor.createShapes(partials).select(...partials.map((p) => p.id));
    centerSelectionAroundPoint(editor, position);
  });
  return partials.map((p) => p.id);
}
function centerSelectionAroundPoint(editor, position) {
  const viewportPageBounds = editor.getViewportPageBounds();
  let selectionPageBounds = editor.getSelectionPageBounds();
  if (selectionPageBounds) {
    const offset = selectionPageBounds.center.sub(position);
    editor.updateShapes(
      editor.getSelectedShapes().map((shape) => {
        const localRotation = editor.getShapeParentTransform(shape).decompose().rotation;
        const localDelta = import_editor.Vec.Rot(offset, -localRotation);
        return {
          id: shape.id,
          type: shape.type,
          x: shape.x - localDelta.x,
          y: shape.y - localDelta.y
        };
      })
    );
  }
  selectionPageBounds = editor.getSelectionPageBounds();
  if (selectionPageBounds && editor.getInstanceState().isGridMode) {
    const gridSize = editor.getDocumentSettings().gridSize;
    const topLeft = new import_editor.Vec(selectionPageBounds.minX, selectionPageBounds.minY);
    const gridSnappedPoint = topLeft.clone().snapToGrid(gridSize);
    const delta = import_editor.Vec.Sub(topLeft, gridSnappedPoint);
    editor.updateShapes(
      editor.getSelectedShapes().map((shape) => {
        const newPoint = { x: shape.x - delta.x, y: shape.y - delta.y };
        return {
          id: shape.id,
          type: shape.type,
          x: newPoint.x,
          y: newPoint.y
        };
      })
    );
  }
  selectionPageBounds = editor.getSelectionPageBounds();
  if (selectionPageBounds && !viewportPageBounds.contains(selectionPageBounds)) {
    editor.zoomToSelection({ animation: { duration: editor.options.animationMediumMs } });
  }
}
function createEmptyBookmarkShape(editor, url, position) {
  const partial = {
    id: (0, import_editor.createShapeId)(),
    type: "bookmark",
    x: position.x - 150,
    y: position.y - 160,
    opacity: 1,
    props: {
      assetId: null,
      url
    }
  };
  editor.run(() => {
    editor.createShapes([partial]).select(partial.id);
    centerSelectionAroundPoint(editor, position);
  });
  return editor.getShape(partial.id);
}
//# sourceMappingURL=defaultExternalContentHandlers.js.map
