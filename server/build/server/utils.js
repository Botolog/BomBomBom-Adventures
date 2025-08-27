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
        this.additionalJumps = 1;
        this.canWallJump = true;
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
    newView[0] = code;
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
        }
        ws.once("close", (e) => {
            console.error("diconnected");
            this.destroy();
        });
        this.manager.addConn(this);
        this.initCommand(DC.SET_UID, (c) => { this.uid = String.fromCharCode(...c); });
        this.ws.on("message", async (bytes) => {
            const msg = bytes;
            const code = msg[0];
            const content = msg.slice(1);
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
