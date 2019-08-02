import Taro, { Dispatch, useState } from '@tarojs/taro';
// import {} from 'taro-ui'

const reNumber = /^(?:[1-9]\d|1[1-3]\d)$/;
export function testNumber_16_139(v: string): boolean {
    return reNumber.test(v);
}

const bedNum = /^(?:[1-9]|[1-9]\d)$/;
export function test_1_99(v: string): boolean {
    return bedNum.test(v);
}

const heightNum = /^(?:[1-2]\d\d)$/;
export function test_100_299(v: string): boolean {
    return heightNum.test(v);
}

const weightNum = /^(?:[2-9]\d|[1-2]\d\d)(\.\d)?$/;
export function test_20_299(v: string): boolean {
    return weightNum.test(v);
}

// export function wrap(fn: Dispatch<any>, fn2: (v: string) => boolean, message: string) {
//     return function(v: string) {
//         if (v === '') {
//             return
//         }
//         if (!fn2(v)) {
//             Taro.atMessage({
//                 message: `输入错误:${message}`,
//                 type: 'error',
//             })
//             fn('')
//         } else {
//             fn(v)
//         }
//     }
// }

export const selector = [
    '呼吸系统病变',
    '心血管系统病变',
    '中枢神经病变',
    '消化系统病变',
    '泌尿系统病变',
    '血液系统病变',
    '内分泌系统病变',
    '外科术后（含各系统）',
    '创伤/烧伤',
    '中毒',
    '严重脓毒症/脓毒性休克',
    '心脏骤停',
    '其他',
];

export const null_func = () => {};

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
