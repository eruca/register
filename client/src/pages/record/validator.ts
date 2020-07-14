import { validateInt, validateNumber, ConfigType } from '../../utils/validator';
import { LocalRecord } from './config';

const config: Map<string, ConfigType> = [
    {
        key: 'enteralCalories',
        message: '肠内热卡0-5000之间',
        validator: validateInt(v => v >= 0 && v < 5000),
    },
    {
        key: 'parenteralCalories',
        message: '肠外热卡0-5000之间',
        validator: validateInt(v => v >= 0 && v < 5000),
    },
    {
        key: 'totalProtein',
        message: '总蛋白20-299',
        validator: validateNumber(v => v >= 0 && v < 300),
    },
    {
        key: 'prealbumin',
        message: '前蛋白20-999',
        validator: validateNumber(v => v >= 0 && v < 1000),
    },
    {
        key: 'albumin',
        message: '白蛋白1-99',
        validator: validateNumber(v => v >= 0 && v < 100),
    },
    {
        key: 'serumTransferrin',
        message: '转铁蛋白0-10',
        validator: validateNumber(v => v >= 0 && v <= 15),
    },
    {
        key: 'lymphocyteCount',
        message: '淋巴细胞计数0-200',
        validator: validateNumber(v => v >= 0 && v < 200),
    },
    {
        key: 'hemoglobin',
        message: '血红蛋白20-300',
        validator: validateNumber(v => v >= 0 && v < 300),
    },
    {
        key: 'fastingGlucose',
        message: '空腹血糖0-200',
        validator: validateNumber(v => v >= 0 && v < 200),
    },
    {
        key: 'gastricRetention',
        message: '胃潴留0-2000',
        validator: validateInt(v => v >= 0 && v <= 2000),
    },
    {
        key: 'injectionOfAlbumin',
        message: '输白蛋白0-200',
        validator: validateNumber(v => v >= 0 && v < 200),
    },
    {
        key: 'enteralNutritionToleranceScore',
        message: '肠内耐受性评分0~24分',
        validator: validateInt(v => v >= 0 && v <= 24),
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
