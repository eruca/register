import { PATIENT_INDEX } from '../constants/patient';
import { IAction } from './base';

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
