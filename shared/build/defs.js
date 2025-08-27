export var DC;
(function (DC) {
    DC[DC["SET_UID"] = 0] = "SET_UID";
    DC[DC["SET_VEL"] = 1] = "SET_VEL";
    DC[DC["GET_ENV"] = 2] = "GET_ENV";
    DC[DC["GET_ME"] = 3] = "GET_ME";
    DC[DC["SET_ME"] = 4] = "SET_ME";
    DC[DC["SET_KEY"] = 5] = "SET_KEY";
    DC[DC["SET_ENV"] = 6] = "SET_ENV";
    DC[DC["GET_PROP"] = 7] = "GET_PROP";
    DC[DC["SET_PROP"] = 8] = "SET_PROP";
    DC[DC["ADD_MSG"] = 9] = "ADD_MSG";
    DC[DC["NEW_MSG"] = 10] = "NEW_MSG";
    DC[DC["GET_ENT"] = 11] = "GET_ENT";
    DC[DC["SET_ENT"] = 12] = "SET_ENT";
    DC[DC["DEBUG"] = 255] = "DEBUG";
})(DC || (DC = {}));
export var KEY;
(function (KEY) {
    KEY[KEY["UP"] = 0] = "UP";
    KEY[KEY["DOWN"] = 1] = "DOWN";
    KEY[KEY["LEFT"] = 2] = "LEFT";
    KEY[KEY["RIGHT"] = 3] = "RIGHT";
    KEY[KEY["SPRINT"] = 5] = "SPRINT";
})(KEY || (KEY = {}));
export var INFO;
(function (INFO) {
    INFO[INFO["PORT"] = 8765] = "PORT";
    INFO[INFO["FLAGBUFFLEN"] = 4] = "FLAGBUFFLEN";
    INFO[INFO["PROPSBUFFLEN"] = 1] = "PROPSBUFFLEN";
    INFO[INFO["PLAYERBUFFLEN"] = 21] = "PLAYERBUFFLEN";
})(INFO || (INFO = {}));
export var DIR;
(function (DIR) {
    DIR[DIR["NONE"] = -1] = "NONE";
    DIR[DIR["LEFT"] = 0] = "LEFT";
    DIR[DIR["RIGHT"] = 1] = "RIGHT";
    DIR[DIR["UP"] = 2] = "UP";
    DIR[DIR["DOWN"] = 3] = "DOWN";
})(DIR || (DIR = {}));
export var FLAG;
(function (FLAG) {
    FLAG[FLAG["ANY"] = 1] = "ANY";
    FLAG[FLAG["GROUND"] = 2] = "GROUND";
    FLAG[FLAG["PLAYER"] = 3] = "PLAYER";
    FLAG[FLAG["DEATH"] = 4] = "DEATH";
    FLAG[FLAG["FINISH"] = 5] = "FINISH";
})(FLAG || (FLAG = {}));
export class Hitbox {
}
export function min4(a, b, c, d) {
    return Math.min(Math.min(a, b), Math.min(c, d));
}
export function absMin(a, b) {
    if (a == 0)
        return 0;
    const i = a / Math.abs(a);
    return i * Math.min(Math.abs(a), b);
}
export function absMax(a, b) {
    if (a == 0)
        return b;
    const i = a / Math.abs(a);
    return i * Math.max(Math.abs(a), b);
}
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    addV(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    multiplyV(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }
    addS(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }
    multiplyS(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    CmultiplyS(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    CmultiplyV(vector) {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }
    CaddV(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    absMin(lim) {
        return new Vector2(absMin(this.x, lim), absMin(this.y, lim));
    }
    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    toString() {
        return "(" + this.x.toString() + ", " + this.y.toString() + ")";
    }
    toByte() {
        const data = new Float32Array(2);
        data[0] = this.x;
        data[1] = this.y;
        return Buffer.from(data.buffer);
    }
}
export function flagsToByte(flags) {
    const bytes = new Uint8Array(4);
    for (let i = 0; i < Math.min(flags.length, bytes.length); i++) {
        bytes[i] = flags[i];
    }
    return Buffer.from(bytes.buffer);
}
