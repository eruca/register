import Taro, { useState, useCallback, useEffect } from '@tarojs/taro';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { View, Picker } from '@tarojs/components';
import { AtForm, AtInput, AtSwitch, AtButton, AtMessage, AtIcon, AtFloatLayout } from 'taro-ui';

import { zeroRecord, IRecord } from '../../reducers/records';
import FormField from '../../components/FormField';
import { IReducers } from '../../reducers';
import { nasalFeedTubeTypes, AGIs, convertToLocal, validate, convertToIRecord } from './config';
import { recordsCollection } from '../../utils/db';
import { forceRerender } from '../../actions/user';
import EnteralNutritionTolerance from '../../components/EnteralNutritionTolerance';

const dispatch = useDispatch();

const onAddSuccess = function() {
    Taro.atMessage({ message: '添加记录成功', type: 'success' });
    dispatch(forceRerender());
};

const onModifySuccess = function() {
    Taro.atMessage({ message: '修改记录成功', type: 'success' });
    dispatch(forceRerender());
};

export default function Form() {
    const { record_id, patient_id, enrolltime, force_rerender } = useSelector(
        (state: IReducers) => ({
            record_id: state.records.record_id,
            force_rerender: state.user.force_rerender,
            ...state.patients,
        })
    );

    // 控制浮动层
    const [floatLay, setfloatLay] = useState(false);
    const [record, setRecord] = useState(convertToLocal(zeroRecord(patient_id)));
    useEffect(() => {
        console.log('ask for database: record_id:', record_id);
        if (record_id) {
            const promise = recordsCollection.doc(record_id).get();
            if (promise) {
                promise.then(res => {
                    console.log('get data from database', res.data);
                    setRecord(convertToLocal(res.data as IRecord));
                });
            }
        }
    }, [record_id, setRecord, force_rerender]);
    console.log(`${patient_id}. record`, record);

    const onSubmit = () => {
        const message = validate(record);
        if (message !== '') {
            Taro.atMessage({ message, type: 'error' });
            return;
        }
        if (record_id === '') {
            recordsCollection.add({
                data: convertToIRecord(record),
                success: onAddSuccess,
                fail: console.error,
            });
        } else {
            console.log('modify');
            recordsCollection.doc(record_id).set({
                data: convertToIRecord(record, false),
                success: onModifySuccess,
                fail: console.error,
            });
        }
    };

    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit}>
                <View className="at-row">
                    <View className="at-col at-col-9">
                        <Picker
                            mode="date"
                            value={record.recordtime}
                            onChange={useCallback(
                                v => setRecord({ ...record, recordtime: v.detail.value }),
                                [record, setRecord]
                            )}
                        >
                            <FormField
                                name="记录时间"
                                value={
                                    record.recordtime +
                                    ` (${dayjs(record.recordtime).diff(dayjs(enrolltime), 'day')})`
                                }
                            />
                        </Picker>
                    </View>
                    <View className="at-col at-col-3" style="margin-top:2px">
                        <AtButton
                            onClick={useCallback(
                                () =>
                                    setRecord({
                                        ...record,
                                        recordtime: dayjs().format('YYYY-MM-DD'),
                                    }),
                                [record, setRecord]
                            )}
                            type="primary"
                        >
                            今天
                        </AtButton>
                    </View>
                </View>
                <Picker
                    mode="selector"
                    value={record.nasalFeedTubeType}
                    range={nasalFeedTubeTypes}
                    onChange={useCallback(
                        v => setRecord({ ...record, nasalFeedTubeType: v.detail.value }),
                        [record, setRecord]
                    )}
                >
                    <FormField
                        name="鼻饲管类型"
                        value={nasalFeedTubeTypes[record.nasalFeedTubeType]}
                    />
                </Picker>
                <AtInput
                    name="enteralCalories"
                    title="肠内热卡(kcal):"
                    placeholder="0-5000kcal"
                    type="text"
                    value={
                        record.enteralCalories === '0' && record_id === ''
                            ? ''
                            : record.enteralCalories
                    }
                    onChange={useCallback(
                        (v: string) => setRecord({ ...record, enteralCalories: v }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="parenteralCalories"
                    title="肠外热卡(kcal):"
                    type="text"
                    placeholder="0-5000kcal"
                    value={
                        record.parenteralCalories === '0' && record_id === ''
                            ? ''
                            : record.parenteralCalories
                    }
                    onChange={useCallback(
                        (v: string) => setRecord({ ...record, parenteralCalories: v }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="totalProtein"
                    title="总蛋白(g):"
                    type="text"
                    placeholder="50-80"
                    value={
                        record.totalProtein === '0' && record_id === '' ? '' : record.totalProtein
                    }
                    onChange={useCallback(
                        v => setRecord({ ...record, totalProtein: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="prealbumin"
                    title="前白蛋白(mg/L):"
                    placeholder="170-420"
                    type="text"
                    value={record.prealbumin === '0' && record_id === '' ? '' : record.prealbumin}
                    onChange={useCallback(v => setRecord({ ...record, prealbumin: v as string }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtInput
                    name="albumin"
                    title="白蛋白(g):"
                    placeholder="30-50"
                    type="text"
                    value={record.albumin === '0' && record_id === '' ? '' : record.albumin}
                    onChange={useCallback(v => setRecord({ ...record, albumin: v as string }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtInput
                    name="serumTransfferin"
                    title="转铁蛋白(g):"
                    placeholder="30-60"
                    type="text"
                    value={
                        record.serumTransferrin === '0' && record_id === ''
                            ? ''
                            : record.serumTransferrin
                    }
                    onChange={useCallback(
                        v => setRecord({ ...record, serumTransferrin: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="lymphocyteCount"
                    title="淋巴细胞计数(10^9/L):"
                    placeholder="0-100"
                    type="text"
                    value={
                        record.lymphocyteCount === '0' && record_id === ''
                            ? ''
                            : record.lymphocyteCount
                    }
                    onChange={useCallback(
                        v => setRecord({ ...record, lymphocyteCount: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="hemoglobin"
                    title="血红蛋白(g/l):"
                    placeholder="90-200"
                    type="text"
                    value={record.hemoglobin === '0' && record_id === '' ? '' : record.hemoglobin}
                    onChange={useCallback(v => setRecord({ ...record, hemoglobin: v as string }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtInput
                    name="fastingGlucose"
                    title="空腹血糖(mmol/L):"
                    type="text"
                    placeholder="3.9-11.1"
                    value={
                        record.fastingGlucose === '0' && record_id === ''
                            ? ''
                            : record.fastingGlucose
                    }
                    onChange={useCallback(
                        v => setRecord({ ...record, fastingGlucose: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="gastricRetention"
                    title="胃潴留(ml):"
                    placeholder="0-1000"
                    type="text"
                    value={
                        record.gastricRetention === '0' && record_id === ''
                            ? ''
                            : record.gastricRetention
                    }
                    onChange={useCallback(
                        v => setRecord({ ...record, gastricRetention: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="injectionOfAlbumin"
                    title="输白蛋白(g):"
                    placeholder="0-60"
                    type="text"
                    value={
                        record.injectionOfAlbumin === '0' && record_id === ''
                            ? ''
                            : record.injectionOfAlbumin
                    }
                    onChange={useCallback(
                        v => setRecord({ ...record, injectionOfAlbumin: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtSwitch
                    title="误吸"
                    checked={record.misinhalation}
                    onChange={useCallback(v => setRecord({ ...record, misinhalation: v }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtSwitch
                    title="腹泻"
                    checked={record.diarrhea}
                    onChange={useCallback(v => setRecord({ ...record, diarrhea: v }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtSwitch
                    title="消化道出血"
                    checked={record.gastrointestinalHemorrhage}
                    onChange={useCallback(
                        v => setRecord({ ...record, gastrointestinalHemorrhage: v }),
                        [record, setRecord]
                    )}
                />
                <Picker
                    mode="selector"
                    value={record.agiIndex}
                    range={AGIs}
                    onChange={useCallback(v => setRecord({ ...record, agiIndex: v.detail.value }), [
                        record,
                        setRecord,
                    ])}
                >
                    <FormField name="AGI 评级" value={AGIs[record.agiIndex]} />
                </Picker>
                <View className="at-row at-row__align--center">
                    <View className="at-col at-col-10">
                        <AtInput
                            name="enteralNutritionToleranceScore"
                            title="耐受性评分:"
                            type="text"
                            placeholder="0~24"
                            value={
                                record.enteralNutritionToleranceScore === '0' && record_id === ''
                                    ? ''
                                    : record.enteralNutritionToleranceScore
                            }
                            onChange={useCallback(
                                (v: string) =>
                                    setRecord({ ...record, enteralNutritionToleranceScore: v }),
                                [record, setRecord]
                            )}
                        />
                    </View>
                    <View className="at-col at-col-2" style={{ marginRight: '5PX' }}>
                        <AtIcon
                            value="help"
                            size="30"
                            color="#F00"
                            onClick={() => setfloatLay(true)}
                        />
                    </View>
                </View>
                <AtButton type="primary" formType="submit">
                    {record_id === '' ? '提交' : '修改'}
                </AtButton>
            </AtForm>
            <AtFloatLayout
                isOpened={floatLay}
                title="肠内营养耐受性评分"
                onClose={() => setfloatLay(false)}
            >
                <EnteralNutritionTolerance />
            </AtFloatLayout>
        </View>
    );
}

Form.options = {
    addGlobalClass: true,
};

Form.config = {
    navigationBarTitleText: '记录',
};
