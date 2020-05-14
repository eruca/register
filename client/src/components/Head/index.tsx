import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import { useDispatch } from '@tarojs/redux';

import { IUserState } from '../../reducers/user';
import { authorizeSuccess } from '../../cloudfunc';

export default function Head({
    avatarUrl,
    nickName,
    hosp,
    dept,
    first_connected_result,
}: IUserState) {
    const dispatch = useDispatch();
    return (
        <View style="margin:20rpx">
            <View style="display:flex;flex-direction:row">
                <View style="flex:0;margin:auto">
                    <AtAvatar circle image={avatarUrl} />
                </View>
                <View style="width:100%;margin:auto;padding-left:20rpx;">
                    <View>{nickName}</View>
                    <View style="font-size:0.6em;color:#AAAAAA;">
                        {hosp} - {dept}
                    </View>
                </View>
                {first_connected_result === 2 && (
                    <View style="width:260rpx">
                        <Button
                            className="btn"
                            openType="getUserInfo"
                            onGetUserInfo={authorizeSuccess(dispatch)}
                            type="primary"
                            lang="zh_CN"
                        >
                            授权
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
}
