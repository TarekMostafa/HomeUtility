import TransactionTypeRequest from '../../axios/TransactionTypeRequest';
import AccountRequest from '../../axios/AccountRequest';
import BankRequest from '../../axios/BankRequest';
import CurrencyRequest from '../../axios/CurrencyRequest';
import AppSettingsRequest from '../../axios/AppSettingsRequest';
import RelatedTypeRequest from '../../axios/RelatedTypeRequest';

export const getAppSettings = () => {
  return (dispatch, getState) => {
    AppSettingsRequest.getAppSettings()
    .then( (appSettings) => dispatch({type: "SET_APP_SETTINGS", data: appSettings}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}

export const getTransactionTypes = () => {
  return (dispatch, getState) => {
    TransactionTypeRequest.getTransactionTypes()
    .then( (transactionTypes) => dispatch({type: "SET_TRANSACTION_TYPES", data: transactionTypes}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}

export const getAccounts = () => {
  return (dispatch, getState) => {
    AccountRequest.getAccountsForDropDown()
    .then( (accounts) => dispatch({type: "SET_ACCOUNTS", data: accounts}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}

export const getAccountStatuses = () => {
  return (dispatch, getState) => {
    AccountRequest.getAccountStatuses()
    .then( (accountStatuses) => dispatch({type: "SET_ACCOUNT_STATUSES", data: accountStatuses}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}

export const getBanks = () => {
  return (dispatch, getState) => {
    BankRequest.getBanks()
    .then( (banks) => dispatch({type: "SET_BANKS", data: banks}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}

export const getActiveCurrencies = () => {
  return (dispatch, getState) => {
    CurrencyRequest.getCurrencies("YES")
    .then( (currencies) => dispatch({type: "SET_ACTIVE_CURRENCIES", data: currencies}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}

export const getRelatedTypes = () => {
  return (dispatch, getState) => {
    RelatedTypeRequest.getRelatedTypes()
    .then( (relatedTypes) => dispatch({type: "SET_RELATED_TYPES", data: relatedTypes}) )
    .catch( () => dispatch({type: "ERROR"}) )
  }
}
