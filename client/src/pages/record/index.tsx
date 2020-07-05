import Taro, { useState, useCallback, useEffect } from '@tarojs/taro';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { View, Picker } from '@tarojs/components';
import { AtForm, AtInput, AtSwitch, AtButton, AtMessage, AtIcon, AtFloatLayout } from 'taro-ui';

import { zeroRecord, IRecord } from '../../reducers/records';
import FormField from '../../components/FormField';
import { IReducers } from '../../reducers';
import { isCrew } from '../../reducers/user';
import { nasalFeedTubeTypes, AGIs, convertToLocal, convertToIRecord, equal } from './config';
import { validate } from './validator';
import { forceRerender } from '../../actions/user';
import EnteralNutritionTolerance from '../../components/EnteralNutritionTolerance';

export default function Form() {
    const dispatch = useDispatch();
    const { record_id, force_rerender, auth, _openid, patient_id, enrolltime } = useSelector(
        (state: IReducers) => ({
            record_id: state.records.record_id,
            force_rerender: state.user.force_rerender,
            auth: state.user.authority,
            _openid: state.user._openid,
            patient_id: state.patients.patient_id,
            enrolltime: state.patients.enrolltime,
        })
    );

    // 控制浮动层
    const [floatLay, setfloatLay] = useState(false);

    const [finalRecord, setFinalRecord] = useState(convertToLocal(zeroRecord(patient_id)));
    const [record, setRecord] = useState(convertToLocal(zeroRecord(patient_id)));

    useEffect(() => {
        console.log('ask for database: record_id:', record_id);
        if (isCrew(auth) && record_id) {
            Taro.cloud
                .database()
                .collection('records')
                .doc(record_id)
                .get({
                    success: (res) => {
                        console.log('get data from database', res.data);
                        setRecord(convertToLocal(res.data as IRecord));
                        setFinalRecord(convertToLocal(res.data as IRecord));
                    },
                });
        }
    }, [record_id, auth, setRecord, force_rerender]);
    console.log(`${patient_id}. record`, record);

    // disable submit
    const [disableSubmit, setDisableSubmit] = useState(false);

    const onSubmit = useCallback(() => {
        const message = validate(record);
        if (message !== '') {
            Taro.atMessage({ message, type: 'error' });
            return;
        }

        setDisableSubmit(true);
        if (isCrew(auth)) {
            if (record_id === '') {
                Taro.cloud
                    .database()
                    .collection('records')
                    .add({
                        data: convertToIRecord(record),
                        success: function () {
                            Taro.atMessage({ message: '添加记录成功', type: 'success' });
                            dispatch(forceRerender());
                        },
                        fail: console.error,
                    });
            } else {
                console.log('modify');
                Taro.cloud
                    .database()
                    .collection('records')
                    .doc(record_id)
                    .set({
                        data: convertToIRecord(record, false),
                        success: function () {
                            Taro.atMessage({ message: '修改记录成功', type: 'success' });
                            dispatch(forceRerender());
                        },
                        fail: console.error,
                    });
            }
        }
    }, [record, auth, record_id, setDisableSubmit]);

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
                                (v) => setRecord({ ...record, recordtime: v.detail.value }),
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
                        (v) =>
                            setRecord({
                                ...record,
                                nasalFeedTubeType:
                                    typeof v.detail.value === 'number'
                                        ? v.detail.value
                                        : parseInt(v.detail.value, 10),
                            }),
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
                    type="number"
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
                    type="number"
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
                    type="digit"
                    placeholder="50-80"
                    value={
                        record.totalProtein === '0' && record_id === '' ? '' : record.totalProtein
                    }
                    onChange={useCallback(
                        (v) => setRecord({ ...record, totalProtein: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="prealbumin"
                    title="前白蛋白(mg/L):"
                    placeholder="170-420"
                    type="digit"
                    value={record.prealbumin === '0' && record_id === '' ? '' : record.prealbumin}
                    onChange={useCallback(
                        (v) => setRecord({ ...record, prealbumin: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="albumin"
                    title="白蛋白(g):"
                    placeholder="30-50"
                    type="digit"
                    value={record.albumin === '0' && record_id === '' ? '' : record.albumin}
                    onChange={useCallback((v) => setRecord({ ...record, albumin: v as string }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtInput
                    name="serumTransfferin"
                    title="转铁蛋白(g):"
                    placeholder="1-10"
                    type="digit"
                    value={
                        record.serumTransferrin === '0' && record_id === ''
                            ? ''
                            : record.serumTransferrin
                    }
                    onChange={useCallback(
                        (v) => setRecord({ ...record, serumTransferrin: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="lymphocyteCount"
                    title="淋巴细胞计数(10^9/L):"
                    placeholder="0.8-4"
                    type="digit"
                    value={
                        record.lymphocyteCount === '0' && record_id === ''
                            ? ''
                            : record.lymphocyteCount
                    }
                    onChange={useCallback(
                        (v) => setRecord({ ...record, lymphocyteCount: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="hemoglobin"
                    title="血红蛋白(g/l):"
                    placeholder="90-160"
                    type="number"
                    value={record.hemoglobin === '0' && record_id === '' ? '' : record.hemoglobin}
                    onChange={useCallback(
                        (v) => setRecord({ ...record, hemoglobin: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="fastingGlucose"
                    title="空腹血糖(mmol/L):"
                    type="digit"
                    placeholder="3.9-11.1"
                    value={
                        record.fastingGlucose === '0' && record_id === ''
                            ? ''
                            : record.fastingGlucose
                    }
                    onChange={useCallback(
                        (v) => setRecord({ ...record, fastingGlucose: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="gastricRetention"
                    title="胃潴留(ml):"
                    placeholder="0-1000"
                    type="number"
                    value={
                        record.gastricRetention === '0' && record_id === ''
                            ? ''
                            : record.gastricRetention
                    }
                    onChange={useCallback(
                        (v) => setRecord({ ...record, gastricRetention: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtInput
                    name="injectionOfAlbumin"
                    title="输白蛋白(g):"
                    placeholder="0-60"
                    type="number"
                    value={
                        record.injectionOfAlbumin === '0' && record_id === ''
                            ? ''
                            : record.injectionOfAlbumin
                    }
                    onChange={useCallback(
                        (v) => setRecord({ ...record, injectionOfAlbumin: v as string }),
                        [record, setRecord]
                    )}
                />
                <AtSwitch
                    title="误吸"
                    checked={record.misinhalation}
                    onChange={useCallback((v) => setRecord({ ...record, misinhalation: v }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtSwitch
                    title="腹泻"
                    checked={record.diarrhea}
                    onChange={useCallback((v) => setRecord({ ...record, diarrhea: v }), [
                        record,
                        setRecord,
                    ])}
                />
                <AtSwitch
                    title="消化道出血"
                    checked={record.gastrointestinalHemorrhage}
                    onChange={useCallback(
                        (v) => setRecord({ ...record, gastrointestinalHemorrhage: v }),
                        [record, setRecord]
                    )}
                />
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Picker
                        mode="selector"
                        range={AGIs}
                        style={{ flexGrow: 1 }}
                        value={record.agiIndex}
                        onChange={useCallback(
                            (v) =>
                                setRecord({
                                    ...record,
                                    agiIndex:
                                        typeof v.detail.value === 'number'
                                            ? v.detail.value
                                            : parseInt(v.detail.value, 10),
                                }),
                            [record, setRecord]
                        )}
                    >
                        <FormField name="AGI 评级" value={AGIs[record.agiIndex]} />
                    </Picker>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="25"
                            color="#79A4FA"
                            onClick={() => Taro.navigateTo({ url: '/pages/assess/agi/index' })}
                        />
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexGrow: 1 }}>
                        <AtInput
                            name="enteralNutritionToleranceScore"
                            title="耐受性评分:"
                            type="number"
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
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="help"
                            size="30"
                            color="#F00"
                            onClick={() => setfloatLay(true)}
                        />
                    </View>
                </View>
                <AtButton
                    type="primary"
                    formType="submit"
                    disabled={
                        disableSubmit ||
                        ((_openid !== record._openid || equal(record, finalRecord)) &&
                            record_id !== '')
                    }
                >
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

Form.config = {
    navigationBarTitleText: '记录',
};
