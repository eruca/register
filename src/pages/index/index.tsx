import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { userSync } from '../../actions/user';
import { usersCollection } from '../../utils/db';

const dispatch = useDispatch();

export default function Index() {
    const user = useSelector((state: IReducers) => ({ ...state.user }));
    const cb = es => {
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
            <AtButton
                onClick={() =>
                    Taro.navigateTo({
                        url: '/pages/user/index',
                    })
                }
            >
                修改
            </AtButton>
        </View>
    );
}

Index.options = {
    addGlobalClass: true,
};
