// Some of the code here was taken from Zere's Plugin Library.
// Specifically, lines 29-32 https://github.com/rauenzi/BDPluginLibrary/blob/master/lib/templates/built.js
// This is done to initialize our plugin properly with the lib.

import config from '../pluginMeta.json';
import { version } from '../package.json';

import styles from './styles.css'
const configPatch = {
	...config,
	version
};

class Dummy {
	constructor() { this._config = "" }
	start() {}
	stop() {}
}

export default !global.ZeresPluginLibrary ? Dummy: ( // lol
/**
 * @param {[import('zerespluginlibrary').Plugin, import('zerespluginlibrary').BoundAPI]}
 */
([Plugin, Library]) => {

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
			DOMTools.addStyle("displaynotifs", styles);
		}

		onStop() {
			// Patcher.unpatchAll(tag);
			Dispatcher.unsubscribe("MESSAGE_CREATE", this.handleMessageCreateEvent)
			DOMTools.removeStyle("displaynotifs");
		}
	}

	return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch))