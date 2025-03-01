// import { HEROSIMUS } from "./ASSETS.js";
import {
  Canvas,
  Vector2,
  Camera,
  Entity,
  EntityManager,
  Flags,
} from "./utils";

// import { importObject } from "./index.js";

// Define types

export declare CANVASELEMENT: HTMLCanvasElement;

const INTERVAL: number = 20;
export let DRAW_HITBOXES: boolean = true;

export let CANVAS: Canvas = new Canvas(CANVASELEMENT);
export let ENTITY_MANAGER: EntityManager = new EntityManager();

export let CAMERA: Camera = new Camera();
CAMERA.coordinates.set(new Vector2(0, 0));

let GROUND: Entity = new Entity();
GROUND.body.width = CANVAS.width;
GROUND.body.height = 2;
GROUND.body.coordinates.set(new Vector2(0, 0));
// ENTITY_MANAGER.GROUND = GROUND;

CANVAS.render();

let me: Entity = new Entity();
me.body.coordinates.set(new Vector2(100, 6));
me.gravity = new Vector2(0, -0.1);
me.body.width = 20;
me.body.height = 10;

function mainUpdate(): void {
  if (KEYS_PRESSED.includes("ArrowUp")) {
    me.jump();
  }
  if (KEYS_PRESSED.includes("ArrowRight")) {
    me.body.coordinates.add(new Vector2(1, 0));
  }
  if (KEYS_PRESSED.includes("ArrowLeft")) {
    me.body.coordinates.add(new Vector2(-1, 0));
  }
}


var KEYS_PRESSED: string[] = [];
function setKeys(keys:string[]):void {
  KEYS_PRESSED = keys;
}
function pushKey(key:string):void {
  KEYS_PRESSED.push(key);
}
function getKeys():string[] {
  return KEYS_PRESSED;
}




CANVAS.render();
