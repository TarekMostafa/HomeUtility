const initState = {
  transactionTypes: null,
  accounts: null,
  banks: null,
  accountStatuses: ['ACTIVE', 'CLOSED'],
}

const lookupReducer = (state=initState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
}

export default lookupReducer;
