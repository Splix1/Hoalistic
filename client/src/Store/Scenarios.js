export const SET_SCENARIOS = 'SET_SCENARIOS';

export const setScenarios = (scenarios) => {
  return {
    type: SET_SCENARIOS,
    scenarios,
  };
};

export default function scenarios(state = [], action) {
  switch (action.type) {
    case SET_SCENARIOS: {
      return action.scenarios;
    }
    default:
      return state;
  }
}
