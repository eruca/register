import Taro, { useCallback, useState } from '@tarojs/taro';
import { View, Picker, Text, Button } from '@tarojs/components';
import {
    AtList,
    AtListItem,
    AtForm,
    AtInput,
    AtModal,
    AtModalHeader,
    AtMessage,
    AtModalContent,
    AtModalAction,
    AtButton,
} from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import Head from '../../components/Head';
import { IReducers } from '../../reducers';
import { isRoot, isUnknown, IUserState } from '../../reducers/user';
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

    const [isOpen, setOpen] = useState(false);
    const [inviteCodeSender, setInviteCodeSender] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const onModalClick = () => {
        Taro.cloud.callFunction({
            name: 'onAuth',
            data: { invitor: inviteCodeSender, code: inviteCode },
            success: res => {
                console.log('onAuth', res);
                setOpen(false);

                if (res.result.success === true) {
                    Taro.cloud.callFunction({
                        name: 'getContext',
                        success(res) {
                            console.log('getContext', res);
                            dispatch(userSync((res.result as any)['record'] as IUserState));
                        },
                        fail: console.error,
                    });
                } else {
                    Taro.atMessage({ message: res.result.error || '操作失败', type: 'error' });
                }
            },
            fail: console.error,
        });
    };

    const onModalClose = () => {
        setOpen(false);
        setInviteCodeSender('');
        setInviteCode('');
    };

    return (
        <View>
            <AtMessage />
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
                            range={listTypes.slice(
                                0,
                                isUnknown(user.authority) ? 1 : isRoot(user.authority) ? 3 : 2
                            )}
                            value={user.listType}
                            onChange={useCallback(
                                e => {
                                    dispatch(
                                        syncHospDeptCocodes(
                                            user.hosp,
                                            user.dept,
                                            user.cocodes,
                                            parseInt(e.detail.value, 10)
                                        )
                                    );
                                },
                                [syncHospDeptCocodes, user.hosp, user.dept, user.cocodes]
                            )}
                        >
                            <FormField name="查看范围" value={listTypes[user.listType]} />
                        </Picker>
                    </View>
                    {isUnknown(user.authority) && (
                        <AtListItem title="申请加入" onClick={() => setOpen(true)} arrow="right" />
                    )}
                    <AtListItem title="关于" note="微信号:nickwill" />
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
                            value={inviteCodeSender}
                            type="number"
                            onChange={v => setInviteCodeSender(v)}
                        />
                        <AtInput
                            name="inviteCode"
                            type="number"
                            title="邀请码:"
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
