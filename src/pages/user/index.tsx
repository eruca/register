import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtInput, AtButton, AtMessage } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import { IReducers } from '../../reducers';
import { usersCollection } from '../../utils/db';
import { syncHospDept } from '../../actions/user';

const dispatch = useDispatch();

export default function User() {
    const { dept: defaultDept, hosp: defaultHosp, _id } = useSelector(
        (state: IReducers) => state.user
    );
    const [dept, setDept] = useState(defaultDept);
    const [hosp, setHosp] = useState(defaultHosp);

    const onSubmit = () => {
        usersCollection.doc(_id).update({
            data: { dept, hosp },
            success(res) {
                console.log('success', res);
                dispatch(syncHospDept(hosp, dept));
                Taro.atMessage({ message: '修改成功', type: 'success' });
            },
            fail: console.error,
        });
    };

    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit}>
                <AtInput
                    title="医院"
                    name="hosp"
                    value={hosp}
                    onChange={(e: string) => setHosp(e)}
                />
                <AtInput
                    title="科室"
                    name="dept"
                    value={dept}
                    onChange={(e: string) => setDept(e)}
                />
                <AtButton type="primary" formType="submit">
                    修改
                </AtButton>
            </AtForm>
        </View>
    );
}

User.config = {
    navigationBarTitleText: '用户信息',
};
