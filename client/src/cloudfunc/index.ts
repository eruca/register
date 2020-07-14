import Taro, { Dispatch, SetStateAction } from '@tarojs/taro';
import { BaseEventOrig } from '@tarojs/components/types/common';
import { ButtonProps } from '@tarojs/components/types/Button';

import { userSync, syncConnectResult } from '../actions/user';
import { IUserState } from '../reducers/user';

export const removeRecords = ({ result, errMsg }: Taro.cloud.CallFunctionResult) => {
    console.log('result', result, 'errMsg', errMsg);
};

// 云函数成功的处理
export const getContextSuccess = (dispatch: Dispatch<any>) => ({
    result,
    errMsg,
}: Taro.cloud.CallFunctionResult) => {
    console.log('getContext result', result, 'errMsg', errMsg);
    if (!result) {
        console.warn('getContext 返回 空 result');
        return;
    }

    dispatch(syncConnectResult(result['result']));
    if (result['record']) {
        dispatch(userSync(result['record'] as IUserState));
    }
};

// 如果授权成功，就将微信的信息（昵称、图片、地址等）存入数据库
export const authorizeSuccess = (dispatch: Dispatch<any>) => (
    evt: BaseEventOrig<ButtonProps.onGetUserInfoEventDetail>
) => {
    console.log('cb =>', evt);
    dispatch(userSync(evt.detail.userInfo as IUserState));
    Taro.cloud
        .database()
        .collection('users')
        .add({
            data: evt.detail.userInfo,
            success(e) {
                console.log('添加用户 success', e);
                dispatch(syncConnectResult(1));
            },
            fail: console.error,
        });
};

// onAuth 给别人授权，就是输入邀请者协作码、邀请码的操作
export const onAuthSuccess = (
    dispatch: Dispatch<any>,
    setOpen: Dispatch<SetStateAction<boolean>>
) => ({ result, errMsg }: Taro.cloud.CallFunctionResult) => {
    console.log('onAuth', result, 'errMsg', errMsg);
    if (!result) {
        console.warn('onAuth 返回 空数据');
        return;
    }

    setOpen(false);
    Taro.atMessage({
        message: '加入成功, 正在更新数据, 请稍等...',
        type: 'success',
        duration: 1500,
    });

    if (result['success'] === true) {
        Taro.cloud.callFunction({
            name: 'getContext',
            success: getContextSuccess(dispatch),
            fail: console.error,
        });
    } else {
        Taro.atMessage({ message: errMsg || '操作失败', type: 'error' });
    }
};

// export const getPatientsSuccess =
