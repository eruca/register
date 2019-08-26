import { combineReducers } from 'redux';
import patients, { IPatientState } from './patient';
import records, { IRecordState } from './records';
import user, { IUserState } from './user';

export interface IReducers {
    patients: IPatientState;
    records: IRecordState;
    user: IUserState;
}

export default combineReducers({
    patients,
    records,
    user,
});
