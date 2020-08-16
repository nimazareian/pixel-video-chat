import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

function App() {
	const [yourID, setYourID] = useState("");
	const [users, setUsers] = useState({});
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState("");
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);

	// useRef(initialVal) allows you to store/update value without re-rendering the component
	// it returns an object (i.e. {current: Val}), and inorder to get the value you use object.current
	// to update value, you can go object.current.value = newValue;

	// if you set the "ref" property of a HTML component to a useRef, React will set its .current property to the corresponding DOM node whenever that node changes.
	const userVideo = useRef();
	const partnerVideo = useRef();
	const socket = useRef();

	// useEffect(function, array) Runs a function everytime an element re-renders. If no array is included, function will run everytime page is re-rendered
	// If the array includes a useState variable (i.e. [var]), then everytime the value of var changes, the function runs
	// If an empty array is passed, then the function runs (on mount) initially, and never runs again since the value cant be updated
	useEffect(() => {
		socket.current = io.connect("/");
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream);
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
		});

		socket.current.on("yourID", (id) => {
			setYourID(id);
		});

		socket.current.on("allUsers", (users) => {
			setUsers(users);
		});

		socket.current.on("hey", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setCallerSignal(data.signal);
		});
	}, []);

	function callPeer(id) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream,
		});

		// one peer sends a signal to another, and once accepted the other peer will send back their data
		peer.on("signal", (data) => {
			socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID });
		});

		// incoming stream
		peer.on("stream", (stream) => {
			// is our partner being streamed?
			if (partnerVideo.current) {
				partnerVideo.current.srcObject = stream;
			}
		});

		// when user accepts call, they have to send their own data to other user
		socket.current.on("callAccepted", (signal) => {
			setCallAccepted(true);
			peer.signal(signal); // Important - other user to receive signal
		});
	}

	function acceptCall() {
		setCallAccepted(true);
		// peer receiving the call
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream,
		});
		peer.on("signal", (data) => {
			socket.current.emit("acceptCall", { signal: data, to: caller });
		});

		peer.on("stream", (stream) => {
			partnerVideo.current.srcObject = stream;
		});

		peer.signal(callerSignal);
	}

	let UserVideo;
	if (stream) {
		UserVideo = <video className="video" id="user-video" playsInline muted ref={userVideo} autoPlay />; //<div className="video" playsInline muted ref={userVideo} autoPlay />;
	}

	let PartnerVideo;
	if (callAccepted) {
		PartnerVideo = <video className="video" id="partner-video" playsInline ref={partnerVideo} autoPlay />;
	}

	let incomingCall;
	if (receivingCall) {
		incomingCall = (
			<div>
				<h1>{caller} is calling you</h1>
				<button onClick={acceptCall}>Answer</button>
			</div>
		);
	}

	return (
		<div>
			<div className="row">
				{UserVideo}
				{PartnerVideo}
			</div>
			<div className="row">
				{Object.keys(users).map((key) => {
					if (key === yourID) {
						return null;
					}
					return <button onClick={() => callPeer(key)}>call {key}</button>;
				})}
			</div>
			<div className="row">{incomingCall}</div>
		</div>
	);
}

export default App;
