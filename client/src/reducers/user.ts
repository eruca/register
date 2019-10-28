import { IAction } from '../actions/base';
import {
    USER_SYNC,
    // USER_OPENID,
    USER_HOSP_DEPT_COCODES,
    USER_FORCE_RERENDER,
    USER_SYNC_VIEWSET,
    USER_CONNECT_RESULT,
} from '../constants/user';

// Authority 代表权限系统
export enum Authority {
    Unknown,
    Crew,
    Admin,
    Root,
}

export function isUnknown(auth: Authority): boolean {
    return auth === Authority.Unknown;
}

export function isCrew(auth: Authority): boolean {
    return auth >= Authority.Crew;
}

export function isAdmin(auth: Authority): boolean {
    return auth >= Authority.Admin;
}

export function isRoot(auth: Authority): boolean {
    return auth >= Authority.Root;
}

export enum ListType {
    Mine,
    Group,
    All,
}

export interface IUser {
    _id: string;
    _openid: string;
    avatarUrl: string;
    city: string;
    country: string;
    gender: number;
    language: string;
    nickName: string;
    province: string;
    hosp: string;
    dept: string;
    is_super: boolean;

    invite_code?: string; // 邀请码
    cocode: string; // 协作码
    cocodes: string;
    authority: Authority;
}

export interface IUserState extends IUser {
    force_rerender: number;
    listType: ListType;
    timeOption: number;
    resultOption: number;
    first_connected_result: number; // 0代表未建立，1代表获取用户成功2.代表没有该用户
}

const INIT_STATE: IUserState = {
    _id: '',
    _openid: '',
    avatarUrl: '',
    city: '',
    country: '',
    gender: 0,
    language: 'zh_CN',
    nickName: '',
    province: '',
    hosp: '',
    dept: '',
    is_super: false,
    cocode: '',
    cocodes: '',
    authority: Authority.Unknown,
    force_rerender: 0,
    listType: ListType.Mine,
    timeOption: 0,
    resultOption: 0,
    first_connected_result: 0,
};

export default function user(state = INIT_STATE, action: IAction): IUserState {
    switch (action.type) {
        case USER_SYNC:
            return {
                ...state,
                ...action.payload,
            };
        case USER_CONNECT_RESULT:
            return {
                ...state,
                first_connected_result: action.payload.first_connected_result,
            };

        case USER_HOSP_DEPT_COCODES:
            return {
                ...state,
                ...action.payload,
            };

        case USER_SYNC_VIEWSET:
            return {
                ...state,
                ...action.payload,
            };

        case USER_FORCE_RERENDER:
            return {
                ...state,
                force_rerender: state.force_rerender + 1,
            };

        default:
            return state;
    }
}
