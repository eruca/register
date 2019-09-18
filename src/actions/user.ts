import { USER_ADD, USER_OPENID, USER_HOSP_DEPT, USER_FORCE_RERENDER } from '../constants/user';
import { IAction } from './base';
import { IUserState } from '../reducers/user';

export function userSync(user: IUserState): IAction {
    return {
        type: USER_ADD,
        payload: { ...user },
    };
}

export function syncOpenid(openid: string): IAction {
    return {
        type: USER_OPENID,
        payload: { openid },
    };
}

export function syncHospDept(hosp: string, dept: string): IAction {
    return {
        type: USER_HOSP_DEPT,
        payload: { hosp, dept },
    };
}

export function forceRerender(): IAction {
    return {
        type: USER_FORCE_RERENDER,
    };
}
