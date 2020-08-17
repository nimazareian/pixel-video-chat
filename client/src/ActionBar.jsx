import React, { useState } from "react";

import ActionButton from "./ActionButton";

function ActionBar(props) {
	var [isMute, setIsMute] = useState(false);
	var [isCameraOff, setIsCameraOff] = useState(false);

	return (
		<div id="action-bar">
			<ActionButton
				name={isMute ? "mic-mute" : "mic"}
				tooltip={isMute ? "Unmute" : "Mute"}
				onClick={() => {
					setIsMute(!isMute);
					props.muteMic(isMute);
				}}
			></ActionButton>

			<ActionButton
				name={isCameraOff ? "camera-video-off" : "camera-video"}
				tooltip={isCameraOff ? "Camera On" : "Camera Off"}
				onClick={() => {
					setIsCameraOff(!isCameraOff);
					props.cameraOff(isCameraOff);
				}}
			></ActionButton>

			<ActionButton
				name="telephone"
				tooltip="Hang-up"
				onClick={() => {
					props.hangup();
				}}
			></ActionButton>
		</div>
	);
}

export default ActionBar;
