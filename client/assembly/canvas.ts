export const WIDTH: i32 = 256;
export const HEIGHT: i32 = 256;
export const buffer = new Uint8Array(WIDTH * HEIGHT * 4); // RGBA buffer

import { width, height } from "./index";

class Color {
    r: u8;
    g: u8;
    b: u8;
    a: u8;
    constructor(r: u8, g: u8, b: u8, a: u8=1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}


// class Canvas {
//     width: i32;
//     height: i32;
//     buffer: Uint8Array;
//     constructor (width: i32, height: i32) {
//         this.width = width;
//         this.height = height;
//         this.buffer = new Uint8Array(width * height * 4);
//     }
//     setPixel(x: i32, y: i32, r: u8, g: u8, b: u8, a: u8): void {
//         if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
//         let index = (y * this.width + x) * 4;
//         this.buffer[index] = r;
//         this.buffer[index + 1] = g;
//         this.buffer[index + 2] = b;
//         this.buffer[index + 3] = a;
//     }
//     fillRect(x: i32, y: i32, w: i32, h: i32, r: u8, g: u8, b: u8, a: u8): void {
//         for (let i = x; i < x + w; i++) {
//             for (let j = y; j < y + h; j++) {
//                 this.setPixel(i, j, r, g, b, a);
//             }
//         }
//     }
//     drawRect(x: i32, y: i32, w: i32, h: i32, r: u8, g: u8, b: u8, a: u8): void {
//         for (let i = x; i < x + w; i++) {
//             this.setPixel(i, y, r, g, b, a);
//             this.setPixel(i, y + h - 1, r, g, b, a);
//         }
//         for (let j = y; j < y + h; j++) {
//             this.setPixel(x, j, r, g, b, a);
//             this.setPixel(x + w - 1, j, r, g, b, a);
//         }
//     }
//     clear(): void {
//         for (let i = 0; i < this.buffer.length; i += 4) {
//             this.buffer[i] = 0;
//             this.buffer[i + 1] = 0;
//             this.buffer[i + 2] = 0;
//             this.buffer[i + 3] = 255;
//         }
//     }
//     render(): Uint8Array {
//         return this.buffer;
//     }

// }

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


    render(offset: Vector2 | null = null): void {
        // this.ctx.clear();

        // if (offset === null) {
        //     offset = CAMERA.body.coordinates;
        // }
        // ENTITY_MANAGER.render(offset);
    }
}

function min4(a: number, b: number, c: number, d: number): number {
    return Math.min(Math.min(a, b), Math.min(c, d));
}

export function absMin(a: number, b: number): number {
    if (a == 0) return 0;
    let i = a / Math.abs(a)
    return i * Math.min(Math.abs(a), b)
}


export function absMax(a: number, b: number): number {
    if (a == 0) return b;
    let i = a / Math.abs(a)
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
}

// export class Color {
//     r: u8;
//     g: u8;
//     b: u8;
//     a: u8;
//     constructor(r: u8, g: u8, b: u8, a: u8 = 255) {
//         this.r = r;
//         this.g = g;
//         this.b = b;
//         this.a = a;
//     }
// }

export function iColor(R: number, G: number, B: number, A: number = 255): number {
    return (R << 24) | (G << 16) | (B << 8) | A;
}

// export function iColorConv(): Uint8Array{
//     const iframe: Uint32Array = CTX.frame();
//     let frame: Uint8Array = new Uint8Array(iframe.length*4);
//     let pixel: number;
//     for (let i=0; i<iframe.length; i+=4){
//         pixel = iframe[i/4];
//         frame[i]     = (i8)(pixel >> 24) & 0xff; // the R value
//         frame[i + 1] = (i8)(pixel >> 16) & 0xff; // the G value
//         frame[i + 2] = (i8)(pixel >> 8) & 0xff; // the B value
//         frame[i + 3] = (i8)(pixel & 0xff); // the A value
//     }
//     return frame;
// }


// export function iColor2Color(color: number): 

export class Ctx {
    width: number;
    height: number;
    scaleK: number = 1;
    buffer: Uint32Array;
    background: number = iColor(50, 50, 100);


    constructor(width: number, height: number) {
        this.width = (width);
        this.height = (height);
        let size: number = (width * height);
        this.buffer = new Uint32Array(size);
        // this.clear();
    }
    resize(width: number, height: number): void {
        this.width = (width);
        this.height = (height);
        let size: number = (width * height);
        this.buffer = new Uint32Array(size);
        this.clear();
    }

    scale(k: number): void {
        this.scaleK = k;

        // this.resize(this.width, this.height);
    }

    // setPixel(x: number, y: number, color: Color): void {
    // if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
    //     let index = ((y * this.width + x)) * 4;
    //     this.bufferRGB[index] = color.r;
    //     this.bufferRGB[index + 1] = color.g;
    //     this.bufferRGB[index + 2] = color.b;
    //     this.bufferRGB[index + 3] = color.a;
    // }

    setiPixel(x: number, y: number, icolor: number): void {
        // x *= this.scaleK; y *= this.scaleK;
        let index = ((y * this.width + x));
        if (index >= this.buffer.length) return;
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
        // if (index < 0 || index >= this.buffer.length) return ;
        this.buffer[index] = icolor;
    }

    fillRect(x: number, y: number, w: number, h: number, color: number): void {
        // x = (x); y = (y); w = (w); h = (h)
        x = (x * this.scaleK); y = (y * this.scaleK); w = (w * this.scaleK); h = (h * this.scaleK)
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                // this.setPixel(i, j, color);
                this.setiPixel(i, j, color)
            }
        }
    }
    drawRect(x: number, y: number, w: number, h: number, color: number): void {
        // x = (x); y = (y); w = (w); h = (h)
        x = (x * this.scaleK); y = (y * this.scaleK); w = (w * this.scaleK); h = (h * this.scaleK)
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
        this.fillRect(0, 0, this.width / this.scaleK, this.height / this.scaleK, this.background)
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



export var CTX: Ctx = new Ctx(width, height);
export var CANVAS: Canvas = new Canvas(CTX);


export function iColorConv(): void {
    const iframe: Uint32Array = CTX.frame();
    const frameLength: number = iframe.length * Uint32Array.BYTES_PER_ELEMENT;
    const frameBuffer: ArrayBuffer = new ArrayBuffer(frameLength);
    // const frame: Uint8ClampedArray = Uint8ClampedArray.wrap(frameBuffer);
    // memory.copy(
    //     changetype<usize>(frame.buffer),
    //     changetype<usize>(iframe.buffer),
    //     frameLength
    // );
    // return frame;
}