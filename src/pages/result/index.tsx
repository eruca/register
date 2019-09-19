import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useDispatch, useSelector } from '@tarojs/redux';
import { AtCard, AtButton } from 'taro-ui';

import { selector } from '../patient/config';
import { forceRerender } from '../../actions/user';
import { IReducers } from '../../reducers';
import { patient_total } from '../../actions/patient';

const origin = ['所有'];

export default function Result() {
    const dispatch = useDispatch();
    const {
        user,
        mytotal,
        mydate_total,
        myresult_total,
        total,
        date_total,
        result_total,
    } = useSelector((state: IReducers) => ({
        user: state.user,
        mytotal: state.patients.mytotal,
        mydate_total: state.patients.mypatient_date_total,
        myresult_total: state.patients.mypatient_result_total,
        total: state.patients.total,
        date_total: state.patients.patient_date_total,
        result_total: state.patients.patient_result_total,
    }));

    // 年份选择
    const [selected, setSelected] = useState(0);
    // 从数据库来获取年份
    const [years, setYears] = useState(origin);
    const [group, setGroup] = useState([]);
    const [mygroup, setMygroup] = useState(new Map());
    const [nutrients, setNutrients] = useState(new Map());

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
                dispatch(
                    patient_total(
                        (res.result as any).total,
                        (res.result as any).patient_date_total,
                        (res.result as any).patient_result_total,
                        (res.result as any).mytotal,
                        (res.result as any).mypatient_date_total,
                        (res.result as any).mypatient_result_total
                    )
                );
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
                setGroup((res as any).result.group.list);

                const map = (res as any).result.mygroup.list.reduce((acc, currValue) => {
                    acc.set(currValue['_id'], currValue['num']);
                    acc.set('sum', (acc.get('sum') || 0) + currValue['num']);
                    return acc;
                }, new Map());
                setMygroup(map);

                const nutrientMap = new Map();
                (res as any).result.nutrients.list.forEach(item => {
                    if (item._id === false || item._id === null) {
                        nutrientMap.set(
                            'peptide-0',
                            (nutrientMap.get('peptide-0') || 0) + item.num
                        );
                    } else {
                        nutrientMap.set(
                            'peptide-1',
                            (nutrientMap.get('peptide-1') || 0) + item.num
                        );
                    }
                });
                (res as any).result.mynutrients.list.forEach(item => {
                    if (item._id === false || item._id === null) {
                        nutrientMap.set(
                            'mypeptide-0',
                            (nutrientMap.get('mypeptide-0') || 0) + item.num
                        );
                    } else {
                        nutrientMap.set(
                            'mypeptide-1',
                            (nutrientMap.get('mypeptide-1') || 0) + item.num
                        );
                    }
                });
                setNutrients(nutrientMap);
            },
            fail: console.error,
        });
    }, [setGroup, setMygroup, user.force_rerender]);

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

            <AtCard title="按完成情况">
                <View className="at-row at-row__justify--center">
                    <View className="at-col at-col-6">已达1周</View>
                    <View className="at-col at-col-6">已有结果</View>
                </View>
                <View className="at-row at-row__justify--center">
                    <View className="at-col at-col-6">{`${mydate_total}/${mytotal}`}</View>
                    <View className="at-col at-col-6">{`${myresult_total}/${mytotal}`}</View>
                </View>
                {user.is_super && (
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">{`${date_total}/${total}`}</View>
                        <View className="at-col at-col-6">{`${result_total}/${total}`}</View>
                    </View>
                )}
            </AtCard>

            <View style={{ margin: '5PX 0' }}>
                <AtCard title="按营养配方">
                    <View className="at-row at-row__justify--center" style={{ color: '#6699FF' }}>
                        <View className="at-col at-col-6">配方</View>
                        <View className="at-col at-col-3">我的</View>
                        <View className="at-col at-col-3">全部</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">短肽</View>
                        <View className="at-col at-col-3">{`${nutrients.get('mypeptide-1') ||
                            0}`}</View>
                        <View className="at-col at-col-3">{`${nutrients.get('peptide-1') ||
                            0}`}</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">整蛋白</View>
                        <View className="at-col at-col-3">{`${nutrients.get('mypeptide-0') ||
                            0}`}</View>
                        <View className="at-col at-col-3">{`${nutrients.get('peptide-0') ||
                            0}`}</View>
                    </View>
                    <View className="at-row at-row__justify--center" style={{ color: '#FF9900' }}>
                        <View className="at-col at-col-6">总计</View>
                        <View className="at-col at-col-3">{mygroup.get('sum') || 0}</View>
                        <View className="at-col at-col-3">
                            {group.reduce((acc, curr: any) => acc + curr.num, 0)}
                        </View>
                    </View>
                </AtCard>
            </View>

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
                    <View className="at-col at-col-3">{mygroup.get('sum') || 0}</View>
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
