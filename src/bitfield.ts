
export class Bitfield {
    public constructor(private field: number) {};

    public test(flag: number) {
        return (flag & this.field) === flag;
    }

    public is_set(index: number) {
        return this.test(1 << index);
    }
}