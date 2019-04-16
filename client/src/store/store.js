import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { getTransactionTypes, getAccounts, getBanks, getActiveCurrencies,
  getAppSettings, getAccountStatuses } from './actions/lookupsAction';
import { setUser } from './actions/authActions';

const store = createStore(rootReducer, applyMiddleware(thunk));
store.dispatch(getAppSettings());
store.dispatch(getTransactionTypes());
store.dispatch(getAccounts());
store.dispatch(getBanks());
store.dispatch(getActiveCurrencies());
store.dispatch(getAccountStatuses());
if(localStorage.hasOwnProperty("user")){
  const user = JSON.parse(localStorage.getItem("user"));
  store.dispatch(setUser(user));
}

export default store;
