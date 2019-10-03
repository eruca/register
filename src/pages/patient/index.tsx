import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AtForm, AtInput, AtButton, AtSwitch, AtMessage, AtIcon, AtFloatLayout } from 'taro-ui';

import { zeroPatient, IPatient } from '../../reducers/patient';
import FormField from '../../components/FormField';
import NRS2002 from '../../components/NRS2002';
import Loading from '../../components/Loading';
import EnteralNutritionTolerance from '../../components/EnteralNutritionTolerance';
import { patientsCollection } from '../../utils/db';
import { IReducers } from '../../reducers';
import { isCrew } from '../../reducers/user';
import { forceRerender } from '../../actions/user';
import { selector, LocalPatient, convertToLocal, convertToPatient, equal } from './config';
import { validate } from './validator';
import './index.scss';

export default function Patient() {
    const dispatch = useDispatch();
    const { patient_id, _openid, auth, force_rerender } = useSelector((state: IReducers) => ({
        ...state.patients,
        _openid: state.user._openid,
        force_rerender: state.user.force_rerender,
        auth: state.user.authority,
    }));

    // 作为从数据库下载下来的数据
    const [finalPatient, setFinalPatient] = useState<LocalPatient>(convertToLocal(zeroPatient()));
    const [patient, setPatient] = useState<LocalPatient>(convertToLocal(zeroPatient()));
    // 现在有2个浮层，用0 => 关闭， 1 => NRS2002, 2 => EnteralNutritionTolenance
    const [floatLay, setFloatLay] = useState(0);

    // 如果patient_id已被选择，就从数据库获取该patient数据
    useEffect(() => {
        if (isCrew(auth) && patient_id !== '') {
            const promise = patientsCollection.doc(patient_id).get();
            if (promise) {
                promise.then(res => {
                    setPatient(convertToLocal(res.data as IPatient));
                    setFinalPatient(convertToLocal(res.data as IPatient));
                });
            }
        }
    }, [patient_id, auth, force_rerender, setPatient, setFinalPatient]);
    console.log('patient =>', patient, 'patient_id', patient_id);

    const onSubmit = () => {
        const message = validate(patient);
        if (message !== '') {
            Taro.atMessage({ message, type: 'error' });
            return;
        }

        if (isCrew(auth)) {
            if (patient_id === '') {
                patientsCollection.add({
                    data: convertToPatient(patient),
                    success: function() {
                        Taro.atMessage({ message: '添加记录成功', type: 'success' });
                        // 添加成功，则再次从数据库获取统计信息
                        dispatch(forceRerender());
                        setTimeout(() => Taro.navigateBack(), 1000);
                    },
                    fail: console.error,
                });
            } else {
                patientsCollection.doc(patient_id).set({
                    data: convertToPatient(patient, false),
                    success: function() {
                        Taro.atMessage({ message: '修改记录成功', type: 'success' });
                        // 修改成功，则再次从数据库获取统计信息
                        dispatch(forceRerender());
                        setTimeout(() => Taro.navigateBack(), 1000);
                    },
                    fail: console.error,
                });
            }
        }
    };

    // 如果是已经有patient_id, 但是这个时候网络断了，那么就会出现这种情况
    return patient_id !== '' && !patient._id ? (
        <Loading />
    ) : (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit}>
                <AtInput
                    name="hospId"
                    title="病案号:"
                    type="number"
                    value={patient.hospId}
                    onChange={useCallback((v: string) => setPatient({ ...patient, hospId: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="name"
                    title="姓名:"
                    type="text"
                    value={patient.name}
                    onChange={useCallback((v: string) => setPatient({ ...patient, name: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title={`性别(${patient.isMale ? '男' : '女'}): `}
                    checked={patient.isMale}
                    onChange={useCallback(v => setPatient({ ...patient, isMale: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="age"
                    title="年龄(岁):"
                    type="number"
                    placeholder="1-139"
                    value={patient.age === '0' && patient_id === '' ? '' : patient.age}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, age: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <AtInput
                    name="bed"
                    title="床号:"
                    type="number"
                    placeholder="1-100"
                    value={patient.bed === '0' && patient_id === '' ? '' : patient.bed}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, bed: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <Picker
                    mode="date"
                    value={patient.admittime}
                    onChange={useCallback(
                        e => setPatient({ ...patient, admittime: e.detail.value }),
                        [patient, setPatient]
                    )}
                >
                    <FormField name="入院时间" value={patient.admittime} />
                </Picker>
                <Picker
                    mode="date"
                    value={patient.enrolltime}
                    onChange={useCallback(
                        e => setPatient({ ...patient, enrolltime: e.detail.value }),
                        [patient, setPatient]
                    )}
                >
                    <FormField name="入组时间" value={patient.enrolltime} />
                </Picker>
                <AtInput
                    name="height"
                    title="身高(cm):"
                    type="number"
                    placeholder="100-250"
                    value={patient.height === '0' && patient_id === '' ? '' : patient.height}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, height: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <AtInput
                    name="weight"
                    title="体重(Kg):"
                    type="number"
                    placeholder="30-300"
                    value={patient.weight === '0' && patient_id === '' ? '' : patient.weight}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, weight: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <Picker
                    mode="selector"
                    range={selector}
                    value={patient.diagnoseIndex}
                    onChange={useCallback(
                        e =>
                            setPatient({ ...patient, diagnoseIndex: parseInt(e.detail.value, 10) }),
                        [patient, setPatient]
                    )}
                >
                    <FormField name="主要诊断" value={selector[patient.diagnoseIndex]} />
                </Picker>
                <AtSwitch
                    title="需要升压药"
                    checked={patient.needVesopressor}
                    onChange={useCallback(v => setPatient({ ...patient, needVesopressor: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title="需要机械通气"
                    checked={patient.needVentilation}
                    onChange={useCallback(v => setPatient({ ...patient, needVentilation: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title="使用短肽"
                    checked={patient.useSmallPeptide}
                    onChange={useCallback(v => setPatient({ ...patient, useSmallPeptide: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="apache2"
                    title="Apache II:"
                    type="number"
                    placeholder="0-71"
                    value={patient.apache2 === '0' && patient_id === '' ? '' : patient.apache2}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, apache2: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <AtInput
                    name="agi"
                    title="AGI:"
                    type="number"
                    placeholder="0-4"
                    value={patient.agi === '0' && patient_id === '' ? '' : patient.agi}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, agi: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <View className="at-row at-row__align--center">
                    <View className="at-col at-col-10">
                        <AtInput
                            name="nrs2002"
                            title="NRS2002:"
                            type="number"
                            placeholder="0-23"
                            value={
                                patient.nrs2002 === '0' && patient_id === '' ? '' : patient.nrs2002
                            }
                            onChange={useCallback(
                                (v: string) => setPatient({ ...patient, nrs2002: v ? v : '0' }),
                                [patient, setPatient]
                            )}
                        />
                    </View>
                    <View className="at-col at-col-2" style={{ marginRight: '5PX' }}>
                        <AtIcon
                            value="help"
                            size="30"
                            color="#F00"
                            onClick={() => setFloatLay(1)}
                        />
                    </View>
                </View>
                <View className="at-row at-row__align--center">
                    <View className="at-col at-col-10">
                        <AtInput
                            name="enteralNutritionToleranceScore"
                            title="耐受性评分:"
                            type="number"
                            placeholder="0~24"
                            value={
                                patient.enteralNutritionToleranceScore === '0' && patient_id === ''
                                    ? ''
                                    : patient.enteralNutritionToleranceScore
                            }
                            onChange={useCallback(
                                (v: string) =>
                                    setPatient({
                                        ...patient,
                                        enteralNutritionToleranceScore: v ? v : '0',
                                    }),
                                [patient, setPatient]
                            )}
                        />
                    </View>
                    <View className="at-col at-col-2" style={{ marginRight: '5PX' }}>
                        <AtIcon
                            value="help"
                            size="30"
                            color="#F00"
                            onClick={() => setFloatLay(2)}
                        />
                    </View>
                </View>

                <AtButton
                    type="primary"
                    formType="submit"
                    disabled={
                        (_openid !== patient._openid || equal(patient, finalPatient)) && // 不是本人的或者没有更改的
                        patient_id !== '' // 新增的
                    }
                >
                    {patient_id === '' ? '提交' : '修改'}
                </AtButton>
                {patient_id !== '' && (
                    <AtButton
                        type="primary"
                        className="margin-top-1px"
                        onClick={() => Taro.navigateTo({ url: '/pages/grid/index' })}
                    >
                        进入项目
                    </AtButton>
                )}
            </AtForm>
            <AtFloatLayout
                isOpened={!!floatLay}
                title="营养风险筛查NRS2002"
                onClose={() => setFloatLay(0)}
            >
                {floatLay === 1 && <NRS2002 />}
                {floatLay === 2 && <EnteralNutritionTolerance />}
            </AtFloatLayout>
        </View>
    );
}

Patient.config = {
    navigationBarTitleText: '登记病人',
};

Patient.options = {
    addGlobalClass: true,
};
