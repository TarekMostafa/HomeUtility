const initState = {
  user: null,
}

const authReducer = (state=initState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.data
      };
    default:
      return state;
  }
}

export default authReducer;
