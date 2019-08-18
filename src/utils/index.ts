import Taro, { Dispatch, useState } from '@tarojs/taro';

export const null_func = e => e.preventDefault();

export const defaultValidator: (v: any) => boolean = (v: any) => v !== '';

export function useStringField(
    initialValue: any,
    message: string,
    valid: (v: any) => boolean = defaultValidator
): [any, Dispatch<any>, () => boolean] {
    const [field, setField] = useState(initialValue);
    const validator = (): boolean => {
        if (!valid(field)) {
            Taro.atMessage({
                message,
                type: 'error',
            });
            return false;
        }
        return true;
    };
    return [field, setField, validator];
}
