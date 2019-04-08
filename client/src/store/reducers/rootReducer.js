import {combineReducers} from 'redux';
import lookupsReducer from './lookupsReducer';

const rootReducer = combineReducers({
  lookups: lookupsReducer,
})

export default rootReducer;
