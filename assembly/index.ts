export var width: number = 500;
export var height: number = 250;

import {
  Canvas,
  Vector2,
  Camera,
  Entity,
  EntityManager,
  Flags,
  Ctx,
  iColorConv,
  Scene,
  SCENEMANAGER,
  SceneManager,
  CTX
} from "./Engine";
import { Player } from "./utils";
// import { sleep } from 'as-sleep';

export {iColorConv};

// export let width: number = 1000;
// export let height: number = 450;


export const INTERVAL: number = 20;
export let DRAW_HITBOXES: boolean = true;

export let CameraPosition: Vector2 = new Vector2(0, 0);


let lvl0 = new Scene(0)
// lvl0.newEntity();
SCENEMANAGER.addScene(lvl0);
SCENEMANAGER.selectScene(0);


// export let ENTITY_MANAGER: EntityManager = new EntityManager();
// export let CAMERA: Camera = new Camera();
// CAMERA.body.coordinates.set(CameraPosition);

// export let GROUND: Entity = new Entity();
let GROUND = lvl0.newBody()
GROUND.width = width * 10;
GROUND.height = 100;
GROUND.coordinates.set(new Vector2(5, -93));
GROUND.staticObj = true;
GROUND.friction = new Vector2(0.9, 0.88)
GROUND.addFlag(Flags.GROUND);

// let obs: Entity = new Entity();
// obs.body.width = 100;
// obs.body.height = 100;
// obs.body.gravity.set(new Vector2(0, -0.2));
// obs.body.coordinates.set(new Vector2(50, 30));
// obs.body.friction = new Vector2(0.9, 0.88)
// obs.staticObj = true;
// obs.addFlag(Flags.GROUND);

// let obs1: Entity = new Entity();
// obs1.body.width = 100;
// obs1.body.height = 100;
// obs1.body.gravity.set(new Vector2(0, -0.2));
// obs1.body.coordinates.set(new Vector2(150+180, 30));
// obs1.body.friction = new Vector2(0.9, 0.8)
// obs1.staticObj = true;
// obs1.addFlag(Flags.GROUND);

// let obs2: Entity = new Entity();
// obs2.body.width = 100;
// obs2.body.height = 100;
// obs2.body.gravity.set(new Vector2(0, -0.2));
// obs2.body.coordinates.set(new Vector2(150+180+100+180, 0));
// obs2.body.friction = new Vector2(0.9, 0.8)
// obs2.staticObj = true;
// obs2.addFlag(Flags.GROUND);

// export let Me: Entity = new Entity();
// let Me: Entity = SCENEMANAGER.noScene.newEntity();
let Me: Player = new Player(SCENEMANAGER.noScene.entityManager, SCENEMANAGER.noScene.bodyManager);
Me.body.width = 20; 
Me.body.height = 20;
Me.body.gravity.set(new Vector2(0, -0.25));
// Me.body.velocity.y = -10;
Me.body.drag = new Vector2(0.9, 0.99);
Me.body.coordinates.y = 50;
Me.body.speedLim = 10;

lvl0.addEntity(Me);


// Me.body.scripts.push(((T)=>{T.addFlag(Flags.SCRIPT)}))
// export { Vector2.multiply, Flags };

// export let temp:void = Vector2.

lvl0.newObs(100, 100, 100, 100);
lvl0.newObs(300, 100, 100, 100);
lvl0.newObs(500, 100, 100, 100, [Flags.DEATH]).hasHitbox = false;




export function keyInput(inputKeys: string[]): void{
  if (inputKeys.includes("k")) moveCam(-15, 0);
  if (inputKeys.includes(";")) moveCam(15, 0);
  if (inputKeys.includes("o")) moveCam(0, 15);
  if (inputKeys.includes("l")) moveCam(0, -15);
  if (inputKeys.includes("ArrowLeft")) Me.control(-1, 0);
  if (inputKeys.includes("ArrowRight")) Me.control(1, 0);
  if (inputKeys.includes("ArrowUp")) Me.control(0, 0.02);
  if (inputKeys.includes("ArrowDown")) Me.control(0, -0.2);
  // if (inputKeys.includes("a")) Me.control(-1, 0);
  // if (inputKeys.includes("d")) Me.control(1, 0);
  // if (inputKeys.includes("w")) Me.control(0, 0.02);
  // if (inputKeys.includes("s")) Me.control(0, -0.2);
  if (inputKeys.includes(" ")) Me.meleeAttack();
  if (inputKeys.includes("`")) gameTick();
  // if (inputKeys.includes("q")) console.log(

  //   // SCENEMANAGER.currentScene.camera.inView(new Vector2()).toString()
  // );
  // CAMERA.forceCenterCam(Me.body.coordinates)
}

export function genFrame(): void {
  SCENEMANAGER.currentScene.camera.centerCam(Me.body.center());
  SCENEMANAGER.render();

}

// export function Me.control(x:number, y:number): void{
//   // Me.body.coordinates.add(new Vector2(x, y));
//   Me.body.velocity.addV(new Vector2(x, y))
// }

export function gameTick(dt: number=1): void {
  SCENEMANAGER.update(dt);
}

export function scaleScreen(k: number):void{
  // CTX.scale(k);
  SCENEMANAGER.scaleCtx(k);
  SCENEMANAGER.currentScene.camera.forceCenterCam(Me.body.center())
}

export function getCtx(): Uint32Array {
  return SCENEMANAGER.currentScene.camera.canvas.ctx.frame();
}

export function moveCam(x: number, y: number): void {
  SCENEMANAGER.currentScene.camera.move(new Vector2(x, y));
}

// export function sc(): void{
//   console.log(Me.body.sideCollide(obs.body).toString());
// }