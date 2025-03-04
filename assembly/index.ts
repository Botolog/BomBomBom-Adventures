
import {
  Canvas,
  Vector2,
  Camera,
  Entity,
  EntityManager,
  Flags,
  Ctx,
  iColorConv
} from "./utils";
// import { sleep } from 'as-sleep';

export {iColorConv};

// export let width: number = 1000;
// export let height: number = 450;

export let width: number = 500;
export let height: number = 200;

export const INTERVAL: number = 20;
export let DRAW_HITBOXES: boolean = true;

export let CameraPosition: Vector2 = new Vector2(0, 0);

export let CTX: Ctx = new Ctx(width, height);
export let CANVAS: Canvas = new Canvas(CTX);
export let ENTITY_MANAGER: EntityManager = new EntityManager();
export let CAMERA: Camera = new Camera();
CAMERA.coordinates.set(CameraPosition);

export let GROUND: Entity = new Entity();
GROUND.body.width = CTX.width * 10;
GROUND.body.height = 100;
GROUND.body.coordinates.set(new Vector2(5, -93));
GROUND.staticObj = true;
GROUND.addFlag(Flags.GROUND);

export let Me: Entity = new Entity();
Me.body.width = 20; 
Me.body.height = 20;
Me.body.gravity.set(new Vector2(0, -0.2));
// Me.body.velocity.y = -10;
Me.body.drag = 0.95; // TODO make vec2
Me.body.coordinates.y = 50;
// export { Vector2.multiply, Flags };

// export let temp:void = Vector2.


export function keyInput(inputKeys: string[]): void{
  if (inputKeys.includes("ArrowLeft")) moveCam(-5, 0);
  if (inputKeys.includes("ArrowRight")) moveCam(5, 0);
  if (inputKeys.includes("ArrowUp")) moveCam(0, 5);
  if (inputKeys.includes("ArrowDown")) moveCam(0, -5);
  if (inputKeys.includes("a")) Me.control(-1, 0);
  if (inputKeys.includes("d")) Me.control(1, 0);
  if (inputKeys.includes("w")) Me.control(0, 0.25);
  if (inputKeys.includes("s")) Me.control(0, -0.25);
  // if (inputKeys.includes(" ")) jump();
  if (inputKeys.includes("q")) gameTick();
}



export function genFrame(): void {
  CANVAS.render();

}

// export function Me.control(x:number, y:number): void{
//   // Me.body.coordinates.add(new Vector2(x, y));
//   Me.body.velocity.addV(new Vector2(x, y))
// }

export function gameTick(dt: number=0): void {
  ENTITY_MANAGER.update(dt);
}


export function getCtx(): Uint32Array {
  return CTX.frame();
}

export function moveCam(x: number, y: number): void {
  CAMERA.move(new Vector2(x, y));
}
