import { IRecord } from '../../reducers/records';

export const nasalFeedTubeTypes = ['胃管', '空肠管'];
export const AGIs = ['AGI Ⅰ级', 'AGI Ⅱ级', 'AGI Ⅲ级', 'AGI Ⅳ级'];

export interface LocalRecord {
    _id?: string;
    _openid?: string;
    patientid: string;
    recordtime: string;
    nasalFeedTubeType: number;
    enteralCalories: string;
    parenteralCalories: string;
    totalProtein: string;
    prealbumin: string;
    albumin: string;
    serumTransferrin: string; // 血清转铁蛋白
    lymphocyteCount: string; // 淋巴细胞计数
    hemoglobin: string;
    fastingGlucose: string; // 空腹血糖
    gastricRetention: string; // 胃潴留量
    misinhalation: boolean; // 误吸
    diarrhea: boolean; // 腹泻
    gastrointestinalHemorrhage: boolean; // 消化道出血
    injectionOfAlbumin: string; // 注射白蛋白量
    agiIndex: number;
    enteralNutritionToleranceScore: string; // 肠道耐受性评分
}

export function convertToLocal(record: IRecord): LocalRecord {
    return {
        _id: record._id,
        _openid: record._openid,
        patientid: record.patientid,
        recordtime: record.recordtime,
        nasalFeedTubeType: record.nasalFeedTubeType,
        misinhalation: record.misinhalation,
        diarrhea: record.diarrhea,
        gastrointestinalHemorrhage: record.gastrointestinalHemorrhage,
        agiIndex: record.agiIndex,

        enteralCalories: record.enteralCalories.toString(),
        parenteralCalories: record.parenteralCalories.toString(),
        totalProtein: record.totalProtein.toString(),
        prealbumin: record.prealbumin.toString(),
        albumin: record.albumin.toString(),
        serumTransferrin: record.serumTransferrin.toString(), // 血清转铁蛋白
        lymphocyteCount: record.lymphocyteCount.toString(), // 淋巴细胞计数
        hemoglobin: record.hemoglobin.toString(),
        fastingGlucose: record.fastingGlucose.toString(), // 空腹血糖
        gastricRetention: record.gastricRetention.toString(), // 胃潴留量
        injectionOfAlbumin: record.injectionOfAlbumin.toString(), // 注射白蛋白量
        enteralNutritionToleranceScore: (record.enteralNutritionToleranceScore || 0).toString(),
    };
}

export function convertToIRecord(record: LocalRecord, withID: boolean = true): IRecord {
    const newOne: IRecord = {
        patientid: record.patientid,
        recordtime: record.recordtime,
        nasalFeedTubeType: record.nasalFeedTubeType,
        misinhalation: record.misinhalation,
        diarrhea: record.diarrhea,
        gastrointestinalHemorrhage: record.gastrointestinalHemorrhage,
        agiIndex: record.agiIndex,

        enteralCalories: parseInt(record.enteralCalories, 10),
        parenteralCalories: parseInt(record.parenteralCalories, 10),
        totalProtein: parseInt(record.totalProtein, 10),
        prealbumin: parseInt(record.prealbumin, 10),
        albumin: parseFloat(record.albumin),
        serumTransferrin: parseFloat(record.serumTransferrin), // 血清转铁蛋白
        lymphocyteCount: parseFloat(record.lymphocyteCount), // 淋巴细胞计数
        hemoglobin: parseInt(record.hemoglobin, 10),
        fastingGlucose: parseFloat(record.fastingGlucose), // 空腹血糖
        gastricRetention: parseInt(record.gastricRetention, 10), // 胃潴留量
        injectionOfAlbumin: parseInt(record.injectionOfAlbumin, 10), // 注射白蛋白量
        enteralNutritionToleranceScore: parseInt(record.enteralNutritionToleranceScore),
    };
    if (withID) {
        newOne['_id'] = record._id;
        newOne['_openid'] = record._openid;
    }
    return newOne;
}

export function equal(lhs: LocalRecord, rhs: LocalRecord): boolean {
    return (
        lhs.recordtime === rhs.recordtime &&
        lhs.nasalFeedTubeType === rhs.nasalFeedTubeType &&
        lhs.misinhalation === rhs.misinhalation &&
        lhs.diarrhea === rhs.diarrhea &&
        lhs.gastrointestinalHemorrhage === rhs.gastrointestinalHemorrhage &&
        lhs.agiIndex === rhs.agiIndex &&
        lhs.enteralCalories === rhs.enteralCalories &&
        lhs.parenteralCalories === rhs.parenteralCalories &&
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
