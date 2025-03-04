import {
    CANVAS,
    ENTITY_MANAGER,
    DRAW_HITBOXES,
    CAMERA,
    CTX,
} from "./index";

export enum Direction {
    NONE = -1,
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}

export enum Flags {
    NONE = -1,
    GROUND = 0,
    CHARACTER = 1
}

class Hitbox { x1!: number; y1!: number; x2!: number; y2!: number; }

export class Properties {
    speed: object = {
        up: 0.25,
        down: 0,
        right: 1,
        left: 1,
    }    
}


export function absMin(a:number, b:number):number{
    if (a == 0) return 0;
    let i = a/abs(a)
    return i*min(abs(a), b)
}


export function absMax(a:number, b:number):number{
    if (a == 0) return b;
    let i = a/abs(a)
    return i*max(abs(a), b)
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

    CaddV(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
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
}

export class Color {
    r: u8;
    g: u8;
    b: u8;
    a: u8;
    constructor(r: u8, g: u8, b: u8, a: u8 = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

export function iColor(R: i32, G: i32, B: i32, A: i32 = 255): i32 {
    return (R << 24) | (G << 16) | (B << 8) | A;
}

// export function iColorConv(): Uint8Array{
//     const iframe: Uint32Array = CTX.frame();
//     let frame: Uint8Array = new Uint8Array(iframe.length*4);
//     let pixel: i32;
//     for (let i=0; i<iframe.length; i+=4){
//         pixel = iframe[i/4];
//         frame[i]     = (i8)(pixel >> 24) & 0xff; // the R value
//         frame[i + 1] = (i8)(pixel >> 16) & 0xff; // the G value
//         frame[i + 2] = (i8)(pixel >> 8) & 0xff; // the B value
//         frame[i + 3] = (i8)(pixel & 0xff); // the A value
//     }
//     return frame;
// }

export function iColorConv(): Uint8ClampedArray {
    const iframe: Uint32Array = CTX.frame();
    const frameLength: i32 = iframe.length * Uint32Array.BYTES_PER_ELEMENT;
    const frameBuffer: ArrayBuffer = new ArrayBuffer(frameLength);
    const frame: Uint8ClampedArray = Uint8ClampedArray.wrap(frameBuffer);
    memory.copy(
        changetype<usize>(frame.buffer),
        changetype<usize>(iframe.buffer),
        frameLength
    );
    return frame;
}

// export function iColor2Color(color: i32): 

export class Ctx {
    width: number;
    height: number;
    buffer: Uint32Array;
    background: i32 = iColor(50, 50, 100);


    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        let size: i32 = (i32)(width * height);
        this.buffer = new Uint32Array(size);
        // this.clear();
    }
    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        let size: i32 = (i32)(width * height);
        this.buffer = new Uint32Array(size);
        this.clear();
    }

    // setPixel(x: number, y: number, color: Color): void {
    // if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
    //     let index = ((i32)(y * this.width + x)) * 4;
    //     this.bufferRGB[index] = color.r;
    //     this.bufferRGB[index + 1] = color.g;
    //     this.bufferRGB[index + 2] = color.b;
    //     this.bufferRGB[index + 3] = color.a;
    // }

    setiPixel(x: number, y: number, icolor: i32): void {
        let index = (i32)((y * this.width + x));
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
        // if (index < 0 || index >= this.buffer.length) return ;
        this.buffer[index] = icolor;
    }

    fillRect(x: number, y: number, w: number, h: number, color: i32): void {
        x = (i32)(x); y = (i32)(y); w = (i32)(w); h = (i32)(h)
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                // this.setPixel(i, j, color);
                this.setiPixel(i, j, color)
            }
        }
    }
    drawRect(x: number, y: number, w: number, h: number, color: i32): void {
        x = (i32)(x); y = (i32)(y); w = (i32)(w); h = (i32)(h)
        for (let i = x; i < x + w; i++) {
            this.setiPixel(i, y, color);
            this.setiPixel(i, y + h - 1, color);
        }
        for (let j = y; j < y + h; j++) {
            this.setiPixel(x, j, color);
            this.setiPixel(x + w - 1, j, color);
        }
    }
    clear(): void {
        this.fillRect(0, 0, this.width, this.height, this.background)
        // for (let i = 0; i < this.buffer.length; i += 4) {
        //     this.buffer[i] = 0;
        //     this.buffer[i + 1] = 0;
        //     this.buffer[i + 2] = 0;
        //     this.buffer[i + 3] = 255;
        // }
        // this.buffer.fill(0);
    }
    frame(): Uint32Array {
        return this.buffer;
    }


}


export class Camera {
    coordinates: Vector2;

    constructor() {
        this.coordinates = new Vector2();
    }

    public move(vector: Vector2): void {
        this.coordinates.addV(vector);
    }
}

export class Canvas {
    ctx: Ctx;
    width: number;
    height: number;
    background: Color = new Color(0, 0, 255);

    constructor(ctx: Ctx) {
        this.ctx = ctx;
        if (this.ctx === null) { throw new Error("CanvasRenderingContext2D is null"); }

        this.width = ctx.width;
        this.height = ctx.height;
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.ctx.resize(width, height);
    }

    // update(): void {
    //     ENTITY_MANAGER.update();
    // }

    render(offset: Vector2 | null = null): void {
        this.ctx.clear();

        if (offset === null) {
            offset = CAMERA.coordinates;
        }
        ENTITY_MANAGER.render(offset);
    }
}

export class Body {
    width: number;
    height: number;
    coordinates: Vector2;
    velocity: Vector2;
    gravity: Vector2;
    drag: Vector2;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
        this.coordinates = new Vector2();
        this.velocity = new Vector2();
        this.gravity = new Vector2();
        this.drag = new Vector2(0.5, 0.9);
    }

    hitbox(): Hitbox {
        return {
            x1: this.coordinates.x,
            y1: this.coordinates.y,
            x2: this.coordinates.x + this.width,
            y2: this.coordinates.y + this.height
        };
    }

    collide(another: Body): bool {
        const hitbox1 = this.hitbox();
        const hitbox2 = another.hitbox();

        return (
            hitbox1.x1 <= hitbox2.x2 &&
            hitbox1.x2 >= hitbox2.x1 &&
            hitbox1.y1 <= hitbox2.y2 &&
            hitbox1.y2 >= hitbox2.y1
        );
    }

    sideCollide(another: Body): Direction {
        const hitbox1 = this.hitbox();
        const hitbox2 = another.hitbox();

        if (hitbox1.x1 <= hitbox2.x2 && hitbox1.x2 >= hitbox2.x1) {
            if (hitbox1.y1 <= hitbox2.y2 && hitbox1.y2 >= hitbox2.y1) {
                return hitbox1.x1 <= hitbox2.x1 ? Direction.LEFT : Direction.RIGHT;
            }
        }
        if (hitbox1.y1 <= hitbox2.y2 && hitbox1.y2 >= hitbox2.y1) {
            if (hitbox1.x1 <= hitbox2.x2 && hitbox1.x2 >= hitbox2.x1) {
                return hitbox1.y1 <= hitbox2.y1 ? Direction.UP : Direction.DOWN;
            }
        }
        return Direction.NONE;
    }

    move(vector: Vector2): void {
        this.coordinates.addV(vector);
    }
}

export class Entity {
    canvas: Canvas;
    body: Body;
    manager: EntityManager;
    flags: Flags[];
    staticObj: bool = false;
    toRender: bool = true;
    speedLim: number = 10;

    constructor() {
        this.canvas = CANVAS;
        this.body = new Body();
        this.manager = ENTITY_MANAGER;
        this.flags = [];
        ENTITY_MANAGER.addEntity(this);
    }

    jump(): void {
        if (this.manager.collidesWithSomething(this, Flags.GROUND)) {
            this.body.coordinates.y += 5;
            this.body.velocity.y = 7;
            console.log("jumped");
        }
    }

    update(dt: number): void {
        if (this.staticObj) return;
        this.body.velocity.addV(this.body.gravity.CmultiplyS(dt));
        this.body.velocity.multiplyV(this.body.drag);

        let col = this.manager.collidesWithSomething(this, Flags.GROUND)
        if (col !== null) {
            this.body.velocity.y = 0;
            this.body.coordinates.y = col.body.coordinates.y+col.body.height
        }

        this.body.velocity.x = absMin(this.body.velocity.x, this.speedLim)

        this.body.coordinates.addV(this.body.velocity.CmultiplyS(dt));

        // console.log(this.body.coordinates.x.toString() +", "+ this.body.coordinates.y.toString());
        // console.log(this.body.velocity.x.toString() +", "+ this.body.velocity.y.toString());

    }

    control(x:number, y:number): void{
        this.body.velocity.addV(new Vector2(x, y));
        if (y>0) this.jump();
    }

    addFlag(flag: Flags): void{
        if (this.flags.includes(flag)) return ;
        this.flags.push(flag);
    }

    isFlag(flag: Flags): bool{
        return this.flags.includes(flag);
    }

    render(offset: Vector2): void {
        if (!this.toRender) {
            return;
        }
        // this.canvas.ctx.fillRect(
        //     this.body.coordinates.x - offset.x,
        //     this.body.coordinates.y - offset.y,
        //     1,
        //     1,
        //     red
        // );

        if (DRAW_HITBOXES) {
            this.canvas.ctx.drawRect(
                this.body.coordinates.x - offset.x,
                this.body.coordinates.y - offset.y,
                this.body.width,
                this.body.height,
                iColor(255, 0, 0)
            );
        }
    }
}

export class EntityManager {
    entities: Entity[];

    constructor() {
        this.entities = [];
    }

    addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    collidesWithSomething(entity: Entity, flag: Flags = Flags.NONE): Entity|null {
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body) && this.entities[i].isFlag(flag)) {
                return this.entities[i];
            }
        }
        return null;
    }

    update(dt: number): void {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(dt);
        }
    }

    render(offset: Vector2): void {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(offset);
        }
    }
}


// import { v128, v128_load, v128_store, i32x4_add } from "std/assembly/simd";

// export function addArraysSIMD(base: StaticArray<i32>, mask: StaticArray<i32>): StaticArray<i32> {
//     assert(base.length == mask.length, "Arrays must have the same length");
//     let length = base.length;
//     let result = new StaticArray<i32>(length);
//     let i = 0;

//     // Process 4 elements at a time using SIMD
//     for (; i <= length - 4; i += 4) {
//         let baseChunk: v128 = v128_load(base.dataStart + (i << 2));
//         // @ts-ignore
//         let maskChunk: v128 = v128_load(mask.dataStart + (i << 2));
//         // @ts-ignore
//         let sumChunk: v128 = i32x4_add(baseChunk, maskChunk);
//         // @ts-ignore
//         v128_store(result.dataStart + (i << 2), sumChunk);
//     }

//     // Process any remaining elements
//     for (; i < length; i++) {
//         unchecked(result[i] = base[i] + mask[i]);
//     }

//     return result;
// }