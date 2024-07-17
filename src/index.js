// Some of the code here was taken from Zere's Plugin Library.
// Specifically, lines 29-32 https://github.com/rauenzi/BDPluginLibrary/blob/master/lib/templates/built.js
// This is done to initialize our plugin properly with the lib.

import config from '../pluginMeta.json';
import { version } from '../package.json';

import styles from './styles.css'
import { NotifHandler } from './notifStore';
import { NotificationView } from './components/notificationView';

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

		element = DOMTools.createElement("<div id=\"DNMainElementParent\" />")

		onStart() {
			const showNotifModule = BdApi.Webpack.getByKeys("showNotification", "requestPermission");
			Patcher.before(showNotifModule, "showNotification", (_, data) => this.handleMessageCreateEvent(data))
			// Dispatcher.subscribe("MESSAGE_CREATE", this.handleMessageCreateEvent);
			Dispatcher.subscribe('dn_reset_notif', NotifHandler.resetNotifs);
			Dispatcher.subscribe('dn_add_notif', NotifHandler.createNotif);
			Dispatcher.subscribe('dn_del_notif', NotifHandler.deleteNotif);
			DOMTools.addStyle("displaynotifs", styles);
			DOMTools.Q("#app-mount").append(this.element);
			BdApi.ReactDOM.render(<NotificationView />, this.element);
		}

		onStop() {
			Patcher.unpatchAll()
			// Dispatcher.unsubscribe("MESSAGE_CREATE", this.handleMessageCreateEvent);
			Dispatcher.unsubscribe('dn_reset_notif', NotifHandler.resetNotifs);
			Dispatcher.unsubscribe('dn_add_notif', NotifHandler.createNotif);
			Dispatcher.unsubscribe('dn_del_notif', NotifHandler.deleteNotif);
			DOMTools.removeStyle("displaynotifs");
		}
	}

	return DisplayNotifs;
})(global.ZeresPluginLibrary.buildPlugin(configPatch));
