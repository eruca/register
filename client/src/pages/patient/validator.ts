import { validateNotEmpty, validateInt, ConfigType, validateNumber } from '../../utils/validator';
import { LocalPatient } from './config';

const validators: Map<string, ConfigType> = [
    {
        key: 'name',
        message: '名字不能为空',
        validator: validateNotEmpty,
    },
    {
        key: 'age',
        message: '年龄在16-139之间',
        validator: validateInt(v => v > 16 && v < 139),
    },
    {
        key: 'bed',
        message: '床号在1-120之间',
        validator: validateInt(v => v >= 1 && v < 120),
    },
    {
        key: 'height',
        message: '身高在60-299之间',
        validator: validateInt(v => v >= 60 && v < 300),
    },
    {
        key: 'weight',
        message: '体重在20-299',
        validator: validateNumber(v => v >= 20 && v < 300),
    },
    {
        key: 'apache2',
        message: 'ApacheII分值在0~71分',
        validator: validateInt(v => v >= 0 && v <= 71),
    },
    {
        key: 'agi',
        message: 'AGI评分0-4',
        validator: validateInt(v => v >= 0 && v <= 4),
    },
    {
        key: 'nrs2002',
        message: 'NRS2002评分0~23',
        validator: validateInt(v => v >= 0 && v <= 23),
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

export function validate(patient: LocalPatient): string {
    for (const key of Object.keys(patient)) {
        const obj = validators.get(key);
        if (obj === undefined) {
            continue;
        }

        console.log('obj', obj, key, patient[key]);
        if (!obj.validator(patient[key])) {
            return obj.message;
        }
    }
    return '';
}
