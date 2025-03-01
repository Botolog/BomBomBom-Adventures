import {
    CANVAS,
    ENTITY_MANAGER,
    DRAW_HITBOXES,
    CAMERA,
} from "./main.js";

export let direction = Object.freeze({
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3
});

export let flags = Object.freeze({
    GROUND: 0,
    CHARACTER: 1
});

// export let direction = Object.freeze({

export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    multyply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    Cadd(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}


export class Canvas {
    constructor(element) {
        this.canvas = element;
        this.ctx = element.getContext("2d");
        this.width = element.width;
        this.height = element.height;
        this.background = "grey";
    }

    update() {
        ENTITY_MANAGER.update();
    }

    render(offset=null) {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (offset == null) {
            offset = CAMERA.coordinates;
        }
        ENTITY_MANAGER.render(offset);
    }
}

export class Camera {
    constructor() {
        this.coordinates = new Vector2();
    }

    move(vector) {
        this.coordinates.add(vector);
    }
}




export class Body {
    constructor(width=0, height=0) {
        this.width = width;
        this.height = height;
        this.coordinates = new Vector2();
        this.velocity = new Vector2();
        // this.hitbox = this.coordinates.Cadd(new Vector2(width, height));
    }

    hitbox() {
        return {
            x1: this.coordinates.x,
            y1: this.coordinates.y,
            x2: this.coordinates.x + this.width,
            y2: this.coordinates.y + this.height
        };
    }

    collide(another) {
        const hitbox1 = this.hitbox();
        const hitbox2 = another.hitbox();
        
        return (
            hitbox1.x1 <= hitbox2.x2 &&
            hitbox1.x2 >= hitbox2.x1 &&
            hitbox1.y1 <= hitbox2.y2 &&
            hitbox1.y2 >= hitbox2.y1
        );
    }

    sideCollide(another) {
        const hitbox1 = this.hitbox();
        const hitbox2 = another.hitbox();
        // returns the side of the hitbox that is colliding as enum
        if (hitbox1.x1 <= hitbox2.x2 && hitbox1.x2 >= hitbox2.x1) {
            if (hitbox1.y1 <= hitbox2.y2 && hitbox1.y2 >= hitbox2.y1) {
                if (hitbox1.x1 <= hitbox2.x1) {
                    return direction.LEFT;
                } else {
                    return direction.RIGHT;
                }
            }
        }
        if (hitbox1.y1 <= hitbox2.y2 && hitbox1.y2 >= hitbox2.y1) {
            if (hitbox1.x1 <= hitbox2.x2 && hitbox1.x2 >= hitbox2.x1) {
                if (hitbox1.y1 <= hitbox2.y1) {
                    return direction.UP;
                } else {
                    return direction.DOWN;
                }
            }
        }
    }
    

    move(vector) {
        this.coordinates.add(vector);
    }
}

export class Entity {
    constructor() {
        this.canvas = CANVAS;
        this.texture = "/assets/artDev/temp/herosimus-standing-0.png";
        this.body = new Body();
        this.gravity = new Vector2();
        this.drag = 0.99;
        this.manager = ENTITY_MANAGER;
        ENTITY_MANAGER.addEntity(this);
    }

    jump() {
        if (this.manager.collidesWithSomthing(this)) {
            this.body.coordinates.add(new Vector2(0, 1));
            this.body.velocity.add(new Vector2(0, 3));
            console.log("jumped");
        }
    }

    update() {
        
        this.body.velocity.multyply(this.drag);
        this.body.velocity.add(this.gravity);
        
        
        if (this.manager.GROUND.body.collide(this.body)) {
            // console.log("collided");
            this.body.velocity.y = 0;
            // this.body.coordinates.y = 5;
        }
        //set the position of the entity
        this.body.coordinates.add(this.body.velocity);
        //check for collisions with other entities
    }

    render(offset) {
        //render dot
        this.canvas.ctx.fillStyle = "red";
        this.canvas.ctx.fillRect(this.body.coordinates.x-offset.x, this.body.coordinates.y-offset.y, 1, 1);
        // render the image
        // this.canvas.ctx.drawImage(this.texture, this.body.coordinates.x, this.body.coordinates.y);
        // render the hitbox
        if (DRAW_HITBOXES) {
            this.canvas.ctx.strokeStyle = "red";
            this.canvas.ctx.strokeRect(
                this.body.coordinates.x-offset.x,
                this.body.coordinates.y-offset.y,
                this.body.width,
                this.body.height
            );
        }
    }
}

export class EntityManager {
    constructor() {
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    collidesWithSomthing(entity) {
        for (let another of this.entities) {
            if (entity !== another && entity.body.collide(another.body)) {
                return true;
            }
        }
        return false;
    }

    update() {
        for (let entity of this.entities) {
            entity.update();
        }
    }

    render(offset) {
        for (let entity of this.entities) {
            entity.render(offset);
        }
    }
}