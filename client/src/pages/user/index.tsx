import Taro, { useState, useEffect, useCallback, Dispatch, SetStateAction } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import {
    AtForm,
    AtInput,
    AtButton,
    AtMessage,
    AtTextarea,
    AtListItem,
    AtModal,
    AtModalHeader,
    AtModalContent,
    AtModalAction,
} from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import { IReducers } from '../../reducers';
import { isAdmin, IUserState, isUnknown } from '../../reducers/user';
import { syncHospDeptCocodes, userSync, forceRerender } from '../../actions/user';
import { getContextSuccess, onAuthSuccess } from '../../cloudfunc';

type EqualType = {
    name: string;
    hosp: string;
    dept: string;
    mail: string;
    cocodes: string;
};

// email正则
const mail_regexp = /^([a-zA-Z0-9_\-\.])+@([a-zA-Z0-9_\-\.])+(\.[a-zA-Z0-9_-]+)+$/;

// 禁止更新
function disableUpdate(lhs: EqualType, rhs: EqualType): boolean {
    return (
        (lhs.hosp === rhs.hosp &&
            lhs.dept === rhs.dept &&
            lhs.cocodes === rhs.cocodes &&
            lhs.name === rhs.name &&
            lhs.mail === rhs.mail) ||
        !mail_regexp.test(rhs.mail)
    );
}

// onChange 统一使用该函数
const onChange = (fn: Dispatch<SetStateAction<string>>) => (v: number | string) => {
    if (typeof v === 'number') {
        fn(v.toString());
    } else {
        fn(v);
    }
};

export default function User() {
    const dispatch = useDispatch();
    const {
        _id,
        dept: defaultDept,
        hosp: defaultHosp,
        name: defaultName,
        mail: defaultMail,
        nickName,
        cocode, // 不可改变，只能从服务器获取
        cocodes: defaultCocodes, // 可编辑
        authority,
        invite_code, // 不可改变
        force_rerender,
    } = useSelector((state: IReducers) => state.user);
    const [dept, setDept] = useState(defaultDept);
    const [hosp, setHosp] = useState(defaultHosp);
    const [name, setName] = useState(defaultName);
    const [mail, setMail] = useState(defaultMail);
    const [cocodes, setCocodes] = useState(defaultCocodes);

    const [isOpen, setOpen] = useState(false);
    const [inviteCodeSender, setInviteCodeSender] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const onModalClick = useCallback(() => {
        Taro.atMessage({ message: '正在申请加入, 请稍等...', type: 'info' });

        Taro.cloud.callFunction({
            name: 'onAuth',
            data: { invitor: inviteCodeSender, code: inviteCode, nickname: nickName },
            success: onAuthSuccess(dispatch, setOpen),
            fail: console.error,
        });
    }, [inviteCode, inviteCodeSender, setOpen]);

    const onModalClose = useCallback(() => {
        setOpen(false);
        setInviteCodeSender('');
        setInviteCode('');
    }, [setOpen, setInviteCodeSender, setInviteCodeSender]);

    const mailTest = () => {
        if (!mail_regexp.test(mail)) {
            Taro.atMessage({
                message: '邮箱密码格式错误,示例:81233890@qq.com',
                type: 'error',
            });
        }
    };

    const applyJoin = () => {
        if (
            name.trim() === '' ||
            hosp.trim() === '' ||
            dept.trim() === '' ||
            !mail_regexp.test(mail)
        ) {
            Taro.atMessage({
                message: '请完善名字、医院、科室及有效邮箱',
                type: 'error',
            });
            return;
        }
        setOpen(true);
    };

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getContext',
            success: getContextSuccess(dispatch),
            fail: console.error,
        });
    }, [force_rerender]);

    const ResetInviteCode = useCallback(() => {
        if (authority >= 2) {
            console.log('reset invite code');
            Taro.cloud
                .database()
                .collection('users')
                .doc(_id)
                .get({
                    success(res) {
                        console.log('Reset invite code', res);
                        if ((res.data as IUserState).invite_code === invite_code) {
                            Taro.atMessage({ message: '你的邀请码尚未更新', type: 'info' });
                        } else {
                            Taro.atMessage({ message: '更新邀请码成功', type: 'success' });
                            dispatch(userSync(res.data as IUserState));
                        }
                    },
                });
        }
    }, [authority, _id, invite_code, userSync]);

    const onSubmit = () => {
        console.log('dept', dept, 'hosp', hosp, 'cocodes', cocodes);
        Taro.cloud
            .database()
            .collection('users')
            .doc(_id)
            .update({
                data: { dept, hosp, cocodes, name, mail },
                success(res) {
                    console.log('success', res);
                    Taro.atMessage({ message: '修改成功', type: 'success' });
                    dispatch(syncHospDeptCocodes(name, mail, hosp, dept, cocodes));
                    dispatch(forceRerender());
                },
                fail: console.error,
            });
    };

    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit}>
                <AtInput
                    title="名字:"
                    name="name"
                    value={name}
                    placeholder={'你的名字'}
                    onChange={(e: string) => setName(e)}
                />
                <AtInput
                    title="医院:"
                    name="hosp"
                    value={hosp}
                    placeholder="你的医院"
                    onChange={(e: string) => setHosp(e)}
                />
                <AtInput
                    title="科室:"
                    name="dept"
                    value={dept}
                    placeholder="你的科室"
                    onChange={(e: string) => setDept(e)}
                />
                <AtInput
                    title="邮箱:"
                    type="text"
                    name="mail"
                    value={mail}
                    placeholder="你的邮箱，接受数据用"
                    onChange={(e: string) => setMail(e)}
                    onBlur={mailTest}
                />
                {isUnknown(authority) && (
                    <View style={{ marginLeft: '5PX' }}>
                        <AtListItem title="加入RCT" onClick={applyJoin} arrow="right" />
                    </View>
                )}
                {!isUnknown(authority) && (
                    <AtInput
                        title="协作码:"
                        name="cocode"
                        value={cocode ? cocode : ''}
                        disabled={true}
                        onChange={() => {}}
                    />
                )}
                {isAdmin(authority) && (
                    <AtInput
                        title="邀请码:"
                        name="invite_code"
                        value={invite_code}
                        disabled={true}
                        onChange={() => {}}
                    />
                )}

                {!isUnknown(authority) && (
                    <View>
                        <View className="at-row" style={{ margin: '15PX 0 5PX 16PX' }}>
                            <View className="at-col">
                                协作人员:
                                <Text style={{ fontSize: '0.6em', color: '#CCCCCC' }}>
                                    协作码#备注 以逗号分隔
                                </Text>
                            </View>
                        </View>

                        <View style={{ margin: '5PX 15PX 10PX 16PX' }}>
                            <View style="height:100px" className="at-col">
                                <AtTextarea
                                    value={cocodes}
                                    placeholder="090909#张三,091111#李四"
                                    onChange={(value) => setCocodes(value.replace(/，/, ','))}
                                />
                            </View>
                        </View>
                    </View>
                )}

                <View style="margin:5PX 15PX">
                    <AtButton
                        type="primary"
                        formType="submit"
                        disabled={disableUpdate(
                            {
                                name: defaultName,
                                hosp: defaultHosp,
                                dept: defaultDept,
                                mail: defaultMail,
                                cocodes: defaultCocodes,
                            },
                            {
                                name,
                                hosp,
                                dept,
                                cocodes,
                                mail,
                            }
                        )}
                    >
                        修改
                    </AtButton>
                </View>

                {isAdmin(authority) && (
                    <View style="margin:5PX 15PX">
                        <AtButton type="secondary" onClick={ResetInviteCode}>
                            更新邀请码
                        </AtButton>
                    </View>
                )}
            </AtForm>

            {isUnknown(authority) && (
                <AtModal
                    isOpened={isOpen}
                    onCancel={onModalClose}
                    onClose={onModalClose}
                    closeOnClickOverlay={true}
                >
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

User.config = {
    navigationBarTitleText: '用户信息',
};

User.options = {
    addGlobalClass: true,
};
