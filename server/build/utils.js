export class Properties {
    constructor() {
        this.hp = 100;
        this.speedK = 1;
        this.jumpK = 1;
        this.meleeDamage = 10;
        this.meleeRange = 50;
        this.specialDamage = 20;
        this.canDoubleJump = false;
        this.canWallJump = false;
        this.dashSpeed = 10;
        this.maxSpeed = 10;
    }
}
export var RC;
(function (RC) {
    RC[RC["SET_UID"] = 0] = "SET_UID";
    RC[RC["SET_POS"] = 1] = "SET_POS";
    RC[RC["GET_ENV"] = 2] = "GET_ENV";
})(RC || (RC = {}));
export class Conn {
    constructor(CM, ws, uid = "=") {
        this.uid = "=";
        this.commands = Array.from({ length: 50 }, () => () => { });
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
        this.initCommand(RC.SET_UID, (c) => { this.uid = String.fromCharCode(...c); });
        this.ws.on("message", async (bytes) => {
            // const msg = bytes.readFloatLE(0)
            const msg = bytes;
            const code = msg[0];
            const content = msg.slice(1);
            console.log(msg);
            this.commands[code](content);
        });
    }
    initCommand(Rcode, command) {
        this.commands[Rcode] = command;
        console.log(this.commands);
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
