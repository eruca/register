import Taro, { useEffect, useState } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';

import { useSelector } from '@tarojs/redux';
import { IReducers } from 'src/reducers';
import { ListType } from 'src/reducers/user';
import Hist from '../../components/F2Graph/hist';
import Pie from '../../components/F2Graph/pie';

type RequestParams = {
    listType: ListType;
    query: string[];
    table: string;
};

const selectors: string[] = ['性别', '年龄'];

const map = new Map([
    ['性别', 'isMale:patients:pie:女,男'],
    ['年龄', 'age:patients:hist:0,10,20,30,40,50,60,70,80,90,100,110,120'],
]);

export default function RecordGraph() {
    const { force_rerender, listType } = useSelector((state: IReducers) => ({
        force_rerender: state.user.force_rerender,
        listType: state.user.listType,
    }));

    // Picker的value
    const [currIndex, setCurrIndex] = useState(0);
    const [data, setData] = useState([]);
    const { request, drawstyle, config } = getParams(currIndex, listType);

    useEffect(() => {
        console.log('getDataForGraph');
        setData([]);
        Taro.cloud.callFunction({
            name: 'getDataForGraph',
            data: request,
            success: (res) => {
                console.log('get DataFor Graph', res, request, drawstyle);
                const array = res['result']['array'].map((item) => item[request.query[0]]); // false, true, false
                console.log('success on getDataForGraph', array);
                setData(array);
            },
        });
    }, [currIndex, force_rerender]);

    return (
        <View className="index">
            {drawstyle === 'pie' ? (
                <Pie names={config} input={data} />
            ) : (
                <Hist values={data} bins={config.map((it) => Number(it))} binsSorted={true} />
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

// 获取cloud.callFunction的参数
function getParams(
    currIndex: number,
    listType: ListType
): { request: RequestParams; drawstyle: string; config: string[] } {
    const selector = selectors[currIndex];
    const value = map.get(selector);
    if (!value) {
        throw new Error('value 不能为空');
    }

    const [query, table, drawstyle, config] = value.split(':');

    return {
        request: {
            listType,
            query: [query],
            table,
        },
        drawstyle,
        config: config.split(','),
    };
}
