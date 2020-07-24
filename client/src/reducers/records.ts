import dayjs from 'dayjs';

import { RECORD_INDEX } from '../constants/record';
import { IAction } from '../actions/base';

export interface IRecord {
    _id?: string;
    _openid?: string;
    patientid: string;
    recordtime: string;
    nasalFeedTubeType: number;
    enteralCalories: number;
    parenteralCalories: number;
    enteralProtein: number; // 肠内营养性氨基酸
    parenteralProtein: number; // 肠外营养性氨基酸
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
        enteralProtein: 0,
        parenteralProtein: 0,
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

export function equalRecords(lhs: IRecord, rhs: IRecord): boolean {
    return (
        lhs.recordtime === rhs.recordtime &&
        lhs.nasalFeedTubeType === rhs.nasalFeedTubeType &&
        lhs.misinhalation === rhs.misinhalation &&
        lhs.diarrhea === rhs.diarrhea &&
        lhs.gastrointestinalHemorrhage === rhs.gastrointestinalHemorrhage &&
        lhs.agiIndex === rhs.agiIndex &&
        lhs.enteralCalories === rhs.enteralCalories &&
        lhs.parenteralCalories === rhs.parenteralCalories &&
        lhs.enteralProtein === rhs.enteralProtein &&
        lhs.parenteralProtein === rhs.parenteralProtein &&
        lhs.albumin === rhs.albumin &&
        lhs.totalProtein === rhs.totalProtein &&
        lhs.prealbumin === rhs.prealbumin &&
        lhs.serumTransferrin === rhs.serumTransferrin &&
        lhs.lymphocyteCount === rhs.lymphocyteCount &&
        lhs.hemoglobin === rhs.hemoglobin &&
        lhs.fastingGlucose === rhs.fastingGlucose &&
        lhs.gastricRetention === rhs.gastricRetention &&
        lhs.injectionOfAlbumin === rhs.injectionOfAlbumin &&
        lhs.enteralNutritionToleranceScore === rhs.enteralNutritionToleranceScore
    );
}

export interface IRecordState {
    record_id: string;
}

const INIT_STATE: IRecordState = {
    record_id: '',
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
        default:
            return state;
    }
}
