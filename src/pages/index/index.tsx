import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton, AtCard } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { userSync } from '../../actions/user';
import { usersCollection } from '../../utils/db';

const dispatch = useDispatch();

export default function Index() {
    const { user, total, date_total, result_total } = useSelector((state: IReducers) => ({
        user: state.user,
        total: state.patients.total,
        date_total: state.patients.patient_date_total,
        result_total: state.patients.patient_result_total,
    }));

    const cb = es => {
        console.log('cb =>', es);
        dispatch(userSync(es));
        usersCollection.add({
            data: es,
            success(e) {
                console.log('success', e);
            },
            fail: console.error,
        });
    };

    return (
        <View>
            <Head {...user} cb={cb} />
            <View style={{ margin: '10PX' }}>
                <AtCard title="完成情况统计">
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">已达1周</View>
                        <View className="at-col at-col-6">已有结果</View>
                    </View>
                    <View className="at-row at-row__justify--center">
                        <View className="at-col at-col-6">{`${result_total}/${total}`}</View>
                        <View className="at-col at-col-6">{`${date_total}/${total}`}</View>
                    </View>
                </AtCard>
            </View>
            <AtButton
                type="primary"
                onClick={() =>
                    Taro.navigateTo({
                        url: '/pages/user/index',
                    })
                }
            >
                修改个人信息
            </AtButton>
        </View>
    );
}

Index.options = {
    addGlobalClass: true,
};
