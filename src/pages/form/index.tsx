import Taro, { useState, useCallback } from '@tarojs/taro';
import dayjs from 'dayjs';
import { useSelector } from '@tarojs/redux';
import { View, Picker } from '@tarojs/components';
import { AtForm, AtInput, AtSwitch, AtButton, AtMessage } from 'taro-ui';

import { zeroRecord } from '../../reducers/records';
import { useStringField } from '../../utils';
import FormField from '../../components/FormField';
// import { IState } from '../../reducers/patient';
import { IReducers } from '../../reducers';
import {
    test_0_4999,
    test_0_10f,
    test_1_99,
    test_100_299,
    test_1_39f,
    test_0_1999,
} from '../../utils/regexp';
import { nasalFeedTubeTypes, AGIs } from './config';

export default function Form() {
    const { data, index, patientid } = useSelector((state: IReducers) => {
        const {
            patients: { data, index },
            records: { data: records_data, index: records_index },
        } = state;
        if (index === undefined) {
            console.log('index 不能为 undefine in Form now');
            return {};
        }
        const patientid = data[index].rowid;
        return { data: records_data, index: records_index, patientid };
    });

    console.log('data', data, 'index', index);

    const zero_record = zeroRecord();
    const defaultRecord =
        index !== undefined && data && data.length > 0 ? data[index] : zero_record;

    console.log('defaultRecord', defaultRecord);
    const [recordtime, setRecordTime] = useState(defaultRecord.recordtime);
    const setToday = useCallback(() => setRecordTime(dayjs().format('YYYY-MM-DD')), [
        setRecordTime,
    ]);

    const [nasalFeedTubeType, setNasalFeedTubeType] = useState(defaultRecord.nasalFeedTubeType);
    const [enteralCalories, setEnteralCalories, enteralCaloriesValidator] = useStringField(
        defaultRecord.enteralCalories,
        '肠内热卡错误',
        test_0_4999
    );
    const [parenteralCalories, setParenteralCalories, parenteralCaloriesValidator] = useStringField(
        defaultRecord.parenteralCalories,
        '肠外热卡错误',
        test_0_4999
    );
    const [totalProtein, setTotalProtein, totalProteinValidator] = useStringField(
        defaultRecord.totalProtein,
        '总蛋白错误',
        test_1_99
    );
    const [prealbumin, setPrealbumin, prealbuminValidator] = useStringField(
        defaultRecord.prealbumin,
        '前白蛋白错误',
        test_1_99
    );
    const [albumin, setAlbumin, albuminValidator] = useStringField(
        defaultRecord.albumin,
        '白蛋白错误',
        test_1_99
    );
    const [serumTransferrin, setSerumTransferrin, serumTransferrinValidator] = useStringField(
        defaultRecord.serumTransferrin,
        '转铁蛋白错误',
        test_0_10f
    );
    const [lymphocyteCount, setLymphocyteCount, lymphocyteCountValidator] = useStringField(
        defaultRecord.lymphocyteCount,
        '淋巴细胞计算错误',
        test_0_10f
    );
    const [hemoglobin, setHemoglobin, hemoglobinValidator] = useStringField(
        defaultRecord.hemoglobin,
        '血红蛋白错误',
        test_1_39f
    );
    const [fastingGlucose, setFastingGlucose, fastingGlucoseValidator] = useStringField(
        defaultRecord.fastingGlucose,
        '空腹血糖',
        test_1_99
    );
    const [gastricRetention, setGastricRetention, gastricRetentionValidator] = useStringField(
        defaultRecord.gastricRetention,
        '胃潴留错误',
        test_0_1999
    );
    const [misinhalation, setMisinhalation] = useState(defaultRecord.misinhalation);
    const [diarrhea, setDiarrhea] = useState(defaultRecord.diarrhea);
    const [gastrointestinalHemorrhage, setGastrointestingHemorrhage] = useState(
        defaultRecord.gastrointestinalHemorrhage
    );
    const [injectionOfAlbumin, setInjectionOfAlbumin, injectionOfAlbuminValidator] = useStringField(
        defaultRecord.injectionOfAlbumin,
        '输白蛋白错误',
        test_100_299
    );
    const [agiIndex, setAgiIndex] = useState(0);

    const onSubmit = e => {
        e.preventDefault();
        if (
            enteralCaloriesValidator() &&
            parenteralCaloriesValidator() &&
            totalProteinValidator() &&
            prealbuminValidator() &&
            albuminValidator() &&
            serumTransferrinValidator() &&
            lymphocyteCountValidator() &&
            hemoglobinValidator() &&
            fastingGlucoseValidator() &&
            gastricRetentionValidator() &&
            injectionOfAlbuminValidator()
        ) {
            console.log('hello world');
        }
    };
    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit} onReset={() => {}}>
                <View className="at-row">
                    <View className="at-col at-col-9">
                        <Picker
                            mode="date"
                            value={recordtime}
                            onChange={v => setRecordTime(v.detail.value)}
                        >
                            <FormField name="记录时间" value={recordtime} />
                        </Picker>
                    </View>
                    <View className="at-col at-col-3" style="margin-top:2px">
                        <AtButton onClick={setToday} type="primary">
                            今天
                        </AtButton>
                    </View>
                </View>
                <Picker
                    mode="selector"
                    value={nasalFeedTubeType}
                    range={nasalFeedTubeTypes}
                    onChange={v => setNasalFeedTubeType(v.detail.value)}
                >
                    <FormField name="鼻饲管类型" value={nasalFeedTubeTypes[nasalFeedTubeType]} />
                </Picker>
                <AtInput
                    name="enteralCalories"
                    title="肠内热卡(kcal):"
                    placeholder="0-5000kcal"
                    type="text"
                    value={enteralCalories === 0 ? '' : enteralCalories.toString()}
                    onChange={v => setEnteralCalories(v)}
                />
                <AtInput
                    name="parenteralCalories"
                    title="肠外热卡(kcal):"
                    type="text"
                    placeholder="0-5000kcal"
                    value={parenteralCalories === 0 ? '' : parenteralCalories.toString()}
                    onChange={v => setParenteralCalories(v)}
                />
                <AtInput
                    name="totalProtein"
                    title="总蛋白(g):"
                    type="text"
                    placeholder="0-5000kcal"
                    value={totalProtein === 0 ? '' : totalProtein.toString()}
                    onChange={v => setTotalProtein(v)}
                />
                <AtInput
                    name="prealbumin"
                    title="前白蛋白(mg/L):"
                    placeholder="280-360"
                    type="text"
                    value={prealbumin === 0 ? '' : prealbumin.toString()}
                    onChange={v => setPrealbumin(v)}
                />
                <AtInput
                    name="albumin"
                    title="白蛋白(g):"
                    placeholder="30-60"
                    type="text"
                    value={albumin === 0 ? '' : albumin.toString()}
                    onChange={v => setAlbumin(v)}
                />
                <AtInput
                    name="serumTransfferin"
                    title="转铁蛋白(g):"
                    placeholder="30-60"
                    type="text"
                    value={serumTransferrin === 0 ? '' : serumTransferrin.toString()}
                    onChange={v => setSerumTransferrin(v)}
                />
                <AtInput
                    name="lymphocyteCount"
                    title="淋巴细胞计数:"
                    placeholder="300-600"
                    type="text"
                    value={lymphocyteCount === 0 ? '' : lymphocyteCount.toString()}
                    onChange={v => setLymphocyteCount(v)}
                />
                <AtInput
                    name="hemoglobin"
                    title="血红蛋白(g/l):"
                    placeholder="90-200"
                    type="text"
                    value={hemoglobin === 0 ? '' : hemoglobin.toString()}
                    onChange={v => setHemoglobin(v)}
                />
                <AtInput
                    name="fastingGlucose"
                    title="空腹血糖(mmol/L):"
                    type="text"
                    placeholder="3.9-11.1"
                    value={fastingGlucose === 0 ? '' : fastingGlucose.toString()}
                    onChange={v => setFastingGlucose(v)}
                />
                <AtInput
                    name="gastricRetention"
                    title="胃潴留(ml):"
                    placeholder="0-1000"
                    type="text"
                    value={gastricRetention === 0 ? '' : gastricRetention.toString()}
                    onChange={v => setGastricRetention(v)}
                />
                <AtInput
                    name="输白蛋白"
                    title="白蛋白(g):"
                    placeholder="0-20"
                    type="text"
                    value={injectionOfAlbumin === 0 ? '' : injectionOfAlbumin.toString()}
                    onChange={v => setInjectionOfAlbumin(v)}
                />
                <AtSwitch
                    title="误吸"
                    checked={misinhalation}
                    onChange={v => setMisinhalation(v)}
                />
                <AtSwitch title="腹泻" checked={diarrhea} onChange={v => setDiarrhea(v)} />
                <AtSwitch
                    title="消化道出血"
                    checked={gastrointestinalHemorrhage}
                    onChange={v => setGastrointestingHemorrhage(v)}
                />
                <Picker
                    mode="selector"
                    value={agiIndex}
                    range={AGIs}
                    onChange={v => setAgiIndex(v.detail.value)}
                >
                    <FormField name="AGI 评级" value={AGIs[agiIndex]} />
                </Picker>
                <AtButton type="primary" formType="submit">
                    提交
                </AtButton>
            </AtForm>
        </View>
    );
}

Form.options = {
    addGlobalClass: true,
};
