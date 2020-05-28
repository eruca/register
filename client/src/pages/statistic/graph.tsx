import Taro, { useEffect, useState, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtList, AtListItem, AtMessage, AtButton } from 'taro-ui';

import { useSelector, useDispatch } from '@tarojs/redux';
import { IReducers } from 'src/reducers';
import { ListType } from 'src/reducers/user';
import Hist from '../../components/F2Graph/hist';
import Pie from '../../components/F2Graph/pie';
import { forceRerender } from '../../actions/user';

type RequestParams = {
    listType: ListType;
    query: string[];
    table: string;
    drawstyle: string;
    params: string;
};

const selectors: string[] = ['性别', '年龄'];

const map = new Map([
    ['性别', 'isMale:patients:pie:女,男'],
    ['年龄', 'age:patients:hist:0,10,20,30,40,50,60,70,80,90,100,110,120'],
]);

// 因为有两个useEffect 返回渲染两次
const defaultData = {};

export default function RecordGraph() {
    const dispatch = useDispatch();
    const { force_rerender, listType } = useSelector((state: IReducers) => ({
        force_rerender: state.user.force_rerender,
        listType: state.user.listType,
    }));

    // Picker的value
    const [currIndex, setCurrIndex] = useState(1);
    const [data, setData] = useState(defaultData);
    const request = getParams(currIndex, listType);
    console.log('request', request);

    useEffect(() => setData(defaultData), [force_rerender]);

    useEffect(() => {
        console.log('getDataForGraph', currIndex, data);
        if (data[request['query'][0]]) {
            console.log('data exist', data[request['query'][0]]);
            return;
        }
        Taro.cloud.callFunction({
            name: 'getDataForGraph',
            data: request,
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
                setData({ ...data, [request.query[0]]: result['data'] });
            },
        });
    }, [currIndex, data]);

    return (
        <View className="index">
            <AtMessage />
            {request['drawstyle'] === 'pie' ? (
                <Pie
                    data={
                        data && request && request.query && request.query[0]
                            ? data[request['query'][0]]
                            : []
                    }
                />
            ) : (
                <Hist
                    data={
                        data && request && request.query && request.query[0]
                            ? data[request['query'][0]]
                            : []
                    }
                />
            )}
            <View style={{ margin: '5PX 14PX' }}>
                <AtButton
                    type="secondary"
                    onClick={useCallback(() => {
                        dispatch(forceRerender());
                        Taro.atMessage({ message: '已刷新', type: 'success' });
                    }, [])}
                >
                    刷新
                </AtButton>
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
