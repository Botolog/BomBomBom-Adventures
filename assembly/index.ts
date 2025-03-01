import {
  Canvas,
  Vector2,
  Camera,
  Entity,
  EntityManager,
  Flags,
  Ctx
} from "./utils";

export const width: number = 1400;
export const height: number = 600;

export const INTERVAL: number = 20;
export let DRAW_HITBOXES: boolean = true;

export let CameraPosition: Vector2 = new Vector2(0, 0);

export let CTX: Ctx = new Ctx(height, width);
export let CANVAS: Canvas = new Canvas(CTX);
export let ENTITY_MANAGER: EntityManager = new EntityManager();
export let CAMERA: Camera = new Camera();
CAMERA.coordinates.set(CameraPosition);

export let GROUND: Entity = new Entity();
GROUND.body.width = CTX.width - 5;
GROUND.body.height = 2;
GROUND.body.coordinates.set(new Vector2(5, 5));







export function genFrame(): void {
  CANVAS.render();

}

export function gameTick(): void {
  ENTITY_MANAGER.update();
}


export function getCtx(): Uint8Array {
  return CTX.buffer;
}

export function moveCam(x: number, y: number): void {
  CAMERA.move(new Vector2(x, y));
}
