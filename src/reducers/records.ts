import dayjs from 'dayjs';

import { RECORD_ADD, RECORD_INDEX } from '../constants/record';
import { IAction } from '../actions/base';

import uuid from '../utils/uuid';

export interface IRecord {
    rowid: string;
    patientid: string;
    recordtime: string;
    nasalFeedTubeType: number;
    enteralCalories: number;
    parenteralCalories: number;
    totalProtein: number;
    prealbumin: number;
    albumin: number;
    serumTransferrin: number; // 血清转铁蛋白
    lymphocyteCount: number; // 淋巴细胞计数
    hemoglobin: number;
    fastingGlucose: number; // 空腹血糖
    gastricRetention: number; // 胃潴留量
    misinhalation: boolean; // 误吸
    diarrhea: boolean; // 腹泻
    gastrointestinalHemorrhage: boolean; // 消化道出血
    injectionOfAlbumin: number; // 注射白蛋白量
    agiScore: number;
}

export function zeroRecord(): IRecord {
    return {
        rowid: uuid(),
        patientid: 'ppp',
        recordtime: dayjs().format('YYYY-MM-DD'),
        nasalFeedTubeType: 0,
        enteralCalories: 0,
        parenteralCalories: 0,
        totalProtein: 0,
        prealbumin: 0,
        albumin: 0,
        serumTransferrin: 0,
        lymphocyteCount: 0,
        hemoglobin: 0,
        fastingGlucose: 0,
        gastricRetention: 0,
        misinhalation: false,
        diarrhea: false,
        gastrointestinalHemorrhage: false,
        injectionOfAlbumin: 0,
        agiScore: 0,
    };
}

export interface IRecordState {
    data: Array<IRecord>;
    index?: number;
}

const INIT_STATE: IRecordState = {
    data: [
        {
            rowid: uuid(),
            patientid: '1',
            recordtime: '2019-07-22',
            nasalFeedTubeType: 0,
            enteralCalories: 500,
            parenteralCalories: 500,
            prealbumin: 300,
            totalProtein: 60,
            albumin: 34,
            serumTransferrin: 3.3,
            lymphocyteCount: 300,
            hemoglobin: 120,
            fastingGlucose: 9.3,
            gastricRetention: 0,
            injectionOfAlbumin: 0,
            misinhalation: false,
            diarrhea: false,
            gastrointestinalHemorrhage: false,
            agiScore: 0,
        },
        {
            rowid: uuid(),
            patientid: '0',
            recordtime: '2019-07-25',
            nasalFeedTubeType: 0,
            enteralCalories: 500,
            parenteralCalories: 500,
            prealbumin: 300,
            totalProtein: 60,
            albumin: 34,
            serumTransferrin: 3.3,
            lymphocyteCount: 300,
            hemoglobin: 120,
            fastingGlucose: 9.3,
            gastricRetention: 0,
            injectionOfAlbumin: 0,
            misinhalation: false,
            diarrhea: false,
            gastrointestinalHemorrhage: false,
            agiScore: 0,
        },
    ],
};

export default function records(state = INIT_STATE, action: IAction): IRecordState {
    switch (action.type) {
        case RECORD_ADD:
            return {
                data: [...state.data, action.payload.item],
                index: state.index,
            };
        case RECORD_INDEX:
            console.log('PATIENT_INDEX: action', action);
            return {
                data: [...state.data],
                index: action.payload.index,
            };
        default:
            return state;
    }
}
