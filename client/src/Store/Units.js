export const SET_UNITS = 'SET_UNITS';

export const setUnits = (units) => {
  return {
    type: SET_UNITS,
    units,
  };
};

export default function units(state = [], action) {
  switch (action.type) {
    case SET_UNITS: {
      return action.units;
    }
    default:
      return state;
  }
}
