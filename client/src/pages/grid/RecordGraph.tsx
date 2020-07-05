import Taro, { useEffect, useState } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';

import Line, { LineValueType } from '../../components/F2Graph/line';
import { useSelector } from '@tarojs/redux';
import { IReducers } from 'src/reducers';
import { IRecord } from '../../reducers/records';

const selectors: string[] = [
    '肠内热卡',
    '肠外热卡',
    '总蛋白',
    '前白蛋白',
    '白蛋白',
    '转铁蛋白',
    '淋巴细胞计数',
    '血红蛋白',
    '空腹血糖',
    'AGI',
    '耐受性评分',
];

const map = new Map([
    ['肠内热卡', 'enteralCalories'],
    ['肠外热卡', 'parenteralCalories'],
    ['总蛋白', 'totalProtein'],
    ['前白蛋白', 'prealbumin'],
    ['白蛋白', 'albumin'],
    ['转铁蛋白', 'serumTransferrin'],
    ['淋巴细胞计数', 'lymphocyteCount'],
    ['血红蛋白', 'hemoglobin'],
    ['空腹血糖', 'fastingGlucose'],
    ['AGI', 'agiIndex'],
    ['耐受性评分', 'enteralNutritionToleranceScore'],
]);

export default function RecordGraph() {
    const { patient_id, force_rerender } = useSelector((state: IReducers) => ({
        patient_id: state.patients.patient_id,
        force_rerender: state.user.force_rerender,
    }));

    const [patientRecords, setPatientRecords] = useState<Array<IRecord>>([]);
    useEffect(() => {
        console.log('ask for records, dependent one', force_rerender);
        Taro.cloud
            .database()
            .collection('records')
            .where({ patientid: patient_id })
            .orderBy('recordtime', 'asc')
            .get()
            .then((res) => {
                console.log('get data', res);
                setPatientRecords(res.data as Array<IRecord>);
            });
    }, [patient_id, setPatientRecords, force_rerender]);

    // Picker的value
    const [currIndex, setCurrIndex] = useState(0);

    const data: LineValueType[] = patientRecords.map((record: IRecord) => ({
        date: record['recordtime'],
        value: record[map.get(selectors[currIndex]) || 'enteralCalories'],
    }));

    return (
        <View className="index">
            {Array.isArray(data) && data.length > 0 ? (
                <Line data={data} />
            ) : (
                <View
                    style={{
                        height: '600rpx',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    暂无数据
                </View>
            )}
            <View>
                <Picker
                    mode="selector"
                    range={selectors}
                    value={currIndex}
                    onChange={(e) =>
                        setCurrIndex(
                            typeof e.detail.value === 'number'
                                ? e.detail.value
                                : parseInt(e.detail.value, 10)
                        )
                    }
                >
                    <AtList>
                        <AtListItem title="请选择展示内容" extraText={selectors[currIndex]} />
                    </AtList>
                </Picker>
            </View>
        </View>
    );
}
