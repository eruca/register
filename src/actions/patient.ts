import { PATIENT_INDEX, PATIENT_TOTAL, PATIENT_CURRENT } from '../constants/patient';
import { IAction } from './base';

// export function add(item: IPatient): IAction {
//     return {
//         type: PATIENT_ADD,
//         payload: { item },
//     };
// }

export function select(
    patient_id: string,
    _openid: string,
    hospId: string,
    name: string,
    enrolltime: string
): IAction {
    if (!patient_id || !enrolltime || !hospId || !name || !_openid) {
        throw new Error('patient_id 和 enrolltime、hospId, name 不能为空');
    }

    return {
        type: PATIENT_INDEX,
        payload: { patient_id, enrolltime, hospId, name, _openid },
    };
}

export function deselect(): IAction {
    return {
        type: PATIENT_INDEX,
        payload: { patient_id: '', enrolltime: '', hospId: '', name: '' },
    };
}

export function patient_total(
    total: number,
    patient_date_total: number,
    patient_result_total: number
) {
    return {
        type: PATIENT_TOTAL,
        payload: { total, patient_date_total, patient_result_total },
    };
}

export function patient_current(currentPage: number) {
    return {
        type: PATIENT_CURRENT,
        payload: { currentPage },
    };
}
