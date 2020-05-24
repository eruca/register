import dayjs from 'dayjs';

import { PATIENT_INDEX } from '../constants/patient';
import { IAction } from '../actions/base';

export interface IPatient {
    _id?: string;
    _openid?: string; // 创建者
    hospId: string;
    name: string;
    isMale: boolean;
    age: number;
    bed: number;
    admittime: string;
    enrolltime: string;
    height: number;
    weight: number;
    diagnoseIndex: number;
    needVesopressor: boolean;
    needVentilation: boolean;
    useSmallPeptide: boolean;
    apache2: number;
    agi: number;
    nrs2002: number;
    venttime: number;
    stayoficu: number;
    resultIndex: number;
    isAliveDischarge: boolean;
    enteralNutritionToleranceScore: number;
}

export function zeroPatient(): IPatient {
    return {
        hospId: '',
        name: '',
        isMale: false,
        age: 0,
        bed: 0,
        admittime: dayjs().format('YYYY-MM-DD'),
        enrolltime: dayjs().format('YYYY-MM-DD'),
        height: 0,
        weight: 0,
        diagnoseIndex: 0,
        needVesopressor: false,
        needVentilation: false,
        useSmallPeptide: false,
        apache2: 0,
        agi: 0,
        nrs2002: 0,
        venttime: 0,
        stayoficu: 0,
        resultIndex: 0,
        isAliveDischarge: true,
        enteralNutritionToleranceScore: 0,
    };
}

export interface IPatientState {
    patient_id: string;
    _openid: string;
    hospId: string; // 选择患者的信息，方便后面获取不用再调数据库
    name: string;
    enrolltime: string;
}

const INIT_STATE: IPatientState = {
    patient_id: '',
    _openid: '',
    hospId: '',
    name: '',
    enrolltime: '',
};

export default function patients(state = INIT_STATE, action: IAction): IPatientState {
    switch (action.type) {
        case PATIENT_INDEX:
            console.log('PATIENT_INDEX: action', action);
            const { patient_id, _openid, hospId, name, enrolltime } = action.payload;
            return {
                ...state,
                patient_id,
                _openid,
                hospId,
                name,
                enrolltime,
            };

        default:
            return state;
    }
}
