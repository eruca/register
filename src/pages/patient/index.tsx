import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useSelector } from '@tarojs/redux';
import { AtForm, AtInput, AtButton, AtSwitch, AtMessage } from 'taro-ui';

import { zeroPatient, IPatient } from '../../reducers/patient';
import FormField from '../../components/FormField';
import Loading from '../../components/Loading';
import { patientsCollection } from '../../utils/db';
import { IReducers } from '../../reducers';
import {
    selector,
    LocalPatient,
    convertToLocal,
    validate,
    convertToPatient,
    convertToPatientWithoutId,
} from './config';
import './index.scss';

export default function Patient() {
    const { patient_id } = useSelector((state: IReducers) => state.patients);
    const [patient, setPatient] = useState<LocalPatient>(convertToLocal(zeroPatient()));

    useEffect(() => {
        if (patient_id !== '') {
            const promise = patientsCollection.doc(patient_id).get();
            if (promise) {
                promise.then(res => setPatient(convertToLocal(res.data as IPatient)));
            }
        }
    }, [patient_id, setPatient]);
    console.log('patient =>', patient, 'patient_id', patient_id);

    const onSubmit = () => {
        const message = validate(patient);
        if (message !== '') {
            Taro.atMessage({ message, type: 'error' });
            return;
        }

        if (patient_id === '') {
            patientsCollection.add({
                data: convertToPatient(patient),
                success: function() {
                    Taro.atMessage({ message: '添加记录成功', type: 'success' });
                },
                fail: console.error,
            });
        } else {
            patientsCollection.doc(patient_id).set({
                data: convertToPatient(patient, false),
                success: function() {
                    Taro.atMessage({ message: '修改记录成功', type: 'success' });
                },
                fail: console.error,
            });
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
                    type="text"
                    autoFocus={true}
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
                    type="text"
                    placeholder="1-139"
                    value={patient.age}
                    onChange={useCallback((v: string) => setPatient({ ...patient, age: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="bed"
                    title="床号:"
                    type="text"
                    placeholder="1-100"
                    value={patient.bed}
                    onChange={useCallback((v: string) => setPatient({ ...patient, bed: v }), [
                        patient,
                        setPatient,
                    ])}
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
                    value={patient.height}
                    onChange={useCallback((v: string) => setPatient({ ...patient, height: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="weight"
                    title="体重(Kg):"
                    type="digit"
                    placeholder="30-300"
                    value={patient.weight}
                    onChange={useCallback((v: string) => setPatient({ ...patient, weight: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <Picker
                    mode="selector"
                    range={selector}
                    value={patient.diagnoseIndex}
                    onChange={useCallback(
                        e => setPatient({ ...patient, diagnoseIndex: e.detail.value }),
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
                <AtInput
                    name="apache2"
                    title="Apache II:"
                    type="text"
                    placeholder="0-71"
                    value={patient.apache2}
                    onChange={useCallback((v: string) => setPatient({ ...patient, apache2: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="agi"
                    title="AGI:"
                    type="text"
                    placeholder="0-4"
                    value={patient.agi}
                    onChange={useCallback((v: string) => setPatient({ ...patient, agi: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="nrs2002"
                    title="NRS2002:"
                    type="text"
                    placeholder="不能为空"
                    value={patient.nrs2002}
                    onChange={useCallback((v: string) => setPatient({ ...patient, nrs2002: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtButton type="primary" formType="submit">
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
        </View>
    );
}

Patient.config = {
    navigationBarTitleText: '登记内容',
};

Patient.options = {
    addGlobalClass: true,
};
