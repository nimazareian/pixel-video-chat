import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CreateRoom from "./routing/CreateRoom";
import Room from "./routing/Room";

function App() {
	return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={CreateRoom} />
					<Route path="/room/:roomID" component={Room} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
