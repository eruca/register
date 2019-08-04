import { IItem } from '../reducers/patient';
import { PATIENT_ADD, PATIENT_INDEX } from '../constants/patient';
import { IAction } from './base';

export function add(item: IItem): IAction {
    return {
        type: PATIENT_ADD,
        payload: { item },
    };
}

export function indexOfPatientSelect(index?: number): IAction {
    return {
        type: PATIENT_INDEX,
        payload: { index },
    };
}
