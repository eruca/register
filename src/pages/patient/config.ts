import { IPatient } from '../../reducers/patient';

export interface LocalPatient {
    _id?: string;
    _openid?: string;
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
    useSmallPeptide: boolean;
    apache2: string;
    agi: string;
    nrs2002: string;
    venttime: string;
    stayoficu: string;
    resultIndex: number;
    isAliveDischarge: boolean;
    enteralNutritionToleranceScore: string;
}

export function convertToLocal(patient: IPatient): LocalPatient {
    return {
        _id: patient._id,
        _openid: patient._openid,
        hospId: patient.hospId,
        name: patient.name,
        isMale: patient.isMale,
        admittime: patient.admittime,
        enrolltime: patient.enrolltime,
        diagnoseIndex: patient.diagnoseIndex,
        needVentilation: patient.needVentilation,
        needVesopressor: patient.needVesopressor,
        useSmallPeptide: patient.useSmallPeptide,
        resultIndex: patient.resultIndex,
        isAliveDischarge: patient.isAliveDischarge,

        venttime: patient.venttime.toString(),
        stayoficu: patient.stayoficu.toString(),
        age: patient.age.toString(),
        bed: patient.bed.toString(),
        height: patient.height.toString(),
        weight: patient.weight.toString(),
        apache2: patient.apache2.toString(),
        agi: patient.agi.toString(),
        nrs2002: patient.nrs2002.toString(),
        enteralNutritionToleranceScore: (patient.enteralNutritionToleranceScore || 0).toString(),
    };
}

export function convertToPatient(patient: LocalPatient, withID: boolean = true): IPatient {
    const newOne: IPatient = {
        hospId: patient.hospId,
        name: patient.name,
        isMale: patient.isMale,
        admittime: patient.admittime,
        enrolltime: patient.enrolltime,
        diagnoseIndex: patient.diagnoseIndex,
        needVentilation: patient.needVentilation,
        needVesopressor: patient.needVesopressor,
        useSmallPeptide: patient.useSmallPeptide,
        resultIndex: patient.resultIndex,
        isAliveDischarge: patient.isAliveDischarge,

        venttime: parseInt(patient.venttime),
        stayoficu: parseInt(patient.stayoficu),
        age: parseInt(patient.age),
        bed: parseInt(patient.bed),
        height: parseInt(patient.height),
        weight: parseInt(patient.weight),
        apache2: parseInt(patient.apache2),
        agi: parseInt(patient.agi),
        nrs2002: parseInt(patient.nrs2002),
        enteralNutritionToleranceScore: parseInt(patient.enteralNutritionToleranceScore),
    };
    if (withID) {
        newOne['_id'] = patient._id;
        newOne['_openid'] = patient._openid;
    }
    return newOne;
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
