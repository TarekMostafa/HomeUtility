const initState = {
  appSettings: null,
  transactionTypes: null,
  accounts: null,
  banks: null,
  accountStatuses: null,
  activeCurrencies: null,
  relatedTypes: null,
  billStatuses: null,
  billFrequencies: null,
  bills: null,
}

const lookupReducer = (state=initState, action) => {
  switch (action.type) {
    case 'SET_APP_SETTINGS':
      return {
        ...state,
        appSettings: action.data
      };
    case 'SET_TRANSACTION_TYPES':
      return {
        ...state,
        transactionTypes: action.data
      };
    case 'SET_ACCOUNTS':
      return {
        ...state,
        accounts: action.data
      };
    case 'SET_BILLS' :
      return {
        ...state,
        bills: action.data
      }
    case 'SET_BANKS':
      return {
        ...state,
        banks: action.data
      };
    case 'SET_ACTIVE_CURRENCIES':
      return {
        ...state,
        activeCurrencies: action.data
      };
    case 'SET_ACCOUNT_STATUSES':
      return {
        ...state,
        accountStatuses: action.data
      };
    case 'SET_BILL_STATUSES':
      return {
        ...state,
        billStatuses: action.data
      };
    case 'SET_BILL_FREQUENCIES':
      return {
        ...state,
        billFrequencies: action.data
      };
    case 'SET_RELATED_TYPES':
      return {
        ...state,
        relatedTypes: action.data
      }
    default:
      return state;
  }
}

export default lookupReducer;
