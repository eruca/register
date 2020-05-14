import {
    USER_SYNC,
    USER_HOSP_DEPT_COCODES,
    USER_FORCE_RERENDER,
    USER_SYNC_VIEWSET,
    USER_CONNECT_RESULT,
} from '../constants/user';
import { IAction } from './base';
import { IUserState, ListType } from '../reducers/user';

export function userSync(user: IUserState): IAction {
    return {
        type: USER_SYNC,
        payload: { ...user },
    };
}

// result 1: 代表已存在的客户 2 代表 不存在
export function syncConnectResult(result: 1 | 2): IAction {
    return {
        type: USER_CONNECT_RESULT,
        payload: { first_connected_result: result },
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
