export var width = 500;
export var height = 250;
import { SCENEMANAGER, } from "./Engine.js";
export const INTERVAL = 20;
export let DRAW_HITBOXES = true;
export function gameTick(dt = 1) {
    SCENEMANAGER.update(dt);
}
