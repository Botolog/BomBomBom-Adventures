import { 
// CAMERA,
width, height, } from "./index.js";
import { Properties, Zvec } from "./utils.js";
import { Vector2, DC, DIR, FLAG, min4, flagsToByte, INFO } from "../shared/defs.js";
const Width = width;
const Height = height;
export class Body {
    constructor(manager, width = 0, height = 0) {
        // width: number;
        // height: number;
        this.size = new Vector2();
        this.friction = new Vector2(1, 1);
        this.staticObj = false;
        this.hasHitbox = true;
        this.flags = [];
        this.toRender = true;
        this.speedLim = 20;
        this.scripts = [];
        this.size.x = width;
        this.size.y = height;
        this.radius = Math.sqrt(width ** 2 + height ** 2);
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
            x2: this.coordinates.x + this.size.x,
            y2: this.coordinates.y + this.size.y
        };
    }
    center() {
        let h = this.hitbox();
        return new Vector2((h.x1 + h.x2) / 2, (h.y1 + h.y2) / 2);
    }
    collide(another) {
        if (!this.inRadiusOf(another))
            return false;
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
            return DIR.NONE;
        const a = this.hitbox();
        const b = another.hitbox();
        // First, check if the hitboxes intersect at all.
        if (a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2) {
            return DIR.NONE;
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
            return DIR.LEFT;
        }
        else if (minPenetration === penetrationRight) {
            return DIR.RIGHT;
        }
        else if (minPenetration === penetrationTop) {
            return DIR.DOWN;
        }
        else {
            return DIR.UP;
        }
    }
    addFlag(flag) {
        if (this.flags.includes(flag))
            return;
        this.flags.push(flag);
    }
    addFlags(flags) {
        for (let i = 0; i < flags.length; i++) {
            if (this.flags.includes(flags[i]))
                return;
            this.flags.push(flags[i]);
        }
    }
    hasFlag(flag) {
        if (flag == FLAG.ANY)
            return true;
        return this.flags.includes(flag);
    }
    calcFriction() {
        let colds = this.manager.collidesWithSomething(this);
        let mod = new Vector2(1, 1);
        for (let i = 0; i < colds.length; i++) {
            mod.multiplyV(colds[i].friction);
        }
        return mod;
    }
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
        this.coordinates.addV(this.velocity.CmultiplyS(dt).absMin(this.speedLim));
        let colds = this.manager.collidesWithSomething(this, FLAG.ANY);
        for (let i = 0; i < colds.length; i++) {
            const col = colds[i];
            const side = this.sideCollide(col);
            if (side == DIR.DOWN || side == DIR.UP)
                this.velocity.y *= 0.01;
            if (side == DIR.LEFT || side == DIR.RIGHT)
                this.velocity.x *= 0.01;
            switch (side) {
                case DIR.UP:
                    this.coordinates.y = col.coordinates.y - this.size.y;
                    break;
                case DIR.DOWN:
                    this.coordinates.y = col.coordinates.y + col.size.y;
                    break;
                case DIR.LEFT:
                    this.coordinates.x = col.coordinates.x + col.size.x;
                    break;
                case DIR.RIGHT:
                    this.coordinates.x = col.coordinates.x - this.size.x;
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
    // render(offset: Vector2): void {
    //     if (!this.toRender) {
    //         return;
    //     }
    //     // this.canvas.ctx.fillRect(
    //     //     this.body.coordinates.x - offset.x,
    //     //     this.body.coordinates.y - offset.y,
    //     //     1,
    //     //     1,
    //     //     red
    //     // );
    //     if (DRAW_HITBOXES) {
    //         this.manager.scene.camera.canvas.ctx.drawRect(
    //             this.coordinates.x - offset.x,
    //             this.coordinates.y - offset.y,
    //             this.size.x,
    //             this.size.y,
    //             iColor(255, 0, 0)
    //         );
    //     }
    // }
    move(vector) {
        this.coordinates.addV(vector);
    }
    distance(another) {
        const dx = Math.max(0, this.coordinates.x - (another.coordinates.x + another.size.x), another.coordinates.x - (this.coordinates.x + this.size.x));
        const dy = Math.max(0, this.coordinates.y - (another.coordinates.y + another.size.y), another.coordinates.y - (this.coordinates.y + this.size.y));
        return Math.hypot(dx, dy);
    }
    inRadiusOf(another, log = false) {
        // Calculate the difference in x and y coordinates.
        const dx = 0.5 * (another.coordinates.x + another.size.x) - 0.5 * (this.coordinates.x + this.size.x);
        const dy = 0.5 * (another.coordinates.y + another.size.y) - 0.5 * (this.coordinates.y + this.size.y);
        // Calculate the squared distance between the circle centers.
        const distanceSquared = dx * dx + dy * dy;
        // Calculate the sum of the radii.
        const radiiSum = this.radius + another.radius;
        // Compare the squared distance with the squared sum of the radii.
        // This is more efficient than calculating the square root of the distance.
        const radiiSumSquared = radiiSum * radiiSum;
        if (log) {
            console.log(dx, dy, distanceSquared, radiiSumSquared);
        }
        return distanceSquared <= radiiSumSquared;
    }
    destroy() {
        let index = this.manager.bodies.indexOf(this);
        this.manager.bodies.splice(index, 1);
    }
    toByte() {
        const pos = this.coordinates.toByte();
        const size = this.size.toByte();
        const flags = flagsToByte(this.flags);
        const total = [flags, pos, size];
        // console.warn(total);
        return Buffer.concat(total, 16 + INFO.FLAGBUFFLEN);
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
    exeScripts() {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i](this);
        }
    }
    update(dt) {
        if (this.staticObj)
            return;
        this.exeScripts();
        this.body.update(dt);
    }
    addFlag(flag) {
        return this.body.addFlag(flag);
        // if (flag in this.flags) return;
        // this.flags.push(flag);
    }
    addFlags(flags) {
        return this.body.addFlags(flags);
        // for (let i = 0; i < flags.length; i++) {
        //     if (flags[i] in this.flags) return;
        //     this.flags.push(flags[i]);
        // }
    }
    hasFlag(flag) {
        return this.body.hasFlag(flag);
        // if (flag == FLAG.ANY) return true;
        // return flag in this.flags;
    }
    destroy() {
        this.body.destroy();
        let index = this.manager.entities.indexOf(this);
        this.manager.entities.splice(index, 1);
    }
}
export class Player extends Entity {
    constructor(conn, entityManager, bodyManager) {
        super(entityManager, bodyManager);
        this.properties = new Properties();
        this.currentControl = Zvec.clone();
        // this.mAttackB = new Body(bodyManager, 0, 0);
        // this.mAttackB.staticObj = true;
        this.body.size.x = 20;
        this.body.size.y = 20;
        this.body.gravity.set(new Vector2(0, -0.25));
        // this.body.velocity.y = -10;
        this.body.drag = new Vector2(0.9, 0.99);
        this.body.coordinates.y = 50;
        this.body.speedLim = 10;
        this.body.addFlag(FLAG.PLAYER);
        this.conn = conn;
        conn.ws.once("close", e => {
            this.destroy();
        });
        // conn.initCommand(DC.SET_VEL, (c) => {
        //     this.body.coordinates.x = c.readFloatLE(0); this.body.coordinates.y = c.readFloatLE(4);
        // })
        conn.initCommand(DC.GET_ME, (c) => {
            this.conn.sendData(DC.SET_ME, this.toByte());
        });
        conn.initCommand(DC.SET_KEY, (c) => {
            this.currentControl = this.properties.keysToVec(c);
            // add here the controll to current and after read current on tick
            this.conn.sendData(DC.DEBUG, this.currentControl.toByte());
        });
        conn.initCommand(DC.GET_ENV, (c) => {
            const withPlayers = c.readUint8(0) > 0;
            const renderDistance = c.readUint16LE(1);
            this.conn.sendData(DC.SET_ENV, this.body.manager.toByte(this, withPlayers, renderDistance));
        });
    }
    jump() {
        const vj = this.properties.jumpK / 2;
        const hj = 13;
        let colds = this.body.manager.sidesThatCollides(this.body, FLAG.ANY);
        if (colds.length > 0) {
            if (colds.includes(DIR.UP)) {
                return;
            }
            if (colds.includes(DIR.DOWN)) {
                this.body.coordinates.y += 3;
                this.body.velocity.y = this.properties.jumpK;
                return;
            }
            if (colds.includes(DIR.RIGHT)) {
                this.body.coordinates.x -= 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = -hj;
                this.facingRight = false;
            }
            if (colds.includes(DIR.LEFT)) {
                this.body.coordinates.x += 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = hj;
                this.facingRight = true;
            }
        }
    }
    control(vec) {
        if (Math.abs(vec.x) > 0.1)
            this.facingRight = vec.x > 0;
        if (this.manager.collidesWithSomething(this).length == 0)
            vec.x *= 0.7;
        this.body.velocity.addV(vec);
        if (vec.y > 0)
            this.jump();
    }
    update(dt) {
        this.control(this.currentControl.clone());
        super.update(dt);
    }
    destroy() {
        super.destroy();
        let index = SCENEMANAGER.players.indexOf(this);
        SCENEMANAGER.players.splice(index, 1);
    }
    toByte() {
        const body = this.body.toByte();
        const props = this.properties.toByte();
        const total = [body, props];
        // console.warn(total);
        return Buffer.concat(total, 16 + INFO.FLAGBUFFLEN + INFO.PROPSBUFFLEN);
    }
}
// export class Camera extends Entity {
//     // coordinates: Vector2;
//     canvas: Canvas = CANVAS;
//     constructor(Emanager: EntityManager, Bmanager: BodyManager) {
//         super(Emanager, Bmanager);
//         this.body.hasHitbox = false;
//         // this.canvas = new Canvas(new Ctx(width, height));
//     }
//     public move(vector: Vector2): void {
//         this.body.coordinates.addV(vector);
//     }
//     centerCam(target: Vector2): void {
//         let center = new Vector2(CTX.width, CTX.height).multiplyS(-0.5 / CTX.scaleK)
//         let dif = target.CaddV(this.body.center().CmultiplyS(-1))
//         dif.addV(center);
//         dif.multiplyS(0.2);
//         // this.body.center()
//         this.body.velocity.set(dif);
//         // console.log(dif.toString());
//     }
//     forceCenterCam(target: Vector2): void {
//         let center = new Vector2(CTX.width, CTX.height).multiplyS(-0.5 / CTX.scaleK)
//         this.body.coordinates.set(target.CaddV(center));
//     }
//     // inView(p: Vector2): boolean {
//     //     // TODO finish the func to che if point in view
//     //     // new Hitbox{
//     //     //     x1
//     //     // }
//     // }
//     // render(): void {
//     // }
// }
export class BodyManager {
    constructor(scene) {
        this.scene = scene;
        this.bodies = [];
    }
    addBody(body) {
        this.bodies.push(body);
    }
    collidesWithSomething(body, flag = FLAG.ANY) {
        let collidedBodies = [];
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.bodies.length; i++) {
            if (body != this.bodies[i] && this.bodies[i].hasFlag(flag) && body.collide(this.bodies[i])) {
                collidedBodies.push(this.bodies[i]);
            }
        }
        return collidedBodies;
    }
    sidesThatCollides(body, flag = FLAG.ANY) {
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
    toByte(me, withPlayers, renderDistance) {
        let data = [];
        for (let i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i].distance(me.body) < renderDistance) {
                // console.log(this.bodies[i].hasFlag(FLAG.PLAYER), this.bodies[i]);
                if (withPlayers || !this.bodies[i].hasFlag(FLAG.PLAYER)) {
                    if (this.bodies[i] != me.body) {
                        data.push(this.bodies[i].toByte());
                    }
                }
            }
        }
        // console.log(data)
        return Buffer.concat(data, data.length * (16 + INFO.FLAGBUFFLEN));
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
    collidesWithSomething(entity, flag = FLAG.ANY) {
        let collidedEntities = [];
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body) && this.entities[i].hasFlag(flag)) {
                collidedEntities.push(this.entities[i]);
            }
        }
        return collidedEntities;
    }
    sidesThatCollides(entitiy, flag = FLAG.ANY) {
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
}
export class Scene {
    constructor(ID) {
        // manager: SceneManager;
        this.entityManager = new EntityManager(this);
        this.bodyManager = new BodyManager(this);
        // camera: Camera = new Camera(this.entityManager, this.bodyManager);
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
    newObs(x, y, width, height, flags = [FLAG.GROUND]) {
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
        // this.bodyManager.update(dt);
    }
}
export class SceneManager {
    constructor() {
        this.scenes = [];
        this.players = [];
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
    newPlayer(conn) {
        let player = new Player(conn, this.currentScene.entityManager, this.currentScene.bodyManager);
        this.players.push(player);
        // this.addPlayer(player);
        return player;
    }
    addPlayer(player) {
        this.currentScene.addEntity(player);
    }
    selectScene(ID) {
        this.currentScene = this.findScene(ID);
        // CTX.scale(this.currentScene.ctxScale)
        return this.currentScene;
    }
    // scaleCtx(k: number): void {
    //     this.currentScene.ctxScale = k;
    //     CTX.scale(k);
    // }
    update(dt) {
        this.currentScene.update(dt);
    }
}
export var SCENEMANAGER = new SceneManager();
