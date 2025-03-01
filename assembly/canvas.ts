export const width: i32 = 256;
export const height: i32 = 256;
export const buffer = new Uint8Array(width * height * 4); // RGBA buffer

class Color {
    r: u8;
    g: u8;
    b: u8;
    a: u8;
    constructor(r: u8, g: u8, b: u8, a: u8=1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}


class Canvas {
    width: i32;
    height: i32;
    buffer: Uint8Array;
    constructor (width: i32, height: i32) {
        this.width = width;
        this.height = height;
        this.buffer = new Uint8Array(width * height * 4);
    }
    setPixel(x: i32, y: i32, r: u8, g: u8, b: u8, a: u8): void {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return; // Bounds check
        let index = (y * this.width + x) * 4;
        this.buffer[index] = r;
        this.buffer[index + 1] = g;
        this.buffer[index + 2] = b;
        this.buffer[index + 3] = a;
    }
    fillRect(x: i32, y: i32, w: i32, h: i32, r: u8, g: u8, b: u8, a: u8): void {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.setPixel(i, j, r, g, b, a);
            }
        }
    }
    drawRect(x: i32, y: i32, w: i32, h: i32, r: u8, g: u8, b: u8, a: u8): void {
        for (let i = x; i < x + w; i++) {
            this.setPixel(i, y, r, g, b, a);
            this.setPixel(i, y + h - 1, r, g, b, a);
        }
        for (let j = y; j < y + h; j++) {
            this.setPixel(x, j, r, g, b, a);
            this.setPixel(x + w - 1, j, r, g, b, a);
        }
    }
    clear(): void {
        for (let i = 0; i < this.buffer.length; i += 4) {
            this.buffer[i] = 0;
            this.buffer[i + 1] = 0;
            this.buffer[i + 2] = 0;
            this.buffer[i + 3] = 255;
        }
    }
    render(): Uint8Array {
        return this.buffer;
    }

}
