const wsUrl = 'ws://localhost:8765';
let socket;
let reconnectInterval = 3000; // 3 seconds

// Function to handle sending a message to the server
// For a headless client, this could be used for automated testing or pings.
function sendDataToServer(data) {
    if (socket && socket.readyState === 1) { // WebSocket.OPEN = 1
        socket.send(data)
    } else {
        console.log('Socket not open, message not sent.');
    }
}

function str2uint(data) {
  const buff = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buff[i] = data.charCodeAt(i);
  }
  return buff;
}

function addCode(code, buff){
  const arrType = buff.constructor;
  const newBuff = new arrType(buff.length + 1);
  // const newBuff = new Float32Array(buff.length + 1);
  newBuff[0] = code; 
  newBuff.set(buff, 1);
  return newBuff;
}

const pos = new Float32Array(2)

// This function will be called to connect to the WebSocket server
function connectWebSocket() {
    try {
        console.log(`Attempting to connect to ${wsUrl}...`);
        
        // Create a new WebSocket connection
        // Note: When running this in Node.js, you would need a WebSocket client library
        // like 'ws'. This code assumes a browser-like environment where WebSocket is global.
        // For Node.js, you would instantiate a new 'WebSocket' object from the 'ws' library.
        // Example for Node.js: const WebSocket = require('ws'); const socket = new WebSocket(wsUrl);
        socket = new WebSocket(wsUrl);

        // Event listener for a successful connection
        socket.onopen = () => {
            console.log('Connected to WebSocket server!');
            // You can now send messages, for example:
            sendDataToServer(addCode(0, str2uint('Botolog')));
            // You could also set up a recurring ping here
            setInterval(() => {
              pos[0]+=1
              sendDataToServer(addCode(1, pos))
              if (pos[0]%1000==0){
                console.log(pos)
              }
            }, 0);
        };

        // Event listener for incoming messages from the server
        socket.onmessage = event => {
            // sendMessageToServer(event.data);
            console.log('Message from server:', event.data);
            // Parse the JSON data received from the server
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'message') {
                    console.log(`Server message content: ${data.content}`);
                }
            } catch (e) {
                // console.error("Failed to parse message:", e);
            }
        };

        // Event listener for when the connection is closed
        socket.onclose = () => {
            console.log('Disconnected from WebSocket server. Reconnecting...');
            // Attempt to reconnect after a short delay
            setTimeout(connectWebSocket, reconnectInterval);
        };

        // Event listener for any errors that occur
        socket.onerror = error => {
            console.error('WebSocket Error:', error);
        };

    } catch (e) {
        console.error("WebSocket connection failed:", e);
        console.log(`Retrying connection in ${reconnectInterval / 1000} seconds...`);
        setTimeout(connectWebSocket, reconnectInterval);
    }
}

// Start the WebSocket connection process
connectWebSocket();





// import {
//   gameTick,
//   // getCtx,
//   height,
//   genFrame,
//   width,
//   iColorConv,
//   keyInput,
//   scaleScreen,
//   // sc
// } from "./build/release.js";

// import { applyNoise, applyChromaticAberration, applyScanlines } from "./effects.js";


// // i have array of all of the rgba values of the pixels of the image displayed on the canvas
// // i want to display the frame on the canvas

// const WIDTH = width.value;
// const HEIGHT = height.value;

// let canvas = document.getElementById("canvas");
// canvas.width = WIDTH;
// canvas.height = HEIGHT;
// const mod = 1.3; 
// canvas.style.width = mod*WIDTH + "px";
// canvas.style.height = mod*HEIGHT + "px";

// let ctx = canvas.getContext("2d", { willReadFrequently: false });
// ctx.imageSmoothingEnabled = false;
// let imgData = ctx.createImageData(1*WIDTH, 1*HEIGHT);


// function gameLoop(timestamp) {
//     keyInput(Array.from(keysPressed));
//     gameTick(1);
//     // console.log(Array.from(keysPressed));
    
//   requestAnimationFrame(gameLoop);
// }

// // Start the game loop
// requestAnimationFrame(gameLoop);


// function renderFrame() {
//   //   iColorConv();
//   imgData.data.set(iColorConv());
//   // imgData.data.set(applyChromaticAberration(imgData.data));
//   // imgData.data.set(applyNoise(imgData.data));
//   // imgData.data.set(applyScanlines(imgData.data, WIDTH, HEIGHT));
  
//   ctx.putImageData(imgData, 0, 0)
//   // for (let i = 0; i < imgData.data.length; i++) {
//   //   imgData.data[i] = 50;
//   // }
//   //   imgData.data.set(getCtx());
//   // ctx.putImageData(imgData, 0, 0, 0, 0, );
// }

// function testFPS(timeOfTest, framesToRender=100) {
//   let start = Date.now();
//   let end = start + timeOfTest * 1000;
//   let i = 0;

//   while (Date.now() < end) {
//     genFrame();
//     renderFrame();

//     i++;
//   }
//   console.log("[1] FPS at testing", i / timeOfTest);

//   start = Date.now()
//   for (let i=0; i<framesToRender; i++){
//     genFrame()
//     renderFrame()
//   }
//   end = Date.now();
//   console.log("[2] FPS at testing", Math.round((1000*framesToRender)/(end-start)));

// }

// // setInterval(sc, 10);
// // setTimeout(() => {
// //   scaleScreen(0.5)
// //   testFPS(1);
  
//   setInterval(() => {
//     genFrame();
//     // gameTick();
//     renderFrame();
//     // console.log('frame rendered');
//   }, 1);
// // }, 1000);


// // // listen for keys
// // document.addEventListener("keydown", (e) => {
// //   if (e.key == "`") testFPS(1);
// //   if (e.key == "p") {}
// // });

// const keysPressed = new Set();
// let s = 50;
// document.addEventListener("keydown", (e) => {
//   keysPressed.add(e.key);
//   if (e.key == "-") scaleScreen((--s)/100);
//   if (e.key == "=") scaleScreen((++s)/100);
// });

// document.addEventListener("keyup", (e) => {
//   keysPressed.delete(e.key);
// });

// document.addEventListener("wheel", (e)=>{
//   // console.log(e);
//   if (e.deltaY < 0) scaleScreen((++s)/100)
//   else scaleScreen((--s)/100)
  
// })

// scaleScreen(s/100)
