import * as E from "./Engine.js";
export class Properties {
    constructor() {
        this.hp = 100;
        this.speedK = 1;
        this.jumpK = 1;
        this.meleeDamage = 10;
        this.meleeRange = 50;
        this.specialDamage = 20;
        this.canDoubleJump = false;
        this.canWallJump = false;
        this.dashSpeed = 10;
        this.maxSpeed = 10;
    }
}
export class Player extends E.Entity {
    constructor(entityManager, bodyManager) {
        super(entityManager, bodyManager);
        this.properties = new Properties();
        this.mAttackB = new E.Body(bodyManager, 0, 0);
        this.mAttackB.staticObj = true;
        // this.mAttackB
    }
    meleeAttack() {
        this.mAttackB.width = this.properties.meleeRange;
        this.mAttackB.coordinates.y = this.body.coordinates.y;
        this.mAttackB.height = this.body.height;
        // let attackHitbox: E.Hitbox = this.body.hitbox()
        if (this.facingRight)
            this.mAttackB.coordinates.x = this.body.coordinates.x + this.body.width;
        else
            this.mAttackB.coordinates.x = this.body.coordinates.x - this.mAttackB.width;
        // E.CTX.drawRect(attackHitbox.x1, attackHitbox.y1, this.properties.meleeRange, this.body.height, E.iColor(200, 200, 0))
    }
}
