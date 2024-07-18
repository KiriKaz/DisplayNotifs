// Some of the code here was taken from Zere's Plugin Library.
// Specifically, lines 29-32 https://github.com/rauenzi/BDPluginLibrary/blob/master/lib/templates/built.js
// This is done to initialize our plugin properly with the lib.

import config from '../pluginMeta.json';
import { version, description } from '../package.json';

import { ACTION_TYPES } from './actionTypes';
import { NotifHandler } from './notifStore';
import { NotificationView } from './components/notificationView';

import styles from './styles.css'
const configPatch = {
	...config,
	version,
	description
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

		handleRPCNotifCreateEvent({ body: notificationBody, title: notificationTitle, icon: notificationIcon, message }) {
			Dispatcher.dispatch({
				type: ACTION_TYPES.addNotif,
				data: { authorIcon: notificationIcon, authorDisplayName: notificationTitle, messageContent: notificationBody, messageInfo: message }
			});

			setTimeout(() => {
				Dispatcher.dispatch( {
					type: ACTION_TYPES.delNotif,
					data: messageInfo.message_id
				});
			}, 10000);
			// TODO: change the way this works
		}

		element = DOMTools.createElement("<div id=\"DNMainElementParent\" />")

		dispatchSubscribe() {
			Dispatcher.subscribe("RPC_NOTIFICATION_CREATE", this.handleRPCNotifCreateEvent)
			Dispatcher.subscribe(ACTION_TYPES.resetNotifs, NotifHandler.resetNotifs);
			Dispatcher.subscribe(ACTION_TYPES.addNotif, NotifHandler.createNotif);
			Dispatcher.subscribe(ACTION_TYPES.delNotif, NotifHandler.deleteNotif);
		}

		dispatchUnsubscribe() {
			Dispatcher.unsubscribe("RPC_NOTIFICATION_CREATE", this.handleRPCNotifCreateEvent)
			Dispatcher.unsubscribe(ACTION_TYPES.resetNotifs, NotifHandler.resetNotifs);
			Dispatcher.unsubscribe(ACTION_TYPES.addNotif, NotifHandler.createNotif);
			Dispatcher.unsubscribe(ACTION_TYPES.delNotif, NotifHandler.deleteNotif);
		}

		addStyles() {
			DOMTools.addStyle("displaynotifs", styles);
		}

		removeStyles() {
			DOMTools.removeStyle("displaynotifs");
		}

		mountAndRender() {
			DOMTools.Q("#app-mount").append(this.element);
			BdApi.ReactDOM.render(<NotificationView />, this.element);
		}

		unmountAndRemove() {
			this.element.remove()
		}

		onStart() {
			this.dispatchSubscribe();
			this.addStyles();
			this.mountAndRender();
		}

		onStop() {
			this.dispatchUnsubscribe();
			this.removeStyles();
			this.unmountAndRemove();
		}
	}

	return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch));
