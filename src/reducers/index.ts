import { combineReducers } from 'redux';
import counter from './counter';
import patient from './patient';

export default combineReducers({
    counter,
    patient,
});
