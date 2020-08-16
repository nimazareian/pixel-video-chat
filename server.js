const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const port = process.env.PORT || 5000;
const users = {};

// Using JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/api/hello", (req, res) => {
// 	res.send({ express: "Hello From Express" });
// });

// app.post("/api/world", (req, res) => {
// 	console.log(req.body);
// 	res.send(`I received your POST request. This is what you sent me: ${req.body.post}`);
// });

// socket.io enables realtime 2 way communication
io.on("connection", (socket) => {
	// new user
	if (!users[socket.id]) {
		users[socket.id] = socket.id;
	}

	socket.emit("yourID", socket.id);
	io.sockets.emit("allUsers", users);
	socket.on("disconnect", () => {
		delete user[socket.id];
	});

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("hey", { signal: data.signalData, from: data.from });
	});

	socket.on("acceptCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
