import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { getTransactionTypes, getAccounts, getBanks, getActiveCurrencies } from './actions/lookupsAction';

const store = createStore(rootReducer, applyMiddleware(thunk));
store.dispatch(getTransactionTypes());
store.dispatch(getAccounts());
store.dispatch(getBanks());
store.dispatch(getActiveCurrencies());

export default store;
