import { IPatient } from '../reducers/patient';
import { PATIENT_ADD, PATIENT_INDEX } from '../constants/patient';
import { IAction } from './base';

export function add(item: IPatient): IAction {
    return {
        type: PATIENT_ADD,
        payload: { item },
    };
}

// index: 实际上时_id
export function indexOfPatientSelect(index: string): IAction {
    return {
        type: PATIENT_INDEX,
        payload: { index },
    };
}
