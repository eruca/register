import Taro, { useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtListItem, AtMessage } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { version } from '../../version';
import { getProjects } from '../../actions/projects';

export default function Index() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: IReducers) => ({
        user: state.user,
    }));

    useEffect(() => {
        if (user.first_connected_result === 0) {
            Taro.atMessage({
                message: '如果已授权，自动登录中，否则注意网络情况',
                type: 'info',
            });
        }
    }, []);

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getProjects',
            success: ({ errMsg, result = {} }: Taro.cloud.CallFunctionResult) => {
                console.log('getProjects', errMsg, result);
                if (typeof result === 'string') {
                    console.log('获取是字符串，应该是{}');
                    return;
                }
                dispatch(getProjects(result.list[0].projects as string[]));
            },
        });
    }, [user.force_rerender]);

    return (
        <View>
            <AtMessage />
            <Head {...user} />
            <View style={{ margin: '10PX' }}>
                <AtList>
                    <AtListItem
                        title="个人信息"
                        arrow="right"
                        onClick={() =>
                            Taro.navigateTo({
                                url: '/pages/user/index',
                            })
                        }
                    />
                    <AtListItem
                        title="查看设置"
                        arrow="right"
                        onClick={() => Taro.navigateTo({ url: '/pages/viewset/index' })}
                    />
                    <AtListItem title="关于" note={`版本:${version}`} />
                </AtList>
            </View>
        </View>
    );
}

Index.options = {
    addGlobalClass: true,
};

Index.config = {
    navigationBarTitleText: '我的',
};
