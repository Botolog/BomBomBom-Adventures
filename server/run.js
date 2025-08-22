import { Player, Scene, SCENEMANAGER } from './build/server/Engine.js';
import { ConnManager, Conn } from './build/server/utils.js';
import { KEY, INFO, FLAG, Vector2 } from './build/shared/defs.js';

import { sendData } from "./conn.js"

const lvl = new Scene(0)
SCENEMANAGER.addScene(lvl); SCENEMANAGER.selectScene(0);

let b = lvl.newObs(5, -25, 1000, 50)