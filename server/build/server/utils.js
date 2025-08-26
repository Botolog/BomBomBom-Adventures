import { DC, KEY as KEY, Vector2 } from "../shared/defs.js";
export const Zvec = new Vector2();
export class Properties {
    constructor() {
        this.hp = 100;
        this.speedK = 1;
        this.jumpK = 7;
        this.meleeDamage = 10;
        this.meleeRange = 50;
        this.specialDamage = 20;
        this.canDoubleJump = false;
        this.canWallJump = false;
        this.dashSpeed = 10;
        this.maxSpeed = 10;
        this.renderDistance = 500;
        this.vecs = new Map([
            [KEY.LEFT, new Vector2(-1, 0)],
            [KEY.RIGHT, new Vector2(1, 0)],
            [KEY.UP, new Vector2(0, 0.02)],
            [KEY.DOWN, new Vector2(0, -0.2)],
        ]);
    }
    getVec(key) {
        let vec = this.vecs.get(key);
        if (vec)
            return vec;
        return Zvec.clone();
    }
    keysToVec(c) {
        const totalV = Zvec.clone();
        c.forEach(byte => {
            totalV.addV(this.getVec(byte));
        });
        return totalV;
    }
    toByte() {
        const bytes = new Uint8Array(1);
        bytes[0] = this.hp;
        return Buffer.from(bytes.buffer);
    }
}
export function addCode(code, data) {
    const buff = data;
    const newBuff = new ArrayBuffer(buff.byteLength + 1);
    const newView = new Uint8Array(newBuff);
    newView[0] = code; // Set the new first byte
    newView.set(new Uint8Array(buff), 1);
    return newBuff;
}
export class Conn {
    constructor(CM, ws, uid = "=") {
        this.uid = "=";
        this.commands = Array.from({ length: 256 }, () => () => { });
        this.manager = CM;
        this.ws = ws;
        if (uid !== "=") {
            this.uid = uid;
        }
        else {
            // throw new Error("No id in player");
            // ws.once("message", msg => {
            //     this.uid = msg;
            //     console.log(`UID is now ${this.uid}`)
            // })
        }
        ws.once("close", (e) => {
            console.error("diconnected");
            this.destroy();
        });
        this.manager.addConn(this);
        this.initCommand(DC.SET_UID, (c) => { this.uid = String.fromCharCode(...c); });
        // this.initCommand(DC.DEBUG, (c) => {console.warn("DEBUG: ", c);})
        this.ws.on("message", async (bytes) => {
            // const msg = bytes.readFloatLE(0)
            const msg = bytes;
            const code = msg[0];
            const content = msg.slice(1);
            // console.log(msg)
            this.commands[code](content);
        });
    }
    initCommand(Rcode, command) {
        this.commands[Rcode] = command;
    }
    sendData(code, data) {
        this.ws.send(addCode(code, data));
    }
    destroy() {
        let index = this.manager.connections.indexOf(this);
        this.manager.connections.splice(index, 1);
    }
}
export class ConnManager {
    constructor() {
        this.connections = [];
    }
    addConn(conn) {
        this.connections.push(conn);
    }
}
// export async function createConn(CM: any, ws: any, initialUid: string = "="): Promise<Conn> {
//     let resolvedUid: string;
//     if (initialUid !== "=") {
//         resolvedUid = initialUid;
//     } else {
//         console.log("Waiting for UID message from client...");
//         // Use a Promise to wait for the "message" event to fire just once.
//         resolvedUid = await new Promise<string>((resolve, reject) => {
//             ws.once("message", msg => {
//                 // Assuming the message is the UID string itself.
//                 resolve(msg.toString());
//             });
//             // Optional: You might want to handle an error or timeout here.
//             ws.once("close", () => {
//                 reject(new Error("Connection closed before UID was received."));
//             });
//         });
//         console.log(`UID received: ${resolvedUid}`);
//     }
//     // Now that the UID is resolved, we can safely create the new instance.
//     const newConn = new Conn(CM, ws, resolvedUid);
//     return newConn;
// }
