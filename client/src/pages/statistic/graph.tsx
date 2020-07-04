import Taro, { useEffect, useState, useMemo } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtList, AtListItem, AtMessage } from 'taro-ui';

import { useSelector } from '@tarojs/redux';
import { IReducers } from 'src/reducers';
import { ListType } from 'src/reducers/user';
import Hist, { HistDataType } from '../../components/F2Graph/hist';
import Pie, { PieDataType } from '../../components/F2Graph/pie';

type RequestParams = {
    listType: ListType;
    query: string[];
    table: string;
    drawstyle: string;
    params: string;
};

const selectors: string[] = [
    '性别',
    '年龄',
    'apache2',
    'agi',
    '存活出院',
    '机械通气',
    '升压药',
    'nrs2002',
    'ICU住院时长',
    '机械通气时间',

    '前白蛋白',
    '白蛋白',
    '腹泻',
    '肠内能量',
    '肠外能量',
    '空腹血糖',
    '胃潴留',
    '消化道出血',
    '血红蛋白',
    '淋巴细胞计数',
    '误吸',
    '转铁蛋白',
    '总蛋白',
];

// Todo 需要与输入验证相结合
// query:table:drawstyle:params => [query]:table:drawstyle:params
const map = new Map([
    ['性别', 'isMale:patients:pie:女,男'],
    ['年龄', 'age:patients:hist:0,10,20,30,40,50,60,70,80,90,100,110,120'],
    ['agi', 'agi:patients:pie:1,2,3,4'],
    ['apache2', 'apache2:patients:hist:0,10,20,30,40,50,60,70,80'],
    ['存活出院', 'isAliveDischarge:patients:pie:死亡,存活'],
    ['机械通气', 'needVentilation:patients:pie:无,有'],
    ['升压药', 'needVesopressor:patients:pie:无,有'],
    ['nrs2002', 'nrs2002:patients:hist:0,3,7,10,15'],
    ['ICU住院时长', 'stayoficu:patients:hist:0,3,7,10,15,21,30,60'],
    ['机械通气时间', 'venttime:patients:hist:0,3,7,10,15,21,30,60'],

    ['前白蛋白', 'prealbumin:records:hist:0,170,420,880,1600'],
    ['白蛋白', 'albumin:records:hist:0,20,30,40,60,80'],
    ['总蛋白', 'totalProtein:records:hist:0,20,40,60,85,100'],
    ['腹泻', 'diarrhea:records:pie:无,有'],
    ['肠内能量', 'enteralCalories:records:hist:0,500,1000,2000,3000'],
    ['肠外能量', 'parenteralCalories:records:hist:0,500,1000,2000,3000'],
    ['空腹血糖', 'fastingGlucose:records:hist:0,4,11,20,30,50'],
    ['胃潴留', 'gastricRetention:records:hist:0,500,1000,2000,3000,4000'],
    ['消化道出血', 'gastrointestinalHemorrhage:records:pie:无,有'],
    ['血红蛋白', 'hemoglobin:records:hist:0,30,60,90,120,150,180,250'],
    ['淋巴细胞计数', 'lymphocyteCount:records:hist:0,0.8,3.5,10,20,40,60'],
    ['误吸', 'misinhalation:records:pie:无,有'],
    ['转铁蛋白', 'serumTransferrin:records:hist:0,2.2,4,10,14'],
]);

// 因为有两个useEffect 返回渲染两次
const defaultData = {};

function getKey(request: RequestParams, currProjectIndex: number): string {
    return `${request.query[0]}:${currProjectIndex}`;
}

export default function RecordGraph() {
    // const dispatch = useDispatch();
    const { force_rerender, listType, projects } = useSelector((state: IReducers) => ({
        force_rerender: state.user.force_rerender,
        listType: state.user.listType,
        projects: state.projects,
    }));

    // const [modal, setModal] = useState({ open: false, content: '' });
    // const modalClose = () => setModal({ open: false, content: '' });

    // Picker的value
    const [currIndex, setCurrIndex] = useState(0);
    const [data, setData] = useState(defaultData);
    const request = getParams(currIndex, listType);

    // projects index
    const projects4Selectors = useMemo(() => ['全部', ...projects], [projects]);
    const [currProjectIndex, setCurrProjectIndex] = useState(0);
    console.log('request', request);

    // 将缓存重置
    useEffect(() => setData(defaultData), [force_rerender]);

    useEffect(() => {
        console.log('getDataForGraph', currIndex, currProjectIndex);
        if (data[getKey(request, currProjectIndex)]) {
            console.log('data exist', data[getKey(request, currProjectIndex)]);
            return;
        }
        Taro.cloud.callFunction({
            name: 'getDataForGraph',
            data: { ...request, project: projects4Selectors[currProjectIndex] },
            success: ({ errMsg, result = {} }: Taro.cloud.CallFunctionResult) => {
                console.log('get DataFor Graph', errMsg, result, request);
                if (result['err']) {
                    Taro.atMessage({ message: result['err'], type: 'error' });
                    return;
                }
                if (!result['data']) {
                    Taro.atMessage({ message: '返回数据为空', type: 'error' });
                    return;
                }
                setData({ ...data, [getKey(request, currProjectIndex)]: result['data'] });
            },
        });
    }, [currIndex, currProjectIndex]);

    console.log('current data', data);
    return (
        <View>
            <AtMessage />
            <View className="index">
                {request['drawstyle'] === 'pie' ? (
                    <Pie
                        data={
                            data && request && request.query && request.query[0]
                                ? data[getKey(request, currProjectIndex)]
                                : []
                        }
                    />
                ) : (
                    <Hist
                        data={
                            data && request && request.query && request.query[0]
                                ? data[getKey(request, currProjectIndex)]
                                : []
                        }
                    />
                )}
                <View style={{ margin: '15PX' }}>
                    {request['drawstyle'] === 'pie'
                        ? printPieData(data[getKey(request, currProjectIndex)])
                        : printHistData(data[getKey(request, currProjectIndex)])}
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
                <View>
                    <Picker
                        mode="selector"
                        range={projects4Selectors}
                        value={currProjectIndex}
                        onChange={(e) =>
                            setCurrProjectIndex(
                                typeof e.detail.value === 'number'
                                    ? e.detail.value
                                    : parseInt(e.detail.value, 10)
                            )
                        }
                    >
                        <AtList>
                            <AtListItem
                                title="请选择展示项目"
                                extraText={projects4Selectors[currProjectIndex]}
                            />
                        </AtList>
                    </Picker>
                </View>
            </View>
        </View>
    );
}

// 获取cloud.callFunction的参数
function getParams(currIndex: number, listType: ListType): RequestParams {
    const selector = selectors[currIndex];
    const value = map.get(selector);
    if (!value) {
        throw new Error('value 不能为空');
    }

    const [query, table, drawstyle, params] = value.split(':');

    return {
        listType,
        query: [query],
        table,
        drawstyle,
        params,
    };
}

function printPieData(data: PieDataType[]): string {
    if (!data || data.length < 2) {
        return '';
    }
    let sum = data.reduce((accu, cv) => accu + cv.count, 0);
    return data
        .map((item) => `${item.name.toUpperCase()}: ${((item.count / sum) * 100).toFixed(1)}%`)
        .join(',\t');
}

function printHistData(data: HistDataType[]): string {
    if (!data || data.length < 2) {
        return '';
    }

    return data.map((item) => `${item.bin[0]}-${item.bin[1]}: ${item.value}`).join(',\t');
}
