import { PATIENT_INDEX } from '../constants/patient';
import { IAction } from './base';

// export function add(item: IPatient): IAction {
//     return {
//         type: PATIENT_ADD,
//         payload: { item },
//     };
// }

export function select(
    patient_id: string,
    hospId: string,
    name: string,
    enrolltime: string
): IAction {
    if (!patient_id || !enrolltime || !hospId || !name) {
        throw new Error('patient_id 和 enrolltime、hospId, name 不能为空');
    }

    return {
        type: PATIENT_INDEX,
        payload: { patient_id, enrolltime, hospId, name },
    };
}

export function deselect(): IAction {
    return {
        type: PATIENT_INDEX,
        payload: { patient_id: '', enrolltime: '', hospId: '', name: '' },
    };
}
