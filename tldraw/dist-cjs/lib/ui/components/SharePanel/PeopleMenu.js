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
var PeopleMenu_exports = {};
__export(PeopleMenu_exports, {
  PeopleMenu: () => PeopleMenu
});
module.exports = __toCommonJS(PeopleMenu_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var Popover = __toESM(require("@radix-ui/react-popover"));
var import_editor = require("@tldraw/editor");
var import_useMenuIsOpen = require("../../hooks/useMenuIsOpen");
var import_useTranslation = require("../../hooks/useTranslation/useTranslation");
var import_PeopleMenuAvatar = require("./PeopleMenuAvatar");
var import_PeopleMenuItem = require("./PeopleMenuItem");
var import_PeopleMenuMore = require("./PeopleMenuMore");
var import_UserPresenceEditor = require("./UserPresenceEditor");
function PeopleMenu({ displayUserWhenAlone, children }) {
  const msg = (0, import_useTranslation.useTranslation)();
  const container = (0, import_editor.useContainer)();
  const editor = (0, import_editor.useEditor)();
  const userIds = (0, import_editor.usePeerIds)();
  const userColor = (0, import_editor.useValue)("user", () => editor.user.getColor(), [editor]);
  const userName = (0, import_editor.useValue)("user", () => editor.user.getName(), [editor]);
  const [isOpen, onOpenChange] = (0, import_useMenuIsOpen.useMenuIsOpen)("people menu");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover.Root, { onOpenChange, open: isOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popover.Trigger, { dir: "ltr", asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "tlui-people-menu__avatars-button", title: msg("people-menu.title"), children: [
      userIds.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_PeopleMenuMore.PeopleMenuMore, { count: userIds.length - 5 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "tlui-people-menu__avatars", children: [
        userIds.slice(-5).map((userId) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_PeopleMenuAvatar.PeopleMenuAvatar, { userId }, userId)),
        (displayUserWhenAlone || userIds.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: "tlui-people-menu__avatar",
            style: {
              backgroundColor: userColor
            },
            children: userName === "New User" ? "" : userName[0] ?? ""
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popover.Portal, { container, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Popover.Content,
      {
        dir: "ltr",
        className: "tlui-menu",
        align: "end",
        side: "bottom",
        sideOffset: 2,
        alignOffset: -5,
        onEscapeKeyDown: import_editor.preventDefault,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "tlui-people-menu__wrapper", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tlui-people-menu__section", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_UserPresenceEditor.UserPresenceEditor, {}) }),
          userIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tlui-people-menu__section", children: userIds.map((userId) => {
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_PeopleMenuItem.PeopleMenuItem, { userId }, userId + "_presence");
          }) }),
          children
        ] })
      }
    ) })
  ] });
}
//# sourceMappingURL=PeopleMenu.js.map
