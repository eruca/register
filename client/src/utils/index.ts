// import Taro, { Dispatch, useState } from '@tarojs/taro';
// import { validateNotEmpty } from './validator';

// export const null_func = e => e.preventDefault();

// export function useStringField(
//     initialValue: any,
//     message: string,
//     valid: (v: any) => boolean = validateNotEmpty
// ): [any, Dispatch<any>, () => boolean] {
//     const [field, setField] = useState(initialValue);
//     const validator = (): boolean => {
//         if (!valid(field)) {
//             Taro.atMessage({
//                 message,
//                 type: 'error',
//             });
//             return false;
//         }
//         return true;
//     };
//     return [field, setField, validator];
// }

// needle是探针，haystack是全局
// export function fuzzysearch(needle: string, haystack: string): boolean {
//     const hlen = haystack.length;
//     const nlen = needle.length;
//     if (nlen > hlen) {
//         return false;
//     }
//     if (nlen === hlen) {
//         return needle === haystack;
//     }
//     outer: for (let i = 0, j = 0; i < nlen; i++) {
//         const nch = needle.charCodeAt(i);
//         while (j < hlen) {
//             if (haystack.charCodeAt(j++) === nch) {
//                 continue outer;
//             }
//         }
//         return false;
//     }
//     return true;
// }

// function debounce(func, wait, immediate) {
//     var timeout, result;

//     var debounced = function () {
//         var context = this;
//         var args = arguments;
//         if (timeout) clearTimeout(timeout);

//         var later = function () {
//             timeout = null;
//             if (!immediate) result = func.apply(context, args);
//         };

//         var callNow = immediate && !timeout;
//         timeout = setTimeout(later, wait);
//         if (callNow) result = func.apply(this, args);

//         return result;
//     };
//     // debounced.cancel = function () {
//     //     clearTimeout(timeout);
//     //     timeout = null;
//     // };
//     return debounced;
// }
