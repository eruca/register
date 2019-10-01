import {
    USER_SYNC,
    USER_OPENID,
    USER_HOSP_DEPT_COCODES,
    USER_FORCE_RERENDER,
} from '../constants/user';
import { IAction } from './base';
import { IUserState, ListType } from '../reducers/user';

export function userSync(user: IUserState): IAction {
    return {
        type: USER_SYNC,
        payload: { ...user },
    };
}

export function syncOpenid(openid: string): IAction {
    return {
        type: USER_OPENID,
        payload: { openid },
    };
}

export function syncHospDeptCocodes(
    hosp: string,
    dept: string,
    cocodes: string,
    listType: ListType
): IAction {
    return {
        type: USER_HOSP_DEPT_COCODES,
        payload: { hosp, dept, cocodes, listType },
    };
}

export function forceRerender(): IAction {
    return {
        type: USER_FORCE_RERENDER,
    };
}
