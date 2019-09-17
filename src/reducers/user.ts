import { IAction } from '../actions/base';
import { USER_ADD, USER_OPENID, USER_HOSP_DEPT } from '../constants/user';

export interface IUserState {
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
};

export default function user(state = INIT_STATE, action: IAction): IUserState {
    switch (action.type) {
        case USER_ADD:
            return {
                ...state,
                ...action.payload,
            };
        case USER_OPENID:
            return {
                ...state,
                _openid: action.payload.openid,
            };

        case USER_HOSP_DEPT:
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
}
