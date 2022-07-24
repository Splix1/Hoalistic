export const SET_PLAID = 'SET_PLAID';

export const setPlaid = (plaid) => {
  return {
    type: SET_PLAID,
    plaid,
  };
};

const initialState = {
  linkSuccess: false,
  isItemAccess: true,
  linkToken: '', // Don't set to null or error message will show up briefly when site loads
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ['transactions'],
  linkTokenError: {
    error_type: '',
    error_code: '',
    error_message: '',
  },
};

export default function plaid(state = initialState, action) {
  switch (action.type) {
    case SET_PLAID: {
      return action.plaid;
    }
    default:
      return state;
  }
}
