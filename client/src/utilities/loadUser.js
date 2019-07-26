import interceptor from '../axios/Interceptor';
import store from '../store/store';
import { getTransactionTypes, getAccounts, getBanks, getActiveCurrencies,
  getAppSettings, getAccountStatuses, getRelatedTypes } from '../store/actions/lookupsAction';
  import { setUser } from '../store/actions/authActions';

export default (user) => {
  interceptor.setInterceptor(user.userToken);
  store.dispatch(getTransactionTypes());
  store.dispatch(getAccounts());
  store.dispatch(getBanks());
  store.dispatch(getActiveCurrencies());
  store.dispatch(getAppSettings());
  store.dispatch(getAccountStatuses());
  store.dispatch(getRelatedTypes());
  store.dispatch(setUser(user));
  localStorage.setItem("user", JSON.stringify(user));
}
