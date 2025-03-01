const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

export let importObject = {
    CANVASELEMENT: window.document.getElementById("canvas"),

};

let Game = await WebAssembly.instantiateStreaming(
  fetch("./build/release.wasm")
  ,{}
);

var INTERVAL = 20;
window.addEventListener("keydown", (event) => {
  Game.pushKey(event.key);
});

window.addEventListener("keyup", (event) => {
  Game.setKeys(Game.getKeys().filter((key) => key !== event.key));
});

// setInterval(() => {
//   mainUpdate();
//   CANVAS.update();
//   CANVAS.render();
// }, INTERVAL);
