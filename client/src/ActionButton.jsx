import React from "react";

function ActionButton(props) {
	const isTelephone = props.name === "telephone";
	const iconStyling = {
		fontSize: "1.7rem",
	};

	return (
		<div
			onClick={props.onClick}
			className={isTelephone ? "action-button red-background" : "action-button grey-background"}
		>
			<sl-tooltip content={props.tooltip}>
				<sl-icon-button
					name={props.name}
					style={iconStyling}
					class={isTelephone ? "telephone-icon action-button-icon" : "regular-icon action-button-icon"}
				></sl-icon-button>
			</sl-tooltip>
		</div>
	);
}

export default ActionButton;
