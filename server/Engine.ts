import {
    // ENTITY_MANAGER,
    DRAW_HITBOXES,
    // CAMERA,
    width,
    height,
} from "./index.js";

import { Conn, Properties, Zvec } from "./utils.js";
import { Vector2, DC, Direction, FLAG, Hitbox, min4, absMin, absMax, flagsToByte, INFO } from "../shared/defs.js";

const Width: number = width;
const Height: number = height;


export class Body {
    // width: number;
    // height: number;
    size: Vector2 = new Vector2();
    coordinates: Vector2;
    velocity: Vector2;
    gravity: Vector2;
    drag: Vector2;
    friction: Vector2 = new Vector2(1, 1);
    staticObj: boolean = false;
    hasHitbox: boolean = true;
    manager: BodyManager;
    flags: FLAG[] = [];
    toRender: boolean = true;
    speedLim: number = 20;
    scripts: ((T: Body) => void)[] = [];

    constructor(manager: BodyManager, width: number = 0, height: number = 0) {
        this.size.x = width;
        this.size.y = height;
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
            x2: this.coordinates.x + this.size.x,
            y2: this.coordinates.y + this.size.y
        };
    }

    center(): Vector2 {
        let h = this.hitbox();
        return new Vector2((h.x1 + h.x2) / 2, (h.y1 + h.y2) / 2);
    }


    collide(another: Body): boolean {
        if (!this.hasHitbox || !another.hasHitbox) return false;
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
        if (!this.hasHitbox || !another.hasHitbox) return Direction.NONE;
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

    addFlag(flag: FLAG): void {
        if (flag in this.flags) return;
        this.flags.push(flag);
    }

    addFlags(flags: FLAG[]): void {
        for (let i = 0; i < flags.length; i++) {
            if (flags[i] in this.flags) return;
            this.flags.push(flags[i]);
        }
    }

    hasFlag(flag: FLAG): boolean {
        if (flag == FLAG.ANY) return true;
        return flag in this.flags;
    }

    calcFriction(): Vector2 {
        let colds = this.manager.collidesWithSomething(this);
        let mod = new Vector2(1, 1);
        for (let i = 0; i < colds.length; i++) {
            mod.multiplyV(colds[i].friction);
        }

        return mod;
    }

    exeScripts(): void {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i](this);
        }
    }

    update(dt: number): void {
        if (this.staticObj) return;


        this.velocity.addV(this.gravity.CmultiplyS(dt));
        this.velocity.multiplyV(this.drag.CmultiplyV(this.calcFriction()));


        // this.velocity.x = absMin(this.velocity.x, this.speedLim)

        this.coordinates.addV(this.velocity.CmultiplyS(dt).absMin(this.speedLim));

        let colds = this.manager.collidesWithSomething(this, FLAG.ANY)
        for (let i = 0; i < colds.length; i++) {
            const col = colds[i]
            const side = this.sideCollide(col)
            if (side == Direction.DOWN || side == Direction.UP) this.velocity.y *= 0.01;
            if (side == Direction.LEFT || side == Direction.RIGHT) this.velocity.x *= 0.01;
            switch (side) {
                case Direction.UP:
                    this.coordinates.y = col.coordinates.y - this.size.y
                    break;
                case Direction.DOWN:
                    this.coordinates.y = col.coordinates.y + col.size.y
                    break;
                case Direction.LEFT:
                    this.coordinates.x = col.coordinates.x + col.size.x
                    break;
                case Direction.RIGHT:
                    this.coordinates.x = col.coordinates.x - this.size.x
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

    move(vector: Vector2): void {
        this.coordinates.addV(vector);
    }

    destroy(): void {
        let index = this.manager.bodies.indexOf(this)
        this.manager.bodies.splice(index, 1)
    }

    toByte(): Buffer {
        const pos = this.coordinates.toByte()
        const size = this.size.toByte()
        const flags = flagsToByte(this.flags);
        const total = [flags, pos, size];
        // console.warn(total);
        
        return Buffer.concat(total, 16 + INFO.FLAGBUFFLEN)
    }
}

export class Entity {
    // canvas: Canvas;
    body: Body;
    manager: EntityManager;
    // properties: Properties = new Properties();
    flags: FLAG[];
    toRender: boolean = true;
    staticObj: boolean = false;
    scripts: ((T: Entity) => void)[] = [];
    facingRight: boolean;

    constructor(Emanager: EntityManager, Bmanager: BodyManager) {
        // this.canvas = CANVAS;
        this.body = new Body(Bmanager, 0, 0);
        this.manager = Emanager;
        this.flags = [];
        this.manager.addEntity(this);
        this.facingRight = true;
    }

    exeScripts(): void {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i](this);
        }


    }

    update(dt: number): void {
        if (this.staticObj) return;
        this.exeScripts()
        this.body.update(dt);
    }

    addFlag(flag: FLAG): void {
        return this.body.addFlag(flag);
        // if (flag in this.flags) return;
        // this.flags.push(flag);
    }

    addFlags(flags: FLAG[]): void {
        return this.body.addFlags(flags);
        // for (let i = 0; i < flags.length; i++) {
        //     if (flags[i] in this.flags) return;
        //     this.flags.push(flags[i]);
        // }
    }

    hasFlag(flag: FLAG): boolean {
        return this.body.hasFlag(flag);
        // if (flag == FLAG.ANY) return true;
        // return flag in this.flags;
    }

    destroy(): void {
        this.body.destroy();
        let index = this.manager.entities.indexOf(this);
        this.manager.entities.splice(index, 1);
    }

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
    //             this.body.coordinates.x - offset.x,
    //             this.body.coordinates.y - offset.y,
    //             this.body.width,
    //             this.body.height,
    //             iColor(255, 0, 0)
    //         );
    //     }
    // }
}

export class Player extends Entity {
    properties: Properties = new Properties();
    // mAttackB: Body;
    conn: Conn;

    currentControl: Vector2 = Zvec.clone()

    constructor(conn: Conn, entityManager: EntityManager, bodyManager: BodyManager) {
        super(entityManager, bodyManager);
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
            this.destroy()
        })

        conn.initCommand(DC.SET_VEL, (c) => {
            this.body.coordinates.x = c.readFloatLE(0); this.body.coordinates.y = c.readFloatLE(4);
        })

        conn.initCommand(DC.GET_POS, (c) => {
            this.conn.sendData(DC.SET_POS, this.body.coordinates.toByte())
        })

        conn.initCommand(DC.SET_KEY, (c) => {
            this.currentControl = this.properties.keysToVec(c);
            // add here the controll to current and after read current on tick
            this.conn.sendData(DC.DEBUG, this.currentControl.toByte())
        })
    }

    jump(): void {
        const vj = this.properties.jumpK/2;
        const hj = 13;
        let colds = this.body.manager.sidesThatCollides(this.body, FLAG.ANY);
        console.log(colds)
        if (colds.length > 0) {
            if (Direction.UP in colds) return;
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
                this.body.velocity.y = this.properties.jumpK;
            }
        }
    }

    control(vec: Vector2): void {
        if (Math.abs(vec.x) > 0.1) this.facingRight = vec.x > 0;
        if (this.manager.collidesWithSomething(this).length == 0) vec.x *= 0.7
        this.body.velocity.addV(vec);
        if (vec.y > 0) this.jump();
    }

    update(dt: number): void {
        this.control(this.currentControl.clone());
        super.update(dt);
        
    }

    destroy(): void {
        super.destroy()
        let index = SCENEMANAGER.players.indexOf(this)
        SCENEMANAGER.players.splice(index, 1)
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
    bodies: Body[];
    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.bodies = [];
    }

    addBody(body: Body): void {
        this.bodies.push(body);
    }

    collidesWithSomething(body: Body, flag: FLAG = FLAG.ANY): Body[] {
        let collidedBodies: Body[] = []
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.bodies.length; i++) {
            if (body != this.bodies[i] && this.bodies[i].hasFlag(flag) && body.collide(this.bodies[i])) {
                collidedBodies.push(this.bodies[i]);
            }
        }
        return collidedBodies;
    }

    sidesThatCollides(body: Body, flag: FLAG = FLAG.ANY): Direction[] {
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

    toByte(): Buffer {
        let data: Buffer[] = [];
        for (let i = 0; i < this.bodies.length; i++){
            if (!this.bodies[i].hasFlag(FLAG.PLAYER)){
                data.push(this.bodies[i].toByte())
                
            }
        }
        // console.log(data)
        return Buffer.concat(data, data.length*(16+INFO.FLAGBUFFLEN))
    }

    // render(offset: Vector2): void {
    //     for (let i = 0; i < this.bodies.length; i++) {
    //         this.bodies[i].render(offset);
    //     }
    // }
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

    collidesWithSomething(entity: Entity, flag: FLAG = FLAG.ANY): Entity[] {
        let collidedEntities: Entity[] = []
        // return this.entities.some(another => entity !== another && entity.body.collide(another.body));
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body) && this.entities[i].hasFlag(flag)) {
                collidedEntities.push(this.entities[i]);
            }
        }
        return collidedEntities;
    }

    sidesThatCollides(entitiy: Entity, flag: FLAG = FLAG.ANY): Direction[] {
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

    // render(offset: Vector2): void {
    //     for (let i = 0; i < this.entities.length; i++) {
    //         this.entities[i].render(offset);
    //     }
    // }
}

export class Scene {
    // manager: SceneManager;
    entityManager: EntityManager = new EntityManager(this);
    bodyManager: BodyManager = new BodyManager(this);
    // camera: Camera = new Camera(this.entityManager, this.bodyManager);
    ctxScale: number = 1;
    ID: number;
    constructor(ID: number) {
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

    newBody(width: number = 0, height: number = 0): Body {
        return new Body(this.bodyManager, width, height);
    }

    newObs(x: number, y: number, width: number, height: number, flags: FLAG[] = [FLAG.GROUND]): Body {
        let obj = this.newBody(width, height);
        obj.coordinates.x = x; obj.coordinates.y = y;
        obj.staticObj = true;
        obj.friction.set(new Vector2(0.9, 0.88));
        obj.addFlags(flags);
        return obj;
    }

    update(dt: number = 0): void {
        this.entityManager.update(dt);
        // this.bodyManager.update(dt);

    }

    // render(): void {
    //     this.camera.canvas.ctx.clear();
    //     this.entityManager.render(this.camera.body.coordinates);
    //     this.bodyManager.render(this.camera.body.coordinates);
    // }
}

export class SceneManager {
    scenes: Scene[] = [];
    players: Player[] = [];
    noScene: Scene = new Scene(-1);
    currentScene: Scene = this.noScene;

    constructor() {
        // this.currentScene = this.noScene;
    }

    findScene(ID: number): Scene {
        for (let i = 0; i < this.scenes.length; i++) {
            if (this.scenes[i].ID == ID)
                return this.scenes[i];
        }
        return this.currentScene;
    }

    addScene(scene: Scene): void {
        this.scenes.push(scene);
    }

    newPlayer(conn: Conn): Player {
        let player = new Player(conn, this.currentScene.entityManager, this.currentScene.bodyManager);
        this.players.push(player);
        // this.addPlayer(player);
        return player;
    }

    addPlayer(player: Player): void {
        this.currentScene.addEntity(player);
    }

    selectScene(ID: number): Scene {
        this.currentScene = this.findScene(ID)!;
        // CTX.scale(this.currentScene.ctxScale)
        return this.currentScene;
    }

    // scaleCtx(k: number): void {
    //     this.currentScene.ctxScale = k;
    //     CTX.scale(k);
    // }

    update(dt: number): void {
        this.currentScene.update(dt);
    }

    // render(): void {
    //     this.currentScene.render();
    // }

}




export var SCENEMANAGER: SceneManager = new SceneManager();