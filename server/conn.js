// Import the WebSocket and WebSocketServer classes from the 'ws' library
import { WebSocket, WebSocketServer } from 'ws';
import { Player, Scene, SCENEMANAGER } from './build/server/Engine.js';
import { ConnManager, Conn } from './build/server/utils.js';
import { KEY, INFO, FLAG, Vector2, DC } from './build/shared/defs.js';

// Define the port for the WebSocket server
const port = INFO.PORT;

// Create a new WebSocket server instance
const wss = new WebSocketServer({ port });

console.log(`WebSocket server started on port ${port}`);

export const CM = new ConnManager()

wss.on('connection', async ws => {


    let conn = new Conn(CM, ws)
    let p = SCENEMANAGER.newPlayer(conn)
    // console.warn(SCENEMANAGER.currentScene.bodyManager.bodies)

    


    const thisLoop = setInterval(() => {
        if (p.conn.ws && p.conn.ws.readyState != 0) {
            // SCENEMANAGER.update(100);
            p.conn.sendData(DC.SET_ME, p.toByte())
            // p.conn.sendData(DC.SET_POS, p.body.coordinates.toByte())
            // p.conn.sendData(DC.SET_ENV, p.body.manager.toByte(p, 7000))
        }
        else {
            console.log("cleared");
            clearInterval(thisLoop);
        }
    }, 10);


});

setInterval(() => {
    if (CM.connections.length != 0) {
        SCENEMANAGER.update(1);
        // let c = SCENEMANAGER.currentScene.bodyManager.bodies
        // console.log(c);

        // SCENEMANAGER.players[0].conn.sendData(4, new Vector2(69.2, -42).toByte())
    }
}, 17);



export function sendData() { }