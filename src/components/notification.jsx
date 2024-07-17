export const Notification = ({ author, messageContent, onGeneralClick, onCloserClick }) => {

	return (
		<div className="DN-notification-container" style={{ cursor: 'pointer' }} onClick={onGeneralClick}>
			<div className="DN-author">{ author.name }</div>
			<div className="DN-message">{ messageContent }</div>
			<div className="DN-closebutton" onClick={onCloserClick}>closebutton</div>
		</div>
	)
};