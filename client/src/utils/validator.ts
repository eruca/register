export function validateNumber(fn: (v: number) => boolean) {
    return function(s: string): boolean {
        const v = parseFloat(s);
        return !Number.isNaN(v) && fn(v);
    };
}

export function validateInt(fn: (v: number) => boolean) {
    return function(s: string): boolean {
        const v = parseInt(s, 10);
        return !Number.isNaN(v) && fn(v);
    };
}

export function validateNotEmpty(v: string): boolean {
    return v !== '';
}

export type ConfigType = {
    message: string;
    validator: (v: string) => boolean;
};