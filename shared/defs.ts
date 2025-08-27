export enum DC {
    SET_UID = 0,
    SET_VEL = 1,
    GET_ENV = 2,
    GET_ME = 3,
    SET_ME = 4,
    SET_KEY = 5,
    SET_ENV = 6,
    GET_PROP = 7,
    SET_PROP = 8,
    ADD_MSG = 9,
    NEW_MSG = 10,
    GET_ENT = 11,
    SET_ENT = 12,

    DEBUG = 255
}

export enum KEY {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
    SPRINT = 5

}

export enum INFO {
    PORT = 8765,
    FLAGBUFFLEN = 4,
    PROPSBUFFLEN = 1,
    PLAYERBUFFLEN = FLAGBUFFLEN+PROPSBUFFLEN+16,
    
}

export enum DIR {
    NONE = -1,
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}

export enum FLAG {
    ANY = 1,
    GROUND = 2,
    PLAYER = 3,
    DEATH = 4,
    FINISH = 5
}

export class Hitbox { x1!: number; y1!: number; x2!: number; y2!: number; }

export function min4(a: number, b: number, c: number, d: number): number {
    return Math.min(Math.min(a, b), Math.min(c, d));
}

export function absMin(a: number, b: number): number {
    if (a == 0) return 0;
    const i = a / Math.abs(a)
    return i * Math.min(Math.abs(a), b)
}


export function absMax(a: number, b: number): number {
    if (a == 0) return b;
    const i = a / Math.abs(a)
    return i * Math.max(Math.abs(a), b)
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    addV(vector: Vector2): Vector2 {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    multiplyV(vector: Vector2): Vector2 {
        this.x *= vector.x;
        this.y *= vector.y;
        return this
    }

    addS(scalar: number): Vector2 {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    multiplyS(scalar: number): Vector2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    CmultiplyS(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    CmultiplyV(vector: Vector2): Vector2 {
        return new Vector2(this.x * vector.x, this.y * vector.y)
    }

    CaddV(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    abs(): Vector2 {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    absMin(lim: number): Vector2 {
        return new Vector2(absMin(this.x, lim), absMin(this.y, lim));
    }

    set(vector: Vector2): Vector2 {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    toString(): string {
        return "(" + this.x.toString() + ", " + this.y.toString() + ")"
    }

    toByte(): Buffer {
        const data = new Float32Array(2);
        data[0] = this.x; data[1] = this.y;
        return Buffer.from(data.buffer);
    }
}

export function flagsToByte(flags: FLAG[]): Buffer {
    const bytes = new Uint8Array(4);
    for (let i = 0; i < Math.min(flags.length, bytes.length); i++) {
        bytes[i] = flags[i];
    }
    return Buffer.from(bytes.buffer);
}