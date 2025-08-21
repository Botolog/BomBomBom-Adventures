// Import the WebSocket and WebSocketServer classes from the 'ws' library
import { WebSocket, WebSocketServer } from 'ws';
import { Player, SCENEMANAGER } from './build/server/Engine.js';
import { ConnManager, Conn } from './build/server/utils.js';
import { KEY, INFO } from './build/shared/defs.js';

// Define the port for the WebSocket server
const port = INFO.PORT;

// Create a new WebSocket server instance
const wss = new WebSocketServer({ port });

console.log(`WebSocket server started on port ${port}`);

export const CM = new ConnManager()

wss.on('connection', async ws => {


    let conn = new Conn(CM, ws)
    let p = SCENEMANAGER.newPlayer(conn)
    console.warn(SCENEMANAGER.currentScene.entityManager.entities)

    const thisLoop = setInterval(() => {
        if (p.conn.ws && p.conn.ws.readyState != 0) {
            // SCENEMANAGER.update(100);
            p.conn.sendData(KEY.SET_POS, p.body.coordinates.toByte())
        }
        else{
            console.log("cleared");
            clearInterval(thisLoop);
        }
    }, 50);


});

setInterval(() => {
    if (CM.connections.length != 0) {
        SCENEMANAGER.update(1);
        // SCENEMANAGER.players[0].conn.sendData(4, new Vector2(69.2, -42).toByte())
    }
}, 10);


export function sendData() { }