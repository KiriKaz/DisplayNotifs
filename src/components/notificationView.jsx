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

	const generalClick = (interactionInfo) => {
		const message_id = interactionInfo.tag;
		Dispatcher.dispatch({ type: ACTION_TYPES.delNotif, data: message_id })
		interactionInfo.onClick();
	}

	const closerClick = (message_id) => {
		Dispatcher.dispatch({ type: ACTION_TYPES.delNotif, data: message_id })
	}

	return (
		<div id="DNMainElement">
			{ notifs != [] && notifs.map(({ authorIcon, authorDisplayName, messageContent, notifInfo, interactionInfo }) => (
				<Notification
					key={ notifInfo.message_id }
					author={{ name: authorDisplayName, icon: authorIcon }}
					messageContent={ messageContent }
					onGeneralClick={() => generalClick(interactionInfo)}
					onCloserClick={() => closerClick(notifInfo.message_id)}
				/>))
			}
		</div>
	);
};