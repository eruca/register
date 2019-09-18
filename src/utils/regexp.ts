const re0_10 = /[1-9](?:\.\d+)?/;
export function test_0_10f(v: any) {
    return re0_10.test(v as string);
}
const re1_39f = /^(?:[1-9]|[1-3]\d)(?:\.\d+)?$/;
export function test_1_39f(v: string): boolean {
    return re1_39f.test(v);
}

const re0_99 = /^(?:\d|[1-9]\d)$/;
export function test_0_99(v: string): boolean {
    return re0_99.test(v);
}
const re16_139 = /^(?:[1-9]\d|1[1-3]\d)$/;
export function test_16_139(v: string): boolean {
    return re16_139.test(v);
}
const re20_299 = /^(?:[2-9]\d|[1-2]\d\d)(\.\d)?$/;
export function test_20_299(v: string): boolean {
    return re20_299.test(v);
}
const re100_299 = /^(?:[1-2]\d\d)$/;
export function test_100_299(v: string): boolean {
    return re100_299.test(v);
}

const re0_1999 = /^(?:\d|[1-9]\d{1,2}|1\d{3})$/;
export function test_0_1999(v: string): boolean {
    return re0_1999.test(v);
}
const re0_4999 = /^(?:\d|[1-9]\d{1,2}|[1-4]\d{3})$/;
export function test_0_4999(v: any) {
    return re0_4999.test(v as string);
}
const re20_999 = /^(?:[2-9]\d|[1-9]\d\d)$/;
export function test_20_999(v: string) {
    return re20_999.test(v);
}

const re0_200f = /^(?:\d|[1-9]\d|[1-2]\d\d)(\.\d+)?$/;
export function test_0_200f(v: string) {
    return re0_200f.test(v);
}
