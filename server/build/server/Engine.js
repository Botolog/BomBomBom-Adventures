import { width, height, } from "./index.js";
import { Properties, Zvec } from "./utils.js";
import { Vector2, DC, DIR, FLAG, min4, flagsToByte, INFO } from "../shared/defs.js";
const Width = width;
const Height = height;
export class Body {
    constructor(manager, width = 0, height = 0) {
        this.size = new Vector2();
        this.friction = new Vector2(1, 1);
        this.staticObj = false;
        this.hasHitbox = true;
        this.flags = [];
        this.toRender = true;
        this.speedLim = 20;
        this.scripts = [];
        this.currentTickColl = undefined;
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
        if (a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2) {
            return DIR.NONE;
        }
        const penetrationLeft = b.x2 - a.x1;
        const penetrationRight = a.x2 - b.x1;
        const penetrationTop = b.y2 - a.y1;
        const penetrationBottom = a.y2 - b.y1;
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
        let colds = this.manager.collidesWithSomeFlag(this);
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
        this.coordinates.addV(this.velocity.CmultiplyS(dt).absMin(this.speedLim));
        this.currentTickColl = undefined;
        let colds = this.manager.collidesWithSomeFlag(this, FLAG.ANY);
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
    move(vector) {
        this.coordinates.addV(vector);
    }
    distance(another) {
        const dx = Math.max(0, this.coordinates.x - (another.coordinates.x + another.size.x), another.coordinates.x - (this.coordinates.x + this.size.x));
        const dy = Math.max(0, this.coordinates.y - (another.coordinates.y + another.size.y), another.coordinates.y - (this.coordinates.y + this.size.y));
        return Math.hypot(dx, dy);
    }
    inRadiusOf(another, log = false) {
        const dx = (another.coordinates.x + (another.size.x * 0.5)) - (this.coordinates.x + (this.size.x * 0.5));
        const dy = (another.coordinates.y + (another.size.y * 0.5)) - (this.coordinates.y + (this.size.y * 0.5));
        const distanceSquared = dx * dx + dy * dy;
        const radiiSum = this.radius + another.radius;
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
        return Buffer.concat(total, 16 + INFO.FLAGBUFFLEN);
    }
}
export class Entity {
    constructor(Emanager, Bmanager) {
        this.toRender = true;
        this.staticObj = false;
        this.scripts = [];
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
    }
    addFlags(flags) {
        return this.body.addFlags(flags);
    }
    hasFlag(flag) {
        return this.body.hasFlag(flag);
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
        this.body.size.x = 20;
        this.body.size.y = 20;
        this.body.gravity.set(new Vector2(0, -0.25));
        this.body.drag = new Vector2(0.92, 0.99);
        this.body.coordinates.y = 50;
        this.body.speedLim = 10;
        this.body.addFlag(FLAG.PLAYER);
        this.conn = conn;
        this.jumpsLeft = this.properties.additionalJumps;
        this.stillJumps = false;
        conn.ws.once("close", e => {
            this.destroy();
        });
        conn.initCommand(DC.GET_ME, (c) => {
            this.conn.sendData(DC.SET_ME, this.toByte());
        });
        conn.initCommand(DC.SET_KEY, (c) => {
            this.currentControl = this.properties.keysToVec(c);
            this.conn.sendData(DC.DEBUG, this.currentControl.toByte());
        });
        conn.initCommand(DC.GET_ENV, (c) => {
            const withPlayers = c.readUint8(0) > 0;
            const renderDistance = c.readUint16LE(1);
            this.conn.sendData(DC.SET_ENV, this.body.manager.toByte(this, withPlayers, renderDistance));
        });
        conn.initCommand(DC.GET_ENT, (c) => {
            const playersByte = [];
            SCENEMANAGER.players.forEach(player => {
                if (player != this) {
                    playersByte.push(player.toByte());
                }
            });
            if (playersByte.length > 0)
                conn.sendData(DC.SET_ENT, Buffer.concat(playersByte, playersByte.length * playersByte[0].byteLength));
        });
    }
    jump(holdJump = false) {
        const vj = this.properties.jumpK / 2;
        const hj = 9;
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
                return;
            }
            if (colds.includes(DIR.LEFT)) {
                this.body.coordinates.x += 3;
                this.body.velocity.y = vj;
                this.body.velocity.x = hj;
                this.facingRight = true;
                return;
            }
        }
        else if (this.jumpsLeft > 0 && !holdJump) {
            this.body.velocity.y = this.properties.jumpK;
            this.jumpsLeft--;
        }
    }
    control(vec) {
        if (Math.abs(vec.x) > 0.1)
            this.facingRight = vec.x > 0;
        if (this.body.manager.collidesWithSomeFlag(this.body).length == 0) {
            vec.x *= 0.7;
        }
        this.body.velocity.addV(vec);
        if (vec.y > 0) {
            this.jump(this.stillJumps);
            this.stillJumps = true;
        }
        else {
            this.stillJumps = false;
        }
    }
    update(dt) {
        if (this.body.manager.collidesWithSomeFlag(this.body, FLAG.GROUND).length > 0)
            this.jumpsLeft = this.properties.additionalJumps;
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
        return Buffer.concat(total, 16 + INFO.FLAGBUFFLEN + INFO.PROPSBUFFLEN);
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
    collidesWithSomeFlag(body, flag = FLAG.ANY) {
        return this.collidesWithAnything(body).filter(a => a.hasFlag(flag));
    }
    collidesWithAnything(body) {
        if (body.currentTickColl)
            return body.currentTickColl;
        let collidedBodies = [];
        for (let i = 0; i < this.bodies.length; i++) {
            if (body.collide(this.bodies[i]) && body != this.bodies[i]) {
                collidedBodies.push(this.bodies[i]);
            }
        }
        body.currentTickColl = collidedBodies;
        return collidedBodies;
    }
    sidesThatCollides(body, flag = FLAG.ANY) {
        let colds = this.collidesWithSomeFlag(body, flag);
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
                if (withPlayers || !this.bodies[i].hasFlag(FLAG.PLAYER)) {
                    if (this.bodies[i] != me.body) {
                        data.push(this.bodies[i].toByte());
                    }
                }
            }
        }
        return Buffer.concat(data, data.length * (16 + INFO.FLAGBUFFLEN));
    }
}
export const DEBUG = [0, 0];
export class EntityManager {
    constructor(scene) {
        this.entities = [];
        this.scene = scene;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    DEPcollidesWithSomething(entity, flag = FLAG.ANY) {
        const start = process.hrtime();
        let collidedEntities = [];
        for (let i = 0; i < this.entities.length; i++) {
            if (entity !== this.entities[i] && entity.body.collide(this.entities[i].body) && this.entities[i].hasFlag(flag)) {
                collidedEntities.push(this.entities[i]);
            }
        }
        const end = process.hrtime(start);
        DEBUG[0] += 1;
        DEBUG[1] += (end[0] * 1e9 + end[1]) / 1e6;
        return collidedEntities;
    }
    DEPsidesThatCollides(entitiy, flag = FLAG.ANY) {
        let colds = this.DEPcollidesWithSomething(entitiy, flag);
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
        this.entityManager = new EntityManager(this);
        this.bodyManager = new BodyManager(this);
        this.ctxScale = 1;
        this.ID = ID;
    }
    addEntity(entity) {
        entity.manager = this.entityManager;
        this.entityManager.addEntity(entity);
        entity.body.manager = this.bodyManager;
        this.bodyManager.addBody(entity.body);
    }
    newEntity() {
        return new Entity(this.entityManager, this.bodyManager);
    }
    newBody(width = 0, height = 0) {
        return new Body(this.bodyManager, width, height);
    }
    newObs(x, y, width, height, flags = [FLAG.GROUND]) {
        let obj = this.newBody(width, height);
        obj.coordinates.x = x;
        obj.coordinates.y = y;
        obj.staticObj = true;
        obj.friction.set(new Vector2(0.93, 0.86));
        obj.addFlags(flags);
        return obj;
    }
    update(dt = 0) {
        this.entityManager.update(dt);
    }
}
export class SceneManager {
    constructor() {
        this.scenes = [];
        this.players = [];
        this.noScene = new Scene(-1);
        this.currentScene = this.noScene;
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
        return player;
    }
    addPlayer(player) {
        this.currentScene.addEntity(player);
    }
    selectScene(ID) {
        this.currentScene = this.findScene(ID);
        return this.currentScene;
    }
    update(dt) {
        this.currentScene.update(dt);
    }
}
export var SCENEMANAGER = new SceneManager();
