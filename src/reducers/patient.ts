import dayjs from 'dayjs';

import { PATIENT_INDEX } from '../constants/patient';
import { IAction } from '../actions/base';

export interface IPatient {
    _id?: string;
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
}

export interface IPatientState {
    index: string;
}

const INIT_STATE: IPatientState = {
    index: '',
};

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
    };
}

export default function patients(state = INIT_STATE, action: IAction): IPatientState {
    switch (action.type) {
        case PATIENT_INDEX:
            console.log('PATIENT_INDEX: action', action);
            return {
                index: action.payload.index,
            };
        default:
            return state;
    }
}