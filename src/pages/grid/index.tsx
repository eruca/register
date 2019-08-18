import Taro, { useCallback } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AtGrid, AtDivider, AtButton } from 'taro-ui';

import './index.scss';
import { indexOfPatientRecord } from '../../actions/records';
import { IReducers } from '../../reducers';

const dispatch = useDispatch();

export default function Grid() {
    const { records, patientid, patient_enrolltime } = useSelector((state: IReducers) => {
        const { data, index } = state.patients;
        if (index === undefined) {
            console.log('index 是undefined');
            return { records: state.records };
        }

        return {
            records: state.records,
            patientid: data[index].rowid,
            patient_enrolltime: data[index].enrolltime,
        };
    });

    const patient_records = records.data.filter(record => record.patientid === patientid);
    const gridValue =
        patient_records.length > 0
            ? patient_records.map(({ recordtime }) => ({
                  value: `第${dayjs(recordtime).diff(dayjs(patient_enrolltime), 'day')}天`,
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
            <View style="margin-bottom:5px">入组时间: {patient_enrolltime}</View>
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
                    第{dayjs().diff(dayjs(patient_enrolltime), 'day')}天
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
