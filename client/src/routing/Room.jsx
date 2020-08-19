import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

import ActionBar from "../ActionBar";

const Video = (props) => {
	const ref = useRef();

	useEffect(() => {
		props.peer.on("stream", (stream) => {
			ref.current.srcObject = stream;
		});
	}, []);

	return <video playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

const Room = (props) => {
	const [peers, setPeers] = useState([]);
	const socketRef = useRef();
	const userVideo = useRef();
	const peersRef = useRef([]);
	const roomID = props.match.params.roomID;

	useEffect(() => {
		socketRef.current = io.connect("/");
		navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then((stream) => {
			userVideo.current.srcObject = stream;
			socketRef.current.emit("join room", roomID);
			socketRef.current.on("all users", (users) => {
				const peers = [];
				users.forEach((userID) => {
					const peer = createPeer(userID, socketRef.current.id, stream);
					peersRef.current.push({
						peerID: userID,
						peer,
					});
					peers.push(peer);
				});
				setPeers(peers);
			});

			socketRef.current.on("user joined", (payload) => {
				const peer = addPeer(payload.signal, payload.callerID, stream);
				peersRef.current.push({
					peerID: payload.callerID,
					peer,
				});

				setPeers((users) => [...users, peer]);
			});

			socketRef.current.on("receiving returned signal", (payload) => {
				const item = peersRef.current.find((p) => p.peerID === payload.id);
				item.peer.signal(payload.signal);
			});
		});
	}, []);

	function createPeer(userToSignal, callerID, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on("signal", (signal) => {
			socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
		});

		return peer;
	}

	function addPeer(incomingSignal, callerID, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});

		peer.on("signal", (signal) => {
			socketRef.current.emit("returning signal", { signal, callerID });
		});

		peer.signal(incomingSignal);

		return peer;
	}

	// let UserVideo;
	// // var [UserVideo, setUserVideo] = useState();
	// if (stream) {
	// 	UserVideo = <video className="video" id="user-video" playsInline muted ref={userVideo} autoPlay />; //<div className="video" playsInline muted ref={userVideo} autoPlay />;
	// }

	// let PartnerVideo;
	// // var [PartnerVideo, setPartnerVideo] = useState();
	// if (callAccepted) {
	// 	PartnerVideo = <video className="video" id="partner-video" playsInline ref={partnerVideo} autoPlay />;
	// }

	// let incomingCall;
	// if (receivingCall) {
	// 	// acceptCall();
	// 	incomingCall = (
	// 		<div>
	// 			<h1>{caller} is calling you</h1>
	// 			<button onClick={acceptCall}>Answer</button>
	// 		</div>
	// 	);
	// }

	// function muteMic(isMute) {
	// 	userVideo.current.srcObject.getAudioTracks()[0].enabled = isMute;
	// }

	// function cameraOff(isCameraOff) {
	// 	userVideo.current.srcObject.getVideoTracks()[0].enabled = isCameraOff;
	// }

	// function hangup() {
	// 	try {
	// 		setCallAccepted(false);

	// 		// partnerPeer.destory();

	// 		// close your peers video/audio
	// 		if (partnerVideo) {
	// 			partnerVideo.current.srcObject.getTracks().forEach(function (track) {
	// 				track.stop();
	// 			});
	// 		}
	// 		// setPartnerVideo(null);
	// 	} catch (err) {
	// 		console.log(err);
	// 		alert("Error while hangingup");
	// 		// e.printStackTrace();
	// 	}
	// }

	// function showActionbar() {
	// 	var actionbar = document.querySelector("#action-bar");

	// 	actionbar.classList.add("actionbar-animate-in");
	// 	if (actionbar.classList.contains("actionbar-animate-out")) {
	// 		actionbar.classList.remove("actionbar-animate-out");
	// 	}
	// 	console.log("show", actionbar);
	// }

	// function hideActionbar() {
	// 	var actionbar = document.querySelector("#action-bar");

	// 	actionbar.classList.add("actionbar-animate-out");
	// 	if (actionbar.classList.contains("actionbar-animate-in")) {
	// 		actionbar.classList.remove("actionbar-animate-in");
	// 	}
	// 	console.log("hide", actionbar);
	// }

	return (
		<div>
			<video muted ref={userVideo} autoPlay playsInline />
			{peers.map((peer, index) => {
				return <Video key={index} peer={peer} />;
			})}
			{/* <div className="row video-chat">
				{UserVideo}
				{callAccepted && PartnerVideo}
				{callAccepted && (
					<div id="mouse-move-area" onMouseOver={hideActionbar} onMouseOut={showActionbar}></div>
				)}
				{callAccepted && <ActionBar muteMic={muteMic} cameraOff={cameraOff} hangup={hangup}></ActionBar>}
			</div>
			<div className="row">
				{Object.keys(users).map((key) => {
					if (key === yourID) {
						return null;
					}
					return (
						<button onClick={() => callPeer(key)} key={key}>
							call {key}
						</button>
					);
				})}
			</div>
			<div className="row">{incomingCall}</div> */}
		</div>
	);
};

export default Room;
