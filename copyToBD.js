const path = require('path');
const fs = require('fs');

const appData = process.env.APPDATA;
fs.writeFileSync(path.join(appData, "BetterDiscord", "plugins", "DisplayNotifs.plugin.js"), fs.readFileSync("./dist/DisplayNotifs.plugin.js", "utf8"));