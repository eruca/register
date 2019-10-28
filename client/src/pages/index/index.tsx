import Taro, { useCallback, useState, useEffect } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import {
    AtList,
    AtListItem,
    AtInput,
    AtModal,
    AtModalHeader,
    AtMessage,
    AtModalContent,
    AtModalAction,
} from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { isUnknown, IUserState } from '../../reducers/user';
import { userSync, syncConnectResult } from '../../actions/user';
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
                dispatch(syncConnectResult(1));
            },
            fail: console.error,
        });
    };

    const [isOpen, setOpen] = useState(false);
    const [inviteCodeSender, setInviteCodeSender] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const onModalClick = useCallback(() => {
        Taro.atMessage({ message: '正在申请加入, 请稍等...', type: 'info' });

        Taro.cloud.callFunction({
            name: 'onAuth',
            data: { invitor: inviteCodeSender, code: inviteCode, nickname: user.nickName },
            success: res => {
                console.log('onAuth', res);
                setOpen(false);
                Taro.atMessage({
                    message: '加入成功, 正在更新数据, 请稍等...',
                    type: 'success',
                    duration: 1500,
                });

                if (res.result.success === true) {
                    Taro.cloud.callFunction({
                        name: 'getContext',
                        success(res) {
                            console.log('getContext', res);
                            dispatch(syncConnectResult(res.result['result']));
                            if (res.result.record) {
                                dispatch(userSync((res.result as any)['record'] as IUserState));
                            }
                        },
                        fail: console.error,
                    });
                } else {
                    Taro.atMessage({ message: res.result.error || '操作失败', type: 'error' });
                }
            },
            fail: console.error,
        });
    }, [inviteCode, inviteCodeSender, setOpen]);

    const onModalClose = useCallback(() => {
        setOpen(false);
        setInviteCodeSender('');
        setInviteCode('');
    }, [setOpen, setInviteCodeSender, setInviteCodeSender]);

    useEffect(() => {
        if (user.first_connected_result === 0) {
            Taro.atMessage({
                message: '如果已授权，自动登录中，否则注意网络情况',
                type: 'info',
            });
        }
    }, []);

    return (
        <View>
            <AtMessage />
            <Head {...user} cb={cb} />
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
                    {isUnknown(user.authority) && (
                        <AtListItem title="申请加入" onClick={() => setOpen(true)} arrow="right" />
                    )}
                    <AtListItem title="关于" note="微信号: nickwill" />
                </AtList>
            </View>

            {isUnknown(user.authority) && (
                <AtModal isOpened={isOpen}>
                    <AtModalHeader>
                        <Text style="color:skyblue">申请加入</Text>
                    </AtModalHeader>
                    <AtModalContent>
                        <AtInput
                            name="inviteCodeSender"
                            title="邀请者:"
                            placeholder="邀请者协作码"
                            value={inviteCodeSender}
                            clear
                            type="number"
                            onChange={v => setInviteCodeSender(v)}
                        />
                        <AtInput
                            name="inviteCode"
                            type="number"
                            title="邀请码:"
                            placeholder="邀请者邀请码"
                            clear
                            value={inviteCode}
                            onChange={v => setInviteCode(v)}
                        />
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={onModalClose}>取消</Button>{' '}
                        <Button onClick={onModalClick}>确定</Button>
                    </AtModalAction>
                </AtModal>
            )}
        </View>
    );
}

Index.options = {
    addGlobalClass: true,
};

Index.config = {
    navigationBarTitleText: '个人信息',
};
