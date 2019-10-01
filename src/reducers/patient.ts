import dayjs from 'dayjs';

import { PATIENT_INDEX, PATIENT_TOTAL, PATIENT_CURRENT } from '../constants/patient';
import { IAction } from '../actions/base';

export interface IPatient {
    _id?: string;
    _openid?: string;
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

export interface Statistic {
    total: number;
    groupTotal: number;
    meTotal: number;

    resultTotal: number;
    groupResultTotal: number;
    meResultTotal: number;

    weekTotal: number;
    groupWeekTotal: number;
    meWeekTotal: number;
}

export interface IPatientState extends Statistic {
    patient_id: string;
    _openid: string;
    hospId: string;
    name: string;
    enrolltime: string;

    currentPage: number;
    pageSize: number;
}

const INIT_STATE: IPatientState = {
    patient_id: '',
    _openid: '',
    hospId: '',
    name: '',
    enrolltime: '',

    currentPage: 1,
    pageSize: 20, // 20

    total: 0,
    groupTotal: 0,
    meTotal: 0,
    resultTotal: 0,
    groupResultTotal: 0,
    meResultTotal: 0,
    weekTotal: 0,
    groupWeekTotal: 0,
    meWeekTotal: 0,
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

        case PATIENT_TOTAL:
            return {
                ...state,
                ...action.payload,
            };

        case PATIENT_CURRENT:
            return {
                ...state,
                currentPage: action.payload.currentPage,
            };

        default:
            return state;
    }
}
