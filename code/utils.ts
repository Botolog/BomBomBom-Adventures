import {
    CANVAS,
    ENTITY_MANAGER,
    DRAW_HITBOXES,
    CAMERA,
} from "./game";

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



export class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    background: string;

    constructor(element: HTMLCanvasElement) {
        this.canvas = element;
        this.ctx = element.getContext("2d")!;
        if (this.ctx === null) { throw new Error("CanvasRenderingContext2D is null"); }

        this.width = element.width;
        this.height = element.height;
        this.background = "grey";
    }

    update(): void {
        ENTITY_MANAGER.update();
    }

    render(offset: Vector2 | null = null): void {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.width, this.height);

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

    move(vector: Vector2): void {
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

    constructor() {
        this.canvas = CANVAS;
        this.texture = "/assets/artDev/temp/herosimus-standing-0.png";
        this.body = new Body();
        this.gravity = new Vector2();
        this.drag = 0.99;
        this.manager = ENTITY_MANAGER;
        ENTITY_MANAGER.addEntity(this);
    }

    jump(): void {
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
        this.canvas.ctx.fillStyle = "red";
        this.canvas.ctx.fillRect(
            this.body.coordinates.x - offset.x,
            this.body.coordinates.y - offset.y,
            1,
            1
        );

        if (DRAW_HITBOXES) {
            this.canvas.ctx.strokeStyle = "red";
            this.canvas.ctx.strokeRect(
                this.body.coordinates.x - offset.x,
                this.body.coordinates.y - offset.y,
                this.body.width,
                this.body.height
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
        return this.entities.some(another => entity !== another && entity.body.collide(another.body));
    }

    update(): void {
        for (const entity of this.entities) {
            entity.update();
        }
    }

    render(offset: Vector2): void {
        // for (const entity of this.entities) {
        //     entity.render(offset);
        // }
        // simple for loop nstead of forEach
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(offset);
        }
    }
}
