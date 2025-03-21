import {
  gameTick,
  getCtx,
  height,
  genFrame,
  width,
  iColorConv,
  keyInput,
  scaleScreen,
  // sc
} from "./build/release.js";

import { applyNoise, applyChromaticAberration, applyScanlines } from "./effects.js";


// i have array of all of the rgba values of the pixels of the image displayed on the canvas
// i want to display the frame on the canvas

const WIDTH = width.value;
const HEIGHT = height.value;

let canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const mod = 1.3; 
canvas.style.width = mod*WIDTH + "px";
canvas.style.height = mod*HEIGHT + "px";

let ctx = canvas.getContext("2d", { willReadFrequently: false });
ctx.imageSmoothingEnabled = false;
let imgData = ctx.createImageData(1*WIDTH, 1*HEIGHT);


function gameLoop(timestamp) {
    keyInput(Array.from(keysPressed));
    gameTick(1);
    // console.log(Array.from(keysPressed));
    
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);


function renderFrame() {
  //   iColorConv();
  imgData.data.set(iColorConv());
  // imgData.data.set(applyChromaticAberration(imgData.data));
  // imgData.data.set(applyNoise(imgData.data));
  // imgData.data.set(applyScanlines(imgData.data, WIDTH, HEIGHT));
  
  ctx.putImageData(imgData, 0, 0)
  // for (let i = 0; i < imgData.data.length; i++) {
  //   imgData.data[i] = 50;
  // }
  //   imgData.data.set(getCtx());
  // ctx.putImageData(imgData, 0, 0, 0, 0, );
}

function testFPS(timeOfTest, framesToRender=100) {
  let start = Date.now();
  let end = start + timeOfTest * 1000;
  let i = 0;

  while (Date.now() < end) {
    genFrame();
    renderFrame();

    i++;
  }
  console.log("[1] FPS at testing", i / timeOfTest);

  start = Date.now()
  for (let i=0; i<framesToRender; i++){
    genFrame()
    renderFrame()
  }
  end = Date.now();
  console.log("[2] FPS at testing", Math.round((1000*framesToRender)/(end-start)));

}

// setInterval(sc, 10);
// setTimeout(() => {
//   scaleScreen(0.5)
//   testFPS(1);
  
  setInterval(() => {
    genFrame();
    // gameTick();
    renderFrame();
    // console.log('frame rendered');
  }, 1);
// }, 1000);


// // listen for keys
// document.addEventListener("keydown", (e) => {
//   if (e.key == "`") testFPS(1);
//   if (e.key == "p") {}
// });

const keysPressed = new Set();
let s = 50;
document.addEventListener("keydown", (e) => {
  keysPressed.add(e.key);
  if (e.key == "-") scaleScreen((--s)/100);
  if (e.key == "=") scaleScreen((++s)/100);
});

document.addEventListener("keyup", (e) => {
  keysPressed.delete(e.key);
});

document.addEventListener("wheel", (e)=>{
  // console.log(e);
  if (e.deltaY < 0) scaleScreen((++s)/100)
  else scaleScreen((--s)/100)
  
})

scaleScreen(s/100)
