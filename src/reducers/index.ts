import { combineReducers } from 'redux';
import counter from './counter';
import patients, { IPatientState } from './patient';
import records, { IRecordState } from './records';

export interface IReducers {
    counter: any;
    patients: IPatientState;
    records: IRecordState;
}

export default combineReducers({
    counter,
    patients,
    records,
});
