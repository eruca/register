import { RECORD_INDEX } from '../constants/record';
import { IAction } from './base';

export function selectRecord(record_id: string): IAction {
    if (!record_id) {
        throw new Error('record_id 不能为空');
    }

    return {
        type: RECORD_INDEX,
        payload: { record_id },
    };
}

export function deselectRecord(): IAction {
    return {
        type: RECORD_INDEX,
        payload: { record_id: '' },
    };
}