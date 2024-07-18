import { Notification } from './notification';
import { store as notifStore, NotifHandler } from '../notifStore';
import { ACTION_TYPES } from '../actionTypes';

export const NotificationView = () => {
	const { DiscordModules } = ZLibrary;
	const { React, Dispatcher } = DiscordModules;
	const { useState, useEffect } = React;

	const [notifs, setNotifs] = useState([]);

	useEffect(() => {
		notifStore.addChangeListener(onNotif)
		if(NotifHandler.notifs.length === 0) {
			setNotifs(NotifHandler.notifs)
		}
		return () => notifStore.removeChangeListener(onNotif)
	}, [])

	const onNotif = () => {
		// console.log(NotifHandler.notifs)
		setNotifs([...NotifHandler.notifs]);
	}

	const navigateTo = (messageInfo) => {
		const message_id = messageInfo.id;
		const channel_id = messageInfo.channel_id;
		const guild_id = messageInfo.guild_id ?? "@me"

		ZLibrary.DiscordModules['NavigationUtils'].transitionTo(`/channels/${guild_id}/${channel_id}/${message_id}`);
	}

	const generalClick = (messageInfo) => {
		const message_id = messageInfo.id;
		Dispatcher.dispatch({ type: ACTION_TYPES.delNotif, data: message_id });
		navigateTo(messageInfo);
	}

	const closerClick = (message_id, e) => {
		e.stopPropagation();
		Dispatcher.dispatch({ type: ACTION_TYPES.delNotif, data: message_id });
	}

	return (
		<div id="DNMainElement">
			{ notifs != [] && notifs.map(({ authorIcon, authorDisplayName, messageContent, messageInfo }) => (
				<Notification
					key={ messageInfo.message_id }
					author={{ name: authorDisplayName, icon: authorIcon }}
					messageContent={ messageContent }
					onGeneralClick={() => generalClick(messageInfo)}
					onCloserClick={(e) => closerClick(messageInfo.id, e)}
				/>))
			}
		</div>
	);
};