import Taro, { useCallback, useEffect, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AtGrid, AtDivider, AtButton } from 'taro-ui';

import './index.scss';
import { indexOfPatientRecord } from '../../actions/records';
import { IReducers } from '../../reducers';
import { recordsCollection } from '../../utils/db';
import { IRecord } from '../../reducers/records';

const dispatch = useDispatch();

export default function Grid() {
    const { patient_id, enrolltime, hospId, name } = useSelector(
        (state: IReducers) => state.patients
    );
    console.log('patient_id', patient_id, 'enrolltime', enrolltime);
    if (patient_id === '') {
        return <View>没有数据</View>;
    }

    const [patientRecords, setPatientRecords] = useState<Array<IRecord>>([]);
    useEffect(() => {
        recordsCollection
            .where({ patientid: patient_id })
            .get()
            .then(res => setPatientRecords(res.data as Array<IRecord>));
    }, [patient_id, setPatientRecords]);

    const gridValue =
        patientRecords.length > 0
            ? patientRecords.map(({ recordtime }) => ({
                  value: `第${dayjs(recordtime).diff(dayjs(enrolltime), 'day')}天`,
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
            <View style="margin-bottom:5px">{`${hospId}-${name}: ${enrolltime}`}</View>
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
