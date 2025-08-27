import { DC, KEY, INFO } from "../shared/build/defs.js"
import { socket, ME, connectWebSocket, renderDistance } from "./index.js";

export const wsUrl = `wss://server3bom.botolog.xyz`;
// export const wsUrl = `wss://10.0.0.13:${INFO.PORT}`;
export let reconnectInterval = 3000; // 3 seconds


export let canvas = document.getElementById("canvas");
export const ctx = canvas.getContext('2d');
export const Screen = [1000, 450]
canvas.width = Screen[0];
canvas.height = Screen[1];

export class Box {
    constructor(x1, y1, x2, y2, flags) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.flags = flags;
    }
}

// TODO:
export class Me {
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    hp = 100;
    flags = []

    constructor(data=undefined){
        if (data){
            this.fromByte(data);
        }
    }

    fromByte(data) {
        const buffer = data;


        const flags = new Uint8Array(buffer, 0, INFO.FLAGBUFFLEN);
        const dots = new Float32Array(buffer, INFO.FLAGBUFFLEN, 4);
        const props = new Uint8Array(buffer, INFO.FLAGBUFFLEN + 16, INFO.PROPSBUFFLEN);
        this.x1 = dots[0]; this.y1 = dots[1]; this.x2 = dots[2]; this.y2 = dots[3]; this.hp = props[0];
        this.flags = flags
    }

    toRender() {
        const r = new Render()
        r.x1=this.x1;
        r.y1=this.y1;
        r.x2=this.x2;
        r.y2=this.y2;
        r.color = "#ff2222ff"
        // TORENDER.push(r)
        return r;
    }
}

export class Render {
    type = "box";
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    color = "#FFFFFFFF"
    size = 2;
}

export let TORENDER = []

export function sendDataToServer(data) {
    if (socket && socket.readyState === 1) { // WebSocket.OPEN = 1
        socket.send(data)
        // console.log(data)
    } else {
        console.log('Socket not open, message not sent.');
    }
}

export function str2uint(data) {
    const buff = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        buff[i] = data.charCodeAt(i);
    }
    return buff;
}

export function vecFromBuff(data) {
    const vec = new Float32Array(2);
    vec[0] = data.readFloatLE(0);
    vec[1] = data.readFloatLE(4);

    return vec;
}

export function boxFromBuff(data) {
    const buffer = data.buffer;
    const byteOffset = data.byteOffset;

    const flags = new Uint8Array(buffer, byteOffset, INFO.FLAGBUFFLEN);
    const dots = new Float32Array(buffer, byteOffset + INFO.FLAGBUFFLEN, 4);
    const render = new Render()
    render.x1 = dots[0]; render.y1 = dots[1]; render.x2 = dots[2]; render.y2 = dots[3];
    render.color = "#FF0000FF"
    return render;
}

const bytesPerBox = (INFO.FLAGBUFFLEN + 16)
export function boxsFromBuff(data) {
    // console.log(data);/
    const fullView = new Uint8Array(data);
    let boxs = [];
    TORENDER = []
    for (let i = 0; i < data.byteLength / bytesPerBox; i++) {
        const currentByteOffset = i * bytesPerBox;
        const currentBoxData = fullView.subarray(currentByteOffset, currentByteOffset + bytesPerBox);
        const box = boxFromBuff(currentBoxData);
        // boxs.push(box);
        TORENDER.push(box);
    }
    // console.log(data.length / bytesPerBox)
    return boxs;
}

export function addCode(code, data) {
    const buff = data.buffer

    const newBuff = new ArrayBuffer(buff.byteLength + 1);
    const newView = new Uint8Array(newBuff);

    newView[0] = code; // Set the new first byte
    newView.set(new Uint8Array(buff), 1); // Copy the old data after the first byte
    return newBuff;
}


export function areSetsEqual(setA, setB) {
    // Check if the sizes are different first, which is the fastest check.
    // If the sizes don't match, the sets cannot be equal.
    if (!setB) {
        return false;
    }

    if (setA.size !== setB.size) {
        return false;
    }

    // Iterate over each element of setA.
    // The 'for...of' loop is a great way to iterate over iterables in AssemblyScript
    // without creating a closure.
    for (const element of setA) {
        // For each element, check if the other set (setB) contains it.
        // The `has()` method on a Set is very efficient (average O(1)).
        // If we find even one element from setA that is not in setB, we can
        // immediately return false, as the sets are not equal.
        if (!setB.has(element)) {
            return false;
        }
    }

    // If the function reaches this point, it means all elements in setA were
    // found in setB, and the sizes were equal. Therefore, the sets are equal.
    return true;
}



export function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
}

let offset = [0,0];
const margin =[Screen[0]/10, Screen[1]/10];

export function draw(renderObject) {
    offset[0] = Math.max(Math.min(ME.x1-margin[0], offset[0]), ME.x1+ME.x2-Screen[0]+margin[0])
    offset[1] = Math.max(Math.min(ME.y1-margin[1], offset[1]), ME.y1+ME.y2-Screen[1]+margin[1])
    // const offX = ME.x1-Screen[0]/2; const offY = -Screen[1]/20;
    ctx.strokeStyle = renderObject.color;
    ctx.lineWidth = renderObject.size;
    if (renderObject.type == "box") {
        ctx.rect(renderObject.x1-offset[0], renderObject.y1-offset[1], renderObject.x2, renderObject.y2);
    }
}

export function show() {
    ctx.beginPath();
    TORENDER.forEach(element => {
        draw(element)
    });
    // TORENDER = []
    draw(ME.toRender())
    ctx.stroke();
}