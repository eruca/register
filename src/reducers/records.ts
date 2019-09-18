import dayjs from 'dayjs';

import { RECORD_INDEX, RECORD_FORCE_REANDER } from '../constants/record';
import { IAction } from '../actions/base';

export interface IRecord {
    _id?: string;
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
    agiIndex: number;
    enteralNutritionToleranceScore: number; // 肠内营养耐受性评分
}

export function zeroRecord(patient_id: string): IRecord {
    return {
        patientid: patient_id,
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
        agiIndex: 0,
        enteralNutritionToleranceScore: 0,
    };
}

export interface IRecordState {
    record_id: string;
    force_render_count: number;
}

const INIT_STATE: IRecordState = {
    record_id: '',
    force_render_count: 0,
};

export default function records(state = INIT_STATE, action: IAction): IRecordState {
    switch (action.type) {
        case RECORD_INDEX:
            console.log('PATIENT_INDEX: action', action);
            const { record_id } = action.payload;

            return {
                ...state,
                record_id,
            };
        case RECORD_FORCE_REANDER:
            return {
                record_id: state.record_id,
                force_render_count: state.force_render_count + 1,
            };
        default:
            return state;
    }
}