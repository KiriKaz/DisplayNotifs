/**
 * @name DisplayNotifs
 * @description BD plugin to show notifications that the OS may have missed.
 * @author Midori
 * @version 1.0.0
 * @source https://raw.githubusercontent.com/KiriKaz/DisplayNotifs/master/dist/DisplayNotifs.plugin.js
 * @updateUrl https://raw.githubusercontent.com/KiriKaz/DisplayNotifs/master/dist/DisplayNotifs.plugin.js
 * @website https://github.com/KiriKaz/DisplayNotifs
 */
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

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/styles.css
var styles_default = "#DNMainElement {\r\n	position: absolute;\r\n	bottom: 100px;\r\n	right: 80px;\r\n	display: flex;\r\n	align-items: center;\r\n	justify-content: center;\r\n	flex-direction: column;\r\n	/* background-color: blue; */\r\n	background: rgba(1.0, 1.0, 1.0, 0.3);\r\n	backdrop-filter: blur(2px);\r\n	color: white;\r\n	gap: 50px;\r\n}\r\n\r\n.DN-notification-container {\r\n	display: flex;\r\n	flex-direction: row;\r\n	justify-content: space-between;\r\n	margin: 5px;\r\n	padding: 10px;\r\n	/* background-color: red; */\r\n	min-width: 350px;\r\n	cursor: pointer;\r\n}\r\n\r\n.DN-notification-container .DN-author {\r\n\r\n}\r\n\r\n.DN-notification-container .DN-message {\r\n\r\n}\r\n\r\n.DN-notification-container .DN-closebutton {\r\n\r\n}";

// pluginMeta.json
var pluginMeta_default = {
  info: {
    name: "DisplayNotifs",
    authors: [{
      name: "Midori",
      discord_id: "109122112643440640",
      github_username: "KiriKaz"
    }],
    github_raw: "https://raw.githubusercontent.com/KiriKaz/DisplayNotifs/master/dist/DisplayNotifs.plugin.js"
  },
  changelog: [
    { title: "Initializing", items: ["Starting to develop the plugin now."] }
  ],
  defaultConfig: [],
  main: "src/index.js"
};

// package.json
var version = "1.0.0";
var description = "BD plugin to show notifications that the OS may have missed.";

// src/actionTypes.js
var ACTION_TYPES = {
  addNotif: "DN_ADD_NOTIF",
  delNotif: "DN_DEL_NOTIF",
  resetNotifs: "DN_RESET_NOTIF"
};

// src/notifStore.js
var { DiscordModules } = ZLibrary;
var { Dispatcher } = DiscordModules;
var { EventEmitter } = require("events");
var NotifStore = class extends EventEmitter {
  addChangeListener(callback) {
    this.on("dn_notif_updated", callback);
  }
  removeChangeListener(callback) {
    this.off("dn_notif_updated", callback);
  }
  emitChange() {
    this.emit("dn_notif_updated", NotifHandler.notifs);
  }
};
var store = new NotifStore();
var NotifHandler = class _NotifHandler {
  // static registeredDispatcher = null;
  static notifs = [];
  static createNotif(payload) {
    const newNotif = { ...payload.data };
    _NotifHandler.notifs.push(newNotif);
    store.emitChange();
    return newNotif;
  }
  static deleteNotif(payload) {
    _NotifHandler.notifs = _NotifHandler.notifs.filter((notif) => notif.notifInfo.message_id !== payload.data);
    store.emitChange();
  }
  static resetNotifs() {
    _NotifHandler.notifs = [];
    store.emitChange();
  }
  // static init() {
  // }
  // static outit() {
  // 	this.registeredDispatcher = null;
  // }
};

// src/components/notification.jsx
var Notification = ({ author, messageContent, onGeneralClick, onCloserClick }) => {
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "DN-notification-container", style: { cursor: "pointer" }, onClick: onGeneralClick }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "DN-author" }, author.name), /* @__PURE__ */ BdApi.React.createElement("div", { className: "DN-message" }, messageContent), /* @__PURE__ */ BdApi.React.createElement("div", { className: "DN-closebutton", onClick: onCloserClick }, "closebutton"));
};

// src/components/notificationView.jsx
var NotificationView = () => {
  const { DiscordModules: DiscordModules2 } = ZLibrary;
  const { React, Dispatcher: Dispatcher2 } = DiscordModules2;
  const { useState, useEffect } = React;
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    store.addChangeListener(onNotif);
    if (NotifHandler.notifs.length === 0) {
      setNotifs(NotifHandler.notifs);
    }
    return () => store.removeChangeListener(onNotif);
  }, []);
  const onNotif = () => {
    console.log(NotifHandler.notifs);
    setNotifs([...NotifHandler.notifs]);
  };
  const generalClick = (interactionInfo) => {
    const message_id = interactionInfo.tag;
    Dispatcher2.dispatch({ type: ACTION_TYPES.delNotif, data: message_id });
    interactionInfo.onClick();
  };
  const closerClick = (message_id) => {
    Dispatcher2.dispatch({ type: ACTION_TYPES.delNotif, data: message_id });
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { id: "DNMainElement" }, notifs != [] && notifs.map(({ authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo }) => /* @__PURE__ */ BdApi.React.createElement(
    Notification,
    {
      key: notifInfo.message_id,
      author: { name: authorDisplayName, icon: authorIcon },
      messageContent,
      onGeneralClick: () => generalClick(interactionInfo),
      onCloserClick: () => closerClick(notifInfo.message_id)
    }
  )));
};

// src/index.js
var configPatch = {
  ...pluginMeta_default,
  version,
  description
};
var Dummy = class {
  constructor() {
    this._config = "";
  }
  start() {
  }
  stop() {
  }
};
var src_default = !global.ZeresPluginLibrary ? Dummy : (
  // lol
  /**
   * @param {[import('zerespluginlibrary').Plugin, import('zerespluginlibrary').BoundAPI]}
   */
  (([Plugin, Library]) => {
    const { DiscordModules: DiscordModules2, DOMTools, Patcher } = Library;
    const { Dispatcher: Dispatcher2 } = DiscordModules2;
    class DisplayNotifs extends Plugin {
      handleMessageCreateEvent(data) {
        const [authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo] = data;
        Dispatcher2.dispatch({
          type: ACTION_TYPES.addNotif,
          data: { authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo }
        });
        setTimeout(() => {
          Dispatcher2.dispatch({
            type: ACTION_TYPES.delNotif,
            data: notifInfo.message_id
          });
        }, 1e4);
      }
      element = DOMTools.createElement('<div id="DNMainElementParent" />');
      dispatchSubscribe() {
        Dispatcher2.subscribe(ACTION_TYPES.resetNotifs, NotifHandler.resetNotifs);
        Dispatcher2.subscribe(ACTION_TYPES.delNotif, NotifHandler.createNotif);
        Dispatcher2.subscribe(ACTION_TYPES.addNotif, NotifHandler.deleteNotif);
      }
      dispatchUnsubscribe() {
        Dispatcher2.unsubscribe(ACTION_TYPES.resetNotifs, NotifHandler.resetNotifs);
        Dispatcher2.unsubscribe(ACTION_TYPES.delNotif, NotifHandler.createNotif);
        Dispatcher2.unsubscribe(ACTION_TYPES.addNotif, NotifHandler.deleteNotif);
      }
      addStyles() {
        DOMTools.addStyle("displaynotifs", styles_default);
      }
      removeStyles() {
        DOMTools.removeStyle("displaynotifs");
      }
      mountAndRender() {
        DOMTools.Q("#app-mount").append(this.element);
        BdApi.ReactDOM.render(/* @__PURE__ */ BdApi.React.createElement(NotificationView, null), this.element);
      }
      unmountAndRemove() {
        this.element.remove();
      }
      onStart() {
        const showNotifModule = BdApi.Webpack.getByKeys("showNotification", "requestPermission");
        Patcher.before(showNotifModule, "showNotification", (_, data) => this.handleMessageCreateEvent(data));
        this.dispatchSubscribe();
        this.addStyles();
        this.mountAndRender();
      }
      onStop() {
        Patcher.unpatchAll();
        this.dispatchUnsubscribe();
        this.removeStyles();
        this.unmountAndRemove();
      }
    }
    return DisplayNotifs;
  })(global.ZeresPluginLibrary.buildPlugin(configPatch))
);
