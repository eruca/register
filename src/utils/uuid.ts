// const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

// export default function uuid(): string {
//     const uuid = new Array(36);
//     let rnd: number = 0;
//     let r: number;
//     for (var i = 0; i < 36; i++) {
//         if (i == 8 || i == 13 || i == 18 || i == 23) {
//             uuid[i] = '-';
//         } else if (i == 14) {
//             uuid[i] = '4';
//         } else {
//             if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
//             r = rnd & 0xf;
//             rnd = rnd >> 4;
//             uuid[i] = CHARS[i == 19 ? (r & 0x3) | 0x8 : r];
//         }
//     }
//     return uuid.join('');
// }
