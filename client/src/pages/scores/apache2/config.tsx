import { useState } from '@tarojs/taro';

// 年龄
export function gen_ages(defaultIndex = 0) {
    const [index, setIndex] = useState(defaultIndex);
    return {
        index,
        setIndex,
        items: ['0~44', '45~54', '55~64', '65~75', '≥75'],
        scores: [0, 2, 3, 5, 6],
        text: '年龄(岁)',
    };
}

// 肛温
export function gen_retalTemp(defaultIndex = 4) {
    const [index, setIndex] = useState(defaultIndex);
    return {
        index,
        setIndex,
        items: [
            'x<30',
            '30≤x<32',
            '32≤x<34',
            '34≤x<36',
            '36≤x<38.5',
            '38.5≤x<39',
            '39≤x<41',
            '≥41',
        ],
        scores: [-4, -3, -2, -1, 0, 1, 3, 4],
        text: '肛温(℃)',
    };
}

// 平均动脉压
export function gen_map(defaultIndex = 2) {
    const [index, setIndex] = useState(defaultIndex);
    return {
        index,
        setIndex,
        items: ['x<50', '50≤x<70', '70≤x<110', '110≤x<130', '130≤x<160', '≥160'],
        scores: [-4, -2, 0, 2, 3, 4],
        text: '平均动脉压(mmHg)',
    };
}

// 心率
export function gen_heartRate(defaultIndex = 3) {
    const [index, setIndex] = useState(defaultIndex);
    return {
        index,
        setIndex,
        items: ['x<40', '40≤x<55', '55≤x<70', '70≤x<110', '110≤x<140', '140≤x<180', '≥180'],
        scores: [-4, -3, -2, 0, 2, 3, 4],
        text: '心率(bmp)',
    };
}

// 呼吸频率
export function gen_respirateRate(defaultIndex = 3) {
    const [index, setIndex] = useState(defaultIndex);
    return {
        index,
        setIndex,
        items: ['x≤5', '6~9', '10~11', '12~24', '25~34', '35~49', '≥50'],
        scores: [-4, -2, -1, 0, 1, 3, 4],
        text: '呼吸频率(次/分)',
    };
}

// 吸氧浓度
export function gen_fio2(fio2: boolean) {
    return {
        items: fio2
            ? ['x<200', '200≤x<400', '400≤x<500', '≥500']
            : ['x<55', '55≤x<60', '60≤x<70', '≥70'],
        scores: fio2 ? [0, 2, 3, 4] : [-4, -3, -1, 0],
        text: fio2 ? 'AaDaO2(mmHg)' : 'PaO2(mmHg)',
    };
}

// 血气分析:
export function gen_ph(bg: boolean) {
    return {
        items: bg
            ? ['x<15', '15≤x<18', '18≤x<22', '22≤x<32', '32≤x<41', '41≤x<52', '≥52']
            : [
                  'x<7.15',
                  '7.15≤x<7.25',
                  '7.25≤x<7.33',
                  '7.33≤x<7.50',
                  '7.5≤x<7.6',
                  '7.6≤x<7.7',
                  '≥7.7',
              ],
        scores: bg ? [-4, -3, -2, 0, 1, 3, 4] : [-4, -3, -2, 0, 1, 3, 4],
        text: bg ? '静脉血HCO3-(mmol/L)' : '动脉血pH',
    };
}

// 血钠水平
export function gen_na(defaultIndex = 3) {
    const [index, setIndex] = useState(defaultIndex);

    return {
        index,
        setIndex,
        items: [
            'x<110',
            '110≤x<120',
            '120≤x<130',
            '130≤x<150',
            '150≤x<155',
            '155≤x<160',
            '160≤x<180',
            '≥180',
        ],
        scores: [-4, -3, -2, 0, 1, 2, 3, 4],
        text: '血钠(mmol/L)',
    };
}

// 血钾水平
export function gen_k(defaultIndex = 3) {
    const [index, setIndex] = useState(defaultIndex);

    return {
        index,
        setIndex,
        items: ['x<2.5', '2.5≤x<3', '3≤x<3.5', '3.5≤x<5.5', '5.5≤x<6', '6≤x<7', '≥7'],
        scores: [-4, -2, -1, 0, 1, 3, 4],
        text: '血钾(mmol/L)',
    };
}

// 血肌酐水平
export function gen_cr(defaultIndex = 1) {
    const [index, setIndex] = useState(defaultIndex);

    return {
        index,
        setIndex,
        items: ['x<53', '53≤x<128', '128≤x<172', '172≤x<305', '≥305'],
        scores: [-2, 0, 2, 3, 4],
        text: '血肌酐(mmol/L)',
    };
}

// 红细胞压积
export function rbc_compress_volume(defaultIndex = 2) {
    const [index, setIndex] = useState(defaultIndex);

    return {
        index,
        setIndex,
        items: ['x<20', '20≤x<30', '30≤x<46', '46≤x<50', '50≤x<60', '≥60'],
        scores: [-4, -2, 0, 1, 2, 4],
        text: '红细胞压积(%)',
    };
}

// 白细胞计数
export function wbc_count(defaultIndex = 2) {
    const [index, setIndex] = useState(defaultIndex);

    return {
        index,
        setIndex,
        items: ['x<1.0', '1.0≤x<3', '3≤x<15', '15≤x<20', '20≤x<40', '≥40'],
        scores: [-4, -2, 0, 1, 2, 4],
        text: '白细胞计数(×10^9/L)',
    };
}
