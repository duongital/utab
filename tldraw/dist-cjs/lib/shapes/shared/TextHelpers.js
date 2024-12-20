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
var TextHelpers_exports = {};
__export(TextHelpers_exports, {
  INDENT: () => INDENT,
  TextHelpers: () => TextHelpers
});
module.exports = __toCommonJS(TextHelpers_exports);
/*!
 * MIT License
 * Adapted (mostly copied) the work of https://github.com/fregante/text-field-edit
 * Copyright (c) Federico Brigante <opensource@bfred.it> (bfred.it)
 */
const INDENT = "  ";
class TextHelpers {
  static insertTextFirefox(field, text) {
    field.setRangeText(
      text,
      field.selectionStart || 0,
      field.selectionEnd || 0,
      "end"
      // Without this, the cursor is either at the beginning or text remains selected
    );
    field.dispatchEvent(
      new InputEvent("input", {
        data: text,
        inputType: "insertText",
        isComposing: false
        // TODO: fix @types/jsdom, this shouldn't be required
      })
    );
  }
  /**
   * Inserts text at the cursor’s position, replacing any selection, with **undo** support and by
   * firing the input event.
   */
  static insert(field, text) {
    const document = field.ownerDocument;
    const initialFocus = document.activeElement;
    if (initialFocus !== field) {
      field.focus();
    }
    if (!document.execCommand("insertText", false, text)) {
      TextHelpers.insertTextFirefox(field, text);
    }
    if (initialFocus === document.body) {
      field.blur();
    } else if (initialFocus instanceof HTMLElement && initialFocus !== field) {
      initialFocus.focus();
    }
  }
  /**
   * Replaces the entire content, equivalent to field.value = text but with **undo** support and by
   * firing the input event.
   */
  static set(field, text) {
    field.select();
    TextHelpers.insert(field, text);
  }
  /** Get the selected text in a field or an empty string if nothing is selected. */
  static getSelection(field) {
    const { selectionStart, selectionEnd } = field;
    return field.value.slice(
      selectionStart ? selectionStart : void 0,
      selectionEnd ? selectionEnd : void 0
    );
  }
  /**
   * Adds the wrappingText before and after field’s selection (or cursor). If endWrappingText is
   * provided, it will be used instead of wrappingText at on the right.
   */
  static wrapSelection(field, wrap, wrapEnd) {
    const { selectionStart, selectionEnd } = field;
    const selection = TextHelpers.getSelection(field);
    TextHelpers.insert(field, wrap + selection + (wrapEnd ?? wrap));
    field.selectionStart = (selectionStart || 0) + wrap.length;
    field.selectionEnd = (selectionEnd || 0) + wrap.length;
  }
  /** Finds and replaces strings and regex in the field’s value. */
  static replace(field, searchValue, replacer) {
    let drift = 0;
    field.value.replace(searchValue, (...args) => {
      const matchStart = drift + args[args.length - 2];
      const matchLength = args[0].length;
      field.selectionStart = matchStart;
      field.selectionEnd = matchStart + matchLength;
      const replacement = typeof replacer === "string" ? replacer : replacer(...args);
      TextHelpers.insert(field, replacement);
      field.selectionStart = matchStart;
      drift += replacement.length - matchLength;
      return replacement;
    });
  }
  static findLineEnd(value, currentEnd) {
    const lastLineStart = value.lastIndexOf("\n", currentEnd - 1) + 1;
    if (value.charAt(lastLineStart) !== "	") {
      return currentEnd;
    }
    return lastLineStart + 1;
  }
  static indent(element) {
    const { selectionStart, selectionEnd, value } = element;
    const selectedContrast = value.slice(selectionStart, selectionEnd);
    const lineBreakCount = /\n/g.exec(selectedContrast)?.length;
    if (lineBreakCount && lineBreakCount > 0) {
      const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const newSelection = element.value.slice(firstLineStart, selectionEnd - 1);
      const indentedText = newSelection.replace(
        /^|\n/g,
        // Match all line starts
        `$&${INDENT}`
      );
      const replacementsCount = indentedText.length - newSelection.length;
      element.setSelectionRange(firstLineStart, selectionEnd - 1);
      TextHelpers.insert(element, indentedText);
      element.setSelectionRange(selectionStart + 1, selectionEnd + replacementsCount);
    } else {
      TextHelpers.insert(element, INDENT);
    }
  }
  // The first line should always be unindented
  // The last line should only be unindented if the selection includes any characters after \n
  static unindent(element) {
    const { selectionStart, selectionEnd, value } = element;
    const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const minimumSelectionEnd = TextHelpers.findLineEnd(value, selectionEnd);
    const newSelection = element.value.slice(firstLineStart, minimumSelectionEnd);
    const indentedText = newSelection.replace(/(^|\n)(\t| {1,2})/g, "$1");
    const replacementsCount = newSelection.length - indentedText.length;
    element.setSelectionRange(firstLineStart, minimumSelectionEnd);
    TextHelpers.insert(element, indentedText);
    const firstLineIndentation = /\t| {1,2}/.exec(value.slice(firstLineStart, selectionStart));
    const difference = firstLineIndentation ? firstLineIndentation[0].length : 0;
    const newSelectionStart = selectionStart - difference;
    element.setSelectionRange(
      selectionStart - difference,
      Math.max(newSelectionStart, selectionEnd - replacementsCount)
    );
  }
  static indentCE(element) {
    const selection = window.getSelection();
    const value = element.innerText;
    const selectionStart = getCaretIndex(element) ?? 0;
    const selectionEnd = getCaretIndex(element) ?? 0;
    const selectedContrast = value.slice(selectionStart, selectionEnd);
    const lineBreakCount = /\n/g.exec(selectedContrast)?.length;
    if (lineBreakCount && lineBreakCount > 0) {
      const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const newSelection = value.slice(firstLineStart, selectionEnd - 1);
      const indentedText = newSelection.replace(
        /^|\n/g,
        // Match all line starts
        `$&${INDENT}`
      );
      const replacementsCount = indentedText.length - newSelection.length;
      if (selection) {
        selection.setBaseAndExtent(
          element,
          selectionStart + 1,
          element,
          selectionEnd + replacementsCount
        );
      }
    } else {
      const selection2 = window.getSelection();
      element.innerText = value.slice(0, selectionStart) + INDENT + value.slice(selectionStart);
      selection2?.setBaseAndExtent(element, selectionStart + 1, element, selectionStart + 2);
    }
  }
  static unindentCE(element) {
    const selection = window.getSelection();
    const value = element.innerText;
    const selectionStart = getCaretIndex(element) ?? 0;
    const selectionEnd = getCaretIndex(element) ?? 0;
    const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const minimumSelectionEnd = TextHelpers.findLineEnd(value, selectionEnd);
    const newSelection = value.slice(firstLineStart, minimumSelectionEnd);
    const indentedText = newSelection.replace(/(^|\n)(\t| {1,2})/g, "$1");
    const replacementsCount = newSelection.length - indentedText.length;
    if (selection) {
      selection.setBaseAndExtent(element, firstLineStart, element, minimumSelectionEnd);
      const firstLineIndentation = /\t| {1,2}/.exec(value.slice(firstLineStart, selectionStart));
      const difference = firstLineIndentation ? firstLineIndentation[0].length : 0;
      const newSelectionStart = selectionStart - difference;
      selection.setBaseAndExtent(
        element,
        selectionStart - difference,
        element,
        Math.max(newSelectionStart, selectionEnd - replacementsCount)
      );
    }
  }
  static fixNewLines = /\r?\n|\r/g;
  static normalizeText(text) {
    return text.replace(TextHelpers.fixNewLines, "\n");
  }
  static normalizeTextForDom(text) {
    return text.replace(TextHelpers.fixNewLines, "\n").split("\n").map((x) => x || " ").join("\n");
  }
}
function getCaretIndex(element) {
  if (typeof window.getSelection === "undefined") return;
  const selection = window.getSelection();
  if (!selection) return;
  let position = 0;
  if (selection.rangeCount !== 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    position = preCaretRange.toString().length;
  }
  return position;
}
//# sourceMappingURL=TextHelpers.js.map
