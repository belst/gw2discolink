
export class Bitfield {
    constructor(private field: number) {}

    test(flag: number) {
        return (flag & this.field) === flag;
    }

    is_set(index: number) {
        return this.test(1 << index);
    }
}