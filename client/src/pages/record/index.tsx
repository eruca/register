import Taro, { useState, useCallback, useEffect, useRouter } from '@tarojs/taro';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { View, Picker } from '@tarojs/components';
import {
    AtForm,
    AtInput,
    AtSwitch,
    AtButton,
    AtMessage,
    AtIcon,
    AtFloatLayout,
    AtActionSheet,
    AtActionSheetItem,
} from 'taro-ui';

import { zeroRecord, IRecord, equalRecords } from '../../reducers/records';
import FormField from '../../components/FormField';
import { IReducers } from '../../reducers';
import { isCrew } from '../../reducers/user';
import { nasalFeedTubeTypes, AGIs } from './config';
import { validate } from './validator';
import { forceRerender } from '../../actions/user';
import EnteralNutritionTolerance from '../../components/EnteralNutritionTolerance';

// onChange: 如果输入时不规范，比如....，也可以强制改为0
const onChange = (setRecord, key, parse: (v3: string) => number) => (v: string) => {
    const v2 = parse(v);
    setRecord((record) => ({ ...record, [key]: Number.isNaN(v2) ? 0 : v2 }));
};

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
    // 是不是是新页，目的在于如果新建的话，不要显示0，而是空，从而显示placeholder
    const newOne = useRouter().params.new ? true : false;

    // 控制浮动层
    const [floatLay, setfloatLay] = useState(false);

    // 为了比较是否发生了改动，将finalRecord当做未变的数据，而record则一直在更新
    const rd = zeroRecord(patient_id);
    const [finalRecord, setFinalRecord] = useState(rd);
    const [record, setRecord] = useState(rd);

    useEffect(() => {
        console.log('ask for database: record_id:', record_id);
        if (isCrew(auth) && record_id) {
            Taro.cloud
                .database()
                .collection('records')
                .doc(record_id)
                .get({
                    success: (res) => {
                        const rd = Object.assign({}, zeroRecord(patient_id), res.data as IRecord);
                        setRecord(rd);
                        setFinalRecord(rd);
                    },
                    fail: console.error,
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
        if (!isCrew(auth)) {
            return;
        }
        if (disableSubmit === true) {
            return;
        }

        setDisableSubmit(true);
        if (record_id === '') {
            Taro.cloud
                .database()
                .collection('records')
                .add({
                    data: record,
                    success: function () {
                        Taro.atMessage({ message: '添加记录成功', type: 'success' });
                        setDisableSubmit(false);
                        Taro.redirectTo({ url: '/pages/grid/index' });
                        dispatch(forceRerender());
                    },
                    fail: function () {
                        console.error(arguments);
                        setDisableSubmit(false);
                    },
                });
        } else {
            console.log('modify', record);
            // 修正需要删除_id, _openid
            const { _openid, _id, ...data } = record;
            Taro.cloud
                .database()
                .collection('records')
                .doc(record_id)
                .set({
                    data,
                    success: function () {
                        Taro.atMessage({ message: '修改记录成功', type: 'success' });
                        Taro.redirectTo({ url: '/pages/grid/index' });
                        dispatch(forceRerender());
                    },
                    fail: function (e) {
                        console.error(e);
                        setDisableSubmit(false);
                    },
                });
        }
    }, [record, auth, record_id, disableSubmit, setDisableSubmit]);

    // 确认删除
    const [actionSheetOpen, setActionSheetOpen] = useState(false);
    const onSheetClose = () => setActionSheetOpen(false);

    const onDelete = () => {
        Taro.cloud
            .database()
            .collection('records')
            .doc(record_id)
            .remove({
                success: () => {
                    Taro.redirectTo({ url: '/pages/grid/index' });
                    dispatch(forceRerender());
                },
                fail: console.error,
            });
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
                            onChange={(v) => setRecord({ ...record, recordtime: v.detail.value })}
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
                            onClick={() =>
                                setRecord((rd) => ({
                                    ...rd,
                                    recordtime: dayjs().format('YYYY-MM-DD'),
                                }))
                            }
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
                    onChange={(v) =>
                        setRecord({
                            ...record,
                            nasalFeedTubeType:
                                typeof v.detail.value === 'number'
                                    ? v.detail.value
                                    : parseInt(v.detail.value, 10),
                        })
                    }
                >
                    <FormField
                        name="鼻饲管类型"
                        value={nasalFeedTubeTypes[record.nasalFeedTubeType]}
                    />
                </Picker>

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
                            name="enteralCalories"
                            title="肠内热卡(kcal):"
                            type="number"
                            clear={true}
                            placeholder="请输入肠内热卡"
                            value={newOne ? '' : record.enteralCalories.toString()}
                            onChange={onChange(setRecord, 'enteralCalories', parseInt)}
                        />
                    </View>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="30"
                            color="#79A4FA"
                            onClick={() =>
                                Taro.navigateTo({ url: '/pages/scores/nutrition/index' })
                            }
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
                            name="parenteralCalories"
                            title="肠外热卡(kcal):"
                            type="number"
                            clear={true}
                            placeholder="请输入肠外热卡"
                            value={newOne ? '' : record.parenteralCalories.toString()}
                            onChange={onChange(setRecord, 'parenteralCalories', parseInt)}
                        />
                    </View>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="30"
                            color="#79A4FA"
                            onClick={() =>
                                Taro.navigateTo({ url: '/pages/scores/nutrition/index' })
                            }
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
                            name="enteralProtein"
                            title="肠内蛋白(g):"
                            type="number"
                            placeholder="请输入肠内营养性蛋白"
                            clear={true}
                            value={newOne ? '' : record.enteralProtein.toString()}
                            onChange={onChange(setRecord, 'enteralProtein', parseInt)}
                        />
                    </View>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="30"
                            color="#79A4FA"
                            onClick={() =>
                                Taro.navigateTo({ url: '/pages/scores/nutrition/index' })
                            }
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
                            name="parenteralProtein"
                            title="肠外氨基酸(g):"
                            type="number"
                            placeholder="请输入肠外营养性氨基酸(g)"
                            clear={true}
                            value={newOne ? '' : record.parenteralProtein.toString()}
                            onChange={onChange(setRecord, 'parenteralProtein', parseInt)}
                        />
                    </View>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="30"
                            color="#79A4FA"
                            onClick={() =>
                                Taro.navigateTo({ url: '/pages/scores/nutrition/index' })
                            }
                        />
                    </View>
                </View>

                <AtInput
                    name="totalProtein"
                    title="总蛋白(g):"
                    clear={true}
                    type="digit"
                    placeholder="50-80"
                    value={newOne ? '' : record.totalProtein.toString()}
                    onChange={onChange(setRecord, 'totalProtein', parseInt)}
                />
                <AtInput
                    name="prealbumin"
                    title="前白蛋白(mg/L):"
                    clear={true}
                    placeholder="170-420"
                    type="digit"
                    value={newOne ? '' : record.prealbumin.toString()}
                    onChange={onChange(setRecord, 'prealbumin', parseInt)}
                />
                <AtInput
                    name="albumin"
                    title="白蛋白(g):"
                    clear={true}
                    placeholder="30-50"
                    type="digit"
                    value={newOne ? '' : record.albumin.toFixed(1)}
                    onChange={onChange(setRecord, 'albumin', parseFloat)}
                />
                <AtInput
                    name="serumTransfferin"
                    title="转铁蛋白(g/L):"
                    placeholder="1-10"
                    clear={true}
                    type="digit"
                    value={newOne ? '' : record.serumTransferrin.toFixed(1)}
                    onChange={onChange(setRecord, 'serumTransferrin', parseFloat)}
                />
                <AtInput
                    name="lymphocyteCount"
                    title="淋巴细胞计数(10^9/L):"
                    clear={true}
                    placeholder="0.8-4"
                    type="digit"
                    value={newOne ? '' : record.lymphocyteCount.toFixed(1)}
                    onChange={onChange(setRecord, 'lymphocyteCount', parseFloat)}
                />
                <AtInput
                    name="hemoglobin"
                    title="血红蛋白(g/l):"
                    clear={true}
                    placeholder="90-160"
                    type="number"
                    value={newOne ? '' : record.hemoglobin.toString()}
                    onChange={onChange(setRecord, 'hemoglobin', parseInt)}
                />
                <AtInput
                    name="fastingGlucose"
                    title="空腹血糖(mmol/L):"
                    clear={true}
                    type="digit"
                    placeholder="3.9-11.1"
                    value={newOne ? '' : record.fastingGlucose.toFixed(1)}
                    onChange={onChange(setRecord, 'fastingGlucose', parseFloat)}
                />
                <AtInput
                    name="gastricRetention"
                    title="胃潴留(ml):"
                    clear={true}
                    placeholder="0-1000"
                    type="number"
                    value={newOne ? '' : record.gastricRetention.toString()}
                    onChange={onChange(setRecord, 'gastricRetention', parseInt)}
                />
                <AtInput
                    name="injectionOfAlbumin"
                    title="输白蛋白(g):"
                    clear={true}
                    placeholder="0-60"
                    type="number"
                    value={newOne ? '' : record.injectionOfAlbumin.toString()}
                    onChange={onChange(setRecord, 'injectionOfAlbumin', parseInt)}
                />
                <AtSwitch
                    title="误吸"
                    checked={record.misinhalation}
                    onChange={(v) => setRecord({ ...record, misinhalation: v })}
                />
                <AtSwitch
                    title="腹泻"
                    checked={record.diarrhea}
                    onChange={(v) => setRecord({ ...record, diarrhea: v })}
                />
                <AtSwitch
                    title="消化道出血"
                    checked={record.gastrointestinalHemorrhage}
                    onChange={(v) => setRecord({ ...record, gastrointestinalHemorrhage: v })}
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
                        onChange={(v) =>
                            setRecord({
                                ...record,
                                agiIndex:
                                    typeof v.detail.value === 'number'
                                        ? v.detail.value
                                        : parseInt(v.detail.value, 10),
                            })
                        }
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
                            value={record.enteralNutritionToleranceScore.toString()}
                            onChange={(v: string) =>
                                setRecord({
                                    ...record,
                                    enteralNutritionToleranceScore: parseInt(v, 10),
                                })
                            }
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
                        ((_openid !== record._openid || equalRecords(record, finalRecord)) &&
                            record_id !== '')
                    }
                >
                    {record_id === '' ? '提交' : '修改'}
                </AtButton>
                <AtButton
                    type="primary"
                    customStyle={{ backgroundColor: 'red', marginTop: '5rpx' }}
                    disabled={newOne || _openid !== record._openid}
                    onClick={() => setActionSheetOpen(true)}
                >
                    删除
                </AtButton>
            </AtForm>
            <AtFloatLayout
                isOpened={floatLay}
                title="肠内营养耐受性评分"
                onClose={() => setfloatLay(false)}
            >
                <EnteralNutritionTolerance />
            </AtFloatLayout>

            <AtActionSheet
                isOpened={actionSheetOpen}
                title="将删除该条记录？"
                cancelText="取消"
                onCancel={onSheetClose}
                onClose={onSheetClose}
            >
                <AtActionSheetItem onClick={() => onDelete()}>确认删除</AtActionSheetItem>
            </AtActionSheet>
        </View>
    );
}

Form.config = {
    navigationBarTitleText: '记录',
};
