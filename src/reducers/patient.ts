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
    apache2: number;
    agi: number;
    nrs2002: number;
    venttime: number;
    stayoficu: number;
    resultIndex: number;
    isAliveDischarge: boolean;
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
        apache2: 0,
        agi: 0,
        nrs2002: 0,
        venttime: 0,
        stayoficu: 0,
        resultIndex: 0,
        isAliveDischarge: true,
    };
}

export function deleteId(patient: IPatient): IPatient {
    const { _id, _openid, ...res } = patient;

    return res;
}

export interface IPatientState {
    patient_id: string;
    hospId: string;
    name: string;
    enrolltime: string;

    currentPage: number;
    pageSize: number;
    total: number;
}

const INIT_STATE: IPatientState = {
    patient_id: '',
    hospId: '',
    name: '',
    enrolltime: '',

    total: 0,
    currentPage: 1,
    pageSize: 20, // 20
};

export default function patients(state = INIT_STATE, action: IAction): IPatientState {
    switch (action.type) {
        case PATIENT_INDEX:
            console.log('PATIENT_INDEX: action', action);
            const { patient_id, hospId, name, enrolltime } = action.payload;
            return {
                ...state,
                patient_id,
                hospId,
                name,
                enrolltime,
            };

        case PATIENT_TOTAL:
            return {
                ...state,
                total: action.payload.total,
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
