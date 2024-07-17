// Some of the code here was taken from Zere's Plugin Library.
// Specifically, lines 29-32 https://github.com/rauenzi/BDPluginLibrary/blob/master/lib/templates/built.js
// This is done to initialize our plugin properly with the lib.

import config from '../pluginMeta.json';
import { version } from '../package.json';

import { ACTION_TYPES } from './actionTypes';
import { NotifHandler } from './notifStore';
import { NotificationView } from './components/notificationView';

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

	const { DiscordModules, DOMTools, Patcher } = Library;
	const { Dispatcher } = DiscordModules;

	class DisplayNotifs extends Plugin {

		handleMessageCreateEvent(data) {
			const [ authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo ] = data
			Dispatcher.dispatch({
				type: ACTION_TYPES.addNotif,
				data: { authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo }
			})

			setTimeout(() => {
				Dispatcher.dispatch( {
					type: ACTION_TYPES.delNotif,
					data: notifInfo.message_id
				});
			}, 10000);
			// TODO: change the way this works
		}

		element = DOMTools.createElement("<div id=\"DNMainElementParent\" />")

		dispatchSubscribe() {
			Dispatcher.subscribe(ACTION_TYPES.resetNotifs, NotifHandler.resetNotifs);
			Dispatcher.subscribe(ACTION_TYPES.delNotif, NotifHandler.createNotif);
			Dispatcher.subscribe(ACTION_TYPES.addNotif, NotifHandler.deleteNotif);
		}

		dispatchUnsubscribe() {
			Dispatcher.unsubscribe(ACTION_TYPES.resetNotifs, NotifHandler.resetNotifs);
			Dispatcher.unsubscribe(ACTION_TYPES.delNotif, NotifHandler.createNotif);
			Dispatcher.unsubscribe(ACTION_TYPES.addNotif, NotifHandler.deleteNotif);
		}

		addStyles() {
			DOMTools.addStyle("displaynotifs", styles);
		}

		removeStyles() {
			DOMTools.removeStyle("displaynotifs");
		}

		onStart() {
			const showNotifModule = BdApi.Webpack.getByKeys("showNotification", "requestPermission");
			Patcher.before(showNotifModule, "showNotification", (_, data) => this.handleMessageCreateEvent(data)); // still hacky - figure out how this works!
			this.dispatchSubscribe();
			this.addStyles();
			DOMTools.Q("#app-mount").append(this.element);
			BdApi.ReactDOM.render(<NotificationView />, this.element);
		}

		onStop() {
			Patcher.unpatchAll();
			this.dispatchUnsubscribe();
			this.removeStyles();
		}
	}

	return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch));
