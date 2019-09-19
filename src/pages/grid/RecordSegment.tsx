import Taro, { useCallback, useEffect, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AtButton, AtGrid, AtDivider } from 'taro-ui';

import { selectRecord, deselectRecord } from '../../actions/records';
import { IReducers } from '../../reducers';
import { recordsCollection } from '../../utils/db';
import { IRecord } from '../../reducers/records';

export default function RecordSegment() {
    const dispatch = useDispatch();
    const { patient_id, _openid, user_openid, enrolltime, force_rerender } = useSelector(
        (state: IReducers) => ({
            ...state.patients,
            user_openid: state.user._openid,
            force_rerender: state.user.force_rerender,
        })
    );
    console.log('patient_id', patient_id, 'enrolltime', enrolltime);
    if (patient_id === '') {
        return <View>没有数据</View>;
    }

    const [patientRecords, setPatientRecords] = useState<Array<IRecord>>([]);
    useEffect(() => {
        console.log('ask for records, dependent one', force_rerender);
        recordsCollection
            .where({ patientid: patient_id })
            .orderBy('recordtime', 'asc')
            .get()
            .then(res => setPatientRecords(res.data as Array<IRecord>));
    }, [patient_id, setPatientRecords, force_rerender]);

    console.log('patientRecords ->', patientRecords);
    const gridValue =
        patientRecords.length > 0
            ? patientRecords.map(({ recordtime }) => ({
                  value: `第${dayjs(recordtime).diff(dayjs(enrolltime), 'day')}天`,
              }))
            : [];

    const gridOnClick = useCallback(
        (item, index) => {
            console.log('item', item, 'index', index, 'patientRecords', patientRecords);
            dispatch(selectRecord(patientRecords[index]._id || ''));
            Taro.navigateTo({
                url: '/pages/form/index',
            });
        },
        [patientRecords]
    );

    const newRecord = useCallback(() => {
        dispatch(deselectRecord());
        Taro.navigateTo({
            url: '/pages/form/index',
        });
    }, []);

    return (
        <View>
            <AtDivider content={`${gridValue.length > 0 ? '记录内容' : '没有内容'}`} />
            {gridValue.length > 0 && <AtGrid data={gridValue} onClick={gridOnClick} />}
            <AtDivider />
            <AtButton type="primary" onClick={newRecord} disabled={_openid !== user_openid}>
                进行记录
                <Text style="font-size:0.6em;color:yellow">
                    第{dayjs().diff(dayjs(enrolltime), 'day')}天
                </Text>
            </AtButton>
        </View>
    );
}
