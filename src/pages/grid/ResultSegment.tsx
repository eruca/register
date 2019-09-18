import Taro, { useState, useCallback, useEffect } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtForm, AtInput, AtSwitch, AtButton, AtMessage } from 'taro-ui';
import { useSelector } from '@tarojs/redux';

import FormField from '../../components/FormField';
import { IReducers } from '../../reducers';
import { IPatient, zeroPatient, deleteId } from '../../reducers/patient';
import { patientsCollection } from '../../utils/db';
import { LocalPatient, convertToLocal, convertToPatient, validate } from '../patient/config';

const selectors = [
    '好转至普通病房',
    '转至其他ICU',
    '自动出院(非病情恶化)',
    '死亡(含病情恶化的自动出院)',
];

export default function ResultSegment() {
    const { patient_id, user_openid, patient_openid } = useSelector((state: IReducers) => ({
        patient_id: state.patients.patient_id,
        user_openid: state.user._openid,
        patient_openid: state.patients._openid,
    }));
    const [patient, setPatient] = useState<LocalPatient>(convertToLocal(zeroPatient()));

    useEffect(() => {
        if (patient_id) {
            const promise = patientsCollection.doc(patient_id).get();
            if (promise) {
                console.log('patient_id', patient_id);
                promise.then(res => setPatient(convertToLocal(res.data as IPatient)));
            }
        }
    }, [patient_id, setPatient]);

    console.log('patient_id', patient_id);
    console.table(patient);
    const onSubmit = () => {
        if (patient_id === '') {
            throw new Error('不可能为空');
        }

        console.log('patient in submit');
        console.table(patient);
        const message = validate(patient);
        if (message !== '') {
            Taro.atMessage({ message, type: 'error' });
            return;
        }

        patientsCollection.doc(patient_id).set({
            data: deleteId(convertToPatient(patient)),
            success: function() {
                Taro.atMessage({ message: '更新结局成功', type: 'success' });
            },
            fail: console.error,
        });
    };

    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={useCallback(onSubmit, [patient_id, patient])}>
                <AtInput
                    type="number"
                    title="机械通气时间(天):"
                    name="venttime"
                    value={patient.venttime}
                    onChange={useCallback((v: string) => setPatient({ ...patient, venttime: v }), [
                        patient,
                        setPatient,
                    ])}
                    disabled = {patient_openid !== user_openid}
                />
                <AtInput
                    type="number"
                    title="ICU住院时间(天):"
                    name="stayoficu"
                    value={patient.stayoficu}
                    onChange={useCallback((v: string) => setPatient({ ...patient, stayoficu: v }), [
                        patient,
                        setPatient,
                    ])}
                    disabled = {patient_openid !== user_openid}
                />
                <Picker
                    mode="selector"
                    range={selectors}
                    value={patient.resultIndex}
                    onChange={useCallback(
                        e => setPatient({ ...patient, resultIndex: parseInt(e.detail.value, 10) }),
                        [patient, setPatient]
                    )}
                    disabled = {patient_openid !== user_openid}
                >
                    <FormField name="入组时间" value={selectors[patient.resultIndex]} />
                </Picker>
                <AtSwitch
                    title="出院时是否存活"
                    checked={patient.isAliveDischarge}
                    onChange={useCallback(v => setPatient({ ...patient, isAliveDischarge: v }), [
                        setPatient,
                        patient,
                    ])}
                    disabled = {patient_openid !== user_openid}
                />
                <AtButton type="primary" formType="submit" disabled={patient_openid != user_openid}>
                    提交
                </AtButton>
            </AtForm>
        </View>
    );
}
