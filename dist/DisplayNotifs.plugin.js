/**
 * @name DisplayNotifs
 * @description BD plugin to show notifications that the OS may have missed.
 * @author Midori
 * @source https://raw.githubusercontent.com/KiriKaz/DisplayNotifs/master/dist/DisplayNotifs.plugin.js
 * @updateUrl https://raw.githubusercontent.com/KiriKaz/DisplayNotifs/master/dist/DisplayNotifs.plugin.js
 * @version 1.0.0
 * @website https://github.com/KiriKaz/DisplayNotifs
 */
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// pluginMeta.json
var require_pluginMeta = __commonJS({
  "pluginMeta.json"(exports2, module2) {
    module2.exports = {
      info: {
        name: "DisplayNotifs",
        description: "BD plugin to show notifications that the OS may have missed.",
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
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "displaynotifs",
      version: "1.0.0",
      description: "BD plugin to show notifications that the OS may have missed.",
      main: "src/index.js",
      repository: "https://github.com/KiriKaz/DisplayNotifs",
      author: "KiriKaz <igkepsi@gmail.com>",
      license: "MIT",
      private: false,
      scripts: {
        build: "node build.js",
        copyToBD: "node copyToBD.js",
        ci: "yarn build && yarn copyToBD"
      },
      devDependencies: {
        esbuild: "^0.23.0",
        zerespluginlibrary: "^2.0.6"
      }
    };
  }
});

// src/index.js
var config = require_pluginMeta();
var pkg = require_package();
var configPatch = {
  ...config,
  version: pkg.version
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
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Library]) => {
  const { DiscordModules } = Library;
  const { Dispatcher } = DiscordModules;
  const tag = "DisplayNotifs";
  class DisplayNotifs extends Plugin {
    // constructor() {
    // 	super(configPatch)
    // }
    handleMessageCreate({ message }) {
      console.log(message);
    }
    onStart() {
      Dispatcher.subscribe("MESSAGE_CREATE", this.handleMessageCreate);
    }
    onStop() {
      Dispatcher.unsubscribe("MESSAGE_CREATE", this.handleMessageCreate);
    }
  }
  return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch));
