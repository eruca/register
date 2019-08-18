import { Record } from '../reducers/records';
import { RECORD_ADD, RECORD_INDEX } from '../constants/record';
import { IAction } from './base';

export function add_record(record: Record): IAction {
    return {
        type: RECORD_ADD,
        payload: { record },
    };
}

export function indexOfPatientRecord(index?: number): IAction {
    return {
        type: RECORD_INDEX,
        payload: { index: index !== undefined ? index : -1 },
    };
}
