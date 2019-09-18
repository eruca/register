import { IRecord } from '../../reducers/records';
import {
    test_0_4999,
    test_0_10f,
    test_0_99,
    test_0_1999,
    test_20_999,
    test_0_200f,
} from '../../utils/regexp';
import { test_20_299, test_torentScore } from '../patient/config';

export const nasalFeedTubeTypes = ['胃管', '空肠管'];
export const AGIs = ['AGI Ⅰ级', 'AGI Ⅱ级', 'AGI Ⅲ级', 'AGI Ⅳ级'];

export interface LocalRecord {
    _id?: string;
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
        albumin: parseInt(record.albumin, 10),
        serumTransferrin: parseInt(record.serumTransferrin, 10), // 血清转铁蛋白
        lymphocyteCount: parseInt(record.lymphocyteCount, 10), // 淋巴细胞计数
        hemoglobin: parseInt(record.hemoglobin, 10),
        fastingGlucose: parseInt(record.fastingGlucose, 10), // 空腹血糖
        gastricRetention: parseInt(record.gastricRetention, 10), // 胃潴留量
        injectionOfAlbumin: parseInt(record.injectionOfAlbumin, 10), // 注射白蛋白量
        enteralNutritionToleranceScore: parseInt(record.enteralNutritionToleranceScore),
    };
    if (withID) {
        newOne['_id'] = record._id;
    }
    return newOne;
}

type ConfigType = {
    message: string;
    validator: (v: any) => boolean;
};

const config: Map<string, ConfigType> = [
    {
        key: 'enteralCalories',
        message: '肠内热卡0-4999之间',
        validator: test_0_4999,
    },
    {
        key: 'parenteralCalories',
        message: '肠外热卡0-4999之间',
        validator: test_0_4999,
    },
    {
        key: 'totalProtein',
        message: '总蛋白20-299',
        validator: test_20_299,
    },
    {
        key: 'prealbumin',
        message: '前蛋白20-999',
        validator: test_20_999,
    },
    {
        key: 'albumin',
        message: '白蛋白1-99',
        validator: test_0_99,
    },
    {
        key: 'serumTransferrin',
        message: '转铁蛋白0-10',
        validator: test_0_10f,
    },
    {
        key: 'lymphocyteCount',
        message: '淋巴细胞计数0-200',
        validator: test_0_200f,
    },
    {
        key: 'hemoglobin',
        message: '血红蛋白20-299',
        validator: test_20_299,
    },
    {
        key: 'fastingGlucose',
        message: '空腹血糖0-200',
        validator: test_0_200f,
    },
    {
        key: 'gastricRetention',
        message: '胃潴留0-1999',
        validator: test_0_1999,
    },
    {
        key: 'injectionOfAlbumin',
        message: '输白蛋白0-200',
        validator: test_0_200f,
    },
    {
        key: 'enteralNutritionToleranceScore',
        message: '肠内耐受性评分0~24分',
        validator: test_torentScore,
    },
].reduce((m, { key, validator, message }) => {
    m.set(key, { validator, message });
    return m;
}, new Map());

export function validate(record: LocalRecord): string {
    for (const key of Object.keys(record)) {
        const obj = config.get(key);
        if (obj === undefined) {
            continue;
        }

        if (!obj.validator(record[key])) {
            return obj.message;
        }
    }
    return '';
}
