import {gameTick, getCtx, GROUND, height, moveCam, genFrame, width} from './build/release.js';

let BIGBIGARRAY = getCtx();

// i have array of all of the rgba values of the pixels of the image displayed on the canvas
// i want to display the frame on the canvas

const WIDTH = width.value;
const HEIGHT = height.value;


let canvas = document.getElementById('canvas');
canvas.style.width = WIDTH+"px"; 
canvas.style.height = HEIGHT+"px";

let ctx = canvas.getContext('2d', { willReadFrequently: true });
let imgData = ctx.createImageData(WIDTH, HEIGHT);

function renderFrame(){
    imgData.data.set(getCtx())
    ctx.putImageData(imgData, 0, 0);
}


const timeOfTest = 0.1
let start = Date.now();
let end = start + timeOfTest*1000;
let i = 0;


while(Date.now() < end){
    genFrame();
    gameTick();
    renderFrame();
    
    i++;
}
console.log("max FPS at testing", i/timeOfTest);


setInterval(() => {
    genFrame();
    gameTick();
    renderFrame();
    // console.log('frame rendered');
}, 20);


// listen for keys
document.addEventListener("keydown", (e)=>{
    if (e.key == "ArrowLeft")
        moveCam( -1, 0);
    if (e.key == "ArrowRight")
        moveCam(1, 0);
    if (e.key == "ArrowUp")
        moveCam(0, 1);
    if (e.key == "ArrowDown")
        moveCam(0, -1);
    
})
