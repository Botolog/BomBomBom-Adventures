import { HEROSIMUS } from "./ASSETS.js";
import {
  Canvas,
  Vector2,
  Camera,
  Entity,
  EntityManager,
  flags,
} from "./utils.js";

export var CANVASELEMENT = window.document.getElementById("canvas");

var INTERVAL = 20;
export var DRAW_HITBOXES = true;

export var CANVAS = new Canvas(CANVASELEMENT);
export var ENTITY_MANAGER = new EntityManager();

export var CAMERA = new Camera();
CAMERA.coordinates.set(new Vector2(0, 0));

let GROUND = new Entity();
GROUND.body.width = CANVAS.width;
GROUND.body.height = 2;
GROUND.body.coordinates.set(new Vector2(0, 0));
ENTITY_MANAGER.GROUND = GROUND;
// GROUND.body.hitbox.set(0, 0, CANVAS.width, 20);

CANVAS.render();

let me = new Entity();
// me.gravity = new Velocity(0, 10/INTERVAL/100, 0);
me.body.coordinates.set(new Vector2(100, 6));
me.gravity = new Vector2(0, -0.1);
// me.body.velocity.add(new Vector2(0,-0.1));
me.body.width = 20;
me.body.height = 10;

// me.body.hitbox.set(10, 10, 20, 20);

function mainUpdate() {
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

setInterval(() => {
  mainUpdate();
  CANVAS.update();
  CANVAS.render();
}, INTERVAL);

var KEYS_PRESSED = [];

window.addEventListener("keydown", (event) => {
  KEYS_PRESSED.push(event.key);
  //   console.log(KEYS_PRESSED);
});

window.addEventListener("keyup", (event) => {
  KEYS_PRESSED = KEYS_PRESSED.filter((key) => key !== event.key);
  KEYS_PRESSED = KEYS_PRESSED.filter((key) => key !== event.key);
});

CANVAS.render();
