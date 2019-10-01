import Taro from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { Authority } from '../../reducers/user';
import { userSync, syncHospDeptCocodes } from '../../actions/user';
import { usersCollection } from '../../utils/db';
import FormField from '../../components/FormField';

const listTypes = ['我的', '本组', '所有'];

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

    const onChange = e => {
        dispatch(
            syncHospDeptCocodes(user.hosp, user.dept, user.cocodes, parseInt(e.detail.value, 10))
        );
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
                    <View style={{ marginLeft: '-5PX' }}>
                        <Picker
                            mode="selector"
                            range={listTypes.slice(0, user.authority === Authority.Root ? 3 : 2)}
                            value={user.listType}
                            onChange={onChange}
                        >
                            <FormField name="查看范围" value={listTypes[user.listType]} />
                        </Picker>
                    </View>
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
