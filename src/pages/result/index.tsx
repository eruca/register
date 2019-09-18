import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtCard, AtButton } from 'taro-ui';

import { selector } from '../patient/config';

const origin = ['所有'];

export default function Result() {
    // 年份选择
    const [selected, setSelected] = useState(0);
    // 从数据库来获取年份
    const [years, setYears] = useState(origin);
    const [aggr, setAggr] = useState([]);

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getYears',
            success(res) {
                console.log('in call function', res);
                const tmp = (res as any).result.years.list.map(year => year._id);
                tmp.sort();
                setYears([...origin, ...tmp]);
            },
            fail: console.error,
        });
    }, [setYears]);

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'groupby',
            data: {
                year: years[selected],
            },
            success(res) {
                console.log('in call function', res);
                setAggr((res as any).result.group.list);
            },
            fail: console.error,
        });
    }, [setAggr]);

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
                {aggr.map(item => (
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">{selector[item['_id']]}</View>
                        <View className="at-col at-col-6">{item['num']}</View>
                    </View>
                ))}
            </AtCard>
        </View>
    );
}

Result.options = {
    addGlobalClass: true,
};

Result.config = {
    navigationBarTitleText: '结果统计',
};
