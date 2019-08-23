import Taro, { useCallback, useEffect, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AtGrid, AtDivider, AtButton } from 'taro-ui';

import { selectRecord, deselectRecord } from '../../actions/records';
import { IReducers } from '../../reducers';
import { recordsCollection } from '../../utils/db';
import { IRecord } from '../../reducers/records';
import './index.scss';

const dispatch = useDispatch();

export default function Grid() {
    const { patient_id, enrolltime, hospId, name, force_render_count } = useSelector(
        (state: IReducers) => ({
            ...state.patients,
            force_render_count: state.records.force_render_count,
        })
    );
    console.log('patient_id', patient_id, 'enrolltime', enrolltime);
    if (patient_id === '') {
        return <View>没有数据</View>;
    }

    const [patientRecords, setPatientRecords] = useState<Array<IRecord>>([]);
    useEffect(() => {
        console.log('ask for records, dependent one', force_render_count);
        recordsCollection
            .where({ patientid: patient_id })
            .orderBy('recordtime', 'asc')
            .get()
            .then(res => setPatientRecords(res.data as Array<IRecord>));
    }, [patient_id, setPatientRecords, force_render_count]);

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
            <View style="margin-bottom:5px">{`${hospId}-${name}: ${enrolltime}`}</View>
            <AtButton type="primary" onClick={newRecord}>
                进行记录
                <Text style="font-size:0.6em;color:#7e6148">
                    第{dayjs().diff(dayjs(enrolltime), 'day')}天
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
