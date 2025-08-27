import { DC, KEY, INFO } from "../shared/build/defs.js"
import {
  addCode,
  areSetsEqual,
  boxFromBuff,
  boxsFromBuff,
  sendDataToServer,
  str2uint,
  vecFromBuff,
  Box,
  canvas,
  ctx,
  reconnectInterval,
  wsUrl,
  Me,
  clear,
  show,
  Render,
  draw,
  Screen,
  TORENDER

} from "./defs.js"


export let renderDistance = 70
let renderRequestOptions = new ArrayBuffer(3)
let view = new DataView(renderRequestOptions)
view.setUint8(0, true)

view.setUint16(1, 500, true)
// view.setUint16(1, Math.sqrt(Screen[0]**2+Screen[1]**2), true)
renderRequestOptions = new Uint8Array(renderRequestOptions)

export const ME = new Me()
let boxs = []

export let socket;
export function connectWebSocket() {
  try {
    console.log(`Attempting to connect to ${wsUrl}...`);

    // Create a new WebSocket connection
    // Note: When running this in Node.js, you would need a WebSocket client library
    // like 'ws'. This code assumes a browser-like environment where WebSocket is global.
    // For Node.js, you would instantiate a new 'WebSocket' object from the 'ws' library.
    // Example for Node.js: const WebSocket = require('ws'); const socket = new WebSocket(wsUrl);
    socket = new WebSocket(wsUrl);
    socket.binaryType = "arraybuffer"
    // socket.setTimeout


    // Event listener for a successful connection
    socket.onopen = () => {
      console.log('Connected to WebSocket server!');
      // You can now send messages, for example:
      sendDataToServer(addCode(DC.SET_UID, str2uint('Botolog')));
      sendDataToServer(addCode(DC.GET_ENV, renderRequestOptions))
      // You could also set up a recurring ping here
      setInterval(() => {
        sendDataToServer(addCode(DC.GET_ENV, renderRequestOptions))
      }, 500);

      setInterval(() => {
        clear();
        show();
      }, 20);
    };

    // Event listener for incoming messages from the server
    socket.onmessage = event => {
      const data = event.data;
      const codeView = new Uint8Array(data);
      const code = codeView[0];
      const content = data.slice(1);

      // console.warn(`DEBUG ${code}: `, codeView);
      if (code === DC.SET_ENV) {
        boxsFromBuff(content)


        // drawBoxs(boxs, '#ff0000ff');
        // show();
        return
      }
      if (code === DC.SET_ME) {
        ME.fromByte(content)
        // ME.toRender()
        // drawBoxs([ME], "#AA00FFFF")
        // show();
        return
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





function keyInput(inputKeys) {
  let toSend = []
  // if ("k" in inputKeys) moveCam(-15, 0);
  // if (";" in inputKeys) moveCam(15, 0);
  // if ("o" in inputKeys) moveCam(0, 15);
  // if ("l" in inputKeys) moveCam(0, -15);
  if (inputKeys.has("ArrowLeft")) toSend.push(KEY.LEFT)
  if (inputKeys.has("ArrowRight")) toSend.push(KEY.RIGHT)
  if (inputKeys.has("ArrowUp")) toSend.push(KEY.UP)
  if (inputKeys.has("ArrowDown")) toSend.push(KEY.DOWN)
  // if ("a" in inputKeys) Me.control(-1, 0);
  // if ("d" in inputKeys) Me.control(1, 0);
  // if ("w" in inputKeys) Me.control(0, 0.02);
  // if ("s" in inputKeys) Me.control(0, -0.2);
  // if (" " in inputKeys) Me.meleeAttack();
  // if ("`" in inputKeys) gameTick();
  // if (inputKeys.includes("q")) console.log(

  //   // SCENEMANAGER.currentScene.camera.inView(new Vector2()).toString()
  // );
  // CAMERA.forceCenterCam(Me.body.coordinates)
  return new Uint8Array(toSend)
}



let ChatIsOpen = false
export const chat = document.getElementById("chat")
export const chatin = document.getElementById("chatin")
chatin.value = ""
export function openChat() {
  console.log(ChatIsOpen);

  if (ChatIsOpen) return;
  chat.style.display = "block";
  chatin.focus();
  ChatIsOpen = true;
}

export function closeChat() {
  if (!ChatIsOpen) return;
  chat.style.display = "none";
  chatin.value = ""
  canvas.focus();
  ChatIsOpen = false;
}

chat.onkeydown = event => {
  if (event.key == "Escape") closeChat()
  if (event.key == "Enter") {
    sendDataToServer(addCode(DC.ADD_MSG))
    closeChat()
  }

}


let lastState = new Set()
function sendKeys(keys) {
  const data = keyInput(keys);
  if (!areSetsEqual(keys, lastState)) {
    sendDataToServer(addCode(DC.SET_KEY, data));
    lastState = new Set(keys)
  }
}
const keysPressed = new Set();
// keysPressed.
let s = 50;
document.addEventListener("keydown", (e) => {
  if (ChatIsOpen) return;
  keysPressed.add(e.key);
  if (e.key == "-") scaleScreen((--s) / 100);
  if (e.key == "=") scaleScreen((++s) / 100);
  if (e.key == "`") openChat()
  sendKeys(keysPressed)
});

document.addEventListener("keyup", (e) => {
  if (ChatIsOpen) return;
  keysPressed.delete(e.key);
  sendKeys(keysPressed)
});

// document.addEventListener("wheel", (e) => {
//   // console.log(e);
//   if (e.deltaY < 0) scaleScreen((++s) / 100)
//   else scaleScreen((--s) / 100)

// })


// scaleScreen(s/100)
