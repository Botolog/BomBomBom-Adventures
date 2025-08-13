import { 
// ENTITY_MANAGER,
DRAW_HITBOXES, 
// CAMERA,
width, height, } from "./index.js";
const Width = width;
const Height = height;
export var Direction;
(function (Direction) {
    Direction[Direction["NONE"] = -1] = "NONE";
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["UP"] = 2] = "UP";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
export var Flags;
(function (Flags) {
    Flags[Flags["ANY"] = -1] = "ANY";
    Flags[Flags["GROUND"] = 0] = "GROUND";
    Flags[Flags["CHARACTER"] = 1] = "CHARACTER";
    Flags[Flags["DEATH"] = 2] = "DEATH";
    Flags[Flags["FINISH"] = 3] = "FINISH";
})(Flags || (Flags = {}));
export class Hitbox {
}
// export class Properties {
//     speed: object = {
//         up: 0.25,
//         down: 0,
//         right: 1,
//         left: 1,
//     }
// }
function min4(a, b, c, d) {
    return Math.min(Math.min(a, b), Math.min(c, d));
}
export function absMin(a, b) {
    if (a == 0)
        return 0;
    let i = a / Math.abs(a);
    return i * Math.min(Math.abs(a), b);
}
export function absMax(a, b) {
    if (a == 0)
        return b;
    let i = a / Math.abs(a);
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
export function iColor(R, G, B, A = 255) {
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
    constructor(width, height) {
        this.scaleK = 1;
        this.background = iColor(50, 50, 100);
        this.width = (width);
        this.height = (height);
        let size = (width * height);
        this.buffer = new Uint32Array(size);
        // this.clear();
    }
    resize(width, height) {
        this.width = (width);
        this.height = (height);
        let size = (width * height);
        this.buffer = new Uint32Array(size);
        this.clear();
    }
    scale(k) {
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
    setiPixel(x, y, icolor) {
        // x *= this.scaleK; y *= this.scaleK;
        let index = ((y * this.width + x));
        if (index >= this.buffer.length)
            return;
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return; // Bounds check
        // if (index < 0 || index >= this.buffer.length) return ;
        this.buffer[index] = icolor;
    }
    fillRect(x, y, w, h, color) {
        // x = (x); y = (y); w = (w); h = (h)
        x = (x * this.scaleK);
        y = (y * this.scaleK);
        w = (w * this.scaleK);
        h = (h * this.scaleK);
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                // this.setPixel(i, j, color);
                this.setiPixel(i, j, color);
            }
        }
    }
    drawRect(x, y, w, h, color) {
        // x = (x); y = (y); w = (w); h = (h)
        x = (x * this.scaleK);
        y = (y * this.scaleK);
        w = (w * this.scaleK);
        h = (h * this.scaleK);
        for (let i = x; i < x + w; i++) {
            this.setiPixel(i, y, color);
            this.setiPixel(i, y + h - 1, color);
        }
        for (let j = y; j < y + h; j++) {
            this.setiPixel(x, j, color);
            this.setiPixel(x + w - 1, j, color);
        }
    }
    clear() {
        this.fillRect(0, 0, this.width / this.scaleK, this.height / this.scaleK, this.background);
        // for (let i = 0; i < this.buffer.length; i += 4) {
        //     this.buffer[i] = 0;
        //     this.buffer[i + 1] = 0;
        //     this.buffer[i + 2] = 0;
        //     this.buffer[i + 3] = 255;
        // }
        // this.buffer.fill(0);
    }
    frame() {
        return this.buffer;
    }
}
export class Canvas {
    // background: Color = new Color(0, 0, 255);
    constructor(ctx) {
        this.ctx = ctx;
        if (this.ctx === null) {
            throw new Error("CanvasRenderingContext2D is null");
        }
        this.width = ctx.width;
        this.height = ctx.height;
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.ctx.resize(width, height);
    }
    render(offset = null) {
        // this.ctx.clear();
        // if (offset === null) {
        //     offset = CAMERA.body.coordinates;
        // }
        // ENTITY_MANAGER.render(offset);
    }
}
export var CTX = new Ctx(Width, Height);
export var CANVAS = new Canvas(CTX);
export function iColorConv() {
    const iframe = CTX.frame();
    const frameLength = iframe.length * Uint32Array.BYTES_PER_ELEMENT;
    const frameBuffer = new ArrayBuffer(frameLength);
    // const frame: Uint8ClampedArray = Uint8ClampedArray.wrap(frameBuffer);
    // memory.copy(
    //     changetype<usize>(frame.buffer),
    //     changetype<usize>(iframe.buffer),
    //     frameLength
    // );
    // return frame;
}
export class Body {
    constructor(manager, width = 0, height = 0) {
        this.friction = new Vector2(1, 1);
        this.staticObj = false;
        this.hasHitbox = true;
        this.flags = [];
        this.toRender = true;
        this.speedLim = 20;
        this.scripts = [];
        this.width = width;
        this.height = height;
        this.coordinates = new Vector2();
        this.velocity = new Vector2();
        this.gravity = new Vector2();
        this.drag = new Vector2(0.5, 0.9);
        this.manager = manager;
        this.manager.addBody(this);
    }
    hitbox() {
        return {
            x1: this.coordinates.x,
            y1: this.coordinates.y,
            x2: this.coordinates.x + this.width,
            y2: this.coordinates.y + this.height
        };
    }
    center() {
        let h = this.hitbox();
        return new Vector2((h.x1 + h.x2) / 2, (h.y1 + h.y2) / 2);
    }
    collide(another) {
        if (!this.hasHitbox || !another.hasHitbox)
            return false;
        const hitbox1 = this.hitbox();
        const hitbox2 = another.hitbox();
        return (hitbox1.x1 <= hitbox2.x2 &&
            hitbox1.x2 >= hitbox2.x1 &&
            hitbox1.y1 <= hitbox2.y2 &&
            hitbox1.y2 >= hitbox2.y1);
    }
    sideCollide(another) {
        if (!this.hasHitbox || !another.hasHitbox)
            return Direction.NONE;
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
        const minPenetration = min4(penetrationLeft, penetrationRight, penetrationTop, penetrationBottom);
        if (minPenetration === penetrationLeft) {
            return Direction.LEFT;
        }
        else if (minPenetration === penetrationRight) {
            return Direction.RIGHT;
        }
        else if (minPenetration === penetrationTop) {
            return Direction.DOWN;
        }
        else {
            return Direction.UP;
        }
    }
    addFlag(flag) {
        if (flag in this.flags)
            return;
        this.flags.push(flag);
    }
    addFlags(flags) {
        for (let i = 0; i < flags.length; i++) {
            if (flags[i] in this.flags)
                return;
            this.flags.push(flags[i]);
        }
    }
    hasFlag(flag) {
        if (flag == Flags.ANY)
            return true;
        return flag in this.flags;
    }
    calcFriction() {
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
    exeScripts() {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i](this);
        }
    }
    update(dt) {
        if (this.staticObj)
            return;
        this.velocity.addV(this.gravity.CmultiplyS(dt));
        this.velocity.multiplyV(this.drag.CmultiplyV(this.calcFriction()));
        // this.velocity.x = absMin(this.velocity.x, this.speedLim)
        // console.log(this.velocity.toString());
        this.coordinates.addV(this.velocity.CmultiplyS(dt).absMin(this.speedLim));
        let colds = this.manager.collidesWithSomething(this, Flags.GROUND);
        for (let i = 0; i < colds.length; i++) {
            const col = colds[i];
            const side = this.sideCollide(col);
            if (side == Direction.DOWN || side == Direction.UP)
                this.velocity.y *= 0.01;
            if (side == Direction.LEFT || side == Direction.RIGHT)
                this.velocity.x *= 0.01;
            switch (side) {
                case Direction.UP:
                    this.coordinates.y = col.coordinates.y - this.height;
                    break;
                case Direction.DOWN:
                    this.coordinates.y = col.coordinates.y + col.height;
                    break;
                case Direction.LEFT:
                    this.coordinates.x = col.coordinates.x + col.width;
                    break;
                case Direction.RIGHT:
                    this.coordinates.x = col.coordinates.x - this.width;
                    break;
                default:
                    break;
            }
        }
    }
    // inScreen(): boolean{
    //     let scaleK = this.manager.scene.ctxScale
    //     let cam = this.manager.scene.camera
    //     let s = new Vector2(cam.canvas.width, cam.canvas.height) 
    //     s.multiplyS(scaleK)
    //     let h = this.hitbox()
    //     return !(
    //     // TODO chek if obj in screen to render
    // }
    render(offset) {
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
            this.manager.scene.camera.canvas.ctx.drawRect(this.coordinates.x - offset.x, this.coordinates.y - offset.y, this.width, this.height, iColor(255, 0, 0));
        }
    }
    move(vector) {
        this.coordinates.addV(vector);
    }
}
export class Entity {
    constructor(Emanager, Bmanager) {
        this.toRender = true;
        this.staticObj = false;
        this.scripts = [];
        // this.canvas = CANVAS;
        this.body = new Body(Bmanager, 0, 0);
        this.manager = Emanager;
        this.flags = [];
        this.manager.addEntity(this);
        this.facingRight = true;
    }
    jump() {
        const vj = 3;
        const hj = 13;
        let colds = this.body.manager.sidesThatCollides(this.body, Flags.GROUND);
        if (colds.length > 0) {
            if (Direction.UP in colds)
                return;
            if (Direction.RIGHT in colds) {
                this.body.coordinates.x -= 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = -hj;
                this.facingRight = false;
            }
            if (Direction.LEFT in colds) {
                this.body.coordinates.x += 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = hj;
                this.facingRight = true;
            }
            if (Direction.DOWN in colds) {
                this.body.coordinates.y += 3;
                this.body.velocity.y = 7;
            }
            // console.log("jumped");
        }
    }
    exeScripts() {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i](this);
        }
    }
    update(dt) {
        if (this.staticObj)
            return;
        this.exeScripts();
        // this.body.update(dt);
    }
    control(x, y) {
        if (Math.abs(x) > 0.1)
            this.facingRight = x > 0;
        console.log(this.facingRight.toString());
        if (this.manager.collidesWithSomething(this).length == 0)
            x *= 0.7;
        this.body.velocity.addV(new Vector2(x, y));
        if (y > 0)
            this.jump();
    }
    addFlag(flag) {
        if (flag in this.flags)
            return;
        this.flags.push(flag);
    }
    addFlags(flags) {
        for (let i = 0; i < flags.length; i++) {
            if (flags[i] in this.flags)
                return;
            this.flags.push(flags[i]);
        }
    }
    hasFlag(flag) {
        if (flag == Flags.ANY)
            return true;
        return flag in this.flags;
    }
    render(offset) {
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
            this.manager.scene.camera.canvas.ctx.drawRect(this.body.coordinates.x - offset.x, this.body.coordinates.y - offset.y, this.body.width, this.body.height, iColor(255, 0, 0));
        }
    }
}
export class Camera extends Entity {
    constructor(Emanager, Bmanager) {
        super(Emanager, Bmanager);
        // coordinates: Vector2;
        this.canvas = CANVAS;
        this.body.hasHitbox = false;
        // this.canvas = new Canvas(new Ctx(width, height));
    }
    move(vector) {
        this.body.coordinates.addV(vector);
    }
    centerCam(target) {
        let center = new Vector2(CTX.width, CTX.height).multiplyS(-0.5 / CTX.scaleK);
        let dif = target.CaddV(this.body.center().CmultiplyS(-1));
        dif.addV(center);
        dif.multiplyS(0.2);
        // this.body.center()
        this.body.velocity.set(dif);
        // console.log(dif.toString());
    }
    forceCenterCam(target) {
        let center = new Vector2(CTX.width, CTX.height).multiplyS(-0.5 / CTX.scaleK);
        this.body.coordinates.set(target.CaddV(center));
    }
}
export class BodyManager {
    constructor(scene) {
        this.scene = scene;
        this.bodies = [];
    }
    addBody(body) {
        this.bodies.push(body);
    }
    collidesWithSomething(body, flag = Flags.ANY) {
        let collidedBodies = [];
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.bodies.length; i++) {
            if (body !== this.bodies[i] && body.collide(this.bodies[i]) && this.bodies[i].hasFlag(flag)) {
                collidedBodies.push(this.bodies[i]);
            }
        }
        return collidedBodies;
    }
    sidesThatCollides(body, flag = Flags.ANY) {
        let colds = this.collidesWithSomething(body, flag);
        let dirs = [];
        for (let i = 0; i < colds.length; i++) {
            dirs.push(body.sideCollide(colds[i]));
        }
        return dirs;
    }
    update(dt) {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update(dt);
        }
    }
    render(offset) {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].render(offset);
        }
    }
}
export class EntityManager {
    constructor(scene) {
        this.entities = [];
        this.scene = scene;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    collidesWithSomething(entity, flag = Flags.ANY) {
        let collidedEntities = [];
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body) && this.entities[i].hasFlag(flag)) {
                collidedEntities.push(this.entities[i]);
            }
        }
        return collidedEntities;
    }
    sidesThatCollides(entitiy, flag = Flags.ANY) {
        let colds = this.collidesWithSomething(entitiy, flag);
        let dirs = [];
        for (let i = 0; i < colds.length; i++) {
            dirs.push(entitiy.body.sideCollide(colds[i].body));
        }
        return dirs;
    }
    update(dt) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(dt);
        }
    }
    render(offset) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(offset);
        }
    }
}
export class Scene {
    constructor(ID) {
        // manager: SceneManager;
        this.entityManager = new EntityManager(this);
        this.bodyManager = new BodyManager(this);
        this.camera = new Camera(this.entityManager, this.bodyManager);
        this.ctxScale = 1;
        this.ID = ID;
        // this.manager = SCENEMANAGER;
        // this.entityManager = new EntityManager(this);
        // this.bodyManager = new BodyManager(this);
        // let cam = new Camera(this.entityManager, this.bodyManager);
        // this.camera = new Camera(this.entityManager, this.bodyManager)
    }
    addEntity(entity) {
        entity.manager = this.entityManager;
        this.entityManager.addEntity(entity);
        entity.body.manager = this.bodyManager;
        this.bodyManager.addBody(entity.body);
    }
    newEntity() {
        return new Entity(this.entityManager, this.bodyManager);
        // this.entityManager.addEntity()
    }
    newBody(width = 0, height = 0) {
        return new Body(this.bodyManager, width, height);
    }
    newObs(x, y, width, height, flags = [Flags.GROUND]) {
        let obj = this.newBody(width, height);
        obj.coordinates.x = x;
        obj.coordinates.y = y;
        obj.staticObj = true;
        obj.friction.set(new Vector2(0.9, 0.88));
        obj.addFlags(flags);
        return obj;
    }
    update(dt = 0) {
        this.entityManager.update(dt);
        this.bodyManager.update(dt);
    }
    render() {
        this.camera.canvas.ctx.clear();
        this.entityManager.render(this.camera.body.coordinates);
        this.bodyManager.render(this.camera.body.coordinates);
    }
}
export class SceneManager {
    constructor() {
        this.scenes = [];
        this.noScene = new Scene(-1);
        this.currentScene = this.noScene;
        // this.currentScene = this.noScene;
    }
    findScene(ID) {
        for (let i = 0; i < this.scenes.length; i++) {
            if (this.scenes[i].ID == ID)
                return this.scenes[i];
        }
        return this.currentScene;
    }
    addScene(scene) {
        this.scenes.push(scene);
    }
    selectScene(ID) {
        this.currentScene = this.findScene(ID);
        CTX.scale(this.currentScene.ctxScale);
        return this.currentScene;
    }
    scaleCtx(k) {
        this.currentScene.ctxScale = k;
        CTX.scale(k);
    }
    update(dt) {
        this.currentScene.update(dt);
    }
    render() {
        this.currentScene.render();
    }
}
export var SCENEMANAGER = new SceneManager();
