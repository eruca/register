import { PATIENT_INDEX } from '../constants/patient';
import { IAction } from './base';

// export function add(item: IPatient): IAction {
//     return {
//         type: PATIENT_ADD,
//         payload: { item },
//     };
// }

export function select(patient_id: string, enrolltime: string): IAction {
    if (!patient_id || !enrolltime) {
        throw new Error('patient_id 和 enrolltime 不能为空');
    }

    return {
        type: PATIENT_INDEX,
        payload: { patient_id, enrolltime },
    };
}

export function deselect(): IAction {
    return {
        type: PATIENT_INDEX,
        payload: { patient_id: '', enrolltime: '' },
    };
}
