import { Player, Scene, SCENEMANAGER, DEBUG } from './build/server/Engine.js';
import { ConnManager, Conn } from './build/server/utils.js';
import { KEY, INFO, FLAG, Vector2 } from './build/shared/defs.js';

import { sendData } from "./conn.js"

const lvl = new Scene(0)
SCENEMANAGER.addScene(lvl); SCENEMANAGER.selectScene(0);

lvl.newObs(5, -25, 1000, 50)
lvl.newObs(500, 0, 10, 200)
lvl.newObs(100, 60, 10, 200)
lvl.newObs(300, 0, 10, 200).staticObj = false

for (let i = 0; i < 100; i++) {
    lvl.newObs(400 + (105) + 100 / i, 25 + i, 100, 200)
}


const flor = lvl.newObs(15, 35, 20, 20)
let x = 0;
// setInterval(()=>{
//     x = 0
//     SCENEMANAGER.currentScene.bodyManager.bodies.forEach(body => {

//         x += SCENEMANAGER.players[0]?.body.inRadiusOf(body)
//     });
//     console.log(`${x}/${SCENEMANAGER.currentScene.bodyManager.bodies.length}`);
// }, 500)


setInterval(() => {
    console.log(

        SCENEMANAGER.players[0]?.jumpsLeft
    );
}, 200)


// setInterval(()=>{
//     console.log((DEBUG[1]/DEBUG[0])*1000);
//     DEBUG[0] = 0; DEBUG[1] = 0;
// }, 1000)
