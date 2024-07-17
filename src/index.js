// Some of the code here was taken from Zere's Plugin Library.
// Specifically, lines 29-32 https://github.com/rauenzi/BDPluginLibrary/blob/master/lib/templates/built.js
// This is done to initialize our plugin properly with the lib.

const config = require('../pluginMeta.json');
const pkg = require('../package.json');

const configPatch = {
	...config,
	version: pkg.version
};

class Dummy {
	constructor() { this._config = "" }
	start() {}
	stop() {}
}

module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Library]) => {

	const { DiscordModules } = Library;
	const { Dispatcher } = DiscordModules;

	const tag = "DisplayNotifs";
	class DisplayNotifs extends Plugin {
		// constructor() {
		// 	super(configPatch)
		// }

		handleMessageCreateEvent({message}) {
			console.log(message)
		}

		onStart() {
			// Patcher.before(tag)
			Dispatcher.subscribe("MESSAGE_CREATE", this.handleMessageCreateEvent)
		}

		onStop() {
			// Patcher.unpatchAll(tag);
			Dispatcher.unsubscribe("MESSAGE_CREATE", this.handleMessageCreateEvent)
		}
	}

	return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch))