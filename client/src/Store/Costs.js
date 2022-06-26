export const SET_COSTS = 'SET_COSTS';

export const setCosts = (costs) => {
  return {
    type: SET_COSTS,
    costs,
  };
};

export default function costs(state = [], action) {
  switch (action.type) {
    case SET_COSTS: {
      return action.costs;
    }
    default:
      return state;
  }
}
