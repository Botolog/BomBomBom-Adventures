import { Player, Scene, SCENEMANAGER } from './build/server/Engine.js';
import { ConnManager, Conn } from './build/server/utils.js';
import { KEY, INFO, FLAG, Vector2 } from './build/shared/defs.js';

import { sendData } from "./conn.js"

const lvl = new Scene(0)
SCENEMANAGER.addScene(lvl); SCENEMANAGER.selectScene(0);

lvl.newObs(5, -25, 1000, 50)
lvl.newObs(500, 0, 10, 200)
lvl.newObs(100, 60, 10, 200)
lvl.newObs(300, 0, 10, 200).staticObj = false

for (let i=0; i<100; i++){
    lvl.newObs(400+(105)+100/i, 25+i, 100, 200)
}


const flor = lvl.newObs(-5, -5, 20, 20)
let x = 0;
setInterval(()=>{
    SCENEMANAGER.currentScene.bodyManager.bodies.forEach(body => {
        
        x += SCENEMANAGER.players[0]?.body.inRadiusOf(body)
        console.log(
            `${x}/${SCENEMANAGER.currentScene.bodyManager.bodies.length}`
        );
    });
}, 500)