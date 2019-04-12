const initState = {
  appSettings: null,
  transactionTypes: null,
  accounts: null,
  banks: null,
  accountStatuses: ['ACTIVE', 'CLOSED'],
  activeCurrencies: null,
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
    default:
      return state;
  }
}

export default lookupReducer;
