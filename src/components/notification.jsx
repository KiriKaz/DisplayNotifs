import closeButtonIcon from '../icons/close-icon.svg';

export const Notification = ({ author, messageContent, onGeneralClick, onCloserClick }) => {

	return (
		<div className="DN-notification-container" style={{ cursor: 'pointer' }} onClick={ onGeneralClick }>
			<div className="DN-leftmost">
				<div className="DN-icon"><img src={ author.icon }/></div>
				<div className="DN-message"><div className="DN-author">{ author.name }</div><div className="DN-message-content">{ messageContent }</div></div>
			</div>
			<div className="DN-closebutton" onClick={ onCloserClick }><img src={closeButtonIcon}/></div>
		</div>
	)
};