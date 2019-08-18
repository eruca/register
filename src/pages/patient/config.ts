import { IPatient } from '../../reducers/patient';

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

type ConfigType = {
    message: string;
    validator: (v: any) => boolean;
};

export const config: Map<string, ConfigType> = [
    {
        key: 'name',
        message: '名字不能为空',
        validator: (v: any) => (v as string) !== '',
    },
    {
        key: 'age',
        message: '年龄在16-139之间',
        validator: testNumber_16_139,
    },
    {
        key: 'bed',
        message: '床号在1-100之间',
        validator: test_1_99,
    },
    {
        key: 'height',
        message: '身高在100-299之间',
        validator: test_100_299,
    },
    {
        key: 'weight',
        message: '体重在20-299',
        validator: test_20_299,
    },
    {
        key: 'apache2',
        message: 'ApacheII分值在0~71分',
        validator: (v: string) => {
            const num = parseInt(v, 10);
            return !Number.isNaN(num) && num >= 0 && num <= 71;
        },
    },
    {
        key: 'agi',
        message: 'AGI评分0-4',
        validator: (v: string) => {
            const num = parseInt(v, 10);
            return !Number.isNaN(num) && num >= 0 && num <= 4;
        },
    },
    {
        key: 'nrs2002',
        message: 'NRS2002评分不能为空',
        validator: test_1_99, // todo :需要修正
    },
].reduce((m, { key, validator, message }) => {
    m.set(key, { validator, message });
    return m;
}, new Map());

export interface LocalPatient {
    _id?: string;
    hospId: string;
    name: string;
    isMale: boolean;
    age: string;
    bed: string;
    admittime: string;
    enrolltime: string;
    height: string;
    weight: string;
    diagnoseIndex: number;
    needVesopressor: boolean;
    needVentilation: boolean;
    apache2: string;
    agi: string;
    nrs2002: string;
}

export function convertToLocal(patient: IPatient): LocalPatient {
    return {
        _id: patient._id,
        hospId: patient.hospId,
        name: patient.name,
        isMale: patient.isMale,
        admittime: patient.admittime,
        enrolltime: patient.enrolltime,
        diagnoseIndex: patient.diagnoseIndex,
        needVentilation: patient.needVentilation,
        needVesopressor: patient.needVesopressor,
        age: patient.age.toString(),
        bed: patient.bed.toString(),
        height: patient.height.toString(),
        weight: patient.weight.toString(),
        apache2: patient.apache2.toString(),
        agi: patient.agi.toString(),
        nrs2002: patient.nrs2002.toString(),
    };
}

export function convertToPatient(patient: LocalPatient): IPatient {
    return {
        _id: patient._id,
        hospId: patient.hospId,
        name: patient.name,
        isMale: patient.isMale,
        admittime: patient.admittime,
        enrolltime: patient.enrolltime,
        diagnoseIndex: patient.diagnoseIndex,
        needVentilation: patient.needVentilation,
        needVesopressor: patient.needVesopressor,
        age: parseInt(patient.age),
        bed: parseInt(patient.bed),
        height: parseInt(patient.height),
        weight: parseInt(patient.weight),
        apache2: parseInt(patient.apache2),
        agi: parseInt(patient.agi),
        nrs2002: parseInt(patient.nrs2002),
    };
}

export function convertToPatientWithoutId(patient: LocalPatient): IPatient {
    return {
        hospId: patient.hospId,
        name: patient.name,
        isMale: patient.isMale,
        admittime: patient.admittime,
        enrolltime: patient.enrolltime,
        diagnoseIndex: patient.diagnoseIndex,
        needVentilation: patient.needVentilation,
        needVesopressor: patient.needVesopressor,
        age: parseInt(patient.age),
        bed: parseInt(patient.bed),
        height: parseInt(patient.height),
        weight: parseInt(patient.weight),
        apache2: parseInt(patient.apache2),
        agi: parseInt(patient.agi),
        nrs2002: parseInt(patient.nrs2002),
    };
}

export function validate(patient: LocalPatient): string {
    for (const key of Object.keys(patient)) {
        const obj = config.get(key);
        if (obj === undefined) {
            continue;
        }

        if (!obj.validator(patient[key])) {
            return obj.message;
        }
    }
    return '';
}
