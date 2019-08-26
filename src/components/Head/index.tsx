import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import { IUserState } from '../../reducers/user';

export interface IProps extends IUserState {
    cb: (user: IUserState) => void;
}

export default function Head({ avatarUrl, nickName, hosp, dept, cb }: IProps) {
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
                {!nickName && (
                    <View style="width:200rpx">
                        <Button
                            className="btn"
                            openType="getUserInfo"
                            onGetUserInfo={e => cb(e.detail.userInfo as IUserState)}
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
