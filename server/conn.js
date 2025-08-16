// Import the WebSocket and WebSocketServer classes from the 'ws' library
import { WebSocket, WebSocketServer } from 'ws';
import { Player, SCENEMANAGER } from './build/Engine.js';
import { ConnManager, Conn } from './build/utils.js';

// Define the port for the WebSocket server
const port = 8765;

// Create a new WebSocket server instance
const wss = new WebSocketServer({ port });

console.log(`WebSocket server started on port ${port}`);

export const CM = new ConnManager()

wss.on('connection', async ws => {

    
    let conn = new Conn(CM, ws)
    SCENEMANAGER.newPlayer(conn)
    
    
});



export function sendData(){}