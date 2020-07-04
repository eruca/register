import { combineReducers } from 'redux';
import patients, { IPatientState } from './patient';
import records, { IRecordState } from './records';
import user, { IUserState } from './user';
import projects, { IProjects } from './projects';

export interface IReducers {
    patients: IPatientState;
    records: IRecordState;
    user: IUserState;
    projects: IProjects;
}

export default combineReducers({
    patients,
    records,
    user,
    projects,
});
