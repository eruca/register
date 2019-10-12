import {
    USER_SYNC,
    USER_OPENID,
    USER_HOSP_DEPT_COCODES,
    USER_FORCE_RERENDER,
    USER_SYNC_VIEWSET,
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

export function syncViewSet(listType: ListType, timeOption: number, resultOption: number): IAction {
    return {
        type: USER_SYNC_VIEWSET,
        payload: { listType, timeOption, resultOption },
    };
}

export function syncHospDeptCocodes(hosp: string, dept: string, cocodes: string): IAction {
    return {
        type: USER_HOSP_DEPT_COCODES,
        payload: { hosp, dept, cocodes },
    };
}

export function forceRerender(): IAction {
    return {
        type: USER_FORCE_RERENDER,
    };
}
