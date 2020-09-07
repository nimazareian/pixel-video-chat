# Pixel Video Chat - Chat with your friends for free!

This project uses WebRTC and Peer-to-peer (P2P) connection between users to allow for high quality video chat. 

React is used for the front end, with the nodeJS as the back-end server. 

## Live Demo
You can view live demo of this project by going to: https://secret-woodland-90156.herokuapp.com/

#### Demo Tutorial
- Make sure you allow for the website to access your camera and microphone for the demo to work.
- You can open the same tab twice to simulate 2 users
- After having 2 tabs open, click the button at the bottom of the screen named "Call *otherUserID*"
- In your second tab it should say that you're being called. You can click on "*Answer*" to answer and create a connection between your two tabs.

- You can also mute, turn camera off, and hang up the call by hovering your mouse over the bottom of the screen for the buttons to appear.

## Demo of Me Calling Myself
<img src="https://github.com/nimazareian/pixel-video-chat/blob/master/demo.png" width="650" title="Demo">

## Run Locally
To run the most recent version of this app first install all the necessary packages by running (If you're using pip):
```
npm install
cd .\client\
npm install
```
Then run the node server and run the app
```
node server.js
cd .\client\
npm start
```
The app is ran on port 3000: http://localhost:3000/


##
Feature to have multiple rooms available for more users to call each other simultaneously is in progress!
