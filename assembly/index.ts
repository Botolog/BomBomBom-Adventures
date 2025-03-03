
import {
  Canvas,
  Vector2,
  Camera,
  Entity,
  EntityManager,
  Flags,
  Ctx
} from "./utils";

export let width: number = 1150;
export let height: number = 450;

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


// export { Vector2.multiply, Flags };

// export let temp:void = Vector2.

export function genFrame(): void {
  CANVAS.render();

}

export function gameTick(): void {
  ENTITY_MANAGER.update();
}


export function getCtx(): Uint8ClampedArray {
  return CTX.bufferRGB;
}

export function moveCam(x: number, y: number): void {
  CAMERA.move(new Vector2(x, y));
}
