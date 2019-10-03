import { IAction } from '../actions/base';
import {
    USER_SYNC,
    USER_OPENID,
    USER_HOSP_DEPT_COCODES,
    USER_FORCE_RERENDER,
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
    authority: Authority.Crew,
    force_rerender: 0,
    listType: ListType.Mine,
};

export default function user(state = INIT_STATE, action: IAction): IUserState {
    switch (action.type) {
        case USER_SYNC:
            return {
                ...state,
                ...action.payload,
            };
        case USER_OPENID:
            return {
                ...state,
                _openid: action.payload.openid,
            };

        case USER_HOSP_DEPT_COCODES:
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
