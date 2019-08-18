import Taro, { useCallback } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AtGrid, AtDivider, AtButton } from 'taro-ui';

import './index.scss';
import { indexOfPatientRecord } from '../../actions/records';
import { IReducers } from '../../reducers';
import db from '../../utils/db';
import { IPatient, zeroPatient } from '../../reducers/patient';
import { IRecord } from '../../reducers/records';

const dispatch = useDispatch();

export default function Grid() {
    const { patient_id } = useSelector((state: IReducers) => {
        return {
            patient_id: state.patients.index,
        };
    });
    console.log('patient_id', typeof patient_id, patient_id === '');
    if (patient_id === '') {
        return <View>没有数据</View>;
    }

    let patient: IPatient = zeroPatient();
    const future = db.collection('patients').get();
    if (future === undefined) {
        console.log('patient === undefined');
        return <View>没有该数据</View>;
    } else {
        future.then(res => {
            const data = res.data as Array<IPatient>;
            if (data.length === 1) {
                patient = data[0];
            }
        });
    }

    let records: Array<IRecord> = [];
    db.collection('records')
        .where({ patientid: patient_id })
        .get()
        .then(res => (records = res.data as Array<IRecord>));

    const gridValue =
        records.length > 0
            ? records.map(({ recordtime }) => ({
                  value: `第${dayjs(recordtime).diff(dayjs(patient.enrolltime), 'day')}天`,
              }))
            : [];

    const gridOnClick = useCallback((item, index) => {
        console.log('item', item, 'index', index);
        dispatch(indexOfPatientRecord(index));
        Taro.navigateTo({
            url: '/pages/form/index',
        });
    }, []);

    return (
        <View>
            <View style="margin-bottom:5px">入组时间: {patient.enrolltime}</View>
            <AtButton
                type="primary"
                onClick={() =>
                    Taro.navigateTo({
                        url: '/pages/form/index',
                    })
                }
            >
                进行记录
                <Text style="font-size:0.6em;color:#7e6148">
                    第{dayjs().diff(dayjs(patient.enrolltime), 'day')}天
                </Text>
            </AtButton>
            <AtDivider content={`${gridValue.length > 0 ? '记录内容' : '没有内容'}`} />
            {gridValue.length > 0 && <AtGrid data={gridValue} onClick={gridOnClick} />}
        </View>
    );
}

Grid.config = {
    navigationBarTitleText: '日期',
};

// Grid.options = {
//     addGlobalClass: true,
// };
