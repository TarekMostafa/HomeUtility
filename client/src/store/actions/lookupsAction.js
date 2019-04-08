import TransactionTypeRequest from '../../axios/TransactionTypeRequest';
import AccountRequest from '../../axios/AccountRequest';
import BankRequest from '../../axios/BankRequest';
import CurrencyRequest from '../../axios/CurrencyRequest';

export const getTransactionTypes = () => {
  return (dispatch, getState) => {
    TransactionTypeRequest.getTransactionTypesForDropDown()
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
