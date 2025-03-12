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


class Player extends E.Entity {
    properties: Properties = new Properties();
    constructor(entityManager: E.EntityManager, bodyManager: E.BodyManager) {
        super(entityManager, bodyManager);
    }

    meleeAttack(): void {
        let attackHitbox: E.Hitbox = this.body.hitbox()
        if (this.facingRight) {
            attackHitbox.x1 += this.body.width;
            attackHitbox.x2 += this.properties.meleeRange
        }
        else {
            attackHitbox.x2 -= this.body.width;
            attackHitbox.x1 -= this.properties.meleeRange
        }
        
    }
}
