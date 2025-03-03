import {
    CANVAS,
    ENTITY_MANAGER,
    DRAW_HITBOXES,
    CAMERA,
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

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2): void {
        this.x += vector.x;
        this.y += vector.y;
    }

    multiply(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

    Cadd(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    set(vector: Vector2): void {
        this.x = vector.x;
        this.y = vector.y;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
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


export class Ctx {
    width: number;
    height: number;
    bufferRGB: Uint8ClampedArray;
    // buffer: Uint32Array;
    background: Color = new Color(0, 0, 255);


    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        let size: i32 = ((i32)(width * height)) * 4;
        this.bufferRGB = new Uint8ClampedArray(size);
        // this.buffer = new Uint32Array(size);
        this.clear();
    }
    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        let size: i32 = ((i32)(width * height)) * 4;
        this.bufferRGB = new Uint8ClampedArray(size);
        // this.buffer = new Uint32Array(size);
        this.clear();
    }

    setPixel(x: number, y: number, color: Color): void {
        // if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
        let index = ((i32)(y * this.width + x)) * 4;
        this.bufferRGB[index] = color.r;
        this.bufferRGB[index + 1] = color.g;
        this.bufferRGB[index + 2] = color.b;
        this.bufferRGB[index + 3] = color.a;
    }
    fillRect(x: number, y: number, w: number, h: number, color: Color): void {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.setPixel(i, j, color);
            }
        }
    }
    drawRect(x: number, y: number, w: number, h: number, color: Color): void {
        for (let i = x; i < x + w; i++) {
            this.setPixel(i, y, color);
            this.setPixel(i, y + h - 1, color);
        }
        for (let j = y; j < y + h; j++) {
            this.setPixel(x, j, color);
            this.setPixel(x + w - 1, j, color);
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
    render(): Uint8ClampedArray {
        return this.bufferRGB;
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

    update(): void {
        ENTITY_MANAGER.update();
    }

    render(offset: Vector2 | null = null): void {
        this.ctx.clear();

        if (offset === null) {
            offset = CAMERA.coordinates;
        }
        ENTITY_MANAGER.render(offset);
    }
}

export class Camera {
    coordinates: Vector2;

    constructor() {
        this.coordinates = new Vector2();
    }

    public move(vector: Vector2): void {
        this.coordinates.add(vector);
    }
}

export class Body {
    width: number;
    height: number;
    coordinates: Vector2;
    velocity: Vector2;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
        this.coordinates = new Vector2();
        this.velocity = new Vector2();
    }

    hitbox(): Hitbox {
        return {
            x1: this.coordinates.x,
            y1: this.coordinates.y,
            x2: this.coordinates.x + this.width,
            y2: this.coordinates.y + this.height
        };
    }

    collide(another: Body): boolean {
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
        this.coordinates.add(vector);
    }
}

export class Entity {
    canvas: Canvas;
    texture: string;
    body: Body;
    gravity: Vector2;
    drag: number;
    manager: EntityManager;
    flags: i8[];
    public toRender: boolean = true;

    constructor() {
        this.canvas = CANVAS;
        this.texture = "/assets/artDev/temp/herosimus-standing-0.png";
        this.body = new Body();
        this.gravity = new Vector2();
        this.drag = 0.99;
        this.manager = ENTITY_MANAGER;
        this.flags = [];
        ENTITY_MANAGER.addEntity(this);
    }

    public jump(): void {
        if (this.manager.collidesWithSomething(this)) {
            this.body.coordinates.add(new Vector2(0, 1));
            this.body.velocity.add(new Vector2(0, 3));
            console.log("jumped");
        }
    }

    update(): void {
        this.body.velocity.multiply(this.drag);
        this.body.velocity.add(this.gravity);

        // if (this.manager.GROUND?.body.collide(this.body)) {
        //     this.body.velocity.y = 0;
        // }

        this.body.coordinates.add(this.body.velocity);
    }

    render(offset: Vector2): void {
        if (!this.toRender) {
            return;
        }
        let red = new Color(255, 0, 0);
        // this.canvas.ctx.fillRect(
        //     this.body.coordinates.x - offset.x,
        //     this.body.coordinates.y - offset.y,
        //     1,
        //     1,
        //     red
        // );

        if (DRAW_HITBOXES) {
            this.canvas.ctx.fillRect(
                this.body.coordinates.x - offset.x,
                this.body.coordinates.y - offset.y,
                this.body.width,
                this.body.height,
                red
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

    collidesWithSomething(entity: Entity): boolean {
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body)) {
                return true;
            }
        }
        return false;
    }

    update(): void {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
        }
    }

    render(offset: Vector2): void {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(offset);
        }
    }
}

// import { v128, v128_load, v128_store, i32x4_add } from "std/assembly/simd";

export function addArraysSIMD(base: StaticArray<i32>, mask: StaticArray<i32>): StaticArray<i32> {
    assert(base.length == mask.length, "Arrays must have the same length");
    let length = base.length;
    let result = new StaticArray<i32>(length);
    let i = 0;

    // Process 4 elements at a time using SIMD
    for (; i <= length - 4; i += 4) {
        // @ts-ignore
        let baseChunk: v128 = v128_load(base.dataStart + (i << 2));
        // @ts-ignore
        let maskChunk: v128 = v128_load(mask.dataStart + (i << 2));
        // @ts-ignore
        let sumChunk: v128 = i32x4_add(baseChunk, maskChunk);
        // @ts-ignore
        v128_store(result.dataStart + (i << 2), sumChunk);
    }

    // Process any remaining elements
    for (; i < length; i++) {
        unchecked(result[i] = base[i] + mask[i]);
    }

    return result;
}