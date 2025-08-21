export var DC;
(function (DC) {
    DC[DC["SET_UID"] = 0] = "SET_UID";
    DC[DC["SET_VEL"] = 1] = "SET_VEL";
    DC[DC["GET_ENV"] = 2] = "GET_ENV";
    DC[DC["GET_POS"] = 3] = "GET_POS";
    DC[DC["SET_POS"] = 4] = "SET_POS";
    DC[DC["SET_KEY"] = 5] = "SET_KEY";
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
})(INFO || (INFO = {}));
export var Direction;
(function (Direction) {
    Direction[Direction["NONE"] = -1] = "NONE";
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["UP"] = 2] = "UP";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
export var FLAG;
(function (FLAG) {
    FLAG[FLAG["ANY"] = -1] = "ANY";
    FLAG[FLAG["GROUND"] = 0] = "GROUND";
    FLAG[FLAG["PLAYER"] = 1] = "PLAYER";
    FLAG[FLAG["DEATH"] = 2] = "DEATH";
    FLAG[FLAG["FINISH"] = 3] = "FINISH";
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
