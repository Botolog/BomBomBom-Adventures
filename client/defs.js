import { DC, KEY, INFO } from "../shared/build/defs.js"
import { socket } from "./index.js";

export const wsUrl = `ws://localhost:${INFO.PORT}`;
export let reconnectInterval = 3000; // 3 seconds


export let canvas = document.getElementById("canvas");
export const ctx = canvas.getContext('2d');


export class Box {
    constructor(x1, y1, x2, y2, flags) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.flags = flags;
    }
}

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
    return new Box(dots[0], dots[1], dots[2], dots[3], flags)
}

const bytesPerBox = (INFO.FLAGBUFFLEN + 16)
export function boxsFromBuff(data) {
    // console.log(data);/
    const fullView = new Uint8Array(data);
    let boxs = [];
    for (let i = 0; i < data.byteLength / bytesPerBox; i++) {
        const currentByteOffset = i * bytesPerBox;
        const currentBoxData = fullView.subarray(currentByteOffset, currentByteOffset + bytesPerBox);
        const box = boxFromBuff(currentBoxData);
        boxs.push(box);
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



export function drawBoxs(boxs) {
    // Clear the entire canvas before drawing.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the drawing style.
    ctx.strokeStyle = '#ff0000ff';
    ctx.lineWidth = 1;

    // Begin a new path. This is the key to batching.
    ctx.beginPath();

    // Iterate over the square data and add each rectangle to the current path.
    for (const square of boxs) {
        // `ctx.rect()` adds a rectangle to the current path without drawing it.
        ctx.rect(square.x1, square.y1, square.x2, square.y2);
    }

    // Draw all the rectangles in the path with a single stroke() call.
    ctx.stroke();
    // console.log(boxs)
}