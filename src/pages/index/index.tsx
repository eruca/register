import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { userSync } from '../../actions/user';
import { usersCollection } from '../../utils/db';

export default function Index() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: IReducers) => ({
        user: state.user,
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
                <AtList>
                    <AtListItem
                        title="修改个人信息"
                        arrow="right"
                        onClick={() =>
                            Taro.navigateTo({
                                url: '/pages/user/index',
                            })
                        }
                    />
                    <AtListItem title="关于" note="微信号:nickwill" />
                </AtList>
            </View>
        </View>
    );
}

Index.options = {
    addGlobalClass: true,
};

Index.config = {
    navigationBarTitleText: '个人信息',
};
