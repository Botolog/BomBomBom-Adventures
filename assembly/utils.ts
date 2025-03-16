import * as E from "./Engine";


export class Properties {
    hp: number = 100;
    speedK: number = 1;
    jumpK: number = 1;
    meleeDamage: number = 10;
    meleeRange: number = 50;
    specialDamage: number = 20;
    canDoubleJump: boolean = false;
    canWallJump: boolean = false;
    dashSpeed: number = 10;
    maxSpeed: number = 10;
}


export class Player extends E.Entity {
    properties: Properties = new Properties();
    mAttackB: E.Body;
    constructor(entityManager: E.EntityManager, bodyManager: E.BodyManager) {
        super(entityManager, bodyManager);
        this.mAttackB = new E.Body(bodyManager, 0, 0)
        this.mAttackB.staticObj = true;

        // this.mAttackB
    }

    meleeAttack(): void {
        
        this.mAttackB.width = this.properties.meleeRange
        this.mAttackB.coordinates.y = this.body.coordinates.y
        this.mAttackB.height = this.body.height
        // let attackHitbox: E.Hitbox = this.body.hitbox()
        if (this.facingRight)
            this.mAttackB.coordinates.x = this.body.coordinates.x + this.body.width;

        else this.mAttackB.coordinates.x = this.body.coordinates.x - this.mAttackB.width;

        // E.CTX.drawRect(attackHitbox.x1, attackHitbox.y1, this.properties.meleeRange, this.body.height, E.iColor(200, 200, 0))

    }
}
