import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useDispatch, useSelector } from '@tarojs/redux';
import { AtCard, AtButton } from 'taro-ui';

import { selector } from '../patient/config';
import { forceRerender } from '../../actions/user';
import { IReducers } from '../../reducers';

interface Statistic {
    total: number;
    groupTotal: number;
    meTotal: number;

    resultTotal: number;
    groupResultTotal: number;
    meResultTotal: number;

    weekTotal: number;
    groupWeekTotal: number;
    meWeekTotal: number;
}

function zeroStatistic(): Statistic {
    return {
        total: 0,
        groupTotal: 0,
        meTotal: 0,

        resultTotal: 0,
        groupResultTotal: 0,
        meResultTotal: 0,

        weekTotal: 0,
        groupWeekTotal: 0,
        meWeekTotal: 0,
    };
}

const origin = ['所有'];

export default function Result() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: IReducers) => ({
        user: state.user,
    }));

    // 年份选择
    const [selected, setSelected] = useState(0);
    // 从数据库来获取年份
    const [years, setYears] = useState(origin);
    // 对收集的病种分类转化为map
    const [map, setMap] = useState(new Map());
    // 对是否完成，是否过1周统计数据
    const [stat, setStat] = useState<Statistic>(zeroStatistic());

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
    }, [setYears, user.force_rerender]);

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getStatistic',
            data: { year: years[selected] },
            success: res => {
                console.log('getStatistic', res);
                setStat({ ...res.result, event: undefined } as Statistic);
            },
            fail: console.error,
        });

        Taro.cloud.callFunction({
            name: 'groupby',
            data: {
                year: years[selected],
            },
            success(res) {
                console.log('groupby', res);
                const {
                    nutrientGroup,
                    groupNutrientGroup,
                    meNutrientGroup,
                    diseaseGroup,
                    groupDiseaseGroup,
                    meDiseaseGroup,
                } = res.result;

                const _map = new Map();
                // 收集病例名称集合，还是放入_map中
                const tmpGroup: Array<string> = [];
                (diseaseGroup as any).forEach(({ _id, num }) => {
                    _map.set(selector[_id], num);
                    tmpGroup.push(selector[_id]);
                });
                _map.set('items', tmpGroup);

                (groupDiseaseGroup as any).forEach(({ _id, num }) => {
                    _map.set('group:' + selector[_id], num);
                });

                (meDiseaseGroup as any).forEach(({ _id, num }) => {
                    _map.set('me:' + selector[_id], num);
                });

                (nutrientGroup as any).forEach(({ _id, num }) => {
                    _map.set((!!_id).toString(), (_map.get((!!_id).toString()) || 0) + num);
                });

                (groupNutrientGroup as any).forEach(({ _id, num }) => {
                    _map.set(
                        'group:' + (!!_id).toString(),
                        (_map.get('group:' + (!!_id).toString()) || 0) + num
                    );
                });

                (meNutrientGroup as any).forEach(({ _id, num }) => {
                    _map.set(
                        'me:' + (!!_id).toString(),
                        (_map.get('me:' + (!!_id).toString()) || 0) + num
                    );
                });
                setMap(_map);
            },
            fail: console.error,
        });
    }, [years[selected], user.force_rerender]);

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

            <View style={{ margin: '5PX 0' }}>
                <AtCard title="按完成情况">
                    <View className="at-row at-row__justify--center" style={{ color: '#6699FF' }}>
                        <View className="at-col at-col-4">指标</View>
                        <View className="at-col at-col-3">我的</View>
                        <View className="at-col at-col-3">组内</View>
                        <View className="at-col at-col-2">全部</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-4">已达1周</View>
                        <View className="at-col at-col-3">{`${stat.meWeekTotal}/${stat.meTotal}`}</View>
                        <View className="at-col at-col-3">{`${stat.groupWeekTotal}/${stat.groupTotal}`}</View>
                        <View className="at-col at-col-2">{`${stat.weekTotal}/${stat.total}`}</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-4">已有结果</View>
                        <View className="at-col at-col-3">{`${stat.meResultTotal}/${stat.meTotal}`}</View>
                        <View className="at-col at-col-3">{`${stat.groupResultTotal}/${stat.groupTotal}`}</View>
                        <View className="at-col at-col-2">{`${stat.resultTotal}/${stat.total}`}</View>
                    </View>
                </AtCard>
            </View>

            <View style={{ margin: '5PX 0' }}>
                <AtCard title="按营养配方">
                    <View className="at-row at-row__justify--center" style={{ color: '#6699FF' }}>
                        <View className="at-col at-col-4">配方</View>
                        <View className="at-col at-col-3">我的</View>
                        <View className="at-col at-col-3">组内</View>
                        <View className="at-col at-col-2">全部</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-4">短肽</View>
                        <View className="at-col at-col-3">{`${map.get('me:true') || 0}`}</View>
                        <View className="at-col at-col-3">{`${map.get('group:true') || 0}`}</View>
                        <View className="at-col at-col-2">{`${map.get('true') || 0}`}</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-4">整蛋白</View>
                        <View className="at-col at-col-3">{`${map.get('me:false') || 0}`}</View>
                        <View className="at-col at-col-3">{`${map.get('group:false') || 0}`}</View>
                        <View className="at-col at-col-2">{`${map.get('false') || 0}`}</View>
                    </View>
                    <View className="at-row at-row__justify--center" style={{ color: '#FF9900' }}>
                        <View className="at-col at-col-4">总计</View>
                        <View className="at-col at-col-3">{stat.meTotal}</View>
                        <View className="at-col at-col-3">{stat.groupTotal}</View>
                        <View className="at-col at-col-2">{stat.total}</View>
                    </View>
                </AtCard>
            </View>

            <AtCard title="按病种">
                <View className="at-row at-row__justify--center" style={{ color: '#6699FF' }}>
                    <View className="at-col at-col-7">病种</View>
                    <View className="at-col at-col-2">我的</View>
                    <View className="at-col at-col-2">组内</View>
                    <View className="at-col at-col-1">全部</View>
                </View>
                {(map.get('items') || []).map(item => (
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-7">{item}</View>
                        <View className="at-col at-col-2">{map.get('me:' + item) || 0}</View>
                        <View className="at-col at-col-2">{map.get('group:' + item) || 0}</View>
                        <View className="at-col at-col-1">{map.get(item) || 0}</View>
                    </View>
                ))}
                <View className="at-row at-row__justify--center" style={{ color: '#FF9900' }}>
                    <View className="at-col at-col-7">总计</View>
                    <View className="at-col at-col-2">{stat.meTotal}</View>
                    <View className="at-col at-col-2">{stat.groupTotal}</View>
                    <View className="at-col at-col-1">{stat.total}</View>
                </View>
            </AtCard>

            <View style={{ margin: '5PX 14PX' }}>
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
