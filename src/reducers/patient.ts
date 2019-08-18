import dayjs from 'dayjs';
import { PATIENT_ADD, PATIENT_INDEX } from '../constants/patient';
import { IAction } from '../actions/base';
import uuid from '../utils/uuid';

export interface IPatient {
    rowid: string;
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
    data: Array<IPatient>;
    // 进入patient页面时传递是已有记录还是新记录
    index?: number;
}

export function zeroValue(): IPatient {
    return {
        rowid: uuid(),
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

const INIT_STATE: IPatientState = {
    data: [
        {
            rowid: '0',
            hospId: '100',
            name: 'name',
            isMale: true,
            age: 33,
            bed: 3,
            admittime: '2019-07-21',
            enrolltime: '2019-07-21',
            height: 179,
            weight: 67,
            diagnoseIndex: 0,
            needVesopressor: false,
            needVentilation: false,
            apache2: 32,
            agi: 1,
            nrs2002: 200,
        },
        {
            rowid: '1',
            hospId: '101',
            name: 'name1',
            isMale: true,
            age: 58,
            bed: 3,
            admittime: '2019-08-01',
            enrolltime: '2019-08-01',
            height: 179,
            weight: 67,
            diagnoseIndex: 0,
            needVesopressor: false,
            needVentilation: false,
            apache2: 32,
            agi: 1,
            nrs2002: 200,
        },
    ],
};

export default function patients(state = INIT_STATE, action: IAction): IPatientState {
    switch (action.type) {
        case PATIENT_ADD:
            return {
                data: [...state.data, action.payload.item],
                index: state.index,
            };
        case PATIENT_INDEX:
            console.log('PATIENT_INDEX: action', action);
            return {
                data: [...state.data],
                index: action.payload.index,
            };
        default:
            return state;
    }
}
