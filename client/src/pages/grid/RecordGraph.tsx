import Taro, { useEffect, useState, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { F2Canvas } from 'taro-f2';
import F2 from '@antv/f2';

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

    const [graph, setGraph] = useState(null);

    if (graph && patientRecords.length > 0) {
        graph.changeData(
            patientRecords.map((record) => ({
                time: record['recordtime'],
                value: record[map.get(selectors[currIndex]) || 'enteralCalories'],
            }))
        );
    }

    const initChart = useCallback(
        (canvas: any, width: number, height: number) => {
            console.log('initChart', width, height);
            const chart = new F2.Chart({
                el: canvas,
                width,
                height,
            });

            chart.source([], {
                time: { type: 'timeCat' },
                value: { tickCount: 4 },
            });
            chart.tooltip({
                showItemMarker: true,
                onShow({ items }) {
                    items[0].name = items[0].title;
                    items[0].value = items[0].value;
                },
            });
            chart.interval().position('time*value');
            chart.render();
            setGraph(chart);
        },
        [patient_id, patientRecords, currIndex]
    );

    return (
        <View className="index">
            <View style="width:100%;height:450px">
                <F2Canvas onInit={initChart}></F2Canvas>
            </View>
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
