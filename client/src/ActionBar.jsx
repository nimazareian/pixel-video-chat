import React, { useState } from "react";

import ActionButton from "./ActionButton";

function ActionBar() {
	var [isMute, setIsMute] = useState(false);
	var [isCameraOff, setIsCameraOff] = useState(false);
	var [inVideoChat, setInVideoChat] = useState(true);

	return (
		<div id="action-bar">
			<ActionButton
				name={isMute ? "mic-mute" : "mic"}
				tooltip={isMute ? "Unmute" : "Mute"}
				onClick={() => {
					setIsMute(!isMute);
				}}
			></ActionButton>

			<ActionButton
				name={isCameraOff ? "camera-video-off" : "camera-video"}
				tooltip={isCameraOff ? "Camera On" : "Camera Off"}
				onClick={() => {
					setIsCameraOff(!isCameraOff);
				}}
			></ActionButton>

			<ActionButton
				name="telephone"
				tooltip="Hang-up"
				onClick={() => {
					console.log("clicked");
				}}
			></ActionButton>
		</div>
	);
}

export default ActionBar;
