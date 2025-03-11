import * as E from "./Engine";


export class Properties {
    hp: number = 100;
    speedK: number = 1;
    jumpK: number = 1;
    meleeDamage: number = 10;
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
}
