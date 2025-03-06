import {
  gameTick,
  getCtx,
  height,
  genFrame,
  width,
  iColorConv,
  keyInput,
  sc
} from "./build/release.js";


// i have array of all of the rgba values of the pixels of the image displayed on the canvas
// i want to display the frame on the canvas

const WIDTH = width.value;
const HEIGHT = height.value;

let canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
// canvas.style.width = 10*WIDTH + "px";
// canvas.style.height = 10*HEIGHT + "px";

let ctx = canvas.getContext("2d", { willReadFrequently: false });
ctx.imageSmoothingEnabled = false;
let imgData = ctx.createImageData(1*WIDTH, 1*HEIGHT);


function gameLoop(timestamp) {
    keyInput(Array.from(keysPressed));
    gameTick(1);
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);


function renderFrame() {
  //   iColorConv();
  imgData.data.set(iColorConv());
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

setInterval(() => {
  genFrame();
  // gameTick();
  renderFrame();
  // console.log('frame rendered');
}, 1);


// // listen for keys
// document.addEventListener("keydown", (e) => {
//   if (e.key == "`") testFPS(1);
//   if (e.key == "p") {}
// });

const keysPressed = new Set();

document.addEventListener("keydown", (e) => {
  keysPressed.add(e.key);
});

document.addEventListener("keyup", (e) => {
  keysPressed.delete(e.key);
});
