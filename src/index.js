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

	class DisplayNotifs extends Plugin {

		handleMessageCreateEvent(data) {
			const [ authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo ] = data
			Dispatcher.dispatch({
				type: 'dn_add_notif',
				data: { authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo }
			})

			setTimeout(() => {
				Dispatcher.dispatch( {
					type: 'dn_del_notif',
					data: notifInfo.message_id
				});
			}, 10000);
			// TODO: change the way this works
		}

		onStart() {
			const showNotifModule = BdApi.Webpack.getByKeys("showNotification", "requestPermission");
			Patcher.before(showNotifModule, "showNotification", (_, data) => this.handleMessageCreateEvent(data))
			DOMTools.addStyle("displaynotifs", styles);
		}

		onStop() {
			Patcher.unpatchAll()
			DOMTools.removeStyle("displaynotifs");
		}
	}

	return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch))