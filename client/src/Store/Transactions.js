export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

export const setTransactions = (transactions) => {
  return {
    type: SET_TRANSACTIONS,
    transactions,
  };
};

export default function transactions(state = [], action) {
  switch (action.type) {
    case SET_TRANSACTIONS: {
      return action.transactions;
    }
    default:
      return state;
  }
}
