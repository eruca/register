import Taro, { useCallback, useState, useEffect, SetStateAction, Dispatch } from '@tarojs/taro';
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
import { isUnknown } from '../../reducers/user';
import { onAuthSuccess } from '../../cloudfunc';

// onChange 统一使用该函数
const onChange = (fn: Dispatch<SetStateAction<string>>) => (v: number | string) => {
    if (typeof v === 'number') {
        fn(v.toString());
    } else {
        fn(v);
    }
};

export default function Index() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: IReducers) => ({
        user: state.user,
    }));

    const [isOpen, setOpen] = useState(false);
    const [inviteCodeSender, setInviteCodeSender] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const onModalClick = useCallback(() => {
        Taro.atMessage({ message: '正在申请加入, 请稍等...', type: 'info' });

        Taro.cloud.callFunction({
            name: 'onAuth',
            data: { invitor: inviteCodeSender, code: inviteCode, nickname: user.nickName },
            success: onAuthSuccess(dispatch, setOpen),
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
                            onChange={onChange(setInviteCodeSender)}
                        />
                        <AtInput
                            name="inviteCode"
                            type="number"
                            title="邀请码:"
                            placeholder="邀请者邀请码"
                            clear
                            value={inviteCode}
                            onChange={onChange(setInviteCode)}
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
