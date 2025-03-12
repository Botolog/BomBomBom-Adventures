import {
    // ENTITY_MANAGER,
    DRAW_HITBOXES,
    // CAMERA,
    width,
    height,
} from "./index";

const Width: number = width;
const Height: number = height;

export enum Direction {
    NONE = -1,
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}

export enum Flags {
    ANY = -1,
    GROUND = 0,
    CHARACTER = 1,
    SCRIPT = 2
}

export class Hitbox { x1!: number; y1!: number; x2!: number; y2!: number; }

// export class Properties {
//     speed: object = {
//         up: 0.25,
//         down: 0,
//         right: 1,
//         left: 1,
//     }
// }

function min4(a: number, b: number, c: number, d: number): number {
    return min(min(a, b), min(c, d));
}

export function absMin(a: number, b: number): number {
    if (a == 0) return 0;
    let i = a / abs(a)
    return i * min(abs(a), b)
}


export function absMax(a: number, b: number): number {
    if (a == 0) return b;
    let i = a / abs(a)
    return i * max(abs(a), b)
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
        this.x = abs(this.x);
        this.y = abs(this.y);
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


export var CTX: Ctx = new Ctx(Width, Height);
export var CANVAS: Canvas = new Canvas(CTX);


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

export class Body {
    width: number;
    height: number;
    coordinates: Vector2;
    velocity: Vector2;
    gravity: Vector2;
    drag: Vector2;
    friction: Vector2 = new Vector2(1, 1);
    staticObj: bool = false;
    hasHitbox: bool = true;
    manager: BodyManager;
    flags: Flags[] = [];
    toRender: bool = true;
    speedLim: number = 20;
    scripts: ((T:Body)=>void)[] = [];

    constructor(manager: BodyManager, width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
        this.coordinates = new Vector2();
        this.velocity = new Vector2();
        this.gravity = new Vector2();
        this.drag = new Vector2(0.5, 0.9);
        this.manager = manager;
        this.manager.addBody(this);
        
    }

    hitbox(): Hitbox {
        return {
            x1: this.coordinates.x,
            y1: this.coordinates.y,
            x2: this.coordinates.x + this.width,
            y2: this.coordinates.y + this.height
        };
    }

    center(): Vector2 {
        let h = this.hitbox();
        return new Vector2((h.x1+h.x2)/2, (h.y1+h.y2)/2);
    }


    collide(another: Body): bool {
        if (!this.hasHitbox) return false;
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
        if (!this.hasHitbox) return Direction.NONE;
        const a = this.hitbox();
        const b = another.hitbox();

        // First, check if the hitboxes intersect at all.
        if (a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2) {
            return Direction.NONE;
        }

        // Calculate penetration depths in all directions:
        // How far is 'this' penetrating into 'another' from each side?
        const penetrationLeft = b.x2 - a.x1; // collision from left
        const penetrationRight = a.x2 - b.x1; // collision from right
        const penetrationTop = b.y2 - a.y1; // collision from top
        const penetrationBottom = a.y2 - b.y1; // collision from bottom

        // Determine which penetration is the smallest.
        // That will be the primary collision direction.
        const minPenetration = min4(
            penetrationLeft,
            penetrationRight,
            penetrationTop,
            penetrationBottom
        );

        if (minPenetration === penetrationLeft) {
            return Direction.LEFT;
        } else if (minPenetration === penetrationRight) {
            return Direction.RIGHT;
        } else if (minPenetration === penetrationTop) {
            return Direction.DOWN;
        } else {
            return Direction.UP;
        }
    }

    addFlag(flag: Flags): void {
        if (this.flags.includes(flag)) return;
        this.flags.push(flag);
    }

    hasFlag(flag: Flags): bool {
        if (flag == Flags.ANY) return true;
        return this.flags.includes(flag);
    }

    calcFriction(): Vector2 {
        let colds = this.manager.collidesWithSomething(this);
        let mod = new Vector2(1, 1);
        for (let i = 0; i < colds.length; i++) {
            // console.log(colds[i].body.friction.toString());

            mod.multiplyV(colds[i].friction);
        }
        // console.log(mod.toString());

        return mod;
    }

    // jump(): void {
    //     const vj = 3;
    //     const hj = 13;
    //     let colds = this.manager.sidesThatCollides(this, Flags.GROUND);
    //     if (colds.length > 0) {
    //         if (colds.includes(Direction.UP)) return;
    //         if (colds.includes(Direction.RIGHT)) {
    //             this.coordinates.x -= 3;
    //             this.velocity.y = vj;
    //             this.velocity.x = -hj;
    //         }
    //         if (colds.includes(Direction.LEFT)) {
    //             this.coordinates.x += 3;
    //             this.velocity.y = vj;
    //             this.velocity.x = hj;
    //         }
    //         if (colds.includes(Direction.DOWN)) {
    //             this.coordinates.y += 3;
    //             this.velocity.y = 7;
    //         }
    //         // console.log("jumped");
    //     }
    // }

    exeScripts(): void {
        for (let i=0; i<this.scripts.length; i++){
            this.scripts[i](this);
        }
    }

    update(dt: number): void {
        if (this.staticObj) return;


        this.velocity.addV(this.gravity.CmultiplyS(dt));
        this.velocity.multiplyV(this.drag.CmultiplyV(this.calcFriction()));


        // this.velocity.x = absMin(this.velocity.x, this.speedLim)
        // console.log(this.velocity.toString());

        this.coordinates.addV(this.velocity.CmultiplyS(dt).absMin(this.speedLim));

        let colds = this.manager.collidesWithSomething(this, Flags.GROUND)
        for (let i = 0; i < colds.length; i++) {
            const col = colds[i]
            const side = this.sideCollide(col)
            if (side == Direction.DOWN || side == Direction.UP) this.velocity.y *= 0.01;
            if (side == Direction.LEFT || side == Direction.RIGHT) this.velocity.x *= 0.01;
            switch (side) {
                case Direction.UP:
                    this.coordinates.y = col.coordinates.y - this.height
                    break;
                case Direction.DOWN:
                    this.coordinates.y = col.coordinates.y + col.height
                    break;
                case Direction.LEFT:
                    this.coordinates.x = col.coordinates.x + col.width
                    break;
                case Direction.RIGHT:
                    this.coordinates.x = col.coordinates.x - this.width
                    break;

                default:
                    break;
            }
        }
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
            this.manager.scene.camera.canvas.ctx.drawRect(
                this.coordinates.x - offset.x,
                this.coordinates.y - offset.y,
                this.width,
                this.height,
                iColor(255, 0, 0)
            );
        }
    }

    move(vector: Vector2): void {
        this.coordinates.addV(vector);
    }
}

export class Entity {
    // canvas: Canvas;
    body: Body;
    manager: EntityManager;
    // properties: Properties = new Properties();
    flags: Flags[];
    toRender: bool = true;
    staticObj: bool = false;
    scripts: ((T:Entity)=>void)[] = [];
    facingRight: bool;

    constructor(Emanager: EntityManager, Bmanager: BodyManager) {
        // this.canvas = CANVAS;
        this.body = new Body(Bmanager, 0, 0);
        this.manager = Emanager;
        this.flags = [];
        this.manager.addEntity(this);
        this.facingRight = true;
    }

    jump(): void {
        const vj = 3;
        const hj = 13;
        let colds = this.body.manager.sidesThatCollides(this.body, Flags.GROUND);
        if (colds.length > 0) {
            if (colds.includes(Direction.UP)) return;
            if (colds.includes(Direction.RIGHT)) {
                this.body.coordinates.x -= 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = -hj;
                this.facingRight=false;
            }
            if (colds.includes(Direction.LEFT)) {
                this.body.coordinates.x += 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = hj;
                this.facingRight=true;
            }
            if (colds.includes(Direction.DOWN)) {
                this.body.coordinates.y += 3;
                this.body.velocity.y = 7;
            }
            // console.log("jumped");
        }
    }

    exeScripts(): void {
        for (let i=0; i<this.scripts.length; i++){
            this.scripts[i](this);
        }
        
        
    }

    update(dt: number): void {
        if (this.staticObj) return;
        this.exeScripts()
        // this.body.update(dt);
    }

    control(x: number, y: number): void {
        if(abs(x)>0.1) this.facingRight = x>0;
        console.log(this.facingRight.toString())
        if (this.manager.collidesWithSomething(this).length == 0) x *= 0.7
        this.body.velocity.addV(new Vector2(x, y));
        if (y > 0) this.jump();
    }

    addFlag(flag: Flags): void {
        if (this.flags.includes(flag)) return;
        this.flags.push(flag);
    }

    hasFlag(flag: Flags): bool {
        if (flag == Flags.ANY) return true;
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
            this.manager.scene.camera.canvas.ctx.drawRect(
                this.body.coordinates.x - offset.x,
                this.body.coordinates.y - offset.y,
                this.body.width,
                this.body.height,
                iColor(255, 0, 0)
            );
        }
    }
}



export class Camera extends Entity {
    // coordinates: Vector2;
    canvas: Canvas = CANVAS;

    constructor(Emanager: EntityManager, Bmanager: BodyManager) {
        super(Emanager, Bmanager);
        this.body.hasHitbox = false;
        // this.canvas = new Canvas(new Ctx(width, height));
    }

    public move(vector: Vector2): void {
        this.body.coordinates.addV(vector);
    }

    centerCam(target: Vector2): void {
        let center = new Vector2(CTX.width, CTX.height).multiplyS(-0.5)
        let dif = target.CaddV(this.body.center().CmultiplyS(-1))
        dif.addV(center);
        dif.multiplyS(0.2);
        // this.body.center().
        this.body.velocity.set(dif);
        // console.log(dif.toString());
        
    }

    forceCenterCam(target: Vector2): void {
        let center = new Vector2(CTX.width, CTX.height).multiplyS(-0.5)
        this.body.coordinates.set(target.CaddV(center));
    }

    // render(): void {

    // }

    // TODO: make zoom in and out (scaling) (hard)
    
}


export class BodyManager {
    bodies: Body[];
    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.bodies = [];
    }

    addBody(body: Body): void {
        this.bodies.push(body);
    }

    collidesWithSomething(body: Body, flag: Flags = Flags.ANY): Body[] {
        let collidedBodies: Body[] = []
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.bodies.length; i++) {
            if (body !== this.bodies[i] && body.collide(this.bodies[i]) && this.bodies[i].hasFlag(flag)) {
                collidedBodies.push(this.bodies[i]);
            }
        }
        return collidedBodies;
    }

    sidesThatCollides(body: Body, flag: Flags = Flags.ANY): Direction[] {
        let colds = this.collidesWithSomething(body, flag);
        let dirs: Direction[] = [];
        for (let i = 0; i < colds.length; i++) {
            dirs.push(body.sideCollide(colds[i]));
        }
        return dirs;
    }

    update(dt: number): void {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update(dt);
        }
    }

    render(offset: Vector2): void {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].render(offset);
        }
    }
}

export class EntityManager {
    entities: Entity[];
    scene: Scene;

    constructor(scene: Scene) {
        this.entities = [];
        this.scene = scene;
    }

    addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    collidesWithSomething(entity: Entity, flag: Flags = Flags.ANY): Entity[] {
        let collidedEntities: Entity[] = []
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body) && this.entities[i].hasFlag(flag)) {
                collidedEntities.push(this.entities[i]);
            }
        }
        return collidedEntities;
    }

    sidesThatCollides(entitiy: Entity, flag: Flags = Flags.ANY): Direction[] {
        let colds = this.collidesWithSomething(entitiy, flag);
        let dirs: Direction[] = [];
        for (let i = 0; i < colds.length; i++) {
            dirs.push(entitiy.body.sideCollide(colds[i].body));
        }
        return dirs;
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

export class Scene {
    // manager: SceneManager;
    entityManager: EntityManager = new EntityManager(this);
    bodyManager: BodyManager = new BodyManager(this);
    camera: Camera = new Camera(this.entityManager, this.bodyManager);
    ID: i32;
    constructor(ID: i32) {
        this.ID = ID;
        // this.manager = SCENEMANAGER;
        // this.entityManager = new EntityManager(this);
        // this.bodyManager = new BodyManager(this);
        // let cam = new Camera(this.entityManager, this.bodyManager);
        // this.camera = new Camera(this.entityManager, this.bodyManager)
    }

    addEntity(entity: Entity): void {
        entity.manager = this.entityManager;
        this.entityManager.addEntity(entity);
        entity.body.manager = this.bodyManager;
        this.bodyManager.addBody(entity.body);
    }

    newEntity(): Entity {
        return new Entity(this.entityManager, this.bodyManager);
        // this.entityManager.addEntity()
        
    }

    newBody(width:number=0, height:number=0): Body {
        return new Body(this.bodyManager, width, height);
    }

    newObs(x:number, y:number, width:number, height:number): Body {
        let obj = this.newBody(width, height);
        obj.coordinates.x = x; obj.coordinates.y = y;
        obj.staticObj = true;
        obj.friction.set(new Vector2(0.9, 0.88));
        obj.addFlag(Flags.GROUND);
        return obj;
    }

    update(dt: number = 0): void {
        this.entityManager.update(dt);
        this.bodyManager.update(dt);

    }

    render(): void {
        this.camera.canvas.ctx.clear();
        this.entityManager.render(this.camera.body.coordinates);
        this.bodyManager.render(this.camera.body.coordinates);
    }
}

export class SceneManager {
    scenes: Scene[] = [];
    noScene: Scene = new Scene(-1);
    currentScene: Scene = this.noScene;

    constructor() {
        // this.currentScene = this.noScene;
    }

    findScene(ID: i32): Scene {
        for (let i = 0; i < this.scenes.length; i++) {
            if (this.scenes[i].ID == ID)
                return this.scenes[i];
        }
        return this.currentScene;
    }

    addScene(scene: Scene): void {
        this.scenes.push(scene);
    }

    selectScene(ID: i32): Scene {
        this.currentScene = this.findScene(ID)!;
        return this.currentScene;
    }

    update(dt: number): void {
        this.currentScene.update(dt);
    }

    render(): void {
        this.currentScene.render();
    }

}




export var SCENEMANAGER: SceneManager = new SceneManager();