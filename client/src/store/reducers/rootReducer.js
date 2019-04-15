import {combineReducers} from 'redux';
import lookupsReducer from './lookupsReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  lookups: lookupsReducer,
  auth: authReducer
})

export default rootReducer;
