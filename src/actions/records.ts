import { RECORD_INDEX, RECORD_FORCE_REANDER } from '../constants/record';
import { IAction } from './base';

// export function add_record(record: Record): IAction {
//     return {
//         type: RECORD_ADD,
//         payload: { record },
//     };
// }

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

export function forceRender(): IAction {
    console.log("force render");
    return {
        type: RECORD_FORCE_REANDER,
    };
}
