import * as E from "./Engine.js";


export class Properties {
    hp: number = 100;
    speedK: number = 1;
    jumpK: number = 1;
    meleeDamage: number = 10;
    meleeRange: number = 50;
    specialDamage: number = 20;
    canDoubleJump: boolean = false;
    canWallJump: boolean = false;
    dashSpeed: number = 10;
    maxSpeed: number = 10;
}

export enum RC {
    SET_UID = 0,
    SET_VEL = 1,
    GET_ENV = 2,
    GET_POS = 3

}

export type messageFunc = (content: Buffer) => void;

export class Conn {
    ws: any;
    uid: string = "=";
    manager: ConnManager;
    commands: messageFunc[] = Array.from({ length: 50 }, () => () => {});
    constructor(CM: ConnManager, ws: any, uid: string = "=") {
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

        ws.once("close", (e: any) => {
            console.error("diconnected");
            this.destroy();
        })

        this.manager.addConn(this)

        this.initCommand(RC.SET_UID, (c: Buffer) => { this.uid = String.fromCharCode(...c); })

        this.ws.on("message", async (bytes: any) => {
            // const msg = bytes.readFloatLE(0)
            const msg = bytes;
            const code = msg[0];
            const content = msg.slice(1);
            console.log(msg)
            this.commands[code](content);
        })
    }

    initCommand(Rcode: RC, command: messageFunc): void {
        this.commands[Rcode] = command;
        console.log(this.commands)
    }

    destroy(): void {
        let index = this.manager.connections.indexOf(this)
        this.manager.connections.splice(index, 1)
    }
}


export class ConnManager {
    connections: Conn[] = [];

    constructor() {

    }

    addConn(conn: Conn) {
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
