import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useDispatch, useSelector } from '@tarojs/redux';
import { AtCard, AtButton } from 'taro-ui';

import { selector } from '../patient/config';
import { forceRerender } from '../../actions/user';
import { IReducers } from '../../reducers';

const origin = ['所有'];

export default function Result() {
    const dispatch = useDispatch();
    const force_rerender = useSelector((state: IReducers) => state.user.force_rerender);

    // 年份选择
    const [selected, setSelected] = useState(0);
    // 从数据库来获取年份
    const [years, setYears] = useState(origin);
    const [group, setGroup] = useState([]);
    const [mygroup, setMygroup] = useState(new Map());

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getYears',
            success(res) {
                console.log('getYears', res);
                const tmp = (res as any).result.years.list.map(year => year._id);
                tmp.sort();
                setYears([...origin, ...tmp]);
            },
            fail: console.error,
        });
    }, [setYears, force_rerender]);

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'groupby',
            data: {
                year: years[selected],
            },
            success(res) {
                console.log('groupby', res);
                setGroup((res as any).result.group.list);

                const map = (res as any).result.mygroup.list.reduce((acc, currValue) => {
                    acc.set(currValue['_id'], currValue['num']);
                    acc.set('sum', acc.get('sum') + currValue['num']);
                    return acc;
                }, new Map([['sum', 0]]));
                setMygroup(map);
            },
            fail: console.error,
        });
    }, [setGroup, setMygroup, force_rerender]);

    console.log('selected', selected, years[selected]);
    return (
        <View>
            <Picker
                mode="selector"
                range={years}
                value={selected}
                onChange={v => setSelected(v.detail.value)}
            >
                <View style={{ margin: '0 14PX 5PX 14PX' }}>
                    <AtButton type="primary">{years[selected]}</AtButton>
                </View>
            </Picker>
            <AtCard title="按病种">
                <View className="at-row at-row__justify--center" style={{ color: '#6699FF' }}>
                    <View className="at-col at-col-6">病种</View>
                    <View className="at-col at-col-3">我的</View>
                    <View className="at-col at-col-3">全部</View>
                </View>
                {group.map(item => (
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">{selector[item['_id']]}</View>
                        <View className="at-col at-col-3">{mygroup.get(item['_id']) || 0}</View>
                        <View className="at-col at-col-3">{item['num']}</View>
                    </View>
                ))}
                <View className="at-row at-row__justify--center" style={{ color: '#FF9900' }}>
                    <View className="at-col at-col-6">总计</View>
                    <View className="at-col at-col-3">{mygroup.get('sum')}</View>
                    <View className="at-col at-col-3">
                        {group.reduce((acc, curr: any) => acc + curr.num, 0)}
                    </View>
                </View>
            </AtCard>
            <View style={{ margin: '5PX 14PX 0 14PX' }}>
                <AtButton
                    type="secondary"
                    onClick={useCallback(() => dispatch(forceRerender()), [])}
                >
                    刷新
                </AtButton>
            </View>
        </View>
    );
}

Result.options = {
    addGlobalClass: true,
};

Result.config = {
    navigationBarTitleText: '结果统计',
};
