const addNotif = "dn_add_notif"
const delNotif = "dn_del_notif"
const resetNotifs = "dn_reset_notif"

const { DiscordModules } = ZLibrary;
const { Dispatcher } = DiscordModules;

const { EventEmitter } = require('events');

class NotifStore extends EventEmitter {
	addChangeListener(callback) {
		this.on('dn_notif_updated', callback);
	}

	removeChangeListener(callback) {
		this.off('dn_notif_updated', callback);
	}

	emitChange() {
		this.emit('dn_notif_updated', NotifHandler.notifs)
	}
}

export const store = new NotifStore();

export class NotifHandler {
	// static registeredDispatcher = null;
	static notifs = [];

	static createNotif(payload) {
		const newNotif = { ...payload.data };
		NotifHandler.notifs.push(newNotif)
		store.emitChange()
		return newNotif
	}

	static deleteNotif(payload) {
		NotifHandler.notifs = NotifHandler.notifs.filter(notif => notif.messageInfo.id !== payload.data)
		store.emitChange()
	}

	static resetNotifs() {
		NotifHandler.notifs = [];
		store.emitChange()
	}

	// static init() {
	// }

	// static outit() {
	// 	this.registeredDispatcher = null;
	// }
}
