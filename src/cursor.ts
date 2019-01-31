
export class Cursor {
    private ptr = 0;

    constructor(private buffer: Buffer) {}

    readInt8() {
        return this.buffer[this.ptr++];
    }

    readInt16LE() {
        return this.buffer[this.ptr++] | this.buffer[this.ptr++] << 8;
    }

    readInt24LE() {
        return this.buffer[this.ptr++] | this.buffer[this.ptr++] << 8 | this.buffer[this.ptr++] << 16;
    }
}