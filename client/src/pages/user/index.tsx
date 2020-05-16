import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtForm, AtInput, AtButton, AtMessage, AtTextarea } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import { IReducers } from '../../reducers';
import { isAdmin, IUserState } from '../../reducers/user';
import { syncHospDeptCocodes, userSync, forceRerender } from '../../actions/user';

type EqualType = {
    name: string;
    hosp: string;
    dept: string;
    mail: string;
    cocodes: string;
};

// email正则
const mail_regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

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

export default function User() {
    const dispatch = useDispatch();
    const {
        _id,
        dept: defaultDept,
        hosp: defaultHosp,
        name: defaultName,
        mail: defaultMail,
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

    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getContext',
            success(res) {
                console.log('getContext', res);
                dispatch(userSync((res.result as any)['record'] as IUserState));
            },
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
                    onBlur={(e) => {
                        if (!mail_regexp.test(mail)) {
                            Taro.atMessage({
                                message: '邮箱密码格式错误,示例:81233890@qq.com',
                                type: 'error',
                            });
                        }
                    }}
                />
                <AtInput
                    title="协作码:"
                    name="cocode"
                    value={cocode ? cocode : ''}
                    disabled={true}
                    onChange={() => {}}
                />
                {isAdmin(authority) && (
                    <AtInput
                        title="邀请码:"
                        name="invite_code"
                        value={invite_code}
                        disabled={true}
                        onChange={() => {}}
                    />
                )}
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
        </View>
    );
}

User.config = {
    navigationBarTitleText: '用户信息',
};

User.options = {
    addGlobalClass: true,
};
